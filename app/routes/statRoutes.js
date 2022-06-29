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
// TODO: We'll probably need to refactor this handler, it's long as hell lmao
router.get("/setsPerMuscle", isLoggedIn, async (req, res) => {
    const { fromDate, toDate } = req.query;
    let { muscleGroup } = req.query;

    // Format muscle group to match string format in database
    muscleGroup = muscleGroup.toLowerCase();
    muscleGroup = muscleGroup.split(' ').join('_');
    console.log(req.query);
    let numSets = {};
    let numSetsPerE = {};

    if (muscleGroup === 'all') {
        for (let muscleGroup of muscleGroups) {
            const query = `SELECT COUNT(*) FROM set1 WHERE ((date >= '${fromDate}' AND date <= '${toDate}') AND muscleGroup = '${muscleGroup}') AND owner = '${req.user.id}'`;
            const data = await performQuery(query);
            const count = data.rows[0].count;
            muscleGroup = muscleGroup.split('_').join(' ');
            numSets[muscleGroup] = count;
        }
        console.log(numSets);
        return res.send({ results: numSets });
    } else {
        //TODO: verify that the user entered a valid muscle group
        const mgQuery = `SELECT COUNT(*) FROM set1 WHERE ((date >= '${fromDate}' AND date <= '${toDate}') AND muscleGroup = '${muscleGroup}') AND owner = '${req.user.id}'`;
        console.log(mgQuery);
        const mgData = await performQuery(mgQuery);
        const mgCount = mgData.rows[0].count;
        muscleGroup = muscleGroup.split('_').join(' ');
        numSets[muscleGroup] = mgCount;
        console.log(numSets);

        await getEnums();

        // Get all exercises for the given muscle group
        const filteredMap = new Map(
            Array.from(map).filter(([key, value]) => {
                if (value === muscleGroup.split(' ').join('_')) {
                    return true;
                }
                return false;
            })
        )

        console.log(filteredMap);
        const exerciseList = Array.from(filteredMap.keys());
        for (let exercise of exerciseList) {
            // Use exerciseTmp to mutate exercise to match string format in database 
            let exerciseTmp = exercise.toLowerCase(); // because enum is all in lower case
            exerciseTmp = exerciseTmp.split(' ').join('_'); // and separated by underscores, not spaces
            const muscleGroup = map.get(exerciseTmp);
            exerciseTmp = `${exerciseTmp}:${muscleGroup}`;

            const query = `SELECT count(*), AVG(weight), MAX(weight) FROM set1 WHERE ((date >= '${fromDate}' AND date <= '${toDate}') AND exercise = '${exerciseTmp}') AND owner = '${req.user.id}'`;
            const data = await performQuery(query);
            //console.log(data.rows);
            const count = data.rows[0].count;
            const avgWeight = data.rows[0].avg; // TODO: reformat
            const maxWeight = data.rows[0].max;

            const avgRepsQuery = `SELECT AVG(reps) FROM set1 WHERE ((date >= '${fromDate}' AND date <= '${toDate}') AND exercise = '${exerciseTmp}') AND owner = '${req.user.id}'`;
            const avgRepsData = await performQuery(avgRepsQuery);
            const avgReps = avgRepsData.rows[0].avg; // TODO: reformat
            console.log(avgReps);

            // Only include an exercise if user did at least one set of it
            if (count > 0) {
                exercise = exercise.split('_').join(' ');
                numSetsPerE[exercise] = { count, avgWeight, maxWeight, avgReps };
            }
        }
        console.log(numSetsPerE);

        return res.send({ results: numSets, perExercise: numSetsPerE });
    }

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