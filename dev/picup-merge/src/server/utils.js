var jwt = require('jsonwebtoken');
var fs = require('fs');

var jwt_config = require('./config/jwt-config.json');
var Member = require('./models/Member');

var JWT_SECRET = jwt_config.secret
var util = {};

// success json 을 만드는 함수입니다. API가 return하는 json의 형태를 통일시키기 위해 바로 함수를 통해 json 오브젝트를 만들고 이를 return하게 됩니다.
util.successTrue = function(data){ 
  return {
    success:true,
    message:null,
    errors:null,
    data:data
  };
};

// API가 성공하지 못한 경우 return하는 json의 형태를 통일시키기 위해 error 오브젝트나 message를 받아서 error json을 만드는 함수 입니다.
util.successFalse = function(err, message){
  if(!err&&!message) message = 'data not found';
  return {
    success:false,
    message:message,
    errors:(err)? err: null,
    data:null
  };
};

util.isAuthenticated = function(req, res, next) {
  var authHeader = req.headers['authorization'];
  if (!authHeader) return res.json(util.successFalse(null, 'token is required!'));
  else {
    var items = authHeader.split(' ');
    var token = items[1];
    jwt.verify(token, JWT_SECRET, function(err, decoded) {
      if (err) return res.json(util.successFalse(err));
      else {
        req.decoded = decoded;
        next();
      }
    }); 
  }
}

util.isLoggedin = function(req, res, next) {
  var authHeader = req.headers['authorization'];
  if (!authHeader) return res.json(util.successFalse(null, 'token is required!'));
  else {
    var items = authHeader.split(' ');
    var token = items[1];
    jwt.verify(token, JWT_SECRET, function(err, decoded) {
      if (err) return res.json(util.successFalse(err));
      else {
        Member.findOne({memberID: decoded._id})
        .exec(function(err, member) {
          if (err || !member) return res.json(util.successFalse(err));
          req.decoded = decoded;
          req.decoded._objID = member._id;
          next();
        });
      }
    }); 
  }
}

util.ConvertDMSToDD = function(degrees, minutes, seconds, direction) {
  var dd = degrees + minutes/60 + seconds/(60*60);

  if (direction == "S" || direction == "W") {
      dd = dd * -1;
  } // Don't do anything for N or E
  return dd;
}

util.ensureAuthorized = function(authHeader) {
  if (authHeader) {
    var items = authHeader.split(' ');
    var token = items[1];
    return token; 
  }
  else {
    return null;
  }
}

util.bufferToBase64Image = function(buffer) {
  /*
  var binary = '';
  var bytes = new Uint8Array( buffer );
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
  }
  //console.log(binary)
  return 'data:image/jpeg;base64,' + Buffer.from(binary).toString('base64');
  */
  var imgStr = 'data:image/jpeg;base64,' + buffer.toString('base64')
  return imgStr
}

util.isEqual = function (x1, x2) {
  return x1 == x2 || x1 === x2;
}

util.isImage = function(mimetype) {
  return mimetype == 'image/jpeg' || mimetype == 'image/png';
}

util.isVideo = function(mimetype) {
  return mimetype == 'video/mp4';
}

util.daysBetween = function( date1, date2 ) {
  //Get 1 day in milliseconds
  var one_day=1000*60*60*24;

  // Convert both dates to milliseconds
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();

  // Calculate the difference in milliseconds
  var difference_ms = date2_ms - date1_ms;
    
  // Convert back to days and return
  return Math.round(difference_ms/one_day); 
}

module.exports = util;
