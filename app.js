var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var routes = require('./routes/index');
var session = require('express-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// 2 minutos
var timeOut = 2 * 60 * 1000;

// función de control del tiempo de session
var isTimeOutConnection = function (req) {
	var timeNow = new Date().getTime();
	console.log('Ultima conexion = ' + timeNow);
	if (!req.session.lastConnectionSession) {
		req.session.lastConnectionSession = timeNow;
	}
	var currentTime = timeNow - req.session.lastConnectionSession;
	console.log('Diferencia conexion = ' + currentTime);
	var isTimeOut = currentTime > timeOut;
	req.session.lastConnectionSession = timeNow;
	return isTimeOut;
	
};

// Helpers dinamicos:
app.use(function (req, res, next) {
	// guardar path en session.redir para después de login
	if (!req.path.match(/\/login|\/logout/)) {
		req.session.redir = req.path;
	}
	// Hacer visible req.session en las vistas
	res.locals.session = req.session;
	if (isTimeOutConnection(req) && req.session.user) {
		delete req.session.user;
		res.status(599);
        res.render('error', {
            message: 'Network connect timeout error',
            error: {},
            errors: []
        });
	}
	next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
