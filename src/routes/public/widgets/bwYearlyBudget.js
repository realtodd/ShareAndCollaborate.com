$.widget("bw.bwYearlyBudget", {
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
        This is the bwYearlyBudget.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        elementIdSuffix: null, // This is a custom guid which gets appended to element id's, making sure this widget keeps to itself.

        temporaryFlagForTesting: false,

        // 4-11-2022
        brData: null,
        taskData: null,


        value: 0,
        displayOnCreation: false,
        json: null,
        //jsonTreeState: null, // This contains the org structure and roles.
        //DraftOrgStructureAndRoles: null, // This contains the org structure and roles.
        workflow: null, // Storing it here so we can use it to see which roles are available. I think the workflow should be the origin for roles, but we will see if that is the case in the end... :)
        store: null, // Contains Global and DraftGlobal. These contains the org structure and roles.
        color: {
            Default: 'black',
            Active: '#ff0000', // red // used for hover etc.
            Inactive: 'lightgrey', //'aqua', // red // used for hover etc.
            Global: '#0066ff', // blue
            Division: '#0066ff', // blue
            Group: '#ffff00', // yellow
            LegalEntity: '#ff9900', // orange
            LegalEntity2: '#29685F', // galapagos green
            Location: '#009933', // green
            ChildNode: '#95b1d3' // that nice light blue/grey color also using at top of section pages...
        },
        Checklists: null,
        //bwTenantId: null,
        //bwWorkflowAppId: null,
        bwEnabledRequestTypes: null, // An array of the following: ['Budget Request', 'Quote Request', 'Reimbursement Request', 'Recurring Expense', 'Capital Plan Project', 'Work Order']
        operationUriPrefix: null,
        ajaxTimeout: 15000,

        quill: null,
        quillSubjectEditor: null,

        quillErrorOrSuggestionDialogSubjectEditor: null,
        quillErrorOrSuggestionDialogBodyEditor: null,

        displayOrgRolesPicker: false, //true, // Should be false by default but this is good for now.
        displayRoleIdColumn: false,
        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function (assignmentRowChanged_ElementId) {
        this.element.addClass("bwYearlyBudget");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {

            selfDiscoverOperationUri(thiz); // This sets this.options.operationUriPrefix correctly.

            var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            this.options.elementIdSuffix = guid;

            this.createPieChart();

            console.log('In bwYearlyBudget._create(). The widget has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwYearlyBudget: CANNOT RENDER THE WIDGET</span>';
            html += '<br />';
            html += '<span style="">Exception in bwYearlyBudget.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwWorkflowEditor")
            .text("");
    },

    renderTrackSpending: function () {
        try {
            console.log('In renderTrackSpending().');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            var workflowAppTitle = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTitle');
            var requestTypes = $('.bwAuthentication').bwAuthentication('option', 'bwEnabledRequestTypes').EnabledItems;

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
            html += '</style>';

            html += '<table style="width:100%;">';
            html += '   <tr>';
            html += '       <td>';
            html += '           <span style="color:black;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 35pt;font-weight:bold;">';
            html += '               View ';
            html += '               <span style="font_weight:bold;color:grey;">';
            html += '                   <select id="selectRequestTypeDropDown" onchange="$(\'.bwYearlyBudget\').bwYearlyBudget(\'ArchiveRequestTypeDropDown_Onchange\', this);" class="selectHomePageWorkflowAppDropDown" style=\'display:inline;border-color: whitesmoke; color: grey; font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 1em; font-weight: bold; cursor: pointer;  margin-bottom:15px;\'>'; // was .5em
            html += '                       <option value="' + 'all' + '" ' + selected + ' >' + 'All Request Types' + '</option>';
            for (var i = 0; i < requestTypes.length; i++) {
                var selected = '';
                html += '                   <option value="' + requestTypes[i].bwRequestTypeId + '" ' + selected + ' >' + requestTypes[i].PluralName + '</option>';
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
            html += '       </td>';
            html += '   </tr>';
            html += '   <tr>';
            html += '       <td colspan="2" >';
            html += '           <div id="divBwStartDatePicker" style="display:inline-block;"></div>';
            html += '           &nbsp;&nbsp;&nbsp;&nbsp;';
            html += '           <div id="divBwEndDatePicker" style="display:inline-block;"></div>';


            html += '           <ul style="list-style-type: none;">';

            html += '               <li><input type="checkbox" checked="checked" onchange="$(\'.bwYearlyBudget\').bwYearlyBudget(\'MoneyType_Onchange\', \'REQUESTED_CAPITAL\');" />';
            html += '&nbsp;Total Requested Capital: <span id="span_bwYearlyBudget_TotalRequestedCapital" style="color:orange;font-weight:bold;" >$xx.xx</span></li>'; // $('.bwEmailClient').bwEmailClient('toggleSentEmailCheckboxes', this);

            html += '               <li><input type="checkbox" checked="checked" onchange="$(\'.bwYearlyBudget\').bwYearlyBudget(\'MoneyType_Onchange\', \'BILLED_RECEIVABLES\');" />';
            html += '&nbsp;Total Invoiced (OUTSTANDING): <span id="span_bwYearlyBudget_TotalInvoicedAmount" style="color:black;font-weight:bold;" >$xx.xx</span></li>';

            html += '               <li><input type="checkbox" checked="checked" onchange="$(\'.bwYearlyBudget\').bwYearlyBudget(\'MoneyType_Onchange\', \'BILLED_RECEIVABLES\');" />';
            html += '&nbsp;Total Invoiced (RECEIVED): <span id="span_bwYearlyBudget_TotalInvoicedAmount_Paid" style="color:black;font-weight:bold;" >$xx.xx</span></li>';

            html += '               <li><input type="checkbox" onchange="$(\'.bwYearlyBudget\').bwYearlyBudget(\'MoneyType_Onchange\', \'PAID_EXPENDITURES\');" />';
            html += '&nbsp;Total Paid Expenditures: $xxx.xx</li>';

            html += '               <li><input type="checkbox" onchange="$(\'.bwYearlyBudget\').bwYearlyBudget(\'MoneyType_Onchange\', \'COLLECTED_RECEIVABLES\');" />';
            html += '&nbsp;Total Collected Receivables: $xxx.xx</li>';

            html += '           </ul>';


            html += '       </td>';
            html += '   </tr>';
            html += '</table>';

            thiz.element.html(html);

            var options = {
                bwWorkflowAppId: workflowAppId,
                allowRequestModifications: true,
                renderAsARequiredField: true,
                inFormsEditor: false,
                bwOrgId: null,
                bwOrgName: null
            };
            $('#divBwDataGrid_OrganizationPicker').bwOrganizationPicker({});

            $(thiz.element).find('#divBwStartDatePicker').bwStartDatePicker({
                inVisualizations: true,
                allowRequestModifications: true
            });

            $(thiz.element).find('#divBwEndDatePicker').bwEndDatePicker({
                inVisualizations: true,
                allowRequestModifications: true
            });


            console.log('In bwYearlyBudget.js.renderTrackSpending(). Calling createPieChart()... too early, and the orgId and orgName not ready???');

            //thiz.createPieChart(); // Passing the list of requests... not including supplementals for the time being.

        } catch (e) {
            console.log('Exception in bwYearlyBudget.js.renderTrackSpending(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwYearlyBudget.js.renderTrackSpending(): ' + e.message + ', ' + e.stack);
        }
    },

    
    
    createPieChart: function (dataElement, sortOrder) {
        try {
            console.log('In bwYearlyBudget.createPieChart().');
            var thiz = this;
            //alert('In bwYearlyBudget.createPieChart().');
            //var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            //var bwRequestTypeId = $('#selectRequestTypeDropDown option:selected').val(); // This is the drop-down at the top of the page.

            //// These values will have been set already by the bwOrganizationPicker.js widget.
            //var bwOrgId = $('#divPageContent1').find('.bwOrganizationPicker').bwOrganizationPicker('option', 'bwOrgId');
            //var bwOrgName = $('#divPageContent1').find('.bwOrganizationPicker').bwOrganizationPicker('option', 'bwOrgName');

            //console.log('In bwYearlyBudget.js.createPieChart(). Getting bwOrgId: ' + bwOrgId + ', bwOrgName: ' + bwOrgName);

            ////alert('xcx212342134 bwOrgId: ' + bwOrgId);

            //var startDate = $('#divPageContent1').find('.bwStartDatePicker').bwStartDatePicker('getData').toUTCString();
            //var endDate = $('#divPageContent1').find('.bwEndDatePicker').bwEndDatePicker('getData').toUTCString();

            //console.log('In bwYearlyBudget.js.createPieChart(). bwOrgId: ' + bwOrgId + ', bwOrgName: ' + bwOrgName);

            ////this.options.pagingLimit = 15; // Only display x items at a time.
            //this.options.pagingPage = 0; // This is the page that is being displayed. This may be easier to use than offset? It is a zero based value.

            $('#myChart').remove(); // Remove it then put it back below. This seem sto kee any weird behavior from happening.

            var html = '';

            html += '<canvas id="myChart" width="500" height="400"></canvas>';

            html += '<div id="drillDownReport1" style="height:500px;width:500px;"></div>';

            this.element.append(html);

            //var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            //var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            //var data = [];



            // FATitle, FAYearly Budget, FA ID, FA Year, FA Quote, TotalApproved$, TotalPending$, TotalRejected$.
            //var item = [faData.d.results[i].Title, Number(faData.d.results[i].YearlyBudget), faData.d.results[i].ID, faData.d.results[i].Year, faData.d.results[i].Quote, 0, 0, 0];
            //drillDownReportData.push(item);
            //var yearItem = [Number(faData.d.results[i].Year)];
            //functionalAreaYears.push(yearItem);


            //var pendingItem = ['Titlexcx1', '20000']; // [drillDownReportData[i][0], drillDownReportData[i][1]]; // faData.d.results[i].Title, Number(faData.d.results[i].YearlyBudget)
            //data.push(pendingItem);
            //var pendingItem = ['Titlexcx1', '20000']; // [drillDownReportData[i][0], drillDownReportData[i][1]]; // faData.d.results[i].Title, Number(faData.d.results[i].YearlyBudget)
            //data.push(pendingItem);
            //var pendingItem = ['Titlexcx1', '20000']; // [drillDownReportData[i][0], drillDownReportData[i][1]]; // faData.d.results[i].Title, Number(faData.d.results[i].YearlyBudget)
            //data.push(pendingItem);
            //var pendingItem = ['Titlexcx1', '20000']; // [drillDownReportData[i][0], drillDownReportData[i][1]]; // faData.d.results[i].Title, Number(faData.d.results[i].YearlyBudget)
            //data.push(pendingItem);
            //var pendingItem = ['Titlexcx1', '20000']; // [drillDownReportData[i][0], drillDownReportData[i][1]]; // faData.d.results[i].Title, Number(faData.d.results[i].YearlyBudget)
            //data.push(pendingItem);
            //var pendingItem = ['Titlexcx1', '20000']; // [drillDownReportData[i][0], drillDownReportData[i][1]]; // faData.d.results[i].Title, Number(faData.d.results[i].YearlyBudget)
            //data.push(pendingItem);
            //var pendingItem = ['Titlexcx1', '20000']; // [drillDownReportData[i][0], drillDownReportData[i][1]]; // faData.d.results[i].Title, Number(faData.d.results[i].YearlyBudget)
            //data.push(pendingItem);
            //var pendingItem = ['Titlexcx1', '20000']; // [drillDownReportData[i][0], drillDownReportData[i][1]]; // faData.d.results[i].Title, Number(faData.d.results[i].YearlyBudget)
            //data.push(pendingItem);

            // This creates the labels for the slices of the pie. It is the dollar amounts.
            //var total = 0;
            //$(data).map(function () { total += this[1]; }) // This calculates the total value.

            ////var mylabels = $.makeArray($(data).map(function () { return '<div style="text-align:center;">' + this[0].toString() + '</br>' + formatCurrency(this[1]) + '</div>'; })); // THIS IS WHERE THE LABELS GET PUT on the pie slices!
            //var mylabels = $.makeArray($(data).map(function () { return '<div style="text-align:center;">' + this[0].toString() + '</br>' + this[1] + '</div>'; })); // THIS IS WHERE THE LABELS GET PUT on the pie slices!
            //debugger;
            //var sliceColors = ['#005391', '#B7CA10', '#3A4A01', '#87C8F0', '#8E1828', '#63A01F', '#F8D033', '#FD5E1D']; // New colors 3-9-15
            //var sliceHighlightedColors = ['#4C86B2', '#BFCA5B', '#75804D', '#B9DBF0', '#8B3D47', '#A0BC81', '#F4D971', '#EA8E69']; // New colors 3-9-15
            //// This code ensures reuse of seriescolors if it fais to work: http://stackoverflow.com/questions/13984712/jqplot-pie-donut-chart-seriescolors-array-not-reused-repeated






            //const data = {
            //    labels: [
            //        'Red',
            //        'Blue',
            //        'Yellow'
            //    ],
            //    datasets: [{
            //        label: 'My First Dataset',
            //        data: [300, 50, 100],
            //        backgroundColor: [
            //            'rgb(255, 99, 132)',
            //            'rgb(54, 162, 235)',
            //            'rgb(255, 205, 86)'
            //        ],
            //        hoverOffset: 4
            //    }]
            //};


            //const DATA_COUNT = 5;
            //const NUMBER_CFG = { count: DATA_COUNT, min: 0, max: 100 };

            var data = [20, 50, 80, 100, 10];

            var ctx = document.getElementById('myChart').getContext('2d');

            // LOOK AT data HERE TO SEE if there are duplicates in the original dataset ... or if the chart is causing this behaviour. 2-26-2022
            var myChart = new Chart(ctx, {
                //type: 'bar',
                color: 'purple',
                type: 'pie',
                data: {
                    //color: 'purple',
                    //labels: labels, // For example, bwRequests[i].Created.
                    labels: ['Functional Area 1', 'Functional Area 2', 'Functional Area 3', 'Functional Area 4', 'Functional Area 5'],
                    datasets: [
                        {
                            label: 'Dataset 1',
                            data: data,
                            backgroundColor: ['red', 'orange', 'yellow', 'green', 'blue'], //Object.values(Utils.CHART_COLORS),
                        }
                    ]
                    //datasets: [{
                    //    label: 'Requested Capital',
                    //    pointRadius: 50, // This is how we set the point size.
                    //    pointHoverRadius: 50,
                    //    pointHitRadius: 50,
                    //    //pointStyle: ['rect', yourImage, 'triangle', 'circle'],
                    //    //pointBackgroundColor: "rgba(0,191,255)",
                    //    data: data_requestedCapital,
                    //    backgroundColor: 'rgba(255, 255, 255, 0)', // Transparent.
                    //    //backgroundColor: [
                    //    //    'rgba(255, 99, 132, 0.2)',
                    //    //    'rgba(54, 162, 235, 0.2)',
                    //    //    'rgba(255, 206, 86, 0.2)',
                    //    //    'rgba(75, 192, 192, 0.2)',
                    //    //    'rgba(153, 102, 255, 0.2)',
                    //    //    'rgba(255, 159, 64, 0.2)'
                    //    //],
                    //    borderColor: [
                    //        'rgba(255, 99, 132, 1)',
                    //        'rgba(54, 162, 235, 1)',
                    //        'rgba(255, 206, 86, 1)',
                    //        'rgba(75, 192, 192, 1)',
                    //        'rgba(153, 102, 255, 1)',
                    //        'rgba(255, 159, 64, 1)'
                    //    ],
                    //    borderWidth: 1

                    //},
                    //{
                    //    //color: 'yellow',
                    //    label: 'Issued Invoices - NOT PAID',
                    //    pointRadius: 25, // This is how we set the point size.
                    //    pointHoverRadius: 25,
                    //    pointHitRadius: 25,
                    //    //pointStyle: ['rect', yourImage, 'triangle', 'circle'],
                    //    pointBackgroundColor: "#000000", // "rgba(0,191,255)",
                    //    data: data_issuedInvoices,
                    //    backgroundColor: 'rgba(255, 255, 255, 0)', // Transparent.
                    //    //backgroundColor: [
                    //    //    'rgba(255, 99, 132, 0.2)',
                    //    //    'rgba(54, 162, 235, 0.2)',
                    //    //    'rgba(255, 206, 86, 0.2)',
                    //    //    'rgba(75, 192, 192, 0.2)',
                    //    //    'rgba(153, 102, 255, 0.2)',
                    //    //    'rgba(255, 159, 64, 0.2)'
                    //    //],
                    //    borderColor: [
                    //        'rgba(255, 99, 132, 1)',
                    //        'rgba(54, 162, 235, 1)',
                    //        'rgba(255, 206, 86, 1)',
                    //        'rgba(75, 192, 192, 1)',
                    //        'rgba(153, 102, 255, 1)',
                    //        'rgba(255, 159, 64, 1)'
                    //    ],
                    //    borderWidth: 5

                    //},
                    //{
                    //    label: 'Issued Invoices - PAID',
                    //    pointRadius: 15, // This is how we set the point size.
                    //    pointHoverRadius: 15,
                    //    pointHitRadius: 15,
                    //    //pointStyle: ['rect', yourImage, 'triangle', 'circle'],
                    //    pointBackgroundColor: "#000000", // "rgba(0,191,255)",
                    //    data: data_issuedInvoices_Paid,
                    //    backgroundColor: 'rgba(255, 255, 255, 0)', // Transparent.
                    //    //backgroundColor: [
                    //    //    'rgba(255, 99, 132, 0.2)',
                    //    //    'rgba(54, 162, 235, 0.2)',
                    //    //    'rgba(255, 206, 86, 0.2)',
                    //    //    'rgba(75, 192, 192, 0.2)',
                    //    //    'rgba(153, 102, 255, 0.2)',
                    //    //    'rgba(255, 159, 64, 0.2)'
                    //    //],
                    //    borderColor: [
                    //        'rgba(255, 99, 132, 1)',
                    //        'rgba(54, 162, 235, 1)',
                    //        'rgba(255, 206, 86, 1)',
                    //        'rgba(75, 192, 192, 1)',
                    //        'rgba(153, 102, 255, 1)',
                    //        'rgba(255, 159, 64, 1)'
                    //    ],
                    //    borderWidth: 10

                    //}]
                },
                //options: {
                //    scales: {
                //        yAxes: [{
                //            ticks: {
                //                beginAtZero: true,
                //                // Include a dollar sign in the ticks
                //                callback: function (value, index, values) {
                //                    try {
                //                        return formatCurrencyReturnEmptyForZeroNoDecimal(value);
                //                    } catch (e) {
                //                        console.log('Exception in bwYearlyBudget.createPieChart():9-1: ' + e.message + ', ' + e.stack);
                //                        displayAlertDialog('Exception in bwYearlyBudget.createPieChart():9-1: ' + e.message + ', ' + e.stack);
                //                    }
                //                }
                //            },
                //        }],
                //        xAxes: [{
                //            beginAtZero: true,
                //            //
                //            callback: function (value, index, values) {
                //                try {
                //                    return value; // formatCurrencyReturnEmptyForZeroNoDecimal(value);
                //                } catch (e) {
                //                    console.log('Exception in bwYearlyBudget.createPieChart():9-2: ' + e.message + ', ' + e.stack);
                //                    displayAlertDialog('Exception in bwYearlyBudget.createPieChart():9-2: ' + e.message + ', ' + e.stack);
                //                }
                //            }


                //            ////type: 'time'
                //            //callback: function (value, index, values) {
                //            //    try {
                //            //        return 5; // 'xcx12324213'; // 4-10-2022 formatCurrencyReturnEmptyForZeroNoDecimal(value);
                //            //    } catch (e) {
                //            //        console.log('Exception in bwYearlyBudget.createPieChart():9: ' + e.message + ', ' + e.stack);
                //            //        displayAlertDialog('Exception in bwYearlyBudget.createPieChart():9: ' + e.message + ', ' + e.stack);
                //            //    }
                //            //}
                //        }]//,
                //        //xAxes: [{
                //        //    //type: 'time'
                //        //    callback: function (value, index, values) {
                //        //        try {
                //        //            return 5; // 'xcx12324213'; // 4-10-2022 formatCurrencyReturnEmptyForZeroNoDecimal(value);
                //        //        } catch (e) {
                //        //            console.log('Exception in bwYearlyBudget.createPieChart():9: ' + e.message + ', ' + e.stack);
                //        //            displayAlertDialog('Exception in bwYearlyBudget.createPieChart():9: ' + e.message + ', ' + e.stack);
                //        //        }
                //        //    }
                //        //}]
                //    },
                //    //tooltips: {
                //    //    // Disable the on-canvas tooltip
                //    //    enabled: false, // THIS NEEDS to be set to false to use the original toltip code at the bottomn. 4-11-2022 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                //    //    callbacks: {
                //    //        label: function (tooltipItem, data) {
                //    //            try {
                //    //                //var label = data.datasets[tooltipItem.datasetIndex].label || '';
                //    //                //var bwBudgetRequestId = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].bwBudgetRequestId;
                //    //                //var projectTitle = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].ProjectTitle;
                //    //                //var title = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].Title;
                //    //                //var JustificationDetails = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].JustificationDetails;
                //    //                //var bwOrgId = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].bwOrgId;
                //    //                //var bwOrgName = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].bwOrgName;
                //    //                //var requestedCapital = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].RequestedCapital;

                //    //                //label = {
                //    //                //    bwBudgetRequestId: bwBudgetRequestId,
                //    //                //    Title: title,
                //    //                //    ProjectTitle: projectTitle,
                //    //                //    JustificationDetails: JustificationDetails,
                //    //                //    bwOrgId: bwOrgId,
                //    //                //    bwOrgName: bwOrgName,
                //    //                //    RequestedCapital: requestedCapital
                //    //                //}

                //    //                var label = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]; // This does the same as above, but contains all the data which may not be good. Not sure yet...

                //    //                return label;
                //    //            } catch (e) {
                //    //                console.log('Exception in bwYearlyBudget.createPieChart():8: ' + e.message + ', ' + e.stack);
                //    //                displayAlertDialog('Exception in bwYearlyBudget.createPieChart():8: ' + e.message + ', ' + e.stack);
                //    //            }
                //    //        }
                //    //    },
                //    //    custom: function (tooltipModel) {
                            
                //    //    }
                //    //}
                //}
            });











            //var plot1 = $.jqplot('drillDownReport1', [[['a', 25], ['b', 14], ['c', 7]]], {
            //    gridPadding: { top: 0, bottom: 38, left: 0, right: 0 },
            //    seriesDefaults: {
            //        renderer: $.jqplot.PieRenderer,
            //        trendline: { show: false },
            //        rendererOptions: { padding: 8, showDataLabels: true }
            //    },
            //    legend: {
            //        show: true,
            //        placement: 'outside',
            //        rendererOptions: {
            //            numberRows: 1
            //        },
            //        location: 's',
            //        marginTop: '15px'
            //    },
            //    axes: {
            //        xaxis: {
            //            label: 'Angle (radians)'
            //        },
            //        yaxis: {
            //            label: 'Cosine'
            //        }
            //    }
            //});








            //drillDownPieChart1 = jQuery.jqplot('drillDownReport1', [data],
            //    {
            //        // Set the colors for the pie chart.
            //        seriesColors: sliceColors,
            //        seriesDefaults: {
            //            // Make this a pie chart.
            //            renderer: jQuery.jqplot.PieRenderer,
            //            rendererOptions: {
            //                // Put data labels on the pie slices.
            //                // By default, labels show the percentage of the slice.
            //                showDataLabels: true,
            //                // custom labels
            //                dataLabels: mylabels,
            //                // separate the slices
            //                sliceMargin: 4
            //            }
            //        },
            //        //legend: { show: true, border: 'none', location: 'e' },
            //        legend: { show: false },
            //        grid: { borderWidth: 0, shadow: false, background: '#ffffff' }
            //    }
            //);

            //// Now we create the legend colored squares.
            //var colorCounter = 0;
            //$('.bwChartCalculatorLegendColoredSquare').each(function () {
            //    $(this).css('background-color', sliceColors[colorCounter]);
            //    colorCounter = colorCounter + 1;
            //});

            //$('#drillDownReport1').bind('jqplotDataHighlight', function (ev, seriesIndex, pointIndex, data) {
            //    var $this = $(this);
            //    $this.attr('title', data[0]); // data[0] is the name, data[1] is the value.
            //    // First we have to reset the colors for the calculator to the right.
            //    $('.bwChartCalculatorTableCellLabel').css('background-color', '#ffffff');
            //    // Then we have to reset all the font colors to black so that they don't stay white if the unhighlight event doesn't fire.
            //    $('.bwChartCalculatorTableCellLabel').css('color', 'black'); // Text color, change it from black so it shows up Ok.
            //    //$('.fayChartCalculatorAnchorTag').css('color', 'black'); // Text color, change it from black so it shows up Ok.
            //    // Then we Highlight the item in the calculator to the right of the pie chart.
            //    $('.bwChartCalculatorTableCellLabel:contains("' + data[0] + '")').css('color', 'white'); // Text color, change it from black so it shows up Ok.

            //    $('.bwChartCalculatorTableCellLabel:contains("' + data[0] + '")').css('background-color', sliceColors[pointIndex]);
            //    //$('.bwChartCalculatorTableCellLabel:contains("' + data[0] + '")').css('background-color', sliceColors[pointIndex]);

            //    //.bwChartCalculatorTableCellLabel:hover {
            //    //    background:yellow;
            //    //}







            //    //switch (data[0]) {
            //    //    case 'Functional Area 1':
            //    //        $('.bwChartCalculatorTableCellLabel:contains("' + data[0] + '")').css('background-color', sliceColors[0]);
            //    //        break;
            //    //    case 'Functional Area 2':
            //    //        $('.bwChartCalculatorTableCellLabel:contains("' + data[0] + '")').css('background-color', sliceColors[1]);
            //    //        break;
            //    //    case 'Functional Area 3':
            //    //        $('.bwChartCalculatorTableCellLabel:contains("' + data[0] + '")').css('background-color', sliceColors[2]);
            //    //        break;
            //    //    case 'Functional Area 4':
            //    //        $('.bwChartCalculatorTableCellLabel:contains("' + data[0] + '")').css('background-color', sliceColors[3]);
            //    //        break;
            //    //    case 'Functional Area 5':
            //    //        $('.bwChartCalculatorTableCellLabel:contains("' + data[0] + '")').css('background-color', sliceColors[4]);
            //    //        break;
            //    //    case 'Functional Area 6':
            //    //        $('.bwChartCalculatorTableCellLabel:contains("' + data[0] + '")').css('background-color', sliceColors[5]);
            //    //        break;
            //    //    case 'Functional Area 7':
            //    //        $('.bwChartCalculatorTableCellLabel:contains("' + data[0] + '")').css('background-color', sliceColors[6]);
            //    //        break;
            //    //    case 'Functional Area 8':
            //    //        $('.bwChartCalculatorTableCellLabel:contains("' + data[0] + '")').css('background-color', sliceColors[7]);
            //    //        break;
            //    //    default:
            //    //        break;
            //    //}
            //});

            //$('#drillDownReport1').bind('jqplotDataUnhighlight', function (ev, seriesIndex, pointIndex, data) {
            //    var $this = $(this);
            //    $this.attr('title', '');
            //    // First we have to reset the colors for the calculator to the right.
            //    $('.bwChartCalculatorTableCellLabel').css('color', 'black'); // Text color, change it to black so it shows up Ok.
            //    //$('.fayChartCalculatorAnchorTag').css('color', 'black'); // Text color, change it from black so it shows up Ok.
            //    $('.bwChartCalculatorTableCellLabel').css('background-color', '#ffffff');
            //});

            //$('#drillDownReport1').bind('jqplotDataClick', function (ev, seriesIndex, pointIndex, data) {
            //    //alert('This could be a drill down for "' + data[0] + '"');
            //    switch (data[0]) {
            //        case 'Functional Area 1':
            //            window.waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose('Working on it...', '');
            //            window.location.href = 'ExpenseWorksheet1.aspx?Id=' + id;
            //            break;
            //        case 'Functional Area 2':
            //            window.waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose('Working on it...', '');
            //            window.location.href = 'ExpenseWorksheet2.aspx?Id=' + id;
            //            break;
            //        case 'Functional Area 3':
            //            window.waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose('Working on it...', '');
            //            window.location.href = 'ExpenseWorksheet3.aspx?Id=' + id;
            //            break;
            //        case 'Functional Area 4':
            //            window.waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose('Working on it...', '');
            //            window.location.href = 'ExpenseWorksheet3.aspx?Id=' + id;
            //            break;
            //        case 'Functional Area 5':
            //            window.waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose('Working on it...', '');
            //            window.location.href = 'ExpenseWorksheet4.aspx?Id=' + id;
            //            break;
            //        case 'Functional Area 6':
            //            window.waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose('Working on it...', '');
            //            window.location.href = 'ExpenseWorksheet5.aspx?Id=' + id;
            //            break;
            //        case 'Functional Area 7':
            //            window.waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose('Working on it...', '');
            //            window.location.href = 'ExpenseWorksheet6.aspx?Id=' + id;
            //            break;
            //        case 'Functional Area 8':
            //            window.waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose('Working on it...', '');
            //            window.location.href = 'ExpenseWorksheet7.aspx?Id=' + id;
            //            break;
            //        default:
            //            break;
            //    }
            //});












            //if (dataElement && sortOrder) {
            //    data = {
            //        bwParticipantId_LoggedIn: participantId,
            //        bwActiveStateIdentifier: activeStateIdentifier,
            //        bwWorkflowAppId_LoggedIn: workflowAppId,

            //        bwWorkflowAppId: workflowAppId,
            //        bwRequestTypeId: bwRequestTypeId,
            //        bwOrgId: bwOrgId,
            //        StartDate: startDate,
            //        EndDate: endDate,
            //        pagingPage: this.options.pagingPage,
            //        pagingLimit: this.options.pagingLimit,
            //        sort_dataElement: dataElement,
            //        sort_sortOrder: sortOrder
            //    }
            //} else {
            //    data = {
            //        bwParticipantId_LoggedIn: participantId,
            //        bwActiveStateIdentifier: activeStateIdentifier,
            //        bwWorkflowAppId_LoggedIn: workflowAppId,

            //        bwWorkflowAppId: workflowAppId,
            //        bwRequestTypeId: bwRequestTypeId,
            //        bwOrgId: bwOrgId,
            //        StartDate: startDate,
            //        EndDate: endDate,
            //        pagingPage: this.options.pagingPage,
            //        pagingLimit: this.options.pagingLimit
            //    }
            //}
            //console.log('In bwYearlyBudget.js.createPieChart(). Calling POST bwbudgetrequestsdataset2(). data: ' + JSON.stringify(data));
            //$.ajax({
            //    url: this.options.operationUriPrefix + '_bw/bwbudgetrequestsdataset2',
            //    type: 'POST',
            //    data: data,
            //    headers: {
            //        "Accept": "application/json; odata=verbose"
            //    },
            //    success: function (data) {
            //        try {

            //            console.log('In bwYearlyBudget.js.createPieChart(). Response from POST bwbudgetrequestsdataset2(). data: ' + JSON.stringify(data));

            //            if (!data.d) {

            //                displayAlertDialog('Error in bwYearlyBudget.js.createPieChart():xcx1245: ' + data); //Error!

            //            } else {

            //                //displayAlertDialog('In bwYearlyBudget.js.createPieChart(). data: ' + JSON.stringify(data)); 
            //                // debugger;
            //                var bwRequests = data.d.results[0];
            //                if (bwRequests.length <= 0) {
            //                    // debugger;
            //                    console.log('No requests returned. This process cannot continue.');
            //                } else {
            //                    var ctx = document.getElementById('myChart').getContext('2d');

            //                    $("#myChart").off('click').click(
            //                        function (evt) {
            //                            try {

            //                                // The user has clicked on a data point in the chart. Display the request dialog!
            //                                var activePoints = myChart.getElementsAtEvent(evt);
            //                                if (activePoints[0]) {
            //                                    var chartData = activePoints[0]['_chart'].config.data;
            //                                    var idx = activePoints[0]['_index'];

            //                                    var label = chartData.labels[idx];

            //                                    alert('xcx1212313. chartData: ' + chartData.datasets[0]);

            //                                    debugger;
            //                                    var json = chartData.datasets[0].data[idx];

            //                                    // Display the request!
            //                                    $('.bwRequest').bwRequest('displayArInDialog', 'https://budgetworkflow.com/', json.bwBudgetRequestId, json.Title, json.ProjectTitle, json.Title);


            //                                }

            //                            } catch (e) {

            //                                var msg = 'Exception in bwYearlyBudget.js.createPieChart.bodyLines.forEach():xcx2131234234-22. IS CHART DATA GETTING POPULATED PROPERLY?: ' + e.message + ', ' + e.stack;
            //                                console.log(msg);
            //                                alert(msg);
            //                                //var result = {
            //                                //    status: 'EXCEPTION',
            //                                //    message: msg
            //                                //}
            //                                //reject(result);

            //                            }

            //                        }
            //                    );

            //                    // Create an array of Months depending on the user selected start and end dates.
            //                    var labels = [];
            //                    var data_requestedCapital = [];
            //                    var data_issuedInvoices = [];
            //                    var data_issuedInvoices_Paid = [];

            //                    var startDate = $(thiz.element).find("#dtEstimatedStartDate").datepicker('getDate');
            //                    var startDate2 = Date(startDate.setFullYear(startDate.getFullYear() - 1)); // todd added 1-23-2021 1-53pm adt  not sure why it only 1/2 works. The chart renders though! :) :)

            //                    $(this.element).find('#dtEstimatedStartDate').datepicker('setDate', startDate2);

            //                    var endDate = $(thiz.element).find("#dtEstimatedEndDate").datepicker('getDate');

            //                    // Create the title/label.
            //                    //var label = 'Spend Amount for ' + startDate.toString().split('00:00')[0] + ' to ' + endDate.toString().split('00:00')[0];
            //                    var totalRequestedCapital = 0;
            //                    var totalInvoicedAmount = 0;
            //                    var totalInvoicedAmount_Paid = 0;

            //                    for (var i = 0; i < bwRequests.length; i++) {

            //                        //
            //                        // X-Axis labels!!!!!!!!!!!! <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            //                        //
            //                        var createdDate = new Date(bwRequests[i].Created);
            //                        var createdDate = createdDate.toLocaleString().split(',')[0]; // new Date().toLocaleString(); // e.g. "21/11/2016, 08:00:00 AM"
            //                        if (labels.indexOf(createdDate) > -1) {
            //                            //labels.push(createdDate);
            //                        } else {
            //                            labels.push(createdDate);
            //                        }
            //                        // end: X-Axis labels!!!!!!!!!!!! <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<



            //                        var bwRequestJson = JSON.parse(bwRequests[i].bwRequestJson);

            //                        // We found a request for this month.
            //                        // Fixed 2-17-2022
            //                        var requestedCapital = 0;
            //                        try {
            //                            requestedCapital = bwRequests[i].RequestedCapital; //Number(bwRequests[i].RequestedCapital.replace(/\$/g, '').replace(/\,/g, ''));
            //                        } catch (e) {
            //                            // Come back and fix this someday... :)
            //                        }


            //                        if (bwRequestJson && bwRequestJson.bwInvoiceGrid && bwRequestJson.bwInvoiceGrid.isPaid && (bwRequestJson.bwInvoiceGrid.isPaid == true)) {

            //                            var invoicedAmount = 0;
            //                            try {
            //                                invoicedAmount = bwRequestJson.bwInvoiceGrid.value[0].Total;
            //                            } catch (e) {
            //                                // Come back and fix this someday... :)
            //                            }

            //                            if (invoicedAmount > 0) {
            //                                totalInvoicedAmount_Paid += invoicedAmount;

            //                                var point = {
            //                                    t: createdDate,
            //                                    x: createdDate,
            //                                    y: invoicedAmount, //monthTotal,
            //                                    bwFiscalYear: bwRequests[i].bwFiscalYear,
            //                                    bwBudgetRequestId: bwRequests[i].bwBudgetRequestId,
            //                                    Title: bwRequests[i].Title,
            //                                    ProjectTitle: bwRequests[i].ProjectTitle,
            //                                    RequestedCapital: requestedCapital,
            //                                    bwRequestJson: bwRequests[i].bwRequestJson,
            //                                    bwOrgId: bwRequestJson.bwOrgId,
            //                                    bwOrgName: bwRequestJson.bwOrgName,
            //                                    Created: bwRequests[i].Created,
            //                                    CreatedBy: bwRequests[i].CreatedBy,
            //                                    CreatedById: bwRequests[i].CreatedById,
            //                                    CreatedByEmail: bwRequests[i].CreatedByEmail,
            //                                    ARStatus: bwRequests[i].ARStatus,
            //                                    BudgetWorkflowStatus: bwRequests[i].BudgetWorkflowStatus
            //                                    //toolTipContent: "<a href = {bwBudgetRequestId}> {label}</a><hr/>Views: {y}",
            //                                }
            //                                data_issuedInvoices_Paid.push(point);


            //                            }

            //                        } else {

            //                            var invoicedAmount = 0;
            //                            try {
            //                                invoicedAmount = bwRequestJson.bwInvoiceGrid.value[0].Total;
            //                            } catch (e) {
            //                                // Come back and fix this someday... :)
            //                            }

            //                            if (invoicedAmount > 0) {
            //                                totalInvoicedAmount += invoicedAmount;

            //                                var point = {
            //                                    t: createdDate,
            //                                    x: createdDate,
            //                                    y: invoicedAmount, //monthTotal,
            //                                    bwFiscalYear: bwRequests[i].bwFiscalYear,
            //                                    bwBudgetRequestId: bwRequests[i].bwBudgetRequestId,
            //                                    Title: bwRequests[i].Title,
            //                                    ProjectTitle: bwRequests[i].ProjectTitle,
            //                                    RequestedCapital: requestedCapital,
            //                                    bwRequestJson: bwRequests[i].bwRequestJson,
            //                                    bwOrgId: bwRequestJson.bwOrgId,
            //                                    bwOrgName: bwRequestJson.bwOrgName,
            //                                    Created: bwRequests[i].Created,
            //                                    CreatedBy: bwRequests[i].CreatedBy,
            //                                    CreatedById: bwRequests[i].CreatedById,
            //                                    CreatedByEmail: bwRequests[i].CreatedByEmail,
            //                                    ARStatus: bwRequests[i].ARStatus,
            //                                    BudgetWorkflowStatus: bwRequests[i].BudgetWorkflowStatus
            //                                    //toolTipContent: "<a href = {bwBudgetRequestId}> {label}</a><hr/>Views: {y}",
            //                                }
            //                                data_issuedInvoices.push(point);


            //                            }

            //                        }


            //                        //
            //                        // IF WE WANT ALL ITEMS TO SHOW UP DO THAT HERE> COMMENTED OUT FOR NOW. 7-1-2023.
            //                        //
            //                        //if (!requestedCapital) { // If it's zero [0], then set it to 0.01 so that it will be displayed by the chart.
            //                        //    requestedCapital = 0.01; // This ensures that all the items show up in the chart. 4-8-2022.
            //                        //}

            //                        if (requestedCapital > 0) {

            //                            totalRequestedCapital += requestedCapital;


            //                            var point = {
            //                                t: createdDate,
            //                                x: createdDate,
            //                                y: requestedCapital, //monthTotal,
            //                                bwFiscalYear: bwRequests[i].bwFiscalYear,
            //                                bwBudgetRequestId: bwRequests[i].bwBudgetRequestId,
            //                                Title: bwRequests[i].Title,
            //                                ProjectTitle: bwRequests[i].ProjectTitle,
            //                                RequestedCapital: requestedCapital,
            //                                bwRequestJson: bwRequests[i].bwRequestJson,
            //                                bwOrgId: bwRequestJson.bwOrgId,
            //                                bwOrgName: bwRequestJson.bwOrgName,
            //                                Created: bwRequests[i].Created,
            //                                CreatedBy: bwRequests[i].CreatedBy,
            //                                CreatedById: bwRequests[i].CreatedById,
            //                                CreatedByEmail: bwRequests[i].CreatedByEmail,
            //                                ARStatus: bwRequests[i].ARStatus,
            //                                BudgetWorkflowStatus: bwRequests[i].BudgetWorkflowStatus
            //                                //toolTipContent: "<a href = {bwBudgetRequestId}> {label}</a><hr/>Views: {y}",
            //                            }
            //                            data_requestedCapital.push(point);

            //                        }

            //                    }

            //                    $('#span_bwYearlyBudget_TotalRequestedCapital').html(formatCurrency(totalRequestedCapital));
            //                    $('#span_bwYearlyBudget_TotalInvoicedAmount').html(formatCurrency(totalInvoicedAmount));
            //                    $('#span_bwYearlyBudget_TotalInvoicedAmount_Paid').html(formatCurrency(totalInvoicedAmount_Paid));


            //                    // Add 1 last label/date to the x axis so that everything fits on the screen/chart.
            //                    //var x = labels.length - 1;
            //                    //var lastDate1 = labels[x];
            //                    //var lastDate2 = new Date(lastDate1);
            //                    //var lastDate = lastDate2.toLocaleString().split(',')[0]; 
            //                    //labels.push(lastDate);






            //                    // LOOK AT data HERE TO SEE if there are duplicates in the original dataset ... or if the chart is causing this behaviour. 2-26-2022
            //                    var myChart = new Chart(ctx, {
            //                        //type: 'bar',
            //                        color: 'purple',
            //                        type: 'line',
            //                        data: {
            //                            //color: 'purple',
            //                            labels: labels, // For example, bwRequests[i].Created.
            //                            datasets: [{
            //                                label: 'Requested Capital',
            //                                pointRadius: 50, // This is how we set the point size.
            //                                pointHoverRadius: 50,
            //                                pointHitRadius: 50,
            //                                //pointStyle: ['rect', yourImage, 'triangle', 'circle'],
            //                                //pointBackgroundColor: "rgba(0,191,255)",
            //                                data: data_requestedCapital,
            //                                backgroundColor: 'rgba(255, 255, 255, 0)', // Transparent.
            //                                //backgroundColor: [
            //                                //    'rgba(255, 99, 132, 0.2)',
            //                                //    'rgba(54, 162, 235, 0.2)',
            //                                //    'rgba(255, 206, 86, 0.2)',
            //                                //    'rgba(75, 192, 192, 0.2)',
            //                                //    'rgba(153, 102, 255, 0.2)',
            //                                //    'rgba(255, 159, 64, 0.2)'
            //                                //],
            //                                borderColor: [
            //                                    'rgba(255, 99, 132, 1)',
            //                                    'rgba(54, 162, 235, 1)',
            //                                    'rgba(255, 206, 86, 1)',
            //                                    'rgba(75, 192, 192, 1)',
            //                                    'rgba(153, 102, 255, 1)',
            //                                    'rgba(255, 159, 64, 1)'
            //                                ],
            //                                borderWidth: 1

            //                            },
            //                            {
            //                                //color: 'yellow',
            //                                label: 'Issued Invoices - NOT PAID',
            //                                pointRadius: 25, // This is how we set the point size.
            //                                pointHoverRadius: 25,
            //                                pointHitRadius: 25,
            //                                //pointStyle: ['rect', yourImage, 'triangle', 'circle'],
            //                                pointBackgroundColor: "#000000", // "rgba(0,191,255)",
            //                                data: data_issuedInvoices,
            //                                backgroundColor: 'rgba(255, 255, 255, 0)', // Transparent.
            //                                //backgroundColor: [
            //                                //    'rgba(255, 99, 132, 0.2)',
            //                                //    'rgba(54, 162, 235, 0.2)',
            //                                //    'rgba(255, 206, 86, 0.2)',
            //                                //    'rgba(75, 192, 192, 0.2)',
            //                                //    'rgba(153, 102, 255, 0.2)',
            //                                //    'rgba(255, 159, 64, 0.2)'
            //                                //],
            //                                borderColor: [
            //                                    'rgba(255, 99, 132, 1)',
            //                                    'rgba(54, 162, 235, 1)',
            //                                    'rgba(255, 206, 86, 1)',
            //                                    'rgba(75, 192, 192, 1)',
            //                                    'rgba(153, 102, 255, 1)',
            //                                    'rgba(255, 159, 64, 1)'
            //                                ],
            //                                borderWidth: 5

            //                            },
            //                            {
            //                                label: 'Issued Invoices - PAID',
            //                                pointRadius: 15, // This is how we set the point size.
            //                                pointHoverRadius: 15,
            //                                pointHitRadius: 15,
            //                                //pointStyle: ['rect', yourImage, 'triangle', 'circle'],
            //                                pointBackgroundColor: "#000000", // "rgba(0,191,255)",
            //                                data: data_issuedInvoices_Paid,
            //                                backgroundColor: 'rgba(255, 255, 255, 0)', // Transparent.
            //                                //backgroundColor: [
            //                                //    'rgba(255, 99, 132, 0.2)',
            //                                //    'rgba(54, 162, 235, 0.2)',
            //                                //    'rgba(255, 206, 86, 0.2)',
            //                                //    'rgba(75, 192, 192, 0.2)',
            //                                //    'rgba(153, 102, 255, 0.2)',
            //                                //    'rgba(255, 159, 64, 0.2)'
            //                                //],
            //                                borderColor: [
            //                                    'rgba(255, 99, 132, 1)',
            //                                    'rgba(54, 162, 235, 1)',
            //                                    'rgba(255, 206, 86, 1)',
            //                                    'rgba(75, 192, 192, 1)',
            //                                    'rgba(153, 102, 255, 1)',
            //                                    'rgba(255, 159, 64, 1)'
            //                                ],
            //                                borderWidth: 10

            //                            }]
            //                        },
            //                        options: {
            //                            scales: {
            //                                yAxes: [{
            //                                    ticks: {
            //                                        beginAtZero: true,
            //                                        // Include a dollar sign in the ticks
            //                                        callback: function (value, index, values) {
            //                                            try {
            //                                                return formatCurrencyReturnEmptyForZeroNoDecimal(value);
            //                                            } catch (e) {
            //                                                console.log('Exception in bwYearlyBudget.createPieChart():9-1: ' + e.message + ', ' + e.stack);
            //                                                displayAlertDialog('Exception in bwYearlyBudget.createPieChart():9-1: ' + e.message + ', ' + e.stack);
            //                                            }
            //                                        }
            //                                    },
            //                                }],
            //                                xAxes: [{
            //                                    beginAtZero: true,
            //                                    // 
            //                                    callback: function (value, index, values) {
            //                                        try {
            //                                            return value; // formatCurrencyReturnEmptyForZeroNoDecimal(value);
            //                                        } catch (e) {
            //                                            console.log('Exception in bwYearlyBudget.createPieChart():9-2: ' + e.message + ', ' + e.stack);
            //                                            displayAlertDialog('Exception in bwYearlyBudget.createPieChart():9-2: ' + e.message + ', ' + e.stack);
            //                                        }
            //                                    }


            //                                    ////type: 'time'
            //                                    //callback: function (value, index, values) {
            //                                    //    try {
            //                                    //        return 5; // 'xcx12324213'; // 4-10-2022 formatCurrencyReturnEmptyForZeroNoDecimal(value);
            //                                    //    } catch (e) {
            //                                    //        console.log('Exception in bwYearlyBudget.createPieChart():9: ' + e.message + ', ' + e.stack);
            //                                    //        displayAlertDialog('Exception in bwYearlyBudget.createPieChart():9: ' + e.message + ', ' + e.stack);
            //                                    //    }
            //                                    //}
            //                                }]//,
            //                                //xAxes: [{
            //                                //    //type: 'time'
            //                                //    callback: function (value, index, values) {
            //                                //        try {
            //                                //            return 5; // 'xcx12324213'; // 4-10-2022 formatCurrencyReturnEmptyForZeroNoDecimal(value);
            //                                //        } catch (e) {
            //                                //            console.log('Exception in bwYearlyBudget.createPieChart():9: ' + e.message + ', ' + e.stack);
            //                                //            displayAlertDialog('Exception in bwYearlyBudget.createPieChart():9: ' + e.message + ', ' + e.stack);
            //                                //        }
            //                                //    }
            //                                //}]
            //                            },
            //                            tooltips: {
            //                                // Disable the on-canvas tooltip
            //                                enabled: false, // THIS NEEDS to be set to false to use the original toltip code at the bottomn. 4-11-2022 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            //                                callbacks: {
            //                                    label: function (tooltipItem, data) {
            //                                        try {
            //                                            //var label = data.datasets[tooltipItem.datasetIndex].label || '';
            //                                            //var bwBudgetRequestId = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].bwBudgetRequestId;  
            //                                            //var projectTitle = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].ProjectTitle;
            //                                            //var title = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].Title;
            //                                            //var JustificationDetails = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].JustificationDetails;
            //                                            //var bwOrgId = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].bwOrgId;
            //                                            //var bwOrgName = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].bwOrgName;
            //                                            //var requestedCapital = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].RequestedCapital;

            //                                            //label = {
            //                                            //    bwBudgetRequestId: bwBudgetRequestId,
            //                                            //    Title: title,
            //                                            //    ProjectTitle: projectTitle,
            //                                            //    JustificationDetails: JustificationDetails,
            //                                            //    bwOrgId: bwOrgId,
            //                                            //    bwOrgName: bwOrgName,
            //                                            //    RequestedCapital: requestedCapital
            //                                            //}

            //                                            var label = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]; // This does the same as above, but contains all the data which may not be good. Not sure yet...

            //                                            return label;
            //                                        } catch (e) {
            //                                            console.log('Exception in bwYearlyBudget.createPieChart():8: ' + e.message + ', ' + e.stack);
            //                                            displayAlertDialog('Exception in bwYearlyBudget.createPieChart():8: ' + e.message + ', ' + e.stack);
            //                                        }
            //                                    }
            //                                },
            //                                custom: function (tooltipModel) {
            //                                    try {

            //                                        console.log('In bwYearlyBudget.js.createPieChart.custom().');
            //                                        //
            //                                        // First time here, it displays the executive summary.... hen the mouse moves out of the circle, then this gets rid of the executive summary. // 9-9-2022
            //                                        //
            //                                        //if (thiz.options.temporaryFlagForTesting == true) {
            //                                        //    // Do nothing. This allows the executive summary to remain on the screen.
            //                                        //} else {
            //                                        //    thiz.options.temporaryFlagForTesting = true;




            //                                        //// debugger; // 2-26-2022 is this where the flashing is happening?
            //                                        // Tooltip Element
            //                                        var tooltipEl = document.getElementById('chartjs-tooltip');

            //                                        // Create element on first render
            //                                        if (!tooltipEl) {
            //                                            tooltipEl = document.createElement('div');
            //                                            tooltipEl.id = 'chartjs-tooltip';
            //                                            tooltipEl.innerHTML = '<table></table>';
            //                                            document.body.appendChild(tooltipEl);
            //                                        }

            //                                        // Hide if no tooltip
            //                                        if (tooltipModel.opacity === 0) {
            //                                            tooltipEl.style.opacity = 0;
            //                                            return;
            //                                        }

            //                                        // Set caret Position
            //                                        tooltipEl.classList.remove('above', 'below', 'no-transform');
            //                                        if (tooltipModel.yAlign) {
            //                                            tooltipEl.classList.add(tooltipModel.yAlign);
            //                                        } else {
            //                                            tooltipEl.classList.add('no-transform');
            //                                        }

            //                                        function getBody(bodyItem) {
            //                                            return bodyItem.lines;
            //                                        }

            //                                        // Set Text
            //                                        if (tooltipModel.body) {
            //                                            var titleLines = tooltipModel.title || [];
            //                                            var bodyLines = tooltipModel.body.map(getBody);

            //                                            var innerHtml = '<thead>';

            //                                            titleLines.forEach(function (title) {
            //                                                innerHtml += '<tr><th>' + title + '</th></tr>';
            //                                            });
            //                                            innerHtml += '</thead><tbody>';

            //                                            bodyLines.forEach(function (body, i) {
            //                                                try {
            //                                                    var colors = tooltipModel.labelColors[i];
            //                                                    var style = 'background:' + colors.backgroundColor;
            //                                                    style += '; border-color:' + colors.borderColor;
            //                                                    style += '; border-width: 2px';
            //                                                    var span = '<span style="' + style + '"></span>';
            //                                                    innerHtml += '<tr><td>' + span + body + '</td></tr>';
            //                                                } catch (e) {
            //                                                    console.log('Exception in bwYearlyBudget.createPieChart():5: ' + e.message + ', ' + e.stack);
            //                                                    displayAlertDialog('Exception in bwYearlyBudget.createPieChart():5: ' + e.message + ', ' + e.stack);
            //                                                }
            //                                            });
            //                                            innerHtml += '</tbody>';

            //                                            var bwBudgetRequestId;
            //                                            var title;
            //                                            var projectTitle;
            //                                            var JustificationDetails;
            //                                            var bwOrgId;
            //                                            var bwOrgName;
            //                                            var requestedCapital;

            //                                            // attempt to create custom label
            //                                            bodyLines.forEach(function (body, i) {
            //                                                try {

            //                                                    //var carouselItem_Id = 'xcx2343253';

            //                                                    var bwBudgetRequest = body[0];

            //                                                    thiz.options.brData = bwBudgetRequest; // 4-11-2022

            //                                                    var bwBudgetRequestId = bwBudgetRequest.bwBudgetRequestId;

            //                                                    console.log('In bwYearlyBudget.js.createPieChart.bodyLines.forEach().');
            //                                                    //displayAlertDialog('In bwYearlyBudget.js.createPieChart.bodyLines.forEach(). THIS GENERATES AN EXECUTIVE SUMMARY. THIS SHOULD BE HAPPENING IN bwCommonScripts.js.');

            //                                                    $(tooltipEl).html('');

            //                                                    var divExecutiveSummary = document.createElement('div');
            //                                                    divExecutiveSummary.classList.add('executiveSummaryInCarousel');
            //                                                    divExecutiveSummary.setAttribute('bwbudgetrequestid', bwBudgetRequestId);
            //                                                    divExecutiveSummary.title = 'xcx44432';
            //                                                    divExecutiveSummary.style.minWidth = '300px';
            //                                                    divExecutiveSummary.style.maxWidth = '550px';
            //                                                    divExecutiveSummary.style.display = 'inline-block';
            //                                                    divExecutiveSummary.style.whiteSpace = 'nowrap';
            //                                                    divExecutiveSummary.style.color = 'rgb(38, 38, 38)';
            //                                                    divExecutiveSummary.style.fontFamily = '"Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif';
            //                                                    divExecutiveSummary.style.fontSize = '1.25em';

            //                                                    var ProjectTitle_clean = String(bwBudgetRequest.ProjectTitle).replace(/["]/g, '&quot;').replace(/[']/g, '\\&#39;'); //&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method.
            //                                                    divExecutiveSummary.setAttribute('onclick', '$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'' + bwBudgetRequestId + '\', \'' + bwBudgetRequest.Title + '\', \'' + ProjectTitle_clean + '\', \'' + bwBudgetRequest.Title + '\', \'' + bwBudgetRequest.bwAssignedToRaciRoleAbbreviation + '\', \'' + '7777xcx7777777' + '\');');

            //                                                    //var tableRoot = tooltipEl.querySelector('table');
            //                                                    $(tooltipEl).append(divExecutiveSummary);

            //                                                    // New 8-25-2023.
            //                                                    var promise = bwCommonScripts.getExecutiveSummaryHtml(bwBudgetRequest, 'bwBudgetRequest', divExecutiveSummary);
            //                                                    promise.then(function (results) {
            //                                                        try {

            //                                                            console.log('In bwYearlyBudget.js.createPieChart.bodyLines.forEach(). Populating element [' + results.executiveSummaryElement.id + '].  Returned from getExecutiveSummaryHtmlForRequest(). Displaying executive summary with bwBudgetRequestId: ' + results.bwBudgetRequestId); // + ', result.html: ' + result.html);

            //                                                            $(results.executiveSummaryElement).html(results.html);

            //                                                            var promise2 = bwCommonScripts.renderInventoryItems_ForExecutiveSummary(results.bwBudgetRequest.bwBudgetRequestId, results.bwBudgetRequest, results.executiveSummaryElement);
            //                                                            promise2.then(function (results) {
            //                                                                try {

            //                                                                    console.log('In bwYearlyBudget.js.createPieChart.bodyLines.forEach(). Returned from call to bwCommonScripts.renderInventoryItems_ForExecutiveSummary.');

            //                                                                    var promise3 = bwCommonScripts.renderAttachments_ForExecutiveSummary(results.bwBudgetRequestId, results.executiveSummaryElement, true); // This sets forceRenderTheImageThumbnail to true.
            //                                                                    promise3.then(function (results) {
            //                                                                        try {

            //                                                                            console.log('In bwYearlyBudget.js.createPieChart.bodyLines.forEach(). Returned from call to bwCommonScripts.renderAttachments_ForExecutiveSummary.');

            //                                                                        } catch (e) {

            //                                                                            var msg = 'Exception in bwYearlyBudget.js.createPieChart.bodyLines.forEach():2-2-2: ' + e.message + ', ' + e.stack;
            //                                                                            console.log(msg);
            //                                                                            alert(msg);
            //                                                                            var result = {
            //                                                                                status: 'EXCEPTION',
            //                                                                                message: msg
            //                                                                            }
            //                                                                            reject(result);

            //                                                                        }
            //                                                                    }).catch(function (e) {

            //                                                                        var msg = 'Exception in bwYearlyBudget.js.createPieChart.bodyLines.forEach():2-2-2: ' + JSON.stringify(e);
            //                                                                        console.log(msg);
            //                                                                        alert(msg);
            //                                                                        var result = {
            //                                                                            status: 'EXCEPTION',
            //                                                                            message: msg
            //                                                                        }
            //                                                                        reject(result);

            //                                                                    });

            //                                                                } catch (e) {

            //                                                                    var msg = 'Exception in bwYearlyBudget.js.createPieChart.bodyLines.forEach():2-2-2-3: ' + e.message + ', ' + e.stack;
            //                                                                    console.log(msg);
            //                                                                    alert(msg);
            //                                                                    var result = {
            //                                                                        status: 'EXCEPTION',
            //                                                                        message: msg
            //                                                                    }
            //                                                                    reject(result);

            //                                                                }
            //                                                            }).catch(function (e) {

            //                                                                var msg = 'Exception in bwYearlyBudget.js.createPieChart.bodyLines.forEach():2-2-2-3: ' + JSON.stringify(e);
            //                                                                console.log(msg);
            //                                                                alert(msg);
            //                                                                var result = {
            //                                                                    status: 'EXCEPTION',
            //                                                                    message: msg
            //                                                                }
            //                                                                reject(result);

            //                                                            });

            //                                                        } catch (e) {
            //                                                            var msg = 'Exception in bwYearlyBudget.js.createPieChart.bodyLines.forEach():xcx2131234234: ' + e.message + ', ' + e.stack;
            //                                                            console.log(msg);
            //                                                            alert(msg);
            //                                                            var result = {
            //                                                                status: 'EXCEPTION',
            //                                                                message: msg
            //                                                            }
            //                                                            reject(result);

            //                                                        }

            //                                                    }).catch(function (e) {
            //                                                        debugger;
            //                                                        var msg = 'Exception in bwYearlyBudget.js.createPieChart.bodyLines.forEach():2-2-2: ' + JSON.stringify(e);
            //                                                        console.log(msg);
            //                                                        alert(msg);
            //                                                        var result = {
            //                                                            status: 'EXCEPTION',
            //                                                            message: msg
            //                                                        }
            //                                                        reject(result);

            //                                                    });

            //                                                } catch (e) {
            //                                                    console.log('Exception in bwYearlyBudget.createPieChart():3: ' + e.message + ', ' + e.stack);
            //                                                    displayAlertDialog('Exception in bwYearlyBudget.createPieChart():3: ' + e.message + ', ' + e.stack);
            //                                                }

            //                                            });

            //                                        }

            //                                        // THIS SECTION IS THE ORIGINAL TOOLTIP, WHICH WORKS!!!!!!!!!!!!!!!!!!!!! trying something else for the time being 4-11-2022
            //                                        // `this` will be the overall tooltip
            //                                        var position = this._chart.canvas.getBoundingClientRect();

            //                                        // Display, position, and set styles for font
            //                                        tooltipEl.style.opacity = 1;
            //                                        tooltipEl.style.position = 'absolute';

            //                                        //
            //                                        // Here we have to check if we are going off the left side of the screen, and adjust appropriately.
            //                                        //
            //                                        var left = position.left + window.pageXOffset + tooltipModel.caretX; // + 'px';
            //                                        var windowWidth = $(window).width(); // bwYearlyBudget_divTooltipHoverDialog
            //                                        var dialogWidth = $('#bwYearlyBudget_divTooltipHoverDialog').width();
            //                                        //console.log('left: ' + left + ', windowWidth: ' + windowWidth + ', dialogWidth: ' + dialogWidth); // For example: left: 2753, width: 2797, width2: 443.55

            //                                        var rightMargin = windowWidth - dialogWidth;
            //                                        //console.log('rightMargin: ' + rightMargin + ', left: ' + left + ', dialogWidth: ' + dialogWidth);
            //                                        if (rightMargin > left) {
            //                                            // This means we are on the screen. Great!
            //                                            //console.log('This means we are on the screen. Great!');
            //                                            tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
            //                                        } else {
            //                                            // This means it is going off the right hand side of the screen.
            //                                            //console.log('This means it is going off the right hand side of the screen.');
            //                                            tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX - dialogWidth + 'px';
            //                                        }

            //                                        //
            //                                        // Now we have to figure out the "top" value.
            //                                        //
            //                                        var top = position.top + window.pageYOffset + tooltipModel.caretY;
            //                                        //var dialogHeight = $('#bwYearlyBudget_divTooltipHoverDialog').height();
            //                                        //var dialogRect = document.getElementById('bwYearlyBudget_divTooltipHoverDialog').getBoundingClientRect();
            //                                        var dialogHeight = 400; // This is an approximation.
            //                                        console.log('position.height: ' + position.height + ', top: ' + top + ', dialogHeight: ' + dialogHeight);

            //                                        var topMargin = position.height - dialogHeight;
            //                                        if (top < topMargin) {
            //                                            // On screen.
            //                                            tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
            //                                        } else {
            //                                            // Not on screen.
            //                                            tooltipEl.style.top = position.top + dialogHeight + 'px';
            //                                        }
            //                                        //


            //                                        //tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px'; // This is the original line of code, which is now done in a section above.
            //                                        //tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px'; // This is the original line of code, which is now done in a section above.
            //                                        tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
            //                                        tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
            //                                        tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
            //                                        tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
            //                                        tooltipEl.style.pointerEvents = 'none';
            //                                        //}

            //                                    } catch (e) {
            //                                        console.log('Exception in bwYearlyBudget.createPieChart():7: ' + e.message + ', ' + e.stack);
            //                                        displayAlertDialog('Exception in bwYearlyBudget.createPieChart():7: ' + e.message + ', ' + e.stack);
            //                                    }
            //                                }
            //                            }
            //                        }
            //                    });
            //                }
            //            }

            //        } catch (e) {
            //            //thiz.element.html = 'Exception in renderDataGridxcx2: ' + e.message + ', ' + e.stack;
            //            console.log('Exception in bwYearlyBudget.createPieChart():2: ' + e.message + ', ' + e.stack);
            //            displayAlertDialog('Exception in bwYearlyBudget.createPieChart():2: ' + e.message + ', ' + e.stack);
            //        }
            //    },
            //    error: function (data, errorCode, errorMessage) {
            //        console.log('Error in bwYearlyBudget.createPieChart():' + errorCode + ', ' + errorMessage + ', data: ' + JSON.stringify(data));
            //        displayAlertDialog('Error in bwYearlyBudget.createPieChart():' + errorCode + ', ' + errorMessage + ', data: ' + JSON.stringify(data));
            //        //this.element.html = 'Error in renderDataGridxcx3345687';
            //    }
            //});

        } catch (e) {
            // Todd: We should really be checking if this should be displayed or not.
            //handleExceptionWithAlert('Error in Start.js.createPieChart()', e.message);
            console.log('Exception in bwYearlyBudget.createPieChart(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwYearlyBudget.createPieChart(): ' + e.message + ', ' + e.stack);
        }
    },

    ArchiveRequestTypeDropDown_Onchange: function (element) {
        try {
            console.log('In bwYearlyBudget.js.ArchiveRequestTypeDropDown_Onchange().');
            var thiz = this;

            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            var bwRequestTypeId = $('#selectRequestTypeDropDown option:selected').val();

            // Save the selected value back to the database so that it remembers how the participant left things, so it is the same when they come back.
            var data = {
                bwParticipantId: participantId,
                bwWorkflowAppId: workflowAppId,
                bwLastSelectedArchiveScreenRequestType: bwRequestTypeId
            };
            var operationUri = webserviceurl + "/bwparticipant/updateuserconfigurationselectedarchivescreenrequesttype";
            $.ajax({
                url: operationUri,
                type: "POST",
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    try {
                        if (data != 'SUCCESS') {
                            displayAlertDialog(data);
                        } else {


                            thiz.createPieChart(); // 4-12-2022 // loadDataAndRenderDetailedListOrExecutiveSummary();



                            //alert('This functionality is incomplete. Coming soon! xcx234526');
                            //// debugger;
                            ////displayAlertDialog('selectedValue: ' + selectedValue);
                            //if (bwRequestTypeId == 'budgetrequest') {
                            //    cmdListAllBudgetRequestsUsingClientDatasetApproach();
                            //} else if (bwRequestTypeId == 'quoterequest') {
                            //    //displayAlertDialog('The functionality to display Quote Requests is incomplete. Coming soon!');
                            //    //populateStartPageItem('divArchive'); // Resets back to Budget Requests or now until we get this hooked up!
                            //    cmdListAllQuoteRequestsUsingClientDatasetApproach();
                            //} else if (bwRequestTypeId == 'expenserequest') {
                            //    //displayAlertDialog('The functionality to display Reimbursement Requests is incomplete. Coming soon!');
                            //    //populateStartPageItem('divArchive'); // Resets back to Budget Requests or now until we get this hooked up!
                            //    cmdListAllReimbursementRequestsUsingClientDatasetApproach();
                            //} else if (bwRequestTypeId == 'recurringexpense') {
                            //    cmdDisplayArchivePageRecurringExpenses();
                            //} else if (bwRequestTypeId == 'participant') {
                            //    //displayAlertDialog('The functionality to display Participant details is incomplete. Coming soon!');
                            //    //populateStartPageItem('divArchive'); // Resets back to Budget Requests or now until we get this hooked up!
                            //    cmdListAllParticipantsUsingClientDatasetApproach();
                            //}
                        }
                    } catch (e) {
                        console.log('Exception in bwYearlyBudget.js.ArchiveRequestTypeDropDown_Onchange():1: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwYearlyBudget.js.ArchiveRequestTypeDropDown_Onchange():1: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in bwYearlyBudget.js.ArchiveRequestTypeDropDown_Onchange(): ' + errorCode + ' ' + errorMessage);
                    displayAlertDialog('Error in bwYearlyBudget.js.ArchiveRequestTypeDropDown_Onchange(): ' + errorCode + ' ' + errorMessage);
                }
            });

        } catch (e) {
            console.log('Exception in bwYearlyBudget.js.ArchiveRequestTypeDropDown_Onchange(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwYearlyBudget.js.ArchiveRequestTypeDropDown_Onchange(): ' + e.message + ', ' + e.stack);
        }
    },

    MoneyType_Onchange: function (moneyType) {
        try {
            console.log('In bwYearlyBudget.js.MoneyType_Onchange(). moneyType: ' + moneyType);

            alert('In bwYearlyBudget.js.MoneyType_Onchange(). moneyType: ' + moneyType);
            //var thiz = this;

            //var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            //var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            //var bwRequestTypeId = $('#selectRequestTypeDropDown option:selected').val();

            //// Save the selected value back to the database so that it remembers how the participant left things, so it is the same when they come back.
            //var data = {
            //    bwParticipantId: participantId,
            //    bwWorkflowAppId: workflowAppId,
            //    bwLastSelectedArchiveScreenRequestType: bwRequestTypeId
            //};
            //var operationUri = webserviceurl + "/bwparticipant/updateuserconfigurationselectedarchivescreenrequesttype";
            //$.ajax({
            //    url: operationUri,
            //    type: "POST",
            //    data: data,
            //    headers: {
            //        "Accept": "application/json; odata=verbose"
            //    },
            //    success: function (data) {
            //        try {
            //            if (data != 'SUCCESS') {
            //                displayAlertDialog(data);
            //            } else {


            //                thiz.createPieChart(); // 4-12-2022 // loadDataAndRenderDetailedListOrExecutiveSummary();



            //                //alert('This functionality is incomplete. Coming soon! xcx234526');
            //                //// debugger;
            //                ////displayAlertDialog('selectedValue: ' + selectedValue);
            //                //if (bwRequestTypeId == 'budgetrequest') {
            //                //    cmdListAllBudgetRequestsUsingClientDatasetApproach();
            //                //} else if (bwRequestTypeId == 'quoterequest') {
            //                //    //displayAlertDialog('The functionality to display Quote Requests is incomplete. Coming soon!');
            //                //    //populateStartPageItem('divArchive'); // Resets back to Budget Requests or now until we get this hooked up!
            //                //    cmdListAllQuoteRequestsUsingClientDatasetApproach();
            //                //} else if (bwRequestTypeId == 'expenserequest') {
            //                //    //displayAlertDialog('The functionality to display Reimbursement Requests is incomplete. Coming soon!');
            //                //    //populateStartPageItem('divArchive'); // Resets back to Budget Requests or now until we get this hooked up!
            //                //    cmdListAllReimbursementRequestsUsingClientDatasetApproach();
            //                //} else if (bwRequestTypeId == 'recurringexpense') {
            //                //    cmdDisplayArchivePageRecurringExpenses();
            //                //} else if (bwRequestTypeId == 'participant') {
            //                //    //displayAlertDialog('The functionality to display Participant details is incomplete. Coming soon!');
            //                //    //populateStartPageItem('divArchive'); // Resets back to Budget Requests or now until we get this hooked up!
            //                //    cmdListAllParticipantsUsingClientDatasetApproach();
            //                //}
            //            }
            //        } catch (e) {
            //            console.log('Exception in bwYearlyBudget.js.ArchiveRequestTypeDropDown_Onchange():1: ' + e.message + ', ' + e.stack);
            //            displayAlertDialog('Exception in bwYearlyBudget.js.ArchiveRequestTypeDropDown_Onchange():1: ' + e.message + ', ' + e.stack);
            //        }
            //    },
            //    error: function (data, errorCode, errorMessage) {
            //        console.log('Error in bwYearlyBudget.js.ArchiveRequestTypeDropDown_Onchange(): ' + errorCode + ' ' + errorMessage);
            //        displayAlertDialog('Error in bwYearlyBudget.js.ArchiveRequestTypeDropDown_Onchange(): ' + errorCode + ' ' + errorMessage);
            //    }
            //});

        } catch (e) {
            console.log('Exception in bwYearlyBudget.js.MoneyType_Onchange(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwYearlyBudget.js.MoneyType_Onchange(): ' + e.message + ', ' + e.stack);
        }
    },

    renderAttachments: function (bwBudgetRequestId) {
        try {
            console.log('In bwYearlyBudget.js.renderAttachments().');
            var thiz = this;
            //alert('In bwYearlyBudget.js.renderAttachments().');

            //var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            //var operationUri = globalUrlPrefix + globalUrl + '/_files/' + 'getprimaryimageforbudgetrequest/' + workflowAppId + '/' + bwBudgetRequestId; // _files allows us to use nginx to route these to a dedicated file server.
            //$.ajax({
            //    url: operationUri,
            //    method: "GET",
            //    headers: {
            //        "Accept": "application/json; odata=verbose"
            //    },
            //    success: function (data) {

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

                        console.log('In bwYearlyBudget.js.renderAttachments(). DISPLAYING HOVER OVER EXECUTIVE SUMMARY xcx212312312241264769879 elementIdSuffix: ' + thiz.options.elementIdSuffix + ', workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', results: ' + JSON.stringify(results));

                        var html = $('.bwCoreComponent:first').bwCoreComponent('createHtmlToDisplayTheListOfAttachments_ForExecutiveSummary', thiz.options.elementIdSuffix, workflowAppId, bwBudgetRequestId, null, results);

                        if (bwBudgetRequestId) {
                            if (html != '') {
                                var html2 = '';
                                html2 += '<div>';
                                html2 += '<span style="color:black;font-size:12pt;font-weight:normal;float:left;">Attachment(s): </span>'; // Add the title, since we have some items to display.
                                html2 += '<br />';
                                html = html2 + html + '</div>';
                                $('#bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_' + bwBudgetRequestId).append(html);
                            }
                        }
                    } catch (e) {
                        if (e.number) {
                            displayAlertDialog('Error in populateAttachments():1-1: ' + e.number + ', "' + e.message + '", ' + e.stack);
                        } else {
                            // This most likely means that the folders are there on the file services server, but there is nothing in them.
                            //
                            // Fileservices has an error, so show nothing! We will put a red exclamation pin in the attachments section eventually! - 10-1-17 todd
                            //displayAlertDialog('Fileservices has an error: ' + ' "' + e.message + '"');
                        }

                        console.log('Exception in bwExecutiveSummariesCarousel2.js.renderAttachments():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwExecutiveSummariesCarousel2.js.renderAttachments():2: ' + e.message + ', ' + e.stack);

                    }
                },
                error: function (data, errorCode, errorMessage) {
                    if (errorCode === 'timeout' && errorMessage === 'timeout') {
                        displayAlertDialog('SERVICE UNAVAILABLE. File services is not respondingxcx2. communication timeout is set at ' + ajaxTimeout / 1000 + ' seconds: ' + errorCode + ', ' + errorMessage);
                    } else {


                        console.log('');
                        console.log('********************************************************************');
                        console.log('Error in bwYearlyBudget.js.showRowHoverDetails:2:3 ' + errorCode + ', ' + errorMessage);
                        console.log('********************************************************************');
                        console.log('');

                        //displayAlertDialog('Error in showRowHoverDetails:2:3 ' + errorCode + ', ' + errorMessage);





                        // The latest error 1-17-2018 is errorCode:'error' and errorMessage:'Not Found'.
                        // What does this mean? You can replicate this error!
                        // at Url: https://budgetworkflow.com/ios8.html, view an offline (Un-submitted) request, and try to add an attachment.
                    }
                }
            });
        } catch (e) {
            console.log('Exception in bwExecutiveSummariesCarousel2.js.renderAttachments(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwExecutiveSummariesCarousel2.js.renderAttachments(): ' + e.message + ', ' + e.stack);
        }
    },

    //console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Calling renderAttachments(). bwBudgetRequestId: ' + bwBudgetRequestId);
    //renderAttachments(bwBudgetRequestId);




    //displayAlertDialog: function (errorMessage) {
    //    try {
    //        document.getElementById('spanErrorMessage').innerHTML = errorMessage;
    //        $("#divAlertDialog").dialog({
    //            modal: true,
    //            resizable: false,
    //            //closeText: "Cancel",
    //            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
    //            //title: 'Add a New Person',
    //            width: '800',
    //            dialogClass: "no-close", // No close button in the upper right corner.
    //            hide: false, // This means when hiding just disappear with no effects.
    //            open: function () {
    //                $('.ui-widget-overlay').bind('click', function () {
    //                    $("#divAlertDialog").dialog('close');
    //                });
    //            },
    //            close: function () {
    //                //$(this).dialog('destroy').remove();
    //            }
    //        });
    //        $("#divAlertDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
    //    } catch (e) {
    //        console.log('Exception in bwYearlyBudget.displayAlertDialog(): ' + e.message + ', ' + e.stack);
    //    }
    //}

});