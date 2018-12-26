const express = require('express');
const NodeGeocoder = require('node-geocoder');
const cloudinary = require('cloudinary');
const Campground = require('../models/campground');
const User = require('../models/user');
const Notification = require('../models/notification');
const middleware = require('../middleware');

const geocoder = NodeGeocoder({
    provider: 'google',
    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null,
});

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
            } else {
                req.breadcrumbs('All Campgrounds', '/campgrounds');
                if (campgrounds.length < 1) {
                    req.flash('error', 'There are no campgrounds we know that match that search');
                    res.redirect('/campgrounds');
                } else {
                    req.breadcrumbs('Search Results', `/campgrounds${req.query.search}`);
                    res.render('campgrounds/index', { campgrounds });
                }
            }
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
router.post('/', middleware.ensureLoggedIn('/login'), (req, res) => {
    // req.body.newCampground.description = req.sanitize(req.body.newCampground.description);

    geocoder.geocode(req.body.location, async (err, geolocationData) => {
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
                name: req.body.name,
                image: req.body.image,
                description: req.body.description,
                price: req.body.price,
                location: geolocationData[0].formattedAddress,
                lat: geolocationData[0].latitude,
                lng: geolocationData[0].longitude,
                createdBy: campCreatedBy,
            };

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
            req.breadcrumbs(campground.name, `//${campground.id}`);
            res.render('campgrounds/show', { campground, breadcrumbs: req.breadcrumbs() });
        }
    });
});

// EDIT - form to edit a campground's information
router.get('/:id/edit', middleware.ensureLoggedIn('/login'), middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id).populate('comments').exec((err, campground) => {
        req.breadcrumbs('All Campgrounds', '/campgrounds');
        req.breadcrumbs(campground.name, `//${campground.id}`);
        req.breadcrumbs('Edit', `//${campground.id}/edit`);
        res.render('campgrounds/edit', { campground, breadcrumbs: req.breadcrumbs() });
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
