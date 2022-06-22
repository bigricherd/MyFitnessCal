const express = require('express');
const router = express.Router();
const { Client } = require('pg');
const { getExerciseMap, getExercisesArray, getMuscleGroups } = require('../utils/fetchEnums');

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
    // console.log(map);
    // console.log(exercises);
    // console.log(muscleGroups);
}
getEnums();

router.get('/viewData', (req, res) => {
    res.send(`${map}`);
})

// Get total number of sets performed for given date range across all muscle groups
router.get("/setsPerMuscle/all", async (req, res) => {
    const { fromDate, toDate } = req.body;
    let numSets = {};

    for (let muscleGroup of muscleGroups) {
        const query = `SELECT COUNT(*) FROM set1 WHERE (date >= ${fromDate} AND date <= ${toDate}) AND muscleGroup = '${muscleGroup}'`;
        const data = await client.query(query);
        const count = data.rows[0].count;
        numSets[muscleGroup] = count;

        console.log(`You did ${count} sets of ${muscleGroup} from ${fromDate} to ${toDate}`);
    }
    console.log(numSets);
    res.send(numSets);
})

// Get total number of sets performed for given muscleGroup and date range
// Request will be invoked by a dropdown box's onChange property; maybe on change of dates for all "stat" routes too?
router.get('/setsPerMuscle', async (req, res) => {
    const { fromDate, toDate, muscleGroup } = req.body;
    let numSets = {};

    const query = `SELECT COUNT(*) FROM set1 WHERE (date >= ${fromDate} AND date <= ${toDate}) AND muscleGroup='${muscleGroup}'`;
    const data = await client.query(query);
    const count = data.rows[0].count;

    numSets[muscleGroup] = count;
    console.log(`You did ${count} sets of ${muscleGroup} from ${fromDate} to ${toDate}`);
    console.log(numSets);

    res.send(numSets);
})

// Get total number of sets performed for given Exercise and date range
router.get('/setsPerExercise', async (req, res) => {
    const { fromDate, toDate, exercise } = req.body;
    let numSets = {};
    let exerciseF = `${exercise}:${map.get(exercise)}`;

    const query = `SELECT COUNT(*) FROM set1 WHERE (date >= ${fromDate} AND date <= ${toDate}) AND exercise='${exerciseF}'`;
    const data = await client.query(query);
    const count = data.rows[0].count;

    numSets[exercise] = count;
    console.log(`You did ${count} sets of ${exercise} from ${fromDate} to ${toDate}`);
    console.log(numSets);

    res.send(numSets);
})

module.exports = router;