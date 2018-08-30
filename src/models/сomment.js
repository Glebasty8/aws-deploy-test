const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = Schema({
    author: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    body:   { type: String, required: true },
    likes: [Schema.Types.ObjectId],
    comments: [{ body: String, date: Date, by: Schema.Types.ObjectId }],
    created_at: { type: Date },
    updated_at : { type: Date }
});

commentSchema.pre('save', function(next){
    const now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
