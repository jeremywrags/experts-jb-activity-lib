var express = require('express');
var router = express.Router();
//var router = require("express").Router();


//** Baseline App Code DO NOT EDIT */
const waffleItem =      require("../controllers/baseline/waffleItem.controller.js");
router.post("/waffleitem", waffleItem.create);
router.get("/waffleitem", waffleItem.findAll);    
router.get("/waffleitem/:id", waffleItem.findOne);
router.put("/waffleitem/:id", waffleItem.update);
router.delete("/waffleitem/:id", waffleItem.delete);  



//** JBLIB App Code Add new objects and routes below */
const nav =  require("../controllers/jblib/nav.controller.js");

const jbApp =  require("../controllers/jblib/jbApp.controller.js");

//---------- Begin Nav Routes ---------//
router.post("/nav", nav.create);
router.get("/nav", nav.findAll);    
router.get("/nav/:id", nav.findOne);
router.put("/nav/:id", nav.update);
router.delete("/nav/:id", nav.delete); 
//---------- End Course Routes ---------//


router.get("/jbApps", jbApp.findAll);  
module.exports = router;
