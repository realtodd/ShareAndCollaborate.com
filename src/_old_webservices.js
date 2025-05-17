
console.log('Starting webservices xcx998546.');


var fs = require('fs-extra');
const path = require('node:path');
var cors = require('cors');

var uris = JSON.parse(fs.readFileSync(path.join(__dirname, 'uris.json'))); // Read the operating port from uris.json file.

console.log('##########################');
console.log('uris: ' + JSON.stringify(uris));
console.log('##########################');


var express = require('express');
var router = express.Router();

var app = express();
//var routes = require('./start'); // path.join(__dirname, 'preload.js')
var routes = require(path.join(__dirname, 'webservices/routes/start'));
app.use('/', routes);


// Added 5-15-2025. CORS for our web services endpoint.
var url1 = uris.websiteUri.url + ':' + uris.websiteUri.port;
console.log('Webservices adding to allowed cors: ' + url1);

// You can also enable pre-flight across-the-board like so:
//app.options('*', cors({
//    origin: 'http://localhost:6161'
//})); // include before other routes, this enables pre-flight.

/** CORS setting with OPTIONS pre-flight handling */
//app.use(function (req, res, next) {
//    res.header('Access-Control-Allow-Origin', '*');
//    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTION');
//    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, accept, access-control-allow-origin');

//    if ('OPTIONS' == req.method) res.send(200);
//    else next();
//});

//
// SAME ISSUE: https://github.com/expressjs/cors/discussions/326
//

//app.use(cors({ origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS' }));
//app.options(/(.*)/, cors())
//app.options('*', cors()) // include before other routes // https://github.com/expressjs/express/issues/5936 Express 5.0.0 uses router 2.0.0, which uses path-to-regexp 8.0.0 and it brings some breaking changes to path handling.
//The error that you got is caused by using: or * in one of your paths, which is not followed by parameter name.In Express 5 the wildcard * means something different than in 4.x.In 4.x it would match anything, but in 5.0 it behaves like: and is a named parameter.



//app.use(cors({ origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS' }));

/** CORS setting with OPTIONS pre-flight handling */
//app.use(function (req, res, next) {
//    res.header('Access-Control-Allow-Origin', '*');
//    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
//    //res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, accept, access-control-allow-origin');

//    //if ('OPTIONS' == req.method) res.send(200);
//    //else next();
//});



// No 'Access-Control-Allow-Origin' header is present on the requested resource.

//const corsOptions = {
//    origin: 'http://localhost:6161', // Replace with your client's origin
//    methods: 'GET,POST,PUT,DELETE',
//    allowedHeaders: 'Content-Type,Authorization',
//    credentials: true, // Allow credentials
//};
////app.use(cors());
//app.options('*', cors(corsOptions)); // Enable preflight for all routes


//app_webservices.set('port', process.env.PORT || 3000);
//app_webservices.set('port', process.env.PORT || uris.webservicesUri.port); // Port read from uris.json file, above.
app.set('port', uris.webservicesUri.port); // Port read from uris.json file, above.
var server = app.listen(app.get('port'), function () {
    console.log('Web services listening on port ' + server.address().port);
});

var mongoose = require('mongoose');

// The main index.js can send messages and we get them this way. //https://www.electronjs.org/docs/latest/api/utility-process
process.parentPort.once('message', (e) => {
  console.log('In webservices.js.process.parentPort.once.message: ' + JSON.stringify(e));
  const [port] = e.ports
  // ...
});

// Send a message to the main process. In our case, this goes to main index.js.
process.parentPort.postMessage('HELLO from child webservices.js xcx43235435.'); 



try {


    //var config = { db: 'mongodb://bwmongo1:27017,bwmongo2:27017,bwnginx2:27017/shareandcollaboratecom?replicaSet=BWREPLSET1' };
    //var config = { db: 'mongodb://bwmongo1:27017,bwmongo2:27017,bwnginx2:27017/budgetnetca?replicaSet=BWREPLSET1' };
    var config = { db: 'mongodb://localhost:27017/shareandcollaboratelocal' };
    var dbOptions;

    if (config.db.indexOf('replicaSet') > -1) {
        dbOptions = {
            //native_parser: true,
            //auto_reconnect:false,
            //poolSize: 10,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            //useFindAndModify: true // This applies to using useFindAndModify... kind a quirk but it needs this setting to work Ok. Added 2-6-2023.

            family: 4 // Use IPv4
        };
    } else {

        // Running locally.
        dbOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 30000,
            socketTimeoutMS: 45000
        };


    }

    //mongoose.connection.on('error', function (err) {

    //    var msg = 'In mongoose.connection.on.error(): Error in start.js.mongoose.connect(' + config.db + ') from web services: ' + err + '. This may be because MongoDB is not started on 192.168.1.3. At a terminal window, "sudo systemctl start mongod". To check status, "sudo systemctl status mongod".';
    //    console.log(msg);

    //    //const from = "15194881754";
    //    //const to = "19023851968";
    //    //const text = msg; //'Web services started at BudgetWorkflow.com.';

    //    //vonage.message.sendSms(from, to, text, function (err, responseData) {
    //    //    if (err) {
    //    //        console.log(err);
    //    //    } else {
    //    //        if (responseData.messages[0]['status'] === "0") {
    //    //            console.log("Message sent successfully.");
    //    //        } else {
    //    //            console.log("SMS message failed with error: ${responseData.messages[0]['error-text']}: " + responseData.messages[0]['error-text']);
    //    //        }
    //    //    }
    //    //});

    //    //sendgrid.send({
    //    //    to: 'forestadministrator@budgetworkflow.com',
    //    //    from: 'webservices@budgetworkflow.com',
    //    //    subject: 'Error connecting to mongodb FROM WEB SERVICES', // 'Web services started at BudgetWorkflow.com.',
    //    //    html: msg //'Web services started at BudgetWorkflow.com.'
    //    //}, function (sgError, sgResponse) {
    //    //    if (sgError) {

    //    //    } else {

    //    //    }
    //    //});

    //});





    //mongoose.set('bufferCommands', false); // Added 2-14-2023. See also: https://medium.com/@akashrajum7/mongoose-will-not-throw-any-errors-by-default-if-you-use-a-model-without-connecting-heres-why-ee37890ec437
    console.log('');
    console.log('=================================');
    console.log('ATTEMPTING TO CONNECT TO MONGODB from webservices.js.');
    console.log('=================================');
    console.log('');

    mongoose.connect('mongodb://0.0.0.0:27017/shareandcollaboratelocal');

    //mongoDb.on('connected', function () {
    //    console.log('Mongoose connection open to db with options');
    //});

    //mongoDb.on('error', function (err) {
    //    console.error('Mongoose connection error: ' + err);
    //});


    //mongoose.connect(config.db, { useMongoClient: true });

    mongoose.connection.on('connected', function () {
        console.log('Mongoose connection open to db with options');
    });

    mongoose.connection.on('error', function (err) {
        console.error('Mongoose connection error: ' + err);
    });

    //mongoose.connect(config.db, dbOptions).then(function (err, db) {
    //    try {
    //        // https://github.com/Automattic/mongoose/issues/4135 for more information! Google "nodejs mongoose.connect error trap".

    //        if (err) {

    //            var msg = 'Error in start.js.mongoose.connect(' + config.db + ') from web services: ' + err + '. This may be because MongoDB is not started on 192.168.1.3. At a terminal window, "sudo systemctl start mongod". To check status, "sudo systemctl status mongod".';
    //            console.log(msg);

    //            //const from = "15194881754";
    //            //const to = "19023851968";
    //            //const text = msg; //'Web services started at BudgetWorkflow.com.';

    //            //vonage.message.sendSms(from, to, text, function (err, responseData) {
    //            //    if (err) {
    //            //        console.log(err);
    //            //    } else {
    //            //        if (responseData.messages[0]['status'] === "0") {
    //            //            console.log("Message sent successfully.");
    //            //        } else {
    //            //            console.log("SMS message failed with error: ${responseData.messages[0]['error-text']}: " + responseData.messages[0]['error-text']);
    //            //        }
    //            //    }
    //            //});

    //            //sendgrid.send({
    //            //    to: 'forestadministrator@budgetworkflow.com',
    //            //    from: 'webservices@budgetworkflow.com',
    //            //    subject: 'Error connecting to mongodb FROM WEB SERVICES', // 'Web services started at BudgetWorkflow.com.',
    //            //    html: msg //'Web services started at BudgetWorkflow.com.'
    //            //}, function (sgError, sgResponse) {
    //            //    if (sgError) {

    //            //    } else {

    //            //    }
    //            //});

    //        } else {



    //            //mongoose.connection.db.listCollections({name: 'shareandcollaboratecom'})
    //            //    .next(function(err, collinfo) {
    //            //        if (collinfo) {
    //            //            // The collection exists.
    //            //            console.log('');
    //            //            console.log('mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm');
    //            //            console.log('>>>>>>>>> The collection exists.');
    //            //            console.log('mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm');
    //            //            console.log('');
    //            //        }
    //            //    });




    //            //mongoose.connect('mongodb://localhost/test', function(err){
    //            //    var admin = new mongoose.mongo.Admin(mongoose.connection.db);
    //            //    admin.buildInfo(function (err, info) {
    //            //        console.log(info.version);
    //            //    });
    //            //});

    //            //var admin = new mongoose.mongo.Admin(mongoose.connection.db);
    //            //admin.buildInfo(function (err, info) {
    //            //    console.log('');
    //            //    console.log('Mongoose version: ' + info.version);
    //            //    console.log('');
    //            //});


    //            var msg = '';
    //            msg += '===============================================================\n';
    //            msg += 'In start.js. Connected to ' + config.db + ' successfully!\n';
    //            msg += '===============================================================';
    //            console.log(msg);

    //            //var threatLevel = 'low'; // severe, high, elevated, guarded, low.
    //            //var source = 'Webservices: start.js';
    //            //var errorCode = null;
    //            //WriteToErrorLog(threatLevel, source, errorCode, msg);



    //            //

    //            // By default, the timers will start automatically.
    //            //var result = bwworkflowdataservice1.startWorkflowTimer(); // Commented out 10-10-2020 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< FIGURE THIS OUT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 
    //            //console.log('Starting workflow timer(s):' + result.sixtySecondTimerStatus);
    //            //console.log('===============================================================');

    //            //sendgrid.bwSend({
    //            //    to: 'budgetworkflow@gmail.com',
    //            //    from: fromEmailAddress, //'Budget Requests ?? <info@budgetrequests.com>',
    //            //    subject: 'Connected to mongodb://192.168.0.7/budgetnetca successfully', //, and starting workflow timer(s): ' + result.sixtySecondTimerStatus,
    //            //    html: 'Connected to mongodb://192.168.0.7/budgetnetca successfully' //, and starting workflow timer(s): ' + result.sixtySecondTimerStatus
    //            //}, function (sgError, sgResponse) {


    //            //});



    //            //var tmpMsg = 'Web services started at BudgetWorkflow.com.';



    //            //try {
    //            //    const from = "15194881754";
    //            //    const to = "19023851968";
    //            //    const text = tmpMsg; //'Web services started at BudgetWorkflow.com.';

    //            //    vonage.message.sendSms(from, to, text, function (err, responseData) {
    //            //        try {
    //            //            var msg;

    //            //            if (err) {
    //            //                msg = 'xcx32432 SMS err: ' + err;
    //            //            } else {

    //            //                if (responseData.messages[0]['status'] === "0") {
    //            //                    msg = 'SMS message sent successfully.';
    //            //                } else {
    //            //                    msg = 'SMS message failed with error: ${responseData.messages[0]["error-text"]}: ' + responseData.messages[0]['error-text'];
    //            //                }

    //            //            }

    //            //            var threatLevel = 'elevated'; // severe, high, elevated, guarded, low.
    //            //            var source = 'Webservices: start.js';
    //            //            var errorCode = null;
    //            //            WriteToErrorLog(threatLevel, source, errorCode, msg);
    //            //        } catch(e) {

    //            //            var msg = 'Exception trying to send SMS:2: ' + e.message + ', ' + e.stack;

    //            //            var threatLevel = 'elevated'; // severe, high, elevated, guarded, low.
    //            //            var source = 'Webservices: start.js';
    //            //            var errorCode = null;
    //            //            WriteToErrorLog(threatLevel, source, errorCode, msg);

    //            //        }
    //            //    });
    //            //} catch(e) {

    //            //    var msg = 'Exception trying to send SMS: ' + e.message + ', ' + e.stack;

    //            //    var threatLevel = 'elevated'; // severe, high, elevated, guarded, low.
    //            //    var source = 'Webservices: start.js';
    //            //    var errorCode = null;
    //            //    WriteToErrorLog(threatLevel, source, errorCode, msg);

    //            //}


    //            //sendgrid.send({
    //            //    to: 'forestadministrator@budgetworkflow.com',
    //            //    from: 'webservices@budgetworkflow.com',
    //            //    subject: tmpMsg, // 'Web services started at BudgetWorkflow.com.',
    //            //    html: tmpMsg //'Web services started at BudgetWorkflow.com.'
    //            //}, function (sgError, sgResponse) {
    //            //    if (sgError) {

    //            //    } else {

    //            //    }
    //            //});

    //        }

    //    } catch (e) {

    //        var msg = 'xcx36648558-1. Exception in mongoose.connect(): in start.js.mongoose.connect(' + config.db + ') from web services. Possible remedies: At a terminal window, "sudo systemctl start mongod". THEN RESTART THE NGINX SERVER. WILL THIS SOLVE IT? WE ARE GETTING CLOSE. 7-3-2023. To check status, "sudo systemctl status mongod".' + e.message + ', ' + e.stack;
    //        console.log(msg);

    //        //const from = "15194881754";
    //        //const to = "19023851968";
    //        //const text = msg; //'Web services started at BudgetWorkflow.com.';

    //        //vonage.message.sendSms(from, to, text, function (err, responseData) {
    //        //    if (err) {
    //        //        console.log(err);
    //        //    } else {
    //        //        if (responseData.messages[0]['status'] === "0") {
    //        //            console.log("Message sent successfully.");
    //        //        } else {
    //        //            console.log("SMS message failed with error: ${responseData.messages[0]['error-text']}: " + responseData.messages[0]['error-text']);
    //        //        }
    //        //    }
    //        //});

    //        //sendgrid.send({
    //        //    to: 'forestadministrator@budgetworkflow.com',
    //        //    from: 'webservices@budgetworkflow.com',
    //        //    subject: 'Error connecting to mongodb FROM WEB SERVICES', // 'Web services started at BudgetWorkflow.com.',
    //        //    html: msg //'Web services started at BudgetWorkflow.com.'
    //        //}, function (sgError, sgResponse) {
    //        //    if (sgError) {

    //        //    } else {

    //        //    }
    //        //});

    //    }
    //}).catch(function (e) {
    //    var msg = 'xcx232144235425 Exception in x(): ' + JSON.stringify(e);
    //    console.log(msg);

    //});




    //mongoose.connect(config.db, dbOptions, function (err, db) {
    //    //var conn = mongoose.createConnection(config.db, dbOptions, function (err, db) {
    //    try {
    //        // https://github.com/Automattic/mongoose/issues/4135 for more information! Google "nodejs mongoose.connect error trap".

    //        if (err) {

    //            var msg = 'Error in start.js.mongoose.connect(' + config.db + ') from web services: ' + err + '. This may be because MongoDB is not started on 192.168.1.3. At a terminal window, "sudo systemctl start mongod". To check status, "sudo systemctl status mongod".';
    //            console.log(msg);

    //            //const from = "15194881754";
    //            //const to = "19023851968";
    //            //const text = msg; //'Web services started at BudgetWorkflow.com.';

    //            //vonage.message.sendSms(from, to, text, function (err, responseData) {
    //            //    if (err) {
    //            //        console.log(err);
    //            //    } else {
    //            //        if (responseData.messages[0]['status'] === "0") {
    //            //            console.log("Message sent successfully.");
    //            //        } else {
    //            //            console.log("SMS message failed with error: ${responseData.messages[0]['error-text']}: " + responseData.messages[0]['error-text']);
    //            //        }
    //            //    }
    //            //});

    //            //sendgrid.send({
    //            //    to: 'forestadministrator@budgetworkflow.com',
    //            //    from: 'webservices@budgetworkflow.com',
    //            //    subject: 'Error connecting to mongodb FROM WEB SERVICES', // 'Web services started at BudgetWorkflow.com.',
    //            //    html: msg //'Web services started at BudgetWorkflow.com.'
    //            //}, function (sgError, sgResponse) {
    //            //    if (sgError) {

    //            //    } else {

    //            //    }
    //            //});

    //        } else {



    //            //mongoose.connection.db.listCollections({name: 'shareandcollaboratecom'})
    //            //    .next(function(err, collinfo) {
    //            //        if (collinfo) {
    //            //            // The collection exists.
    //            //            console.log('');
    //            //            console.log('mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm');
    //            //            console.log('>>>>>>>>> The collection exists.');
    //            //            console.log('mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm');
    //            //            console.log('');
    //            //        }
    //            //    });




    //            //mongoose.connect('mongodb://localhost/test', function(err){
    //            //    var admin = new mongoose.mongo.Admin(mongoose.connection.db);
    //            //    admin.buildInfo(function (err, info) {
    //            //        console.log(info.version);
    //            //    });
    //            //});

    //            var admin = new mongoose.mongo.Admin(mongoose.connection.db);
    //            admin.buildInfo(function (err, info) {
    //                console.log('');
    //                console.log('Mongoose version: ' + info.version);
    //                console.log('');
    //            });


    //            var msg = '';
    //            msg += '===============================================================\n';
    //            msg += 'In start.js. Connected to ' + config.db + ' successfully!\n';
    //            msg += '===============================================================';

    //            console.log(msg);
    //            var threatLevel = 'low'; // severe, high, elevated, guarded, low.
    //            var source = 'Webservices: start.js';
    //            var errorCode = null;
    //            WriteToErrorLog(threatLevel, source, errorCode, msg);
    //            //

    //            // By default, the timers will start automatically.
    //            //var result = bwworkflowdataservice1.startWorkflowTimer(); // Commented out 10-10-2020 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< FIGURE THIS OUT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 
    //            //console.log('Starting workflow timer(s):' + result.sixtySecondTimerStatus);
    //            //console.log('===============================================================');

    //            //sendgrid.bwSend({
    //            //    to: 'budgetworkflow@gmail.com',
    //            //    from: fromEmailAddress, //'Budget Requests ?? <info@budgetrequests.com>',
    //            //    subject: 'Connected to mongodb://192.168.0.7/budgetnetca successfully', //, and starting workflow timer(s): ' + result.sixtySecondTimerStatus,
    //            //    html: 'Connected to mongodb://192.168.0.7/budgetnetca successfully' //, and starting workflow timer(s): ' + result.sixtySecondTimerStatus
    //            //}, function (sgError, sgResponse) {


    //            //});



    //            var tmpMsg = 'Web services started at BudgetWorkflow.com.';



    //            //try {
    //            //    const from = "15194881754";
    //            //    const to = "19023851968";
    //            //    const text = tmpMsg; //'Web services started at BudgetWorkflow.com.';

    //            //    vonage.message.sendSms(from, to, text, function (err, responseData) {
    //            //        try {
    //            //            var msg;

    //            //            if (err) {
    //            //                msg = 'xcx32432 SMS err: ' + err;
    //            //            } else {

    //            //                if (responseData.messages[0]['status'] === "0") {
    //            //                    msg = 'SMS message sent successfully.';
    //            //                } else {
    //            //                    msg = 'SMS message failed with error: ${responseData.messages[0]["error-text"]}: ' + responseData.messages[0]['error-text'];
    //            //                }

    //            //            }

    //            //            var threatLevel = 'elevated'; // severe, high, elevated, guarded, low.
    //            //            var source = 'Webservices: start.js';
    //            //            var errorCode = null;
    //            //            WriteToErrorLog(threatLevel, source, errorCode, msg);
    //            //        } catch(e) {

    //            //            var msg = 'Exception trying to send SMS:2: ' + e.message + ', ' + e.stack;

    //            //            var threatLevel = 'elevated'; // severe, high, elevated, guarded, low.
    //            //            var source = 'Webservices: start.js';
    //            //            var errorCode = null;
    //            //            WriteToErrorLog(threatLevel, source, errorCode, msg);

    //            //        }
    //            //    });
    //            //} catch(e) {

    //            //    var msg = 'Exception trying to send SMS: ' + e.message + ', ' + e.stack;

    //            //    var threatLevel = 'elevated'; // severe, high, elevated, guarded, low.
    //            //    var source = 'Webservices: start.js';
    //            //    var errorCode = null;
    //            //    WriteToErrorLog(threatLevel, source, errorCode, msg);

    //            //}


    //            //sendgrid.send({
    //            //    to: 'forestadministrator@budgetworkflow.com',
    //            //    from: 'webservices@budgetworkflow.com',
    //            //    subject: tmpMsg, // 'Web services started at BudgetWorkflow.com.',
    //            //    html: tmpMsg //'Web services started at BudgetWorkflow.com.'
    //            //}, function (sgError, sgResponse) {
    //            //    if (sgError) {

    //            //    } else {

    //            //    }
    //            //});

    //        }

    //    } catch (e) {

    //        var msg = 'xcx36648558-1. Exception in mongoose.connect(): in start.js.mongoose.connect(' + config.db + ') from web services. Possible remedies: At a terminal window, "sudo systemctl start mongod". THEN RESTART THE NGINX SERVER. WILL THIS SOLVE IT? WE ARE GETTING CLOSE. 7-3-2023. To check status, "sudo systemctl status mongod".' + e.message + ', ' + e.stack;
    //        console.log(msg);

    //        //const from = "15194881754";
    //        //const to = "19023851968";
    //        //const text = msg; //'Web services started at BudgetWorkflow.com.';

    //        //vonage.message.sendSms(from, to, text, function (err, responseData) {
    //        //    if (err) {
    //        //        console.log(err);
    //        //    } else {
    //        //        if (responseData.messages[0]['status'] === "0") {
    //        //            console.log("Message sent successfully.");
    //        //        } else {
    //        //            console.log("SMS message failed with error: ${responseData.messages[0]['error-text']}: " + responseData.messages[0]['error-text']);
    //        //        }
    //        //    }
    //        //});

    //        //sendgrid.send({
    //        //    to: 'forestadministrator@budgetworkflow.com',
    //        //    from: 'webservices@budgetworkflow.com',
    //        //    subject: 'Error connecting to mongodb FROM WEB SERVICES', // 'Web services started at BudgetWorkflow.com.',
    //        //    html: msg //'Web services started at BudgetWorkflow.com.'
    //        //}, function (sgError, sgResponse) {
    //        //    if (sgError) {

    //        //    } else {

    //        //    }
    //        //});

    //    }
    //});

} catch (e) {

    var msg = 'Exception calling mongoose.connect(): in start.js.mongoose.connect(' + config.db + ') from web services. Possible remedies: At a terminal window, "sudo systemctl start mongod". To check status, "sudo systemctl status mongod".' + e.message + ', ' + e.stack;
    console.log(msg);

    //const from = "15194881754";
    //const to = "19023851968";
    //const text = msg; //'Web services started at BudgetWorkflow.com.';

    //vonage.message.sendSms(from, to, text, function (err, responseData) {
    //    if (err) {
    //        console.log(err);
    //    } else {
    //        if (responseData.messages[0]['status'] === "0") {
    //            console.log("Message sent successfully.");
    //        } else {
    //            console.log("SMS message failed with error: ${responseData.messages[0]['error-text']}: " + responseData.messages[0]['error-text']);
    //        }
    //    }
    //});

    //sendgrid.send({
    //    to: 'forestadministrator@budgetworkflow.com',
    //    from: 'webservices@budgetworkflow.com',
    //    subject: 'Error connecting to mongodb FROM WEB SERVICES', // 'Web services started at BudgetWorkflow.com.',
    //    html: msg //'Web services started at BudgetWorkflow.com.'
    //}, function (sgError, sgResponse) {
    //    if (sgError) {

    //    } else {

    //    }
    //});

}


