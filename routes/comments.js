/* eslint-disable no-param-reassign */
const express = require('express');
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const breadcrumbs = require('express-breadcrumbs');
const middleware = require('../middleware');
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
