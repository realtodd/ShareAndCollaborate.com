$.widget("bw.bwDonate", {
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
        This is the bwDonate.js jQuery Widget. 
        ===========================================================

           [more to follow]
                           
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

           [put your stuff here]

        ===========================================================
        
       */


        value: 0,
        reportType: null, // So far using these values: 'CurrentYearBudgetRequestsReport', 'MyPendingTasksReport', 'InProcessBudgetRequestsReport', 'IndividualRequestReport', 
        json: null,
        store: null, // This is where we store our OrgRoles data.
        //Canvas: null,
        //CanvasContext: null,
        //OnResizeDisplayValues: null,
        //Checklists: null,
        bwTenantId: null,
        bwWorkflowAppId: null,
        //bwOrgId: null,
        //bwOrgName: null,
        bwEnabledRequestTypes: null, // An array of the following: ['Budget Request', 'Quote Request', 'Reimbursement Request', 'Recurring Expense', 'Capital Plan Project', 'Work Order']
        operationUriPrefix: null,
        ajaxTimeout: 15000,
        quill: null,
        displayWorkflowPicker: false,
        displayRoleIdColumn: false,
        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function () {
        //alert('In bwDonate._create().');
        this.element.addClass("bwDonate");
        //debugger;
        //var thiz = this; // Need this because of the asynchronous operations below.
        try {
            if (this.options.operationUriPrefix == null) {
                // This formulates the operationUri, which is used throughout.
                var url1 = window.location.href.split('https://')[1];
                var url2 = url1.split('/')[0];
                this.options.operationUriPrefix = 'https://' + url2 + '/';
            }

            ////this.renderPrintButton();

            //this.element.html(this.renderPrintButton()); // Render the print button. 

            console.log('In bwDonate._create(). The widget has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwDonate: CANNOT INITIALIZE widget bwDonate.js.</span>';
            html += '<br />';
            html += '<span style="">Exception in bwDonate.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwDonate")
            .text("");
    },

    displayDonationDialog: function () {
        try {
            

            //alert('In displayDonationDialog().');


            var requestDialogId = 'divDonationDialog';

            if ($('#' + requestDialogId).is(':visible')) {
                $('#' + requestDialogId).dialog('close');
            }

            var html = '';
            //html += '<div style="display:none;" id="divRequestFormDialog">';
            html += '        <table style="width:100%;">';
            html += '            <tr>';
            html += '                <td style="width:90%;">';
            //html += '                    <span id="divRequestWorkflowAuditTrailContent"></span>';
            html += '                    <span id="divDonationDialogContent"></span>';
            html += '                </td>';
            html += '            </tr>';
            html += '        </table>';
            html += '        <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and zooming in on the iPhone. -->';
            html += '        <br /><br />';
            //html += '    </div>';

            //
            // THIS IS PART OF THE PIN FUNCTIONALITY 4-1-2020
            //
            var div = document.getElementById(requestDialogId); // 4-1-2020 12-28pm adt.
            if (!div) { // for some reason this gets added twice to the DOM. Figure this out someday, but for now this seems to fix it and is a good safety I suppose.
                div = document.createElement('div');
                div.id = requestDialogId;
                document.body.appendChild(div); // to place at end of document
            }
            div.innerHTML = html;
            // Now that it is part of the DOM, we can display it!
            $('#' + requestDialogId).dialog({
                position: {
                    my: 'center',
                    at: 'center',
                    of: '#spanHomePageStatusText'
                },
                modal: true,
                resizable: true,
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                width: '950px',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                //resizable: true, // NOT SURE THIS IS A GOOD IDEA. 4-5-2020.
                open: function () {
                    try {

                        var element2 = document.getElementById(requestDialogId).parentNode; // This is the best way to get a handle on the jquery dialog.
                        var requestDialogParentId = requestDialogId + '_Parent'; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.
                        element2.id = requestDialogParentId; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.

                        // This creates the custom header/draggable bar on the dialog!!! 4-2-2020. // ☈ ☇ https://www.toptal.com/designers/htmlarrows/symbols/thunderstorm/
                        var html = '';
                        html += '<table style="width:100%;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequestDialog\');">'; // This click event is like "pin". Once the user clicks the header of the request dialog, it no longer is modal and persists on the screen until they choose to close it.
                        html += '   <tr>';
                        html += '       <td style="width:95%;">';
                        //html += '           <div id="slider_' + requestDialogId + '" style="width:20%;cursor:pointer;">[' + 'slider_' + requestDialogId + ']</div>';
                        html += '           <div id="slider_' + requestDialogId + '" style="width:20%;cursor:pointer;"></div>';
                        html += '       </td>';
                        html += '       <td>';
                        html += '           <span class="dialogXButton" style="font-size:25pt;cursor:pointer;width:100%;" onclick="$(\'#' + requestDialogId.replace('_Parent', '') + '\').dialog(\'close\');">X</span>';
                        html += '       </td>';
                        html += '   </tr>';
                        html += '</table>';

                        document.getElementById(requestDialogId).parentNode.querySelector(".ui-dialog-titlebar").innerHTML = html;

                        html = '';
                        html += '<span id="' + requestDialogParentId + '_Content">';

                        //html += '<table style="background-color:whitesmoke;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                        //html += '    <tr style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                        //html += '        <td style="text-align:center;vertical-align:middle;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                        //html += '            <table id="tableCarousel" style="background-color:whitesmoke;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;width:850px;">';
                        //html += '                <tr>';
                        //html += '                    <td></td>';
                        //html += '                    <td style="text-align:center;">';
                        //html += '                        <table style="width:100%">';
                        //html += '                            <tr>';
                        //html += '                                <td style="width:15%;"></td>';
                        //html += '                                <td style="width:70%;">';
                        //html += '                                    <span id="spanCarouselImageIndicator1" onclick="cmdCarouselImageIndicatorClick(\'0\');" class="spanCarouselImageIndicatorEnabled" title="Slide #1">&#183;</span>&nbsp;';
                        //html += '                                    <span id="spanCarouselImageIndicator2" onclick="cmdCarouselImageIndicatorClick(\'1\');" class="spanCarouselImageIndicatorDisabled" title="Slide #2">&#183;</span>&nbsp;';
                        //html += '                                    <span id="spanCarouselImageIndicator3" onclick="cmdCarouselImageIndicatorClick(\'2\');" class="spanCarouselImageIndicatorDisabled" title="Slide #3">&#183;</span>&nbsp;';
                        //html += '                                    <span id="spanCarouselImageIndicator4" onclick="cmdCarouselImageIndicatorClick(\'3\');" class="spanCarouselImageIndicatorDisabled" title="Slide #4">&#183;</span>&nbsp;';
                        //html += '                                    <span id="spanCarouselImageIndicator5" onclick="cmdCarouselImageIndicatorClick(\'4\');" class="spanCarouselImageIndicatorDisabled" title="Slide #5">&#183;</span>&nbsp;';
                        //html += '                                    <span id="spanCarouselImageIndicator6" onclick="cmdCarouselImageIndicatorClick(\'5\');" class="spanCarouselImageIndicatorDisabled" title="Slide #6">&#183;</span>&nbsp;';
                        //html += '                                    <span id="spanCarouselImageIndicator7" onclick="cmdCarouselImageIndicatorClick(\'6\');" class="spanCarouselImageIndicatorDisabled" title="Slide #7">&#183;</span>&nbsp;';
                        //html += '                                    <span id="spanCarouselImageIndicator8" onclick="cmdCarouselImageIndicatorClick(\'7\');" class="spanCarouselImageIndicatorDisabled" title="Slide #8">&#183;</span>&nbsp;';
                        //html += '                                    <span id="spanCarouselImageIndicator9" onclick="cmdCarouselImageIndicatorClick(\'8\');" class="spanCarouselImageIndicatorDisabled" title="Slide #9">&#183;</span>';
                        //html += '                                </td>';
                        //html += '                                <td style="width:15%;">';
                        //html += '                                    <span id="spanAudioOnOff" onclick="cmdAudioToggleOnOff();" style="text-align:left;cursor:pointer;"></span>';
                        //html += '                                    <div id="divCarouselPausePlay"></div>';
                        //html += '                                </td>';
                        //html += '                            </tr>';
                        //html += '                        </table>';
                        //html += '                    </td>';
                        //html += '                    <td></td>';
                        //html += '                </tr>';
                        //html += '                <tr>';
                        //html += '                    <td style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                        //html += '                        <div id="divLeftNavigationArrow" class="carouselLeftNavigationArrow" onclick="$(\'.bwHowDoesItWorkCarousel\').bwHowDoesItWorkCarousel(\'cmdCarouselNavigateLeft\');">&lt;</div>';
                        //html += '                    </td>';
                        //html += '                    <td>';
                        //html += '                        <span id="spanCarouselHeaderText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 15pt;"></span>';
                        //html += '                        <br /><br />';
                        //html += '                        <span id="spanCarouselImage" style="width:850px;height:550px;"></span>';
                        //html += '                    </td>';
                        //html += '                    <td style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                        //html += '                        <div id="divRightNavigationArrow" class="carouselRightNavigationArrow" onclick="$(\'.bwHowDoesItWorkCarousel\').bwHowDoesItWorkCarousel(\'cmdCarouselNavigateRight\');">&gt;</div>';
                        //html += '                    </td>';
                        //html += '                </tr>';
                        //html += '                <tr>';
                        //html += '                    <td style="height:27px;">&nbsp;</td>';
                        //html += '                    <td></td>';
                        //html += '                    <td></td>';
                        //html += '                </tr>';
                        //html += '            </table>';
                        //html += '        </td>';
                        //html += '    </tr>';
                        //html += '</table>';
                        //html += '<br />';
                        //html += '<br />';

                        //html += '</span>';




                        html += '<span style="font-size:100pt;color:red;">❤<span style="font-family:\'Courier New\';color: black;"> Donate</span></span>';
                        //html += '<br />'; 
                        //html += 'Donation dialog content!!!!!!!!!!!!!!!!!!!!!!!!!';
                        html += '<br />';
                        html += 'If I can raise a couple thousand dollars a month, I can keep this ball rolling! I want make sure everyone gets the most out of this software. Feel free to contact me anytime at todd_hiltz@hotmail.com.';

                        html += '<br />';
                        html += '<br />';
                        html += '⦁	Donate with PayPal';
                        html += '<br />';
                        html += '⦁	Donate with Square';
                        html += '<br />';
                        html += '⦁	Donate with Patreon';
                        html += '<br />';
                        html += '⦁	Donate with Stripe';
                        html += '<br />';
                        html += '⦁	Donate with Google';
                        html += '<br />';
                        html += 'You can contribute by making a financial contribution to help with the development effort, by reporting bugs and ideas, by telling everyone about this software, by...';

                        document.getElementById(requestDialogId).innerHTML = html;

                        $("#slider_" + requestDialogId).slider({
                            min: 50,
                            max: 200,
                            value: 100, // It starts off 100 = 50% size, so the user can make it bigger if they want.
                            slide: function (event, ui) {
                                thiz.setZoom(ui.value, requestDialogId);
                            }//,
                            //change: function (event, ui) {
                            //    thiz.setZoom(ui.value, requestDialogId);
                            //}
                        });
                        thiz.setZoom(100, requestDialogId);

                        $('.ui-widget-overlay').bind('click', function () {
                            $('#' + requestDialogId).dialog('close');
                        });
                        //debugger;
                        //var promise = thiz.loadWorkflowsAndCurrentWorkflow2(bwRequestType); // This is the default.
                        //promise.then(function (result) {
                        //    try {
                        //        //debugger;
                        //        //var orgPathClickable = renderTheOrgBreadcrumb2(thiz.options.store.Global, locationId);
                        //        //document.getElementById(requestDialogId + '_requestOrgClickableBreadcrumb').innerHTML = orgPathClickable;



                        //        //thiz.renderNewRequestWorkflowParticipants(requestDialogParentId, bwRequestType, brTitle, title, bwBudgetRequestId, bwWorkflowId, bwOrgId);
                        //        //debugger;
                        //        thiz.renderNewRequestWorkflowParticipants(requestDialogParentId, result.bwWorkflowId, bwBudgetRequestId, bwOrgId); // result.bwRequestType
                        //    } catch (e) {
                        //        console.log('Exception in bwWorkflowEditor._create().loadWorkflowsAndCurrentWorkflow(): ' + e.message + ', ' + e.stack);
                        //    }
                        //});
                        //document.getElementById('#divHowDoesItWorkDialog_Parent_Content').innerHTML = 'TODD TESTING!!!!!!!!!!!!!';



                        //thiz.startCarouselTimer();
                        if (thiz.carouselImageTracker < 8) thiz.carouselImageTracker += 1;
                        else thiz.carouselImageTracker = 0;

                        thiz.setCarouselImageTracker();


                        // These change the style of the carousel when hovered over, highlighting the buttons. It is just some nice feedback!
                        $('#tableCarousel').bind('mouseenter', function () {
                            // Make the buttons more visible.
                            document.getElementById('divLeftNavigationArrow').className = 'carouselLeftNavigationArrowActive';
                            document.getElementById('divRightNavigationArrow').className = 'carouselRightNavigationArrowActive';

                            //document.getElementById('divCarouselPausePlay2').className = 'carouselPausePlayActive'; //.style.backgroundColor = '#6682b5';

                        });


                        $('#tableCarousel').bind('mouseleave', function () {
                            // Make the buttons less visible.
                            document.getElementById('divLeftNavigationArrow').className = 'carouselLeftNavigationArrow';
                            document.getElementById('divRightNavigationArrow').className = 'carouselRightNavigationArrow';

                            //document.getElementById('divCarouselPausePlay2').className = 'carouselPausePlay'; //.style.backgroundColor = '';
                        });



                    } catch (e) {
                        console.log('Exception in displayNewRequestWorkflowParticipantsDialog().dialog.open(): ' + e.message + ', ' + e.stack);
                    }
                }
            });
            try {
                $('.ui-widget-overlay')[0].style.zIndex = 9;
                $('#' + requestDialogId).dialog().parents('.ui-dialog')[0].style.zIndex = 10; // THIS IS A HACK ?? IS THIS THE BEST PLACE FOR THIS ?? >>>>>>>>>>>>>>>>>>>>>>>>>>>> 2-15-2020
            } catch (e) {

            }

        } catch (e) {
            console.log('Exception in displayDonationDialog(): ' + e.message + ', ' + e.stack);
        }
    },











    renderPrintButton: function () {
        try {
            //debugger;
            console.log('In renderPrintButton().');
            var html = '';
            var reportType = this.options.reportType;
            if (reportType == 'CurrentYearBudgetRequestsReport') {
                html += '<span title="print" class="printButton" onclick="$(\'.bwDonate\').bwDonate(\'PrintCurrentYearBudgetRequestsReport\');">🖨</span>';
            } else if (reportType == 'MyPendingTasksReport') {
                html += '<span title="print" class="printButton" onclick="$(\'.bwDonate\').bwDonate(\'PrintMyPendingTasksReport\');">🖨</span>';
            } else if (reportType == 'InProcessBudgetRequestsReport') {
                html += '<span title="print" class="printButton" onclick="$(\'.bwDonate\').bwDonate(\'PrintInProcessBudgetRequestsReport\');">🖨</span>';
            } else if (reportType == 'IndividualRequestReport') {
                html += '<span title="print" class="printButton" onclick="$(\'.bwDonate\').bwDonate(\'PrintIndividualRequestReport\');" style="font-size:22pt;">🖨&nbsp;</span>'; // Different size because this one shows up in the dialog draggable top bar header.
            } else {
                console.log('In renderPrintButton(): Unexpected value for reportType: ' + reportType);
                html += 'In renderPrintButton(): Unexpected value for reportType: ' + reportType;
            }

            return html;
            // Render the html.
            //this.element.html(html);

        } catch (e) {
            console.log('Exception in renderPrintButton(): ' + e.message + ', ' + e.stack);
        }
    },

    PrintMyPendingTasksReport: function () {
        //debugger;
        //$('#PrintDialog2').dialog('close');

        try {
            // Then we iterate throgh all of the html elements, and display set to inline.
            var thiz = this;
            //var originalFormBeforePrinting = document.body.innerHTML;

            var html = '';





            //debugger;



            // Now that we have all our data in the array properly, lets display it!
            //var html = '';
            var year = new Date().getFullYear().toString(); // todd hardcoded.
            //html += '<br />Year:&nbsp;' + year + '';
            var reportDate = new Date();

            html += '<table style="width:100%;">';
            html += '  <tr>';

            html += '    <td style="text-align:right;">';
            html += '       <table>';
            html += '           <tr>';
            html += '               <td style="text-align:center;">';
            html += '                   <span><img id="imgParticipantImage" src="' + thiz.options.operationUriPrefix + 'images/userimage.png" style="width:200px;height:200px;"/>'; // This gets lazy loaded below.
            html += '                   </span>';
            html += '               </td>';
            html += '           </tr>';
            html += '           <tr>';
            html += '               <td style="text-align:center;">';
            html += '                   <span>';
            html += '                   ' + participantFriendlyName + '<br /><span style="font-size:7pt;">' + participantEmail + '</span>'; //workflowAppTitle;
            html += '                   </span>';
            html += '               </td>';
            html += '           </tr>';
            html += '       </table>';
            html += '    </td>';
            html += '    <td style="text-align:center;">';
            html += '       <span><h2>Pending Tasks for ' + participantFriendlyName + '</h2></span>';
            html += '    </td>';
            html += '  </tr>';
            html += '</table>';

            html += '<br /><br />';

            html += '<style>';
            html += '.dataGridTable { border: 1px solid gainsboro; font-size:12px; font-family: "Helvetica Neue","Segoe UI",Helvetica,Verdana,sans-serif; }';
            html += '.dataGridTable td { border-left: 0px; border-right: 1px solid gainsboro; }';
            html += '.headerRow { background-color:white; color:gray;border-bottom:1px solid gainsboro; }';
            html += '.headerRow td { border-bottom:1px solid gainsboro; padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
            html += '.filterRow td { border-bottom:1px solid whitesmoke; padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
            html += '.alternatingRowLight { background-color:white; }';
            html += '.alternatingRowLight:hover { background-color:lightgoldenrodyellow; }';
            html += '.alternatingRowDark { background-color:whitesmoke; }';
            html += '.alternatingRowDark:hover { background-color:lightgoldenrodyellow; }';
            html += '</style>';

            var queryData = {
                //"bwTenantId": tenantId,
                bwWorkflowAppId: workflowAppId,
                bwParticipantId: participantId
            };
            //debugger;
            $.ajax({
                url: webserviceurl + "/bwinvitationsunclaimed",
                type: "DELETE",
                contentType: 'application/json',
                data: JSON.stringify(queryData), //JSON.stringify(queryData),
                success: function (invitationData) {
                    var operationUri = webserviceurl + "/bwtasksoutstanding";
                    $.ajax({
                        url: operationUri,
                        type: "DELETE",
                        contentType: 'application/json',
                        data: JSON.stringify(queryData),
                        success: function (taskData) {
                            $.ajax({
                                url: webserviceurl + "/bwtenants",
                                type: "DELETE",
                                contentType: 'application/json',
                                data: JSON.stringify(queryData),
                                success: function (tenantData) {
                                    // Render the user dropdown tenant membership link.
                                    //var tmHtml = '';

                                    $.ajax({
                                        url: webserviceurl + "/bwparticipants",
                                        type: "DELETE",
                                        contentType: 'application/json',
                                        data: JSON.stringify(queryData),
                                        success: function (participantsData) {
                                            $.ajax({
                                                url: webserviceurl + "/bwbudgetrequestspending",
                                                type: "DELETE",
                                                contentType: 'application/json',
                                                data: JSON.stringify(queryData),
                                                success: function (brData) {
                                                    try {
                                                        if (taskData.length == 0 && brData.PendingBudgetRequests.length == 0 && brData.PendingPOBudgetRequests.length == 0) {

                                                            html += '<span class="spanH3_40">' + participantFriendlyName + ' has no pending tasks, and there are no pending budget requests.</span>'; //&nbsp;<input type="button" value="Refresh" onclick="javascript:renderAlerts();" style="cursor:pointer;" />';

                                                        }

                                                        // Display the home page alerts.
                                                        var deferredIndex = 1; // We only have 1 workflow to display, but if we want to display multiple, use this value.

                                                        //html += '<table id="bwWorkflowFunctionalAreaSection' + deferredIndex.toString() + '" style="cursor:default;" title="">';
                                                        html += '<table id="tblHomePageAlertSectionForWorkflow' + deferredIndex.toString() + '" style="cursor:default;" title="">';
                                                        //html += '<table id="tblSummaryPageFunctionalAreaSectionForWorkflow' + deferredIndex.toString() + '" style="cursor:default;" title="">';


                                                        //html += '<tr id="functionalAreaRow_' + deferredIndex.toString() + '_Top_1" style="visibility:hidden;"><td colspan="7"></td></tr>'; // This is the invisible one at the top used for reordering.
                                                        //html += '<tr id="functionalAreaRow_' + deferredIndex.toString() + '_Top_2" style="visibility:hidden;"><td colspan="7"></td></tr>'; // This is the row underneath it for displaying the details.
                                                        html += '<tr id="functionalAreaRow_' + deferredIndex.toString() + '_Top_1"><td colspan="7"></td></tr>'; // This is the invisible one at the top used for reordering.
                                                        html += '<tr id="functionalAreaRow_' + deferredIndex.toString() + '_Top_2"><td colspan="7"></td></tr>'; // This is the row underneath it for displaying the details.
                                                        var pendingHtml = '';
                                                        var notPendingHtml = '';
                                                        // notifications
                                                        //    [0] - home page notifications
                                                        //       .length - # of notification types 
                                                        //       [index] - notificationDetails
                                                        //              [0] - Notification type ("task", "budget request", "invitation")
                                                        //              [1] - Notification text (eg. "You have 2 Pending task(s).")
                                                        //              [2] - individualNotifications 
                                                        //                 .length - # of notifications
                                                        //                 [index]
                                                        //                        [0] - These vary depending on the notification type.
                                                        //                        [1] - xxxx
                                                        //                        [2] - xxxx
                                                        //                        [3] - xxxx
                                                        //                        [4] - xxxx
                                                        //                        [5] - xxxx

                                                        notifications = new Array(4);

                                                        notifications[0] = []; //new Array(3); // Initialize the task section.
                                                        notifications[0] = new Array(3);
                                                        notifications[1] = []; //new Array(3); // Initialize the budget requests section.
                                                        notifications[1] = new Array(3);
                                                        notifications[2] = []; //new Array(3); // Initialize the invitations section.
                                                        notifications[2] = new Array(3);
                                                        notifications[3] = []; //new Array(3); // Initialize the recommended section.
                                                        notifications[3] = new Array(3);

                                                        // Now we create and load the tasks in notifications[0].
                                                        notifications[0][0] = 'task';
                                                        if (taskData.length == 1) {
                                                            notifications[0][1] = participantFriendlyName + ' has ' + taskData.length + ' pending task.';
                                                        } else {
                                                            notifications[0][1] = participantFriendlyName + ' has ' + taskData.length + ' pending tasks.';
                                                        }
                                                        notifications[0][2] = [];
                                                        if (taskData.length > 0) {
                                                            notifications[0][2] = new Array(taskData.length);
                                                            for (var i = 0; i < taskData.length; i++) {
                                                                notifications[0][2][i] = new Array(15);
                                                                notifications[0][2][i][0] = taskData[i].bwTaskTitle;
                                                                notifications[0][2][i][1] = taskData[i].bwStatus;
                                                                notifications[0][2][i][2] = taskData[i].bwPercentComplete;
                                                                notifications[0][2][i][3] = taskData[i].bwRelatedItemId;
                                                                notifications[0][2][i][4] = taskData[i].bwAssignedTo;
                                                                notifications[0][2][i][5] = taskData[i].bwAssignedToId;
                                                                notifications[0][2][i][6] = taskData[i].bwDueDate;
                                                                notifications[0][2][i][7] = taskData[i].ProjectTitle;
                                                                notifications[0][2][i][8] = taskData[i].BudgetAmount;
                                                                notifications[0][2][i][9] = taskData[i].FinancialAreaId;
                                                                notifications[0][2][i][10] = taskData[i].CreatedBy;
                                                                notifications[0][2][i][11] = taskData[i].Title;
                                                                notifications[0][2][i][12] = taskData[i].RequestedCapital;
                                                                notifications[0][2][i][13] = taskData[i].RequestedExpense;
                                                                notifications[0][2][i][14] = taskData[i].TaskType;
                                                            }
                                                        }

                                                        html += '</table>';
                                                        //var unitTable1 = '';
                                                        html += '<div id="BWFunctionalAreaDiv' + deferredIndex.toString() + '" style="cursor:pointer;" >';
                                                        html += '<table id="BWFunctionalArea' + deferredIndex.toString() + '" style="vertical-align:top;width:100%;">';

                                                        ntypeindex = 0;
                                                        //var topHtml = '';
                                                        //if (notificationType == 'task') {
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
                                                            //notifications[0][2][i][15] = taskData[i].bwAssignedToRaciRoleAbbreviation;
                                                            //notifications[0][2][i][16] = taskData[i].bwAssignedToRaciRoleName;
                                                            var bwAssignedToRaciRoleAbbreviation = notifications[ntypeindex][2][pi][15];
                                                            var bwAssignedToRaciRoleName = notifications[ntypeindex][2][pi][16];

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

                                                            html += '   <tr>';
                                                            html += '       <td style="width:10px;"></td>';
                                                            html += '       <td style="width:10px;"></td>';

                                                            // Find the functional area name.
                                                            var functionalAreaId = notifications[ntypeindex][2][pi][9];
                                                            var functionalAreaName = '';

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
                                                                html += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;" colspan="5"><div style="display:inline-block;"><a style="cursor:pointer;" onclick="displayRecurringExpenseOnTheHomePage(\'' + budgetRequestId + '\', \'' + participantId + '\', \'' + title + '\');" target="_blank" title="Click to view the recurring expense...">' + daysSinceTaskCreated.toString() + ' days overdue: Recurring expense <em>(' + brTitle + ' - ' + functionalAreaName + ') is due to be submitted</em></a></div></td>';
                                                            } else if (taskType == 'BUDGET_REQUEST_WORKFLOW_TASK') {
                                                                //topHtml += '<td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'#d8d8d8\';" colspan="5" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');" target="_blank" title="xClick to view the request ' + title + '.">';
                                                                html += '<td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="5" >';

                                                                html += '<div style="display:inline-block;">';
                                                                //html += daysSinceTaskCreated.toString() + ' days overdue: <em>' + title + ' - ' + brTitle + ' - ' + formatCurrency(currentAmount) + ' - ' + functionalAreaName + ' ' + '[(' + bwAssignedToRaciRoleAbbreviation + ') ' + bwAssignedToRaciRoleName + ']' + '</em>';
                                                                html += daysSinceTaskCreated.toString() + ' days overdue: <em>' + title + ' - ' + brTitle + ' - ' + formatCurrency(currentAmount) + ' - ' + functionalAreaName + ' ' + '</em>';
                                                                html += '</div>';
                                                                html += '</td>';

                                                            } else {
                                                                html += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;" colspan="5">UNKNOWN TASK TYPE</td>';
                                                            }

                                                            html += '        </tr>';
                                                        }

                                                        html += '</table><br />';
                                                        //$('#divHomePageAlert').html(html);

                                                        html += '<br />';
                                                        html += '<br />';
                                                        html += '<hr style="border:0 none; border-bottom: 1px solid lightgray;" />';
                                                        html += '       <span style="font-size:8pt;white-space:nowrap;">Report date: ' + reportDate + '</span>';

                                                        // Do the printing.
                                                        //document.body.innerHTML = html;

                                                        // Do the printing.
                                                        //document.body.innerHTML = html;
                                                        //debugger;



                                                        //
                                                        // This is where we create the iframe, which we use for printing. We make it small so the user doesn't get disturbed.
                                                        var iframe = document.getElementById("printf");
                                                        if (!iframe) { // for some reason this gets added twice to the DOM. FIgure this out someday, but for now this seems to fix it.
                                                            iframe = document.createElement('iframe');
                                                            iframe.id = 'printf';
                                                            iframe.name = 'printf';
                                                            iframe.width = '1px';
                                                            iframe.height = '1px';
                                                            document.body.appendChild(iframe); // to place at end of document
                                                        }
                                                        var iframeDocument = iframe.contentDocument;
                                                        iframeDocument.body.innerHTML = html;
                                                        // end Create iframe.
                                                        //


                                                        //window.frames["printf"].focus();
                                                        //window.frames["printf"].print();
                                                        //and use 
                                                        //<iframe id="printf" name="printf"></iframe>


                                                        var printNow = function () {
                                                            setTimeout(function () { // Only needs to happen for Chrome.
                                                                //
                                                                // We have to do this for Chrome! Not for firefox or Edge. The extra time allows the dom to load images.
                                                                //
                                                                //debugger;
                                                                //window.print(); // In Safari on MacBook, and Safari & Chrome on iOS, this is a synchronous call!!! (unlike most other situations where it is asynchronous).
                                                                //window.frames["printf"].print();
                                                                try {
                                                                    console.log('bwDonate.PrintMyPendingTasksReport(): Try #1.');
                                                                    window.frames["printf"].contentWindow.print(); // Confirmed 5-14-2020. Works in Edge.
                                                                } catch (e) {
                                                                    try {
                                                                        console.log('bwDonate.PrintMyPendingTasksReport(): Try #2.'); 
                                                                        window.frames["printf"].print(); // Confirmed 5-14-2020. Works in Chrome. The print dialog gets invoked for Firefox, but only a blank page gets printed.
                                                                    } catch (e) {
                                                                        console.log('bwDonate.PrintMyPendingTasksReport(): Try #3.');
                                                                        window.print(); // In Safari on MacBook, and Safari & Chrome on iOS, this is a synchronous call!!! (unlike most other situations where it is asynchronous).
                                                                    }
                                                                    
                                                                }
                                                                //window.frames["printf"].contentWindow.print();
                                                                //console.log('window.print() has just been executed. In Safari on MacBook, and Safari & Chrome on iOS, this is a synchronous call.');

                                                                var frame = document.getElementById("printf");
                                                                frame.parentNode.removeChild(frame);

                                                                // Put back the original contents into the dom, and re-display the form dialog.
                                                                //document.body.innerHTML = originalFormBeforePrinting;
                                                                //// Render the Print button.
                                                                //var printButtonOptions = {
                                                                //    reportType: 'MyPendingTasksReport'
                                                                //};
                                                                //var $printbutton = $('#spanArchivePagePrintButton').bwDonate(printButtonOptions);


                                                            }, 250);
                                                        }








                                                        // Lazy loading the participant image.
                                                        var imagePath2 = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/participantimages/' + participantId + '/' + 'userimage.png';
                                                        $.get(imagePath2).done(function () {
                                                            setTimeout(function () { // Only needs to happen for Chrome.
                                                                //$('#imgParticipantImage').attr('src', imagePath2);
                                                                //printNow();


                                                                var iFrameDOM = $('#printf').contents();

                                                                iFrameDOM.find('#imgParticipantImage').attr('src', imagePath2);

                                                                printNow();

                                                            }, 500);
                                                        }).fail(function () {
                                                            // This participant has no image. do nothing 
                                                            printNow();
                                                        });




                                                        window.onafterprint = function (e) {
                                                            try {
                                                                console.log('Print Dialog Closed.');
                                                                //debugger;

                                                                debugger;
                                                                var frame = document.getElementById("printf");
                                                                frame.parentNode.removeChild(frame);

                                                                // Put back the original contents into the dom, and re-display the form dialog. This only needs to happen 
                                                                //document.body.innerHTML = originalFormBeforePrinting;
                                                                // Render the Print button.
                                                                //var printButtonOptions = {
                                                                //    reportType: 'MyPendingTasksReport'
                                                                //};
                                                                //var $printbutton = $('#spanArchivePagePrintButton').bwDonate(printButtonOptions);




                                                                //$("#divOfflineRequestFormDialog").dialog('open');
                                                                //alert('done printing');
                                                            } catch (e) {
                                                                console.log('Exception in window.onafterprint: ' + e.message);
                                                            }
                                                        };


                                                    } catch (e) {
                                                        //debugger;
                                                        console.log('Exception in PrintMyPendingTasksReport(): ' + e.message + ', ' + e.stack);
                                                    }



                                                    //window.print(); // In Safari on MacBook, and Safari & Chrome on iOS, this is a synchronous call!!! (unlike most other situations where it is asynchronous).
                                                    //console.log('window.print() has just been executed. In Safari on MacBook, and Safari & Chrome on iOS, this is a synchronous call.');



























                                                    // Now we have to check if there are any requests saved on the users' device.
                                                    // Check if there are any requests stored in IndexDB locally.
                                                    //try {
                                                    //    var request = indexedDB.open(indexDBName, dbVersion);

                                                    //    request.onerror = function (event) {
                                                    //        console.log('In ios8.js.renderAlerts(). Error accessing database "' + event.target.result.name + '". errorCode: ' + event.target.errorCode);
                                                    //    };

                                                    //    request.onsuccess = function (event) {
                                                    //        //console.log('In ios8.js.renderAlerts(). Success accessing database "' + event.target.result.name + '".');
                                                    //        var db = event.target.result;
                                                    //        try {
                                                    //            var store = db.transaction('objectStoreCachedRequests', 'readonly');
                                                    //            var req;
                                                    //            req = store.objectStore('objectStoreCachedRequests').count();
                                                    //        } catch (e) {
                                                    //            console.log('XXXXXXXXXXXerror: ' + e.message);
                                                    //        }
                                                    //        req.onsuccess = function (evt) {
                                                    //            // This is where we need to show the status on the home page. 
                                                    //            //if (evt.target.result == 1) {
                                                    //            //    var html2 = '<a href="javascript:cmdDisplayClientRequestsNotYetSubmittedDialogReadyToSubmit();" style="font-size:30pt;">You have ' + evt.target.result + ' un-submitted request saved on this devicex.</a>';
                                                    //            //    $('#divHomePageAlert').append(html2);
                                                    //            //} else if (evt.target.result > 1) {
                                                    //            //    var html2 = '<a href="javascript:cmdDisplayClientRequestsNotYetSubmittedDialogReadyToSubmit();" style="font-size:30pt;">You have ' + evt.target.result + ' un-submitted requests saved on this devicex.</a>';
                                                    //            //    $('#divHomePageAlert').append(html2);
                                                    //            //}













                                                    //            // Our new section added 4-25-18.
                                                    //            if (evt.target.result > 0) {




                                                    //                var html = '';
                                                    //                html += '  <table style="width:100%;">';
                                                    //                html += '    <tr>';
                                                    //                html += '        <td style="width:10px;"></td>';
                                                    //                html += '        <td style="width:10px;"></td>';
                                                    //                html += '        <td>';


                                                    //                //html += '        <td style="width:75px;"></td>';
                                                    //                //html += '        <td style="border-right:1px solid grey;width:1px;padding:0 0 0 0;margin:0 0 0 0;border-width:0 1px 0 0;">&nbsp;</td>';
                                                    //                //html += '        <td style="width:5px;"></td>';
                                                    //                //html += '        <td>';
                                                    //                html += '            <br />';
                                                    //                html += '            <br />';
                                                    //                html += '            <span style="font-size:30pt;margin:auto;text-align=center;display:table;font-style:italic;">';
                                                    //                html += '               <span>Your requests saved on this device</span>';
                                                    //                html += '               <br />';
                                                    //                html += '               <span>Submit them now to involve your team.</span>';
                                                    //                html += '            </span>';
                                                    //                html += '            <br />';
                                                    //                //html += '        </td>';
                                                    //                //html += '    </tr>';

                                                    //                //html += '    <tr>';
                                                    //                //html += '        <td style="width:75px;"></td>';
                                                    //                //html += '        <td style="border-right:1px solid grey;width:1px;padding:0 0 0 0;margin:0 0 0 0;border-width:0 1px 0 0;">&nbsp;</td>';
                                                    //                //html += '        <td style="width:5px;"></td>';
                                                    //                //html += '        <td>';
                                                    //                //html += '            <div class="divSignInButton" id="xx" onclick="cmdDisplayClientRequestsNotYetSubmittedDialog();" style="width:850px;height:150px;text-align:center;line-height:1.5em;font-size:60pt;">Offline Archive (' + evt.target.result + ')</div>';
                                                    //                //html += '        </td>';
                                                    //                //html += '    </tr>';

                                                    //                //html += '    <tr>';
                                                    //                //html += '        <td style="width:75px;"></td>';
                                                    //                //html += '        <td style="border-right:1px solid grey;width:1px;padding:0 0 0 0;margin:0 0 0 0;border-width:0 1px 0 0;">&nbsp;</td>';
                                                    //                //html += '        <td style="width:5px;"></td>';
                                                    //                //html += '        <td>';

                                                    //                // Display requests saved on this device.
                                                    //                var numberOfRequests = evt.target.result;
                                                    //                var objectStore = db.transaction("objectStoreCachedRequests").objectStore("objectStoreCachedRequests");
                                                    //                objectStore.openCursor().onsuccess = function (event) {
                                                    //                    console.log('In ios8.js.renderWelcomePageOffline().request.onsuccess.objectStore.openCursor().onsuccess');
                                                    //                    try {
                                                    //                        html += '<table style="width:100%;">';
                                                    //                        var cursor = event.target.result;
                                                    //                        if (cursor) {
                                                    //                            var projectTitle = cursor.value.ProjectTitle;
                                                    //                            if (projectTitle == '') {
                                                    //                                projectTitle = '<em>[no description]</em>';
                                                    //                            }
                                                    //                            console.log('Retrieved request: ' + projectTitle + ': ' + cursor.value.bwBudgetRequestId);
                                                    //                            html += '  <tr>';
                                                    //                            //html += '    <td class="tdHomePageSubNotificationIos8" style="cursor:pointer;width:95%;" onclick="displayForm_DisplayCachedAr(\'' + cursor.value.bwBudgetRequestId + '\');">';

                                                    //                            html += '    <td class="tdHomePageSubNotificationIos8" style="cursor:pointer;width:95%;" onclick="displayForm_DisplayOfflineArReadyToSubmit(\'' + cursor.value.bwBudgetRequestId + '\');">';

                                                    //                            html += '      <div style="display:inline-block;">';
                                                    //                            html += '        <span title="Click to view the request." style="cursor:pointer;font-size:30pt;width:100%;">' + projectTitle + ' (<em>' + formatCurrency(cursor.value.RequestedCapital) + '</em>)</span>';
                                                    //                            html += '        <br />';

                                                    //                            //console.log('cursor.value.bwDocumentXml: ' + JSON.stringify(cursor.value.bwDocumentXml));

                                                    //                            var tmpXml = cursor.value.bwDocumentXml;
                                                    //                            var tmpXmlTagLength = ('<my:Brief_Description_of_Project>').length;
                                                    //                            var tmpIndex1 = tmpXml.indexOf('<my:Brief_Description_of_Project>') + tmpXmlTagLength;
                                                    //                            var tmpIndex2 = tmpXml.indexOf('</my:Brief_Description_of_Project>'); // - tmpXmlTagLength + 1;
                                                    //                            var tmpDescription2 = decodeURIComponent(tmpXml.substring(tmpIndex1, tmpIndex2));

                                                    //                            // Sometimes we can get a <br> tag in there, and that messes everything up.
                                                    //                            tmpDescription2 = tmpDescription2.replace('<br>', '');

                                                    //                            console.log('tmpDescription2:' + tmpDescription2);



                                                    //                            console.log('tmpXml: [' + tmpXml + '], tmpIndex1: ' + tmpIndex1 + ', tmpIndex2: ' + tmpIndex2);

                                                    //                            if (tmpDescription2.length > 0) {
                                                    //                                console.log('tmpDescription2.length > 0: tmpDescription2.length=' + tmpDescription2.length);
                                                    //                                var tmpDescription = '';
                                                    //                                if (tmpDescription2.length > 39) tmpDescription = tmpDescription2.substring(0, 38) + '...';
                                                    //                                else tmpDescription = tmpDescription2;
                                                    //                                html += '      <span>';
                                                    //                                html += '      <em>' + tmpDescription + '&nbsp;&nbsp;&#128247;&nbsp;&nbsp;&#127908;</em>';
                                                    //                                html += '      </span>';
                                                    //                            } else {
                                                    //                                console.log('!(tmpDescription2.length > 0): tmpDescription2.length=' + tmpDescription2.length);
                                                    //                                html += '      <span>';
                                                    //                                html += '      <em>y[no details]&nbsp;&nbsp;&#128193;&nbsp;<span style="opacity: 0.20;">&#127908;</span>&nbsp;<span style="opacity: 0.20;">&#128249;</span>&nbsp;<span style="opacity: 0.20;">&#128247;</span></em>';
                                                    //                                html += '      </span>';
                                                    //                            }

                                                    //                            html += '      </div>';
                                                    //                            html += '    </td>';
                                                    //                            //html += '    <td>';
                                                    //                            //html += '      <img src="images/trash-can.png" onclick="cmdDisplayDeleteUnsubmittedBudgetRequestDialog(\'' + cursor.value.bwBudgetRequestId + '\', \'' + projectTitle + '\', \'' + cursor.value.RequestedCapital + '\');" title="Delete" class="trashcan" style="cursor:pointer;">';
                                                    //                            //html += '    </td>';
                                                    //                            html += '  </tr>';

                                                    //                            cursor.continue();
                                                    //                        } else {
                                                    //                            console.log('DONE LOOPING, so rendering.');
                                                    //                            //html += '  <tr>';
                                                    //                            //html += '    <td colspan="12"></td>';
                                                    //                            //html += '  </tr>'; 
                                                    //                            html += '</table>';

                                                    //                            // Complete the surrounding html.
                                                    //                            //html += '        </td>';
                                                    //                            //html += '    </tr>';

                                                    //                            //html += '    <tr>';
                                                    //                            //html += '        <td style="width:75px;"></td>';
                                                    //                            //html += '        <td style="border-right:1px solid grey;width:1px;padding:0 0 0 0;margin:0 0 0 0;border-width:0 1px 0 0;">&nbsp;</td>';
                                                    //                            //html += '        <td style="width:5px;"></td>';
                                                    //                            //html += '        <td>';
                                                    //                            //html += '            <br /><br /><br /><br /><br /><br />';
                                                    //                            //html += '        </td>';
                                                    //                            //html += '    </tr>';

                                                    //                            html += '      </td>';
                                                    //                            html += '    </tr>';
                                                    //                            html += '  </table>';

                                                    //                            //$('#divOfflineWelcomeContent').html(html);
                                                    //                            $('#divHomePageAlert').append(html);

                                                    //                            //document.title = 'Budgeting (' + evt.target.result + ')';
















                                                    //                        }
                                                    //                    } catch (e) {
                                                    //                        console.log('xxError: ' + e.message + ', ' + e.stack);
                                                    //                    }
                                                    //                };

                                                    //            }

                                                    //        };

                                                    //        req.onerror = function (evt) {
                                                    //            console.error("In ios8.js.renderAlerts(). add error", this.error);
                                                    //        };
                                                    //    }
                                                    //} catch (e) {
                                                    //    console.log('In ios8.js.renderAlerts(). FAILED TO OPEN A TRANSACTION to the database...' + e.message + ', ' + e.stack);
                                                    //}

                                                },
                                                error: function (data, errorCode, errorMessage) {
                                                    //displayAlertDialog('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
                                                    displayAlertDialog('Error in ios8.js.renderAlerts():1:' + errorCode + ', ' + errorMessage + ' I believe this happens when wifi goes down. SERVICE UNAVAILABLE ');
                                                }
                                            });
                                        },
                                        error: function (data, errorCode, errorMessage) {
                                            //displayAlertDialog('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
                                            displayAlertDialog('Error in ios8.js.renderAlerts():2:' + errorCode + ', ' + errorMessage);
                                        }
                                    });
                                },
                                error: function (data, errorCode, errorMessage) {
                                    //displayAlertDialog('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
                                    displayAlertDialog('Error in ios8.js.renderAlerts():3:' + errorCode + ', ' + errorMessage);
                                }
                            });
                        },
                        error: function (data, errorCode, errorMessage) {
                            //displayAlertDialog('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
                            displayAlertDialog('Error in ios8.js.renderAlerts():4:' + errorCode + ', ' + errorMessage + ', ' + JSON.stringify(data));
                        }
                    });
                },
                error: function (data, errorCode, errorMessage) {
                    //displayAlertDialog('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
                    //displayAlertDialog('Error in ios8.js.renderAlerts():5:' + errorCode + ', ' + errorMessage);
                    displayAlertDialog('Error in ios8.js.renderAlerts():5:' + errorCode + ', ' + errorMessage + ': Most likely service unavailable issue.'); // Todd: self raising this error here. As of 4-20-17 this is the only place this happens.
                }
            });

        } catch (e) {
            console.log('Error in PrintMyPendingTasksReport(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in PrintMyPendingTasksReport(): ' + e.message + ', ' + e.stack);
        }

        // See the following for custom css to use the media = print attribute. We are not using any aspects of this approach yet.
        // https://www.arclab.com/en/kb/htmlcss/how-to-print-a-specific-part-of-a-html-page-css-media-screen-print.html

    },

    PrintPendingTasksReport: function (bwParticipantId, bwParticipantFriendlyName, bwParticipantEmail) {
        //debugger;
        //$('#PrintDialog2').dialog('close');

        try {
            // Then we iterate throgh all of the html elements, and display set to inline.
            var thiz = this;
            //var originalFormBeforePrinting = document.body.innerHTML;

            var html = '';









            // Now that we have all our data in the array properly, lets display it!
            //var html = '';
            var year = new Date().getFullYear().toString(); // todd hardcoded.
            //html += '<br />Year:&nbsp;' + year + '';
            var reportDate = new Date();

            html += '<table style="width:100%;">';
            html += '  <tr>';

            html += '    <td style="text-align:right;">';
            html += '       <table>';
            html += '           <tr>';
            html += '               <td style="text-align:center;">';
            html += '                   <span><img id="imgParticipantImage" src="' + thiz.options.operationUriPrefix + 'images/userimage.png" style="width:200px;height:200px;"/>'; // This gets lazy loaded below.
            html += '                   </span>';
            html += '               </td>';
            html += '           </tr>';
            html += '           <tr>';
            html += '               <td style="text-align:center;">';
            html += '                   <span>';
            html += '                   ' + bwParticipantFriendlyName + '<br /><span style="font-size:7pt;">' + bwParticipantEmail + '</span>'; //workflowAppTitle;
            html += '                   </span>';
            html += '               </td>';
            html += '           </tr>';
            html += '       </table>';
            html += '    </td>';
            html += '    <td style="text-align:center;">';
            html += '       <span><h2>Pending Tasks for ' + bwParticipantFriendlyName + '</h2></span>';
            html += '    </td>';
            html += '  </tr>';
            html += '</table>';

            html += '<br /><br />';

            html += '<style>';
            html += '.dataGridTable { border: 1px solid gainsboro; font-size:12px; font-family: "Helvetica Neue","Segoe UI",Helvetica,Verdana,sans-serif; }';
            html += '.dataGridTable td { border-left: 0px; border-right: 1px solid gainsboro; }';
            html += '.headerRow { background-color:white; color:gray;border-bottom:1px solid gainsboro; }';
            html += '.headerRow td { border-bottom:1px solid gainsboro; padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
            html += '.filterRow td { border-bottom:1px solid whitesmoke; padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
            html += '.alternatingRowLight { background-color:white; }';
            html += '.alternatingRowLight:hover { background-color:lightgoldenrodyellow; }';
            html += '.alternatingRowDark { background-color:whitesmoke; }';
            html += '.alternatingRowDark:hover { background-color:lightgoldenrodyellow; }';
            html += '</style>';

            var queryData = {
                //"bwTenantId": tenantId,
                bwWorkflowAppId: workflowAppId,
                bwParticipantId: bwParticipantId
            };
            //debugger;
            $.ajax({
                url: webserviceurl + "/bwinvitationsunclaimed",
                type: "DELETE",
                contentType: 'application/json',
                data: JSON.stringify(queryData), //JSON.stringify(queryData),
                success: function (invitationData) {
                    var operationUri = webserviceurl + "/bwtasksoutstanding";
                    $.ajax({
                        url: operationUri,
                        type: "DELETE",
                        contentType: 'application/json',
                        data: JSON.stringify(queryData),
                        success: function (taskData) {
                            $.ajax({
                                url: webserviceurl + "/bwtenants",
                                type: "DELETE",
                                contentType: 'application/json',
                                data: JSON.stringify(queryData),
                                success: function (tenantData) {
                                    // Render the user dropdown tenant membership link.
                                    //var tmHtml = '';

                                    $.ajax({
                                        url: webserviceurl + "/bwparticipants",
                                        type: "DELETE",
                                        contentType: 'application/json',
                                        data: JSON.stringify(queryData),
                                        success: function (participantsData) {
                                            $.ajax({
                                                url: webserviceurl + "/bwbudgetrequestspending",
                                                type: "DELETE",
                                                contentType: 'application/json',
                                                data: JSON.stringify(queryData),
                                                success: function (brData) {
                                                    try {
                                                        if (taskData.length == 0 && brData.PendingBudgetRequests.length == 0 && brData.PendingPOBudgetRequests.length == 0) {

                                                            html += '<span class="spanH3_40">' + bwParticipantFriendlyName + ' has no pending tasks, and there are no pending budget requests.</span>'; //&nbsp;<input type="button" value="Refresh" onclick="javascript:renderAlerts();" style="cursor:pointer;" />';

                                                        }

                                                        // Display the home page alerts.
                                                        var deferredIndex = 1; // We only have 1 workflow to display, but if we want to display multiple, use this value.

                                                        //html += '<table id="bwWorkflowFunctionalAreaSection' + deferredIndex.toString() + '" style="cursor:default;" title="">';
                                                        html += '<table id="tblHomePageAlertSectionForWorkflow' + deferredIndex.toString() + '" style="cursor:default;" title="">';
                                                        //html += '<table id="tblSummaryPageFunctionalAreaSectionForWorkflow' + deferredIndex.toString() + '" style="cursor:default;" title="">';


                                                        //html += '<tr id="functionalAreaRow_' + deferredIndex.toString() + '_Top_1" style="visibility:hidden;"><td colspan="7"></td></tr>'; // This is the invisible one at the top used for reordering.
                                                        //html += '<tr id="functionalAreaRow_' + deferredIndex.toString() + '_Top_2" style="visibility:hidden;"><td colspan="7"></td></tr>'; // This is the row underneath it for displaying the details.
                                                        html += '<tr id="functionalAreaRow_' + deferredIndex.toString() + '_Top_1"><td colspan="7"></td></tr>'; // This is the invisible one at the top used for reordering.
                                                        html += '<tr id="functionalAreaRow_' + deferredIndex.toString() + '_Top_2"><td colspan="7"></td></tr>'; // This is the row underneath it for displaying the details.
                                                        var pendingHtml = '';
                                                        var notPendingHtml = '';
                                                        // notifications
                                                        //    [0] - home page notifications
                                                        //       .length - # of notification types 
                                                        //       [index] - notificationDetails
                                                        //              [0] - Notification type ("task", "budget request", "invitation")
                                                        //              [1] - Notification text (eg. "You have 2 Pending task(s).")
                                                        //              [2] - individualNotifications 
                                                        //                 .length - # of notifications
                                                        //                 [index]
                                                        //                        [0] - These vary depending on the notification type.
                                                        //                        [1] - xxxx
                                                        //                        [2] - xxxx
                                                        //                        [3] - xxxx
                                                        //                        [4] - xxxx
                                                        //                        [5] - xxxx

                                                        notifications = new Array(4);

                                                        notifications[0] = []; //new Array(3); // Initialize the task section.
                                                        notifications[0] = new Array(3);
                                                        notifications[1] = []; //new Array(3); // Initialize the budget requests section.
                                                        notifications[1] = new Array(3);
                                                        notifications[2] = []; //new Array(3); // Initialize the invitations section.
                                                        notifications[2] = new Array(3);
                                                        notifications[3] = []; //new Array(3); // Initialize the recommended section.
                                                        notifications[3] = new Array(3);

                                                        // Now we create and load the tasks in notifications[0].
                                                        notifications[0][0] = 'task';
                                                        if (taskData.length == 1) {
                                                            notifications[0][1] = bwParticipantFriendlyName + ' has ' + taskData.length + ' pending task.';
                                                        } else {
                                                            notifications[0][1] = bwParticipantFriendlyName + ' has ' + taskData.length + ' pending tasks.';
                                                        }
                                                        notifications[0][2] = [];
                                                        if (taskData.length > 0) {
                                                            notifications[0][2] = new Array(taskData.length);
                                                            for (var i = 0; i < taskData.length; i++) {
                                                                notifications[0][2][i] = new Array(15);
                                                                notifications[0][2][i][0] = taskData[i].bwTaskTitle;
                                                                notifications[0][2][i][1] = taskData[i].bwStatus;
                                                                notifications[0][2][i][2] = taskData[i].bwPercentComplete;
                                                                notifications[0][2][i][3] = taskData[i].bwRelatedItemId;
                                                                notifications[0][2][i][4] = taskData[i].bwAssignedTo;
                                                                notifications[0][2][i][5] = taskData[i].bwAssignedToId;
                                                                notifications[0][2][i][6] = taskData[i].bwDueDate;
                                                                notifications[0][2][i][7] = taskData[i].ProjectTitle;
                                                                notifications[0][2][i][8] = taskData[i].BudgetAmount;
                                                                notifications[0][2][i][9] = taskData[i].FinancialAreaId;
                                                                notifications[0][2][i][10] = taskData[i].CreatedBy;
                                                                notifications[0][2][i][11] = taskData[i].Title;
                                                                notifications[0][2][i][12] = taskData[i].RequestedCapital;
                                                                notifications[0][2][i][13] = taskData[i].RequestedExpense;
                                                                notifications[0][2][i][14] = taskData[i].TaskType;
                                                            }
                                                        }

                                                        html += '</table>';
                                                        //var unitTable1 = '';
                                                        html += '<div id="BWFunctionalAreaDiv' + deferredIndex.toString() + '" style="cursor:pointer;" >';
                                                        html += '<table id="BWFunctionalArea' + deferredIndex.toString() + '" style="vertical-align:top;width:100%;">';

                                                        ntypeindex = 0;
                                                        //var topHtml = '';
                                                        //if (notificationType == 'task') {
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
                                                            //notifications[0][2][i][15] = taskData[i].bwAssignedToRaciRoleAbbreviation;
                                                            //notifications[0][2][i][16] = taskData[i].bwAssignedToRaciRoleName;
                                                            var bwAssignedToRaciRoleAbbreviation = notifications[ntypeindex][2][pi][15];
                                                            var bwAssignedToRaciRoleName = notifications[ntypeindex][2][pi][16];

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

                                                            html += '   <tr>';
                                                            html += '       <td style="width:10px;"></td>';
                                                            html += '       <td style="width:10px;"></td>';

                                                            // Find the functional area name.
                                                            var functionalAreaId = notifications[ntypeindex][2][pi][9];
                                                            var functionalAreaName = '';

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
                                                                html += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;" colspan="5"><div style="display:inline-block;"><a style="cursor:pointer;" onclick="displayRecurringExpenseOnTheHomePage(\'' + budgetRequestId + '\', \'' + bwParticipantId + '\', \'' + title + '\');" target="_blank" title="Click to view the recurring expense...">' + daysSinceTaskCreated.toString() + ' days overdue: Recurring expense <em>(' + brTitle + ' - ' + functionalAreaName + ') is due to be submitted</em></a></div></td>';
                                                            } else if (taskType == 'BUDGET_REQUEST_WORKFLOW_TASK') {
                                                                //topHtml += '<td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'#d8d8d8\';" colspan="5" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');" target="_blank" title="xClick to view the request ' + title + '.">';
                                                                html += '<td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="5" >';

                                                                html += '<div style="display:inline-block;">';
                                                                //html += daysSinceTaskCreated.toString() + ' days overdue: <em>' + title + ' - ' + brTitle + ' - ' + formatCurrency(currentAmount) + ' - ' + functionalAreaName + ' ' + '[(' + bwAssignedToRaciRoleAbbreviation + ') ' + bwAssignedToRaciRoleName + ']' + '</em>';
                                                                html += daysSinceTaskCreated.toString() + ' days overdue: <em>' + title + ' - ' + brTitle + ' - ' + formatCurrency(currentAmount) + ' - ' + functionalAreaName + ' ' + '</em>';
                                                                html += '</div>';
                                                                html += '</td>';

                                                            } else {
                                                                html += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;" colspan="5">UNKNOWN TASK TYPE</td>';
                                                            }

                                                            html += '        </tr>';
                                                        }

                                                        html += '</table><br />';
                                                        //$('#divHomePageAlert').html(html);

                                                        html += '<br />';
                                                        html += '<br />';
                                                        html += '<hr style="border:0 none; border-bottom: 1px solid lightgray;" />';
                                                        html += '       <span style="font-size:8pt;white-space:nowrap;">Report date: ' + reportDate + '</span>';





                                                        // Do the printing.
                                                        //document.body.innerHTML = html;
                                                        //debugger;
                                                        var iframe = document.getElementById("printf");
                                                        if (!iframe) { // for some reason this gets added twice to the DOM. FIgure this out someday, but for now this seems to fix it.
                                                            iframe = document.createElement('iframe');
                                                            iframe.id = 'printf';
                                                            iframe.name = 'printf';
                                                            document.body.appendChild(iframe); // to place at end of document
                                                        }
                                                        var iframeDocument = iframe.contentDocument;
                                                        iframeDocument.body.innerHTML = html;



                                                        //window.frames["printf"].focus();
                                                        //window.frames["printf"].print();
                                                        //and use 
                                                        //<iframe id="printf" name="printf"></iframe>






                                                        var printNow = function () {
                                                            setTimeout(function () { // Only needs to happen for Chrome.
                                                                //
                                                                // We have to do this for Chrome! Not for firefox or Edge. The extra time allows the dom to load images.
                                                                //
                                                                //debugger;
                                                                //window.print(); // In Safari on MacBook, and Safari & Chrome on iOS, this is a synchronous call!!! (unlike most other situations where it is asynchronous).
                                                                //window.frames["printf"].focus();
                                                                //debugger;
                                                                window.frames["printf"].print();
                                                                console.log('window.print() has just been executed. In Safari on MacBook, and Safari & Chrome on iOS, this is a synchronous call.');

                                                                var frame = document.getElementById("printf");
                                                                frame.parentNode.removeChild(frame);

                                                                // Put back the original contents into the dom, and re-display the form dialog.
                                                                //document.body.innerHTML = originalFormBeforePrinting;
                                                                // Render the Print button.
                                                                //var printButtonOptions = {
                                                                //    reportType: 'MyPendingTasksReport'
                                                                //};
                                                                //var $printbutton = $('#spanArchivePagePrintButton').bwDonate(printButtonOptions);


                                                            }, 250);
                                                        }








                                                        // Lazy loading the participant image.
                                                        var imagePath2 = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/participantimages/' + bwParticipantId + '/' + 'userimage.png';
                                                        $.get(imagePath2).done(function () {
                                                            setTimeout(function () { // Only needs to happen for Chrome.
                                                                //$('#imgParticipantImage').attr('src', imagePath2);
                                                                //printNow();
                                                                var iFrameDOM = $('#printf').contents();

                                                                iFrameDOM.find('#imgParticipantImage').attr('src', imagePath2);

                                                                printNow();
                                                            }, 500);
                                                        }).fail(function () {
                                                            // This participant has no image. do nothing 
                                                            printNow();
                                                        });




                                                        window.onafterprint = function (e) {
                                                            try {
                                                                console.log('Print Dialog Closed.');

                                                                debugger;
                                                                var frame = document.getElementById("printf");
                                                                frame.parentNode.removeChild(frame);

                                                                // Put back the original contents into the dom, and re-display the form dialog. This only needs to happen 
                                                                //document.body.innerHTML = originalFormBeforePrinting;
                                                                // Render the Print button.
                                                                //var printButtonOptions = {
                                                                //    reportType: 'MyPendingTasksReport'
                                                                //};
                                                                //var $printbutton = $('#spanArchivePagePrintButton').bwDonate(printButtonOptions);

                                                                //$("#divOfflineRequestFormDialog").dialog('open');
                                                                //alert('done printing');
                                                            } catch (e) {
                                                                console.log('Exception in PrintPendingTasksReport.window.onafterprint: ' + e.message);
                                                            }
                                                        };


                                                    } catch (e) {
                                                        //debugger;
                                                        console.log('Exception in PrintPendingTasksReport(): ' + e.message + ', ' + e.stack);
                                                    }

                                                },
                                                error: function (data, errorCode, errorMessage) {
                                                    //displayAlertDialog('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
                                                    displayAlertDialog('Error in PrintPendingTasksReport():1:' + errorCode + ', ' + errorMessage + ' I believe this happens when wifi goes down. SERVICE UNAVAILABLE ');
                                                }
                                            });
                                        },
                                        error: function (data, errorCode, errorMessage) {
                                            //displayAlertDialog('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
                                            displayAlertDialog('Error in PrintPendingTasksReport():2:' + errorCode + ', ' + errorMessage);
                                        }
                                    });
                                },
                                error: function (data, errorCode, errorMessage) {
                                    //displayAlertDialog('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
                                    displayAlertDialog('Error in PrintPendingTasksReport():3:' + errorCode + ', ' + errorMessage);
                                }
                            });
                        },
                        error: function (data, errorCode, errorMessage) {
                            //displayAlertDialog('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
                            displayAlertDialog('Error in PrintPendingTasksReport():4:' + errorCode + ', ' + errorMessage + ', ' + JSON.stringify(data));
                        }
                    });
                },
                error: function (data, errorCode, errorMessage) {
                    //displayAlertDialog('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
                    //displayAlertDialog('Error in ios8.js.renderAlerts():5:' + errorCode + ', ' + errorMessage);
                    displayAlertDialog('Error in PrintPendingTasksReport():5:' + errorCode + ', ' + errorMessage + ': Most likely service unavailable issue.'); // Todd: self raising this error here. As of 4-20-17 this is the only place this happens.
                }
            });

        } catch (e) {
            console.log('Error in PrintPendingTasksReport(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in PrintPendingTasksReport(): ' + e.message + ', ' + e.stack);
        }

        // See the following for custom css to use the media = print attribute. We are not using any aspects of this approach yet.
        // https://www.arclab.com/en/kb/htmlcss/how-to-print-a-specific-part-of-a-html-page-css-media-screen-print.html

    },

    PrintCurrentYearBudgetRequestsReport: function () {
        //debugger;
        //$('#PrintDialog2').dialog('close');

        try {
            // Then we iterate throgh all of the html elements, and display set to inline.
            var thiz = this;
            //var originalFormBeforePrinting = document.body.innerHTML;

            var html = '';


            var filter = 'all';
            var data = {
                "bwWorkflowAppId": workflowAppId
            };
            $.ajax({
                url: webserviceurl + "/bwbudgetrequestsdataset",
                type: "DELETE",
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (data) {
                    var brData = data.d.results[0]; // Budget Requests.
                    var sData = data.d.results[1]; // Supplementals.
                    if (brData.length == 0 && sData.length == 0) {
                        //var html = '';
                        html += '<br /><br />';
                        html += '<span style="font-size:large;font-style:italic;">There have been no Budget Requests created in this workflow yet.</span>';
                        //$('#spanBwBudgetRequests').append(html);
                        // Render the html.
                        thiz.element.html(html);

                    } else {
                        // Assuming this comes in random order, we need to do a sort here and put into an array.
                        // This is not going to be an efficient sort to start with, but who cares it's on the client side! :D
                        budgetRequests = [];
                        budgetRequests = new Array(brData.length);
                        supplementals = [];
                        supplementals = new Array(brData.length);
                        statusesForTheStatusDropdown = [];
                        statusesForTheStatusDropdown = new Array();
                        // First we load the array.
                        for (var i = 0; i < brData.length; i++) {
                            budgetRequests[i] = brData[i];
                        }
                        // Now we iterate through the supplementals, and store them with their budget request.
                        for (var i = 0; i < budgetRequests.length; i++) {
                            // Build out our intelligent Status drop down. It only includes Statuses that are actually present!! Yeah!
                            var weHaveThisStatusAlready = false;
                            for (var s = 0; s < statusesForTheStatusDropdown.length; s++) {
                                if (budgetRequests[i].BudgetWorkflowStatus == statusesForTheStatusDropdown[s]) weHaveThisStatusAlready = true;
                            }
                            if (weHaveThisStatusAlready != true) statusesForTheStatusDropdown.push(budgetRequests[i].BudgetWorkflowStatus);
                            // Now lets get back to the nuilding of our arrays.
                            var brId = budgetRequests[i].bwBudgetRequestId;
                            supplementals[i] = [];
                            supplementals[i] = new Array();
                            for (var x = 0; x < sData.length; x++) {
                                if (brId == sData[x].RelatedBudgetRequestId) {
                                    // We have found a supplemental for this budget request, so add it!
                                    supplementals[i].push(sData[x]);
                                    // Build out our intelligent Status drop down. It only includes Statuses that are actually present!! Yeah!
                                    var weHaveThisStatusAlready = false;
                                    for (var s = 0; s < statusesForTheStatusDropdown.length; s++) {
                                        if (sData[x].BudgetWorkflowStatus == statusesForTheStatusDropdown[s]) weHaveThisStatusAlready = true;
                                    }
                                    if (weHaveThisStatusAlready != true) statusesForTheStatusDropdown.push(sData[x].BudgetWorkflowStatus);
                                }
                            }
                        }
                        // Now that we have all our data in the array properly, lets display it!
                        //var html = '';
                        var year = new Date().getFullYear().toString(); // todd hardcoded.
                        //html += '<br />Year:&nbsp;' + year + '';
                        var reportDate = new Date();

                        html += '<table style="width:100%;">';
                        html += '  <tr>';
                        html += '    <td style="text-align:right;">';
                        html += '       <table>';
                        html += '           <tr>';
                        html += '               <td style="text-align:center;">';
                        html += '                   <span><img id="imgOrganizationImage" src="' + thiz.options.operationUriPrefix + 'images/corporeal.png" style="width:200px;height:200px;"/>';
                        html += '                   </span>';
                        html += '               </td>';
                        html += '           </tr>';
                        html += '           <tr>';
                        html += '               <td style="text-align:center;">';
                        html += '                   <span>';
                        html += '                   ' + workflowAppTitle;
                        html += '                   </span>';
                        html += '               </td>';
                        html += '           </tr>';
                        html += '       </table>';
                        html += '    </td>';
                        html += '    <td style="text-align:center;">';
                        html += '       <span><h2>' + year + ' Budget Requests</h2></span>';
                        html += '    </td>';
                        html += '  </tr>';
                        html += '</table>';





                        //html += '&nbsp;&nbsp;<input type="button" disabled value="View trashbin contents" onclick="cmdDisplayArchivePageTrashbinContents();" style="cursor:pointer;padding:5px 10px 5px 10px;" />';
                        //html += '&nbsp;&nbsp;';
                        //html += '<input type="button" value="View extended information" onclick="cmdDisplayArchivePageExtendedInformation();" style="cursor:pointer;padding:5px 10px 5px 10px;" />';


                        //html += '<br /><input type="checkbox" />&nbsp;Display supplementals';
                        //html += '<br /><input type="checkbox" />&nbsp;View recurring expenses';
                        //html += '<br /><input type="checkbox" />&nbsp;View closeouts';
                        html += '<br /><br />';

                        html += '<style>';
                        html += '.dataGridTable { border: 1px solid gainsboro; font-size:12px; font-family: "Helvetica Neue","Segoe UI",Helvetica,Verdana,sans-serif; }';
                        html += '.dataGridTable td { border-left: 0px; border-right: 1px solid gainsboro; }';
                        html += '.headerRow { background-color:white; color:gray;border-bottom:1px solid gainsboro; }';
                        html += '.headerRow td { border-bottom:1px solid gainsboro; padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
                        html += '.filterRow td { border-bottom:1px solid whitesmoke; padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
                        html += '.alternatingRowLight { background-color:white; }';
                        html += '.alternatingRowLight:hover { background-color:lightgoldenrodyellow; }';
                        html += '.alternatingRowDark { background-color:whitesmoke; }';
                        html += '.alternatingRowDark:hover { background-color:lightgoldenrodyellow; }';
                        html += '</style>';

                        //html += '<table class="myStuffTable">';
                        html += '<table class="dataGridTable">';
                        html += '  <tr class="headerRow">';
                        html += '    <td></td>';
                        html += '    <td>Description</td>';


                        html += '    <td>Created Date</td>';

                        html += '    <td style="white-space:nowrap;">Financial Area</td>';

                        html += '    <td>Location</td>';


                        //html += '    <td>Status</td>';
                        //html += '    <td>ARStatus</td>';
                        //html += '    <td>Current Owner(s)</td>';

                        html += '    <td>Capital Cost</td>';
                        html += '    <td>Expense</td>';
                        html += '    <td>Lease</td>';

                        html += '    <td>Total</td>';

                        html += '    <td>Simple Payback</td>';

                        //html += '    <td></td>';
                        html += '  </tr>';

                        //html += '  <tr class="filterRow">';
                        //// Request #
                        //html += '    <td><span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="alert(\'Order ascending...\');">☝</span><span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="alert(\'Order descending...\');">☟</span></td>';
                        //// Description
                        //html += '    <td style="white-space:nowrap;"><input type="text" id="txtArchivePageDescriptionFilter" class="archivePageFilterBox" title="Type here to limit search results, using * as a wildcard character."/>&nbsp;<img src="images/icon-down.png" title="Sort order" style="cursor:pointer;" /></td>';
                        //// Created Date
                        //html += '    <td></td>';
                        //// Financial Areas.
                        //html += '    <td style="white-space:nowrap;">';
                        //html += '      <select id="ddlArchivePageFinancialAreaDropDownFilter" class="archivePageFilterDropDown" title="Select here to limit the search results.">';
                        //for (var x = 0; x < BWMData[0].length; x++) {
                        //    if (BWMData[0][x][0] == workflowAppId) {
                        //        // Now put the empty option.
                        //        html += '<option value="" class="archivePageFilterOptionDropDown">Show all...</option>';
                        //        for (var y = 0; y < BWMData[0][x][4].length; y++) {
                        //            var faId = BWMData[0][x][4][y][0];
                        //            var faTitle = BWMData[0][x][4][y][1];
                        //            html += '<option value="' + faId + '" class="archivePageFilterOptionDropDown">';
                        //            html += faTitle;
                        //            html += '</option>';
                        //        }

                        //    }
                        //}
                        //html += '      </select>';
                        //html += '    </td>';
                        //// Location
                        //html += '    <td></td>';
                        //// Status
                        //html += '    <td style="white-space:nowrap;">';
                        //html += '<select id="selectArchivePageFilterDropDown" class="archivePageFilterDropDown" title="Select here to limit the search results.">';
                        //// Now put the empty option.
                        //html += '<option value="" class="archivePageFilterOptionDropDown">Show all...</option>';
                        //// statusesForTheStatusDropdown
                        //for (var s = 0; s < statusesForTheStatusDropdown.length; s++) {
                        //    html += '<option value="' + statusesForTheStatusDropdown[s] + '" class="archivePageFilterOptionDropDown">' + statusesForTheStatusDropdown[s] + '</option>';
                        //}
                        //html += '</select>&nbsp;<img src="images/icon-down.png" title="Sort order" style="cursor:pointer;" />';
                        //html += '    </td>';
                        //// ARStatus
                        //html += '    <td></td>';
                        //// Current Owner(s)
                        //html += '    <td></td>';
                        //// Capital Cost
                        //html += '    <td></td>';
                        //// Expense
                        //html += '    <td></td>';
                        //// Lease
                        //html += '    <td></td>';
                        //// Total
                        //html += '    <td style="white-space:nowrap;"><input type="text" id="txtArchivePageBudgetAmountFilter" class="archivePageFilterBox" title="Enter a number. Shows all equal to or greater than."/>&nbsp;<img src="images/icon-down.png" title="Sort order" style="cursor:pointer;" /></td>';
                        //// Simple Payback
                        //html += '    <td></td>';
                        //// Trash Bin
                        //html += '    <td></td>';

                        //html += '  </tr>';

                        var alternatingRow = 'light'; // Use this to color the rows.
                        for (var i = 0; i < budgetRequests.length; i++) {
                            //debugger;
                            if (alternatingRow == 'light') {
                                html += '  <tr class="alternatingRowLight" style="cursor:pointer;" title="Project description: ' + JSON.parse(budgetRequests[i].bwRequestJson).BriefDescriptionOfProject + '" >'; // Display BriefDescriptionOfProject as a tool tip.
                                alternatingRow = 'dark';
                            } else {
                                html += '  <tr class="alternatingRowDark" style="cursor:pointer;" title="Project description: ' + JSON.parse(budgetRequests[i].bwRequestJson).BriefDescriptionOfProject + '" >';
                                alternatingRow = 'light';
                            }

                            // Request #
                            html += '      <td style="padding:5px;white-space:nowrap;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');">' + budgetRequests[i].Title + '</td>';
                            // Description
                            html += '      <td style="padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');">' + budgetRequests[i].ProjectTitle + '</td>';
                            // Created Date
                            //html += '    <td></td>';
                            html += '      <td style="padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');">' + getFriendlyDateAndTime(budgetRequests[i].Created) + '</td>';
                            // Financial Area
                            for (var x = 0; x < BWMData[0].length; x++) {
                                if (BWMData[0][x][0] == workflowAppId) {
                                    for (var y = 0; y < BWMData[0][x][4].length; y++) {
                                        if (BWMData[0][x][4][y][0] == budgetRequests[i].FunctionalAreaId) {
                                            // We have found the financial area, so we have the title! Yay!
                                            var faTitle = BWMData[0][x][4][y][1];
                                            html += '<td style="padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');" >';
                                            html += faTitle;
                                            html += '</td>';
                                        }
                                    }
                                }
                            }
                            // Location
                            html += '      <td style="padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');">' + budgetRequests[i].OrgName + '</td>';
                            //// Status
                            //html += '    <td style="padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');">' + budgetRequests[i].BudgetWorkflowStatus + '</td>';
                            //// ARStatus
                            //html += '    <td style="padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');">' + budgetRequests[i].ARStatus + '</td>';
                            //// Current Owner(s)
                            //html += '    <td style="padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');">' + budgetRequests[i].CurrentOwner + '</td>';
                            // Capital Cost
                            html += '    <td></td>';
                            // Expense
                            html += '    <td></td>';
                            // Lease
                            html += '    <td></td>';
                            // Total. Strikethrough the budget amount for a rejected AR.
                            if (budgetRequests[i].ARStatus == 'Rejected') {
                                html += '    <td style="text-align:right;padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');"><strike>' + formatCurrency(budgetRequests[i].BudgetAmount) + '</strike></td>';
                            } else {
                                html += '    <td style="text-align:right;padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');">' + formatCurrency(budgetRequests[i].BudgetAmount) + '</td>';
                            }

                            //html += '    <td>';
                            //tempCloseOutXml = budgetRequests[i].bwDocumentXml;
                            //html += '       <a href="javascript:displayForm_DisplayCloseOut();" style="white-space:nowrap;">Close Out</a>';
                            //html += '    </td>';

                            // Simple Payback
                            html += '    <td></td>';
                            // Trash Bin
                            //html += '<td style="padding:5px;" onclick="cmdDisplayDeleteBudgetRequestDialog(\'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\');">';
                            //html += '  <img src="images/trash-can.png" title="xDelete" style="cursor:pointer;" />';
                            //html += '</td>';

                            html += '  </tr>';
                            for (var x = 0; x < supplementals[i].length; x++) {
                                // Display the supplementals.
                                html += '  <tr style="font-style:italic;font-size:small;">';
                                //html += '      <td><a href="javascript:displayArOnTheHomePage(\'' + supplementals[i][x].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + supplementals[i][x].Title + '\');">' + supplementals[i][x].ProjectTitle + '</a></td>';
                                html += '      <td><a onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + supplementals[i][x].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + supplementals[i][x].Title + '\');">' + supplementals[i][x].ProjectTitle + '</a></td>';
                                for (var x2 = 0; x2 < BWMData[0].length; x2++) {
                                    if (BWMData[0][x2][0] == workflowAppId) {
                                        for (var y = 0; y < BWMData[0][x2][4].length; y++) {
                                            if (BWMData[0][x2][4][y][0] == supplementals[i][x].FunctionalAreaId) {
                                                // We have found the financial area, so we have the title! Yay!
                                                var faTitle = BWMData[0][x2][4][y][1];
                                                html += '<td>';
                                                html += faTitle;
                                                html += '</td>';
                                            }
                                        }
                                    }
                                }
                                html += '    <td style="text-align:right;">' + supplementals[i][x].BudgetAmount + '</td>';
                                html += '    <td>' + supplementals[i][x].BudgetWorkflowStatus + '</td>';
                                html += '    <td></td>';
                                html += '    <td>' + supplementals[i][x].CurrentOwner + '</td>';
                                html += '  </tr>';
                            }
                        }
                        html += '<tr><td colspan="12"></td></tr>'; // DONE
                        html += '</table>';

                    }

                    html += '<br />';
                    html += '<br />';
                    html += '<hr style="border:0 none; border-bottom: 1px solid lightgray;" />';
                    html += '       <span style="font-size:8pt;white-space:nowrap;">Report date: ' + reportDate + '</span>';


                    // Do the printing.
                    //document.body.innerHTML = html;
                    var iframe = document.getElementById("printf");
                    if (!iframe) { // for some reason this gets added twice to the DOM. FIgure this out someday, but for now this seems to fix it.
                        iframe = document.createElement('iframe');
                        iframe.id = 'printf';
                        iframe.name = 'printf';
                        document.body.appendChild(iframe); // to place at end of document
                    }
                    var iframeDocument = iframe.contentDocument;
                    iframeDocument.body.innerHTML = html;




                    var printNow = function () {
                        setTimeout(function () { // Only needs to happen for Chrome.
                            //
                            // We have to do this for Chrome! Not for firefox or Edge. The extra time allows the dom to load images.
                            //
                            //window.print(); // In Safari on MacBook, and Safari & Chrome on iOS, this is a synchronous call!!! (unlike most other situations where it is asynchronous).
                            //console.log('window.print() has just been executed. In Safari on MacBook, and Safari & Chrome on iOS, this is a synchronous call.');

                            //// Put back the original contents into the dom, and re-display the form dialog.
                            //document.body.innerHTML = originalFormBeforePrinting;
                            //// Render the Print button.
                            //var printButtonOptions = {
                            //    reportType: 'CurrentYearBudgetRequestsReport'
                            //};
                            //var $printbutton = $('#spanArchivePagePrintButton').bwDonate(printButtonOptions);

                            window.frames["printf"].print();
                            console.log('window.print() has just been executed. In Safari on MacBook, and Safari & Chrome on iOS, this is a synchronous call.');

                            var frame = document.getElementById("printf");
                            frame.parentNode.removeChild(frame);

                        }, 250);
                    }



                    // Lazy loading the participant image.
                    //debugger;
                    //var imagePath2 = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/participantimages/' + participantId + '/' + 'userimage.png';
                    var imagePath2 = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/orgimages/' + 'root' + '/' + 'orgimage.png';
                    $.get(imagePath2).done(function () {
                        setTimeout(function () { // Only needs to happen for Chrome.
                            //$('#imgOrganizationImage').attr('src', imagePath2);
                            //printNow();
                            var iFrameDOM = $('#printf').contents();

                            iFrameDOM.find('#imgOrganizationImage').attr('src', imagePath2);

                            printNow();
                        }, 500);
                    }).fail(function () {
                        // This participant has no image. do nothing 
                        printNow();
                    });







                    window.onafterprint = function (e) {
                        try {
                            console.log('Print Dialog Closed.');

                            var frame = document.getElementById("printf");
                            frame.parentNode.removeChild(frame);

                            //// Put back the original contents into the dom, and re-display the form dialog. This only needs to happen 
                            //document.body.innerHTML = originalFormBeforePrinting;
                            //// Render the Print button.
                            //var printButtonOptions = {
                            //    reportType: 'CurrentYearBudgetRequestsReport'
                            //};
                            //var $printbutton = $('#spanArchivePagePrintButton').bwDonate(printButtonOptions);




                            //$("#divOfflineRequestFormDialog").dialog('open');
                            //alert('done printing');
                        } catch (e) {
                            console.log('Exception in window.onafterprint: ' + e.message);
                        }
                    };



                    //setTimeout(function () { // Only needs to happen for Chrome.
                    //    //
                    //    // We have to do this for Chrome! Not for firefox or Edge. The extra time allows the dom to load images.
                    //    //
                    //    window.print(); // In Safari on MacBook, and Safari & Chrome on iOS, this is a synchronous call!!! (unlike most other situations where it is asynchronous).
                    //    console.log('window.print() has just been executed. In Safari on MacBook, and Safari & Chrome on iOS, this is a synchronous call.');

                    //    // Put back the original contents into the dom, and re-display the form dialog.
                    //    document.body.innerHTML = originalFormBeforePrinting;
                    //    // Render the Print button.
                    //    var printButtonOptions = {
                    //        reportType: 'CurrentYearBudgetRequestsReport'
                    //    };
                    //    var $printbutton = $('#spanArchivePagePrintButton').bwDonate(printButtonOptions);


                    //}, 250);


                    //window.print(); // In Safari on MacBook, and Safari & Chrome on iOS, this is a synchronous call!!! (unlike most other situations where it is asynchronous).
                    //console.log('window.print() has just been executed. In Safari on MacBook, and Safari & Chrome on iOS, this is a synchronous call.');



                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in my.js.CurrentYearBudgetRequestsReport():' + errorCode + ', ' + errorMessage);
                }
            });

            //
            // KEEP THE FOLLOWING CODE BECAUSE THERE ARE GEMS WITHIN!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            //
            //
            // Now lets generate the new one (the printable version)...
            //var promise = displayForm_DisplayCachedArWithPrintableHtml(bwBudgetRequestId);
            //promise.then(function (result) {
            //    //printOutput("Result: " + result);
            //    console.log('Declaring attachment to the window.onafterprint event. This doesn\'t seem to work on MacBook Safari, or iOS (Safari and Chrome).');
            //    window.onafterprint = function (e) {
            //        try {
            //            console.log('Print Dialog Closed.');
            //            // Put back the original contents into the dom, and re-display the form dialog.
            //            document.getElementById('divDocumentBody').innerHTML = originalFormBeforePrinting;
            //            $("#divOfflineRequestFormDialog").dialog('open');
            //        } catch (e) {
            //            console.log('Exception in window.onafterprint: ' + e.message);
            //        }
            //    };
            //    console.log('navigator.userAgent: ' + navigator.userAgent);
            //    console.log('window.matchMedia: ' + window.matchMedia);
            //    //if ((navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) && !navigator.userAgent.match(/CriOS/i)) {
            //    //    // DOESNT WORK YET! THESE MAY HAVE ASYNC window.print call but no onafterprint event???
            //    //    if (window.matchMedia) {
            //    //        var printQuery = window.matchMedia('print');
            //    //        printQuery.addListener(function () {
            //    //            var screenQuery = window.matchMedia('screen');
            //    //            screenQuery.addListener(function () {
            //    //                //actions after print dialog close here
            //    //                console.log('Print Dialog Closed2. Safari on iOS?');
            //    //                displayAlertDialog('Print Dialog Closed2. Safari on iOS?');
            //    //                // Put back the original contents into the dom, and re-display the form dialog.
            //    //                document.getElementById('divDocumentBody').innerHTML = originalFormBeforePrinting;
            //    //                $("#divOfflineRequestFormDialog").dialog('open');
            //    //            });
            //    //        });
            //    //    }
            //    //} else if ((navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) && navigator.userAgent.match(/CriOS/i)) {
            //    //if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
            //    //    var beforePrint = function () {
            //    //        console.log('Functionality to run before printing.');
            //    //    };
            //    //    var afterPrint = function () {
            //    //        console.log('Functionality to run after printing');
            //    //        // Put back the original contents into the dom, and re-display the form dialog.
            //    //        document.getElementById('divDocumentBody').innerHTML = originalFormBeforePrinting;
            //    //        $("#divOfflineRequestFormDialog").dialog('open');
            //    //    };
            //    //    if (window.matchMedia) {
            //    //        var mediaQueryList = window.matchMedia('print');
            //    //        mediaQueryList.addListener(function (mql) {
            //    //            if (mql.matches) {
            //    //                beforePrint();
            //    //            } else {
            //    //                afterPrint();
            //    //            }
            //    //        });
            //    //    }
            //    //    window.onbeforeprint = beforePrint;
            //    //    window.onafterprint = afterPrint;
            //    //} else if (navigator.userAgent.match(/Macintosh/i) && navigator.userAgent.match(/Safari/i)) {
            //        console.log('Print Dialog Closed4. Safari on Macintosh?');
            //        // Put back the original contents into the dom, and re-display the form dialog.
            //        document.getElementById('divDocumentBody').innerHTML = originalFormBeforePrinting;
            //        //$("#divOfflineRequestFormDialog").dialog('open');
            //    //}
            //    window.print(); // In Safari on MacBook, and Safari & Chrome on iOS, this is a synchronous call!!! (unlike most other situations where it is asynchronous).
            //    console.log('window.print() has just been executed. In Safari on MacBook, and Safari & Chrome on iOS, this is a synchronous call.');
            //});
            //
            // End: KEEP THE FOLLOWING CODE BECAUSE THERE ARE GEMS WITHIN!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            //


        } catch (e) {
            console.log('Error in CurrentYearBudgetRequestsReport(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in CurrentYearBudgetRequestsReport(): ' + e.message + ', ' + e.stack);
        }

        // See the following for custom css to use the media = print attribute. We are not using any aspects of this approach yet.
        // https://www.arclab.com/en/kb/htmlcss/how-to-print-a-specific-part-of-a-html-page-css-media-screen-print.html

    },


    PrintIndividualRequestReport: function (orgId) {
        //debugger;
        //$('#PrintDialog2').dialog('close');

        try {
            // Then we iterate throgh all of the html elements, and display set to inline.
            var thiz = this;
            //var originalFormBeforePrinting = document.body.innerHTML;

            var html = '';


            var year = new Date().getFullYear().toString(); // todd hardcoded.
            //html += '<br />Year:&nbsp;' + year + '';
            var reportDate = new Date();

            html += '<table style="width:100%;">';
            html += '  <tr>';

            html += '    <td style="text-align:right;">';
            html += '       <table>';
            html += '           <tr>';
            html += '               <td style="text-align:center;">';








            html += '                   <span><img id="imgRequestOrgImage" src="' + thiz.options.operationUriPrefix + 'images/corporeal.png" style="width:200px;height:200px;"/>';

           










            html += '                   </span>';
            html += '               </td>';
            html += '           </tr>';
            html += '           <tr>';
            html += '               <td style="text-align:center;">';
            html += '                   <span>';
            html += '                   ' + workflowAppTitle;
            html += '                   </span>';
            html += '               </td>';
            html += '           </tr>';
            html += '       </table>';
            html += '    </td>';
            html += '    <td style="text-align:center;">';
            html += '       <span><h2>Budget Request: '; // + 'bwBudgetRequestId' + '</h2></span>';
            html += '                           <span class="xdlabel" id="spanRequestForm_Title">';
            html += '                               [spanRequestForm_Title]';
            html += '                           </span>';
            html += '             </h2></span>';
            html += '    </td>';
            html += '  </tr>';
            html += '</table>';


            html += '<div id="budgetrequestform" align="center">';
            html += '<table style="BORDER-TOP-STYLE: none; WORD-WRAP: break-word; BORDER-LEFT-STYLE: none; BORDER-COLLAPSE: collapse; TABLE-LAYOUT: fixed; BORDER-BOTTOM-STYLE: none; BORDER-RIGHT-STYLE: none; " class="xdFormLayout">';
            html += '    <colgroup>';
            html += '        <col style="" />';
            html += '    </colgroup>';
            html += '    <tbody>';
            html += '        <tr class="xdTableContentRow">';
            html += '            <td style="display:block;BORDER-TOP: #d8d8d8 1pt solid; BORDER-RIGHT: #d8d8d8 1pt solid; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 0px; PADDING-TOP: 0px; PADDING-LEFT: 0px; BORDER-LEFT: #d8d8d8 1pt solid; PADDING-RIGHT: 0px" class="xdTableContentCell">';





            html += '<div id="tableLeftTopRequestFormSection" style="display:inline-block;vertical-align:top;">';
            // RED OUTLINE FOR TESTING
            //html += '                                        <table  class="xdFormLayout xdTableStyleTwoCol" style="display:inline-block;border:1px solid red;width:665px;">';
            html += '                                        <table  class="xdFormLayout xdTableStyleTwoCol" style="display:inline-block;border:1px solid aliceblue;width:465px;">';
            html += '                                            <colgroup>';
            html += '                                                <col style="WIDTH: 169px" />';
            //html += '                                                <col style="WIDTH: 480px" />';
            html += '                                                <col style="" />';
            html += '                                            </colgroup>';
            html += '                                            <tbody valign="top">';
            html += '                                                <tr class="xdTableOffsetRow" id="trNewRequestRecurringExpenseSection" style="display:none;">';
            html += '                                                    <td class="xdTableOffsetCellLabel" style="text-align:left; BORDER-TOP: #d8d8d8 1pt; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
            html += '                                                        <span id="spanNewRequestRecurringExpenseSectionTitle" class="xdlabel">Recurring expense:</span>';
            //html += '<span style="color:red;font-size:medium;">*</span>';
            html += '                                                    </td>';
            html += '                                                    <td style="BORDER-TOP: #d8d8d8 1pt; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px" class="xdTableOffsetCellComponent">';
            html += '                                                        <!--<span id="spanNewRequestRecurringExpenseSecondSection"></span>-->';
            html += '                                                        <input id="cbNewRequestRecurringExpenseSubmitImmediately" type="checkbox" disabled />';
            html += '                                                        <span style="font-size:10pt;color:lightgray;">Submit the first budget request immediately.</span>';
            html += '                                                        <br />';
            html += '                                                        <!--<span style="font-size:8pt;">This does not create the budget request, it only schedules the reminder for when the budget request should be submitted.</span>';
            html += '                                                        <br />-->';
            html += '                                                        <span style="font-size:10pt;">Reminder date:</span>';
            html += '                                                        <br />';
            html += '                                                        <input type="text" id="dtRecurringExpenseReminderDate" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: left;" />';
            html += '                                                        <br />';
            html += '                                                        <!--Justification details:';
            html += '                                                        <br />';
            html += '                                                        <textarea id="strRecurringExpenseDetails" rows="1" style="WIDTH: 97%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;"></textarea>';
            html += '                                                        <br />';
            html += '                                                        <input id="cbNewRequestRecurringExpenseNotifyMeOnDateChanged" type="checkbox" />Notify me if anyone changes the date.';
            html += '                                                        <br />-->';
            html += '                                                        <span style="font-size:8pt;">You and the Manager will receive notifications prior to the reminder date so that you can initiate the next new request. Also, if anyone changes the date you will be notified.</span>';
            html += '                                                        <br />';
            html += '                                                    </td>';
            html += '                                                </tr>';
            html += '                                                <tr class="xdTableOffsetRow">';
            html += '                                                    <td class="xdTableOffsetCellLabel" style="text-align:left; BORDER-TOP: #d8d8d8 1pt; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
            html += '                                                        <font color="#000000">';
            html += '                                                            <span class="xdlabel" />';
            html += '                                                            <span class="xdlabel">Description:</span>&nbsp;<span style="color:red;font-size:medium;">*</span>';
            html += '                                                        </font>';
            html += '                                                    </td>';
            html += '                                                    <td style="BORDER-TOP: #d8d8d8 1pt; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px" class="xdTableOffsetCellComponent">';
            html += '                                                        <div>';
            html += '                                                            <input type="text" id="strProjectTitle" bwFieldname="ProjectTitle" onkeyup="$(\'.bwRequest\').bwRequest(\'editTextbox_OnKeyUp\', this);" style="WIDTH: 70%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" /> <!-- was 2.77em -->';
            html += '                                                        </div>';
            html += '                                                    </td>';
            html += '                                                </tr>';
            html += '                                                <tr class="xdTableOffsetRow">';
            html += '                                                    <td style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px" class="xdTableOffsetCellLabel">';
            html += '                                                        <span id="spanNewRequestDetailsLabel"><span class="xdlabel">Justification details:</span></span>';
            html += '                                                    </td>';
            html += '                                                    <td style="VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px" class="xdTableOffsetCellComponent">';
            html += '                                                        <div>';
            html += '                                                            <textarea id="strBriefDescriptionOfProject" bwFieldname="BriefDescriptionOfProject" onkeyup="$(\'.bwRequest\').bwRequest(\'editTextbox_OnKeyUp\', this);" rows="1" style="WIDTH: 97%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;"></textarea>';
            html += '                                                        </div>';
            html += '                                                    </td>';
            html += '                                                </tr>';
            html += '                                                <tr class="xdTableOffsetRow">';
            html += '                                                    <td style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px" class="xdTableOffsetCellLabel">';
            html += '                                                        <span class="xdlabel">';
            html += '                                                            <span class="xdlabel">';
            html += '                                                                <font color="#000000">Amount:</font>&nbsp;<span style="color:red;font-size:medium;">*</span>';
            html += '                                                            </span>';
            html += '                                                        </span>';
            html += '                                                    </td>';
            html += '                                                    <td style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px" class="xdTableOffsetCellComponent">';
            html += '                                                        <div>';
            html += '                                                            <input type="text" id="dblRequestedCapital" bwFieldname="RequestedCapital" bwDatatype="Currency" onkeyup="$(\'.bwRequest\').bwRequest(\'editTextbox_OnKeyUp\', this);" onblur="$(\'.bwRequest\').bwRequest(\'formatRequestedCapital_InitBudgetRequest\');" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: right;" />';
            html += '                                                        </div>';
            html += '                                                    </td>';
            html += '                                                </tr>';
            html += '                                                <tr class="xdTableOffsetRow">';
            html += '                                                    <td style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px" class="xdTableOffsetCellLabel">';
            html += '                                                        <span id="spanRequestForm_ManagerTitle" class="xdlabel">';
            html += '                                                            [spanRequestForm_ManagerTitle]';
            html += '                                                        </span>';
            html += '                                                        <span style="color:red;font-size:medium;">*</span>';
            html += '                                                    </td>';
            html += '                                                    <td style="white-space:nowrap;text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;" class="xdTableOffsetCellComponent">';
            html += '                                                        <input id="txtProjectManagerName" bwFieldname="ProjectManager.Person.FriendlyName" title="Type the first name. This is the person who does the initial approval." style="WIDTH: 85%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: left;" />';
            html += '                                                        <input id="txtProjectManagerId" bwFieldname="ProjectManager.Person.AccountId" style="display:none;" />';
            html += '                                                        <input id="txtProjectManagerEmail" bwFieldname="ProjectManager.Person.Email" style="display:none;" />';
            html += '                                                        <img src="images/addressbook-icon35x35.png" style="width:35px;height:35px;vertical-align:text-bottom;cursor:pointer;" onclick="$(\'.bwRequest\').bwRequest(\'displayPeoplePickerDialog\', \'txtProjectManagerName\', \'txtProjectManagerId\', \'txtProjectManagerEmail\');" />';
            html += '                                                    </td>';
            html += '                                                </tr>';
            html += '                                                <tr class="xdTableOffsetRow">';
            html += '                                                    <td style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px" class="xdTableOffsetCellLabel">';
            html += '                                                        <span class="xdlabel">';
            html += '                                                            <span class="xdlabel">Year:</span>';
            html += '                                                        </span>';
            html += '                                                    </td>';
            html += '                                                    <td style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px" class="xdTableOffsetCellComponent">';
            html += '                                                        <div>';
            html += '                                                            <select id="ddlYear" onchange="$(\'.bwRequest\').bwRequest(\'ddlYear_OnChange\', this);" bwFieldname="FiscalYear" tabindex="0" size="1" class="xdComboBox xdBehavior_Select" style="WIDTH: 50%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: right;"></select>';
            html += '                                                        </div>';
            html += '                                                    </td>';
            html += '                                                </tr>';
            html += '                                                <tr class="xdTableOffsetRow">';
            html += '                                                    <td style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px" class="xdTableOffsetCellLabel">';
            html += '                                                        <div>';
            html += '                                                            <span class="xdlabel">';
            //html += '                                                                <span class="xdlabel">Financial area:</span>';
            html += '                                                                <span class="xdlabel">Functional area:</span>';
            html += '                                                            </span>';
            html += '                                                        </div>';
            html += '                                                    </td>';
            html += '                                                    <td style="VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px" class="xdTableOffsetCellComponent">';
            html += '                                                        <div>';
            html += '                                                            <select id="ddlFunctionalArea" name="ddlFunctionalArea" onchange="$(\'.bwRequest\').bwRequest(\'ddlFunctionalArea_OnChange\', this);" bwFieldname="FunctionalAreaId" tabindex="0" value="" size="1" style="WIDTH: 97%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" class="xdComboBox xdBehavior_Select" title="" />';
            html += '                                                        </div>';
            html += '                                                    </td>';
            html += '                                                </tr>';

            html += '                                                <tr class="xdTableOffsetRow">';
            html += '                                                    <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px">';
            html += '                                                       <span class="xdlabel">Location:</span>';
            html += '                                                    </td>';
            html += '                                                    <td style="VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px" class="xdTableOffsetCellComponent">';
            html += '                                                        <div>';
            html += '                                                            <div id="divBwLocationPicker"></div>';
            html += '                                                        </div>';
            html += '                                                    </td>';
            html += '                                                </tr>';

            html += '                                                <tr class="xdTableOffsetRow">';
            html += '                                                    <td style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px" class="xdTableOffsetCellLabel">';
            html += '                                                        <span id="spanNewRequestStartDateLabel" style="white-space:nowrap;"><span class="xdlabel" style="white-space:nowrap;">Estimated Start Date:</span></span>';
            html += '                                                    </td>';
            html += '                                                    <td style="VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px" class="xdTableOffsetCellComponent">';
            html += '                                                        <input type="text" id="dtEstimatedStartDate" onchange="$(\'.bwRequest\').bwRequest(\'datePicker_OnChange\', this);" bwFieldname="EstimatedStartDate" bwDatatype="Date" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: left;" />';
            html += '                                                    </td>';
            html += '                                                </tr>';
            html += '                                                <tr class="xdTableOffsetRow">';
            html += '                                                    <td style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px" class="xdTableOffsetCellLabel">';
            html += '                                                        <span id="spanNewRequestEndDateLabel" style="white-space:nowrap;"><span class="xdlabel" style="white-space:nowrap;">Estimated End Datexx:</span></span>';
            html += '                                                    </td>';
            html += '                                                    <td style="VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px" class="xdTableOffsetCellComponent">';
            html += '                                                        <input type="text" id="dtEstimatedEndDate" onchange="$(\'.bwRequest\').bwRequest(\'datePicker_OnChange\', this);" bwFieldname="EstimatedEndDate" bwDatatype="Date" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: left;" />';
            html += '                                                    </td>';
            html += '                                                </tr>';


            //html += '<tr id="trNewRequestAttachmentsSection" class="xdTableOffsetRow">';
            //html += '<td class="xdTableOffsetCellLabel" valign="top" style="text-align:left; BORDER-BOTTOM: #d8d8d8 1pt; BORDER-LEFT: #d8d8d8 1pt; BACKGROUND-COLOR: #ffffff">';
            //html += '    <span class="xdlabel">Attachments:</span>';
            //html += '</td>';
            //html += '<td style="VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt; PADDING-BOTTOM: 14px; PADDING-TOP: 14px; PADDING-LEFT: 15px; PADDING-RIGHT: 22px" class="xdTableOffsetCellComponent">';
            //html += '<p id="newrequestattachments"></p>';
            //html += '</td>';
            //html += '</tr>';

            html += '                                           </tbody>';
            html += '                                       </table>';


            html += '                                   </div>';
            html += '                               </td>';








            //This is the middle section.
            html += '                               <td>xxxxx</td>';








            // This is the right hand section.
            html += '                               <td style="vertical-align:top;">';


            html += '<div id="tableRightBottomRequestFormSection" style="display:inline-block;vertical-align:top;">';
            // RED OUTLINE FOR TESTING
            //html += '<table id="tableRightBottomRequestFormSection" style="display:inline-block;border:1px solid red;width:665px;">';
            html += '<table id="tableRightBottomRequestFormSection" style="display:inline-block;border:1px solid aliceblue;width:465px;">';





            //html += '                                                <tr id="trNewRequestBarcodeAttachmentsSection" class="xdTableOffsetRow">';
            //html += '                                                    <td class="xdTableOffsetCellLabel" valign="top" style="text-align:left; BORDER-BOTTOM: #d8d8d8 1pt; BORDER-LEFT: #d8d8d8 1pt; BACKGROUND-COLOR: #ffffff">';
            //html += '                                                        <span class="xdlabel">Barcodes:</span>';
            //html += '                                                    </td>';
            //html += '                                                    <td style="VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px" class="xdTableOffsetCellComponent">';
            //html += '                                                        <div>';
            //html += '                                                            <div xd:widgetindex="0" tabindex="-1" xd:xctname="RepeatingSection" xd:ctrlid="CTRL90" align="left" style="MARGIN-BOTTOM: 0; WIDTH: 100%" class="xdRepeatingSection xdRepeating" title="">';
            //html += '                                                                <div>';
            //html += '                                                                    <input id="inputFileBarcode" type="file" onchange="uploadBarcodeAttachment(\'barcodeattachments\');" style="width:75%;" />';
            //html += '                                                                </div>';
            //html += '                                                            </div>';
            //html += '                                                            <p id="barcodeattachments"></p>';
            //html += '                                                            <img id="barcodeImage1" style="visibility:hidden;display:none;" />';
            //html += '                                                        </div>';
            //html += '                                                    </td>';
            //html += '                                                </tr>';

            html += '                                                <tr>';
            html += '                                                    <td colspan="2">';
            html += '                                                        <span id="BudgetRequestId" style="visibility:hidden;display:none;"></span>';
            html += '                                                        <span id="RecurringExpenseId" style="visibility:hidden;display:none;"></span>';
            html += '                                                        <span id="OfflineRequestBudgetRequestId" style="visibility:hidden;display:none;"></span>';
            html += '                                                        <span id="OfflineRequestRecurringExpenseId" style="visibility:hidden;display:none;"></span>';
            html += '                                                    </td>';
            html += '                                                </tr>';

            html += '                                                <tr class="xdTableOffsetRow">';
            html += '                                                    <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px">';
            html += '                                                        <div>';
            html += '                                                           <span class="xdlabel"></span>';
            html += '                                                           <span class="xdlabel">Necessity of Proposed Expenditure:</span>';
            html += '                                                        </div>';
            html += '                                                    </td>';
            html += '                                                    <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
            html += '                                                        <div>';
            html += '                                                           <span title="" class="xdTextBox" contentEditable="false" hideFocus="1" xd:binding="my:NecessityOfProposedExpenditure" xd:xctname="PlainText" xd:CtrlId="CTRL169" xd:datafmt="&quot;string&quot;,&quot;plainMultiline&quot;" tabIndex="0" style="WORD-WRAP: break-word; HEIGHT: 45px; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%;">';
            html += '                                                           </span>';
            html += '                                                       </div>';
            html += '                                                   </td>';
            html += '                                               </tr>';

            html += '                                               <tr>';
            html += '                                                   <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            html += '                                                       <span class="xdlabel">The life expectancy of this project (months):</span>';
            html += '                                                   </td>';
            html += '                                                   <td style="text-align:left; BORDER-TOP: #d8d8d8 1pt solid; BORDER-BOTTOM: #d8d8d8 1pt solid; BACKGROUND-COLOR: #f2f2f2">';
            html += '                                                       <div>';
            html += '                                                           <input xd:binding="my:LifeExpectancyOfProjectInMonths" value="{my:LifeExpectancyOfProjectInMonths}" class="xdTextBox" style="width: 235px; text-align: right;" contenteditable="false" type="number" min="0.01" step="0.01"  />';
            html += '                                                       </div>';
            html += '                                                   </td>';
            html += '                                               </tr>';

            html += '                                               <tr class="xdTableOffsetRow">';
            html += '                                                   <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px">';
            html += '                                                       <div>';
            html += '                                                           <span class="xdlabel"></span>';
            html += '                                                           <span class="xdlabel">Does this require additional resources?</span>';
            html += '                                                       </div>';
            html += '                                                   </td>';
            html += '                                                   <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 4px; PADDING-RIGHT: 4px">';
            html += '                                                       <label for="cbDoesThisRequireItResources"></label><input type="checkbox" name="cbDoesThisRequireItResources" id="cbDoesThisRequireItResources" />';
            html += '                                                   </td>';
            html += '                                               </tr>';

            html += '                                               <tr class="xdTableOffsetRow">';
            html += '                                                   <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px">';
            html += '                                                       <div>';
            html += '                                                           <span class="xdlabel"></span>';
            html += '                                                           <span class="xdlabel">Are there any asset dispositions?</span>';
            html += '                                                       </div>';
            html += '                                                   </td>';
            html += '                                                   <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 4px; PADDING-RIGHT: 4px">';
            html += '                                                       <label for="cbAreThereAssetDispositions"></label><input type="checkbox" name="cbAreThereAssetDispositions" id="cbAreThereAssetDispositions" />';
            html += '                                                   </td>';
            html += '                                               </tr>';



            html += '                                               <tr>';
            html += '                                                   <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            html += '                                                       <span class="xdlabel">These costs are estimated:</span>';
            html += '                                                   </td>';
            html += '                                                   <td style="text-align:left; BORDER-TOP: #d8d8d8 1pt solid; BORDER-BOTTOM: #d8d8d8 1pt solid; BACKGROUND-COLOR: #f2f2f2;PADDING-TOP: 4px; PADDING-LEFT: 4px;">';
            html += '                                                       <table style="width:100%;">';
            html += '                                                           <tr>';
            html += '                                                               <td>';
            html += '                                                                   <label for="cbLifeExpectancyCostsAreEstimated"></label><input type="checkbox" name="cbLifeExpectancyCostsAreEstimated" id="cbLifeExpectancyCostsAreEstimated" />';
            html += '                                                               </td>';
            html += '                                                           </tr>';
            html += '                                                           <tr>';
            html += '                                                               <td style="height:30px;"></td>';
            html += '                                                           </tr>';
            html += '                                                           <tr>';
            html += '                                                               <td>';
            html += '                                                                   <span style="white-space:nowrap;">Explanation:</span>';
            html += '                                                               </td>';
            html += '                                                           </tr>';
            html += '                                                           <tr>';
            html += '                                                               <td>';
            html += '                                                                   <span title="" class="xdTextBox" hideFocus="1" contentEditable="false" xd:binding="my:group15/my:EstimatedCostsExplanation" xd:xctname="PlainText" xd:CtrlId="CTRL10" xd:datafmt="&quot;string&quot;,&quot;plainMultiline&quot;" tabIndex="0" style="WORD-WRAP: break-word; HEIGHT: 45px; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 98%; BACKGROUND-COLOR: #ffffff">';
            html += '                                                                   </span>';
            html += '                                                               </td>';
            html += '                                                           </tr>';
            html += '                                                       </table>';
            html += '                                                   </td>';
            html += '                                               </tr>';

            html += '                                               <div/>';
            html += '                                               <div/>';
            html += '                                               <div>';
            html += '                                               <tr style="MIN-HEIGHT: 54px">';
            html += '                                                   <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            html += '                                                       <span class="xdlabel">Savings Notes:</span>';
            html += '                                                   </td>';
            html += '                                                   <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
            html += '                                                       <div>';
            html += '                                                           <span title="" class="xdTextBox" contentEditable="false" hideFocus="1" xd:binding="my:SavingsNotes" xd:xctname="PlainText" xd:CtrlId="CTRL169" xd:datafmt="&quot;string&quot;,&quot;plainMultiline&quot;" tabIndex="0" style="WORD-WRAP: break-word; HEIGHT: 45px; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%;">';
            html += '                                                           </span>';
            html += '                                                       </div>';
            html += '                                                   </td>';
            html += '                                               </tr>';
            html += '</table>';

            html += '</div>';














            html += '                               </td>';

            html += '                           </tr>';






            html += '                       <table>';
            html += '<tr id="trNewRequestAttachmentsSection" class="xdTableOffsetRow">';
            //html += '<td class="xdTableOffsetCellLabel" valign="top" style="text-align:left; BORDER-BOTTOM: #d8d8d8 1pt; BORDER-LEFT: #d8d8d8 1pt; BACKGROUND-COLOR: #ffffff">';
            //html += '    <span class="xdlabel">Attachments:</span>';
            //html += '</td>';
            html += '<td style="VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt; PADDING-BOTTOM: 14px; PADDING-TOP: 14px; PADDING-LEFT: 15px; PADDING-RIGHT: 22px" class="xdTableOffsetCellComponent">';
            html += '<div id="newrequestattachments"></div>';
            html += '</td>';
            html += '</tr>';
            html += '                       </table>';







            // This is our data grid section.
            html += '                       <table>';
            html += '                           <tr>';
            html += '                               <td colspan="3">';


            html += '                                                <tr id="trSpendForecast" class="xdTableOffsetRow">';
            html += '                                                  <td colspan="2">';
            html += '                                                    <span id="spanSpendForecast">';

            html += '<table class="xdFormLayout xdTableStyleTwoCol" style="BORDER-TOP-STYLE: none; WORD-WRAP: break-word; BORDER-LEFT-STYLE: none; BORDER-COLLAPSE: collapse; TABLE-LAYOUT: fixed; BORDER-BOTTOM-STYLE: none; BORDER-RIGHT-STYLE: none;width:100%;">';
            html += '   <colgroup>';
            html += '       <col style="WIDTH: 169px" />';
            html += '       <col style="" />';
            html += '   </colgroup>';
            html += '<tbody valign="top">';
            html += '   <tr style="MIN-HEIGHT: 54px">';
            html += '       <td colspan="2" class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            html += '           <div>';
            html += '           Spending Plan';
            html += '           </div>';
            html += '       </td>';
            html += '   </tr>';

            html += '   <tr class="xdTableOffsetRow">';
            html += '       <td colspan="2">';
            html += '           <div id="jsGridSpendForecast" style="overflow-x:scroll;"></div>';

            html += 'Start and end dates need to be selected before you can add spend forecast information.';

            html += '       </td>';
            html += '   </tr>';


            html += '<tr>';
            html += '  <td style="width:50%;">';
            // left column
            html += '    <table>';
            html += '   <tr class="xdTableOffsetRow">';
            html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            html += '           <span class="xdlabel">Projected Capital Spending:</span>';
            html += '       </td>';
            html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
            html += '           <div>';
            html += '               <input id="projectedCapitalSpending" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: right;" onblur="$(\'.bwRequest\').bwRequest(\'formatRequestedCapital_InitBudgetRequest\');" type="text">';
            html += '           </div>';
            html += '       </td>';
            html += '   </tr>';
            html += '   <tr class="xdTableOffsetRow">';
            html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            html += '           <span class="xdlabel">Amount Forecast:</span>';
            html += '       </td>';
            html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
            html += '           <div>';
            html += '               <input id="amountForecast" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: right;" onblur="$(\'.bwRequest\').bwRequest(\'formatRequestedCapital_InitBudgetRequest\');" type="text">';
            html += '           </div>';
            html += '       </td>';
            html += '   </tr>';
            html += '    </table>';
            html += '  </td>';
            html += '  <td style="width:50%;">';
            // right column
            html += '    <table>';
            html += '   <tr class="xdTableOffsetRow">';
            html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            html += '           <span class="xdlabel">Amount left to forecast:</span>';
            html += '       </td>';
            html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
            html += '           <div>';
            html += '               <input id="amountLeftToForecast" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: right;" onblur="$(\'.bwRequest\').bwRequest(\'formatRequestedCapital_InitBudgetRequest\');" type="text">';
            html += '           </div>';
            html += '       </td>';
            html += '   </tr>';
            html += '   <tr class="xdTableOffsetRow">';
            html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            html += '           <span class="xdlabel">Capitalized Interest Rate (%):</span>';
            html += '       </td>';
            html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
            html += '           <div>';
            html += '               <input id="interestRate" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: right;" onblur="$(\'.bwRequest\').bwRequest(\'formatRequestedCapital_InitBudgetRequest\');" type="text">';
            html += '           </div>';
            html += '       </td>';
            html += '   </tr>';

            html += '    </table>';
            html += '  </td>';
            html += '</tr>';



            //html += '   <tr class="xdTableOffsetRow">';
            //html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            //html += '           <span class="xdlabel">Projected Capital Spending:</span>';
            //html += '       </td>';
            //html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
            //html += '           <div>';
            //html += '               <input id="projectedCapitalSpending" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: right;" onblur="$(\'.bwRequest\').bwRequest(\'formatRequestedCapital_InitBudgetRequest\');" type="text">';
            //html += '           </div>';
            //html += '       </td>';
            //html += '   </tr>';
            //html += '   <tr class="xdTableOffsetRow">';
            //html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            //html += '           <span class="xdlabel">Amount Forecast:</span>';
            //html += '       </td>';
            //html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
            //html += '           <div>';
            //html += '               <input id="amountForecast" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: right;" onblur="$(\'.bwRequest\').bwRequest(\'formatRequestedCapital_InitBudgetRequest\');" type="text">';
            //html += '           </div>';
            //html += '       </td>';
            //html += '   </tr>';




            //html += '   <tr class="xdTableOffsetRow">';
            //html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            //html += '           <span class="xdlabel">Amount left to forecast:</span>';
            //html += '       </td>';
            //html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
            //html += '           <div>';
            //html += '               <input id="amountLeftToForecast" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: right;" onblur="$(\'.bwRequest\').bwRequest(\'formatRequestedCapital_InitBudgetRequest\');" type="text">';
            //html += '           </div>';
            //html += '       </td>';
            //html += '   </tr>';
            //html += '   <tr class="xdTableOffsetRow">';
            //html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            //html += '           <span class="xdlabel">Capitalized Interest Rate (%):</span>';
            //html += '       </td>';
            //html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
            //html += '           <div>';
            //html += '               <input id="interestRate" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: right;" onblur="$(\'.bwRequest\').bwRequest(\'formatRequestedCapital_InitBudgetRequest\');" type="text">';
            //html += '           </div>';
            //html += '       </td>';
            //html += '   </tr>';




            html += '</tbody>';
            html += '</table>';

            html += '</span>'; // This doesn't show up until the user selects a start and end date.
            html += '                                                  </td>';
            html += '                                                </tr>';


            html += '                                               <tr style="MIN-HEIGHT: 54px">';
            html += '                                                   <td colspan="2" class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            html += '                                                       <div>';
            html += '                                                           Costs';
            html += '                                                       </div>';
            html += '                                                   </td>';
            html += '                                               </tr>';
            html += '                                                <tr class="xdTableOffsetRow">';
            html += '                                                  <td colspan="2">';
            html += '                                                    <div id="jsGridCosts" style="font-size:60%;overflow-x:scroll;"></div>';
            html += '                                                  </td>';
            html += '                                                </tr>';

            html += '                                               <tr style="MIN-HEIGHT: 54px">';
            html += '                                                   <td colspan="2" class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            html += '                                                       <div>';
            html += '                                                           Payback items';
            html += '                                                       </div>';
            html += '                                                   </td>';
            html += '                                               </tr>';
            html += '                                               <tr class="xdTableOffsetRow">';
            html += '                                                 <td colspan="2">';
            html += '                                                   <div id="jsGridPayback" style="font-size:60%;overflow-x:scroll;"></div>';
            html += '                                                 </td>';
            html += '                                               </tr>';


            html += '<tr>';
            html += '<td >';

            html == '<table>';
            html += '                                               <tr style="MIN-HEIGHT: 54px">';
            html += '                                                   <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            html += '                                                       <span class="xdlabel">NPV:</span>';
            html += '                                                   </td>';
            html += '                                                   <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
            html += '                                                       <div>';
            html += '                                                           <input id="dblNpv" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: right;" onblur="$(\'.bwRequest\').bwRequest(\'formatRequestedCapital_InitBudgetRequest\');" type="text">';
            html += '                                                       </div>';
            html += '                                                   </td>';
            html += '                                               </tr>';
            html == '</table>';

            html += '</td>';
            html += '<td >';

            html == '<table>';
            html += '                                               <tr style="MIN-HEIGHT: 54px">';
            html += '                                                   <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            html += '                                                       <span class="xdlabel">IRR:</span>';
            html += '                                                   </td>';
            html += '                                                   <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
            html += '                                                       <div>';
            html += '                                                           <input id="dblIrr" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: right;" onblur="$(\'.bwRequest\').bwRequest(\'formatRequestedCapital_InitBudgetRequest\');" type="text">';
            html += '                                                       </div>';
            html += '                                                   </td>';
            html += '                                               </tr>';
            html == '</table>';

            html += '</td>';
            html += '</tr>';


            //html += '                                               <tr style="MIN-HEIGHT: 54px">';
            //html += '                                                   <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            //html += '                                                       <span class="xdlabel">NPV:</span>';
            //html += '                                                   </td>';
            //html += '                                                   <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
            //html += '                                                       <div>';
            //html += '                                                           <input id="dblNpv" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: right;" onblur="$(\'.bwRequest\').bwRequest(\'formatRequestedCapital_InitBudgetRequest\');" type="text">';
            //html += '                                                       </div>';
            //html += '                                                   </td>';
            //html += '                                               </tr>';


            //html += '                                               <tr style="MIN-HEIGHT: 54px">';
            //html += '                                                   <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            //html += '                                                       <span class="xdlabel">IRR:</span>';
            //html += '                                                   </td>';
            //html += '                                                   <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
            //html += '                                                       <div>';
            //html += '                                                           <input id="dblIrr" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: right;" onblur="$(\'.bwRequest\').bwRequest(\'formatRequestedCapital_InitBudgetRequest\');" type="text">';
            //html += '                                                       </div>';
            //html += '                                                   </td>';
            //html += '                                               </tr>';





            html += '                                               <tr style="MIN-HEIGHT: 54px">';
            html += '                                                   <td colspan="2" class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            html += '                                                       <div>';
            html += '                                                           Ongoing costs';
            html += '                                                       </div>';
            html += '                                                   </td>';
            html += '                                               </tr>';
            html += '                                                <tr class="xdTableOffsetRow">';
            html += '                                                  <td colspan="2">';
            html += '                                                    <div id="jsGridOngoingCosts" style="font-size:60%;overflow-x:scroll;"></div>';
            html += '                                                  </td>';
            html += '                                                </tr>';

            html += '                               </td>';
            html += '                           </tr>';
            html += '                       </table>';





















            //html += '                       </tbody>';
            //html += '                   </table>';
            //html += '               </div>';
            html += '           </td>';
            html += '       </tr>';
            html += '   </tbody>';
            html += '</table>';
            html += '</div>';












            html += '<br />';
            html += '<br />';
            html += '<hr style="border:0 none; border-bottom: 1px solid lightgray;" />';
            html += '       <span style="font-size:8pt;white-space:nowrap;">Report date: ' + reportDate + '</span>';


            // Put in the DOM so we can print..
            //document.body.innerHTML = html;
            debugger;
            var iframe = document.getElementById("printf");
            if (!iframe) { // for some reason this gets added twice to the DOM. FIgure this out someday, but for now this seems to fix it.
                iframe = document.createElement('iframe');
                iframe.id = 'printf';
                iframe.name = 'printf';
                iframe.width = '1px';
                iframe.height = '1px';
                document.body.appendChild(iframe); // to place at end of document
            }
            var iframeDocument = iframe.contentDocument;
            iframeDocument.body.innerHTML = html;








            // Populate the data.
            var json = this.options.store;
            if (json) {
                //debugger;
                //document.getElementById('spanRequestForm_Title').innerHTML = json.Title + ': ' + json.ProjectTitle; // json.BriefDescriptionOfProject	// json.Title // json.BudgetRequestId

                //this.populateAttachments(this.options.bwWorkflowAppId, json.BudgetRequestId, 'newrequestattachments', true);




                var iFrameDOM = $('#printf').contents();
                iFrameDOM.find('#spanRequestForm_Title').innerHTML = json.Title + 'x:x ' + json.ProjectTitle;


                //iFrameDOM.find('#newrequestattachments').attr('src', imagePath2);

                //this.populateAttachments(this.options.bwWorkflowAppId, json.BudgetRequestId, 'newrequestattachments', true);



            }





            var printNow = function () {
                setTimeout(function () { // Only needs to happen for Chrome.
                    try {
                        //
                        // We have to do this for Chrome! Not for firefox or Edge. The extra time allows the dom to load images.
                        //
                        //debugger;
                        //window.print(); // In Safari on MacBook, and Safari & Chrome on iOS, this is a synchronous call!!! (unlike most other situations where it is asynchronous).
                        //window.frames["printf"].print();
                        try {
                            console.log('bwDonate.PrintMyPendingTasksReport(): Try #1.');
                            window.frames["printf"].contentWindow.print(); // Confirmed 5-14-2020. Works in Edge.
                        } catch (e) {
                            try {
                                console.log('bwDonate.PrintMyPendingTasksReport(): Try #2.');
                                window.frames["printf"].print(); // Confirmed 5-14-2020. Works in Chrome. The print dialog gets invoked for Firefox, but only a blank page gets printed.
                            } catch (e) {
                                console.log('bwDonate.PrintMyPendingTasksReport(): Try #3.');
                                window.print(); // In Safari on MacBook, and Safari & Chrome on iOS, this is a synchronous call!!! (unlike most other situations where it is asynchronous).
                            }

                        }
                        //window.frames["printf"].contentWindow.print();
                        //console.log('window.print() has just been executed. In Safari on MacBook, and Safari & Chrome on iOS, this is a synchronous call.');

                        var frame = document.getElementById("printf");
                        frame.parentNode.removeChild(frame);

                        // Put back the original contents into the dom, and re-display the form dialog.
                        //document.body.innerHTML = originalFormBeforePrinting;
                        //// Render the Print button.
                        //var printButtonOptions = {
                        //    reportType: 'MyPendingTasksReport'
                        //};
                        //var $printbutton = $('#spanArchivePagePrintButton').bwDonate(printButtonOptions);










                        ////
                        //// We have to do this for Chrome! Not for firefox or Edge. The extra time allows the dom to load images.
                        ////
                        ////debugger;
                        ////window.print(); // In Safari on MacBook, and Safari & Chrome on iOS, this is a synchronous call!!! (unlike most other situations where it is asynchronous).
                        ////window.frames["printf"].focus();
                        //debugger;
                        //var element = window.frames["printf"].contentWindow;
                        //element.print();
                        ////window.frames["printf"].print();
                        //console.log('window.print() has just been executed. In Safari on MacBook, and Safari & Chrome on iOS, this is a synchronous call.');

                        //var frame = document.getElementById("printf");
                        //frame.parentNode.removeChild(frame);

                        //// Put back the original contents into the dom, and re-display the form dialog.
                        ////document.body.innerHTML = originalFormBeforePrinting;
                        //// Render the Print button.
                        ////var printButtonOptions = {
                        ////    reportType: 'MyPendingTasksReport'
                        ////};
                        ////var $printbutton = $('#spanArchivePagePrintButton').bwDonate(printButtonOptions);

                    } catch (e) {
                        console.log('Exception in PrintIndividualRequestReport(): ' + e.message + ', ' + e.stack);
                    }
                }, 250);
            }



            //html += '<img id="imgRequestOrgImage" src="' + thiz.options.operationUriPrefix + 'images/corporeal.png" style="width:200px;height:200px;"/>';
            //
            // Try to get a custom image. If none found, use the OOB one.
            //
            //html += '<img src="' + thiz.options.operationUriPrefix + 'images/corporeal.png" style="width:200px;height:200px;"/>'; // This is the original code. Remove at some point.
            //var imagePath2 = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/orgimages/' + brData.BudgetRequests[0].OrgId + '/' + 'orgimage.png'; // thiz.options.store.OrgId
            var imagePath2 = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/orgimages/' + orgId + '/' + 'orgimage.png'; // thiz.options.store.OrgId
            $.get(imagePath2).done(function () {
                setTimeout(function () { // Only needs to happen for Chrome.
                    //var img = document.getElementById('imgRequestOrgImage');
                    //img.attr.src = imagePath2;
                    //$('#imgRequestOrgImage').attr('src', imagePath2);

                    var iFrameDOM = $('#printf').contents();

                    iFrameDOM.find('#imgRequestOrgImage').attr('src', imagePath2);

                    printNow();
                }, 500);
            }).fail(function () {
                //alert("This org has no image."); // do nothing 
            });
            // End: Getting the custom image
            //




            // Do the printing.
            window.onafterprint = function (e) {
                try {
                    console.log('Print Dialog Closed.');

                    var frame = document.getElementById("printf");
                    frame.parentNode.removeChild(frame);

                    //// Put back the original contents into the dom, and re-display the form dialog. This only needs to happen 
                    //document.body.innerHTML = originalFormBeforePrinting;
                    //// Render the Print button.
                    //var printButtonOptions = {
                    //    reportType: 'IndividualRequestReport'
                    //};
                    //var $printbutton = $('#spanRequestPrintButton').bwDonate(printButtonOptions);




                    //$("#divOfflineRequestFormDialog").dialog('open');
                    //alert('done printing');
                } catch (e) {
                    console.log('Exception in window.onafterprint: ' + e.message);
                }
            };



            //setTimeout(function () { // Only needs to happen for Chrome.
            //    //
            //    // We have to do this for Chrome! Not for firefox or Edge. The extra time allows the dom to load images.
            //    //
            //    window.print(); // In Safari on MacBook, and Safari & Chrome on iOS, this is a synchronous call!!! (unlike most other situations where it is asynchronous).
            //    console.log('window.print() has just been executed. In Safari on MacBook, and Safari & Chrome on iOS, this is a synchronous call.');

            //    // Put back the original contents into the dom, and re-display the form dialog.
            //    document.body.innerHTML = originalFormBeforePrinting;
            //    // Render the Print button.
            //    var printButtonOptions = {
            //        reportType: 'IndividualRequestReport'
            //    };
            //    var $printbutton = $('#spanRequestPrintButton').bwDonate(printButtonOptions);


            //}, 250);


            //window.print(); // In Safari on MacBook, and Safari & Chrome on iOS, this is a synchronous call!!! (unlike most other situations where it is asynchronous).
            //console.log('window.print() has just been executed. In Safari on MacBook, and Safari & Chrome on iOS, this is a synchronous call.');



            //    },
            //    error: function (data, errorCode, errorMessage) {
            //        displayAlertDialog('Exception in PrintIndividualRequestReport():' + errorCode + ', ' + errorMessage);
            //    }
            //});

            //
            // KEEP THE FOLLOWING CODE BECAUSE THERE ARE GEMS WITHIN!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            //
            //
            // Now lets generate the new one (the printable version)...
            //var promise = displayForm_DisplayCachedArWithPrintableHtml(bwBudgetRequestId);
            //promise.then(function (result) {
            //    //printOutput("Result: " + result);
            //    console.log('Declaring attachment to the window.onafterprint event. This doesn\'t seem to work on MacBook Safari, or iOS (Safari and Chrome).');
            //    window.onafterprint = function (e) {
            //        try {
            //            console.log('Print Dialog Closed.');
            //            // Put back the original contents into the dom, and re-display the form dialog.
            //            document.getElementById('divDocumentBody').innerHTML = originalFormBeforePrinting;
            //            $("#divOfflineRequestFormDialog").dialog('open');
            //        } catch (e) {
            //            console.log('Exception in window.onafterprint: ' + e.message);
            //        }
            //    };
            //    console.log('navigator.userAgent: ' + navigator.userAgent);
            //    console.log('window.matchMedia: ' + window.matchMedia);
            //    //if ((navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) && !navigator.userAgent.match(/CriOS/i)) {
            //    //    // DOESNT WORK YET! THESE MAY HAVE ASYNC window.print call but no onafterprint event???
            //    //    if (window.matchMedia) {
            //    //        var printQuery = window.matchMedia('print');
            //    //        printQuery.addListener(function () {
            //    //            var screenQuery = window.matchMedia('screen');
            //    //            screenQuery.addListener(function () {
            //    //                //actions after print dialog close here
            //    //                console.log('Print Dialog Closed2. Safari on iOS?');
            //    //                displayAlertDialog('Print Dialog Closed2. Safari on iOS?');
            //    //                // Put back the original contents into the dom, and re-display the form dialog.
            //    //                document.getElementById('divDocumentBody').innerHTML = originalFormBeforePrinting;
            //    //                $("#divOfflineRequestFormDialog").dialog('open');
            //    //            });
            //    //        });
            //    //    }
            //    //} else if ((navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) && navigator.userAgent.match(/CriOS/i)) {
            //    //if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
            //    //    var beforePrint = function () {
            //    //        console.log('Functionality to run before printing.');
            //    //    };
            //    //    var afterPrint = function () {
            //    //        console.log('Functionality to run after printing');
            //    //        // Put back the original contents into the dom, and re-display the form dialog.
            //    //        document.getElementById('divDocumentBody').innerHTML = originalFormBeforePrinting;
            //    //        $("#divOfflineRequestFormDialog").dialog('open');
            //    //    };
            //    //    if (window.matchMedia) {
            //    //        var mediaQueryList = window.matchMedia('print');
            //    //        mediaQueryList.addListener(function (mql) {
            //    //            if (mql.matches) {
            //    //                beforePrint();
            //    //            } else {
            //    //                afterPrint();
            //    //            }
            //    //        });
            //    //    }
            //    //    window.onbeforeprint = beforePrint;
            //    //    window.onafterprint = afterPrint;
            //    //} else if (navigator.userAgent.match(/Macintosh/i) && navigator.userAgent.match(/Safari/i)) {
            //        console.log('Print Dialog Closed4. Safari on Macintosh?');
            //        // Put back the original contents into the dom, and re-display the form dialog.
            //        document.getElementById('divDocumentBody').innerHTML = originalFormBeforePrinting;
            //        //$("#divOfflineRequestFormDialog").dialog('open');
            //    //}
            //    window.print(); // In Safari on MacBook, and Safari & Chrome on iOS, this is a synchronous call!!! (unlike most other situations where it is asynchronous).
            //    console.log('window.print() has just been executed. In Safari on MacBook, and Safari & Chrome on iOS, this is a synchronous call.');
            //});
            //
            // End: KEEP THE FOLLOWING CODE BECAUSE THERE ARE GEMS WITHIN!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            //


        } catch (e) {
            console.log('Error in PrintIndividualRequestReport(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in PrintIndividualRequestReport(): ' + e.message + ', ' + e.stack);
        }

        // See the following for custom css to use the media = print attribute. We are not using any aspects of this approach yet.
        // https://www.arclab.com/en/kb/htmlcss/how-to-print-a-specific-part-of-a-html-page-css-media-screen-print.html

    },


    expandHomePageNotificationAndRenderAlerts: function (notificationType, deferredIndex, functionalAreaRowId) {
        // notificationType = task, budget request, invitation

        try {
            console.log('In my.js.expandHomePageNotificationAndRenderAlerts(' + notificationType + ', ' + deferredIndex + ', ' + functionalAreaRowId + ').');
            debugger;
            //displayAlertDialog('type:' + notifications);
            ////displayAlertDialog('text:' + notifications);
            //displayAlertDialog('notifications[2].length:' + notifications.length);

            //displayAlertDialog('length:' + notifications[0][2].length);

            //var appWebUrl = BWMData[0][deferredIndex][1];
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
                    //notifications[0][2][i][15] = taskData[i].bwAssignedToRaciRoleAbbreviation;
                    //notifications[0][2][i][16] = taskData[i].bwAssignedToRaciRoleName;
                    var bwAssignedToRaciRoleAbbreviation = notifications[ntypeindex][2][pi][15];
                    var bwAssignedToRaciRoleName = notifications[ntypeindex][2][pi][16];

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
                        topHtml += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;" colspan="5"><div style="display:inline-block;"><a style="cursor:pointer;" onclick="displayRecurringExpenseOnTheHomePage(\'' + budgetRequestId + '\', \'' + participantId + '\', \'' + title + '\');" target="_blank" title="Click to view the recurring expense...">' + daysSinceTaskCreated.toString() + ' days overdue: Recurring expense <em>(' + brTitle + ' - ' + functionalAreaName + ') is due to be submitted</em></a></div></td>';
                    } else if (taskType == 'BUDGET_REQUEST_WORKFLOW_TASK') {
                        //topHtml += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;" colspan="5"><div style="display:inline-block;"><a style="cursor:pointer;" onclick="displayArInDialog(\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');" target="_blank" title="Click to view the request ' + title + '.">' + daysSinceTaskCreated.toString() + ' xdays overdue: <em>' + title + ' - ' + brTitle + ' - ' + formatCurrency(currentAmount) + ' - ' + functionalAreaName + '</em></a></div></td>';
                        //topHtml += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="5" onclick="displayArInDialog(\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');" target="_blank" title="Click to view the request ' + title + '."><div style="display:inline-block;"><a style="cursor:pointer;" onclick="displayArInDialog(\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');" target="_blank" title="Click to view the request ' + title + '.">' + daysSinceTaskCreated.toString() + ' xdays overdue: <em>' + title + ' - ' + brTitle + ' - ' + formatCurrency(currentAmount) + ' - ' + functionalAreaName + '</em></a></div></td>';


                        //debugger;
                        //topHtml += '<td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'#d8d8d8\';" colspan="5" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');" target="_blank" title="xClick to view the request ' + title + '.">';
                        topHtml += '<td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" onmouseover="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + title + '\', \'' + brTitle + '\', \'' + 'BriefDescriptionOfProject' + '\', \'' + workflowAppId + '\', \'' + budgetRequestId + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');this.style.backgroundColor=\'#d8d8d8\';" colspan="5" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');" >';


                        //// NEW HOVER FUNCTIONALITY! 1-17-2020
                        //if (alternatingRow == 'light') {
                        //    html += '  <tr class="alternatingRowLight" style="cursor:pointer;" onmouseover="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + budgetRequests[i].Title + '\', \'' + budgetRequests[i].ProjectTitle + '\', \'' + JSON.parse(budgetRequests[i].bwRequestJson).BriefDescriptionOfProject + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\');" onmouseout="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');" >'; // Display BriefDescriptionOfProject as a tool tip.
                        //    alternatingRow = 'dark';
                        //} else {
                        //    html += '  <tr class="alternatingRowDark" style="cursor:pointer;" onmouseover="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + budgetRequests[i].Title + '\', \'' + budgetRequests[i].ProjectTitle + '\', \'' + JSON.parse(budgetRequests[i].bwRequestJson).BriefDescriptionOfProject + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\');" onmouseout="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');" >';
                        //    alternatingRow = 'light';
                        //}









                        topHtml += '<div style="display:inline-block;">';
                        topHtml += daysSinceTaskCreated.toString() + ' days overdue: <em>' + title + ' - ' + brTitle + ' - ' + formatCurrency(currentAmount) + ' - ' + functionalAreaName + ' ' + '[(' + bwAssignedToRaciRoleAbbreviation + ') ' + bwAssignedToRaciRoleName + ']' + '</em>';
                        topHtml += '</div>';
                        topHtml += '</td>';


                        //onMouseOver="this.style.backgroundColor=lightgoldenrodyellow" >> //lightblue
                        //onMouseOut="this.style.color='#00F'"
                        // style="cursor:pointer;" onclick="displayArInDialog(\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');" target="_blank" title="Click to view the request ' + title + '."




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
                        topHtml += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="5" onmouseover="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + title + '\', \'' + brTitle + '\', \'' + 'BriefDescriptionOfProject' + '\', \'' + workflowAppId + '\', \'' + budgetRequestId + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');" target="_blank" title="y1Click to view the request ' + title + '.">' + title + ': <em>' + projectTitle + ' - ' + 'no budget assigned' + ' - ' + functionalAreaName + '</em></td>';

                    } else {

                        //debugger;
                        //topHtml += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="5" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');" target="_blank" title="y2Click to view the request ' + title + '.">' + title + ': <em>' + projectTitle + ' - ' + formatCurrency(currentAmount) + ' - ' + functionalAreaName + ' - waiting for ' + participantFriendlyName + '(' + participantEmailAddress + ')' + ' to complete their task.' + '</em></td>';
                        topHtml += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="5" onmouseover="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + title + '\', \'' + brTitle + '\', \'' + 'BriefDescriptionOfProject' + '\', \'' + workflowAppId + '\', \'' + budgetRequestId + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');" target="_blank" title="y2Click to view the request ' + title + '.">' + title + ': <em>' + projectTitle + ' - ' + formatCurrency(currentAmount) + ' - ' + functionalAreaName + ' - waiting for ' + participantFriendlyName + '(' + participantEmailAddress + ')' + ' to complete their task.' + '</em></td>';

                    }



                    //if (faTitle == '' || brProjectTitle == '') {
                    //    // If we get here this is not good. This means there is something wrong with the AR or perhaps it has to do with the status of the AR.
                    //    topHtml += '       <a style="cursor:pointer;" onclick="displayArInDialog(\'' + appWebUrl + '\', \'' + BWMData[0][workflowIndex][4][selectedFaIndex][8][selectedBrIndex][0] + '\', \'' + BWMData[0][workflowIndex][4][selectedFaIndex][8][selectedBrIndex][1] + '\', \'' + BWMData[0][workflowIndex][4][selectedFaIndex][8][selectedBrIndex][2] + '\');" target="_blank" title="Click to view the request..."><em>There is a problem with this AR. Click here to learn more</em></a>';
                    //} else {
                    //    topHtml += '       <a style="cursor:pointer;" onclick="displayArInDialog(\'' + appWebUrl + '\', \'' + BWMData[0][workflowIndex][4][selectedFaIndex][8][selectedBrIndex][0] + '\', \'' + BWMData[0][workflowIndex][4][selectedFaIndex][8][selectedBrIndex][1] + '\', \'' + BWMData[0][workflowIndex][4][selectedFaIndex][8][selectedBrIndex][2] + '\');" target="_blank" title="Click to view the request...">' + brProjectTitle + ' (<em>' + formatCurrency(brBudgetAmount) + '</em>) - <em>' + faTitle + '</em></a>'; // ' + brProjectTitle + ' <em>(' + formatCurrency(brBudgetAmount) + ')</em></a>';
                    //}

                    topHtml += '        </tr>';
                }
            } else {
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
            $('#' + topRow2Id)[0].innerHTML = topHtml;
            div2.style.visibility = 'visible';
            $('#' + topRow2Id).show();


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
    },

    expandHomePageNotificationAndRenderAlerts_Printed: function (notificationType, deferredIndex, functionalAreaRowId) {
        // notificationType = task, budget request, invitation

        try {
            console.log('In bwDonate.expandHomePageNotificationAndRenderAlerts_Printed(' + notificationType + ', ' + deferredIndex + ', ' + functionalAreaRowId + ').');
            //debugger;
            //displayAlertDialog('type:' + notifications);
            ////displayAlertDialog('text:' + notifications);
            //displayAlertDialog('notifications[2].length:' + notifications.length);

            //displayAlertDialog('length:' + notifications[0][2].length);

            //var appWebUrl = BWMData[0][deferredIndex][1];
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
                    //notifications[0][2][i][15] = taskData[i].bwAssignedToRaciRoleAbbreviation;
                    //notifications[0][2][i][16] = taskData[i].bwAssignedToRaciRoleName;
                    var bwAssignedToRaciRoleAbbreviation = notifications[ntypeindex][2][pi][15];
                    var bwAssignedToRaciRoleName = notifications[ntypeindex][2][pi][16];

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
                        topHtml += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;" colspan="5"><div style="display:inline-block;"><a style="cursor:pointer;" onclick="displayRecurringExpenseOnTheHomePage(\'' + budgetRequestId + '\', \'' + participantId + '\', \'' + title + '\');" target="_blank" title="Click to view the recurring expense...">' + daysSinceTaskCreated.toString() + ' days overdue: Recurring expense <em>(' + brTitle + ' - ' + functionalAreaName + ') is due to be submitted</em></a></div></td>';
                    } else if (taskType == 'BUDGET_REQUEST_WORKFLOW_TASK') {
                        //topHtml += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;" colspan="5"><div style="display:inline-block;"><a style="cursor:pointer;" onclick="displayArInDialog(\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');" target="_blank" title="Click to view the request ' + title + '.">' + daysSinceTaskCreated.toString() + ' xdays overdue: <em>' + title + ' - ' + brTitle + ' - ' + formatCurrency(currentAmount) + ' - ' + functionalAreaName + '</em></a></div></td>';
                        //topHtml += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="5" onclick="displayArInDialog(\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');" target="_blank" title="Click to view the request ' + title + '."><div style="display:inline-block;"><a style="cursor:pointer;" onclick="displayArInDialog(\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');" target="_blank" title="Click to view the request ' + title + '.">' + daysSinceTaskCreated.toString() + ' xdays overdue: <em>' + title + ' - ' + brTitle + ' - ' + formatCurrency(currentAmount) + ' - ' + functionalAreaName + '</em></a></div></td>';


                        //debugger;
                        //topHtml += '<td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'#d8d8d8\';" colspan="5" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');" target="_blank" title="xClick to view the request ' + title + '.">';
                        topHtml += '<td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" onmouseover="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + title + '\', \'' + brTitle + '\', \'' + 'BriefDescriptionOfProject' + '\', \'' + workflowAppId + '\', \'' + budgetRequestId + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');this.style.backgroundColor=\'#d8d8d8\';" colspan="5" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');" >';


                        //// NEW HOVER FUNCTIONALITY! 1-17-2020
                        //if (alternatingRow == 'light') {
                        //    html += '  <tr class="alternatingRowLight" style="cursor:pointer;" onmouseover="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + budgetRequests[i].Title + '\', \'' + budgetRequests[i].ProjectTitle + '\', \'' + JSON.parse(budgetRequests[i].bwRequestJson).BriefDescriptionOfProject + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\');" onmouseout="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');" >'; // Display BriefDescriptionOfProject as a tool tip.
                        //    alternatingRow = 'dark';
                        //} else {
                        //    html += '  <tr class="alternatingRowDark" style="cursor:pointer;" onmouseover="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + budgetRequests[i].Title + '\', \'' + budgetRequests[i].ProjectTitle + '\', \'' + JSON.parse(budgetRequests[i].bwRequestJson).BriefDescriptionOfProject + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\');" onmouseout="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');" >';
                        //    alternatingRow = 'light';
                        //}









                        topHtml += '<div style="display:inline-block;">';
                        topHtml += daysSinceTaskCreated.toString() + ' days overdue: <em>' + title + ' - ' + brTitle + ' - ' + formatCurrency(currentAmount) + ' - ' + functionalAreaName + ' ' + '[(' + bwAssignedToRaciRoleAbbreviation + ') ' + bwAssignedToRaciRoleName + ']' + '</em>';
                        topHtml += '</div>';
                        topHtml += '</td>';


                        //onMouseOver="this.style.backgroundColor=lightgoldenrodyellow" >> //lightblue
                        //onMouseOut="this.style.color='#00F'"
                        // style="cursor:pointer;" onclick="displayArInDialog(\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');" target="_blank" title="Click to view the request ' + title + '."




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
                        topHtml += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="5" onmouseover="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + title + '\', \'' + brTitle + '\', \'' + 'BriefDescriptionOfProject' + '\', \'' + workflowAppId + '\', \'' + budgetRequestId + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');" target="_blank" title="y1Click to view the request ' + title + '.">' + title + ': <em>' + projectTitle + ' - ' + 'no budget assigned' + ' - ' + functionalAreaName + '</em></td>';

                    } else {

                        //debugger;
                        //topHtml += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="5" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');" target="_blank" title="y2Click to view the request ' + title + '.">' + title + ': <em>' + projectTitle + ' - ' + formatCurrency(currentAmount) + ' - ' + functionalAreaName + ' - waiting for ' + participantFriendlyName + '(' + participantEmailAddress + ')' + ' to complete their task.' + '</em></td>';
                        topHtml += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="5" onmouseover="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + title + '\', \'' + brTitle + '\', \'' + 'BriefDescriptionOfProject' + '\', \'' + workflowAppId + '\', \'' + budgetRequestId + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');" target="_blank" title="y2Click to view the request ' + title + '.">' + title + ': <em>' + projectTitle + ' - ' + formatCurrency(currentAmount) + ' - ' + functionalAreaName + ' - waiting for ' + participantFriendlyName + '(' + participantEmailAddress + ')' + ' to complete their task.' + '</em></td>';

                    }



                    //if (faTitle == '' || brProjectTitle == '') {
                    //    // If we get here this is not good. This means there is something wrong with the AR or perhaps it has to do with the status of the AR.
                    //    topHtml += '       <a style="cursor:pointer;" onclick="displayArInDialog(\'' + appWebUrl + '\', \'' + BWMData[0][workflowIndex][4][selectedFaIndex][8][selectedBrIndex][0] + '\', \'' + BWMData[0][workflowIndex][4][selectedFaIndex][8][selectedBrIndex][1] + '\', \'' + BWMData[0][workflowIndex][4][selectedFaIndex][8][selectedBrIndex][2] + '\');" target="_blank" title="Click to view the request..."><em>There is a problem with this AR. Click here to learn more</em></a>';
                    //} else {
                    //    topHtml += '       <a style="cursor:pointer;" onclick="displayArInDialog(\'' + appWebUrl + '\', \'' + BWMData[0][workflowIndex][4][selectedFaIndex][8][selectedBrIndex][0] + '\', \'' + BWMData[0][workflowIndex][4][selectedFaIndex][8][selectedBrIndex][1] + '\', \'' + BWMData[0][workflowIndex][4][selectedFaIndex][8][selectedBrIndex][2] + '\');" target="_blank" title="Click to view the request...">' + brProjectTitle + ' (<em>' + formatCurrency(brBudgetAmount) + '</em>) - <em>' + faTitle + '</em></a>'; // ' + brProjectTitle + ' <em>(' + formatCurrency(brBudgetAmount) + ')</em></a>';
                    //}

                    topHtml += '        </tr>';
                }
            } else {
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
            $('#' + topRow2Id)[0].innerHTML = topHtml;
            div2.style.visibility = 'visible';
            $('#' + topRow2Id).show();


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
            console.log('Exception in bwDonate.expandHomePageNotificationAndRenderAlerts_Printed() 2:' + e.message + ' ' + e.stack + ' This is not necessarily a service unavailable error but we dont want to bother the user!!');
            displayAlertDialog('Exception in bwDonate.expandHomePageNotificationAndRenderAlerts_Printed() 2:' + e.message + ' ' + e.stack + ' This is not necessarily a service unavailable error but we dont want to bother the user!!');

        }
    },

    populateAttachments: function (_workflowAppId, _budgetRequestId, attachmentsTagId, showRemoveAttachmentButton) {
        try {
            //debugger;
            console.log('In populateAttachments(' + _workflowAppId + ', ' + _budgetRequestId + ', ' + attachmentsTagId + ', ' + showRemoveAttachmentButton + ').');
            var thiz = this;

            var operationUri = this.options.operationUriPrefix + '_files/' + 'getlistofattachmentsforbudgetrequest/' + _workflowAppId + '/' + _budgetRequestId; //_budgetRequestId; // _files allows us to use nginx to route these to a dedicated file server.
            $.ajax({
                url: operationUri,
                method: "GET",
                timeout: this.options.ajaxTimeout,
                headers: { "Accept": "application/json; odata=verbose" },
                success: function (data) {

                    //displayAlertDialog('bw.initar.core.js.populateAttachments().getlistofattachmentsforbudgetrequest: ' + JSON.stringify(data));

                    //if (JSON.stringify(data).indexOf('ENOENT') > -1) {
                    //    //ENOENT: no such file or directory)

                    //    $('#' + attachmentsSectionId).empty();
                    //    $('#' + attachmentsSectionId).append('<span style="font-style:italic;font-size:22pt;">' + '[Error occurred on the file server]' + '</span>');

                    //    WriteToErrorLog('Error in bw.initar.core.js.populateAttachments()', JSON.stringify(data));

                    //} else {
                    //displayAlertDialog('bw.initar.core.js.populateAttachments().getlistofattachmentsforbudgetrequest: ' + JSON.stringify(data));
                    //displayAlertDialog('Number of attachments: ' + data.length);
                    // Now we iterate through all of the files and add them to the attachments list on the page.
                    try {
                        $('#' + attachmentsTagId).empty();

                        for (var i = 0; i < data.length; i++) {

                            //Filename: filename,
                            //Description: description


                            var filename = data[i].Filename;
                            var description = data[i].Description;

                            console.log('In populateAttachments(). description: ' + description);

                            var fileUrl = "_files/" + _workflowAppId + "/" + _budgetRequestId + "/" + filename;
                            //$('#' + attachmentsSectionId).append("<span style=\"WIDTH: 100%; contentEditable=false;\" >");
                            //$('#' + attachmentsSectionId).append("<a target=\"_blank\" href=\"" + fileUrl + "\">" + filename + "</a>");
                            //$('#' + attachmentsSectionId).append("<input type=\"button\" id=\"removeBudgetRequestAttachment" + i + "\" value=\"Remove\" onclick=\"removeAttachment('" + filename + "');\" />");
                            //$('#' + attachmentsSectionId).append("</span></br>");


                            //$('span[xd\\:binding = "my:Location"]')[0].innerHTML = 'filename: ' + filename; // THIS IS just the way I am debugging by putting text in the field.
                            //$('#' + attachmentsSectionId)[0].innerHTML = 'filename: ' + filename;

                            // Centered on the screen.
                            var width = 800;
                            var height = 600;
                            var left = (screen.width - width) / 2;
                            var top = (screen.height - height) / 2;
                            //$('#' + attachmentsSectionId).append('<span style="WIDTH: 100%;" onclick="window.open(\'' + fileUrl + '\', \'window1\', \'width=600, height=100\');return false;">' + filename + '</span>'); 



                            //$('#' + attachmentsSectionId).append('<div style="height:50px;border:1px thin red;">'); // This is the height of the link for the attachment!!!

                            var html = '';

                            //html += '<table style="width:100%;">';
                            html += '<table style="display: inline-block;">';
                            html += '  <tr>';
                            //html += '    <td style="width:10%;">';
                            html += '    <td>';
                            // Display the image thumbnail.
                            if (filename.toLowerCase().indexOf('.png') > -1 || filename.toLowerCase().indexOf('.jpg') > -1 || filename.toLowerCase().indexOf('.jpeg') > -1 || filename.toLowerCase().indexOf('.jfif') > -1) {
                                //debugger;
                                html += '<img src="' + thiz.options.operationUriPrefix + fileUrl + '" style="height:90px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;" alt="" ';
                                if (Platform == 'IOS8') {
                                    //html += 'onclick="displayAttachmentInDialog(\'' + globalUrlPrefix + globalUrlForWebServices + '/' + fileUrl + '\', \'' + description + '\', \'' + _budgetRequestId + '\', \'' + attachmentsTagId + '\');"';
                                    html += 'onclick="displayAttachmentInDialog(\'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + _budgetRequestId + '\');"';
                                } else {
                                    //html += 'onclick="window.open(\'' + fileUrl + '\', \'window1\', \'width=' + width + ', height=' + height + ', top=' + top + ', left=' + left + ', resizable=yes\');return false;"';
                                    html += 'onclick="displayAttachmentInDialog(\'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + _budgetRequestId + '\');" ';

                                }
                                html += ' />';
                            }
                            html += '    </td>';
                            //html += '    <td style="width:90%;">';
                            html += '    <td>';
                            // We need an if statement here to choose between iOS and Windows.
                            //if (Platform == 'IOS8') {
                            //html += '<div class="attachmentsSectionFileLink" style="height:50px;border:1px thin red;" onclick="displayAttachmentInDialog(\'' + globalUrlPrefix + globalUrlForWebServices + '/' + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + _budgetRequestId + '\');">';
                            //html += '<div class="attachmentsSectionFileLink" style="height:50px;border:1px thin red;" onclick="displayAttachmentInDialog(\'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + _budgetRequestId + '\');">';
                            //} else {

                            //html += '<div class="attachmentsSectionFileLink" style="height:50px;border:1px thin red;" onclick="window.open(\'' + fileUrl + '\', \'window1\', \'width=' + width + ', height=' + height + ', top=' + top + ', left=' + left + ', resizable=yes\');return false;">';
                            //html += '<div style="cursor:pointer;" class="attachmentsSectionFileLink" onclick="displayAttachmentInDialog(\'' + globalUrlPrefix + globalUrlForWebServices + '/' + fileUrl + '\', \'' + description + '\', \'' + _budgetRequestId + '\', \'' + attachmentsTagId + '\');">';
                            //html += '<div style="cursor:pointer;" class="attachmentsSectionFileLink" onclick="displayAttachmentInDialog(\'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + _budgetRequestId + '\');">';

                            //}

                            html += filename;

                            // Display the file attachment description.
                            if (description.length > 0) {
                                //$('#' + attachmentsSectionId).append('&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - "' + description + '"</span>');

                                html += '&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - "' + description + '"</span>';
                            } else {
                                //$('#' + attachmentsSectionId).append('&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - [no description]' + description + '</span>'); // Leave the description variable here because then we will know if something unexpected happens.

                                html += '&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - [no description]' + description + '</span>';
                            }

                            //if (showRemoveAttachmentButton == 'true') {
                            //    //$('#' + attachmentsSectionId).append("&nbsp;&nbsp;<input type=\"button\" style=\"cursor:pointer;\" id=\"removeBudgetRequestAttachment" + i + "\" value=\"Remove\" onclick=\"removeAttachment('" + filename + "', '" + attachmentsSectionId + "', '" + _workflowAppId + "', '" + _budgetRequestId + "');\" />");

                            //    html += '&nbsp;&nbsp;<input type="button" style="cursor:pointer;" id="removeBudgetRequestAttachment' + i + '" value="Remove" onclick="removeAttachment(\'' + filename + '\', \'' + attachmentsTagId + '\', \'' + _workflowAppId + '\', \'' + _budgetRequestId + '\');" />';
                            //}

                            //$('#' + attachmentsSectionId).append("</br>");
                            //html += '</br>';

                            //html += '</div>';

                            //html += '</br>';
                            html += '    </td>';

                            html += '  </tr>';
                            html += '</table>';

                            $('#' + attachmentsTagId).append(html);
                        }
                    } catch (e) {
                        if (e.number) {
                            displayAlertDialog('Error in populateAttachments():1: ' + e.number + ', "' + e.message + '"');
                        } else {
                            // This most likely means that the folders are there on the file services server, but there is nothing in them.
                            //
                            // Fileservices has an error, so show nothing! We will put a red exclamation pin in the attachments section eventually! - 10-1-17 todd
                            //displayAlertDialog('Fileservices has an error: ' + ' "' + e.message + '"');
                        }
                    }
                    //}
                },
                error: function (data, errorCode, errorMessage) {

                    if (errorCode === 'timeout' && errorMessage === 'timeout') {
                        displayAlertDialog('File services is not respondingxcx5. communication timeout is set at ' + ajaxTimeout / 1000 + ' seconds: ' + errorCode + ', ' + errorMessage);
                    } else {

                        console.log('Error in populateAttachments():2: ' + errorCode + ', ' + errorMessage);


                        displayAlertDialog('Error in bw.initar.core.js.populateAttachments():2: ' + errorCode + ', ' + errorMessage);
                        // The latest error 1-17-2018 is errorCode:'error' and errorMessage:'Not Found'.
                        // What does this mean? You can replicate this error!
                        // at Url: https://budgetworkflow.com/ios8.html, view an offline (Un-submitted) request, and try to add an attachment.


                    }
                }
            });
        } catch (e) {
            console.log('Exception in populateAttachments(): ' + e.message + ', ' + e.stack);
        }
    }

});