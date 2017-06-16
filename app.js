var express = require('express');
var connect = require('connect');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var lusca = require('lusca');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var MemoryStore = require('session-memory-store')(session);
var helmet = require('helmet');
var csrf = require('csurf');

// init the app
var app = express();
app.use(helmet());

// setup csrf middleware
var csrfProtection = csrf({
  cookie: true
});

// lock down http headers
app.use(helmet.hidePoweredBy());
app.use(helmet.frameguard({
  action: 'sameorigin'
}));
//app.use(helmet.referrerPolicy({ policy: 'SAMEORIGIN' }));
app.use(helmet.noSniff());
app.use(helmet.xssFilter());
app.use(helmet.noCache());

// cookie parsing
app.use(cookieParser());

// set the view engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/public/site'));

// set options
app.disable('x-powered-by');

// this gives expressjs access to files in the site folder
app.use(express.static(__dirname + '/public/site', {
  index: 'piss'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// set security options
app.use(lusca({
  // csp: {
  //   policy: {
  //     'default-src': '\'unsafe-inline\'',
  //     'img-src': '\'self\'',
  //     'script-src': '\'self\' \'unsafe-inline\'',
  //     'style-src': '\'self\''
  //   }
  // },
  p3p: 'ABCDEF',
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

app.get('/', csrfProtection, function (req, res) {
  res.render('index', {
    csrfToken: req.csrfToken()
  });
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