/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
const Campground = require('../../models/campground');
const Comment = require('../../models/comment');

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
