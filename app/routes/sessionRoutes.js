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

const getEnums = async () => {
    map = await getExerciseMap();
    exercises = await getExercisesArray();
    muscleGroups = await getMuscleGroups();
};

const addSet = async (sessionId, userId, set, date) => {
    const { reps, weight } = set;
    let { exercise } = set;
    const id = uuid();

    // Format exercise data to work with the database
    exercise = exercise.toLowerCase(); // because enum is all in lower case
    exercise = exercise.split(' ').join('_'); // because enums don't have whitespaces, only underscores. We do the opposite (replace _ with whitespace) in the Client -- see client/src/helpers/formatEnum.js.

    const muscleGroup = map.get(exercise);
    exercise = `${exercise}:${muscleGroup}`; // more formatting

    const query = `INSERT INTO set1(id, reps, weight, date, exercise, musclegroup, owner, session) VALUES ('${id}', ${reps}, ${weight}, '${date}', '${exercise}', '${muscleGroup}', '${userId}', '${sessionId}')`;
    console.log(query);
    await performQuery(query);
    const sets = await performQuery('SELECT * FROM set1');
    console.log(sets.rows);

}

const addManySets = (sessionId, userId, sets, date) => {
    for (let set of sets) {
        addSet(sessionId, userId, set, date);
    }
}

// Add a new session
router.post("/add", isLoggedIn, async (req, res) => {
    await getEnums(); // we need these for creating sets
    const { title, date, startdatetime, enddatetime, comments = "", sets = [] } = req.body;
    console.log(date);
    const userId = req.user.id;

    // no need to format timestamps since postgres will do it for you
    const id = uuid();
    const query = `INSERT INTO session(id, title, startdatetime, enddatetime, comments, owner) VALUES ('${id}', '${title}', '${startdatetime}', '${enddatetime}', '${comments}', '${userId}')`;
    await performQuery(query);

    // call addManySets
    addManySets(id, userId, sets, date);

    const response = { count: 0, message: "" };

    // Set response.count to liftState
    const numSessions = await performQuery(`SELECT count(id) FROM session WHERE owner = '${userId}'`);
    response.count = numSessions.rows[0].count;

    // VALIDATION
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

    // Set response message
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

// Fetches data of session with given id, to be displayed on a SessionPopup
router.get("/", async (req, res) => {
    const { id } = req.query;
    console.log(id);

    const query = `SELECT * FROM session WHERE id = '${id}'`;
    const all = await performQuery(query);
    const session = all.rows[0];
    console.log(session);

    const getSets = `SELECT id, reps, weight, exercise from set1 WHERE session = '${id}' ORDER BY exercise`;
    const sets = await performQuery(getSets);
    console.log(sets.rows);

    const s = {
        id: session.id,
        title: session.title,
        start: new Date(session.startdatetime),
        end: new Date(session.enddatetime),
        owner: session.owner,
        comments: session.comments
    }

    const setsData = {};
    for (let set of sets.rows) {
        const obj = {
            id: set.id,
            reps: set.reps,
            weight: set.weight
        }

        if (set.exercise in setsData) {
            setsData[set.exercise].push(obj);
        } else {
            setsData[set.exercise] = [obj];
        }

    }

    res.send({ session: s, sets: setsData });

});

router.delete("/", isLoggedIn, async (req, res) => {
    const { id } = req.body;

    const query = `DELETE FROM session WHERE id = '${id}'`;
    await performQuery(query);
    const all = await performQuery('SELECT count(id) from session');
    res.send({ count: all.rows[0].count });
});

router.delete("/set", isLoggedIn, async (req, res) => {
    const { setId, sessionId } = req.body;

    const query = `DELETE from set1 WHERE id = '${setId}'`;
    await performQuery(query);

    const all = await performQuery(`SELECT count(id) from set1 WHERE session = '${sessionId}'`);
    res.send({ count: all.rows[0].count });
})

router.post("/addSets", isLoggedIn, async (req, res) => {
    await getEnums();
    const { sets, sessionId, date } = req.body;
    const userId = req.user.id;

    addManySets(sessionId, userId, sets, date);

    const c = await performQuery(`SELECT count(id) FROM set1 WHERE session = '${sessionId}'`);

    res.send({ numSets: c.rows[0].count });
})

module.exports = router;
