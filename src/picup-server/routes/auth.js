// localhost/auth/..
var express  = require('express');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

var Member = require('../models/Member')
//var mongoose   = require('mongoose');
//const Member = mongoose.Model('member')

var fs = require('fs');
var jwt = require('jsonwebtoken');

//var JWT_SECRET = process.env.JWT_SECRET // 환경변수에 등록된 JWT_SECRET값
var JWT_SECRET = fs.readFileSync('config/jwt_secret.conf', 'utf-8')
var FACEBOOK_ID = fs.readFileSync('config/facebook_id.conf', 'utf-8')
var FACEBOOK_SECRET = fs.readFileSync('config/facebook_secret.conf', 'utf-8')

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
    var options = {expiresIn: 60*60*24};
    
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
    //res.json({
    //  token: req.user.my_token
    //})
    jwt.verify(req.user.my_token, JWT_SECRET, function(err, decoded){
      if(err) return res.json(util.successFalse(err));
      else{
        Member.findOne({'member_id':decoded._id})
        .exec(function(err, member) {
          //console.log(member)
          if (member) {
            res.redirect('http://localhost:3000/member/' + member.member_name + '?token=' + req.user.my_token)
          }
          else {
            res.redirect('http://localhost:3000/member/new?token=' + req.user.my_token) // login후 token을 만들어 react에 전달
          }
        });
      }
    });
  }
);

module.exports = router