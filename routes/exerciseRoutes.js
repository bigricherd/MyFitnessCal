const express = require('express');
const router = express.Router();
const { performQuery } = require('../utils/dbModule');
const { v4: uuid } = require('uuid');
const { getExercisesArray, getMuscleGroups } = require('../utils/fetchEnums');
const { isLoggedIn } = require('../utils/middleware');
const { formatExercise, reverseFormatExercise } = require('../utils/formatExercise');

// ---------- SET LOCAL VARIABLES ----------
let exercises, muscleGroups = [];

const getEnums = async () => {
    exercises = await getExercisesArray();
    muscleGroups = await getMuscleGroups();
}

getEnums();

// ---------- VALIDATION ----------
const validateAdd = async (values, next) => {
    const { exercise, muscleGroup, userId } = values;
    const e = await performQuery(`SELECT * FROM Exercise WHERE key = '${exercise}:${muscleGroup}:${userId}'`);

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
    // Exercise already exists
    else if (e.rows.length > 0) {
        return next(new Error("That exercise already exists."));
    }
    return true;
}

const validateDelete = async (key, user, next) => {
    const exercise = await performQuery(`SELECT * FROM Exercise WHERE key = '${key}'`);

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
    const query = `SELECT nameandmusclegroup FROM Exercise WHERE owner = '${id}' ORDER BY muscleGroup, name`;
    const data = await performQuery(query);

    const exercisesByUser = [];
    for (let row of data.rows) {
        exercisesByUser.push(row.nameandmusclegroup);
    }
    res.send({ exercisesByUser });
});

// Add an Exercise
router.post("/add", isLoggedIn, async (req, res, next) => {
    let { exercise, muscleGroup } = req.body;
    const userId = req.user.id;

    // String formatting to work with database
    if (muscleGroup) {
        muscleGroup = muscleGroup.toLowerCase();
        muscleGroup = muscleGroup.split(' ').join('_');
    }

    if (await validateAdd({ exercise, muscleGroup, userId }, next)) {

        const response = { message: '' };
        const id = uuid();

        try {
            // Using a varchar(45) field to store "exercise:muscleGroup" as Primary Key, manually populated with the string in the next line.
            const exerciseAndMuscleGroup = `${reverseFormatExercise(exercise)}:${muscleGroup}`;
            const key = `${exerciseAndMuscleGroup}:${userId}`
            const insertQuery = `INSERT INTO Exercise (id, name, musclegroup, nameandmusclegroup, key, owner) VALUES('${id}', '${reverseFormatExercise(exercise)}', '${muscleGroup}', '${exerciseAndMuscleGroup}', '${key}', '${req.user.id}')`;
            await performQuery(insertQuery);

            const postAdd = await performQuery(`SELECT nameandmusclegroup FROM Exercise WHERE owner = '${req.user.id}' ORDER BY musclegroup, name`);
            const exercisesPostAdd = [];
            for (let row of postAdd.rows) {
                exercisesPostAdd.push(row.nameandmusclegroup);
            }
            response.exercises = exercisesPostAdd;

            // update local 'Exercises' array
            await getEnums();

            // Verify that the database contains the exercise that was just added above
            const verifyQuery = `SELECT * FROM Exercise WHERE key = '${key}'`;
            const single = await performQuery(verifyQuery);

            if (single.rows.length === 1) {
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
    const key = `${nameandmusclegroup}:${req.user.id}`
    if (await validateDelete(key, req.user.id, next)) {
        const name = nameandmusclegroup.split(':')[0];
        const response = { message: '' };

        try {
            const query = `DELETE FROM Exercise WHERE key = '${key}'`;
            await performQuery(query);
            const msg = `Successfully deleted exercise ${formatExercise(name)}`;

            response.message = msg;
            await getEnums();

            const postDelete = await performQuery(`SELECT nameandmusclegroup FROM Exercise WHERE owner = '${req.user.id}' ORDER BY musclegroup, name`);

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

// Add many Exercises (through Welcome UX)
router.post("/addMany", isLoggedIn, async (req, res, next) => {
    const { exercises } = req.body;
    const userId = req.user.id;
    const response = { message: "" };

    // Loop through exercises array
    for (let exercise of exercises) {
        let name = exercise.split(":")[0];
        let muscleGroup = exercise.split(":")[1];

        if (muscleGroup) {
            muscleGroup = muscleGroup.toLowerCase();
            muscleGroup = muscleGroup.split(' ').join('_');
        }

        // Add exercise
        if (validateAdd({ name, muscleGroup, userId }, next)) {
            try {
                const exerciseAndMuscleGroup = `${reverseFormatExercise(name)}:${muscleGroup}`;
                const key = `${exerciseAndMuscleGroup}:${userId}`;
                const id = uuid();
                const insertQuery = `INSERT INTO Exercise (id, name, musclegroup, nameandmusclegroup, key, owner) VALUES('${id}', '${reverseFormatExercise(name)}', '${muscleGroup}', '${exerciseAndMuscleGroup}', '${key}', '${req.user.id}')`;
                await performQuery(insertQuery);

                // Verify that the database contains the exercise that was just added above
                const verifyQuery = `SELECT * FROM Exercise WHERE key = '${key}'`;
                const single = await performQuery(verifyQuery);

                if (single.rows.length !== 1) {
                    return next(new Error(`Exercise ${formatExercise(name, " ")} was not added.`));
                }

            } catch (err) {
                return next(err);
            }
        }
    }

    // Set current user's firstVisit to false
    await performQuery(`UPDATE appUser SET firstvisit = 'false' WHERE id = '${req.user.id}'`);
    response.firstVisit = false;

    if (exercises.length > 0) response.message = "Successfully added exercises.";

    const c = await performQuery(`SELECT count(id) FROM Exercise WHERE owner = '${req.user.id}'`);
    response.count = c.rows[0].count;

    return res.send(response);
})

module.exports = router;