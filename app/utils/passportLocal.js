// Just started development
const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const { performQuery } = require('./dbModule');

const verifyPassword = async (password, hash) => {
    let result = false;
    try {
        const res = await bcrypt.compare(password, hash);
        console.log(`Res async: ${res}`);
        result = res;
    } catch (e) {
        console.log(`Error at bcrypt.compare: ${e}`);
    }
    return result;
}

const verifyCallback = async (username, password, done) => {
    try {
        const query = `SELECT * FROM appUser WHERE username = '${username}'`;
        const res = await performQuery(query);
        const user = res.rows[0]
        if (!user) {
            // can flash error message here
            console.log('no such user');
            return done(null, false, { message: 'Incorrect username' });
        }

        const hash = user.password;
        console.log(user);
        console.log(hash);

        const isValid = await verifyPassword(password, hash);
        console.log(`isValid: ${isValid}`);
        if (isValid) return done(null, user);
        else return done(null, false);

    } catch (e) {
        console.log('Something went wrong in test', e);
        return done(e);
    }
}

const strategy = new LocalStrategy(verifyCallback);

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

// ---- DEBUGGING verifyCallback() ----

const print = (msg) => {
    console.log(msg);
}

const test = async () => {
    verifyCallback('testing', 'badpasswordss', print);
}

//test();