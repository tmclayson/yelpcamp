/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
// middleware
const Campground = require('../models/campground');
const Comment = require('../models/comment');

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
            console.log(`originalUrl${req.originalUrl}`);
            if (!req.isAuthenticated || !req.isAuthenticated()) {
                if (setReturnTo && req.session) {
                    req.session.returnTo = req.originalUrl || req.url;
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
