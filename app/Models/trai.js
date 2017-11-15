// app/models/trai.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TraiSchema   = new Schema({
    SAC: Number,
	Ph: Number,
	Pr: Number,
	OT: String,
	PT: Number
	
}, { collection: 'test' });

module.exports = mongoose.model('test', TraiSchema);