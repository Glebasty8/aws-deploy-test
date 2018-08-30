const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const universitySchema = Schema({
    title: { type: String, unique: true, required: true },
    type: { type: String, required: true },
});

const University = mongoose.model('University', universitySchema);

module.exports = University;
