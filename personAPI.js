const express = require('express');
const fs = require('fs');
const app = express();

app.use(function (req, res, next) {
  console.log('Debug Information | Time:', Date.now() , ' | Req originalUrl: ' , req.originalUrl, ' | Req hostname: ' , req.hostname, ' | Req ip: ' , req.ip, ' | Req method: ' , req.method, ' | Req route: ' , req.route);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function (req, res) {
  res.send('Welcome to Person Search API!');
});

app.get('/persons', function (req, res) {
  console.log('Sending back persons database');
  let persons = JSON.parse(fs.readFileSync('database.json'));
  res.json(persons);
});

app.get('/person/search/:name', function (req, res) {
	res.json(getResult(req, 'person'));
});

app.get('/person/fruit/:name', function (req, res) {
	res.json(getResult(req, 'fruit'));
});

app.listen(3000, function () {
  console.log('Person Search API listening on port 3000!');
});

function getResult(req, resObj) {
	console.log('Fetching ' + resObj + ' for person with name ' + req.params.name);
	let persons = JSON.parse(fs.readFileSync('database.json'));
	let resultSet = new Set();
		
	persons.forEach(function(value){
		if (value.firstName && value.lastName && ( value.firstName.toLowerCase().indexOf(req.params.name.toLowerCase()) >= 0 || value.lastName.toLowerCase().indexOf(req.params.name.toLowerCase()) >= 0 )) {
			resultSet.add(resObj === 'person' ? value :  value.favoriteFruit);
		}
	});
	return Array.from(resultSet);
}