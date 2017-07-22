'use strict';

var request = require('request')

class TwitterBot {
  constructor() {
    this.twitter_id = process.env.TWITTER_USER_ID;
  }

  speak() {
    console.log('Hello! I am the twitter bot', this.twitter_id);
    return this;
  }
  
  sendDirectMessage(dm_params) {
    var twitter_oauth = {
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      token: process.env.TWITTER_ACCESS_TOKEN,
      token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    }
    // request options
    var request_options = {
      url: 'https://api.twitter.com/1.1/direct_messages/events/new.json',
      oauth: twitter_oauth,
      json: true,
      headers: {
        'content-type': 'application/json'
      },
      body: dm_params
    };

    // POST request to send Direct Message
    request.post(request_options, function (error, response, body) {
      console.log('POST body', body);
      return body;
    });
  }
  
  sendDirectMessageWithQuickReplies(recipientId) {
    // direct message request body
    var dm_params = {
      "event": {
        "type": "message_create",
        "message_create": {
          "target": {
            "recipient_id": recipientId
          },
          "message_data": {
            "text": "What's your favorite type of bird?",
            "quick_reply": {
              "type": "options",
              "options": [
                {
                  "label": "Red Bird",
                  "description": "A description about the red bird.",
                  "metadata": "external_id_1"
                },
                {
                  "label": "Blue Bird",
                  "description": "A description about the blue bird.",
                  "metadata": "external_id_2"
                },
                {
                  "label": "Black Bird",
                  "description": "A description about the black bird.",
                  "metadata": "external_id_3"
                },
                {
                  "label": "White Bird",
                  "description": "A description about the white bird.",
                  "metadata": "external_id_4"
                }
              ]
            }
          }
        }
      }
    }
    this.sendDirectMessage(dm_params);
    return;
  }

  sendDirectMessageWithButtons(recipientId) {
    // direct message request body
    var dm_params = {
      "event": {
        "type": "message_create",
        "message_create": {
          "target": {
            "recipient_id": recipientId
          },
          "message_data": {
            "text": "This is an example of what a message looks like as a card, with buttons (links) below.",
            "ctas": [
              {
                "type": "web_url",
                "label": "Dashbot.io",
                "url": "https://www.dashbot.io"
              },
              {
                "type": "web_url",
                "label": "Dashbot Twitter Documentation",
                "url": "https://www.dashbot.io/sdk/twitter"
              },
              {
                "type": "web_url",
                "label": "Dennis Yang Dot Com",
                "url": "https://www.dennisyang.com"
              }
            ]
          }
        }
      }
    }
    this.sendDirectMessage(dm_params);
    return;
  }
  
  sendDirectMessageWithImage(recipientId) {
    // direct message request body
    var dm_params = {
      "event": {
        "type": "message_create",
        "message_create": {
          "target": {
            "recipient_id": recipientId
          },
          "message_data": {
            "text": "Hello World!",
            "attachment": {
              "type": "media",
              "media": {
                "id": "888472458788872200"
              }
            }
          }
        }
      }
    }
    this.sendDirectMessage(dm_params);
    return;
  }
  
  sendDirectMessageText(recipientId, messageText) {
    // direct message request body
    var dm_params = {
      "event": {
        "type": "message_create",
        "message_create": {
          "target": {
            "recipient_id": recipientId
          },
          "message_data": {
            "text": messageText
          }
        }
      }
    }
    this.sendDirectMessage(dm_params);
    return;
  }
  
  processMessage(message) {
    return;
  }
}

module.exports = TwitterBot;
