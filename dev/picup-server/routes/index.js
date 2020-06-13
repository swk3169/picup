/*
 depreciated
*/
var express  = require('express');

var router   = express.Router();


router.get('/', function(req, res) {
    console.log('test');
    res.send("hello world!!!!!!!!!");
  }
);


module.exports = router

