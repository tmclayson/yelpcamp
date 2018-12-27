// SETUP ======================================================================
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const breadcrumbs = require('express-breadcrumbs');
const passport = require('passport');
// const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const flash = require('connect-flash');


// const seedDB = require('./seeds');
const init = require('./init');
// const lib = require('./assets/lib/js/mylibrary');

const User = require('../../models/user');
// requiring routes
const commentRoutes = require('../../routes/comments');
const campgroundRoutes = require('../../routes/campgrounds');
const indexRoutes = require('../../routes/index');

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
