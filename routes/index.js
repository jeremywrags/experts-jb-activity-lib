const multer = require("multer");
var express = require('express');
var fs = require('fs');
var path = require('path')
var router = express.Router();

//Auth requires
const auth = require('http-auth');
const url = require('url');
const request = require('request');

//Database Controllers
const waffleController = require("../controllers/baseline/waffleItem.controller");
const navController = require("../controllers/jblib/nav.controller");
const jbAppController = require("../controllers/jblib/jbApp.controller");
const { jblib } = require("../models");


//Image upload configuration
var storage = multer.memoryStorage();
var upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    if (ext !== '.png') {
         req.fileValidationError = "Forbidden extension must be a png";
         return cb(null, false, req.fileValidationError);
   }
   cb(null, true);
}
})


//Auth setup
const SalesforceClient = require('salesforce-node-client');
var sfdcConfig;
var salesforceAuthUri;
var IsExpert = 'false';

if (process.env.consumerKey) {
  if (process.env.consumerKey.length > 0) {
      sfdcConfig = {
          domain: process.env.sfDomain,
          callbackUrl: process.env.appCallbackUrl,
          consumerKey: process.env.consumerKey,
          consumerSecret: process.env.consumerSecret,
          apiVersion: 'v41.0'
      };
  
  const sfdc = new SalesforceClient(sfdcConfig);
  var salesforceAuthUri = sfdc.auth.getAuthorizationUrl({scope: 'id api'});
  
  }
}

// Check if aloha auth is current
var authCheck = function(req, res, next) {
  if (process.env.EDT_ALOHA == 2) {
      console.log('Aloha: auth not required in this context');                        
      IsExpert = false;
      return next();
  }
  if (process.env.EDT_ALOHA == 0) {
      console.log('Aloha: auth not required in this context');
      IsExpert = true;        
      return next();
  }
  else {                          
      if (req.signedCookies.tsToken) {
          console.log('Aloha: authorization found');                      
          if (req.signedCookies.tsExpert == "true") {           
              console.log('Aloha: verified expert status');           
              IsExpert = true;    
          }
          else {  
              console.log('Aloha: not an expert');
              IsExpert = false;
          }           
          return next();                      
      }
      else {          
          console.log('Aloha: could not find a current auth cookie; redirection to authentication page');
          res.redirect(salesforceAuthUri);
      }
  }
};




router.get('/', authCheck, function(req, res, next) {
  let appName = "JB Activity Library"

  let wafflePromise = waffleController.findAll2();
  let navPromise = navController.findNav();
  let jbAppPromose =  jbAppController.findAll2(req.signedCookies.tsUser);


  Promise.all([wafflePromise, navPromise, jbAppPromose]).then(([waffleItems, navItems, jbApps]) => {
    jbApps.map(app =>{
      const appImage = app.imageData.toString('base64')
      app['imageData'] = appImage
    });     
    res.render('index', { title : appName, appName : appName, waffleItems : waffleItems, navItems : navItems, jbApps : jbApps, UserEmail : req.signedCookies.tsUser, isExpert: req.signedCookies.tsExpert });
  });  
});

router.get('/icon/:appKey', function(req, res, next) {
  
  let jbAppPromose =  jbAppController.findOne(req.params.appKey);
  Promise.all([jbAppPromose]).then(([jbApp]) => {    
    res.send(Buffer.from(jbApp.imageData.toString('base64'), "base64"));
  });  
});

router.post('/app/update', function(req, res, next) {
  jbAppController.update(req, res);
});

router.post('/app/delete', function(req, res, next) {
  jbAppController.delete(req, res);  
});

router.post('/image/uploadfile', upload.single('myFile'), (req, res, next) => {
   
  let jbApp = {
    name: req.body.appName,    
    description: req.body.description,    
    imageType: req.file.mimetype, 
    imageName: req.file.originalname,
    imageData: req.file.buffer,
    createdBy: req.signedCookies.tsUser
  }
 
    console.log(jbAppController.create(req, res))
    //res.redirect(req.get('referer'));
  })




module.exports = router;
