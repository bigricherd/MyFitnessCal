module.exports = (err, req, res, next) => {
    try {
        console.log('HIT ERROR MIDDLEWARE');
        console.log(err.name, err.message);
        if (err.code === '23505' && err.constraint === 'appuser_username_key') return err = handleUserExistsError(err, res);
        if (err.message === 'Username cannot be empty') return err = handleMissingUsernameError(err, res);
        if (err.message === 'Password cannot be empty') return err = handleMissingPasswordError(err, res);
        if (err.message === 'Password is not strong enough') return err = handleWeakPasswordError(err, res);
        return next(err);
    }
    catch (err) {
        return res
            .status(500)
            .send('An unknown error occurred.');
    }

}

const handleUserExistsError = (err, res) => {
    const error = 'Sorry, that username is taken.';
    return res.status(409).send({ message: error });
}

const handleMissingUsernameError = (err, res) => {
    const error = 'Username cannot be empty.';
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