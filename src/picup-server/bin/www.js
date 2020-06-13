var app = require('../app');

var http = require('http');
var https = require('https');
var fs = require('fs');

var options = {
  key: fs.readFileSync('keys/key.pem'),  // keys 폴더아래 개인키를 불러옴
  cert: fs.readFileSync('keys/cert.pem') // keys 폴더아래 공인키를 불러옴
}

var port1 = 80;
var port2 = 443;

http.createServer(app).listen(port1, function(){  // 80번 포트를 오픈함
  console.log("Http server listening on port " + port1);
});


https.createServer(options, app).listen(port2, function(){ // https를 위해 443번 포트를 오픈함. 
  console.log("Https server listening on port " + port2);
});

