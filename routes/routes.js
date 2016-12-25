"use strict";
module.exports = function (express, app, passport,configs,rooms) {
    var router = express.Router();

    router.get('/', function (req, res, next) {
        res.render('index', {title: 'Realtime Chat'});
    });
    function securePages(req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.redirect('/');
        }

    }
    router.get('/auth/facebook', passport.authenticate('facebook'));

    router.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/chatRoom',
        failureRedirect: '/'
    }));
    router.get('/chatRoom', securePages, function (req, res, next) {
        res.render('chatrooms', {user: req.user,configs:configs});
    });

    router.get('/room/:roomNumber/:roomName', securePages, function (req, res, next) {
        res.render('room',{user: req.user,
            configs:configs,roomName:req.params.roomName,roomNumber:req.params.roomNumber});
    });

    app.get('/logout', function(req,res){
        req.logOut();
        res.redirect('/');
    });

    app.use('/', router);
}
