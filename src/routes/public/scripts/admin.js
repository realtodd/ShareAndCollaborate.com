'use strict';

var ajaxTimeout = 3000; //2000; //1500;

var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var appweburl2;
var appweburl;

var url1 = window.location.href.split('https://')[1];
var url2 = url1.split('/')[0];
//this.options.operationUriPrefix = 'https://' + url2 + '/';

var globalUrlPrefix = 'https://';

var globalUrl = url2; //'budgetworkflow.com';
var globalUrlForWebServices = url2; //'budgetworkflow.com';

var webserviceurl = globalUrlPrefix + globalUrlForWebServices + '/_bw';

var participantId;
var participantLogonType;
var participantLogonTypeUserId;
var participantFriendlyName;
var participantEmail;




// from my3.js 12-11-2021
var emailNotificationFrequency; // immediately, aggregatetwicedaily
var emailNotificationTypes; // allnotifications, onlymytasknotifications
var emailAggregatorTwiceDailyFirstTime;
var emailAggregatorTwiceDailySecondTime;
var emailAggregatorTwiceDailyTimezoneDisplayName;


var tipsDisplayOn; // 12-11-2021
var displayInvitationsOnHomePageDisplayOn;
var displayTaskDetailsBeforeRequests;


// added 11-8-2020 so we can gets the forms editor working
var newBudgetRequestManagerTitle = "Manager";
var BWMData = [];
// end

var invitationAlreadyAccepted = false; // This solves the problem when the invitation parameter is in the query string.

//var bwEnabledRequestTypes; // Provides the list of request types for the drop downs.


//var request = [RequestTypesResult.RequestTypes[rt].Abbreviation, RequestTypesResult.RequestTypes[rt].RequestType, RequestTypesResult.RequestTypes[rt].isActive, RequestTypesResult.RequestTypes[rt].bwRequestTypeId];
//bwEnabledRequestTypes.EnabledItems.push(request);

var bwEnabledRequestTypes = {
    'EnabledItems': [
        [
            'offlinerequest', 'offlinerequest', true, 'offlinerequest'
        ]
    ],
    'Details': {
        'BudgetRequests': {
            'Enabled': false,
            'Ordinal': 1,
            'Text': 'Budget Request',
            'PluralText': 'Budget Requests'
        },
        'CapitalPlanProjects': {
            'Enabled': false,
            'Ordinal': 2,
            'Text': 'Capital Plan Project',
            'PluralText': 'Capital Plan Projects'
        },
        'QuoteRequests': {
            'Enabled': false,
            'Ordinal': 3,
            'Text': 'Quote Request',
            'PluralText': 'Quote Requests'
        },
        'ReimbursementRequests': {
            'Enabled': false,
            'Ordinal': 4,
            'Text': 'Reimbursement Request',
            'PluralText': 'Reimbursement Requests'
        },
        'RecurringExpenses': {
            'Enabled': false,
            'Ordinal': 5,
            'Text': 'Recurring Expense',
            'PluralText': 'Recurring Expenses'
        },
        'WorkOrders': {
            'Enabled': false,
            'Ordinal': 6,
            'Text': 'Work Order',
            'PluralText': 'Work Orders'
        }
    }
};

$(document).ready(function () {
    try {
        $.ajaxSetup({
            cache: false
        });
        appweburl = globalUrlPrefix + globalUrlForWebServices;
        appweburl2 = globalUrlPrefix + globalUrl;




        // Added 9-6-2020


        var divBwAuthentication = document.getElementById('divBwAuthentication');
        if (!divBwAuthentication) {
            $(document.body).prepend('<div id="divBwAuthentication" style="display:none;"></div>');
        }
        $('#divBwAuthentication').bwAuthentication({ backendAdministrationLogin: true });

        // 9-4-2022
        var divBwKeypressAndMouseEventHandler = document.getElementById('divBwKeypressAndMouseEventHandler');
        if (!divBwKeypressAndMouseEventHandler) {
            $(document.body).prepend('<div id="divBwKeypressAndMouseEventHandler" style="display:none;"></div>');
        }
        $('#divBwKeypressAndMouseEventHandler').bwKeypressAndMouseEventHandler_ForAdmin({});



        ////debugger;
        //var isAuthenticationWidgetInstantiated;
        //try {
        //    var xx = $('#divBwAuthentication').bwAuthentication('options');
        //    isAuthenticationWidgetInstantiated = true;
        //} catch (e) {
        //    isAuthenticationWidgetInstantiated = false;
        //}
        //if (isAuthenticationWidgetInstantiated == true) {
        //    $('#divBwAuthentication').bwAuthentication('checkIfAuthenticatedAndProcessQuerystringParameters');
        //} else {
        //    var authenticationOptions = {
        //        backendAdministrationLogin: true
        //    };
        //    $("#divBwAuthentication").bwAuthentication(authenticationOptions);
        //}

        //debugger;

        //$.ajax({
        //    //url: webserviceurl + "/getdiskspace",
        //    url: "https://budgetworkflow.com/_files/getdiskspace",
        //    type: "GET",
        //    contentType: 'application/json',
        //    success: function (data) {
        //        alert(json.stringify(data));
        //    },
        //    error: function (data, errorCode, errorMessage) {
        //        alert('Error in admin.js.getdiskspace():' + errorCode + ', ' + errorMessage);
        //    }
        //});



        //initializeTheForm();

        //displayAlertDialog('start');
        //var strUrl = window.location.href;
        //var part1 = strUrl.split('http://')[1];
        //var part2 = part1.split('/')[0];
        //// detect if localhost. If it is, that means we're in dev.
        //if (part2.split(':')[0] == 'localhost') {
        //    appweburl = 'http://localhost';
        //    appweburl2 = 'http://localhost:2081';
        //} else {
        //    appweburl = 'http://' + part2;
        //    appweburl2 = 'http://' + part2;
        //}

        //window.fbAsyncInit = function () {
        //    FB.init({
        //        appId: '39139756228',
        //        cookie: true,  // enable cookies to allow the server to access
        //        // the session
        //        xfbml: true,  // parse social plugins on this page
        //        version: 'v2.2' // use version 2.2
        //    });

        //    // Now that we've initialized the JavaScript SDK, we call
        //    // FB.getLoginStatus().  This function gets the state of the
        //    // person visiting this page and can return one of three states to
        //    // the callback you provide.  They can be:
        //    //
        //    // 1. Logged into your app ('connected')
        //    // 2. Logged into Facebook, but not your app ('not_authorized')
        //    // 3. Not logged into Facebook and can't tell if they are logged into
        //    //    your app or not.
        //    //
        //    // These three cases are handled in the callback function.

        //    FB.getLoginStatus(function (response) {
        //        statusChangeCallback(response);
        //    });

        //};

        //// Load the SDK asynchronously
        //(function (d, s, id) {
        //    var js, fjs = d.getElementsByTagName(s)[0];
        //    if (d.getElementById(id)) return;
        //    js = d.createElement(s); js.id = id;
        //    js.src = "//connect.facebook.net/en_US/sdk.js";
        //    fjs.parentNode.insertBefore(js, fjs);
        //}(document, 'script', 'facebook-jssdk'));



    } catch (e) {
        console.log('Exception in admin.js.document.ready()', e.message + ', ' + e.stack);
        displayAlertDialog('Exception in admin.js.document.ready()', e.message + ', ' + e.stack);
    }
});




function carriagereturnpress(e, functioncall) {
    // This is used for the custom logon.
    var evt = e || window.event
    // "e" is the standard behavior (FF, Chrome, Safari, Opera),
    // while "window.event" (or "event") is IE's behavior
    if (evt.keyCode === 13) {
        // Do something
        //logonWith_BudgetWorkflow();
        eval(functioncall)(); // Call the specified method.
        // You can disable the form submission this way:
        //return false
    }
}


//function cmdFixEmail() {

//    $.ajax({
//        url: webserviceurl + "/fixemailaddress",
//        type: "GET",
//        contentType: 'application/json',
//        success: function (data) {
//            displayAlertDialog(json.stringify(data));
//        },
//        error: function (data, errorCode, errorMessage) {
//            displayAlertDialog('Error in admin.js.cmdFixEmail():' + errorCode + ', ' + errorMessage);
//        }
//    });
//}












function cmdRenderVisitorActivityReport() {

    try {
        $.ajax({
            url: webserviceurl + "/indexpagevisitorcount",
            type: "DELETE",
            contentType: 'application/json',
            success: function (data) {
                var seriesCollection = [];
                seriesCollection = new Array();
                //var seriesCollection2 = [];
                //seriesCollection2 = new Array();
                var uniqueDates = [];
                uniqueDates = new Array();
                var hitCounter = [];
                hitCounter = new Array();
                //var uniqueHitCounter = [];
                //uniqueHitCounter = new Array();
                for (var i = 0; i < data.length; i++) {
                    var tmpDate = data[i].bwWebsiteTrafficLogEntryCreatedTimestamp.split('T')[0];
                    var tmpMonth = tmpDate.split('-')[1];
                    var tmpDay = tmpDate.split('-')[2];
                    var tmpYear = tmpDate.split('-')[0];
                    var strDate = tmpMonth + '/' + tmpDay + '/' + tmpYear;
                    // Create the array for the hit counter
                    if (uniqueDates.indexOf(strDate) == -1) {
                        // It doesn't exist in the array, so add it!
                        uniqueDates.push(strDate);
                        hitCounter.push(1);
                        //uniqueHitCounter.push(1) // This initializes our unique hit counter, which we will fill below.
                    } else {
                        var dateIndex = uniqueDates.indexOf(strDate);
                        var currentHitCount = hitCounter[dateIndex];
                        hitCounter[dateIndex] = currentHitCount + 1;
                    }
                    // Create the array for the unique visitors.





                }
                // Now that we have the hit counts calculated, put this all into the seriesCollection.
                var valueString = '';
                for (var i = 0; i < uniqueDates.length; i++) {
                    seriesCollection.push([uniqueDates[i], hitCounter[i]]);
                }

                var s3 = [];
                s3.push(seriesCollection);

                // Todd: This works 10-18-17
                //
                //var plot1 = $.jqplot('divBwVisitorActivityReport', s3, {
                //    title: 'Visitor Activity Report (index page visits)',
                //    seriesDefaults: {
                //        linePattern: 'dotted',
                //        showMarker: false,
                //    },
                //    axes: {
                //        xaxis: {
                //            renderer: $.jqplot.DateAxisRenderer,
                //            //label: 'Datesx',
                //            //tickOptions: { formatString: '%B' } // eg: September
                //            //tickOptions: { formatString: '%B %#m %Y' } // eg: September 9
                //            tickOptions: { formatString: '%B %#d %Y' } // eg: September 9
                //        },
                //        yaxis: {
                //            //tickOptions: { prefix: '$' },
                //            pad: 1.3
                //        }
                //    },
                //    cursor: {
                //        show: true,
                //        zoom: true,
                //        showTooltip: true
                //    }
                //});

                var plot1 = $.jqplot('divBwVisitorActivityReport', s3, {
                    title: 'Visitor Activity Report (index page visits)<br />THIS HAS BEEN MOVED TO NGINX. FIX THIS!!!',
                    seriesDefaults: {
                        renderer: $.jqplot.BarRenderer,
                        pointLabels: { show: true }
                        //linePattern: 'dotted',
                        //showMarker: false,
                    },
                    axes: {
                        xaxis: {
                            renderer: $.jqplot.DateAxisRenderer,
                            //label: 'Datesx',
                            //tickOptions: { formatString: '%B' } // eg: September
                            //tickOptions: { formatString: '%B %#m %Y' } // eg: September 9
                            tickOptions: { formatString: '%B %#d %Y' } // eg: September 9
                        }//,
                        //yaxis: {
                        //    //tickOptions: { prefix: '$' },
                        //    pad: 1.3
                        //}
                    },
                    cursor: {
                        show: true,
                        zoom: true,
                        showTooltip: true
                    }
                });


            },
            error: function (data, errorCode, errorMessage) {
                displayAlertDialog('Error in admin.js.cmdRenderVisitorActivityReport():' + errorCode + ', ' + errorMessage);
            }
        });
    } catch (e) {
        displayAlertDialog('Error in cmdRenderVisitorActivityReport(): ' + e.message);
    }
}

function cmdRenderLogonActivityReport() {

    try {
        $.ajax({
            url: webserviceurl + "/logonactivityvisitorcount",
            type: "DELETE",
            contentType: 'application/json',
            success: function (data) {
                if (data.length == 0) {
                    // There is nothing coming back from the log, so just display a simple message.
                    var html = '';
                    html += 'There has been no logon activity.';
                    document.getElementById('divBwLogonActivityReport').innerHTML = html;
                } else {
                    document.getElementById('divBwLogonActivityReport').innerHTML = ''; // Empty the element in case it had something in it from the last time it was loaded.
                    var seriesCollection = [];
                    seriesCollection = new Array();
                    //var seriesCollection2 = [];
                    //seriesCollection2 = new Array();
                    var uniqueDates = [];
                    uniqueDates = new Array();
                    var hitCounter = [];
                    hitCounter = new Array();
                    //var uniqueHitCounter = [];
                    //uniqueHitCounter = new Array();
                    for (var i = 0; i < data.length; i++) {
                        var tmpDate = data[i].bwWebsiteTrafficLogEntryCreatedTimestamp.split('T')[0];
                        var tmpMonth = tmpDate.split('-')[1];
                        var tmpDay = tmpDate.split('-')[2];
                        var tmpYear = tmpDate.split('-')[0];
                        var strDate = tmpMonth + '/' + tmpDay + '/' + tmpYear;
                        // Create the array for the hit counter
                        if (uniqueDates.indexOf(strDate) == -1) {
                            // It doesn't exist in the array, so add it!
                            uniqueDates.push(strDate);
                            hitCounter.push(1);
                            //uniqueHitCounter.push(1) // This initializes our unique hit counter, which we will fill below.
                        } else {
                            var dateIndex = uniqueDates.indexOf(strDate);
                            var currentHitCount = hitCounter[dateIndex];
                            hitCounter[dateIndex] = currentHitCount + 1;
                        }
                        // Create the array for the unique visitors.





                    }
                    // Now that we have the hit counts calculated, put this all into the seriesCollection.
                    var valueString = '';
                    for (var i = 0; i < uniqueDates.length; i++) {
                        seriesCollection.push([uniqueDates[i], hitCounter[i]]);
                    }

                    var s3 = [];
                    s3.push(seriesCollection);

                    var plot1 = $.jqplot('divBwLogonActivityReport', s3, {
                        title: 'Logon Activity Report',
                        seriesDefaults: {
                            renderer: $.jqplot.BarRenderer, // Todd added 10-18-17, but has not been tested!!!!!
                            pointLabels: { show: true }
                            //linePattern: 'dotted',
                            //showMarker: false,
                        },
                        axes: {
                            xaxis: {
                                renderer: $.jqplot.DateAxisRenderer,
                                //label: 'Datesx',
                                //tickOptions: { formatString: '%B' } // eg: September
                                //tickOptions: { formatString: '%B %#m %Y' } // eg: September 9
                                tickOptions: { formatString: '%B %#d %Y' } // eg: September 9
                            },
                            yaxis: {
                                //tickOptions: { prefix: '$' },
                                pad: 1.3
                            }
                        },
                        cursor: {
                            show: true,
                            zoom: true,
                            showTooltip: true
                        }
                    });
                }
            },
            error: function (data, errorCode, errorMessage) {
                displayAlertDialog('Error in admin.js.cmdRenderLogonActivityReport():' + errorCode + ', ' + errorMessage);
            }
        });
    } catch (e) {
        displayAlertDialog('Error in cmdRenderLogonActivityReport(): ' + e.message);
    }
}


// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
        // Logged into your app and Facebook.
        testAPI();
    } else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not your app.
        document.getElementById('status').innerHTML = 'Please log into this app.';
    } else {
        // The person is not logged into Facebook, so we're not sure if
        // they are logged into this app or not.
        document.getElementById('status').innerHTML = 'Use your FaceBook Id to log in to your own Budget Request system.';
    }
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
}

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
function testAPI() {
    //displayAlertDialog('Welcome!  Fetching your information.... ');
    FB.api('/me', function (response) {
        fbFriendlyName = response.name;
        fbUserIdNumber = response.id;
        fbEmail = response.email;

        // The first thing we must do is to check how many tenants this user belongs to.
        //renderWelcomeScreenByCheckingHowManyTenantsThisUserBelongsTo();
    });
}


function cmdCreateDemo4User() {
    // Create the demo4 user so that the index page demo works properly.
    try {
        var _bwWorkflows = []; // There are none so far.
        var data = {
            "bwParticipantId": 'demo4userid',

            "tenantTitle": 'Tenant1',
            "workflowAppTitle": 'BudgetWorkflow1',
            "financialAreaTitle1": 'Miscellaneous (express setup)',
            "participantFriendlyName": 'Todd Hiltz',
            "participantEmail": 'todd_hiltz@hotmail.com',
            "appweburl": appweburl
        };
        $.ajax({
            url: webserviceurl + "/createdemouser",
            type: "PUT",
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (data) {
                // If the logon provider is microsoft, we have to save the email address.
                //if (participantLogonType == 'microsoft') {
                //    //var participantEmail = $('#txtEmailAddress').val();
                //    displayAlertDialog('Notify the user that we are sending an email to confirm the email address. Click Ok to continue once you have received the email.');
                //    renderWelcomeScreen();
                //} else {
                displayAlertDialog(data);
                //renderWelcomeScreen();
                //}
            },
            error: function (data, errorCode, errorMessage) {
                //window.waitDialog.close();
                //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
                displayAlertDialog('Error in my.js.cmdCreateANewTenant():1:' + errorCode + ', ' + errorMessage + ', ' + JSON.stringify(data));
            }
        });
    } catch (e) {
        displayAlertDialog('Error in my.js.cmdCreateANewTenant():2:' + e.message);
    }



}

function displayStatusOfFileServices() {
    var operationUri = globalUrlPrefix + globalUrlForWebServices + "/_files/getstatusoffileservices";
    $.ajax({
        url: operationUri,
        type: "GET",
        contentType: 'application/json',
        success: function (data) {
            var html = '';
            if (data == 'SUCCESS') {
                // Green.
                html += '<span style="color:#009933;">' + 'responding' + '</span>';
            } else {
                // Red.
                html += '<span style="color:#ff0000;">' + data + '</span>';
            }
            document.getElementById('spanAttachmentsServerStatus').innerHTML = html;
        },
        error: function (data, errorCode, errorMessage) {
            // Red.
            var html = '';
            html += '<span style="color:#ff0000;">' + errorMessage + '</span>';
            document.getElementById('spanAttachmentsServerStatus').innerHTML = html;
        }
    });
}

function cmdRefreshAdminPage() {
    alert('In cmdRefreshAdminPage().');
    //displayAlertDialog('xxx');
    //initializeTheForm();

    cmdDisplayWebsiteTrafficAudienceSize();
    cmdDisplayWebsiteTrafficNumberOfParticipants();
    cmdDisplayWebsiteTrafficNumberOfTenants();
    cmdDisplayWebsiteErrorThreats();
    //cmdDisplaySentEmails();
    //cmdGetStatusOfWorkflowTimer();
    cmdGetStatusOfImap();
    cmdDisplayNumberOfLicenses();
    displayStatusOfFileServices();

    displayServerTime();

    displayFileServerDiskSpace();

    cmdRenderVisitorActivityReport();
    cmdRenderLogonActivityReport();

    $('#txtBwExceptionLogDetails').empty();

}

function populateTheTenantToDeleteDropDown() {
    // List all of the Tenants in the drop down.
    try {
        console.log('In populateTheTenantToDeleteDropDown().');

        $.ajax({
            url: webserviceurl + "/bwtenantsfindall",
            type: "POST",
            contentType: 'application/json',
            success: function (data) {
                try {

                    var html = '';

                    html += '<select id="selectAdminTenantSelectListForDeleteDropDown">';
                    for (var i = 0; i < data.length; i++) {
                        html += '<option value="' + data[i].bwTenantId + '" >' + data[i].bwTenantOwnerFriendlyName + '(' + data[i].bwTenantOwnerEmail + ') - ' + data[i].bwTenantId + '</option>';
                    }
                    html += '</select>';

                    document.getElementById('spanAdminTenantSelectListForDeleteDropDown').innerHTML = html;

                } catch (e) {
                    console.log('Exception in admin2.js.populateTheTenantToDeleteDropDown():2: ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in admin2.js.populateTheTenantToDeleteDropDown():2: ' + e.message + ', ' + e.stack);
                }
            },
            error: function (data, errorCode, errorMessage) {
                console.log('Error in admin.js.populateTheTenantToDeleteDropDown():' + errorCode + ', ' + errorMessage);
                displayAlertDialog('Error in admin.js.populateTheTenantToDeleteDropDown():' + errorCode + ', ' + errorMessage);
            }
        });
    } catch (e) {
        console.log('Exception in admin2.js.populateTheTenantToDeleteDropDown(): ' + e.message + ', ' + e.stack);
        displayAlertDialog('Exception in admin2.js.populateTheTenantToDeleteDropDown(): ' + e.message + ', ' + e.stack);
    }
}

// 
function populateTheTenantToPermanentlyDeleteDropDown() {
    // List all of the Tenants in the drop down.
    try {
        console.log('In populateTheTenantToPermanentlyDeleteDropDown().');

        $.ajax({
            url: webserviceurl + "/bwtenantsfindallintrashbin",
            type: "POST",
            contentType: 'application/json',
            success: function (data) {
                try {

                    var html = '';

                    html += '<select id="selectAdminTenantSelectListForPermanentlyDeleteDropDown">';
                    for (var i = 0; i < data.length; i++) {
                        html += '<option value="' + data[i].bwTenantId + '" >' + data[i].bwTenantOwnerFriendlyName + '(' + data[i].bwTenantOwnerEmail + ') - ' + data[i].bwTenantId + '</option>';
                    }
                    html += '</select>';

                    document.getElementById('spanAdminTenantSelectListForPermanentlyDeleteDropDown').innerHTML = html;

                } catch (e) {
                    console.log('Exception in admin2.js.populateTheTenantToPermanentlyDeleteDropDown():2: ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in admin2.js.populateTheTenantToPermanentlyDeleteDropDown():2: ' + e.message + ', ' + e.stack);
                }
            },
            error: function (data, errorCode, errorMessage) {
                console.log('Error in admin.js.populateTheTenantToPermanentlyDeleteDropDown():' + errorCode + ', ' + errorMessage);
                displayAlertDialog('Error in admin.js.populateTheTenantToPermanentlyDeleteDropDown():' + errorCode + ', ' + errorMessage);
            }
        });
    } catch (e) {
        console.log('Exception in admin2.js.populateTheTenantToPermanentlyDeleteDropDown(): ' + e.message + ', ' + e.stack);
        displayAlertDialog('Exception in admin2.js.populateTheTenantToPermanentlyDeleteDropDown(): ' + e.message + ', ' + e.stack);
    }
}

function cmdAdminDeleteSelectedTenant() {
    // Delete the User and Tenant that has been selected in the drop down.
    try {
        console.log('In admin.js.cmdAdminDeleteSelectedTenant().');
        alert('In admin.js.cmdAdminDeleteSelectedTenant().');

        var e = document.getElementById('selectAdminTenantSelectListForDeleteDropDown');
        var bwTenantId = e.options[e.selectedIndex].value;
        //var bwTenantOwnerId = e.options[e.selectedIndex].text;
        var tenantOwnerFriendlyNameAndEmail = e.options[e.selectedIndex].text;
        var tenantOwnerEmail = tenantOwnerFriendlyNameAndEmail.split('(')[1].split(')')[0];

        var proceed = confirm('Delete User and Tenant owned by ' + tenantOwnerFriendlyNameAndEmail + ' (bwTenantId: ' + bwTenantId + ')\n\nThis action cannot be undone.\n\nClick the OK button to proceed...');
        if (proceed) {

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');
            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,
                bwTenantId: bwTenantId,
                //bwTenantOwnerId: bwTenantOwnerId
                tenantOwnerEmail: tenantOwnerEmail
            };
            var operationUri = webserviceurl + "/bwtenant/deletethistenant"; // This uses the TrashBin.
            $.ajax({
                url: operationUri,
                type: "POST",
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (result) {
                    try {
              
                        if (result.message == 'SUCCESS') {

                            populateTheTenantToDeleteDropDown(); // Refresh the drop down.
                            displayAlertDialog('The Tenant has been deleted: ' + JSON.stringify(result));

                        } else {
                            displayAlertDialog('The Tenant did not delete successfully: ' + JSON.stringify(result));
                        }

                    } catch (e) {
                        console.log('Exception in admin2.js.cmdAdminDeleteSelectedTenant():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in admin2.js.cmdAdminDeleteSelectedTenant():2: ' + e.message + ', ' + e.stack);

                    }
                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in admin.js.cmdAdminDeleteSelectedTenant(): ' + errorMessage);
                    displayAlertDialog('Error in admin.js.cmdAdminDeleteSelectedTenant(): ' + errorMessage);
                }
            });
        }
    } catch (e) {
        console.log('Exception in admin2.js.cmdAdminDeleteSelectedTenant(): ' + e.message + ', ' + e.stack);
        displayAlertDialog('Exception in admin2.js.cmdAdminDeleteSelectedTenant(): ' + e.message + ', ' + e.stack);
    }
}

function cmdAdminPermanentlyDeleteSelectedTenant() {
    // Delete the User and Tenant that has been selected in the drop down.
    try {
        console.log('In admin.js.cmdAdminPermanentlyDeleteSelectedTenant().');
        alert('In admin.js.cmdAdminPermanentlyDeleteSelectedTenant().');

        //var e = document.getElementById('spanAdminTenantSelectListForPermanentlyDeleteDropDown'); // selectAdminTenantSelectListForPermanentlyDeleteDropDown
        var e = document.getElementById('selectAdminTenantSelectListForPermanentlyDeleteDropDown'); // selectAdminTenantSelectListForPermanentlyDeleteDropDown
        var bwTenantId = e.options[e.selectedIndex].value;
        //var bwTenantOwnerId = e.options[e.selectedIndex].text;
        var tenantOwnerFriendlyNameAndEmail = e.options[e.selectedIndex].text;
        var bwTenantOwnerEmail = tenantOwnerFriendlyNameAndEmail.split('(')[1].split(')')[0];

        var proceed = confirm('PERMANENTLY Delete User and Tenant owned by ' + tenantOwnerFriendlyNameAndEmail + ' (bwTenantId: ' + bwTenantId + ')\n\nThis action cannot be undone.\n\nClick the OK button to proceed...');
        if (proceed) {

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                bwTenantId: bwTenantId,
                //bwTenantOwnerId: bwTenantOwnerId,
                bwTenantOwnerEmail: bwTenantOwnerEmail
            };
            var operationUri = webserviceurl + "/bwtenant/deregister"; // This uses the TrashBin.
            $.ajax({
                url: operationUri,
                type: "POST",
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (results) {
                    try {

                        if (results.status != 'SUCCESS') {

                            displayAlertDialog('The Tenant did not delete successfully: ' + JSON.stringify(results));
                            
                        } else {
                            
                            populateTheTenantToPermanentlyDeleteDropDown(); // Refresh the drop down.
                            displayAlertDialog('The Tenant has been deleted permanently/deregistered: ' + JSON.stringify(results));

                        }

                    } catch (e) {
                        console.log('Exception in admin2.js.cmdAdminPermanentlyDeleteSelectedTenant():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in admin2.js.cmdAdminPermanentlyDeleteSelectedTenant():2: ' + e.message + ', ' + e.stack);

                    }
                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in admin.js.cmdAdminPermanentlyDeleteSelectedTenant(): ' + errorMessage);
                    displayAlertDialog('Error in admin.js.cmdAdminPermanentlyDeleteSelectedTenant(): ' + errorMessage);
                }
            });
        }
    } catch (e) {
        console.log('Exception in admin2.js.cmdAdminPermanentlyDeleteSelectedTenant(): ' + e.message + ', ' + e.stack);
        displayAlertDialog('Exception in admin2.js.cmdAdminPermanentlyDeleteSelectedTenant(): ' + e.message + ', ' + e.stack);
    }
}

function cmdAdminFindOrphanedTasks() {
    try {
        //var proceed = confirm('This process will find orphaned tasks.\n\nClick the OK button to proceed...');
        //if (proceed) {
        var data = {};
        var operationUri = webserviceurl + "/findorphanedtasks";
        $.ajax({
            url: operationUri,
            type: "POST",
            timeout: ajaxTimeout,
            data: data,
            headers: {
                "Accept": "application/json; odata=verbose"
            },
            success: function (result) {
                debugger;
                if (result.message == 'SUCCESS') {
                    displayAlertDialog(JSON.stringify(result));
                } else {
                    displayAlertDialog(JSON.stringify(result));
                }
            },
            error: function (data, errorCode, errorMessage) {
                displayAlertDialog('Error in admin.js.cmdAdminDeleteSelectedTenant(): ' + errorMessage);
            }
        });
        //}
    } catch (e) {
        displayAlertDialog('Exception in admin.js.cmdAdminFindOrphanedTasks():2: ' + e.message + ', ' + e.stack);
    }
}



function hideWorkingOnItDialog() {
    try {
        $('#divWorkingOnItDialog').dialog('close');
    } catch (e) { }
}

function cmdCloseError() {
    $("#divAlertDialog").dialog('close');
}

function displayAlertDialog(errorMessage) {

    hideWorkingOnItDialog();

    try {
        WriteToErrorLog('displayAlertDialog()', errorMessage);
    } catch (e) {
        // alert('Error writing to error log in displayAlertDialog: ' + e.message);
    }

    // First we have to check if it is displayed already.
    var isDisplayed = false;
    //if ($("#dialog-divAlertDialog").hasClass("ui-dialog-content") && $("#dialog-divAlertDialog").dialog("isOpen")) {
    if ($("#divAlertDialog").hasClass("ui-dialog-content") && $("#divAlertDialog").dialog("isOpen")) {
        // This first checks that the dialog has been initialized, then it checks if it is open.
        isDisplayed = true;
    }

    if (isDisplayed == false) { // NOTE: This blocks the next alert from showing.
        // First we have to show the logon dialog box.
        $("#divAlertDialog").dialog({
            modal: true,
            resizable: false,
            //closeText: "Cancel",
            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
            title: 'Alert',
            width: "720",
            dialogClass: "no-close", // No close button in the upper right corner.
            hide: false,//, // This means when hiding just disappear with no effects.
            //buttons: {
            //    "Close": function () {
            //        $(this).dialog("close");
            //    }
            //}
            open: function (event, ui) { $('.ui-widget-overlay').bind('click', function () { $("#divAlertDialog").dialog('close'); }); } // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.
        });
        $("#divAlertDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
        try {
            if (errorMessage.toString().toUpperCase().indexOf("SERVICE UNAVAILABLE") > -1) {
                var html = '';
                html += 'We apologize! It looks like our servers are unavailable at the moment.';
                document.getElementById('spanErrorMessage').innerHTML = html;

                // We are hiding this when the renderAlerts() successfully repaint the screen...this means communication has been re-established.
                connectionTimerObject = setInterval('checkConnectionAndRemoveAlertDialog()', 6000);
            } else {
                document.getElementById('spanErrorMessage').innerHTML = errorMessage;
            }
        } catch (e) {
            displayAlertDialog(e.message);
        }
    }
}
function displayAlertDialog_Persistent(errorMessage) {
    try {
        console.log('In my3.js.displayAlertDialog_Persistent().');

        if (errorMessage) { // Don't do anything if there is no message.

            try {
                //debugger;
                WriteToErrorLog('displayAlertDialog_Persistent()', errorMessage);
            } catch (e) {
                // alert('Error writing to error log in displayAlertDialog: ' + e.message);
            }

            var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            var dialogId = 'divAlertDialog_' + guid;

            var div = document.getElementById(dialogId);
            if (!div) {

                div = document.createElement('div');
                div.id = dialogId;
                div.style.display = 'none';
                document.body.appendChild(div); // Place at end of document

                var html = '';

                html += '        <table style="width:100%;">';
                html += '            <tr>';
                html += '                <td style="width:90%;">';
                html += '                    <span id="spanErrorMessage_' + dialogId + '"></span>';
                html += '                </td>';
                html += '            </tr>';
                html += '        </table>';
                html += '        <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and zooming in on the iPhone. -->';
                html += '        <br /><br />';

                div.innerHTML = html;
            }

            var date = new Date();

            $('#' + dialogId).dialog({
                modal: false,
                resizable: false,
                //closeText: "Cancel",
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                title: 'In displayAlertDialog_Persistent(). ' + date.toISOString(),
                width: "720",
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false,//, // This means when hiding just disappear with no effects.
                buttons: {
                    "Close": function () {
                        $(this).dialog("close");
                    }
                },
                open: function (event, ui) {
                    $('.ui-widget-overlay').bind('click', function () { $("#divAlertDialog").dialog('close'); });
                }, // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.
                close: function (event, ui) {
                    console.log('In admin.js.displayAlertDialog_Persistent(). THIS DIALOG DOES NOT CLEAN UP AFTER ITSELF. THIS WILL HAVE TO BE DONE SOMEDAY. <<<<<<<<<<<<<<<<<<<<<<<<<<');
                }
            });
            //$("#divAlertDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            document.getElementById('spanErrorMessage_' + dialogId).innerHTML = errorMessage;

        }

    } catch (e) {
        console.log('In displayAlertDialog_Persistent xcx3423542345-1. ' + e.message + ', ' + e.stack);
        displayAlertDialog('In displayAlertDialog_Persistent xcx3423542345-1. ' + e.message + ', ' + e.stack);
    }
}
function displayAlertDialog_QuickNotice(errorMessage) {
    try {
        // This method shows a quick notice, only on the screen for a few seconds. This is used for things like "Your request has been published.". 1-13-2023
        console.log('In my3.js.displayAlertDialog_QuickNotice().');

        if (errorMessage) { // Don't do anything if there is no message.

            try {
                //debugger;
                WriteToErrorLog('displayAlertDialog_QuickNotice()', errorMessage);
            } catch (e) {
                // alert('Error writing to error log in displayAlertDialog: ' + e.message);
            }

            $("#divAlertDialog_QuickNotice").dialog({
                modal: true,
                resizable: false,
                //closeText: "Cancel",
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                title: 'Alert',
                width: "720",
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false,//, // This means when hiding just disappear with no effects.
                //buttons: {
                //    "Close": function () {
                //        $(this).dialog("close");
                //    }
                //}
                open: function (event, ui) { $('.ui-widget-overlay').bind('click', function () { $("#divAlertDialog").dialog('close'); }); } // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.
            });
            $("#divAlertDialog_QuickNotice").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            document.getElementById('spanErrorMessage_QuickNotice').innerHTML = errorMessage;

            //displayAlertDialog(msg, true);
            setTimeout(function () {
                cmdClose_divAlertDialog_QuickNotice();
            }, 1500);

        }

    } catch (e) {
        console.log('In displayAlertDialog_QuickNotice. ' + e.message + ', ' + e.stack);
        displayAlertDialog('In displayAlertDialog_QuickNotice. ' + e.message + ', ' + e.stack);
    }
}

function cmdAdminLogon() {
    try {
        //debugger;
        //displayAlertDialog('webserviceurl: ' + webserviceurl);



        var userPassword = $('#txtEarlyAdopterCode').val();
        // Ok, lets see if the password is correct.
        var data = [];
        data = {
            //userEmailAddress: userEmailAddress,
            userPassword: userPassword
        };
        //debugger;
        var operationUri = webserviceurl + "/bwworkflow/adminlogon"; //usercustomlogon";
        $.ajax({
            url: operationUri,
            type: "POST", timeout: ajaxTimeout,
            data: data,
            headers: {
                "Accept": "application/json; odata=verbose"
            },
            success: function (data) {
                // The user entered an incorrect password.
                //debugger;
                if (data.message != 'The password is correct') {
                    displayAlertDialog(data.message);
                } else {
                    // The user entered the correct password.
                    $('#divBody').show();
                    $("#adminLogonDialog").dialog('close'); // Close the sign in dialog.

                    cmdRenderVisitorActivityReport();
                    cmdRenderLogonActivityReport();




                }
            },
            error: function (data, errorCode, errorMessage) {
                displayAlertDialog('Error in admin.js.cmdAdminLogon(): ' + errorMessage);
            }
        });
    } catch (e) {
        displayAlertDialog('Error in admin.js.cmdAdminLogon():2:. Message: ' + e.message + ' Description: ' + e.description);
    }
}

function renderWelcomeScreen_BackendAdministration() {
    try {
        console.log('In admin.js.renderWelcomeScreen_BackendAdministration().');
        //alert('In admin.js.renderWelcomeScreen_BackendAdministration().');
        //try {
        //    document.getElementById('spanNotLoggedInBetaBanner').style.display = 'none';
        //    document.getElementById('spanLoggedInBetaBanner').style.display = 'block';
        //} catch (e) { }

        //document.getElementById('divAdminLoginScreen').style.display = 'none';
        //document.getElementById('divBody').style.display = 'inline'; // 

        //// WHY DO WE DO THIS HERE??? IT SHOULD HAVE HAPPENED ALREADY 8-6-2020
        //webserviceurl = globalUrlPrefix + globalUrlForWebServices + '/_bw';
        //appweburl = globalUrlPrefix + globalUrlForWebServices;
        //appweburl2 = globalUrlPrefix + globalUrl;

        //initializeTheForm();



        $('#divBwActiveMenu').bwActiveMenu_Admin('renderAuthenticatedHomePage');







        var html = '';

        html += '<table style="width:100%;">';
        html += '    <tr>';
        html += '         <td>';
        html += '             <span style="font-size:xx-large;color:darkgray;">Index page visits:</span>&nbsp;<span id="spanAudienceSize" style="font-size:xx-large;font-weight:bold;color:black;"></span>';
        html += '         </td>';
        html += '         <td>';
        html += '             &nbsp;&nbsp;&nbsp;&nbsp;';
        html += '             <span style="font-size:xx-large;color:darkgray;">Unique ips:</span>&nbsp;<span id="spanAudienceSizeUniqueIps" style="font-size:xx-large;font-weight:bold;color:black;"></span>';
        html += '         </td>';
        html += '         <td style="width:30%;text-align:right;">';
        html += '             <button class="BwButton350" style="width:100px;" onclick="cmdRefreshAdminPage();">Refresh</button>';
        html += '         </td>';
        html += '     </tr>';
        html += ' </table>';

        html += '<br /><br />';
        html += '<span style="font-size:xx-large;color:darkgray;">Participants:</span>&nbsp;<span id="spanNumberOfParticipants" style="font-size:xx-large;font-weight:bold;color:black;"></span>';
        html += ' &nbsp;&nbsp;&nbsp;&nbsp;';
        html += ' <span style="font-size:xx-large;color:darkgray;">Tenants:</span>&nbsp;<span id="spanNumberOfTenants" style="font-size:xx-large;font-weight:bold;color:black;"></span>';

        html += '&nbsp;&nbsp;&nbsp;&nbsp;';
        html += ' <span style="font-size:xx-large;color:darkgray;">Licenses sold:</span>&nbsp;<span id="spanNumberOfLicensesSold" style="font-size:xx-large;font-weight:bold;color:black;"></span><< This is from unpaid stripe at the moment, dev: needs work.';

        html += ' <br /><br />';



        html += '<span style="font-size:xx-large;color:darkgray;">Email monitoring(imap):</span>&nbsp;<span id="spanImapStatus" style="font-size:xx-large;font-weight:bold;color:#009933;border:5px solid orange;border-radius:30px 30px 30px 30px;padding:0 10px 0 10px;background-color:white;"></span><!--&nbsp;&nbsp;&nbsp;&nbsp;<button class="BwButton350" style="width:100px;" onclick="cmdKickImap();">Kick!</button>-->';

        html += '<br /><br />';
        html += ' <span style="font-size:xx-large;color:darkgray;">File Services: </span>&nbsp;<span id="spanAttachmentsServerStatus" style="font-size:xx-large;font-weight:bold;color:#009933;border:5px solid orange;border-radius:30px 30px 30px 30px;padding:0 10px 0 10px;"></span>';
        html += ' &nbsp;&nbsp;&nbsp;&nbsp;';
        html += '<span style="font-size:xx-large;color:darkgray;">File server space remaining: </span>&nbsp;<span id="spanFileServerDiskSpace" style="font-size:xx-large;font-weight:bold;color:#009933;"></span>';
        html += ' &nbsp;&nbsp;&nbsp;&nbsp;';
        html += ' <span style="font-size:xx-large;color:darkgray;">WS Server time: </span>&nbsp;<span id="spanServerTime" style="font-size:xx-large;font-weight:bold;color:#009933;">xcx23424</span>';
        html += ' <br /><br />';

        html += '<div id="divBwTimerServicesManager"></div>';

        html += '<div id="divBwMonitoringTools2"></div>';

        html += '<div id="divBwBackendAdministrationForAllParticipants"></div>';

        html += '<div id="divBwEmailMonitor_Admin"></div>'; 

        $('#divPageContent1').html(html);

        var $bwBackendAdministrationForAllParticipants = $('#divBwBackendAdministrationForAllParticipants').bwBackendAdministrationForAllParticipants({ displayOnCreation: false });



        //alert('Calling initializeTheForm2(). xcx23423523');
        initializeTheForm2();




















    } catch (e) {
        debugger;
        console.log('Exception in admin.js.renderWelcomeScreen_BackendAdministration():6:' + e.message + ', ' + e.stack);
        displayAlertDialog('Exception in admin.js.renderWelcomeScreen_BackendAdministration():6:' + e.message + ', ' + e.stack);
    }
}


function renderLeftButtons(leftButtonSectionDiv) {
    try {
        console.log('In admin.js.renderLeftButtons().');
        //alert('In admin.js.renderLeftButtons().');

        var role;
        try {
            var selectedValue = $('#selectHomePageWorkflowAppDropDown option:selected').val();
            role = selectedValue.split('|')[1];
        } catch (e) {
            // If we made it here, (because there is not drop down workflow selector on the home page) there must only be 1 workflow app, which this user is the owner of.
            role = 'owner'; // Todd: We need to look at this again!
        }



        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

        
        //
        // Commented out the following image lookup because we don't display a top-left org image circle for the backend administration. 5-7-2023.
        //

        //// Try to get a custom image. If none found, use the OOB one.
        //var imageVersionGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        //    return v.toString(16);
        //});
        //var imagePath = globalUrlPrefix + globalUrl + '/_files/' + workflowAppId + '/orgimages/' + 'root' + '/' + 'orgimage.png?v=' + imageVersionGuid; // thiz.options.store.OrgId

        //var lookForOrgImage = function (imagePath) {
        //    return new Promise(function (resolve, reject) {
        //        $.get(imagePath).done(function () {
        //            //debugger;
        //            var img = new Image();
        //            img.src = imagePath;
        //            img.onload = function (e) {
        //                try {
        //                    //document.getElementById('orgImage_' + identityJson.bwOrgId).src = imagePath; // This is the business model editor org treeview image.
        //                    //debugger;


        //                    //if (identityJson.bwOrgId == 'root') {
        //                    //document.getElementById("orgImage_root_blueheaderbar1").src = imagePath;
        //                    //document.getElementById("orgImage_root_blueheaderbar2").src = imagePath;
        //                    //document.getElementById("orgImage_root_blueheaderbar3").src = imagePath;
        //                    //document.getElementById("orgImage_root_blueheaderbar4").src = imagePath;
        //                    //document.getElementById("orgImage_root_blueheaderbar5").src = imagePath;
        //                    //document.getElementById("orgImage_root_blueheaderbar6").src = imagePath;
        //                    //}

        //                    // This automaticagically populates the image at the top left of the top blue bar. 8-20-2020
        //                    try {
        //                        for (var i = 1; i < 20; i++) {
        //                            document.getElementById('orgImage_root_blueheaderbar' + i).src = imagePath;
        //                        }
        //                    } catch (e) {
        //                        // Do nothing, no more images to populate. 
        //                    }


        //                    //$('.bwCircleDialog').bwCircleDialog('displayOrgRoleEditorInACircle', true, identityJson.bwOrgId);


        //                    //var html = '';
        //                    //html += '<img id="orgImage2_' + '' + '" style="width:30px;height:30px;vertical-align:middle;" src="' + imagePath + '" />';
        //                    ////This element might not exist!
        //                    //var parentElementId;
        //                    //try {
        //                    //    parentElementId = $(thiz.options.requestForm).closest('.ui-dialog-content')[0].id; // If it is in a dialog, this returns the dialog id.
        //                    //} catch (e) { }
        //                    //if (!parentElementId) {
        //                    //    // It is not in a dialog, so it must be a new request.
        //                    //    parentElementId = 'divCreateRequestFormContent';
        //                    //}
        //                    //try {
        //                    //    //debugger;
        //                    //    //document.getElementById(orgsImageFetchingInformation[i].spanOrgId).innerHTML = html; //imagePath;
        //                    //    $('#' + parentElementId).find('#' + orgsImageFetchingInformation[i].spanOrgId)[0].innerHTML = html; //imagePath;
        //                    //    resolve();
        //                    //} catch (e) {
        //                    //    // ACTUALLY WE SHOUDL BE LOADING THE ELEMENT HERE MAYBE? IT USED TO WORK! 2-5-2020
        //                    //    //document.getElementById(orgsImageFetchingInformation[i].imageId).src = imagePath;
        //                    //    $('#' + parentElementId).find('#' + orgsImageFetchingInformation[i].imageId)[0].src = imagePath;
        //                    //    //console.log('Exception in bwOrganizationEditor.js.renderOrgRolesEditor(): span tag with id="' + orgsImageFetchingInformation[i].spanOrgId + '" does not exist! ' + e.message + ', ' + e.stack);
        //                    //    resolve();
        //                    //}

        //                } catch (e) {
        //                    console.log('Exception in renderLeftButtons().img.onload(): ' + e.message + ', ' + e.stack);
        //                    //alert('Exception in xx().img.onload(): ' + e.message + ', ' + e.stack);
        //                    reject();
        //                }
        //            }
        //        }).fail(function () {
        //            // do nothing, it just didn't find an image.
        //            resolve();
        //        });
        //    });
        //}
        //lookForOrgImage(imagePath);

       

        var html = '';
        html += '';
        html += '<table style="width:100%;padding:0 0 0 0;margin:0 0 0 0;">';
        if (role == 'owner') {
            html += '<tr>';
            html += '<td style="padding:0 0 0 10px;margin:0 0 0 0;">';
            html += '<div id="' + leftButtonSectionDiv + 'WelcomeButton" class="divLeftButton" onclick="populateStartPageItem(\'divWelcome\', \'Reports\', \'\');">Home</div>';
            html += '</td>';
            html += '</tr>';
            html += '<tr><td></td></tr>';
            html += '<tr>';
            html += '<td style="padding:0 0 0 10px;margin:0 0 0 0;border-width:0 0 0 0;">';
            //html += '<div id="' + leftButtonSectionDiv + 'NewRequestButton" class="divLeftButton" onclick="populateStartPageItem(\'divNewRequest\', \'Reports\', \'\');">New Request</div>';
            html += '<div id="' + leftButtonSectionDiv + 'NewRequestButton" class="divLeftButton" onclick="$(\'.bwRequest\').bwRequest(\'displayCreateRequestForm\', \'budgetrequest\');">New Request</div>';
            html += '</td>';
            html += '</tr>';
            html += '<tr><td></td></tr>';
            html += '<tr>';
            html += '<td style="padding:0 0 0 10px;margin:0 0 0 0;border-width:0 0 0 0;">';
            //html += '<div id="' + leftButtonSectionDiv + 'ArchiveButton" class="divLeftButton" onclick="populateStartPageItem(\'divArchivex1\', \'Reports\', \'\');">Archive</div>';
            html += '<div id="' + leftButtonSectionDiv + 'ArchiveButton" class="divLeftButton" onclick="renderArchive();">All Requests</div>';
            html += '</td>';
            html += '</tr>';
            //html += '<tr><td></td></tr>';
            //html += '<tr>';
            //html += '<td style="padding:0 0 0 10px;margin:0 0 0 0;border-width:0 0 0 0;">';
            //html += '<div id="' + leftButtonSectionDiv + 'SpreadsheetsButton" class="divLeftButton" onclick="renderActivityxx();">Spreadsheets&nbsp;&nbsp;&nbsp;&nbsp;</div>';
            //html += '</td>';
            //html += '</tr>';
            html += '<tr><td></td></tr>';
            html += '<tr>';
            html += '<td style="padding:0 0 0 10px;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '<div id="' + leftButtonSectionDiv + 'VisualizationsButton" class="divLeftButton" onclick="renderTrackSpending();">Track Spending&nbsp;&nbsp;&nbsp;&nbsp;</div>';
            html += '</td>';
            html += '</tr>';

            html += '<tr><td></td></tr>';
            html += '<tr>';
            html += '<td style="padding:0 0 0 10px;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '<div id="' + leftButtonSectionDiv + 'ConfigurationButton" class="divLeftButton" onclick="populateStartPageItem(\'divConfiguration\', \'Reports\', \'\');">Configuration&nbsp;&nbsp;</div>';
            html += '</td>';
            html += '</tr>';
            //html += '<tr><td></td></tr>';
            //html += '<tr>';
            //html += '<td style="padding:0 0 0 10px;margin:0 0 0 0;border-width:0 0 0 0;">';
            //html += '<div id="' + leftButtonSectionDiv + 'HelpButton" class="divLeftButton" onclick="populateStartPageItem(\'divHelp\', \'Reports\', \'\');">Help</div>';
            //html += '</td>';
            //html += '</tr>';
        } else if (role == 'archiveviewer') {
            html += '<tr>';
            html += '<td style="padding:0 0 0 10px;margin:0 0 0 0;">';
            html += '<div id="' + leftButtonSectionDiv + 'WelcomeButton" class="divLeftButton" onclick="populateStartPageItem(\'divWelcome\', \'Reports\', \'\');">Home</div>';
            html += '</td>';
            html += '</tr>';
            html += '<tr><td></td></tr>';
            html += '<tr>';
            html += '<td style="padding:0 0 0 10px;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '<div id="' + leftButtonSectionDiv + 'NewRequestButton" class="divLeftButton" onclick="$(\'.bwRequest\').bwRequest(\'displayCreateRequestForm\', \'budgetrequest\');">New Request</div>';
            html += '</td>';
            html += '</tr>';
            html += '<tr><td></td></tr>';
            html += '<tr>';
            html += '<td style="padding:0 0 0 10px;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '<div id="' + leftButtonSectionDiv + 'ArchiveButton" class="divLeftButton" onclick="renderArchive();">All Requests</div>';
            html += '</td>';
            html += '</tr>';
            html += '<tr><td></td></tr>';
            html += '<tr>';
            html += '<td style="padding:0 0 0 10px;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '<div id="' + leftButtonSectionDiv + 'ConfigurationButton" class="divLeftButton" onclick="populateStartPageItem(\'divConfiguration\', \'Reports\', \'\');">Configuration&nbsp;&nbsp;</div>';
            html += '</td>';
            html += '</tr>';
            //html += '<tr><td></td></tr>';
            //html += '<tr>';
            //html += '<td style="padding:0 0 0 10px;margin:0 0 0 0;border-width:0 0 0 0;">';
            //html += '<div id="' + leftButtonSectionDiv + 'HelpButton" class="divLeftButton" onclick="populateStartPageItem(\'divHelp\', \'Reports\', \'\');">Help</div>';
            //html += '</td>';
            //html += '</tr>';
        } else if (role == 'reportviewer') {
            html += '<tr>';
            html += '<td style="padding:0 0 0 10px;margin:0 0 0 0;">';
            html += '<div id="' + leftButtonSectionDiv + 'WelcomeButton" class="divLeftButton" onclick="populateStartPageItem(\'divWelcome\', \'Reports\', \'\');">Home</div>';
            html += '</td>';
            html += '</tr>';
            html += '<tr><td></td></tr>';
            html += '<tr>';
            html += '<td style="padding:0 0 0 10px;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '<div id="' + leftButtonSectionDiv + 'NewRequestButton" class="divLeftButton" onclick="$(\'.bwRequest\').bwRequest(\'displayCreateRequestForm\', \'budgetrequest\');">New Request</div>';
            html += '</td>';
            html += '</tr>';
            html += '<tr><td></td></tr>';
            html += '<tr>';
            html += '<td style="padding:0 0 0 10px;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '<div id="' + leftButtonSectionDiv + 'ArchiveButton" class="divLeftButton" onclick="renderArchive();">All Requests</div>';
            html += '</td>';
            html += '</tr>';
            //html += '<tr><td></td></tr>';
            //html += '<tr>';
            //html += '<td style="padding:0 0 0 10px;margin:0 0 0 0;border-width:0 0 0 0;">';
            //html += '<div id="' + leftButtonSectionDiv + 'SpreadsheetsButton" class="divLeftButton" onclick="renderActivityxx();">Spreadsheets&nbsp;&nbsp;&nbsp;&nbsp;</div>';
            //html += '</td>';
            //html += '</tr>';
            html += '<tr><td></td></tr>';
            html += '<tr>';
            html += '<td style="padding:0 0 0 10px;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '<div id="' + leftButtonSectionDiv + 'VisualizationsButton" class="divLeftButton" onclick="renderTrackSpending();">Track Spending&nbsp;&nbsp;&nbsp;&nbsp;</div>';
            html += '</td>';
            html += '</tr>';
            html += '<tr><td></td></tr>';
            html += '<tr>';
            html += '<td style="padding:0 0 0 10px;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '<div id="' + leftButtonSectionDiv + 'ConfigurationButton" class="divLeftButton" onclick="populateStartPageItem(\'divConfiguration\', \'Reports\', \'\');">Configuration&nbsp;&nbsp;</div>';
            html += '</td>';
            html += '</tr>';
            //html += '<tr><td></td></tr>';
            //html += '<tr>';
            //html += '<td style="padding:0 0 0 10px;margin:0 0 0 0;border-width:0 0 0 0;">';
            //html += '<div id="' + leftButtonSectionDiv + 'HelpButton" class="divLeftButton" onclick="populateStartPageItem(\'divHelp\', \'Reports\', \'\');">Help</div>';
            //html += '</td>';
            //html += '</tr>';
        } else if (role == 'configurationmanager') {
            html += '<tr>';
            html += '<td style="padding:0 0 0 10px;margin:0 0 0 0;">';
            html += '<div id="' + leftButtonSectionDiv + 'WelcomeButton" class="divLeftButton" onclick="populateStartPageItem(\'divWelcome\', \'Reports\', \'\');">Home</div>';
            html += '</td>';
            html += '</tr>';
            html += '<tr><td></td></tr>';
            html += '<tr>';
            html += '<td style="padding:0 0 0 10px;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '<div id="' + leftButtonSectionDiv + 'NewRequestButton" class="divLeftButton" onclick="$(\'.bwRequest\').bwRequest(\'displayCreateRequestForm\', \'budgetrequest\');">New Request</div>';
            html += '</td>';
            html += '</tr>';
            html += '<tr><td></td></tr>';
            html += '<tr>';
            html += '<td style="padding:0 0 0 10px;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '<div id="' + leftButtonSectionDiv + 'ArchiveButton" class="divLeftButton" onclick="renderArchive();">All Requests</div>';
            html += '</td>';
            html += '</tr>';
            //html += '<tr><td></td></tr>';
            //html += '<tr>';
            //html += '<td style="padding:0 0 0 10px;margin:0 0 0 0;border-width:0 0 0 0;">';
            //html += '<div id="' + leftButtonSectionDiv + 'SpreadsheetsButton" class="divLeftButton" onclick="renderActivityxx();">Spreadsheets&nbsp;&nbsp;&nbsp;&nbsp;</div>';
            //html += '</td>';
            //html += '</tr>';
            html += '<tr><td></td></tr>';
            html += '<tr>';
            html += '<td style="padding:0 0 0 10px;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '<div id="' + leftButtonSectionDiv + 'VisualizationsButton" class="divLeftButton" onclick="renderTrackSpending();">Track Spending&nbsp;&nbsp;&nbsp;&nbsp;</div>';
            html += '</td>';
            html += '</tr>';
            html += '<tr><td></td></tr>';
            html += '<tr>';
            html += '<td style="padding:0 0 0 10px;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '<div id="' + leftButtonSectionDiv + 'ConfigurationButton" class="divLeftButton" onclick="populateStartPageItem(\'divConfiguration\', \'Reports\', \'\');">Configuration&nbsp;&nbsp;</div>';
            html += '</td>';
            html += '</tr>';
            //html += '<tr><td></td></tr>';
            //html += '<tr>';
            //html += '<td style="padding:0 0 0 10px;margin:0 0 0 0;border-width:0 0 0 0;">';
            //html += '<div id="' + leftButtonSectionDiv + 'HelpButton" class="divLeftButton" onclick="populateStartPageItem(\'divHelp\', \'Reports\', \'\');">Help</div>';
            //html += '</td>';
            //html += '</tr>';
        } else if (role == 'participant') {
            html += '<tr>';
            html += '<td style="padding:0 0 0 10px;margin:0 0 0 0;">';
            html += '<div id="' + leftButtonSectionDiv + 'WelcomeButton" class="divLeftButton" onclick="populateStartPageItem(\'divWelcome\', \'Reports\', \'\');">Home</div>';
            html += '</td>';
            html += '</tr>';
            html += '<tr><td></td></tr>';
            html += '<tr>';
            html += '<td style="padding:0 0 0 10px;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '<div id="' + leftButtonSectionDiv + 'NewRequestButton" class="divLeftButton" onclick="$(\'.bwRequest\').bwRequest(\'displayCreateRequestForm\', \'budgetrequest\');">New Request</div>';
            html += '</td>';
            html += '</tr>';
            html += '<tr><td></td></tr>';
            html += '<tr>';
            html += '<td style="padding:0 0 0 10px;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '<div id="' + leftButtonSectionDiv + 'ConfigurationButton" class="divLeftButton" onclick="populateStartPageItem(\'divConfiguration\', \'Reports\', \'\');">Configuration&nbsp;&nbsp;</div>';
            html += '</td>';
            html += '</tr>';
            //html += '<tr><td></td></tr>';
            //html += '<tr>';
            //html += '<td style="padding:0 0 0 10px;margin:0 0 0 0;border-width:0 0 0 0;">';
            //html += '<div id="' + leftButtonSectionDiv + 'HelpButton" class="divLeftButton" onclick="populateStartPageItem(\'divHelp\', \'Reports\', \'\');">Help</div>';
            //html += '</td>';
            //html += '</tr>';
        } else {
            // It should never reach here!
            displayAlertDialog('Error in renderLeftButtonsForRole(' + role + ')');
            html += '<tr>';
            html += '<td style="padding:0 0 0 10px;margin:0 0 0 0;">';
            html += '<div id="' + leftButtonSectionDiv + 'WelcomeButton" class="divLeftButton" onclick="populateStartPageItem(\'divWelcome\', \'Reports\', \'\');">Home</div>';
            html += '</td>';
            html += '</tr>';
            //html += '<tr><td></td></tr>';
            //html += '<tr>';
            //html += '<td style="padding:0 0 0 10px;margin:0 0 0 0;border-width:0 0 0 0;">';
            //html += '<div id="' + leftButtonSectionDiv + 'HelpButton" class="divLeftButton" onclick="populateStartPageItem(\'divHelp\', \'Reports\', \'\');">Help</div>';
            //html += '</td>';
            //html += '</tr>';
        }
        html += '</table>';




        // LOOK AT THIS LINE!!!!!!!!!!!!! DOES IT WORK?????????????????????????? 8-7-2020
        html += '<input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';

        if (document.getElementById(leftButtonSectionDiv)) {
            document.getElementById(leftButtonSectionDiv).innerHTML = html;
        }

        // Now we have to disable the button for the page we are on at the moment.
        switch (leftButtonSectionDiv) {
            case 'divWelcomePageLeftButtons':
                //
                document.getElementById(leftButtonSectionDiv + 'WelcomeButton').className = 'divLeftButtonSelected';
                break;
            case 'divNewRequestPageLeftButtons':
                //
                document.getElementById(leftButtonSectionDiv + 'NewRequestButton').className = 'divLeftButtonSelected';
                break;
            case 'divArchivePageLeftButtons':
                //
                document.getElementById(leftButtonSectionDiv + 'ArchiveButton').className = 'divLeftButtonSelected';
                break;
            case 'divSummaryPageLeftButtons':
                //
                document.getElementById(leftButtonSectionDiv + 'SummaryButton').className = 'divLeftButtonSelected';
                break;
            case 'divConfigurationPageLeftButtons':
                //
                document.getElementById(leftButtonSectionDiv + 'ConfigurationButton').className = 'divLeftButtonSelected';
                break;
            case 'divHelpPageLeftButtons':
                //
                document.getElementById(leftButtonSectionDiv + 'HelpButton').className = 'divLeftButtonSelected';
                break;
            case 'divVisualizationsPageLeftButtons':
                //
                //debugger;
                document.getElementById(leftButtonSectionDiv + 'VisualizationsButton').className = 'divLeftButtonSelected';
                break;
            default:
                //
                displayAlertDialog('Error in renderLeftButtons(' + leftButtonSectionDiv + ').');
                break;
        }
    } catch (e) {
        console.log('Exception in renderLeftButtons(): ' + e.message + ', ' + e.stack);
    }
}


function populateStartPageItem(divSection, _type, _reference) {
    try {
        console.log('In populateStartPageItem().');
        //debugger;
        // Always make sure the logged in user details drop down is closed.
        //var isOpen = $("#bwLoggedInUserDropDown").dialog("isOpen");
        //if (isOpen) $("#bwLoggedInUserDropDown").dialog("destroy");
        //$("#bwLoggedInUserDropDown").dialog("destroy");

        //checkForAlerts();

        if (divSection == 'divWelcome') {
            try {
                $('#FormsEditorToolbox').dialog('close');
                //$('#')
            } catch (e) { }

            var canvas = document.getElementById("myCanvas");
            if (canvas) {
                var ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines
                canvas.style.zIndex = -1;
            }
            debugger;
            renderWelcomeScreen(); // This may be removed at some point to leave the screen as-is instead of going all the way back to the home screen, which may be neat...time will tell.
            //renderAlerts2(); // This reloads the alerts that are displayed on the home/welcome page.

            $('#bwQuickLaunchMenuTd').css({
                width: '0'
            }); // This gets rid of the jumping around.

            $('#liWelcome').show();
            $('#liNewRequest').hide();
            $('#liArchive').hide();
            $('#liSummaryReport').hide();
            $('#liConfiguration').hide();
            $('#liVisualizations').hide();
            $('#liHelp').hide();

            $('#divWelcomeMasterDiv').show();
            var e1 = document.getElementById('divWelcomeMasterDiv');
            e1.style.borderRadius = '20px 0 0 20px';

            renderLeftButtons('divWelcomePageLeftButtons');

        } else if (divSection == 'divNewRequestOffline') {

            //displayAlertDialog('ccc: participantId: ' + participantId);














            //debugger; // 10-17-2020 9am adt <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<













            console.log('In my.js.populateStartPageItem("divNewRequestOffline").');

            try {


                //document.getElementById('Article').style.display = 'none'; // This hides the bottom description text.

                //displayAlertDialog('bwLastSelectedNewRequestType: ' + bwLastSelectedNewRequestType);
                //if (bwLastSelectedNewRequestType == 'recurringexpense') {
                //    $('#trNewRequestRecurringExpenseSection').show(); // Not sure if this is the best place to make sure this section is hidden, but it works for now.
                //    $('#dtRecurringExpenseReminderDate').datepicker(); // Hook up the date picker.
                //} else {
                //$('#trNewRequestRecurringExpenseSection').hide();
                //}

                // When a user comes here to create a new request, it is important that we create the BudgetRequestId. This is because if they add attachments, we
                // need to have this already so we can identify which budget request the file attachments belong to.
                var _budgetRequestId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
                document.getElementById('OfflineRequestBudgetRequestId').innerHTML = _budgetRequestId;

                // This may be a recurring expense, so we will do the same thing just in case.
                var _recurringExpenseId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
                document.getElementById('OfflineRequestRecurringExpenseId').innerHTML = _recurringExpenseId;

                //displayAlertDialog('Set RecurringExpenseId to: ' + _recurringExpenseId);

                // Clear the fields!
                // value 
                //strOfflineRequestProjectTitle
                document.getElementById('strOfflineRequestProjectTitle').value = '';
                document.getElementById('strOfflineRequestBriefDescriptionOfProject').value = '';
                document.getElementById('dblOfflineRequestRequestedCapital').value = '';
                // Estimated Start Date // Todd: To-Do! // dtOfflineRequestEstimatedStartDate
                // Estimated End Date // Todd: To-Do! // dtOfflineRequestEstimatedEndDate
                document.getElementById('dtOfflineRequestEstimatedStartDate').value = '';
                document.getElementById('dtOfflineRequestEstimatedEndDate').value = '';
                //document.getElementById('txtOfflineRequestProjectManagerName').value = '';
                //document.getElementById('ddlOfflineRequestFunctionalArea').value = '';
                document.getElementById('OfflineRequestnewrequestattachments').value = '';
                // innerHTML
                document.getElementById('strOfflineRequestProjectTitle').innerHTML = '';
                document.getElementById('strOfflineRequestBriefDescriptionOfProject').innerHTML = '';
                document.getElementById('dblOfflineRequestRequestedCapital').innerHTML = '';
                // Estimated Start Date // Todd: To-Do!
                // Estimated End Date // Todd: To-Do!
                //document.getElementById('txtProjectManagerName').innerHTML = '';
                //document.getElementById('ddlFunctionalArea').innerHTML = '';
                document.getElementById('OfflineRequestnewrequestattachments').innerHTML = '';


                //$('#bwStartPageAccordion').show();
                //$('#bwQuickLaunchMenuTd').css({
                //    width: '0'
                //}); // This gets rid of the jumping around.
                //$('#bwQuickLaunchMenu').hide();

                try {
                    document.getElementById('spanNotLoggedInBetaBanner').style.display = 'none';
                    document.getElementById('spanLoggedInBetaBanner').style.display = 'block';
                } catch (e) { }
                // PUT THIS HERE 10-20-2020
                $('#bwStartPageAccordion').show();

                $('#liWelcome').hide();
                $('#liOfflineWelcome').hide();
                $('#liSummaryReport').hide();
                $('#liVisualizations').hide();
                $('#liConfiguration').hide();
                $('#liArchive').hide();
                $('#liNewRequest').hide();
                $('#liAbout').show();
                //debugger;
                //$('#liOfflineRequestForm').show(); 

                //renderLeftButtons('divOfflineRequestFormPageLeftButtons');

                // Set the left button styles.
                //document.getElementById('divWelcomeButton').className = 'divLeftButton';
                //document.getElementById('divWelcomePageLeftButtonsNewRequestButton').className = 'divLeftButtonSelected';
                //document.getElementById('divWelcomePageLeftButtonsArchiveButton').className = 'divLeftButton';
                //document.getElementById('divWhoAreWeButton').className = 'divLeftButton';


                //var e1 = document.getElementById('divNewRequestMasterDiv');
                //e1.style.borderRadius = '20px 0 0 20px';

                // Create the drop down at the top of the page, and select the last used option!
                // First we load our array.
                var requestTypes = [];
                requestTypes = new Array();
                // Budget Request
                var request = ['budgetrequest', 'Budget Request', 'selected'];
                requestTypes.push(request);
                // Quote Request
                //if (quotingEnabled == true) {
                var request = ['quoterequest', 'Quote Request', ''];
                requestTypes.push(request);
                //}
                // Reimbursement Request
                //if (reimbursementRequestsEnabled == true) {
                var request = ['expenserequest', 'Reimbursement Request', ''];
                requestTypes.push(request);
                //}
                // Recurring Expense
                //if (recurringExpensesEnabled == true) {
                var request = ['recurringexpense', 'Recurring Expense', ''];
                requestTypes.push(request);
                //}
                // Now formulate the GUI!
                var html = '';
                //if (requestTypes.length == 1) {
                //    // If there is only one, don't display as a drop down, just as plain text.
                //    html += '<span style="font-size: 200%;">New <strong>' + requestTypes[0][1] + '</strong></span>';
                //    document.getElementById('spanRequestForm_Title').innerHTML = html;
                //} else {
                // There is more than 1, so we have to display as a drop down.
                html += '<span style="font-size: 350%;">New <strong>';
                //html += '<select class="selectHomePageWorkflowAppDropDown" id="selectNewRequestFormRequestTypeDropDown" style=\'border-color: whitesmoke; color: rgb(38, 38, 38); font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 1.25em; font-weight: bold; cursor: pointer;\' onchange="xxxx();">';
                html += '<select id="selectOfflineNewRequestFormRequestTypeDropDown" style=\'border-color: whitesmoke; color: rgb(38, 38, 38); font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 1.0em; font-weight: bold; cursor: pointer;\'>';
                for (var i = 0; i < requestTypes.length; i++) {
                    //if (requestTypes[i][0] == bwLastSelectedNewRequestType) {
                    //    // Selected
                    //    html += '<option value="' + requestTypes[i][0] + '" ' + requestTypes[i][2] + ' selected >' + requestTypes[i][1] + '</option>';
                    //} else {
                    // Not selected
                    html += '<option value="' + requestTypes[i][0] + '" ' + requestTypes[i][2] + '>' + requestTypes[i][1] + '</option>';
                    //}
                }
                html += '</select>';
                html += '</span>';
                document.getElementById('spanOfflineNewRequestFormRequestTypeDropDownSection').innerHTML = html;


                //}


                document.getElementById('spanOfflineNewRequestDetailsLabel').innerHTML = '<span class="xdlabel">Justification details:</span>';
                //}
                // Set if the dates are required.
                //if (requireStartEndDates == true) {
                //    document.getElementById('spanNewRequestStartDateLabel').innerHTML = '<span class="xdlabel" style="white-space:nowrap;">Start date (estimated):&nbsp;</span><span style="color:red;font-size:medium;">*</span>';
                //    document.getElementById('spanNewRequestEndDateLabel').innerHTML = '<span class="xdlabel" style="white-space:nowrap;">End date (estimated):&nbsp;</span><span style="color:red;font-size:medium;">*</span>';
                //} else {
                document.getElementById('spanOfflineNewRequestStartDateLabel').innerHTML = '<span class="xdlabel">Start date (estimated):</span>';
                document.getElementById('spanOfflineNewRequestEndDateLabel').innerHTML = '<span class="xdlabel">End date (estimated):</span>';
                //}
                // Set if the attachments are allowed.
                //if (enableNewRequestAttachments == true) {
                $('#trOfflineNewRequestAttachmentsSection').show();
                //document.getElementById('trNewRequestAttachmentsSection').innerHTML = '<span class="xdlabel">Attachments:</span>&nbsp;<span style="color:red;font-size:medium;">*</span>';
                //} else {
                //    $('#trNewRequestAttachmentsSection').hide();
                //    //document.getElementById('trNewRequestAttachmentsSection').innerHTML = '<span class="xdlabel">Attachments:</span>';
                //}

                // Set if the attachments are allowed.
                //if (enableNewRequestBarcodeAttachments == true) {
                //$('#trNewRequestBarcodeAttachmentsSection').show();



                console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXX');



                // Display all of the attachments. This is temporary and will be removed!!!!
                //populateOfflineAttachments('OfflineRequestnewrequestattachments');




            } catch (e) {
                console.log('Exception in ios8.js.populateStartPageItem("divNewRequestOffline"): ' + e.message + ', ' + e.stack);
                displayAlertDialog('Exception in ios8.js.populateStartPageItem("divNewRequestOffline"): ' + e.message + ', ' + e.stack);
            }

        } else if (divSection == 'divNewRequest') {

            $('.bwRequest').bwRequest('displayCreateRequestForm', 'divCreateRequestFormContent');


        } else if (divSection == 'divArchive') {
            debugger; // THIS NEEDS TO BE MOVED!! >> RENAME TO: renderArchive();



        } else if (divSection == 'divSummaryReport') {

        } else if (divSection == 'divHelp') {
            //$('#bwStartPageAccordion').show();
            $('#bwQuickLaunchMenuTd').css({
                width: '0'
            }); // This gets rid of the jumping around.

            try {
                $('#FormsEditorToolbox').dialog('close');
            } catch (e) { }

            //$('#bwQuickLaunchMenu').hide();
            $('#liWelcome').hide();
            $('#liNewRequest').hide();
            $('#liArchive').hide();
            $('#liSummaryReport').hide();
            $('#liConfiguration').hide();
            $('#liHelp').show();
            $('#liVisualizations').hide();
            var e1 = document.getElementById('divHelpMasterDiv');
            e1.style.borderRadius = '20px 0 0 20px';
            //displayConnectedWorkflows();

            var canvas = document.getElementById("myCanvas");
            if (canvas) {
                var ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines
                canvas.style.zIndex = -1;
            }

            renderLeftButtons('divHelpPageLeftButtons');





            slideTransitionLastSystemTime = 0; // Set this to 0 when the page changes, so that the carousel starts immediately when coming back to the welcome page.
            carouselImageTracker = 0; // This makes sure the first slide is alwasy shown when coming back to the welcome screen.
            document.getElementById('divCarouselPausePlay').innerHTML = '<div id="divCarouselPausePlay2" class="carouselPausePlay" onclick="cmdCarouselImageIndicatorClick(\'' + carouselImageTracker + '\');" style="cursor:pointer;white-space:nowrap;">pause slideshow<div>';
            setCarouselImageTracker();
            slideTransitionLastSystemTime = new Date().getTime() / 1000; // Set this value for the next time through!








        } else if (divSection == 'divConfiguration') {
            $('#bwQuickLaunchMenuTd').css({
                width: '0'
            }); // This gets rid of the jumping around.

            try {
                $('#FormsEditorToolbox').dialog('close');
            } catch (e) { }


            $('#liWelcome').hide();
            $('#liNewRequest').hide();
            $('#liArchive').hide();
            $('#liSummaryReport').hide();
            $('#liHelp').hide();
            $('#liConfiguration').show();
            $('#liVisualizations').hide();
            var e1 = document.getElementById('divConfigurationMasterDiv');
            e1.style.borderRadius = '20px 0 0 20px';
            var e1 = document.getElementById('divFunctionalAreas');
            e1.style.borderRadius = '20px 0 0 20px';
            //debugger;
            generateConfigurationLeftSideMenu();

            renderLeftButtons('divConfigurationPageLeftButtons');



        } else if (divSection == 'divAddAFunctionalArea') {
            $('#bwQuickLaunchMenuTd').css({
                width: '0'
            }); // This gets rid of the jumping around.
            $('#divFunctionalAreasMasterSubMenuDiv').text('Add a functional area:'); // Change the title of the section.
            $('#btnFunctionalAreaDelete').hide();
            $('#divFunctionalAreaSection').html($('#divFunctionalAreaTemplate').html()); // Display the functional area form.
            //$('span[xd\\:binding = "my:FunctionalAreaTitle"]')[0].focus(); // Focus on the title field.
            //generateFunctionalAreasApproverDataEntryFields();

            $('#txtFunctionalAreaId').empty; // This will make sure it is a PUT operation, which means we create a new functional area rTHER THAN UPDATING AN EXISTING ONE.

            // Set the active button with out dotted line outline etc.
            //$('#divMenuMasterDivAddAFunctionalArea').css({
            //    'border-width': '0px', 'margin': '0px 0px 0px 0px', 'padding': '12px 0px 0px 20px', 'outline': 'rgb(59, 103, 142) dashed 1px', 'border-radius': '0px', 'width': '92%', 'height': '28px', 'color': '#dcdcdc', 'background-color': 'white'
            //});
            document.getElementById('divMenuMasterDivAddAFunctionalArea').className = 'divLeftButtonSelected';

            $('#divFunctionalAreasMasterSubMenuDiv').show(); // This shows the header right-rounder bar in case it was hidden.

            hookUpThePeoplePickers(); // This hooks up the Approver #1 and #2 people pickers.
            var e1 = document.getElementById('divFunctionalAreas');
            e1.style.borderRadius = '20px 0 0 20px';
        } else if (divSection == 'divFunctionalAreas') {
            //$('#bwQuickLaunchMenuTd').css({
            //    width: '0'
            //}); // This gets rid of the jumping around.

            ////var e1 = document.getElementById('divFunctionalAreas');
            ////e1.style.borderRadius = '20px 0 0 20px';
            ////loadWorkflowAppConfigurationDetails9();

            ////generateFunctionalAreasListButtons();



            //// This is displayed to owners when the next year rolls around!
            ////cmdDisplayFinancialAreaDialogYouOnlyHaveOneFinancialAreaCopyPreviousYearOption();







            //GetWorkflowAppConfigurationData9 = $.Deferred();
            //GetWorkflowAppConfigurationData9
            //    .done(function () {
            //        //displayAlertDialog('DONE');
            //        generateFunctionalAreasListButtons();
            //    })
            //    .fail(function () {
            //        handleExceptionWithAlert('Error in my.js.populateStartPageItem(divFunctionalAreas)', 'GetWorkflowAppConfigurationData9.fail()');
            //    });
            //$('#divBwCoreComponent').bwCoreComponent('loadWorkflowAppConfigurationDetails9');

            //// GetWorkflowAppConfigurationData9.resolve(); // Callback.



        } else if (divSection == 'divLocations') {
            //$('#bwQuickLaunchMenuTd').css({
            //    width: '0'
            //}); // This gets rid of the jumping around.

            debugger;
            //$('#divFunctionalAreasMasterDiv').empty(); // Clear the div and rebuild it with out new 'Departments' title.
            //$('#divFunctionalAreasMasterSubMenuDiv').hide(); //This is the top bar which we want to hide in this case.







            //$('#divFunctionalAreasMasterSubMenuDiv').text('Add a functional area:'); // Change the title of the section.
            //$('#btnFunctionalAreaDelete').hide();
            //$('#divFunctionalAreaSection').html($('#divFunctionalAreaTemplate').html()); // Display the functional area form.
            ////$('span[xd\\:binding = "my:FunctionalAreaTitle"]')[0].focus(); // Focus on the title field.
            ////generateFunctionalAreasApproverDataEntryFields();

            //$('#txtFunctionalAreaId').empty; // This will make sure it is a PUT operation, which means we create a new functional area rTHER THAN UPDATING AN EXISTING ONE.

            //// Set the active button with out dotted line outline etc.
            ////$('#divMenuMasterDivAddAFunctionalArea').css({
            ////    'border-width': '0px', 'margin': '0px 0px 0px 0px', 'padding': '12px 0px 0px 20px', 'outline': 'rgb(59, 103, 142) dashed 1px', 'border-radius': '0px', 'width': '92%', 'height': '28px', 'color': '#dcdcdc', 'background-color': 'white'
            ////});
            //document.getElementById('divMenuMasterDivAddAFunctionalArea').className = 'divLeftButtonSelected';

            //$('#divFunctionalAreasMasterSubMenuDiv').show(); // This shows the header right-rounder bar in case it was hidden.












            //var e1 = document.getElementById('divFunctionalAreas');
            //e1.style.borderRadius = '20px 0 0 20px';
            //loadWorkflowAppConfigurationDetails9();

            //generateFunctionalAreasListButtons();



            // This is displayed to owners when the next year rolls around!
            //cmdDisplayFinancialAreaDialogYouOnlyHaveOneFinancialAreaCopyPreviousYearOption();







            //GetWorkflowAppConfigurationData9 = $.Deferred();
            //GetWorkflowAppConfigurationData9
            //    .done(function () {
            //        //displayAlertDialog('DONE');
            //        generateFunctionalAreasListButtons();
            //    })
            //    .fail(function () {
            //        handleExceptionWithAlert('Error in my.js.populateStartPageItem(divFunctionalAreas)', 'GetWorkflowAppConfigurationData9.fail()');
            //    });
            //loadWorkflowAppConfigurationDetails9();


            //generateFunctionalAreasListButtons();
            //generateLocationsListButtons();

            //} else if (divSection == 'divParticipants') {
            //    $('#bwQuickLaunchMenuTd').css({
            //        width: '0'
            //    }); // This gets rid of the jumping around.
            //    //$('#divFunctionalAreasMasterDiv').text('Participants'); // Change the title of the section.
            //    //$('#btnFunctionalAreaDelete').hide();
            //    //$('#divFunctionalAreaSection').html(''); //$('#divFunctionalAreaTemplate').html()); // Display the functional area form.

            //    //renderConfigureParticipantsScreen();
            //    //var e1 = document.getElementById('divParticipants');
            //    //e1.style.borderRadius = '20px 0 0 20px';

            //    generateParticipantsListButtons();


        }
            //else if (divSection == 'divDepartments') {
            //    $('#bwQuickLaunchMenuTd').css({
            //        width: '0'
            //    }); // This gets rid of the jumping around.
            //    var data = {
            //    };
            //    $.ajax({
            //        url: appweburl + "/bwdepartments",
            //        type: "DELETE",
            //        contentType: 'application/json',
            //        data: JSON.stringify(data),
            //        success: function (data) {
            //            $('#spanDepartmentTitle').text('Procurement'); //data[0].bwDepartmentTitle);
            //            if (data.length > 0) {
            //                //    var html = '';
            //                //    html += '<input ';
            //                //    html += '';
            //                //    $('#spanDepartmentTitle').append()

            //                //} else {
            //                //$('#spanDepartmentTitle').text('Procurement'); //data[0].bwDepartmentTitle);
            //                $('#txtBwDepartmentUserName').val(data[0].bwDepartmentUserName);
            //                $('#txtBwDepartmentUserId').val(data[0].bwDepartmentUserId);
            //            }
            //        },
            //        error: function (data, errorCode, errorMessage) {
            //            displayAlertDialog('Error in my.js.populateStartPageItem(divDepartments):' + errorCode + ', ' + errorMessage);
            //        }
            //    });
            //    var e1 = document.getElementById('divFunctionalAreas');
            //    e1.style.borderRadius = '20px 0 0 20px';
            //    generateDepartmentsListButtons();
            //} //else if (divSection == 'divWorkflows') {
            //$('#bwQuickLaunchMenuTd').css({ width: '0' }); // This gets rid of the jumping around.
            //var data = {
            //};
            //$.ajax({
            //    url: appweburl + "/bwdepartments",
            //    type: "DELETE",
            //    contentType: 'application/json',
            //    data: JSON.stringify(data),
            //    success: function (data) {
            //        $('#spanDepartmentTitle').text('Procurement'); //data[0].bwDepartmentTitle);
            //        if (data.length > 0) {
            //            //    var html = '';
            //            //    html += '<input ';
            //            //    html += '';
            //            //    $('#spanDepartmentTitle').append()

            //            //} else {
            //            //$('#spanDepartmentTitle').text('Procurement'); //data[0].bwDepartmentTitle);
            //            $('#txtBwDepartmentUserName').val(data[0].bwDepartmentUserName);
            //            $('#txtBwDepartmentUserId').val(data[0].bwDepartmentUserId);
            //        }
            //    },
            //    error: function (data, errorCode, errorMessage) {
            //        displayAlertDialog('Error in my.js.populateStartPageItem(divDepartments):' + errorCode + ', ' + errorMessage);
            //    }
            //});
            //var e1 = document.getElementById('divFunctionalAreas');
            //e1.style.borderRadius = '20px 0 0 20px';
            //generateWorkflowsPage();
        else if (divSection == 'divBehavior') {
            $('#bwQuickLaunchMenuTd').css({
                width: '0'
            }); // This gets rid of the jumping around.
            //var data = {
            //};
            //$.ajax({
            //    url: appweburl + "/bwdepartments",
            //    type: "DELETE",
            //    contentType: 'application/json',
            //    data: JSON.stringify(data),
            //    success: function (data) {
            //        $('#spanDepartmentTitle').text('Procurement'); //data[0].bwDepartmentTitle);
            //        if (data.length > 0) {
            //            //    var html = '';
            //            //    html += '<input ';
            //            //    html += '';
            //            //    $('#spanDepartmentTitle').append()

            //            //} else {
            //            //$('#spanDepartmentTitle').text('Procurement'); //data[0].bwDepartmentTitle);
            //            $('#txtBwDepartmentUserName').val(data[0].bwDepartmentUserName);
            //            $('#txtBwDepartmentUserId').val(data[0].bwDepartmentUserId);
            //        }
            //    },
            //    error: function (data, errorCode, errorMessage) {
            //        displayAlertDialog('Error in my.js.populateStartPageItem(divDepartments):' + errorCode + ', ' + errorMessage);
            //    }
            //});
            //var e1 = document.getElementById('divFunctionalAreas');
            //e1.style.borderRadius = '20px 0 0 20px';
            //generateBehaviorPage();
        } else if (divSection == 'divWorkflowSettings') {
            //$('#bwQuickLaunchMenuTd').css({
            //    width: '0'
            //}); // This gets rid of the jumping around.

            //renderConfigurationSettings();

        } else if (divSection == 'divWorkflowEditorSettings') {
            debugger;
            //$('#bwQuickLaunchMenuTd').css({
            //    width: '0'
            //}); // This gets rid of the jumping around.

            //$('#divFunctionalAreasMasterDiv').empty(); // Clear the div and rebuild it with out new 'Departments' title.
            //$('#divFunctionalAreasMasterSubMenuDiv').hide(); //This si the top bar which we want to hide in this case.

            //var html = '';
            //html += '<table style="border-width: 0px; margin: 0px; padding: 0px; width: 100%;"><tbody><tr style="border-width: 0px; margin: 0px; padding: 0px;"><td style="border-width: 0px; margin: 0px; padding: 0px;">';
            //html += 'Workflow...';
            //html += '</td></tr></tbody></table>';
            //$('#divFunctionalAreasMasterDiv').html(html);
            ////
            ////disableDepartmentsButton();
            //disableRaciSettingsButton();
            //$('#divFunctionalAreasSubSubMenus').empty();


            //var html = '';
            //html += '<div id="divWorkflowEditor"></div>';
            //$('#divFunctionalAreasSubSubMenus').html(html);
            ////
            //// Render the workflow editor.
            ////





            //debugger; //-THISNEEDSTOBECHANGED // This is the "Workflow Editor". >> RENAME TO: renderConfigurationWorkflow();
            //var bwEnabledRequestTypes = [];
            //bwEnabledRequestTypes.push(['budgetrequest', 'Budget Request', 'Budget Requests']);
            //if (quotingEnabled == true) { bwEnabledRequestTypes.push(['quoterequest', 'Quote Request', 'Quote Requests']); }
            //if (reimbursementRequestsEnabled == true) { bwEnabledRequestTypes.push(['expenserequest', 'Reimbursement Request', 'Reimbursement Requests']); }
            //if (recurringExpensesEnabled == true) { bwEnabledRequestTypes.push(['recurringexpense', 'Recurring Expense', 'Recurring Expenses']); }
            //bwEnabledRequestTypes.push(['capitalplanproject', 'Capital Plan Project', 'Capital Plan Projects']); //capitalplanproject4
            //bwEnabledRequestTypes.push(['workorder', 'Work Order', 'Work Orders']);
            //var options = {
            //    displayWorkflowPicker: true,
            //    bwTenantId: tenantId,
            //    bwWorkflowAppId: workflowAppId,
            //    bwEnabledRequestTypes: bwEnabledRequestTypes
            //};
            //var $bwworkfloweditor = $("#divWorkflowEditor").bwWorkflowEditor(options);
        } else if (divSection == 'divChecklistsSettings') {
            //$('#bwQuickLaunchMenuTd').css({
            //    width: '0'
            //}); // This gets rid of the jumping around.

            //$('#divFunctionalAreasMasterDiv').empty(); // Clear the div and rebuild it with out new 'Departments' title.
            //$('#divFunctionalAreasMasterSubMenuDiv').hide(); //This si the top bar which we want to hide in this case.

            //var html = '';
            //html += '<table style="border-width: 0px; margin: 0px; padding: 0px; width: 100%;"><tbody><tr style="border-width: 0px; margin: 0px; padding: 0px;"><td style="border-width: 0px; margin: 0px; padding: 0px;">';
            //html += 'Checklists...';
            ////html += '';
            //html += '</td></tr></tbody></table>';
            //$('#divFunctionalAreasMasterDiv').html(html);
            ////
            ////disableDepartmentsButton();
            //disableChecklistsSettingsButton();
            //$('#divFunctionalAreasSubSubMenus').empty();


            //var html = '';
            //html += '<div id="divChecklistsEditor" style="height:100vh;"></div>'; // Todd just did this to try and get the editing screen to not jump around when deleting rows at the bottom, and make it more intuitive! 10-24-19 2pm ast.
            //$('#divFunctionalAreasSubSubMenus').html(html);

            //var options = { displayChecklistPicker: true, bwTenantId: tenantId, bwWorkflowAppId: workflowAppId, checklistIndex: _reference };
            //var $checklist = $("#divChecklistsEditor").bwChecklistsEditor(options);
        }


        // TODD: THIS WORKS A BIT WEIRD< MAYBE SHOULD GO ELSE WHERE!!! it is also in renderWelcomeScreen(). 9-4-16
        // This zooms the screen when the user first navigates to the website! More about this in the Budget Workflow Manager codebase.
        //if (navigator.userAgent.match(/iPhone/i)) {
        //    $('#bwMyPage').animate({ 'zoom': 3 }, 400);
        //}

    } catch (e) {
        //handleExceptionWithAlert('Error in my.js.populateStartPageItem(' + divSection + ')', e.message);
        console.log('Error in my.js.populateStartPageItem(' + divSection + ') xcx59e46-1: ' + e.message + ', ' + e.stack);
        displayAlertDialog('Error in my.js.populateStartPageItem(' + divSection + ') xcx59e46-1: ' + e.message);
    }
}

function generateConfigurationLeftSideMenu() {
    //debugger;
    $('#divConfigurationLeftSideMenu').empty();
    var data = {
        "bwParticipantId": participantId
    };
    $.ajax({
        url: webserviceurl + "/bwworkflowapps/listallforparticipant",
        type: "DELETE",
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (data) {
            var html = '';
            //html += '<hr />';
            //html += 'Your organization(s):<br />';
            //html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
            //html += '  <tr>';
            //html += '    <td>';
            //// Display the workflow apps as selectable buttons.
            //var topHtml = '';
            //var bottomHtml = '';
            //for (var i = 0; i < data.ParticipantOwnedWorkflowApps.length; i++) {
            //    if (workflowAppId == data.ParticipantOwnedWorkflowApps[i][2]) {
            //        // This one is selected.
            //        topHtml += '    <tr>';
            //        topHtml += '        <td style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
            //        //topHtml += '            <div id="divConfigurationLeftSideMenuButton' + i + '" style="cursor:default;border-radius:20px 0 0 20px;height:28px;width:92%;white-space:nowrap;padding:12px 0 0 20px;margin:0 0 0 0;border-width:0 0 0 0;background-color:#066B8B;" onclick="selectCurrentWorkflowApp(\'' + data.ParticipantOwnedWorkflowApps[i][3] + '\');" class="evaluationChecklistAccordionLink">' + data.ParticipantOwnedWorkflowApps[i][3] + '&nbsp;&nbsp;&nbsp;&nbsp;</div>';
            //        topHtml += '            <div id="divConfigurationLeftSideMenuButton' + i + '" class="divLeftButton" style="border-radius:20px 0 0 20px;background-color:#066B8B;" onclick="selectCurrentWorkflowApp(\'' + data.ParticipantOwnedWorkflowApps[i][3] + '\');">' + data.ParticipantOwnedWorkflowApps[i][3] + '&nbsp;&nbsp;&nbsp;&nbsp;</div>';
            //        topHtml += '        </td>';
            //        topHtml += '    </tr>';
            //        topHtml += '    <tr><td></td></tr>';
            //    } else {
            //        bottomHtml += '    <tr>';
            //        bottomHtml += '        <td style="padding:0 0 0 20px;margin:0 0 0 0;border-width:0 0 0 0;">';
            //        //bottomHtml += '            <div id="divConfigurationLeftSideMenuButton' + i + '" style="font-size:small;height:28px;width:92%;white-space:nowrap;border-radius:0 0 0 0;padding:12px 0 0 20px;margin:0 0 0 0;border-width:0 0 0 0;background-color:#6682b5;" onclick="cmdChooseSelectedWorkflow(\'' + data.ParticipantOwnedWorkflowApps[i][2] + '\', \'' + data.ParticipantOwnedWorkflowApps[i][3] + '\');" class="evaluationChecklistAccordionLink">' + data.ParticipantOwnedWorkflowApps[i][3] + '&nbsp;&nbsp;&nbsp;&nbsp;</div>';
            //        bottomHtml += '            <div id="divConfigurationLeftSideMenuButton' + i + '" class="divLeftButton" style="font-size:small;" onclick="cmdChooseSelectedWorkflow(\'' + data.ParticipantOwnedWorkflowApps[i][2] + '\', \'' + data.ParticipantOwnedWorkflowApps[i][3] + '\');">' + data.ParticipantOwnedWorkflowApps[i][3] + '&nbsp;&nbsp;&nbsp;&nbsp;</div>';
            //        bottomHtml += '        </td>';
            //        bottomHtml += '    </tr>';
            //        bottomHtml += '    <tr><td></td></tr>';
            //    }
            //}
            //html += topHtml + bottomHtml;
            ////
            //html += '    <tr>';
            //html += '        <td style="padding:0 0 0 20px;margin:0 0 0 0;border-width:0 0 0 0;">';
            ////html += '            <div id="divConfigurationLeftSideMenuButton" style="font-size:small;height:28px;width:92%;white-space:nowrap;border-radius:0 0 0 0;padding:12px 0 0 20px;margin:0 0 0 0;border-width:0 0 0 0;background-color:#6682b5;" onclick="cmdAddAWorkflowApp();" class="evaluationChecklistAccordionLink">New Workflow...&nbsp;&nbsp;&nbsp;&nbsp;</div>';
            //html += '            <div id="divConfigurationLeftSideMenuButton" class="divLeftButton" style="font-size:small;" onclick="cmdAddAWorkflowApp();">Add an organization...&nbsp;&nbsp;&nbsp;&nbsp;</div>';
            //html += '        </td>';
            //html += '    </tr>';
            //html += '    <tr><td></td></tr>';
            ////
            //html += '    </td>';
            //html += '  </tr>';
            //html += '</table>';
            //$('#divConfigurationLeftSideMenu').html(html);

            renderConfigurationPersonalBehavior();
        },
        error: function (data, errorCode, errorMessage) {
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in my.js.generateConfigurationLeftSideMenu():' + errorCode + ', ' + errorMessage);
        }
    });
}


function renderConfigurationForms() {
    try {
        //debugger;
        $('#bwQuickLaunchMenuTd').css({
            width: '0'
        }); // This gets rid of the jumping around.

        var canvas = document.getElementById("myCanvas");
        if (canvas) {
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines
            canvas.style.zIndex = -1;
        }

        $('#divFunctionalAreasMasterDiv').empty(); // Clear the div and rebuild it with out new 'Departments' title.
        $('#divFunctionalAreasMasterSubMenuDiv').hide(); //This si the top bar which we want to hide in this case.

        var html = '';
        html += '<table style="border-width: 0px; margin: 0px; padding: 0px; width: 100%;"><tbody><tr style="border-width: 0px; margin: 0px; padding: 0px;"><td style="border-width: 0px; margin: 0px; padding: 0px;">';
        //html += 'Forms: <span style="font-weight:bold;color:#95b1d3;">Configure your "' + workflowAppTitle + '" forms...</span>';
        html += 'Forms: <span style="font-weight:bold;color:#95b1d3;">Configure the global system offline request forms...</span>';
        //html += '';
        html += '</td></tr></tbody></table>';
        $('#divFunctionalAreasMasterDiv').html(html);
        //
        //disableDepartmentsButton();
        disableFormsSettingsButton();
        $('#divFunctionalAreasSubSubMenus').empty();


        var html = '';
        html += '<div id="divFormsEditor" class="context-menu-formseditor" style="height:100vh;"></div>'; // Todd just did this to try and get the editing screen to not jump around when deleting rows at the bottom, and make it more intuitive! 10-24-19 2pm ast.
        $('#divFunctionalAreasSubSubMenus').html(html);

        //debugger;
        var options = { BackendGlobalOfflineFormsEditing: true, displayChecklistPicker: true, bwTenantId: tenantId, bwWorkflowAppId: workflowAppId, checklistIndex: '' };
        var $form = $("#divFormsEditor").bwFormsEditor(options);

    } catch (e) {
        console.log('Exception in renderConfigurationForms()xcx1: ' + e.message + ', ' + e.stack);
    }
}

function renderConfigurationNewTenantForms() {
    try {
        console.log('In renderConfigurationNewTenantForms().');
        //alert('In renderConfigurationNewTenantForms().');

        //debugger;
        $('#bwQuickLaunchMenuTd').css({
            width: '0'
        }); // This gets rid of the jumping around.

        var canvas = document.getElementById("myCanvas");
        if (canvas) {
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines
            canvas.style.zIndex = -1;
        }

        //$('#divConfigurationMasterDiv').text('NEW TENANT EXPERIENCE');


        $('#divFunctionalAreasMasterDiv').empty(); // Clear the div and rebuild it with out new 'Departments' title.
        $('#divFunctionalAreasMasterSubMenuDiv').hide(); //This si the top bar which we want to hide in this case.

        var html = '';
        html += '<table style="border-width: 0px; margin: 0px; padding: 0px; width: 100%;"><tbody><tr style="border-width: 0px; margin: 0px; padding: 0px;"><td style="border-width: 0px; margin: 0px; padding: 0px;">';
        //html += 'Forms: <span style="font-weight:bold;color:#95b1d3;">Configure your "' + workflowAppTitle + '" forms...</span>';
        html += 'Forms: <span style="font-weight:bold;color:#95b1d3;">Configure the global system new tenant request forms...</span>';
        //html += '';
        html += '</td></tr></tbody></table>';
        $('#divFunctionalAreasMasterDiv').html(html);
        //
        //disableDepartmentsButton();
        disableNewTenantFormsSettingsButton();
        $('#divFunctionalAreasSubSubMenus').empty();


        var html = '';
        html += '<div id="divFormsEditor" class="context-menu-formseditor" style="height:100vh;"></div>'; // Todd just did this to try and get the editing screen to not jump around when deleting rows at the bottom, and make it more intuitive! 10-24-19 2pm ast.
        $('#divFunctionalAreasSubSubMenus').html(html);






        var options = { BackendGlobalNewTenantFormsEditing: true, displayChecklistPicker: true, bwTenantId: null, bwWorkflowAppId: null, checklistIndex: '' };
        var $form = $("#divFormsEditor").bwFormsEditor_NewTenant(options);



    } catch (e) {
        console.log('Exception in renderConfigurationForms()xcx2: ' + e.message + ', ' + e.stack);
        displayAlertDialog('Exception in renderConfigurationForms()xcx2: ' + e.message + ', ' + e.stack);
    }
}

function renderConfigurationNewTenantWorkflows() {
    try {
        //debugger;
        $('#bwQuickLaunchMenuTd').css({
            width: '0'
        }); // This gets rid of the jumping around.

        var canvas = document.getElementById("myCanvas");
        if (canvas) {
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines
            canvas.style.zIndex = -1;
        }

        //$('#divConfigurationMasterDiv').text('NEW TENANT EXPERIENCE');


        $('#divFunctionalAreasMasterDiv').empty(); // Clear the div and rebuild it with out new 'Departments' title.
        $('#divFunctionalAreasMasterSubMenuDiv').hide(); //This si the top bar which we want to hide in this case.

        var html = '';
        html += '<table style="border-width: 0px; margin: 0px; padding: 0px; width: 100%;"><tbody><tr style="border-width: 0px; margin: 0px; padding: 0px;"><td style="border-width: 0px; margin: 0px; padding: 0px;">';
        //html += 'Forms: <span style="font-weight:bold;color:#95b1d3;">Configure your "' + workflowAppTitle + '" forms...</span>';
        html += 'Workflows: <span style="font-weight:bold;color:#95b1d3;">Configure the global system new tenant workflows...</span>';
        //html += '';
        html += '</td></tr></tbody></table>';
        $('#divFunctionalAreasMasterDiv').html(html);
        //
        //disableDepartmentsButton();
        disableNewTenantFormsSettingsButton();
        $('#divFunctionalAreasSubSubMenus').empty();


        var html = '';
        //// Publish message and button.
        //html += '<table>';
        //html += '<tr>';
        //html += '  <td>';
        //html += '';
        //html += '  </td>';
        //html += '  <td style="text-align:right;">';
        //html += '    <span id="spanThereAreChangesToPublishText" style="font-style:italic;color:tomato;"></span>'; //<input value=" There are unsaved changes. Enter a description here and click Save..." type="text" id="txtNewWorkflowDescription" style="width:450px;color:grey;font-style:italic;padding:5px 5px 5px 5px;" onkeyup="$(\'.bwWorkflowEditor_NewTenant\').bwWorkflowEditor_NewTenant(\'NewWorkflowDescriptionTextBox_Onkeyup\');" />';
        //html += '  </td>';
        //html += '  <td>';
        //html += '    <span id="spanThereAreChangesToPublishButton"></span>';
        //html += '  </td>';
        //html += '</tr>';
        //html += '</table>';

        html += '<div id="divBwWorkflowEditor_NewTenant" style="height:100vh;"></div>'; // Todd just did this to try and get the editing screen to not jump around when deleting rows at the bottom, and make it more intuitive! 10-24-19 2pm ast.
        $('#divFunctionalAreasSubSubMenus').html(html);

        //debugger;
        //var options = { BackendGlobalNewTenantFormsEditing: true, displayChecklistPicker: true, bwTenantId: tenantId, bwWorkflowAppId: workflowAppId, checklistIndex: '' };
        //var $form = $("#divFormsEditor").bwFormsEditor(options);
        var $form = $("#divBwWorkflowEditor_NewTenant").bwWorkflowEditor_NewTenant({});



    } catch (e) {
        console.log('Exception in renderConfigurationForms()xcx3: ' + e.message + ', ' + e.stack);
        displayAlertDialog('Exception in renderConfigurationForms()xcx3: ' + e.message + ', ' + e.stack);
    }
}

function disableNewTenantFormsSettingsButton() {
    try {
        console.log('In disableFormsSettingsButton().');
        document.getElementById('divBehaviorButton').className = 'divInnerLeftButton';
        //document.getElementById('divFunctionalAreasButton').className = 'divInnerLeftButton';
        //document.getElementById('divDepartmentsButton').className = 'divInnerLeftButton';
        document.getElementById('divParticipantsButton').className = 'divInnerLeftButton';
        document.getElementById('divWorkflowSettingsButton').className = 'divInnerLeftButton';
        document.getElementById('divWorkflowEditorSettingsButton').className = 'divInnerLeftButton';
        document.getElementById('divChecklistsSettingsButton').className = 'divInnerLeftButton';
        document.getElementById('divFormsSettingsButton').className = 'divInnerLeftButton';

        document.getElementById('divNewTenantFormsSettingsButton').className = 'divInnerLeftButtonSelected';

        document.getElementById('divOrgRolesButton').className = 'divInnerLeftButton';

        document.getElementById('divMonitoringToolsButton').className = 'divInnerLeftButton';
    } catch (e) {
        console.log('Exception in disableFormsSettingsButton(): ' + e.message + ', ' + e.stack);
    }
}

function disableFormsSettingsButton() {
    try {
        console.log('In disableFormsSettingsButton().');
        document.getElementById('divBehaviorButton').className = 'divInnerLeftButton';
        //document.getElementById('divFunctionalAreasButton').className = 'divInnerLeftButton';
        //document.getElementById('divDepartmentsButton').className = 'divInnerLeftButton';
        document.getElementById('divParticipantsButton').className = 'divInnerLeftButton';
        document.getElementById('divWorkflowSettingsButton').className = 'divInnerLeftButton';
        document.getElementById('divWorkflowEditorSettingsButton').className = 'divInnerLeftButton';
        document.getElementById('divChecklistsSettingsButton').className = 'divInnerLeftButton';
        document.getElementById('divFormsSettingsButton').className = 'divInnerLeftButtonSelected';
        document.getElementById('divOrgRolesButton').className = 'divInnerLeftButton';

        document.getElementById('divMonitoringToolsButton').className = 'divInnerLeftButton';
    } catch (e) {
        console.log('Exception in disableFormsSettingsButton(): ' + e.message + ', ' + e.stack);
    }
}



function renderConfigurationSettings() {
    try {
        console.log('In renderConfigurationSettings().');
        var thiz = this;
        $('#bwQuickLaunchMenuTd').css({
            width: '0'
        }); // This gets rid of the jumping around.

        try {
            $('#FormsEditorToolbox').dialog('close');
        } catch (e) { }

        var canvas = document.getElementById("myCanvas");
        if (canvas) {
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines
            canvas.style.zIndex = -1;
        }

        // This is where we set defaults for configurations that haven't been done yet.
        //if (emailNotificationLevel == '') emailNotificationLevel == 'alldiscourse';

        //if (emailNotificationFrequency == '') emailNotificationFrequency = 'immediately'; //immediately, aggregatedaily, aggregatetwicedaily
        //if (emailNotificationTypes == '') emailNotificationTypes = 'allnotifications'; //allnotifications, onlymytasknotifications



        if (newBudgetRequestManagerTitle == '') newBudgetRequestManagerTitle = 'Manager';



        $('#divPageContent3').empty(); // Clear the div and rebuild it with out new 'Departments' title.
        //$('#divFunctionalAreasMasterSubMenuDiv').hide(); //This si the top bar which we want to hide in this case.

        var html = '';
        html += '<table style="border-width: 0px; margin: 0px; padding: 0px; width: 100%;"><tbody><tr style="border-width: 0px; margin: 0px; padding: 0px;"><td style="border-width: 0px; margin: 0px; padding: 0px;">';



        //var workflowTitleBlueTopHeaderBarWorkflowTitle = document.getElementsByClassName('divTopBarTextContents_WorkflowTitle');
        //html += 'Settings: <span style="font-weight:bold;color:#95b1d3;">Configure "' + workflowAppTitle + '" settings...</span>';
        html += 'Settings: <span style="font-weight:bold;color:#95b1d3;">Configure "' + 'New User/Tenant' + '" settings...</span>';



        html += '</td></tr></tbody></table>';
        $('#divPageContent3').html(html);
        //
        //disableDepartmentsButton();
        //disableWorkflowSettingsButton();
        //
        //$('#divFunctionalAreasButton').css({'background-color':'#6682b5'});
        //
        //$('#divWorkflows').css({ 'height': '28px', 'width': '82%', 'white-space': 'nowrap', 'border-radius': '0 0 0 0', 'padding': '12px 0 0 20px', 'margin': '0 0 0 20px', 'border-width': '0 0 0 0', 'background-color': '#6682b5' });
        //
        //$('#divFunctionalAreasSubSubMenus').empty();
        //var data = {
        //    "bwParticipantId": participantId
        //};
        //$.ajax({
        //    url: appweburl + "/bwworkflowapps/listallforparticipant",
        //    type: "DELETE",
        //    contentType: 'application/json',
        //    data: JSON.stringify(data),
        //    success: function (data) {
        //        var html = '';
        //        html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
        //        html += '  <tr>';
        //        html += '    <td>';
        //        html += '        <span style="font-size:small;font-style:italic;">The following section is incomplete, but will be completed soon!</span>';
        //        html += '            <br /><br />';
        //        //html += '        <span id="spanDepartmentTitle" ></span>:&nbsp;<input id="txtBwDepartmentUserName" /><input id="txtBwDepartmentUserId" />&nbsp;&nbsp;<input type="button" value="Save" id="btnSaveAccountingDepartmentUser" onclick="cmdSaveAccountingDepartmentUser();" />';

        //        html += 'Click here to create a new workflow. (maximum of 10)<br />';
        //        html += 'Title:&nbsp;<input type="text" id="txtWorkflowAppTitle" />&nbsp;<input type="button" value="Create the Workflow" onclick="cmdAddAWorkflowApp();" />';
        //        html += '<br /><br /><br /><br />';

        //        html += 'You are the owner of the following workflows:';
        //        for (var i = 0; i < data.length; i++) {
        //            if (data[i][0] == 'true') {
        //                html += '<br />';
        //                if (data[i][3] == '') html += 'notitle';
        //                else html += data[i][3];
        //            }
        //        }

        //        html += '<br /><br /><br />';


        //        html += 'You are a participant in these workflows:';
        //        for (var i = 0; i < data.length; i++) {
        //            if (data[i][0] != 'true') {
        //                html += '<br />';
        //                if (data[i][3] == '') html += 'notitle';
        //                else html += data[i][3];
        //            }
        //        }

        //        html += '<br /><br />';
        //        html += '<i>workflow name</i>';
        //        html += '&nbsp;&nbsp;&nbsp;&nbsp;';
        //        html += '<i>workflow owner</i>';
        //        html += '';
        //        html += '';
        //        html += '    </td>';
        //        html += '  </tr>';
        //        html += '</table>';
        //        $('#divFunctionalAreasSubSubMenus').html(html);
        //    },
        //    error: function (data, errorCode, errorMessage) {
        //        //window.waitDialog.close();
        //        //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
        //        displayAlertDialog('Error in my.js.cmdListAllParticipants():' + errorCode + ', ' + errorMessage);
        //    }
        //});

        var html = '';



        html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
        html += '  <tr>';
        html += '    <td>';


        //html += '<h2>Settings Editor</h2>';
        html += '<table style="width:100%;">';
        html += '   <tr>';
        html += '       <td>';
        html += '           <h2>';
        html += '           Settings Editor: <span style="color:#95b1d3;">Configure "' + 'New User/Tenant' + '" settings...</span>'; // Velvet Morning is #95b1d3. This was the pantone color of the day for December 9, 2019! :D
        html += '           </h2>';
        html += '       </td>';
        html += '       <td style="text-align:right;">';
        html += '           <span class="printButton" title="print" onclick="cmdPrintForm();">&#x1f5a8;</span>';
        html += '       </td>';
        html += '   </tr>';
        html += '</table>';




        // Request Type section.
        html += '<div id="divBwRequestTypeEditor"></div>';
        html += '<br /><br />';




        //html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
        //html += '  <tr>';
        //html += '    <td>';
        //html += '        <span id="configurationBehaviorTurnOffEmailSlider_Description" style="font-size:normal;">[configurationBehaviorTurnOffEmailSlider_Description]</span>';
        //html += '    </td></tr>';
        //html += '</table>';
        //html += '<table>';
        //html += '  <tr>';
        //html += '    <td style="text-align:left;vertical-align:middle;" class="bwSliderTitleCell">';
        //html += '       Sending email:&nbsp;';
        //html += '    </td>';
        //html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
        //html += '       <table>';
        //html += '           <tr>';
        //html += '               <td>';
        //html += '                   <label for="configurationBehaviorTurnOffEmailSlider"></label><input type="checkbox" name="configurationBehaviorTurnOffEmailSlider" id="configurationBehaviorTurnOffEmailSlider" />';
        //html += '               </td>';
        //html += '               <td>';
        //html += '                   &nbsp;&nbsp;';
        //html += '               </td>';
        //html += '               <td>';
        //html += '                   <span id="configurationBehaviorTurnOffEmailSlider_CurrentStatus">[configurationBehaviorTurnOffEmailSlider_CurrentStatus]</span>';
        //html += '               </td>';
        //html += '           </tr>';
        //html += '       </table>';
        //html += '    </td>';
        //html += '  </tr>';
        //html += '</table>';


        //html += '<br />';



        html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
        html += '  <tr>';
        html += '    <td>';
        html += '        &nbsp;';
        html += '    </td>';
        html += '  </tr>';
        html += '  <tr>';
        html += '    <td>';
        html += '        <span style="font-size:small;font-style:italic;">The title of the organization is displayed throughout, and also appears in email communications.</span>';
        html += '    </td>';
        html += '  </tr>';
        html += '</table>';
        html += '<table>';
        html += '  <tr>';
        html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
        html += '       Organization title:&nbsp;';
        html += '    </td>';
        html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
        html += '       <input id="txtWorkflowAppTitle" type="text" value="" style="width:200px;padding:5px 5px 5px 5px;" />';
        html += '       &nbsp;&nbsp;<input style="padding:5px 10px 5px 10px;" type="button" value="Publish" onclick="cmdSaveWorkflowTitle();" />';
        html += '    </td>';
        html += '  </tr>';

        html += '  <tr>';
        html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
        html += '       Organization theme/colors xcx1-1:&nbsp;';
        html += '    </td>';
        html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
        html += '       <input disabled="" id="txtWorkflowAppTitle_Theme" type="text" value="" style="width:200px;padding:5px 5px 5px 5px;" />';
        html += '       &nbsp;&nbsp;<input disabled="" style="padding:5px 10px 5px 10px;" type="button" value="Publish" onclick="cmdSaveWorkflowTitle();" />';
        html += '    </td>';
        html += '  </tr>';

        html += '</table>';



        // Current fiscal year
        html += '<br /><br />';
        html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
        html += '  <tr>';
        html += '    <td>';
        html += '        &nbsp;';
        html += '    </td>';
        html += '  </tr>';
        html += '  <tr>';
        html += '    <td>';
        html += '        <span style="font-size:small;font-style:italic;">This is the default selection for "Fiscal Year".</span>';
        html += '    </td>';
        html += '  </tr>';
        html += '</table>';
        html += '<table>';
        html += '  <tr>';
        html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
        html += '       Current fiscal year:&nbsp;';
        html += '    </td>';
        html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
        html += '       <input id="txtWorkflowAppTitlexcx2" type="text" value="2021" style="width:70px;padding:5px 5px 5px 5px;" />';
        html += '       &nbsp;&nbsp;<input style="padding:5px 10px 5px 10px;" type="button" value="Publish" onclick="alert(\'This functionality is incomplete. Coming soon!\');" />'; //cmdSaveWorkflowTitlexx();" />';
        html += '    </td>';
        html += '  </tr>';
        html += '</table>';



        html += '<br /><br />';

        html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
        html += '  <tr>';
        html += '    <td>';
        html += '        &nbsp;';
        html += '    </td>';
        html += '  </tr>';
        html += '  <tr>';
        html += '    <td>';
        html += '        <span style="font-size:small;font-style:italic;">Business operating hours.</span>';
        html += '    </td>';
        html += '  </tr>';
        html += '</table>';
        html += '<table>';
        html += '  <tr>';
        html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
        html += '       Operating hours:&nbsp;';
        html += '    </td>';
        html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
        //html += '       <input id="txtWorkflowAppTitle_GetSharePointData" type="text" value="" style="width:200px;padding:5px 5px 5px 5px;" />';
        //html += '       &nbsp;&nbsp;<input style="padding:5px 10px 5px 10px;" type="button" value="GET SP DATA" onclick="cmdGetSharePointData();" />';
        html += '<div id="divBwOperationalHours"></div>';
        html += '    </td>';
        html += '  </tr>';
        html += '</table>';

        html += '<br /><br />';


        html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
        html += '  <tr>';
        html += '    <td>';
        html += '        &nbsp;';
        html += '    </td>';
        html += '  </tr>';
        html += '  <tr>';
        html += '    <td>';
        html += '        <span style="font-size:small;font-style:italic;">This is a test of accessing SharePoint data in Azure.</span>';
        html += '    </td>';
        html += '  </tr>';
        html += '</table>';
        html += '<table>';
        html += '  <tr>';
        html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
        html += '       Click the button:&nbsp;';
        html += '    </td>';
        html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
        html += '       <input id="txtWorkflowAppTitle_GetSharePointData" type="text" value="" style="width:200px;padding:5px 5px 5px 5px;" />';
        html += '       &nbsp;&nbsp;<input style="padding:5px 10px 5px 10px;" type="button" value="GET SP DATA" onclick="cmdGetSharePointData();" />';
        html += '    </td>';
        html += '  </tr>';
        html += '</table>';








        // Currency selection.
        html += '<br /><br />';
        html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
        html += '  <tr>';
        html += '    <td>';
        html += '        <span style="font-size:small;font-style:italic;">The currency symbol is displayed throughout.</span>';
        html += '    </td></tr>';
        html += '</table>';
        html += '<table>';
        html += '  <tr>';
        html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
        html += '       Currency symbol:&nbsp;';
        html += '    </td>';
        html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
        html += '       <select style="padding:5px 5px 5px 5px;" id="selectBudgetRequestCurrencySymbol">';
        html += '           <option value="Dollar" selected>$ - Dollar ($ 9.99)</option>'; // This is the default.
        html += '           <option value="Pound">£ - Pound (£ 9.99)</option>';
        html += '           <option value="Euro">€ - Euro (€ 9.99)</option>';
        html += '           <option value="Franc">₣ - Franc (₣ 9.99)</option>';

        html += '           <option value="Icelandic króna">kr - Icelandic króna (ISK) (kr 9,99)</option>'; // <a title="Icelandic króna" href="https://en.wikipedia.org/wiki/Icelandic_kr%C3%B3na">Icelandic króna (ISK)</a>
        //  <entry code="ISK" unicode-decimal="107, 114" unicode-hex="6b, 72">Iceland Krona</entry>

        html += '           <option value="Rand">R - Rand (R 9.99)</option>';
        html += '           <option value="Yen">¥ - Yen (¥ 9.99)</option>';
        html += '           <option value="Rouble">₽ - Rouble (₽ 9.99)</option>';
        html += '           <option value="Peso">₱ - Peso (₱ 9.99)</option>';
        html += '           <option value="Rupee">₹ - Rupee (₹ 9.99)</option>';
        html += '           <option value="Guilder">ƒ - Guilder (ƒ 9.99)</option>';
        html += '       </select>';
        html += '    </td>';
        html += '  </tr>';
        html += '</table>';


        // old event: selectBudgetRequestTitleFormat









        // put it all here!

        html += '<br /><br />';
        html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
        html += '  <tr>';
        html += '    <td>';
        html += '        <span style="font-size:small;font-style:italic;">The title of the budget requests is displayed throughout, and also appears in email communications.</span>';
        html += '    </td></tr>';
        html += '</table>';
        html += '<table>';
        html += '  <tr>';
        html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
        html += '       Budget request title format:&nbsp;';
        html += '    </td>';
        html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
        //html += '       <input id="txtBudgetRequestTitlePrefix" type="text" value="[BR/SR]-YY#####" style="width:200px;" contentEditable="false" />';

        // Here are some ideas for the Title!
        // [BR/SR]YY#####
        // [BR/SR]#####YY
        // [AR/SR]YY#####
        // [AR/SR]#####YY
        html += '       <select style="padding:5px 5px 5px 5px;" id="selectBudgetRequestTitleFormat">';
        html += '           <option value="[BR/SR/CP/QR/RR/RE/WO]YY#####" selected>[BR/SR/CP/QR/RR/RE/WO]YY#####</option>';
        html += '           <option value="[BR/SR/CP/QR/RR/RE/WO]#####YY">[BR/SR/CP/QR/RR/RE/WO]#####YY</option>';
        html += '           <option value="[BR/SR/CP/QR/RR/RE/WO]YY#####">[BR/SR/CP/QR/RR/RE/WO]YY#####</option>';
        html += '           <option value="[BR/SR/CP/QR/RR/RE/WO]#####YY">[BR/SR/CP/QR/RR/RE/WO]#####YY</option>';
        html += '       </select>';

        //html += '       &nbsp;&nbsp;<input type="button" value="Save" onclick="cmdSaveBudgetRequestTitlePrefix();" />';
        html += '    </td>';
        html += '  </tr>';
        html += '</table>';

        html += '<br /><br />';
        html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
        html += '  <tr>';
        html += '    <td>';
        html += '        <span style="font-size:small;font-style:italic;">Specifying a user here enables the PO# issuing process. When a Budget Request has been completely approved, this user will issue a Purchase Order Number from your accounting system, and the Budget Request will be marked as Active.</span>';
        html += '    </td></tr>';
        html += '</table>';
        html += '<table>';
        html += '  <tr>';
        html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
        html += '       <span id="spanDepartmentTitle"></span>:&nbsp;';
        html += '    </td>';
        html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
        html += '       <input style="padding:5px 5px 5px 5px;" id="txtBwDepartmentUserName" onfocus="this.blur();" contenteditable="false" onclick="cmdDisplayPeoplePickerDialog(\'txtBwDepartmentUserName\', \'txtBwDepartmentUserId\', \'txtBwDepartmentUserEmail\', \'btnSaveRemoveAccountingDepartmentUser\');" title="" />';
        html += '       <input id="txtBwDepartmentUserId" style="display:none;" />';
        html += '       <input id="txtBwDepartmentUserEmail" style="display:none;" />';
        html += '       &nbsp;<img src="images/addressbook-icon18x18.png" onclick="cmdDisplayPeoplePickerDialog(\'txtBwDepartmentUserName\', \'txtBwDepartmentUserId\', \'txtBwDepartmentUserEmail\', \'btnSaveRemoveAccountingDepartmentUser\');" style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" />';
        //html += '       &nbsp;&nbsp;<input type="button" value="Save" id="btnSaveAccountingDepartmentUser" onclick="cmdSaveAccountingDepartmentUser();" />';
        html += '       &nbsp;&nbsp;<span id="spanSaveAccountingDepartmentUserButton"></span>';
        html += '    </td>';
        html += '  </tr>';
        html += '</table>';











        html += '<br /><br />';
        html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
        html += '  <tr>';
        html += '    <td>';
        html += '        <span style="font-size:small;font-style:italic;">The title of the person responsible for completing the details of a New Request. This is displayed on the Budget Request forms. The default is "Manager".</span>';
        html += '    </td></tr>';
        html += '</table>';
        html += '<table>';
        html += '  <tr>';
        html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
        html += '       Manager title:&nbsp;';
        html += '    </td>';
        html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
        html += '       <input style="padding:5px 5px 5px 5px;" id="NewBudgetRequestManagerTitle" type="text" value="' + newBudgetRequestManagerTitle + '" />';
        html += '       &nbsp;&nbsp;<input style="padding:5px 10px 5px 10px;" type="button" value="Publish" onclick="cmdSaveNewRequestManagerTitle();" />';
        html += '    </td>';
        html += '  </tr>';
        html += '</table>';



        html += '<br /><br />';













        html += '<table>';

        html += '<tr>';
        html += '  <td>';
        // Create the drop down at the top of the page, and select the last used option!
        //debugger;
        var requestTypes = bwEnabledRequestTypes.EnabledItems;
        //var requestTypes1 = $('.bwOrganizationEditor').bwOrganizationEditor('getBwEnabledRequestTypes'); // .EnabledItems; //this.options.bwEnabledRequestTypes.EnabledItems;
        //var requestTypes = requestTypes1.EnabledItems;

        var bwLastSelectedNewRequestType = 'capitalplanproject';
        if (requestTypes.length == 1) { // If there is only one, don't display as a drop down, just as plain text.
            html += '<span style="font-size:small;font-style:italic;">The following settings apply to: </span>';
        } else { // There is more than 1, so we have to display as a drop down.
            html += '<span style="font-size:small;font-style:italic;">The following settings apply to: </span>';
        }
        html += '  </td>';
        html += '  <td>';

        // Render the drop down at the top of the page, and select the last used option!
        var bwLastSelectedNewRequestType = 'all';
        if (requestTypes.length == 1) { // If there is only one, don't display as a drop down, just as plain text.
            html += '<span style="font_weight:bold;color:black;"><strong>' + requestTypes[0][1] + '</strong></span>';
        } else { // There is more than 1, so we have to display as a drop down.
            html += '<span style="font_weight:bold;color:black;"><strong>';
            html += '   <select id="selectSettingsRequestTypeDropDown" onchange="selectSettingsRequestTypeDropDown_Onchange(\'selectSettingsRequestTypeDropDown\');" style=\'border-color: whitesmoke; color: rgb(38, 38, 38); font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 14pt; font-weight: bold; cursor: pointer;\'>'; // was .5em
            html += '<option value="' + 'All request types' + '" selected >' + 'All request types' + '</option>';
            for (var i = 0; i < requestTypes.length; i++) {
                if (requestTypes[i][0] == bwLastSelectedNewRequestType) { // Selected
                    html += '<option value="' + requestTypes[i][0] + '" selected >' + requestTypes[i][1] + '</option>';
                } else { // Not selected
                    html += '<option value="' + requestTypes[i][0] + '">' + requestTypes[i][1] + '</option>';
                }
            }
            html += '   </select>';
            html += '</span>';
        }

        //html += '&nbsp;&nbsp;<span style="font-weight:normal;font-style:italic;color:grey;"><input id="WorkflowForAllRequestTypesCheckbox" type="checkbox" checked="checked" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'WorkflowForAllRequestTypesCheckbox_Onchange\');" />All request types inherit this workflow</span>';

        html += '  </td>';
        html += '</tr>';
        // 
        html += '<tr>';
        html += '  <td>';
        html += '  </td>';
        html += '  <td>';
        html += '    <span id="spanWorkflowsDropDownList"></span>';
        html += '  </td>';
        html += '</tr>';

        html += '</table>';










        html += '<table>';
        //html += '<tr>';
        //html += '   <td style="text-align:left;" class="bwSliderTitleCell">';
        //html += '       Require start/end dates on new requests:';
        //html += '   </td>';
        //html += '   <td class="bwChartCalculatorLightCurrencyTableCell">';
        //html += '       <label for="configurationBehaviorRequireStartEndDatesSlider"></label><input type="checkbox" name="configurationBehaviorRequireStartEndDatesSlider" id="configurationBehaviorRequireStartEndDatesSlider" />';
        //html += '   </td>';
        //html += '</tr>';
        //html += '<tr><td>&nbsp;</td><td></td></tr>';

        //html += '<tr>';
        //html += '   <td style="text-align:left;" class="bwSliderTitleCell">';
        //html += '       Require that a new request has some details:';
        //html += '   </td>';
        //html += '   <td class="bwChartCalculatorLightCurrencyTableCell">';
        //html += '       <label for="configurationBehaviorRequireDetailsSlider"></label><input type="checkbox" name="configurationBehaviorRequireDetailsSlider" id="configurationBehaviorRequireDetailsSlider" />';
        //html += '   </td>';
        //html += '</tr>';
        //html += '<tr><td>&nbsp;</td><td></td></tr>';

        //html += '<tr>';
        //html += '    <td colspan="2">';
        //html += '<span style="font-size:small;font-style:italic;"></span>';
        //html += '    </td>';
        //html += '</tr>';
        //html += '<tr>';
        //html += '   <td style="text-align:left;" class="bwSliderTitleCell">';
        //html += '       Require attachments on new requests:';
        //html += '   </td>';
        //html += '   <td class="bwChartCalculatorLightCurrencyTableCell">';
        //html += '       <label for="configurationBehaviorEnableNewRequestAttachmentsSlider"></label><input type="checkbox" name="configurationBehaviorEnableNewRequestAttachmentsSlider" id="configurationBehaviorEnableNewRequestAttachmentsSlider" />';
        //html += '   </td>';
        //html += '</tr>';
        //html += '<tr><td>&nbsp;</td><td></td></tr>';

        //html += '<tr>';
        //html += '    <td colspan="2">';
        //html += '<span style="font-size:small;font-style:italic;"></span>';
        //html += '    </td>';
        //html += '</tr>';
        //html += '<tr>';
        //html += '   <td style="text-align:left;" class="bwSliderTitleCell">';
        //html += '       Require barcodes:';
        //html += '   </td>';
        //html += '   <td class="bwChartCalculatorLightCurrencyTableCell">';
        //html += '       <label for="configurationBehaviorEnableNewRequestBarcodeAttachmentsSlider"></label><input type="checkbox" name="configurationBehaviorEnableNewRequestBarcodeAttachmentsSlider" id="configurationBehaviorEnableNewRequestBarcodeAttachmentsSlider" />';
        //html += '   </td>';
        //html += '</tr>';
        //html += '<tr><td>&nbsp;</td><td></td></tr>';

        //html += '<tr>';
        //html += '   <td style="text-align:left;" class="bwSliderTitleCell">';
        //html += '       Enable quoting:';
        //html += '   </td>';
        //html += '   <td class="bwChartCalculatorLightCurrencyTableCell">';
        //html += '       <label for="configurationBehaviorEnableQuotingSlider"></label><input type="checkbox" name="configurationBehaviorEnableQuotingSlider" id="configurationBehaviorEnableQuotingSlider" />';
        //html += '   </td>';
        //html += '</tr>';
        //html += '<tr><td>&nbsp;</td><td></td></tr>';


        //html += '<tr>';
        //html += '   <td style="text-align:left;" class="bwSliderTitleCell">';
        //html += '       Enable reimbursement requests:';
        //html += '   </td>';
        //html += '   <td class="bwChartCalculatorLightCurrencyTableCell">';
        //html += '       <label for="configurationBehaviorEnableReimbursementRequestsSlider"></label><input type="checkbox" name="configurationBehaviorEnableReimbursementRequestsSlider" id="configurationBehaviorEnableReimbursementRequestsSlider" />';
        //html += '   </td>';
        //html += '</tr>';
        //html += '<tr><td>&nbsp;</td><td></td></tr>';




        // Capital expenses are part of the bronze package.
        //if (gWorkflowLicenseStatus == 'bronze' || gWorkflowLicenseStatus == 'silver' || gWorkflowLicenseStatus == 'gold') {
        html += '<tr>';
        html += '   <td style="text-align:left;" class="bwSliderTitleCell">';
        html += '       Enable capital and expense tracking:';
        html += '   </td>';
        html += '   <td class="bwChartCalculatorLightCurrencyTableCell">';
        html += '       <label for="configurationBehaviorEnableCapitalAndExpenseTrackingSlider"></label><input type="checkbox" name="configurationBehaviorEnableCapitalAndExpenseTrackingSlider" id="configurationBehaviorEnableCapitalAndExpenseTrackingSlider" />';
        //if (recurringExpensesEnabled) {
        //    html += '<span id="spanRecurringExpensesChoiceOnFixedDates"><input type="radio" name="rbRecurringExpensesChoice" /><span>recurring on fixed dates</span></span><br />';
        //    html += '<span id="spanRecurringExpensesChoiceOnATimePeriod"><input type="radio" name="rbRecurringExpensesChoice" /><span>recurring on a time period</span></span><br />';
        //} else {
        //    html += '<span id="spanRecurringExpensesChoiceOnFixedDates"><input type="radio" name="rbRecurringExpensesChoice" disabled /><span style="color: #adadad;">recurring on fixed dates</span></span><br />';
        //    html += '<span id="spanRecurringExpensesChoiceOnATimePeriod"><input type="radio" name="rbRecurringExpensesChoice" disabled /><span style="color: #adadad;">recurring on a time period</span></span><br />';
        //}
        html += '   </td>';
        html += '</tr>';
        html += '<tr><td>&nbsp;</td><td></td></tr>';
        //}


        // Recurring expenses are part of the silver package.
        //if (gWorkflowLicenseStatus == 'silver' || gWorkflowLicenseStatus == 'gold') {
        //    html += '<tr>';
        //    html += '   <td style="text-align:left;" class="bwSliderTitleCell">';
        //    html += '       Enable recurring expenses:';
        //    html += '   </td>';
        //    html += '   <td class="bwChartCalculatorLightCurrencyTableCell">';
        //    html += '       <label for="configurationBehaviorEnableRecurringExpensesSlider"></label><input type="checkbox" name="configurationBehaviorEnableRecurringExpensesSlider" id="configurationBehaviorEnableRecurringExpensesSlider" />';
        //    //if (recurringExpensesEnabled) {
        //    //    html += '<span id="spanRecurringExpensesChoiceOnFixedDates"><input type="radio" name="rbRecurringExpensesChoice" /><span>recurring on fixed dates</span></span><br />';
        //    //    html += '<span id="spanRecurringExpensesChoiceOnATimePeriod"><input type="radio" name="rbRecurringExpensesChoice" /><span>recurring on a time period</span></span><br />';
        //    //} else {
        //    //    html += '<span id="spanRecurringExpensesChoiceOnFixedDates"><input type="radio" name="rbRecurringExpensesChoice" disabled /><span style="color: #adadad;">recurring on fixed dates</span></span><br />';
        //    //    html += '<span id="spanRecurringExpensesChoiceOnATimePeriod"><input type="radio" name="rbRecurringExpensesChoice" disabled /><span style="color: #adadad;">recurring on a time period</span></span><br />';
        //    //}
        //    html += '   </td>';
        //    html += '</tr>';
        //    html += '<tr><td>&nbsp;</td><td></td></tr>';
        //}

        // Supplementals are part of the gold package.
        //if (gWorkflowLicenseStatus == 'gold') {
        html += '<tr>';
        html += '   <td style="text-align:left;" class="bwSliderTitleCell">';
        html += '       Enable addendums to existing requests (supplementals):';
        html += '   </td>';
        html += '   <td class="bwChartCalculatorLightCurrencyTableCell">';
        html += '       <label for="configurationBehaviorEnableSupplementalsSlider"></label><input type="checkbox" name="configurationBehaviorEnableSupplementalsSlider" id="configurationBehaviorEnableSupplementalsSlider" />';
        //html += '<input type="radio" />recurring on fixed dates<br />';
        //html += '<input type="radio" />recurring on a time period<br />';
        html += '   </td>';
        html += '</tr>';
        html += '<tr><td>&nbsp;</td><td></td></tr>';
        //}


        html += '<tr>';
        html += '   <td style="text-align:left;" class="bwSliderTitleCell">';
        html += '       Enable closeouts:';
        html += '   </td>';
        html += '   <td class="bwChartCalculatorLightCurrencyTableCell">';
        html += '       <label for="configurationBehaviorEnableCloseOutsSlider"></label><input type="checkbox" name="configurationBehaviorEnableCloseOutsSlider" id="configurationBehaviorEnableCloseOutsSlider" />';
        html += '   </td>';
        html += '</tr>';
        html += '<tr><td>&nbsp;</td><td></td></tr>';



        //if (gWorkflowLicenseStatus == 'gold') {
        html += '<tr>';
        html += '    <td colspan="2">';
        html += '<span style="font-size:small;font-style:italic;">This ensures that deleted items are retained for future reference. This functionality is incomplete. Coming soon!</span>';
        html += '    </td>';
        html += '</tr>';
        html += '<tr>';
        html += '   <td style="text-align:left;" class="bwSliderTitleCell">';
        html += '       Enable strict auditing controls:';
        html += '   </td>';
        html += '   <td class="bwChartCalculatorLightCurrencyTableCell">';
        html += '       <label for="configurationBehaviorEnableStrictAuditingSlider"></label><input type="checkbox" name="configurationBehaviorEnableStrictAuditingSlider" id="configurationBehaviorEnableStrictAuditingSlider" />';
        html += '   </td>';
        html += '</tr>';
        html += '<tr><td>&nbsp;</td><td></td></tr>';
        //}
        html += '</table>';

        html += '<br /><br />';






        //// Request Type section.
        //html += '<div id="divBwRequestTypeEditor"></div>';
        //html += '<br /><br />';

        // Project Type section.
        html += '<br />';
        html += '<div id="divBwProjectTypeEditor"></div>';
        html += '<br /><br />';

        // Pillar Type section.
        html += '<div id="divBwPillarTypeEditor"></div>';
        html += '<br /><br />';



        html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
        html += '  <tr>';
        html += '    <td>';
        html += '        <span style="font-size:small;font-style:italic;">If you have purchased licenses, you can add them here.</span>';
        html += '    </td></tr>';
        html += '</table>';
        html += '<table>';
        html += '  <tr>';
        html += '    <td style="text-align:left;vertical-align:middle;" class="bwSliderTitleCell">';
        html += '       License:&nbsp;';
        html += '    </td>';
        html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
        html += '       <input id="txtLicense" type="text" value="" style="width:270px;padding:5px 5px 5px 5px;" onkeyup="kupValidateLicenseFormat();" onchange="kupValidateLicenseFormat();" />';
        html += '       &nbsp;&nbsp;';
        html += '       <input type="button" id="btnAddNewLicense" value="Add" onclick="cmdAddNewLicense();" disabled style="cursor:pointer;padding:5px 10px 5px 10px;" />';
        //html += '       <input type="button" id="btnPurchaseNewLicense" value="Purchase" onclick="alert(\'xThis functionality is incomplete. Coming soon!\');" style="cursor:pointer;padding:5px 10px 5px 10px;" />';
        html += '       <span id="spanLicenseStatus"></span>';
        // Todd: Do we want this? no it is already here above or below not sure
        //html += '       <br /><span style="font-size:small;"><i>You currently have no licenses.</i></span>';
        //html += '       <br /><span style="font-size:small;"><i><a href="javascript:cmdUpgradeAndPricingOptions();">Click here to learn about your upgrade options.</a></i></span>';
        html += '    </td>';
        html += '  </tr>';
        html += '  <tr>';
        html += '    <td>';
        html += '    </td>';
        html += '    <td style="text-align:right;">';
        html += '      <span style="font-size:small;font-style:italic;text-align:right;"><i><a href="javascript:cmdUpgradeAndPricingOptions2();">Click here to learn about your upgrade options.</a></i></span>';
        html += '';
        html += '    </td>';
        html += '  </tr>';
        html += '  <tr>';
        html += '    <td colspan="2">';
        html += '      <div id="divPackagesForSale"></div>';
        html += '    </td>';
        html += '  </tr>';
        //html += '  <tr>';
        //html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
        //html += '       Package level:&nbsp;';
        //html += '    </td>';
        //html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
        //html += tenantPackage + '&nbsp;&nbsp;';
        //html += '    </td>';
        //html += '  </tr>';
        html += '</table>';









        //html += '<br /><br />';


        //html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
        //html += '  <tr>';
        //html += '    <td>';
        //html += '        <span style="font-size:small;font-style:italic;">Import REQUESTS from Sql Server (BETA).</span>';
        //html += '    </td></tr>';
        //html += '</table>';
        //html += '<table>';
        //html += '  <tr>';
        //html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
        //html += '       <input type="button" id="btnConnectToSqlServer" value="Import Requests from Sql Server" onclick="cmdImportRequestsFromSqlServer();" style="cursor:pointer;padding:5px 10px 5px 10px;" />';
        //html += '    </td>';
        //html += '  </tr>';
        //html += '</table>';










        //html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
        //html += '  <tr>';
        //html += '    <td>';
        ////html += '        <span style="font-size:small;font-style:italic;">The title of the person responsible for completing the details of a New Request. This is displayed on the Budget Request forms. The default is "Manager".</span>';
        //html += '    </td></tr>';
        //html += '</table>';
        //html += '<table>';
        //html += '  <tr>';
        //html += '    <td style="text-align:left;vertical-align:top;" class="bwSliderTitleCell">';
        //html += '       Project Types:&nbsp;';
        //html += '    </td>';
        //html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';

        //html += '<style>';
        //html += '.dataGridTable { border: 1px solid gainsboro; font-size:14px; font-family: "Helvetica Neue","Segoe UI",Helvetica,Verdana,sans-serif; }';
        //html += '.dataGridTable td { border-left: 0px; border-right: 1px solid gainsboro; }';
        //html += '.headerRow { background-color:white; color:gray;border-bottom:1px solid gainsboro; }';
        //html += '.headerRow td { border-bottom:1px solid gainsboro; padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
        //html += '.filterRow td { border-bottom:1px solid whitesmoke; padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
        //html += '.alternatingRowLight { background-color:white; }';
        //html += '.alternatingRowLight td { padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
        //html += '.alternatingRowLight:hover { background-color:lightgoldenrodyellow; }';
        //html += '.alternatingRowDark { background-color:whitesmoke; }';
        //html += '.alternatingRowDark td { padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
        //html += '.alternatingRowDark:hover { background-color:lightgoldenrodyellow; }';
        //html += '</style>';

        //html += '<table class="dataGridTable">';
        //html += '  <tr class="headerRow">';
        //html += '    <td>Abbreviation</td>';
        //html += '    <td>Description</td>';
        //html += '    <td></td>';
        //html += '    <td></td>';
        //html += '  </tr>';

        //var projectTypesJson = [];
        //var projectType1 = {
        //    ProjectTypeId: '112-22234-455-61',
        //    Abbreviation: 'ENV',
        //    Description: 'Environmental'
        //}
        //var projectType2 = {
        //    ProjectTypeId: '112-22234-455-62',
        //    Abbreviation: 'EQ',
        //    Description: 'Equipment'
        //}
        //var projectType3 = {
        //    ProjectTypeId: '112-22234-455-63',
        //    Abbreviation: 'IN',
        //    Description: 'Innovation'
        //}
        //projectTypesJson.push(projectType1);
        //projectTypesJson.push(projectType2);
        //projectTypesJson.push(projectType3);

        //var alternatingRow = 'light'; // Use this to color the rows.
        //for (var i = 0; i < projectTypesJson.length; i++) {
        //    if (alternatingRow == 'light') {
        //        html += '  <tr class="alternatingRowLight" style="cursor:pointer;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayParticipantRoleMultiPickerInACircle\', true, \'' + 'btnEditRaciRoles_' + 'xx' + '\', \'' + 'xx' + '\', \'' + 'xx' + '\', \'' + 'xx' + '\');">';
        //        alternatingRow = 'dark';
        //    } else {
        //        html += '  <tr class="alternatingRowDark" style="cursor:pointer;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayParticipantRoleMultiPickerInACircle\', true, \'' + 'btnEditRaciRoles_' + 'xx' + '\', \'' + 'xx' + '\', \'' + 'xx' + '\', \'' + 'xx' + '\');">';
        //        alternatingRow = 'light';
        //    }
        //    html += '    <td>' + projectTypesJson[i].Abbreviation + '</td>';
        //    html += '    <td>' + projectTypesJson[i].Description + '</td>';
        //    html += '    <td><button class="BwSmallButton" onclick="cmdDisplayChangeUserRoleDialogx(\'' + 'xx' + '\');">edit</button></td>';
        //    html += '    <td><img src="images/trash-can.png" onclick="cmdDisplayDeleteUserDialogx(\'' + 'xx' + '\');" title="Delete" style="cursor:pointer;" /></td>';

        //    html += '  </tr>';
        //}
        //html += '</table>';
        //html += '<br />';
        //html += '<input style="padding:5px 10px 5px 10px;" id="btnCreateRole2" onclick="$(\'.bwCircleDialog\').bwCircleDialog(\'displayAddANewPersonInACirclexx\', true);" type="button" value="Add a Project type...">';
        //// end: Project Type section.








        html += '    </td>';
        html += '  </tr>';
        html += '</table>';



        //html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
        //html += '  <tr>';
        //html += '    <td>';
        //html += '        <span id="configurationBehaviorTurnOffEmailSlider_Description" style="font-size:small;font-style:italic;">[configurationBehaviorTurnOffEmailSlider_Description]</span>';
        //html += '    </td></tr>';
        //html += '</table>';
        //html += '<table>';
        //html += '  <tr>';
        //html += '    <td style="text-align:left;vertical-align:middle;" class="bwSliderTitleCell">';
        //html += '       Enable email:&nbsp;';
        //html += '    </td>';
        //html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
        //html += '       <table>';
        //html += '           <tr>';
        //html += '               <td>';
        //html += '                   <label for="configurationBehaviorTurnOffEmailSlider"></label><input type="checkbox" name="configurationBehaviorTurnOffEmailSlider" id="configurationBehaviorTurnOffEmailSlider" />';
        //html += '               </td>';
        //html += '               <td>';
        //html += '                   &nbsp;&nbsp;';
        //html += '               </td>';
        //html += '               <td>';
        //html += '                   <span id="configurationBehaviorTurnOffEmailSlider_CurrentStatus">[configurationBehaviorTurnOffEmailSlider_CurrentStatus]</span>';
        //html += '               </td>';
        //html += '           </tr>';
        //html += '       </table>';
        //html += '    </td>';
        //html += '  </tr>';
        //html += '</table>';








        //html += '<br />';

        //html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
        //html += '  <tr>';
        //html += '    <td>';
        //html += '        <span style="font-size:small;font-style:italic;">If you have purchased licenses, you can add them here.</span>';
        //html += '    </td></tr>';
        //html += '</table>';
        //html += '<table>';
        //html += '  <tr>';
        //html += '    <td style="text-align:left;vertical-align:middle;" class="bwSliderTitleCell">';
        //html += '       License:&nbsp;';
        //html += '    </td>';
        //html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
        //html += '       <input id="txtLicense" type="text" value="" style="width:270px;padding:5px 5px 5px 5px;" onkeyup="kupValidateLicenseFormat();" onchange="kupValidateLicenseFormat();" />';
        //html += '       &nbsp;&nbsp;';
        //html += '       <input type="button" id="btnAddNewLicense" value="Add" onclick="cmdAddNewLicense();" disabled style="cursor:pointer;padding:5px 10px 5px 10px;" />';
        ////html += '       <input type="button" id="btnPurchaseNewLicense" value="Purchase" onclick="alert(\'xThis functionality is incomplete. Coming soon!\');" style="cursor:pointer;padding:5px 10px 5px 10px;" />';
        //html += '       <span id="spanLicenseStatus"></span>';
        //// Todd: Do we want this? no it is already here above or below not sure
        ////html += '       <br /><span style="font-size:small;"><i>You currently have no licenses.</i></span>';
        ////html += '       <br /><span style="font-size:small;"><i><a href="javascript:cmdUpgradeAndPricingOptions();">Click here to learn about your upgrade options.</a></i></span>';
        //html += '    </td>';
        //html += '  </tr>';
        //html += '  <tr>';
        //html += '    <td>';
        //html += '    </td>';
        //html += '    <td style="text-align:right;">';
        //html += '      <span style="font-size:small;font-style:italic;text-align:right;"><i><a href="javascript:cmdUpgradeAndPricingOptions2();">Click here to learn about your upgrade options.</a></i></span>';
        //html += '';
        //html += '    </td>';
        //html += '  </tr>';
        //html += '  <tr>';
        //html += '    <td colspan="2">';
        //html += '      <div id="divPackagesForSale"></div>';
        //html += '    </td>';
        //html += '  </tr>';
        ////html += '  <tr>';
        ////html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
        ////html += '       Package level:&nbsp;';
        ////html += '    </td>';
        ////html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
        ////html += tenantPackage + '&nbsp;&nbsp;';
        ////html += '    </td>';
        ////html += '  </tr>';
        //html += '</table>';












        html += '';
        html += '    </td>';
        html += '  </tr>';
        html += '</table>';
        html += '<br /><br />';
        //$('#divPageContent3').append(html); // 
        $('#divFunctionalAreasSubSubMenus').append(html);

        //var divBwRequestTypeEditor = document.getElementById('divBwRequestTypeEditor'); // 4-1-2020 12-28pm adt.
        //if (!divBwRequestTypeEditor) { // for some reason this gets added twice to the DOM. Figure this out someday, but for now this seems to fix it and is a good safety I suppose.
        //    divBwRequestTypeEditor = document.createElement('div');
        //    divBwRequestTypeEditor.id = 'divBwRequestTypeEditor';
        //    document.body.appendChild(divBwRequestTypeEditor); // to place at end of document
        //}
        $('#divBwRequestTypeEditor').bwRequestTypeEditor_NewTenant({}); // divBwRequestTypeEditor

        //var bwWorkflowEditor_NewTenant = document.getElementById('divBwWorkflowEditor_NewTenant'); // 4-1-2020 12-28pm adt.
        //if (!bwWorkflowEditor_NewTenant) { // for some reason this gets added twice to the DOM. Figure this out someday, but for now this seems to fix it and is a good safety I suppose.
        //    bwWorkflowEditor_NewTenant = document.createElement('div');
        //    bwWorkflowEditor_NewTenant.id = 'divBwWorkflowEditor_NewTenant';
        //    document.body.appendChild(bwWorkflowEditor_NewTenant); // to place at end of document
        //}
        //$('#divBwWorkflowEditor_NewTenant').bwWorkflowEditor_NewTenant({});

        var projectTypeEditorOptions = {};
        $('#divBwProjectTypeEditor').bwProjectTypeEditor(projectTypeEditorOptions);

        var pillarTypeEditorOptions = {};
        $('#divBwPillarTypeEditor').bwPillarTypeEditor(pillarTypeEditorOptions);

        var operationalHoursOptions = {};
        $('#divBwOperationalHours').bwOperationalHours(operationalHoursOptions);



        //$('#spanDepartmentTitle').text('Procurement');
        $('#spanDepartmentTitle').text('Procurement');




        var configurationBehaviorTipsOptions = {
            checked: tipsDisplayOn,
            show_labels: true,         // Should we show the on and off labels?
            labels_placement: "left",  // Position of the labels: "both", "left" or "right"
            on_label: "ON",            // Text to be displayed when checked
            off_label: "OFF",          // Text to be displayed when unchecked
            width: 50,                 // Width of the button in pixels
            height: 22,                // Height of the button in pixels
            button_width: 24,         // Width of the sliding part in pixels
            clear_after: null         // Override the element after which the clearing div should be inserted 
        };
        $("input#configurationBehaviorTipsSlider").switchButton(configurationBehaviorTipsOptions);

        //var configurationBehaviorRequireStartEndDatesOptions = {
        //    checked: requireStartEndDates,
        //    show_labels: true,         // Should we show the on and off labels?
        //    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
        //    on_label: "YES",            // Text to be displayed when checked
        //    off_label: "NO",          // Text to be displayed when unchecked
        //    width: 50,                 // Width of the button in pixels
        //    height: 22,                // Height of the button in pixels
        //    button_width: 24,         // Width of the sliding part in pixels
        //    clear_after: null         // Override the element after which the clearing div should be inserted
        //};
        //$("input#configurationBehaviorRequireStartEndDatesSlider").switchButton(configurationBehaviorRequireStartEndDatesOptions);

        //var configurationBehaviorRequireDetailsOptions = {
        //    checked: requireRequestDetails,
        //    show_labels: true,         // Should we show the on and off labels?
        //    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
        //    on_label: "YES",            // Text to be displayed when checked
        //    off_label: "NO",          // Text to be displayed when unchecked
        //    width: 50,                 // Width of the button in pixels
        //    height: 22,                // Height of the button in pixels
        //    button_width: 24,         // Width of the sliding part in pixels
        //    clear_after: null         // Override the element after which the clearing div should be inserted 
        //};
        //$("input#configurationBehaviorRequireDetailsSlider").switchButton(configurationBehaviorRequireDetailsOptions);

        //var configurationBehaviorEnableNewRequestAttachmentsOptions = {
        //    checked: enableNewRequestAttachments,
        //    show_labels: true,         // Should we show the on and off labels?
        //    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
        //    on_label: "YES",            // Text to be displayed when checked
        //    off_label: "NO",          // Text to be displayed when unchecked
        //    width: 50,                 // Width of the button in pixels
        //    height: 22,                // Height of the button in pixels
        //    button_width: 24,         // Width of the sliding part in pixels
        //    clear_after: null         // Override the element after which the clearing div should be inserted 
        //};
        //$("input#configurationBehaviorEnableNewRequestAttachmentsSlider").switchButton(configurationBehaviorEnableNewRequestAttachmentsOptions);


        //configurationBehaviorEnableNewRequestBarcodeAttachmentsSlider
        //var configurationBehaviorEnableNewRequestBarcodeAttachmentsOptions = {
        //    checked: enableNewRequestBarcodeAttachments,
        //    show_labels: true,         // Should we show the on and off labels?
        //    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
        //    on_label: "YES",            // Text to be displayed when checked
        //    off_label: "NO",          // Text to be displayed when unchecked
        //    width: 50,                 // Width of the button in pixels
        //    height: 22,                // Height of the button in pixels
        //    button_width: 24,         // Width of the sliding part in pixels
        //    clear_after: null         // Override the element after which the clearing div should be inserted 
        //};
        //$("input#configurationBehaviorEnableNewRequestBarcodeAttachmentsSlider").switchButton(configurationBehaviorEnableNewRequestBarcodeAttachmentsOptions);



        //debugger;
        try {
            var configurationBehaviorEnableBudgetRequestsOptions = {
                checked: bwEnabledRequestTypes.Details.BudgetRequests.Enabled, //quotingEnabled,
                show_labels: true,         // Should we show the on and off labels?
                labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                on_label: "YES",            // Text to be displayed when checked
                off_label: "NO",          // Text to be displayed when unchecked
                width: 50,                 // Width of the button in pixels
                height: 22,                // Height of the button in pixels
                button_width: 24,         // Width of the sliding part in pixels
                clear_after: null         // Override the element after which the clearing div should be inserted 
            };
            $("input#configurationBehaviorEnableBudgetRequestsSlider").switchButton(configurationBehaviorEnableBudgetRequestsOptions);

            var configurationBehaviorEnableCapitalPlanProjectsOptions = {
                checked: bwEnabledRequestTypes.Details.CapitalPlanProjects.Enabled, //quotingEnabled,
                show_labels: true,         // Should we show the on and off labels?
                labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                on_label: "YES",            // Text to be displayed when checked
                off_label: "NO",          // Text to be displayed when unchecked
                width: 50,                 // Width of the button in pixels
                height: 22,                // Height of the button in pixels
                button_width: 24,         // Width of the sliding part in pixels
                clear_after: null         // Override the element after which the clearing div should be inserted 
            };
            $("input#configurationBehaviorEnableCapitalPlanProjectsSlider").switchButton(configurationBehaviorEnableCapitalPlanProjectsOptions);

            var configurationBehaviorEnableQuotingOptions = {
                checked: bwEnabledRequestTypes.Details.QuoteRequests.Enabled, //quotingEnabled,
                show_labels: true,         // Should we show the on and off labels?
                labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                on_label: "YES",            // Text to be displayed when checked
                off_label: "NO",          // Text to be displayed when unchecked
                width: 50,                 // Width of the button in pixels
                height: 22,                // Height of the button in pixels
                button_width: 24,         // Width of the sliding part in pixels
                clear_after: null         // Override the element after which the clearing div should be inserted 
            };
            $("input#configurationBehaviorEnableQuotingSlider").switchButton(configurationBehaviorEnableQuotingOptions);


            var configurationBehaviorEnableReimbursementRequestsOptions = {
                checked: bwEnabledRequestTypes.Details.ReimbursementRequests.Enabled, //reimbursementRequestsEnabled,
                show_labels: true,         // Should we show the on and off labels?
                labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                on_label: "YES",            // Text to be displayed when checked
                off_label: "NO",          // Text to be displayed when unchecked
                width: 50,                 // Width of the button in pixels
                height: 22,                // Height of the button in pixels
                button_width: 24,         // Width of the sliding part in pixels
                clear_after: null         // Override the element after which the clearing div should be inserted 
            };
            $("input#configurationBehaviorEnableReimbursementRequestsSlider").switchButton(configurationBehaviorEnableReimbursementRequestsOptions);

            var configurationBehaviorEnableRecurringExpensesOptions = {
                checked: bwEnabledRequestTypes.Details.RecurringExpenses.Enabled, //recurringExpensesEnabled,
                show_labels: true,         // Should we show the on and off labels?
                labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                on_label: "YES",            // Text to be displayed when checked
                off_label: "NO",          // Text to be displayed when unchecked
                width: 50,                 // Width of the button in pixels
                height: 22,                // Height of the button in pixels
                button_width: 24,         // Width of the sliding part in pixels
                clear_after: null         // Override the element after which the clearing div should be inserted 
            };
            $("input#configurationBehaviorEnableRecurringExpensesSlider").switchButton(configurationBehaviorEnableRecurringExpensesOptions);

            var configurationBehaviorEnableWorkOrdersOptions = {
                checked: bwEnabledRequestTypes.Details.WorkOrders.Enabled, //recurringExpensesEnabled,
                show_labels: true,         // Should we show the on and off labels?
                labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                on_label: "YES",            // Text to be displayed when checked
                off_label: "NO",          // Text to be displayed when unchecked
                width: 50,                 // Width of the button in pixels
                height: 22,                // Height of the button in pixels
                button_width: 24,         // Width of the sliding part in pixels
                clear_after: null         // Override the element after which the clearing div should be inserted 
            };
            $("input#configurationBehaviorEnableWorkOrdersSlider").switchButton(configurationBehaviorEnableWorkOrdersOptions);
        } catch (e) {
            console.log('Exception in my.js.renderConfigurationSettings(). This try/catch is to help solve the problem. bwEnabledRequestTypes.Details is undefined... : ' + e.message + ', ' + e.stack);
        }

        var configurationBehaviorEnableCloseOutsOptions = {
            checked: closeoutsEnabled,
            show_labels: true,         // Should we show the on and off labels?
            labels_placement: "left",  // Position of the labels: "both", "left" or "right"
            on_label: "YES",            // Text to be displayed when checked
            off_label: "NO",          // Text to be displayed when unchecked
            width: 50,                 // Width of the button in pixels
            height: 22,                // Height of the button in pixels
            button_width: 24,         // Width of the sliding part in pixels
            clear_after: null         // Override the element after which the clearing div should be inserted 
        };
        $("input#configurationBehaviorEnableCloseOutsSlider").switchButton(configurationBehaviorEnableCloseOutsOptions);

        var configurationBehaviorEnableCapitalAndExpenseTrackingOptions = {
            checked: capitalAndExpenseTrackingEnabled,
            show_labels: true,         // Should we show the on and off labels?
            labels_placement: "left",  // Position of the labels: "both", "left" or "right"
            on_label: "YES",            // Text to be displayed when checked
            off_label: "NO",          // Text to be displayed when unchecked
            width: 50,                 // Width of the button in pixels
            height: 22,                // Height of the button in pixels
            button_width: 24,         // Width of the sliding part in pixels
            clear_after: null         // Override the element after which the clearing div should be inserted 
        };
        $("input#configurationBehaviorEnableCapitalAndExpenseTrackingSlider").switchButton(configurationBehaviorEnableCapitalAndExpenseTrackingOptions);


        var configurationBehaviorEnableSupplementalsOptions = {
            checked: supplementalsEnabled,
            show_labels: true,         // Should we show the on and off labels?
            labels_placement: "left",  // Position of the labels: "both", "left" or "right"
            on_label: "YES",            // Text to be displayed when checked
            off_label: "NO",          // Text to be displayed when unchecked
            width: 50,                 // Width of the button in pixels
            height: 22,                // Height of the button in pixels
            button_width: 24,         // Width of the sliding part in pixels
            clear_after: null         // Override the element after which the clearing div should be inserted 
        };
        $("input#configurationBehaviorEnableSupplementalsSlider").switchButton(configurationBehaviorEnableSupplementalsOptions);

        var configurationBehaviorEnableStrictAuditingOptions = {
            checked: strictAuditingEnabled,
            show_labels: true,         // Should we show the on and off labels?
            labels_placement: "left",  // Position of the labels: "both", "left" or "right"
            on_label: "YES",            // Text to be displayed when checked
            off_label: "NO",          // Text to be displayed when unchecked
            width: 50,                 // Width of the button in pixels
            height: 22,                // Height of the button in pixels
            button_width: 24,         // Width of the sliding part in pixels
            clear_after: null         // Override the element after which the clearing div should be inserted 
        };
        $("input#configurationBehaviorEnableStrictAuditingSlider").switchButton(configurationBehaviorEnableStrictAuditingOptions);


        //if (emailEnabled == true) {
        //    var html = '';
        //    html += '<span style="font-size:small;font-style:italic;">';
        //    html += 'Turning off email may be desired if the ADMIN is processing requests, or experimenting with the system. The ADMIN will continue to receive email notifications.';
        //    html += '</span>';
        //    document.getElementById('configurationBehaviorTurnOffEmailSlider_Description').innerHTML = html;
        //    //
        //    var html = '';
        //    //html += '<span style="color:green;">';
        //    //html += 'xx emails have been sent so far today.';

        //    html += '                   &nbsp;&nbsp;';
        //    html += '                   <input type="button" value="View all emails..." onclick="cmdViewAllEmails();" style="cursor:pointer;padding:5px 10px 5px 10px;" />';

        //    //html += '</span>';
        //    document.getElementById('configurationBehaviorTurnOffEmailSlider_CurrentStatus').innerHTML = html;
        //} else {
        //    var html = '';
        //    html += '<span style="color:red;font-size:small;font-style:italic;">';
        //    html += 'Turning off email may be desired if the ADMIN is processing requests, or experimenting with the system. The ADMIN will continue to receive email notifications.';
        //    html += '</span>';
        //    document.getElementById('configurationBehaviorTurnOffEmailSlider_Description').innerHTML = html;
        //    //
        //    var html = '';
        //    //html += '<span style="color:red;">';
        //    //html += 'There are xx unsent emails.';

        //    html += '                   &nbsp;&nbsp;';
        //    html += '                   <input type="button" value="View unsent emails..." onclick="cmdViewUnsentEmails();" style="cursor:pointer;padding:5px 10px 5px 10px;" />';
        //    html += '                   &nbsp;&nbsp;';
        //    html += '                   <input type="button" value="View all emails..." onclick="cmdViewAllEmails();" style="cursor:pointer;padding:5px 10px 5px 10px;" />';

        //    //html += '</span>';
        //    document.getElementById('configurationBehaviorTurnOffEmailSlider_CurrentStatus').innerHTML = html;
        //}
        //var configurationBehaviorTurnOffEmailOptions = {
        //    checked: emailEnabled,
        //    show_labels: true,         // Should we show the on and off labels?
        //    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
        //    on_label: '<span style="color:green;font-weight:bold;">ON</span>',            // Text to be displayed when checked
        //    off_label: '<span style="color:red;font-weight:bold;">OFF</span>',          // Text to be displayed when unchecked
        //    width: 50,                 // Width of the button in pixels
        //    height: 22,                // Height of the button in pixels
        //    button_width: 24,         // Width of the sliding part in pixels
        //    clear_after: null         // Override the element after which the clearing div should be inserted 
        //};
        //$("input#configurationBehaviorTurnOffEmailSlider").switchButton(configurationBehaviorTurnOffEmailOptions);


        document.getElementById('selectBudgetRequestCurrencySymbol').value = selectedCurrencySymbol;

        $('#txtWorkflowAppTitle').val(workflowAppTitle);
        $('#txtWorkflowAppTitle_GetSharePointData').val(workflowAppTitle);
        $('#txtWorkflowAppTitle_Theme').val(workflowAppTitle);








        // Display the licenses.
        //displayAlertDialog('Display the licenses.');
        if (globalLicenses.length > 0) {
            var lHtml = '';
            for (var i = 0; i < globalLicenses.length; i++) {
                lHtml += '<br /><span style="font-size:x-small;color:gray;">' + globalLicenses[i][2] + '</span>&nbsp;&nbsp;'; // The license key (guid).
                lHtml += '<span style="font-size:small;font-style:italic;">This ' + globalLicenses[i][1] + ' license is good until ' + globalLicenses[i][4] + '.</span>';
            }
            document.getElementById('spanLicenseStatus').innerHTML = lHtml;
        }





        // Hook up the events.

        //selectBudgetRequestCurrencySymbol
        $('#selectBudgetRequestCurrencySymbol').change(function () {
            // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
            //displayAlertDialog('This functionality is not complete. Currently there is only the default currency symbol.');


            // Todd: Finish this!!
            //document.getElementById('selectBudgetRequestCurrencySymbol').selectedIndex = 0; // This just forces it to always be the top selection for the time being.





            // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
            //if (selectedCurrencySymbol == '') selectedCurrencySymbol = 'Dollar';



            var selectedCurrencySymbol = document.getElementById('selectBudgetRequestCurrencySymbol').value;
            var data = [];
            data = {
                bwTenantId: tenantId,
                bwWorkflowAppId: workflowAppId,
                //bwNewBudgetRequestManagerTitle: managerTitle
                bwSelectedCurrencySymbol: selectedCurrencySymbol
            };
            var operationUri = webserviceurl + "/bwworkflowapp/updateworkflowconfigurationselectedcurrencysymbol"; // "/bwworkflowapp/updateworkflowconfigurationnewbudgetrequestmanagertitle";
            $.ajax({
                url: operationUri,
                type: "POST", timeout: ajaxTimeout,
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    if (data != 'SUCCESS') {
                        displayAlertDialog(data);
                    } else {
                        //bwSelectedCurrencySymbol = selectedCurrencySymbol;
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in my.js.selectBudgetRequestCurrencySymbol.change(): ' + errorCode + ' ' + errorMessage);
                }
            });

        });



        //selectBudgetRequestTitleFormat
        $('#selectBudgetRequestTitleFormat').change(function () {
            // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
            displayAlertDialog('This functionality is not complete. Currently there is only the default Title format.');

            // Todd: Finish this!!
            document.getElementById('selectBudgetRequestTitleFormat').selectedIndex = 0; // This just forces it to always be the top selection for the time being.
        });



        $('#configurationBehaviorTipsSlider').change(function () {
            // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
            if (tipsDisplayOn == true) tipsDisplayOn = false;
            else tipsDisplayOn = true;
            var _userDetails = [];
            _userDetails = {
                bwParticipantId: participantId,
                bwTipsDisplayOn: tipsDisplayOn.toString()
            };
            var operationUri = webserviceurl + "/bwparticipant/updateuserconfigurationbehaviorTipsDisplay";
            $.ajax({
                url: operationUri,
                type: "POST", timeout: ajaxTimeout,
                data: _userDetails,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    if (data != 'SUCCESS') {
                        displayAlertDialog(data);
                    } else {
                        // Apply Participant configurations to the display.
                        //debugger;
                        if (tipsDisplayOn == true) {
                            $('#spanAlertLink').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                            $('#spanAlertLinkNewRequest').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                            $('#spanAlertLinkMyStuff').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                            $('#spanAlertLinkSummary').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                            $('#spanAlertLinkConfiguration').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                            $('#spanAlertLinkHelp').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                        } else {
                            $('#spanAlertLink').html('&nbsp;');
                            $('#spanAlertLinkNewRequest').html('&nbsp;');
                            $('#spanAlertLinkMyStuff').html('&nbsp;');
                            $('#spanAlertLinkSummary').html('&nbsp;');
                            $('#spanAlertLinkConfiguration').html('&nbsp;');
                            $('#spanAlertLinkHelp').html('&nbsp;');
                        }
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in my.js.configurationBehaviorTipsSlider.change(): ' + errorCode + ' ' + errorMessage);
                }
            });
        });

        $('#configurationBehaviorRequireStartEndDatesSlider').change(function () {
            // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
            if (requireStartEndDates == true) requireStartEndDates = false;
            else requireStartEndDates = true;
            var _workflowDetails = [];
            _workflowDetails = {
                bwWorkflowAppId: workflowAppId,
                bwRequireStartEndDates: requireStartEndDates.toString()
            };
            var operationUri = webserviceurl + "/bwworkflow/updateworkflowconfigurationbehaviorrequirestartenddates";
            $.ajax({
                url: operationUri,
                type: "POST", timeout: ajaxTimeout,
                data: _workflowDetails,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    if (data != 'SUCCESS') {
                        displayAlertDialog(data);
                    } else {
                        // Apply Workflow configurations to the display.
                        //displayAlertDialog('This setting has been changed but the value does not load from the database when the app is loaded. DEV: fix this var=requireStartEndDates, and it needs to load when the worklflow data is loaded.');
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in my.js.configurationBehaviorRequireStartEndDatesSlider.change(): ' + errorCode + ' ' + errorMessage);
                }
            });
        });

        $('#configurationBehaviorRequireDetailsSlider').change(function () {
            // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
            if (requireRequestDetails == true) requireRequestDetails = false;
            else requireRequestDetails = true;
            var _workflowDetails = [];
            _workflowDetails = {
                bwWorkflowAppId: workflowAppId,
                bwRequireRequestDetails: requireRequestDetails.toString()
            };
            var operationUri = webserviceurl + "/bwworkflow/updateworkflowconfigurationbehaviorrequirerequestdetails";
            $.ajax({
                url: operationUri,
                type: "POST", timeout: ajaxTimeout,
                data: _workflowDetails,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    if (data != 'SUCCESS') {
                        displayAlertDialog(data);
                    } else {
                        // Apply Workflow configurations to the display.
                        //displayAlertDialog('This setting has been changed but the value does not load from the database when the app is loaded. DEV: fix this var=requireRequestDetails, and it needs to load when the worklflow data is loaded.');
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in my.js.configurationBehaviorRequireDetailsSlider.change(): ' + errorCode + ' ' + errorMessage);
                }
            });
        });

        $('#configurationBehaviorEnableNewRequestAttachmentsSlider').change(function () {
            if (enableNewRequestAttachments == true) enableNewRequestAttachments = false;
            else enableNewRequestAttachments = true;
            var proceed = true;
            var turnOffReimbursementRequests = false; // This is our dependency flag.
            if (reimbursementRequestsEnabled == true && enableNewRequestAttachments == false) {
                proceed = confirm('Reimbursement Requests will be turned off as well, because attachments are required for this functionality.\n\n\nClick the OK button to proceed...');
                if (proceed == true) {
                    turnOffReimbursementRequests = true;
                }
            }

            if (proceed == true) {
                // Check for the dependency flag.
                if (turnOffReimbursementRequests == true) {
                    //reimbursementRequestsEnabled = false;
                    //displayAlertDialog('reimbursementRequestsEnabled: ' + reimbursementRequestsEnabled);
                    $("input#configurationBehaviorEnableReimbursementRequestsSlider").switchButton({ checked: false });
                }
                // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
                var _workflowDetails = [];
                _workflowDetails = {
                    bwWorkflowAppId: workflowAppId,
                    bwEnableNewRequestAttachments: enableNewRequestAttachments.toString()
                };
                var operationUri = webserviceurl + "/bwworkflow/updateworkflowconfigurationbehaviorenablenewrequestattachments";
                $.ajax({
                    url: operationUri,
                    type: "POST", timeout: ajaxTimeout,
                    data: _workflowDetails,
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    },
                    success: function (data) {
                        if (data != 'SUCCESS') {
                            displayAlertDialog(data);
                        } else {
                            //displayAlertDialog('Updated enableNewRequestAttachments in DB: ' + enableNewRequestAttachments);
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        displayAlertDialog('Error in my.js.configurationBehaviorEnableNewRequestAttachmentsSlider.change():2: ' + errorCode + ' ' + errorMessage);
                    }
                });
            }
        });

        $('#configurationBehaviorEnableNewRequestBarcodeAttachmentsSlider').change(function () {
            // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
            if (enableNewRequestBarcodeAttachments == true) enableNewRequestBarcodeAttachments = false;
            else enableNewRequestBarcodeAttachments = true;
            var _workflowDetails = [];
            _workflowDetails = {
                bwWorkflowAppId: workflowAppId,
                bwEnableNewRequestBarcodeAttachments: enableNewRequestBarcodeAttachments.toString()
            };
            var operationUri = webserviceurl + "/bwworkflow/updateworkflowconfigurationbehaviorenablenewrequestbarcodeattachments";
            $.ajax({
                url: operationUri,
                type: "POST", timeout: ajaxTimeout,
                data: _workflowDetails,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    if (data != 'SUCCESS') {
                        displayAlertDialog(data);
                    } else {
                        // Apply Workflow configurations to the display.
                        //displayAlertDialog('This setting has been changed but the value does not load from the database when the app is loaded. DEV: fix this var=enableNewRequestAttachments, and it needs to load when the worklflow data is loaded.');
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in my.js.configurationBehaviorEnableNewRequestBarcodeAttachmentsSlider.change(): ' + errorCode + ' ' + errorMessage);
                }
            });
        });


        $('#configurationBehaviorEnableQuotingSlider').change(function () {
            // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
            if (quotingEnabled == true) quotingEnabled = false;
            else quotingEnabled = true;
            var _workflowDetails = [];
            _workflowDetails = {
                bwWorkflowAppId: workflowAppId,
                bwQuotingEnabled: quotingEnabled.toString()
            };
            var operationUri = webserviceurl + "/bwworkflow/updateworkflowconfigurationbehaviorquotingenabled";
            $.ajax({
                url: operationUri,
                type: "POST", timeout: ajaxTimeout,
                data: _workflowDetails,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    if (data != 'SUCCESS') {
                        displayAlertDialog(data);
                    } else {
                        // Apply Workflow configurations to the display.
                        //displayAlertDialog('This setting has been changed but the value does not load from the database when the app is loaded. DEV: fix this var=quotingEnabled, and it needs to load when the worklflow data is loaded.');
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in my.js.configurationBehaviorEnableQuotingSlider.change(): ' + errorCode + ' ' + errorMessage);
                }
            });
        });



        $('#configurationBehaviorEnableReimbursementRequestsSlider').change(function () {
            if (reimbursementRequestsEnabled == true) reimbursementRequestsEnabled = false;
            else reimbursementRequestsEnabled = true;
            var proceed = true;
            var turnOnAttachments = false; // This is our dependency flag.
            if (enableNewRequestAttachments == false && reimbursementRequestsEnabled == true) {
                proceed = confirm('Attachments will be enabled because they are needed by the Reimbursement Request process.\n\n\nClick the OK button to proceed...');
                if (proceed == true) {
                    turnOnAttachments = true;
                }
            }

            if (proceed == true) {
                // Check for the dependency flag.
                if (turnOnAttachments == true) {
                    //enableNewRequestAttachments = true;
                    //displayAlertDialog('enableNewRequestAttachments: ' + enableNewRequestAttachments);
                    $("input#configurationBehaviorEnableNewRequestAttachmentsSlider").switchButton({ checked: true });
                }
                // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
                var _workflowDetails = [];
                _workflowDetails = {
                    bwWorkflowAppId: workflowAppId,
                    bwExpenseRequestsEnabled: reimbursementRequestsEnabled.toString()
                };
                var operationUri = webserviceurl + "/bwworkflow/updateworkflowconfigurationbehaviorexpenserequestsenabled";
                $.ajax({
                    url: operationUri,
                    type: "POST", timeout: ajaxTimeout,
                    data: _workflowDetails,
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    },
                    success: function (data) {
                        if (data != 'SUCCESS') {
                            displayAlertDialog(data);
                        } else {
                            //displayAlertDialog('Updated reimbursementRequestsEnabled in DB: ' + reimbursementRequestsEnabled);
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        displayAlertDialog('Error in my.js.configurationBehaviorEnableReimbursementRequestsSlider.change():2: ' + errorCode + ' ' + errorMessage);
                    }
                });
            }
        });


        // configurationBehaviorEnableCloseOutsSlider
        $('#configurationBehaviorEnableCloseOutsSlider').change(function () {
            // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
            if (closeoutsEnabled == true) closeoutsEnabled = false;
            else closeoutsEnabled = true;
            var _workflowDetails = [];
            _workflowDetails = {
                bwWorkflowAppId: workflowAppId,
                bwCloseoutsEnabled: closeoutsEnabled.toString()
            };
            var operationUri = webserviceurl + "/bwworkflow/updateworkflowconfigurationbehaviorcloseoutsenabled";
            $.ajax({
                url: operationUri,
                type: "POST", timeout: ajaxTimeout,
                data: _workflowDetails,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    if (data != 'SUCCESS') {
                        displayAlertDialog(data);
                    } else {
                        // Apply Workflow configurations to the display.
                        //displayAlertDialog('This setting has been changed but the value does not load from the database when the app is loaded. DEV: fix this var=quotingEnabled, and it needs to load when the worklflow data is loaded.');
                        //displayAlertDialog('This functionality is incomplete. Coming soon! my.js.configurationBehaviorEnableCloseOutsSlider.change().');
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in my.js.configurationBehaviorEnableCloseOutsSlider.change(): ' + errorCode + ' ' + errorMessage);
                }
            });
        });

        $('#configurationBehaviorEnableCapitalAndExpenseTrackingSlider').change(function () {
            // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
            if (capitalAndExpenseTrackingEnabled == true) capitalAndExpenseTrackingEnabled = false;
            else capitalAndExpenseTrackingEnabled = true;
            var _workflowDetails = [];
            _workflowDetails = {
                bwWorkflowAppId: workflowAppId,
                bwCapitalAndExpenseTrackingEnabled: capitalAndExpenseTrackingEnabled.toString()
            };
            var operationUri = webserviceurl + "/bwworkflow/updateworkflowconfigurationbehaviorcapitalandexpensetrackingenabled";
            $.ajax({
                url: operationUri,
                type: "POST", timeout: ajaxTimeout,
                data: _workflowDetails,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    if (data != 'SUCCESS') {
                        displayAlertDialog(data);
                    } else {
                        // Apply Workflow configurations to the display.
                        //displayAlertDialog('This functionality is incomplete. Coming soon! my.js.configurationBehaviorEnableCapitalAndExpenseTrackingSlider.change().');
                        //displayAlertDialog('capitalAndExpenseTrackingEnabled: ' + capitalAndExpenseTrackingEnabled);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in my.js.configurationBehaviorEnableCapitalAndExpenseTrackingSlider.change(): ' + errorCode + ' ' + errorMessage);
                }
            });
        });

        $('#configurationBehaviorEnableRecurringExpensesSlider').change(function () {
            // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
            if (recurringExpensesEnabled == true) recurringExpensesEnabled = false;
            else recurringExpensesEnabled = true;
            var _workflowDetails = [];
            _workflowDetails = {
                bwWorkflowAppId: workflowAppId,
                bwRecurringExpensesEnabled: recurringExpensesEnabled.toString()
            };
            var operationUri = webserviceurl + "/bwworkflow/updateworkflowconfigurationbehaviorrecurringexpensesenabled";
            $.ajax({
                url: operationUri,
                type: "POST", timeout: ajaxTimeout,
                data: _workflowDetails,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    try {
                        if (data != 'SUCCESS') {
                            displayAlertDialog(data);
                        } else {
                            // Apply Workflow configurations to the display.
                            //displayAlertDialog('This functionality is incomplete. Coming soon! my.js.configurationBehaviorEnableRecurringExpensesSlider.change().');
                            if (recurringExpensesEnabled) {
                                var html = '<input type="radio" name="rbRecurringExpensesChoice" /><span>recurring on fixed dates</span>';
                                document.getElementById('spanRecurringExpensesChoiceOnFixedDates').innerHTML = html;
                                var html = '<input type="radio" name="rbRecurringExpensesChoice" /><span>recurring on a time period</span>';
                                document.getElementById('spanRecurringExpensesChoiceOnATimePeriod').innerHTML = html;
                            } else {
                                var html = '<input type="radio" name="rbRecurringExpensesChoice" disabled /><span style="color: #adadad;">recurring on fixed dates</span>';
                                document.getElementById('spanRecurringExpensesChoiceOnFixedDates').innerHTML = html;
                                var html = '<input type="radio" name="rbRecurringExpensesChoice" disabled /><span style="color: #adadad;">recurring on a time period</span>';
                                document.getElementById('spanRecurringExpensesChoiceOnATimePeriod').innerHTML = html;
                            }

                        }
                    } catch (e) {
                        console.log('Exception in my.js.configurationBehaviorEnableRecurringExpensesSlider.change(): ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in my.js.configurationBehaviorEnableRecurringExpensesSlider.change(): ' + errorCode + ' ' + errorMessage);
                }
            });
        });

        // configurationBehaviorEnableSupplementalsSlider
        $('#configurationBehaviorEnableSupplementalsSlider').change(function () {
            // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
            if (supplementalsEnabled == true) supplementalsEnabled = false;
            else supplementalsEnabled = true;
            var _workflowDetails = [];
            _workflowDetails = {
                bwWorkflowAppId: workflowAppId,
                bwSupplementalsEnabled: supplementalsEnabled.toString()
            };
            var operationUri = webserviceurl + "/bwworkflow/updateworkflowconfigurationbehaviorsupplementalsenabled";
            $.ajax({
                url: operationUri,
                type: "POST", timeout: ajaxTimeout,
                data: _workflowDetails,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    if (data != 'SUCCESS') {
                        displayAlertDialog(data);
                    } else {
                        // Apply Workflow configurations to the display.
                        //displayAlertDialog('This functionality is incomplete. Coming soon! my.js.configurationBehaviorEnableSupplementalsSlider.change().');
                        //displayAlertDialog('This setting has been changed but the value does not load from the database when the app is loaded. DEV: fix this var=quotingEnabled, and it needs to load when the worklflow data is loaded.');
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in my.js.configurationBehaviorEnableSupplementalsSlider.change(): ' + errorCode + ' ' + errorMessage);
                }
            });
        });

        // configurationBehaviorEnableStrictAuditingSlider
        $('#configurationBehaviorEnableStrictAuditingSlider').change(function () {
            // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
            if (strictAuditingEnabled == true) strictAuditingEnabled = false;
            else strictAuditingEnabled = true;
            var _workflowDetails = [];
            _workflowDetails = {
                bwWorkflowAppId: workflowAppId,
                bwStrictAuditingEnabled: strictAuditingEnabled.toString()
            };
            var operationUri = webserviceurl + "/bwworkflow/updateworkflowconfigurationbehaviorstrictauditingenabled";
            $.ajax({
                url: operationUri,
                type: "POST", timeout: ajaxTimeout,
                data: _workflowDetails,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    if (data != 'SUCCESS') {
                        displayAlertDialog(data);
                    } else {
                        // Apply Workflow configurations to the display.
                        displayAlertDialog('This functionality is incomplete. Coming soon! my.js.configurationBehaviorEnableStrictAuditingSlider.change().');
                        //displayAlertDialog('This setting has been changed but the value does not load from the database when the app is loaded. DEV: fix this var=quotingEnabled, and it needs to load when the worklflow data is loaded.');
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in my.js.configurationBehaviorEnableStrictAuditingSlider.change(): ' + errorCode + ' ' + errorMessage);
                }
            });
        });

        //$('#configurationBehaviorTurnOffEmailSlider').change(function () {
        //    // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
        //    console.log('In configurationBehaviorTurnOffEmailSlider.change(). emailEnabled: ' + emailEnabled);
        //    if (emailEnabled == true) emailEnabled = false;
        //    else emailEnabled = true;
        //    var _workflowDetails = [];
        //    _workflowDetails = {
        //        bwWorkflowAppId: workflowAppId,
        //        bwEmailEnabled: emailEnabled.toString()
        //    };
        //    var operationUri = webserviceurl + "/bwworkflow/updateworkflowconfigurationbehavioremailenabled";
        //    $.ajax({
        //        url: operationUri,
        //        type: "POST", timeout: ajaxTimeout,
        //        data: _workflowDetails,
        //        headers: {
        //            "Accept": "application/json; odata=verbose"
        //        },
        //        success: function (data) {
        //            console.log('In configurationBehaviorTurnOffEmailSlider.change(). ' + data);
        //            if (data != 'SUCCESS') {
        //                displayAlertDialog(data);
        //            } else {
        //                console.log('In configurationBehaviorTurnOffEmailSlider.change(). Set emailEnabled to: ' + emailEnabled);
        //                if (emailEnabled == true) {
        //                    var html = '';
        //                    html += '<span style="font-size:small;font-style:italic;">';
        //                    html += 'Turning off email may be desired if the ADMIN is processing requests, or experimenting with the system. The ADMIN will continue to receive email notifications.';
        //                    html += '</span>';
        //                    document.getElementById('configurationBehaviorTurnOffEmailSlider_Description').innerHTML = html;
        //                    //
        //                    var html = '';
        //                    //html += '<span style="color:green;">';
        //                    //html += 'xx emails have been sent so far today.';

        //                    html += '                   &nbsp;&nbsp;';
        //                    html += '                   <input type="button" value="View all emails..." onclick="cmdViewAllEmails();" style="cursor:pointer;padding:5px 10px 5px 10px;" />';

        //                    //html += '</span>';
        //                    document.getElementById('configurationBehaviorTurnOffEmailSlider_CurrentStatus').innerHTML = html;
        //                } else {
        //                    var html = '';
        //                    html += '<span style="color:red;font-size:small;font-style:italic;">';
        //                    html += 'Turning off email may be desired if the ADMIN is processing requests, or experimenting with the system. The ADMIN will continue to receive email notifications.';
        //                    html += '</span>';
        //                    document.getElementById('configurationBehaviorTurnOffEmailSlider_Description').innerHTML = html;
        //                    //
        //                    var html = '';
        //                    //html += '<span style="color:red;">';
        //                    //html += 'There are xx unsent emails.';

        //                    html += '                   &nbsp;&nbsp;';
        //                    html += '                   <input type="button" value="View unsent emails..." onclick="cmdViewUnsentEmails();" style="cursor:pointer;padding:5px 10px 5px 10px;" />';
        //                    html += '                   &nbsp;&nbsp;';
        //                    html += '                   <input type="button" value="View all emails..." onclick="cmdViewAllEmails();" style="cursor:pointer;padding:5px 10px 5px 10px;" />';

        //                    //html += '</span>';
        //                    document.getElementById('configurationBehaviorTurnOffEmailSlider_CurrentStatus').innerHTML = html;
        //                }
        //            }
        //        },
        //        error: function (data, errorCode, errorMessage) {
        //            displayAlertDialog('Error in my.js.configurationBehaviorTurnOffEmailSlider.change(): ' + errorCode + ' ' + errorMessage);
        //        }
        //    });
        //});

        // Hook up the people picker
        $("#txtBwDepartmentUserName").autocomplete({
            source: function (request, response) {
                //weburl = _spPageContextInfo.siteAbsoluteUrl;
                $.ajax({
                    url: webserviceurl + "/tenant/" + tenantId + "/participants/" + request.term,
                    dataType: "json",
                    success: function (data) {
                        var searchArray = [];
                        for (var i = 0; i < data.participants.length; i++) {
                            searchArray[i] = data.participants[i].participant;
                        }
                        response(searchArray);
                    }
                });
            },
            minLength: 1, // minLength specifies how many characters have to be typed before this gets invoked.
            select: function (event, ui) {
                //log(ui.item ? "Selected: " + ui.item.label : "Nothing selected, input was " + this.value);
                //document.getElementById('btnSearch').disabled = false; // Enable the search button when there is valid content in it.
            },
            open: function () {
                //$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
                //document.getElementById('btnSearch').disabled = true; // Disable the search button until there is valid content in it.
            },
            close: function () {
                //$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                //var searchValue = this.value.split(' ')[0] + ' ' + this.value.split(' ')[1];
                //if (searchValue.indexOf('undefined') > -1) document.getElementById('txtAccountingDepartmentUser').value = '';
                //else document.getElementById('txtAccountingDepartmentUser').value = searchValue; //this.value.split(' ')[0] + ' ' + this.value.split(' ')[1]; // Just shows the Loan Number parameter (removing the borrower name) so it fits in the text box.


                var userName = this.value.split('|')[0];
                var userId = this.value.split('|')[1];

                if (userName.indexOf('undefined') > -1) {
                    //document.getElementById('txtAccountingDepartmentUser').value = '';
                    document.getElementById('txtBwDepartmentUserName').value = '';
                    document.getElementById('txtBwDepartmentUserId').value = '';
                } else {
                    document.getElementById('txtBwDepartmentUserName').value = userName; //this.value.split(' ')[0] + ' ' + this.value.split(' ')[1]; // Just shows the Loan Number parameter (removing the borrower name) so it fits in the text box.
                    document.getElementById('txtBwDepartmentUserId').value = userId;
                    // Enable the button!
                    document.getElementById('btnSaveRemoveAccountingDepartmentUser').disabled = false;
                }
            }
        });



        var data = {
            bwWorkflowAppId: workflowAppId
        };
        $.ajax({
            url: webserviceurl + "/bwdepartments",
            type: "DELETE",
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (data) {
                //displayAlertDialog(JSON.stringify(data));
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].bwDepartmentTitle == 'Procurement') {
                            $('#txtBwDepartmentUserName').val(data[i].bwDepartmentUserName);
                            $('#txtBwDepartmentUserId').val(data[i].bwDepartmentUserId);
                            // Create the button.
                            var html = '';
                            html += '<input style="padding:5px 10px 5px 10px;" id="btnSaveRemoveAccountingDepartmentUser" type="button" value="Remove" onclick="cmdRemoveAccountingDepartmentUser();" />';
                            document.getElementById('spanSaveAccountingDepartmentUserButton').innerHTML = html;
                        }
                    }
                } else {
                    //
                    var html = '';
                    html += '<input style="padding:5px 10px 5px 10px;" id="btnSaveRemoveAccountingDepartmentUser" type="button" value="Save" onclick="cmdSaveAccountingDepartmentUser();" disabled />';
                    document.getElementById('spanSaveAccountingDepartmentUserButton').innerHTML = html;
                }

            },
            error: function (data, errorCode, errorMessage) {
                displayAlertDialog('Error in my.js.renderConfigurationSettings DELETE /bwdepartments:' + errorCode + ', ' + errorMessage);
            }
        });


        // Display the license information on the settings page.
        //renderLicensesOnSettingsPage(); // This is disabled while we look for investors.
    } catch (e) {
        console.log('Exception in renderConfigurationSettings(): ' + e.message + ', ' + e.stack);
    }
}




function renderConfigurationPersonalBehavior() {
    try {
        $('#bwQuickLaunchMenuTd').css({
            width: '0'
        }); // This gets rid of the jumping around.

        try {
            $('#FormsEditorToolbox').dialog('close');
        } catch (e) { }

        var canvas = document.getElementById("myCanvas");
        if (canvas) {
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines
            canvas.style.zIndex = -1;
        }

        // This is where we set defaults for configurations that haven't been done yet.
        //if (emailNotificationLevel == '') emailNotificationLevel == 'alldiscourse';

        //if (emailNotificationFrequency == '') emailNotificationFrequency = 'immediately'; //immediately, aggregatedaily, aggregatetwicedaily
        //if (emailNotificationTypes == '') emailNotificationTypes = 'allnotifications'; //allnotifications, onlymytasknotifications


        if (newBudgetRequestManagerTitle == '') newBudgetRequestManagerTitle = 'Manager';



        $('#divFunctionalAreasMasterDiv').empty(); // Clear the div and rebuild it with out new 'Departments' title.
        $('#divFunctionalAreasMasterSubMenuDiv').hide(); //This si the top bar which we want to hide in this case.

        var html = '';
        html += '<table style="border-width: 0px; margin: 0px; padding: 0px; width: 100%;"><tbody><tr style="border-width: 0px; margin: 0px; padding: 0px;"><td style="border-width: 0px; margin: 0px; padding: 0px;">';
        html += 'Personal/Behavior: <span style="font-weight:bold;color:#95b1d3;">Configure your personal/behavior settings...</span>';
        html += '</td></tr></tbody></table>';
        $('#divFunctionalAreasMasterDiv').html(html);
        //
        //disableDepartmentsButton();
        //disableBehaviorButton();
        //
        //$('#divFunctionalAreasButton').css({'background-color':'#6682b5'});
        //
        //$('#divWorkflows').css({ 'height': '28px', 'width': '82%', 'white-space': 'nowrap', 'border-radius': '0 0 0 0', 'padding': '12px 0 0 20px', 'margin': '0 0 0 20px', 'border-width': '0 0 0 0', 'background-color': '#6682b5' });
        //
        $('#divFunctionalAreasSubSubMenus').empty();

        var html = '';


        //html += '<h2>Personal/Behavior Settings Editor</h2>';
        html += '<table style="width:100%;">';
        html += '   <tr>';
        html += '       <td>';
        html += '           <h2>';
        html += '           Personal/Behavior Settings Editor: <span style="color:#95b1d3;">Configure your personal/behavior settings...</span>'; // Velvet Morning is #95b1d3. This was the pantone color of the day for December 9, 2019! :D
        html += '           </h2>';
        html += '       </td>';
        html += '       <td style="text-align:right;">';
        html += '           <span class="printButton" title="print" onclick="cmdPrintForm();">&#x1f5a8;</span>';
        html += '       </td>';
        html += '   </tr>';
        html += '</table>';


        html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';

        // Header text section.
        html += '  <tr>';
        html += '    <td>';
        html += '       <span style="font-size:small;font-style:italic;">These are your personal settings, which apply to all of your workflows.</span>';
        html += '   </td></tr></table>';
        html += '       <table>';
        html += '<tr><td>&nbsp;</td></tr>';




        // insert here 







        // "Send me email" immediately section.
        html += '  <tr>';
        html += '    <td style="text-align:left;" class="bwSliderTitleCell">Send me email:</td>';
        html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
        html += '      <input type="radio" style="cursor:pointer;" id="rbMyEmailNotificationImmediately" name="rbgMyEmailNotificationFrequency" onclick="cmdRbgMyEmailNotificationFrequency_click(\'immediately\');" />&nbsp;<span id="spanRbEmailImmediately" style="color:gray;">Immediately</span>';
        html += '    </td>';
        html += '  </tr>';

        // "Send me email" aggregate twice daily section.
        html += '<tr><td></td><td class="bwChartCalculatorLightCurrencyTableCell"><input type="radio" style="cursor:pointer;" id="rbMyEmailNotificationAggregated" name="rbgMyEmailNotificationFrequency" onclick="cmdRbgMyEmailNotificationFrequency_click(\'aggregatetwicedaily\');" />&nbsp;';
        html += '<span id="spanRbAggregateEmailTwiceDaily" style="color:gray;">Aggregate into an email sent twice daily at<br />';
        html += '<span style="float:right;">';
        html += '<select style="padding:5px 5px 5px 5px;" id="selectAggregateEmailTwiceDailyFirstTime" onchange="cmdRbgMyEmailNotificationFrequency_click(\'aggregatetwicedaily\');" disabled>';
        html += '<option value="1">1AM</option>';
        html += '<option value="2">2AM</option>';
        html += '<option value="3">3AM</option>';
        html += '<option value="4">4AM</option>';
        html += '<option value="5">5AM</option>';
        html += '<option value="6">6AM</option>';
        html += '<option value="7">7AM</option>';
        html += '<option value="8">8AM</option>';
        html += '<option value="9" selected>9AM</option>';
        html += '<option value="10">10AM</option>';
        html += '<option value="11">11AM</option>';
        html += '<option value="12">12PM</option>';
        html += '<option value="13">1PM</option>';
        html += '<option value="14">2PM</option>';
        html += '<option value="15">3PM</option>';
        html += '<option value="16">4PM</option>';
        html += '<option value="17">5PM</option>';
        html += '<option value="18">6PM</option>';
        html += '<option value="19">7PM</option>';
        html += '<option value="20">8PM</option>';
        html += '<option value="21">9PM</option>';
        html += '<option value="22">10PM</option>';
        html += '<option value="23">11PM</option>';
        html += '<option value="24">12AM</option>';
        html += '</select>';
        html += ' and ';
        html += '<select style="padding:5px 5px 5px 5px;" id="selectAggregateEmailTwiceDailySecondTime" onchange="cmdRbgMyEmailNotificationFrequency_click(\'aggregatetwicedaily\');" disabled>';
        html += '<option value="1">1AM</option>';
        html += '<option value="2">2AM</option>';
        html += '<option value="3">3AM</option>';
        html += '<option value="4">4AM</option>';
        html += '<option value="5">5AM</option>';
        html += '<option value="6">6AM</option>';
        html += '<option value="7">7AM</option>';
        html += '<option value="8">8AM</option>';
        html += '<option value="9">9AM</option>';
        html += '<option value="10">10AM</option>';
        html += '<option value="11">11AM</option>';
        html += '<option value="12">12PM</option>';
        html += '<option value="13">1PM</option>';
        html += '<option value="14">2PM</option>';
        html += '<option value="15">3PM</option>';
        html += '<option value="16" selected>4PM</option>';
        html += '<option value="17">5PM</option>';
        html += '<option value="18">6PM</option>';
        html += '<option value="19">7PM</option>';
        html += '<option value="20">8PM</option>';
        html += '<option value="21">9PM</option>';
        html += '<option value="22">10PM</option>';
        html += '<option value="23">11PM</option>';
        html += '<option value="24">12AM</option>';
        html += '</select>';
        html += '  ';
        html += '<select style="padding:5px 5px 5px 5px;" id="selectAggregateEmailTwiceDailyTimezoneDisplayName" onchange="cmdRbgMyEmailNotificationFrequency_click(\'aggregatetwicedaily\');" disabled>';
        html += '<option value="AST">AST</option>';
        html += '<option value="EST">EST</option>';
        html += '<option value="CST">CST</option>';
        html += '<option value="MST">MST</option>';
        html += '<option value="PST">PST</option>';
        html += '</select>';
        html += '</span>';
        html += '</span>';
        html += '</td></tr>';
        html += '   <tr><td colspan="2">&nbsp;</td></tr>';




        // "Send me this kind of email" section.
        //html += '<tr><td style="text-align:left;" class="bwSliderTitleCell">Send me this kind of email:</td><td class="bwChartCalculatorLightCurrencyTableCell"><input type="radio" id="rbMyEmailNotificationTypeAllNotifications" name="rbgMyEmailNotificationTypes" onclick="cmdRbgMyEmailNotificationTypes_click(\'allnotifications\');" />&nbsp;<span id="spanEmailNotificationTypeAllNotifications" style="color:gray;">All notifications</span></td></tr>';
        //html += '<tr><td></td><td class="bwChartCalculatorLightCurrencyTableCell"><input type="radio" id="rbMyEmailNotificationTypeOnlyTasks" name="rbgMyEmailNotificationTypes" onclick="cmdRbgMyEmailNotificationTypes_click(\'onlymytasknotifications\');" />&nbsp;<span id="spanEmailNotificationTypeOnlyTasks" style="color:gray;">Only my task notifications</span></td></tr>';
        html += '<tr>';
        html += '  <td style="text-align:left;" class="bwSliderTitleCell">Send me this kind of email:</td>';
        html += '        <td class="bwChartCalculatorLightCurrencyTableCell">';
        html += '          <input type="radio" style="cursor:pointer;" id="rbMyEmailNotificationTypeAllNotifications" name="rbgMyEmailNotificationTypes" onclick="cmdRbgMyEmailNotificationTypes_click(\'allnotifications\');" />&nbsp;<span id="spanEmailNotificationTypeAllNotifications" style="color:gray;">All notifications</span>';
        html += '        </td>';
        html += '</tr>';
        html += '<tr>';
        html += '  <td></td>';
        html += '        <td class="bwChartCalculatorLightCurrencyTableCell">';
        html += '          <input type="radio" style="cursor:pointer;" id="rbMyEmailNotificationTypeOnlyTasks" name="rbgMyEmailNotificationTypes" onclick="cmdRbgMyEmailNotificationTypes_click(\'onlymytasknotifications\');" />&nbsp;<span id="spanEmailNotificationTypeOnlyTasks" style="color:gray;">Only my task notifications</span>';
        html += '        </td>';
        html += '</tr>';
        html += '<tr>';
        html += '  <td></td>';
        html += '        <td class="bwChartCalculatorLightCurrencyTableCell">';
        html += '          <input type="radio" style="cursor:pointer;" id="rbMyEmailNotificationTypeNoNotifications" name="rbgMyEmailNotificationTypes" onclick="cmdRbgMyEmailNotificationTypes_click(\'nonotifications\');" />&nbsp;<span id="spanEmailNotificationTypeNoNotifications" style="color:gray;">No email notifications</span>';
        html += '        </td>';
        html += '</tr>';
        html += '<tr><td colspan="2">&nbsp;</td></tr>';

        // "Display tips at the top of the page" section.
        html += '<tr><td>&nbsp;</td></tr>';
        html += '<tr><td style="text-align:left;" class="bwSliderTitleCell">';
        html += 'Display tips at the top of the page:&nbsp;</td>';
        html += '<td class="bwChartCalculatorLightCurrencyTableCell"><label for="configurationBehaviorTipsSlider"></label><input type="checkbox" name="configurationBehaviorTipsSlider" id="configurationBehaviorTipsSlider" /></td></tr>';
        html += '<tr><td>&nbsp;</td></tr>';




        // "Display task details before displaying requests" section.
        html += '  <tr>';
        html += '    <td colspan="2">';
        html += '        <span style="font-size:small;font-style:italic;">When viewing a request from the Home page, you can choose to view the approval trail prior to displaying the request.</span>';
        html += '    </td></tr>';
        html += '   <tr><td style="text-align:left;" class="bwSliderTitleCell">';
        html += '           Display task details before displaying requests:</td>';
        html += '       <td class="bwChartCalculatorLightCurrencyTableCell"><label for="configurationBehaviorDisplayTaskDetailsBeforeRequestsPageSlider"></label><input type="checkbox" name="configurationBehaviorDisplayTaskDetailsBeforeRequestsPageSlider" id="configurationBehaviorDisplayTaskDetailsBeforeRequestsPageSlider" /></td></tr>';
        html += '   <tr><td colspan="2">&nbsp;</td></tr>';












        // "Display invitation section on the home page" section.
        html += '   <tr><td style="text-align:left;" class="bwSliderTitleCell">';
        html += '           Display "Add a Person/Participant/Vendor" section on the home page:</td>';
        html += '       <td class="bwChartCalculatorLightCurrencyTableCell"><label for="configurationBehaviorDisplayInvitationsOnHomePageSlider"></label><input type="checkbox" name="configurationBehaviorDisplayInvitationsOnHomePageSlider" id="configurationBehaviorDisplayInvitationsOnHomePageSlider" /></td></tr>';
        html += '   <tr><td colspan="2">&nbsp;</td></tr>';













        // "Upload notification custom sound file" section.
        html += '   <tr><td style="text-align:left;vertical-align:top;" class="bwSliderTitleCell">';
        html += '           Selected notification sound:</td>';
        html += '       <td class="bwChartCalculatorLightCurrencyTableCell" style="vertical-align:middle;">';

        html += '           <input checked="" type="radio" style="cursor:pointer;" name="cbSelectNotificationSound" />&nbsp;';
        html += '           <span style="cursor:pointer;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'playNotificationSound_Random\');">';
        html += '               <img src="images/playbutton.jpg" style="width:110px;height:70px;vertical-align:middle;" />';
        html += '           </span>';
        html += '           <span style="cursor:pointer;">Random</span>';
        html += '           <br />';

        html += '           <input type="radio" style="cursor:pointer;" name="cbSelectNotificationSound" />&nbsp;';
        html += '           <span style="cursor:pointer;">';
        html += '               <img src="images/playbutton.jpg" style="width:110px;height:70px;vertical-align:middle;" />';
        html += '           </span>';
        html += '           <span style="cursor:pointer;">No Sound</span>';
        html += '           <br />';

        html += '           <input type="radio" style="cursor:pointer;" name="cbSelectNotificationSound" />&nbsp;';
        html += '           <span style="cursor:pointer;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'playNotificationSound1\');">';
        html += '               <img src="images/playbutton.jpg" style="width:110px;height:70px;vertical-align:middle;" />';
        html += '           </span>';
        html += '           <span style="cursor:pointer;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'playNotificationSound1\');">Star Trek</span>';
        html += '           <br />';
        html += '           <input type="radio" style="cursor:pointer;" name="cbSelectNotificationSound" />&nbsp;';
        html += '           <span style="cursor:pointer;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'playNotificationSound2\');">';
        html += '               <img src="images/playbutton.jpg" style="width:110px;height:70px;vertical-align:middle;" />';
        html += '           </span>';
        html += '           <span style="cursor:pointer;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'playNotificationSound2\');">Cash Register</span>';
        html += '           <br />';
        html += '           <input type="radio" style="cursor:pointer;" name="cbSelectNotificationSound" />&nbsp;';
        html += '           <span style="cursor:pointer;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'playNotificationSound3\');">';
        html += '               <img src="images/playbutton.jpg" style="width:110px;height:70px;vertical-align:middle;" />';
        html += '           </span>';
        html += '           <span style="cursor:pointer;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'playNotificationSound3\');">Crickets</span>';
        //html += '           <br />';
        //html += '           <span style="cursor:pointer;">[currentsoundtitle]</span>';
        //html += '           <span style="cursor:pointer;">[uploadbutton]</span>';
        //html += '           <br />';
        html += '       </td>';
        html += '   </tr>';
        html += '   <tr><td colspan="2">&nbsp;</td></tr>';




        // "Auto-save" immediately section.
        html += '  <tr>';
        html += '    <td style="text-align:left;" class="bwSliderTitleCell">Auto-save form entry:</td>';
        html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
        html += '      <input type="radio" style="cursor:pointer;" id="rbAutosaveFormEntryImmediately" name="rbgMyEmailNotificationFrequency" onclick="cmdRbgAutosaveFormEntryFrequency_click(\'immediately\');" />&nbsp;<span id="spanRbAutosaveFormEntryImmediately" style="color:gray;">Immediately</span>';
        html += '    </td>';
        html += '  </tr>';
        html += '  <tr>';
        html += '    <td></td>';
        html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
        html += '      <input type="radio" style="cursor:pointer;" id="rbAutosaveFormEntryEverySixtySeconds" name="rbgMyEmailNotificationFrequency" onclick="cmdRbgAutosaveFormEntryFrequency_click(\'everysixtyseconds\');" />&nbsp;<span id="spanRbAutosaveFormEntryEverySixtySeconds" style="color:gray;">Every 60 seconds</span>';
        html += '    </td>';
        html += '  </tr>';
        html += '  <tr>';
        html += '    <td></td>';
        html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
        html += '      <input type="radio" style="cursor:pointer;" id="rbAutosaveFormEntryNever" name="rbgMyEmailNotificationFrequency" onclick="cmdRbgAutosaveFormEntryFrequency_click(\'never\');" />&nbsp;<span id="spanRbAutosaveFormEntryNever" style="color:gray;">Never</span>';
        html += '    </td>';
        html += '  </tr>';
        html += '  <tr>';
        html += '    <td></td>';
        html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
        html += '      <input type="radio" style="cursor:pointer;" id="rbAutosaveFormEntrySaveToMyDevice" name="rbgMyEmailNotificationFrequency" onclick="cmdRbgAutosaveFormEntryFrequency_click(\'savetomydevice\');" />&nbsp;<span id="spanRbAutosaveFormEntrySaveToMyDevice" style="color:gray;">Save to my device</span>';
        html += '    </td>';
        html += '  </tr>';
        html += '<tr><td colspan="2">&nbsp;</td></tr>';






        // "Display lazy loading slider.
        html += '  <tr>';
        html += '    <td colspan="2">';
        html += '        <span style="font-size:small;font-style:italic;">Lazy loading affects network performance. You can set how you wish. It is a compromise!</span>';
        //html += '        <br />';
        html += '        <span style="font-size:smaller;font-style:italic;color:lightgrey;">This functionality is incomplete. Coming soon!</span>';
        html += '    </td></tr>';
        html += '   <tr><td style="text-align:left;" class="bwSliderTitleCell">';
        html += '           Lazy loading:</td>';
        html += '       <td class="bwChartCalculatorLightCurrencyTableCell">';
        html += '           <script>$( function() { $( "#slider" ).slider(); } );</script>';
        html += '           <div id="slider"></div>';
        html += '       </td>';
        html += '   </tr>';
        html += '   <tr><td colspan="2">&nbsp;</td></tr>';
        //html += '   <tr><td colspan="2">&nbsp;</td></tr>';







        html += '       </table>';
        $('#divFunctionalAreasSubSubMenus').html(html);




        // Now we set all the display elements into their correct states!
        //emailAggregatorTwiceDailyFirstTime
        //emailAggregatorTwiceDailySecondTime
        //emailAggregatorTwiceDailyTimezoneDisplayName

        // Check if this has a value. This will be undefined the first time around until something gets saved back to the database.
        try {
            if (emailAggregatorTwiceDailyFirstTime) {
                //displayAlertDialog('emailAggregatorTwiceDailyFirstTime: ' + emailAggregatorTwiceDailyFirstTime);
                document.getElementById('selectAggregateEmailTwiceDailyFirstTime').value = emailAggregatorTwiceDailyFirstTime;
                document.getElementById('selectAggregateEmailTwiceDailySecondTime').value = emailAggregatorTwiceDailySecondTime;
                document.getElementById('selectAggregateEmailTwiceDailyTimezoneDisplayName').value = emailAggregatorTwiceDailyTimezoneDisplayName;
            }
        } catch (e) {
            console.log('Regarding emailAggregatorTwiceDailyFirstTime. xcx2343546');
        }


        if (emailNotificationFrequency == 'immediately') {
            document.getElementById('rbMyEmailNotificationImmediately').setAttribute('checked', 'checked');
            document.getElementById('spanRbEmailImmediately').style.color = 'black'; //$('spanRbEmailImmediately').css({ 'color': 'black' });
            document.getElementById('selectAggregateEmailTwiceDailyFirstTime').disabled = true;
            document.getElementById('selectAggregateEmailTwiceDailySecondTime').disabled = true;
            document.getElementById('selectAggregateEmailTwiceDailyTimezoneDisplayName').disabled = true;
        } else if (emailNotificationFrequency == 'aggregatetwicedaily') {
            document.getElementById('rbMyEmailNotificationAggregated').setAttribute('checked', 'checked');
            document.getElementById('spanRbAggregateEmailTwiceDaily').style.color = 'black'; //$('spanRbAggregateEmailTwiceDaily').css({ 'color': 'black' });
            document.getElementById('selectAggregateEmailTwiceDailyFirstTime').disabled = false;
            document.getElementById('selectAggregateEmailTwiceDailySecondTime').disabled = false;
            document.getElementById('selectAggregateEmailTwiceDailyTimezoneDisplayName').disabled = false;
        }

        //if (emailNotificationTypes == 'allnotifications') {
        //    document.getElementById('rbMyEmailNotificationTypeAllNotifications').setAttribute('checked', 'checked');
        //    document.getElementById('spanEmailNotificationTypeAllNotifications').style.color = 'black';
        //} else if (emailNotificationTypes == 'onlymytasknotifications') {
        //    document.getElementById('rbMyEmailNotificationTypeOnlyTasks').setAttribute('checked', 'checked');
        //    document.getElementById('spanEmailNotificationTypeOnlyTasks').style.color = 'black';
        //}
        if (emailNotificationTypes == 'allnotifications') {
            document.getElementById('rbMyEmailNotificationTypeAllNotifications').setAttribute('checked', 'checked');
            document.getElementById('spanEmailNotificationTypeAllNotifications').style.color = 'black';
        } else if (emailNotificationTypes == 'onlymytasknotifications') {
            document.getElementById('rbMyEmailNotificationTypeOnlyTasks').setAttribute('checked', 'checked');
            document.getElementById('spanEmailNotificationTypeOnlyTasks').style.color = 'black';
        } else if (emailNotificationTypes == 'nonotifications') {
            document.getElementById('rbMyEmailNotificationTypeNoNotifications').setAttribute('checked', 'checked');
            document.getElementById('spanEmailNotificationTypeNoNotifications').style.color = 'black';
        }


        //if (emailNotificationTypes == 'allnotifications') html += '<tr><td style="text-align:left;" class="bwSliderTitleCell">Send me this kind of email:</td><td class="bwChartCalculatorLightCurrencyTableCell"><input type="radio" name="rbgMyEmailNotificationTypes" onclick="cmdRbgMyEmailNotificationTypes_click(\'allnotifications\');" checked />&nbsp;All notifications</td></tr>';
        //else html += '<tr><td style="text-align:left;" class="bwSliderTitleCell">Send me this kind of email:</td><td class="bwChartCalculatorLightCurrencyTableCell"><input type="radio" name="rbgMyEmailNotificationTypes" onclick="cmdRbgMyEmailNotificationTypes_click(\'allnotifications\');" />&nbsp;All notifications</td></tr>';
        //if (emailNotificationTypes == 'onlymytasknotifications') html += '<tr><td></td><td class="bwChartCalculatorLightCurrencyTableCell"><input type="radio" name="rbgMyEmailNotificationTypes" onclick="cmdRbgMyEmailNotificationTypes_click(\'onlymytasknotifications\');" checked />&nbsp;Only my task notifications</td></tr>';
        //else html += '<tr><td></td><td class="bwChartCalculatorLightCurrencyTableCell"><input type="radio" name="rbgMyEmailNotificationTypes" onclick="cmdRbgMyEmailNotificationTypes_click(\'onlymytasknotifications\');" />&nbsp;Only my task notifications</td></tr>';






        //if (emailNotificationLevel == 'alldiscourse') html += '<tr><td style="text-align:left;" class="bwSliderTitleCell">Email Notifications:</td><td class="bwChartCalculatorLightCurrencyTableCell"><input type="radio" checked="checked" name="rbgMyEmailNotifications" onclick="cmdRbgMyEmailNotifications_click(\'alldiscourse\');" />&nbsp;Receive email notifications as soon as the state of a request has been changed.</td</tr>';
        //else html += '<tr><td style="text-align:left;" class="bwSliderTitleCell">Email Notifications:</td><td class="bwChartCalculatorLightCurrencyTableCell"><input type="radio" name="rbgMyEmailNotifications" onclick="cmdRbgMyEmailNotifications_click(\'alldiscourse\');" />&nbsp;Receive email notifications as soon as the state of a request has been changed.</td></tr>';

        //if (emailNotificationLevel == 'alldiscoursesenddaily') html += '<tr><td></td><td class="bwChartCalculatorLightCurrencyTableCell"><input type="radio" checked="checked" name="rbgMyEmailNotifications" onclick="cmdRbgMyEmailNotifications_click(\'alldiscoursesenddaily\');" />&nbsp;Only send me one email a day with all of my notifications.</td></tr>';
        //else html += '<tr><td></td><td class="bwChartCalculatorLightCurrencyTableCell"><input type="radio" name="rbgMyEmailNotifications" onclick="cmdRbgMyEmailNotifications_click(\'alldiscoursesenddaily\');" />&nbsp;Only send me one email a day with all of my notifications.</td></tr>';

        ////html += '<br /><br />';
        //if (emailNotificationLevel == 'onlyuponcompletion') html += '<tr><td></td><td class="bwChartCalculatorLightCurrencyTableCell"><input type="radio" checked="checked" name="rbgMyEmailNotifications" onclick="cmdRbgMyEmailNotifications_click(\'onlyuponcompletion\');" />&nbsp;Only upon completion, and when action is required.</td></tr>';
        //else html += '<tr><td></td><td class="bwChartCalculatorLightCurrencyTableCell"><input type="radio" name="rbgMyEmailNotifications" onclick="cmdRbgMyEmailNotifications_click(\'onlyuponcompletion\');" />&nbsp;Only upon completion, and when action is required.</td></tr>';



        //if (emailNotificationLevel == 'xxxx') html += '<tr><td></td><td class="bwChartCalculatorLightCurrencyTableCell"><input type="checkbox" checked="checked" name="rbgMyEmailNotifications" onclick="cmdRbgMyEmailNotifications_click(\'xxxx\');" />&nbsp;Ignore task re-assignment notifications.</td></tr>';
        //else html += '<tr><td></td><td class="bwChartCalculatorLightCurrencyTableCell"><input type="checkbox" name="rbgMyEmailNotifications" onclick="cmdRbgMyEmailNotifications_click(\'xxxx\');" />&nbsp;Ignore task re-assignment notificationsx.</td></tr>';

        //if (emailNotificationLevel == 'xxxx') html += '<tr><td></td><td class="bwChartCalculatorLightCurrencyTableCell"><input type="checkbox" checked="checked" name="rbgMyEmailNotifications" onclick="cmdRbgMyEmailNotifications_click(\'xxxx\');" />&nbsp;Notify me about anything that happens no matter how inconsequential.</td></tr>';
        //else html += '<tr><td></td><td class="bwChartCalculatorLightCurrencyTableCell"><input type="checkbox" name="rbgMyEmailNotifications" onclick="cmdRbgMyEmailNotifications_click(\'xxxx\');" />&nbsp;Notify me about anything that happens no matter how inconsequential.</td></tr>';







        var configurationBehaviorTipsOptions = {
            checked: tipsDisplayOn,
            show_labels: true,         // Should we show the on and off labels?
            labels_placement: "left",  // Position of the labels: "both", "left" or "right"
            on_label: "ON",            // Text to be displayed when checked
            off_label: "OFF",          // Text to be displayed when unchecked
            width: 50,                 // Width of the button in pixels
            height: 22,                // Height of the button in pixels
            button_width: 24,         // Width of the sliding part in pixels
            clear_after: null         // Override the element after which the clearing div should be inserted 
        };
        $("input#configurationBehaviorTipsSlider").switchButton(configurationBehaviorTipsOptions);

        var configurationBehaviorDisplayInvitationsOnHomePageOptions = {
            checked: displayInvitationsOnHomePageDisplayOn,
            show_labels: true,         // Should we show the on and off labels?
            labels_placement: "left",  // Position of the labels: "both", "left" or "right"
            on_label: "ON",            // Text to be displayed when checked
            off_label: "OFF",          // Text to be displayed when unchecked
            width: 50,                 // Width of the button in pixels
            height: 22,                // Height of the button in pixels
            button_width: 24,         // Width of the sliding part in pixels
            clear_after: null         // Override the element after which the clearing div should be inserted 
        };
        $("input#configurationBehaviorDisplayInvitationsOnHomePageSlider").switchButton(configurationBehaviorDisplayInvitationsOnHomePageOptions);

        var configurationBehaviorDisplayTaskDetailsBeforeRequestsPageOptions = {
            checked: displayTaskDetailsBeforeRequests,
            show_labels: true,         // Should we show the on and off labels?
            labels_placement: "left",  // Position of the labels: "both", "left" or "right"
            on_label: "YES",            // Text to be displayed when checked
            off_label: "NO",          // Text to be displayed when unchecked
            width: 50,                 // Width of the button in pixels
            height: 22,                // Height of the button in pixels
            button_width: 24,         // Width of the sliding part in pixels
            clear_after: null         // Override the element after which the clearing div should be inserted 
        };
        $("input#configurationBehaviorDisplayTaskDetailsBeforeRequestsPageSlider").switchButton(configurationBehaviorDisplayTaskDetailsBeforeRequestsPageOptions);



        // Hook up the events.
        $('#configurationBehaviorTipsSlider').change(function () {
            // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
            if (tipsDisplayOn == true) tipsDisplayOn = false;
            else tipsDisplayOn = true;
            var _userDetails = [];
            _userDetails = {
                bwParticipantId: participantId,
                bwTipsDisplayOn: tipsDisplayOn.toString()
            };
            var operationUri = webserviceurl + "/bwparticipant/updateuserconfigurationbehaviorTipsDisplay";
            $.ajax({
                url: operationUri,
                type: "POST", timeout: ajaxTimeout,
                data: _userDetails,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    if (data != 'SUCCESS') {
                        displayAlertDialog(data);
                    } else {
                        //debugger;
                        // Apply Participant configurations to the display.
                        if (tipsDisplayOn == true) {
                            //debugger;
                            //$('#spanAlertLink').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                            //$('#spanAlertLinkNewRequest').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                            //$('#spanAlertLinkMyStuff').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                            //$('#spanAlertLinkSummary').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                            //$('#spanAlertLinkConfiguration').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                            //$('#spanAlertLinkHelp').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                            $('#spanAlertLink').show();
                            $('#spanAlertLinkNewRequest').show();
                            $('#spanAlertLinkMyStuff').show();
                            $('#spanAlertLinkSummary').show();
                            $('#spanAlertLinkConfiguration').show();
                            $('#spanAlertLinkHelp').show();
                        } else {
                            //    $('#spanAlertLink').html('&nbsp;');
                            //    $('#spanAlertLinkNewRequest').html('&nbsp;');
                            //    $('#spanAlertLinkMyStuff').html('&nbsp;');
                            //    $('#spanAlertLinkSummary').html('&nbsp;');
                            //    $('#spanAlertLinkConfiguration').html('&nbsp;');
                            //    $('#spanAlertLinkHelp').html('&nbsp;');
                            $('#spanAlertLink').hide();
                            $('#spanAlertLinkNewRequest').hide();
                            $('#spanAlertLinkMyStuff').hide();
                            $('#spanAlertLinkSummary').hide();
                            $('#spanAlertLinkConfiguration').hide();
                            $('#spanAlertLinkHelp').hide();
                        }
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in my.js.configurationBehaviorTipsSlider.change(): ' + errorCode + ' ' + errorMessage);
                }
            });
        });

        // Hook up the events.
        $('#configurationBehaviorDisplayInvitationsOnHomePageSlider').change(function () {
            // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
            if (displayInvitationsOnHomePageDisplayOn == true) displayInvitationsOnHomePageDisplayOn = false;
            else displayInvitationsOnHomePageDisplayOn = true;

            var _userDetails = [];
            _userDetails = {
                bwParticipantId: participantId,
                bwInvitationsOnHomePageDisplayOn: displayInvitationsOnHomePageDisplayOn.toString()
            };
            var operationUri = webserviceurl + "/bwparticipant/updateuserconfigurationbehaviordisplayinvitationsonhomepage";
            $.ajax({
                url: operationUri,
                type: "POST", timeout: ajaxTimeout,
                data: _userDetails,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    if (data != 'SUCCESS') {
                        displayAlertDialog(data);
                    } else {
                        if (displayInvitationsOnHomePageDisplayOn == true) {
                            $('#divInvitationSectionOnHomePage').show();
                        } else {
                            $('#divInvitationSectionOnHomePage').hide();
                        }
                        // Apply Participant configurations to the display.
                        //if (tipsDisplayOn == true) {
                        //    $('#spanAlertLink').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                        //    $('#spanAlertLinkNewRequest').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                        //    $('#spanAlertLinkMyStuff').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                        //    $('#spanAlertLinkSummary').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                        //    $('#spanAlertLinkConfiguration').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                        //    $('#spanAlertLinkHelp').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                        //} else {
                        //    $('#spanAlertLink').html('&nbsp;');
                        //    $('#spanAlertLinkNewRequest').html('&nbsp;');
                        //    $('#spanAlertLinkMyStuff').html('&nbsp;');
                        //    $('#spanAlertLinkSummary').html('&nbsp;');
                        //    $('#spanAlertLinkConfiguration').html('&nbsp;');
                        //    $('#spanAlertLinkHelp').html('&nbsp;');
                        //}
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in my.js.configurationBehaviorDisplayInvitationsOnHomePageSlider.change(): ' + errorCode + ' ' + errorMessage);
                }
            });
        });


        $('#configurationBehaviorDisplayTaskDetailsBeforeRequestsPageSlider').change(function () {
            //debugger;
            // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
            if (displayTaskDetailsBeforeRequests == true) displayTaskDetailsBeforeRequests = false;
            else displayTaskDetailsBeforeRequests = true;

            var _userDetails = [];
            _userDetails = {
                bwParticipantId: participantId,
                bwDisplayTaskDetailsBeforeRequests: displayTaskDetailsBeforeRequests.toString()
            };
            var operationUri = webserviceurl + "/bwparticipant/updateuserconfigurationbehaviordisplaytaskdetailsbeforerequests"; //updateuserconfigurationbehaviordisplayinvitationsonhomepage";
            $.ajax({
                url: operationUri,
                type: "POST",
                timeout: ajaxTimeout,
                data: _userDetails,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    //debugger;
                    if (data != 'SUCCESS') {
                        displayAlertDialog(data);
                    } else {
                        //if (displayInvitationsOnHomePageDisplayOn == true) {
                        //    $('#divInvitationSectionOnHomePage').show();
                        //} else {
                        //    $('#divInvitationSectionOnHomePage').hide();
                        //}
                        // Apply Participant configurations to the display.
                        //if (tipsDisplayOn == true) {
                        //    $('#spanAlertLink').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                        //    $('#spanAlertLinkNewRequest').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                        //    $('#spanAlertLinkMyStuff').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                        //    $('#spanAlertLinkSummary').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                        //    $('#spanAlertLinkConfiguration').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                        //    $('#spanAlertLinkHelp').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                        //} else {
                        //    $('#spanAlertLink').html('&nbsp;');
                        //    $('#spanAlertLinkNewRequest').html('&nbsp;');
                        //    $('#spanAlertLinkMyStuff').html('&nbsp;');
                        //    $('#spanAlertLinkSummary').html('&nbsp;');
                        //    $('#spanAlertLinkConfiguration').html('&nbsp;');
                        //    $('#spanAlertLinkHelp').html('&nbsp;');
                        //}
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in my.js.configurationBehaviorDisplayTaskDetailsBeforeRequestsPageSlider.change(): ' + errorCode + ' ' + errorMessage);
                }
            });
        });





    } catch (e) {
        console.log('Exception in renderConfigurationPersonalBehavior(): ' + e.message + ', ' + e.stack);
        displayAlertDialog('Exception in renderConfigurationPersonalBehavior(): ' + e.message + ', ' + e.stack);
    }
}


//function initializeTheForm() {
//    try {
//        console.log('');
//        console.log('IN initializeTheForm(). <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
//        console.log('');

//        //debugger; // 9-6-2021 why isnt this all working
//        try {
//            $('#FormsEditorToolbox').dialog('close');
//            //$('#')
//        } catch (e) { }

//        var canvas = document.getElementById("myCanvas");
//        if (canvas) {
//            var ctx = canvas.getContext("2d");
//            ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines
//            canvas.style.zIndex = -1;
//        }
//        renderWelcomeScreen();
//        $('#bwQuickLaunchMenuTd').css({
//            width: '0'
//        }); // This gets rid of the jumping around.

//        $('#liWelcome').show();
//        $('#liNewRequest').hide();
//        $('#liArchive').hide();
//        $('#liSummaryReport').hide();
//        $('#liConfiguration').hide();
//        $('#liVisualizations').hide();
//        $('#liHelp').hide();

//        $('#divWelcomeMasterDiv').show();
//        //var e1 = document.getElementById('divWelcomeMasterDiv');
//        //e1.style.borderRadius = '20px 0 0 20px';

//        renderLeftButtons('divWelcomePageLeftButtons');





//        //var printButtonOptions = {
//        //    reportType: 'CurrentYearBudgetRequestsReport'
//        //};
//        var $printbutton = $('#divBwPrintButton').bwPrintButton({});


//        var $timerservicesmanager = $('#divBwTimerServicesManager').bwTimerServicesManager({ ReadOnly: false }); // 2-18-2022 Added ReadOnly attribute.


//        //var options = { };
//        //var $bwCoreComponent = $('#divBwCoreComponent').bwCoreComponent(options);

//        var options = {
//            displayOnCreation: false
//        };
//        var $bwMonitoringTools2 = $('#divBwMonitoringTools2').bwMonitoringTools2(options);
//        //$('#divBwMonitoringTools2').bwMonitoringTools2('cmdDisplayWebsiteErrorThreats', 'ALL');


//        var $bwChecklistsEditor_Admin = $('#divBwChecklistsEditor_Admin').bwChecklistsEditor_Admin({});


//        var options = {
//            backendAdministrationMode: true
//        };
//        var $bwemailmonitor = $("#divBwEmailMonitor_Admin").bwEmailMonitor_Admin(options);









//        //debugger;
//        var options = {
//            displayOnCreation: false
//        };
//        var $bwBackendAdministrationForAllParticipants = $('#divBwAdmin').bwBackendAdministrationForAllParticipants(options);
//        //$bwBackendAdministrationForAllParticipants.bwBackendAdministrationForAllParticipants('renderAdmin');

//        //
//        // "New Tenant/User" functionality.
//        //
//        var options = {};
//        var $bwNewUserEmailEditor = $('#divBwNewUserEmailEditor').bwNewUserEmailEditor(options);

//        var $bwUnsubscribeUserEmailEditor = $('#divBwUnsubscribeUserEmailEditor').bwUnsubscribeUserEmailEditor({});
//        var $bwResubscribeUserEmailEditor = $('#divBwResubscribeUserEmailEditor').bwResubscribeUserEmailEditor({});

//        // divBwVideoAssistant_Admin
//        $('#divBwVideoAssistant_Admin').bwVideoAssistant_Admin({});

//        $('#divBwSlideshowAdmin').bwSlideshowAdmin({});

//        //debugger;
//        var options = {};
//        var $bwNewUserRolesEditor = $('#divBwNewUserRolesEditor').bwNewUserRolesEditor(options);

//        var options = {};
//        var $bwNewUserBusinessModelEditor = $('#divBwNewUserBusinessModelEditor').bwNewUserBusinessModelEditor(options);

//        //var options = {};
//        //var $bwNewUserWorkflowEditor = $('#divBwNewUserWorkflowEditor').bwNewUserWorkflowEditor(options);
//        //debugger;
//        var options = {};
//        var $bwNewUserChecklistsEditor = $('#divBwNewUserChecklistsEditor').bwNewUserChecklistsEditor(options);

//        var options = {};
//        var $bwNewUserFormsEditor = $('#divBwNewUserFormsEditor').bwNewUserFormsEditor(options);
//        //
//        //
//        //

//        //debugger;
//        cmdDisplayWebsiteTrafficAudienceSize();
//        cmdDisplayWebsiteTrafficNumberOfParticipants();
//        cmdDisplayWebsiteTrafficNumberOfTenants();
//        //cmdDisplayWebsiteErrorThreats();
//        //cmdDisplaySentEmails();
//        //cmdGetStatusOfWorkflowTimer();
//        cmdGetStatusOfImap();
//        cmdDisplayNumberOfLicenses();
//        displayStatusOfFileServices();

//        displayServerTime();

//        displayFileServerDiskSpace();

//        populateTheTenantToDeleteDropDown();

//        populateSelectViewBwWorkflowTaskSelectWorkflowApp();


//        populateCheckbox_ForestAdministratorToReviewEmailsBeforeSending();





//        $.ajax({
//            url: "https://" + globalUrl + "/" + "_bw/bwtenantsfindall",
//            type: "POST",
//            contentType: 'application/json',
//            success: function (tenants) {
//                $.ajax({
//                    url: "https://" + globalUrl + "/" + "_bw/bwworkflowapps",
//                    type: "POST",
//                    contentType: 'application/json',
//                    success: function (workflowApps) {

//                        //var html = '';
//                        //html += '<select id="selectChangeUserRoleDialogOrganizationOwnerDropDown2" style="vertical-align:top;padding:5px 5px 5px 5px;">';
//                        //html += '<option value="" >Select a Tenant/Organization...</option>'; // data[i].bwWorkflows: [{ id: String, title: String, url: String }],
//                        //for (var i = 0; i < tenants.length; i++) {
//                        //    for (var w = 0; w < workflowApps.length; w++) {
//                        //        if (tenants[i].bwTenantId == workflowApps[w].bwTenantId) {
//                        //            html += '<option value="' + workflowApps[w].bwWorkflowAppId + '|' + workflowApps[w].bwWorkflowAppTitle + '" >' + workflowApps[w].bwWorkflowAppTitle + ': ' + tenants[i].bwTenantOwnerFriendlyName + ' (' + tenants[i].bwTenantOwnerEmail + ')</option>'; // data[i].bwWorkflows: [{ id: String, title: String, url: String }],
//                        //        }
//                        //    }
//                        //}
//                        //html += '</select>';
//                        //document.getElementById('spanChangeUserRoleDialogOrganizationOwnerDropDown2').innerHTML = html;

//                        var html = '';
//                        html += '<select id="selectChangeUserRoleDialogOrganizationOwnerDropDown3" style="vertical-align:top;padding:5px 5px 5px 5px;">';
//                        html += '<option value="" >Select a Tenant/Organization...</option>'; // data[i].bwWorkflows: [{ id: String, title: String, url: String }],
//                        for (var i = 0; i < tenants.length; i++) {
//                            for (var w = 0; w < workflowApps.length; w++) {
//                                if (tenants[i].bwTenantId == workflowApps[w].bwTenantId) {
//                                    //html += '<option value="' + workflowApps[w].bwTenantId + '|' + workflowApps[w].bwWorkflowAppTitle + '" >' + workflowApps[w].bwWorkflowAppTitle + ': ' + tenants[i].bwTenantOwnerFriendlyName + ' (' + tenants[i].bwTenantOwnerEmail + ')</option>'; // data[i].bwWorkflows: [{ id: String, title: String, url: String }],
//                                    html += '<option value="' + workflowApps[w].bwTenantId + '|' + workflowApps[w].bwWorkflowAppId + '" >' + workflowApps[w].bwWorkflowAppTitle + ': ' + tenants[i].bwTenantOwnerFriendlyName + ' (' + tenants[i].bwTenantOwnerEmail + ')</option>'; // data[i].bwWorkflows: [{ id: String, title: String, url: String }],
//                                }
//                            }
//                        }
//                        html += '</select>';
//                        document.getElementById('spanLogInAsTenantOrganizationOwnerDropDown').innerHTML = html;

//                        //$('#btnUserRoleDialogChangeRole').bind('click', function () {
//                        //    //debugger;
//                        //    thiz.addUserToOrganizationAndSendEmail(bwParticipantId, bwParticipantFriendlyName, bwParticipantEmail, logonType);
//                        //    //$("#AddUserToOrganizationDialog").dialog('close');
//                        //});

//                    },
//                    error: function (data, errorCode, errorMessage) {
//                        displayAlertDialog('Error in bwBackendAdministrationForAllParticipants.addThisUserToAnOrganization.bwworkflowapps():' + errorCode + ', ' + errorMessage);
//                    }
//                });

//            },
//            error: function (data, errorCode, errorMessage) {
//                displayAlertDialog('Error in bwBackendAdministrationForAllParticipants.addThisUserToAnOrganization.bwtenantsfindall():' + errorCode + ', ' + errorMessage);
//            }
//        });






//    } catch (e) {
//        handleExceptionWithAlert('Error in admin.js.initializeTheForm()', e.message + ', ' + e.stack);
//    }
//}


function renderConfigurationInventory() {
    try {
        //console.log('In renderConfigurationOrgRoles().');
        //var requestTypes = bwEnabledRequestTypes.EnabledItems;

        $('#bwQuickLaunchMenuTd').css({
            width: '0'
        }); // This gets rid of the jumping around.

        try {
            $('#FormsEditorToolbox').dialog('close');
        } catch (e) { }


        var canvas = document.getElementById("myCanvas");
        if (canvas) {
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines
            canvas.style.zIndex = -1;
        }

        $('#divPageContent3').empty(); // Clear the div and rebuild it with out new 'Departments' title.
        //$('#divFunctionalAreasMasterSubMenuDiv').hide(); //This si the top bar which we want to hide in this case.

        //var html = '';
        //html += '<table style="border-width: 0px; margin: 0px; padding: 0px; width: 100%;"><tbody><tr style="border-width: 0px; margin: 0px; padding: 0px;"><td style="border-width: 0px; margin: 0px; padding: 0px;">';
        //html += 'Inventory: <span style="font-weight:bold;color:#95b1d3;">This is beta functionality - under construction</span>';
        //html += '</td></tr></tbody></table>';
        //$('#divPageContent3').html(html);
        //
        //disableDepartmentsButton();
        //disableRaciSettingsButton();
        //disableInventoryButton();
        //$('#divFunctionalAreasSubSubMenus').empty();


        var html = '';
        html += '<div id="divBwInventory"></div>';
        //html += '<div id="divBwInventoryBundling"></div>';

        //html += '<br />';
        //html += '<br />';
        //html += '<br />';
        //html += '<hr />';
        //html += '[ADD INVENTORY ENTRY GRID/WIDGET HERE]';


        $('#divPageContent3').append(html);
        //
        // Render
        //

        //generateLocationsListButtons();

        var BWCustomer = {
            "CustomerIdentifier": "4242",
            "Description": "19601000_BW CO.",
            "Level": 2,
            "LevelDescription": "2",
            "City": "NOVA SCOTIA",
            "State": "OH",
            "CurrencyCode": "USD",
            "CompanyNumber": "155",
            "SellingChannel": "BPSF",
            "ERP": "BW1"
        }

        var options = {
            SearchingForModule: 'Distributor',
            ERP: 'BW1',
            BWCustomer: BWCustomer,
            DisplayConfigurationInventory: true
        };
        var $bwinventory = $("#divBwInventory").bwAdvancedProductSearch(options);

        //var options = {};
        //var $bwinventorybundling = $("#divBwInventoryBundling").bwDistributorBundling(options);





    } catch (e) {
        console.log('Exception in renderConfigurationInventory(): ' + e.message + ', ' + e.stack);
        displayAlertDialog('Exception in renderConfigurationInventory(): ' + e.message + ', ' + e.stack);
    }
}


function initializeTheForm2() {
    try {
        console.log('');
        console.log('IN initializeTheForm2(). <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
        console.log('');

        //debugger; // 9-6-2021 why isnt this all working
        try {
            $('#FormsEditorToolbox').dialog('close');
            //$('#')
        } catch (e) { }

        var canvas = document.getElementById("myCanvas");
        if (canvas) {
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines
            canvas.style.zIndex = -1;
        }
        renderWelcomeScreen();
        $('#bwQuickLaunchMenuTd').css({
            width: '0'
        }); // This gets rid of the jumping around.

        $('#liWelcome').show();
        $('#liNewRequest').hide();
        $('#liArchive').hide();
        $('#liSummaryReport').hide();
        $('#liConfiguration').hide();
        $('#liVisualizations').hide();
        $('#liHelp').hide();

        $('#divWelcomeMasterDiv').show();
        //var e1 = document.getElementById('divWelcomeMasterDiv');
        //e1.style.borderRadius = '20px 0 0 20px';

        renderLeftButtons('divWelcomePageLeftButtons');





        //var printButtonOptions = {
        //    reportType: 'CurrentYearBudgetRequestsReport'
        //};
        var $printbutton = $('#divBwPrintButton').bwPrintButton({});


        var $timerservicesmanager = $('#divBwTimerServicesManager').bwTimerServicesManager({ ReadOnly: false }); // 2-18-2022 Added ReadOnly attribute.


        //var options = { };
        //var $bwCoreComponent = $('#divBwCoreComponent').bwCoreComponent(options);

        var options = {
            displayOnCreation: false
        };
        var $bwMonitoringTools2 = $('#divBwMonitoringTools2').bwMonitoringTools2(options);
        //$('#divBwMonitoringTools2').bwMonitoringTools2('cmdDisplayWebsiteErrorThreats', 'ALL');


        var $bwChecklistsEditor_Admin = $('#divBwChecklistsEditor_Admin').bwChecklistsEditor_Admin({});


        var options = {
            backendAdministrationMode: true
        };
        var $bwemailmonitor = $("#divBwEmailMonitor_Admin").bwEmailMonitor_Admin(options);









        //debugger;
        //var options = {
        //    displayOnCreation: false
        //};
        //var $bwBackendAdministrationForAllParticipants = $('#divBwAdmin').bwBackendAdministrationForAllParticipants(options);
        //$bwBackendAdministrationForAllParticipants.bwBackendAdministrationForAllParticipants('renderAdmin');

        //
        // "New Tenant/User" functionality.
        //
        var options = {};
        var $bwNewUserEmailEditor = $('#divBwNewUserEmailEditor').bwNewUserEmailEditor(options);

        var $bwUnsubscribeUserEmailEditor = $('#divBwUnsubscribeUserEmailEditor').bwUnsubscribeUserEmailEditor({});
        var $bwResubscribeUserEmailEditor = $('#divBwResubscribeUserEmailEditor').bwResubscribeUserEmailEditor({});

        // divBwVideoAssistant_Admin
        $('#divBwVideoAssistant_Admin').bwVideoAssistant_Admin({});

        $('#divBwSlideshowAdmin').bwSlideshowAdmin({});

        //debugger;
        var options = {};
        var $bwNewUserRolesEditor = $('#divBwNewUserRolesEditor').bwNewUserRolesEditor(options);

        var options = {};
        var $bwNewUserBusinessModelEditor = $('#divBwNewUserBusinessModelEditor').bwNewUserBusinessModelEditor(options);

        //var options = {};
        //var $bwNewUserWorkflowEditor = $('#divBwNewUserWorkflowEditor').bwNewUserWorkflowEditor(options);
        //debugger;
        var options = {};
        var $bwNewUserChecklistsEditor = $('#divBwNewUserChecklistsEditor').bwNewUserChecklistsEditor(options);

        var options = {};
        var $bwNewUserFormsEditor = $('#divBwNewUserFormsEditor').bwNewUserFormsEditor(options);
        //
        //
        //

        //debugger;


        


        cmdDisplayWebsiteTrafficAudienceSize();
        cmdDisplayWebsiteTrafficNumberOfParticipants();
        cmdDisplayWebsiteTrafficNumberOfTenants();
        //cmdDisplayWebsiteErrorThreats();
        //cmdDisplaySentEmails();
        //cmdGetStatusOfWorkflowTimer();
        cmdGetStatusOfImap();
        cmdDisplayNumberOfLicenses();
        displayStatusOfFileServices();

        displayServerTime();

        displayFileServerDiskSpace();

        //populateTheTenantToDeleteDropDown();

      
        populateSelectViewBwWorkflowTaskSelectWorkflowApp();


        populateCheckbox_ForestAdministratorToReviewEmailsBeforeSending();





        if (document.getElementById('spanLogInAsTenantOrganizationOwnerDropDown')) { // Yes this works 1-7-2023

            $.ajax({
                url: "https://" + globalUrl + "/" + "_bw/bwtenantsfindall",
                type: "POST",
                contentType: 'application/json',
                success: function (tenants) {
                    $.ajax({
                        url: "https://" + globalUrl + "/" + "_bw/bwworkflowapps",
                        type: "POST",
                        contentType: 'application/json',
                        success: function (workflowApps) {
                            try {
                                //var html = '';
                                //html += '<select id="selectChangeUserRoleDialogOrganizationOwnerDropDown2" style="vertical-align:top;padding:5px 5px 5px 5px;">';
                                //html += '<option value="" >Select a Tenant/Organization...</option>'; // data[i].bwWorkflows: [{ id: String, title: String, url: String }],
                                //for (var i = 0; i < tenants.length; i++) {
                                //    for (var w = 0; w < workflowApps.length; w++) {
                                //        if (tenants[i].bwTenantId == workflowApps[w].bwTenantId) {
                                //            html += '<option value="' + workflowApps[w].bwWorkflowAppId + '|' + workflowApps[w].bwWorkflowAppTitle + '" >' + workflowApps[w].bwWorkflowAppTitle + ': ' + tenants[i].bwTenantOwnerFriendlyName + ' (' + tenants[i].bwTenantOwnerEmail + ')</option>'; // data[i].bwWorkflows: [{ id: String, title: String, url: String }],
                                //        }
                                //    }
                                //}
                                //html += '</select>';
                                //document.getElementById('spanChangeUserRoleDialogOrganizationOwnerDropDown2').innerHTML = html;

                                var html = '';
                                html += '<select id="selectChangeUserRoleDialogOrganizationOwnerDropDown3" style="vertical-align:top;padding:5px 5px 5px 5px;">';
                                html += '<option value="" >Select a Tenant/Organization...</option>'; // data[i].bwWorkflows: [{ id: String, title: String, url: String }],
                                for (var i = 0; i < tenants.length; i++) {
                                    for (var w = 0; w < workflowApps.length; w++) {
                                        if (tenants[i].bwTenantId == workflowApps[w].bwTenantId) {
                                            //html += '<option value="' + workflowApps[w].bwTenantId + '|' + workflowApps[w].bwWorkflowAppTitle + '" >' + workflowApps[w].bwWorkflowAppTitle + ': ' + tenants[i].bwTenantOwnerFriendlyName + ' (' + tenants[i].bwTenantOwnerEmail + ')</option>'; // data[i].bwWorkflows: [{ id: String, title: String, url: String }],
                                            html += '<option value="' + workflowApps[w].bwTenantId + '|' + workflowApps[w].bwWorkflowAppId + '" >' + workflowApps[w].bwWorkflowAppTitle + ': ' + tenants[i].bwTenantOwnerFriendlyName + ' (' + tenants[i].bwTenantOwnerEmail + ')</option>'; // data[i].bwWorkflows: [{ id: String, title: String, url: String }],
                                        }
                                    }
                                }
                                html += '</select>';
                                document.getElementById('spanLogInAsTenantOrganizationOwnerDropDown').innerHTML = html;

                                //$('#btnUserRoleDialogChangeRole').bind('click', function () {
                                //    //debugger;
                                //    thiz.addUserToOrganizationAndSendEmail(bwParticipantId, bwParticipantFriendlyName, bwParticipantEmail, logonType);
                                //    //$("#AddUserToOrganizationDialog").dialog('close');
                                //});
                            } catch (e) {
                                var msg = 'Exception in admin.js.xx():xcx1243672: ' + e.message + ', ' + e.stack;
                                console.log(msg);
                                displayAlertDialog(msg);
                            }
                        },
                        error: function (data, errorCode, errorMessage) {
                            displayAlertDialog('Error in bwBackendAdministrationForAllParticipants.addThisUserToAnOrganization.bwworkflowapps():' + errorCode + ', ' + errorMessage);
                        }
                    });

                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in bwBackendAdministrationForAllParticipants.addThisUserToAnOrganization.bwtenantsfindall():' + errorCode + ', ' + errorMessage);
                }
            });

        }




    } catch (e) {
        console.log('Exception in admin.js.initializeTheForm2(): ' + e.message + ', ' + e.stack);
        displayAlertDialog('Exception in admin.js.initializeTheForm2(): ' + e.message + ', ' + e.stack);
    }
}

function ShowActivitySpinner_FileUpload(spinnerText) {
    try {
        console.log('In admin2.js.ShowActivitySpinner_FileUpload().');



        var div = document.getElementById('divBwActivitySpinner_FileUpload'); // 4-1-2020 12-28pm adt.
        if (!div) {
            //alert('In bwSlideSet.js.copyAttachments(). Adding ' + dialogId + ' to the DOM.');
            div = document.createElement('div');
            div.id = 'divBwActivitySpinner_FileUpload';
            div.style.display = 'none';
            document.body.appendChild(div); // to place at end of document
        }



        $('#divBwActivitySpinner_FileUpload').bwActivitySpinner_FileUpload({});

        $('#divBwActivitySpinner_FileUpload').bwActivitySpinner_FileUpload('show', spinnerText);

    } catch (e) {
        console.log('Exception in admin2.js.ShowActivitySpinner_FileUpload(): ' + e.message + ', ' + e.stack);
        alert('Exception in admin2.js.ShowActivitySpinner_FileUpload(): ' + e.message + ', ' + e.stack);
        //$('#divBwActivitySpinner_FileUpload').bwActivitySpinner_FileUpload({ SpinnerType: 'modal' });
        //$('#divBwActivitySpinner_FileUpload').bwActivitySpinner_FileUpload('show');
    }
}


function ShowActivitySpinner(spinnerText) {
    try {
        console.log('In my.js.ShowActivitySpinner().');

        $('#divBwActivitySpinner').bwActivitySpinner({});

        $('#divBwActivitySpinner').bwActivitySpinner('show', spinnerText);

    } catch (e) {
        console.log('Exception in admin.js.ShowActivitySpinner(): ' + e.message + ', ' + e.stack);
        $('#divBwActivitySpinner').bwActivitySpinner({ SpinnerType: 'modal' });
        $('#divBwActivitySpinner').bwActivitySpinner('show');
    }
}

function HideActivitySpinner() {
    try {
        console.log('In my.js.HideActivitySpinner().');
        try {
            $('#divBwActivitySpinner').bwActivitySpinner('hide');
        } catch (e) {
            // do nothing
        }
    } catch (e) {
        console.log('Exception in my.js.HideActivitySpinner(): ' + e.message + ', ' + e.stack);
        alert('Exception in my.js.HideActivitySpinner(): ' + e.message + ', ' + e.stack);
    }
}

function HideActivitySpinner_FileUpload() {
    try {
        console.log('In admin2.js.HideActivitySpinner_FileUpload().');
        try {
            $('#divBwActivitySpinner_FileUpload').bwActivitySpinner_FileUpload('hide');
        } catch (e) {
            // do nothing
        }
    } catch (e) {
        console.log('Exception in admin2.js.HideActivitySpinner_FileUpload(): ' + e.message + ', ' + e.stack);
        alert('Exception in admin2.js.HideActivitySpinner_FileUpload(): ' + e.message + ', ' + e.stack);
    }
}


function renderWelcomeScreen() {
    try {
        console.log('In admin.js.renderWelcomeScreen().');

        try {
            document.getElementById('spanNotLoggedInBetaBanner').style.display = 'none';
            document.getElementById('spanLoggedInBetaBanner').style.display = 'block';
        } catch (e) { }

        //var financialOrParticipantSummaryOptions = {
        //    checked: false, // DEFAULT TO THE FINANCIAL SUMMARY. This fixes an issue when the participant summary is rendered first. The participant summary relies on the financial summary being rendered first.
        //    show_labels: true,         // Should we show the on and off labels?
        //    labels_placement: "both",  // Position of the labels: "both", "left" or "right"
        //    on_label: "Participant<br />Summary",            // Text to be displayed when checked
        //    off_label: "Financial<br />Summary",          // Text to be displayed when unchecked
        //    width: 50,                 // Width of the button in pixels
        //    height: 22,                // Height of the button in pixels
        //    button_width: 24,         // Width of the sliding part in pixels
        //    clear_after: null         // Override the element after which the clearing div should be inserted 
        //};
        //$("input#financialOrParticipantSummary").switchButton(financialOrParticipantSummaryOptions);

        //setCustomSizesDependingOnTheDevice();

        //$('#financialOrParticipantSummary').change(function () {


        //    //displayAlertDialog('financialOrParticipantSummary.change()');


        //    if (!$('#financialOrParticipantSummary').is(':checked')) {
        //        if (!$('#budgetRequestsOrQuotes').is(':checked')) {
        //            renderFinancialSummary9(false);
        //        } else if ($('#budgetRequestsOrQuotes').is(':checked')) {
        //            renderFinancialSummary9(true);
        //        } else {
        //            displayAlertDialog('budgetRequestsOrQuotes is in an invalid state.');
        //        }
        //    } else if ($('#financialOrParticipantSummary').is(':checked')) {
        //        if (!$('#budgetRequestsOrQuotes').is(':checked')) {
        //            renderParticipantSummary(false);
        //        } else if ($('#budgetRequestsOrQuotes').is(':checked')) {
        //            renderParticipantSummary(true);
        //        } else {
        //            displayAlertDialog('budgetRequestsOrQuotes is in an invalid state.');
        //        }
        //    } else {
        //        displayAlertDialog('financialOrParticipantSummary is in an invalid state.');
        //    }
        //});














        // WHY DO WE DO THIS HERE??? IT SHOULD HAVE HAPPENED ALREADY 8-6-2020
        webserviceurl = globalUrlPrefix + globalUrlForWebServices + '/_bw';
        appweburl = globalUrlPrefix + globalUrlForWebServices;
        appweburl2 = globalUrlPrefix + globalUrl;
        // This zooms the screen when the user first navigates to the website! More about this in the Budget Workflow Manager codebase.
        //if (navigator.userAgent.match(/iPhone/i)) {
        //    $('#bwMyPage').animate({ 'zoom': 3 }, 400);
        //}
        // todd turned off 10-20-19

        //debugger;




        // REMOVED THIS 9-6-2022. Any ramification??????
        //$('#divWelcomeMasterDivTitle').text('Home');
        //$('#divMenuMasterDivWelcomeButton').css({
        //    'border-width': '0px', 'margin': '0px 0px 0px 0px', 'padding': '12px 0px 0px 20px', 'outline': 'rgb(59, 103, 142) dashed 1px', 'border-radius': '0px', 'width': '92%', 'height': '28px', 'color': '#dcdcdc', 'background-color': 'white'
        //});
        //















        //var participantLogonType = $('.bwAuthentication').bwAuthentication('option', 'participantLogonType');
        //var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');









        //alert('xcx2134235 DISPLAY USER NAME');
        //// First we have to display them in the top bar.
        //if (participantLogonType) {
        //    $('#spanLoggedInUserWelcomePage').text(participantFriendlyName);
        //    //$('#spanLoggedInUserNewRequestPage').text(participantFriendlyName);
        //    //$('#spanLoggedInUserArchivePage').text(participantFriendlyName);
        //    //$('#spanLoggedInUserSummaryReportPage').text(participantFriendlyName);
        //    //$('#spanLoggedInUserConfigurationPage').text(participantFriendlyName);
        //    //$('#spanLoggedInUserVisualizationsPage').text(participantFriendlyName);
        //    //$('#spanLoggedInUserHelpPage').text(participantFriendlyName);
        //}
















        //var h1 = '';
        //h1 += '<img src="/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;vertical-align:top;" />&nbsp;' + participantFriendlyName + '';
        //h1 += '';
        //h1 += '';
        //h1 += '';
        //$('#spanLoggedInUser').html(h1);




        //alert('Calling renderHomePagePersonalizedSection_AndRenderButtons().xcx111223-1');
        //console.log('');
        //console.log('----------------------------');
        //console.log('Commented this line out here... just a note in case it broke anything, but it get\'s called elsewhere so I think we are Ok: renderHomePagePersonalizedSection_AndRenderButtons(); 2-17-2022');
        //console.log('----------------------------');
        //console.log('');
        //renderHomePagePersonalizedSection_AndRenderButtons();



    } catch (e) {
        console.log('Exception in my.js.renderWelcomeScreen():6:', e.message + ', ' + e.stack);
        displayAlertDialog('Exception in my.js.renderWelcomeScreen():6:', e.message);
    }
}

function renderWelcomeScreen_old() {
    try {
        console.log('In renderWelcomeScreen_old().');
        //debugger;
        //displayAlertDialog('renderWelcomeScreen');

        // PUT THIS HERE 8-10-2020
        $('#bwStartPageAccordion').show();

        $('#liWelcome').show();
        $('#liNewRequest').hide();
        $('#liArchive').hide();
        $('#liSummaryReport').hide();
        $('#liConfiguration').hide();
        $('#liVisualizations').hide();
        $('#liHelp').hide();

        try {
            document.getElementById('spanNotLoggedInBetaBanner').style.display = 'none';
            document.getElementById('spanLoggedInBetaBanner').style.display = 'block';
        } catch (e) { }

        //var financialOrParticipantSummaryOptions = {
        //    checked: false, // DEFAULT TO THE FINANCIAL SUMMARY. This fixes an issue when the participant summary is rendered first. The participant summary relies on the financial summary being rendered first.
        //    show_labels: true,         // Should we show the on and off labels?
        //    labels_placement: "both",  // Position of the labels: "both", "left" or "right"
        //    on_label: "Participant<br />Summary",            // Text to be displayed when checked
        //    off_label: "Financial<br />Summary",          // Text to be displayed when unchecked
        //    width: 50,                 // Width of the button in pixels
        //    height: 22,                // Height of the button in pixels
        //    button_width: 24,         // Width of the sliding part in pixels
        //    clear_after: null         // Override the element after which the clearing div should be inserted 
        //};
        //$("input#financialOrParticipantSummary").switchButton(financialOrParticipantSummaryOptions);

        //setCustomSizesDependingOnTheDevice();

        //$('#financialOrParticipantSummary').change(function () {


        //    //displayAlertDialog('financialOrParticipantSummary.change()');


        //    if (!$('#financialOrParticipantSummary').is(':checked')) {
        //        if (!$('#budgetRequestsOrQuotes').is(':checked')) {
        //            renderFinancialSummary9(false);
        //        } else if ($('#budgetRequestsOrQuotes').is(':checked')) {
        //            renderFinancialSummary9(true);
        //        } else {
        //            displayAlertDialog('budgetRequestsOrQuotes is in an invalid state.');
        //        }
        //    } else if ($('#financialOrParticipantSummary').is(':checked')) {
        //        if (!$('#budgetRequestsOrQuotes').is(':checked')) {
        //            renderParticipantSummary(false);
        //        } else if ($('#budgetRequestsOrQuotes').is(':checked')) {
        //            renderParticipantSummary(true);
        //        } else {
        //            displayAlertDialog('budgetRequestsOrQuotes is in an invalid state.');
        //        }
        //    } else {
        //        displayAlertDialog('financialOrParticipantSummary is in an invalid state.');
        //    }
        //});














        // WHY DO WE DO THIS HERE??? IT SHOULD HAVE HAPPENED ALREADY 8-6-2020
        webserviceurl = globalUrlPrefix + globalUrlForWebServices + '/_bw';
        appweburl = globalUrlPrefix + globalUrlForWebServices;
        appweburl2 = globalUrlPrefix + globalUrl;
        // This zooms the screen when the user first navigates to the website! More about this in the Budget Workflow Manager codebase.
        //if (navigator.userAgent.match(/iPhone/i)) {
        //    $('#bwMyPage').animate({ 'zoom': 3 }, 400);
        //}
        // todd turned off 10-20-19

        //debugger;

        $('#divWelcomeMasterDivTitle').text('Home');
        $('#divMenuMasterDivWelcomeButton').css({
            'border-width': '0px', 'margin': '0px 0px 0px 0px', 'padding': '12px 0px 0px 20px', 'outline': 'rgb(59, 103, 142) dashed 1px', 'border-radius': '0px', 'width': '92%', 'height': '28px', 'color': '#dcdcdc', 'background-color': 'white'
        });

        // First we have to display them in the top bar.
        if (participantLogonType) {
            $('#spanLoggedInUserWelcomePage').text(participantFriendlyName);
            $('#spanLoggedInUserNewRequestPage').text(participantFriendlyName);
            $('#spanLoggedInUserArchivePage').text(participantFriendlyName);
            $('#spanLoggedInUserSummaryReportPage').text(participantFriendlyName);
            $('#spanLoggedInUserConfigurationPage').text(participantFriendlyName);
            $('#spanLoggedInUserVisualizationsPage').text(participantFriendlyName);
            $('#spanLoggedInUserHelpPage').text(participantFriendlyName);
        }

        //var h1 = '';
        //h1 += '<img src="/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;vertical-align:top;" />&nbsp;' + participantFriendlyName + '';
        //h1 += '';
        //h1 += '';
        //h1 += '';
        //$('#spanLoggedInUser').html(h1);





        //renderHomePagePersonalizedSection();



    } catch (e) {
        debugger;
        console.log('Exception in my.js.renderWelcomeScreen():6:', e.message + ', ' + e.stack);
        displayAlertDialog('Exception in my.js.renderWelcomeScreen():6:', e.message);
    }
}

function populateCheckbox_ForestAdministratorToReviewEmailsBeforeSending() {
    console.log('In populateCheckbox_ForestAdministratorToReviewEmailsBeforeSending().');
    $.ajax({
        url: webserviceurl + "/getstatusofForestAdministratorToReviewEmailsBeforeSending",
        type: "GET",
        contentType: 'application/json',
        success: function (data) {
            try {
                if (data && data[0] && data[0].ForestAdministratorToReviewEmailsBeforeSending && data[0].ForestAdministratorToReviewEmailsBeforeSending == true) {
                    // Set checkbox to true/checked. // checkboxForestAdministratorToReviewEmailsBeforeSending
                    if (document.getElementById('checkboxForestAdministratorToReviewEmailsBeforeSending')) {
                        document.getElementById('checkboxForestAdministratorToReviewEmailsBeforeSending').setAttribute('checked', 'checked');
                    }
                } else {
                    // Set checkbox to false/unchecked.
                    if (document.getElementById('checkboxForestAdministratorToReviewEmailsBeforeSending')) {
                        document.getElementById('checkboxForestAdministratorToReviewEmailsBeforeSending').removeAttribute('checked', '');
                    }
                }

                if (data && data[0] && data[0].NotifyForestAdministratorToReviewEmailsViaSms && data[0].NotifyForestAdministratorToReviewEmailsViaSms == true) {
                    // Set checkbox to true/checked. // checkboxForestAdministratorToReviewEmailsBeforeSending
                    if (document.getElementById('checkboxNotifyForestAdministratorToReviewEmailsViaSms')) {
                        document.getElementById('checkboxNotifyForestAdministratorToReviewEmailsViaSms').setAttribute('checked', 'checked');
                    }
                } else {
                    // Set checkbox to false/unchecked.
                    if (document.getElementById('checkboxNotifyForestAdministratorToReviewEmailsViaSms')) {
                        document.getElementById('checkboxNotifyForestAdministratorToReviewEmailsViaSms').removeAttribute('checked', '');
                    }
                }
            } catch (e) {
                console.log('Exception in populateCheckbox_ForestAdministratorToReviewEmailsBeforeSending(): ' + e.message + ', ' + e.stack);
                displayAlertDialog('Exception in populateCheckbox_ForestAdministratorToReviewEmailsBeforeSending(): ' + e.message + ', ' + e.stack);
            }
        },
        error: function (data, errorCode, errorMessage) {
            displayAlertDialog('Error in admin.js.populateCheckbox_ForestAdministratorToReviewEmailsBeforeSending():' + errorCode + ', ' + errorMessage);
        }
    });
}

function update_ForestAdministratorToReviewEmailsBeforeSending() {
    try {
        console.log('In update_ForestAdministratorToReviewEmailsBeforeSending().');
        var ForestAdministratorToReviewEmailsBeforeSending = true;
        if (!document.getElementById('checkboxForestAdministratorToReviewEmailsBeforeSending').checked) {
            ForestAdministratorToReviewEmailsBeforeSending = false;
        }
        var data = {
            ForestAdministratorToReviewEmailsBeforeSending: ForestAdministratorToReviewEmailsBeforeSending
        };
        var operationUri = webserviceurl + "/UpdateForestAdministratorToReviewEmailsBeforeSending";
        $.ajax({
            url: operationUri,
            type: "POST",
            timeout: ajaxTimeout,
            data: data,
            headers: {
                "Accept": "application/json; odata=verbose"
            },
            success: function (result) {
                if (result.message == 'SUCCESS') {
                    displayAlertDialog('This operation has been completed: ' + JSON.stringify(result));
                } else {
                    displayAlertDialog('ERROR: This operation has been completed: ' + JSON.stringify(result));
                }


            },
            error: function (data, errorCode, errorMessage) {
                displayAlertDialog('Error in admin.js.update_ForestAdministratorToReviewEmailsBeforeSending():1: ' + errorMessage);
            }
        });
        //}
    } catch (e) {
        displayAlertDialog('Exception in admin.js.update_ForestAdministratorToReviewEmailsBeforeSending():2: ' + e.message + ', ' + e.stack);
    }
}


function update_NotifyForestAdministratorToReviewEmailsViaSms() {
    try {
        console.log('In update_NotifyForestAdministratorToReviewEmailsViaSms().');
        var NotifyForestAdministratorToReviewEmailsViaSms = true;
        if (!document.getElementById('checkboxNotifyForestAdministratorToReviewEmailsViaSms').checked) {
            NotifyForestAdministratorToReviewEmailsViaSms = false;
        }
        var data = {
            NotifyForestAdministratorToReviewEmailsViaSms: NotifyForestAdministratorToReviewEmailsViaSms
        };
        var operationUri = webserviceurl + "/UpdateNotifyForestAdministratorToReviewEmailsViaSms";
        $.ajax({
            url: operationUri,
            type: "POST",
            timeout: ajaxTimeout,
            data: data,
            headers: {
                "Accept": "application/json; odata=verbose"
            },
            success: function (result) {
                if (result.message == 'SUCCESS') {
                    displayAlertDialog('This operation has been completed: ' + JSON.stringify(result));
                } else {
                    displayAlertDialog('ERROR: This operation has been completed: ' + JSON.stringify(result));
                }


            },
            error: function (data, errorCode, errorMessage) {
                displayAlertDialog('Error in admin.js.update_NotifyForestAdministratorToReviewEmailsViaSms():1: ' + errorMessage);
            }
        });
        //}
    } catch (e) {
        displayAlertDialog('Exception in admin.js.update_NotifyForestAdministratorToReviewEmailsViaSms():2: ' + e.message + ', ' + e.stack);
    }
}


function cmdViewBudgetRequestXml() {

    // Use ajax PUT.
    $('#txtBudgetRequestXml').empty();
    var data = {
        //"bwTenantId": "null",
        //"bwTenantOwnerFacebookUserId": "test1",
        //"bwTenantOwnerLinkedInUserId": "test1",
        //"bwTenantOwnerFriendlyName": "Todd Hiltz1",
        //"bwTenantOwnerEmail": "todd1@capexworkflow.com",
        //"bwWorkflows": "null"
    };
    var budgetRequestId = document.getElementById('txtBudgetRequestId').value;
    var operationUri = webserviceurl + "/bwbudgetrequests/" + budgetRequestId;
    $.ajax({
        url: operationUri,
        type: "GET",
        contentType: 'application/json',
        success: function (data) {
            //displayAlertDialog('data: ' + JSON.stringify(data.d.results[0][0].bwTenantId));
            var html = '';
            //for (var i = 0; i < data.length; i++) {
            //html += 'Owner:' + data[i].bwTenantOwnerFriendlyName + ', FB User Id:' + data[i].bwTenantOwnerFacebookUserId + ', Tenant Id:' + data[i].bwTenantId + '<br/>';
            html += data.d.results[0][0].bwRequestJson + '<br/>'; // TODD: I don't like how this data is getting returned.
            //html += '';
            //}
            html += 'DONE';
            $('#txtBudgetRequestXml').text(html);
        },
        error: function (data, errorCode, errorMessage) {
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in admin.js.cmdViewBudgetRequestXml():' + errorCode + ', ' + errorMessage);
        }
    });


}

function cmdViewCloseoutXml() {
    $('#txtCloseoutXml').empty();
    var budgetRequestId = document.getElementById('txtCloseoutId').value;
    var operationUri = webserviceurl + "/bwbudgetrequests/" + budgetRequestId;
    $.ajax({
        url: operationUri,
        type: "GET",
        contentType: 'application/json',
        success: function (data) {
            var html = '';
            html += data.d.results[0][0].CloseoutXml + '<br/>';
            html += 'DONE';
            $('#txtCloseoutXml').text(html);
        },
        error: function (data, errorCode, errorMessage) {
            displayAlertDialog('Error in admin.js.cmdViewCloseoutXml():' + errorCode + ', ' + errorMessage);
        }
    });
}


function cmdViewRecurringExpenseXml() {

    // Use ajax PUT.
    $('#txtRecurringExpenseXml').empty();
    var data = {
        //"bwTenantId": "null",
        //"bwTenantOwnerFacebookUserId": "test1",
        //"bwTenantOwnerLinkedInUserId": "test1",
        //"bwTenantOwnerFriendlyName": "Todd Hiltz1",
        //"bwTenantOwnerEmail": "todd1@capexworkflow.com",
        //"bwWorkflows": "null"
    };
    var bwRecurringExpenseId = document.getElementById('txtRecurringExpenseId').value;
    var operationUri = webserviceurl + "/bwrecurringexpenses/" + bwRecurringExpenseId;
    $.ajax({
        url: operationUri,
        type: "GET",
        contentType: 'application/json',
        success: function (data) {
            //displayAlertDialog('data: ' + JSON.stringify(data.d.results[0][0].bwTenantId));
            var html = '';
            //for (var i = 0; i < data.length; i++) {
            //html += 'Owner:' + data[i].bwTenantOwnerFriendlyName + ', FB User Id:' + data[i].bwTenantOwnerFacebookUserId + ', Tenant Id:' + data[i].bwTenantId + '<br/>';
            html += data.d.results[0][0].bwDocumentXml + '<br/>'; // TODD: I don't like how this data is getting returned.
            //html += '';
            //}
            html += 'DONE';
            $('#txtRecurringExpenseXml').text(html);
        },
        error: function (data, errorCode, errorMessage) {
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in admin.js.cmdViewRecurringExpenseXml():' + errorCode + ', ' + errorMessage);
        }
    });


}

function cmdListAllTimerLogs() {
    // Use ajax PUT.
    $('#txtBwTimerLogs').empty();
    var data = {
        //"bwTenantId": "null",
        //"bwTenantOwnerFacebookUserId": "test1",
        //"bwTenantOwnerLinkedInUserId": "test1",
        //"bwTenantOwnerFriendlyName": "Todd Hiltz1",
        //"bwTenantOwnerEmail": "todd1@capexworkflow.com",
        //"bwWorkflows": "null"
    };

    $.ajax({
        url: webserviceurl + "/bwtimerlogs",
        type: "DELETE",
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (data) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                //html += 'Owner:' + data[i].bwTenantOwnerFriendlyName + ', FB User Id:' + data[i].bwTenantOwnerFacebookUserId + ', Tenant Id:' + data[i].bwTenantId + '<br/>';
                html += 'Log Entry:' + data[i].bwTimerLogEntryCreatedTimestamp + ' Justification details:' + data[i].bwTimerLogEntryDetails + '\n';
                //html += '';
            }
            html += 'DONE';
            $('#txtBwTimerLogs').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in admin.js.cmdListAllTimerLogs():' + errorCode + ', ' + errorMessage);
        }
    });
}

//function cmdDeleteAllExceptionLogs(threatLevel) {
//    try {
//        // If we specify a threatLevel, just delete those ones, or otherwise delete the whole logs.
//        console.log('In cmdDeleteAllExceptionLogs().');
//        //$('#txtBwTimerLogs').empty();
//        if (threatLevel) {
//            $.ajax({
//                url: webserviceurl + "/bwexceptionlogs/delete/" + threatLevel,
//                type: "DELETE",
//                contentType: 'application/json',
//                success: function (data) {
//                    cmdRefreshAdminPage();
//                    //$('#txtBwTimerLogs').empty();
//                    //var html = '';
//                    ////for (var i = 0; i < data.length; i++) {
//                    ////    //html += 'Owner:' + data[i].bwTenantOwnerFriendlyName + ', FB User Id:' + data[i].bwTenantOwnerFacebookUserId + ', Tenant Id:' + data[i].bwTenantId + '<br/>';
//                    ////    html += 'Log Entry Justification details:' + data[i].bwTimerLogEntryDetails + '<br/>';
//                    ////    //html += '';
//                    ////}
//                    //html += 'DONE';
//                    //$('#txtBwTimerLogs').append(html);
//                },
//                error: function (data, errorCode, errorMessage) {
//                    displayAlertDialog('Error in admin.js.cmdDeleteAllExceptionLogs():' + errorCode + ', ' + errorMessage);
//                }
//            });
//        } else {
//            $.ajax({
//                url: webserviceurl + "/bwexceptionlogs/delete",
//                type: "DELETE",
//                contentType: 'application/json',
//                success: function (data) {
//                    cmdRefreshAdminPage();
//                    //$('#txtBwTimerLogs').empty();
//                    //var html = '';
//                    ////for (var i = 0; i < data.length; i++) {
//                    ////    //html += 'Owner:' + data[i].bwTenantOwnerFriendlyName + ', FB User Id:' + data[i].bwTenantOwnerFacebookUserId + ', Tenant Id:' + data[i].bwTenantId + '<br/>';
//                    ////    html += 'Log Entry Justification details:' + data[i].bwTimerLogEntryDetails + '<br/>';
//                    ////    //html += '';
//                    ////}
//                    //html += 'DONE';
//                    //$('#txtBwTimerLogs').append(html);
//                },
//                error: function (data, errorCode, errorMessage) {
//                    displayAlertDialog('Error in admin.js.cmdDeleteAllExceptionLogs():' + errorCode + ', ' + errorMessage);
//                }
//            });
//        }
//    } catch (e) {
//        console.log('Exception in cmdDeleteAllExceptionLogs(): ' + e.message + ', ' + e.stack);
//    }
//}

function cmdStartWorkflowTimer() {
    // Use ajax PUT.
    $('#spanWorkflowTimerStatus').empty();
    //var data = {
    //    //"bwTenantId": "null",
    //    //"bwTenantOwnerFacebookUserId": "test1",
    //    //"bwTenantOwnerLinkedInUserId": "test1",
    //    //"bwTenantOwnerFriendlyName": "Todd Hiltz1",
    //    //"bwTenantOwnerEmail": "todd1@capexworkflow.com",
    //    //"bwWorkflows": "null"
    //};

    $.ajax({
        url: webserviceurl + "/startworkflowtimer",
        type: "PUT",
        contentType: 'application/json',
        //data: JSON.stringify(data),
        success: function (data) {
            //displayAlertDialog(data);
            //$('#spanWorkflowTimerStatus').append(data);
            //$('#spanWorkflowTimerStatus').append(data);
            cmdGetStatusOfWorkflowTimer();
        },
        error: function (data, errorCode, errorMessage) {
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in admin.js.cmdStartWorkflowTimer():' + errorCode + ', ' + errorMessage);
        }
    });
}

function cmdStopWorkflowTimer() {
    $('#spanWorkflowTimerStatus').empty();
    // Use ajax PUT.
    var data = {
        //"bwTenantId": "null",
        //"bwTenantOwnerFacebookUserId": "test1",
        //"bwTenantOwnerLinkedInUserId": "test1",
        //"bwTenantOwnerFriendlyName": "Todd Hiltz1",
        //"bwTenantOwnerEmail": "todd1@capexworkflow.com",
        //"bwWorkflows": "null"
    };

    $.ajax({
        url: webserviceurl + "/stopworkflowtimer",
        type: "PUT",
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (data) {
            //displayAlertDialog(data);
            //$('#spanWorkflowTimerStatus').append(data);
            cmdGetStatusOfWorkflowTimer();
        },
        error: function (data, errorCode, errorMessage) {
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in admin.js.cmdStopWorkflowTimer():' + errorCode + ', ' + errorMessage);
        }
    });
}

function cmdGetStatusOfWorkflowTimer() {
    $('#spanWorkflowTimerStatus').empty();
    $.ajax({
        url: webserviceurl + "/getstatusofworkflowtimer",
        type: "GET",
        contentType: 'application/json',
        success: function (data) {
            var html = '';
            if (data == 'started') {
                // Green.
                html += '<span style="color:#009933;">' + data + '</span>';
                html += '&nbsp;&nbsp;<input type="button" value="stop" onclick="cmdStopWorkflowTimer();" />';
            } else {
                // Red.
                html += '<span style="color:#ff0000;">' + data + '</span>';
                html += '&nbsp;&nbsp;<input type="button" value="start" onclick="cmdStartWorkflowTimer();" />';
            }
            $('#spanWorkflowTimerStatus').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            displayAlertDialog('Error in admin.js.cmdGetStatusOfWorkflowTimer():' + errorCode + ', ' + errorMessage);
        }
    });
}

function cmdStartImapListener() {
    var operationUri = webserviceurl + "/startimaplistener";
    $.ajax({
        url: operationUri,
        type: "POST", timeout: ajaxTimeout,
        //data: _workflowDetails,
        headers: {
            "Accept": "application/json; odata=verbose"
        },
        success: function (data) {
            if (data == 'SUCCESS') {
                cmdGetStatusOfImap();
            } else {
                displayAlertDialog('There was a problem starting the email listener(imap): ' + data);
                cmdGetStatusOfImap();
            }

        },
        error: function (data, errorCode, errorMessage) {
            displayAlertDialog('Error in admin.js.cmdStartImapListener(): ' + errorCode + ' ' + errorMessage);
        }
    });

}

function cmdGetStatusOfImap() {
    $('#spanImapStatus').empty();
    $.ajax({
        url: webserviceurl + "/getstatusofimap",
        type: "GET",
        contentType: 'application/json',
        success: function (data) {
            var html = '';
            if (data == 'connected') {
                // Green.
                html += '<span style="color:#009933;">' + data + '</span>';
            } else {
                // Red.
                html += '<span style="color:#ff0000;">' + data + '</span>';
                html += '&nbsp;&nbsp;<input type="button" value="start" onclick="cmdStartImapListener();" />';
            }
            $('#spanImapStatus').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            displayAlertDialog('Error in admin.js.cmdGetStatusOfImap():' + errorCode + ', ' + errorMessage);
        }
    });
}

function displayFileServerDiskSpace() {
    try {
        console.log('In displayFileServerDiskSpace().');
        //displayAlertDialog('In displayServerTime().');
        $('#spanFileServerDiskSpace').empty();
        $.ajax({
            url: 'https://' + globalUrl + '/_files' + '/getfileserverdiskspace',
            type: "GET",
            contentType: 'application/json',
            success: function (data) {
                //var timestamp4 = getBudgetWorkflowStandardizedDate(data);
                //var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(data);
                $('#spanFileServerDiskSpace').html(data.available + ' GB');
            },
            error: function (data, errorCode, errorMessage) {
                displayAlertDialog('Error in admin.js.displayServerTime():' + errorCode + ', ' + errorMessage);
            }
        });
    } catch (e) {
        console.log('Exception in displayFileServerDiskSpace(): ' + e.message + ', ' + e.stack);
        displayAlertDialog('Exception in displayFileServerDiskSpace(): ' + e.message + ', ' + e.stack);
    }
}

function displayServerTime() {
    try {
        console.log('In displayServerTime().');
        //displayAlertDialog('In displayServerTime().');
        $('#spanServerTime').empty();
        $.ajax({
            url: webserviceurl + "/getservertime",
            type: "GET",
            contentType: 'application/json',
            success: function (data) {
                //var timestamp4 = getBudgetWorkflowStandardizedDate(data);
                var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(data);
                $('#spanServerTime').html(timestamp4);
            },
            error: function (data, errorCode, errorMessage) {
                displayAlertDialog('Error in admin.js.displayServerTime():' + errorCode + ', ' + errorMessage);
            }
        });
    } catch (e) {
        console.log('Exception in xx(): ' + e.message + ', ' + e.stack);
        displayAlertDialog('Exception in xx(): ' + e.message + ', ' + e.stack);
    }
}


function cmdListAllBwNewTenantOrganizationSettings() {
    // Use ajax PUT.
    $('#txtBwNewTenantOrganizationSettings').empty();
    var data = {
        //"bwTenantId": "null",
        //"bwTenantOwnerFacebookUserId": "test1",
        //"bwTenantOwnerLinkedInUserId": "test1",
        //"bwTenantOwnerFriendlyName": "Todd Hiltz1",
        //"bwTenantOwnerEmail": "todd1@capexworkflow.com",
        //"bwWorkflows": "null"
    };

    $.ajax({
        url: webserviceurl + "/bwnewtenantorganizationsettingsfindall",
        type: "DELETE",
        contentType: 'application/json',
        //data: JSON.stringify(data),
        success: function (data) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                //html += 'bwTenantId:' + data[i].bwTenantId + ' ';
                html += 'bwNewTenantOrganizationSettingsId:' + data[i].bwNewTenantOrganizationSettingsId + ' ';
                html += 'bwNewTenantOrganizationSettingsActive:' + data[i].bwNewTenantOrganizationSettingsActive + ' ';
                html += 'bwOrgRolesJson:' + data[i].bwOrgRolesJson + ' ';
                //html += 'bwParticipantEmail:' + data[i].bwParticipantEmail + ' ';
                //html += 'bwWorkflowAppId:' + data[i].bwWorkflowAppId + ' ';
                //html += 'bwParticipantId:' + data[i].bwParticipantId + ' ';
                //html += 'Created:' + data[i].Created + ' ';
                //html += 'Modified:' + data[i].Modified + ' ';
                //html += 'Owner:' + data[i].bwTenantOwnerFriendlyName + ', User Id:' + data[i].bwTenantOwnerId + ', Tenant Id:' + data[i].bwTenantId;
                html += '\n\n';
            }
            html += 'DONE';
            $('#txtBwNewTenantOrganizationSettings').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in cmdListAllBwNewTenantOrganizationSettings():' + errorCode + ', ' + errorMessage);
        }
    });
}



function cmdListAllBwWorkflowUsers() {
    // Use ajax PUT.
    $('#txtBwWorkflowUsers').empty();
    var data = {
        //"bwTenantId": "null",
        //"bwTenantOwnerFacebookUserId": "test1",
        //"bwTenantOwnerLinkedInUserId": "test1",
        //"bwTenantOwnerFriendlyName": "Todd Hiltz1",
        //"bwTenantOwnerEmail": "todd1@capexworkflow.com",
        //"bwWorkflows": "null"
    };

    $.ajax({
        url: webserviceurl + "/bwworkflowusersfindall",
        type: "DELETE",
        contentType: 'application/json',
        //data: JSON.stringify(data),
        success: function (data) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                //html += 'bwTenantId:' + data[i].bwTenantId + ' ';
                html += 'bwWorkflowAppTitle:' + data[i].bwWorkflowAppTitle + ' ';
                html += 'bwParticipantRole:' + data[i].bwParticipantRole + ' ';
                html += 'bwParticipantFriendlyName:' + data[i].bwParticipantFriendlyName + ' ';
                html += 'bwParticipantEmail:' + data[i].bwParticipantEmail + ' ';
                html += 'bwWorkflowAppId:' + data[i].bwWorkflowAppId + ' ';
                html += 'bwParticipantId:' + data[i].bwParticipantId + ' ';
                html += 'Created:' + data[i].Created + ' ';
                html += 'Modified:' + data[i].Modified + ' ';
                //html += 'Owner:' + data[i].bwTenantOwnerFriendlyName + ', User Id:' + data[i].bwTenantOwnerId + ', Tenant Id:' + data[i].bwTenantId;
                html += '\n\n';
            }
            html += 'DONE';
            $('#txtBwWorkflowUsers').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in admin.js.cmdListAllBwWorkflowUsers():' + errorCode + ', ' + errorMessage);
        }
    });
}

function cmdListAllBwRoles() {
    // Use ajax PUT.
    $('#txtBwOrgRoles').empty();
    var data = {
        //"bwTenantId": "null",
        //"bwTenantOwnerFacebookUserId": "test1",
        //"bwTenantOwnerLinkedInUserId": "test1",
        //"bwTenantOwnerFriendlyName": "Todd Hiltz1",
        //"bwTenantOwnerEmail": "todd1@capexworkflow.com",
        //"bwWorkflows": "null"
    };

    $.ajax({
        url: webserviceurl + "/bwrolesfindall", // "/bwworkflowuserrolesfindall",
        type: "DELETE",
        contentType: 'application/json',
        //data: JSON.stringify(data),
        success: function (data) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                //html += 'bwTenantId:' + data[i].bwTenantId + ' ';
                html += 'bwRoleId:' + data[i].bwRoleId + ' ';
                html += 'bwTenantId:' + data[i].bwTenantId + ' ';
                html += 'bwWorkflowAppId:' + data[i].bwWorkflowAppId + ' ';
                html += 'RoleId:' + data[i].RoleId + ' ';
                html += 'RoleName:' + data[i].RoleName + ' ';
                html += 'Singleton:' + data[i].Singleton + ' ';
                html += 'bwRoleActive:' + data[i].bwRoleActive + ' ';
                html += '\n\n';

                //bwRoleId: { type: String, index: { unique: true } },
                //bwTenantId: String,
                //bwWorkflowAppId: String,
                //Created: String,
                //CreatedBy: String,
                //CreatedById: String,
                //CreatedByEmail: String,
                //Modified: String,
                //ModifiedByFriendlyName: String,
                //ModifiedById: String,
                //ModifiedByEmail: String,

                //RoleId: String, // eg: CEO
                //RoleName: String, // eg: Chief Executive Officer
                //Singleton: Boolean, // For instance, the CEO can only appear at the root of the organization, so in his/her case, this would be true.

                //bwRoleActive: Boolean // In the
            }
            html += 'DONE';
            $('#txtBwRoles').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in admin.js.cmdListAllBwRoles():' + errorCode + ', ' + errorMessage);
        }
    });
}

function cmdListAllBwWorkflowUserRoles() {
    // Use ajax PUT.
    $('#txtBwWorkflowUserRoles').empty();
    var data = {
        //"bwTenantId": "null",
        //"bwTenantOwnerFacebookUserId": "test1",
        //"bwTenantOwnerLinkedInUserId": "test1",
        //"bwTenantOwnerFriendlyName": "Todd Hiltz1",
        //"bwTenantOwnerEmail": "todd1@capexworkflow.com",
        //"bwWorkflows": "null"
    };

    $.ajax({
        url: webserviceurl + "/bwworkflowuserrolesfindall",
        type: "DELETE",
        contentType: 'application/json',
        //data: JSON.stringify(data),
        success: function (data) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                //html += 'bwTenantId:' + data[i].bwTenantId + ' ';
                html += 'OrgId:' + data[i].OrgId + ' ';
                html += 'RoleId:' + data[i].RoleId + ' ';
                html += 'bwParticipantFriendlyName:' + data[i].bwParticipantFriendlyName + ' ';
                html += 'bwParticipantEmail:' + data[i].bwParticipantEmail + ' ';
                html += 'bwWorkflowAppId:' + data[i].bwWorkflowAppId + ' ';
                html += 'bwParticipantId:' + data[i].bwParticipantId + ' ';
                html += 'Created:' + data[i].Created + ' ';
                html += 'Modified:' + data[i].Modified + ' ';
                html += 'Active:' + data[i].Active + ' ';
                //html += 'Owner:' + data[i].bwTenantOwnerFriendlyName + ', User Id:' + data[i].bwTenantOwnerId + ', Tenant Id:' + data[i].bwTenantId;
                html += '\n\n';
            }
            html += 'DONE';
            $('#txtBwWorkflowUserRoles').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in admin.js.cmdListAllBwWorkflowUserRoles():' + errorCode + ', ' + errorMessage);
        }
    });
}







function cmdDeleteAllBwWorkflowUserRoleEntriesWithOrgIdIsALL() {
    try {
        console.log('In cmdDeleteAllBwWorkflowUserRoleEntriesWithOrgIdIsALL().');
        var proceed = confirm('Are you certain?\n\nThis action cannot be undone.\n\nClick the OK button to proceed...');
        if (proceed) {
            var data = {
                //bwTenantId: bwTenantId,
                //bwTenantOwnerId: bwTenantOwnerId
            };
            var operationUri = webserviceurl + "/DeleteAllBwWorkflowUserRoleEntriesWithOrgIdIsALL";
            $.ajax({
                url: operationUri,
                type: "POST",
                timeout: ajaxTimeout,
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (result) {
                    if (result.message == 'SUCCESS') {
                        displayAlertDialog('This operation has been completed: ' + JSON.stringify(result));
                    } else {
                        displayAlertDialog('ERROR: This operation has been completed: ' + JSON.stringify(result));
                    }


                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in admin.js.cmdDeleteAllBwWorkflowUserRoleEntriesWithOrgIdIsALL():1: ' + errorMessage);
                }
            });
        }
    } catch (e) {
        displayAlertDialog('Exception in admin.js.cmdDeleteAllBwWorkflowUserRoleEntriesWithOrgIdIsALL():2: ' + e.message + ', ' + e.stack);
    }
}










function cmdListAllBwOrgRoles() {
    // Use ajax PUT.
    $('#txtBwOrgRoles').empty();
    var data = {
        //"bwTenantId": "null",
        //"bwTenantOwnerFacebookUserId": "test1",
        //"bwTenantOwnerLinkedInUserId": "test1",
        //"bwTenantOwnerFriendlyName": "Todd Hiltz1",
        //"bwTenantOwnerEmail": "todd1@capexworkflow.com",
        //"bwWorkflows": "null"
    };

    $.ajax({
        url: webserviceurl + "/bworgrolesfindall", // "/bwworkflowuserrolesfindall",
        type: "DELETE",
        contentType: 'application/json',
        //data: JSON.stringify(data),
        success: function (data) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                //html += 'bwTenantId:' + data[i].bwTenantId + ' ';
                html += 'bwOrgRolesId:' + data[i].bwOrgRolesId + ' ';
                html += 'bwTenantId:' + data[i].bwTenantId + ' ';
                html += 'bwWorkflowAppId:' + data[i].bwWorkflowAppId + ' ';
                html += 'bwOrgRolesActive:' + data[i].bwOrgRolesActive + ' ';
                html += 'bwOrgRolesJson:' + JSON.stringify(data[i].bwOrgRolesJson) + ' ';
                html += '\n\n';

            }
            html += 'DONE';
            $('#txtBwOrgRoles').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in admin.js.cmdListAllBwOrgRoles():' + errorCode + ', ' + errorMessage);
        }
    });
}


function cmdListAllTenants() {
    // Use ajax PUT.
    $('#txtBwTenants').empty();
    var data = {
        //"bwTenantId": "null",
        //"bwTenantOwnerFacebookUserId": "test1",
        //"bwTenantOwnerLinkedInUserId": "test1",
        //"bwTenantOwnerFriendlyName": "Todd Hiltz1",
        //"bwTenantOwnerEmail": "todd1@capexworkflow.com",
        //"bwWorkflows": "null"
    };

    $.ajax({
        url: webserviceurl + "/bwtenantsfindall",
        type: "POST",
        contentType: 'application/json',
        //data: JSON.stringify(data),
        success: function (data) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                html += 'Owner:' + data[i].bwTenantOwnerFriendlyName + ', User Id:' + data[i].bwTenantOwnerId + ', Tenant Id:' + data[i].bwTenantId;
                html += '\n\n';
            }
            html += 'DONE';
            $('#txtBwTenants').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in admin.js.cmdListAllTenants():' + errorCode + ', ' + errorMessage);
        }
    });
}

function cmdListAllLicenses() {
    // Use ajax PUT.
    $('#txtBwWorkflowAppLicenses').empty();
    var data = {
        //"bwTenantId": "null",
        //"bwTenantOwnerFacebookUserId": "test1",
        //"bwTenantOwnerLinkedInUserId": "test1",
        //"bwTenantOwnerFriendlyName": "Todd Hiltz1",
        //"bwTenantOwnerEmail": "todd1@capexworkflow.com",
        //"bwWorkflows": "null"
    };

    $.ajax({
        url: webserviceurl + "/bwworkflowapplicensesfindall",
        type: "DELETE",
        contentType: 'application/json',
        //data: JSON.stringify(data),
        success: function (data) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                html += 'LicenseNotificationSent:' + data[i].LicenseNotificationSent + ', ';
                html += 'InvoiceNumber:' + data[i].InvoiceNumber + ', ';
                html += 'LicenseNotificationSentToEmail:' + data[i].LicenseNotificationSentToEmail + ', ';
                html += 'LicenseSku:' + data[i].LicenseSku + ', ';
                html += 'LicenseTitle:' + data[i].LicnseTitle + ', ';
                html += 'LicenseQuantity:' + data[i].LicenseQuantity + ', ';
                html += 'LicenseClaimed:' + data[i].LicenseClaimed + ', ';

                html += 'LicensePackageCategory:' + data[i].LicensePackageCategory + ', ';
                html += 'LicenseClaimedTimestamp:' + data[i].LicenseClaimedTimestamp + ', ';
                html += 'bwWorkflowAppId:' + data[i].bwWorkflowAppId + ', ';

                html += 'LicenseClaimedByFriendlyName:' + data[i].LicenseClaimedByFriendlyName + ', ';
                html += 'LicenseClaimedByEmail:' + data[i].LicenseClaimedByEmail + ', ';

                html += 'bwWorkflowAppLicenseId:' + data[i].bwWorkflowAppLicenseId;

                html += '\n\n';
            }
            html += 'DONE';
            $('#txtBwWorkflowAppLicenses').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in admin.js.cmdListAllLicenses():' + errorCode + ', ' + errorMessage);
        }
    });
}

function cmdListAllWorkflowApps() {
    // Use ajax PUT.
    $('#txtBwWorkflowApps').empty();
    var data = {
        //"bwTenantId": "null",
        //"bwTenantOwnerFacebookUserId": "test1",
        //"bwTenantOwnerLinkedInUserId": "test1",
        //"bwTenantOwnerFriendlyName": "Todd Hiltz1",
        //"bwTenantOwnerEmail": "todd1@capexworkflow.com",
        //"bwWorkflows": "null"
    };

    $.ajax({
        url: webserviceurl + "/bwworkflowapps",
        type: "DELETE",
        contentType: 'application/json',
        //data: JSON.stringify(data),
        success: function (data) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                html += 'Title:' + data[i].bwWorkflowAppTitle + ', Tenant Id:' + data[i].bwTenantId + ', Workflow App Id:' + data[i].bwWorkflowAppId;
                html += '\n\n';
            }
            html += 'DONE';
            $('#txtBwWorkflowApps').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in admin.js.cmdListAllWorkflowApps():' + errorCode + ', ' + errorMessage);
        }
    });
}

function cmdListAllFunctionalAreas() {
    $('#txtBwFunctionalAreas').empty();
    $.ajax({
        url: webserviceurl + "/bwfunctionalareasfindall",
        type: "DELETE",
        contentType: 'application/json',
        success: function (data) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                html += 'IsHidden:' + data[i].IsHidden + ' ';
                html += 'bwFunctionalAreaQuote:' + data[i].bwFunctionalAreaQuote + ' ';

                html += 'bwWorkflowAppId:' + data[i].bwWorkflowAppId + ' ';
                html += 'bwFunctionalAreaId:' + data[i].bwFunctionalAreaId + ' ';
                html += 'bwFunctionalAreaTitle:' + data[i].bwFunctionalAreaTitle + ' ';
                html += 'bwFunctionalAreaYear:' + data[i].bwFunctionalAreaYear + ' ';

                html += 'Approver1Id:' + data[i].Approver1Id + ' ';
                html += 'Approver1FriendlyName:' + data[i].Approver1FriendlyName + ' ';
                html += 'Approver1Email:' + data[i].Approver1Email + ' ';

                html += 'Approver2Id:' + data[i].Approver2Id + ' ';
                html += 'Approver2FriendlyName:' + data[i].Approver2FriendlyName + ' ';
                html += 'Approver2Email:' + data[i].Approver2Email + ' ';

                html += 'Approver3Id:' + data[i].Approver3Id + ' ';
                html += 'Approver3FriendlyName:' + data[i].Approver3FriendlyName + ' ';
                html += 'Approver3Email:' + data[i].Approver3Email + ' ';

                html += 'Approver4Id:' + data[i].Approver4Id + ' ';
                html += 'Approver4FriendlyName:' + data[i].Approver4FriendlyName + ' ';
                html += 'Approver4Email:' + data[i].Approver4Email + ' ';

                html += '\n\n';
            }
            html += 'DONE';
            $('#txtBwFunctionalAreas').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            displayAlertDialog('Error in admin.js.cmdListAllFunctionalAreas():' + errorCode + ', ' + errorMessage);
        }
    });
}


function cmdUpdateFunctionalAreaOneTimeOnly() {
    try {
        console.log('In cmdUpdateFunctionalArea().');
        //$('#txtBwFunctionalAreas').empty();
        //$.ajax({
        //    url: webserviceurl + "/bwupdatefunctionalareaonetime",
        //    type: "DELETE",
        //    contentType: 'application/json',
        //    success: function (data) {
        //        var html = '';
        //        html += JSON.stringify(data);
        //        html += 'DONE';
        //        $('#txtBwFunctionalAreas').append(html);
        //    },
        //    error: function (data, errorCode, errorMessage) {
        //        displayAlertDialog('Error in admin.js.cmdUpdateFunctionalArea():' + errorCode + ', ' + errorMessage);
        //    }
        //});
    } catch (e) {
        console.log('Exception in cmdUpdateFunctionalArea(): ' + e.message + ', ' + e.stack);
    }
}


function cmdDeleteAllTenantsAndParticipants() {
    // This is only for testing
    $.ajax({
        url: webserviceurl + "/testdeleteparticipantsandtenants",
        type: "DELETE",
        contentType: 'application/json',
        //data: JSON.stringify(data),
        success: function (data) {
            displayAlertDialog('All tenants and participants have been deleted.');
            //for (var i = 0; i < data.length; i++) {
            //    html += 'Owner:' + data[i].bwTenantOwnerFriendlyName + ', FB User Id:' + data[i].bwTenantOwnerFacebookUserId + ', Tenant Id:' + data[i].bwTenantId + '<br/>';
            //    //html += '';
            //}
            //html += 'DONE';
            //$('#txtBwTenants').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in admin.js.cmdDeleteAllTenantsAndParticipants():' + errorCode + ', ' + errorMessage);
        }
    });
}

function cmdDeleteAllBwWorkflowAppLicenses() {
    displayAlertDialog('This functionality is not complete. Coming soon!');
    // This is only for testing
    //$.ajax({
    //    url: appweburl + "/testdeleteparticipantsandtenants",
    //    type: "DELETE",
    //    contentType: 'application/json',
    //    //data: JSON.stringify(data),
    //    success: function (data) {
    //        displayAlertDialog('All tenants and participants have been deleted.');
    //        //for (var i = 0; i < data.length; i++) {
    //        //    html += 'Owner:' + data[i].bwTenantOwnerFriendlyName + ', FB User Id:' + data[i].bwTenantOwnerFacebookUserId + ', Tenant Id:' + data[i].bwTenantId + '<br/>';
    //        //    //html += '';
    //        //}
    //        //html += 'DONE';
    //        //$('#txtBwTenants').append(html);
    //    },
    //    error: function (data, errorCode, errorMessage) {
    //        //window.waitDialog.close();
    //        //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
    //        displayAlertDialog('Error in admin.js.cmdDeleteAllBwWorkflowAppLicenses():' + errorCode + ', ' + errorMessage);
    //    }
    //});
}

function cmdDeleteAllBwChecklistTemplates() {
    // This is only for testing
    $.ajax({
        url: webserviceurl + "/testdeleteallbwchecklisttemplatesentries",
        type: "DELETE",
        contentType: 'application/json',
        //data: JSON.stringify(data),
        success: function (data) {
            displayAlertDialog('All BwChecklistTemplates entries have been deleted.');
            //for (var i = 0; i < data.length; i++) {
            //    html += 'Owner:' + data[i].bwTenantOwnerFriendlyName + ', FB User Id:' + data[i].bwTenantOwnerFacebookUserId + ', Tenant Id:' + data[i].bwTenantId + '<br/>';
            //    //html += '';
            //}
            //html += 'DONE';
            //$('#txtBwTenants').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in admin.js.cmdDeleteAllBwChecklistTemplates():' + errorCode + ', ' + errorMessage);
        }
    });
}

function cmdDeleteAllAggregatedEmailEntries() {
    // This is only for testing
    $.ajax({
        url: webserviceurl + "/testdeleteallaggregatedemailentries",
        type: "DELETE",
        contentType: 'application/json',
        //data: JSON.stringify(data),
        success: function (data) {
            displayAlertDialog('All aggregated email entries have been deleted.');
            //for (var i = 0; i < data.length; i++) {
            //    html += 'Owner:' + data[i].bwTenantOwnerFriendlyName + ', FB User Id:' + data[i].bwTenantOwnerFacebookUserId + ', Tenant Id:' + data[i].bwTenantId + '<br/>';
            //    //html += '';
            //}
            //html += 'DONE';
            //$('#txtBwTenants').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in admin.js.cmdDeleteAllAggregatedEmailEntries():' + errorCode + ', ' + errorMessage);
        }
    });
}

function handleExceptionWithAlert(source, message) {
    //// The lastErrorSource is kept track of because we don't want the alert box showing up many times!! Once is enough!
    //if (lastErrorSource != source) {
    //    lastErrorSource = source;
    //    //if (message.indexOf('-1002') > -1) {
    //    //    // This means we need to refresh the page and alert the user their session has timed out.
    //    //    displayAlertDialog('Error -1002, "Not found". Click Ok to refresh the page.');
    //    //} else {
    //        displayAlertDialog(source + ': ' + message);
    //        WriteToErrorLog(source, message);
    //    //}
    //} else {
    //    hostweburl = decodeURIComponent(getQueryStringParameter("SPHostUrl"));
    //    appweburl = decodeURIComponent(getQueryStringParameter("SPAppWebUrl"));
    //    var url = 'Start.aspx?SPHostUrl=' + hostweburl + '&SPAppWebUrl=' + appweburl;
    //    location.href = url;
    //}
    displayAlertDialog(source + ': ' + message);
}

//function cmdListAllParticipants() {
//    // Use ajax.
//    $('#txtBwParticipants').empty();
//    //var data = {
//    //    //"bwTenantId": "null",
//    //    //"bwTenantOwnerFacebookUserId": "test1",
//    //    //"bwTenantOwnerLinkedInUserId": "test1",
//    //    //"bwTenantOwnerFriendlyName": "Todd Hiltz1",
//    //    //"bwTenantOwnerEmail": "todd1@capexworkflow.com",
//    //    //"bwWorkflows": "null"
//    //};

//    $.ajax({
//        url: webserviceurl + "/bwparticipantsfindall",
//        type: "DELETE",
//        contentType: 'application/json',
//        //data: JSON.stringify(data),
//        success: function (data) {
//            var html = '';
//            for (var i = 0; i < data.length; i++) {
//                html += 'bwParticipantLogonType: ' + data[i].bwParticipantLogonType;
//                html += ', ';
//                html += 'bwParticipantLogonTypeUserId: ' + data[i].bwParticipantLogonTypeUserId;
//                html += ', ';
//                html += 'bwParticipantFriendlyName: ' + data[i].bwParticipantFriendlyName;
//                html += ', ';
//                html += 'bwParticipantEmail: ' + data[i].bwParticipantEmail;
//                html += ', ';
//                html += 'bwParticipantRole: ' + data[i].bwParticipantRole;
//                html += ', ';
//                html += 'bwTenantId: ' + data[i].bwTenantId;
//                html += ', ';
//                html += 'bwWorkflowAppId: ' + data[i].bwWorkflowAppId;
//                html += ', ';
//                html += 'bwParticipantId: ' + data[i].bwParticipantId;

//                html += ', ';
//                html += 'customLogonPasswordSalt: ' + data[i].customLogonPasswordSalt;
//                html += ', ';
//                html += 'customLogonPasswordHash: ' + data[i].customLogonPasswordHash;

//                html += ', ';
//                html += 'bwEmailNotificationFrequency: ' + data[i].bwEmailNotificationFrequency;

//                html += ', ';
//                html += 'bwEmailNotificationTypes: ' + data[i].bwEmailNotificationTypes;
//                html += ', ';
//                html += 'bwEmailAggregatorTwiceDailyFirstTime: ' + data[i].bwEmailAggregatorTwiceDailyFirstTime;
//                html += ', ';
//                html += 'bwEmailAggregatorTwiceDailySecondTime: ' + data[i].bwEmailAggregatorTwiceDailySecondTime;
//                html += ', ';
//                html += 'bwEmailAggregatorLastEmailSentTimestamp: ' + data[i].bwEmailAggregatorLastEmailSentTimestamp;

//                html += '\n\n';

//                //html += 'bwParticipantId:' + data[i].bwParticipantId + ', bwTenantId:' + data[i].bwParticipantTenantId + ' bwParticipantEmail:' + data[i].bwParticipantEmail + ' bwParticipantFriendlyName:' + data[i].bwParticipantFriendlyName + '<br/>';
//                //html += '';
//            }
//            html += 'DONE';
//            $('#txtBwParticipants').append(html);
//        },
//        error: function (data, errorCode, errorMessage) {
//            //window.waitDialog.close();
//            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
//            displayAlertDialog('Error in admin.js.cmdListAllParticipants():' + errorCode + ', ' + errorMessage);
//        }
//    });
//}

function cmdListAllRecurringExpenses() {
    $('#txtBwRecurringExpenses').empty();
    $.ajax({
        url: webserviceurl + "/bwrecurringexpensesfindall",
        type: "DELETE",
        contentType: 'application/json',
        success: function (data) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                html += 'bwRecurringExpenseId: ' + data[i].bwRecurringExpenseId;
                html += ', ';
                html += 'TrashBin: ' + data[i].TrashBin;
                html += ', ';
                html += 'Created: ' + data[i].Created;
                html += ', ';
                html += 'CreatedBy: ' + data[i].CreatedBy;
                html += ', ';
                html += 'CreatedByEmail: ' + data[i].CreatedByEmail;
                html += ', ';
                html += 'Title: ' + data[i].Title;
                html += ', ';
                html += 'ProjectTitle: ' + data[i].ProjectTitle;
                html += ', ';
                html += 'ReminderDate: ' + data[i].ReminderDate;
                html += ', ';
                html += 'HasReminderDateTaskNotificationBeenSent: ' + data[i].HasReminderDateTaskNotificationBeenSent;
                html += '\n\n';
            }
            html += 'DONE';
            $('#txtBwRecurringExpenses').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            displayAlertDialog('Error in admin.js.cmdListAllRecurringExpenses():' + errorCode + ', ' + errorMessage);
        }
    });
}

function cmdListAllDepartments() {
    // Use ajax PUT.
    $('#txtBwDepartments').empty();
    //var data = {
    //    "bwWorkflowAppId": workflowAppId
    //};
    $.ajax({
        url: webserviceurl + "/bwdepartmentsfindall",
        type: "DELETE",
        contentType: 'application/json',
        //data: JSON.stringify(data),
        success: function (data) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                html += 'bwDepartmentTitle: ' + data[i].bwDepartmentTitle;
                html += ', ';
                html += 'bwDepartmentUserName: ' + data[i].bwDepartmentUserName;
                html += ', ';
                html += 'bwDepartmentUserId: ' + data[i].bwDepartmentUserId;
                html += ', ';
                html += 'bwDepartmentUserEmail: ' + data[i].bwDepartmentUserEmail;
                html += '\n\n';
            }
            html += 'DONE';
            $('#txtBwDepartments').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in my.js.cmdListAllDepartments():' + errorCode + ', ' + errorMessage);
        }
    });
}

function cmdListAllForms() {
    // Use ajax PUT.
    $('#txtBwForms').empty();
    //var data = {
    //    "bwWorkflowAppId": workflowAppId
    //};
    $.ajax({
        url: webserviceurl + "/bwformsfindall",
        type: "DELETE",
        contentType: 'application/json',
        //data: JSON.stringify(data),
        success: function (data) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                html += 'bwTenantId: ' + data[i].bwTenantId;
                html += ', ';
                html += 'bwWorkflowAppId: ' + data[i].bwWorkflowAppId;
                html += ', ';
                html += 'bwFormId: ' + data[i].bwFormId;
                //html += ', ';
                //html += 'bwDepartmentUserEmail: ' + data[i].bwDepartmentUserEmail;
                html += '\n\n';
            }
            html += 'DONE';
            $('#txtBwForms').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in my.js.cmdListAllForms():' + errorCode + ', ' + errorMessage);
        }
    });
}

function cmdListAllInvitations() {
    // Use ajax.
    $('#txtBwInvitations').empty();
    $.ajax({
        url: webserviceurl + "/bwinvitationsfindall",
        type: "DELETE",
        contentType: 'application/json',
        success: function (data) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                //html += 'bwParticipantId:' + data[i].bwParticipantId + ', bwTenantId:' + data[i].bwParticipantTenantId + ' bwParticipantEmail:' + data[i].bwParticipantEmail + ' bwParticipantFriendlyName:' + data[i].bwParticipantFriendlyName;
                html += 'bwInvitationParticipantRole: ' + data[i].bwInvitationParticipantRole + ', ';
                html += 'bwInvitationCreatedByFriendlyName: ' + data[i].bwInvitationCreatedByFriendlyName + ', ';
                html += 'bwInvitationCreatedTimestamp: ' + data[i].bwInvitationCreatedTimestamp + ', ';
                html += 'bwInvitationDeliveredToEmail: ' + data[i].bwInvitationDeliveredToEmail + ', ';
                html += 'bwInvitationDeliveredTimestamp: ' + data[i].bwInvitationDeliveredTimestamp + ', ';
                html += 'bwInvitationAcceptedById: ' + data[i].bwInvitationAcceptedById + ', ';
                html += 'bwInvitationAcceptedTimestamp: ' + data[i].bwInvitationAcceptedTimestamp + ', ';
                html += 'bwInvitationId: ' + data[i].bwInvitationId + ', ';
                html += 'bwTenantId: ' + data[i].bwTenantId + ', ';
                html += 'bwWorkflowAppId: ' + data[i].bwWorkflowAppId;
                html += '\n\n';
                //html += '';
            }
            html += 'DONE';
            $('#txtBwInvitations').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in admin.js.cmdListAllInvitations():' + errorCode + ', ' + errorMessage);
        }
    });
}

function cmdListAllRequestTypes() {
    // Use ajax.
    $('#txtBwRequestTypes').empty();
    $.ajax({
        url: webserviceurl + "/bwrequesttypesfindall",
        type: "DELETE",
        contentType: 'application/json',
        success: function (data) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                //html += 'bwParticipantId:' + data[i].bwParticipantId + ', bwTenantId:' + data[i].bwParticipantTenantId + ' bwParticipantEmail:' + data[i].bwParticipantEmail + ' bwParticipantFriendlyName:' + data[i].bwParticipantFriendlyName;
                html += 'bwRequestTypeId: ' + data[i].bwRequestTypeId + ', ';
                html += 'bwWorkflowAppId: ' + data[i].bwWorkflowAppId + ', ';
                html += 'Abbreviation: ' + data[i].Abbreviation + ', ';
                html += 'RequestType: ' + data[i].RequestType + ', ';
                html += 'isActive: ' + data[i].isActive;

                html += '\n\n';
                //html += '';
            }
            html += 'DONE';
            $('#txtBwRequestTypes').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in admin.js.cmdListAllRequestTypes():' + errorCode + ', ' + errorMessage);
        }
    });
}

function cmdListAllEmailAggregators() {
    // Use ajax.
    $('#txtBwEmailAggregators').empty();
    $.ajax({
        url: webserviceurl + "/bwemailaggregatorfindall",
        type: "DELETE",
        contentType: 'application/json',
        success: function (data) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                html += 'bwWorkflowAppId: ' + data[i].bwWorkflowAppId + ', ';
                html += 'bwParticipantId: ' + data[i].bwParticipantId + ', ';
                html += 'bwEmailAggregatorId: ' + data[i].bwEmailAggregatorId + ', ';
                html += 'bwParticipantEmail: ' + data[i].bwParticipantEmail + ', ';
                html += 'Created: ' + data[i].Created + ', ';
                html += 'EmailSubject: ' + data[i].EmailSubject + ', ';
                html += 'EmailBody: ' + data[i].EmailBody;
                html += '\n\n';
            }
            html += 'DONE';
            $('#txtBwEmailAggregators').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in admin.js.cmdListAllEmailAggregators():' + errorCode + ', ' + errorMessage);
        }
    });
}

function cmdListAllWebsiteTrafficLogs() {
    try {
        console.log('In cmdListAllWebsiteTrafficLogs().');

        // Use ajax.
        $('#txtBwWebsiteTrafficLogs').empty();
        var data = {
            //"bwTenantId": "null",
            //"bwTenantOwnerFacebookUserId": "test1",
            //"bwTenantOwnerLinkedInUserId": "test1",
            //"bwTenantOwnerFriendlyName": "Todd Hiltz1",
            //"bwTenantOwnerEmail": "todd1@capexworkflow.com",
            //"bwWorkflows": "null"
        };
        debugger;
        $.ajax({
            url: webserviceurl + "/bwwebsitetrafficlogs",
            type: "DELETE",
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (data) {
                try {
                    debugger;
                    var html = '';
                    for (var i = 0; i < data.length; i++) {
                        html += 'Log entry details:' + data[i].bwWebsiteTrafficLogEntryDetails;
                        html += ', ';
                        html += 'Logon provider:' + data[i].bwWebsiteTrafficLogUserLogonType;
                        html += ', ';
                        html += 'Id:' + data[i].bwWebsiteTrafficLogUserLogonTypeId;
                        html += ', ';
                        html += 'Referrer:' + data[i].bwWebsiteTrafficLogReferrer;
                        html += ', ';
                        html += 'Ip:' + data[i].bwWebsiteTrafficLogEntryIp;
                        html += ', ';
                        html += 'Timestamp:' + data[i].bwWebsiteTrafficLogEntryCreatedTimestamp;
                        html += ', ';
                        html += 'User agent:' + data[i].bwWebsiteTrafficLogUserAgent;
                        html += ', ';
                        html += 'Participant:' + data[i].ParticipantFriendlyName;
                        html += ', ';
                        html += 'Email:' + data[i].ParticipantEmail;
                        html += ', ';
                        html += 'bwWorkflowAppId:' + data[i].bwWorkflowAppId;
                        html += '\n\n';
                        //html += '';
                    }
                    html += 'DONE';
                    $('#txtBwWebsiteTrafficLogs').append(html);
                } catch (e) {
                    console.log('Exception in cmdListAllWebsiteTrafficLogs(): ' + e.message + ', ' + e.stack);
                }
            },
            error: function (data, errorCode, errorMessage) {
                //window.waitDialog.close();
                //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
                displayAlertDialog('Error in admin.js.cmdListAllWebsiteTrafficLogs():' + errorCode + ', ' + errorMessage);
            }
        });
    } catch (e) {
        console.log('Exception in cmdListAllWebsiteTrafficLogs(): ' + e.message + ', ' + e.stack);
        displayAlertDialog('Exception in cmdListAllWebsiteTrafficLogs(): ' + e.message + ', ' + e.stack);
    }
}




function cmdListAllUserAuthenticationLogs() {
    try {
        console.log('In cmdListAllUserAuthenticationLogs().');

        // Use ajax.
        $('#txtBwWebsiteTrafficLogs').empty();
        var data = {
            //"bwTenantId": "null",
            //"bwTenantOwnerFacebookUserId": "test1",
            //"bwTenantOwnerLinkedInUserId": "test1",
            //"bwTenantOwnerFriendlyName": "Todd Hiltz1",
            //"bwTenantOwnerEmail": "todd1@capexworkflow.com",
            //"bwWorkflows": "null"
        };
        debugger;
        $.ajax({
            url: webserviceurl + "/bwuserauthenticationtrafficlogs",
            type: "DELETE",
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (data) {
                try {
                    debugger;
                    var html = '';
                    for (var i = 0; i < data.length; i++) {
                        html += 'Participant:' + data[i].bwParticipantFriendlyName;
                        html += ', ';
                        html += 'Email:' + data[i].bwParticipantEmail;
                        html += ', ';
                        html += 'Ip:' + data[i].Ip;
                        html += ', ';
                        html += 'Timestamp:' + data[i].Timestamp;
                        html += ', ';


                        // Just commenting these ones out for now to make it easier to read. 1-29-2022
                        //html += 'Log entry details:' + data[i].Details;
                        //html += ', ';
                        //html += 'Logon provider:' + data[i].LogonType;
                        //html += ', ';
                        //html += 'Id:' + data[i].LogonTypeId;
                        //html += ', ';
                        //html += 'Referrer:' + data[i].Referrer;
                        //html += ', ';
                        //html += 'User agent:' + data[i].UserAgent;
                        //html += ', ';


                        html += 'bwWorkflowAppId:' + data[i].bwWorkflowAppId;
                        html += '\n\n';
                        //html += '';
                    }
                    html += 'DONE';
                    $('#txtBwUserAuthenticationLogs').append(html);
                } catch (e) {
                    console.log('Exception in cmdListAllUserAuthenticationLogs(): ' + e.message + ', ' + e.stack);
                }
            },
            error: function (data, errorCode, errorMessage) {
                //window.waitDialog.close();
                //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
                displayAlertDialog('Error in admin.js.cmdListAllUserAuthenticationLogs():' + errorCode + ', ' + errorMessage);
            }
        });
    } catch (e) {
        console.log('Exception in cmdListAllUserAuthenticationLogs(): ' + e.message + ', ' + e.stack);
        displayAlertDialog('Exception in cmdListAllUserAuthenticationLogs(): ' + e.message + ', ' + e.stack);
    }
}

function cmdDisplayWebsiteTrafficAudienceSize() {
    // Use ajax.
    $('#spanAudienceSize').empty();
    $('#spanAudienceSizeUniqueIps').empty();
    var data = {
        //"bwTenantId": "null",
        //"bwTenantOwnerFacebookUserId": "test1",
        //"bwTenantOwnerLinkedInUserId": "test1",
        //"bwTenantOwnerFriendlyName": "Todd Hiltz1",
        //"bwTenantOwnerEmail": "todd1@capexworkflow.com",
        //"bwWorkflows": "null"
    };

    $.ajax({
        //url: webserviceurl + "/bwwebsitetrafficlogswithwinston",
        url: webserviceurl + "/indexpagevisitorcount",
        type: "DELETE",
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (data) {
            try {
                // Filter out Todd's FB user id 581360560
                //var audienceCount = 0;
                //for (var i = 0; i < data.length; i++) {
                //    //if (data[i].bwWebsiteTrafficLogUserFacebookId != '581360560') {
                //    //    audienceCount += 1;
                //    //}
                //    audienceCount += 1;
                //}
                //html += audienceCount;
                //debugger;

                if (data.message == 'SUCCESS') {
                    var uniquePageViews = [];
                    uniquePageViews = new Array();
                    for (var i = 0; i < data.result.length; i++) {
                        var newIpEntry = data.result[i].bwWebsiteTrafficLogEntryIp;
                        if (uniquePageViews.indexOf(newIpEntry) == -1) {
                            // It doesn't exist in the array, so add it!
                            uniquePageViews.push(newIpEntry);
                        }
                    }


                    $('#spanAudienceSize').append(data.result.length);
                    $('#spanAudienceSizeUniqueIps').append(uniquePageViews.length);
                } else {
                    // do nothing for now. Todd come back and fix this.
                    //debugger;
                }



            } catch (e) {
                console.log('Exception in cmdDisplayWebsiteTrafficAudienceSize(): ' + e.message + ', ' + e.stack);
            }
        },
        error: function (data, errorCode, errorMessage) {
            //displayAlertDialog('yyyyyyyy');
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in admin.js.cmdDisplayWebsiteTrafficAudienceSize():' + errorCode + ', ' + errorMessage + ', ' + JSON.stringify(data));
        }
    });
}

//function cmdDisplayWebsiteErrorThreatDetails(threatLevel) {
//    //displayAlertDialog('This functionality is incomplete. Coming soon!');
//    $('#txtBwExceptionLogDetails').empty();
//    $.ajax({
//        url: webserviceurl + "/websiteerrorthreatsummary",
//        type: "DELETE",
//        contentType: 'application/json',
//        success: function (data) {
//            var html = '';
//            for (var i = 0; i < data.length; i++) {
//                if (data[i].ErrorThreatLevel == threatLevel) {
//                    html += 'Timestamp: ' + data[i].Timestamp + ', ';
//                    html += 'Message: ' + data[i].Message + ',  ';
//                    html += 'Source: ' + data[i].Source + ' ';
//                    html += '\n\n';
//                }
//            }
//            html += 'DONE';
//            $('#txtBwExceptionLogDetails').append(html);
//        },
//        error: function (data, errorCode, errorMessage) {
//            //window.waitDialog.close();
//            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
//            displayAlertDialog('Error in index.js.cmdDisplayWebsiteErrorThreatDetails():' + errorCode + ', ' + errorMessage);
//        }
//    });

//}

//function cmdDisplayWebsiteErrorThreats() {
//    debugger;
//    // Use ajax.
//    $('#spanWebsiteErrorThreats').empty();
//    var data = {
//        //"bwTenantId": "null",
//        //"bwTenantOwnerFacebookUserId": "test1",
//        //"bwTenantOwnerLinkedInUserId": "test1",
//        //"bwTenantOwnerFriendlyName": "Todd Hiltz1",
//        //"bwTenantOwnerEmail": "todd1@capexworkflow.com",
//        //"bwWorkflows": "null"
//    };

//    $.ajax({
//        url: webserviceurl + "/websiteerrorthreatsummary",
//        type: "DELETE",
//        contentType: 'application/json',
//        data: JSON.stringify(data),
//        success: function (data) {
//            // Severe #ff0000, High #ff9900, Elevated #ffff00, Guarded #0066ff, Low #009933
//            debugger;
//            var severeErrorThreats = [];
//            severeErrorThreats = new Array();
//            //
//            var highLevelErrorThreats = [];
//            highLevelErrorThreats = new Array();
//            //
//            var elevatedErrorThreats = [];
//            elevatedErrorThreats = new Array();
//            //
//            var guardedErrorThreats = [];
//            guardedErrorThreats = new Array();
//            //
//            var lowErrorThreats = [];
//            lowErrorThreats = new Array();
//            // Fill the arrays.
//            for (var i = 0; i < data.length; i++) {
//                var exceptionLogEntry = data[i].Message; // Todd currently we are only getting the message. The detail display will want more of the information from the BwExceptionLog table.
//                if (data[i].ErrorThreatLevel == 'severe') { 
//                    severeErrorThreats.push(exceptionLogEntry);
//                    // Severe threats include:
//                    // - failure to send an email.
//                    // - failure of a web method to reach it's intended conslusion.
//                    // ...
//                } else if (data[i].ErrorThreatLevel == 'high') {
//                    highLevelErrorThreats.push(exceptionLogEntry);
//                } else if (data[i].ErrorThreatLevel == 'elevated') {
//                    elevatedErrorThreats.push(exceptionLogEntry);
//                } else if (data[i].ErrorThreatLevel == 'guarded') {
//                    guardedErrorThreats.push(exceptionLogEntry);
//                } else if (data[i].ErrorThreatLevel == 'low') {
//                    lowErrorThreats.push(exceptionLogEntry);
//                }
//            }
//            var html = '';
//            html += '<span>';


//            // This is the drop-down span tag!
//            html += '<span style="font-size:xx-large;color:darkgray;white-space:nowrap;">';
//            html += 'Threats (Display ';
//            html += '<select id="xx" style="border-color: whitesmoke; color: rgb(38, 38, 38); font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 3em; font-weight: bold; cursor: pointer;">';


//            // border-color: whitesmoke; color: rgb(38, 38, 38); font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 1.25em; font-weight: bold; cursor: pointer;
//            // border-color: whitesmoke; color: rgb(38, 38, 38); font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 1.25em; font-weight: bold; cursor: pointer;


//            html += '  <option style="border-color: whitesmoke; color: rgb(38, 38, 38); font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 3em; font-weight: bold; cursor: pointer;">12 hours</option>';
//            html += '  <option style="border-color: whitesmoke; color: rgb(38, 38, 38); font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 3em; font-weight: bold; cursor: pointer;">24 hours</option>';
//            html += '  <option>36 hours</option>';
//            html += '  <option>48 hours</option>';
//            html += '  <option>60 hours</option>';
//            html += '  <option>72 hours</option>';
//            html += '  <option>84 hours</option>';
//            html += '  <option>96 hours</option>';
//            html += '</select>';
//            html += ' Dev: Incomplete!): </span>';


//            html += '<table>';
//            html += '  <tr>';

//            html += '    <td>';
//            //html += '      <span style="color:white;background-color:#009933;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" onclick="cmdDisplayWebsiteErrorThreatDetails(\'verbose\');">Verbose: <span>' + verboseErrorThreats.length + '</span></span>';
//            html += '      <span style="color:white;background-color:#009933;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" onclick="cmdDisplayWebsiteErrorThreatDetails(\'verbose\');">Verbose: <span>#</span>';
//            //html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png">';
//            html += '      </span>';
//            html += '    </td>';

//            html += '    <td>';
//            html += '      <span style="color:white;background-color:#ff0000;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" >';
//            html += '           <span onclick="cmdDisplayWebsiteErrorThreatDetails(\'severe\');">Severe: ' + severeErrorThreats.length + '</span>';
//            if (severeErrorThreats.length > 0) {
//                html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdDeleteAllExceptionLogs\', \'severe\');">';
//            }
//            html += '      </span>';
//            html += '    </td>';

//            html += '    <td>';
//            html += '      <span style="color:white;background-color:#ff9900;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" >';
//            html += '           <span onclick="cmdDisplayWebsiteErrorThreatDetails(\'high\');">High: ' + highLevelErrorThreats.length + '</span>';
//            if (highLevelErrorThreats.length > 0) {
//                html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdDeleteAllExceptionLogs\', \'high\');">';
//            }
//            html += '      </span>';
//            html += '    </td>';

//            html += '    <td>';
//            html += '      <span style="color:#ff9900;background-color:#ffff00;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" >';
//            html += '           <span onclick="cmdDisplayWebsiteErrorThreatDetails(\'elevated\');">Elevated: ' + elevatedErrorThreats.length + '</span>';
//            if (elevatedErrorThreats.length > 0) {
//                html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdDeleteAllExceptionLogs\', \'elevated\');">';
//            }
//            html += '      </span>';
//            html += '    </td>';

//            html += '    <td>';
//            html += '      <span style="color:white;background-color:#0066ff;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" >';
//            html += '           <span onclick="cmdDisplayWebsiteErrorThreatDetails(\'guarded\');">Guarded: ' + guardedErrorThreats.length + '</span>';
//            if (guardedErrorThreats.length) {
//                html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdDeleteAllExceptionLogs\', \'guarded\');">';
//            }
//            html += '      </span>';
//            html += '    </td>';

//            html += '    <td>';
//            html += '      <span style="color:white;background-color:#009933;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" >';
//            html += '           <span onclick="cmdDisplayWebsiteErrorThreatDetails(\'low\');">Low: ' + lowErrorThreats.length + '</span>';
//            if (lowErrorThreats.length) {
//                html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdDeleteAllExceptionLogs\', \'low\');">';
//            }
//            html += '      </span>';
//            html += '    </td>';

//            html += '  </tr>';
//            html += '</table>';
//            html += '</span>';
//            debugger;
//            $('#spanWebsiteErrorThreats').append(html);
//        },
//        error: function (data, errorCode, errorMessage) {
//            displayAlertDialog('Error in admin.js.cmdDisplayWebsiteErrorThreats():' + errorCode + ', ' + errorMessage);
//        }
//    });
//}


function getFriendlyDateAndTime(timestamp) {
    try {
        //debugger;
        var year = Number(timestamp.split('-')[0]);
        var month = timestamp.split('-')[1];
        var day1 = timestamp.split('-')[2];
        var day = day1.split('T')[0];
        var monthName = monthNames[month - 1];

        var time = timestamp.split('T')[1].split(':')[0] + ':' + timestamp.split('T')[1].split(':')[1] + 'UTC';


        var result = monthName + ' ' + day + ', ' + year + ' ' + time;
        return result;
    } catch (e) {
        console.log('Exception in getFriendlyDateAndTime(): ' + e.message + ', ' + e.stack);
    }
}

//function cmdDisplaySentEmails() {
//    try {
//        console.log('In cmdDisplaySentEmails().');
//        // Use ajax.
//        $('#spanSentEmails1').empty();

//        var html = '';
//        html += '<table>';
//        html += '  <tr>';
//        html += '    <td style="text-align:left;vertical-align:top;" class="bwSliderTitleCell">';
//        html += '       Sent Emailsxcx1 (replace with new email functionality):&nbsp;';
//        html += '    </td>';
//        html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
//        html += '       <table>';
//        html += '           <tr>';
//        html += '               <td>';
//        html += '                   <span id="spanSentEmails" style="font-weight:bold;color:#009933;"></span>';
//        html += '               </td>';
//        html += '           </tr>';
//        html += '       </table>';
//        html += '    </td>';
//        html += '  </tr>';
//        html += '</table>';

//        $('#spanSentEmails1').append(html);






//        $('#spanSentEmails').empty();
//        $.ajax({
//            //url: webserviceurl + "/bwwebapppendingemail/" + this.options.bwWorkflowAppId,
//            url: webserviceurl + "/bwadminsentemail", ///" + this.options.bwWorkflowAppId,
//            type: "DELETE",
//            contentType: 'application/json',
//            //data: JSON.stringify(data),
//            success: function (data) {
//                try {
//                    var html = '';
//                    //html += 'Pending Emails:';
//                    if (!data.length || data.length == 0) {
//                        html += '<span style="font-size:15pt;font-weight:normal;color:black;">';
//                        html += '  There are no sent emails.';
//                        html += '<span>';
//                    } else {
//                        //html += '<br />';

//                        html += '<style>';
//                        html += '.dataGridTable { border: 1px solid gainsboro; font-size:14px; font-family: "Helvetica Neue","Segoe UI",Helvetica,Verdana,sans-serif; }';
//                        html += '.dataGridTable td { border-left: 0px; border-right: 1px solid gainsboro; }';
//                        html += '.headerRow { background-color:white; color:gray;border-bottom:1px solid gainsboro; }';
//                        html += '.headerRow td { border-bottom:1px solid gainsboro; padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
//                        html += '.filterRow td { border-bottom:1px solid whitesmoke; padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
//                        html += '.alternatingRowLight { background-color:white;color:gray; }';
//                        html += '.alternatingRowLight:hover { background-color:lightgoldenrodyellow; }';
//                        html += '.alternatingRowDark { background-color:whitesmoke;color:gray; }';
//                        html += '.alternatingRowDark:hover { background-color:lightgoldenrodyellow; }';
//                        html += '</style>';


//                        html += '<table style="width:600px;" class="dataGridTable">';

//                        html += '  <tr style="font-size:15pt;font-weight:normal;color:black;">';
//                        html += '    <td></td>';
//                        html += '    <td colspan="4">';
//                        html += '       <span style="padding: 4px 4px 4px 4px;border:1px solid lightblue;cursor:pointer;" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdDisplayDeleteSentEmailsDialog\');">';
//                        html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png">&nbsp;Delete';
//                        html += '       </span>';
//                        html += '    </td>';
//                        html += '  </tr>';

//                        html += '  <tr class="headerRow">';
//                        html += '    <td><input type="checkbox" id="checkboxToggleSentEmailCheckboxes" onchange="$(\'.bwMonitoringTools\').bwMonitoringTools(\'toggleSentEmailCheckboxes\', this);" /></td>';
//                        html += '    <td></td>';
//                        html += '    <td>bwWorkflowAppId</td>';

//                        html += '    <td>To</td>';
//                        html += '    <td>Subject</td>';
//                        //html += '    <td>From</td>';
//                        html += '    <td></td>';
//                        html += '  </tr>';

//                        var alternatingRow = 'light'; // Use this to color the rows.
//                        for (var i = 0; i < data.length; i++) {


//                            if (alternatingRow == 'light') {
//                                html += '  <tr class="alternatingRowLight" style="font-size:10pt;cursor:pointer;" onmouseover="$(\'.bwCoreComponent\').bwCoreComponent(\'showEmailRowHoverDetails\', \'' + encodeURI(JSON.stringify(data[i])) + '\');" onmouseout="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');" >'; // Display BriefDescriptionOfProject as a tool tip.
//                                alternatingRow = 'dark';
//                            } else {
//                                html += '  <tr class="alternatingRowDark" style="font-size:10pt;cursor:pointer;" onmouseover="$(\'.bwCoreComponent\').bwCoreComponent(\'showEmailRowHoverDetails\', \'' + encodeURI(JSON.stringify(data[i])) + '\');" onmouseout="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');" >';
//                                alternatingRow = 'light';
//                            }


//                            //debugger;
//                            //html += '  <tr style="cursor:pointer;font-size:12pt;font-weight:normal;color:black;" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
//                            html += '    <td><input type="checkbox" class="sentEmailCheckbox" bwsentemailid="' + data[i].bwSentEmailId + '" /></td>';
//                            var timestamp = getFriendlyDateAndTime(data[i].Timestamp);
//                            //var timestampFriendlyTime = data[i].Timestamp.split('T')[1].split('.')[0];
//                            html += '    <td style="white-space:nowrap;">' + timestamp + '</td>';
//                            html += '    <td>' + data[i].bwWorkflowAppId + '</td>';

//                            html += '    <td>' + data[i].ToParticipantEmail + '</td>';
//                            html += '    <td>' + data[i].Subject + '</td>';
//                            //html += '    <td>' + data[i].FromEmailAddress + '</td>';
//                            html += '    <td><input type="button" bwsentemailid="xxpeid"' + data[i].EmailLink + '" value="View" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'adminViewSentEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');" /></td>';
//                            html += '  </tr>';
//                        }
//                        html += '</table>';
//                    }
//                    $('#spanSentEmails').append(html);
//                } catch (e) {
//                    console.log('Exception in admin.js.cmdDisplaySentEmails(): ' + e.message + ', ' + e.stack);
//                }
//            },
//            error: function (data, errorCode, errorMessage) {
//                displayAlertDialog('Error in admin.js.cmdDisplaySentEmails():' + errorCode + ', ' + errorMessage);
//            }
//        });













//    } catch (e) {
//        console.log('Exception in cmdDisplaySentEmails(): ' + e.message + ', ' + e.stack);
//    }
//    //var data = {
//    //    //"bwTenantId": "null",
//    //    //"bwTenantOwnerFacebookUserId": "test1",
//    //    //"bwTenantOwnerLinkedInUserId": "test1",
//    //    //"bwTenantOwnerFriendlyName": "Todd Hiltz1",
//    //    //"bwTenantOwnerEmail": "todd1@capexworkflow.com",
//    //    //"bwWorkflows": "null"
//    //};

//    //$.ajax({
//    //    url: webserviceurl + "/websiteerrorthreatsummary",
//    //    type: "DELETE",
//    //    contentType: 'application/json',
//    //    data: JSON.stringify(data),
//    //    success: function (data) {
//    //        // Severe #ff0000, High #ff9900, Elevated #ffff00, Guarded #0066ff, Low #009933
//    //        var severeErrorThreats = [];
//    //        severeErrorThreats = new Array();
//    //        //
//    //        var highLevelErrorThreats = [];
//    //        highLevelErrorThreats = new Array();
//    //        //
//    //        var elevatedErrorThreats = [];
//    //        elevatedErrorThreats = new Array();
//    //        //
//    //        var guardedErrorThreats = [];
//    //        guardedErrorThreats = new Array();
//    //        //
//    //        var lowErrorThreats = [];
//    //        lowErrorThreats = new Array();
//    //        // Fill the arrays.
//    //        for (var i = 0; i < data.length; i++) {
//    //            var exceptionLogEntry = data[i].Message; // Todd currently we are only getting the message. The detail display will want more of the information from the BwExceptionLog table.
//    //            if (data[i].ErrorThreatLevel == 'severe') {
//    //                severeErrorThreats.push(exceptionLogEntry);
//    //                // Severe threats include:
//    //                // - failure to send an email.
//    //                // - failure of a web method to reach it's intended conslusion.
//    //                // ...
//    //            } else if (data[i].ErrorThreatLevel == 'high') {
//    //                highLevelErrorThreats.push(exceptionLogEntry);
//    //            } else if (data[i].ErrorThreatLevel == 'elevated') {
//    //                elevatedErrorThreats.push(exceptionLogEntry);
//    //            } else if (data[i].ErrorThreatLevel == 'guarded') {
//    //                guardedErrorThreats.push(exceptionLogEntry);
//    //            } else if (data[i].ErrorThreatLevel == 'low') {
//    //                lowErrorThreats.push(exceptionLogEntry);
//    //            }
//    //        }
//    //        var html = '';
//    //        html += '<span>';


//    //        // This is the drop-down span tag!
//    //        html += '<span style="font-size:xx-large;color:darkgray;white-space:nowrap;">';
//    //        html += 'Threats (Display ';
//    //        html += '<select id="xx" style="border-color: whitesmoke; color: rgb(38, 38, 38); font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 3em; font-weight: bold; cursor: pointer;">';


//    //        // border-color: whitesmoke; color: rgb(38, 38, 38); font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 1.25em; font-weight: bold; cursor: pointer;
//    //        // border-color: whitesmoke; color: rgb(38, 38, 38); font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 1.25em; font-weight: bold; cursor: pointer;


//    //        html += '  <option style="border-color: whitesmoke; color: rgb(38, 38, 38); font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 3em; font-weight: bold; cursor: pointer;">12 hours</option>';
//    //        html += '  <option style="border-color: whitesmoke; color: rgb(38, 38, 38); font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 3em; font-weight: bold; cursor: pointer;">24 hours</option>';
//    //        html += '  <option>36 hours</option>';
//    //        html += '  <option>48 hours</option>';
//    //        html += '  <option>60 hours</option>';
//    //        html += '  <option>72 hours</option>';
//    //        html += '  <option>84 hours</option>';
//    //        html += '  <option>96 hours</option>';
//    //        html += '</select>';
//    //        html += ' Dev: Incomplete!): </span>';


//    //        html += '<table>';
//    //        html += '  <tr>';

//    //        html += '    <td>';
//    //        //html += '      <span style="color:white;background-color:#009933;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" onclick="cmdDisplayWebsiteErrorThreatDetails(\'verbose\');">Verbose: <span>' + verboseErrorThreats.length + '</span></span>';
//    //        html += '      <span style="color:white;background-color:#009933;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" onclick="cmdDisplayWebsiteErrorThreatDetails(\'verbose\');">Verbose: <span>#</span>';
//    //        //html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png">';
//    //        html += '      </span>';
//    //        html += '    </td>';

//    //        html += '    <td>';
//    //        html += '      <span style="color:white;background-color:#ff0000;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" >';
//    //        html += '           <span onclick="cmdDisplayWebsiteErrorThreatDetails(\'severe\');">Severe: ' + severeErrorThreats.length + '</span>';
//    //        if (severeErrorThreats.length > 0) {
//    //            html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="cmdDeleteAllExceptionLogs(\'severe\');">';
//    //        }
//    //        html += '      </span>';
//    //        html += '    </td>';

//    //        html += '    <td>';
//    //        html += '      <span style="color:white;background-color:#ff9900;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" >';
//    //        html += '           <span onclick="cmdDisplayWebsiteErrorThreatDetails(\'high\');">High: ' + highLevelErrorThreats.length + '</span>';
//    //        if (highLevelErrorThreats.length > 0) {
//    //            html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="cmdDeleteAllExceptionLogs(\'high\');">';
//    //        }
//    //        html += '      </span>';
//    //        html += '    </td>';

//    //        html += '    <td>';
//    //        html += '      <span style="color:#ff9900;background-color:#ffff00;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" >';
//    //        html += '           <span onclick="cmdDisplayWebsiteErrorThreatDetails(\'elevated\');">Elevated: ' + elevatedErrorThreats.length + '</span>';
//    //        if (elevatedErrorThreats.length > 0) {
//    //            html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="cmdDeleteAllExceptionLogs(\'elevated\');">';
//    //        }
//    //        html += '      </span>';
//    //        html += '    </td>';

//    //        html += '    <td>';
//    //        html += '      <span style="color:white;background-color:#0066ff;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" >';
//    //        html += '           <span onclick="cmdDisplayWebsiteErrorThreatDetails(\'guarded\');">Guarded: ' + guardedErrorThreats.length + '</span>';
//    //        if (guardedErrorThreats.length) {
//    //            html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="cmdDeleteAllExceptionLogs(\'guarded\');">';
//    //        }
//    //        html += '      </span>';
//    //        html += '    </td>';

//    //        html += '    <td>';
//    //        html += '      <span style="color:white;background-color:#009933;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" >';
//    //        html += '           <span onclick="cmdDisplayWebsiteErrorThreatDetails(\'low\');">Low: ' + lowErrorThreats.length + '</span>';
//    //        if (lowErrorThreats.length) {
//    //            html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="cmdDeleteAllExceptionLogs(\'low\');">';
//    //        }
//    //        html += '      </span>';
//    //        html += '    </td>';

//    //        html += '  </tr>';
//    //        html += '</table>';
//    //        html += '</span>';

//    //        $('#spanWebsiteErrorThreats').append(html);
//    //    },
//    //    error: function (data, errorCode, errorMessage) {
//    //        displayAlertDialog('Error in admin.js.cmdDisplayWebsiteErrorThreats():' + errorCode + ', ' + errorMessage);
//    //    }
//    //});
//}


function cmdDeleteErrorThreatDetails(threatLevel) {
    try {
        console.log('In cmdDeleteErrorThreatDetails(). threatLevel: ' + threatLevel);
        // cmdDeleteAllExceptionLogs(); <<< This is what we are currently using to delete all of them! Maybe just pass parameter here and reuse it!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

        alert('In cmdDeleteErrorThreatDetails(). threatLevel: ' + threatLevel + '. THIS FUNCTIONALITY IS INCOMPLETE. Coming Soon!');

    } catch (e) {
        console.log('Exception in cmdDeleteErrorThreatDetails(' + threatLevel + '): ' + e.message + ', ' + e.stack);
    }
}

function cmdDisplayWebsiteTrafficNumberOfParticipants() {
    try {
        console.log('In cmdDisplayWebsiteTrafficNumberOfParticipants().');

        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
        var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

        $('#spanNumberOfParticipants').empty();

        var data = {
            bwWorkflowAppId_LoggedIn: workflowAppId,
            bwParticipantId_LoggedIn: participantId,
            bwActiveStateIdentifier: activeStateIdentifier
        };
        $.ajax({
            url: webserviceurl + "/bwparticipantsfindall",
            type: "POST",
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (result) {
                try {
                    var data = result.result;
                    //displayAlertDialog('xxxxxxx' + JSON.stringify(data));
                    var html = '';
                    // Filter out Todd's FB user id 581360560
                    //var audienceCount = 0;
                    //for (var i = 0; i < data.length; i++) {
                    //    //if (data[i].bwWebsiteTrafficLogUserFacebookId != '581360560') {
                    //    //    audienceCount += 1;
                    //    //}
                    //    audienceCount += 1;
                    //}
                    html += data.length;
                    $('#spanNumberOfParticipants').append(html);

                } catch (e) {
                    console.log('Exception in admin.js.cmdDisplayWebsiteTrafficNumberOfParticipants():2: ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in admin.js.cmdDisplayWebsiteTrafficNumberOfParticipants():2: ' + e.message + ', ' + e.stack);
                }
            },
            error: function (data, errorCode, errorMessage) {
                console.log('Error in admin.js.cmdDisplayWebsiteTrafficNumberOfParticipants():' + errorCode + ', ' + errorMessage);
                displayAlertDialog('Error in admin.js.cmdDisplayWebsiteTrafficNumberOfParticipants():' + errorCode + ', ' + errorMessage);
            }
        });

    } catch (e) {
        console.log('Exception in admin.js.cmdDisplayWebsiteTrafficNumberOfParticipants(): ' + e.message + ', ' + e.stack);
        displayAlertDialog('Exception in admin.js.cmdDisplayWebsiteTrafficNumberOfParticipants(): ' + e.message + ', ' + e.stack);
    }
}

function cmdDisplayWebsiteTrafficNumberOfTenants() {
    $('#spanNumberOfTenants').empty();
    $.ajax({
        url: webserviceurl + "/bwtenantsfindall",
        type: "POST",
        contentType: 'application/json',
        success: function (data) {
            var html = '';
            html += data.length;
            $('#spanNumberOfTenants').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            displayAlertDialog('Error in admin.js.cmdDisplayWebsiteTrafficNumberOfTenants():' + errorCode + ', ' + errorMessage);
        }
    });
}

function cmdDisplayNumberOfLicenses() {
    $('#spanNumberOfLicensesSold').empty();
    $.ajax({
        url: webserviceurl + "/bwworkflowapplicensesfindall",
        type: "DELETE",
        contentType: 'application/json',
        success: function (data) {

            //displayAlertDialog(JSON.stringify(data));

            var html = '';
            html += data.length;
            $('#spanNumberOfLicensesSold').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            displayAlertDialog('Error in admin.js.cmdDisplayNumberOfLicenses():' + errorCode + ', ' + errorMessage);
        }
    });
}

function cmdListAllBudgetRequests() {
    // Use ajax PUT.
    $('#txtBwBudgetRequests').empty();
    var data = {
        //"bwTenantId": "null",
        //"bwTenantOwnerFacebookUserId": "test1",
        //"bwTenantOwnerLinkedInUserId": "test1",
        //"bwTenantOwnerFriendlyName": "Todd Hiltz1",
        //"bwTenantOwnerEmail": "todd1@capexworkflow.com",
        //"bwWorkflows": "null"
    };

    $.ajax({
        url: webserviceurl + "/bwbudgetrequestsforadmin",
        type: "DELETE",
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (data) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                // ARStatus: String,
                //BudgetWorkflowStatus: String,
                html += 'Title:' + data[i].Title;
                html += ', ProjectTitle:' + data[i].ProjectTitle;
                html += ', ARStatus: ' + data[i].ARStatus;
                html += ', BudgetWorkflowStatus:' + data[i].BudgetWorkflowStatus;
                html += ', bwWorkflowAppId:' + data[i].bwWorkflowAppId;
                html += ', bwBudgetRequestId:' + data[i].bwBudgetRequestId;
                html += ', FunctionalAreaId:' + data[i].FunctionalAreaId;
                html += ', OrgId:' + data[i].OrgId;
                html += ', OrgName:' + data[i].OrgName;
                html += ', bwApprovalLevelWorkflowToken:' + data[i].bwApprovalLevelWorkflowToken;
                html += ', Created:' + data[i].Created;
                html += ', Modified:' + data[i].Modified;
                html += ', IsRecurringExpense:' + data[i].IsRecurringExpense;
                html += ', RelatedRecurringExpenseId:' + data[i].RelatedRecurringExpenseId;
                html += ', CloseoutXml:' + data[i].CloseoutXml;
                html += '\n\n';
                //html += '';
            }
            html += 'DONE';
            $('#txtBwBudgetRequests').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in admin.js.cmdListAllBudgetRequests():' + errorCode + ', ' + errorMessage);
        }
    });
}

function cmdListAllBudgetRequestsTrashbin() {
    // Use ajax PUT.
    $('#txtBwBudgetRequestsTrashbin').empty();
    var data = {
        //"bwTenantId": "null",
        //"bwTenantOwnerFacebookUserId": "test1",
        //"bwTenantOwnerLinkedInUserId": "test1",
        //"bwTenantOwnerFriendlyName": "Todd Hiltz1",
        //"bwTenantOwnerEmail": "todd1@capexworkflow.com",
        //"bwWorkflows": "null"
    };

    $.ajax({
        url: webserviceurl + "/bwbudgetrequeststrashbinforadmin",
        type: "DELETE",
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (data) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                // ARStatus: String,
                //BudgetWorkflowStatus: String,
                html += 'bwWorkflowAppId:' + data[i].bwWorkflowAppId;
                html += ', bwWorkflowId:' + data[i].bwWorkflowId;
                html += ', Title:' + data[i].Title;
                html += ', ProjectTitle:' + data[i].ProjectTitle;
                html += ', ARStatus: ' + data[i].ARStatus;
                html += ', BudgetWorkflowStatus:' + data[i].BudgetWorkflowStatus;
                html += ', bwBudgetRequestId:' + data[i].bwBudgetRequestId;
                html += ', FunctionalAreaId:' + data[i].FunctionalAreaId;
                html += ', bwApprovalLevelWorkflowToken:' + data[i].bwApprovalLevelWorkflowToken;
                html += ', Created:' + data[i].Created;
                html += ', Modified:' + data[i].Modified;
                html += ', CloseoutXml:' + data[i].CloseoutXml;
                html += '\n\n';
                //html += '';
            }
            html += 'DONE';
            $('#txtBwBudgetRequestsTrashbin').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in admin.js.cmdListAllBudgetRequestsTrashbin():' + errorCode + ', ' + errorMessage);
        }
    });
}

function cmdListAllWorkflowTasks() {
    // Use ajax.
    $('#txtBwWorkflowTasks').empty();
    var data = {
        //"bwTenantId": "null",
        //"bwTenantOwnerFacebookUserId": "test1",
        //"bwTenantOwnerLinkedInUserId": "test1",
        //"bwTenantOwnerFriendlyName": "Todd Hiltz1",
        //"bwTenantOwnerEmail": "todd1@capexworkflow.com",
        //"bwWorkflows": "null"
    };

    $.ajax({
        url: webserviceurl + "/bwtasksfindallforadmin",
        type: "DELETE",
        contentType: 'application/json',
        //data: JSON.stringify(data),
        success: function (data) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                html += 'bwTaskTitle:' + data[i].bwTaskTitle;
                html += ', bwDueDate:' + data[i].bwDueDate;
                html += ', bwWorkflowTaskItemId:' + data[i].bwWorkflowTaskItemId;
                html += ', bwTaskOutcome:' + data[i].bwTaskOutcome + ' bwPercentComplete:' + data[i].bwPercentComplete + ' bwHasBeenProcessedByTheWorkflowEngine:' + data[i].bwHasBeenProcessedByTheWorkflowEngine;
                html += ', bwAssignedToId:' + data[i].bwAssignedToId;
                html += ', TaskType:' + data[i].TaskType;

                html += ', bwRelatedItemId:' + data[i].bwRelatedItemId;

                html += ', bwAssignedToEmail:' + data[i].bwAssignedToEmail; //
                html += ', bwAssignedToFriendlyName:' + data[i].bwAssignedToFriendlyName;
                //html += ', bwTenantId:' + data[i].bwTenantId;
                html += ', bwWorkflowAppId:' + data[i].bwWorkflowAppId;
                html += ', Created:' + data[i].Created;
                html += ', Modified:' + data[i].Modified;
                //html += ', bwLastDayOverDueTaskReminderSentTimestamp:' + data[i].bwLastDayOverDueTaskReminderSentTimestamp;
                html += ', DailyOverdueTaskNotificationDate:' + data[i].DailyOverdueTaskNotificationDate;
                html += ', TrashBin:' + data[i].TrashBin;

                html += ', WorkflowStepName:' + data[i].WorkflowStepName;
                html += ', bwStatus:' + data[i].bwStatus;

                html += ', bwAssignedToRaciRoleAbbreviation:' + data[i].bwAssignedToRaciRoleAbbreviation;
                html += ', bwAssignedToRaciRoleName:' + data[i].bwAssignedToRaciRoleName;


                html += '\n\n';
                //html += '';
            }
            html += 'DONE';
            $('#txtBwWorkflowTasks').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in admin.js.cmdListAllWorkflowTasks():' + errorCode + ', ' + errorMessage);
        }
    });
}




function cmdListAllWorkflowTasksThatWillHaveEmailsSentToday() {
    // Use ajax.
    $('#txtBwWorkflowTasksThatWillHaveEmailsSentToday').empty();
    var data = {
        //"bwTenantId": "null",
        //"bwTenantOwnerFacebookUserId": "test1",
        //"bwTenantOwnerLinkedInUserId": "test1",
        //"bwTenantOwnerFriendlyName": "Todd Hiltz1",
        //"bwTenantOwnerEmail": "todd1@capexworkflow.com",
        //"bwWorkflows": "null"
    };

    $.ajax({
        url: webserviceurl + "/bwtasksfindallforadminthatwillhaveemailssenttoday",
        type: "DELETE",
        contentType: 'application/json',
        //data: JSON.stringify(data),
        success: function (data) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                html += 'bwWorkflowTaskItemId:' + data[i].bwWorkflowTaskItemId;
                html += ', bwAssignedToEmail:' + data[i].bwAssignedToEmail; //
                html += ', bwAssignedToFriendlyName:' + data[i].bwAssignedToFriendlyName;

                html += ', bwTaskTitle:' + data[i].bwTaskTitle;
                html += ', bwDueDate:' + data[i].bwDueDate;
                html += ', bwTaskOutcome:' + data[i].bwTaskOutcome + ' bwPercentComplete:' + data[i].bwPercentComplete + ' bwHasBeenProcessedByTheWorkflowEngine:' + data[i].bwHasBeenProcessedByTheWorkflowEngine;
                html += ', bwAssignedToId:' + data[i].bwAssignedToId;
                html += ', TaskType:' + data[i].TaskType;

                html += ', bwRelatedItemId:' + data[i].bwRelatedItemId;


                //html += ', bwTenantId:' + data[i].bwTenantId;
                html += ', bwWorkflowAppId:' + data[i].bwWorkflowAppId;
                html += ', Created:' + data[i].Created;
                html += ', Modified:' + data[i].Modified;
                //html += ', bwLastDayOverDueTaskReminderSentTimestamp:' + data[i].bwLastDayOverDueTaskReminderSentTimestamp;
                html += ', DailyOverdueTaskNotificationDate:' + data[i].DailyOverdueTaskNotificationDate;
                html += ', TrashBin:' + data[i].TrashBin;
                html += '\n\n';
                //html += '';
            }
            html += 'DONE';
            $('#txtBwWorkflowTasksThatWillHaveEmailsSentToday').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in admin.js.cmdListAllWorkflowTasksThatWillHaveEmailsSentToday():' + errorCode + ', ' + errorMessage);
        }
    });
}






function populateSelectViewBwWorkflowTaskSelectWorkflowApp() {
    // This populates the drop down on page load.
    $('#spanViewBwWorkflowTaskSelectWorkflowApp').empty();
    $.ajax({
        url: webserviceurl + "/bwworkflowapps",
        type: "POST",
        contentType: 'application/json',
        success: function (data) {
            try {
                var html = '';
                html += '<select id="selectViewBwWorkflowTaskSelectWorkflowApp" onchange="populateSelectViewBwWorkflowTaskSelectWorkflowAppDrillDown1();">';
                for (var i = 0; i < data.length; i++) {
                    html += '<option value="' + data[i].bwWorkflowAppId + '">' + data[i].bwWorkflowAppTitle + ' - ' + data[i].bwWorkflowAppId + '</option>';
                    //html += 'Title:' + data[i].bwWorkflowAppTitle + ', Tenant Id:' + data[i].bwTenantId + ', Workflow App Id:' + data[i].bwWorkflowAppId;
                }
                html += '</select>';
                $('#spanViewBwWorkflowTaskSelectWorkflowApp').append(html);
            } catch (e) {
                console.log('Exception in populateSelectViewBwWorkflowTaskSelectWorkflowApp(): ' + e.message + ', ' + e.stack);
                displayAlertDialog('Exception in populateSelectViewBwWorkflowTaskSelectWorkflowApp(): ' + e.message + ', ' + e.stack);
            }
        },
        error: function (data, errorCode, errorMessage) {
            console.log('Error in admin.js.populateSelectViewBwWorkflowTaskSelectWorkflowApp():xcx8709:' + errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in admin.js.populateSelectViewBwWorkflowTaskSelectWorkflowApp():xcx8709:' + errorCode + ', ' + errorMessage);
        }
    });
}

function populateSelectViewBwWorkflowTaskSelectWorkflowAppDrillDown1() {
    // This populates the drill down after the workflow app id is selected.
    $('#spanViewBwWorkflowTaskSelectWorkflowAppDrillDown1').empty();
    var e = document.getElementById('selectViewBwWorkflowTaskSelectWorkflowApp');
    var selectedWorkflowAppId = e.options[e.selectedIndex].value;
    var data = [];
    data = {
        bwWorkflowAppId: selectedWorkflowAppId
    };
    var operationUri = webserviceurl + "/bwparticipantsfindallforworkflowapp";
    $.ajax({
        url: operationUri,
        type: "POST", timeout: ajaxTimeout,
        data: data,
        headers: {
            "Accept": "application/json; odata=verbose"
        },
        success: function (data) {
            //var e = document.getElementById('selectViewBwWorkflowTaskSelectWorkflowApp');
            //var selectedWorkflowAppId = e.options[e.selectedIndex].value;

            var html = '';
            html += '<select id="selectViewBwWorkflowTaskSelectWorkflowAppDrillDown1">';
            for (var i = 0; i < data.length; i++) {
                //if (selectedWorkflowAppId == data[i].bwWorkflowAppId) {
                html += '<option value="' + data[i].bwParticipantId + '">' + data[i].bwParticipantFriendlyName + ' - ' + data[i].bwParticipantId + '</option>';
                //}
                //html += 'bwParticipantLogonType: ' + data[i].bwParticipantLogonType;
                //html += ', ';
                //html += 'bwParticipantLogonTypeUserId: ' + data[i].bwParticipantLogonTypeUserId;
                //html += ', ';
                //html += 'bwParticipantFriendlyName: ' + data[i].bwParticipantFriendlyName;
                //html += ', ';
                //html += 'bwParticipantEmail: ' + data[i].bwParticipantEmail;
                //html += ', ';
                //html += 'bwParticipantRole: ' + data[i].bwParticipantRole;
                //html += ', ';
                //html += 'bwTenantId: ' + data[i].bwTenantId;
                //html += ', ';
                //html += 'bwWorkflowAppId: ' + data[i].bwWorkflowAppId;
                //html += ', ';
                //html += 'bwParticipantId: ' + data[i].bwParticipantId;

                //html += ', ';
                //html += 'customLogonPasswordSalt: ' + data[i].customLogonPasswordSalt;
                //html += ', ';
                //html += 'customLogonPasswordHash: ' + data[i].customLogonPasswordHash;

                //html += ', ';
                //html += 'bwEmailNotificationFrequency: ' + data[i].bwEmailNotificationFrequency;

                //html += ', ';
                //html += 'bwEmailNotificationTypes: ' + data[i].bwEmailNotificationTypes;
                //html += ', ';
                //html += 'bwEmailAggregatorTwiceDailyFirstTime: ' + data[i].bwEmailAggregatorTwiceDailyFirstTime;
                //html += ', ';
                //html += 'bwEmailAggregatorTwiceDailySecondTime: ' + data[i].bwEmailAggregatorTwiceDailySecondTime;
                //html += ', ';
                //html += 'bwEmailAggregatorLastEmailSentTimestamp: ' + data[i].bwEmailAggregatorLastEmailSentTimestamp;

                //html += '\n\n';

                //html += 'bwParticipantId:' + data[i].bwParticipantId + ', bwTenantId:' + data[i].bwParticipantTenantId + ' bwParticipantEmail:' + data[i].bwParticipantEmail + ' bwParticipantFriendlyName:' + data[i].bwParticipantFriendlyName + '<br/>';
                //html += '';
            }
            html += '</select>';
            $('#spanViewBwWorkflowTaskSelectWorkflowAppDrillDown1').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in admin.js.populateSelectViewBwWorkflowTaskSelectWorkflowAppDrillDown1():' + errorCode + ', ' + errorMessage);
        }
    });
}

function cmdListAllBwWorkflowTasksForAParticipant() {
    // At this point the admin has selected the bwWorkflowAppId and the ParticipantId.
    // Display the Tasks!
    // Get the values.
    var e = document.getElementById('selectViewBwWorkflowTaskSelectWorkflowApp');
    var selectedWorkflowAppId = e.options[e.selectedIndex].value;
    //var xxxx = e.options[e.selectedIndex].text;
    var e2 = document.getElementById('selectViewBwWorkflowTaskSelectWorkflowAppDrillDown1');
    var selectedParticipantId = e2.options[e2.selectedIndex].value;
    // Clear the display and call the web service.
    $('#txtBwWorkflowTasksDrillDown').empty();
    var data = {
        "bwWorkflowAppId": selectedWorkflowAppId,
        "bwParticipantId": selectedParticipantId
    };
    $.ajax({
        url: webserviceurl + "/bwtasksfindallforworkflowappandparticipant",
        type: "DELETE",
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (data) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                html += 'bwTaskTitle:' + data[i].bwTaskTitle;
                html += ', bwDueDate:' + data[i].bwDueDate;
                html += ', bwTaskOutcome:' + data[i].bwTaskOutcome + ' bwPercentComplete:' + data[i].bwPercentComplete + ' bwHasBeenProcessedByTheWorkflowEngine:' + data[i].bwHasBeenProcessedByTheWorkflowEngine;
                html += ', bwAssignedToId:' + data[i].bwAssignedToId;
                html += ', TaskType:' + data[i].TaskType;

                html += ', bwRelatedItemId:' + data[i].bwRelatedItemId;

                html += ', bwAssignedToEmail:' + data[i].bwAssignedToEmail; //
                html += ', bwAssignedToFriendlyName:' + data[i].bwAssignedToFriendlyName;
                //html += ', bwTenantId:' + data[i].bwTenantId;
                html += ', bwWorkflowAppId:' + data[i].bwWorkflowAppId;
                html += ', Created:' + data[i].Created;
                html += ', Modified:' + data[i].Modified;
                //html += ', bwLastDayOverDueTaskReminderSentTimestamp:' + data[i].bwLastDayOverDueTaskReminderSentTimestamp;
                html += ', DailyOverdueTaskNotificationDate:' + data[i].DailyOverdueTaskNotificationDate;
                html += ', TrashBin:' + data[i].TrashBin;

                html += ', WorkflowStepName:' + data[i].WorkflowStepName;
                html += ', bwStatus:' + data[i].bwStatus;

                html += '\n\n';
                //html += '';
            }
            html += 'DONE';
            $('#txtBwWorkflowTasksDrillDown').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            displayAlertDialog('Error in admin.js.cmdListAllBwWorkflowTasksForAParticipant():' + errorCode + ', ' + errorMessage);
        }
    });
}

function cmdDeleteAllBwWorkflowTasksForAWorkflowAppAndParticipant() {
    // This is a dangerous one! It uses the drill down to get the workflowAppId and ParticipantId, then
    // allows the user to put all the tasks in the TrashBin.
    try {
        // Get the values.
        var e = document.getElementById('selectViewBwWorkflowTaskSelectWorkflowApp');
        var selectedWorkflowAppId = e.options[e.selectedIndex].value;
        //var xxxx = e.options[e.selectedIndex].text;
        var e2 = document.getElementById('selectViewBwWorkflowTaskSelectWorkflowAppDrillDown1');
        var selectedParticipantId = e2.options[e2.selectedIndex].value;
        var proceed = confirm('Delete Tasks for the selected WorkflowApp and Participant\n\nThis action cannot be undone.\n\nClick the OK button to proceed...');
        if (proceed) {
            // Note: This should be deleted, but in the future, maybe use the TrashBin.
            var data = [];
            //data = {
            //    bwTenantId: bwTenantId,
            //    bwTenantOwnerId: bwTenantOwnerId
            //};
            var data = {
                bwWorkflowAppId: selectedWorkflowAppId,
                bwParticipantId: selectedParticipantId
            };
            var operationUri = webserviceurl + "/bwtenant/deletealltasksforworkflowappandparticipant";
            $.ajax({
                url: operationUri,
                type: "POST", timeout: ajaxTimeout,
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    alert('success - dev this is not 100% yet!!!');
                    alert(JSON.stringify(data));
                    //displayAlertDialog('The Tasks have been deleted (put in the TrashBin): ' + JSON.stringify(data));
                },
                error: function (data, errorCode, errorMessage) {
                    alert('Error in admin.js.cmdDeleteAllBwWorkflowTasksForAWorkflowAppAndParticipant(): ' + errorMessage);
                    //displayAlertDialog('Error in admin.js.cmdDeleteAllBwWorkflowTasksForAWorkflowAppAndParticipant(): ' + errorMessage);
                }
            });
        }
    } catch (e) {
        displayAlertDialog('Error in admin.js.cmdDeleteAllBwWorkflowTasksForAWorkflowAppAndParticipant():2:. Message: ' + e.message + ' Description: ' + e.description);
    }
}

//cmdDeleteAllBwWorkflowUserRolesForAWorkflowApp
function cmdDeleteAllBwBudgetRequestsForAWorkflowAppAndParticipant() {
    // This is a dangerous one! It uses the drill down to get the workflowAppId and ParticipantId, then
    // allows the user to put all the tasks in the TrashBin.
    try {
        // Get the values.
        var e = document.getElementById('selectViewBwWorkflowTaskSelectWorkflowApp');
        var selectedWorkflowAppId = e.options[e.selectedIndex].value;
        //var xxxx = e.options[e.selectedIndex].text;
        var e2 = document.getElementById('selectViewBwWorkflowTaskSelectWorkflowAppDrillDown1');
        var selectedParticipantId = e2.options[e2.selectedIndex].value;
        var proceed = confirm('Delete Budget Requests for the selected WorkflowApp and Participant\n\nThis action cannot be undone.\n\nClick the OK button to proceed...');
        if (proceed) {
            // Note: This should be deleted, but in the future, maybe use the TrashBin.
            var data = [];
            //data = {
            //    bwTenantId: bwTenantId,
            //    bwTenantOwnerId: bwTenantOwnerId
            //};
            var data = {
                bwWorkflowAppId: selectedWorkflowAppId,
                bwParticipantId: selectedParticipantId
            };
            var operationUri = webserviceurl + "/bwtenant/deleteallbudgetrequestsforworkflowappandparticipant";
            $.ajax({
                url: operationUri,
                type: "POST", timeout: ajaxTimeout,
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    alert('success - dev this is not 100% yet!!!? Is it?');
                    alert(JSON.stringify(data));
                    //displayAlertDialog('The Tasks have been deleted (put in the TrashBin): ' + JSON.stringify(data));
                },
                error: function (data, errorCode, errorMessage) {
                    alert('Error in admin.js.cmdDeleteAllBwWorkflowTasksForAWorkflowAppAndParticipant(): ' + errorMessage);
                    //displayAlertDialog('Error in admin.js.cmdDeleteAllBwWorkflowTasksForAWorkflowAppAndParticipant(): ' + errorMessage);
                }
            });
        }
    } catch (e) {
        displayAlertDialog('Error in admin.js.cmdDeleteAllBwBudgetRequestsForAWorkflowAppAndParticipant():2:. Message: ' + e.message + ' Description: ' + e.description);
    }

} //cmdDeleteAllBwBudgetRequestsForAWorkflowAppAndParticipant


//
function cmdDeleteAllBwWorkflowUserRolesForAWorkflowApp() {
    // This is a dangerous one! It uses the drill down to get the workflowAppId and ParticipantId, then
    // allows the user to put all the tasks in the TrashBin.
    try {
        // Get the values.
        var e = document.getElementById('selectViewBwWorkflowTaskSelectWorkflowApp');
        var selectedWorkflowAppId = e.options[e.selectedIndex].value;
        //var xxxx = e.options[e.selectedIndex].text;
        var e2 = document.getElementById('selectViewBwWorkflowTaskSelectWorkflowAppDrillDown1');
        var selectedParticipantId = e2.options[e2.selectedIndex].value;
        var proceed = confirm('Delete Budget Requests for the selected WorkflowApp and Participant\n\nThis action cannot be undone.\n\nClick the OK button to proceed...');
        if (proceed) {
            // Note: This should be deleted, but in the future, maybe use the TrashBin.
            var data = [];
            //data = {
            //    bwTenantId: bwTenantId,
            //    bwTenantOwnerId: bwTenantOwnerId
            //};
            var data = {
                bwWorkflowAppId: selectedWorkflowAppId,
                bwParticipantId: selectedParticipantId
            };
            var operationUri = webserviceurl + "/bwtenant/deleteallworkflowuserrolesforworkflowappandparticipant";
            $.ajax({
                url: operationUri,
                type: "POST", timeout: ajaxTimeout,
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    alert('success - dev this is not 100% yet!!!? Is it?');
                    alert(JSON.stringify(data));
                    //displayAlertDialog('The Tasks have been deleted (put in the TrashBin): ' + JSON.stringify(data));
                },
                error: function (data, errorCode, errorMessage) {
                    alert('Error in admin.js.cmdDeleteAllBwWorkflowUserRolesForAWorkflowApp(): ' + errorMessage);
                    //displayAlertDialog('Error in admin.js.cmdDeleteAllBwWorkflowTasksForAWorkflowAppAndParticipant(): ' + errorMessage);
                }
            });
        }
    } catch (e) {
        displayAlertDialog('Error in admin.js.cmdDeleteAllBwWorkflowUserRolesForAWorkflowApp():2:. Message: ' + e.message + ' Description: ' + e.description);
    }

}

function cmdListAllWorkflowTasksTrashbin() {
    // Use ajax.
    $('#txtBwWorkflowTasksTrashbin').empty();
    var data = {
        //"bwTenantId": "null",
        //"bwTenantOwnerFacebookUserId": "test1",
        //"bwTenantOwnerLinkedInUserId": "test1",
        //"bwTenantOwnerFriendlyName": "Todd Hiltz1",
        //"bwTenantOwnerEmail": "todd1@capexworkflow.com",
        //"bwWorkflows": "null"
    };

    $.ajax({
        url: webserviceurl + "/bwtaskstrashbinadminfindall",
        type: "DELETE",
        contentType: 'application/json',
        //data: JSON.stringify(data),
        success: function (data) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                html += 'bwTaskTitle:' + data[i].bwTaskTitle + ', bwTaskOutcome:' + data[i].bwTaskOutcome + ' bwPercentComplete:' + data[i].bwPercentComplete + ' bwHasBeenProcessedByTheWorkflowEngine:' + data[i].bwHasBeenProcessedByTheWorkflowEngine;
                html += ', bwAssignedToId:' + data[i].bwAssignedToId;
                html += ', bwAssignedToEmail:' + data[i].bwAssignedToEmail; //
                html += ', bwAssignedToFriendlyName:' + data[i].bwAssignedToFriendlyName;
                //html += ', bwTenantId:' + data[i].bwTenantId;
                html += ', bwWorkflowAppId:' + data[i].bwWorkflowAppId;
                html += ', Created:' + data[i].Created;
                html += ', Modified:' + data[i].Modified;
                //html += ', bwLastDayOverDueTaskReminderSentTimestamp:' + data[i].bwLastDayOverDueTaskReminderSentTimestamp;
                html += ', DailyOverdueTaskNotificationDate:' + data[i].DailyOverdueTaskNotificationDate;
                html += ', TrashBin:' + data[i].TrashBin;

                html += ', WorkflowStepName:' + data[i].WorkflowStepName;
                html += ', bwStatus:' + data[i].bwStatus;


                html += '\n\n';
                //html += '';
            }
            html += 'DONE';
            $('#txtBwWorkflowTasksTrashbin').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in admin.js.cmdListAllWorkflowTasksTrashbin():' + errorCode + ', ' + errorMessage);
        }
    });
}

function cmdEmptyWorkflowTasksTrashbin() {
    // Use ajax.
    $('#txtBwWorkflowTasksTrashbin').empty();
    var data = {
        //"bwTenantId": "null",
        //"bwTenantOwnerFacebookUserId": "test1",
        //"bwTenantOwnerLinkedInUserId": "test1",
        //"bwTenantOwnerFriendlyName": "Todd Hiltz1",
        //"bwTenantOwnerEmail": "todd1@capexworkflow.com",
        //"bwWorkflows": "null"
    };

    $.ajax({
        url: webserviceurl + "/bwtaskstrashbinadminempty",
        type: "DELETE",
        contentType: 'application/json',
        //data: JSON.stringify(data),
        success: function (data) {
            console.log('The trashbin has been emptied: ' + JSON.stringify(data));
            alert('The trashbin has been emptied: ' + JSON.stringify(data));
            //var html = '';
            //for (var i = 0; i < data.length; i++) {
            //    html += 'bwTaskTitle:' + data[i].bwTaskTitle + ', bwTaskOutcome:' + data[i].bwTaskOutcome + ' bwPercentComplete:' + data[i].bwPercentComplete + ' bwHasBeenProcessedByTheWorkflowEngine:' + data[i].bwHasBeenProcessedByTheWorkflowEngine;
            //    html += ', bwAssignedToId:' + data[i].bwAssignedToId;
            //    html += ', bwAssignedToEmail:' + data[i].bwAssignedToEmail; //
            //    html += ', bwAssignedToFriendlyName:' + data[i].bwAssignedToFriendlyName;
            //    //html += ', bwTenantId:' + data[i].bwTenantId;
            //    html += ', bwWorkflowAppId:' + data[i].bwWorkflowAppId;
            //    html += ', Created:' + data[i].Created;
            //    html += ', Modified:' + data[i].Modified;
            //    //html += ', bwLastDayOverDueTaskReminderSentTimestamp:' + data[i].bwLastDayOverDueTaskReminderSentTimestamp;
            //    html += ', DailyOverdueTaskNotificationDate:' + data[i].DailyOverdueTaskNotificationDate;
            //    html += ', TrashBin:' + data[i].TrashBin;

            //    html += ', WorkflowStepName:' + data[i].WorkflowStepName;
            //    html += ', bwStatus:' + data[i].bwStatus;


            //    html += '\n\n';
            //    //html += '';
            //}
            //html += 'DONE';
            //$('#txtBwWorkflowTasksTrashbin').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in admin.js.cmdEmptyWorkflowTasksTrashbin():' + errorCode + ', ' + errorMessage);
        }
    });
}