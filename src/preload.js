// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

//
// Todd: preload uris.json. This is our settings which determine what url and port fileservices, webservices, and website run on.
//

// electron read a file in preload.js

//var fs = require('fs'); // THIS DOESNT WORK!!!!!!!!!!!!!!!!
//const path = require('node:path');
//var uris = JSON.parse(fs.readFileSync(path.join(__dirname, 'uris.json'))); // Read the operating urls and ports from uris.json file.

//const { ipcRenderer } = require('electron/renderer')

//contextBridge.exposeInMainWorld('electronAPI', { // https://stackoverflow.com/questions/32780726/how-to-access-dom-elements-in-electron
//    openFile: () => ipcRenderer.invoke('dialog:openFile')
//})