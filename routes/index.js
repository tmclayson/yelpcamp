/* eslint-disable consistent-return */
const express = require('express');
const passport = require('passport');
const User = require('../models/user');

const router = express.Router({ mergeParams: true });

router.get('/', (req, res) => {
    res.render('landing');
});

// router.get('/secret', isLoggedIn, (req, res) => {
//     req.breadcrumbs('Secret Page!', '/secret');
//     res.render('secret');
// });

// render login form
router.get('/login', (req, res) => {
    req.breadcrumbs('Login', '/login');
    res.render('login');
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

// NEW user form
router.get('/register', (req, res) => {
    req.breadcrumbs('Register', '/register');
    res.render('register');
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
