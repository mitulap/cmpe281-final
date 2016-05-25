var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var createGumball = 'INSERT INTO gumballpractise.gumball(name, value, id) VALUES(?, ?, ?)';
var getGumball = 'SELECT * FROM gumballpractise.gumball WHERE id=?';
const cassandra = require('cassandra-driver');
const client=new cassandra.Client({contactPoints : ['54.67.81.140:9042']});
/*
CREATE KEYSPACE "gumballpractise" WITH REPLICATION = { 'class' : 'SimpleStrategy' , 'replication_factor' :3 };
CREATE TABLE gumball(name text, value text, id int, PRIMARY KEY(id));
*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
  next();
});

app.post('/gumball', function(req, res) {
  var name = req.body.name;
  var value = req.body.value;
  var id = req.body.id;
  client.execute(createGumball,[name, value, id],{ prepare: true }, function(err, getresult){
    if(err) {
      res.json(err);
    }
    else {
      res.json({"message":"successful"});
    }
  });
});

app.get('/gumball/:id', function(req, res) {
  var id = req.params.id;
  client.execute(getGumball,[id],{ prepare: true }, function(err, getresult) {
    if(err) {
      res.json(err);
    }
    else {
      res.json({rows:getresult.rows});
    }
  });
});

// app.get('*', function(req, res, next) {
//   var err = new Error();
//   err.status = 404;
//   next(err);
// });

// app.post('*', function(req, res, next) {
//   var err = new Error();
//   err.status = 404;
//   next(err);
// });

app.set('port', process.env.PORT || 3000);
 
var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});

module.exports = app;