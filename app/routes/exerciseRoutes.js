const express = require('express');
const router = express.Router();
const { performQuery } = require('../utils/dbModule');
const { v4: uuid } = require('uuid');
const { getExerciseMap, getExercisesArray, getMuscleGroups } = require('../utils/fetchEnums');
const { isLoggedIn } = require('../utils/middleware');

// ---------- SET LOCAL VARIABLES REPRESENTING ENUMS (exercise, muscleGroup) ----------
let map = {};
let exercises, muscleGroups = [];

const getEnums = async () => {
    map = await getExerciseMap();
    exercises = await getExercisesArray();
    muscleGroups = await getMuscleGroups();
    console.log(map);
    console.log(exercises);
    console.log(muscleGroups);
}

getEnums();

// Add an exercise to the Exercises table
router.post("/add", isLoggedIn, async (req, res) => {
    let { exercise, muscleGroup } = req.body;

    // Format exercise and muscle group to store in database
    exercise = exercise.toLowerCase();
    exercise = exercise.split(' ').join('_');
    muscleGroup = muscleGroup.toLowerCase();
    muscleGroup = muscleGroup.split(' ').join('_');

    const id = uuid();

    // Ensure muscle group is valid
    // TODO: make this a boolean-returning function. Throw an error if it returns false
        // also to be used in statRoutes.get('/setsPerMuscle')
    if (muscleGroups.indexOf(muscleGroup) === -1) {
        const error = `Error: ${muscleGroup} is not a valid muscle group.`;
        console.log(error);
        return res.send({ message: error });
    }

    // Using a varchar(45) field to store "exercise:muscleGroup" as Primary Key, manually populated with the string in the next line.
    const exerciseAndMuscleGroup = `${exercise}:${muscleGroup}`;
    const query3 = `INSERT INTO exercises(id, name, musclegroup, nameandmusclegroup, owner) VALUES('${id}', '${exercise}', '${muscleGroup}', '${exerciseAndMuscleGroup}', '${req.user.id}')`;
    await performQuery(query3);
    const x3 = await performQuery('SELECT * FROM exercises');
    console.log(x3.rows);

    // update local 'Exercises' array
    await getEnums(); 

    // Verify that the last element of the local 'Exercises' array matches user entry
    const response = { message: '' };
    if (exercises[exercises.length - 1] === exercise) {
        console.log('exercises matched');
        response.message = `Successfully added exercise ${req.body.exercise}`;
    } else {
        response.message = 'Exercise was not added';
    }
    return res.send(response);
})

router.delete('/', isLoggedIn, async (req, res) => {
   const {name} = req.query;
   const muscleGroup = map.get(name);
   console.log(muscleGroup);
})

module.exports = router;