var app = require('../app');

var http = require('http');
var https = require('https');
var fs = require('fs');

// Load balancer
var cluster = require('cluster');
const numCPUs = require('os').cpus().length;

// SSL을 위한 Key 오픈
var options = {
  key: fs.readFileSync('keys/key.pem'),  // keys 폴더아래 개인키를 불러옴
  cert: fs.readFileSync('keys/cert.pem') // keys 폴더아래 공인키를 불러옴
}



var port1 = 4000;
var port2 = 443;

if (cluster.isMaster) {
  masterProcess();
} else {
  childProcess();  
}

function masterProcess() {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    console.log(`Forking process number ${i}...`);
    cluster.fork();
  }
}

function childProcess() {
  console.log(`Worker ${process.pid} started...`);

  http.createServer(app).listen(port1, function(){  // 80번 포트를 오픈함
    console.log("Http server listening on port " + port1);
  });
  
  
  https.createServer(options, app).listen(port2, function(){ // https를 위해 443번 포트를 오픈함. 
    console.log("Https server listening on port " + port2);
  });
}

/** 
http.createServer(app).listen(port1, function(){  // 80번 포트를 오픈함
  console.log("Http server listening on port " + port1);
});


https.createServer(options, app).listen(port2, function(){ // https를 위해 443번 포트를 오픈함. 
  console.log("Https server listening on port " + port2);
});
*/

