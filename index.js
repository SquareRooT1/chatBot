var express = require('express');
var bodyParser = require('body-parser');
var request = require("request");

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === "my_verify_token_for_gg") {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.post('/webhook', function (req, res) {
  var data = req.body;
  console.log("data : ", data);
  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    res.sendStatus(200);
  }
});

function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:",
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {

    // If we receive a text message, check to see if it matches a keyword
    // and send back the example. Otherwise, just echo the text we received.
    sendGenericMessage(senderID);

  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}

function sendGenericMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "Günün Fırsatı",
            subtitle: "Samsung Galaxy Tab 3 Lite T113 8GB 7",
            item_url: "http://urun.gittigidiyor.com/bilgisayar-tablet/samsung-galaxy-tab-3-lite-t113-8gb-7-288701975",
            image_url: "https://mcdn01.gittigidiyor.net/28870/tn50/288701975_tn50_0.jpg?1501583670",
            buttons: [{
              type: "web_url",
              url: "http://urun.gittigidiyor.com/bilgisayar-tablet/samsung-galaxy-tab-3-lite-t113-8gb-7-288701975",
              title: "Şimdi Görüntüle"
            }, {
              type: "postback",
              title: "Onayla",
              payload: "Success for first item",
            }],
          }, {
            title: "Takip Ettiğin Ürün",
            subtitle: "APPLE IPHONE 6 32GB",
            item_url: "http://urun.gittigidiyor.com/cep-telefonu-ve-aksesuar/apple-iphone-6-32gb-cep-telefonu-apple-turkiye-garantili-280585496",
            image_url: "https://mcdn01.gittigidiyor.net/28058/tn50/280585496_tn50_0.jpg?1501583670",
            buttons: [{
              type: "web_url",
              url: "http://urun.gittigidiyor.com/cep-telefonu-ve-aksesuar/apple-iphone-6-32gb-cep-telefonu-apple-turkiye-garantili-280585496",
              title: "Şimdi Görüntüle"
            }, {
              type: "postback",
              title: "Onayla",
              payload: "Success for second item",
            }],
            quick_replies : [{
              content_type:"text",
              title:"Onayla",
              payload: "Confirm_Item"
            },{
              content_type:"text",
              title:"Reddet",
              payload: "Refuse_Item"
            }]
          }]
        }
      }
    }

  };

  callSendAPI(messageData);
}

function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}


function callSendAPI(messageData) {

  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: "EAAJYa59NZC74BAFXZB9Q7Q0k3tcsp6lFq79dZCNVQMmyHtZCDzIRdgZCcNx7eWJYnk8nZCePyR3NBGWZBM5Fo961SwHYZCZBV7txMTu5squlpEbrVOkPtEtLaZAggCNpgny5SGTPJnxuqS9R9BQN6aRAJBg7SufSkr8JOA1szMCpTlHgZDZD" },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s",
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });
}
