//var express = require('express'),
//    router = express.Router();

//var automatedRoutes = require('./routes/automated');

//router
//    // Add a binding to handle '/tests'
//    .get('/', function () {
//        // render the /tests view
//    })

//    // Import my automated routes into the path '/tests/automated'
//    // This works because we're already within the '/tests' route
//    // so we're simply appending more routes to the '/tests' endpoint
//    .use('/automated', automatedRoutes);

//module.exports = router;

////var automatedRoutes = require('./testRoutes/automated');

////router
////    // Add a binding to handle '/tests'
////    .get('/', function () {
////        // render the /tests view
////    })

////    // Import my automated routes into the path '/tests/automated'
////    // This works because we're already within the '/tests' route
////    // so we're simply appending more routes to the '/tests' endpoint
////    .use('/automated', automatedRoutes);

////module.exports = router;






//console.log('Starting website xcx998546.');


var express = require('express');





var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var compression = require('compression');

global.appRoot = path.resolve(__dirname);

console.log('Loaded website.js successfully');
//console.log('Getting ready to attach listener. If you get an error run as super user (sudo env "PATH=$PATH" node app.js)');

//var routes = require('./routes/start');
//var users = require('./routes/users');


//console.log('##########################');
//console.log('uris: ' + JSON.stringify(uris));
//console.log('##########################');


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



var webservices = require('./webservices');
var fileservices = require('./fileservices');

app.use(express.static(path.join(__dirname, 'public'), { maxAge: cacheTime }));
app.use('/', webservices);
app.use('/', fileservices);






//var router = express.Router();
//var webservices = require('./webservices');
//var fileservices = require('./fileservices');
//router.get('/', function () {
//    // render the /tests view
//}).use('/_bw', webservices);
//router.get('/', function () {
//    // render the /tests view
//}).use('/_files', fileservices);









const { networkInterfaces } = require('os');

const nets = networkInterfaces();
const ips = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
        const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
        if (net.family === familyV4Value && !net.internal) {
            if (!ips[name]) {
                ips[name] = [];
            }
            ips[name].push(net.address);
        }
    }
}

console.log('');
console.log('************************************************');
console.log('GET THESE IP ADDRESSES EXPOSED TO bwActiveMenu_Main.js, so that the links can be displayed..... xcx3436256.');
console.log('ips: ' + JSON.stringify(ips));
console.log('************************************************');
console.log('');







console.log('__dirname: ' + __dirname.toString());

var uris = JSON.parse(fs.readFileSync(path.join(__dirname, 'public/uris.json'))); // Read the operating port from uris.json file.
//var uris = JSON.parse(fs.readFileSync(path.join(__dirname, 'public/uris.json'))); // Read the operating port from uris.json file.

console.log('uris: ' + JSON.stringify(uris));

//app.set('port', process.env.PORT || 6060);
app.set('port', uris.websiteUri.port); // Port read from uris.json file, above.

var server = app.listen(app.get('port'), function () {
    console.log('Express server listening and serving content from the public folder on port ' + server.address().port + '.');
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
