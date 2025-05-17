$.widget("bw.bwDataGrid", {
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
        This is the bwDataGrid.js jQuery Widget. 
        ===========================================================

            This widget displays "All Requests", filtered using an Org picker, a request type picker/drop-down, date selectors, and a search box.
            
            It displays both Executive Summary and Detailed (spreadsheet) views.

            Unlike the Home screen, this widget uses infinate scroll to see all requests.
                - In other words, there is no "next page" selector, you just keep scrolling, and every so often a "Load more requests..." button shows up at the bottom, 
                which you click to continue viewing the requests, until you get to the end, and have viewed all of them.
            
            Click on the ellipses menu for the following functionality:
                - Produce Timeline
                - View the TrashBin

            [more to follow]
                           
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

           [put your stuff here]

        ===========================================================
        
       */

        elementIdSuffix: null, // This is a custom guid which gets appended to element id's, making sure this widget keeps to itself.

        //
        // When we query the database, we get the query values from here. This is kept up to date as the user navigates the application.
        //
        userSelectedFilter: {
            offset: 0, // 0 is the beginning.
            limit: 25, // 25 records/requests at a time. This can be changed as long as performance continues to be Ok.
            sortDataElement: 'Created', // Any of the fields, ie: ['Created', 'Title', 'ProjectTitle', etc.]
            sortOrder: 'ascending', // ['ascending', 'descending']
            trashBin: false, // When this is true, the user is viewing the TrashBin items.
            bwRequestTypeId: null,
            bwOrgId: null,
            startDate: null,
            endDate: null,
            displaySupplementals: true 
        },


         // GET RID OF THIS VALUE IT IS IN A NEW PLACE ABOVE<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        // added 2-8-2022
        bwOrgId: 'root', // The bwOrganizationPicker sets these values.
        bwOrgName: '', // The bwOrganizationPicker sets these values.

        // added 3-7-2022
        BudgetRequests: null, // This is our persistent list of requests.
        Supplementals: null, // This is our persistent list of Supplementals.

        BudgetRequests_Filtered: null, // Using this for storing our filtered requests. When we undo-the filter, we re-populate with this.options.BudgetRequests.

        // added 10-14-2020. 
        pagingLimit: 25, // Only display x items at a time.
        pagingPage: 0, // This is the page that is being displayed. This may be easier to use than offset? It is a zero based value.

        json: null,
        store: null, // This is where we store our OrgRoles data.

        //bwTenantId: null,
        bwWorkflowAppId: null,

        bwEnabledRequestTypes: null, // An array of the following: ['Budget Request', 'Quote Request', 'Reimbursement Request', 'Recurring Expense', 'Capital Plan Project', 'Work Order']
        operationUriPrefix: null,
        ajaxTimeout: 15000,
        quill: null,
        displayWorkflowPicker: false,
        displayRoleIdColumn: false,
        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function (assignmentRowChanged_ElementId) {
        this.element.addClass("bwDataGrid");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {

            selfDiscoverOperationUri(thiz); // This sets this.options.operationUriPrefix correctly.

            var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            this.options.elementIdSuffix = guid;

            console.log('');
            console.log('*********************************************************');
            console.log('In bwDataGrid._create(). The grid has been initialized.');
            console.log('*********************************************************');
            console.log('');

            //
            // The best example of a data grid is here:
            // https://js.devexpress.com/Demos/WidgetsGallery/Demo/DataGrid/Overview/jQuery/Light/
            //

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
            var element = document.querySelector('.' + workflowAppTheme + '_noanimation');
            var style = getComputedStyle(element);
            var color = style.backgroundColor;
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

            //html += '</style>';

            //html += '<style>';
            html += '.dataGridTable { border: 1px solid gainsboro; font-size:14px; font-family: "Helvetica Neue","Segoe UI",Helvetica,Verdana,sans-serif; }';
            html += '.dataGridTable td { border-left: 0px; border-right: 1px solid gainsboro; }';
            html += '.headerRow { background-color:white; color:gray;border-bottom:1px solid gainsboro; }';
            html += '.headerRow td { border-bottom:1px solid gainsboro; padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
            html += '.filterRow td { border-bottom:1px solid whitesmoke; padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
            html += '.alternatingRowLight { background-color:white; }';
            html += '.alternatingRowLight:hover { background-color:lightgoldenrodyellow; }';
            html += '.alternatingRowDark { background-color:whitesmoke; }';
            html += '.alternatingRowDark:hover { background-color:lightgoldenrodyellow; }';
            //html += '</style>';


            //html += '<style>';
            html += '.bwEllipsis { cursor:pointer;padding:6px 4px 0px 4px;border: 1px solid goldenrodyellow;vertical-align:bottom; }';
            html += '';
            html += '.bwEllipsis:hover { color:red;background-color:whitesmoke; }';
            html += '';
            html += '</style>';

            //var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            //var bwEnabledRequestTypes = $('.bwAuthentication').bwAuthentication('option', 'bwEnabledRequestTypes');
            //var workflowAppTitle = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTitle');

            var requestTypes = $('.bwAuthentication').bwAuthentication('option', 'bwEnabledRequestTypes').EnabledItems;

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

            var LastSelected_ArchiveScreen_bwRequestTypeId = $('.bwAuthentication').bwAuthentication('option', 'LastSelected_ArchiveScreen_bwRequestTypeId');
            console.log('LastSelected_ArchiveScreen_bwRequestTypeId: ' + LastSelected_ArchiveScreen_bwRequestTypeId);

            html += '<table style="width:100%;">';
            html += '   <tr>';
            html += '       <td>';
            html += '           <span style="color:black;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 35pt;font-weight:bold;">';
            html += '               View ';
            html += '               <span style="font_weight:bold;color:grey;">';
            html += '                   <select id="selectRequestTypeDropDown" onchange="$(\'.bwDataGrid\').bwDataGrid(\'ArchiveRequestTypeDropDown_Onchange\', this);" class="selectHomePageWorkflowAppDropDown" style=\'display:inline;border-color: whitesmoke; color: grey; font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 1em; font-weight: bold; cursor: pointer;  margin-bottom:15px;\'>'; // was .5em
            html += '                       <option value="" >' + 'All Request Types' + '</option>';
            for (var i = 0; i < requestTypes.length; i++) {
                if (requestTypes[i].bwRequestTypeId == LastSelected_ArchiveScreen_bwRequestTypeId) {
                    html += '                   <option value="' + requestTypes[i].bwRequestTypeId + '" selected="selected" >' + requestTypes[i].PluralName + '</option>';
                } else {
                    html += '                   <option value="' + requestTypes[i].bwRequestTypeId + '" >' + requestTypes[i].PluralName + '</option>';
                }
            }
            html += '                   </select>';
            html += '                   &nbsp;for&nbsp;';
            html += '                   <div style="display:inline-block;" id="divBwDataGrid_OrganizationPicker"></div>'; // inline-block makes sure the widet shows up inline and doesn't wrap.
            html += '               </span>';
            html += '               &nbsp;&nbsp;&nbsp;';
            html += '           </span>';
            html += '       </td>';
            html += '       <td style="text-align:right;">';
            //html += '           <span class="printButton" title="print" onclick="cmdPrintForm();">&#x1f5a8;</span>';



            // search box. This exists elsewhere. Maybe it should be a widget.? 10-11-2022
            // Got rid of this 3-7-2023

            // search box. This exists elsewhere. Maybe it should be a widget.? 10-11-2022
            //html += '<span id="" style="float:right;white-space:nowrap;">';
            //html += '   Search: ';
            //html += '   <span id="searchbox">';
            //html += '       <input type="text" id="inputBwAuthentication_SearchBox" onkeydown="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'searchBox_OnKeyDown\', event);" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />';
            //html += '       &nbsp;&nbsp;';
            //html += '       <span class="emailEditor_newMessageButton" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'search\');">Search</span>';
            //html += '   </span>';
            //html += '</span>';

            html += '<span id="" style="float:right;white-space:nowrap;">';
            html += '   Search: ';
            html += '   <span id="searchbox">';
            html += '       <input type="text" id="inputBwAuthentication_SearchBox" onkeydown="$(\'.bwDataGrid\').bwDataGrid(\'searchBox_OnKeyDown\', event);" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />';
            html += '       &nbsp;&nbsp;';
            html += '       <span class="emailEditor_newMessageButton" onclick="$(\'.bwDataGrid\').bwDataGrid(\'search\');">Search</span>';
            html += '   </span>';
            html += '</span>';







            html += '       </td>';
            html += '   </tr>';
            html += '</table>';

            html += '<table>';
            html += '   <tr>';
            html += '       <td style="vertical-align:top;width:60px;">';

            html += '           <table id="tableDetailedListButton" class="divCarouselButton" style="width:70px;padding: 4px 4px 4px 4px !important;" onclick="$(\'.bwDataGrid\').bwDataGrid(\'displayDetailedList\');">';
            html += '               <tr>';
            html += '                   <td style="white-space:nowrap;">';
            html += '                       <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                           <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                       </div>';
            html += '                   </td>';
            html += '               </tr>';
            html += '               <tr>';
            html += '                   <td style="white-space:nowrap;">';
            html += '                       <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                           <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                       </div>';
            html += '                   </td>';
            html += '               </tr>';
            html += '               <tr>';
            html += '                   <td style="white-space:nowrap;">';
            html += '                       <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                           <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                       </div>';
            html += '                   </td>';
            html += '               </tr>';
            html += '           </table>';

            html += '</td>';
            html += '<td>';

            html += '           <table id="tableExecutiveSummariesButton" class="divCarouselButton" onclick="$(\'.bwDataGrid\').bwDataGrid(\'displayExecutiveSummaries\');">';
            html += '               <tr>';
            html += '                   <td>';
            html += '                       <div class="divCarouselButton_SmallButton"></div>';
            html += '                   </td>';
            html += '                   <td>';
            html += '                       <div class="divCarouselButton_SmallButton"></div>';
            html += '                   </td>';
            html += '                   <td>';
            html += '                       <div class="divCarouselButton_SmallButton"></div>';
            html += '                   </td>';
            html += '               </tr>';
            html += '               <tr>';
            html += '                   <td>';
            html += '                       <div class="divCarouselButton_SmallButton"></div>';
            html += '                   </td>';
            html += '                   <td>';
            html += '                       <div class="divCarouselButton_SmallButton"></div>';
            html += '                   </td>';
            html += '                   <td>';
            html += '                       <div class="divCarouselButton_SmallButton"></div>';
            html += '                   </td>';
            html += '               </tr>';
            html += '           </table>';

            html += '</td>';


            //html += '<td>';

            //html += '   Fiscal year:&nbsp;';
            //html += '   <select style="padding:5px 5px 5px 5px;" id="ddlYear" onchange="$(\'.bwDataGrid\').bwDataGrid(\'fiscalYearSelection_OnChange\', this.id);"></select>';

            //html += '</td>';


            html += '<td>';
            html += '           <div id="divBwStartDatePicker" style="display:inline-block;"></div>';
            html += '</td>';
            html += '<td>';
            html += '           <div id="divBwEndDatePicker" style="display:inline-block;"></div>';
            html += '</td>';

            html += '<td>';


            var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');
            //if (developerModeEnabled) {
            //
            // This is our ellipsis context menu.
            html += '<style>';
            html += '.bwEllipsis { cursor:pointer;padding:6px 4px 0px 4px;border: 1px solid goldenrodyellow;vertical-align:bottom; }';
            html += '';
            html += '.bwEllipsis:hover { color:red;background-color:whitesmoke; }';
            html += '';
            html += '</style>';
            html += '&nbsp;';
            html += '<span id="spanArchiveAdditionalOptionsEllipsis" style="font-size:18pt;" class="bwEllipsis context-menu-one btn btn-neutral" title="View additional options...">';
            html += '...'; // AP format 
            //html += '. . .'; // Chicago format
            //html += '⋯'; // Mid-line ellipsis 
            html += '</span>';
            // End: This is our ellipsis context menu.
            //
            //}






            // // Display the "Displaying TrashBin Contents" checkbox and text. This is how the user can turn off the viewing of the TrashBin. 4-17-2023
            html += '<span id="bwDataGrid_DisplayingTrashBinContents_OnOffLink" style="display:none;">';
            html += '   <input type="checkbox" checked="checked" style="cursor:pointer;" onchange="$(\'.bwDataGrid\').bwDataGrid(\'displayingTrashBinContents_Checkbox_OnChange\', this);" />';
            html += '   &nbsp;<span style="color:tomato;font-weight:lighter;">Displaying TrashBin Contents</span>';
            html += '</span>';








            html += '</td>';

            html += '   </tr>';
            html += '</table>';

            //html += '<div id="divBwDataGrid_DocumentCount"></div>';
            //html += '<div id="divBwDataGrid_FilterBar">[divBwDataGrid_FilterBar]</div>';




            //var html = '';

            //var startDocumentCounter = requestsSummaryDetails.offset + 1; // Because it is zero based.
            //var displayTotal = requestsSummaryDetails.page * requestsSummaryDetails.limit;

            //if (displayTotal > requestsSummaryDetails.totalDocs) {
            //    displayTotal = requestsSummaryDetails.totalDocs;
            //}

            // renderExecutiveSummaries_ACTIVE_REQUESTS
            html += '<div xcx="xcx2131215455-1" id="divBwDataGrid_DocumentCount">Displaying ' + 0 + ' to ' + 0 + ' of ' + 0 + ' requests.&nbsp;&nbsp;&nbsp;&nbsp;'; // |<&nbsp;&nbsp;<&nbsp;&nbsp;>&nbsp;&nbsp;>|</div>';

            var limit = thiz.options.userSelectedFilter.limit;
            html += `<span>Requests per page:
                            <select id="selectRequestsPerPage_ACTIVE_REQUESTS" onchange="$(\'.bwDataGrid\').bwDataGrid(\'selectRequestsPerPage\', \'ACTIVE_REQUESTS\', this);">`;

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
            html += `<div class="datasetNavigationButton" onclick="$(\'.bwDataGrid\').bwDataGrid(\'navigateRequests\', \'move_to_start\', this);">|<</div>`;
            html += '&nbsp;&nbsp;';
            html += `<div class="datasetNavigationButton" onclick="$(\'.bwDataGrid\').bwDataGrid(\'navigateRequests\', \'move_to_left\', this);"><</div>`;
            html += '&nbsp;&nbsp;';
            html += `<div class="datasetNavigationButton" onclick="$(\'.bwDataGrid\').bwDataGrid(\'navigateRequests\', \'move_to_right\', this);">></div>`;
            html += '&nbsp;&nbsp;';
            html += `<div class="datasetNavigationButton" onclick="$(\'.bwDataGrid\').bwDataGrid(\'navigateRequests\', \'move_to_end\', this);">>|</div>`;

            var displaySupplementals = thiz.options.userSelectedFilter.displaySupplementals;
            if (displaySupplementals == true) {
                html += '&nbsp;&nbsp;<input type="checkbox" checked="checked" id="bwDataGrid_DisplaySupplementals_Checkbox" onchange="$(\'.bwDataGrid\').bwDataGrid(\'toggleDisplaySupplementals\', this);" />Display Supplementals/Addendums.';
            } else {
                html += '&nbsp;&nbsp;<input type="checkbox" id="bwDataGrid_DisplaySupplementals_Checkbox" onchange="$(\'.bwDataGrid\').bwDataGrid(\'toggleDisplaySupplementals\', this);" />Display Supplementals/Addendums.';
            }

            html += '</div>';

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






            html += '<div id="divBwDataGrid_Content" xcx="xcx4449568"></div>';


            $(this.element).html(html);

            // Set the sort buttons to grayed-out. When one is selected by the user, we will set the opacity to 1.0 as a good visual indicator.
            var buttons = $('.dataGridTable_SortButton');
            for (var i = 0; i < buttons.length; i++) {
                buttons[i].style.opacity = '0.25';
            }

            //
            // Hook to the create event, so that we are ready to call the subsequent action. Do this before we call to the database and render the screen contents.
            //
            console.log('In bwDataGrid.js._create(). Instantiating the bwOrganizationPicker.js widget.');
            $('#divBwDataGrid_OrganizationPicker').bwOrganizationPicker({
                create: function (event, ui) {

                    // The bwOrganizationPicker.js widget has been created. Now get the other ones created before we call to the database and render the screen contents.
                    $(thiz.element).find('#divBwStartDatePicker').bwStartDatePicker({
                        inVisualizations: true,
                        allowRequestModifications: true,
                        create: function (event, ui) {

                            // The bwStartDatePicker.js widget has been created.
                            $(thiz.element).find('#divBwEndDatePicker').bwEndDatePicker({
                                inVisualizations: true,
                                allowRequestModifications: true,
                                create: function (event, ui) {

                                    // The bwEndDatePicker.js widget has been created. Now lets render the rest of the screen.
                                    thiz.renderDetailedListOrExecutiveSummary();

                                }
                            });

                        }
                    });

                }
            });
            //
            // end: Hook to the create event, so that we are ready to call the subsequent action.
            //

            // Populate the year drop down. KEEP THIS IT MAY COME BACK!!!!!!! 4-18-2023.
            //$('.bwCoreComponent').bwCoreComponent('populateTheYearDropdown', 'ddlYear', false);

            //
            // This is our ellipsis context menu. MIT license and code at: https://swisnl.github.io/jQuery-contextMenu/demo/trigger-custom.html
            //
            $.contextMenu({
                selector: '.context-menu-one',
                callback: function (key, options) {
                    if (key == 'viewtrashbincontents') {
                        thiz.displayTrashBinContents();
                    } else if (key == 'producetimeline') {

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

                            $('.bwTimelineAggregator').bwTimelineAggregator('displayDialog');

                        } else {
                            var msg = 'Error: The bwTimelineAggregator.js widget has not been loaded. Inspect the index.html file to make sure it is specified to load. xcx23536.';
                        }

                    } else {
                        var msg = 'Error in bwDataGrid.js._create.contextMenu(). Unexpected value for key: ' + key;
                        console.log(msg);
                        displayAlertDialog(msg);
                    }
                },
                items: {
                    "producetimeline": { name: "Produce Timeline", icon: "" },
                    "viewtrashbincontents": { name: "View Trashbin contents", icon: "fa-trash" }
                }
            });
            $('#spanArchiveAdditionalOptionsEllipsis').on('click', function (e) {
                e.preventDefault();
                var x = e.clientX;
                var y = e.clientY;
                $('.context-menu-one').contextMenu(); //{ x: x, y: y }); // specifying x and y here doesn't work for left click. We need to get the left click position workng at some point but no biggie at this time.
            });
            $('.context-menu-one').on('click', function (e) {
                if (this == 'viewtrashbincontents') {
                    alert('This functionality is incomplete. Coming soon!');
                }
            })
            //
            // End: This is our ellipsis context menu.
            //

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


            //
            // Don't need to do this because the bwOrganizationPicker will call loadDataAndRenderDetailedListOrExecutiveSummary() when it sets it's location. 4-10-2022
            //
            // this.loadDataAndRenderDetailedListOrExecutiveSummary(); 
            //
            //

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwDataGrid: CANNOT RENDER THE GRID</span>';
            html += '<br />';
            html += '<span style="">Exception in bwDataGrid.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwDataGrid")
            .text("");
    },

    navigateRequests: function (navigationInstruction, element) {
        try {
            console.log('In bwDataGrid.js.navigateRequests(). navigationInstruction: ' + navigationInstruction);
            //alert('In bwDataGrid.js.navigateRequests().');
            var thiz = this;


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

            var BudgetRequests = $('.bwAuthentication:first').bwAuthentication('option', 'BudgetRequests');
            var requestsSummaryDetails = BudgetRequests;
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

            $('.bwAuthentication:first').bwAuthentication('getPagedDataFor_BudgetRequests', offset, limit).then(function (results) {
                try {

                    debugger;
                    console.log('Calling bwDataGrid.js.renderDetailedListOrExecutiveSummary(). xcx213884-1-1');
                    thiz.renderDetailedListOrExecutiveSummary(); // thiz.renderExecutiveSummaries_ACTIVE_REQUESTS('xcx213884-1-1');

                } catch (e) {
                    var msg = 'Exception in bwDataGrid.js.navigateRequests.getPagedDataFor_BudgetRequests.then(): ' + e.message + ', ' + e.stack;
                    console.log(msg);
                    displayAlertDialog(msg);
                }
            }).catch(function (e) {
                debugger;
                var msg = 'Exception in bwDataGrid.js.navigateRequests(). Exception calling getPagedDataFor_BudgetRequests(): ' + JSON.stringify(e);
                console.log(msg);
                displayAlertDialog(msg);

            });

        } catch (e) {
            var msg = 'Exception in bwDataGrid.js.navigateRequests(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
        }
    },
    toggleDisplaySupplementals: function (element) {
        try {
            console.log('In bwExecutiveSummariesCarousel2.js.toggleDisplaySupplementals().');
            //alert('In bwExecutiveSummariesCarousel2.js.toggleDisplaySupplementals().');

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
    scrapeToGetSelectedValues: function () {
        var thiz = this;
        return new Promise(function (resolve, reject) {
            try {
                console.log('In bwDataGrid.js.scrapeToGetSelectedValues().');
                //alert('In bwDataGrid.js.scrapeToGetSelectedValues().');

                //
                // We may have to do this in a few places, so it made sense to just do it all here.
                // This function sets the values in this.options.userSelectedFilter, which in turn, is used to perform the query on the database.
                //
                // userSelectedFilter: {
                //   offset: 0, // 0 is the beginning.
                //   limit: 25, // 25 records/requests at a time. This can be changed as long as performance continues to be Ok.
                //   sortDataElement: 'Created', // Any of the fields, ie: ['Created', 'Title', 'ProjectTitle', etc.]
                //   sortOrder: 'ascending', // ['ascending', 'descending']
                //   trashBin: this.options.TrashBin,
                //   bwRequestTypeId: bwRequestTypeId,
                //   bwOrgId: bwOrgId,
                //   startDate: startDate,
                //   endDate: endDate,
                //   displaySupplementals: true // Boolean. // This value is handled in method toggleDisplaySupplementals().
                // }
                //

                var bwRequestTypeId = $('#selectRequestTypeDropDown option:selected').val(); // This is the drop-down at the top of the page.
                thiz.options.userSelectedFilter.bwRequestTypeId = bwRequestTypeId;

                var bwOrgId = $('#divPageContent1').find('.bwOrganizationPicker').bwOrganizationPicker('option', 'bwOrgId');
                thiz.options.userSelectedFilter.bwOrgId = bwOrgId;

                var startDate = $('#divPageContent1').find('.bwStartDatePicker').bwStartDatePicker('getData').toUTCString();
                thiz.options.userSelectedFilter.startDate = startDate;

                var endDate = $('#divPageContent1').find('.bwEndDatePicker').bwEndDatePicker('getData').toUTCString();
                thiz.options.userSelectedFilter.endDate = endDate;

                var result = {
                    status: 'SUCCESS',
                    message: 'Values have been set in this.options.userSelectedFilter.'
                }

                resolve(result);

            } catch (e) {
                var msg = 'Exception in bwDataGrid.js.scrapeToGetSelectedValues(): ' + e.message + ', ' + e.stack;
                console.log(msg);
                displayAlertDialog(msg);

                var result = {
                    status: 'EXCEPTION',
                    message: msg
                }
                resolve(result);

            }

        });

    },
    renderDetailedListOrExecutiveSummary: function (source) { 
        try {
            console.log('In bwDataGrid.js.renderDetailedListOrExecutiveSummary(). source: ' + source);
            //alert('In bwDataGrid.js.renderDetailedListOrExecutiveSummary(). source: ' + source);
            var thiz = this;

            this.scrapeToGetSelectedValues().then(function (results) {
                try {
                    var bwDisplayFormat = localStorage.getItem('bwDisplayFormat');

                    if (bwDisplayFormat == 'ExecutiveSummaries') {

                        var x = thiz.options.userSelectedFilter;
                        $('.bwAuthentication:first').bwAuthentication('getPagedDataFor_BudgetRequests', x.offset, x.limit, x.sortDataElement, x.sortOrder, x.trashBin, x.bwRequestTypeId, x.bwOrgId, x.startDate, x.endDate, x.displaySupplementals).then(function (results) {

                            thiz.displayExecutiveSummaries();

                        }).catch(function (e) {
                            var msg = 'Exception in bwDataGrid.js.renderDetailedListOrExecutiveSummary(). Exception calling getPagedDataFor_BudgetRequests():xcx334: ' + JSON.stringify(e);
                            console.log(msg);
                            DisplayAlertDialog(msg);
                        });

                    } else if (bwDisplayFormat == 'DetailedList') {

                        var x = thiz.options.userSelectedFilter;
                        $('.bwAuthentication:first').bwAuthentication('getPagedDataFor_BudgetRequests', x.offset, x.limit, x.sortDataElement, x.sortOrder, x.trashBin, x.bwRequestTypeId, x.bwOrgId, x.startDate, x.endDate, x.displaySupplementals).then(function (results) {

                            thiz.displayDetailedList();

                        }).catch(function (e) {
                            var msg = 'Exception in bwDataGrid.js.renderDetailedListOrExecutiveSummary(). Exception calling getPagedDataFor_BudgetRequests():xcx334-2: ' + JSON.stringify(e);
                            console.log(msg);
                            DisplayAlertDialog(msg);
                        });

                    } else {

                        var msg = 'Error in bwDataGrid.js.renderDetailedListOrExecutiveSummary(). No method currently exists. Unexpected value for bwDisplayFormat: ' + bwDisplayFormat;
                        console.log(msg);
                        displayAlertDialog(msg);

                    }

                } catch (e) {
                    var msg = 'Exception in bwDataGrid.js.renderDetailedListOrExecutiveSummary():3: ' + e.message + ', ' + e.stack;
                    console.log(msg);
                    displayAlertDialog(msg);
                }

            }).catch(function (e) {
                var msg = 'Exception in bwDataGrid.js.renderDetailedListOrExecutiveSummary():2: ' + JSON.stringify(e);
                console.log(msg);
                displayAlertDialog(msg);
            });

            ////var offset = 0;
            ////var limit = 25;

            ////// Set the sort buttons to grayed-out. When one is selected by the user, we will set the opacity to 1.0 as a good visual indicator.
            ////var buttons = $('.dataGridTable_SortButton');
            ////for (var i = 0; i < buttons.length; i++) {
            ////    buttons[i].style.opacity = '0.25';
            ////}

            ////var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            ////var bwRequestTypeId = $('#selectRequestTypeDropDown option:selected').val(); // This is the drop-down at the top of the page.

            ////// These values will have been set already by the bwOrganizationPicker.js widget.
            ////var bwOrgId = $('#divPageContent1').find('.bwOrganizationPicker').bwOrganizationPicker('option', 'bwOrgId');
            ////var bwOrgName = $('#divPageContent1').find('.bwOrganizationPicker').bwOrganizationPicker('option', 'bwOrgName');
            ////debugger;
            ////var startDate = $('#divPageContent1').find('.bwStartDatePicker').bwStartDatePicker('getData').toUTCString();
            ////var endDate = $('#divPageContent1').find('.bwEndDatePicker').bwEndDatePicker('getData').toUTCString();

            //////this.options.pagingLimit = 15; // Only display x items at a time.
            //////this.options.pagingPage = 0; // This is the page that is being displayed. This may be easier to use than offset? It is a zero based value.

            ////var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            ////var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');
            //debugger;
            //var requestsSummaryDetails = $('.bwAuthentication').bwAuthentication('option', 'BudgetRequests'); //thiz.options.BudgetRequests;
            //var requests = requestsSummaryDetails.docs;

            ////$(accordionDrawerElement).html('');

            ////
            //// HERE IS WHERE WE SORT THE ACTIVE_REQUESTS. // thiz.options.userSelectedFilter // NEWEST, OLDEST.
            ////
            //console.log('HERE IS WHERE WE SORT THE ACTIVE_REQUESTS by Created date. xcx21321312.'); // requests[0].Created: ' + JSON.stringify(requests[0].Created + ', userSelectedFilter: ' + thiz.options.userSelectedFilter));

            //var sortDataElement = this.options.userSelectedFilter.sortDataElement;
            //if (this.options.userSelectedFilter.sortOrder == 'ascending') { // Created ascending.
            //    requests.sort(function (a, b) {
            //        if (a[sortDataElement] < b[sortDataElement]) { return 1; }
            //        if (a[sortDataElement] > b[sortDataElement]) { return -1; }
            //        return 0;
            //    });
            //} else if (this.options.userSelectedFilter.sortOrder == 'descending') { // Created descending.
            //    requests.sort(function (a, b) {
            //        if (a[sortDataElement] < b[sortDataElement]) { return -1; }
            //        if (a[sortDataElement] > b[sortDataElement]) { return 1; }
            //        return 0;
            //    });
            //} else {
            //    console.log('Unexpected value for userSelectedFilter.sortOrder: ' + this.options.userSelectedFilter.sortOrder);
            //    displayAlertDialog('Unexpected value for userSelectedFilter.sortOrder: ' + this.options.userSelectedFilter.sortOrder);
            //}


            ////
            ////
            //// Adding new paging status, sort bar, and paging UI.
            ////
            ////

            //console.log('xcx2131231. requestsSummaryDetails: ' + Object.keys(requestsSummaryDetails)); // docs,totalDocs,offset,limit,totalPages,page,pagingCounter,hasPrevPage,hasNextPage,prevPage,nextPage.

            //var msg = 'requestsSummaryDetails. totalDocs: ' + requestsSummaryDetails.totalDocs + ', offset: ' + requestsSummaryDetails.offset + ', limit: ' + requestsSummaryDetails.limit + ', totalPages: ' + requestsSummaryDetails.totalPages + ', page: ' + requestsSummaryDetails.page + ', pagingCounter: ' + requestsSummaryDetails.pagingCounter + ', hasPrevPage: ' + requestsSummaryDetails.hasPrevPage + ', hasNextPage: ' + requestsSummaryDetails.hasNextPage + ', prevPage: ' + requestsSummaryDetails.prevPage + ', nextPage: ' + requestsSummaryDetails.nextPage;
            //console.log(msg);
            ////displayAlertDialog(msg);

            //var html = '';

            //var startDocumentCounter = requestsSummaryDetails.offset + 1; // Because it is zero based.
            //var displayTotal = requestsSummaryDetails.page * requestsSummaryDetails.limit;

            //if (displayTotal > requestsSummaryDetails.totalDocs) {
            //    displayTotal = requestsSummaryDetails.totalDocs;
            //}

            //// renderExecutiveSummaries_ACTIVE_REQUESTS
            //html += '<div xcx="xcx2131215455-1" id="divBwDataGrid_DocumentCount">Displaying ' + startDocumentCounter + ' to ' + displayTotal + ' of ' + requestsSummaryDetails.totalDocs + ' requests.&nbsp;&nbsp;&nbsp;&nbsp;'; // |<&nbsp;&nbsp;<&nbsp;&nbsp;>&nbsp;&nbsp;>|</div>';

            //var limit = thiz.options.userSelectedFilter.limit;
            //html += `<span>Requests per page: 
            //                <select id="selectRequestsPerPage_ACTIVE_REQUESTS" onchange="$(\'.bwDataGrid\').bwDataGrid(\'selectRequestsPerPage\', \'ACTIVE_REQUESTS\', this);">`;

            //if (limit == 25) {
            //    html += '<option selected="selected">25</option>';
            //} else {
            //    html += '<option>25</option>';
            //}
            //if (limit == 50) {
            //    html += '<option selected="selected">50</option>';
            //} else {
            //    html += '<option>50</option>';
            //}
            //if (limit == 100) {
            //    html += '<option selected="selected">100</option>';
            //} else {
            //    html += '<option>100</option>';
            //}
            //if (limit == 200) {
            //    html += '<option selected="selected">200</option>';
            //} else {
            //    html += '<option>200</option>';
            //}

            //html += `   </select>
            //            </span>`;
            //html += '&nbsp;&nbsp;';
            //html += `<div class="datasetNavigationButton" onclick="$(\'.bwDataGrid\').bwDataGrid(\'navigateRequests\', \'move_to_start\', this);">|<</div>`;
            //html += '&nbsp;&nbsp;';
            //html += `<div class="datasetNavigationButton" onclick="$(\'.bwDataGrid\').bwDataGrid(\'navigateRequests\', \'move_to_left\', this);"><</div>`;
            //html += '&nbsp;&nbsp;';
            //html += `<div class="datasetNavigationButton" onclick="$(\'.bwDataGrid\').bwDataGrid(\'navigateRequests\', \'move_to_right\', this);">></div>`;
            //html += '&nbsp;&nbsp;';
            //html += `<div class="datasetNavigationButton" onclick="$(\'.bwDataGrid\').bwDataGrid(\'navigateRequests\', \'move_to_end\', this);">>|</div>`;

            //var displaySupplementals = thiz.options.userSelectedFilter.displaySupplementals;
            //if (displaySupplementals == true) {
            //    html += '&nbsp;&nbsp;<input type="checkbox" checked="checked" id="bwDataGrid_DisplaySupplementals_Checkbox" onchange="$(\'.bwDataGrid\').bwDataGrid(\'toggleDisplaySupplementals\', this);" />Display Supplementals/Addendums.';
            //} else {
            //    html += '&nbsp;&nbsp;<input type="checkbox" id="bwDataGrid_DisplaySupplementals_Checkbox" onchange="$(\'.bwDataGrid\').bwDataGrid(\'toggleDisplaySupplementals\', this);" />Display Supplementals/Addendums.';
            //}

            //html += '</div>';

            //html += '<div id="divBwDataGrid_FilterBar">';
            //html += '<table id="dataGridTable2" class="dataGridTable" bwworkflowappid="' + workflowAppId + '" >';

            //html += '  <tr class="headerRow">';
            //html += '    <td></td>';

            //// "Title" column header.
            //html += '    <td style="white-space:nowrap;">';
            //html += '       <div style="vertical-align:middle;display:inline-block;">Title&nbsp;</div>';
            //html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'Title\', \'descending\', this);">';
            //html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
            //html += '       </span>';
            //html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'Title\', \'ascending\', this);">';
            //html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
            //html += '       </span>';
            //html += '   </td>';

            //// "Description" column header.
            //html += '    <td style="white-space:nowrap;">';
            //html += '       <div style="vertical-align:middle;display:inline-block;">Description&nbsp;</div>';
            //html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'ProjectTitle\', \'descending\', this);">';
            //html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
            //html += '       </span>';
            //html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'ProjectTitle\', \'ascending\', this);">';
            //html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
            //html += '       </span>';
            //html += '   </td>';

            //// "Current Owner(s)" column header. 
            //html += '    <td style="white-space:nowrap;">';
            //html += '       <div style="vertical-align:middle;display:inline-block;">Current Owner(s)&nbsp;</div>';
            //html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'CurrentOwner\', \'descending\', this);">';
            //html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
            //html += '       </span>';
            //html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'CurrentOwner\', \'ascending\', this);">';
            //html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
            //html += '       </span>';
            //html += '   </td>';

            //// "Created Date" column header.
            //html += '    <td style="white-space:nowrap;">';
            //html += '       <div style="vertical-align:middle;display:inline-block;">Created Date&nbsp;</div>';
            //html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'Created\', \'descending\', this);">';
            //html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
            //html += '       </span>';
            //html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'Created\', \'ascending\', this);">';
            //html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
            //html += '       </span>';
            //html += '   </td>';

            //// "Location" column header.
            //html += '   <td style="white-space:nowrap;">';
            //html += '       <div style="vertical-align:middle;display:inline-block;">Location&nbsp;</div>';
            //html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'OrgName\', \'ascending\', this);">';
            //html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
            //html += '       </span>';
            //html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'OrgName\', \'ascending\', this);">';
            //html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
            //html += '       </span>';
            //html += '   </td>';

            //// "Capital Cost" column header. 
            //html += '    <td style="white-space:nowrap;">';
            //html += '       <div style="vertical-align:middle;display:inline-block;">Capital Cost&nbsp;</div>';
            //html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'RequestedCapital\', \'descending\', this);">';
            //html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
            //html += '       </span>';
            //html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'RequestedCapital\', \'ascending\', this);">';
            //html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
            //html += '       </span>';
            //html += '   </td>';

            //// "Modified Date" column header. 
            //html += '    <td style="white-space:nowrap;">';
            //html += '       <div style="vertical-align:middle;display:inline-block;">Modified Date&nbsp;</div>';
            //html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'Modified\', \'descending\', this);">';
            //html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
            //html += '       </span>';
            //html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'Modified\', \'ascending\', this);">';
            //html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
            //html += '       </span>';
            //html += '   </td>';

            //html += '    <td></td>';
            //html += '  </tr>';

            //html += '</table>';

            //html += '</div>';

            //$('#divBwDataGrid_FilterBar').html(html);

            ////
            ////
            //// end: Adding new paging status, sort bar, and paging UI.
            ////
            ////


            //var RolesAndParticipants_BackfillArray = []; // We populate this in the loop below, ensuring we don't get any duplicates. Subsequently we make a web service call and get everything we need back at 1 time.
            //var thisOneIsAlreadyInTheArray;

            //var carouselItemIndex = 0;

            //for (var i = 0; i < requests.length; i++) {

            //    if ((displaySupplementals != true) && (requests[i].IsSupplementalRequest == true)) {

            //        // Do nothing. We aren't displaying supplementals.

            //    } else {

            //        if (carouselItemIndex < 100) { // This is where we set how many tasks we will display in the carousel. Zero-based, so < 5 means display 5 tasks.

            //            // Now we create the Executive Summary and add it to the DOM.
            //            var ProjectTitle_clean = '';
            //            try {
            //                ProjectTitle_clean = bwEncodeURIComponent(String(requests[i].ProjectTitle).replaceAll('"', '&quot;').replaceAll(/[']/g, '\\&#39;').replaceAll('<', '').replaceAll('>', '').replaceAll('/', '')); //&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method.
            //            } catch (e) { }

            //            var title = 'Executive Summary for: ' + requests[i].Title + '. ' + ProjectTitle_clean;

            //            var executiveSummaryElement = document.createElement('div');
            //            executiveSummaryElement.classList.add('executiveSummaryInCarousel');
            //            executiveSummaryElement.setAttribute('bwbudgetrequestid', requests[i].bwBudgetRequestId);
            //            executiveSummaryElement.title = title;
            //            executiveSummaryElement.alt = title;
            //            executiveSummaryElement.style.minWidth = '300px';
            //            executiveSummaryElement.style.maxWidth = '550px';
            //            executiveSummaryElement.style.display = 'inline-block';
            //            executiveSummaryElement.style.whiteSpace = 'nowrap';
            //            executiveSummaryElement.style.color = 'rgb(38, 38, 38)';
            //            executiveSummaryElement.style.fontFamily = '"Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif';
            //            executiveSummaryElement.style.fontSize = '1.25em';

            //            executiveSummaryElement.setAttribute('onclick', '$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'' + requests[i].bwBudgetRequestId + '\', \'' + requests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + requests[i].Title + '\', \'' + requests[i].bwAssignedToRaciRoleAbbreviation + '\', \'' + '7777xcx7777777-324-2-4' + '\');');

            //            $(accordionDrawerElement).append(executiveSummaryElement);

            //            requests[i]["executiveSummaryElement"] = executiveSummaryElement; // We do this so we can easily find the executive summary element again when backfilling.

            //            console.log('Calling renderExecutiveSummaryForRequest(). xcx332-6-4');
            //            //alert('Calling renderExecutiveSummaryForRequest(). xcx332-6-4');
            //            var promise = this.renderExecutiveSummaryForRequest(requests[i], executiveSummaryElement);
            //            promise.then(function (result) {
            //                // Do nothing.
            //            }).catch(function (e) {
            //                var msg = 'Exception xcx33995-2-2-14: ' + JSON.stringify(e);
            //                console.log(msg);
            //                displayAlertDialog(msg);
            //            });


            //            //
            //            // Here is where we check if we should add an item to the RolesAndParticipants_BackfillArray.
            //            //
            //            thisOneIsAlreadyInTheArray = false;
            //            for (var j = 0; j < RolesAndParticipants_BackfillArray.length; j++) {
            //                if (requests[i].OrgId == RolesAndParticipants_BackfillArray[j].OrgId) {
            //                    if (requests[i].bwRequestTypeId == RolesAndParticipants_BackfillArray[j].bwRequestTypeId) {
            //                        thisOneIsAlreadyInTheArray = true;
            //                    }
            //                }
            //            }
            //            if (thisOneIsAlreadyInTheArray != true) {
            //                // Add it to the array.
            //                var RolesAndParticipants_ArrayItem = {
            //                    OrgId: requests[i].OrgId,
            //                    bwRequestTypeId: requests[i].bwRequestTypeId
            //                }
            //                RolesAndParticipants_BackfillArray.push(RolesAndParticipants_ArrayItem);
            //            }
            //            //
            //            // end: Here is where we check if we should add an item to the RolesAndParticipants_BackfillArray.
            //            //


            //            carouselItemIndex += 1;

            //        } else {
            //            break;
            //        }
            //    }
            //}





            ////
            ////
            //// 2-19-2024. IS THIS THE BEST PLACE TO BACKFILL THE EXECUTIVE SUMMARRIES? xcx1231421-5
            ////
            //// var RolesAndParticipants_BackfillArray = [];
            ////
            //// var RolesAndParticipants_ArrayItem = {
            ////     OrgId: xx,
            ////     bwRequestTypeId: xx
            //// }

            //console.log('2-19-2024. IS THIS THE BEST PLACE TO BACKFILL THE EXECUTIVE SUMMARRIES? xcx1231421-5');

            ////
            ////
            //// DO THE BACKFILL HERE. Call the webservice: /odata/racirolesandparticipants_arrayversion << Created this webservice specifically for this, but maybe can merge with the /odata/racirolesandparticipants at some point...
            ////
            ////
            //var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            //var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            //var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            //var data = {
            //    bwParticipantId_LoggedIn: participantId,
            //    bwActiveStateIdentifier: activeStateIdentifier,
            //    bwWorkflowAppId_LoggedIn: workflowAppId,

            //    bwWorkflowAppId: workflowAppId,
            //    RolesAndParticipants_BackfillArray: JSON.stringify(RolesAndParticipants_BackfillArray)
            //};

            //var operationUri = this.options.operationUriPrefix + '_bw/racirolesandparticipants_arrayversion';
            //$.ajax({
            //    url: operationUri,
            //    type: 'POST',
            //    data: data,
            //    headers: { "Accept": "application/json; odata=verbose" },
            //    success: function (results) {
            //        try {

            //            if (results.status != 'SUCCESS') {

            //                var msg = 'Error in bwDataGrid.js.renderDetailedListOrExecutiveSummary(). ' + results.status + ', ' + results.message;
            //                console.log(msg);
            //                displayAlertDialog(msg);

            //            } else {

            //                var RolesAndParticipants_BackfillArray2 = results.RolesAndParticipants_BackfillArray;

            //                var weFoundTheWorkflowStep;
            //                //var workflowUsersAndRolesArrayForDisplay;

            //                for (var i = 0; i < requests.length; i++) {
            //                    if (carouselItemIndex < 100) { // This is where we set how many tasks we will display in the carousel. Zero-based, so < 5 means display 5 tasks.

            //                        for (var j = 0; j < RolesAndParticipants_BackfillArray2.length; j++) {
            //                            if (requests[i].OrgId == RolesAndParticipants_BackfillArray2[j].OrgId) {
            //                                if (requests[i].bwRequestTypeId == RolesAndParticipants_BackfillArray2[j].bwRequestTypeId) {

            //                                    //
            //                                    //
            //                                    // AT THIS POINT WE HAVE ENOUGH INFORMATION TO FIND OUT WHO THE participants are who are currently participating in the workflow.
            //                                    //
            //                                    //

            //                                    var budgetWorkflowStatus = requests[i].BudgetWorkflowStatus;

            //                                    var workflow = JSON.parse(RolesAndParticipants_BackfillArray2[j].Workflow.bwWorkflowJson);
            //                                    var RolesAndParticipants = RolesAndParticipants_BackfillArray2[j].RolesAndParticipants[0];

            //                                    weFoundTheWorkflowStep = false;
            //                                    var stepIndex1;
            //                                    //workflowUsersAndRolesArrayForDisplay = {
            //                                    //    Approvers: [],
            //                                    //    Collaborators: [],
            //                                    //    Informed: []
            //                                    //}
            //                                    for (var k = 0; k < workflow.Steps.Step.length; k++) {

            //                                        //if (workflow.Steps.Step[k]["@Name"] == budgetWorkflowStatus) {

            //                                        var workflowUsersAndRolesArrayForDisplay = {
            //                                            Approvers: [],
            //                                            Collaborators: [],
            //                                            Informed: []
            //                                        }

            //                                        // We have found the step.
            //                                        weFoundTheWorkflowStep = true;
            //                                        stepIndex1 = k;

            //                                        if (workflow.Steps.Step[k].Assign && workflow.Steps.Step[k].Assign.length) {

            //                                            for (var l = 0; l < workflow.Steps.Step[k].Assign.length; l++) {

            //                                                if (workflow.Steps.Step[k].Assign[l]["@RoleCategory"] == 'Approver') {

            //                                                    var weFoundARoleAssignment = false;
            //                                                    for (var m = 0; m < RolesAndParticipants.Roles.length; m++) {
            //                                                        if (workflow.Steps.Step[k].Assign[l]["@Role"] == RolesAndParticipants.Roles[m].RoleId) {

            //                                                            // We found the role and participant.
            //                                                            weFoundARoleAssignment = true;

            //                                                            var x1 = {
            //                                                                RoleId: workflow.Steps.Step[k].Assign[l]["@Role"],
            //                                                                ParticipantId: RolesAndParticipants.Roles[m].ParticipantId,
            //                                                                ParticipantFriendlyName: RolesAndParticipants.Roles[m].ParticipantFriendlyName,
            //                                                                ParticipantEmail: RolesAndParticipants.Roles[m].ParticipantEmail
            //                                                            }

            //                                                            workflowUsersAndRolesArrayForDisplay.Approvers.push(x1);

            //                                                        }
            //                                                    }

            //                                                    if (weFoundARoleAssignment != true) {

            //                                                        var x1 = {
            //                                                            RoleId: workflow.Steps.Step[k].Assign[l]["@Role"],
            //                                                            ParticipantFriendlyName: '[no role assignment]'
            //                                                        }

            //                                                        workflowUsersAndRolesArrayForDisplay.Approvers.push(x1);

            //                                                    }

            //                                                } else if (workflow.Steps.Step[k].Assign[l]["@RoleCategory"] == 'Collaborator') {

            //                                                    var weFoundARoleAssignment = false;
            //                                                    for (var m = 0; m < RolesAndParticipants.Roles.length; m++) {
            //                                                        if (workflow.Steps.Step[k].Assign[l]["@Role"] == RolesAndParticipants.Roles[m].RoleId) {

            //                                                            // We found the role and participant.
            //                                                            weFoundARoleAssignment = true;

            //                                                            var x1 = {
            //                                                                RoleId: workflow.Steps.Step[k].Assign[l]["@Role"],
            //                                                                ParticipantId: RolesAndParticipants.Roles[m].ParticipantId,
            //                                                                ParticipantFriendlyName: RolesAndParticipants.Roles[m].ParticipantFriendlyName,
            //                                                                ParticipantEmail: RolesAndParticipants.Roles[m].ParticipantEmail
            //                                                            }

            //                                                            workflowUsersAndRolesArrayForDisplay.Collaborators.push(x1);

            //                                                        }

            //                                                    }

            //                                                    if (weFoundARoleAssignment != true) {

            //                                                        var x1 = {
            //                                                            RoleId: workflow.Steps.Step[k].Assign[l]["@Role"],
            //                                                            ParticipantFriendlyName: '[no role assignment]'
            //                                                        }

            //                                                        workflowUsersAndRolesArrayForDisplay.Collaborators.push(x1);

            //                                                    }

            //                                                } else if (workflow.Steps.Step[k].Assign[l]["@RoleCategory"] == 'Inform') {

            //                                                    var weFoundARoleAssignment = false;
            //                                                    for (var m = 0; m < RolesAndParticipants.Roles.length; m++) {
            //                                                        if (workflow.Steps.Step[k].Assign[l]["@Role"] == RolesAndParticipants.Roles[m].RoleId) {

            //                                                            // We found the role and participant.
            //                                                            weFoundARoleAssignment = true;

            //                                                            var x1 = {
            //                                                                RoleId: workflow.Steps.Step[k].Assign[l]["@Role"],
            //                                                                ParticipantId: RolesAndParticipants.Roles[m].ParticipantId,
            //                                                                ParticipantFriendlyName: RolesAndParticipants.Roles[m].ParticipantFriendlyName,
            //                                                                ParticipantEmail: RolesAndParticipants.Roles[m].ParticipantEmail
            //                                                            }

            //                                                            workflowUsersAndRolesArrayForDisplay.Informed.push(x1);

            //                                                        }

            //                                                    }

            //                                                    if (weFoundARoleAssignment != true) {

            //                                                        var x1 = {
            //                                                            RoleId: workflow.Steps.Step[k].Assign[l]["@Role"],
            //                                                            ParticipantFriendlyName: '[no role assignment]'
            //                                                        }

            //                                                        workflowUsersAndRolesArrayForDisplay.Informed.push(x1);

            //                                                    }

            //                                                } else {

            //                                                    alert('xcx34324 ERROR FINDING RoleCategory. Unexpected value: ' + workflow.Steps.Step[k].Assign[l]["@RoleCategory"]);

            //                                                }

            //                                            }





            //                                            // Then we populate this way:
            //                                            //var html = 'Current owner(s): xcxcurrentowners';
            //                                            //$(requests[i].executiveSummaryElement).find('.current_owners').html(html);


            //                                            // Render the Approvers.
            //                                            if (workflowUsersAndRolesArrayForDisplay.Approvers.length && (workflowUsersAndRolesArrayForDisplay.Approvers.length > 0)) {

            //                                                html = 'Approver(s):<br />';
            //                                                for (var p = 0; p < workflowUsersAndRolesArrayForDisplay.Approvers.length; p++) {
            //                                                    if (p > 0) {
            //                                                        html += '<br />';
            //                                                    }
            //                                                    html += '<span style="color:orange;font-weight:bold;" title="xcx123425346264-1">' + workflowUsersAndRolesArrayForDisplay.Approvers[p].ParticipantFriendlyName + ' (' + workflowUsersAndRolesArrayForDisplay.Approvers[p].RoleId + ')</span>';
            //                                                }
            //                                                var className1 = '.approvers_' + workflow.Steps.Step[k]["@Name"];
            //                                                $(requests[i].executiveSummaryElement).find(className1).html(html);

            //                                            }

            //                                            // Render the Collaborators.
            //                                            if (workflowUsersAndRolesArrayForDisplay.Collaborators.length && (workflowUsersAndRolesArrayForDisplay.Collaborators.length > 0)) {
            //                                                html = 'Collaborator(s):<br />';
            //                                                for (var p = 0; p < workflowUsersAndRolesArrayForDisplay.Collaborators.length; p++) {
            //                                                    if (p > 0) {
            //                                                        html += '<br />';
            //                                                    }
            //                                                    html += '<span style="color:orange;font-weight:bold;" title="xcx123425346264-2">' + workflowUsersAndRolesArrayForDisplay.Collaborators[p].ParticipantFriendlyName + ' (' + workflowUsersAndRolesArrayForDisplay.Collaborators[p].RoleId + ')</span>';
            //                                                }
            //                                                var className2 = '.collaborators_' + workflow.Steps.Step[k]["@Name"];
            //                                                $(requests[i].executiveSummaryElement).find(className2).html(html);
            //                                            }

            //                                            // Render the Informed.
            //                                            if (workflowUsersAndRolesArrayForDisplay.Informed.length && (workflowUsersAndRolesArrayForDisplay.Informed.length > 0)) {
            //                                                html = 'Informed:<br />';
            //                                                for (var p = 0; p < workflowUsersAndRolesArrayForDisplay.Informed.length; p++) {
            //                                                    if (p > 0) {
            //                                                        html += '<br />';
            //                                                    }
            //                                                    html += '<span style="color:orange;font-weight:bold;" title="xcx123425346264-2">' + workflowUsersAndRolesArrayForDisplay.Informed[p].ParticipantFriendlyName + ' (' + workflowUsersAndRolesArrayForDisplay.Informed[p].RoleId + ')</span>';
            //                                                }
            //                                                var className2 = '.informed_' + workflow.Steps.Step[k]["@Name"];
            //                                                $(requests[i].executiveSummaryElement).find(className2).html(html);
            //                                            }

            //                                            // Render the user images.
            //                                            var imageHtml = '';
            //                                            var participantArray1 = [];
            //                                            for (var p = 0; p < workflowUsersAndRolesArrayForDisplay.Approvers.length; p++) {

            //                                                if (workflowUsersAndRolesArrayForDisplay.Approvers[p].ParticipantId && !(participantArray1.indexOf(workflowUsersAndRolesArrayForDisplay.Approvers[p].ParticipantId) > -1)) {

            //                                                    var userIdString = workflowUsersAndRolesArrayForDisplay.Approvers[p].ParticipantFriendlyName + ' [' + workflowUsersAndRolesArrayForDisplay.Approvers[p].ParticipantEmail + ']';

            //                                                    var imgUrl = 'https://shareandcollaborate.com/_files/' + workflowAppId + '/participantimages/' + workflowUsersAndRolesArrayForDisplay.Approvers[p].ParticipantId + '/userimage_50x50px.png?ActiveStateIdentifier=' + JSON.parse(activeStateIdentifier).ActiveStateIdentifier;
            //                                                    imageHtml += '<img src="' + imgUrl + '" style="width:75px;" title="' + userIdString + '" alt="' + userIdString + '" onclick="$(\'.bwCircleDialog2\').bwCircleDialog2(\'displayParticipantRoleMultiPickerInACircle\', true, \'\', \'' + workflowUsersAndRolesArrayForDisplay.Approvers[p].ParticipantId + '\', \'' + workflowUsersAndRolesArrayForDisplay.Approvers[p].ParticipantFriendlyName + '\', \'' + workflowUsersAndRolesArrayForDisplay.Approvers[p].ParticipantEmail + '\', \'custom\');event.stopPropagation();" />';
            //                                                    participantArray1.push(workflowUsersAndRolesArrayForDisplay.Approvers[p].ParticipantId);

            //                                                }

            //                                            }
            //                                            for (var p = 0; p < workflowUsersAndRolesArrayForDisplay.Collaborators.length; p++) {

            //                                                if (workflowUsersAndRolesArrayForDisplay.Collaborators[p].ParticipantId && !(participantArray1.indexOf(workflowUsersAndRolesArrayForDisplay.Collaborators[p].ParticipantId) > -1)) {

            //                                                    var userIdString = workflowUsersAndRolesArrayForDisplay.Collaborators[p].ParticipantFriendlyName + ' [' + workflowUsersAndRolesArrayForDisplay.Collaborators[p].ParticipantEmail + ']';

            //                                                    var imgUrl = 'https://shareandcollaborate.com/_files/' + workflowAppId + '/participantimages/' + workflowUsersAndRolesArrayForDisplay.Collaborators[p].ParticipantId + '/userimage_50x50px.png?ActiveStateIdentifier=' + JSON.parse(activeStateIdentifier).ActiveStateIdentifier;
            //                                                    imageHtml += '<img src="' + imgUrl + '" style="width:50px;" title="' + userIdString + '" alt="' + userIdString + '" onclick="$(\'.bwCircleDialog2\').bwCircleDialog2(\'displayParticipantRoleMultiPickerInACircle\', true, \'\', \'' + workflowUsersAndRolesArrayForDisplay.Collaborators[p].ParticipantId + '\', \'' + workflowUsersAndRolesArrayForDisplay.Collaborators[p].ParticipantFriendlyName + '\', \'' + workflowUsersAndRolesArrayForDisplay.Collaborators[p].ParticipantEmail + '\', \'custom\');event.stopPropagation();" />';
            //                                                    participantArray1.push(workflowUsersAndRolesArrayForDisplay.Collaborators[p].ParticipantId);

            //                                                }

            //                                            }

            //                                            var className = '.workflow_step_userimages_' + workflow.Steps.Step[stepIndex1]["@Name"];
            //                                            $(requests[i].executiveSummaryElement).find(className).find('div').html(imageHtml);

            //                                        }

            //                                    }

            //                                }
            //                            }
            //                        }

            //                    }
            //                }

            //            }

            //            var lastRecordedScrollPosition = thiz.options.lastRecordedScrollPosition;
            //            scrollTo({ top: lastRecordedScrollPosition });
            //            thiz.options.lastRecordedScrollPosition = 0; // Always reset this to 0 once you use it.
            //            console.log('Just called scrollTo(), and set lastRecordedScrollPosition to 0.');

            //        } catch (e) {
            //            HideActivitySpinner();
            //            var msg = 'Exception in bwDataGrid.js.renderDetailedListOrExecutiveSummary().get.racirolesandparticipants_arrayversion.success(): ' + e.message + ', ' + e.stack;
            //            console.log(msg);
            //            displayAlertDialog(msg);
            //            //document.getElementById(tagName).innerHTML = '<span style="color:tomato;">Errorxcx9205: ' + e.message + ', ' + e.stack + '</span>';
            //        }
            //    },
            //    error: function (data, errorCode, errorMessage) {
            //        HideActivitySpinner();
            //        var msg = 'Error in bwDataGrid.js.renderDetailedListOrExecutiveSummary().racirolesandparticipants_arrayversion.error(): ' + errorMessage + ', data: ' + JSON.stringify(data);
            //        console.log(msg);
            //        displayAlertDialog(msg);
            //    }
            //});

            ////
            //// end: DO THE BACKFILL HERE.
            ////

            ////
            ////
            //// end: 2-19-2024. IS THIS THE BEST PLACE TO BACKFILL THE EXECUTIVE SUMMARRIES? xcx1231421-5
            ////
            ////

        } catch (e) {
            console.log('Exception in bwDataGrid.js.renderDetailedListOrExecutiveSummary(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwDataGrid.js.renderDetailedListOrExecutiveSummary(): ' + e.message + ', ' + e.stack);
        }
    },

    displayExecutiveSummaries: function () {
        try {
            console.log('In bwDataGrid.js.displayExecutiveSummaries().');
            console.log('In bwDataGrid.js.displayExecutiveSummaries(). Paging is not fully implemented. pagingLimit is currently hardcoded in the widget: ' + this.options.pagingLimit + ', pagingPage: ' + this.options.pagingPage);
            //alert('In bwDataGrid.js.displayExecutiveSummaries().');
            var thiz = this;

            //for (var i = 0; i < thiz.options.BudgetRequests.length; i++) {

            //    if (thiz.options.BudgetRequests[i].Title == 'INVOICE-240002') {
            //        debugger;
            //        alert('FOUND INVOICE-240002.');

            //    }

            //}

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            localStorage.setItem('bwDisplayFormat', 'ExecutiveSummaries');

            var BudgetRequests = $('.bwAuthentication:first').bwAuthentication('option', 'BudgetRequests');

            if (!(BudgetRequests && BudgetRequests.docs)) {
                displayAlertDialog('Error in bwDataGrid.js.displayExecutiveSummaries(). Unexpected value for this.options.BudgetRequests: ' + JSON.stringify(BudgetRequests));
            } else {

                $('.divCarouselButton_Selected').removeClass().addClass('divCarouselButton'); // Unselect the other buttons.
                $('#tableExecutiveSummariesButton').removeClass().addClass('divCarouselButton_Selected'); // Select this one.

                $('#divBwDataGrid_Content').html('');

                if (!(BudgetRequests && BudgetRequests.docs && BudgetRequests.docs.length)) {

                    var html = '';
                    html += '<br /><br />';
                    html += '<span style="font-size:large;font-style:italic;">There have been no requests of this type submitted. Note that "New Requests" do not show up here.</span>';

                    $('#divBwDataGrid_Content').html(html); // 2-7-2022

                } else {

                    $('#divBwDataGrid_Content').height('auto');
                    debugger;
                    for (var i = (BudgetRequests.docs.length - 1); i > -1; i--) {
                        if (i < 100) { // This is where we set how many tasks we will display in the carousel. Zero-based, so < 5 means display 5 tasks.

                            var bwBudgetRequestId = BudgetRequests.docs[i].bwBudgetRequestId;

                            var bwBudgetRequest = BudgetRequests.docs[i];

                            var divExecutiveSummary = document.createElement('div');
                            divExecutiveSummary.classList.add('executiveSummaryInCarousel');
                            divExecutiveSummary.setAttribute('bwbudgetrequestid', bwBudgetRequestId);
                            divExecutiveSummary.title = 'xcx44432';
                            divExecutiveSummary.style.minWidth = '300px';
                            divExecutiveSummary.style.maxWidth = '550px';
                            divExecutiveSummary.style.display = 'inline-block';
                            divExecutiveSummary.style.whiteSpace = 'nowrap';
                            divExecutiveSummary.style.color = 'rgb(38, 38, 38)';
                            divExecutiveSummary.style.fontFamily = '"Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif';
                            divExecutiveSummary.style.fontSize = '1.25em';

                            var ProjectTitle_clean = String(bwBudgetRequest.ProjectTitle).replace(/["]/g, '&quot;').replace(/[']/g, '\\&#39;'); //&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method.
                            divExecutiveSummary.setAttribute('onclick', '$(\'.bwRequest\').bwRequest(\'displayArInDialog\', ' + this.options.userSelectedFilter.trashBin + ', \'' + bwBudgetRequestId + '\', \'' + bwBudgetRequest.Title + '\', \'' + ProjectTitle_clean + '\', \'' + bwBudgetRequest.Title + '\', \'' + bwBudgetRequest.bwAssignedToRaciRoleAbbreviation + '\', \'' + '7777xcx7777777' + '\');');

                            $('#divBwDataGrid_Content').append(divExecutiveSummary);

                            // New 8-25-2023.
                            console.log('Calling bwCommonScripts.getExecutiveSummaryHtml(). xcx1-6. <<<<<<< I CHANGED THIS FROM AN alert() BECAUSE IT WAS DISTURBING THE USER. <<');
                            //alert('Calling bwCommonScripts.getExecutiveSummaryHtml(). xcx1-6.');
                            var promise = bwCommonScripts.getExecutiveSummaryHtml(BudgetRequests.docs[i], 'bwBudgetRequest', divExecutiveSummary);
                            promise.then(function (results) {
                                try {

                                    console.log('In bwDataGrid.js.displayExecutiveSummaries(). Populating element [' + results.executiveSummaryElement.id + '].  Returned from getExecutiveSummaryHtmlForRequest(). Displaying executive summary with bwBudgetRequestId: ' + results.bwBudgetRequestId); // + ', result.html: ' + result.html);

                                    $(results.executiveSummaryElement).html(results.html);

                                    var promise2 = bwCommonScripts.renderInventoryItems_ForExecutiveSummary(results.bwBudgetRequest.bwBudgetRequestId, results.bwBudgetRequest, results.executiveSummaryElement);
                                    promise2.then(function (results) {
                                        try {

                                            console.log('In bwDataGrid.js.displayExecutiveSummaries(). Returned from call to bwCommonScripts.renderInventoryItems_ForExecutiveSummary.');

                                            var promise3 = bwCommonScripts.renderAttachments_ForExecutiveSummary(results.bwBudgetRequestId, results.bwBudgetRequest, results.executiveSummaryElement);
                                            promise3.then(function (results) {
                                                try {

                                                    console.log('In bwDataGrid.js.displayExecutiveSummaries(). Returned from call to bwCommonScripts.renderAttachments_ForExecutiveSummary.');
                                                    //alert('In bwDataGrid.js.displayExecutiveSummaries(). Returned from call to bwCommonScripts.renderAttachments_ForExecutiveSummary.');

                                                } catch (e) {

                                                    var msg = 'Exception in bwDataGrid.js.displayExecutiveSummaries():2-2-2: ' + e.message + ', ' + e.stack;
                                                    console.log(msg);
                                                    alert(msg);
                                                    var result = {
                                                        status: 'EXCEPTION',
                                                        message: msg
                                                    }
                                                    reject(result);

                                                }
                                            }).catch(function (e) {

                                                var msg = 'Exception in bwDataGrid.js.displayExecutiveSummaries():2-2-2: ' + JSON.stringify(e);
                                                console.log(msg);
                                                alert(msg);
                                                var result = {
                                                    status: 'EXCEPTION',
                                                    message: msg
                                                }
                                                reject(result);

                                            });

                                        } catch (e) {

                                            var msg = 'Exception in bwDataGrid.js.displayExecutiveSummaries():2-2-2-3: ' + e.message + ', ' + e.stack;
                                            console.log(msg);
                                            alert(msg);
                                            var result = {
                                                status: 'EXCEPTION',
                                                message: msg
                                            }
                                            reject(result);

                                        }
                                    }).catch(function (e) {

                                        var msg = 'Exception in bwDataGrid.js.displayExecutiveSummaries():2-2-2-3: ' + JSON.stringify(e);
                                        console.log(msg);
                                        alert(msg);
                                        var result = {
                                            status: 'EXCEPTION',
                                            message: msg
                                        }
                                        reject(result);

                                    });


                                    //
                                    // Display inventory images
                                    //
                                    //

                                    //var InventoryItems = [];
                                    //for (var j = 0; j < this.options.BudgetRequests.length; j++) {
                                    //    //debugger;
                                    //    //var x = '';
                                    //    if (bwBudgetRequestId == this.options.BudgetRequests[j].bwBudgetRequestId) {
                                    //        //debugger;
                                    //        var tmpJson = this.options.BudgetRequests[j].bwRequestJson;
                                    //        var json = JSON.parse(tmpJson);
                                    //        //debugger;


                                    //        if (json && json.bwSelectInventoryItems && json.bwSelectInventoryItems.value) {
                                    //            InventoryItems = json.bwSelectInventoryItems.value; //this.options.brData.PendingBudgetRequests[j].bwRequestJson;
                                    //        }
                                    //        break;
                                    //    }
                                    //}

                                    //var InventoryItems;
                                    //if (results.requestJson && results.requestJson.bwSelectInventoryItems && results.requestJson.bwSelectInventoryItems.value) {
                                    //    InventoryItems = results.requestJson.bwSelectInventoryItems.value;
                                    //} else {
                                    //    InventoryItems = [];
                                    //}

                                    //if (InventoryItems.length > 0) {
                                    //    var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                                    //        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                                    //        return v.toString(16);
                                    //    });
                                    //    //for (var j = 0; j < InventoryItems.length; j++) {
                                    //    //    //debugger;
                                    //    //    var html = '';

                                    //    //    //var imagePath = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/inventoryimages/' + InventoryItems[j].bwInventoryItemId + '/inventoryimage.png?v=' + guid;
                                    //    //    var imagePath = globalUrlPrefix + globalUrl + '/_files/' + workflowAppId + '/inventoryimages/' + InventoryItems[j].bwInventoryItemId + '/inventoryimage.png?v=' + guid;
                                    //    //    html += '<img src="' + imagePath + '" style="height:150px;" />';
                                    //    //    html += '<br />';

                                    //    //    $('#bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_' + bwBudgetRequestId).append(html);

                                    //    //}
                                    //    var html = '';

                                    //    for (var j = 0; j < InventoryItems.length; j++) {


                                    //        //var imagePath = globalUrlPrefix + globalUrl + '/_files/' + workflowAppId + '/inventoryimages/' + InventoryItems[j].bwInventoryItemId + '/inventoryimage.png?v=' + guid;
                                    //        //html += '   <img src="' + imagePath + '" style="height:150px;" />';






                                    //        var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

                                    //        if (activeStateIdentifier.status != 'SUCCESS') {

                                    //            html += '[No image. Unauthorized. xcx213124-2]';

                                    //        } else {

                                    //            //html += '<img xcx="xcx443321-8-1" src="' + fileUrl_Thumbnail + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier + '" style="height:150px;max-width:500px;border:1px solid gray;border-radius:0 30px 0 0;" ';
                                    //            var imagePath = globalUrlPrefix + globalUrl + '/_files/' + workflowAppId + '/inventoryimages/' + InventoryItems[j].bwInventoryItemId + '/inventoryimage.png?v=' + guid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;
                                    //            html += '   <img xcx="xcx443321-8-2" src="' + imagePath + '" style="height:150px;" />';

                                    //        }







                                    //    }


                                    //    if (html != '') {
                                    //        var html2 = '';
                                    //        html2 += '<div>';
                                    //        html2 += '<span style="color:black;font-size:12pt;font-weight:normal;float:left;">Inventory item(s): </span>'; // Add the title, since we have some items to display.
                                    //        html2 += '<br />';
                                    //        html = html2 + html + '</div>';
                                    //        $('#bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_' + bwBudgetRequestId).append(html);
                                    //    }
                                    //}

                                    ////
                                    //// end: Display inventory images
                                    ////


                                    ////
                                    //// WE ARE MAKING THIS THE NEW WAY TO DISPLAY ATTACHMENTS FOR EXECUTIVE SUMMARIES!!!!!!!!!!!!!!!!!!!! 11-5-2022
                                    ////
                                    //var renderAttachments = function (bwBudgetRequestId) {
                                    //    try {
                                    //        console.log('In bwDataGrid.js.displayExecutiveSummaries.renderAttachments().');

                                    //        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                                    //        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

                                    //        var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                                    //        var data = {
                                    //            bwParticipantId_LoggedIn: participantId,
                                    //            bwActiveStateIdentifier: activeStateIdentifier,
                                    //            bwWorkflowAppId_LoggedIn: workflowAppId,

                                    //            bwWorkflowAppId: workflowAppId,
                                    //            bwBudgetRequestId: bwBudgetRequestId
                                    //        }

                                    //        var operationUri = globalUrlPrefix + globalUrl + '/_files/' + 'getlistofattachmentsforbudgetrequest'; // _files allows us to use nginx to route these to a dedicated file server.
                                    //        $.ajax({
                                    //            url: operationUri,
                                    //            method: 'POST',
                                    //            data: data,
                                    //            timeout: 15000, // This is done because file services may need more time.
                                    //            headers: {
                                    //                "Accept": "application/json; odata=verbose"
                                    //            },
                                    //            success: function (results) {
                                    //                try {

                                    //                    var html = $('.bwCoreComponent:first').bwCoreComponent('createHtmlToDisplayTheListOfAttachments_ForExecutiveSummary', thiz.options.elementIdSuffix, workflowAppId, bwBudgetRequestId, null, results);

                                    //                    if (bwBudgetRequestId) {
                                    //                        if (html != '') {
                                    //                            var html2 = '';
                                    //                            html2 += '<div>';
                                    //                            html2 += '<span style="color:black;font-size:12pt;font-weight:normal;float:left;">Attachment(s): </span>'; // Add the title, since we have some items to display.
                                    //                            html2 += '<br />';
                                    //                            html = html2 + html + '</div>';
                                    //                            $('#bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_' + bwBudgetRequestId).append(html);
                                    //                        }
                                    //                    }

                                    //                } catch (e) {
                                    //                    if (e.number) {
                                    //                        displayAlertDialog('Error in populateAttachments():1-1: ' + e.number + ', "' + e.message + '", ' + e.stack);
                                    //                    } else {
                                    //                        // This most likely means that the folders are there on the file services server, but there is nothing in them.
                                    //                        //
                                    //                        // Fileservices has an error, so show nothing! We will put a red exclamation pin in the attachments section eventually! - 10-1-17 todd
                                    //                        //displayAlertDialog('Fileservices has an error: ' + ' "' + e.message + '"');
                                    //                    }
                                    //                }
                                    //            },
                                    //            error: function (data, errorCode, errorMessage) {
                                    //                if (errorCode === 'timeout' && errorMessage === 'timeout') {
                                    //                    displayAlertDialog('SERVICE UNAVAILABLE. File services is not respondingxcx2. communication timeout is set at ' + ajaxTimeout / 1000 + ' seconds: ' + errorCode + ', ' + errorMessage);
                                    //                } else {


                                    //                    console.log('');
                                    //                    console.log('********************************************************************');
                                    //                    console.log('Error in bwDataGrid.js.showRowHoverDetails:2:3 ' + errorCode + ', ' + errorMessage);
                                    //                    console.log('********************************************************************');
                                    //                    console.log('');

                                    //                    //displayAlertDialog('Error in showRowHoverDetails:2:3 ' + errorCode + ', ' + errorMessage);





                                    //                    // The latest error 1-17-2018 is errorCode:'error' and errorMessage:'Not Found'.
                                    //                    // What does this mean? You can replicate this error!
                                    //                    // at Url: https://budgetworkflow.com/ios8.html, view an offline (Un-submitted) request, and try to add an attachment.
                                    //                }
                                    //            }
                                    //        });
                                    //    } catch (e) {
                                    //        console.log('Exception in bwExecutiveSummariesCarousel2.js.renderAttachments(): ' + e.message + ', ' + e.stack);
                                    //        displayAlertDialog('Exception in bwExecutiveSummariesCarousel2.js.renderAttachments(): ' + e.message + ', ' + e.stack);
                                    //    }
                                    //}

                                    //console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Calling renderAttachments(). bwBudgetRequestId: ' + bwBudgetRequestId);
                                    //renderAttachments(bwBudgetRequestId);



                                } catch (e) {
                                    var msg = 'Exception in bwDataGrid.js.displayExecutiveSummaries():xcx2131234234: ' + e.message + ', ' + e.stack;
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
                                var msg = 'Exception in bwDataGrid.js.displayExecutiveSummaries():2-2-2: ' + JSON.stringify(e);
                                console.log(msg);
                                alert(msg);
                                var result = {
                                    status: 'EXCEPTION',
                                    message: msg
                                }
                                reject(result);

                            });





                            //// 2-8-2022
                            ////var ProjectTitle_clean = this.options.BudgetRequests[i].ProjectTitle.replace(/["]/g, '&quot;').replace(/[']/g, '&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method. 

                            //var ProjectTitle_clean = String(this.options.BudgetRequests[i].ProjectTitle).replace(/["]/g, '&quot;').replace(/[']/g, '\\&#39;'); //&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method. 

                            //var html = '';

                            //html += '<div id="' + carouselItem_Id + '" class="executiveSummaryInCarousel" bwbudgetrequestid="' + bwBudgetRequestId + '" style="min-width:300px;display:inline-block;white-space:nowrap;color: rgb(38, 38, 38); font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif; font-size: 1.25em;" ';
                            ////this.carouselItem_AddOnClick(carouselItem_Id, bwBudgetRequestId, this.options.taskData[i].Title, this.options.taskData[i].ProjectTitle, this.options.taskData[i].bwAssignedToRaciRoleAbbreviation, bwWorkflowTaskItemId);

                            ////alert('xcx423234 looking for bwAssignedToRaciRoleAbbreviation, bwWorkflowTaskItemId. this.options.BudgetRequests[i]: ' + JSON.stringify(this.options.BudgetRequests[i]));
                            //html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + this.options.TrashBin + '\', \'' + bwBudgetRequestId + '\', \'' + this.options.BudgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + this.options.BudgetRequests[i].Title + '\', \'' + this.options.BudgetRequests[i].bwAssignedToRaciRoleAbbreviation + '\', \'' + bwBudgetRequestId + '\');" ';
                            //html += '   >';

                            //html += '<br />';

                            //html += '   <span style="font-size:12pt;"><span style="color:goldenrod;font-size:18pt;font-weight:bold;">' + this.options.BudgetRequests[i].Title + '</span></span>';
                            //html += '   <br />';
                            //html += '   <span style="color:goldenrod;font-size:18pt;font-weight:bold;">' + this.options.BudgetRequests[i].ProjectTitle + '</span>';
                            //html += '   <br />';
                            //html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Requested by: ' + this.options.BudgetRequests[i].CreatedBy + '</span>';

                            //html += '   <br />';
                            //var RequestedCapital_cleaned = $('.bwAuthentication').bwAuthentication('getBudgetWorkflowStandardizedCurrency', this.options.BudgetRequests[i].RequestedCapital);
                            //html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Requested capital: <span style="color:purple;font-size:18pt;" xcx="xcx993846">' + RequestedCapital_cleaned + '</span></span>';



                            //// 7-2-2023.
                            //var bwRequestJson = JSON.parse(this.options.BudgetRequests[i].bwRequestJson);
                            //if (bwRequestJson.bwInvoiceGrid && bwRequestJson.bwInvoiceGrid.value && bwRequestJson.bwInvoiceGrid.value[0] && bwRequestJson.bwInvoiceGrid.value[0].Total) {
                            //    var invoicedAmount = bwRequestJson.bwInvoiceGrid.value[0].Total;
                            //    if (invoicedAmount > 0) {
                            //        var InvoicedAmount_cleaned = $('.bwAuthentication').bwAuthentication('getBudgetWorkflowStandardizedCurrency', invoicedAmount);
                            //        html += '   <br />';
                            //        html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Invoiced Amount: <span style="color:purple;font-size:18pt;" xcx="xcx993846-2">' + InvoicedAmount_cleaned + '</span></span>';
                            //    }
                            //}


                            //html += '   <br />';
                            //var timestamp4;
                            //var requestCreatedDate;
                            //requestCreatedDate = this.options.BudgetRequests[i].Created;
                            //if (requestCreatedDate) {
                            //    timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(requestCreatedDate);
                            //} else {
                            //    timestamp4 = '[not available]';
                            //}
                            //html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Request created: ' + timestamp4 + '</span>';
                            //html += '   <br />';
                            //html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Org: <span style="">' + this.options.BudgetRequests[i].OrgName + '</span></span>';
                            //html += '   <br />';
                            //html += '   <br />';

                            //html += '   <div id="bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_' + bwBudgetRequestId + '" style="text-align: center;"></div>';



                            //html += '   <hr style="color:skyblue;" />';

                            //if (!this.options.BudgetRequests[i].BudgetWorkflowStatus) {

                            //    html += '<span style="color:goldenrod;font-size:18pt;font-weight:bold;">Workflow step: ' + 'xcx5543 INVALID BudgetWorkflowStatus: ' + this.options.BudgetRequests[i].BudgetWorkflowStatus + '</span>';

                            //} else {

                            //    if (this.options.BudgetRequests[i].BudgetWorkflowStatus.toString().toLowerCase() == 'collaboration') {
                            //        html += '<span style="color:goldenrod;font-size:18pt;font-weight:bold;">Workflow step: ' + this.options.BudgetRequests[i].BudgetWorkflowStatus + '</span>';
                            //    } else {
                            //        html += '<span style="color:goldenrod;font-size:18pt;font-weight:bold;">Workflow step: ' + this.options.BudgetRequests[i].BudgetWorkflowStatus + '</span>';
                            //    }

                            //}

                            //html += '   <br />';
                            //html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Approvers: [xcxappovers1]</span>';
                            //html += '   <br />';
                            //html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Collaborators: [xcxcollaborators]</span>';
                            //html += '   <br />';
                            //html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Informed: [xcxinformed]</span>';
                            //html += '   <br />';

                            //html += '</div>';

                            //$('#divBwDataGrid_Content').append(html); // Create the html in the div tag.

                            //console.log('Calling carouselItem_AddOnClick() xcx124254235');
                            //// Now add the onclick event.
                            ////var bwWorkflowTaskItemId = this.options.taskData[i].bwWorkflowTaskItemId;
                            ////this.carouselItem_AddOnClick(carouselItem_Id, bwBudgetRequestId, this.options.taskData[i].Title, this.options.taskData[i].ProjectTitle, this.options.taskData[i].bwAssignedToRaciRoleAbbreviation, bwWorkflowTaskItemId);

                            //carouselItemIndex += 1;

                            ////
                            //// Display inventory images
                            ////
                            //// 

                            //var InventoryItems = [];
                            //for (var j = 0; j < this.options.BudgetRequests.length; j++) {
                            //    //debugger;
                            //    //var x = '';
                            //    if (bwBudgetRequestId == this.options.BudgetRequests[j].bwBudgetRequestId) {
                            //        //debugger;
                            //        var tmpJson = this.options.BudgetRequests[j].bwRequestJson;
                            //        var json = JSON.parse(tmpJson);
                            //        //debugger;


                            //        if (json && json.bwSelectInventoryItems && json.bwSelectInventoryItems.value) {
                            //            InventoryItems = json.bwSelectInventoryItems.value; //this.options.brData.PendingBudgetRequests[j].bwRequestJson;
                            //        }
                            //        break;
                            //    }
                            //}

                            //if (InventoryItems.length > 0) {
                            //    var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                            //        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                            //        return v.toString(16);
                            //    });
                            //    //for (var j = 0; j < InventoryItems.length; j++) {
                            //    //    //debugger;
                            //    //    var html = '';

                            //    //    //var imagePath = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/inventoryimages/' + InventoryItems[j].bwInventoryItemId + '/inventoryimage.png?v=' + guid;
                            //    //    var imagePath = globalUrlPrefix + globalUrl + '/_files/' + workflowAppId + '/inventoryimages/' + InventoryItems[j].bwInventoryItemId + '/inventoryimage.png?v=' + guid;
                            //    //    html += '<img src="' + imagePath + '" style="height:150px;" />';
                            //    //    html += '<br />';

                            //    //    $('#bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_' + bwBudgetRequestId).append(html);

                            //    //}
                            //    var html = '';

                            //    for (var j = 0; j < InventoryItems.length; j++) {


                            //        //var imagePath = globalUrlPrefix + globalUrl + '/_files/' + workflowAppId + '/inventoryimages/' + InventoryItems[j].bwInventoryItemId + '/inventoryimage.png?v=' + guid;
                            //        //html += '   <img src="' + imagePath + '" style="height:150px;" />';






                            //        var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

                            //        if (activeStateIdentifier.status != 'SUCCESS') {

                            //            html += '[No image. Unauthorized. xcx213124-2]';

                            //        } else {

                            //            //html += '<img xcx="xcx443321-8-1" src="' + fileUrl_Thumbnail + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier + '" style="height:150px;max-width:500px;border:1px solid gray;border-radius:0 30px 0 0;" ';
                            //            var imagePath = globalUrlPrefix + globalUrl + '/_files/' + workflowAppId + '/inventoryimages/' + InventoryItems[j].bwInventoryItemId + '/inventoryimage.png?v=' + guid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;
                            //            html += '   <img xcx="xcx443321-8-2" src="' + imagePath + '" style="height:150px;" />';

                            //        }







                            //    }


                            //    if (html != '') {
                            //        var html2 = '';
                            //        html2 += '<div>';
                            //        html2 += '<span style="color:black;font-size:12pt;font-weight:normal;float:left;">Inventory item(s): </span>'; // Add the title, since we have some items to display.
                            //        html2 += '<br />';
                            //        html = html2 + html + '</div>';
                            //        $('#bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_' + bwBudgetRequestId).append(html);
                            //    }
                            //}

                            ////
                            //// end: Display inventory images
                            ////


                            ////
                            //// WE ARE MAKING THIS THE NEW WAY TO DISPLAY ATTACHMENTS FOR EXECUTIVE SUMMARIES!!!!!!!!!!!!!!!!!!!! 11-5-2022 
                            ////
                            //var renderAttachments = function (bwBudgetRequestId) {
                            //    try {
                            //        console.log('In bwDataGrid.js.displayExecutiveSummaries.renderAttachments().');

                            //        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                            //        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

                            //        var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                            //        var data = {
                            //            bwParticipantId_LoggedIn: participantId,
                            //            bwActiveStateIdentifier: activeStateIdentifier,
                            //            bwWorkflowAppId_LoggedIn: workflowAppId,

                            //            bwWorkflowAppId: workflowAppId,
                            //            bwBudgetRequestId: bwBudgetRequestId
                            //        }

                            //        var operationUri = globalUrlPrefix + globalUrl + '/_files/' + 'getlistofattachmentsforbudgetrequest'; // _files allows us to use nginx to route these to a dedicated file server.
                            //        $.ajax({
                            //            url: operationUri,
                            //            method: 'POST',
                            //            data: data,
                            //            timeout: 15000, // This is done because file services may need more time. 
                            //            headers: {
                            //                "Accept": "application/json; odata=verbose"
                            //            },
                            //            success: function (results) {
                            //                try {

                            //                    var html = $('.bwCoreComponent:first').bwCoreComponent('createHtmlToDisplayTheListOfAttachments_ForExecutiveSummary', thiz.options.elementIdSuffix, workflowAppId, bwBudgetRequestId, null, results);

                            //                    if (bwBudgetRequestId) {
                            //                        if (html != '') {
                            //                            var html2 = '';
                            //                            html2 += '<div>';
                            //                            html2 += '<span style="color:black;font-size:12pt;font-weight:normal;float:left;">Attachment(s): </span>'; // Add the title, since we have some items to display.
                            //                            html2 += '<br />';
                            //                            html = html2 + html + '</div>';
                            //                            $('#bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_' + bwBudgetRequestId).append(html);
                            //                        }
                            //                    }

                            //                } catch (e) {
                            //                    if (e.number) {
                            //                        displayAlertDialog('Error in populateAttachments():1-1: ' + e.number + ', "' + e.message + '", ' + e.stack);
                            //                    } else {
                            //                        // This most likely means that the folders are there on the file services server, but there is nothing in them.
                            //                        //
                            //                        // Fileservices has an error, so show nothing! We will put a red exclamation pin in the attachments section eventually! - 10-1-17 todd
                            //                        //displayAlertDialog('Fileservices has an error: ' + ' "' + e.message + '"');
                            //                    }
                            //                }
                            //            },
                            //            error: function (data, errorCode, errorMessage) {
                            //                if (errorCode === 'timeout' && errorMessage === 'timeout') {
                            //                    displayAlertDialog('SERVICE UNAVAILABLE. File services is not respondingxcx2. communication timeout is set at ' + ajaxTimeout / 1000 + ' seconds: ' + errorCode + ', ' + errorMessage);
                            //                } else {


                            //                    console.log('');
                            //                    console.log('********************************************************************');
                            //                    console.log('Error in bwDataGrid.js.showRowHoverDetails:2:3 ' + errorCode + ', ' + errorMessage);
                            //                    console.log('********************************************************************');
                            //                    console.log('');

                            //                    //displayAlertDialog('Error in showRowHoverDetails:2:3 ' + errorCode + ', ' + errorMessage);





                            //                    // The latest error 1-17-2018 is errorCode:'error' and errorMessage:'Not Found'.
                            //                    // What does this mean? You can replicate this error!
                            //                    // at Url: https://budgetworkflow.com/ios8.html, view an offline (Un-submitted) request, and try to add an attachment.
                            //                }
                            //            }
                            //        });
                            //    } catch (e) {
                            //        console.log('Exception in bwExecutiveSummariesCarousel2.js.renderAttachments(): ' + e.message + ', ' + e.stack);
                            //        displayAlertDialog('Exception in bwExecutiveSummariesCarousel2.js.renderAttachments(): ' + e.message + ', ' + e.stack);
                            //    }
                            //}

                            //console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Calling renderAttachments(). bwBudgetRequestId: ' + bwBudgetRequestId);
                            //renderAttachments(bwBudgetRequestId);

                        } else {
                            break;
                        }
                    }

                }

            }

        } catch (e) {
            console.log('Exception in bwDataGrid.jsdisplayExecutiveSummaries(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwDataGrid.jsdisplayExecutiveSummaries(): ' + e.message + ', ' + e.stack);
        }
    },
    displayDetailedList: function () {
        try {
            console.log('In bwDataGrid.js.displayDetailedList().');
            //alert('In bwDataGrid.jsdisplayDetailedList().');
            var thiz = this;

            localStorage.setItem('bwDisplayFormat', 'DetailedList');

            $('.divCarouselButton_Selected').removeClass().addClass('divCarouselButton'); // Unselect the other buttons.
            $('#tableDetailedListButton').removeClass().addClass('divCarouselButton_Selected'); // Select this one.

            var brData = thiz.options.BudgetRequests_Filtered;
            var sData = thiz.options.Supplementals;
            //debugger;
            if (!(brData && brData.length)) { // && sData && sData.length)) {
                var html = '';
                html += '<br /><br />';
                html += '<span style="font-size:large;font-style:italic;">There have been no requests of this type submitted. Note that "New Requests" do not show up here.</span>';

                $('#divBwDataGrid_Content').html(html); // 2-7-2022

            } else {
                // Assuming this comes in random order, we need to do a sort here and put into an array.
                // This is not going to be an efficient sort to start with, but who cares it's on the client side! :D
                //budgetRequests = [];
                budgetRequests = new Array(brData.length);
                //supplementals = [];
                supplementals = new Array(brData.length);
                //statusesForTheStatusDropdown = [];
                statusesForTheStatusDropdown = new Array();
                // First we load the array.
                for (var i = 0; i < brData.length; i++) {
                    budgetRequests[i] = brData[i];
                }
                //debugger;
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
                    //supplementals[i] = [];
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
                var html = '';
                //var year = new Date().getFullYear().toString(); // todd hardcoded.
                //html += '<br />Year:&nbsp;<select style="padding:5px 5px 5px 5px;" id=""><option>' + year + '</option></select>';

                // Now that we have all our data in the array properly, lets display it!
                var year = new Date().getFullYear().toString(); // todd hardcoded.
                html += '<br />';


                html += '<br /><br />';


                //html += '<div style="height:800px;overflow-y: scroll;" onscroll="$(\'.bwDataGrid\').bwDataGrid(\'dataGrid_OnScroll\', this);">';
                html += '<div id="divDataGridTable" style="overflow-y: scroll;" onscroll="$(\'.bwDataGrid\').bwDataGrid(\'dataGrid_OnScroll\', this, \'' + 'bwRequestTypeId' + '\');">'; // Commented out bwRequestTypeId not sure why it is here 4-22-2022



                html += '<table id="dataGridTable" class="dataGridTable" bwworkflowappid="' + workflowAppId + '" >';

                html += '  <tr class="headerRow">';
                html += '    <td></td>';

                // "Location" column header.
                html += '   <td style="white-space:nowrap;">';
                //html += '       Location';
                html += '       <div style="vertical-align:middle;display:inline-block;">Location&nbsp;</div>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'OrgName\', \'ascending\', this);">';
                html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'OrgName\', \'ascending\', this);">';
                html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '   </td>';

                // "Title" column header.
                html += '    <td style="white-space:nowrap;">';
                html += '       <div style="vertical-align:middle;display:inline-block;">Title&nbsp;</div>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'Title\', \'descending\', this);">';
                html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'Title\', \'ascending\', this);">';
                html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '   </td>';

                // "Description" column header.
                html += '    <td style="white-space:nowrap;">';
                html += '       <div style="vertical-align:middle;display:inline-block;">Description&nbsp;</div>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'ProjectTitle\', \'descending\', this);">';
                html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'ProjectTitle\', \'ascending\', this);">';
                html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '   </td>';

                // "Fiscal year" column header.
                html += '    <td style="white-space:nowrap;">';
                html += '       <div style="vertical-align:middle;display:inline-block;">Fiscal year&nbsp;</div>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'bwFiscalYear\', \'descending\', this);">';
                html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'bwFiscalYear\', \'ascending\', this);">';
                html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '   </td>';

                html += '    <td>Request Type Id</td>';

                // "Created Date" column header.
                html += '    <td style="white-space:nowrap;">';
                html += '       <div style="vertical-align:middle;display:inline-block;">Created Date&nbsp;</div>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'Created\', \'descending\', this);">';
                html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'Created\', \'ascending\', this);">';
                html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '   </td>';


                html += '    <td style="white-space:nowrap;">Financial Area</td>';
                html += '    <td>OrgId</td>';

                // "Status" column header.
                //html += '    <td>Status</td>';
                html += '    <td style="white-space:nowrap;">';
                html += '       <div style="vertical-align:middle;display:inline-block;">Status&nbsp;</div>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'BudgetWorkflowStatus\', \'descending\', this);">';
                html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'BudgetWorkflowStatus\', \'ascending\', this);">';
                html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '   </td>';

                // "AR Status" column header.
                html += '    <td style="white-space:nowrap;">';
                html += '       <div style="vertical-align:middle;display:inline-block;">Status&nbsp;</div>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'ARStatus\', \'descending\', this);">';
                html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'ARStatus\', \'ascending\', this);">';
                html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '   </td>';

                // "Current Owner(s)" column header. 
                html += '    <td style="white-space:nowrap;">';
                html += '       <div style="vertical-align:middle;display:inline-block;">Current Owner(s)&nbsp;</div>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'CurrentOwner\', \'descending\', this);">';
                html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'CurrentOwner\', \'ascending\', this);">';
                html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '   </td>';

                // "Capital Cost" column header. 
                html += '    <td style="white-space:nowrap;">';
                html += '       <div style="vertical-align:middle;display:inline-block;">Capital Cost&nbsp;</div>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'RequestedCapital\', \'descending\', this);">';
                html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'RequestedCapital\', \'ascending\', this);">';
                html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '   </td>';

                // "Expense" column header.
                html += '    <td style="white-space:nowrap;">';
                html += '       <div style="vertical-align:middle;display:inline-block;">Expense&nbsp;</div>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'RequestedExpense\', \'descending\', this);">';
                html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'RequestedExpense\', \'ascending\', this);">';
                html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '   </td>';

                html += '    <td>Lease</td>';
                html += '    <td>Total</td>';
                html += '    <td>Closeout</td>';
                html += '    <td>Simple Payback</td>';

                // "Modified Date" column header. 
                //html += '    <td>Modified Date</td>';
                html += '    <td style="white-space:nowrap;">';
                html += '       <div style="vertical-align:middle;display:inline-block;">Modified Date&nbsp;</div>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'Modified\', \'descending\', this);">';
                html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'Modified\', \'ascending\', this);">';
                html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
                html += '       </span>';
                html += '   </td>';

                html += '    <td></td>';
                html += '  </tr>';

                html += '  <tr class="filterRow">';
                // Magnifying glass
                html += '    <td></td>';

                // Location
                html += '   <td style="white-space:nowrap;">';
                html += '       <input type="text" id="txtArchivePageLocationFilter" class="archivePageFilterBox" title="Type here to limit search results, using * as a wildcard character." onkeydown="$(\'.bwDataGrid\').bwDataGrid(\'locationFilterBox_OnKeyDown\', event);"/>';
                html += '   </td>';
                //html += '    <td></td>';

                // Request #
                //html += '    <td style="white-space:nowrap;"><span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="alert(\'Order ascending...\');">☝</span><span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="alert(\'Order descending...\');">☟</span></td>';
                html += '    <td style="white-space:nowrap;">';
                //html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="alert(\'Order descending...\');">';
                //html += '           <img src="images/descending.png" style="width:25px;" />';
                //html += '       </span>';
                //html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="alert(\'Order ascending...\');">';
                //html += '           <img src="images/ascending.png" style="width:25px;" />';
                //html += '       </span>';
                html += '   </td>';


                // Description
                html += '   <td style="white-space:nowrap;">';
                html += '       <input type="text" id="txtArchivePageDescriptionFilter" class="archivePageFilterBox" title="Type here to limit search results, using * as a wildcard character."/>';
                html += '   </td>';

                // Fiscal year
                html += '   <td style="white-space:nowrap;">';
                html += '       <input type="text" id="txtArchivePageDescriptionFilter" class="archivePageFilterBox" title="Type here to limit search results, using * as a wildcard character."/>';
                html += '   </td>';

                // Request Type.
                html += '    <td></td>';

                // Created Date
                html += '    <td></td>';
                // Financial Areas.
                html += '    <td style="white-space:nowrap;">';
                html += '      <select id="ddlArchivePageFinancialAreaDropDownFilter" class="archivePageFilterDropDown" title="Select here to limit the search results.">';
                //for (var x = 0; x < BWMData[0].length; x++) { // removed 12-28-2022
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
                html += '      </select>';
                html += '    </td>';

                // OrgId
                html += '    <td></td>';


                // Status
                html += '    <td style="white-space:nowrap;">';
                html += '<select id="selectArchivePageFilterDropDown" class="archivePageFilterDropDown" title="Select here to limit the search results.">';
                // Now put the empty option.
                html += '<option value="" class="archivePageFilterOptionDropDown">Show all...</option>';
                // statusesForTheStatusDropdown
                for (var s = 0; s < statusesForTheStatusDropdown.length; s++) {
                    html += '<option value="' + statusesForTheStatusDropdown[s] + '" class="archivePageFilterOptionDropDown">' + statusesForTheStatusDropdown[s] + '</option>';
                }
                html += '</select>&nbsp;<img src="images/icon-down.png" title="Sort order" style="cursor:pointer;" />';
                html += '    </td>';



                // ARStatus
                html += '    <td></td>';
                // Current Owner(s)
                html += '    <td></td>';
                // Capital Cost
                html += '    <td></td>';
                // Expense
                html += '    <td></td>';
                // Lease
                html += '    <td></td>';
                // Total
                html += '    <td style="white-space:nowrap;"><input type="text" id="txtArchivePageBudgetAmountFilter" class="archivePageFilterBox" title="Enter a number. Shows all equal to or greater than."/>&nbsp;<img src="images/icon-down.png" title="Sort order" style="cursor:pointer;" /></td>';
                // Closeout
                html += '    <td></td>';
                // Simple Payback
                html += '    <td>[simplepaybackfilter]</td>';
                // Modified Date
                html += '    <td></td>';
                // Trash Bin
                html += '    <td></td>';

                html += '  </tr>';

                var orgsImageFetchingInformation = [];

                var alternatingRow = 'light'; // Use this to color the rows.
                for (var i = 0; i < budgetRequests.length; i++) {
                    //debugger;
                    //var imageUrl = 'https://budgetworkflow.com/_files/af316d1a-ca6d-4c1d-bf8d-66b05920292f/ac778618-4412-48c5-a282-5850e972fd36/edthetalkinghorse.jpg';

                    // 2-8-2022
                    var ProjectTitle_clean = String(budgetRequests[i].ProjectTitle).replace(/["]/g, '&quot;').replace(/[']/g, '&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method. 


                    var bwWorkflowAppId = budgetRequests[i].bwWorkflowAppId;
                    var bwBudgetRequestId = budgetRequests[i].bwBudgetRequestId;
                    var BriefDescriptionOfProject;
                    if (budgetRequests[i].bwRequestJson) {
                        BriefDescriptionOfProject = JSON.parse(budgetRequests[i].bwRequestJson).BriefDescriptionOfProject;
                    } else {
                        BriefDescriptionOfProject = 'ERROR: Invalid bwRequestJson.';
                    }

                    if (alternatingRow == 'light') {
                        html += '<tr class="alternatingRowLight" style="cursor:pointer;" ';
                        //html += ' onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + budgetRequests[i].Title + '\', \'' + budgetRequests[i].ProjectTitle + '\', \'' + BriefDescriptionOfProject + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\', \'' + budgetRequests[i].OrgId + '\', \'' + budgetRequests[i].OrgName + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                        //html += ' onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');this.style.backgroundColor=\'white\';"';
                        //html += ' onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + thiz.options.operationUriPrefix + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + budgetRequests[i].ProjectTitle + '\', \'' + budgetRequests[i].Title + '\');"';
                        html += '>';
                        alternatingRow = 'dark';
                    } else {
                        //html += '  <tr class="alternatingRowDark" style="cursor:pointer;" onmouseover="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + budgetRequests[i].Title + '\', \'' + budgetRequests[i].ProjectTitle + '\', \'' + JSON.parse(budgetRequests[i].bwRequestJson).BriefDescriptionOfProject + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\', \'' + budgetRequests[i].OrgId + '\', \'' + budgetRequests[i].OrgName + '\');"  >';
                        html += '<tr class="alternatingRowDark" style="cursor:pointer;" ';
                        //html += ' onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + budgetRequests[i].Title + '\', \'' + budgetRequests[i].ProjectTitle + '\', \'' + BriefDescriptionOfProject + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\', \'' + budgetRequests[i].OrgId + '\', \'' + budgetRequests[i].OrgName + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                        //html += ' onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');this.style.backgroundColor=\'whitesmoke\';"';
                        //html += ' onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + thiz.options.operationUriPrefix + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + budgetRequests[i].ProjectTitle + '\', \'' + budgetRequests[i].Title + '\');"';
                        html += '>';
                        alternatingRow = 'light';
                    }

                    // Magnifying glass.
                    html += '   <td style="padding:5px;" ';
                    //html += ' onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + BriefDescriptionOfProject + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\', \'' + budgetRequests[i].OrgId + '\', \'' + budgetRequests[i].OrgName + '\', \'' + JSON.stringify(budgetRequests[i]) + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                    //displayAlertDialog('xcx124332432 budgetRequests[i].bwRequestJson: ' + JSON.stringify(budgetRequests[i]) + ', ' + budgetRequests[i].bwRequestJson);

                    var requestedCapital = 0;
                    if (JSON.parse(budgetRequests[i].bwRequestJson).RequestedCapital && JSON.parse(budgetRequests[i].bwRequestJson).RequestedCapital.value) {
                        requestedCapital = JSON.parse(budgetRequests[i].bwRequestJson).RequestedCapital
                    }

                    //var bwRequestJson = {
                    //    bwBudgetRequestId: bwBudgetRequestId,
                    //    Title: budgetRequests[i].Title,
                    //    ProjectTitle: budgetRequests[i].ProjectTitle,
                    //    OrgId: budgetRequests[i].OrgId,
                    //    OrgName: budgetRequests[i].OrgName,
                    //    Created: budgetRequests[i].Created,
                    //    CreatedBy: budgetRequests[i].CreatedBy,
                    //    RequestedCapital: requestedCapital,
                    //    BudgetWorkflowStatus: JSON.parse(budgetRequests[i].bwRequestJson).BudgetWorkflowStatus,
                    //    BriefDescriptionOfProject: JSON.parse(budgetRequests[i].bwRequestJson).BriefDescriptionOfProject
                    //}
                    html += ' onmouseenter="$(\'.bwCoreComponent:first\').bwCoreComponent(\'showRowHoverDetails\', \'' + bwEncodeURIComponent(JSON.stringify(budgetRequests[i])) + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                    html += ' onmouseleave="$(\'.bwCoreComponent:first\').bwCoreComponent(\'hideRowHoverDetails\');this.style.backgroundColor=\'white\';"';
                    html += '   ><img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg"></td>';


                    // Location
                    //html += '      <td style="padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');">';
                    //html += '      <td style="padding:5px;" ';
                    //html += '       <img id="orgImage_' + i + '" style="width:40px;height:40px;" src="' + thiz.options.operationUriPrefix + 'images/corporeal.png" />';
                    //html += budgetRequests[i].OrgName;
                    //html += '       </td>';
                    html += '   <td style="padding:5px;" ';
                    html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + this.options.userSelectedFilter.trashBin + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                    html += '   >';
                    html += '       <img id="orgImage_' + i + '" style="width:40px;height:40px;" src="' + thiz.options.operationUriPrefix + 'images/corporeal.png" />';
                    html += budgetRequests[i].OrgName;
                    html += '   </td>';












                    // Request #
                    //html += '      <td style="padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');">' + budgetRequests[i].Title + '</td>';
                    //html += '      <td style="padding:5px;">' + budgetRequests[i].Title + '</td>';
                    html += '   <td style="padding:5px;" ';
                    html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + this.options.userSelectedFilter.trashBin + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                    html += '   >' + '<span style="white-space:nowrap;">' + budgetRequests[i].Title + '</span></td>';



                    // Description
                    //html += '      <td style="padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');">' + budgetRequests[i].ProjectTitle + '</td>';
                    //html += '      <td style="padding:5px;">' + budgetRequests[i].ProjectTitle + '</td>';
                    html += '   <td style="padding:5px;" ';
                    html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + this.options.userSelectedFilter.trashBin + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';

                    // 2-8-2022
                    html += '   >' + ProjectTitle_clean + '</td>';
                    //var ProjectTitle_clean = budgetRequests[i].ProjectTitle.replace((/["]/g, '&quot;'));
                    //html += '   >' + ProjectTitle_clean + '</td>';



                    // Fiscal year
                    html += '   <td style="padding:5px;" ';
                    html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + this.options.userSelectedFilter.trashBin + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                    html += '   >' + budgetRequests[i].bwFiscalYear + '</td>';





                    // Request Type Id.
                    //html += '      <td style="padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');">' + budgetRequests[i].bwRequestType + '</td>';
                    //html += '      <td style="padding:5px;">' + budgetRequests[i].bwRequestType + '</td>';
                    html += '   <td style="padding:5px;" ';
                    html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + this.options.userSelectedFilter.trashBin + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                    html += '   >' + budgetRequests[i].bwRequestTypeId + '</td>';


                    // Created Date
                    var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(budgetRequests[i].Created);
                    html += '   <td style="padding:5px;" ';
                    html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + this.options.userSelectedFilter.trashBin + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                    //html += '   >' + getFriendlyDateAndTime(budgetRequests[i].Created) + '</td>';
                    html += '   >' + timestamp4 + '</td>';



                    // Financial Area
                    var displayFinancialArea = false;
                    //for (var x = 0; x < BWMData[0].length; x++) { // removed 12-28-2022.
                    //    if (BWMData[0][x][0] == workflowAppId) {
                    //        for (var y = 0; y < BWMData[0][x][4].length; y++) {
                    //            if (displayFinancialArea == false && BWMData[0][x][4][y][0] == budgetRequests[i].FunctionalAreaId) {
                    //                // We have found the financial area, so we have the title! Yay!
                    //                var faTitle = BWMData[0][x][4][y][1];
                    //                //html += '<td style="padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');" >';
                    //                //html += '<td style="padding:5px;">';
                    //                //html += faTitle;
                    //                //html += '</td>';
                    //                html += '   <td style="padding:5px;" ';
                    //                html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + thiz.options.operationUriPrefix + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                    //                html += '   >' + faTitle + '</td>';
                    //                displayFinancialArea = true;
                    //            }
                    //        }
                    //    }
                    //}

                    if (displayFinancialArea == false) {
                        //html += '<td style="padding:5px;"></td>';
                        html += '   <td style="padding:5px;" ';
                        html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + this.options.userSelectedFilter.trashBin + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                        html += '   ></td>';
                    }



                    // Org Id
                    html += '   <td style="padding:5px;" ';
                    html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + this.options.userSelectedFilter.trashBin + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                    html += '   >';
                    //html += '       <img id="orgImage_' + i + '" style="width:40px;height:40px;" src="' + thiz.options.operationUriPrefix + 'images/corporeal.png" />';
                    html += budgetRequests[i].OrgId;
                    html += '   </td>';




                    // Use this to retrieve the images after the fact, farther below in this code.
                    var orgImageFetchingInformation = {
                        imageId: 'orgImage_' + i,
                        bwOrgId: budgetRequests[i].OrgId
                    };
                    orgsImageFetchingInformation.push(orgImageFetchingInformation);



                    // Status
                    //html += '    <td style="padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');">' + budgetRequests[i].BudgetWorkflowStatus + '</td>';
                    //html += '    <td style="padding:5px;">' + budgetRequests[i].BudgetWorkflowStatus + '</td>';
                    html += '   <td style="padding:5px;" ';
                    html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + this.options.userSelectedFilter.trashBin + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                    html += '   >' + budgetRequests[i].BudgetWorkflowStatus + '</td>';

                    // ARStatus
                    //html += '    <td style="padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');">' + budgetRequests[i].ARStatus + '</td>';
                    //html += '    <td style="padding:5px;">' + budgetRequests[i].ARStatus + '</td>';
                    html += '   <td style="padding:5px;" ';
                    html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + this.options.userSelectedFilter.trashBin + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                    html += '   >' + budgetRequests[i].ARStatus + '</td>';

                    // Current Owner(s)
                    //html += '    <td style="padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');">' + budgetRequests[i].CurrentOwner + '</td>';
                    //html += '    <td style="padding:5px;">' + budgetRequests[i].CurrentOwner + '</td>';
                    html += '   <td style="padding:5px;" ';
                    html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + this.options.userSelectedFilter.trashBin + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                    html += '   ><span style="color:purple;font-weight:bold;">' + budgetRequests[i].CurrentOwner + '</span></td>';

                    // Capital Cost
                    html += '    <td style="text-align:right;">';
                    html += formatCurrency(budgetRequests[i].RequestedCapital);
                    html += '   </td>';
                    // Expense
                    html += '    <td style="text-align:right;">';
                    html += formatCurrency(budgetRequests[i].RequestedExpense);
                    html += '</td>';
                    // Lease
                    html += '    <td>na</td>';
                    // Total. Strikethrough the budget amount for a rejected AR.
                    if (budgetRequests[i].ARStatus == 'Rejected') {
                        //html += '    <td style="text-align:right;padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');"><strike>' + formatCurrency(budgetRequests[i].BudgetAmount) + '</strike></td>';
                        //html += '    <td style="text-align:right;padding:5px;"><strike>' + formatCurrency(budgetRequests[i].BudgetAmount) + '</strike></td>';
                        html += '   <td style="text-align:right;padding:5px;" ';
                        html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + this.options.userSelectedFilter.trashBin + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                        html += '   >' + '<strike>' + formatCurrency(budgetRequests[i].BudgetAmount) + '</strike>' + '</td>';

                    } else {
                        //html += '    <td style="text-align:right;padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');">' + formatCurrency(budgetRequests[i].BudgetAmount) + '</td>';
                        //html += '    <td style="text-align:right;padding:5px;">' + formatCurrency(budgetRequests[i].BudgetAmount) + '</td>';
                        html += '   <td style="text-align:right;padding:5px;" ';
                        html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + this.options.userSelectedFilter.trashBin + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                        html += '   >' + formatCurrency(budgetRequests[i].BudgetAmount) + '</td>';

                    }

                    html += '    <td>';
                    //tempCloseOutXml = budgetRequests[i].bwDocumentXml;
                    html += '       <a href="javascript:displayForm_DisplayCloseOut();" style="white-space:nowrap;">Close Out</a>';
                    html += '    </td>';

                    // Simple Payback
                    html += '    <td style="text-align:center;">Nox</td>';





                    // Modified Date
                    var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(budgetRequests[i].Modified);
                    //html += '    <td style="text-align:center;">' + getFriendlyDateAndTime(budgetRequests[i].Modified) + '</td>';
                    html += '    <td style="text-align:center;">' + timestamp4 + '</td>';




                    // Trash Bin
                    html += '<td style="padding:5px;" onclick="$(\'.bwDataGrid\').bwDataGrid(\'cmdDisplayDeleteBudgetRequestDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\');">';
                    html += '  <img src="images/trash-can.png" title="Delete" style="cursor:pointer;" />';
                    html += '</td>';

                    html += '  </tr>';
                    //for (var x = 0; x < supplementals[i].length; x++) {
                    //    // Display the supplementals.
                    //    html += '  <tr style="font-style:italic;font-size:small;">';
                    //    //html += '      <td><a href="javascript:displayArOnTheHomePage(\'' + supplementals[i][x].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + supplementals[i][x].Title + '\');">' + supplementals[i][x].ProjectTitle + '</a></td>';
                    //    html += '      <td><a onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + supplementals[i][x].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + supplementals[i][x].Title + '\');">' + supplementals[i][x].ProjectTitle + '</a></td>';

                    //    console.log('COMMENTED OUT BWMData 7-19-2024. WHY WAS THIS STILL HERE?????????????????????????');
                    //    //for (var x2 = 0; x2 < BWMData[0].length; x2++) { // COMMENTED OUT 7-19-2024.
                    //    //    if (BWMData[0][x2][0] == workflowAppId) {
                    //    //        for (var y = 0; y < BWMData[0][x2][4].length; y++) {
                    //    //            if (BWMData[0][x2][4][y][0] == supplementals[i][x].FunctionalAreaId) {
                    //    //                // We have found the financial area, so we have the title! Yay!
                    //    //                var faTitle = BWMData[0][x2][4][y][1];
                    //    //                html += '<td>';
                    //    //                html += faTitle;
                    //    //                html += '</td>';
                    //    //            }
                    //    //        }
                    //    //    }
                    //    //}
                    //    html += '    <td style="text-align:right;">' + supplementals[i][x].BudgetAmount + '</td>';
                    //    html += '    <td>' + supplementals[i][x].BudgetWorkflowStatus + '</td>';
                    //    html += '    <td></td>';
                    //    html += '    <td>' + supplementals[i][x].CurrentOwner + '</td>';
                    //    html += '  </tr>';
                    //}
                }
                html += '<tr><td colspan="12"></td></tr>'; // DONE
                html += '</table>';



                html += '</div>';





                //$('#spanBwBudgetRequests').append(html);

                //debugger;
                // Render the html.
                //thiz.element.html(html);
                $('#divBwDataGrid_Content').html(html); // 2-7-2022







                $(thiz.element).find('#divBwStartDatePicker').bwStartDatePicker({
                    inVisualizations: true,
                    allowRequestModifications: true
                });
                $(thiz.element).find('#divBwEndDatePicker').bwEndDatePicker({
                    inVisualizations: true,
                    allowRequestModifications: true
                });

                // Resize the div to accomodate a small/short table length. If the table limit is small, etc. // divDataGridTable, dataGridTable
                console.log('$(\'#dataGridTable\').height(): ' + $('#dataGridTable').height() + ', $(\'#divDataGridTable\').height(): ' + $('#divDataGridTable').height());
                if ($('#dataGridTable').height() < 500) {
                    $('#divDataGridTable').height($('#dataGridTable').height());
                } else {
                    if ($('#dataGridTable').height() < $('#divDataGridTable').height()) {
                        // The div is too short, so resetting here to force it to scroll. We need it to scroll in order for the data paging to work.
                        console.log('The div is too short, so resetting here to force it to scroll. We need it to scroll in order for the data paging to work.');
                        $('#divDataGridTable').height($('#dataGridTable').height() - 50);
                    }
                }


                //debugger;
                // Populate the year drop down.
                $('.bwCoreComponent').bwCoreComponent('populateTheYearDropdown', 'ddlYear', false);

                //// Use this to retrieve the images after the fact, farther below in this code.
                //var orgImageFetchingInformation = {
                //    imageId: 'orgImage_root',
                //    bwOrgId: 'root'
                //};
                //orgsImageFetchingInformation.push(orgImageFetchingInformation);

                //
                // Render the custom Org images
                //
                //debugger;

                var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });

                var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));


                for (var i = 0; i < orgsImageFetchingInformation.length; i++) {
                    if (orgsImageFetchingInformation[i].bwOrgId) {


                        console.log('xcx213121243214234-8 fix the image url here....');

                        var imagePath = '';

                        if (activeStateIdentifier.status != 'SUCCESS') {

                            imagePath = '[No image. Unauthorized. xcx213124-34556-77-00]';

                        } else {
                            if (!workflowAppId) {
                                alert('ERROR xcx5554322');
                            }
                            imagePath = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/orgimages/' + orgsImageFetchingInformation[i].bwOrgId + '/orgimage.png?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;

                        }

                        var lookForOrgImage = function (imagePath, i) {
                            return new Promise(function (resolve, reject) {
                                $.get(imagePath).done(function () {
                                    var img = new Image();
                                    img.src = imagePath;
                                    img.onload = function (e) {
                                        try {
                                            if (document.getElementById(orgsImageFetchingInformation[i].imageId)) { // 1-2-2022
                                                document.getElementById(orgsImageFetchingInformation[i].imageId).src = imagePath;
                                            }
                                            resolve();
                                        } catch (e) {
                                            console.log('Exception in bwDataGrid.js.xx-1().img.onload(): ' + e.message + ', ' + e.stack);
                                            alert('Exception in xx().img.onload(): ' + e.message + ', ' + e.stack);
                                            reject();
                                        }
                                    }
                                }).fail(function () {
                                    // do nothing, it just didn't find an image.
                                    resolve();
                                });
                            });
                        }
                        lookForOrgImage(imagePath, i);
                    }
                }



                //alert('xcx231233 trashbin menu...');


                ////
                //// This is our ellipsis context menu. MIT license and code at: https://swisnl.github.io/jQuery-contextMenu/demo/trigger-custom.html
                //$.contextMenu({
                //    selector: '.context-menu-one',
                //    callback: function (key, options) {
                //        //var m = "clicked: " + key;
                //        //window.console && console.log(m) || alert(m);
                //        if (key == 'viewtrashbincontents') {
                //            //alert('This functionality is incomplete. Coming soon!');
                //            thiz.displayTrashBinContents();
                //        } else if (key == 'viewextendedinformation') {
                //            //alert('This functionality is incomplete. Coming soon!');
                //            cmdDisplayArchivePageExtendedInformation();
                //        }
                //    },
                //    items: {
                //        "viewtrashbincontents": { name: "View Trashbin contents", icon: "fa-trash" }, // images/trash-can.png  // 🗑
                //        "viewextendedinformation": { name: "View Extended information", icon: "edit" }//,
                //        //copy: { name: "Copy", icon: "copy" },
                //        //"paste": { name: "Paste", icon: "paste" },
                //        //"delete": { name: "Delete", icon: "delete" },
                //        //"sep1": "---------",
                //        //"quit": {
                //        //    name: "Quit", icon: function () {
                //        //        return 'context-menu-icon context-menu-icon-quit';
                //        //    }
                //        //}
                //    }
                //});
                //$('#spanArchiveAdditionalOptionsEllipsis').on('click', function (e) {
                //    e.preventDefault();
                //    var x = e.clientX;
                //    var y = e.clientY;
                //    //$('.context-menu-one').contextMenu({ x: x, y: y });
                //    $('.context-menu-one').contextMenu(); //{ x: x, y: y }); // specifying x and y here doesn't work for left click. We need to get the left click position workng at some point but no biggie at this time.

                //    // or $('.context-menu-one').trigger("contextmenu");
                //    // or $('.context-menu-one').contextMenu({x: 100, y: 100});
                //});
                //$('.context-menu-one').on('click', function (e) {
                //    //console.log('clicked', this);
                //    if (this == 'viewtrashbincontents') {
                //        alert('This functionality is incomplete. Coming soon!');
                //    } else if (this == 'viewextendedinformation') {
                //        alert('This functionality is incomplete. Coming soon!');
                //    } //else {
                //    //alert('Error: Unexpected value for context menu.');
                //    //}
                //})
                //// End: This is our ellipsis context menu.
                ////

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

            }

        } catch (e) {
            console.log('Exception in bwDataGrid.jsdisplayDetailedList(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwDataGrid.jsdisplayDetailedList(): ' + e.message + ', ' + e.stack);
        }
    },











    displayingTrashBinContents_Checkbox_OnChange: function (checkboxElement) {
        try {
            console.log('In bwDataGrid.js.displayingTrashBinContents_Checkbox_OnChange().');

            var checked = $(checkboxElement).prop('checked');

            if (checked != true) {

                // This means the user wants the display to revert to the original (not displaying the TrashBin items).
                document.getElementById('bwDataGrid_DisplayingTrashBinContents_OnOffLink').style.display = 'none';
                this.options.userSelectedFilter.trashBin = false;

                // Hide in the top header bar.
                //$('#divTopBar_Long_Error').html('');
                $('.bwActiveMenu').bwActiveMenu('displayTopBarErrorMessage', '');

                this.renderDetailedListOrExecutiveSummary();

            } else {
                // We should never get here.
                this.options.userSelectedFilter.trashBin = true;
            }

        } catch (e) {
            console.log('Exception in bwDataGrid.js.displayingTrashBinContents_Checkbox_OnChange(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwDataGrid.js.displayingTrashBinContents_Checkbox_OnChange(): ' + e.message + ', ' + e.stack);
        }
    },

    displayTrashBinContents: function () {
        try {
            // The user has chosen to view the TrashBin contents.
            console.log('In bwDataGrid.js.displayTrashBinContents().');
            var thiz = this;

            document.getElementById('bwDataGrid_DisplayingTrashBinContents_OnOffLink').style.display = 'inline'; // Display the "Displaying TrashBin Contents" checkbox and text. This is how the user can turn off the viewing of the TrashBin.
            $('#bwDataGrid_DisplayingTrashBinContents_OnOffLink').find('input[type=checkbox]').prop('checked', true); // Set the checkbox to 'checked', because we are displaying the TrashBin contents.

            // Display in the top header bar.
            //$('#divTopBar_Long_Error').html('<span style="color:red;font-weight:bold;">Displaying TrashBin Contents</span>');
            $('.bwActiveMenu').bwActiveMenu('displayTopBarErrorMessage', '<span style="color:red;font-weight:bold;">Displaying TrashBin Contents</span>');

            this.options.userSelectedFilter.trashBin = true; // This is what makes sure we display the TrashBin.

            //
            // The user has chosen to view the TrashBin items.
            //

            // Step 1: Reload all of the data.
            this.renderDetailedListOrExecutiveSummary();

        } catch (e) {
            console.log('Exception in bwDataGrid.js.displayTrashBinContents(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwDataGrid.js.displayTrashBinContents(): ' + e.message + ', ' + e.stack);
        }
    },

    searchBox_OnKeyDown: function (event) {
        try {
            console.log('In bwDataGrid.js.searchBox_OnKeyDown().');

            if (event.keyCode == 13) {
                console.log('Enter key was pressed.');
                this.search();
            }

        } catch (e) {
            console.log('Exception in bwDataGrid.js.searchBox_OnKeyDown(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwDataGrid.js.searchBox_OnKeyDown(): ' + e.message + ', ' + e.stack);
        }
    },
    search: function () {
        try {
            console.log('In bwDataGrid.js.search().');
            alert('In bwDataGrid.js.search().');
            var thiz = this;
            // search in bwBudgetRequest:
            //      - title (eg: BR-220002)
            //      - project title (eg: partial description text)
            //      - 

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            var searchTerm = String($('#inputBwAuthentication_SearchBox').val()).trim();

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

                            thiz.options.BudgetRequests = results.data;

                            thiz.displayExecutiveSummaries();


                            //alert('In bwDataGrid.js.search.getsearchresults.success(). results: ' + JSON.stringify(results));

                            HideActivitySpinner();
                            ////thiz.collapseAllAlertsSection();

                            //var accordionDrawerElement = $('#divBwDataGrid_Content');

                            //var html = '';
                            //html += '<br /><div style="">Search results for "' + results.searchTerm + '" (' + results.data.length + '):</div>';
                            //$(accordionDrawerElement).html(html);

                            //for (var i = 0; i < results.data.length; i++) {
                            //    if (i < 100) { // This is where we set how many tasks we will display in the carousel. Zero-based, so < 5 means display 5 tasks.

                            //        var carouselItem_Id = 'bwDataGrid_executiveSummaryInCarousel_' + i;

                            //        var html = '';

                            //        html += '   <div id="' + carouselItem_Id + '" title="xcx231466534-1" alt="xcx231466534-1" class="executiveSummaryInCarousel" bwbudgetrequestid="' + results.data[i].bwBudgetRequestId + '" style="min-width:300px;max-width:550px;display:inline-block;white-space:nowrap;color: rgb(38, 38, 38); font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif; font-size: 1.25em;" ';

                            //        var ProjectTitle_clean = '[no value for ProjectTitle]';
                            //        if (results.data[i].ProjectTitle) {
                            //            ProjectTitle_clean = String(results.data[i].ProjectTitle).replace(/["]/g, '&quot;').replace(/[']/g, '\\&#39;'); //&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method. 
                            //        }
                            //        html += '   xcx="342523326-5"    onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'' + results.data[i].bwBudgetRequestId + '\', \'' + results.data[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + results.data[i].Title + '\', \'' + results.data[i].bwAssignedToRaciRoleAbbreviation + '\', \'' + '' + '\');" ';
                            //        html += '   >';

                            //        html += '</div>';

                            //        $(accordionDrawerElement).append(html);

                            //        console.log('Calling renderExecutiveSummaryForRequest(). xcx332-5');
                            //        //var promise = thiz.renderExecutiveSummaryForRequest(JSON.stringify(results.data[i]), accordionDrawerElement); //'divBwExecutiveSummariesCarousel_AllActiveRequests');
                            //        var promise = $('.bwExecutiveSummariesCarousel2').bwExecutiveSummariesCarousel2('renderExecutiveSummaryForRequest', JSON.stringify(results.data[i]), accordionDrawerElement);
                            //        promise.then(function (result) {
                            //            // Do nothing.
                            //        }).catch(function (e) {
                            //            alert('Exception xcx33995-2-dfssd-2: ' + e);
                            //        });

                            //    } else {
                            //        break;
                            //    }

                            //}

                        }

                    } catch (e) {
                        HideActivitySpinner();
                        console.log('Exception in bwDataGrid.js.search.getsearchresults.success(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwDataGrid.js.search.getsearchresults.success(): ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    HideActivitySpinner();
                    console.log('Error in bwDataGrid.js.search.getsearchresults.error(): ' + errorCode + ', ' + errorMessage + JSON.stringify(data));
                    displayAlertDialog('Error in bwDataGrid.js.search.getsearchresults.error(): ' + errorCode + ', ' + errorMessage + JSON.stringify(data));
                }
            });

        } catch (e) {
            HideActivitySpinner();
            console.log('Exception in bwDataGrid.js.search(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwDataGrid.js.search(): ' + e.message + ', ' + e.stack);
        }
    },
    locationFilterBox_OnKeyDown: function () {
        try {
            console.log('In bwDataGrid.js.locationFilterBox_OnKeyDown().');

            if (event.keyCode == 13) {

                console.log('In bwDataGrid.js.locationFilterBox_OnKeyDown(). The Enter key was pressed.');

                var searchTerm = $('#txtArchivePageLocationFilter').val().toLowerCase().trim();

                //var brData = this.options.BudgetRequests;

                //var filteredRequests = [];
                this.options.BudgetRequests_Filtered = [];

                if (!searchTerm) {

                    // We refresh the filtered list here.
                    this.options.BudgetRequests_Filtered = this.options.BudgetRequests;

                } else {

                    for (var i = 0; i < this.options.BudgetRequests.length; i++) {
                        if (this.options.BudgetRequests[i].OrgName.toLowerCase().indexOf(searchTerm) > -1) {
                            this.options.BudgetRequests_Filtered.push(this.options.BudgetRequests[i]);
                        }
                    }

                }

                alert('Found ' + this.options.BudgetRequests_Filtered.length + ' requests containing "' + searchTerm + '". xcx1234215');

                this.displayDetailedList();

            }

        } catch (e) {
            console.log('Exception in bwDataGrid.js.locationFilterBox_OnKeyDown(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwDataGrid.js.locationFilterBox_OnKeyDown(): ' + e.message + ', ' + e.stack);
        }
    },


    fiscalYearSelection_OnChange: function (elementId) {
        try {
            var selectedValue = document.getElementById(elementId).value;
            console.log('In fiscalYearSelection_OnChange(). selectedValue: ' + selectedValue);

            alert('In fiscalYearSelection_OnChange(). This functionality is incomplete. Coming soon!');

        } catch (e) {
            console.log('Exception in fiscalYearSelection_OnChange(): ' + e.message + ', ' + e.stack);
        }
    },


    ArchiveRequestTypeDropDown_Onchange: function (element) {
        try {
            console.log('In bwDataGrid.js.ArchiveRequestTypeDropDown_Onchange().');
            //alert('In bwDataGrid.js.ArchiveRequestTypeDropDown_Onchange().');
            var thiz = this;

            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            var LastSelected_ArchiveScreen_bwRequestTypeId = $('#selectRequestTypeDropDown option:selected').val();

            // Save the selected value back to the database so that it remembers how the participant left things, so it is the same when they come back.
            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                bwParticipantId: participantId,
                bwWorkflowAppId: workflowAppId,
                LastSelected_ArchiveScreen_bwRequestTypeId: LastSelected_ArchiveScreen_bwRequestTypeId
            };
            var operationUri = webserviceurl + "/bwparticipant/updateuserconfigurationselectedarchivescreenrequesttype";
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

                            console.log(results.message);
                            displayAlertDialog(results.message);

                        } else {

                            // Set the value here so that it persists locally, and we don't have to go back to the server to get it again.
                            $('.bwAuthentication').bwAuthentication('option', 'LastSelected_ArchiveScreen_bwRequestTypeId', LastSelected_ArchiveScreen_bwRequestTypeId);

                            thiz.renderDetailedListOrExecutiveSummary();
                            //thiz.loadDataAndRenderDetailedListOrExecutiveSummary();


















                        }

                    } catch (e) {
                        console.log('Exception in bwDataGrid.js.ArchiveRequestTypeDropDown_Onchange():1: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwDataGrid.js.ArchiveRequestTypeDropDown_Onchange():1: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in bwDataGrid.js.ArchiveRequestTypeDropDown_Onchange(): ' + errorCode + ' ' + errorMessage);
                    displayAlertDialog('Error in bwDataGrid.js.ArchiveRequestTypeDropDown_Onchange(): ' + errorCode + ' ' + errorMessage);
                }
            });

        } catch (e) {
            console.log('Exception in bwDataGrid.js.ArchiveRequestTypeDropDown_Onchange(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwDataGrid.js.ArchiveRequestTypeDropDown_Onchange(): ' + e.message + ', ' + e.stack);
        }
    },

    sortDataGrid: function (dataElement, sortOrder, element) {
        try {
            console.log('In sortDataGrid(). dataElement: ' + dataElement + ', sortOrder: ' + sortOrder);

            this.loadDataAndRenderDetailedListOrExecutiveSummary(dataElement, sortOrder);

            var imageElement = $(element).find('img')[0];
            imageElement.style.opacity = '1.0';

        } catch (e) {
            console.log('Exception in sortDataGrid(): ' + e.message + ', ' + e.stack);
        }
    },

    dataGrid_OnScroll: function (element, bwRequestTypeId) {
        try {
            console.log('In dataGrid_OnScroll().');
            alert('In dataGrid_OnScroll().');


            //debugger;
            //console.log('In dataGrid_OnScroll(). $(#dataGridTable).height(): ' + $('#dataGridTable').height() + ', $(element).height(): ' + $(element).height() + ', $(element).scrollTop(): ' + $(element).scrollTop()); //, $(document).height(): ' + $(document).height());
            //console.log('In dataGrid_OnScroll(). if ( ' + Math.trunc($('#dataGridTable').height()) + ' <= ' + Math.trunc($(element).height() + $(element).scrollTop()) + ' ) '); //, $(document).height(): ' + $(document).height());

            if (Math.trunc($('#dataGridTable').height()) <= Math.trunc($(element).height() + $(element).scrollTop())) {

                var thiz = this;

                //
                // The user has scrolled to the bottom, so we need to fetch another page of data and append to the div/table.
                //
                console.log('In dataGrid_OnScroll(). ajax call get data from server and append to the div. This should not happen a lot because the table will have been appended to the first time... this.options.pagingPage: ' + this.options.pagingPage);

                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

                var bwRequestTypeId = $('#selectRequestTypeDropDown option:selected').val(); // This is the drop-down at the top of the page.

                // These values will have been set already by the bwOrganizationPicker.js widget.
                var bwOrgId = $('#divPageContent1').find('.bwOrganizationPicker').bwOrganizationPicker('option', 'bwOrgId');
                var bwOrgName = $('#divPageContent1').find('.bwOrganizationPicker').bwOrganizationPicker('option', 'bwOrgName');

                var startDate = $('#divPageContent1').find('.bwStartDatePicker').bwStartDatePicker('getData').toUTCString();
                var endDate = $('#divPageContent1').find('.bwEndDatePicker').bwEndDatePicker('getData').toUTCString();

                this.options.pagingPage = this.options.pagingPage + 1; // Increment the page counter.

                var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                var data = {
                    bwParticipantId_LoggedIn: participantId,
                    bwActiveStateIdentifier: activeStateIdentifier,
                    bwWorkflowAppId_LoggedIn: workflowAppId,

                    //bwWorkflowAppId: workflowAppId,
                    //bwRequestTypeId: bwRequestTypeId,
                    //pagingPage: this.options.pagingPage,
                    //pagingLimit: this.options.pagingLimit

                    // Changed 5-23-2023.
                    TrashBin: this.options.userSelectedFilter.trashBin,
                    bwWorkflowAppId: workflowAppId,
                    bwRequestTypeId: bwRequestTypeId,
                    bwOrgId: bwOrgId,
                    StartDate: startDate,
                    EndDate: endDate,
                    pagingPage: this.options.pagingPage,
                    pagingLimit: this.options.pagingLimit
                }
                $.ajax({
                    url: webserviceurl + "/bwbudgetrequestsdataset2",
                    type: "POST",
                    data: data,
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    },
                    success: function (data) {
                        try {
                            //if (!data.length || data.length == 0) {
                            //    // Do nothing, we must be displaying all of the data.
                            //} else {
                            //    var html = '';
                            //    for (var i = 0; i < data.length; i++) {
                            //        html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onclick="$(\'.bwEmailMonitor\').bwEmailMonitor(\'viewSentEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwSentEmailId + '\');" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
                            //        html += '    <td style="vertical-align:top;"><input type="checkbox" class="sentEmailCheckbox" bwsentemailid="' + data[i].bwSentEmailId + '" /></td>';
                            //        var timestamp = getFriendlyDateAndTime(data[i].Timestamp);
                            //        html += '    <td colspan="4" style="border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px;">';
                            //        html += '       <span style="font-weight:bold;color:black;">' + data[i].ToParticipantFriendlyName + '<br />';
                            //        html += '           <span style="font-weight:normal;color:tomato;">' + timestamp + '</span>';
                            //        html += '           <br />';
                            //        html += '       </span>';
                            //        html += '       <span style="font-weight:lighter;color:#95b1d3;">' + data[i].Subject.substring(0, 55) + ' ...</span>';
                            //        html += '       <br />';
                            //        html += '   </td>';
                            //        html += '  </tr>';
                            //    }
                            //    $('#dataGridTable tr:last').after(html); // Append the rows to the table.
                            //}




                            if (!data.d) {

                                displayAlertDialog('Error in bwDataGrid.js.dataGrid_OnScroll():xcx1245. data: ' + JSON.stringify(data)); //Error!

                            } else {




                                //debugger; // are we getting these populated? 10-14-2020
                                var brData = data.d.results[0]; // Budget Requests.
                                var sData = data.d.results[1]; // Supplementals.
                                ////debugger;
                                //if (brData.length == 0 && sData.length == 0) {
                                //    //var html = '';
                                //    html += '<br /><br />';
                                //    html += '<span style="font-size:large;font-style:italic;">There have been no Budget Requests created in this workflow yet.</span>';
                                //    //$('#spanBwBudgetRequests').append(html);
                                //    // Render the html.
                                //    thiz.element.html(html);

                                //    //} else if (!budgetRequests[i].bwRequestJson) {
                                //    //    html += '<br /><br />';
                                //    //    html += '<span style="font-size:large;font-style:italic;">ERROR: Undefined bwRequestJson.</span>';
                                //    //    //$('#spanBwBudgetRequests').append(html);
                                //    //    // Render the html.
                                //    //    thiz.element.html(html);
                                //} else {
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

                                var orgsImageFetchingInformation = [];
                                var html = '';
                                var alternatingRow = 'light'; // Use this to color the rows.
                                //debugger;
                                for (var i = 0; i < budgetRequests.length; i++) {

                                    //debugger;
                                    //var imageUrl = 'https://budgetworkflow.com/_files/af316d1a-ca6d-4c1d-bf8d-66b05920292f/ac778618-4412-48c5-a282-5850e972fd36/edthetalkinghorse.jpg';

                                    var bwWorkflowAppId = budgetRequests[i].bwWorkflowAppId;
                                    var bwBudgetRequestId = budgetRequests[i].bwBudgetRequestId;
                                    var BriefDescriptionOfProject;
                                    if (budgetRequests[i].bwRequestJson) {
                                        BriefDescriptionOfProject = JSON.parse(budgetRequests[i].bwRequestJson).BriefDescriptionOfProject;
                                    } else {
                                        BriefDescriptionOfProject = 'ERROR: Invalid bwRequestJson.';
                                    }

                                    if (alternatingRow == 'light') {
                                        html += '<tr class="alternatingRowLight" style="cursor:pointer;" ';
                                        //html += ' onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + budgetRequests[i].Title + '\', \'' + budgetRequests[i].ProjectTitle + '\', \'' + BriefDescriptionOfProject + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\', \'' + budgetRequests[i].OrgId + '\', \'' + budgetRequests[i].OrgName + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                                        //html += ' onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');this.style.backgroundColor=\'white\';"';
                                        //html += ' onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + thiz.options.operationUriPrefix + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + budgetRequests[i].ProjectTitle + '\', \'' + budgetRequests[i].Title + '\');"';
                                        html += '>';
                                        alternatingRow = 'dark';
                                    } else {
                                        //html += '  <tr class="alternatingRowDark" style="cursor:pointer;" onmouseover="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + budgetRequests[i].Title + '\', \'' + budgetRequests[i].ProjectTitle + '\', \'' + JSON.parse(budgetRequests[i].bwRequestJson).BriefDescriptionOfProject + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\', \'' + budgetRequests[i].OrgId + '\', \'' + budgetRequests[i].OrgName + '\');"  >';
                                        html += '<tr class="alternatingRowDark" style="cursor:pointer;" ';
                                        //html += ' onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + budgetRequests[i].Title + '\', \'' + budgetRequests[i].ProjectTitle + '\', \'' + BriefDescriptionOfProject + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\', \'' + budgetRequests[i].OrgId + '\', \'' + budgetRequests[i].OrgName + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                                        //html += ' onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');this.style.backgroundColor=\'whitesmoke\';"';
                                        //html += ' onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + thiz.options.operationUriPrefix + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + budgetRequests[i].ProjectTitle + '\', \'' + budgetRequests[i].Title + '\');"';
                                        html += '>';
                                        alternatingRow = 'light';
                                    }

                                    // Magnifying glass.
                                    html += '   <td style="padding:5px;" ';
                                    html += ' onmouseenter="$(\'.bwCoreComponent:first\').bwCoreComponent(\'showRowHoverDetails\', \'' + bwEncodeURIComponent(JSON.stringify(budgetRequests[i])) + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                                    //html += ' onmouseenter="$(\'.bwCoreComponent:first\').bwCoreComponent(\'showRowHoverDetails\', \'' + 'xcx454667' + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                                    html += ' onmouseleave="$(\'.bwCoreComponent:first\').bwCoreComponent(\'hideRowHoverDetails\');this.style.backgroundColor=\'white\';"';
                                    html += '   ><img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg"></td>';




                                    // Location
                                    //html += '      <td style="padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');">';
                                    //html += '      <td style="padding:5px;" ';
                                    //html += '       <img id="orgImage_' + i + '" style="width:40px;height:40px;" src="' + thiz.options.operationUriPrefix + 'images/corporeal.png" />';
                                    //html += budgetRequests[i].OrgName;
                                    //html += '       </td>';

                                    // 2-8-2022
                                    var ProjectTitle_clean = String(budgetRequests[i].ProjectTitle).replace(/["]/g, '&quot;').replace(/[']/g, '&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method.

                                    if (budgetRequests[i].ProjectTitle == '10x bilge pump system hatch #2') {
                                        alert('xcx1234232344');
                                        debugger;
                                    }




                                    html += '   <td style="padding:5px;" ';
                                    html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + this.options.userSelectedFilter.trashBin + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                                    html += '   >';
                                    html += '       <img id="orgImage_' + i + '" style="width:40px;height:40px;" src="' + thiz.options.operationUriPrefix + 'images/corporeal.png" />';
                                    html += budgetRequests[i].OrgName;
                                    html += '   </td>';



                                    // Request #
                                    //html += '      <td style="padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');">' + budgetRequests[i].Title + '</td>';
                                    //html += '      <td style="padding:5px;">' + budgetRequests[i].Title + '</td>';
                                    html += '   <td style="padding:5px;" ';
                                    html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + this.options.userSelectedFilter.trashBin + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                                    html += '   >' + budgetRequests[i].Title + '</td>';




                                    // Description
                                    //html += '      <td style="padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');">' + budgetRequests[i].ProjectTitle + '</td>';
                                    //html += '      <td style="padding:5px;">' + budgetRequests[i].ProjectTitle + '</td>';
                                    html += '   <td style="padding:5px;" ';
                                    html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + this.options.userSelectedFilter.trashBin + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                                    //html += '   >' + budgetRequests[i].ProjectTitle + '</td>'; // 
                                    html += '   >' + ProjectTitle_clean + '</td>';


                                    // Fiscal year.
                                    html += '   <td style="padding:5px;" ';
                                    html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + this.options.userSelectedFilter.trashBin + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                                    html += '   >' + budgetRequests[i].bwFiscalYear + '</td>';


                                    // Request Type.
                                    //html += '      <td style="padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');">' + budgetRequests[i].bwRequestType + '</td>';
                                    //html += '      <td style="padding:5px;">' + budgetRequests[i].bwRequestType + '</td>';
                                    html += '   <td style="padding:5px;" ';
                                    html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + this.options.userSelectedFilter.trashBin + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                                    html += '   >' + budgetRequests[i].bwRequestTypeId + '</td>';


                                    // Created Date
                                    var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(budgetRequests[i].Created);
                                    html += '   <td style="padding:5px;" ';
                                    html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + this.options.userSelectedFilter.trashBin + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                                    //html += '   >' + getFriendlyDateAndTime(budgetRequests[i].Created) + '</td>';
                                    html += '   >' + timestamp4 + '</td>';





                                    //// Financial Area
                                    var displayFinancialArea = false;
                                    //for (var x = 0; x < BWMData[0].length; x++) {
                                    //    if (BWMData[0][x][0] == workflowAppId) {
                                    //        for (var y = 0; y < BWMData[0][x][4].length; y++) {
                                    //            if (displayFinancialArea == false && BWMData[0][x][4][y][0] == budgetRequests[i].FunctionalAreaId) {
                                    //                // We have found the financial area, so we have the title! Yay!
                                    //                var faTitle = BWMData[0][x][4][y][1];
                                    //                //html += '<td style="padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');" >';
                                    //                //html += '<td style="padding:5px;">';
                                    //                //html += faTitle;
                                    //                //html += '</td>';


                                    //                // 2-8-2022
                                    //                var ProjectTitle_clean = String(budgetRequests[i].ProjectTitle).replace(/["]/g, '&quot;').replace(/[']/g, '&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method. 

                                    //                html += '   <td style="padding:5px;" ';
                                    //                html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + thiz.options.TrashBin + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                                    //                html += '   >' + faTitle + '</td>';
                                    //                displayFinancialArea = true;
                                    //            }
                                    //        }
                                    //    }
                                    //}


                                    // 2-8-2022
                                    //var ProjectTitle_clean = String(budgetRequests[i].ProjectTitle).replace(/["]/g, '&quot;').replace(/[']/g, '&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method. 


                                    if (displayFinancialArea == false) {
                                        //html += '<td style="padding:5px;"></td>';



                                        html += '   <td style="padding:5px;" ';
                                        html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + this.options.userSelectedFilter.trashBin + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                                        html += '   ></td>';
                                    }




                                    // Org Id
                                    html += '   <td style="padding:5px;" ';
                                    html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + this.options.userSelectedFilter.trashBin + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                                    html += '   >';
                                    //html += '       <img id="orgImage_' + i + '" style="width:40px;height:40px;" src="' + thiz.options.operationUriPrefix + 'images/corporeal.png" />';
                                    html += budgetRequests[i].OrgId;
                                    html += '   </td>';

                                    // Use this to retrieve the images after the fact, farther below in this code.
                                    var orgImageFetchingInformation = {
                                        imageId: 'orgImage_' + i,
                                        bwOrgId: budgetRequests[i].OrgId
                                    };
                                    orgsImageFetchingInformation.push(orgImageFetchingInformation);



                                    // Status
                                    //html += '    <td style="padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');">' + budgetRequests[i].BudgetWorkflowStatus + '</td>';
                                    //html += '    <td style="padding:5px;">' + budgetRequests[i].BudgetWorkflowStatus + '</td>';
                                    html += '   <td style="padding:5px;" ';
                                    html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + this.options.userSelectedFilter.trashBin + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                                    html += '   >' + budgetRequests[i].BudgetWorkflowStatus + '</td>';

                                    // ARStatus
                                    //html += '    <td style="padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');">' + budgetRequests[i].ARStatus + '</td>';
                                    //html += '    <td style="padding:5px;">' + budgetRequests[i].ARStatus + '</td>';
                                    html += '   <td style="padding:5px;" ';
                                    html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + this.options.userSelectedFilter.trashBin + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                                    html += '   >' + budgetRequests[i].ARStatus + '</td>';

                                    // Current Owner(s)
                                    //html += '    <td style="padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');">' + budgetRequests[i].CurrentOwner + '</td>';
                                    //html += '    <td style="padding:5px;">' + budgetRequests[i].CurrentOwner + '</td>';
                                    html += '   <td style="padding:5px;" ';
                                    html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + this.options.userSelectedFilter.trashBin + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                                    html += '   ><span style="color:purple;font-weight:bold;">' + budgetRequests[i].CurrentOwner + '</span></td>';

                                    // Capital Cost
                                    html += '    <td style="text-align:right;">';
                                    html += formatCurrency(budgetRequests[i].RequestedCapital);
                                    html += '   </td>';
                                    // Expense
                                    html += '    <td style="text-align:right;">';
                                    html += formatCurrency(budgetRequests[i].RequestedExpense);
                                    html += '</td>';
                                    // Lease
                                    html += '    <td>na</td>';
                                    // Total. Strikethrough the budget amount for a rejected AR.
                                    if (budgetRequests[i].ARStatus == 'Rejected') {
                                        //html += '    <td style="text-align:right;padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');"><strike>' + formatCurrency(budgetRequests[i].BudgetAmount) + '</strike></td>';
                                        //html += '    <td style="text-align:right;padding:5px;"><strike>' + formatCurrency(budgetRequests[i].BudgetAmount) + '</strike></td>';
                                        html += '   <td style="text-align:right;padding:5px;" ';
                                        html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + this.options.userSelectedFilter.trashBin + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                                        html += '   >' + '<strike>' + formatCurrency(budgetRequests[i].BudgetAmount) + '</strike>' + '</td>';

                                    } else {
                                        //html += '    <td style="text-align:right;padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');">' + formatCurrency(budgetRequests[i].BudgetAmount) + '</td>';
                                        //html += '    <td style="text-align:right;padding:5px;">' + formatCurrency(budgetRequests[i].BudgetAmount) + '</td>';
                                        html += '   <td style="text-align:right;padding:5px;" ';
                                        html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + this.options.userSelectedFilter.trashBin + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                                        html += '   >' + formatCurrency(budgetRequests[i].BudgetAmount) + '</td>';

                                    }

                                    //html += '    <td>';
                                    //tempCloseOutXml = budgetRequests[i].bwDocumentXml;
                                    //html += '       <a href="javascript:displayForm_DisplayCloseOut();" style="white-space:nowrap;">Close Out</a>';
                                    //html += '    </td>';

                                    // Simple Payback
                                    html += '    <td style="text-align:center;">Nox</td>';

                                    // Modified Date
                                    var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(budgetRequests[i].Modified);
                                    //html += '    <td style="text-align:center;">' + getFriendlyDateAndTime(budgetRequests[i].Modified) + '</td>';
                                    html += '    <td style="text-align:center;">' + timestamp4 + '</td>';



                                    // Trash Bin
                                    html += '<td style="padding:5px;" onclick="$(\'.bwDataGrid\').bwDataGrid(\'cmdDisplayDeleteBudgetRequestDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\');">';
                                    html += '  <img src="images/trash-can.png" title="Delete" style="cursor:pointer;" />';
                                    html += '</td>';

                                    html += '  </tr>';




                                    //for (var x = 0; x < supplementals[i].length; x++) {
                                    //    // Display the supplementals.
                                    //    html += '  <tr style="font-style:italic;font-size:small;">';

                                    //    var ProjectTitle_clean = String(supplementals[i][x].ProjectTitle).replace(/["]/g, '&quot;').replace(/[']/g, '&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method. 

                                    //    //html += '      <td><a href="javascript:displayArOnTheHomePage(\'' + supplementals[i][x].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + supplementals[i][x].Title + '\');">' + supplementals[i][x].ProjectTitle + '</a></td>';
                                    //    html += '      <td><a onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + supplementals[i][x].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + supplementals[i][x].Title + '\');">' + ProjectTitle_clean + '</a></td>';
                                    //    for (var x2 = 0; x2 < BWMData[0].length; x2++) {
                                    //        if (BWMData[0][x2][0] == workflowAppId) {
                                    //            for (var y = 0; y < BWMData[0][x2][4].length; y++) {
                                    //                if (BWMData[0][x2][4][y][0] == supplementals[i][x].FunctionalAreaId) {
                                    //                    // We have found the financial area, so we have the title! Yay!
                                    //                    var faTitle = BWMData[0][x2][4][y][1];
                                    //                    html += '<td>';
                                    //                    html += faTitle;
                                    //                    html += '</td>';
                                    //                }
                                    //            }
                                    //        }
                                    //    }
                                    //    html += '    <td style="text-align:right;">' + supplementals[i][x].BudgetAmount + '</td>';
                                    //    html += '    <td>' + supplementals[i][x].BudgetWorkflowStatus + '</td>';
                                    //    html += '    <td></td>';
                                    //    html += '    <td>' + supplementals[i][x].CurrentOwner + '</td>';
                                    //    html += '  </tr>';
                                    //}






                                }

                                //debugger;
                                $('#dataGridTable tr:last').after(html); // Append the rows to the table.

                                //
                                // Render the custom Org images
                                //
                                //debugger;
                                for (var i = 0; i < orgsImageFetchingInformation.length; i++) {
                                    if (orgsImageFetchingInformation[i].bwOrgId) {

                                        console.log('In bwDataGrid.js.dataGrid_OnScroll(). xcx213121243214234-9 fix the image url here....');
                                        if (!workflowAppId) {
                                            alert('ERROR xcx55543887');
                                        }
                                        var imagePath = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/orgimages/' + orgsImageFetchingInformation[i].bwOrgId + '/' + 'orgimage.png';
                                        var lookForOrgImage = function (imagePath, i) {
                                            return new Promise(function (resolve, reject) {
                                                $.get(imagePath).done(function () {
                                                    var img = new Image();
                                                    img.src = imagePath;
                                                    img.onload = function (e) {
                                                        try {
                                                            document.getElementById(orgsImageFetchingInformation[i].imageId).src = imagePath;
                                                            resolve();
                                                        } catch (e) {
                                                            console.log('Exception in bwDataGrid.js.xx-2().img.onload(): ' + e.message + ', ' + e.stack);
                                                            alert('Exception in xx().img.onload(): ' + e.message + ', ' + e.stack);
                                                            reject();
                                                        }
                                                    }
                                                }).fail(function () {
                                                    // do nothing, it just didn't find an image.
                                                    resolve();
                                                });
                                            });
                                        }
                                        lookForOrgImage(imagePath, i);
                                    }
                                }

                            }

                        } catch (e) {
                            console.log('Exception in dataGrid_OnScroll():1: ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in dataGrid_OnScroll():1: ' + e.message + ', ' + e.stack);
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        console.log('Error in dataGrid_OnScroll():' + errorCode + ', ' + errorMessage);
                        displayAlertDialog('Error in dataGrid_OnScroll():' + errorCode + ', ' + errorMessage);
                    }
                });
            }
        } catch (e) {
            console.log('Exception in dataGrid_OnScroll():2: ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in dataGrid_OnScroll():2: ' + e.message + ', ' + e.stack);
        }
    },

    cmdDisplayDeleteBudgetRequestDialog: function (requestId, title) {
        try {
            console.log('In bwDataGrid.js.cmdDisplayDeleteBudgetRequestDialog().');
            alert('In bwDataGrid.js.cmdDisplayDeleteBudgetRequestDialog().');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            data = {
                bwBudgetRequestId: requestId,
                bwWorkflowAppId: workflowAppId
            };
            var operationUri = webserviceurl + "/bwworkflow/itemizebudgetrequestdependencies";
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


                        $("#DeleteABudgetRequestDialog").dialog({
                            modal: true,
                            resizable: false,
                            closeText: "Cancel",
                            closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                            title: 'Delete ' + requestId,
                            width: "570px",
                            dialogClass: "no-close", // No close button in the upper right corner.
                            hide: false, // This means when hiding just disappear with no effects.
                            buttons: {
                                "Delete Budget Request": {
                                    text: 'Delete Budget Request, supplementals and tasks',
                                    id: 'btnDeleteABudgetRequest',
                                    disabled: 'true',
                                    click: function () {

                                        alert('xcx2131234132 DELETE');

                                        //var proceed = confirm('This action cannot be undone.\n\n\nClick the OK button to proceed...');
                                        //if (proceed) {
                                        cmdDeleteBudgetRequest(requestId);
                                        //debugger;
                                        // Refresh the screen.
                                        //populateStartPageItem('divArchivexx2', 'Reports', ''); // THIS IS OLD REPLACED BY renderArchive() 1-20-2020
                                        //renderArchive(); // THIS DOESN'T REFRESH THE DATA... hmmmmm


                                        // THIS IS NOT VERY EFFICIENT BUT WORKS FOR NOW. Ideally we would just remove the 1 entry to keep things in sync., :,
                                        //$('#divBwCoreComponent').bwCoreComponent('loadWorkflowAppConfigurationDetails9');

                                        thiz._create();
                                        //thiz.renderDataGrid(); // This reaches out again for the data. Not the most efficient network wise! Fix this at some point if it is an issue.

                                        $(this).dialog("close");
                                        //}
                                    }
                                },
                                "Cancel": function () {
                                    $(this).dialog("close");
                                }
                            },
                            open: function () {

                                var html = '';
                                if (data.NumberOfIncompleteTasksForBudgetRequest == 0 && data.NumberOfCompletedTasksForBudgetRequest == 0 && data.NumberOfSupplementals == 0) {
                                    html += 'This Budget Request has no dependencies, and can be deleted immediately.';
                                } else {
                                    html += 'When this Budget Request is deleted, the following will also be deleted:';
                                }
                                if (data.NumberOfIncompleteTasksForBudgetRequest > 0 || data.NumberOfCompletedTasksForBudgetRequest > 0) {
                                    html += '<ul>';
                                    if (data.NumberOfIncompleteTasksForBudgetRequest > 0) {
                                        html += '<li style="color:red;"><span style="color:black;">' + data.NumberOfIncompleteTasksForBudgetRequest + ' incomplete Task(s)</span></li>';
                                    }
                                    if (data.NumberOfCompletedTasksForBudgetRequest > 0) {
                                        html += '<li style="color:red;"><span style="color:black;">' + data.NumberOfCompletedTasksForBudgetRequest + ' completed Task(s)</span></li>';
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
                                document.getElementById('spanDeleteABudgetRequestDialogDependencyDetails').innerHTML = html;
















                            }
                        });

                        // Hide the title bar.
                        $("#DeleteABudgetRequestDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
                        // Set the title.
                        document.getElementById('spanDeleteABudgetRequestDialogTitle').innerHTML = 'Delete ' + title + '.';


                        // Make sure the send message checkbox is not selected to begin with.
                        document.getElementById('cbDeleteABudgetRequestDialogEmailMessage').removeAttribute('checked', '');
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



























                    }

                    // Show or hide the replacement user selection box depening if there are any dependencies.
                    if (data.NumberOfIncompleteTasksForBudgetRequest == 0 && data.NumberOfCompletedTasksForBudgetRequest == 0 && data.NumberOfSupplementals == 0) {
                        // There are no dependencies.
                        // Change the button text.
                        var dialogButtons = $('#DeleteABudgetRequestDialog').dialog('option', 'buttons');
                        $.each(dialogButtons, function (buttonIndex, button) {
                            if (button.id === 'btnDeleteABudgetRequest') {
                                button.text = 'Delete ' + requestId;
                                button.disabled = false;
                            }
                        })
                        $("#DeleteABudgetRequestDialog").dialog('option', 'buttons', dialogButtons);
                    } else {
                        // There ARE dependencies.
                        // Change the button text.
                        var dialogButtons = $('#DeleteABudgetRequestDialog').dialog('option', 'buttons');
                        $.each(dialogButtons, function (buttonIndex, button) {
                            if (button.id === 'btnDeleteABudgetRequest') {
                                button.text = 'Delete the Budget Request and all related items';
                                button.disabled = false;
                                button.style = 'color:red;';
                            }
                        })
                        $("#DeleteABudgetRequestDialog").dialog('option', 'buttons', dialogButtons);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    //handleExceptionWithAlert('Error in Start.js.displayConnectedWorkflows()', '1:' + errorCode + ', ' + errorMessage);
                    displayAlertDialog('Error in my.js.cmdDisplayDeleteBudgetRequestDialog().itemizebudgetrequestdependencies: ' + errorMessage);
                }
            });

        } catch (e) {
            console.log('Exception in bwDataGrid.js.cmdDisplayDeleteBudgetRequestDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwDataGrid.js.cmdDisplayDeleteBudgetRequestDialog(): ' + e.message + ', ' + e.stack);
        }
    }

    // OLD CODE MAY NEED IT
    //  renderDetailedListOrExecutiveSummary: function (sortDataElement, sortOrder) { //sortDataElement, sortOrder) {
    //    try {
    //        console.log('In bwDataGrid.js.renderDetailedListOrExecutiveSummary().');
    //        //alert('In bwDataGrid.js.renderDetailedListOrExecutiveSummary(). this.options.TrashBin: ' + this.options.TrashBin);
    //        var thiz = this;

    //        var offset = 0;
    //        var limit = 25;

    //        // Set the sort buttons to grayed-out. When one is selected by the user, we will set the opacity to 1.0 as a good visual indicator.
    //        var buttons = $('.dataGridTable_SortButton');
    //        for (var i = 0; i < buttons.length; i++) {
    //            buttons[i].style.opacity = '0.25';
    //        }

    //        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

    //        var bwRequestTypeId = $('#selectRequestTypeDropDown option:selected').val(); // This is the drop-down at the top of the page.

    //        // These values will have been set already by the bwOrganizationPicker.js widget.
    //        var bwOrgId = $('#divPageContent1').find('.bwOrganizationPicker').bwOrganizationPicker('option', 'bwOrgId');
    //        var bwOrgName = $('#divPageContent1').find('.bwOrganizationPicker').bwOrganizationPicker('option', 'bwOrgName');
    //        debugger;
    //        var startDate = $('#divPageContent1').find('.bwStartDatePicker').bwStartDatePicker('getData').toUTCString();
    //        var endDate = $('#divPageContent1').find('.bwEndDatePicker').bwEndDatePicker('getData').toUTCString();

    //        //this.options.pagingLimit = 15; // Only display x items at a time.
    //        //this.options.pagingPage = 0; // This is the page that is being displayed. This may be easier to use than offset? It is a zero based value.

    //        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
    //        var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

    //        var data;
    //        if (sortDataElement && sortOrder) {

    //            data = {
    //                bwParticipantId_LoggedIn: participantId,
    //                bwActiveStateIdentifier: activeStateIdentifier,
    //                bwWorkflowAppId_LoggedIn: workflowAppId,

    //                TrashBin: this.options.TrashBin,
    //                //bwWorkflowAppId: workflowAppId,
    //                bwRequestTypeId: bwRequestTypeId,
    //                bwOrgId: bwOrgId,
    //                StartDate: startDate,
    //                EndDate: endDate,
    //                //pagingPage: this.options.pagingPage,
    //                //pagingLimit: this.options.pagingLimit,
    //                //sort_dataElement: dataElement,
    //                //sort_sortOrder: sortOrder

    //                DisplaySupplementals: thiz.options.DisplaySupplementals,
    //                offset: offset,
    //                limit: limit,
    //                sortDataElement: sortDataElement,
    //                sortOrder: sortOrder
    //            }

    //        } else {

    //            data = {
    //                bwParticipantId_LoggedIn: participantId,
    //                bwActiveStateIdentifier: activeStateIdentifier,
    //                bwWorkflowAppId_LoggedIn: workflowAppId,

    //                TrashBin: this.options.TrashBin,
    //                //bwWorkflowAppId: workflowAppId,
    //                bwRequestTypeId: bwRequestTypeId,
    //                bwOrgId: bwOrgId,
    //                StartDate: startDate,
    //                EndDate: endDate,
    //                //pagingPage: this.options.pagingPage,
    //                //pagingLimit: this.options.pagingLimit

    //                DisplaySupplementals: thiz.options.DisplaySupplementals,
    //                offset: offset,
    //                limit: limit,
    //                sortDataElement: sortDataElement,
    //                sortOrder: sortOrder
    //            }

    //        }

    //        $.ajax({
    //            url: webserviceurl + '/getPagedDataFor_BudgetRequests',
    //            type: 'POST',
    //            data: data,
    //            headers: {
    //                "Accept": "application/json; odata=verbose"
    //            },
    //            success: function (results) {
    //                try {

    //                    if (results.status != 'SUCCESS') {

    //                        var msg = 'Error in bwDataGrid.js.renderDetailedListOrExecutiveSummary():xcx1245. ' + results.status + ', ' + results.message;
    //                        console.log(msg);
    //                        displayAlertDialog(msg);

    //                    } else {

    //                        debugger;
    //                        thiz.options.BudgetRequests = results.results;

    //                        var requestsSummaryDetails = thiz.options.BudgetRequests;
    //                        var requests = thiz.options.BudgetRequests.docs;

    //                        //
    //                        //
    //                        // Adding new paging status, sort bar, and paging UI.
    //                        //
    //                        //

    //                        console.log('xcx2131231. requestsSummaryDetails: ' + Object.keys(requestsSummaryDetails)); // docs,totalDocs,offset,limit,totalPages,page,pagingCounter,hasPrevPage,hasNextPage,prevPage,nextPage.

    //                        var msg = 'requestsSummaryDetails. totalDocs: ' + requestsSummaryDetails.totalDocs + ', offset: ' + requestsSummaryDetails.offset + ', limit: ' + requestsSummaryDetails.limit + ', totalPages: ' + requestsSummaryDetails.totalPages + ', page: ' + requestsSummaryDetails.page + ', pagingCounter: ' + requestsSummaryDetails.pagingCounter + ', hasPrevPage: ' + requestsSummaryDetails.hasPrevPage + ', hasNextPage: ' + requestsSummaryDetails.hasNextPage + ', prevPage: ' + requestsSummaryDetails.prevPage + ', nextPage: ' + requestsSummaryDetails.nextPage;
    //                        console.log(msg);
    //                        //displayAlertDialog(msg);

    //                        var html = '';

    //                        var startDocumentCounter = requestsSummaryDetails.offset + 1; // Because it is zero based.
    //                        var displayTotal = requestsSummaryDetails.page * requestsSummaryDetails.limit;

    //                        if (displayTotal > requestsSummaryDetails.totalDocs) {
    //                            displayTotal = requestsSummaryDetails.totalDocs;
    //                        }

    //                        // renderExecutiveSummaries_ACTIVE_REQUESTS
    //                        html += '<div xcx="xcx2131215455-1" id="divBwDataGrid_DocumentCount">Displaying ' + startDocumentCounter + ' to ' + displayTotal + ' of ' + requestsSummaryDetails.totalDocs + ' requests.&nbsp;&nbsp;&nbsp;&nbsp;'; // |<&nbsp;&nbsp;<&nbsp;&nbsp;>&nbsp;&nbsp;>|</div>';

    //                        var limit = thiz.options.userSelectedFilter.limit;
    //                        html += `<span>Requests per page: 
    //                        <select id="selectRequestsPerPage_ACTIVE_REQUESTS" onchange="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'selectRequestsPerPage\', \'ACTIVE_REQUESTS\', this);">`;

    //                        if (limit == 25) {
    //                            html += '<option selected="selected">25</option>';
    //                        } else {
    //                            html += '<option>25</option>';
    //                        }
    //                        if (limit == 50) {
    //                            html += '<option selected="selected">50</option>';
    //                        } else {
    //                            html += '<option>50</option>';
    //                        }
    //                        if (limit == 100) {
    //                            html += '<option selected="selected">100</option>';
    //                        } else {
    //                            html += '<option>100</option>';
    //                        }
    //                        if (limit == 200) {
    //                            html += '<option selected="selected">200</option>';
    //                        } else {
    //                            html += '<option>200</option>';
    //                        }

    //                        html += `   </select>
    //                    </span>`;
    //                        html += '&nbsp;&nbsp;';
    //                        html += `<div class="datasetNavigationButton" onclick="$(\'.bwDataGrid\').bwDataGrid(\'navigateRequests\', \'move_to_start\', this);">|<</div>`;
    //                        html += '&nbsp;&nbsp;';
    //                        html += `<div class="datasetNavigationButton" onclick="$(\'.bwDataGrid\').bwDataGrid(\'navigateRequests\', \'move_to_left\', this);"><</div>`;
    //                        html += '&nbsp;&nbsp;';
    //                        html += `<div class="datasetNavigationButton" onclick="$(\'.bwDataGrid\').bwDataGrid(\'navigateRequests\', \'move_to_right\', this);">></div>`;
    //                        html += '&nbsp;&nbsp;';
    //                        html += `<div class="datasetNavigationButton" onclick="$(\'.bwDataGrid\').bwDataGrid(\'navigateRequests\', \'move_to_end\', this);">>|</div>`;

    //                        var displaySupplementals = thiz.options.userSelectedFilter.displaySupplementals;
    //                        if (displaySupplementals == true) {
    //                            html += '&nbsp;&nbsp;<input type="checkbox" checked="checked" id="bwExecutiveSummariesCarousel2_DisplaySupplementals_Checkbox" onchange="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'toggleDisplaySupplementals\', this);" />Display Supplementals/Addendums.';
    //                        } else {
    //                            html += '&nbsp;&nbsp;<input type="checkbox" id="bwExecutiveSummariesCarousel2_DisplaySupplementals_Checkbox" onchange="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'toggleDisplaySupplementals\', this);" />Display Supplementals/Addendums.';
    //                        }

    //                        html += '</div>';

    //                        html += '<div id="divBwDataGrid_FilterBar">';
    //                        html += '<table id="dataGridTable2" class="dataGridTable" bwworkflowappid="' + workflowAppId + '" >';

    //                        html += '  <tr class="headerRow">';
    //                        html += '    <td></td>';

    //                        // "Title" column header.
    //                        html += '    <td style="white-space:nowrap;">';
    //                        html += '       <div style="vertical-align:middle;display:inline-block;">Title&nbsp;</div>';
    //                        html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'Title\', \'descending\', this);">';
    //                        html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
    //                        html += '       </span>';
    //                        html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'Title\', \'ascending\', this);">';
    //                        html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
    //                        html += '       </span>';
    //                        html += '   </td>';

    //                        // "Description" column header.
    //                        html += '    <td style="white-space:nowrap;">';
    //                        html += '       <div style="vertical-align:middle;display:inline-block;">Description&nbsp;</div>';
    //                        html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'ProjectTitle\', \'descending\', this);">';
    //                        html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
    //                        html += '       </span>';
    //                        html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'ProjectTitle\', \'ascending\', this);">';
    //                        html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
    //                        html += '       </span>';
    //                        html += '   </td>';

    //                        // "Current Owner(s)" column header. 
    //                        html += '    <td style="white-space:nowrap;">';
    //                        html += '       <div style="vertical-align:middle;display:inline-block;">Current Owner(s)&nbsp;</div>';
    //                        html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'CurrentOwner\', \'descending\', this);">';
    //                        html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
    //                        html += '       </span>';
    //                        html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'CurrentOwner\', \'ascending\', this);">';
    //                        html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
    //                        html += '       </span>';
    //                        html += '   </td>';

    //                        // "Created Date" column header.
    //                        html += '    <td style="white-space:nowrap;">';
    //                        html += '       <div style="vertical-align:middle;display:inline-block;">Created Date&nbsp;</div>';
    //                        html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'Created\', \'descending\', this);">';
    //                        html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
    //                        html += '       </span>';
    //                        html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'Created\', \'ascending\', this);">';
    //                        html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
    //                        html += '       </span>';
    //                        html += '   </td>';

    //                        // "Location" column header.
    //                        html += '   <td style="white-space:nowrap;">';
    //                        html += '       <div style="vertical-align:middle;display:inline-block;">Location&nbsp;</div>';
    //                        html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'OrgName\', \'ascending\', this);">';
    //                        html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
    //                        html += '       </span>';
    //                        html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'OrgName\', \'ascending\', this);">';
    //                        html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
    //                        html += '       </span>';
    //                        html += '   </td>';

    //                        // "Capital Cost" column header. 
    //                        html += '    <td style="white-space:nowrap;">';
    //                        html += '       <div style="vertical-align:middle;display:inline-block;">Capital Cost&nbsp;</div>';
    //                        html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'RequestedCapital\', \'descending\', this);">';
    //                        html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
    //                        html += '       </span>';
    //                        html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'RequestedCapital\', \'ascending\', this);">';
    //                        html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
    //                        html += '       </span>';
    //                        html += '   </td>';

    //                        // "Modified Date" column header. 
    //                        html += '    <td style="white-space:nowrap;">';
    //                        html += '       <div style="vertical-align:middle;display:inline-block;">Modified Date&nbsp;</div>';
    //                        html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'Modified\', \'descending\', this);">';
    //                        html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
    //                        html += '       </span>';
    //                        html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'Modified\', \'ascending\', this);">';
    //                        html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
    //                        html += '       </span>';
    //                        html += '   </td>';

    //                        html += '    <td></td>';
    //                        html += '  </tr>';

    //                        html += '</table>';

    //                        html += '</div>';

    //                        //
    //                        //
    //                        // end: Adding new paging status, sort bar, and paging UI.
    //                        //
    //                        //

    //                        $('#divBwDataGrid_FilterBar').html(html);

    //                    }

    //                    var bwDisplayFormat = localStorage.getItem('bwDisplayFormat');
    //                    //alert('In renderDetailedListOrExecutiveSummary(). bwDisplayFormat: ' + bwDisplayFormat);
    //                    if (bwDisplayFormat == 'ExecutiveSummaries') {
    //                        thiz.displayExecutiveSummaries();
    //                    } else if (bwDisplayFormat == 'DetailedList') {
    //                        thiz.displayDetailedList();
    //                    } else {
    //                        console.log('In renderDetailedListOrExecutiveSummary(). Unexpected value for bwDisplayFormat: ' + bwDisplayFormat);
    //                        //displayAlertDialog('In renderDetailedListOrExecutiveSummary(). Unexpected value for bwDisplayFormat: ' + bwDisplayFormat);

    //                        localStorage.setItem('bwDisplayFormat', 'ExecutiveSummaries');
    //                        thiz.displayExecutiveSummaries();

    //                    }

    //                } catch (e) {
    //                    console.log('Exception in bwDataGrid.js.renderDetailedListOrExecutiveSummary():2: ' + e.message + ', ' + e.stack);
    //                    displayAlertDialog('Exception bwDataGrid.js.renderDetailedListOrExecutiveSummary():2: ' + e.message + ', ' + e.stack);
    //                }
    //            },
    //            error: function (data, errorCode, errorMessage) {
    //                console.log('Error in bwDataGrid.js.renderDetailedListOrExecutiveSummary():' + errorCode + ', ' + errorMessage);
    //                displayAlertDialog('Error in bwDataGrid.js.renderDetailedListOrExecutiveSummary():' + errorCode + ', ' + errorMessage);
    //            }
    //        });

    //    } catch (e) {
    //        console.log('Exception in bwDataGrid.js.renderDetailedListOrExecutiveSummary(): ' + e.message + ', ' + e.stack);
    //        displayAlertDialog('Exception in bwDataGrid.js.renderDetailedListOrExecutiveSummary(): ' + e.message + ', ' + e.stack);
    //    }
    //},


    //getPagedDataFor_BudgetRequests: function (offset, limit, sortDataElement, sortOrder) {
    //    var thiz = this;
    //    return new Promise(function (resolve, reject) {
    //        // This is used on the client side (here), and also on the server side for generating this content to be included in emails. (OverdueTasksTimer).
    //        try {
    //            console.log('In bwDataGrid.js.getPagedDataFor_BudgetRequests(). offset: ' + offset + ', limit: ' + limit + ', sortDataElement: ' + sortDataElement + ', sortOrder: ' + sortOrder);
    //            //alert('In bwDataGrid.js.getPagedDataFor_BudgetRequests(). offset: ' + offset + ', limit: ' + limit + ', sortDataElement: ' + sortDataElement + ', sortOrder: ' + sortOrder);

    //            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
    //            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

    //            var activeStateIdentifier = $('.bwAuthentication').bwAuthentication('getActiveStateIdentifier');

    //            // requestsSummaryDetails.
    //            // totalDocs: 732,
    //            // offset: 0,
    //            // limit: 25,
    //            // totalPages: 30,
    //            // page: 1,
    //            // pagingCounter: 1,
    //            // hasPrevPage: false,
    //            // hasNextPage: true,
    //            // prevPage: null,
    //            // nextPage: 2

    //            var data = {
    //                bwParticipantId_LoggedIn: participantId,
    //                bwActiveStateIdentifier: activeStateIdentifier,
    //                bwWorkflowAppId_LoggedIn: workflowAppId,

    //                DisplaySupplementals: thiz.options.DisplaySupplementals,
    //                offset: offset,
    //                limit: limit,
    //                sortDataElement: sortDataElement,
    //                sortOrder: sortOrder
    //            }

    //            //var operationUri = webserviceurl + '/getPagedDataFor_ACTIVE_REQUESTS2'; // The validation/validity-check of the PinnedRequestsArray has to happen on the server in this method/web-service.
    //            var operationUri = webserviceurl + '/getPagedDataFor_BudgetRequests'; // The validation/validity-check of the PinnedRequestsArray has to happen on the server in this method/web-service.
    //            $.ajax({
    //                url: operationUri,
    //                type: 'POST',
    //                contentType: 'application/json',
    //                data: JSON.stringify(data),
    //                success: function (results) {
    //                    try {

    //                        if (results.status != 'SUCCESS') {

    //                            var msg = 'Error in bwDataGrid.js.getPagedDataFor_BudgetRequests(): ' + JSON.stringify(results); // results.message;

    //                            console.log(msg);
    //                            displayAlertDialog(msg);

    //                            var result = {
    //                                status: results.status,
    //                                message: msg
    //                            }
    //                            reject(result);

    //                        } else {

    //                            thiz.options.ACTIVE_REQUESTS = results.results; // CONVERTED TO paginate .docs JUST LIKE WE DID WITH EMAIL!!!!!!!!!!!!!!!!!!!!!!!!!!! 7-18-2024.

    //                            var msg = 'Successfully loaded bwDataGrid.js widget options.BudgetRequests with ' + results.results.docs.length + ' records.';

    //                            var result = {
    //                                status: 'SUCCESS',
    //                                message: msg
    //                            }
    //                            resolve(result);

    //                        }

    //                    } catch (e) {

    //                        var msg = 'Exception in bwDataGrid.js.getPagedDataFor_BudgetRequests():2: ' + e.message + ', ' + e.stack;
    //                        console.log(msg);
    //                        displayAlertDialog(msg);

    //                        var result = {
    //                            status: 'EXCEPTION',
    //                            message: msg
    //                        }
    //                        reject(result);

    //                    }
    //                },
    //                error: function (data, errorCode, errorMessage) {

    //                    var msg = 'Error in bwDataGrid.js.getPagedDataFor_BudgetRequests(): errorCode: ' + errorCode + ', errorMessage: ' + errorMessage + ', data: ' + JSON.stringify(data);

    //                    console.log(msg);
    //                    displayAlertDialog(msg);

    //                    var result = {
    //                        status: 'ERROR',
    //                        message: msg
    //                    }
    //                    reject(result);

    //                }
    //            });

    //        } catch (e) {

    //            var msg = 'Exception in bwDataGrid.js.getPagedDataFor_BudgetRequests():1: ' + e.message + ', ' + e.stack;

    //            console.log(msg);
    //            displayAlertDialog(msg);

    //            var result = {
    //                status: 'EXCEPTION',
    //                message: msg
    //            }
    //            reject(result);

    //        }
    //    });
    //},



    //loadDataAndRenderDetailedListOrExecutiveSummary: function (sortDataElement, sortOrder) { //sortDataElement, sortOrder) {
    //    try {
    //        console.log('In bwDataGrid.js.loadDataAndRenderDetailedListOrExecutiveSummary().');
    //        //alert('In bwDataGrid.js.loadDataAndRenderDetailedListOrExecutiveSummary(). this.options.TrashBin: ' + this.options.TrashBin);
    //        var thiz = this;

    //        var offset = 0;
    //        var limit = 25;

    //        // Set the sort buttons to grayed-out. When one is selected by the user, we will set the opacity to 1.0 as a good visual indicator.
    //        var buttons = $('.dataGridTable_SortButton');
    //        for (var i = 0; i < buttons.length; i++) {
    //            buttons[i].style.opacity = '0.25';
    //        }

    //        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

    //        var bwRequestTypeId = $('#selectRequestTypeDropDown option:selected').val(); // This is the drop-down at the top of the page.

    //        // These values will have been set already by the bwOrganizationPicker.js widget.
    //        var bwOrgId = $('#divPageContent1').find('.bwOrganizationPicker').bwOrganizationPicker('option', 'bwOrgId');
    //        var bwOrgName = $('#divPageContent1').find('.bwOrganizationPicker').bwOrganizationPicker('option', 'bwOrgName');
    //        debugger;
    //        var startDate = $('#divPageContent1').find('.bwStartDatePicker').bwStartDatePicker('getData').toUTCString();
    //        var endDate = $('#divPageContent1').find('.bwEndDatePicker').bwEndDatePicker('getData').toUTCString();

    //        //this.options.pagingLimit = 15; // Only display x items at a time.
    //        //this.options.pagingPage = 0; // This is the page that is being displayed. This may be easier to use than offset? It is a zero based value.

    //        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
    //        var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

    //        var data;
    //        if (sortDataElement && sortOrder) {

    //            data = {
    //                bwParticipantId_LoggedIn: participantId,
    //                bwActiveStateIdentifier: activeStateIdentifier,
    //                bwWorkflowAppId_LoggedIn: workflowAppId,

    //                TrashBin: this.options.TrashBin,
    //                //bwWorkflowAppId: workflowAppId,
    //                bwRequestTypeId: bwRequestTypeId,
    //                bwOrgId: bwOrgId,
    //                StartDate: startDate,
    //                EndDate: endDate,
    //                //pagingPage: this.options.pagingPage,
    //                //pagingLimit: this.options.pagingLimit,
    //                //sort_dataElement: dataElement,
    //                //sort_sortOrder: sortOrder

    //                DisplaySupplementals: thiz.options.DisplaySupplementals,
    //                offset: offset,
    //                limit: limit,
    //                sortDataElement: sortDataElement,
    //                sortOrder: sortOrder
    //            }

    //        } else {

    //            data = {
    //                bwParticipantId_LoggedIn: participantId,
    //                bwActiveStateIdentifier: activeStateIdentifier,
    //                bwWorkflowAppId_LoggedIn: workflowAppId,

    //                TrashBin: this.options.TrashBin,
    //                //bwWorkflowAppId: workflowAppId,
    //                bwRequestTypeId: bwRequestTypeId,
    //                bwOrgId: bwOrgId,
    //                StartDate: startDate,
    //                EndDate: endDate,
    //                //pagingPage: this.options.pagingPage,
    //                //pagingLimit: this.options.pagingLimit

    //                DisplaySupplementals: thiz.options.DisplaySupplementals,
    //                offset: offset,
    //                limit: limit,
    //                sortDataElement: sortDataElement,
    //                sortOrder: sortOrder
    //            }

    //        }

    //        $.ajax({
    //            url: webserviceurl + '/getPagedDataFor_BudgetRequests',
    //            type: 'POST',
    //            data: data,
    //            headers: {
    //                "Accept": "application/json; odata=verbose"
    //            },
    //            success: function (results) {
    //                try {

    //                    if (results.status != 'SUCCESS') {

    //                        var msg = 'Error in bwDataGrid.js.loadDataAndRenderDetailedListOrExecutiveSummary():xcx1245. ' + results.status + ', ' + results.message;
    //                        console.log(msg);
    //                        displayAlertDialog(msg);

    //                    } else {

    //                        debugger;
    //                        thiz.options.BudgetRequests = results.results;

    //                        var requestsSummaryDetails = thiz.options.BudgetRequests;
    //                        var requests = thiz.options.BudgetRequests.docs;

    //                        //
    //                        //
    //                        // Adding new paging status, sort bar, and paging UI.
    //                        //
    //                        //

    //                        console.log('xcx2131231. requestsSummaryDetails: ' + Object.keys(requestsSummaryDetails)); // docs,totalDocs,offset,limit,totalPages,page,pagingCounter,hasPrevPage,hasNextPage,prevPage,nextPage.

    //                        var msg = 'requestsSummaryDetails. totalDocs: ' + requestsSummaryDetails.totalDocs + ', offset: ' + requestsSummaryDetails.offset + ', limit: ' + requestsSummaryDetails.limit + ', totalPages: ' + requestsSummaryDetails.totalPages + ', page: ' + requestsSummaryDetails.page + ', pagingCounter: ' + requestsSummaryDetails.pagingCounter + ', hasPrevPage: ' + requestsSummaryDetails.hasPrevPage + ', hasNextPage: ' + requestsSummaryDetails.hasNextPage + ', prevPage: ' + requestsSummaryDetails.prevPage + ', nextPage: ' + requestsSummaryDetails.nextPage;
    //                        console.log(msg);
    //                        //displayAlertDialog(msg);

    //                        var html = '';

    //                        var startDocumentCounter = requestsSummaryDetails.offset + 1; // Because it is zero based.
    //                        var displayTotal = requestsSummaryDetails.page * requestsSummaryDetails.limit;

    //                        if (displayTotal > requestsSummaryDetails.totalDocs) {
    //                            displayTotal = requestsSummaryDetails.totalDocs;
    //                        }

    //                        // renderExecutiveSummaries_ACTIVE_REQUESTS
    //                        html += '<div xcx="xcx2131215455-1" id="divBwDataGrid_DocumentCount">Displaying ' + startDocumentCounter + ' to ' + displayTotal + ' of ' + requestsSummaryDetails.totalDocs + ' requests.&nbsp;&nbsp;&nbsp;&nbsp;'; // |<&nbsp;&nbsp;<&nbsp;&nbsp;>&nbsp;&nbsp;>|</div>';

    //                        var limit = thiz.options.userSelectedFilter.limit;
    //                        html += `<span>Requests per page:
    //                        <select id="selectRequestsPerPage_ACTIVE_REQUESTS" onchange="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'selectRequestsPerPage\', \'ACTIVE_REQUESTS\', this);">`;

    //                        if (limit == 25) {
    //                            html += '<option selected="selected">25</option>';
    //                        } else {
    //                            html += '<option>25</option>';
    //                        }
    //                        if (limit == 50) {
    //                            html += '<option selected="selected">50</option>';
    //                        } else {
    //                            html += '<option>50</option>';
    //                        }
    //                        if (limit == 100) {
    //                            html += '<option selected="selected">100</option>';
    //                        } else {
    //                            html += '<option>100</option>';
    //                        }
    //                        if (limit == 200) {
    //                            html += '<option selected="selected">200</option>';
    //                        } else {
    //                            html += '<option>200</option>';
    //                        }

    //                        html += `   </select>
    //                    </span>`;
    //                        html += '&nbsp;&nbsp;';
    //                        html += `<div class="datasetNavigationButton" onclick="$(\'.bwDataGrid\').bwDataGrid(\'navigateRequests\', \'move_to_start\', this);">|<</div>`;
    //                        html += '&nbsp;&nbsp;';
    //                        html += `<div class="datasetNavigationButton" onclick="$(\'.bwDataGrid\').bwDataGrid(\'navigateRequests\', \'move_to_left\', this);"><</div>`;
    //                        html += '&nbsp;&nbsp;';
    //                        html += `<div class="datasetNavigationButton" onclick="$(\'.bwDataGrid\').bwDataGrid(\'navigateRequests\', \'move_to_right\', this);">></div>`;
    //                        html += '&nbsp;&nbsp;';
    //                        html += `<div class="datasetNavigationButton" onclick="$(\'.bwDataGrid\').bwDataGrid(\'navigateRequests\', \'move_to_end\', this);">>|</div>`;

    //                        var displaySupplementals = thiz.options.userSelectedFilter.displaySupplementals;
    //                        if (displaySupplementals == true) {
    //                            html += '&nbsp;&nbsp;<input type="checkbox" checked="checked" id="bwExecutiveSummariesCarousel2_DisplaySupplementals_Checkbox" onchange="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'toggleDisplaySupplementals\', this);" />Display Supplementals/Addendums.';
    //                        } else {
    //                            html += '&nbsp;&nbsp;<input type="checkbox" id="bwExecutiveSummariesCarousel2_DisplaySupplementals_Checkbox" onchange="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'toggleDisplaySupplementals\', this);" />Display Supplementals/Addendums.';
    //                        }

    //                        html += '</div>';

    //                        html += '<div id="divBwDataGrid_FilterBar">';
    //                        html += '<table id="dataGridTable2" class="dataGridTable" bwworkflowappid="' + workflowAppId + '" >';

    //                        html += '  <tr class="headerRow">';
    //                        html += '    <td></td>';

    //                        // "Title" column header.
    //                        html += '    <td style="white-space:nowrap;">';
    //                        html += '       <div style="vertical-align:middle;display:inline-block;">Title&nbsp;</div>';
    //                        html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'Title\', \'descending\', this);">';
    //                        html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
    //                        html += '       </span>';
    //                        html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'Title\', \'ascending\', this);">';
    //                        html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
    //                        html += '       </span>';
    //                        html += '   </td>';

    //                        // "Description" column header.
    //                        html += '    <td style="white-space:nowrap;">';
    //                        html += '       <div style="vertical-align:middle;display:inline-block;">Description&nbsp;</div>';
    //                        html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'ProjectTitle\', \'descending\', this);">';
    //                        html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
    //                        html += '       </span>';
    //                        html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'ProjectTitle\', \'ascending\', this);">';
    //                        html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
    //                        html += '       </span>';
    //                        html += '   </td>';

    //                        // "Current Owner(s)" column header.
    //                        html += '    <td style="white-space:nowrap;">';
    //                        html += '       <div style="vertical-align:middle;display:inline-block;">Current Owner(s)&nbsp;</div>';
    //                        html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'CurrentOwner\', \'descending\', this);">';
    //                        html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
    //                        html += '       </span>';
    //                        html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'CurrentOwner\', \'ascending\', this);">';
    //                        html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
    //                        html += '       </span>';
    //                        html += '   </td>';

    //                        // "Created Date" column header.
    //                        html += '    <td style="white-space:nowrap;">';
    //                        html += '       <div style="vertical-align:middle;display:inline-block;">Created Date&nbsp;</div>';
    //                        html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'Created\', \'descending\', this);">';
    //                        html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
    //                        html += '       </span>';
    //                        html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'Created\', \'ascending\', this);">';
    //                        html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
    //                        html += '       </span>';
    //                        html += '   </td>';

    //                        // "Location" column header.
    //                        html += '   <td style="white-space:nowrap;">';
    //                        html += '       <div style="vertical-align:middle;display:inline-block;">Location&nbsp;</div>';
    //                        html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'OrgName\', \'ascending\', this);">';
    //                        html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
    //                        html += '       </span>';
    //                        html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'OrgName\', \'ascending\', this);">';
    //                        html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
    //                        html += '       </span>';
    //                        html += '   </td>';

    //                        // "Capital Cost" column header.
    //                        html += '    <td style="white-space:nowrap;">';
    //                        html += '       <div style="vertical-align:middle;display:inline-block;">Capital Cost&nbsp;</div>';
    //                        html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'RequestedCapital\', \'descending\', this);">';
    //                        html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
    //                        html += '       </span>';
    //                        html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'RequestedCapital\', \'ascending\', this);">';
    //                        html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
    //                        html += '       </span>';
    //                        html += '   </td>';

    //                        // "Modified Date" column header.
    //                        html += '    <td style="white-space:nowrap;">';
    //                        html += '       <div style="vertical-align:middle;display:inline-block;">Modified Date&nbsp;</div>';
    //                        html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'Modified\', \'descending\', this);">';
    //                        html += '           <img src="images/descending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
    //                        html += '       </span>';
    //                        html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'sortDataGrid\', \'Modified\', \'ascending\', this);">';
    //                        html += '           <img src="images/ascending.png" class="dataGridTable_SortButton" style="width:25px;vertical-align:middle;" />';
    //                        html += '       </span>';
    //                        html += '   </td>';

    //                        html += '    <td></td>';
    //                        html += '  </tr>';

    //                        html += '</table>';

    //                        html += '</div>';

    //                        //
    //                        //
    //                        // end: Adding new paging status, sort bar, and paging UI.
    //                        //
    //                        //

    //                        $('#divBwDataGrid_FilterBar').html(html);

    //                    }

    //                    var bwDisplayFormat = localStorage.getItem('bwDisplayFormat');
    //                    //alert('In loadDataAndRenderDetailedListOrExecutiveSummary(). bwDisplayFormat: ' + bwDisplayFormat);
    //                    if (bwDisplayFormat == 'ExecutiveSummaries') {
    //                        thiz.displayExecutiveSummaries();
    //                    } else if (bwDisplayFormat == 'DetailedList') {
    //                        thiz.displayDetailedList();
    //                    } else {
    //                        console.log('In loadDataAndRenderDetailedListOrExecutiveSummary(). Unexpected value for bwDisplayFormat: ' + bwDisplayFormat);
    //                        //displayAlertDialog('In loadDataAndRenderDetailedListOrExecutiveSummary(). Unexpected value for bwDisplayFormat: ' + bwDisplayFormat);

    //                        localStorage.setItem('bwDisplayFormat', 'ExecutiveSummaries');
    //                        thiz.displayExecutiveSummaries();

    //                    }

    //                } catch (e) {
    //                    console.log('Exception in bwDataGrid.js.loadDataAndRenderDetailedListOrExecutiveSummary():2: ' + e.message + ', ' + e.stack);
    //                    displayAlertDialog('Exception bwDataGrid.js.loadDataAndRenderDetailedListOrExecutiveSummary():2: ' + e.message + ', ' + e.stack);
    //                }
    //            },
    //            error: function (data, errorCode, errorMessage) {
    //                console.log('Error in bwDataGrid.js.loadDataAndRenderDetailedListOrExecutiveSummary():' + errorCode + ', ' + errorMessage);
    //                displayAlertDialog('Error in bwDataGrid.js.loadDataAndRenderDetailedListOrExecutiveSummary():' + errorCode + ', ' + errorMessage);
    //            }
    //        });

    //    } catch (e) {
    //        console.log('Exception in bwDataGrid.js.loadDataAndRenderDetailedListOrExecutiveSummary(): ' + e.message + ', ' + e.stack);
    //        displayAlertDialog('Exception in bwDataGrid.js.loadDataAndRenderDetailedListOrExecutiveSummary(): ' + e.message + ', ' + e.stack);
    //    }
    //},
});