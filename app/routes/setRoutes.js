const express = require('express');
const router = express.Router();
const { performQuery } = require('../utils/dbModule');
const { getExerciseMap, getExercisesArray, getMuscleGroups } = require('../utils/fetchEnums');

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
    console.log(map);
    res.send(map);
})

// Add a new set
router.post("/add", async (req, res) => {
    const { reps, weight, comments = '' } = req.body;
    let { date, exercise } = req.body; // FIX: date is currently assumed to come as a string in the format 'yyyy-mm-dd' 

    // Format exercise data to work with the database
    exercise = exercise.toLowerCase(); // because enum is all in lower case
    exercise = exercise.split(' ').join('_'); // because enums don't have whitespaces, only underscores. We do the opposite (replace _ with whitespace) in the Client -- see client/src/helpers/formatEnum.js.

    const muscleGroup = map.get(exercise);

    if (exercises.indexOf(exercise) === -1) {
        const error = `Error: ${exercise} is not a valid exercise.`;
        console.log(error);
        return res.send(error);
    } else if (muscleGroups.indexOf(muscleGroup) === -1) {
        const error = `Error: ${muscleGroup} is not a valid muscle group.`;
        console.log(error);
        return res.send(error);
    }

    exercise = `${exercise}:${muscleGroup}`; // more formatting
    const query = `INSERT INTO set1(reps, weight, date, exercise, musclegroup, comments) VALUES (${reps}, ${weight}, '${date}', '${exercise}', '${muscleGroup}', '${comments}')`;
    console.log(query);
    await performQuery(query);

    const all = await performQuery('select * from set1');
    res.send(all.rows);
})

router.get('/all', async (req, res) => {
    const query = 'SELECT * FROM set1;'
    const all = await performQuery(query);
    res.send(all.rows);
})

module.exports = router;
