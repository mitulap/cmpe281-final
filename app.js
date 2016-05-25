var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var createGumball = 'INSERT INTO gumballpractise.cmpe281finaltable(value, key) VALUES(?, ?)';
var getGumball = 'SELECT * FROM gumballpractise.cmpe281finaltable WHERE key=?';
var updateGumball = 'UPDATE gumballpractise.cmpe281finaltable SET value=? WHERE key=?';
/*
var deleteGumball = 'DELETE FROM gumballpractise.cmpe281finaltable WHERE id=?';*/
const cassandra = require('cassandra-driver');

// AWS URL

/*cmpe281-instance1 
172.31.17.230
52.27.155.165

cmpe281-instance2 
172.31.23.92
52.32.153.93

cmpe281-instance3 
172.31.30.2
52.40.51.50
*/


const client=new cassandra.Client({contactPoints : ['52.32.153.93:9042']});
var nodeIp = '52.32.153.93';
/*

write "cqlsh" to open terminal

CREATE KEYSPACE "name-of-the-db" WITH REPLICATION = { 'class' : 'SimpleStrategy' , 'replication_factor' :3 };
ex..
CREATE KEYSPACE "gumballpractise" WITH REPLICATION = { 'class' : 'SimpleStrategy' , 'replication_factor' :3 };
use "name-of-the-db"; // to go to the db

//how to define cassandra seconddary key
PRIMARY KEY(("column/s for primary keys with commma separated"), "secondary-key"));
creating table
CREATE TABLE "table-name"("field-name1" "type1","field-name2" "type2", ..., PRIMARY KEY("field-name2"));
CREATE TABLE cmpe281finaltable(value text, key int, PRIMARY KEY(key));
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
  var value = req.body.value;
  var key = req.body.key;
  client.execute(createGumball,[value, key],{ prepare: true }, function(err, getresult){
    if(err) {
      res.json(err);
    } else {
      res.json({"message":"successfully created from node " + nodeIp});
    }
  });
});

app.get('/gumball/:key', function(req, res) {
  var key = req.params.key;
  client.execute(getGumball,[key],{ prepare: true }, function(err, getresult) {
    if(err) {
      res.json(err);
    } else {
      res.json({rows:getresult.rows, "node ip" : "" + nodeIp});
    } 
  });
});

app.put('/gumball/:key', function(req, res) {
  var value = req.body.value;
  var key = req.params.key;
  client.execute(updateGumball,[value, key],{ prepare: true }, function(err, getresult) {
    if(err) {
      res.json(err);
    } else {
      res.json({"message":"successfully updated from node " + nodeIp});
    }
  });
});

/*app.delete('/gumball/:id', function(req, res) {
  var id = req.params.id;
  client.execute(deleteGumball,[id],{ prepare: true }, function(err, getresult) {
    if(err) {
      res.json(err);
    }
    else {
      res.json({"message":"successfully deleted"});
    }
  });
});
*/

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