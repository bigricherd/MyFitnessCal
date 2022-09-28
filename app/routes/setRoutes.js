const express = require('express');
const { v4: uuid } = require('uuid');
const router = express.Router();
const { performQuery } = require('../utils/dbModule');
const { getExercisesArray, getMuscleGroups } = require('../utils/fetchEnums');
const { isLoggedIn } = require('../utils/middleware');

let exercises, muscleGroups = [];

const getEnums = async () => {
    exercises = await getExercisesArray();
    muscleGroups = await getMuscleGroups();
}
getEnums();

// Add a new set TODO: add Session id
router.post("/add", isLoggedIn, async (req, res) => {
    await getEnums(); // without this, we cannot go directly from adding a new exercise to adding a set of it.
    const { reps, weight } = req.body;
    let { date, exercise } = req.body; // FIX: date is currently assumed to come as a string in the format 'yyyy-mm-dd' 

    const muscleGroup = exercise.split(':')[1];

    // Error handling -- invalid exercise or muscle group
    if (exercises.indexOf(exercise) === -1) {
        return next(new Error('Invalid exercise'));
    } else if (muscleGroups.indexOf(muscleGroup) === -1) {
        return next(new Error('Invalid muscle group'));
    }

    const id = uuid();

    const query = `INSERT INTO set(id, reps, weight, date, exercise, musclegroup, owner) VALUES ('${id}', ${reps}, ${weight}, '${date}', '${exercise}', '${muscleGroup}', '${req.user.id}')`;
    await performQuery(query);

    const all = await performQuery('select * from set');
    const newestSet = all.rows[all.rows.length - 1];
    const setsMatch = (newestSet.id === id) && (newestSet.reps == reps) && (newestSet.weight == weight)
        && (newestSet.exercise === exercise) && (newestSet.musclegroup === muscleGroup) && (newestSet.owner === req.user.id);

    const response = { message: '' };
    if (setsMatch) {
        response.message = `Successfully added set of ${req.body.exercise}`;
    } else {
        response.message = 'Set was not added'; // setsMatch is false when one of reps or weight has a decimal value I think, TODO: solve this
    }
    return res.send(response);
})

router.get('/all', isLoggedIn, async (req, res) => {
    const query = `SELECT * FROM set WHERE owner = '${req.user.id}'`;
    const all = await performQuery(query);
    res.send(all.rows);
})

module.exports = router;
