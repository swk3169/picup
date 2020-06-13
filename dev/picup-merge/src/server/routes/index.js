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

router.get('/vrcamera', function(req, res) {

  console.log(res);

  var html = `<html>

  <head>

  </head>

  <body>

      <div id="vrview">

        hi
        <video width="400px" height="200px" controls>
        <source src="http://localhost:4000/resource/1539062706293.mp4" type="video/mp4"/>
        </video>
        <video src="http://localhost:4000/resource/1539062706293.mp4">
        </iframe>

      </div>

  </body>

</html>`
  res.send(html);
});

module.exports = router

