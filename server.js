'use strict';

// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const _ = require('lodash');
const dashbot = require('dashbot')(process.env.DASHBOT_API_KEY).twitter;
const TwitterBot = require('./app/twitter-bot.js');

var dashbotTwitterBot = new TwitterBot();
dashbotTwitterBot.speak();

app.use(bodyParser.json()); // for parsing application/json
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// the Twitter DM webhook CRC response
app.get("/webhooks/twitter", function (req, res) {
  const crcToken = _.get(req, 'query.crc_token') || '';
  const appKey = process.env.TWITTER_CONSUMER_SECRET;
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', appKey);
  hmac.update(crcToken);
  const responseToken = 'sha256=' + hmac.digest('base64');
  const jsonResponse = { response_token: responseToken };
  console.log('TWITTER CRC GET', req.query);
  res.send(jsonResponse)
});

app.post('/webhooks/twitter', function (req, res) {
  const twitterMessage = req.body;
  const jsonStuff = JSON.stringify(twitterMessage, null, 2);
  const directMessageEvents = _.get(twitterMessage, 'direct_message_events');
  const directMessage = _.first(directMessageEvents);
  const senderUserId = _.get(directMessage, 'message_create.sender_id');
  const recipientUserId = _.get(directMessage, 'message_create.target.recipient_id');
  const incoming = senderUserId !== process.env.TWITTER_USER_ID;
  const userId = incoming ? senderUserId : recipientUserId;
  const messageText = _.get(directMessage, 'message_create.message_data.text');

  // if it's incoming, then send a message back
  if (incoming) {
    console.log('incoming', messageText, senderUserId);
    if (messageText === 'buttons') {
      dashbotTwitterBot.sendDirectMessageWithButtons(senderUserId);
    } else if (messageText === 'quick') {
      dashbotTwitterBot.sendDirectMessageWithQuickReplies(senderUserId);
    } else if (messageText === 'image') {
      dashbotTwitterBot.sendDirectMessageWithImage(senderUserId);
    } else if (messageText === 'hello') {
      dashbotTwitterBot.sendDirectMessageText(senderUserId, 'Hello! How are you?');      
    } else {
      dashbotTwitterBot.sendDirectMessageText(senderUserId, 'Hello! You said: ' + messageText);      
    }
  }
  
  const dashbotMessageJson = {
    userId: userId,
    text: messageText,
    platformJson: twitterMessage,
  }
  // console.log('TWITTER POST', dashbotMessageJson);
  if (incoming) {
    dashbot.logIncoming(dashbotMessageJson);
  } else {
    dashbot.logOutgoing(dashbotMessageJson);
  }
  
  res.send('Hello Twitter Post!');
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
