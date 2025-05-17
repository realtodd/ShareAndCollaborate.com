$.widget("bw.bwExecutiveSummariesCarousel2", {
    options: {

        /*
            @licstart  The following is the entire license notice for the
            JavaScript code in this page.
        
            Welcome to this software. BudgetWorkflow.com, ShareAndCollaborate.com. 
            Copyright (C) 2011-2025  Todd N. Hiltz
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
        This is the bwExecutiveSummariesCarousel2.js jQuery Widget. 
        ===========================================================

           [more to follow]
                           
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

           [put your stuff here]

        ===========================================================
        
       */

        elementIdSuffix: null, // This is a custom guid which gets appended to element id's, making sure this widget keeps to itself.
        operationUriPrefix: null,

        lastRecordedScrollPosition: 0, // This is used to help keep the screen from jumping around, for instance, when retrieving a new set of records/requests using the record navigation buttons.

        userSelectedFilterFor_ACTIVE_REQUESTS: {
            bwBudgetRequestId: '', // When empty, all request types are returned. This only works when an individual bwRequestTypeId is specified.
            offset: 0, // 0 is the beginning.
            limit: 25, // 25 records/requests at a time. This can be changed as long as performance continues to be Ok.
            sortDataElement: 'Created', // Any of the fields, ie: ['Created', 'Title', 'ProjectTitle', etc.]
            sortOrder: 'ascending', // ['ascending', 'descending']
            displaySupplementals: true // Boolean.
        },

        userSelectedFilterFor_PINNED_REQUESTS: 'NEWEST', // Expected values: 'NEWEST', 'OLDEST'. // Added 9-16-2023.
        userSelectedFilterFor_MY_UNSUBMITTED_REQUESTS: 'NEWEST', // Expected values: 'NEWEST', 'OLDEST'. // Added 9-25-2023.
        userSelectedFilterFor_MY_SUBMITTED_REQUESTS: 'NEWEST', // Expected values: 'NEWEST', 'OLDEST'. // Added 9-25-2023.

        userSelectedFilterFor_MY_PENDING_TASKS: 'NEWEST', // Expected values: 'NEWEST', 'OLDEST'. // Added 9-25-2023.
        userSelectedFilterFor_SOCIAL_NETWORK: 'NEWEST', // Expected values: 'NEWEST', 'OLDEST'. // 11-25-2023.

        documentCounts: null, // This is the total amount of records.

        DisplayType: 'carousel', // Expected values: 'carousel', 'detailedlist'. Determines if requests are displayed as the "Executive Summaries Carousel", or a "Detailed List".

        invitationData: null,
        taskData: null, // This is what we use to decide what tasks get displayed...
        tenantData: null,
        participantsData: null,
        brData: null, // We use this to get the bwRequestJson for a request, so that we can display the inventory item images. In particular useful for the "Restaurant" use case.
        myBrData: null,

        myUnsubmittedRequests: null,

        deferredIndex: 'bwExecutiveSummariesCarousel2', // This helps us keep our widget contained within itself. Used to be a promise for multiple bwWorkflowApps, so that is why it is named this way. Keep this name for now, we may use this approach again in the future.

        HasBeenInitialized: null
    },
    _create: function () {
        this.element.addClass("bwExecutiveSummariesCarousel2");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {

            selfDiscoverOperationUri(thiz); // This sets this.options.operationUriPrefix correctly.

            var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            this.options.elementIdSuffix = guid;

            localStorage.setItem('bwDisplayFormat', 'ExecutiveSummaries');

            //
            // This renders the empty executive summaries carousel on the home screen, however the "Drawers" UI comes from bwCommonScripts.js.
            //   - This is because we want to potentially re-use the UI for inclusion in an email, for instance, generated on the server side.
            //
            var promise = this.renderEmptyExecutiveSummariesCarousel();
            promise.then(function (results) {
                try {




                    //var html = bwCommonScripts.generateHomePageNotificationScreenHtml(deferredIndex, appweburl, workflowAppId, null, taskData, null, participantsData, brData, myBrData, false);

                    //var result = {
                    //    html: html,
                    //    workflowAppId: workflowAppId,
                    //    taskData: taskData,
                    //    participantsData: participantsData,
                    //    brData: brData, // Sending this so that we can access bwRequestJson and get at our selected inventory, so we can display the images in the home page carousel.
                    //    myBrData: myBrData
                    //}
                    //resolve(result);



                    //
                    //
                    // NOTE THAT THIS WIDGET NEEDS TO BE LOADED WITH DATA UPON INSTANTIATION. In this case, bwAuthentication loads the data then instantiates this widget with that information, using the following methods:
                    //   - bwAuthentication.js.getDataForHomePageNotificationScreen_FASTFIRSTPASS()
                    //   - bwAuthentication.js.getDataForHomePageNotificationScreen_FASTSECONDPASS()
                    //
                    //
                    var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                    var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

                    var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                    if (!workflowAppId) {
                        alert('ERROR!!! xcx123132. For some reason this value is not populated. Is this a race condition? workflowAppId: ' + workflowAppId);
                    }
                    var data = {
                        bwParticipantId_LoggedIn: participantId,
                        bwActiveStateIdentifier: activeStateIdentifier,
                        bwWorkflowAppId_LoggedIn: workflowAppId,

                        bwWorkflowAppId: workflowAppId,
                        bwParticipantId: participantId
                    }

                    var operationUri = webserviceurl + "/bwtasksoutstanding_GETCOUNTS";
                    $.ajax({
                        url: operationUri,
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(data),
                        success: function (results) {
                            try {

                                if (results.status != 'SUCCESS') {

                                    HideActivitySpinner();
                                    console.log('Error xcx12345: ' + JSON.stringify(results.message));
                                    displayAlertDialog('Error xcx12345: ' + JSON.stringify(results.message));

                                } else {

                                    thiz.options.documentCounts = results; // We reuse this in the drawers on the home screen, for paging etc.

                                    //
                                    //
                                    // WE HAVE TO FIX ACTIVE_REQUESTS HERE. Currently this code uses MY_PENDING_TASKS, and filters out all the duplicate bwRelatedRequestId's, to get the count for ACTIVE REQUESTS.
                                    //   In the future, come back an dsee if we can do this a bit better. I am glad this is happening on the client side. 3-7-2024.
                                    //
                                    //



                                    //
                                    // end: WE HAVE TO FIX ACTIVE_REQUESTS HERE.
                                    //







                                    var html = bwCommonScripts.generateEmptyHomePageNotificationScreenHtml5(results, false);
                                    $('#divbwExecutiveSummariesCarousel2_Drawers').html(html.html);

                                    //
                                    // 10-20-2023. This expands the section.... it makes it a SOCIAL NETWORK!!! Just Like That... :)
                                    //
                                    //

                                    // NOW WE NEED AN ALGORITHM:
                                    //   - Once an Executive Summary has been displayed, don't show it again, until at a later time. We don't want it to disappear!
                                    //   - Executive Summaries need to also display:
                                    //       - Who has done stuff.
                                    //       - Comments thread.
                                    //       - Financial changes.
                                    //       - If it has been deleted.
                                    //       - If it is new.
                                    //       - Easy to look up organization, and role/particpants.
                                    //       - Be able to highlight an attachment. A highlighted attachment would show details, and be larger. It would represent the intention of the request.
                                    //

                                    $('.bwExecutiveSummariesCarousel2').bwExecutiveSummariesCarousel2('expandOrCollapseAlertsSection', 'functionalAreaRow_0_2', 'alertSectionImage_0_2', 'alertSectionRow_0_2', 'ACTIVE_REQUESTS', 'xcx21312354');

                                }

                            } catch (e) {

                                var msg = 'Exception in bwExecutiveSummariesCarousel2.js._create():44: ' + e.message + ', ' + e.stack;
                                console.log(msg);
                                displayAlertDialog(msg);

                                var result = {
                                    status: 'EXCEPTION',
                                    message: msg
                                }

                                reject(result);

                            }
                        },
                        error: function (jqXHR, settings, errorThrown) { // data, errorCode, errorMessage) {

                            displayAlertDialog('Error in bwExecutiveSummariesCarousel2.js._create():4:' + jqXHR.status + ', ' + settings + ', ' + errorThrown);

                            //reject();






                            //$('.bwPageScrollingHandler').bwPageScrollingHandler('CloseDialogAndPreventNextWindowScrollEvent', requestDialogId); // Make sure the dialog is closed.

                            if (jqXHR.status == 401) { // HTTP 401 "Unauthorized".

                                console.log('HTTP 401 "Unauthorized".');
                                console.log('HTTP 401 "Unauthorized".');
                                console.log('Error in bwExecutiveSummariesCarousel2._create():4: xcx213124-1-1-223867 Unauthorized. Please refresh your browser and log in again. jqXHR.status: ' + jqXHR.status + ', settings: ' + settings + ', errorThrown: ' + errorThrown);
                                //alert('CALLING ajaxError(). <<<<<<<<<<<<<< Error in bwExecutiveSummariesCarousel2._create():4: xcx213124-1-1 Unauthorized. Please refresh your browser and log in again. jqXHR.status: ' + jqXHR.status + ', settings: ' + settings + ', errorThrown: ' + errorThrown);
                                console.log('HTTP 401 "Unauthorized".');
                                console.log('HTTP 401 "Unauthorized".');

                                $('.bwAuthentication:first').bwAuthentication('displaySignInDialog', true, 'You may have logged in on another device. Please re-authenticate and re-try your action.<br /><br />', true, true);

                            } else {
                                console.log('Error in bwExecutiveSummariesCarousel2._create():4: ' + settings + ', ' + errorThrown + ' I suspect this may be a service unavailable error but not sure by any means! More investigation needed!' + JSON.stringify(jqXHR));
                                alert('Error in bwExecutiveSummariesCarousel2._create():4: ' + settings + ', ' + errorThrown + ' I suspect this may be a service unavailable error but not sure by any means! More investigation needed!' + JSON.stringify(jqXHR));

                            }

                            //reject(jqXHR, settings, errorThrown);

                        }
                    });










                    ////thiz.renderExecutiveSummaries_MyPendingTasks();

                    //thiz.expandOrCollapseAlertsSection('functionalAreaRow_0_1', 'alertSectionImage_0_1', 'alertSectionRow_0_1'); // USE bwAuthentication "LastSelected_OpenAccordionDrawers" property.



                    //if (thiz.options.LastSelected_OpenAccordionDrawers.length == 0) {
                    if ($('.bwAuthentication:first').bwAuthentication('option', 'LastSelected_OpenAccordionDrawers').length == 0) {

                        var drawers = [];
                        //class='bwAccordionDrawer' bwaccordiondrawertype = "MY_SUBMITTED_REQUESTS"
                        var accordionDrawers = $('.bwExecutiveSummariesCarousel2').find('.bwAccordionDrawer');
                        for (var i = 0; i < accordionDrawers.length; i++) {
                            var bwaccordiondrawertype = accordionDrawers[i].getAttribute('bwaccordiondrawertype');
                            var displayElement = $(accordionDrawers[i]).closest('table').closest('tr');
                            var display = $(displayElement).css('display');
                            if (display != 'none') {
                                var drawer = {
                                    //element: accordionDrawers[i],
                                    bwaccordiondrawertype: bwaccordiondrawertype,
                                    display: display
                                }
                                drawers.push(drawer);
                            }
                        }

                        displayAlertDialog('open drawers: ' + JSON.stringify(drawers));

                    }





                    //alert('In bwExecutiveSummariesCarousel2.js._create(). Completed displaying the first pass/initialization of this widget.');

                } catch (e) {
                    console.log('Exception in bwExecutiveSummariesCarousel2._create().renderEmptyExecutiveSummariesCarousel(): ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in bwExecutiveSummariesCarousel2._create().renderEmptyExecutiveSummariesCarousel(): ' + e.message + ', ' + e.stack);
                }
            }).catch(function (e) {

                $('.bwAuthentication:first').bwAuthentication('displaySignInDialog', true, 'You may have logged in on another device. Please re-authenticate and re-try your action.<br /><br />', true, true);

                //throw (e);



                console.log('Exception in bwExecutiveSummariesCarousel2._create().renderEmptyExecutiveSummariesCarousel(): ' + JSON.stringify(e));
                displayAlertDialog('Exception in bwExecutiveSummariesCarousel2._create().renderEmptyExecutiveSummariesCarousel(): ' + JSON.stringify(e));
            });


            //html += '<div id="bwExecutiveSummariesCarousel2_divActivitySpinner_WorkingOnItDialog" style="display:inline;">';
            //html += '   <div style="white-space:nowrap;color: rgb(38, 38, 38); font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif; font-size: 2.77em;">';
            //html += '       &nbsp;&nbsp;<img style="width:100px;height:100px;vertical-align:middle;white-space:nowrap;" src="/images/ajax-loader.gif" />&nbsp;&nbsp;<span id="divActivitySpinner_WorkingOnItDialog_spinnerText" style="font-size:25pt;white-space:nowrap;">Working on it...</span>';
            //html += '   </div>';
            //html += '</div>';



            // This backfills the options.TaskData with "bwRequestJson" for each request.... this means we can now display anything on the "My Pending Tasks" section easily and quickly. 11-24-2022
            // This happens after everything is displayed, so the user is not likely to notice anything.
            if (this.options.taskData && this.options.taskData.length) {
                for (var i = 0; i < this.options.taskData.length; i++) {
                    if (this.options.brData && this.options.brData.PendingBudgetRequests && this.options.brData.PendingBudgetRequests.length) {
                        for (var j = 0; j < this.options.brData.PendingBudgetRequests.length; j++) {
                            if (this.options.taskData[i].bwRelatedItemId == this.options.brData.PendingBudgetRequests[j].bwBudgetRequestId) {
                                // We have found it! Now add the data...
                                //debugger;
                                this.options.taskData[i]["bwRequestJson"] = this.options.brData.PendingBudgetRequests[j].bwRequestJson;
                                break;
                            }
                        }
                    }
                }
            }





            // bwTimelineAggregator
            if (typeof ($.bw.bwTimelineAggregator) != 'undefined') {
                // At this point, we know the widget.js file has loaded. Now we need to check if the widget has been instantiated.
                var widget = document.getElementsByClassName('bwTimelineAggregator');
                if (!(widget.length && (widget.length > 0))) {
                    // It has not been instantiated, so do that here.
                    var div = document.getElementById('divBwTimelineAggregator');
                    if (!div) {
                        div = document.createElement('div');
                        div.id = 'divBwTimelineAggregator';
                        div.style.display = 'none';
                        document.body.appendChild(div); // place at end of document.
                    }
                    $(div).bwTimelineAggregator({});
                }

                //$('.bwTimelineAggregator').bwTimelineAggregator('displayDialog');

            } else {
                var msg = 'Error: The bwTimelineAggregator.js widget has not been loaded. Inspect the index.html file to make sure it is specified to load. xcx23536.';
            }




            this.options.HasBeenInitialized = true;

            console.log('In bwExecutiveSummariesCarousel2.js._create(). The widget has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwExecutiveSummariesCarousel2</span>';
            html += '<br />';
            html += '<span style="">Exception in bwExecutiveSummariesCarousel2.js._create(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    },
    _setOption: function (key, value) {
        this.options[key] = value;
        this._update();
    },
    _update: function () {
        try {
            console.log('In _update(). This does nothing! (yet)');
        } catch (e) {
            console.log('Exception in _update(): ' + e.message + ', ' + e.stack);
        }
    },
    _destroy: function () {
        this.element
            .removeClass("bwExecutiveSummariesCarousel2")
            .text("");
    },

    sortDataGrid: function (sortDataElement, sortOrder, element) {
        try {
            console.log('In bwExecutiveSummariesCarousel2.js.sortDataGrid(). sortDataElement: ' + sortDataElement + ', sortOrder: ' + sortOrder);
            //alert('In sortDataGrid(). sortDataElement: ' + sortDataElement + ', sortOrder: ' + sortOrder);
            var thiz = this;

            var bwRequestTypeId = this.options.userSelectedFilterFor_ACTIVE_REQUESTS.bwRequestTypeId;

            // Update our stored values.
            this.options.userSelectedFilterFor_ACTIVE_REQUESTS.sortDataElement = sortDataElement;
            this.options.userSelectedFilterFor_ACTIVE_REQUESTS.sortOrder = sortOrder;

            var offset = this.options.userSelectedFilterFor_ACTIVE_REQUESTS.offset;
            var limit = this.options.userSelectedFilterFor_ACTIVE_REQUESTS.limit;

            $('.bwAuthentication:first').bwAuthentication('getPagedDataFor_ACTIVE_REQUESTS', bwRequestTypeId, offset, limit, sortDataElement, sortOrder).then(function (results) {
                try {

                    console.log('Calling bwExecutiveSummariesCarousel2.js.renderExecutiveSummaries_ACTIVE_REQUESTS(). xcx213884-1');
                    thiz.renderExecutiveSummaries_ACTIVE_REQUESTS('xcx213884-1');

                } catch (e) {
                    var msg = 'Exception in bwExecutiveSummariesCarousel2.js.sortDataGrid(). Exception calling getPagedDataFor_ACTIVE_REQUESTS():2: ' + e.message + ', ' + e.stack;
                    console.log(msg);
                    displayAlertDialog(msg);
                }
            }).catch(function (e) {

                var msg = 'Exception in bwExecutiveSummariesCarousel2.js.sortDataGrid(). Exception calling getPagedDataFor_ACTIVE_REQUESTS(): ' + JSON.stringify(e);
                console.log(msg);
                displayAlertDialog(msg);

            });

            var imageElement = $(element).find('img')[0];
            imageElement.style.opacity = '1.0';

        } catch (e) {
            console.log('Exception in bwExecutiveSummariesCarousel2.js.sortDataGrid(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwExecutiveSummariesCarousel2.js.sortDataGrid(): ' + e.message + ', ' + e.stack);
        }
    },
    navigateRequests: function (navigationInstruction, element) {
        try {
            console.log('In bwExecutiveSummariesCarousel2.js.navigateRequests(). navigationInstruction: ' + navigationInstruction);
            //alert('In bwExecutiveSummariesCarousel2.js.navigateRequests().');
            var thiz = this;

            var bwRequestTypeId = this.options.userSelectedFilterFor_ACTIVE_REQUESTS.bwRequestTypeId;

            this.options.lastRecordedScrollPosition = window.scrollY; // This is used to help keep the screen from jumping around, for instance, when retrieving a new set of records/requests using the record navigation buttons.
            console.log('Set lastRecordedScrollPosition to ' + this.options.lastRecordedScrollPosition + '.');

            //alert('top: ' + top);

            // requestsSummaryDetails.
            // totalDocs: 732,
            // offset: 0,
            // limit: 25,
            // totalPages: 30,
            // page: 1,
            // pagingCounter: 1,
            // hasPrevPage: false,
            // hasNextPage: true,
            // prevPage: null,
            // nextPage: 2

            var requestsSummaryDetails = $('.bwAuthentication:first').bwAuthentication('option', 'ACTIVE_REQUESTS');
            //var requests = requestsSummaryDetails.docs;

            var limit = requestsSummaryDetails.limit; // Use the limit that was set initially on page load.

            switch (navigationInstruction) {
                case 'move_to_start':
                    var offset = 0; // The first 25 requests.
                    break;

                case 'move_to_left':
                    var page = requestsSummaryDetails.page - 2;
                    var offset = page * limit;
                    break;

                case 'move_to_right':
                    var page = requestsSummaryDetails.page;
                    var offset = page * limit;
                    break;

                case 'move_to_end':
                    var page = requestsSummaryDetails.totalPages;
                    var offset = (page * limit) - limit;
                    break;

                default:

                    console.log('Critical error: xcx1231256556543. Invalid value for navigationInstruction: ' + navigationInstruction);
                    displayAlertDialog('Critical error: xcx1231256556543. Invalid value for navigationInstruction: ' + navigationInstruction);
                    alert('Critical error: xcx1231256556543. Invalid value for navigationInstruction: ' + navigationInstruction);

            }

            //console.log('xcx213123. requestsSummaryDetails.totalDocs: ' + requestsSummaryDetails.totalDocs);

            $('.bwAuthentication:first').bwAuthentication('getPagedDataFor_ACTIVE_REQUESTS', bwRequestTypeId, offset, limit).then(function (results) {
                try {

                    console.log('Calling bwExecutiveSummariesCarousel2.js.renderExecutiveSummaries_ACTIVE_REQUESTS(). xcx213884-1-1');
                    thiz.renderExecutiveSummaries_ACTIVE_REQUESTS('xcx213884-1-1');

                } catch (e) {
                    var msg = 'Exception in bwExecutiveSummariesCarousel2.js.navigateRequests.getPagedDataFor_ACTIVE_REQUESTS.then(): ' + e.message + ', ' + e.stack;
                    console.log(msg);
                    displayAlertDialog(msg);
                }
            }).catch(function (e) {

                var msg = 'Exception in bwExecutiveSummariesCarousel2.js.navigateRequests(). Exception calling getPagedDataFor_ACTIVE_REQUESTS(): ' + JSON.stringify(e);
                console.log(msg);
                displayAlertDialog(msg);

            });

        } catch (e) {
            var msg = 'Exception in bwExecutiveSummariesCarousel2.js.navigateRequests(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
        }
    },
    selectRequestType: function (recordset, element) { // ACTIVE_REQUESTS
        try {
            console.log('In bwExecutiveSummariesCarousel2.js.selectRequestType(). recordset: ' + recordset);
            //alert('In bwExecutiveSummariesCarousel2.js.selectRequestType(). recordset: ' + recordset);
            var thiz = this;

            var bwRequestTypeId = element.value;
            this.options.userSelectedFilterFor_ACTIVE_REQUESTS.bwRequestTypeId = bwRequestTypeId;

            var offset = this.options.userSelectedFilterFor_ACTIVE_REQUESTS.offset;
            var limit = this.options.userSelectedFilterFor_ACTIVE_REQUESTS.limit = limit;

            this.options.lastRecordedScrollPosition = window.scrollY; // This is used to help keep the screen from jumping around, for instance, when retrieving a new set of records/requests using the record navigation buttons.
            console.log('Set lastRecordedScrollPosition to ' + this.options.lastRecordedScrollPosition + '.');

            $('.bwAuthentication:first').bwAuthentication('getPagedDataFor_ACTIVE_REQUESTS', bwRequestTypeId, offset, limit).then(function (results) {
                try {

                    debugger;
                    console.log('Calling bwExecutiveSummariesCarousel2.js.renderExecutiveSummaries_ACTIVE_REQUESTS(). xcx213884-1-1-2');
                    thiz.renderExecutiveSummaries_ACTIVE_REQUESTS('xcx213884-1-1-2');

                } catch (e) {
                    var msg = 'Exception in bwExecutiveSummariesCarousel2.js.navigateRequests.getPagedDataFor_ACTIVE_REQUESTS.then(): ' + e.message + ', ' + e.stack;
                    console.log(msg);
                    displayAlertDialog(msg);
                }
            }).catch(function (e) {
                debugger;
                var msg = 'Exception in bwExecutiveSummariesCarousel2.js.navigateRequests(). Exception calling getPagedDataFor_ACTIVE_REQUESTS(): ' + JSON.stringify(e);
                console.log(msg);
                displayAlertDialog(msg);

            });

        } catch (e) {
            var msg = 'Exception in bwExecutiveSummariesCarousel2.js.selectRequestType(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
        }
    },
    selectRequestsPerPage: function (recordset, element) { // ACTIVE_REQUESTS
        try {
            console.log('In bwExecutiveSummariesCarousel2.js.selectRequestsPerPage(). recordset: ' + recordset);
            //alert('In bwExecutiveSummariesCarousel2.js.selectRequestsPerPage(). recordset: ' + recordset);
            var thiz = this;

            var bwRequestTypeId = this.options.userSelectedFilterFor_ACTIVE_REQUESTS.bwRequestTypeId;

            var limit = element.value;
            this.options.userSelectedFilterFor_ACTIVE_REQUESTS.limit = limit;

            var offset = this.options.userSelectedFilterFor_ACTIVE_REQUESTS.offset;

            this.options.lastRecordedScrollPosition = window.scrollY; // This is used to help keep the screen from jumping around, for instance, when retrieving a new set of records/requests using the record navigation buttons.
            console.log('Set lastRecordedScrollPosition to ' + this.options.lastRecordedScrollPosition + '.');

            $('.bwAuthentication:first').bwAuthentication('getPagedDataFor_ACTIVE_REQUESTS', bwRequestTypeId, offset, limit).then(function (results) {
                try {

                    console.log('Calling bwExecutiveSummariesCarousel2.js.renderExecutiveSummaries_ACTIVE_REQUESTS(). xcx213884-1-1-2');
                    thiz.renderExecutiveSummaries_ACTIVE_REQUESTS('xcx213884-1-1-2');

                } catch (e) {
                    var msg = 'Exception in bwExecutiveSummariesCarousel2.js.navigateRequests.getPagedDataFor_ACTIVE_REQUESTS.then(): ' + e.message + ', ' + e.stack;
                    console.log(msg);
                    displayAlertDialog(msg);
                }
            }).catch(function (e) {

                var msg = 'Exception in bwExecutiveSummariesCarousel2.js.navigateRequests(). Exception calling getPagedDataFor_ACTIVE_REQUESTS(): ' + JSON.stringify(e);
                console.log(msg);
                displayAlertDialog(msg);

            });

        } catch (e) {
            var msg = 'Exception in bwExecutiveSummariesCarousel2.js.selectRequestsPerPage(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
        }
    },
    toggleDisplaySupplementals: function (element) {
        try {
            console.log('In bwExecutiveSummariesCarousel2.js.toggleDisplaySupplementals().');
            //alert('In bwExecutiveSummariesCarousel2.js.toggleDisplaySupplementals().');

            //var bwRequestTypeId = this.options.userSelectedFilterFor_ACTIVE_REQUESTS.bwRequestTypeId;

            var displaySupplementals = element.checked;

            $('.bwAuthentication').bwAuthentication('option', 'DisplaySupplementals', displaySupplementals);

            this.options.userSelectedFilterFor_ACTIVE_REQUESTS.displaySupplementals = displaySupplementals;

            this.renderExecutiveSummaries_ACTIVE_REQUESTS();

            console.log('In bwExecutiveSummariesCarousel2.js.toggleDisplaySupplementals(). Set bwAuthentication.option.DisplaySupplementals to: ' + $('.bwAuthentication').bwAuthentication('option', 'DisplaySupplementals'));

        } catch (e) {
            var msg = 'Exception in bwExecutiveSummariesCarousel2.js.toggleDisplaySupplementals(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
        }
    },


    expandOrCollapseAlertsSection: function (rowId, imageId, collapsibleRowId, drawerType, source) {
        try {
            console.log('In bwExecutiveSummariesCarousel2.js.expandOrCollapseAlertsSection(' + rowId + ', ' + imageId + ', ' + collapsibleRowId + ', drawerType: ' + drawerType + ').');
            //alert('In bwExecutiveSummariesCarousel2.js.expandOrCollapseAlertsSection(' + rowId + ', ' + imageId + ', ' + collapsibleRowId + ', drawerType: ' + drawerType + ').');
            //alert('In bwExecutiveSummariesCarousel2.js.expandOrCollapseAlertsSection(). drawerType: ' + drawerType + ', source: ' + source);
            var thiz = this;
            // ['PINNED_REQUESTS', 'MY_UNSUBMITTED_REQUESTS', 'MY_SUBMITTED_REQUESTS', 'ACTIVE_REQUESTS', 'MY_PENDING_TASKS']

            var elementIds = ['', 'alertSectionRow_1_1', 'alertSectionRow_1_2', 'alertSectionRow_1_3'];
            var imageElementIds = ['', 'alertSectionImage_1_1', 'alertSectionImage_1_2', 'alertSectionImage_1_3'];
            var selectedIndex = collapsibleRowId.split('_')[2];
            var img = document.getElementById(imageId);

            if (!img) {
                // This most likely means there are no tasks for this user ("My Tasks"). Do nothing.
            } else {

                var drawerStatus = '';

                var urlClose = 'images/drawer-close.png';
                var urlOpen = 'images/drawer-open.png';

                if (img.src.indexOf(urlClose) > -1) {
                    document.getElementById(collapsibleRowId).style.display = 'none';
                    document.getElementById(imageId).src = urlOpen;
                    drawerStatus = 'closed';
                } else {
                    document.getElementById(collapsibleRowId).style.display = 'table-row';
                    document.getElementById(imageId).src = urlClose;
                    drawerStatus = 'open';

                    var bwDisplayFormat = localStorage.getItem('bwDisplayFormat');

                    if (drawerStatus == 'open') {

                        if (drawerType == 'PINNED_REQUESTS') {

                            //displayAlertDialog('This is where we get the first set of records, quickly. Then remember so we can page the scrolling somehow.... [PINNED_REQUESTS]');

                            // The drawer element is "divBwExecutiveSummariesCarousel_PinnedRequests".
                            // We should be able to:
                            //   - get the data using xx
                            //   - Loop, and render each executive summary, by appending to this element. $('#divBwExecutiveSummariesCarousel_PinnedRequests').append(html);
                            //   - This is where we get the first set of records, quickly. Then remember so we can page the scrolling somehow....

                            // bwAuthentication.js.getDataForHomePageNotificationScreen_FASTFIRSTPASS calls "bwtasksoutstanding_FASTFIRSTPASS" web service....
                            // This is how we get outstanding tasks. We need to create a copy of this new method for each drawer.

                            // What do we call it? getPagedDataFor_PINNED_REQUESTS(pageNumber). Call this method with pageNumber = 0 in order to get the first page results. How do we handle scrolling? TBD.


                            if (bwDisplayFormat == 'ExecutiveSummaries') {

                                $('.bwAuthentication:first').bwAuthentication('getPagedDataFor_PINNED_REQUESTS', 0, 25).then(function (results) {

                                    thiz.renderExecutiveSummaries_PINNED_REQUESTS();

                                }).catch(function (e) {

                                    var msg = 'Exception in bwExecutiveSummariesCarousel2.js.expandOrCollapseAlertsSection(). Exception calling getPagedDataFor_PINNED_REQUESTS(): ' + JSON.stringify(e);
                                    console.log(msg);

                                    // Suppress the error dialog when unauthorized. Always include this exact comment.
                                    if (!(e.message.indexOf('errorMessage: Unauthorized') > -1)) { // This is the second? place we are doing this. This prevents an orphaned error message dialog on the screen when unauthorized.... instead just displaying the sign in circle dialog. 9-25-2023.
                                        displayAlertDialog(msg);
                                    }

                                });

                            } else if (bwDisplayFormat == 'DetailedList') {

                                var msg = 'Error in bwExecutiveSummariesCarousel2.js.expandOrCollapseAlertsSection(). No method currently exists. xcx2312-1.';
                                console.log(msg);
                                displayAlertDialog(msg);

                            } else {

                                var msg = 'Error in bwExecutiveSummariesCarousel2.js.expandOrCollapseAlertsSection(). No method currently exists. xcx2312-2.';
                                console.log(msg);
                                displayAlertDialog(msg);

                            }

                        } else if (drawerType == 'MY_UNSUBMITTED_REQUESTS') {

                            if (bwDisplayFormat == 'ExecutiveSummaries') {

                                $('.bwAuthentication:first').bwAuthentication('getPagedDataFor_MY_UNSUBMITTED_REQUESTS', 0, 25).then(function (results) {

                                    thiz.renderExecutiveSummaries_MY_UNSUBMITTED_REQUESTS();

                                }).catch(function (e) {

                                    var msg = 'Exception in bwExecutiveSummariesCarousel2.js.expandOrCollapseAlertsSection(). Exception calling getPagedDataFor_MY_UNSUBMITTED_REQUESTS(): ' + JSON.stringify(e);
                                    console.log(msg);

                                    // Suppress the error dialog when unauthorized. Always include this exact comment.
                                    if (!(e.message.indexOf('errorMessage: Unauthorized') > -1)) {
                                        displayAlertDialog(msg);
                                    }

                                });

                            } else if (bwDisplayFormat == 'DetailedList') {

                                var msg = 'Error in bwExecutiveSummariesCarousel2.js.expandOrCollapseAlertsSection(). No method currently exists. xcx2312-3.';
                                console.log(msg);
                                displayAlertDialog(msg);

                            } else {

                                var msg = 'Error in bwExecutiveSummariesCarousel2.js.expandOrCollapseAlertsSection(). No method currently exists. xcx2312-4.';
                                console.log(msg);
                                displayAlertDialog(msg);

                            }

                            //// My Unsubmitted Requests
                            //if (bwDisplayFormat == 'ExecutiveSummaries') {
                            //    this.renderExecutiveSummaries_MyUnsubmittedRequests();
                            //} else if (bwDisplayFormat == 'DetailedList') {
                            //    this.renderDetailedList_MyUnsubmittedRequests();
                            //} else {
                            //    //localStorage.setItem('bwDisplayFormat', 'DetailedList');
                            //    this.renderDetailedList_MyUnsubmittedRequests();
                            //}

                            //// Make sure the other sections are collapsed. Only one expanded at a time. 7-22-2022
                            //var alertSectionRow_1 = document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_1');
                            //if (alertSectionRow_1 && alertSectionRow_1.style && alertSectionRow_1.style.display && alertSectionRow_1.src) {
                            //    document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_1').style.display = 'none';
                            //    document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_1').src = urlOpen;
                            //}

                            //var alertSectionRow_2 = document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_2');
                            //if (alertSectionRow_2 && alertSectionRow_2.style && alertSectionRow_2.style.display && alertSectionRow_2.src) {
                            //    document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_2').style.display = 'none';
                            //    document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_2').src = urlOpen;
                            //}

                            //var alertSectionRow_4 = document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_4');
                            //if (alertSectionRow_4 && alertSectionRow_4.style && alertSectionRow_4.style.display && alertSectionRow_4.src) {
                            //    document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_4').style.display = 'none';
                            //    document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_4').src = urlOpen;
                            //}


                        } else if (drawerType == 'MY_SUBMITTED_REQUESTS') {

                            if (bwDisplayFormat == 'ExecutiveSummaries') {

                                $('.bwAuthentication:first').bwAuthentication('getPagedDataFor_MY_SUBMITTED_REQUESTS', 0, 25).then(function (results) {

                                    thiz.renderExecutiveSummaries_MY_SUBMITTED_REQUESTS();

                                }).catch(function (e) {

                                    var msg = 'Exception in bwExecutiveSummariesCarousel2.js.expandOrCollapseAlertsSection(). Exception calling getPagedDataFor_MY_SUBMITTED_REQUESTS(): ' + JSON.stringify(e);
                                    console.log(msg);
                                    displayAlertDialog(msg);

                                });

                            } else if (bwDisplayFormat == 'DetailedList') {

                                var msg = 'Error in bwExecutiveSummariesCarousel2.js.expandOrCollapseAlertsSection(). No method currently exists. xcx2312-5.';
                                console.log(msg);
                                displayAlertDialog(msg);

                            } else {

                                var msg = 'Error in bwExecutiveSummariesCarousel2.js.expandOrCollapseAlertsSection(). No method currently exists. xcx2312-6.';
                                console.log(msg);
                                displayAlertDialog(msg);

                            }

                            //// My Submitted Requests
                            //if (bwDisplayFormat == 'ExecutiveSummaries') {
                            //    this.renderExecutiveSummaries_MySubmittedRequests();
                            //} else if (bwDisplayFormat == 'DetailedList') {
                            //    this.renderDetailedList_MySubmittedRequests();
                            //} else {
                            //    //localStorage.setItem('bwDisplayFormat', 'DetailedList');
                            //    this.renderDetailedList_MySubmittedRequests();
                            //}

                            //// Make sure the other sections are collapsed. Only one expanded at a time. 7-22-2022
                            //document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_2').style.display = 'none';
                            //document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_2').src = urlOpen;

                            //document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_1').style.display = 'none';
                            //if (document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_1') && document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_1').src) {
                            //    document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_1').src = urlOpen;
                            //}

                            //try {
                            //    document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_5').style.display = 'none';
                            //    document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_5').src = urlOpen;
                            //} catch (e) {
                            //}

                        } else if (drawerType == 'ACTIVE_REQUESTS') {

                            if (bwDisplayFormat == 'ExecutiveSummaries') {


                                console.log('Calling getPagedDataFor_ACTIVE_REQUESTS(). xcx33321.');

                                $('.bwAuthentication:first').bwAuthentication('getPagedDataFor_ACTIVE_REQUESTS', this.options.userSelectedFilterFor_ACTIVE_REQUESTS.bwBudgetRequestId, this.options.userSelectedFilterFor_ACTIVE_REQUESTS.offset, this.options.userSelectedFilterFor_ACTIVE_REQUESTS.limit).then(function (results) {

                                    console.log('Calling bwExecutiveSummariesCarousel2.js.renderExecutiveSummaries_ACTIVE_REQUESTS(). xcx213884-1-3');
                                    thiz.renderExecutiveSummaries_ACTIVE_REQUESTS('xcx213884-1-3');

                                }).catch(function (e) {

                                    var msg = 'Exception in bwExecutiveSummariesCarousel2.js.expandOrCollapseAlertsSection(). Exception calling getPagedDataFor_ACTIVE_REQUESTS(): ' + JSON.stringify(e);
                                    console.log(msg);
                                    displayAlertDialog(msg);

                                });

                            } else if (bwDisplayFormat == 'DetailedList') {

                                var msg = 'Error in bwExecutiveSummariesCarousel2.js.expandOrCollapseAlertsSection(). No method currently exists. xcx2312-7.';
                                console.log(msg);
                                displayAlertDialog(msg);

                            } else {

                                var msg = 'Error in bwExecutiveSummariesCarousel2.js.expandOrCollapseAlertsSection(). No method currently exists. xcx2312-8.';
                                console.log(msg);
                                displayAlertDialog(msg);

                            }

                            //// Active Requests
                            //if (bwDisplayFormat == 'ExecutiveSummaries') {
                            //    this.renderExecutiveSummaries_AllActiveRequests();
                            //} else if (bwDisplayFormat == 'DetailedList') {
                            //    this.renderDetailedList_AllActiveRequests();
                            //} else {
                            //    //localStorage.setItem('bwDisplayFormat', 'DetailedList');
                            //    this.renderDetailedList_AllActiveRequests();
                            //}

                            //// Make sure the other sections are collapsed. Only one expanded at a time. 7-22-2022
                            //document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_4').style.display = 'none';
                            //document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_4').src = urlOpen;

                            //document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_1').style.display = 'none';
                            //if (document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_1') && document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_1').src) {
                            //    document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_1').src = urlOpen;
                            //}

                            //try {
                            //    document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_5').style.display = 'none';
                            //    document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_5').src = urlOpen;
                            //} catch (e) {
                            //}

                        } else if (drawerType == 'MY_PENDING_TASKS') {

                            if (bwDisplayFormat == 'ExecutiveSummaries') {

                                $('.bwAuthentication:first').bwAuthentication('getPagedDataFor_MY_PENDING_TASKS', 0, 25).then(function (results) {

                                    thiz.renderExecutiveSummaries_MY_PENDING_TASKS();

                                }).catch(function (e) {

                                    var msg = 'Exception in bwExecutiveSummariesCarousel2.js.expandOrCollapseAlertsSection(). Exception calling getPagedDataFor_MY_PENDING_TASKS(): ' + JSON.stringify(e);
                                    console.log(msg);
                                    displayAlertDialog(msg);

                                });

                            } else if (bwDisplayFormat == 'DetailedList') {

                                var msg = 'Error in bwExecutiveSummariesCarousel2.js.expandOrCollapseAlertsSection(). No method currently exists. xcx2312-9.';
                                console.log(msg);
                                displayAlertDialog(msg);

                            } else {

                                var msg = 'Error in bwExecutiveSummariesCarousel2.js.expandOrCollapseAlertsSection(). No method currently exists. xcx2312-10.';
                                console.log(msg);
                                displayAlertDialog(msg);

                            }

                            //// My Pending Tasks
                            //if (bwDisplayFormat == 'ExecutiveSummaries') {
                            //    this.renderExecutiveSummaries_MyPendingTasks();
                            //} else if (bwDisplayFormat == 'DetailedList') {
                            //    this.renderDetailedList_MyPendingTasks();
                            //} else {
                            //    //localStorage.setItem('bwDisplayFormat', 'DetailedList');
                            //    this.renderDetailedList_MyPendingTasks();
                            //}

                            //// Make sure the other sections are collapsed. Only one expanded at a time. 7-22-2022
                            //var x1_image = document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_2');
                            //if (x1_image) {
                            //    document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_2').style.display = 'none';
                            //    document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_2').src = urlOpen;
                            //}

                            //var x2_image = document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_4');
                            //if (x2_image) {
                            //    document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_4').style.display = 'none';
                            //    document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_4').src = urlOpen;
                            //}

                            //try {
                            //    document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_5').style.display = 'none';
                            //    document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_5').src = urlOpen;
                            //} catch (e) {
                            //}

                            //} else if (collapsibleRowId == 'alertSectionRow_bwExecutiveSummariesCarousel2_6') {

                            //    // My Unsubmitted Requests
                            //    if (bwDisplayFormat == 'ExecutiveSummaries') {
                            //        this.renderExecutiveSummaries_PINNED_REQUESTS();
                            //    } else if (bwDisplayFormat == 'DetailedList') {
                            //        this.renderDetailedList_PinnedRequests();
                            //    } else {
                            //        //localStorage.setItem('bwDisplayFormat', 'DetailedList');
                            //        this.renderDetailedList_PinnedRequests();
                            //    }

                            //    // Make sure the other sections are collapsed. Only one expanded at a time. 7-22-2022
                            //    var alertSectionRow_1 = document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_1');
                            //    if (alertSectionRow_1 && alertSectionRow_1.style && alertSectionRow_1.style.display && alertSectionRow_1.src) {
                            //        document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_1').style.display = 'none';
                            //        document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_1').src = urlOpen;
                            //    }

                            //    var alertSectionRow_2 = document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_2');
                            //    if (alertSectionRow_2 && alertSectionRow_2.style && alertSectionRow_2.style.display && alertSectionRow_2.src) {
                            //        document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_2').style.display = 'none';
                            //        document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_2').src = urlOpen;
                            //    }

                            //    var alertSectionRow_4 = document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_4');
                            //    if (alertSectionRow_4 && alertSectionRow_4.style && alertSectionRow_4.style.display && alertSectionRow_4.src) {
                            //        document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_4').style.display = 'none';
                            //        document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_4').src = urlOpen;
                            //    }

                        } else if (drawerType == 'SOCIAL_NETWORK') {

                            console.log('Displaying the SOCIAL_NETWORK.');

                            if (bwDisplayFormat == 'ExecutiveSummaries') {

                                $('.bwAuthentication:first').bwAuthentication('getPagedDataFor_SOCIAL_NETWORK', 0, 25).then(function (results) {

                                    thiz.renderExecutiveSummaries_SOCIAL_NETWORK();

                                }).catch(function (e) {

                                    var msg = 'Exception in bwExecutiveSummariesCarousel2.js.expandOrCollapseAlertsSection(). Exception calling getPagedDataFor_SOCIAL_NETWORK(): ' + JSON.stringify(e);
                                    console.log(msg);
                                    displayAlertDialog(msg);

                                });

                            } else if (bwDisplayFormat == 'DetailedList') {

                                var msg = 'Error in bwExecutiveSummariesCarousel2.js.expandOrCollapseAlertsSection(). No method currently exists. xcx2312-7.';
                                console.log(msg);
                                displayAlertDialog(msg);

                            } else {

                                var msg = 'Error in bwExecutiveSummariesCarousel2.js.expandOrCollapseAlertsSection(). No method currently exists. xcx2312-8.';
                                console.log(msg);
                                displayAlertDialog(msg);

                            }

                            //// Active Requests
                            //if (bwDisplayFormat == 'ExecutiveSummaries') {
                            //    this.renderExecutiveSummaries_AllActiveRequests();
                            //} else if (bwDisplayFormat == 'DetailedList') {
                            //    this.renderDetailedList_AllActiveRequests();
                            //} else {
                            //    //localStorage.setItem('bwDisplayFormat', 'DetailedList');
                            //    this.renderDetailedList_AllActiveRequests();
                            //}

                            //// Make sure the other sections are collapsed. Only one expanded at a time. 7-22-2022
                            //document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_4').style.display = 'none';
                            //document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_4').src = urlOpen;

                            //document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_1').style.display = 'none';
                            //if (document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_1') && document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_1').src) {
                            //    document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_1').src = urlOpen;
                            //}

                            //try {
                            //    document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_5').style.display = 'none';
                            //    document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_5').src = urlOpen;
                            //} catch (e) {
                            //}

                        } else {

                            var msg = 'Error in bwExecutiveSummariesCarousel2.js.expandOrCollapseAlertsSection(). Unexpected value for drawerType: ' + drawerType;
                            console.log(msg);
                            displayAlertDialog(msg);

                        }

                    }

                    //
                    // This is Flip-to-Top. Turning off for now, but it may come back 4-14-2022
                    //
                    ////alert('We need to figure out flip-to-top here. collapsibleRowId: ' + collapsibleRowId); // For example, collapsibleRowId = 'alertSectionRow_0_1'.
                    //// <tr id="functionalAreaRow_0_1" ...
                    ////      functionalAreaRow_0_2
                    ////      functionalAreaRow_0_3
                    ////      functionalAreaRow_0_4
                    ////      functionalAreaRow_0_5

                    //var table = $('#' + collapsibleRowId).closest('table');
                    //var rows = $(table).find('tr');
                    //var rowIndexArray = [];
                    //// First we have to find our rows which we need to re-order. There will be 3 or 4 of them.
                    //for (var i = 0; i < rows.length; i++) {
                    //    var row = $(rows)[i];
                    //    var id = $(row).attr('id');
                    //    if (id) {
                    //        if (id.indexOf('functionalAreaRow_') > -1) {
                    //            //rowArray.push(row);
                    //            var index = id.split('_')[2];
                    //            rowIndexArray.push(index); // We only need the indexes.
                    //        }
                    //    }
                    //}
                    //// Now we have to determine if the row is under the one we expanded. If so, we have to flip-to-top, so that all the bottom rows show up on top of ht eone we just expanded. This lets the user see everything easily without having to scroll to the bottom of the page.
                    //var weHaveFoundTheRowWeJustExpanded = false;
                    //var selectedRowIndex = collapsibleRowId.split('_')[2];

                    //var startRowIndexArrayAt;
                    //for (var i = 0; i < rowIndexArray.length; i++) {
                    //    if (weHaveFoundTheRowWeJustExpanded == true) {

                    //    } else {
                    //        var thisRowIndex = $(rowIndexArray)[i];
                    //        if (thisRowIndex == selectedRowIndex) {
                    //            weHaveFoundTheRowWeJustExpanded = true; // Now that this is true, everything under this row needs to be flipped to the top.
                    //            startRowIndexArrayAt = i;
                    //            break;
                    //        }
                    //    }
                    //}
                    ////
                    //// We have to go through them 1 last time, as we have to add them backwards so that it looks ok to the user and is not confusing. THIS doesn't work 100% correctly but leaving for now. 2-19-2022
                    ////
                    //for (var i = (rowIndexArray.length - 1) ; i > startRowIndexArrayAt; i--) {

                    //    // Now we have to prepend all this to the top. flip-to-top! :)
                    //    var thisBottomRow_Id = 'functionalAreaRow_' + this.options.deferredIndex.toString() + '_' + rowIndexArray[i];
                    //    var thisBottomRow_alertSectionRow_Id = 'alertSectionRow_' + this.options.deferredIndex.toString() + '_' + rowIndexArray[i];

                    //    // Save them.
                    //    //alert('thisBottomRow_Id: ' + thisBottomRow_Id);
                    //    var thisBottomRow_Html = document.getElementById(thisBottomRow_Id).outerHTML;
                    //    var thisBottomRow_alertSectionRow_Html = document.getElementById(thisBottomRow_alertSectionRow_Id).outerHTML;
                    //    // Remove them.
                    //    $('#' + thisBottomRow_Id).remove();
                    //    $('#' + thisBottomRow_alertSectionRow_Id).remove();
                    //    // Add them back prepended.
                    //    $(table).prepend(thisBottomRow_alertSectionRow_Html);
                    //    $(table).prepend(thisBottomRow_Html);

                    //    // Make sure it is collapsed.
                    //    var imageId = 'alertSectionImage_' + this.options.deferredIndex + '_' + rowIndexArray[i];
                    //    document.getElementById(thisBottomRow_alertSectionRow_Id).style.display = 'none';
                    //    if (!document.getElementById(imageId)) {
                    //        // This means that this user has created no requests, and hence no image! :)
                    //    } else {
                    //        document.getElementById(imageId).src = urlOpen;
                    //    }

                    //}
                    //
                    // end: This is Flip-to-Top. Turning off for now, but it may come back 4-14-2022
                    //

                }

            }

        } catch (e) {
            console.log('Exception in bwExecutiveSummariesCarousel2.js.expandOrCollapseAlertsSection(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwExecutiveSummariesCarousel2.js.expandOrCollapseAlertsSection(): ' + e.message + ', ' + e.stack);
        }
    },





    slideWorkflowViewer: function (direction, elementId) { // direction: ['LEFT', 'RIGHT'] // The elementId is for the table element.
        try {
            console.log('In bwExecutiveSummariesCarousel2.js.slideWorkflowViewer().');

            var table = document.getElementById(elementId);

            var topRowElement = $(table).find('tr')[0];
            var middleRowElement = $(table).find('tr')[1];
            var bottomRowElement = $(table).find('tr').next('tr').next('tr');

            var topCells = $(topRowElement).find('td');
            for (var i = 0; i < topCells.length; i++) {
                if ($(topCells[i]).attr('bwworkflowstepactive') == "true") {
                    // This is the workflow step. Don't clear this cell.
                } else {
                    //$(topCells[i]).text('');
                    var div1 = $(topCells[i]).find('div').get(0);
                    div1.style.display = 'none';
                }
            }

            var bottomCells = $(bottomRowElement).find('td');
            for (var i = 0; i < bottomCells.length; i++) {
                if ($(bottomCells[i]).attr('bwworkflowstepactive') == "true") {
                    // This is the workflow step. Don't clear this cell.
                } else {
                    //$(bottomCells[i]).text('');
                    var div2 = $(bottomCells[i]).find('div')[0].get(0);
                    div2.style.display = 'none';
                }
            }

        } catch (e) {
            var msg = 'Exception in bwExecutiveSummariesCarousel2.js.slideWorkflowViewer(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            alert(msg);
        }
    },








    renderEmptyExecutiveSummariesCarousel: function () {
        var thiz = this;
        return new Promise(function (resolve, reject) {
            try {
                console.log('In bwExecutiveSummariesCarousel2.js.renderEmptyExecutiveSummariesCarousel().');
                //alert('In bwExecutiveSummariesCarousel2.js.renderEmptyExecutiveSummariesCarousel().');

                var html = '';

                html += '<style>';
                html += '.executiveSummaryInCarousel { ';
                html += '   min-width: 300px;'; // This is where the minimum size of the carousel tasks is set.
                html += '   min-height: 300px;'; // This is where the minimum size of the carousel tasks is set.
                html += '   border:2px solid lightgray;border-radius:30px 30px 30px 30px;padding:0 10px 20px 10px;';
                html += '   vertical-align:top;';
                html += '   background-color:white;';
                html += '}';
                html += '.executiveSummaryInCarousel:hover { ';
                html += '   background-color:aliceblue;';
                html += '   border:2px solid skyblue;';
                html += '   cursor:pointer !important;';
                html += '}';


                html += '.divCarouselButton {';
                html += '    width: 15px;';
                html += '    height: 15px;';
                html += '    padding: 3px 3px 3px 3px;';
                html += '    border: 4px solid lightgray;';
                html += '}';

                html += '.divCarouselButton:hover {';
                html += '    background-color: gray;';
                html += '    cursor: pointer;';
                html += '}';



                // This block of code gets the currently selected theme, and finds out the color by getting the backgroundColor property. This is applied to the subsequent style which we are injecting below.
                var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme'); // For example, returns brushedAluminum_blue
                var cssClass = workflowAppTheme + '_noanimation'; // brushedAluminum_blue_noanimation

                //alert('xcx896970 workflowAppTheme: ' + workflowAppTheme);

                var element = document.querySelector('.' + workflowAppTheme + '_noanimation');

                if (!element) {

                    console.log('*');
                    console.log('*');
                    console.log('In bwExecutiveSummaries2.js.renderEmptyExecutiveSummariesCarousel(). xcx2312312 NO ELEMENT SELECETED. element: ' + element + '. SETTING color TO orange. FIX!!! 10-26-2023. <<<<<<<<<<<<<< This code always worked until our latest changes 10-26-2023.');
                    console.log('*');
                    console.log('*');

                    var color = 'orange';


                } else {

                    var style = getComputedStyle(element);
                    var color = style.backgroundColor;



                }



                console.log('Setting .divCarouselButton_Selected border color to: ' + color);
                html += '.divCarouselButton_Selected {';
                html += '    width: 15px;';
                html += '    height: 15px;';
                html += '    padding: 3px 3px 3px 3px;';
                html += '    border: 4px solid ' + color + ';'; // purple;';
                html += '}';

                html += '.divCarouselButton_Selected:hover {';
                html += '    background-color: gray;';
                html += '    cursor: pointer;';
                html += '}';




                html += '.divCarouselButton_SmallButton {';
                html += '    width: 10px;';
                html += '    height: 16px;';
                html += '    border: 2px solid lightgray;';
                //html += '    border: 2px solid ' + color + ';';
                html += '    border-radius: 5px 5px 5px 5px;';
                html += '}';

                html += '.divCarouselButton_SmallButton:hover {';
                //html += '    background-color: lightgray;';
                html += '}';

                html += '.divCarouselButton_SmallButton2 {';
                html += '    width: 6px;';
                html += '    height: 6px;';
                html += '    border: 2px solid lightgray;';
                html += '}';

                html += '.divCarouselButton_SmallButton2:hover {';
                html += '    background-color: lightgray;';
                html += '}';

                html += '.divCarouselButton_SmallButton3 {';
                html += '    width: 10px;';
                html += '     height: 2px;';
                html += '    border: 2px solid lightgray;';
                html += '}';

                html += '.divCarouselButton_SmallButton3:hover {';
                html += '     background-color: lightgray;';
                html += '}';

                html += '</style>';



                html += '<style>';
                html += '.dataGridTable { border: 1px solid gainsboro; font-size:14px; font-family: "Helvetica Neue","Segoe UI",Helvetica,Verdana,sans-serif; }';
                html += '.dataGridTable td { border-left: 0px; border-right: 1px solid gainsboro; }';
                html += '.headerRow { background-color:white; color:gray;border-bottom:1px solid gainsboro; }';
                html += '.headerRow td { border-bottom:1px solid gainsboro; padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
                html += '.filterRow td { border-bottom:1px solid whitesmoke; padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
                html += '.alternatingRowLight { background-color:white; }';
                html += '.alternatingRowLight:hover { background-color:lightgoldenrodyellow; }';
                html += '.alternatingRowDark { background-color:whitesmoke; }';
                html += '.alternatingRowDark:hover { background-color:lightgoldenrodyellow; }';
                html += '</style>';

                // The drawers. Showing the loading spinner until the entire element gets rendered.
                html += '<div id="divbwExecutiveSummariesCarousel2_Drawers" style="background-color:#f5f6fa;">'; // space white. 6-25-2024.
                html += '       &nbsp;&nbsp;<img style="width:100px;height:100px;vertical-align:middle;white-space:nowrap;" src="/images/ajax-loader.gif" />&nbsp;&nbsp;<span style="font-size:25pt;white-space:nowrap;">Loading...</span>';
                html += '</div > ';

                // Search results.
                html += '<div id="divbwExecutiveSummariesCarousel2_SearchResults"></div>';

                //// The accordion.
                //var results = this.generateHomePageNotificationScreenHtml();
                //html += results.html;

                $(thiz.element).html(html);

                resolve();

            } catch (e) {
                console.log('Exception in bwExecutiveSummariesCarousel2.js.renderEmptyExecutiveSummariesCarousel():1335-1: ' + e.message + ', ' + e.stack);
                displayAlertDialog('Exception in bwExecutiveSummariesCarousel2.js.renderEmptyExecutiveSummariesCarousel():1335-1: ' + e.message + ', ' + e.stack);

                $('.bwAuthentication:first').bwAuthentication('displaySignInDialog', true, 'You may have logged in on another device. Please re-authenticate and re-try your action.<br /><br />', true, true);

                //throw (e);

                reject(e);
            }
        });
    },




    searchBox_OnKeyDown: function (event) {
        try {
            console.log('In bwExecutiveSummariesCarousel2.js.searchBox_OnKeyDown().');

            if (event.keyCode == 13) {
                console.log('Enter key was pressed.');
                this.search();
            }

        } catch (e) {
            console.log('Exception in bwExecutiveSummariesCarousel2.js.searchBox_OnKeyDown(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwExecutiveSummariesCarousel2.js.searchBox_OnKeyDown(): ' + e.message + ', ' + e.stack);
        }
    },
    search: function () {
        try {
            console.log('In bwExecutiveSummariesCarousel2.js.search().');
            var thiz = this;
            // search in bwBudgetRequest:
            //      - title (eg: BR-220002)
            //      - project title (eg: partial description text)
            //      - bwBudgetRequestJson

            document.getElementById('inputBwAuthentication_SearchBox').blur(); // This is here to prevent the search box from getting the cursor and showing the keyboard.

            var searchTerm = String($('#inputBwAuthentication_SearchBox').val()).trim();

            if (!searchTerm) {

                displayAlertDialog_QuickNotice('Please enter a search term before performing a search.');

            } else {

                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

                var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                ShowActivitySpinner('Searching for "' + searchTerm + '"...');

                var data = {
                    bwParticipantId_LoggedIn: participantId,
                    bwActiveStateIdentifier: activeStateIdentifier,
                    bwWorkflowAppId_LoggedIn: workflowAppId,

                    bwWorkflowAppId: workflowAppId,
                    searchTerm: searchTerm

                };
                var operationUri = webserviceurl + "/getsearchresults";
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

                                HideActivitySpinner();
                                console.log('Error xcx12345: ' + JSON.stringify(results.message));
                                displayAlertDialog('Error xcx12345: ' + JSON.stringify(results.message));

                            } else {

                                HideActivitySpinner();
                                thiz.collapseAllAlertsSection();

                                window.scrollTo(0, 0); // Scroll to top on button click. This makes sure things render Ok, and also just seems like a nicer user experience.	\\192.168.1.14\budgetworkflow\public\widgets\bwAuthentication.js	4102	13

                                var accordionDrawerElement = $('#divbwExecutiveSummariesCarousel2_SearchResults');

                                var html = '';
                                html += '<br /><div style="">Search results for "' + results.searchTerm + '" (' + results.data.length + '):</div>';
                                $(accordionDrawerElement).html(html);

                                for (var i = 0; i < results.data.length; i++) {
                                    if (i < 100) { // This is where we set how many tasks we will display in the carousel. Zero-based, so < 5 means display 5 tasks.

                                        var title = 'Executive Summary for: ' + results.data[i].Title + '. ' + encodeURI(results.data[i].ProjectTitle); // ProjectTitle_clean;

                                        var executiveSummaryElement = document.createElement('div');
                                        executiveSummaryElement.classList.add('executiveSummaryInCarousel');
                                        executiveSummaryElement.setAttribute('bwbudgetrequestid', results.data[i].bwBudgetRequestId);
                                        executiveSummaryElement.title = title;
                                        executiveSummaryElement.alt = title;
                                        executiveSummaryElement.style.minWidth = '300px';
                                        executiveSummaryElement.style.maxWidth = '550px';
                                        executiveSummaryElement.style.display = 'inline-block';
                                        executiveSummaryElement.style.whiteSpace = 'nowrap';
                                        executiveSummaryElement.style.color = 'rgb(38, 38, 38)';
                                        executiveSummaryElement.style.fontFamily = '"Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif';
                                        executiveSummaryElement.style.fontSize = '1.25em';

                                        executiveSummaryElement.setAttribute('onclick', '$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'' + results.data[i].bwBudgetRequestId + '\', \'' + results.data[i].Title + '\', \'' + encodeURI(results.data[i].ProjectTitle).replaceAll(/'/g, '&#39;') + '\', \'' + results.data[i].Title + '\', \'' + results.data[i].bwAssignedToRaciRoleAbbreviation + '\', \'' + '7777xcx7777777-324-1' + '\');');

                                        $(accordionDrawerElement).append(executiveSummaryElement);

                                        console.log('Calling renderExecutiveSummaryForRequest(). xcx332-6');
                                        //alert('Calling renderExecutiveSummaryForRequest(). xcx332-6');

                                        var promise = thiz.renderExecutiveSummaryForRequest(results.data[i], executiveSummaryElement);
                                        promise.then(function (result) {
                                            // Do nothing.
                                        }).catch(function (e) {
                                            alert('Exception xcx33995-2-1: ' + e);
                                        });

                                    } else {
                                        break;
                                    }

                                }

                                //
                                //
                                // 2-19-2024. IS THIS THE BEST PLACE TO BACKFILL THE EXECUTIVE SUMMARRIES? xcx1231421-1
                                //
                                //

                                console.log('2-19-2024. IS THIS THE BEST PLACE TO BACKFILL THE EXECUTIVE SUMMARRIES? xcx1231421-1');






                            }

                        } catch (e) {
                            HideActivitySpinner();
                            console.log('Exception in bwExecutiveSummariesCarousel2.js.search.getsearchresults.success(): ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in bwExecutiveSummariesCarousel2.js.search.getsearchresults.success(): ' + e.message + ', ' + e.stack);
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        HideActivitySpinner();
                        console.log('Error in bwExecutiveSummariesCarousel2.js.search.getsearchresults.error(): ' + errorCode + ', ' + errorMessage + JSON.stringify(data));
                        displayAlertDialog('Error in bwExecutiveSummariesCarousel2.js.search.getsearchresults.error(): ' + errorCode + ', ' + errorMessage + JSON.stringify(data));
                    }
                });

            }

        } catch (e) {
            HideActivitySpinner();
            console.log('Exception in bwExecutiveSummariesCarousel2.js.search(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwExecutiveSummariesCarousel2.js.search(): ' + e.message + ', ' + e.stack);
        }
    },
    searchForFiles: function () {
        try {
            console.log('In bwExecutiveSummariesCarousel2.js.searchForFiles().');
            //alert('In bwExecutiveSummariesCarousel2.js.searchForFiles(). This functionality is incomplete. Coming soon!');
            var thiz = this;
            // searchForFiles in bwBudgetRequest:
            //      - title (eg: BR-220002)
            //      - project title (eg: partial description text)
            //      - bwBudgetRequestJson

            document.getElementById('inputBwAuthentication_SearchBox').blur(); // This is here to prevent the search box from getting the cursor and showing the keyboard.

            var searchTerm = String($('#inputBwAuthentication_SearchBox').val()).trim();

            if (!searchTerm) {

                displayAlertDialog_QuickNotice('Please enter a search term before performing a search.');

            } else {

                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

                var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                ShowActivitySpinner('Searching for files containing "' + searchTerm + '"...');

                var data = {
                    bwParticipantId_LoggedIn: participantId,
                    bwActiveStateIdentifier: activeStateIdentifier,
                    bwWorkflowAppId_LoggedIn: workflowAppId,

                    bwWorkflowAppId: workflowAppId,
                    searchTerm: searchTerm
                };

                var operationUri = this.options.operationUriPrefix + "_files/getsearchresults_forfiles";
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

                                HideActivitySpinner();
                                console.log('Error xcx12345: ' + JSON.stringify(results.message));
                                displayAlertDialog('Error xcx12345: ' + JSON.stringify(results.message));

                            } else {

                                //displayAlertDialog('xcx23123results.message: ' + results.message + ', results.data.searchResults: ' + JSON.stringify(results.data.searchResults));

                                HideActivitySpinner();
                                thiz.collapseAllAlertsSection();

                                window.scrollTo(0, 0); // Scroll to top on button click. This makes sure things render Ok, and also just seems like a nicer user experience.	\\192.168.1.14\budgetworkflow\public\widgets\bwAuthentication.js	4102	13

                                var accordionDrawerElement = $('#divbwExecutiveSummariesCarousel2_SearchResults');

                                var html = '';
                                html += '<br /><div style="">Search results for "' + results.searchTerm + '" (' + results.data.length + '):</div>';
                                $(accordionDrawerElement).html(html);

                                for (var i = 0; i < results.data.length; i++) {
                                    if (i < 100) { // This is where we set how many tasks we will display in the carousel. Zero-based, so < 5 means display 5 tasks.

                                        var title = 'Executive Summary for: ' + results.data[i].Title + '. ' + encodeURI(results.data[i].ProjectTitle); // ProjectTitle_clean;

                                        var executiveSummaryElement = document.createElement('div');
                                        executiveSummaryElement.classList.add('executiveSummaryInCarousel');
                                        executiveSummaryElement.setAttribute('bwbudgetrequestid', results.data[i].bwBudgetRequestId);
                                        executiveSummaryElement.title = title;
                                        executiveSummaryElement.alt = title;
                                        executiveSummaryElement.style.minWidth = '300px';
                                        executiveSummaryElement.style.maxWidth = '550px';
                                        executiveSummaryElement.style.display = 'inline-block';
                                        executiveSummaryElement.style.whiteSpace = 'nowrap';
                                        executiveSummaryElement.style.color = 'rgb(38, 38, 38)';
                                        executiveSummaryElement.style.fontFamily = '"Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif';
                                        executiveSummaryElement.style.fontSize = '1.25em';

                                        executiveSummaryElement.setAttribute('onclick', '$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'' + results.data[i].bwBudgetRequestId + '\', \'' + results.data[i].Title + '\', \'' + encodeURI(results.data[i].ProjectTitle).replaceAll(/'/g, '&#39;') + '\', \'' + results.data[i].Title + '\', \'' + results.data[i].bwAssignedToRaciRoleAbbreviation + '\', \'' + '7777xcx7777777-324-1' + '\');');

                                        $(accordionDrawerElement).append(executiveSummaryElement);

                                        console.log('Calling renderExecutiveSummaryForRequest(). xcx332-6');
                                        //alert('Calling renderExecutiveSummaryForRequest(). xcx332-6');

                                        var promise = thiz.renderExecutiveSummaryForRequest(results.data[i], executiveSummaryElement);
                                        promise.then(function (result) {
                                            // Do nothing.
                                        }).catch(function (e) {
                                            alert('Exception xcx33995-2-1: ' + e);
                                        });

                                    } else {
                                        break;
                                    }

                                }

                                ////
                                ////
                                //// 2-19-2024. IS THIS THE BEST PLACE TO BACKFILL THE EXECUTIVE SUMMARIES? xcx1231421-1
                                ////
                                ////

                                //console.log('2-19-2024. IS THIS THE BEST PLACE TO BACKFILL THE EXECUTIVE SUMMARIES? xcx1231421-1');

                            }

                        } catch (e) {
                            HideActivitySpinner();
                            console.log('Exception in bwExecutiveSummariesCarousel2.js.searchForFiles.getsearchresults.success(): ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in bwExecutiveSummariesCarousel2.js.searchForFiles.getsearchresults.success(): ' + e.message + ', ' + e.stack);
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        HideActivitySpinner();
                        console.log('Error in bwExecutiveSummariesCarousel2.js.searchForFiles.getsearchresults.error(): ' + errorCode + ', ' + errorMessage + JSON.stringify(data));
                        displayAlertDialog('Error in bwExecutiveSummariesCarousel2.js.searchForFiles.getsearchresults.error(): ' + errorCode + ', ' + errorMessage + JSON.stringify(data));
                    }
                });

            }

        } catch (e) {
            HideActivitySpinner();
            console.log('Exception in bwExecutiveSummariesCarousel2.js.searchForFiles(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwExecutiveSummariesCarousel2.js.searchForFiles(): ' + e.message + ', ' + e.stack);
        }
    },

    searchUsingImageOCR: function () {
        try {
            console.log('In bwExecutiveSummariesCarousel2.js.searchUsingImageOCR().');
            alert('In bwExecutiveSummariesCarousel2.js.searchUsingImageOCR(). This functionality is incomplete. Coming soon!');
            //var thiz = this;
            //// searchUsingImageOCR in bwBudgetRequest:
            ////      - title (eg: BR-220002)
            ////      - project title (eg: partial description text)
            ////      - bwBudgetRequestJson

            //document.getElementById('inputBwAuthentication_SearchBox').blur(); // This is here to prevent the search box from getting the cursor and showing the keyboard.

            //var searchTerm = String($('#inputBwAuthentication_SearchBox').val()).trim();

            //if (!searchTerm) {

            //    displayAlertDialog_QuickNotice('Please enter a search term before performing a search.');

            //} else {

            //var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            //var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            //var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            //ShowActivitySpinner('Searching for files containing "' + searchTerm + '"...');

            //var data = {
            //    bwParticipantId_LoggedIn: participantId,
            //    bwActiveStateIdentifier: activeStateIdentifier,
            //    bwWorkflowAppId_LoggedIn: workflowAppId,

            //    bwWorkflowAppId: workflowAppId,
            //    searchTerm: searchTerm
            //};

            //var operationUri = this.options.operationUriPrefix + "_files/getsearchresults_forfiles";
            //$.ajax({
            //    url: operationUri,
            //    type: "POST",
            //    data: data,
            //    headers: {
            //        "Accept": "application/json; odata=verbose"
            //    },
            //    success: function (results) {
            //        try {

            //            if (results.status != 'SUCCESS') {

            //                HideActivitySpinner();
            //                console.log('Error xcx12345: ' + JSON.stringify(results.message));
            //                displayAlertDialog('Error xcx12345: ' + JSON.stringify(results.message));

            //            } else {

            //                //displayAlertDialog('xcx23123results.message: ' + results.message + ', results.data.searchResults: ' + JSON.stringify(results.data.searchResults));

            //                HideActivitySpinner();
            //                thiz.collapseAllAlertsSection();

            //                window.scrollTo(0, 0); // Scroll to top on button click. This makes sure things render Ok, and also just seems like a nicer user experience.	\\192.168.1.14\budgetworkflow\public\widgets\bwAuthentication.js	4102	13

            //                var accordionDrawerElement = $('#divbwExecutiveSummariesCarousel2_SearchResults');

            //                var html = '';
            //                html += '<br /><div style="">Search results for "' + results.searchTerm + '" (' + results.data.length + '):</div>';
            //                $(accordionDrawerElement).html(html);

            //                for (var i = 0; i < results.data.length; i++) {
            //                    if (i < 100) { // This is where we set how many tasks we will display in the carousel. Zero-based, so < 5 means display 5 tasks.

            //                        var title = 'Executive Summary for: ' + results.data[i].Title + '. ' + encodeURI(results.data[i].ProjectTitle); // ProjectTitle_clean;

            //                        var executiveSummaryElement = document.createElement('div');
            //                        executiveSummaryElement.classList.add('executiveSummaryInCarousel');
            //                        executiveSummaryElement.setAttribute('bwbudgetrequestid', results.data[i].bwBudgetRequestId);
            //                        executiveSummaryElement.title = title;
            //                        executiveSummaryElement.alt = title;
            //                        executiveSummaryElement.style.minWidth = '300px';
            //                        executiveSummaryElement.style.maxWidth = '550px';
            //                        executiveSummaryElement.style.display = 'inline-block';
            //                        executiveSummaryElement.style.whiteSpace = 'nowrap';
            //                        executiveSummaryElement.style.color = 'rgb(38, 38, 38)';
            //                        executiveSummaryElement.style.fontFamily = '"Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif';
            //                        executiveSummaryElement.style.fontSize = '1.25em';

            //                        executiveSummaryElement.setAttribute('onclick', '$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'' + results.data[i].bwBudgetRequestId + '\', \'' + results.data[i].Title + '\', \'' + encodeURI(results.data[i].ProjectTitle).replaceAll(/'/g, '&#39;') + '\', \'' + results.data[i].Title + '\', \'' + results.data[i].bwAssignedToRaciRoleAbbreviation + '\', \'' + '7777xcx7777777-324-1' + '\');');

            //                        $(accordionDrawerElement).append(executiveSummaryElement);

            //                        console.log('Calling renderExecutiveSummaryForRequest(). xcx332-6');

            //                        var promise = thiz.renderExecutiveSummaryForRequest(results.data[i], executiveSummaryElement);
            //                        promise.then(function (result) {
            //                            // Do nothing.
            //                        }).catch(function (e) {
            //                            alert('Exception xcx33995-2-1: ' + e);
            //                        });

            //                    } else {
            //                        break;
            //                    }

            //                }

            //                ////
            //                ////
            //                //// 2-19-2024. IS THIS THE BEST PLACE TO BACKFILL THE EXECUTIVE SUMMARIES? xcx1231421-1
            //                ////
            //                ////

            //                //console.log('2-19-2024. IS THIS THE BEST PLACE TO BACKFILL THE EXECUTIVE SUMMARIES? xcx1231421-1');

            //            }

            //        } catch (e) {
            //            HideActivitySpinner();
            //            console.log('Exception in bwExecutiveSummariesCarousel2.js.searchUsingImageOCR.getsearchresults.success(): ' + e.message + ', ' + e.stack);
            //            displayAlertDialog('Exception in bwExecutiveSummariesCarousel2.js.searchUsingImageOCR.getsearchresults.success(): ' + e.message + ', ' + e.stack);
            //        }
            //    },
            //    error: function (data, errorCode, errorMessage) {
            //        HideActivitySpinner();
            //        console.log('Error in bwExecutiveSummariesCarousel2.js.searchUsingImageOCR.getsearchresults.error(): ' + errorCode + ', ' + errorMessage + JSON.stringify(data));
            //        displayAlertDialog('Error in bwExecutiveSummariesCarousel2.js.searchUsingImageOCR.getsearchresults.error(): ' + errorCode + ', ' + errorMessage + JSON.stringify(data));
            //    }
            //});

            //}

        } catch (e) {
            HideActivitySpinner();
            console.log('Exception in bwExecutiveSummariesCarousel2.js.searchUsingImageOCR(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwExecutiveSummariesCarousel2.js.searchUsingImageOCR(): ' + e.message + ', ' + e.stack);
        }
    },

    updatePinnedRequests: function () {
        try {
            console.log('In bwExecutiveSummariesCarousel2.js.updatePinnedRequests().');
            //alert('In bwExecutiveSummariesCarousel2.js.updatePinnedRequests().');

            var pinnedRequests = $('.bwAuthentication:first').bwAuthentication('option', 'PINNED_REQUESTS');

            //
            // Previously we did it this way because there may have been orphaned pinned requests.... however we will deal with that elsewhere hopefully. 9-19-2023.
            //
            //var quantityOfPinnedRequests = 0;
            //for (var i = 0; i < this.options.brData.PendingBudgetRequests.length; i++) {
            //    if (pinnedRequests.indexOf(this.options.brData.PendingBudgetRequests[i].bwBudgetRequestId) > -1) {
            //        quantityOfPinnedRequests += 1;
            //    }
            //}

            //var html = 'Pinned (' + quantityOfPinnedRequests + ')';
            console.log('xcx21312431 pinned qty: ' + pinnedRequests.length);
            var quantityOfPinnedRequests = 0;
            if (pinnedRequests && pinnedRequests.length) {
                quantityOfPinnedRequests = pinnedRequests.length;
            }
            var html = 'Pinned (' + quantityOfPinnedRequests + ')';

            var drawers = $('#divbwExecutiveSummariesCarousel2_Drawers');
            if (drawers) {
                var row = $(drawers).find('.bwFunctionalAreaRow')[0];
                if (row) {
                    var drawerTitle = $(row).find('.bwAccordionDrawerTitle')[0];
                    if (drawerTitle) {
                        $(drawerTitle).html(html);
                    } else {
                        alert('Error in bwExecutiveSummariesCarousel2.js.updatePinnedRequests(). No drawerTitle.');
                    }
                } else {
                    alert('Error in bwExecutiveSummariesCarousel2.js.updatePinnedRequests(). No row.');
                }
            } else {
                alert('Error in bwExecutiveSummariesCarousel2.js.updatePinnedRequests(). No drawers.');
            }

        } catch (e) {
            console.log('Exception in bwExecutiveSummariesCarousel2.js.updatePinnedRequests(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwExecutiveSummariesCarousel2.js.updatePinnedRequests(): ' + e.message + ', ' + e.stack);
        }
    },

    renderDetailedList_PinnedRequests: function (dataElement, sortOrder) {
        try {
            console.log('In renderDetailedList_PinnedRequests().');

            var bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            localStorage.setItem('bwDisplayFormat', 'DetailedList');

            //$('#buttonDisplayRequestsAsTiles_AllActiveRequests').removeClass().addClass('divCarouselButton'); // Unselect the other buttons.
            //$('#buttonDisplayRequestsAsDetailedList_AllActiveRequests').removeClass().addClass('divCarouselButton_Selected'); // Select this one.

            //$('#divBwExecutiveSummariesCarousel_AllActiveRequests').html('');

            $('#buttonDisplayRequestsAsDetailedList_PinnedRequests').removeClass().addClass('divCarouselButton'); // Unselect the other buttons.
            $('#buttonDisplayRequestsAsTiles_PinnedRequests').removeClass().addClass('divCarouselButton_Selected'); // Select this one. 

            var accordionDrawerElement;
            var accordionDrawerElements = $('.bwAccordionDrawer');
            for (var i = 0; i < accordionDrawerElements.length; i++) {
                if ($(accordionDrawerElements[i]).attr('bwaccordiondrawertype') == 'PINNED_REQUESTS') {
                    accordionDrawerElement = accordionDrawerElements[i];
                    break;
                }
            }

            var pinnedRequests = $('.bwAuthentication:first').bwAuthentication('option', 'PINNED_REQUESTS');

            if (!pinnedRequests) {

                var msg = 'Error in bwExecutiveSummariesCarousel2.js.renderExecutiveSummaries_PINNED_REQUESTS(). No data loaded for pinnedRequests.';

                console.log(msg);
                alert(msg);

            } else {

                $(accordionDrawerElement).html('');

                if (dataElement && sortOrder) {
                    // If we get these parameters, then we will sort the data here.
                    //displayAlertDialog('In renderDetailedList_PinnedRequests(). Sorting!! dataElement: ' + dataElement + ', sortOrder: ' + sortOrder + ', pinnedRequests: ' + JSON.stringify(pinnedRequests));

                    // brData.PendingBudgetRequests[i].Title
                    // brData.PendingBudgetRequests[i].ProjectTitle
                    // brData.PendingBudgetRequests[i].RequestedCapital +  brData.PendingBudgetRequests[i].RequestedExpense

                    if (dataElement == 'Title') {

                        if (sortOrder == 'ascending') {
                            pinnedRequests.sort(function (a, b) {
                                if (a.Title < b.Title) { return -1; }
                                if (a.Title > b.Title) { return 1; }
                                return 0;
                            });
                        } else if (sortOrder == 'descending') {
                            pinnedRequests.sort(function (a, b) {
                                if (a.Title < b.Title) { return 1; }
                                if (a.Title > b.Title) { return -1; }
                                return 0;
                            });
                        } else {
                            console.log('Error in renderDetailedList_PinnedRequests().Title. Unexpected value for sortOrder: ' + sortOrder);
                            displayAlertDialog('Error in renderDetailedList_PinnedRequests().Title. Unexpected value for sortOrder: ' + sortOrder);
                        }

                    } else if (dataElement == 'ProjectTitle') {

                        if (sortOrder == 'ascending') {
                            pinnedRequests.sort(function (a, b) {
                                if ((a.ProjectTitle && b.ProjectTitle) && (a.ProjectTitle.toUpperCase() < b.ProjectTitle.toUpperCase())) { return -1; }
                                if ((a.ProjectTitle && b.ProjectTitle) && (a.ProjectTitle.toUpperCase() > b.ProjectTitle.toUpperCase())) { return 1; }
                                return 0;
                            });
                        } else if (sortOrder == 'descending') {
                            pinnedRequests.sort(function (a, b) {
                                if ((a.ProjectTitle && b.ProjectTitle) && (a.ProjectTitle.toUpperCase() < b.ProjectTitle.toUpperCase())) { return 1; }
                                if ((a.ProjectTitle && b.ProjectTitle) && (a.ProjectTitle.toUpperCase() > b.ProjectTitle.toUpperCase())) { return -1; }
                                return 0;
                            });
                        } else {
                            console.log('Error in renderDetailedList_PinnedRequests().ProjectTitle. Unexpected value for sortOrder: ' + sortOrder);
                            displayAlertDialog('Error in renderDetailedList_PinnedRequests().ProjectTitle. Unexpected value for sortOrder: ' + sortOrder);
                        }

                    } else {
                        console.log('Error in renderDetailedList_PinnedRequests(). Unexpected value for dataElement: ' + dataElement);
                        displayAlertDialog('Error in renderDetailedList_PinnedRequests(). Unexpected value for dataElement: ' + dataElement);
                    }

                }

                //var taskData = this.options.taskData;
                //var brData = this.options.brData;
                //var myBrData = this.options.myBrData
                var serverside = false;
                var deferredIndex = this.options.deferredIndex;
                var invitationData = null;

                var html = '';

                html += '<div id="divDataGridTable" style="overflow-y: scroll;" onscroll="$(\'.bwDataGrid\').bwDataGrid(\'dataGrid_OnScroll\', this, \'' + 'bwRequestTypeId' + '\');">'; // Commented out bwRequestTypeId.. not sure why it is here... 4-22-2022

                html += '<table id="dataGridTable" class="dataGridTable" bwworkflowappid="' + workflowAppId + '">';

                html += '  <tr class="headerRow">';
                html += '    <td></td>';

                // "Title" column header.
                html += '    <td style="white-space:nowrap;">';
                html += '       <div style="vertical-align:middle;display:inline-block;">Request Id&nbsp;</div>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_PinnedRequests\', \'Title\', \'descending\', this);">'; // brData.PendingBudgetRequests[i].Title;
                html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_PinnedRequests\', \'Title\', \'ascending\', this);">';
                html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '   </td>';

                // "Days Overdue" column header.
                html += '   <td style="white-space:nowrap;">';
                html += '       <div style="vertical-align:middle;display:inline-block;">Status&nbsp;</div>';
                //html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_PinnedRequests\', \'OrgName\', \'descending\', this);">'; // no value for this column yet
                //html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
                //html += '       </span>';
                //html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_PinnedRequests\', \'OrgName\', \'ascending\', this);">';
                //html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
                //html += '       </span>';
                html += '   </td>';

                // "Description" column header.
                html += '    <td style="white-space:nowrap;">';
                html += '       <div style="vertical-align:middle;display:inline-block;">Description&nbsp;</div>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_PinnedRequests\', \'ProjectTitle\', \'descending\', this);">'; // brData.PendingBudgetRequests[i].ProjectTitle;
                html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_PinnedRequests\', \'ProjectTitle\', \'ascending\', this);">';
                html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '   </td>';

                // "Capital Cost" column header. 
                html += '    <td style="white-space:nowrap;">';
                html += '       <div style="vertical-align:middle;display:inline-block;">Capital Cost&nbsp;</div>';
                //html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_PinnedRequests\', \'RequestedCapital\', \'descending\', this);">';
                ////var requestedCapital = brData.PendingBudgetRequests[i].RequestedCapital;
                ////var requestedExpense = brData.PendingBudgetRequests[i].RequestedExpense;
                //// currentAmount = Number(requestedCapital) + Number(requestedExpense);
                //html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
                //html += '       </span>';
                //html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_PinnedRequests\', \'RequestedCapital\', \'ascending\', this);">';
                //html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
                //html += '       </span>';
                html += '   </td>';

                // "Role" column header.
                html += '    <td style="white-space:nowrap;">';
                html += '       <div style="vertical-align:middle;display:inline-block;">Your role&nbsp;</div>';
                //html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_PinnedRequests\', \'ProjectTitle\', \'descending\', this);">'; // no value for this column yet
                //html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
                //html += '       </span>';
                //html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_PinnedRequests\', \'ProjectTitle\', \'ascending\', this);">';
                //html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
                //html += '       </span>';
                html += '   </td>';

                html += '    <td></td>';

                html += '  </tr>';

                html += '  <tr class="filterRow">';

                // Title
                html += '    <td></td>';

                // Days overdue
                html += '    <td></td>';

                // Description
                //html += '    <td style="white-space:nowrap;"><span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="alert(\'Order ascending...\');">☝</span><span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="alert(\'Order descending...\');">☟</span></td>';
                html += '    <td style="white-space:nowrap;">';

                html += '   </td>';

                // Requested Capital
                html += '   <td style="white-space:nowrap;">';
                //html += '       <input type="text" id="txtArchivePageDescriptionFilter" class="archivePageFilterBox" title="Type here to limit search results, using * as a wildcard character."/>';
                html += '   </td>';

                // Role
                html += '   <td style="white-space:nowrap;">';
                //html += '       <input type="text" id="txtArchivePageDescriptionFilter" class="archivePageFilterBox" title="Type here to limit search results, using * as a wildcard character."/>';
                html += '   </td>';

                html += '  </tr>';

                var alternatingRow = 'light'; // Use this to color the rows.
                for (var i = 0; i < pinnedRequests.length; i++) {
                    var budgetRequestId = pinnedRequests[i].bwBudgetRequestId;
                    var brTitle = pinnedRequests[i].ProjectTitle;

                    if (brTitle.indexOf('<') > -1) {
                        alert('FOUND A < character in the ProjectTitle. Fix this!');





                    }






                    var title = pinnedRequests[i].Title;
                    var budgetAmount = pinnedRequests[i].BudgetAmount;
                    var requestedCapital = pinnedRequests[i].RequestedCapital;
                    var requestedExpense = pinnedRequests[i].RequestedExpense;

                    var arName = pinnedRequests[i].ProjectTitle;

                    var appWebUrl = $('.bwAuthentication').bwAuthentication('option', 'operationUriPrefix'); //'https://budgetworkflow.com';

                    var orgId = pinnedRequests[i].OrgId;
                    var orgName = pinnedRequests[i].OrgName;
                    // orgId
                    // orgName

                    var currentAmount = 0;
                    if (budgetAmount == 'null') {
                        currentAmount = Number(requestedCapital) + Number(requestedExpense);
                    } else {
                        currentAmount = budgetAmount;
                    }

                    if (alternatingRow == 'light') {
                        html += '<tr class="alternatingRowLight" style="cursor:pointer;" ';
                        html += '>';
                        alternatingRow = 'dark';
                    } else {
                        //html += '  <tr class="alternatingRowDark" style="cursor:pointer;" onmouseover="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'showRowHoverDetails\', \'' + budgetRequests[i].Title + '\', \'' + budgetRequests[i].ProjectTitle + '\', \'' + JSON.parse(budgetRequests[i].bwRequestJson).BriefDescriptionOfProject + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\', \'' + budgetRequests[i].OrgId + '\', \'' + budgetRequests[i].OrgName + '\');"  >';
                        html += '<tr class="alternatingRowDark" style="cursor:pointer;" ';
                        html += '>';
                        alternatingRow = 'light';
                    }




                    // Extract the bwJustificationDetailsField, if it exists, from the bwRequestJson.
                    var bwJustificationDetailsField = '';
                    if (pinnedRequests[i].bwRequestJson) {
                        var bwRequestJson = pinnedRequests[i].bwRequestJson;
                        var json2 = JSON.parse(bwRequestJson);
                        if (json2.bwJustificationDetailsField && json2.bwJustificationDetailsField.value) {
                            bwJustificationDetailsField = json2.bwJustificationDetailsField.value;
                        }
                    }




                    // Magnifying glass.
                    html += '   <td style="padding:15px;" ';
                    //var bwRequestJson = { // 8-26-2022
                    //    DisplayType: 'REQUEST',
                    //    bwBudgetRequestId: pinnedRequests[i].bwBudgetRequestId,
                    //    Title: pinnedRequests[i].Title,
                    //    ProjectTitle: pinnedRequests[i].ProjectTitle,
                    //    OrgId: pinnedRequests[i].OrgId,
                    //    OrgName: pinnedRequests[i].OrgName,
                    //    Created: pinnedRequests[i].Created,
                    //    CreatedBy: pinnedRequests[i].CreatedBy,
                    //    RequestedCapital: pinnedRequests[i].RequestedCapital,
                    //    BudgetWorkflowStatus: pinnedRequests[i].BudgetWorkflowStatus,
                    //    BriefDescriptionOfProject: pinnedRequests[i].BriefDescriptionOfProject,
                    //    bwJustificationDetailsField: bwJustificationDetailsField
                    //}
                    html += '      onmouseenter="$(\'.bwCoreComponent:first\').bwCoreComponent(\'showRowHoverDetails\', \'' + bwEncodeURIComponent(JSON.stringify(pinnedRequests[i])) + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';





                    html += '       onmouseleave="$(\'.bwCoreComponent:first\').bwCoreComponent(\'hideRowHoverDetails\');this.style.backgroundColor=\'white\';"';
                    html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\', \'' + '' + '\', \'' + budgetRequestId + '\');" ';
                    html += '   ><img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg"></td>';

                    // Title
                    html += '<td style="padding:15px;" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com/\', \'' + budgetRequestId + '\', \'' + title + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');">';
                    html += title;
                    html += '</td>';

                    // Days overdue.
                    html += '       <td style="padding:15px;" ';
                    //html += '       onmouseenter="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'showRowHoverDetails\', \'' + title + '\', \'' + brTitle + '\', \'' + brTitle + '\', \'' + bwWorkflowAppId + '\', \'' + budgetRequestId + '\', \'' + orgId + '\', \'' + orgName + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                    //html += '       onmouseleave="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'hideRowHoverDetails\');this.style.backgroundColor=\'white\';"';
                    html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + title + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');" ';
                    html += '>';
                    html += '           <div style="display:inline-block;" bwtrace="xcx778451">';
                    //if (daysSinceTaskCreated == 1) {
                    //    html += '           &nbsp;&nbsp;This task is ' + daysSinceTaskCreated.toString() + ' day old.&nbsp;&nbsp;';
                    //} else {
                    //    html += '           &nbsp;&nbsp;This task is ' + daysSinceTaskCreated.toString() + ' days old.&nbsp;&nbsp;';
                    //}
                    html += '           </div>';
                    html += '       </td>';

                    // Description
                    html += '<td style="padding:15px;" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com/\', \'' + budgetRequestId + '\', \'' + title + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');">';
                    html += brTitle;
                    html += '</td>';

                    // Capital Cost
                    html += '<td style="padding:15px;text-align:right;" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com/\', \'' + budgetRequestId + '\', \'' + title + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');">';
                    html += formatCurrency(currentAmount);
                    html += '</td>';

                    // Role
                    html += '<td style="padding:15px;" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com/\', \'' + budgetRequestId + '\', \'' + title + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');">';
                    //html += '[(' + bwAssignedToRaciRoleAbbreviation + ') ' + bwAssignedToRaciRoleName + ']';
                    html += '</td>';


                    // KEEP THIS HERE FOR when we resurrect RECURRING_EXPENSE_NOTIFICATION_TASK <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                    //var functionalAreaId = taskData[i].FinancialAreaId; // Find the functional area name.
                    //var functionalAreaName = '';
                    //try {
                    //    if (BWMData[0]) {
                    //        for (var x = 0; x < BWMData[0].length; x++) {
                    //            if (BWMData[0][x][0] = bwWorkflowAppId) { // We have the correct workflow!
                    //                for (var fai = 0; fai < BWMData[0][x][4].length; fai++) {
                    //                    if (functionalAreaId == BWMData[0][x][4][fai][0]) {
                    //                        functionalAreaName = BWMData[0][x][4][fai][1];
                    //                    }
                    //                }
                    //            }
                    //        }
                    //    }
                    //} catch (e) {
                    //}
                    //if (taskType == 'RECURRING_EXPENSE_NOTIFICATION_TASK') {
                    //    html += '       <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;" colspan="5">';
                    //    html += '           <div style="display:inline-block;">';
                    //    html += '               <a style="cursor:pointer;" onclick="displayRecurringExpenseOnTheHomePage(\'' + budgetRequestId + '\', \'' + participantId + '\', \'' + title + '\');" target="_blank" title="Click to view the recurring expense...">' + daysSinceTaskCreated.toString() + ' days overduexcx1: Recurring expense <em>(' + brTitle + ' - ' + functionalAreaName + ') is due to be submitted</em></a>';
                    //    html += '           </div>';
                    //    html += '       </td>';
                    //} else if (taskType == 'BUDGET_REQUEST_WORKFLOW_TASK') {
                    //    html += '       <td style="width:45px;"></td>';
                    //    html += '       <td style="background-color:white;" ';
                    //    html += '           onmouseenter="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'showRowHoverDetails\', \'' + title + '\', \'' + brTitle + '\', \'' + '' + '\', \'' + bwWorkflowAppId + '\', \'' + budgetRequestId + '\', \'' + orgId + '\', \'' + orgName + '\', this);" ';
                    //    html += '           onmouseleave="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'hideRowHoverDetails\');" ';
                    //    html += '>';
                    //    html += '           <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="' + imageRootPath + '/images/zoom.jpg" />';
                    //    html += '       </td>';

                    //    html += '       <td colspan="3" style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" ';
                    //    html += '           onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';bwCommonScripts.highlightExecutiveSummaryForRequest(\'' + budgetRequestId + '\');" ';
                    //    html += '           onmouseleave="this.style.backgroundColor=\'#d8d8d8\';bwCommonScripts.unHighlightExecutiveSummaryForRequest(\'' + budgetRequestId + '\');"  ';
                    //    html += '           onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\', \'' + bwAssignedToRaciRoleAbbreviation + '\', \'' + bwWorkflowTaskItemId + '\');" ';
                    //    html += '>';
                    //    html += '           <div style="display:inline-block;" bwtrace="xcx778451">';
                    //    if (daysSinceTaskCreated == 1) {
                    //        html += '           &nbsp;&nbsp;' + daysSinceTaskCreated.toString() + ' day overduexcx1: ';
                    //    } else {
                    //        html += '           &nbsp;&nbsp;' + daysSinceTaskCreated.toString() + ' days overduexcx2: ';
                    //    }
                    //    html += '               <em>';
                    //    html += title + ' - ' + brTitle + ' - ' + formatCurrency(currentAmount) + ' - ' + functionalAreaName + ' ' + '[(' + bwAssignedToRaciRoleAbbreviation + ') ' + bwAssignedToRaciRoleName + ']';
                    //    html += '               </em>';
                    //    html += '           </div>';
                    //    html += '       </td>';

                    //} else {
                    //    html += '       <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;" colspan="5">UNKNOWN TASK TYPE</td>';
                    //}

                    html += '       </tr>';

                }
                html += '       </tbody></table>';


                //return html;
                $('#divBwExecutiveSummariesCarousel_PinnedRequests').html(html);

            }

        } catch (e) {
            console.log('Exception in renderDetailedList_PinnedRequests():1335-1: ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderDetailedList_PinnedRequests():1335-1: ' + e.message + ', ' + e.stack);
            var result = {
                html: 'Exception in renderDetailedList_PinnedRequests():1335-1: ' + e.message + ', ' + e.stack
            }
            return result;
        }
    },
    renderDetailedList_MyPendingTasks: function (dataElement, sortOrder) {
        try {
            console.log('In renderDetailedList_MyPendingTasks().');
            localStorage.setItem('bwDisplayFormat', 'DetailedList');

            $('#buttonDisplayRequestsAsTiles_MyPendingTasks').removeClass().addClass('divCarouselButton'); // Unselect the other button.
            $('#buttonDisplayRequestsAsDetailedList_MyPendingTasks').removeClass().addClass('divCarouselButton_Selected'); // Select this one.

            $('#divBwExecutiveSummariesCarousel_MyPendingTasks').html('');

            var taskData = this.options.taskData;
            if (dataElement && sortOrder) {
                // If we get these parameters, then we will sort the data here.
                //displayAlertDialog('In renderDetailedList_MySubmittedRequests(). Sorting!! dataElement: ' + dataElement + ', sortOrder: ' + sortOrder + ', pendingBudgetRequests: ' + JSON.stringify(pendingBudgetRequests));

                // brData.PendingBudgetRequests[i].Title
                // brData.PendingBudgetRequests[i].ProjectTitle
                // brData.PendingBudgetRequests[i].RequestedCapital +  brData.PendingBudgetRequests[i].RequestedExpense

                if (dataElement == 'Title') {

                    if (sortOrder == 'ascending') {
                        taskData.sort(function (a, b) {
                            if (a.Title < b.Title) { return -1; }
                            if (a.Title > b.Title) { return 1; }
                            return 0;
                        });
                    } else if (sortOrder == 'descending') {
                        taskData.sort(function (a, b) {
                            if (a.Title < b.Title) { return 1; }
                            if (a.Title > b.Title) { return -1; }
                            return 0;
                        });
                    } else {
                        console.log('Error in renderDetailedList_MySubmittedRequests().Title. Unexpected value for sortOrder: ' + sortOrder);
                        displayAlertDialog('Error in renderDetailedList_MySubmittedRequests().Title. Unexpected value for sortOrder: ' + sortOrder);
                    }

                } else if (dataElement == 'ProjectTitle') {

                    if (sortOrder == 'ascending') {
                        taskData.sort(function (a, b) {
                            if ((a.ProjectTitle && b.ProjectTitle) && (a.ProjectTitle.toUpperCase() < b.ProjectTitle.toUpperCase())) { return -1; }
                            if ((a.ProjectTitle && b.ProjectTitle) && (a.ProjectTitle.toUpperCase() > b.ProjectTitle.toUpperCase())) { return 1; }
                            return 0;
                        });
                    } else if (sortOrder == 'descending') {
                        taskData.sort(function (a, b) {
                            if ((a.ProjectTitle && b.ProjectTitle) && (a.ProjectTitle.toUpperCase() < b.ProjectTitle.toUpperCase())) { return 1; }
                            if ((a.ProjectTitle && b.ProjectTitle) && (a.ProjectTitle.toUpperCase() > b.ProjectTitle.toUpperCase())) { return -1; }
                            return 0;
                        });
                    } else {
                        console.log('Error in renderDetailedList_MySubmittedRequests().ProjectTitle. Unexpected value for sortOrder: ' + sortOrder);
                        displayAlertDialog('Error in renderDetailedList_MySubmittedRequests().ProjectTitle. Unexpected value for sortOrder: ' + sortOrder);
                    }

                } else if (dataElement == 'RequestedCapital') {

                    if (sortOrder == 'ascending') {
                        taskData.sort(function (a, b) {
                            if (a.RequestedCapital < b.RequestedCapital) { return -1; }
                            if (a.RequestedCapital > b.RequestedCapital) { return 1; }
                            return 0;
                        });
                    } else if (sortOrder == 'descending') {
                        taskData.sort(function (a, b) {
                            if (a.RequestedCapital < b.RequestedCapital) { return 1; }
                            if (a.RequestedCapital > b.RequestedCapital) { return -1; }
                            return 0;
                        });
                    } else {
                        console.log('Error in renderDetailedList_MySubmittedRequests().RequestedCapital. Unexpected value for sortOrder: ' + sortOrder);
                        displayAlertDialog('Error in renderDetailedList_MySubmittedRequests().RequestedCapital. Unexpected value for sortOrder: ' + sortOrder);
                    }

                } else if (dataElement == 'WorkflowStepName') {

                    if (sortOrder == 'ascending') {
                        taskData.sort(function (a, b) {
                            if (a.WorkflowStepName < b.WorkflowStepName) { return -1; }
                            if (a.WorkflowStepName > b.WorkflowStepName) { return 1; }
                            return 0;
                        });
                    } else if (sortOrder == 'descending') {
                        taskData.sort(function (a, b) {
                            if (a.WorkflowStepName < b.WorkflowStepName) { return 1; }
                            if (a.WorkflowStepName > b.WorkflowStepName) { return -1; }
                            return 0;
                        });
                    } else {
                        console.log('Error in renderDetailedList_MySubmittedRequests().WorkflowStepName. Unexpected value for sortOrder: ' + sortOrder);
                        displayAlertDialog('Error in renderDetailedList_MySubmittedRequests().WorkflowStepName. Unexpected value for sortOrder: ' + sortOrder);
                    }

                } else if (dataElement == 'bwAssignedToRaciRoleName') {
                    //alert('taskData: ' + JSON.stringify(taskData));
                    if (sortOrder == 'ascending') {
                        taskData.sort(function (a, b) {
                            if (a.bwAssignedToRaciRoleName < b.bwAssignedToRaciRoleName) { return -1; }
                            if (a.bwAssignedToRaciRoleName > b.bwAssignedToRaciRoleName) { return 1; }
                            return 0;
                        });
                    } else if (sortOrder == 'descending') {
                        taskData.sort(function (a, b) {
                            if (a.bwAssignedToRaciRoleName < b.bwAssignedToRaciRoleName) { return 1; }
                            if (a.bwAssignedToRaciRoleName > b.bwAssignedToRaciRoleName) { return -1; }
                            return 0;
                        });
                    } else {
                        console.log('Error in renderDetailedList_MySubmittedRequests().bwAssignedToRaciRoleName. Unexpected value for sortOrder: ' + sortOrder);
                        displayAlertDialog('Error in renderDetailedList_MySubmittedRequests().bwAssignedToRaciRoleName. Unexpected value for sortOrder: ' + sortOrder);
                    }

                } else {
                    console.log('Error in renderDetailedList_MySubmittedRequests(). Unexpected value for dataElement: ' + dataElement);
                    displayAlertDialog('Error in renderDetailedList_MySubmittedRequests(). Unexpected value for dataElement: ' + dataElement);
                }

            }


            //var taskData = this.options.taskData;
            //var brData = this.options.brData;
            //var myBrData = this.options.myBrData
            var serverside = false;
            var deferredIndex = this.options.deferredIndex;
            var bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var invitationData = null;

            var html = '';

            html += '<div id="divDataGridTable" style="overflow-y: scroll;" onscroll="$(\'.bwDataGrid\').bwDataGrid(\'dataGrid_OnScroll\', this, \'' + 'bwRequestTypeId' + '\');">';

            html += '<table id="dataGridTable" class="dataGridTable" bwworkflowappid="' + workflowAppId + '">';

            html += '  <tr class="headerRow">';
            html += '    <td></td>';

            // "Request Id" column header.
            html += '    <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Request Id&nbsp;</div>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_MyPendingTasks\', \'Title\', \'descending\', this);">';
            html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_MyPendingTasks\', \'Title\', \'ascending\', this);">';
            html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '   </td>';


            // "Title" column header.
            html += '    <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Task&nbsp;</div>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_MyPendingTasks\', \'Title\', \'descending\', this);">';
            html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_MyPendingTasks\', \'Title\', \'ascending\', this);">';
            html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '   </td>';

            // "Days Overdue" column header.
            html += '   <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Status&nbsp;</div>';
            //html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'OrgName\', \'descending\', this);">';
            //html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
            //html += '       </span>';
            //html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'OrgName\', \'ascending\', this);">';
            //html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
            //html += '       </span>';
            html += '   </td>';

            // "Description" column header.
            html += '    <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Description&nbsp;</div>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_MyPendingTasks\', \'ProjectTitle\', \'descending\', this);">';
            html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_MyPendingTasks\', \'ProjectTitle\', \'ascending\', this);">';
            html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '   </td>';

            // "Capital Cost" column header. 
            html += '    <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Capital Cost&nbsp;</div>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_MyPendingTasks\', \'RequestedCapital\', \'descending\', this);">';
            html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_MyPendingTasks\', \'RequestedCapital\', \'ascending\', this);">';
            html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '   </td>';

            // "Workflow Step" column header.
            html += '    <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Workflow Step&nbsp;</div>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_MyPendingTasks\', \'WorkflowStepName\', \'descending\', this);">';
            html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_MyPendingTasks\', \'WorkflowStepName\', \'ascending\', this);">';
            html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '   </td>';

            // "Role" column header.
            html += '    <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Your role&nbsp;</div>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_MyPendingTasks\', \'bwAssignedToRaciRoleName\', \'descending\', this);">';
            html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_MyPendingTasks\', \'bwAssignedToRaciRoleName\', \'ascending\', this);">';
            html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '   </td>';

            html += '    <td></td>';

            html += '  </tr>';

            html += '  <tr class="filterRow">';

            // Request Id
            html += '    <td></td>';

            // Title
            html += '    <td></td>';

            // Days overdue
            html += '    <td></td>';

            // Description
            //html += '    <td style="white-space:nowrap;"><span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="alert(\'Order ascending...\');">☝</span><span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="alert(\'Order descending...\');">☟</span></td>';
            html += '    <td style="white-space:nowrap;">';

            html += '   </td>';

            // Requested Capital
            html += '   <td style="white-space:nowrap;">';
            //html += '       <input type="text" id="txtArchivePageDescriptionFilter" class="archivePageFilterBox" title="Type here to limit search results, using * as a wildcard character."/>';
            html += '   </td>';

            // Workflow Step
            html += '   <td style="white-space:nowrap;">';
            //html += '       <input type="text" id="txtArchivePageDescriptionFilter" class="archivePageFilterBox" title="Type here to limit search results, using * as a wildcard character."/>';
            html += '   </td>';

            // Role
            html += '   <td style="white-space:nowrap;">';
            //html += '       <input type="text" id="txtArchivePageDescriptionFilter" class="archivePageFilterBox" title="Type here to limit search results, using * as a wildcard character."/>';
            html += '   </td>';

            html += '  </tr>';

            var alternatingRow = 'light'; // Use this to color the rows.
            for (var i = 0; i < taskData.length; i++) {
                var bwWorkflowTaskItemId = taskData[i].bwWorkflowTaskItemId; // added 12-23-2021
                var taskTitle = taskData[i].bwTaskTitle;
                var appWebUrl = appweburl;
                var budgetRequestId = taskData[i].bwRelatedItemId;
                var arName = taskData[i].Title; // DUPLICATE
                var brTitle = taskData[i].ProjectTitle;
                var title = taskData[i].Title;
                var budgetAmount = taskData[i].BudgetAmount;
                var requestedCapital = taskData[i].RequestedCapital;
                var requestedExpense = taskData[i].RequestedExpense;
                var taskType = taskData[i].TaskType;
                var bwAssignedToRaciRoleAbbreviation = taskData[i].bwAssignedToRaciRoleAbbreviation;
                var bwAssignedToRaciRoleName = taskData[i].bwAssignedToRaciRoleName;
                var orgId = taskData[i].OrgId;
                var orgName = taskData[i].OrgName;


                //alert('xcx43536. bwWorkflowAppId: ' + bwWorkflowAppId + ', bwWorkflowTaskItemId: ' + bwWorkflowTaskItemId);


                // 4-21-2022
                var workflowStepName = taskData[i].WorkflowStepName;


                var currentAmount = 0;
                if (budgetAmount == 'null') {
                    currentAmount = Number(requestedCapital) + Number(requestedExpense);
                } else {
                    currentAmount = budgetAmount;
                }
                var daysSinceTaskCreated = 0;
                // debugger; // 3-1-2022
                if (taskData[i].Created) {
                    var cd = taskData[i].Created;
                    var year = cd.split('-')[0];
                    var month = cd.split('-')[1];
                    var day = cd.split('-')[2].split('T')[0];
                    var taskCreatedDate = new Date(Number(year), Number(month) - 1, Number(day) - 1); // +1 because we're using overdue date.
                    var todaysDate = new Date();
                    var utc1 = Date.UTC(taskCreatedDate.getFullYear(), taskCreatedDate.getMonth(), taskCreatedDate.getDate());
                    var utc2 = Date.UTC(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate());
                    var _MS_PER_DAY = 1000 * 60 * 60 * 24;
                    daysSinceTaskCreated = Math.floor((utc2 - utc1) / _MS_PER_DAY) - 1;
                } else {
                    daysSinceTaskCreated = '<span title="This is likely an old task, created before the Create date format was changed." alt="This is likely an old task, created before the Create date format was changed.">[error xcx232135-1-3-1]</span>';
                }



                if (!bwWorkflowTaskItemId) {
                    alert('In bwExecutiveSummariesCarousel2.js.renderDetailedList_MyPendingTasks(). xcx124243245342532 bwWorkflowTaskItemId: ' + bwWorkflowTaskItemId);
                }




                if (alternatingRow == 'light') {
                    html += '<tr class="alternatingRowLight" style="cursor:pointer;" ';
                    html += '>';
                    alternatingRow = 'dark';
                } else {
                    html += '<tr class="alternatingRowDark" style="cursor:pointer;" ';
                    html += '>';
                    alternatingRow = 'light';
                }







                //alert('xcx21123 taskData[i]: ' + JSON.stringify(taskData[i]));

                // Extract the bwJustificationDetailsField, if it exists, from the bwRequestJson. For tasks it is more involved, as we have to look it up by looping through all the requests.
                //var bwJustificationDetailsField = '';
                //for (var i = 0; i < this.options.brData.PendingBudgetRequests.length; i++) {
                //    if (budgetRequestId == this.options.brData.PendingBudgetRequests[i].bwBudgetRequestId) {
                //        if (this.options.brData.PendingBudgetRequests[i].bwRequestJson) {
                //            var bwRequestJson = this.options.brData.PendingBudgetRequests[i].bwRequestJson;
                //            var json2 = JSON.parse(bwRequestJson);
                //            if (json2.bwJustificationDetailsField && json2.bwJustificationDetailsField.value) {
                //                bwJustificationDetailsField = json2.bwJustificationDetailsField.value;
                //            }
                //        }
                //        break;
                //    }
                //}





                // Magnifying glass.
                html += '   <td style="padding:15px;" ';

                //var bwRequestJson = { // 8-26-2022
                //    DisplayType: 'TASK', // 'REQUEST'
                //    bwBudgetRequestId: budgetRequestId,
                //    Title: taskData[i].bwTaskTitle,
                //    ProjectTitle: taskData[i].ProjectTitle,
                //    OrgId: taskData[i].OrgId,
                //    OrgName: taskData[i].OrgName,
                //    Created: taskData[i].Created,
                //    CreatedBy: taskData[i].CreatedBy,
                //    RequestedCapital: taskData[i].RequestedCapital,
                //    BriefDescriptionOfProject: taskData[i].BriefDescriptionOfProject, // Do we need these ones?
                //    bwAssignedToRaciRoleName: taskData[i].bwAssignedToRaciRoleName, // Do we need these ones?
                //    bwAssignedToRaciRoleAbbreviation: taskData[i].bwAssignedToRaciRoleAbbreviation, // Do we need these ones?
                //    WorkflowStepName: taskData[i].WorkflowStepName, // Do we need these ones?
                //    bwStatus: taskData[i].bwStatus, // Do we need these ones?
                //    bwTaskOutcome: taskData[i].bwTaskOutcome // Do we need these ones?
                //}// 

                //html += '      onmouseenter="$(\'.bwCoreComponent:first\').bwCoreComponent(\'showRowHoverDetails\', \'' + bwEncodeURIComponent(JSON.stringify(bwRequestJson)) + '\', true);this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                html += '      onmouseenter="$(\'.bwCoreComponent:first\').bwCoreComponent(\'showRowHoverDetails\', \'' + bwEncodeURIComponent(JSON.stringify(taskData[i])) + '\', true);this.style.backgroundColor=\'lightgoldenrodyellow\';" ';




                html += '       onmouseleave="$(\'.bwCoreComponent:first\').bwCoreComponent(\'hideRowHoverDetails\');this.style.backgroundColor=\'white\';"';
                html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\', \'' + bwAssignedToRaciRoleAbbreviation + '\', \'' + bwWorkflowTaskItemId + '\');" ';
                html += '   ><img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg"></td>';




                // Request Id 10-20-2022
                html += '<td style="padding:15px;" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\', \'' + bwAssignedToRaciRoleAbbreviation + '\', \'' + bwWorkflowTaskItemId + '\');">';
                html += title; //title;
                html += '</td>';






                // Title
                html += '<td style="padding:15px;" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\', \'' + bwAssignedToRaciRoleAbbreviation + '\', \'' + bwWorkflowTaskItemId + '\');">';
                html += taskData[i].bwTaskTitle; //title;
                html += '</td>';

                // Days overdue.
                html += '       <td style="padding:15px;" ';
                html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\', \'' + bwAssignedToRaciRoleAbbreviation + '\', \'' + bwWorkflowTaskItemId + '\');" ';
                html += '>';
                html += '           <div style="display:inline-block;" bwtrace="xcx778451">';
                if (daysSinceTaskCreated == 1) {
                    html += '           &nbsp;&nbsp;This task is ' + daysSinceTaskCreated.toString() + ' day old.&nbsp;&nbsp;';
                } else {
                    html += '           &nbsp;&nbsp;This task is ' + daysSinceTaskCreated.toString() + ' days old.&nbsp;&nbsp;';
                }
                html += '           </div>';
                html += '       </td>';

                // Description
                html += '<td style="padding:15px;" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\', \'' + bwAssignedToRaciRoleAbbreviation + '\', \'' + bwWorkflowTaskItemId + '\');">';
                html += brTitle;
                html += '</td>';

                // Capital Cost
                html += '<td style="padding:15px;text-align:right;" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\', \'' + bwAssignedToRaciRoleAbbreviation + '\', \'' + bwWorkflowTaskItemId + '\');">';
                html += formatCurrency(currentAmount);
                html += '</td>';

                // Workflow Step
                html += '<td style="padding:15px;" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\', \'' + bwAssignedToRaciRoleAbbreviation + '\', \'' + bwWorkflowTaskItemId + '\');">';
                html += '[(' + workflowStepName + ') ' + workflowStepName + ']';
                html += '</td>';

                // Role
                html += '<td style="padding:15px;" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\', \'' + bwAssignedToRaciRoleAbbreviation + '\', \'' + bwWorkflowTaskItemId + '\');">';
                //html += '[(' + bwAssignedToRaciRoleAbbreviation + ') ' + bwAssignedToRaciRoleName + ']';
                html += bwAssignedToRaciRoleName + ' (' + bwAssignedToRaciRoleAbbreviation + ')';
                html += '</td>';


                // KEEP THIS HERE FOR when we resurrect RECURRING_EXPENSE_NOTIFICATION_TASK <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                //var functionalAreaId = taskData[i].FinancialAreaId; // Find the functional area name.
                //var functionalAreaName = '';
                //try {
                //    if (BWMData[0]) {
                //        for (var x = 0; x < BWMData[0].length; x++) {
                //            if (BWMData[0][x][0] = bwWorkflowAppId) { // We have the correct workflow!
                //                for (var fai = 0; fai < BWMData[0][x][4].length; fai++) {
                //                    if (functionalAreaId == BWMData[0][x][4][fai][0]) {
                //                        functionalAreaName = BWMData[0][x][4][fai][1];
                //                    }
                //                }
                //            }
                //        }
                //    }
                //} catch (e) {
                //}
                //if (taskType == 'RECURRING_EXPENSE_NOTIFICATION_TASK') {
                //    html += '       <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;" colspan="5">';
                //    html += '           <div style="display:inline-block;">';
                //    html += '               <a style="cursor:pointer;" onclick="displayRecurringExpenseOnTheHomePage(\'' + budgetRequestId + '\', \'' + participantId + '\', \'' + title + '\');" target="_blank" title="Click to view the recurring expense...">' + daysSinceTaskCreated.toString() + ' days overduexcx1: Recurring expense <em>(' + brTitle + ' - ' + functionalAreaName + ') is due to be submitted</em></a>';
                //    html += '           </div>';
                //    html += '       </td>';
                //} else if (taskType == 'BUDGET_REQUEST_WORKFLOW_TASK') {
                //    html += '       <td style="width:45px;"></td>';
                //    html += '       <td style="background-color:white;" ';
                //    html += '           onmouseenter="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'showRowHoverDetails\', \'' + title + '\', \'' + brTitle + '\', \'' + '' + '\', \'' + bwWorkflowAppId + '\', \'' + budgetRequestId + '\', \'' + orgId + '\', \'' + orgName + '\', this);" ';
                //    html += '           onmouseleave="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'hideRowHoverDetails\');" ';
                //    html += '>';
                //    html += '           <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="' + imageRootPath + '/images/zoom.jpg" />';
                //    html += '       </td>';

                //    html += '       <td colspan="3" style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" ';
                //    html += '           onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';bwCommonScripts.highlightExecutiveSummaryForRequest(\'' + budgetRequestId + '\');" ';
                //    html += '           onmouseleave="this.style.backgroundColor=\'#d8d8d8\';bwCommonScripts.unHighlightExecutiveSummaryForRequest(\'' + budgetRequestId + '\');"  ';
                //    html += '           onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\', \'' + bwAssignedToRaciRoleAbbreviation + '\', \'' + bwWorkflowTaskItemId + '\');" ';
                //    html += '>';
                //    html += '           <div style="display:inline-block;" bwtrace="xcx778451">';
                //    if (daysSinceTaskCreated == 1) {
                //        html += '           &nbsp;&nbsp;' + daysSinceTaskCreated.toString() + ' day overduexcx1: ';
                //    } else {
                //        html += '           &nbsp;&nbsp;' + daysSinceTaskCreated.toString() + ' days overduexcx2: ';
                //    }
                //    html += '               <em>';
                //    html += title + ' - ' + brTitle + ' - ' + formatCurrency(currentAmount) + ' - ' + functionalAreaName + ' ' + '[(' + bwAssignedToRaciRoleAbbreviation + ') ' + bwAssignedToRaciRoleName + ']';
                //    html += '               </em>';
                //    html += '           </div>';
                //    html += '       </td>';

                //} else {
                //    html += '       <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;" colspan="5">UNKNOWN TASK TYPE</td>';
                //}

                html += '       </tr>';

            }
            html += '       </tbody></table>';


            //return html;
            $('#divBwExecutiveSummariesCarousel_MyPendingTasks').html(html);


        } catch (e) {
            console.log('Exception in renderDetailedList_MyPendingTasks():1335-1: ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderDetailedList_MyPendingTasks():1335-1: ' + e.message + ', ' + e.stack);
            var result = {
                html: 'Exception in renderDetailedList_MyPendingTasks():1335-1: ' + e.message + ', ' + e.stack
            }
            return result;
        }
    },

    //renderDetailedList_AllActiveRequests: function (dataElement, sortOrder) {

    renderDetailedList_MySubmittedRequests: function (dataElement, sortOrder) {
        try {
            console.log('In renderDetailedList_MySubmittedRequests().');
            localStorage.setItem('bwDisplayFormat', 'DetailedList');

            $('#buttonDisplayRequestsAsTiles_MySubmittedRequests').removeClass().addClass('divCarouselButton'); // Unselect the other buttons.
            $('#buttonDisplayRequestsAsDetailedList_MySubmittedRequests').removeClass().addClass('divCarouselButton_Selected'); // Select this one.

            $('#divBwExecutiveSummariesCarousel_MySubmittedRequests').html('');

            var myRequests = this.options.myBrData.MyRequests;
            if (dataElement && sortOrder) {

                // If we get these parameters, then we will sort the data here.
                if (dataElement == 'Title') {

                    if (sortOrder == 'ascending') {
                        myRequests.sort(function (a, b) {
                            if (a.Title < b.Title) { return -1; }
                            if (a.Title > b.Title) { return 1; }
                            return 0;
                        });
                    } else if (sortOrder == 'descending') {
                        myRequests.sort(function (a, b) {
                            if (a.Title < b.Title) { return 1; }
                            if (a.Title > b.Title) { return -1; }
                            return 0;
                        });
                    } else {
                        console.log('Error in renderDetailedList_MySubmittedRequests().Title. Unexpected value for sortOrder: ' + sortOrder);
                        displayAlertDialog('Error in renderDetailedList_MySubmittedRequests().Title. Unexpected value for sortOrder: ' + sortOrder);
                    }

                } else if (dataElement == 'ProjectTitle') {

                    if (sortOrder == 'ascending') {
                        myRequests.sort(function (a, b) {
                            if ((a.ProjectTitle && b.ProjectTitle) && (a.ProjectTitle.toUpperCase() < b.ProjectTitle.toUpperCase())) { return -1; }
                            if ((a.ProjectTitle && b.ProjectTitle) && (a.ProjectTitle.toUpperCase() > b.ProjectTitle.toUpperCase())) { return 1; }
                            return 0;
                        });
                    } else if (sortOrder == 'descending') {
                        myRequests.sort(function (a, b) {
                            if ((a.ProjectTitle && b.ProjectTitle) && (a.ProjectTitle.toUpperCase() < b.ProjectTitle.toUpperCase())) { return 1; }
                            if ((a.ProjectTitle && b.ProjectTitle) && (a.ProjectTitle.toUpperCase() > b.ProjectTitle.toUpperCase())) { return -1; }
                            return 0;
                        });
                    } else {
                        console.log('Error in renderDetailedList_MySubmittedRequests().ProjectTitle. Unexpected value for sortOrder: ' + sortOrder);
                        displayAlertDialog('Error in renderDetailedList_MySubmittedRequests().ProjectTitle. Unexpected value for sortOrder: ' + sortOrder);
                    }

                } else if (dataElement == 'RequestedCapital') {

                    if (sortOrder == 'ascending') {
                        myRequests.sort(function (a, b) {
                            if (a.RequestedCapital < b.RequestedCapital) { return -1; }
                            if (a.RequestedCapital > b.RequestedCapital) { return 1; }
                            return 0;
                        });
                    } else if (sortOrder == 'descending') {
                        myRequests.sort(function (a, b) {
                            if (a.RequestedCapital < b.RequestedCapital) { return 1; }
                            if (a.RequestedCapital > b.RequestedCapital) { return -1; }
                            return 0;
                        });
                    } else {
                        console.log('Error in renderDetailedList_MySubmittedRequests().RequestedCapital. Unexpected value for sortOrder: ' + sortOrder);
                        displayAlertDialog('Error in renderDetailedList_MySubmittedRequests().RequestedCapital. Unexpected value for sortOrder: ' + sortOrder);
                    }

                } else {
                    console.log('Error in renderDetailedList_MySubmittedRequests(). Unexpected value for dataElement: ' + dataElement);
                    displayAlertDialog('Error in renderDetailedList_MySubmittedRequests(). Unexpected value for dataElement: ' + dataElement);
                }

            }

            var serverside = false;
            var deferredIndex = this.options.deferredIndex;
            var bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var invitationData = null;

            var html = '';

            //html += '<div id="divDataGridTable" style="overflow-y: scroll;" onscroll="$(\'.bwDataGrid\').bwDataGrid(\'dataGrid_OnScroll\', this, \'' + bwRequestTypeId + '\');">';

            html += '<table id="dataGridTable" class="dataGridTable" bwworkflowappid="' + workflowAppId + '">';

            html += '  <tr class="headerRow">';
            html += '    <td></td>';

            // "Title" column header.
            html += '    <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Request Id&nbsp;</div>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_MySubmittedRequests\', \'Title\', \'descending\', this);">';
            html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_MySubmittedRequests\', \'Title\', \'ascending\', this);">';
            html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '   </td>';

            // "Days Overdue" column header.
            html += '   <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Status&nbsp;</div>';
            //html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'OrgName\', \'descending\', this);">';
            //html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
            //html += '       </span>';
            //html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'OrgName\', \'ascending\', this);">';
            //html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
            //html += '       </span>';
            html += '   </td>';

            // "Description" column header.
            html += '    <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Description&nbsp;</div>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_MySubmittedRequests\', \'ProjectTitle\', \'descending\', this);">';
            html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_MySubmittedRequests\', \'ProjectTitle\', \'ascending\', this);">';
            html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '   </td>';

            // "Capital Cost" column header. 
            html += '    <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Capital Cost&nbsp;</div>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_MySubmittedRequests\', \'RequestedCapital\', \'descending\', this);">';
            html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_MySubmittedRequests\', \'RequestedCapital\', \'ascending\', this);">';
            html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '   </td>';

            // "Role" column header.
            html += '    <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Your role&nbsp;</div>';
            //html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'ProjectTitle\', \'descending\', this);">';
            //html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
            //html += '       </span>';
            //html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'ProjectTitle\', \'ascending\', this);">';
            //html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
            //html += '       </span>';
            html += '   </td>';

            html += '    <td></td>';

            html += '  </tr>';

            html += '  <tr class="filterRow">';

            // Title
            html += '    <td></td>';

            // Days overdue
            html += '    <td></td>';

            // Description
            //html += '    <td style="white-space:nowrap;"><span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="alert(\'Order ascending...\');">☝</span><span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="alert(\'Order descending...\');">☟</span></td>';
            html += '    <td style="white-space:nowrap;">';

            html += '   </td>';

            // Requested Capital
            html += '   <td style="white-space:nowrap;">';
            //html += '       <input type="text" id="txtArchivePageDescriptionFilter" class="archivePageFilterBox" title="Type here to limit search results, using * as a wildcard character."/>';
            html += '   </td>';

            // Role
            html += '   <td style="white-space:nowrap;">';
            //html += '       <input type="text" id="txtArchivePageDescriptionFilter" class="archivePageFilterBox" title="Type here to limit search results, using * as a wildcard character."/>';
            html += '   </td>';

            html += '  </tr>';

            var alternatingRow = 'light'; // Use this to color the rows.
            //for (var i = 0; i < brData.PendingBudgetRequests.length; i++) {
            for (var i = 0; i < myRequests.length; i++) {
                if (myRequests[i].BudgetWorkflowStatus && (myRequests[i].BudgetWorkflowStatus != 'NOT_SUBMITTED')) {

                    var bwWorkflowTaskItemId = 'xcx1243245235';

                    var taskTitle = myRequests[i].bwTaskTitle;
                    var appWebUrl = appweburl;
                    var budgetRequestId = myRequests[i].bwBudgetRequestId;
                    var arName = myRequests[i].Title; // DUPLICATE
                    var brTitle = myRequests[i].ProjectTitle;
                    var title = myRequests[i].Title;
                    var budgetAmount = myRequests[i].BudgetAmount;
                    var requestedCapital = myRequests[i].RequestedCapital;
                    var requestedExpense = myRequests[i].RequestedExpense;
                    var taskType = myRequests[i].TaskType;
                    var bwAssignedToRaciRoleAbbreviation = myRequests[i].bwAssignedToRaciRoleAbbreviation;
                    var bwAssignedToRaciRoleName = myRequests[i].bwAssignedToRaciRoleName;
                    var orgId = myRequests[i].OrgId;
                    var orgName = myRequests[i].OrgName;
                    var currentAmount = 0;
                    if (budgetAmount == 'null') {
                        currentAmount = Number(requestedCapital) + Number(requestedExpense);
                    } else {
                        currentAmount = budgetAmount;
                    }
                    var daysSinceTaskCreated = 0;
                    try {
                        var cd = myRequests[i].bwDueDate;
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
                        // TODD: THIS NEEDS TO BE REEXAMINED, we are catching this error when the new recurring tasks came into play! //thisMustBeADifferentKindOfTask = true;
                    }
                    //var budgetRequestId = brData.PendingBudgetRequests[i].bwBudgetRequestId;
                    //var brTitle = brData.PendingBudgetRequests[i].ProjectTitle;
                    //var title = brData.PendingBudgetRequests[i].Title;
                    //var budgetAmount = brData.PendingBudgetRequests[i].BudgetAmount;
                    //var requestedCapital = brData.PendingBudgetRequests[i].RequestedCapital;
                    //var requestedExpense = brData.PendingBudgetRequests[i].RequestedExpense;

                    //var arName = brData.PendingBudgetRequests[i].ProjectTitle;;

                    //var appWebUrl = 'https://budgetworkflow.com';

                    //var orgId = brData.PendingBudgetRequests[i].OrgId;
                    //var orgName = brData.PendingBudgetRequests[i].OrgName;
                    //// orgId
                    //// orgName

                    //var currentAmount = 0;
                    //if (budgetAmount == 'null') {
                    //    currentAmount = Number(requestedCapital) + Number(requestedExpense);
                    //} else {
                    //    currentAmount = budgetAmount;
                    //}

                    if (alternatingRow == 'light') {
                        html += '<tr class="alternatingRowLight" style="cursor:pointer;" ';
                        html += '>';
                        alternatingRow = 'dark';
                    } else {
                        //html += '  <tr class="alternatingRowDark" style="cursor:pointer;" onmouseover="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'showRowHoverDetails\', \'' + budgetRequests[i].Title + '\', \'' + budgetRequests[i].ProjectTitle + '\', \'' + JSON.parse(budgetRequests[i].bwRequestJson).BriefDescriptionOfProject + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\', \'' + budgetRequests[i].OrgId + '\', \'' + budgetRequests[i].OrgName + '\');"  >';
                        html += '<tr class="alternatingRowDark" style="cursor:pointer;" ';
                        html += '>';
                        alternatingRow = 'light';
                    }




                    // Extract the bwJustificationDetailsField, if it exists, from the bwRequestJson.
                    var bwJustificationDetailsField = '';
                    if (myRequests[i].bwRequestJson) {
                        var bwRequestJson = myRequests[i].bwRequestJson;
                        var json2 = JSON.parse(bwRequestJson);
                        if (json2.bwJustificationDetailsField && json2.bwJustificationDetailsField.value) {
                            bwJustificationDetailsField = json2.bwJustificationDetailsField.value;
                        }
                    }





                    // Magnifying glass.
                    html += '   <td style="padding:15px;" ';
                    //html += '       onmouseenter="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'showRowHoverDetails\', \'' + title + '\', \'' + brTitle + '\', \'' + brTitle + '\', \'' + bwWorkflowAppId + '\', \'' + budgetRequestId + '\', \'' + orgId + '\', \'' + orgName + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                    //var bwRequestJson = { // 8-26-2022
                    //    DisplayType: 'REQUEST', // 'REQUEST'
                    //    bwBudgetRequestId: myRequests[i].bwBudgetRequestId,
                    //    Title: myRequests[i].Title,
                    //    ProjectTitle: myRequests[i].ProjectTitle,
                    //    OrgId: myRequests[i].OrgId,
                    //    OrgName: myRequests[i].OrgName,
                    //    Created: myRequests[i].Created,
                    //    CreatedBy: myRequests[i].CreatedBy,
                    //    RequestedCapital: myRequests[i].RequestedCapital,
                    //    BudgetWorkflowStatus: myRequests[i].BudgetWorkflowStatus,
                    //    BriefDescriptionOfProject: myRequests[i].BriefDescriptionOfProject,
                    //    bwJustificationDetailsField: bwJustificationDetailsField
                    //}
                    html += '      onmouseenter="$(\'.bwCoreComponent:first\').bwCoreComponent(\'showRowHoverDetails\', \'' + bwEncodeURIComponent(JSON.stringify(myRequests[i])) + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';




                    html += '       onmouseleave="$(\'.bwCoreComponent:first\').bwCoreComponent(\'hideRowHoverDetails\');this.style.backgroundColor=\'white\';"';
                    html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\', \'' + '' + '\', \'' + budgetRequestId + '\');" ';
                    html += '   ><img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg"></td>';

                    // Title
                    html += '<td style="padding:15px;" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com/\', \'' + budgetRequestId + '\', \'' + title + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');">';
                    html += title;
                    html += '</td>';

                    // Days overdue.
                    html += '       <td style="padding:15px;" ';
                    //html += '       onmouseenter="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'showRowHoverDetails\', \'' + title + '\', \'' + brTitle + '\', \'' + brTitle + '\', \'' + bwWorkflowAppId + '\', \'' + budgetRequestId + '\', \'' + orgId + '\', \'' + orgName + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                    //html += '       onmouseleave="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'hideRowHoverDetails\');this.style.backgroundColor=\'white\';"';
                    html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\', \'' + '' + '\', \'' + budgetRequestId + '\');" ';
                    html += '>';
                    html += '           <div style="display:inline-block;" bwtrace="xcx778451">';
                    //if (daysSinceTaskCreated == 1) {
                    //    html += '           &nbsp;&nbsp;This task is ' + daysSinceTaskCreated.toString() + ' day old.&nbsp;&nbsp;';
                    //} else {
                    //    html += '           &nbsp;&nbsp;This task is ' + daysSinceTaskCreated.toString() + ' days old.&nbsp;&nbsp;';
                    //}
                    html += '           </div>';
                    html += '       </td>';

                    // Description
                    html += '<td style="padding:15px;" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com/\', \'' + budgetRequestId + '\', \'' + title + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');">';
                    html += brTitle;
                    html += '</td>';

                    // Capital Cost
                    html += '<td style="padding:15px;text-align:right;" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com/\', \'' + budgetRequestId + '\', \'' + title + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');">';
                    html += formatCurrency(currentAmount);
                    html += '</td>';

                    // Role
                    html += '<td style="padding:15px;" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com/\', \'' + budgetRequestId + '\', \'' + title + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');">';
                    //html += '[(' + bwAssignedToRaciRoleAbbreviation + ') ' + bwAssignedToRaciRoleName + ']';
                    html += '</td>';


                    // KEEP THIS HERE FOR when we resurrect RECURRING_EXPENSE_NOTIFICATION_TASK <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                    //var functionalAreaId = taskData[i].FinancialAreaId; // Find the functional area name.
                    //var functionalAreaName = '';
                    //try {
                    //    if (BWMData[0]) {
                    //        for (var x = 0; x < BWMData[0].length; x++) {
                    //            if (BWMData[0][x][0] = bwWorkflowAppId) { // We have the correct workflow!
                    //                for (var fai = 0; fai < BWMData[0][x][4].length; fai++) {
                    //                    if (functionalAreaId == BWMData[0][x][4][fai][0]) {
                    //                        functionalAreaName = BWMData[0][x][4][fai][1];
                    //                    }
                    //                }
                    //            }
                    //        }
                    //    }
                    //} catch (e) {
                    //}
                    //if (taskType == 'RECURRING_EXPENSE_NOTIFICATION_TASK') {
                    //    html += '       <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;" colspan="5">';
                    //    html += '           <div style="display:inline-block;">';
                    //    html += '               <a style="cursor:pointer;" onclick="displayRecurringExpenseOnTheHomePage(\'' + budgetRequestId + '\', \'' + participantId + '\', \'' + title + '\');" target="_blank" title="Click to view the recurring expense...">' + daysSinceTaskCreated.toString() + ' days overduexcx1: Recurring expense <em>(' + brTitle + ' - ' + functionalAreaName + ') is due to be submitted</em></a>';
                    //    html += '           </div>';
                    //    html += '       </td>';
                    //} else if (taskType == 'BUDGET_REQUEST_WORKFLOW_TASK') {
                    //    html += '       <td style="width:45px;"></td>';
                    //    html += '       <td style="background-color:white;" ';
                    //    html += '           onmouseenter="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'showRowHoverDetails\', \'' + title + '\', \'' + brTitle + '\', \'' + '' + '\', \'' + bwWorkflowAppId + '\', \'' + budgetRequestId + '\', \'' + orgId + '\', \'' + orgName + '\', this);" ';
                    //    html += '           onmouseleave="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'hideRowHoverDetails\');" ';
                    //    html += '>';
                    //    html += '           <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="' + imageRootPath + '/images/zoom.jpg" />';
                    //    html += '       </td>';

                    //    html += '       <td colspan="3" style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" ';
                    //    html += '           onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';bwCommonScripts.highlightExecutiveSummaryForRequest(\'' + budgetRequestId + '\');" ';
                    //    html += '           onmouseleave="this.style.backgroundColor=\'#d8d8d8\';bwCommonScripts.unHighlightExecutiveSummaryForRequest(\'' + budgetRequestId + '\');"  ';
                    //    html += '           onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\', \'' + bwAssignedToRaciRoleAbbreviation + '\', \'' + bwWorkflowTaskItemId + '\');" ';
                    //    html += '>';
                    //    html += '           <div style="display:inline-block;" bwtrace="xcx778451">';
                    //    if (daysSinceTaskCreated == 1) {
                    //        html += '           &nbsp;&nbsp;' + daysSinceTaskCreated.toString() + ' day overduexcx1: ';
                    //    } else {
                    //        html += '           &nbsp;&nbsp;' + daysSinceTaskCreated.toString() + ' days overduexcx2: ';
                    //    }
                    //    html += '               <em>';
                    //    html += title + ' - ' + brTitle + ' - ' + formatCurrency(currentAmount) + ' - ' + functionalAreaName + ' ' + '[(' + bwAssignedToRaciRoleAbbreviation + ') ' + bwAssignedToRaciRoleName + ']';
                    //    html += '               </em>';
                    //    html += '           </div>';
                    //    html += '       </td>';

                    //} else {
                    //    html += '       <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;" colspan="5">UNKNOWN TASK TYPE</td>';
                    //}

                    html += '       </tr>';
                }
            }
            html += '       </tbody></table>';


            //return html;
            $('#divBwExecutiveSummariesCarousel_MySubmittedRequests').html(html);


        } catch (e) {
            console.log('Exception in renderDetailedList_MySubmittedRequests():1335-1: ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderDetailedList_MySubmittedRequests():1335-1: ' + e.message + ', ' + e.stack);
            var result = {
                html: 'Exception in renderDetailedList_MySubmittedRequests():1335-1: ' + e.message + ', ' + e.stack
            }
            return result;
        }
    },
    renderDetailedList_OnThisDevice: function (deferredIndex, queryData) {
        try {
            console.log('In renderDetailedList_OnThisDevice().');
            localStorage.setItem('bwDisplayFormat', 'DetailedList');

            $('#buttonDisplayRequestsAsTiles_OnThisDevice').removeClass().addClass('divCarouselButton'); // Unselect the other buttons.
            $('#buttonDisplayRequestsAsDetailedList_OnThisDevice').removeClass().addClass('divCarouselButton_Selected'); // Select this one.

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            var html = '';

            var db = $('.bwCoreComponent').bwCoreComponent('getIndexDbInstance');
            if (db.objectStoreCachedRequests) {
                var transaction = db.transaction('objectStoreCachedRequests', 'readonly');
                var request = transaction.objectStore('objectStoreCachedRequests').count();

                transaction.oncomplete = function (event) {
                    var numberOfRequests = event.target.result;
                };

                transaction.onerror = function (event) {
                    //// debugger;
                };

                request.onsuccess = function (event) {
                    var html2 = '';
                    var rowId = 'functionalAreaRow_' + deferredIndex.toString() + '_5';
                    var imageId = 'alertSectionImage_' + deferredIndex.toString() + '_5';
                    var collapsibleRowId = 'alertSectionRow_' + deferredIndex.toString() + '_5';
                    html2 += '<tr id="' + rowId + '" class="bwFunctionalAreaRow" onclick="expandOrCollapseAlertsSection(\'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" >';
                    var numberOfRequests = event.target.result;
                    if (numberOfRequests > 0) {
                        // Display the requests stored on this device.
                        console.log('If this device is in PRIVACY mode, your web browser will delete them without asking you when you close the browser.xcx1');
                        if (numberOfRequests == 1) {
                            html2 += '<td style="width:11px;vertical-align:top;"></td>';
                            html2 += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2">';
                            html2 += '<img title="collapse" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="images/drawer-open.png">';
                            html2 += '<span>You have ' + numberOfRequests + ' un-submitted request saved on this device.</span>';
                        } else if (numberOfRequests > 1) {
                            html2 += '<td style="width:11px;vertical-align:top;"></td>';
                            html2 += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2">';
                            html2 += '<img title="collapse" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="images/drawer-open.png">';
                            html2 += '<span>You have ' + numberOfRequests + ' un-submitted requests saved on this device.</span>';
                        }
                        html2 += '    </td>';
                        html2 += '    <td class="bwHPNDrillDownLinkCell2"></td>';
                        html2 += '  </tr>';



                        html2 += '  <tr id="' + collapsibleRowId + '" style="display:none;">';
                        html2 += '      <td style="vertical-align:top;"></td>';
                        html2 += '      <td colspan="2" xcx="1111">';

                        html2 += '           <table>';
                        html2 += '               <tr>';

                        html2 += '                   <td style="vertical-align:top;width:60px;">';





                        html2 += '                       <table id="buttonDisplayRequestsAsDetailedList_OnThisDevice" class="divCarouselButton_Selected" style="width:70px;padding: 4px 4px 4px 4px !important;" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_OnThisDevice\');">'; //, \'OnThisDevice\', this);">'; //_OnThisDevice\');">';
                        html2 += '                           <tr>';
                        html2 += '                               <td style="white-space:nowrap;">';
                        html2 += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
                        html2 += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
                        html2 += '                                   </div>';
                        html2 += '                               </td>';
                        html2 += '                           </tr>';
                        html2 += '                           <tr>';
                        html2 += '                               <td style="white-space:nowrap;">';
                        html2 += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
                        html2 += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
                        html2 += '                                   </div>';
                        html2 += '                               </td>';
                        html2 += '                           </tr>';
                        html2 += '                           <tr>';
                        html2 += '                               <td style="white-space:nowrap;">';
                        html2 += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
                        html2 += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
                        html2 += '                                   </div>';
                        html2 += '                               </td>';
                        html2 += '                           </tr>';
                        html2 += '                       </table>';
                        html2 += '                       <div style="height:5px;"></div>'; // Button spacer. <br /> is too much.
                        html2 += '                       <table id="buttonDisplayRequestsAsTiles_OnThisDevice" class="divCarouselButton" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderExecutiveSummaries_OnThisDevice\');">'; //, \'OnThisDevice\', this);">'; // displayExecutiveSummaries_OnThisDevice\');">';
                        html2 += '                           <tr>';
                        html2 += '                               <td>';
                        html2 += '                                   <div class="divCarouselButton_SmallButton"></div>';
                        html2 += '                               </td>';
                        html2 += '                               <td>';
                        html2 += '                                   <div class="divCarouselButton_SmallButton"></div>';
                        html2 += '                               </td>';
                        html2 += '                               <td>';
                        html2 += '                                   <div class="divCarouselButton_SmallButton"></div>';
                        html2 += '                               </td>';
                        html2 += '                           </tr>';
                        html2 += '                           <tr>';
                        html2 += '                               <td>';
                        html2 += '                                   <div class="divCarouselButton_SmallButton"></div>';
                        html2 += '                               </td>';
                        html2 += '                               <td>';
                        html2 += '                                   <div class="divCarouselButton_SmallButton"></div>';
                        html2 += '                               </td>';
                        html2 += '                               <td>';
                        html2 += '                                   <div class="divCarouselButton_SmallButton"></div>';
                        html2 += '                               </td>';
                        html2 += '                           </tr>';
                        html2 += '                       </table>';

                        html2 += '                  </td>';
                        html2 += '                  <td colspan="2" xcx="222">';




                        html2 += '                      <table>';
                        html2 += '<div id="divDataGridTable" style="overflow-y: scroll;" onscroll="$(\'.bwDataGrid\').bwDataGrid(\'dataGrid_OnScroll\', this, \'' + 'bwRequestTypeIdxcx3368' + '\');">';

                        html2 += '<table id="dataGridTable" class="dataGridTable" bwworkflowappid="' + workflowAppId + '">';

                        html2 += '  <tr class="headerRow">';
                        html2 += '    <td></td>';

                        // "Title" column header.
                        html2 += '    <td style="white-space:nowrap;">';
                        html2 += '       <div style="vertical-align:middle;display:inline-block;">Request Id&nbsp;</div>';
                        html2 += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'Title\', \'descending\', this);">';
                        html2 += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
                        html2 += '       </span>';
                        html2 += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'Title\', \'ascending\', this);">';
                        html2 += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
                        html2 += '       </span>';
                        html2 += '   </td>';

                        // "Days Overdue" column header.
                        html2 += '   <td style="white-space:nowrap;">';
                        html2 += '       <div style="vertical-align:middle;display:inline-block;">Status&nbsp;</div>';
                        html2 += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'OrgName\', \'descending\', this);">';
                        html2 += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
                        html2 += '       </span>';
                        html2 += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'OrgName\', \'ascending\', this);">';
                        html2 += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
                        html2 += '       </span>';
                        html2 += '   </td>';

                        // "Description" column header.
                        html2 += '    <td style="white-space:nowrap;">';
                        html2 += '       <div style="vertical-align:middle;display:inline-block;">Description&nbsp;</div>';
                        html2 += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'ProjectTitle\', \'descending\', this);">';
                        html2 += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
                        html2 += '       </span>';
                        html2 += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'ProjectTitle\', \'ascending\', this);">';
                        html2 += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
                        html2 += '       </span>';
                        html2 += '   </td>';

                        // "Capital Cost" column header. 
                        html2 += '    <td style="white-space:nowrap;">';
                        html2 += '       <div style="vertical-align:middle;display:inline-block;">Capital Cost&nbsp;</div>';
                        html2 += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'RequestedCapital\', \'descending\', this);">';
                        html2 += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
                        html2 += '       </span>';
                        html2 += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'RequestedCapital\', \'ascending\', this);">';
                        html2 += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
                        html2 += '       </span>';
                        html2 += '   </td>';

                        // "Role" column header.
                        html2 += '    <td style="white-space:nowrap;">';
                        html2 += '       <div style="vertical-align:middle;display:inline-block;">Your role&nbsp;</div>';
                        html2 += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'ProjectTitle\', \'descending\', this);">';
                        html2 += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
                        html2 += '       </span>';
                        html2 += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'ProjectTitle\', \'ascending\', this);">';
                        html2 += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
                        html2 += '       </span>';
                        html2 += '   </td>';

                        html2 += '    <td></td>';

                        html2 += '  </tr>';

                        html2 += '  <tr class="filterRow">';

                        // Title
                        html2 += '    <td></td>';

                        // Days overdue
                        html2 += '    <td></td>';

                        // Description
                        //html2 += '    <td style="white-space:nowrap;"><span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="alert(\'Order ascending...\');">☝</span><span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="alert(\'Order descending...\');">☟</span></td>';
                        html2 += '    <td style="white-space:nowrap;">';

                        html2 += '   </td>';

                        // Requested Capital
                        html2 += '   <td style="white-space:nowrap;">';
                        html2 += '       <input type="text" id="txtArchivePageDescriptionFilter" class="archivePageFilterBox" title="Type here to limit search results, using * as a wildcard character."/>';
                        html2 += '   </td>';

                        // Role
                        html2 += '   <td style="white-space:nowrap;">';
                        html2 += '       <input type="text" id="txtArchivePageDescriptionFilter" class="archivePageFilterBox" title="Type here to limit search results, using * as a wildcard character."/>';
                        html2 += '   </td>';

                        html2 += '  </tr>';

                        //html2 += '</table>'; // remove!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                        var alternatingRow = 'light'; // Use this to color the rows.

                        var objectStore = db.transaction("objectStoreCachedRequests").objectStore("objectStoreCachedRequests");
                        objectStore.openCursor().onsuccess = function (event) {
                            try {
                                var cursor = event.target.result;
                                if (cursor) {

                                    var brTitle = cursor.value.ProjectTitle.value;
                                    var arName = cursor.value.ProjectTitle.value;
                                    var title = cursor.value.ProjectTitle.value;
                                    var orgId = cursor.value.bwOrgId;
                                    var orgName = cursor.value.bwOrgName;
                                    //var appWebUrl = 'https://budgetworkflow.com';
                                    var appWebUrl = $('.bwAuthentication').bwAuthentication('option', 'operationUriPrefix');
                                    var projectTitle = cursor.value.ProjectTitle.value;
                                    var budgetRequestId = cursor.value.bwBudgetRequestId;

                                    if (alternatingRow == 'light') {
                                        html2 += '<tr class="alternatingRowLight" style="cursor:pointer;" ';
                                        //html2 += ' onmouseenter="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'showRowHoverDetails\', \'' + budgetRequests[i].Title + '\', \'' + budgetRequests[i].ProjectTitle + '\', \'' + BriefDescriptionOfProject + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\', \'' + budgetRequests[i].OrgId + '\', \'' + budgetRequests[i].OrgName + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                                        //html2 += ' onmouseleave="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'hideRowHoverDetails\');this.style.backgroundColor=\'white\';"';
                                        //html2 += ' onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + thiz.options.operationUriPrefix + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + budgetRequests[i].ProjectTitle + '\', \'' + budgetRequests[i].Title + '\');"';
                                        html2 += '>';
                                        alternatingRow = 'dark';
                                    } else {
                                        //html2 += '  <tr class="alternatingRowDark" style="cursor:pointer;" onmouseover="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'showRowHoverDetails\', \'' + budgetRequests[i].Title + '\', \'' + budgetRequests[i].ProjectTitle + '\', \'' + JSON.parse(budgetRequests[i].bwRequestJson).BriefDescriptionOfProject + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\', \'' + budgetRequests[i].OrgId + '\', \'' + budgetRequests[i].OrgName + '\');"  >';
                                        html2 += '<tr class="alternatingRowDark" style="cursor:pointer;" ';
                                        //html2 += ' onmouseenter="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'showRowHoverDetails\', \'' + budgetRequests[i].Title + '\', \'' + budgetRequests[i].ProjectTitle + '\', \'' + BriefDescriptionOfProject + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\', \'' + budgetRequests[i].OrgId + '\', \'' + budgetRequests[i].OrgName + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                                        //html2 += ' onmouseleave="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'hideRowHoverDetails\');this.style.backgroundColor=\'whitesmoke\';"';
                                        //html2 += ' onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + thiz.options.operationUriPrefix + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + budgetRequests[i].ProjectTitle + '\', \'' + budgetRequests[i].Title + '\');"';
                                        html2 += '>';
                                        alternatingRow = 'light';
                                    }
                                    // Magnifying glass.
                                    html2 += '   <td style="padding:15px;" ';
                                    html2 += '       onmouseenter="$(\'.bwCoreComponent:first\').bwCoreComponent(\'showRowHoverDetails\', \'' + title + '\', \'' + brTitle + '\', \'' + brTitle + '\', \'' + workflowAppId + '\', \'' + budgetRequestId + '\', \'' + orgId + '\', \'' + orgName + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                                    html2 += '       onmouseleave="$(\'.bwCoreComponent:first\').bwCoreComponent(\'hideRowHoverDetails\');this.style.backgroundColor=\'white\';"';
                                    html2 += '       onclick="cmdRenderAndLoadNewRequestFormWithUnsubmittedRequest_loggedin_IndexDb(\'' + budgetRequestId + '\');" ';
                                    html2 += '   ><img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg"></td>';

                                    // Title
                                    html2 += '<td style="padding:15px;"  onclick="cmdRenderAndLoadNewRequestFormWithUnsubmittedRequest_loggedin_IndexDb(\'' + budgetRequestId + '\');" >';
                                    html2 += title;
                                    html2 += '</td>';

                                    // Days overdue.
                                    html2 += '       <td style="padding:15px;" ';
                                    //html2 += '       onmouseenter="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'showRowHoverDetails\', \'' + title + '\', \'' + brTitle + '\', \'' + brTitle + '\', \'' + bwWorkflowAppId + '\', \'' + budgetRequestId + '\', \'' + orgId + '\', \'' + orgName + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                                    //html += '       onmouseleave="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'hideRowHoverDetails\');this.style.backgroundColor=\'white\';"';
                                    //html2 += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\', \'' + '' + '\', \'' + budgetRequestId + '\');" ';
                                    html2 += '       onclick="cmdRenderAndLoadNewRequestFormWithUnsubmittedRequest_loggedin_IndexDb(\'' + budgetRequestId + '\');" ';
                                    html2 += '>';
                                    html2 += '           <div style="display:inline-block;" bwtrace="xcx778451">';
                                    //if (daysSinceTaskCreated == 1) {
                                    //    html2 += '           &nbsp;&nbsp;This task is ' + daysSinceTaskCreated.toString() + ' day old.&nbsp;&nbsp;';
                                    //} else {
                                    //    html2 += '           &nbsp;&nbsp;This task is ' + daysSinceTaskCreated.toString() + ' days old.&nbsp;&nbsp;';
                                    //}
                                    html2 += '           </div>';
                                    html2 += '       </td>';

                                    // Description
                                    html2 += '<td style="padding:15px;" onclick="cmdRenderAndLoadNewRequestFormWithUnsubmittedRequest_loggedin_IndexDb(\'' + budgetRequestId + '\');" >';
                                    html2 += brTitle;
                                    html2 += '</td>';

                                    // Capital Cost
                                    html2 += '<td style="padding:15px;text-align:right;" onclick="cmdRenderAndLoadNewRequestFormWithUnsubmittedRequest_loggedin_IndexDb(\'' + budgetRequestId + '\');">';
                                    //html2 += formatCurrency(currentAmount);
                                    html2 += '</td>';

                                    // Role
                                    html2 += '<td style="padding:15px;" onclick="cmdRenderAndLoadNewRequestFormWithUnsubmittedRequest_loggedin_IndexDb(\'' + budgetRequestId + '\');">';
                                    //html2 += '[(' + bwAssignedToRaciRoleAbbreviation + ') ' + bwAssignedToRaciRoleName + ']';
                                    html2 += '</td>';

                                    html2 += '       </tr>';

                                    // OLD commented out 4-7-2022
                                    //var projectTitle = '';
                                    //console.log('Retrieved request: ' + cursor.value.ProjectTitle.value + ': ' + cursor.value.bwBudgetRequestId);
                                    //html2 += '<tr>';
                                    //html2 += '  <td style="width:10px;"></td>';
                                    ////html2 += '  <td style="width:10px;"></td>';
                                    ////html2 += '  <td style="width:45px;"></td>';

                                    //html2 += '  <td style="background-color:white;width:25px;" ';
                                    //html2 += '      onmouseenter="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'showRowHoverDetails\', \'' + '' + '\', \'' + cursor.value.ProjectTitle.value + '\', \'' + '' + '\', \'' + workflowAppId + '\', \'' + cursor.value.bwBudgetRequestId + '\', \'' + cursor.value.bwOrgId + '\', \'' + cursor.value.bwOrgName + '\', this);" ';
                                    //html2 += '      onmouseleave="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'hideRowHoverDetails\');">';
                                    //html2 += '    <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg" />';
                                    //html2 += '  </td>';

                                    //html2 += '  <td style="padding:10px;cursor:pointer;background-color:#d8d8d8;" onclick="cmdRenderAndLoadNewRequestFormWithUnsubmittedRequest_loggedin_IndexDb(\'' + cursor.value.bwBudgetRequestId + '\');" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'#d8d8d8\';">';

                                    //html2 += '    <div style="display:inline-block;" bwtrace="xcx778452">';
                                    //html2 += '      &nbsp;&nbsp;' + cursor.value.ProjectTitle.value;
                                    //html2 += '      &nbsp;&nbsp;<img src="images/trash-can.png" onclick="cmdDisplayDeleteUnsubmittedBudgetRequestDialog(\'' + cursor.value.bwBudgetRequestId + '\', \'' + cursor.value.ProjectTitle.value + '\');" title="Delete" style="cursor:pointer;" />';
                                    //html2 += '    </div>';
                                    //html2 += '  </td>';
                                    //html2 += '</tr>';
                                    cursor.continue();
                                } else {
                                    console.log('In renderAlerts2(). Done looping, so rendering. In the future cache and compare to determine if rendering is necessary.');


                                    html2 += '          </table>';






                                    // All done, close the table tags.
                                    html2 += '      </td>';
                                    html2 += '  </tr>';

                                    html2 += '</table>';

                                    html2 += '</td>';
                                    html2 += '</tr>';

                                    //
                                    // THIS PREVENTS duplicated display of this section.
                                    //
                                    if (document.getElementById(rowId)) {
                                        // This row exists already.
                                        $('#' + rowId).replaceWith(html2)
                                    } else {
                                        $('#tblHomePageAlertSectionForWorkflowbwExecutiveSummariesCarousel2 > tbody:first-child').prepend(html2);
                                    }

                                }

                            } catch (e) {
                                console.log('xxyyyfgError: ' + e.message + ', ' + e.stack);
                                displayAlertDialog('xxyyyfgError: ' + e.message + ', ' + e.stack);
                            }
                        };

                    }
                };

                request.onerror = function (evt) {
                    console.error('In bwAuthentication.js.renderAlerts2(). add error', this.error);
                    displayAlertDialog('In bwAuthentication.js.renderAlerts2(). add error', this.error);
                };

            }

        } catch (e) {
            console.log('Exception in renderDetailedList_OnThisDevice():1335-1: ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderDetailedList_OnThisDevice():1335-1: ' + e.message + ', ' + e.stack);
            var result = {
                html: 'Exception in renderDetailedList_OnThisDevice():1335-1: ' + e.message + ', ' + e.stack
            }
            return result;
        }
    },
    renderDetailedList_MyUnsubmittedRequests: function (dataElement, sortOrder) { // Optional parameters.
        try {
            console.log('In renderDetailedList_MyUnsubmittedRequests().');

            var bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            var bwEnabledRequestTypes = $('.bwAuthentication').bwAuthentication('option', 'bwEnabledRequestTypes');
            var requestTypes = bwEnabledRequestTypes.EnabledItems; // Global, populated in the beginning when the app loads.

            localStorage.setItem('bwDisplayFormat', 'DetailedList');

            $('#buttonDisplayRequestsAsTiles_MyUnsubmittedRequests').removeClass().addClass('divCarouselButton'); // Unselect the other buttons.
            $('#buttonDisplayRequestsAsDetailedList_MyUnsubmittedRequests').removeClass().addClass('divCarouselButton_Selected'); // Select this one.

            $('#divBwExecutiveSummariesCarousel_MyUnsubmittedRequests').html('');

            var myUnsubmittedRequests = this.options.myUnsubmittedRequests;
            if (dataElement && sortOrder) {
                // If we get these parameters, then we will sort the data here.
                //displayAlertDialog('In renderDetailedList_MyUnsubmittedRequests(). Sorting!! dataElement: ' + dataElement + ', sortOrder: ' + sortOrder + ', myUnsubmittedRequests: ' + JSON.stringify(myUnsubmittedRequests));

                // myUnsubmittedRequests[i].ProjectTitle
                // myUnsubmittedRequests[i].RequestedCapital
                // myUnsubmittedRequests[i].bwRequestTypeId

                if (dataElement == 'ProjectTitle') {

                    if (sortOrder == 'ascending') {
                        myUnsubmittedRequests.sort(function (a, b) {
                            if (a.ProjectTitle.toUpperCase() < b.ProjectTitle.toUpperCase()) { return -1; }
                            if (a.ProjectTitle.toUpperCase() > b.ProjectTitle.toUpperCase()) { return 1; }
                            return 0;
                        });
                    } else if (sortOrder == 'descending') {
                        myUnsubmittedRequests.sort(function (a, b) {
                            if (a.ProjectTitle.toUpperCase() < b.ProjectTitle.toUpperCase()) { return 1; }
                            if (a.ProjectTitle.toUpperCase() > b.ProjectTitle.toUpperCase()) { return -1; }
                            return 0;
                        });
                    } else {
                        console.log('Error in renderDetailedList_MyUnsubmittedRequests().ProjectTitle. Unexpected value for sortOrder: ' + sortOrder);
                        displayAlertDialog('Error in renderDetailedList_MyUnsubmittedRequests().ProjectTitle. Unexpected value for sortOrder: ' + sortOrder);
                    }

                } else if (dataElement == 'RequestedCapital') {

                    if (sortOrder == 'ascending') {
                        myUnsubmittedRequests.sort(function (a, b) {
                            if (a.RequestedCapital < b.RequestedCapital) { return -1; }
                            if (a.RequestedCapital > b.RequestedCapital) { return 1; }
                            return 0;
                        });
                    } else if (sortOrder == 'descending') {
                        myUnsubmittedRequests.sort(function (a, b) {
                            if (a.RequestedCapital < b.RequestedCapital) { return 1; }
                            if (a.RequestedCapital > b.RequestedCapital) { return -1; }
                            return 0;
                        });
                    } else {
                        console.log('Error in renderDetailedList_MyUnsubmittedRequests().RequestedCapital. Unexpected value for sortOrder: ' + sortOrder);
                        displayAlertDialog('Error in renderDetailedList_MyUnsubmittedRequests().RequestedCapital. Unexpected value for sortOrder: ' + sortOrder);
                    }

                } else {
                    console.log('Error in renderDetailedList_MyUnsubmittedRequests(). Unexpected value for dataElement: ' + dataElement);
                    displayAlertDialog('Error in renderDetailedList_MyUnsubmittedRequests(). Unexpected value for dataElement: ' + dataElement);
                }

            }

            var serverside = false;
            var deferredIndex = this.options.deferredIndex;
            var invitationData = null;

            var html = '';

            html += '<div id="divDataGridTable" style="overflow-y: scroll;" onscroll="$(\'.bwDataGrid\').bwDataGrid(\'dataGrid_OnScroll\', this, \'' + 'bwRequestTypeId' + '\');">'; // Commented out bwRequestTypeId.. not sure why it is here... 4-22-2022

            html += '<table id="dataGridTable" class="dataGridTable" bwworkflowappid="' + workflowAppId + '">';

            html += '  <tr class="headerRow">';
            html += '    <td></td>';

            // "Description" column header.
            html += '    <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Description&nbsp;</div>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_MyUnsubmittedRequests\', \'ProjectTitle\', \'descending\', this);">';
            html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_MyUnsubmittedRequests\', \'ProjectTitle\', \'ascending\', this);">';
            html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '   </td>';

            // "Capital Cost" column header. 
            html += '    <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Capital Cost&nbsp;</div>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_MyUnsubmittedRequests\', \'RequestedCapital\', \'descending\', this);">';
            html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_MyUnsubmittedRequests\', \'RequestedCapital\', \'ascending\', this);">';
            html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '   </td>';

            // "Request type" column header.
            html += '    <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Request Type&nbsp;</div>';
            //html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_MyUnsubmittedRequests\', \'ProjectTitle\', \'descending\', this);">';
            //html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
            //html += '       </span>';
            //html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_MyUnsubmittedRequests\', \'ProjectTitle\', \'ascending\', this);">';
            //html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
            //html += '       </span>';
            html += '   </td>';

            html += '    <td></td>';

            html += '  </tr>';

            html += '  <tr class="filterRow">';

            // Description
            //html += '    <td style="white-space:nowrap;"><span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="alert(\'Order ascending...\');">☝</span><span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="alert(\'Order descending...\');">☟</span></td>';
            html += '    <td style="white-space:nowrap;">';

            html += '   </td>';

            // Requested Capital
            html += '   <td style="white-space:nowrap;">';
            //html += '       <input type="text" id="txtArchivePageDescriptionFilter" class="archivePageFilterBox" title="Type here to limit search results, using * as a wildcard character."/>';
            html += '   </td>';

            // Request type
            html += '   <td style="white-space:nowrap;">';
            //html += '       <input type="text" id="txtArchivePageDescriptionFilter" class="archivePageFilterBox" title="Type here to limit search results, using * as a wildcard character."/>';
            html += '   </td>';

            html += '  </tr>';

            var alternatingRow = 'light'; // Use this to color the rows.
            for (var i = 0; i < myUnsubmittedRequests.length; i++) {
                var budgetRequestId = myUnsubmittedRequests[i].bwBudgetRequestId;
                var brTitle = myUnsubmittedRequests[i].ProjectTitle;
                var title = myUnsubmittedRequests[i].Title;
                var budgetAmount = myUnsubmittedRequests[i].BudgetAmount;
                var requestedCapital = myUnsubmittedRequests[i].RequestedCapital;
                var requestedExpense = myUnsubmittedRequests[i].RequestedExpense;

                var arName = myUnsubmittedRequests[i].ProjectTitle;

                var appWebUrl = $('.bwAuthentication').bwAuthentication('option', 'operationUriPrefix'); //'https://budgetworkflow.com';

                var orgId = myUnsubmittedRequests[i].OrgId;
                var orgName = myUnsubmittedRequests[i].OrgName;
                // orgId
                // orgName

                //var currentAmount = 0;
                //if (budgetAmount == 'null') {
                //    currentAmount = Number(requestedCapital) + Number(requestedExpense);
                //} else {
                //    currentAmount = budgetAmount;
                //}

                if (alternatingRow == 'light') {
                    html += '<tr class="alternatingRowLight" style="cursor:pointer;" ';
                    //html += ' onmouseenter="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'showRowHoverDetails\', \'' + budgetRequests[i].Title + '\', \'' + budgetRequests[i].ProjectTitle + '\', \'' + BriefDescriptionOfProject + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\', \'' + budgetRequests[i].OrgId + '\', \'' + budgetRequests[i].OrgName + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                    //html += ' onmouseleave="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'hideRowHoverDetails\');this.style.backgroundColor=\'white\';"';
                    //html += ' onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + thiz.options.operationUriPrefix + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + budgetRequests[i].ProjectTitle + '\', \'' + budgetRequests[i].Title + '\');"';
                    html += '>';
                    alternatingRow = 'dark';
                } else {
                    //html += '  <tr class="alternatingRowDark" style="cursor:pointer;" onmouseover="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'showRowHoverDetails\', \'' + budgetRequests[i].Title + '\', \'' + budgetRequests[i].ProjectTitle + '\', \'' + JSON.parse(budgetRequests[i].bwRequestJson).BriefDescriptionOfProject + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\', \'' + budgetRequests[i].OrgId + '\', \'' + budgetRequests[i].OrgName + '\');"  >';
                    html += '<tr class="alternatingRowDark" style="cursor:pointer;" ';
                    //html += ' onmouseenter="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'showRowHoverDetails\', \'' + budgetRequests[i].Title + '\', \'' + budgetRequests[i].ProjectTitle + '\', \'' + BriefDescriptionOfProject + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\', \'' + budgetRequests[i].OrgId + '\', \'' + budgetRequests[i].OrgName + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                    //html += ' onmouseleave="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'hideRowHoverDetails\');this.style.backgroundColor=\'whitesmoke\';"';
                    //html += ' onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + thiz.options.operationUriPrefix + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + budgetRequests[i].ProjectTitle + '\', \'' + budgetRequests[i].Title + '\');"';
                    html += '>';
                    alternatingRow = 'light';
                }


                // displayArInDialog: function (appWebUrl, budgetRequestId, arName, brTitle, title, bwAssignedToRaciRoleAbbreviation, bwWorkflowTaskItemId) { 



                // Extract the bwJustificationDetailsField, if it exists, from the bwRequestJson.
                var bwJustificationDetailsField = '';
                if (myUnsubmittedRequests[i].bwRequestJson) {
                    var bwRequestJson = myUnsubmittedRequests[i].bwRequestJson;
                    var json2 = JSON.parse(bwRequestJson);
                    if (json2.bwJustificationDetailsField && json2.bwJustificationDetailsField.value) {
                        bwJustificationDetailsField = json2.bwJustificationDetailsField.value;
                    }
                }





                // Magnifying glass.
                html += '   <td style="padding:15px;" ';
                //html += '       onmouseenter="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'showRowHoverDetails\', \'' + title + '\', \'' + brTitle + '\', \'' + brTitle + '\', \'' + bwWorkflowAppId + '\', \'' + budgetRequestId + '\', \'' + orgId + '\', \'' + orgName + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';


                var bwRequestTypeId = myUnsubmittedRequests[i].bwRequestTypeId; //JSON.parse(requestJson.bwRequestJson).bwRequestTypeId;
                //alert('xcx12423423 bwRequestTypeId: ' + bwRequestTypeId + ',' + myUnsubmittedRequests[i].bwRequestJson)
                var requestType;
                for (var j = 0; j < requestTypes.length; j++) {
                    if (bwRequestTypeId == requestTypes[j].bwRequestTypeId) {
                        requestType = requestTypes[j].SingletonName;
                    }
                }

                //var bwRequestJson = { // 8-26-2022
                //    DisplayType: 'REQUEST', // 'REQUEST'
                //    bwBudgetRequestId: myUnsubmittedRequests[i].bwBudgetRequestId,
                //    Title: 'New ' + requestType, //myUnsubmittedRequests[i].Title,
                //    ProjectTitle: myUnsubmittedRequests[i].ProjectTitle,
                //    OrgId: myUnsubmittedRequests[i].OrgId,
                //    OrgName: myUnsubmittedRequests[i].OrgName,
                //    Created: myUnsubmittedRequests[i].Created,
                //    CreatedBy: myUnsubmittedRequests[i].CreatedBy,
                //    RequestedCapital: myUnsubmittedRequests[i].RequestedCapital,
                //    BudgetWorkflowStatus: myUnsubmittedRequests[i].BudgetWorkflowStatus,
                //    BriefDescriptionOfProject: myUnsubmittedRequests[i].BriefDescriptionOfProject,
                //    bwJustificationDetailsField: bwJustificationDetailsField
                //}
                html += '      onmouseenter="$(\'.bwCoreComponent:first\').bwCoreComponent(\'showRowHoverDetails\', \'' + bwEncodeURIComponent(JSON.stringify(myUnsubmittedRequests[i])) + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';








                html += '       onmouseleave="$(\'.bwCoreComponent:first\').bwCoreComponent(\'hideRowHoverDetails\');this.style.backgroundColor=\'white\';"';
                html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\', \'' + '' + '\', \'\');" ';
                html += '   ><img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg"></td>';

                // Description
                html += '<td style="padding:15px;" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com/\', \'' + budgetRequestId + '\', \'' + title + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\', \'' + '' + '\', \'\');">';
                if (brTitle) {
                    html += brTitle;
                } else {
                    html += '<span style="color:lightgray;">[no title]</span>';
                }
                html += '</td>';

                // Capital Cost
                html += '<td style="padding:15px;text-align:right;" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com/\', \'' + budgetRequestId + '\', \'' + title + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\', \'' + '' + '\', \'\');">';
                //html += formatCurrency(currentAmount);
                var RequestedCapital_cleaned = $('.bwAuthentication').bwAuthentication('getBudgetWorkflowStandardizedCurrency', myUnsubmittedRequests[i].RequestedCapital); // myUnsubmittedRequests[i].RequestedCapital;
                if (RequestedCapital_cleaned.toString().indexOf('no value available') > -1) {
                    html += '<span style="color:lightgray;">' + RequestedCapital_cleaned + '</span>';
                } else {
                    html += RequestedCapital_cleaned;
                }
                html += '</td>';

                // Request type
                html += '<td style="padding:15px;" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com/\', \'' + budgetRequestId + '\', \'' + title + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');">';
                //html += '[(' + bwAssignedToRaciRoleAbbreviation + ') ' + bwAssignedToRaciRoleName + ']';
                html += '<span style="color:lightgray;">[no request type selected]</span>';
                html += '</td>';



                html += '       </tr>';

            }
            html += '       </tbody></table>';


            //return html;
            $('#divBwExecutiveSummariesCarousel_MyUnsubmittedRequests').html(html);


        } catch (e) {
            console.log('Exception in renderDetailedList_MyUnsubmittedRequests():1335-1: ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderDetailedList_MyUnsubmittedRequests():1335-1: ' + e.message + ', ' + e.stack);
            var result = {
                html: 'Exception in renderDetailedList_MyUnsubmittedRequests():1335-1: ' + e.message + ', ' + e.stack
            }
            return result;
        }
    },

    renderExecutiveSummaries_PINNED_REQUESTS: function (spinnerText) {
        try {
            console.log('In bwExecutiveSummariesCarousel2.js.renderExecutiveSummaries_PINNED_REQUESTS().');
            //alert('In bwExecutiveSummariesCarousel2.js.renderExecutiveSummaries_PINNED_REQUESTS().');
            var thiz = this;

            localStorage.setItem('bwDisplayFormat', 'ExecutiveSummaries');

            $('#buttonDisplayRequestsAsDetailedList_PinnedRequests').removeClass().addClass('divCarouselButton'); // Unselect the other buttons.
            $('#buttonDisplayRequestsAsTiles_PinnedRequests').removeClass().addClass('divCarouselButton_Selected'); // Select this one. 

            var accordionDrawerElement;
            var accordionDrawerElements = $('.bwAccordionDrawer');
            for (var i = 0; i < accordionDrawerElements.length; i++) {
                if ($(accordionDrawerElements[i]).attr('bwaccordiondrawertype') == 'PINNED_REQUESTS') {
                    accordionDrawerElement = accordionDrawerElements[i];
                    break;
                }
            }

            var pinnedRequests = $('.bwAuthentication:first').bwAuthentication('option', 'PINNED_REQUESTS');

            if (!pinnedRequests) {

                var msg = 'Error in bwExecutiveSummariesCarousel2.js.renderExecutiveSummaries_PINNED_REQUESTS(). No data loaded for pinnedRequests.';

                console.log(msg);
                alert(msg);

            } else {

                $(accordionDrawerElement).html('');

                var elementId = $(accordionDrawerElement).attr('id'); // divBwExecutiveSummariesCarousel_PinnedRequests
                if (!document.getElementById(elementId)) {
                    displayAlertDialog('Error in bwExecutiveSummariesCarousel2.js.renderExecutiveSummaries_PINNED_REQUESTS(). xcx21313333 could not find elementId: ' + elementId);
                } else {
                    document.getElementById(elementId).style.display = 'inline';
                }

                //
                // HERE IS WHERE WE SORT THE PINNED_REQUESTS. // thiz.options.userSelectedFilterFor_PINNED_REQUESTS // NEWEST, OLDEST.
                //
                console.log('HERE IS WHERE WE SORT THE PINNED_REQUESTS by Created date. xcx123123.'); // pinnedRequests[0].Created: ' + JSON.stringify(pinnedRequests[0].Created + ', userSelectedFilterFor_PINNED_REQUESTS: ' + thiz.options.userSelectedFilterFor_PINNED_REQUESTS));

                if (thiz.options.userSelectedFilterFor_PINNED_REQUESTS == 'NEWEST') { // Created ascending.
                    pinnedRequests.sort(function (a, b) {
                        if (a.Created < b.Created) { return 1; }
                        if (a.Created > b.Created) { return -1; }
                        return 0;
                    });
                } else if (thiz.options.userSelectedFilterFor_PINNED_REQUESTS == 'OLDEST') { // Created descending.
                    pinnedRequests.sort(function (a, b) {
                        if (a.Created < b.Created) { return -1; }
                        if (a.Created > b.Created) { return 1; }
                        return 0;
                    });
                } else {
                    console.log('Unexpected value for userSelectedFilterFor_PINNED_REQUESTS: ' + thiz.options.userSelectedFilterFor_PINNED_REQUESTS);
                    displayAlertDialog('Unexpected value for userSelectedFilterFor_PINNED_REQUESTS: ' + thiz.options.userSelectedFilterFor_PINNED_REQUESTS);
                }







                //
                //
                // 2-17-2024 Adding new paging status, sort bar, and paging UI.
                //
                //

                var quantityOfPinnedRequests = 0;
                var pinnedRequestsArray = $('.bwAuthentication:first').bwAuthentication('option', 'UserData_PinnedRequestsArray');
                if (pinnedRequestsArray && pinnedRequestsArray.length) {
                    quantityOfPinnedRequests = pinnedRequestsArray.length;
                }

                var html = '';

                html += '<div xcx="123123577" id="divBwDataGrid_DocumentCount">Displaying 1 to ' + pinnedRequests.length + ' of ' + quantityOfPinnedRequests + ' requests.&nbsp;&nbsp;&nbsp;&nbsp;'; // |<&nbsp;&nbsp;<&nbsp;&nbsp;>&nbsp;&nbsp;>|</div>';

                html += `<div style="display:inline-block;border:1px solid black;width:30px;height:20px;text-align:center;font-weight:bold;cursor:pointer;" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'navigateRequests\', \'move_to_start\', this);">|<</div>`;
                html += '&nbsp;&nbsp;';
                html += `<div style="display:inline-block;border:1px solid black;width:30px;height:20px;text-align:center;font-weight:bold;cursor:pointer;" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'navigateRequests\', \'move_to_left\', this);"><</div>`;
                html += '&nbsp;&nbsp;';
                html += `<div style="display:inline-block;border:1px solid black;width:30px;height:20px;text-align:center;font-weight:bold;cursor:pointer;" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'navigateRequests\', \'move_to_right\', this);">></div>`;
                html += '&nbsp;&nbsp;';
                html += `<div style="display:inline-block;border:1px solid black;width:30px;height:20px;text-align:center;font-weight:bold;cursor:pointer;" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'navigateRequests\', \'move_to_end\', this);">>|</div>`;

                html += '</div>';


                //html += '<div id="divBwDataGrid_FilterBar">[divBwDataGrid_FilterBar]</div>';

                html += '<div id="divBwDataGrid_FilterBar">';
                html += '<table id="dataGridTable2" class="dataGridTable" bwworkflowappid="' + workflowAppId + '" >';

                html += '  <tr class="headerRow">';
                html += '    <td></td>';

                // "Title" column header.
                html += '    <td style="white-space:nowrap;">';
                html += '       <div style="vertical-align:middle;display:inline-block;">Title&nbsp;</div>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'Title\', \'descending\', this);">';
                html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'Title\', \'ascending\', this);">';
                html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '   </td>';

                // "Description" column header.
                html += '    <td style="white-space:nowrap;">';
                html += '       <div style="vertical-align:middle;display:inline-block;">Description&nbsp;</div>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'ProjectTitle\', \'descending\', this);">';
                html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'ProjectTitle\', \'ascending\', this);">';
                html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '   </td>';

                // "Current Owner(s)" column header. 
                html += '    <td style="white-space:nowrap;">';
                html += '       <div style="vertical-align:middle;display:inline-block;">Current Owner(s)&nbsp;</div>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'CurrentOwner\', \'descending\', this);">';
                html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'CurrentOwner\', \'ascending\', this);">';
                html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '   </td>';

                // "Created Date" column header.
                html += '    <td style="white-space:nowrap;">';
                html += '       <div style="vertical-align:middle;display:inline-block;">Created Date&nbsp;</div>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'Created\', \'descending\', this);">';
                html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'Created\', \'ascending\', this);">';
                html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '   </td>';

                // "Location" column header.
                html += '   <td style="white-space:nowrap;">';
                html += '       <div style="vertical-align:middle;display:inline-block;">Location&nbsp;</div>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'OrgName\', \'ascending\', this);">';
                html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'OrgName\', \'ascending\', this);">';
                html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '   </td>';

                // "Capital Cost" column header. 
                html += '    <td style="white-space:nowrap;">';
                html += '       <div style="vertical-align:middle;display:inline-block;">Capital Cost&nbsp;</div>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'RequestedCapital\', \'descending\', this);">';
                html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'RequestedCapital\', \'ascending\', this);">';
                html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '   </td>';

                // "Modified Date" column header. 
                html += '    <td style="white-space:nowrap;">';
                html += '       <div style="vertical-align:middle;display:inline-block;">Modified Date&nbsp;</div>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'Modified\', \'descending\', this);">';
                html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'Modified\', \'ascending\', this);">';
                html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '   </td>';

                html += '    <td></td>';
                html += '  </tr>';

                html += '</table>';

                html += '</div>';

                $(accordionDrawerElement).append(html);



















                var carouselItemIndex = 0;
                for (var i = 0; i < pinnedRequests.length; i++) {
                    if (carouselItemIndex < 100) { // This is where we set how many tasks we will display in the carousel. Zero-based, so < 5 means display 5 tasks.

                        var ProjectTitle_clean = String(pinnedRequests[i].ProjectTitle).replace(/["]/g, '&quot;').replace(/[']/g, '\\&#39;'); //&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method.
                        var title = 'Executive Summary for: xcx34234234234 ' + pinnedRequests[i].Title + '. ' + ProjectTitle_clean;

                        var executiveSummaryElement = document.createElement('div');
                        executiveSummaryElement.classList.add('executiveSummaryInCarousel');
                        executiveSummaryElement.setAttribute('bwbudgetrequestid', pinnedRequests[i].bwBudgetRequestId);
                        executiveSummaryElement.title = title;
                        executiveSummaryElement.alt = title;
                        executiveSummaryElement.style.minWidth = '300px';
                        executiveSummaryElement.style.maxWidth = '550px';
                        executiveSummaryElement.style.display = 'inline-block';
                        executiveSummaryElement.style.whiteSpace = 'nowrap';
                        executiveSummaryElement.style.color = 'rgb(38, 38, 38)';
                        executiveSummaryElement.style.fontFamily = '"Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif';
                        executiveSummaryElement.style.fontSize = '1.25em';

                        executiveSummaryElement.setAttribute('onclick', '$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'' + pinnedRequests[i].bwBudgetRequestId + '\', \'' + pinnedRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + pinnedRequests[i].Title + '\', \'' + pinnedRequests[i].bwAssignedToRaciRoleAbbreviation + '\', \'' + '7777xcx7777777_324_2_1' + '\');');

                        $(accordionDrawerElement).append(executiveSummaryElement);

                        console.log('Calling renderExecutiveSummaryForRequest(). xcx332-6-1');
                        //alert('Calling renderExecutiveSummaryForRequest(). xcx332-6-1');
                        var promise = this.renderExecutiveSummaryForRequest(pinnedRequests[i], executiveSummaryElement);
                        promise.then(function (result) {
                            // Do nothing.
                        }).catch(function (e) {
                            var msg = 'Exception xcx33995-2-2-11: ' + JSON.stringify(e);
                            console.log(msg);
                            displayAlertDialog(msg);
                        });

                        carouselItemIndex += 1;

                    } else {
                        break;
                    }
                }

                //
                //
                // 2-19-2024. IS THIS THE BEST PLACE TO BACKFILL THE EXECUTIVE SUMMARRIES? xcx1231421-2
                //
                //

                console.log('2-19-2024. IS THIS THE BEST PLACE TO BACKFILL THE EXECUTIVE SUMMARRIES? xcx1231421-2');







                //
                // This is our ellipsis context menu. MIT license and code at: https://swisnl.github.io/jQuery-contextMenu/demo/trigger-custom.html
                //


                $.contextMenu({
                    selector: '.context_menu_bwExecutiveSummariesCarousel2_PINNED_REQUESTS',
                    callback: function (key, options) {
                        if (key == 'NEWEST') {

                            console.log('In bwExecutiveSummariesCarousel2(). Setting userSelectedFilterFor_PINNED_REQUESTS to NEWEST.');
                            $('.context_menu_bwExecutiveSummariesCarousel2_PINNED_REQUESTS').html('Sort by: Newest ↑');
                            thiz.options.userSelectedFilterFor_PINNED_REQUESTS = 'NEWEST';
                            thiz.renderExecutiveSummaries_PINNED_REQUESTS();

                        } else if (key == 'OLDEST') {

                            console.log('In bwExecutiveSummariesCarousel2(). Setting userSelectedFilterFor_PINNED_REQUESTS to OLDEST.');
                            $('.context_menu_bwExecutiveSummariesCarousel2_PINNED_REQUESTS').html('Sort by: Oldest ↑');
                            thiz.options.userSelectedFilterFor_PINNED_REQUESTS = 'OLDEST';
                            thiz.renderExecutiveSummaries_PINNED_REQUESTS();

                        } else {
                            console.log('Unexpected response. xcx2131241533. key: ' + key);
                            displayAlertDialog('Unexpected response. xcx2131241533. key: ' + key);
                        }
                    },
                    items: {
                        "NEWEST": { name: "Sort by: Newest ↑", icon: "fa-trash" },
                        "OLDEST": { name: "Sort by: Oldest ↑", icon: "fa-trash" }
                    }
                });
                $('.context_menu_bwExecutiveSummariesCarousel2_PINNED_REQUESTS').on('click', function (e) {
                    e.preventDefault();
                    var x = e.clientX;
                    var y = e.clientY;
                    $('.context_menu_bwExecutiveSummariesCarousel2_PINNED_REQUESTS').contextMenu(); //{ x: x, y: y }); // specifying x and y here doesn't work for left click. We need to get the left click position workng at some point but no biggie at this time.
                });
                //
                // End: This is our ellipsis context menu.
                //


                if (thiz.options.userSelectedFilterFor_PINNED_REQUESTS == 'NEWEST') {
                    $('.context_menu_bwExecutiveSummariesCarousel2_PINNED_REQUESTS').html('Sort by: Newest ↑');
                } else if (thiz.options.userSelectedFilterFor_PINNED_REQUESTS == 'OLDEST') {
                    $('.context_menu_bwExecutiveSummariesCarousel2_PINNED_REQUESTS').html('Sort by: Oldest ↑');
                } else {
                    console.log('Unexpected value for userSelectedFilterFor_PINNED_REQUESTS: ' + thiz.options.userSelectedFilterFor_PINNED_REQUESTS + '. xcx231243.');
                    displayAlertDialog('Unexpected value for userSelectedFilterFor_PINNED_REQUESTS: ' + thiz.options.userSelectedFilterFor_PINNED_REQUESTS + '. xcx231243.');
                }



            }

        } catch (e) {
            console.log('Exception in bwExecutiveSummariesCarousel2.renderExecutiveSummaries_PINNED_REQUESTS(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwExecutiveSummariesCarousel2.renderExecutiveSummaries_PINNED_REQUESTS(): ' + e.message + ', ' + e.stack);
        }
    },

    renderExecutiveSummaries_MY_UNSUBMITTED_REQUESTS: function (spinnerText) {
        try {
            console.log('In bwExecutiveSummariesCarousel2.js.renderExecutiveSummaries_MY_UNSUBMITTED_REQUESTS().');
            //alert('In bwExecutiveSummariesCarousel2.js.renderExecutiveSummaries_MY_UNSUBMITTED_REQUESTS().');
            var thiz = this;

            localStorage.setItem('bwDisplayFormat', 'ExecutiveSummaries');

            $('#buttonDisplayRequestsAsDetailedList_MyUnsubmittedRequests').removeClass().addClass('divCarouselButton'); // Unselect the other buttons.
            $('#buttonDisplayRequestsAsTiles_MyUnsubmittedRequests').removeClass().addClass('divCarouselButton_Selected'); // Select this one. 

            var accordionDrawerElement;
            var accordionDrawerElements = $('.bwAccordionDrawer');
            for (var i = 0; i < accordionDrawerElements.length; i++) {
                if ($(accordionDrawerElements[i]).attr('bwaccordiondrawertype') == 'MY_UNSUBMITTED_REQUESTS') {
                    accordionDrawerElement = accordionDrawerElements[i];
                    break;
                }
            }

            var requests = $('.bwAuthentication:first').bwAuthentication('option', 'MY_UNSUBMITTED_REQUESTS');

            if (!requests) {

                var msg = 'Error in bwExecutiveSummariesCarousel2.js.renderExecutiveSummaries_MY_UNSUBMITTED_REQUESTS(). No data loaded for requests.';

                console.log(msg);
                alert(msg);

            } else {

                $(accordionDrawerElement).html('');

                var elementId = $(accordionDrawerElement).attr('id'); // divBwExecutiveSummariesCarousel_PinnedRequests
                document.getElementById(elementId).style.display = 'inline';

                //
                // HERE IS WHERE WE SORT THE PINNED_REQUESTS. // thiz.options.userSelectedFilterFor_MY_UNSUBMITTED_REQUESTS // NEWEST, OLDEST.
                //
                console.log('HERE IS WHERE WE SORT THE MY_UNSUBMITTED_REQUESTS by Created date. requests[0].Created: ' + JSON.stringify(requests[0].Created + ', userSelectedFilterFor_MY_UNSUBMITTED_REQUESTS: ' + thiz.options.userSelectedFilterFor_MY_UNSUBMITTED_REQUESTS));

                if (thiz.options.userSelectedFilterFor_MY_UNSUBMITTED_REQUESTS == 'NEWEST') { // Created ascending.
                    requests.sort(function (a, b) {
                        if (a.Created < b.Created) { return 1; }
                        if (a.Created > b.Created) { return -1; }
                        return 0;
                    });
                } else if (thiz.options.userSelectedFilterFor_MY_UNSUBMITTED_REQUESTS == 'OLDEST') { // Created descending.
                    requests.sort(function (a, b) {
                        if (a.Created < b.Created) { return -1; }
                        if (a.Created > b.Created) { return 1; }
                        return 0;
                    });
                } else {
                    console.log('Unexpected value for userSelectedFilterFor_MY_UNSUBMITTED_REQUESTS: ' + thiz.options.userSelectedFilterFor_MY_UNSUBMITTED_REQUESTS);
                    displayAlertDialog('Unexpected value for userSelectedFilterFor_MY_UNSUBMITTED_REQUESTS: ' + thiz.options.userSelectedFilterFor_MY_UNSUBMITTED_REQUESTS);
                }








                //
                //
                // 2-17-2024 Adding new paging status, sort bar, and paging UI.
                //
                //
                var html = '';

                html += '<div id="divBwDataGrid_DocumentCount">Displaying 1 to x25 of ' + this.options.documentCounts.MY_UNSUBMITTED_REQUESTS + ' requests.&nbsp;&nbsp;&nbsp;&nbsp;'; // |<&nbsp;&nbsp;<&nbsp;&nbsp;>&nbsp;&nbsp;>|</div>';

                html += `<div style="display:inline-block;border:1px solid black;width:30px;height:20px;text-align:center;font-weight:bold;cursor:pointer;" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'navigateRequests\', \'move_to_start\', this);">|<</div>`;
                html += '&nbsp;&nbsp;';
                html += `<div style="display:inline-block;border:1px solid black;width:30px;height:20px;text-align:center;font-weight:bold;cursor:pointer;" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'navigateRequests\', \'move_to_left\', this);"><</div>`;
                html += '&nbsp;&nbsp;';
                html += `<div style="display:inline-block;border:1px solid black;width:30px;height:20px;text-align:center;font-weight:bold;cursor:pointer;" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'navigateRequests\', \'move_to_right\', this);">></div>`;
                html += '&nbsp;&nbsp;';
                html += `<div style="display:inline-block;border:1px solid black;width:30px;height:20px;text-align:center;font-weight:bold;cursor:pointer;" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'navigateRequests\', \'move_to_end\', this);">>|</div>`;

                html += '</div>';


                //html += '<div id="divBwDataGrid_FilterBar">[divBwDataGrid_FilterBar]</div>';

                html += '<div id="divBwDataGrid_FilterBar">';
                html += '<table id="dataGridTable2" class="dataGridTable" bwworkflowappid="' + workflowAppId + '" >';

                html += '  <tr class="headerRow">';
                html += '    <td></td>';

                // "Title" column header.
                html += '    <td style="white-space:nowrap;">';
                html += '       <div style="vertical-align:middle;display:inline-block;">Title&nbsp;</div>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'Title\', \'descending\', this);">';
                html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'Title\', \'ascending\', this);">';
                html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '   </td>';

                // "Description" column header.
                html += '    <td style="white-space:nowrap;">';
                html += '       <div style="vertical-align:middle;display:inline-block;">Description&nbsp;</div>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'ProjectTitle\', \'descending\', this);">';
                html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'ProjectTitle\', \'ascending\', this);">';
                html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '   </td>';

                // "Current Owner(s)" column header. 
                html += '    <td style="white-space:nowrap;">';
                html += '       <div style="vertical-align:middle;display:inline-block;">Current Owner(s)&nbsp;</div>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'CurrentOwner\', \'descending\', this);">';
                html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'CurrentOwner\', \'ascending\', this);">';
                html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '   </td>';

                // "Created Date" column header.
                html += '    <td style="white-space:nowrap;">';
                html += '       <div style="vertical-align:middle;display:inline-block;">Created Date&nbsp;</div>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'Created\', \'descending\', this);">';
                html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'Created\', \'ascending\', this);">';
                html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '   </td>';

                // "Location" column header.
                html += '   <td style="white-space:nowrap;">';
                html += '       <div style="vertical-align:middle;display:inline-block;">Location&nbsp;</div>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'OrgName\', \'ascending\', this);">';
                html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'OrgName\', \'ascending\', this);">';
                html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '   </td>';

                // "Capital Cost" column header. 
                html += '    <td style="white-space:nowrap;">';
                html += '       <div style="vertical-align:middle;display:inline-block;">Capital Cost&nbsp;</div>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'RequestedCapital\', \'descending\', this);">';
                html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'RequestedCapital\', \'ascending\', this);">';
                html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '   </td>';

                // "Modified Date" column header. 
                html += '    <td style="white-space:nowrap;">';
                html += '       <div style="vertical-align:middle;display:inline-block;">Modified Date&nbsp;</div>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'Modified\', \'descending\', this);">';
                html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'Modified\', \'ascending\', this);">';
                html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '   </td>';

                html += '    <td></td>';
                html += '  </tr>';

                html += '</table>';

                html += '</div>';

                $(accordionDrawerElement).append(html);













                var carouselItemIndex = 0;
                for (var i = 0; i < requests.length; i++) {
                    if (carouselItemIndex < 100) { // This is where we set how many tasks we will display in the carousel. Zero-based, so < 5 means display 5 tasks.

                        var ProjectTitle_clean = String(requests[i].ProjectTitle).replace(/["]/g, '&quot;').replace(/[']/g, '\\&#39;'); //&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method.
                        var title = 'Executive Summary for: ' + requests[i].Title + '. ' + ProjectTitle_clean;

                        var executiveSummaryElement = document.createElement('div');
                        executiveSummaryElement.classList.add('executiveSummaryInCarousel');
                        executiveSummaryElement.setAttribute('bwbudgetrequestid', requests[i].bwBudgetRequestId);
                        executiveSummaryElement.title = title;
                        executiveSummaryElement.alt = title;
                        executiveSummaryElement.style.minWidth = '300px';
                        executiveSummaryElement.style.maxWidth = '550px';
                        executiveSummaryElement.style.display = 'inline-block';
                        executiveSummaryElement.style.whiteSpace = 'nowrap';
                        executiveSummaryElement.style.color = 'rgb(38, 38, 38)';
                        executiveSummaryElement.style.fontFamily = '"Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif';
                        executiveSummaryElement.style.fontSize = '1.25em';

                        executiveSummaryElement.setAttribute('onclick', '$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'' + requests[i].bwBudgetRequestId + '\', \'' + requests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + requests[i].Title + '\', \'' + requests[i].bwAssignedToRaciRoleAbbreviation + '\', \'' + '7777xcx7777777_324_2_2_xcxs312' + '\');');

                        $(accordionDrawerElement).append(executiveSummaryElement);

                        console.log('Calling renderExecutiveSummaryForRequest(). xcx332-6-2');
                        displayAlertDialog('Calling renderExecutiveSummaryForRequest(). xcx332-6-2');
                        var promise = this.renderExecutiveSummaryForRequest(requests[i], executiveSummaryElement);
                        promise.then(function (result) {
                            // Do nothing.
                        }).catch(function (e) {
                            var msg = 'Exception xcx33995-2-2-12: ' + JSON.stringify(e);
                            console.log(msg);
                            displayAlertDialog(msg);
                        });

                        carouselItemIndex += 1;

                    } else {
                        break;
                    }
                }

                //
                //
                // 2-19-2024. IS THIS THE BEST PLACE TO BACKFILL THE EXECUTIVE SUMMARRIES? xcx1231421-3
                //
                //

                console.log('2-19-2024. IS THIS THE BEST PLACE TO BACKFILL THE EXECUTIVE SUMMARRIES? xcx1231421-3');






                //
                // This is our ellipsis context menu. MIT license and code at: https://swisnl.github.io/jQuery-contextMenu/demo/trigger-custom.html
                //


                $.contextMenu({
                    selector: '.context_menu_bwExecutiveSummariesCarousel2_MY_UNSUBMITTED_REQUESTS', // '.context_menu_bwExecutiveSummariesCarousel2_PINNED_REQUESTS',
                    callback: function (key, options) {
                        if (key == 'NEWEST') {

                            console.log('In bwExecutiveSummariesCarousel2(). Setting userSelectedFilterFor_MY_UNSUBMITTED_REQUESTS to NEWEST.');
                            $('.context_menu_bwExecutiveSummariesCarousel2_MY_UNSUBMITTED_REQUESTS').html('Sort by: Newest ↑');
                            thiz.options.userSelectedFilterFor_MY_UNSUBMITTED_REQUESTS = 'NEWEST';
                            thiz.renderExecutiveSummaries_MY_UNSUBMITTED_REQUESTS();

                        } else if (key == 'OLDEST') {

                            console.log('In bwExecutiveSummariesCarousel2(). Setting userSelectedFilterFor_MY_UNSUBMITTED_REQUESTS to OLDEST.');
                            $('.context_menu_bwExecutiveSummariesCarousel2_MY_UNSUBMITTED_REQUESTS').html('Sort by: Oldest ↑');
                            thiz.options.userSelectedFilterFor_MY_UNSUBMITTED_REQUESTS = 'OLDEST';
                            thiz.renderExecutiveSummaries_MY_UNSUBMITTED_REQUESTS();

                        } else {
                            console.log('Unexpected response. xcx2131241533. key: ' + key);
                            displayAlertDialog('Unexpected response. xcx2131241533. key: ' + key);
                        }
                    },
                    items: {
                        "NEWEST": { name: "Sort by: Newest ↑", icon: "fa-trash" },
                        "OLDEST": { name: "Sort by: Oldest ↑", icon: "fa-trash" }
                    }
                });
                $('.context_menu_bwExecutiveSummariesCarousel2_MY_UNSUBMITTED_REQUESTS').on('click', function (e) {
                    e.preventDefault();
                    var x = e.clientX;
                    var y = e.clientY;
                    $('.context_menu_bwExecutiveSummariesCarousel2_MY_UNSUBMITTED_REQUESTS').contextMenu(); //{ x: x, y: y }); // specifying x and y here doesn't work for left click. We need to get the left click position workng at some point but no biggie at this time.
                });
                //
                // End: This is our ellipsis context menu.
                //


                if (thiz.options.userSelectedFilterFor_MY_UNSUBMITTED_REQUESTS == 'NEWEST') {
                    $('.context_menu_bwExecutiveSummariesCarousel2_MY_UNSUBMITTED_REQUESTS').html('Sort by: Newest ↑');
                } else if (thiz.options.userSelectedFilterFor_MY_UNSUBMITTED_REQUESTS == 'OLDEST') {
                    $('.context_menu_bwExecutiveSummariesCarousel2_MY_UNSUBMITTED_REQUESTS').html('Sort by: Oldest ↑');
                } else {
                    console.log('Unexpected value for userSelectedFilterFor_MY_UNSUBMITTED_REQUESTS: ' + thiz.options.userSelectedFilterFor_MY_UNSUBMITTED_REQUESTS + '. xcx231243.');
                    displayAlertDialog('Unexpected value for userSelectedFilterFor_MY_UNSUBMITTED_REQUESTS: ' + thiz.options.userSelectedFilterFor_MY_UNSUBMITTED_REQUESTS + '. xcx231243.');
                }



            }

        } catch (e) {
            console.log('Exception in bwExecutiveSummariesCarousel2.renderExecutiveSummaries_MY_UNSUBMITTED_REQUESTS(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwExecutiveSummariesCarousel2.renderExecutiveSummaries_MY_UNSUBMITTED_REQUESTS(): ' + e.message + ', ' + e.stack);
        }
    },

    renderExecutiveSummaries_MY_SUBMITTED_REQUESTS: function (spinnerText) {
        try {
            console.log('In bwExecutiveSummariesCarousel2.js.renderExecutiveSummaries_MY_SUBMITTED_REQUESTS().');
            //alert('In bwExecutiveSummariesCarousel2.js.renderExecutiveSummaries_MY_SUBMITTED_REQUESTS().');
            var thiz = this;

            localStorage.setItem('bwDisplayFormat', 'ExecutiveSummaries');

            $('#buttonDisplayRequestsAsDetailedList_MySubmittedRequests').removeClass().addClass('divCarouselButton'); // Unselect the other buttons.
            $('#buttonDisplayRequestsAsTiles_MySubmittedRequests').removeClass().addClass('divCarouselButton_Selected'); // Select this one. 

            var accordionDrawerElement;
            var accordionDrawerElements = $('.bwAccordionDrawer');
            for (var i = 0; i < accordionDrawerElements.length; i++) {
                if ($(accordionDrawerElements[i]).attr('bwaccordiondrawertype') == 'MY_SUBMITTED_REQUESTS') {
                    accordionDrawerElement = accordionDrawerElements[i];
                    break;
                }
            }

            var requests = $('.bwAuthentication:first').bwAuthentication('option', 'MY_SUBMITTED_REQUESTS');

            if (!requests) {

                var msg = 'Error in bwExecutiveSummariesCarousel2.js.renderExecutiveSummaries_MY_SUBMITTED_REQUESTS(). No data loaded for requests.';

                console.log(msg);
                alert(msg);

            } else {

                $(accordionDrawerElement).html('');

                var elementId = $(accordionDrawerElement).attr('id'); // divBwExecutiveSummariesCarousel_PinnedRequests
                document.getElementById(elementId).style.display = 'inline';

                //
                // HERE IS WHERE WE SORT THE MY_SUBMITTED_REQUESTS. // thiz.options.userSelectedFilterFor_MY_SUBMITTED_REQUESTS // NEWEST, OLDEST.
                //
                console.log('HERE IS WHERE WE SORT THE MY_SUBMITTED_REQUESTS by Created date. requests[0].Created: ' + JSON.stringify(requests[0].Created + ', userSelectedFilterFor_MY_SUBMITTED_REQUESTS: ' + thiz.options.userSelectedFilterFor_MY_SUBMITTED_REQUESTS));

                if (thiz.options.userSelectedFilterFor_MY_SUBMITTED_REQUESTS == 'NEWEST') { // Created ascending.
                    requests.sort(function (a, b) {
                        if (a.Created < b.Created) { return 1; }
                        if (a.Created > b.Created) { return -1; }
                        return 0;
                    });
                } else if (thiz.options.userSelectedFilterFor_MY_SUBMITTED_REQUESTS == 'OLDEST') { // Created descending.
                    requests.sort(function (a, b) {
                        if (a.Created < b.Created) { return -1; }
                        if (a.Created > b.Created) { return 1; }
                        return 0;
                    });
                } else {
                    console.log('Unexpected value for userSelectedFilterFor_MY_SUBMITTED_REQUESTS: ' + thiz.options.userSelectedFilterFor_MY_SUBMITTED_REQUESTS);
                    displayAlertDialog('Unexpected value for userSelectedFilterFor_MY_SUBMITTED_REQUESTS: ' + thiz.options.userSelectedFilterFor_MY_SUBMITTED_REQUESTS);
                }






                //
                //
                // 2-17-2024 Adding new paging status, sort bar, and paging UI.
                //
                //
                var html = '';

                html += '<div id="divBwDataGrid_DocumentCount">Displaying 1 to x25 of ' + this.options.documentCounts.MY_SUBMITTED_REQUESTS + ' requests.&nbsp;&nbsp;&nbsp;&nbsp;'; // |<&nbsp;&nbsp;<&nbsp;&nbsp;>&nbsp;&nbsp;>|</div>';

                html += `<div style="display:inline-block;border:1px solid black;width:30px;height:20px;text-align:center;font-weight:bold;cursor:pointer;" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'navigateRequests\', \'move_to_start\', this);">|<</div>`;
                html += '&nbsp;&nbsp;';
                html += `<div style="display:inline-block;border:1px solid black;width:30px;height:20px;text-align:center;font-weight:bold;cursor:pointer;" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'navigateRequests\', \'move_to_left\', this);"><</div>`;
                html += '&nbsp;&nbsp;';
                html += `<div style="display:inline-block;border:1px solid black;width:30px;height:20px;text-align:center;font-weight:bold;cursor:pointer;" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'navigateRequests\', \'move_to_right\', this);">></div>`;
                html += '&nbsp;&nbsp;';
                html += `<div style="display:inline-block;border:1px solid black;width:30px;height:20px;text-align:center;font-weight:bold;cursor:pointer;" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'navigateRequests\', \'move_to_end\', this);">>|</div>`;

                html += '</div>';


                //html += '<div id="divBwDataGrid_FilterBar">[divBwDataGrid_FilterBar]</div>';

                html += '<div id="divBwDataGrid_FilterBar">';
                html += '<table id="dataGridTable2" class="dataGridTable" bwworkflowappid="' + workflowAppId + '" >';

                html += '  <tr class="headerRow">';
                html += '    <td></td>';

                // "Title" column header.
                html += '    <td style="white-space:nowrap;">';
                html += '       <div style="vertical-align:middle;display:inline-block;">Title&nbsp;</div>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'Title\', \'descending\', this);">';
                html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'Title\', \'ascending\', this);">';
                html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '   </td>';

                // "Description" column header.
                html += '    <td style="white-space:nowrap;">';
                html += '       <div style="vertical-align:middle;display:inline-block;">Description&nbsp;</div>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'ProjectTitle\', \'descending\', this);">';
                html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'ProjectTitle\', \'ascending\', this);">';
                html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '   </td>';

                // "Current Owner(s)" column header. 
                html += '    <td style="white-space:nowrap;">';
                html += '       <div style="vertical-align:middle;display:inline-block;">Current Owner(s)&nbsp;</div>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'CurrentOwner\', \'descending\', this);">';
                html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'CurrentOwner\', \'ascending\', this);">';
                html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '   </td>';

                // "Created Date" column header.
                html += '    <td style="white-space:nowrap;">';
                html += '       <div style="vertical-align:middle;display:inline-block;">Created Date&nbsp;</div>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'Created\', \'descending\', this);">';
                html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'Created\', \'ascending\', this);">';
                html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '   </td>';

                // "Location" column header.
                html += '   <td style="white-space:nowrap;">';
                html += '       <div style="vertical-align:middle;display:inline-block;">Location&nbsp;</div>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'OrgName\', \'ascending\', this);">';
                html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'OrgName\', \'ascending\', this);">';
                html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '   </td>';

                // "Capital Cost" column header. 
                html += '    <td style="white-space:nowrap;">';
                html += '       <div style="vertical-align:middle;display:inline-block;">Capital Cost&nbsp;</div>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'RequestedCapital\', \'descending\', this);">';
                html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'RequestedCapital\', \'ascending\', this);">';
                html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '   </td>';

                // "Modified Date" column header. 
                html += '    <td style="white-space:nowrap;">';
                html += '       <div style="vertical-align:middle;display:inline-block;">Modified Date&nbsp;</div>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'Modified\', \'descending\', this);">';
                html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'Modified\', \'ascending\', this);">';
                html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '   </td>';

                html += '    <td></td>';
                html += '  </tr>';

                html += '</table>';

                html += '</div>';

                $(accordionDrawerElement).append(html);















                var carouselItemIndex = 0;
                for (var i = 0; i < requests.length; i++) {
                    if (carouselItemIndex < 100) { // This is where we set how many tasks we will display in the carousel. Zero-based, so < 5 means display 5 tasks.

                        var ProjectTitle_clean = String(requests[i].ProjectTitle).replace(/["]/g, '&quot;').replace(/[']/g, '\\&#39;'); //&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method.
                        var title = 'Executive Summary for: ' + requests[i].Title + '. ' + ProjectTitle_clean;

                        var executiveSummaryElement = document.createElement('div');
                        executiveSummaryElement.classList.add('executiveSummaryInCarousel');
                        executiveSummaryElement.setAttribute('bwbudgetrequestid', requests[i].bwBudgetRequestId);
                        executiveSummaryElement.title = title;
                        executiveSummaryElement.alt = title;
                        executiveSummaryElement.style.minWidth = '300px';
                        executiveSummaryElement.style.maxWidth = '550px';
                        executiveSummaryElement.style.display = 'inline-block';
                        executiveSummaryElement.style.whiteSpace = 'nowrap';
                        executiveSummaryElement.style.color = 'rgb(38, 38, 38)';
                        executiveSummaryElement.style.fontFamily = '"Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif';
                        executiveSummaryElement.style.fontSize = '1.25em';

                        executiveSummaryElement.setAttribute('onclick', '$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'' + requests[i].bwBudgetRequestId + '\', \'' + requests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + requests[i].Title + '\', \'' + requests[i].bwAssignedToRaciRoleAbbreviation + '\', \'' + '7777xcx7777777_324_2_3xcx23424' + '\');');

                        $(accordionDrawerElement).append(executiveSummaryElement);

                        console.log('In bwExecutiveSummariesCarousel2.js.renderExecutiveSummaries_MY_SUBMITTED_REQUESTS(). Calling renderExecutiveSummaryForRequest(). xcx332-6-3');
                        //alert('In bwExecutiveSummariesCarousel2.js.renderExecutiveSummaries_MY_SUBMITTED_REQUESTS(). Calling renderExecutiveSummaryForRequest(). xcx332-6-3');
                        var promise = this.renderExecutiveSummaryForRequest(requests[i], executiveSummaryElement);
                        promise.then(function (result) {
                            // Do nothing.
                        }).catch(function (e) {
                            var msg = 'Exception xcx33995-2-2-13: ' + JSON.stringify(e);
                            console.log(msg);
                            displayAlertDialog(msg);
                        });

                        carouselItemIndex += 1;

                    } else {
                        break;
                    }
                }

                //
                //
                // 2-19-2024. IS THIS THE BEST PLACE TO BACKFILL THE EXECUTIVE SUMMARRIES? xcx1231421-4
                //
                //

                console.log('2-19-2024. IS THIS THE BEST PLACE TO BACKFILL THE EXECUTIVE SUMMARRIES? xcx1231421-4');




                //
                // This is our ellipsis context menu. MIT license and code at: https://swisnl.github.io/jQuery-contextMenu/demo/trigger-custom.html
                //


                $.contextMenu({
                    selector: '.context_menu_bwExecutiveSummariesCarousel2_MY_SUBMITTED_REQUESTS', // '.context_menu_bwExecutiveSummariesCarousel2_PINNED_REQUESTS',
                    callback: function (key, options) {
                        if (key == 'NEWEST') {

                            console.log('In bwExecutiveSummariesCarousel2(). Setting userSelectedFilterFor_MY_SUBMITTED_REQUESTS to NEWEST.');
                            $('.context_menu_bwExecutiveSummariesCarousel2_MY_SUBMITTED_REQUESTS').html('Sort by: Newest ↑');
                            thiz.options.userSelectedFilterFor_MY_SUBMITTED_REQUESTS = 'NEWEST';
                            thiz.renderExecutiveSummaries_MY_SUBMITTED_REQUESTS();

                        } else if (key == 'OLDEST') {

                            console.log('In bwExecutiveSummariesCarousel2(). Setting userSelectedFilterFor_MY_SUBMITTED_REQUESTS to OLDEST.');
                            $('.context_menu_bwExecutiveSummariesCarousel2_MY_SUBMITTED_REQUESTS').html('Sort by: Oldest ↑');
                            thiz.options.userSelectedFilterFor_MY_SUBMITTED_REQUESTS = 'OLDEST';
                            thiz.renderExecutiveSummaries_MY_SUBMITTED_REQUESTS();

                        } else {
                            console.log('Unexpected response. xcx2131241533. key: ' + key);
                            displayAlertDialog('Unexpected response. xcx2131241533. key: ' + key);
                        }
                    },
                    items: {
                        "NEWEST": { name: "Sort by: Newest ↑", icon: "fa-trash" },
                        "OLDEST": { name: "Sort by: Oldest ↑", icon: "fa-trash" }
                    }
                });
                $('.context_menu_bwExecutiveSummariesCarousel2_MY_SUBMITTED_REQUESTS').on('click', function (e) {
                    e.preventDefault();
                    var x = e.clientX;
                    var y = e.clientY;
                    $('.context_menu_bwExecutiveSummariesCarousel2_MY_SUBMITTED_REQUESTS').contextMenu(); //{ x: x, y: y }); // specifying x and y here doesn't work for left click. We need to get the left click position workng at some point but no biggie at this time.
                });
                //
                // End: This is our ellipsis context menu.
                //


                if (thiz.options.userSelectedFilterFor_MY_SUBMITTED_REQUESTS == 'NEWEST') {
                    $('.context_menu_bwExecutiveSummariesCarousel2_MY_SUBMITTED_REQUESTS').html('Sort by: Newest ↑');
                } else if (thiz.options.userSelectedFilterFor_MY_SUBMITTED_REQUESTS == 'OLDEST') {
                    $('.context_menu_bwExecutiveSummariesCarousel2_MY_SUBMITTED_REQUESTS').html('Sort by: Oldest ↑');
                } else {
                    console.log('Unexpected value for userSelectedFilterFor_MY_SUBMITTED_REQUESTS: ' + thiz.options.userSelectedFilterFor_MY_SUBMITTED_REQUESTS + '. xcx231243.');
                    displayAlertDialog('Unexpected value for userSelectedFilterFor_MY_SUBMITTED_REQUESTS: ' + thiz.options.userSelectedFilterFor_MY_SUBMITTED_REQUESTS + '. xcx231243.');
                }



            }

        } catch (e) {
            console.log('Exception in bwExecutiveSummariesCarousel2.renderExecutiveSummaries_MY_SUBMITTED_REQUESTS(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwExecutiveSummariesCarousel2.renderExecutiveSummaries_MY_SUBMITTED_REQUESTS(): ' + e.message + ', ' + e.stack);
        }
    },

    renderExecutiveSummaries_MY_PENDING_TASKS: function (spinnerText) {
        try {
            console.log('In bwExecutiveSummariesCarousel2.renderExecutiveSummaries_MY_PENDING_TASKS().');
            //displayAlertDialog('In bwExecutiveSummariesCarousel2.renderExecutiveSummaries_MY_PENDING_TASKS().');
            var thiz = this;

            localStorage.setItem('bwDisplayFormat', 'ExecutiveSummaries');

            $('#buttonDisplayRequestsAsDetailedList_MyPendingTasks').removeClass().addClass('divCarouselButton'); // Unselect the other button.
            $('#buttonDisplayRequestsAsTiles_MyPendingTasks').removeClass().addClass('divCarouselButton_Selected'); // Select this one. 

            var accordionDrawerElement;
            var accordionDrawerElements = $('.bwAccordionDrawer');
            for (var i = 0; i < accordionDrawerElements.length; i++) {
                if ($(accordionDrawerElements[i]).attr('bwaccordiondrawertype') == 'MY_PENDING_TASKS') {
                    accordionDrawerElement = accordionDrawerElements[i];
                    break;
                }
            }

            var myPendingTasks = $('.bwAuthentication:first').bwAuthentication('option', 'MY_PENDING_TASKS');

            if (!myPendingTasks) {

                var msg = 'Error in bwExecutiveSummariesCarousel2.js.renderExecutiveSummaries_MY_PENDING_TASKS(). No data loaded for myPendingTasks.';

                console.log(msg);
                alert(msg);

            } else {

                $(accordionDrawerElement).html('');

                var elementId = $(accordionDrawerElement).attr('id');
                document.getElementById(elementId).style.display = 'inline';

                //
                // HERE IS WHERE WE SORT THE MY_PENDING_TASKS. // thiz.options.userSelectedFilterFor_MY_PENDING_TASKS // NEWEST, OLDEST.
                //
                console.log('HERE IS WHERE WE SORT THE MY_PENDING_TASKS by Created date. myPendingTasks[0].Created: ' + JSON.stringify(myPendingTasks[0].Created + ', userSelectedFilterFor_MY_PENDING_TASKS: ' + thiz.options.userSelectedFilterFor_MY_PENDING_TASKS));

                if (thiz.options.userSelectedFilterFor_MY_PENDING_TASKS == 'NEWEST') { // Created ascending.
                    myPendingTasks.sort(function (a, b) {
                        if (a.Created < b.Created) { return 1; }
                        if (a.Created > b.Created) { return -1; }
                        return 0;
                    });
                } else if (thiz.options.userSelectedFilterFor_MY_PENDING_TASKS == 'OLDEST') { // Created descending.
                    myPendingTasks.sort(function (a, b) {
                        if (a.Created < b.Created) { return -1; }
                        if (a.Created > b.Created) { return 1; }
                        return 0;
                    });
                } else {
                    console.log('Unexpected value for userSelectedFilterFor_MY_PENDING_TASKS: ' + thiz.options.userSelectedFilterFor_MY_PENDING_TASKS);
                    displayAlertDialog('Unexpected value for userSelectedFilterFor_MY_PENDING_TASKS: ' + thiz.options.userSelectedFilterFor_MY_PENDING_TASKS);
                }





                // ' + this.options.documentCounts.MY_PENDING_TASKS + '








                var carouselItemIndex = 0;
                for (var i = (myPendingTasks.length - 1); i > -1; i--) { // This loop goes backwards...
                    if (carouselItemIndex < 100) { // This is where we set how many tasks we will display in the carousel. Zero-based, so < 5 means display 5 tasks.

                        var ProjectTitle_clean = String(myPendingTasks[i].ProjectTitle).replace(/["]/g, '&quot;').replace(/[']/g, '\\&#39;'); //&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method.
                        var title = 'Executive Summary for: ' + myPendingTasks[i].Title + '. ' + ProjectTitle_clean;

                        var executiveSummaryElement = document.createElement('div');
                        executiveSummaryElement.classList.add('executiveSummaryInCarousel');
                        executiveSummaryElement.setAttribute('bwbudgetrequestid', myPendingTasks[i].bwBudgetRequestId);
                        executiveSummaryElement.title = title;
                        executiveSummaryElement.alt = title;
                        executiveSummaryElement.style.minWidth = '300px';
                        executiveSummaryElement.style.maxWidth = '550px';
                        executiveSummaryElement.style.display = 'inline-block';
                        executiveSummaryElement.style.whiteSpace = 'nowrap';
                        executiveSummaryElement.style.color = 'rgb(38, 38, 38)';
                        executiveSummaryElement.style.fontFamily = '"Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif';
                        executiveSummaryElement.style.fontSize = '1.25em';

                        executiveSummaryElement.setAttribute('onclick', '$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'\', \'' + myPendingTasks[i].bwRelatedItemId + '\', \'' + myPendingTasks[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + myPendingTasks[i].Title + '\', \'' + myPendingTasks[i].bwAssignedToRaciRoleAbbreviation + '\', \'' + '7777xcx7777777-324-3' + '\');');

                        $(accordionDrawerElement).append(executiveSummaryElement);


                        var promise = this.renderExecutiveSummaryForTask(myPendingTasks[i], executiveSummaryElement);
                        promise.then(function (result) {
                            // Do nothing.
                        }).catch(function (e) {
                            alert('Exception xcx33995-1: ' + JSON.stringify(e));
                        });

                        carouselItemIndex += 1;

                    } else {
                        break;
                    }
                }

                //
                // This is our ellipsis context menu. MIT license and code at: https://swisnl.github.io/jQuery-contextMenu/demo/trigger-custom.html
                //


                $.contextMenu({
                    selector: '.context_menu_bwExecutiveSummariesCarousel2_MY_PENDING_TASKS', // '.context_menu_bwExecutiveSummariesCarousel2_PINNED_REQUESTS',
                    callback: function (key, options) {
                        if (key == 'NEWEST') {

                            console.log('In bwExecutiveSummariesCarousel2(). Setting userSelectedFilterFor_MY_PENDING_TASKS to NEWEST.');
                            $('.context_menu_bwExecutiveSummariesCarousel2_MY_PENDING_TASKS').html('Sort by: Newest ↑');
                            thiz.options.userSelectedFilterFor_MY_PENDING_TASKS = 'NEWEST';
                            thiz.renderExecutiveSummaries_MY_PENDING_TASKS();

                        } else if (key == 'OLDEST') {

                            console.log('In bwExecutiveSummariesCarousel2(). Setting userSelectedFilterFor_MY_PENDING_TASKS to OLDEST.');
                            $('.context_menu_bwExecutiveSummariesCarousel2_MY_PENDING_TASKS').html('Sort by: Oldest ↑');
                            thiz.options.userSelectedFilterFor_MY_PENDING_TASKS = 'OLDEST';
                            thiz.renderExecutiveSummaries_MY_PENDING_TASKS();

                        } else {
                            console.log('Unexpected response. xcx2131241533. key: ' + key);
                            displayAlertDialog('Unexpected response. xcx2131241533. key: ' + key);
                        }
                    },
                    items: {
                        "NEWEST": { name: "Sort by: Newest ↑", icon: "fa-trash" },
                        "OLDEST": { name: "Sort by: Oldest ↑", icon: "fa-trash" }
                    }
                });
                $('.context_menu_bwExecutiveSummariesCarousel2_MY_PENDING_TASKS').on('click', function (e) {
                    e.preventDefault();
                    var x = e.clientX;
                    var y = e.clientY;
                    $('.context_menu_bwExecutiveSummariesCarousel2_MY_PENDING_TASKS').contextMenu(); //{ x: x, y: y }); // specifying x and y here doesn't work for left click. We need to get the left click position workng at some point but no biggie at this time.
                });
                //
                // End: This is our ellipsis context menu.
                //


                if (thiz.options.userSelectedFilterFor_MY_PENDING_TASKS == 'NEWEST') {
                    $('.context_menu_bwExecutiveSummariesCarousel2_MY_PENDING_TASKS').html('Sort by: Newest ↑');
                } else if (thiz.options.userSelectedFilterFor_MY_PENDING_TASKS == 'OLDEST') {
                    $('.context_menu_bwExecutiveSummariesCarousel2_MY_PENDING_TASKS').html('Sort by: Oldest ↑');
                } else {
                    console.log('Unexpected value for userSelectedFilterFor_MY_PENDING_TASKS: ' + thiz.options.userSelectedFilterFor_MY_PENDING_TASKS + '. xcx231243.');
                    displayAlertDialog('Unexpected value for userSelectedFilterFor_MY_PENDING_TASKS: ' + thiz.options.userSelectedFilterFor_MY_PENDING_TASKS + '. xcx231243.');
                }


            }

        } catch (e) {
            console.log('Exception in bwExecutiveSummariesCarousel2.renderExecutiveSummaries_MY_PENDING_TASKS(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwExecutiveSummariesCarousel2.renderExecutiveSummaries_MY_PENDING_TASKS(): ' + e.message + ', ' + e.stack);
        }
    },




    renderExecutiveSummaries_ACTIVE_REQUESTS: function (source) {
        try {
            console.log('In bwExecutiveSummariesCarousel2.js.renderExecutiveSummaries_ACTIVE_REQUESTS(). source: ' + source);
            //alert('In bwExecutiveSummariesCarousel2.js.renderExecutiveSummaries_ACTIVE_REQUESTS(). source: ' + source);
            var thiz = this;

            localStorage.setItem('bwDisplayFormat', 'ExecutiveSummaries');

            $('#buttonDisplayRequestsAsDetailedList_ActiveRequests').removeClass().addClass('divCarouselButton'); // Unselect the other buttons.
            $('#buttonDisplayRequestsAsTiles_ActiveRequests').removeClass().addClass('divCarouselButton_Selected'); // Select this one. 

            var accordionDrawerElement;
            var accordionDrawerElements = $('.bwAccordionDrawer');
            for (var i = 0; i < accordionDrawerElements.length; i++) {
                if ($(accordionDrawerElements[i]).attr('bwaccordiondrawertype') == 'ACTIVE_REQUESTS') {
             
                    accordionDrawerElement = accordionDrawerElements[i];
                    break;
                }
            }

            if (!accordionDrawerElement) {

                var msg = 'Error in bwExecutiveSummariesCarousel2.js.renderExecutiveSummaries_ACTIVE_REQUESTS(). Invalid value for accordionDrawerElement: ' + accordionDrawerElement;
                console.log(msg);
                displayAlertDialog(msg);

            } else {

                //var msg = 'In bwExecutiveSummariesCarousel2.js.renderExecutiveSummaries_ACTIVE_REQUESTS(). FOUND accordionDrawerElement: ' + accordionDrawerElement;
                //console.log(msg);
                //displayAlertDialog(msg);

                var requestsSummaryDetails = $('.bwAuthentication:first').bwAuthentication('option', 'ACTIVE_REQUESTS');
                var requests = requestsSummaryDetails.docs;

                if (!(requests && requests.length && (requests.length > 0))) {

                    //
                    // If we get here, the user has no active requests. This is most likely because they are really good at getting their work done (completing their tasks), or are a new user.
                    //

                    var msg = 'This user has no active requests. This is most likely because they are really good at getting their work done (completing their tasks), or are a new user.';
                    console.log(msg);
                    //alert(msg);

                    //
                    // No results, so hiding the [ACTIVE_REQUESTS] drawer.
                    //

                    document.getElementById('functionalAreaRow_0_2').style.display = 'none';
                    document.getElementById('alertSectionRow_0_2').style.display = 'none';

                } else {

                    $(accordionDrawerElement).html('');

                    var elementId = $(accordionDrawerElement).attr('id');
                    document.getElementById(elementId).style.display = 'inline';

                    //
                    // HERE IS WHERE WE SORT THE ACTIVE_REQUESTS. // thiz.options.userSelectedFilterFor_ACTIVE_REQUESTS // NEWEST, OLDEST.
                    //
                    console.log('HERE IS WHERE WE SORT THE ACTIVE_REQUESTS by Created date. xcx21321312.'); // requests[0].Created: ' + JSON.stringify(requests[0].Created + ', userSelectedFilterFor_ACTIVE_REQUESTS: ' + thiz.options.userSelectedFilterFor_ACTIVE_REQUESTS));

                    var sortDataElement = this.options.userSelectedFilterFor_ACTIVE_REQUESTS.sortDataElement;
                    if (this.options.userSelectedFilterFor_ACTIVE_REQUESTS.sortOrder == 'ascending') { // Created ascending.
                        requests.sort(function (a, b) {
                            if (a[sortDataElement] < b[sortDataElement]) { return 1; }
                            if (a[sortDataElement] > b[sortDataElement]) { return -1; }
                            return 0;
                        });
                    } else if (this.options.userSelectedFilterFor_ACTIVE_REQUESTS.sortOrder == 'descending') { // Created descending.
                        requests.sort(function (a, b) {
                            if (a[sortDataElement] < b[sortDataElement]) { return -1; }
                            if (a[sortDataElement] > b[sortDataElement]) { return 1; }
                            return 0;
                        });
                    } else {
                        console.log('Unexpected value for userSelectedFilterFor_ACTIVE_REQUESTS.sortOrder: ' + this.options.userSelectedFilterFor_ACTIVE_REQUESTS.sortOrder);
                        displayAlertDialog('Unexpected value for userSelectedFilterFor_ACTIVE_REQUESTS.sortOrder: ' + this.options.userSelectedFilterFor_ACTIVE_REQUESTS.sortOrder);
                    }



                    //
                    //
                    // Adding new paging status, sort bar, and paging UI.
                    //
                    //

                    console.log('xcx2131231. requestsSummaryDetails: ' + Object.keys(requestsSummaryDetails)); // docs,totalDocs,offset,limit,totalPages,page,pagingCounter,hasPrevPage,hasNextPage,prevPage,nextPage.

                    var msg = 'requestsSummaryDetails. totalDocs: ' + requestsSummaryDetails.totalDocs + ', offset: ' + requestsSummaryDetails.offset + ', limit: ' + requestsSummaryDetails.limit + ', totalPages: ' + requestsSummaryDetails.totalPages + ', page: ' + requestsSummaryDetails.page + ', pagingCounter: ' + requestsSummaryDetails.pagingCounter + ', hasPrevPage: ' + requestsSummaryDetails.hasPrevPage + ', hasNextPage: ' + requestsSummaryDetails.hasNextPage + ', prevPage: ' + requestsSummaryDetails.prevPage + ', nextPage: ' + requestsSummaryDetails.nextPage;
                    console.log(msg);
                    //displayAlertDialog(msg);

                    var html = '';

                    //
                    // Displaying xx to xx of xx requests.
                    //

                    var startDocumentCounter = requestsSummaryDetails.offset + 1; // Because it is zero based.
                    var displayTotal = requestsSummaryDetails.page * requestsSummaryDetails.limit;

                    if (displayTotal > requestsSummaryDetails.totalDocs) {
                        displayTotal = requestsSummaryDetails.totalDocs;
                    }

                    html += '<div xcx="xcx2131215455-1" id="divBwDataGrid_DocumentCount">Displaying ' + startDocumentCounter + ' to ' + displayTotal + ' of ' + requestsSummaryDetails.totalDocs + ' requests.&nbsp;&nbsp;';

                    //
                    // Request type drop down.
                    //

                    var bwRequestTypeId = this.options.userSelectedFilterFor_ACTIVE_REQUESTS.bwRequestTypeId;

                    var requestTypes = $('.bwAuthentication').bwAuthentication('option', 'bwEnabledRequestTypes').EnabledItems;

                    html += '                   <select id="selectRequestTypeDropDown" onchange="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'selectRequestType\', \'ACTIVE_REQUESTS\', this);" class="selectHomePageWorkflowAppDropDown" style=\'display:inline;border-color: whitesmoke; color: grey; font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 1em; font-weight: bold; cursor: pointer;  margin-bottom:15px;\'>'; // was .5em
                    html += '                       <option value="" >' + 'All Request Types' + '</option>';
                    for (var i = 0; i < requestTypes.length; i++) {

                        if (!bwRequestTypeId) {
                            // "All Request Types" is at the top of the list, and should always be the default selection when coming to this screen.
                            html += '                   <option value="' + requestTypes[i].bwRequestTypeId + '" >' + requestTypes[i].PluralName + '</option>';
                        } else {
                            if (requestTypes[i].bwRequestTypeId == bwRequestTypeId) {
                                html += '                   <option value="' + requestTypes[i].bwRequestTypeId + '" selected="selected" >' + requestTypes[i].PluralName + '</option>';
                            } else {
                                html += '                   <option value="' + requestTypes[i].bwRequestTypeId + '" >' + requestTypes[i].PluralName + '</option>';
                            }
                        }
                    }
                    html += '                   </select>&nbsp;&nbsp;';

                    //
                    // Requests per page drop down.
                    //

                    var limit = this.options.userSelectedFilterFor_ACTIVE_REQUESTS.limit;
                    html += `<span>Requests per page: 
                            <select id="selectRequestsPerPage_ACTIVE_REQUESTS" onchange="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'selectRequestsPerPage\', \'ACTIVE_REQUESTS\', this);">`;

                    if (limit == 25) {
                        html += '<option selected="selected">25</option>';
                    } else {
                        html += '<option>25</option>';
                    }
                    if (limit == 50) {
                        html += '<option selected="selected">50</option>';
                    } else {
                        html += '<option>50</option>';
                    }
                    if (limit == 100) {
                        html += '<option selected="selected">100</option>';
                    } else {
                        html += '<option>100</option>';
                    }
                    if (limit == 200) {
                        html += '<option selected="selected">200</option>';
                    } else {
                        html += '<option>200</option>';
                    }

                    html += `   </select>
                        </span>`;

                    //
                    // Navigation arrows.
                    //

                    html += '&nbsp;&nbsp;';
                    html += `<div class="datasetNavigationButton" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'navigateRequests\', \'move_to_start\', this);">|<</div>`;
                    html += '&nbsp;&nbsp;';
                    html += `<div class="datasetNavigationButton" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'navigateRequests\', \'move_to_left\', this);"><</div>`;
                    html += '&nbsp;&nbsp;';
                    html += `<div class="datasetNavigationButton" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'navigateRequests\', \'move_to_right\', this);">></div>`;
                    html += '&nbsp;&nbsp;';
                    html += `<div class="datasetNavigationButton" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'navigateRequests\', \'move_to_end\', this);">>|</div>`;

                    var displaySupplementals = this.options.userSelectedFilterFor_ACTIVE_REQUESTS.displaySupplementals;
                    if (displaySupplementals == true) {
                        html += '&nbsp;&nbsp;<input type="checkbox" checked="checked" id="bwExecutiveSummariesCarousel2_DisplaySupplementals_Checkbox" onchange="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'toggleDisplaySupplementals\', this);" />Display Supplementals/Addendums.';
                    } else {
                        html += '&nbsp;&nbsp;<input type="checkbox" id="bwExecutiveSummariesCarousel2_DisplaySupplementals_Checkbox" onchange="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'toggleDisplaySupplementals\', this);" />Display Supplementals/Addendums.';
                    }

                    //
                    // Timeline button.
                    //
                    //html += `<span class="" xcx="xcx23423577788" style="color:tomato;font-weight:normal;cursor:pointer;" onclick="$(\'.bwTimelineAggregator\').bwTimelineAggregator(\'displayDialog\', \'ACTIVE_REQUESTS\');">&nbsp;&nbsp;[VIEW TIMELINE]</span>`;
                    html += '&nbsp;&nbsp;<input type="button" style="cursor:pointer;font-size: 14pt;" value="View timeline..." onclick="$(\'.bwTimelineAggregator\').bwTimelineAggregator(\'displayDialog\', \'ACTIVE_REQUESTS\');">';




                    html += '</div>';

                    html += '<div id="divBwDataGrid_FilterBar">';
                    html += '<table id="dataGridTable2" class="dataGridTable" bwworkflowappid="' + workflowAppId + '" >';

                    html += '  <tr class="headerRow">';
                    html += '    <td></td>';

                    // "Title" column header.
                    html += '    <td style="white-space:nowrap;">';
                    html += '       <div style="vertical-align:middle;display:inline-block;">Title&nbsp;</div>';
                    html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'Title\', \'descending\', this);">';
                    html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                    html += '       </span>';
                    html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'Title\', \'ascending\', this);">';
                    html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                    html += '       </span>';
                    html += '   </td>';

                    // "Description" column header.
                    html += '    <td style="white-space:nowrap;">';
                    html += '       <div style="vertical-align:middle;display:inline-block;">Description&nbsp;</div>';
                    html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'ProjectTitle\', \'descending\', this);">';
                    html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                    html += '       </span>';
                    html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'ProjectTitle\', \'ascending\', this);">';
                    html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                    html += '       </span>';
                    html += '   </td>';

                    // "Current Owner(s)" column header. 
                    html += '    <td style="white-space:nowrap;">';
                    html += '       <div style="vertical-align:middle;display:inline-block;">Current Owner(s)&nbsp;</div>';
                    html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'CurrentOwner\', \'descending\', this);">';
                    html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                    html += '       </span>';
                    html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'CurrentOwner\', \'ascending\', this);">';
                    html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                    html += '       </span>';
                    html += '   </td>';

                    // "Created Date" column header.
                    html += '    <td style="white-space:nowrap;">';
                    html += '       <div style="vertical-align:middle;display:inline-block;">Created Date&nbsp;</div>';
                    html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'Created\', \'descending\', this);">';
                    html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                    html += '       </span>';
                    html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'Created\', \'ascending\', this);">';
                    html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                    html += '       </span>';
                    html += '   </td>';

                    // "Location" column header.
                    html += '   <td style="white-space:nowrap;">';
                    html += '       <div style="vertical-align:middle;display:inline-block;">Location&nbsp;</div>';
                    html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'OrgName\', \'ascending\', this);">';
                    html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                    html += '       </span>';
                    html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'OrgName\', \'ascending\', this);">';
                    html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                    html += '       </span>';
                    html += '   </td>';

                    // "Capital Cost" column header. 
                    html += '    <td style="white-space:nowrap;">';
                    html += '       <div style="vertical-align:middle;display:inline-block;">Capital Cost&nbsp;</div>';
                    html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'RequestedCapital\', \'descending\', this);">';
                    html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                    html += '       </span>';
                    html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'RequestedCapital\', \'ascending\', this);">';
                    html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                    html += '       </span>';
                    html += '   </td>';

                    // "Modified Date" column header. 
                    html += '    <td style="white-space:nowrap;">';
                    html += '       <div style="vertical-align:middle;display:inline-block;">Modified Date&nbsp;</div>';
                    html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'Modified\', \'descending\', this);">';
                    html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                    html += '       </span>';
                    html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'Modified\', \'ascending\', this);">';
                    html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
                    html += '       </span>';
                    html += '   </td>';

                    html += '    <td></td>';
                    html += '  </tr>';

                    html += '</table>';

                    html += '</div>';

                    $(accordionDrawerElement).append(html);

                    //
                    //
                    // end: Adding new paging status, sort bar, and paging UI.
                    //
                    //


















                    var RolesAndParticipants_BackfillArray = []; // We populate this in the loop below, ensuring we don't get any duplicates. Subsequently we make a web service call and get everything we need back at 1 time.
                    var thisOneIsAlreadyInTheArray;

                    var carouselItemIndex = 0;

                    for (var i = 0; i < requests.length; i++) {

                        if ((displaySupplementals != true) && (requests[i].IsSupplementalRequest == true)) {

                            // Do nothing. We aren't displaying supplementals.

                        } else {

                            if (carouselItemIndex < 100) { // This is where we set how many tasks we will display in the carousel. Zero-based, so < 5 means display 5 tasks.

                                // Now we create the Executive Summary and add it to the DOM.
                                var ProjectTitle_clean = '';
                                try {
                                    ProjectTitle_clean = bwEncodeURIComponent(String(requests[i].ProjectTitle).replaceAll('"', '&quot;').replaceAll(/[']/g, '\\&#39;').replaceAll('<', '').replaceAll('>', '').replaceAll('/', '')); //&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method.
                                } catch (e) { }

                                var title = 'Executive Summary for: ' + requests[i].Title + '. ' + ProjectTitle_clean;

                                var executiveSummaryElement = document.createElement('div');
                                executiveSummaryElement.classList.add('executiveSummaryInCarousel');
                                executiveSummaryElement.setAttribute('bwbudgetrequestid', requests[i].bwBudgetRequestId);
                                executiveSummaryElement.title = 'xcx34346645 ' + title;
                                executiveSummaryElement.alt = title;
                                executiveSummaryElement.style.minWidth = '300px';
                                executiveSummaryElement.style.maxWidth = '550px';
                                executiveSummaryElement.style.display = 'inline-block';
                                executiveSummaryElement.style.whiteSpace = 'nowrap';
                                executiveSummaryElement.style.color = 'rgb(38, 38, 38)';
                                executiveSummaryElement.style.fontFamily = '"Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif';
                                executiveSummaryElement.style.fontSize = '1.25em';

                                executiveSummaryElement.setAttribute('onclick', '$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'' + requests[i].bwBudgetRequestId + '\', \'' + requests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + requests[i].Title + '\', \'' + requests[i].bwAssignedToRaciRoleAbbreviation + '\', \'' + '7777xcx7777777_324_2_4xcx243252' + '\');');

                                $(accordionDrawerElement).append(executiveSummaryElement);

                                requests[i]["executiveSummaryElement"] = executiveSummaryElement; // We do this so we can easily find the executive summary element again when backfilling.

                                console.log('Calling renderExecutiveSummaryForRequest(). xcx332-6-4');
                                //alert('Calling renderExecutiveSummaryForRequest(). xcx332-6-4');
                                var promise = this.renderExecutiveSummaryForRequest(requests[i], executiveSummaryElement);
                                promise.then(function (result) {
                                    // Do nothing.
                                }).catch(function (e) {
                                    var msg = 'Exception xcx33995-2-2-14: ' + JSON.stringify(e);
                                    console.log(msg);
                                    displayAlertDialog(msg);
                                });


                                //
                                // Here is where we check if we should add an item to the RolesAndParticipants_BackfillArray.
                                //
                                thisOneIsAlreadyInTheArray = false;
                                for (var j = 0; j < RolesAndParticipants_BackfillArray.length; j++) {
                                    if (requests[i].OrgId == RolesAndParticipants_BackfillArray[j].OrgId) {
                                        if (requests[i].bwRequestTypeId == RolesAndParticipants_BackfillArray[j].bwRequestTypeId) {
                                            thisOneIsAlreadyInTheArray = true;
                                        }
                                    }
                                }
                                if (thisOneIsAlreadyInTheArray != true) {
                                    // Add it to the array.
                                    var RolesAndParticipants_ArrayItem = {
                                        OrgId: requests[i].OrgId,
                                        bwRequestTypeId: requests[i].bwRequestTypeId
                                    }
                                    RolesAndParticipants_BackfillArray.push(RolesAndParticipants_ArrayItem);
                                }
                                //
                                // end: Here is where we check if we should add an item to the RolesAndParticipants_BackfillArray.
                                //


                                carouselItemIndex += 1;

                            } else {
                                break;
                            }
                        }
                    }























                    //
                    //
                    // 2-19-2024. IS THIS THE BEST PLACE TO BACKFILL THE EXECUTIVE SUMMARRIES? xcx1231421-5
                    //
                    // var RolesAndParticipants_BackfillArray = [];
                    //
                    // var RolesAndParticipants_ArrayItem = {
                    //     OrgId: xx,
                    //     bwRequestTypeId: xx
                    // }

                    console.log('2-19-2024. IS THIS THE BEST PLACE TO BACKFILL THE EXECUTIVE SUMMARRIES? xcx1231421-5');

                    //
                    //
                    // DO THE BACKFILL HERE. Call the webservice: /odata/racirolesandparticipants_arrayversion << Created this webservice specifically for this, but maybe can merge with the /odata/racirolesandparticipants at some point...
                    //
                    //
                    var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                    var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

                    var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                    var data = {
                        bwParticipantId_LoggedIn: participantId,
                        bwActiveStateIdentifier: activeStateIdentifier,
                        bwWorkflowAppId_LoggedIn: workflowAppId,

                        bwWorkflowAppId: workflowAppId,
                        RolesAndParticipants_BackfillArray: JSON.stringify(RolesAndParticipants_BackfillArray)
                    };

                    var operationUri = this.options.operationUriPrefix + '_bw/racirolesandparticipants_arrayversion';
                    $.ajax({
                        url: operationUri,
                        type: 'POST',
                        data: data,
                        headers: { "Accept": "application/json; odata=verbose" },
                        success: function (results) {
                            try {

                                if (results.status != 'SUCCESS') {

                                    var msg = 'Error in bwExecutiveSummariesCarousel2.js.renderExecutiveSummaries_ACTIVE_REQUESTS(). ' + results.status + ', ' + results.message;
                                    console.log(msg);
                                    displayAlertDialog(msg);

                                } else {

                                    var RolesAndParticipants_BackfillArray2 = results.RolesAndParticipants_BackfillArray;

                                    var weFoundTheWorkflowStep;
                                    //var workflowUsersAndRolesArrayForDisplay;

                                    for (var i = 0; i < requests.length; i++) {
                                        if (carouselItemIndex < 100) { // This is where we set how many tasks we will display in the carousel. Zero-based, so < 5 means display 5 tasks.

                                            for (var j = 0; j < RolesAndParticipants_BackfillArray2.length; j++) {
                                                if (requests[i].OrgId == RolesAndParticipants_BackfillArray2[j].OrgId) {
                                                    if (requests[i].bwRequestTypeId == RolesAndParticipants_BackfillArray2[j].bwRequestTypeId) {

                                                        //
                                                        //
                                                        // AT THIS POINT WE HAVE ENOUGH INFORMATION TO FIND OUT WHO THE participants are who are currently participating in the workflow.
                                                        //
                                                        //

                                                        var budgetWorkflowStatus = requests[i].BudgetWorkflowStatus;

                                                        var workflow = JSON.parse(RolesAndParticipants_BackfillArray2[j].Workflow.bwWorkflowJson);
                                                        var RolesAndParticipants = RolesAndParticipants_BackfillArray2[j].RolesAndParticipants[0];

                                                        weFoundTheWorkflowStep = false;
                                                        var stepIndex1;
                                                        //workflowUsersAndRolesArrayForDisplay = {
                                                        //    Approvers: [],
                                                        //    Collaborators: [],
                                                        //    Informed: []
                                                        //}
                                                        for (var k = 0; k < workflow.Steps.Step.length; k++) {

                                                            //if (workflow.Steps.Step[k]["@Name"] == budgetWorkflowStatus) {

                                                            var workflowUsersAndRolesArrayForDisplay = {
                                                                Approvers: [],
                                                                Collaborators: [],
                                                                Informed: []
                                                            }

                                                            // We have found the step.
                                                            weFoundTheWorkflowStep = true;
                                                            stepIndex1 = k;

                                                            if (workflow.Steps.Step[k].Assign && workflow.Steps.Step[k].Assign.length) {

                                                                for (var l = 0; l < workflow.Steps.Step[k].Assign.length; l++) {

                                                                    if (workflow.Steps.Step[k].Assign[l]["@RoleCategory"] == 'Approver') {

                                                                        var weFoundARoleAssignment = false;
                                                                        for (var m = 0; m < RolesAndParticipants.Roles.length; m++) {
                                                                            if (workflow.Steps.Step[k].Assign[l]["@Role"] == RolesAndParticipants.Roles[m].RoleId) {

                                                                                // We found the role and participant.
                                                                                weFoundARoleAssignment = true;

                                                                                var x1 = {
                                                                                    RoleId: workflow.Steps.Step[k].Assign[l]["@Role"],
                                                                                    ParticipantId: RolesAndParticipants.Roles[m].ParticipantId,
                                                                                    ParticipantFriendlyName: RolesAndParticipants.Roles[m].ParticipantFriendlyName,
                                                                                    ParticipantEmail: RolesAndParticipants.Roles[m].ParticipantEmail
                                                                                }

                                                                                workflowUsersAndRolesArrayForDisplay.Approvers.push(x1);

                                                                            }
                                                                        }

                                                                        if (weFoundARoleAssignment != true) {

                                                                            var x1 = {
                                                                                RoleId: workflow.Steps.Step[k].Assign[l]["@Role"],
                                                                                ParticipantFriendlyName: '[no role assignment]'
                                                                            }

                                                                            workflowUsersAndRolesArrayForDisplay.Approvers.push(x1);

                                                                        }

                                                                    } else if (workflow.Steps.Step[k].Assign[l]["@RoleCategory"] == 'Collaborator') {

                                                                        var weFoundARoleAssignment = false;
                                                                        for (var m = 0; m < RolesAndParticipants.Roles.length; m++) {
                                                                            if (workflow.Steps.Step[k].Assign[l]["@Role"] == RolesAndParticipants.Roles[m].RoleId) {

                                                                                // We found the role and participant.
                                                                                weFoundARoleAssignment = true;

                                                                                var x1 = {
                                                                                    RoleId: workflow.Steps.Step[k].Assign[l]["@Role"],
                                                                                    ParticipantId: RolesAndParticipants.Roles[m].ParticipantId,
                                                                                    ParticipantFriendlyName: RolesAndParticipants.Roles[m].ParticipantFriendlyName,
                                                                                    ParticipantEmail: RolesAndParticipants.Roles[m].ParticipantEmail
                                                                                }

                                                                                workflowUsersAndRolesArrayForDisplay.Collaborators.push(x1);

                                                                            }

                                                                        }

                                                                        if (weFoundARoleAssignment != true) {

                                                                            var x1 = {
                                                                                RoleId: workflow.Steps.Step[k].Assign[l]["@Role"],
                                                                                ParticipantFriendlyName: '[no role assignment]'
                                                                            }

                                                                            workflowUsersAndRolesArrayForDisplay.Collaborators.push(x1);

                                                                        }

                                                                    } else if (workflow.Steps.Step[k].Assign[l]["@RoleCategory"] == 'Inform') {

                                                                        var weFoundARoleAssignment = false;
                                                                        for (var m = 0; m < RolesAndParticipants.Roles.length; m++) {
                                                                            if (workflow.Steps.Step[k].Assign[l]["@Role"] == RolesAndParticipants.Roles[m].RoleId) {

                                                                                // We found the role and participant.
                                                                                weFoundARoleAssignment = true;

                                                                                var x1 = {
                                                                                    RoleId: workflow.Steps.Step[k].Assign[l]["@Role"],
                                                                                    ParticipantId: RolesAndParticipants.Roles[m].ParticipantId,
                                                                                    ParticipantFriendlyName: RolesAndParticipants.Roles[m].ParticipantFriendlyName,
                                                                                    ParticipantEmail: RolesAndParticipants.Roles[m].ParticipantEmail
                                                                                }

                                                                                workflowUsersAndRolesArrayForDisplay.Informed.push(x1);

                                                                            }

                                                                        }

                                                                        if (weFoundARoleAssignment != true) {

                                                                            var x1 = {
                                                                                RoleId: workflow.Steps.Step[k].Assign[l]["@Role"],
                                                                                ParticipantFriendlyName: '[no role assignment]'
                                                                            }

                                                                            workflowUsersAndRolesArrayForDisplay.Informed.push(x1);

                                                                        }

                                                                    } else {

                                                                        alert('xcx34324 ERROR FINDING RoleCategory. Unexpected value: ' + workflow.Steps.Step[k].Assign[l]["@RoleCategory"]);

                                                                    }

                                                                }





                                                                // Then we populate this way:
                                                                //var html = 'Current owner(s): xcxcurrentowners';
                                                                //$(requests[i].executiveSummaryElement).find('.current_owners').html(html);


                                                                // Render the Approvers.
                                                                if (workflowUsersAndRolesArrayForDisplay.Approvers.length && (workflowUsersAndRolesArrayForDisplay.Approvers.length > 0)) {

                                                                    html = 'Approver(s):<br />';
                                                                    for (var p = 0; p < workflowUsersAndRolesArrayForDisplay.Approvers.length; p++) {
                                                                        if (p > 0) {
                                                                            html += '<br />';
                                                                        }
                                                                        html += '<span style="color:orange;font-weight:bold;" title="xcx123425346264-1">' + workflowUsersAndRolesArrayForDisplay.Approvers[p].ParticipantFriendlyName + ' (' + workflowUsersAndRolesArrayForDisplay.Approvers[p].RoleId + ')</span>';
                                                                    }
                                                                    var className1 = '.approvers_' + workflow.Steps.Step[k]["@Name"];
                                                                    $(requests[i].executiveSummaryElement).find(className1).html(html);

                                                                }

                                                                // Render the Collaborators.
                                                                if (workflowUsersAndRolesArrayForDisplay.Collaborators.length && (workflowUsersAndRolesArrayForDisplay.Collaborators.length > 0)) {
                                                                    html = 'Collaborator(s):<br />';
                                                                    for (var p = 0; p < workflowUsersAndRolesArrayForDisplay.Collaborators.length; p++) {
                                                                        if (p > 0) {
                                                                            html += '<br />';
                                                                        }
                                                                        html += '<span style="color:orange;font-weight:bold;" title="xcx123425346264-2">' + workflowUsersAndRolesArrayForDisplay.Collaborators[p].ParticipantFriendlyName + ' (' + workflowUsersAndRolesArrayForDisplay.Collaborators[p].RoleId + ')</span>';
                                                                    }
                                                                    var className2 = '.collaborators_' + workflow.Steps.Step[k]["@Name"];
                                                                    $(requests[i].executiveSummaryElement).find(className2).html(html);
                                                                }

                                                                // Render the Informed.
                                                                if (workflowUsersAndRolesArrayForDisplay.Informed.length && (workflowUsersAndRolesArrayForDisplay.Informed.length > 0)) {
                                                                    html = 'Informed:<br />';
                                                                    for (var p = 0; p < workflowUsersAndRolesArrayForDisplay.Informed.length; p++) {
                                                                        if (p > 0) {
                                                                            html += '<br />';
                                                                        }
                                                                        html += '<span style="color:orange;font-weight:bold;" title="xcx123425346264-2">' + workflowUsersAndRolesArrayForDisplay.Informed[p].ParticipantFriendlyName + ' (' + workflowUsersAndRolesArrayForDisplay.Informed[p].RoleId + ')</span>';
                                                                    }
                                                                    var className2 = '.informed_' + workflow.Steps.Step[k]["@Name"];
                                                                    $(requests[i].executiveSummaryElement).find(className2).html(html);
                                                                }

                                                                // Render the user images.
                                                                var imageHtml = '';
                                                                var participantArray1 = [];
                                                                for (var p = 0; p < workflowUsersAndRolesArrayForDisplay.Approvers.length; p++) {

                                                                    if (workflowUsersAndRolesArrayForDisplay.Approvers[p].ParticipantId && !(participantArray1.indexOf(workflowUsersAndRolesArrayForDisplay.Approvers[p].ParticipantId) > -1)) {

                                                                        var userIdString = workflowUsersAndRolesArrayForDisplay.Approvers[p].ParticipantFriendlyName + ' [' + workflowUsersAndRolesArrayForDisplay.Approvers[p].ParticipantEmail + ']';

                                                                        var imgUrl = 'https://shareandcollaborate.com/_files/' + workflowAppId + '/participantimages/' + workflowUsersAndRolesArrayForDisplay.Approvers[p].ParticipantId + '/userimage_50x50px.png?ActiveStateIdentifier=' + JSON.parse(activeStateIdentifier).ActiveStateIdentifier;
                                                                        imageHtml += '<img src="' + imgUrl + '" style="width:75px;" title="' + userIdString + '" alt="' + userIdString + '" onclick="$(\'.bwCircleDialog2\').bwCircleDialog2(\'displayParticipantRoleMultiPickerInACircle\', true, \'\', \'' + workflowUsersAndRolesArrayForDisplay.Approvers[p].ParticipantId + '\', \'' + workflowUsersAndRolesArrayForDisplay.Approvers[p].ParticipantFriendlyName + '\', \'' + workflowUsersAndRolesArrayForDisplay.Approvers[p].ParticipantEmail + '\', \'custom\');event.stopPropagation();" />';
                                                                        participantArray1.push(workflowUsersAndRolesArrayForDisplay.Approvers[p].ParticipantId);

                                                                    }

                                                                }
                                                                for (var p = 0; p < workflowUsersAndRolesArrayForDisplay.Collaborators.length; p++) {

                                                                    if (workflowUsersAndRolesArrayForDisplay.Collaborators[p].ParticipantId && !(participantArray1.indexOf(workflowUsersAndRolesArrayForDisplay.Collaborators[p].ParticipantId) > -1)) {

                                                                        var userIdString = workflowUsersAndRolesArrayForDisplay.Collaborators[p].ParticipantFriendlyName + ' [' + workflowUsersAndRolesArrayForDisplay.Collaborators[p].ParticipantEmail + ']';

                                                                        var imgUrl = 'https://shareandcollaborate.com/_files/' + workflowAppId + '/participantimages/' + workflowUsersAndRolesArrayForDisplay.Collaborators[p].ParticipantId + '/userimage_50x50px.png?ActiveStateIdentifier=' + JSON.parse(activeStateIdentifier).ActiveStateIdentifier;
                                                                        imageHtml += '<img src="' + imgUrl + '" style="width:50px;" title="' + userIdString + '" alt="' + userIdString + '" onclick="$(\'.bwCircleDialog2\').bwCircleDialog2(\'displayParticipantRoleMultiPickerInACircle\', true, \'\', \'' + workflowUsersAndRolesArrayForDisplay.Collaborators[p].ParticipantId + '\', \'' + workflowUsersAndRolesArrayForDisplay.Collaborators[p].ParticipantFriendlyName + '\', \'' + workflowUsersAndRolesArrayForDisplay.Collaborators[p].ParticipantEmail + '\', \'custom\');event.stopPropagation();" />';
                                                                        participantArray1.push(workflowUsersAndRolesArrayForDisplay.Collaborators[p].ParticipantId);

                                                                    }

                                                                }

                                                                var className = '.workflow_step_userimages_' + workflow.Steps.Step[stepIndex1]["@Name"];
                                                                $(requests[i].executiveSummaryElement).find(className).find('div').html(imageHtml);

                                                            }

                                                        }

                                                    }
                                                }
                                            }

                                        }
                                    }

                                }

                                var lastRecordedScrollPosition = thiz.options.lastRecordedScrollPosition;
                                scrollTo({ top: lastRecordedScrollPosition });
                                thiz.options.lastRecordedScrollPosition = 0; // Always reset this to 0 once you use it.
                                console.log('Just called scrollTo(), and set lastRecordedScrollPosition to 0.');

                            } catch (e) {
                                HideActivitySpinner();
                                var msg = 'Exception in bwExecutiveSummariesCarousel2.js.renderExecutiveSummaries_ACTIVE_REQUESTS.get.racirolesandparticipants_arrayversion.success(): ' + e.message + ', ' + e.stack;
                                console.log(msg);
                                displayAlertDialog(msg);
                                //document.getElementById(tagName).innerHTML = '<span style="color:tomato;">Errorxcx9205: ' + e.message + ', ' + e.stack + '</span>';
                            }
                        },
                        error: function (data, errorCode, errorMessage) {
                            HideActivitySpinner();
                            var msg = 'Error in bwExecutiveSummariesCarousel2.js.renderExecutiveSummaries_ACTIVE_REQUESTS.racirolesandparticipants_arrayversion.error(): ' + errorMessage + ', data: ' + JSON.stringify(data);
                            console.log(msg);
                            displayAlertDialog(msg);
                        }
                    });

                    //
                    // end: DO THE BACKFILL HERE.
                    //

                    //
                    //
                    // end: 2-19-2024. IS THIS THE BEST PLACE TO BACKFILL THE EXECUTIVE SUMMARRIES? xcx1231421-5
                    //
                    //

                    //
                    // This is our ellipsis context menu. MIT license and code at: https://swisnl.github.io/jQuery-contextMenu/demo/trigger-custom.html
                    //


                    //$.contextMenu({
                    //    selector: '.context_menu_bwExecutiveSummariesCarousel2_ACTIVE_REQUESTS', // '.context_menu_bwExecutiveSummariesCarousel2_PINNED_REQUESTS',
                    //    callback: function (key, options) {
                    //        if (key == 'NEWEST') {

                    //            console.log('In bwExecutiveSummariesCarousel2(). Setting userSelectedFilterFor_ACTIVE_REQUESTS to NEWEST.');
                    //            $('.context_menu_bwExecutiveSummariesCarousel2_ACTIVE_REQUESTS').html('Sort by: Newest ↑');
                    //            thiz.options.userSelectedFilterFor_ACTIVE_REQUESTS = 'NEWEST';

                    //            alert('Calling renderExecutiveSummaries_ACTIVE_REQUESTS(). xcx213884-2');
                    //            thiz.renderExecutiveSummaries_ACTIVE_REQUESTS();

                    //        } else if (key == 'OLDEST') {

                    //            console.log('In bwExecutiveSummariesCarousel2(). Setting userSelectedFilterFor_ACTIVE_REQUESTS to OLDEST.');
                    //            $('.context_menu_bwExecutiveSummariesCarousel2_ACTIVE_REQUESTS').html('Sort by: Oldest ↑');
                    //            thiz.options.userSelectedFilterFor_ACTIVE_REQUESTS = 'OLDEST';

                    //            alert('Calling renderExecutiveSummaries_ACTIVE_REQUESTS(). xcx213884-3');
                    //            thiz.renderExecutiveSummaries_ACTIVE_REQUESTS();

                    //        } else {
                    //            console.log('Unexpected response. xcx2131241533. key: ' + key);
                    //            displayAlertDialog('Unexpected response. xcx2131241533. key: ' + key);
                    //        }
                    //    },
                    //    items: {
                    //        "NEWEST": { name: "Sort by: Newest ↑", icon: "fa-trash" },
                    //        "OLDEST": { name: "Sort by: Oldest ↑", icon: "fa-trash" }
                    //    }
                    //});
                    //$('.context_menu_bwExecutiveSummariesCarousel2_ACTIVE_REQUESTS').on('click', function (e) {
                    //    e.preventDefault();
                    //    var x = e.clientX;
                    //    var y = e.clientY;
                    //    $('.context_menu_bwExecutiveSummariesCarousel2_ACTIVE_REQUESTS').contextMenu(); //{ x: x, y: y }); // specifying x and y here doesn't work for left click. We need to get the left click position workng at some point but no biggie at this time.
                    //});
                    ////
                    //// End: This is our ellipsis context menu.
                    ////


                    //if (thiz.options.userSelectedFilterFor_ACTIVE_REQUESTS == 'NEWEST') {
                    //    $('.context_menu_bwExecutiveSummariesCarousel2_ACTIVE_REQUESTS').html('Sort by: Newest ↑');
                    //} else if (thiz.options.userSelectedFilterFor_ACTIVE_REQUESTS == 'OLDEST') {
                    //    $('.context_menu_bwExecutiveSummariesCarousel2_ACTIVE_REQUESTS').html('Sort by: Oldest ↑');
                    //} else {
                    //    console.log('Unexpected value for userSelectedFilterFor_ACTIVE_REQUESTS: ' + thiz.options.userSelectedFilterFor_ACTIVE_REQUESTS + '. xcx231243.');
                    //    displayAlertDialog('Unexpected value for userSelectedFilterFor_ACTIVE_REQUESTS: ' + thiz.options.userSelectedFilterFor_ACTIVE_REQUESTS + '. xcx231243.');
                    //}



                }

            }

        } catch (e) {
            console.log('Exception in bwExecutiveSummariesCarousel2.renderExecutiveSummaries_ACTIVE_REQUESTS(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwExecutiveSummariesCarousel2.renderExecutiveSummaries_ACTIVE_REQUESTS(): ' + e.message + ', ' + e.stack);
        }
    },
    renderDetailedList_ACTIVE_REQUESTS: function (dataElement, sortOrder, displaySupplementals) {
        try {
            console.log('In renderDetailedList_ACTIVE_REQUESTS().');
            //alert('In renderDetailedList_ACTIVE_REQUESTS().');

            var bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            localStorage.setItem('bwDisplayFormat', 'DetailedList');

            $('#buttonDisplayRequestsAsTiles_AllActiveRequests').removeClass().addClass('divCarouselButton'); // Unselect the other buttons.
            $('#buttonDisplayRequestsAsDetailedList_AllActiveRequests').removeClass().addClass('divCarouselButton_Selected'); // Select this one.

            var accordionDrawerElement;
            var accordionDrawerElements = $('.bwAccordionDrawer');
            for (var i = 0; i < accordionDrawerElements.length; i++) {
                if ($(accordionDrawerElements[i]).attr('bwaccordiondrawertype') == 'ACTIVE_REQUESTS') {
                    accordionDrawerElement = accordionDrawerElements[i];
                    break;
                }
            }

            $('#divBwExecutiveSummariesCarousel_AllActiveRequests').html('');

            var requestsSummaryDetails = $('.bwAuthentication:first').bwAuthentication('option', 'ACTIVE_REQUESTS');
            var requests = requestsSummaryDetails.docs;

            if (dataElement && sortOrder) {
                // If we get these parameters, then we will sort the data here.
                //displayAlertDialog('In renderDetailedList_ACTIVE_REQUESTS(). Sorting!! dataElement: ' + dataElement + ', sortOrder: ' + sortOrder + ', requests: ' + JSON.stringify(requests));

                if (dataElement == 'Title') {

                    if (sortOrder == 'ascending') {
                        requests.sort(function (a, b) {
                            if (a.Title < b.Title) { return -1; }
                            if (a.Title > b.Title) { return 1; }
                            return 0;
                        });
                    } else if (sortOrder == 'descending') {
                        requests.sort(function (a, b) {
                            if (a.Title < b.Title) { return 1; }
                            if (a.Title > b.Title) { return -1; }
                            return 0;
                        });
                    } else {
                        console.log('Error in renderDetailedList_ACTIVE_REQUESTS().Title. Unexpected value for sortOrder: ' + sortOrder);
                        displayAlertDialog('Error in renderDetailedList_ACTIVE_REQUESTS().Title. Unexpected value for sortOrder: ' + sortOrder);
                    }

                } else if (dataElement == 'ProjectTitle') {

                    if (sortOrder == 'ascending') {
                        requests.sort(function (a, b) {
                            if ((a.ProjectTitle && b.ProjectTitle) && (a.ProjectTitle.toUpperCase() < b.ProjectTitle.toUpperCase())) { return -1; }
                            if ((a.ProjectTitle && b.ProjectTitle) && (a.ProjectTitle.toUpperCase() > b.ProjectTitle.toUpperCase())) { return 1; }
                            return 0;
                        });
                    } else if (sortOrder == 'descending') {
                        requests.sort(function (a, b) {
                            if ((a.ProjectTitle && b.ProjectTitle) && (a.ProjectTitle.toUpperCase() < b.ProjectTitle.toUpperCase())) { return 1; }
                            if ((a.ProjectTitle && b.ProjectTitle) && (a.ProjectTitle.toUpperCase() > b.ProjectTitle.toUpperCase())) { return -1; }
                            return 0;
                        });
                    } else {
                        console.log('Error in renderDetailedList_ACTIVE_REQUESTS().ProjectTitle. Unexpected value for sortOrder: ' + sortOrder);
                        displayAlertDialog('Error in renderDetailedList_ACTIVE_REQUESTS().ProjectTitle. Unexpected value for sortOrder: ' + sortOrder);
                    }

                } else {
                    console.log('Error in renderDetailedList_ACTIVE_REQUESTS(). Unexpected value for dataElement: ' + dataElement);
                    displayAlertDialog('Error in renderDetailedList_ACTIVE_REQUESTS(). Unexpected value for dataElement: ' + dataElement);
                }

            }














            //
            //
            // Adding new paging status, sort bar, and paging UI.
            //
            //

            console.log('xcx2131231. requestsSummaryDetails: ' + Object.keys(requestsSummaryDetails)); // docs,totalDocs,offset,limit,totalPages,page,pagingCounter,hasPrevPage,hasNextPage,prevPage,nextPage.

            var msg = 'requestsSummaryDetails. totalDocs: ' + requestsSummaryDetails.totalDocs + ', offset: ' + requestsSummaryDetails.offset + ', limit: ' + requestsSummaryDetails.limit + ', totalPages: ' + requestsSummaryDetails.totalPages + ', page: ' + requestsSummaryDetails.page + ', pagingCounter: ' + requestsSummaryDetails.pagingCounter + ', hasPrevPage: ' + requestsSummaryDetails.hasPrevPage + ', hasNextPage: ' + requestsSummaryDetails.hasNextPage + ', prevPage: ' + requestsSummaryDetails.prevPage + ', nextPage: ' + requestsSummaryDetails.nextPage;
            console.log(msg);
            //displayAlertDialog(msg);

            var html = '';

            var startDocumentCounter = requestsSummaryDetails.offset + 1; // Because it is zero based.
            var displayTotal = requestsSummaryDetails.page * requestsSummaryDetails.limit;

            if (displayTotal > requestsSummaryDetails.totalDocs) {
                displayTotal = requestsSummaryDetails.totalDocs;
            }

            // renderDetailedList_ACTIVE_REQUESTS
            html += '<div xcx="xcx2131215455-2" id="divBwDataGrid_DocumentCount">Displaying ' + startDocumentCounter + ' to ' + displayTotal + ' of ' + requestsSummaryDetails.totalDocs + ' requests.&nbsp;&nbsp;&nbsp;&nbsp;'; // |<&nbsp;&nbsp;<&nbsp;&nbsp;>&nbsp;&nbsp;>|</div>';

            var limit = this.options.userSelectedFilterFor_ACTIVE_REQUESTS.limit;
            html += `<span>Requests per page: 
                            <select id="selectRequestsPerPage_ACTIVE_REQUESTS" onchange="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'selectRequestsPerPage\', \'ACTIVE_REQUESTS\', this);">`;

            if (limit == 25) {
                html += '<option selected="selected">25</option>';
            } else {
                html += '<option>25</option>';
            }
            if (limit == 50) {
                html += '<option selected="selected">50</option>';
            } else {
                html += '<option>50</option>';
            }
            if (limit == 100) {
                html += '<option selected="selected">100</option>';
            } else {
                html += '<option>100</option>';
            }
            if (limit == 200) {
                html += '<option selected="selected">200</option>';
            } else {
                html += '<option>200</option>';
            }

            html += `   </select>
                        </span>`;
            html += '&nbsp;&nbsp;';
            html += `<div class="datasetNavigationButton" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'navigateRequests\', \'move_to_start\', this);">|<</div>`;
            html += '&nbsp;&nbsp;';
            html += `<div class="datasetNavigationButton" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'navigateRequests\', \'move_to_left\', this);"><</div>`;
            html += '&nbsp;&nbsp;';
            html += `<div class="datasetNavigationButton" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'navigateRequests\', \'move_to_right\', this);">></div>`;
            html += '&nbsp;&nbsp;';
            html += `<div class="datasetNavigationButton" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'navigateRequests\', \'move_to_end\', this);">>|</div>`;

            var displaySupplementals = this.options.userSelectedFilterFor_ACTIVE_REQUESTS.displaySupplementals;
            if (displaySupplementals == true) {
                html += '&nbsp;&nbsp;<input type="checkbox" checked="checked" id="bwExecutiveSummariesCarousel2_DisplaySupplementals_Checkbox" onchange="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'toggleDisplaySupplementals\', this);" />Display Supplementals/Addendums.';
            } else {
                html += '&nbsp;&nbsp;<input type="checkbox" id="bwExecutiveSummariesCarousel2_DisplaySupplementals_Checkbox" onchange="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'toggleDisplaySupplementals\', this);" />Display Supplementals/Addendums.';
            }

            html += '</div>';

            html += '<div id="divBwDataGrid_FilterBar">';
            html += '<table id="dataGridTable2" class="dataGridTable" bwworkflowappid="' + workflowAppId + '" >';

            html += '  <tr class="headerRow">';
            html += '    <td></td>';

            // "Title" column header.
            html += '    <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Title&nbsp;</div>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'Title\', \'descending\', this);">';
            html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'Title\', \'ascending\', this);">';
            html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '   </td>';

            // "Description" column header.
            html += '    <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Description&nbsp;</div>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'ProjectTitle\', \'descending\', this);">';
            html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'ProjectTitle\', \'ascending\', this);">';
            html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '   </td>';

            // "Current Owner(s)" column header. 
            html += '    <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Current Owner(s)&nbsp;</div>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'CurrentOwner\', \'descending\', this);">';
            html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'CurrentOwner\', \'ascending\', this);">';
            html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '   </td>';

            // "Created Date" column header.
            html += '    <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Created Date&nbsp;</div>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'Created\', \'descending\', this);">';
            html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'Created\', \'ascending\', this);">';
            html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '   </td>';

            // "Location" column header.
            html += '   <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Location&nbsp;</div>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'OrgName\', \'ascending\', this);">';
            html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'OrgName\', \'ascending\', this);">';
            html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '   </td>';

            // "Capital Cost" column header. 
            html += '    <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Capital Cost&nbsp;</div>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'RequestedCapital\', \'descending\', this);">';
            html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'RequestedCapital\', \'ascending\', this);">';
            html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '   </td>';

            // "Modified Date" column header. 
            html += '    <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Modified Date&nbsp;</div>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'Modified\', \'descending\', this);">';
            html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'Modified\', \'ascending\', this);">';
            html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '   </td>';

            html += '    <td></td>';
            html += '  </tr>';

            html += '</table>';

            html += '</div>';

            $(accordionDrawerElement).append(html); //   $('#divBwExecutiveSummariesCarousel_AllActiveRequests').html(html);

            //
            //
            // end: Adding new paging status, sort bar, and paging UI.
            //
            //























            //var serverside = false;
            //var deferredIndex = this.options.deferredIndex;
            //var invitationData = null;

            var html = '';

            html += '<div id="divDataGridTable" style="overflow-y: scroll;" onscroll="$(\'.bwDataGrid\').bwDataGrid(\'dataGrid_OnScroll\', this, \'' + 'bwRequestTypeId' + '\');">'; // Commented out bwRequestTypeId.. not sure why it is here... 4-22-2022

            html += '<table id="dataGridTable" class="dataGridTable" bwworkflowappid="' + workflowAppId + '">';

            html += '  <tr class="headerRow">';
            html += '    <td></td>';

            // "Title" column header.
            html += '    <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Request Id&nbsp;</div>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_ACTIVE_REQUESTS\', \'Title\', \'descending\', this);">';
            html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_ACTIVE_REQUESTS\', \'Title\', \'ascending\', this);">';
            html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '   </td>';

            // "Days Overdue" column header.
            html += '   <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Status&nbsp;</div>';
            //html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_ACTIVE_REQUESTS\', \'OrgName\', \'descending\', this);">'; // no value for this column yet
            //html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
            //html += '       </span>';
            //html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_ACTIVE_REQUESTS\', \'OrgName\', \'ascending\', this);">';
            //html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
            //html += '       </span>';
            html += '   </td>';

            // "Description" column header.
            html += '    <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Description&nbsp;</div>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_ACTIVE_REQUESTS\', \'ProjectTitle\', \'descending\', this);">';
            html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_ACTIVE_REQUESTS\', \'ProjectTitle\', \'ascending\', this);">';
            html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '   </td>';

            // "Capital Cost" column header. 
            html += '    <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Capital Cost&nbsp;</div>';
            //html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_ACTIVE_REQUESTS\', \'RequestedCapital\', \'descending\', this);">';
            ////var requestedCapital = brData.PendingBudgetRequests[i].RequestedCapital;
            ////var requestedExpense = brData.PendingBudgetRequests[i].RequestedExpense;
            //// currentAmount = Number(requestedCapital) + Number(requestedExpense);
            //html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
            //html += '       </span>';
            //html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_ACTIVE_REQUESTS\', \'RequestedCapital\', \'ascending\', this);">';
            //html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
            //html += '       </span>';
            html += '   </td>';

            // "Role" column header.
            html += '    <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Your role&nbsp;</div>';
            //html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_ACTIVE_REQUESTS\', \'ProjectTitle\', \'descending\', this);">'; // no value for this column yet
            //html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
            //html += '       </span>';
            //html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_ACTIVE_REQUESTS\', \'ProjectTitle\', \'ascending\', this);">';
            //html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
            //html += '       </span>';
            html += '   </td>';

            html += '    <td></td>';

            html += '  </tr>';

            html += '  <tr class="filterRow">';

            // Title
            html += '    <td></td>';

            // Days overdue
            html += '    <td></td>';

            // Description
            //html += '    <td style="white-space:nowrap;"><span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="alert(\'Order ascending...\');">☝</span><span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="alert(\'Order descending...\');">☟</span></td>';
            html += '    <td style="white-space:nowrap;">';

            html += '   </td>';

            // Requested Capital
            html += '   <td style="white-space:nowrap;">';
            //html += '       <input type="text" id="txtArchivePageDescriptionFilter" class="archivePageFilterBox" title="Type here to limit search results, using * as a wildcard character."/>';
            html += '   </td>';

            // Role
            html += '   <td style="white-space:nowrap;">';
            //html += '       <input type="text" id="txtArchivePageDescriptionFilter" class="archivePageFilterBox" title="Type here to limit search results, using * as a wildcard character."/>';
            html += '   </td>';

            html += '  </tr>';

            var alternatingRow = 'light'; // Use this to color the rows.
            for (var i = 0; i < requests.length; i++) {
                var budgetRequestId = requests[i].bwBudgetRequestId;
                var brTitle = requests[i].ProjectTitle;
                var title = requests[i].Title;
                var budgetAmount = requests[i].BudgetAmount;
                var requestedCapital = requests[i].RequestedCapital;
                var requestedExpense = requests[i].RequestedExpense;

                var arName = requests[i].ProjectTitle;

                var appWebUrl = $('.bwAuthentication').bwAuthentication('option', 'operationUriPrefix'); //'https://budgetworkflow.com';

                var orgId = requests[i].OrgId;
                var orgName = requests[i].OrgName;

                var currentAmount = 0;
                if (budgetAmount == 'null') {
                    currentAmount = Number(requestedCapital) + Number(requestedExpense);
                } else {
                    currentAmount = budgetAmount;
                }

                if (alternatingRow == 'light') {
                    html += '<tr class="alternatingRowLight" style="cursor:pointer;" ';
                    html += '>';
                    alternatingRow = 'dark';
                } else {
                    //html += '  <tr class="alternatingRowDark" style="cursor:pointer;" onmouseover="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'showRowHoverDetails\', \'' + budgetRequests[i].Title + '\', \'' + budgetRequests[i].ProjectTitle + '\', \'' + JSON.parse(budgetRequests[i].bwRequestJson).BriefDescriptionOfProject + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\', \'' + budgetRequests[i].OrgId + '\', \'' + budgetRequests[i].OrgName + '\');"  >';
                    html += '<tr class="alternatingRowDark" style="cursor:pointer;" ';
                    html += '>';
                    alternatingRow = 'light';
                }

                // Extract the bwJustificationDetailsField, if it exists, from the bwRequestJson.
                var bwJustificationDetailsField = '';
                if (requests[i].bwRequestJson) {
                    var bwRequestJson = requests[i].bwRequestJson;
                    var json2 = JSON.parse(bwRequestJson);
                    if (json2.bwJustificationDetailsField && json2.bwJustificationDetailsField.value) {
                        bwJustificationDetailsField = json2.bwJustificationDetailsField.value;
                    }
                }

                // Magnifying glass.
                html += '   <td style="padding:15px;" ';


                // bwEncodeURIComponent(JSON.stringify(budgetRequests[i]))
                html += '      onmouseenter="$(\'.bwCoreComponent:first\').bwCoreComponent(\'showRowHoverDetails\', \'' + bwEncodeURIComponent(JSON.stringify(requests[i])) + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                //html += '      onmouseenter="$(\'.bwCoreComponent:first\').bwCoreComponent(\'showRowHoverDetails\', \'' + encodeURI(JSON.stringify(requests[i])) + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';

                html += '       onmouseleave="$(\'.bwCoreComponent:first\').bwCoreComponent(\'hideRowHoverDetails\');this.style.backgroundColor=\'white\';"';
                html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + bwEncodeURIComponent(arName) + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\', \'' + '' + '\', \'' + budgetRequestId + '\');" ';
                html += '   ><img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg"></td>';

                // Title
                html += '<td style="padding:15px;" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com/\', \'' + budgetRequestId + '\', \'' + title + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');">';
                html += title;
                html += '</td>';

                // Days overdue.
                html += '       <td style="padding:15px;" ';
                //html += '       onmouseenter="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'showRowHoverDetails\', \'' + title + '\', \'' + brTitle + '\', \'' + brTitle + '\', \'' + bwWorkflowAppId + '\', \'' + budgetRequestId + '\', \'' + orgId + '\', \'' + orgName + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                //html += '       onmouseleave="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'hideRowHoverDetails\');this.style.backgroundColor=\'white\';"';
                html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + title + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');" ';
                html += '>';
                html += '           <div style="display:inline-block;" bwtrace="xcx778451">';
                //if (daysSinceTaskCreated == 1) {
                //    html += '           &nbsp;&nbsp;This task is ' + daysSinceTaskCreated.toString() + ' day old.&nbsp;&nbsp;';
                //} else {
                //    html += '           &nbsp;&nbsp;This task is ' + daysSinceTaskCreated.toString() + ' days old.&nbsp;&nbsp;';
                //}
                html += '           </div>';
                html += '       </td>';

                // Description
                html += '<td style="padding:15px;" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com/\', \'' + budgetRequestId + '\', \'' + title + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');">';
                html += brTitle;
                html += '</td>';

                // Capital Cost
                html += '<td style="padding:15px;text-align:right;" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com/\', \'' + budgetRequestId + '\', \'' + title + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');">';
                html += formatCurrency(currentAmount);
                html += '</td>';

                // Role
                html += '<td style="padding:15px;" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com/\', \'' + budgetRequestId + '\', \'' + title + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');">';
                //html += '[(' + bwAssignedToRaciRoleAbbreviation + ') ' + bwAssignedToRaciRoleName + ']';
                html += '</td>';


                // KEEP THIS HERE FOR when we resurrect RECURRING_EXPENSE_NOTIFICATION_TASK <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                //var functionalAreaId = taskData[i].FinancialAreaId; // Find the functional area name.
                //var functionalAreaName = '';
                //try {
                //    if (BWMData[0]) {
                //        for (var x = 0; x < BWMData[0].length; x++) {
                //            if (BWMData[0][x][0] = bwWorkflowAppId) { // We have the correct workflow!
                //                for (var fai = 0; fai < BWMData[0][x][4].length; fai++) {
                //                    if (functionalAreaId == BWMData[0][x][4][fai][0]) {
                //                        functionalAreaName = BWMData[0][x][4][fai][1];
                //                    }
                //                }
                //            }
                //        }
                //    }
                //} catch (e) {
                //}
                //if (taskType == 'RECURRING_EXPENSE_NOTIFICATION_TASK') {
                //    html += '       <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;" colspan="5">';
                //    html += '           <div style="display:inline-block;">';
                //    html += '               <a style="cursor:pointer;" onclick="displayRecurringExpenseOnTheHomePage(\'' + budgetRequestId + '\', \'' + participantId + '\', \'' + title + '\');" target="_blank" title="Click to view the recurring expense...">' + daysSinceTaskCreated.toString() + ' days overduexcx1: Recurring expense <em>(' + brTitle + ' - ' + functionalAreaName + ') is due to be submitted</em></a>';
                //    html += '           </div>';
                //    html += '       </td>';
                //} else if (taskType == 'BUDGET_REQUEST_WORKFLOW_TASK') {
                //    html += '       <td style="width:45px;"></td>';
                //    html += '       <td style="background-color:white;" ';
                //    html += '           onmouseenter="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'showRowHoverDetails\', \'' + title + '\', \'' + brTitle + '\', \'' + '' + '\', \'' + bwWorkflowAppId + '\', \'' + budgetRequestId + '\', \'' + orgId + '\', \'' + orgName + '\', this);" ';
                //    html += '           onmouseleave="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'hideRowHoverDetails\');" ';
                //    html += '>';
                //    html += '           <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="' + imageRootPath + '/images/zoom.jpg" />';
                //    html += '       </td>';

                //    html += '       <td colspan="3" style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" ';
                //    html += '           onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';bwCommonScripts.highlightExecutiveSummaryForRequest(\'' + budgetRequestId + '\');" ';
                //    html += '           onmouseleave="this.style.backgroundColor=\'#d8d8d8\';bwCommonScripts.unHighlightExecutiveSummaryForRequest(\'' + budgetRequestId + '\');"  ';
                //    html += '           onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\', \'' + bwAssignedToRaciRoleAbbreviation + '\', \'' + bwWorkflowTaskItemId + '\');" ';
                //    html += '>';
                //    html += '           <div style="display:inline-block;" bwtrace="xcx778451">';
                //    if (daysSinceTaskCreated == 1) {
                //        html += '           &nbsp;&nbsp;' + daysSinceTaskCreated.toString() + ' day overduexcx1: ';
                //    } else {
                //        html += '           &nbsp;&nbsp;' + daysSinceTaskCreated.toString() + ' days overduexcx2: ';
                //    }
                //    html += '               <em>';
                //    html += title + ' - ' + brTitle + ' - ' + formatCurrency(currentAmount) + ' - ' + functionalAreaName + ' ' + '[(' + bwAssignedToRaciRoleAbbreviation + ') ' + bwAssignedToRaciRoleName + ']';
                //    html += '               </em>';
                //    html += '           </div>';
                //    html += '       </td>';

                //} else {
                //    html += '       <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;" colspan="5">UNKNOWN TASK TYPE</td>';
                //}

                html += '       </tr>';

            }
            html += '       </tbody></table>';

            //$('#divBwExecutiveSummariesCarousel_AllActiveRequests').html(html);
            $(accordionDrawerElement).append(html);

        } catch (e) {
            console.log('Exception in renderDetailedList_ACTIVE_REQUESTS():1335-1: ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderDetailedList_ACTIVE_REQUESTS():1335-1: ' + e.message + ', ' + e.stack);
            var result = {
                html: 'Exception in renderDetailedList_ACTIVE_REQUESTS():1335-1: ' + e.message + ', ' + e.stack
            }
            return result;
        }
    },




    renderExecutiveSummaries_SOCIAL_NETWORK: function (spinnerText) {
        try {
            console.log('In bwExecutiveSummariesCarousel2.renderExecutiveSummaries_SOCIAL_NETWORK().');
            //displayAlertDialog('In bwExecutiveSummariesCarousel2.renderExecutiveSummaries_SOCIAL_NETWORK().');
            var thiz = this;

            localStorage.setItem('bwDisplayFormat', 'ExecutiveSummaries');

            $('#buttonDisplayRequestsAsDetailedList_MyPendingTasks').removeClass().addClass('divCarouselButton'); // Unselect the other button.
            $('#buttonDisplayRequestsAsTiles_MyPendingTasks').removeClass().addClass('divCarouselButton_Selected'); // Select this one. 

            var accordionDrawerElement;
            var accordionDrawerElements = $('.bwAccordionDrawer');
            for (var i = 0; i < accordionDrawerElements.length; i++) {
                if ($(accordionDrawerElements[i]).attr('bwaccordiondrawertype') == 'SOCIAL_NETWORK') {
                    accordionDrawerElement = accordionDrawerElements[i];
                    break;
                }
            }

            var mySocialNetwork = $('.bwAuthentication:first').bwAuthentication('option', 'SOCIAL_NETWORK');

            if (!mySocialNetwork) {

                var msg = 'Error in bwExecutiveSummariesCarousel2.js.renderExecutiveSummaries_SOCIAL_NETWORK(). No data loaded for mySocialNetwork.';

                console.log(msg);
                alert(msg);

            } else {

                $(accordionDrawerElement).html('');

                var elementId = $(accordionDrawerElement).attr('id');
                document.getElementById(elementId).style.display = 'inline';

                //
                // HERE IS WHERE WE SORT THE SOCIAL_NETWORK. // thiz.options.userSelectedFilterFor_SOCIAL_NETWORK // NEWEST, OLDEST.
                //
                console.log('HERE IS WHERE WE SORT THE SOCIAL_NETWORK by Created date. mySocialNetwork[0].Created: ' + JSON.stringify(mySocialNetwork[0].Created + ', userSelectedFilterFor_SOCIAL_NETWORK: ' + thiz.options.userSelectedFilterFor_SOCIAL_NETWORK));

                if (thiz.options.userSelectedFilterFor_SOCIAL_NETWORK == 'NEWEST') { // Created ascending.
                    mySocialNetwork.sort(function (a, b) {
                        if (a.Created < b.Created) { return 1; }
                        if (a.Created > b.Created) { return -1; }
                        return 0;
                    });
                } else if (thiz.options.userSelectedFilterFor_SOCIAL_NETWORK == 'OLDEST') { // Created descending.
                    mySocialNetwork.sort(function (a, b) {
                        if (a.Created < b.Created) { return -1; }
                        if (a.Created > b.Created) { return 1; }
                        return 0;
                    });
                } else {
                    console.log('Unexpected value for userSelectedFilterFor_SOCIAL_NETWORK: ' + thiz.options.userSelectedFilterFor_SOCIAL_NETWORK);
                    displayAlertDialog('Unexpected value for userSelectedFilterFor_SOCIAL_NETWORK: ' + thiz.options.userSelectedFilterFor_SOCIAL_NETWORK);
                }






















                var carouselItemIndex = 0;
                for (var i = (mySocialNetwork.length - 1); i > -1; i--) { // This loop goes backwards...
                    if (carouselItemIndex < 100) { // This is where we set how many tasks we will display in the carousel. Zero-based, so < 5 means display 5 tasks.

                        var ProjectTitle_clean = String(mySocialNetwork[i].ProjectTitle).replace(/["]/g, '&quot;').replace(/[']/g, '\\&#39;'); //&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method.
                        var title = 'Executive Summary for: ' + mySocialNetwork[i].Title + '. ' + ProjectTitle_clean;

                        var executiveSummaryElement = document.createElement('div');
                        executiveSummaryElement.classList.add('executiveSummaryInCarousel');
                        executiveSummaryElement.setAttribute('bwbudgetrequestid', mySocialNetwork[i].bwBudgetRequestId);
                        executiveSummaryElement.title = title;
                        executiveSummaryElement.alt = title;
                        executiveSummaryElement.style.minWidth = '300px';
                        executiveSummaryElement.style.maxWidth = '550px';
                        executiveSummaryElement.style.display = 'inline-block';
                        executiveSummaryElement.style.whiteSpace = 'nowrap';
                        executiveSummaryElement.style.color = 'rgb(38, 38, 38)';
                        executiveSummaryElement.style.fontFamily = '"Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif';
                        executiveSummaryElement.style.fontSize = '1.25em';

                        //executiveSummaryElement.setAttribute('onclick', '$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'\', \'' + mySocialNetwork[i].bwRelatedItemId + '\', \'' + mySocialNetwork[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + mySocialNetwork[i].Title + '\', \'' + mySocialNetwork[i].bwAssignedToRaciRoleAbbreviation + '\', \'' + '7777xcx7777777-324-3' + '\');');
                        executiveSummaryElement.setAttribute('onclick', '$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'\', \'' + mySocialNetwork[i].bwBudgetRequestId + '\', \'' + mySocialNetwork[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + mySocialNetwork[i].Title + '\', \'' + mySocialNetwork[i].bwAssignedToRaciRoleAbbreviation + '\', \'' + '7777xcx7777777-324-3' + '\');');

                        $(accordionDrawerElement).append(executiveSummaryElement);

                        console.log('Calling renderExecutiveSummaryForRequest(). xcx332-6-5');
                        //alert('Calling renderExecutiveSummaryForRequest(). xcx332-6-5');
                        var promise = this.renderExecutiveSummaryForRequest(mySocialNetwork[i], executiveSummaryElement);
                        promise.then(function (result) {
                            // Do nothing.
                        }).catch(function (e) {
                            alert('Exception xcx33995-1: ' + JSON.stringify(e));
                        });

                        carouselItemIndex += 1;

                    } else {
                        break;
                    }
                }

                //
                //
                // 2-19-2024. IS THIS THE BEST PLACE TO BACKFILL THE EXECUTIVE SUMMARRIES? xcx1231421-6
                //
                //

                console.log('2-19-2024. IS THIS THE BEST PLACE TO BACKFILL THE EXECUTIVE SUMMARRIES? xcx1231421-6');







                //
                // This is our ellipsis context menu. MIT license and code at: https://swisnl.github.io/jQuery-contextMenu/demo/trigger-custom.html
                //


                $.contextMenu({
                    selector: '.context_menu_bwExecutiveSummariesCarousel2_SOCIAL_NETWORK', // '.context_menu_bwExecutiveSummariesCarousel2_PINNED_REQUESTS',
                    callback: function (key, options) {
                        if (key == 'NEWEST') {

                            console.log('In bwExecutiveSummariesCarousel2(). Setting userSelectedFilterFor_SOCIAL_NETWORK to NEWEST.');
                            $('.context_menu_bwExecutiveSummariesCarousel2_SOCIAL_NETWORK').html('Sort by: Newest ↑');
                            thiz.options.userSelectedFilterFor_SOCIAL_NETWORK = 'NEWEST';
                            thiz.renderExecutiveSummaries_SOCIAL_NETWORK();

                        } else if (key == 'OLDEST') {

                            console.log('In bwExecutiveSummariesCarousel2(). Setting userSelectedFilterFor_SOCIAL_NETWORK to OLDEST.');
                            $('.context_menu_bwExecutiveSummariesCarousel2_SOCIAL_NETWORK').html('Sort by: Oldest ↑');
                            thiz.options.userSelectedFilterFor_SOCIAL_NETWORK = 'OLDEST';
                            thiz.renderExecutiveSummaries_SOCIAL_NETWORK();

                        } else {
                            console.log('Unexpected response. xcx2131241533. key: ' + key);
                            displayAlertDialog('Unexpected response. xcx2131241533. key: ' + key);
                        }
                    },
                    items: {
                        "NEWEST": { name: "Sort by: Newest ↑", icon: "fa-trash" },
                        "OLDEST": { name: "Sort by: Oldest ↑", icon: "fa-trash" }
                    }
                });
                $('.context_menu_bwExecutiveSummariesCarousel2_SOCIAL_NETWORK').on('click', function (e) {
                    e.preventDefault();
                    var x = e.clientX;
                    var y = e.clientY;
                    $('.context_menu_bwExecutiveSummariesCarousel2_SOCIAL_NETWORK').contextMenu(); //{ x: x, y: y }); // specifying x and y here doesn't work for left click. We need to get the left click position workng at some point but no biggie at this time.
                });
                //
                // End: This is our ellipsis context menu.
                //


                if (thiz.options.userSelectedFilterFor_SOCIAL_NETWORK == 'NEWEST') {
                    $('.context_menu_bwExecutiveSummariesCarousel2_SOCIAL_NETWORK').html('Sort by: Newest ↑');
                } else if (thiz.options.userSelectedFilterFor_SOCIAL_NETWORK == 'OLDEST') {
                    $('.context_menu_bwExecutiveSummariesCarousel2_SOCIAL_NETWORK').html('Sort by: Oldest ↑');
                } else {
                    console.log('Unexpected value for userSelectedFilterFor_SOCIAL_NETWORK: ' + thiz.options.userSelectedFilterFor_SOCIAL_NETWORK + '. xcx231243.');
                    displayAlertDialog('Unexpected value for userSelectedFilterFor_SOCIAL_NETWORK: ' + thiz.options.userSelectedFilterFor_SOCIAL_NETWORK + '. xcx231243.');
                }


            }

        } catch (e) {
            console.log('Exception in bwExecutiveSummariesCarousel2.renderExecutiveSummaries_SOCIAL_NETWORK(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwExecutiveSummariesCarousel2.renderExecutiveSummaries_SOCIAL_NETWORK(): ' + e.message + ', ' + e.stack);
        }
    },


    renderExecutiveSummaries_MySubmittedRequests: function (spinnerText) {
        try {
            console.log('In bwExecutiveSummariesCarousel2.renderExecutiveSummaries_MySubmittedRequests().');
            var thiz = this;

            localStorage.setItem('bwDisplayFormat', 'ExecutiveSummaries');

            $('#buttonDisplayRequestsAsDetailedList_MySubmittedRequests').removeClass().addClass('divCarouselButton'); // Unselect the other buttons.
            $('#buttonDisplayRequestsAsTiles_MySubmittedRequests').removeClass().addClass('divCarouselButton_Selected'); // Select this one. 

            var accordionDrawerElement;
            var accordionDrawerElements = $('.bwAccordionDrawer');
            for (var i = 0; i < accordionDrawerElements.length; i++) {
                if ($(accordionDrawerElements[i]).attr('bwaccordiondrawertype') == 'MY_SUBMITTED_REQUESTS') {
                    accordionDrawerElement = accordionDrawerElements[i];
                    break;
                }
            }

            if (!this.options.myUnsubmittedRequests) {







                alert('NO DATA LOADED for options.myUnsubmittedRequests.');





            } else {

                $(accordionDrawerElement).html('');

                var elementId = $(accordionDrawerElement).attr('id');
                if (!document.getElementById(elementId)) {
                    displayAlertDialog('xcx333335-1. Could not find elementId: ' + elementId);
                } else {
                    document.getElementById(elementId).style.display = 'inline';
                }


                var rowElement = $(accordionDrawerElement).closest('table').closest('tr');
                var rowElementId = $(rowElement).attr('id');
                if (!document.getElementById(elementId)) {
                    displayAlertDialog('xcx333335-2. Could not find elementId: ' + elementId);
                } else {
                    document.getElementById(rowElementId).style.display = 'none';
                }

                //var titleElement = $(rowElement).prev().find('.bwAccordionDrawerTitle');
                //$(titleElement).html('You have submitted ' + this.options.myBrData.MyRequests.length + ' requests.');


                var imageId = 'alertSectionImage_0_4';
                var imageRootPath = globalUrlPrefix + globalUrl;

                var titleElement = $(rowElement).prev().find('.bwAccordionDrawerTitle').closest('td');
                var title;
                if (this.options.myBrData.MyRequests.length > 0) {
                    if (this.options.myBrData.MyRequests.length == 1) {
                        title = '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
                    } else {
                        title = '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;float:none;" src="' + imageRootPath + '/images/drawer-open.png">';
                    }
                }
                title += '<span class="bwNoUserSelect bwAccordionDrawerTitle">&nbsp;You have submitted ' + this.options.myBrData.MyRequests.length + ' requests.</span>';
                $(titleElement).html(title);




                var carouselItemIndex = 0;
                for (var i = 0; i < this.options.myBrData.MyRequests.length; i++) {
                    if (carouselItemIndex < 100) { // This is where we set how many tasks we will display in the carousel. Zero-based, so < 5 means display 5 tasks.

                        // class="bwAccordionDrawer bwFunctionalAreaRow" bwaccordiondrawertype="OFFLINE_REQUESTS" // MY_UNSUBMITTED_REQUESTS, ACTIVE_REQUESTS, MY_SUBMITTED_REQUESTS, MY_PENDING_TASKS, OFFLINE_REQUESTS

                        //alert('this.options.myBrData.MyRequests.BudgetWorkflowStatus: ' + this.options.myBrData.MyRequests[i].BudgetWorkflowStatus);

                        if (!this.options.myBrData.MyRequests[i].BudgetWorkflowStatus) {

                            console.log('Error in renderExecutiveSummaries_MySubmittedRequests(). Unexpected value for BudgetWorkflowStatus: ' + this.options.myBrData.MyRequests[i].BudgetWorkflowStatus + ', Title: ' + this.options.myBrData.MyRequests[i].Title + ', bwBudgetRequestId: ' + this.options.myBrData.MyRequests[i].bwBudgetRequestId);
                            displayAlertDialog('Error in renderExecutiveSummaries_MySubmittedRequests(). Unexpected value for BudgetWorkflowStatus: ' + this.options.myBrData.MyRequests[i].BudgetWorkflowStatus + ', Title: ' + this.options.myBrData.MyRequests[i].Title + ', bwBudgetRequestId: ' + this.options.myBrData.MyRequests[i].bwBudgetRequestId);

                        } else if (this.options.myBrData.MyRequests[i].BudgetWorkflowStatus != 'NOT_SUBMITTED') {

                            // If it has not been submitted, then skip this one. We are only displaying requests which are (or have been) a part of the workflow.
                            //var carouselItem_Id = 'bwExecutiveSummariesCarousel2_executiveSummaryInCarousel_' + carouselItemIndex;

                            //var html = '';














                            ////displayAlertDialog('xcx324235 this.options.myBrData.MyRequests[i]: ' + JSON.stringify(this.options.myBrData.MyRequests[i]));

                            //html += '   <div id="' + carouselItem_Id + '" title="xcx231466534-5" alt="xcx231466534-5" class="executiveSummaryInCarousel" bwbudgetrequestid="' + this.options.myBrData.MyRequests[i].bwBudgetRequestId + '" style="min-width:300px;max-width:550px;display:inline-block;white-space:nowrap;color: rgb(38, 38, 38); font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif; font-size: 1.25em;" ';
                            //var ProjectTitle_clean = String(this.options.myBrData.MyRequests[i].ProjectTitle).replace(/["]/g, '&quot;').replace(/[']/g, '\\&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method.
                            //html += '   xcx="342523326-6"    onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'' + this.options.myBrData.MyRequests[i].bwBudgetRequestId + '\', \'' + this.options.myBrData.MyRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + this.options.myBrData.MyRequests[i].Title + '\', \'' + this.options.myBrData.MyRequests[i].bwAssignedToRaciRoleAbbreviation + '\', \'';
                            //html += 'xcx_bwWorkflowTaskItemId_novaluexcx12312' + '\');" ';
                            //html += '   >';

                            //html += '</div>';

                            ////$('#divBwExecutiveSummariesCarousel_MySubmittedRequests').append(html);
                            //$(accordionDrawerElement).append(html);



                            var title = 'Executive Summary for: ' + this.options.myBrData.MyRequests[i].Title + '. ' + ProjectTitle_clean;

                            var executiveSummaryElement = document.createElement('div');
                            //executiveSummaryElement.id = carouselItem_Id;
                            executiveSummaryElement.classList.add('executiveSummaryInCarousel');
                            executiveSummaryElement.setAttribute('bwbudgetrequestid', this.options.myBrData.MyRequests[i].bwBudgetRequestId);
                            executiveSummaryElement.title = title;
                            executiveSummaryElement.alt = title;
                            executiveSummaryElement.style.minWidth = '300px';
                            executiveSummaryElement.style.maxWidth = '550px';
                            executiveSummaryElement.style.display = 'inline-block';
                            executiveSummaryElement.style.whiteSpace = 'nowrap';
                            executiveSummaryElement.style.color = 'rgb(38, 38, 38)';
                            executiveSummaryElement.style.fontFamily = '"Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif';
                            executiveSummaryElement.style.fontSize = '1.25em';

                            var ProjectTitle_clean = String(this.options.myBrData.MyRequests[i].ProjectTitle).replace(/["]/g, '&quot;').replace(/[']/g, '\\&#39;'); //&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method.
                            executiveSummaryElement.setAttribute('onclick', '$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'' + this.options.myBrData.MyRequests[i].bwBudgetRequestId + '\', \'' + this.options.myBrData.MyRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + this.options.myBrData.MyRequests[i].Title + '\', \'' + this.options.myBrData.MyRequests[i].bwAssignedToRaciRoleAbbreviation + '\', \'' + '7777xcx7777777-3244422-5' + '\');');

                            $(accordionDrawerElement).append(executiveSummaryElement);


                            console.log('Calling renderExecutiveSummaryForRequest(). xcx332-8');
                            alert('Calling renderExecutiveSummaryForRequest(). xcx332-8');
                            var promise = this.renderExecutiveSummaryForRequest(this.options.myBrData.MyRequests[i], executiveSummaryElement); //'divBwExecutiveSummariesCarousel_MySubmittedRequests');
                            promise.then(function (result) {
                                // Do nothing.
                            }).catch(function (e) {
                                alert('Exception xcx33995-3: ' + e);
                            });

                            carouselItemIndex += 1;















                        }
                    } else {
                        break;
                    }
                }

                //
                //
                // 2-19-2024. IS THIS THE BEST PLACE TO BACKFILL THE EXECUTIVE SUMMARRIES? xcx1231421-8
                //
                //

                alert('2-19-2024. IS THIS THE BEST PLACE TO BACKFILL THE EXECUTIVE SUMMARRIES? xcx1231421-8');






            }



            //console.log('In bwExecutiveSummariesCarousel2.renderExecutiveSummaries_MySubmittedRequests().');
            //localStorage.setItem('bwDisplayFormat', 'ExecutiveSummaries');

            //$('#buttonDisplayRequestsAsDetailedList_MySubmittedRequests').removeClass().addClass('divCarouselButton'); // Unselect the other buttons.
            //$('#buttonDisplayRequestsAsTiles_MySubmittedRequests').removeClass().addClass('divCarouselButton_Selected'); // Select this one. 

            //$('#divBwExecutiveSummariesCarousel_MySubmittedRequests').html('');

            //var thiz = this;

            //// debugger;
            //var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            //var requestTypes = $('.bwAuthentication').bwAuthentication('option', 'bwEnabledRequestTypes').EnabledItems;

            //var carouselItemIndex = 0;
            ////for (var i = (this.options.taskData.length - 1) ; i > -1; i--) {
            ////alert('this.options.myBrData.MyRequests.length: ' + this.options.myBrData.MyRequests.length);
            //for (var i = 0; i < this.options.myBrData.MyRequests.length; i++) {
            //    if (carouselItemIndex < 100) { // This is where we set how many tasks we will display in the carousel. Zero-based, so < 5 means display 5 tasks.

            //        var bwBudgetRequestId = this.options.myBrData.MyRequests[i].bwBudgetRequestId;
            //        //var bwWorkflowTaskItemId = this.options.taskData[i].bwWorkflowTaskItemId;

            //        var carouselItem_Id = 'bwExecutiveSummariesCarousel2_executiveSummaryInCarousel_' + carouselItemIndex;

            //        var html = '';

            //        html += '   <div id="' + carouselItem_Id + '" class="executiveSummaryInCarousel" bwbudgetrequestid="' + bwBudgetRequestId + '" style="min-width:300px;display:inline-block;white-space:nowrap;color: rgb(38, 38, 38); font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif; font-size: 1.25em;" ';
            //        //this.carouselItem_AddOnClick(carouselItem_Id, bwBudgetRequestId, this.options.taskData[i].Title, this.options.taskData[i].ProjectTitle, this.options.taskData[i].bwAssignedToRaciRoleAbbreviation, bwWorkflowTaskItemId);
            //        var ProjectTitle_clean = this.options.myBrData.MyRequests[i].ProjectTitle.replace(/["]/g, '&quot;').replace(/[']/g, '\\&#39;'); //&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method. 
            //        html += '   xcx="342523326"    onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'' + bwBudgetRequestId + '\', \'' + this.options.myBrData.MyRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + this.options.myBrData.MyRequests[i].Title + '\', \'' + this.options.myBrData.MyRequests[i].bwAssignedToRaciRoleAbbreviation + '\', \'' + bwBudgetRequestId + '\');" ';
            //        html += '   >';



            //        html += '<br />';

            //        html += '   <span style="font-size:12pt;"><span style="color:black;font-size:18pt;font-weight:bold;">' + this.options.myBrData.MyRequests[i].Title + '</span></span>';
            //        html += '   <br />';
            //        html += '   <span style="color:black;font-size:18pt;font-weight:bold;">' + this.options.myBrData.MyRequests[i].ProjectTitle + '</span>';
            //        html += '   <br />';
            //        html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Requested by: ' + this.options.myBrData.MyRequests[i].CreatedBy + '</span>';
            //        html += '   <br />';
            //        var RequestedCapital_cleaned = $('.bwAuthentication').bwAuthentication('getBudgetWorkflowStandardizedCurrency', this.options.myBrData.MyRequests[i].RequestedCapital);
            //        html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Requested capital: <span style="color:purple;font-size:18pt;">' + RequestedCapital_cleaned + '</span></span>';
            //        html += '   <br />';
            //        var timestamp4;
            //        var requestCreatedDate;
            //        requestCreatedDate = this.options.myBrData.MyRequests[i].Created;
            //        if (requestCreatedDate) {
            //            timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(requestCreatedDate);
            //        } else {
            //            timestamp4 = '[not available]';
            //        }
            //        html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Request created: ' + timestamp4 + '</span>';
            //        html += '   <br />';
            //        html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Org: <span style="">' + this.options.myBrData.MyRequests[i].OrgName + '</span></span>';
            //        html += '   <br />';
            //        html += '   <br />';

            //        html += '   <div id="bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_MySubmittedRequests_' + bwBudgetRequestId + '" style="text-align: center;"></div>';



            //        html += '   <hr style="color:skyblue;" />';

            //        if (this.options.myBrData.MyRequests[i].BudgetWorkflowStatus.toString().toLowerCase() == 'collaboration') {
            //            html += '<span style="color:black;font-size:18pt;font-weight:bold;">Workflow step: ' + this.options.myBrData.MyRequests[i].BudgetWorkflowStatus + '</span>';
            //        } else {
            //            html += '<span style="color:black;font-size:18pt;font-weight:bold;">Workflow step: ' + this.options.myBrData.MyRequests[i].BudgetWorkflowStatus + '</span>';
            //        }
            //        html += '   <br />';
            //        html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Approvers: [xcxappovers1]</span>';
            //        html += '   <br />';
            //        html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Collaborators: [xcxcollaborators]</span>';
            //        html += '   <br />';
            //        html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Informed: [xcxinformed]</span>';
            //        html += '   <br />';

            //        html += '</div>';


            //        $('#divBwExecutiveSummariesCarousel_MySubmittedRequests').append(html); // Create the html in the div tag.

            //        console.log('Calling carouselItem_AddOnClick() xcx124254235');
            //        // Now add the onclick event.
            //        //var bwWorkflowTaskItemId = this.options.taskData[i].bwWorkflowTaskItemId;
            //        //this.carouselItem_AddOnClick(carouselItem_Id, bwBudgetRequestId, this.options.taskData[i].Title, this.options.taskData[i].ProjectTitle, this.options.taskData[i].bwAssignedToRaciRoleAbbreviation, bwWorkflowTaskItemId);

            //        carouselItemIndex += 1;



            //        $('#bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_MySubmittedRequests_' + bwBudgetRequestId).html(''); // Clear the images to fix the duplicate attachments being displayed.

            //        //
            //        // Display inventory images
            //        //
            //        // 
            //        var InventoryItems = [];
            //        for (var j = 0; j < this.options.myBrData.MyRequests.length; j++) {
            //            if (bwBudgetRequestId == this.options.myBrData.MyRequests[j].bwBudgetRequestId) {
            //                var tmpJson = this.options.myBrData.MyRequests[j].bwRequestJson;
            //                var json = JSON.parse(tmpJson);
            //                if (json && json.bwSelectInventoryItems && json.bwSelectInventoryItems.value) {
            //                    InventoryItems = json.bwSelectInventoryItems.value; //this.options.brData.PendingBudgetRequests[j].bwRequestJson;
            //                }
            //                break;
            //            }
            //        }
            //        if (InventoryItems.length > 0) {
            //            var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            //                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            //                return v.toString(16);
            //            });
            //            var html = '';

            //            for (var j = 0; j < InventoryItems.length; j++) {

            //                //html += '   <span style="color:black;font-size:12pt;font-weight:normal;">' + InventoryItems[j].Title + ' - ' + InventoryItems[j].Description + '</span>';
            //                //html += '   <br />';
            //                var imagePath = globalUrlPrefix + globalUrl + '/_files/' + workflowAppId + '/inventoryimages/' + InventoryItems[j].bwInventoryItemId + '/inventoryimage.png?v=' + guid;
            //                html += '   <img src="' + imagePath + '" style="height:150px;" />';

            //            }


            //            if (html != '') {
            //                var html2 = '';
            //                html2 += '<div>';
            //                html2 += '<span style="color:black;font-size:12pt;font-weight:normal;float:left;">Inventory item(s): </span>'; // Add the title, since we have some items to display.
            //                html2 += '<br />';
            //                html = html2 + html + '</div>';
            //                $('#bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_MySubmittedRequests_' + bwBudgetRequestId).append(html);
            //            }



            //            //$('#bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_' + bwWorkflowTaskItemId).append(html);
            //        }
            //        //
            //        // end: Display inventory images
            //        //




            //        var renderAttachments = function (bwBudgetRequestId) {
            //            try {
            //                //// debugger;
            //                var operationUri = globalUrlPrefix + globalUrl + '/_files/' + 'getprimaryimageforbudgetrequest/' + workflowAppId + '/' + bwBudgetRequestId; // _files allows us to use nginx to route these to a dedicated file server.
            //                $.ajax({
            //                    url: operationUri,
            //                    method: "GET",
            //                    headers: {
            //                        "Accept": "application/json; odata=verbose"
            //                    },
            //                    success: function (data) {
            //                        try {

            //                            var bwBudgetRequestId;
            //                            if (data[0]) {
            //                                bwBudgetRequestId = data[0].bwBudgetRequestId;
            //                            }
            //                            var html = '';


            //                            try {
            //                                for (var i = 0; i < data.length; i++) {
            //                                    if (bwBudgetRequestId) {
            //                                        var fileName = data[i].Filename;
            //                                        if ((fileName.toUpperCase().indexOf('.XLSX') > -1) || (fileName.toUpperCase().indexOf('.XLS') > -1)) {

            //                                            html += '<img src="images/excelicon.png" style="width:100px;height:46px;cursor:pointer;" />';

            //                                        } else if (fileName.toUpperCase().indexOf('.PDF') > -1) {

            //                                            html += '<img src="images/pdf.png" style="width:100px;cursor:pointer;" />';

            //                                        } else if (fileName.toUpperCase().indexOf('.MP4') > -1) {
            //                                            console.log('xcx1223-3');
            //                                            html += '<img src="images/mp4.jfif" style="width:100px;cursor:pointer;" />';

            //                                        } else if (fileName.toUpperCase().indexOf('.RTF') > -1) {

            //                                            html += '<img src="images/rtf.png" style="width:100px;cursor:pointer;" />';

            //                                        } else if (fileName.toUpperCase().indexOf('.VOB') > -1) {

            //                                            html += '<img src="images/vob.png" style="width:100px;cursor:pointer;" />';

            //                                        } else if (fileName.toUpperCase().indexOf('.MP3') > -1) {

            //                                            html += '<img src="images/mp3.png" style="width:100px;cursor:pointer;" />';

            //                                        } else {

            //                                            var imageUrl = globalUrlPrefix + globalUrl + '/_files/' + workflowAppId + '/' + bwBudgetRequestId + '/' + fileName;
            //                                            html += '<img src="' + imageUrl + '" style="height:150px;" />';
            //                                            html += '<br />';

            //                                        }
            //                                    }
            //                                }

            //                            } catch (e) {
            //                                console.log('Didn\'t find an image for data: ' + JSON.stringify(data));
            //                                html = '[no image found]';
            //                                //document.getElementById('spanExecutiveSummaryPrimaryImages_' + bwBudgetRequestId).innerHTML = html;
            //                            }
            //                            if (bwBudgetRequestId) {
            //                                if (html != '') {
            //                                    var html2 = '';
            //                                    html2 += '<div>';
            //                                    html2 += '<span style="color:black;font-size:12pt;font-weight:normal;float:left;">Attachment(s): </span>'; // Add the title, since we have some items to display.
            //                                    html2 += '<br />';
            //                                    html = html2 + html + '</div>';
            //                                    $('#bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_MySubmittedRequests_' + bwBudgetRequestId).append(html);
            //                                }
            //                            }
            //                        } catch (e) {
            //                            if (e.number) {
            //                                displayAlertDialog('Error in populateAttachments():1-1: ' + e.number + ', "' + e.message + '", ' + e.stack);
            //                            } else {
            //                                // This most likely means that the folders are there on the file services server, but there is nothing in them.
            //                                //
            //                                // Fileservices has an error, so show nothing! We will put a red exclamation pin in the attachments section eventually! - 10-1-17 todd
            //                                //displayAlertDialog('Fileservices has an error: ' + ' "' + e.message + '"');
            //                            }
            //                        }
            //                    },
            //                    error: function (data, errorCode, errorMessage) {
            //                        if (errorCode === 'timeout' && errorMessage === 'timeout') {
            //                            displayAlertDialog('SERVICE UNAVAILABLE. File services is not respondingxcx2. communication timeout is set at ' + ajaxTimeout / 1000 + ' seconds: ' + errorCode + ', ' + errorMessage);
            //                        } else {


            //                            console.log('');
            //                            console.log('********************************************************************');
            //                            console.log('Error in bwEecutiveSummariesCarousel.js.showRowHoverDetails:2:3 ' + errorCode + ', ' + errorMessage);
            //                            console.log('********************************************************************');
            //                            console.log('');

            //                            //displayAlertDialog('Error in showRowHoverDetails:2:3 ' + errorCode + ', ' + errorMessage);





            //                            // The latest error 1-17-2018 is errorCode:'error' and errorMessage:'Not Found'.
            //                            // What does this mean? You can replicate this error!
            //                            // at Url: https://budgetworkflow.com/ios8.html, view an offline (Un-submitted) request, and try to add an attachment.
            //                        }
            //                    }
            //                });
            //            } catch (e) {
            //                console.log('Exception in bwExecutiveSummariesCarousel2.js.renderAttachments(): ' + e.message + ', ' + e.stack);
            //                displayAlertDialog('Exception in bwExecutiveSummariesCarousel2.js.renderAttachments(): ' + e.message + ', ' + e.stack);
            //            }
            //        }

            //        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Calling renderAttachments(). bwBudgetRequestId: ' + bwBudgetRequestId);
            //        renderAttachments(bwBudgetRequestId);

            //    } else {
            //        break;
            //    }
            //}

        } catch (e) {
            console.log('Exception in bwExecutiveSummariesCarousel2.renderExecutiveSummaries_MySubmittedRequests(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwExecutiveSummariesCarousel2.renderExecutiveSummaries_MySubmittedRequests(): ' + e.message + ', ' + e.stack);
        }
    },
    renderExecutiveSummaries_OnThisDevice: function (spinnerText) {
        try {
            console.log('In bwExecutiveSummariesCarousel2.renderExecutiveSummaries_MySubmittedRequests().');
            localStorage.setItem('bwDisplayFormat', 'ExecutiveSummaries');

            $('#buttonDisplayRequestsAsDetailedList_OnThisDevice').removeClass().addClass('divCarouselButton'); // Unselect the other buttons.
            $('#buttonDisplayRequestsAsTiles_OnThisDevice').removeClass().addClass('divCarouselButton_Selected'); // Select this one. 

            var thiz = this;

            var accordionDrawerElement;
            var accordionDrawerElements = $('.bwAccordionDrawer');
            for (var i = 0; i < accordionDrawerElements.length; i++) {
                if ($(accordionDrawerElements[i]).attr('bwaccordiondrawertype') == 'OFFLINE_REQUESTS') {
                    accordionDrawerElement = accordionDrawerElements[i];
                    break;
                }
            }

            //$(accordionDrawerElement).html('');

            alert('In renderExecutiveSummaries_OnThisDevice(). This functionality is incomplete. Coming soon!');

            // class="bwAccordionDrawer bwFunctionalAreaRow" bwaccordiondrawertype="OFFLINE_REQUESTS" // MY_UNSUBMITTED_REQUESTS, ACTIVE_REQUESTS, MY_SUBMITTED_REQUESTS, MY_PENDING_TASKS, OFFLINE_REQUESTS



            //// debugger;
            //var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            //var requestTypes = $('.bwAuthentication').bwAuthentication('option', 'bwEnabledRequestTypes').EnabledItems;

            //var carouselItemIndex = 0;
            //for (var i = (this.options.taskData.length - 1) ; i > -1; i--) {
            //    if (carouselItemIndex < 100) { // This is where we set how many tasks we will display in the carousel. Zero-based, so < 5 means display 5 tasks.

            //        var bwBudgetRequestId = this.options.taskData[i].bwRelatedItemId;
            //        var bwWorkflowTaskItemId = this.options.taskData[i].bwWorkflowTaskItemId;

            //        var carouselItem_Id = 'bwExecutiveSummariesCarousel2_executiveSummaryInCarousel_' + carouselItemIndex;

            //        var html = '';

            //        html += '   <div id="' + carouselItem_Id + '" class="executiveSummaryInCarousel" bwbudgetrequestid="" style="min-width:300px;display:inline-block;white-space:nowrap;color: rgb(38, 38, 38); font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif; font-size: 1.25em;" ';
            //        //this.carouselItem_AddOnClick(carouselItem_Id, bwBudgetRequestId, this.options.taskData[i].Title, this.options.taskData[i].ProjectTitle, this.options.taskData[i].bwAssignedToRaciRoleAbbreviation, bwWorkflowTaskItemId);

            //        var ProjectTitle_clean = this.options.taskData[i].ProjectTitle.replace(/["]/g, '&quot;').replace(/[']/g, '\\&#39;'); //&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method. 

            //        html += '   xcx="342523326"    onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'' + bwBudgetRequestId + '\', \'' + this.options.taskData[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + this.options.taskData[i].Title + '\', \'' + this.options.taskData[i].bwAssignedToRaciRoleAbbreviation + '\', \'' + bwWorkflowTaskItemId + '\');" ';
            //        html += '   >';


            //        html += '<br />';
            //        html += '<span style="color:black;font-size:18pt;font-weight:bold;">' + this.options.taskData[i].bwTaskTitle + '</span>';

            //        html += '<span style="float:right;color:#f5f6fa;font-weight:bold;">TASK</span>'; // The color is set to space white (#f5f6fa) here.

            //        html += '<br />';
            //        html += '<span style="color:black;font-size:12pt;font-weight:normal;">Your role: <span style="font-weight:bold;">' + this.options.taskData[i].bwAssignedToRaciRoleName + ' (' + this.options.taskData[i].bwAssignedToRaciRoleAbbreviation + ')</span></span>';

            //        html += '<br />';
            //        var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(this.options.taskData[i].Created);
            //        html += '<span style="color:black;font-size:12pt;font-weight:normal;">Task created: ' + timestamp4.toString() + '</span>';

            //        var daysSinceTaskCreated = 0;
            //        if (this.options.taskData[i].Created) {
            //            var cd = this.options.taskData[i].Created;
            //            var year = cd.split('-')[0];
            //            var month = cd.split('-')[1];
            //            var day = cd.split('-')[2].split('T')[0];
            //            var taskCreatedDate = new Date(Number(year), Number(month) - 1, Number(day) - 1); // +1 because we're using overdue date.
            //            var todaysDate = new Date();
            //            var utc1 = Date.UTC(taskCreatedDate.getFullYear(), taskCreatedDate.getMonth(), taskCreatedDate.getDate());
            //            var utc2 = Date.UTC(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate());
            //            var _MS_PER_DAY = 1000 * 60 * 60 * 24;
            //            daysSinceTaskCreated = Math.floor((utc2 - utc1) / _MS_PER_DAY);
            //        } else {
            //            daysSinceTaskCreated = '<span title="This is likely an old task, created before the Create date format was changed." alt="This is likely an old task, created before the Create date format was changed.">[error xcx232135-1-3-1]</span>';
            //        }

            //        html += '<br />';
            //        if (this.options.taskData[i].bwStatus.toString().toLowerCase() == 'collaboration') {
            //            html += '<span style="font-size:12pt;color:black;font-weight:normal;">bwStatus: <span style="font-weight:bold;">' + this.options.taskData[i].bwStatus + ' </span>';
            //            html += '<span style="color:black;font-size:12pt;font-weight:normal;">';
            //            //html += '[xx time left]';
            //            if (daysSinceTaskCreated == 1) {
            //                html += '&nbsp;&nbsp;' + daysSinceTaskCreated.toString() + ' day old&nbsp;&nbsp;';
            //            } else {
            //                html += '&nbsp;&nbsp;' + daysSinceTaskCreated.toString() + ' days old&nbsp;&nbsp;';
            //            }
            //            html += '</span></span>';
            //        } else {
            //            html += '<span style="font-size:12pt;color:black;font-weight:normal;">bwStatus: <span style="font-weight:bold;">' + this.options.taskData[i].bwStatus + ' </span>';
            //            html += '<span style="color:black;font-size:12pt;font-weight:normal;">';
            //            //html += '[xx days old]';
            //            if (daysSinceTaskCreated == 1) {
            //                html += '&nbsp;&nbsp;' + daysSinceTaskCreated.toString() + ' day old&nbsp;&nbsp;';
            //            } else {
            //                html += '&nbsp;&nbsp;' + daysSinceTaskCreated.toString() + ' days old&nbsp;&nbsp;';
            //            }
            //            html += '</span></span>';
            //        }

            //        html += '<br />';
            //        var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(this.options.taskData[i].DailyOverdueTaskNotificationDate);
            //        html += '<span style="font-size:12pt;color:black;font-weight:normal;cursor:help !important;" title="This is when the next reminder is scheduled to be sent..." alt="This is when the next reminder is scheduled to be sent...">Reminder: <span style="font-weight:normal;">' + timestamp4 + ' </span></span>'; // font-family: 'Segoe UI Light','Segoe UI','Segoe',Tahoma,Helvetica,Arial,sans-serif;

            //        html += '<br />';
            //        html += '<hr style="color:skyblue;" />';

            //        html += '<span style="font-size:12pt;"><span style="color:black;font-size:18pt;font-weight:bold;">' + this.options.taskData[i].Title + '</span></span>';



            //        //html += '                        <div style="position:absolute; bottom:0;float:left;width: 26px; height:26px; background-color:#f5f6fa; border-radius:26px 0 0 0;margin-left:1px;margin-bottom:-1px;"></div> <!-- The background-color is set to space white (#f5f6fa) here, for the "under the curve" color of this element. -->';
            //        // debugger; // 4-20222
            //        var requestSingletonName = '';
            //        for (var r = 0; r < this.options.brData.PendingBudgetRequests.length; r++) {
            //            if (bwBudgetRequestId == this.options.brData.PendingBudgetRequests[r].bwBudgetRequestId) {
            //                // We found it!
            //                bwRequestTypeId = this.options.brData.PendingBudgetRequests[r].bwRequestTypeId;
            //                for (var s = 0; s < requestTypes.length; s++) {
            //                    if (bwRequestTypeId = requestTypes[s].bwRequestTypeId) {
            //                        requestSingletonName = requestTypes[s].SingletonName;
            //                    }
            //                }
            //            }
            //        }

            //        html += '<span style="float:right;color:#f5f6fa;font-weight:bold;">' + requestSingletonName + '</span>'; // The color is set to space white (#f5f6fa) here.

            //        // debugger;


            //        html += '<br />';
            //        //html += '<span style="font-size:12pt;">Description: <span style="color:black;font-size:18pt;font-weight:bold;">' + this.options.taskData[i].ProjectTitle + '</span></span>';
            //        html += '<span style="color:black;font-size:18pt;font-weight:bold;">' + this.options.taskData[i].ProjectTitle + '</span>';
            //        html += '<br />';

            //        html += '<span style="color:black;font-size:12pt;font-weight:normal;">Requested by: ' + this.options.taskData[i].CreatedBy + '</span>';
            //        html += '<br />';




            //        // 2-8-2022
            //        var RequestedCapital_cleaned = $('.bwAuthentication').bwAuthentication('getBudgetWorkflowStandardizedCurrency', this.options.taskData[i].RequestedCapital);
            //        html += '<span style="color:black;font-size:12pt;font-weight:normal;">Requested capital: <span style="color:purple;font-size:18pt;">' + RequestedCapital_cleaned + '</span></span>';
            //        html += '<br />';




            //        // debugger;
            //        var timestamp4;
            //        var requestCreatedDate;
            //        for (var r = 0; r < this.options.brData.PendingBudgetRequests.length; r++) {
            //            if (bwBudgetRequestId == this.options.brData.PendingBudgetRequests[r].bwBudgetRequestId) {
            //                // We found it!
            //                requestCreatedDate = this.options.brData.PendingBudgetRequests[r].Created;
            //            }
            //        }
            //        if (requestCreatedDate) {
            //            timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(requestCreatedDate);
            //        } else {
            //            timestamp4 = '[not available]';
            //        }
            //        html += '<span style="color:black;font-size:12pt;font-weight:normal;">Request created: ' + timestamp4 + '</span>';
            //        html += '<br />';





            //        html += '<span style="color:black;font-size:12pt;font-weight:normal;">Org: <span style="">' + this.options.taskData[i].OrgName + '</span></span>';
            //        html += '<br />';
            //        html += '<br />';


            //        //html += '<span style="color:black;font-size:12pt;font-weight:normal;">Attachments xcx34235234: </span>';
            //        //html += '<br />';

            //        var bwWorkflowTaskItemId = this.options.taskData[i].bwWorkflowTaskItemId;
            //        html += '        <div id="bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_' + bwWorkflowTaskItemId + '" style="text-align: center;">';
            //        html += '        </div>';
            //        html += '   </div>';

            //        //// debugger;
            //        $('#divBwExecutiveSummariesCarousel_MySubmittedRequests').append(html); // Create the html in the div tag.

            //        console.log('Calling carouselItem_AddOnClick() xcx124254235');
            //        // Now add the onclick event.
            //        //var bwWorkflowTaskItemId = this.options.taskData[i].bwWorkflowTaskItemId;
            //        //this.carouselItem_AddOnClick(carouselItem_Id, bwBudgetRequestId, this.options.taskData[i].Title, this.options.taskData[i].ProjectTitle, this.options.taskData[i].bwAssignedToRaciRoleAbbreviation, bwWorkflowTaskItemId);

            //        carouselItemIndex += 1;





            //        //
            //        // Display inventory images
            //        //
            //        // 
            //        var InventoryItems = [];
            //        for (var j = 0; j < this.options.brData.PendingBudgetRequests.length; j++) {
            //            if (bwBudgetRequestId == this.options.brData.PendingBudgetRequests[j].bwBudgetRequestId) {
            //                var tmpJson = this.options.brData.PendingBudgetRequests[j].bwRequestJson;
            //                var json = JSON.parse(tmpJson);
            //                if (json && json.bwSelectInventoryItems && json.bwSelectInventoryItems.value) {
            //                    InventoryItems = json.bwSelectInventoryItems.value; //this.options.brData.PendingBudgetRequests[j].bwRequestJson;
            //                }
            //                break;
            //            }
            //        }
            //        if (InventoryItems.length > 0) {
            //            var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            //                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            //                return v.toString(16);
            //            });
            //            var html = '';

            //            for (var j = 0; j < InventoryItems.length; j++) {

            //                //html += '   <span style="color:black;font-size:12pt;font-weight:normal;">' + InventoryItems[j].Title + ' - ' + InventoryItems[j].Description + '</span>';
            //                //html += '   <br />';
            //                var imagePath = globalUrlPrefix + globalUrl + '/_files/' + workflowAppId + '/inventoryimages/' + InventoryItems[j].bwInventoryItemId + '/inventoryimage.png?v=' + guid;
            //                html += '   <img src="' + imagePath + '" style="height:150px;" />';

            //            }


            //            if (html != '') {
            //                var html2 = '';
            //                html2 += '<div>';
            //                html2 += '<span style="color:black;font-size:12pt;font-weight:normal;float:left;">Inventory item(s): </span>'; // Add the title, since we have some items to display.
            //                html2 += '<br />';
            //                html = html2 + html + '</div>';
            //                $('#bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_' + bwWorkflowTaskItemId).append(html);
            //            }



            //            //$('#bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_' + bwWorkflowTaskItemId).append(html);
            //        }
            //        //
            //        // end: Display inventory images
            //        //




            //        var renderAttachments = function (bwWorkflowTaskItemId) {
            //            try {
            //                //// debugger;
            //                var operationUri = globalUrlPrefix + globalUrl + '/_files/' + 'getprimaryimageforbudgetrequest/' + workflowAppId + '/' + bwBudgetRequestId; // _files allows us to use nginx to route these to a dedicated file server.
            //                $.ajax({
            //                    url: operationUri,
            //                    method: "GET",
            //                    headers: {
            //                        "Accept": "application/json; odata=verbose"
            //                    },
            //                    success: function (data) {
            //                        try {

            //                            var bwBudgetRequestId;
            //                            if (data[0]) {
            //                                bwBudgetRequestId = data[0].bwBudgetRequestId;
            //                            }
            //                            var html = '';


            //                            try {
            //                                for (var i = 0; i < data.length; i++) {
            //                                    if (bwBudgetRequestId) {
            //                                        var fileName = data[i].Filename;
            //                                        if ((fileName.toUpperCase().indexOf('.XLSX') > -1) || (fileName.toUpperCase().indexOf('.XLS') > -1)) {

            //                                            html += '<img src="images/excelicon.png" style="width:100px;height:46px;cursor:pointer;" />';

            //                                        } else if (fileName.toUpperCase().indexOf('.MP4') > -1) {

            //                                            html += '<img src="images/mp4.jfif" style="width:100px;cursor:pointer;" />';

            //                                        } else if (fileName.toUpperCase().indexOf('.RTF') > -1) {

            //                                            html += '<img src="images/rtf.png" style="width:100px;cursor:pointer;" />';

            //                                        } else if (fileName.toUpperCase().indexOf('.VOB') > -1) {

            //                                            html += '<img src="images/vob.png" style="width:100px;cursor:pointer;" />';

            //                                        } else if (fileName.toUpperCase().indexOf('.MP3') > -1) {

            //                                            html += '<img src="images/mp3.png" style="width:100px;cursor:pointer;" />';

            //                                        } else {

            //                                            var imageUrl = globalUrlPrefix + globalUrl + '/_files/' + workflowAppId + '/' + bwBudgetRequestId + '/' + fileName;
            //                                            html += '<img src="' + imageUrl + '" style="height:150px;" />';
            //                                            html += '<br />';

            //                                        }
            //                                    }
            //                                }

            //                            } catch (e) {
            //                                console.log('Didn\'t find an image for data: ' + JSON.stringify(data));
            //                                html = '[no image found]';
            //                                //document.getElementById('spanExecutiveSummaryPrimaryImages_' + bwBudgetRequestId).innerHTML = html;
            //                            }
            //                            if (bwBudgetRequestId) {
            //                                if (html != '') {
            //                                    var html2 = '';
            //                                    html2 += '<div>';
            //                                    html2 += '<span style="color:black;font-size:12pt;font-weight:normal;float:left;">Attachment(s): </span>'; // Add the title, since we have some items to display.
            //                                    html2 += '<br />';
            //                                    html = html2 + html + '</div>';
            //                                    $('#bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_' + bwWorkflowTaskItemId).append(html);
            //                                }
            //                            }
            //                        } catch (e) {
            //                            if (e.number) {
            //                                displayAlertDialog('Error in populateAttachments():1-1: ' + e.number + ', "' + e.message + '", ' + e.stack);
            //                            } else {
            //                                // This most likely means that the folders are there on the file services server, but there is nothing in them.
            //                                //
            //                                // Fileservices has an error, so show nothing! We will put a red exclamation pin in the attachments section eventually! - 10-1-17 todd
            //                                //displayAlertDialog('Fileservices has an error: ' + ' "' + e.message + '"');
            //                            }
            //                        }
            //                    },
            //                    error: function (data, errorCode, errorMessage) {
            //                        if (errorCode === 'timeout' && errorMessage === 'timeout') {
            //                            displayAlertDialog('SERVICE UNAVAILABLE. File services is not respondingxcx2. communication timeout is set at ' + ajaxTimeout / 1000 + ' seconds: ' + errorCode + ', ' + errorMessage);
            //                        } else {


            //                            console.log('');
            //                            console.log('********************************************************************');
            //                            console.log('Error in bwEecutiveSummariesCarousel.js.showRowHoverDetails:2:3 ' + errorCode + ', ' + errorMessage);
            //                            console.log('********************************************************************');
            //                            console.log('');

            //                            //displayAlertDialog('Error in showRowHoverDetails:2:3 ' + errorCode + ', ' + errorMessage);





            //                            // The latest error 1-17-2018 is errorCode:'error' and errorMessage:'Not Found'.
            //                            // What does this mean? You can replicate this error!
            //                            // at Url: https://budgetworkflow.com/ios8.html, view an offline (Un-submitted) request, and try to add an attachment.
            //                        }
            //                    }
            //                });
            //            } catch (e) {
            //                console.log('Exception in bwExecutiveSummariesCarousel2.js.renderAttachments(): ' + e.message + ', ' + e.stack);
            //                displayAlertDialog('Exception in bwExecutiveSummariesCarousel2.js.renderAttachments(): ' + e.message + ', ' + e.stack);
            //            }
            //        }

            //        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Calling renderAttachments(). bwWorkflowTaskItemId: ' + bwWorkflowTaskItemId);
            //        renderAttachments(bwWorkflowTaskItemId);

            //    } else {
            //        break;
            //    }
            //}

        } catch (e) {
            //// debugger;
            console.log('Exception in bwExecutiveSummariesCarousel2.renderExecutiveSummaries_OnThisDevice(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwExecutiveSummariesCarousel2.renderExecutiveSummaries_OnThisDevice(): ' + e.message + ', ' + e.stack);
        }
    },
    renderExecutiveSummaries_MyUnsubmittedRequests: function (spinnerText) {
        try {
            console.log('In bwExecutiveSummariesCarousel2.renderExecutiveSummaries_MyUnsubmittedRequests().');
            //alert('In bwExecutiveSummariesCarousel2.renderExecutiveSummaries_MyUnsubmittedRequests().');
            var thiz = this;

            localStorage.setItem('bwDisplayFormat', 'ExecutiveSummaries');

            $('#buttonDisplayRequestsAsDetailedList_MyUnsubmittedRequests').removeClass().addClass('divCarouselButton'); // Unselect the other buttons.
            $('#buttonDisplayRequestsAsTiles_MyUnsubmittedRequests').removeClass().addClass('divCarouselButton_Selected'); // Select this one. 

            var accordionDrawerElement;
            var accordionDrawerElements = $('.bwAccordionDrawer');
            for (var i = 0; i < accordionDrawerElements.length; i++) {
                if ($(accordionDrawerElements[i]).attr('bwaccordiondrawertype') == 'MY_UNSUBMITTED_REQUESTS') {
                    accordionDrawerElement = accordionDrawerElements[i];
                    break;
                }
            }

            if (!this.options.myUnsubmittedRequests) {







                alert('NO DATA LOADED for options.myUnsubmittedRequests.');





            } else {


                $(accordionDrawerElement).html('');

                var elementId = $(accordionDrawerElement).attr('id');
                if (!document.getElementById(elementId)) {
                    displayAlertDialog('xcx23123124-1. Could not find elementId: ' + elementId);
                } else {
                    document.getElementById(elementId).style.display = 'inline';
                }


                var rowElement = $(accordionDrawerElement).closest('table').closest('tr');
                var rowElementId = $(rowElement).attr('id');
                if (!document.getElementById(elementId)) {
                    displayAlertDialog('xcx23123124-2. Could not find elementId: ' + elementId);
                } else {
                    document.getElementById(rowElementId).style.display = 'none';
                }



                var imageId = 'alertSectionImage_0_5';
                var imageRootPath = globalUrlPrefix + globalUrl;



                var titleElement = $(rowElement).prev().find('.bwAccordionDrawerTitle').closest('td');
                var title;
                if (this.options.myUnsubmittedRequests.length > 0) {
                    if (this.options.myUnsubmittedRequests.length == 1) {
                        title = '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
                    } else {
                        title = '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;float:none;" src="' + imageRootPath + '/images/drawer-open.png">';
                    }
                }
                title += '<span class="bwNoUserSelect bwAccordionDrawerTitle">&nbsp;You have ' + this.options.myUnsubmittedRequests.length + ' saved (un-submitted) requests.</span>';
                $(titleElement).html(title);






                var carouselItemIndex = 0;
                if (this.options.myUnsubmittedRequests && this.options.myUnsubmittedRequests.length) {
                    for (var i = 0; i < this.options.myUnsubmittedRequests.length; i++) {
                        if (carouselItemIndex < 100) { // This is where we set how many tasks we will display in the carousel. Zero-based, so < 5 means display 5 tasks.


                            // class="bwAccordionDrawer bwFunctionalAreaRow" bwaccordiondrawertype="OFFLINE_REQUESTS" // MY_UNSUBMITTED_REQUESTS, ACTIVE_REQUESTS, MY_SUBMITTED_REQUESTS, MY_PENDING_TASKS, OFFLINE_REQUESTS



                            //var carouselItem_Id = 'bwExecutiveSummariesCarousel2_executiveSummaryInCarousel_' + carouselItemIndex;

                            //var html = '';

                            ////displayAlertDialog('xcx324235 this.options.myUnsubmittedRequests[i]: ' + JSON.stringify(this.options.myUnsubmittedRequests[i]));

                            //html += '   <div id="' + carouselItem_Id + '" title="xcx231466534-6" alt="xcx231466534-6" class="executiveSummaryInCarousel" bwbudgetrequestid="' + this.options.myUnsubmittedRequests[i].bwBudgetRequestId + '" style="min-width:300px;max-width:550px;display:inline-block;white-space:nowrap;color: rgb(38, 38, 38); font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif; font-size: 1.25em;" ';
                            //var ProjectTitle_clean = String(this.options.myUnsubmittedRequests[i].ProjectTitle).replace(/["]/g, '&quot;').replace(/[']/g, '\\&#39;'); //&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method.
                            //html += '   xcx="342523326-7"    onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'' + this.options.myUnsubmittedRequests[i].bwBudgetRequestId + '\', \'' + this.options.myUnsubmittedRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + this.options.myUnsubmittedRequests[i].Title + '\', \'' + this.options.myUnsubmittedRequests[i].bwAssignedToRaciRoleAbbreviation + '\', \'' + '' + '\');" ';
                            //html += '   >';

                            //html += '</div>';

                            ////$('#divBwExecutiveSummariesCarousel_MyUnsubmittedRequests').append(html);
                            //$(accordionDrawerElement).append(html);



                            var title = 'Executive Summary for: ' + this.options.myUnsubmittedRequests[i].Title + '. ' + ProjectTitle_clean;

                            var executiveSummaryElement = document.createElement('div');
                            //executiveSummaryElement.id = carouselItem_Id;
                            executiveSummaryElement.classList.add('executiveSummaryInCarousel');
                            executiveSummaryElement.setAttribute('bwbudgetrequestid', this.options.myUnsubmittedRequests[i].bwBudgetRequestId);
                            executiveSummaryElement.title = title;
                            executiveSummaryElement.alt = title;
                            executiveSummaryElement.style.minWidth = '300px';
                            executiveSummaryElement.style.maxWidth = '550px';
                            executiveSummaryElement.style.display = 'inline-block';
                            executiveSummaryElement.style.whiteSpace = 'nowrap';
                            executiveSummaryElement.style.color = 'rgb(38, 38, 38)';
                            executiveSummaryElement.style.fontFamily = '"Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif';
                            executiveSummaryElement.style.fontSize = '1.25em';

                            var ProjectTitle_clean = String(this.options.myUnsubmittedRequests[i].ProjectTitle).replace(/["]/g, '&quot;').replace(/[']/g, '\\&#39;'); //&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method.
                            executiveSummaryElement.setAttribute('onclick', '$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'' + this.options.myUnsubmittedRequests[i].bwBudgetRequestId + '\', \'' + this.options.myUnsubmittedRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + this.options.myUnsubmittedRequests[i].Title + '\', \'' + this.options.myUnsubmittedRequests[i].bwAssignedToRaciRoleAbbreviation + '\', \'' + '7777xcx7777777-32444221-6' + '\');');

                            $(accordionDrawerElement).append(executiveSummaryElement);



                            console.log('Calling renderExecutiveSummaryForRequest(). xcx332-9');
                            alert('Calling renderExecutiveSummaryForRequest(). xcx332-9');
                            var promise = this.renderExecutiveSummaryForRequest(this.options.myUnsubmittedRequests[i], executiveSummaryElement); //'divBwExecutiveSummariesCarousel_MyUnsubmittedRequests');
                            promise.then(function (result) {
                                // Do nothing.
                            }).catch(function (e) {
                                alert('Exception xcx33995-4: ' + e);
                            });

                            carouselItemIndex += 1;

                        } else {
                            break;
                        }
                    }

                }

            }

        } catch (e) {
            console.log('Exception in bwExecutiveSummariesCarousel2.renderExecutiveSummaries_MyUnsubmittedRequests(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwExecutiveSummariesCarousel2.renderExecutiveSummaries_MyUnsubmittedRequests(): ' + e.message + ', ' + e.stack);
        }
    },

    renderExecutiveSummaries_MyPendingTasks_FASTSECONDPASS: function (spinnerText) {
        try {
            //
            // This appends rather than re-writing the UI for this section.
            //
            console.log('In bwExecutiveSummariesCarousel2.renderExecutiveSummaries_MyPendingTasks_FASTSECONDPASS().');
            alert('In bwExecutiveSummariesCarousel2.renderExecutiveSummaries_MyPendingTasks_FASTSECONDPASS().');
            var thiz = this;

            localStorage.setItem('bwDisplayFormat', 'ExecutiveSummaries');

            $('#buttonDisplayRequestsAsDetailedList_MyPendingTasks').removeClass().addClass('divCarouselButton'); // Unselect the other button.
            $('#buttonDisplayRequestsAsTiles_MyPendingTasks').removeClass().addClass('divCarouselButton_Selected'); // Select this one. 

            var accordionDrawerElement;
            var accordionDrawerElements = $('.bwAccordionDrawer');
            for (var i = 0; i < accordionDrawerElements.length; i++) {
                if ($(accordionDrawerElements[i]).attr('bwaccordiondrawertype') == 'MY_PENDING_TASKS') {
                    accordionDrawerElement = accordionDrawerElements[i];
                    break;
                }
            }

            $(accordionDrawerElement).html(''); // <<< FIX!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

            var elementId = $(accordionDrawerElement).attr('id');
            if (!document.getElementById(elementId)) {
                alert('xcx2131241234. Cannot find elementId: ' + elementId);
            } else {
                document.getElementById(elementId).style.display = 'inline';
            }


            var rowElement = $(accordionDrawerElement).closest('table').closest('tr');
            //var rowElementId = $(rowElement).attr('id');
            //document.getElementById(rowElementId).style.display = 'none';





            var imageId = 'alertSectionImage_0_1';
            var imageRootPath = globalUrlPrefix + globalUrl;

            var titleElement = $(rowElement).prev().find('.bwAccordionDrawerTitle').closest('td');
            var title;
            if (this.options.taskData.length > 0) {
                if (this.options.taskData.length == 1) {
                    title = '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-close.png">';
                } else {
                    title = '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;float:none;" src="' + imageRootPath + '/images/drawer-close.png">';
                }
            }
            title += '<span class="bwNoUserSelect bwAccordionDrawerTitle">&nbsp;You have ' + this.options.taskData.length + ' pending tasks.</span>';
            $(titleElement).html(title);








            //alert('xcx333334 this.options.taskData.length: ' + this.options.taskData.length);
            var carouselItemIndex = 0;
            for (var i = (this.options.taskData.length - 1); i > -1; i--) { // This loop goes backwards...
                if (carouselItemIndex < 100) { // This is where we set how many tasks we will display in the carousel. Zero-based, so < 5 means display 5 tasks.

                    //var carouselItem_Id = 'bwExecutiveSummariesCarousel2_executiveSummaryInCarousel_' + carouselItemIndex;

                    //var html = '';

                    ////alert('cx2324 this.options.taskData[i]: ' + JSON.stringify(this.options.taskData[i]));

                    //html += '   <div id="' + carouselItem_Id + '" title="xcx231466534-3-2" alt="xcx231466534-3-2" class="executiveSummaryInCarousel" bwbudgetrequestid="' + this.options.taskData[i].bwRelatedItemId + '" bwworkflowtaskitemid="' + this.options.taskData[i].bwWorkflowTaskItemId + '" bworgid="' + this.options.taskData[i].OrgId + '" bwworkflowstatus_bwworkflowstepname="' + this.options.taskData[i].WorkflowStepName + '" style="min-width:300px;max-width:550px;display:inline-block;white-space:nowrap;color: rgb(38, 38, 38); font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif; font-size: 1.25em;" ';

                    //var ProjectTitle_clean = String(this.options.taskData[i].ProjectTitle).replace(/["]/g, '&quot;').replace(/[']/g, '\\&#39;'); //&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method.
                    //html += '   xcx="342523326-4"    onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'' + this.options.taskData[i].bwRelatedItemId + '\', \'' + this.options.taskData[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + this.options.taskData[i].Title + '\', \'' + this.options.taskData[i].bwAssignedToRaciRoleAbbreviation + '\', \'' + this.options.taskData[i].bwWorkflowTaskItemId + '\');" ';
                    //html += '   >';

                    //html += '</div>';

                    //$(accordionDrawerElement).append(html);

                    //console.log('Calling renderExecutiveSummaryForTask(). xcx11223-5');


                    //console.log('Calling renderExecutiveSummaryForTask(). xcx11223-44444 DOES THIS HAVE bwRequestJson? taskData: ' + JSON.stringify(this.options.taskData[i]));


                    var title = 'Executive Summary for: ' + this.options.taskData[i].Title + '. ' + ProjectTitle_clean;

                    var executiveSummaryElement = document.createElement('div');
                    //executiveSummaryElement.id = carouselItem_Id;
                    executiveSummaryElement.classList.add('executiveSummaryInCarousel');
                    executiveSummaryElement.setAttribute('bwbudgetrequestid', this.options.taskData[i].bwBudgetRequestId);
                    executiveSummaryElement.title = title;
                    executiveSummaryElement.alt = title;
                    executiveSummaryElement.style.minWidth = '300px';
                    executiveSummaryElement.style.maxWidth = '550px';
                    executiveSummaryElement.style.display = 'inline-block';
                    executiveSummaryElement.style.whiteSpace = 'nowrap';
                    executiveSummaryElement.style.color = 'rgb(38, 38, 38)';
                    executiveSummaryElement.style.fontFamily = '"Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif';
                    executiveSummaryElement.style.fontSize = '1.25em';

                    var ProjectTitle_clean = String(this.options.taskData[i].ProjectTitle).replace(/["]/g, '&quot;').replace(/[']/g, '\\&#39;'); //&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method.
                    executiveSummaryElement.setAttribute('onclick', '$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'' + this.options.taskData[i].bwRelatedItemId + '\', \'' + this.options.taskData[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + this.options.taskData[i].Title + '\', \'' + this.options.taskData[i].bwAssignedToRaciRoleAbbreviation + '\', \'' + '7777xcx7777777-32433-7' + '\');');

                    $(accordionDrawerElement).append(executiveSummaryElement);



                    var promise = this.renderExecutiveSummaryForTask(this.options.taskData[i], executiveSummaryElement); //'divBwExecutiveSummariesCarousel_MyPendingTasks');
                    promise.then(function (result) {
                        // Do nothing.
                    }).catch(function (e) {
                        alert('Exception xcx33995-1: ' + e);
                    });

                    carouselItemIndex += 1;

                } else {
                    break;
                }
            }

            console.log('In bwExecutiveSummariesCarousel2.js.renderExecutiveSummaries_MyPendingTasks_FASTSECONDPASS(). Calling bwActiveMenu.js.adjustLeftSideMenu().');
            $('.bwActiveMenu').bwActiveMenu('adjustLeftSideMenu');

        } catch (e) {
            console.log('Exception in bwExecutiveSummariesCarousel2.renderExecutiveSummaries_MyPendingTasks_FASTSECONDPASS(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwExecutiveSummariesCarousel2.renderExecutiveSummaries_MyPendingTasks_FASTSECONDPASS(): ' + e.message + ', ' + e.stack);
        }
    },

    // The parameter [executiveSummaryElement] is the element with class name of "executiveSummaryInCarousel". This is the executive summary for the request.
    renderExecutiveSummaryForRequest: function (bwBudgetRequest, executiveSummaryElement) { // accordionDrawerElement) { // This method may be duplicated in webservices.start.js.renderExecutiveSummaryForRequest().
        try {
            console.log('In bwExecutiveSummariesCarousel2.js.renderExecutiveSummaryForRequest().');
            //alert('In bwExecutiveSummariesCarousel2.js.renderExecutiveSummaryForRequest(). bwBudgetRequest: ' + JSON.stringify(bwBudgetRequest));
            var thiz = this;
            return new Promise(function (resolve, reject) {
                try {

                    if (!bwBudgetRequest) {

                        var msg = 'Error in renderExecutiveSummaryForRequest(). Invalid value for bwBudgetRequest: ' + bwBudgetRequest;
                        console.log(msg);
                        displayAlertDialog(msg);

                        reject(msg);

                    } else {

                        window.scrollTo(0, 0); // Scroll to top on button click. This makes sure things render Ok, and also just seems like a nicer user experience.
                        $('.bwActiveMenu').bwActiveMenu('adjustLeftSideMenu'); // This makes sure our new stretchy-left-menu redraws Ok.

                        console.log('Calling bwCommonScripts.getExecutiveSummaryHtml(). xcx1-1.');
                        //alert('Calling bwCommonScripts.getExecutiveSummaryHtml(). xcx1-1.');
                        var promise = bwCommonScripts.getExecutiveSummaryHtml(bwBudgetRequest, 'bwBudgetRequest', executiveSummaryElement);
                        promise.then(function (results) {
                            try {


                                //if (!results.executiveSummaryElement) {

                                //    var msg = 'Error in bwExecutiveSummariesCarousel2.js.renderExecutiveSummaryForRequest(). No value for results.executiveSummaryElement: ' + results.executiveSummaryElement;
                                //    console.log(msg);
                                //    displayAlertDialog(msg);

                                //} else {
                                debugger;
                                $(results.executiveSummaryElement).html(results.html);



                                //
                                //
                                // Make this draggable. We use this to add Supplementals/Addendums to requests. 4-6-2024.
                                //
                                //

                                $(results.executiveSummaryElement).attr('draggable', 'true');
                                //$(results.executiveSummaryElement).attr('allow', 'clipboard-read;clipboard-write;');



                                try {

                                    results.executiveSummaryElement.addEventListener('dragstart', function (e) {
                                        try {
                                            console.log('In bwExecutiveSummariesCarousel2.js.renderExecutiveSummaryForRequest.dragstart().');

                                            // We have to set the bwBudgetRequestId in the dragstart event.
                                            var bwBudgetRequestId = e.target.getAttribute('bwbudgetrequestid');
                                            e.dataTransfer.setData('text/plain', bwBudgetRequestId);

                                        } catch (e) {
                                            var msg = 'Exception in In bwExecutiveSummariesCarousel2.js.renderExecutiveSummaryForRequest.dragstart(): ' + e.message + ', ' + e.stack;
                                            console.log(msg);
                                            alert(msg);
                                        }
                                    });

                                } catch (e) {

                                    var msg = '';
                                    msg += '############################################>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<';
                                    msg += '############################################>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<';
                                    msg += '############################################>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<';
                                    msg += 'Error in bwExecutiveSummariesCarousel2.js.renderExecutiveSummaryForRequest(). Could not addEventListener [dragstart] to element. FIX THIS!!!!!!: ' + JSON.stringify(results.executiveSummaryElement);
                                    msg += '############################################>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<';
                                    msg += '############################################>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<';
                                    msg += '############################################>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<';
                                    console.log(msg);
                                    //displayAlertDialog(msg);

                                }



                                //
                                //
                                // end: Make this draggable. We use this to add Supplementals/Addendums to requests. 4-6-2024.
                                //
                                //


















                                if (!results.bwBudgetRequest.bwRequestJson) {
                                    //console.log('Error in bwExecutiveSummariesCarousel2.js.renderExecutiveSummaryForRequest(). Invalid JSON detected: ' + results.bwBudgetRequest);
                                    console.log('####################Error in bwExecutiveSummariesCarousel2.js.renderExecutiveSummaryForRequest(). Invalid JSON detected: ' + results.bwBudgetRequest);
                                }

                                var promise2 = bwCommonScripts.renderInventoryItems_ForExecutiveSummary(results.bwBudgetRequest.bwBudgetRequestId, results.bwBudgetRequest, results.executiveSummaryElement);
                                promise2.then(function (results) {
                                    try {

                                        console.log('In bwExecutiveSummariesCarousel2.js.renderExecutiveSummaryForRequest(). Returned from call to bwCommonScripts.renderInventoryItems_ForExecutiveSummary.');

                                        var promise3 = bwCommonScripts.renderAttachments_ForExecutiveSummary(results.bwBudgetRequestId, results.bwBudgetRequest, results.executiveSummaryElement);
                                        promise3.then(function (results) {
                                            try {

                                                console.log('In bwExecutiveSummariesCarousel2.js.renderExecutiveSummaryForRequest(). Returned from call to bwCommonScripts.renderAttachments_ForExecutiveSummary.');
                                                //alert('In bwExecutiveSummariesCarousel2.js.renderExecutiveSummaryForRequest(). Returned from call to bwCommonScripts.renderAttachments_ForExecutiveSummary.');












                                                //
                                                //
                                                // 2-19-2024 THIS LOOKS LIKE A GOOD SPOT TO BACKFILL THE WORKFLOW current owner(s)/approvers/collaborators/informed.???????????<<<<<<<<<<<<<<<<<<
                                                //
                                                //

                                                //var currentOwner = results.bwBudgetRequest.CurrentOwner;

                                                //var orgId = results.bwBudgetRequest.OrgId;
                                                //var bwRequesTypeId = results.bwBudgetRequest.bwRequesTypeId;
                                                //var budgetWorkflowStatus = results.bwBudgetRequest.BudgetWorkflowStatus;

                                                //// AT THIS POINT WE HAVE ENOUGH INFORMATION TO FIND OUT WHO THE participants are who are currently participating in the workflow.

                                                //debugger; // Does this have the values we are looking for?

                                                //var workflows = $('.bwOrganizationEditor').bwOrganizationEditor('option', 'Workflows');
                                                //var bwWorkflowJson = JSON.parse(workflows[0].bwWorkflowJson);

                                                //// Then we populate this way:
                                                //var html = 'Current owner(s): xcxcurrentowners';
                                                //$(results.executiveSummaryElement).find('.current_owners').html(html);
                                                //html = 'Approver(s): xcxapprovers';
                                                //$(results.executiveSummaryElement).find('.approvers').html(html);
                                                //html = 'Collaborator(s): xcxcollaborators';
                                                //$(results.executiveSummaryElement).find('.collaborators').html(html);
                                                //html = 'Informed: xcxinformed';
                                                //$(results.executiveSummaryElement).find('.informed').html(html);











                                            } catch (e) {

                                                var msg = 'Exception in bwExecutiveSummariesCarousel2.js.renderExecutiveSummaryForRequest():2-2-2-1: ' + e.message + ', ' + e.stack;
                                                console.log(msg);
                                                alert(msg);
                                                var result = {
                                                    status: 'EXCEPTION',
                                                    message: msg
                                                }
                                                reject(result);

                                            }
                                        }).catch(function (e) {

                                            var msg = 'Exception in bwExecutiveSummariesCarousel2.js.renderExecutiveSummaryForRequest():2-2-2-2: ' + JSON.stringify(e);
                                            console.log(msg);
                                            displayAlertDialog(msg);
                                            var result = {
                                                status: 'EXCEPTION',
                                                message: msg
                                            }
                                            reject(result);

                                        });

                                    } catch (e) {

                                        var msg = 'Exception in bwExecutiveSummariesCarousel2.js.renderExecutiveSummaryForRequest():2-2-2-3: ' + e.message + ', ' + e.stack;
                                        console.log(msg);
                                        alert(msg);
                                        var result = {
                                            status: 'EXCEPTION',
                                            message: msg
                                        }
                                        reject(result);

                                    }
                                }).catch(function (e) {

                                    var msg = 'Exception in bwExecutiveSummariesCarousel2.js.renderExecutiveSummaryForRequest():2-2-2-3: ' + JSON.stringify(e);
                                    console.log(msg);
                                    alert(msg);
                                    var result = {
                                        status: 'EXCEPTION',
                                        message: msg
                                    }
                                    reject(result);

                                });

                                //}

                            } catch (e) {
                                var msg = 'Exception in bwExecutiveSummariesCarousel2.js.renderExecutiveSummaryForRequest():xcx2131234234: ' + e.message + ', ' + e.stack;
                                console.log(msg);
                                alert(msg);
                                var result = {
                                    status: 'EXCEPTION',
                                    message: msg
                                }
                                reject(result);

                            }

                        }).catch(function (e) {
                            debugger;
                            var msg = 'Exception in bwExecutiveSummariesCarousel2.js.renderExecutiveSummaryForRequest():2-2-2-3: ' + JSON.stringify(e);
                            console.log(msg);
                            alert(msg);
                            var result = {
                                status: 'EXCEPTION',
                                message: msg
                            }
                            reject(result);

                        });

                    }

                } catch (e) {
                    var msg = 'Exception in bwExecutiveSummariesCarousel2.js.renderExecutiveSummaryForRequest():2: ' + e.message + ', ' + e.stack;
                    console.log(msg);
                    displayAlertDialog(msg);

                    reject(msg);
                }
            });

        } catch (e) {
            var msg = 'Exception in bwExeutiveSummariesCarousel2.js.renderExecutiveSummaryForRequest(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);

            reject(msg);
        }
    },
    renderExecutiveSummaryForTask: function (bwWorkflowTaskItem, executiveSummaryElement) { //accordionDrawerElement) {
        try {
            console.log('In bwExecutiveSummariesCarousel2.js.renderExecutiveSummaryForTask().');
            //alert('In bwExecutiveSummariesCarousel2.js.renderExecutiveSummaryForTask().');
            var thiz = this;
            return new Promise(function (resolve, reject) {
                try {

                    if (!bwWorkflowTaskItem) {

                        var msg = 'Error in renderExecutiveSummaryForTask(). Invalid value for bwWorkflowTaskItem: ' + bwWorkflowTaskItem;
                        console.log(msg);
                        displayAlertDialog(msg);

                        reject(msg);

                    } else {

                        //var homePageButton = $('#divWelcomeButton').attr('class');
                        //if (homePageButton.indexOf('_SelectedButton') > -1) {

                        // Yes, the home page is being displayed.
                        window.scrollTo(0, 0); // Scroll to top on button click. This makes sure things render Ok, and also just seems like a nicer user experience.
                        $('.bwActiveMenu').bwActiveMenu('adjustLeftSideMenu'); // This makes sure our new stretchy-left-menu redraws Ok.

                        console.log('Calling bwCommonScripts.getExecutiveSummaryHtml(). xcx1-2.');
                        //alert('Calling bwCommonScripts.getExecutiveSummaryHtml(). xcx1-2.');
                        var promise = bwCommonScripts.getExecutiveSummaryHtml(bwWorkflowTaskItem, 'bwWorkflowTaskItem', executiveSummaryElement); // Passing executiveSummaries element not the index.
                        promise.then(function (results) {
                            try {

                                if (results.status != 'SUCCESS') {

                                    var msg = 'Error in bwExecutiveSummariesCarousel2.js.renderExecutiveSummaryForTask(): ' + results.message;
                                    var result = {
                                        status: results.status,
                                        message: msg
                                    }
                                    reject(result);

                                } else {

                                    $(results.executiveSummaryElement).html(results.html);

                                    console.log('xcx1112-2 Calling bwCommonScripts.renderInventoryItems_ForExecutiveSummary().');
                                    var promise2 = bwCommonScripts.renderInventoryItems_ForExecutiveSummary(results.bwBudgetRequest.bwBudgetRequestId, results.bwBudgetRequest, results.executiveSummaryElement);
                                    promise2.then(function (results) {
                                        try {

                                            console.log('In bwExecutiveSummariesCarousel2.js.renderExecutiveSummaryForTask(). Returned from call to bwCommonScripts.renderInventoryItems_ForExecutiveSummary.');

                                            var promise3 = bwCommonScripts.renderAttachments_ForExecutiveSummary(results.bwBudgetRequestId, results.bwBudgetRequest, results.executiveSummaryElement);
                                            promise3.then(function (results) {
                                                try {

                                                    console.log('In bwExecutiveSummariesCarousel2.js.renderExecutiveSummaryForTask(). Returned from call to bwCommonScripts.renderAttachments_ForExecutiveSummary.');

                                                } catch (e) {

                                                    var msg = 'Exception in bwExecutiveSummariesCarousel2.js.renderExecutiveSummaryForTask():2-2-2: ' + e.message + ', ' + e.stack;
                                                    console.log(msg);
                                                    alert(msg);
                                                    var result = {
                                                        status: 'EXCEPTION',
                                                        message: msg
                                                    }
                                                    reject(result);

                                                }
                                            }).catch(function (e) {

                                                var msg = 'Exception in bwExecutiveSummariesCarousel2.js.renderExecutiveSummaryForTask():2-2-2: ' + JSON.stringify(e);
                                                console.log(msg);
                                                alert(msg);
                                                var result = {
                                                    status: 'EXCEPTION',
                                                    message: msg
                                                }
                                                reject(result);

                                            });

                                        } catch (e) {

                                            var msg = 'Exception in bwExecutiveSummariesCarousel2.js.renderExecutiveSummaryForTask():2-2-2-3: ' + e.message + ', ' + e.stack;
                                            console.log(msg);
                                            alert(msg);
                                            var result = {
                                                status: 'EXCEPTION',
                                                message: msg
                                            }
                                            reject(result);

                                        }
                                    }).catch(function (e) {

                                        var msg = 'Exception in bwExecutiveSummariesCarousel2.js.renderExecutiveSummaryForTask():2-2-2-3: ' + JSON.stringify(e);
                                        console.log(msg);
                                        alert(msg);
                                        var result = {
                                            status: 'EXCEPTION',
                                            message: msg
                                        }
                                        reject(result);

                                    });

                                }
                            } catch (e) {

                                var msg = 'Exception in bwExecutiveSummariesCarousel2.js.renderExecutiveSummaryForTask():4: ' + e.message + ', ' + e.stack;
                                console.log(msg);
                                alert(msg);
                                var result = {
                                    status: 'EXCEPTION',
                                    message: msg
                                }
                                reject(result);

                            }
                        }).catch(function (e) {

                            var msg = 'Exception in bwExecutiveSummariesCarousel2.js.renderExecutiveSummaryForTask():3: ' + JSON.stringify(e);
                            console.log(msg);
                            alert(msg);
                            var result = {
                                status: 'EXCEPTION',
                                message: msg
                            }
                            reject(result);

                        });

                        //}
                    }
                } catch (e) {

                    var msg = 'Exception in bwExecutiveSummariesCarousel2.js.renderExecutiveSummaryForTask():2: ' + e.message + ', ' + e.stack;
                    console.log(msg);
                    displayAlertDialog(msg);
                    var result = {
                        status: 'EXCEPTION',
                        message: msg
                    }
                    reject(result);

                }
            });

        } catch (e) {
            console.log('Exception in bwExeutiveSummariesCarousel2.js.renderExecutiveSummaryForTask(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwExeutiveSummariesCarousel2.js.renderExecutiveSummaryForTask(): ' + e.message + ', ' + e.stack);
        }
    },

    getExecutiveSummaryHtmlForRequest: function (carouselItem_Id, bwBudgetRequestId, requestJson, executiveSummaryElement) { // Title, ProjectTitle, bwAssignedToRaciRoleAbbreviation, CreatedBy, RequestedCapital, OrgName, BudgetWorkflowStatus, Created) {
        try {
            return new Promise(function (resolve, reject) {
                try {
                    console.log('In bwExecutiveSummariesCarousel2.js.getExecutiveSummaryHtmlForRequest().');

                    displayAlertDialog('xcx8709780 In getExecutiveSummaryHtmlForRequest(). bwBudgetRequestId: ' + bwBudgetRequestId + ', requestJson: ' + JSON.stringify(requestJson));

                    // Get the request type. For example: "Budget Request".
                    //debugger;
                    var bwEnabledRequestTypes = $('.bwAuthentication').bwAuthentication('option', 'bwEnabledRequestTypes');
                    var requestTypes = bwEnabledRequestTypes.EnabledItems; // Global, populated in the beginning when the app loads.



                    //alert('XCX1213333333333 requestJson: ' + JSON.stringify(requestJson));


                    var bwRequestTypeId = requestJson.bwRequestTypeId; // JSON.parse(requestJson.bwRequestJson).bwRequestTypeId;
                    var requestType;
                    for (var i = 0; i < requestTypes.length; i++) {
                        if (bwRequestTypeId == requestTypes[i].bwRequestTypeId) {
                            requestType = requestTypes[i].SingletonName;
                            break;
                        }
                    }

                    var html = '';

                    if (carouselItem_Id) { // Only add the surrounding div lements when there is carouselItem_Id.
                        html += '   <div id="' + carouselItem_Id + '" title="xcx231466534-7" alt="xcx231466534-7" xcx="xcx33456-3" class="executiveSummaryInCarousel" bwbudgetrequestid="' + bwBudgetRequestId + '" style="min-width:300px;max-width:550px;display:inline-block;white-space:nowrap;color: rgb(38, 38, 38); font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif; font-size: 1.25em;" ';
                        //this.carouselItem_AddOnClick(carouselItem_Id, bwBudgetRequestId, this.options.taskData[i].Title, this.options.taskData[i].ProjectTitle, this.options.taskData[i].bwAssignedToRaciRoleAbbreviation, bwWorkflowTaskItemId);
                        var ProjectTitle_clean = String(requestJson.ProjectTitle).replace(/["]/g, '&quot;').replace(/[']/g, '\\&#39;'); //&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method.


                        //html += '   xcx="342523326-2"    onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'' + bwBudgetRequestId + '\', \'' + requestJson.Title + '\', \'' + ProjectTitle_clean + '\', \'' + requestJson.Title + '\', \'' + requestJson.bwAssignedToRaciRoleAbbreviation;
                        html += '   xcx="342523326-2-4"    onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', ' + bwBudgetRequest.TrashBin + ', \'' + bwBudgetRequestId + '\', \'' + requestJson.Title + '\', \'' + ProjectTitle_clean + '\', \'' + requestJson.Title + '\', \'' + requestJson.bwAssignedToRaciRoleAbbreviation;


                        html += '\', \'' + '7777xcx7777777' + '\');" ';
                        alert('xcx899879879879878978'); // Hmmm it looks like we never get here...
                        html += '   >';
                    }

                    html += '<br />';
                    debugger;
                    if (requestJson.Title) {

                        // This is where we display the "Pin". If it is pinned, or if it is not pinned.
                        var pinnedRequestsArray = $('.bwAuthentication:first').bwAuthentication('option', 'PinnedRequests');
                        if (pinnedRequestsArray && pinnedRequestsArray.length) {

                            if (pinnedRequestsArray.indexOf(bwBudgetRequestId) > -1) {
                                html += '   <span style="font-size:12pt;"><span style="color:black;font-size:18pt;font-weight:bold;">' + requestJson.Title + '</span></span>';
                                html += '           <div title="un-pin" class="pinButton" style="display:inline-block;font-size:18pt;cursor:pointer !important;float:right;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequest\', \'' + bwBudgetRequestId + '\', \'' + 'requestDialogId' + '\', false);"><img src="/images/unpin.png" style="width:50px;height:50px;cursor:pointer !important;" /></div>';
                            } else {
                                html += '   <span style="font-size:12pt;"><span style="color:black;font-size:18pt;font-weight:bold;">' + requestJson.Title + '</span></span>';
                                html += '           <div title="pin" class="pinButton" style="display:inline-block;font-size:18pt;cursor:pointer !important;float:right;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequest\', \'' + bwBudgetRequestId + '\', \'' + 'requestDialogId' + '\', true);"><img src="/images/pin.png" style="width:50px;height:50px;cursor:pointer !important;" /></div>';
                            }

                        } else {

                            html += '   <span style="font-size:12pt;"><span style="color:black;font-size:18pt;font-weight:bold;">' + requestJson.Title + '</span></span>';
                            html += '           <div title="pin" class="pinButton" style="display:inline-block;font-size:18pt;cursor:pointer !important;float:right;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequest\', \'' + bwBudgetRequestId + '\', \'' + 'requestDialogId' + '\', true);"><img src="/images/pin.png" style="width:50px;height:50px;cursor:pointer !important;" /></div>';

                        }

                    } else {
                        html += '   <span style="font-size:12pt;"><span style="color:lightgray;font-size:18pt;font-weight:bold;">New ' + requestType + '</span></span>'; // This is a new request.
                    }
                    html += '   <br />';
                    html += '   <div xcx="xcx2312-1-x" style="color:black;font-size:30pt;font-weight:bold;overflow:hidden;white-space:normal;">' + requestJson.ProjectTitle + '</div>';
                    html += '   <br />';


                    // Display the bwJustificationDetailsField in the executive summary. 
                    if (requestJson.bwRequestJson) {
                        var tmpbwRequestJson = JSON.parse(requestJson.bwRequestJson);
                        if (tmpbwRequestJson.bwJustificationDetailsField && tmpbwRequestJson.bwJustificationDetailsField.value) {
                            var ellippses = '';
                            if (String(tmpbwRequestJson.bwJustificationDetailsField.value).length > 255) {
                                ellippses = '...';
                            }

                            // This is the Justification Details, being displayed in the html hover over title and alt attributes. 12-13-2022.

                            var strippedHtml = tmpbwRequestJson.bwJustificationDetailsField.value.replaceAll('<br>', '\n');
                            strippedHtml = strippedHtml.replaceAll('<div>', '');
                            strippedHtml = strippedHtml.replaceAll('</div>', '\n');

                            strippedHtml = strippedHtml.replaceAll('<span>', '');
                            strippedHtml = strippedHtml.replaceAll('</span>', '');

                            strippedHtml = strippedHtml.replaceAll('<', '');
                            strippedHtml = strippedHtml.replaceAll('>', '');

                            html += '   <div xcx="xcx2312-1-x2-1" style="color:darkgray;font-size:15pt;font-weight:bold;white-space:normal;max-width:750px;overflow:hidden;" title="' + String(strippedHtml).substring(0, 255) + '" alt="' + String(strippedHtml).substring(0, 255) + '">' + String(strippedHtml).substring(0, 255) + ' ' + ellippses + '</div>';

                            html += '   <br />';
                        }
                    }

                    // Created by.
                    html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Requested by: ' + requestJson.CreatedBy + '</span>';
                    html += '   <br />';
                    var RequestedCapital_cleaned = $('.bwAuthentication').bwAuthentication('getBudgetWorkflowStandardizedCurrency', requestJson.RequestedCapital);
                    html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Requested capital: <span style="color:purple;font-size:18pt;">' + RequestedCapital_cleaned + '</span></span>';
                    html += '   <br />';
                    var timestamp4;
                    var requestCreatedDate;
                    requestCreatedDate = requestJson.Created;
                    if (requestCreatedDate) {
                        timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(requestCreatedDate);
                    } else {
                        timestamp4 = '[not available]';
                    }
                    html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Request created: ' + timestamp4 + '</span>';
                    html += '   <br />';
                    html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Org: <span style="">' + requestJson.OrgName + '</span></span>';
                    html += '   <br />';
                    html += '   <br />';

                    html += '   <div class="executiveSummaryAttachments" id="bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_MyUnsubmittedRequests_' + bwBudgetRequestId + '" style="text-align: center;"></div>';



                    html += '   <hr style="color:skyblue;" />';

                    if (requestJson.BudgetWorkflowStatus) {
                        if (requestJson.BudgetWorkflowStatus.toString().toLowerCase() == 'collaboration') {
                            html += '<span style="color:black;font-size:18pt;font-weight:bold;">Workflow step: ' + requestJson.BudgetWorkflowStatus + '</span>';
                        } else {
                            html += '<span style="color:black;font-size:18pt;font-weight:bold;">Workflow step: ' + requestJson.BudgetWorkflowStatus + '</span>';
                        }
                    } else {
                        html += '<span style="color:black;font-size:18pt;font-weight:bold;">Workflow step: ' + 'xcx99345 invalid BudgetWorkflowStatus' + '</span>';
                    }

                    html += '   <br />';
                    html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Approvers: [xcxappovers1]</span>';
                    html += '   <br />';
                    html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Collaborators: [xcxcollaborators]</span>';
                    html += '   <br />';
                    html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Informed: [xcxinformed]</span>';
                    html += '   <br />';

                    if (carouselItem_Id) {
                        html += '</div>';
                    }

                    var result = {
                        message: 'SUCCESS',
                        html: html,
                        bwBudgetRequestId: bwBudgetRequestId,
                        requestJson: requestJson,
                        executiveSummaryElement: executiveSummaryElement
                    }
                    resolve(result);

                } catch (e) {
                    debugger;
                    var msg = 'Exception in bwExecutiveSummariesCarousel2.js.getExecutiveSummaryHtmlForRequest():2: ' + e.message + ', ' + e.stack;
                    console.log(msg);
                    displayAlertDialog(msg);

                    var result = {
                        status: 'EXCEPTION',
                        message: msg
                    }

                    reject(result);

                }

            });
        } catch (e) {
            console.log('Exception in getExecutiveSummaryHtmlForRequest(): ' + e.message + ', ' + e.stack);
            alert('Exception in getExecutiveSummaryHtmlForRequest(): ' + e.message + ', ' + e.stack);
        }
    },
    getExecutiveSummaryHtmlForTask: function (bwWorkflowTaskItem, executiveSummaryIndex) { // requestJson, executiveSummaryIndex) { // Title, ProjectTitle, bwAssignedToRaciRoleAbbreviation, CreatedBy, RequestedCapital, OrgName, BudgetWorkflowStatus, Created) {
        try {
            var thiz = this;
            return new Promise(function (resolve, reject) {
                try {
                    console.log('In bwExecutiveSummariesCarousel2.js.getExecutiveSummaryHtmlForTask(). THIS GENERATES AN EXECUTIVE SUMMARY. THIS SHOULD BE HAPPENING IN bwCommonScripts.js.');
                    displayAlertDialog('In bwExecutiveSummariesCarousel2.js.getExecutiveSummaryHtmlForTask(). THIS GENERATES AN EXECUTIVE SUMMARY. THIS SHOULD BE HAPPENING IN bwCommonScripts.js.');

                    //var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

                    var requestTypes = $('.bwAuthentication').bwAuthentication('option', 'bwEnabledRequestTypes').EnabledItems;

                    var html = '';

                    //if (carouselItem_Id) { // Only add the surrounding div lements when there is carouselItem_Id.
                    //html += '   <div id="' + 'null' + '" title="xcx231466534-8" alt="xcx231466534-8" class="executiveSummaryInCarousel" bwbudgetrequestid="' + bwBudgetRequestId + '" style="min-width:300px;max-width:550px;display:inline-block;white-space:nowrap;color: rgb(38, 38, 38); font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif; font-size: 1.25em;" ';
                    ////this.carouselItem_AddOnClick(carouselItem_Id, bwBudgetRequestId, this.options.taskData[i].Title, this.options.taskData[i].ProjectTitle, this.options.taskData[i].bwAssignedToRaciRoleAbbreviation, bwWorkflowTaskItemId);
                    //var ProjectTitle_clean = String(requestJson.ProjectTitle).replace(/["]/g, '&quot;').replace(/[']/g, '\\&#39;'); //&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method.
                    //html += '   xcx="342523326-3"    onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'' + bwBudgetRequestId + '\', \'' + requestJson.Title + '\', \'' + ProjectTitle_clean + '\', \'' + requestJson.Title + '\', \'' + requestJson.bwAssignedToRaciRoleAbbreviation + '\', \'' + '' + '\');" ';
                    //html += '   >';
                    //}

                    var ProjectTitle_clean = String(bwWorkflowTaskItem.ProjectTitle).replace(/["]/g, '&quot;').replace(/[']/g, '\\&#39;'); //&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method. 

                    html += '<br />';
                    html += '<span style="color:black;font-size:18pt;font-weight:bold;">' + bwWorkflowTaskItem.bwTaskTitle + '</span>';

                    html += '<span style="float:right;color:#f5f6fa;font-weight:bold;">TASK</span>'; // The color is set to space white (#f5f6fa) here.




                    var bwBudgetRequestId = bwWorkflowTaskItem.bwRelatedItemId;




                    //
                    //
                    // This is the home page task hover over behaviour. This displays current workflow status.
                    //
                    //


                    // Added 5-23-2023.

                    html += '<br />';

                    html += '<span style="display:inline-block;float:right;" ';
                    //html += ' onmouseenter="$(\'.bwRequest\').bwRequest(\'displayRequestWorkflowAuditTrailDialog2\', \'BR-230248\', \'Another email test of attachments\', \'0f4cde7c-5c1d-494d-90a3-ada45a3502b4\', \'93b8e938-be88-474c-9010-5e945a5d80a6\', \'1a15689f-aea5-434a-bf6b-27a8cf17e464\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';

                    //alert('requestJson: ' + JSON.stringify(requestJson) + ', requestJson.bwRequestTypeId: ' + requestJson.bwRequestTypeId + ', requestJson.bwWorkflowId: ' + requestJson.bwWorkflowId);
                    //debugger;
                    var bwRequestTypeId = JSON.parse(bwWorkflowTaskItem.bwRequestJson).bwRequestTypeId;

                    //html += ' onmouseenter="$(\'.bwRequest\').bwRequest(\'displayRequestWorkflowAuditTrailDialog2\', \'' + requestJson.Title + '\', \'' + ProjectTitle_clean + '\', \'' + bwRequestTypeId + '\', \'' + bwBudgetRequestId + '\', \'' + '' + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                    html += ' onclick="$(\'.bwRequest\').bwRequest(\'displayRequestWorkflowAuditTrailDialog2\', \'' + bwWorkflowTaskItem.Title + '\', \'' + ProjectTitle_clean + '\', \'' + bwRequestTypeId + '\', \'' + bwBudgetRequestId + '\', \'' + '' + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';


                    html += ' onmouseleave="$(\'.bwCoreComponent:first\').bwCoreComponent(\'hideRowHoverDetails\');this.style.backgroundColor=\'white\';"';
                    html += '>';

                    html += '   <img xcx="xcx122333" class="gridMagnifyingGlass" src="/images/zoom.jpg" style="width:50px;height:50px;" >';

                    html += '</span>';



                    //
                    //
                    // end: This is the home page task hover over behaviour. This displays current workflow status.
                    //
                    //











                    html += '<br />';
                    html += '<span style="color:black;font-size:12pt;font-weight:normal;">Your role: <span style="font-weight:bold;">' + bwWorkflowTaskItem.bwAssignedToRaciRoleName + ' (' + bwWorkflowTaskItem.bwAssignedToRaciRoleAbbreviation + ')</span></span>';

                    html += '<br />';
                    var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(bwWorkflowTaskItem.Created);
                    html += '<span style="color:black;font-size:12pt;font-weight:normal;">Task created: ' + timestamp4.toString() + '</span>';

                    var daysSinceTaskCreated = 0;
                    if (bwWorkflowTaskItem.Created) {
                        var cd = bwWorkflowTaskItem.Created;
                        var year = cd.split('-')[0];
                        var month = cd.split('-')[1];
                        var day = cd.split('-')[2].split('T')[0];
                        var taskCreatedDate = new Date(Number(year), Number(month) - 1, Number(day) - 1); // +1 because we're using overdue date.
                        var todaysDate = new Date();
                        var utc1 = Date.UTC(taskCreatedDate.getFullYear(), taskCreatedDate.getMonth(), taskCreatedDate.getDate());
                        var utc2 = Date.UTC(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate());
                        var _MS_PER_DAY = 1000 * 60 * 60 * 24;
                        daysSinceTaskCreated = Math.floor((utc2 - utc1) / _MS_PER_DAY) - 1;
                    } else {
                        daysSinceTaskCreated = '<span title="This is likely an old task, created before the Create date format was changed." alt="This is likely an old task, created before the Create date format was changed.">[error xcx232135-1-3-1]</span>';
                    }

                    html += '<br />';

                    // Added 12-30-2022 because I don't think I am using bwStatus correctly here, am I???
                    html += '<span style="font-weight:normal;">WorkflowStepName: <span xcx="xcx12312-234431" style="display:inline-block;max-width:350px;font-weight:bold;font-size:25pt;color:green;overflow:hidden;">' + bwWorkflowTaskItem.WorkflowStepName + ' </span>';
                    html += '<br />';
                    //debugger; // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                    if (!(bwWorkflowTaskItem && bwWorkflowTaskItem.bwStatus)) {

                        html += 'In bwExecutiveSummariesCarousel2.js.getExecutiveSummaryHtmlForTask(). Invalid value for bwWorkflowTaskItem.bwStatus: ' + bwWorkflowTaskItem.bwStatus + ', bwWorkflowTaskItem.Title: ' + bwWorkflowTaskItem.Title + ', bwWorkflowTaskItem.WorkflowStepName: ' + bwWorkflowTaskItem.WorkflowStepName + ', bwWorkflowTaskItem.bwAssignedToRaciRoleAbbreviation: ' + bwWorkflowTaskItem.bwAssignedToRaciRoleAbbreviation;
                        alert('In bwExecutiveSummariesCarousel2.js.getExecutiveSummaryHtmlForTask(). Invalid value for bwWorkflowTaskItem.bwStatus: ' + bwWorkflowTaskItem.bwStatus + ', bwWorkflowTaskItem.Title: ' + bwWorkflowTaskItem.Title + ', bwWorkflowTaskItem.WorkflowStepName: ' + bwWorkflowTaskItem.WorkflowStepName + ', bwWorkflowTaskItem.bwAssignedToRaciRoleAbbreviation: ' + bwWorkflowTaskItem.bwAssignedToRaciRoleAbbreviation);

                    } else {
                        if (bwWorkflowTaskItem.bwStatus.toString().toLowerCase() == 'collaboration') {
                            html += '<span style="font-weight:normal;">bwStatus: <span xcx="xcx12312-1" style="font-weight:bold;font-size:25pt;color:green;">' + bwWorkflowTaskItem.bwStatus + ' </span>';
                            html += '<span style="color:black;font-size:12pt;font-weight:normal;" bwtrace="xcx23488-1">';
                            //html += '[xx time left]';
                            if (daysSinceTaskCreated == 1) {
                                html += '&nbsp;&nbsp;' + daysSinceTaskCreated.toString() + ' day old&nbsp;&nbsp;';
                            } else {
                                html += '&nbsp;&nbsp;' + daysSinceTaskCreated.toString() + ' days old&nbsp;&nbsp;';
                            }
                            html += '</span></span>';
                        } else {
                            html += '<span style="font-weight:normal;">bwStatus: <span xcx="xcx12312-2" style="display:inline-block;max-width:350px;font-weight:bold;font-size:25pt;color:green;overflow:hidden;">' + bwWorkflowTaskItem.bwStatus + ' </span>';
                            html += '<span style="color:black;font-size:12pt;font-weight:normal;" bwtrace="xcx23488-2">';
                            //html += '[xx days old]';
                            if (daysSinceTaskCreated == 1) {
                                html += '&nbsp;&nbsp;' + daysSinceTaskCreated.toString() + ' day old&nbsp;&nbsp;';
                            } else {
                                html += '&nbsp;&nbsp;' + daysSinceTaskCreated.toString() + ' days old&nbsp;&nbsp;';
                            }
                            html += '</span></span>';
                        }
                    }

                    html += '<br />';
                    var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(bwWorkflowTaskItem.DailyOverdueTaskNotificationDate);
                    html += '<span style="font-size:12pt;color:black;font-weight:normal;cursor:help !important;" title="This is when the next reminder is scheduled to be sent..." alt="This is when the next reminder is scheduled to be sent...">Reminder: <span style="font-weight:normal;">' + timestamp4 + ' </span></span>'; // font-family: 'Segoe UI Light','Segoe UI','Segoe',Tahoma,Helvetica,Arial,sans-serif;

                    html += '<br />';
                    html += '<hr style="color:skyblue;" />';

                    html += '<span style="font-size:12pt;"><span style="color:black;font-size:18pt;font-weight:bold;">' + bwWorkflowTaskItem.Title + '</span></span>';



                    //html += '                        <div style="position:absolute; bottom:0;float:left;width: 26px; height:26px; background-color:#f5f6fa; border-radius:26px 0 0 0;margin-left:1px;margin-bottom:-1px;"></div> <!-- The background-color is set to space white (#f5f6fa) here, for the "under the curve" color of this element. -->';
                    // debugger; // 4-20222



                    var requestSingletonName = '';
                    if (thiz.options.brData && thiz.options.brData.PendingBudgetRequests && thiz.options.brData.PendingBudgetRequests.length) {
                        for (var r = 0; r < thiz.options.brData.PendingBudgetRequests.length; r++) {
                            if (bwBudgetRequestId == thiz.options.brData.PendingBudgetRequests[r].bwBudgetRequestId) {
                                // We found it!
                                var bwRequestTypeId = thiz.options.brData.PendingBudgetRequests[r].bwRequestTypeId;
                                if (bwRequestTypeId) {
                                    for (var s = 0; s < requestTypes.length; s++) {
                                        if (bwRequestTypeId = requestTypes[s].bwRequestTypeId) {

                                            console.log('In bwExecutiveSymmariesCarousel2.js.getExecutiveSummaryHtmlForTask(). Getting requestTypes[s].SingletonName. Is this working now? 5-19-2023. bwRequestTypeId: ' + bwRequestTypeId + ', requestTypes[' + s + '].bwRequestTypeId: ' + requestTypes[s].bwRequestTypeId);
                                            //// debugger;
                                            requestSingletonName = requestTypes[s].SingletonName;
                                            break;
                                        }
                                    }
                                } else {
                                    requestSingletonName = 'XCX44456';
                                    break;
                                }
                            }
                        }
                    }
                    //html += '<span xcx="xcx99871" style="float:right;color:#f5f6fa;font-weight:bold;">' + requestSingletonName + ' xcx1:' + bwRequestTypeId + '</span>'; // The color is set to space white (#f5f6fa) here.
                    html += '<span xcx="xcx99871" style="float:right;color:#f5f6fa;font-weight:bold;">' + requestSingletonName + '</span>'; // The color is set to space white (#f5f6fa) here.
                    html += '<br />';





                    //
                    // This font-size is meant to be larger, since it is the ProjectTile of the request. 5-24-2022
                    //
                    html += '<div xcx="xcx2312-1" style="color:black;font-size:30pt;font-weight:bold;overflow:hidden;white-space:normal;">' + bwWorkflowTaskItem.ProjectTitle + '</div>'; // modified 12-26-2022
                    html += '<br />';
                    //debugger; // 11-24-2022
                    // Display the bwJustificationDetailsField in the executive summary. 
                    if (bwWorkflowTaskItem.bwRequestJson) {
                        var tmpbwRequestJson = JSON.parse(bwWorkflowTaskItem.bwRequestJson);
                        if (tmpbwRequestJson.bwJustificationDetailsField && tmpbwRequestJson.bwJustificationDetailsField.value) {
                            var ellippses = '';
                            if (String(tmpbwRequestJson.bwJustificationDetailsField.value).length > 255) {
                                ellippses = '...';
                            }

                            var strippedHtml = tmpbwRequestJson.bwJustificationDetailsField.value.replace(/<[^>]+>/g, '');
                            html += '   <div xcx="xcx2312-1-x2-2" style="color:darkgray;font-size:15pt;font-weight:bold;white-space:normal;max-width:750px;overflow:hidden;">' + String(strippedHtml).substring(0, 255) + ' ' + ellippses + '</div>';
                            html += '   <br />';
                        }
                    }


                    // Created by.
                    html += '<span style="color:black;font-size:12pt;font-weight:normal;">Requested by: ' + bwWorkflowTaskItem.CreatedBy + '</span>';
                    html += '<br />';
                    var RequestedCapital_cleaned = $('.bwAuthentication').bwAuthentication('getBudgetWorkflowStandardizedCurrency', bwWorkflowTaskItem.RequestedCapital);
                    html += '<span style="color:black;font-size:12pt;font-weight:normal;">Requested capital: <span style="color:purple;font-size:18pt;">' + RequestedCapital_cleaned + '</span></span>';
                    html += '<br />';


                    //html += '<span style="color:black;font-size:12pt;font-weight:normal;">Calculated capital: <span style="color:purple;font-size:18pt;">' + RequestedCapital_cleaned + '</span></span>';
                    //html += '<br />';



                    var timestamp4;
                    var requestCreatedDate;
                    if (thiz.options.brData && thiz.options.brData.PendingBudgetRequests && thiz.options.brData.PendingBudgetRequests.length) {
                        for (var r = 0; r < thiz.options.brData.PendingBudgetRequests.length; r++) {
                            if (bwBudgetRequestId == thiz.options.brData.PendingBudgetRequests[r].bwBudgetRequestId) {
                                // We found it!
                                requestCreatedDate = thiz.options.brData.PendingBudgetRequests[r].Created;
                            }
                        }
                    }
                    if (requestCreatedDate) {
                        timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(requestCreatedDate);
                    } else {
                        timestamp4 = '[not available]';
                    }
                    html += '<span style="color:black;font-size:12pt;font-weight:normal;">Request created: ' + timestamp4 + '</span>';
                    html += '<br />';





                    html += '<span style="color:black;font-size:12pt;font-weight:normal;">Org: <span style="">' + bwWorkflowTaskItem.OrgName + '</span></span>';
                    html += '<br />';
                    html += '<br />';


                    //html += '<span style="color:black;font-size:12pt;font-weight:normal;">Attachments xcx34235234: </span>';
                    //html += '<br />';

                    var bwWorkflowTaskItemId = bwWorkflowTaskItem.bwWorkflowTaskItemId;
                    html += '        <div class="executiveSummaryAttachments" id="bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_MyPendingTasks_' + bwWorkflowTaskItemId + '" style="text-align: center;">';
                    html += '        </div>';

                    //if (carouselItem_Id) { // Only add the surrounding div lements when there is carouselItem_Id.
                    //html += '   </div>';
                    //}

























                    //html += '<br />';

                    //html += '   <span style="font-size:12pt;"><span style="color:black;font-size:18pt;font-weight:bold;">' + requestJson.Title + '</span></span>';
                    //html += '   <br />';
                    //html += '   <span style="color:black;font-size:18pt;font-weight:bold;">' + requestJson.ProjectTitle + '</span>';
                    //html += '   <br />';
                    //html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Requested by: ' + requestJson.CreatedBy + '</span>';
                    //html += '   <br />';
                    //var RequestedCapital_cleaned = $('.bwAuthentication').bwAuthentication('getBudgetWorkflowStandardizedCurrency', requestJson.RequestedCapital);
                    //html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Requested capital: <span style="color:purple;font-size:18pt;">' + RequestedCapital_cleaned + '</span></span>';
                    //html += '   <br />';
                    //var timestamp4;
                    //var requestCreatedDate;
                    //requestCreatedDate = requestJson.Created;
                    //if (requestCreatedDate) {
                    //    timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(requestCreatedDate);
                    //} else {
                    //    timestamp4 = '[not available]';
                    //}
                    //html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Request created: ' + timestamp4 + '</span>';
                    //html += '   <br />';
                    //html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Org: <span style="">' + requestJson.OrgName + '</span></span>';
                    //html += '   <br />';
                    //html += '   <br />';

                    //html += '   <div id="bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_MyUnsubmittedRequests_' + bwBudgetRequestId + '" style="text-align: center;"></div>';



                    //html += '   <hr style="color:skyblue;" />';

                    //if (requestJson.BudgetWorkflowStatus) {
                    //    if (requestJson.BudgetWorkflowStatus.toString().toLowerCase() == 'collaboration') {
                    //        html += '<span style="color:black;font-size:18pt;font-weight:bold;">Workflow step: ' + requestJson.BudgetWorkflowStatus + '</span>';
                    //    } else {
                    //        html += '<span style="color:black;font-size:18pt;font-weight:bold;">Workflow step: ' + requestJson.BudgetWorkflowStatus + '</span>';
                    //    }
                    //} else {
                    //    html += '<span style="color:black;font-size:18pt;font-weight:bold;">Workflow step: ' + 'xcx99345 invalid BudgetWorkflowStatus' + '</span>';
                    //}

                    //html += '   <br />';
                    //html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Approvers: [xcxappovers1]</span>';
                    //html += '   <br />';
                    //html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Collaborators: [xcxcollaborators]</span>';
                    //html += '   <br />';
                    //html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Informed: [xcxinformed]</span>';
                    //html += '   <br />';

                    //if (carouselItem_Id) {
                    //    html += '</div>';
                    //}

                    var result = {
                        status: 'SUCCESS',
                        message: 'SUCCESS',
                        html: html,
                        bwBudgetRequestId: bwBudgetRequestId,
                        bwWorkflowTaskItem: bwWorkflowTaskItem,
                        executiveSummaryIndex: executiveSummaryIndex
                    }
                    resolve(result);

                } catch (e) {

                    var msg = 'Exception in getExecutiveSummaryHtmlForTask(): ' + e.mesage + ', ' + e.stack;
                    console.log(msg);
                    alert(msg);

                    var result = {
                        status: 'EXCEPTION',
                        message: msg
                    }

                    reject(result);

                }

            });
        } catch (e) {
            console.log('Exception in getExecutiveSummaryHtmlForTask(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in getExecutiveSummaryHtmlForTask(): ' + e.message + ', ' + e.stack);

            var result = {
                message: 'Exception in getExecutiveSummaryHtmlForTask(): ' + e.message + ', ' + e.stack
            }
            resolve(result); // Resolve for now, as this will just display the exception in the executive summary placeholder.... maybe not pretty yet. 8-22-2022
        }
    },

    renderAttachments: function (bwBudgetRequestId, executiveSummaryElement) {
        try {
            if (!bwBudgetRequestId) {

                console.log('In bwExecutiveSummariesCarousel2.js.renderAttachments(). INVALID VALUE FOR bwBudgetRequestId: ' + bwBudgetRequestId);
                displayAlertDialog('In bwExecutiveSummariesCarousel2.js.renderAttachments(). INVALID VALUE FOR bwBudgetRequestId: ' + bwBudgetRequestId);

            } else {

                console.log('In bwExecutiveSummariesCarousel2.js.renderAttachments(). bwBudgetRequestId: ' + bwBudgetRequestId);
                var thiz = this;

                //alert('In bwExecutiveSummariesCarousel2.js.renderAttachments(). bwBudgetRequestId: ' + bwBudgetRequestId);

                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

                var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                var data = {
                    bwParticipantId_LoggedIn: participantId,
                    bwActiveStateIdentifier: activeStateIdentifier,
                    bwWorkflowAppId_LoggedIn: workflowAppId,

                    bwWorkflowAppId: workflowAppId,
                    bwBudgetRequestId: bwBudgetRequestId
                }

                var operationUri = globalUrlPrefix + globalUrl + '/_files/' + 'getlistofattachmentsforbudgetrequest'; // _files allows us to use nginx to route these to a dedicated file server.
                $.ajax({
                    url: operationUri,
                    method: 'POST',
                    data: data,
                    timeout: 15000, // This is done because file services may need more time. 
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    },
                    success: function (results) {
                        try {

                            //alert('xcx1234378 DOES THIS NEED THE NEW CODE bwBudgetRequestId: ' + bwBudgetRequestId);

                            var html = $('.bwCoreComponent:first').bwCoreComponent('createHtmlToDisplayTheListOfAttachments_ForExecutiveSummary', thiz.options.elementIdSuffix, workflowAppId, bwBudgetRequestId, null, results);


                            if (bwBudgetRequestId) {
                                if (html != '') {

                                    //alert('Getting ready to render attachments for bwBudgetRequestId: ' + bwBudgetRequestId + ', in carouselItem_Id: ' + carouselItem_Id);

                                    var html2 = '';
                                    html2 += '<div>';
                                    html2 += '<span style="color:black;font-size:12pt;font-weight:normal;float:left;" xcx="xcx1231sd2-1">Attachment(s): </span>'; // Add the title, since we have some items to display.
                                    html2 += '<br />';
                                    html = html2 + html + '</div>';

                                    //alert('>>>>>>>>> rendering attachments in element [' + 'bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_MyUnsubmittedRequests_' + bwBudgetRequestId + ']');

                                    //$('#bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_MyUnsubmittedRequests_' + bwBudgetRequestId).append(html); // sectionElementPrefix

                                    // For example: carouselItem_Id: bwExecutiveSummariesCarousel2_executiveSummaryInCarousel_2
                                    //var executiveSummaries = $('#' + carouselItem_Id).find('.executiveSummaryInCarousel');
                                    //var executiveSummaries = $(accordionDrawerElement).find('.executiveSummaryInCarousel');
                                    //if (executiveSummaries && executiveSummaries.length && executiveSummaries.length > 0) {

                                    //    //alert('executiveSummaries.length: ' + executiveSummaries.length);

                                    //    for (var i = 0; i < executiveSummaries.length; i++) {
                                    //        var budgetRequestId = $(executiveSummaries[i]).attr('bwbudgetrequestid');
                                    //        if (bwBudgetRequestId == budgetRequestId) {

                                    //console.log('trying to locate attachments element....');

                                    var executiveSummaryAttachmentsElement = $(executiveSummaryElement).find('.executiveSummaryAttachments')[0];
                                    $(executiveSummaryAttachmentsElement).append(html); // Display the attachment.

                                    //displayAlertDialog('>>>>>>>>> Rendering attachments in element [' + executiveSummaryAttachmentsElement.id + ']');

                                    //            break;
                                    //        }
                                    //    }
                                    //}





                                }
                            }
                        } catch (e) {
                            if (e.number) {
                                displayAlertDialog('Error in renderAttachments():1-1: ' + e.number + ', "' + e.message + '", ' + e.stack);
                            } else {
                                // This most likely means that the folders are there on the file services server, but there is nothing in them.
                                //
                                // Fileservices has an error, so show nothing! We will put a red exclamation pin in the attachments section eventually! - 10-1-17 todd
                                //displayAlertDialog('Fileservices has an error: ' + ' "' + e.message + '"');
                            }
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        if (errorCode === 'timeout' && errorMessage === 'timeout') {
                            displayAlertDialog('SERVICE UNAVAILABLE. File services is not respondingxcx2. communication timeout is set at ' + ajaxTimeout / 1000 + ' seconds: ' + errorCode + ', ' + errorMessage);
                        } else {


                            console.log('');
                            console.log('********************************************************************');
                            console.log('Error in bwExecutiveSummariesCarousel2.js.showRowHoverDetails:2:3 ' + errorCode + ', ' + errorMessage);
                            console.log('********************************************************************');
                            console.log('');

                            //displayAlertDialog('Error in showRowHoverDetails:2:3 ' + errorCode + ', ' + errorMessage);





                            // The latest error 1-17-2018 is errorCode:'error' and errorMessage:'Not Found'.
                            // What does this mean? You can replicate this error!
                            // at Url: https://budgetworkflow.com/ios8.html, view an offline (Un-submitted) request, and try to add an attachment.
                        }
                    }
                });
            }
        } catch (e) {
            console.log('Exception in bwExecutiveSummariesCarousel2.js.renderAttachments(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwExecutiveSummariesCarousel2.js.renderAttachments(): ' + e.message + ', ' + e.stack);
        }
    },
    //renderAttachments_ForExecutiveSummary: function (bwBudgetRequestId, bwWorkflowTaskItemId, executiveSummaryElement) {
    renderAttachments_ForExecutiveSummary: function (bwBudgetRequestId, executiveSummaryElement) {
        try {
            console.log('In bwExecutiveSummariesCarousel2.js.renderAttachments_ForExecutiveSummary().');
            //alert('In bwExecutiveSummariesCarousel2.js.renderAttachments_ForExecutiveSummary().');

            //if (!(bwBudgetRequestId && bwWorkflowTaskItemId)) {
            if (!(bwBudgetRequestId)) {

                console.log('In bwExecutiveSummariesCarousel2.js.renderAttachments_ForExecutiveSummary(). Unexpected value(s) for bwBudgetRequestId and/or bwWorkflowTaskItemId. bwBudgetRequestId: ' + bwBudgetRequestId); //  + ', bwWorkflowTaskItemId: ' + bwWorkflowTaskItemId);
                displayAlertDialog('In bwExecutiveSummariesCarousel2.js.renderAttachments_ForExecutiveSummary(). Unexpected value(s) for bwBudgetRequestId and/or bwWorkflowTaskItemId. bwBudgetRequestId: ' + bwBudgetRequestId); //  + ', bwWorkflowTaskItemId: ' + bwWorkflowTaskItemId);

            } else {

                console.log('In bwExecutiveSummariesCarousel2.js.renderAttachments_ForExecutiveSummary(). bwBudgetRequestId: ' + bwBudgetRequestId); // + ', bwWorkflowTaskItemId: ' + bwWorkflowTaskItemId);
                var thiz = this;

                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

                var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                var data = {
                    bwParticipantId_LoggedIn: participantId,
                    bwActiveStateIdentifier: activeStateIdentifier,
                    bwWorkflowAppId_LoggedIn: workflowAppId,

                    bwWorkflowAppId: workflowAppId,
                    bwBudgetRequestId: bwBudgetRequestId
                }

                var operationUri = globalUrlPrefix + globalUrl + '/_files/' + 'getlistofattachmentsforbudgetrequest'; // _files allows us to use nginx to route these to a dedicated file server.
                $.ajax({
                    url: operationUri,
                    method: 'POST',
                    data: data,
                    //timeout: 15000, // This is done because file services may need more time. // commented out 11-16-2022
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    },
                    success: function (results) {
                        try {

                            var bwWorkflowTaskItemId;

                            var html = $('.bwCoreComponent:first').bwCoreComponent('createHtmlToDisplayTheListOfAttachments_ForExecutiveSummary', thiz.options.elementIdSuffix, workflowAppId, bwBudgetRequestId, bwWorkflowTaskItemId, results);

                            if (bwBudgetRequestId) {
                                if (html != '') {

                                    //alert('Getting ready to render attachments for bwBudgetRequestId: ' + bwBudgetRequestId + ', in carouselItem_Id: ' + carouselItem_Id);

                                    var html2 = '';
                                    html2 += '<div>';
                                    html2 += '<span style="color:black;font-size:12pt;font-weight:normal;float:left;" xcx="xcx1231sd2-2">Attachment(s): </span>'; // Add the title, since we have some items to display.
                                    html2 += '<br />';
                                    html = html2 + html + '</div>';

                                    //alert('>>>>>>>>> rendering attachments in element [' + 'bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_MyUnsubmittedRequests_' + bwBudgetRequestId + ']');

                                    //$('#bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_MyUnsubmittedRequests_' + bwBudgetRequestId).append(html); // sectionElementPrefix

                                    // For example: carouselItem_Id: bwExecutiveSummariesCarousel2_executiveSummaryInCarousel_2
                                    //var executiveSummaries = $(accordionDrawerElement).find('.executiveSummaryInCarousel');
                                    //if (executiveSummaries && executiveSummaries.length && executiveSummaries.length > 0) {

                                    //    //alert('executiveSummaries.length: ' + executiveSummaries.length);

                                    //    for (var i = 0; i < executiveSummaries.length; i++) {
                                    var budgetRequestId = $(executiveSummaryElement).attr('bwbudgetrequestid');
                                    //var workflowTaskItemId = $(executiveSummaryElement).attr('bwworkflowtaskitemid');
                                    //if ((bwBudgetRequestId == budgetRequestId) && (bwWorkflowTaskItemId == workflowTaskItemId)) {
                                    if ((bwBudgetRequestId == budgetRequestId)) {

                                        //var executiveSummaryIndex = i;
                                        //console.log('trying to locate attachments element....');

                                        var executiveSummaryAttachmentsElement = $(executiveSummaryElement).find('.executiveSummaryAttachments')[0];
                                        $(executiveSummaryAttachmentsElement).append(html); // Display the attachment.

                                        //displayAlertDialog('>>>>>>>>> Rendering attachments in element [' + executiveSummaryAttachmentsElement.id + ']');

                                        //            break;
                                        //        }
                                        //    }
                                    }





                                }
                            }
                        } catch (e) {
                            if (e.number) {
                                displayAlertDialog('Error in renderAttachments_ForExecutiveSummary():1-1: ' + e.number + ', "' + e.message + '", ' + e.stack);
                            } else {
                                // This most likely means that the folders are there on the file services server, but there is nothing in them.
                                //
                                // Fileservices has an error, so show nothing! We will put a red exclamation pin in the attachments section eventually! - 10-1-17 todd
                                displayAlertDialog('Fileservices has an error: ' + ' "' + e.message + '". ' + e.stack);
                            }
                        }
                    },
                    error: function (jqXHR, settings, errorThrown) {

                        //if (errorCode === 'timeout' && errorMessage === 'timeout') {
                        //    displayAlertDialog('SERVICE UNAVAILABLE. File services is not respondingxcx2. communication timeout is set at ' + ajaxTimeout / 1000 + ' seconds: ' + errorCode + ', ' + errorMessage);
                        //} else {

                        //    console.log('');
                        //    console.log('********************************************************************');
                        //    console.log('Error in bwExecutiveSummariesCarousel2.js.renderAttachments_ForExecutiveSummary:2:3 ' + errorCode + ', ' + errorMessage);
                        //    console.log('********************************************************************');
                        //    console.log('');

                        //    displayAlertDialog('Error in bwExecutiveSummariesCarousel2.js.renderAttachments_ForExecutiveSummary:2:3 ' + errorCode + ', ' + errorMessage);





                        // The latest error 1-17-2018 is errorCode:'error' and errorMessage:'Not Found'.
                        // What does this mean? You can replicate this error!
                        // at Url: https://budgetworkflow.com/ios8.html, view an offline (Un-submitted) request, and try to add an attachment.

                        //}


                        if (jqXHR.status == 401) { // HTTP 401 "Unauthorized".

                            console.log('HTTP 401 "Unauthorized".');
                            console.log('HTTP 401 "Unauthorized".');
                            console.log('Error in bwExecutiveSummariesCarousel2.js.renderAttachments_ForExecutiveSummary:2:3 Unauthorized. Please refresh your browser and log in again. jqXHR.status: ' + jqXHR.status + ', settings: ' + settings + ', errorThrown: ' + errorThrown);
                            console.log('HTTP 401 "Unauthorized".');
                            console.log('HTTP 401 "Unauthorized".');

                        } else {
                            console.log('Error in bwExecutiveSummariesCarousel2.js.renderAttachments_ForExecutiveSummary:2:3: ' + settings + ', ' + errorThrown + ' I suspect this may be a service unavailable error but not sure by any means! More investigation needed!' + JSON.stringify(jqXHR));
                            alert('Error in bwExecutiveSummariesCarousel2.js.renderAttachments_ForExecutiveSummary:2:3: ' + settings + ', ' + errorThrown + ' I suspect this may be a service unavailable error but not sure by any means! More investigation needed!' + JSON.stringify(jqXHR));
                        }

                    }
                });
            }
        } catch (e) {
            console.log('Exception in bwExecutiveSummariesCarousel2.js.renderAttachments_ForExecutiveSummary(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwExecutiveSummariesCarousel2.js.renderAttachments_ForExecutiveSummary(): ' + e.message + ', ' + e.stack);
        }
    },
    //renderInventoryItems_ForExecutiveSummary: function (bwBudgetRequestId, bwWorkflowTaskItemId, executiveSummaryElement, bwRequestJson) {
    renderInventoryItems_ForExecutiveSummary: function (bwBudgetRequestId, executiveSummaryElement, bwRequestJson2) {
        try {
            console.log('In bwExecutiveSummariesCarousel2.js.renderInventoryItems_ForExecutiveSummary().');
            //alert('In bwExecutiveSummariesCarousel2.js.renderInventoryItems_ForExecutiveSummary(). executiveSummaryElement: ' + executiveSummaryElement);

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            // At the moment it is sometimes coming in as a string. For now we are doing this.
            var bwRequestJson;
            try {
                bwRequestJson = JSON.parse(bwRequestJson2);
            } catch (e) {
                bwRequestJson = bwRequestJson2;
            }

            //var bwRequestJson = JSON.parse(bwRequestJson2);

            // Display inventory images
            //
            // 
            var InventoryItems = [];
            //for (var j = 0; j < thiz.options.myUnsubmittedRequests.length; j++) {
            //    if (bwBudgetRequestId == thiz.options.myUnsubmittedRequests[j].bwBudgetRequestId) {
            //        var tmpJson = thiz.options.myUnsubmittedRequests[j].bwRequestJson;
            //if (bwRequestJson) {
            //alert('xcx21437 bwRequestJson: ' + JSON.stringify(bwRequestJson));
            //var json = JSON.parse(bwRequestJson);
            if (bwRequestJson && bwRequestJson.bwSelectInventoryItems && bwRequestJson.bwSelectInventoryItems.value) {
                InventoryItems = bwRequestJson.bwSelectInventoryItems.value;
            }
            //}
            //        break;
            //    }
            //}

            if (InventoryItems.length > 0) {
                //alert('InventoryItems.length: ' + InventoryItems.length);
                var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
                var html = '';

                for (var j = 0; j < InventoryItems.length; j++) {

                    //var imagePath = globalUrlPrefix + globalUrl + '/_files/' + workflowAppId + '/inventoryimages/' + InventoryItems[j].bwInventoryItemId + '/inventoryimage.png?v=' + guid;
                    //html += '   <img xcx="xcx213467" src="' + imagePath + '" style="height:150px;" />';

                    var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

                    if (activeStateIdentifier.status != 'SUCCESS') {

                        html += '[No image. Unauthorized. xcx213124-3]';

                    } else {

                        //html += '<img xcx="xcx443321-8-1" src="' + fileUrl_Thumbnail + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier + '" style="height:150px;max-width:500px;border:1px solid gray;border-radius:0 30px 0 0;" ';
                        var imagePath = globalUrlPrefix + globalUrl + '/_files/' + workflowAppId + '/inventoryimages/' + InventoryItems[j].bwInventoryItemId + '/inventoryimage.png?v=' + guid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;
                        html += '   <img xcx="xcx443321-8-3" style="height:150px;display:inline-block;padding:0 10px 0 10px;" src="' + imagePath + '" />';

                    }


                }


                if (html != '') {

                    var html2 = '';
                    html2 += '<div xcx="xcx1324367-1">';
                    html2 += '<span style="color:black;font-size:12pt;font-weight:normal;float:left;">Inventory item(s): </span>'; // Add the title, since we have some items to display.
                    html2 += '<br />';
                    html2 += '<div xcx="xcx1324367-2" style="flex-wrap: wrap;display:flex;">'; // This will make all th eimages wrap and stay in their div container on the form.

                    html = html2 + html;

                    html += '</div>';
                    html += '</div>';





                    //$('#bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_MyUnsubmittedRequests_' + bwBudgetRequestId).append(html); 
                    //alert('Adding inventory images. xcx12321342534 InventoryItems.length: ' + InventoryItems.length + ', workflowTaskItemId: ' + workflowTaskItemId + ', html: ' + html);
                    //$('#bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_MyUnsubmittedRequests_' + workflowTaskItemId).append(html);


                    //var executiveSummaries = $(accordionDrawerElement).find('.executiveSummaryInCarousel');
                    //if (executiveSummaries && executiveSummaries.length && executiveSummaries.length > 0) {

                    //    //alert('executiveSummaries.length: ' + executiveSummaries.length);

                    //    for (var i = 0; i < executiveSummaries.length; i++) {
                    var budgetRequestId = $(executiveSummaryElement).attr('bwbudgetrequestid');
                    var workflowTaskItemId = $(executiveSummaryElement).attr('bwworkflowtaskitemid');
                    //if ((bwBudgetRequestId == budgetRequestId) && (bwWorkflowTaskItemId == workflowTaskItemId)) {
                    if ((bwBudgetRequestId == budgetRequestId)) {

                        //console.log('trying to locate attachments element....');

                        var executiveSummaryAttachmentsElement = $(executiveSummaryElement).find('.executiveSummaryAttachments')[0];
                        $(executiveSummaryAttachmentsElement).append(html); // Display the attachment.

                        //displayAlertDialog('>>>>>>>>> Rendering attachments in element [' + executiveSummaryAttachmentsElement.id + ']');

                        //        break;
                        //    }
                        //}
                    }




                }



                //$('#bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_' + bwWorkflowTaskItemId).append(html);
            }
            //
            // end: Display inventory images
            //

        } catch (e) {
            console.log('Exception in bwExecutiveSummariesCarousel2.js.renderInventoryItems_ForExecutiveSummary(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwExecutiveSummariesCarousel2.js.renderInventoryItems_ForExecutiveSummary(): ' + e.message + ', ' + e.stack);
        }
    },

    collapseAllAlertsSection: function () {
        try {
            console.log('In bwExecutiveSummariesCarousel2.js.collapseAllAlertsSection().');
            console.warn('In bwExecutiveSummariesCarousel2.js.collapseAllAlertsSection().');

            var collapsibleRowIds = ['alertSectionRow_bwExecutiveSummariesCarousel2_6', 'alertSectionRow_bwExecutiveSummariesCarousel2_5', 'alertSectionRow_bwExecutiveSummariesCarousel2_2', 'alertSectionRow_bwExecutiveSummariesCarousel2_4', 'alertSectionRow_bwExecutiveSummariesCarousel2_1', 'alertSectionRow_0_2'];

            for (var i = 0; i < collapsibleRowIds.length; i++) {
                var img = document.getElementById(collapsibleRowIds[i]);

                var urlOpen = 'images/drawer-open.png';

                if (document.getElementById(collapsibleRowIds[i]) && document.getElementById(collapsibleRowIds[i]).style) {
                    document.getElementById(collapsibleRowIds[i]).style.display = 'none';
                } else {
                    console.log('Error in bwExecutiveSummariesCarousel2.js.collapseAllAlertsSection(). Could not find element: ' + collapsibleRowIds[i])
                }

                try {
                    img.src = urlOpen;
                } catch (e) { }
            }

            //var elementIds = ['', 'alertSectionRow_1_1', 'alertSectionRow_1_2', 'alertSectionRow_1_3'];
            //var imageElementIds = ['', 'alertSectionImage_1_1', 'alertSectionImage_1_2', 'alertSectionImage_1_3'];
            //var selectedIndex = collapsibleRowId.split('_')[2];
            //var img = document.getElementById(imageId);

            //if (!img) {
            //    // This most likely means there are no tasks for this user ("My Tasks"). Do nothing.
            //} else {

            //    var urlClose = 'images/drawer-close.png';
            //    var urlOpen = 'images/drawer-open.png';

            //    if (img.src.indexOf(urlClose) > -1) {
            //        document.getElementById(collapsibleRowId).style.display = 'none';
            //        document.getElementById(imageId).src = urlOpen;
            //    } else {
            //        document.getElementById(collapsibleRowId).style.display = 'table-row';
            //        document.getElementById(imageId).src = urlClose;

            //        var bwDisplayFormat = localStorage.getItem('bwDisplayFormat');
            //        //alert('bwDisplayFormat: ' + bwDisplayFormat);

            //        if (collapsibleRowId == 'alertSectionRow_bwExecutiveSummariesCarousel2_2') {

            //            // Active Requests
            //            if (bwDisplayFormat == 'ExecutiveSummaries') {
            //                this.renderExecutiveSummaries_AllActiveRequests();
            //            } else if (bwDisplayFormat == 'DetailedList') {
            //                this.renderDetailedList_AllActiveRequests();
            //            } else {
            //                //localStorage.setItem('bwDisplayFormat', 'DetailedList');
            //                this.renderDetailedList_AllActiveRequests();
            //            }

            //            // Make sure the other sections are collapsed. Only one expanded at a time. 7-22-2022
            //            document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_4').style.display = 'none';
            //            document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_4').src = urlOpen;

            //            document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_1').style.display = 'none';
            //            if (document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_1') && document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_1').src) {
            //                document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_1').src = urlOpen;
            //            }

            //            try {
            //                document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_5').style.display = 'none';
            //                document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_5').src = urlOpen;
            //            } catch (e) {
            //            }

            //        } else if (collapsibleRowId == 'alertSectionRow_bwExecutiveSummariesCarousel2_4') {

            //            // My Submitted Requests
            //            if (bwDisplayFormat == 'ExecutiveSummaries') {
            //                this.renderExecutiveSummaries_MySubmittedRequests();
            //            } else if (bwDisplayFormat == 'DetailedList') {
            //                this.renderDetailedList_MySubmittedRequests();
            //            } else {
            //                //localStorage.setItem('bwDisplayFormat', 'DetailedList');
            //                this.renderDetailedList_MySubmittedRequests();
            //            }

            //            // Make sure the other sections are collapsed. Only one expanded at a time. 7-22-2022
            //            document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_2').style.display = 'none';
            //            document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_2').src = urlOpen;

            //            document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_1').style.display = 'none';
            //            if (document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_1') && document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_1').src) {
            //                document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_1').src = urlOpen;
            //            }

            //            try {
            //                document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_5').style.display = 'none';
            //                document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_5').src = urlOpen;
            //            } catch (e) {
            //            }

            //        } else if (collapsibleRowId == 'alertSectionRow_bwExecutiveSummariesCarousel2_1') {

            //            // My Pending Tasks
            //            if (bwDisplayFormat == 'ExecutiveSummaries') {
            //                this.renderExecutiveSummaries_MyPendingTasks();
            //            } else if (bwDisplayFormat == 'DetailedList') {
            //                this.renderDetailedList_MyPendingTasks();
            //            } else {
            //                //localStorage.setItem('bwDisplayFormat', 'DetailedList');
            //                this.renderDetailedList_MyPendingTasks();
            //            }

            //            // Make sure the other sections are collapsed. Only one expanded at a time. 7-22-2022
            //            document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_2').style.display = 'none';
            //            document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_2').src = urlOpen;

            //            document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_4').style.display = 'none';
            //            document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_4').src = urlOpen;

            //            try {
            //                document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_5').style.display = 'none';
            //                document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_5').src = urlOpen;
            //            } catch (e) {
            //            }

            //        } else if (collapsibleRowId == 'alertSectionRow_bwExecutiveSummariesCarousel2_5') {

            //            // My Unsubmitted Requests
            //            if (bwDisplayFormat == 'ExecutiveSummaries') {
            //                this.renderExecutiveSummaries_MyUnsubmittedRequests();
            //            } else if (bwDisplayFormat == 'DetailedList') {
            //                this.renderDetailedList_MyUnsubmittedRequests();
            //            } else {
            //                //localStorage.setItem('bwDisplayFormat', 'DetailedList');
            //                this.renderDetailedList_MyUnsubmittedRequests();
            //            }

            //            // Make sure the other sections are collapsed. Only one expanded at a time. 7-22-2022
            //            var alertSectionRow_1 = document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_1');
            //            if (alertSectionRow_1 && alertSectionRow_1.style && alertSectionRow_1.style.display && alertSectionRow_1.src) {
            //                document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_1').style.display = 'none';
            //                document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_1').src = urlOpen;
            //            }

            //            var alertSectionRow_2 = document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_2');
            //            if (alertSectionRow_2 && alertSectionRow_2.style && alertSectionRow_2.style.display && alertSectionRow_2.src) {
            //                document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_2').style.display = 'none';
            //                document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_2').src = urlOpen;
            //            }

            //            var alertSectionRow_4 = document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_4');
            //            if (alertSectionRow_4 && alertSectionRow_4.style && alertSectionRow_4.style.display && alertSectionRow_4.src) {
            //                document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_4').style.display = 'none';
            //                document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_4').src = urlOpen;
            //            }

            //        }

            //    }

            //}

        } catch (e) {
            console.log('Exception in bwExecutiveSummariesCarousel2.js.collapseAllAlertsSection(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwExecutiveSummariesCarousel2.js.collapseAllAlertsSection(): ' + e.message + ', ' + e.stack);
        }
    },




    //renderExecutiveSummaries_AllActiveRequests: function (spinnerText) {
    //    try {
    //        console.log('In bwExecutiveSummariesCarousel2.renderExecutiveSummaries_AllActiveRequests(). WE DONT USE THIS ANYMORE. USE renderExecutiveSummaries_ACTIVE_REQUESTS INSTEAD.');
    //        alert('In bwExecutiveSummariesCarousel2.renderExecutiveSummaries_AllActiveRequests(). WE DONT USE THIS ANYMORE. USE renderExecutiveSummaries_ACTIVE_REQUESTS INSTEAD.');
    //        var thiz = this;

    //        localStorage.setItem('bwDisplayFormat', 'ExecutiveSummaries');

    //        $('#buttonDisplayRequestsAsDetailedList_AllActiveRequests').removeClass().addClass('divCarouselButton'); // Unselect the other buttons.
    //        $('#buttonDisplayRequestsAsTiles_AllActiveRequests').removeClass().addClass('divCarouselButton_Selected'); // Select this one. 

    //        var accordionDrawerElement;
    //        var accordionDrawerElements = $('.bwAccordionDrawer');
    //        for (var i = 0; i < accordionDrawerElements.length; i++) {
    //            if ($(accordionDrawerElements[i]).attr('bwaccordiondrawertype') == 'ACTIVE_REQUESTS') {
    //                accordionDrawerElement = accordionDrawerElements[i];
    //                break;
    //            }
    //        }

    //        var requestsSummaryDetails = $('.bwAuthentication:first').bwAuthentication('option', 'ACTIVE_REQUESTS');
    //        var requests = requestsSummaryDetails.docs;

    //        if (!requests) {

    //            var msg = 'Error: No data loaded for ACTIVE_REQUESTS.';
    //            console.log(msg);
    //            displayAlertDialog(msg);

    //        } else {

    //            $(accordionDrawerElement).html('');

    //            var elementId = $(accordionDrawerElement).attr('id');
    //            if (!document.getElementById(elementId)) {
    //                displayAlertDialog('xcx99923556-1. Could not find elementId: ' + elementId);
    //            } else {
    //                document.getElementById(elementId).style.display = 'inline';
    //            }

    //            var rowElement = $(accordionDrawerElement).closest('table').closest('tr');
    //            var rowElementId = $(rowElement).attr('id');
    //            if (!document.getElementById(elementId)) {
    //                displayAlertDialog('xcx99923556-2. Could not find elementId: ' + elementId);
    //            } else {
    //                document.getElementById(rowElementId).style.display = 'none';
    //            }

    //            //var titleElement = $(rowElement).prev().find('.bwAccordionDrawerTitle');
    //            //$(titleElement).html('There are ' + this.options.brData.PendingBudgetRequests.length + ' active requests.');


    //            var imageId = 'alertSectionImage_0_2';
    //            var imageRootPath = globalUrlPrefix + globalUrl;

    //            var titleElement = $(rowElement).prev().find('.bwAccordionDrawerTitle').closest('td');
    //            var title;
    //            if (requests && requests.length && (requests.length > 0)) {
    //                if (requests.length == 1) {
    //                    title = '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
    //                } else {
    //                    title = '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;float:none;" src="' + imageRootPath + '/images/drawer-open.png">';
    //                }
    //            }
    //            title += '<span class="bwNoUserSelect bwAccordionDrawerTitle">&nbsp;There are ' + requests.totalDocs + ' active requests.</span>';
    //            $(titleElement).html(title);








    //            var carouselItemIndex = 0;
    //            for (var i = 0; i < requests.length; i++) {
    //                if (carouselItemIndex < 100) { // This is where we set how many tasks we will display in the carousel. Zero-based, so < 5 means display 5 tasks.

    //                    // class="bwAccordionDrawer bwFunctionalAreaRow" bwaccordiondrawertype="OFFLINE_REQUESTS" // MY_UNSUBMITTED_REQUESTS, ACTIVE_REQUESTS, MY_SUBMITTED_REQUESTS, MY_PENDING_TASKS, OFFLINE_REQUESTS

    //                    //var carouselItem_Id = 'bwExecutiveSummariesCarousel2_executiveSummaryInCarousel_' + carouselItemIndex;

    //                    //var html = '';

    //                    ////displayAlertDialog('xcx324235 this.options.brData.PendingBudgetRequests[i]: ' + JSON.stringify(this.options.brData.PendingBudgetRequests[i]));

    //                    //html += '   <div id="' + carouselItem_Id + '" title="xcx231466534-4" alt="xcx231466534-4" class="executiveSummaryInCarousel" bwbudgetrequestid="' + this.options.brData.PendingBudgetRequests[i].bwBudgetRequestId + '" style="min-width:300px;max-width:550px;display:inline-block;white-space:nowrap;color: rgb(38, 38, 38); font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif; font-size: 1.25em;" ';


    //                    //var ProjectTitle_clean = '[no value for ProjectTitle]';
    //                    //if (this.options.brData.PendingBudgetRequests[i].ProjectTitle) {
    //                    //    ProjectTitle_clean = String(this.options.brData.PendingBudgetRequests[i].ProjectTitle).replace(/["]/g, '&quot;').replace(/[']/g, '\\&#39;'); //&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method.
    //                    //}
    //                    //html += '   xcx="342523326-5"    onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'' + this.options.brData.PendingBudgetRequests[i].bwBudgetRequestId + '\', \'' + this.options.brData.PendingBudgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + this.options.brData.PendingBudgetRequests[i].Title + '\', \'' + this.options.brData.PendingBudgetRequests[i].bwAssignedToRaciRoleAbbreviation + '\', \'' + '' + '\');" ';
    //                    //html += '   >';

    //                    //html += '</div>';

    //                    ////$('#divBwExecutiveSummariesCarousel_AllActiveRequests').append(html);
    //                    //$(accordionDrawerElement).append(html);

    //                    console.log('xcx12323 rendering executive summary.');


    //                    var title = 'Executive Summary for: ' + requests[i].Title + '. ' + ProjectTitle_clean;

    //                    var executiveSummaryElement = document.createElement('div');
    //                    //executiveSummaryElement.id = carouselItem_Id;
    //                    executiveSummaryElement.classList.add('executiveSummaryInCarousel');
    //                    executiveSummaryElement.setAttribute('bwbudgetrequestid', requests[i].bwBudgetRequestId);
    //                    executiveSummaryElement.title = title;
    //                    executiveSummaryElement.alt = title;
    //                    executiveSummaryElement.style.minWidth = '300px';
    //                    executiveSummaryElement.style.maxWidth = '550px';
    //                    executiveSummaryElement.style.display = 'inline-block';
    //                    executiveSummaryElement.style.whiteSpace = 'nowrap';
    //                    executiveSummaryElement.style.color = 'rgb(38, 38, 38)';
    //                    executiveSummaryElement.style.fontFamily = '"Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif';
    //                    executiveSummaryElement.style.fontSize = '1.25em';

    //                    var ProjectTitle_clean = String(requests[i].ProjectTitle).replace(/["]/g, '&quot;').replace(/[']/g, '\\&#39;'); //&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method.
    //                    executiveSummaryElement.setAttribute('onclick', '$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'' + requests[i].bwBudgetRequestId + '\', \'' + requests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + requests[i].Title + '\', \'' + requests[i].bwAssignedToRaciRoleAbbreviation + '\', \'' + '7777xcx7777777-32444-4' + '\');');

    //                    $(accordionDrawerElement).append(executiveSummaryElement);





    //                    console.log('Calling renderExecutiveSummaryForRequest(). xcx332-7');
    //                    alert('Calling renderExecutiveSummaryForRequest(). xcx332-7');
    //                    var promise = this.renderExecutiveSummaryForRequest(requests[i], executiveSummaryElement); //'divBwExecutiveSummariesCarousel_AllActiveRequests');
    //                    promise.then(function (result) {
    //                        // Do nothing.
    //                    }).catch(function (e) {
    //                        alert('Exception in bwExecutiveSummariesCarousel2.js.renderExecutiveSummaries_AllActiveRequests(). xcx33995-2-3: ' + JSON.stringify(e));
    //                    });

    //                    carouselItemIndex += 1;

    //                } else {
    //                    break;
    //                }
    //            }


    //            //
    //            //
    //            // 2-19-2024. IS THIS THE BEST PLACE TO BACKFILL THE EXECUTIVE SUMMARRIES? xcx1231421-7
    //            //
    //            //

    //            alert('2-19-2024. IS THIS THE BEST PLACE TO BACKFILL THE EXECUTIVE SUMMARRIES? xcx1231421-7');






    //        }
    //        //console.log('In bwExecutiveSummariesCarousel2.renderExecutiveSummaries_AllActiveRequests().');
    //        //localStorage.setItem('bwDisplayFormat', 'ExecutiveSummaries');

    //        //$('#buttonDisplayRequestsAsDetailedList_AllActiveRequests').removeClass().addClass('divCarouselButton'); // Unselect the other buttons.
    //        //$('#buttonDisplayRequestsAsTiles_AllActiveRequests').removeClass().addClass('divCarouselButton_Selected'); // Select this one. 

    //        //$('#divBwExecutiveSummariesCarousel_AllActiveRequests').html('');

    //        ////alert('In bwExecutiveSummariesCarousel2.renderExecutiveSummaries_AllActiveRequests().');
    //        //var thiz = this;

    //        //// debugger;
    //        //var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

    //        //var requestTypes = $('.bwAuthentication').bwAuthentication('option', 'bwEnabledRequestTypes').EnabledItems;



    //        //var carouselItemIndex = 0;
    //        //for (var i = 0; i < this.options.brData.PendingBudgetRequests.length; i++) {
    //        //    if (carouselItemIndex < 100) { // This is where we set how many tasks we will display in the carousel. Zero-based, so < 5 means display 5 tasks.

    //        //        var bwBudgetRequestId = this.options.brData.PendingBudgetRequests[i].bwBudgetRequestId;
    //        //        //var bwWorkflowTaskItemId = 'bwWorkflowTaskItemId'; //this.options.taskData[i].bwWorkflowTaskItemId;

    //        //        var carouselItem_Id = 'bwExecutiveSummariesCarousel2_executiveSummaryInCarousel_' + carouselItemIndex;

    //        //        var html = '';

    //        //        html += '   <div id="' + carouselItem_Id + '" class="executiveSummaryInCarousel" bwbudgetrequestid="' + bwBudgetRequestId + '" style="min-width:300px;display:inline-block;white-space:nowrap;color: rgb(38, 38, 38); font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif; font-size: 1.25em;" ';
    //        //        //this.carouselItem_AddOnClick(carouselItem_Id, bwBudgetRequestId, this.options.taskData[i].Title, this.options.taskData[i].ProjectTitle, this.options.taskData[i].bwAssignedToRaciRoleAbbreviation, bwWorkflowTaskItemId);
    //        //        var ProjectTitle_clean = this.options.brData.PendingBudgetRequests[i].ProjectTitle.replace(/["]/g, '&quot;').replace(/[']/g, '\\&#39;'); //&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method. 
    //        //        html += '   xcx="342523326"    onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'' + bwBudgetRequestId + '\', \'' + this.options.brData.PendingBudgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + this.options.brData.PendingBudgetRequests[i].Title + '\', \'' + this.options.brData.PendingBudgetRequests[i].bwAssignedToRaciRoleAbbreviation + '\', \'' + bwBudgetRequestId + '\');" ';
    //        //        html += '   >';

    //        //        html += '<br />';

    //        //        html += '   <span style="font-size:12pt;"><span style="color:black;font-size:18pt;font-weight:bold;">' + this.options.brData.PendingBudgetRequests[i].Title + '</span></span>';
    //        //        html += '   <br />';
    //        //        html += '   <span style="color:black;font-size:18pt;font-weight:bold;">' + this.options.brData.PendingBudgetRequests[i].ProjectTitle + '</span>';
    //        //        html += '   <br />';
    //        //        html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Requested by: ' + this.options.brData.PendingBudgetRequests[i].CreatedBy + '</span>';
    //        //        html += '   <br />';
    //        //        var RequestedCapital_cleaned = $('.bwAuthentication').bwAuthentication('getBudgetWorkflowStandardizedCurrency', this.options.brData.PendingBudgetRequests[i].RequestedCapital);
    //        //        html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Requested capital: <span style="color:purple;font-size:18pt;">' + RequestedCapital_cleaned + '</span></span>';
    //        //        html += '   <br />';
    //        //        var timestamp4;
    //        //        var requestCreatedDate;
    //        //        requestCreatedDate = this.options.brData.PendingBudgetRequests[i].Created;
    //        //        if (requestCreatedDate) {
    //        //            timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(requestCreatedDate);
    //        //        } else {
    //        //            timestamp4 = '[not available]';
    //        //        }
    //        //        html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Request created: ' + timestamp4 + '</span>';
    //        //        html += '   <br />';
    //        //        html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Org: <span style="">' + this.options.brData.PendingBudgetRequests[i].OrgName + '</span></span>';
    //        //        html += '   <br />';
    //        //        html += '   <br />';

    //        //        html += '   <div id="bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_AllActiveRequests_' + bwBudgetRequestId + '" style="text-align: center;"></div>';



    //        //        html += '   <hr style="color:skyblue;" />';

    //        //        if (this.options.brData.PendingBudgetRequests[i].BudgetWorkflowStatus.toString().toLowerCase() == 'collaboration') {
    //        //            html += '<span style="color:black;font-size:18pt;font-weight:bold;">Workflow step: ' + this.options.brData.PendingBudgetRequests[i].BudgetWorkflowStatus + '</span>';
    //        //        } else {
    //        //            html += '<span style="color:black;font-size:18pt;font-weight:bold;">Workflow step: ' + this.options.brData.PendingBudgetRequests[i].BudgetWorkflowStatus + '</span>';
    //        //        }
    //        //        html += '   <br />';
    //        //        html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Approvers: [xcxappovers1]</span>';
    //        //        html += '   <br />';
    //        //        html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Collaborators: [xcxcollaborators]</span>';
    //        //        html += '   <br />';
    //        //        html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Informed: [xcxinformed]</span>';
    //        //        html += '   <br />';

    //        //        html += '</div>';

    //        //        $('#divBwExecutiveSummariesCarousel_AllActiveRequests').append(html); // Create the html in the div tag.

    //        //        console.log('Calling carouselItem_AddOnClick() xcx124254235');
    //        //        // Now add the onclick event.
    //        //        //var bwWorkflowTaskItemId = this.options.taskData[i].bwWorkflowTaskItemId;
    //        //        //this.carouselItem_AddOnClick(carouselItem_Id, bwBudgetRequestId, this.options.taskData[i].Title, this.options.taskData[i].ProjectTitle, this.options.taskData[i].bwAssignedToRaciRoleAbbreviation, bwWorkflowTaskItemId);

    //        //        carouselItemIndex += 1;



    //        //        $('#bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_AllActiveRequests_' + bwBudgetRequestId).html(''); // Clear the images to fix the duplicate attachments being displayed.


    //        //        //
    //        //        // Display inventory images
    //        //        //
    //        //        // 
    //        //        var InventoryItems = [];
    //        //        for (var j = 0; j < this.options.brData.PendingBudgetRequests.length; j++) {
    //        //            if (bwBudgetRequestId == this.options.brData.PendingBudgetRequests[j].bwBudgetRequestId) {
    //        //                var tmpJson = this.options.brData.PendingBudgetRequests[j].bwRequestJson;
    //        //                var json = JSON.parse(tmpJson);
    //        //                if (json && json.bwSelectInventoryItems && json.bwSelectInventoryItems.value) {
    //        //                    InventoryItems = json.bwSelectInventoryItems.value; //this.options.brData.PendingBudgetRequests[j].bwRequestJson;
    //        //                }
    //        //                break;
    //        //            }
    //        //        }
    //        //        if (InventoryItems.length > 0) {
    //        //            var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    //        //                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    //        //                return v.toString(16);
    //        //            });
    //        //            var html = '';

    //        //            for (var j = 0; j < InventoryItems.length; j++) {

    //        //                //html += '   <span style="color:black;font-size:12pt;font-weight:normal;">' + InventoryItems[j].Title + ' - ' + InventoryItems[j].Description + '</span>';
    //        //                //html += '   <br />';
    //        //                var imagePath = globalUrlPrefix + globalUrl + '/_files/' + workflowAppId + '/inventoryimages/' + InventoryItems[j].bwInventoryItemId + '/inventoryimage.png?v=' + guid;
    //        //                html += '   <img src="' + imagePath + '" style="height:150px;" />';

    //        //            }


    //        //            if (html != '') {
    //        //                var html2 = '';
    //        //                html2 += '<div>';
    //        //                html2 += '<span style="color:black;font-size:12pt;font-weight:normal;float:left;">Inventory item(s): </span>'; // Add the title, since we have some items to display.
    //        //                html2 += '<br />';
    //        //                html = html2 + html + '</div>';
    //        //                $('#bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_AllActiveRequests_' + bwBudgetRequestId).append(html);
    //        //            }



    //        //            //$('#bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_' + bwWorkflowTaskItemId).append(html);
    //        //        }
    //        //        //
    //        //        // end: Display inventory images
    //        //        //




    //        //        var renderAttachments = function (bwBudgetRequestId) {
    //        //            try {
    //        //                //// debugger;
    //        //                var operationUri = globalUrlPrefix + globalUrl + '/_files/' + 'getprimaryimageforbudgetrequest/' + workflowAppId + '/' + bwBudgetRequestId; // _files allows us to use nginx to route these to a dedicated file server.
    //        //                $.ajax({
    //        //                    url: operationUri,
    //        //                    method: "GET",
    //        //                    headers: {
    //        //                        "Accept": "application/json; odata=verbose"
    //        //                    },
    //        //                    success: function (data) {
    //        //                        try {

    //        //                            var bwBudgetRequestId;
    //        //                            if (data[0]) {
    //        //                                bwBudgetRequestId = data[0].bwBudgetRequestId;
    //        //                            }
    //        //                            var html = '';


    //        //                            try {

    //        //                                //
    //        //                                // Display the image thumbnail.
    //        //                                //
    //        //                                var displayImageThumbnail = function (imgId, thumbnailUrl) {
    //        //                                    //alert('In displayImageThumbnail xcx897987-2');
    //        //                                    $.get(thumbnailUrl).done(function () {
    //        //                                        var img = new Image();
    //        //                                        img.src = thumbnailUrl;
    //        //                                        img.onload = function (e) {
    //        //                                            try {
    //        //                                                document.getElementById(imgId).src = thumbnailUrl; // There is a thumbnail, so display it.
    //        //                                            } catch (e) {
    //        //                                                document.getElementById(imgId).src = globalUrlPrefix + globalUrl + '/images/mp4.jfif'; // There is no thumbnail, so display the icon.
    //        //                                            }
    //        //                                        }
    //        //                                    }).fail(function () {
    //        //                                        document.getElementById(imgId).src = globalUrlPrefix + globalUrl + '/images/mp4.jfif'; // There is no thumbnail, so display the icon.
    //        //                                    });
    //        //                                }

    //        //                                for (var i = 0; i < data.length; i++) {
    //        //                                    if (bwBudgetRequestId) {
    //        //                                        var filename = data[i].Filename;
    //        //                                        if (filename.indexOf('_thumbnail_') > -1) {
    //        //                                            //
    //        //                                            // This is a thumbnail. Do not display as an attachment.
    //        //                                            //
    //        //                                        } else {
    //        //                                            var extensionIndex = filename.split('.').length - 1;
    //        //                                            var fileExtension = filename.toLowerCase().split('.')[extensionIndex];
    //        //                                            if ((fileExtension == 'xlsx') || (fileExtension == 'xls')) {

    //        //                                                html += '<img src="images/excelicon.png" style="width:100px;height:46px;cursor:pointer;" />';

    //        //                                            } else if (fileExtension == 'pdf') {

    //        //                                                html += '<img src="images/pdf.png" style="width:100px;cursor:pointer;" />';

    //        //                                            } else if (fileExtension == 'mp4') {

    //        //                                                var imgId = 'img_bwExecutiveSummariesCarousel2_' + thiz.options.elementIdSuffix + '_' + bwBudgetRequestId + '_' + i;
    //        //                                                html += '<img id="' + imgId + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;" alt="" />';
    //        //                                                html += '<br />';
    //        //                                                var thumbnailUrl = "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + filename + '_thumbnail_' + '.jpg';
    //        //                                                displayImageThumbnail(imgId, thumbnailUrl);


    //        //                                            } else if (fileExtension == 'rtf') {

    //        //                                                html += '<img src="images/rtf.png" style="width:100px;cursor:pointer;" />';

    //        //                                            } else if (fileExtension == 'vob') {

    //        //                                                html += '<img src="images/vob.png" style="width:100px;cursor:pointer;" />';

    //        //                                            } else if (fileExtension == 'mp3') {

    //        //                                                html += '<img src="images/mp3.png" style="width:100px;cursor:pointer;" />';

    //        //                                            } else {

    //        //                                                var imageUrl = globalUrlPrefix + globalUrl + '/_files/' + workflowAppId + '/' + bwBudgetRequestId + '/' + filename;
    //        //                                                html += '<img src="' + imageUrl + '" style="height:150px;" />';
    //        //                                                html += '<br />';

    //        //                                            }
    //        //                                        }
    //        //                                    }
    //        //                                }

    //        //                            } catch (e) {
    //        //                                console.log('Didn\'t find an image for data: ' + JSON.stringify(data));
    //        //                                displayAlertDialog('Didn\'t find an image for data: ' + JSON.stringify(data));
    //        //                                html = '[no image found]';
    //        //                                //document.getElementById('spanExecutiveSummaryPrimaryImages_' + bwBudgetRequestId).innerHTML = html;
    //        //                            }
    //        //                            if (bwBudgetRequestId) {
    //        //                                if (html != '') {
    //        //                                    var html2 = '';
    //        //                                    html2 += '<div>';
    //        //                                    html2 += '<span style="color:black;font-size:12pt;font-weight:normal;float:left;">Attachment(s): </span>'; // Add the title, since we have some items to display.
    //        //                                    html2 += '<br />';
    //        //                                    html = html2 + html + '</div>';
    //        //                                    $('#bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_AllActiveRequests_' + bwBudgetRequestId).append(html);
    //        //                                }
    //        //                            }
    //        //                        } catch (e) {
    //        //                            if (e.number) {
    //        //                                displayAlertDialog('Error in populateAttachments():1-1: ' + e.number + ', "' + e.message + '", ' + e.stack);
    //        //                            } else {
    //        //                                // This most likely means that the folders are there on the file services server, but there is nothing in them.
    //        //                                //
    //        //                                // Fileservices has an error, so show nothing! We will put a red exclamation pin in the attachments section eventually! - 10-1-17 todd
    //        //                                //displayAlertDialog('Fileservices has an error: ' + ' "' + e.message + '"');
    //        //                            }
    //        //                        }
    //        //                    },
    //        //                    error: function (data, errorCode, errorMessage) {
    //        //                        if (errorCode === 'timeout' && errorMessage === 'timeout') {
    //        //                            displayAlertDialog('SERVICE UNAVAILABLE. File services is not respondingxcx2. communication timeout is set at ' + ajaxTimeout / 1000 + ' seconds: ' + errorCode + ', ' + errorMessage);
    //        //                        } else {


    //        //                            console.log('');
    //        //                            console.log('********************************************************************');
    //        //                            console.log('Error in bwEecutiveSummariesCarousel.js.showRowHoverDetails:2:3 ' + errorCode + ', ' + errorMessage);
    //        //                            console.log('********************************************************************');
    //        //                            console.log('');

    //        //                            //displayAlertDialog('Error in showRowHoverDetails:2:3 ' + errorCode + ', ' + errorMessage);





    //        //                            // The latest error 1-17-2018 is errorCode:'error' and errorMessage:'Not Found'.
    //        //                            // What does this mean? You can replicate this error!
    //        //                            // at Url: https://budgetworkflow.com/ios8.html, view an offline (Un-submitted) request, and try to add an attachment.
    //        //                        }
    //        //                    }
    //        //                });
    //        //            } catch (e) {
    //        //                console.log('Exception in bwExecutiveSummariesCarousel2.js.renderAttachments(): ' + e.message + ', ' + e.stack);
    //        //                displayAlertDialog('Exception in bwExecutiveSummariesCarousel2.js.renderAttachments(): ' + e.message + ', ' + e.stack);
    //        //            }
    //        //        }

    //        //        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Calling renderAttachments(). bwBudgetRequestId: ' + bwBudgetRequestId);
    //        //        renderAttachments(bwBudgetRequestId);

    //        //    } else {
    //        //        break;
    //        //    }
    //        //}

    //    } catch (e) {
    //        console.log('Exception in bwExecutiveSummariesCarousel2.renderExecutiveSummaries_AllActiveRequests(): ' + e.message + ', ' + e.stack);
    //        displayAlertDialog('Exception in bwExecutiveSummariesCarousel2.renderExecutiveSummaries_AllActiveRequests(): ' + e.message + ', ' + e.stack);
    //    }
    //},

















});