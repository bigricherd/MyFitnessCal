const express = require("express");
const router = express.Router();
const { performQuery } = require("../utils/dbModule");
const {
    getExercisesArray,
    getMuscleGroups,
} = require("../utils/fetchEnums");
const { v4: uuid } = require("uuid");
const { isLoggedIn } = require("../utils/middleware");

let exercises, muscleGroups = [];

const getEnums = async () => {
    exercises = await getExercisesArray();
    muscleGroups = await getMuscleGroups();
};

const addSet = async (sessionId, userId, set, date) => {
    const { reps, weight, exercise } = set;
    const id = uuid();

    const muscleGroup = exercise.split(":")[1];

    const query = `INSERT INTO set(id, reps, weight, date, exercise, musclegroup, owner, session) VALUES ('${id}', ${reps}, ${weight}, '${date}', '${exercise}', '${muscleGroup}', '${userId}', '${sessionId}')`;
    await performQuery(query);
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
    console.log(title, date, startdatetime, enddatetime, comments);
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

    const query = `SELECT * FROM session WHERE id = '${id}'`;
    const all = await performQuery(query);
    const session = all.rows[0];

    const getSets = `SELECT id, reps, weight, exercise from set WHERE session = '${id}' ORDER BY exercise`;
    const sets = await performQuery(getSets);

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

// Delete session
router.delete("/", isLoggedIn, async (req, res) => {
    const { id } = req.body;

    const query = `DELETE FROM session WHERE id = '${id}'`;
    await performQuery(query);
    const all = await performQuery('SELECT count(id) from session');
    res.send({ count: all.rows[0].count });
});

// Delete a set with given ID from a session
router.delete("/set", isLoggedIn, async (req, res) => {
    const { setId, sessionId } = req.body;

    const query = `DELETE from set WHERE id = '${setId}'`;
    await performQuery(query);

    const all = await performQuery(`SELECT count(id) from set WHERE session = '${sessionId}'`);
    res.send({ count: all.rows[0].count });
});

// Add sets to an existing session
router.post("/addSets", isLoggedIn, async (req, res) => {
    await getEnums();
    const { sets, sessionId, date } = req.body;
    const userId = req.user.id;

    addManySets(sessionId, userId, sets, date);

    const c = await performQuery(`SELECT count(id) FROM set WHERE session = '${sessionId}'`);

    res.send({ numSets: c.rows[0].count });
});

// Edit a session (not including sets)
router.patch("/", isLoggedIn, async (req, res) => {
    const { id } = req.query;
    const { title, date, startdatetime, enddatetime, comments = '', edited } = req.body;
    console.log(edited);
    console.log(id);
    console.log(title, date, startdatetime, enddatetime, comments);

    const query = `UPDATE session SET
                    title = '${title}',
                    startdatetime = '${startdatetime}',
                    enddatetime = '${enddatetime}',
                    comments = '${comments}'
                    WHERE id = '${id}'`;
    await performQuery(query);

    const row = await performQuery(`SELECT * FROM session WHERE id = '${id}'`);
    console.log(row.rows[0]);

    res.send({ count: edited + 1 });
});

module.exports = router;
