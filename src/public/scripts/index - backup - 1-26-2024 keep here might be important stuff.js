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

var ajaxTimeout = 5000; //3000; //2000; //1500;

var imagePathPrefix = 'https://budgetworkflow.com';

var timerObject;

//var indexDBName = 'BudgetRequests-com-Requests-temp40';

//// IndexedDBSuccess accessing IndexedDB database
//try {
//    var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB;
//} catch (e) {

//}
//var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction;
//var dbVersion = 1.0;

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


var tempCloseOutXml;

var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

//var googleOAuth2ClientId = '327984438236-lcg6psf878672cg6j4eag8erjp9cnj9d.apps.googleusercontent.com'; // This is for my.budgetworkflow.com
//var googleOAuth2ClientId = '327984438236-m3nh6limbii1l4cia8dt2ubksna2frl8.apps.googleusercontent.com'; // This is for preview.budgetworkflow.com
//var googleOAuth2ClientId = '327984438236-5ipdv3eh1hnnss4mbcgofdrmlgf2askr.apps.googleusercontent.com'; // This is for localhost:2181
var googleOAuth2ClientId = '327984438236-gka01b83peci6bd8oue6o15m8c9k5jpb.apps.googleusercontent.com'; // This is for budgetrequests.com



var globalUrlPrefix = 'https://';
var url1 = window.location.href.split('https://')[1];
var globalUrl = url1.split('/')[0];
var globalUrlForWebServices = globalUrl;

var attachmentsFolderName = "";
var tenantId;
var workflowAppId; // WE SHOULD BE ABLE TO get rid of these variables when we start using the values stored in the home page drop down.
var workflowAppTitle;

var globalArchiveFilter;

// Configuration values.spanLicenseStatus


var globalLicenses = []; // Used throughout.
//globalLicenses = new Array();
//var tmpLicense = new Array(5);
//tmpLicense[0] = 'gold';
//tmpLicense[1] = 'Gold';
//tmpLicense[2] = '665f8489-937d-439c-939a-5e27b47d08d7';
//tmpLicense[3] = '2016-6-16T4:44:32'; // This is just temporary to provide a date.
//tmpLicense[4] = 'July 1, 2016';
//globalLicenses.push(tmpLicense);
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
//var bwEnabledRequestTypes = {
//    'EnabledItems': [],
//    'Details': {
//        'BudgetRequests': {
//            'Enabled': false,
//            'Ordinal': 1,
//            'Text': 'Budget Request',
//            'PluralText': 'Budget Requests'
//        },
//        'CapitalPlanProjects': {
//            'Enabled': false,
//            'Ordinal': 2,
//            'Text': 'Capital Plan Project',
//            'PluralText': 'Capital Plan Projects'
//        },
//        'QuoteRequests': {
//            'Enabled': false,
//            'Ordinal': 3,
//            'Text': 'Quote Request',
//            'PluralText': 'Quote Requests'
//        },
//        'ReimbursementRequests': {
//            'Enabled': false,
//            'Ordinal': 4,
//            'Text': 'Reimbursement Request',
//            'PluralText': 'Reimbursement Requests'
//        },
//        'RecurringExpenses': {
//            'Enabled': false,
//            'Ordinal': 5,
//            'Text': 'Recurring Expense',
//            'PluralText': 'Recurring Expenses'
//        },
//        'WorkOrders': {
//            'Enabled': false,
//            'Ordinal': 6,
//            'Text': 'Work Order',
//            'PluralText': 'Work Orders'
//        }
//    }
//};
var quotingEnabled;
var reimbursementRequestsEnabled; // This allows users to file expense reports, for example.
var recurringExpensesEnabled;
var capitalAndExpenseTrackingEnabled;


var supplementalsEnabled;
var closeoutsEnabled;
var strictAuditingEnabled;
//var developerModeEnabled; // 12-20-2021
var emailEnabled;
//var emailNotificationLevel = 'alldiscourse';
var emailNotificationFrequency; // immediately, aggregatetwicedaily
var emailNotificationTypes; // allnotifications, onlymytasknotifications
var emailAggregatorTwiceDailyFirstTime;
var emailAggregatorTwiceDailySecondTime;
var emailAggregatorTwiceDailyTimezoneDisplayName;

var thumbnailLoadingEnabled;

var bwTwoFactorAuthenticationEnabled;
var bwTwoFactorAuthenticationSmsNumber;

// end Configuration values.


//var workflowAppRole; 
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
//var participantRole;

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


var BWMData = []; // This is the global data container.
BWMData = new Array(2);
//BWMData
//    [0] - workflowAppConfiguration Details
//       .length - # of connected workflows
//       [index] - The details
//              [0] - ListItemId of the Workflow entry in the AppWebs list
//              [1] - AppWebUrl
//              [2] - Title (eg. Engineering)
//              [3] - Total Yearly Budget
//              [4] - Functional Area Data 
//                 .length - # of Functional Areas
//                 [index]
//                        [0] - ListItemId of the Functional Area
//                        [1] - Title of the Functional Area
//                        [2] - Quote
//                        [3] - Year
//                        [4] - Yearly Budget
//                        [5] - Approver #1
//                           .length - 
//                           [index]
//                                  [0] - Approver1UserId
//                                  [1] - Approver1FriendlyName
//                                  [2] - Approver1Email
//                        [6] - Approver #2
//                           .length - 
//                           [index]
//                                  [0] - Approver2UserId
//                                  [1] - Approver2FriendlyName
//                                  [2] - Approver2Email
//                        [7] - AdditionalApprovers
//                           .length - # of Additional Approvers
//                           [index]
//                                  [0] - ApproverUserId
//                                  [1] - ApproverFriendlyName
//                                  [2] - ApproverEmail
//                                  [3] - BudgetThreshold
//                        [8] - total $ Approved // TODD: OR ACTIVE!!!! WE NEED TO INCLUDE ACTIVE ARs HERE! 8-3-16.
//                        [9] - total $ Submitted
//                        [10] - total $ Rejected
//                        [11] - Overdue Tasks by Functional Area
//                            .length - # of Overdue Tasks
//                            [index] - the details
//                                   [0] - ItemId for the item in the Budget Requests list
//                                   [1] - Title of the workflow task
//                                   [2] - Created Date of the workflow task
//                                   [3] - Modified Date of the workflow task
//                                   [4] - DueDate of the workflow task
//                                   [5] - AuthorId of the workflow task
//                                   [6] - EditorId of the workflow task
//                                   [7] - AssignedToId.results[0] of the workflow task
//                                   [8] - Status of the workflow task
//                                   [9] - PercentComplete of the workflow task
//                        [12] - Budget Requests or Quotes
//                            .length - # of Budget Requests or Quotes
//                            [index]
//                                   [0] - ItemId of the Budget Request
//                                   [1] - Title of the Budget Request
//                                   [2] - ProjectTitle of the Budget Request
//                                   [3] - FunctionalAreaId of the Budget Request
//                                   [4] - BudgetAmount of the Budget Request
//                                   [5] - ARStatus of the Budget Request
//                                   [6] - BudgetWorkflowStatus of the Budget Request
// ----------------------------------NEW!!!!---------------------------------------
//                                   [7] - ARStatusModifiedTimestamp - Needed for the burn rate report.
//                                   [8] - BudgetWorkflowStatusModifiedTimestamp - Needed for the burn rate report.

//                        [13] - IsHidden

//              [5] - bwNewBudgetRequestManagerTitle
//              [6] - bwRequireStartEndDates
//              [7] - bwRequireRequestDetails
//              [8] - bwEnableNewRequestAttachments
//              [9] - bwQuotingEnabled
// THE FOLLOWING HAS BEEN REPLACED!!!!! DOES THIS BREAK ANYTHING????????
//              [5] - Participants
//                 .length - # of participants 
//                 [index]
//                        [0] - UserId
//                        [1] - Email
//                        [2] - Friendly Name (eg. Todd Hiltz)
//                        [3] - Overdue Budget Requests or Quotes
//                           .length - # of Budget Requests or Quotes
//                           [index]
//                                  [0] - ItemId of the Budget Request
//                                  [1] - Title of the Budget Request
//                                  [2] - ProjectTitle of the Budget Request
//                                  [3] - FunctionalAreaId of the Budget Request
//                                  [4] - BudgetAmount of the Budget Request
//                                  [5] - ARStatus of the Budget Request
//                                  [6] - BudgetWorkflowStatus of the Budget Request
//    [1] - Functional Area Years (these are used to populate the year drop down)
//       [0] - functionalAreaYearsForBudgetRequests
//       [1] - functionalAreaYerasForQuotes

function unFocus() { // This is another attempt to get the selection issue fixed. Not sure if it works yet. 8-7-2020.
    if (document.selection) {
        document.selection.empty()
    } else {
        window.getSelection().removeAllRanges()
    }
}







var carouselImageTracker = -1; // This is zero based.
var carouselHeaderText = [];

var audio;
var audioMuted = true; // Default to the audio being turned off.
var slideTransitionTime = 6; // This is where we set the transition time between slides.
var slideTransitionLastSystemTime = 0; // This is used to make sure that the slides are switched a consistent number of seconds.







function startCarouselTimer() {
    try {
        console.log('In index.js.startCarouselTimer().');

        //var PublishedSlideSet = $('.bwHowDoesItWorkCarousel2:first').bwHowDoesItWorkCarousel2('option', 'PublishedSlideSet');

        //if (!PublishedSlideSet.FilesAndFolders) {

        //    // HACK! :) 12-26-2022
        //    // Turning it off here....
        //    console.log('In index.js.startCarouselTimer(). No value for PublishedSlideSet.FilesAndFolders so TURNING OFF THE HOME PAGE CAROUSEL.');
        //    timerObject = null;

        //} else {

        //    // This is what switches the slides.
        //    // Make sure this things starts again in 1/2 a second.
        //    timerObject = setTimeout('startCarouselTimer()', 250); // 1 second(s).





        //    if (slideTransitionLastSystemTime > 0) {
        //        // Calculate if [slideTransitionTime] seconds have gone by. If so, show the next slide.
        //        var tempSystemTimeInSeconds = new Date().getTime() / 1000;
        //        var slideTransitionTimeElapsed = tempSystemTimeInSeconds - slideTransitionLastSystemTime;
        //        if (slideTransitionTimeElapsed > slideTransitionTime) {
        //            carouselImageTracker += 1;



        //            if (carouselImageTracker > PublishedSlideSet.FilesAndFolders.files.length) carouselImageTracker = 0;
        //            //document.getElementById('spanCarouselPausePlay').innerHTML = '<span onclick="cmdCarouselImageIndicatorClick(\'' + carouselImageTracker + '\');" style="cursor:pointer;white-space:nowrap;">pause slideshow<span>';
        //            document.getElementById('divCarouselPausePlay').innerHTML = '<div id="divCarouselPausePlay2" class="carouselPausePlay" onclick="cmdCarouselImageIndicatorClick(\'' + carouselImageTracker + '\');" style="cursor:pointer;white-space:nowrap;">pause slideshow<div>';
        //            setCarouselImageTracker();
        //            slideTransitionLastSystemTime = new Date().getTime() / 1000; // Set this value for the next time through!


        //        }
        //    } else {
        //        // This is the first time through!
        //        carouselImageTracker += 1;
        //        if (carouselImageTracker > PublishedSlideSet.FilesAndFolders.files.length) carouselImageTracker = 0;
        //        //document.getElementById('spanCarouselPausePlay').innerHTML = '<span onclick="cmdCarouselImageIndicatorClick(\'' + carouselImageTracker + '\');" style="cursor:pointer;white-space:nowrap;">pause slideshow<span>';
        //        document.getElementById('divCarouselPausePlay').innerHTML = '<div id="divCarouselPausePlay2" class="carouselPausePlay" onclick="cmdCarouselImageIndicatorClick(\'' + carouselImageTracker + '\');" style="cursor:pointer;white-space:nowrap;">pause slideshow<div>';
        //        setCarouselImageTracker();
        //        // Initialize this variable.
        //        slideTransitionLastSystemTime = new Date().getTime() / 1000;
        //    }
        //}

    } catch (e) {
        console.log('Exception in index.js.startCarouselTimer(): ' + e.message + ', ' + e.stack);
        displayAlertDialog('Exception in index.js.startCarouselTimer(): ' + e.message + ', ' + e.stack);
    }
}

//function setCarouselImageTracker() {

//    //// Show the new header text.
//    //document.getElementById('spanCarouselHeaderText').innerHTML = carouselHeaderText[Number(carouselImageTracker)];

//    //// Show the new image.
//    //var elemCarouselImage = document.getElementById('spanCarouselImage');
//    //var html = '';
//    //html += '<img src="slides/slide2-' + Number(carouselImageTracker + 1) + '.png" alt="" width="850px" height="550px" />';

//    ////console.log('html: ' + html);

//    //elemCarouselImage.innerHTML = html;
//    //fadeIn(elemCarouselImage, 250);
//    //// Now show the tagline.
//    ////document.getElementById('spanCarouselTagline').innerHTML = carouselTagline[carouselImageTracker];
//    //// Now set the indicator.
//    //for (var i = 0; i < 9; i++) {
//    //    var elementId = 'spanCarouselImageIndicator'.concat((Number(i) + 1).toString());
//    //    if (i == carouselImageTracker) {
//    //        document.getElementById(elementId).style.color = '#066B8B';
//    //        document.getElementById(elementId).style.cursor = 'default';
//    //    } else {
//    //        document.getElementById(elementId).style.color = 'white';
//    //        document.getElementById(elementId).style.cursor = 'pointer';
//    //    }
//    //}
//    ////// Now play the audio.
//    ////if (audioMuted == false) {
//    ////    var audioFilename = 'slides/slide4-' + Number(carouselImageTracker + 1) + '.mp3';
//    ////    audio = new Audio(audioFilename);
//    ////    audio.play();
//    ////}



//    try {
//        console.log('In setCarouselImageTracker().');
//        var thiz = this;

//        // Show the new header text.
//        //document.getElementById('spanCarouselHeaderText').innerHTML = this.carouselHeaderText[Number(this.carouselImageTracker)]; // this.options.PublishedSlideSet.FilesAndFolders.files

//        var PublishedSlideSet = $('.bwHowDoesItWorkCarousel3:first').bwHowDoesItWorkCarousel3('option', 'PublishedSlideSet');

//        if (PublishedSlideSet.FilesAndFolders && PublishedSlideSet.FilesAndFolders.files) {
//            if (PublishedSlideSet.FilesAndFolders.files[Number(carouselImageTracker)] && PublishedSlideSet.FilesAndFolders.files[Number(carouselImageTracker)].headerText) {
//                document.getElementById('spanCarouselHeaderText').innerHTML = PublishedSlideSet.FilesAndFolders.files[Number(carouselImageTracker)].headerText;
//            } else {
//                document.getElementById('spanCarouselHeaderText').innerHTML = 'xcx2312354353';
//            }
//        }

//        // Show the new image.
//        var elemCarouselImage = document.getElementById('spanCarouselImage');
//        //
//        // We need to resize the image while maintaining the aspect ratio. 9-7-2020.
//        //
//        //alert('this.carouselImageTracker + 1: ' + Number(this.carouselImageTracker + 1));

//        var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
//            return v.toString(16);
//        });

//        //if (this.carouselImageTracker < (this.carouselHeaderText.length)) { // 

//        if (PublishedSlideSet.FilesAndFolders && PublishedSlideSet.FilesAndFolders.files) {
//            if (carouselImageTracker < (PublishedSlideSet.FilesAndFolders.files.length)) {

//                //alert('xcx34234 this.options.PublishedSlideSet: ' + JSON.stringify(this.options.PublishedSlideSet));
//                //xcx34234 this.options.PublishedSlideSet: {"FilesAndFolders":{"folderName":"15cc4ba7-d055-48a5-af27-f7d25e905f1a","files":[{"fileName":"slide1.png","sortOrder":0},{"fileName":"slide30-1.png","sortOrder":1},{"fileName":"slide30-2.png","sortOrder":2},{"fileName":"slide30-3.png","sortOrder":3},{"fileName":"slide30-4.png","sortOrder":4},{"fileName":"slide30-5.png","sortOrder":5},{"fileName":"slide30-6.png","sortOrder":6},{"fileName":"slide30-7.png","sortOrder":7},{"fileName":"slide30-8.png","sortOrder":8},{"fileName":"slide30-9.png","sortOrder":9},{"fileName":"slide30-10.png","sortOrder":10}]}}

//                //PublishedSlideSet: {
//                //    FilesAndFolders: {
//                //        folderName: null,
//                //        files: []
//                //    }
//                //}

//                var folderName = PublishedSlideSet.FilesAndFolders.folderName;
//                var fileName = PublishedSlideSet.FilesAndFolders.files[carouselImageTracker].fileName;
//                var slideImagePath = globalUrlPrefix + globalUrlForWebServices + '/_files/slidesets/' + folderName + '/' + fileName;


//                //var filepath = 'slide30-' + Number(this.carouselImageTracker + 1) + '.png?v=' + guid;
//                //var slideImagePath = this.options.operationUriPrefix + 'slides/slides20/' + filepath;



//                $.get(slideImagePath).done(function () {
//                    try {
//                        var img = new Image();
//                        img.src = slideImagePath;
//                        img.onload = function (e) {
//                            try {
//                                // This maintains the aspect ration. eg: circles are round!
//                                var displayWidth, displayHeight;
//                                //var width = 850;
//                                //var height = 550;
//                                //var width = 1500; // 8-11-2020 todd
//                                //var height = 1000; // 8-11-2020 todd
//                                var width = document.getElementById('divPageContent1').getBoundingClientRect().width - 300;
//                                var height = (width / 3) * 2;
//                                var widthDivisor = this.width / width;

//                                var heightCheckNumber = this.height / widthDivisor;
//                                if (heightCheckNumber <= height) {
//                                    // Yay! The image will work with this divisor.
//                                    displayWidth = this.width / widthDivisor;
//                                    displayHeight = this.height / widthDivisor;
//                                } else {
//                                    // Use the height divisor.
//                                    var heightDivisor = this.height / height;
//                                    displayWidth = this.width / heightDivisor;
//                                    displayHeight = this.height / heightDivisor;
//                                }

//                                var imageRatio = displayWidth / displayHeight;

//                                var width = Number(window.innerWidth);
//                                width = (width - 450) / 3;

//                                var height = width / imageRatio; //1.47;

//                                var html = '<img id="imgHowDoesItWorkCarousel1" src="' + slideImagePath + '" alt="" style="width:' + width + 'px;height:' + height + 'px;" />';

//                                if (document.getElementById('tableHowDoesItWorkCarousel1') && document.getElementById('tableHowDoesItWorkCarousel1').style) {
//                                    document.getElementById('tableHowDoesItWorkCarousel1').style.height = height;

//                                    elemCarouselImage.innerHTML = html;
//                                    fadeIn(elemCarouselImage, 250);

//                                    // Set the left and right navigation arrows.
//                                    var leftArrowTdElement = $('#divLeftNavigationArrow').closest('td')[0];
//                                    var leftArrowPadding = $(leftArrowTdElement).css('padding-top');
//                                    if (leftArrowPadding == '0px') { // Only do this upon load to position them correctly to start with.
//                                        var imageHeight = document.getElementById('imgHowDoesItWorkCarousel1').getBoundingClientRect().height;
//                                        $(leftArrowTdElement).css('padding-top', imageHeight / 2);

//                                        var rightArrowTdElement = $('#divRightNavigationArrow').closest('td')[0];
//                                        $(rightArrowTdElement).css('padding-top', imageHeight / 2);
//                                    }
//                                }
//                            } catch (e) {
//                                console.log('Exception in setCarouselImageTracker().img.onload(): ' + e.message + ', ' + e.stack);
//                                displayAlertDialog('Exception in setCarouselImageTracker().img.onload(): ' + e.message + ', ' + e.stack);
//                            }
//                        }
//                    } catch (e) {
//                        console.log('Exception in setCarouselImageTracker().img.onload():2: ' + e.message + ', ' + e.stack);
//                        displayAlertDialog('Exception in setCarouselImageTracker().img.onload():2: ' + e.message + ', ' + e.stack);
//                    }
//                }).fail(function () {
//                    console.log('In setCarouselImageTracker().get(slideImagePath).fail.');
//                    //displayAlertDialog('In setCarouselImageTracker().get(slideImagePath).fail.');
//                });

//                // Now show the tagline.
//                //document.getElementById('spanCarouselTagline').innerHTML = carouselTagline[this.carouselImageTracker];
//                // Now set the indicator.
//                //for (var i = 0; i < (this.carouselHeaderText.length + 1) ; i++) { // 
//                for (var i = 0; i < (PublishedSlideSet.FilesAndFolders.files.length + 1) ; i++) {
//                    if (i > 0) {
//                        //var elementId = 'spanCarouselImageIndicator'.concat((Number(i) + 1).toString());
//                        var elementId = 'spanCarouselImageIndicator'.concat((Number(i)).toString()); // 12-22-2022
//                        if (i == carouselImageTracker) {
//                            if (document.getElementById(elementId) && document.getElementById(elementId).style) {
//                                document.getElementById(elementId).style.color = '#066B8B';
//                                document.getElementById(elementId).style.cursor = 'default';
//                            }
//                        } else {
//                            if (document.getElementById(elementId) && document.getElementById(elementId).style) {
//                                document.getElementById(elementId).style.color = 'white';
//                                document.getElementById(elementId).style.cursor = 'pointer';
//                            } else {
//                                console.log('xcx2353153 couldnt find element. elementId: ' + elementId);
//                                displayAlertDialog('xcx2353153 couldnt find element. elementId: ' + elementId);
//                            }
//                        }
//                    }
//                }
//                //// Now play the audio.
//                //if (audioMuted == false) {
//                //    var audioFilename = 'slides/slide4-' + Number(this.carouselImageTracker + 1) + '.mp3';
//                //    audio = new Audio(audioFilename);
//                //    audio.play();
//                //}
//            }
//        }

//    } catch (e) {
//        console.log('Exception in index.js.setCarouselImageTracker(): ' + e.message + ', ' + e.stack);
//        displayAlertDialog('Exception in index.js.setCarouselImageTracker(): ' + e.message + ', ' + e.stack);
//    }
//}

function fadeIn(elem, ms) {
    if (!elem)
        return;

    elem.style.opacity = 0;
    elem.style.filter = "alpha(opacity=0)";
    elem.style.display = "inline-block";
    elem.style.visibility = "visible";

    if (ms) {
        var opacity = 0;
        var timer = setInterval(function () {
            opacity += 50 / ms;
            if (opacity >= 1) {
                clearInterval(timer);
                opacity = 1;
            }
            elem.style.opacity = opacity;
            elem.style.filter = "alpha(opacity=" + opacity * 100 + ")";
        }, 50);
    }
    else {
        elem.style.opacity = 1;
        elem.style.filter = "alpha(opacity=1)";
    }
}



function displayAdditionalOrganizationsLighteningbolt() {
    try {
        console.log('In my.js.displayAdditionalOrganizationsLighteningbolt().');

        alert('In my.js.displayAdditionalOrganizationsLighteningbolt(). This functionality is incomplete. Coming soon!');

    } catch (e) {
        console.log('Exception in displayAdditionalOrganizationsLighteningbolt(): ' + e.message + ', ' + e.stack);
    }
}

var bwAuthentication; // using this fo the widget to see if it retains the reference 8-13-2020

function switchToSmallDevice() {
    setCookie('userselecteddeviceplatform', 'IOS8');
    window.location = 'https://budgetworkflow.com/ios8.html';
}



//async function LoadAndLoadFFMPEG(ffmpeg, source) {
//    try {

//        debugger;



//        await ffmpeg.load();



//    } catch(e) {
//        console.log('Exception in index.js.LoadAndLoadFFMPEG()', e.message + ', ' + e.stack);
//        displayAlertDialog('Exception in index.js.LoadAndLoadFFMPEG()', e.message + ', ' + e.stack);
//    }
//}





function page_Load() {
    try {
        console.log('In index.js.page_Load().');
        //alert('In index.js.page_Load().');
        
        //
        // THIS IS NICE ON A SMALL DEVICE. THIS MAY NOT BE THE BEST PLACE ETC. 8-18-2023.
        //

        if (navigator && navigator.userAgent && navigator.userAgent.toLowerCase() && navigator.userAgent.toLowerCase().indexOf('android') > -1) {
            console.log('SETTING viewport FOR ANDROID: navigator.userAgent: ' + navigator.userAgent);
            var vp = document.getElementById('bwViewport');
            vp.setAttribute('content', 'width=device-width, initial-scale=0.333');
        }

        console.log('Removed bluebird.');
        //alert('typeof Promise: ' + String(typeof Promise));

        //if (typeof Promise !== "undefined") {
        //    var script = document.createElement('script');
        //    script.type = 'text/javascript';
        //    script.src = 'scripts/bluebird/bluebird.js'
        //    document.getElementsByTagName('head')[0].appendChild(script);

        //    alert('Added bluebird');
        //}

        //var strUrl = window.location.href;

        

        webserviceurl = globalUrlPrefix + globalUrlForWebServices + '/_bw';
        appweburl = globalUrlPrefix + globalUrlForWebServices;
        appweburl2 = globalUrlPrefix + globalUrl;

       
        var divBwKeypressAndMouseEventHandler = document.getElementById('divBwKeypressAndMouseEventHandler');
        if (!divBwKeypressAndMouseEventHandler) {
            $(document.body).prepend('<div id="divBwKeypressAndMouseEventHandler" style="display:none;"></div>');
        }
        $('#divBwKeypressAndMouseEventHandler').bwKeypressAndMouseEventHandler({});

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
        while (!(typeof (jQuery.bw.bwAuthentication) != 'undefined')) {
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











        //// Added 9-24-2023.
        //var divBwDonate = document.getElementById('divBwDonate');
        //if (!divBwDonate) {
        //    $(document.body).prepend('<div id="divBwDonate" style=""></div>');
        //}
        //$('#divBwDonate').bwDonate({});


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

        //alert('3 xcx213123');

        console.log('');
        console.log('/////////////////////////////////////');
        console.log('In index.js.page_Load(). openrequest: ' + openrequest + ', participantId: ' + participantId + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', bwWorkflowTaskItemId: ' + bwWorkflowTaskItemId);
        console.log('/////////////////////////////////////');
        console.log('');

        // Only recognize openrequest here if the user is logged in.
        if (openrequest && participantId && bwBudgetRequestId) { // bwWorkflowTaskItemId is optional.

            //alert('In index.js.page_Load(). THIS IS ANOTHER PLACE WHERE THE POPPED-OUT WINDOW IS HANDLED. Calling bwRequest.displayCreateRequestForm(). WE NEED TO ADD LOGIC HERE TO DISPLAY A SUBMITTED FORM!!!!!!!! <<<<<<<<<<<<<<<<<<<');

            console.log();
            console.log('/////////////////////////////////////');
            console.log('In index.js.page_Load(). THIS IS ANOTHER PLACE WHERE THE POPPED-OUT WINDOW IS HANDLED. Calling bwRequest.displayCreateRequestForm(). WE NEED TO ADD LOGIC HERE TO DISPLAY A SUBMITTED FORM!!!!!!!! <<<<<<<<<<<<<<<<<<<');
            console.log('/////////////////////////////////////');
            console.log();
            //
            // THIS IS WHERE THE NEW REQUEST WINDOW IS HANDLED.
            //
            //console.log('xcx001934 In index.js.page_Load.getUrlParams(taskid). bwWorkflowTaskItemId: ' + bwWorkflowTaskItemId)

            if (bwWorkflowTaskItemId) {

                // Not a "create request form".
                console.log('');
                console.log('In index.js.page_Load(). POPPED-OUT WINDOW. NOT A CREATE REQUEST FORM xcx1223423');
                console.log('');
                //alert('In index.js.page_Load(). POPPED-OUT WINDOW. NOT A CREATE REQUEST FORM xcx1223423');

                var promise = window.opener.$('.bwRequest').bwRequest('scrapeBwRequestJson', bwBudgetRequestId);
                promise.then(function (bwRequestJson) {
                    try {

                        // Changed 4-3-2023
                        //$('.bwRequest').bwRequest('displayRequestForm', bwBudgetRequestId, 'divPageContent1', bwWorkflowTaskItemId, '', bwRequestJson); // displayRequestFormDialog needs to be pulled apart, so that it calls displayRequestForm(), just like displayCreateRequestForm() works.



                        // displayRequestFormDialog: function (budgetRequestId, selectedRaciRole, bwWorkflowTaskItemId, bwRequestJson) {
                        $('.bwRequest').bwRequest('displayRequestFormDialog', bwBudgetRequestId, '', bwWorkflowTaskItemId, '', bwRequestJson);





                    } catch (e) {
                        console.log('Exception in index.js.page_Load.scrapeBwRequestJson(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in my3.js.page_Load.scrapeBwRequestJson(): ' + e.message + ', ' + e.stack);
                        //document.getElementById('txtDisplayJsonDialogJSON').innerHTML = 'Exception in displayCreateRequestForm.scrapeBwRequestJson(): ' + e.message + ', ' + e.stack;
                    }
                })
                    .catch(function (result) {
                        console.log('In index.js.page_Load.scrapeBwRequestJson(). Promise returned exception: ' + result.message);
                        alert('In index.js.page_Load.scrapeBwRequestJson(). Promise returned exception: ' + result.message);
                    });

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


            //alert('4 xcx213123'); <<<<<<<<< GETTIN CALLED TWICE 1-26-2024.

            console.log('In index.js.page_Load(). WE USED to call RenderContentForButton(HOME_UNAUTHENTICATED) here, but it is the wrong place!!!');

            //alert('In index.js.page_Load(). WE USED to call RenderContentForButton(HOME_UNAUTHENTICATED) here, but it is the wrong place!!!');

            //console.log('In my3.js.page_Load(). Calling RenderContentForButton() to set the Home button as selected.');
            //$('.bwActiveMenu').bwActiveMenu('RenderContentForButton', 'HOME_UNAUTHENTICATED_BUTTON', 'HOME_UNAUTHENTICATED');

            // Most of the querystring stuff that happens is in the renderWelcomeScreen() method. (regarding unsubscribe and viewing AR's from an email link).
            //var participantId = getUrlParams()["participant"];
            //var unsubscribe = getUrlParams()["unsubscribe"];
            //var requestId = getUrlParams()["request"];

            console.log('In index.js.page_Load(). WE ARE CALLING intervalTimedCheckForAlertsForIosBadgeUpdateUsingTitle() here, but it is the wrong place!!! Maybe bwAuthentication._create()??? <<<');
            // This ties in with the iOS badge alert by updating the title. Also it is nice because it updates the Home screen alerts on a regular basis.
            // I am kind of against things happening "by themselves", but this seems to work really good so far!!
            var intervalTimedCheckForAlertsForIosBadgeUpdateUsingTitle = window.setInterval(timedCheckForAlertsForIosBadgeUpdateUsingTitle, 15000); // 15000 milliseconds is 15 seconds.

            //if (participantId) {

            //    alert('xcx213123423 participantId: ' + participantId); // We should NEVER get here. 3-9-2023.

            //} else {

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

            $('#divBwActivitySpinner').bwActivitySpinner({});

            $('#divBwActivitySpinner').bwActivitySpinner('show_Promise', spinnerText);

            resolve();

        } catch (e) {
            console.log('Exception in index.js.ShowActivitySpinner_Promise(): ' + e.message + ', ' + e.stack);
            $('#divBwActivitySpinner').bwActivitySpinner({ SpinnerType: 'modal' });
            $('#divBwActivitySpinner').bwActivitySpinner('show');

            reject()

        }
    });
}

function HideActivitySpinner() {
    try {
        //console.log('In my.js.HideActivitySpinner().');
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


// TODD: ADD A CATCH FOR F5!!!!<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
function carriagereturnpress(e, functioncall) {
    console.log('In index.js.carriagereturnpress(). This method has been disabled, using bwKeypresAndMouseEventHandler.js widget instead.');
    //// This is used for the custom logon.
    //var evt = e || window.event
    //// "e" is the standard behavior (FF, Chrome, Safari, Opera),
    //// while "window.event" (or "event") is IE's behavior
    //if (evt.keyCode === 13) {
    //    // Do something
    //    //logonWith_BudgetWorkflow();
    //    eval(functioncall)(); // Call the specified method.
    //    // You can disable the form submission this way:
    //    //return false
    //}
}

function timedCheckForAlertsForIosBadgeUpdateUsingTitle() {
    // Check if the user is logged in or not before doing this.
    try {
        //console.log('In timedCheckForAlertsForIosBadgeUpdateUsingTitle().');
        //
        // 7-18-2020 THIS IS WHERE WE SHOULD BE CHECKING THE beParticipant table, participantHasNothingNewInThisAppSinceTheyLastChecked field!!!!!!!!!!
        // TURNING OFF FOR NOW!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //
        // For now, instruct users to select the "Remember me" checkbox, and to just click the browser refresh button. :D
        //
        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
        if (participantId) { 
            // POLLING polling
            console.log('In timedCheckForAlertsForIosBadgeUpdateUsingTitle(). participantId: ' + participantId);




            //  1-22-2022
            // These values are stored in bwAuthentication.js.
            //
            // autoRefreshHomePage: true, // This functionality will eventually not be needed, but for now it makes the application a lot more pleasant to use for the user.
            // autoRefreshHomePage_Interval: 15000, // In ms. 15000 = 15 seconds.
            console.log('In timedCheckForAlertsForIosBadgeUpdateUsingTitle(). >>>>>>>>>>> HOOK UP autoRefreshHomePage HERE!!!!!!! This is where other\'s activity will show up etc. A social network!');
            // renderWelcomeScreen();

            //
            // MAKE A NOISE!!!!!!!!!!!!!!!!!! We will only want to do this when there is a new task assigned to the participant.
            //
            console.log('In timedCheckForAlertsForIosBadgeUpdateUsingTitle(). Check bwNotificationSound to see if we need to play a notification sound.');
            $('.bwNotificationSound:first').bwNotificationSound('checkIfWeNeedToPlayANotificationSound');
            //

            console.log('');
            console.log('In index.js.timedCheckForAlertsForIosBadgeUpdateUsingTitle(). TURNED THIS OFF... DO WE NEED IT IN THE FUTURE? >>>>>>> SAVE THEIR WORK "BEHIND THE SCENES" SO THAT WHEN THEY COME BACK, IT IS STILL THERE.');
            console.log('');

            ////
            ////
            //// THIS IS WHERE WE CHECK IF THE USER IS ON THE NEW REQUEST SCREEN. IF SO, SAVE THEIR WORK "BEHIND THE SCENES" SO THAT WHEN THEY COME BACK< IT IS STILL THERE> IF IT HAS CHANGED< SAVE IT TO THRE SERVER CALLING THE XX WEB SERVICE.
            ////
            ////
            //console.log('In timedCheckForAlertsForIosBadgeUpdateUsingTitle(). THIS IS WHERE WE CHECK IF THE USER IS ON THE NEW REQUEST SCREEN. IF SO, SAVE THEIR WORK "BEHIND THE SCENES" SO THAT WHEN THEY COME BACK< IT IS STILL THERE. IF IT HAS CHANGED, SAVE IT TO THE SERVER CALLING THE XX WEB SERVICE.');

            //var theUserIsCreatingANewRequest = false;
            //var forms = $(document).find('.budgetrequestform');
            //var newRequestForm;
            //for (var i = 0; i < forms.length; i++) {
            //    var bwrequesttitle = $(forms[i]).attr('bwrequesttitle');
            //    if (bwrequesttitle == 'New') { // This makes sure we regularly save the contents of the NEW REQUEST form, if it is open/displayed.
            //        theUserIsCreatingANewRequest = true;
            //        newRequestForm = forms[i];
            //        break;
            //    }
            //}

            //if (theUserIsCreatingANewRequest == true) {

            //    var bwBudgetRequestId = $(newRequestForm).attr('bwbudgetrequestid');
            //    var lastSavedJson = $('.bwAuthentication').bwAuthentication('option', 'NEW_REQUEST_LastSavedJson');

            //    if (!lastSavedJson) { 

            //        // Initialize the value.
            //        var promise = $('.bwRequest:first').bwRequest('scrapeBwRequestJson', bwBudgetRequestId);
            //        promise.then(function (results) {
            //            try {

            //                if (results.status != 'SUCCESS') {

            //                    var msg = 'Error in index.js.timedCheckForAlertsForIosBadgeUpdateUsingTitle.bwRequest.scrapeBwRequestJson(). ' + results.status + ': ' + results.message;
            //                    console.log(msg);
            //                    displayAlertDialog(msg);

            //                } else {

            //                    var errorElement = $(newRequestForm).find('#spanRequestForm_Error')[0];
            //                    if (errorElement) {
            //                        $(errorElement).html('Auto-saving...');
            //                        setTimeout(function () {
            //                            $(errorElement).html('&nbsp;');
            //                        }, 4000);
            //                    } else {
            //                        alert('xcx1231231 INITIALIZING/SAVING bwRequestJson: ' + JSON.stringify(results.bwRequestJson));
            //                    }
            //                    $('.bwAuthentication').bwAuthentication('option', 'NEW_REQUEST_LastSavedJson', results.bwRequestJson); // Save the value.

            //                }

            //            } catch (e) {
            //                console.log('Exception in timedCheckForAlertsForIosBadgeUpdateUsingTitle():5: ' + e.message + ', ' + e.stack);
            //                displayAlertDialog('Exception in timedCheckForAlertsForIosBadgeUpdateUsingTitle():5: ' + e.message + ', ' + e.stack);
            //            }
            //        }).catch(function (e) {

            //            console.log('Exception in timedCheckForAlertsForIosBadgeUpdateUsingTitle():4: ' + JSON.stringify(e));
            //            displayAlertDialog('Exception in timedCheckForAlertsForIosBadgeUpdateUsingTitle():4: ' + JSON.stringify(e));

            //        });

            //    } else {

            //        // Only do this if we have saved something already.
            //        $('.bwRequest:first').bwRequest('checkIfThereHaveBeenAnyChanges', bwBudgetRequestId, lastSavedJson).then(function (results) {
            //            try {

            //                if (results.status != 'SUCCESS') {

            //                    var msg = 'Error in index.js.timedCheckForAlertsForIosBadgeUpdateUsingTitle(). ' + results.status + ': ' + results.message;
            //                    console.log(msg);
            //                    displayAlertDialog(msg);

            //                } else {

            //                    if (results.results == 'NO_CHANGES_TO_SAVE') {

            //                        console.log('In index.js.timedCheckForAlertsForIosBadgeUpdateUsingTitle(). xcx213312-1: ' + results.message);

            //                    } else if (results.results == 'YES_CHANGES_TO_SAVE') {

            //                        console.log('In index.js.timedCheckForAlertsForIosBadgeUpdateUsingTitle(). xcx213312-2: ' + results.message);

            //                        // Update the value.
            //                        var promise = $('.bwRequest:first').bwRequest('scrapeBwRequestJson', bwBudgetRequestId);
            //                        promise.then(function (results) {
            //                            try {

            //                                if (results.status != 'SUCCESS') {

            //                                    var msg = 'Error in index.js.timedCheckForAlertsForIosBadgeUpdateUsingTitle.bwRequest.scrapeBwRequestJson():2. ' + results.status + ': ' + results.message;
            //                                    console.log(msg);
            //                                    displayAlertDialog(msg);

            //                                } else {

            //                                    var errorElement = $(newRequestForm).find('#spanRequestForm_Error')[0];
            //                                    if (errorElement) {
            //                                        $(errorElement).html('Auto-saving...');
            //                                        setTimeout(function () {
            //                                            $(errorElement).html('&nbsp;');
            //                                        }, 4000);
            //                                    } else {
            //                                        alert('xcx1231231 UPDATING/SAVING bwRequestJson: ' + JSON.stringify(results.bwRequestJson));
            //                                    }
            //                                    $('.bwAuthentication').bwAuthentication('option', 'NEW_REQUEST_LastSavedJson', results.bwRequestJson); // Save the value.

            //                                }

            //                            } catch (e) {
            //                                console.log('Exception in timedCheckForAlertsForIosBadgeUpdateUsingTitle():8: ' + e.message + ', ' + e.stack);
            //                                displayAlertDialog('Exception in timedCheckForAlertsForIosBadgeUpdateUsingTitle():8: ' + e.message + ', ' + e.stack);
            //                            }
            //                        }).catch(function (e) {

            //                            console.log('Exception in timedCheckForAlertsForIosBadgeUpdateUsingTitle():7: ' + JSON.stringify(e));
            //                            displayAlertDialog('Exception in timedCheckForAlertsForIosBadgeUpdateUsingTitle():7: ' + JSON.stringify(e));

            //                        });

            //                    } else {

            //                        var msg = 'Error in index.js.timedCheckForAlertsForIosBadgeUpdateUsingTitle(). Unexpected value for results.results: ' + results.results;
            //                        console.log(msg);
            //                        displayAlertDialog(msg);

            //                    }

            //                }

            //            } catch (e) {
            //                console.log('Exception in timedCheckForAlertsForIosBadgeUpdateUsingTitle():3: ' + e.message + ', ' + e.stack);
            //                displayAlertDialog('Exception in timedCheckForAlertsForIosBadgeUpdateUsingTitle():3: ' + e.message + ', ' + e.stack);
            //            }
            //        }).catch(function (e) {

            //            console.log('Exception in timedCheckForAlertsForIosBadgeUpdateUsingTitle():2: ' + JSON.stringify(e));
            //            displayAlertDialog('Exception in timedCheckForAlertsForIosBadgeUpdateUsingTitle():2: ' + JSON.stringify(e));

            //        });

            //    }

            //}

        }

    } catch (e) {
        console.log('Exception in timedCheckForAlertsForIosBadgeUpdateUsingTitle(): ' + e.message + ', ' + e.stack);
        displayAlertDialog('Exception in timedCheckForAlertsForIosBadgeUpdateUsingTitle(): ' + e.message + ', ' + e.stack);
    }
}

function cmdDisplayCommunicationsError(message) {
    if (message) {
        displayAlertDialog(message);
    } else {
        displayAlertDialog('Communications error. Probably file services is slow in responding.');
    }
}

//function checkConnectionAndRemoveBlueBarErrorMessage() {
//    try {
//        console.log('In checkConnectionAndRemoveBlueBarErrorMessage().');

//        var item = {
//            "Errors": 're-established communication'
//        };
//        $.ajax({
//            url: webserviceurl + "/writearchivederrorstoexceptionlog",
//            type: "POST",
//            data: item,
//            headers: {
//                "Accept": "application/json; odata=verbose"
//            },
//            success: function (data) {
//                try {
//                    clearInterval(connectionTimerObject); // Turn off the timer.
//                    connectionTimerObject = null;
//                    //$("#divAlertDialog").dialog('close'); // Close the existing alert dialog.
//                    //displayAlertDialog('Reconnected!'); // Display that we are reconnected!

//                    //document.getElementById('spanErrorLink').style.display = 'none'; //'none';
//                    //document.getElementById('spanErrorLinkNewRequest').style.display = 'none'; //'none';
//                    //document.getElementById('spanErrorLinkMyStuff').style.display = 'none'; //'none';
//                    //document.getElementById('spanErrorLinkSummary').style.display = 'none'; //'none';
//                    //document.getElementById('spanErrorLinkConfiguration').style.display = 'none'; //'none';
//                    //document.getElementById('spanErrorLinkHelp').style.display = 'none'; //'none';
//                } catch (e) {
//                    console.log('Exception in checkConnectionAndRemoveBlueBarErrorMessage():2: ' + e.message + ', ' + e.stack);
//                    displayAlertDialog('Exception in checkConnectionAndRemoveBlueBarErrorMessage():2: ' + e.message + ', ' + e.stack);
//                }
//            },
//            error: function (data) {
//                // alert('ERROR checkConnectionAndRemoveAlertDialog ERROR:' + JSON.stringify(data));
//            }
//        });
//    } catch (e) {
//        console.log('Exception in checkConnectionAndRemoveBlueBarErrorMessage(): ' + e.message + ', ' + e.stack);
//        displayAlertDialog('Exception in checkConnectionAndRemoveBlueBarErrorMessage(): ' + e.message + ', ' + e.stack);
//    }
//}

function cmdCloseError() {
    $("#divAlertDialog").dialog('close');
}

function cmdClose_divAlertDialog_QuickNotice() {
    $("#divAlertDialog_QuickNotice").dialog('close');
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

                            document.getElementById('spanErrorMessage').innerHTML = errorMessage;

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
function displayAlertDialog_QuickNotice(errorMessage) {
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

                //displayAlertDialog(msg, true);
                setTimeout(function () {
                    cmdClose_divAlertDialog_QuickNotice();

                    resolve();
                }, 1500);

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

function setCookie(cname, cvalue, exdays) {

    // Delete all cookies.
    //document.cookie.split(";").forEach(function (c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });

    //var d = new Date();
    //d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    //var expires = "expires=" + d.toUTCString();
    //document.cookie = cname + "=" + cvalue + "; " + expires;
    localStorage["cname"] = cvalue;
}

function getCookie(cname) {

    // Delete all cookies.
    //document.cookie.split(";").forEach(function (c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
    var result = localStorage ? localStorage[cname] : '';
    return result

    //var name = cname + "=";
    //var ca = document.cookie.split(';');
    //for (var i = 0; i < ca.length; i++) {
    //    var c = ca[i];
    //    while (c.charAt(0) == ' ') {
    //        c = c.substring(1);
    //    }
    //    if (c.indexOf(name) == 0) {
    //        return c.substring(name.length, c.length);
    //    }
    //}
    //return "";
}

//function setCookie(cname, cvalue, exdays) {
//    var d = new Date();
//    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
//    var expires = "expires=" + d.toUTCString();
//    document.cookie = cname + "=" + cvalue + "; " + expires;
//}

//function getCookie(cname) {
//    var name = cname + "=";
//    var ca = document.cookie.split(';');
//    for (var i = 0; i < ca.length; i++) {
//        var c = ca[i];
//        while (c.charAt(0) == ' ') {
//            c = c.substring(1);
//        }
//        if (c.indexOf(name) == 0) {
//            return c.substring(name.length, c.length);
//        }
//    }
//    return "";
//}


function cmdSignInNow(dialogToClose) {


    // TODD: DOES THIS EVEN GET CALLED?????



    // Make sure the other dialogs are closed.
    //$('#divCustomSignUpDialog').dialog('close');
    //$('#divCustomLogonResetPasswordDialog').dialog('close');
    $('#' + dialogToClose).dialog('close');

    //$('#divCustomLogonDialog').dialog({
    //    modal: true,
    //    resizable: false,
    //    //closeText: "Cancel",
    //    closeOnEscape: false, // Hit the ESC key to hide! Yeah!
    //    title: 'Sign Up',
    //    width: "460",
    //    dialogClass: "no-close", // No close button in the upper right corner.
    //    hide: false//, // This means when hiding just disappear with no effects.
    //    //close: function (event, ui) {
    //    //    window.location.href = 'https://budgetworkflow.com';
    //    //}
    //    //buttons: {
    //    //    "Close": function () {
    //    //        $(this).dialog("close");
    //    //    }
    //    //}
    //});

    //$('#divCustomLogonDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();

    //// Cookies for the custom login!
    //var username = getCookie('customlogonusername');
    //var password = getCookie('customlogonpassword');
    //$('#txtCustomLogonEmail').val(username);
    //$('#txtCustomLogonPassword').val(password);

    //debugger;
    $('.bwCircleDialog').bwCircleDialog('displaySignInDialog', true);


    //// https://budgetworkflow.com/ios8.html?logontype=custom

    //var logonType = 'signin';
    ////try {
    ////    logonType = getUrlParams()['logontype'].toString().split('#')[0];
    ////    if (logonType = 'createaccount') logonType = ''; // logontype=signin
    ////} catch (e) { }

    //var invitation = '';
    //try {
    //    invitation = getUrlParams()['invitation'].toString().split('#')[0];
    //} catch (e) { }

    //var signInUrl = '';
    //if (logonType != '' && invitation != '') {
    //    signInUrl = globalUrlPrefix + globalUrl + '/ios8.html?logontype=' + logonType + '&invitation=' + invitation;
    //} else if (logonType != '') {
    //    signInUrl = globalUrlPrefix + globalUrl + '/ios8.html?logontype=' + logonType;
    //} else if (invitation != '') {
    //    signInUrl = globalUrlPrefix + globalUrl + '/ios8.html?invitation=' + invitation;
    //} else {
    //    signInUrl = globalUrlPrefix + globalUrl + '/ios8.html';
    //}

    //window.location = signInUrl;

    //var signInDialogUrl = globalUrlPrefix + globalUrl + '/ios8.html?logontype=custom&invitation=' + inviteeId; // https://budgetworkflow.com?invitation=02d2f9dd-4be5-4a2c-8e7f-99bdcf7a375d // https://budgetworkflow.com/ios8.html?logontype=custom
    //var createYourAccountDialogUrl = globalUrlPrefix + globalUrl + '/ios8.html?logontype=createaccount&invitation=' + inviteeId; // https://budgetworkflow.com/ios8.html?logontype=createaccount&invitation=9508967e-ccf3-4ece-a51a-3a7be7c39b34
    //document.getElementById('anchorSignInNowLink').href = signInDialogUrl;
}

//function cmdForceUnsubscribe() {
//    // This is called when the user doesn't want to log in before unsubscribing.
//    displayAlertDialog('This functionality is incomplete. Coming soon! cmdForceUnsubscribe().');
//}

//function cmdUnsubscribe() {
//    // This is called when a user has logged in before unsubscribing.
//    //displayAlertDialog('cmdUnsubscribe(). Participant:' + participantId);
//    // This needs to call the POST web service, /unsubscribe.
//    var unsubscribe = [];
//    unsubscribe = {
//        participantId: participantId
//    };
//    var operationUri = webserviceurl + "/unsubscribe";
//    $.ajax({
//        url: operationUri,
//        type: "POST", timeout: ajaxTimeout,
//        data: unsubscribe,
//        headers: {
//            "Accept": "application/json; odata=verbose"
//        },
//        success: function (data) {
//            displayAlertDialog(data);
//            //renderWelcomeScreen();
//        },
//        error: function (data, errorCode, errorMessage) {
//            displayAlertDialog('Error in my.js.cmdUnsubscribe():1:' + errorMessage + ' ' + JSON.stringify(data));
//            //WriteToErrorLog('Error in InitBudgetRequest.js.cmdCreateBudgetRequest()', 'Error creating the budget request in budgetrequests library: ' + errorCode + ', ' + errorMessage);
//        }
//    });
//}

function cmdDisplayClientRequestsNotYetSubmittedDialog() {
    // Check if there are any requests stored in IndexDB locally. If so, prompt to submit the requests now.
    try {
        var request = indexedDB.open(indexDBName, dbVersion);

        request.onerror = function (event) {
            console.log('In my.js.cmdDisplayClientRequestsNotYetSubmittedDialog(). Error accessing database "' + event.target.result.name + '". errorCode: ' + event.target.errorCode);
        };

        request.onsuccess = function (event) {
            console.log('In my.js.cmdDisplayClientRequestsNotYetSubmittedDialog(). Success accessing database "' + event.target.result.name + '".');
            var db = event.target.result;

            db.onerror = function (event) {
                console.log('Error in index.js.displayForm_DisplayCachedAr(). DATABASE ERROR!!!!!!!!!! :' + 'Error accessing database "' + event.target.result.name + '". errorCode: ' + event.target.errorCode);
            };

            try {
                var store = db.transaction('objectStoreCachedRequests', 'readonly');
                var req;
                req = store.objectStore('objectStoreCachedRequests').count();
            } catch (e) {
                console.log('In my.js.cmdDisplayClientRequestsNotYetSubmittedDialog().XXXXXXXXXXXerror: ' + e.message);
            }
            req.onsuccess = function (evt) {
                // This is where we need to display the "Un-submitted Requests" dialog.
                if (evt.target.result == 1) {
                    // We only have to handle 1 un-submitted request.
                    var objectStore = db.transaction("objectStoreCachedRequests").objectStore("objectStoreCachedRequests");
                    objectStore.openCursor().onsuccess = function (event) {
                        try {
                            var cursor = event.target.result;
                            if (cursor) {
                                var requestId = cursor.value.bwBudgetRequestId;

                                // There is only one, so display it.
                                console.log('Getting ready to display bwBudgetRequestId: ' + requestId);
                                cmdRenderAndLoadNewRequestFormWithUnsubmittedRequest(requestId);

                                //document.getElementById('spanClientRequestsNotYetSubmittedDialogTitle').innerHTML = 'A Request on this device is waiting to be submitted.'; // Set the title to reflect that there is only 1 request saved on the device.
                                //document.getElementById('divClientRequestsNotYetSubmittedContent').innerHTML = ''; // Clear the last stuff.
                                //var html = '';
                                //html += '<span style="font-size:small;font-style:italic;">DEV: This functionality is incomplete and is in development!</span>';
                                //html += '<br />';
                                //html += '<br />';
                                //html += 'You have ' + evt.target.result + ' request saved on this device that has not been submitted.';
                                //html += '<br />';
                                //html += '<span style="font-style:italic;font-size:small;">(If this device runs low on storage, your web browser may delete it without asking you.)</span>';
                                //html += '<br /><br />';
                                //html += '<div id="xxxx" class="divSignInButton" onclick="cmdRenderAndLoadNewRequestFormWithUnsubmittedRequest(\'' + requestId + '\');" style="width:90%;text-align:center;line-height:0.8em;font-weight:bold;">';
                                //html += 'Review this Request<br />[show the form]';
                                //html += '</div>';
                                //document.getElementById('divClientRequestsNotYetSubmittedContent').innerHTML = html;
                            }
                        } catch (e) {
                            console.log('In my.js.cmdDisplayClientRequestsNotYetSubmittedDialog(). xyyyyy...' + e.message + ', ' + e.stack);
                        }
                    };

                } else if (evt.target.result > 1) {
                    // We have to handle multiple un-submitted requests.
                    document.getElementById('spanClientRequestsNotYetSubmittedDialogTitle').innerHTML = evt.target.result + ' Requests on this device are waiting to be submitted.'; // Set the title to reflect that there are more than 1 request saved on the device.
                    document.getElementById('divClientRequestsNotYetSubmittedContent').innerHTML = ''; // Clear the last stuff.
                    var html = '';
                    //html += '<span style="font-size:small;font-style:italic;">DEV: This functionality is incomplete and is in development!</span>';
                    //html += '<br />';
                    //html += '<br />';
                    //html += 'You have ' + evt.target.result + ' requests saved on this device that have not been submitted.';
                    //html += '<br />';
                    html += '<span style="font-style:italic;font-size:small;">If this device runs low on storage, your web browser may delete them without asking you.</span>';
                    html += '<br />';
                    html += '<br />';
                    html += '<br />';


                    // Render the "Archive" screen contents.
                    //var html = '';
                    //html += '<br /><br />';

                    // Top row.
                    html += '<table class="myStuffTable" style="width:100%;">';
                    html += '  <tr>';
                    html += '    <td style="font-size:14pt;font-weight:normal;">Title</td>';
                    //html += '    <td style="font-size:14pt;">Description</td>';
                    //html += '    <td style="font-size:14pt;white-space:nowrap;">Financial Area</td>';
                    //html += '    <td style="font-size:14pt;">Capital</td>';
                    //html += '    <td style="font-size:14pt;">Expense</td>';
                    //html += '    <td style="font-size:14pt;">Total</td>';
                    html += '    <td style="font-size:14pt;">Timestamp</td>';
                    //html += '    <td style="font-size:14pt;">Attachments</td>';
                    html += '    <td></td>';
                    html += '  </tr>';

                    // Second row.
                    //html += '  <tr>';
                    //html += '    <td style="white-space:nowrap;"><input type="text" id="txtArchivePageDescriptionFilter" class="archivePageFilterBox" title="Type here to limit search results, using * as a wildcard character."/>&nbsp;<img src="images/icon-down.png" title="Sort order" style="cursor:pointer;" /></td>';
                    //html += '    <td>xdescription</td>';
                    //html += '    <td style="white-space:nowrap;">';
                    //html += '      <select id="ddlArchivePageFinancialAreaDropDownFilter" class="archivePageFilterDropDown" title="Select here to limit the search results.">';
                    //html += '       <option value="" class="archivePageFilterOptionDropDown">Show all...</option>';
                    //var faId = 'xx'; //BWMData[0][x][4][y][0];
                    //var faTitle = 'xx'; //BWMData[0][x][4][y][1];
                    //html += '       <option value="' + faId + '" class="archivePageFilterOptionDropDown">';
                    //html += faTitle;
                    //html += '       </option>';
                    //html += '     </select>';
                    //html += '    </td>';
                    //html += '    <td>xcapital</td>';
                    //html += '    <td>xexpense</td>';
                    //html += '    <td>xtotal</td>';
                    //html += '    <td>xtimestamp</td>';
                    //html += '    <td>xattachments</td>';
                    //html += '    <td></td>';
                    //html += '  </tr>';

                    // Third (data) row(s).
                    var numberOfRequests = evt.target.result;
                    var objectStore = db.transaction("objectStoreCachedRequests").objectStore("objectStoreCachedRequests");
                    objectStore.openCursor().onsuccess = function (event) {
                        try {
                            var cursor = event.target.result;
                            if (cursor) {
                                var projectTitle = '';
                                console.log('Retrieved request: ' + cursor.value.ProjectTitle + ': ' + cursor.value.bwBudgetRequestId);
                                html += '  <tr>';
                                html += '    <td style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:14pt;"><a href="javascript:cmdRenderAndLoadNewRequestFormWithUnsubmittedRequest(\'' + cursor.value.bwBudgetRequestId + '\');">' + cursor.value.ProjectTitle + '</a></td>';
                                //html += '    <td style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:14pt;">xxdesc</td>';
                                //html += '    <td style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:14pt;">xxFunctionalAreaId';
                                //html += cursor.value.FunctionalAreaId;
                                //html += '    </td>';
                                //html += '    <td style="text-align:right;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;">' + 'xxcap' + formatCurrency(cursor.value.BudgetAmount) + '</td>';
                                //html += '    <td style="text-align:right;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;">' + 'xxexp' + formatCurrency(cursor.value.BudgetAmount) + '</td>';
                                //html += '    <td style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:14pt;">xxtotal</td>';
                                html += '    <td style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:14pt;">xxts</td>';
                                //html += '    <td style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:14pt;">xxatt</td>';
                                html += '    <td>';
                                html += '      <img src="images/trash-can.png" onclick="cmdDisplayDeleteUnsubmittedBudgetRequestDialog(\'' + cursor.value.bwBudgetRequestId + '\', \'' + cursor.value.ProjectTitle + '\');" title="Delete" style="cursor:pointer;" />';
                                html += '    </td>';
                                html += '  </tr>';

                                cursor.continue();
                            } else {
                                console.log('DONE LOOPING, so rendering.');
                                html += '<tr><td colspan="12"></td></tr>'; // DONE
                                html += '</table>';
                                //document.getElementById('spanBwBudgetRequests').innerHTML = html;

                                document.getElementById('divClientRequestsNotYetSubmittedContent').innerHTML = html;

                                $("#divClientRequestsNotYetSubmittedDialog").dialog({
                                    modal: true,
                                    resizable: false,
                                    //closeText: "Cancel",
                                    closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                                    width: "720",
                                    dialogClass: "no-close", // No close button in the upper right corner.
                                    hide: false,//, // This means when hiding just disappear with no effects.
                                    //buttons: {
                                    //    "Close": function () {
                                    //        $(this).dialog("close");
                                    //    }
                                    //}
                                    open: function (event, ui) { $('.ui-widget-overlay').bind('click', function () { $("#divClientRequestsNotYetSubmittedDialog").dialog('close'); }); } // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.
                                });
                                $("#divClientRequestsNotYetSubmittedDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

                            }
                        } catch (e) {
                            console.log('xxError: ' + e.message + ', ' + e.stack);
                        }
                    };



                }


            };

            req.onerror = function (evt) {
                console.error("In my.js.cmdDisplayClientRequestsNotYetSubmittedDialog(). add error", this.error);
            };
        }
    } catch (e) {
        console.log('In my.js.cmdDisplayClientRequestsNotYetSubmittedDialog(). FAILED TO OPEN A TRANSACTION to the database...' + e.message + ', ' + e.stack);
    }
}

function cmdDisplayDeleteUnsubmittedBudgetRequestDialog(requestId, title, requestedAmount) {
    try {
        console.log('In my.js.cmdDisplayDeleteUnsubmittedBudgetRequestDialog(' + requestId + ', ' + title + ')1.');

        if (!requestId) {
            var inXslForm = true;
            requestId = document.getElementById('OfflineRequestBudgetRequestIdInXslForm').innerHTML;
            title = 'this request...';
            console.log('requestId: ' + requestId);
        }


        $("#divDeleteABudgetRequestOfflineDialog").dialog({
            modal: true,
            resizable: false,
            closeText: "Cancel",
            closeOnEscape: true, // Hit the ESC key to hide! Yeah!
            title: 'Delete ' + requestId,
            width: "570px",
            dialogClass: "no-close", // No close button in the upper right corner.
            hide: false, // This means when hiding just disappear with no effects.
            open: function () {
                $('.ui-widget-overlay').bind('click', function () {
                    $("#divDeleteABudgetRequestOfflineDialog").dialog('close');
                });


                // Set the title.
                document.getElementById('spanDeleteABudgetRequestOfflineDialogTitle').innerHTML = 'Delete ' + title; // + ' (<em>' + formatCurrency(requestedAmount) + '</em>).';

                // Set the click event for the Delete button.
                $('#divDeleteABudgetRequestOfflineDialogDeleteRequestButton').off('click').click(function (error) {
                    //debugger; //delete indexdb request xcx1
                    var db = $('.bwCoreComponent').bwCoreComponent('getIndexDbInstance');


                    //request.onsuccess = function (event) {
                    //    var db = event.target.result;
                    //    console.log('In cmdDisplayDeleteUnsubmittedBudgetRequestDialog(). Successfully opened the database "' + event.target.result.name + '".');

                    //    db.onerror = function (event) {
                    //        console.log('Error in ios8.js.cmdDisplayDeleteUnsubmittedBudgetRequestDialog()2. DATABASE ERROR!!!!!!!!!! :' + 'Error accessing database "' + event.target.result.name + '". errorCode: ' + event.target.errorCode);
                    //    };

                    var objectStore = db.transaction("objectStoreCachedRequests").objectStore("objectStoreCachedRequests");

                    objectStore.openCursor().onsuccess = function (event) {
                        try {
                            //debugger;
                            var cursor = event.target.result;
                            if (cursor) {
                                if (cursor.value.bwBudgetRequestId == requestId) {

                                    var transaction = db.transaction("objectStoreCachedRequests", 'readwrite'); //IDBTransaction.READ_WRITE); 
                                    var del = transaction.objectStore("objectStoreCachedRequests").delete(cursor.primaryKey); // Don't need a key, it autonumbers. 

                                    //var del = db.transaction(["customers"], "readwrite").objectStore("customers").delete("444-44-4444");

                                    del.onsuccess = function (event) {
                                        try {
                                            console.log("In cmdDisplayDeleteUnsubmittedBudgetRequestDialog(). Successfully deleted request from the database.");

                                            if (inXslForm == true) {
                                                console.log('inXslForm: ' + inXslForm);
                                                $('#divDeleteABudgetRequestOfflineDialog').dialog('close');
                                                $('#divOfflineRequestFormDialog').dialog('close');
                                                renderWelcomePageOffline();
                                            } else {
                                                // When coming from the list of requests...
                                                $('#divDeleteABudgetRequestOfflineDialog').dialog('close');
                                                //cmdDisplayClientRequestsNotYetSubmittedDialog(true);

                                                populateStartPageItem('divArchiveOffline', 'Reports', '');
                                            }





                                            // TODD: If the user is logged in, this logs out the user. This needs to be fixed!
                                            //console.log('if (participantId === null) {');

                                            //if (typeof participantId !== 'undefined') {
                                            //    console.log('participantId: ' + participantId);
                                            //    // Logged in.
                                            //    //displayAlertDialog('participantId: ' + participantId);
                                            //    populateStartPageItem('divWelcome', 'Reports', '');
                                            //} else {
                                            //    console.log('Calling renderWelcomePageOffline().');
                                            //    // Not logged in.
                                            //    // Since one was deleted, we need to regenerate the buttons. For instance, so the Archive (2) button is now Archive (1).
                                            //    renderWelcomePageOffline();
                                            //}





                                        } catch (e) {
                                            console.log('Exception in my.js.cmdDisplayDeleteUnsubmittedBudgetRequestDialog(' + requestId + ', ' + title + ', ' + requestedAmount + '): ' + e.message + ', ' + e.stack);
                                        }

                                    };

                                    del.onerror = function (event) {
                                        //debugger;
                                        console.error("In cmdDisplayDeleteUnsubmittedBudgetRequestDialog(). Error deleting request from the database.", this.error);
                                    };

                                }
                                cursor.continue();
                            } else {
                                console.log('In my.js.cmdDisplayDeleteUnsubmittedBudgetRequestDialog3. DONE LOOPING.');
                            }
                        } catch (e) {
                            console.log('Exception in my.js.cmdDisplayDeleteUnsubmittedBudgetRequestDialog4. xxError: ' + e.message + ', ' + e.stack);
                        }
                    };

                    //};

                });


            }
        });

        // Hide the title bar.
        $("#divDeleteABudgetRequestOfflineDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();


    } catch (e) {
        console.log('Exception in cmdDisplayDeleteUnsubmittedBudgetRequestDialog(): ' + e.message + ', ' + e.stack);
        displayAlertDialog('Exception in cmdDisplayDeleteUnsubmittedBudgetRequestDialog(): ' + e.message);
    }
}

function cmdRenderAndLoadNewRequestFormWithUnsubmittedRequest(_budgetRequestId) {
    try {
        console.log('In cmdRenderAndLoadNewRequestFormWithUnsubmittedRequest(). _budgetRequestId: ' + _budgetRequestId);
        // This is invoked from the dialog, so make sure we close it.
        try {
            $("#divClientRequestsNotYetSubmittedDialog").dialog('close');
            console.log('Closed dialog "divClientRequestsNotYetSubmittedDialog".');
        } catch (e) { }

        var request = indexedDB.open(indexDBName, dbVersion);

        request.onerror = function (event) {
            console.log('In my.js.cmdRenderAndLoadNewRequestFormWithUnsubmittedRequest(). Error accessing database "' + event.target.result.name + '". errorCode: ' + event.target.errorCode);
        };

        request.onsuccess = function (event) {
            console.log('In my.js.cmdRenderAndLoadNewRequestFormWithUnsubmittedRequest(' + _budgetRequestId + '). Success accessing database "' + event.target.result.name + '".');
            var db = event.target.result;

            db.onerror = function (event) {
                console.log('Error in index.js.cmdRenderAndLoadNewRequestFormWithUnsubmittedRequest(). DATABASE ERROR!!!!!!!!!! :' + 'Error accessing database "' + event.target.result.name + '". errorCode: ' + event.target.errorCode);
            };

            var objectStore = db.transaction("objectStoreCachedRequests").objectStore("objectStoreCachedRequests");

            objectStore.openCursor().onsuccess = function (event) {
                try {
                    var cursor = event.target.result;
                    if (cursor) {
                        if (cursor.value.bwBudgetRequestId == _budgetRequestId) {
                            // We found it! populate the form values.









                            if (bwLastSelectedNewRequestType == 'recurringexpense') {
                                $('#trNewRequestRecurringExpenseSection').show(); // Not sure if this is the best place to make sure this section is hidden, but it works for now.
                                $('#dtRecurringExpenseReminderDate').datepicker(); // Hook up the date picker.
                            } else {
                                $('#trNewRequestRecurringExpenseSection').hide();
                            }

                            // When a user comes here to create a new request, it is important that we create the BudgetRequestId. This is because if they add attachments, we
                            // need to have this already so we can identify which budget request the file attachments belong to.
                            //var _budgetRequestId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                            //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                            //    return v.toString(16);
                            //});


                            //debugger;
                            alert('Developer: Check this code: xcx324427.');
                            $('.bwRequest').bwRequest('displayRequestFormDialog', 'a9a89917-16a8-4801-a7fc-f9ed6841d831', '84404479-87b3-4f9c-b096-e65db5426c5e', 'BR-180001');

                            // todd test 10-19-19
                            document.getElementById('BudgetRequestId').innerHTML = _budgetRequestId;







                            // This may be a recurring expense, so we will do the same thing just in case.
                            //var _recurringExpenseId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                            //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                            //    return v.toString(16);
                            //});
                            //document.getElementById('RecurringExpenseId').innerHTML = _recurringExpenseId;

                            //displayAlertDialog('Set RecurringExpenseId to: ' + _recurringExpenseId);

                            // Populate the fields!
                            document.getElementById('strProjectTitle').value = cursor.value.ProjectTitle;
                            document.getElementById('strBriefDescriptionOfProject').value = 'Dev: Retrieve indexDB field value [my:Brief_Description_of_Project]'; // Need to parse cursor.value.bwDocumentXml and get the <my:Brief_Description_of_Project> value.
                            document.getElementById('dblRequestedCapital').value = cursor.value.RequestedCapital;
                            document.getElementById('txtProjectManagerName').value = cursor.value.ManagerId;
                            document.getElementById('ddlFunctionalArea').innerHTML = cursor.value.FunctionalAreaId;
                            document.getElementById('newrequestattachments').innerHTML = ''; //cursor.value.xx;


                            //$('#bwStartPageAccordion').show();
                            $('#bwQuickLaunchMenuTd').css({
                                width: '0'
                            }); // This gets rid of the jumping around.
                            //$('#bwQuickLaunchMenu').hide();
                            $('#liWelcome').hide();
                            $('#liArchive').hide();
                            $('#liSummaryReport').hide();
                            $('#liConfiguration').hide();
                            $('#liHelp').hide();
                            $('#liVisualizations').hide();
                            $('#liNewRequest').show();

                            var e1 = document.getElementById('divNewRequestMasterDiv');
                            e1.style.borderRadius = '20px 0 0 20px';

                            //debugger;
                            // Create the drop down at the top of the page, and select the last used option!
                            // First we load our array.
                            var requestTypes = [];
                            requestTypes = new Array();
                            // Budget Request
                            var request = ['budgetrequest', 'Budget Request', 'selected'];
                            requestTypes.push(request);
                            // Quote Request
                            if (quotingEnabled == true) {
                                var request = ['quoterequest', 'Quote Request', ''];
                                requestTypes.push(request);
                            }
                            // Reimbursement Request
                            if (reimbursementRequestsEnabled == true) {
                                var request = ['expenserequest', 'Reimbursement Request', ''];
                                requestTypes.push(request);
                            }
                            // Recurring Expense
                            if (recurringExpensesEnabled == true) {
                                var request = ['recurringexpense', 'Recurring Expense', ''];
                                requestTypes.push(request);
                            }





                            var request = ['capitalplanproject', 'Capital Plan Project', '']; //capitalplanproject1
                            requestTypes.push(request);

                            var request = ['workorder', 'Work Order', ''];
                            requestTypes.push(request);





                            // Now formulate the GUI!
                            var html = '';
                            if (requestTypes.length == 1) {
                                // If there is only one, don't display as a drop down, just as plain text.
                                html += '<span style="font-size: 200%;">New <strong>' + requestTypes[0][1] + '</strong></span>';
                                document.getElementById('spanRequestForm_Title').innerHTML = html;
                            } else {
                                // There is more than 1, so we have to display as a drop down.
                                html += '<span style="font-size: 200%;">New <strong>';
                                //html += '<select class="selectHomePageWorkflowAppDropDown" id="selectNewRequestFormRequestTypeDropDown" style=\'border-color: whitesmoke; color: rgb(38, 38, 38); font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 1.25em; font-weight: bold; cursor: pointer;\' onchange="xxxx();">';
                                html += '<select id="selectNewRequestFormRequestTypeDropDown" style=\'border-color: whitesmoke; color: rgb(38, 38, 38); font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 1.25em; font-weight: bold; cursor: pointer;\'>';
                                for (var i = 0; i < requestTypes.length; i++) {
                                    if (requestTypes[i][0] == bwLastSelectedNewRequestType) {
                                        // Selected
                                        html += '<option value="' + requestTypes[i][0] + '" ' + requestTypes[i][2] + ' selected >' + requestTypes[i][1] + '</option>';
                                    } else {
                                        // Not selected
                                        html += '<option value="' + requestTypes[i][0] + '" ' + requestTypes[i][2] + '>' + requestTypes[i][1] + '</option>';
                                    }
                                }
                                html += '</select>';
                                html += '</span>';
                                document.getElementById('spanRequestForm_Title').innerHTML = html;


                                // Now hook up the change event for the drop down!!
                                $('#selectNewRequestFormRequestTypeDropDown').change(function () {
                                    var selectedValue = $('#selectNewRequestFormRequestTypeDropDown option:selected').val();
                                    bwLastSelectedNewRequestType = selectedValue;
                                    // Save the selected value back to the database so that it remembers how the participant left things, so it is the same when they come back.
                                    var data = [];
                                    data = {
                                        bwParticipantId: participantId,
                                        bwWorkflowAppId: workflowAppId,
                                        bwLastSelectedNewRequestType: bwLastSelectedNewRequestType
                                    };
                                    var operationUri = webserviceurl + "/bwparticipant/updateuserconfigurationselectednewrequestscreenrequesttype";
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
                                                if (selectedValue == 'recurringexpense') {
                                                    // Recurring Expense was selected!!!
                                                    //$('#trNewRequestQuoteSection').hide();
                                                    $('#trNewRequestRecurringExpenseSection').show();

                                                    //var html = '';
                                                    //html += '<input id="cbNewRequestRecurringExpenseSubmitImmediately" type="checkbox" disabled /><span style="font-size:10pt;color:lightgray;">Submit the first budget request immediately.</span><br />';
                                                    //html += '<span style="font-size:8pt;">This does not create the budget request, it only schedules the reminder for when the budget request should be submitted.</span><br />';

                                                    //html += '<span style="font-size:10pt;">Reminder date:</span><br />';
                                                    //html += '<input type="text" id="dtRecurringExpenseReminderDate" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: left;" /><br />';
                                                    ////html += 'Justification details:<br />';
                                                    ////html += '<textarea id="strRecurringExpenseDetails" rows="1" style="WIDTH: 97%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;"></textarea><br />';
                                                    ////html += '<input id="cbNewRequestRecurringExpenseNotifyMeOnDateChanged" type="checkbox" />Notify me if anyone changes the date.<br />';
                                                    //html += '<span style="font-size:8pt;">You and the Manager will receive notifications prior to the reminder date so that you can initiate the next new request. Also, if anyone changes the date you will be notified.</span><br />';
                                                    //document.getElementById('spanNewRequestRecurringExpenseSecondSection').innerHTML = html;
                                                    $('#dtRecurringExpenseReminderDate').datepicker(); // Hook up the date picker.
                                                } else {
                                                    $('#trNewRequestRecurringExpenseSection').hide();
                                                }
                                            }
                                        },
                                        error: function (data, errorCode, errorMessage) {
                                            displayAlertDialog('Error in my.js.cmdChooseSelectedWorkflow(): ' + errorCode + ' ' + errorMessage);
                                        }
                                    });
                                });
                            }

                            populateFunctionalAreas();

                            // Populate the year drop-down

                            // ALTER THE NEW REQUEST FORM ACCORDING TO THE CONFIGURATION SETTINGS.
                            //if (_type == 'supplemental') {
                            //    // This is a supplemental request for budget request _reference, which is a guid.
                            //    var html = '';
                            //    html += '<br /><span style="font-size:200%;">&nbsp;&nbsp;&nbsp;Supplemental <strong>Budget Request</strong><br /><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-style:italic;">for ' + _reference + ' (xxxx)</span></span></span>';
                            //    document.getElementById('spanNewRequestFormTitle').innerHTML = html;
                            //    var html = '';
                            //    html += '';
                            //    html += '<button id="startWorkflowButton" onclick="cmdCreateSupplementalBudgetRequestAndStartWorkflow(\'' + _reference + '\');" class="BwButton200" title="Click here to Submit the supplemental request.">Submit</button>';
                            //    html += '&nbsp;<button onclick="populateStartPageItem(\'divWelcome\', \'\', \'\');" class="BwButton200">Cancel</button>';
                            //    html += '&nbsp;';
                            //    document.getElementById('spanNewBudgetRequestPageButtons').innerHTML = html;


                            //} else {
                            //var html = '';
                            //html += '<br /><span style="font-size:200%;">&nbsp;&nbsp;&nbsp;New <strong>Budget Request</strong><br /><span></span></span><br />';
                            //document.getElementById('spanNewRequestFormTitle').innerHTML = html;
                            //var html = '';
                            //html += '';
                            //var isSupplemental = 'false';
                            //var relatedBudgetRequestId = '';
                            //html += '<button id="startWorkflowButton" onclick="cmdCreateBudgetRequestAndStartWorkflow(\'' + isSupplemental + '\', \'' + relatedBudgetRequestId + '\');" class="BwButton200" title="Click here to Submit the request.">Submit</button>';
                            //html += '&nbsp;<button onclick="populateStartPageItem(\'divWelcome\', \'\', \'\');" class="BwButton200">Cancel</button>';
                            //html += '&nbsp;';
                            //document.getElementById('spanNewBudgetRequestPageButtons').innerHTML = html;
                            //}


                            // Set the manager title.
                            $('#spanRequestForm_ManagerTitle').html(newBudgetRequestManagerTitle);
                            // Set if the details are required.
                            if (requireRequestDetails == true) {
                                document.getElementById('spanNewRequestDetailsLabel').innerHTML = '<span class="xdlabel">Justification details:</span>&nbsp;<span style="color:red;font-size:medium;">*</span>';
                            } else {
                                document.getElementById('spanNewRequestDetailsLabel').innerHTML = '<span class="xdlabel">Justification details:</span>';
                            }
                            // Set if the dates are required.
                            if (requireStartEndDates == true) {
                                document.getElementById('spanNewRequestStartDateLabel').innerHTML = '<span class="xdlabel" style="white-space:nowrap;">Start date (estimated):&nbsp;</span><span style="color:red;font-size:medium;">*</span>';
                                document.getElementById('spanNewRequestEndDateLabel').innerHTML = '<span class="xdlabel" style="white-space:nowrap;">End date (estimated):&nbsp;</span><span style="color:red;font-size:medium;">*</span>';
                            } else {
                                document.getElementById('spanNewRequestStartDateLabel').innerHTML = '<span class="xdlabel">Start date (estimated):</span>';
                                document.getElementById('spanNewRequestEndDateLabel').innerHTML = '<span class="xdlabel">End date (estimated):</span>';
                            }
                            // Set if the attachments are allowed.
                            if (enableNewRequestAttachments == true) {
                                $('#trNewRequestAttachmentsSection').show();
                                //document.getElementById('trNewRequestAttachmentsSection').innerHTML = '<span class="xdlabel">Attachments:</span>&nbsp;<span style="color:red;font-size:medium;">*</span>';
                            } else {
                                $('#trNewRequestAttachmentsSection').hide();
                                //document.getElementById('trNewRequestAttachmentsSection').innerHTML = '<span class="xdlabel">Attachments:</span>';
                            }

                            // Set if the attachments are allowed.
                            if (enableNewRequestBarcodeAttachments == true) {
                                $('#trNewRequestBarcodeAttachmentsSection').show();
                                //document.getElementById('trNewRequestAttachmentsSection').innerHTML = '<span class="xdlabel">Attachments:</span>&nbsp;<span style="color:red;font-size:medium;">*</span>';
                            } else {
                                $('#trNewRequestBarcodeAttachmentsSection').hide();
                                //document.getElementById('trNewRequestAttachmentsSection').innerHTML = '<span class="xdlabel">Attachments:</span>';
                            }

                            // Set if the recurring expenses is enabled.
                            //if (recurringExpensesEnabled == true) {
                            //$('#trNewRequestRecurringExpenseSection').show();
                            //document.getElementById('cbNewRequestRecurringExpenseEnabled').checked = false; // Default to not selected.
                            // Hook up the checkbox event. cbNewRequestRecurringExpenseEnabled.click
                            //$('#cbNewRequestRecurringExpenseEnabled').click(function () {
                            //    //displayAlertDialog('enable this section'); // color: #adadad;
                            //    if (this.checked == true) {
                            //        $('#trNewRequestQuoteSection').hide();

                            //        //document.getElementById('spanNewRequestRecurringExpenseSectionTitle').style.color = 'black';
                            //        var html = '';
                            //        html += '<input id="cbNewRequestRecurringExpenseSubmitImmediately" type="checkbox" /><span style="font-size:10pt;">Submit the first budget request immediately.</span><br />';

                            //        html += '<span style="font-size:10pt;">Reminder date:</span><br />';
                            //        html += '<input type="text" id="dtRecurringExpenseReminderDate" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: left;" /><br />';
                            //        //html += 'Justification details:<br />';
                            //        //html += '<textarea id="strRecurringExpenseDetails" rows="1" style="WIDTH: 97%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;"></textarea><br />';
                            //        //html += '<input id="cbNewRequestRecurringExpenseNotifyMeOnDateChanged" type="checkbox" />Notify me if anyone changes the date.<br />';
                            //        html += '<span style="font-size:10pt;">You and the Manager will receive notifications prior to the reminder date so that you can initiate the next new request. Also, if anyone changes the date you will be notified.</span><br />';
                            //        document.getElementById('spanNewRequestRecurringExpenseSecondSection').innerHTML = html;
                            //        $('#dtRecurringExpenseReminderDate').datepicker(); // Hook up the date picker.
                            //    } else {
                            //        $('#trNewRequestQuoteSection').show();
                            //        //document.getElementById('spanNewRequestRecurringExpenseSectionTitle').style.color = '#adadad';
                            //        //var html = '';
                            //        //html += 'Reminder date:<br />';
                            //        //html += '<input type="text" id="dtRecurringExpenseReminderDate" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: left;" /><br />';
                            //        //html += 'Justification details:<br />';
                            //        //html += '<textarea id="strRecurringExpenseDetails" rows="1" style="WIDTH: 97%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;"></textarea><br />';
                            //        //html += '<input id="cbNewRequestRecurringExpenseSubmitImmediately" type="checkbox" />Submit the first budget request immediately.<br />';
                            //        //html += 'You and the Manager will receive notifications prior to the reminder date so that you can initiate the next new request.<br />';
                            //        //html += '<input id="cbNewRequestRecurringExpenseNotifyMeOnDateChanged" type="checkbox" />Notify me if anyone changes the date.';
                            //        //document.getElementById('spanNewRequestRecurringExpenseSecondSection').innerHTML = html;
                            //        document.getElementById('spanNewRequestRecurringExpenseSecondSection').innerHTML = '';
                            //    }




                            //});
                            //html += '<span id="spanRecurringExpensesChoiceOnFixedDates"><input type="radio" name="rbRecurringExpensesChoice" /><span>recurring on fixed dates</span></span><br />';
                            //html += '<span id="spanRecurringExpensesChoiceOnATimePeriod"><input type="radio" name="rbRecurringExpensesChoice" /><span>recurring on a time period</span></span><br />';

                            //} else {
                            //    $('#trNewRequestRecurringExpenseSection').hide();
                            //    //document.getElementById('trNewRequestAttachmentsSection').innerHTML = '<span class="xdlabel">Attachments:</span>';
                            //}

                            // Set if the quoting is enabled.
                            //if (quotingEnabled == true) {
                            //    $('#trNewRequestQuoteSection').show();
                            //    document.getElementById('cbNewRequestQuoteEnabled').checked = false; // Default to not selected.
                            //    // Hook up the checkbox event. cbNewRequestRecurringExpenseEnabled.click
                            //    $('#cbNewRequestQuoteEnabled').click(function () {
                            //        //displayAlertDialog('enable this section'); // color: #adadad;
                            //        if (this.checked == true) {
                            //            $('#trNewRequestRecurringExpenseSection').hide();

                            //            var html = '';
                            //            html += 'New <strong>Quote Request</strong>';
                            //            document.getElementById('spanNewRequestFormTitle').innerHTML = html;

                            //            ////document.getElementById('spanNewRequestRecurringExpenseSectionTitle').style.color = 'black';
                            //            //var html = '';
                            //            //html += '<input id="cbNewRequestRecurringExpenseSubmitImmediately" type="checkbox" /><span style="font-size:10pt;">Submit the first budget request immediately.</span><br />';

                            //            //html += '<span style="font-size:10pt;">Reminder date:</span><br />';
                            //            //html += '<input type="text" id="dtRecurringExpenseReminderDate" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: left;" /><br />';
                            //            ////html += 'Justification details:<br />';
                            //            ////html += '<textarea id="strRecurringExpenseDetails" rows="1" style="WIDTH: 97%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;"></textarea><br />';
                            //            ////html += '<input id="cbNewRequestRecurringExpenseNotifyMeOnDateChanged" type="checkbox" />Notify me if anyone changes the date.<br />';
                            //            //html += '<span style="font-size:10pt;">You and the Manager will receive notifications prior to the reminder date so that you can initiate the next new request. Also, if anyone changes the date you will be notified.</span><br />';
                            //            //document.getElementById('spanNewRequestRecurringExpenseSecondSection').innerHTML = html;
                            //            //$('#dtRecurringExpenseReminderDate').datepicker(); // Hook up the date picker.
                            //        } else {
                            //            $('#trNewRequestRecurringExpenseSection').show();

                            //            // 







                            //            var html = '';
                            //            html += 'New <strong>Budget Request</strong>';
                            //            html += '</span>';
                            //            document.getElementById('spanNewRequestFormTitle').innerHTML = html;

                            //            //document.getElementById('spanNewRequestRecurringExpenseSectionTitle').style.color = '#adadad';
                            //            //var html = '';
                            //            //html += 'Reminder date:<br />';
                            //            //html += '<input type="text" id="dtRecurringExpenseReminderDate" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: left;" /><br />';
                            //            //html += 'Justification details:<br />';
                            //            //html += '<textarea id="strRecurringExpenseDetails" rows="1" style="WIDTH: 97%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;"></textarea><br />';
                            //            //html += '<input id="cbNewRequestRecurringExpenseSubmitImmediately" type="checkbox" />Submit the first budget request immediately.<br />';
                            //            //html += 'You and the Manager will receive notifications prior to the reminder date so that you can initiate the next new request.<br />';
                            //            //html += '<input id="cbNewRequestRecurringExpenseNotifyMeOnDateChanged" type="checkbox" />Notify me if anyone changes the date.';
                            //            //document.getElementById('spanNewRequestRecurringExpenseSecondSection').innerHTML = html;
                            //            document.getElementById('spanNewRequestQuoteSecondSection').innerHTML = '';
                            //        }




                            //    });
                            //    //html += '<span id="spanRecurringExpensesChoiceOnFixedDates"><input type="radio" name="rbRecurringExpensesChoice" /><span>recurring on fixed dates</span></span><br />';
                            //    //html += '<span id="spanRecurringExpensesChoiceOnATimePeriod"><input type="radio" name="rbRecurringExpensesChoice" /><span>recurring on a time period</span></span><br />';

                            //} else {
                            //    $('#trNewRequestQuoteSection').hide();
                            //    //document.getElementById('trNewRequestAttachmentsSection').innerHTML = '<span class="xdlabel">Attachments:</span>';
                            //}


                            //renderLeftButtons('divNewRequestPageLeftButtons');



                            // Now we can hook up the Participant text box for autocomplete.
                            $("#txtProjectManagerName").autocomplete({
                                source: function (request, response) {
                                    //weburl = _spPageContextInfo.siteAbsoluteUrl;
                                    $.ajax({
                                        url: webserviceurl + "/workflow/" + workflowAppId + "/participants/" + request.term,
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
                                    var projectManagerName = this.value.split('|')[0];
                                    var projectManagerId = this.value.split('|')[1];
                                    var projectManagerEmail = this.value.split('|')[2];

                                    if (projectManagerName.indexOf('undefined') > -1) {
                                        document.getElementById('txtProjectManagerName').value = '';
                                        document.getElementById('txtProjectManagerId').value = '';
                                        document.getElementById('txtProjectManagerEmail').value = '';
                                    } else {
                                        document.getElementById('txtProjectManagerName').value = projectManagerName; //this.value.split(' ')[0] + ' ' + this.value.split(' ')[1]; // Just shows the Loan Number parameter (removing the borrower name) so it fits in the text box.
                                        document.getElementById('txtProjectManagerId').value = projectManagerId;
                                        document.getElementById('txtProjectManagerEmail').value = projectManagerEmail;
                                    }
                                }
                            });

                            monkeyPatchAutocomplete(); // This customizes the drop down when searching for users in the user text boxes.





















                        }






                        cursor.continue();
                    }
                } catch (e) {
                    console.log('In my.js.cmdRenderAndLoadNewRequestFormWithUnsubmittedRequest(). xyyyyy...' + e.message + ', ' + e.stack);
                }
            };
        };
    } catch (e) {
        console.log('In my.js.cmdRenderAndLoadNewRequestFormWithUnsubmittedRequest().2: cccccc...' + e.message + ', ' + e.stack);
    }
}

function cmdRenderAndLoadNewRequestFormWithUnsubmittedRequest_loggedin_IndexDb(_budgetRequestId) {
    try {
        console.log('In cmdRenderAndLoadNewRequestFormWithUnsubmittedRequest_loggedin_IndexDb(). _budgetRequestId: ' + _budgetRequestId);
        //debugger;
        // This is invoked from the dialog, so make sure we close it.
        try {
            $("#divClientRequestsNotYetSubmittedDialog").dialog('close');
            console.log('Closed dialog "divClientRequestsNotYetSubmittedDialog".');
        } catch (e) { }


        window.scrollTo(0, 0); // Scroll to top on button click. This makes sure things render Ok, and also just seems like a nicer user experience.
        $('.bwActiveMenu').bwActiveMenu('adjustLeftSideMenu'); // This makes sure our new stretchy-left-menu redraws Ok.


        var db = $('.bwCoreComponent').bwCoreComponent('getIndexDbInstance');
        //var request = indexedDB.open(indexDBName, dbVersion);

        //request.onerror = function (event) {
        //    console.log('In my.js.cmdRenderAndLoadNewRequestFormWithUnsubmittedRequest(). Error accessing database "' + event.target.result.name + '". errorCode: ' + event.target.errorCode);
        //};

        //request.onsuccess = function (event) {
        //    console.log('In my.js.cmdRenderAndLoadNewRequestFormWithUnsubmittedRequest(' + _budgetRequestId + '). Success accessing database "' + event.target.result.name + '".');
        //    var db = event.target.result;

        //    db.onerror = function (event) {
        //        console.log('Error in index.js.cmdRenderAndLoadNewRequestFormWithUnsubmittedRequest(). DATABASE ERROR!!!!!!!!!! :' + 'Error accessing database "' + event.target.result.name + '". errorCode: ' + event.target.errorCode);
        //    };

        var objectStore = db.transaction("objectStoreCachedRequests").objectStore("objectStoreCachedRequests");

        objectStore.openCursor().onsuccess = function (event) {
            try {
                var cursor = event.target.result;
                if (cursor) {
                    if (cursor.value.bwBudgetRequestId == _budgetRequestId) {
                        // We found it! populate the form values.









                        if (bwLastSelectedNewRequestType == 'recurringexpense') {
                            $('#trNewRequestRecurringExpenseSection').show(); // Not sure if this is the best place to make sure this section is hidden, but it works for now.
                            $('#dtRecurringExpenseReminderDate').datepicker(); // Hook up the date picker.
                        } else {
                            $('#trNewRequestRecurringExpenseSection').hide();
                        }

                        // When a user comes here to create a new request, it is important that we create the BudgetRequestId. This is because if they add attachments, we
                        // need to have this already so we can identify which budget request the file attachments belong to.
                        //var _budgetRequestId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        //    return v.toString(16);
                        //});








                        // THIS WILL DISPLAY THE REUEST DIALOG
                        // javascript:$('.bwRequest').bwRequest('displayRequestFormDialog', 'a9a89917-16a8-4801-a7fc-f9ed6841d831', '84404479-87b3-4f9c-b096-e65db5426c5e', 'BR-180001');

                        //debugger; // CHECK title below
                        //displayRequestFormDialog();
                        $('.bwRequest').bwRequest('displayRequestFormDialog_IndexDB', _budgetRequestId, participantId, cursor.value); // The request doesn't have a title yet, as it is a new request. eg: BR-200001

                        // todd test 10-19-19
                        //document.getElementById('BudgetRequestId').innerHTML = _budgetRequestId;







                        // This may be a recurring expense, so we will do the same thing just in case.
                        //var _recurringExpenseId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        //    return v.toString(16);
                        //});
                        //document.getElementById('RecurringExpenseId').innerHTML = _recurringExpenseId;

                        //displayAlertDialog('Set RecurringExpenseId to: ' + _recurringExpenseId);

                        // Populate the fields!
                        //document.getElementById('strProjectTitle').value = cursor.value.ProjectTitle;
                        //document.getElementById('strBriefDescriptionOfProject').value = 'Dev: Retrieve indexDB field value [my:Brief_Description_of_Project]'; // Need to parse cursor.value.bwDocumentXml and get the <my:Brief_Description_of_Project> value.
                        //document.getElementById('dblRequestedCapital').value = cursor.value.RequestedCapital;
                        //document.getElementById('txtProjectManagerName').value = cursor.value.ManagerId;
                        //document.getElementById('ddlFunctionalArea').innerHTML = cursor.value.FunctionalAreaId;
                        //document.getElementById('newrequestattachments').innerHTML = ''; //cursor.value.xx;


                        ////$('#bwStartPageAccordion').show();
                        //$('#bwQuickLaunchMenuTd').css({
                        //    width: '0'
                        //}); // This gets rid of the jumping around.
                        ////$('#bwQuickLaunchMenu').hide();
                        //$('#liWelcome').hide();
                        //$('#liArchive').hide();
                        //$('#liSummaryReport').hide();
                        //$('#liConfiguration').hide();
                        //$('#liHelp').hide();
                        //$('#liNewRequest').show();

                        //var e1 = document.getElementById('divNewRequestMasterDiv');
                        //e1.style.borderRadius = '20px 0 0 20px';

                        ////debugger;
                        //// Create the drop down at the top of the page, and select the last used option!
                        //// First we load our array.
                        //var requestTypes = [];
                        //requestTypes = new Array();
                        //// Budget Request
                        //var request = ['budgetrequest', 'Budget Request', 'selected'];
                        //requestTypes.push(request);
                        //// Quote Request
                        //if (quotingEnabled == true) {
                        //    var request = ['quoterequest', 'Quote Request', ''];
                        //    requestTypes.push(request);
                        //}
                        //// Reimbursement Request
                        //if (reimbursementRequestsEnabled == true) {
                        //    var request = ['expenserequest', 'Reimbursement Request', ''];
                        //    requestTypes.push(request);
                        //}
                        //// Recurring Expense
                        //if (recurringExpensesEnabled == true) {
                        //    var request = ['recurringexpense', 'Recurring Expense', ''];
                        //    requestTypes.push(request);
                        //}





                        //var request = ['capitalplanproject', 'Capital Plan Project', '']; //capitalplanproject2
                        //requestTypes.push(request);

                        //var request = ['workorder', 'Work Order', ''];
                        //requestTypes.push(request);




                        //// Now formulate the GUI!
                        //var html = '';
                        //if (requestTypes.length == 1) {
                        //    // If there is only one, don't display as a drop down, just as plain text.
                        //    html += '<span style="font-size: 200%;">New <strong>' + requestTypes[0][1] + '</strong></span>';
                        //    document.getElementById('spanRequestForm_Title').innerHTML = html;
                        //} else {
                        //    // There is more than 1, so we have to display as a drop down.
                        //    html += '<span style="font-size: 200%;">New <strong>';
                        //    //html += '<select class="selectHomePageWorkflowAppDropDown" id="selectNewRequestFormRequestTypeDropDown" style=\'border-color: whitesmoke; color: rgb(38, 38, 38); font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 1.25em; font-weight: bold; cursor: pointer;\' onchange="xxxx();">';
                        //    html += '<select id="selectNewRequestFormRequestTypeDropDown" style=\'border-color: whitesmoke; color: rgb(38, 38, 38); font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 1.25em; font-weight: bold; cursor: pointer;\'>';

                        //    debugger; // requestTypes MUST BE REALLY LONG HERE?????????????????????????????????????????????????????????????????????????????????????????????

                        //    for (var i = 0; i < requestTypes.length; i++) {
                        //        if (requestTypes[i][0] == bwLastSelectedNewRequestType) {
                        //            // Selected
                        //            html += '<option value="' + requestTypes[i][0] + '" ' + requestTypes[i][2] + ' selected >' + requestTypes[i][1] + '</option>';
                        //        } else {
                        //            // Not selected
                        //            html += '<option value="' + requestTypes[i][0] + '" ' + requestTypes[i][2] + '>' + requestTypes[i][1] + '</option>';
                        //        }
                        //    }
                        //    html += '</select>';
                        //    html += '</span>';
                        //    document.getElementById('spanRequestForm_Title').innerHTML = html;


                        //    // Now hook up the change event for the drop down!!
                        //    $('#selectNewRequestFormRequestTypeDropDown').change(function () {
                        //        var selectedValue = $('#selectNewRequestFormRequestTypeDropDown option:selected').val();
                        //        bwLastSelectedNewRequestType = selectedValue;
                        //        // Save the selected value back to the database so that it remembers how the participant left things, so it is the same when they come back.
                        //        var data = [];
                        //        data = {
                        //            bwParticipantId: participantId,
                        //            bwWorkflowAppId: workflowAppId,
                        //            bwLastSelectedNewRequestType: bwLastSelectedNewRequestType
                        //        };
                        //        var operationUri = webserviceurl + "/bwparticipant/updateuserconfigurationselectednewrequestscreenrequesttype";
                        //        $.ajax({
                        //            url: operationUri,
                        //            type: "POST", timeout: ajaxTimeout,
                        //            data: data,
                        //            headers: {
                        //                "Accept": "application/json; odata=verbose"
                        //            },
                        //            success: function (data) {
                        //                if (data != 'SUCCESS') {
                        //                    displayAlertDialog(data);
                        //                } else {
                        //                    if (selectedValue == 'recurringexpense') {
                        //                        // Recurring Expense was selected!!!
                        //                        //$('#trNewRequestQuoteSection').hide();
                        //                        $('#trNewRequestRecurringExpenseSection').show();

                        //                        //var html = '';
                        //                        //html += '<input id="cbNewRequestRecurringExpenseSubmitImmediately" type="checkbox" disabled /><span style="font-size:10pt;color:lightgray;">Submit the first budget request immediately.</span><br />';
                        //                        //html += '<span style="font-size:8pt;">This does not create the budget request, it only schedules the reminder for when the budget request should be submitted.</span><br />';

                        //                        //html += '<span style="font-size:10pt;">Reminder date:</span><br />';
                        //                        //html += '<input type="text" id="dtRecurringExpenseReminderDate" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: left;" /><br />';
                        //                        ////html += 'Justification details:<br />';
                        //                        ////html += '<textarea id="strRecurringExpenseDetails" rows="1" style="WIDTH: 97%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;"></textarea><br />';
                        //                        ////html += '<input id="cbNewRequestRecurringExpenseNotifyMeOnDateChanged" type="checkbox" />Notify me if anyone changes the date.<br />';
                        //                        //html += '<span style="font-size:8pt;">You and the Manager will receive notifications prior to the reminder date so that you can initiate the next new request. Also, if anyone changes the date you will be notified.</span><br />';
                        //                        //document.getElementById('spanNewRequestRecurringExpenseSecondSection').innerHTML = html;
                        //                        $('#dtRecurringExpenseReminderDate').datepicker(); // Hook up the date picker.
                        //                    } else {
                        //                        $('#trNewRequestRecurringExpenseSection').hide();
                        //                    }
                        //                }
                        //            },
                        //            error: function (data, errorCode, errorMessage) {
                        //                displayAlertDialog('Error in my.js.cmdChooseSelectedWorkflow(): ' + errorCode + ' ' + errorMessage);
                        //            }
                        //        });
                        //    });
                        //}

                        //populateFunctionalAreas();

                        //// Populate the year drop-down

                        //// ALTER THE NEW REQUEST FORM ACCORDING TO THE CONFIGURATION SETTINGS.
                        ////if (_type == 'supplemental') {
                        ////    // This is a supplemental request for budget request _reference, which is a guid.
                        ////    var html = '';
                        ////    html += '<br /><span style="font-size:200%;">&nbsp;&nbsp;&nbsp;Supplemental <strong>Budget Request</strong><br /><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-style:italic;">for ' + _reference + ' (xxxx)</span></span></span>';
                        ////    document.getElementById('spanNewRequestFormTitle').innerHTML = html;
                        ////    var html = '';
                        ////    html += '';
                        ////    html += '<button id="startWorkflowButton" onclick="cmdCreateSupplementalBudgetRequestAndStartWorkflow(\'' + _reference + '\');" class="BwButton200" title="Click here to Submit the supplemental request.">Submit</button>';
                        ////    html += '&nbsp;<button onclick="populateStartPageItem(\'divWelcome\', \'\', \'\');" class="BwButton200">Cancel</button>';
                        ////    html += '&nbsp;';
                        ////    document.getElementById('spanNewBudgetRequestPageButtons').innerHTML = html;


                        ////} else {
                        ////var html = '';
                        ////html += '<br /><span style="font-size:200%;">&nbsp;&nbsp;&nbsp;New <strong>Budget Request</strong><br /><span></span></span><br />';
                        ////document.getElementById('spanNewRequestFormTitle').innerHTML = html;
                        ////var html = '';
                        ////html += '';
                        ////var isSupplemental = 'false';
                        ////var relatedBudgetRequestId = '';
                        ////html += '<button id="startWorkflowButton" onclick="cmdCreateBudgetRequestAndStartWorkflow(\'' + isSupplemental + '\', \'' + relatedBudgetRequestId + '\');" class="BwButton200" title="Click here to Submit the request.">Submit</button>';
                        ////html += '&nbsp;<button onclick="populateStartPageItem(\'divWelcome\', \'\', \'\');" class="BwButton200">Cancel</button>';
                        ////html += '&nbsp;';
                        ////document.getElementById('spanNewBudgetRequestPageButtons').innerHTML = html;
                        ////}


                        //// Set the manager title.
                        //$('#spanRequestForm_ManagerTitle').html(newBudgetRequestManagerTitle);
                        //// Set if the details are required.
                        //if (requireRequestDetails == true) {
                        //    document.getElementById('spanNewRequestDetailsLabel').innerHTML = '<span class="xdlabel">Justification details:</span>&nbsp;<span style="color:red;font-size:medium;">*</span>';
                        //} else {
                        //    document.getElementById('spanNewRequestDetailsLabel').innerHTML = '<span class="xdlabel">Justification details:</span>';
                        //}
                        //// Set if the dates are required.
                        //if (requireStartEndDates == true) {
                        //    document.getElementById('spanNewRequestStartDateLabel').innerHTML = '<span class="xdlabel" style="white-space:nowrap;">Start date (estimated):&nbsp;</span><span style="color:red;font-size:medium;">*</span>';
                        //    document.getElementById('spanNewRequestEndDateLabel').innerHTML = '<span class="xdlabel" style="white-space:nowrap;">End date (estimated):&nbsp;</span><span style="color:red;font-size:medium;">*</span>';
                        //} else {
                        //    document.getElementById('spanNewRequestStartDateLabel').innerHTML = '<span class="xdlabel">Start date (estimated):</span>';
                        //    document.getElementById('spanNewRequestEndDateLabel').innerHTML = '<span class="xdlabel">End date (estimated):</span>';
                        //}
                        //// Set if the attachments are allowed.
                        //if (enableNewRequestAttachments == true) {
                        //    $('#trNewRequestAttachmentsSection').show();
                        //    //document.getElementById('trNewRequestAttachmentsSection').innerHTML = '<span class="xdlabel">Attachments:</span>&nbsp;<span style="color:red;font-size:medium;">*</span>';
                        //} else {
                        //    $('#trNewRequestAttachmentsSection').hide();
                        //    //document.getElementById('trNewRequestAttachmentsSection').innerHTML = '<span class="xdlabel">Attachments:</span>';
                        //}

                        //// Set if the attachments are allowed.
                        //if (enableNewRequestBarcodeAttachments == true) {
                        //    $('#trNewRequestBarcodeAttachmentsSection').show();
                        //    //document.getElementById('trNewRequestAttachmentsSection').innerHTML = '<span class="xdlabel">Attachments:</span>&nbsp;<span style="color:red;font-size:medium;">*</span>';
                        //} else {
                        //    $('#trNewRequestBarcodeAttachmentsSection').hide();
                        //    //document.getElementById('trNewRequestAttachmentsSection').innerHTML = '<span class="xdlabel">Attachments:</span>';
                        //}

                        //// Set if the recurring expenses is enabled.
                        ////if (recurringExpensesEnabled == true) {
                        ////$('#trNewRequestRecurringExpenseSection').show();
                        ////document.getElementById('cbNewRequestRecurringExpenseEnabled').checked = false; // Default to not selected.
                        //// Hook up the checkbox event. cbNewRequestRecurringExpenseEnabled.click
                        ////$('#cbNewRequestRecurringExpenseEnabled').click(function () {
                        ////    //displayAlertDialog('enable this section'); // color: #adadad;
                        ////    if (this.checked == true) {
                        ////        $('#trNewRequestQuoteSection').hide();

                        ////        //document.getElementById('spanNewRequestRecurringExpenseSectionTitle').style.color = 'black';
                        ////        var html = '';
                        ////        html += '<input id="cbNewRequestRecurringExpenseSubmitImmediately" type="checkbox" /><span style="font-size:10pt;">Submit the first budget request immediately.</span><br />';

                        ////        html += '<span style="font-size:10pt;">Reminder date:</span><br />';
                        ////        html += '<input type="text" id="dtRecurringExpenseReminderDate" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: left;" /><br />';
                        ////        //html += 'Justification details:<br />';
                        ////        //html += '<textarea id="strRecurringExpenseDetails" rows="1" style="WIDTH: 97%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;"></textarea><br />';
                        ////        //html += '<input id="cbNewRequestRecurringExpenseNotifyMeOnDateChanged" type="checkbox" />Notify me if anyone changes the date.<br />';
                        ////        html += '<span style="font-size:10pt;">You and the Manager will receive notifications prior to the reminder date so that you can initiate the next new request. Also, if anyone changes the date you will be notified.</span><br />';
                        ////        document.getElementById('spanNewRequestRecurringExpenseSecondSection').innerHTML = html;
                        ////        $('#dtRecurringExpenseReminderDate').datepicker(); // Hook up the date picker.
                        ////    } else {
                        ////        $('#trNewRequestQuoteSection').show();
                        ////        //document.getElementById('spanNewRequestRecurringExpenseSectionTitle').style.color = '#adadad';
                        ////        //var html = '';
                        ////        //html += 'Reminder date:<br />';
                        ////        //html += '<input type="text" id="dtRecurringExpenseReminderDate" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: left;" /><br />';
                        ////        //html += 'Justification details:<br />';
                        ////        //html += '<textarea id="strRecurringExpenseDetails" rows="1" style="WIDTH: 97%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;"></textarea><br />';
                        ////        //html += '<input id="cbNewRequestRecurringExpenseSubmitImmediately" type="checkbox" />Submit the first budget request immediately.<br />';
                        ////        //html += 'You and the Manager will receive notifications prior to the reminder date so that you can initiate the next new request.<br />';
                        ////        //html += '<input id="cbNewRequestRecurringExpenseNotifyMeOnDateChanged" type="checkbox" />Notify me if anyone changes the date.';
                        ////        //document.getElementById('spanNewRequestRecurringExpenseSecondSection').innerHTML = html;
                        ////        document.getElementById('spanNewRequestRecurringExpenseSecondSection').innerHTML = '';
                        ////    }




                        ////});
                        ////html += '<span id="spanRecurringExpensesChoiceOnFixedDates"><input type="radio" name="rbRecurringExpensesChoice" /><span>recurring on fixed dates</span></span><br />';
                        ////html += '<span id="spanRecurringExpensesChoiceOnATimePeriod"><input type="radio" name="rbRecurringExpensesChoice" /><span>recurring on a time period</span></span><br />';

                        ////} else {
                        ////    $('#trNewRequestRecurringExpenseSection').hide();
                        ////    //document.getElementById('trNewRequestAttachmentsSection').innerHTML = '<span class="xdlabel">Attachments:</span>';
                        ////}

                        //// Set if the quoting is enabled.
                        ////if (quotingEnabled == true) {
                        ////    $('#trNewRequestQuoteSection').show();
                        ////    document.getElementById('cbNewRequestQuoteEnabled').checked = false; // Default to not selected.
                        ////    // Hook up the checkbox event. cbNewRequestRecurringExpenseEnabled.click
                        ////    $('#cbNewRequestQuoteEnabled').click(function () {
                        ////        //displayAlertDialog('enable this section'); // color: #adadad;
                        ////        if (this.checked == true) {
                        ////            $('#trNewRequestRecurringExpenseSection').hide();

                        ////            var html = '';
                        ////            html += 'New <strong>Quote Request</strong>';
                        ////            document.getElementById('spanNewRequestFormTitle').innerHTML = html;

                        ////            ////document.getElementById('spanNewRequestRecurringExpenseSectionTitle').style.color = 'black';
                        ////            //var html = '';
                        ////            //html += '<input id="cbNewRequestRecurringExpenseSubmitImmediately" type="checkbox" /><span style="font-size:10pt;">Submit the first budget request immediately.</span><br />';

                        ////            //html += '<span style="font-size:10pt;">Reminder date:</span><br />';
                        ////            //html += '<input type="text" id="dtRecurringExpenseReminderDate" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: left;" /><br />';
                        ////            ////html += 'Justification details:<br />';
                        ////            ////html += '<textarea id="strRecurringExpenseDetails" rows="1" style="WIDTH: 97%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;"></textarea><br />';
                        ////            ////html += '<input id="cbNewRequestRecurringExpenseNotifyMeOnDateChanged" type="checkbox" />Notify me if anyone changes the date.<br />';
                        ////            //html += '<span style="font-size:10pt;">You and the Manager will receive notifications prior to the reminder date so that you can initiate the next new request. Also, if anyone changes the date you will be notified.</span><br />';
                        ////            //document.getElementById('spanNewRequestRecurringExpenseSecondSection').innerHTML = html;
                        ////            //$('#dtRecurringExpenseReminderDate').datepicker(); // Hook up the date picker.
                        ////        } else {
                        ////            $('#trNewRequestRecurringExpenseSection').show();

                        ////            // 







                        ////            var html = '';
                        ////            html += 'New <strong>Budget Request</strong>';
                        ////            html += '</span>';
                        ////            document.getElementById('spanNewRequestFormTitle').innerHTML = html;

                        ////            //document.getElementById('spanNewRequestRecurringExpenseSectionTitle').style.color = '#adadad';
                        ////            //var html = '';
                        ////            //html += 'Reminder date:<br />';
                        ////            //html += '<input type="text" id="dtRecurringExpenseReminderDate" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: left;" /><br />';
                        ////            //html += 'Justification details:<br />';
                        ////            //html += '<textarea id="strRecurringExpenseDetails" rows="1" style="WIDTH: 97%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;"></textarea><br />';
                        ////            //html += '<input id="cbNewRequestRecurringExpenseSubmitImmediately" type="checkbox" />Submit the first budget request immediately.<br />';
                        ////            //html += 'You and the Manager will receive notifications prior to the reminder date so that you can initiate the next new request.<br />';
                        ////            //html += '<input id="cbNewRequestRecurringExpenseNotifyMeOnDateChanged" type="checkbox" />Notify me if anyone changes the date.';
                        ////            //document.getElementById('spanNewRequestRecurringExpenseSecondSection').innerHTML = html;
                        ////            document.getElementById('spanNewRequestQuoteSecondSection').innerHTML = '';
                        ////        }




                        ////    });
                        ////    //html += '<span id="spanRecurringExpensesChoiceOnFixedDates"><input type="radio" name="rbRecurringExpensesChoice" /><span>recurring on fixed dates</span></span><br />';
                        ////    //html += '<span id="spanRecurringExpensesChoiceOnATimePeriod"><input type="radio" name="rbRecurringExpensesChoice" /><span>recurring on a time period</span></span><br />';

                        ////} else {
                        ////    $('#trNewRequestQuoteSection').hide();
                        ////    //document.getElementById('trNewRequestAttachmentsSection').innerHTML = '<span class="xdlabel">Attachments:</span>';
                        ////}


                        //renderLeftButtons('divNewRequestPageLeftButtons');



                        //// Now we can hook up the Participant text box for autocomplete.
                        //$("#txtProjectManagerName").autocomplete({
                        //    source: function (request, response) {
                        //        //weburl = _spPageContextInfo.siteAbsoluteUrl;
                        //        $.ajax({
                        //            url: webserviceurl + "/workflow/" + workflowAppId + "/participants/" + request.term,
                        //            dataType: "json",
                        //            success: function (data) {
                        //                var searchArray = [];
                        //                for (var i = 0; i < data.participants.length; i++) {
                        //                    searchArray[i] = data.participants[i].participant;
                        //                }
                        //                response(searchArray);
                        //            }
                        //        });
                        //    },
                        //    minLength: 1, // minLength specifies how many characters have to be typed before this gets invoked.
                        //    select: function (event, ui) {
                        //        //log(ui.item ? "Selected: " + ui.item.label : "Nothing selected, input was " + this.value);
                        //        //document.getElementById('btnSearch').disabled = false; // Enable the search button when there is valid content in it.
                        //    },
                        //    open: function () {
                        //        //$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
                        //        //document.getElementById('btnSearch').disabled = true; // Disable the search button until there is valid content in it.
                        //    },
                        //    close: function () {
                        //        //$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                        //        var projectManagerName = this.value.split('|')[0];
                        //        var projectManagerId = this.value.split('|')[1];
                        //        var projectManagerEmail = this.value.split('|')[2];

                        //        if (projectManagerName.indexOf('undefined') > -1) {
                        //            document.getElementById('txtProjectManagerName').value = '';
                        //            document.getElementById('txtProjectManagerId').value = '';
                        //            document.getElementById('txtProjectManagerEmail').value = '';
                        //        } else {
                        //            document.getElementById('txtProjectManagerName').value = projectManagerName; //this.value.split(' ')[0] + ' ' + this.value.split(' ')[1]; // Just shows the Loan Number parameter (removing the borrower name) so it fits in the text box.
                        //            document.getElementById('txtProjectManagerId').value = projectManagerId;
                        //            document.getElementById('txtProjectManagerEmail').value = projectManagerEmail;
                        //        }
                        //    }
                        //});

                        //monkeyPatchAutocomplete(); // This customizes the drop down when searching for users in the user text boxes.





















                    }






                    cursor.continue();
                }
            } catch (e) {
                console.log('In my.js.cmdRenderAndLoadNewRequestFormWithUnsubmittedRequest(). xyyyyy...' + e.message + ', ' + e.stack);
            }
        };
        //};
    } catch (e) {
        console.log('In my.js.cmdRenderAndLoadNewRequestFormWithUnsubmittedRequest().2: cccccc...' + e.message + ', ' + e.stack);
    }
}

//function cmdDisplayReassignUserTasksDialog(userId, userFriendlyName, userEmail, currentRole, logonType) {
//    try {
//        console.log('In cmdDisplayReassignUserTasksDialog().');
//        alert('In cmdDisplayReassignUserTasksDialog().');

//        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

//        $("#ReassignUserTasksDialog").dialog({
//            modal: true,
//            resizable: false,
//            closeText: "Cancel",
//            closeOnEscape: true, // Hit the ESC key to hide! Yeah!
//            //title: 'Reassign ' + userFriendlyName + '\'s tasks in this workflow.',
//            width: "570px",
//            dialogClass: "no-close", // No close button in the upper right corner.
//            hide: false, // This means when hiding just disappear with no effects.
//            //close: function (event,ui) {
//            //    // Unbind the click event. This is important so it doesn't fire multiple times.
//            //    $('#btnReassignUserTasksDialogReassignTasks').unbind('click', function () {
//            //        ReassignParticipantResponsibilities(userId);
//            //    });
//            //},
//            open: function (event, ui) {
//                try {
//                    $('.ui-widget-overlay').bind('click', function () { $("#ReassignUserTasksDialog").dialog('close'); });

//                    //// Bind the click event!
//                    //$('#btnReassignUserTasksDialogReassignTasks').bind('click', function () {
//                    //    ReassignParticipantResponsibilities(userId);
//                    //});

//                    //document.getElementById('btnReassignUserTasksDialogReassignTasks').onclick = 'ReassignParticipantResponsibilities(' + userId + ');';

//                    // Display the details on the dialog.
//                    var data = [];
//                    data = {
//                        bwParticipantId: userId,
//                        bwWorkflowAppId: workflowAppId
//                    };
//                    var operationUri = webserviceurl + "/bwworkflow/itemizeparticipantdependencies"; //removeaparticipant";
//                    $.ajax({
//                        url: operationUri,
//                        type: "POST", timeout: ajaxTimeout,
//                        data: data,
//                        headers: {
//                            "Accept": "application/json; odata=verbose"
//                        },
//                        success: function (data) {
//                            try {
//                                // Show or hide the replacement user selection box depening if there are any dependencies (tasks or functional areas).
//                                if (data.message != 'SUCCESS') {
//                                    displayAlertDialog(JSON.stringify(data)); // Todd: put a good message here.
//                                } else {
//                                    if (data.NumberOfFunctionalAreas == 0 && data.NumberOfIncompleteTasks == 0 && data.NumberOfIncompleteBudgetRequestsSpecifiedAsManager == 0) {
//                                        // There are no dependencies.
//                                        var html = '';
//                                        html += 'This user has no Tasks, is not an approver for any Functional Areas, and is not a Manager for any Budget Requests.xcx1';
//                                        document.getElementById('spanReassignUserTasksDialogUserDependencyDetails').innerHTML = html;
//                                        // Hide the user selection box.
//                                        document.getElementById('spanReassignUserTasksDialogChooseAUserSection').style.display = 'none';
//                                        // Hide the Delete button. 
//                                        document.getElementById('spanReassignUserTasksDialogReassignTasksButton').style.display = 'none';
//                                        // Hide the "Email me" checkbox. 
//                                        document.getElementById('spanReassignUserTasksDialogEmailMessage').style.display = 'none';


//                                        //var dialogButtons = $('#ReassignUserTasksDialog').dialog('option', 'buttons');
//                                        //$.each(dialogButtons, function (buttonIndex, button) {
//                                        //    if (button.id === 'btnReassignUserTasksAndReplaceWithNewUser') {
//                                        //        button.text = 'Reassign ' + userFriendlyName;
//                                        //        button.disabled = false;
//                                        //    }
//                                        //})
//                                        //$("#ReassignUserTasksDialog").dialog('option', 'buttons', dialogButtons);
//                                    } else {

//                                        // Show the user selection box.
//                                        document.getElementById('spanReassignUserTasksDialogChooseAUserSection').style.display = 'inline';
//                                        // Show the Delete button. 
//                                        document.getElementById('spanReassignUserTasksDialogReassignTasksButton').style.display = 'inline';
//                                        // Show the "Email me" checkbox. 
//                                        document.getElementById('spanReassignUserTasksDialogEmailMessage').style.display = 'inline';

//                                        try {
//                                            document.getElementById('txtReassignUserTasksDialogUserToReplaceFriendyName').value = ''; // = ''; // Clear the text box.
//                                            document.getElementById('txtReassignUserTasksDialogUserToReplaceId').value = '';
//                                            document.getElementById('txtReassignUserTasksDialogUserToReplaceEmail').value = '';
//                                        } catch (e) {
//                                            displayAlertDialog('Error:' + e.message + e.stack);
//                                        }

//                                        // There ARE dependencies and we need to assign a replacement user.
//                                        var html = '';
//                                        html += 'When this users responsibilities are reassigned, the following will need to be reassigned to a new user (alternatively, you can change them one at a time):';
//                                        html += '<ul>';
//                                        html += '<li style="color:red;"><span style="color:black;">' + data.NumberOfFunctionalAreas + ' Financial Area(s)</span></li>';
//                                        html += '<li style="color:red;"><span style="color:black;">' + data.NumberOfIncompleteTasks + ' incomplete Task(s)</span></li>';
//                                        html += '<li style="color:red;"><span style="color:black;">' + data.NumberOfIncompleteBudgetRequestsSpecifiedAsManager + ' incomplete Budget Request(s) where specified as the Manager</span></li>';
//                                        html += '</ul>';
//                                        document.getElementById('spanReassignUserTasksDialogUserDependencyDetails').innerHTML = html;
//                                        // 
//                                        var html = '';
//                                        html += 'Select the user to take over these tasks from <span style="white-space:nowrap;"><i>' + userFriendlyName + ' (' + userEmail + ')</i></span>';
//                                        document.getElementById('spanReassignUserTasksDialogUserToReassignFriendlyName').innerHTML = html;

//                                        //
//                                        var html = '';
//                                        html += '<div id="btnReassignUserTasksDialogReassignTasks" class="divSignInButton" onclick="ReassignParticipantResponsibilities(\'' + userId + '\',\'' + userFriendlyName + '\',\'' + userEmail + '\');" style="width:90%;text-align:center;line-height:0.8em;font-weight:bold;word-wrap:break-word;">';
//                                        //html += 'Replace ' + userFriendlyName + ' with the new user'; // Got rid of this until we get it to wrap in the div properly.
//                                        html += 'Reassign Responsibilities (#)';
//                                        html += '</div>';
//                                        document.getElementById('spanReassignUserTasksDialogReassignTasksButton').innerHTML = html;

//                                        // Change the button text.
//                                        //$('#btnReassignUserTasksDialogReassignTasks').innerHTML = 'Replace ' + userFriendlyName + ' with the new user';
//                                        //var dialogButtons = $('#ReassignUserTasksDialog').dialog('option', 'buttons');
//                                        //$.each(dialogButtons, function (buttonIndex, button) {
//                                        //    if (button.id === 'btnReassignUserTasksAndReplaceWithNewUser') {
//                                        //        button.text = 'Replace ' + userFriendlyName + ' with the new user';
//                                        //        button.disabled = false;
//                                        //        button.style = 'color:red;';
//                                        //    }
//                                        //})
//                                        //$("#ReassignUserTasksDialog").dialog('option', 'buttons', dialogButtons);
//                                    }
//                                }
//                            } catch (e) {
//                                displayAlertDialog('Error in my.js.cmdDisplayReassignUserTasksDialog():1: ' + e.message + ', ' + e.stack);
//                            }
//                        },
//                        error: function (data, errorCode, errorMessage) {
//                            //handleExceptionWithAlert('Error in Start.js.displayConnectedWorkflows()', '1:' + errorCode + ', ' + errorMessage);
//                            displayAlertDialog('Error in my.js.cmdDisplayReassignUserTasksDialog().itemizeparticipantdependencies: ' + errorMessage);
//                        }
//                    });
//                } catch (e) {

//                    displayAlertDialog('Error in my.js.cmdDisplayReassignUserTasksDialog():2: ' + e.message + ', ' + e.stack);
//                }
//            }
//            //buttons: {
//            //    "Reassign and replace with the new user": {
//            //        text: 'Reassign Tasks',
//            //        id: 'btnReassignAParticipantAndReplaceWithNewUser',
//            //        disabled: 'true',
//            //        click: function () {
//            //            var justDeleteAlready = true;
//            //            try {
//            //                var newUserFriendlyName = document.getElementById('txtReassignUserTasksDialogUserToReplaceFriendyName').value;
//            //                justDeleteAlready = false;
//            //            } catch (e) {
//            //                // No need to catch, just checking if it exists!
//            //            }
//            //            if (justDeleteAlready == false) {
//            //                // Here we assign the new user.
//            //                var proceed = confirm('This action cannot be undone.\n\n\nClick the OK button to proceed...');
//            //                if (proceed) {
//            //                    cmdDeleteParticipantAndAssignANewUser(userId);
//            //                    $(this).dialog("close");
//            //                }
//            //            } else {
//            //                // A new user does not have to be assigned since there are no dependencies.
//            //                var proceed = confirm('This action cannot be undone.\n\n\nClick the OK button to proceed...');
//            //                if (proceed) {
//            //                    cmdDeleteParticipant(userId);
//            //                    $(this).dialog("close");
//            //                }
//            //            }
//            //        }
//            //    },
//            //    "Cancel": function () {
//            //        $(this).dialog("close");
//            //    }
//            //},
//            //open: function () {

//            //}
//        });

//        // Hide the title bar.
//        $("#ReassignUserTasksDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
//        // Set the title.
//        document.getElementById('spanReassignUserTasksDialogTitle').innerHTML = 'Reassign ' + userFriendlyName + '\'s responsibilities in this organization.';

//    } catch (e) {
//        displayAlertDialog('Error in my.js.cmdDisplayReassignUserTasksDialog():3: ' + e.message + ', ' + e.stack);

//    }

//}



//function loadXslFiles() {
//    var xslFiles = [];
//    xslFiles = new Array();
//    xslFiles.push(['UnsubmittedBudgetRequest']); // The file extension of .xsl is appended below.
//    xslFiles.push(['UnsubmittedQuoteRequest']);
//    xslFiles.push(['UnsubmittedReimbursementRequest']);
//    xslFiles.push(['UnsubmittedRecurringExpense']);

//    xslFiles.push(['UnsubmittedBudgetRequestPrintableHtml']); // These are the printable xsl files.
//    xslFiles.push(['UnsubmittedQuoteRequestPrintableHtml']);
//    xslFiles.push(['UnsubmittedReimbursementRequestPrintableHtml']);
//    xslFiles.push(['UnsubmittedRecurringExpensePrintableHtml']);

//    var request = indexedDB.open(indexDBName, dbVersion);

//    request.onerror = function (event) {
//        console.log("In getXsltAndStoreInDatabase(). Erroropening IndexedDB database1. errorCode: " + event.target.errorCode);
//    };

//    request.onsuccess = function (event) {
//        var db = event.target.result;

//        db.onerror = function (e) {
//            console.log('ERRRRRRRRRRRRRRRRRRRR');
//        };

//        for (var i = 0; i < xslFiles.length; i++) {
//            getXsltAndStoreInDatabase(db, xslFiles[i]);
//        }
//    }
//}

//// Check if we have created the indexDB. If not, load the XSL files that we will need in case of losing the network connection.
//function getXsltAndStoreInDatabase(db, xsltDatabaseKey) {
//    var xhr = new XMLHttpRequest(), blob;
//    xhr.onreadystatechange = function () {
//        try {
//            if (xhr.status == 200 && xhr.readyState == 4) {

//                blob = xhr.response;

//                console.log('Attempting to put Xsl file "' + xsltDatabaseKey + '" into IndexedDB. blob length: ' + blob.length);
//                //var data = {
//                //    xsltFileName: xsltDatabaseKey,
//                //    xslFile: blob.toString()
//                //};

//                var key = '' + xsltDatabaseKey;

//                var put = db.transaction("objectStoreCachedXsltFiles", "readwrite").objectStore("objectStoreCachedXsltFiles").add(blob, key).onsuccess = function (e) {

//                    // TODD: I CANNOT KEY THE KEY TO WORK!!!!!!!!!!!!!!!!!!!!!!!!!!!!! I have spent several hours, so leaving it at this for now.
//                    console.log('SUCCESSSSSSSSSSSSSS: Stored ' + xsltDatabaseKey);

//                };

//            }
//        } catch (e) {
//            console.log('Error in getXsltAndStoreInDatabase.xhr.onreadystatechange(): ' + e.message + ', ' + e.stack);
//        }
//    };
//    var fileUrl = globalUrlPrefix + globalUrlForWebServices + '/views/' + xsltDatabaseKey + '.xsl'; //CreateArEditForm.xsl';
//    xhr.open("GET", fileUrl, true); // last parameter is async.
//    xhr.responseType = "text";
//    xhr.send();
//}

//function ReassignParticipantResponsibilities(userId, userFriendlyName, userEmail) {
//    try {
//        console.log('In ReassignParticipantResponsibilities().');

//        //var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
//        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
//        var workflowAppTitle = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTitle');
//        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
//        var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
//        var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

//        //displayAlertDialog('ReassignParticipantResponsibilities() userId: ' + userId);

//        var newUserFriendlyName = document.getElementById('txtReassignUserTasksDialogUserToReplaceFriendyName').value;
//        var newUserId = document.getElementById('txtReassignUserTasksDialogUserToReplaceId').value;
//        var newUserEmail = document.getElementById('txtReassignUserTasksDialogUserToReplaceEmail').value;
//        var emailTheDetails = document.getElementById('cbReassignUserTasksDialogEmailMessage').checked;


//        //displayAlertDialog('ReassignParticipantResponsibilities() emailTheJustification details: ' + emailTheDetails); // 'true', 'false'.


//        if (newUserFriendlyName == '') {
//            displayAlertDialog('Please select the user to take over these responsibilities.');
//        } else {

//            var data = [];
//            data = {
//                oldUserId: userId,
//                oldUserFriendlyName: userFriendlyName,
//                oldUserEmail: userEmail,
//                ModifiedById: participantId,
//                ModifiedByFriendlyName: participantFriendlyName,
//                ModifiedByEmail: participantEmail,
//                bwWorkflowAppId: workflowAppId,
//                newUserFriendlyName: newUserFriendlyName,
//                newUserId: newUserId,
//                newUserEmail: newUserEmail,
//                emailTheJustificationDetails: emailTheDetails,
//                workflowAppTitle: workflowAppTitle
//            };

//            //displayAlertDialog('calling reassigntoanexistingparticipant with:' + JSON.stringify(data));

//            var operationUri = webserviceurl + "/bwworkflow/reassigntoanexistingparticipant";
//            $.ajax({
//                url: operationUri,
//                type: "POST", timeout: ajaxTimeout,
//                data: data,
//                headers: {
//                    "Accept": "application/json; odata=verbose"
//                },
//                success: function (data) {

//                    $("#ReassignUserTasksDialog").dialog('close');
//                    displayAlertDialog(data);
//                    populateStartPageItem('divParticipants', 'Reports', '');

//                },
//                error: function (data, errorCode, errorMessage) {
//                    displayAlertDialog('Error in my.js.ReassignParticipantResponsibilities(): ' + errorMessage);
//                }
//            });
//        }
//    } catch (e) {
//        console.log('Exception in ReassignParticipantResponsibilities(): ' + e.message + ', ' + e.stack);
//    }
//}






//function cmdDisplayChangeUserRoleDialog(userId, userFriendlyName, userEmail, currentRole, logonType) {
//    $("#ChangeUserRoleDialog").dialog({
//        modal: true,
//        resizable: false,
//        closeText: "Cancel",
//        closeOnEscape: true, // Hit the ESC key to hide! Yeah!
//        //title: 'Change the role for ' + userFriendlyName + '...',
//        width: "700px",
//        dialogClass: "no-close", // No close button in the upper right corner.
//        hide: false, // This means when hiding just disappear with no effects.
//        open: function (event, ui) {
//            $('.ui-widget-overlay').bind('click', function () { $("#ChangeUserRoleDialog").dialog('close'); });
//            $('#btnUserRoleDialogChangeRole').bind('click', function () {
//                //debugger;
//                cmdChangeUserRoleAndSendEmail(userId, userFriendlyName, userEmail, logonType);
//                $("#ChangeUserRoleDialog").dialog('close');
//            });
//            // 
//            //var invitationUrl = globalUrlPrefix + globalUrl + '?invitation=' + invitationId;
//            ////$('#invitationLink2').text(invitationUrl);
//            //document.getElementById('textareaViewInvitationDialogInvitationDetails').innerHTML = invitationUrl;
//            //document.getElementById('textareaViewInvitationDialogInvitationDetails').blur();
//        }
//        //buttons: {
//        //    "Change Role": {
//        //        text: 'Change Role',
//        //        id: 'btnUserRoleDialogChangeRole',
//        //        disabled: 'true',
//        //        style: 'color:red;',
//        //        click: function () {
//        //            cmdChangeUserRoleAndSendEmail(userId, userFriendlyName, userEmail, logonType);
//        //            $(this).dialog("close");
//        //        }
//        //    },
//        //    "Close": function () {
//        //        $(this).dialog("close");
//        //    }
//        //}
//    });
//    // Hide the title bar.
//    $("#ChangeUserRoleDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
//    // Set the title.
//    document.getElementById('spanChangeUserRoleDialogTitle').innerHTML = 'Change the security role for ' + userFriendlyName + '.';

//    // Make sure the send message checkbox is not selected to begin with.
//    document.getElementById('cbUserRoleDialogEmailMessage').removeAttribute('checked', '');
//    // Set the radio button selected to the current value.
//    var roles = document.getElementsByName('rbChangeUserRole');
//    for (var i = 0; i < roles.length; i++) {
//        if (roles[i].value == currentRole) {
//            roles[i].checked = true;
//        }
//    }
//    // Checkbox message customized with user name.
//    var msg = 'Send email notification to ' + userFriendlyName + ' (' + userEmail + '). You can include an additional message as well:';
//    $('#spanUserRoleDialogEmailMessageText').text(msg);
//    // Event listener for the email checkbox.
//    $('#cbUserRoleDialogEmailMessage').click(function (error) {
//        //displayAlertDialog('it was clicked');
//        var _checked = document.getElementById('cbUserRoleDialogEmailMessage').checked;
//        if (_checked == true) {
//            var dialogButtons = $('#ChangeUserRoleDialog').dialog('option', 'buttons');
//            $.each(dialogButtons, function (buttonIndex, button) {
//                if (button.id === 'btnUserRoleDialogChangeRole') {
//                    button.text = 'Change Role and Send Email';
//                    button.style = 'color:red;';
//                }
//            })
//            $("#ChangeUserRoleDialog").dialog('option', 'buttons', dialogButtons);
//        } else {
//            var dialogButtons = $('#ChangeUserRoleDialog').dialog('option', 'buttons');
//            $.each(dialogButtons, function (buttonIndex, button) {
//                if (button.id === 'btnUserRoleDialogChangeRole') {
//                    button.text = 'Change Role';
//                    button.style = 'color:red;';
//                }
//            })
//            $("#ChangeUserRoleDialog").dialog('option', 'buttons', dialogButtons);
//        }
//    });
//    // Event listener for the radio buttons.
//    $("input:radio[name=rbChangeUserRole]").click(function (error) {
//        if (this.value == currentRole) {
//            // Make sure the button is disabled.
//            var dialogButtons = $('#ChangeUserRoleDialog').dialog('option', 'buttons');
//            $.each(dialogButtons, function (buttonIndex, button) {
//                if (button.id === 'btnUserRoleDialogChangeRole') {
//                    button.disabled = true;
//                }
//            })
//            $("#ChangeUserRoleDialog").dialog('option', 'buttons', dialogButtons);
//        } else {
//            // Enable the Change Role button.
//            var dialogButtons = $('#ChangeUserRoleDialog').dialog('option', 'buttons');
//            $.each(dialogButtons, function (buttonIndex, button) {
//                if (button.id === 'btnUserRoleDialogChangeRole') {
//                    button.disabled = false;
//                }
//            })
//            $("#ChangeUserRoleDialog").dialog('option', 'buttons', dialogButtons);
//        }
//    });
//}

//function cmdDisplayDeleteUserDialog(userId, userFriendlyName, userEmail, currentRole, logonType) {
//    try {
//        //document.getElementById('txtDeleteAParticipantDialogUserToReplaceFriendyName').value = '';
//        //document.getElementById('txtDeleteAParticipantDialogUserToReplaceId').value = '';
//        //document.getElementById('txtDeleteAParticipantDialogUserToReplaceEmail').value = '';
//        $("#DeleteAParticipantDialog").dialog({
//            modal: true,
//            resizable: false,
//            closeText: "Cancel",
//            closeOnEscape: true, // Hit the ESC key to hide! Yeah!
//            //title: 'Remove ' + userFriendlyName + ' from this workflow.',
//            width: "570px",
//            dialogClass: "no-close", // No close button in the upper right corner.
//            hide: false, // This means when hiding just disappear with no effects.
//            open: function () {
//                try {
//                    $('.ui-widget-overlay').bind('click', function () { $("#DeleteAParticipantDialog").dialog('close'); });


//                    var data = [];
//                    data = {
//                        bwParticipantId: userId,
//                        bwWorkflowAppId: workflowAppId
//                    };
//                    var operationUri = webserviceurl + "/bwworkflow/itemizeparticipantdependencies"; //removeaparticipant";
//                    $.ajax({
//                        url: operationUri,
//                        type: "POST", timeout: ajaxTimeout,
//                        data: data,
//                        headers: {
//                            "Accept": "application/json; odata=verbose"
//                        },
//                        success: function (data) {
//                            try {
//                                // Show or hide the replacement user selection box depening if there are any dependencies (tasks or functional areas).
//                                if (data.message != 'SUCCESS') {
//                                    displayAlertDialog(JSON.stringify(data)); // Todd: put a good message here.
//                                } else {
//                                    if (data.NumberOfFunctionalAreas == 0 && data.NumberOfIncompleteTasks == 0 && data.NumberOfIncompleteBudgetRequestsSpecifiedAsManager == 0) {
//                                        // There are no dependencies.
//                                        var html = '';
//                                        html += 'This user has no Tasks, is not an approver for any Functional Areas, and is not a Manager for any Budget Requests.xcx2';
//                                        document.getElementById('spanDeleteAParticipantDialogUserDependencyDetails').innerHTML = html;
//                                        // Hide the user selection box.
//                                        document.getElementById('spanDeleteAParticipantDialogChooseAUserSection').innerHTML = '';
//                                        // Hide the Delete button. 
//                                        //document.getElementById('divDeleteAParticipantDialogReassignTasks').style.display = 'none';

//                                        // Bind the click event! added 3-1-2020
//                                        $('#divDeleteAParticipantDialogReassignTasks').bind('click', function () {
//                                            DeleteParticipantWhoHasNoResponsibilities(userId);
//                                        });

//                                        // Change the button text.
//                                        //var dialogButtons = $('#DeleteAParticipantDialog').dialog('option', 'buttons');
//                                        //$.each(dialogButtons, function (buttonIndex, button) {
//                                        //    if (button.id === 'btnDeleteAParticipantAndReplaceWithNewUser') {
//                                        //        button.text = 'Delete ' + userFriendlyName;
//                                        //        button.disabled = false;
//                                        //    }
//                                        //})
//                                        //$("#DeleteAParticipantDialog").dialog('option', 'buttons', dialogButtons);
//                                    } else {
//                                        // There ARE dependencies and we need to assign a replacement user.
//                                        var html = '';
//                                        html += 'When this user is removed, the following will need to be re-assigned to a new user (or you may be able to go back and change them one at a time):';
//                                        html += '<ul>';
//                                        html += '<li style="color:red;"><span style="color:black;">' + data.NumberOfFunctionalAreas + ' Financial Area(s)</span></li>';
//                                        html += '<li style="color:red;"><span style="color:black;">' + data.NumberOfIncompleteTasks + ' incomplete Task(s)</span></li>';
//                                        html += '<li style="color:red;"><span style="color:black;">' + data.NumberOfIncompleteBudgetRequestsSpecifiedAsManager + ' incomplete Budget Request(s) where specified as the Manager</span></li>';
//                                        html += '</ul>';
//                                        document.getElementById('spanDeleteAParticipantDialogUserDependencyDetails').innerHTML = html;
//                                        // 
//                                        var html = '';
//                                        html += 'Select the user to take over these tasks from <span style="white-space:nowrap;"><i>' + userFriendlyName + ' (' + userEmail + ')</i></span>';
//                                        document.getElementById('spanDeleteAParticipantDialogUserToDeleteFriendlyName').innerHTML = html;
//                                        // Change the button text.
//                                        $('#divDeleteAParticipantDialogReassignTasks').innerHTML = 'Replace ' + userFriendlyName + ' with the new user';
//                                        // Bind the click event!
//                                        $('#divDeleteAParticipantDialogReassignTasks').bind('click', function () {
//                                            ReassignParticipantResponsibilitiesAndDelete(userId);
//                                        });

//                                        //// Change the button text.
//                                        //var dialogButtons = $('#DeleteAParticipantDialog').dialog('option', 'buttons');
//                                        //$.each(dialogButtons, function (buttonIndex, button) {
//                                        //    if (button.id === 'btnDeleteAParticipantAndReplaceWithNewUser') {
//                                        //        button.text = 'Replace ' + userFriendlyName + ' with the new user';
//                                        //        button.disabled = false;
//                                        //        button.style = 'color:red;';
//                                        //    }
//                                        //})
//                                        //$("#DeleteAParticipantDialog").dialog('option', 'buttons', dialogButtons);
//                                    }
//                                }
//                            } catch (e) {
//                                displayAlertDialog('Error in my.js.cmdDisplayDeleteUserDialog():1: ' + e.message);

//                            }
//                        },
//                        error: function (data, errorCode, errorMessage) {
//                            //handleExceptionWithAlert('Error in Start.js.displayConnectedWorkflows()', '1:' + errorCode + ', ' + errorMessage);
//                            displayAlertDialog('Error in my.js.cmdDisplayDeleteUserDialog().itemizeparticipantdependencies: ' + errorMessage);
//                        }
//                    });
//                } catch (e) {

//                    displayAlertDialog('Error in my.js.cmdDisplayDeleteUserDialog():2x: ' + e.message + ', ' + e.stack);
//                }
//            }
//        });

//        $('.ui-widget-overlay').bind('click', function () { $("#DeleteAParticipantDialog").dialog('close'); }); // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.

//        // Hide the title bar.
//        $("#DeleteAParticipantDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
//        // Set the title.
//        document.getElementById('spanDeleteAParticipantDialogTitle').innerHTML = 'Remove ' + userFriendlyName + ' from this workflow.';

//        //// Bind the click event!
//        //$('#divDeleteAParticipantDialogReassignTasks').bind('click', function () {
//        //    DeleteParticipantWhoHasNoResponsibilities(userId);
//        //});


//    } catch (e) {
//        displayAlertDialog('Error in my.js.cmdDisplayDeleteUserDialog():2: ' + e.message + e.stack);
//    }
//}

function cmdDeleteParticipantAndAssignANewUser(userId) {
    var newUserFriendlyName = document.getElementById('txtDeleteAParticipantDialogUserToReplaceFriendyName').value;
    var newUserId = document.getElementById('txtDeleteAParticipantDialogUserToReplaceId').value;
    var newUserEmail = document.getElementById('txtDeleteAParticipantDialogUserToReplaceEmail').value;
    if (newUserFriendlyName != '') {
        var data = [];
        data = {
            oldUserId: userId,
            ModifiedById: participantId,
            ModifiedByFriendlyName: participantFriendlyName,
            ModifiedByEmail: participantEmail,
            bwWorkflowAppId: workflowAppId,
            newUserFriendlyName: newUserFriendlyName,
            newUserId: newUserId,
            newUserEmail: newUserEmail
        };
        var operationUri = webserviceurl + "/bwworkflow/removeaparticipantandreassigntoanewuser";
        $.ajax({
            url: operationUri,
            type: "POST", timeout: ajaxTimeout,
            data: data,
            headers: {
                "Accept": "application/json; odata=verbose"
            },
            success: function (data) {
                displayAlertDialog(data);
                populateStartPageItem('divParticipants', 'Reports', '');

            },
            error: function (data, errorCode, errorMessage) {
                //handleExceptionWithAlert('Error in Start.js.displayConnectedWorkflows()', '1:' + errorCode + ', ' + errorMessage);
                displayAlertDialog('Error in my.js.cmdDeleteParticipantAndAssignANewUser(): ' + errorMessage);
            }
        });
    } else {
        displayAlertDialog('Error in my.js.cmdDeleteParticipantAndAssignANewUser(): newUserFriendlyName = ' + newUserFriendlyName);
    }
}

function cmdDeleteParticipant(userId) {
    var data = [];
    data = {
        oldUserId: userId,
        bwWorkflowAppId: workflowAppId
    };
    var operationUri = webserviceurl + "/bwworkflow/removeaparticipant";
    $.ajax({
        url: operationUri,
        type: "POST", timeout: ajaxTimeout,
        data: data,
        headers: {
            "Accept": "application/json; odata=verbose"
        },
        success: function (data) {
            displayAlertDialog(data);
            populateStartPageItem('divParticipants', 'Reports', '');

        },
        error: function (data, errorCode, errorMessage) {
            //handleExceptionWithAlert('Error in Start.js.displayConnectedWorkflows()', '1:' + errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in my.js.cmdDeleteParticipant(): ' + errorMessage);
        }
    });
}

//function cmdChangeUserRoleAndSendEmail(userId, userFriendlyName, userEmail, logonType) {
//    try {
//        console.log('In cmdChangeUserRoleAndSendEmail(). userId: ' + userId + ', userFriendlyName: ' + userFriendlyName + ', userEmail: ' + userEmail + ', logonType: ' + logonType);
//        //displayAlertDialog('In cmdChangeUserRoleAndSendEmail(). userId: ' + userId + ', userFriendlyName: ' + userFriendlyName + ', userEmail: ' + userEmail + ', logonType: ' + logonType);
//        var thiz = this;

//        //var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
//        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
//        var workflowAppTitle = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTitle');
//        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
//        var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
//        var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

//        var sendEmailNotification = document.getElementById('cbUserRoleDialogEmailMessage').checked; // This returns true or false.
//        var emailNotificationAdditionalMessage = document.getElementById('txtUserRoleDialogEmailMessage').textContent;
//        var newRole;
//        var roles = document.getElementsByName('rbChangeUserRole');
//        for (var i = 0; i < roles.length; i++) {
//            if (roles[i].checked) newRole = roles[i].value;
//        }
//        var data = [];
//        data = {
//            sendEmailNotification: sendEmailNotification,
//            emailNotificationAdditionalMessage: emailNotificationAdditionalMessage,
//            bwWorkflowAppId: workflowAppId,
//            bwWorkflowAppTitle: workflowAppTitle,
//            bwParticipantId: userId,
//            bwParticipantFriendlyName: userFriendlyName,
//            bwParticipantEmail: userEmail,
//            bwParticipantLogonType: logonType,
//            bwParticipantRole: newRole,
//            ModifiedById: participantId,
//            ModifiedByFriendlyName: participantFriendlyName,
//            ModifiedByEmail: participantEmail
//        };
//        var operationUri = webserviceurl + "/bwparticipant/updateuserrole";
//        $.ajax({
//            url: operationUri,
//            type: "POST", timeout: ajaxTimeout,
//            data: data,
//            headers: {
//                "Accept": "application/json; odata=verbose"
//            },
//            success: function (data) {
//                try {
//                    displayAlertDialog(data);
//                    //window.location = 'my.html?logontype=' + participantLogonType; // This gets rid of the query string values.
//                    //renderWelcomeScreen();

//                    //alert('xcx124258');
//                    //populateStartPageItem('divParticipants', 'Reports', ''); // Refresh the screen.

//                    //RenderContentForInnerLeftMenuButtons('', 'PARTICIPANTS');

//                    //this.renderParticipantsEditor();
//                    $('.bwCircleDialog').bwCircleDialog('hideAndDestroyCircleDialog');
//                    $("#divBwParticipantsEditor").bwParticipantsEditor({ store: null }); // Clear the data to force the widget to reload the data.
//                    $("#divBwParticipantsEditor").bwParticipantsEditor('loadAndRenderParticipantsEditor');

//                } catch (e) {
//                    console.log('Exception in cmdChangeUserRoleAndSendEmail():2: ' + e.message + ', ' + e.stack);
//                    displayAlertDialog('Exception in cmdChangeUserRoleAndSendEmail():2: ' + e.message + ', ' + e.stack);
//                }
//            },
//                    error: function (data, errorCode, errorMessage) {
//                        console.log('Error in my.js.cmdChangeUserRoleAndSendEmail(): ' + errorMessage + ' ' + JSON.stringify(data));
//                        displayAlertDialog('Error in my.js.cmdChangeUserRoleAndSendEmail(): ' + errorMessage + ' ' + JSON.stringify(data));
//                //WriteToErrorLog('Error in InitBudgetRequest.js.cmdCreateBudgetRequest()', 'Error creating the budget request in budgetrequests library: ' + errorCode + ', ' + errorMessage);
//            }
//        });
//    } catch (e) {
//        console.log('Exception in cmdChangeUserRoleAndSendEmail(): ' + e.message + ', ' + e.stack);
//        displayAlertDialog('Exception in cmdChangeUserRoleAndSendEmail(): ' + e.message + ', ' +e.stack);
//    }
//}

function cmdDisplayPeoplePickerDialog(friendlyNameSourceField, idSourceField, emailSourceField, buttonToEnable) {
    try {
        console.log('In cmdDisplayPeoplePickerDialog().');

        $('#txtPeoplePickerDialogSearchBox').empty(); // Clear the search text box.
        $("#PeoplePickerDialog").dialog({
            modal: true,
            resizable: false,
            closeText: "Cancel",
            closeOnEscape: true, // Hit the ESC key to hide! Yeah!
            //title: "Select a person...", //"Enter your early adopter code...",
            width: "570px",
            dialogClass: "no-close", // No close button in the upper right corner.
            hide: false, // This means when hiding just disappear with no effects.
            open: function (event, ui) { $('.ui-widget-overlay').bind('click', function () { $("#PeoplePickerDialog").dialog('close'); }); } // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.
        });
        $("#PeoplePickerDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

        $('#spanPeoplePickerDialogTitle').html('Select a person...');

        // Now we can hook up the Participant text box for autocomplete.
        $("#txtPeoplePickerDialogSearchBox").autocomplete({
            source: function (request, response) {
                if (request.term == '') {
                    renderAllParticipantsInThePeoplePicker(); // Nothing is in the search box, so show all participants.
                } else {
                    $.ajax({
                        //url: appweburl + "/tenant/" + tenantId + "/participants/" + request.term,
                        url: webserviceurl + "/workflow/" + workflowAppId + "/participants/" + request.term,
                        dataType: "json",
                        success: function (data) {
                            $('#spanPeoplePickerParticipantsList').empty();
                            var html = '';
                            if (data.participants.length > 0) {
                                //var searchArray = [];
                                for (var i = 0; i < data.participants.length; i++) {
                                    //searchArray[i] = data.participants[i].participant;
                                    //var strParticipant = '<a href="">' + data.participants[i].participant.split('|')[0] + ' <i>(' + data.participants[i].participant.split('|')[2] + ')</i></a>';

                                    //html += '<a href="javascript:cmdReturnParticipantIdToField(\'' + friendlyNameSourceField + '\', \'' + idSourceField + '\', \'' + emailSourceField + '\', \'' + data.participants[i].participant.split('|')[0] + '\', \'' + data.participants[i].participant.split('|')[1] + '\', \'' + data.participants[i].participant.split('|')[2] + '\', \'' + buttonToEnable + '\');">' + data.participants[i].participant.split('|')[0] + '&nbsp;&nbsp;<i>(' + data.participants[i].participant.split('|')[2] + ')</i></a>';
                                    html += '<a href="javascript:$(\'.bwCoreComponent\').bwCoreComponent(\'cmdReturnParticipantIdToField\', \'' + friendlyNameSourceField + '\', \'' + idSourceField + '\', \'' + emailSourceField + '\', \'' + data.participants[i].participant.split('|')[0] + '\', \'' + data.participants[i].participant.split('|')[1] + '\', \'' + data.participants[i].participant.split('|')[2] + '\', \'' + buttonToEnable + '\');">' + data.participants[i].participant.split('|')[0] + '&nbsp;&nbsp;<i>(' + data.participants[i].participant.split('|')[2] + ')</i></a>';


                                    //html += strParticipant; //data.participants[i].participant;
                                    html += '<br />';
                                    //response(searchArray);
                                }
                            } else {
                                // There were no results.
                                html += '<span><i>There were no results</i></span>';
                            }
                            $('#spanPeoplePickerParticipantsList').append(html);
                        }
                    });
                }
            },
            minLength: 0, // minLength specifies how many characters have to be typed before this gets invoked.
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
                var peoplePickerParticipantName = this.value.split('|')[0];
                var peoplePickerParticipantId = this.value.split('|')[1];
                var peoplePickerParticipantEmail = this.value.split('|')[2];

                if (peoplePickerParticipantName.indexOf('undefined') > -1) {
                    document.getElementById('txtPeoplePickerDialogSearchBox').value = '';
                    document.getElementById('txtPeoplePickerDialogParticipantId').value = '';
                    document.getElementById('txtPeoplePickerDialogParticipantEmail').value = '';
                } else {
                    document.getElementById('txtPeoplePickerDialogSearchBox').value = peoplePickerParticipantName; //this.value.split(' ')[0] + ' ' + this.value.split(' ')[1]; // Just shows the Loan Number parameter (removing the borrower name) so it fits in the text box.
                    document.getElementById('txtPeoplePickerDialogParticipantId').value = peoplePickerParticipantId;
                    document.getElementById('txtPeoplePickerDialogParticipantEmail').value = peoplePickerParticipantEmail;
                }
            }
        });

        // List all participants.
        renderAllParticipantsInThePeoplePicker(friendlyNameSourceField, idSourceField, emailSourceField, buttonToEnable); // We do this the first time to make sure they are all displayed.
    } catch (e) {
        console.log('Exception in cmdDisplayPeoplePickerDialog(): ' + e.message + ', ' + e.stack);
    }
}

//function renderAllParticipantsInThePeoplePicker(friendlyNameSourceField, idSourceField, emailSourceField, buttonToEnable) {
//    try {
//        console.log('In renderAllParticipantsInThePeoplePicker().');

//        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

//        $('#spanPeoplePickerParticipantsList').empty();
//        var data = {
//            "bwWorkflowAppId": workflowAppId
//        };
//        $.ajax({
//            url: webserviceurl + "/workflow/participants",
//            type: "DELETE",
//            contentType: 'application/json',
//            data: JSON.stringify(data),
//            success: function (data1) {
//                var data = data1.BwWorkflowUsers;

//                var html = '';
//                for (var i = 0; i < data.length; i++) {
//                    //html += '<a href="javascript:cmdReturnParticipantIdToField(\'' + friendlyNameSourceField + '\', \'' + idSourceField + '\', \'' + emailSourceField + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantEmail + '\', \'' + buttonToEnable + '\');">' + data[i].bwParticipantFriendlyName + '&nbsp;&nbsp;<i>(' + data[i].bwParticipantEmail + ')</i></a>';

//                    //debugger;
//                    html += '<a style="cursor:pointer;text-decoration:underline;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'cmdReturnParticipantIdToField\', \'' + friendlyNameSourceField + '\', \'' + idSourceField + '\', \'' + emailSourceField + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantEmail + '\', \'' + buttonToEnable + '\');">' + data[i].bwParticipantFriendlyName + '&nbsp;&nbsp;<i>(' + data[i].bwParticipantEmail + ')</i></a>';
//                    html += '<br />';
//                }
//                $('#spanPeoplePickerParticipantsList').append(html);
//            },
//            error: function (data, errorCode, errorMessage) {
//                displayAlertDialog('Error in my.js.cmdListAllParticipants():xcx2321-1: ' + errorCode + ', ' + errorMessage);
//            }
//        });
//    } catch (e) {
//        console.log('Exception in renderAllParticipantsInThePeoplePicker(): ' + e.message + ', ' + e.stack);
//    }
//}

//function adjustLeftSideMenu() {
//    try {
//        console.log('In adjustLeftSideMenu().');
//        //
//        // Pixel window height indicator for testing while getting menu 100%.
//        //
//        var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

//        //var divBottomOfMenuMarker = document.getElementById('divBottomOfMenuMarker');
//        //if (!divBottomOfMenuMarker) {
//        //    $(document.body).prepend('<div id="divBottomOfMenuMarker" style="display:block;position:absolute;">[divBottomOfMenuMarker]</div>');
//        //}
//        //document.getElementById('divBottomOfMenuMarker').style.top = height + "px";

//        // Now we have to subtract the height of the top blue bar.
//        var topBlueBar = $('#tableMainMenu1').find('tr')[0];
//        var rect = topBlueBar.getBoundingClientRect();
//        var topBlueBar_Height = rect.bottom - rect.top;
//        height = Math.round(height - topBlueBar_Height);


//        // 1-2-2022
//        var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');
//        if (developerModeEnabled == true) {
//            $('#divLeftMenuTopSmallBar1').html(height); // Display this height on the screen in the little top blue bar. 
//        }




//        // Now that we have the height, lets stretch the left menu the length of the screen, resizing each button according to:
//        // - buttonHeight_WeightedValue << This value determines the height of the button. They all get added up, then comprise 100% of the height.

//        var totalButtonSpacers_Height = 0;
//        $('#tdLeftSideMenu').find('.buttonSpacer').each(function (index, value) {
//            var tmpHeight = this.style.height.split('px')[0];
//            totalButtonSpacers_Height += Number(tmpHeight);
//        });

//        var numberOfButtons = $('#tdLeftSideMenu').find('.leftButton').length;
//        var weightedHeightValues_OneHundredPercent = 0; // This is used so we can calculate the spread percentage wise.
//        $('#tdLeftSideMenu').find('.leftButton').each(function (index, value) {


//            this.style.backgroundColor = 'darkgray'; // Button color override (for now) 8-28-2021



//            if ($(this).attr('weightedheightvalue')) {
//                weightedHeightValues_OneHundredPercent += Number($(this).attr('weightedheightvalue'));
//            }
//        });


//        // Good 9-20-2021 prior to adding minimum button height requirement.
//        //var remainingHeight = height - totalButtonSpacers_Height;
//        //$('#tdLeftSideMenu').find('.leftButton').each(function (index, value) {
//        //    if ($(this).attr('weightedheightvalue')) {
//        //        var weightedHeightValue = Number($(this).attr('weightedheightvalue'));
//        //        var divisor = weightedHeightValue / weightedHeightValues_OneHundredPercent;
//        //        var buttonHeight = remainingHeight * divisor;
//        //        console.log('Setting height of button "' + this.id + '" to ' + buttonHeight + 'px.');
//        //        this.style.height = buttonHeight + 'px';
//        //    }
//        //});


//        // Rescale buttons with minimum button height. Not perfect, but getting there.
//        var minimumButtonHeight = 30;
//        var remainingHeight; // = height - totalButtonSpacers_Height;
//        $('#tdLeftSideMenu').find('.leftButton').each(function (index, value) {


//            height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
//            height = Math.round(height - topBlueBar_Height);
//            remainingHeight = height - totalButtonSpacers_Height;


//            if ($(this).attr('weightedheightvalue')) {
//                var weightedHeightValue = Number($(this).attr('weightedheightvalue'));
//                var divisor = weightedHeightValue / weightedHeightValues_OneHundredPercent;
//                var buttonHeight = (remainingHeight * divisor) - 8; // This -4 makes it so the bottom button makes it onto the screen. 12-20-2021
//                if (minimumButtonHeight > buttonHeight) {
//                    // The button is already at the minimum height, so do nothing, except recalculate the remaining height.
//                    //console.log('Setting height of button "' + this.id + '" to minimum button height ' + buttonHeight + 'px.');
//                    buttonHeight = minimumButtonHeight;
//                    this.style.height = buttonHeight + 'px';
//                } else {
//                    //console.log('Setting height of button "' + this.id + '" to ' + buttonHeight + 'px.');
//                    this.style.height = buttonHeight + 'px';
//                }
//            }
//        });

//        // Now that the left menu is done, do the inner left menu.
//        adjustInnerLeftSideMenu();

//    } catch (e) {
//        console.log('Exception in adjustLeftSideMenu(): ' + e.message + ', ' + e.stack);
//    }
//}

//function shrinkLeftMenuBar() {
//    try {
//        var html = '';

//        // shrink left menu
//        document.getElementById('divLeftMenuHeader').style.width = '100px';
//        var cusid_ele = document.getElementsByClassName('leftButtonText');
//        for (var i = 0; i < cusid_ele.length; ++i) {
//            var item = cusid_ele[i];
//            item.style.fontSize = '8pt';
//        }

//        // Now that the left menu is done, do the inner left menu.
//        adjustInnerLeftSideMenu();

//    } catch (e) {
//        console.log('Exception in xx(): ' + e.message + ', ' + e.stack);
//    }
//}

//function adjustInnerLeftSideMenu() {
//    try {
//        console.log('In adjustInnerLeftSideMenu().');
//        //debugger;
//        //if (document.getElementById('tableMainMenu3').style.display == 'none') {
//        //    // The inner left menu is not being displayed, so do nothing here.
//        //} else {
//        if ($('#tdInnerLeftSideMenu').is(':visible')) {
//            //
//            // Pixel window height indicator for testing while getting menu 100%.
//            //
//            var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

//            // Now we have to subtract the height of the top blue bar.
//            var topBlueBar = $('#tableMainMenu3').find('tr')[0];
//            var rect = topBlueBar.getBoundingClientRect();
//            var topBlueBar_Height = rect.bottom - rect.top;
//            height = Math.round(height - topBlueBar_Height);



//            // 1-2-2022
//            var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');
//            if (developerModeEnabled == true) {
//                $('#divInnerLeftMenuTopSmallBar1').html(height); // Display this height on the screen in the little top blue bar. 
//            }




//            // Now that we have the height, lets stretch the left menu the length of the screen, resizing each button according to:
//            // - buttonHeight_WeightedValue << This value determines the height of the button. They all get added up, then comprise 100% of the height.

//            var totalButtonSpacers_Height = 0;
//            $('#tdInnerLeftSideMenu').find('.buttonSpacer').each(function (index, value) {
//                var tmpHeight = this.style.height.split('px')[0];
//                totalButtonSpacers_Height += Number(tmpHeight);
//            });

//            var numberOfButtons = $('#tdInnerLeftSideMenu').find('.leftButton').length;
//            var weightedHeightValues_OneHundredPercent = 0; // This is used so we can calculate the spread percentage wise.
//            $('#tdInnerLeftSideMenu').find('.leftButton').each(function (index, value) {


//                this.style.backgroundColor = 'darkgray'; // Button color override (for now) 8-28-2021



//                if ($(this).attr('weightedheightvalue')) {
//                    weightedHeightValues_OneHundredPercent += Number($(this).attr('weightedheightvalue'));
//                }
//            });

//            // Rescale buttons with minimum button height. Not perfect, but getting there.
//            var minimumButtonHeight = 30;
//            var remainingHeight; // = height - totalButtonSpacers_Height;
//            $('#tdInnerLeftSideMenu').find('.leftButton').each(function (index, value) {


//                height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
//                height = Math.round(height - topBlueBar_Height);
//                remainingHeight = height - totalButtonSpacers_Height;


//                if ($(this).attr('weightedheightvalue')) {
//                    var weightedHeightValue = Number($(this).attr('weightedheightvalue'));
//                    var divisor = weightedHeightValue / weightedHeightValues_OneHundredPercent;
//                    var buttonHeight = (remainingHeight * divisor) - 15; // This -10 makes it so the bottom button makes it onto the screen. 12-28-2021
//                    if (minimumButtonHeight > buttonHeight) {
//                        // The button is already at the minimum height, so do nothing, except recalculate the remaining height.
//                        //console.log('Setting height of button "' + this.id + '" to minimum button height ' + buttonHeight + 'px.');
//                        buttonHeight = minimumButtonHeight;
//                        this.style.height = buttonHeight + 'px';
//                    } else {
//                        //console.log('Setting height of button "' + this.id + '" to ' + buttonHeight + 'px.');
//                        this.style.height = buttonHeight + 'px';
//                    }
//                }
//            });
//        }

//    } catch (e) {
//        console.log('Exception in adjustInnerLeftSideMenu(): ' + e.message + ', ' + e.stack);
//    }
//}

//function renderWelcomeScreen() {
//    try {
//        console.log('In index.js.renderWelcomeScreen().');
//        alert('>>>>>>>>>>> In index.js.renderWelcomeScreen(). GET RID OF THIS METHOD.');

//        try {
//            document.getElementById('spanNotLoggedInBetaBanner').style.display = 'none';
//            document.getElementById('spanLoggedInBetaBanner').style.display = 'block';
//        } catch (e) { }

//        //var financialOrParticipantSummaryOptions = {
//        //    checked: false, // DEFAULT TO THE FINANCIAL SUMMARY. This fixes an issue when the participant summary is rendered first. The participant summary relies on the financial summary being rendered first.
//        //    show_labels: true,         // Should we show the on and off labels?
//        //    labels_placement: "both",  // Position of the labels: "both", "left" or "right"
//        //    on_label: "Participant<br />Summary",            // Text to be displayed when checked
//        //    off_label: "Financial<br />Summary",          // Text to be displayed when unchecked
//        //    width: 50,                 // Width of the button in pixels
//        //    height: 22,                // Height of the button in pixels
//        //    button_width: 24,         // Width of the sliding part in pixels
//        //    clear_after: null         // Override the element after which the clearing div should be inserted 
//        //};
//        //$("input#financialOrParticipantSummary").switchButton(financialOrParticipantSummaryOptions);

//        //setCustomSizesDependingOnTheDevice();

//        //$('#financialOrParticipantSummary').change(function () {


//        //    //displayAlertDialog('financialOrParticipantSummary.change()');


//        //    if (!$('#financialOrParticipantSummary').is(':checked')) {
//        //        if (!$('#budgetRequestsOrQuotes').is(':checked')) {
//        //            renderFinancialSummary9(false);
//        //        } else if ($('#budgetRequestsOrQuotes').is(':checked')) {
//        //            renderFinancialSummary9(true);
//        //        } else {
//        //            displayAlertDialog('budgetRequestsOrQuotes is in an invalid state.');
//        //        }
//        //    } else if ($('#financialOrParticipantSummary').is(':checked')) {
//        //        if (!$('#budgetRequestsOrQuotes').is(':checked')) {
//        //            renderParticipantSummary(false);
//        //        } else if ($('#budgetRequestsOrQuotes').is(':checked')) {
//        //            renderParticipantSummary(true);
//        //        } else {
//        //            displayAlertDialog('budgetRequestsOrQuotes is in an invalid state.');
//        //        }
//        //    } else {
//        //        displayAlertDialog('financialOrParticipantSummary is in an invalid state.');
//        //    }
//        //});














//        // WHY DO WE DO THIS HERE??? IT SHOULD HAVE HAPPENED ALREADY 8-6-2020
//        webserviceurl = globalUrlPrefix + globalUrlForWebServices + '/_bw';
//        appweburl = globalUrlPrefix + globalUrlForWebServices;
//        appweburl2 = globalUrlPrefix + globalUrl;
//        // This zooms the screen when the user first navigates to the website! More about this in the Budget Workflow Manager codebase.
//        //if (navigator.userAgent.match(/iPhone/i)) {
//        //    $('#bwMyPage').animate({ 'zoom': 3 }, 400);
//        //}
//        // todd turned off 10-20-19

//        //debugger;




//        // REMOVED THIS 9-6-2022. Any ramification??????
//        //$('#divWelcomeMasterDivTitle').text('Home');
//        //$('#divMenuMasterDivWelcomeButton').css({
//        //    'border-width': '0px', 'margin': '0px 0px 0px 0px', 'padding': '12px 0px 0px 20px', 'outline': 'rgb(59, 103, 142) dashed 1px', 'border-radius': '0px', 'width': '92%', 'height': '28px', 'color': '#dcdcdc', 'background-color': 'white'
//        //});
//        //















//        //var participantLogonType = $('.bwAuthentication').bwAuthentication('option', 'participantLogonType');
//        //var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');









//        //alert('xcx2134235 DISPLAY USER NAME');
//        //// First we have to display them in the top bar.
//        //if (participantLogonType) {
//        //    $('#spanLoggedInUserWelcomePage').text(participantFriendlyName);
//        //    //$('#spanLoggedInUserNewRequestPage').text(participantFriendlyName);
//        //    //$('#spanLoggedInUserArchivePage').text(participantFriendlyName);
//        //    //$('#spanLoggedInUserSummaryReportPage').text(participantFriendlyName);
//        //    //$('#spanLoggedInUserConfigurationPage').text(participantFriendlyName);
//        //    //$('#spanLoggedInUserVisualizationsPage').text(participantFriendlyName);
//        //    //$('#spanLoggedInUserHelpPage').text(participantFriendlyName);
//        //}
















//        //var h1 = '';
//        //h1 += '<img src="/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;vertical-align:top;" />&nbsp;' + participantFriendlyName + '';
//        //h1 += '';
//        //h1 += '';
//        //h1 += '';
//        //$('#spanLoggedInUser').html(h1);




//        //alert('Calling renderHomePagePersonalizedSection_AndRenderButtons().xcx111223-1');
//        //console.log('');
//        //console.log('----------------------------');
//        //console.log('Commented this line out here... just a note in case it broke anything, but it get\'s called elsewhere so I think we are Ok: renderHomePagePersonalizedSection_AndRenderButtons(); 2-17-2022');
//        //console.log('----------------------------');
//        //console.log('');
//        //renderHomePagePersonalizedSection_AndRenderButtons();



//    } catch (e) {
//        console.log('Exception in my.js.renderWelcomeScreen():6:', e.message + ', ' + e.stack);
//        displayAlertDialog('Exception in my.js.renderWelcomeScreen():6:', e.message);
//    }
//}





function cmdContactTheTenantAdministrator() {
    displayAlertDialog('This functionality is not yet completed Coming soon! cmdContactTheTenantAdministrator().');
}

function expandOrCollapseAlertsSection(rowId, imageId, collapsibleRowId) { // collapsibleRowId = steprow-' + stepName.toLowerCase() + '_' + i + '_' + '0'
    try {
        console.log('In my3.js.expandOrCollapseAlertsSection(' + rowId + ', ' + imageId + ', ' + collapsibleRowId + ').');

        var elementIds = ['', 'alertSectionRow_1_1', 'alertSectionRow_1_2', 'alertSectionRow_1_3'];
        var imageElementIds = ['', 'alertSectionImage_1_1', 'alertSectionImage_1_2', 'alertSectionImage_1_3'];
        var selectedIndex = collapsibleRowId.split('_')[2];
        var img = document.getElementById(imageId);

        if (!img) {
            // Do nothing. This is most likely because there are no tasks to expand!
            console.log('In my3.js.expandOrCollapseAlertsSection(). Do nothing. This is most likely because there are no tasks to expand. xxxxxxx1111');

        } else {
            var urlClose = 'images/drawer-close.png';
            var urlOpen = 'images/drawer-open.png';

            if (img.src.indexOf(urlClose) > -1) {
                document.getElementById(collapsibleRowId).style.display = 'none';
                document.getElementById(imageId).src = urlOpen;
            } else {
                document.getElementById(collapsibleRowId).style.display = 'table-row';
                document.getElementById(imageId).src = urlClose;
            }

        }

    } catch (e) {
        console.log('Exception in my3.js.expandOrCollapseAlertsSection(): ' + e.message + ', ' + e.stack);
        displayAlertDialog('Exception in my3.js.expandOrCollapseAlertsSection(): ' + e.message + ', ' + e.stack);
    }
}





function expandHomePageNotificationAndRenderAlerts(notificationType, deferredIndex, functionalAreaRowId) {
    // notificationType = task, budget request, invitation
    console.log('In my.js.expandHomePageNotificationAndRenderAlerts(' + notificationType + ', ' + deferredIndex + ', ' + functionalAreaRowId + ').');
    try {
        //displayAlertDialog('type:' + notifications);
        ////displayAlertDialog('text:' + notifications);
        //displayAlertDialog('notifications[2].length:' + notifications.length);

        //displayAlertDialog('length:' + notifications[0][2].length);

        //var appWebUrl = BWMData[0][deferredIndex][1];
        //var clickedRowHtml = $('#' + functionalAreaRowId)[0].innerHTML; // This is the row that we want to move to the top and expand: functionalAreaRowId
        //var topRow1Id = 'functionalAreaRow_' + deferredIndex.toString() + '_Top_1';
        //var topRow2Id = 'functionalAreaRow_' + deferredIndex.toString() + '_Top_2';
        //var div1 = document.getElementById(topRow1Id);
        //var div2 = document.getElementById(topRow2Id);
        //var div = document.getElementById(functionalAreaRowId);
        //// First we have to show the previous row that was hidden, if there was one.
        //if (div1.style.visibility == 'visible') {
        //    // It is currently visible, so we have to display the original row again. We're lazy, just doing them all.
        //    try {
        //        for (var i = 0; i < 1000; i++) {
        //            var currentRowId = 'functionalAreaRow_' + deferredIndex.toString() + '_' + i.toString();
        //            var currentRow = document.getElementById(currentRowId);
        //            currentRow.style.visibility = 'visible';
        //            $('#' + currentRowId).show();
        //        }
        //    } catch (e) {
        //        // This means we are done so continue on!
        //    }
        //}
        // Now we put this in the top row, and show it.
        //$('#' + topRow1Id)[0].innerHTML = clickedRowHtml;
        //div1.style.visibility = 'visible';
        //$('#' + topRow1Id).show();
        //// We need to reset the background-color of the cell due to the hover over having left it colored.
        //$('#' + topRow1Id).find('.bwFADrillDownLinkCell').css({
        //    'background-color': 'white', 'color': '#444', 'cursor': 'default'
        //});

        //// Now we hide the original row.
        //div.style.visibility = 'hidden';
        //$('#' + functionalAreaRowId).hide();




        // Now we show the details underneath.

        var functionalAreaId;

        var topHtml = '';
        var numberOfFunctionalAreas = 3;










        topHtml += '<tr>';
        topHtml += '    <td colspan="7">';
        topHtml += '        <table>';
        // Render the "Pending" section.
        //var numberOfBrItems = 2;
        //for (var pi = 0; pi < submittedBrItems.length; pi++) {

        // Go through the notification types and make sure they match the one specified by notificationType.
        var ntypeindex;

        for (var i = 0; i < notifications.length; i++) {
            if (notificationType == notifications[i][0]) {
                ntypeindex = i;
            }
        }
        //debugger;
        if (notificationType == 'task') {
            for (var pi = 0; pi < notifications[ntypeindex][2].length; pi++) {
                var taskTitle = notifications[ntypeindex][2][pi][0];
                var appWebUrl = appweburl;
                var budgetRequestId = notifications[ntypeindex][2][pi][3];
                var arName = notifications[ntypeindex][2][pi][11];
                var brTitle = notifications[ntypeindex][2][pi][7];
                var title = notifications[ntypeindex][2][pi][11];
                var budgetAmount = notifications[ntypeindex][2][pi][8];
                var requestedCapital = notifications[ntypeindex][2][pi][12];
                var requestedExpense = notifications[ntypeindex][2][pi][13];
                var taskType = notifications[ntypeindex][2][pi][14];

                debugger; // 12-23-2021 get bwWorkflowTaskItemId xcx1 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

                //notifications[0][2][i][15] = taskData[i].bwAssignedToRaciRoleAbbreviation;
                //notifications[0][2][i][16] = taskData[i].bwAssignedToRaciRoleName;
                var bwAssignedToRaciRoleAbbreviation = notifications[ntypeindex][2][pi][15];
                var bwAssignedToRaciRoleName = notifications[ntypeindex][2][pi][16];

                var orgId = notifications[ntypeindex][2][pi][17];
                var orgName = notifications[ntypeindex][2][pi][18];

                var currentAmount = 0;
                if (budgetAmount == 'null') {
                    currentAmount = Number(requestedCapital) + Number(requestedExpense);
                } else {
                    currentAmount = budgetAmount;
                }

                // Figure out how many days since the task was created.
                //var thisMustBeADifferentKindOfTask = false; // Todd: oooooooo ugly!
                var daysSinceTaskCreated = 0;
                try {
                    var cd = notifications[ntypeindex][2][pi][6]; //bwDueDate //wtlItems.d.results[r].bwCreated;
                    var year = cd.split('-')[0];
                    var month = cd.split('-')[1];
                    var day = cd.split('-')[2].split('T')[0];
                    var taskCreatedDate = new Date(Number(year), Number(month) - 1, Number(day) - 1); // +1 because we're using overdue date.
                    var todaysDate = new Date();
                    var utc1 = Date.UTC(taskCreatedDate.getFullYear(), taskCreatedDate.getMonth(), taskCreatedDate.getDate());
                    var utc2 = Date.UTC(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate());
                    var _MS_PER_DAY = 1000 * 60 * 60 * 24;
                    daysSinceTaskCreated = Math.floor((utc2 - utc1) / _MS_PER_DAY);
                } catch (e) {
                    // TODD: THIS NEEDS TO BE REEXAMINED, we are catching this error when the new recurring tasks cam einto play!
                    //thisMustBeADifferentKindOfTask = true;
                }

                topHtml += '   <tr>';
                topHtml += '       <td style="width:10px;"></td>';
                topHtml += '       <td style="width:10px;"></td>';

                // Find the functional area name.
                var functionalAreaId = notifications[ntypeindex][2][pi][9];
                var functionalAreaName = '';

                //debugger;
                if (BWMData[0]) {
                    for (var x = 0; x < BWMData[0].length; x++) {
                        if (BWMData[0][x][0] = workflowAppId) {
                            // We have the correct workflow!
                            for (var fai = 0; fai < BWMData[0][x][4].length; fai++) {
                                if (functionalAreaId == BWMData[0][x][4][fai][0]) {
                                    functionalAreaName = BWMData[0][x][4][fai][1];
                                }
                            }
                        }
                    }
                }

                if (taskType == 'RECURRING_EXPENSE_NOTIFICATION_TASK') {
                    topHtml += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;" colspan="5"><div style="display:inline-block;"><a style="cursor:pointer;" onclick="displayRecurringExpenseOnTheHomePage(\'' + budgetRequestId + '\', \'' + participantId + '\', \'' + title + '\');" target="_blank" title="Click to view the recurring expense...">' + daysSinceTaskCreated.toString() + ' days overduexcx4: Recurring expense <em>(' + brTitle + ' - ' + functionalAreaName + ') is due to be submitted</em></a></div></td>';
                } else if (taskType == 'BUDGET_REQUEST_WORKFLOW_TASK') {


                    topHtml += '<td style="width:45px;"></td>';
                    topHtml += '<td colspan="4" ';
                    topHtml += 'style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" ';
                    topHtml += 'onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + title + '\', \'' + brTitle + '\', \'' + '' + '\', \'' + workflowAppId + '\', \'' + budgetRequestId + '\', \'' + orgId + '\', \'' + orgName + '\', this);this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                    topHtml += 'onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');this.style.backgroundColor=\'#d8d8d8\';"  ';
                    topHtml += 'onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\', \'' + bwAssignedToRaciRoleAbbreviation + '\');" ';
                    topHtml += '>';



                    topHtml += '    <div style="display:inline-block;" bwtrace="xcx778452">';
                    topHtml += daysSinceTaskCreated.toString() + ' days overduexcx5: ';
                    topHtml += '        <em>';
                    topHtml += title + ' - ' + brTitle + ' - ' + formatCurrency(currentAmount) + ' - ' + functionalAreaName + ' ' + '[(' + bwAssignedToRaciRoleAbbreviation + ') ' + bwAssignedToRaciRoleName + ']';
                    topHtml += '        </em>';
                    //topHtml += '        xcx77845';
                    topHtml += '    </div>';
                    topHtml += '</td>';
                } else {
                    topHtml += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;" colspan="5">UNKNOWN TASK TYPE</td>';
                }

                topHtml += '        </tr>';
            }
        } else if (notificationType == 'budget request') {
            for (var pi = 0; pi < notifications[ntypeindex][2].length; pi++) {


                var projectTitle = notifications[ntypeindex][2][pi][3];
                var budgetAmount = notifications[ntypeindex][2][pi][4];
                // Find the functional area name.
                var functionalAreaId = notifications[ntypeindex][2][pi][5];
                var functionalAreaName = '';
                if (BWMData[0] && BWMData[0].length) { // Todd: added this 1-17-2020 because BWMData[0] was undefined for some reason.
                    for (var x = 0; x < BWMData[0].length; x++) {
                        if (BWMData[0][x][0] = workflowAppId) {
                            // We have the correct workflow!
                            for (var fai = 0; fai < BWMData[0][x][4].length; fai++) {
                                if (functionalAreaId == BWMData[0][x][4][fai][0]) {
                                    functionalAreaName = BWMData[0][x][4][fai][1];
                                }
                            }
                        }
                    }
                }


                //appWebUrl, budgetRequestId, arName, brTitle
                var appWebUrl = appweburl; //notifications[ntypeindex][2][pi][xxxx];
                var budgetRequestId = notifications[ntypeindex][2][pi][0];
                var arName = notifications[ntypeindex][2][pi][2];
                var brTitle = notifications[ntypeindex][2][pi][3];
                var title = notifications[ntypeindex][2][pi][2];
                var requestedCapital = notifications[ntypeindex][2][pi][11];
                var requestedExpense = notifications[ntypeindex][2][pi][12];

                debugger; // 12-23-2021 get bwWorkflowTaskItemId xcx2

                var currentAmount = 0;
                if (budgetAmount == 'null') {
                    currentAmount = Number(requestedCapital) + Number(requestedExpense);
                } else {
                    currentAmount = budgetAmount;
                }


                //// Figure out how many days since the task was created.
                //var cd = notifications[ntypeindex][2][pi][6]; //bwDueDate //wtlItems.d.results[r].bwCreated;
                //var year = cd.split('-')[0];
                //var month = cd.split('-')[1];
                //var day = cd.split('-')[2].split('T')[0];
                //var taskCreatedDate = new Date(Number(year), Number(month) - 1, Number(day));
                //var todaysDate = new Date();
                //var utc1 = Date.UTC(taskCreatedDate.getFullYear(), taskCreatedDate.getMonth(), taskCreatedDate.getDate());
                //var utc2 = Date.UTC(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate());
                //var _MS_PER_DAY = 1000 * 60 * 60 * 24;
                //var daysSinceTaskCreated = Math.floor((utc2 - utc1) / _MS_PER_DAY);

                topHtml += '   <tr>';
                topHtml += '       <td style="width:10px;"></td>';
                topHtml += '       <td style="width:10px;"></td>';

                //numberOfOverdueTasksForUser++;
                //if (Number(daysSinceTaskCreated) > Number(oldestOverdueTaskForUser)) oldestOverdueTaskForUser = daysSinceTaskCreated;

                //if (daysSinceTaskCreated == 1) {
                //    topHtml += '<td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;">1 day overdue: '; // for task <em>' + taskTitle + '</em>&nbsp;&nbsp;&nbsp;';
                //} else {
                //    topHtml += '<td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;">' + daysSinceTaskCreated.toString() + ' days overdue: '; // for task <em>' + taskTitle + '</em>&nbsp;&nbsp;&nbsp;';
                //}

                //displayAlertDialog('xxx');
                var participantFriendlyName = '';
                var participantEmailAddress = '';
                //if (currentAmount == 0) {
                //    topHtml += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;" colspan="5">yy<a style="cursor:pointer;" onclick="displayArInDialog(\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');" target="_blank" title="Click to view the request ' + title + '.">' + title + ': <em>' + projectTitle + ' - ' + 'no budget assigned' + ' - ' + functionalAreaName + '</em></a></td>';
                //} else {
                //    topHtml += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;" colspan="5">zz<a style="cursor:pointer;" onclick="displayArInDialog(\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');" target="_blank" title="Click to view the request ' + title + '.">' + title + ': <em>' + projectTitle + ' - ' + formatCurrency(currentAmount) + ' - ' + functionalAreaName + ' - waiting for ' + participantFriendlyName + '(' + participantEmailAddress + ')' + ' to complete their task.' + '</em></a></td>';
                //}
                if (currentAmount == 0) {

                    //debugger;
                    //topHtml += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="5" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');" target="_blank" title="y1Click to view the request ' + title + '.">' + title + ': <em>' + projectTitle + ' - ' + 'no budget assigned' + ' - ' + functionalAreaName + '</em></td>';
                    topHtml += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="5" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + title + '\', \'' + brTitle + '\', \'' + '' + '\', \'' + workflowAppId + '\', \'' + budgetRequestId + '\', \'' + 'xOrgId' + '\', \'' + 'xOrgName' + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');" target="_blank" >' + title + ': <em>' + projectTitle + ' - ' + 'no budget assigned' + ' - ' + functionalAreaName + '</em></td>';

                } else {

                    //debugger;
                    //topHtml += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="5" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');" target="_blank" title="y2Click to view the request ' + title + '.">' + title + ': <em>' + projectTitle + ' - ' + formatCurrency(currentAmount) + ' - ' + functionalAreaName + ' - waiting for ' + participantFriendlyName + '(' + participantEmailAddress + ')' + ' to complete their task.' + '</em></td>';
                    topHtml += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="5" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + title + '\', \'' + brTitle + '\', \'' + '' + '\', \'' + workflowAppId + '\', \'' + budgetRequestId + '\', \'' + 'xxOrgId' + '\', \'' + 'xxOrgName' + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');" target="_blank" >' + title + ': <em>' + projectTitle + ' - ' + formatCurrency(currentAmount) + ' - ' + functionalAreaName + ' - waiting for ' + participantFriendlyName + '(' + participantEmailAddress + ')' + ' to complete their task.' + '</em></td>';

                }



                //if (faTitle == '' || brProjectTitle == '') {
                //    // If we get here this is not good. This means there is something wrong with the AR or perhaps it has to do with the status of the AR.
                //    topHtml += '       <a style="cursor:pointer;" onclick="displayArInDialog(\'' + appWebUrl + '\', \'' + BWMData[0][workflowIndex][4][selectedFaIndex][8][selectedBrIndex][0] + '\', \'' + BWMData[0][workflowIndex][4][selectedFaIndex][8][selectedBrIndex][1] + '\', \'' + BWMData[0][workflowIndex][4][selectedFaIndex][8][selectedBrIndex][2] + '\');" target="_blank" title="Click to view the request..."><em>There is a problem with this AR. Click here to learn more</em></a>';
                //} else {
                //    topHtml += '       <a style="cursor:pointer;" onclick="displayArInDialog(\'' + appWebUrl + '\', \'' + BWMData[0][workflowIndex][4][selectedFaIndex][8][selectedBrIndex][0] + '\', \'' + BWMData[0][workflowIndex][4][selectedFaIndex][8][selectedBrIndex][1] + '\', \'' + BWMData[0][workflowIndex][4][selectedFaIndex][8][selectedBrIndex][2] + '\');" target="_blank" title="Click to view the request...">' + brProjectTitle + ' (<em>' + formatCurrency(brBudgetAmount) + '</em>) - <em>' + faTitle + '</em></a>'; // ' + brProjectTitle + ' <em>(' + formatCurrency(brBudgetAmount) + ')</em></a>';
                //}

                topHtml += '        </tr>';
            }
        } else if (notificationType == 'invitation') {
            // This is the one we will replace here soon.
            for (var pi = 0; pi < notifications[ntypeindex][2].length; pi++) {

                //topHtml += '        <tr>';
                //topHtml += '            <td style="width:90px;"></td>';
                //topHtml += '            <td>&nbsp;&nbsp;</td>';
                //topHtml += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;" colspan="5"><div id="tdUnclaimedInvitationLinkSwipeEnabled' + pi + '"><a style="cursor:pointer;" onclick="displayArInDialog();" target="_blank" title="Send this link in an email to invite someone to participate in this workflow. You will be notified when they have confirmed their participation.">' + notifications[ntypeindex][2][pi][0] + '</a></div></td>';
                //topHtml += '        </tr>';

                // Todd: New 5-18-17
                topHtml += '        <tr>';
                topHtml += '            <td style="width:90px;"></td>';
                topHtml += '            <td>&nbsp;&nbsp;</td>';
                //topHtml += '            <td colspan="5" class="tdHomePageSubNotificationIos8"><div id="tdUnclaimedInvitationLinkSwipeEnabled' + pi + '"><a style="cursor:pointer;" onclick="displayArInDialog();" target="_blank" title="Send this link in an email to invite someone to participate in this workflow. You will be notified when they have confirmed their participation.">' + notifications[ntypeindex][2][pi][0] + '</a></div></td>';
                var invitationChar = notifications[ntypeindex][2][pi][0].indexOf('=') + 1;
                var invitationGuid = notifications[ntypeindex][2][pi][0].substring(invitationChar);
                topHtml += '            <td colspan="5" class="tdHomePageSubNotificationIos8"><div id="tdUnclaimedInvitationLinkSwipeEnabled' + pi + '"><a style="cursor:pointer;" onclick="cmdViewInvitation(\'' + invitationGuid + '\');" target="_blank" title="Send this link in an email to invite someone to participate in this workflow. You will be notified when they have confirmed their participation.">' + notifications[ntypeindex][2][pi][0] + '</a></div></td>';
                topHtml += '        </tr>';
            }
        } else {
            alert('Unexpected response at xcx66753.');
        }














        topHtml += '        </td>';
        topHtml += '    </tr>';
        topHtml += '</table>';

        // Closing tags.
        topHtml += '   </td>';
        topHtml += '</tr>';















        //topHtml += '<tr>';
        //topHtml += '    <td colspan="7">';
        //topHtml += '        <table>';
        //// Render the "Pending" section.
        //var numberOfBrItems = 2;
        ////for (var pi = 0; pi < submittedBrItems.length; pi++) {
        //for (var pi = 0; pi < numberOfBrItems; pi++) {
        //    topHtml += '        <tr>';
        //    topHtml += '            <td style="width:90px;"></td>';
        //    topHtml += '            <td>&nbsp;&nbsp;</td>';
        //    topHtml += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;" colspan="5"><a style="cursor:pointer;" onclick="displayArInDialog();" target="_blank" title="Click to view the request...">' + 'Pizza ($0.00 - Submitted undefined undefined)</a></td>';
        //    topHtml += '        </tr>';
        //}
        //topHtml += '        </td>';
        //topHtml += '    </tr>';
        //topHtml += '</table>';

        //// Closing tags.
        //topHtml += '   </td>';
        //topHtml += '</tr>';

        // This is where it is displayed!
        $('#' + functionalAreaRowId)[0].innerHTML = topHtml;
        //div2.style.visibility = 'visible';
        $('#' + functionalAreaRowId).show();


        //for (var pi = 0; pi < notifications[ntypeindex][2].length; pi++) {
        //    var el = document.getElementById('tdUnclaimedInvitationLinkSwipeEnabled' + pi);
        //    swipedetect(el, function (swipedir) {
        //        // swipedir contains either "none", "left", "right", "top", or "down"
        //        if (swipedir == 'left')
        //            displayAlertDialog('You just swiped left!');
        //    });
        //}



    } catch (e) {
        //handleExceptionWithAlert('Error in my.js.expandHomePageNotificationAndRenderAlerts()', '2:' + e.message);
        console.log('Exception in my.js.expandHomePageNotificationAndRenderAlerts() 2:' + e.message + ' ' + e.stack + ' This is not necessarily a service unavailable error but we dont want to bother the user!!');
        displayAlertDialog('Exception in my.js.expandHomePageNotificationAndRenderAlerts() 2:' + e.message + ' ' + e.stack + ' This is not necessarily a service unavailable error but we dont want to bother the user!!');

    }
}

function swipedetect(el, callback) {
    displayAlertDialog('swipedetect');
    var touchsurface = el,
        swipedir,
        startX,
        startY,
        distX,
        distY,
        threshold = 150, //required min distance traveled to be considered swipe
        restraint = 100, // maximum distance allowed at the same time in perpendicular direction
        allowedTime = 300, // maximum time allowed to travel that distance
        elapsedTime,
        startTime,
        handleswipe = callback || function (swipedir) {
        }

    touchsurface.addEventListener('touchstart', function (e) {
        var touchobj = e.changedTouches[0]
        swipedir = 'none'
        dist = 0
        startX = touchobj.pageX
        startY = touchobj.pageY
        startTime = new Date().getTime() // record time when finger first makes contact with surface
        e.preventDefault()
    }, false)

    touchsurface.addEventListener('touchmove', function (e) {
        e.preventDefault() // prevent scrolling when inside DIV
    }, false)

    touchsurface.addEventListener('touchend', function (e) {
        var touchobj = e.changedTouches[0]
        distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
        distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime // get time elapsed
        if (elapsedTime <= allowedTime) { // first condition for awipe met
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // 2nd condition for horizontal swipe met
                swipedir = (distX < 0) ? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
            }
            else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) { // 2nd condition for vertical swipe met
                swipedir = (distY < 0) ? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
            }
        }
        handleswipe(swipedir)
        e.preventDefault()
    }, false)
}

//USAGE:
/*
var el = document.getElementById('someel')
swipedetect(el, function(swipedir){
    swipedir contains either "none", "left", "right", "top", or "down"
    if (swipedir =='left')
        displayAlertDialog('You just swiped left!')
})
*/

//function renderTenantOwnerStuff() {
//    //displayAlertDialog('renderTenantOwnerStuff()');
//    // Render the user dropdown tenant administration link.
//    //var tmHtml = '';
//    //tmHtml += '<a href="javascript:cmdTenantAdministration();">';
//    //tmHtml += 'Administration';
//    //tmHtml += '</a>';
//    //tmHtml += '<hr />';
//    //$('#divUserDropdownTenantAdministrationLink').html(tmHtml);
//    //  
//}

function cmdAcceptInvitation(bwInvitationId, bwTenantId, bwWorkflowAppId, bwWorkflowAppTitle, bwInvitationParticipantRole) { //, bwInvitationCreatedById, bwInvitationCreatedByFriendlyName) {
    // We have been provided the invitation details. We need the tenant id, the workflow app id, the role, the created by Id (the person who created the invitation) and friendly name.
    // We have to update the participant details, then the invitation details.
    try {
        //debugger;
        var data = {
            "participantId": participantId,
            "bwInvitationId": bwInvitationId,
            "bwTenantId": bwTenantId,
            "bwWorkflowAppId": bwWorkflowAppId,
            "bwWorkflowAppTitle": bwWorkflowAppTitle,
            "bwInvitationParticipantRole": bwInvitationParticipantRole,
            "bwParticipantLogonType": participantLogonType
        };
        $.ajax({
            url: webserviceurl + "/participants/acceptinvitationxx", // HAD TO REMOVE THIS DUE TO NAMING CONFLICT
            type: "PUT",
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (data) {
                try {
                    //debugger;
                    //var location = window.location + ''; // Force it to be a string.
                    //displayAlertDialog('my.js.cmdAcceptInvitation() location: ' + location);
                    //var tmp = location.split('#')[1];
                    //var url = 'my.html?logontype=' + participantLogonType + '#' + tmp;
                    //displayAlertDialog('my.js.cmdAcceptInvitation() url:' + url);
                    ////window.location = url;

                    if (data.message == 'SUCCESS') {

                        //var url = appweburl + '/my.html?logontype=' + participantLogonType;
                        //window.location = url;
                        invitationAlreadyAccepted = true;
                        renderWelcomeScreen();
                    } else {

                        displayAlertDialog(data.message);

                    }
                } catch (e) {
                    displayAlertDialog('Error in my.js.cmdAcceptInvitation():1:' + e.message);
                }
            },
            error: function (data, errorCode, errorMessage) {
                //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
                displayAlertDialog('Error in my.js.cmdAcceptInvitation():xcx1:' + errorCode + ', ' + errorMessage + '::' + JSON.stringify(data));
            }
        });
    } catch (e) {
        displayAlertDialog('Error in my.js.cmdAcceptInvitation():2:' + e.message);
    }
}

var tipToggle = false; // Global var to manage this.
var tipsInitialized = false;
function cmdDisplayToDoList() {
    if (tipToggle == false) tipToggle = true;
    else tipToggle = false;
    if (tipsInitialized == true) {
        // They exist in the DOM so we are Ok.
        $('#btnInviteNewParticipant1').qtip('toggle', tipToggle);
        $('#divWelcomePageLeftButtonsConfigurationButton').qtip('toggle', tipToggle);
        $('#divWelcomePageLeftButtonsNewRequestButton').qtip('toggle', tipToggle);
    } else {
        // They don't exist in the DOM so we need to add them.
        $('#btnInviteNewParticipant1').qtip({
            content: {
                text: '<span style="font-size:18px;"><b>Step 1:</b> Email the invitation link to your participants.</span>'
            },
            position: {
                at: 'bottom center'
            }
        });
        $('#divWelcomePageLeftButtonsConfigurationButton').qtip({
            content: {
                text: '<span style="font-size:18px;"><b>Step 2:</b> Go to the Configuration section to configure Financial Areas, specifying the participants.</span>'
            },
            position: {
                at: 'bottom center'
            }
        });
        $('#divWelcomePageLeftButtonsNewRequestButton').qtip({
            content: {
                text: '<span style="font-size:18px;"><b>Step 3:</b> Create a new Budget Request. The choice of Financial Area determines who participates in the approval of this budget request!</span>'
            },
            position: {
                at: 'right bottom'
            },
        });
        tipsInitialized = true;
        $('#btnInviteNewParticipant1').qtip('toggle', tipToggle);
        $('#divWelcomePageLeftButtonsConfigurationButton').qtip('toggle', tipToggle);
        $('#divWelcomePageLeftButtonsNewRequestButton').qtip('toggle', tipToggle);
        tipToggle = true; // Todd: Did this fix the 2 click issue?
    }







    // Show the sticky tags.

    //$('#spanAlertLink').qtip('toggle', true);




    //try {
    //    $('#bwQuickLaunchMenuTd').css({ width: '0' }); // This gets rid of the jumping around.

    //    $('#liNewRequest').hide();
    //    $('#liMyStuff').hide();
    //    $('#liSummaryReport').hide();
    //    $('#liConfiguration').hide();
    //    $('#liHelp').hide();
    //    $('#liWelcome').show();

    //    $('#divWelcomeMessage').empty(); // Clear the welcome screen!

    //    var e1 = document.getElementById('divNewRequestMasterDiv');
    //    e1.style.borderRadius = '20px 0 0 20px';

    //    $('#divWelcomeMasterDivTitle').text('Alerts');

    //    $('#divMenuMasterDivWelcomeButton').css({ 'height': '28px', 'width': '92%', 'white-space': 'nowrap', 'border-radius': '0 0 0 0', 'padding': '12px 0 0 20px', 'margin': '0 0 0 0', 'border-width': '0 0 0 0', 'background-color': '#6682b5', 'color': 'white', 'outline': 'none', 'cursor': 'pointer' });
    //    $('#divMenuMasterDivWelcomeButton').click(function () {
    //        //$('#divMenuMasterDivWelcomeButton').css({ 'border-width': '0px', 'margin': '0px 0px 0px 0px', 'padding': '12px 0px 0px 20px', 'outline': 'rgb(59, 103, 142) dashed 1px', 'border-radius': '0px', 'width': '92%', 'height': '28px', 'color': '#dcdcdc', 'background-color': 'white' });
    //        //$('#divWelcomeMasterDivTitle').text('Home');
    //        renderWelcomeScreen();
    //    });
    //    // Web service call to get the user details.
    //    var operationUri = appweburl + "/bwparticipants/getuserdetailsbyparticipantid/" + participantId.toString();
    //    $.ajax({
    //        url: operationUri,
    //        method: "GET",
    //        headers: {
    //            "Accept": "application/json; odata=verbose"
    //        },
    //        success: function (userData) {
    //            //var userLogonType;
    //            //if (userData.d.results[0].bwParticipantMicrosoftUserId != null) {
    //            //    userLogonType = 'Microsoft';
    //            //} else if (userData.d.results[0].bwParticipantFacebookUserId != null) {
    //            //    userLogonType = 'Facebook';
    //            //} else if (userData.d.results[0].bwParticipantGoogleUserId != null) {
    //            //    userLogonType = 'Google';
    //            //} else if (userData.d.results[0].bwParticipantLinkedInUserId != null) {
    //            //    userLogonType = 'LinkedIn';
    //            //}
    //            // This is our User Options screen.
    //            var html = '';
    //            html += '<br />';
    //            html += '<span style="color:black;font-weight:bold;">Alerts [abbr disp link icon]&nbsp;[full disp link icon]</span>';
    //            html += '<hr />';
    //            // Outstanding tasks.
    //            html += '<div class="codeSnippetContainer" id="code-snippet-4" xmlns="">';
    //            html += '    <div class="codeSnippetContainerTabs">';
    //            html += '        <div class="codeSnippetContainerTabSingle" dir="ltr"><a>&nbsp;&nbsp;My outstanding tasks&nbsp;&nbsp;</a></div>';
    //            html += '    </div>';
    //            html += '    <div class="codeSnippetContainerCodeContainer">';
    //            html += '        <div class="codeSnippetToolBar">';
    //            html += '            <div class="codeSnippetToolBarText">';
    //            html += '                <a name="CodeSnippetCopyLink" title="Copy to clipboard." style="display: none;" href="javascript:displayAlertDialog(\'Copy support is not yet implemented.\');">Copy</a>';
    //            html += '            </div>';
    //            html += '        </div>';
    //            html += '        <div class="codeSnippetContainerCode" id="CodeSnippetContainerCode_5207fb9c-60fd-402f-8729-5795651a5ad3" dir="ltr">';
    //            html += '            <div>';
    //            html += '                <span id="spanOutstandingTasks" style="font-size:x-small;"></span>';
    //            html += '            </div>';
    //            html += '        </div>';
    //            html += '    </div>';
    //            html += '</div>';
    //            // end Outstanding tasks.
    //            html += '<br />';
    //            html += '<table>';
    //            html += '    <tr><td>&nbsp;</td><td></td></tr>';
    //            //html += '    <tr><td>Outstanding tasks:<i>(tasks that are assigned to me...)</i></td><td></td></tr>';
    //            //html += '    <tr><td>&nbsp;</td><td></td></tr>';
    //            //html += '    <tr><td>&nbsp;</td><td></td></tr>';
    //            //html += '    <tr><td>My pending budget requests:<i>(list my requests that are in process...)</i></td><td></td></tr>';
    //            //html += '    <tr><td>&nbsp;</td><td></td></tr>';
    //            //html += '    <tr><td>&nbsp;</td><td></td></tr>';
    //            //html += '    <tr><td>Unclaimed invitations:<i>(invitations I have created but have not been logged into yet...)</i></td><td></td></tr>';
    //            //html += '    <tr><td>&nbsp;</td><td></td></tr>';
    //            //html += '    <tr><td>&nbsp;</td><td></td></tr>';
    //            html += '    <tr><td>Configuration issues:<i>(no financial areas, and things of this sort...)</i></td><td></td></tr>';
    //            html += '    <tr><td>&nbsp;</td><td></td></tr>';
    //            html += '    <tr><td>&nbsp;</td><td></td></tr>';
    //            html += '</table>';
    //            $('#divWelcomeMessage').html(html);

    //            //$('#txtUserOptionsFriendlyName').val(userData.d.results[0].bwParticipantFriendlyName);
    //            //$('#txtUserOptionsEmail').val(userData.d.results[0].bwParticipantEmail);
    //            //$('#txtUserOptionsRole').val(userData.d.results[0].bwParticipantRole);

    //            var data = {
    //                "bwTenantId": tenantId,
    //                "bwWorkflowAppId": workflowAppId,
    //                "bwParticipantId": participantId
    //            };
    //            //var operationUri = appweburl + "/bwtasksoutstanding/" + participantId;
    //            var operationUri = appweburl + "/bwtasksoutstanding";
    //            $.ajax({
    //                url: operationUri,
    //                type: "DELETE",
    //                contentType: 'application/json',
    //                data: data,
    //                success: function (data) {
    //                    //displayAlertDialog(JSON.stringify(data));
    //                    var html = '';
    //                    //html += data;
    //                    html += '<table class="myStuffTable">';
    //                    html += '  <tr>';
    //                    html += '    <td>task title</td>';
    //                    html += '    <td>related item title</td>';
    //                    html += '    <td>requested by</td>';
    //                    html += '    <td>requested date</td>';
    //                    html += '    <td>task due date</td>';
    //                    //html += '    <td>task outcome</td>';
    //                    //html += '    <td>percent complete</td>';
    //                    html += '    <td>hasbeenprocessedbytheworkflowengine</td>';
    //                    html += '    <td>assigned to</td>';
    //                    html += '    <td>assigned to id</td>';
    //                    html += '    <td>workflow app id</td>';
    //                    html += '    <td>related item id</td>';
    //                    //html += '    <td>approval level workflow token</td>';
    //                    html += '  </tr>';

    //                    //displayAlertDialog('data length:' + data.length);

    //                    for (var i = 0; i < data.length; i++) {
    //                        html += '  <tr>';
    //                        html += '    <td><a href="javascript:displayArOnTheHomePage(\'' + data[i].bwRelatedItemId + '\', \'' + participantId + '\');">' + data[i].bwTaskTitle + '</a></td>';
    //                        html += '    <td>' + data[i].BudgetRequestProjectTitle + '</td>';
    //                        html += '    <td>' + data[i].BudgetRequestCreatedBy + '</td>';
    //                        html += '    <td>' + data[i].bwCreated + '</td>';
    //                        html += '    <td>' + data[i].bwDueDate + '</td>';
    //                        html += '    <td>' + data[i].bwHasBeenProcessedByTheWorkflowEngine + '</td>';
    //                        html += '    <td>' + data[i].bwAssignedTo + '</td>';
    //                        html += '    <td>' + data[i].bwAssignedToId + '</td>';
    //                        html += '    <td>' + data[i].bwWorkflowAppId + '</td>';
    //                        html += '    <td>' + data[i].bwRelatedItemId + '</td>';

    //                        html += '  </tr>';
    //                        //html += 'bwTaskTitle:' + data[i].bwTaskTitle + ', bwTaskOutcome:' + data[i].bwTaskOutcome + ' bwPercentComplete:' +data[i].bwPercentComplete + ' bwHasBeenProcessedByTheWorkflowEngine:' +data[i].bwHasBeenProcessedByTheWorkflowEngine + ', bwAssignedTo:' +data[i].bwAssignedTo + '<br/>';
    //                        //html += '';
    //                    }
    //                    html += '<tr><td colspan="10">DONE</td></tr>';
    //                    html += '</table>';
    //                    $('#spanOutstandingTasks').append(html);
    //                    //$('#txtBwWorkflowTasks').append(html);
    //                },
    //                error: function (data, errorCode, errorMessage) {
    //                    //window.waitDialog.close();
    //                    //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
    //                    displayAlertDialog('Error in my.js.cmdDisplayToDoList():1:' + errorCode + ', ' + errorMessage + JSON.stringify(data));
    //                }
    //            });
    //        },
    //        error: function (data, errorCode, errorMessage) {
    //            handleExceptionWithAlert('Error in my.js.cmdDisplayToDoList():2:', errorCode + ', ' + errorMessage);
    //        }
    //    });
    //} catch (e) {
    //    displayAlertDialog('Error in my.js.cmdDisplayToDoList():3:' + e.message);
    //}
}

function renderArchive() {
    try {
        console.log('In renderArchive().');
        alert('In renderArchive().');

        $('#bwQuickLaunchMenuTd').css({
            width: '0'
        }); // This gets rid of the jumping around.

        try {
            $('#FormsEditorToolbox').dialog('close');
        } catch (e) { }

        $('#liWelcome').hide();
        $('#liNewRequest').hide();
        $('#liSummaryReport').hide();
        $('#liConfiguration').hide();
        $('#liHelp').hide();
        $('#liVisualizations').hide();
        $('#liArchive').show();
        var e1 = document.getElementById('divArchiveMasterDiv');
        e1.style.borderRadius = '20px 0 0 20px';

        var canvas = document.getElementById("myCanvas");
        if (canvas) {
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines
            canvas.style.zIndex = -1;
        }


        //debugger;
        //// Render the Print button.
        //var printButtonOptions = {
        //    reportType: 'CurrentYearBudgetRequestsReport'
        //};
        //var $printbutton = $('#spanArchivePagePrintButton').bwPrintButton(printButtonOptions);



        // This is the request type drop down. Create the drop down at the top of the page, and select the last used option!
        //debugger; //-THISNEEDSTOBECHANGED // This is the "Archive" section. >> RENAME TO: renderArchive();
        var requestTypes = bwEnabledRequestTypes.EnabledItems;
        var html = '';
        if (requestTypes.length == 1) {
            // If there is only one, don't display as a drop down, just as plain text.
            html += '<span style="font-size: 200%;">View <strong>' + requestTypes[0][1] + '</strong></span>';
            document.getElementById('spanArchiveScreenRequestTypeDropDownSection').innerHTML = html;
        } else {
            // There is more than 1, so we have to display as a drop down.
            //html += '<span style="font-size: 200%;">View <strong>';
            html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 1.77em;">';
            html += 'View ';
            html += '<select id="selectArchiveScreenRequestTypeDropDown" style=\'border-color: whitesmoke; color: rgb(38, 38, 38); font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 1.25em; font-weight: bold; cursor: pointer;\'>';
            for (var i = 0; i < requestTypes.length; i++) {
                if (requestTypes[i][0] == bwLastSelectedArchiveScreenRequestType) {
                    // Selected
                    html += '<option value="' + requestTypes[i][0] + '" ' + requestTypes[i][2] + ' selected >' + requestTypes[i][1] + '</option>';
                } else {
                    // Not selected
                    html += '<option value="' + requestTypes[i][0] + '" ' + requestTypes[i][2] + '>' + requestTypes[i][1] + '</option>';
                }
            }
            html += '</select>';
            html += '&nbsp;for&nbsp;<span style="font-weight:bold;white-space:nowrap;">' + workflowAppTitle + '</span>';
            html += '</span>';

            ////html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 1.77em;">Your currently selected budgeting network: <span style="font-weight:bold;white-space:nowrap;">' + workflowAppTitle + '</span></span>';




            document.getElementById('spanArchiveScreenRequestTypeDropDownSection').innerHTML = html;
            // Now hook up the change event for the drop down!!
            $('#selectArchiveScreenRequestTypeDropDown').change(function () {
                var selectedValue = $('#selectArchiveScreenRequestTypeDropDown option:selected').val();
                bwLastSelectedArchiveScreenRequestType = selectedValue;
                // Save the selected value back to the database so that it remembers how the participant left things, so it is the same when they come back.
                var data = [];
                data = {
                    bwParticipantId: participantId,
                    bwWorkflowAppId: workflowAppId,
                    bwLastSelectedArchiveScreenRequestType: bwLastSelectedArchiveScreenRequestType
                };
                var operationUri = webserviceurl + "/bwparticipant/updateuserconfigurationselectedarchivescreenrequesttype";
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
                            //displayAlertDialog('selectedValue: ' + selectedValue);
                            if (selectedValue == 'budgetrequest') {
                                cmdListAllBudgetRequestsUsingClientDatasetApproach();
                            } else if (selectedValue == 'quoterequest') {
                                //displayAlertDialog('The functionality to display Quote Requests is incomplete. Coming soon!');
                                //populateStartPageItem('divArchive'); // Resets back to Budget Requests or now until we get this hooked up!
                                cmdListAllQuoteRequestsUsingClientDatasetApproach();
                            } else if (selectedValue == 'expenserequest') {
                                //displayAlertDialog('The functionality to display Reimbursement Requests is incomplete. Coming soon!');
                                //populateStartPageItem('divArchive'); // Resets back to Budget Requests or now until we get this hooked up!
                                cmdListAllReimbursementRequestsUsingClientDatasetApproach();
                            } else if (selectedValue == 'recurringexpense') {
                                cmdDisplayArchivePageRecurringExpenses();
                            } else if (selectedValue == 'participant') {
                                //displayAlertDialog('The functionality to display Participant details is incomplete. Coming soon!');
                                //populateStartPageItem('divArchive'); // Resets back to Budget Requests or now until we get this hooked up!
                                cmdListAllParticipantsUsingClientDatasetApproach();
                            }
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        displayAlertDialog('Error in my.js.cmdChooseSelectedWorkflow(): ' + errorCode + ' ' + errorMessage);
                    }
                });
            });
        }


        //if (requestTypes.length == 1) {
        //    bwLastSelectedArchiveScreenRequestType == 'budgetrequests';
        //} else {
        // These 2 lines are required to display the Archive section the first time around. The change event (above) will do it subsequently when the drop down is changed.
        var selectedValue = $('#selectArchiveScreenRequestTypeDropDown option:selected').val();
        bwLastSelectedArchiveScreenRequestType = selectedValue;
        //}

        // This section will be changed. Not happy with it yet!
        //var html = '';
        //html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 1.77em;">Your currently selected budgeting network: <span style="font-weight:bold;white-space:nowrap;">' + workflowAppTitle + '</span></span>';
        //html += '<br /><br />';
        //if (recurringExpensesEnabled == true) {
        //    html += '<input type="button" value="View budget requests" onclick="cmdListAllBudgetRequestsUsingClientDatasetApproach();" style="cursor:pointer;" />&nbsp;&nbsp<input type="button" value="View recurring expenses" onclick="cmdDisplayArchivePageRecurringExpenses();" style="cursor:pointer;" />&nbsp;&nbsp';
        //}
        //html += '<input type="button" disabled value="View trashbin contents" onclick="cmdDisplayArchivePageTrashbinContents();" style="cursor:pointer;" />&nbsp;&nbsp;<input type="button" disabled value="View extended information" onclick="cmdDisplayArchivePageExtendedInformation();" style="cursor:pointer;" /><br /><br />';
        //$('#spanArchivePageTopTitle').html(html);
        //
        //debugger;
        //return new Promise(function (resolve, reject) {
        //    $.get(imagePath).done(function () {
        //        debugger;
        //    }).fail(function () {
        //        // do nothing, it just didn't find an image.
        //        resolve();
        //    });
        //});

        //GetWorkflowAppConfigurationData9 = $.Deferred();
        //GetWorkflowAppConfigurationData9
        //    .done(function () {
        //debugger;
        //displayAlertDialog('DONE');
        //selectArchivePageFilterDropDown_change();
        //var selectedValue = $('#selectArchivePageFilterDropDown option:selected').val();
        if (!bwLastSelectedArchiveScreenRequestType) bwLastSelectedArchiveScreenRequestType = 'budgetrequest';
        if (bwLastSelectedArchiveScreenRequestType == 'budgetrequest') {
            //debugger;
            //cmdListAllBudgetRequestsUsingClientDatasetApproach();

            if ($('#spanBwBudgetRequests').bwDataGrid()) {
                //debugger;
                //alert('Instantiating bwDataGrid xcx124324125 from my3.js.renderArchive().');
                //$('#spanBwBudgetRequests').bwDataGrid({}); //'renderDataGrid');
            } else {
                //debugger;
                //var dataGridOptions = {};
                alert('Instantiating bwDataGrid xcx124324125 from my3.js.renderArchive().');
                var $datagrid = $('#spanBwBudgetRequests').bwDataGrid({});
            }



            //$('.bwDataGrid').bwDataGrid()


        } else if (bwLastSelectedArchiveScreenRequestType == 'quoterequest') {
            //displayAlertDialog('The functionality to display Quote Requests is incomplete. Coming soon!');
            //populateStartPageItem('divArchive'); // Resets back to Budget Requests or now until we get this hooked up!
            cmdListAllQuoteRequestsUsingClientDatasetApproach();
        } else if (bwLastSelectedArchiveScreenRequestType == 'expenserequest') {
            //displayAlertDialog('The functionality to display Reimbursement Requests is incomplete. Coming soon!');
            //populateStartPageItem('divArchive'); // Resets back to Budget Requests or now until we get this hooked up!
            cmdListAllReimbursementRequestsUsingClientDatasetApproach();
        } else if (bwLastSelectedArchiveScreenRequestType == 'recurringexpense') {
            cmdDisplayArchivePageRecurringExpenses();
        } else if (bwLastSelectedArchiveScreenRequestType == 'participant') {
            cmdListAllParticipantsUsingClientDatasetApproach();
        }

        //renderLeftButtons('divArchivePageLeftButtons');
        //})
        //.fail(function () {
        //    handleExceptionWithAlert('Error in my.js.populateStartPageItem(divFunctionalAreas)', 'GetWorkflowAppConfigurationData9.fail()');
        //});

        //GetWorkflowAppConfigurationData9();
        //debugger;
        //$('#divBwCoreComponent').bwCoreComponent('loadWorkflowAppConfigurationDetails9');




    } catch (e) {
        console.log('Exception in renderArchive(): ' + e.message + ', ' + e.stack);
    }
}

function renderActivity() {
    try {
        console.log('In renderActivity().');
        //var requestTypes = bwEnabledRequestTypes.EnabledItems;

        try {
            $('#FormsEditorToolbox').dialog('close');
        } catch (e) { }

        //$('#bwStartPageAccordion').show();
        $('#bwQuickLaunchMenuTd').css({
            width: '0'
        }); // This gets rid of the jumping around.
        //$('#bwQuickLaunchMenu').hide();
        $('#liWelcome').hide();
        $('#liNewRequest').hide();
        $('#liHelp').hide();
        $('#liArchive').hide();
        $('#liConfiguration').hide();
        $('#liSummaryReport').show();
        var e1 = document.getElementById('divSummaryReportMasterDiv');
        e1.style.borderRadius = '20px 0 0 20px';

        var canvas = document.getElementById("myCanvas");
        if (canvas) {
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines
            canvas.style.zIndex = -1;
        }


        //debugger; //-THISNEEDSTOBECHANGED // This is the "Activity" section. >> RENAMED TO: renderActivity();
        if (bwEnabledRequestTypes.Details && bwEnabledRequestTypes.Details.QuoteRequests.Enabled == true) {
            // First we have to add the checkbox to the DOM.
            $('#divBudgetRequestsOrQuotes').html('<label for="budgetRequestsOrQuotes"></label><input type="checkbox" name="budgetRequestsOrQuotes" id="budgetRequestsOrQuotes" />');
            // Then we attach the switchbutton.
            var brOrQuotesOptions = {
                show_labels: true,         // Should we show the on and off labels?
                labels_placement: "both",  // Position of the labels: "both", "left" or "right"
                on_label: "Quotes",            // Text to be displayed when checked
                off_label: "Budget<br />Requests",          // Text to be displayed when unchecked
                width: 50,                 // Width of the button in pixels
                height: 22,                // Height of the button in pixels
                button_width: 24,         // Width of the sliding part in pixels
                clear_after: null         // Override the element after which the clearing div should be inserted 
            };
            $("input#budgetRequestsOrQuotes").switchButton(brOrQuotesOptions);
            // Then we hook up the event.
            $('#budgetRequestsOrQuotes').change(function () {

                // displayAlertDialog('checking financialOrParticipantSummary2');


                if ($('#budgetRequestsOrQuotes').is(':checked')) {

                    if (!$('#financialOrParticipantSummary').is(':checked')) {
                        renderFinancialSummary9(true);
                    } else if ($('#financialOrParticipantSummary').is(':checked')) {
                        renderParticipantSummary(true);
                    } else {
                        displayAlertDialog('financialOrParticipantSummary is in an invalid state.');
                    }
                } else if (!$('#budgetRequestsOrQuotes').is(':checked')) {
                    if (!$('#financialOrParticipantSummary').is(':checked')) {
                        renderFinancialSummary9(false);
                    } else if ($('#financialOrParticipantSummary').is(':checked')) {
                        renderParticipantSummary(false);
                    } else {
                        displayAlertDialog('financialOrParticipantSummary is in an invalid state.');
                    }
                } else {
                    displayAlertDialog('budgetRequestsOrQuotes is in an invalid state.');
                }
            });
        } else {
            $('#divBudgetRequestsOrQuotes').empty();
        }

        //loadWorkflowAppConfigurationDetailsForBwm(); // Todd: Just commented this 6-29-16 3-20am ast.
        //loadWorkflowAppConfigurationDetails9();

        //GetWorkflowAppConfigurationData9 = $.Deferred();
        //GetWorkflowAppConfigurationData9
        //    .done(function () {
        //displayAlertDialog('DONE');
        //renderLeftButtons('divSummaryPageLeftButtons');

        var html = '';
        if (BWMData[1][0].length > 1) {
            html += '<select id="ddlYear" onchange="cmdYearSelectedChanged();"></select>';
        } else {
            html += BWMData[1][0]; // year
        }




        //
        //
        // TODD: THIS NEEDS TO BE FIXED!!!!!!!!!!!!!!!!!!
        //
        // Set the year drop down. HARDCODED!!!
        // IF MORE THAN 1 YEAR: <select id="ddlYear" onchange="cmdYearSelectedChanged();"></select>
        //var year = '2020'; //new Date().getFullYear().toString(); // todd hardcoded.
        //var html = '';
        //html += year;
        //document.getElementById('spanSummaryReportYear').innerHTML = html;
        // Populate the year drop down.
        //debugger;
        $('.bwCoreComponent').bwCoreComponent('populateTheYearDropdown', 'spanSummaryReportYear', false);






        //displayAlertDialog('checking financialOrParticipantSummary3');
        //document.getElementById('financialOrParticipantSummary')[0].removeAttribute('checked'); //('#financialOrParticipantSummary').attr('checked', '');

        if (!$('#financialOrParticipantSummary').is(':checked')) {
            // "Financial Summary" has been selected.
            //displayAlertDialog('financialSummary3');
            if (!$('#budgetRequestsOrQuotes').is(':checked')) {
                //displayAlertDialog('renderFinancialSummary9(false);');
                renderFinancialSummary9(false);
            } else if ($('#budgetRequestsOrQuotes').is(':checked')) {
                displayAlertDialog('renderFinancialSummary9(true);');
                renderFinancialSummary9(true);
            }
        } else if ($('#financialOrParticipantSummary').is(':checked')) {
            // "Participant Summary" has been selected.
            //displayAlertDialog('participantSummary3');
            if (!$('#budgetRequestsOrQuotes').is(':checked')) {
                renderParticipantSummary(false);
            } else if ($('#budgetRequestsOrQuotes').is(':checked')) {
                renderParticipantSummary(true);
            }
        }
        //})
        //.fail(function () {
        //    handleExceptionWithAlert('Error in my.js.populateStartPageItem(divSummaryReport)', 'GetWorkflowAppConfigurationData9.fail()');
        //});

        //debugger;
        //$('#divBwCoreComponent').bwCoreComponent('loadWorkflowAppConfigurationDetails9');





    } catch (e) {
        console.log('Exception in renderActivity(): ' + e.message + ', ' + e.stack);
    }
}

function renderTrackSpending() {
    try {
        //console.log('In renderConfigurationWorkflow().');
        //var requestTypes = bwEnabledRequestTypes.EnabledItems;

        $('#bwQuickLaunchMenuTd').css({
            width: '0'
        }); // This gets rid of the jumping around.

        try {
            $('#FormsEditorToolbox').dialog('close');
        } catch (e) { }

        $('#liWelcome').hide();
        $('#liNewRequest').hide();
        $('#liHelp').hide();
        $('#liArchive').hide();
        $('#liConfiguration').hide();
        $('#liSummaryReport').hide();
        $('#liVisualizations').show();
        //var e1 = document.getElementById('divSummaryReportMasterDiv');
        //e1.style.borderRadius = '20px 0 0 20px';

        var canvas = document.getElementById("myCanvas");
        if (canvas) {
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines
            canvas.style.zIndex = -1;
        }

        //renderLeftButtons('divVisualizationsPageLeftButtons');

        //$('#divFunctionalAreasMasterDiv').empty(); // Clear the div and rebuild it with out new 'Departments' title.
        //$('#divFunctionalAreasMasterSubMenuDiv').hide(); //This si the top bar which we want to hide in this case.

        //var html = '';
        //html += '<table style="border-width: 0px; margin: 0px; padding: 0px; width: 100%;"><tbody><tr style="border-width: 0px; margin: 0px; padding: 0px;"><td style="border-width: 0px; margin: 0px; padding: 0px;">';
        //html += 'Workflow: <span style="font-weight:bold;color:#95b1d3;">Configure your workflow and email for this organization...</span>';
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
        try {
            $('#divBwVisualizations').bwTrackSpending('renderTrackSpending');
        } catch (e) {
            var options = {};
            var $bwvisualizations = $("#divBwVisualizations").bwTrackSpending(options);
        }





    } catch (e) {
        console.log('Exception in renderTrackSpending(): ' + e.message + ', ' + e.stack);
    }
}

function renderConfigurationWorkflow() {
    try {
        //console.log('In renderConfigurationWorkflow().');
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
        //html += 'Workflow: <span style="font-weight:bold;color:#95b1d3;">Configure your workflow and email for this organization...</span>';
        //html += '</td></tr></tbody></table>';
        //$('#divPageContent3').html(html);





        //
        //disableDepartmentsButton();
        //disableRaciSettingsButton();
        //$('#divFunctionalAreasSubSubMenus').empty();


        var html = '';
        html += '<div id="divWorkflowEditor"></div>';
        $('#divPageContent3').append(html);
        //
        // Render the workflow editor.
        //





        //debugger; //-THISNEEDSTOBECHANGED // This is the "Workflow Editor". >> RENAME TO: renderConfigurationWorkflow();

        var options = {
            displayWorkflowPicker: true,
            bwTenantId: tenantId,
            bwWorkflowAppId: workflowAppId,
            bwEnabledRequestTypes: bwEnabledRequestTypes
        };
        var $bwworkfloweditor = $("#divWorkflowEditor").bwWorkflowEditor(options);



    } catch (e) {
        console.log('Exception in renderConfigurationWorkflow(): ' + e.message + ', ' + e.stack);
    }
}

//function renderConfigurationLocations() {
//    try {
//        console.log('In renderConfigurationLocations().');
//        //var requestTypes = bwEnabledRequestTypes.EnabledItems;

//        $('#bwQuickLaunchMenuTd').css({
//            width: '0'
//        }); // This gets rid of the jumping around.

//        $('#divFunctionalAreasMasterDiv').empty(); // Clear the div and rebuild it with out new 'Departments' title.
//        $('#divFunctionalAreasMasterSubMenuDiv').hide(); //This si the top bar which we want to hide in this case.

//        var html = '';
//        html += '<table style="border-width: 0px; margin: 0px; padding: 0px; width: 100%;"><tbody><tr style="border-width: 0px; margin: 0px; padding: 0px;"><td style="border-width: 0px; margin: 0px; padding: 0px;">';
//        html += 'Workflow...';
//        html += '</td></tr></tbody></table>';
//        $('#divFunctionalAreasMasterDiv').html(html);
//        //
//        //disableDepartmentsButton();
//        disableRaciSettingsButton();
//        $('#divFunctionalAreasSubSubMenus').empty();


//        var html = '';
//        html += '<div id="divLocationEditor"></div>';
//        $('#divFunctionalAreasSubSubMenus').html(html);
//        //
//        // Render the workflow editor.
//        //

//        //generateLocationsListButtons();



//        //debugger; //-THISNEEDSTOBECHANGED // This is the "Workflow Editor". >> RENAME TO: renderConfigurationWorkflow();

//        var options = {
//            displayWorkflowPicker: true,
//            bwTenantId: tenantId,
//            bwWorkflowAppId: workflowAppId,
//            bwEnabledRequestTypes: bwEnabledRequestTypes
//        };
//        var $bwlocationeditor = $("#divLocationEditor").bwLocationEditor(options);



//    } catch (e) {
//        console.log('Exception in renderConfigurationLocations(): ' + e.message + ', ' + e.stack);
//    }
//}

function renderConfigurationOrgRoles() {
    try {
        console.log('In renderConfigurationOrgRoles().');

        $('#bwQuickLaunchMenuTd').css({
            width: '0'
        }); // This gets rid of the jumping around.

        try {
            $('#FormsEditorToolbox').dialog('close');
        } catch (e) { }

        $('#divFunctionalAreasMasterDiv').empty(); // Clear the div and rebuild it with out new 'Departments' title.
        $('#divFunctionalAreasMasterSubMenuDiv').hide(); //This si the top bar which we want to hide in this case.

        var html = '';

        html += '<table style="border-width: 0px; margin: 0px; padding: 0px; width: 100%;"><tbody><tr style="border-width: 0px; margin: 0px; padding: 0px;"><td style="border-width: 0px; margin: 0px; padding: 0px;">';
        html += 'Organization: ';
        html += '<span style="font-weight:bold;color:#95b1d3;cursor:help;" ';
        // Hoverover text for RACI.
        html += ' title="';
        //html += 'Role distinction: ';
        //html += 'There is a distinction between a role and individually identified people: a role is a descriptor of an associated set of tasks; may be performed by many people; and one person can perform many roles. For example, an organization may have ten people who can perform the role of project manager, although traditionally each project only has one project manager at any one time; and a person who is able to perform the role of project manager may also be able to perform the role of analyst and tester. ';
        //html += 'R = Responsible (also Recommender)';
        //html += 'Those who do the work to complete the task.[6] There is at least one role with a participation type of responsible, although others can be delegated to assist in the work required (see also RASCI below for separately identifying those who participate in a supporting role).';
        //html += 'A = Accountable (also Approver or final approving authority)';
        //html += 'The one ultimately answerable for the correct and thorough completion of the deliverable or task, the one who ensures the prerequisites of the task are met and who delegates the work to those responsible.[6] In other words, an accountable must sign off (approve) work that responsible provides. There must be only one accountable specified for each task or deliverable.[7]';
        //html += 'C = Consulted (sometimes Consultant or counsel)';
        //html += 'Those whose opinions are sought, typically subject matter experts; and with whom there is two-way communication.[6]';
        //html += 'I = Informed (also Informee)';
        //html += 'Those who are kept up-to-date on progress, often only on completion of the task or deliverable; and with whom there is just one-way communication.[6]';
        //html += 'Very often the role that is accountable for a task or deliverable may also be responsible for completing it (indicated on the matrix by the task or deliverable having a role accountable for it, but no role responsible for its completion, i.e. it is implied). Outside of this exception, it is generally recommended that each role in the project or process for each task receive, at most, just one of the participation types. Where more than one participation type is shown, this generally implies that participation has not yet been fully resolved, which can impede the value of this technique in clarifying the participation of each role on each task. ';
        html += 'RACI: ';
        html += '\n';
        html += 'R = Responsible (also Recommender)  ';
        html += '\n';
        html += 'A = Accountable (also Approver or final approving authority)  ';
        html += '\n';
        html += 'C = Consulted (sometimes Consultant or counsel)  ';
        html += '\n';
        html += 'I = Informed (also Informee)  ';
        html += '" ';
        html += '>';
        html += 'Configure this Organizations 👤Roles and Workflows...xcx1';
        html += '</span>';
        html += '</td></tr></tbody></table>';

        $('#divFunctionalAreasMasterDiv').html(html);

        disableOrgRoleSettingsButton();
        $('#divFunctionalAreasSubSubMenus').empty();

        var html = '';

        html += '<div id="divBwOrganizationEditor"></div>';
        $('#divFunctionalAreasSubSubMenus').html(html);

        //var options = {
        //    displayWorkflowPicker: true,
        //    bwTenantId: tenantId,
        //    bwWorkflowAppId: workflowAppId,
        //    bwEnabledRequestTypes: bwEnabledRequestTypes
        //};
        //var $bworgroleseditor = $("#divBwOrganizationEditor").bwOrganizationEditor(options);

    } catch (e) {
        console.log('Exception in renderConfigurationOrgRoles(): ' + e.message + ', ' + e.stack);
        displayAlertDialog('Exception in renderConfigurationOrgRoles(): ' + e.message + ', ' + e.stack);
    }
}


function renderConfigurationMonitoringTools() {
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
        //html += 'Monitor + Tools: <span style="font-weight:bold;color:#95b1d3;">System Status and Health for this organization</span>';
        //html += '</td></tr></tbody></table>';
        //$('#divPageContent3').html(html);
        //
        //disableDepartmentsButton();
        //disableRaciSettingsButton();
        //disableMonitoringButton();
        //$('#divFunctionalAreasSubSubMenus').empty();


        var html = '';
        html += '<div id="divBwMonitoringTools"></div>';
        $('#divPageContent3').html(html);
        //
        // Render
        //

        //generateLocationsListButtons();


        var options = {
            displayOnCreation: true,
            displayWorkflowPicker: true,
            bwTenantId: tenantId,
            bwWorkflowAppId: workflowAppId,
            bwEnabledRequestTypes: bwEnabledRequestTypes
        };
        var $bwmonitoringtools = $("#divBwMonitoringTools").bwMonitoringTools(options);



    } catch (e) {
        console.log('Exception in renderConfigurationMonitoringTools(): ' + e.message + ', ' + e.stack);
        displayAlertDialog('Exception in renderConfigurationMonitoringTools(): ' + e.message + ', ' + e.stack);
    }
}

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
        // We need to be checking if the bwAdvancedProductSearch.js widget is already instantiated. This is the only widget that works this way, because when it is first invoked, 
        // we only want to load inventory once, then refer back to it on an ongoing basis on the client side. 4-4-2023
        //

        if ($('.bwAdvancedProductSearch').length && ($('.bwAdvancedProductSearch').length > 0)) {

            // It has already been instantiated.
            console.log('In index.js.renderConfigurationInventory(). bwAdvancedProductSearch.js widget has already been instantiated. xcx21312341');

            $('.bwAdvancedProductSearch').bwAdvancedProductSearch('renderConfigurationInventoryScreen', 'divBwInventory');

        } else {

            // We have to instantiate it.
            console.log('');
            console.log('WE HAVE TO INSTANTIATE THE bwAdvancedProductSearch WIDGET. xcx21312341');
            console.log('');

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

        }


        //var BWCustomer = {
        //    "CustomerIdentifier": "4242",
        //    "Description": "19601000_BW CO.",
        //    "Level": 2,
        //    "LevelDescription": "2",
        //    "City": "NOVA SCOTIA",
        //    "State": "OH",
        //    "CurrencyCode": "USD",
        //    "CompanyNumber": "155",
        //    "SellingChannel": "BPSF",
        //    "ERP": "BW1"
        //}

        //var options = {
        //    SearchingForModule: 'Distributor',
        //    ERP: 'BW1',
        //    BWCustomer: BWCustomer,
        //    DisplayConfigurationInventory: true
        //};
        //var $bwinventory = $("#divBwInventory").bwAdvancedProductSearch(options);

        //var options = {};
        //var $bwinventorybundling = $("#divBwInventoryBundling").bwDistributorBundling(options);





    } catch (e) {
        console.log('Exception in renderConfigurationInventory(): ' + e.message + ', ' + e.stack);
        displayAlertDialog('Exception in renderConfigurationInventory(): ' + e.message + ', ' + e.stack);
    }
}

//function cmdDisplayLoggedInUserDetailsInDropDown(loggedInUserSpanTagId) {
//    // This is the arrow next to the logged in user in the top menu bar.
//    // The logged in user drop down.
//    //$(function () {

//    $('#spanLoggedInUserDropDownDialogTitle').html(participantFriendlyName);



//    //$("#bwLoggedInUserDropDown").dialog({
//    //    autoOpen: true,
//    //    width: "400px",
//    //    position: {
//    //        my: "left top",
//    //        at: "left bottom",
//    //        of: document.getElementById(loggedInUserSpanTagId) // This hides the close button.
//    //    },
//    //    open: function (event, ui) {
//    //        $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
//    //        // Add the click event and set the click tracker variable.
//    //        hideLoggedInUserDropDownFirstClickTracker = false;
//    //        var elem = document.getElementById("divDocumentBody");
//    //        elem.addEventListener("click", hideLoggedInUserDropDown);
//    //    }
//    //});

//    //// Hide the title bar.
//    //$("#bwLoggedInUserDropDown").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();



//    //$('.bwAuthentication').bwAuthentication('displayParticipantRoleMultiPickerInACircle', true, 'btnEditRaciRoles_undefined', 'undefined', 'Fred Flintstone', 'fred@budgetrequests.com');
//    // LoggedInUserDropDown
//    $('.bwCircleDialog').bwCircleDialog('displayLoggedInUserDropDownInACircle', true); //, 'btnEditRaciRoles_undefined'); //, participantId, 'Fred Flintstone', 'fred@budgetrequests.com');


//}


function hideLoggedInUserDropDown() {
    //displayAlertDialog('hideLoggedInUserDropDown. hideLoggedInUserDropDownFirstClickTracker=' + hideLoggedInUserDropDownFirstClickTracker);
    if (hideLoggedInUserDropDownFirstClickTracker == false) {
        hideLoggedInUserDropDownFirstClickTracker = true; // First time around we need to set this so subsequent clicks work ok!
    } else {
        $("#bwLoggedInUserDropDown").dialog("close");
        // Remove the click event.
        var elem = document.getElementById("divDocumentBody");
        elem.removeAttribute("click");
    }
}

function displayArOnTheHomePage(budgetRequestId, participantId, title) {
    // Display the AR on the home page. This is called from the ?displayArDialog and the My Stuff section.
    // Try to close this in case it is open.
    try {
        $('#ArDialog').dialog("close");
    } catch (e) {
    }
    try {

        //var title = $('span[xd\\:binding = "my:Title"]')[0].innerHTML;

        $('#bwQuickLaunchMenuTd').css({
            width: '0'
        }); // This gets rid of the jumping around.

        //$('#liNewRequest').hide();
        //$('#liArchive').hide();
        //$('#liSummaryReport').hide();
        //$('#liConfiguration').hide();
        //$('#liHelp').hide();
        //$('#liVisualizations').hide();
        //$('#liWelcome').show();

        //var e1 = document.getElementById('divNewRequestMasterDiv');
        //e1.style.borderRadius = '20px 0 0 20px';

        //renderLeftButtons('divWelcomePageLeftButtons');

        //$('#divWelcomeMasterDivTitle').text('Authorization Request: ' + budgetRequestId);
        $('#divWelcomeMasterDivTitle').text('Authorization Request: ' + title);

        //displayAlertDialog('SET THE TITLE3');

        //document.getElementById('divWelcomePageLeftButtonsWelcomeButton').className = 'divLeftButton';

        //displayAlertDialog('SET THE TITLE4');

        $('#divWelcomePageLeftButtonsWelcomeButton').click(function () {
            //renderWelcomeScreen();
            redirectForm();
        });

        var html = '<div id="myxml" align="left" style="FONT-SIZE: 10pt; FONT-FAMILY: Calibri;"></div>';
        $('#divWelcomeMessage').html(html);

        var action = "";
        filename = budgetRequestId;

        alert('Need to display the AR. Not doing it with XSL and XML binding anymore, are we?');
        //// displayForm_DisplayArBasedOnWorkflowStatus2(budgetRequestId, action, participantId);
    } catch (e) {
        displayAlertDialog('Error in my.js.displayArOnTheHomePage(): ' + e.message + ', ' + e.stack)
    }
}

function displayExcelDocumentInBrowser() {
    try {
        console.log('In displayExcelDocumentInBrowser().');
        //alert('In displayExcelDocumentInBrowser(). This functionality is incomplete. Coming soon!');

        //divExcelFileViewerDialog
        $("#divExcelFileViewerDialog").dialog({
            modal: false,
            resizable: true,
            //closeText: "Cancel",
            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
            //title: brTitle + ' (' + arName.replace('.xml', '') + ")",
            //title: brTitle + " (" + title + ")",
            width: "720px",
            dialogClass: "no-close", // No close button in the upper right corner.
            hide: false,//, // This means when hiding just disappear with no effects.
            //buttons: {
            //    "Close": function () {
            //        $(this).dialog("close");
            //    }
            //}
            open: function (event, ui) {
                //$('.ui-widget-overlay').bind('click', function () {
                //    $("#divExcelFileViewerDialog").dialog('close');
                //});

                $("#AttachmentsDialog1").dialog('close');

            } // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.
        });
        //$("#AttachmentsDialog1").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();






    } catch (e) {
        console.log('Exception in displayExcelDocumentInBrowser(): ' + e.message + ', ' + e.stack);
    }
}

//function displayAttachmentInDialog(fileUrl, filename, description, bwBudgetRequestId) {
//    try {
//        console.log('');
//        console.log('ADD THE ZOOM SLIDER TO THIS DIALOG!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
//        console.log('*********************************************************************');
//        console.log('In my3.js.displayAttachmentInDialog("' + fileUrl + '", "' + filename + '", "' + description + '", "' + bwBudgetRequestId + '").');
//        console.log('*********************************************************************');
//        console.log('');

//        var thiz = this;


//        $('#divAttachmentsDialog1Contents').empty(); // We have to empty the contents of the dialog before it is displayed.
//        $("#AttachmentsDialog1").dialog({
//            modal: false,
//            resizable: true,
//            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
//            width: "720px",
//            dialogClass: "no-close", // No close button in the upper right corner.
//            hide: false,//, // This means when hiding just disappear with no effects.
//            close: function () {
//                $(this).dialog('destroy');
//            },
//            open: function () {
//                try {
//                    debugger; // 1-8-2022
//                    var requestDialogId = 'AttachmentsDialog1';

//                    $('#' + requestDialogId).css('overflow', 'hidden'); // This keeps the scroll bars from showing up on the form dialog!!!!!!!! 7-13-2020

//                    var element = document.getElementById(requestDialogId).parentNode; // This is the best way to get a handle on the jquery dialog.
//                    var requestDialogParentId = requestDialogId + '_Parent'; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.
//                    element.id = requestDialogParentId; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.

//                    // This creates the custom header/draggable bar on the dialog!!! 4-2-2020. // ☈ ☇ https://www.toptal.com/designers/htmlarrows/symbols/thunderstorm/
//                    var html = '';

//                    html += '<table style="width:100%;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequestDialog\');">'; // This click event is like "pin". Once the user clicks the header of the request dialog, it no longer is modal and persists on the screen until they choose to close it.
//                    html += '   <tr>';
//                    html += '       <td style="width:95%;">';
//                    html += '           <div id="slider_' + requestDialogId + '" style="width:20%;cursor:pointer;"></div>';
//                    html += '       </td>';
//                    html += '       <td style="vertical-align:middle;width:5%;padding:0;border:0;margin:0;">';
//                    html += '           <span title="print" class="printButton" style="font-size:18pt;cursor:pointer !important;" onclick="$(\'.bwPrintButton\').bwPrintButton(\'PrintIndividualRequestReport\');"><img src="/images/iosprinter_blue.png" style="width:50px;height:50px;cursor:pointer !important;" onclick="$(\'.bwPrintButton\').bwPrintButton(\'PrintIndividualRequestReport\');" /></span>';
//                    html += '       </td>';
//                    html += '       <td>&nbsp;&nbsp;</td>';
//                    html += '       <td>';
//                    html += '           <span class="dialogXButton" style="font-size:25pt;cursor:pointer;width:100%;font-weight:bold;" onclick="$(\'.bwPageScrollingHandler\').bwPageScrollingHandler(\'CloseDialogAndPreventNextWindowScrollEvent\', \'' + requestDialogId.replace('_Parent', '') + '\');">X</span>';
//                    html += '       </td>';
//                    html += '   </tr>';
//                    html += '</table>';
//                    document.getElementById(requestDialogId).parentNode.querySelector(".ui-dialog-titlebar").innerHTML = html;

//                    $("#slider_" + requestDialogId).slider({
//                        min: 50,
//                        max: 200,
//                        value: 100, // It starts off full size.
//                        slide: function (event, ui) {
//                            //thiz.setZoom(ui.value, requestDialogId);
//                            $('.bwRequest').bwRequest('setZoom', ui.value, requestDialogId);
//                        }//,
//                        //change: function (event, ui) {
//                        //    thiz.setZoom(ui.value, requestDialogId);
//                        //}
//                    });
//                    $('.bwRequest').bwRequest('setZoom', '100', requestDialogId);
//                } catch (e) {
//                    console.log('Exception in my3.js.AttachmentsDialog1.dialog.open(): ' + e.message + ', ' + e.stack);
//                    displayAlertDialog('Exception in my3.js.AttachmentsDialog1.dialog.open(): ' + e.message + ', ' + e.stack);
//                }
//            }
//        });
//        //$("#AttachmentsDialog1").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();




//        // We need to add these files extensions below!
//        // .MP3 (audio), .MP4 (audio), .M4A (audio), .M4V (video), .M4R ("tones"), 




//        var html = '';
//        debugger;
//        // We need to present these by using file extension. This displays all images. .jpg, .png, .xx << Todd: need work here.
//        if (fileUrl.toUpperCase().indexOf('.XLSX') > -1 || fileUrl.toUpperCase().indexOf('.XLS') > -1) {

//            // Excel attachments.
//            $('#spanAttachmentsDialog1Title').html('Select the link below to view the EXCEL document...');
//            html += '<a href="' + fileUrl + '" target="_blank"><img src="images/excelicon.png" style="width:100px;height:46px;cursor:pointer;" /></a>';
//            html += '<a href="' + fileUrl + '" target="_blank">Click here to view in EXCEL</a>';
//            //html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
//            //html += '<a href="javascript:displayExcelDocumentInBrowser(\'' + fileUrl + '\');" target="_blank">Click here to view in browser</a>';

//        } else if (fileUrl.toUpperCase().indexOf('.JFIF') > -1 || fileUrl.toUpperCase().indexOf('.PNG') > -1 || fileUrl.toUpperCase().indexOf('.JPG') > -1 || fileUrl.toUpperCase().indexOf('.JPEG') > -1 || fileUrl.toUpperCase().indexOf('.BMP') > -1 || fileUrl.toUpperCase().indexOf('.GIF') > -1 || fileUrl.toUpperCase().indexOf('.TIFF') > -1 || fileUrl.toUpperCase().indexOf('.SVG') > -1) {
//            // Images.
//            $('#spanAttachmentsDialog1Title').html('Select the thumbnail to view the actual image...');
//            html += '<img src="' + fileUrl + '" style="width:700px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;" onclick="displayFullSizedAttachmentInDialog(\'' + fileUrl + '\');" />';
//        } else if (fileUrl.toUpperCase().indexOf('.PDF') > -1 || fileUrl.toUpperCase().indexOf('.RTF') > -1 || fileUrl.toUpperCase().indexOf('.DOC') > -1 || fileUrl.toUpperCase().indexOf('.DOCX') > -1 || fileUrl.toUpperCase().indexOf('.TXT') > -1 || fileUrl.toUpperCase().indexOf('.ODT') > -1 || fileUrl.toUpperCase().indexOf('.ODS') > -1 || fileUrl.toUpperCase().indexOf('.ODP') > -1) {
//            // Documents.
//            $('#spanAttachmentsDialog1Title').html('Select the link below to view the document...');
//            html += '<a href="' + fileUrl + '" target="_blank">Click here to view the document</a>';
//        } else if (fileUrl.toUpperCase().indexOf('.MP3') > -1 || fileUrl.toUpperCase().indexOf('.M4A') > -1 || fileUrl.toUpperCase().indexOf('.M4R') > -1) {
//            // Audio.
//            $('#spanAttachmentsDialog1Title').html('Select the link below to listen...');
//            if (iOSApp == 'YES') {
//                html += '<a href="' + fileUrl + '">Click here to listen</a>';
//            } else {
//                html += '<audio src="' + fileUrl + '" controls="controls">Click here to listen</audio>';
//            }
//        } else if (fileUrl.toUpperCase().indexOf('.M4V') > -1 || fileUrl.toUpperCase().indexOf('.AVI') > -1 || fileUrl.toUpperCase().indexOf('.MOV') > -1) {
//            // Audio.
//            $('#spanAttachmentsDialog1Title').html('Select the link below to view...');
//            if (iOSApp == 'YES') {
//                html += '<a href="' + fileUrl + '">Click here to view</a>';
//            } else {
//                html += '<audio src="' + fileUrl + '" controls="controls">Click here to listen</audio>';
//            }
//        } else if (fileUrl.toUpperCase().indexOf('.MP4') > -1) {
//            alert('video');
//            // Video.
//            $('#spanAttachmentsDialog1Title').html('Select the link below to view...');
//            if (iOSApp == 'YES') {
//                html += '<a href="' + fileUrl + '">Click here to view</a>';
//            } else {
//                html += '<video controls="controls" width="250" ><source src="' + fileUrl + '" type="video/mp4"></video>';
//            }
//        } else {
//            $('#spanAttachmentsDialog1Title').html('This attachment has an unknown file extension...');
//            html += '<a href="' + fileUrl + '" target="_blank">Click here to try to open this file</a>';
//            //html += '<span style="font-size:40pt;">Unknown file extension</span>';
//        }
//        $('#divAttachmentsDialog1Contents').html(html);



//        // Create the "Save" button.
//        html = '';
//        html += '<div id="btnAttachmentsDialog1SaveMetadata" class="divDialogButton" onclick="cmdSaveAttachmentMetadata(\'' + bwBudgetRequestId + '\', \'' + filename + '\');">Save</div>';
//        $('#spanAttachmentsDialog1SaveMetadataButton').html(html);

//        // Create the "Delete" button.
//        html = '';
//        html += '<div id="btnAttachmentsDialog1DeleteAttachment" class="divDialogButton" onclick="cmdDeleteAttachment(\'' + bwBudgetRequestId + '\', \'' + filename + '\');">Delete</div>';
//        $('#spanAttachmentsDialog1DeleteAttachmentButton').html(html);

//        //// Bind the "Save" button.
//        //$('#btnAttachmentsDialog1SaveMetadata').click(function (error) {
//        //    cmdSaveAttachmentMetadata(bwBudgetRequestId, filename);
//        //});

//        //// Bind the "Delete" button.
//        //$('#btnAttachmentsDialog1DeleteAttachment').click(function (error) {
//        //    cmdDeleteAttachment(bwBudgetRequestId, filename);
//        //});









//        // Populate the dialog with the filename and description.
//        if (filename != 'undefined') {
//            var extensionIndex = filename.lastIndexOf('.');
//            var filenamePrefix = filename.substring(0, extensionIndex);
//            var fileExtension = '.' + filename.substring(extensionIndex + 1, filename.length);
//            document.getElementById('txtAttachmentsDialog1Filename').value = filenamePrefix;
//            document.getElementById('spanAttachmentsDialog1FileExtension').innerHTML = fileExtension;
//        } else {
//            document.getElementById('txtAttachmentsDialog1Filename').value = '';
//        }

//        if (filename != 'description') document.getElementById('txtAttachmentsDialog1FileDescription').value = description;
//        else document.getElementById('txtAttachmentsDialog1FileDescription').value = '';

//    } catch (e) {
//        displayAlertDialog('Exception in my.js.displayAttachmentInDialog():2:' + e.message + ', fileUrl: ' + fileUrl + ', ' + e.stack);
//    }
//}

function cmdDeleteAttachment(bwBudgetRequestId, filename) {

    //displayAlertDialog('Getting ready to delete workflowAppId: ' + workflowAppId + ' bwBudgetRequestId: ' + bwBudgetRequestId + ' filename: ' + filename);


    try {
        console.log('In my.js.cmdDeleteAttachment(' + bwBudgetRequestId + ', ' + filename + ').');


        //displayAlertDialog('In bw.offline.core.js.removeAttachmentOffline(' + filename + ', ' + displayAttachmentsTagName + ', ' + _workflowAppId + ', ' + _budgetRequestId + '): TODDDDDD!!!!!!');

        $("#divDeleteAnAttachmentOfflineDialog").dialog({
            modal: true,
            resizable: false,
            closeText: "Cancel",
            closeOnEscape: true, // Hit the ESC key to hide! Yeah!
            //title: 'Delete ' + requestId,
            width: "570px",
            dialogClass: "no-close", // No close button in the upper right corner.
            hide: false, // This means when hiding just disappear with no effects.
            open: function () {
                $('.ui-widget-overlay').bind('click', function () {
                    $("#divDeleteAnAttachmentOfflineDialog").dialog('close');
                });
            }
        });

        // Hide the title bar.
        $("#divDeleteAnAttachmentOfflineDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
        // Set the title.
        document.getElementById('spanDeleteAnAttachmentOfflineDialogTitle').innerHTML = 'Delete ' + filename; // + ' (<em>' + formatCurrency(requestedAmount) + '</em>).';

        // Set the click event for the Delete button.
        $('#divDeleteAnAttachmentOfflineDialogDeleteRequestButton').off('click').click(function (error) {

            var fileserviceurl = globalUrlPrefix + globalUrlForWebServices + '/_files';
            var data = [];
            data = {
                bwBudgetRequestId: bwBudgetRequestId,
                Filename: filename
            };
            var operationUri = fileserviceurl + "/removeattachment";
            $.ajax({
                url: operationUri,
                type: "POST", timeout: ajaxTimeout,
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {

                    $("#divDeleteAnAttachmentOfflineDialog").dialog('close');

                    if (JSON.stringify(data).toUpperCase().indexOf('THE FILE WAS DELETED') > -1) {
                        $('#AttachmentsDialog1').dialog('close');
                        alert('xcx213234-1 calling populateAttachments().');
                        populateAttachments(workflowAppId, bwBudgetRequestId, 'attachmentsInXslForm', true);
                    } else {
                        displayAlertDialog('There was an error deleting the file: ' + JSON.stringify(data));
                    }

                },
                error: function (data, errorCode, errorMessage) {
                    //displayAlertDialog('Error in Start.js.displayConnectedWorkflows()', '1:' + errorCode + ', ' + errorMessage);
                    displayAlertDialog('Error In my.js.cmdDeleteAttachment(' + bwBudgetRequestId + ', ' + filename + ').removeattachment: ' + errorMessage);
                }
            });

        });

    } catch (e) {
        displayAlertDialog('Error In my.js.cmdDeleteAttachment(' + bwBudgetRequestId + ', ' + filename + '): ' + e.message);
    }
}

function cmdSaveAttachmentMetadata(bwBudgetRequestId, originalFilename) {
    try {
        console.log('In my3.js.cmdSaveAttachmentMetadata().');

        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

        var newFilename = document.getElementById('txtAttachmentsDialog1Filename').value + document.getElementById('spanAttachmentsDialog1FileExtension').innerHTML;
        var description = document.getElementById('txtAttachmentsDialog1FileDescription').value.replace(/["']/g, '');

        //displayAlertDialog('Saving attachment metadata, bwBudgetRequestId: ' + bwBudgetRequestId + ' filename: ' + filename + ' newFilename: ' + newFilename + ' description: ' + description);

        var fileserviceurl = globalUrlPrefix + globalUrlForWebServices + '/_files';
        var data = [];
        data = {
            bwWorkflowAppId: workflowAppId,
            bwBudgetRequestId: bwBudgetRequestId,
            OriginalFilename: originalFilename,
            NewFilename: newFilename,
            Description: description
        };
        var operationUri = fileserviceurl + "/saveattachmentmetadata";
        $.ajax({
            url: operationUri,
            type: "POST", timeout: ajaxTimeout,
            data: data,
            headers: {
                "Accept": "application/json; odata=verbose"
            },
            success: function (data) {
                try {
                    if (JSON.stringify(data).toUpperCase().indexOf('THE FILE WAS SAVED') > -1) {
                        $('#AttachmentsDialog1').dialog('close');

                        // I named the attachment section differently depending on if it is a new request or not. This may not have been necessary, but for now this addresses the issue.
                        if (document.getElementById('attachmentsInXslForm')) {
                            alert('xcx213234-2 calling populateAttachments().');
                            populateAttachments(workflowAppId, bwBudgetRequestId, 'attachmentsInXslForm', true);
                        } else {
                            alert('xcx213234-3 calling populateAttachments().');
                            populateAttachments(workflowAppId, bwBudgetRequestId, 'newrequestattachments', true);
                        }

                    } else {
                        displayAlertDialog('Failed to update metadata: ' + JSON.stringify(data));
                    }
                } catch (e) {
                    console.log('Exception in my3.js.cmdSaveAttachmentMetadata(): ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in my3.js.cmdSaveAttachmentMetadata(): ' + e.message + ', ' + e.stack);
                }
            },
            error: function (data, errorCode, errorMessage) {

                $('#AttachmentsDialog1').dialog('close');

                //displayAlertDialog('Error in Start.js.displayConnectedWorkflows()', '1:' + errorCode + ', ' + errorMessage);
                displayAlertDialog('Error in ios8.js.cmdSaveAttachmentMetadata().saveattachmentmetadata: ' + data + ', ' + errorMessage);
            }
        });
    } catch (e) {
        console.log('Exception in my3.js.cmdSaveAttachmentMetadata():2: ' + e.message + ', ' + e.stack);
        displayAlertDialog('Exception in my3.js.cmdSaveAttachmentMetadata():2: ' + e.message + ', ' + e.stack);
    }
}

function formatDateAndTimeFromBW(dateIn) {
    //displayAlertDialog('dateIn: ' + dateIn);
    // Returns a nicely formatted date and time for display.
    var result;
    if (dateIn) {
        try {
            var month = monthNames[Number(dateIn.split('-')[1]) - 1].trim();
            var day = dateIn.split('-')[2].split('T')[0].trim();
            var year = dateIn.split('-')[0].trim();
            var hour = dateIn.split('-')[2].split('T')[1].split(':')[0];
            var minutes = dateIn.split('-')[2].split('T')[1].split(':')[1];
            if (minutes.length == 1) minutes = '0' + minutes; // So that the time doesn't get displayed like 10:1, but 10:01 for instance.
            var meridianIndicator = '';
            if (hour > 12) {
                meridianIndicator = 'PM';
                hour = hour - 12;
            } else {
                meridianIndicator = 'AM';
            }
            result = month + ' ' + day + ', ' + year + ' at ' + hour + ':' + minutes + meridianIndicator;
        } catch (e) {
            result = 'Error in start.js.formatDateAndTimeFromBW(' + dateIn + '): ' + e.message;
        }
    } else {
        result = '';
    }
    return result;
}



function displayRecurringExpenseOnTheHomePage(recurringExpenseId, participantId, title) {
    // Display the AR on the home page. This is called from the ?displayArDialog and the My Stuff section.
    // Try to close this in case it is open.
    //try {
    //    $('#ArDialog').dialog("close");
    //} catch (e) {
    //}
    try {

        //var title = $('span[xd\\:binding = "my:Title"]')[0].innerHTML;

        $('#bwQuickLaunchMenuTd').css({
            width: '0'
        }); // This gets rid of the jumping around.

        $('#liNewRequest').hide();
        $('#liArchive').hide();
        $('#liSummaryReport').hide();
        $('#liConfiguration').hide();
        $('#liHelp').hide();
        $('#liVisualizations').hide();
        $('#liWelcome').show();

        var e1 = document.getElementById('divNewRequestMasterDiv');
        e1.style.borderRadius = '20px 0 0 20px';



        //$('#divWelcomeMasterDivTitle').text('Authorization Request: ' + budgetRequestId);
        $('#divWelcomeMasterDivTitle').text('Recurring Expense: New Budget Request');



        document.getElementById('divWelcomePageLeftButtonsWelcomeButton').className = 'divLeftButton';



        $('#divWelcomePageLeftButtonsWelcomeButton').off('click').click(function () {
            //renderWelcomeScreen();
            redirectForm();
        });

        //displayAlertDialog('SET THE TITLE5');

        var html = '<div id="myxml" align="left" style="FONT-SIZE: 10pt; FONT-FAMILY: Calibri;"></div>';
        $('#divWelcomeMessage').html(html);

        //displayAlertDialog('SET THE TITLE4');

        var action = "";
        //filename = budgetRequestId;

        document.getElementById('divWelcomePageLeftButtonsNewRequestButton').className = 'divLeftButtonSelected';

        displayForm_DisplayRecurringExpense(recurringExpenseId, action, participantId); // displayForm_DisplayArBasedOnWorkflowStatus(recurringExpenseId, action, participantId);
    } catch (e) {
        displayAlertDialog('Error in my.js.displayRecurringExpenseOnTheHomePage(): ' + e.message)
    }
}

function hookUpThePeoplePickers() {
    // Now we can hook up the Participant text box for autocomplete.
    //var tenantId = '1';
    // Now we can hook up the Participant text box for autocomplete.
    $("#txtApprover1FriendlyName").autocomplete({
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
            //var searchValue = this.value.split(' ')[0] + ' ' + this.value.split(' ')[1

            var approverName = this.value.split('|')[0];
            var approverId = this.value.split('|')[1];
            var approverEmail = this.value.split('|')[2];

            if (approverName.indexOf('undefined') > -1) {
                document.getElementById('txtApprover1FriendlyName').value = '';
                document.getElementById('txtApprover1Id').value = '';
                document.getElementById('txtApprover1Email').value = '';
            } else {
                document.getElementById('txtApprover1FriendlyName').value = approverName; //this.value.split(' ')[0] + ' ' + this.value.split(' ')[1]; // Just shows the Loan Number parameter (removing the borrower name) so it fits in the text box.
                document.getElementById('txtApprover1FriendlyName').setAttribute('title', approverEmail);
                document.getElementById('txtApprover1Id').value = approverId;
                document.getElementById('txtApprover1Email').value = approverEmail;
            }
        }
    });

    $("#txtApprover2FriendlyName").autocomplete({
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
            //if (searchValue.indexOf('undefined') > -1) document.getElementById('txtApprover2Name').value = '';
            //else document.getElementById('txtApprover2Name').value = searchValue; //this.value.split(' ')[0] + ' ' + this.value.split(' ')[1]; // Just shows the Loan Number parameter (removing the borrower name) so it fits in the text box.

            var approverName = this.value.split('|')[0];
            var approverId = this.value.split('|')[1];
            var approverEmail = this.value.split('|')[2];

            if (approverName.indexOf('undefined') > -1) {
                document.getElementById('txtApprover2FriendlyName').value = '';
                document.getElementById('txtApprover2Id').value = '';
                document.getElementById('txtApprover2Email').value = '';
            } else {
                document.getElementById('txtApprover2FriendlyName').value = approverName;
                document.getElementById('txtApprover2FriendlyName').setAttribute('title', approverEmail);
                document.getElementById('txtApprover2Id').value = approverId;
                document.getElementById('txtApprover2Email').value = approverEmail;
            }
        }
    });
}


function cmdCreateNewBudgetRequest() {
    alert('In my3.js.cmdCreateNewBudgetRequest().');
    var url = appweburl2 + '/InitBudgetRequest.html';
    window.location = url;
}

function cmdListAllWorkflowTasks() {
    // Use ajax.
    //debugger;
    $('#spanBwWorkflowTasks').empty();
    var data = {
        "bwTenantId": tenantId,
        "bwWorkflowAppId": workflowAppId
    };
    $.ajax({
        url: webserviceurl + "/bwtasks",
        type: "DELETE",
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (data) {
            var html = '';
            html += '<table class="myStuffTable">';
            html += '  <tr>';
            html += '    <td>task title</td>';
            html += '    <td>created</td>';
            html += '    <td>due date</td>';
            html += '    <td>task outcome</td>';
            html += '    <td>percent complete</td>';
            html += '    <td>hasbeenprocessedbytheworkflowengine</td>';
            html += '    <td>assigned to id</td>';
            html += '    <td>assigned to</td>';
            html += '    <td>assigned to email</td>';
            html += '    <td>workflow app id</td>';
            html += '    <td>related item id</td>';
            //html += '    <td>approval level workflow token</td>';
            html += '  </tr>';
            for (var i = 0; i < data.length; i++) {
                html += '  <tr>';

                //html += '    <td><a href="javascript:displayArOnTheHomePage(\'' + data[i].bwRelatedItemId + '\', \'' + participantId + '\', \'' + 'x2x2x2' + '\');">' + data[i].bwTaskTitle + '</a></td>';
                //debugger;

                alert('Developer: Is this code used? xcx324642787.');
                html += '    <td><a onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + data[i].bwRelatedItemId + '\', \'' + participantId + '\', \'' + 'x2x2x2' + '\');">' + data[i].bwTaskTitle + '</a></td>';

                //html += '    <td>' + data[i].bwTaskTitle + '</td>';
                html += '    <td>' + data[i].Created + '</td>';
                html += '    <td>' + data[i].bwDueDate + '</td>';
                html += '    <td>' + data[i].bwTaskOutcome + '</td>';
                html += '    <td>' + data[i].bwPercentComplete + '</td>';
                html += '    <td>' + data[i].bwHasBeenProcessedByTheWorkflowEngine + '</td>';
                html += '    <td>' + data[i].bwAssignedToId + '</td>';
                html += '    <td>' + data[i].bwAssignedToFriendlyName + '</td>';
                html += '    <td>' + data[i].bwAssignedToEmail + '</td>';
                html += '    <td>' + data[i].bwWorkflowAppId + '</td>';
                html += '    <td>' + data[i].bwRelatedItemId + '</td>';
                html += '  </tr>';
                //html += 'bwTaskTitle:' + data[i].bwTaskTitle + ', bwTaskOutcome:' + data[i].bwTaskOutcome + ' bwPercentComplete:' +data[i].bwPercentComplete + ' bwHasBeenProcessedByTheWorkflowEngine:' +data[i].bwHasBeenProcessedByTheWorkflowEngine + ', bwAssignedTo:' +data[i].bwAssignedTo + '<br/>';
                //html += '';
            }
            html += '<tr><td colspan="10">DONE</td></tr>';
            html += '</table>';
            $('#spanBwWorkflowTasks').append(html);
            //$('#txtBwWorkflowTasks').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in my.js.cmdListAllWorkflowTasks():' + errorCode + ', ' + errorMessage);
        }
    });
}

function cmdListAllParticipants() {
    // Use ajax.
    $('#spanBwParticipants').empty();
    var data = {
        "bwTenantId": tenantId,
        "bwWorkflowAppId": workflowAppId
    };
    $.ajax({
        url: webserviceurl + "/bwparticipants",
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (data) {
            var html = '';
            html += '<table class="myStuffTable">';
            html += '  <tr>';
            html += '    <td>friendly name of participant</td>';
            html += '    <td>role</td>';
            html += '    <td>email</td>';
            html += '    <td>participant id</td>';
            html += '    <td>tenant id</td>';
            html += '  </tr>';
            for (var i = 0; i < data.length; i++) {
                html += '  <tr>';
                html += '    <td>' + data[i].bwParticipantFriendlyName + '</td>';
                html += '    <td>' + data[i].bwParticipantRole + '</td>';
                html += '    <td>' + data[i].bwParticipantEmail + '</td>';
                html += '    <td>' + data[i].bwParticipantId + '</td>';
                html += '    <td>' + data[i].bwTenantId + '</td>';
                html += '  </tr>';
            }
            html += '<tr><td colspan="4">DONE</td></tr>';
            html += '</table>';
            $('#spanBwParticipants').append(html);




            //var html = '';
            //for (var i = 0; i < data.length; i++) {
            //    html += 'bwParticipantId:' + data[i].bwParticipantId + ', bwTenantId:' + data[i].bwParticipantTenantId + ' bwParticipantEmail:' + data[i].bwParticipantEmail + ' bwParticipantFriendlyName:' + data[i].bwParticipantFriendlyName + '<br/>';
            //    //html += '';
            //}
            //html += 'DONE';
            //$('#txtBwParticipants').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in my.js.cmdListAllParticipants():xcx2321-2: ' + errorCode + ', ' + errorMessage);
        }
    });
}

function cmdListAllInvitations() {
    // Use ajax PUT.
    $('#spanBwInvitations').empty();
    var data = {
        "bwTenantId": tenantId,
        "bwWorkflowAppId": workflowAppId
    };
    $.ajax({
        url: webserviceurl + "/bwinvitationsunclaimed",
        type: "DELETE",
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (data) {
            var html = '';
            html += '<table class="myStuffTable">';
            html += '  <tr>';
            html += '    <td>role</td>';
            html += '    <td>created by</td>';
            html += '    <td>created</td>';
            html += '    <td>delivered to</td>';
            html += '    <td>delivered</td>';
            html += '    <td>accepted by</td>';
            html += '    <td>accepted</td>';
            html += '    <td>tenant id</td>';
            html += '    <td>workflow app id</td>';
            html += '  </tr>';
            for (var i = 0; i < data.length; i++) {
                html += '  <tr>';
                html += '    <td>' + data[i].bwInvitationParticipantRole + '</td>';
                html += '    <td>' + data[i].bwInvitationCreatedByFriendlyName + '</td>';
                html += '    <td>' + data[i].bwInvitationCreatedTimestamp + '</td>';
                html += '    <td>' + data[i].bwInvitationDeliveredToEmail + '</td>';
                html += '    <td>' + data[i].bwInvitationDeliveredTimestamp + '</td>';
                html += '    <td>' + data[i].bwInvitationAcceptedById + '</td>';
                html += '    <td>' + data[i].bwInvitationAcceptedTimestamp + '</td>';
                html += '    <td>' + data[i].bwTenantId + '</td>';
                html += '    <td>' + data[i].bwWorkflowAppId + '</td>';
                html += '  </tr>';
            }
            html += '<tr><td colspan="5">DONE</td></tr>';
            html += '</table>';
            $('#spanBwInvitations').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in my.js.cmdListAllInvitations():' + errorCode + ', ' + errorMessage);
        }
    });
}


function cmdListAllTenants() {
    // Use ajax PUT.
    $('#spanBwTenants').empty();
    var data = {
        "bwTenantId": tenantId,
        "bwWorkflowAppId": workflowAppId
    };
    $.ajax({
        url: webserviceurl + "/bwtenants",
        type: "DELETE",
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (data) {
            var html = '';
            html += '<table class="myStuffTable">';
            html += '  <tr>';
            html += '    <td>tenant title</td>';
            html += '    <td>owner id</td>';
            html += '    <td>owner name</td>';
            html += '    <td>owner email</td>';
            html += '    <td>tenant id</td>';
            html += '  </tr>';
            for (var i = 0; i < data.length; i++) {
                html += '  <tr>';
                html += '    <td>' + data[i].bwTenantTitle + '</td>';

                html += '    <td>' + data[i].bwTenantOwnerId + '</td>';
                html += '    <td>' + data[i].bwTenantOwnerFriendlyName + '</td>';

                html += '    <td>' + data[i].bwTenantOwnerEmail + '</td>';
                html += '    <td>' + data[i].bwTenantId + '</td>';
                html += '  </tr>';
            }
            html += '<tr><td colspan="4">DONE</td></tr>';
            html += '</table>';
            $('#spanBwTenants').append(html);


            //var html = '';
            //for (var i = 0; i < data.length; i++) {
            //    html += 'Owner:' + data[i].bwTenantOwnerFriendlyName + ', FB User Id:' + data[i].bwTenantOwnerFacebookUserId + ', Tenant Id:' + data[i].bwTenantId + '<br/>';
            //    //html += '';
            //}
            //html += 'DONE';
            //$('#spanBwTenants').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in my.js.cmdListAllTenants():' + errorCode + ', ' + errorMessage);
        }
    });
}

function cmdListAllWorkflowApps() {
    // Use ajax PUT.
    $('#spanBwWorkflowApps').empty();
    //var data = {
    //    "bwTenantId": tenantId,
    //    "bwWorkflowAppId": workflowAppId
    //};
    $.ajax({
        url: webserviceurl + "/bwworkflowapps/" + tenantId,
        method: "GET",
        //contentType: 'application/json',
        headers: {
            "Accept": "application/json; odata=verbose"
        },
        //data: JSON.stringify(data),
        success: function (data) {
            var html = '';
            html += '<table class="myStuffTable">';
            html += '  <tr>';
            html += '    <td>title</td>';
            html += '    <td>workflow app id</td>';
            html += '  </tr>';
            for (var i = 0; i < data.d.results.length; i++) {
                html += '  <tr>';
                html += '    <td>' + data.d.results[i].bwWorkflowAppTitle + '</td>';
                html += '    <td>' + data.d.results[i].bwWorkflowAppId + '</td>';
                html += '  </tr>';
            }
            html += '<tr><td colspan="4">DONE</td></tr>';
            html += '</table>';
            $('#spanBwWorkflowApps').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in my.js.cmdListAllWorkflowApps():' + errorCode + ', ' + errorMessage);
        }
    });
}

function cmdListAllFunctionalAreas() {
    // Use ajax PUT.
    $('#spanBwFunctionalAreas').empty();
    //var data = {
    //    "bwTenantId": tenantId,
    //    "bwWorkflowAppId": workflowAppId
    //};
    $.ajax({
        url: webserviceurl + "/getfunctionalareasbyappid/" + workflowAppId + "/" + "RETURNALL",
        method: "GET",
        //contentType: 'application/json',
        headers: {
            "Accept": "application/json; odata=verbose"
        },
        //data: JSON.stringify(data),
        success: function (data) {
            var html = '';
            html += '<table class="myStuffTable">';
            html += '  <tr>';
            html += '    <td></td>';
            html += '    <td>year</td>';
            html += '    <td>yearly budget</td>';
            html += '    <td>id</td>';
            html += '    <td>workflow app id</td>';
            html += '    <td>Approver1Id</td>';
            html += '    <td>Approver2Id</td>';
            html += '    <td>Approver3Id</td>';
            html += '    <td>Approver4Id</td>';
            html += '    <td>Approver5Id</td>';
            html += '    <td>Approver6Id</td>';
            html += '    <td>Approver7Id</td>';
            html += '    <td>Approver8Id</td>';
            html += '    <td>Approver9Id</td>';
            html += '    <td>Approver10Id</td>';
            html += '  </tr>';
            for (var i = 0; i < data.d.results.length; i++) {
                html += '  <tr>';
                html += '    <td style="white-space:nowrap;">financial area: ' + data.d.results[i].bwFunctionalAreaTitle + '</td>';
                html += '    <td>' + data.d.results[i].bwFunctionalAreaYear + '</td>';
                html += '    <td>' + data.d.results[i].bwFunctionalAreaYearlyBudget + '</td>';
                html += '    <td>' + data.d.results[i].bwFunctionalAreaId + '</td>';
                html += '    <td>' + data.d.results[i].bwWorkflowAppId + '</td>';
                html += '    <td>' + data.d.results[i].Approver1Id + '</td>';
                html += '    <td>' + data.d.results[i].Approver2Id + '</td>';
                html += '    <td>' + data.d.results[i].Approver3Id + '</td>';
                html += '    <td>' + data.d.results[i].Approver4Id + '</td>';
                html += '    <td>' + data.d.results[i].Approver5Id + '</td>';
                html += '    <td>' + data.d.results[i].Approver6Id + '</td>';
                html += '    <td>' + data.d.results[i].Approver7Id + '</td>';
                html += '    <td>' + data.d.results[i].Approver8Id + '</td>';
                html += '    <td>' + data.d.results[i].Approver9Id + '</td>';
                html += '    <td>' + data.d.results[i].Approver10Id + '</td>';
                html += '  </tr>';
                html += '  <tr>';
                html += '    <td>budget thresholds:</td>';
                html += '    <td></td>';
                html += '    <td></td>';
                html += '    <td></td>';
                html += '    <td></td>';
                html += '    <td></td>';
                html += '    <td></td>';
                html += '    <td>' + data.d.results[i].Approval3BudgetThreshold + '</td>';
                html += '    <td>' + data.d.results[i].Approval4BudgetThreshold + '</td>';
                html += '    <td>' + data.d.results[i].Approval5BudgetThreshold + '</td>';
                html += '    <td>' + data.d.results[i].Approval6BudgetThreshold + '</td>';
                html += '    <td>' + data.d.results[i].Approval7BudgetThreshold + '</td>';
                html += '    <td>' + data.d.results[i].Approval8BudgetThreshold + '</td>';
                html += '    <td>' + data.d.results[i].Approval9BudgetThreshold + '</td>';
                html += '    <td>' + data.d.results[i].Approval10BudgetThreshold + '</td>';
                html += '  </tr>';
                html += '  <tr>';
                html += '    <td colspan="15"></td>';
                html += '  </tr>';
            }
            html += '<tr><td colspan="4">DONE</td></tr>';
            html += '</table>';
            $('#spanBwFunctionalAreas').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in my.js.cmdListAllFunctionalAreas():' + errorCode + ', ' + errorMessage);
        }
    });
}

function cmdListAllDepartments() {
    // Use ajax PUT.
    $('#spanBwDepartments').empty();
    var data = {
        "bwTenantId": tenantId,
        "bwWorkflowAppId": workflowAppId
    };
    $.ajax({
        url: webserviceurl + "/bwdepartments",
        type: "DELETE",
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (data) {
            var html = '';
            html += '<table class="myStuffTable">';
            html += '  <tr>';
            html += '    <td>department title</td>';
            html += '    <td>user name</td>';
            html += '    <td>user id</td>';
            html += '  </tr>';
            for (var i = 0; i < data.length; i++) {
                html += '  <tr>';
                html += '    <td>' + data[i].bwDepartmentTitle + '</td>';
                html += '    <td>' + data[i].bwDepartmentUserName + '</td>';
                html += '    <td>' + data[i].bwDepartmentUserId + '</td>';
                html += '  </tr>';
            }
            html += '<tr><td colspan="4">DONE</td></tr>';
            html += '</table>';
            $('#spanBwDepartments').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in my.js.cmdListAllDepartments():' + errorCode + ', ' + errorMessage);
        }
    });
}



function cmdDisplayDeleteRecurringExpenseRequestDialog(bwRecurringExpenseId, title) {
    //displayAlertDialog('bwRecurringExpenseId: ' + bwRecurringExpenseId);
    try {
        $("#DeleteARecurringExpenseDialog").dialog({
            modal: true,
            resizable: false,
            closeText: "Cancel",
            closeOnEscape: true, // Hit the ESC key to hide! Yeah!
            title: 'Delete ' + bwRecurringExpenseId,
            width: "570px",
            dialogClass: "no-close", // No close button in the upper right corner.
            hide: false, // This means when hiding just disappear with no effects.
            buttons: {
                "Delete Recurring Expense": {
                    text: 'Delete Recurring Expense, supplementals and tasks',
                    id: 'btnDeleteARecurringExpense',
                    disabled: 'true',
                    click: function () {
                        var proceed = confirm('This action cannot be undone.\n\n\nClick the OK button to proceed...');
                        if (proceed) {
                            cmdDeleteRecurringExpense(bwRecurringExpenseId);
                            $(this).dialog("close");
                        }
                    }
                },
                "Cancel": function () {
                    $(this).dialog("close");
                }
            },
            open: function () {
                var data = [];
                data = {
                    bwRecurringExpenseId: bwRecurringExpenseId,
                    bwWorkflowAppId: workflowAppId
                };
                var operationUri = webserviceurl + "/bwworkflow/itemizerecurringexpensedependencies"; // THIS WEB SERVICE DOES NOT EXIST YET
                $.ajax({
                    url: operationUri,
                    type: "POST", timeout: ajaxTimeout,
                    data: data,
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    },
                    success: function (data) {
                        if (data.message != 'SUCCESS') {
                            displayAlertDialog(JSON.stringify(data));
                        } else {
                            var html = '';
                            if (data.NumberOfIncompleteTasksForRecurringExpense == 0 && data.NumberOfCompletedTasksForRecurringExpense == 0 && data.NumberOfSupplementals == 0) {
                                html += 'This Recurring Expense has no dependencies, and can be deleted immediately.';
                            } else {
                                html += 'When this Recurring Expense is deleted, the following will also be deleted:';
                            }
                            if (data.NumberOfIncompleteTasksForRecurringExpense > 0 || data.NumberOfCompletedTasksForRecurringExpense > 0) {
                                html += '<ul>';
                                if (data.NumberOfIncompleteTasksForRecurringExpense > 0) {
                                    html += '<li style="color:red;"><span style="color:black;">' + data.NumberOfIncompleteTasksForRecurringExpense + ' incomplete Task(s)</span></li>';
                                }
                                if (data.NumberOfCompletedTasksForRecurringExpense > 0) {
                                    html += '<li style="color:red;"><span style="color:black;">' + data.NumberOfCompletedTasksForRecurringExpense + ' completed Task(s)</span></li>';
                                }
                                html += '</ul>';
                            }
                            if (data.NumberOfSupplementals > 0) {
                                html += 'Also, ' + data.NumberOfSupplementals + ' Supplemental Request(s) will be deleted, along with the following:';
                                html += '<ul>';
                                if (data.NumberOfIncompleteTasksForSupplementals > 0) {
                                    html += '<li style="color:red;"><span style="color:black;">' + data.NumberOfIncompleteTasksForSupplementals + ' incomplete Task(s)</span></li>';
                                }
                                if (data.NumberOfCompletedTasksForSupplementals > 0) {
                                    html += '<li style="color:red;"><span style="color:black;">' + data.NumberOfCompletedTasksForSupplementals + ' complete Task(s)</span></li>';
                                }
                                html += '</ul>';
                            }
                            document.getElementById('spanDeleteARecurringExpenseDialogDependencyDetails').innerHTML = html;
                        }

                        // Show or hide the replacement user selection box depening if there are any dependencies.
                        if (data.NumberOfIncompleteTasksForRecurringExpense == 0 && data.NumberOfCompletedTasksForRecurringExpense == 0 && data.NumberOfSupplementals == 0) {
                            // There are no dependencies.
                            // Change the button text.
                            var dialogButtons = $('#DeleteARecurringExpenseDialog').dialog('option', 'buttons');
                            $.each(dialogButtons, function (buttonIndex, button) {
                                if (button.id === 'btnDeleteARecurringExpense') {
                                    button.text = 'Delete ' + bwRecurringExpenseId;
                                    button.disabled = false;
                                }
                            })
                            $("#DeleteARecurringExpenseDialog").dialog('option', 'buttons', dialogButtons);
                        } else {
                            // There ARE dependencies.
                            // Change the button text.
                            var dialogButtons = $('#DeleteARecurringExpenseDialog').dialog('option', 'buttons');
                            $.each(dialogButtons, function (buttonIndex, button) {
                                if (button.id === 'btnDeleteARecurringExpense') {
                                    button.text = 'Delete the Recurring Expense and all related items';
                                    button.disabled = false;
                                    button.style = 'color:red;';
                                }
                            })
                            $("#DeleteARecurringExpenseDialog").dialog('option', 'buttons', dialogButtons);
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        //handleExceptionWithAlert('Error in Start.js.displayConnectedWorkflows()', '1:' + errorCode + ', ' + errorMessage);
                        displayAlertDialog('Error in my.js.cmdDisplayDeleteRecurringExpenseRequestDialog().itemizerecurringexpensedependencies: ' + errorMessage);
                    }
                });
            }
        });

        // Hide the title bar.
        $("#DeleteARecurringExpenseDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
        // Set the title.
        document.getElementById('spanDeleteARecurringExpenseDialogTitle').innerHTML = 'Delete ' + title + '.';


        // Make sure the send message checkbox is not selected to begin with.
        document.getElementById('cbDeleteARecurringExpenseDialogEmailMessage').removeAttribute('checked', '');
        // Event listener for the email checkbox.
        //$('#cbDeleteABudgetRequestDialogEmailMessage').click(function (error) {
        //    var _checked = document.getElementById('cbDeleteABudgetRequestDialogEmailMessage').checked;
        //    if (_checked == true) {
        //        var dialogButtons = $('#DeleteABudgetRequestDialog').dialog('option', 'buttons');
        //        $.each(dialogButtons, function (buttonIndex, button) {
        //            if (button.id === 'btnDeleteABudgetRequest') {
        //                button.text = 'xxxx and Send Email';
        //            }
        //        })
        //        $("#DeleteABudgetRequestDialog").dialog('option', 'buttons', dialogButtons);
        //    } else {
        //        var dialogButtons = $('#DeleteABudgetRequestDialog').dialog('option', 'buttons');
        //        $.each(dialogButtons, function (buttonIndex, button) {
        //            if (button.id === 'btnDeleteABudgetRequest') {
        //                button.text = 'xxxx';
        //            }
        //        })
        //        $("#DeleteABudgetRequestDialog").dialog('option', 'buttons', dialogButtons);
        //    }
        //});
    } catch (e) {
        displayAlertDialog('Error in cmdDisplayDeleteBudgetRequestDialog(): ' + e.message);
    }

}



function cmdDeleteBudgetRequest(bwBudgetRequestId) {
    console.log('In cmdDeleteBudgetRequest().');
    var thiz = this;

    var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
    var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

    $("#divWorkingOnItDialog").dialog({
        modal: true,
        resizable: false,
        //closeText: "Cancel",
        closeOnEscape: false, // Hit the ESC key to hide! Yeah!
        title: 'Working on it...',
        width: "800",
        dialogClass: "no-close", // No close button in the upper right corner.
        hide: false//, // This means when hiding just disappear with no effects.
        //buttons: {
        //    "Close": function () {
        //        $(this).dialog("close");
        //    }
        //}
    });
    $("#divWorkingOnItDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();


    var additionalEmailMessage;
    var _checked = document.getElementById('cbDeleteABudgetRequestDialogEmailMessage').checked;
    if (_checked == true) {
        additionalEmailMessage = document.getElementById('txtDeleteABudgetRequestDialogEmailMessage').textContent;
    }

    var data = [];
    data = {
        bwBudgetRequestId: bwBudgetRequestId,
        bwTenantId: tenantId,
        bwWorkflowAppId: workflowAppId,
        participantId: participantId,
        AdditionalEmailMessage: additionalEmailMessage
    };
    var operationUri = webserviceurl + "/bwworkflow/removeabudgetrequest";
    $.ajax({
        url: operationUri,
        type: "POST", timeout: ajaxTimeout,
        data: data,
        headers: {
            "Accept": "application/json; odata=verbose"
        },
        success: function (data) {
            $('#divWorkingOnItDialog').dialog('close'); // Close the create your account dialog.
            displayAlertDialog(data);
            //debugger;
            populateStartPageItem('divArchivexx3', 'Reports', '');

        },
        error: function (data, errorCode, errorMessage) {
            //handleExceptionWithAlert('Error in Start.js.displayConnectedWorkflows()', '1:' + errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in my.js.cmdDeleteBudgetRequest(): ' + errorMessage);
        }
    });
}


function cmdListAllParticipantsUsingClientDatasetApproach() {
    try {

        // Set the top bar title.
        $('#divArchiveMasterDivTitle').text('Archive: Participants');

        var filter = 'all';
        //alert('xcx12424151-1');
        $('#spanBwBudgetRequests').empty();
        var data = {
            "bwWorkflowAppId": workflowAppId
        };
        $.ajax({
            url: webserviceurl + "/workflow/participants",
            type: "DELETE",
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (data1) {
                try {
                    var data = data1.BwWorkflowUsers;
                    var html = '';
                    html += '<table class="myStuffTable">';
                    html += '  <tr>';
                    html += '    <td>Name</td>';
                    html += '    <td>Email</td>';
                    html += '    <td>Role</td>';
                    html += '    <td></td>';
                    html += '    <td></td>';
                    //html += '    <td>participant id</td>';
                    //html += '    <td>tenant id</td>';
                    html += '  </tr>';
                    for (var i = 0; i < data.length; i++) {
                        html += '  <tr>';
                        html += '    <td>' + data[i].bwParticipantFriendlyName + '</td>';
                        html += '    <td>' + data[i].bwParticipantEmail + '</td>';
                        html += '    <td>' + data[i].bwParticipantRole + '</td>';
                        if ((data[i].bwParticipantId == participantId) || (data[i].bwParticipantRole == 'owner')) {
                            html += '    <td></td>';
                            html += '    <td></td>';
                        } else {
                            //html += '    <td><button class="BwSmallButton" onclick="cmdDisplayChangeUserRoleDialog(\'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwParticipantRole + '\', \'' + data[i].bwParticipantLogonType + '\');">change role</button></td>';
                            //html += '    <td><button class="BwSmallButton" onclick="cmdDisplayReassignUserTasksDialog(\'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwParticipantRole + '\', \'' + data[i].bwParticipantLogonType + '\');">reassign tasks</button></td>';
                            //html += '    <td><img src="images/trash-can.png" onclick="cmdDisplayDeleteUserDialog(\'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwParticipantRole + '\', \'' + data[i].bwParticipantLogonType + '\');" title="Delete" style="cursor:pointer;" /></td>';

                            html += '    <td></td>';
                            html += '    <td></td>';
                            //html += '    <td></td>';

                        }
                        //html += '    <td>' + data[i].bwParticipantId + '</td>';
                        //html += '    <td>' + data[i].bwTenantId + '</td>';
                        html += '  </tr>';
                    }
                    //html += '<tr><td colspan="4">DONE</td></tr>';
                    html += '</table>';
                    //
                    //html += '                </span>';
                    //html += '            </div>';
                    //html += '        </div>';
                    //html += '    </div>';
                    //html += '</div>';
                    //


                    //html += '<tr><td colspan="12"></td></tr>'; // DONE
                    html += '</table>';

                    html += '<br />';
                    //html += '<i>This view is currently being enhanced and will be available in the near future.</i>';

                    $('#spanBwBudgetRequests').append(html);

                    // Now it's time to hook up the events. Doing both  change and key up events.


                    $('#txtArchivePageDescriptionFilter').change(function () {
                        renderArchivePageApplyingDescriptionFilter('txtArchivePageDescriptionFilter');
                    });
                    $('#txtArchivePageDescriptionFilter').keyup(function () {
                        renderArchivePageApplyingDescriptionFilter('txtArchivePageDescriptionFilter');
                    });

                    $('#txtArchivePageBudgetAmountFilter').change(function () {
                        renderArchivePageApplyingDescriptionFilter('txtArchivePageBudgetAmountFilter');
                    });
                    $('#txtArchivePageBudgetAmountFilter').keyup(function () {
                        renderArchivePageApplyingDescriptionFilter('txtArchivePageBudgetAmountFilter');
                    });

                    $('#ddlArchivePageFinancialAreaDropDownFilter').change(function () {
                        renderArchivePageApplyingDescriptionFilter('ddlArchivePageFinancialAreaDropDownFilter');
                    });

                    $('#selectArchivePageFilterDropDown').change(function () {
                        renderArchivePageApplyingDescriptionFilter('selectArchivePageFilterDropDown');
                    });


                } catch (e) {
                    displayAlertDialog('Error in my.js.cmdListAllParticipantsUsingClientDatasetApproach():3:' + e.message + ', ' + e.stack);
                }


            },
            error: function (data, errorCode, errorMessage) {
                //window.waitDialog.close();
                //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
                displayAlertDialog('Error in my.js.cmdListAllParticipantsUsingClientDatasetApproach():2:' + errorCode + ', ' + errorMessage);
            }
        });

    } catch (e) {
        displayAlertDialog('Error in my.js.cmdListAllParticipantsUsingClientDatasetApproach():1:' + e.message + ', ' + e.stack);
    }
}






function renderArchivePageApplyingDescriptionFilter(filterObjectName) {
    console.log('In renderArchivePageApplyingDescriptionFilter(). THIS HAS BEEN COMMENTED OUT. I DONT THINK WE NEED IT. Come here and clean up related stuff eventually.');
    ////displayAlertDialog('xxxx');
    //var descriptionfilter = document.getElementById('txtArchivePageDescriptionFilter').value.toLowerCase();
    //var budgetamountfilter = document.getElementById('txtArchivePageBudgetAmountFilter').value.toLowerCase();
    //var financialareafilter = document.getElementById('ddlArchivePageFinancialAreaDropDownFilter').value;
    //var statusfilter = document.getElementById('selectArchivePageFilterDropDown').value;

    ////displayAlertDialog('1: ' + financialareafilter + ' 2: ' + statusfilter);
    //// Now that we have all our data in the array properly, lets display it!
    //var year = new Date().getFullYear().toString(); // todd hardcoded.
    //var html = '';
    //html += '<br />Year:&nbsp;<select style="padding:5px 5px 5px 5px;" id=""><option>' + year + '</option></select>';
    //html += '<br /><br />';
    //html += '<table class="myStuffTable">';
    //html += '  <tr>';
    //html += '    <td>Description</td>';
    //html += '    <td style="white-space:nowrap;">Financial Area</td>';
    //html += '    <td>Budget Amount</td>';
    //html += '    <td>Status</td>';
    //html += '    <td>ARStatus</td>';
    ////html += '    <td></td>';
    //html += '    <td>Current Owner</td>';
    //html += '    <td></td>';
    //html += '  </tr>';
    //html += '  <tr>';
    //html += '    <td style="white-space:nowrap;"><input type="text" id="txtArchivePageDescriptionFilter" class="archivePageFilterBox" title="Type here to limit the search results, using * as a wildcard character."/>&nbsp;<img src="images/icon-down.png" title="Sort order" style="cursor:pointer;" /></td>';
    //html += '    <td style="white-space:nowrap;">';
    //html += '      <select id="ddlArchivePageFinancialAreaDropDownFilter" class="archivePageFilterDropDown" title="Select here to limit search results.">';
    //for (var x = 0; x < BWMData[0].length; x++) {
    //    if (BWMData[0][x][0] == workflowAppId) {
    //        // Now put the empty option.
    //        html += '<option value="" class="archivePageFilterOptionDropDown">Show all...</option>';
    //        for (var y = 0; y < BWMData[0][x][4].length; y++) {
    //            var faId = BWMData[0][x][4][y][0];
    //            var faTitle = BWMData[0][x][4][y][1];
    //            // Check if the faId exists in budgetrequests. If not do not display it.
    //            var areWeDisplayingThisFa = false;
    //            for (var i = 0; i < budgetRequests.length; i++) {
    //                //var budgetAmount = budgetRequests[i].BudgetAmount
    //                if ((descriptionfilter == '' && budgetamountfilter == '') || (budgetamountfilter == '' && budgetRequests[i].ProjectTitle.toLowerCase().indexOf(descriptionfilter) > -1) || (descriptionfilter == '' && Number(budgetRequests[i].BudgetAmount) >= Number(budgetamountfilter)) || (budgetRequests[i].ProjectTitle.toLowerCase().indexOf(descriptionfilter) > -1 && Number(budgetRequests[i].BudgetAmount) >= Number(budgetamountfilter))) { // Applying the filter.
    //                    if (faId == budgetRequests[i].FunctionalAreaId) {
    //                        areWeDisplayingThisFa = true;
    //                    }
    //                }
    //            }
    //            if (areWeDisplayingThisFa == true) {
    //                if (financialareafilter == faId) {
    //                    html += '<option value="' + faId + '" class="archivePageFilterOptionDropDown" selected >';
    //                } else {
    //                    html += '<option value="' + faId + '" class="archivePageFilterOptionDropDown">';
    //                }
    //                html += faTitle;
    //                html += '</option>';
    //            }
    //        }
    //    }
    //}
    //html += '      </select>';
    //html += '    </td>';
    //html += '    <td style="white-space:nowrap;"><input type="text" id="txtArchivePageBudgetAmountFilter" class="archivePageFilterBox" title="Enter a number. Shows all equal to or greater than."/>&nbsp;<img src="images/icon-down.png" title="Sort order" style="cursor:pointer;" /></td>';
    //html += '    <td style="white-space:nowrap;">';
    //html += '<select id="selectArchivePageFilterDropDown" class="archivePageFilterDropDown" title="Select here to limit search results.">';
    //// Now put the empty option.
    //html += '<option value="" class="archivePageFilterOptionDropDown">Show all...</option>';
    //for (var s = 0; s < statusesForTheStatusDropdown.length; s++) {
    //    if (statusfilter == statusesForTheStatusDropdown[s]) {
    //        html += '<option value="' + statusesForTheStatusDropdown[s] + '" class="archivePageFilterOptionDropDown" selected >' + statusesForTheStatusDropdown[s] + '</option>';
    //    } else {
    //        html += '<option value="' + statusesForTheStatusDropdown[s] + '" class="archivePageFilterOptionDropDown">' + statusesForTheStatusDropdown[s] + '</option>';
    //    }
    //}
    //html += '</select>&nbsp;<img src="images/icon-down.png" title="Sort order" style="cursor:pointer;" />';
    //html += '    </td>';
    //html += '    <td></td>';
    ////html += '    <td></td>';
    //html += '    <td></td>';
    //html += '    <td></td>';
    //html += '  </tr>';

    ////displayAlertDialog('filter: ' + filter);
    //for (var i = 0; i < budgetRequests.length; i++) {
    //    // The following conditions determine if the AR is displayed. The question is "Show this item if..."
    //    if ((descriptionfilter == '' && financialareafilter == '' && budgetamountfilter == '' && statusfilter == '') ||
    //        (descriptionfilter == '' && financialareafilter == '' && budgetamountfilter == '' && statusfilter == budgetRequests[i].BudgetWorkflowStatus) ||

    //        (budgetRequests[i].ProjectTitle.toLowerCase().indexOf(descriptionfilter) > -1 && financialareafilter == '' && budgetamountfilter == '' && statusfilter == '') ||
    //        (budgetRequests[i].ProjectTitle.toLowerCase().indexOf(descriptionfilter) > -1 && financialareafilter == budgetRequests[i].FunctionalAreaId && budgetamountfilter == '' && statusfilter == '') ||
    //        (budgetRequests[i].ProjectTitle.toLowerCase().indexOf(descriptionfilter) > -1 && financialareafilter == budgetRequests[i].FunctionalAreaId && Number(budgetRequests[i].BudgetAmount) >= Number(budgetamountfilter) && statusfilter == '') ||
    //        (budgetRequests[i].ProjectTitle.toLowerCase().indexOf(descriptionfilter) > -1 && financialareafilter == budgetRequests[i].FunctionalAreaId && Number(budgetRequests[i].BudgetAmount) >= Number(budgetamountfilter) && statusfilter == budgetRequests[i].BudgetWorkflowStatus) ||

    //        (descriptionfilter == '' && financialareafilter == budgetRequests[i].FunctionalAreaId && budgetamountfilter == '' && statusfilter == '') ||
    //        (descriptionfilter == '' && financialareafilter == budgetRequests[i].FunctionalAreaId && Number(budgetRequests[i].BudgetAmount) >= Number(budgetamountfilter) && statusfilter == '') ||
    //        (descriptionfilter == '' && financialareafilter == budgetRequests[i].FunctionalAreaId && Number(budgetRequests[i].BudgetAmount) >= Number(budgetamountfilter) && statusfilter == budgetRequests[i].BudgetWorkflowStatus) ||

    //        (descriptionfilter == '' && financialareafilter == '' && Number(budgetRequests[i].BudgetAmount) >= Number(budgetamountfilter) && statusfilter == '') ||

    //        (descriptionfilter == '' && financialareafilter == '' && Number(budgetRequests[i].BudgetAmount) >= Number(budgetamountfilter) && statusfilter == budgetRequests[i].BudgetWorkflowStatus)) { // Applying the filter.
    //        //html += '  <tr>';
    //        //debugger;

    //        console.log('Developer: Is this code used? xcx32488.');
    //        html += '  <tr style="cursor:pointer;" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'whitesmoke\';" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');">';



    //        //html += '      <td><a href="javascript:displayArOnTheHomePage(\'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');">' + budgetRequests[i].ProjectTitle + '</a></td>';
    //        //debugger;
    //        html += '      <td style="padding:5px;"><a href="javascript:$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');">' + budgetRequests[i].ProjectTitle + '</a></td>';
    //        for (var x = 0; x < BWMData[0].length; x++) {
    //            if (BWMData[0][x][0] == workflowAppId) {
    //                for (var y = 0; y < BWMData[0][x][4].length; y++) {
    //                    if (BWMData[0][x][4][y][0] == budgetRequests[i].FunctionalAreaId) {
    //                        // We have found the financial area, so we have the title! Yay!
    //                        var faTitle = BWMData[0][x][4][y][1];
    //                        html += '<td style="padding:5px;">';
    //                        html += faTitle;
    //                        //html += '<input id="txtFunctionalAreaId" type="text" style="" value="' + data[i].FunctionalAreaId + '" />';
    //                        html += '</td>';
    //                    }
    //                }
    //            }
    //        }
    //        //html += '    <td style="text-align:right;">' + formatCurrency(budgetRequests[i].BudgetAmount) + '</td>';
    //        // Strikethrough the budget amount for a rejected AR.
    //        if (budgetRequests[i].ARStatus == 'Rejected') {
    //            html += '    <td style="text-align:right;padding:5px;"><strike>' + formatCurrency(budgetRequests[i].BudgetAmount) + '</strike></td>';
    //        } else {
    //            html += '    <td style="text-align:right;padding:5px;">' + formatCurrency(budgetRequests[i].BudgetAmount) + '</td>';
    //        }
    //        html += '    <td style="padding:5px;">' + budgetRequests[i].BudgetWorkflowStatus + '</td>';
    //        html += '    <td style="padding:5px;">' + budgetRequests[i].ARStatus + '</td>';
    //        //html += '    <td>';
    //        ////tempCloseOutXml = budgetRequests[i].bwDocumentXml;
    //        //html += '       <a href="javascript:displayForm_DisplayCloseOut();" style="white-space:nowrap;">Close Out</a>';
    //        //html += '    </td>';
    //        html += '    <td style="padding:5px;">' + budgetRequests[i].CurrentOwner + '</td>';
    //        html += '<td style="padding:5px;"><img src="images/trash-can.png" onclick="cmdDisplayDeleteBudgetRequestDialog(\'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\');" title="yDelete" style="cursor:pointer;" /></td>';
    //        html += '  </tr>';
    //    }
    //}
    //html += '<tr><td colspan="12"></td></tr>'; // DONE
    //html += '</table>';
    //$('#spanBwBudgetRequests').empty();
    //alert('In my3.js.renderArchivePageApplyingDescriptionFilter(). xcx12424151-2. Why are we here??');
    //$('#spanBwBudgetRequests').append(html);

    //// This puts the value of the filter back in the redrawn table, and puts the cursor at the end of the text when the focus is called.
    //document.getElementById('txtArchivePageDescriptionFilter').value = descriptionfilter;
    //document.getElementById('txtArchivePageBudgetAmountFilter').value = budgetamountfilter;
    //if (filterObjectName == 'txtArchivePageDescriptionFilter') {
    //    $('#' + filterObjectName).focus(function () {
    //        var that = this;
    //        setTimeout(function () { that.selectionStart = that.selectionEnd = 10000; }, 0);
    //    });
    //    $('#' + filterObjectName).focus();
    //}
    //if (filterObjectName == 'txtArchivePageBudgetAmountFilter') {
    //    $('#' + filterObjectName).focus(function () {
    //        var that = this;
    //        setTimeout(function () { that.selectionStart = that.selectionEnd = 10000; }, 0);
    //    });
    //    $('#' + filterObjectName).focus();
    //}


    //$('#txtArchivePageDescriptionFilter').change(function () {
    //    renderArchivePageApplyingDescriptionFilter('txtArchivePageDescriptionFilter');
    //});
    //$('#txtArchivePageDescriptionFilter').keyup(function () {
    //    renderArchivePageApplyingDescriptionFilter('txtArchivePageDescriptionFilter');
    //});

    //$('#txtArchivePageBudgetAmountFilter').change(function () {
    //    renderArchivePageApplyingDescriptionFilter('txtArchivePageBudgetAmountFilter');
    //});
    //$('#txtArchivePageBudgetAmountFilter').keyup(function () {
    //    renderArchivePageApplyingDescriptionFilter('txtArchivePageBudgetAmountFilter');
    //});

    //$('#ddlArchivePageFinancialAreaDropDownFilter').change(function () {
    //    //displayAlertDialog('select changed');
    //    renderArchivePageApplyingDescriptionFilter('ddlArchivePageFinancialAreaDropDownFilter');
    //});

    //$('#selectArchivePageFilterDropDown').change(function () {
    //    renderArchivePageApplyingDescriptionFilter('selectArchivePageFilterDropDown');
    //});

}

function cmdListPendingBudgetRequests() {
    // Use ajax PUT.
    $('#spanBwPendingBudgetRequests').empty();
    var data = {
        "bwTenantId": tenantId,
        "bwWorkflowAppId": workflowAppId
    };
    $.ajax({
        url: webserviceurl + "/bwbudgetrequestspending",
        type: "DELETE",
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (data) {
            var html = '';
            html += '<table class="myStuffTable">';
            html += '  <tr>';
            html += '    <td>project title</td>';
            html += '    <td>requested capital</td>';
            html += '    <td>budget amount</td>';
            html += '    <td>ar status</td>';
            html += '    <td>budget workflow status</td>';
            html += '    <td>budget request id</td>';
            html += '    <td>workflow app id</td>';
            html += '    <td>functional area id</td>';
            html += '    <td>created by</td>';
            html += '    <td>created by id</td>';
            html += '    <td>created</td>';
            html += '    <td>modified by id</td>';
            html += '    <td>modified</td>';
            html += '    <td>current owner</td>';
            html += '    <td>approval level workflow token</td>';
            html += '  </tr>';
            for (var i = 0; i < data.length; i++) {
                html += '  <tr>';
                //html += '    <td><a href="' + appweburl2 + '/ar.html?BudgetRequestTitle=' + data[i].bwBudgetRequestId + '" target="_blank">' + data[i].ProjectTitle + '</a></td>';
                //html += '      <td><a href="javascript:displayArOnTheHomePage(\'' + data[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + data[i].Title + '\');">' + data[i].ProjectTitle + '</a></td>';
                //debugger;

                alert('Developer: Is this code used? xcx33996.');
                html += '      <td><a onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + data[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + data[i].Title + '\');">' + data[i].ProjectTitle + '</a></td>';
                html += '    <td>' + data[i].RequestedCapital + '</td>';
                html += '    <td>' + data[i].BudgetAmount + '</td>';
                html += '    <td>' + data[i].ARStatus + '</td>';
                html += '    <td>' + data[i].BudgetWorkflowStatus + '</td>';
                html += '    <td>' + data[i].bwBudgetRequestId + '</td>';
                html += '    <td>' + data[i].bwWorkflowAppId + '</td>';
                html += '    <td>' + data[i].FunctionalAreaId + '</td>';
                html += '    <td>' + data[i].CreatedBy + '</td>';
                html += '    <td>' + data[i].CreatedById + '</td>';
                html += '    <td>' + data[i].Created + '</td>';
                html += '    <td>' + data[i].ModifiedById + '</td>';
                html += '    <td>' + data[i].Modified + '</td>';
                html += '    <td>' + data[i].CurrentOwner + '</td>';
                html += '    <td>' + data[i].bwApprovalLevelWorkflowToken + '</td>';
                html += '  </tr>';
            }
            html += '<tr><td colspan="13">DONE</td></tr>';
            html += '</table>';
            $('#spanBwPendingBudgetRequests').append(html);

            //var html = '';
            //for (var i = 0; i < data.length; i++) {
            //    // ARStatus: String,
            //    //BudgetWorkflowStatus: String,
            //    html += 'ProjectTitle:' + data[i].ProjectTitle + ', ARStatus: ' + data[i].ARStatus + ' BudgetWorkflowStatus:' + data[i].BudgetWorkflowStatus + ' bwBudgetRequestId:' + data[i].bwBudgetRequestId + '<br/>';
            //    //html += '';
            //}
            //html += 'DONE';
            //$('#BwBudgetRequests').append(html);
        },
        error: function (data, errorCode, errorMessage) {
            //window.waitDialog.close();
            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in my.js.cmdListPendingBudgetRequests():' + errorCode + ', ' + errorMessage);
        }
    });
}

function addInLicenseCheck() {
    // APP License check!! 
    try {
        var productId = 'ea5f27c4-6885-43fb-8935-2cdaf759d549'; // 'Budget Workflow Manager' GUID
        var context = SP.ClientContext.get_current();
        var appLicenses = SP.Utilities.Utility.getAppLicenseInformation(context, productId);
        context.executeQueryAsync(function (sender, args) {
            if (appLicenses.get_count() > 0) {
                //just get the first license; you could also traverse all licenses if required but usually the top one is enough because it the most 'relevant' 
                var licenseXML = appLicenses.get_item(0).get_rawXMLLicenseToken();
                var licenseEncoded = encodeURIComponent(licenseXML);

                var oStoreUrl = "https://verificationservice.officeapps.live.com/ova/verificationagent.svc/rest/verify?token=";
                var request = new SP.WebRequestInfo();
                request.set_url(oStoreUrl + licenseEncoded);
                request.set_method("GET");
                var response = SP.WebProxy.invoke(context, request);
                context.executeQueryAsync(function (data) {
                    var verifiedLicense = response.get_body();
                    if (verifiedLicense == null) {
                        //No license found or the license was malformed
                        //The UI string retrieved above will already contain the appropiate info
                        //In real app code you could take additional steps (e.g. provide reduced functionality)
                        displayFreeTrialExpiredDialog();
                    } else {
                        //There is a well-formed license; must look at properties to determine validity
                        //if (verifiedLicense.IsValid) {
                        if ($(verifiedLicense).find('IsValid').text() == 'true') {
                            //Valid production license
                            //displayAlertDialog('Valid PRODUCTION license.');
                        }
                        //else if ($(verifiedLicense).find('IsTest').text() == 'true') {
                        //    //For test licenses, the IsTest property returns true and the IsValid property returns false.
                        //    //Test mode with valid test token
                        //    displayAlertDialog('Valid TEST license.'); 
                        //}
                        else {
                            //Production mode with invalid license
                            //Warn the user about missing/invalid license
                            displayFreeTrialExpiredDialog();
                        }
                    }
                },
                    function () {
                        //displayAlertDialog('Error validating license.');
                        displayFreeTrialExpiredDialog();
                    });
            }
            else {
                //displayAlertDialog("No license present");
                displayFreeTrialExpiredDialog();
            }
        },
            function () {
                //displayAlertDialog('Error retrieving license.');
                displayFreeTrialExpiredDialog();
            });
    } catch (e) {
        handleExceptionWithAlert('Error in Start.js.addInLicenseCheck()', e.message);
    }
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

function refreshThePage() {
    try {
        //populateStartPageItem('divSummaryReport', 'Reports', '');
        //debugger;
        renderActivity();
    } catch (e) {
        handleExceptionWithAlert('Error in Start.js.refreshThePage()', e.message);
    }
}


function cmdYearSelectedChanged() {
    try {
        displayAlertDialog('In cmdYearSelectedChanged(). This functionality is incomplete. Coming soon!.');
        //if (!$('#financialOrParticipantSummary').is(':checked')) {
        //    if (!$('#budgetRequestsOrQuotes').is(':checked')) {
        //        renderFinancialSummary(false);
        //    } else if ($('#budgetRequestsOrQuotes').is(':checked')) {
        //        renderFinancialSummary(true);
        //    }
        //} else {
        //    if (!$('#budgetRequestsOrQuotes').is(':checked')) {
        //        renderParticipantSummary(false);
        //    } else if ($('#budgetRequestsOrQuotes').is(':checked')) {
        //        renderParticipantSummary(true);
        //    }
        //}
    } catch (e) {
        handleExceptionWithAlert('Exception in my.js.cmdYearSelectedChanged()', e.message + ', ' + e.stack);
    }
}

function displayFreeTrialExpiredDialog() {
    try {
        var dialogWidth = 450;
        var dialogHeight = 250;
        try {
            //displayAlertDialog('navigator.userAgent:' + navigator.userAgent);
            if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
                dialogWidth = 950;
                dialogHeight = 675;
            } else if (navigator.userAgent.toLowerCase().indexOf("android") > -1) {
                dialogWidth = 950;
                dialogHeight = 850;
            } else if (navigator.userAgent.toLowerCase().indexOf("nokia") > -1) {
                dialogWidth = 950;
                dialogHeight = 950;
            } else if (navigator.userAgent.toLowerCase().indexOf("mobile safari") > -1) {
                dialogWidth = 950;
                dialogHeight = 950;
            } else if (navigator.userAgent.toLowerCase().indexOf("playbook") > -1) {
                dialogWidth = 950;
                dialogHeight = 700;
            } else if (navigator.userAgent.toLowerCase().indexOf("silk") > -1) {
                dialogWidth = 950;
                dialogHeight = 600;
            } else {
                // IE on windows laptop. Google Nexus 4. Safari on MacBook Air.
                dialogWidth = 450;
                dialogHeight = 300;
            }
        } catch (e) {
            // Not sure if we need to catch this error or not.
        }

        // This is our licensing dialog.
        $("#trialVersionHasExpired").dialog({
            modal: true,
            resizable: false,
            width: dialogWidth,
            height: dialogHeight,
            hide: false//, // This means when hiding just disappear with no effects.
            //position: { my: "center bottom", at: "center", of: window }
            //open: function (event, ui) {
            //    $(this).parent().css('position', 'fixed');
            //}
        });

        $('#ui-id-1').parent().hide();
        $('#ui-id-1').parent().parent().css('background', 'white'); // The background of the whole dialog.

        // Now we customize the display depending on the device.
        var html = '';
        try {
            //displayAlertDialog('navigator.userAgent:' + navigator.userAgent);
            if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
                html += '<table style="font-size:36px;">';
                html += '   <tr>';
                html += '       <td>';
                html += '           <br /><a href="http://budgetworkflow.com/purchase-budget-workflow-manager" target="_blank">This free trial has expired. <br /><br />Click here to find out how to purchase!</a>';
                html += '           <br /><br />OR<br /><br />';
                html += '           <a href="http://budgetworkflow.com/budget-workflow-manager-suggestions" target="_blank">Click here to send us suggestions for improvements. If they make it into the next version, we\'ll give you a copy for FREE!</a>';
                html += '       </td>';
                html += '   </tr>';
                html += '</table>';
            } else if (navigator.userAgent.toLowerCase().indexOf("android") > -1) {
                html += '<table style="font-size:36px;">';
                html += '   <tr>';
                html += '       <td>';
                html += '           <br /><a href="http://budgetworkflow.com/purchase-budget-workflow-manager" target="_blank">This free trial has expired. <br /><br />Click here to find out how to purchase!</a>';
                html += '           <br /><br />OR<br /><br />';
                html += '           <a href="http://budgetworkflow.com/budget-workflow-manager-suggestions" target="_blank">Click here to send us suggestions for improvements. If they make it into the next version, we\'ll give you a copy for FREE!</a>';
                html += '       </td>';
                html += '   </tr>';
                html += '</table>';
            } else if (navigator.userAgent.toLowerCase().indexOf("nokia") > -1) {
                html += '<table style="font-size:36px;">';
                html += '   <tr>';
                html += '       <td>';
                html += '           <br /><a href="http://budgetworkflow.com/purchase-budget-workflow-manager" target="_blank">This free trial has expired. <br /><br />Click here to find out how to purchase!</a>';
                html += '           <br /><br />OR<br /><br />';
                html += '           <a href="http://budgetworkflow.com/budget-workflow-manager-suggestions" target="_blank">Click here to send us suggestions for improvements. If they make it into the next version, we\'ll give you a copy for FREE!</a>';
                html += '       </td>';
                html += '   </tr>';
                html += '</table>';
            } else if (navigator.userAgent.toLowerCase().indexOf("mobile safari") > -1) {
                html += '<table style="font-size:36px;">';
                html += '   <tr>';
                html += '       <td>';
                html += '           <br /><a href="http://budgetworkflow.com/purchase-budget-workflow-manager" target="_blank">This free trial has expired. <br /><br />Click here to find out how to purchase!</a>';
                html += '           <br /><br />OR<br /><br />';
                html += '           <a href="http://budgetworkflow.com/budget-workflow-manager-suggestions" target="_blank">Click here to send us suggestions for improvements. If they make it into the next version, we\'ll give you a copy for FREE!</a>';
                html += '       </td>';
                html += '   </tr>';
                html += '</table>';
            } else if (navigator.userAgent.toLowerCase().indexOf("playbook") > -1) {
                html += '<table style="font-size:36px;">';
                html += '   <tr>';
                html += '       <td>';
                html += '           <br /><a href="http://budgetworkflow.com/purchase-budget-workflow-manager" target="_blank">This free trial has expired. <br /><br />Click here to find out how to purchase!</a>';
                html += '           <br /><br />OR<br /><br />';
                html += '           <a href="http://budgetworkflow.com/budget-workflow-manager-suggestions" target="_blank">Click here to send us suggestions for improvements. If they make it into the next version, we\'ll give you a copy for FREE!</a>';
                html += '       </td>';
                html += '   </tr>';
                html += '</table>';
            } else if (navigator.userAgent.toLowerCase().indexOf("silk") > -1) {
                html += '<table style="font-size:36px;">';
                html += '   <tr>';
                html += '       <td>';
                html += '           <br /><a href="http://budgetworkflow.com/purchase-budget-workflow-manager" target="_blank">This free trial has expired. <br /><br />Click here to find out how to purchase!</a>';
                html += '           <br /><br />OR<br /><br />';
                html += '           <a href="http://budgetworkflow.com/budget-workflow-manager-suggestions" target="_blank">Click here to send us suggestions for improvements. If they make it into the next version, we\'ll give you a copy for FREE!</a>';
                html += '       </td>';
                html += '   </tr>';
                html += '</table>';
            } else {
                // IE on windows laptop. Google Nexus 4. Safari on MacBook Air.
                //html += 'IE on windows laptop. Google Nexus 4. Safari on MacBook Air.';
                html += '<table>';
                html += '   <tr>';
                html += '       <td style="font-size:large;">';
                html += '           <br /><a href="http://budgetworkflow.com/purchase-budget-workflow-manager" target="_blank">This free trial has expired. <br /><br />Click here to find out how to purchase!</a>';
                html += '           <br /><br />OR<br /><br />';
                html += '           <a href="http://budgetworkflow.com/budget-workflow-manager-suggestions" target="_blank">Click here to send us suggestions for improvements. If they make it into the next version, we\'ll give you a copy for FREE!</a>';
                html += '       </td>';
                html += '   </tr>';
                html += '</table>';
                //html += 'IE on windows laptop. Google Nexus 4. Safari on MacBook Air.';
            }
        } catch (e) {
            // Not sure if we need to catch this error or not.
        }

        $('#trialVersionHasExpired').append(html);

        var addEvent = function (object, type, callback) {
            if (object == null || typeof (object) == 'undefined') return;
            if (object.addEventListener) {
                object.addEventListener(type, callback, false);
            } else if (object.attachEvent) {
                object.attachEvent("on" + type, callback);
            } else {
                object["on" + type] = callback;
            }
        };

        addEvent(window, "resize", function (event) {
            var viewport = {
                width: $(window).width(),
                height: $(window).height()
            };

            var viewportWidth = viewport.width;
            var viewportHeight = viewport.height;

            var x = (viewportWidth / 2) - (dialogWidth / 2);
            var y = (viewportHeight / 2) - (dialogHeight / 2);

            $('#trialVersionHasExpired').dialog().position().left = x;
        });
    } catch (e) {
        handleExceptionWithAlert('Error in Start.js.displayFreeTrialExpiredDialog()', e.message);
    }
}

function setCustomSizesDependingOnTheDevice() {
    try {
        //displayAlertDialog('navigator.userAgent:' + navigator.userAgent);
        if (navigator.userAgent.match(/iPhone/i)) {
            $('#bwQuickLaunchMenu').animate({
                'zoom': 4
            }, 400);
            //$('#divSummaryReportMasterDiv').animate({ 'zoom': 4 }, 400); 
            //$('#divMenuMasterDiv').animate({ 'zoom': 4 }, 400); 
            //$('#tblSummaryReportPreferences').animate({ 'zoom': 4 }, 400); 
        } else if (navigator.userAgent.match(/iPad/i)) {
            $('#bwQuickLaunchMenu').animate({
                'zoom': 2
            }, 400);
            $('#divMenuMasterDiv').animate({
                'zoom': 1
            }, 400);
            $('#tblSummaryReportPreferences').animate({
                'zoom': 1
            }, 400);
        } else if (navigator.userAgent.toLowerCase().indexOf("android") > -1) {
            $('#bwQuickLaunchMenu').animate({
                'zoom': 5
            }, 800);
            $('#divSummaryReportMasterDiv').animate({
                'zoom': 5
            }, 800);
            $('#divMenuMasterDiv').animate({
                'zoom': 5
            }, 800);
            $('#tblSummaryReportPreferences').animate({
                'zoom': 5
            }, 800);
        } else if (navigator.userAgent.toLowerCase().indexOf("nokia") > -1) {
            $('#bwQuickLaunchMenu').animate({
                'zoom': 5
            }, 800);
            $('#divSummaryReportMasterDiv').animate({
                'zoom': 5
            }, 800);
            $('#divMenuMasterDiv').animate({
                'zoom': 5
            }, 800);
            $('#tblSummaryReportPreferences').animate({
                'zoom': 5
            }, 800);
        } else if (navigator.userAgent.toLowerCase().indexOf("mobile safari") > -1) {
            $('#bwQuickLaunchMenu').animate({
                'zoom': 5
            }, 800);
            $('#divSummaryReportMasterDiv').animate({
                'zoom': 5
            }, 800);
            $('#divMenuMasterDiv').animate({
                'zoom': 5
            }, 800);
            $('#tblSummaryReportPreferences').animate({
                'zoom': 5
            }, 800);
        } else if (navigator.userAgent.toLowerCase().indexOf("playbook") > -1) {
            $('#bwQuickLaunchMenu').animate({
                'zoom': 5
            }, 800);
            $('#divSummaryReportMasterDiv').animate({
                'zoom': 5
            }, 800);
            $('#divMenuMasterDiv').animate({
                'zoom': 5
            }, 800);
            $('#tblSummaryReportPreferences').animate({
                'zoom': 5
            }, 800);
        } else if (navigator.userAgent.toLowerCase().indexOf("silk") > -1) {
            $('#bwQuickLaunchMenu').animate({
                'zoom': 3
            }, 800);
            $('#divSummaryReportMasterDiv').animate({
                'zoom': 3
            }, 800);
            $('#divMenuMasterDiv').animate({
                'zoom': 3
            }, 800);
            $('#tblSummaryReportPreferences').animate({
                'zoom': 3
            }, 800);
            //} else if(typeof window.orientation !== 'undefined'){
            //    $('#bwQuickLaunchMenu').animate({ 'zoom': 6 }, 800);
            //displayAlertDialog('some other mobile browser');
        } else {
            $('#bwQuickLaunchMenu').animate({
                'zoom': 2
            }, 400); // IE on windows laptop. Google Nexus 4. Safari on MacBook Air. 
        }
    } catch (e) {
        // Not sure if we need to catch this error or not.
        handleExceptionWithAlert('Error in Start.js.setCustomSizesDependingOnTheDevice()', e.message);
    }
}

function thereAreNoConnectedWorkflowsSoDisplayTheConfigurationScreenAppropriately() {
    try {
        //debugger;
        populateStartPageItem('divConfiguration', '', '');
    } catch (e) {
        handleExceptionWithAlert('Error in Start.js.thereAreNoConnectedWorkflowsSoDisplayTheConfigurationScreenAppropriately()', e.message);
    }
}


function collapseOrExpandBwFunctionalAreaDiv(functionalAreaDivId, deferredIndex) {
    // This collapses or expands this div section.
    try {
        var div = document.getElementById(functionalAreaDivId);
        var visible = div.style.visibility;
        if (visible == '') {
            div.style.visibility = 'hidden';
            $('#' + functionalAreaDivId).hide();
        } else if (visible == 'visible') {
            div.style.visibility = 'hidden';
            $('#' + functionalAreaDivId).hide();
        } else if (visible == 'hidden') {
            // Since we are expanding, we're going to hide the Top-_1 and Top_2 rows so it appears as it should on the first viewing.
            var topRow1Id = 'functionalAreaRow_' + deferredIndex.toString() + '_Top_1';
            var topRow2Id = 'functionalAreaRow_' + deferredIndex.toString() + '_Top_2';
            var topRow1 = document.getElementById(topRow1Id);
            var topRow2 = document.getElementById(topRow2Id);
            try {
                topRow1.style.visibility = 'hidden';
                topRow1.style.display = 'none';
                //$('#' + topRow1Id).hide();
                topRow2.style.visibility = 'hidden';
                topRow2.style.display = 'none';
            } catch (e) {
                //
            }
            // Now show the whole functional area section.
            div.style.visibility = 'visible';
            $('#' + functionalAreaDivId).show();
            // It is currently visible, so we have to display the original row again. We're lazy, just doing them all.
            try {
                for (var i = 0; i < 1000; i++) {
                    var currentRowId = 'functionalAreaRow_' + deferredIndex.toString() + '_' + i.toString();
                    var currentRow = document.getElementById(currentRowId);
                    currentRow.style.visibility = 'visible';
                    $('#' + currentRowId).show();
                }
            } catch (e) {
                // This means we are done so continue on!
            }
        } else {
            div.style.visibility = 'hidden';
            $('#' + functionalAreaDivId).hide();
        }
    } catch (e) {
        //handleExceptionWithAlert('Error in Start.js.collapseOrExpandBwFunctionalAreaDiv()', e.message); // Hiding this for the moment because the burn rate report link seems to be causing some iterference with this! If yo uenable this again, then go and click on the burn rate report link and you will see the issue.
    }
}

function expandFunctionalAreaAndRenderAlerts(functionalArea, deferredIndex, functionalAreaRowId) {
    // This is with the new approach, using the top TR tag.
    try {
        var appWebUrl = BWMData[0][deferredIndex][1];

        //displayAlertDialog('expandFunctionalAreaAndRenderAlerts');

        var clickedRowHtml = $('#' + functionalAreaRowId)[0].innerHTML; // This is the row that we want to move to the top and expand: functionalAreaRowId
        var topRow1Id = 'functionalAreaRow_' + deferredIndex.toString() + '_Top_1';
        var topRow2Id = 'functionalAreaRow_' + deferredIndex.toString() + '_Top_2';
        var div1 = document.getElementById(topRow1Id);
        var div2 = document.getElementById(topRow2Id);
        var div = document.getElementById(functionalAreaRowId);
        // First we have to show the previous row that was hidden, if there was one.
        if (div1.style.visibility == 'visible') {
            // It is currently visible, so we have to display the original row again. We're lazy, just doing them all.
            try {
                for (var i = 0; i < 1000; i++) {
                    var currentRowId = 'functionalAreaRow_' + deferredIndex.toString() + '_' + i.toString();
                    var currentRow = document.getElementById(currentRowId);
                    currentRow.style.visibility = 'visible';
                    $('#' + currentRowId).show();
                }
            } catch (e) {
                // This means we are done so continue on!
            }
        }
        // Now we put this in the top row, and show it.
        $('#' + topRow1Id)[0].innerHTML = clickedRowHtml;
        div1.style.visibility = 'visible';
        $('#' + topRow1Id).show();
        // We need to reset the background-color of the cell due to the hover over having left it colored.
        $('#' + topRow1Id).find('.bwFADrillDownLinkCell').css({
            'background-color': 'white', 'color': '#444', 'cursor': 'default'
        });

        // Now we hide the original row.
        div.style.visibility = 'hidden';
        $('#' + functionalAreaRowId).hide();

        // Now we show the details underneath.
        // This function brings the functionalArea to the top of the display,
        // with drill down information.
        var functionalAreaId;
        // We have the correct app web, now we have to find the Functional Area.
        for (var i = 0; i < BWMData[0][deferredIndex][4].length; i++) {
            if (BWMData[0][deferredIndex][4][i][1] == functionalArea) {
                // We have located the correct Functional Area! Now we can get the Functional Area Id.
                functionalAreaId = BWMData[0][deferredIndex][4][i][0];
            }
        }
        //var endpointUrl = appweburl + "/_api/SP.AppContextSite(@target)/web/lists/getbytitle('BudgetRequests')/GetItems?@target='" + appWebUrl + "'";
        //var endpointUrl = appweburl + "/_api/web/lists/getbytitle('BudgetRequests')/GetItems"; //?@target='" + appWebUrl + "'";
        var endpointUrl = webserviceurl + "/bwbudgetrequests/getbyfunctionalareaid/" + functionalAreaId;

        //var executor = new SP.RequestExecutor(appweburl);
        //executor.executeAsync({
        //    url: endpointUrl,
        //    method: "POST",
        //    body: JSON.stringify({ "query": { "__metadata": { "type": "SP.CamlQuery" }, "ViewXml": "<View><Query><Where><Eq><FieldRef Name='FunctionalAreaId'/><Value Type='Text'>" + functionalAreaId + "</Value></Eq></Where></Query><ViewFields><FieldRef Name='FunctionalAreaId'/><FieldRef Name='Quote'/><FieldRef Name='Title'/><FieldRef Name='ARStatus'/><FieldRef Name='BudgetWorkflowStatus'/><FieldRef Name='BudgetRequestLink1'/><FieldRef Name='ProjectTitle'/><FieldRef Name='BudgetAmount'/><FieldRef Name='CurrentOwner'/><FieldRef Name='Created'/></ViewFields></View>" } }),
        //    headers: {
        //        "Accept": "application/json; odata=verbose",
        //        "Content-Type": "application/json; odata=verbose",
        //        "X-RequestDigest": $("#__REQUESTDIGEST").val()
        //    },
        //    success: function (data) {
        $.ajax({
            url: endpointUrl,
            method: "GET",
            //body: body,
            headers: {
                "Accept": "application/json; odata=verbose"
            },
            success: function (brItems) {

                //displayAlertDialog(JSON.stringify(brItems));

                //var brItems = JSON.parse(data.body);
                var approvedBrItems = [];
                var submittedBrItems = [];
                for (var i = 0; i < brItems.d.results.length; i++) {
                    var brItem = [];
                    brItem.push(appWebUrl); // we don't need this but we can remove it later.
                    brItem.push(brItems.d.results[i].ProjectTitle);
                    brItem.push(brItems.d.results[i].BudgetAmount);
                    brItem.push(brItems.d.results[i].bwBudgetRequestId);
                    brItem.push(brItems.d.results[i].CurrentOwner);
                    brItem.push(brItems.d.results[i].Title);
                    brItem.push(brItems.d.results[i].Created);
                    if ((brItems.d.results[i].ARStatus == 'Submitted') || ((brItems.d.results[i].ARStatus == 'Approved') && ((brItems.d.results[i].BudgetWorkflowStatus == 'Procurement: Issue PO#' || brItems.d.results[i].BudgetWorkflowStatus == 'Issue PO#: Additional Info Needed')))) {
                        submittedBrItems.push(brItem);
                    }
                    //brItem.push(brItems.d.results[i].Created);
                }
                var topHtml = '';
                for (var i = 0; i < BWMData[0][deferredIndex][4].length; i++) {
                    if (BWMData[0][deferredIndex][4][i][1] == functionalArea) {
                        // The Functional Area in a right-rounded blue bar.
                        topHtml += '<tr>';
                        topHtml += '    <td colspan="7">';
                        topHtml += '        <table>';
                        // Render the "Pending" section.
                        for (var pi = 0; pi < submittedBrItems.length; pi++) {
                            topHtml += '        <tr>';
                            topHtml += '            <td style="width:90px;"></td>';
                            topHtml += '            <td>&nbsp;&nbsp;</td>';

                            //displayAlertDialog('xxx2');

                            //topHtml += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;" colspan="5">Submitted xxxx ' + formatDateFromSharePoint(submittedBrItems[pi][6]) + ' days ago: <a style="cursor:pointer;" onclick="displayArInDialog(\'' + submittedBrItems[pi][0] + '\', \'' + submittedBrItems[pi][3] + '\', \'' + submittedBrItems[pi][5] + '\', \'' + submittedBrItems[pi][1] + '\');" target="_blank" title="Click to view the request...">' + submittedBrItems[pi][1] + ' (<em>' + formatCurrency(submittedBrItems[pi][2]) + '</em>) - <em>ID:' + submittedBrItems[pi][4] + '  Todd xxxx</em></a></td>'; //</a>&nbsp;&nbsp;&nbsp;<em>xxxx days overdue (Todd xxxx1)</em></td>';
                            //topHtml += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;" colspan="5"><a style="cursor:pointer;" onclick="displayArInDialog(\'' + submittedBrItems[pi][0] + '\', \'' + submittedBrItems[pi][3] + '\', \'' + submittedBrItems[pi][5] + '\', \'' + submittedBrItems[pi][1] + '\');" target="_blank" title="Click to view the request...">' + submittedBrItems[pi][1] + ' (<em>' + formatCurrency(submittedBrItems[pi][2]) + ' - Submitted ' + formatDateFromSharePoint(submittedBrItems[pi][6]) + '</em>)</a></td>';
                            //topHtml += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="5" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'#d8d8d8\';"><a style="cursor:pointer;" onclick="displayArInDialog(\'' + appWebUrl + '\', \'' + submittedBrItems[pi][3] + '\', \'' + submittedBrItems[pi][5] + '\', \'' + encodeHtmlAttribute(submittedBrItems[pi][1]) + '\', \'' + submittedBrItems[pi][5] + '\');" target="_blank" title="Click to view the request...">' + submittedBrItems[pi][1] + ' (<em>' + formatCurrency(submittedBrItems[pi][2]) + ' - Submitted ' + formatDateFromBW(submittedBrItems[pi][6]) + '</em>)</a></td>';
                            //debugger;

                            debugger; // 12-23-2021 get bwWorkflowTaskItemId xcx3

                            //debugger;
                            topHtml += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="5" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + submittedBrItems[pi][5] + '\', \'' + submittedBrItems[pi][1] + '\', \'' + '' + '\', \'' + workflowAppId + '\', \'' + submittedBrItems[pi][3] + '\', this);this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + appWebUrl + '\', \'' + submittedBrItems[pi][3] + '\', \'' + submittedBrItems[pi][5] + '\', \'' + encodeHtmlAttribute(submittedBrItems[pi][1]) + '\', \'' + submittedBrItems[pi][5] + '\');" target="_blank" >' + submittedBrItems[pi][5] + ': ' + submittedBrItems[pi][1] + ' (<em>' + formatCurrency(submittedBrItems[pi][2]) + ' - Submitted ' + 'xcx0' + formatDateFromBW(submittedBrItems[pi][6]) + '</em>)</td>';


                            topHtml += '        </tr>';
                        }
                        topHtml += '        </td>';
                        topHtml += '    </tr>';
                        topHtml += '</table>';

                        // Closing tags.
                        topHtml += '   </td>';
                        topHtml += '</tr>';
                    } else {

                    }
                }


                //displayAlertDialog('expandFunctionalAreaAndRenderAlerts(): topRow2Id: ' + topRow2Id);

                // This is where it is displayed!
                $('#' + topRow2Id)[0].innerHTML = topHtml;
                div2.style.visibility = 'visible';
                $('#' + topRow2Id).show();
            },
            error: function (data, errorCode, errorMessage) {
                handleExceptionWithAlert('Error in my.js.expandFunctionalAreaAndRenderAlerts()', '1:' + errorCode + ', ' + errorMessage);
            }
        });
    } catch (e) {
        handleExceptionWithAlert('Error in my.js.expandFunctionalAreaAndRenderAlerts()', '2:' + e.message);
    }
}



function getUserDetails(participantId, appWebUrl, deferredIndex) {
    // This is deferred!
    try {
        var endpointUrl = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + participantId;
        $.ajax({
            url: endpointUrl,
            method: "GET",
            headers: {
                "Accept": "application/json; odata=verbose"
            },
            success: function (userItems) {
                var userIdAndProperties = new Array(3);
                if (userItems.d.results.length > 0) {
                    userIdAndProperties[0] = userItems.d.results[0].bwParticipantId; // Web user id, eg: 9.
                    userIdAndProperties[1] = userItems.d.results[0].bwParticipantFriendlyName; // User's friendly name.
                    userIdAndProperties[2] = userItems.d.results[0].bwParticipantEmail; // User's email address.
                }
                GetUserDetails[deferredIndex].resolve(userIdAndProperties);
            },
            error: function (data, errorCode, errorMessage) {
                handleExceptionWithAlert('Error in my.js.getUserDetails()', '1:' + errorCode + ', ' + errorMessage);
            }
        });
    } catch (e) {
        handleExceptionWithAlert('Error in my.js.getUserDetails()', '2:' + e.message);
    }
}

function displayArInDialog(appWebUrl, budgetRequestId, arName, brTitle, title) {


    if (!budgetRequestId && !brTitle) {
        // This means we are coming from a .xsl, so we have to find the values.
        budgetRequestId = $('span[xd\\:binding = "my:BudgetRequestId"]')[0].innerHTML; // my:BudgetRequestId
        appWebUrl = globalUrlPrefix + globalUrlForWebServices;
        brTitle = $('span[xd\\:binding = "my:Project_Name"]')[0].innerHTML; // my:Project_Name
        title = $('span[xd\\:binding = "my:Title"]')[0].innerHTML; // eg: BR-160001

        // This shows the AR in a jquery dialog window.
        try {
            $('#spanArDialogTitle').empty(); // We have to empty the contents of the dialog before it is displayed.
            $('#spanArDialogTaskAuditTrail').empty(); // We have to empty the contents of the dialog before it is displayed.
            $('#spanArDialogViewBudgetRequestLink').empty(); // We have to empty the contents of the dialog before it is displayed.
            $("#ArDialog").dialog({
                modal: true,
                resizable: false,
                closeText: "Cancel",
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                //title: brTitle + ' (' + arName.replace('.xml', '') + ")",
                title: brTitle + " (" + title + ")",
                width: "720px",
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function (event, ui) {
                    $('.ui-widget-overlay').bind('click', function () { $("#ArDialog").dialog('close'); });
                    //var invitationUrl = globalUrlPrefix + globalUrl + '?invitation=' + invitationId;
                    ////$('#invitationLink2').text(invitationUrl);
                    //document.getElementById('textareaViewInvitationDialogInvitationDetails').innerHTML = invitationUrl;
                    //document.getElementById('textareaViewInvitationDialogInvitationDetails').blur();
                }
                //buttons: {
                //    "Close": function () {
                //        $(this).dialog("close");
                //    }
                //}
            });
            $("#ArDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            $('#spanArDialogTitle').html(brTitle + ' (' + title + ')x8');

            var operationUri = webserviceurl + "/bwworkflowtasks/getbybudgetrequestid/" + budgetRequestId;
            $.ajax({
                url: operationUri,
                method: "GET",
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (wtItems) {
                    if (wtItems.d.results.length == 0) {
                        // Todd: There were no results, so put some message on the screen to indicate that.?
                    } else {
                        // First we have to create an array of user Id's so we can pass it the method in order to get back the friendly names.
                        var userIds = [];
                        userIds.push(wtItems.d.results[0].bwAuthorId);
                        for (var ui = 0; ui < wtItems.d.results.length; ui++) {
                            userIds.push(wtItems.d.results[ui].bwAssignedToId);
                        }
                        var UserFriendlyNames = [];
                        var dataRetrievalCount = 0;
                        for (var uids = 0; uids < userIds.length; uids++) {
                            // Ok now we have to make a deferred call to get back the Friendly Names.
                            GetUserDetails[uids] = $.Deferred();
                            GetUserDetails[uids]
                                .done(function (data) {
                                    dataRetrievalCount += 1; // Increment the count!
                                    // Add the results to the array.
                                    UserFriendlyNames.push(data);
                                    // Check if all of the data has come back yet.
                                    if (dataRetrievalCount == userIds.length) {
                                        // Now that we have all the friendly names we need for the user Ids, we can proceed.
                                        var html = '';
                                        html += '<table>';
                                        html += '   <tr>';
                                        html += '       <td title="' + formatDateAndTimeFromBW(wtItems.d.results[0].Created) + '">';
                                        var authorName = '';
                                        for (var c = 0; c < UserFriendlyNames.length; c++) {
                                            if (UserFriendlyNames[c][0] == wtItems.d.results[0].bwAuthorId) authorName = UserFriendlyNames[c][1];
                                        }
                                        html += '           <strike><span style="cursor:help;">xcx1' + formatDateFromBW(wtItems.d.results[0].Created) + ' - Budget Request submitted by ' + authorName + '</span></strike>';
                                        html += '       </td>';
                                        html += '   </tr>';
                                        html += '</table>';
                                        for (var ri = 0; ri < wtItems.d.results.length; ri++) {
                                            // Iterate through all of the tasks and build the list for this Budget Request ListItem.
                                            html += '<table>';
                                            html += '   <tr>';
                                            //html += '       <td title="' + formatDateAndTimeFromBW(wtItems.d.results[ri].Modified) + '">';
                                            if ((wtItems.d.results[ri].bwPercentComplete == 100) && (wtItems.d.results[ri].bwStatus == 'Completed')) {
                                                html += '       <td title="' + formatDateAndTimeFromBW(wtItems.d.results[ri].Modified) + '">';
                                                html += '       <strike>';
                                                html += '<span style="cursor:help;">xcx2' + formatDateFromBW(wtItems.d.results[ri].Modified) + ' - ' + wtItems.d.results[ri].bwTaskOutcome + '</span>';
                                                html += '       </strike>';
                                                html += '       </td>';
                                            } else {
                                                var assignedToName = '';
                                                for (var c = 0; c < UserFriendlyNames.length; c++) {
                                                    if (UserFriendlyNames[c][0] == wtItems.d.results[ri].bwAssignedToId) assignedToName = UserFriendlyNames[c][1];
                                                }
                                                html += '       <td title="' + formatDateAndTimeFromBW(wtItems.d.results[ri].Created) + '">';
                                                html += '<span style="cursor:help;">xcx3' + formatDateFromBW(wtItems.d.results[ri].Created) + ' - ' + wtItems.d.results[ri].bwTaskTitle + ' assigned to ' + assignedToName + '</span>';
                                                html += '       </td>';
                                            }
                                            //html += '       </td>';
                                            html += '   </tr>';
                                            html += '</table>';
                                        }

                                        $('#spanArDialogTaskAuditTrail').html(html);

                                        html = '';
                                        html += '<table>';
                                        html += '   <tr>';
                                        html += '       <td>&nbsp;</td>';
                                        html += '   </tr>';
                                        html += '   <tr>';
                                        html += '       <td>';
                                        //html += '           <a href="javascript:displayArOnTheHomePage(\'' + budgetRequestId + '\', \'' + participantId + '\', \'' + title + '\');">Click here to view the Budget Request</a>';
                                        //debugger;


                                        alert('Developer: Is this code used? xcx2200499.');
                                        html += '           <a onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequestId + '\', \'' + participantId + '\', \'' + title + '\');">Click here to view the Budget Request</a>';
                                        html += '       </td>';
                                        html += '   </tr>';
                                        html += '</table>';

                                        $('#spanArDialogViewBudgetRequestLink').html(html);

                                        $('#ui-id-1').css('border-radius', '20px 0 0 20px');
                                    }
                                })
                                .fail(function (data) {
                                    handleExceptionWithAlert('Error in my.js.displayArInDialog().GetUserDetails.fail()', 'GetUserDetails.fail()');
                                });
                            getUserDetails(userIds[uids], appWebUrl, uids);
                        }
                    }
                },
                error: function (error) {
                    handleExceptionWithAlert('Error in my.js.displayArInDialog()', '1:' + errorCode + ', ' + errorMessage);
                }
            });
        } catch (e) {
            handleExceptionWithAlert('Error in my.js.displayArInDialog()', '2:' + e.message);
        }
    } else if (!appWebUrl && !budgetRequestId && !arName && !title) {
        //displayAlertDialog('This means we are coming from the burn rate report.');
        // This means we are coming from the burn rate report.
        // First we have to get the budgetRequestId from the Title (eg: BR-00001).
        var operationUri = webserviceurl + "/getbudgetrequestidfromtitle/" + brTitle;
        $.ajax({
            url: operationUri,
            method: "GET",
            headers: {
                "Accept": "application/json; odata=verbose"
            },
            success: function (data) {

                //displayAlertDialog(data);

                budgetRequestId = data[0].bwBudgetRequestId;
                appWebUrl = globalUrlPrefix + globalUrlForWebServices;
                brTitle = data[0].ProjectTitle; // my:Project_Name
                title = data[0].Title; // eg: BR-160001



                // This shows the AR in a jquery dialog window.
                try {
                    $('#spanArDialogTitle').empty(); // We have to empty the contents of the dialog before it is displayed.
                    $('#spanArDialogTaskAuditTrail').empty(); // We have to empty the contents of the dialog before it is displayed.
                    $('#spanArDialogViewBudgetRequestLink').empty(); // We have to empty the contents of the dialog before it is displayed.
                    $("#ArDialog").dialog({
                        modal: true,
                        resizable: false,
                        closeText: "Cancel",
                        closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                        //title: brTitle + ' (' + arName.replace('.xml', '') + ")",
                        title: brTitle + " (" + title + ")",
                        width: "720px",
                        dialogClass: "no-close", // No close button in the upper right corner.
                        hide: false, // This means when hiding just disappear with no effects.
                        open: function (event, ui) {
                            $('.ui-widget-overlay').bind('click', function () { $("#ArDialog").dialog('close'); });
                            //var invitationUrl = globalUrlPrefix + globalUrl + '?invitation=' + invitationId;
                            ////$('#invitationLink2').text(invitationUrl);
                            //document.getElementById('textareaViewInvitationDialogInvitationDetails').innerHTML = invitationUrl;
                            //document.getElementById('textareaViewInvitationDialogInvitationDetails').blur();
                        }
                        //buttons: {
                        //    "Close": function () {
                        //        $(this).dialog("close");
                        //    }
                        //}
                    });
                    $("#ArDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

                    $('#spanArDialogTitle').html(brTitle + ' (' + title + ')x9');

                    var operationUri = webserviceurl + "/bwworkflowtasks/getbybudgetrequestid/" + budgetRequestId;
                    $.ajax({
                        url: operationUri,
                        method: "GET",
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        },
                        success: function (wtItems) {
                            if (wtItems.d.results.length == 0) {
                                // Todd: There were no results, so put some message on the screen to indicate that.?
                            } else {
                                // First we have to create an array of user Id's so we can pass it the method in order to get back the friendly names.
                                var userIds = [];
                                userIds.push(wtItems.d.results[0].bwAuthorId);
                                for (var ui = 0; ui < wtItems.d.results.length; ui++) {
                                    userIds.push(wtItems.d.results[ui].bwAssignedToId);
                                }
                                var UserFriendlyNames = [];
                                var dataRetrievalCount = 0;
                                for (var uids = 0; uids < userIds.length; uids++) {
                                    // Ok now we have to make a deferred call to get back the Friendly Names.
                                    GetUserDetails[uids] = $.Deferred();
                                    GetUserDetails[uids]
                                        .done(function (data) {
                                            dataRetrievalCount += 1; // Increment the count!
                                            // Add the results to the array.
                                            UserFriendlyNames.push(data);
                                            // Check if all of the data has come back yet.
                                            if (dataRetrievalCount == userIds.length) {
                                                // Now that we have all the friendly names we need for the user Ids, we can proceed.
                                                var html = '';
                                                html += '<table>';
                                                html += '   <tr>';
                                                html += '       <td title="' + formatDateAndTimeFromBW(wtItems.d.results[0].Created) + '">';
                                                var authorName = '';
                                                for (var c = 0; c < UserFriendlyNames.length; c++) {
                                                    if (UserFriendlyNames[c][0] == wtItems.d.results[0].bwAuthorId) authorName = UserFriendlyNames[c][1];
                                                }
                                                html += '           <strike><span style="cursor:help;">xcx4' + formatDateFromBW(wtItems.d.results[0].Created) + ' - Budget Request submitted by ' + authorName + '</span></strike>';
                                                html += '       </td>';
                                                html += '   </tr>';
                                                html += '</table>';
                                                for (var ri = 0; ri < wtItems.d.results.length; ri++) {
                                                    // Iterate through all of the tasks and build the list for this Budget Request ListItem.
                                                    html += '<table>';
                                                    html += '   <tr>';
                                                    html += '       <td title="' + formatDateAndTimeFromBW(wtItems.d.results[ri].Modified) + '">';
                                                    if ((wtItems.d.results[ri].bwPercentComplete == 100) && (wtItems.d.results[ri].bwStatus == 'Completed')) {
                                                        html += '       <strike>';
                                                        html += '<span style="cursor:help;">xcx5' + formatDateFromBW(wtItems.d.results[ri].Modified) + ' - ' + wtItems.d.results[ri].bwTaskOutcome + '</span>';
                                                        html += '       </strike>';
                                                    } else {
                                                        var assignedToName = '';
                                                        for (var c = 0; c < UserFriendlyNames.length; c++) {
                                                            if (UserFriendlyNames[c][0] == wtItems.d.results[ri].bwAssignedToId) assignedToName = UserFriendlyNames[c][1];
                                                        }
                                                        html += 'xcx6' + formatDateFromBW(wtItems.d.results[ri].Created) + ' - ' + wtItems.d.results[ri].bwTaskTitle + ' assigned to ' + assignedToName;
                                                    }
                                                    html += '       </td>';
                                                    html += '   </tr>';
                                                    html += '</table>';
                                                }


                                                $('#spanArDialogTaskAuditTrail').html(html);

                                                html = '';
                                                html += '<table>';
                                                html += '   <tr>';
                                                html += '       <td>&nbsp;</td>';
                                                html += '   </tr>';
                                                html += '   <tr>';
                                                html += '       <td>';
                                                //html += '           <a href="javascript:displayArOnTheHomePage(\'' + budgetRequestId + '\', \'' + participantId + '\', \'' + title + '\');">Click here to view the Budget Request</a>';
                                                //debugger;

                                                alert('Developer: Is this code used? xcx559994.');
                                                html += '           <a onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequestId + '\', \'' + participantId + '\', \'' + title + '\');">Click here to view the Budget Request</a>';
                                                html += '       </td>';
                                                html += '   </tr>';
                                                html += '</table>';
                                                $('#spanArDialogViewBudgetRequestLink').html(html);

                                                $('#ui-id-1').css('border-radius', '20px 0 0 20px');
                                            }
                                        })
                                        .fail(function (data) {
                                            handleExceptionWithAlert('Error in my.js.displayArInDialog().GetUserDetails.fail()', 'GetUserDetails.fail()');
                                        });
                                    getUserDetails(userIds[uids], appWebUrl, uids);
                                }
                            }
                        },
                        error: function (error) {
                            handleExceptionWithAlert('Error in my.js.displayArInDialog()', '1:' + errorCode + ', ' + errorMessage);
                        }
                    });
                } catch (e) {
                    handleExceptionWithAlert('Error in my.js.displayArInDialog()', '2:' + e.message);
                }
            },
            error: function (error) {
                handleExceptionWithAlert('Error in my.js.displayArInDialog()', '1:' + errorCode + ', ' + errorMessage);
            }
        });
    } else {
        // Display the thing. We have enough info already!
        // This shows the AR in a jquery dialog window.
        try {
            $('#spanArDialogTitle').empty(); // We have to empty the contents of the dialog before it is displayed.
            $('#spanArDialogTaskAuditTrail').empty(); // We have to empty the contents of the dialog before it is displayed.
            $('#spanArDialogViewBudgetRequestLink').empty(); // We have to empty the contents of the dialog before it is displayed.
            $("#ArDialog").dialog({
                modal: true,
                resizable: false,
                closeText: "Cancel",
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                //title: brTitle + ' (' + arName.replace('.xml', '') + ")",
                title: brTitle + " (" + title + ")",
                width: "720px",
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function (event, ui) {
                    $('.ui-widget-overlay').bind('click', function () { $("#ArDialog").dialog('close'); });
                    //var invitationUrl = globalUrlPrefix + globalUrl + '?invitation=' + invitationId;
                    ////$('#invitationLink2').text(invitationUrl);
                    //document.getElementById('textareaViewInvitationDialogInvitationDetails').innerHTML = invitationUrl;
                    //document.getElementById('textareaViewInvitationDialogInvitationDetails').blur();








                    //// First, let's create our drawing surface out of an existing SVG element
                    //// If you want to create a new surface just provide dimensions
                    //// like s = Snap(800, 600);
                    //var s = Snap("#svg");
                    //// Let's create a big circle in the middle:
                    //var bigCircle = s.circle(150, 150, 100);






                }
                //buttons: {
                //    "Close": function () {
                //        $(this).dialog("close");
                //    }
                //}
            });
            $("#ArDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            $('#spanArDialogTitle').html(brTitle + ' (' + title + ')x10');

            var operationUri = webserviceurl + "/bwworkflowtasks/getbybudgetrequestid/" + budgetRequestId;
            $.ajax({
                url: operationUri,
                method: "GET",
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (wtItems) {
                    if (wtItems.d.results.length == 0) {
                        // Todd: There were no results, so put some message on the screen to indicate that.?
                    } else {
                        // First we have to create an array of user Id's so we can pass it the method in order to get back the friendly names.
                        var userIds = [];
                        userIds.push(wtItems.d.results[0].bwAuthorId);
                        for (var ui = 0; ui < wtItems.d.results.length; ui++) {
                            userIds.push(wtItems.d.results[ui].bwAssignedToId);
                        }
                        var UserFriendlyNames = [];
                        var dataRetrievalCount = 0;
                        for (var uids = 0; uids < userIds.length; uids++) {
                            // Ok now we have to make a deferred call to get back the Friendly Names.
                            GetUserDetails[uids] = $.Deferred();
                            GetUserDetails[uids]
                                .done(function (data) {
                                    dataRetrievalCount += 1; // Increment the count!
                                    // Add the results to the array.
                                    UserFriendlyNames.push(data);
                                    // Check if all of the data has come back yet.
                                    if (dataRetrievalCount == userIds.length) {
                                        // Now that we have all the friendly names we need for the user Ids, we can proceed.
                                        var html = '';
                                        html += '<table>';
                                        html += '   <tr>';
                                        html += '       <td title="' + formatDateAndTimeFromBW(wtItems.d.results[0].Created) + '">';
                                        var authorName = '';
                                        for (var c = 0; c < UserFriendlyNames.length; c++) {
                                            if (UserFriendlyNames[c][0] == wtItems.d.results[0].bwAuthorId) authorName = UserFriendlyNames[c][1];
                                        }
                                        html += '           <strike><span style="cursor:help;">xcx7' + formatDateFromBW(wtItems.d.results[0].Created) + ' - Budget Request submitted by ' + authorName + '</span></strike>';
                                        html += '       </td>';
                                        html += '   </tr>';
                                        html += '</table>';
                                        for (var ri = 0; ri < wtItems.d.results.length; ri++) {
                                            // Iterate through all of the tasks and build the list for this Budget Request ListItem.
                                            html += '<table>';
                                            html += '   <tr>';
                                            html += '       <td title="' + formatDateAndTimeFromBW(wtItems.d.results[ri].Modified) + '">';
                                            if ((wtItems.d.results[ri].bwPercentComplete == 100) && (wtItems.d.results[ri].bwStatus == 'Completed')) {
                                                html += '       <strike>';
                                                html += '<span style="cursor:help;">xcx8' + formatDateFromBW(wtItems.d.results[ri].Modified) + ' - ' + wtItems.d.results[ri].bwTaskOutcome + '</span>';
                                                html += '       </strike>';
                                            } else {
                                                var assignedToName = '';
                                                for (var c = 0; c < UserFriendlyNames.length; c++) {
                                                    if (UserFriendlyNames[c][0] == wtItems.d.results[ri].bwAssignedToId) assignedToName = UserFriendlyNames[c][1];
                                                }
                                                html += 'xcx9' + formatDateFromBW(wtItems.d.results[ri].Created) + ' - ' + wtItems.d.results[ri].bwTaskTitle + ' assigned to ' + assignedToName;
                                            }
                                            html += '       </td>';
                                            html += '   </tr>';
                                            html += '</table>';
                                        }

                                        $('#spanArDialogTaskAuditTrail').html(html);

                                        html = '';
                                        html += '<table>';
                                        html += '   <tr>';
                                        html += '       <td>&nbsp;</td>';
                                        html += '   </tr>';
                                        html += '   <tr>';
                                        html += '       <td>';
                                        //html += '           <a href="javascript:displayArOnTheHomePage(\'' + budgetRequestId + '\', \'' + participantId + '\', \'' + title + '\');">Click here to view the Budget Request</a>';
                                        //debugger;

                                        alert('Developer: Is this code used? xcx34435.');
                                        html += '           <a onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequestId + '\', \'' + participantId + '\', \'' + title + '\');">Click here to view the Budget Request</a>';
                                        html += '       </td>';
                                        html += '   </tr>';
                                        html += '</table>';

                                        $('#spanArDialogViewBudgetRequestLink').html(html);

                                        $('#ui-id-1').css('border-radius', '20px 0 0 20px');
                                    }
                                })
                                .fail(function (data) {
                                    handleExceptionWithAlert('Error in my.js.displayArInDialog().GetUserDetails.fail()', 'GetUserDetails.fail()');
                                });
                            getUserDetails(userIds[uids], appWebUrl, uids);
                        }
                    }
                },
                error: function (error) {
                    handleExceptionWithAlert('Error in my.js.displayArInDialog()', '1:' + errorCode + ', ' + errorMessage);
                }
            });
        } catch (e) {
            handleExceptionWithAlert('Error in my.js.displayArInDialog()', '2:' + e.message);
        }
    }
}

function setIOSAppToYes() {
    displayAlertDialog('setIOSAppToYes1');
    iOSApp = 'YES';
}

function displayRecurringExpenseInDialog() {

    //displayAlertDialog('xxxx');

    // Temp till we get good values!!
    var recurringExpenseId = $('span[xd\\:binding = "my:RecurringExpenseId"]')[0].innerHTML;

    //displayAlertDialog('recurringExpenseId: ' + recurringExpenseId);
    // Call the web service "getRecurringExpenseDetails". It will provide:
    // - The recurring expense details
    // - All of the budget request details which have the "RelatedRecurringExpenseId" field populated with the bwRecurringExpenseId.

    var data = [];
    data = {
        bwRecurringExpenseId: recurringExpenseId
    };
    var operationUri = webserviceurl + "/bwrecurringexpense/getrelatedbudgetrequests";
    $.ajax({
        url: operationUri,
        type: "POST", timeout: ajaxTimeout,
        data: data,
        headers: {
            "Accept": "application/json; odata=verbose"
        },
        success: function (data) {
            //displayAlertDialog(JSON.stringify(data.RecurringExpense.CreatedBy));

            var brTitle = data.RecurringExpense[0].ProjectTitle; // eg. Donut
            var title = data.RecurringExpense[0].Title; // eg. RE-160001
            $('#spanRecurringExpenseDialogBudgetRequestsList').empty(); // We have to empty the contents of the dialog before it is displayed.
            $("#RecurringExpenseDialog").dialog({
                modal: true,
                resizable: false,
                closeText: "Cancel",
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                //title: brTitle + ' (' + arName.replace('.xml', '') + ")",
                title: brTitle + " (" + title + ")",
                width: "650px",
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                buttons: {
                    "Update the Reminder Date": function () {
                        // Todd: Validate the reminder date here. It has to happen in the future!
                        $(this).dialog("close");
                    },
                    "Close": function () {
                        $(this).dialog("close");
                    }
                }
            });

            if (data.BudgetRequests.length == 0) {
                var html = '';

                html += '<span>';
                html += 'No budget requests have been submitted for this recurring expense yet.';
                html += '</span>';

                $(html).appendTo($('#spanRecurringExpenseDialogBudgetRequestsList')); // Add to the Budget Requests list.

            } else {
                // Now we have to list all of the budget request details which have the "RelatedRecurringExpenseId" field populated with the bwRecurringExpenseId.
                var html = '';

                html += '<span style="cursor:help;" title="Created by ' + data.RecurringExpense[0].CreatedByEmail + ' on ' + formatDateAndTimeFromBW(data.RecurringExpense[0].Created) + '.">This recurring expense was created by ' + data.RecurringExpense[0].CreatedBy + ' <span style="white-space:nowrap;">on ' + formatDateFromBW(data.RecurringExpense[0].Created) + '.</span></span><br /><br />';

                html += '<span>Since then, the following new budget requests have been created:</span><br />';
                for (var i = 0; i < data.BudgetRequests.length; i++) {
                    var projectTitle = data.BudgetRequests[i].ProjectTitle;
                    var title = data.BudgetRequests[i].Title; // x
                    //var arStatus = data.BudgetRequests[i].ARStatus;
                    var budgetWorkflowStatus = data.BudgetRequests[i].BudgetWorkflowStatus; // x
                    var modified = data.BudgetRequests[i].Modified; // x
                    var modifiedByFriendlyName = data.BudgetRequests[i].ModifiedByFriendlyName; // x

                    html += '<span>';
                    html += modified + ' - ' + projectTitle + ' (' + budgetWorkflowStatus + ' ' + modifiedByFriendlyName + ')';
                    html += '</span>';
                    html += '<br />';

                    // This is a sample so we don't lose our concept!!
                    //html += 'Since then, the following new budget requests have been created:<br />';
                    //html += '        <span title="Marked 'Active' by todd_hiltz@hotmail.comx on Augustx, 2016x at 7am.';
                    //html += ' '; // linefeed!!
                    //html += 'Click now to view the AR.';
                    //html += '              ">';
                    //html += '            <a href="" style="cursor:pointer;">October 9, 2016 - xxxx (approved/active/in progress {ARStatus})</a><br />';
                    //html += '        </span>';
                    //html += '        <span style="cursor:help;" title="Marked 'Active' by todd_hiltz@hotmail.comx on Augustx, 2016x at 7am.';
                    //html += ' '; // linefeed!!
                    //html += 'Click now to view the AR.';
                    //html += '              ">';
                    //html += '            <a href="" style="cursor:pointer;">November 9, 2016 - xxxx (approved/active/in progress {ARStatus})</a><br />';
                    //html += '        </span>';
                }

                $(html).appendTo($('#spanRecurringExpenseDialogBudgetRequestsList')); // Add to the Budget Requests list.
            }
        },
        error: function (data, errorCode, errorMessage) {
            //handleExceptionWithAlert('Error in Start.js.displayConnectedWorkflows()', '1:' + errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in my.js.displayRecurringExpenseInDialog(): ' + errorMessage);
        }
    });
}

function checkForAlerts() {
    try {

        debugger;
        var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
        var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');

        var data = {
            "bwTenantId": tenantId,
            "bwWorkflowAppId": workflowAppId,
            "bwParticipantId": participantId,
            "bwParticipantEmail": participantEmail
        };
        var operationUri = webserviceurl + "/bwtasksoutstanding";
        $.ajax({
            url: operationUri,
            type: "Post", //"DELETE",
            contentType: 'application/json',
            data: data,
            success: function (data) {
                if (data.length > 0) {
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
            },
            error: function (data, errorCode, errorMessage) {
                //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
                //displayAlertDialog('Error in my.js.checkForAlerts():participantId:' + participantId + ', ' + errorCode + ', ' + errorMessage);
                // Todd put error message backin here
                $('#spanAlertLink').html('error!&nbsp;&nbsp;&nbsp;&nbsp;');
                $('#spanAlertLinkNewRequest').html('error!&nbsp;&nbsp;&nbsp;&nbsp;');
                $('#spanAlertLinkMyStuff').html('error!&nbsp;&nbsp;&nbsp;&nbsp;');
                $('#spanAlertLinkSummary').html('error!&nbsp;&nbsp;&nbsp;&nbsp;');
                $('#spanAlertLinkConfiguration').html('error!&nbsp;&nbsp;&nbsp;&nbsp;');
                $('#spanAlertLinkHelp').html('error!&nbsp;&nbsp;&nbsp;&nbsp;');
            }
        });
    } catch (e) {
        $('#spanAlertLink').html('error!&nbsp;&nbsp;&nbsp;&nbsp;');
        $('#spanAlertLinkNewRequest').html('error!&nbsp;&nbsp;&nbsp;&nbsp;');
        $('#spanAlertLinkMyStuff').html('error!&nbsp;&nbsp;&nbsp;&nbsp;');
        $('#spanAlertLinkSummary').html('error!&nbsp;&nbsp;&nbsp;&nbsp;');
        $('#spanAlertLinkConfiguration').html('error!&nbsp;&nbsp;&nbsp;&nbsp;');
        $('#spanAlertLinkHelp').html('error!&nbsp;&nbsp;&nbsp;&nbsp;');
    }
}

//function cmdDisplayArchivePageTrashbinContents() {
//    // This has been prepared for!
//    // The BwBudgetRequest and BwWorkflowTask tables have a field named 'TrashBin' which accomodates this. 
//    // Currently when a budget request is deleted, these items are marked as TrashBin = 'false'.
//    displayAlertDialog('This functionality is incomplete. Coming soon! cmdDisplayArchivePageTrashbinContents()');
//}

// 
function cmdDisplayArchivePageExtendedInformation() {
    // This will show the GUID Id of the AR so that we can audit any issues with the end user.
    displayAlertDialog('This functionality is incomplete. Coming soon! cmdDisplayArchivePageExtendedInformation(). Project Number,Project Title,Executive Summary.attr(\'title\', \'Project Reason\'),Created Date,Project Type,Division,Location,Approval Stage,Current Owner(s),Capital Cost,Expense,Lease,Project Total,Simple Payback');
}

function cmdDisplayArchivePageRecurringExpenses() {
    // This will show the GUID Id of the AR so that we can audit any issues with the end user.
    //displayAlertDialog('This functionality is incomplete. Coming soon! cmdDisplayArchivePageRecurringExpenses()');


    //var html = '';
    //html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 1.77em;">Your currently selected budgeting network: <span style="font-weight:bold;white-space:nowrap;">' + workflowAppTitle + '</span></span>';

    //html += '<br /><br /><input type="button" value="View trashbin contents" onclick="cmdDisplayArchivePageTrashbinContents();" style="cursor:pointer;" />&nbsp;&nbsp;<input type="button" value="View extended information" onclick="cmdDisplayArchivePageExtendedInformation();" style="cursor:pointer;" />&nbsp;&nbsp;<input type="button" value="View recurring expenses" onclick="cmdDisplayArchivePageRecurringExpenses();" style="cursor:pointer;" /><br /><br />';

    //$('#spanArchivePageTopTitle').html(html);

    //GetWorkflowAppConfigurationData9 = $.Deferred();
    //GetWorkflowAppConfigurationData9
    //    .done(function () {
    //        //displayAlertDialog('DONE');
    //        selectArchivePageFilterDropDown_change();
    //        renderLeftButtons('divArchivePageLeftButtons');
    //    })
    //    .fail(function () {
    //        handleExceptionWithAlert('Error in my.js.populateStartPageItem(divFunctionalAreas)', 'GetWorkflowAppConfigurationData9.fail()');
    //    });
    //loadWorkflowAppConfigurationDetails9();



    cmdListAllRecurringExpensesUsingClientDatasetApproach();






}

//function monkeyPatchAutocomplete() {

//    // don't really need this, but in case I did, I could store it and chain
//    var oldFn = $.ui.autocomplete.prototype._renderItem;

//    $.ui.autocomplete.prototype._renderItem = function (ul, item) {
//        var re = new RegExp("^" + this.term);
//        var t = item.label.replace(re, "<span style='font-weight:bold;color:Blue;'>" +
//                this.term +
//                "</span>");
//        return $("<li></li>")
//            .data("item.autocomplete", item)
//            .append("<a>" + t + "</a>")
//            .appendTo(ul);
//    };
//}

function monkeyPatchAutocomplete() {

    $.ui.autocomplete.prototype._renderItem = function (ul, item) {

        var label = item.label;
        var friendlyName = label.split('|')[0];
        var email = label.split('|')[2];
        item.label = friendlyName + ' (' + email + ')'; // + '<span style="visibility:hidden;">|</span>';

        //displayAlertDialog(JSON.stringify(item));



        //// Escape any regex syntax inside this.term
        var cleanTerm = this.term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

        //// Build pipe separated string of terms to highlight
        var keywords = $.trim(cleanTerm).replace('  ', ' ').split(' ').join('|');

        //// Get the new label text to use with matched terms wrapped
        //// in a span tag with a class to do the highlighting
        var re = new RegExp("(" + keywords + ")", "gi");
        var output = item.label.replace(re,
            '<span class="ui-menu-item-highlight">$1</span>');

        return $("<li>")
            .append($("<a>").html(output))
            .appendTo(ul);
    };
};




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


            alert('IN method populateStartPageItem(). divSection: ' + divSection + '. There is no reason to be here, perhaps the button needs to have different code.');


            //try {
            //    $('#FormsEditorToolbox').dialog('close');
            //    //$('#')
            //} catch (e) { }

            //var canvas = document.getElementById("myCanvas");
            //if (canvas) {
            //    var ctx = canvas.getContext("2d");
            //    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines
            //    canvas.style.zIndex = -1;
            //}
            ////debugger;
            //renderWelcomeScreen(); // This may be removed at some point to leave the screen as-is instead of going all the way back to the home screen, which may be neat...time will tell.
            ////renderAlerts2(); // This reloads the alerts that are displayed on the home/welcome page.

            //$('#bwQuickLaunchMenuTd').css({
            //    width: '0'
            //}); // This gets rid of the jumping around.

            //$('#liWelcome').show();
            //$('#liNewRequest').hide();
            //$('#liArchive').hide();
            //$('#liSummaryReport').hide();
            //$('#liConfiguration').hide();
            //$('#liVisualizations').hide();
            //$('#liHelp').hide();

            //$('#divWelcomeMasterDiv').show();
            //var e1 = document.getElementById('divWelcomeMasterDiv');
            //e1.style.borderRadius = '20px 0 0 20px';

            //renderLeftButtons('divWelcomePageLeftButtons');

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

            alert('>>>>>> xcx12345 <<<<<<');
            $('.bwRequest').bwRequest('displayCreateRequestForm', 'divPageContent1');


        } else if (divSection == 'divArchive') {
            //debugger; // THIS NEEDS TO BE MOVED!! >> RENAME TO: renderArchive();



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

            //renderLeftButtons('divHelpPageLeftButtons');





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


            //$('#liWelcome').hide();
            //$('#liNewRequest').hide();
            //$('#liArchive').hide();
            //$('#liSummaryReport').hide();
            //$('#liHelp').hide();
            //$('#liConfiguration').show();
            //$('#liVisualizations').hide();
            //var e1 = document.getElementById('divConfigurationMasterDiv');
            //e1.style.borderRadius = '20px 0 0 20px';
            //var e1 = document.getElementById('divFunctionalAreas');
            //e1.style.borderRadius = '20px 0 0 20px';
            ////debugger;
            //generateConfigurationLeftSideMenu();

            //renderLeftButtons('divConfigurationPageLeftButtons');



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

            //debugger;
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
            //debugger;
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
        console.log('Exception in my.js.populateStartPageItem(' + divSection + ') xcx59e46: ' + e.message + ', ' + e.stack);
        displayAlertDialog('Exception in my.js.populateStartPageItem(' + divSection + ') xcx59e46: ' + e.message + ', ' + e.stack);
    }
}

function cmdDisplayFinancialAreaDialogYouOnlyHaveOneFinancialAreaCopyPreviousYearOption() {
    // This is displayed to owners when the next year rolls around!
    //YouOnlyHaveOneFinancialAreaCopyPreviousYearDialog


    $("#YouOnlyHaveOneFinancialAreaCopyPreviousYearDialog").dialog({
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
        open: function (event, ui) {
            $('.ui-widget-overlay').bind('click', function () {
                $("#YouOnlyHaveOneFinancialAreaCopyPreviousYearDialog").dialog('close');
            });

            var html = '';
            html += '<span style="font-size:small;font-style:italic;">DEV: This functionality is incomplete and is in development!</span>';
            html += '<br /><br />';
            html += 'It\'s a New Year!<br /><br /><span style="font-style:italic;">A financial area called "Miscellaneous" has [automatically been created for 2018], with [you] the owner as the approver for the workflow.</span>';
            html += '<br /><br />';
            //html += 'You only have 1 Financial Area for 2018.';
            //html += '<br />';
            //html += '- Miscellaneous';
            html += '<br />';
            html += '<br />';
            html += '<br />';
            html += '<div id="xxxx" class="divDialogButton" onclick="xxxx();">Replicate from 2017</div>';
            html += '<br />';
            html += '<div id="xxxx" class="divDialogButton" onclick="xxxx();">Only "Miscellaneous"<br />(we will create more<br />of these later)</div>';
            html += '<br />';
            html += '<div id="xxxx" class="divDialogButton" onclick="xxxx();">Remind me in 5^ days</div>';
            html += '<br />';
            html += '<div id="xxxx" class="divDialogButton" onclick="xxxx();">Close</div>';
            html += '<br />';
            html += '<br />';
            html += '';
            document.getElementById('spanYouOnlyHaveOneFinancialAreaCopyPreviousYearDialogContent').innerHTML = html;

        } // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.
    });
    $("#YouOnlyHaveOneFinancialAreaCopyPreviousYearDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

}

// TODD: INCLUDE THIS IN THE LEGALESE - MIT LICENSES!!!
/*
 *    Copyright (c) 2010 Tobias Schneider
 *    This script is freely distributable under the terms of the MIT license.
 */

function renderBarcodeDetails() {
    var UPC_SET = {
        "3211": '0',
        "2221": '1',
        "2122": '2',
        "1411": '3',
        "1132": '4',
        "1231": '5',
        "1114": '6',
        "1312": '7',
        "1213": '8',
        "3112": '9'
    };

    var getBarcodeFromImage = function (imgOrId) {

        //displayAlertDialog('getBarcodeFromImage');

        var doc = document,
            img = "object" == typeof imgOrId ? imgOrId : doc.getElementById(imgOrId),
            canvas = doc.createElement("canvas"),
            width = img.width,
            height = img.height,
            ctx = canvas.getContext("2d"),
            spoints = [1, 9, 2, 8, 3, 7, 4, 6, 5],
            numLines = spoints.length,
            slineStep = height / (numLines + 1),
            round = Math.round;
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0);
        while (numLines--) {
            console.log(spoints[numLines]);
            var pxLine = ctx.getImageData(0, slineStep * spoints[numLines], width, 2).data,
                sum = [],
                min = 0,
                max = 0;
            for (var row = 0; row < 2; row++) {
                for (var col = 0; col < width; col++) {
                    var i = ((row * width) + col) * 4,
                        g = ((pxLine[i] * 3) + (pxLine[i + 1] * 4) + (pxLine[i + 2] * 2)) / 9,
                        s = sum[col];
                    pxLine[i] = pxLine[i + 1] = pxLine[i + 2] = g;
                    sum[col] = g + (undefined == s ? 0 : s);
                }
            }
            for (var i = 0; i < width; i++) {
                var s = sum[i] = sum[i] / 2;
                if (s < min) { min = s; }
                if (s > max) { max = s; }
            }
            var pivot = min + ((max - min) / 2),
                bmp = [];
            for (var col = 0; col < width; col++) {
                var matches = 0;
                for (var row = 0; row < 2; row++) {
                    if (pxLine[((row * width) + col) * 4] > pivot) { matches++; }
                }
                bmp.push(matches > 1);
            }
            var curr = bmp[0],
                count = 1,
                lines = [];
            for (var col = 0; col < width; col++) {
                if (bmp[col] == curr) { count++; }
                else {
                    lines.push(count);
                    count = 1;
                    curr = bmp[col];
                }
            }
            var code = '',
                bar = ~~((lines[1] + lines[2] + lines[3]) / 3),
                u = UPC_SET;
            for (var i = 1, l = lines.length; i < l; i++) {
                if (code.length < 6) { var group = lines.slice(i * 4, (i * 4) + 4); }
                else { var group = lines.slice((i * 4) + 5, (i * 4) + 9); }
                var digits = [
                    round(group[0] / bar),
                    round(group[1] / bar),
                    round(group[2] / bar),
                    round(group[3] / bar)
                ];
                code += u[digits.join('')] || u[digits.reverse().join('')] || 'X';
                if (12 == code.length) { return code; break; }
            }
            if (-1 == code.indexOf('X')) { return code || false; }
        }
        return false;
    }

    var result = getBarcodeFromImage('barcodeImage1');
    //displayAlertDialog('result: ' + result);
    return result;
};



function renderNewSupplementalBudgetRequestForm(budgetRequestId, functionalAreaId, pmAccountId, brTitle) {
    // Generate and store the GUID on the page. This is necessary so that the attachments section works ok (among other things).
    var supplementalRequestId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });

    // We must clear any old form data so that there is no confusion (duplicate elements specifically BudgetRequestId). Todd: This is a best practice, implement throughout.
    document.getElementById('myxml').innerHTML = '';

    var html = '';
    html += '<table style="BORDER-TOP-STYLE: none; WORD-WRAP: break-word; BORDER-LEFT-STYLE: none; BORDER-COLLAPSE: collapse; TABLE-LAYOUT: fixed; BORDER-BOTTOM-STYLE: none; BORDER-RIGHT-STYLE: none; WIDTH: 654px" class="xdFormLayout">';
    html += '  <colgroup>';
    html += '    <col style="WIDTH: 654px" />';
    html += '  </colgroup>';
    html += '  <tbody>';
    html += '    <tr class="xdTableContentRow">';
    html += '      <td style="BORDER-TOP: #d8d8d8 1pt solid; BORDER-RIGHT: #d8d8d8 1pt solid; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 0px; PADDING-TOP: 0px; PADDING-LEFT: 0px; BORDER-LEFT: #d8d8d8 1pt solid; PADDING-RIGHT: 0px" class="xdTableContentCell">';
    html += '        <div />';
    html += '        <!--<img src="../Lists/LogoImage/CompanyLogo.png" style="HEIGHT: 96px; WIDTH: 96px" />-->';
    html += '        <table>';
    html += '        <!--<tr><td>&nbsp;</td></tr>-->';
    html += '          <tr><td>&nbsp;</td></tr>';
    html += '          <tr>';
    html += '            <td width="5px"></td>';
    html += '            <td><!--<img src="../Lists/LogoImage/CompanyLogo.png" style="HEIGHT: 96px; WIDTH: 96px" />--></td>';
    html += '            <td><span id="spanNewRequestFormTitle"><br /><span style="font-size:200%;">&nbsp;&nbsp;&nbsp;Supplemental <strong>Budget Request</strong></span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-style:italic;font-size:150%;">for ' + brTitle + '<br /><br /></span></span></td>';
    html += '          </tr>';
    html += '        </table>';
    html += '        <div align="right">';
    html += '        <span class="xdlabel">';
    html += '          <em />';
    html += '        </span>';
    html += '        </div>';
    html += '        <div align="right">';
    html += '          <span class="xdlabel">';
    html += '            <em>';
    html += '            <font style="FONT-SIZE: 11pt">';
    html += '            <!--<a xd:disableEditing="yes" href="http://sp2010/budget/_layouts/help.aspx?Lcid=1033&amp;amp;Key=HelpHome&amp;amp;ShowNav=true">';
    html += '              <img setWidth="24" setHeight="22" src="30837E49.png" alt="SharePoint-Help-Question-Mark.png" style="BORDER-TOP: #000080 1.5pt; HEIGHT: 22px; BORDER-RIGHT: #000080 1.5pt; BORDER-BOTTOM: #000080 1.5pt; BORDER-LEFT: #000080 1.5pt; WIDTH: 24px" class="ms-rtePosition-4" />';
    html += '            </a>-->';
    html += '            xComplete the form then click the "Submit" button.';
    html += '            </font>';
    html += '            </em>';
    html += '          </span>';
    html += '        </div>';
    html += '        <div align="right">';
    html += '          <span class="xdlabel" id="spanNewBudgetRequestPageButtons">';
    html += '            <!-- <input tabindex="0" xd:xctname="Button" xd:ctrlid="CTRL81" value="Submit" type="button" style="margin: 1px" class="langFont" title="Click here to Submit the request, or click the Help icon in the top right corner of this screen..." /> -->';
    html += '            <!--<input type="button" name="startWorkflowButton" value="Submitxcx1" onclick="cmdCreateBudgetRequestAndStartWorkflow();" title="Click here to Submit the request." style="MARGIN: 1px; WIDTH: 200px;font-size: 20pt;cursor:pointer;" />-->';
    //html += '            <button name="startWorkflowButton" id="startWorkflowButton" onclick="cmdCreateBudgetRequestAndStartWorkflow();" class="BwButton200" title="Click here to Submit the request.">Submit</button>';

    html += '            <button id="startWorkflowButton" onclick="cmdCreateSupplementalBudgetRequestAndStartWorkflow(\'' + budgetRequestId + '\', \'' + supplementalRequestId + '\', \'' + functionalAreaId + '\', \'' + pmAccountId + '\');" class="BwButton200" title="Click here to Submit the supplemental request.">Submit</button>';
    html += '            &nbsp;';
    html += '            <!--<input type="button" value="Cancel" onclick="populateStartPageItem(\'divWelcome\', \'Reports\', \'\');" style="MARGIN: 1px; WIDTH: 200px;font-size: 20pt;cursor:pointer;" />-->';
    html += '            <button onclick="populateStartPageItem(\'divWelcome\', \'Reports\', \'\');" class="BwButton200">Cancel</button>';
    html += '            &nbsp;';
    html += '          </span>';
    html += '        </div>';
    html += '        <div align="right">';
    html += '          &nbsp;';
    html += '        </div>';
    html += '        <div align="center">';
    html += '          <span class="xdlabel" />';
    html += '          <span style="BORDER-TOP: #dcdcdc 1pt; BORDER-RIGHT: #dcdcdc 1pt; WHITE-SPACE: nowrap; BORDER-BOTTOM: #dcdcdc 1pt; COLOR: #ff0000; TEXT-ALIGN: right; BORDER-LEFT: #dcdcdc 1pt; WIDTH: 100%" tabindex="-1" xd:binding="my:GlobalError" xd:xctname="PlainText" xd:ctrlid="CTRL115" xd:disableediting="yes" hidefocus="1" class="xdTextBox" title="" />';
    html += '        </div>';
    html += '        <div align="center">';
    html += '          <span class="xdlabel" />';
    html += '        </div>';
    html += '    <div align="center">';
    html += '        <table class="xdFormLayout" style="BORDER-TOP-STYLE: none; WORD-WRAP: break-word; BORDER-LEFT-STYLE: none; BORDER-COLLAPSE: collapse; TABLE-LAYOUT: fixed; BORDER-BOTTOM-STYLE: none; BORDER-RIGHT-STYLE: none; WIDTH: 652px">';
    html += '            <!-- original was  WIDTH: 652px had changed to 98% for some reason...-->';
    html += '            <colgroup>';
    html += '                <col style="WIDTH: 98%" /> <!-- was style="WIDTH: 652px"-->';
    html += '            </colgroup>';
    html += '            <tbody>';
    html += '                <tr style="MIN-HEIGHT: 4px" class="xdTableContentRow">';
    html += '                    <td valign="top" style="BORDER-TOP: #d8d8d8 1pt solid; BORDER-BOTTOM: #d8d8d8 1pt" class="xdTableContentCell">';
    html += '                        <div>';
    html += '                            <table class="xdFormLayout xdTableStyleTwoCol" style="BORDER-TOP-STYLE: none; WORD-WRAP: break-word; BORDER-LEFT-STYLE: none; BORDER-COLLAPSE: collapse; TABLE-LAYOUT: fixed; BORDER-BOTTOM-STYLE: none; BORDER-RIGHT-STYLE: none; WIDTH: 649px">';
    html += '                                <colgroup>';
    html += '                                    <col style="WIDTH: 169px" />';
    html += '                                    <col style="WIDTH: 480px" />';
    html += '                                </colgroup>';
    html += '                                <tbody valign="top">';
    html += '                                    <tr class="xdTableOffsetRow">';
    html += '                                        <td class="xdTableOffsetCellLabel" style="text-align:left; BORDER-TOP: #d8d8d8 1pt; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
    html += '                                            <font color="#000000">';
    html += '                                                <span class="xdlabel" />';
    html += '                                                <span class="xdlabel">Description:</span>&nbsp;<span style="color:red;font-size:medium;">*</span>';
    html += '                                            </font>';
    html += '                                        </td>';
    html += '                                        <td style="BORDER-TOP: #d8d8d8 1pt; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px" class="xdTableOffsetCellComponent">';
    html += '                                            <div>';
    html += '                                                <input type="text" id="strProjectTitle" style="WIDTH: 70%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" /> <!-- was 2.77em -->';
    html += '                                                <!--<textarea id="strProjectTitle" rows="1" style="WIDTH: 97%; HEIGHT: 18px;"></textarea>-->';
    html += '                                           </div>';
    html += '                                       </td>';
    html += '                                    </tr>';
    //html += '                                    <!--<tr class="xdTableOffsetRow">';
    //html += '                                        <td style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px" class="xdTableOffsetCellLabel">';
    //html += '                                            <span class="xdlabel">';
    //html += '                                                <font color="#000000">Category:</font>';
    //html += '                                            </span>';
    //html += '                                        </td>';
    //html += '                                        <td style="VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px" class="xdTableOffsetCellComponent">';
    //html += '                                            <div>';
    //html += '                                                <select id="ddlCategory" name="ddlCategory" tabindex="0" size="1" style="WIDTH: 100%" class="xdComboBox xdBehavior_Select" />';
    //html += '                                            </div>';
    //html += '                                        </td>';
    //html += '                                    </tr>-->';
    html += '                                    <tr class="xdTableOffsetRow">';
    html += '                                        <td style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px" class="xdTableOffsetCellLabel">';
    html += '                                            <span id="spanNewRequestDetailsLabel"><span class="xdlabel">Justification details:</span></span>';
    html += '                                        </td>';
    html += '                                        <td style="VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px" class="xdTableOffsetCellComponent">';
    html += '                                            <div>';
    html += '                                                <textarea id="strBriefDescriptionOfProject" rows="3" style="WIDTH: 97%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;"></textarea>';
    html += '                                                <!--<span style="WORD-WRAP: break-word; HEIGHT: 60px; WHITE-SPACE: normal; TEXT-ALIGN: left; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 451px" tabindex="0" xd:datafmt="" xd:binding="my:Brief_Description_of_Project" xd:xctname="PlainText" xd:ctrlid="CTRL83" contenteditable="true" hidefocus="1" class="xdTextBox xdBehavior_Formatting" title="" />-->';
    html += '                                            </div>';
    html += '                                        </td>';
    html += '                                    </tr>';
    html += '                                    <tr class="xdTableOffsetRow">';
    html += '                                        <td style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px" class="xdTableOffsetCellLabel">';
    html += '                                            <span class="xdlabel">';
    html += '                                                <span class="xdlabel">';
    html += '                                                    <font color="#000000">Requested Amount:</font>&nbsp;<span style="color:red;font-size:medium;">*</span>';
    html += '                                                </span>';
    html += '                                            </span>';
    html += '                                        </td>';
    html += '                                        <td style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px" class="xdTableOffsetCellComponent">';
    html += '                                            <div>';
    html += '                                                <input type="text" id="dblRequestedCapital" onblur="formatRequestedCapital_InitBudgetRequest();" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: right;" />';
    html += '                                            </div>';
    html += '                                        </td>';
    html += '                                    </tr>';
    //html += '                                    <!--<tr class="xdTableOffsetRow">';
    //html += '                                        <td style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px" class="xdTableOffsetCellLabel">';
    //html += '                                            <span class="xdlabel">Requested Expense:</span>';
    //html += '                                        </td>';
    //html += '                                        <td style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px" class="xdTableOffsetCellComponent">';
    //html += '                                            <div>';
    //html += '                                                <input type="text" id="dblRequestedExpense" onblur="formatRequestedExpense_InitBudgetRequest();" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 40pt;TEXT-ALIGN: right;" />';
    //html += '                                            </div>';
    //html += '                                        </td>';
    //html += '                                    </tr>-->';





    //html += '                                    <tr class="xdTableOffsetRow">';
    //html += '                                        <td style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px" class="xdTableOffsetCellLabel">';
    //html += '                                            <span id="spanRequestForm_ManagerTitle" class="xdlabel"></span><span class="xdlabel">:</span>&nbsp;<span style="color:red;font-size:medium;">*</span>';
    //html += '                                        </td>';
    //html += '                                        <td style="white-space:nowrap;text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;" class="xdTableOffsetCellComponent">';
    //html += '                                            <!--<div id="peoplePicker"></div>-->';
    //html += '                                            <input id="txtProjectManagerName" title="Type the first name. This is the person who does the initial approval." style="WIDTH: 85%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: left;" /><input id="txtProjectManagerId" style="display:none;" /><input id="txtProjectManagerEmail" style="display:none;" />';
    //html += '                                            <!--👥-->';
    //html += '                                            <img src="images/addressbook-icon35x35.png" style="width:35px;height:35px;vertical-align:text-bottom;cursor:pointer;" onclick="cmdDisplayPeoplePickerDialog(\'txtProjectManagerName\', \'txtProjectManagerId\', \'txtProjectManagerEmail\');" />';
    //html += '                                            <!--<span style="font-size:x-small;vertical-align:bottom;padding-left:10px;color:gray;"></span>-->';
    //html += '                                        </td>';
    //html += '                                    </tr>';
    //html += '                                    <tr class="xdTableOffsetRow">';
    //html += '                                        <td style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px" class="xdTableOffsetCellLabel">';
    //html += '                                            <span class="xdlabel">';
    //html += '                                                <span class="xdlabel">Year:</span>';
    //html += '                                            </span>';
    //html += '                                        </td>';
    //html += '                                        <td style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px" class="xdTableOffsetCellComponent">';
    //html += '                                            <div>';
    //html += '                                                <select id="ddlYear" onchange="cmdDdlYearSelectionChanged();" tabindex="0" xd:postbackmodel="always" xd:boundprop="value" xd:binding="my:Year" xd:xctname="dropdown" xd:ctrlid="CTRL104" size="1" class="xdComboBox xdBehavior_Select" style="WIDTH: 50%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: right;"></select>';
    //html += '                                            </div>';
    //html += '                                        </td>';
    //html += '                                    </tr>';
    //html += '                                    <tr class="xdTableOffsetRow">';
    //html += '                                        <td style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px" class="xdTableOffsetCellLabel">';
    //html += '                                            <div>';
    //html += '                                                <span class="xdlabel">';
    //html += '                                                    <span class="xdlabel">Financial Area:</span>';
    //html += '                                                </span>';
    //html += '                                            </div>';
    //html += '                                        </td>';
    //html += '                                        <td style="VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px" class="xdTableOffsetCellComponent">';
    //html += '                                            <div>';
    //html += '                                                <select id="ddlFunctionalArea" name="ddlFunctionalArea" tabindex="0" value="" size="1" style="WIDTH: 97%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" class="xdComboBox xdBehavior_Select" title="" />';
    //html += '                                            </div>';
    //html += '                                        </td>';
    //html += '                                    </tr>';
    //html += '                                    <tr class="xdTableOffsetRow">';
    //html += '                                        <td style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px" class="xdTableOffsetCellLabel">';
    //html += '                                            <span id="spanNewRequestStartDateLabel" style="white-space:nowrap;"><span class="xdlabel" style="white-space:nowrap;">Estimated Start Date:</span></span>';
    //html += '                                        </td>';
    //html += '                                        <td style="VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px" class="xdTableOffsetCellComponent">';
    //html += '                                            <!--<SharePoint:DateTimeControl id="dtiEstimatedStartDate" DatePickerFrameUrl="../_layouts/15/iframe.aspx" LocaleId="1033" DateOnly="true" runat="server" />-->';
    //html += '                                           <input type="text" id="dtEstimatedStartDate" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: left;">';
    //html += '                                        </td>';
    //html += '                                    </tr>';
    //html += '                                    <tr class="xdTableOffsetRow">';
    //html += '                                        <td style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px" class="xdTableOffsetCellLabel">';
    //html += '                                                <span id="spanNewRequestEndDateLabel" style="white-space:nowrap;"><span class="xdlabel" style="white-space:nowrap;">Estimated End Date:</span></span>';
    //html += '                                        </td>';
    //html += '                                       <td style="VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px" class="xdTableOffsetCellComponent">';
    //html += '                                            <!--<SharePoint:DateTimeControl id="dtiEstimatedEndDate" DatePickerFrameUrl="../_layouts/15/iframe.aspx" LocaleId="1033" DateOnly="true" runat="server" />-->';
    //html += '                                            <input type="text" id="dtEstimatedEndDate" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: left;">';
    //html += '                                        </td>';
    //html += '                                    </tr>';

    if (enableNewRequestAttachments == true) {
        html += '                                    <tr id="trNewRequestAttachmentsSection" class="xdTableOffsetRow">';
        html += '                                        <td class="xdTableOffsetCellLabel" valign="top" style="text-align:left; BORDER-BOTTOM: #d8d8d8 1pt; BORDER-LEFT: #d8d8d8 1pt; BACKGROUND-COLOR: #ffffff">';
        html += '                                            <span class="xdlabel">Attachments:</span>';
        html += '                                        </td>';
        html += '                                        <td style="VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px" class="xdTableOffsetCellComponent">';
        html += '                                            <div>';
        html += '                                                <div xd:widgetindex="0" tabindex="-1" xd:xctname="RepeatingSection" xd:ctrlid="CTRL90" align="left" style="MARGIN-BOTTOM: 0px; WIDTH: 100%" class="xdRepeatingSection xdRepeating" title="">';
        html += '                                                    <div>';
        html += '                                                        <!--<span tabindex="0" tabstop="true" xd:boundprop="xd:inline" xd:binding="my:CapexAttachment" xd:xctname="FileAttachment" xd:ctrlid="CTRL91" style="HEIGHT: 30px; WIDTH: 161px" hidefocus="1" class="xdFileAttachment" />-->';
        html += '                                                        <input id="inputFile" type="file" onchange="uploadAttachment(\'attachments\');" style="width: 75%;" />';
        html += '                                                    </div>';
        html += '                                                </div>';
        html += '                                                <p id="newrequestattachments"></p>';
        html += '                                            </div>';
        html += '                                        </td>';
        html += '                                    </tr>';
    }

    html += '<span id="BudgetRequestId" style="display: none; visibility: hidden;" xd:binding="my:BudgetRequestId"></span>'; // This is where we store the guid which is generated prior to this form being displayed. 

    html += '<tr>';
    html += '  <td>';
    html += '&nbsp;';
    html += '';
    html += '';
    html += '';
    html += '';
    html += '  </td>';
    html += '</tr>';


    html += '                                </tbody>';
    html += '                            </table>';
    html += '                        </div>';
    html += '                    </td>';
    html += '                </tr>';
    html += '            </tbody>';
    html += '        </table>';
    html += '   </div>';
    html += '</td>';
    html += '</tr>';
    html += '</tbody>';
    html += '</table>';


    document.getElementById('budgetrequestform').innerHTML = html;

    // Generate and store the GUID on the page. This is necessary so that the attachments section works ok (among other things).
    //var supplementalRequestId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    //    return v.toString(16);
    //});
    document.getElementById('BudgetRequestId').innerHTML = supplementalRequestId;

    displayAlertDialog('my.js.renderNewSupplementalBudgetRequestForm. supplementalRequestId: ' + supplementalRequestId);

    //populateFunctionalAreas();

    // Populate the year drop-down

    // ALTER THE NEW REQUEST FORM ACCORDING TO THE CONFIGURATION SETTINGS.

    // This is a supplemental request for budget request _reference, which is a guid.
    //var html = '';
    //html += '<br /><span style="font-size:200%;">&nbsp;&nbsp;&nbsp;Supplemental <strong>Budget Request</strong><br /><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-style:italic;">for ' + _reference + ' (xxxx)</span></span></span>';
    //document.getElementById('spanNewRequestFormTitle').innerHTML = html;
    //var html = '';
    //html += '';
    //html += '<button id="startWorkflowButton" onclick="cmdCreateSupplementalBudgetRequestAndStartWorkflow(\'' + _reference + '\');" class="BwButton200" title="Click here to Submit the supplemental request.">Submit</button>';
    //html += '&nbsp;<button onclick="populateStartPageItem(\'divWelcome\', \'\', \'\');" class="BwButton200">Cancel</button>';
    //html += '&nbsp;';
    //document.getElementById('spanNewBudgetRequestPageButtons').innerHTML = html;


    // Set the manager title.
    //$('#spanRequestForm_ManagerTitle').html(newBudgetRequestManagerTitle);
    // Set if the details are required.
    if (requireRequestDetails == true) {
        document.getElementById('spanNewRequestDetailsLabel').innerHTML = '<span class="xdlabel">Justification details:</span>&nbsp;<span style="color:red;font-size:medium;">*</span>';
    } else {
        document.getElementById('spanNewRequestDetailsLabel').innerHTML = '<span class="xdlabel">Justification details:</span>';
    }
    //// Set if the dates are required.
    //if (requireStartEndDates == true) {
    //    document.getElementById('spanNewRequestStartDateLabel').innerHTML = '<span class="xdlabel" style="white-space:nowrap;">Estimated Start Date:&nbsp;</span><span style="color:red;font-size:medium;">*</span>';
    //    document.getElementById('spanNewRequestEndDateLabel').innerHTML = '<span class="xdlabel" style="white-space:nowrap;">Estimated End Date:&nbsp;</span><span style="color:red;font-size:medium;">*</span>';
    //} else {
    //    document.getElementById('spanNewRequestStartDateLabel').innerHTML = '<span class="xdlabel">Estimated Start Date:</span>';
    //    document.getElementById('spanNewRequestEndDateLabel').innerHTML = '<span class="xdlabel">Estimated End Date:</span>';
    //}
    //// Set if the attachments are allowed.
    //if (enableNewRequestAttachments == true) {
    //    $('#trNewRequestAttachmentsSection').show();
    //    //document.getElementById('trNewRequestAttachmentsSection').innerHTML = '<span class="xdlabel">Attachments:</span>&nbsp;<span style="color:red;font-size:medium;">*</span>';
    //} else {
    //    $('#trNewRequestAttachmentsSection').hide();
    //    //document.getElementById('trNewRequestAttachmentsSection').innerHTML = '<span class="xdlabel">Attachments:</span>';
    //}
    // Now we can hook up the Participant text box for autocomplete.
    //$("#txtProjectManagerName").autocomplete({
    //    source: function (request, response) {
    //        //weburl = _spPageContextInfo.siteAbsoluteUrl;
    //        $.ajax({
    //            url: appweburl + "/workflow/" + workflowAppId + "/participants/" + request.term,
    //            dataType: "json",
    //            success: function (data) {
    //                var searchArray = [];
    //                for (var i = 0; i < data.participants.length; i++) {
    //                    searchArray[i] = data.participants[i].participant;
    //                }
    //                response(searchArray);
    //            }
    //        });
    //    },
    //    minLength: 1, // minLength specifies how many characters have to be typed before this gets invoked.
    //    select: function (event, ui) {
    //        //log(ui.item ? "Selected: " + ui.item.label : "Nothing selected, input was " + this.value);
    //        //document.getElementById('btnSearch').disabled = false; // Enable the search button when there is valid content in it.
    //    },
    //    open: function () {
    //        //$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
    //        //document.getElementById('btnSearch').disabled = true; // Disable the search button until there is valid content in it.
    //    },
    //    close: function () {
    //        //$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
    //        var projectManagerName = this.value.split('|')[0];
    //        var projectManagerId = this.value.split('|')[1];

    //        if (projectManagerName.indexOf('undefined') > -1) {
    //            document.getElementById('txtProjectManagerName').value = '';
    //            document.getElementById('txtProjectManagerId').value = '';
    //        } else {
    //            document.getElementById('txtProjectManagerName').value = projectManagerName; //this.value.split(' ')[0] + ' ' + this.value.split(' ')[1]; // Just shows the Loan Number parameter (removing the borrower name) so it fits in the text box.
    //            document.getElementById('txtProjectManagerId').value = projectManagerId;
    //        }
    //    }
    //});


}

function enableFinancialAreasButton() {

}

function enableDepartmentsButton() {

}

function enableParticipantsButton() {

}

function disableFinancialAreasButton() {
    document.getElementById('divBehaviorButton').className = 'divInnerLeftButton';
    //document.getElementById('divFunctionalAreasButton').className = 'divInnerLeftButtonSelected';
    //document.getElementById('divDepartmentsButton').className = 'divInnerLeftButton';
    document.getElementById('divParticipantsButton').className = 'divInnerLeftButton';
    document.getElementById('divWorkflowSettingsButton').className = 'divInnerLeftButton';
    document.getElementById('divWorkflowEditorSettingsButton').className = 'divInnerLeftButton';
    document.getElementById('divChecklistsSettingsButton').className = 'divInnerLeftButton';
    document.getElementById('divFormsSettingsButton').className = 'divInnerLeftButton';
    document.getElementById('divOrgRolesButton').className = 'divInnerLeftButton';

    document.getElementById('divMonitoringToolsButton').className = 'divInnerLeftButton';
    //$('#divFunctionalAreasButton').css({
    //    'cursor': 'default', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'rgb(59, 103, 142) dashed 1px', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': '#dcdcdc', 'background-color': 'white'
    //});
    //$('#divDepartmentsButton').css({
    //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
    //});
    //$('#divParticipantsButton').css({
    //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
    //});
    //$('#divBehaviorButton').css({
    //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
    //});

    //$('#divWorkflowSettingsButton').css({
    //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
    //});
}

function disableLocationsButton() {
    document.getElementById('divBehaviorButton').className = 'divInnerLeftButton';
    //document.getElementById('divFunctionalAreasButton').className = 'divInnerLeftButton';
    document.getElementById('divLocationsButton').className = 'divInnerLeftButtonSelected';
    //document.getElementById('divDepartmentsButton').className = 'divInnerLeftButton';
    document.getElementById('divParticipantsButton').className = 'divInnerLeftButton';
    document.getElementById('divWorkflowSettingsButton').className = 'divInnerLeftButton';
    document.getElementById('divWorkflowEditorSettingsButton').className = 'divInnerLeftButton';
    document.getElementById('divChecklistsSettingsButton').className = 'divInnerLeftButton';
    document.getElementById('divFormsSettingsButton').className = 'divInnerLeftButton';
    document.getElementById('divOrgRolesButton').className = 'divInnerLeftButton';

    document.getElementById('divMonitoringToolsButton').className = 'divInnerLeftButton';
    //$('#divFunctionalAreasButton').css({
    //    'cursor': 'default', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'rgb(59, 103, 142) dashed 1px', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': '#dcdcdc', 'background-color': 'white'
    //});
    //$('#divDepartmentsButton').css({
    //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
    //});
    //$('#divParticipantsButton').css({
    //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
    //});
    //$('#divBehaviorButton').css({
    //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
    //});

    //$('#divWorkflowSettingsButton').css({
    //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
    //});
}

//function disableDepartmentsButton() {
//    document.getElementById('divBehaviorButton').className = 'divInnerLeftButton';
//    document.getElementById('divFunctionalAreasButton').className = 'divInnerLeftButton';
//    //document.getElementById('divDepartmentsButton').className = 'divInnerLeftButtonSelected';
//    document.getElementById('divParticipantsButton').className = 'divInnerLeftButton';
//    document.getElementById('divWorkflowSettingsButton').className = 'divInnerLeftButton';

//    //$('#divDepartmentsButton').css({
//    //    'cursor': 'default', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'rgb(59, 103, 142) dashed 1px', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': '#dcdcdc', 'background-color': 'white'
//    //});
//    //$('#divParticipantsButton').css({
//    //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
//    //});
//    //$('#divFunctionalAreasButton').css({
//    //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
//    //});
//    //$('#divBehaviorButton').css({
//    //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
//    //});
//    //$('#divWorkflowSettingsButton').css({
//    //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
//    //});
//}

function disableParticipantsButton() {
    document.getElementById('divBehaviorButton').className = 'divInnerLeftButton';
    //document.getElementById('divFunctionalAreasButton').className = 'divInnerLeftButton';
    //document.getElementById('divDepartmentsButton').className = 'divInnerLeftButton';
    document.getElementById('divParticipantsButton').className = 'divInnerLeftButtonSelected';
    document.getElementById('divWorkflowSettingsButton').className = 'divInnerLeftButton';
    document.getElementById('divWorkflowEditorSettingsButton').className = 'divInnerLeftButton';
    document.getElementById('divChecklistsSettingsButton').className = 'divInnerLeftButton';
    document.getElementById('divFormsSettingsButton').className = 'divInnerLeftButton';
    document.getElementById('divOrgRolesButton').className = 'divInnerLeftButton';

    document.getElementById('divMonitoringToolsButton').className = 'divInnerLeftButton';
    //$('#divParticipantsButton').css({
    //    'cursor': 'default', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'rgb(59, 103, 142) dashed 1px', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': '#dcdcdc', 'background-color': 'white'
    //});
    //$('#divDepartmentsButton').css({
    //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
    //});
    //$('#divFunctionalAreasButton').css({
    //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
    //});
    //$('#divBehaviorButton').css({
    //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
    //});
    //$('#divWorkflowSettingsButton').css({
    //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
    //});
}

//function disableWorkflowsButton() {
//    $('#divWorkflowsButton').css({ 'cursor': 'default', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'rgb(59, 103, 142) dashed 1px', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': '#dcdcdc', 'background-color': 'white' });
//    $('#divFunctionalAreasButton').css({ 'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5' });
//    $('#divDepartmentsButton').css({ 'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5' });
//    $('#divParticipantsButton').css({ 'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5' });
//    $('#divBehaviorButton').css({ 'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5' });
//}

function disableBehaviorButton() {
    document.getElementById('divBehaviorButton').className = 'divInnerLeftButtonSelected';
    //document.getElementById('divFunctionalAreasButton').className = 'divInnerLeftButton';
    //document.getElementById('divDepartmentsButton').className = 'divInnerLeftButton';
    document.getElementById('divParticipantsButton').className = 'divInnerLeftButton';
    document.getElementById('divWorkflowSettingsButton').className = 'divInnerLeftButton';
    document.getElementById('divWorkflowEditorSettingsButton').className = 'divInnerLeftButton';
    document.getElementById('divChecklistsSettingsButton').className = 'divInnerLeftButton';
    document.getElementById('divFormsSettingsButton').className = 'divInnerLeftButton';
    document.getElementById('divOrgRolesButton').className = 'divInnerLeftButton';

    document.getElementById('divMonitoringToolsButton').className = 'divInnerLeftButton';
    //$('#divBehaviorButton').css({
    //    'cursor': 'default', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'rgb(59, 103, 142) dashed 1px', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': '#dcdcdc', 'background-color': 'white'
    //});
    //$('#divFunctionalAreasButton').css({
    //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
    //});
    //$('#divDepartmentsButton').css({
    //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
    //});
    //$('#divParticipantsButton').css({
    //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
    //});
    //$('#divWorkflowSettingsButton').css({
    //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
    //});
}

function disableWorkflowSettingsButton() {
    document.getElementById('divBehaviorButton').className = 'divInnerLeftButton';
    //document.getElementById('divFunctionalAreasButton').className = 'divInnerLeftButton';
    //document.getElementById('divDepartmentsButton').className = 'divInnerLeftButton';
    document.getElementById('divParticipantsButton').className = 'divInnerLeftButton';
    document.getElementById('divWorkflowSettingsButton').className = 'divInnerLeftButtonSelected';
    document.getElementById('divWorkflowEditorSettingsButton').className = 'divInnerLeftButton';
    document.getElementById('divChecklistsSettingsButton').className = 'divInnerLeftButton';
    document.getElementById('divFormsSettingsButton').className = 'divInnerLeftButton';
    document.getElementById('divOrgRolesButton').className = 'divInnerLeftButton';

    document.getElementById('divMonitoringToolsButton').className = 'divInnerLeftButton';
    //$('#divWorkflowSettingsButton').css({
    //    'cursor': 'default', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'rgb(59, 103, 142) dashed 1px', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': '#dcdcdc', 'background-color': 'white'
    //});
    //$('#divFunctionalAreasButton').css({
    //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
    //});
    //$('#divDepartmentsButton').css({
    //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
    //});
    //$('#divParticipantsButton').css({
    //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
    //});
    //$('#divBehaviorButton').css({
    //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
    //}); 
}

function disableRaciSettingsButton() {
    document.getElementById('divBehaviorButton').className = 'divInnerLeftButton';
    //document.getElementById('divFunctionalAreasButton').className = 'divInnerLeftButton';
    //document.getElementById('divDepartmentsButton').className = 'divInnerLeftButton';
    document.getElementById('divParticipantsButton').className = 'divInnerLeftButton';
    document.getElementById('divWorkflowSettingsButton').className = 'divInnerLeftButton';
    document.getElementById('divWorkflowEditorSettingsButton').className = 'divInnerLeftButtonSelected';
    document.getElementById('divChecklistsSettingsButton').className = 'divInnerLeftButton';
    document.getElementById('divFormsSettingsButton').className = 'divInnerLeftButton';
    document.getElementById('divOrgRolesButton').className = 'divInnerLeftButton';

    document.getElementById('divMonitoringToolsButton').className = 'divInnerLeftButton';
    //$('#divWorkflowSettingsButton').css({
    //    'cursor': 'default', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'rgb(59, 103, 142) dashed 1px', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': '#dcdcdc', 'background-color': 'white'
    //});
    //$('#divFunctionalAreasButton').css({
    //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
    //});
    //$('#divDepartmentsButton').css({
    //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
    //});
    //$('#divParticipantsButton').css({
    //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
    //});
    //$('#divBehaviorButton').css({
    //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
    //}); 
}

function disableOrgRoleSettingsButton() {
    try {
        console.log('In my3.js.disableOrgRoleSettingsButton().');

        if (document.getElementById('divBehaviorButton') && document.getElementById('divBehaviorButton').className) {
            document.getElementById('divBehaviorButton').className = 'divInnerLeftButton';
        }
        //document.getElementById('divFunctionalAreasButton').className = 'divInnerLeftButton';
        //document.getElementById('divDepartmentsButton').className = 'divInnerLeftButton';
        if (document.getElementById('divParticipantsButton') && document.getElementById('divParticipantsButton').className) {
            document.getElementById('divParticipantsButton').className = 'divInnerLeftButton';
        }
        if (document.getElementById('divWorkflowSettingsButton') && document.getElementById('divWorkflowSettingsButton').className) {
            document.getElementById('divWorkflowSettingsButton').className = 'divInnerLeftButton';
        }
        if (document.getElementById('divWorkflowEditorSettingsButton') && document.getElementById('divWorkflowEditorSettingsButton').className) {
            document.getElementById('divWorkflowEditorSettingsButton').className = 'divInnerLeftButton';
        }
        if (document.getElementById('divChecklistsSettingsButton') && document.getElementById('divChecklistsSettingsButton').className) {
            document.getElementById('divChecklistsSettingsButton').className = 'divInnerLeftButton'; //
        }
        if (document.getElementById('divFormsSettingsButton') && document.getElementById('divFormsSettingsButton').className) {
            document.getElementById('divFormsSettingsButton').className = 'divInnerLeftButton';
        }
        if (document.getElementById('divOrgRolesButton') && document.getElementById('divOrgRolesButton').className) {
            document.getElementById('divOrgRolesButton').className = 'divInnerLeftButtonSelected';
        }
        if (document.getElementById('divMonitoringToolsButton') && document.getElementById('divMonitoringToolsButton').className) {
            document.getElementById('divMonitoringToolsButton').className = 'divInnerLeftButton';
        }
        //$('#divWorkflowSettingsButton').css({
        //    'cursor': 'default', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'rgb(59, 103, 142) dashed 1px', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': '#dcdcdc', 'background-color': 'white'
        //});
        //$('#divFunctionalAreasButton').css({
        //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
        //});
        //$('#divDepartmentsButton').css({
        //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
        //});
        //$('#divParticipantsButton').css({
        //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
        //});
        //$('#divBehaviorButton').css({
        //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
        //}); 
    } catch (e) {
        console.log('Exception in disableOrgRoleSettingsButton(): ' + e.message + ', ' + e.stack);
        displayAlertDialog('Exception in disableOrgRoleSettingsButton(): ' + e.message + ', ' + e.stack);
    }
}

function disableMonitoringButton() {
    document.getElementById('divBehaviorButton').className = 'divInnerLeftButton';
    //document.getElementById('divFunctionalAreasButton').className = 'divInnerLeftButton';
    //document.getElementById('divDepartmentsButton').className = 'divInnerLeftButton';
    document.getElementById('divParticipantsButton').className = 'divInnerLeftButton';
    document.getElementById('divWorkflowSettingsButton').className = 'divInnerLeftButton';
    document.getElementById('divWorkflowEditorSettingsButton').className = 'divInnerLeftButton';
    document.getElementById('divChecklistsSettingsButton').className = 'divInnerLeftButton'; //
    document.getElementById('divFormsSettingsButton').className = 'divInnerLeftButton';
    document.getElementById('divOrgRolesButton').className = 'divInnerLeftButton';

    document.getElementById('divMonitoringToolsButton').className = 'divInnerLeftButtonSelected';

    //$('#divWorkflowSettingsButton').css({
    //    'cursor': 'default', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'rgb(59, 103, 142) dashed 1px', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': '#dcdcdc', 'background-color': 'white'
    //});
    //$('#divFunctionalAreasButton').css({
    //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
    //});
    //$('#divDepartmentsButton').css({
    //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
    //});
    //$('#divParticipantsButton').css({
    //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
    //});
    //$('#divBehaviorButton').css({
    //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
    //}); 
}

function disableInventoryButton() {
    document.getElementById('divBehaviorButton').className = 'divInnerLeftButton';
    //document.getElementById('divFunctionalAreasButton').className = 'divInnerLeftButton';
    //document.getElementById('divDepartmentsButton').className = 'divInnerLeftButton';
    document.getElementById('divParticipantsButton').className = 'divInnerLeftButton';
    document.getElementById('divWorkflowSettingsButton').className = 'divInnerLeftButton';
    document.getElementById('divWorkflowEditorSettingsButton').className = 'divInnerLeftButton';
    document.getElementById('divChecklistsSettingsButton').className = 'divInnerLeftButton'; //
    document.getElementById('divFormsSettingsButton').className = 'divInnerLeftButton';
    document.getElementById('divOrgRolesButton').className = 'divInnerLeftButton';

    document.getElementById('divMonitoringToolsButton').className = 'divInnerLeftButton';

    document.getElementById('divInventoryButton').className = 'divInnerLeftButtonSelected';

    //$('#divWorkflowSettingsButton').css({
    //    'cursor': 'default', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'rgb(59, 103, 142) dashed 1px', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': '#dcdcdc', 'background-color': 'white'
    //});
    //$('#divFunctionalAreasButton').css({
    //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
    //});
    //$('#divDepartmentsButton').css({
    //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
    //});
    //$('#divParticipantsButton').css({
    //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
    //});
    //$('#divBehaviorButton').css({
    //    'cursor': 'pointer', 'border-width': '0px', 'margin': '0px 0px 0px 20px', 'padding': '12px 0px 0px 20px', 'outline': 'none', 'border-radius': '0px', 'width': '82%', 'height': '28px', 'color': 'white', 'background-color': '#6682b5'
    //}); 
}

function disableChecklistsSettingsButton() {
    document.getElementById('divBehaviorButton').className = 'divInnerLeftButton';
    //document.getElementById('divFunctionalAreasButton').className = 'divInnerLeftButton';
    //document.getElementById('divDepartmentsButton').className = 'divInnerLeftButton';
    document.getElementById('divParticipantsButton').className = 'divInnerLeftButton';
    document.getElementById('divWorkflowSettingsButton').className = 'divInnerLeftButton';
    document.getElementById('divWorkflowEditorSettingsButton').className = 'divInnerLeftButton';
    document.getElementById('divChecklistsSettingsButton').className = 'divInnerLeftButtonSelected';
    document.getElementById('divFormsSettingsButton').className = 'divInnerLeftButton';
    document.getElementById('divOrgRolesButton').className = 'divInnerLeftButton';

    document.getElementById('divMonitoringToolsButton').className = 'divInnerLeftButton';
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

function cmdAddAnApprover() {
    // This is invoked by a user when adding a new functional area.
    // Step 1: First we are going to load an array with the currently displayed values.
    var approvers = [];
    approvers = new Array();
    for (var i = 3; i < 11; i++) {
        var friendlyNameField = $('#txtApprover' + i + 'FriendlyName');
        if (friendlyNameField.val()) {
            // If this field exists, so will the other ones.
            var userId = $('#txtApprover' + i + 'Id').val();
            var userEmail = $('#txtApprover' + i + 'Email').val();
            var userFriendlyName = $('#txtApprover' + i + 'FriendlyName').val();
            var tmpVal = $('span[xd\\:binding="my:Approval' + i + 'BudgetThreshold"]')[0].innerHTML;
            var userBudgetThreshold = parseFloat(tmpVal.replace(/[^0-9-.]/g, ''));
            var userInfo = [];
            userInfo = new Array(4);
            userInfo[0] = userId;
            userInfo[1] = userEmail;
            userInfo[2] = userFriendlyName;
            userInfo[3] = userBudgetThreshold;
            approvers.push(userInfo);
        }
    }
    // Step 2: Now we add the empty one at the end.
    var userInfo = [];
    userInfo = new Array(4);
    userInfo[0] = '';
    userInfo[1] = '';
    userInfo[2] = '';
    userInfo[3] = '';
    approvers.push(userInfo);
    // Step 3: Then we will render the screen using the array!
    var html = '';
    html += '<table>';
    if (approvers.length > 0) {
        html += '<tr>';
        html += '  <td></td>';
        //html += '      <span style="color:cornflowerblue;font-size:x-small;">Approver</span>';
        html += '  <td></td>';
        html += '  <td style="text-align:center;">';
        html += '    <span style="color:cornflowerblue;font-size:x-small;">Budget Threshold</span>';
        html += '  </td>';
        html += '  <td></td>';
        html += '</tr>';
    }
    for (var x = 0; x < approvers.length; x++) {
        //if (approvers[x][0]) { // If there is no entry, stop rendering the Approvers for this financial area.
        html += '<tr>';
        html += '  <td class="bwComTitleCell">Approver #' + (x + 2).toString() + '</td>';
        html += '  <td class="bwChartCalculatorLightCurrencyTableCell" style="white-space:nowrap;">';
        var approverNumber = x + 3;
        html += '    <input style="padding:5px 5px 5px 5px;" id="txtApprover' + approverNumber + 'FriendlyName" title="' + approvers[x][1] + '" value="' + approvers[x][2] + '" />';
        html += '    <img src="images/addressbook-icon18x18.png" style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="cmdDisplayPeoplePickerDialog(\'txtApprover' + approverNumber + 'FriendlyName\', \'txtApprover' + approverNumber + 'Id\', \'txtApprover' + approverNumber + 'Email\');" />';
        html += '    <input id="txtApprover' + approverNumber + 'Id" style="display:none;" value="' + approvers[x][0] + '" />';
        html += '    <input id="txtApprover' + approverNumber + 'Email" style="display:none;" value="' + approvers[x][1] + '" />';
        html += '  </td>';
        html += '  <td class="bwChartCalculatorLightCurrencyTableCell">';
        html += '    <span style="padding:5px 5px 5px 5px;" xd:binding="my:Approval' + approverNumber + 'BudgetThreshold" class="bwCurrencyTextBox" contenteditable="true" tabindex="0">' + formatCurrency(approvers[x][3]) + '</span>';
        html += '  </td>';

        html += '<td><img src="images/trash-can.png" onclick="cmdDeleteApproverFromFinancialArea(\'' + approverNumber + '\');" title="Delete" style="cursor:pointer;" /></td>';

        html += '</tr>';
        //}
    }
    html += '</table>';

    document.getElementById('divFunctionalAreasApproverDataEntryFields').innerHTML = html;





    //// First we check if there is anything in our temporary array.
    //var approverNumber = newFunctionalAreaAdditionalApprovers.length + 3;
    //var newApprover = {
    //    'ApproverNumber': approverNumber.toString(), 'ApproverName': null, 'BudgetThreshold': null
    //};
    //newFunctionalAreaAdditionalApprovers.push(newApprover);
    //var html = '';
    //html += '<table>';







    //html += '  <tr>';
    //html += '    <td class="bwComTitleCell">Approver #' + (approverNumber + 1) + '</td>';
    //html += '    <td class="bwChartCalculatorLightCurrencyTableCell" style="white-space:nowrap;">';
    //html += '      <input id="txtApprover' + (approverNumber + 2) + 'FriendlyName" title="" />';
    //html += '      <img src="images/addressbook-icon18x18.png" style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="cmdDisplayPeoplePickerDialog(\'txtApprover' + (approverNumber + 2) + 'FriendlyName\', \'txtApprover' + (approverNumber + 2) + 'Id\', \'txtApprover' + (approverNumber + 2) + 'Email\');" />';
    //html += '      <input id="txtApprover' + (approverNumber + 2) + 'Id" style="display:none;" />';
    //html += '      <input id="txtApprover' + (approverNumber + 2) + 'Email" style="display:none;" />';
    //html += '    </td>';
    //html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
    //html += '      <span xd:binding="my:Approval' + (approverNumber + 2) + 'BudgetThreshold" class="bwCurrencyTextBox" contenteditable="true" tabindex="0"></span>';
    ////html += '      <input id="txtApprover' + approverNumber + 'BudgetThreshold" style="text-align:right;" size="10" />';
    //html += '    </td>';
    //html += '  </tr>';
    //html += '</table>';
    ////$('#divCreateFunctionalAreaAdditionalApproversSection').append(html);
    //$('#divFunctionalAreasApproverDataEntryFields').append(html);


    // If this is the 10th approver, turn off the "+ Add an approver" link.
    if (approvers.length == 10) {
        var html = '';
        html += '<i>You have reached the limit of 10 Approvers.</i>';
        document.getElementById('spanAddAnApproverLink').innerHTML = html;
    }



    // Hook up the people picker.
    $('#txtApprover' + approverNumber + 'Name').autocomplete({
        source: function (request, response) {
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
            //if (searchValue.indexOf('undefined') > -1) document.getElementById('txtApprover' + approverNumber + 'Name').value = '';
            //else document.getElementById('txtApprover' + approverNumber + 'Name').value = searchValue; //this.value.split(' ')[0] + ' ' + this.value.split(' ')[1]; // Just shows the Loan Number parameter (removing the borrower name) so it fits in the text box.

            var approverName = this.value.split('|')[0];
            var approverId = this.value.split('|')[1];
            var approverEmail = this.value.split('|')[2];

            if (approverName.indexOf('undefined') > -1) {
                document.getElementById('txtApprover' + approverNumber + 'FriendlyName').value = '';
                document.getElementById('txtApprover' + approverNumber + 'Id').value = '';
                document.getElementById('txtApprover' + approverNumber + 'Email').value = '';
            } else {
                document.getElementById('txtApprover' + approverNumber + 'FriendlyName').value = approverName;
                document.getElementById('txtApprover' + approverNumber + 'FriendlyName').setAttribute('title', approverEmail);
                document.getElementById('txtApprover' + approverNumber + 'Id').value = approverId;
                document.getElementById('txtApprover' + approverNumber + 'Email').value = approverEmail;
            }
        }
    });
    // Make sure the 'Add an approver' link is disabled once we have 10 approvers.
    if (newFunctionalAreaAdditionalApprovers.length > 7) {
        $('#aLinkCreateFunctionalAreaAddAnApprover').hide();
    }
}




function cmdSaveAccountingDepartmentUser() {
    try {
        // The department title is 'Procurement'.
        //var user = $('#txtAccountingDepartmentUser').val();
        var bwDepartmentUserName = $('#txtBwDepartmentUserName').val();
        var bwDepartmentUserId = $('#txtBwDepartmentUserId').val();
        var bwDepartmentUserEmail = $('#txtBwDepartmentUserEmail').val();
        // Now that we have all the values that were entered, save them!
        var _department = [];
        _department = {
            bwTenantId: tenantId,
            bwWorkflowAppId: workflowAppId,
            bwDepartmentTitle: 'Procurement',
            bwDepartmentUserName: bwDepartmentUserName,
            bwDepartmentUserId: bwDepartmentUserId,
            bwDepartmentUserEmail: bwDepartmentUserEmail
        };
        var operationUri = webserviceurl + "/bwdepartments";
        $.ajax({
            url: operationUri,
            type: "POST", timeout: ajaxTimeout,
            data: _department,
            headers: {
                "Accept": "application/json; odata=verbose"
            },
            success: function (data) {
                displayAlertDialog(data);
                // Now we have to change the Save button to Remove.
                var html = '';
                html += '<input style="padding:5px 10px 5px 10px;" id="btnSaveRemoveAccountingDepartmentUser" type="button" value="Remove" onclick="cmdRemoveAccountingDepartmentUser();" />';
                document.getElementById('spanSaveAccountingDepartmentUserButton').innerHTML = html;
            },
            error: function (data, errorCode, errorMessage) {
                displayAlertDialog('Error in my.js.cmdSaveAccountingDepartmentUser():1:' + errorMessage + ' ' + JSON.stringify(data));
            }
        });
    } catch (e) {
        handleExceptionWithAlert('Error in my.js.cmdSaveAccountingDepartmentUser():2:', e.message);
    }
}

function cmdRemoveAccountingDepartmentUser() {
    try {
        // The department title is 'Procurement'.
        var _department = [];
        _department = {
            bwWorkflowAppId: workflowAppId,
            bwDepartmentTitle: 'Procurement'
        };
        var operationUri = webserviceurl + "/bwdepartments/removedepartmentuser";
        $.ajax({
            url: operationUri,
            type: "POST", timeout: ajaxTimeout,
            data: _department,
            headers: {
                "Accept": "application/json; odata=verbose"
            },
            success: function (data) {
                displayAlertDialog(data);
                // Clear the textbox.
                document.getElementById('txtBwDepartmentUserName').value = '';
                // Create the button.
                var html = '';
                html += '<input style="padding:5px 10px 5px 10px;" id="btnSaveRemoveAccountingDepartmentUser" type="button" value="Save" onclick="cmdSaveAccountingDepartmentUser();" disabled />';
                document.getElementById('spanSaveAccountingDepartmentUserButton').innerHTML = html;

                //window.location = 'my.html';
                //populateStartPageItem('divWelcome', 'Reports', '');
                //renderWelcomeScreen();
            },
            error: function (data, errorCode, errorMessage) {
                displayAlertDialog('Error in my.js.cmdRemoveAccountingDepartmentUser():1:' + errorMessage + ' ' + JSON.stringify(data));
            }
        });
    } catch (e) {
        handleExceptionWithAlert('Error in my.js.cmdRemoveAccountingDepartmentUser():2:', e.message);
    }
}

function cmdCancel() {
    // This is the cancel button.
    //window.location = 'my.html';
    //populateStartPageItem('divWelcome', 'Reports', '');
    renderWelcomeScreen();
}

function renderConfigureParticipantsScreen() {
    // This is the Participants section in the configuration section.
    //var year = '2016'; // todd hardcoded.
    var year = new Date().getFullYear().toString(); // todd hardcoded.

    var html = '';
    html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';





    $('#divFunctionalAreasListButtons').html(html);
}









function generateLocationsListButtons() {
    //disableFinancialAreasButton();
    disableLocationsButton();
    // Set the main menu title bar.
    var html = '';
    html += '<table style="border-width: 0px; margin: 0px; padding: 0px; width: 100%;"><tbody><tr style="border-width: 0px; margin: 0px; padding: 0px;"><td style="border-width: 0px; margin: 0px; padding: 0px;">';
    html += 'Locations...';
    html += '</td></tr></tbody></table>';
    $('#divFunctionalAreasMasterDiv').html(html);
    //// Change the title of the section to the top financial area.
    //$('#divFunctionalAreasMasterSubMenuDiv').text('Add a financial areaxx:');
    //$('#divFunctionalAreasMasterSubMenuDiv').show(); // This shows the header right-rounder bar in case it was hidden.
    //


    var html = '';
    html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
    html += '    <tr>';
    html += '        <td style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
    html += '            <table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
    html += '                <tr>';
    html += '                    <td style="width:170px;vertical-align:top;padding:0 0 0 0;margin:0 0 0 0;border-width:0 1px 0 0;">';
    html += '                        <div id="divFunctionalAreasListButtons"></div>';
    html += '                    </td>';
    html += '                    <td style="border-right:1px solid grey;width:15px;padding:0 0 0 0;margin:0 0 0 0;border-width:0 1px 0 0;">&nbsp;</td>';
    html += '                    <td style="width:15px;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;"></td>';
    html += '                    <td>';
    html += '                        <table>';
    html += '                            <tr>';
    html += '                                <td>';
    html += '                                    <div id="divFunctionalAreaSection"></div>';
    html += '                                </td>';
    html += '                            </tr>';
    html += '                        </table>';
    html += '                    </td>';
    html += '                </tr>';
    html += '            </table>';
    html += '        </td>';
    html += '    </tr>';
    html += '</table>';
    $('#divFunctionalAreasSubSubMenus').html(html);


    // Display the functional area form.
    $('#divFunctionalAreaSection').html($('#divFunctionalAreaTemplate').html());
    $('#divFunctionalAreaSection').show();



    //var year = '2016'; // todd hardcoded.
    var year = new Date().getFullYear().toString(); // todd hardcoded.

    var html = '';
    html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';

    // BEGIN: DO A WEB SERVICE CALL TO GET THE FUNCTIONAL AREAS AND THEN ITERATE THROUGH THEM ALL HERE
    var hasTopButtonBeenDisplayed = false;
    var topButtonFinancialAreaId;

    for (var x = 0; x < BWMData[0].length; x++) {
        if (BWMData[0][x][0] = workflowAppId) {
            for (var i = 0; i < BWMData[0][x][4].length; i++) {
                if (BWMData[0][x][4][i][3] == year) {
                    if (hasTopButtonBeenDisplayed == false) {
                        // Change the title of the section to the top financial area.
                        $('#divFunctionalAreasMasterSubMenuDiv').text(BWMData[0][x][4][i][1].toString()); //'Add a financial areaxx:');
                        $('#divFunctionalAreasMasterSubMenuDiv').show(); // This shows the header right-rounder bar in case it was hidden.
                        html += '    <tr>';
                        html += '        <td style="padding:0 0 0 10px;margin:0 0 0 0;border-width:0 0 0 0;">';
                        //html += '            <div id="divFunctionalAreaMasterDiv' + BWMData[0][0][4][i][0].toString() + '" style="outline: rgb(59, 103, 142) dashed 1px;color: rgb(220, 220, 220);height:28px;width:92%;white-space:nowrap;border-radius:0 0 0 0;padding:12px 0 0 20px;margin:0 0 0 0;border-width:0 0 0 0;background-color: rgb(255, 255, 255);" class="evaluationChecklistAccordionLink">' + BWMData[0][0][4][i][1].toString() + '&nbsp;&nbsp;&nbsp;&nbsp;</div>';
                        html += '            <div id="divFunctionalAreaMasterDiv' + BWMData[0][x][4][i][0].toString() + '" class="divLeftButtonSelected">' + BWMData[0][x][4][i][1].toString() + '&nbsp;&nbsp;&nbsp;&nbsp;</div>';
                        html += '        </td>';
                        html += '    </tr>';
                        html += '    <tr><td></td></tr>';
                        hasTopButtonBeenDisplayed = true;
                        topButtonFinancialAreaId = BWMData[0][x][4][i][0].toString();
                    } else {
                        html += '    <tr>';
                        html += '        <td style="padding:0 0 0 10px;margin:0 0 0 0;border-width:0 0 0 0;">';
                        html += '            <div id="divFunctionalAreaMasterDiv' + BWMData[0][x][4][i][0].toString() + '" class="divLeftButton" onclick="renderFunctionalAreaDetails(\'' + BWMData[0][x][4][i][0].toString() + '\');">' + BWMData[0][x][4][i][1].toString() + '&nbsp;&nbsp;&nbsp;&nbsp;</div>';
                        html += '        </td>';
                        html += '    </tr>';
                        html += '    <tr><td></td></tr>';
                    }
                }
            }
        }
    }

    html += '    <tr>';
    html += '        <td style="padding:0 0 0 10px;margin:0 0 0 0;border-width:0 0 0 0;">';
    html += '            <div id="divMenuMasterDivAddAFunctionalArea" class="divLeftButton" onclick="renderFunctionalAreaDetails(\'AddAFinancialArea\');"><!--<img src="/images/plus.png" alt="" />-->+ Add a division/group/legal entity/location&nbsp;&nbsp;&nbsp;&nbsp;</div>';
    html += '        </td>';
    html += '    </tr>';
    html += '    <tr><td></td></tr>';

    html += '</table>';

    ////
    $('#divFunctionalAreasListButtons').html(html);

    if (!topButtonFinancialAreaId) topButtonFinancialAreaId = 'AddAFinancialArea'; // We do this in case there are no Financial Areas tat have bee created yet. This happens when Dec 31 turns to Jan 1.
    renderFunctionalAreaDetails(topButtonFinancialAreaId);

    ////$('#divFunctionalAreasSubSubMenus').html(html);





    ////$('#divFunctionalAreasSubSubMenus').empty();


    ////$('#divFunctionalAreasMasterDiv').empty(); // Clear the div and rebuild it with out new 'Departments' title.
    ////$('#divFunctionalAreasMasterSubMenuDiv').hide(); //This is the top bar which we want to hide in this case.









    ////populateStartPageItem('divAddAFunctionalArea', 'Reports', '');
    //$('#divFunctionalAreasMasterSubMenuDiv').text('Creating a new Financial Area:'); // Change the title of the section.
    //$('#btnFunctionalAreaDelete').hide();
    //$('#divFunctionalAreaSection').html($('#divFunctionalAreaTemplate').html()); // Display the functional area form.
    //$('#divFunctionalAreasMasterSubMenuDiv').show(); // This shows the header right-rounder bar in case it was hidden.

    hookUpThePeoplePickers(); // This hooks up the Approver #1 and #2 people pickers.



    //$('#divMenuMasterDivAddAFunctionalArea').css({
    //    'border-width': '0px', 'margin': '0px 0px 0px 0px', 'padding': '12px 0px 0px 20px', 'outline': 'rgb(59, 103, 142) dashed 1px', 'border-radius': '0px', 'width': '92%', 'height': '28px', 'color': '#dcdcdc', 'background-color': 'white'
    //});

}















function generateConfigurationLeftSideMenu() {
    console.log('In generateConfigurationLeftSideMenu().');
    //
    // 12-10-2021
    // THIS FUNCTIONALITY WAS INTENDED to show all the workflowApps in a menu on the left side of the screen, but I think the drop down on the home page is good enough. Leaving this here for now, but we can probably get rid of it.
    //

    //debugger;
    //$('#divConfigurationLeftSideMenu').empty();
    //var data = {
    //    "bwParticipantId": participantId
    //};
    //$.ajax({
    //    url: webserviceurl + "/bwworkflowapps/listallforparticipant",
    //    type: "DELETE",
    //    contentType: 'application/json',
    //    data: JSON.stringify(data),
    //    success: function (data) {
    //        var html = '';
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
    //    },
    //    error: function (data, errorCode, errorMessage) {
    //        //window.waitDialog.close();
    //        //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
    //        displayAlertDialog('Error in my.js.generateConfigurationLeftSideMenu():' + errorCode + ', ' + errorMessage);
    //    }
    //});
}



//function selectArchivePageFilterDropDown_change() {
//    var selectedValue = $('#selectArchivePageFilterDropDown option:selected').val();
//    //cmdListAllBudgetRequests(selectedValue);
//    cmdListAllBudgetRequestsUsingClientDatasetApproach();

//}

function cmdChooseSelectedWorkflow(selectedWorkflowAppId, selectedWorkflowAppTitle) {
    if (workflowAppId != selectedWorkflowAppId) {
        // Update the database with the new selected Workflow App, then regenerate the interface.
        var data = [];
        data = {
            bwParticipantId: participantId,
            selectedWorkflowAppId: selectedWorkflowAppId
        };
        var operationUri = webserviceurl + "/bwparticipant/updateuserconfigurationselectedworkflowapp";
        $.ajax({
            url: operationUri,
            type: "POST", timeout: ajaxTimeout,
            data: data,
            headers: {
                "Accept": "application/json; odata=verbose"
            },
            success: function (data) {
                if (data.message != 'SUCCESS') {
                    displayAlertDialog(data.message);
                } else {
                    //debugger; // workflowAppId check. xcx3

                    workflowAppId = selectedWorkflowAppId;
                    //debugger;
                    $('#divRequest').bwRequest('option', 'workflowAppId', workflowAppId);
                    workflowAppTitle = selectedWorkflowAppTitle;
                    newBudgetRequestManagerTitle = data.d.results[0].bwNewBudgetRequestManagerTitle;
                    if (data.d.results[0].bwRequireStartEndDates == 'true') requireStartEndDates = true;
                    else requireStartEndDates = false;
                    if (data.d.results[0].bwRequireRequestDetails == 'true') requireRequestDetails = true;
                    else requireRequestDetails = false;
                    if (data.d.results[0].bwRequireRequestDetails == 'true') requireRequestDetails = true;
                    else requireRequestDetails = false;
                    if (data.d.results[0].bwEnableNewRequestAttachments == 'true') enableNewRequestAttachments = true;
                    else enableNewRequestAttachments = false;
                    if (data.d.results[0].bwEnableNewRequestBarcodeAttachments == 'true') enableNewRequestBarcodeAttachments = true;
                    else enableNewRequestBarcodeAttachments = false;
                    //quotingEnabled = data.d.results[0].bwQuotingEnabled;

                    if (data.d.results[0].bwQuotingEnabled == 'true') quotingEnabled = true;
                    else quotingEnabled = false;

                    if (data.d.results[0].bwExpenseRequestsEnabled == 'true') reimbursementRequestsEnabled = true;
                    else reimbursementRequestsEnabled = false;

                    if (data.d.results[0].bwCloseoutsEnabled == 'true') closeoutsEnabled = true;
                    else closeoutsEnabled = false;

                    if (data.d.results[0].bwRecurringExpensesEnabled == 'true') recurringExpensesEnabled = true;
                    else recurringExpensesEnabled = false;

                    if (data.d.results[0].bwSupplementalsEnabled == 'true') supplementalsEnabled = true;
                    else supplementalsEnabled = false;

                    alert('data.d.results[0].bwEmailEnabled: ' + data.d.results[0].bwEmailEnabled);
                    if (data.d.results[0].bwEmailEnabled == 'true') emailEnabled = true;
                    else emailEnabled = false;

                    if (data.d.results[0].bwStrictAuditingEnabled == 'true') strictAuditingEnabled = true;
                    else strictAuditingEnabled = false;

                    if (data.d.results[0].bwDeveloperModeEnabled == 'true') developerModeEnabled = true;
                    else developerModeEnabled = false;

                    //debugger;
                    generateConfigurationLeftSideMenu();
                    //populateStartPageItem('divConfiguration', 'Reports', '');
                    renderConfigurationPersonalBehavior()
                    // Set the selected value for the drop down on the home page, selectHomePageWorkflowAppDropDown.
                    alert('Set the selected value for the drop down on the home page, selectHomePageWorkflowAppDropDown.');
                    $('#selectHomePageWorkflowAppDropDown option[value="' + selectedWorkflowAppId + '"]').attr('selected', 'selected');
                }
            },
            error: function (data, errorCode, errorMessage) {
                displayAlertDialog('Error in my.js.cmdChooseSelectedWorkflow(): ' + errorCode + ' ' + errorMessage);
            }
        });
    }
}



function cmdRbgAutoRefreshHomePageFrequency_OnClick(newStatus) {
    try {
        console.log('In cmdRbgAutoRefreshHomePageFrequency_OnClick().');
        //
        // In bwAuthentication options:
        //  autoRefreshHomePage: true, // This functionality will eventually not be needed, but for now it makes the application a lot more pleasant to use for the user.
        //  autoRefreshHomePage_Interval: 15000, // In ms. 15000 = 15 seconds.
        //
        // These values should be stored in the BwWorkflowUser table.
        //

        alert('In cmdRbgAutoRefreshHomePageFrequency_OnClick(). newStatus: ' + newStatus);



    } catch (e) {
        console.log('Exception in cmdRbgAutoRefreshHomePageFrequency_OnClick(): ' + e.message + ', ' + e.stack);
        displayAlertDialog('Exception in cmdRbgAutoRefreshHomePageFrequency_OnClick(): ' + e.message + ', ' + e.stack);
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

        var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
        var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');

        // Set the "Personal/Behavior" left menu button as selected. We have to do this because this is the default that appears when the Configuration button is selected.
        var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
        var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';
        $('#divInnerLeftMenuButton_PersonalBehavior').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);



        // This is where we set defaults for configurations that haven't been done yet.
        //if (emailNotificationLevel == '') emailNotificationLevel == 'alldiscourse';

        //if (emailNotificationFrequency == '') emailNotificationFrequency = 'immediately'; //immediately, aggregatedaily, aggregatetwicedaily
        //if (emailNotificationTypes == '') emailNotificationTypes = 'allnotifications'; //allnotifications, onlymytasknotifications


        if (newBudgetRequestManagerTitle == '') newBudgetRequestManagerTitle = 'Manager';



        //$('#divFunctionalAreasMasterDiv').empty(); // Clear the div and rebuild it with out new 'Departments' title.
        //$('#divFunctionalAreasMasterSubMenuDiv').hide(); //This si the top bar which we want to hide in this case.

        //var html = '';
        //html += '<table style="border-width: 0px; margin: 0px; padding: 0px; width: 100%;"><tbody><tr style="border-width: 0px; margin: 0px; padding: 0px;"><td style="border-width: 0px; margin: 0px; padding: 0px;">';
        //html += 'Personal/Behavior: <span style="font-weight:bold;color:#95b1d3;">Configure your personal/behavior settings...</span>';
        //html += '</td></tr></tbody></table>';
        //$('#divPageContent3').html(html);



        //
        //disableDepartmentsButton();
        //disableBehaviorButton();
        //
        //$('#divFunctionalAreasButton').css({'background-color':'#6682b5'});
        //
        //$('#divWorkflows').css({ 'height': '28px', 'width': '82%', 'white-space': 'nowrap', 'border-radius': '0 0 0 0', 'padding': '12px 0 0 20px', 'margin': '0 0 0 20px', 'border-width': '0 0 0 0', 'background-color': '#6682b5' });
        //
        $('#divPageContent3').empty();

        var html = '';

        //html += '<table style="width:100%;">';
        //html += '   <tr>';
        //html += '       <td>';
        //html += '               <span style="color:black;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 35pt;font-weight:bold;">Configure your personal/behavior settings...</span>'; // Velvet Morning is #95b1d3. This was the pantone color of the day for December 9, 2019! :D
        //html += '       </td>';
        //html += '       <td style="text-align:right;">';
        //html += '           <span class="printButton" title="print" onclick="cmdPrintForm();">&#x1f5a8;</span>';
        //html += '       </td>';
        //html += '   </tr>';
        //html += '</table>';




        //// Header text section.
        //html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
        //html += '   <tr>';
        //html += '       <td>';
        //html += '           <span style="font-size:small;font-style:italic;">These are your personal settings, which apply to all of your workflows.</span>';
        //html += '       </td>';
        //html += '   </tr>';
        //html += '</table>';



        html += '<table>';
        html += '   <tr><td colspan="2">&nbsp;</td></tr>';





























        if (developerModeEnabled == true) {


            // Sending email.
            html += '  <tr>';
            html += '    <td style="text-align:left;vertical-align:middle;white-space:nowrap;vertical-align:top;" class="bwSliderTitleCell">';
            html += '       Sending email (when turned on, the system will send emails to "' + participantEmail + '"):&nbsp;';
            html += '    </td>';
            html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';

            html += '       <table>';
            html += '           <tr>';
            html += '               <td>';
            html += '                   <label for="configurationBehaviorTurnOffEmailSlider"></label><input type="checkbox" name="configurationBehaviorTurnOffEmailSlider" id="configurationBehaviorTurnOffEmailSlider" />';
            html += '               </td>';
            html += '               <td>';
            html += '                   &nbsp;&nbsp;';
            html += '               </td>';
            html += '               <td>';
            html += '                   <span id="configurationBehaviorTurnOffEmailSlider_CurrentStatus"></span>';
            html += '               </td>';
            html += '               <td>';
            html += '               </td>';
            html += '               <td>';
            html += '                   <span id="configurationBehaviorTurnOffEmailSlider_Description" style="font-size:normal;">[configurationBehaviorTurnOffEmailSlider_Description]</span>';
            html += '               </td>';
            html += '           </tr>';
            html += '       </table>';
            //html += '       <br />';


            html += '    </td>';
            html += '  </tr>';

            html += '  <tr>';
            html += '    <td colspan="2">&nbsp;</td>';
            html += '  </tr>';

        }






        html += '  <tr>';
        html += '    <td colspan="2">';

        //html += '<table>';



        ////if (developerModeEnabled == true) {
        //// "Send me email" immediately section.
        //html += '  <tr>';
        ////html += '    <td style="text-align:left;" class="bwSliderTitleCell">Send me email:</td>';
        //html += '    <td style="text-align:left;" class="bwSliderTitleCell">Communicate with me:</td>';
        //html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
        //html += '      <input type="radio" style="cursor:pointer;" id="rbMyEmailNotificationImmediately" name="rbgMyEmailNotificationFrequency" onclick="cmdRbgMyEmailNotificationFrequency_click(\'immediately\');" />&nbsp;<span id="spanRbEmailImmediately" style="color:gray;">Immediately</span>';
        //if (developerModeEnabled == true) {
        //    html += '<div id="divBwPersonalOperationalHours"></div>';
        //}
        //html += '    </td>';
        //html += '  </tr>';
        ////}

        ////if (developerModeEnabled == true) {
        //// "Send me email" aggregate twice daily section.
        //html += '<tr><td></td><td class="bwChartCalculatorLightCurrencyTableCell"><input type="radio" style="cursor:pointer;" id="rbMyEmailNotificationAggregated" name="rbgMyEmailNotificationFrequency" onclick="cmdRbgMyEmailNotificationFrequency_click(\'aggregatetwicedaily\');" />&nbsp;';
        //html += '<span id="spanRbAggregateEmailTwiceDaily" style="color:gray;">Aggregate into an email sent twice daily at<br />';
        //html += '<span style="float:right;">';
        //html += '<select style="padding:5px 5px 5px 5px;" id="selectAggregateEmailTwiceDailyFirstTime" onchange="cmdRbgMyEmailNotificationFrequency_click(\'aggregatetwicedaily\');" disabled>';
        //html += '<option value="1">1AM</option>';
        //html += '<option value="2">2AM</option>';
        //html += '<option value="3">3AM</option>';
        //html += '<option value="4">4AM</option>';
        //html += '<option value="5">5AM</option>';
        //html += '<option value="6">6AM</option>';
        //html += '<option value="7">7AM</option>';
        //html += '<option value="8">8AM</option>';
        //html += '<option value="9" selected>9AM</option>';
        //html += '<option value="10">10AM</option>';
        //html += '<option value="11">11AM</option>';
        //html += '<option value="12">12PM</option>';
        //html += '<option value="13">1PM</option>';
        //html += '<option value="14">2PM</option>';
        //html += '<option value="15">3PM</option>';
        //html += '<option value="16">4PM</option>';
        //html += '<option value="17">5PM</option>';
        //html += '<option value="18">6PM</option>';
        //html += '<option value="19">7PM</option>';
        //html += '<option value="20">8PM</option>';
        //html += '<option value="21">9PM</option>';
        //html += '<option value="22">10PM</option>';
        //html += '<option value="23">11PM</option>';
        //html += '<option value="24">12AM</option>';
        //html += '</select>';
        //html += ' and ';
        //html += '<select style="padding:5px 5px 5px 5px;" id="selectAggregateEmailTwiceDailySecondTime" onchange="cmdRbgMyEmailNotificationFrequency_click(\'aggregatetwicedaily\');" disabled>';
        //html += '<option value="1">1AM</option>';
        //html += '<option value="2">2AM</option>';
        //html += '<option value="3">3AM</option>';
        //html += '<option value="4">4AM</option>';
        //html += '<option value="5">5AM</option>';
        //html += '<option value="6">6AM</option>';
        //html += '<option value="7">7AM</option>';
        //html += '<option value="8">8AM</option>';
        //html += '<option value="9">9AM</option>';
        //html += '<option value="10">10AM</option>';
        //html += '<option value="11">11AM</option>';
        //html += '<option value="12">12PM</option>';
        //html += '<option value="13">1PM</option>';
        //html += '<option value="14">2PM</option>';
        //html += '<option value="15">3PM</option>';
        //html += '<option value="16" selected>4PM</option>';
        //html += '<option value="17">5PM</option>';
        //html += '<option value="18">6PM</option>';
        //html += '<option value="19">7PM</option>';
        //html += '<option value="20">8PM</option>';
        //html += '<option value="21">9PM</option>';
        //html += '<option value="22">10PM</option>';
        //html += '<option value="23">11PM</option>';
        //html += '<option value="24">12AM</option>';
        //html += '</select>';
        //html += '  ';
        //html += '<select style="padding:5px 5px 5px 5px;" id="selectAggregateEmailTwiceDailyTimezoneDisplayName" onchange="cmdRbgMyEmailNotificationFrequency_click(\'aggregatetwicedaily\');" disabled>';
        //html += '<option value="AST">AST</option>';
        //html += '<option value="EST">EST</option>';
        //html += '<option value="CST">CST</option>';
        //html += '<option value="MST">MST</option>';
        //html += '<option value="PST">PST</option>';
        //html += '</select>';
        //html += '</span>';
        //html += '</span>';




        //html += '</td></tr>';

        //html += '<tr><td></td><td>';
        //html += '   <span style="color:gray;font-size:8pt;font-style:italic;">Aggregated emails may get sent at slightly different times depending <br />on the state of the aggregator, and the load on the system.</span>';
        //html += '</td></tr>';




        //html += '</table>';

        html += '   </td>';
        html += '  </tr>';







        html += '   <tr><td colspan="2">&nbsp;</td></tr>';
        //}













        html += '  <tr>';
        html += '    <td colspan="2">';

        //html += $('.bwNotificationSound:first').bwNotificationSound('renderNotificationSoundUI');

        //html += '<div id="divBwNotificationSound"></div>';
        // "Enable notification custom sound file" section.
        //html += '<table>';
        //html += '   <tr>';
        //html += '       <td style="text-align:left;" class="bwSliderTitleCell">Selected notification sound:</td>';
        //html += '       <td class="bwChartCalculatorLightCurrencyTableCell">';
        //html += '           <input type="radio" style="cursor:pointer;" name="cbSelectNotificationSound" />&nbsp;';
        //html += '           <span style="cursor:pointer;">';
        //html += '               <img src="images/playbutton.jpg" style="width:110px;height:70px;vertical-align:middle;" />';
        //html += '           </span>';
        //html += '           <span style="cursor:pointer;">No Sound</span>';
        //html += '           <br />';
        //html += '       </td>';
        //html += '   </tr>';
        //html += '   <tr>';
        //html += '       <td></td>';
        //html += '       <td class="bwChartCalculatorLightCurrencyTableCell">';
        //html += '           <input checked="" type="radio" style="cursor:pointer;" name="cbSelectNotificationSound" />&nbsp;';
        //html += '           <span style="cursor:pointer;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'playNotificationSound_Random\');">';
        //html += '               <img src="images/playbutton.jpg" style="width:110px;height:70px;vertical-align:middle;" />';
        //html += '           </span>';
        //html += '           <span style="cursor:pointer;">Random</span>';
        //html += '           <br />';
        //html += '           <input type="radio" style="cursor:pointer;" name="cbSelectNotificationSound" />&nbsp;';
        //html += '           <span style="cursor:pointer;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'playNotificationSound1\');">';
        //html += '               <img src="images/playbutton.jpg" style="width:110px;height:70px;vertical-align:middle;" />';
        //html += '           </span>';
        //html += '           <span style="cursor:pointer;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'playNotificationSound1\');">Star Pulse</span>';
        //html += '           <br />';
        //html += '           <input type="radio" style="cursor:pointer;" name="cbSelectNotificationSound" />&nbsp;';
        //html += '           <span style="cursor:pointer;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'playNotificationSound2\');">';
        //html += '               <img src="images/playbutton.jpg" style="width:110px;height:70px;vertical-align:middle;" />';
        //html += '           </span>';
        //html += '           <span style="cursor:pointer;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'playNotificationSound2\');">Cash Register</span>';
        //html += '           <br />';
        //html += '           <input type="radio" style="cursor:pointer;" name="cbSelectNotificationSound" />&nbsp;';
        //html += '           <span style="cursor:pointer;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'playNotificationSound3\');">';
        //html += '               <img src="images/playbutton.jpg" style="width:110px;height:70px;vertical-align:middle;" />';
        //html += '           </span>';
        //html += '           <span style="cursor:pointer;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'playNotificationSound3\');">Crickets</span>';
        //html += '       </td>';
        //html += '   </tr>';
        //html += '   <tr><td colspan="2">&nbsp;</td></tr>';
        //html += '</table>';




        //if (developerModeEnabled == true) {
        // "Upload notification custom sound file" section.
        //html += '   <tr><td style="text-align:left;vertical-align:top;" class="bwSliderTitleCell">';
        //html += '           Selected notification sound:</td>';
        //html += '       <td class="bwChartCalculatorLightCurrencyTableCell" style="vertical-align:middle;">';
        //html += '           <br />';
        //html += '           <span style="cursor:pointer;">[currentsoundtitle]</span>';
        //html += '           <span style="cursor:pointer;">[uploadbutton]</span>';
        //html += '           <br />';
        //html += '       </td>';
        //html += '   </tr>';
        //html += '   <tr><td colspan="2">&nbsp;</td></tr>';
        //}



        html += '<table>';


        // "Enable thumbnail loading in executive summaries" section.
        html += '<tr>';
        html += '    <td colspan="2">';
        html += '       <span style="font-size:small;font-style:italic;">Disabling thumbnail loading may help out on a limited network connection.</span>';
        html += '    </td>';
        html += '</tr>';
        html += '<tr>';
        html += '   <td style="text-align:left;" class="bwSliderTitleCell">';
        html += '       Enable thumbnail loading in executive summaries:';
        html += '   </td>';
        html += '   <td class="bwChartCalculatorLightCurrencyTableCell">';
        html += '       <label for="configurationBehaviorEnableThumbnailLoadingSlider"></label><input type="checkbox" name="configurationBehaviorEnableThumbnailLoadingSlider" id="configurationBehaviorEnableThumbnailLoadingSlider" />';
        html += '   </td>';
        html += '</tr>';

        html += '   <tr><td colspan="2">&nbsp;</td></tr>';



        // "Allow multiple logons from the same ip address" section.
        html += '<tr>';
        html += '    <td colspan="2">';
        html += '       <span style="font-size:small;font-style:italic;">Turn this on if you are using multiple devices or browser windows at one time. [dev note: bright activemenu when active, greyed out when not used for some time.]</span>';
        html += '    </td>';
        html += '</tr>';
        html += '<tr>';
        html += '   <td style="text-align:left;" class="bwSliderTitleCell">';
        html += '       Allow multiple logons from the same ip address:';
        html += '   </td>';
        html += '   <td class="bwChartCalculatorLightCurrencyTableCell">';
        html += '       <label for="configurationBehaviorEnableMultipleLogonsFromIpSlider"></label><input type="checkbox" name="configurationBehaviorEnableMultipleLogonsFromIpSlider" id="configurationBehaviorEnableMultipleLogonsFromIpSlider" />';
        html += '   </td>';
        html += '</tr>';

        html += '   <tr><td colspan="2">&nbsp;</td></tr>';

        // "Request push notifications from this browser" section.
        html += '<tr>';
        html += '    <td colspan="2">';
        html += '       <span style="font-size:small;font-style:italic;">Turn this on if you want push notifications from this web browser. This means you will get notifications when you get a new email or task notification.</span>';
        html += '    </td>';
        html += '</tr>';
        html += '<tr>';
        html += '   <td style="text-align:left;" class="bwSliderTitleCell">';
        html += '       Request push notifications from this browser:';
        html += '   </td>';
        html += '   <td class="bwChartCalculatorLightCurrencyTableCell">';
        html += '       <label for="configurationBehaviorToggleBrowserPushNotificationsSlider"></label><input type="checkbox" name="configurationBehaviorToggleBrowserPushNotificationsSlider" id="configurationBehaviorToggleBrowserPushNotificationsSlider" />';
        html += '   </td>';
        html += '</tr>';



        html += '   <tr><td colspan="2">&nbsp;</td></tr>';


        html += '   <tr>';
        html += '       <td colspan="2" class="bwChartCalculatorLightCurrencyTableCell">';

        //html += '                               <span style="font-size:15pt;font-weight:normal;">Review your system generated communications</span>';
        //html += '                               <br />';
        //html += '                               <span style="font-size:10pt;font-weight:normal;">The system sends you emails, which you can review here as "Sent". "Pending" emails are ones that have not been sent to you yet, because the email system has been turned off.</span>';
        //html += '                               <br /><br />';

        //html += '           <div id="divBwEmailMonitor"></div>';
        //html += '           <div id="divBwEmailClient"></div>';
        html += '       </td>';
        html += '   </tr>';


        html += '   <tr><td colspan="2">&nbsp;</td></tr>';





        //html += '   <tr>';
        //html += '       <td colspan="2" class="bwChartCalculatorLightCurrencyTableCell">';

        //html += '                               <span style="font-size:15pt;font-weight:normal;">Manage your one-time request reminders</span>';
        //html += '                               <br />';
        //html += '                               <span style="font-size:10pt;font-weight:normal;">This is the place where you can view and edit all of your manually set one-time request reminders.</span>';
        //html += '                               <br /><br />';

        //html += '           <div id="divBwOneTimeRequestReminders"></div>';
        //html += '       </td>';
        //html += '   </tr>';


        //html += '   <tr><td colspan="2">&nbsp;</td></tr>';




        html += '   <tr><td colspan="2">';




        






        html += '<table>';




        //if (developerModeEnabled == true) {
        // "Send me email" immediately section.
        html += '  <tr>';
        //html += '    <td style="text-align:left;" class="bwSliderTitleCell">Send me email:</td>';
        html += '    <td style="text-align:left;" class="bwSliderTitleCell">Communicate with me:</td>';
        html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
        html += '      <input type="radio" style="cursor:pointer;" id="rbMyEmailNotificationImmediately" name="rbgMyEmailNotificationFrequency" onclick="cmdRbgMyEmailNotificationFrequency_click(\'immediately\');" />&nbsp;<span id="spanRbEmailImmediately" style="color:gray;">Immediately</span>';
        if (developerModeEnabled == true) {
            html += '<div id="divBwPersonalOperationalHours"></div>';
        }
        html += '    </td>';
        html += '  </tr>';
        //}

        //if (developerModeEnabled == true) {
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



        html += '<tr><td></td><td>';
        html += '   <span style="color:gray;font-size:8pt;font-style:italic;">Aggregated emails may get sent at slightly different times depending <br />on the state of the aggregator, and the load on the system.</span>';
        html += '</td></tr>';



        if (developerModeEnabled) {
            // "Send me email" immediately section.
            html += '<tr><td colspan="2"><br /><br /></td></tr>';
            html += '  <tr>';
            html += '    <td style="text-align:left;" class="bwSliderTitleCell">The "New Messages" red dot disappears after the first new message is viewed:</td>';
            html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
            html += '      <input type="radio" style="cursor:pointer;" id="rbMyEmailNotificationImmediatelyxx" name="rbgMyEmailNotificationFrequencyxx" onclick="cmdRbgMyEmailNotificationFrequencyxx_click(\'immediately\');" />&nbsp;<span id="spanRbEmailImmediatelyxx" style="color:gray;">xcx231421-1</span>';
            html += '    </td>';
            html += '  </tr>';
            html += '  <tr>';
            html += '    <td style="text-align:left;" class="bwSliderTitleCell">The "New Messages" red dot disappears after all messages have been viewed:</td>';
            html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
            html += '      <input type="radio" style="cursor:pointer;" id="rbMyEmailNotificationImmediatelyxx" name="rbgMyEmailNotificationFrequencyxx" onclick="cmdRbgMyEmailNotificationFrequencyxx_click(\'immediately\');" />&nbsp;<span id="spanRbEmailImmediatelyxx" style="color:gray;">xcx231421-2</span>';
            html += '    </td>';
            html += '  </tr>';
        }






        html += '</table>';


        html += '   </td></tr>';







        html += '   <tr><td colspan="2">&nbsp;</td></tr>';














        //html += $('.bwNotificationSound:first').bwNotificationSound('renderNotificationSoundUI');
        html += $('.bwPersonalErrorAdministration:first').bwPersonalErrorAdministration('renderPersonalErrorAdministrationUI');




        html += '   <tr><td colspan="2">&nbsp;</td></tr>';







        html += '   <tr>';
        html += '       <td colspan="2" class="bwChartCalculatorLightCurrencyTableCell">';

        html += '                               <span style="font-size:15pt;font-weight:normal;">Manage your one-time request reminders</span>';
        html += '                               <br />';
        html += '                               <span style="font-size:10pt;font-weight:normal;">This is the place where you can view and edit all of your manually set one-time request reminders.</span>';
        html += '                               <br /><br />';

        html += '           <div id="divBwOneTimeRequestReminders"></div>';
        html += '       </td>';
        html += '   </tr>';


        html += '   <tr><td colspan="2">&nbsp;</td></tr>';








        //html += $('.bwPersonalErrorAdministration:first').bwPersonalErrorAdministration('renderPersonalErrorAdministrationUI');

        if (developerModeEnabled) {
            html += $('.bwNotificationSound:first').bwNotificationSound('renderNotificationSoundUI');
        }

        html += '   <tr><td colspan="2">&nbsp;</td></tr>';




        //html += '  <tr>';
        //html += '    <td colspan="2">';

        //html += '<table>';

        //// 9-1-2021
        //// "Two factor authentication using SMS/Text Messaging" section.
        //html += '   <tr><td colspan="2">&nbsp;</td></tr>';
        //html += '   <tr><td style="text-align:left;" class="bwSliderTitleCell">';
        //html += '       Two factor authentication using SMS/Text Messaging:&nbsp;</td>';
        //html += '       <td class="bwChartCalculatorLightCurrencyTableCell"><label for="configurationBehaviorTwoFactorAuthenticationWithSmsTextMessagingSlider"></label><input type="checkbox" name="configurationBehaviorTwoFactorAuthenticationWithSmsTextMessagingSlider" id="configurationBehaviorTwoFactorAuthenticationWithSmsTextMessagingSlider" /></td></tr>';
        ////html += '<tr><td>&nbsp;</td></tr>';

        ////html += '<tr><td>&nbsp;</td></tr>';
        //html += '   <tr><td style="text-align:left;" class="bwSliderTitleCell">';
        //html += '       SMS/TEXT/CELL number:&nbsp;</td>';
        //html += '       <td class="bwChartCalculatorLightCurrencyTableCell"><input type="text" id="inputBwTwoFactorAuthenticationSmsNumber" style="font-size:30pt;width:350px;" />&nbsp;<input type="button" value="Save" onclick="$(\'#divBwAuthentication\').bwAuthentication(\'saveParticipantSmsNumber\');" /></td></tr>';
        //html += '   <tr><td colspan="2">&nbsp;</td></tr>';


        //html += '</table>';

        //html += '   </td>';
        //html += '  </tr>';




        //// "Display 'Add a Person/Participant/Vendor' section on the home page" section.
        //html += '   <tr><td style="text-align:left;" class="bwSliderTitleCell">';
        //html += '           Display "Add a Person/Participant/Vendor" section on the home page:</td>';
        //html += '       <td class="bwChartCalculatorLightCurrencyTableCell"><label for="configurationBehaviorDisplayInvitationsOnHomePageSlider"></label><input type="checkbox" name="configurationBehaviorDisplayInvitationsOnHomePageSlider" id="configurationBehaviorDisplayInvitationsOnHomePageSlider" /></td></tr>';
        //html += '   <tr><td colspan="2">&nbsp;</td></tr>';














        if (developerModeEnabled == true) {
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
            html += '          <input type="radio" style="cursor:pointer;" id="rbMyEmailNotificationTypeNoNotifications" name="rbgMyEmailNotificationTypes" onclick="cmdRbgMyEmailNotificationTypes_click(\'nonotifications\');" />&nbsp;<span id="spanEmailNotificationTypeNoNotifications" style="color:gray;">No email notifications ps. dev note: at the very least you will get a once a month email just to keep you involved in the system and to choose if you wish to quit.</span>';
            html += '        </td>';
            html += '</tr>';
            html += '<tr><td colspan="2">&nbsp;</td></tr>';
        }

        if (developerModeEnabled == true) {
            // "Send me this kind of email" section.
            //html += '<tr><td style="text-align:left;" class="bwSliderTitleCell">Send me this kind of email:</td><td class="bwChartCalculatorLightCurrencyTableCell"><input type="radio" id="rbMyEmailNotificationTypeAllNotifications" name="rbgMyEmailNotificationTypes" onclick="cmdRbgMyEmailNotificationTypes_click(\'allnotifications\');" />&nbsp;<span id="spanEmailNotificationTypeAllNotifications" style="color:gray;">All notifications</span></td></tr>';
            //html += '<tr><td></td><td class="bwChartCalculatorLightCurrencyTableCell"><input type="radio" id="rbMyEmailNotificationTypeOnlyTasks" name="rbgMyEmailNotificationTypes" onclick="cmdRbgMyEmailNotificationTypes_click(\'onlymytasknotifications\');" />&nbsp;<span id="spanEmailNotificationTypeOnlyTasks" style="color:gray;">Only my task notifications</span></td></tr>';
            html += '<tr>';
            html += '  <td style="text-align:left;" class="bwSliderTitleCell">Send me this kind of text message:</td>';
            html += '        <td class="bwChartCalculatorLightCurrencyTableCell">';
            html += '          <input type="radio" style="cursor:pointer;" id="rbMyTextMessageNotificationTypeAllNotifications" name="rbgMyTextMessageNotificationTypes" onclick="cmdRbgMyTextMessageNotificationTypes_click(\'allnotifications\');" />&nbsp;<span id="spanTextMessageNotificationTypeAllNotifications" style="color:gray;">All notifications</span>';
            html += '        </td>';
            html += '</tr>';
            html += '<tr>';
            html += '  <td></td>';
            html += '        <td class="bwChartCalculatorLightCurrencyTableCell">';
            html += '          <input type="radio" style="cursor:pointer;" id="rbMyTextMessageNotificationTypeOnlyTasks" name="rbgMyTextMessageNotificationTypes" onclick="cmdRbgMyTextMessageNotificationTypes_click(\'onlymytasknotifications\');" />&nbsp;<span id="spanTextMessageNotificationTypeOnlyTasks" style="color:gray;">Only my task notifications</span>';
            html += '        </td>';
            html += '</tr>';
            html += '<tr>';
            html += '  <td></td>';
            html += '        <td class="bwChartCalculatorLightCurrencyTableCell">';
            html += '          <input type="radio" style="cursor:pointer;" id="rbMyTextMessageNotificationTypeNoNotifications" name="rbgMyTextMessageNotificationTypes" onclick="cmdRbgMyTextMessageNotificationTypes_click(\'nonotifications\');" />&nbsp;<span id="spanTextMessageNotificationTypeNoNotifications" style="color:gray;">No text message notifications</span>';
            html += '        </td>';
            html += '</tr>';
            html += '<tr><td colspan="2">&nbsp;</td></tr>';
        }

        if (developerModeEnabled == true) {
            // "Display tips at the top of the page" section.
            html += '<tr><td colspan="2">&nbsp;</td></tr>';
            html += '<tr><td style="text-align:left;" class="bwSliderTitleCell">';
            html += 'Display tips at the top of the page:&nbsp;</td>';
            html += '<td class="bwChartCalculatorLightCurrencyTableCell"><label for="configurationBehaviorTipsSlider"></label><input type="checkbox" name="configurationBehaviorTipsSlider" id="configurationBehaviorTipsSlider" /></td></tr>';
            html += '<tr><td colspan="2">&nbsp;</td></tr>';
        }


        if (developerModeEnabled == true) {
            // "Display task details before displaying requests" section.
            html += '  <tr>';
            html += '    <td colspan="2">';
            html += '        <span style="font-size:small;font-style:italic;">When viewing a request from the Home page, you can choose to view the approval trail prior to displaying the request.</span>';
            html += '    </td></tr>';
            html += '   <tr><td style="text-align:left;" class="bwSliderTitleCell">';
            html += '           Display task details before displaying requests:</td>';
            html += '       <td class="bwChartCalculatorLightCurrencyTableCell"><label for="configurationBehaviorDisplayTaskDetailsBeforeRequestsPageSlider"></label><input type="checkbox" name="configurationBehaviorDisplayTaskDetailsBeforeRequestsPageSlider" id="configurationBehaviorDisplayTaskDetailsBeforeRequestsPageSlider" /></td></tr>';
            html += '   <tr><td colspan="2">&nbsp;</td></tr>';
        }


        if (developerModeEnabled == true) {
            // 1-20-2022
            // "Display 'My workflow apps/organizations' section on the home page" section.
            html += '   <tr><td style="text-align:left;" class="bwSliderTitleCell">';
            html += '           My workflow apps/organizations (where I am the tenant owner):</td>';
            html += '       <td class="bwChartCalculatorLightCurrencyTableCell"><label for="configurationBehaviorDisplayInvitationsOnHomePageSliderxxx"></label><input type="checkbox" name="configurationBehaviorDisplayInvitationsOnHomePageSliderxxxx" id="configurationBehaviorDisplayInvitationsOnHomePageSliderxxxx" /></td></tr>';
            html += '   <tr><td colspan="2">[Create new workflow app/organization]</td></tr>';
            html += '   <tr><td colspan="2">&nbsp;</td></tr>';



            html += '   <tr>';
            html += '       <td colspan="2" class="bwSliderTitleCell">';

            html += '                               <span style="font-size:15pt;font-weight:normal;">Create a New Organization</span>';
            html += '                               <br />';
            html += '                               <span style="font-size:10pt;font-weight:normal;">You can create a new organization.. xcx3243956</span>';
            html += '                               <br /><br />';

            html += '           <div id="divBwEmailMonitorxxxxxx"></div>';
            html += '       </td>';
            html += '   </tr>';


            html += '   <tr><td colspan="2">&nbsp;</td></tr>';
















            // 9-1-2021
            // "Two factor authentication using SMS/Text Messaging" section.
            html += '   <tr><td colspan="2">&nbsp;</td></tr>';
            html += '               <tr>';
            html += '                   <td style="text-align:left;" class="bwSliderTitleCell">';
            html += '                       Two factor authentication<br />using SMS/Text Messaging:&nbsp;';
            html += '                   </td>';
            html += '                   <td class="bwChartCalculatorLightCurrencyTableCell"><label for="configurationBehaviorTwoFactorAuthenticationWithSmsTextMessagingSlider"></label>';
            html += '                       <input type="checkbox" name="configurationBehaviorTwoFactorAuthenticationWithSmsTextMessagingSlider" id="configurationBehaviorTwoFactorAuthenticationWithSmsTextMessagingSlider" />';
            html += '                       &nbsp;<span style="font-size:10pt;font-weight:normal;font-style:italic;">This setting will take effect when the current ActiveStateIdentifier expires.</span>';
            html += '                   </td>';
            html += '               </tr>';
            html += '               <tr>';
            html += '                   <td style="text-align:left;" class="bwSliderTitleCell">';
            html += '                       SMS/TEXT/CELL number:&nbsp;';
            html += '                   </td>';
            html += '                   <td class="bwChartCalculatorLightCurrencyTableCell">';
            html += '                       <input type="text" id="inputBwTwoFactorAuthenticationSmsNumber" style="font-size:30pt;width:350px;" />';
            html += '                       &nbsp;<input type="button" class="BwSmallButton" value="Save" onclick="$(\'#divBwAuthentication\').bwAuthentication(\'saveParticipantSmsNumber\');" />';
            html += '                   </td>';
            html += '               </tr>';
            html += '               <tr>';
            html += '                   <td colspan="2">&nbsp;</td>';
            html += '               </tr>';
            html += '           </table>';
            html += '       </td>';
            html += '   </tr>';




            // "Display 'Add a Person/Participant/Vendor' section on the home page" section.
            html += '   <tr>';
            html += '       <td style="text-align:left;" class="bwSliderTitleCell">';
            html += '           Display "Add a Person/Participant/Vendor"<br />section on the home page:';
            html += '       </td>';
            html += '       <td class="bwChartCalculatorLightCurrencyTableCell">';
            html += '           <label for="configurationBehaviorDisplayInvitationsOnHomePageSlider"></label>';
            html += '           <input type="checkbox" name="configurationBehaviorDisplayInvitationsOnHomePageSlider" id="configurationBehaviorDisplayInvitationsOnHomePageSlider" />';
            html += '       </td>';
            html += '   </tr>';

            html += '   <tr><td colspan="2">&nbsp;</td></tr>';




            // "Display 'Add a Person/Participant/Vendor' section on the home page" section.
            html += '   <tr>';
            html += '       <td style="text-align:left;" class="bwSliderTitleCell">';
            html += '           Screen-saver settings (Coming Soon!):';
            html += '       </td>';
            html += '       <td class="bwChartCalculatorLightCurrencyTableCell">';
            html += '           <label for="configurationBehaviorDisplayInvitationsOnHomePageSliderxx"></label>';
            html += '           <input type="checkbox" name="configurationBehaviorDisplayInvitationsOnHomePageSliderxx" id="configurationBehaviorDisplayInvitationsOnHomePageSliderxx" />';
            html += '       </td>';
            html += '   </tr>';

            html += '   <tr><td colspan="2">&nbsp;</td></tr>';
















            // 1-22-2022
            //
            // "Auto-save" immediately section.
            //
            // In bwAuthentication.js:
            // autoRefreshHomePage: true, // This functionality will eventually not be needed, but for now it makes the application a lot more pleasant to use for the user.
            // autoRefreshHomePage_Interval: 15000, // In ms. 15000 = 15 seconds.

            html += '  <tr>';
            html += '    <td style="text-align:left;" >';

            html += '<table>';
            html += '  <tr>';
            html += '    <td style="text-align:left;" class="bwSliderTitleCell">Auto-refresh home page:</td>';
            html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
            html += '      <input type="radio" style="cursor:pointer;" id="rbAutoRefreshHomePageEveryFifteenSeconds" name="rbgAutoRefreshHomePageFrequency" onclick="cmdRbgAutoRefreshHomePageFrequency_OnClick(\'everyfifteenseconds\');" />&nbsp;<span id="spanRbAutosaveFormEntryImmediatelyxx" style="color:gray;">Every 15 seconds</span>';
            html += '    </td>';
            html += '  </tr>';
            html += '  <tr>';
            html += '    <td></td>';
            html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
            html += '      <input type="radio" style="cursor:pointer;" id="rbAutoRefreshHomePageEveryThirtySeconds" name="rbgAutoRefreshHomePageFrequency" onclick="cmdRbgAutoRefreshHomePageFrequency_OnClick(\'everythirtyseconds\');" />&nbsp;<span id="spanRbAutosaveFormEntryEverySixtySecondsxx" style="color:gray;">Every 30 seconds</span>';
            html += '    </td>';
            html += '  </tr>';
            html += '  <tr>';
            html += '    <td></td>';
            html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
            html += '      <input type="radio" style="cursor:pointer;" id="rbAutoRefreshHomePageEverySixtySeconds" name="rbgAutoRefreshHomePageFrequency" onclick="cmdRbgAutoRefreshHomePageFrequency_OnClick(\'everysixtyseconds\');" />&nbsp;<span id="spanRbAutosaveFormEntryNeverxx" style="color:gray;">Every 60 seconds</span>';
            html += '    </td>';
            html += '  </tr>';
            html += '  <tr>';
            html += '    <td></td>';
            html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
            html += '      <input type="radio" style="cursor:pointer;" id="rbAutoRefreshHomePageNever" name="rbgAutoRefreshHomePageFrequency" onclick="cmdRbgAutoRefreshHomePageFrequency_OnClick(\'never\');" />&nbsp;<span id="spanRbAutosaveFormEntrySaveToMyDevicexx" style="color:gray;">Never</span>';
            html += '    </td>';
            html += '  </tr>';
            //html += '<tr><td colspan="2">&nbsp;</td></tr>';
            html += '</table>';



            html += '    </td>';
            html += '    <td></td>';
            html += '  </tr>';
            //
            // end: "Auto-save" immediately section.
            //

        }







        if (developerModeEnabled == true) {
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
        }




        if (developerModeEnabled == true) {
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
            html += '           <script>$( function() { $("#slider").slider(); } );</script>';
            html += '           <div id="slider"></div>';
            html += '       </td>';
            html += '   </tr>';
            html += '   <tr><td colspan="2">&nbsp;</td></tr>';
            //html += '   <tr><td colspan="2">&nbsp;</td></tr>';
        }


        html += '       </table>';


        //html += '<div id="divBwEmailMonitor"></div>';


        $('#divPageContent3').html(html);








        if (developerModeEnabled == true) {

            // NO THIS IS AGLOBAL, SHOULD BE AT THE TOP OF THIS CODE... DONt DO IT THIS WAY XXXX  :/ //var emailEnabled = true; // 1-20-2022 hardcoded for now under development. coming soon!
            if (emailEnabled == true) {
                var html = '';
                html += '<span style="font-size:small;font-style:italic;">';
                html += 'Email is ON';
                html += '</span>';
                document.getElementById('configurationBehaviorTurnOffEmailSlider_Description').innerHTML = html;
                //
                //var html = '';
                //html += '<span style="color:green;">';
                //html += 'xx emails have been sent so far today.';

                //html += '                   &nbsp;&nbsp;';
                //html += '                   <input type="button" value="View all emails..." onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdViewAllEmails\');" style="cursor:pointer;padding:5px 10px 5px 10px;" />';

                //html += '</span>';
                //document.getElementById('configurationBehaviorTurnOffEmailSlider_CurrentStatus').innerHTML = html;
            } else {
                var html = '';
                html += '<span style="color:darkgrey;font-size:small;font-style:italic;">';
                html += 'Turning off email may be desired if you wish to review or moderate emails before they get sent.xcx2-1';
                html += '<br />';
                html += 'When turned off, automatic emails get put into the Pending folder (below), where you can choose to send them, or delete them.';
                html += '</span>';
                document.getElementById('configurationBehaviorTurnOffEmailSlider_Description').innerHTML = html;
                //
                //var html = '';
                //html += '<span style="color:red;">';
                //html += 'There are xx unsent emails.';

                //html += '                   &nbsp;&nbsp;';
                //html += '                   <input type="button" value="View unsent emails..." onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdViewUnsentEmails\');" style="cursor:pointer;padding:5px 10px 5px 10px;" />';
                //html += '                   &nbsp;&nbsp;';
                //html += '                   <input type="button" value="View Email Log..." onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdViewAllEmails\');" style="cursor:pointer;padding:5px 10px 5px 10px;" />';

                //html += '</span>';
                //document.getElementById('configurationBehaviorTurnOffEmailSlider_CurrentStatus').innerHTML = html;
            }
            var configurationBehaviorTurnOffEmailOptions = {
                checked: emailEnabled,
                show_labels: true,         // Should we show the on and off labels?
                labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                on_label: '<span style="color:green;font-weight:bold;">ON</span>',            // Text to be displayed when checked
                off_label: '<span style="color:red;font-weight:bold;">OFF</span>',          // Text to be displayed when unchecked
                width: 50,                 // Width of the button in pixels
                height: 22,                // Height of the button in pixels
                button_width: 24,         // Width of the sliding part in pixels
                clear_after: null         // Override the element after which the clearing div should be inserted 
            };
            $("input#configurationBehaviorTurnOffEmailSlider").switchButton(configurationBehaviorTurnOffEmailOptions);

        }





        //$('#divBwEmailMonitor').bwEmailMonitor({
        //    OnlyDisplayEmailsForCurrentParticipant: true
        //});

        //$('#divBwEmailClient').bwEmailClient({});




        $('#divBwOneTimeRequestReminders').bwOneTimeRequestReminders({}); // 2-2-2023


        var configurationBehaviorEnableThumbnailLoadingOptions = {
            checked: thumbnailLoadingEnabled,
            show_labels: true,         // Should we show the on and off labels?
            labels_placement: "left",  // Position of the labels: "both", "left" or "right"
            on_label: '<span style="color:green;font-weight:bold;">ON</span>',            // Text to be displayed when checked
            off_label: '<span style="color:red;font-weight:bold;">OFF</span>',          // Text to be displayed when unchecked
            width: 50,                 // Width of the button in pixels
            height: 22,                // Height of the button in pixels
            button_width: 24,         // Width of the sliding part in pixels
            clear_after: null         // Override the element after which the clearing div should be inserted 
        };
        $("input#configurationBehaviorEnableThumbnailLoadingSlider").switchButton(configurationBehaviorEnableThumbnailLoadingOptions);

        // 12-31-2023.
        var configurationBehaviorEnableMultipleLogonsFromIpOptions = {
            checked: false, //thumbnailLoadingEnabled,
            show_labels: true,         // Should we show the on and off labels?
            labels_placement: "left",  // Position of the labels: "both", "left" or "right"
            on_label: '<span style="color:green;font-weight:bold;">ON</span>',            // Text to be displayed when checked
            off_label: '<span style="color:red;font-weight:bold;">OFF</span>',          // Text to be displayed when unchecked
            width: 50,                 // Width of the button in pixels
            height: 22,                // Height of the button in pixels
            button_width: 24,         // Width of the sliding part in pixels
            clear_after: null         // Override the element after which the clearing div should be inserted 
        };
        $("input#configurationBehaviorEnableMultipleLogonsFromIpSlider").switchButton(configurationBehaviorEnableMultipleLogonsFromIpOptions);

        // 1-13-2024.
        var configurationBehaviorToggleBrowserPushNotificationsOptions = {
            checked: false, //thumbnailLoadingEnabled,
            show_labels: true,         // Should we show the on and off labels?
            labels_placement: "left",  // Position of the labels: "both", "left" or "right"
            on_label: '<span style="color:green;font-weight:bold;">ON</span>',            // Text to be displayed when checked
            off_label: '<span style="color:red;font-weight:bold;">OFF</span>',          // Text to be displayed when unchecked
            width: 50,                 // Width of the button in pixels
            height: 22,                // Height of the button in pixels
            button_width: 24,         // Width of the sliding part in pixels
            clear_after: null         // Override the element after which the clearing div should be inserted 
        };
        $("input#configurationBehaviorToggleBrowserPushNotificationsSlider").switchButton(configurationBehaviorToggleBrowserPushNotificationsOptions);



        //alert('bwTwoFactorAuthenticationEnabled: ' + bwTwoFactorAuthenticationEnabled);

        // 9-3-2021
        //if (bwTwoFactorAuthenticationEnabled == true) {
        //    document.getElementById('configurationBehaviorTwoFactorAuthenticationWithSmsTextMessagingSlider').setAttribute('checked', 'checked');
        //} else {
        //    document.getElementById('configurationBehaviorTwoFactorAuthenticationWithSmsTextMessagingSlider').removeAttribute('checked');
        //}

        $('#inputBwTwoFactorAuthenticationSmsNumber').val(bwTwoFactorAuthenticationSmsNumber);









        // Now we set all the display elements into their correct states!
        //emailAggregatorTwiceDailyFirstTime
        //emailAggregatorTwiceDailySecondTime
        //emailAggregatorTwiceDailyTimezoneDisplayName

        // Check if this has a value. This will be undefined the first time around until something gets saved back to the database.
        if (emailAggregatorTwiceDailyFirstTime) {
            //displayAlertDialog('emailAggregatorTwiceDailyFirstTime: ' + emailAggregatorTwiceDailyFirstTime);
            if (document.getElementById('selectAggregateEmailTwiceDailyFirstTime')) {
                document.getElementById('selectAggregateEmailTwiceDailyFirstTime').value = emailAggregatorTwiceDailyFirstTime;
            }
            if (document.getElementById('selectAggregateEmailTwiceDailySecondTime')) {
                document.getElementById('selectAggregateEmailTwiceDailySecondTime').value = emailAggregatorTwiceDailySecondTime;
            }
            if (document.getElementById('selectAggregateEmailTwiceDailyTimezoneDisplayName')) {
                document.getElementById('selectAggregateEmailTwiceDailyTimezoneDisplayName').value = emailAggregatorTwiceDailyTimezoneDisplayName;
            }
        }


        if (emailNotificationFrequency == 'immediately') {
            if (document.getElementById('rbMyEmailNotificationImmediately')) document.getElementById('rbMyEmailNotificationImmediately').setAttribute('checked', 'checked');
            if (document.getElementById('spanRbEmailImmediately')) document.getElementById('spanRbEmailImmediately').style.color = 'black'; //$('spanRbEmailImmediately').css({ 'color': 'black' });
            if (document.getElementById('selectAggregateEmailTwiceDailyFirstTime')) document.getElementById('selectAggregateEmailTwiceDailyFirstTime').disabled = true;
            if (document.getElementById('selectAggregateEmailTwiceDailySecondTime')) document.getElementById('selectAggregateEmailTwiceDailySecondTime').disabled = true;
            if (document.getElementById('selectAggregateEmailTwiceDailyTimezoneDisplayName')) document.getElementById('selectAggregateEmailTwiceDailyTimezoneDisplayName').disabled = true;
        } else if (emailNotificationFrequency == 'aggregatetwicedaily') {
            if (document.getElementById('rbMyEmailNotificationAggregated')) document.getElementById('rbMyEmailNotificationAggregated').setAttribute('checked', 'checked');
            if (document.getElementById('spanRbAggregateEmailTwiceDaily')) document.getElementById('spanRbAggregateEmailTwiceDaily').style.color = 'black'; //$('spanRbAggregateEmailTwiceDaily').css({ 'color': 'black' });
            if (document.getElementById('selectAggregateEmailTwiceDailyFirstTime')) document.getElementById('selectAggregateEmailTwiceDailyFirstTime').disabled = false;
            if (document.getElementById('selectAggregateEmailTwiceDailySecondTime')) document.getElementById('selectAggregateEmailTwiceDailySecondTime').disabled = false;
            if (document.getElementById('selectAggregateEmailTwiceDailyTimezoneDisplayName')) document.getElementById('selectAggregateEmailTwiceDailyTimezoneDisplayName').disabled = false;
        }

        //if (emailNotificationTypes == 'allnotifications') {
        //    document.getElementById('rbMyEmailNotificationTypeAllNotifications').setAttribute('checked', 'checked');
        //    document.getElementById('spanEmailNotificationTypeAllNotifications').style.color = 'black';
        //} else if (emailNotificationTypes == 'onlymytasknotifications') {
        //    document.getElementById('rbMyEmailNotificationTypeOnlyTasks').setAttribute('checked', 'checked');
        //    document.getElementById('spanEmailNotificationTypeOnlyTasks').style.color = 'black';
        //}
        if (emailNotificationTypes == 'allnotifications') {
            if (document.getElementById('rbMyEmailNotificationTypeAllNotifications')) document.getElementById('rbMyEmailNotificationTypeAllNotifications').setAttribute('checked', 'checked');
            if (document.getElementById('spanEmailNotificationTypeAllNotifications')) document.getElementById('spanEmailNotificationTypeAllNotifications').style.color = 'black';
        } else if (emailNotificationTypes == 'onlymytasknotifications') {
            if (document.getElementById('rbMyEmailNotificationTypeOnlyTasks')) document.getElementById('rbMyEmailNotificationTypeOnlyTasks').setAttribute('checked', 'checked');
            if (document.getElementById('spanEmailNotificationTypeOnlyTasks')) document.getElementById('spanEmailNotificationTypeOnlyTasks').style.color = 'black';
        } else if (emailNotificationTypes == 'nonotifications') {
            if (document.getElementById('rbMyEmailNotificationTypeNoNotifications')) document.getElementById('rbMyEmailNotificationTypeNoNotifications').setAttribute('checked', 'checked');
            if (document.getElementById('spanEmailNotificationTypeNoNotifications')) document.getElementById('spanEmailNotificationTypeNoNotifications').style.color = 'black';
        }


        if (developerModeEnabled == true) {
            var operationalHoursOptions = {};
            $('#divBwPersonalOperationalHours').bwOperationalHours(operationalHoursOptions);
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


        // 9-11-2021
        var configurationBehaviorTwoFactorAuthenticationWithSmsTextMessagingSliderOptions = {
            checked: bwTwoFactorAuthenticationEnabled,
            show_labels: true,         // Should we show the on and off labels?
            labels_placement: "left",  // Position of the labels: "both", "left" or "right"
            on_label: "ON",            // Text to be displayed when checked
            off_label: "OFF",          // Text to be displayed when unchecked
            width: 50,                 // Width of the button in pixels
            height: 22,                // Height of the button in pixels
            button_width: 24,         // Width of the sliding part in pixels
            clear_after: null         // Override the element after which the clearing div should be inserted 
        };
        $("input#configurationBehaviorTwoFactorAuthenticationWithSmsTextMessagingSlider").switchButton(configurationBehaviorTwoFactorAuthenticationWithSmsTextMessagingSliderOptions);

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


        // 9-11-2021
        $('#configurationBehaviorTwoFactorAuthenticationWithSmsTextMessagingSlider').change(function () {

            $('#divBwAuthentication').bwAuthentication('configurationBehaviorTwoFactorAuthenticationWithSmsTextMessagingSlider_Onchange');

        });



        // 12-15-2023.
        $('#configurationBehaviorEnableThumbnailLoadingSlider').change(function () {

            $('#divBwAuthentication').bwAuthentication('configurationBehaviorEnableThumbnailLoadingSlider_Onchange'); // configurationBehaviorTwoFactorAuthenticationWithSmsTextMessagingSlider_Onchange');

        });


        // 12-31-2023.
        $('#configurationBehaviorEnableMultipleLogonsFromIpSlider').change(function () {

            $('#divBwAuthentication').bwAuthentication('configurationBehaviorEnableMultipleLogonsFromIpSlider_Onchange'); // configurationBehaviorTwoFactorAuthenticationWithSmsTextMessagingSlider_Onchange');

        });


        $('#configurationBehaviorToggleBrowserPushNotificationsSlider').change(function () {

            $('#divBwAuthentication').bwAuthentication('configurationBehaviorToggleBrowserPushNotificationsSlider_Onchange');

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

            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            var _userDetails = {
                bwParticipantId: participantId,
                bwInvitationsOnHomePageDisplayOn: displayInvitationsOnHomePageDisplayOn.toString()
            };
            var operationUri = webserviceurl + "/bwparticipant/updateuserconfigurationbehaviordisplayinvitationsonhomepage";
            $.ajax({
                url: operationUri,
                type: "POST",
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

function kupValidateLicenseFormat() {
    // Check that the format of the license key matches this: "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".
    // 8 - 4 - 4 - 4 - 12 = total length of 36.
    document.getElementById('btnAddNewLicense').disabled = true; // Disable the Add button until it all looks right!
    var licenseKey = document.getElementById('txtLicense').value;

    if (licenseKey.length == 36) {
        if (licenseKey.split('-')[0].length == 8) {
            if (licenseKey.split('-')[1].length == 4) {
                if (licenseKey.split('-')[2].length == 4) {
                    if (licenseKey.split('-')[3].length == 4) {
                        if (licenseKey.split('-')[4].length == 12) {
                            // The key has the orrect structure. Now checking for 4 and y.
                            if (licenseKey.split('-')[2].indexOf('4') == 0) {
                                //displayAlertDialog('valid looking key');
                                // This looks like a valid key! Now we just need to check that they haven't already added it.
                                if (globalLicenses.length == 0) {
                                    //Enable the Add button.
                                    document.getElementById('btnAddNewLicense').disabled = false;
                                } else {
                                    var existsAlready = false;
                                    for (var i = 0; i < globalLicenses.length; i++) {
                                        if (globalLicenses[i][2] == licenseKey) {
                                            existsAlready = true;
                                        }
                                    }
                                    if (existsAlready == true) {
                                        displayAlertDialog('You have already assigned this license. It can\'t be assigned twice.');
                                        document.getElementById('txtLicense').value = '';
                                    } else {
                                        //Enable the Add button.
                                        document.getElementById('btnAddNewLicense').disabled = false;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function getLicenseExpiryFriendlyDate(licenseClaimedTimestamp) {
    var year = Number(licenseClaimedTimestamp.split('-')[0]) + 1; // The license is good for a year from when it is claimed!
    var month = licenseClaimedTimestamp.split('-')[1];
    var day1 = licenseClaimedTimestamp.split('-')[2];
    var day = day1.split('T')[0];
    var monthName = monthNames[month - 1];
    var result = monthName + ' ' + day + ', ' + year;
    //displayAlertDialog('result:' + result);
    return result;
}

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

function cmdViewLicenses() {
    displayAlertDialog('This functionality is incomplete. Coming soon, this is where you will be able to view your license details and purchase invoice.');
}

function cmdAddNewLicense() {
    var bwWorkflowAppLicenseId = document.getElementById('txtLicense').value;
    var licenseDetails = [];
    licenseDetails = {
        LicenseClaimedById: participantId,
        LicenseClaimedByFriendlyName: participantFriendlyName,
        LicenseClaimedByEmail: participantEmail,
        bwWorkflowAppId: workflowAppId,
        bwWorkflowAppLicenseId: bwWorkflowAppLicenseId
    };
    var operationUri = webserviceurl + "/bwworkflowapplicenses/add";
    $.ajax({
        url: operationUri,
        type: "POST", timeout: ajaxTimeout,
        data: licenseDetails,
        headers: {
            "Accept": "application/json; odata=verbose"
        },
        success: function (data) {
            //displayAlertDialog('data:' + JSON.stringify(data));
            if (data.message == 'SUCCESS') {
                // The license has been assigned.
                // Add to globalLicenses.
                gWorkflowLicenseStatus = data.LicensePackageCategory; // 'gold'; // This is a global variable, and determines functionality throughout!!!!
                var tmpLicense = new Array(5);
                tmpLicense[0] = data.LicensePackageCategory;  //'gold';
                tmpLicense[1] = data.LicensePackageCategory;  //'Gold';
                tmpLicense[2] = data.bwWorkflowAppLicenseId; //licenseKey;
                tmpLicense[3] = data.LicenseClaimedTimestamp;  //'2016-6-16T4:44:32'; // This is just temporary to provide a date.
                tmpLicense[4] = getLicenseExpiryFriendlyDate(data.LicenseClaimedTimestamp); //'August 1, 2016';

                //displayAlertDialog('Developer debug point cmdAddNewLicense().1');
                globalLicenses.push(tmpLicense);
                //displayAlertDialog('Developer debug point cmdAddNewLicense().2');
                var html = '';
                for (var i = 0; i < globalLicenses.length; i++) {
                    html += '<br /><span style="cursor:pointer;" title="Click here to view your licenses..." onclick="cmdViewLicenses();"><span style="font-size:x-small;color:gray;">' + globalLicenses[i][2] + '</span>&nbsp;&nbsp;'; // The license key (guid).
                    html += '<span style="font-size:small;font-style:italic;">This ' + globalLicenses[i][1] + ' license is good until ' + globalLicenses[i][4] + '.</span></span>';
                }
                html += '';
                html += '';
                html += '';
                //displayAlertDialog('Developer debug point cmdAddNewLicense().3');
                document.getElementById('spanLicenseStatus').innerHTML = html;
                //displayAlertDialog('Developer debug point cmdAddNewLicense().4');
                document.getElementById('txtLicense').value = ''; // Clear the text box.
                //displayAlertDialog('Developer debug point cmdAddNewLicense().5');
                // Redraw the interface!
                populateStartPageItem('divWorkflowSettings', 'Reports', '');

            } else {
                // The license cannot be assigned. It may be assigned already, or some other issue.
                displayAlertDialog(data.message);
            }
        },
        error: function (data, errorCode, errorMessage) {
            displayAlertDialog('Error in my.js.cmdAddNewLicense.bwworkflowapplicenses/add(): ' + errorCode + ' ' + errorMessage);
        }
    });
}

function displayForm_DisplayCloseOut(brId) {
    // Try to close this in case it is open.
    //displayAlertDialog('displayForm_DisplayCloseOut(' + brId + ')');
    try {
        $('#ArDialog').dialog("close");
    } catch (e) {
    }

    $('#bwQuickLaunchMenuTd').css({
        width: '0'
    }); // This gets rid of the jumping around.

    $('#liNewRequest').hide();
    $('#liArchive').hide();
    $('#liSummaryReport').hide();
    $('#liConfiguration').hide();
    $('#liHelp').hide();
    $('#liWelcome').show();
    $('#liVisualizations').hide();

    var e1 = document.getElementById('divNewRequestMasterDiv');
    e1.style.borderRadius = '20px 0 0 20px';

    $('#divWelcomeMasterDivTitle').text('Closeout: ' + brId); // + budgetRequestId);

    $('#divWelcomePageLeftButtonsWelcomeButton').css({
        'height': '28px', 'width': '92%', 'white-space': 'nowrap', 'border-radius': '0 0 0 0', 'padding': '12px 0 0 20px', 'margin': '0 0 0 0', 'border-width': '0 0 0 0', 'background-color': '#6682b5', 'color': 'white', 'outline': 'none', 'cursor': 'pointer'
    });
    //$('#divMenuMasterDivWelcomeButton').click(function () {
    //    //$('#divMenuMasterDivWelcomeButton').css({ 'border-width': '0px', 'margin': '0px 0px 0px 0px', 'padding': '12px 0px 0px 20px', 'outline': 'rgb(59, 103, 142) dashed 1px', 'border-radius': '0px', 'width': '92%', 'height': '28px', 'color': '#dcdcdc', 'background-color': 'white' });
    //    //$('#divWelcomeMasterDivTitle').text('Home');
    //    renderWelcomeScreen();
    //});
    //document.getElementById('divWelcomePageLeftButtonsWelcomeButton').className = 'divLeftButton';
    //$('#divWelcomePageLeftButtonsWelcomeButton').css({ 'border-width': '0px', 'margin': '0px 0px 0px 0px', 'padding': '12px 0px 0px 20px', 'border-radius': '0px', 'width': '92%', 'height': '28px', 'color': '#dcdcdc', 'background-color': 'white' });
    $('#divWelcomePageLeftButtonsWelcomeButton').off('click').click(function () {
        renderWelcomeScreen();
    });




    var html = '<div id="myxml" align="left" style="FONT-SIZE: 10pt; FONT-FAMILY: Calibri;"></div>';
    $('#divWelcomeMessage').html(html);

    var action = "";
    //filename = budgetRequestId;
    //displayForm_DisplayArBasedOnWorkflowStatus(budgetRequestId, action, participantId);

    var operationUri = webserviceurl + "/bwbudgetrequests/" + brId;

    $.ajax({
        url: operationUri,
        method: "GET",
        headers: {
            "Accept": "application/json; odata=verbose"
        },
        success: function (data) {
            //displayAlertDialog(JSON.stringify(data.d.results[0]));
            var xml = data.d.results[0][0].CloseoutXml;



            var xslFile = "";
            xslFile = "/" + viewsFolderName + "/CloseOutEditForm.xsl";
            var file = appweburl2 + xslFile;

            //displayAlertDialog('file: ' + file);
            //displayAlertDialog('xml: ' + xml);

            var xsl = null;
            try //Internet Explorer
            {
                xsl = new ActiveXObject("Microsoft.XMLDOM");
                xsl.async = false;
                xsl.load(file);
            }
            catch (e) {
                try //Firefox, Mozilla, Opera, etc.
                {
                    xsl = document.implementation.createDocument("", "", null);
                    xsl.async = false;
                    xsl.load(file);
                }
                catch (e) {
                    try //Google Chrome
                    {
                        var xmlhttp = new window.XMLHttpRequest();
                        xmlhttp.open("GET", file, false);
                        xmlhttp.send(null);
                        xsl = xmlhttp.responseXML.documentElement;
                    }
                    catch (e) {
                        displayAlertDialog('Failure attempting to parse XSLT in the browser.');
                        WriteToErrorLog('Error in my.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Resubmit: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message + ', ' + e.stack);
                        redirectForm();
                    }
                }
            }
            var s = TransformToHtmlText(xml, xsl);

            //displayAlertDialog('xxx');
            //$('#myxml').append(s);



            $('#divWelcomeMessage').empty();
            $('#divWelcomeMessage').append(s);

            // Hook up the date pickers.
            $('#dtCloseoutDate').datepicker();
            $('#dtPlacedIntoServiceDate').datepicker();

            // Populate the dates.
            var closedOutDate = $('span[xd\\:binding = "my:coDate"]')[0].innerHTML; // Get this from the hidden field.
            document.getElementById('dtCloseoutDate').value = closedOutDate; // Put it into this field. We do it this way because the date picker is hooked up to this.
            var placedIntoServiceDate = $('span[xd\\:binding = "my:coPlacedIntoServiceDate"]')[0].innerHTML; // Get this from the hidden field.
            document.getElementById('dtPlacedIntoServiceDate').value = placedIntoServiceDate; // Put it into this field. We do it this way because the date picker is hooked up to this.


            //var xml = data.d.results[0][0].CloseoutXml;




            // format the amount.
            formatCurrency2('my:coEstimatedAmountClosed');









        },
        error: function (data, errorCode, errorMessage) {
            //handleExceptionWithAlert('Error in Start.js.displayConnectedWorkflows()', '1:' + errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in my.js.displayForm_DisplayCloseOut: ' + errorMessage);
        }
    });
}

function renderLicensesOnSettingsPage() {
    var html = '';
    if (globalLicenses.length == 0) {
        html += '<br /><span style="font-size:small;font-style:italic;">This workflow has no licenses assigned. It is currently the basic (free) version.</span>';
    } else {
        for (var i = 0; i < globalLicenses.length; i++) {
            html += '<br /><span style="cursor:pointer;" title="Click here to view your licenses..." onclick="cmdViewLicenses();"><span style="font-size:x-small;color:gray;">' + globalLicenses[i][2] + '</span>&nbsp;&nbsp;';
            html += '<span style="font-size:small;font-style:italic;">This ' + globalLicenses[i][1] + ' license is good until ' + globalLicenses[i][4] + '.</span></span>';
        }
    }
    document.getElementById('spanLicenseStatus').innerHTML = html;
}

function selectSettingsRequestTypeDropDown_Onchange(elementId) {
    try {
        console.log('In selectSettingsRequestTypeDropDown_Onchange().');
        document.getElementById(elementId).selectedIndex = 0; // This just forces it to always be the top selection for the time being.
        alert('This functionality is incomplete. Coming soon! This functionality will provide these individual settings for each budget request type.');
    } catch (e) {
        console.log('Exception in selectSettingsRequestTypeDropDown_Onchange(): ' + e.message + ', ' + e.stack);
    }
}


function renderConfigurationSettings() {
    try {
        console.log('In renderConfigurationSettings().');
        var thiz = this;

        var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
        //var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

        var workflowAppTitle = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTitle');


        var externallyFacingUrlForAttachments = $('.bwAuthentication').bwAuthentication('option', 'externallyFacingUrlForAttachments');
        var externallyFacingUrlForAttachmentsSourceFolder = $('.bwAuthentication').bwAuthentication('option', 'externallyFacingUrlForAttachmentsSourceFolder');


        debugger;
        var workflowAppFiscalYear = $('.bwAuthentication').bwAuthentication('option', 'workflowAppFiscalYear');
        var bwEnabledRequestTypes = $('.bwAuthentication').bwAuthentication('option', 'bwEnabledRequestTypes');

        var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');

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








        //var html = '';
        //html += '<table style="border-width: 0px; margin: 0px; padding: 0px; width: 100%;"><tbody><tr style="border-width: 0px; margin: 0px; padding: 0px;"><td style="border-width: 0px; margin: 0px; padding: 0px;">';



        ////var workflowTitleBlueTopHeaderBarWorkflowTitle = document.getElementsByClassName('divTopBarTextContents_WorkflowTitle');
        //html += 'Settings: <span style="font-weight:bold;color:#95b1d3;">Configure "' + workflowAppTitle + '" settings...</span>';



        //html += '</td></tr></tbody></table>';
        //$('#divPageContent3').html(html);






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
        html += '       <input id="txtWorkflowAppTitle" type="text" value="" style="width:250px;padding:5px 5px 5px 5px;" />';
        html += '       &nbsp;&nbsp;<input class="BwSmallButton" type="button" value="Publish" onclick="cmdSaveWorkflowTitle();" />';
        html += '<br />' + workflowAppId;
        html += '    </td>';
        html += '  </tr>';

        // 7-18-2023.
        html += '  <tr>';
        html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
        html += '       Organization address block for invoices xcx1237690:&nbsp;';
        html += '    </td>';
        html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
        html += '       <input id="txtWorkflowAppTitlexx" type="text" value="" style="width:250px;padding:5px 5px 5px 5px;" />';
        html += '       &nbsp;&nbsp;<input class="BwSmallButton" type="button" value="Publish" onclick="cmdSaveWorkflowTitlexx();" />';
        //html += '<br />' + workflowAppId;
        html += '    </td>';
        html += '  </tr>';

        // Organization theme/colors - bwAppThemeColorPicker.js
        html += '  <tr>';
        html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
        html += '       Organization theme/colors xcx1-3:&nbsp;';
        html += '    </td>';
        html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
        html += '       <div id="divBwAppThemeColorPicker"></div>';
        //html += '       <table style="width:100%;">';
        //html += '           <tr>';
        //html += '               <td>';
        //html += '                   <div data-original-title="" class="colorBox WorkingDayState brushedAluminum_blue"><input type="checkbox" class="invisible operationState"></div>';
        //html += '               </td>';
        //html += '               <td>';
        //html += '                   <div data-original-title="" class="colorBox WorkingDayState brushedAluminum_purple"><input type="checkbox" class="invisible operationState"></div>';
        //html += '               </td>';
        //html += '               <td>';
        //html += '                   <div data-original-title="" class="colorBox WorkingDayState brushedAluminum"><input type="checkbox" class="invisible operationState"></div>';
        //html += '               </td>';
        //html += '           </tr>';
        //html += '       </table>';
        html += '    </td>';
        html += '  </tr>';

        html += '</table>';

        // Current fiscal year
        html += '<br />';
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
        html += '       <input id="txtWorkflowAppFiscalYear" type="text" value="2021xcx353" style="width:70px;padding:5px 5px 5px 5px;" />';
        // 1-23-2022
        html += '       &nbsp;&nbsp;<input class="BwSmallButton" type="button" value="Publish" onclick="cmdSaveWorkflowFiscalYear();" />'; //cmdSaveWorkflowTitlexx();" />';
        html += '    </td>';
        html += '  </tr>';
        html += '</table>';

        if (developerModeEnabled == true) {
            // Business operating hours.
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
        }

        if (developerModeEnabled == true) {
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
        }

        // Currency symbol.
        html += '<br />';
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












        html += '<br />';












        html += '<table style="width:100%;">';
        //html += '   <tr>';
        //html += '       <td>';
        //html += '               <span style="color:black;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 35pt;font-weight:bold;">Configure "' + workflowAppTitle + '" settings...</span>'; // Velvet Morning is #95b1d3. This was the pantone color of the day for December 9, 2019! :D
        //html += '       </td>';
        //html += '       <td style="text-align:right;">';
        //html += '           <span class="printButton" title="print" onclick="cmdPrintForm();">&#x1f5a8;</span>';
        //html += '       </td>';
        //html += '   </tr>';

        // Developer mode. // developerModeEnabled // strictAuditingEnabled // bwStrictAuditingEnabled // bwDeveloperModeEnabled // updateworkflowconfigurationbehaviorstrictauditingenabled // updateworkflowconfigurationbehaviordevelopermodeenabled
        html += '<tr>';
        html += '    <td colspan="2">';
        html += '       <span style="font-size:small;font-style:italic;">This enables functionality which is not ready for general release.</span>';
        html += '    </td>';
        html += '</tr>';
        html += '<tr>';
        html += '   <td style="text-align:left;" class="bwSliderTitleCell">';
        html += '       Enable developer mode:';
        html += '   </td>';
        html += '   <td class="bwChartCalculatorLightCurrencyTableCell">';
        html += '       <label for="configurationBehaviorEnableDeveloperModeSlider"></label><input type="checkbox" name="configurationBehaviorEnableDeveloperModeSlider" id="configurationBehaviorEnableDeveloperModeSlider" />';
        html += '   </td>';
        html += '</tr>';

        html += '</table>';


        html += '<br />';



        // Allow large file uploads.
        html += '<table style="width:100%;">';
        html += '   <tr>';
        html += '       <td colspan="2">';
        html += '           <span style="font-size:small;font-style:italic;">This enables large file uploads. Due to the potential for overwhelming the system, this is being cautiously activated.</span>';
        html += '       </td>';
        html += '   </tr>';
        html += '   <tr>';
        html += '       <td style="text-align:left;" class="bwSliderTitleCell">';
        html += '           Enable large file uploads:';
        html += '       </td>';
        html += '       <td class="bwChartCalculatorLightCurrencyTableCell">';
        html += '           <label for="configurationBehaviorEnableLargeFileUploadSlider"></label><input type="checkbox" name="configurationBehaviorEnableLargeFileUploadSlider" id="configurationBehaviorEnableLargeFileUploadSlider" />';
        html += '       </td>';
        html += '   </tr>';
        html += '</table>';

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

        html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
        html += '  <tr>';
        html += '    <td>';
        html += '        &nbsp;';
        html += '    </td>';
        html += '  </tr>';
        html += '  <tr>';
        html += '    <td>';
        html += '        <span style="font-size:small;font-style:italic;">The externally facing url is a domain which is owned by the enterprise, and is routed to these servers. There is some configuration. This functionality is incomplete. Coming soon.</span>';
        html += '    </td>';
        html += '  </tr>';
        html += '</table>';

        html += '<table>';
        html += '  <tr>';
        html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
        html += '       Externally facing URL for attachments:&nbsp;';
        html += '    </td>';
        html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
        html += '       <input id="txtWorkflowAppExternallyFacingUrlForAttachments" type="text" value="" style="width:350px;padding:5px 5px 5px 5px;" />';
        html += '       &nbsp;&nbsp;<input class="BwSmallButton" type="button" value="Publish" onclick="$(\'.bwAuthentication\').bwAuthentication(\'cmdSaveWorkflowExternallyFacingUrlForAttachments\');" />';
        //html += '<br />' + workflowAppId;
        html += '    </td>';
        html += '  </tr>';

        html += '  <tr>';
        html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
        html += '       Protocol(s):&nbsp;';
        html += '    </td>';
        html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
        html += '       <input type="checkbox" checked style="cursor:pointer;" id="rbMyEmailNotificationImmediately" name="rbgMyEmailNotificationFrequency" onclick="cmdRbgMyEmailNotificationFrequency_click(\'immediately\');" />';
        html += '       <span id="spanRbEmailImmediately" style="color:gray;">Samba</span>';
        html += '       &nbsp;';
        html += '       <input type="checkbox" checked style="cursor:pointer;" id="rbMyEmailNotificationImmediately" name="rbgMyEmailNotificationFrequency" onclick="cmdRbgMyEmailNotificationFrequency_click(\'immediately\');" />';
        html += '       <span id="spanRbEmailImmediately" style="color:gray;">SCP</span>';
        html += '    </td>';
        html += '  </tr>';

        html += '  <tr>';
        html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
        html += '       Samba externally shared files (source) folder:&nbsp;';
        html += '    </td>';
        html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
        //html += '       <input id="txtWorkflowAppExternallyFacingUrlForAttachmentsSourceFolder" type="text" value="\\\\192.168.0.2\\www\\huntleysdivingandmarine.video" style="width:350px;padding:5px 5px 5px 5px;" />';
        html += '       <input id="txtWorkflowAppExternallyFacingUrlForAttachmentsSourceFolder" type="text" value="" style="width:350px;padding:5px 5px 5px 5px;" />';
        html += '       &nbsp;&nbsp;<input class="BwSmallButton" type="button" value="Publish" onclick="$(\'.bwAuthentication\').bwAuthentication(\'cmdSaveWorkflowExternallyFacingUrlForAttachmentsSourceFolder\');" />';
        html += '    </td>';
        html += '  </tr>';

        html += '  <tr>';
        html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
        html += '       SCP externally shared files (source) folder:&nbsp;';
        html += '    </td>';
        html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
        html += '       <input id="txtWorkflowAppExternallyFacingUrlForAttachmentsSourceFolderxx" type="text" value="" style="width:350px;padding:5px 5px 5px 5px;" />';
        html += '       &nbsp;&nbsp;<input class="BwSmallButton" type="button" value="Publish" onclick="$(\'.bwAuthentication\').bwAuthentication(\'cmdSaveWorkflowExternallyFacingUrlForAttachmentsSourceFolder\');" />';
        html += '    </td>';
        html += '  </tr>';

        html += '</table>';




        html += '<br />';


































        // old event: selectBudgetRequestTitleFormat

        html += '<br /><br />';

        html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
        html += '<tr>';
        html += '   <td style="text-align:left;" class="bwSliderTitleCell">';
        html += '       Selected Request Title Format: <input type="radio" name="cbRequestTitleFormat" value="default" checked /> Default    <input type="radio" name="cbRequestTitleFormat" value="custom" /> Custom';
        html += '   </td>';
        html += '</tr>';
        html += '</table>';

        html += '<table>';
        html += '  <tr>';
        html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
        html += '       Select the Request Title format:&nbsp;';
        html += '    </td>';
        html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
        html += '<br /><br />';

        html += '       <select style="padding:5px 5px 5px 5px;" id="selectBudgetRequestTitleFormaxxt">';
        html += '           <option value="[BR/SR/CP/QR/RR/RE/WO]YY#####" selected>';
        html += '               eg: BR-108-22-30C [request type abbreviation]-[classification #]-[year]-[item #][additional classification character]';
        html += '           </option>';
        html += '       </select>';

        html += '<br /><br />';
        html += 'eg: BR-108-22-30C [request type abbreviation]-[classification #]-[year]-[item #][additional classification character]';
        html += '<br /><br />';
        html += 'request type abbreviation select (BR)';
        html += '<br />';
        html += 'classification select (108)';
        html += '<br />';
        html += 'year select (22)';
        html += '<br />';
        html += 'item # (30)';
        html += '<br />';
        html += 'additional classification select (C)';
        html += '<br />';






        // Here are some ideas for the Title!
        // [BR/SR]YY#####
        // [BR/SR]#####YY
        // [AR/SR]YY#####
        // [AR/SR]#####YY
        html += '       <select style="padding:5px 5px 5px 5px;" id="selectBudgetRequestTitleFormaxxt">';
        html += '           <option value="[BR/SR/CP/QR/RR/RE/WO]YY#####" selected>[BR/SR/CP/QR/RR/RE/WO]YY#####</option>';
        html += '           <option value="[BR/SR/CP/QR/RR/RE/WO]#####YY">[BR/SR/CP/QR/RR/RE/WO]#####YY</option>';
        html += '           <option value="[BR/SR/CP/QR/RR/RE/WO]YY#####">[BR/SR/CP/QR/RR/RE/WO]YY#####</option>';
        html += '           <option value="[BR/SR/CP/QR/RR/RE/WO]#####YY">[BR/SR/CP/QR/RR/RE/WO]#####YY</option>';
        html += '       </select>';

        //html += '       &nbsp;&nbsp;<input type="button" value="Save" onclick="cmdSaveBudgetRequestTitlePrefix();" />';
        html += '    </td>';
        html += '  </tr>';
        html += '</table>';




















        if (developerModeEnabled == true) {
            // Budget request title format.
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
        }


        if (developerModeEnabled == true) {
            // Procurement.
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
        }








        if (developerModeEnabled == true) {
            //Manager title.
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
        }





        if (developerModeEnabled == true) {
            // Request types settings... a few ones here.
            html += '<br /><br />';

            html += '<table>';
            html += '<tr>';
            html += '  <td>';
            // Create the drop down at the top of the page, and select the last used option!
            //debugger;
            var requestTypes = bwEnabledRequestTypes.EnabledItems;
            //var requestTypes1 = $('.bwOrganizationEditor').bwOrganizationEditor('getBwEnabledRequestTypes'); // .EnabledItems; //this.options.bwEnabledRequestTypes.EnabledItems;
            //var requestTypes = requestTypes1.EnabledItems;

            //var bwLastSelectedNewRequestType = 'capitalplanproject';
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
                html += '<span style="font_weight:bold;color:black;"><strong>' + requestTypes[0].RequestType + '</strong></span>';
            } else { // There is more than 1, so we have to display as a drop down.
                html += '<span style="font_weight:bold;color:black;"><strong>';
                html += '   <select id="selectSettingsRequestTypeDropDown" onchange="selectSettingsRequestTypeDropDown_Onchange(\'selectSettingsRequestTypeDropDown\');" style=\'border-color: whitesmoke; color: rgb(38, 38, 38); font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 14pt; font-weight: bold; cursor: pointer;\'>'; // was .5em
                html += '<option value="' + 'All request types' + '" selected >' + 'All request types' + '</option>';
                for (var i = 0; i < requestTypes.length; i++) {
                    if (requestTypes[i].Abbreviation == bwLastSelectedNewRequestType) { // Selected
                        html += '<option value="' + requestTypes[i].Abbreviation + '" selected >' + requestTypes[i].RequestType + '</option>';
                    } else { // Not selected
                        html += '<option value="' + requestTypes[i].Abbreviation + '">' + requestTypes[i].RequestType + '</option>';
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
        }



        html += '<br /><br />';




















        html += '<table>';

        if (developerModeEnabled == true) {

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
            if (gWorkflowLicenseStatus == 'bronze' || gWorkflowLicenseStatus == 'silver' || gWorkflowLicenseStatus == 'gold') {
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
            }


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
            if (gWorkflowLicenseStatus == 'gold') {
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
            }


            html += '<tr>';
            html += '   <td style="text-align:left;" class="bwSliderTitleCell">';
            html += '       Enable closeouts:';
            html += '   </td>';
            html += '   <td class="bwChartCalculatorLightCurrencyTableCell">';
            html += '       <label for="configurationBehaviorEnableCloseOutsSlider"></label><input type="checkbox" name="configurationBehaviorEnableCloseOutsSlider" id="configurationBehaviorEnableCloseOutsSlider" />';
            html += '   </td>';
            html += '</tr>';
            html += '<tr><td>&nbsp;</td><td></td></tr>';



            if (gWorkflowLicenseStatus == 'gold') {
                // Strict auditing controls.
                html += '<tr>';
                html += '    <td colspan="2">';
                html += '       <span style="font-size:small;font-style:italic;">This ensures that deleted items are retained for future reference. This functionality is incomplete. Coming soon!</span>';
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


            }


        }

        //html += '<tr><td>&nbsp;</td><td></td></tr>';




        html += '</table>';


        // "Deleted Requests" email template.
        html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
        html += '  <tr>';
        html += '    <td>';
        html += '        &nbsp;';
        html += '    </td>';
        html += '  </tr>';
        html += '  <tr>';
        html += '    <td>';
        html += '        <span style="font-size:small;font-style:italic;">This organization\'s custom email for deleted requests.</span>';
        html += '    </td>';
        html += '  </tr>';
        html += '</table>';
        html += '<table>';
        html += '  <tr>';
        html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
        html += '       "Deleted Requests" email template:&nbsp;';
        html += '    </td>';
        html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
        html += '       <span xcx="xcx123424" class="spanButton" onclick="$(\'.bwEmailEditor_DeletedRequest\').bwEmailEditor_DeletedRequest(\'displayConfigureIntroductoryEmailDialog\', \'Create\');"><span style="font-size:15pt;display:inline-block;">✉</span> Configure "A request has been deleted" email&nbsp;&nbsp;</span>';
        html += '    </td>';
        html += '  </tr>';
        html += '</table>';

        html += '<div id="divBwEmailEditor_DeletedRequest">[divBwEmailEditor_DeletedRequest]</div>';



        //html += '<br /><br />';



        // "Reverted Requests" email template.
        html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
        html += '  <tr>';
        html += '    <td>';
        html += '        &nbsp;';
        html += '    </td>';
        html += '  </tr>';
        html += '  <tr>';
        html += '    <td>';
        html += '        <span style="font-size:small;font-style:italic;">This organization\'s custom email for rolled-back tasks.</span>';
        html += '    </td>';
        html += '  </tr>';
        html += '</table>';
        html += '<table>';
        html += '  <tr>';
        html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
        html += '       "Rolled-Back Tasks" email template:&nbsp;';
        html += '    </td>';
        html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
        //html += '       <span xcx="xcx123424" class="spanButton" onclick="$(\'.bwEmailEditor_DeletedRequest\').bwEmailEditor_DeletedRequest(\'displayConfigureIntroductoryEmailDialog\', \'Create\');"><span style="font-size:15pt;display:inline-block;">✉</span> Configure "A request has been deleted" email&nbsp;&nbsp;</span>';
        html += '       <span xcx="xcx123424" class="spanButton" onclick="$(\'.bwEmailEditor_RevertedRequest\').bwEmailEditor_RevertedRequest(\'displayConfigureIntroductoryEmailDialog\', \'Create\');"><span style="font-size:15pt;display:inline-block;">✉</span> Configure "A task has been rolled-back" email&nbsp;&nbsp;</span>';
        html += '    </td>';
        html += '  </tr>';
        html += '</table>';

        html += '<div id="divBwEmailEditor_RevertedRequest">[divBwEmailEditor_RevertedRequest]</div>';



        html += '<br /><br />';





















        // Request Type section.
        html += '<div id="divBwRequestTypeEditor"></div>';
        html += '<br /><br />';

        // Project Type section.
        html += '<br />';
        html += '<div id="divBwProjectTypeEditor"></div>';
        html += '<br /><br />';

        // Pillar Type section.
        html += '<div id="divBwPillarTypeEditor"></div>';
        html += '<br /><br />';


        if (developerModeEnabled == true) {
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
        }








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
        $('#divPageContent3').append(html);

        $('#divBwEmailEditor_DeletedRequest').bwEmailEditor_DeletedRequest({});

        $('#divBwEmailEditor_RevertedRequest').bwEmailEditor_RevertedRequest({});

        var requestTypeEditorOptions = {};
        $('#divBwRequestTypeEditor').bwRequestTypeEditor(requestTypeEditorOptions);

        if (developerModeEnabled == true) {
            var projectTypeEditorOptions = {};
            $('#divBwProjectTypeEditor').bwProjectTypeEditor(projectTypeEditorOptions);
        }

        if (developerModeEnabled == true) {
            var pillarTypeEditorOptions = {};
            $('#divBwPillarTypeEditor').bwPillarTypeEditor(pillarTypeEditorOptions);
        }

        if (developerModeEnabled == true) {
            var operationalHoursOptions = {};
            $('#divBwOperationalHours').bwOperationalHours(operationalHoursOptions);
        }

        $('#divBwAppThemeColorPicker').bwAppThemeColorPicker({});


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



        //debugger; // 12-13-2021 Commented out this try/catch section. I think we don't need it any more.
        try {
            //var configurationBehaviorEnableBudgetRequestsOptions = {
            //    checked: bwEnabledRequestTypes.Details.BudgetRequests.Enabled, //quotingEnabled,
            //    show_labels: true,         // Should we show the on and off labels?
            //    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
            //    on_label: "YES",            // Text to be displayed when checked
            //    off_label: "NO",          // Text to be displayed when unchecked
            //    width: 50,                 // Width of the button in pixels
            //    height: 22,                // Height of the button in pixels
            //    button_width: 24,         // Width of the sliding part in pixels
            //    clear_after: null         // Override the element after which the clearing div should be inserted 
            //};
            //$("input#configurationBehaviorEnableBudgetRequestsSlider").switchButton(configurationBehaviorEnableBudgetRequestsOptions);

            //var configurationBehaviorEnableCapitalPlanProjectsOptions = {
            //    checked: bwEnabledRequestTypes.Details.CapitalPlanProjects.Enabled, //quotingEnabled,
            //    show_labels: true,         // Should we show the on and off labels?
            //    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
            //    on_label: "YES",            // Text to be displayed when checked
            //    off_label: "NO",          // Text to be displayed when unchecked
            //    width: 50,                 // Width of the button in pixels
            //    height: 22,                // Height of the button in pixels
            //    button_width: 24,         // Width of the sliding part in pixels
            //    clear_after: null         // Override the element after which the clearing div should be inserted 
            //};
            //$("input#configurationBehaviorEnableCapitalPlanProjectsSlider").switchButton(configurationBehaviorEnableCapitalPlanProjectsOptions);

            //var configurationBehaviorEnableQuotingOptions = {
            //    checked: bwEnabledRequestTypes.Details.QuoteRequests.Enabled, //quotingEnabled,
            //    show_labels: true,         // Should we show the on and off labels?
            //    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
            //    on_label: "YES",            // Text to be displayed when checked
            //    off_label: "NO",          // Text to be displayed when unchecked
            //    width: 50,                 // Width of the button in pixels
            //    height: 22,                // Height of the button in pixels
            //    button_width: 24,         // Width of the sliding part in pixels
            //    clear_after: null         // Override the element after which the clearing div should be inserted 
            //};
            //$("input#configurationBehaviorEnableQuotingSlider").switchButton(configurationBehaviorEnableQuotingOptions);


            //var configurationBehaviorEnableReimbursementRequestsOptions = {
            //    checked: bwEnabledRequestTypes.Details.ReimbursementRequests.Enabled, //reimbursementRequestsEnabled,
            //    show_labels: true,         // Should we show the on and off labels?
            //    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
            //    on_label: "YES",            // Text to be displayed when checked
            //    off_label: "NO",          // Text to be displayed when unchecked
            //    width: 50,                 // Width of the button in pixels
            //    height: 22,                // Height of the button in pixels
            //    button_width: 24,         // Width of the sliding part in pixels
            //    clear_after: null         // Override the element after which the clearing div should be inserted 
            //};
            //$("input#configurationBehaviorEnableReimbursementRequestsSlider").switchButton(configurationBehaviorEnableReimbursementRequestsOptions);

            //var configurationBehaviorEnableRecurringExpensesOptions = {
            //    checked: bwEnabledRequestTypes.Details.RecurringExpenses.Enabled, //recurringExpensesEnabled,
            //    show_labels: true,         // Should we show the on and off labels?
            //    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
            //    on_label: "YES",            // Text to be displayed when checked
            //    off_label: "NO",          // Text to be displayed when unchecked
            //    width: 50,                 // Width of the button in pixels
            //    height: 22,                // Height of the button in pixels
            //    button_width: 24,         // Width of the sliding part in pixels
            //    clear_after: null         // Override the element after which the clearing div should be inserted 
            //};
            //$("input#configurationBehaviorEnableRecurringExpensesSlider").switchButton(configurationBehaviorEnableRecurringExpensesOptions);

            //var configurationBehaviorEnableWorkOrdersOptions = {
            //    checked: bwEnabledRequestTypes.Details.WorkOrders.Enabled, //recurringExpensesEnabled,
            //    show_labels: true,         // Should we show the on and off labels?
            //    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
            //    on_label: "YES",            // Text to be displayed when checked
            //    off_label: "NO",          // Text to be displayed when unchecked
            //    width: 50,                 // Width of the button in pixels
            //    height: 22,                // Height of the button in pixels
            //    button_width: 24,         // Width of the sliding part in pixels
            //    clear_after: null         // Override the element after which the clearing div should be inserted 
            //};
            //$("input#configurationBehaviorEnableWorkOrdersSlider").switchButton(configurationBehaviorEnableWorkOrdersOptions);
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

        var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');
        var configurationBehaviorEnableDeveloperModeOptions = {
            checked: developerModeEnabled,
            show_labels: true,         // Should we show the on and off labels?
            labels_placement: "left",  // Position of the labels: "both", "left" or "right"
            on_label: "YES",            // Text to be displayed when checked
            off_label: "NO",          // Text to be displayed when unchecked
            width: 50,                 // Width of the button in pixels
            height: 22,                // Height of the button in pixels
            button_width: 24,         // Width of the sliding part in pixels
            clear_after: null         // Override the element after which the clearing div should be inserted 
        };
        $("input#configurationBehaviorEnableDeveloperModeSlider").switchButton(configurationBehaviorEnableDeveloperModeOptions);


        var largeFileUploadEnabled = $('.bwAuthentication').bwAuthentication('option', 'largeFileUploadEnabled');
        var configurationBehaviorEnableLargeFileUploadOptions = {
            checked: largeFileUploadEnabled,
            show_labels: true,         // Should we show the on and off labels?
            labels_placement: "left",  // Position of the labels: "both", "left" or "right"
            on_label: "YES",            // Text to be displayed when checked
            off_label: "NO",          // Text to be displayed when unchecked
            width: 50,                 // Width of the button in pixels
            height: 22,                // Height of the button in pixels
            button_width: 24,         // Width of the sliding part in pixels
            clear_after: null         // Override the element after which the clearing div should be inserted 
        };
        $("input#configurationBehaviorEnableLargeFileUploadSlider").switchButton(configurationBehaviorEnableLargeFileUploadOptions);

        document.getElementById('selectBudgetRequestCurrencySymbol').value = selectedCurrencySymbol;

        $('#txtWorkflowAppTitle').val(workflowAppTitle);

        debugger;
        $('#txtWorkflowAppFiscalYear').val(workflowAppFiscalYear); // 1-24-2022
        $('#txtWorkflowAppTitle_GetSharePointData').val(workflowAppTitle);
        $('#txtWorkflowAppTitle_Theme').val(workflowAppTitle);


        $('#txtWorkflowAppExternallyFacingUrlForAttachments').val(externallyFacingUrlForAttachments); // 6-29-2022
        $('#txtWorkflowAppExternallyFacingUrlForAttachmentsSourceFolder').val(externallyFacingUrlForAttachmentsSourceFolder); // 6-29-2022

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
                    $("input#configurationBehaviorEnableReimbursementRequestsSlider").switchButton({
                        checked: false
                    });
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
                    $("input#configurationBehaviorEnableNewRequestAttachmentsSlider").switchButton({
                        checked: true
                    });
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

        $('#configurationBehaviorEnableDeveloperModeSlider').change(function () {
            debugger;
            // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
            var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');

            if (developerModeEnabled == true) developerModeEnabled = false;
            else developerModeEnabled = true;

            var _workflowDetails = [];
            _workflowDetails = {
                bwWorkflowAppId: workflowAppId,
                bwDeveloperModeEnabled: developerModeEnabled.toString() // bwStrictAuditingEnabled
            };
            var operationUri = webserviceurl + "/bwworkflow/updateworkflowconfigurationbehaviordevelopermodeenabled"; // updateworkflowconfigurationbehaviorstrictauditingenabled
            $.ajax({
                url: operationUri,
                type: "POST",
                data: _workflowDetails,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    if (data != 'SUCCESS') {
                        displayAlertDialog(data);
                    } else {

                        //$('.bwAuthentication').bwAuthentication({ developerModeEnabled: developerModeEnabled });

                        // Apply Workflow configurations to the display.
                        //displayAlertDialog('This functionality is incomplete. Coming soon! my.js.configurationBehaviorEnableDeveloperModeSlider.change().');
                        displayAlertDialog('The Developer Mode setting has been changed. You will have to reload/refresh the web browser, and log in again for it to take effect.');
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in my.js.configurationBehaviorEnableDeveloperModeSlider.change(): ' + errorCode + ' ' + errorMessage);
                }
            });
        });

        $('#configurationBehaviorEnableLargeFileUploadSlider').change(function () {
            debugger;
            // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
            // if (userData.participant.participantWorkflowApps[wa].bwLargeFileUploadEnabled == 'true') {
            //thiz.options.largeFileUploadEnabled = true;
            var largeFileUploadEnabled = $('.bwAuthentication').bwAuthentication('option', 'largeFileUploadEnabled');

            if (largeFileUploadEnabled == true) largeFileUploadEnabled = false;
            else largeFileUploadEnabled = true;

            var _workflowDetails = [];
            _workflowDetails = {
                bwWorkflowAppId: workflowAppId,
                bwLargeFileUploadEnabled: largeFileUploadEnabled.toString() // bwStrictAuditingEnabled
            };
            var operationUri = webserviceurl + "/bwworkflow/updateworkflowconfigurationbehaviorlargefileuploadenabled"; // updateworkflowconfigurationbehaviorstrictauditingenabled
            $.ajax({
                url: operationUri,
                type: "POST",
                data: _workflowDetails,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    if (data != 'SUCCESS') {
                        displayAlertDialog(data);
                    } else {

                        //$('.bwAuthentication').bwAuthentication({ developerModeEnabled: developerModeEnabled });

                        // Apply Workflow configurations to the display.
                        //displayAlertDialog('This functionality is incomplete. Coming soon! my.js.configurationBehaviorEnableDeveloperModeSlider.change().');
                        displayAlertDialog('The Large File Upload setting has been changed.');
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in my.js.configurationBehaviorEnableLargeFileUploadSlider.change(): ' + errorCode + ' ' + errorMessage);
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
                    if (document.getElementById('spanSaveAccountingDepartmentUserButton')) document.getElementById('spanSaveAccountingDepartmentUserButton').innerHTML = html;
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

function cmdSaveWorkflowTitle() {
    try {
        console.log('In cmdSaveWorkflowTitle().');

        var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
        var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
        var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

        var newWorkflowTitle = document.getElementById('txtWorkflowAppTitle').value;
        var data = [];
        data = {
            bwTenantId: tenantId,
            bwWorkflowAppId: workflowAppId,
            bwWorkflowAppTitle: newWorkflowTitle,
            ModifiedByFriendlyName: participantFriendlyName,
            ModifiedById: participantId,
            ModifiedByEmail: participantEmail
        };
        var operationUri = webserviceurl + "/bwworkflowapp/updateworkflowconfigurationworkflowapptitle";
        $.ajax({
            url: operationUri,
            type: "POST",
            data: data,
            headers: {
                "Accept": "application/json; odata=verbose"
            },
            success: function (data) {
                try {
                    debugger;
                    if (data != 'SUCCESS') {
                        displayAlertDialog('updateworkflowconfigurationworkflowapptitle failed: ' + JSON.stringify(data));
                    } else {
                        workflowAppTitle = newWorkflowTitle;

                        $('#divTopBar_OrganizationName').html(workflowAppTitle);

                        displayAlertDialog('The name of your organization has been updated successfully.'); // to "' + newWorkflowTitle + '".');

                    }
                } catch (e) {
                    console.log('Exception in cmdSaveWorkflowTitle():2: ' + e.message + ', ' + e.stack);
                    displayAlertTitle('Exception in cmdSaveWorkflowTitle():2: ' + e.message + ', ' + e.stack);
                }
            },
            error: function (data, errorCode, errorMessage) {
                console.log('Error in my.js.cmdSaveWorkflowTitle(): ' + errorCode + ' ' + errorMessage);
                displayAlertDialog('Error in my.js.cmdSaveWorkflowTitle(): ' + errorCode + ' ' + errorMessage);
            }
        });
    } catch (e) {
        console.log('Exception in cmdSaveWorkflowTitle(): ' + e.message + ', ' + e.stack);
        displayAlertDialog('Exception in cmdSaveWorkflowTitle(): ' + e.message + ', ' + e.stack);
    }
}

function cmdSaveWorkflowFiscalYear() {
    try {
        console.log('In cmdSaveWorkflowFiscalYear().');

        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
        var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
        var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

        var newFiscalYear = document.getElementById('txtWorkflowAppFiscalYear').value;
        var data = [];
        data = {
            bwWorkflowAppId: workflowAppId,
            bwFiscalYear: newFiscalYear,
            ModifiedByFriendlyName: participantFriendlyName,
            ModifiedById: participantId,
            ModifiedByEmail: participantEmail
        };
        var operationUri = webserviceurl + "/bwworkflowapp/updateworkflowconfigurationworkflowfiscalyear";
        $.ajax({
            url: operationUri,
            type: "POST",
            data: data,
            headers: {
                "Accept": "application/json; odata=verbose"
            },
            success: function (result) {
                try {
                    debugger;
                    if (result.message != 'SUCCESS') {
                        console.log('updateworkflowconfigurationworkflowfiscalyear failed: ' + JSON.stringify(result));
                        displayAlertDialog('updateworkflowconfigurationworkflowfiscalyear failed: ' + JSON.stringify(result));
                    } else {
                        $('.bwAuthentication').bwAuthentication({ fiscalYear: newFiscalYear });
                        displayAlertDialog('The fiscal year for your organization has been updated successfully.');
                    }
                } catch (e) {
                    console.log('Exception in cmdSaveWorkflowFiscalYear():2: ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in cmdSaveWorkflowFiscalYear():2: ' + e.message + ', ' + e.stack);
                }
            },
            error: function (data, errorCode, errorMessage) {
                console.log('Error in my.js.cmdSaveWorkflowFiscalYear(): ' + errorCode + ' ' + errorMessage);
                displayAlertDialog('Error in my.js.cmdSaveWorkflowFiscalYear(): ' + errorCode + ' ' + errorMessage);
            }
        });
    } catch (e) {
        console.log('Exception in cmdSaveWorkflowFiscalYear(): ' + e.message + ', ' + e.stack);
        displayAlertDialog('Exception in cmdSaveWorkflowFiscalYear(): ' + e.message + ', ' + e.stack);
    }
}

function cmdGetSharePointData() {
    try {
        console.log('In cmdGetSharePointData().');
        //alert('In cmdGetSharePointData().');


        var operationUri = "https://makopros.sharepoint.com/sites/iTapeDevelopment/_api/web/lists/getbytitle('Employees1')/items"; //_spPageContextInfo.webAbsoluteUrl;

        //var operationUri = "https://makopros.sharepoint.com/sites/iTapeDevelopment/_api/web/getsubwebsfilteredforcurrentuser(nwebtemplatefilter=-1,nconfigurationfilter=0)?$select=Title";


        $.ajax({
            url: operationUri, //siteurl + "/_api/web/lists/getbytitle('Projects')/items",
            method: "GET",
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                //debugger;
                if (data.d.results.length > 0) {
                    //This section can be used to iterate through data and show it on screen
                }
            },
            error: function (data) {
                //debugger;
                displayAlertDialog("Error in cmdGetSharePointData(): " + JSON.stringify(data));
            }
        });


    } catch (e) {
        console.log('Exception in cmdGetSharePointData(): ' + e.message + ', ' + e.stack);
    }
}

function cmdSaveBudgetRequestTitlePrefix() {
    displayAlertDialog('This functionality is incomplete. Coming soon! my.js.cmdSaveBudgetRequestTitlePrefix().');
    // Note: If there are existing budget requests, do we have to go back and rename them? Probably!!!
}

function cmdSaveNewRequestManagerTitle() {
    var managerTitle = document.getElementById('NewBudgetRequestManagerTitle').value;
    var data = [];
    data = {
        bwTenantId: tenantId,
        bwWorkflowAppId: workflowAppId,
        bwNewBudgetRequestManagerTitle: managerTitle
    };
    var operationUri = webserviceurl + "/bwworkflowapp/updateworkflowconfigurationnewbudgetrequestmanagertitle";
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
                newBudgetRequestManagerTitle = managerTitle;
            }
        },
        error: function (data, errorCode, errorMessage) {
            displayAlertDialog('Error in my.js.cmdSaveNewRequestManagerTitle(): ' + errorCode + ' ' + errorMessage);
        }
    });
}

function cmdRbgMyEmailNotificationTypes_click(message) {
    //displayAlertDialog('cmdRbgMyEmailNotificationTypes_click');
    // The configuration setting has been changed.
    emailNotificationTypes = message;
    var _userDetails = [];
    _userDetails = {
        bwParticipantId: participantId,
        bwEmailNotificationTypes: message
    };
    var operationUri = webserviceurl + "/bwparticipant/updateuserconfigurationbehaviorEmailNotificationTypes"; //"/bwparticipant/updateuserconfigurationbehaviorEmailNotificationLevel";
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
                if (message == 'allnotifications') {
                    // Disable the other section.
                    document.getElementById('spanEmailNotificationTypeAllNotifications').style.color = 'black';
                    document.getElementById('spanEmailNotificationTypeOnlyTasks').style.color = 'gray';
                    document.getElementById('spanEmailNotificationTypeNoNotifications').style.color = 'gray';
                    //document.getElementById('rbMyEmailNotificationTypeAllNotifications').setAttribute('checked', 'checked');
                } else if (message == 'onlymytasknotifications') {
                    // Enable the time selectors so that they can be changed.
                    document.getElementById('spanEmailNotificationTypeAllNotifications').style.color = 'gray';
                    document.getElementById('spanEmailNotificationTypeOnlyTasks').style.color = 'black';
                    document.getElementById('spanEmailNotificationTypeNoNotifications').style.color = 'gray';
                    //document.getElementById('rbMyEmailNotificationTypeOnlyTasks').setAttribute('checked', 'checked');
                } else if (message == 'nonotifications') {
                    // Enable the time selectors so that they can be changed.
                    document.getElementById('spanEmailNotificationTypeAllNotifications').style.color = 'gray';
                    document.getElementById('spanEmailNotificationTypeOnlyTasks').style.color = 'gray';
                    document.getElementById('spanEmailNotificationTypeNoNotifications').style.color = 'black';
                    //document.getElementById('rbMyEmailNotificationTypeNoNotifications').setAttribute('checked', 'checked');
                }
            }
        },
        error: function (data, errorCode, errorMessage) {
            displayAlertDialog('Error in my.js.cmdRbgMyEmailNotificationTypes_click(): ' + errorCode + ' ' + errorMessage);
        }
    });
}

function cmdRbgMyEmailNotificationFrequency_click(emailNotificationFrequency) {
    // The configuration setting has been changed.
    try {
        console.log('In cmdRbgMyEmailNotificationFrequency_click(). emailNotificationFrequency: ' + emailNotificationFrequency);

        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

        //// divWorkingOnItDialog
        //$("#divWorkingOnItDialog").dialog({
        //    modal: true,
        //    resizable: false,
        //    //closeText: "Cancel",
        //    closeOnEscape: false, // Hit the ESC key to hide! Yeah!
        //    title: 'Working on it...',
        //    width: "800",
        //    dialogClass: "no-close", // No close button in the upper right corner.
        //    hide: false//, // This means when hiding just disappear with no effects.
        //    //buttons: {
        //    //    "Close": function () {
        //    //        $(this).dialog("close");
        //    //    }
        //    //}
        //});

        //$("#divWorkingOnItDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

        emailAggregatorTwiceDailyFirstTime = document.getElementById('selectAggregateEmailTwiceDailyFirstTime').value;
        emailAggregatorTwiceDailySecondTime = document.getElementById('selectAggregateEmailTwiceDailySecondTime').value;
        emailAggregatorTwiceDailyTimezoneDisplayName = document.getElementById('selectAggregateEmailTwiceDailyTimezoneDisplayName').value;

        var _userDetails = {
            bwWorkflowAppId: workflowAppId,
            bwParticipantId: participantId,
            bwEmailNotificationFrequency: emailNotificationFrequency,
            bwEmailAggregatorTwiceDailyFirstTime: emailAggregatorTwiceDailyFirstTime,
            bwEmailAggregatorTwiceDailySecondTime: emailAggregatorTwiceDailySecondTime,
            bwEmailAggregatorTwiceDailyTimezoneDisplayName: emailAggregatorTwiceDailyTimezoneDisplayName
        };
        var operationUri = webserviceurl + "/bwparticipant/updateuserconfigurationbehavioremailnotificationfrequency";
        $.ajax({
            url: operationUri,
            type: "POST",
            data: _userDetails,
            headers: {
                "Accept": "application/json; odata=verbose"
            },
            success: function (data) {
                try {
                    //$('#divWorkingOnItDialog').dialog('close'); // Close the create your account dialog.
                    if (data.message != 'SUCCESS') {
                        displayAlertDialog(data.message);
                        if (emailNotificationFrequency == 'immediately') {
                            // Disable the other section.
                            document.getElementById('spanRbEmailImmediately').style.color = 'black';
                            document.getElementById('spanRbAggregateEmailTwiceDaily').style.color = 'gray';
                            document.getElementById('selectAggregateEmailTwiceDailyFirstTime').disabled = true;
                            document.getElementById('selectAggregateEmailTwiceDailySecondTime').disabled = true;
                            document.getElementById('selectAggregateEmailTwiceDailyTimezoneDisplayName').disabled = true;
                        } else if (emailNotificationFrequency == 'aggregatetwicedaily') {
                            // Enable the time selectors so that they can be changed.
                            document.getElementById('spanRbEmailImmediately').style.color = 'gray';
                            document.getElementById('spanRbAggregateEmailTwiceDaily').style.color = 'black';
                            document.getElementById('selectAggregateEmailTwiceDailyFirstTime').disabled = false;
                            document.getElementById('selectAggregateEmailTwiceDailySecondTime').disabled = false;
                            document.getElementById('selectAggregateEmailTwiceDailyTimezoneDisplayName').disabled = false;
                        }
                    } else {
                        //displayAlertDialog(message);
                        if (emailNotificationFrequency == 'immediately') {
                            // Disable the other section.
                            document.getElementById('spanRbEmailImmediately').style.color = 'black';
                            document.getElementById('spanRbAggregateEmailTwiceDaily').style.color = 'gray';
                            document.getElementById('selectAggregateEmailTwiceDailyFirstTime').disabled = true;
                            document.getElementById('selectAggregateEmailTwiceDailySecondTime').disabled = true;
                            document.getElementById('selectAggregateEmailTwiceDailyTimezoneDisplayName').disabled = true;
                        } else if (emailNotificationFrequency == 'aggregatetwicedaily') {
                            // Enable the time selectors so that they can be changed.
                            document.getElementById('spanRbEmailImmediately').style.color = 'gray';
                            document.getElementById('spanRbAggregateEmailTwiceDaily').style.color = 'black';
                            document.getElementById('selectAggregateEmailTwiceDailyFirstTime').disabled = false;
                            document.getElementById('selectAggregateEmailTwiceDailySecondTime').disabled = false;
                            document.getElementById('selectAggregateEmailTwiceDailyTimezoneDisplayName').disabled = false;
                        }
                    }
                } catch (e) {
                    console.log('Exception in cmdRbgMyEmailNotificationFrequency_click():2: ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in cmdRbgMyEmailNotificationFrequency_click():2: ' + e.message + ', ' + e.stack);
                }
            },
            error: function (data, errorCode, errorMessage) {
                console.log('Error in my.js.cmdRbgMyEmailNotificationFrequency_click(): ' + errorCode + ' ' + errorMessage);
                displayAlertDialog('Error in my.js.cmdRbgMyEmailNotificationFrequency_click(): ' + errorCode + ' ' + errorMessage);
            }
        });
    } catch (e) {
        console.log('Exception in cmdRbgMyEmailNotificationFrequency_click(): ' + e.message + ', ' + e.stack);
        displayAlertDialog('Exception in cmdRbgMyEmailNotificationFrequency_click(): ' + e.message + ', ' + e.stack);
    }
}

function cmdAddAWorkflowApp() {
    // This is called from the Configuration > New Workflow button.
    var proceed = confirm('Creating new workflow. \n\n\nClick the OK button to proceed...');
    if (proceed) {
        var data = {
            "bwParticipantId": participantId,
            "participantFriendlyName": participantFriendlyName,
            "participantEmail": participantEmail,
            "bwParticipantLogonType": participantLogonType,
            "bwTenantId": tenantId
        };
        $.ajax({
            url: webserviceurl + "/bwworkflowapps/addaworkflow",
            type: "PUT",
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (data) {
                //debugger; // workflowAppId check. xcx4
                workflowAppId = data.workflowAppId;
                //debugger;
                $('#divRequest').bwRequest('option', 'workflowAppId', workflowAppId);
                //debugger; // IS THSI RIGHT???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
                workflowAppTitle = data.workflowAppTitle;
                displayAlertDialog(data.message); // This extra alert dialog is just annoying. The UI adds a button so that should be enough visual confirmation.


                //debugger;
                generateConfigurationLeftSideMenu();


                // TODD: WE NEED TO REGENERATE selectHomePageWorkflowAppDropDown HERE SOMEWHERE!!!!

                //debugger;
                populateStartPageItem('divConfiguration', 'Reports', '');
            },
            error: function (data, errorCode, errorMessage) {
                displayAlertDialog('Error in my.js.cmdAddAWorkflowApp():' + errorCode + ', ' + errorMessage + '::' + JSON.stringify(data));
            }
        });
    }
}

function cmdPurchaseBronzePackage() {
    //window.location = 'http://budgetworkflow.com/shop/bronze';
    var url = 'http://budgetworkflow.com/shop/bronze';
    window.open(url);
}

function cmdPurchaseSilverPackage() {
    //window.location = 'http://budgetworkflow.com/shop/silver';
    var url = 'http://budgetworkflow.com/shop/silver';
    window.open(url);
}

function cmdPurchaseGoldPackage() {
    //window.location = 'http://budgetworkflow.com/shop/gold';
    var url = 'http://budgetworkflow.com/shop/gold';
    window.open(url);
}

function cmdUpgradeAndPricingOptions2() {
    try {
        // This is called from the user drop down, and lets the user change things like their email address.
        try {
            $('#bwLoggedInUserDropDown').dialog("close");
        } catch (e) {
        }

        // This is our Upgrade and Pricing Options screen.
        var html = '';
        html += '<span style="color: rgb(63, 63, 63); font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif; font-size: 22pt;"><strong>You can upgrade from the free Budget Workflow</strong></span><br />';
        html += '<br />';
        html += '<div style="color: rgb(63, 63, 63); font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif; font-size: 12pt;">';
        html += '    <table>';
        html += '        <tr>';
        html += '            <td style="background-color:#6682b5;color:white;padding:4px 20px 7px 15px;">';
        html += '                Basic - This is the free version.';
        html += '            </td>';
        html += '        </tr>';
        html += '        <tr>';
        html += '            <td>';
        html += '                <ul>';
        html += '                    <li>5 budget request views per month</li>';
        html += '                    <li>Purchase order numbers tie into your existing accounting system.</li>';
        html += '                    <li>Add 5 budget request views a month for $9.99.</li>';
        html += '                </ul>';
        html += '            </td>';
        html += '        </tr>';
        html += '        <tr><td>&nbsp;</td></tr>';
        html += '        <tr>';
        html += '            <td class="tdPurchaseBronzePackage" style="color:white;padding:4px 20px 7px 15px;">';
        html += '                Bronze - CAPEX. $9.99/year.&nbsp;';
        html += '                <span style="text-align:right;"><input type="button" value="Upgrade Now" onclick="cmdPurchaseBronzePackage();" style="cursor:pointer;padding:5px 10px 5px 10px;"/></span>';
        //html += '                <span style="text-align:right;"><input type="button" value="Upgrade Now" onclick="cmdPurchaseBronzePackage();" style="cursor:pointer;"/></span>';
        html += '            </td>';
        html += '        </tr>';
        html += '        <tr>';
        html += '            <td>';
        html += '                <ul>';
        html += '                    <li>Everything the free package has, plus capital and expense tracking.</li>';
        html += '                    <li>5 budget request views per month</li>';
        html += '                    <li>Add 5 budget request views a month for $9.99.</li>';
        html += '                </ul>';
        html += '            </td>';
        html += '        </tr>';
        html += '        <tr><td>&nbsp;</td></tr>';
        html += '        <tr>';
        html += '            <td class="tdPurchaseSilverPackage" style="padding:4px 20px 7px 15px;">';
        html += '                Silver - CAPEX + OPEX. $99.99/year.&nbsp;';
        html += '                <span style="text-align:right;"><input type="button" value="Upgrade Now" onclick="cmdPurchaseSilverPackage();" style="cursor:pointer;padding:5px 10px 5px 10px;"/></span>';
        html += '            </td>';
        html += '        </tr>';
        html += '        <tr>';
        html += '            <td>';
        html += '                <ul>';
        html += '                    <li>Everything the Bronze package has, plus recurring expenses.</li>';
        html += '                    <li>5 budget request views per month</li>';
        html += '                    <li>Add 5 budget request views a month for $9.99.</li>';
        html += '                </ul>';
        html += '            </td>';
        html += '        </tr>';
        html += '        <tr><td>&nbsp;</td></tr>';
        html += '        <tr>';
        html += '            <td class="tdPurchaseGoldPackage" style="padding:4px 20px 7px 15px;">';
        html += '                Gold - CAPEX + OPEX + Supplementals. $199.99/year.&nbsp;';
        html += '                <span style="text-align:right;"><input type="button" value="Upgrade Now" onclick="cmdPurchaseGoldPackage();" style="cursor:pointer;padding:5px 10px 5px 10px;"/></span>';
        html += '            </td>';
        html += '        </tr>';
        html += '        <tr>';
        html += '            <td>';
        html += '                <ul>';
        html += '                    <li>Everything the other packages have, plus the ability to add supplemental requests.</li>';
        html += '                    <li>5 budget request views per month</li>';
        html += '                    <li>Add 25 budget or supplemental requests a month for $9.99.</li>';
        html += '                </ul>';
        html += '            </td>';
        html += '        </tr>';
        html += '    </table>';
        html += '    <br />';
        //html += '    <a href="http://budgetworkflow.com/shop/capex-upgrade-for-1-year" target="_blank">Click here to purchase an upgrade</a>';
        html += '</div>';
        $('#divPackagesForSale').html(html);
    } catch (e) {
        console.log('Exception in cmdUpgradeAndPricingOptions2(): ' + e.message + ', ' + e.stack);
        alert('Exception in cmdUpgradeAndPricingOptions2(): ' + e.message + ', ' + e.stack);
    }
}

function cmdUpgradeAndPricingOptions() {

    // This is called from the user drop down, and lets the user change things like their email address.
    try {
        $('#bwLoggedInUserDropDown').dialog("close");
    } catch (e) {
    }

    $('#bwQuickLaunchMenuTd').css({
        width: '0'
    }); // This gets rid of the jumping around.

    $('#liNewRequest').hide();
    $('#liArchive').hide();
    $('#liSummaryReport').hide();
    $('#liConfiguration').hide();
    $('#liHelp').hide();
    $('#liWelcome').show();
    $('#liVisualizations').hide();

    $('#divWelcomeMessage').empty(); // Clear the welcome screen!

    var e1 = document.getElementById('divNewRequestMasterDiv');
    e1.style.borderRadius = '20px 0 0 20px';

    $('#divWelcomeMasterDivTitle').text('Upgrade and pricing options...');

    //$('#divMenuMasterDivWelcomeButton').css({
    //    'height': '28px', 'width': '92%', 'white-space': 'nowrap', 'border-radius': '0 0 0 0', 'padding': '12px 0 0 20px', 'margin': '0 0 0 0', 'border-width': '0 0 0 0', 'background-color': '#6682b5', 'color': 'white', 'outline': 'none', 'cursor': 'pointer'
    //});
    //$('#divMenuMasterDivWelcomeButton').click(function () {
    //    $('#divMenuMasterDivWelcomeButton').css({
    //        'border-width': '0px', 'margin': '0px 0px 0px 0px', 'padding': '12px 0px 0px 20px', 'outline': 'rgb(59, 103, 142) dashed 1px', 'border-radius': '0px', 'width': '92%', 'height': '28px', 'color': '#dcdcdc', 'background-color': 'white'
    //    });
    //    renderWelcomeScreen();
    //});
    document.getElementById('divWelcomePageLeftButtonsWelcomeButton').className = 'divLeftButton';
    $('#divWelcomePageLeftButtonsWelcomeButton').off('click').click(function () {
        renderWelcomeScreen();
    });

    // This is our Upgrade and Pricing Options screen.
    var html = '';
    html += '<span style="color: rgb(63, 63, 63); font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif; font-size: 22pt;"><strong>You can upgrade from the free Budget Workflow</strong></span><br />';
    html += '<br />';
    html += '<div style="color: rgb(63, 63, 63); font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif; font-size: 12pt;">';
    html += '    <table>';
    html += '        <tr>';
    html += '            <td style="background-color:#6682b5;color:white;padding:4px 20px 7px 15px;">';
    html += '                Basic - This is the free version.';
    html += '            </td>';
    html += '        </tr>';
    html += '        <tr>';
    html += '            <td>';
    html += '                <ul>';
    html += '                    <li>5 budget request views per month</li>';
    html += '                    <li>Purchase order numbers tie into your existing accounting system.</li>';
    html += '                    <li>Add 5 budget request views a month for $9.99.</li>';
    html += '                </ul>';
    html += '            </td>';
    html += '        </tr>';
    html += '        <tr><td>&nbsp;</td></tr>';
    html += '        <tr>';
    html += '            <td class="tdPurchaseBronzePackage" style="color:white;padding:4px 20px 7px 15px;">';
    html += '                Bronze - CAPEX. $9.99/year.&nbsp;';
    html += '                <span style="text-align:right;"><input type="button" value="Upgrade Now" onclick="cmdPurchaseBronzePackage();" style="cursor:pointer;padding:5px 10px 5px 10px;"/></span>';
    html += '            </td>';
    html += '        </tr>';
    html += '        <tr>';
    html += '            <td>';
    html += '                <ul>';
    html += '                    <li>Everything the free package has, plus capital and expense tracking.</li>';
    html += '                    <li>5 budget request views per month</li>';
    html += '                    <li>Add 5 budget request views a month for $9.99.</li>';
    html += '                </ul>';
    html += '            </td>';
    html += '        </tr>';
    html += '        <tr><td>&nbsp;</td></tr>';
    html += '        <tr>';
    html += '            <td class="tdPurchaseSilverPackage" style="padding:4px 20px 7px 15px;">';
    html += '                Silver - CAPEX + OPEX. $99.99/year.&nbsp;';
    html += '                <span style="text-align:right;"><input type="button" value="Upgrade Now" onclick="cmdPurchaseSilverPackage();" style="cursor:pointer;"/></span>';
    html += '            </td>';
    html += '        </tr>';
    html += '        <tr>';
    html += '            <td>';
    html += '                <ul>';
    html += '                    <li>Everything the Bronze package has, plus recurring expenses.</li>';
    html += '                    <li>5 budget request views per month</li>';
    html += '                    <li>Add 5 budget request views a month for $9.99.</li>';
    html += '                </ul>';
    html += '            </td>';
    html += '        </tr>';
    html += '        <tr><td>&nbsp;</td></tr>';
    html += '        <tr>';
    html += '            <td class="tdPurchaseGoldPackage" style="padding:4px 20px 7px 15px;">';
    html += '                Gold - CAPEX + OPEX + Supplementals. $199.99/year.&nbsp;';
    html += '                <span style="text-align:right;"><input type="button" value="Upgrade Now" onclick="cmdPurchaseGoldPackage();" style="cursor:pointer;"/></span>';
    html += '            </td>';
    html += '        </tr>';
    html += '        <tr>';
    html += '            <td>';
    html += '                <ul>';
    html += '                    <li>Everything the other packages have, plus the ability to add supplemental requests.</li>';
    html += '                    <li>5 budget request views per month</li>';
    html += '                    <li>Add 25 budget or supplemental requests a month for $9.99.</li>';
    html += '                </ul>';
    html += '            </td>';
    html += '        </tr>';
    html += '    </table>';
    html += '    <br />';
    //html += '    <a href="http://budgetworkflow.com/shop/capex-upgrade-for-1-year" target="_blank">Click here to purchase an upgrade</a>';
    html += '</div>';
    $('#divWelcomeMessage').html(html);
}

////function displayUnsubscribePage() {
//    // This is called from the user drop down, and lets the user change things like their email address.
//    displayAlertDialog('In displayUnsubscribePage(). You want to unsubscribe. We are working to build in this functionality.');
//    try {
//        $('#bwLoggedInUserDropDown').dialog("close");
//    } catch (e) {
//    }
//    try {
//        $('#bwQuickLaunchMenuTd').css({ width: '0' }); // This gets rid of the jumping around.

//        $('#liNewRequest').hide();
//        $('#liMyStuff').hide();
//        $('#liSummaryReport').hide();
//        $('#liConfiguration').hide();
//        $('#liHelp').hide();
//        $('#liWelcome').show();

//        $('#divWelcomeMessage').empty(); // Clear the welcome screen!

//        var e1 = document.getElementById('divNewRequestMasterDiv');
//        e1.style.borderRadius = '20px 0 0 20px';

//        $('#divWelcomeMasterDivTitle').text('Unsubscribe');

//        $('#divMenuMasterDivWelcomeButton').css({ 'height': '28px', 'width': '92%', 'white-space': 'nowrap', 'border-radius': '0 0 0 0', 'padding': '12px 0 0 20px', 'margin': '0 0 0 0', 'border-width': '0 0 0 0', 'background-color': '#6682b5', 'color': 'white', 'outline': 'none', 'cursor': 'pointer' });
//        $('#divMenuMasterDivWelcomeButton').click(function () {
//            $('#divMenuMasterDivWelcomeButton').css({ 'border-width': '0px', 'margin': '0px 0px 0px 0px', 'padding': '12px 0px 0px 20px', 'outline': 'rgb(59, 103, 142) dashed 1px', 'border-radius': '0px', 'width': '92%', 'height': '28px', 'color': '#dcdcdc', 'background-color': 'white' });
//            //$('#divWelcomeMasterDivTitle').text('Home');
//            renderWelcomeScreen();
//        });
//        // Web service call to get the user details.
//        //var operationUri = appweburl + "/bwparticipants/getuserdetailsbyparticipantid/" + participantId.toString();
//        //$.ajax({
//        //    url: operationUri,
//        //    method: "GET",
//        //    headers: {
//        //        "Accept": "application/json; odata=verbose"
//        //    },
//        //    success: function (userData) {
//        //        var userLogonType;
//        //        if (userData.d.results[0].bwParticipantMicrosoftUserId != null) {
//        //            userLogonType = 'Microsoft';
//        //        } else if (userData.d.results[0].bwParticipantFacebookUserId != null) {
//        //            userLogonType = 'Facebook';
//        //        } else if (userData.d.results[0].bwParticipantGoogleUserId != null) {
//        //            userLogonType = 'Google';
//        //        } else if (userData.d.results[0].bwParticipantLinkedInUserId != null) {
//        //            userLogonType = 'LinkedIn';
//        //        }


//        var userLogonType;
//        if (participantLogonType == 'microsoft') {
//            userLogonType = 'Microsoft';
//        } else if (participantLogonType == 'facebook') {
//            userLogonType = 'Facebook';
//        } else if (participantLogonType == 'google') {
//            userLogonType = 'Google';
//        } else if (participantLogonType == 'linkedin') {
//            userLogonType = 'LinkedIn';
//        }


//        // This is our User Options screen.
//        var html = '';
//        html += '<br />';
//        html += '<span style="font-weight:bold;">Unsubscribe</span>';
//        html += '<hr />';
//        html += '<br />';
//        //html += 'You are logged in using your ' + userLogonType + ' logon.<br />';
//        html += 'You are logged in using your ' + userLogonType + ' logon.<br />';
//        html += '<table>';
//        html += '    <tr><td>&nbsp;</td><td></td></tr>';
//        //html += '    <tr><td>Name:</td><td><input id="txtUserOptionsFriendlyName" contentEditable="false" /></td></tr>';
//        //html += '    <tr><td>Email:</td><td><input id="txtUserOptionsEmail" /></td></tr>';
//        //html += '    <tr><td>Role:</td><td><input id="txtUserOptionsRole" /></td></tr>';
//        //html += '    <tr><td>&nbsp;</td><td></td></tr>';
//        //html += '    <tr><td colspan="2" style="text-align:right;"><input type="button" id="btnSaveUserOptions" value="Save" onclick="cmdSaveUserOptions();" style="cursor:pointer;" />&nbsp;&nbsp;<input type="button" id="btnCancelUserOptions" value="Cancel" onclick="cmdCancel();" style="cursor:pointer;" /></td></tr>';

//        html += '    <tr><td>- Mark the participant as unsubcribed in the database.</td></tr>';
//        html += '    <tr><td>- Notify the tenant owner that the user has chosen to unsubscribe.</td></tr>';
//        html += '    <tr><td>- Notify participants in the workflow that the user has chosen to unsubscribe.</td></tr>';
//        html += '    <tr><td>- Somehow we have to have a way for them to substitute the user in any functional areas, and places where an approval process will get held up.</td></tr>';
//        html += '    <tr><td>- Perhaps disable a financial area where they are involved until they have had a replacement assigned.</td></tr>';




//        html += '</table>';
//        html += '';
//        html += '';
//        html += '';
//        $('#divWelcomeMessage').html(html);

//        //$('#txtUserOptionsFriendlyName').val(userData.d.results[0].bwParticipantFriendlyName);
//        //$('#txtUserOptionsEmail').val(userData.d.results[0].bwParticipantEmail);
//        //$('#txtUserOptionsRole').val(userData.d.results[0].bwParticipantRole);
//        //    },
//        //    error: function (data, errorCode, errorMessage) {
//        //        handleExceptionWithAlert('Error in my.js.cmdUserOptions()', errorCode + ', ' + errorMessage);
//        //    }
//        //});
//    } catch (e) {
//        handleExceptionWithAlert('Error in my.js.displayUnsubscribePage()', e.message);
//    }
//}

function cmdUserOptions() {
    debugger;
    // This is called from the user drop down, and lets the user change things like their email address.
    $("#bwLoggedInUserDropDown").dialog('close'); // Close the top left dialog.

    $("#AccountDetailsDialog").dialog({
        modal: true,
        resizable: false,
        closeText: "Cancel",
        closeOnEscape: true, // Hit the ESC key to hide! Yeah!
        //title: 'Change the role for ' + userFriendlyName + '...',
        width: "570px",
        dialogClass: "no-close", // No close button in the upper right corner.
        hide: false, // This means when hiding just disappear with no effects.
        open: function (event, ui) {
            $('.ui-widget-overlay').bind('click', function () { $("#AccountDetailsDialog").dialog('close'); });
            //$('#btnUserRoleDialogChangeRole').bind('click', function () {
            //    cmdChangeUserRoleAndSendEmail(userId, userFriendlyName, userEmail, logonType);
            //    $("#ChangeUserRoleDialog").dialog('close');
            //});
            // 
            // This is our User Options screen.
            //var html = '';
            //html += '<table>';
            //html += '    <tr><td>&nbsp;</td><td></td></tr>';
            //html += '    <tr><td>Name:</td><td><input id="txtUserOptionsFriendlyName" style="width: 350px;" /></td></tr>';
            //html += '    <tr><td>Email:</td><td><input id="txtUserOptionsEmail" style="width: 350px;" /></td></tr>';
            //html += '    <tr><td>&nbsp;</td><td></td></tr>';
            //html += '</table>';
            //$('#spanAccountDetailsDialogDetails').html(html);
            $('#txtUserOptionsFriendlyName').val(participantFriendlyName);
            $('#txtUserOptionsEmail').val(participantEmail);
        }
    });
    // Hide the title bar.
    $("#AccountDetailsDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
    // Set the title.
    document.getElementById('spanAccountDetailsDialogTitle').innerHTML = 'Update account details for ' + participantFriendlyName + '.';








    // THIS IS THE OLD SCREEN WHICH WE ARE CONVERTING TO A DIALOG (ABOVE).
    //try {
    //    $('#bwLoggedInUserDropDown').dialog("close");
    //} catch (e) {
    //}

    //$('#bwQuickLaunchMenuTd').css({
    //    width: '0'
    //}); // This gets rid of the jumping around.

    //$('#liNewRequest').hide();
    //$('#liArchive').hide();
    //$('#liSummaryReport').hide();
    //$('#liConfiguration').hide();
    //$('#liHelp').hide();
    //$('#liWelcome').show();

    //$('#divWelcomeMessage').empty(); // Clear the welcome screen!

    //var e1 = document.getElementById('divNewRequestMasterDiv');
    //e1.style.borderRadius = '20px 0 0 20px';

    //$('#divWelcomeMasterDivTitle').text('User Options');

    //$('#divMenuMasterDivWelcomeButton').css({
    //    'height': '28px', 'width': '92%', 'white-space': 'nowrap', 'border-radius': '0 0 0 0', 'padding': '12px 0 0 20px', 'margin': '0 0 0 0', 'border-width': '0 0 0 0', 'background-color': '#6682b5', 'color': 'white', 'outline': 'none', 'cursor': 'pointer'
    //});
    //$('#divMenuMasterDivWelcomeButton').click(function () {
    //    $('#divMenuMasterDivWelcomeButton').css({
    //        'border-width': '0px', 'margin': '0px 0px 0px 0px', 'padding': '12px 0px 0px 20px', 'outline': 'rgb(59, 103, 142) dashed 1px', 'border-radius': '0px', 'width': '92%', 'height': '28px', 'color': '#dcdcdc', 'background-color': 'white'
    //    });
    //    renderWelcomeScreen();
    //});
    //var userLogonType;
    //if (participantLogonType == 'microsoft') {
    //    userLogonType = 'Microsoft';
    //} else if (participantLogonType == 'facebook') {
    //    userLogonType = 'Facebook';
    //} else if (participantLogonType == 'google') {
    //    userLogonType = 'Google';
    //} else if (participantLogonType == 'linkedin') {
    //    userLogonType = 'LinkedIn';
    //}
    //// This is our User Options screen.
    //var html = '';
    //html += '<br />';
    //html += '<span style="font-weight:bold;">User Options</span>';
    //html += '<hr />';
    //html += '<br />';
    //html += '<table>';
    //html += '    <tr><td>&nbsp;</td><td></td></tr>';
    //html += '    <tr><td>Name:</td><td><input id="txtUserOptionsFriendlyName" contentEditable="false" /></td></tr>';
    //html += '    <tr><td>Email:</td><td><input id="txtUserOptionsEmail" /></td></tr>';
    //html += '    <tr><td>&nbsp;</td><td></td></tr>';
    //html += '    <tr><td colspan="2" style="text-align:right;"><input type="button" id="btnSaveUserOptions" value="Save" onclick="cmdSaveUserOptions();" style="cursor:pointer;" />&nbsp;&nbsp;<input type="button" id="btnCancelUserOptions" value="Cancel" onclick="cmdCancel();" style="cursor:pointer;" /></td></tr>';
    //html += '</table>';
    //html += '<br /><br />';
    //$('#divWelcomeMessage').html(html);
    //$('#txtUserOptionsFriendlyName').val(participantFriendlyName);
    //$('#txtUserOptionsEmail').val(participantEmail);

}


function displayRoleMultiPicker(bwParticipantId, bwParticipantFriendlyName, bwParticipantEmail) {
    try {
        console.log('In displayRoleMultiPicker().');
        try {
            console.log('In displayRoleMultiPicker(). bwParticipantId: ' + bwParticipantId);
            $.ajax({
                url: globalUrlPrefix + globalUrlForWebServices + "/odata/Roles/" + workflowAppId + "/" + bwParticipantId,
                dataType: "json",
                contentType: "application/json",
                type: "Get",
                timeout: ajaxTimeout
            }).done(function (result) {
                try {
                    //console.log('In my.js.displayRoleMultiPicker().Get[odata/Roles].done: result.userRoles: ' + JSON.stringify(result.userRoles));
                    //
                    var car = result.workflow;
                    //
                    var roles;
                    if (result) {
                        roles = result.userRoles;
                    } else {
                        console.log('In my.js.displayRoleMultiPicker().Get[odata/Roles].done: result: bad identifier here, please reword.. ' + JSON.stringify(result));
                    }
                    //
                    var html = '';
                    html += '<table>';
                    // Iterate through the steps. Then the informs, then the assigns. Make an array of the roles. { RoleId, RoleName }
                    for (var i = 0; i < car.Workflow.Steps.Step.length; i++) {
                        var stepName = car.Workflow.Steps.Step[i]["@Name"];
                        if (stepName == 'Create' || stepName == 'Revise' || stepName == 'Admin') {
                            // Do nothing, not displaying these steps.
                        } else {
                            // Display Inform roles.
                            if (car.Workflow.Steps.Step[i].OnStart && car.Workflow.Steps.Step[i].OnStart.Inform) {
                                if (car.Workflow.Steps.Step[i].OnStart.Inform.length > 0) {
                                    for (var j = 0; j < car.Workflow.Steps.Step[i].OnStart.Inform.length; j++) {
                                        html += '<tr class="orgRow">';
                                        var isSelected = false;
                                        var userOrgsForRole = [];
                                        for (var r = 0; r < roles.length; r++) {
                                            if (roles[r].RoleId == car.Workflow.Steps.Step[i].OnStart.Inform[j]["@Role"]) {
                                                userOrgsForRole.push(roles[r].OrgId);
                                                isSelected = true;
                                            }
                                        }
                                        if (isSelected) {
                                            html += '   <td>xcx65<input id="' + 'roleCheckbox_' + j + '" type="checkbox" checked /></td>';
                                        } else {
                                            html += '   <td>xcx66<input id="' + 'roleCheckbox_' + j + '" type="checkbox" /></td>';
                                        }
                                        html += '       <td class="roleId">' + car.Workflow.Steps.Step[i].OnStart.Inform[j]["@Role"] + '</td>';
                                        html += '       <td>&nbsp;</td>';
                                        html += '       <td class="roleName">' + car.Workflow.Steps.Step[i].OnStart.Inform[j]["@RoleName"] + '</td>';

                                        // Display orgs for user role
                                        html += '       <td>&nbsp;</td>';
                                        if (isSelected) {
                                            html += '   <td>' + userOrgsForRole + '</td>';
                                        } else {
                                            html += '       <td></td>';
                                        }

                                        html += '</tr>';
                                    }
                                }
                            }
                            // Display Assign roles.
                            if (car.Workflow.Steps.Step[i].Assign) {
                                if (car.Workflow.Steps.Step[i].Assign.length > 0) {
                                    for (var j = 0; j < car.Workflow.Steps.Step[i].Assign.length; j++) {
                                        html += '<tr class="orgRow">';
                                        var isSelected = false;
                                        var userOrgsForRole = [];
                                        for (var r = 0; r < roles.length; r++) {
                                            if (roles[r].RoleId == car.Workflow.Steps.Step[i].Assign[j]["@Role"]) {
                                                userOrgsForRole.push(roles[r].OrgId);
                                                isSelected = true;
                                            }
                                        }
                                        if (isSelected) {
                                            html += '   <td>xcx67<input id="' + 'roleCheckbox_' + i + '" type="checkbox" checked /></td>';
                                        } else {
                                            html += '   <td>xcx68<input id="' + 'roleCheckbox_' + i + '" type="checkbox" /></td>';
                                        }
                                        html += '       <td class="roleId">' + car.Workflow.Steps.Step[i].Assign[j]["@Role"] + '</td>';
                                        html += '       <td>&nbsp;</td>';
                                        html += '       <td class="roleName">' + car.Workflow.Steps.Step[i].Assign[j]["@RoleName"] + '</td>';

                                        html += '       <td>&nbsp;</td>';
                                        if (isSelected) {
                                            html += '   <td>' + userOrgsForRole + '</td>';
                                        } else {
                                            html += '       <td></td>';
                                        }

                                        html += '</tr>';
                                    }
                                }
                            }
                        }
                    }
                    html += '</table>';

                    $('#spanRoleMultiPickerDialogContent').html(html);
                    document.getElementById('spanRoleMultiPickerDialogTitle').innerHTML = 'Roles and Orgs for ' + bwParticipantFriendlyName;

                    $("#divRoleMultiPickerDialog").dialog({
                        modal: true,
                        resizable: false,
                        //closeText: "Cancel",
                        closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                        width: '800',
                        dialogClass: 'no-close', // No close button in the upper right corner.
                        hide: false, // This means when hiding just disappear with no effects.
                        open: function () {
                            $('.ui-widget-overlay').bind('click', function () {
                                $('#divRoleMultiPickerDialog').dialog('close');
                            });
                        },
                        close: function () {
                            //$(this).dialog('destroy').remove();
                        }
                    });
                    //$('#divRoleMultiPickerDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
                } catch (e) {
                    //lpSpinner.Hide();
                    console.log('Exception in raci.html.displayRoleMultiPicker().Get[odata/Orgs].done: ' + e.message + ', ' + e.stack);
                }
            }).fail(function (data) {
                //lpSpinner.Hide();
                var msg;
                if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                } else {
                    msg = JSON.stringify(data);
                }
                alert('Error in raci.html.displayRoleMultiPicker().Get[odata/Orgs].fail: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                console.log('Error in raci.html.displayRoleMultiPicker().Get[odata/Orgs].fail:' + JSON.stringify(data));
                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                //var error = JSON.parse(data.responseText)["odata.error"];
                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            });
        } catch (e) {
            console.log('Exception in displayRoleMultiPicker(): ' + e.message + ', ' + e.stack);
        }
    } catch (e) {
        console.log('Exception in displayRoleMultiPicker(): ' + e.message + ', ' + e.stack);
    }
}






function displayFullSizedAttachmentInDialog(fileUrl) {
    alert('Does this mean we want to open this file in the default application for this operating system? Development note: We need to get the div AttachmentsDialog2 incorporated here then it may work.');
    try {
        $("#AttachmentsDialog1").dialog('close'); // Close the other dialog.

        $('#divAttachmentsDialog2Contents').empty(); // We have to empty the contents of the dialog before it is displayed.
        $("#AttachmentsDialog2").dialog({
            modal: true,
            resizable: false,
            //closeText: "Cancel",
            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
            //title: brTitle + ' (' + arName.replace('.xml', '') + ")",
            //title: brTitle + " (" + title + ")",
            width: "800px",
            dialogClass: "no-close", // No close button in the upper right corner.
            hide: false,//, // This means when hiding just disappear with no effects.
            //buttons: {
            //    "Close": function () {
            //        $(this).dialog("close");
            //    }
            //}
            open: function (event, ui) { $('.ui-widget-overlay').bind('click', function () { $("#AttachmentsDialog2").dialog('close'); }); } // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.
        });
        $("#AttachmentsDialog2").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

        var html = '';
        // We need to present these by using file extension. This displays all images. .jpg, .png, .xx << Todd: need work here.
        if (fileUrl.toUpperCase().indexOf('.PNG') != -1 || fileUrl.toUpperCase().indexOf('.JPG') != -1 || fileUrl.toUpperCase().indexOf('.JPEG') != -1) {
            html += '<img src="' + fileUrl + '" style="display:block;margin-left:auto;margin-right:auto;" />';
        } else {
            html += '<span style="font-size:40pt;">Unknown file extension</span>';
        }
        $('#divAttachmentsDialog2Contents').html(html);

        //document.getElementById('txtAttachmentsDialog2Filename').value = 'xxxx';
        //document.getElementById('txtAttachmentsDialog2FileDescription').value = 'xxxx xxxx';

    } catch (e) {
        displayAlertDialog('Error in ios8.js.displayFullSizedAttachmentInDialog()', '2:' + e.message + fileUrl);
    }
}






function renderConfigurationParticipants() {
    try {



        //console.log('In renderConfigurationOrgRoles().');
        //var requestTypes = bwEnabledRequestTypes.EnabledItems;

        $('#bwQuickLaunchMenuTd').css({
            width: '0'
        }); // This gets rid of the jumping around.

        try {
            $('#FormsEditorToolbox').dialog('close');
        } catch (e) { }

        //var canvas = document.getElementById("myCanvas");
        //var ctx = canvas.getContext("2d");
        //ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines

        $('#divFunctionalAreasMasterDiv').empty(); // Clear the div and rebuild it with out new 'Departments' title.
        $('#divFunctionalAreasMasterSubMenuDiv').hide(); //This si the top bar which we want to hide in this case.

        var html = '';
        html += '<table style="border-width: 0px; margin: 0px; padding: 0px; width: 100%;"><tbody><tr style="border-width: 0px; margin: 0px; padding: 0px;"><td style="border-width: 0px; margin: 0px; padding: 0px;">';
        html += 'Participants...xcx2';
        html += '</td></tr></tbody></table>';
        $('#divFunctionalAreasMasterDiv').html(html);
        //
        //disableDepartmentsButton();
        //disableRaciSettingsButton();
        disableOrgRoleSettingsButton();
        $('#divFunctionalAreasSubSubMenus').empty();


        var html = '';
        html += '<div id="divBwParticipantsEditor"></div>';
        $('#divFunctionalAreasSubSubMenus').html(html);
        //$('#divFunctionalAreasSubSubMenus').html(html);


        ////debugger;

        //                $('#divFunctionalAreasSubSubMenus').html(html);


        var options = {
            displayWorkflowPicker: true,
            bwTenantId: tenantId,
            bwWorkflowAppId: workflowAppId,
            bwEnabledRequestTypes: bwEnabledRequestTypes
        };
        var $bwparticipantseditor = $("#divBwParticipantsEditor").bwParticipantsEditor(options);

    } catch (e) {
        console.log('Exception in renderConfigurationParticipants(): ' + e.message + ', ' + e.stack);
    }
}

function renderConfigurationChecklists() {
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

        $('#divPageContent3').empty(); // Clear the div and rebuild it with out new 'Departments' title.
        //$('#divFunctionalAreasMasterSubMenuDiv').hide(); //This si the top bar which we want to hide in this case.





        //var html = '';
        //html += '<table style="border-width: 0px; margin: 0px; padding: 0px; width: 100%;"><tbody><tr style="border-width: 0px; margin: 0px; padding: 0px;"><td style="border-width: 0px; margin: 0px; padding: 0px;">';
        //html += 'Checklists: <span style="font-weight:bold;color:#95b1d3;">Configure your "' + workflowAppTitle + '" checklists...</span>';
        ////html += '';
        //html += '</td></tr></tbody></table>';
        //$('#divPageContent3').html(html);





        //
        //disableDepartmentsButton();
        //disableChecklistsSettingsButton();
        //$('#divFunctionalAreasSubSubMenus').empty();


        var html = '';
        html += '<div id="divChecklistsEditor" class="context-menu-checklistseditor" style="height:100vh;"></div>'; // Todd just did this to try and get the editing screen to not jump around when deleting rows at the bottom, and make it more intuitive! 10-24-19 2pm ast.
        $('#divPageContent3').html(html);

        var options = { displayChecklistPicker: true, bwTenantId: tenantId, bwWorkflowAppId: workflowAppId, checklistIndex: '' };
        var $checklist = $("#divChecklistsEditor").bwChecklistsEditor(options);

    } catch (e) {
        console.log('Exception in renderConfigurationChecklists(): ' + e.message + ', ' + e.stack);
    }
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

        $('#divPageContent3').empty(); // Clear the div and rebuild it with out new 'Departments' title.
        //$('#divFunctionalAreasMasterSubMenuDiv').hide(); //This si the top bar which we want to hide in this case.



        //var html = '';
        //html += '<table style="border-width: 0px; margin: 0px; padding: 0px; width: 100%;"><tbody><tr style="border-width: 0px; margin: 0px; padding: 0px;"><td style="border-width: 0px; margin: 0px; padding: 0px;">';
        //html += 'Forms: <span style="font-weight:bold;color:#95b1d3;">Configure your "' + workflowAppTitle + '" forms...</span>';
        ////html += '';
        //html += '</td></tr></tbody></table>';
        //$('#divPageContent3').html(html);



        //
        //disableDepartmentsButton();
        //disableFormsSettingsButton();
        //$('#divFunctionalAreasSubSubMenus').empty();


        var html = '';
        html += '<div id="divFormsEditor" class="context-menu-formseditor" style="height:100vh;"></div>'; // Todd just did this to try and get the editing screen to not jump around when deleting rows at the bottom, and make it more intuitive! 10-24-19 2pm ast.
        $('#divPageContent3').html(html);

        //debugger;
        //var options = { displayChecklistPicker: true, bwTenantId: tenantId, bwWorkflowAppId: workflowAppId, checklistIndex: '' };
        var options = { displayChecklistPicker: true, checklistIndex: '' }; // 1-2-2022
        var $form = $("#divFormsEditor").bwFormsEditor(options);

    } catch (e) {
        console.log('Exception in renderConfigurationForms(): ' + e.message + ', ' + e.stack);
        displayAlertDialog('Exception in renderConfigurationForms(): ' + e.message + ', ' + e.stack);
    }
}

//renderConfigurationManagementPillars
function renderConfigurationFunctionalAreas() {
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

        //var e1 = document.getElementById('divFunctionalAreas');
        //e1.style.borderRadius = '20px 0 0 20px';
        //loadWorkflowAppConfigurationDetails9();

        //generateFunctionalAreasListButtons();



        // This is displayed to owners when the next year rolls around!
        //cmdDisplayFinancialAreaDialogYouOnlyHaveOneFinancialAreaCopyPreviousYearOption();







        //GetWorkflowAppConfigurationData9 = $.Deferred();
        //GetWorkflowAppConfigurationData9
        //    .done(function () {
        //displayAlertDialog('DONE');
        generateFunctionalAreasListButtons();
        //})
        //.fail(function () {
        //    handleExceptionWithAlert('Error in my.js.populateStartPageItem(divFunctionalAreas)', 'GetWorkflowAppConfigurationData9.fail()');
        //});

        //debugger;
        $('#divBwCoreComponent').bwCoreComponent('loadWorkflowAppConfigurationDetails9');

        // GetWorkflowAppConfigurationData9.resolve(); // Callback.


    } catch (e) {
        console.log('Exception in renderConfigurationFunctionalAreas(): ' + e.message + ', ' + e.stack);
    }
}

//
function renderConfigurationManagementPillars() {
    try {
        $('#bwQuickLaunchMenuTd').css({
            width: '0'
        }); // This gets rid of the jumping around.

        var canvas = document.getElementById("myCanvas");
        if (canvas) {
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines
            canvas.style.zIndex = -1;
        }


        alert('This functionality is incomplete. Coming Soon! :D');

    } catch (e) {
        console.log('Exception in renderConfigurationManagementPillars(): ' + e.message + ', ' + e.stack);
    }
}


function displayAddANewPersonDialog() {
    try {
        console.log('In displayAddANewPersonDialog().');
        if (!participantId) {
            console.log('In displayAddANewPersonDialog(). User is not logged in, so displaying the logon.');
            initializeTheLogon(); // The user needs to be logged in before they add anyone.
        } else {
            $("#divAddANewPersonDialog").dialog({
                modal: true,
                resizable: false,
                //closeText: "Cancel",
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                title: 'Add a New Person',
                width: '800',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divAddANewPersonDialog").dialog('close');
                    });
                    //document.getElementById('txtCreateANewRoleDialog_RoleId').value = document.getElementById('textNewRoleId').value;
                    //document.getElementById('txtCreateANewRoleDialog_RoleName').value = document.getElementById('textNewRoleName').value;
                },
                close: function () {
                    //$(this).dialog('destroy').remove();
                }
            });
            $("#divAddANewPersonDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
        }
    } catch (e) {
        console.log('Exception in displayAddANewPersonDialog(): ' + e.message + ', ' + e.stack);
    }
}





function cmdCreateSupplementalBudgetRequestAndStartWorkflow(budgetRequestId, supplementalRequestId, _functionalAreaId, _pmAccountId) {
    try {
        //displayAlertDialog('xxxx');
        // Create with a GUID. The workflow will give it a better name.
        //var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        //    return v.toString(16);
        //});
        //var guid = document.getElementById('BudgetRequestId').innerHTML; // = _budgetRequestId;

        //displayAlertDialog('BudgetRequestId: ' + budgetRequestId + '  _functionalAreaId: ' + _functionalAreaId + '  _pmAccountId: ' + _pmAccountId);

        // We have the filename, so now it's time to create the file.
        var filename = supplementalRequestId + ".xml";
        if (validateSupplementalRequest()) {
            var xmlDocument = createXmlDocument_InitSupplementalAr(_functionalAreaId, _pmAccountId, supplementalRequestId);
            var projectTitle = document.getElementById('strProjectTitle').value;
            var _budgetRequest = [];
            //var _functionalAreaId = document.getElementById('ddlFunctionalArea').value.split('|')[0];
            //var _pmAccountId = document.getElementById('txtProjectManagerId').value;
            var requestedCapital = document.getElementById('dblRequestedCapital').value.replace(/[^0-9-.]/g, '');
            //var requestedExpense = document.getElementById('dblRequestedExpense').value;
            var requestedExpense = 0; // Todd: enable this by hiding the field in the init form is the final solution so we can just enable it for enhanced functionality.
            var created = getCreatedTimestamp();
            var duedate = getDueDateTimestamp();
            _budgetRequest = {
                //filename: filename,
                bwBudgetRequestId: supplementalRequestId,
                bwTenantId: tenantId,
                bwWorkflowAppId: workflowAppId,
                bwWorkflowId: null,

                IsSupplementalRequest: 'true',
                RelatedBudgetRequestId: budgetRequestId,

                Created: created,
                CreatedBy: participantEmail,
                CreatedById: participantId,
                CreatedByEmail: participantEmail,
                //Modified: null,
                //ModifiedBy: null,
                bwDocumentXml: xmlDocument.toString(),
                Title: null,
                ProjectTitle: projectTitle.toString(),
                BudgetAmount: null,
                RequestedCapital: requestedCapital,
                RequestedExpense: requestedExpense,
                FunctionalAreaId: _functionalAreaId,
                ARStatus: 'Submitted',
                BudgetWorkflowStatus: 'Admin', //'Assign Budget',
                Quote: 'false',
                //CurrentOwner: participantEmail,

                ManagerId: _pmAccountId,

                bwWorkflowToken: '0', // 0 signifies the beginning of the workflow.
                //participantId: participantId,
                //bwAssignedTo: participantFriendlyName, //participantEmail, // THIS SHOULD REALLY BE THE PM AND DISCOVERED IN THE LOOKUP ON THE SERVER SIDE
                //bwAssignedToEmail: participantEmail,
                bwDueDate: duedate
            };
            var operationUri = webserviceurl + "/bwbudgetrequests/initbudgetrequest";
            $.ajax({
                url: operationUri,
                type: "POST", timeout: ajaxTimeout,
                data: _budgetRequest,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    displayAlertDialog('The supplemental budget request has been submitted');
                    //clearNewBudgetRequestFormFields();
                    //window.location.href = 'my.html';
                    populateStartPageItem('divWelcome', 'Reports', '');
                    //renderWelcomeScreen();
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error creating the budget request in budgetrequests library. ' + JSON.stringify(data));
                }
            });
        } else {
            // Validation failed for some reason.
            displayAlertDialog('Error: Validation failed for some reason.');
        }
    } catch (e) {
        displayAlertDialog('Error in my.js.cmdCreateSupplementalBudgetRequestAndStartWorkflow(): ' + e.message);
    }
}

//function cmdCreateRecurringExpenseBudgetRequestAndStartWorkflow() {
//    displayAlertDialog('cmdCreateRecurringExpenseBudgetRequestAndStartWorkflow()');
//}

function cmdCreateRecurringExpenseBudgetRequestAndStartWorkflow() {
    try {
        // The recurring expense already exists in the database.
        // So here we are just submitting the new budget request, making sure to indicate it was spawned from a recurring expense so we can track it down later on for stats and reporting purposes!
        //
        // First we get the guid that was created when the new request form was displayed. It is done here because we need the guid prior to doing attachment file uploads so that they get stored in the correct location.
        var budgetRequestId = document.getElementById('BudgetRequestId').innerHTML;
        var recurringExpenseId = document.getElementById('RecurringExpenseId').innerHTML;

        //displayAlertDialog('recurringExpenseId: ' + recurringExpenseId);

        var recurringExpenseReminderDate = document.getElementById('dtRecurringExpenseNextReminderDate').value;
        //var submitTheFirstRecurringExpenseImmediately = document.getElementById('cbNewRequestRecurringExpenseSubmitImmediately').checked;
        if (validateNewBudgetRequestFormForRecurringExpense()) {
            var xmlDocument = createXmlDocument_InitRecurringExpenseBudgetRequest(budgetRequestId);
            var projectTitle = $('span[xd\\:binding = "my:Project_Name"]')[0].innerHTML; //document.getElementById('strProjectTitle').value;
            var _budgetRequest = [];
            var _functionalAreaId = document.getElementById('ddlFunctionalArea').value.split('|')[0];
            var _pmAccountId = $('span[xd\\:binding = "my:Project_Manager_AccountId"]')[0].innerHTML; //document.getElementById('txtProjectManagerId').value;
            var requestedCapital = document.getElementById('dblRequestedCapital').value.replace(/[^0-9-.]/g, '');
            //var requestedExpense = document.getElementById('dblRequestedExpense').value;
            var requestedExpense = 0; // Todd: enable this by hiding the field in the init form is the final solution so we can just enable it for enhanced functionality.
            var created = getCreatedTimestamp();
            var duedate = getDueDateTimestamp();
            var isAQuote = 'false'; // Definately false, since this is a recurring expense.
            _budgetRequest = {
                //filename: filename,
                bwBudgetRequestId: budgetRequestId,
                bwTenantId: tenantId,
                bwWorkflowAppId: workflowAppId,
                bwWorkflowId: null,
                IsSupplementalRequest: 'false',
                RelatedBudgetRequestId: null,

                IsRecurringExpense: 'true', // Recurring expense.
                RelatedRecurringExpenseId: recurringExpenseId, // Recurring expense.
                RecurringExpenseNextReminderDate: recurringExpenseReminderDate, // 

                CreatedBy: participantEmail,
                CreatedById: participantId,
                CreatedByEmail: participantEmail,
                bwDocumentXml: xmlDocument,
                ProjectTitle: projectTitle,
                BudgetAmount: null,
                RequestedCapital: requestedCapital,
                RequestedExpense: requestedExpense,
                FunctionalAreaId: _functionalAreaId,
                ARStatus: 'Submitted',
                BudgetWorkflowStatus: 'Admin', //'Assign Budget',
                Quote: isAQuote,
                ManagerId: _pmAccountId,
                bwWorkflowToken: '0' // 0 signifies the beginning of the workflow.
            };
            var operationUri = webserviceurl + "/bwbudgetrequests/initbudgetrequest";
            $.ajax({
                url: operationUri,
                type: "POST", timeout: ajaxTimeout,
                data: _budgetRequest,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    displayAlertDialog(data); //'The budget request has been submitted'); // Todd: This message should be coming from the web service.
                    clearNewBudgetRequestFormFields();
                    populateStartPageItem('divWelcome', 'Reports', '');
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error creating the budget request in budgetrequests library. ' + JSON.stringify(data));
                }
            });
        } else {
            // Validation failed for some reason.
            //displayAlertDialog('Error: Validation failed for some reason.');
        }
    } catch (e) {
        displayAlertDialog('Error in cmdCreateRecurringExpenseBudgetRequestAndStartWorkflow(): ' + e.message);
    }
}

function cmdUpdateRecurringExpenseReminderDate() {
    var recurringExpenseId = document.getElementById('RecurringExpenseId').innerHTML;
    var recurringExpenseReminderDate = document.getElementById('dtRecurringExpenseNextReminderDate').value;
    // First we have to validate the date.
    var dateFromSelection = new Date(recurringExpenseReminderDate); // Instantiate the object to see if there are any errors.
    var d = dateFromSelection.getDate();
    var m = dateFromSelection.getMonth();
    var y = dateFromSelection.getFullYear();
    var formulatedDate = new Date(y, m, d);
    if (((formulatedDate.getDate() == d) && (formulatedDate.getMonth() == m) && (formulatedDate.getFullYear() == y))) {
        var today = new Date(); // It's a valid date, but we need to check if it's before Today!!
        // Todd added fix #9-8-14-002 to bw.initar.core.js.
        today.setHours(0, 0, 0, 0);
        dateFromSelection.setHours(0, 0, 0, 0);
        if (dateFromSelection <= today) {
            displayAlertDialog('Please specify an "Reminder Date" which occurs in the future before submitting your request.');
            // Bad date, clear the box.
            document.getElementById('dtRecurringExpenseNextReminderDate').value = '';
        } else {
            // Passed validation. Now save the new reminder date to the database.
            var _recurringExpense = {
                bwRecurringExpenseId: recurringExpenseId,
                ReminderDate: recurringExpenseReminderDate
            }
            var operationUri = webserviceurl + "/bwrecurringexpense/saveanewrecurringxpensereminderdate";
            $.ajax({
                url: operationUri,
                type: "POST", timeout: ajaxTimeout,
                data: _recurringExpense,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    if (data != 'SUCCESS') {
                        displayAlertDialog(data); // Display the error message.
                    } else {
                        // It's good, set the style of the Save button!
                        displayAlertDialog('The reminder date has been updated.');
                        document.getElementById('btnRecurringExpenseNextReminderDate').style.cursor = 'default';
                        document.getElementById('btnRecurringExpenseNextReminderDate').setAttribute('disabled', '');
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in cmdUpdateRecurringExpenseReminderDate(): ' + errorMessage);
                }
            });
        }
    } else {
        // Bad date, clear the box.
        document.getElementById('dtRecurringExpenseNextReminderDate').value = '';
    }
}

//function cmdCreateBudgetRequestAndStartWorkflow() {
//    try {
//        console.log('In cmdCreateBudgetRequestAndStartWorkflow().');





//        // IS THIOS ANY GOOD ANYMORE??
//        // First we get the guid that was created when the new request form was displayed. It is done here because we need the guid prior to doing attachment file uploads so that they get stored in the correct location.

//        //var bwBudgetRequestId = $('#divPageContent1').find('#budgetrequestform')[0]
//        //var bwBudgetRequestId = $('#divPageContent1').find('#budgetrequestform')[0].getAttribute('bwbudgetrequestid'); // 12-14-2021
//        //divPageContent1
//        //budgetrequestform

//        //var guid = document.getElementById('BudgetRequestId').innerHTML;









//        // Then we have to check if this is a recurring expense, and if the user wants to submit the first budget request immediately.
//        //var isARecurringExpense = document.getElementById('cbNewRequestRecurringExpenseEnabled').checked;

//        //debugger;
//        var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
//        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
//        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
//        var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
//        var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');


//        var isARecurringExpense = false;
//        if ($('#selectNewRequestFormRequestTypeDropDown option:selected').val() == 'recurringexpense') {
//            isARecurringExpense = true;
//        }
//        if (isARecurringExpense == true) {

//            //displayAlertDialog('This is a Recurring Expense. cmdCreateBudgetRequestAndStartWorkflow()');

//            var recurringExpenseId = document.getElementById('RecurringExpenseId').innerHTML;

//            //displayAlertDialog('RecurringExpenseId: ' + reGuid);

//            var recurringExpenseReminderDate = document.getElementById('dtRecurringExpenseReminderDate').value;
//            var submitTheFirstRecurringExpenseImmediately = document.getElementById('cbNewRequestRecurringExpenseSubmitImmediately').checked;
//            if (validateCapexForm2()) {
//                // First we will save the recurring expense, then we will submit the first one if the user chose this option.
//                var xmlDocument = createXmlDocument_InitRecurringExpense(recurringExpenseId);
//                var projectTitle = document.getElementById('strProjectTitle').value;

//                //displayAlertDialog('projectTitle: ' + projectTitle);

//                var _recurringExpense = [];
//                var _functionalAreaId = document.getElementById('ddlFunctionalArea').value.split('|')[0];
//                var _pmAccountId = document.getElementById('txtProjectManagerId').value;
//                var requestedCapital = document.getElementById('dblRequestedCapital').value.replace(/[^0-9-.]/g, '');
//                //var requestedExpense = document.getElementById('dblRequestedExpense').value;
//                var requestedExpense = 0; // Todd: enable this by hiding the field in the init form is the final solution so we can just enable it for enhanced functionality.
//                //var created = getCreatedTimestamp();
//                //var duedate = getDueDateTimestamp();
//                _recurringExpense = {
//                    submitTheFirstRecurringExpenseImmediately: submitTheFirstRecurringExpenseImmediately,
//                    bwRecurringExpenseId: recurringExpenseId,
//                    bwTenantId: tenantId,
//                    bwWorkflowAppId: workflowAppId,
//                    bwWorkflowId: null,
//                    CreatedBy: participantFriendlyName,
//                    CreatedById: participantId,
//                    CreatedByEmail: participantEmail,
//                    ReminderDate: recurringExpenseReminderDate,
//                    bwDocumentXml: xmlDocument.toString(),
//                    ProjectTitle: projectTitle.toString(),
//                    BudgetAmount: null,
//                    RequestedCapital: requestedCapital,
//                    RequestedExpense: requestedExpense,
//                    FunctionalAreaId: _functionalAreaId,
//                    Quote: 'false',
//                    ManagerId: _pmAccountId
//                    // TODD: WE NEED firendly name and email here as well.
//                };
//                var operationUri = webserviceurl + "/bwbudgetrequests/saveanewrecurringxpense"; //initanewrecurringexpensebudgetrequest";
//                $.ajax({
//                    url: operationUri,
//                    type: "POST", timeout: ajaxTimeout,
//                    data: _recurringExpense,
//                    headers: {
//                        "Accept": "application/json; odata=verbose"
//                    },
//                    success: function (data) {
//                        displayAlertDialog(data);
//                        //displayAlertDialog('The recurring expense has been submitted'); // Todd: This message should be coming from the web service.
//                        clearNewBudgetRequestFormFields();
//                        populateStartPageItem('divWelcome', 'Reports', '');
//                    },
//                    error: function (data, errorCode, errorMessage) {
//                        displayAlertDialog('Error creating the budget request in budgetrequests library:1: ' + JSON.stringify(data));
//                    }
//                });
//            } else {
//                // Validation failed for some reason.
//                //displayAlertDialog('Error: Validation failed for some reason.');
//            }
//        } else {
//            // This is not a recurring expense, just a regular budget request!
//            var filename = guid + ".xml";
//            if (validateCapexForm2()) {
//                var xmlDocument = createXmlDocument_InitAr(guid);
//                if (xmlDocument == 'FAILED') {
//                    displayAlertDialog('Failed to create XML.');
//                } else {
//                    var projectTitle = document.getElementById('strProjectTitle').value;
//                    var _budgetRequest = [];
//                    var _functionalAreaId = document.getElementById('ddlFunctionalArea').value.split('|')[0];
//                    var _pmAccountId = document.getElementById('txtProjectManagerId').value;
//                    var requestedCapital = document.getElementById('dblRequestedCapital').value.replace(/[^0-9-.]/g, '');
//                    //var requestedExpense = document.getElementById('dblRequestedExpense').value;
//                    var requestedExpense = 0; // Todd: enable this by hiding the field in the init form is the final solution so we can just enable it for enhanced functionality.
//                    var created = getCreatedTimestamp();
//                    var duedate = getDueDateTimestamp();

//                    var isAQuote = false;
//                    if ($('#selectNewRequestFormRequestTypeDropDown option:selected').val() == 'quoterequest') {
//                        isAQuote = true;
//                    }

//                    _budgetRequest = {
//                        //filename: filename,
//                        bwBudgetRequestId: guid.toString(),
//                        bwTenantId: tenantId,
//                        bwWorkflowAppId: workflowAppId,
//                        bwWorkflowId: null,
//                        IsSupplementalRequest: 'false',
//                        RelatedBudgetRequestId: null,

//                        IsRecurringExpense: 'false', // Recurring expense.
//                        RelatedRecurringExpenseId: null, // Recurring expense.

//                        CreatedBy: participantEmail,
//                        CreatedById: participantId,
//                        CreatedByEmail: participantEmail,
//                        bwDocumentXml: xmlDocument.toString(),
//                        ProjectTitle: projectTitle.toString(),
//                        BudgetAmount: null,
//                        RequestedCapital: requestedCapital,
//                        RequestedExpense: requestedExpense,
//                        FunctionalAreaId: _functionalAreaId,
//                        ARStatus: 'Submitted',
//                        BudgetWorkflowStatus: 'Admin', //'Assign Budget',
//                        Quote: isAQuote,
//                        ManagerId: _pmAccountId,
//                        bwWorkflowToken: '0' // 0 signifies the beginning of the workflow.
//                    };
//                    var operationUri = webserviceurl + "/bwbudgetrequests/initbudgetrequest";
//                    $.ajax({
//                        url: operationUri,
//                        type: "POST", timeout: ajaxTimeout,
//                        data: _budgetRequest,
//                        headers: {
//                            "Accept": "application/json; odata=verbose"
//                        },
//                        success: function (data) {
//                            displayAlertDialog('The budget request has been submitted'); // Todd: This message should be coming from the web service.
//                            clearNewBudgetRequestFormFields();
//                            populateStartPageItem('divWelcome', 'Reports', '');
//                        },
//                        error: function (data, errorCode, errorMessage) {
//                            displayAlertDialog('Error creating the budget request in budgetrequests library. ' + JSON.stringify(data));
//                        }
//                    });
//                }
//            } else {
//                // Validation failed for some reason. This is caught in validateCapexForm2 so we don't need to do anything here.
//                // displayAlertDialog('Error: Validation failed for some reason.');
//            }
//        }
//    } catch (e) {
//        displayAlertDialog('Error in my.js.cmdCreateBudgetRequestAndStartWorkflow(): ' + e.message);
//    }
//}


function clearNewBudgetRequestFormFields() {
    // This clears the fields because the request has been submitted. We don't want these to show up opulated when the user goes to submit another one.
    try {
        document.getElementById('strProjectTitle').value = '';
        document.getElementById('strBriefDescriptionOfProject').value = '';
        document.getElementById('dblRequestedCapital').value = '';
        document.getElementById('txtProjectManagerName').value = '';
        document.getElementById('txtProjectManagerId').value = '';
        document.getElementById('txtProjectManagerEmail').value = '';
        document.getElementById('dtEstimatedStartDate').value = '';
        document.getElementById('dtEstimatedEndDate').value = '';
        document.getElementById('inputFile').value = '';
    } catch (e) {
        displayAlertDialog('Error in my.js.clearNewBudgetRequestFormFields().');
    }
}


function populateFunctionalAreas() {
    try {
        var operationUri = webserviceurl + "/getfunctionalareasbyappid/" + workflowAppId + "/" + "RETURNALL";
        $.ajax({
            url: operationUri,
            method: "GET",
            headers: {
                "Accept": "application/json; odata=verbose"
            },
            success: function (data) {
                //var year = document.getElementById('ddlYear').value;
                //var year = '2016'; // todd hardcoded
                var year = new Date().getFullYear().toString(); // todd hardcoded.
                $('#ddlFunctionalArea').empty(); // Clear the previous entries before we populate it.

                var financialAreasToDisplay = [];
                financialAreasToDisplay = new Array();
                //var areThereAnyFasDisplayed = false;
                for (var i = 0; i < data.d.results.length; i++) {
                    if (data.d.results[i].bwFunctionalAreaYear == year) {
                        //$("<option value='" + data.d.results[i].Id + "'>" + data.d.results[i].Title + "</option>").appendTo($('#ddlFunctionalArea'));
                        if (data.d.results[i].IsHidden != 'true') {
                            var tempFa = [];
                            tempFa = new Array(3);
                            tempFa[0] = data.d.results[i].bwFunctionalAreaId;
                            tempFa[1] = data.d.results[i].bwFunctionalAreaQuote;
                            tempFa[2] = data.d.results[i].bwFunctionalAreaTitle;
                            financialAreasToDisplay.push(tempFa);
                            //$("<option value='" + data.d.results[i].bwFunctionalAreaId + "|" + data.d.results[i].bwFunctionalAreaQuote + "'>" + data.d.results[i].bwFunctionalAreaTitle + "</option>").appendTo($('#ddlFunctionalArea'));
                            //areThereAnyFasDisplayed = true;
                        }
                    }
                }
                //if (areThereAnyFasDisplayed == false) {
                if (financialAreasToDisplay.length == 0) {
                    console.log('There are no Financial Areas to choose from for this Budget Request, therefore you cannot submit one at this time.');
                    // go to home page
                    //populateStartPageItem('divWelcome', 'Reports', '');
                } else {
                    // Render the drop down.
                    $("<option value=''>Select a financial area...</option>").appendTo($('#ddlFunctionalArea'));
                    for (var i = 0; i < financialAreasToDisplay.length; i++) {
                        $("<option value='" + financialAreasToDisplay[i][0] + "|" + financialAreasToDisplay[i][1] + "'>" + financialAreasToDisplay[i][2] + "</option>").appendTo($('#ddlFunctionalArea'));
                    }
                }
            },
            error: function (data, errorCode, errorMessage) {
                displayAlertDialog('Error populating functional areas.');
                //WriteToErrorLog('Error in bw.initar.js.populateFunctionalAreas()', 'Error populating functional areas: ' + errorCode + ', ' + errorMessage);
            }
        });
    } catch (e) {
        displayAlertDialog('Error in populateFunctionalAreas(): ' + e.message);
    }
}



function populateFunctionalAreasForAssignBudgetEditForm() {
    //displayAlertDialog('populateFunctionalAreasForAssignBudgetEditForm');
    var operationUri = webserviceurl + "/getfunctionalareasbyappid/" + workflowAppId + "/" + "RETURNALL";
    $.ajax({
        url: operationUri,
        method: "GET",
        headers: {
            "Accept": "application/json; odata=verbose"
        },
        success: function (data) {
            //var year = document.getElementById('ddlYear').value;
            //var year = '2016'; // todd hardcoded
            var year = new Date().getFullYear().toString(); // todd hardcoded.
            $('#ddlFunctionalArea').empty(); // Clear the previous entries before we populate it.

            var financialAreasToDisplay = [];
            financialAreasToDisplay = new Array();
            //var areThereAnyFasDisplayed = false;
            for (var i = 0; i < data.d.results.length; i++) {
                if (data.d.results[i].bwFunctionalAreaYear == year) {
                    //$("<option value='" + data.d.results[i].Id + "'>" + data.d.results[i].Title + "</option>").appendTo($('#ddlFunctionalArea'));
                    if (data.d.results[i].IsHidden != 'true') {
                        var tempFa = [];
                        tempFa = new Array(3);
                        tempFa[0] = data.d.results[i].bwFunctionalAreaId;
                        tempFa[1] = data.d.results[i].bwFunctionalAreaQuote;
                        tempFa[2] = data.d.results[i].bwFunctionalAreaTitle;
                        financialAreasToDisplay.push(tempFa);
                        //$("<option value='" + data.d.results[i].bwFunctionalAreaId + "|" + data.d.results[i].bwFunctionalAreaQuote + "'>" + data.d.results[i].bwFunctionalAreaTitle + "</option>").appendTo($('#ddlFunctionalArea'));
                        //areThereAnyFasDisplayed = true;
                    }
                }
            }
            var selectedFinancialArea = $('span[xd\\:binding = "my:Functional_Area_Id"]')[0].innerHTML;
            for (var i = 0; i < financialAreasToDisplay.length; i++) {
                var a = financialAreasToDisplay[i][0];
                //displayAlertDialog('financialAreasToDisplay[i][0]: x' + financialAreasToDisplay[i][0] + 'x');
                //displayAlertDialog('selectedFinancialArea: x' + selectedFinancialArea + 'x');

                if (a == selectedFinancialArea) {
                    //displayAlertDialog('financialAreasToDisplay[i][0] == selectedFinancialArea');
                    // This option should be selected.
                    $('<option value="' + financialAreasToDisplay[i][0] + '" selected>' + financialAreasToDisplay[i][2] + '</option>').appendTo($('#ddlFunctionalArea'));
                } else {
                    $('<option value="' + financialAreasToDisplay[i][0] + '">' + financialAreasToDisplay[i][2] + '</option>').appendTo($('#ddlFunctionalArea'));
                }
            }
        },
        error: function (data, errorCode, errorMessage) {
            displayAlertDialog('Error in populateFunctionalAreasForAssignBudgetEditForm().');
            //WriteToErrorLog('Error in bw.initar.js.populateFunctionalAreas()', 'Error populating functional areas: ' + errorCode + ', ' + errorMessage);
        }
    });
}

function validateCapexForm2() {
    // This method gets called prior to saving.
    var validation = true;
    // Validate the following fields:
    // Project Title
    if (document.getElementById('strProjectTitle').value == "") {
        validation = false;
        displayAlertDialog('Please enter a "Description" before submitting your request.');
        document.getElementById('strProjectTitle').focus();
    }

    // Category
    //if (validation)
    //    if (document.getElementById('ddlCategory').value == "") {
    //        validation = false;
    //        displayAlertDialog('Please select a "Category" before submitting your request.'); 
    //        document.getElementById('ddlCategory').focus();
    //    }

    // Brief Description of Project
    if (validation)
        if (document.getElementById('strBriefDescriptionOfProject').value == "") {
            if (requireRequestDetails == true) {
                validation = false;
                displayAlertDialog('Please enter some "Details" before submitting your request.');
                document.getElementById('strBriefDescriptionOfProject').focus();
            }
        }

    // Requested Capital
    if (validation)
        try {
            if (document.getElementById('dblRequestedCapital').value == "") {
                validation = false;
                displayAlertDialog('Please enter a value for "Requested Amount" before submitting your request.');
                document.getElementById('dblRequestedCapital').focus();
            } else {
                var x = document.getElementById('dblRequestedCapital').value;
                var y = parseFloat(x.replace(/[^0-9-.]/g, '')); // Removes non-numeric characters (except decimal point and minus sign)
                if (!isNumberGreaterThanZero(y)) {
                    validation = false;
                    displayAlertDialog('Please enter a value greater than zero for "Requested Amount" before submitting your request.');
                    document.getElementById('dblRequestedCapital').value = ''; // clear the textbox before the cursor gets put back into it.
                    document.getElementById('dblRequestedCapital').focus();
                }
            }
        } catch (e) {
            validation = false;
            displayAlertDialog('Please enter a value for "Requested Amount" before submitting your request.');
            document.getElementById('dblRequestedCapital').focus();
        }

    //// Requested Expense
    //if (validation)
    //    try {
    //        if (document.getElementById('dblRequestedExpense').value == "") {
    //            validation = false;
    //            displayAlertDialog('Please enter a value for "Requested Expense" before submitting your request.');
    //            document.getElementById('dblRequestedExpense').focus();
    //        } else {
    //            var x = document.getElementById('dblRequestedExpense').value;
    //            var y = parseFloat(x.replace(/[^0-9-.]/g, '')); // Removes non-numeric characters (except decimal point and minus sign)
    //            //if (!isNumberGreaterThanZero(y)) {
    //            //    validation = false;
    //            //    displayAlertDialog('Please enter a value greater than zero for "Requested Expense" before submitting your request.');
    //            //    document.getElementById('dblRequestedExpense').value = ''; // clear the textbox before the cursor gets put back into it.
    //            //    document.getElementById('dblRequestedExpense').focus();
    //            //}
    //        }
    //    } catch (e) {
    //        validation = false;
    //        displayAlertDialog('Please enter a value for "Requested Expense" before submitting your request.');
    //        document.getElementById('dblRequestedExpense').focus();
    //    }

    // Project Manager
    if (validation) {
        try {
            if (!validateProjectManager()) {
                validation = false;
                displayAlertDialog('Please select a "' + newBudgetRequestManagerTitle + '" before submitting your request.'); // todd add a focus statement here
                //document.getElementById('SPClientPeoplePicker.SPClientPeoplePickerDict.peoplePicker_TopSpan').focus();
            }
        } catch (ex) {
            validation = false;
            displayAlertDialog('Please select a "' + newBudgetRequestManagerTitle + '" before submitting your request.');
        }
    }


    // Year
    if (validation)
        if (document.getElementById('ddlYear').value == "") {
            validation = false;
            displayAlertDialog('Please select a "Year" before submitting your request.');
            document.getElementById('ddlYear').focus();
        }

    // Functional Area
    //displayAlertDialog('selectedIndex: ' + document.getElementById('ddlFunctionalArea').selectedIndex);
    if (validation)
        if (document.getElementById('ddlFunctionalArea').value == "") {
            validation = false;
            displayAlertDialog('Please select a "Financial Area" before submitting your request.');
            document.getElementById('ddlFunctionalArea').focus();
        }

    // Estimated Start Date
    var estimatedStartDate;
    if (validation) {
        //var iPhone;
        //try {
        estimatedStartDate = document.getElementById('dtEstimatedStartDate').value; //document.getElementById('ctl00_PlaceHolderMain_ctl00_dtiEstimatedStartDate_dtiEstimatedStartDateDate').value;
        //    iPhone = false;
        //} catch (e) {
        //    // iPhone uses a different control. This reformats the date string to mm/dd/yyyy.
        //    var myDate = document.getElementById('dtEstimatedStartDate').value;
        //    var arr = myDate.split("-");
        //    estimatedStartDate = arr[1] + '/' + arr[2] + '/' + arr[0];
        //    iPhone = true;
        //}
        // Now that we have the date, validate it.
        try {
            if (estimatedStartDate != "") {
                var dateFromSelection = new Date(estimatedStartDate); // Instantiate the object to see if there are any errors.
                var d = dateFromSelection.getDate();
                var m = dateFromSelection.getMonth();
                var y = dateFromSelection.getFullYear();
                var formulatedDate = new Date(y, m, d);
                if (((formulatedDate.getDate() == d) && (formulatedDate.getMonth() == m) && (formulatedDate.getFullYear() == y))) {
                    var today = new Date(); // It's a valid date, but we need to check if it's before Today!!

                    // Todd added fix #9-8-14-002 to bw.initar.core.js.
                    today.setHours(0, 0, 0, 0);
                    dateFromSelection.setHours(0, 0, 0, 0);

                    if (dateFromSelection < today) {
                        validation = false;
                        displayAlertDialog('Please specify an "Estimated Start Date" which occurs today or in the future before submitting your request.');
                        //if (iPhone == false) document.getElementById('ctl00_PlaceHolderMain_ctl00_dtiEstimatedStartDate_dtiEstimatedStartDateDate').focus();
                    }
                } else {
                    validation = false;
                    displayAlertDialog('Please specify an "Estimated Start Date" before submitting your request.');
                    //if (iPhone == false) document.getElementById('ctl00_PlaceHolderMain_ctl00_dtiEstimatedStartDate_dtiEstimatedStartDateDate').focus();
                }
            } else {
                if (requireStartEndDates == true) {
                    validation = false;
                    displayAlertDialog('Please specify an "Estimated Start Date" before submitting your request.');
                    //if (iPhone == false) document.getElementById('ctl00_PlaceHolderMain_ctl00_dtiEstimatedStartDate_dtiEstimatedStartDateDate').focus();
                }
            }
        } catch (e) {
            validation = false;
            displayAlertDialog('Please specify an "Estimated Start Date" before submitting your request.');
            //if (iPhone == false) document.getElementById('ctl00_PlaceHolderMain_ctl00_dtiEstimatedStartDate_dtiEstimatedStartDateDate').focus();
        }
    }

    // Estimated End Date
    if (validation) {
        var estimatedEndDate;
        //var iPhone;
        //try {
        estimatedEndDate = document.getElementById('dtEstimatedEndDate').value; //document.getElementById('ctl00_PlaceHolderMain_ctl00_dtiEstimatedEndDate_dtiEstimatedEndDateDate').value;
        //    iPhone = false;
        //} catch (e) {
        //    // iPhone uses a different control. This reformats the date string to mm/dd/yyyy.
        //    var myDate = document.getElementById('dtEstimatedEndDate').value;
        //    var arr = myDate.split("-");
        //    estimatedEndDate = arr[1] + '/' + arr[2] + '/' + arr[0];
        //    iPhone = true;
        //}
        // Now that we have the date, validate it.
        try {
            if (estimatedEndDate != "") {
                var dateFromSelection = new Date(estimatedEndDate); // Instantiate the object to see if there are any errors.
                var d = dateFromSelection.getDate();
                var m = dateFromSelection.getMonth();
                var y = dateFromSelection.getFullYear();
                var formulatedDate = new Date(y, m, d);
                if (((formulatedDate.getDate() == d) && (formulatedDate.getMonth() == m) && (formulatedDate.getFullYear() == y))) {
                    var today = new Date(); // It's a valid date, but we need to check if it's before Today!!
                    if (dateFromSelection < today) {
                        validation = false;
                        displayAlertDialog('Please specify an "Estimated End Date" which occurs in the future before submitting your request.');
                        //if (iPhone == false) document.getElementById('ctl00_PlaceHolderMain_ctl00_dtiEstimatedEndDate_dtiEstimatedEndDateDate').focus();
                    } else {
                        var startDate = new Date(estimatedStartDate);
                        if (dateFromSelection < startDate) {
                            validation = false;
                            displayAlertDialog('Please specify an "Estimated End Date" which occurs the same day, or after the "Estimated Start Date" before submitting your request.');
                            //if (iPhone == false) document.getElementById('ctl00_PlaceHolderMain_ctl00_dtiEstimatedEndDate_dtiEstimatedEndDateDate').focus();
                        }
                    }
                } else {
                    validation = false;
                    displayAlertDialog('Please specify an "Estimated End Date" before submitting your request.');
                    //if (iPhone == false) document.getElementById('ctl00_PlaceHolderMain_ctl00_dtiEstimatedEndDate_dtiEstimatedEndDateDate').focus();
                }
            } else {
                if (requireStartEndDates == true) {
                    validation = false;
                    displayAlertDialog('Please specify an "Estimated End Date" before submitting your request.');
                    //if (iPhone == false) document.getElementById('ctl00_PlaceHolderMain_ctl00_dtiEstimatedEndDate_dtiEstimatedEndDateDate').focus();
                }
            }
        } catch (e) {
            validation = false;
            displayAlertDialog('Please specify an "Estimated End Date" before submitting your request.');
            if (iPhone == false) document.getElementById('ctl00_PlaceHolderMain_ctl00_dtiEstimatedEndDate_dtiEstimatedEndDateDate').focus();
        }
    }
    // Attachments *******NOT NECESSARY TO VALIDATE*******

    return validation;
}

function validateNewBudgetRequestFormForRecurringExpense() {
    // This method gets called prior to saving.
    var validation = true;
    // Validate the following fields:
    // Project Title
    if ($('span[xd\\:binding = "my:Project_Name"]')[0].innerHTML == "") {
        validation = false;
        displayAlertDialog('Please enter a "Description" before submitting your request.');
        //document.getElementById('strProjectTitle').focus();
    }


    //displayAlertDialog('In validateNewBudgetRequestFormForRecurringExpense().');

    //var recurringExpenseReminderDate = document.getElementById('dtRecurringExpenseNextReminderDate').value;
    // Estimated Start Date
    var recurringExpenseReminderDate;
    if (validation == true) {
        var iPhone;
        try {
            recurringExpenseReminderDate = document.getElementById('dtRecurringExpenseNextReminderDate').value; //document.getElementById('ctl00_PlaceHolderMain_ctl00_dtiEstimatedStartDate_dtiEstimatedStartDateDate').value;
            iPhone = false;
        } catch (e) {
            // iPhone uses a different control. This reformats the date string to mm/dd/yyyy.
            var myDate = document.getElementById('dtRecurringExpenseNextReminderDate').value;
            var arr = myDate.split("-");
            recurringExpenseReminderDate = arr[1] + '/' + arr[2] + '/' + arr[0];
            if (recurringExpenseReminderDate.indexOf('undefined') > -1) recurringExpenseReminderDate = '';
            iPhone = true;
        }

        //displayAlertDialog('recurringExpenseReminderDate: ' + recurringExpenseReminderDate);

        // Now that we have the date, validate it.
        try {
            if (recurringExpenseReminderDate != "") {
                var dateFromSelection = new Date(recurringExpenseReminderDate); // Instantiate the object to see if there are any errors.
                var d = dateFromSelection.getDate();
                var m = dateFromSelection.getMonth();
                var y = dateFromSelection.getFullYear();
                var formulatedDate = new Date(y, m, d);
                if (((formulatedDate.getDate() == d) && (formulatedDate.getMonth() == m) && (formulatedDate.getFullYear() == y))) {
                    var today = new Date(); // It's a valid date, but we need to check if it's before Today!!

                    // Todd added fix #9-8-14-002 to bw.initar.core.js.
                    today.setHours(0, 0, 0, 0);
                    dateFromSelection.setHours(0, 0, 0, 0);

                    if (dateFromSelection <= today) {
                        validation = false;
                        displayAlertDialog('Please specify an "Reminder Date" which occurs in the future before submitting your request.');
                        //if (iPhone == false) document.getElementById('ctl00_PlaceHolderMain_ctl00_dtiEstimatedStartDate_dtiEstimatedStartDateDate').focus();
                    }
                } else {
                    validation = false;
                    displayAlertDialog('Please specify an "Reminder Date" before submitting your request.');
                    //if (iPhone == false) document.getElementById('ctl00_PlaceHolderMain_ctl00_dtiEstimatedStartDate_dtiEstimatedStartDateDate').focus();
                }
            } else {
                //if (requireStartEndDates == true) {
                validation = false;
                displayAlertDialog('Please specify an "Reminder Date" before submitting your request.');
                //if (iPhone == false) document.getElementById('ctl00_PlaceHolderMain_ctl00_dtiEstimatedStartDate_dtiEstimatedStartDateDate').focus();
                //}
            }
        } catch (e) {
            validation = false;
            displayAlertDialog('Please specify an "Reminder Date" before submitting your request.');
            //if (iPhone == false) document.getElementById('ctl00_PlaceHolderMain_ctl00_dtiEstimatedStartDate_dtiEstimatedStartDateDate').focus();
        }
    }




    // Category
    //if (validation)
    //    if (document.getElementById('ddlCategory').value == "") {
    //        validation = false;
    //        displayAlertDialog('Please select a "Category" before submitting your request.'); 
    //        document.getElementById('ddlCategory').focus();
    //    }

    // Brief Description of Project
    if (validation)
        if (document.getElementById('strBriefDescriptionOfProject').value == "") {
            if (requireRequestDetails == true) {
                validation = false;
                displayAlertDialog('Please enter some "Details" before submitting your request.');
                document.getElementById('strBriefDescriptionOfProject').focus();
            }
        }

    // Requested Capital
    if (validation)
        try {
            //my:Requested_Capital
            if ($('span[xd\\:binding = "my:Requested_Capital"]')[0].innerHTML == "") {
                validation = false;
                displayAlertDialog('Please enter a value for "Requested Capital" before submitting your request.');
                //document.getElementById('dblRequestedCapital').focus();
            } else {
                var x = $('span[xd\\:binding = "my:Requested_Capital"]')[0].innerHTML;
                var y = parseFloat(x.replace(/[^0-9-.]/g, '')); // Removes non-numeric characters (except decimal point and minus sign)
                if (!isNumberGreaterThanZero(y)) {
                    validation = false;
                    displayAlertDialog('Please enter a value greater than zero for "Requested Capital" before submitting your request.');
                    //document.getElementById('dblRequestedCapital').value = ''; // clear the textbox before the cursor gets put back into it.
                    //document.getElementById('dblRequestedCapital').focus();
                }
            }
        } catch (e) {
            validation = false;
            displayAlertDialog('Please enter a value for "Requested Capital" before submitting your request.');
            //document.getElementById('dblRequestedCapital').focus();
        }

    //// Requested Expense
    //if (validation)
    //    try {
    //        if (document.getElementById('dblRequestedExpense').value == "") {
    //            validation = false;
    //            displayAlertDialog('Please enter a value for "Requested Expense" before submitting your request.');
    //            document.getElementById('dblRequestedExpense').focus();
    //        } else {
    //            var x = document.getElementById('dblRequestedExpense').value;
    //            var y = parseFloat(x.replace(/[^0-9-.]/g, '')); // Removes non-numeric characters (except decimal point and minus sign)
    //            //if (!isNumberGreaterThanZero(y)) {
    //            //    validation = false;
    //            //    displayAlertDialog('Please enter a value greater than zero for "Requested Expense" before submitting your request.');
    //            //    document.getElementById('dblRequestedExpense').value = ''; // clear the textbox before the cursor gets put back into it.
    //            //    document.getElementById('dblRequestedExpense').focus();
    //            //}
    //        }
    //    } catch (e) {
    //        validation = false;
    //        displayAlertDialog('Please enter a value for "Requested Expense" before submitting your request.');
    //        document.getElementById('dblRequestedExpense').focus();
    //    }

    // Project Manager
    if (validation) {
        try {
            if ($('span[xd\\:binding = "my:Project_Manager_AccountId"]')[0].innerHTML == "") {
                validation = false;
                displayAlertDialog('Please select a "' + newBudgetRequestManagerTitle + '" before submitting your request.');
                //document.getElementById('dblRequestedCapital').focus();
            }

            //if (!validateProjectManager()) {

            //    var managername = document.getElementById('txtProjectManagerName').value;
            //    //displayAlertDialog('managername:' + managername);

            //    if (managername != '') result = true;


            //    validation = false;
            //    displayAlertDialog('Please select a "' + newBudgetRequestManagerTitle + '" before submitting your request.'); // todd add a focus statement here
            //    //document.getElementById('SPClientPeoplePicker.SPClientPeoplePickerDict.peoplePicker_TopSpan').focus();
            //}
        } catch (ex) {
            validation = false;
            displayAlertDialog('Please select a "' + newBudgetRequestManagerTitle + '" before submitting your request.');
        }
    }


    // Year
    //if (validation)
    //    if (document.getElementById('ddlYear').value == "") {
    //        validation = false;
    //        displayAlertDialog('Please select a "Year" before submitting your request.');
    //        document.getElementById('ddlYear').focus();
    //    }

    // Functional Area
    //displayAlertDialog('selectedIndex: ' + document.getElementById('ddlFunctionalArea').selectedIndex);
    //if (validation)
    //    if (document.getElementById('ddlFunctionalArea').value == "") {
    //        validation = false;
    //        displayAlertDialog('Please select a "Financial Area" before submitting your request.');
    //        document.getElementById('ddlFunctionalArea').focus();
    //    }

    // Estimated Start Date
    var estimatedStartDate;
    if (validation) {
        var iPhone;
        try {
            estimatedStartDate = document.getElementById('dtEstimatedStartDate').value; //document.getElementById('ctl00_PlaceHolderMain_ctl00_dtiEstimatedStartDate_dtiEstimatedStartDateDate').value;
            iPhone = false;
        } catch (e) {
            // iPhone uses a different control. This reformats the date string to mm/dd/yyyy.
            var myDate = document.getElementById('dtEstimatedStartDate').value;
            var arr = myDate.split("-");
            estimatedStartDate = arr[1] + '/' + arr[2] + '/' + arr[0];
            if (estimatedStartDate.indexOf('undefined') > -1) estimatedStartDate = '';
            iPhone = true;
        }
        // Now that we have the date, validate it.
        try {
            if (estimatedStartDate != "") {
                var dateFromSelection = new Date(estimatedStartDate); // Instantiate the object to see if there are any errors.
                var d = dateFromSelection.getDate();
                var m = dateFromSelection.getMonth();
                var y = dateFromSelection.getFullYear();
                var formulatedDate = new Date(y, m, d);
                if (((formulatedDate.getDate() == d) && (formulatedDate.getMonth() == m) && (formulatedDate.getFullYear() == y))) {
                    var today = new Date(); // It's a valid date, but we need to check if it's before Today!!

                    // Todd added fix #9-8-14-002 to bw.initar.core.js.
                    today.setHours(0, 0, 0, 0);
                    dateFromSelection.setHours(0, 0, 0, 0);

                    if (dateFromSelection < today) {
                        validation = false;
                        displayAlertDialog('Please specify an "Estimated Start Date" which occurs today or in the future before submitting your request.');
                        //if (iPhone == false) document.getElementById('ctl00_PlaceHolderMain_ctl00_dtiEstimatedStartDate_dtiEstimatedStartDateDate').focus();
                    }
                } else {
                    validation = false;
                    displayAlertDialog('Please specify an "Estimated Start Date" before submitting your request.');
                    //if (iPhone == false) document.getElementById('ctl00_PlaceHolderMain_ctl00_dtiEstimatedStartDate_dtiEstimatedStartDateDate').focus();
                }
            } else {
                if (requireStartEndDates == true) {
                    validation = false;
                    displayAlertDialog('Please specify an "Estimated Start Date" before submitting your request.');
                    //if (iPhone == false) document.getElementById('ctl00_PlaceHolderMain_ctl00_dtiEstimatedStartDate_dtiEstimatedStartDateDate').focus();
                }
            }
        } catch (e) {
            validation = false;
            displayAlertDialog('Please specify an "Estimated Start Date" before submitting your request.');
            //if (iPhone == false) document.getElementById('ctl00_PlaceHolderMain_ctl00_dtiEstimatedStartDate_dtiEstimatedStartDateDate').focus();
        }
    }

    // Estimated End Date
    if (validation) {
        var estimatedEndDate;
        var iPhone;
        try {
            estimatedEndDate = document.getElementById('dtEstimatedEndDate').value; //document.getElementById('ctl00_PlaceHolderMain_ctl00_dtiEstimatedEndDate_dtiEstimatedEndDateDate').value;
            iPhone = false;
        } catch (e) {
            // iPhone uses a different control. This reformats the date string to mm/dd/yyyy.
            var myDate = document.getElementById('dtEstimatedEndDate').value;
            var arr = myDate.split("-");
            estimatedEndDate = arr[1] + '/' + arr[2] + '/' + arr[0];
            if (estimatedEndDate.indexOf('undefined') > -1) estimatedEndDate = '';
            iPhone = true;
        }
        // Now that we have the date, validate it.
        try {
            if (estimatedEndDate != "") {
                var dateFromSelection = new Date(estimatedEndDate); // Instantiate the object to see if there are any errors.
                var d = dateFromSelection.getDate();
                var m = dateFromSelection.getMonth();
                var y = dateFromSelection.getFullYear();
                var formulatedDate = new Date(y, m, d);
                if (((formulatedDate.getDate() == d) && (formulatedDate.getMonth() == m) && (formulatedDate.getFullYear() == y))) {
                    var today = new Date(); // It's a valid date, but we need to check if it's before Today!!
                    if (dateFromSelection < today) {
                        validation = false;
                        displayAlertDialog('Please specify an "Estimated End Date" which occurs in the future before submitting your request.');
                        //if (iPhone == false) document.getElementById('ctl00_PlaceHolderMain_ctl00_dtiEstimatedEndDate_dtiEstimatedEndDateDate').focus();
                    } else {
                        var startDate = new Date(estimatedStartDate);
                        if (dateFromSelection < startDate) {
                            validation = false;
                            displayAlertDialog('Please specify an "Estimated End Date" which occurs the same day, or after the "Estimated Start Date" before submitting your request.');
                            //if (iPhone == false) document.getElementById('ctl00_PlaceHolderMain_ctl00_dtiEstimatedEndDate_dtiEstimatedEndDateDate').focus();
                        }
                    }
                } else {
                    validation = false;
                    displayAlertDialog('Please specify an "Estimated End Date" before submitting your request.');
                    //if (iPhone == false) document.getElementById('ctl00_PlaceHolderMain_ctl00_dtiEstimatedEndDate_dtiEstimatedEndDateDate').focus();
                }
            } else {
                if (requireStartEndDates == true) {
                    validation = false;
                    displayAlertDialog('Please specify an "Estimated End Date" before submitting your request.');
                    //if (iPhone == false) document.getElementById('ctl00_PlaceHolderMain_ctl00_dtiEstimatedEndDate_dtiEstimatedEndDateDate').focus();
                }
            }
        } catch (e) {
            validation = false;
            displayAlertDialog('Please specify an "Estimated End Date" before submitting your request.');
            if (iPhone == false) document.getElementById('ctl00_PlaceHolderMain_ctl00_dtiEstimatedEndDate_dtiEstimatedEndDateDate').focus();
        }
    }
    // Attachments *******NOT NECESSARY TO VALIDATE*******

    return validation;
}

function validateSupplementalRequest() {
    // This method gets called prior to saving.
    var validation = true;
    // Validate the following fields:
    // Project Title
    if (document.getElementById('strProjectTitle').value == "") {
        validation = false;
        displayAlertDialog('Please enter a "Description" before submitting your request.');
        document.getElementById('strProjectTitle').focus();
    }

    // Category
    //if (validation)
    //    if (document.getElementById('ddlCategory').value == "") {
    //        validation = false;
    //        displayAlertDialog('Please select a "Category" before submitting your request.'); 
    //        document.getElementById('ddlCategory').focus();
    //    }

    // Brief Description of Project
    if (validation)
        if (document.getElementById('strBriefDescriptionOfProject').value == "") {
            if (requireRequestDetails == true) {
                validation = false;
                displayAlertDialog('Please enter some "Details" before submitting your request.');
                document.getElementById('strBriefDescriptionOfProject').focus();
            }
        }

    // Requested Capital
    if (validation)
        try {
            if (document.getElementById('dblRequestedCapital').value == "") {
                validation = false;
                displayAlertDialog('Please enter a value for "Requested Amount" before submitting your request.');
                document.getElementById('dblRequestedCapital').focus();
            } else {
                var x = document.getElementById('dblRequestedCapital').value;
                var y = parseFloat(x.replace(/[^0-9-.]/g, '')); // Removes non-numeric characters (except decimal point and minus sign)
                if (!isNumberGreaterThanZero(y)) {
                    validation = false;
                    displayAlertDialog('Please enter a value greater than zero for "Requested Amount" before submitting your request.');
                    document.getElementById('dblRequestedCapital').value = ''; // clear the textbox before the cursor gets put back into it.
                    document.getElementById('dblRequestedCapital').focus();
                }
            }
        } catch (e) {
            validation = false;
            displayAlertDialog('Please enter a value for "Requested Amount" before submitting your request.');
            document.getElementById('dblRequestedCapital').focus();
        }

    // Attachments *******NOT NECESSARY TO VALIDATE*******

    return validation;
}

function validateProjectManager() {
    // Call EnsureUser to make sure the Project Manager is a valid user.
    var result = false;
    try {
        var managername = document.getElementById('txtProjectManagerName').value;
        //displayAlertDialog('managername:' + managername);

        if (managername != '') result = true;
        //var projectManagerPeoplePicker = SPClientPeoplePicker.SPClientPeoplePickerDict.peoplePicker_TopSpan;
        //var users = projectManagerPeoplePicker.GetAllUserInfo();
        //var projectManagerUser = users[0];
        //var displayName = projectManagerUser['DisplayText'];
        ////var accountId = projectManagerUser['Description']; // email address
        //var accountId = projectManagerUser['Key'];
        //var accountType = projectManagerUser['EntityType'];
        ////var key = projectManager['Key']; // eg: i#:blahblah:someone@capexworkflow.com
        ////doc += '<my:Project_Manager_Hidden>';
        ////doc += displayName;
        ////doc += '</my:Project_Manager_Hidden>';
        return result;
    } catch (ex) {
        return false;
    }
}



$(document).ready(function () {
    try {
        console.log('In index.js.document.ready().');
        // This is at the end of the file, so that we ensure the whole thing is loaded before calling page_load().

        console.log('In index.js.document.ready(). Setting timeout value in ajaxSetup().')
        $.ajaxSetup({
            cache: false,
            timeout: 10000
        });
        //debugger;
        // todo: 10-18-2020 WE NEED TO GO AND ADD THE SETCOOKIE VALUES <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<



        //
        // Reload the script elements with a new source url.
        // THIS IS AWESOME FOR DEVELOPMENT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! NO CACHING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // Doesn't work in Edge, btu may work in Firefox... testing... 4-8-2022
        //
        var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        var elements = $('script');
        if (!elements) {
            alert('Error in my3.js.document.ready(). No script elements found.');
        } else {

            var searchString = '.js?v=xcx04052022-135'; // We want to replace this.
            for (var i = 0; i < elements.length; i++) {
                var src = $(elements[i]).attr('src'); // var bwWorkflowAppId = document.getElementById('tableSentEmail1').getAttribute('bwworkflowappid');
                if (src) {
                    if (src.indexOf(searchString) > -1) {
                        //debugger;
                        var startIndex = src.indexOf(searchString);
                        var endIndex = startIndex + searchString.length;
                        var prefix = src.substring(0, startIndex);
                        var suffix = src.substring(endIndex);
                        var result = prefix + '.js?v=xcx' + guid + suffix;
                        $(elements[i]).attr('src', result);
                    }
                }
            }

        }
        //
        // end: Reload the script elements with a new source url.
        //

        //alert('Calling page_Load().');
        page_Load();

        //var userSelectedDevicePlatform = getCookie('userselecteddeviceplatform'); // DESKTOP, IOS8
        //if (userSelectedDevicePlatform && userSelectedDevicePlatform == 'IOS8') {
        //    window.location = globalUrlPrefix + globalUrl + '/ios8.html'; // iPhone automatically goes to the ios8.html page. Incorporate a cookie so we can remember on this device what the user wishes to do!!!
        //} else if (userSelectedDevicePlatform && userSelectedDevicePlatform == 'DESKTOP') {
        //    page_Load();
        //    //} else if (navigator.userAgent.match(/iPhone/i)) {
        //    //window.location = globalUrlPrefix + globalUrl + '/ios8.html'; // iPhone automatically goes to the ios8.html page. Incorporate a cookie so we can remember on this device what the user wishes to do!!!
        //} else {
        //    //var error = new Error('Unexpected value for cookie userselecteddeviceplatform: ' + userSelectedDevicePlatform);
        //    //throw error;ajax
        //    page_Load();
        //}




    } catch (e) {
        console.log('Exception in index.js.document.ready()', e.message + ', ' + e.stack);
        handleExceptionWithAlert('Exception in index.js.document.ready()', e.message + ', ' + e.stack);
    }
});
