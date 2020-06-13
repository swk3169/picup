var express  = require('express');

var router   = express.Router();

router.get('/', function(req, res) {
    res.send("<a href='/auth/facebook'>페이스북 로그인</a>")
  }
);

module.exports = router

