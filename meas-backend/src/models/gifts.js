const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    sender_id:{ type: Schema.ObjectId},
    reciever_id: { type: Schema.ObjectId },
    gift_name: { type: String},
    gift_link: { type: String},
    send_date: { type: Date}
},
{
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

schema.set('toJSON', { virtuals: true }); 

module.exports = mongoose.model('gifts', schema); 


