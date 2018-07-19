//If user is logged in displays profile instead of signup
function loggedOut(req, res, next){
    if(req.session && req.session.userId){
        return res.redirect('/profile');
    }
    return next();
}
//Function to check if user is logged in before performing certain actions
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