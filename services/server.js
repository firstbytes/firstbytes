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
  connectredis = require('connect-redis'),
  favicon = require('serve-favicon');
  // passport = require('./auth/user-auth.js');

var routes = {
  main: require('../routes'),
  admin: require('../routes/admin'),
  user: require('../routes/user'),
  project: require('../routes/project'),
  lesson: require('../routes/lesson')
};

var ERR_MUST_AUTHENTICATE = 'You must authenticate';

var env = process.env.NODE_ENV || 'development';

// app setup
var app = express();

// configurations
// todo allow loading these all from an external config that is not required
// to be in version control
app.set('cookie.key', '2z9sS2c0ksx');
app.set('session.secret', 'capital code horse pants');

if (env === 'production') {
  app.set('data.store', 'mongo');
  app.set('data.mongo', 'mongodb://localhost:27017/firstbytes');
  app.set('data.redis', {host: '127.0.0.1', port: '9491', disableTTL: true});
}

if (env === 'development') {
  // app.use(express.errorHandler());
  app.set('data.store', 'mongo');
  app.set('data.mongo', 'mongodb://localhost:27017/firstbytes-dev');
  app.set('data.redis', {host: '127.0.0.1', port: '9491', disableTTL: true});
}

if (env === 'testing') {
  // app.use(express.errorHandler());
  app.set('data.store', 'mongo');
  app.set('data.mongo', 'mongodb://localhost:27017/firstbytes-test');
  app.set('data.redis', {host: '127.0.0.1', port: '9491', disableTTL: true});
}

var RedisStore = connectredis(session);
var redissession = new RedisStore(app.get('data.redis'));
redissession.client.on('error', function(err) {
  console.warn('Unable to connect to redis server.', err);
});

app.set('port', process.env.PORT || 3000);
app.set('views', path.resolve(__dirname + '/../views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, '../public/favicon.ico')));
// app.use(express.logger('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser(app.get('cookie.key')));
app.use(session({secret: app.get('session.secret'), saveUninitialized: true, resave: true, store: redissession}));

// app.use(express.methodOverride());
// app.use(app.router);
app.use(express.static(path.resolve(__dirname + '/../public')));

// authentication middleware
// app.use(passport.initialize());
// app.use(passport.session());

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
app.get('/stage/:id/', routes.main.stage);
// 5456a64a4821d40000c092c8
// app.get('/login/', routes.main.login);
// app.get('/setup/', routes.main.setup);

app.get('/admin/', routes.admin.index);

app.get('/project/:id/', routes.project.get);
app.put('/project/:id/', routes.project.update);
app.delete('/project/:id/', routes.project.delete);
app.post('/project/', routes.project.create);

// app.get('/project/:id/revisions/', routes.project.create);
app.post('/project/:id/revisions/', routes.project.saveRevision);

app.post('/user/auth/', routes.user.auth);
app.post('/user/', routes.user.create);
app.get('/user/:id/', routes.user.authFromToken);
app.get('/users/', routes.user.allStudents);
// app.put('/user/:id/', routes.user.?);

app.get('/user/:id/projects/', routes.user.projects);
// app.get('/user/:id/projects/public/', routes.user.publicprojects);

app.get('/lesson/:id/', routes.lesson.get);
app.get('/lessons/:category/', routes.lesson.getByCategory);

var listening = false, server;
var listen = function() {
  if (listening) return;
  server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });
  listening = true;
};
var connected = false;
var connect = function() {
  if (connected === true) return;
  // console.log('Connecting to data source...');
  db.connect(app.get('data.mongo'));
  connected = true;
  // console.log('Connected');
};
var disconnect = function() {
  db.disconnect();
  connected = false;
};
var shutdown = function() {
  if (!listening || !server) return;
  server.close();
  listening = false;
};
var disconnectRedis = function() {
  if (redissession) redissession.client.quit();
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
      disconnectRedis();
      disconnect();
    },
    shutdown: function() {
      // shutdown the server - stop listening
      shutdown();
    }
  };
};
