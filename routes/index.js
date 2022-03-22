const multer = require("multer");
var express = require('express');
var fs = require('fs');
var path = require('path')
var router = express.Router();

const waffleController = require("../controllers/baseline/waffleItem.controller");
const navController = require("../controllers/jblib/nav.controller");
const jbAppController = require("../controllers/jblib/jbApp.controller");
const { jblib } = require("../models");

// SET STORAGE
/*var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)    
  }
})*/
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

router.get('/', function(req, res, next) {
  let appName = "JB Activity Library"

  let wafflePromise = waffleController.findAll2();
  let navPromise = navController.findNav();
  let jbAppPromose =  jbAppController.findAll2();

  Promise.all([wafflePromise, navPromise, jbAppPromose]).then(([waffleItems, navItems, jbApps]) => {
    jbApps.map(app =>{
      const appImage = app.imageData.toString('base64')
      app['imageData'] = appImage
    });     
    res.render('index', { title : appName, appName : appName, waffleItems : waffleItems, navItems : navItems, jbApps : jbApps });
  });  
});

router.get('/icon/:appName', function(req, res, next) {
  
  let jbAppPromose =  jbAppController.findOne(req.params.appName);
  Promise.all([jbAppPromose]).then(([jbApp]) => {    
    res.send(Buffer.from(jbApp.imageData.toString('base64'), "base64"));
  });  
});

router.post('/image/uploadfile', upload.single('myFile'), (req, res, next) => {
   
  let jbApp = {
    name: req.body.appName,    
    description: req.body.description,    
    imageType: req.file.mimetype, 
    imageName: req.file.originalname,
    imageData: req.file.buffer
  }

  
    console.log(jbAppController.create(jbApp))
    res.redirect('/');  
})




module.exports = router;
