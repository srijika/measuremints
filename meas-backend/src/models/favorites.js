const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    user_id: { type: Schema.ObjectId,  ref:'users' }, 
    favorite_user_id: { type: Schema.ObjectId,  ref:'users' },
},
{
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

schema.set('toJSON', { virtuals: true });

schema.index({ title: 'text', slug: 'text' });
module.exports = mongoose.model('favorites', schema);
