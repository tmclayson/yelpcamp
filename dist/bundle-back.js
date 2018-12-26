require("source-map-support").install();
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./middleware/index.js":
/*!*****************************!*\
  !*** ./middleware/index.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
// middleware
const Campground = __webpack_require__(/*! ../models/campground */ "./models/campground.js");
const Comment = __webpack_require__(/*! ../models/comment */ "./models/comment.js");

module.exports = {

    checkCommentOwnership: function checkCommentOwnership(req, res, next) {
        // is user logged in?
        // ensureLoggedIn('/login')
        // if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, comment) => {
            // the !campground is needed for the case where an ID that appears valid (e.g. has the same number
            // of characters as a valid mongo ID) is passed  (e.g. by someone editing the URL) and null is then returned
            if (err || !comment) {
                console.log(err);
                req.flash('error', 'The comment you wanted could not be found');
                res.redirect('back');
            } else {
                // does the user own the campground?
                // eslint-disable-next-line no-lonely-if
                if (comment.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    req.flash('error', 'You don\'t have permission to do that');
                    res.redirect('back');
                }
            }
        });
    },

    // middleware
    checkCampgroundOwnership: function checkCampgroundOwnership(req, res, next) {
        // is user logged in?
        // ensureLoggedIn('/login')
        // if (req.isAuthenticated()) {
        Campground.findById(req.params.id).populate('comments').exec((err, campground) => {
            // the !campground is needed for the case where an ID that appears valid (e.g. has the same number
            // of characters as a valid mongo ID) is passed  (e.g. by someone editing the URL) and null is then returned
            if (err || !campground) {
                console.log(err);
                req.flash('error', 'The campground you wanted could not be found');
                res.redirect('back');
            } else {
                // does the user own the campground?
                // eslint-disable-next-line no-lonely-if
                if (campground.createdBy.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    req.flash('error', 'You don\'t have permission to do that');
                    res.redirect('back');
                }
            }
        });
    },
    /**
     * Ensure that a user is logged in before proceeding to next route middleware.
     *
     * This middleware ensures that a user is logged in.  If a request is received
     * that is unauthenticated, the request will be redirected to a login page (by
     * default to `/login`).
     *
     * Additionally, `returnTo` will be be set in the session to the URL of the
     * current request.  After authentication, this value can be used to redirect
     * the user to the page that was originally requested.
     *
     * Options:
     *   - `redirectTo`   URL to redirect to for login, defaults to _/login_
     *   - `setReturnTo`  set redirectTo in session, defaults to _true_
     *
     * Examples:
     *
     *     app.get('/profile',
     *       ensureLoggedIn(),
     *       function(req, res) { ... });
     *
     *     app.get('/profile',
     *       ensureLoggedIn('/signin'),
     *       function(req, res) { ... });
     *
     *     app.get('/profile',
     *       ensureLoggedIn({ redirectTo: '/session/new', setReturnTo: false }),
     *       function(req, res) { ... });
     *
     * @param {Object} options
     * @return {Function}
     * @api public
     */
    ensureLoggedIn: function ensureLoggedIn(options) {
        if (typeof options === 'string') {
            options = { redirectTo: options };
        }
        options = options || {};

        const url = options.redirectTo || '/login';
        const setReturnTo = (options.setReturnTo === undefined) ? true : options.setReturnTo;

        return function (req, res, next) {

            if (!req.isAuthenticated || !req.isAuthenticated()) {
                if (setReturnTo && req.session) {
                    req.session.returnTo = req.originalUrl || req.url;
                    console.log(`originalUrl: ${req.session.returnTo}`);
                }
                req.flash('error', 'You need to be logged in to do that');
                return res.redirect(url);
            }

            next();
        };
    },
    /**
     * Ensure that no user is logged in before proceeding to next route middleware.
     *
     * This middleware ensures that no user is logged in.  If a request is received
     * that is authenticated, the request will be redirected to another page (by
     * default to `/`).
     *
     * Options:
     *   - `redirectTo`   URL to redirect to in logged in, defaults to _/_
     *
     * Examples:
     *
     *     app.get('/login',
     *       ensureLoggedOut(),
     *       function(req, res) { ... });
     *
     *     app.get('/login',
     *       ensureLoggedOut('/home'),
     *       function(req, res) { ... });
     *
     *     app.get('/login',
     *       ensureLoggedOut({ redirectTo: '/home' }),
     *       function(req, res) { ... });
     *
     * @param {Object} options
     * @return {Function}
     * @api public
     */
    ensureLoggedOut: function ensureLoggedOut(options) {
        if (typeof options === 'string') {
            options = { redirectTo: options };
        }
        options = options || {};

        const url = options.redirectTo || '/';

        return function (req, res, next) {
            if (req.isAuthenticated && req.isAuthenticated()) {
                return res.redirect(url);
            }
            next();
        };
    },
};


/***/ }),

/***/ "./models/campground.js":
/*!******************************!*\
  !*** ./models/campground.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const mongoose = __webpack_require__(/*! mongoose */ "mongoose");
// pattern that states what properties a campground has
const campgroundSchema = new mongoose.Schema({
    name: { type: String, require: true, unique: true },
    currency: String,
    price: Number,
    image: { type: String, require: true },
    description: { type: String, require: true },
    location: { type: String, require: true },
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


/***/ }),

/***/ "./models/comment.js":
/*!***************************!*\
  !*** ./models/comment.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const mongoose = __webpack_require__(/*! mongoose */ "mongoose");
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


/***/ }),

/***/ "./models/notification.js":
/*!********************************!*\
  !*** ./models/notification.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const mongoose = __webpack_require__(/*! mongoose */ "mongoose");

const notificationSchema = new mongoose.Schema({
    username: String,
    campgroundId: String,
    isRead: { type: Boolean, default: false },
});

module.exports = mongoose.model('Notification', notificationSchema);


/***/ }),

/***/ "./models/user.js":
/*!************************!*\
  !*** ./models/user.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const mongoose = __webpack_require__(/*! mongoose */ "mongoose");
const passportLocalMongoose = __webpack_require__(/*! passport-local-mongoose */ "passport-local-mongoose");
// pattern that states what properties a user has
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    isAdmin: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    notifications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Notification',
        },
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
// compiles the schema into a model (object) that now includes all the methods we need
module.exports = mongoose.model('User', userSchema);


/***/ }),

/***/ "./routes/campgrounds.js":
/*!*******************************!*\
  !*** ./routes/campgrounds.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const express = __webpack_require__(/*! express */ "express");
const NodeGeocoder = __webpack_require__(/*! node-geocoder */ "node-geocoder");
const cloudinary = __webpack_require__(/*! cloudinary */ "cloudinary");
const Campground = __webpack_require__(/*! ../models/campground */ "./models/campground.js");
const User = __webpack_require__(/*! ../models/user */ "./models/user.js");
const Notification = __webpack_require__(/*! ../models/notification */ "./models/notification.js");
const middleware = __webpack_require__(/*! ../middleware */ "./middleware/index.js");

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


/***/ }),

/***/ "./routes/comments.js":
/*!****************************!*\
  !*** ./routes/comments.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable no-param-reassign */
const express = __webpack_require__(/*! express */ "express");
const Campground = __webpack_require__(/*! ../models/campground */ "./models/campground.js");
const Comment = __webpack_require__(/*! ../models/comment */ "./models/comment.js");
const breadcrumbs = __webpack_require__(/*! express-breadcrumbs */ "express-breadcrumbs");
const middleware = __webpack_require__(/*! ../middleware */ "./middleware/index.js");
const router = express.Router({ mergeParams: true });

// eslint-disable-next-line consistent-return
// function isLoggedIn(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     res.redirect('/login');
// }
// NEW - displays form to create a new comment
router.get('/new', middleware.ensureLoggedIn('/login'), (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err || campground) {
            console.log(err);
            req.flash('error', 'The campground you wanted to add a comment to could not be found');
            res.redirect('back');
        } else {
            req.breadcrumbs('All Campgrounds', '/campgrounds');
            req.breadcrumbs(campground.name, `/campgrounds/${campground.id}`);
            req.breadcrumbs('Add Comment', `/campgrounds/${campground.id}/comments/new`);
            res.render('comments/new', { campground });
        }
    });
});
// CREATE - add a new comment to a campground and save to DB
router.post('/', middleware.ensureLoggedIn('/login'), (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            res.redirect('/campgrounds'); // TODO: handle this better
            console.log(err);
        } else {
            // eslint-disable-next-line no-shadow
            Comment.create(req.body.newComment, (err, comment) => {
                if (err) {
                    res.redirect('/campgrounds'); // TODO: handle this better
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    // just so the name can be easily accessed, instead of having to search for the User db entry every time to get it
                    console.log(req.user.firstName);
                    console.log(req.user.lastName);
                    comment.author.firstName = req.user.firstName;
                    comment.author.lastName = req.user.lastName;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash('success', 'Comment added successfully!');
                    res.redirect(`/campgrounds/${campground.id}`);
                }
            });
        }
    });
});

// EDIT - form to edit a comment
router.get('/:comment_id/edit', middleware.ensureLoggedIn('/login'), middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err || !foundComment) {
            req.flash('error', 'The comment you wanted could not be found')
            res.redirect('back');
        } else {
            Campground.findById(req.params.id, (err, campground) => {
                if (err || !campground) {
                    req.flash('error', 'The campground you wanted could not be found');
                    res.redirect('back');
                } else {
                    req.breadcrumbs('All Campgrounds', '/');
                    req.breadcrumbs(campground.name, `//${campground.id}`);
                    req.breadcrumbs('Edit Comment', `//${campground.id}/comments/${foundComment.id}/edit`);
                    res.render('comments/edit', { campground_id: req.params.id, comment: foundComment });
                }
            });
        }
    });
});
// UPDATE - save the edited campground
router.put('/:comment_id', middleware.ensureLoggedIn('/login'), middleware.checkCommentOwnership, (req, res) => {
    // req.body.campground.description = req.sanitize(req.body.campground.description);
    Campground.findById(req.params.id, (err, campground) => {
        if (err || !campground) {
            req.flash('error', 'The campground you tried to update a comment on could not be found');
            res.redirect('back');
        } else {
            Comment.findByIdAndUpdate(req.params.comment_id, req.body.updatedComment, (err) => {
                if (err) {
                    console.log(err);
                    res.redirect('/');
                } else {
                    req.flash('success', 'Comment updated successfully!');
                    res.redirect(`/campgrounds/${req.params.id}`);
                }
            });
        }
    });
});

// DELETE/DESTROY
router.delete('/:id', middleware.ensureLoggedIn('/login'), middleware.checkCommentOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err || !campground) {
            req.flash('error', 'The campground you tried to delete a comment on could not be found');
            res.redirect('back');
        } else {
            Campground.findByIdAndDelete(req.params.id, (err) => {
                if (err) {
                    console.log('err :', err);
                    req.flash('error', 'The comment you wanted to delete could not be found');
                    res.redirect('back');
                } else {
                    req.flash('success', 'Comment deleted successfully!');
                    res.redirect('back');
                }
            });
        }
    });
});


module.exports = router;


/***/ }),

/***/ "./routes/index.js":
/*!*************************!*\
  !*** ./routes/index.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable no-lonely-if */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
const express = __webpack_require__(/*! express */ "express");
const passport = __webpack_require__(/*! passport */ "passport");
const async = __webpack_require__(/*! async */ "async");
const nodemailer = __webpack_require__(/*! nodemailer */ "nodemailer");
const crypto = __webpack_require__(/*! crypto */ "crypto");
const User = __webpack_require__(/*! ../models/user */ "./models/user.js");
const Notification = __webpack_require__(/*! ../models/notification */ "./models/notification.js");
const middleware = __webpack_require__(/*! ../middleware */ "./middleware/index.js");

const router = express.Router({ mergeParams: true });

router.get('/', (req, res) => {
    res.render('landing');
});

// router.get('/secret', middleware.ensureLoggedIn('/login'), (req, res) => {
//     req.breadcrumbs('Secret Page!', '/secret');
//     res.render('secret');
// });

// render login form
router.get('/login', (req, res) => {
    req.breadcrumbs('Login', '/login');
    res.render('users/login');
});
// passport.authenticate passed as middleware
// router.post('/login', passport.authenticate('local', {
//     successRedirect: '/campgrounds',
//     failureRedirect: '/login',
// }), () => { });
router.post('/login', passport.authenticate('local', {
    successReturnToOrRedirect: '/campgrounds',
    failureRedirect: '/login',
}));

router.get('/logout', (req, res) => {
    // Perform Action to Logout
    req.logout();

    res.redirect('/');
});

// user profile
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('followers').exec();
        res.render('users/profile', { user });
    } catch (err) {
        req.flash('error', err.message);
        return res.redirect('back');
    }
});

// follow user
router.get('/follow/:id', middleware.ensureLoggedIn('/login'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        user.followers.push(req.user._id);
        user.save();
        req.flash('success', `Successfully followed ${user.firstName}!`);
        res.redirect(`/users/${req.params.id}`);
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('back');
    }
});

// view all notifications
router.get('/notifications', middleware.ensureLoggedIn('/login'), async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: 'notifications',
            options: { sort: { _id: -1 } },
        }).exec();
        const allNotifications = user.notifications;
        res.render('notifications/index', { allNotifications });
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('back');
    }
});

// handle notification
router.get('/notifications/:id', middleware.ensureLoggedIn('/login'), async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        notification.isRead = true;
        notification.save();
        res.redirect(`/campgrounds/${notification.campgroundId}`);
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('back');
    }
});

// FORGOTTEN PASSWORD - form
router.get('/forgot', (req, res) => {
    req.breadcrumbs('Forgotten Password', '/forgot');
    res.render('users/forgot');
});

// FORGOTTEN PASSWORD - generate reset token and send email to user, inviting them to reset their password
router.post('/forgot', (req, res, next) => {
    // array of functions that are called one after another
    async.waterfall([
        (done) => {
            // generate a random hexadecimal string
            crypto.randomBytes(20, (err, buf) => {
                if (err) {
                    console.log(err);
                    req.flash('error', 'There was an error encountered while generating the reset token. The administrator has been notified.');
                    return res.redirect('/forgot');
                }
                const token = buf.toString('hex');
                done(err, token);
            });
        },
        (token, done) => {
            User.findOne({ email: req.body.email }, (err, foundUser) => {
                // if no user with the email given can be found, redirect to forgotten password page and inform user of error
                if (!foundUser) {
                    req.flash('error', 'no account with that email address exists');
                    return res.redirect('/forgot');
                }
                // otherwise, save the token and expiry point to the user document in db.
                foundUser.resetPasswordToken = token;
                foundUser.resetPasswordExpires = Date.now() + 3600000;
                console.log(`resetPasswordExpires${foundUser.resetPasswordExpires}`);
                foundUser.save((err, updatedUser) => {
                    if (err) {
                        console.log(err);
                        req.flash('error', 'There was an error encountered while saving the token to your user entry. The administrator has been notified.');
                        return res.redirect('/forgot');
                    }
                    done(err, token, updatedUser);
                });
            });
        },
        (token, user, done) => {
            const smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'tmclayson@gmail.com',
                    pass: process.env.GMAILPW,
                },
            });
            // eslint-disable-next-line prefer-template
            const message = 'You are receiving this because you (or someone else) have requested to reset the\n'
                + `password associated with the email address ${user.email}. \n\n`
                + 'Please click on the following link, or paste this link into your browser to complete the process.\n\n'
                + `http://${req.headers.host}/reset/${token} \n\n`
                + 'If you did not request this, please ignore this email and your password will remain unchanged.';
            const mailOptions = {
                to: user.email,
                from: 'tmclayson@gmail.com',
                subject: 'Password Reset',
                text: message,
            };
            smtpTransport.sendMail(mailOptions, () => {
                console.log(`Recovery email sent to ${user.email}`);
                req.flash('success', `An email has been sent to ${user.email} with further instructions.`);
                return res.redirect('/forgot/email-sent');
            });
        },
    ], (err) => {
        if (err) {
            next(err);
        } else {
            res.redirect('/forgot');
        }
    });
});

// RESET password - form
router.get('/reset/:token', (req, res) => {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            res.redirect('/forgot');
        } else {
            req.breadcrumbs('Reset Password', '/reset');
            res.render('users/reset', { token: req.params.token });
        }
    });
});

// RESET password - save updated password
router.post('/reset/:token', (req, res) => {
    async.waterfall([
        (done) => {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, foundUser) => {
                console.log(`foundUser${foundUser}`);
                if (!foundUser) {
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect('back');
                }

                if (req.body.newPassword === req.body.confirmPassword) {
                    foundUser.setPassword(req.body.newPassword, (err) => {
                        if (err) {
                            console.log(err);
                            req.flash('error', 'An error was encountered while attempting to set the new password.');
                            return res.redirect('back');
                        }
                        foundUser.resetPasswordToken = undefined;
                        foundUser.resetPasswordExpires = undefined;
                        // console.log(`foundUser${foundUser}`);
                        foundUser.save((err, foundUser) => {
                            if (err) {
                                console.log(err);
                                req.flash('error', 'An error was encountered while attempting to save the user document after setting the new password.');
                                return res.redirect('back');
                            }
                            console.log(`updatedUser${foundUser}`);
                            req.login(foundUser, (err) => {
                                if (err) {
                                    console.log(err);
                                }
                                done(err, foundUser);
                            });
                        });
                    });
                } else {
                    req.flash('error', 'The passwords entered didn\'t match');
                    return res.redirect('back');
                }
            });
        },
        (user, done) => {
            const smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'tmclayson@gmail.com',
                    pass: process.env.GMAILPW,
                },
            });
            const mailOptions = {
                to: user.email,
                from: 'tmclayson@gmail.com',
                subject: 'Your password has been changed',
                text: `Hi,

               This email is to confirm that the password for the account associated with ${user.email} has been changed.`,
            };
            smtpTransport.sendMail(mailOptions, (err) => {
                // TODO: handle error
                console.log(`The password for the account associated with ${user.email} has been changed`);
                req.flash('success', 'Success! Your password has been changed.');
                return res.redirect('/campgrounds');
            });
        },
    ], (err) => {
        console.log(err);
        req.flash('error', 'An error was encountered whilst attempting to change your password. The administrator has been informed.');
        res.redirect('/campgrounds');
    });
});

// render login form
router.get('/forgot/email-sent', (req, res) => {
    req.breadcrumbs('Password Reset Email Sent', '/forgot/email-sent');
    res.render('users/forgot_email_sent');
});

// NEW user form
router.get('/register', (req, res) => {
    req.breadcrumbs('Register', '/register');
    res.render('users/register');
});

// CREATE new user and redirect
router.post('/register', (req, res, next) => {
    // make a new User object, that isn't saved to the database, yet.
    // we don't save the password to the database
    // User.register hashes the password and returns a new user object containing the username and hashed password
    // eslint-disable-next-line consistent-return
    User.register(new User({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    }), req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            req.breadcrumbs('Register', '/register');
            req.flash('error', err.message);
            // you can either set a flash message on the req.flash object before returning a res.redirect()
            // OR you can pass the req.flash object into the res.render() function.
            return res.redirect('/register');
        }
        console.log(user);
        // passport.authenticate actually logs the user in, using the local strategy
        // eslint-disable-next-line no-shadow
        req.login(user, (err) => {
            if (err) {
                console.log(err);
                return next(err);
            }
            req.flash('success', 'Thanks for signing up!');
            return res.redirect('/campgrounds');
        });
    });
});
// if (err) {
//     console.log(err);
//     req.breadcrumbs('Register', '/register');
//     console.log('ERROR!!!!!!!!!!!!!!!!');
//     return res.render('register');
// }
// console.log('OK!!!!!!!!!!!!!!!!');
// // passport.authenticate actually logs the user in, using the local strategy
// passport.authenticate('local')(req, res, () => {
//     console.log('HERE!!!!!!!!!!!!!!!!');
//     res.redirect('/campgrounds');
// });

module.exports = router;


/***/ }),

/***/ "./src/back/app.js":
/*!*************************!*\
  !*** ./src/back/app.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// SETUP ======================================================================
__webpack_require__(/*! dotenv */ "dotenv").config();

const express = __webpack_require__(/*! express */ "express");
const bodyParser = __webpack_require__(/*! body-parser */ "body-parser");
const methodOverride = __webpack_require__(/*! method-override */ "method-override");
const breadcrumbs = __webpack_require__(/*! express-breadcrumbs */ "express-breadcrumbs");
const passport = __webpack_require__(/*! passport */ "passport");
// const localStrategy = require('passport-local').Strategy;
const mongoose = __webpack_require__(/*! mongoose */ "mongoose");
const morgan = __webpack_require__(/*! morgan */ "morgan");
const session = __webpack_require__(/*! express-session */ "express-session");
const MemoryStore = __webpack_require__(/*! memorystore */ "memorystore")(session);
const flash = __webpack_require__(/*! connect-flash */ "connect-flash");


const seedDB = __webpack_require__(/*! ./seeds */ "./src/back/seeds.js");
const init = __webpack_require__(/*! ./init */ "./src/back/init.js");
// const lib = require('./assets/lib/js/mylibrary');

const User = __webpack_require__(/*! ../../models/user */ "./models/user.js");
// requiring routes
const commentRoutes = __webpack_require__(/*! ../../routes/comments */ "./routes/comments.js");
const campgroundRoutes = __webpack_require__(/*! ../../routes/campgrounds */ "./routes/campgrounds.js");
const indexRoutes = __webpack_require__(/*! ../../routes/index */ "./routes/index.js");

// CONFIGURATION ===============================================================
mongoose.connect(`mongodb://${process.env.DB_HOST}/yelpcamp`, { useNewUrlParser: true });

const app = express();

// EXPRESS SETUP
app.set('view engine', 'ejs');
app.use(flash());
// app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(breadcrumbs.init());
app.use(breadcrumbs.setHome({
    name: 'Landing',
}));
app.use(express.static('public'));

// PASSPORT CONFIGURATION
app.use(session({
    store: new MemoryStore({
        checkPeriod: 86400000, // prune expired entries every 24h
    }),
    secret: 'Cheese Rolling',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// this must come after the passport setup
app.use(async (req, res, next) => {
    res.locals.currentUser = req.user;
    if (req.user) {
        try {
            // populate the user's notifications, but only thoe they haven't read yet
            const user = await User.findById(req.user._id).populate('notifications', null, { isRead: false }).exec();
            res.locals.notifications = user.notifications.reverse(); // .reverse() outputs in descending order
        } catch (err) {
            console.log(err.message);
        }
    }
    res.locals.errorMessage = req.flash('error');
    res.locals.successMessage = req.flash('success');
    res.locals.breadcrumbs = req.breadcrumbs();
    next();
});

// ROUTES ===============================================================
app.use('/', indexRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);

// seedDB();
init()
    .then(() => {
        // LAUNCH ===============================================================
        app.listen(process.env.PORT, 'localhost', () => {
            console.log('Server has started!');
        });
    })
    .catch((err) => {
        console.log(err);
    });

/*
app.get('/search', (req, res) => {
    res.render('search');
});

app.post('/results', (req, res) => {
    const searchQuery = {};
    searchQuery.s = req.body.title;
    searchQuery.y = req.body.year;
    searchQuery.plot = req.body.plot;

    const endpoint = 'http://www.omdbapi.com/?apikey=a281818e&';
    const queryString = lib.buildQuery(searchQuery);
    // console.log(endpoint + queryString);

    request(endpoint + queryString, (error, response, body) => {
        if (error) {
            console.log(`error ${error}`);
        } else if (response.statusCode === 200) {
            const data = JSON.parse(body);
            res.render('results', { data });
        }
    });
    // res.redirect('/friends');
});

app.get('/speak/:animal(pig|cow|dog)', (req, res) => {
    const sounds = {
        pig: 'Oink',
        cow: 'Moo',
        dog: 'Woof Woof',
    };
    const animalReq = req.params.animal.toLowerCase(); // lowerCase so that only one entry is needed in the sounds object
    console.log(req.params);
    res.send(`The ${animalReq} says "${sounds[animalReq]}"!`);
});

app.get('/repeat/:phrase(hello|blah)/:repetitions', (req, res) => {
    const { phrase, repetitions } = req.params;
    let response = phrase;
    for (let index = 1; index < Number(repetitions); index += 1) {
        response = `${response} ${phrase}`;
    }
    res.send(response);
});

app.post('/addfriend', (req, res) => {
    const { newfriend } = req.body;
    friends.push(newfriend);
    res.redirect('/friends');
    // res.send('<h1>Welcome to the home page!</h1>');
});

app.get('/friends', (req, res) => {
    res.render('friends', { friends });
});

app.get('/fallinlovewith/:thing', (req, res) => {
    // req.params is an object, not an array, so const [,thing] does not work.
    const { thing } = req.params;
    res.render('love.ejs', { thing });
});

app.get('/posts', (req, res) => {
    const posts = [
        { title: 'Post 1', author: 'Susy' },
        { title: 'Post 2', author: 'Charlie' },
        { title: 'Post 3', author: 'Colt' },
    ];

    res.render('posts.ejs', { posts });
});
*/


/***/ }),

/***/ "./src/back/init.js":
/*!**************************!*\
  !*** ./src/back/init.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const User = __webpack_require__(/*! ../../models/user */ "./models/user.js");

module.exports = () => new Promise((resolve) => {
    User.findOne({ email: process.env.ADMIN_EMAIL }, (err, user) => {

        if (err) {
            throw err;
        }

        console.log(user);

        if (user === null) {
            User.register(new User({
                email: process.env.ADMIN_EMAIL,
                firstName: '',
                lastName: '',
                isAdmin: true,
            }), process.env.ADMIN_PASSWORD, (err) => {
                if (err) {
                    throw err;
                } else {
                    resolve();
                }
            });
        } else {
            resolve();
        }
    });
});


/***/ }),

/***/ "./src/back/seeds.js":
/*!***************************!*\
  !*** ./src/back/seeds.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
const Campground = __webpack_require__(/*! ../../models/campground */ "./models/campground.js");
const Comment = __webpack_require__(/*! ../../models/comment */ "./models/comment.js");

const data = [
    // {
    //     name: "Cloud's Rest",
    //     image: 'https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg',
    //     price: 5,
    //     description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    // },
    // {
    //     name: 'Desert Mesa',
    //     image: 'https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg',
    //     price: 8,
    //     description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    // },
    // {
    //     name: 'Canyon Floor',
    //     image: 'https://farm1.staticflickr.com/189/493046463_841a18169e.jpg',
    //     price: 11,
    //     description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    // },
    {
        name: 'Guadarama',
        image: 'https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg',
        price: 8,
        description: 'Its a word in Spanish. Near Madrid originally. Americans stole it as is their habit.',
    },
    {
        name: 'Mountain Goat\'s Rest',
        image: 'https://farm3.staticflickr.com/2839/11407596925_481e8aab72_o_d.jp',
        price: 27,
        description: 'Mountain goats tend to like to rest here. You may or may not like that. They can smell.',
    },
    {
        name: 'Granite Hill',
        price: 42,
        image: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Deep_Lake_tenting_campsite_-_Riding_Mountain_National_Park.JPG',
        description: 'A huge granite hill, no bathrooms. No water. Just granite.',
    },
    {
        name: 'Salmon Creek',
        price: 12,
        image: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Campsites_%286105930497%29.jpg',
        description: 'A creek with a lot of Salmon in it',
    },
];

function seedDB() {
    // Remove all campgrounds
    Campground.remove({}, (err) => {
        if (err) {
            console.log(err);
        }
        console.log('removed campgrounds!');
        Comment.remove({}, (err) => {
            if (err) {
                console.log(err);
            }
            console.log('removed comments!');
            // add a few campgrounds
            // data.forEach((seed) => {
            //     Campground.create(seed, (err, campground) => {
            //         if (err) {
            //             console.log(err);
            //         } else {
            //             console.log('added a campground');
            //             campground.createdBy.id = '5c12444c89190b2f78082566';
            //             campground.createdBy.firstName = 'admin';
            //             campground.createdBy.lastName = 'istrator';
            //             campground.save();
            //         }
            //     });
            // });
        });
    });
    // add a few comments
}

module.exports = seedDB;


/***/ }),

/***/ 0:
/*!*******************************!*\
  !*** multi ./src/back/app.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./src/back/app.js */"./src/back/app.js");


/***/ }),

/***/ "async":
/*!************************!*\
  !*** external "async" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("async");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),

/***/ "cloudinary":
/*!*****************************!*\
  !*** external "cloudinary" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cloudinary");

/***/ }),

/***/ "connect-flash":
/*!********************************!*\
  !*** external "connect-flash" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("connect-flash");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("dotenv");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "express-breadcrumbs":
/*!**************************************!*\
  !*** external "express-breadcrumbs" ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express-breadcrumbs");

/***/ }),

/***/ "express-session":
/*!**********************************!*\
  !*** external "express-session" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express-session");

/***/ }),

/***/ "memorystore":
/*!******************************!*\
  !*** external "memorystore" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("memorystore");

/***/ }),

/***/ "method-override":
/*!**********************************!*\
  !*** external "method-override" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("method-override");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),

/***/ "morgan":
/*!*************************!*\
  !*** external "morgan" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),

/***/ "node-geocoder":
/*!********************************!*\
  !*** external "node-geocoder" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("node-geocoder");

/***/ }),

/***/ "nodemailer":
/*!*****************************!*\
  !*** external "nodemailer" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("nodemailer");

/***/ }),

/***/ "passport":
/*!***************************!*\
  !*** external "passport" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("passport");

/***/ }),

/***/ "passport-local-mongoose":
/*!******************************************!*\
  !*** external "passport-local-mongoose" ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("passport-local-mongoose");

/***/ })

/******/ });
//# sourceMappingURL=bundle-back.js.map