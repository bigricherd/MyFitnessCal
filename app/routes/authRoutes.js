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
    console.log(username, password);
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
            if (err) return next(err); // TODO: error handling
            //console.log('after login');
            //console.log(req.user);
            let redir = { redirect: "/" }; // this works yay!       
            return res.json(redir);
        })

    } catch (err) {
        console.log('Error while hashing password');
        return next(err);
    }
})

router.post('/login', passport.authenticate('local', { failureRedirect: '/api/auth/login-fail' }), (req, res, next) => {
    return res.json({ redirect: '/' });
})

router.post('/logout', (req, res) => {
    if (req.isAuthenticated) {
        const username = req.user.username;
        req.logout((err, next) => {
            if (err) return next(err);
        });
        console.log(`Logged out user ${username}`);
    }
    return res.redirect('/');
})

router.get('/login-success', (req, res) => {
    res.send('Logged in successfully');
})

router.get('/login-fail', (req, res) => {
    res.json({ redirect: '/login' }); // TODO: error handling
    //res.send('Login failed');
})

router.get('/getUser', (req, res) => {
    const data = {
        message: "No user logged in",
        user: null
    }
    if (req.user) {
        data.message = `Logged in user is ${req.user.username}`;
        data.user = req.user;
    }
    return res.json(data);
})

module.exports = router;