const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const { performQuery } = require('../utils/dbModule');
const { v4: uuid } = require('uuid');

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
    if (username === '') return next(new Error('Username cannot be empty'));
    if (password === '') return next(new Error('Password cannot be empty'));

    // Password requirements: at least 6 characters, one digit, one lowercase letter, one uppercase letter, one symbol
    // This might be overkill, maybe reconsider.
    // const regex = /(?=^.{6,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
    // if (regex.test(password) === false) return next(new Error('Password is not strong enough'));

    let newId = uuid();
    try {
        const salt = await bcrypt.genSalt(9);
        const hash = await bcrypt.hash(password, salt);
        //console.log(hash.length);

        const query = `INSERT INTO appUser (id, username, password) VALUES('${newId}', '${username}', '${hash}')`;
        //console.log(query);
        await performQuery(query);

        const allUsers = await performQuery('SELECT * FROM appUser');
        //console.log(allUsers.rows);
        const last = allUsers.rows[allUsers.rows.length - 1];
        //console.log(last);
        req.login(last, (err, user) => {
            if (err) return next(err);
            let response = { redirect: "/" };
            return res.json(response);
        })

    } catch (err) {
        console.log('Error while hashing password; error follows');
        console.log(err)
        return next(err);
    }
})

router.post('/login', passport.authenticate('local', { successRedirect: '/api/auth/login-success' }), (err, req, res, next) => {
    if (err) return res.status(401).send({ message: err.message }); // Error is sent to client
    return res.json({ redirect: '/' });
})

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

// Redirect user to home page on login success.
router.get('/login-success', (req, res) => {
    res.json({ redirect: '/' });
})

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