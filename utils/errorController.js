module.exports = (err, req, res, next) => {
    try {
        // ---------- AUTH ----------
        if (err.code === '23505' && err.constraint === 'appuser_username_key') return err = handleUserExistsError(err, res);
        if (err.message === 'Username cannot be empty') return err = handleMissingUsernameError(err, res);
        if (err.message === 'Password cannot be empty') return err = handleMissingPasswordError(err, res);
        if (err.message === 'Username is too long') return err = handleLongUsernameError(err, res);
        if (err.message === "Password is not strong enough.") return res.status(409).send({ message: err.message });
        if (err.message === 'Invalid time zone.') return res.status(409).send({ message: err.message });
        if (err.message === "Timezone was not updated. Please try again.") return res.status(409).send({ message: err.message });
        if (err.message === "User account was not deactivated. Please try again.") return res.status(409).send({ message: err.message });
        if (err.message === "That user does not exist.") return res.status(409).send({ message: err.message });



        // ---------- EXERCISES ----------
        if (err.code === '23505' && err.constraint === 'exercise_pkey') return err = handleExerciseExistsError(err, res); // FIX based on new DB setup
        if (err.message === 'Exercise name cannot be empty.') return res.status(409).send({ message: err.message });
        if (err.message === 'Muscle group cannot be empty.') return res.status(409).send({ message: err.message });
        if (err.message === 'Invalid muscle group. Please try again.') return res.status(409).send({ message: err.message });
        if (err.message === "Exercise name is too long. Max length: 30 characters. Considering using acronyms like 'BB' or 'OH'.") return res.status(409).send({ message: err.message });
        if (err.message === "That exercise already exists.") return res.status(409).send({ message: err.message });
        if (exerciseNotAddedMessage(err.message)) return res.status(409).send({ message: err.message });

        // DELETE
        if (err.message === "Exercise does not exist.") return res.status(409).send({ message: err.message });

        // ---------- AUTHORIZATION ----------
        if (err.message === "You do not have permission to do that.") return res.status(403).send({ message: err.message });

        // ---------- ANALYTICS ----------
        if (err.message === "Please fill out empty fields.") return res.status(409).send({ message: err.message });
        if (err.message === "Invalid exercise. Please try again.") return res.status(409).send({ message: err.message });
        if (err.message === "Please provide a valid date range.") return res.status(409).send({ message: err.message });

        // ---------- SESSIONS ---------- 
        // ADD / EDIT
        if (err.message === "Please fill out required fields.") return res.status(409).send({ message: err.message });
        if (err.message === "Maximum title length is 35 characters.") return res.status(409).send({ message: err.message });
        if (err.message === "Maximum comments length is 40 characters.") return res.status(409).send({ message: err.message });
        if (err.message === "End time must come after start time.") return res.status(409).send({ message: err.message });

        // SETS
        if (err.message === "Weight cannot be negative. BE") return res.status(409).send({ message: err.message });
        if (err.message === "Minimum reps for a set is 1. BE") return res.status(409).send({ message: err.message });
        if (err.message === "Distance must be greater than zero. BE") return res.status(409).send({ message: err.message });
        if (err.message === "Minimum duration for a set is 1. BE") return res.status(409).send({ message: err.message });
        if (err.message === "Please add at least one set. BE") return res.status(409).send({ message: err.message });

        // DELETE / EDIT
        if (err.message === "Session does not exist.") return res.status(409).send({ message: err.message });
        if (err.message === "Set does not exist.") return res.status(409).send({ message: err.message });

        return next(err);
    }
    catch (err) {
        return res
            .status(500)
            .send('An unknown error occurred.');
    }

}

// ---------- AUTH ----------
const handleUserExistsError = (err, res) => {
    const error = 'Sorry, that username is taken.';
    return res.status(409).send({ message: error });
}

const handleMissingUsernameError = (err, res) => {
    const error = 'Username cannot be empty.';
    return res.status(409).send({ message: error });
}

const handleLongUsernameError = (err, res) => {
    const error = 'Username is too long. Max length: 30 characters';
    return res.status(409).send({ message: error });
}

const handleMissingPasswordError = (err, res) => {
    const error = 'Password cannot be empty.';
    return res.status(409).send({ message: error });
}

const handleWeakPasswordError = (err, res) => {
    const error = `Password is not strong enough.`;
    return res.status(409).send({ message: error });
}

// ---------- EXERCISES ----------
const handleExerciseExistsError = (err, res) => {
    const error = 'That exercise already exists, check your list.';
    return res.status(409).send({ message: error });
};

const exerciseNotAddedMessage = (message) => {
    let words = message.split(" ");
    return (
        words[0] === "Exercise"
        && words[-3] === "was"
        && words[-2] === "not"
        && words[-1] === "added."
    );
}
