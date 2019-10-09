var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var attendeeSchema = new Schema({
    name: String,
    mob: String,
    online: Boolean,
    townsriptId: {
        type:String,
        default:"Empty"
    },
    workshop: String,
    controlzId: String,
    comment: String,
    special: String,
    timestamp:{
        type:Date,
        default:Date.now()
    }
});

var Attendees = mongoose.model("attendees", attendeeSchema, "attendees");

module.exports = Attendees;
