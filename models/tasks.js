const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: false,
        default: "0"
    },
    date: {
        type: Date,
        required: false,
        default: {}
    },
    group: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    text: {
        type: Array,
        required: true,
    },
    lastCheck: {
        type: [String],
        required: true,
    },
    notifiedPosts: {
        type: [String],
        required: true,
    },
});

module.exports = mongoose.model('Task', taskSchema);