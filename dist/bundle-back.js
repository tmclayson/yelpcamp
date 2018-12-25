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

eval("/* eslint-disable consistent-return */\r\n/* eslint-disable no-param-reassign */\r\n/* eslint-disable func-names */\r\n// middleware\r\nconst Campground = __webpack_require__(/*! ../models/campground */ \"./models/campground.js\");\r\nconst Comment = __webpack_require__(/*! ../models/comment */ \"./models/comment.js\");\r\n\r\nmodule.exports = {\r\n\r\n    checkCommentOwnership: function checkCommentOwnership(req, res, next) {\r\n        // is user logged in?\r\n        // ensureLoggedIn('/login')\r\n        // if (req.isAuthenticated()) {\r\n        Comment.findById(req.params.comment_id, (err, comment) => {\r\n            // the !campground is needed for the case where an ID that appears valid (e.g. has the same number\r\n            // of characters as a valid mongo ID) is passed  (e.g. by someone editing the URL) and null is then returned\r\n            if (err || !comment) {\r\n                console.log(err);\r\n                req.flash('error', 'The comment you wanted could not be found');\r\n                res.redirect('back');\r\n            } else {\r\n                // does the user own the campground?\r\n                // eslint-disable-next-line no-lonely-if\r\n                if (comment.author.id.equals(req.user._id) || req.user.isAdmin) {\r\n                    next();\r\n                } else {\r\n                    req.flash('error', 'You don\\'t have permission to do that');\r\n                    res.redirect('back');\r\n                }\r\n            }\r\n        });\r\n    },\r\n\r\n    // middleware\r\n    checkCampgroundOwnership: function checkCampgroundOwnership(req, res, next) {\r\n        // is user logged in?\r\n        // ensureLoggedIn('/login')\r\n        // if (req.isAuthenticated()) {\r\n        Campground.findById(req.params.id).populate('comments').exec((err, campground) => {\r\n            // the !campground is needed for the case where an ID that appears valid (e.g. has the same number\r\n            // of characters as a valid mongo ID) is passed  (e.g. by someone editing the URL) and null is then returned\r\n            if (err || !campground) {\r\n                console.log(err);\r\n                req.flash('error', 'The campground you wanted could not be found');\r\n                res.redirect('back');\r\n            } else {\r\n                // does the user own the campground?\r\n                // eslint-disable-next-line no-lonely-if\r\n                if (campground.createdBy.id.equals(req.user._id) || req.user.isAdmin) {\r\n                    next();\r\n                } else {\r\n                    req.flash('error', 'You don\\'t have permission to do that');\r\n                    res.redirect('back');\r\n                }\r\n            }\r\n        });\r\n    },\r\n    /**\r\n     * Ensure that a user is logged in before proceeding to next route middleware.\r\n     *\r\n     * This middleware ensures that a user is logged in.  If a request is received\r\n     * that is unauthenticated, the request will be redirected to a login page (by\r\n     * default to `/login`).\r\n     *\r\n     * Additionally, `returnTo` will be be set in the session to the URL of the\r\n     * current request.  After authentication, this value can be used to redirect\r\n     * the user to the page that was originally requested.\r\n     *\r\n     * Options:\r\n     *   - `redirectTo`   URL to redirect to for login, defaults to _/login_\r\n     *   - `setReturnTo`  set redirectTo in session, defaults to _true_\r\n     *\r\n     * Examples:\r\n     *\r\n     *     app.get('/profile',\r\n     *       ensureLoggedIn(),\r\n     *       function(req, res) { ... });\r\n     *\r\n     *     app.get('/profile',\r\n     *       ensureLoggedIn('/signin'),\r\n     *       function(req, res) { ... });\r\n     *\r\n     *     app.get('/profile',\r\n     *       ensureLoggedIn({ redirectTo: '/session/new', setReturnTo: false }),\r\n     *       function(req, res) { ... });\r\n     *\r\n     * @param {Object} options\r\n     * @return {Function}\r\n     * @api public\r\n     */\r\n    ensureLoggedIn: function ensureLoggedIn(options) {\r\n        if (typeof options === 'string') {\r\n            options = { redirectTo: options };\r\n        }\r\n        options = options || {};\r\n\r\n        const url = options.redirectTo || '/login';\r\n        const setReturnTo = (options.setReturnTo === undefined) ? true : options.setReturnTo;\r\n\r\n        return function (req, res, next) {\r\n\r\n            if (!req.isAuthenticated || !req.isAuthenticated()) {\r\n                if (setReturnTo && req.session) {\r\n                    req.session.returnTo = req.originalUrl || req.url;\r\n                    console.log(`originalUrl: ${req.session.returnTo}`);\r\n                }\r\n                req.flash('error', 'You need to be logged in to do that');\r\n                return res.redirect(url);\r\n            }\r\n\r\n            next();\r\n        };\r\n    },\r\n    /**\r\n     * Ensure that no user is logged in before proceeding to next route middleware.\r\n     *\r\n     * This middleware ensures that no user is logged in.  If a request is received\r\n     * that is authenticated, the request will be redirected to another page (by\r\n     * default to `/`).\r\n     *\r\n     * Options:\r\n     *   - `redirectTo`   URL to redirect to in logged in, defaults to _/_\r\n     *\r\n     * Examples:\r\n     *\r\n     *     app.get('/login',\r\n     *       ensureLoggedOut(),\r\n     *       function(req, res) { ... });\r\n     *\r\n     *     app.get('/login',\r\n     *       ensureLoggedOut('/home'),\r\n     *       function(req, res) { ... });\r\n     *\r\n     *     app.get('/login',\r\n     *       ensureLoggedOut({ redirectTo: '/home' }),\r\n     *       function(req, res) { ... });\r\n     *\r\n     * @param {Object} options\r\n     * @return {Function}\r\n     * @api public\r\n     */\r\n    ensureLoggedOut: function ensureLoggedOut(options) {\r\n        if (typeof options === 'string') {\r\n            options = { redirectTo: options };\r\n        }\r\n        options = options || {};\r\n\r\n        const url = options.redirectTo || '/';\r\n\r\n        return function (req, res, next) {\r\n            if (req.isAuthenticated && req.isAuthenticated()) {\r\n                return res.redirect(url);\r\n            }\r\n            next();\r\n        };\r\n    },\r\n};\r\n\n\n//# sourceURL=webpack:///./middleware/index.js?");

/***/ }),

/***/ "./models/campground.js":
/*!******************************!*\
  !*** ./models/campground.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\r\n// pattern that states what properties a campground has\r\nconst campgroundSchema = new mongoose.Schema({\r\n    name: { type: String, require: true, unique: true },\r\n    currency: String,\r\n    price: Number,\r\n    image: { type: String, require: true },\r\n    description: { type: String, require: true },\r\n    location: { type: String, require: true },\r\n    lat: Number,\r\n    lng: Number,\r\n    comments: [\r\n        {\r\n            type: mongoose.Schema.Types.ObjectId,\r\n            ref: 'Comment',\r\n        },\r\n    ],\r\n    createdBy: {\r\n        id: {\r\n            type: mongoose.Schema.Types.ObjectId,\r\n            ref: 'User',\r\n        },\r\n        firstName: String,\r\n        lastName: String,\r\n    },\r\n});\r\n// compiles the schema into a model (object) that now includes all the methods we need\r\nmodule.exports = mongoose.model('Campground', campgroundSchema);\r\n\n\n//# sourceURL=webpack:///./models/campground.js?");

/***/ }),

/***/ "./models/comment.js":
/*!***************************!*\
  !*** ./models/comment.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\r\n// pattern that states what properties a comment has\r\nconst commentSchema = new mongoose.Schema({\r\n    text: String,\r\n    author: {\r\n        id: {\r\n            type: mongoose.Schema.Types.ObjectId,\r\n            ref: 'User',\r\n        },\r\n        firstName: String,\r\n        lastName: String,\r\n    },\r\n    // default schema option as a function reference. Mongoose will execute it and\r\n    // use the return value as the default.\r\n    created: { type: Date, default: Date.now },\r\n});\r\n// compiles the schema into a model (object) that now includes all the methods we need\r\nmodule.exports = mongoose.model('Comment', commentSchema);\r\n\n\n//# sourceURL=webpack:///./models/comment.js?");

/***/ }),

/***/ "./models/notification.js":
/*!********************************!*\
  !*** ./models/notification.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\r\n\r\nconst notificationSchema = new mongoose.Schema({\r\n    username: String,\r\n    campgroundId: String,\r\n    isRead: { type: Boolean, default: false },\r\n});\r\n\r\nmodule.exports = mongoose.model('Notification', notificationSchema);\r\n\n\n//# sourceURL=webpack:///./models/notification.js?");

/***/ }),

/***/ "./models/user.js":
/*!************************!*\
  !*** ./models/user.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\r\nconst passportLocalMongoose = __webpack_require__(/*! passport-local-mongoose */ \"passport-local-mongoose\");\r\n// pattern that states what properties a user has\r\nconst userSchema = new mongoose.Schema({\r\n    firstName: String,\r\n    lastName: String,\r\n    email: { type: String, require: true, unique: true },\r\n    password: { type: String, require: true },\r\n    isAdmin: { type: Boolean, default: false },\r\n    resetPasswordToken: String,\r\n    resetPasswordExpires: Date,\r\n    notifications: [\r\n        {\r\n            type: mongoose.Schema.Types.ObjectId,\r\n            ref: 'Notification',\r\n        },\r\n    ],\r\n    followers: [\r\n        {\r\n            type: mongoose.Schema.Types.ObjectId,\r\n            ref: 'User',\r\n        },\r\n    ],\r\n});\r\n\r\nuserSchema.plugin(passportLocalMongoose, { usernameField: 'email' });\r\n// compiles the schema into a model (object) that now includes all the methods we need\r\nmodule.exports = mongoose.model('User', userSchema);\r\n\n\n//# sourceURL=webpack:///./models/user.js?");

/***/ }),

/***/ "./routes/campgrounds.js":
/*!*******************************!*\
  !*** ./routes/campgrounds.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const express = __webpack_require__(/*! express */ \"express\");\r\nconst NodeGeocoder = __webpack_require__(/*! node-geocoder */ \"node-geocoder\");\r\nconst Campground = __webpack_require__(/*! ../models/campground */ \"./models/campground.js\");\r\nconst User = __webpack_require__(/*! ../models/user */ \"./models/user.js\");\r\nconst Notification = __webpack_require__(/*! ../models/notification */ \"./models/notification.js\");\r\nconst middleware = __webpack_require__(/*! ../middleware */ \"./middleware/index.js\");\r\n\r\nconst geocoder = NodeGeocoder({\r\n    provider: 'google',\r\n    // Optional depending on the providers\r\n    httpAdapter: 'https', // Default\r\n    apiKey: process.env.GEOCODER_API_KEY,\r\n    formatter: null,\r\n});\r\n\r\nconst router = express.Router({ mergeParams: true });\r\n\r\nrouter.get('/', (req, res) => {\r\n    Campground.find({}, (err, campgrounds) => {\r\n        if (err) {\r\n            console.log('err :', err);\r\n        } else {\r\n            req.breadcrumbs('All Campgrounds', '/');\r\n            res.render('campgrounds/index', { campgrounds, breadcrumbs: req.breadcrumbs() });\r\n        }\r\n    });\r\n});\r\n\r\n// NEW - displays form to create a new campground\r\nrouter.get('/new', middleware.ensureLoggedIn('/login'), (req, res) => {\r\n    req.breadcrumbs('All Campgrounds', '/campgrounds');\r\n    req.breadcrumbs('New Campground', '/new');\r\n    res.render('campgrounds/new');\r\n});\r\n// CREATE - add a new campground to DB\r\nrouter.post('/', middleware.ensureLoggedIn('/login'), (req, res) => {\r\n    // req.body.newCampground.description = req.sanitize(req.body.newCampground.description);\r\n\r\n    geocoder.geocode(req.body.location, async (err, geolocationData) => {\r\n        if (err || !geolocationData.length) {\r\n            req.flash('error', 'Invalid Address');\r\n            res.redirect('back');\r\n        } else {\r\n            const campCreatedBy = {\r\n                id: req.user._id,\r\n                firstName: req.user.firstName,\r\n                lastName: req.user.lastName,\r\n            };\r\n\r\n            const newCampground = {\r\n                name: req.body.name,\r\n                image: req.body.image,\r\n                description: req.body.description,\r\n                price: req.body.price,\r\n                location: geolocationData[0].formattedAddress,\r\n                lat: geolocationData[0].latitude,\r\n                lng: geolocationData[0].longitude,\r\n                createdBy: campCreatedBy,\r\n            };\r\n\r\n            try {\r\n                const campground = await Campground.create(newCampground);\r\n                const user = await User.findById(req.user._id).populate('followers').exec();\r\n                const newNotification = {\r\n                    username: req.user.username,\r\n                    campgroundId: campground.id,\r\n                };\r\n                // if there are a very large number of followers this is going to slow down the entire site\r\n                // TODO: need to delegate this to a background task\r\n                // eslint-disable-next-line no-restricted-syntax\r\n                for (const follower of user.followers) {\r\n                    const notification = await Notification.create(newNotification);\r\n                    follower.notifications.push(notification);\r\n                    follower.save();\r\n                }\r\n\r\n                req.flash('success', 'Campground created successfully!');\r\n                res.redirect(`campgrounds/${campground._id}`);\r\n            } catch (err) {\r\n                console.log(err);\r\n                req.flash('error', err.message);\r\n                res.redirect('back');\r\n            }\r\n        }\r\n    });\r\n});\r\n\r\n// SHOW - shows info about one campground\r\nrouter.get('/:id', (req, res) => {\r\n    // console.log(req.params.id);\r\n    // res.redirect('/');\r\n    Campground.findById(req.params.id).populate('comments').exec((err, campground) => {\r\n        if (err || !campground) {\r\n            console.log(err);\r\n            req.flash('error', 'The campground you wanted could not be found');\r\n            res.redirect('back');\r\n        } else {\r\n            req.breadcrumbs('All Campgrounds', '/campgrounds');\r\n            req.breadcrumbs(campground.name, `//${campground.id}`);\r\n            res.render('campgrounds/show', { campground, breadcrumbs: req.breadcrumbs() });\r\n        }\r\n    });\r\n});\r\n\r\n// EDIT - form to edit a campground's information\r\nrouter.get('/:id/edit', middleware.ensureLoggedIn('/login'), middleware.checkCampgroundOwnership, (req, res) => {\r\n    Campground.findById(req.params.id).populate('comments').exec((err, campground) => {\r\n        req.breadcrumbs('All Campgrounds', '/campgrounds');\r\n        req.breadcrumbs(campground.name, `//${campground.id}`);\r\n        req.breadcrumbs('Edit', `//${campground.id}/edit`);\r\n        res.render('campgrounds/edit', { campground, breadcrumbs: req.breadcrumbs() });\r\n    });\r\n});\r\n// UPDATE - save the edited campground\r\nrouter.put('/:id', middleware.ensureLoggedIn('/login'), middleware.checkCampgroundOwnership, (req, res) => {\r\n    geocoder.geocode(req.body.location, (err, geolocationData) => {\r\n        if (err || !geolocationData.length) {\r\n            req.flash('error', 'Invalid Address');\r\n            res.redirect('back');\r\n        } else {\r\n            // TODO: Change this so that we geocode only if the location has changed.\r\n            // const newData = {};\r\n            // Object.assign(newData, req.body.campground);\r\n            req.body.campground.location = geolocationData[0].formattedAddress;\r\n            // newData.location = geolocationData[0].formattedAddress;\r\n            req.body.campground.lat = geolocationData[0].latitude;\r\n            req.body.campground.lng = geolocationData[0].longitude;\r\n            // req.body.campground.description = req.sanitize(req.body.campground.description);\r\n            Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground) => {\r\n                if (err || !campground) {\r\n                    console.log(err);\r\n                    req.flash('error', 'The campground you wanted to update could not be found');\r\n                    res.redirect('/');\r\n                } else {\r\n                    req.flash('success', 'Campground edited successfully!');\r\n                    res.redirect(`${req.params.id}`);\r\n                }\r\n            });\r\n        }\r\n    });\r\n});\r\n\r\n// DELETE/DESTROY\r\nrouter.delete('/:id', middleware.ensureLoggedIn('/login'), middleware.checkCampgroundOwnership, (req, res) => {\r\n    Campground.findByIdAndDelete(req.params.id, (err) => {\r\n        if (err) {\r\n            console.log('err :', err);\r\n            req.flash('error', 'The campground you wanted could not be found');\r\n            res.redirect('back');\r\n        } else {\r\n            req.flash('success', 'Campground deleted successfully!');\r\n            res.redirect('/campgrounds');\r\n        }\r\n    });\r\n});\r\n\r\nmodule.exports = router;\r\n\n\n//# sourceURL=webpack:///./routes/campgrounds.js?");

/***/ }),

/***/ "./routes/comments.js":
/*!****************************!*\
  !*** ./routes/comments.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* eslint-disable no-param-reassign */\r\nconst express = __webpack_require__(/*! express */ \"express\");\r\nconst Campground = __webpack_require__(/*! ../models/campground */ \"./models/campground.js\");\r\nconst Comment = __webpack_require__(/*! ../models/comment */ \"./models/comment.js\");\r\nconst breadcrumbs = __webpack_require__(/*! express-breadcrumbs */ \"express-breadcrumbs\");\r\nconst middleware = __webpack_require__(/*! ../middleware */ \"./middleware/index.js\");\r\nconst router = express.Router({ mergeParams: true });\r\n\r\n// eslint-disable-next-line consistent-return\r\n// function isLoggedIn(req, res, next) {\r\n//     if (req.isAuthenticated()) {\r\n//         return next();\r\n//     }\r\n//     res.redirect('/login');\r\n// }\r\n// NEW - displays form to create a new comment\r\nrouter.get('/new', middleware.ensureLoggedIn('/login'), (req, res) => {\r\n    Campground.findById(req.params.id, (err, campground) => {\r\n        if (err || campground) {\r\n            console.log(err);\r\n            req.flash('error', 'The campground you wanted to add a comment to could not be found');\r\n            res.redirect('back');\r\n        } else {\r\n            req.breadcrumbs('All Campgrounds', '/campgrounds');\r\n            req.breadcrumbs(campground.name, `/campgrounds/${campground.id}`);\r\n            req.breadcrumbs('Add Comment', `/campgrounds/${campground.id}/comments/new`);\r\n            res.render('comments/new', { campground });\r\n        }\r\n    });\r\n});\r\n// CREATE - add a new comment to a campground and save to DB\r\nrouter.post('/', middleware.ensureLoggedIn('/login'), (req, res) => {\r\n    Campground.findById(req.params.id, (err, campground) => {\r\n        if (err) {\r\n            res.redirect('/campgrounds'); // TODO: handle this better\r\n            console.log(err);\r\n        } else {\r\n            // eslint-disable-next-line no-shadow\r\n            Comment.create(req.body.newComment, (err, comment) => {\r\n                if (err) {\r\n                    res.redirect('/campgrounds'); // TODO: handle this better\r\n                    console.log(err);\r\n                } else {\r\n                    comment.author.id = req.user._id;\r\n                    // just so the name can be easily accessed, instead of having to search for the User db entry every time to get it\r\n                    console.log(req.user.firstName);\r\n                    console.log(req.user.lastName);\r\n                    comment.author.firstName = req.user.firstName;\r\n                    comment.author.lastName = req.user.lastName;\r\n                    comment.save();\r\n                    campground.comments.push(comment);\r\n                    campground.save();\r\n                    req.flash('success', 'Comment added successfully!');\r\n                    res.redirect(`/campgrounds/${campground.id}`);\r\n                }\r\n            });\r\n        }\r\n    });\r\n});\r\n\r\n// EDIT - form to edit a comment\r\nrouter.get('/:comment_id/edit', middleware.ensureLoggedIn('/login'), middleware.checkCommentOwnership, (req, res) => {\r\n    Comment.findById(req.params.comment_id, (err, foundComment) => {\r\n        if (err || !foundComment) {\r\n            req.flash('error', 'The comment you wanted could not be found')\r\n            res.redirect('back');\r\n        } else {\r\n            Campground.findById(req.params.id, (err, campground) => {\r\n                if (err || !campground) {\r\n                    req.flash('error', 'The campground you wanted could not be found');\r\n                    res.redirect('back');\r\n                } else {\r\n                    req.breadcrumbs('All Campgrounds', '/');\r\n                    req.breadcrumbs(campground.name, `//${campground.id}`);\r\n                    req.breadcrumbs('Edit Comment', `//${campground.id}/comments/${foundComment.id}/edit`);\r\n                    res.render('comments/edit', { campground_id: req.params.id, comment: foundComment });\r\n                }\r\n            });\r\n        }\r\n    });\r\n});\r\n// UPDATE - save the edited campground\r\nrouter.put('/:comment_id', middleware.ensureLoggedIn('/login'), middleware.checkCommentOwnership, (req, res) => {\r\n    // req.body.campground.description = req.sanitize(req.body.campground.description);\r\n    Campground.findById(req.params.id, (err, campground) => {\r\n        if (err || !campground) {\r\n            req.flash('error', 'The campground you tried to update a comment on could not be found');\r\n            res.redirect('back');\r\n        } else {\r\n            Comment.findByIdAndUpdate(req.params.comment_id, req.body.updatedComment, (err) => {\r\n                if (err) {\r\n                    console.log(err);\r\n                    res.redirect('/');\r\n                } else {\r\n                    req.flash('success', 'Comment updated successfully!');\r\n                    res.redirect(`/campgrounds/${req.params.id}`);\r\n                }\r\n            });\r\n        }\r\n    });\r\n});\r\n\r\n// DELETE/DESTROY\r\nrouter.delete('/:id', middleware.ensureLoggedIn('/login'), middleware.checkCommentOwnership, (req, res) => {\r\n    Campground.findById(req.params.id, (err, campground) => {\r\n        if (err || !campground) {\r\n            req.flash('error', 'The campground you tried to delete a comment on could not be found');\r\n            res.redirect('back');\r\n        } else {\r\n            Campground.findByIdAndDelete(req.params.id, (err) => {\r\n                if (err) {\r\n                    console.log('err :', err);\r\n                    req.flash('error', 'The comment you wanted to delete could not be found');\r\n                    res.redirect('back');\r\n                } else {\r\n                    req.flash('success', 'Comment deleted successfully!');\r\n                    res.redirect('back');\r\n                }\r\n            });\r\n        }\r\n    });\r\n});\r\n\r\n\r\nmodule.exports = router;\r\n\n\n//# sourceURL=webpack:///./routes/comments.js?");

/***/ }),

/***/ "./routes/index.js":
/*!*************************!*\
  !*** ./routes/index.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* eslint-disable no-lonely-if */\r\n/* eslint-disable no-shadow */\r\n/* eslint-disable no-param-reassign */\r\n/* eslint-disable consistent-return */\r\nconst express = __webpack_require__(/*! express */ \"express\");\r\nconst passport = __webpack_require__(/*! passport */ \"passport\");\r\nconst async = __webpack_require__(/*! async */ \"async\");\r\nconst nodemailer = __webpack_require__(/*! nodemailer */ \"nodemailer\");\r\nconst crypto = __webpack_require__(/*! crypto */ \"crypto\");\r\nconst User = __webpack_require__(/*! ../models/user */ \"./models/user.js\");\r\nconst Notification = __webpack_require__(/*! ../models/notification */ \"./models/notification.js\");\r\nconst middleware = __webpack_require__(/*! ../middleware */ \"./middleware/index.js\");\r\n\r\nconst router = express.Router({ mergeParams: true });\r\n\r\nrouter.get('/', (req, res) => {\r\n    res.render('landing');\r\n});\r\n\r\n// router.get('/secret', middleware.ensureLoggedIn('/login'), (req, res) => {\r\n//     req.breadcrumbs('Secret Page!', '/secret');\r\n//     res.render('secret');\r\n// });\r\n\r\n// render login form\r\nrouter.get('/login', (req, res) => {\r\n    req.breadcrumbs('Login', '/login');\r\n    res.render('users/login');\r\n});\r\n// passport.authenticate passed as middleware\r\n// router.post('/login', passport.authenticate('local', {\r\n//     successRedirect: '/campgrounds',\r\n//     failureRedirect: '/login',\r\n// }), () => { });\r\nrouter.post('/login', passport.authenticate('local', {\r\n    successReturnToOrRedirect: '/campgrounds',\r\n    failureRedirect: '/login',\r\n}));\r\n\r\nrouter.get('/logout', (req, res) => {\r\n    // Perform Action to Logout\r\n    req.logout();\r\n\r\n    res.redirect('/');\r\n});\r\n\r\n// user profile\r\nrouter.get('/users/:id', async (req, res) => {\r\n    try {\r\n        const user = await User.findById(req.params.id).populate('followers').exec();\r\n        res.render('users/profile', { user });\r\n    } catch (err) {\r\n        req.flash('error', err.message);\r\n        return res.redirect('back');\r\n    }\r\n});\r\n\r\n// follow user\r\nrouter.get('/follow/:id', middleware.ensureLoggedIn('/login'), async (req, res) => {\r\n    try {\r\n        const user = await User.findById(req.params.id);\r\n        user.followers.push(req.user._id);\r\n        user.save();\r\n        req.flash('success', `Successfully followed ${user.firstName}!`);\r\n        res.redirect(`/users/${req.params.id}`);\r\n    } catch (err) {\r\n        req.flash('error', err.message);\r\n        res.redirect('back');\r\n    }\r\n});\r\n\r\n// view all notifications\r\nrouter.get('/notifications', middleware.ensureLoggedIn('/login'), async (req, res) => {\r\n    try {\r\n        const user = await User.findById(req.user._id).populate({\r\n            path: 'notifications',\r\n            options: { sort: { _id: -1 } },\r\n        }).exec();\r\n        const allNotifications = user.notifications;\r\n        res.render('notifications/index', { allNotifications });\r\n    } catch (err) {\r\n        req.flash('error', err.message);\r\n        res.redirect('back');\r\n    }\r\n});\r\n\r\n// handle notification\r\nrouter.get('/notifications/:id', middleware.ensureLoggedIn('/login'), async (req, res) => {\r\n    try {\r\n        const notification = await Notification.findById(req.params.id);\r\n        notification.isRead = true;\r\n        notification.save();\r\n        res.redirect(`/campgrounds/${notification.campgroundId}`);\r\n    } catch (err) {\r\n        req.flash('error', err.message);\r\n        res.redirect('back');\r\n    }\r\n});\r\n\r\n// FORGOTTEN PASSWORD - form\r\nrouter.get('/forgot', (req, res) => {\r\n    req.breadcrumbs('Forgotten Password', '/forgot');\r\n    res.render('users/forgot');\r\n});\r\n\r\n// FORGOTTEN PASSWORD - generate reset token and send email to user, inviting them to reset their password\r\nrouter.post('/forgot', (req, res, next) => {\r\n    // array of functions that are called one after another\r\n    async.waterfall([\r\n        (done) => {\r\n            // generate a random hexadecimal string\r\n            crypto.randomBytes(20, (err, buf) => {\r\n                if (err) {\r\n                    console.log(err);\r\n                    req.flash('error', 'There was an error encountered while generating the reset token. The administrator has been notified.');\r\n                    return res.redirect('/forgot');\r\n                }\r\n                const token = buf.toString('hex');\r\n                done(err, token);\r\n            });\r\n        },\r\n        (token, done) => {\r\n            User.findOne({ email: req.body.email }, (err, foundUser) => {\r\n                // if no user with the email given can be found, redirect to forgotten password page and inform user of error\r\n                if (!foundUser) {\r\n                    req.flash('error', 'no account with that email address exists');\r\n                    return res.redirect('/forgot');\r\n                }\r\n                // otherwise, save the token and expiry point to the user document in db.\r\n                foundUser.resetPasswordToken = token;\r\n                foundUser.resetPasswordExpires = Date.now() + 3600000;\r\n                console.log(`resetPasswordExpires${foundUser.resetPasswordExpires}`);\r\n                foundUser.save((err, updatedUser) => {\r\n                    if (err) {\r\n                        console.log(err);\r\n                        req.flash('error', 'There was an error encountered while saving the token to your user entry. The administrator has been notified.');\r\n                        return res.redirect('/forgot');\r\n                    }\r\n                    done(err, token, updatedUser);\r\n                });\r\n            });\r\n        },\r\n        (token, user, done) => {\r\n            const smtpTransport = nodemailer.createTransport({\r\n                service: 'Gmail',\r\n                auth: {\r\n                    user: 'tmclayson@gmail.com',\r\n                    pass: process.env.GMAILPW,\r\n                },\r\n            });\r\n            // eslint-disable-next-line prefer-template\r\n            const message = 'You are receiving this because you (or someone else) have requested to reset the\\n'\r\n                + `password associated with the email address ${user.email}. \\n\\n`\r\n                + 'Please click on the following link, or paste this link into your browser to complete the process.\\n\\n'\r\n                + `http://${req.headers.host}/reset/${token} \\n\\n`\r\n                + 'If you did not request this, please ignore this email and your password will remain unchanged.';\r\n            const mailOptions = {\r\n                to: user.email,\r\n                from: 'tmclayson@gmail.com',\r\n                subject: 'Password Reset',\r\n                text: message,\r\n            };\r\n            smtpTransport.sendMail(mailOptions, () => {\r\n                console.log(`Recovery email sent to ${user.email}`);\r\n                req.flash('success', `An email has been sent to ${user.email} with further instructions.`);\r\n                return res.redirect('/forgot/email-sent');\r\n            });\r\n        },\r\n    ], (err) => {\r\n        if (err) {\r\n            next(err);\r\n        } else {\r\n            res.redirect('/forgot');\r\n        }\r\n    });\r\n});\r\n\r\n// RESET password - form\r\nrouter.get('/reset/:token', (req, res) => {\r\n    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {\r\n        if (!user) {\r\n            req.flash('error', 'Password reset token is invalid or has expired.');\r\n            res.redirect('/forgot');\r\n        } else {\r\n            req.breadcrumbs('Reset Password', '/reset');\r\n            res.render('users/reset', { token: req.params.token });\r\n        }\r\n    });\r\n});\r\n\r\n// RESET password - save updated password\r\nrouter.post('/reset/:token', (req, res) => {\r\n    async.waterfall([\r\n        (done) => {\r\n            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, foundUser) => {\r\n                console.log(`foundUser${foundUser}`);\r\n                if (!foundUser) {\r\n                    req.flash('error', 'Password reset token is invalid or has expired.');\r\n                    return res.redirect('back');\r\n                }\r\n\r\n                if (req.body.newPassword === req.body.confirmPassword) {\r\n                    foundUser.setPassword(req.body.newPassword, (err) => {\r\n                        if (err) {\r\n                            console.log(err);\r\n                            req.flash('error', 'An error was encountered while attempting to set the new password.');\r\n                            return res.redirect('back');\r\n                        }\r\n                        foundUser.resetPasswordToken = undefined;\r\n                        foundUser.resetPasswordExpires = undefined;\r\n                        console.log(`foundUser${foundUser}`);\r\n                        foundUser.save((err, updatedUser) => {\r\n                            if (err) {\r\n                                console.log(err);\r\n                                req.flash('error', 'An error was encountered while attempting to save the user document after setting the new password.');\r\n                                return res.redirect('back');\r\n                            }\r\n                            console.log(`updatedUser${updatedUser}`);\r\n                            req.login(updatedUser, (err) => {\r\n                                if (err) {\r\n                                    console.log(err);\r\n                                }\r\n                                done(err, updatedUser);\r\n                            });\r\n                        });\r\n                    });\r\n                } else {\r\n                    req.flash('error', 'The passwords entered didn\\'t match');\r\n                    return res.redirect('back');\r\n                }\r\n            });\r\n        },\r\n        (user, done) => {\r\n            const smtpTransport = nodemailer.createTransport({\r\n                service: 'Gmail',\r\n                auth: {\r\n                    user: 'tmclayson@gmail.com',\r\n                    pass: process.env.GMAILPW,\r\n                },\r\n            });\r\n            const mailOptions = {\r\n                to: user.email,\r\n                from: 'tmclayson@gmail.com',\r\n                subject: 'Your password has been changed',\r\n                text: `Hi,\r\n\r\n               This email is to confirm that the password for the account associated with ${user.email} has been changed.`,\r\n            };\r\n            smtpTransport.sendMail(mailOptions, (err) => {\r\n                // TODO: handle error\r\n                console.log(`The password for the account associated with ${user.email} has been changed`);\r\n                req.flash('success', 'Success! Your password has been changed.');\r\n                return res.redirect('/campgrounds');\r\n            });\r\n        },\r\n    ], (err) => {\r\n        console.log(err);\r\n        req.flash('error', 'An error was encountered whilst attempting to change your password. The administrator has been informed.');\r\n        res.redirect('/campgrounds');\r\n    });\r\n});\r\n\r\n// render login form\r\nrouter.get('/forgot/email-sent', (req, res) => {\r\n    req.breadcrumbs('Password Reset Email Sent', '/forgot/email-sent');\r\n    res.render('users/forgot_email_sent');\r\n});\r\n\r\n// NEW user form\r\nrouter.get('/register', (req, res) => {\r\n    req.breadcrumbs('Register', '/register');\r\n    res.render('users/register');\r\n});\r\n\r\n// CREATE new user and redirect\r\nrouter.post('/register', (req, res, next) => {\r\n    // make a new User object, that isn't saved to the database, yet.\r\n    // we don't save the password to the database\r\n    // User.register hashes the password and returns a new user object containing the username and hashed password\r\n    // eslint-disable-next-line consistent-return\r\n    User.register(new User({\r\n        email: req.body.email,\r\n        firstName: req.body.firstName,\r\n        lastName: req.body.lastName,\r\n    }), req.body.password, (err, user) => {\r\n        if (err) {\r\n            console.log(err);\r\n            req.breadcrumbs('Register', '/register');\r\n            req.flash('error', err.message);\r\n            // you can either set a flash message on the req.flash object before returning a res.redirect()\r\n            // OR you can pass the req.flash object into the res.render() function.\r\n            return res.redirect('/register');\r\n        }\r\n        console.log(user);\r\n        // passport.authenticate actually logs the user in, using the local strategy\r\n        // eslint-disable-next-line no-shadow\r\n        req.login(user, (err) => {\r\n            if (err) {\r\n                console.log(err);\r\n                return next(err);\r\n            }\r\n            req.flash('success', 'Thanks for signing up!');\r\n            return res.redirect('/campgrounds');\r\n        });\r\n    });\r\n});\r\n// if (err) {\r\n//     console.log(err);\r\n//     req.breadcrumbs('Register', '/register');\r\n//     console.log('ERROR!!!!!!!!!!!!!!!!');\r\n//     return res.render('register');\r\n// }\r\n// console.log('OK!!!!!!!!!!!!!!!!');\r\n// // passport.authenticate actually logs the user in, using the local strategy\r\n// passport.authenticate('local')(req, res, () => {\r\n//     console.log('HERE!!!!!!!!!!!!!!!!');\r\n//     res.redirect('/campgrounds');\r\n// });\r\n\r\nmodule.exports = router;\r\n\n\n//# sourceURL=webpack:///./routes/index.js?");

/***/ }),

/***/ "./src/back/app.js":
/*!*************************!*\
  !*** ./src/back/app.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// SETUP ======================================================================\r\n__webpack_require__(/*! dotenv */ \"dotenv\").config();\r\n\r\nconst express = __webpack_require__(/*! express */ \"express\");\r\nconst bodyParser = __webpack_require__(/*! body-parser */ \"body-parser\");\r\nconst methodOverride = __webpack_require__(/*! method-override */ \"method-override\");\r\nconst breadcrumbs = __webpack_require__(/*! express-breadcrumbs */ \"express-breadcrumbs\");\r\nconst passport = __webpack_require__(/*! passport */ \"passport\");\r\n// const localStrategy = require('passport-local').Strategy;\r\nconst mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\r\nconst morgan = __webpack_require__(/*! morgan */ \"morgan\");\r\nconst session = __webpack_require__(/*! express-session */ \"express-session\");\r\nconst MemoryStore = __webpack_require__(/*! memorystore */ \"memorystore\")(session);\r\nconst flash = __webpack_require__(/*! connect-flash */ \"connect-flash\");\r\n\r\n\r\nconst seedDB = __webpack_require__(/*! ./seeds */ \"./src/back/seeds.js\");\r\nconst init = __webpack_require__(/*! ./init */ \"./src/back/init.js\");\r\n// const lib = require('./assets/lib/js/mylibrary');\r\n\r\nconst User = __webpack_require__(/*! ../../models/user */ \"./models/user.js\");\r\n// requiring routes\r\nconst commentRoutes = __webpack_require__(/*! ../../routes/comments */ \"./routes/comments.js\");\r\nconst campgroundRoutes = __webpack_require__(/*! ../../routes/campgrounds */ \"./routes/campgrounds.js\");\r\nconst indexRoutes = __webpack_require__(/*! ../../routes/index */ \"./routes/index.js\");\r\n\r\n// CONFIGURATION ===============================================================\r\nmongoose.connect(`mongodb://${process.env.DB_HOST}/yelpcamp`, { useNewUrlParser: true });\r\n\r\nconst app = express();\r\n\r\n// EXPRESS SETUP\r\napp.set('view engine', 'ejs');\r\napp.use(flash());\r\n// app.use(morgan('dev')); // log every request to the console\r\napp.use(bodyParser.urlencoded({ extended: true }));\r\napp.use(methodOverride('_method'));\r\napp.use(breadcrumbs.init());\r\napp.use(breadcrumbs.setHome({\r\n    name: 'Welcome',\r\n}));\r\napp.use(express.static('public'));\r\n\r\n// PASSPORT CONFIGURATION\r\napp.use(session({\r\n    store: new MemoryStore({\r\n        checkPeriod: 86400000, // prune expired entries every 24h\r\n    }),\r\n    secret: 'Cheese Rolling',\r\n    resave: false,\r\n    saveUninitialized: false,\r\n}));\r\napp.use(passport.initialize());\r\napp.use(passport.session());\r\npassport.use(User.createStrategy());\r\npassport.serializeUser(User.serializeUser());\r\npassport.deserializeUser(User.deserializeUser());\r\n\r\n// this must come after the passport setup\r\napp.use(async (req, res, next) => {\r\n    res.locals.currentUser = req.user;\r\n    if (req.user) {\r\n        try {\r\n            // populate the user's notifications, but only thoe they haven't read yet\r\n            const user = await User.findById(req.user._id).populate('notifications', null, { isRead: false }).exec();\r\n            res.locals.notifications = user.notifications.reverse(); // .reverse() outputs in descending order\r\n        } catch (err) {\r\n            console.log(err.message);\r\n        }\r\n    }\r\n    res.locals.errorMessage = req.flash('error');\r\n    res.locals.successMessage = req.flash('success');\r\n    res.locals.breadcrumbs = req.breadcrumbs();\r\n    next();\r\n});\r\n\r\n// ROUTES ===============================================================\r\napp.use('/', indexRoutes);\r\napp.use('/campgrounds/:id/comments', commentRoutes);\r\napp.use('/campgrounds', campgroundRoutes);\r\n\r\n// seedDB();\r\ninit()\r\n    .then(() => {\r\n        // LAUNCH ===============================================================\r\n        app.listen(process.env.PORT, 'localhost', () => {\r\n            console.log('Server has started!');\r\n        });\r\n    })\r\n    .catch((err) => {\r\n        console.log(err);\r\n    });\r\n\r\n/*\r\napp.get('/search', (req, res) => {\r\n    res.render('search');\r\n});\r\n\r\napp.post('/results', (req, res) => {\r\n    const searchQuery = {};\r\n    searchQuery.s = req.body.title;\r\n    searchQuery.y = req.body.year;\r\n    searchQuery.plot = req.body.plot;\r\n\r\n    const endpoint = 'http://www.omdbapi.com/?apikey=a281818e&';\r\n    const queryString = lib.buildQuery(searchQuery);\r\n    // console.log(endpoint + queryString);\r\n\r\n    request(endpoint + queryString, (error, response, body) => {\r\n        if (error) {\r\n            console.log(`error ${error}`);\r\n        } else if (response.statusCode === 200) {\r\n            const data = JSON.parse(body);\r\n            res.render('results', { data });\r\n        }\r\n    });\r\n    // res.redirect('/friends');\r\n});\r\n\r\napp.get('/speak/:animal(pig|cow|dog)', (req, res) => {\r\n    const sounds = {\r\n        pig: 'Oink',\r\n        cow: 'Moo',\r\n        dog: 'Woof Woof',\r\n    };\r\n    const animalReq = req.params.animal.toLowerCase(); // lowerCase so that only one entry is needed in the sounds object\r\n    console.log(req.params);\r\n    res.send(`The ${animalReq} says \"${sounds[animalReq]}\"!`);\r\n});\r\n\r\napp.get('/repeat/:phrase(hello|blah)/:repetitions', (req, res) => {\r\n    const { phrase, repetitions } = req.params;\r\n    let response = phrase;\r\n    for (let index = 1; index < Number(repetitions); index += 1) {\r\n        response = `${response} ${phrase}`;\r\n    }\r\n    res.send(response);\r\n});\r\n\r\napp.post('/addfriend', (req, res) => {\r\n    const { newfriend } = req.body;\r\n    friends.push(newfriend);\r\n    res.redirect('/friends');\r\n    // res.send('<h1>Welcome to the home page!</h1>');\r\n});\r\n\r\napp.get('/friends', (req, res) => {\r\n    res.render('friends', { friends });\r\n});\r\n\r\napp.get('/fallinlovewith/:thing', (req, res) => {\r\n    // req.params is an object, not an array, so const [,thing] does not work.\r\n    const { thing } = req.params;\r\n    res.render('love.ejs', { thing });\r\n});\r\n\r\napp.get('/posts', (req, res) => {\r\n    const posts = [\r\n        { title: 'Post 1', author: 'Susy' },\r\n        { title: 'Post 2', author: 'Charlie' },\r\n        { title: 'Post 3', author: 'Colt' },\r\n    ];\r\n\r\n    res.render('posts.ejs', { posts });\r\n});\r\n*/\r\n\n\n//# sourceURL=webpack:///./src/back/app.js?");

/***/ }),

/***/ "./src/back/init.js":
/*!**************************!*\
  !*** ./src/back/init.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const User = __webpack_require__(/*! ../../models/user */ \"./models/user.js\");\r\n\r\nmodule.exports = () => new Promise((resolve) => {\r\n    User.findOne({ email: process.env.ADMIN_EMAIL }, (err, user) => {\r\n\r\n        if (err) {\r\n            throw err;\r\n        }\r\n\r\n        console.log(user);\r\n\r\n        if (user === null) {\r\n            User.register(new User({\r\n                email: process.env.ADMIN_EMAIL,\r\n                firstName: '',\r\n                lastName: '',\r\n                isAdmin: true,\r\n            }), process.env.ADMIN_PASSWORD, (err) => {\r\n                if (err) {\r\n                    throw err;\r\n                } else {\r\n                    resolve();\r\n                }\r\n            });\r\n        } else {\r\n            resolve();\r\n        }\r\n    });\r\n});\r\n\n\n//# sourceURL=webpack:///./src/back/init.js?");

/***/ }),

/***/ "./src/back/seeds.js":
/*!***************************!*\
  !*** ./src/back/seeds.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* eslint-disable no-shadow */\r\n/* eslint-disable no-param-reassign */\r\n/* eslint-disable max-len */\r\nconst Campground = __webpack_require__(/*! ../../models/campground */ \"./models/campground.js\");\r\nconst Comment = __webpack_require__(/*! ../../models/comment */ \"./models/comment.js\");\r\n\r\nconst data = [\r\n    // {\r\n    //     name: \"Cloud's Rest\",\r\n    //     image: 'https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg',\r\n    //     price: 5,\r\n    //     description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',\r\n    // },\r\n    // {\r\n    //     name: 'Desert Mesa',\r\n    //     image: 'https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg',\r\n    //     price: 8,\r\n    //     description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',\r\n    // },\r\n    // {\r\n    //     name: 'Canyon Floor',\r\n    //     image: 'https://farm1.staticflickr.com/189/493046463_841a18169e.jpg',\r\n    //     price: 11,\r\n    //     description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',\r\n    // },\r\n    {\r\n        name: 'Guadarama',\r\n        image: 'https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg',\r\n        price: 8,\r\n        description: 'Its a word in Spanish. Near Madrid originally. Americans stole it as is their habit.',\r\n    },\r\n    {\r\n        name: 'Mountain Goat\\'s Rest',\r\n        image: 'https://farm3.staticflickr.com/2839/11407596925_481e8aab72_o_d.jp',\r\n        price: 27,\r\n        description: 'Mountain goats tend to like to rest here. You may or may not like that. They can smell.',\r\n    },\r\n    {\r\n        name: 'Granite Hill',\r\n        price: 42,\r\n        image: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Deep_Lake_tenting_campsite_-_Riding_Mountain_National_Park.JPG',\r\n        description: 'A huge granite hill, no bathrooms. No water. Just granite.',\r\n    },\r\n    {\r\n        name: 'Salmon Creek',\r\n        price: 12,\r\n        image: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Campsites_%286105930497%29.jpg',\r\n        description: 'A creek with a lot of Salmon in it',\r\n    },\r\n];\r\n\r\nfunction seedDB() {\r\n    // Remove all campgrounds\r\n    Campground.remove({}, (err) => {\r\n        if (err) {\r\n            console.log(err);\r\n        }\r\n        console.log('removed campgrounds!');\r\n        Comment.remove({}, (err) => {\r\n            if (err) {\r\n                console.log(err);\r\n            }\r\n            console.log('removed comments!');\r\n            // add a few campgrounds\r\n            // data.forEach((seed) => {\r\n            //     Campground.create(seed, (err, campground) => {\r\n            //         if (err) {\r\n            //             console.log(err);\r\n            //         } else {\r\n            //             console.log('added a campground');\r\n            //             campground.createdBy.id = '5c12444c89190b2f78082566';\r\n            //             campground.createdBy.firstName = 'admin';\r\n            //             campground.createdBy.lastName = 'istrator';\r\n            //             campground.save();\r\n            //         }\r\n            //     });\r\n            // });\r\n        });\r\n    });\r\n    // add a few comments\r\n}\r\n\r\nmodule.exports = seedDB;\r\n\n\n//# sourceURL=webpack:///./src/back/seeds.js?");

/***/ }),

/***/ 0:
/*!*******************************!*\
  !*** multi ./src/back/app.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! ./src/back/app.js */\"./src/back/app.js\");\n\n\n//# sourceURL=webpack:///multi_./src/back/app.js?");

/***/ }),

/***/ "async":
/*!************************!*\
  !*** external "async" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"async\");\n\n//# sourceURL=webpack:///external_%22async%22?");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"body-parser\");\n\n//# sourceURL=webpack:///external_%22body-parser%22?");

/***/ }),

/***/ "connect-flash":
/*!********************************!*\
  !*** external "connect-flash" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"connect-flash\");\n\n//# sourceURL=webpack:///external_%22connect-flash%22?");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"crypto\");\n\n//# sourceURL=webpack:///external_%22crypto%22?");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"dotenv\");\n\n//# sourceURL=webpack:///external_%22dotenv%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "express-breadcrumbs":
/*!**************************************!*\
  !*** external "express-breadcrumbs" ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express-breadcrumbs\");\n\n//# sourceURL=webpack:///external_%22express-breadcrumbs%22?");

/***/ }),

/***/ "express-session":
/*!**********************************!*\
  !*** external "express-session" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express-session\");\n\n//# sourceURL=webpack:///external_%22express-session%22?");

/***/ }),

/***/ "memorystore":
/*!******************************!*\
  !*** external "memorystore" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"memorystore\");\n\n//# sourceURL=webpack:///external_%22memorystore%22?");

/***/ }),

/***/ "method-override":
/*!**********************************!*\
  !*** external "method-override" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"method-override\");\n\n//# sourceURL=webpack:///external_%22method-override%22?");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"mongoose\");\n\n//# sourceURL=webpack:///external_%22mongoose%22?");

/***/ }),

/***/ "morgan":
/*!*************************!*\
  !*** external "morgan" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"morgan\");\n\n//# sourceURL=webpack:///external_%22morgan%22?");

/***/ }),

/***/ "node-geocoder":
/*!********************************!*\
  !*** external "node-geocoder" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"node-geocoder\");\n\n//# sourceURL=webpack:///external_%22node-geocoder%22?");

/***/ }),

/***/ "nodemailer":
/*!*****************************!*\
  !*** external "nodemailer" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"nodemailer\");\n\n//# sourceURL=webpack:///external_%22nodemailer%22?");

/***/ }),

/***/ "passport":
/*!***************************!*\
  !*** external "passport" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"passport\");\n\n//# sourceURL=webpack:///external_%22passport%22?");

/***/ }),

/***/ "passport-local-mongoose":
/*!******************************************!*\
  !*** external "passport-local-mongoose" ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"passport-local-mongoose\");\n\n//# sourceURL=webpack:///external_%22passport-local-mongoose%22?");

/***/ })

/******/ });