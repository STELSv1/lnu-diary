const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/microsoft', passport.authenticate('microsoft', { prompt: 'select_account' }));
router.get('/microsoft/callback', passport.authenticate('microsoft', {
    failureRedirect: '/login',
    successRedirect: '/dashboard'
}));


router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true 
}));

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/login');
    });
});


module.exports = router;