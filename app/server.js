const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const { getExerciseMap, getExercisesArray, getMuscleGroups } = require('./utils/fetchEnums');
const { performQuery } = require('./utils/dbModule');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ---------- CORS SETUP ----------

const homeUrl = process.env.HOMEPAGE_URL || 'http://localhost:3000';
const whitelist = [homeUrl, 'http://localhost:3000', 'http://localhost:5000'];
const corsConfig = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}
app.use(cors(corsConfig));

// ---------- SESSION SETUP ----------
const secret = process.env.SECRET || 'alwaysHungry';
const sessionConfig = {
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}
app.use(session(sessionConfig));

// ---------- SET LOCAL VARIABLES REPRESENTING ENUMS (exercise, muscleGroup) ----------

let map = {};
let exercises, muscleGroups = [];

const getEnums = async () => {
    map = await getExerciseMap();
    exercises = await getExercisesArray();
    muscleGroups = await getMuscleGroups();
    // console.log(map);
    // console.log(exercises);
    // console.log(muscleGroups);
}
getEnums();

// ---------- PASSPORT CONFIG ----------
require('./utils/passportLocal');
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    console.log('req.session is currently:');
    console.log(req.session);

    console.log('req.user is currently:');
    console.log(req.user);

    if (req.session.passport) {
        console.log(req.session.passport.user);
    }
    next();
})


// ---------- ROUTES ----------
const setRoutes = require('./routes/setRoutes');
const statRoutes = require('./routes/statRoutes');
const authRoutes = require('./routes/authRoutes');
app.use('/api/sets', setRoutes);
app.use('/api/stats', statRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send(req.user);
})

app.get('/api/enums', (req, res) => {
    getEnums();
    res.send({ message: 'enums requested', exercises, muscleGroups })
})

// ADD AN EXERCISE TO ENUMS -- TODO: move this elsewhere
app.post("/api/exercises/add", async (req, res) => {
    let { exercise, muscleGroup } = req.body;

    // Format exercise and muscle group to store in database
    exercise = exercise.toLowerCase();
    exercise = exercise.split(' ').join('_');
    muscleGroup = muscleGroup.toLowerCase();

    if (muscleGroups.indexOf(muscleGroup) === -1) {
        const error = `Error: ${muscleGroup} is not a valid muscle group.`;
        console.log(error);
        return res.send(error);
    }

    const entry = `${exercise}:${muscleGroup}`;
    const query = `ALTER TYPE exercise ADD VALUE '${entry}';
                   ALTER TABLE set1 ALTER COLUMN exercise TYPE exercise;`;
    console.log(query);
    await performQuery(query);
    const enumAfterQuery = await performQuery('SELECT enum_range(NULL::exercise)');
    getEnums();
    res.send(enumAfterQuery.rows);
})


// ---------- LISTEN ----------
const port = process.env.PORT || 5000;
app.listen(port, (req, res) => { console.log(`Listening on port ${port} `) });