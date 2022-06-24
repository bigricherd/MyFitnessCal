// Just started development
const passport = require('passport');
const LocalStrategy = require('passport-local');
const { performQuery } = require('./dbModule');

passport.use(new LocalStrategy((username, password, callback) => {
    try {
        const query = `SELECT * FROM user WHERE username = ${username}`;
        const res = await performQuery(query);
        console.log(res.rows);
    } catch (e) {
        console.log('Something went wrong', e);
        return callback(e);
    }
}))