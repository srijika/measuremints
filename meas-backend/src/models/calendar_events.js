const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    event_detail:{ type: String},
    date: { type: Date },
    time: { type: String, },
    reminders:{ type: String},
    user_id: { type: Schema.ObjectId },
},
{
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

schema.set('toJSON', { virtuals: true }); 

module.exports = mongoose.model('calendar_events', schema); 


