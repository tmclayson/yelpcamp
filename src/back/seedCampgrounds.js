/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
const faker = require('faker');
const cloudinary = require('./cloudinary');
const geocoder = require('./geocoder');
const Campground = require('../../models/campground');
const Comment = require('../../models/comment');
const User = require('../../models/user');

const seeds = [
    {
        name: 'Guadarama',
        images: [
            './seed_images/adrian-393713-unsplash.jpg',
            './seed_images/andrew-gloor-576177-unsplash.jpg',
            './seed_images/arthur-poulin-96074-unsplash.jpg',
        ],
        location: 'MCP2+XW Biblis',
        price: 8,
        description: faker.lorem.paragraphs(),
    },
    {
        name: 'Mountain Goat\'s Rest',
        images: [
            './seed_images/le-tan-640851-unsplash.jpg',
            './seed_images/chang-duong-372813-unsplash.jpg',
            './seed_images/chris-holder-658988-unsplash.jpg',
        ],
        location: 'CQ2H+GM Neckargemünd',
        price: 27,
        description: faker.lorem.paragraphs(),
    },
    {
        name: 'Granite Hill',
        images: [
            './seed_images/leon-contreras-447372-unsplash.jpg',
            './seed_images/WaffleFarmCampground_EarlyMorning-Slide.jpg',
            './seed_images/daan-weijers-668960-unsplash.jpg',
        ],
        location: 'FF3R+32 Ca',
        price: 42,
        description: faker.lorem.paragraphs(),
    },
    {
        name: 'Campsite Grindavik - Tjaldsvaedi',
        images: [
            './seed_images/daniel-nainggolan-409972-unsplash.jpg',
            './seed_images/danka-peter-178-unsplash.jpg',
            './seed_images/edward-virvel-658274-unsplash.jpg',
        ],
        location: 'Austurvegur 26, 240 Grindavik, Iceland',
        price: 12,
        description: faker.lorem.paragraphs(),
    },
    {
        name: 'Sutton Falls',
        images: [
            './seed_images/esther-tuttle-566634-unsplash.jpg',
            './seed_images/jonathan-forage-367660-unsplash.jpg',
            './seed_images/glen-jackson-242973-unsplash.jpg',
        ],
        location: '90 Manchaug Rd, Sutton, MA 01590, USA',
        price: 8.99,
        description: faker.lorem.paragraphs(),
    },
];

async function seedCampgrounds(seedControl) {
    if (seedControl === true) {
        try {
            await Comment.remove({});
            console.log('comments removed');
            await Campground.remove({});
            console.log('campgrounds removed');
            const seedUser = await User.findOne({ email: process.env.SEEDER_EMAIL });
            const commentUser = await User.findOne({ email: process.env.COMMENTER_EMAIL });
            if (seedUser != null && commentUser != null) {
                return seedDB(seedUser, commentUser);
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    return Promise.resolve();
}
// destructure the array of results passed in, ignoring the first two values
async function seedDB(seedUser, commentUser) {
    const campCreatedBy = {
        id: seedUser._id,
        firstName: seedUser.firstName,
        lastName: seedUser.lastName,
    };

    for (const seed of seeds) {
        seed.createdBy = campCreatedBy;

        try {
            // upload the images to cloudinary and then save the returned urls to the seed
            const cloudinaryUrls = await uploadImagesToCloudinary(seed.images);
            seed.images = [];
            cloudinaryUrls.forEach((cloudinaryUrl) => {
                // need to clear the paths to the local files before push in the cloudinary urls.
                seed.images.push(cloudinaryUrl);
            });
            // geocode the location provided, wait for the result, and save to the seed object
            const geolocationData = await geocoder.geocode(seed.location);
            seed.location = geolocationData[0].formattedAddress;
            seed.location = geolocationData[0].latitude;
            seed.location = geolocationData[0].longitude;
            // start creating the campground and comments simultaneously, but wait for their results
            const campground = await Campground.create(seed);
            const comment = await Comment.create({
                text: faker.lorem.sentence(),
                author: {
                    id: commentUser.id,
                    firstName: commentUser.firstName,
                    lastName: commentUser.lastName,
                },
            });
            // finally, associatiate the comment to the campground and save back to the db.
            campground.comments.push(comment);
            campground.save();
            console.log('campground created');
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}

function uploadImagesToCloudinary(images) {
    return Promise.all(images.map(image => new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload(image, (err, result) => {
            if (err) reject(err);
            // sets state to "fulfilled",
            // sets result to result.secure_url
            else resolve(result.secure_url);
        });
    })));
}

module.exports = seedCampgrounds;
