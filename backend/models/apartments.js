//model/apartments.js
'use strict';
//import dependency
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ApartmentsSchema = new Schema({
	aptNum: Integer,
	sqFt: Integer,
	rent: Double
});

module.exports = mongoose.model('Apartment', ApartmentsSchema);