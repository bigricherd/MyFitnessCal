const express = require('express');
const { isAfter } = require('date-fns');
const { performQuery } = require('../utils/dbModule');
const { getExercisesArray, getMuscleGroups } = require('../utils/fetchEnums');
const { isLoggedIn } = require('../utils/middleware');

const router = express.Router();

// ---------- SET LOCAL VARIABLES ----------
let exercises, muscleGroups = [];

const getEnums = async () => {
    exercises = await getExercisesArray();
    muscleGroups = await getMuscleGroups();
}
getEnums();

// ---------- VALIDATION ---------- 
const validateVolumeCounter = (values, next) => {
    const { fromDate, toDate, muscleGroup } = values;

    let newFromDate = new Date(fromDate);
    let newToDate = new Date(toDate);

    if (!muscleGroup || !fromDate || !toDate) {
        return next(new Error("Please fill out empty fields."));
    } else if (['all', ...muscleGroups].indexOf(muscleGroup) === -1) {
        return next(new Error("Invalid muscle group. Please try again."));
    } else if (isAfter(newFromDate, newToDate)) {
        return next(new Error("Please provide a valid date range."))
    }
    return true;
}

const validateProgressTracker = (values, next) => {
    const { fromDate, toDate, exercise } = values;

    let newFromDate = new Date(fromDate);
    let newToDate = new Date(toDate);

    if (!exercise || !fromDate || !toDate) {
        return next(new Error("Please fill out empty fields."));
    } else if (exercises.indexOf(exercise) === -1) {
        return next(new Error("Invalid exercise. Please try again."));
    } else if (isAfter(newFromDate, newToDate)) {
        return next(new Error("Please provide a valid date range."))
    }
    return true;
}

// ---------- ROUTES ----------
// Volume Counter
router.get("/setsPerMuscle", isLoggedIn, async (req, res, next) => {
    const { fromDate, toDate } = req.query;
    let { muscleGroup } = req.query;
    const userId = req.user.id;

    // Format muscle group to match string format in database
    if (muscleGroup) {
        muscleGroup = muscleGroup.toLowerCase();
        muscleGroup = muscleGroup.split(' ').join('_');
    }

    if (validateVolumeCounter({ fromDate, toDate, muscleGroup }, next)) {
        let result = {};
        let chosenGroups = [];

        if (muscleGroup === 'all') {
            chosenGroups = muscleGroups.slice();
        } else {
            chosenGroups.push(muscleGroup);
        }

        for (let group of chosenGroups) {
            const mgQuery = `SELECT COUNT(*) FROM set WHERE ((date >= '${fromDate}' AND date <= '${toDate}') AND muscleGroup = '${group}') AND owner = '${req.user.id}'`;
            const mgData = await performQuery(mgQuery);
            const mgCount = mgData.rows[0].count;
            let groupTemp = group.split('_').join(' ');
            result[groupTemp] = { 'count': 0, 'exercises': {} };
            result[groupTemp]['count'] = mgCount;

            await getEnums();

            // Get all exercises for the given muscle group
            const getExercisesQuery = `SELECT nameandmusclegroup FROM Exercise WHERE muscleGroup = '${group}'`;
            const exercises = await performQuery(getExercisesQuery);

            const exerciseList = [];
            for (let exercise of exercises.rows) {
                exerciseList.push(exercise.nameandmusclegroup);
            }

            for (let exercise of exerciseList) {
                let key = `${exercise}:${userId}`;
                const query = `SELECT count(*), AVG(weight), MAX(weight) FROM set WHERE ((date >= '${fromDate}' AND date <= '${toDate}') AND exercise = '${key}') AND owner = '${userId}'`;
                const data = await performQuery(query);
                const count = data.rows[0].count;
                const avgWeight = parseInt(data.rows[0].avg); // Round to integer
                const maxWeight = data.rows[0].max;

                const avgRepsQuery = `SELECT AVG(reps) FROM set WHERE ((date >= '${fromDate}' AND date <= '${toDate}') AND exercise = '${key}') AND owner = '${userId}'`;
                const avgRepsData = await performQuery(avgRepsQuery);
                const avgReps = parseFloat(avgRepsData.rows[0].avg).toFixed(1);

                // Only include an exercise if user did at least one set of it
                if (count > 0) {
                    exercise = exercise.split(':')[0];
                    exercise = exercise.split('_').join(' ');
                    result[groupTemp]['exercises'][exercise] = { count, avgWeight, maxWeight, avgReps };
                }
            }
        }
        return res.send(result);
    }
});

// Progress Tracker 
router.get('/setsOfExercise', isLoggedIn, async (req, res, next) => {
    const { fromDate, toDate } = req.query;
    let { exercise } = req.query;

    // Format muscle group to match string format in database
    if (exercise) {
        exercise = exercise.toLowerCase();
        exercise = exercise.split(' ').join('_');
    }

    if (validateProgressTracker({ fromDate, toDate, exercise }, next)) {
        let key = `${exercise}:${req.user.id}`;
        const query = `SELECT * FROM set WHERE (exercise = '${key}' AND (date >= '${fromDate}' AND date <= '${toDate}')) ORDER BY date DESC`;
        const data = await performQuery(query);

        let sets = {};
        for (let row of data.rows) {
            const session = await performQuery(`SELECT title FROM sessions WHERE id = '${row.session}'`);
            const title = session.rows[0].title;

            let set = {
                id: row.id,
                reps: row.reps,
                weight: row.weight,
            }

            if (sets[row.session]) {
                let temp = sets[row.session]['sets'];
                temp.push(set);
                sets[row.session]['sets'] = temp;
            } else {
                let newSession = {
                    title: title,
                    date: row.date,
                    sets: [set]
                }
                sets[row.session] = newSession;
            }
        }
        res.send(sets);
    }
});

// Fetch list of exercises, grouped by muscleGroup
router.get('/exercisesGrouped', isLoggedIn, async (req, res) => {
    const query = `SELECT nameandmusclegroup, musclegroup FROM exercise WHERE owner = '${req.user.id}' ORDER BY musclegroup`;
    const data = await performQuery(query);

    const exercises = {};

    for (let row of data.rows) {
        if (!exercises[row.musclegroup]) {
            exercises[row.musclegroup] = [row.nameandmusclegroup];
        } else {
            let temp = exercises[row.musclegroup];
            temp.push(row.nameandmusclegroup);
            exercises[row.musclegroup] = temp;
        }
    }

    res.send(exercises);

});

module.exports = router;