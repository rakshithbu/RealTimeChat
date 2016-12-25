'use strict';
var express, app, path, routes, cookieParser, session, configs, mongoose, MongoDBStore, passport, FacebookStrategy,rooms;
express = require('express');
app = express();
path = require('path');
cookieParser = require('cookie-parser');
session = require('express-session');
configs = require('./config/config.js');
routes = require('./routes/routes');
/*MongoDBStore = require('connect-mongodb-session')(session);*/
mongoose = require('mongoose');
mongoose.connect(configs.dbURL);
passport = require('passport');
FacebookStrategy = require('passport-facebook');
mongoose.Promise = global.Promise;
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
rooms = [];

var env = process.env.NODE_ENV || 'development';


/*var store = new MongoDBStore(
 {
 url: configs.dbURL,
 stringify: true
 });*/

if (env === 'development') {
    app.use(session({
        secret: configs.sessionSecret,
        resave: true,
        saveUninitialized: true
    }));
} else {
    app.use(session({
        secret: configs.sessionSecret,
        resave: true,
        saveUninitialized: true,
        store: store
    }));
}
app.use(passport.initialize());
app.use(passport.session());

require('./auth/passportAuth')(passport, FacebookStrategy, configs, mongoose);
routes(express, app, passport, configs,rooms);
app.set('port', process.env.PORT || 3000)
var server = require('http').createServer(app);
var io = require('socket.io')(server);
require('./socket/socket')(io,rooms);
server.listen(app.get('port'), () => {
    console.log(app.get('port'));
});