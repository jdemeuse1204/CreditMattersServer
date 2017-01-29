var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var lusca = require('lusca');

// init the app
var app = express();

// set the view engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// set options
app.use(express.static(__dirname + '/public')); 	
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// set security options
app.use(lusca({
    csrf: true,
    csp: { policy: { 'default-src': '\'self\'', 'img-src': '\'self\'' } },
    xframe: 'SAMEORIGIN',
    p3p: 'ABCDEF',
    hsts: {maxAge: 31536000, includeSubDomains: true, preload: true},
    xssProtection: true,
    nosniff: true
}));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '../public/index.html'));
})

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;