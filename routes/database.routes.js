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



//** DDU App Code Add new objects and routes below */
const course =          require("../controllers/ddu/course.controller.js");
const nav =             require("../controllers/ddu/nav.controller.js");
const courseSubject =   require("../controllers/ddu/courseSubject.controller.js");
//** Deep Dive University Routes */

//---------- Begin Course Routes ---------//
router.post("/course", course.create);
router.get("/course", course.findAll);    
router.get("/course/:id", course.findOne);
router.put("/course/:id", course.update);
router.delete("/course/:id", course.delete); 
//---------- End Course Routes ---------//

//---------- Begin CourseSubject Routes ---------//
router.post("/courseSubject", courseSubject.create);
router.get("/courseSubject", courseSubject.findAll);    
router.get("/courseSubject/:id", courseSubject.findOne);
router.put("/courseSubject/:id", courseSubject.update);
router.delete("/courseSubject/:id", courseSubject.delete); 
//---------- End CourseSubject Routes ---------//

//---------- Begin Nav Routes ---------//
router.post("/nav", nav.create);
router.get("/nav", nav.findAll);    
router.get("/nav/:id", nav.findOne);
router.put("/nav/:id", nav.update);
router.delete("/nav/:id", nav.delete); 
//---------- End Course Routes ---------//

module.exports = router;
