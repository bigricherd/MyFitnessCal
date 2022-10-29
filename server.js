const express = require('express');
const cors = require('cors');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const passport = require('passport');
//const methodOverride = require('method-override');
const path = require('path');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(methodOverride("_method"));

// ---------- CORS SETUP ----------
const homeUrl = process.env.HOMEPAGE_URL || "http://localhost:3000";
const whitelist = [homeUrl, "http://localhost:3000", "http://localhost:5000"];
const corsConfig = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};
app.use(cors(corsConfig));

// ---------- SESSION SETUP ----------
const secret = process.env.SECRET || "alwaysHungry";
const sessionConfig = {
    secret,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
};

if (process.env.NODE_ENV === "production") {
    const { pool } = require('./utils/dbModule')
    const store = new pgSession({
        pool,
        createTableIfMissing: true,
        pruneSessionInterval: false,
        tableName: "userSession"
    });
    app.set('trust proxy', 1); // trust first proxy
    sessionConfig.cookie.secure = true; // serve secure cookies
    sessionConfig.store = store; // use Postgres for Session storage
}
app.use(session(sessionConfig));

// ---------- PASSPORT SETUP ----------
require("./utils/passportLocal");
app.use(passport.initialize());
app.use(passport.session());

// ---------- ROUTES ----------
const authRoutes = require("./routes/authRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const statRoutes = require("./routes/statRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/stats", statRoutes);

const errorController = require("./utils/errorController");
app.use(errorController);

// ---------- ERROR HANDLING ----------
// catch-all error handler
app.use((err, req, res, next) => {
    if (!err.statusCode) err.statusCode = 500;
    if (!err.message) err.message = "Something went wrong";
    console.log("you hit the catch-all error middleware");
    console.log(err.statusCode, err.message);
    console.log(err.name);
    return res.status(err.statusCode).send({ messages: err.message });
});

// ---------- SERVE BUILD FOLDER TO DISPLAY UI ON PROD  ----------
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/client/build")));
}

// ---------- CATCH-ALL ROUTE TO ALWAYS DISPLAY index.html  ----------
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

// ---------- START SERVER ----------
const port = process.env.PORT || 5000;
app.listen(port, (req, res) => {
    console.log(`Listening on port ${port} `);
});

// --- DEBUGGING AUTH ---
// app.use((req, res, next) => {
//     console.log('req.session is currently:');
//     console.log(req.session);

//     console.log('req.user is currently:');
//     console.log(req.user);

//     if (req.session.passport) {
//         console.log(req.session.passport.user);
//     }
//     next();
// })
