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

// function publicProfileDisplay (req, res, next){
//     if(name == req.body.name){
//         next();
//     }
    
// }

module.exports.loggedOut = loggedOut;
module.exports.requiresLogin = requiresLogin;
// module.exports.publicProfileDisplay = publicProfileDisplay;