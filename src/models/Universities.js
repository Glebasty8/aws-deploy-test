const mongoose = require('mongoose');
const { Schema } = mongoose;

const UniversitySchema = new Schema({
    title: { type: String, unique: true, required: true },
    type: { type: String, required: true },
});

mongoose.model('Universities', UniversitySchema);

