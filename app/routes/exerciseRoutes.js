const express = require('express');
const router = express.Router();
const { performQuery } = require('../utils/dbModule');
const { v4: uuid } = require('uuid');
const { getExercisesArray, getMuscleGroups } = require('../utils/fetchEnums');
const { isLoggedIn } = require('../utils/middleware');

// ---------- SET LOCAL VARIABLES REPRESENTING ENUMS (exercise, muscleGroup) ----------
let exercises, muscleGroups = [];

const getEnums = async () => {
    exercises = await getExercisesArray();
    muscleGroups = await getMuscleGroups();
}

getEnums();

// Add an exercise to the Exercises table
router.post("/add", isLoggedIn, async (req, res, next) => {
    let { exercise, muscleGroup } = req.body;

    const response = { message: '' };

    if (exercise === '') return next(new Error('Name cannot be blank'));
    if (muscleGroup === '') return next(new Error('Muscle group cannot be blank'));

    // Format exercise and muscle group to store in database
    exercise = exercise.toLowerCase();
    exercise = exercise.split(' ').join('_');
    muscleGroup = muscleGroup.toLowerCase();
    muscleGroup = muscleGroup.split(' ').join('_');

    const id = uuid();

    // Ensure muscle group is valid
    // TODO: make this a boolean-returning function. Throw an error if it returns false
    // also to be used in statRoutes.get('/setsPerMuscle')
    if (muscleGroups.indexOf(muscleGroup) === -1) return next(new Error('Invalid muscle group'));

    try {
        // Using a varchar(45) field to store "exercise:muscleGroup" as Primary Key, manually populated with the string in the next line.
        const exerciseAndMuscleGroup = `${exercise}:${muscleGroup}`;
        const insertQuery = `INSERT INTO exercises(id, name, musclegroup, nameandmusclegroup, owner) VALUES('${id}', '${exercise}', '${muscleGroup}', '${exerciseAndMuscleGroup}', '${req.user.id}')`;
        await performQuery(insertQuery);

        const postAdd = await performQuery(`SELECT nameandmusclegroup FROM Exercises WHERE owner = '${req.user.id}' ORDER BY musclegroup, name`);
        const exercisesPostAdd = [];
        console.log(postAdd.rows);
        for (let row of postAdd.rows) {
            exercisesPostAdd.push(row.nameandmusclegroup);
        }
        response.exercises = exercisesPostAdd;

        // update local 'Exercises' array
        await getEnums();

        // Verify that the database contains the exercise that was just added above
        const verifyQuery = `SELECT * FROM Exercises WHERE nameandmusclegroup = '${exercise}:${muscleGroup}'`;
        const single = await performQuery(verifyQuery);

        if (single.rows.length === 1) {
            console.log('exercises matched');
            response.message = `Successfully added exercise ${req.body.exercise}`;
        } else {
            response.message = `Exercise ${req.body.exercise} was not added.`;
        }

    } catch (err) {
        return next(err);
    }

    return res.send(response);
})

router.delete('/', isLoggedIn, async (req, res) => {
    const { nameandmusclegroup } = req.query;
    const name = nameandmusclegroup.split(':')[0];

    const response = { message: '' };

    try {
        const query = `DELETE FROM Exercises WHERE nameandmusclegroup = '${nameandmusclegroup}'`;
        await performQuery(query);
        const msg = `Successfully deleted exercise ${name.toLowerCase().split('_').map(item => item.charAt(0).toUpperCase() + item.slice(1)).join(' ')}`;

        response.message = msg;
        await getEnums();

        const postDelete = await performQuery(`SELECT nameandmusclegroup FROM Exercises WHERE owner = '${req.user.id}' ORDER BY musclegroup, name`);

        await getEnums();

        let exercisesPostDelete = [];
        for (let row of postDelete.rows) {
            exercisesPostDelete.push(row.nameandmusclegroup);
        }

        response.exercises = exercisesPostDelete;
    } catch (err) {
        return next(err);
    }

    return res.send(response);
})

module.exports = router;