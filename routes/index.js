var express = require('express');
var router = express.Router();

const waffleController = require("../controllers/baseline/waffleItem.controller");
const navController = require("../controllers/ddu/nav.controller");

router.get('/', function(req, res, next) {
  let appName = "Deep Dive University"

  let wafflePromise = waffleController.findAll2();
  let navPromise = navController.findNav();

  Promise.all([wafflePromise, navPromise]).then(([waffleItems, navItems]) => {
    res.render('index', { title : appName, appName : appName, waffleItems : waffleItems, navItems : navItems });
  });  
});

module.exports = router;
