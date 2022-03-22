var express = require('express');
const https = require('https');
var request = require("request");
var uuidv1 = require('uuid/v1');
var app = express();

const SalesforceClient = require('salesforce-node-client');

const sfdcConfig = {
    domain: process.env.sfDomain,
    callbackUrl: process.env.appCallbackUrl,
    consumerKey: process.env.consumerKey,
    consumerSecret: process.env.consumerSecret,
    apiVersion: 'v41.0'
};
app.get('/callback', function(req, res) {
    const sfdc = new SalesforceClient(sfdcConfig);
    var uri = sfdc.auth.getAuthorizationUrl({scope: 'id%20api'});
    sfdc.auth.authenticate({'code': req.query.code}, function(error, payload) {             
        if(error) {
            console.log('Aloha: authorization failed');
            console.log(error);
            res.redirect('/error.html');
        }
        else if(payload) {
            console.log('Aloha: auth succeeded');
            console.log(payload);           
                                                
            sfdc.data.getLoggedUser(payload, function (errorL, userDataL) {                             
                console.log(userDataL);         
                if (!errorL) {                  
                    
                    // Set user cookies
                    res.cookie('tsToken', Date.now(), {overwrite: true, signed: true});                                                                                                 
                    res.cookie('tsUser', JSON.parse(userDataL).email, {overwrite: true, signed: true});                                     
                    res.cookie('tsUserName', JSON.parse(userDataL).display_name, {overwrite: true, signed: true});                                     
                    
                    // Get IsExpert flag                                
                    try {
                        var getOptions = {
                            hostname: 'mcseexperts.my.salesforce.com',
                            path: '/services/data/v41.0/sobjects/User/' + JSON.parse(userDataL).user_id + '?fields=IsExpert__c',
                            headers: {              
                                Authorization: 'Bearer ' + payload.access_token
                            }
                        }                   
                            
                        https.get(getOptions, (response) => {
                            var IsExpertResult = '';
                            response.on('data', function (chunk) {
                                IsExpertResult += chunk;
                            });
                            response.on('end', function () {                            
                                console.log(IsExpertResult);                                
                                res.cookie('tsExpert', JSON.parse(IsExpertResult).IsExpert__c, {overwrite: true, signed: true});                                                    
                                res.redirect('/');
                            });
                        });
                    }
                    catch {
                        res.redirect('/');
                    }
                }               
            });     
        }
    });
});
module.exports = app;