const mongoose = require('mongoose');
// pattern that states what properties a campground has
const campgroundSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    description: String,
    location: String,
    lat: Number,
    lng: Number,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        },
    ],
    createdBy: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        firstName: String,
        lastName: String,
    },
});
// compiles the schema into a model (object) that now includes all the methods we need
module.exports = mongoose.model('Campground', campgroundSchema);
