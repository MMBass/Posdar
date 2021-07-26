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
        default: []
    },
    lastCheck: {
        type: Array,
        required: false,
        default: []
    },
    notifiedPosts: {
        type: Array,
        required: false,
        default: []
    },
});

module.exports = mongoose.model('Task', taskSchema);