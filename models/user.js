const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
// pattern that states what properties a user has
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    isAdmin: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
// compiles the schema into a model (object) that now includes all the methods we need
module.exports = mongoose.model('User', userSchema);
