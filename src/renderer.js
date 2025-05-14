/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

const { ipcRenderer } = require('electron')

console.log('In renderer.js.');

$('#divBwActiveMenu').bwActiveMenu_Main({});
$('#divBwActiveMenu').bwActiveMenu_Main('renderAuthenticatedHomePage');




//// GOOD
//document.getElementById('ping-good').onclick = () => {
//    // Send a IPC async message to electron
//    // See main.js on line 31
//    ipcRenderer.send('ping-good', 'ping')
//    document.getElementById('ping-good-response').innerText = 'Waiting..'
//}

//// Receive reply from elecron
//// See file main.js on line 37
//ipcRenderer.on('ping-good-reply', (event, response) => {
//    document.getElementById('ping-good-response').innerText = response
//})

//// BAD
//document.getElementById('ping-bad').onclick = () => {
//    // Send a IPC sync message to electron
//    // See main.js on line 42
//    document.getElementById('ping-bad-response').innerText = ipcRenderer.sendSync('ping-bad', 'ping')
//}



















//console.log('xcx32544364564::contextBridge TEST::: ' + JSON.stringify(window.myAPI)); // https://stackoverflow.com/questions/32780726/how-to-access-dom-elements-in-electron




//const asyncMsgBtn = document.getElementById('async-msg')

//asyncMsgBtn.addEventListener('click', function () {
//    ipc.send('asynchronous-message', 'ping')
//})

//ipc.on('asynchronous-reply', function (event, arg) {
//    const message = `Asynchronous message reply: ${arg}`
//    document.getElementById('async-reply').innerHTML = message
//})