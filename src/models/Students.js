const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

const StudentsSchema = new Schema({
    firstName: { type: String, unique: true, required: true },
    lastName: { type: String, unique: true, required: true },
    hash: { type: String },
    salt: { type: String },
    email: { type: String, unique: true, required: true },
    age: { type: Number, default: 18, required: true },
    interests: [String],
    university: { type: Schema.Types.ObjectId, ref: 'University', required: true },
    deletedAt: { type: Date, default: null },
    created_at: { type: Date },
    updated_at : { type: Date },
    budget: { type: Boolean, required: true },
    img: { type: String, default: null }
});

// assign a function to the "methods" object of our studentSchema
StudentsSchema.methods.getFullName = function() {
    return `${this.firstName} ${this.lastName}`;
};

StudentsSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

StudentsSchema.methods.validatePassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

StudentsSchema.methods.generateJWT = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign({
        email: this.email,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, 'secret');
};

StudentsSchema.methods.toAuthJSON = function() {
    return {
        _id: this._id,
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        age: this.age,
        interests: this.interests,
        university: this.university,
        budget: this.budget,
        img: this.img,
        token: this.generateJWT(),
    };
};

StudentsSchema.pre('save', function(next){
    const now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
});

mongoose.model('Students', StudentsSchema);
