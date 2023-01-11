// Just started development
const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const { performQuery } = require('./dbModule');

const verifyPassword = async (password, hash) => {
    let result = false;
    try {
        const res = await bcrypt.compare(password, hash);
        result = res;
    } catch (e) {
    }
    return result;
}

const verifyCallback = async (req, username, password, done) => {
    try {
        const query = `SELECT * FROM appUser WHERE username = '${username}'`;
        console.log(username);
        const res = await performQuery(query);
        const user = res.rows[0];

        // Invalid username error handling
        if (!user) {
            return done({ message: 'That user does not exist.' }, false);
        }

        const hash = user.password;

        const isValid = await verifyPassword(password, hash);
        if (isValid) {
            return done(null, user);
        } else {
            // Invalid password error handling
            return done({ message: 'Invalid password.' }, false);
        }

    } catch (e) {
        return done(e);
    }
}

const strategy = new LocalStrategy({ passReqToCallback: true }, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser(async (userId, done) => {
    const query = `SELECT * FROM appUser WHERE id = '${userId}'`;
    try {
        const res = await performQuery(query);
        done(null, res.rows[0]);
    } catch (e) {
        done(e);
    }
})