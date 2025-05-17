console.log('In serviceworker');

function showNotification(title, options) {

    console.log('In serviceworker1.js.showNotification().');


    var notification = new Notification(title); //, { vibrate: vibrate([200, 100, 200]) }); //, { body, icon });

    //Navigator.vibrate([200, 100, 200]);

}