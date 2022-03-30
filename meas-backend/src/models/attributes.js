const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    attribute: { type: Array },
    username_id: { type: Schema.ObjectId, },
    subcategory_id: { type: Schema.ObjectId,  ref:'sub_categories' }, 
},
{
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

schema.set('toJSON', { virtuals: true });

schema.index({ title: 'text', slug: 'text' });
module.exports = mongoose.model('attributes', schema);
