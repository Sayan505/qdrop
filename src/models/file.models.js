const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const file_schema = new Schema({
    filename:    { type: String, required: true },
    path:        { type: String, required: true },
    size:        { type: Number, required: true },
    uuid:        { type: String, required: true },
    og_filename: { type: String, required: true }
}, { timestamps: true });


module.exports = mongoose.model('File', file_schema);
