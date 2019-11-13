var http = require("http");
var express = require('express');
var app = express();
var mysql      = require('mysql');
var bodyParser = require('body-parser');

//start mysql connection
var connection = mysql.createConnection({
  host     : 'us-cdbr-iron-east-05.cleardb.net', //mysql database host name
  user     : 'b5c9452651a00d', //mysql database user name
  password : '50e7f58f', //mysql database password
  database : 'heroku_96663e8b67e6fb2' //mysql database name
});

connection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected with mysql database...')
})
//end mysql connection

//start body-parser configuration
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
//end body-parser configuration

//create app server
var server = app.listen(process.env.PORT || 5000, "0.0.0.0", function () {
  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

});

app.get('/', function (req, res) {
  res.send({app:'doh-api'});
});

//rest api to get all patients
app.get('/patients', function (req, res) {
   connection.query('select * from patients', function (error, results, fields) {
	  if (error) throw error;
	  res.send(results);
	});
});
//rest api to get a single patients data
app.get('/patients/:id', function (req, res) {
   connection.query('select * from patients where Id=?', [req.params.id], function (error, results, fields) {
	  if (error) throw error;
	  res.send(results);
	});
});

//rest api to create a new patients record into mysql database
app.post('/patients', function (req, res) {
   var params  = req.body;
   console.log(params);
   connection.query('INSERT INTO patients SET ?', params, function (error, results, fields) {
	  if (error) throw error;
	  res.send(results);
	});
});

//rest api to update record into mysql database
app.put('/patients', function (req, res) {
   connection.query('UPDATE `patients` SET `Name`=?,`Address`=?,`Country`=?,`Phone`=? where `Id`=?', [req.body.Name,req.body.Address, req.body.Country, req.body.Phone, req.body.Id], function (error, results, fields) {
	  if (error) throw error;
	  res.send(results);
	});
});

//rest api to delete record from mysql database
app.delete('/patients', function (req, res) {
   console.log(req.body);
   connection.query('DELETE FROM `patients` WHERE `Id`=?', [req.body.Id], function (error, results, fields) {
	  if (error) throw error;
	  res.send('Record has been deleted!');
	});
});