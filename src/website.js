
console.log('Starting website xcx998546.');


var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var compression = require('compression');

global.appRoot = path.resolve(__dirname);

console.log('STARTING UP');
console.log('Getting ready to attach listener. If you get an error run as super user (sudo env "PATH=$PATH" node app.js)');

//var routes = require('./routes/start');
//var users = require('./routes/users');

var uris = JSON.parse(fs.readFileSync(path.join(__dirname, 'uris.json'))); // Read the operating port from uris.json file.

console.log('##########################');
console.log('uris: ' + JSON.stringify(uris));
console.log('##########################');


var app = express();

app.use(compression());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(favicon(__dirname + '/public/apple-touch-ipad-retina.png'));
app.use(favicon(__dirname + '/public/apple-touch-ipad.png'));
app.use(favicon(__dirname + '/public/apple-touch-iphone.png'));
app.use(favicon(__dirname + '/public/apple-touch-iphone4.png'));

//var accessLogStream = fs.createWriteStream(__dirname + '/access.log', { flags: 'a' });
//app.use(logger('combined', { stream: accessLogStream })); // was dev
//app.use(logger('dev'));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

//app.use(cookieParser());
//app.use(require('stylus').middleware(path.join(__dirname, 'public')));

var cacheTime = 86400000; // 1 day.
app.use(express.static(path.join(__dirname, 'public'), { maxAge: cacheTime }));

//app.use('/', routes);
//app.use('/users', users);


//app.set('port', process.env.PORT || 6060);
app.set('port', uris.websiteUri.port); // Port read from uris.json file, above.

var server = app.listen(app.get('port'), function () {
    console.log('WEBSITE::::Express server listening and serving content from the public folder on port ' + server.address().port + '. Yay!');

    //console.log('WE NEED TO READ THE uris.json FILE HERE AND SOMEHOW MAKE IT AVAILABLE TO THE WEBSITE. THIS WILL ALLOW US TO DYNAMICALLY DETERMINE THE PORTS THAT WEBSERVICES AND FILESERVICES IS RUNNING ON.');




});


// catch 404 and forward to error handler
//app.use(function (req, res, next) {
//    var err = new Error('Not Found');
//    err.status = 404;
//    next(err);
//});

// error handlers
// development error handler
// will print stacktrace
//if (app.get('env') === 'development') {
//    app.use(function (err, req, res, next) {
//        res.status(err.status || 500);
//        res.render('error', {
//            message: err.message,
//            error: err
//        });
//    });
//}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
