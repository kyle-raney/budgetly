//model/apartments.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ApartmentsSchema = new Schema({
	aptNum: Number,
	sqFt: Number,
	rent: Schema.Types.Decimal128
}, { timestamps: true });

export default mongoose.model('Apartment', ApartmentsSchema);