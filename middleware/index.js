function loggedOut(req, res, next){
    if(req.session && req.session.userId){
        return res.redirect('/profile');
    }
    return next();
}

function requiresLogin (req, res, next){
    if(req.session && req.session.userId){
        next();
    } else {
        var err = new Error('You must be logged in to view a profile.');
        err.status = 401;
        return next(err);
    }
    
}

module.exports.loggedOut = loggedOut;
module.exports.requiresLogin = requiresLogin;