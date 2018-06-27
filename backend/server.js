//server.js
'use strict'

//dependencies
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import logger from 'morgan';
import Apartment from './models/apartments';

//instances
var app = express();
var router = express.Router();

var port = 3001;

//db config
mongoose.connect(`mongodb://tramor:arb0retum@ds219191.mlab.com:19191/virtual-vcr`);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));

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

router.get('/apartments', (req, res) => {
	Apartment.find((err, apartments) => {
		if (err) return res.json({ success: false, error: err });
		return res.json({ success: true, data: apartments });
	});
});

router.post('/apartments', (req, res) => {
	const apartment = new Apartment();
	const { aptNum, sqFt, rent } = req.body;
	if(!aptNum) {
		return res.json({
			success: false,
			error: 'You must provide an apartment number'
		});
	}
	apartment.aptNum = aptNum;
	apartment.sqFt = sqFt;
	apartment.rent = rent;

	apartment.save(err => {
		if (err) return res.json({ success: false, error: err });
		return res.json({ success: true });
	});
});

router.put('/apartments/:apartmentId', (req, res) => {
	const { apartmentId } = req.params;
	if (!apartmentId) {
		return res.json({ success: false, error: 'No apartment id provided' });
	}
	Apartment.findById(apartmentId, (error, comment) => {
		if (error) return res.json({ success: false, error });
		const { aptNum, sqFt, rent } = req.body;
		if (aptNum) apartment.aptNum = aptNum;
		if (sqFt) apartment.sqFt = sqFt;
		if (rent) apartment.rent = rent;
		apartment.save(error => {
			if (error) return res.json({ success: false, error });
			return res.json({ success: true });
		});
	});
});

router.delete('/apartments/:apartmentId', (req, res) => {
	const { apartmentId } = req.params;
	if (!apartmentId) {
		return res.json({ success: false, error:'No apartment id provided' });
	}
	Apartment.remove({ _id: apartmentId }, (error, comment) => {
		if (error) return res.json({ success: fase, error });
		return res.json({ success: true });
	});
});

app.use('/api', router);

app.listen(port, () => console.log(`api running on port ${port}`));