const express = require('express');
const Campground = require('../models/campground');
const middleware = require('../middleware');
const NodeGeocoder = require('node-geocoder');

const geocoder = NodeGeocoder({
    provider: 'google',
    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null,
});

const router = express.Router({ mergeParams: true });

router.get('/', (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log('err :', err);
        } else {
            req.breadcrumbs('All Campgrounds', '/');
            res.render('campgrounds/index', { campgrounds, breadcrumbs: req.breadcrumbs() });
        }
    });
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

    geocoder.geocode(req.body.location, (err, geolocationData) => {
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

            Campground.create(newCampground, (err, campground) => {
                if (err) {
                    console.log(err);
                } else {
                    // campground.createdBy.id = req.user._id;
                    // // just so the name can be easily accessed, instead of having to search for the User db entry every time to get it
                    // campground.createdBy.firstName = req.user.firstName;
                    // campground.createdBy.lastName = req.user.lastName;
                    // campground.save();
                    req.flash('success', 'Campground created successfully!');
                    res.redirect(`campgrounds/${campground._id}`);
                }
            });
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
            res.redirect('/');
        }
    });
});

module.exports = router;
