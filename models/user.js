var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: { type: String, required: true},
    fb_id: { type: String, required: true, unique:true},
    bot_status: { type: Boolean, required: true , default: true},
    userlast: { type: String },
    botlast: { type: String },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);