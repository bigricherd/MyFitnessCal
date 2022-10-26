const express = require('express');
const router = express.Router();
const { performQuery } = require('../utils/dbModule');
const { v4: uuid } = require('uuid');
const { getExercisesArray, getMuscleGroups } = require('../utils/fetchEnums');
const { isLoggedIn } = require('../utils/middleware');
const { formatExercise } = require('../utils/formatExercise');

// ---------- SET LOCAL VARIABLES ----------
let exercises, muscleGroups = [];

const getEnums = async () => {
    exercises = await getExercisesArray();
    muscleGroups = await getMuscleGroups();
}

getEnums();

// ---------- VALIDATION ----------
const validateAdd = (values, next) => {
    const { exercise, muscleGroup } = values;

    // Empty fields
    if (exercise === "") {
        return next(new Error('Exercise name cannot be empty.'));
    } else if (muscleGroup === "") {
        return next(new Error('Muscle group cannot be empty.'));
    }
    // Invalid muscle group
    else if (muscleGroups.indexOf(muscleGroup) === -1) {
        return next(new Error('Invalid muscle group. Please try again.'));
    }
    // Exercise name too long
    else if (exercise && exercise.length > 25) {
        return next(new Error("Exercise name is too long. Max length: 25 characters. Considering using acronyms like 'BB' or 'OH'."));
    }

    return true;
}

const validateDelete = async (key, user, next) => {
    const exercise = await performQuery(`SELECT * FROM Exercises WHERE nameandmusclegroup = '${key}'`);

    // Nonexistent Exercise
    if (exercise.rows.length < 1) {
        return next(new Error("Exercise does not exist."));
    }
    // AUTHORIZATION -- User is not the owner of Exercise to be deleted
    else if (exercise.rows[0].owner !== user) {
        return next(new Error("You do not have permission to do that."));
    }

    return true;
}

// ---------- ROUTES ----------

// Get all Exercises 
router.get("/all", (req, res) => {
    getEnums();
    res.send({ message: "Exercises requested", exercises });
});

// This route is hit when the Exercises or Sessions pages load
// Returns the list of Exercises added by the currently logged in user
router.get("/byCurrentUser", isLoggedIn, async (req, res) => {
    const { id } = req.query;
    console.log(id);
    const query = `SELECT nameandmusclegroup FROM exercises WHERE owner = '${id}' ORDER BY muscleGroup, name`;
    const data = await performQuery(query);

    const exercisesByUser = [];
    for (let row of data.rows) {
        exercisesByUser.push(row.nameandmusclegroup);
    }
    ///res.send({ message: 'enums requested', exercisesByUser });
    console.log(exercisesByUser);
    res.send({ exercisesByUser });
});

// Add an Exercise
router.post("/add", isLoggedIn, async (req, res, next) => {
    let { exercise, muscleGroup } = req.body;

    // String formatting to work with database
    if (exercise) {
        exercise = exercise.toLowerCase();
        exercise = exercise.split(' ').join('_');
    }
    if (muscleGroup) {
        muscleGroup = muscleGroup.toLowerCase();
        muscleGroup = muscleGroup.split(' ').join('_');
    }

    if (validateAdd({ exercise, muscleGroup }, next)) {

        const response = { message: '' };
        const id = uuid();

        try {
            // Using a varchar(45) field to store "exercise:muscleGroup" as Primary Key, manually populated with the string in the next line.
            const exerciseAndMuscleGroup = `${exercise}:${muscleGroup}`;
            const insertQuery = `INSERT INTO exercises(id, name, musclegroup, nameandmusclegroup, owner) VALUES('${id}', '${exercise}', '${muscleGroup}', '${exerciseAndMuscleGroup}', '${req.user.id}')`;
            await performQuery(insertQuery);

            const postAdd = await performQuery(`SELECT nameandmusclegroup FROM Exercises WHERE owner = '${req.user.id}' ORDER BY musclegroup, name`);
            const exercisesPostAdd = [];
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
                response.message = `Successfully added exercise ${formatExercise(req.body.exercise, " ")}`;
            } else {
                response.message = `Exercise ${formatExercise(req.body.exercise, " ")} was not added.`;
            }

        } catch (err) {
            return next(err);
        }

        return res.send(response);
    }
});

// Delete an Exercise
router.delete('/', isLoggedIn, async (req, res, next) => {
    const { nameandmusclegroup } = req.query;
    if (await validateDelete(nameandmusclegroup, req.user.id, next)) {
        const name = nameandmusclegroup.split(':')[0];
        const response = { message: '' };

        try {
            const query = `DELETE FROM Exercises WHERE nameandmusclegroup = '${nameandmusclegroup}'`;
            await performQuery(query);
            const msg = `Successfully deleted exercise ${formatExercise(name)}`;

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
    }
});

module.exports = router;