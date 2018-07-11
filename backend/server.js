//server.js
'use strict'

//dependencies
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import Pusher from 'pusher';
import logger from 'morgan';
import Transaction from './models/transactions';
import Utility from './utils';

//instances
var app = express();
var router = express.Router();

var port = 3001;

const pusher = new Pusher({
	appId      : '553684',
	key        : '470626e46ac68914cee2',
	secret     : '930ce02a2a078886a3b4',
	cluster    : 'us2',
	encrypted  : true,
});
const channel = 'transactions';

//db config
mongoose.connect(`mongodb://localhost/transactionsDb?replicaSet=rs`);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', () => {
	const transactionCollection = db.collection('transactions');
	const changeStream = transactionCollection.watch();

	changeStream.on('change', (change) => {
		console.log(change);

		if(change.operationType === 'insert') {
			const transaction = change.fullDocument;
			console.log(change);
			pusher.trigger(
				channel,
				'inserted',
				{
					id: transaction._id,
				}
			);
		}
		else if (change.operationType === 'delete'
			|| change.operationType === 'update'
			|| change.operationType === 'replace') {
			pusher.trigger(
				channel,
				'deleted',
				change.documentKey._id
			);
		}
	});
});

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

router.get('/transactions', (req, res) => {
	Transaction.find((err, transactions) => {
		if (err) return res.json({ success: false, error: err });
		return res.json({ success: true, data: transactions });
	});
});

router.post('/transactions', (req, res) => {
	const transaction = new Transaction();
	const { amount, description, category, date, dateString } = req.body;
	if(!amount) {
		return res.json({
			success: false,
			error: 'You must provide an transaction number'
		});
	}

	transaction.amount = amount;
	transaction.description = description;
	transaction.category = category;
	transaction.date = date;
	transaction.dateString = dateString;

	transaction.save(err => {
		if (err) return res.json({ success: false, error: err });
		return res.json({ success: true });
	});
});

router.put('/transactions/:transactionId', (req, res) => {
	const { transactionId } = req.params;
	const { amount } = req.body;
	if (!transactionId) {
		return res.json({ success: false, error: 'No transaction id provided' });
	}

	Transaction.findById(transactionId, (error, transaction) => {
		if (error) return res.json({ success: false, error });
		const { amount, description, category, date, dateString } = req.body;
		if (amount) transaction.amount = amount;
		if (description) transaction.description = description;
		if (category) transaction.category = category;
		if (date) transaction.date = date;
		if (dateString) transaction.dateString = dateString;
		transaction.save(error => {
			if (error) return res.json({ success: false, error });
			return res.json({ success: true });
		});
	});
});

router.delete('/transactions/:transactionId', (req, res) => {
	const { transactionId } = req.params;
	if (!transactionId) {
		return res.json({ success: false, error:'No transaction id provided' });
	}
	Transaction.remove({ _id: transactionId }, (error, comment) => {
		if (error) return res.json({ success: false, error });
		return res.json({ success: true });
	});
});

app.use('/api', router);

app.listen(port, () => console.log(`api running on port ${port}`));