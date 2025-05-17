const { app, BrowserWindow, utilityProcess, ipcMain, MessageChannelMain } = require('electron'); 
const path = require('node:path');
var fs = require('fs'); 

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

//
// THIS DOESN'T APPLY BUT LEAVING IT FOR NOW. communication between 2 browser windows in electron: https://stackoverflow.com/questions/40251411/communication-between-2-browser-windows-in-electron
//

// begin: Our inter-process methods.

// Receive async message from renderer
// See file renderer.js on line 3
var webservices_ping_good_event;
ipcMain.on('ping-good', event => {
    // It's so good because below have a delay 5s to execute, and this don't lock rendereder :)
    webservices_ping_good_event = event;
    setTimeout(() => {
        console.log('GOOD finshed!')
        // Send reply to a renderer
        event.sender.send('ping-good-reply', 'pong')
    }, 1000)
})


//retrieve-current-values
var webservices_retrieve_current_values;
ipcMain.on('retrieve-current-values', function(event) {
    // It's so good because below have a delay 5s to execute, and this don't lock rendereder :)
    //webservices_retrieve_current_values = event;
    setTimeout(() => {
        console.log('retrieve-current-values finshed!');


        var uris = JSON.parse(fs.readFileSync(path.join(__dirname, 'routes/uris.json'))); // Read the operating urls and ports from uris.json file.


        // Send reply to a renderer
        event.sender.send('retrieve-current-values-reply', uris);


    }, 1000)
})



// Receive sync message from renderer
// See file renderer.js on line 18
//ipcMain.on('ping-bad', event => {
//    // It's so bad because below have a delay 5s to execute, meanwhile the renderer stay locked :(
//    setTimeout(() => {
//        console.log('BAD finshed!')
//        event.returnValue = 'pong'
//    }, 1000)
//})

// end: Our inter-process methods.



const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 2000, //960,
        height: 800,
        //titleBarStyle: 'hidden', 
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true, // Allows use of require in renderer.js.
            contextIsolation: false, // Allows use of require in renderer.js.
        }
    });

    //mainWindow.maximize();

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    // Open the DevTools.
    //mainWindow.webContents.openDevTools(); // When this is running, it can cause an error "Request Autofill.enable failed."

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        require('electron').shell.openExternal(url);
        return { action: 'deny' };
    });

    var website = require('./routes/website');
    //app.use(compression());
    //app.set('views', path.join(__dirname, 'views'));
    //app.use(favicon(__dirname + '/public/favicon.ico'));
    //app.use(favicon(__dirname + '/public/apple-touch-ipad-retina.png'));
    //app.use(favicon(__dirname + '/public/apple-touch-ipad.png'));
    //app.use(favicon(__dirname + '/public/apple-touch-iphone.png'));
    //app.use(favicon(__dirname + '/public/apple-touch-iphone4.png'));
    //app.use(bodyParser.json());
    //app.use(bodyParser.urlencoded({ extended: false }));
    //var cacheTime = 86400000; // 1 day.
    //app.use(express.static(path.join(__dirname, 'public'), { maxAge: cacheTime }));
    //app.set('port', uris.websiteUri.port); // Port read from uris.json file, above.
    //var server = app.listen(app.get('port'), function () {
    //    console.log('WEBSITE::::Express server listening and serving content from the public folder on port ' + server.address().port + '. Yay!');
    //});
 




    //
    // THIS IS OUR ORIGINAL FORK CODE. KEEP FOR POSTERITY!!
    //

    //// utilityProcess.fork: https://www.electronjs.org/docs/latest/api/utility-process

    //const process_webservices = utilityProcess.fork(path.join(__dirname, 'webservices.js'));
    //process_webservices.on('message', (msg) => {
    //    console.log('Message from child [webservices.js]', msg);
    //});
    //const { port1, port2 } = new MessageChannelMain();
    //process_webservices.postMessage({ message: 'hello' }, [port1])

    //process_webservices.on('message', function (message) {
    //    console.log('Message from Child process : ' + message);

    //    // This doesn't work: document.getElementById('divConsoleLogs').innerHTML = message; //append(message);


    //});

    //const process_fileservices = utilityProcess.fork(path.join(__dirname, 'fileservices.js'));
    //process_fileservices.on('message', (msg) => {
    //    console.log('Message from child', msg);
    //});
    ////const { port1, port2 } = new MessageChannelMain();
    ////process_fileservices.postMessage({ message: 'hello' }, [port1])

    //const process_website = utilityProcess.fork(path.join(__dirname, 'website.js'));
    //process_website.on('message', (msg) => {
    //    console.log('Message from child', msg);
    //});

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

    //ipcMain.handle('dialog:openFile', openFile)

    createWindow();

    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.



// For Electron, we should not use child_process.

//const { fork } = require("child_process");

// Launch the WEB SERVICES process.
//const process_webservices = fork(path.join(__dirname, 'webservices.js')); 
//process_webservices.on('message', (msg) => {
//    console.log('Message from child', msg);
//});
//process_webservices.send('hello world');

// Launch the FILE SERVICES process.
//const process_fileservices = fork(path.join(__dirname, 'fileservices.js')); 
//process_fileservices.on('message', (msg) => {
    //console.log('Message from child', msg);
//});
//process_fileservices.send('hello world');

// Launch the WEBSITE process.
//const process_website = fork(path.join(__dirname, 'website.js'));
//process_website.on('message', (msg) => {
    //console.log('Message from child', msg);
//});
//process_website.send('hello world');

// Launch the TIMER SERVICES process.
//const process_timerservices = fork(path.join(__dirname, 'timerservices.js'));
//process_timerservices.on('message', (msg) => {
//    console.log('Message from child', msg);
//});
//process_timerservices.send('hello world');