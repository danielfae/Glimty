var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ButtonSchema = new Schema({
    type: { type: String, required: true},
    title : { type: String, required: true},
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BoardActivity', BoardActivitySchema);