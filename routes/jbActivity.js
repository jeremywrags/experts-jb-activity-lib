var express = require('express');
const path = require('path');
var fs = require('fs');

const configJSON = require('../activities/restActivity/config/config-json');
var request = require('request');
const { json } = require('express/lib/response');


var router = express.Router();

// setup config.json route
router.get('/restActivity/:activityName/config.json', function (req, res) {
  // Journey Builder looks for config.json when the canvas loads.
  // We'll dynamically generate the config object with a function
  return res.status(200).json(configJSON(req));
});

// setup index.html route
router.get('/restActivity/:activityName/index.html', function (req, res) {
  // you can use your favorite templating library to generate your html file.
  // this example keeps things simple and just returns a static file
  return res.sendFile('index.html', { root: 'activities/restActivity/html'});
});

// setup index.html route
router.get('/restActivity/:activityName/src/restActivity.js', function (req, res) {
  // you can use your favorite templating library to generate your html file.
  // this example keeps things simple and just returns a static file
  return res.sendFile('restActivity.js', { root: 'activities/restActivity/src'});
});

router.get('/restActivity/:activityName/src/postmonger.js', function (req, res) {
  // you can use your favorite templating library to generate your html file.
  // this example keeps things simple and just returns a static file
  return res.redirect("/postmonger/postmonger.js")
});

router.get('/restActivity/:activityName/images/icon.svg', function (req, res) {
  // you can use your favorite templating library to generate your html file.
  // this example keeps things simple and just returns a static file
  //return res.sendFile('icon.svg', { root: 'activities/restActivity/images'});
  return res.sendFile('icon.png', { root: `public/images/${req.params.activityName}`});

});

router.get('/restActivity/:activityName/images/icon.png', function (req, res) {
  // you can use your favorite templating library to generate your html file.
  // this example keeps things simple and just returns a static file
  //return res.sendFile('icon.png', { root: 'activities/restActivity/images'});  
  return res.sendFile('icon.png', { root: `public/images/${req.params.activityName}`});
});

router.get('/restActivity/:activityName/images/', function (req, res) {
  //Check to see if the SVG is present as it is the preferred image. if not go to the png. 
  //if there is no ong then use the default icon

  const path = `public/images/${req.params.activityName}`
  if(fs.existsSync( path + "/icon.svg")){
    return res.sendFile('icon.svg', { root: `public/images/${req.params.activityName}`});
  }else if(fs.existsSync( path + "/icon.png")){
    return res.sendFile('icon.png', { root: `public/images/${req.params.activityName}`});
  }else{
    return res.sendFile('icon.png', { root: 'activities/restActivity/images'});  
  }

});

router.get('/restActivity/:activityName', function(req, res, next) {
  let name = req.params.activityName;
  res.render('restActivity', { title: 'This is the ' + name + " activity" });
});

router.post('/restActivity/:activityName/save', function (req, res) {
  console.log('debug: /modules/custom-request/save');
  return res.status(200).json({});
});

router.post('/restActivity/:activityName/publish', function (req, res) {
  console.log('debug: /modules/custom-request/publish');
  return res.status(200).json({});
});

router.post('/restActivity/:activityName/validate', function (req, res) {
  console.log('debug: /modules/custom-request/validate');
  return res.status(200).json({});
});

//This is the route that gets called when journey builder executes an activity for the injected contact.
router.post('/restActivity/:activityName/execute', function (req, res) {
  console.log("---------------This is the JB Activity execute Route----------------");
  console.log("req.body", JSON.stringify(req.body)); 
  console.log("---------------End JB Activity execute Route----------------");
  
  

  try{            
  
    let url =     getInArgument(req.body,"endpointURL");
    let method =  getInArgument(req.body,"httpVerb");
    let ck = getContactKey(req.body);
    //the Body will contain 2 elements the Schema that will be returned to JB and the poperties to send
    //to the endpoint. We DO NOT need to send the schema to the endpoint so we will extract the EndpointArguments
    let jsonBody = getInArgument(req.body,"jsonBody").EndpointArguments;    
    

    var options = {
      'method': method ,
      'url': url,
      'headers': {
        'Content-Type': 'application/json'
      },
      body: jsonBody
    };

    request(options, function (error, response) {
      if (error){
        throw new Error(error);
      } 
      console.log("---------------Raw response body from the API----------------");
      console.log(response.body);      
      console.log("---------------End Raw response body from the API----------------");
      
      let responseObject =  JSON.parse(response.body);
      
      console.log("---------------Response Object being returned to JB----------------");
      console.log('Response Object:', JSON.stringify(responseObject));
      console.log("---------------End Response Object being returned to JB----------------");
      return res.status(200).json(responseObject);    
    }); 
       
  }catch(err){
    console.log(err)
    return res.status(200).json({"error" : "something went wrong"}); 
  }
});

// Find the in argument
function getInArgument(req, k) {
  if (req && req.inArguments) {
      for (let i = 0; i < req.inArguments.length; i++) {
          let e = req.inArguments[i];
          if (k in e) {
              return e[k];
          }
      }
  }
}

function getContactKey(req) {
  if (req && req.keyValue) {
      return req.keyValue;
  }
}
module.exports = router;
