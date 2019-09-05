module.exports = {
    ensureAuthenticated: (req,res,next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Not authorized, You have to login!!');
        res.redirect('/users/login');
    }
}