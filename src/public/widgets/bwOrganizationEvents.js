$.widget("bw.bwOrganizationEvents", {
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
        This is the bwOrganizationEvents.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        bwOrgId: null, // bwDataGrid reaches out for this value.
        bwOrgName: null, // bwDataGrid reaches out for this value.

        bwTenantId: null,
        bwWorkflowAppId: null,

        operationUriPrefix: null,

    },
    _create: function (assignmentRowChanged_ElementId) {
        this.element.addClass("bwOrganizationEvents");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {
            debugger;
            if (this.options.operationUriPrefix == null) {
                // This formulates the operationUri, which is used throughout.
                var url1 = window.location.href.split('https://')[1];
                var url2 = url1.split('/')[0];
                this.options.operationUriPrefix = 'https://' + url2 + '/';
            }


            var html = '';



            html += '               <span style="color:black;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 25pt;font-weight:bold;">Organization Events</span>'; // Velvet Morning is #95b1d3. This was the pantone color of the day for December 9, 2019! :D
            html += '<br /><br />';

            html += '<table>';
            html += '  <tr>';




            html += '    <td>';

            html += '      <span style="color:white;background-color:skyblue;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdRefreshWebsiteErrorThreatDetails\');">Refresh';
            //html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png">';
            html += '      </span>';

            html += '    </td>';



            html += '    <td>';



            //html += '      <span style="color:white;background-color:#009933;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdDisplayWebsiteErrorThreatDetails\', \'verbose\');">Verbose: <span>#</span>';
            //html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png">';
            //html += '      </span>';
            html += '    </td>';




            var severeErrorThreats = [];
            var highLevelErrorThreats = [];
            var elevatedErrorThreats = [];
            var guardedErrorThreats = [];
            var lowErrorThreats = [];

            html += '    <td>';
            html += '      <span style="color:white;background-color:#ff0000;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" >';
            html += '           <span onclick="$(\'.bwOrganizationEvents\').bwOrganizationEvents(\'cmdDisplayWebsiteErrorThreatDetails\', \'ROLE_MEMBERSHIP_CHANGES\');">ROLE_MEMBERSHIP_CHANGES: ' + severeErrorThreats.length + '</span>';
            if (severeErrorThreats.length > 0) {
                html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdDeleteAllExceptionLogs\', \'severe\');">';
            }
            html += '      </span>';
            html += '    </td>';

            html += '    <td>';
            html += '      <span style="color:white;background-color:#ff9900;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" >';
            html += '           <span onclick="$(\'.bwOrganizationEvents\').bwOrganizationEvents(\'cmdDisplayWebsiteErrorThreatDetails\', \'ORG_STRUCTURE_CHANGES\');">ORG_STRUCTURE_CHANGES: ' + highLevelErrorThreats.length + '</span>'; 
            if (highLevelErrorThreats.length > 0) {
                html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdDeleteAllExceptionLogs\', \'high\');">';
            }
            html += '      </span>';
            html += '    </td>';

            html += '    <td>';
            html += '      <span style="color:#ff9900;background-color:#ffff00;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" >';
            //html += '           <span onclick="$(\'.bwOrganizationEvents\').bwOrganizationEvents(\'cmdDisplayWebsiteErrorThreatDetails\', \'elevated\');">Elevated (client): ' + elevatedErrorThreats.length + '</span>';
            if (elevatedErrorThreats.length > 0) {
                html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdDeleteAllExceptionLogs\', \'elevated\');">';
            }
            html += '      </span>';
            html += '    </td>';

            html += '    <td>';
            html += '      <span style="color:white;background-color:#0066ff;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" >';
            //html += '           <span onclick="$(\'.bwOrganizationEvents\').bwOrganizationEvents(\'cmdDisplayWebsiteErrorThreatDetails\', \'guarded\');">Guarded: ' + guardedErrorThreats.length + '</span>';
            if (guardedErrorThreats.length) {
                html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdDeleteAllExceptionLogs\', \'guarded\');">';
            }
            html += '      </span>';
            html += '    </td>';

            html += '    <td>';
            html += '      <span style="color:white;background-color:#009933;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" >';
            //html += '           <span onclick="$(\'.bwOrganizationEvents\').bwOrganizationEvents(\'cmdDisplayWebsiteErrorThreatDetails\', \'low\');">Low: ' + lowErrorThreats.length + '</span>';
            if (lowErrorThreats.length) {
                html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdDeleteAllExceptionLogs\', \'low\');">';
            }
            html += '      </span>';
            html += '    </td>';

            html += '  </tr>';
            html += '</table>';

            html += '        <span id="spanWebsiteErrorThreats"></span>';
            html += '        <!-- Severe #ff0000, High #ff9900, Elevated #ffff00, Guarded #0066ff, Low #009933 -->';
            html += '        &nbsp;<textarea id="txtBwOrganizationEvents_LogDetails" rows="50" cols="200" style="padding-top:4px;"></textarea>';
            html += '        <br /><br />';









            //html += 'bwOrganizationEvents widget';
            this.element.html(html);



            console.log('In bwOrganizationEvents._create(). The widget has been initialized.');
            this.options.instantiated = true; // This is so we can check if the thing is instantiated yet.

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwOrganizationEventsxcx2</span>';
            html += '<br />';
            html += '<span style="">Exception in bwOrganizationEvents.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
    cmdDisplayWebsiteErrorThreatDetails: function (threatLevel) {
        try {
            console.log('In bwOrganizationEvents.js.cmdDisplayWebsiteErrorThreatDetails(' + threatLevel + ').');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            $(this.element).find('#txtBwOrganizationEvents_LogDetails').val('');

            var json = {
                bwWorkflowAppId: workflowAppId
            }
            $.ajax({
                url: this.options.operationUriPrefix + "_bw/organizationeventssummary",
                type: "POST",
                data: json,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (result) {
                    try {
                        if (result.message != 'SUCCESS') {
                            console.log('Error in cmdDisplayWebsiteErrorThreatDetails(). Unexpected response: ' + result.message);
                            displayAlertDialog('Error in cmdDisplayWebsiteErrorThreatDetails(). Unexpected response: ' + result.message);
                        } else {
                            var data = result.data;
                            var html = '';
                            for (var i = 0; i < data.length; i++) {
                                //if (data[i].EventType == threatLevel) {

                                // 3-1-2022
                                //var timestamp4 = $('.bwAuthentication').bwAuthentication('getBudgetWorkflowStandardizedDate', data[i].Created);
                                var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(data[i].Created); // 7-11-2024.
                                html += timestamp4 + '  ';

                                if (data[i].CreatedByIpAddress || data[i].CreatedById || data[i].bwWorkflowAppId) {
                                    html += 'IP: [' + data[i].CreatedByIpAddress + '] Participant: [' + data[i].CreatedById + '] Organization: [' + data[i].bwWorkflowAppId + ']';
                                }
                                html += '\n';

                                html += '' + data[i].Description + ',  ';
                                html += 'Source xcx2 xcx3394-2: ' + data[i].EventSubType + ' ';

                                html += '\n\n';

                                //}
                            }
                            html += 'DONE';
                            $(thiz.element).find('#txtBwOrganizationEvents_LogDetails').val(html); //append(html);
                        }
                    } catch (e) {
                        console.log('Exception in bwOrganizationEvents.cmdDisplayWebsiteErrorThreatDetails(' + threatLevel + '):2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwOrganizationEvents.cmdDisplayWebsiteErrorThreatDetails(' + threatLevel + '):2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    //window.waitDialog.close();
                    //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
                    displayAlertDialog('Error in bwOrganizationEvents.cmdDisplayWebsiteErrorThreatDetails():' + errorCode + ', ' + errorMessage);
                }
            });
        } catch (e) {
            console.log('Exception in bwOrganizationEvents.cmdDisplayWebsiteErrorThreatDetails(' + threatLevel + '): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwOrganizationEvents.cmdDisplayWebsiteErrorThreatDetails(' + threatLevel + '): ' + e.message + ', ' + e.stack);
        }
    },
    cmdRefreshWebsiteErrorThreatDetails: function (threatLevel) {
        try {
            console.log('In cmdRefreshWebsiteErrorThreatDetails(' + threatLevel + ').');

            this.renderMonitoringTools();

            //var thiz = this;
            ////debugger;
            ////$(this.element).find('#txtBwExceptionLogDetails').val(''); //empty(); // txtBwExceptionLogDetails
            //$('#txtBwExceptionLogDetails').val('');
            //$.ajax({
            //    url: webserviceurl + "/websiteerrorthreatsummary",
            //    type: "DELETE",
            //    contentType: 'application/json',
            //    success: function (data) {
            //        try {
            //            var html = '';
            //            for (var i = 0; i < data.length; i++) {
            //                if (data[i].ErrorThreatLevel == threatLevel) {
            //                    html += 'Timestamp: ' + data[i].Timestamp + ', ';
            //                    html += 'Message: ' + data[i].Message + ',  ';
            //                    html += 'Source: ' + data[i].Source + ' ';
            //                    html += '\n\n';
            //                }
            //            }
            //            debugger;
            //            html += 'DONE';
            //            //$(thiz.element).find('#txtBwExceptionLogDetails').val(html); //append(html);
            //            $('#txtBwExceptionLogDetails').val(html); //append(html);
            //        } catch (e) {
            //            console.log('Exception in cmdDisplayWebsiteErrorThreatDetails(' + threatLevel + '):2: ' + e.message + ', ' + e.stack);
            //        }
            //    },
            //    error: function (data, errorCode, errorMessage) {
            //        //window.waitDialog.close();
            //        //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            //        thiz.displayAlertDialog('Error in bwMonitoringTools.v():' + errorCode + ', ' + errorMessage);
            //    }
            //});
        } catch (e) {
            console.log('Exception in bwMonitoringTools.cmdRefreshWebsiteErrorThreatDetails(' + threatLevel + '): ' + e.message + ', ' + e.stack);
        }
    },







});