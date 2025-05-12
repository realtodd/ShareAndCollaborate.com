const { app, BrowserWindow, utilityProcess, MessageChannelMain } = require('electron');
const path = require('node:path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

//
// THIS DOESN'T APPLY BUT LEAVING IT FOR NOW. communication between 2 browser windows in electron: https://stackoverflow.com/questions/40251411/communication-between-2-browser-windows-in-electron
//

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 960,
    height: 800,
    //titleBarStyle: 'hidden', 
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  //mainWindow.maximize();

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    require('electron').shell.openExternal(url);
    return { action: 'deny' };
  });

  // utilityProcess.fork: https://www.electronjs.org/docs/latest/api/utility-process

  const process_webservices = utilityProcess.fork(path.join(__dirname, 'webservices.js')); 
  process_webservices.on('message', (msg) => {
      console.log('Message from child', msg);
  });
  const { port1, port2 } = new MessageChannelMain();
  process_webservices.postMessage({ message: 'hello' }, [port1])

  process_webservices.on('message', function (message) {
      console.log('Message from Child process : ' + message);

      // This doesn't work: document.getElementById('divConsoleLogs').innerHTML = message; //append(message);


  });

  const process_fileservices = utilityProcess.fork(path.join(__dirname, 'fileservices.js')); 
  process_fileservices.on('message', (msg) => {
      console.log('Message from child', msg);
  });
  //const { port1, port2 } = new MessageChannelMain();
  //process_fileservices.postMessage({ message: 'hello' }, [port1])

  const process_website = utilityProcess.fork(path.join(__dirname, 'website.js')); 
  process_website.on('message', (msg) => {
      console.log('Message from child', msg);
  });
  //const { port1, port2 } = new MessageChannelMain();
  //process_website.postMessage({ message: 'hello' }, [port1])

  //const process_timerservices = utilityProcess.fork(path.join(__dirname, 'timerservices.js')); 
  //process_timerservices.on('message', (msg) => {
  //    console.log('Message from child', msg);
  //});
  //const { port1, port2 } = new MessageChannelMain();
  //process_timerservices.postMessage({ message: 'hello' }, [port1])

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
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