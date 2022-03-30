const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    category_name:{ type: String, default:'', trim:true },
},
{
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('categories', schema); 