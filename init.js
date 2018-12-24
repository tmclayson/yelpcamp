const User = require('./models/user');

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
