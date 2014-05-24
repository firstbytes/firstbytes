/**
 * Exports a simple object that wraps all the express app and other related
 * server goodies.
 *
 * var conf = {optional: conf};
 * var server = require('./server')(conf);
 * server.listen();
 */

var express = require('express'),
  http = require('http'),
  path = require('path'),
  db = require('./db.js').get(),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  favicon = require('serve-favicon');
  // passport = require('./auth/user-auth.js');

var routes = {
  main: require('../routes'),
  user: require('../routes/user'),
  project: require('../routes/project')
};

var ERR_MUST_AUTHENTICATE = 'You must authenticate';

var env = process.env.NODE_ENV || 'development';

// app setup
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.resolve(__dirname + '/../views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, '../public/favicon.ico')));
// app.use(express.logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser('2z9sS2c0ksx'));
app.use(session({secret: 'capital code horse pants', saveUninitialized: true, resave: true})); // todo hook in redis connect
// app.use(express.methodOverride());
// app.use(app.router);
app.use(express.static(path.resolve(__dirname + '/../public')));

// authentication middleware
// app.use(passport.initialize());
// app.use(passport.session());

if (env === 'production') {
  // todo load from config
  app.set('data.type', 'mongo');
  app.set('data.mongo', 'mongodb://localhost:27017/firstbytes');
}

if (env === 'development') {
  // app.use(express.errorHandler());
  // todo load from config
  app.set('data.type', 'mongo');
  app.set('data.mongo', 'mongodb://localhost:27017/firstbytes-dev');
}

if (env === 'testing') {
  // app.use(express.errorHandler());
  // todo load from config
  app.set('data.type', 'mongo');
  app.set('data.mongo', 'mongodb://localhost:27017/firstbytes-test');
}

// todo routes that require auth...
var errorIfNoAuth = function (req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.json(404, {'error': ERR_MUST_AUTHENTICATE});
};

var redirectIfNoAuth = function (req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/#login');
};

// page routes
app.get('/', routes.main.index);
app.get('/canvas/?', routes.main.canvas);
// app.get('/login/', routes.main.login);
// app.get('/setup/', routes.main.setup);

// json api routes
// app.get('/project/:id/', routes.project.get);
// app.post('/project/', routes.project.post);
// app.put('/project/:id/', routes.project.put);
// app.post('/project/:id/', routes.project.put); // overload
// app.delete('/project/:id/', routes.project.delete);

app.post('/project/', routes.project.create);
app.put('/project/:id/', routes.project.update);

app.post('/user/auth/', routes.user.auth);
app.post('/user/', routes.user.create);

app.get('/user/:id/projects/', routes.user.projects);
// app.get('/user/:id/projects/public/', routes.user.publicprojects);

// app.get('/user/:id/', routes.user.get);
// app.post('/user/', routes.user.post);
// app.put('/user/:id/', routes.user.put);
// app.post('/user/:id/', routes.user.put); // overload
// app.delete('/user/:id/', routes.user.delete);

var listening = false;
var listen = function() {
  if (listening) return;
  http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });
  listening = true;
};
var connected = false;
var connect = function() {
  if (connected === true) return;
  db.connect(app.get('data.mongo'));
  connected = true;
};
var disconnect = function() {
  db.disconnect();
  connected = false;
};

module.exports = function(conf) {
  // todo use conf to pass in env, other overrides, etc.
  if (conf && conf.autolisten === true) listen();
  return {
    app: app,
    db: db,
    listen: function() {
      connect();
      listen();
    },
    connect: function() {
      // connect data connections
      connect();
    },
    disconnect: function() {
      // disconnect data connections
      disconnect();
    }
  };
};
