const express = require('express');
const cors = require('cors');
const { Client } = require('pg');
const { getExerciseMap, getExercisesArray, getMuscleGroups } = require('./utils/fetchEnums');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

const client = new Client({
    host: "localhost",
    port: "",
    user: "",
    database: ""
})

client.connect();

let map = {};
let exercises = [];
let muscleGroups = [];

const getEnums = async () => {
    map = await getExerciseMap();
    exercises = await getExercisesArray();
    muscleGroups = await getMuscleGroups();
    console.log(map);
    console.log(exercises);
    console.log(muscleGroups);
}
getEnums();

const setRoutes = require('./routes/setRoutes');
const statRoutes = require('./routes/statRoutes');
app.use('/api/sets', setRoutes);
app.use('/api/stats', statRoutes);


app.get('/', (req, res) => {
    res.send('whatuppppp');
})

app.get('/api/enums', (req, res) => {
    getEnums();
    res.send({ message: 'enums requested', exercises, muscleGroups })
})

// ADD AN EXERCISE TO ENUMS
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
    await client.query(query);
    const enumAfterQuery = await client.query('SELECT enum_range(NULL::exercise)');
    getEnums();
    res.send(enumAfterQuery.rows);
})

const port = process.env.PORT || 5000;
app.listen(port, (req, res) => { console.log(`Listening on port ${port}`) });