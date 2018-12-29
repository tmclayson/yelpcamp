const User = require('../../models/user');

function seedUsers() {
    const adminUser = {
        email: process.env.ADMIN_EMAIL,
        firstName: '',
        lastName: '',
        isAdmin: true,
    };
    const dataSeeder = {
        email: process.env.SEEDER_EMAIL,
        firstName: 'Thomas',
        lastName: 'Clayson',
        isAdmin: false,
    };
    const commenter = {
        email: process.env.COMMENTER_EMAIL,
        firstName: 'Hermione',
        lastName: 'Granger',
        isAdmin: false,
    };

    try {
        findOrCreateUser(adminUser, process.env.ADMIN_PASSWORD);
        findOrCreateUser(dataSeeder, process.env.SEEDER_PASSWORD);
        findOrCreateUser(commenter, process.env.COMMENTER_PASSWORD);
    } catch (err) {
        console.log(err);
        return false;
    }
    return true;
}

async function findOrCreateUser(userToFindOrCreate, password) {
    try {
        const foundUser = await User.findOne({ email: userToFindOrCreate.email });
        if (foundUser === null) {
            User.register(new User(userToFindOrCreate), password, (err, user) => {
                if (err) {
                    console.log(err);
                }
                console.log(user);
            });
        }
    } catch (err) {
        throw err;
    }
}

module.exports = seedUsers;
