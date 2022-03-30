const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    username:{ type: String},
    username_id: { type: Schema.ObjectId },
    dob: { type: String, },
    relation:{ type: String},
    media: { type: String },
    // subcategory_tags: { type: Array,  },
    user_id: { type: Schema.ObjectId },


},
{
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

schema.set('toJSON', { virtuals: true }); 

module.exports = mongoose.model('mints', schema); 


