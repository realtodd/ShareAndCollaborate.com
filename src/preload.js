// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('myAPI', { // https://stackoverflow.com/questions/32780726/how-to-access-dom-elements-in-electron
  desktop: true
})