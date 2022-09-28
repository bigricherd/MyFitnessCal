const express = require('express');
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
            const query = `SELECT COUNT(*) FROM set WHERE ((date >= '${fromDate}' AND date <= '${toDate}') AND muscleGroup = '${muscleGroup}') AND owner = '${req.user.id}'`;
            const data = await performQuery(query);
            const count = data.rows[0].count;
            muscleGroup = muscleGroup.split('_').join(' ');
            numSets[muscleGroup] = count;
        }
        console.log(numSets);
        return res.send({ results: numSets });
    } else {
        //TODO: verify that the user entered a valid muscle group
        const mgQuery = `SELECT COUNT(*) FROM set WHERE ((date >= '${fromDate}' AND date <= '${toDate}') AND muscleGroup = '${muscleGroup}') AND owner = '${req.user.id}'`;
        console.log(mgQuery);
        const mgData = await performQuery(mgQuery);
        const mgCount = mgData.rows[0].count;
        muscleGroup = muscleGroup.split('_').join(' ');
        numSets[muscleGroup] = mgCount;

        await getEnums();

        // Get all exercises for the given muscle group
        const getExercisesQuery = `SELECT nameandmusclegroup FROM Exercises WHERE muscleGroup = '${muscleGroup}'`;
        const exercises = await performQuery(getExercisesQuery);

        const exerciseList = [];
        for (let exercise of exercises.rows) {
            exerciseList.push(exercise.nameandmusclegroup);
        }

        for (let exercise of exerciseList) {

            const query = `SELECT count(*), AVG(weight), MAX(weight) FROM set WHERE ((date >= '${fromDate}' AND date <= '${toDate}') AND exercise = '${exercise}') AND owner = '${req.user.id}'`;
            const data = await performQuery(query);
            const count = data.rows[0].count;
            const avgWeight = parseInt(data.rows[0].avg); // Round to integer
            const maxWeight = data.rows[0].max;

            const avgRepsQuery = `SELECT AVG(reps) FROM set WHERE ((date >= '${fromDate}' AND date <= '${toDate}') AND exercise = '${exercise}') AND owner = '${req.user.id}'`;
            const avgRepsData = await performQuery(avgRepsQuery);
            const avgReps = parseFloat(avgRepsData.rows[0].avg).toFixed(1);

            // Only include an exercise if user did at least one set of it
            if (count > 0) {
                exercise = exercise.split(':')[0];
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
    // TODO: send exercise as "name:musclegroup" from frontend; the route handler expects it to come in this formar

    const query = `SELECT COUNT(*) FROM set1 WHERE ((date >= ${fromDate} AND date <= ${toDate}) AND exercise='${exercise}') AND owner = '${req.user.id}'`;
    const data = await performQuery(query);
    const count = data.rows[0].count;

    numSets[exercise] = count;
    console.log(`You (user ${req.user.username}) did ${count} sets of ${exercise} from ${fromDate} to ${toDate}`);
    console.log(numSets);

    res.send(numSets);
})

module.exports = router;