//server.js
'use strict'

//dependencies
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Apartment = require('./model/apartments');

//instances
var app = express();
var router = express.Router();

var port = 3001;

//db config
mongoose.connect(`mongodb://tramor:arb0retum@ds219191.mlab.com:19191/virtual-vcr`);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

	res.setHeader('Cache-Control', 'no-cache');
	next();
});

router.get('/', function(req, res) {
	res.json({ message: 'API Initialized!' });
});

router.route('/apartments').get(function(req, res) {
	Apartment.find(function(err, apartments) {
		if (err)
			res.send(err);
		res.json(apartments)
	});
}).post(function(req, res) {
	var apartment = new Apartment();
	apartment.aptNum = req.body.aptNum;
	apartment.sqFt = req.body.sqFt;
	apartment.rent = req.body.rent;

	apartment.save(function(err) {
		if (err)
			res.send(err);
		res.json({ message: 'Apartment successfully added!' });
	});
});

app.use('/api', router);

app.listen(port, function() {
	console.log(`api running on port ${port}`);
});