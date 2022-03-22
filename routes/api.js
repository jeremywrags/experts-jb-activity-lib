var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log("---------------This is the API GET Route----------------");
  console.log(req.body);
  console.log("---------------End API GET Route----------------");
  let responseObject = {
    status : "success",
    statusCode: 1
  }

  return res.status(200).json(responseObject);
});

/* GET users listing. */
router.post('/', function(req, res, next) {
  console.log("---------------This is the API POST Route----------------");
  console.log(req.body);
  console.log("---------------End API POST Route----------------");
  let responseObject = {
    status : "success",
    statusCode: 1
  }

  return res.status(200).json(responseObject);
});
module.exports = router;
