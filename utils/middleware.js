const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        console.log('Please log in first');
        res.json({ redirect: '/login' });
    }
}

module.exports.isLoggedIn = isLoggedIn;