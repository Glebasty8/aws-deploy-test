const mongoose = require('mongoose');
const { Schema } = mongoose;

const FacultySchema = new Schema({
    title: { type: String, required: true },
    university: { type: mongoose.Schema.Types.ObjectId, ref: 'University', required: true },
    telephone: { type: String },
    webSite: { type: String },
    description: { type: String, required: true },
    created_at: { type: Date },
    updated_at : { type: Date }
});

FacultySchema.pre('save', function(next){
    const now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
});

const Comment = mongoose.model('Faculty', FacultySchema);

module.exports = Comment;
