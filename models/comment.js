const mongoose = require('mongoose');
// pattern that states what properties a comment has
const commentSchema = new mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        firstName: String,
        lastName: String,
    },
    // default schema option as a function reference. Mongoose will execute it and
    // use the return value as the default.
    created: { type: Date, default: Date.now },
});
// compiles the schema into a model (object) that now includes all the methods we need
module.exports = mongoose.model('Comment', commentSchema);
