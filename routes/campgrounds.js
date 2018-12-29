/* eslint-disable no-shadow */
const express = require('express');

const multer = require('multer');
const geocoder = require('../src/back/geocoder');
const cloudinary = require('../src/back/cloudinary');
const Campground = require('../models/campground');
const User = require('../models/user');
const Notification = require('../models/notification');
const middleware = require('../middleware');

// multer configuration

// configures multer to use a custom filename for each upload
const storage = multer.diskStorage({
    filename: function filename(req, file, callback) {
        callback(null, `${Date.now()} - ${file.originalname}`);
    },
});
// configures multer to only allow image files, returning an error if a non-image file is uploaded
// eslint-disable-next-line consistent-return
const fileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
const upload = multer({ storage, fileFilter });

const router = express.Router({ mergeParams: true });

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

router.get('/', (req, res) => {
    if (req.query.search) {
        // RegExp flags:
        // g - global match; find all matches rather than stopping after the first match
        // i - ignore case; if u flag is also enabled, use Unicode case folding
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');

        Campground.find({ name: regex }, (err, campgrounds) => {
            if (err) {
                console.log('err :', err);
                req.flash('error', 'An error was encountered whilst attempting the search');
                return res.redirect('/campgrounds');
            }
            req.breadcrumbs('All Campgrounds', '/campgrounds');
            if (campgrounds.length < 1) {
                req.flash('error', 'There are no campgrounds we know that match that search');
                return res.redirect('/campgrounds');
            }
            req.breadcrumbs('Search Results', `/campgrounds${req.query.search}`);
            return res.render('campgrounds/index', { campgrounds });
        });
    } else {
        Campground.find({}, (err, campgrounds) => {
            if (err) {
                console.log('err :', err);
            } else {
                req.breadcrumbs('All Campgrounds', '/');
                res.render('campgrounds/index', { campgrounds });
            }
        });
    }
});

// NEW - displays form to create a new campground
router.get('/new', middleware.ensureLoggedIn('/login'), (req, res) => {
    req.breadcrumbs('All Campgrounds', '/campgrounds');
    req.breadcrumbs('New Campground', '/new');
    res.render('campgrounds/new');
});
// CREATE - add a new campground to DB
router.post('/', middleware.ensureLoggedIn('/login'), upload.single('imageUpload'), (req, res) => {
    // req.body.newCampground.description = req.sanitize(req.body.newCampground.description);

    geocoder.geocode(req.body.campground.location, async (err, geolocationData) => {
        if (err || !geolocationData.length) {
            req.flash('error', 'Invalid Address');
            res.redirect('back');
        } else {
            const campCreatedBy = {
                id: req.user._id,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
            };

            const newCampground = {
                name: req.body.campground.name,
                description: req.body.campground.description,
                price: req.body.campground.price,
                location: geolocationData[0].formattedAddress,
                lat: geolocationData[0].latitude,
                lng: geolocationData[0].longitude,
                createdBy: campCreatedBy,
                images: [],
            };

            const images = [];
            if (req.body.campground.imageUrl) images.push(req.body.campground.imageUrl);
            if (req.file.path) images.push(req.file.path);
            // The function passed to new Promise is called the executor.
            // The resulting promise object has internal properties:
            // state — initially “pending”, then changes to either “fulfilled” or “rejected”,
            // result — an arbitrary value of your choosing, initially undefined.
            const resPromises = images.map(image => new Promise((resolve, reject) => {
                cloudinary.v2.uploader.upload(image, (err, result) => {
                    if (err) reject(err);
                    // sets state to "fulfilled",
                    // sets result to result.secure_url
                    else resolve(result.secure_url);
                });
            }));
            // It takes an iterable object with promises, technically it can be any iterable, but usually it’s an array,
            // and returns a new promise. The new promise resolves with when all of them are settled and has an array of their results.
            Promise.all(resPromises)
                .then(async (secureUrls) => {
                    secureUrls.forEach(url => newCampground.images.push(url));
                    try {
                        const campground = await Campground.create(newCampground);
                        const user = await User.findById(req.user._id).populate('followers').exec();
                        const newNotification = {
                            username: req.user.username,
                            campgroundId: campground.id,
                        };
                        // if there are a very large number of followers this is going to slow down the entire site
                        // TODO: need to delegate this to a background task
                        // eslint-disable-next-line no-restricted-syntax
                        for (const follower of user.followers) {
                            // eslint-disable-next-line no-await-in-loop
                            const notification = await Notification.create(newNotification);
                            follower.notifications.push(notification);
                            follower.save();
                        }

                        req.flash('success', 'Campground created successfully!');
                        res.redirect(`campgrounds/${campground._id}`);
                    } catch (err) {
                        console.log(err);
                        req.flash('error', err.message);
                        res.redirect('back');
                    }
                })
                .catch(err => console.log(err));

            console.log(newCampground);
        }
    });
});

// SHOW - shows info about one campground
router.get('/:id', (req, res) => {
    // console.log(req.params.id);
    // res.redirect('/');
    Campground.findById(req.params.id).populate('comments').exec((err, campground) => {
        if (err || !campground) {
            console.log(err);
            req.flash('error', 'The campground you wanted could not be found');
            res.redirect('back');
        } else {
            req.breadcrumbs('All Campgrounds', '/campgrounds');
            req.breadcrumbs(campground.name, `/campgrounds/${campground.id}`);
            res.render('campgrounds/show', { campground });
        }
    });
});

// EDIT - form to edit a campground's information
router.get('/:id/edit', middleware.ensureLoggedIn('/login'), middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id).populate('comments').exec((err, campground) => {
        req.breadcrumbs('All Campgrounds', '/campgrounds');
        req.breadcrumbs(campground.name, `/campgrounds/${campground.id}`);
        req.breadcrumbs('Edit', `/campgrounds/${campground.id}/edit`);
        res.render('campgrounds/edit', { campground });
    });
});
// UPDATE - save the edited campground
router.put('/:id', middleware.ensureLoggedIn('/login'), middleware.checkCampgroundOwnership, (req, res) => {
    geocoder.geocode(req.body.location, (err, geolocationData) => {
        if (err || !geolocationData.length) {
            req.flash('error', 'Invalid Address');
            res.redirect('back');
        } else {
            // TODO: Change this so that we geocode only if the location has changed.
            // const newData = {};
            // Object.assign(newData, req.body.campground);
            req.body.campground.location = geolocationData[0].formattedAddress;
            // newData.location = geolocationData[0].formattedAddress;
            req.body.campground.lat = geolocationData[0].latitude;
            req.body.campground.lng = geolocationData[0].longitude;
            // req.body.campground.description = req.sanitize(req.body.campground.description);
            Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground) => {
                if (err || !campground) {
                    console.log(err);
                    req.flash('error', 'The campground you wanted to update could not be found');
                    res.redirect('/');
                } else {
                    req.flash('success', 'Campground edited successfully!');
                    res.redirect(`${req.params.id}`);
                }
            });
        }
    });
});

// DELETE/DESTROY
router.delete('/:id', middleware.ensureLoggedIn('/login'), middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndDelete(req.params.id, (err) => {
        if (err) {
            console.log('err :', err);
            req.flash('error', 'The campground you wanted could not be found');
            res.redirect('back');
        } else {
            req.flash('success', 'Campground deleted successfully!');
            res.redirect('/campgrounds');
        }
    });
});

module.exports = router;
