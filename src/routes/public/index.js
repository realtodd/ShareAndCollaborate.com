'use strict';

/*
    @licstart  The following is the entire license notice for the
    JavaScript code in this page.

    Welcome to this software. BudgetWorkflow.com, ShareAndCollaborate.com. 
    Copyright (C) 2011-2023  Todd N. Hiltz
    Contact todd@budgetworkflow.com, todd@shareandcollaborate.com. Todd Hiltz, 61 Crescent Avenue, Kentville, Nova Scotia, Canada B4N 1R1. 

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see https://www.gnu.org/licenses.

    @licend  The above is the entire license notice
    for the JavaScript code in this page.
*/

/*
===========================================================
This is the index.js script. 
===========================================================

    [more to follow]
                      
===========================================================
===========================================================
MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

    [put your stuff here]

===========================================================
   
*/

console.log('**************************************************');
console.log('********** In /public/scripts/index.js ***********');
console.log('**************************************************');

var timerObject;

var Platform = 'Desktop'; //  This is used to tailor things such as how the attachments section functions, and for date pickers, number fields, etc. This lets us have a single api but have it work for all devices and platforms.
var viewsFolderName = 'views'; // Since we are using the variable above, we could probably get rid of this but we will leave it this way for now.

var iOSApp = ''; // This gets set from the iOS app to 'YES'. We need to know this when launching media file attachments.

//var voiceMemoFilePath = '';

var appHasBeenLaunchedFromEmailForThisRequestId = ''; // This is used to display the budget request when an email link is clicked.

var errors = '';
var connectionTimerObject;
//var errors = []; // This is used by "WriteToErrorLog()". When an error cannot be written it will try at a later time when we have communication with the server.
//errors = new Array();




var invitationAlreadyAccepted = false; // This solves the problem when the invitation parameter is in the query string.

//
// TESTING THIS ADDED source, enabled PARAMETERS. USE THESE TO TRACK AND DISABLEFUNCTIONALITY WITH LOGGING. THIS is complicated, so it seems the best approach so far. 8-3-2024.
//

//var turnOnAlerts1 = false;

var tempCloseOutXml;

var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

//var googleOAuth2ClientId = '327984438236-lcg6psf878672cg6j4eag8erjp9cnj9d.apps.googleusercontent.com'; // This is for my.budgetworkflow.com
//var googleOAuth2ClientId = '327984438236-m3nh6limbii1l4cia8dt2ubksna2frl8.apps.googleusercontent.com'; // This is for preview.budgetworkflow.com
//var googleOAuth2ClientId = '327984438236-5ipdv3eh1hnnss4mbcgofdrmlgf2askr.apps.googleusercontent.com'; // This is for localhost:2181
var googleOAuth2ClientId = '327984438236-gka01b83peci6bd8oue6o15m8c9k5jpb.apps.googleusercontent.com'; // This is for budgetrequests.com



var globalUrlPrefix = 'http://';
var url1 = window.location.href.split('http://')[1];
var globalUrl = url1.split('/')[0];
var globalUrlForWebServices = globalUrl;

var attachmentsFolderName = "";
var tenantId;
var workflowAppId; // WE SHOULD BE ABLE TO get rid of these variables when we start using the values stored in the home page drop down.
var workflowAppTitle;

var globalArchiveFilter;

// Configuration values.spanLicenseStatus
var globalLicenses = []; // Used throughout.
//// The following is the EFFECTIVE STATUS OF THE LICENSING!!! This is determined from what licenses have been assigned to the workflow.
//var gWorkflowLicenseStatus = 'bronze'; // basic, bronze, silver, gold. THIS IS THE FLAG WE ARE USING THROUGHOUT TO TURN ON/OFF FUNCTIONALITY.
//var gWorkflowLicenseStatus = 'basic';
var gWorkflowLicenseStatus = 'gold';


var tipsDisplayOn = false; // BwParticipant.bwTipsDisplayOn
var displayInvitationsOnHomePageDisplayOn = true;
var displayTaskDetailsBeforeRequests = false;

var selectedCurrencySymbol;

var newBudgetRequestManagerTitle;

var bwLastSelectedArchiveScreenRequestType;
var bwLastSelectedNewRequestType;

var requireStartEndDates;
var requireRequestDetails;
var enableNewRequestAttachments;
var enableNewRequestBarcodeAttachments;


// Provides the list of request types for the drop downs.
var bwEnabledRequestTypes;

var quotingEnabled;
var reimbursementRequestsEnabled; // This allows users to file expense reports, for example.
var recurringExpensesEnabled;
var capitalAndExpenseTrackingEnabled;


var supplementalsEnabled;
var closeoutsEnabled;
var strictAuditingEnabled;

var emailEnabled;

var emailNotificationFrequency; // immediately, aggregatetwicedaily
var emailNotificationTypes; // allnotifications, onlymytasknotifications
var emailAggregatorTwiceDailyFirstTime;
var emailAggregatorTwiceDailySecondTime;
var emailAggregatorTwiceDailyTimezoneDisplayName;

var thumbnailLoadingEnabled;
var multiLogonEnabled;

var bwTwoFactorAuthenticationEnabled;
var bwTwoFactorAuthenticationSmsNumber;

// end Configuration values.


var bwApprovalLevelWorkflowToken; // global set in displayForm_DisplayArBasedOnWorkflowStatus 

// from the ar.js
var filename;

var hideLoggedInUserDropDownFirstClickTracker;

var invitationUserId;

var participantId;
var participantLogonType;
var participantLogonTypeUserId;
var participantFriendlyName;
var participantEmail;

var webserviceurl;
var appweburl2;
var appweburl;
var hostweburl;
var sliceColors = ['#005391', '#B7CA10', '#3A4A01', '#87C8F0', '#8E1828', '#63A01F', '#F8D033', '#FD5E1D']; // New colors 3-9-15
var sliceHighlightedColors = ['#4C86B2', '#BFCA5B', '#75804D', '#B9DBF0', '#8B3D47', '#A0BC81', '#F4D971', '#EA8E69']; // New colors 3-9-15
// This code ensures reuse of seriescolors if it fais to work: http://stackoverflow.com/questions/13984712/jqplot-pie-donut-chart-seriescolors-array-not-reused-repeated

var GetWorkflowAppConfigurationData9; // Using this for deferred.

var GetWorkflowAppConfigurationData; // Using this for deferred.
var GetUserDetails = []; // Using this for deferred from dislayArInDialog().

// Financial Summary deferred arrays.
var RenderFinancialSummaryForSingleWorkflow; // Using this for deferred.
var GetSingleWorkflowDataForFinancialSummary; // Using this for deferred.

// Participant Summary deferred arrays.
var RenderParticipantSummaryForSingleWorkflow; // Using this for deferred.
var GetPendingBudgetRequestsByFunctionalAreaForSingleWorkflow; // Using this for deferred.
var GetSingleParticipantDataAndRender; // Using this for deferred.

var lastErrorSource = ''; // This is used by handleExceptionWithAlert() so that we don't have duplicate alert pop ups.

var newFunctionalAreaAdditionalApprovers = []; // This gets used for adding a new functional area.

var notifications = []; // This is used for the home page notifications.

// These are used in cmdListAllBudgetRequestsUsingClientDatasetApproach.
var budgetRequests;
var supplementals;
var statusesForTheStatusDropdown;

function selfDiscoverOperationUri(myObject) {
    try {
        console.log('In index.js.selfDiscoverOperationUri().');
        //alert('In index.js.selfDiscoverOperationUri().');

        if (myObject.options.operationUriPrefix == null) {
            // This formulates the operationUri, which is used throughout.
            var url1;
            if (window.location.href.indexOf('https://') > -1) {
                url1 = window.location.href.split('https://')[1];
                myObject.options.operationUriPrefix = 'https://';
            } else {
                url1 = window.location.href.split('http://')[1]; // fallback to http.
                myObject.options.operationUriPrefix = 'http://';
            }
            var url2 = url1.split('/')[0];
            myObject.options.operationUriPrefix += url2 + '/';
        }

    } catch (e) {
        var msg = 'Exception in index.js.selfDiscoverOperationUri(): ' + e.message + ', ' + e.stack;
        console.log(msg);
        alert(msg);
    }
}


function unFocus() { // This is another attempt to get the selection issue fixed. Not sure if it works yet. 8-7-2020.
    if (document.selection) {
        document.selection.empty()
    } else {
        window.getSelection().removeAllRanges()
    }
}


function page_Load() {
    try {
        console.log('In index.js.page_Load().');
        //alert('In index.js.page_Load().');

        //
        //
        // THIS IS NICE ON A SMALL DEVICE. Currently just doing it for Android. We need to test on some other devices. 1-30-2024.
        //
        //
        console.log('Checking if an Android device. If so, setting viewport size. navigator.userAgent: ' + navigator.userAgent);
        if (navigator && navigator.userAgent && navigator.userAgent.toLowerCase() && navigator.userAgent.toLowerCase().indexOf('android') > -1) {
            var vp = document.getElementById('bwViewport');
            vp.setAttribute('content', 'width=device-width, initial-scale=0.333');
        }
        //
        //
        // end: THIS IS NICE ON A SMALL DEVICE. 1-30-2024.
        //
        //

        //
        //
        // Bluebird may be required on older devices. Note bwAuthentication widget does not load on Gen. 4 iPod, and this may be a part of the solution for that... more research required.
        //
        //
        if (!(String(typeof Promise) == 'function')) {

            alert('This browser does not support Promises. Attempting to add bluebird.');

            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'scripts/bluebird/bluebird.js'
            document.getElementsByTagName('head')[0].appendChild(script);

        }

        webserviceurl = globalUrlPrefix + globalUrlForWebServices + '/_bw';
        appweburl = globalUrlPrefix + globalUrlForWebServices;
        appweburl2 = globalUrlPrefix + globalUrl;



        //debugger;
        //if (typeof ($.bw.bwKeypressAndMouseEventHandler) != 'undefined') {
        //    //// At this point, we know the widget.js file has loaded. Now we need to check if the widget has been instantiated.
        //    alert('At this point, we know the widget.js file has loaded. Now we need to check if the widget has been instantiated.');
        //}



        var divBwKeypressAndMouseEventHandler = document.getElementById('divBwKeypressAndMouseEventHandler');
        if (!divBwKeypressAndMouseEventHandler) {
            $(document.body).prepend('<div id="divBwKeypressAndMouseEventHandler" style="display:none;"></div>');
        }
        $('#divBwKeypressAndMouseEventHandler').bwKeypressAndMouseEventHandler({}); // Exception in index.js.page_Load(): xxx is not a function. TypeError: ............... 7-1-2024.  973, 

        var divBwPageScrollingHandler = document.getElementById('divBwPageScrollingHandler');
        if (!divBwPageScrollingHandler) {
            $(document.body).prepend('<div id="divBwPageScrollingHandler" style="display:none;"></div>');
        }
        $('#divBwPageScrollingHandler').bwPageScrollingHandler({});



        //
        //
        // The bwAuthentication.js widget is large and takes some time to load on an old iPod I am using for testing.
        // Therefore I am doing this to prevent failure. 1-26-2024.
        //
        //
        var counter = 0;
        while (!(typeof ($.bw.bwAuthentication) != 'undefined')) {
            setTimeout(function () {
                alert('The bwAuthentication widget is loading...' + counter);
                counter += 1;
            }, 2000);
        }

        console.log('LOADED bwAuthentication widget.');

        if (typeof (jQuery.bw.bwAuthentication) != 'undefined') {
            var divBwAuthentication = document.getElementById('divBwAuthentication');
            if (!divBwAuthentication) {
                $(document.body).prepend('<div id="divBwAuthentication" style="display:none;"></div>');
            }
            $('#divBwAuthentication').bwAuthentication({}); // This line is failing on the iPod 4. 1-26-2024.
        } else {
            alert('The bwAuthentication widget has not been loaded.');
        }

        var participantId;
        try {
            // This is in a try-catch because if the link comes from an email client, you get this error: [Blocked a frame with origin "https://shareandcollaborate.com" from accessing a cross-origin frame.]
            if (window.opener) {
                participantId = window.opener.$('.bwAuthentication').bwAuthentication('option', 'participantId');
            }
        } catch (e) { }

        var openrequest = $('.bwAuthentication').bwAuthentication('getUrlParams', 'openrequest');
        var bwBudgetRequestId = $('.bwAuthentication').bwAuthentication('getUrlParams', 'request');
        var bwWorkflowTaskItemId = $('.bwAuthentication').bwAuthentication('getUrlParams', 'taskid');

        console.log('');
        console.log('/////////////////////////////////////');
        console.log('In index.js.page_Load(). openrequest: ' + openrequest + ', participantId: ' + participantId + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', bwWorkflowTaskItemId: ' + bwWorkflowTaskItemId);
        console.log('/////////////////////////////////////');
        console.log('');

        // Only recognize openrequest here if the user is logged in.
        if (openrequest && participantId && bwBudgetRequestId) { // bwWorkflowTaskItemId is optional.

            console.log();
            console.log('/////////////////////////////////////');
            console.log('In index.js.page_Load(). THIS IS ANOTHER PLACE WHERE THE POPPED-OUT WINDOW IS HANDLED. Calling bwRequest.displayCreateRequestForm(). WE NEED TO ADD LOGIC HERE TO DISPLAY A SUBMITTED FORM!!!!!!!! <<<<<<<<<<<<<<<<<<<');
            console.log('/////////////////////////////////////');
            console.log();
            //
            // THIS IS WHERE THE NEW REQUEST WINDOW IS HANDLED.
            //

            if (bwWorkflowTaskItemId) {

                // Not a "create request form".
                console.log('');
                console.log('In index.js.page_Load(). POPPED-OUT WINDOW. NOT A CREATE REQUEST FORM xcx1223423');
                console.log('');
                //alert('In index.js.page_Load(). POPPED-OUT WINDOW. NOT A CREATE REQUEST FORM xcx1223423');

                try {
                    var promise = window.opener.$('.bwRequest').bwRequest('scrapeBwRequestJson', bwBudgetRequestId);
                    promise.then(function (bwRequestJson) {
                        try {

                            $('.bwRequest').bwRequest('displayRequestFormDialog', bwBudgetRequestId, '', bwWorkflowTaskItemId, '', bwRequestJson);

                        } catch (e) {
                            console.log('Exception in index.js.page_Load.scrapeBwRequestJson(): ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in my3.js.page_Load.scrapeBwRequestJson(): ' + e.message + ', ' + e.stack);
                            //document.getElementById('txtDisplayJsonDialogJSON').innerHTML = 'Exception in displayCreateRequestForm.scrapeBwRequestJson(): ' + e.message + ', ' + e.stack;
                        }
                    }).catch(function (result) {
                        console.log('In index.js.page_Load.scrapeBwRequestJson(). Promise returned exception: ' + result.message);
                        alert('In index.js.page_Load.scrapeBwRequestJson(). Promise returned exception: ' + result.message);
                    });

                } catch (e) {
                    var msg = "You must be viewing an organization as a Forest Administrator. If not, please report this error.";
                    console.log(msg);
                    alert(msg);
                }

            } else {

                // Is a "create request form".
                console.log('');
                console.log('In index.js.page_Load(). POPPED-OUT WINDOW. IS A CREATE REQUEST FORM xcx1223423-2');
                console.log('');
                alert('In index.js.page_Load(). POPPED-OUT WINDOW. IS A CREATE REQUEST FORM xcx1223423-2');

                var promise = window.opener.$('.bwRequest').bwRequest('scrapeBwRequestJson', bwBudgetRequestId);
                promise.then(function (bwRequestJson) {
                    try {

                        $('.bwRequest').bwRequest('displayRequestForm', bwBudgetRequestId, 'divPageContent1', bwWorkflowTaskItemId, '', bwRequestJson); // displayRequestFormDialog needs to be pulled apart, so that it calls displayRequestForm(), just like displayCreateRequestForm() works.

                    } catch (e) {
                        console.log('Exception in index.js.page_Load.scrapeBwRequestJson():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in index.js.page_Load.scrapeBwRequestJson():2: ' + e.message + ', ' + e.stack);
                        //document.getElementById('txtDisplayJsonDialogJSON').innerHTML = 'Exception in displayCreateRequestForm.scrapeBwRequestJson(): ' + e.message + ', ' + e.stack;
                    }
                })
                    .catch(function (result) {
                        console.log('In index.js.page_Load.scrapeBwRequestJson(). Promise returned exception:2: ' + result.message);
                        alert('In index.js.page_Load.scrapeBwRequestJson(). Promise returned exception:2: ' + result.message);
                    });

            }

        } else {

            console.log('In index.js.page_Load(). WE USED to call RenderContentForButton(HOME_UNAUTHENTICATED) here, but it is the wrong place!!!');

            //console.log('In index.js.page_Load(). WE ARE CALLING intervalTimedCheckForAlertsForIosBadgeUpdateUsingTitle() here, but it is the wrong place!!! Maybe bwAuthentication._create()??? <<<');
            //alert('In index.js.page_Load(). WE ARE CALLING intervalTimedCheckForAlertsForIosBadgeUpdateUsingTitle() here, but it is the wrong place!!! Maybe bwAuthentication._create()??? <<< xcx44432156.');
            //// This ties in with the iOS badge alert by updating the title. Also it is nice because it updates the Home screen alerts on a regular basis.
            //// I am kind of against things happening "by themselves", but this seems to work really good so far!!
            //var intervalTimedCheckForAlertsForIosBadgeUpdateUsingTitle = window.setInterval(timedCheckForAlertsForIosBadgeUpdateUsingTitle, 15000); // 15000 milliseconds is 15 seconds.

            console.log('');
            console.log('In index.js.page_Load(). COME BACK HERE WHEN WE WANT TO DISPLAY IndexDb REQUESTS WITHOUT BEING LOGGED IN. FOR NOW TURNING THIS OFF UNTIL WE CAN COME BACK TO IT.');
            console.log('');
            //$('.bwCoreComponent').bwCoreComponent('renderAlerts3'); // Render the indexDb requests without being logged in.


            var selectedLogonType = localStorage ? localStorage['selectedlogontype'] : '';
            if (selectedLogonType && selectedLogonType != '') {
                if (document.getElementById('selectLogonType')) {
                    document.getElementById('selectLogonType').value = selectedLogonType;

                    if (selectedLogonType == 'Microsoft') {
                        // Display the Azure AD connection details.
                        document.getElementById('spanAzureADConnectionDetails').innerHTML = '<span class="bwLink">Connect to your Microsoft Azure Active Directory</span>';
                    } else {
                        // Hide the Azure AD connection details.
                        if (document.getElementById('spanAzureADConnectionDetails')) {
                            document.getElementById('spanAzureADConnectionDetails').innerHTML = '';
                        }
                        // 1-28-2022 this is no longer on the home page, but is configured once the user has logged in. // document.getElementById('spanAzureADConnectionDetails').innerHTML = '<span class="bwLink">Configure dual-factor authentication xcx3</span>';
                    }
                }
            }

        }

    } catch (e) {

        var msg = '>>>>>>>>>>> ******** ########## Exception in index.js.page_Load(): ' + e.message + ', ' + e.stack;
        console.log(msg);
        alert(msg);

    }
}

function ShowActivitySpinner(spinnerText) {
    try {
        //console.log('In index.js.ShowActivitySpinner().');
        //alert('In index.js.ShowActivitySpinner().');

        $('#divBwActivitySpinner').bwActivitySpinner({});

        $('#divBwActivitySpinner').bwActivitySpinner('show', spinnerText);

    } catch (e) {
        console.log('Exception in index.js.ShowActivitySpinner(): ' + e.message + ', ' + e.stack);
        $('#divBwActivitySpinner').bwActivitySpinner({ SpinnerType: 'modal' });
        $('#divBwActivitySpinner').bwActivitySpinner('show');
    }
}

function ShowActivitySpinner_Promise(spinnerText) {
    return new Promise(function (resolve, reject) {
        try {
            console.log('In index.js.ShowActivitySpinner_Promise().');
            //alert('In index.js.ShowActivitySpinner_Promise().');

            $('#divBwActivitySpinner').bwActivitySpinner({});

            $('#divBwActivitySpinner').bwActivitySpinner('show_Promise', spinnerText);

            var result = {
                status: 'SUCCESS',
                message: 'SUCCESS'
            }
            resolve(result);

        } catch (e) {

            var msg = 'Exception in index.js.ShowActivitySpinner_Promise(): ' + e.message + ', ' + e.stack;
            console.log(msg);

            $('#divBwActivitySpinner').bwActivitySpinner({ SpinnerType: 'modal' });
            $('#divBwActivitySpinner').bwActivitySpinner('show');

            var result = {
                status: 'EXCEPTION',
                message: msg
            }
            reject(result)

        }
    });
}

function HideActivitySpinner() {
    try {
        console.log('In index.js.HideActivitySpinner().');
        //alert('In index.js.HideActivitySpinner().');
        try {
            $('#divBwActivitySpinner').bwActivitySpinner('hide');
        } catch (e) {
            // do nothing
        }
    } catch (e) {
        console.log('Exception in index.js.HideActivitySpinner(): ' + e.message + ', ' + e.stack);
        alert('Exception in my.index.HideActivitySpinner(): ' + e.message + ', ' + e.stack);
    }
}

function ShowActivitySpinner_FileUpload(spinnerText) {
    try {
        console.log('In my.js.ShowActivitySpinner_FileUpload().');

        $('#divBwActivitySpinner_FileUpload').bwActivitySpinner_FileUpload({});

        $('#divBwActivitySpinner_FileUpload').bwActivitySpinner_FileUpload('show', spinnerText);

    } catch (e) {
        console.log('Exception in my.js.ShowActivitySpinner_FileUpload(): ' + e.message + ', ' + e.stack);
        //$('#divBwActivitySpinner_FileUpload').bwActivitySpinner_FileUpload({ SpinnerType: 'modal' });
        //$('#divBwActivitySpinner_FileUpload').bwActivitySpinner_FileUpload('show');
    }
}

function HideActivitySpinner_FileUpload() {
    try {
        console.log('In my3.js.HideActivitySpinner_FileUpload().');
        try {
            $('#divBwActivitySpinner_FileUpload').bwActivitySpinner_FileUpload('hide');
        } catch (e) {
            // do nothing
        }
    } catch (e) {
        console.log('Exception in my3.js.HideActivitySpinner_FileUpload(): ' + e.message + ', ' + e.stack);
        alert('Exception in my3.js.HideActivitySpinner_FileUpload(): ' + e.message + ', ' + e.stack);
    }
}


//function timedCheckForAlertsForIosBadgeUpdateUsingTitle() {
//    // Check if the user is logged in or not before doing this.
//    try {
//        //console.log('In timedCheckForAlertsForIosBadgeUpdateUsingTitle().');
//        //
//        // 7-18-2020 THIS IS WHERE WE SHOULD BE CHECKING THE beParticipant table, participantHasNothingNewInThisAppSinceTheyLastChecked field!!!!!!!!!!
//        // TURNING OFF FOR NOW!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//        //
//        // For now, instruct users to select the "Remember me" checkbox, and to just click the browser refresh button. :D
//        //
//        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
//        if (participantId) {
//            // POLLING polling
//            console.log('In timedCheckForAlertsForIosBadgeUpdateUsingTitle(). participantId: ' + participantId);




//            //  1-22-2022
//            // These values are stored in bwAuthentication.js.
//            //
//            // autoRefreshHomePage: true, // This functionality will eventually not be needed, but for now it makes the application a lot more pleasant to use for the user.
//            // autoRefreshHomePage_Interval: 15000, // In ms. 15000 = 15 seconds.
//            console.log('In timedCheckForAlertsForIosBadgeUpdateUsingTitle(). >>>>>>>>>>> HOOK UP autoRefreshHomePage HERE!!!!!!! This is where other\'s activity will show up etc. A social network!');
//            // renderWelcomeScreen();

//            //
//            // MAKE A NOISE!!!!!!!!!!!!!!!!!! We will only want to do this when there is a new task assigned to the participant.
//            //
//            console.log('In timedCheckForAlertsForIosBadgeUpdateUsingTitle(). Check bwNotificationSound to see if we need to play a notification sound.');
//            $('.bwNotificationSound:first').bwNotificationSound('checkIfWeNeedToPlayANotificationSound');
//            //

//            console.log('');
//            console.log('In index.js.timedCheckForAlertsForIosBadgeUpdateUsingTitle(). TURNED THIS OFF... DO WE NEED IT IN THE FUTURE? >>>>>>> SAVE THEIR WORK "BEHIND THE SCENES" SO THAT WHEN THEY COME BACK, IT IS STILL THERE.');
//            console.log('');

//            ////
//            ////
//            //// THIS IS WHERE WE CHECK IF THE USER IS ON THE NEW REQUEST SCREEN. IF SO, SAVE THEIR WORK "BEHIND THE SCENES" SO THAT WHEN THEY COME BACK< IT IS STILL THERE> IF IT HAS CHANGED< SAVE IT TO THRE SERVER CALLING THE XX WEB SERVICE.
//            ////
//            ////
//            //console.log('In timedCheckForAlertsForIosBadgeUpdateUsingTitle(). THIS IS WHERE WE CHECK IF THE USER IS ON THE NEW REQUEST SCREEN. IF SO, SAVE THEIR WORK "BEHIND THE SCENES" SO THAT WHEN THEY COME BACK< IT IS STILL THERE. IF IT HAS CHANGED, SAVE IT TO THE SERVER CALLING THE XX WEB SERVICE.');

//            //var theUserIsCreatingANewRequest = false;
//            //var forms = $(document).find('.budgetrequestform');
//            //var newRequestForm;
//            //for (var i = 0; i < forms.length; i++) {
//            //    var bwrequesttitle = $(forms[i]).attr('bwrequesttitle');
//            //    if (bwrequesttitle == 'New') { // This makes sure we regularly save the contents of the NEW REQUEST form, if it is open/displayed.
//            //        theUserIsCreatingANewRequest = true;
//            //        newRequestForm = forms[i];
//            //        break;
//            //    }
//            //}

//            //if (theUserIsCreatingANewRequest == true) {

//            //    var bwBudgetRequestId = $(newRequestForm).attr('bwbudgetrequestid');
//            //    var lastSavedJson = $('.bwAuthentication').bwAuthentication('option', 'NEW_REQUEST_LastSavedJson');

//            //    if (!lastSavedJson) { 

//            //        // Initialize the value.
//            //        var promise = $('.bwRequest:first').bwRequest('scrapeBwRequestJson', bwBudgetRequestId);
//            //        promise.then(function (results) {
//            //            try {

//            //                if (results.status != 'SUCCESS') {

//            //                    var msg = 'Error in index.js.timedCheckForAlertsForIosBadgeUpdateUsingTitle.bwRequest.scrapeBwRequestJson(). ' + results.status + ': ' + results.message;
//            //                    console.log(msg);
//            //                    displayAlertDialog(msg);

//            //                } else {

//            //                    var errorElement = $(newRequestForm).find('#spanRequestForm_Error')[0];
//            //                    if (errorElement) {
//            //                        $(errorElement).html('Auto-saving...');
//            //                        setTimeout(function () {
//            //                            $(errorElement).html('&nbsp;');
//            //                        }, 4000);
//            //                    } else {
//            //                        alert('xcx1231231 INITIALIZING/SAVING bwRequestJson: ' + JSON.stringify(results.bwRequestJson));
//            //                    }
//            //                    $('.bwAuthentication').bwAuthentication('option', 'NEW_REQUEST_LastSavedJson', results.bwRequestJson); // Save the value.

//            //                }

//            //            } catch (e) {
//            //                console.log('Exception in timedCheckForAlertsForIosBadgeUpdateUsingTitle():5: ' + e.message + ', ' + e.stack);
//            //                displayAlertDialog('Exception in timedCheckForAlertsForIosBadgeUpdateUsingTitle():5: ' + e.message + ', ' + e.stack);
//            //            }
//            //        }).catch(function (e) {

//            //            console.log('Exception in timedCheckForAlertsForIosBadgeUpdateUsingTitle():4: ' + JSON.stringify(e));
//            //            displayAlertDialog('Exception in timedCheckForAlertsForIosBadgeUpdateUsingTitle():4: ' + JSON.stringify(e));

//            //        });

//            //    } else {

//            //        // Only do this if we have saved something already.
//            //        $('.bwRequest:first').bwRequest('checkIfThereHaveBeenAnyChanges', bwBudgetRequestId, lastSavedJson).then(function (results) {
//            //            try {

//            //                if (results.status != 'SUCCESS') {

//            //                    var msg = 'Error in index.js.timedCheckForAlertsForIosBadgeUpdateUsingTitle(). ' + results.status + ': ' + results.message;
//            //                    console.log(msg);
//            //                    displayAlertDialog(msg);

//            //                } else {

//            //                    if (results.results == 'NO_CHANGES_TO_SAVE') {

//            //                        console.log('In index.js.timedCheckForAlertsForIosBadgeUpdateUsingTitle(). xcx213312-1: ' + results.message);

//            //                    } else if (results.results == 'YES_CHANGES_TO_SAVE') {

//            //                        console.log('In index.js.timedCheckForAlertsForIosBadgeUpdateUsingTitle(). xcx213312-2: ' + results.message);

//            //                        // Update the value.
//            //                        var promise = $('.bwRequest:first').bwRequest('scrapeBwRequestJson', bwBudgetRequestId);
//            //                        promise.then(function (results) {
//            //                            try {

//            //                                if (results.status != 'SUCCESS') {

//            //                                    var msg = 'Error in index.js.timedCheckForAlertsForIosBadgeUpdateUsingTitle.bwRequest.scrapeBwRequestJson():2. ' + results.status + ': ' + results.message;
//            //                                    console.log(msg);
//            //                                    displayAlertDialog(msg);

//            //                                } else {

//            //                                    var errorElement = $(newRequestForm).find('#spanRequestForm_Error')[0];
//            //                                    if (errorElement) {
//            //                                        $(errorElement).html('Auto-saving...');
//            //                                        setTimeout(function () {
//            //                                            $(errorElement).html('&nbsp;');
//            //                                        }, 4000);
//            //                                    } else {
//            //                                        alert('xcx1231231 UPDATING/SAVING bwRequestJson: ' + JSON.stringify(results.bwRequestJson));
//            //                                    }
//            //                                    $('.bwAuthentication').bwAuthentication('option', 'NEW_REQUEST_LastSavedJson', results.bwRequestJson); // Save the value.

//            //                                }

//            //                            } catch (e) {
//            //                                console.log('Exception in timedCheckForAlertsForIosBadgeUpdateUsingTitle():8: ' + e.message + ', ' + e.stack);
//            //                                displayAlertDialog('Exception in timedCheckForAlertsForIosBadgeUpdateUsingTitle():8: ' + e.message + ', ' + e.stack);
//            //                            }
//            //                        }).catch(function (e) {

//            //                            console.log('Exception in timedCheckForAlertsForIosBadgeUpdateUsingTitle():7: ' + JSON.stringify(e));
//            //                            displayAlertDialog('Exception in timedCheckForAlertsForIosBadgeUpdateUsingTitle():7: ' + JSON.stringify(e));

//            //                        });

//            //                    } else {

//            //                        var msg = 'Error in index.js.timedCheckForAlertsForIosBadgeUpdateUsingTitle(). Unexpected value for results.results: ' + results.results;
//            //                        console.log(msg);
//            //                        displayAlertDialog(msg);

//            //                    }

//            //                }

//            //            } catch (e) {
//            //                console.log('Exception in timedCheckForAlertsForIosBadgeUpdateUsingTitle():3: ' + e.message + ', ' + e.stack);
//            //                displayAlertDialog('Exception in timedCheckForAlertsForIosBadgeUpdateUsingTitle():3: ' + e.message + ', ' + e.stack);
//            //            }
//            //        }).catch(function (e) {

//            //            console.log('Exception in timedCheckForAlertsForIosBadgeUpdateUsingTitle():2: ' + JSON.stringify(e));
//            //            displayAlertDialog('Exception in timedCheckForAlertsForIosBadgeUpdateUsingTitle():2: ' + JSON.stringify(e));

//            //        });

//            //    }

//            //}

//        }

//    } catch (e) {
//        console.log('Exception in timedCheckForAlertsForIosBadgeUpdateUsingTitle(): ' + e.message + ', ' + e.stack);
//        displayAlertDialog('Exception in timedCheckForAlertsForIosBadgeUpdateUsingTitle(): ' + e.message + ', ' + e.stack);
//    }
//}

function cmdDisplayCommunicationsError(message) {
    if (message) {
        displayAlertDialog(message);
    } else {
        displayAlertDialog('Communications error. Probably file services is slow in responding.');
    }
}

function cmdCloseError() {
    $("#divAlertDialog").dialog('close');
}

function cmdClose_divAlertDialog_QuickNotice() {
    $("#divAlertDialog_QuickNotice").dialog('close');
}

function copyTextAndPutInClipboard() {
    console.log('In copyTextAndPutInClipboard().');
    //alert('In copyTextAndPutInClipboard().');

    var text = document.getElementById('spanErrorMessageHidden').innerHTML;

    const type = "text/plain";
    const blob = new Blob([text], { type });
    const data = [new ClipboardItem({ [type]: blob })];
    //await navigator.clipboard.write(data);
    navigator.clipboard.write(data);

    displayAlertDialog_QuickNotice('Copied!');
}

function displayAlertDialog(errorMessage, displayDialog) {
    try {

        // Added this here so we always get the error message. 7-17-2023.

        //displayAlertDialog_Persistent(errorMessage);

        console.log('');
        console.log('>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<');
        console.log('>>>>>>>>>>>>> In index.js.displayAlertDialog().');
        console.log('>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<');
        console.log('');
        //alert('In index.js.displayAlertDialog().');

        if (errorMessage) { // Don't do anything if there is no message.
            //hideWorkingOnItDialog();

            var div = document.getElementById('divAlertDialog');
            if (!div) {
                div = document.createElement('div');
                div.id = 'divAlertDialog';
                div.style.display = 'none';
                document.body.appendChild(div); 
                div.addEventListener('keydown', function () {
                    console.log('In index.js.displayAlertDialog.keydown().');
                    return carriagereturnpress(event, 'cmdCloseError');
                });
                var html = '';
                html += `<span id="spanErrorMessage" style="font-size:15pt;" xcx="xcx124325234"></span><br /><br />
                        <!--<div id="divAlertDialogCloseButton" xcx="xcx55882" class="divDialogButton" onclick="$('.bwActiveMenu').bwActiveMenu('RenderContentForButton', this, 'REPORT_AN_ERROR');">
                            Report Error
                        </div>-->
                        <br />
                        <div id="divAlertDialogCopyButton" class="divDialogButton" onclick="copyTextAndPutInClipboard();">
                            Copy
                        </div>
                        <br />
                        <div id="divAlertDialogCloseButton" class="divDialogButton" onclick="cmdCloseError();">
                            Close
                        </div>
                        <br /><br />
                        <span id="spanErrorMessageHidden" style="font-size:15pt;display:none;" xcx="xcx1243252342"></span>`;
                div.innerHTML = html;

            }

            try {
                //debugger;
                WriteToErrorLog('displayAlertDialog()', errorMessage);
            } catch (e) {
                // alert('Error writing to error log in displayAlertDialog: ' + e.message);
            }

            if (displayDialog == false) {
                // Do nothing. Do not display.
            } else {
                // First we have to check if it is displayed already.
                var isDisplayed = false;
                //if ($("#dialog-divAlertDialog").hasClass("ui-dialog-content") && $("#dialog-divAlertDialog").dialog("isOpen")) {
                if ($("#divAlertDialog").hasClass("ui-dialog-content") && $("#divAlertDialog").dialog("isOpen")) {
                    // This first checks that the dialog has been initialized, then it checks if it is open.
                    isDisplayed = true;
                }

                if (isDisplayed == false) { // NOTE: This blocks the next alert from showing.
                    // First we have to show the dialog box.
                    //$("#divAlertDialog").dialog({
                    //    modal: true,
                    //    resizable: false,
                    //    //closeText: "Cancel",
                    //    closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                    //    title: 'Alert',
                    //    width: "720",
                    //    dialogClass: "no-close", // No close button in the upper right corner.
                    //    hide: false,//, // This means when hiding just disappear with no effects.
                    //    //buttons: {
                    //    //    "Close": function () {
                    //    //        $(this).dialog("close");
                    //    //    }
                    //    //}
                    //    open: function (event, ui) { $('.ui-widget-overlay').bind('click', function () { $("#divAlertDialog").dialog('close');});} // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.
                    //});
                    //$("#divAlertDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
                    try {
                        if (errorMessage.toString().toUpperCase().indexOf("SERVICE UNAVAILABLE") > -1 || errorMessage.toString().toUpperCase().indexOf("BACKEND FETCH FAILED") > -1 || errorMessage.toString().toUpperCase().indexOf("ERROR RENDERING") > -1 || errorMessage.toString().toUpperCase().indexOf("UNDEFINED IS NOT AN OBJECT") > -1 || errorMessage.toString().toUpperCase().indexOf("NULL IS NOT AN OBJECT") > -1) {
                            //debugger;
                            try {
                                $("#divAlertDialog").dialog('close'); // Close the existing alert dialog.
                            } catch (e) {
                                // do nothing
                            }




                            //
                            // Commented this out 5-14-2023.
                            //
                            connectionTimerObject = setInterval(function () {
                                $('.bwAuthentication:first').bwAuthentication('checkConnectionAndRemoveBlueBarErrorMessage');
                            }, 6000);







                            // This code pops up the modal dialog. I am converting to an Alert! link in the top blue bar because it is less intrusive.
                            //var html = '';
                            //html += 'We apologize! It looks like our servers are unavailable at the moment.';
                            //document.getElementById('spanErrorMessage').innerHTML = html;
                            //// We are hiding this when the renderAlerts() successfully repaint the screen...this means communication has been re-established.
                            //connectionTimerObject = setInterval('checkConnectionAndRemoveAlertDialog()', 6000);

                        } else {

                            console.log('Displaying xcx2132567888 dialog at width 1800.');

                            $("#divAlertDialog").dialog({
                                position: {
                                    my: "right-100 top+100",
                                    at: "right top",
                                    of: $(document.body)
                                },
                                modal: true,
                                resizable: false,
                                //closeText: "Cancel",
                                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                                title: 'Alert',
                                width: 500,
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

                            document.getElementById('spanErrorMessage').innerHTML = errorMessage.substring(0, 400); // Limit the display to 400 characters.
                            document.getElementById('spanErrorMessageHidden').innerHTML  = errorMessage;

                        }
                    } catch (e) {
                        console.log('In xcx3423542345-2. ' + e.message + ', ' + e.stack);
                        displayAlertDialog('In xcx3423542345-2. ' + e.message + ', ' + e.stack);
                    }
                }
            }
        }
    } catch (e) {
        console.log('In xcx3423542345-1. ' + e.message + ', ' + e.stack);
        displayAlertDialog('In xcx3423542345-1. ' + e.message + ', ' + e.stack);
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


                //html += '                    <span id="spanErrorMessage_' + dialogId + '"></span>'; // Changed 2-17-2023. Because we want JSON to pretty print ok.
                html += '<textarea id="spanErrorMessage_' + dialogId + '" rows="30" cols="55" style="padding-top:4px;font-size:16pt;"></textarea>';


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
                resizable: true,
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
                    console.log('In index.js.displayAlertDialog_Persistent(). THIS DIALOG DOES NOT CLEAN UP AFTER ITSELF. THIS WILL HAVE TO BE DONE SOMEDAY. <<<<<<<<<<<<<<<<<<<<<<<<<<');
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
function displayAlertDialog_QuickNotice(errorMessage, milliseconds) {
    return new Promise(function (resolve, reject) {
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

                if (milliseconds) {
                    setTimeout(function () {
                        cmdClose_divAlertDialog_QuickNotice();
                        resolve();
                    }, milliseconds);
                } else {
                    setTimeout(function () {
                        cmdClose_divAlertDialog_QuickNotice();
                        resolve();
                    }, 1500);
                }

                //displayAlertDialog(msg, true);
               
            } else {

                resolve();

            }

        } catch (e) {
            console.log('In displayAlertDialog_QuickNotice. ' + e.message + ', ' + e.stack);
            displayAlertDialog('In displayAlertDialog_QuickNotice. ' + e.message + ', ' + e.stack);

            reject();
        }
    });
}

$(document).ready(function () {
    //
    // This is at the end of the file, so that we ensure the whole thing is loaded before calling page_load(). That is how JavaScript works.
    //
    try {
        console.log('In index.js.document.ready(). Calling page_Load().');
        //alert('>>>>>>>>>>>>>>In index.js.document.ready(). Calling page_Load().');

        page_Load();

    } catch (e) {
        console.log('Exception in index.js.document.ready()', e.message + ', ' + e.stack);
        alert('Exception in index.js.document.ready()', e.message + ', ' + e.stack);
    }
});
