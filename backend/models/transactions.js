//model/transactions.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const TransactionsSchema = new Schema({
	amount: Number,
	date: String,
	dateString: String,
	category: String,
	description: String
}, { timestamps: true });

export default mongoose.model('Transaction', TransactionsSchema);