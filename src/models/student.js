const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = Schema({
    firstName: { type: String, unique: true, required: true },
    lastName: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    age: { type: Number, default: 18, required: true },
    interests: [String],
    university: { type: Schema.Types.ObjectId, ref: 'University', required: true},
    deletedAt: { type: Date, default: null },
    created_at: { type: Date },
    updated_at : { type: Date },
    budget: { type: Boolean, required: true },
    img: { type: String, default: null }
});

// assign a function to the "methods" object of our studentSchema
/*studentSchema.methods.getFullName = function() {
    return `${this.firstName} ${this.lastName}`;
}; */

// defining virtual method for getting fullName
studentSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

studentSchema.pre('save', function(next){
    const now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
