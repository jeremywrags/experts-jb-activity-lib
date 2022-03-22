var express = require('express');
var request = require("request");
var bodyParser = require("body-parser");
var router = express.Router();
const uuidv1 = require('uuid/v1');

var ci = process.env.CLIENTID;
var cs = process.env.CLIENTSECRET;
var tssd = process.env.TSSD;
var mid = process.env.MID;


// Define post route
router.post('/', function(req, res) {
  var subscriberKey = '';
  var emailAddress = '';
  var tsdKey = 'tapi-ena-welcome';
  var uuid = '';
  //  Parse request body and set variables
  emailAddress = req.body.emailAddress;
  subscriberKey = req.body.emailAddress;

  // Start Get Auth Token
  // Set request options
  var tokenOptions = {
    method: 'POST',
    url: 'https://' + tssd + '.auth.marketingcloudapis.com/v2/token',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      grant_type: 'client_credentials',
      client_id: ci,
      client_secret: cs,
      account_id: mid
    },
    json: true
  };

  // Initiate token request
  request(tokenOptions, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      sendEmail(response.body.access_token);
      console.log("token: " + response.body.access_token)
    } else {
      console.log("error: " + error);
      res.send({
        'status': 'error',
        'message': 'Token Request Error: ' + error
      });
    }
  });
  // End Get Auth Token

  // Start Send Email
  function sendEmail(token) {
    uuid = uuidv1(); // unique id needed for trigger send URL
    emailPayload = '{"definitionKey": "' + tsdKey + '", "recipient": {"contactKey": "' + subscriberKey + '", "to": "' + emailAddress + '"}}'
    var tsdUrl = 'https://' + tssd + '.rest.marketingcloudapis.com/messaging/v1/email/messages/' + uuid;
    var emailOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      url: tsdUrl,
      body: JSON.parse(emailPayload),
      json: true
    };
    request(emailOptions, function(error, response, body) {
      if (!error && response.statusCode == 202) {
        res.send({
          'status': 'success',
          'requestId': response.body.requestId
        });
      } else {
        res.send({
          'status': 'error',
          'message': 'Triggered Send Error: ' + response.body.message
        });
      }
    });
  }
  // End Send Email

});

module.exports = router;
