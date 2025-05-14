$.widget("bw.bwMonitoringTools_Main", {
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
        This is the bwMonitoringTools_Main.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */



        webservicesUrl: null,
        webservicesPort: null,
        websiteUrl: null,
        websitePort: null,





        elementIdSuffix: null, // This is a custom guid which gets appended to element id's, making sure this widget keeps to itself.

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
        bwTenantId: null,
        bwWorkflowAppId: null,
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
        this.element.addClass("bwMonitoringTools_Main");
        var thiz = this; // Need this because of the asynchronous operations below.
        console.log('In bwMonitoringTools_Main.js._create().');
        debugger;
        try {
            if (this.options.operationUriPrefix == null) {
                // This formulates the operationUri, which is used throughout.
                //var url1 = window.location.href.split('https://')[1];
                //var url2 = url1.split('/')[0];
                //this.options.operationUriPrefix = 'https://' + url2 + '/';

                // UNFINISHED 5-14-2025.
                this.options.operationUriPrefix = this.options.webservicesUrl + '' + this.options.webservicesPort;

            }

            var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            this.options.elementIdSuffix = guid;

            this.loadAndRenderMonitoringTools();

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwMonitoringTools_Main: CANNOT INSTANTIATE THE WIDGET</span>';
            html += '<br />';
            html += '<span style="">Exception in bwMonitoringTools_Main.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
    loadAndRenderMonitoringTools: function () {
        try {
            console.log('In bwMonitoringTools_Main.js.loadAndRenderMonitoringTools().');
            alert('In bwMonitoringTools_Main.js.loadAndRenderMonitoringTools(). THIS NEEDS SOME WORK!!!!!!!!!');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var activeStateIdentifier = $('.bwAuthentication').bwAuthentication('getActiveStateIdentifier');

            var clientException;
            var element = document.getElementById('bwMonitoringTools_Main_ClientOrServerMessageSelector');
            if (element) {
                clientException = element.checked;

                console.log('In bwMonitoringTools_Main.js.loadAndRenderMonitoringTools(). Calling websiteerrorthreatsummary(). clientException: ' + clientException);
                //alert('In bwMonitoringTools_Main.js.loadAndRenderMonitoringTools(). Calling websiteerrorthreatsummary(). clientException: ' + clientException);
            }

            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                bwWorkflowAppId: 'ALL',
                ClientException: clientException
            };

            $.ajax({
                url: webserviceurl + "/websiteerrorthreatsummary",
                type: "POST",
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (data) {
                    try {
                        //debugger;
                        //alert('xcx23231 Returned result from websiteerrorthreatsummary(). data: ' + JSON.stringify(data));
                        if (!data.result) {

                            displayAlertDialog('Error in renderMonitoringTools(). ' + data.status);

                        } else {

                            console.log('In renderMonitoringTools(). Returned result from websiteerrorthreatsummary(). length: ' + data.result.length);

                            // Severe #ff0000, High #ff9900, Elevated #ffff00, Guarded #0066ff, Low #009933
                            var severeErrorThreats = [];
                            //severeErrorThreats = new Array();
                            //
                            var highLevelErrorThreats = [];
                            //highLevelErrorThreats = new Array();
                            //
                            var elevatedErrorThreats = [];
                            //elevatedErrorThreats = new Array();
                            //
                            var guardedErrorThreats = [];
                            //guardedErrorThreats = new Array();
                            //
                            var lowErrorThreats = [];
                            //lowErrorThreats = new Array();

                            var emailErrorThreats = [];

                            // Fill the arrays.
                            for (var i = 0; i < data.result.length; i++) {
                                var exceptionLogEntry = data.result[i].Message; // Todd currently we are only getting the message. The detail display will want more of the information from the BwExceptionLog table.




                                if (data.result[i].ErrorThreatLevel == 'severe') {
                                    severeErrorThreats.push(exceptionLogEntry);
                                    // Severe threats include:
                                    // - failure to send an email.
                                    // - failure of a web method to reach it's intended conslusion.
                                    // ...
                                } else if (data.result[i].ErrorThreatLevel == 'high') {
                                    highLevelErrorThreats.push(exceptionLogEntry);
                                } else if (data.result[i].ErrorThreatLevel == 'elevated') {
                                    elevatedErrorThreats.push(exceptionLogEntry);
                                } else if (data.result[i].ErrorThreatLevel == 'guarded') {
                                    guardedErrorThreats.push(exceptionLogEntry);
                                } else if (data.result[i].ErrorThreatLevel == 'low') {
                                    lowErrorThreats.push(exceptionLogEntry);
                                }
                            }

                            var html = '';

                            html += '<style>';
                            html += '   .bwMonitoringTools_cmdDisplayWebsiteErrorThreatDetails:hover, focus, active, focus-visible {'; // This style makes the border orange for an active element.
                            html += '       color:black !important;';
                            html += '       background-color:aliceblue !important;';
                            html += '       border: 1px solid skyblue;';
                            html += '   }';
                            html += '</style>';

                            // This is the drop-down span tag!
                            html += '<span style="font-size:xx-large;color:darkgray;white-space:nowrap;">';
                            html += '   Errors, exceptions, and important events: ';
                            html += '</span>';


                            html += '<table>';
                            html += '   <tr>';
                            html += '       <td>';
                            html += '           <div id="divBwStartDatePicker" style="display:inline-block;"></div>';
                            html += '       </td>';
                            html += '       <td>';
                            html += '           <div id="divBwEndDatePicker" style="display:inline-block;"></div>';
                            html += '       </td>';
                            html += '       <td>&nbsp;</td>';
                            html += '       <td>';

                            html += '<br /><br />';
                            html += '<br /><br />';
                            html += '           <input type="checkbox" id="bwMonitoringTools_Main_ClientOrServerMessageSelector" onchange="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'selectOrganizationThreats_OnChange\', this);" style="transform:scale(3);" />&nbsp;&nbsp;Select to display client-side messages.';

                            html += '<br /><br />';
                            html += '           <input type="checkbox" id="bwMonitoringTools_Main_ClientOrServerMessageSelectorxx" onchange="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'selectOrganizationThreats_OnChangexx\', this);" style="transform:scale(3);" />&nbsp;&nbsp;Select to display web and file services messages.';

                            html += '<br /><br />';
                            html += '           <input type="checkbox" id="bwMonitoringTools_Main_ClientOrServerMessageSelectorxx" onchange="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'selectOrganizationThreats_OnChangexx\', this);" style="transform:scale(3);" />&nbsp;&nbsp;Select to display Timer Services messages.';

                            html += '<br /><br />';
                            html += '           <input type="checkbox" id="bwMonitoringTools_Main_ClientOrServerMessageSelectorxx" onchange="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'selectOrganizationThreats_OnChangexx\', this);" style="transform:scale(3);" />&nbsp;&nbsp;Select to display Haraka email service messages.';

                            html += '       </td>';
                            html += '   </tr>';
                            html += '</table>';



                            html += '<br />';
                            //  html += '<span id="spanBwMonitoringTools2_' + thiz.options.elementIdSuffix + '">';
                            html += '<select id="selectOrganizationErrorThreats_' + thiz.options.elementIdSuffix + '" onchange="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'selectOrganizationThreats_OnChange\', this);" class="xdComboBox xdBehavior_Select" style="border-color: whitesmoke; color: rgb(38, 38, 38); font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif; color: gray;font-size: 20pt;font-weight:bold;cursor: pointer;">';


                            var organizationsWithThreats = [];

                            var json;

                            for (var i = 0; i < data.wafResult.length; i++) {

                                json = {
                                    bwWorkflowAppId: data.wafResult[i].bwWorkflowAppId,
                                    bwWorkflowAppTitle: data.wafResult[i].bwWorkflowAppTitle,
                                    CreatedByFriendlyName: data.wafResult[i].CreatedByFriendlyName,
                                    CreatedByEmail: data.wafResult[i].CreatedByEmail,
                                    count: 1
                                };

                                organizationsWithThreats.push(json);

                            }

                            //var organizationsWithThreats = [];
                            for (var i = 0; i < data.result.length; i++) {
                                var bwWorkflowAppId = data.result[i].bwWorkflowAppId;
                                if (bwWorkflowAppId) {
                                    var existsInTheList = false;
                                    var existsInTheListIndex;
                                    for (var j = 0; j < organizationsWithThreats.length; j++) {
                                        if (bwWorkflowAppId == organizationsWithThreats[j].bwWorkflowAppId) {
                                            existsInTheList = true;
                                            existsInTheListIndex = j;
                                            break;
                                        }
                                    }
                                    if (existsInTheList == true) {

                                        // It exists already, so increment the count by 1.
                                        organizationsWithThreats[existsInTheListIndex].count += 1;

                                    } else {

                                        //// It doesn't exist, so add it.
                                        //var json = {
                                        //    bwWorkflowAppId: bwWorkflowAppId,
                                        //    count: 1
                                        //}
                                        //organizationsWithThreats.push(json);

                                    }

                                } else {

                                    //html += '  <option value="' + data[i].bwWorkflowAppId + '">(5 threats) Todd Hiltz Enterprises (Owner: todd@budgetworkflow.com) [xxxx-xx-xxxx-x-x-xx] data: ' + JSON.stringify(data[i]) + '</option>';

                                }
                            }


                            //
                            // Now we need to do a web service call to get the bwWorkflowApp "Title" and "Owner".
                            //
                            $.ajax({
                                url: webserviceurl + "/bwworkflowapps",
                                type: "POST",
                                contentType: 'application/json',
                                success: function (data2) {
                                    try {

                                        //var totalThreats = 0;
                                        //for (var i = 0; i < organizationsWithThreats.length; i++) {
                                        //    totalThreats += organizationsWithThreats[i].count;
                                        //}
                                        //html += '  <option value="ALL">(' + totalThreats + ' threats) All organizations' + '</option>';
                                        debugger;

                                        //alert('xcx123123412 wafResult: ' + JSON.stringify(data.wafResult));

                                        html += '  <option value="ALL">(' + data.ExceptionLog_Count + ' threats) All organizations' + '</option>';

                                        for (var i = 0; i < organizationsWithThreats.length; i++) {
                                            //var bwWorkflowAppTitle, CreatedByFriendlyName, CreatedByEmail;
                                            //for (var j = 0; j < data2.length; j++) {
                                            //    if (data2[j].bwWorkflowAppId == organizationsWithThreats[i].bwWorkflowAppId) {
                                            //        bwWorkflowAppTitle = data2[j].bwWorkflowAppTitle;
                                            //        CreatedByFriendlyName = data2[j].CreatedByFriendlyName;
                                            //        CreatedByEmail = data2[j].CreatedByEmail;
                                            //    }
                                            //}
                                            html += '  <option value="' + organizationsWithThreats[i].bwWorkflowAppId + '">(' + organizationsWithThreats[i].count + ' threats) ' + organizationsWithThreats[i].bwWorkflowAppTitle + ' (Owner: ' + organizationsWithThreats[i].CreatedByFriendlyName + ' [' + organizationsWithThreats[i].CreatedByEmail + ']) [' + organizationsWithThreats[i].bwWorkflowAppId + ']</option>';
                                        }

                                        html += '</select>';

                                        html += '<span id="spanBwMonitoringTools2_' + thiz.options.elementIdSuffix + '">';
                                        //html += '<table>';
                                        //html += '  <tr>';

                                        //html += '    <td>';
                                        //html += '      <span style="color:white;background-color:skyblue;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdRefreshWebsiteErrorThreatDetails\');" class="bwMonitoringTools_cmdDisplayWebsiteErrorThreatDetails">Refresh';
                                        //html += '      </span>';
                                        //html += '    </td>';

                                        //html += '    <td>';
                                        //html += '      <span style="color:white;background-color:#009933;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDisplayWebsiteErrorThreatDetails\', \'verbose\', \'' + bwWorkflowAppId + '\');" class="bwMonitoringTools_cmdDisplayWebsiteErrorThreatDetails">Verbose: <span>#</span>';
                                        //html += '      </span>';
                                        //html += '    </td>';

                                        //html += '    <td>';
                                        //html += '      <span style="color:white;background-color:#ff0000;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" class="bwMonitoringTools_cmdDisplayWebsiteErrorThreatDetails" >';
                                        //html += '           <span onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDisplayWebsiteErrorThreatDetails\', \'severe\', \'' + bwWorkflowAppId + '\');">Severe: ' + severeErrorThreats.length + '</span>';
                                        //if (severeErrorThreats.length > 0) {
                                        //    html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDeleteAllExceptionLogs\', \'severe\', \'ALL\');">';
                                        //}
                                        //html += '      </span>';
                                        //html += '    </td>';

                                        //html += '    <td>';
                                        //html += '      <span style="color:white;background-color:#ff9900;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" class="bwMonitoringTools_cmdDisplayWebsiteErrorThreatDetails">';
                                        //html += '           <span onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDisplayWebsiteErrorThreatDetails\', \'high\', \'' + bwWorkflowAppId + '\');">High: ' + highLevelErrorThreats.length + '</span>';
                                        //if (highLevelErrorThreats.length > 0) {
                                        //    html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDeleteAllExceptionLogs\', \'high\', \'ALL\');">';
                                        //}
                                        //html += '      </span>';
                                        //html += '    </td>';

                                        //html += '    <td>';
                                        //html += '      <span style="color:#ff9900;background-color:#ffff00;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" class="bwMonitoringTools_cmdDisplayWebsiteErrorThreatDetails">';
                                        //html += '           <span onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDisplayWebsiteErrorThreatDetails\', \'elevated\', \'' + bwWorkflowAppId + '\');">Elevated (client display): ' + elevatedErrorThreats.length + '</span>';
                                        //if (elevatedErrorThreats.length > 0) {
                                        //    html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDeleteAllExceptionLogs\', \'elevated\', \'ALL\');">';
                                        //}
                                        //html += '      </span>';
                                        //html += '    </td>';

                                        //html += '    <td>';
                                        //html += '      <span style="color:white;background-color:#0066ff;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" class="bwMonitoringTools_cmdDisplayWebsiteErrorThreatDetails">';
                                        //html += '           <span onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDisplayWebsiteErrorThreatDetails\', \'guarded\', \'' + bwWorkflowAppId + '\');">Guarded: ' + guardedErrorThreats.length + '</span>';
                                        //if (guardedErrorThreats.length) {
                                        //    html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDeleteAllExceptionLogs\', \'guarded\', \'ALL\');">';
                                        //}
                                        //html += '      </span>';
                                        //html += '    </td>';

                                        //html += '    <td>';
                                        //html += '      <span style="color:white;background-color:#009933;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" class="bwMonitoringTools_cmdDisplayWebsiteErrorThreatDetails">';
                                        //html += '           <span onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDisplayWebsiteErrorThreatDetails\', \'low\', \'' + bwWorkflowAppId + '\');">Low: ' + lowErrorThreats.length + '</span>';
                                        //if (lowErrorThreats.length) {
                                        //    html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDeleteAllExceptionLogs\', \'low\', \'ALL\');">';
                                        //}
                                        //html += '      </span>';
                                        //html += '    </td>';

                                        //html += '    <td>';
                                        //html += '      <span style="color:white;background-color:#009933;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" class="bwMonitoringTools_cmdDisplayWebsiteErrorThreatDetails">';
                                        //html += '           <span onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDisplayWebsiteErrorThreatDetails\', \'email\', \'' + bwWorkflowAppId + '\');">Email: ' + emailErrorThreats.length + '</span>';
                                        //if (emailErrorThreats.length) {
                                        //    html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDeleteAllExceptionLogs\', \'email\', \'ALL\');">';
                                        //}
                                        //html += '      </span>';
                                        //html += '    </td>';

                                        //html += '  </tr>';
                                        //html += '</table>';
                                        html += '</span>';

                                        html += '<textarea id="spanBwMonitoringTools2_txtBwExceptionLogDetails_' + thiz.options.elementIdSuffix + '" rows="40" cols="200" style="padding-top:4px;"></textarea>';

                                        // Render the html.
                                        thiz.element.html(html);


                                        $(thiz.element).find('#divBwStartDatePicker').bwStartDatePicker({
                                            inVisualizations: true,
                                            allowRequestModifications: true
                                        });
                                        $(thiz.element).find('#divBwEndDatePicker').bwEndDatePicker({
                                            inVisualizations: true,
                                            allowRequestModifications: true
                                        });


                                        thiz.selectOrganizationThreats_OnChange();

                                    } catch (e) {
                                        console.log('Exception in renderMonitoringTools():3: ' + e.message + ', ' + e.stack);
                                        displayAlertDialog('Exception in renderMonitoringTools():3: ' + e.message + ', ' + e.stack);
                                    }
                                },
                                error: function (data, errorCode, errorMessage) {
                                    console.log('Error in admin.js.renderMonitoringTools():' + errorCode + ', ' + errorMessage);
                                    displayAlertDialog('Error in admin.js.renderMonitoringTools():' + errorCode + ', ' + errorMessage);
                                }
                            });
                        }

                    } catch (e) {
                        console.log('Exception in renderMonitoringTools():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in renderMonitoringTools():2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    //alert('xcx124312342 error response from web service');
                    console.log('Error in admin.js.renderMonitoringTools():xcx21123-1:' + errorCode + ', ' + errorMessage);
                    displayAlertDialog('Error in admin.js.renderMonitoringTools()::xcx21123-1:' + errorCode + ', ' + errorMessage);
                }
            });

        } catch (e) {
            console.log('Exception in renderMonitoringTools(): ' + e.message + ', ' + e.stack);
            alert('Exception in renderMonitoringTools(): ' + e.message + ', ' + e.stack);
        }
    },
    selectOrganizationThreats_OnChange: function (element) {
        try {
            console.log('In bwMonitoringTools_Main.js.selectOrganizationThreats_OnChange().');
            //alert('In bwMonitoringTools_Main.js.selectOrganizationThreats_OnChange().');
            // "selectOrganizationErrorThreats_' + thiz.options.elementIdSuffix
            //var bwWorkflowAppId = $(element).val();
            var bwWorkflowAppId = $('#selectOrganizationErrorThreats_' + this.options.elementIdSuffix).val();

            if (!bwWorkflowAppId) {
                alert('cant find bwWorkflowAppId from dropdown xcx2131212');
            }

            document.getElementById('spanBwMonitoringTools2_txtBwExceptionLogDetails_' + this.options.elementIdSuffix).value = '';

            console.log('In bwMonitoringTools_Main.js.selectOrganizationThreats_OnChange(). Calling cmdDisplayWebsiteErrorThreats(). xcx2134253.');
            //alert('In bwMonitoringTools_Main.js.selectOrganizationThreats_OnChange(). Calling cmdDisplayWebsiteErrorThreats(). xcx2134253.');
            this.cmdDisplayWebsiteErrorThreats(bwWorkflowAppId);


        } catch (e) {
            console.log('Exception in selectOrganizationThreats_OnChange(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in selectOrganizationThreats_OnChange(): ' + e.message + ', ' + e.stack);
        }
    },







    populateScreenshots: function (bwErrorOrSuggestionId, bwWorkflowAppId, quill) {
        try {
            console.log('In bwMonitoringTools_Main.js.populateScreenshots(). bwErrorOrSuggestionId: ' + bwErrorOrSuggestionId);
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            console.log('>>>In bwMonitoringTools_Main.js.populateScreenshots(). bwWorkflowAppId: ' + bwWorkflowAppId);

            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                bwWorkflowAppId: bwWorkflowAppId, // This value goes with the bwErrorOrSuggestionId. It may not be the same as bwWorkflowAppId_LoggedIn.
                bwErrorOrSuggestionId: bwErrorOrSuggestionId
            }

            var operationUri = this.options.operationUriPrefix + '_files/' + 'getlistoferrororsuggestionscreenshots';
            $.ajax({
                url: operationUri,
                type: 'POST',
                data: data,
                headers: { "Accept": "application/json; odata=verbose" },
                success: function (results) {
                    try {

                        //var activeStateIdentifier = $('.bwAuthentication').bwAuthentication('getActiveStateIdentifier');

                        var html = '';

                        for (var i = 0; i < results.data.length; i++) {

                            //Filename: filename,
                            //Description: description
                            //debugger;
                            var filename = results.data[i].Display_Filename;
                            var description = results.data[i].Description;

                            console.log('In populateScreenshots(). description: ' + description);

                            //var fileUrl = thiz.options.operationUriPrefix + "_files/" + workflowAppId + "/ReportAnErrorOrMakeASuggestion/" + bwErrorOrSuggestionId + "/" + filename;

                            var fileUrl;

                            var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                                return v.toString(16);
                            });

                            var activeStateIdentifier2 = JSON.parse(activeStateIdentifier);

                            if (activeStateIdentifier2.status != 'SUCCESS') {

                                fileUrl = '[No image. Unauthorized. xcx213124-34556-rt665]';

                            } else {

                                fileUrl = thiz.options.operationUriPrefix + "_files/" + bwWorkflowAppId + "/ReportAnErrorOrMakeASuggestion/" + bwErrorOrSuggestionId + "/" + filename + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier2.ActiveStateIdentifier;

                            }




                            //displayAlertDialog('xcx12312432 activeStateIdentifier: ' + activeStateIdentifier + ', fileUrl: ' + fileUrl);





                            //html += '<div style="background-color:white;cursor:pointer;" onclick="alert(\'Display the screenshot. This functionality is incomplete. Coming soon!\');" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200002\', \'Pizza\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'c7c7836b-fb17-4d46-9f62-5bfac6795cea\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="https://budgetworkflow.com/images/zoom.jpg">    </div>';

                            // 8-15-2021 trying to zoom the screenshots. May have to take the attachments out of the Quill editor and just display them seperately in order to get this to work Ok.
                            //html += '<img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;cursor:pointer;" src="https://budgetworkflow.com/images/zoom.jpg" onclick="alert(\'Display the screenshot. This functionality is incomplete. Coming soon!\');">';

                            html += '<img  src="' + fileUrl + '" />';
                            html += '<br />';





                            //
                            // 8-15-2021
                            var html2 = '';
                            html2 += '<div style="background-color:white;cursor:pointer;" onclick="alert(\'Display the screenshot. This functionality is incomplete. Coming soon!\');" >';
                            //html2 += '  <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;cursor:pointer;" src="https://budgetworkflow.com/images/zoom.jpg" onclick="alert(\'Display the screenshot. This functionality is incomplete. Coming soon!\');">';
                            html2 += '  <img style="width:250px;" src="' + fileUrl + '" onmouseenter="$(\'.bwMonitoringTools\').bwMonitoringTools(\'showRowHoverDetails_ForAttachment\', \'BR-200002\', \'Pizza\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'c7c7836b-fb17-4d46-9f62-5bfac6795cea\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwMonitoringTools\').bwMonitoringTools(\'hideRowHoverDetails_ForAttachment\');" />';
                            html2 += '</div>';
                            $('#divErrorOrSuggestion_Attachments').html(html2);






                        }


                        //if (emailTemplate && emailTemplate != '') {
                        quill.setText(''); // Do this first so we don't get double the email!
                        //thiz.options.quill.root.innerHTML = emailTemplate; //.setText(emailTemplate);
                        //thiz.options.quill.setText(emailTemplate);
                        quill.clipboard.dangerouslyPasteHTML(0, html);

                    } catch (e) {

                        if (e.number) {
                            displayAlertDialog('Exception in populateScreenshots():1: ' + e.message + ', ' + e.stack);
                        } else {
                            displayAlertDialog('Exception in populateScreenshots():0: ' + e.message + ', ' + e.stack);
                            // This most likely means that the folders are there on the file services server, but there is nothing in them.
                            //
                            // Fileservices has an error, so show nothing! We will put a red exclamation pin in the attachments section eventually! - 10-1-17 todd
                            //displayAlertDialog('Fileservices has an error: ' + ' "' + e.message + '"');
                        }
                        //$(thiz.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">Exception in populateScreenshots:1: ' + e.message + ', ' + e.stack + '</span>';
                    }
                    //}
                },
                error: function (data, errorCode, errorMessage) {

                    if (errorCode === 'timeout' && errorMessage === 'timeout') {
                        displayAlertDialog('File services is not responding. communication timeout is set at ' + ajaxTimeout / 1000 + ' seconds: ' + errorCode + ', ' + errorMessage);
                        $(thiz.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">File services is not responding. communication timeout is set at ' + ajaxTimeout / 1000 + ' seconds: ' + errorCode + ', ' + errorMessage + '</span>';
                    } else {

                        console.log('Error in populateAttachments():2: ' + errorCode + ', ' + errorMessage);
                        $(thiz.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">Error in populateScreenshots():2: ' + errorCode + ', ' + errorMessage + '</span>';

                        displayAlertDialog('Error in populateScreenshots():2: ' + errorCode + ', ' + errorMessage);
                        // The latest error 1-17-2018 is errorCode:'error' and errorMessage:'Not Found'.
                        // What does this mean? You can replicate this error!
                        // at Url: https://budgetworkflow.com/ios8.html, view an offline (Un-submitted) request, and try to add an attachment.


                    }
                }
            });
        } catch (e) {
            console.log('Exception in populateScreenshots: ' + e.message + ', ' + e.stack);
            alert('Exception in populateScreenshots: ' + e.message + ', ' + e.stack);

            //renderAndPopulateAttachments
            //$(thiz.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">Exception in populateScreenshots: ' + e.message + ', ' + e.stack + '</span>';

        }
    },
    adminViewErrorOrSuggestion: function (bwParticipantId, bwParticipantFriendlyName, bwParticipantEmail, bwErrorOrSuggestionId, bwWorkflowAppId) {
        try {
            console.log('In adminViewErrorOrSuggestion(). bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ', bwErrorOrSuggestionId: ' + bwErrorOrSuggestionId);
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            console.log('In bwMonitoringTools_Main.js.adminViewErrorOrSuggestion(). bwWorkflowAppId: ' + bwWorkflowAppId);

            $.ajax({
                url: webserviceurl + "/bwwebapperrororsuggestion2/" + bwWorkflowAppId + '/' + bwErrorOrSuggestionId,
                type: "DELETE",
                contentType: 'application/json',
                success: function (data) {
                    try {

                        $(document).find('#displayedemaildetails')[0].setAttribute('bwErrorOrSuggestionId', bwErrorOrSuggestionId);

                        // Display the email editor.
                        thiz.options.quillSubjectEditor = new Quill('#quillConfigureNewUserErrorOrSuggestionDialog_Subject', {
                            modules: {
                                toolbar: '#bwQuilltoolbarForErrorOrSuggestionSubject'
                            },
                            //placeholder: 'The enhanced notification email editor functionality is coming soon...', 
                            theme: 'snow'
                        });

                        // Hook up this button event so that the user can insert data items into the email.
                        var customButton1 = document.querySelector('#btnQuill_InsertADataItemForErrorOrSuggestion');
                        customButton1.addEventListener('click', function () {
                            //console.log('btnQuill_InsertADataItem: This functionality is incomplete. Coming soon!');
                            thiz.displayEmailDataItemPickerDialog('subject');
                        });

                        thiz.options.quill = new Quill('#quillConfigureErrorOrSuggestionDialog_Body', {
                            modules: {
                                toolbar: '#bwQuilltoolbarErrorOrSuggestion'
                            },
                            //placeholder: 'The enhanced notification email editor functionality is coming soon...', 
                            theme: 'snow'
                        });

                        thiz.options.quillSubjectEditor.on('text-change', function (delta, oldDelta, source) {
                            console.log('In adminViewErrorOrSuggestion.quillSubjectEditor.text-change().')
                            //thiz.options.userHasMadeChangesToTheEmailTemplate = true;
                            //thiz.checkIfWeHaveToDisplayThePublishChangesButton();
                        });

                        thiz.options.quill.on('text-change', function (delta, oldDelta, source) {
                            console.log('In adminViewErrorOrSuggestion.quill.text-change().')
                            //thiz.options.userHasMadeChangesToTheEmailTemplate = true;
                            //thiz.checkIfWeHaveToDisplayThePublishChangesButton();
                        });

                        // Hook up this button event so that the user can insert data items into the email.
                        var customButton = document.querySelector('#btnQuill_InsertADataItemForErrorOrSuggestion');
                        customButton.addEventListener('click', function () {
                            console.log('In adminViewErrorOrSuggestion.quill.customButton.click().')
                            //console.log('btnQuill_InsertADataItem: This functionality is incomplete. Coming soon!');
                            //thiz.displayEmailDataItemPickerDialog('body');
                        });


                        var emailTemplateForSubject = data[0].Description; //thiz.options.CurrentEmailTemplate.EmailTemplate.Subject;


                        var bwWorkflowAppId = data[0].bwWorkflowAppId; // This is the bwWorkflowAppId that goes with bwErrorOrSuggestionId.


                        // Formulate the html to show the screenshots.
                        //debugger;

                        var emailTemplate = thiz.populateScreenshots(bwErrorOrSuggestionId, bwWorkflowAppId, thiz.options.quill); // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Get this working! 7-3-2020
                        //var html = '';
                        //html += 'WELCOME TO THE SCREENSHOTS!!!!!!!!!<br />';
                        //html += '<img src="' + thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/' + bwErrorOrSuggestionId + '/' + 'filename.png' + '" />';
                        //var emailTemplate = html; //data[0].Body; //thiz.options.CurrentEmailTemplate.EmailTemplate.Body;




                        debugger;
                        if (emailTemplateForSubject && emailTemplateForSubject != '') {
                            //thiz.options.quillSubjectEditor.setText(emailTemplateForSubject);
                            $('#quillConfigureNewUserErrorOrSuggestionDialog_Subject').val(emailTemplateForSubject);
                        } else {
                            //thiz.options.quillSubjectEditor.setText('xcx44');
                            $('#quillConfigureNewUserErrorOrSuggestionDialog_Subject').val('xcx44');
                        }

                        //if (emailTemplate && emailTemplate != '') {
                        //    thiz.options.quill.setText(''); // Do this first so we don't get double the email!
                        //    //thiz.options.quill.root.innerHTML = emailTemplate; //.setText(emailTemplate);
                        //    //thiz.options.quill.setText(emailTemplate);
                        //    thiz.options.quill.clipboard.dangerouslyPasteHTML(0, emailTemplate);
                        //} else {
                        //    thiz.options.quill.setText('');
                        //}
                        //debugger;
                        var timestamp = getFriendlyDateAndTime(data[0].Created);
                        var html = '';
                        ////debugger;
                        //var toParticipantEmail = data[0].ToParticipantEmail.replace('<', '&lt;').replace('>', '&gt;');
                        html += '<span style="color:black;">To:</span> ' + data[0].CreatedByFriendlyName + ' (' + data[0].CreatedByEmail + ')';
                        html += '<br />';
                        html += '<span style="font-weight:normal;font-size:10pt;color:black;">' + timestamp + '</span>';
                        //$(thiz.element).find('#spanSelectedErrorsAndSuggestionsSubject')[0].innerHTML = html;
                        $(document).find('#spanSelectedErrorsAndSuggestionsSubject')[0].innerHTML = html;

                        var html = '';

                        if (data && data[0] && data[0].Logs) {

                            // Display the logs. Not the prettiest, but it is good for now. 4-12-2023.
                            var logs = JSON.parse(data[0].Logs);

                            for (var i = 0; i < logs.length; i++) {
                                html += logs[i].timestamp + ': ' + logs[i].message;
                                html += '<br />';
                            }

                        } else {

                            html += 'THERE ARE NO LOGS AVAILABLE WITH THIS ERROR REPORT.';

                        }
                            



                        //var logs2 = '';
                        //if (logs) {
                        //    logs2 = JSON.stringify(logs, null, 2); 
                        //}

                        //var htmlstring = logs2.replaceAll('\\n', '<br />');

                        $(document).find('#bwErrorOrSuggestion_ConsoleLog')[0].innerHTML = html;


                    } catch (e) {
                        console.log('Exception in adminViewErrorOrSuggestion(): ' + e.message + ', ' + e.stack);
                        alert('Exception in adminViewErrorOrSuggestion(): ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in xx.js.adminViewErrorOrSuggestion():' + errorCode + ', ' + errorMessage);
                }
            });
        } catch (e) {
            console.log('Exception in adminViewErrorOrSuggestion(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ': ' + e.message + ', ' + e.stack);
            alert('Exception in adminViewErrorOrSuggestion(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ': ' + e.message + ', ' + e.stack);
        }
    },





    cmdDisplayWebsiteErrorThreats: function (bwWorkflowAppId) {
        try {
            console.log('In bwMonitoringTools_Main.js.cmdDisplayWebsiteErrorThreats(' + bwWorkflowAppId + ').');
            //alert('In bwMonitoringTools_Main.js.cmdDisplayWebsiteErrorThreats(' + bwWorkflowAppId + ').');
            var thiz = this;

            if (!bwWorkflowAppId) {
                //alert('bwWorkflowAppId is empty xcx213445-1');
            }

            //alert('In bwMonitoringTools_Main.js.cmdDisplayWebsiteErrorThreats(' + bwWorkflowAppId + ').');

            //$('#spanWebsiteErrorThreats').empty();

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var activeStateIdentifier = $('.bwAuthentication').bwAuthentication('getActiveStateIdentifier');

            var clientException;
            var element = document.getElementById('bwMonitoringTools_Main_ClientOrServerMessageSelector');
            if (element) {
                clientException = element.checked;

                console.log('In bwMonitoringTools_Main.js.cmdDisplayWebsiteErrorThreats(). Calling websiteerrorthreatsummary(). clientException: ' + clientException);
                //alert('In bwMonitoringTools_Main.js.cmdDisplayWebsiteErrorThreats(). Calling websiteerrorthreatsummary(). clientException: ' + clientException);
            }

            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                bwWorkflowAppId: bwWorkflowAppId,
                ClientException: clientException
            };


            //var data = {
            //    bwWorkflowAppId: bwWorkflowAppId
            //};
            $.ajax({
                url: webserviceurl + "/websiteerrorthreatsummary",
                type: "POST",
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (data) {
                    try {

                        //alert('xcx23231 In cmdDisplayWebsiteErrorThreats(). Returned result from websiteerrorthreatsummary(). data: ' + JSON.stringify(data));

                        if (!data.result) {

                            displayAlertDialog('Error in cmdDisplayWebsiteErrorThreats(). ' + data.status);

                        } else {

                            console.log('xcx23231 Returned result from websiteerrorthreatsummary(). length: ' + data.result.length);

                            // Severe #ff0000, High #ff9900, Elevated #ffff00, Guarded #0066ff, Low #009933
                            var severeErrorThreats = [];
                            //severeErrorThreats = new Array();
                            //
                            var highLevelErrorThreats = [];
                            //highLevelErrorThreats = new Array();
                            //
                            var elevatedErrorThreats = [];
                            //elevatedErrorThreats = new Array();
                            //
                            var guardedErrorThreats = [];
                            //guardedErrorThreats = new Array();
                            //
                            var lowErrorThreats = [];
                            //lowErrorThreats = new Array();

                            var emailErrorThreats = [];

                            var allErrorThreats = [];

                            // Fill the arrays.
                            for (var i = 0; i < data.result.length; i++) {
                                var exceptionLogEntry = data.result[i].Message; // Todd currently we are only getting the message. The detail display will want more of the information from the BwExceptionLog table.

                                if (data.result[i].ErrorThreatLevel == 'severe') {
                                    severeErrorThreats.push(exceptionLogEntry);
                                    // Severe threats include:
                                    // - failure to send an email.
                                    // - failure of a web method to reach it's intended conslusion.
                                    // ...
                                } else if (data.result[i].ErrorThreatLevel == 'high') {
                                    highLevelErrorThreats.push(exceptionLogEntry);
                                } else if (data.result[i].ErrorThreatLevel == 'elevated') {
                                    elevatedErrorThreats.push(exceptionLogEntry);
                                } else if (data.result[i].ErrorThreatLevel == 'guarded') {
                                    guardedErrorThreats.push(exceptionLogEntry);
                                } else if (data.result[i].ErrorThreatLevel == 'low') {
                                    lowErrorThreats.push(exceptionLogEntry);
                                } else if (data.result[i].ErrorThreatLevel == 'email') {
                                    emailErrorThreats.push(exceptionLogEntry);
                                }

                                allErrorThreats.push(exceptionLogEntry);
                            }

                            //
                            // Now we need to do a web service call to get the bwWorkflowApp "Title" and "Owner".
                            //
                            $.ajax({
                                url: webserviceurl + "/bwworkflowapps",
                                type: "POST",
                                contentType: 'application/json',
                                success: function (data) {
                                    try {


                                        //if (!bwWorkflowAppId) {
                                        //    alert('bwWorkflowAppId is empty xcx213445-2');
                                        //}


                                        var html = '';

                                        html += '<table>';
                                        html += '  <tr>';

                                        html += '    <td>';
                                        html += '      <span style="color:white;background-color:skyblue;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdRefreshWebsiteErrorThreatDetails\');" class="bwMonitoringTools_cmdDisplayWebsiteErrorThreatDetails">Refresh';
                                        html += '      </span>';
                                        html += '    </td>';


                                        // Verbose is all of the log entries.....every one!
                                        html += '    <td>';
                                        html += '      <span style="color:white;background-color:#009933;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" class="bwMonitoringTools_cmdDisplayWebsiteErrorThreatDetails" >';
                                        html += '           <span onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDisplayWebsiteErrorThreatDetails\', \'verbose\', \'' + bwWorkflowAppId + '\');">Verbose: ' + allErrorThreats.length + '</span>';
                                        if (allErrorThreats.length > 0) {
                                            html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDeleteAllExceptionLogs\', \'verbose\', \'' + bwWorkflowAppId + '\');">';
                                        }
                                        html += '      </span>';
                                        html += '    </td>';







                                        html += '    <td>';
                                        html += '      <span style="color:white;background-color:#ff0000;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" class="bwMonitoringTools_cmdDisplayWebsiteErrorThreatDetails" >';
                                        html += '           <span onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDisplayWebsiteErrorThreatDetails\', \'severe\', \'' + bwWorkflowAppId + '\');">Severe: ' + severeErrorThreats.length + '</span>';
                                        if (severeErrorThreats.length > 0) {
                                            html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDeleteAllExceptionLogs\', \'severe\', \'' + bwWorkflowAppId + '\');">';
                                        }
                                        html += '      </span>';
                                        html += '    </td>';

                                        html += '    <td>';
                                        html += '      <span style="color:white;background-color:#ff9900;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" class="bwMonitoringTools_cmdDisplayWebsiteErrorThreatDetails">';
                                        html += '           <span onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDisplayWebsiteErrorThreatDetails\', \'high\', \'' + bwWorkflowAppId + '\');">High: ' + highLevelErrorThreats.length + '</span>';
                                        if (highLevelErrorThreats.length > 0) {
                                            html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDeleteAllExceptionLogs\', \'high\', \'' + bwWorkflowAppId + '\');">';
                                        }
                                        html += '      </span>';
                                        html += '    </td>';

                                        html += '    <td>';
                                        html += '      <span style="color:#ff9900;background-color:#ffff00;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" class="bwMonitoringTools_cmdDisplayWebsiteErrorThreatDetails">';
                                        html += '           <span onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDisplayWebsiteErrorThreatDetails\', \'elevated\', \'' + bwWorkflowAppId + '\');">Elevated (client display): ' + elevatedErrorThreats.length + '</span>';
                                        if (elevatedErrorThreats.length > 0) {
                                            html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDeleteAllExceptionLogs\', \'elevated\', \'' + bwWorkflowAppId + '\');">';
                                        }
                                        html += '      </span>';
                                        html += '    </td>';

                                        html += '    <td>';
                                        html += '      <span style="color:white;background-color:#0066ff;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" class="bwMonitoringTools_cmdDisplayWebsiteErrorThreatDetails">';
                                        html += '           <span onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDisplayWebsiteErrorThreatDetails\', \'guarded\', \'' + bwWorkflowAppId + '\');">Guarded: ' + guardedErrorThreats.length + '</span>';
                                        if (guardedErrorThreats.length) {
                                            html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDeleteAllExceptionLogs\', \'guarded\', \'' + bwWorkflowAppId + '\');">';
                                        }
                                        html += '      </span>';
                                        html += '    </td>';

                                        html += '    <td>';
                                        html += '      <span style="color:white;background-color:#009933;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" class="bwMonitoringTools_cmdDisplayWebsiteErrorThreatDetails">';
                                        html += '           <span onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDisplayWebsiteErrorThreatDetails\', \'low\', \'' + bwWorkflowAppId + '\');">Low: ' + lowErrorThreats.length + '</span>';
                                        if (lowErrorThreats.length) {
                                            html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDeleteAllExceptionLogs\', \'low\', \'' + bwWorkflowAppId + '\');">';
                                        }
                                        html += '      </span>';
                                        html += '    </td>';

                                        html += '    <td>';
                                        html += '      <span style="color:white;background-color:#009933;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" class="bwMonitoringTools_cmdDisplayWebsiteErrorThreatDetails">';
                                        html += '           <span onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDisplayWebsiteErrorThreatDetails\', \'email\', \'' + bwWorkflowAppId + '\');">Email: ' + emailErrorThreats.length + '</span>';
                                        if (emailErrorThreats.length) {
                                            html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDeleteAllExceptionLogs\', \'email\', \'' + bwWorkflowAppId + '\');">';
                                        }
                                        html += '      </span>';
                                        html += '    </td>';

                                        html += '  </tr>';
                                        html += '</table>';

                                        $('#spanBwMonitoringTools2_' + thiz.options.elementIdSuffix).html(html);

                                    } catch (e) {
                                        console.log('Exception in cmdDisplayWebsiteErrorThreats():3: ' + e.message + ', ' + e.stack);
                                        displayAlertDialog('Exception in cmdDisplayWebsiteErrorThreats():3: ' + e.message + ', ' + e.stack);
                                    }
                                },
                                error: function (data, errorCode, errorMessage) {
                                    console.log('Error in admin.js.cmdDisplayWebsiteErrorThreats():' + errorCode + ', ' + errorMessage);
                                    displayAlertDialog('Error in admin.js.cmdDisplayWebsiteErrorThreats():' + errorCode + ', ' + errorMessage);
                                }
                            });
                        }

                    } catch (e) {
                        console.log('Exception in cmdDisplayWebsiteErrorThreats():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in cmdDisplayWebsiteErrorThreats():2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    //alert('xcx124312342 error response from web service');
                    console.log('Error in admin.js.cmdDisplayWebsiteErrorThreats():xcx21123-1:' + errorCode + ', ' + errorMessage);
                    displayAlertDialog('Error in admin.js.cmdDisplayWebsiteErrorThreats()::xcx21123-1:' + errorCode + ', ' + errorMessage);
                }
            });
        } catch (e) {
            console.log('Exception in cmdDisplayWebsiteErrorThreats(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in cmdDisplayWebsiteErrorThreats(): ' + e.message + ', ' + e.stack);
        }
    },
    cmdDeleteAllExceptionLogs: function (threatLevel, bwWorkflowAppId) {
        try {
            console.log('In cmdDeleteAllExceptionLogs().');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            document.getElementById('spanBwMonitoringTools2_txtBwExceptionLogDetails_' + this.options.elementIdSuffix).value = '';

            if (!bwWorkflowAppId || (bwWorkflowAppId == 'undefined')) {
                bwWorkflowAppId = 'ALL';
            }

            var data = {
                bwWorkflowAppId_LoggedIn: workflowAppId,
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId: bwWorkflowAppId,
                ErrorThreatLevel: threatLevel
            };
            $.ajax({
                url: webserviceurl + "/bwexceptionlogs/delete",
                type: "POST",
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (data) {
                    try {

                        thiz.cmdDisplayWebsiteErrorThreats();
                        //$('#txtBwTimerLogs').empty();
                        //var html = '';
                        ////for (var i = 0; i < data.length; i++) {
                        ////    //html += 'Owner:' + data[i].bwTenantOwnerFriendlyName + ', FB User Id:' + data[i].bwTenantOwnerFacebookUserId + ', Tenant Id:' + data[i].bwTenantId + '<br/>';
                        ////    html += 'Log Entry Justification details:' + data[i].bwTimerLogEntryDetails + '<br/>';
                        ////    //html += '';
                        ////}
                        //html += 'DONE';
                        //$('#txtBwTimerLogs').append(html);

                    } catch (e) {
                        console.log('Exception in cmdDeleteAllExceptionLogs():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in cmdDeleteAllExceptionLogs():2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in admin.js.cmdDeleteAllExceptionLogs():' + errorCode + ', ' + errorMessage);
                    displayAlertDialog('Error in admin.js.cmdDeleteAllExceptionLogs():' + errorCode + ', ' + errorMessage);
                }
            });

        } catch (e) {
            console.log('Exception in cmdDeleteAllExceptionLogs(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in cmdDeleteAllExceptionLogs(): ' + e.message + ', ' + e.stack);
        }
    },

    cmdDisplayWebsiteErrorThreatDetails: function (threatLevel, bwWorkflowAppId) {
        try {
            console.log('In bwMonitoringTools_Main.js.cmdDisplayWebsiteErrorThreatDetails(' + threatLevel + ').');
            //alert('In bwMonitoringTools_Main.js.cmdDisplayWebsiteErrorThreatDetails(' + threatLevel + ').');
            var thiz = this;

            $('#spanBwMonitoringTools2_txtBwExceptionLogDetails_' + thiz.options.elementIdSuffix).val('');

            if (!bwWorkflowAppId || (bwWorkflowAppId == 'undefined')) {
                bwWorkflowAppId = 'ALL';
            }

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var activeStateIdentifier = $('.bwAuthentication').bwAuthentication('getActiveStateIdentifier');

            var clientException;
            var element = document.getElementById('bwMonitoringTools_Main_ClientOrServerMessageSelector');
            if (element) {
                clientException = element.checked;

                //alert('In bwMonitoringTools_Main.js.cmdDisplayWebsiteErrorThreatDetails(). Calling websiteerrorthreatsummary(). clientException: ' + clientException);
                console.log('In bwMonitoringTools_Main.js.cmdDisplayWebsiteErrorThreatDetails(). Calling websiteerrorthreatsummary(). clientException: ' + clientException);
            }

            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                bwWorkflowAppId: bwWorkflowAppId,
                ClientException: clientException
            };

            //var data = {
            //    bwWorkflowAppId: bwWorkflowAppId
            //}
            $.ajax({
                url: webserviceurl + "/websiteerrorthreatsummary",
                type: "POST",
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (results) {
                    try {

                        if (results.status != 'SUCCESS') {

                            displayAlertDialog('Error in bwMonitoringTools_Main.js.cmdDisplayWebsiteErrorThreatDetails(). ' + results.status + ': ' + results.message);

                        } else {

                            //displayAlertDialog('In bwMonitoringTools_Main.js.cmdDisplayWebsiteErrorThreatDetails(). results.result: ' + JSON.stringify(results.result));


                            var html = '';
                            for (var i = 0; i < results.result.length; i++) {
                                if (threatLevel == 'verbose') {

                                    var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate_WithSeconds(results.result[i].Timestamp);
                                    html += timestamp4 + '  ';

                                    if (results.result[i].bwExceptionLogIp || results.result[i].bwExceptionLogParticipantId || results.result[i].bwWorkflowAppId) {
                                        html += 'Organization: [' + results.result[i].bwWorkflowAppId + '] Participant: [' + results.result[i].bwExceptionLogParticipantId + '] (' + results.result[i].bwExceptionLogParticipantEmail + ') UserAgent: ' + results.result[i].bwExceptionLogUserAgent + ' IP: [' + results.result[i].bwExceptionLogIp + ']';
                                    }
                                    html += '\n';

                                    html += '' + results.result[i].Message + ',  ';
                                    html += 'Source xcx3394: ' + results.result[i].Source + ' ';

                                    html += '\n\n';

                                } else if (results.result[i].ErrorThreatLevel == threatLevel) {

                                    // 3-1-2022
                                    var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate_WithSeconds(results.result[i].Timestamp);
                                    html += timestamp4 + '  ';

                                    if (results.result[i].bwExceptionLogIp || results.result[i].bwExceptionLogParticipantId || results.result[i].bwWorkflowAppId) {
                                        html += 'Organization: [' + results.result[i].bwWorkflowAppId + '] Participant: [' + results.result[i].bwExceptionLogParticipantId + '] (' + results.result[i].bwExceptionLogParticipantEmail + ') UserAgent: ' + results.result[i].bwExceptionLogUserAgent + ' IP: [' + results.result[i].bwExceptionLogIp + ']';
                                    }
                                    html += '\n';

                                    html += '' + results.result[i].Message + ',  ';
                                    html += 'Source xcx3394-2: ' + results.result[i].Source + ' ';

                                    html += '\n\n';

                                    //html += 'Timestamp: ' + data[i].Timestamp + ', ';
                                    //html += 'Message: ' + data[i].Message + ',  ';
                                    //html += 'Source xcx1: ' + data[i].Source + ' ';
                                    //html += '\n';
                                    //html += 'Organization: [' + data[i].bwWorkflowAppId + '] Participant: [' + data[i].bwExceptionLogParticipantId + '] IP: [' + data[i].bwExceptionLogIp + ']';
                                    //html += '\n\n';
                                }
                            }
                            debugger;
                            html += 'DONE';
                            //$(thiz.element).find('#txtBwExceptionLogDetails').val(html); //append(html);
                            $('#spanBwMonitoringTools2_txtBwExceptionLogDetails_' + thiz.options.elementIdSuffix).val(html); //append(html);
                        }

                    } catch (e) {
                        console.log('Exception in cmdDisplayWebsiteErrorThreatDetails(' + threatLevel + '):2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in cmdDisplayWebsiteErrorThreatDetails(' + threatLevel + '):2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    //window.waitDialog.close();
                    //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
                    console.log('Error in bwMonitoringTools.cmdDisplayWebsiteErrorThreatDetails():' + errorCode + ', ' + errorMessage);
                    displayAlertDialog('Error in bwMonitoringTools.cmdDisplayWebsiteErrorThreatDetails():' + errorCode + ', ' + errorMessage);
                }
            });
        } catch (e) {
            console.log('Exception in bwMonitoringTools.cmdDisplayWebsiteErrorThreatDetails(' + threatLevel + '): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwMonitoringTools.cmdDisplayWebsiteErrorThreatDetails(' + threatLevel + '): ' + e.message + ', ' + e.stack);
        }
    },
    cmdRefreshWebsiteErrorThreatDetails: function (threatLevel) {
        try {
            console.log('In cmdRefreshWebsiteErrorThreatDetails(' + threatLevel + ').');

            this.loadAndRenderMonitoringTools();

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
            displayAlertDialog('Exception in bwMonitoringTools.cmdRefreshWebsiteErrorThreatDetails(' + threatLevel + '): ' + e.message + ', ' + e.stack);
        }
    },
    cmdListAllWebsiteTrafficLogs: function () {
        try {
            console.log('In cmdListAllWebsiteTrafficLogs(). bwWorkflowAppId: ' + this.options.bwWorkflowAppId);
            $('#txtBwWebsiteTrafficLogs').empty();
            $.ajax({
                url: webserviceurl + "/bwwebsitetrafficlogsforwebapp/" + this.options.bwWorkflowAppId,
                type: "DELETE",
                contentType: 'application/json',
                //data: JSON.stringify(data),
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
        } catch (e) {
            console.log('Exception in cmdListAllWebsiteTrafficLogs(): ' + e.message + ', ' + e.stack);
        }
    },

    //renderMonitoringTools: function () {
    //    try {
    //        console.log('In renderMonitoringTools().');
    //        alert('In renderMonitoringTools().');
    //        var thiz = this;

    //        var data = {
    //            bwWorkflowAppId: 'ALL'
    //        };
    //        $.ajax({
    //            url: webserviceurl + "/websiteerrorthreatsummary_counts",
    //            type: "POST",
    //            contentType: 'application/json',
    //            data: JSON.stringify(data),
    //            success: function (threatCounts) {
    //                try {

    //                    //alert('xcx23231 Returned result from websiteerrorthreatsummary(). data: ' + JSON.stringify(data));
    //                    if (!threatCounts.result) {

    //                        displayAlertDialog('Error in renderMonitoringTools(). ' + threatCounts.status);

    //                    } else {

    //                        console.log('In renderMonitoringTools(). Returned result from websiteerrorthreatsummary(). threatCounts: ' + JSON.stringify(threatCounts));

    //                        //// Severe #ff0000, High #ff9900, Elevated #ffff00, Guarded #0066ff, Low #009933
    //                        //var severeErrorThreats = [];
    //                        ////severeErrorThreats = new Array();
    //                        ////
    //                        //var highLevelErrorThreats = [];
    //                        ////highLevelErrorThreats = new Array();
    //                        ////
    //                        //var elevatedErrorThreats = [];
    //                        ////elevatedErrorThreats = new Array();
    //                        ////
    //                        //var guardedErrorThreats = [];
    //                        ////guardedErrorThreats = new Array();
    //                        ////
    //                        //var lowErrorThreats = [];
    //                        ////lowErrorThreats = new Array();

    //                        //var emailErrorThreats = [];

    //                        //// Fill the arrays.
    //                        //for (var i = 0; i < data.result.length; i++) {
    //                        //    var exceptionLogEntry = data.result[i].Message; // Todd currently we are only getting the message. The detail display will want more of the information from the BwExceptionLog table.




    //                        //    if (data.result[i].ErrorThreatLevel == 'severe') {
    //                        //        severeErrorThreats.push(exceptionLogEntry);
    //                        //        // Severe threats include:
    //                        //        // - failure to send an email.
    //                        //        // - failure of a web method to reach it's intended conslusion.
    //                        //        // ...
    //                        //    } else if (data.result[i].ErrorThreatLevel == 'high') {
    //                        //        highLevelErrorThreats.push(exceptionLogEntry);
    //                        //    } else if (data.result[i].ErrorThreatLevel == 'elevated') {
    //                        //        elevatedErrorThreats.push(exceptionLogEntry);
    //                        //    } else if (data.result[i].ErrorThreatLevel == 'guarded') {
    //                        //        guardedErrorThreats.push(exceptionLogEntry);
    //                        //    } else if (data.result[i].ErrorThreatLevel == 'low') {
    //                        //        lowErrorThreats.push(exceptionLogEntry);
    //                        //    }
    //                        //}

    //                        var html = '';

    //                        html += '<style>';
    //                        html += '   .bwMonitoringTools_cmdDisplayWebsiteErrorThreatDetails:hover, focus, active, focus-visible {'; // This style makes the border orange for an active element.
    //                        html += '       color:black !important;';
    //                        html += '       background-color:aliceblue !important;';
    //                        html += '       border: 1px solid skyblue;';
    //                        html += '   }';
    //                        html += '</style>';

    //                        // This is the drop-down span tag!
    //                        html += '<span style="font-size:xx-large;color:darkgray;white-space:nowrap;">';
    //                        html += '   Errors and Threats';
    //                        html += '</span>';
    //                        html += '<br />';
    //                        html += '<select onchange="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'selectOrganizationThreats_OnChange\', this);" class="xdComboBox xdBehavior_Select" style="border-color: whitesmoke; color: rgb(38, 38, 38); font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif; color: gray;font-size: 20pt;font-weight:bold;cursor: pointer;">';

    //                        //var organizationsWithThreats = [];
    //                        //for (var i = 0; i < data.result.length; i++) {
    //                        //    var bwWorkflowAppId = data.result[i].bwWorkflowAppId;
    //                        //    if (bwWorkflowAppId) {
    //                        //        var existsInTheList = false;
    //                        //        var existsInTheListIndex;
    //                        //        for (var j = 0; j < organizationsWithThreats.length; j++) {
    //                        //            if (bwWorkflowAppId == organizationsWithThreats[j].bwWorkflowAppId) {
    //                        //                existsInTheList = true;
    //                        //                existsInTheListIndex = j;
    //                        //                break;
    //                        //            }
    //                        //        }
    //                        //        if (existsInTheList == true) {

    //                        //            // It exists already, so increment the count by 1.
    //                        //            organizationsWithThreats[existsInTheListIndex].count += 1;

    //                        //        } else {

    //                        //            // It doesn't exist, so add it.
    //                        //            var json = {
    //                        //                bwWorkflowAppId: bwWorkflowAppId,
    //                        //                count: 1
    //                        //            }
    //                        //            organizationsWithThreats.push(json);

    //                        //        }

    //                        //    } else {

    //                        //        //html += '  <option value="' + data[i].bwWorkflowAppId + '">(5 threats) Todd Hiltz Enterprises (Owner: todd@budgetworkflow.com) [xxxx-xx-xxxx-x-x-xx] data: ' + JSON.stringify(data[i]) + '</option>';

    //                        //    }
    //                        //}


    //                        //
    //                        // Now we need to do a web service call to get the bwWorkflowApp "Title" and "Owner".
    //                        //
    //                        $.ajax({
    //                            url: webserviceurl + "/bwworkflowapps",
    //                            type: "POST",
    //                            contentType: 'application/json',
    //                            success: function (data) {
    //                                try {

    //                                    //var totalThreats = 0;
    //                                    //for (var i = 0; i < organizationsWithThreats.length; i++) {
    //                                    //    totalThreats += organizationsWithThreats[i].count;
    //                                    //}
    //                                    html += '  <option value="ALL">(' + threatCounts.all + ' threats) All organizations' + '</option>';

    //                                    //for (var i = 0; i < organizationsWithThreats.length; i++) {
    //                                    //    var bwWorkflowAppTitle, CreatedByFriendlyName, CreatedByEmail;
    //                                    //    for (var j = 0; j < data.length; j++) {
    //                                    //        if (data[j].bwWorkflowAppId == organizationsWithThreats[i].bwWorkflowAppId) {
    //                                    //            bwWorkflowAppTitle = data[j].bwWorkflowAppTitle;
    //                                    //            CreatedByFriendlyName = data[j].CreatedByFriendlyName;
    //                                    //            CreatedByEmail = data[j].CreatedByEmail;
    //                                    //        }
    //                                    //    }
    //                                    //    var workflowApp_TotalThreates = threatCounts.severe + threatCounts.high + threatCounts.elevated + threatCounts.guarded + threatCounts.low + threatCounts.email;
    //                                    //    html += '  <option value="' + organizationsWithThreats[i].bwWorkflowAppId + '">(' + workflowApp_TotalThreates + ' threats) ' + bwWorkflowAppTitle + ' (Owner: ' + CreatedByFriendlyName + ' [' + CreatedByEmail + ']) [' + organizationsWithThreats[i].bwWorkflowAppId + ']</option>';
    //                                    //}
    //                                    var bwWorkflowAppId = 'ALL';
    //                                    for (var i = 0; i < data.length; i++) {
    //                                        var bwWorkflowAppTitle, CreatedByFriendlyName, CreatedByEmail;
    //                                        //for (var j = 0; j < data.length; j++) {
    //                                        //    if (data[j].bwWorkflowAppId == organizationsWithThreats[i].bwWorkflowAppId) {
    //                                                bwWorkflowAppTitle = data[i].bwWorkflowAppTitle;
    //                                                CreatedByFriendlyName = data[i].CreatedByFriendlyName;
    //                                                CreatedByEmail = data[i].CreatedByEmail;
    //                                        //    }
    //                                        //}
    //                                        var workflowApp_TotalThreates = threatCounts.severe + threatCounts.high + threatCounts.elevated + threatCounts.guarded + threatCounts.low + threatCounts.email;
    //                                        html += '  <option value="' + data[i].bwWorkflowAppId + '">(' + workflowApp_TotalThreates + ' threats) ' + bwWorkflowAppTitle + ' (Owner: ' + CreatedByFriendlyName + ' [' + CreatedByEmail + ']) [' + data[i].bwWorkflowAppId + ']</option>';
    //                                    }


    //                                    html += '</select>';

    //                                    html += '<span id="spanBwMonitoringTools2_' + thiz.options.elementIdSuffix + '">';
    //                                    html += '<table>';
    //                                    html += '  <tr>';

    //                                    html += '    <td>';
    //                                    html += '      <span style="color:white;background-color:skyblue;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdRefreshWebsiteErrorThreatDetails\');" class="bwMonitoringTools_cmdDisplayWebsiteErrorThreatDetails">Refresh';
    //                                    html += '      </span>';
    //                                    html += '    </td>';

    //                                    html += '    <td>';
    //                                    html += '      <span style="color:white;background-color:#009933;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDisplayWebsiteErrorThreatDetails\', \'verbose\', \'' + bwWorkflowAppId + '\');" class="bwMonitoringTools_cmdDisplayWebsiteErrorThreatDetails">Verbose: <span>#</span>';
    //                                    html += '      </span>';
    //                                    html += '    </td>';

    //                                    html += '    <td>';
    //                                    html += '      <span style="color:white;background-color:#ff0000;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" class="bwMonitoringTools_cmdDisplayWebsiteErrorThreatDetails" >';
    //                                    html += '           <span onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDisplayWebsiteErrorThreatDetails\', \'severe\', \'' + bwWorkflowAppId + '\');">Severe: ' + threatCounts.severe + '</span>';
    //                                    if (threatCounts.severe > 0) {
    //                                        html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDeleteAllExceptionLogs\', \'severe\', \'ALL\');">';
    //                                    }
    //                                    html += '      </span>';
    //                                    html += '    </td>';

    //                                    html += '    <td>';
    //                                    html += '      <span style="color:white;background-color:#ff9900;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" class="bwMonitoringTools_cmdDisplayWebsiteErrorThreatDetails">';
    //                                    html += '           <span onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDisplayWebsiteErrorThreatDetails\', \'high\', \'' + bwWorkflowAppId + '\');">High: ' + threatCounts.high + '</span>';
    //                                    if (threatCounts.high > 0) {
    //                                        html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDeleteAllExceptionLogs\', \'high\', \'ALL\');">';
    //                                    }
    //                                    html += '      </span>';
    //                                    html += '    </td>';

    //                                    html += '    <td>';
    //                                    html += '      <span style="color:#ff9900;background-color:#ffff00;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" class="bwMonitoringTools_cmdDisplayWebsiteErrorThreatDetails">';
    //                                    html += '           <span onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDisplayWebsiteErrorThreatDetails\', \'elevated\', \'' + bwWorkflowAppId + '\');">Elevated (client display): ' + threatCounts.elevated + '</span>';
    //                                    if (threatCounts.elevated > 0) {
    //                                        html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDeleteAllExceptionLogs\', \'elevated\', \'ALL\');">';
    //                                    }
    //                                    html += '      </span>';
    //                                    html += '    </td>';

    //                                    html += '    <td>';
    //                                    html += '      <span style="color:white;background-color:#0066ff;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" class="bwMonitoringTools_cmdDisplayWebsiteErrorThreatDetails">';
    //                                    html += '           <span onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDisplayWebsiteErrorThreatDetails\', \'guarded\', \'' + bwWorkflowAppId + '\');">Guarded: ' + threatCounts.guarded + '</span>';
    //                                    if (threatCounts.guarded > 0) {
    //                                        html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDeleteAllExceptionLogs\', \'guarded\', \'ALL\');">';
    //                                    }
    //                                    html += '      </span>';
    //                                    html += '    </td>';

    //                                    html += '    <td>';
    //                                    html += '      <span style="color:white;background-color:#009933;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" class="bwMonitoringTools_cmdDisplayWebsiteErrorThreatDetails">';
    //                                    html += '           <span onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDisplayWebsiteErrorThreatDetails\', \'low\', \'' + bwWorkflowAppId + '\');">Low: ' + threatCounts.low + '</span>';
    //                                    if (threatCounts.low > 0) {
    //                                        html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDeleteAllExceptionLogs\', \'low\', \'ALL\');">';
    //                                    }
    //                                    html += '      </span>';
    //                                    html += '    </td>';

    //                                    html += '    <td>';
    //                                    html += '      <span style="color:white;background-color:#009933;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" class="bwMonitoringTools_cmdDisplayWebsiteErrorThreatDetails">';
    //                                    html += '           <span onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDisplayWebsiteErrorThreatDetails\', \'email\', \'' + bwWorkflowAppId + '\');">Email: ' + threatCounts.email + '</span>';
    //                                    if (threatCounts.email > 0) {
    //                                        html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="$(\'.bwMonitoringTools_Main\').bwMonitoringTools_Main(\'cmdDeleteAllExceptionLogs\', \'email\', \'ALL\');">';
    //                                    }
    //                                    html += '      </span>';
    //                                    html += '    </td>';

    //                                    html += '  </tr>';
    //                                    html += '</table>';
    //                                    html += '</span>';

    //                                    html += '<textarea id="spanBwMonitoringTools2_txtBwExceptionLogDetails_' + thiz.options.elementIdSuffix + '" rows="40" cols="200" style="padding-top:4px;"></textarea>';

    //                                    // Render the html.
    //                                    thiz.element.html(html);

    //                                } catch (e) {
    //                                    console.log('Exception in renderMonitoringTools():3: ' + e.message + ', ' + e.stack);
    //                                    displayAlertDialog('Exception in renderMonitoringTools():3: ' + e.message + ', ' + e.stack);
    //                                }
    //                            },
    //                            error: function (data, errorCode, errorMessage) {
    //                                console.log('Error in admin.js.renderMonitoringTools():' + errorCode + ', ' + errorMessage);
    //                                displayAlertDialog('Error in admin.js.renderMonitoringTools():' + errorCode + ', ' + errorMessage);
    //                            }
    //                        });
    //                    }

    //                } catch (e) {
    //                    console.log('Exception in renderMonitoringTools():2: ' + e.message + ', ' + e.stack);
    //                    displayAlertDialog('Exception in renderMonitoringTools():2: ' + e.message + ', ' + e.stack);
    //                }
    //            },
    //            error: function (data, errorCode, errorMessage) {
    //                //alert('xcx124312342 error response from web service');
    //                console.log('Error in admin.js.renderMonitoringTools():xcx21123-1:' + errorCode + ', ' + errorMessage);
    //                displayAlertDialog('Error in admin.js.renderMonitoringTools()::xcx21123-1:' + errorCode + ', ' + errorMessage);
    //            }
    //        });

    //    } catch (e) {
    //        console.log('Exception in renderMonitoringTools(): ' + e.message + ', ' + e.stack);
    //        displayAlertDialog('Exception in renderMonitoringTools(): ' + e.message + ', ' + e.stack);
    //    }
    //},
});