const express = require('express');
const os = require('os');
const fs = require('fs');
const https = require('https');
const app = require('./app');

//const app = express();

// Load balancer
var cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const options = {
  key: fs.readFileSync('./src/server/keys/key.pem'),  // keys 폴더아래 개인키를 불러옴
  cert: fs.readFileSync('./src/server/keys/cert.pem') // keys 폴더아래 공인키를 불러옴
}



var port = 443;

//app.use(express.static('dist'));
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

  https.createServer(options, app).listen(port, function(){ // https를 위해 443번 포트를 오픈함. 
    console.log("Https server listening on port " + port);
  });
}

/*
https.createServer(options, app).listen(port, function(){ // https를 위해 443번 포트를 오픈함. 
  console.log("Https server listening on port " + port);
});
*/