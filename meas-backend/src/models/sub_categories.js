const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: { type: String, unique: true, required: true },
    description: { type: String, default: null },
    parent_category: { type: Schema.ObjectId, required: true, ref:'categories' },
   
},
{
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

schema.set('toJSON', { virtuals: true });

schema.index({ title: 'text', slug: 'text' });
module.exports = mongoose.model('sub_categories', schema);
