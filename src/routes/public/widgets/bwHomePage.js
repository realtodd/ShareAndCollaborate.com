$.widget("bw.bwHomePage", { 
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
        This is the bwHomePage.js jQuery Widget. 
        ===========================================================

           [more to follow]
                           
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

           [put your stuff here]

        ===========================================================
        
       */

        bwTenantId: null,
        bwWorkflowAppId: null,

        bwEnabledRequestTypes: null, // An array of the following: ['Budget Request', 'Quote Request', 'Reimbursement Request', 'Recurring Expense', 'Capital Plan Project', 'Work Order']

        operationUriPrefix: null,
        ajaxTimeout: 15000,
        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function (assignmentRowChanged_ElementId) {
        this.element.addClass("bwHomePage");
        //debugger;
        //var thiz = this; // Need this because of the asynchronous operations below.
        try {
            console.log('In bwHomePage._create().');

            selfDiscoverOperationUri(thiz); // This sets this.options.operationUriPrefix correctly.

            this.renderHomePage();

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwHomePage: CANNOT INITIALIZE HOME PAGE</span>';
            html += '<br />';
            html += '<span style="">Exception in bwHomePage.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwHomePage")
            .text("");
    },

    renderHomePage: function () {
        try {
            //debugger;
            console.log('In renderHomePage().');
            var html = '';
            html += 'HOME PAGE';
            //var reportType = this.options.reportType;
            //if (reportType == 'CurrentYearBudgetRequestsReport') {
            //    html += '<span title="print" class="printButton" onclick="$(\'.bwHomePage\').bwHomePage(\'PrintCurrentYearBudgetRequestsReport\');">🖨</span>';
            //} else if (reportType == 'MyPendingTasksReport') {
            //    html += '<span title="print" class="printButton" onclick="$(\'.bwHomePage\').bwHomePage(\'PrintMyPendingTasksReport\');">🖨</span>';
            //} else if (reportType == 'InProcessBudgetRequestsReport') {
            //    html += '<span title="print" class="printButton" onclick="$(\'.bwHomePage\').bwHomePage(\'PrintInProcessBudgetRequestsReport\');">🖨</span>';
            //} else if (reportType == 'IndividualRequestReport') {
            //    html += '<span title="print" class="printButton" onclick="$(\'.bwHomePage\').bwHomePage(\'PrintIndividualRequestReport\');" style="font-size:22pt;">🖨&nbsp;</span>'; // Different size because this one shows up in the dialog draggable top bar header.
            //} else {
            //    console.log('In renderPrintButton(): Unexpected value for reportType: ' + reportType);
            //    html += 'In renderPrintButton(): Unexpected value for reportType: ' + reportType;
            //}

            // Render the html.
            this.element.html(html);

        } catch (e) {
            console.log('Exception in renderHomePage(): ' + e.message + ', ' + e.stack);
        }
    },


    renderAlerts: function () {
        // Render the pending items. Only do this if the home page is displayed!!!
        // if($('#testElement').is(':visible')){
        //alert('function renderAlerts()');
        //alert('spanTopBarExpandCollapseWelcome.is(:visible): ' + $('#spanTopBarExpandCollapseWelcome').is(':visible'));
        console.log('In bwHomePage.renderAlerts().');

        // If a dialog is displayed, do not perform this functionality. This will cut down on the server hits! :)
        var aDialogWindowIsOpen = false;
        try {
            // Add all the dialog tests here. Currently just checking for this one.
            if ($('#ArDialog').dialog('isOpen')) {
                aDialogWindowIsOpen = true;
            }
            // ToDo: Add more dialog references... :D
        } catch (e) {
            // do nothing.
        }

        if (aDialogWindowIsOpen != true && $('#divHomePageAlert').is(':visible') != false && $('#divHomePageAlert').is(':visible') == true) { // This may seem strange, but I think a lag in the DOM processing makes != false better than == true.
            $('#invitationLink2').empty();
            var queryData = {
                //"bwTenantId": tenantId,
                "bwWorkflowAppId": workflowAppId,
                "bwParticipantId": participantId,
                "bwParticipantEmail": participantEmail
            };
            $.ajax({
                url: webserviceurl + "/bwinvitationsunclaimed",
                type: "DELETE",
                contentType: 'application/json',
                data: JSON.stringify(queryData), //JSON.stringify(queryData),
                success: function (invitationData) {
                    //var invitationHtml = '';
                    //invitationHtml += '<a href="javascript:cmdViewInvitations();">';
                    //invitationHtml += '<img src="/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;vertical-align:top;" />';
                    //invitationHtml += invitationData.length + ' unclaimed invitation(s)';
                    //invitationHtml += '</a>';
                    //invitationHtml += '<hr />';
                    //$('#divUserDropdownPendingInvitationsLink').html(invitationHtml);

                    //var operationUri = appweburl + "/bwtasksoutstanding/" + participantId;
                    var operationUri = webserviceurl + "/bwtasksoutstanding";
                    $.ajax({
                        url: operationUri,
                        type: "Post", //was delete
                        contentType: 'application/json',
                        data: JSON.stringify(queryData), //JSON.stringify(queryData),
                        success: function (taskData) {

                            //displayAlertDialog('bwtasksoutstanding: ' + JSON.stringify(taskData));
                            // Render the user dropdown pending tasks.
                            //var taskHtml = '';
                            //taskHtml += '<a href="javascript:cmdViewTasks();">';
                            //taskHtml += '<img src="/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;vertical-align:top;" />';
                            //taskHtml += taskData.length + ' pending task(s)';
                            //taskHtml += '</a>';
                            //taskHtml += '<hr />';
                            //$('#divUserDropdownPendingTasksLink').html(taskHtml);
                            $.ajax({
                                url: webserviceurl + "/bwtenants",
                                type: "DELETE",
                                contentType: 'application/json',
                                data: JSON.stringify(queryData),
                                success: function (tenantData) {

                                    //// Render the user dropdown tenant membership link.
                                    //var tmHtml = '';
                                    //tmHtml += 'Selected workflow: <span style="white-space:nowrap;">' + workflowAppTitle + 'add-dd1</span>'; // Todd this doesn't work because we need to regenerate this when shown!
                                    //tmHtml += '<br />';
                                    //tmHtml += '<hr />';
                                    //$('#divUserDropdownTenantMembershipLink').html(tmHtml);


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

                                                    // Change the page title to indicate the # of tasks. This will show up in the browser tab and is a cool way to show the user they have alerts.
                                                    if (taskData.length > 0) {
                                                        document.title = 'My Budgetsxcx3 (' + taskData.length + ')';
                                                        // Change the css to red/orange.
                                                        //swapStyleSheet("css/bw.core.colors.red.orange.css");
                                                     
                                                    } else {
                                                        document.title = 'My Budgetsxcx4';
                                                        // Change the css to blue/blue.
                                                        //swapStyleSheet("css/bw.core.colors.blue.blue.css");
                                                 
                                                    }

                                                    var html = '';
                                                    if (taskData.length == 0 && brData.PendingBudgetRequests.length == 0 && brData.PendingPOBudgetRequests.length == 0) {

                                                        html += 'You have no pending tasks, and there are no pending budget requests.';


                                                        // Render the user top bar alert. This is the red dot next to the users name.
                                                        //var utbHtml = '';
                                                        //utbHtml += '<img src="/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;vertical-align:top;" />';
                                                        //$('#spanUserTopBarAlert').html(utbHtml);
                                                        // Render the left nav button alert. This is the red dot on the "My Stuff" button.
                                                        //var lnbHtml = '';
                                                        //lnbHtml += '<img src="/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;vertical-align:top;" />';
                                                        //$('#spanMyStuffButtonAlert').html(lnbHtml);
                                                    }
                                                    //  Yellow Title Bar alert. This is the yellow "Alert!" in the top bar.
                                                    // Todd: Put some code here to manage this.

                                                    // Display the home page alerts.
                                                    var deferredIndex = 1; // We only have 1 workflow to display, but if we want to display multiple, use this value.

                                                    //html += '<table id="bwWorkflowFunctionalAreaSection' + deferredIndex.toString() + '" style="cursor:default;" title="">';
                                                    html += '<table id="tblHomePageAlertSectionForWorkflow' + deferredIndex.toString() + '" style="cursor:default;" title="">';
                                                    //html += '<table id="tblSummaryPageFunctionalAreaSectionForWorkflow' + deferredIndex.toString() + '" style="cursor:default;" title="">';


                                                    html += '<tr id="functionalAreaRow_' + deferredIndex.toString() + '_Top_1" style="visibility:hidden;"><td colspan="7"></td></tr>'; // This is the invisible one at the top used for reordering.
                                                    html += '<tr id="functionalAreaRow_' + deferredIndex.toString() + '_Top_2" style="visibility:hidden;"><td colspan="7"></td></tr>'; // This is the row underneath it for displaying the details.
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

                                                    notifications = new Array(3);

                                                    notifications[0] = []; //new Array(3); // Initialize the task section.
                                                    notifications[0] = new Array(3);
                                                    notifications[1] = []; //new Array(3); // Initialize the budget requests section.
                                                    notifications[1] = new Array(3);
                                                    notifications[2] = []; //new Array(3); // Initialize the invitations section.
                                                    notifications[2] = new Array(3);

                                                    // Now we create and load the tasks in notifications[0].
                                                    notifications[0][0] = 'task';
                                                    if (taskData.length == 1) {
                                                        notifications[0][1] = 'You have ' + taskData.length + ' pending task.';
                                                    } else {
                                                        notifications[0][1] = 'You have ' + taskData.length + ' pending tasks. xcx1';
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
                                                            notifications[0][2][i][15] = taskData[i].bwAssignedToRaciRoleAbbreviation;
                                                            notifications[0][2][i][16] = taskData[i].bwAssignedToRaciRoleName;

                                                            //debugger;
                                                            notifications[0][2][i][17] = taskData[i].OrgId;
                                                            notifications[0][2][i][18] = taskData[i].OrgName;
                                                        }
                                                    }

                                                    // Now we create and load the budget requests in notifications[1].
                                                    var brLength = brData.PendingBudgetRequests.length + brData.PendingPOBudgetRequests.length;
                                                    notifications[1][0] = 'budget request';
                                                    if (brLength == 1) {
                                                        notifications[1][1] = 'There is ' + brLength + ' budget request going through the approval process.';
                                                    } else {
                                                        notifications[1][1] = 'There are ' + brLength + ' budget requests going through the approval process.';
                                                    }
                                                    notifications[1][2] = [];
                                                    if (brLength > 0) {
                                                        notifications[1][2] = new Array(brLength); // The array can hold both data sets.
                                                        // Load the PendingBudgetRequests first.
                                                        var indexOffset = 0;
                                                        for (var i = 0; i < brData.PendingBudgetRequests.length; i++) {
                                                            notifications[1][2][i] = new Array(13);
                                                            notifications[1][2][i][0] = brData.PendingBudgetRequests[i].bwBudgetRequestId;
                                                            notifications[1][2][i][1] = brData.PendingBudgetRequests[i].CreatedBy;
                                                            notifications[1][2][i][2] = brData.PendingBudgetRequests[i].Title;
                                                            notifications[1][2][i][3] = brData.PendingBudgetRequests[i].ProjectTitle;
                                                            notifications[1][2][i][4] = brData.PendingBudgetRequests[i].BudgetAmount;
                                                            notifications[1][2][i][5] = brData.PendingBudgetRequests[i].FunctionalAreaId;
                                                            notifications[1][2][i][6] = brData.PendingBudgetRequests[i].ARStatus;
                                                            notifications[1][2][i][7] = brData.PendingBudgetRequests[i].BudgetWorkflowStatus;
                                                            notifications[1][2][i][8] = brData.PendingBudgetRequests[i].Quote;
                                                            notifications[1][2][i][9] = brData.PendingBudgetRequests[i].CurrentOwner;
                                                            notifications[1][2][i][10] = brData.PendingBudgetRequests[i].ManagerId;
                                                            notifications[1][2][i][11] = brData.PendingBudgetRequests[i].RequestedCapital;
                                                            notifications[1][2][i][12] = brData.PendingBudgetRequests[i].RequestedExpense;
                                                            indexOffset += 1;
                                                        }
                                                        // Then load the PendingPOBudgetRequests.
                                                        for (var i = 0; i < brData.PendingPOBudgetRequests.length; i++) {
                                                            var index = i + indexOffset;
                                                            notifications[1][2][index] = new Array(13);
                                                            notifications[1][2][index][0] = brData.PendingPOBudgetRequests[i].bwBudgetRequestId;
                                                            notifications[1][2][index][1] = brData.PendingPOBudgetRequests[i].CreatedBy;
                                                            notifications[1][2][index][2] = brData.PendingPOBudgetRequests[i].Title;
                                                            notifications[1][2][index][3] = brData.PendingPOBudgetRequests[i].ProjectTitle;
                                                            notifications[1][2][index][4] = brData.PendingPOBudgetRequests[i].BudgetAmount;
                                                            notifications[1][2][index][5] = brData.PendingPOBudgetRequests[i].FunctionalAreaId;
                                                            notifications[1][2][index][6] = brData.PendingPOBudgetRequests[i].ARStatus;
                                                            notifications[1][2][index][7] = brData.PendingPOBudgetRequests[i].BudgetWorkflowStatus;
                                                            notifications[1][2][index][8] = brData.PendingPOBudgetRequests[i].Quote;
                                                            notifications[1][2][index][9] = brData.PendingPOBudgetRequests[i].CurrentOwner;
                                                            notifications[1][2][index][10] = brData.PendingPOBudgetRequests[i].ManagerId;
                                                            notifications[1][2][index][11] = brData.PendingPOBudgetRequests[i].RequestedCapital;
                                                            notifications[1][2][index][12] = brData.PendingPOBudgetRequests[i].RequestedExpense;
                                                        }
                                                    }

                                                    // Now we create and load the unclaimed invitations in notifications[2].
                                                    notifications[2][0] = 'invitation';
                                                    if (invitationData.length == 1) {
                                                        notifications[2][1] = 'There is ' + invitationData.length + ' unclaimed invitation.';
                                                    } else {
                                                        notifications[2][1] = 'There are ' + invitationData.length + ' unclaimed invitations.xcx3';
                                                    }
                                                    notifications[2][2] = [];
                                                    if (invitationData.length > 0) {
                                                        notifications[2][2] = new Array(invitationData.length);
                                                        for (var i = 0; i < invitationData.length; i++) {
                                                            notifications[2][2][i] = new Array(7);
                                                            notifications[2][2][i][0] = globalUrlPrefix + globalUrl + '?invitation=' + invitationData[i].bwInvitationId;
                                                            notifications[2][2][i][1] = invitationData[i].bwInvitationParticipantRole;
                                                            notifications[2][2][i][2] = invitationData[i].bwInvitationCreatedByFriendlyName;
                                                        }
                                                    }

                                                    var expandedAlertsIndex = -1;
                                                    for (var i = 0; i < notifications.length; i++) {
                                                        if (notifications[i][2].length > 0) {
                                                            var isPendingRow = false;
                                                            var rowHtml = '';
                                                            rowHtml += '<tr id="functionalAreaRow_' + deferredIndex.toString() + '_' + i.toString() + '" class="bwFunctionalAreaRow">';
                                                            // Check for alerts.
                                                            var faNumberOfAlerts = 0;
                                                            faNumberOfAlerts = 1;
                                                            if (faNumberOfAlerts > 0) {
                                                                isPendingRow = true;
                                                                if (faNumberOfAlerts == 1) {
                                                                    //rowHtml += '   <td style="width:15px;" title="There is 1 overdue task. Click here to view the details..."><em>PENDING</em></td>';
                                                                    if (notifications[i][0] == 'task') {
                                                                        rowHtml += '<td class="bwHPNDrillDownLinkCell"><img src="/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;vertical-align:top;" />';
                                                                        rowHtml += '<img title="collapse" id="participantCircleDialogSectionImage_1" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="images/drawer-close.png">';
                                                                        rowHtml += '</td>';
                                                                        expandedAlertsIndex = i; // This lets us know, below, if and where to expand the alerts!
                                                                    } else {
                                                                        rowHtml += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell">';
                                                                        rowHtml += '<img title="collapse" id="participantCircleDialogSectionImage_1" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="images/drawer-open.png">';
                                                                        rowHtml += '</td>';
                                                                    }
                                                                    //
                                                                } else {
                                                                    //rowHtml += '   <td style="width:15px;" title="There are ' + faNumberOfAlerts.toString() + ' overdue tasks. Click here to view the details..."><em>PENDING</em></td>';
                                                                    if (notifications[i][0] == 'task') {
                                                                        rowHtml += '<td class="bwHPNDrillDownLinkCell"><img src="/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;vertical-align:top;" />';
                                                                        rowHtml += '<img title="collapse" id="participantCircleDialogSectionImage_1" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="images/drawer-close.png">';
                                                                        rowHtml += '</td>';
                                                                    } else {
                                                                        rowHtml += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell">';
                                                                        rowHtml += 'x2<img title="collapse" id="participantCircleDialogSectionImage_1" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="images/drawer-open.png">';
                                                                        rowHtml += '</td>';
                                                                    }
                                                                    //
                                                                }
                                                            } else {
                                                                rowHtml += '   <td style="width:15px;"></td>';
                                                            }
                                                            rowHtml += '   <td style="text-align:left;" class="bwHPNDrillDownLinkCell" nowrap onclick="expandHomePageNotificationAndRenderAlerts(\'' + notifications[i][0] + '\', \'' + deferredIndex + '\', \'functionalAreaRow_' + deferredIndex.toString() + '_' + i.toString() + '\');"><span>' + notifications[i][1] + '</span></td>';
                                                            rowHtml += '</tr>';
                                                            if (isPendingRow == true) {
                                                                pendingHtml += rowHtml;
                                                            } else {
                                                                notPendingHtml += rowHtml;
                                                            }
                                                        }
                                                    }
                                                    html += pendingHtml + notPendingHtml; // This puts the pending functional areas at the top.
                                                    html += '</table>';
                                                    var unitTable1 = '';
                                                    unitTable1 += '<div id="BWFunctionalAreaDiv' + deferredIndex.toString() + '" style="cursor:pointer;" >';
                                                    unitTable1 += '<table id="BWFunctionalArea' + deferredIndex.toString() + '" style="vertical-align:top;width:100%;">';
                                                    // THIS IS THE TOP BAR WHICH WE CAN ENABLE IF WE WANT TO HAVE MULTIPLE SECTIONS.
                                                    //unitTable1 += '  <tr>';
                                                    //unitTable1 += '    <td class="bwChartCalculatorWorkflowInstanceTitle" style="height:28px;padding:6px 20px 6px 20px;margin:0 0 0 0;border-width:0 0 0 0;" onclick="collapseOrExpandBwFunctionalAreaDiv(\'bwWorkflowFunctionalAreaSection' + deferredIndex.toString() + '\', \'' + deferredIndex.toString() + '\');" colspan="2" style="text-align:left;">';
                                                    //unitTable1 += '      <span id="BWAppInstance' + deferredIndex.toString() + 'Title">' + title + '</span>';
                                                    //unitTable1 += '    </td>';
                                                    //unitTable1 += '  </tr>';
                                                    unitTable1 += html;
                                                    unitTable1 += '</table><br />';
                                                    unitTable1 += '</div>';
                                                    $('#divHomePageAlert').html(unitTable1);


                                                    // This makes sure the Alerts section is always expanded (if there are alerts).
                                                    if (expandedAlertsIndex != -1) {
                                                        var functionalAreaRowId = 'functionalAreaRow_' + deferredIndex.toString() + '_' + expandedAlertsIndex.toString();
                                                        expandHomePageNotificationAndRenderAlerts('task', deferredIndex, functionalAreaRowId); // 
                                                    }

                                                    //$('#divHomePageAlert').empty();
                                                    //var tmpHtml = getHomePageNotificationsHtml('1');
                                                    //$('#divHomePageAlert').html(tmpHtml);











                                                    // Now we have to check if there are any requests saved on the users' device.
                                                    // Check if there are any requests stored in IndexDB locally.
                                                    try {
                                                        var request = indexedDB.open(indexDBName, dbVersion);

                                                        request.onerror = function (event) {
                                                            console.log('In my.js.renderAlerts(). Error accessing database "' + event.target.result.name + '". errorCode: ' + event.target.errorCode);
                                                        };

                                                        request.onsuccess = function (event) {
                                                            console.log('In my.js.renderAlerts(). Success accessing database "' + event.target.result.name + '".');
                                                            var db = event.target.result;
                                                            try {
                                                                var store = db.transaction('objectStoreCachedRequests', 'readonly');
                                                                var req;
                                                                req = store.objectStore('objectStoreCachedRequests').count();
                                                            } catch (e) {
                                                                console.log('In my.js.renderAlerts(). Xerror1: ' + e.message);
                                                            }
                                                            if (!req) {
                                                                console.log('In my.js.renderAlerts(). Unable to access IndexDb. Todd: fix this!');
                                                            } else {
                                                                req.onsuccess = function (evt) {
                                                                    var html2 = '';
                                                                    var numberOfRequests = evt.target.result;
                                                                    //// This is where we need to show the status on the home page. 
                                                                    //if (numberOfRequests == 1) {
                                                                    //    var html2 = '<a href="javascript:cmdDisplayClientRequestsNotYetSubmittedDialog();">You have ' + numberOfRequests + ' un-submitted request saved on this device.</a>';
                                                                    //    //$('#divHomePageAlert').append(html2);
                                                                    //} else if (numberOfRequests > 1) {
                                                                    //    var html2 = '<a href="javascript:cmdDisplayClientRequestsNotYetSubmittedDialog();">You have ' + numberOfRequests + ' un-submitted requests saved on this device.</a>';
                                                                    //    //$('#divHomePageAlert').append(html2);
                                                                    //}

                                                                    if (numberOfRequests > 0) {
                                                                        // Display the requests stored on this device.

                                                                        console.log('If this device runs low on storage, your web browser may delete them without asking you.');

                                                                        //html2 += '<br />';
                                                                        //html2 += 'If this device runs low on storage, your web browser may delete them without asking you.y';
                                                                        //html2 += '<br />';

                                                                        html2 += '<table>';
                                                                        html2 += '  <tr>';
                                                                        html2 += '    <td style="padding-left:11px;"></td>';
                                                                        html2 += '    <td></td>';
                                                                        html2 += '    <td style="text-align:left;" class="bwHPNDrillDownLinkCell" ';
                                                                        // This is where we need to show the status on the home page. 
                                                                        if (numberOfRequests == 1) {
                                                                            html2 += 'onclick="cmdDisplayClientRequestsNotYetSubmittedDialog();">You have ' + numberOfRequests + ' un-submitted request saved on this device.';
                                                                        } else if (numberOfRequests > 1) {
                                                                            html2 += 'onclick="cmdDisplayClientRequestsNotYetSubmittedDialog();">You have ' + numberOfRequests + ' un-submitted requests saved on this device.';
                                                                        }
                                                                        html2 += '    </td>';
                                                                        html2 += '    <td></td>';
                                                                        html2 += '  </tr>';

                                                                        html2 += '<tr>';
                                                                        html2 += '  <td colspan="4" style="padding-left:24px;">';
                                                                        html2 += '    <table style="width:100%;">';
                                                                        html2 += '      <tr>';
                                                                        html2 += '        <td colspan="4">';
                                                                        html2 += '        </td>';
                                                                        html2 += '      </tr>';
                                                                        var objectStore = db.transaction("objectStoreCachedRequests").objectStore("objectStoreCachedRequests");
                                                                        objectStore.openCursor().onsuccess = function (event) {
                                                                            try {
                                                                                var cursor = event.target.result;
                                                                                if (cursor) {
                                                                                    var projectTitle = '';
                                                                                    console.log('Retrieved request: ' + cursor.value.ProjectTitle + ': ' + cursor.value.bwBudgetRequestId);
                                                                                    html2 += '<tr>';
                                                                                    html2 += '  <td colspan="2"></td>';
                                                                                    html2 += '  <td style="padding: 10px; cursor: pointer; background-color: #d8d8d8;" onclick="cmdRenderAndLoadNewRequestFormWithUnsubmittedRequest_loggedin_IndexDb(\'' + cursor.value.bwBudgetRequestId + '\');" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'#d8d8d8\';">' + cursor.value.ProjectTitle + '</td>';
                                                                                    html2 += '  <td>';
                                                                                    html2 += '      <img src="images/trash-can.png" onclick="cmdDisplayDeleteUnsubmittedBudgetRequestDialog(\'' + cursor.value.bwBudgetRequestId + '\', \'' + cursor.value.ProjectTitle + '\');" title="Delete" style="cursor:pointer;" />';
                                                                                    html2 += '  </td>';
                                                                                    html2 += '</tr>';
                                                                                    cursor.continue();
                                                                                } else {
                                                                                    console.log('In renderAlerts(). Done looping, so rendering. In the future cache and compare to determine if rendering is necessary.');
                                                                                    html2 += '    </table></td>';
                                                                                    html2 += '  </tr>';
                                                                                    html2 += '</table>';
                                                                                    $('#divHomePageAlert').append(html2);
                                                                                }
                                                                            } catch (e) {
                                                                                console.log('xxyyyfgError: ' + e.message + ', ' + e.stack);
                                                                            }
                                                                        };
















                                                                    } else {
                                                                        $('#divHomePageAlert').append(html2);
                                                                    }



                                                                };

                                                                req.onerror = function (evt) {
                                                                    console.error("In my.js.renderAlerts(). add error", this.error);
                                                                };
                                                            }
                                                        }
                                                    } catch (e) {
                                                        console.log('In my.js.renderAlerts(). FAILED TO OPEN A TRANSACTION to the database...' + e.message + ', ' + e.stack);
                                                    }












                                                },
                                                error: function (data, errorCode, errorMessage) {
                                                    //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
                                                    displayAlertDialog('Error in my.js.renderAlerts():1:' + errorCode + ', ' + errorMessage + ' I believe this happens when wifi goes down. SERVICE UNAVAILABLE ');
                                                }
                                            });
                                        },
                                        error: function (data, errorCode, errorMessage) {
                                            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
                                            displayAlertDialog('Error in my.js.renderAlerts():2:' + errorCode + ', ' + errorMessage);
                                        }
                                    });
                                },
                                error: function (data, errorCode, errorMessage) {
                                    //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
                                    displayAlertDialog('Error in my.js.renderAlerts():3:' + errorCode + ', ' + errorMessage);
                                }
                            });
                        },
                        error: function (data, errorCode, errorMessage) {
                            //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
                            displayAlertDialog('Error in my.js.renderAlerts():4:' + errorCode + ', ' + errorMessage + ', ' + JSON.stringify(data));
                        }
                    });
                },
                error: function (data, errorCode, errorMessage) {
                    //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
                    displayAlertDialog('Error in my.js.renderAlerts():5:' + errorCode + ', ' + errorMessage + ' I believe this happens when wifi goes down. SERVICE UNAVAILABLE ');
                }
            });
        }
    }



});