/* eslint-disable no-lonely-if */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
const express = require('express');
const passport = require('passport');
const async = require('async');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/user');
const Notification = require('../models/notification');
const middleware = require('../middleware');

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
                // We are calling the done function with two arguments: the first argument is any error that we want to pass
                // to the next step, and the second argument is the actual result or value that we want to pass to the next step
                done(null, token);
            });
        },
        // Every step function takes two arguments, the first of which is the result from the previous step
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
                    done(null, token, updatedUser);
                });
            });
        },
        (token, user) => {
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
        function postResetStep1(done) {
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
                                done(null, foundUser);
                            });
                        });
                    });
                } else {
                    req.flash('error', 'The passwords entered didn\'t match');
                    return res.redirect('back');
                }
            });
        },
        function postResetStep2(user) {
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
                if (err) {
                    console.log(err);
                    req.flash('error', 'An error was encountered while attempting to send the password change confirmation email');
                }
                console.log(`The password for the account associated with ${user.email} has been changed`);
                req.flash('success', 'Success! Your password has been changed.');
                return res.redirect('/campgrounds');
            });
        },
    ], (err) => {
        if (err) {
            console.log(err);
            req.flash('error', 'An error was encountered whilst attempting to change your password. The administrator has been informed.');
            return res.redirect('/campgrounds');
        }
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
