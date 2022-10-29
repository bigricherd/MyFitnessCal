const express = require("express");
const { isAfter, isEqual } = require('date-fns');
const { performQuery } = require("../utils/dbModule");
const {
    getExercisesArray,
    getMuscleGroups,
} = require("../utils/fetchEnums");
const { v4: uuid } = require("uuid");
const { isLoggedIn } = require("../utils/middleware");

const router = express.Router();

// ---------- SET LOCAL VARIABLES ----------
let exercises, muscleGroups = [];
const getEnums = async () => {
    exercises = await getExercisesArray();
    muscleGroups = await getMuscleGroups();
};

// ---------- HELPERS: ADD SETS ----------
const addSet = async (sessionId, userId, set, date) => {
    const { reps, weight, exercise } = set;
    let key = `${exercise}:${userId}`;
    const id = uuid();

    const muscleGroup = exercise.split(":")[1];

    const query = `INSERT INTO set(id, reps, weight, date, exercise, musclegroup, owner, session) VALUES ('${id}', ${reps}, ${weight}, '${date}', '${key}', '${muscleGroup}', '${userId}', '${sessionId}')`;
    await performQuery(query);
};

const addManySets = (sessionId, userId, sets, date) => {
    for (let set of sets) {
        addSet(sessionId, userId, set, date);
    }
};

// ---------- VALIDATION ----------
const validateFields = (values, next) => {
    const { title, date, startdatetime, enddatetime, comments = "", sets = [] } = values;
    let startTime = new Date(startdatetime);
    let endTime = new Date(enddatetime);

    if (!title || !date || !startdatetime || !enddatetime) {
        return next(new Error("Please fill out required fields."));
    } else if (title.length > 35) {
        return next(new Error("Maximum title length is 35 characters."));
    } else if (comments.length > 40) {
        return next(new Error("Maximum comments length is 40 characters."));
    } else if (isAfter(startTime, endTime) || isEqual(startTime, endTime)) {
        return next(new Error("End time must come after start time."));
    }
    return true;
};

const validateSets = (sets, next) => {
    for (let set of sets) {
        if ((!set.weight && set.weight !== 0) || parseInt(set.weight) < 0) {
            return next(new Error("Weight cannot be negative. BE"));
        } else if (!set.reps || parseInt(set.reps) <= 0) {
            return next(new Error("Minimum reps for a set is 1. BE"));
        }
    }
    return true;
}

const validateAdd = (values, next) => {
    if (validateFields(values, next)) {
        const { sets } = values;
        if (sets && sets.length > 0) {
            return validateSets(sets, next);
        }
        return true;
    };
};

const authorizeEdit = async (sessionId, user, next) => {
    const session = await performQuery(`SELECT * FROM Sessions WHERE id = '${sessionId}'`);
    if (session.rows.length < 1) {
        return next(new Error("Session does not exist."));
    } else if (session.rows[0].owner !== user) {
        return next(new Error("You do not have permission to do that."));
    }
    return true;
}

const validateEdit = async (values, user, next) => {
    const { id } = values;
    if (await authorizeEdit(id, user, next)) {
        return validateFields(values, next);
    }
};

const validateAddSets = async (values, user, next) => {
    const { sets, sessionId: id } = values;
    if (await authorizeEdit(id, user, next)) {
        if (sets.length === 0) {
            return next(new Error("Please add at least one set. BE"));
        }
        return validateSets(sets, next);
    }
};

const validateDelete = async (id, user, next) => {
    return authorizeEdit(id, user, next);
};

const validateDeleteSet = async (setId, user, next) => {
    const set = await performQuery(`SELECT * FROM Set WHERE id = '${setId}'`);
    if (set.rows.length < 1) {
        return next(new Error("Set does not exist."));
    } else if (set.rows[0].owner !== user) {
        return next(new Error("You do not have permission to do that."));
    }
    return true;
};

// ---------- ROUTES ----------

// Get all sessions of the current user
router.get("/all", isLoggedIn, async (req, res) => {
    const query = `SELECT * FROM sessions WHERE owner = '${req.user.id}'`;
    const all = await performQuery(query);
    res.send(all.rows);
});

// Fetch data of session with given id, which is then displayed in a SessionPopup
router.get("/", async (req, res) => {
    const { id } = req.query;

    const query = `SELECT * FROM sessions WHERE id = '${id}'`;
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

// Add a new session TODO: clean up verification at the end of the route
router.post("/add", isLoggedIn, async (req, res, next) => {
    await getEnums(); // we need these for creating sets
    const { title, date, startdatetime, enddatetime, comments = "", sets = [] } = req.body;

    if (validateAdd({
        title,
        date,
        startdatetime,
        enddatetime,
        comments,
        sets
    }, next)) {
        const userId = req.user.id;

        // no need to format timestamps since postgres will do it for you
        const id = uuid();
        const query = `INSERT INTO session(id, title, startdatetime, enddatetime, comments, owner) VALUES ('${id}', '${title}', '${startdatetime}', '${enddatetime}', '${comments}', '${userId}')`;
        await performQuery(query);

        // call addManySets
        addManySets(id, userId, sets, date);

        const response = { count: 0, message: "" };

        // Set response.count to liftState
        const numSessions = await performQuery(`SELECT count(id) FROM sessions WHERE owner = '${userId}'`);
        response.count = numSessions.rows[0].count;

        // VALIDATION
        const sessionFromDb = await performQuery(`select * from sessions WHERE id = '${id}'`);

        // TODO test this validation
        if (sessionFromDb.rows.length === 1 && sessionFromDb.rows[0].sets.length === sets.length) {
            response.message = `Successfully added session from ${req.body.startdatetime} to ${req.body.enddatetime}`;
        } else {
            response.message = "Session was not added";
        }

        return res.send(response);
    }
});

// Delete session
router.delete("/", isLoggedIn, async (req, res, next) => {
    const { sessionId } = req.query;
    if (await validateDelete(sessionId, req.user.id, next)) {
        const query = `DELETE FROM sessions WHERE id = '${sessionId}'`;
        await performQuery(query);
        const all = await performQuery('SELECT count(id) from sessions');
        res.send({ count: all.rows[0].count });
    }
});

// Delete a set with given ID from a session
router.delete("/set", isLoggedIn, async (req, res, next) => {
    const { setId, sessionId } = req.query;
    if (await validateDeleteSet(setId, req.user.id, next)) {
        const query = `DELETE from set WHERE id = '${setId}'`;
        await performQuery(query);

        const all = await performQuery(`SELECT count(id) from set WHERE session = '${sessionId}'`);
        res.send({ count: all.rows[0].count });
    }
});

// Add sets to an existing session
router.post("/addSets", isLoggedIn, async (req, res, next) => {
    await getEnums();
    const { sets, sessionId, date } = req.body;
    const userId = req.user.id;

    if (await validateAddSets({ sets, sessionId, date }, userId, next)) {

        addManySets(sessionId, userId, sets, date);

        const c = await performQuery(`SELECT count(id) FROM set WHERE session = '${sessionId}'`);

        res.send({ numSets: c.rows[0].count });
    }
});

// Edit a session (not including sets)
router.patch("/", isLoggedIn, async (req, res, next) => {
    const { id } = req.query;
    const { title, date, startdatetime, enddatetime, comments = '', edited } = req.body;

    if (await validateEdit({
        id,
        title,
        date,
        startdatetime,
        enddatetime,
        comments
    }, req.user.id, next)) {

        const query = `UPDATE session SET
                    title = '${title}',
                    startdatetime = '${startdatetime}',
                    enddatetime = '${enddatetime}',
                    comments = '${comments}'
                    WHERE id = '${id}'`;
        await performQuery(query);

        const row = await performQuery(`SELECT * FROM sessions WHERE id = '${id}'`);

        res.send({ count: edited + 1 });
    }
});

module.exports = router;
