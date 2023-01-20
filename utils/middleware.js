const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.json({ redirect: '/login' });
    }
}

module.exports.isLoggedIn = isLoggedIn;