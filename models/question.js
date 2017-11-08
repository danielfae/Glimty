var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
    question: { type: String, required: true},
    answers : [{ type: Schema.Types.ObjectId, ref: 'Answer', required: true }],
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BoardActivity', BoardActivitySchema);