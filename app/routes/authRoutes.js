const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const { performQuery } = require('../utils/dbModule');
const { v4: uuid } = require('uuid');

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// ---------- VALIDATION OF USER INPUTS ----------
const validateInputs = (values, next) => {
    const { username, password } = values;
    const regex = /(?=^.{6,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

    // Empty fields
    if (username === "") {
        return next(new Error('Username cannot be empty'));
    } else if (password === "") {
        return next(new Error('Password cannot be empty'));
    }
    // Username too long
    else if (username.length > 30) {
        return next(new Error("Username is too long"));
    }
    // Password requirements: at least 6 characters, one digit, one lowercase letter, one uppercase letter, one symbol -- FIX overkill?
    else if (regex.test(password) === false) {
        return next(new Error('Password is not strong enough'));
    }

    return true;
}

// ---------- ROUTES ----------

// Register
router.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
    if (validateInputs({ username, password }, next)) {
        let newId = uuid();
        try {
            const salt = await bcrypt.genSalt(9);
            const hash = await bcrypt.hash(password, salt);
            //console.log(hash.length);

            const query = `INSERT INTO appUser (id, username, password) VALUES('${newId}', '${username}', '${hash}')`;
            //console.log(query);
            await performQuery(query);

            const newUser = await performQuery(`SELECT * FROM appUser WHERE id = '${newId}'`);
            const u = newUser.rows[0];
            req.login(u, (err, user) => {
                if (err) return next(err);
                let response = { redirect: "/" };
                return res.json(response);
            })

        } catch (err) {
            console.log('Error while hashing password; error follows');
            console.log(err)
            return next(err);
        }
    }
})

// Login
router.post('/login', passport.authenticate('local', { successRedirect: '/api/auth/login-success' }), (err, req, res, next) => {
    if (err) {
        let msg = err.message;
        let status = err.status || 401;
        if (err.message === "Bad Request" && err.name === "AuthenticationError") msg = 'Invalid credentials. Please try again.';
        return res.status(status).send({ message: msg }); // Error is sent to client
    }
    return res.json({ redirect: '/' });
})

// Logout
router.get('/logout', (req, res) => {
    if (req.user) {
        const username = req.user.username;
        req.logout((err, next) => {
            if (err) return next(err);
        });
        console.log(`Logged out user ${username}`);
        return res.send({ message: `Logged out user ${username}` });
    }
    return res.redirect('/');
})

// Login success redirects user to Sessions page.
router.get('/login-success', (req, res) => {
    res.json({ redirect: '/sessions' });
})

// Fetch currently logged in user
router.get('/getUser', (req, res) => {
    const data = {
        message: "No user logged in",
        user: null
    }
    if (req.user) {
        data.message = `Logged in user is ${req.user.username}`;
        data.user = req.user.username;
        data.id = req.user.id;
    }
    return res.json(data);
})

module.exports = router;