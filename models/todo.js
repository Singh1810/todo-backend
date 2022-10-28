const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const todoSchema = new Schema({
    title: {type: String, required: true},
    task: {type: String, required: true},
    userId: {type: String}
})

module.exports = mongoose.model('Todo', todoSchema);
