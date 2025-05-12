$.widget("bw.bwRequestTypeEditor", {
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
        This is the bwRequestTypeEditor.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        operationUriPrefix: null,
        ajaxTimeout: 15000,

        requestTypes: null,

        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function (assignmentRowChanged_ElementId) {
        this.element.addClass("bwRequestTypeEditor");
        var thiz = this; // Need this because of the asynchronous operations below.

        try {
            if (this.options.operationUriPrefix == null) {
                // This formulates the operationUri, which is used throughout.
                var url1 = window.location.href.split('https://')[1];
                var url2 = url1.split('/')[0];
                this.options.operationUriPrefix = 'https://' + url2 + '/';
            }

            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            // 
            // Load this object first so we don't have to keep making web service calls.
            //
            if (this.options.requestTypes != null) {
                this.renderRequestTypeEditor();
            } else {

                var data = {
                    bwParticipantId_LoggedIn: participantId,
                    bwActiveStateIdentifier: activeStateIdentifier,
                    bwWorkflowAppId_LoggedIn: workflowAppId,

                    bwWorkflowAppId: workflowAppId
                }
                var operationUri = this.options.operationUriPrefix + "_bw/RequestTypes";
                $.ajax({
                    url: operationUri,
                    type: 'POST',
                    data: data,
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    },
                    success: function (results) {
                        try {
                            if (results.status != 'SUCCESS') {

                                var html = '';
                                html += '<span style="font-size:24pt;color:red;">bwRequestTypeEditor: CANNOT RENDER</span>';
                                html += '<br />';
                                html += '<span style="">Error in bwRequestTypeEditor.Create(): ' + results.message + '</span>';
                                thiz.element.html(html);

                            } else {

                                thiz.options.requestTypes = results.RequestTypes;
                                thiz.renderRequestTypeEditor();

                            }
                        } catch (e) {
                            console.log('Exception in bwRequestTypeEditor._create().xx.Get:1: ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in bwRequestTypeEditor._create().xx.Get:1: ' + e.message + ', ' + e.stack);
                        }
                    },
                    error: function (data, errorCode, errorMessage) {

                        debugger;
                        console.log('In bwRequestTypeEditor._create.RequestTypes.error(): ' + JSON.stringify(data));
                        var msg;
                        if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                            msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                        } else {
                            msg = JSON.stringify(data);
                        }
                        alert('Exception in bwRequestTypeEditor._create().xx.Get:2: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                        console.log('Exception in bwRequestTypeEditor._create().xx.Get:2: ' + JSON.stringify(data));
                        //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                        //var error = JSON.parse(data.responseText)["odata.error"];
                        //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                    }
                });
            }

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwRequestTypeEditor: CANNOT RENDER</span>';
            html += '<br />';
            html += '<span style="">Exception in bwRequestTypeEditor.Create(): ' + e.message + ', ' + e.stack + '</span>';
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

    renderRequestTypeEditor: function () {
        try {
            console.log('In renderRequestTypeEditor().');
            var thiz = this;
            var html = '';

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            html += '<div style="display:none;" id="divManageRequestTypeDialog">';
            html += '   <table style="width:100%;">';
            html += '       <tr>';
            html += '           <td style="width:90%;">';
            html += '               <span id="spanAddAnOrgItemDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">[spanAddAnOrgItemDialogTitle]</span>';
            html += '           </td>';
            html += '           <td style="width:9%;"></td>';
            html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divManageRequestTypeDialog\').dialog(\'close\');">X</span>';
            html += '           </td>';
            html += '       </tr>';
            html += '   </table>';
            html += '   <br /><br />';
            html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '   <span id="spanAddAnOrgItemDialogInvitationDescriptionText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;"></span>';
            //html += '   <span style="font-family: calibri;">Name</span>';
            //html += '   <br />';
            //html += '   <input type="text" id="txtManageRequestTypeDialog_Name" style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />';
            //html += '   <br /><br />';

            // 12-31-2021
            html += '   <span style="font-family: calibri;">Singleton name</span>';
            html += '   <br />';
            html += '   <input type="text" id="txtManageRequestTypeDialog_SingletonName" style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />';
            html += '   <br />';
            html += '   <span style="font-family: calibri;">Plural name</span>';
            html += '   <br />';
            html += '   <input type="text" id="txtManageRequestTypeDialog_PluralName" style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />';
            html += '   <br /><br />';


            html += '   <span style="font-family: calibri;">Abbreviation</span>';
            html += '   <br />';
            html += '   <input type="text" id="txtManageRequestTypeDialog_Abbreviation" style="width:25%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />';
            html += '   <br /><br />';
            html += '   <span style="font-family: calibri;">Id</span>';
            html += '   <br />';
            html += '   <input id="txtManageRequestTypeDialog_Id" type="text" disabled style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" /><br />';

            // added 8-9-2023.
            html += '   <br /><br />';
            html += '   <span style="white-space:nowrap;"><input id="checkboxManageRequestTypeDialog_HasWorkflow" type="checkbox" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />Has a workflow</span>';

            html += '   <br /><br />';
            html += '   <span style="white-space:nowrap;"><input id="checkboxManageRequestTypeDialog_Active" type="checkbox" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />Active</span>';





            // 3-8-2024

            html += '   <br /><br />';

            html += '<img xcx="xcx3243674-2" src="https://shareandcollaborate.com/_files/c48535a4-9a6b-4b95-9d67-c6569e9695d8/b805b235-8c7c-4b5a-85e1-0eda3196748b/Image (7).png?v=c42761c1-7fb7-472e-934f-cc0fdd4cf559&amp;ActiveStateIdentifier=4537be52-4bab-424c-939e-3500e2ca070b" style="width:700px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;">';











            html += '   <br /><br /><br />';
            html += '   <div id="divManageRequestTypeDialogSubmitButton" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
            html += '       Add the xx';
            html += '   </div>';
            html += '   <br /><br />';
            html += '   <div class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;" onclick="$(\'#divManageRequestTypeDialog\').dialog(\'close\');">';
            html += '       Close';
            html += '   </div>';
            html += '   <br /><br />';
            html += '</div>';


            //html += '<br /><br />';
            html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '  <tr>';
            html += '    <td>';
            //html += '        <span style="font-size:small;font-style:italic;">The title of the person responsible for completing the details of a New Request. This is displayed on the Budget Request forms. The default is "Manager".</span>';
            html += '       <span style="font-size:small;font-style:italic;">The request types you wish to enable:</span>';
            html += '    </td></tr>';
            html += '</table>';
            html += '<table>';
            html += '  <tr>';
            html += '    <td style="text-align:left;vertical-align:top;" class="bwSliderTitleCell">';
            html += '       Request Types:&nbsp;';
            html += '    </td>';
            html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';

            html += '<style>';
            html += '.dataGridTable { border: 1px solid gainsboro; font-size:14px; font-family: "Helvetica Neue","Segoe UI",Helvetica,Verdana,sans-serif; }';
            html += '.dataGridTable td { border-left: 0px; border-right: 1px solid gainsboro; }';
            html += '.headerRow { background-color:white; color:gray;border-bottom:1px solid gainsboro; }';
            html += '.headerRow td { border-bottom:1px solid gainsboro; padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
            html += '.filterRow td { border-bottom:1px solid whitesmoke; padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
            html += '.alternatingRowLight { background-color:white; }';
            html += '.alternatingRowLight td { padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
            html += '.alternatingRowLight:hover { background-color:lightgoldenrodyellow; }';
            html += '.alternatingRowDark { background-color:whitesmoke; }';
            html += '.alternatingRowDark td { padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
            html += '.alternatingRowDark:hover { background-color:lightgoldenrodyellow; }';
            html += '</style>';

            html += '<table class="dataGridTable">';
            html += '  <tr class="headerRow">';
            html += '    <td>Abbreviation</td>';
            html += '    <td>SingletonName</td>';
            html += '    <td>PluralName</td>';
            html += '    <td>isActive</td>';
            html += '    <td>hasCustomWorkflow</td>';
            html += '    <td>supplementalsEnabled</td>';
            html += '    <td>closeoutsEnabled</td>';
            html += '    <td>External Publishing</td>';
            html += '    <td>bwRequestTypeId</td>';
            html += '    <td></td>';
            html += '    <td></td>';
            html += '  </tr>';

            var alternatingRow = 'light'; // Use this to color the rows.
            //debugger;
            if (!thiz.options.requestTypes) {
                html += '  <tr class="alternatingRowLight" style="cursor:pointer;">';
                html += '   <td colspan="5"><span style="color:tomato;">No data. Is the webservice responding correctly?</span></td>';
                html += '  </tr>';
            } else if (thiz.options.requestTypes.length == 0) {
                html += '  <tr class="alternatingRowLight" style="cursor:pointer;">';
                html += '   <td colspan="4"><span style="color:tomato;">No request types exist in the database.</span></td>';
                html += '  </tr>';
            } else {
                for (var i = 0; i < thiz.options.requestTypes.length; i++) {
                    if (alternatingRow == 'light') {
                        html += '  <tr class="alternatingRowLight" style="cursor:pointer;">';
                        alternatingRow = 'dark';
                    } else {
                        html += '  <tr class="alternatingRowDark" style="cursor:pointer;">';
                        alternatingRow = 'light';
                    }
                    html += '    <td>' + thiz.options.requestTypes[i].Abbreviation + '</td>';
                    html += '    <td>' + thiz.options.requestTypes[i].SingletonName + '</td>';
                    html += '    <td>' + thiz.options.requestTypes[i].PluralName + '</td>';



                    // id="switchbutton_bwRequestTypeEditor_IsActive_bwRequestTypeId". 3-24-2023.

                    // Original, for isActive:
                    //html += '    <td>';
                    //html += '       <label for="configurationBehaviorEnable' + thiz.options.requestTypes[i].bwRequestTypeId + 'Slider"></label><input type="checkbox" name="configurationBehaviorEnable' + thiz.options.requestTypes[i].bwRequestTypeId + 'Slider" id="configurationBehaviorEnable' + thiz.options.requestTypes[i].bwRequestTypeId + 'Slider" />';
                    //html += '    </td>';


                    html += '    <td>';
                    html += '       <label for="switchbutton_bwRequestTypeEditor_IsActive_bwRequestTypeId' + thiz.options.requestTypes[i].bwRequestTypeId + 'Slider"></label><input type="checkbox" name="switchbutton_bwRequestTypeEditor_IsActive_bwRequestTypeId' + thiz.options.requestTypes[i].bwRequestTypeId + 'Slider" id="switchbutton_bwRequestTypeEditor_IsActive_bwRequestTypeId' + thiz.options.requestTypes[i].bwRequestTypeId + 'Slider" />';
                    html += '    </td>';

                    // Added 8-10-2023.
                    html += '    <td>';
                    html += '       <label for="switchbutton_bwRequestTypeEditor_HasWorkflow_bwRequestTypeId' + thiz.options.requestTypes[i].bwRequestTypeId + 'Slider"></label><input type="checkbox" name="switchbutton_bwRequestTypeEditor_HasWorkflow_bwRequestTypeId' + thiz.options.requestTypes[i].bwRequestTypeId + 'Slider" id="switchbutton_bwRequestTypeEditor_HasWorkflow_bwRequestTypeId' + thiz.options.requestTypes[i].bwRequestTypeId + 'Slider" />';
                    html += '    </td>';

                    html += '    <td>';
                    html += '       <label for="switchbutton_bwRequestTypeEditor_SupplementalsEnabled_bwRequestTypeId' + thiz.options.requestTypes[i].bwRequestTypeId + 'Slider"></label><input type="checkbox" name="switchbutton_bwRequestTypeEditor_SupplementalsEnabled_bwRequestTypeId' + thiz.options.requestTypes[i].bwRequestTypeId + 'Slider" id="switchbutton_bwRequestTypeEditor_SupplementalsEnabled_bwRequestTypeId' + thiz.options.requestTypes[i].bwRequestTypeId + 'Slider" />';
                    html += '    </td>';

                    html += '    <td>';
                    html += '       <label for="switchbutton_bwRequestTypeEditor_CloseoutsEnabled_bwRequestTypeId' + thiz.options.requestTypes[i].bwRequestTypeId + 'Slider"></label><input type="checkbox" name="switchbutton_bwRequestTypeEditor_CloseoutsEnabled_bwRequestTypeId' + thiz.options.requestTypes[i].bwRequestTypeId + 'Slider" id="switchbutton_bwRequestTypeEditor_CloseoutsEnabled_bwRequestTypeId' + thiz.options.requestTypes[i].bwRequestTypeId + 'Slider" />';
                    html += '    </td>';


                    // 5-10-2024.
                    html += '    <td>';
                    html += '       <label for="switchbutton_bwRequestTypeEditor_ExternalPublishingEnabled_bwRequestTypeId' + thiz.options.requestTypes[i].bwRequestTypeId + 'Slider"></label><input type="checkbox" name="switchbutton_bwRequestTypeEditor_ExternalPublishingEnabled_bwRequestTypeId' + thiz.options.requestTypes[i].bwRequestTypeId + 'Slider" id="switchbutton_bwRequestTypeEditor_ExternalPublishingEnabled_bwRequestTypeId' + thiz.options.requestTypes[i].bwRequestTypeId + 'Slider" />';
                    html += '    </td>';



                    html += '    <td>' + thiz.options.requestTypes[i].bwRequestTypeId + '</td>';

                    var isActive;
                    if (thiz.options.requestTypes[i].hasOwnProperty('isActive')) {
                        isActive = thiz.options.requestTypes[i].isActive;
                    }

                    var hasWorkflow; // This is how we are integrating this new field, which was added 8-9-2023.
                    if (thiz.options.requestTypes[i].hasOwnProperty('hasWorkflow')) {
                        hasWorkflow = thiz.options.requestTypes[i].hasWorkflow;

                        //alert('HAD THE PROPERTY hasWorkflow: ' + thiz.options.requestTypes[i].hasWorkflow);

                    } else {

                        // Keep this here because we have old data that needs to be detected and fixed up.
                        console.log('NO PROPERTY hasWorkflow for ' + thiz.options.requestTypes[i].Abbreviation + ': ' + thiz.options.requestTypes[i].hasWorkflow + '. THIS MUST BE OLDER DATA. TO REMEDIATE, RE-SAVE THIS REQUEST TYPE. 8-10-2023.');
                        displayAlertDialog('NO PROPERTY hasWorkflow for ' + thiz.options.requestTypes[i].Abbreviation + ': ' + thiz.options.requestTypes[i].hasWorkflow + '. THIS MUST BE OLDER DATA. TO REMEDIATE, RE-SAVE THIS REQUEST TYPE. 8-10-2023.');

                    }

                    html += '    <td><button class="BwSmallButton" onclick="$(\'.bwRequestTypeEditor\').bwRequestTypeEditor(\'editARequestType\', \'' + thiz.options.requestTypes[i].bwRequestTypeId + '\', \'' + isActive + '\', \'' + hasWorkflow + '\', \'' + thiz.options.requestTypes[i].Abbreviation + '\', \'' + thiz.options.requestTypes[i].SingletonName + '\', \'' + thiz.options.requestTypes[i].PluralName + '\');">edit</button></td>';
                    html += '    <td><img src="images/trash-can.png" onclick="$(\'.bwRequestTypeEditor\').bwRequestTypeEditor(\'deleteARequestType\', \'' + thiz.options.requestTypes[i].bwRequestTypeId + '\', \'' + isActive + '\', \'' + hasWorkflow + '\', \'' + thiz.options.requestTypes[i].Abbreviation + '\', \'' + thiz.options.requestTypes[i].SingletonName + '\', \'' + thiz.options.requestTypes[i].PluralName + '\');" title="Delete" style="cursor:pointer;" /></td>';
                    html += '  </tr>';
                }
            }
            html += '</table>';
            html += '<br />';
            html += '<input style="padding:5px 10px 5px 10px;" id="btnCreateRole2" onclick="$(\'.bwRequestTypeEditor\').bwRequestTypeEditor(\'addARequestType\');" type="button" value="Add a Request type...">';

            // Render the html. THIS WAY IS PREFERABLE COME BACK AND FIX SOMETIME
            thiz.element.html(html);

            // Hook up the switch buttons.
            for (var i = 0; i < thiz.options.requestTypes.length; i++) {


                //
                // IsActive slider/checkbox. 8-10-2023.
                //
                var configurationBehaviorOptions = {
                    checked: thiz.options.requestTypes[i].isActive, //bwEnabledRequestTypes.Details.BudgetRequests.Enabled, //quotingEnabled,
                    show_labels: true,         // Should we show the on and off labels?
                    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                    on_label: "YES",            // Text to be displayed when checked
                    off_label: "NO",          // Text to be displayed when unchecked
                    width: 50,                 // Width of the button in pixels
                    height: 22,                // Height of the button in pixels
                    button_width: 24,         // Width of the sliding part in pixels
                    clear_after: null         // Override the element after which the clearing div should be inserted 
                };
                $('input#switchbutton_bwRequestTypeEditor_IsActive_bwRequestTypeId' + thiz.options.requestTypes[i].bwRequestTypeId + 'Slider').switchButton(configurationBehaviorOptions);

                $('#switchbutton_bwRequestTypeEditor_IsActive_bwRequestTypeId' + thiz.options.requestTypes[i].bwRequestTypeId + 'Slider').change(function () {
                    try {

                        // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
                        var bwRequestTypeId = this.id.split('switchbutton_bwRequestTypeEditor_IsActive_bwRequestTypeId')[1].split('Slider')[0]; //'switchbutton_bwRequestTypeEditor_IsActive_bwRequestTypeId' + thiz.options.requestTypes[i].bwRequestTypeId + 'Slider';
                        var isActive = this.checked; // This is what the user has just chosen to do.

                        var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                        requestTypeDetails = {
                            bwParticipantId_LoggedIn: participantId,
                            bwActiveStateIdentifier: activeStateIdentifier,
                            bwWorkflowAppId_LoggedIn: workflowAppId,

                            bwWorkflowAppId: workflowAppId,
                            bwRequestTypeId: bwRequestTypeId,
                            isActive: isActive, // This is the single property.
                            bwParticipantId: participantId,
                            bwParticipantFriendlyName: participantFriendlyName,
                            bwParticipantEmail: participantEmail
                        };

                        var operationUri = thiz.options.operationUriPrefix + "_bw/UpdateRequestTypeStatus_ForSingleProperty"; //bwworkflow/updateworkflowconfigurationbehaviorquotingenabled";
                        $.ajax({
                            url: operationUri,
                            type: "POST",
                            data: requestTypeDetails,
                            headers: {
                                "Accept": "application/json; odata=verbose"
                            },
                            success: function (result) {
                                try {

                                    if (result.message != 'SUCCESS') {
                                        displayAlertDialog(result.message);
                                    } else {

                                        //
                                        // THIS IS THE ONLY PLACE WE SHOULD BE READING IN ENABLED REQUEST TYPES. THIS IS A GLOBAL VARIABLE AND SHOULD BE REFERENCED EVERYWHERE ELSE!!!!!!!!!!!!!!!!!!!!!!!! 7-8-2020. my.renderWelcomeScreen()
                                        // (actually this also happens in Configuration > Settings, when the request types are turned on or off.)
                                        //
                                        //debugger;
                                        //bwEnabledRequestTypes.EnabledItems = [];
                                        //for (var rt = 0; rt < RequestTypesResult.RequestTypes.length; rt++) {
                                        //    if (RequestTypesResult.RequestTypes[rt].isActive == true) {
                                        //        var request = [RequestTypesResult.RequestTypes[rt].Abbreviation, RequestTypesResult.RequestTypes[rt].RequestType, RequestTypesResult.RequestTypes[rt].isActive, RequestTypesResult.RequestTypes[rt].bwRequestTypeId];
                                        //        bwEnabledRequestTypes.EnabledItems.push(request);
                                        //    }
                                        //}


                                        debugger;
                                        var bwEnabledRequestTypes = {
                                            EnabledItems: []
                                        }
                                        for (var rt = 0; rt < result.RequestTypes.length; rt++) {
                                            if (result.RequestTypes[rt].isActive == true) {
                                                //debugger;
                                                //var request = [RequestTypesResult.RequestTypes[rt].Abbreviation, RequestTypesResult.RequestTypes[rt].RequestType, RequestTypesResult.RequestTypes[rt].isActive, RequestTypesResult.RequestTypes[rt].bwRequestTypeId];
                                                var request = {
                                                    bwRequestTypeId: result.RequestTypes[rt].bwRequestTypeId,
                                                    isActive: result.RequestTypes[rt].isActive,
                                                    hasWorkflow: result.RequestTypes[rt].hasWorkflow,
                                                    Abbreviation: result.RequestTypes[rt].Abbreviation,
                                                    SingletonName: result.RequestTypes[rt].SingletonName,
                                                    PluralName: result.RequestTypes[rt].PluralName
                                                    //RequestType: RequestTypesResult.RequestTypes[rt].RequestType, // Removed 1-1-2022

                                                }
                                                bwEnabledRequestTypes.EnabledItems.push(request);
                                            }
                                        }
                                        // bwAuthentication is our source for this information, so update it .
                                        $('.bwAuthentication').bwAuthentication({ bwEnabledRequestTypes: bwEnabledRequestTypes });



                                    }
                                } catch (e) {
                                    console.log('Exception in renderRequestTypeEditor.switchbutton_bwRequestTypeEditor_IsActive_bwRequestTypeId.change():2: ' + e.message + ', ' + e.stack);
                                    displayAlertDialog('Exception in renderRequestTypeEditor.switchbutton_bwRequestTypeEditor_IsActive_bwRequestTypeId.change():2: ' + e.message + ', ' + e.stack);
                                }
                            },
                            error: function (data, errorCode, errorMessage) {
                                displayAlertDialog('Error in bwRequestTypeEditor.renderRequestTypeEditor.switchbutton_bwRequestTypeEditor_IsActive_bwRequestTypeId.change():1: ' + errorCode + ' ' + errorMessage);
                            }
                        });
                    } catch (e) {
                        console.log('Exception in renderRequestTypeEditor.switchbutton_bwRequestTypeEditor_IsActive_bwRequestTypeId.change(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in renderRequestTypeEditor.switchbutton_bwRequestTypeEditor_IsActive_bwRequestTypeId.change(): ' + e.message + ', ' + e.stack);
                    }
                });
                //
                // end: IsActive slider/checkbox. 8-10-2023.
                //

                //
                // HasWorkflow slider/checkbox. 8-10-2023.
                //
                var configurationBehaviorOptions = {
                    checked: thiz.options.requestTypes[i].hasWorkflow, //bwEnabledRequestTypes.Details.BudgetRequests.Enabled, //quotingEnabled,
                    show_labels: true,         // Should we show the on and off labels?
                    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                    on_label: "YES",            // Text to be displayed when checked
                    off_label: "NO",          // Text to be displayed when unchecked
                    width: 50,                 // Width of the button in pixels
                    height: 22,                // Height of the button in pixels
                    button_width: 24,         // Width of the sliding part in pixels
                    clear_after: null         // Override the element after which the clearing div should be inserted 
                };
                $('input#switchbutton_bwRequestTypeEditor_HasWorkflow_bwRequestTypeId' + thiz.options.requestTypes[i].bwRequestTypeId + 'Slider').switchButton(configurationBehaviorOptions);

                $('#switchbutton_bwRequestTypeEditor_HasWorkflow_bwRequestTypeId' + thiz.options.requestTypes[i].bwRequestTypeId + 'Slider').change(function () {
                    try {

                        // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
                        var bwRequestTypeId = this.id.split('switchbutton_bwRequestTypeEditor_HasWorkflow_bwRequestTypeId')[1].split('Slider')[0];
                        var hasWorkflow = this.checked; // This is what the user has just chosen to do.

                        var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                        requestTypeDetails = {
                            bwParticipantId_LoggedIn: participantId,
                            bwActiveStateIdentifier: activeStateIdentifier,
                            bwWorkflowAppId_LoggedIn: workflowAppId,

                            bwWorkflowAppId: workflowAppId,
                            bwRequestTypeId: bwRequestTypeId,
                            hasWorkflow: hasWorkflow, // This is the single property.
                            bwParticipantId: participantId,
                            bwParticipantFriendlyName: participantFriendlyName,
                            bwParticipantEmail: participantEmail
                        };

                        var operationUri = thiz.options.operationUriPrefix + "_bw/UpdateRequestTypeStatus_ForSingleProperty";
                        $.ajax({
                            url: operationUri,
                            type: "POST",
                            data: requestTypeDetails,
                            headers: {
                                "Accept": "application/json; odata=verbose"
                            },
                            success: function (result) {
                                try {

                                    if (result.message != 'SUCCESS') {
                                        displayAlertDialog(result.message);
                                    } else {

                                        //
                                        // THIS IS THE ONLY PLACE WE SHOULD BE READING IN ENABLED REQUEST TYPES. THIS IS A GLOBAL VARIABLE AND SHOULD BE REFERENCED EVERYWHERE ELSE!!!!!!!!!!!!!!!!!!!!!!!! 7-8-2020. my.renderWelcomeScreen()
                                        // (actually this also happens in Configuration > Settings, when the request types are turned on or off.)
                                        //
                                        //debugger;
                                        //bwEnabledRequestTypes.EnabledItems = [];
                                        //for (var rt = 0; rt < RequestTypesResult.RequestTypes.length; rt++) {
                                        //    if (RequestTypesResult.RequestTypes[rt].isActive == true) {
                                        //        var request = [RequestTypesResult.RequestTypes[rt].Abbreviation, RequestTypesResult.RequestTypes[rt].RequestType, RequestTypesResult.RequestTypes[rt].isActive, RequestTypesResult.RequestTypes[rt].bwRequestTypeId];
                                        //        bwEnabledRequestTypes.EnabledItems.push(request);
                                        //    }
                                        //}


                                        debugger;
                                        var bwEnabledRequestTypes = {
                                            EnabledItems: []
                                        }
                                        for (var rt = 0; rt < result.RequestTypes.length; rt++) {
                                            if (result.RequestTypes[rt].isActive == true) {
                                                //debugger;
                                                //var request = [RequestTypesResult.RequestTypes[rt].Abbreviation, RequestTypesResult.RequestTypes[rt].RequestType, RequestTypesResult.RequestTypes[rt].isActive, RequestTypesResult.RequestTypes[rt].bwRequestTypeId];
                                                var request = {
                                                    bwRequestTypeId: result.RequestTypes[rt].bwRequestTypeId,
                                                    isActive: result.RequestTypes[rt].isActive,
                                                    hasWorkflow: result.RequestTypes[rt].hasWorkflow,
                                                    Abbreviation: result.RequestTypes[rt].Abbreviation,
                                                    SingletonName: result.RequestTypes[rt].SingletonName,
                                                    PluralName: result.RequestTypes[rt].PluralName
                                                    //RequestType: RequestTypesResult.RequestTypes[rt].RequestType, // Removed 1-1-2022

                                                }
                                                bwEnabledRequestTypes.EnabledItems.push(request);
                                            }
                                        }
                                        // bwAuthentication is our source for this information, so update it .
                                        $('.bwAuthentication').bwAuthentication({ bwEnabledRequestTypes: bwEnabledRequestTypes });

                                    }
                                } catch (e) {
                                    console.log('Exception in renderRequestTypeEditor.switchbutton_bwRequestTypeEditor_IsActive_bwRequestTypeId.change():2: ' + e.message + ', ' + e.stack);
                                    displayAlertDialog('Exception in renderRequestTypeEditor.switchbutton_bwRequestTypeEditor_IsActive_bwRequestTypeId.change():2: ' + e.message + ', ' + e.stack);
                                }
                            },
                            error: function (data, errorCode, errorMessage) {
                                displayAlertDialog('Error in bwRequestTypeEditor.renderRequestTypeEditor.switchbutton_bwRequestTypeEditor_IsActive_bwRequestTypeId.change():2: ' + errorCode + ' ' + errorMessage);
                            }
                        });
                    } catch (e) {
                        console.log('Exception in renderRequestTypeEditor.switchbutton_bwRequestTypeEditor_IsActive_bwRequestTypeId.change(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in renderRequestTypeEditor.switchbutton_bwRequestTypeEditor_IsActive_bwRequestTypeId.change(): ' + e.message + ', ' + e.stack);
                    }
                });
                //
                // end: HasWorkflow slider/checkbox.
                //












                //
                // switchbutton_bwRequestTypeEditor_SupplementalsEnabled_bwRequestTypeId
                //
                
                var configurationBehaviorOptions = {
                    checked: thiz.options.requestTypes[i].supplementalsEnabled, //bwEnabledRequestTypes.Details.BudgetRequests.Enabled, //quotingEnabled,
                    show_labels: true,         // Should we show the on and off labels?
                    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                    on_label: "YES",            // Text to be displayed when checked
                    off_label: "NO",          // Text to be displayed when unchecked
                    width: 50,                 // Width of the button in pixels
                    height: 22,                // Height of the button in pixels
                    button_width: 24,         // Width of the sliding part in pixels
                    clear_after: null         // Override the element after which the clearing div should be inserted 
                };
                $('input#switchbutton_bwRequestTypeEditor_SupplementalsEnabled_bwRequestTypeId' + thiz.options.requestTypes[i].bwRequestTypeId + 'Slider').switchButton(configurationBehaviorOptions);

                $('#switchbutton_bwRequestTypeEditor_SupplementalsEnabled_bwRequestTypeId' + thiz.options.requestTypes[i].bwRequestTypeId + 'Slider').change(function () {
                    try {

                        // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
                        var bwRequestTypeId = this.id.split('switchbutton_bwRequestTypeEditor_SupplementalsEnabled_bwRequestTypeId')[1].split('Slider')[0];
                        var supplementalsEnabled = this.checked; // This is what the user has just chosen to do.

                        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                        var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                        // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
                        var bwRequestTypeId = this.id.split('switchbutton_bwRequestTypeEditor_SupplementalsEnabled_bwRequestTypeId')[1].split('Slider')[0];
                        var closeoutsEnabled = this.checked; // This is what the user has just chosen to do.

                        requestTypeDetails = {
                            bwParticipantId_LoggedIn: participantId,
                            bwActiveStateIdentifier: activeStateIdentifier,
                            bwWorkflowAppId_LoggedIn: workflowAppId,

                            bwWorkflowAppId: workflowAppId,
                            bwRequestTypeId: bwRequestTypeId,
                            supplementalsEnabled: supplementalsEnabled,
                            bwParticipantId: participantId,
                            bwParticipantFriendlyName: participantFriendlyName,
                            bwParticipantEmail: participantEmail
                        };

                        var operationUri = thiz.options.operationUriPrefix + "_bw/UpdateRequestTypeStatus_ForSingleProperty";
                        $.ajax({
                            url: operationUri,
                            type: "POST",
                            data: requestTypeDetails,
                            headers: {
                                "Accept": "application/json; odata=verbose"
                            },
                            success: function (results) {
                                try {
                                    debugger;
                                    if (results.message != 'SUCCESS') {
                                        displayAlertDialog(results.message);
                                    } else {

                                        var bwEnabledRequestTypes = {
                                            EnabledItems: []
                                        }
                                        for (var rt = 0; rt < results.RequestTypes.length; rt++) {
                                            if (results.RequestTypes[rt].isActive == true) {
                                                //debugger;
                                                //var request = [RequestTypesResult.RequestTypes[rt].Abbreviation, RequestTypesResult.RequestTypes[rt].RequestType, RequestTypesResult.RequestTypes[rt].isActive, RequestTypesResult.RequestTypes[rt].bwRequestTypeId];
                                                var request = {
                                                    bwRequestTypeId: results.RequestTypes[rt].bwRequestTypeId,
                                                    isActive: results.RequestTypes[rt].isActive,
                                                    hasWorkflow: results.RequestTypes[rt].hasWorkflow,
                                                    supplementalsEnabled: results.RequestTypes[rt].supplementalsEnabled,
                                                    closeoutsEnabled: results.RequestTypes[rt].closeoutsEnabled,
                                                    Abbreviation: results.RequestTypes[rt].Abbreviation,
                                                    SingletonName: results.RequestTypes[rt].SingletonName,
                                                    PluralName: results.RequestTypes[rt].PluralName
                                                    //RequestType: RequestTypesResult.RequestTypes[rt].RequestType, // Removed 1-1-2022

                                                }
                                                bwEnabledRequestTypes.EnabledItems.push(request);
                                            }
                                        }

                                        var msg = 'xcx23123 set supplementalsEnabled: ' + supplementalsEnabled;
                                        // bwAuthentication is our source for this information, so update it .
                                        $('.bwAuthentication').bwAuthentication({ bwEnabledRequestTypes: bwEnabledRequestTypes });

                                    }
                                } catch (e) {
                                    console.log('Exception in renderRequestTypeEditor.switchbutton_bwRequestTypeEditor_SupplementalsEnabled_bwRequestTypeId.change():2: ' + e.message + ', ' + e.stack);
                                    displayAlertDialog('Exception in renderRequestTypeEditor.switchbutton_bwRequestTypeEditor_SupplementalsEnabled_bwRequestTypeId.change():2: ' + e.message + ', ' + e.stack);
                                }
                            },
                            error: function (data, errorCode, errorMessage) {
                                displayAlertDialog('Error in bwRequestTypeEditor.renderRequestTypeEditor.switchbutton_bwRequestTypeEditor_SupplementalsEnabled_bwRequestTypeId.change(): ' + errorCode + ' ' + errorMessage);
                            }
                        });
                        
                    } catch (e) {
                        console.log('Exception in renderRequestTypeEditor.switchbutton_bwRequestTypeEditor_SupplementalsEnabled_bwRequestTypeId.change(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in renderRequestTypeEditor.switchbutton_bwRequestTypeEditor_SupplementalsEnabled_bwRequestTypeId.change(): ' + e.message + ', ' + e.stack);
                    }
                });

                //
                // switchbutton_bwRequestTypeEditor_CloseoutsEnabled_bwRequestTypeId
                //

                var configurationBehaviorOptions = {
                    checked: thiz.options.requestTypes[i].closeoutsEnabled, //bwEnabledRequestTypes.Details.BudgetRequests.Enabled, //quotingEnabled,
                    show_labels: true,         // Should we show the on and off labels?
                    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                    on_label: "YES",            // Text to be displayed when checked
                    off_label: "NO",          // Text to be displayed when unchecked
                    width: 50,                 // Width of the button in pixels
                    height: 22,                // Height of the button in pixels
                    button_width: 24,         // Width of the sliding part in pixels
                    clear_after: null         // Override the element after which the clearing div should be inserted 
                };
                $('input#switchbutton_bwRequestTypeEditor_CloseoutsEnabled_bwRequestTypeId' + thiz.options.requestTypes[i].bwRequestTypeId + 'Slider').switchButton(configurationBehaviorOptions);

                $('#switchbutton_bwRequestTypeEditor_CloseoutsEnabled_bwRequestTypeId' + thiz.options.requestTypes[i].bwRequestTypeId + 'Slider').change(function () {
                    try {

                        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                        var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                        // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
                        var bwRequestTypeId = this.id.split('switchbutton_bwRequestTypeEditor_CloseoutsEnabled_bwRequestTypeId')[1].split('Slider')[0];
                        var closeoutsEnabled = this.checked; // This is what the user has just chosen to do.

                        requestTypeDetails = {
                            bwParticipantId_LoggedIn: participantId,
                            bwActiveStateIdentifier: activeStateIdentifier,
                            bwWorkflowAppId_LoggedIn: workflowAppId,

                            bwWorkflowAppId: workflowAppId,
                            bwRequestTypeId: bwRequestTypeId,
                            closeoutsEnabled: closeoutsEnabled,
                            bwParticipantId: participantId,
                            bwParticipantFriendlyName: participantFriendlyName,
                            bwParticipantEmail: participantEmail
                        };

                        var operationUri = thiz.options.operationUriPrefix + "_bw/UpdateRequestTypeStatus_ForSingleProperty";
                        $.ajax({
                            url: operationUri,
                            type: "POST",
                            data: requestTypeDetails,
                            headers: {
                                "Accept": "application/json; odata=verbose"
                            },
                            success: function (results) {
                                try {
                                    debugger;
                                    if (results.message != 'SUCCESS') {
                                        displayAlertDialog(results.message);
                                    } else {

                                        var bwEnabledRequestTypes = {
                                            EnabledItems: []
                                        }
                                        for (var rt = 0; rt < results.RequestTypes.length; rt++) {
                                            if (results.RequestTypes[rt].isActive == true) {
                                                //debugger;
                                                //var request = [RequestTypesResult.RequestTypes[rt].Abbreviation, RequestTypesResult.RequestTypes[rt].RequestType, RequestTypesResult.RequestTypes[rt].isActive, RequestTypesResult.RequestTypes[rt].bwRequestTypeId];
                                                var request = {
                                                    bwRequestTypeId: results.RequestTypes[rt].bwRequestTypeId,
                                                    isActive: results.RequestTypes[rt].isActive,
                                                    hasWorkflow: results.RequestTypes[rt].hasWorkflow,
                                                    supplementalsEnabled: results.RequestTypes[rt].supplementalsEnabled,
                                                    closeoutsEnabled: results.RequestTypes[rt].closeoutsEnabled,
                                                    Abbreviation: results.RequestTypes[rt].Abbreviation,
                                                    SingletonName: results.RequestTypes[rt].SingletonName,
                                                    PluralName: results.RequestTypes[rt].PluralName
                                                    //RequestType: RequestTypesResult.RequestTypes[rt].RequestType, // Removed 1-1-2022

                                                }
                                                bwEnabledRequestTypes.EnabledItems.push(request);
                                            }
                                        }

                                        var msg = 'xcx23123 set closeoutsEnabled: ' + closeoutsEnabled;
                                        // bwAuthentication is our source for this information, so update it .
                                        $('.bwAuthentication').bwAuthentication({ bwEnabledRequestTypes: bwEnabledRequestTypes });

                                    }
                                } catch (e) {
                                    console.log('Exception in renderRequestTypeEditor.switchbutton_bwRequestTypeEditor_CloseoutsEnabled_bwRequestTypeId.change():2: ' + e.message + ', ' + e.stack);
                                    displayAlertDialog('Exception in renderRequestTypeEditor.switchbutton_bwRequestTypeEditor_CloseoutsEnabled_bwRequestTypeId.change():2: ' + e.message + ', ' + e.stack);
                                }
                            },
                            error: function (data, errorCode, errorMessage) {
                                displayAlertDialog('Error in bwRequestTypeEditor.renderRequestTypeEditor.switchbutton_bwRequestTypeEditor_CloseoutsEnabled_bwRequestTypeId.change(): ' + errorCode + ' ' + errorMessage);
                            }
                        });

                    } catch (e) {
                        console.log('Exception in renderRequestTypeEditor.switchbutton_bwRequestTypeEditor_CloseoutsEnabled_bwRequestTypeId.change(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in renderRequestTypeEditor.switchbutton_bwRequestTypeEditor_CloseoutsEnabled_bwRequestTypeId.change(): ' + e.message + ', ' + e.stack);
                    }
                });

            }

        } catch (e) {
            console.log('Exception in renderRequestTypeEditor(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderRequestTypeEditor(): ' + e.message + ', ' + e.stack);
        }
    },
    addARequestType: function () {
        try {
            console.log('In bwRequestTypeEditor.js.addARequestType().');
            var thiz = this;

            $('#divManageRequestTypeDialog').find('#spanAddAnOrgItemDialogTitle')[0].innerHTML = 'Add a new Request Type';
            $('#divManageRequestTypeDialog').find('#divManageRequestTypeDialogSubmitButton')[0].innerHTML = 'Add the new Request Type';

            $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_SingletonName')[0].value = '';
            $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_PluralName')[0].value = '';

            $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_Abbreviation')[0].value = '';
            $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_Id')[0].value = '';

            var abbreviationElement = $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_Abbreviation');
            $(abbreviationElement).removeAttr('disabled');

            $("#divManageRequestTypeDialog").dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '500',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divManageRequestTypeDialog").dialog('close');
                    });
                },
                close: function () {
                    $('#divManageRequestTypeDialog').dialog('destroy');
                }
            });
            //$("#divManageRequestTypeDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            $('#divManageRequestTypeDialogSubmitButton').off('click').click(function (error) {
                try {
        
                    console.log('In bwRequestTypeEditor.js.addARequestType.divManageRequestTypeDialogSubmitButton.click(). xcx246-1');
                    //alert('In bwRequestTypeEditor.js.addARequestType.divManageRequestTypeDialogSubmitButton.click(). xcx246-1');

                    var isActive = document.getElementById('checkboxManageRequestTypeDialog_Active').checked;
                    var hasWorkflow = document.getElementById('checkboxManageRequestTypeDialog_HasWorkflow').checked;

                    var SingletonName = $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_SingletonName').val().trim();
                    var PluralName = $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_PluralName').val().trim();

                    var abbreviation = $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_Abbreviation').val().trim();
                    if (SingletonName.length > 2 && PluralName.length > 2 && abbreviation.length > 1) {
                        
                        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                        var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
                        var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

                        var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                        var data = {
                            bwParticipantId_LoggedIn: participantId,
                            bwActiveStateIdentifier: activeStateIdentifier,
                            bwWorkflowAppId_LoggedIn: workflowAppId,

                            bwWorkflowAppId: workflowAppId,
                            bwParticipantId: participantId,
                            bwParticipantFriendlyName: participantFriendlyName,
                            bwParticipantEmail: participantEmail,
                            Abbreviation: abbreviation,

                            isActive: isActive,
                            hasWorkflow: hasWorkflow,

                            SingletonName: SingletonName,
                            PluralName: PluralName
                        };
                        debugger;
                        $.ajax({
                            url: thiz.options.operationUriPrefix + "_bw/addarequesttype",
                            type: 'POST',
                            data: data,
                            headers: {
                                "Accept": "application/json; odata=verbose"
                            },
                            success: function(RequestTypesResult) {
                                try {

                                    if (RequestTypesResult.status != 'SUCCESS') {

                                        displayAlertDialog('ERROR: ' + RequestTypesResult.message);

                                    } else {
                                        //thiz.options.requestTypes.push(requestTypeJson); // This updates the widget data.

                                        thiz.options.requestTypes = RequestTypesResult.RequestTypes; // Should we be storing this locally? Leaving it this way for now, but it should really be depending on bwAuthentication for this. 3-16-2024.

                                        //
                                        //
                                        // WHEN WE ADD A NEW REQUEST TYPE, WE NEED TO MAKE SURE IT EXISTS in bwAuthentication.options.bwEnabledRequestTypes. Also the new Form needs to be available. (bwForm)
                                        //
                                        //


                                        //
                                        // Sort by PluralName. This makes it so that they show up alphabetically in drop-downs.
                                        // Sort alphabetically.
                                        var prop = 'PluralName';
                                        RequestTypesResult.RequestTypes = RequestTypesResult.RequestTypes.sort(function (a, b) {
                                            if (true) { //asc, false for desc.
                                                if (a[prop] > b[prop]) return 1;
                                                if (a[prop] < b[prop]) return -1;
                                                return 0;
                                            } else {
                                                if (b[prop] > a[prop]) return 1;
                                                if (b[prop] < a[prop]) return -1;
                                                return 0;
                                            }
                                        });
                                        // End: Sort alphabetically.

                                        var bwEnabledRequestTypes = {
                                            EnabledItems: []
                                        };

                                        $('.bwAuthentication').bwAuthentication('option', 'bwEnabledRequestTypes', bwEnabledRequestTypes);

                                        for (var rt = 0; rt < RequestTypesResult.RequestTypes.length; rt++) {
                                            if (RequestTypesResult.RequestTypes[rt].isActive == true) {

                                                //var closeoutsEnabled;
                                                //if (!RequestTypesResult.RequestTypes[rt].closeoutsEnabled) {
                                                //    closeoutsEnabled = false;
                                                //}
                                                //alert('xcx23123412 loading closeoutsEnabled.');
                                                //debugger;
                                                var request = {
                                                    bwRequestTypeId: RequestTypesResult.RequestTypes[rt].bwRequestTypeId,
                                                    isActive: RequestTypesResult.RequestTypes[rt].isActive,
                                                    hasWorkflow: RequestTypesResult.RequestTypes[rt].hasWorkflow, // added 8-10-2023.
                                                    supplementalsEnabled: RequestTypesResult.RequestTypes[rt].supplementalsEnabled, // added 1-17-2024.
                                                    closeoutsEnabled: RequestTypesResult.RequestTypes[rt].closeoutsEnabled, // added 1-17-2024.
                                                    Abbreviation: RequestTypesResult.RequestTypes[rt].Abbreviation,
                                                    SingletonName: RequestTypesResult.RequestTypes[rt].SingletonName,
                                                    PluralName: RequestTypesResult.RequestTypes[rt].PluralName
                                                    //RequestType: RequestTypesResult.RequestTypes[rt].RequestType, // Removed 1-1-2022

                                                }
                                                // thiz.options.bwEnabledRequestTypes.EnabledItems.push(request);
                                                $('.bwAuthentication').bwAuthentication('option', 'bwEnabledRequestTypes').EnabledItems.push(request);
                                            }
                                        }

                                        // Add the form to bwRequest.options.ActiveForms. We don't need to add the workflow, because we get these as needed from the database to preserve concurrency in this multi user scenario.
                                        $('.bwRequest').bwRequest('option', 'ActiveForms').push(RequestTypesResult.bwForm);

                                        $("#divManageRequestTypeDialog").dialog('close');
                                        thiz.renderRequestTypeEditor();

                                    }
                                } catch (e) {
                                    console.log('Exception in bwRequestTypeEditor.js.addARequestType.js.SaveRequestType: ' + e.message + ', ' + e.stack);
                                    alert('Exception in bwRequestTypeEditor.js.addARequestType.js.SaveRequestType: ' + e.message + ', ' + e.stack);
                                }

                            },
                            error: function(data, errorCode, errorMessage) {
                                console.log('Error in bwRequestTypeEditor.js.addARequestType.addarequesttype: ' + JSON.stringify(data) + ', ' + errorCode + ', ' + errorMessage);
                                displayAlertDialog('Error in bwRequestTypeEditor.js.addARequestType.addarequesttype: ' + JSON.stringify(data) + ', ' + errorCode + ', ' + errorMessage);
                            }
                        });

                    } else {
                        alert('Please enter names (3 characters or more) and an abbreviation (2 characters or more).');
                    }
                } catch (e) {
                    console.log('Exception in bwRequestTypeEditor.js.addARequestType.click(): ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in bwRequestTypeEditor.js.addARequestType.click(): ' + e.message + ', ' + e.stack);
                }
            });

        } catch (e) {
            console.log('Exception in bwRequestTypeEditor.js.addARequestType(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwRequestTypeEditor.js.addARequestType(): ' + e.message + ', ' + e.stack);
        }
    },

    editARequestType: function (bwRequestTypeId, isActive, hasWorkflow, Abbreviation, SingletonName, PluralName) {
        try {
            console.log('In editARequestType(). bwRequestTypeId: ' + bwRequestTypeId);
            var thiz = this;

            $('#divManageRequestTypeDialog').find('#spanAddAnOrgItemDialogTitle')[0].innerHTML = 'Edit this Request Type';
            $('#divManageRequestTypeDialog').find('#divManageRequestTypeDialogSubmitButton')[0].innerHTML = 'Save the Request Type';

            //$('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_Name')[0].value = RequestType;

            $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_SingletonName')[0].value = SingletonName; // 12-31-2021
            $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_PluralName')[0].value = PluralName; // 12-31-2021

            $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_Abbreviation')[0].value = Abbreviation;
            $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_Id')[0].value = bwRequestTypeId;

            if (hasWorkflow == 'true') {
                document.getElementById('checkboxManageRequestTypeDialog_HasWorkflow').setAttribute('checked', 'checked');
            } else {
                 document.getElementById('checkboxManageRequestTypeDialog_HasWorkflow').removeAttribute('checked');
            }

            if (isActive == 'true') {
                document.getElementById('checkboxManageRequestTypeDialog_Active').setAttribute('checked', 'checked');
            } else {
                document.getElementById('checkboxManageRequestTypeDialog_Active').removeAttribute('checked');
            }

            var abbreviationElement = $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_Abbreviation');
            $(abbreviationElement).attr('disabled', 'disabled');

            //
            // ToDo: Add the click event to this Save button!
            //
            $("#divManageRequestTypeDialog").dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '500',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divManageRequestTypeDialog").dialog('close');
                    });
                },
                close: function () {
                    $('#divManageRequestTypeDialog').dialog('destroy');
                }
            });
            //$("#divManageRequestTypeDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            $('#divManageRequestTypeDialogSubmitButton').off('click').click(function (error) {
                try {
                    console.log('In editARequestType.divManageRequestTypeDialogSubmitButton.click().');

                    var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                    var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                    var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
                    var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

                    var isActive = document.getElementById('checkboxManageRequestTypeDialog_Active').checked;
                    var hasWorkflow = document.getElementById('checkboxManageRequestTypeDialog_HasWorkflow').checked;

                    var SingletonName = $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_SingletonName').val().trim(); // 12-31-2021
                    var PluralName = $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_PluralName').val().trim(); // 12-31-2021

                    var abbreviation = $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_Abbreviation').val().trim();
                    var bwRequestTypeId = $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_Id').val().trim();

                    if (SingletonName.length > 2 && PluralName.length > 2 && abbreviation.length > 1) {

                        var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                        var data = {
                            bwParticipantId_LoggedIn: participantId,
                            bwActiveStateIdentifier: activeStateIdentifier,
                            bwWorkflowAppId_LoggedIn: workflowAppId,

                            bwWorkflowAppId: workflowAppId,
                            bwParticipantId: participantId,
                            bwParticipantFriendlyName: participantFriendlyName,
                            bwParticipantEmail: participantEmail,
                            bwRequestTypeId: bwRequestTypeId,
                            Abbreviation: abbreviation,

                            SingletonName: SingletonName,
                            PluralName: PluralName,

                            isActive: isActive,
                            hasWorkflow: hasWorkflow
                        };

                        $.ajax({
                            url: thiz.options.operationUriPrefix + "_bw/EditRequestType",
                            type: "Post",
                            data: data,
                            headers: {
                                "Accept": "application/json; odata=verbose"
                            }
                        }).success(function (results) {
                            try {

                                if (results.status == 'CONFIRM_DELETION') {

                                    alert(results.message);

                                } else if (results.status != 'SUCCESS') {

                                    thiz.displayAlertDialog('ERROR: ' + results.message);

                                } else {

                                    // SUCCESS

                                    thiz.displayAlertDialog('Saved successfully.'); // ' + JSON.stringify(results.mod));

                                    // This updates the widget data.
                                    //for (var i = 0; i < thiz.options.requestTypes.length; i++) {
                                    //    if (thiz.options.requestTypes[i].bwRequestTypeId == bwRequestTypeId) {
                                    //        thiz.options.requestTypes[i].Abbreviation = abbreviation;
                                    //        thiz.options.requestTypes[i].RequestType = requestType;

                                    //        thiz.options.requestTypes[i].SingletonName = SingletonName;
                                    //        thiz.options.requestTypes[i].PluralName = PluralName;
                                    //        break;
                                    //    }
                                    //}
                                    thiz.options.requestTypes = results.data;

                                    $("#divManageRequestTypeDialog").dialog('close');
                                    thiz.renderRequestTypeEditor();

                                }
                            } catch (e) {
                                console.log('Exception in editARequestType.SaveRequestType: ' + e.message + ', ' + e.stack);
                                alert('Exception in editARequestType.SaveRequestType: ' + e.message + ', ' + e.stack);
                            }
                        }).error(function (data, errorCode, errorMessage) {

                            var msg;
                            if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                                msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                            } else {
                                msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
                            }
                            console.log('Fail in editARequestType.SaveRequestType: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
                            alert('Fail in editARequestType.SaveRequestType: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                            //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                            //var error = JSON.parse(data.responseText)["odata.error"];
                            //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                        });
                    } else {
                        alert('Please enter names (3 characters or more) and an abbreviation (2 characters or more).');
                    }
                } catch (e) {
                    console.log('Exception in editARequestType.click(): ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in editARequestType.click(): ' + e.message + ', ' + e.stack);
                }
            });

        } catch (e) {
            console.log('Exception in editARequestType(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in editARequestType(): ' + e.message + ', ' + e.stack);
        }
    },
    deleteARequestType: function (bwRequestTypeId, isActive, hasWorkflow, Abbreviation, SingletonName, PluralName) {
        try {
            console.log('In deleteARequestType(). bwRequestTypeId: ' + bwRequestTypeId);
            var thiz = this;

            $('#divManageRequestTypeDialog').find('#spanAddAnOrgItemDialogTitle')[0].innerHTML = 'Delete this Request Type';
            $('#divManageRequestTypeDialog').find('#divManageRequestTypeDialogSubmitButton')[0].innerHTML = 'Delete the Request Type';

            //$('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_Name')[0].value = RequestType;
            $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_SingletonName')[0].value = SingletonName;
            $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_PluralName')[0].value = PluralName;

            $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_Abbreviation')[0].value = Abbreviation;
            $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_Id')[0].value = bwRequestTypeId;

            if (hasWorkflow == 'true') {
                document.getElementById('checkboxManageRequestTypeDialog_HasWorkflow').setAttribute('checked', 'checked');
            } else {
                document.getElementById('checkboxManageRequestTypeDialog_HasWorkflow').removeAttribute('checked');
            }

            if (isActive == 'true') {
                document.getElementById('checkboxManageRequestTypeDialog_Active').setAttribute('checked', 'checked');
            } else {
                document.getElementById('checkboxManageRequestTypeDialog_Active').removeAttribute('checked');
            }

            //
            // ToDo: Add the click event to this Save button!
            //
            $("#divManageRequestTypeDialog").dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '500',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divManageRequestTypeDialog").dialog('close');
                    });
                },
                close: function () {
                    $('#divManageRequestTypeDialog').dialog('destroy');
                }
            });
            //$("#divManageRequestTypeDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            $('#divManageRequestTypeDialogSubmitButton').off('click').click(function (error) {
                try {
                    console.log('In deleteARequestType.divManageRequestTypeDialogSubmitButton.click().');

                    var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                    var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                    var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
                    var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

                    var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                    var data = {
                        bwParticipantId_LoggedIn: participantId,
                        bwActiveStateIdentifier: activeStateIdentifier,
                        bwWorkflowAppId_LoggedIn: workflowAppId,

                        bwWorkflowAppId: workflowAppId,
                        bwRequestTypeId: bwRequestTypeId,
                        bwParticipantId: participantId,
                        bwParticipantEmail: participantEmail,
                        bwParticipantFriendlyName: participantFriendlyName
                    };

                    $.ajax({
                        url: thiz.options.operationUriPrefix + "_bw/DeleteRequestType",
                        type: 'POST',
                        data: data,
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        }
                    }).success(function (results) {
                        try {

                            if (results.status != 'SUCCESS') {

                                displayAlertDialog('ERROR: ' + results.message);

                            } else {

                                displayAlertDialog(results.message);

                                thiz.options.requestTypes = results.data;

                                $('#divManageRequestTypeDialog').dialog('close');
                                thiz.renderRequestTypeEditor();

                            }

                        } catch (e) {
                            console.log('Exception in deleteARequestType(): ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in deleteARequestType(): ' + e.message + ', ' + e.stack);
                        }
                    }).error(function (data, errorCode, errorMessage) {

                        console.log('Error in deleteARequestType(). errorMessage: ' + errorMessage + ', errorCode: ' + errorCode + ', data: ' + JSON.stringify(data));
                        displayAlertDialog('Error in deleteARequestType(). errorMessage: ' + errorMessage + ', errorCode: ' + errorCode + ', data: ' + JSON.stringify(data));

                    });

                } catch (e) {
                    console.log('Exception in deleteARequestType(): ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in deleteARequestType(): ' + e.message + ', ' + e.stack);
                }
            });

        } catch (e) {
            console.log('Exception in deleteARequestType(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in deleteARequestType(): ' + e.message + ', ' + e.stack);
        }
    },

    displayAlertDialog: function (errorMessage) {
        try {
            //debugger;
            var element = $("#divAlertDialog");
            $(element).find('#spanErrorMessage')[0].innerHTML = errorMessage;
            $(element).dialog({
                modal: true,
                resizable: false,
                //closeText: "Cancel",
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                //title: 'Add a New Person',
                width: '800',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divAlertDialog").dialog('close');
                    });
                },
                close: function () {
                    //$(this).dialog('destroy').remove();
                }
            });
            $(element).dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
        } catch (e) {
            console.log('Exception in bwAttachments.displayAlertDialog(): ' + e.message + ', ' + e.stack);
        }
    }


});