'use strict';

var ajaxTimeout = 3000; //2000; //1500;

var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var appweburl2;
var appweburl;

var globalUrlPrefix = 'https://'; 

var globalUrl = 'budgetworkflow.com';
var globalUrlForWebServices = 'budgetworkflow.com';

var webserviceurl = globalUrlPrefix + globalUrlForWebServices + '/_bw';

var participantId;
var participantLogonType;
var participantLogonTypeUserId;
var participantFriendlyName;
var participantEmail;

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
        //debugger;
        var isAuthenticationWidgetInstantiated;
        try {
            var xx = $('#divBwAuthentication').bwAuthentication('options');
            isAuthenticationWidgetInstantiated = true;
        } catch (e) {
            isAuthenticationWidgetInstantiated = false;
        }
        if (isAuthenticationWidgetInstantiated == true) { 
            $('#divBwAuthentication').bwAuthentication('checkIfAuthenticatedAndProcessQuerystringParameters');
        } else {
            var authenticationOptions = {
                backendAdministrationLogin: true
            };
            $("#divBwAuthentication").bwAuthentication(authenticationOptions);
        }






        
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
        handleExceptionWithAlert('Error in admin.js.document.ready()', e.message + ', ' + e.stack);
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
    //displayAlertDialog('xxx');
    //initializeTheForm();

    cmdDisplayWebsiteTrafficAudienceSize();
    cmdDisplayWebsiteTrafficNumberOfParticipants();
    cmdDisplayWebsiteTrafficNumberOfTenants();
    cmdDisplayWebsiteErrorThreats();
    //cmdDisplaySentEmails();
    cmdGetStatusOfWorkflowTimer();
    cmdGetStatusOfImap();
    cmdDisplayNumberOfLicenses();
    displayStatusOfFileServices();

    cmdRenderVisitorActivityReport();
    cmdRenderLogonActivityReport();

    $('#txtBwExceptionLogDetails').empty();

}

function populateTheTenantToDeleteDropDown() {
    // List all of the Tenants in the drop down.
    $.ajax({
        url: webserviceurl + "/bwtenantsfindall",
        type: "DELETE",
        contentType: 'application/json',
        success: function (data) {
            var html = '';
            html += '<select id="selectAdminTenantSelectListForDeleteDropDown">';
            for (var i = 0; i < data.length; i++) {
                //html += 'Owner:' + data[i].bwTenantOwnerFriendlyName + ', User Id:' + data[i].bwTenantOwnerId + ', Tenant Id:' + data[i].bwTenantId;
                //html += '\n\n';
                html += '<option value="' + data[i].bwTenantId + '" >' + data[i].bwTenantOwnerFriendlyName + '(' + data[i].bwTenantOwnerEmail + ')' + '</option>';
            }
            html += '</select>';
            document.getElementById('spanAdminTenantSelectListForDeleteDropDown').innerHTML = html;
        },
        error: function (data, errorCode, errorMessage) {
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in admin.js.populateTheTenantToDeleteDropDown():' + errorCode + ', ' + errorMessage);
        }
    });
}

function cmdAdminDeleteSelectedTenant() {
    // Delete the User and Tenant that has been selected in the drop down.
    try {
        //debugger; // bwTenantOwnerId is not correct..?? 8-13-2020
        var e = document.getElementById('selectAdminTenantSelectListForDeleteDropDown');
        var bwTenantId = e.options[e.selectedIndex].value;
        //var bwTenantOwnerId = e.options[e.selectedIndex].text;
        var tenantOwnerFriendlyNameAndEmail = e.options[e.selectedIndex].text;
        var tenantOwnerEmail = tenantOwnerFriendlyNameAndEmail.split('(')[1].split(')')[0];
        var proceed = confirm('Delete User and Tenant owned by ' + tenantOwnerFriendlyNameAndEmail + ' (bwTenantId: ' + bwTenantId + ')\n\nThis action cannot be undone.\n\nClick the OK button to proceed...');
        if (proceed) {
            // Note: This should be deleted, but in the future, maybe use the TrashBin.
            var data = [];
            data = {
                bwTenantId: bwTenantId,
                //bwTenantOwnerId: bwTenantOwnerId
                tenantOwnerEmail: tenantOwnerEmail
            };
            var operationUri = webserviceurl + "/bwtenant/deletethistenant";
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
                        displayAlertDialog('The Tenant has been deleted: ' + JSON.stringify(result));
                    } else {
                        displayAlertDialog('The Tenant did not delete successfully: ' + JSON.stringify(result));
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in admin.js.cmdAdminDeleteSelectedTenant(): ' + errorMessage);
                }
            });
        }
    } catch (e) {
        displayAlertDialog('Error in admin.js.cmdAdminDeleteSelectedTenant():2:. Message: ' + e.message + ' Description: ' + e.description);
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
        //debugger;
        try {
            document.getElementById('spanNotLoggedInBetaBanner').style.display = 'none';
            document.getElementById('spanLoggedInBetaBanner').style.display = 'block';
        } catch (e) { }

        document.getElementById('divAdminLoginScreen').style.display = 'none';
        document.getElementById('divBody').style.display = 'inline'; // 

        // WHY DO WE DO THIS HERE??? IT SHOULD HAVE HAPPENED ALREADY 8-6-2020
        webserviceurl = globalUrlPrefix + globalUrlForWebServices + '/_bw';
        appweburl = globalUrlPrefix + globalUrlForWebServices;
        appweburl2 = globalUrlPrefix + globalUrl;

        initializeTheForm();

    } catch (e) {
        debugger;
        console.log('Exception in my.js.renderWelcomeScreen_BackendAdministration():6:', e.message + ', ' + e.stack);
        displayAlertDialog('Exception in my.js.renderWelcomeScreen_BackendAdministration():6:', e.message);
    }
}


function renderLeftButtons(leftButtonSectionDiv) {
    try {
        var role;
        try {
            var selectedValue = $('#selectHomePageWorkflowAppDropDown option:selected').val();
            role = selectedValue.split('|')[1];
        } catch (e) {
            // If we made it here, (because there is not drop down workflow selector on the home page) there must only be 1 workflow app, which this user is the owner of.
            role = 'owner'; // Todd: We need to look at this again!
        }


        // THIS ONLY WORKS FOR THE HOME PAGE SO FAR!<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        //
        // Try to get a custom image. If none found, use the OOB one.
        var imageVersionGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        var imagePath = globalUrlPrefix + globalUrl + '/_files/' + workflowAppId + '/orgimages/' + 'root' + '/' + 'orgimage.png?v=' + imageVersionGuid; // thiz.options.store.OrgId
        //$('#orgImage_root_blueheaderbar1').attr('src', imagePath2);
        //$('#orgImage_root_blueheaderbar2').attr('src', imagePath2);
        //$('#orgImage_root_blueheaderbar3').attr('src', imagePath2);
        //$('#orgImage_root_blueheaderbar4').attr('src', imagePath2);
        //$('#orgImage_root_blueheaderbar5').attr('src', imagePath2);
        //$('#orgImage_root_blueheaderbar6').attr('src', imagePath2);
        // End: Getting the custom image
        //

        //debugger;
        var lookForOrgImage = function (imagePath) {
            return new Promise(function (resolve, reject) {
                $.get(imagePath).done(function () {
                    //debugger;
                    var img = new Image();
                    img.src = imagePath;
                    img.onload = function (e) {
                        try {
                            //document.getElementById('orgImage_' + identityJson.bwOrgId).src = imagePath; // This is the business model editor org treeview image.
                            //debugger;


                            //if (identityJson.bwOrgId == 'root') {
                            //document.getElementById("orgImage_root_blueheaderbar1").src = imagePath;
                            //document.getElementById("orgImage_root_blueheaderbar2").src = imagePath;
                            //document.getElementById("orgImage_root_blueheaderbar3").src = imagePath;
                            //document.getElementById("orgImage_root_blueheaderbar4").src = imagePath;
                            //document.getElementById("orgImage_root_blueheaderbar5").src = imagePath;
                            //document.getElementById("orgImage_root_blueheaderbar6").src = imagePath;
                            //}

                            // This automaticagically populates the image at the top left of the top blue bar. 8-20-2020
                            try {
                                for (var i = 1; i < 20; i++) {
                                    document.getElementById('orgImage_root_blueheaderbar' + i).src = imagePath;
                                }
                            } catch (e) {
                                // Do nothing, no more images to populate. 
                            }


                            //$('.bwCircleDialog').bwCircleDialog('displayOrgRoleEditorInACircle', true, identityJson.bwOrgId);


                            //var html = '';
                            //html += '<img id="orgImage2_' + '' + '" style="width:30px;height:30px;vertical-align:middle;" src="' + imagePath + '" />';
                            ////This element might not exist!
                            //var parentElementId;
                            //try {
                            //    parentElementId = $(thiz.options.requestForm).closest('.ui-dialog-content')[0].id; // If it is in a dialog, this returns the dialog id.
                            //} catch (e) { }
                            //if (!parentElementId) {
                            //    // It is not in a dialog, so it must be a new request.
                            //    parentElementId = 'divCreateRequestFormContent';
                            //}
                            //try {
                            //    //debugger;
                            //    //document.getElementById(orgsImageFetchingInformation[i].spanOrgId).innerHTML = html; //imagePath;
                            //    $('#' + parentElementId).find('#' + orgsImageFetchingInformation[i].spanOrgId)[0].innerHTML = html; //imagePath;
                            //    resolve();
                            //} catch (e) {
                            //    // ACTUALLY WE SHOUDL BE LOADING THE ELEMENT HERE MAYBE? IT USED TO WORK! 2-5-2020
                            //    //document.getElementById(orgsImageFetchingInformation[i].imageId).src = imagePath;
                            //    $('#' + parentElementId).find('#' + orgsImageFetchingInformation[i].imageId)[0].src = imagePath;
                            //    //console.log('Exception in bwOrganizationEditor.js.renderOrgRolesEditor(): span tag with id="' + orgsImageFetchingInformation[i].spanOrgId + '" does not exist! ' + e.message + ', ' + e.stack);
                            //    resolve();
                            //}

                        } catch (e) {
                            console.log('Exception in renderLeftButtons().img.onload(): ' + e.message + ', ' + e.stack);
                            //alert('Exception in xx().img.onload(): ' + e.message + ', ' + e.stack);
                            reject();
                        }
                    }
                }).fail(function () {
                    // do nothing, it just didn't find an image.
                    resolve();
                });
            });
        }
        lookForOrgImage(imagePath);

        //debugger;






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

        document.getElementById(leftButtonSectionDiv).innerHTML = html;

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
        debugger;
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
        console.log('Error in my.js.populateStartPageItem(' + divSection + ') xcx59e46-2: ' + e.message + ', ' + e.stack);
        displayAlertDialog('Error in my.js.populateStartPageItem(' + divSection + ') xcx59e46-2: ' + e.message);
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
        console.log('Exception in renderConfigurationForms(): ' + e.message + ', ' + e.stack);
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
        disableBehaviorButton();
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
        html += '               <img src="images/playbutton.jpg" style="width:55px;height:35px;vertical-align:middle;" />';
        html += '           </span>';
        html += '           <span style="cursor:pointer;">Random</span>';
        html += '           <br />';

        html += '           <input type="radio" style="cursor:pointer;" name="cbSelectNotificationSound" />&nbsp;';
        html += '           <span style="cursor:pointer;">';
        html += '               <img src="images/playbutton.jpg" style="width:55px;height:35px;vertical-align:middle;" />';
        html += '           </span>';
        html += '           <span style="cursor:pointer;">No Sound</span>';
        html += '           <br />';

        html += '           <input type="radio" style="cursor:pointer;" name="cbSelectNotificationSound" />&nbsp;';
        html += '           <span style="cursor:pointer;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'playNotificationSound1\');">';
        html += '               <img src="images/playbutton.jpg" style="width:55px;height:35px;vertical-align:middle;" />';
        html += '           </span>';
        html += '           <span style="cursor:pointer;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'playNotificationSound1\');">Star Trek</span>';
        html += '           <br />';
        html += '           <input type="radio" style="cursor:pointer;" name="cbSelectNotificationSound" />&nbsp;';
        html += '           <span style="cursor:pointer;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'playNotificationSound2\');">';
        html += '               <img src="images/playbutton.jpg" style="width:55px;height:35px;vertical-align:middle;" />';
        html += '           </span>';
        html += '           <span style="cursor:pointer;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'playNotificationSound2\');">Cash Register</span>';
        html += '           <br />';
        html += '           <input type="radio" style="cursor:pointer;" name="cbSelectNotificationSound" />&nbsp;';
        html += '           <span style="cursor:pointer;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'playNotificationSound3\');">';
        html += '               <img src="images/playbutton.jpg" style="width:55px;height:35px;vertical-align:middle;" />';
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
        if (emailAggregatorTwiceDailyFirstTime) {
            //displayAlertDialog('emailAggregatorTwiceDailyFirstTime: ' + emailAggregatorTwiceDailyFirstTime);
            document.getElementById('selectAggregateEmailTwiceDailyFirstTime').value = emailAggregatorTwiceDailyFirstTime;
            document.getElementById('selectAggregateEmailTwiceDailySecondTime').value = emailAggregatorTwiceDailySecondTime;
            document.getElementById('selectAggregateEmailTwiceDailyTimezoneDisplayName').value = emailAggregatorTwiceDailyTimezoneDisplayName;
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
    }
}

function ShowActivitySpinner() {
    try {
        console.log('In my.js.ShowActivitySpinner().');
        $('#divBwActivitySpinner').bwActivitySpinner('show');
    } catch (e) {
        console.log('Exception in my.js.ShowActivitySpinner(): ' + e.message + ', ' + e.stack);
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


function refreshPage() {
    try {
        ShowActivitySpinner();
        setTimeout(function () {
            //$('.bwCoreComponent').bwCoreComponent('playNotificationSound_Random');
            renderWelcomeScreen();
            HideActivitySpinner();
        }, 500);
    } catch (e) {
        console.log('Exception in livestatus.html.refreshPage(): ' + e.message + ', ' + e.stack);
    }
}

function initializeTheForm() {
    try {

        debugger;
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


        console.log('');
        console.log('SETTING UP THE REFRESH_PAGE');
        console.log('');
        var spinnerOptions = {
        };
        $("#divBwActivitySpinner").bwActivitySpinner(spinnerOptions);


        //
        // This is the only place where the refresh interval is set. Comment out to turn off. 1-29-2022
        //
        //var interval_RefreshPage = window.setInterval(refreshPage, 7500); // 15000 milliseconds is 15 seconds.












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





        //var options = { };
        //var $bwCoreComponent = $('#divBwCoreComponent').bwCoreComponent(options);

        var options = {
            displayOnCreation: false
        };
        var $bwMonitoringTools = $('#divBwMonitoringTools').bwMonitoringTools2(options);
        $('#divBwMonitoringTools').bwMonitoringTools2('cmdDisplayWebsiteErrorThreats');





        var options = {
            backendAdministrationMode: true
        };
        var $bwemailmonitor = $("#divBwEmailMonitor").bwEmailMonitor(options);










        var options = {
            displayOnCreation: false
        };
        var $bwBackendAdministrationForAllParticipants = $('#divBwAdmin').bwBackendAdministrationForAllParticipants(options);
        //$bwBackendAdministrationForAllParticipants.bwBackendAdministrationForAllParticipants('renderAdmin');

        //
        // "New Tenant/User" functionality.
        //
        var options = { };
        var $bwNewUserEmailEditor = $('#divBwNewUserEmailEditor').bwNewUserEmailEditor(options);

        var options = {};
        var $bwNewUserRolesEditor = $('#divBwNewUserRolesEditor').bwNewUserRolesEditor(options);

        var options = { };
        var $bwNewUserBusinessModelEditor = $('#divBwNewUserBusinessModelEditor').bwNewUserBusinessModelEditor(options);

        var options = { };
        var $bwNewUserWorkflowEditor = $('#divBwNewUserWorkflowEditor').bwNewUserWorkflowEditor(options);
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
        cmdGetStatusOfWorkflowTimer();
        cmdGetStatusOfImap();
        cmdDisplayNumberOfLicenses();
        displayStatusOfFileServices();

        populateTheTenantToDeleteDropDown();

        populateSelectViewBwWorkflowTaskSelectWorkflowApp(); 

    } catch (e) {
        handleExceptionWithAlert('Error in admin.js.initializeTheForm()', e.message +', ' + e.stack);
    }
}


function renderWelcomeScreen() {
    try {
        debugger;
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


        // Get the list of unique ip addresses from the xx web service, and display in element spanLastClientBrowserActivityTimestamp.
        $('#spanLastClientBrowserActivityTimestamp').empty();
        $.ajax({
            url: webserviceurl + "/bwuserauthenticationtrafficlogsuniqueips",
            type: "DELETE",
            contentType: 'application/json',
            data: JSON.stringify({}),
            success: function (data) {
                try {
                    debugger;
                    //alert(JSON.stringify(data));
                    //// First we are going to sort the list so the most recent is at the top.
                    //var IpAddresses_With_AssociatedParticipantEmailAddresses = [];
                    //for (var i = 0; i < data.IpAddresses_With_AssociatedParticipantEmailAddresses.length; i++) {
                    //    if (IpAddresses_With_AssociatedParticipantEmailAddresses.length == 0) {
                    //        // If there aren't any yet, add the first one.
                    //        IpAddresses_With_AssociatedParticipantEmailAddresses.push(data.IpAddresses_With_AssociatedParticipantEmailAddresses[i]);
                    //    } else {
                    //        var itemHasBeenAddedToTheArray = false;
                    //        for (var j = 0; j < IpAddresses_With_AssociatedParticipantEmailAddresses.length; j++) {
                    //            // We do the sorting here.
                    //            var timestampOldArray = new Date(data.IpAddresses_With_AssociatedParticipantEmailAddresses[i].LatestLogin_Timestamp);
                    //            var timestampNewArray = new Date(IpAddresses_With_AssociatedParticipantEmailAddresses[j].LatestLogin_Timestamp);
                    //            if (timestampNewArray < timestampOldArray) {
                    //                IpAddresses_With_AssociatedParticipantEmailAddresses.splice(j, 0, data.IpAddresses_With_AssociatedParticipantEmailAddresses[i]); // Add to the new array. // xx.splice(2, 0, 'drum') // element, deletecount, jsonobject
                    //                data.IpAddresses_With_AssociatedParticipantEmailAddresses.splice(i, 1); // Remove from the old array.
                    //                itemHasBeenAddedToTheArray = true;
                    //                break;
                    //            }
                    //        }

                    //        if (itemHasBeenAddedToTheArray == false) {
                    //            // The item didn't get added to the array so we will just add it to the end.
                    //            IpAddresses_With_AssociatedParticipantEmailAddresses.push(data.IpAddresses_With_AssociatedParticipantEmailAddresses[i]); // Add to the new array. // xx.splice(2, 0, 'drum') // element, deletecount, jsonobject
                    //            data.IpAddresses_With_AssociatedParticipantEmailAddresses.splice(i, 1); // Remove from the old array.
                    //        }

                    //    }
                    //}

                    //
                    // At this point the whole thing should be sorted by Timestamp, descending.
                    //

                    var html = '';

                    html += '<br />';
                    for (var i = 0; i < data.IpAddresses_With_AssociatedParticipantEmailAddresses.length; i++) {

                        var Ip = data.IpAddresses_With_AssociatedParticipantEmailAddresses[i].Ip;
                        var ParticipantEmailAddresses = data.IpAddresses_With_AssociatedParticipantEmailAddresses[i].ParticipantEmailAddresses;
                        var LatestLogin_Timestamp = new Date(data.IpAddresses_With_AssociatedParticipantEmailAddresses[i].LatestLogin_Timestamp);
                        var timestamp = bwCommonScripts.getBudgetWorkflowStandardizedDate(LatestLogin_Timestamp);


                        // 3-24-2022
                        if (Ip.indexOf('142.177.223.35') > -1) { // This is the beginning of our discovery for ip addresses. For example go to ip2location.com.
                            Ip += '<span style="color:goldenrod;font-weight:bold;"> (Paddy\'s Kentville) </span>'; 
                        } else if (Ip.indexOf('173.237.113.6') > -1) {
                            Ip += '<span style="color:goldenrod;font-weight:bold;"> (Crescent Avenue) </span>'; 
                        } else if (Ip.indexOf('174.61.126.70') > -1) {
                            Ip += '<span style="color:goldenrod;font-weight:bold;"> (Jupiter) </span>'; 
                        }


                        html += timestamp + ': ' + '[' + Ip + '] ' + ParticipantEmailAddresses;
                        html += '<br />';

                    }
                    html += 'DONE';
                    $('#spanLastClientBrowserActivityTimestamp').append(html);
                } catch (e) {
                    console.log('Exception in call to bwuserauthenticationtrafficlogsuniqueips(): ' + e.message + ', ' + e.stack);
                }
            },
            error: function (data, errorCode, errorMessage) {
                //window.waitDialog.close();
                //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
                displayAlertDialog('Error in call to bwuserauthenticationtrafficlogsuniqueips():' + errorCode + ', ' + errorMessage);
            }
        });




        debugger;
        // Get the list of unique ip addresses from the xx web service, and display in element spanLastClientBrowserActivityTimestamp.
        $('#spanLastEmailSentTimestamp').empty();
        $.ajax({
            url: webserviceurl + "/bwuserauthenticationtrafficlogslastemailsent",
            type: "DELETE",
            contentType: 'application/json',
            data: JSON.stringify({}),
            success: function (data) {
                try {
                    debugger;
                    var html = '';
                    for (var i = 0; i < data.length; i++) {
                        //html += 'Log entry details:' + data[i].Details;
                        //html += ', ';
                        //html += 'Logon provider:' + data[i].LogonType;
                        //html += ', ';
                        //html += 'Id:' + data[i].LogonTypeId;
                        //html += ', ';
                        //html += 'Referrer:' + data[i].Referrer;
                        //html += ', ';

                        var timestamp = bwCommonScripts.getBudgetWorkflowStandardizedDate(data[i].Timestamp);

                        html += timestamp + ', bwWorkflowAppId:' + data[i].bwWorkflowAppId + ', To: ' + data[i].ToParticipantEmail;
                        html += '<br />';
                        //html += ', ';
                        //html += 'Timestamp:' + data[i].Timestamp;
                        //html += ', ';
                        ////html += 'User agent:' + data[i].UserAgent;
                        ////html += ', ';
                        //html += 'Participant:' + data[i].bwParticipantFriendlyName;
                        //html += ', ';
                        //html += 'Email:' + data[i].bwParticipantEmail;
                        //html += ', ';
                        //html += 'bwWorkflowAppId:' + data[i].bwWorkflowAppId;
                        //html += '\n\n';
                        //html += '';
                    }
                    html += 'DONE';
                    $('#spanLastEmailSentTimestamp').append(html);
                } catch (e) {
                    console.log('Exception in call to bwuserauthenticationtrafficlogslastemailsent(): ' + e.message + ', ' + e.stack);
                }
            },
            error: function (data, errorCode, errorMessage) {
                //window.waitDialog.close();
                //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
                displayAlertDialog('Error in call to bwuserauthenticationtrafficlogslastemailsent():' + errorCode + ', ' + errorMessage);
            }
        });






    } catch (e) {
        debugger;
        console.log('Exception in my.js.renderWelcomeScreen():6:', e.message + ', ' + e.stack);
        displayAlertDialog('Exception in my.js.renderWelcomeScreen():6:', e.message);
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
                html += data.d.results[0][0].bwDocumentXml + '<br/>'; // TODD: I don't like how this data is getting returned.
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
            displayAlertDialog('Error in index.js.cmdListAllBwWorkflowUsers():' + errorCode + ', ' + errorMessage);
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
        type: "DELETE",
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
            displayAlertDialog('Error in index.js.cmdListAllWorkflowApps():' + errorCode + ', ' + errorMessage);
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
            displayAlertDialog('Error in index.js.cmdListAllFunctionalAreas():' + errorCode + ', ' + errorMessage);
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
                html += 'bwWorkflowAppId: ' + data[i].bwParticipantId + ', ';
                html += 'bwParticipantId: ' + data[i].bwParticipantId + ', ';
                html += 'bwEmailAggregatorId: ' + data[i].bwEmailAggregatorId + ', ';
                html += 'bwParticipantEmail: ' + data[i].bwParticipantEmail + ', ';
                html += 'Created: ' + data[i].Created + ', ';
                html += 'EmailSubject: ' + data[i].EmailSubject + ', ';
                html += 'EmailBody: ' + data[i].EmailBody;
                html += '\n\n';
                //html += 'bwEmailAggregatorId: ' + data[i].bwEmailAggregatorId + ', ';
                //html += 'bwParticipantEmail: ' + data[i].bwParticipantEmail + ', ';
                //html += 'bwParticipantId: ' + data[i].bwParticipantId + ', ';
                //html += 'Created: ' + data[i].Created + ', ';
                //html += 'EmailSubject: ' + data[i].EmailSubject + ', ';
                //html += 'EmailBody: ' + data[i].EmailBody;
                //html += '\n\n';
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

    $.ajax({
        url: webserviceurl + "/bwwebsitetrafficlogs",
        type: "DELETE",
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (data) {
            try {
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
    // Use ajax.
    $('#spanNumberOfParticipants').empty();
    //var data = {
    //    //"bwTenantId": "null",
    //    //"bwTenantOwnerFacebookUserId": "test1",
    //    //"bwTenantOwnerLinkedInUserId": "test1",
    //    //"bwTenantOwnerFriendlyName": "Todd Hiltz1",
    //    //"bwTenantOwnerEmail": "todd1@capexworkflow.com",
    //    //"bwWorkflows": "null"
    //};

    $.ajax({
        url: webserviceurl + "/bwparticipantsfindall",
        type: "DELETE",
        contentType: 'application/json',
        //data: JSON.stringify(data),
        success: function (data) {
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
        },
        error: function (data, errorCode, errorMessage) {
            //displayAlertDialog('yyyyyyyy');
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in admin.js.cmdDisplayWebsiteTrafficNumberOfParticipants():' + errorCode + ', ' + errorMessage);
        }
    });
}

function cmdDisplayWebsiteTrafficNumberOfTenants() {
    $('#spanNumberOfTenants').empty();
    $.ajax({
        url: webserviceurl + "/bwtenantsfindall",
        type: "DELETE",
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
        type: "DELETE",
        contentType: 'application/json',
        success: function (data) {
            var html = '';
            html += '<select id="selectViewBwWorkflowTaskSelectWorkflowApp" onchange="populateSelectViewBwWorkflowTaskSelectWorkflowAppDrillDown1();">';
            for (var i = 0; i < data.length; i++) {
                html += '<option value="' + data[i].bwWorkflowAppId + '">' + data[i].bwWorkflowAppTitle + ' - ' + data[i].bwWorkflowAppId + '</option>';
                //html += 'Title:' + data[i].bwWorkflowAppTitle + ', Tenant Id:' + data[i].bwTenantId + ', Workflow App Id:' + data[i].bwWorkflowAppId;
            }
            html += '</select>';
            $('#spanViewBwWorkflowTaskSelectWorkflowApp').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            displayAlertDialog('Error in index.js.populateSelectViewBwWorkflowTaskSelectWorkflowApp():' + errorCode + ', ' + errorMessage);
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