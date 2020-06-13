/* 
 GET /auth/facebook => 페이스북 인증 요청
 GET /auth/facebook/callback => 페이스북 인증 완료
 GET /refresh => JWT 재발급
*/

var express  = require('express');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

var jwt_config = require('../config/jwt-config.json');
var facebook_config = require('../config/facebook-config.json');

var Member = require('../models/Member');
var util = require('../utils');
var fs = require('fs');
var jwt = require('jsonwebtoken');

var JWT_SECRET = jwt_config.secret
var FACEBOOK_ID = facebook_config.id
var FACEBOOK_SECRET = facebook_config.secret

var router   = express.Router();

router.use(passport.initialize()); // passport 사용 전 초기화를 해줍니다.

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_ID,
    clientSecret: FACEBOOK_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName'] // 요청할 데이터를 명시 해준다.
  },
  function(accessToken, refreshToken, profile, done) {
    var user = profile;
    // NOTE: ‘my_token’ we will use later 
    var payload = {
      _id : "facebook:" + user.id,  // facebook에서 callback으로 넘겨준 profile.id를 payload에 저장합니다. payload는 jwt를 인증하면 얻을 수 있는 데이터라고 보면 됩니다.
    };

    var secretOrPrivateKey = JWT_SECRET;
    //var options = {expiresIn: 60*60*24};
    var options = {}; // test개발용
    jwt.sign(payload, secretOrPrivateKey, options, function(err, token){
      user.my_token = token;
      //console.log(token)
      done(null, user);
    });
  }
));

// Redirect the user to Facebook for authentication.  
// When complete, Facebook will redirect the user back to the application at
router.get('/facebook',
  passport.authenticate( // facebook 전략을 이용하여 로그인을 합니다. passport.use(new FacebookStrategy({})
    'facebook', 
    // {scope: ['email']} // facebook 정보 중에서 email 접근을 같이 요청함
  )
);

// Facebook will redirect the user to this URL after approval.  
// Finish the authentication process by attempting to obtain an access token.  
// If access was granted, the user will be logged in.  
// Otherwise, authentication has failed.
router.get('/facebook/callback',
  passport.authenticate(
    'facebook',
    {
      session: false,
      failureRedirect: '/' /*, failureFlash = true // 사용자에게 실패 메세지를 보여줄 때*/
    }
  ), (req, res) => {
    /*
    res.json({
      token: req.user.my_token
    })*/

    //console.log(req.user.my_token);
    console.log('GET /auth/facebook/callback');
    jwt.verify(req.user.my_token, JWT_SECRET, function(err, decoded){
      if(err) return res.json(util.successFalse(err));
      else{
	console.log(decoded._id);

        Member.findOne({'memberID':decoded._id})
        .exec(function(err, member) {
          //console.log(member)
          if (member) {
            console.log('member already registered!')
            //res.redirect('http://localhost:3000/member/' + member.member_name + '?token=' + req.user.my_token)
            //req.header('Token', req.use.my_token)
            //res.set('Token', Date.now())
            //res.send({'Token': req.user.my_token});
            //console.log('뀨');
            req.session.token = req.user.my_token;
            console.log(req.session.token);
            req.session.save( function(err) {
              if (err) res.status(404).send('Not Found!');
              res.redirect('http://localhost:3000/board/' + member.privateBoard); // !! facebook callback후 url끝에 '#_=_' 문자를 붙이는 문제점이 있음.
            });
            //console.log(req.session.token);
            //res.redirect('http://localhost:3000/board/' + member.privateBoard); // !! facebook callback후 url끝에 '#_=_' 문자를 붙이는 문제점이 있음.
          }
          else {
            //res.header('Token', req.use.my_token)
            console.log('member is not exist!');
            req.session.token = req.user.my_token;
            console.log(req.session.token);
            req.session.save( function(err) {
              console.log(req.sessison);
              if (err) res.status(404).send('Not Found!');
              res.redirect('http://localhost:3000/member/new') // login후 token을 만들어 react에 전달
            });
            
            //res.redirect('http://localhost:3000/member/new') // login후 token을 만들어 react에 전달
          }
        });
      }
    });
  }
);

router.get('/token', function(req, res) {
  var token = req.session.token;
  //console.log(token)
  console.log('GET /auth/token')
  console.log(token);
  console.log(req.session);
  if (token) {
    req.session.destroy();
    return res.json(util.successTrue(token));
  }
  else {
    return res.json(util.successFalse('Token Not Exist!'));
  }
});

router.get('/refresh', util.isLoggedin, 
  function(req, res, next) {
    console.log('GET /auth/refresh');
    Member.findOne({memberID:req.decoded._id})
    .exec(function(err, member) {
      if (err || !member) return res.json(util.successFalse(err));
      else {
        var payload = {
          _id: member.member_id,
        };
        
        var secretOrPrivateKey = JWT_SECRET;
        var options = {expiresIn: 60 * 60 * 24};
        jwt.sign(payload, secretOrPrivateKey, options, function(err, token) {
          if (err) return res.json(util.successFalse(err));
          else return res.json(util.successTrue(token));
        });
      }
    }); 
  }
);
module.exports = router
