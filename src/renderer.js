/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

console.log('In renderer.js.');

$('#divBwActiveMenu').bwActiveMenu_Main({});
$('#divBwActiveMenu').bwActiveMenu_Main('renderAuthenticatedHomePage');

console.log('xcx32544364564::contextBridge TEST::: ' + JSON.stringify(window.myAPI)); // https://stackoverflow.com/questions/32780726/how-to-access-dom-elements-in-electron