$.widget("bw.bwOneTimeRequestReminders", {
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
        This is the bwOneTimeRequestReminders.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        Reminders: null,

        operationUriPrefix: null
    },
    _create: function () {
        this.element.addClass("bwOneTimeRequestReminders");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {

            selfDiscoverOperationUri(thiz); // This sets this.options.operationUriPrefix correctly.

            this.loadRequestReminders();

            console.log('In bwOneTimeRequestReminders._create(). The widget has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwOneTimeRequestReminders</span>';
            html += '<br />';
            html += '<span style="">Exception in bwOneTimeRequestReminders.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwOneTimeRequestReminders")
            .text("");
    },
    getData: function () {
        try {
            console.log('In bwOneTimeRequestReminders.getData().');
            ////debugger;
            ////Come back and build out the JSON for this!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 7-27-2020
            //var value = $(this.element).find('#txtProjectManagerName')[0].value;
            return 'xcx12432341253';
        } catch (e) {
            console.log('Exception in bwOneTimeRequestReminders.getData(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwOneTimeRequestReminders.getData(): ' + e.message + ', ' + e.stack);
        }
    },
    loadRequestReminders: function () {
        try {
            console.log('In bwOneTimeRequestReminders.js.loadRequestReminders().');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');
            data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                bwWorkflowAppId: workflowAppId,
                bwParticipantId: participantId,
                bwParticipantEmail: participantEmail,
                bwParticipantFriendlyName: participantFriendlyName
            };
            var operationUri = webserviceurl + "/bwworkflow/getbudgetrequestreminders";
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

                            var msg = 'Error in bwOneTimeRequestReminders.js.loadRequestReminders(): ' + results.status + ', ' + results.message;
                            displayAlertDialog(msg);

                        } else {

                            //alert('xcx11112 Loading onetimereminders options.Reminders, results: ' + JSON.stringify(results.results));

                            thiz.options.Reminders = results.results;
                            thiz.renderRequestReminders();

                        }

                    } catch (e) {
                        console.log('Exception in bwOneTimeRequestReminders.js.loadRequestReminders():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwOneTimeRequestReminders.js.loadRequestReminders():2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in bwOneTimeRequestReminders.js.loadRequestReminders(): ' + errorMessage);
                    if (errorMessage && errorMessage.toLowerCase() && (errorMessage.toLowerCase() == 'unauthorized')) {
                        // We don't need to notify the user, because the login circle dialog will be displayed.
                    } else {
                        displayAlertDialog('Error in bwOneTimeRequestReminders.js.loadRequestReminders(): ' + errorMessage);
                    }
                }
            });

        } catch (e) {
            console.log('Exception in bwOneTimeRequestReminders.js.loadRequestReminders(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwOneTimeRequestReminders.js.loadRequestReminders(): ' + e.message + ', ' + e.stack);
        }
    },
    renderRequestReminders: function (dataElement, sortOrder) {
        try {
            console.log('In renderRequestReminders().');

            //if (dataElement && sortOrder) {
            //    // If we get these parameters, then we will sort the data here.
            //    if (dataElement == 'Title') {

            //        if (sortOrder == 'ascending') {
            //            pinnedRequests.sort(function (a, b) {
            //                if (a.Title < b.Title) { return -1; }
            //                if (a.Title > b.Title) { return 1; }
            //                return 0;
            //            });
            //        } else if (sortOrder == 'descending') {
            //            pinnedRequests.sort(function (a, b) {
            //                if (a.Title < b.Title) { return 1; }
            //                if (a.Title > b.Title) { return -1; }
            //                return 0;
            //            });
            //        } else {
            //            console.log('Error in renderDetailedList_PinnedRequests().Title. Unexpected value for sortOrder: ' + sortOrder);
            //            displayAlertDialog('Error in renderDetailedList_PinnedRequests().Title. Unexpected value for sortOrder: ' + sortOrder);
            //        }

            //    } else if (dataElement == 'ProjectTitle') {

            //        if (sortOrder == 'ascending') {
            //            pinnedRequests.sort(function (a, b) {
            //                if ((a.ProjectTitle && b.ProjectTitle) && (a.ProjectTitle.toUpperCase() < b.ProjectTitle.toUpperCase())) { return -1; }
            //                if ((a.ProjectTitle && b.ProjectTitle) && (a.ProjectTitle.toUpperCase() > b.ProjectTitle.toUpperCase())) { return 1; }
            //                return 0;
            //            });
            //        } else if (sortOrder == 'descending') {
            //            pinnedRequests.sort(function (a, b) {
            //                if ((a.ProjectTitle && b.ProjectTitle) && (a.ProjectTitle.toUpperCase() < b.ProjectTitle.toUpperCase())) { return 1; }
            //                if ((a.ProjectTitle && b.ProjectTitle) && (a.ProjectTitle.toUpperCase() > b.ProjectTitle.toUpperCase())) { return -1; }
            //                return 0;
            //            });
            //        } else {
            //            console.log('Error in renderDetailedList_PinnedRequests().ProjectTitle. Unexpected value for sortOrder: ' + sortOrder);
            //            displayAlertDialog('Error in renderDetailedList_PinnedRequests().ProjectTitle. Unexpected value for sortOrder: ' + sortOrder);
            //        }

            //    } else {
            //        console.log('Error in renderDetailedList_PinnedRequests(). Unexpected value for dataElement: ' + dataElement);
            //        displayAlertDialog('Error in renderDetailedList_PinnedRequests(). Unexpected value for dataElement: ' + dataElement);
            //    }

            //}



            var html = '';

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


            html += '<div id="divDataGridTable" style="overflow-y: scroll;" onscroll="$(\'.bwDataGrid\').bwDataGrid(\'dataGrid_OnScroll\', this, \'' + 'bwRequestTypeId' + '\');">'; // Commented out bwRequestTypeId.. not sure why it is here... 4-22-2022

            html += '<table id="dataGridTable" class="dataGridTable" >';

            html += '<tr>';
            html += '   <td colspan="6">';
            html += '       <span id="spanSelectedEmailType_TopButtons" style="font-size:13pt;font-weight:normal;">';
            html += '       <span class="emailEditor_topbarbutton" onclick="$(\'.bwEmailMonitor\').bwEmailMonitor(\'cmdDisplayDeleteSentEmailsDialog\', \'c48535a4-9a6b-4b95-9d67-c6569e9695d8\');">';
            html += '       <img title="Delete..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx123468">&nbsp;Delete</span>&nbsp;&nbsp;';
            html += '       <span class="emailEditor_topbarbutton" onclick="$(\'.bwEmailMonitor\').bwEmailMonitor(\'cmdDisplayDeleteSentEmailsDialog\', \'c48535a4-9a6b-4b95-9d67-c6569e9695d8\', \'emptyfolder\');">';
            html += '       <img title="Empty folder..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx23423467898">&nbsp;Empty folder </span></span>';
            html += '   </td>';
            html += '</tr>';

            html += '  <tr class="headerRow">';

            html += '   <td>';
            html += '       <input type="checkbox" class="sentEmailCheckbox" bwsentemailid="6c1b40fb-5d06-476e-ae2f-156ed307c595">';
            html += '   </td>';

            // Magnifying glass.
            html += '    <td></td>';

            // "Reminder time" column header.
            html += '    <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Reminder Time&nbsp;</div>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_PinnedRequests\', \'Title\', \'descending\', this);">';
            html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_PinnedRequests\', \'Title\', \'ascending\', this);">';
            html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '   </td>';

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

            // "Reminder Note" column header. 
            html += '    <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Reminder Note&nbsp;</div>';
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

            // Locked
            html += '    <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Locked&nbsp;</div>';
            html += '   </td>';

            // Edit
            html += '    <td></td>';

            // TrashBin
            html += '    <td></td>';

            html += '  </tr>';

            html += '  <tr class="filterRow">';

            html += '   <td>';

            html += '   </td>';

            // Magnifying glass
            html += '    <td></td>';

            // Reminder time
            html += '    <td></td>';

            // Title
            //html += '    <td style="white-space:nowrap;"><span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="alert(\'Order ascending...\');">☝</span><span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="alert(\'Order descending...\');">☟</span></td>';
            html += '    <td style="white-space:nowrap;">';

            html += '   </td>';

            // Description
            //html += '    <td style="white-space:nowrap;"><span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="alert(\'Order ascending...\');">☝</span><span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="alert(\'Order descending...\');">☟</span></td>';
            html += '    <td style="white-space:nowrap;">';

            html += '   </td>';

            // Reminder Notes
            html += '   <td style="white-space:nowrap;">';
            //html += '       <input type="text" id="txtArchivePageDescriptionFilter" class="archivePageFilterBox" title="Type here to limit search results, using * as a wildcard character."/>';
            html += '   </td>';

            // Locked
            html += '   <td style="white-space:nowrap;">';
            //html += '       <input type="text" id="txtArchivePageDescriptionFilter" class="archivePageFilterBox" title="Type here to limit search results, using * as a wildcard character."/>';
            html += '   </td>';

            // Edit
            html += '   <td style="white-space:nowrap;">';
            //html += '       <input type="text" id="txtArchivePageDescriptionFilter" class="archivePageFilterBox" title="Type here to limit search results, using * as a wildcard character."/>';
            html += '   </td>';

            // Trashbin
            html += '   <td style="white-space:nowrap;">';
            //html += '       <input type="text" id="txtArchivePageDescriptionFilter" class="archivePageFilterBox" title="Type here to limit search results, using * as a wildcard character."/>';
            html += '   </td>';

            html += '  </tr>';

            var alternatingRow = 'light'; // Use this to color the rows.
            for (var i = 0; i < this.options.Reminders.length; i++) {

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


                html += '   <td>';
                html += '       <input type="checkbox" id="checkboxToggleSentEmailCheckboxes" onchange="$(\'.bwEmailMonitor\').bwEmailMonitor(\'toggleSentEmailCheckboxes\', this);">';
                html += '   </td>';

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
                //html += '      onmouseenter="$(\'.bwCoreComponent:first\').bwCoreComponent(\'showRowHoverDetails\', \'' + bwEncodeURIComponent(JSON.stringify(bwRequestJson)) + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';

                //html += '       onmouseleave="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'hideRowHoverDetails\');this.style.backgroundColor=\'white\';"';
                //html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\', \'' + '' + '\', \'' + budgetRequestId + '\');" ';



                //displayAlertDialog_Persistent('xcx341234 this.options.Reminders[i]: ' + JSON.stringify(this.options.Reminders[i]));

                //html += '      onmouseenter="$(\'.bwCoreComponent:first\').bwCoreComponent(\'showRowHoverDetails\', \'' + bwEncodeURIComponent(JSON.stringify(this.options.Reminders[i])) + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                html += '      onmouseenter="$(\'.bwCoreComponent:first\').bwCoreComponent(\'showRowHoverDetails\', \'' + encodeURI(JSON.stringify(this.options.Reminders[i])) + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                html += '       onmouseleave="$(\'.bwCoreComponent:first\').bwCoreComponent(\'hideRowHoverDetails\');this.style.backgroundColor=\'white\';"';
                html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + '' + '\', \'' + this.options.Reminders[i].bwBudgetRequestId + '\', \'' + this.options.Reminders[i].Title + '\', \'' + encodeHtmlAttribute(this.options.Reminders[i].ProjectTitle) + '\', \'' + this.options.Reminders[i].Title + '\', \'' + '' + '\', \'' + this.options.Reminders[i].bwBudgetRequestId + '\');" ';

                html += '   ><img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">';
                html += '</td>';



                // Reminder Time
                //var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(this.options.Reminders[i].Reminder_DateTime);
                var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(this.options.Reminders[i].Reminder_DateTime);
                html += '<td style="padding:15px;" ';
                html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + '' + '\', \'' + this.options.Reminders[i].bwBudgetRequestId + '\', \'' + this.options.Reminders[i].Title + '\', \'' + encodeHtmlAttribute(this.options.Reminders[i].ProjectTitle) + '\', \'' + this.options.Reminders[i].Title + '\', \'' + '' + '\', \'' + this.options.Reminders[i].bwBudgetRequestId + '\');" ';
                html += '>';
                html += timestamp4;
                html += '</td>';

                // Title
                html += '<td style="padding:15px;" ';
                html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + '' + '\', \'' + this.options.Reminders[i].bwBudgetRequestId + '\', \'' + this.options.Reminders[i].Title + '\', \'' + encodeHtmlAttribute(this.options.Reminders[i].ProjectTitle) + '\', \'' + this.options.Reminders[i].Title + '\', \'' + '' + '\', \'' + this.options.Reminders[i].bwBudgetRequestId + '\');" ';
                html += '>';
                html += this.options.Reminders[i].Title;
                html += '</td>';

                // ProjectTitle.
                html += '       <td style="padding:15px;" ';
                //html += '       onmouseenter="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'showRowHoverDetails\', \'' + title + '\', \'' + brTitle + '\', \'' + brTitle + '\', \'' + bwWorkflowAppId + '\', \'' + budgetRequestId + '\', \'' + orgId + '\', \'' + orgName + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                //html += '       onmouseleave="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'hideRowHoverDetails\');this.style.backgroundColor=\'white\';"';
                html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + '' + '\', \'' + this.options.Reminders[i].bwBudgetRequestId + '\', \'' + this.options.Reminders[i].Title + '\', \'' + encodeHtmlAttribute(this.options.Reminders[i].ProjectTitle) + '\', \'' + this.options.Reminders[i].Title + '\', \'' + '' + '\', \'' + this.options.Reminders[i].bwBudgetRequestId + '\');" ';
 html += '>';
                html += '           <div style="display:inline-block;" bwtrace="xcx4353464">';
                //if (daysSinceTaskCreated == 1) {
                //    html += '           &nbsp;&nbsp;This task is ' + daysSinceTaskCreated.toString() + ' day old.&nbsp;&nbsp;';
                //} else {
                //    html += '           &nbsp;&nbsp;This task is ' + daysSinceTaskCreated.toString() + ' days old.&nbsp;&nbsp;';
                //}
                html += this.options.Reminders[i].ProjectTitle;
                html += '           </div>';
                html += '       </td>';

                // Reminder note.
                html += '<td style="padding:15px;" >';
                //html += ' onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com/\', \'' + budgetRequestId + '\', \'' + title + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\');">';
                if (this.options.Reminders[i].ReminderNotes) {
                    html += this.options.Reminders[i].ReminderNotes;
                }
                html += '</td>';

                // Locked.
                html += '<td style="padding:15px;" >';
                if (this.options.Reminders[i].Locked) {
                    html += this.options.Reminders[i].Locked;
                } else {
                    html += 'false';
                }
                html += '</td>';

                // Edit
                html += '<td style="padding:15px;text-align:right;" >';
                html += '   <span title="Edit" style="cursor:pointer;font-size:30pt;" onclick="$(\'.bwOneTimeRequestReminders:first\').bwOneTimeRequestReminders(\'editOneTimeRequestReminder\', \'' + this.options.Reminders[i].bwBudgetRequestId + '\', \'' + this.options.Reminders[i].Title + '\');">';
                html += '✎';
                html += '   </span>';
                html += '</td>';

                // TrashBin
                html += '<td style="padding:15px;text-align:right;" >';
                html += '   <img src="images/trash-can.png" title="Delete" style="cursor:pointer;" onclick="$(\'.bwOneTimeRequestReminders:first\').bwOneTimeRequestReminders(\'deleteOneTimeRequestReminder\', \'' + this.options.Reminders[i].bwParticipantId + '\', \'' + this.options.Reminders[i].bwBudgetRequestId + '\');">';
                html += '</td>';


                html += '       </tr>';

            }
            html += '       </tbody></table>';

            html += '<br /><br /><br /><br /><br /><br /><br /><br /><br /><br />';

            this.element.html(html);

        } catch (e) {
            console.log('Exception in renderRequestReminders():1335-1: ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderRequestReminders():1335-1: ' + e.message + ', ' + e.stack);
            var result = {
                html: 'Exception in renderRequestReminders():1335-1: ' + e.message + ', ' + e.stack
            }
            return result;
        }
    },
    deleteOneTimeRequestReminder: function (bwParticipantId, bwBudgetRequestId) {
        try {
            console.log('In bwOneTimeRequestReminders.js.deleteOneTimeRequestReminder(). bwParticipantId: ' + bwParticipantId + ', bwBudgetRequestId: ' + bwBudgetRequestId);
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                bwBudgetRequestId: bwBudgetRequestId,
                bwParticipantId: bwParticipantId
            };
            var operationUri = webserviceurl + "/bwworkflow/deletebudgetrequestreminder";
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

                            var msg = 'Error in deleteOneTimeRequestReminder(): ' + results.status + ', ' + results.message;
                            displayAlertDialog(msg);

                        } else {

                            displayAlertDialog('This reminder has been deleted successfully.');
                            thiz.loadRequestReminders();
                        }

                    } catch (e) {
                        console.log('Exception in bwOneTimeRequestReminders.js.deleteOneTimeRequestReminder():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwOneTimeRequestReminders.js.deleteOneTimeRequestReminder():2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in bwOneTimeRequestReminders.js.deleteOneTimeRequestReminder.deletebudgetrequestreminder(): ' + errorMessage);
                }
            });

        } catch (e) {
            console.log('Exception in bwOneTimeRequestReminders.js.deleteOneTimeRequestReminder().');
            displayAlertDialog('Exception in bwOneTimeRequestReminders.js.deleteOneTimeRequestReminder().');
        }
    },
    editOneTimeRequestReminder: function (bwBudgetRequestId, title) {
        try {
            console.log('In bwOneTimeRequestReminders.js.editOneTimeRequestReminder(). bwBudgetRequestId: ' + bwBudgetRequestId);
            //var thiz = this;

            this.cmdDisplaySetBudgetRequestReminderDialog(bwBudgetRequestId, title);

            //var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            //var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            //var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            //var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            //var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            //data = {
            //    bwParticipantId_LoggedIn: participantId,
            //    bwActiveStateIdentifier: activeStateIdentifier,
            //    bwWorkflowAppId_LoggedIn: workflowAppId,

            //    bwBudgetRequestId: bwBudgetRequestId,
            //    bwParticipantId: bwParticipantId
            //};
            //var operationUri = webserviceurl + "/bwworkflow/editbudgetrequestreminder";
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

            //                var msg = 'Error in editOneTimeRequestReminder(): ' + results.status + ', ' + results.message;
            //                displayAlertDialog(msg);

            //            } else {

            //                displayAlertDialog('This reminder has been updated successfully.');
            //                thiz.loadRequestReminders();
            //            }

            //        } catch (e) {
            //            console.log('Exception in bwOneTimeRequestReminders.js.editOneTimeRequestReminder():2: ' + e.message + ', ' + e.stack);
            //            displayAlertDialog('Exception in bwOneTimeRequestReminders.js.editOneTimeRequestReminder():2: ' + e.message + ', ' + e.stack);
            //        }
            //    },
            //    error: function (data, errorCode, errorMessage) {
            //        displayAlertDialog('Error in bwOneTimeRequestReminders.js.editOneTimeRequestReminder.deletebudgetrequestreminder(): ' + errorMessage);
            //    }
            //});

        } catch (e) {
            console.log('Exception in bwOneTimeRequestReminders.js.editOneTimeRequestReminder().');
            displayAlertDialog('Exception in bwOneTimeRequestReminders.js.editOneTimeRequestReminder().');
        }
    },


    cmdDisplaySetBudgetRequestReminderDialog: function (requestId, title) {
        try {
            console.log('In bwOneTimeRequestReminders.js.cmdDisplaySetBudgetRequestReminderDialog(). requestId: ' + requestId + ', title: ' + title);
            //alert('In bwOneTimeRequestReminders.js.cmdDisplaySetBudgetRequestReminderDialog(). requestId: ' + requestId + ', title: ' + title);
            var thiz = this;
            //
            // This sets a 1-time reminder for the request to be sent to this participant.
            //

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');
            data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                bwBudgetRequestId: requestId,
                bwWorkflowAppId: workflowAppId,
                bwParticipantId: participantId,
                bwParticipantEmail: participantEmail,
                bwParticipantFriendlyName: participantFriendlyName
            };
            var operationUri = webserviceurl + "/bwworkflow/getbudgetrequestreminders";
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

                            var msg = 'Error in cmdDisplaySetBudgetRequestReminderDialog(): ' + results.status + ', ' + results.message;
                            displayAlertDialog(msg);

                        } else {

                            var div = document.getElementById('divSetBudgetRequestReminderDialog');
                            if (div) {
                                div.remove(); // This gets rid of it so we can start fresh. This is particularly important so that the delete button only shows up when we want it to.
                            }
                            //if (!div) {

                            console.log('In cmdDisplaySetBudgetRequestReminderDialog(). adding element to the dom: ' + 'divSetBudgetRequestReminderDialog');

                            div = document.createElement('div');
                            div.id = 'divSetBudgetRequestReminderDialog';
                            div.style.display = 'none';
                            document.body.appendChild(div); // Place at end of document

                            var html = '';

                            html += '        <table style="width:100%;">';
                            html += '            <tr>';
                            html += '                <td style="width:90%;">';
                            html += '                    <span id="spanDeleteAnAttachmentOfflineDialogTitlexxx" style="color: #3f3f3f;font-size: 60pt;font-weight:bold;">Set a One-Time Reminder</span>';
                            html += '                </td>';
                            html += '                <td style="width:9%;"></td>';
                            html += '                <td style="width:1%;cursor:pointer;vertical-align:top;">';
                            html += '                    <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 120pt;font-weight:bold;" onclick="$(\'#divSetBudgetRequestReminderDialog\').dialog(\'close\');">X</span>';
                            html += '                </td>';
                            html += '            </tr>';
                            html += '        </table>';
                            html += '        <br /><br />';

                            html += '<table>';
                            html += '   <tr>';
                            html += '       <td style="vertical-align:top;">';
                            html += '           <div id="divSetBudgetRequestReminderDialog_datepicker"></div>';
                            html += '       </td>';
                            html += '       <td style="vertical-align:top;">';
                            html += '<select style="padding:5px 5px 5px 5px;" id="divSetBudgetRequestReminderDialog_timepicker">';
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
                            html += '       </td>';

                            html += '       <td style="vertical-align:top;">';
                            html += '<select style="padding:5px 5px 5px 5px;" id="divSetBudgetRequestReminderDialog_timepicker_seconds">';
                            for (var s = 0; s < 60; s++) {
                                html += '<option value="' + s + '">' + s + '</option>';
                            }
                            html += '</select>';
                            html += '       </td>';

                            html += '       <td style="vertical-align:top;">';
                            html += '           <div id="divSetBudgetRequestReminderDialog_remindernotes" contenteditable="true" style="WORD-WRAP: break-word; HEIGHT: 180px; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 500px;BACKGROUND-COLOR: white;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;"></div>';
                            html += '       </td>';

                            html += '   </tr>';
                            html += '</table>';

                            html += '        <br />';
                            html += '        <div id="divSetBudgetRequestReminderDialog_SaveReminderButton" class="divDialogButton" onclick="$(\'.bwOneTimeRequestReminders:first\').bwOneTimeRequestReminders(\'setBudgetRequestOneTimeReminder\', \'' + requestId + '\', \'' + title + '\');">';
                            html += '            Save';
                            html += '        </div>';

                            if (results.results && results.results.length && (results.results.length > 0)) {
                                html += '        <br /><br />';
                                html += '        <div class="divDialogButton" onclick="$(\'.bwOneTimeRequestReminders:first\').bwOneTimeRequestReminders(\'deleteBudgetRequestOneTimeReminder\', \'' + requestId + '\', \'' + title + '\');">';
                                html += '           Delete';
                                html += '        </div>';
                            }

                            html += '        <br /><br />';
                            html += '        <div class="divDialogButton" onclick="$(\'#divSetBudgetRequestReminderDialog\').dialog(\'close\');">';
                            html += '           Close';
                            html += '        </div>';
                            html += '        <br /><br />';
                            html += '        <br /><br />';

                            div.innerHTML = html;
                            //}

                            $('#divSetBudgetRequestReminderDialog').dialog({
                                modal: true,
                                resizable: false,
                                closeText: "Cancel",
                                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                                width: "1000", //"570px",
                                dialogClass: "no-close", // No close button in the upper right corner.
                                hide: false, // This means when hiding just disappear with no effects.
                                open: function () {
                                    try {
                                        $('.ui-widget-overlay').bind('click', function () {
                                            $("#divSetBudgetRequestReminderDialog").dialog('close');
                                        });

                                        $('#divSetBudgetRequestReminderDialog_datepicker').datepicker();

                                        if (results.results && results.results.length && (results.results.length > 0)) {

                                            //
                                            // We have to set the values here so that the existing reminder values are displayed.
                                            //
                                            debugger;
                                            if (results.results && results.results.length && (results.results.length > 1)) {
                                                displayAlertDialog('Error in bwOneTimeRequestReminders.js.cmdDisplaySetBudgetRequestReminderDialog(). Too many reminder records returned: ' + results.results.length + '. requestId: ' + requestId);
                                            } else {

                                                var tmpDate = new Date(results.results[0].Reminder_DateTime);

                                                // Set the calendar date.
                                                $("#divSetBudgetRequestReminderDialog_datepicker").datepicker("setDate", tmpDate);

                                                // Set the hour drop-down.
                                                var hour = tmpDate.getHours();
                                                $('#divSetBudgetRequestReminderDialog_timepicker').val(hour);

                                                // Set the minutes drop-down.
                                                var minutes = tmpDate.getMinutes();
                                                $('#divSetBudgetRequestReminderDialog_timepicker_seconds').val(minutes);

                                                // Set the Notes.
                                                $('#divSetBudgetRequestReminderDialog_remindernotes').html(results.results[0].ReminderNotes);

                                                // Display the message.
                                                var msg = 'You have a one-time reminder set for this request. You can change it to a new time, or delete this existing one.';
                                                displayAlertDialog(msg);

                                            }

                                        } else {

                                            // Do nothing here. The user can create their reminder.
                                            // Set the values to the current date/time.
                                            var now = new Date();
                                            var tmpDate = new Date(now.getTime() + 5 * 60000); // Added 5 minutes. 

                                            // Set the calendar date.
                                            $("#divSetBudgetRequestReminderDialog_datepicker").datepicker("setDate", tmpDate);

                                            // Set the hour drop-down.
                                            var hour = tmpDate.getHours();
                                            $('#divSetBudgetRequestReminderDialog_timepicker').val(hour);

                                            // Set the minutes drop-down.
                                            var minutes = tmpDate.getMinutes();
                                            $('#divSetBudgetRequestReminderDialog_timepicker_seconds').val(minutes);

                                            // Set the Notes.
                                            $('#divSetBudgetRequestReminderDialog_remindernotes').html('');

                                        }

                                    } catch (e) {
                                        console.log('Exception in bwOneTimeRequestReminders.js.cmdDisplaySetBudgetRequestReminderDialog():3: ' + e.message + ', ' + e.stack);
                                        displayAlertDialog('Exception in bwOneTimeRequestReminders.js.cmdDisplaySetBudgetRequestReminderDialog():3: ' + e.message + ', ' + e.stack);
                                    }
                                }
                            });

                        }

                    } catch (e) {
                        console.log('Exception in bwOneTimeRequestReminders.js.cmdDisplaySetBudgetRequestReminderDialog():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwOneTimeRequestReminders.js.cmdDisplaySetBudgetRequestReminderDialog():2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in bwOneTimeRequestReminders.js.cmdDisplaySetBudgetRequestReminderDialog().setbudgetrequestreminder(): ' + errorMessage);
                }
            });

        } catch (e) {
            console.log('Exception in bwOneTimeRequestReminders.js.cmdDisplaySetBudgetRequestReminderDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwOneTimeRequestReminders.js.cmdDisplaySetBudgetRequestReminderDialog(): ' + e.message + ', ' + e.stack);
        }
    },
    setBudgetRequestOneTimeReminder: function (requestId, title) {
        try {
            console.log('In bwOneTimeRequestReminders.js.setBudgetRequestOneTimeReminder().');
            //alert('In bwOneTimeRequestReminders.js.setBudgetRequestOneTimeReminder(). requestId: ' + requestId + ', title: ' + title);
            var thiz = this;
            //
            // This sets a 1-time reminder for the request to be sent to this participant.
            //

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            var reminderNotes = $('#divSetBudgetRequestReminderDialog_remindernotes').html();

            var strDate = $('#divSetBudgetRequestReminderDialog_datepicker').datepicker().val();
            var date = new Date(strDate);
            var hour = $('#divSetBudgetRequestReminderDialog_timepicker').val();
            var seconds = $('#divSetBudgetRequestReminderDialog_timepicker_seconds').val();

            var year = date.getFullYear().toString();
            var month = date.getMonth().toString();
            var day = date.getDate().toString();
            var reminder = new Date(year, month, day, hour, seconds, 0);

            var now = new Date();

            if (!(reminder > now)) {

                displayAlertDialog('This reminder is set in the past. You must choose a future time for the reminder.');

            } else {

                data = {
                    bwParticipantId_LoggedIn: participantId,
                    bwActiveStateIdentifier: activeStateIdentifier,
                    bwWorkflowAppId_LoggedIn: workflowAppId,

                    bwBudgetRequestId: requestId,
                    bwWorkflowAppId: workflowAppId,
                    bwParticipantId: participantId,
                    bwParticipantEmail: participantEmail,
                    bwParticipantFriendlyName: participantFriendlyName,

                    Title: title,
                    ProjectTitle: '', // Haven't figured out the best way to get this, so just passing it this way for now.
                    ReminderNotes: reminderNotes,
                    Reminder_DateTime: reminder
                };
                var operationUri = webserviceurl + "/bwworkflow/setbudgetrequestreminder";
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

                                var msg = 'Error in setBudgetRequestOneTimeReminder(): ' + results.status + ', ' + results.message;
                                displayAlertDialog(msg);

                            } else {

                                displayAlertDialog('The reminder for this request has been set successfully.');
                                setTimeout(function () {
                                    $('#divAlertDialog').dialog('close'); // Automatically close. The user had enough time to see it.
                                }, 1500);

                                $('#divSetBudgetRequestReminderDialog').dialog('close');

                            }

                        } catch (e) {
                            console.log('Exception in bwOneTimeRequestReminders.js.setBudgetRequestOneTimeReminder():2: ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in bwOneTimeRequestReminders.js.setBudgetRequestOneTimeReminder():2: ' + e.message + ', ' + e.stack);
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        displayAlertDialog('Error in bwOneTimeRequestReminders.js.setBudgetRequestOneTimeReminder().setbudgetrequestreminder(): ' + errorMessage);
                    }
                });

            }

        } catch (e) {
            console.log('Exception in bwOneTimeRequestReminders.js.setBudgetRequestOneTimeReminder(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwOneTimeRequestReminders.js.setBudgetRequestOneTimeReminder(): ' + e.message + ', ' + e.stack);
        }
    },
    deleteBudgetRequestOneTimeReminder: function (requestId, title) {
        try {
            console.log('In bwOneTimeRequestReminders.js.deleteBudgetRequestOneTimeReminder().');
            alert('In bwOneTimeRequestReminders.js.deleteBudgetRequestOneTimeReminder(). requestId: ' + requestId + ', title: ' + title);
            //var thiz = this;
            //
            // This sets a 1-time reminder for the request to be sent to this participant.
            //

            //var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            //var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            //var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            //var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            //var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');


            //var reminder_DateTime = 'xx'; // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            //debugger;

            //var strDate = $('#divSetBudgetRequestReminderDialog_datepicker').datepicker().val();
            //var date = new Date(strDate);
            //var hour = $('#divSetBudgetRequestReminderDialog_timepicker').val();

            //var year = date.getFullYear().toString();
            //var month = date.getMonth().toString();
            //var day = date.getDate().toString();
            //var reminder = new Date(year, month, day, hour, 0, 0);

            //var now = new Date();

            ////var reminderTime = reminder.getTime();
            ////var nowTime = now.getTime();

            ////if (!(reminderTime > nowTime)) {
            //if (!(reminder > now)) {

            //    displayAlertDialog('This reminder is set in the past. You must choose a future time for the reminder.');

            //} else {

            //    data = {
            //        bwParticipantId_LoggedIn: participantId,
            //        bwActiveStateIdentifier: activeStateIdentifier,
            //        bwWorkflowAppId_LoggedIn: workflowAppId,

            //        bwBudgetRequestId: requestId,
            //        bwWorkflowAppId: workflowAppId,
            //        bwParticipantId: participantId,
            //        bwParticipantEmail: participantEmail,
            //        bwParticipantFriendlyName: participantFriendlyName,

            //        Title: title,
            //        ProjectTitle: '', // Haven't figured out the best way to get this, so just passing it this way for now.
            //        Reminder_DateTime: reminder
            //    };
            //    var operationUri = webserviceurl + "/bwworkflow/setbudgetrequestreminder";
            //    $.ajax({
            //        url: operationUri,
            //        type: "POST",
            //        data: data,
            //        headers: {
            //            "Accept": "application/json; odata=verbose"
            //        },
            //        success: function (results) {
            //            try {
            //                if (results.status != 'SUCCESS') {

            //                    var msg = 'Error in deleteBudgetRequestOneTimeReminder(): ' + results.status + ', ' + results.message;
            //                    displayAlertDialog(msg);

            //                } else {

            //                    displayAlertDialog('The reminder for this request has been set successfully.');
            //                    $('#divSetBudgetRequestReminderDialog').dialog('close');

            //                }

            //            } catch (e) {
            //                console.log('Exception in bwOneTimeRequestReminders.js.deleteBudgetRequestOneTimeReminder():2: ' + e.message + ', ' + e.stack);
            //                displayAlertDialog('Exception in bwOneTimeRequestReminders.js.deleteBudgetRequestOneTimeReminder():2: ' + e.message + ', ' + e.stack);
            //            }
            //        },
            //        error: function (data, errorCode, errorMessage) {
            //            displayAlertDialog('Error in bwOneTimeRequestReminders.js.deleteBudgetRequestOneTimeReminder().setbudgetrequestreminder(): ' + errorMessage);
            //        }
            //    });

            //}

        } catch (e) {
            console.log('Exception in bwOneTimeRequestReminders.js.deleteBudgetRequestOneTimeReminder(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwOneTimeRequestReminders.js.deleteBudgetRequestOneTimeReminder(): ' + e.message + ', ' + e.stack);
        }
    }

});