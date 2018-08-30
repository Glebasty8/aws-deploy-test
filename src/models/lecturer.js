const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lectureSchema = Schema({
    firstName: { type: String, unique: true, required: true },
    lastName: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    subject: { type: String, required: true },
    age: { type: Number, required: true },
    telephone: { type: String },
    deletedAt: { type: Date, default: null },
    created_at: { type: Date },
    faculty: { ObjectId, ref: 'Faculty' },
    updated_at : { type: Date },
    salary: { type: Number, default: null },
});

lectureSchema.pre('save', function(next){
    const now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
});

const Student = mongoose.model('Student', lectureSchema);

module.exports = Student;

