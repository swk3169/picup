/* 
 GET /auth/facebook => 페이스북 인증 요청
 GET /auth/facebook/callback => 페이스북 인증 완료
 GET /refresh => JWT 재발급
*/

var express  = require('express');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;

var jwt_config = require('../config/jwt-config.json');
var facebook_config = require('../config/facebook-config.json');
var kakao_config = require('../config/kakao-config.json')

var Member = require('../models/Member');
var util = require('../utils');
var fs = require('fs');
var jwt = require('jsonwebtoken');

var memberQuery = require('../query/memberQuery');

var JWT_SECRET = jwt_config.secret
var FACEBOOK_ID = facebook_config.id
var FACEBOOK_SECRET = facebook_config.secret
var KAKAO_ID = kakao_config.id
var KAKAO_SECRET = kakao_config.secret

var router   = express.Router();

router.use(passport.initialize()); // passport 사용 전 초기화를 해줍니다.

// 이름을 kakao로 임의로 주었습니다 그래서 /kakao로 들어오면 아래가 실행이 됩니다
passport.use(new KakaoStrategy({
  clientID : KAKAO_ID, //REST API key
  clientSecret: KAKAO_SECRET,
  callbackURL : '/auth/kakao/callback' // 카카오 개발자 사이트에서 지정한 리다이렉트 URL 
},
function(accessToken, refreshToken, profile, done) {
  var user = profile;
  var payload = {
    _id : "kakao" + user.id
  };
  console.log(profile);//사용자 정보
  var secretOrPrivateKey = JWT_SECRET;
  //var options = {expiresIn: 60*60*24};
  var options = {}; // test개발용
  jwt.sign(payload, secretOrPrivateKey, options, function(err, token){
    user.my_token = token;
    //console.log(token)
  return done(null, profile);
  });
  }
));


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
      _id : "facebook" + user.id,  // facebook에서 callback으로 넘겨준 profile.id를 payload에 저장합니다. payload는 jwt를 인증하면 얻을 수 있는 데이터라고 보면 됩니다.
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

// https://localhost/auth/kakao로 들어오면(get으로 들어오면) passport.authenticate를 실행(여기서는 임의로 kakao로 이름을 줌)
router.get('/kakao', passport.authenticate('kakao'));

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
              //res.redirect('http://localhost:3000'); // !! facebook callback후 url끝에 '#_=_' 문자를 붙이는 문제점이 있음.
              res.redirect('http://localhost:3000/identify');
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
              console.log('this is my session!');
              console.log(req.sessison);
              if (err) res.status(404).send('Not Found!');
              //res.redirect('http://localhost:3000/member/new') // login후 token을 만들어 react에 전달
              res.redirect('http://localhost:3000/identify');
            });
            
            //res.redirect('http://localhost:3000/member/new') // login후 token을 만들어 react에 전달
          }
        });
      }
    });
  }
);

router.get('/kakao/callback',
  passport.authenticate(
    'kakao',
    {
      session: false,
      failureRedirect: '/' /*, failureFlash = true // 사용자에게 실패 메세지를 보여줄 때*/
    }
  ), (req, res) => {
    console.log(req.user.my_token);
    console.log('GET /auth/kakao/callback');
    jwt.verify(req.user.my_token, JWT_SECRET, function(err, decoded){
      if(err) return res.json(util.successFalse(err));
      else{
        console.log(decoded._id);
        
        Member.findOne({'memberID':decoded._id})
        .exec(function(err, member) {
          //console.log(member)
          if (member) {
            console.log('member already registered!')
            req.session.token = req.user.my_token;
            console.log(req.session.token);
            req.session.save( function(err) {
              if (err) res.status(404).send('Not Found!');
              //res.redirect('http://localhost:3000');
              res.redirect('http://localhost:3000/identify');
            });
          }
          else {
            //res.header('Token', req.use.my_token)
            console.log('member is not exist!');
            req.session.token = req.user.my_token;
            console.log(req.session.token);
            req.session.save( function(err) {
              console.log('this is my session!');
              console.log(req.sessison);
              if (err) res.status(404).send('Not Found!');
              //res.redirect('http://localhost:3000/member/new');
              res.redirect('http://localhost:3000/identify');
            });
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
    req.session.token = null;
    
    return res.json(util.successTrue(token));
  }
  else {
    return res.json(util.successFalse('Token Not Exist!'));
  }
});


router.get('/token2', async function(req, res) {
  var token = req.session.token;
  //console.log(token)
  console.log('GET /auth/token2')
  console.log(token);
  console.log(req.session);
  if (token) {
    jwt.verify(token, JWT_SECRET, async function(err, decoded){
      var member = await memberQuery.findMemberBySNSID(decoded._id);
      req.session.token = null;
      if (member) {
        return res.json(util.successTrue({token:token, exist:true}));
      }
      else {
        return res.json(util.successTrue({token:token, exist:false}));
      }
    });
    //req.session.token = null;
    //return res.json(util.successTrue(token));
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
