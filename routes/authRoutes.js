const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const { performQuery } = require('../utils/dbModule');
const { v4: uuid } = require('uuid');

router.use(express.urlencoded({ extended: true }));
router.use(express.json());


// Accepted time zones
const timezones = ["US/Samoa", "US/Hawaii", "US/Alaska", "US/Pacific", "US/Arizona", "US/Mountain",
    "US/Central", "US/Eastern", "Canada/Atlantic", "Canada/Newfoundland", "America/Buenos_Aires",
    "America/Noronha", "Atlantic/Cape_Verde", "Atlantic/Reykjavik", "Europe/London", "Europe/Amsterdam",
    "Africa/Cairo", "Europe/Istanbul", "Asia/Dubai", "Asia/Karachi", "Asia/Omsk", "Asia/Jakarta", "Asia/Hong_Kong",
    "Asia/Tokyo", "Australia/Brisbane", "Australia/Melbourne", "Pacific/Fiji"];

// ---------- VALIDATION OF USER INPUTS ----------
const validateInputs = (values, next) => {
    const { username, password } = values;
    const regex = /(?=^.{6,}$)(?=.*\d)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

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
    else if (!regex.test(password)) {
        return next(new Error('Password is not strong enough.'));
    }

    return true;
};

const validateRegister = (values, next) => {
    const { timezone } = values;
    if (!timezone) {
        return next(new Error("Please fill out empty fields."));
    } else if (timezones.indexOf(timezone) === -1) {
        return next(new Error("Invalid time zone."));
    }
    return validateInputs(values, next);
};

const validateUser = async (userId, user, next) => {
    const u = await performQuery(`SELECT * FROM appUser WHERE id = '${userId}'`);

    if (user !== userId) {
        return next(new Error("You do not have permission to do that."));
    } else if (u.rows.length < 1) {
        return next(new Error("That user does not exist."));
    }
    return true;
}

// const validatePasswordChange = async (values, next) => {
//     const { userId, oldPassword, newPassword } = values;
//     const regex = /(?=^.{6,}$)(?=.*\d)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

//     try {
//         const u = await performQuery(`SELECT * FROM appuser WHERE id = '${userId}'`);
//         const user = u.rows[0];

//         const salt = await bcrypt.genSalt(9);
//         const hash = await bcrypt.hash(oldPassword, salt);

//         console.log(values);
//         console.log(user);
//         console.log(hash);
//         // HASH IS NOT IDENTICAL -- FIND A SOLUTION TO CHECK IF USER'S PASSWORD IS 
//     } catch (err) {
//         return next(err);
//     }
//     return true;
// }

// ---------- ROUTES ----------

// Register
router.post('/register', async (req, res, next) => {
    const { username, password, timezone } = req.body;
    if (validateRegister({ username, password, timezone }, next)) {
        let newId = uuid();
        try {
            const salt = await bcrypt.genSalt(9);
            const hash = await bcrypt.hash(password, salt);

            const query = `INSERT INTO appUser (id, username, password, timezone, firstvisit) VALUES('${newId}', '${username}', '${hash}', '${timezone}', 'true')`;
            await performQuery(query);

            const newUser = await performQuery(`SELECT * FROM appUser WHERE id = '${newId}'`);
            const u = newUser.rows[0];
            req.login(u, (err, user) => {
                if (err) return next(err);
                let response = { redirect: "/" };
                return res.json(response);
            })

        } catch (err) {
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
    console.log('/api/auth/getUser ROUTE HANDLER');
    console.log(req.user);
    const data = {
        message: "No user logged in",
        user: null
    }
    if (req.user) {
        data.message = `Logged in user is ${req.user.username}`;
        data.user = req.user.username;
        data.id = req.user.id;
        data.timezone = req.user.timezone;
        data.firstVisit = req.user.firstvisit;
    }
    return res.json(data);
});

// Change timezone
router.patch('/timezone', async (req, res, next) => {
    const { timezone, userId } = req.body;

    const response = {};
    if (timezones.indexOf(timezone) !== -1) {
        try {
            await performQuery(`UPDATE appUser SET timezone='${timezone}' WHERE id = '${userId}'`);

            const updated = await performQuery(`SELECT timezone FROM appUser WHERE id = '${userId}'`);
            console.log(updated.rows[0]);

            if (updated.rows.length === 1 && updated.rows[0].timezone === timezone) {
                response.success = `Successfully changed timezone to ${timezone}.`;
                response.timezone = updated.rows[0].timezone;
            } else return next(new Error("Timezone was not updated. Please try again."));
        } catch (e) {
            return next(e);
        }
    } else return next(new Error("Invalid time zone."));
    res.send(response);
});

// // Change password
// router.patch('/keyChange', async (req, res, next) => {
//     const { userId, oldPassword, newPassword } = req.body;
//     const response = {};

//     if (await validatePasswordChange({ userId, oldPassword, newPassword }, next)) {
//         console.log('valid BE');
//     }

//     res.send(response);
// });

// Delete user
router.delete('/user', async (req, res, next) => {
    const { userId } = req.query;
    console.log(userId);
    const user = req.user.id;
    const response = {};

    if (await validateUser(userId, user, next)) {
        if (req.user) {
            const username = req.user.username;
            req.logout((err, next) => {
                if (err) return next(err);
            });
            console.log(`Logged out user ${username}`);

            await performQuery(`DELETE FROM appuser WHERE id='${userId}'`);

            const rows = await performQuery(`SELECT * FROM appuser WHERE id='${userId}'`);
            console.log(rows.rows);
            if (rows.rows.length !== 0) {
                return next(new Error("User account was not deactivated. Please try again."));
            } else {
                response.success = `Successfully deleted user ${username}`;
                response.redirect = '/login';
            }
        }
    }

    console.log(response);
    res.send(response);
});

module.exports = router;