const express = require("express");
const router = express.Router();
const { performQuery } = require("../utils/dbModule");
const {
    getExerciseMap,
    getExercisesArray,
    getMuscleGroups,
} = require("../utils/fetchEnums");
const { v4: uuid } = require("uuid");
const { isLoggedIn } = require("../utils/middleware");

const addSet = async (sessionId, set, date) => {
    const { reps, weight } = set;
    let { exercise } = set;
    const id = uuid();

    // Format exercise data to work with the database
    exercise = exercise.toLowerCase(); // because enum is all in lower case
    exercise = exercise.split(' ').join('_'); // because enums don't have whitespaces, only underscores. We do the opposite (replace _ with whitespace) in the Client -- see client/src/helpers/formatEnum.js.

    const muscleGroup = map.get(exercise);
    exercise = `${exercise}:${muscleGroup}`; // more formatting

    const query = `INSERT INTO set1(id, reps, weight, date, exercise, musclegroup, owner, session) VALUES ('${id}', ${reps}, ${weight}, '${date}', '${exercise}', '${muscleGroup}', '${req.user.id}', '${sessionId}')`;
    console.log(query);
    await performQuery(query);
}

const addManySets = (id, sets, date) => {
    for (let set of sets) {
        addSet(sessionId, set, date);
    }
}

// Add a new session
router.post("/add", isLoggedIn, async (req, res) => {
    await getEnums(); // we need these for creating sets
    const { title, comments = "", startdatetime, enddatetime, sets } = req.body;

    // no need to format timestamps since posgres will do it for you
    const id = uuid();
    const query = `INSERT INTO session(id, title, startdatetime, enddatetime, comments, owner) VALUES (${id}, ${title}, '${startdatetime}', '${enddatetime}', '${comments}', '${req.user.id}')`;
    console.log(query);
    await performQuery(query);

    // call addManySets
    console.log("adding many sets: " + sets);
    //addManySets(id, sets, date);

    const all = await performQuery("select * from session");
    const newestSession = all.rows[all.rows.length - 1];
    console.log(newestSession);

    // TODO: figure out how to format start & end timestampts to compare without format error
    const sessionsMatch =
        newestSession.title == title &&
        newestSession.startdatetime == startdatetime &&
        newestSession.enddatetime === enddatetime &&
        newestSession.comments === comments &&
        newestSession.owner === req.user.id;

    const response = { message: "" };
    if (sessionsMatch) {
        response.message = `Successfully added session from ${req.body.startdatetime} to ${req.body.enddatetime}`;
    } else {
        response.message = "Session was not added";
    }

    // Simpler validation of the session being added - we check its existence and the number of sets associated with it
    // const newSession = await performQuery(`select * from session where id = '${id}'`);
    // const newSessionSets = await performQuery(`select * from set1 WHERE session = '${id}'`);
    // const sessionAdded = newSession.rows.length === 1 && newSessionSets.rows.length === sets.length;
    // if (sessionAdded) {
    //     response.message = `Successfully added session from ${req.body.startdatetime} to ${req.body.enddatetime}`;
    // } else {
    //     response.message = "Session was not added";
    // }

    return res.send(response);
});

// Get all sessions of the current user
router.get("/all", isLoggedIn, async (req, res) => {
    const query = `SELECT * FROM session WHERE owner = '${req.user.id}'`;
    const all = await performQuery(query);
    res.send(all.rows);
});

module.exports = router;
