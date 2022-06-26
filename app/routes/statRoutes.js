const express = require('express');
const router = express.Router();
const { performQuery } = require('../utils/dbModule');
const { getExerciseMap, getExercisesArray, getMuscleGroups } = require('../utils/fetchEnums');
const { isLoggedIn } = require('../utils/middleware');

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

router.get('/viewData', (req, res) => {
    res.send(`${map}`);
})

// Get total number of sets performed for given date range across all muscle groups
router.get("/setsPerMuscle/all", isLoggedIn, async (req, res) => {
    const { fromDate, toDate } = req.body;
    let numSets = {};

    for (let muscleGroup of muscleGroups) {
        const query = `SELECT COUNT(*) FROM set1 WHERE ((date >= ${fromDate} AND date <= ${toDate}) AND muscleGroup = '${muscleGroup}') AND owner = '${req.user.id}'`;
        console.log(query);
        const data = await performQuery(query);
        const count = data.rows[0].count;
        numSets[muscleGroup] = count;

        console.log(`You (user ${req.user.username}) did ${count} sets of ${muscleGroup} from ${fromDate} to ${toDate}`);
    }
    console.log(numSets);
    res.send(numSets);
})

// Get total number of sets performed for given muscleGroup and date range
// Request will be invoked by a dropdown box's onChange property; maybe on change of dates for all "stat" routes too?
router.get('/setsPerMuscle', isLoggedIn, async (req, res) => {
    const { fromDate, toDate, muscleGroup } = req.body;
    let numSets = {};

    const query = `SELECT COUNT(*) FROM set1 WHERE ((date >= ${fromDate} AND date <= ${toDate}) AND muscleGroup='${muscleGroup}') AND owner = '${req.user.id}'`;
    console.log(query);
    const data = await performQuery(query);
    const count = data.rows[0].count;

    numSets[muscleGroup] = count;
    console.log(`You (user ${req.user.username}) did ${count} sets of ${muscleGroup} from ${fromDate} to ${toDate}`);
    console.log(numSets);

    res.send(numSets);
})

// Get total number of sets performed for given Exercise and date range
router.get('/setsPerExercise', isLoggedIn, async (req, res) => {
    const { fromDate, toDate } = req.body;
    let { exercise } = req.body;
    let numSets = {};

    exercise = exercise.toLowerCase();
    exercise = exercise.split(' ').join('_');
    let exerciseF = `${exercise}:${map.get(exercise)}`;

    const query = `SELECT COUNT(*) FROM set1 WHERE ((date >= ${fromDate} AND date <= ${toDate}) AND exercise='${exerciseF}') AND owner = '${req.user.id}'`;
    const data = await performQuery(query);
    const count = data.rows[0].count;

    numSets[exercise] = count;
    console.log(`You (user ${req.user.username}) did ${count} sets of ${exercise} from ${fromDate} to ${toDate}`);
    console.log(numSets);

    res.send(numSets);
})

module.exports = router;