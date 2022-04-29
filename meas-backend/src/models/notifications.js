const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    user_id: { type: Schema.ObjectId },
    message: { type: String, required: true },
    notification_type: { type: String, default: 'user' },
    status: { type: Number, default: 0 }, // 0 for unread 1 for read
},
{
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

schema.set('toJSON', { virtuals: true });

schema.index({ title: 'text', slug: 'text' });
module.exports = mongoose.model('notifications', schema);
