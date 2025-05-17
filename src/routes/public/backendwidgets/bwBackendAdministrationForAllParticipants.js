$.widget("bw.bwBackendAdministrationForAllParticipants", {
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
        This is the bwBackendAdministrationForAllParticipants.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        value: 0,
        //dialogType: null,
        json: null,
        store: null, // This is where we store our OrgRoles data.
        Canvas: null,
        CanvasContext: null,
        OnResizeDisplayValues: null,
        Checklists: null,
        bwTenantId: null,
        bwWorkflowAppId: null,
        bwOrgId: null,
        bwOrgName: null,
        bwEnabledRequestTypes: null, // An array of the following: ['Budget Request', 'Quote Request', 'Reimbursement Request', 'Recurring Expense', 'Capital Plan Project', 'Work Order']
        operationUriPrefix: null,
        ajaxTimeout: 15000,
        quill: null,
        displayWorkflowPicker: false,
        displayRoleIdColumn: false,
        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function (assignmentRowChanged_ElementId) {
        this.element.addClass("bwBackendAdministrationForAllParticipants");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {

            selfDiscoverOperationUri(thiz); // This sets this.options.operationUriPrefix correctly.

            this.renderAdmin();

            // 
            // Load this object first so we don't have to keep making web service calls.
            //
            //if (this.options.store != null) {
            //    //this.renderParticipantsEditor();
            //} else {
            //    // this.options.store was null, so go get it from the database.
            //    //
            //    var data = {
            //        "bwWorkflowId": workflowAppId
            //    };
            //    $.ajax({
            //        url: this.options.operationUriPrefix + "_bw/workflow/participants",
            //        type: "DELETE",
            //        contentType: 'application/json',
            //        data: JSON.stringify(data),
            //        success: function (pdata) {

            //            try {
            //                thiz.options.store = pdata;
            //                //thiz.renderParticipantsEditor();
            //            } catch (e) {
            //                console.log('Exception in bwParticipantsEditor._create().xx.Get:1: ' + e.message + ', ' + e.stack);
            //            }
            //        },
            //    }).fail(function (data) {
            //        //lpSpinner.Hide();
            //        debugger;
            //        console.log('In xx.fail(): ' + JSON.stringify(data));
            //        var msg;
            //        if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
            //            msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
            //        } else {
            //            msg = JSON.stringify(data);
            //        }
            //        alert('Exception in bwParticipantsEditor._create().xx.Get:2: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
            //        console.log('Exception in bwParticipantsEditor._create().xx.Get:2: ' + JSON.stringify(data));
            //        //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
            //        //var error = JSON.parse(data.responseText)["odata.error"];
            //        //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            //    });
            //}

            console.log('In bwBackendAdministrationForAllParticipants._create(). The Admin functionality has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwBackendAdministrationForAllParticipants: CANNOT RENDER THE ADMIN FUNCTIONALITY</span>';
            html += '<br />';
            html += '<span style="">Exception in bwBackendAdministrationForAllParticipants.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwBackendAdministrationForAllParticipants")
            .text("");
    },

    setXx: function (key, value) {

        this.options[key] = value;
        this._update();

    },

    cmdListAllParticipants: function () {
        try {
            console.log('In cmdListAllParticipants().');
            alert('In cmdListAllParticipants().');

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            $('#txtBwParticipants').empty();

            var data = {
                bwWorkflowAppId_LoggedIn: workflowAppId,
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier
            };
            $.ajax({
                url: webserviceurl + "/bwparticipantsfindall",
                type: "POST",
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (result) {
                    try {

                        if (result.status != 'SUCCESS') {

                            var msg = result.status + ': ' + result.message;
                            $('#txtBwParticipants').html(msg);
                            displayAlertDialog(msg);

                        } else {
                            var data = result.result;

                            var html = '';

                            for (var i = 0; i < data.length; i++) {
                                html += 'bwParticipantLogonType: ' + data[i].bwParticipantLogonType;
                                html += ', ';
                                html += 'bwParticipantLogonTypeUserId: ' + data[i].bwParticipantLogonTypeUserId;
                                html += ', ';
                                html += 'bwParticipantFriendlyName: ' + data[i].bwParticipantFriendlyName;
                                html += ', ';
                                html += 'bwParticipantEmail: ' + data[i].bwParticipantEmail;
                                html += ', ';
                                html += 'bwParticipantRole: ' + data[i].bwParticipantRole;
                                html += ', ';
                                html += 'bwTenantId: ' + data[i].bwTenantId;
                                html += ', ';
                                html += 'bwWorkflowAppId: ' + data[i].bwWorkflowAppId;
                                html += ', ';
                                html += 'bwParticipantId: ' + data[i].bwParticipantId;

                                html += ', ';
                                html += 'customLogonPasswordSalt: ' + data[i].customLogonPasswordSalt;
                                html += ', ';
                                html += 'customLogonPasswordHash: ' + data[i].customLogonPasswordHash;

                                html += ', ';
                                html += 'bwEmailNotificationFrequency: ' + data[i].bwEmailNotificationFrequency;

                                html += ', ';
                                html += 'bwEmailNotificationTypes: ' + data[i].bwEmailNotificationTypes;
                                html += ', ';
                                html += 'bwEmailAggregatorTwiceDailyFirstTime: ' + data[i].bwEmailAggregatorTwiceDailyFirstTime;
                                html += ', ';
                                html += 'bwEmailAggregatorTwiceDailySecondTime: ' + data[i].bwEmailAggregatorTwiceDailySecondTime;
                                html += ', ';
                                html += 'bwEmailAggregatorLastEmailSentTimestamp: ' + data[i].bwEmailAggregatorLastEmailSentTimestamp;

                                html += '\n\n';

                                //html += 'bwParticipantId:' + data[i].bwParticipantId + ', bwTenantId:' + data[i].bwParticipantTenantId + ' bwParticipantEmail:' + data[i].bwParticipantEmail + ' bwParticipantFriendlyName:' + data[i].bwParticipantFriendlyName + '<br/>';
                                //html += '';
                            }
                            html += 'DONE';
                            $('#txtBwParticipants').append(html);
                        }

                    } catch (e) {
                        console.log('Exception in cmdListAllParticipants():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in cmdListAllParticipants():2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in admin.js.cmdListAllParticipants():' + errorCode + ', ' + errorMessage);
                    displayAlertDialog('Error in admin.js.cmdListAllParticipants():' + errorCode + ', ' + errorMessage);
                }
            });
        } catch (e) {
            console.log('Exception in cmdListAllParticipants(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in cmdListAllParticipants(): ' + e.message + ', ' + e.stack);
        }
    },

    renderAdmin: function (assignmentRowChanged_ElementId) {
        try {
            console.log('In renderAdmin().');
            var thiz = this;

            var html = '';

            html += '<span id="spanCanvas2" style="padding:0;margin:0;"><canvas id="myCanvas" style="position:absolute;z-index:-1;border:1px solid aliceblue;"></canvas></span>';

            // The "Upload a new small circle image" dialog...
            html += '<div style="display:none;" id="divUploadANewSmallCircleImageDialog">'; //  overflow-x: hidden; 
            //html += '            <table style="width:100%;">';
            html += '            <table style="">';
            html += '                <tr>';
            html += '                    <td style="">';
            html += '                        <!--<span id="spanAttachmentsOfflineDialogTitle" style="color: #3f3f3f;font-size: 60pt;font-weight:bold;"></span>-->';
            html += '                        <!--<span id="divCreateRequestFormDialogContent" style="font-size:40pt;"></span>-->';
            html += '                        <span id="divUploadANewSmallCircleImageDialogContent">[divUploadANewSmallCircleImageDialogContent]</span>';
            html += '                    </td>';
            html += '                    <td style="width:9%;"></td>';
            html += '                    <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '                        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 120pt;font-weight:bold;" onclick="$(\'#divUploadANewSmallCircleImageDialog\').dialog(\'close\');">X</span>';
            html += '                    </td>';
            html += '                </tr>';
            html += '            </table>';
            html += '            <br /><br />';
            html += '            <!--<span id="spanErrorMessage" style="font-size:40pt;"></span><br /><br />-->';
            html += '            <!--<div id="divCreateRequestFormDialogCloseButton" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" onclick="$(\'#divUploadANewSmallCircleImageDialog\').dialog(\'close\');">';
            html += '                Close';
            html += '            </div>';
            html += '            <br /><br />-->';
            html += '        </div>';

            html += '<div style="display:none;" id="AddUserToOrganizationDialog">';
            html += '            <table style="width:100%;">';
            html += '                <tr>';
            html += '                    <td style="width:90%;">';
            html += '                        <span id="spanChangeUserRoleDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;"></span>';
            html += '                    </td>';
            html += '                    <td style="width:9%;"></td>';
            html += '                    <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '                        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#AddUserToOrganizationDialog\').dialog(\'close\');">X</span>';
            html += '                    </td>';
            html += '                </tr>';
            html += '            </table>';
            html += '            <br /><br />';
            html += '            <span id="spanChangeUserRoleDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 22pt;font-weight:bold;">Organization picker:</span><br /><br />';
            html += '            <span id="spanChangeUserRoleDialogOrganizationOwnerDropDown" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 22pt;font-weight:bold;">Organization picker:</span><br /><br />';
            //spanAdminTenantSelectListForDeleteDropDown
            html += '            <br /><br />';
            html += '            <span id="spanChangeUserRoleDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 22pt;font-weight:bold;">Security role picker:</span><br /><br />';
            html += '            <input type="radio" name="xxrbChangeUserRole" id="xxrbChangeUserRole1" value="vendor" disabled />&nbsp;<span style="font-style:italic;color:lightgray;"><span style="color:red;">Vendor or Partner (coming soon!)</span></span><br />';
            html += '            <input type="radio" name="rbAddUserToOrganizationSelectedSecurityRole" id="rbAddUserToOrganizationSelectedSecurityRole1" value="participant" />&nbsp;Participant<br />';
            html += '            <input type="radio" name="rbAddUserToOrganizationSelectedSecurityRole" id="rbAddUserToOrganizationSelectedSecurityRole1" value="archiveviewer" />&nbsp;Archive Viewer<br />';
            html += '            <input type="radio" name="rbAddUserToOrganizationSelectedSecurityRole" id="rbAddUserToOrganizationSelectedSecurityRole1" value="reportviewer" />&nbsp;Report Viewer<br />';
            html += '            <input type="radio" name="rbAddUserToOrganizationSelectedSecurityRole" id="rbAddUserToOrganizationSelectedSecurityRole1" value="configurationmanager" />&nbsp;Configuration Manager<br />';
            html += '            <br /><br />';
            html += '            <input type="checkbox" id="cbUserRoleDialogEmailMessage" />&nbsp;';
            html += '            <span id="spanUserRoleDialogEmailMessageText"></span>';
            html += '            <textarea id="txtUserRoleDialogEmailMessage" rows="4" cols="60"></textarea>';
            html += '            <br /><br />';
            html += '            <div id="btnUserRoleDialogChangeRole" class="divSignInButton" style="width:90%;text-align:center;line-height:0.8em;font-weight:bold;">';
            html += '                Add to Organization';
            html += '            </div>';
            html += '            <br /><br />';
            html += '            <div class="divSignInButton" style="width:90%;text-align:center;line-height:0.8em;font-weight:bold;" onclick="$(\'#AddUserToOrganizationDialog\').dialog(\'close\');">';
            html += '                Close';
            html += '            </div>';
            html += '            <br /><br />';
            html += '        </div>';

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

            //alert('xcx123424234 calling  webserviceurl + "/bwparticipantsfindall": webserviceurl: ' + webserviceurl);

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            var data = {
                bwWorkflowAppId_LoggedIn: workflowAppId,
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier
            };

            $.ajax({
                url: webserviceurl + "/bwparticipantsfindall",
                type: "POST",
                data: data,
                headers: { "Accept": "application/json; odata=verbose" },
                success: function (result) {
                    try {

                        var pdata = result.result;

                        html += '<table>';

                        html += '  <tr>';
                        html += '    <td style="text-align:left;vertical-align:top;" class="bwSliderTitleCell">';
                        html += '       Participants:&nbsp;';
                        html += '    </td>';
                        html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                        html += '       <table>';
                        html += '           <tr>';
                        html += '               <td>';



                        html += '<div style="height:480px;overflow-y:scroll;">';


                        //html += '                   <span id="spanSentEmails" style="font-weight:bold;color:#009933;"></span>';
                        html += '<table class="dataGridTable">';
                        html += '  <tr class="headerRow">';
                        html += '    <td></td>';
                        html += '    <td>Name</td>';
                        html += '    <td>Email</td>';
                        html += '    <td>Logon Provider</td>';
                        html += '    <td>Joined</td>';
                        html += '    <td>Security Role</td>';
                        html += '    <td>bwParticipantId</td>';
                        html += '    <td>Vetted</td>';
                        html += '    <td></td>';
                        html += '    <td></td>';
                        html += '    <td></td>';
                        html += '  </tr>';

                        var participantsImageFetchingInformation = [];
                        var alternatingRow = 'light'; // Use this to color the rows.
                        for (var i = 0; i < pdata.length; i++) {
                            var adminRoleMessage = '';
                            if (alternatingRow == 'light') {
                                html += '  <tr class="alternatingRowLight" style="cursor:pointer;" >';

                                html += '    <td onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayParticipantRoleMultiPickerInACircle\', true, \'' + 'btnEditRaciRoles_' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantFriendlyName + '\', \'' + pdata[i].bwParticipantEmail + '\');"><img id="participantsEditorParticipantsListItem_' + i + '" style="width:50px;height:50px;" src="' + thiz.options.operationUriPrefix + 'images/businesswoman2.png' + '" /></td>';
                                alternatingRow = 'dark';
                            } else {
                                html += '  <tr class="alternatingRowDark" style="cursor:pointer;" >';

                                html += '    <td onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayParticipantRoleMultiPickerInACircle\', true, \'' + 'btnEditRaciRoles_' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantFriendlyName + '\', \'' + pdata[i].bwParticipantEmail + '\');"><img id="participantsEditorParticipantsListItem_' + i + '" style="width:50px;height:50px;" src="' + thiz.options.operationUriPrefix + 'images/userimage.png' + '" /></td>';
                                alternatingRow = 'light';
                            }


                            // Use this to retrieve the images after the fact, farther below in this code.
                            var participantImageFetchingInformation = {
                                imageId: 'participantsEditorParticipantsListItem_' + i,
                                bwParticipantId: pdata[i].bwParticipantId
                            };
                            participantsImageFetchingInformation.push(participantImageFetchingInformation);


                            html += '    <td onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayParticipantRoleMultiPickerInACircle\', true, \'' + 'btnEditRaciRoles_' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantFriendlyName + '\', \'' + pdata[i].bwParticipantEmail + '\');">' + pdata[i].bwParticipantFriendlyName + '</td>';
                            html += '    <td onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayParticipantRoleMultiPickerInACircle\', true, \'' + 'btnEditRaciRoles_' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantFriendlyName + '\', \'' + pdata[i].bwParticipantEmail + '\');">' + pdata[i].bwParticipantEmail + '</td>';


                            var _logonType = pdata[i].bwParticipantLogonType;
                            if (_logonType == 'custom') {
                                _logonType = 'BudgetWorkflow.com';
                            } else if (_logonType == 'microsoft') {
                                _logonType = 'Microsoft';
                            }
                            html += '    <td onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayParticipantRoleMultiPickerInACircle\', true, \'' + 'btnEditRaciRoles_' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantFriendlyName + '\', \'' + pdata[i].bwParticipantEmail + '\');">' + _logonType + '</td>';


                            html += '    <td onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayParticipantRoleMultiPickerInACircle\', true, \'' + 'btnEditRaciRoles_' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantFriendlyName + '\', \'' + pdata[i].bwParticipantEmail + '\');">' + pdata[i].Created + '</td>';
                            //
                            // Check if this user is an admin. If so, reflect this in the UI.
                            //debugger;
                            //if (bwParticipantId_Admin) {
                            //    if (bwParticipantId_Admin == pdata[i].bwParticipantId) {
                            //        adminRoleMessage = ' / ADMIN';
                            //    }
                            //}
                            html += '    <td onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayParticipantRoleMultiPickerInACircle\', true, \'' + 'btnEditRaciRoles_' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantFriendlyName + '\', \'' + pdata[i].bwParticipantEmail + '\');">' + pdata[i].bwParticipantRole + adminRoleMessage + '</td>';


                            //bwParticipantId column.
                            html += '    <td onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayParticipantRoleMultiPickerInACircle\', true, \'' + 'btnEditRaciRoles_' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantFriendlyName + '\', \'' + pdata[i].bwParticipantEmail + '\');">' + pdata[i].bwParticipantId + '</td>';



                            //
                            // Vetted/bwHaveWeRecognizedThemAsANewUser is set to true when we have a credit card validation, we know them, or something of that sort.
                            //
                            if (Boolean(pdata[i].bwHaveWeRecognizedThemAsANewUser) == true) {
                                html += '<td><input id="markThisUserAsRecognized" type="checkbox" checked onchange="$(\'.bwBackendAdministrationForAllParticipants\').bwBackendAdministrationForAllParticipants(\'markThisUserAsRecognized_Onchange\', true, \'' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantFriendlyName + '\', \'' + pdata[i].bwParticipantEmail + '\', \'' + pdata[i].bwParticipantRole + '\', \'' + pdata[i].bwParticipantLogonType + '\');" /></td>';
                            } else {
                                html += '<td><input id="markThisUserAsRecognized" type="checkbox" onchange="$(\'.bwBackendAdministrationForAllParticipants\').bwBackendAdministrationForAllParticipants(\'markThisUserAsRecognized_Onchange\', false, \'' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantFriendlyName + '\', \'' + pdata[i].bwParticipantEmail + '\', \'' + pdata[i].bwParticipantRole + '\', \'' + pdata[i].bwParticipantLogonType + '\');" /></td>';
                            }


                            //if ((pdata[i].bwParticipantId == participantId) || (pdata[i].bwParticipantRole == 'owner')) {
                            //    html += '    <td id="btnEditRaciRoles_' + pdata[i].bwParticipantId + '">';
                            //    html += '    </td>';

                            //    //html += '    <td></td>'; // We need to be able to reassign the owner's responsibilities to someone else.
                            //    html += '    <td><button class="BwSmallButton" onclick="cmdDisplayReassignUserTasksDialog(\'' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantFriendlyName + '\', \'' + pdata[i].bwParticipantEmail + '\', \'' + pdata[i].bwParticipantRole + '\', \'' + pdata[i].bwParticipantLogonType + '\');">reassign<br />responsibilities (#)</button></td>';
                            //    html += '    <td></td>';
                            //} else {
                            html += '    <td><button class="BwSmallButton" onclick="$(\'.bwBackendAdministrationForAllParticipants\').bwBackendAdministrationForAllParticipants(\'addThisUserToAnOrganization\', \'' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantFriendlyName + '\', \'' + pdata[i].bwParticipantEmail + '\', \'' + pdata[i].bwParticipantRole + '\', \'' + pdata[i].bwParticipantLogonType + '\');">add this user to<br />an organization</button></td>';
                            //html += '    <td><button class="BwSmallButton" onclick="cmdDisplayReassignUserTasksDialog(\'' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantFriendlyName + '\', \'' + pdata[i].bwParticipantEmail + '\', \'' + pdata[i].bwParticipantRole + '\', \'' + pdata[i].bwParticipantLogonType + '\');">reassign<br />responsibilities (#)</button></td>';






                            // 2-1-2022
                            //html += '<td><button class="BwSmallButton" onclick="$(\'.bwCircleDialog\').bwCircleDialog(\'displaySpecifiedUserDropDownInACircle\', false, \'' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantFriendlyName + '\', \'' + pdata[i].bwParticipantEmail + '\', \'' + pdata[i].bwParticipantRole + '\', \'' + pdata[i].bwParticipantLogonType + '\');">Update Account Details</button></td>';
                            html += '<td><button class="BwSmallButton" onclick="$(\'.bwCircleDialog\').bwCircleDialog(\'displaySpecifiedUserProfileEditingInACircle\', true, \'' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantFriendlyName + '\', \'' + pdata[i].bwParticipantEmail + '\');">Update Account Details</button></td>';
                            // $('.bwCircleDialog').bwCircleDialog('displayLoggedInUserDropDownInACircle', true); //, 'btnEditRaciRoles_undefined'); //, participantId, 'Fred Flintstone', 'fred@budgetrequests.com');






                            //html += '    <td><img src="images/trash-can.png" onclick="cmdDisplayDeleteUserDialog(\'' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantFriendlyName + '\', \'' + pdata[i].bwParticipantEmail + '\', \'' + pdata[i].bwParticipantRole + '\', \'' + pdata[i].bwParticipantLogonType + '\');" title="Delete" style="cursor:pointer;" /></td>';
                            html += '<td></td>';
                            //}
                            html += '  </tr>';
                        }
                        html += '</table>';

                        html += '</div>';

                        html += '               </td>';
                        html += '           </tr>';
                        html += '       </table>';
                        html += '    </td>';
                        html += '  </tr>';

                        html += '</table>';

                        html += '<br />';

                        // Render the html.
                        thiz.element.html(html);

                    } catch (e) {
                        console.log('Exception in bwBackendAdministrationForAllParticipants.js.renderAdmin():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwBackendAdministrationForAllParticipants.js.renderAdmin():2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in bwBackendAdministrationForAllParticipants.js.renderAdmin():' + errorCode + ', ' + errorMessage);
                    displayAlertDialog('Error in bwBackendAdministrationForAllParticipants.js.renderAdmin():' + errorCode + ', ' + errorMessage);
                }
            });

        } catch (e) {
            console.log('Exception in bwBackendAdministrationForAllParticipants.js.renderAdmin(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwBackendAdministrationForAllParticipants.js.renderAdmin(): ' + e.message + ', ' + e.stack);
        }
    },

    markThisUserAsRecognized_Onchange: function (bwHaveWeRecognizedThemAsANewUser, bwParticipantId, bwParticipantFriendlyName, bwParticipantEmail, bwParticipantRole, bwParticipantLogonType) {
        try {
            console.log('In markThisUserAsRecognized_Onchange().');
            if (bwHaveWeRecognizedThemAsANewUser == true) {
                bwHaveWeRecognizedThemAsANewUser = false;
            } else {
                bwHaveWeRecognizedThemAsANewUser = true;
            }
            var json = {
                bwParticipantId: bwParticipantId,
                bwParticipantEmail: bwParticipantEmail,
                bwParticipantFriendlyName: bwParticipantFriendlyName,
                bwHaveWeRecognizedThemAsANewUser: bwHaveWeRecognizedThemAsANewUser
            };
            var operationUri = webserviceurl + "/updatethisuserasrecognized";
            $.ajax({
                url: operationUri,
                type: "POST",
                timeout: ajaxTimeout,
                data: json,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    console.log('In markThisUserAsRecognized_Onchange(). ' + data);
                    if (data != 'SUCCESS') {
                        displayAlertDialog(data);
                    } else {
                        console.log('In markThisUserAsRecognized_Onchange(). Set bwHaveWeRecognizedThemAsANewUser to: ' + bwHaveWeRecognizedThemAsANewUser);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in markThisUserAsRecognized_Onchange(): ' + errorCode + ' ' + errorMessage);
                }
            });
        } catch (e) {
            console.log('Exception in markThisUserAsRecognized_Onchange(): ' + e.message + ', ' + e.stack);
        }
    },


    addThisUserToAnOrganization: function (bwParticipantId, bwParticipantFriendlyName, bwParticipantEmail, currentRole, logonType) {
        try {
            console.log('In addThisUserToAnOrganization(): ' + bwParticipantFriendlyName + '(' + bwParticipantEmail + ').');
            var thiz = this;

            //alert('In addThisUserToAnOrganization(): ' + bwParticipantFriendlyName + '(' + bwParticipantEmail + ').'); // AddUserToOrganizationDialog

            $("#AddUserToOrganizationDialog").dialog({
                modal: true,
                resizable: false,
                closeText: "Cancel",
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                //title: 'Change the role for ' + userFriendlyName + '...',
                width: "570px",
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function (event, ui) {
                    $('.ui-widget-overlay').bind('click', function () { $("#AddUserToOrganizationDialog").dialog('close'); });

                    // List all of the Tenants/WorkflowApps in the drop down.
                    $.ajax({
                        url: thiz.options.operationUriPrefix + "_bw/bwtenantsfindall",
                        type: "POST",
                        contentType: 'application/json',
                        success: function (tenants) {
                            $.ajax({
                                url: thiz.options.operationUriPrefix + "_bw/bwworkflowapps",
                                type: "POST",
                                contentType: 'application/json',
                                success: function (workflowApps) {

                                    var html = '';
                                    html += '<select id="selectChangeUserRoleDialogOrganizationOwnerDropDown">';
                                    for (var i = 0; i < tenants.length; i++) {
                                        for (var w = 0; w < workflowApps.length; w++) {
                                            if (tenants[i].bwTenantId == workflowApps[w].bwTenantId) {
                                                html += '<option value="' + workflowApps[w].bwWorkflowAppId + '|' + workflowApps[w].bwWorkflowAppTitle + '" >' + workflowApps[w].bwWorkflowAppTitle + ': ' + tenants[i].bwTenantOwnerFriendlyName + ' (' + tenants[i].bwTenantOwnerEmail + ')</option>'; // data[i].bwWorkflows: [{ id: String, title: String, url: String }],
                                            }
                                        }
                                    }
                                    html += '</select>';
                                    document.getElementById('spanChangeUserRoleDialogOrganizationOwnerDropDown').innerHTML = html;

                                    $('#btnUserRoleDialogChangeRole').bind('click', function () {
                                        //debugger;
                                        thiz.addUserToOrganizationAndSendEmail(bwParticipantId, bwParticipantFriendlyName, bwParticipantEmail, logonType);
                                        //$("#AddUserToOrganizationDialog").dialog('close');
                                    });

                                },
                                error: function (data, errorCode, errorMessage) {
                                    displayAlertDialog('Error in bwBackendAdministrationForAllParticipants.addThisUserToAnOrganization.bwworkflowapps():' + errorCode + ', ' + errorMessage);
                                }
                            });

                        },
                        error: function (data, errorCode, errorMessage) {
                            displayAlertDialog('Error in bwBackendAdministrationForAllParticipants.addThisUserToAnOrganization.bwtenantsfindall():' + errorCode + ', ' + errorMessage);
                        }
                    });


                }
            });
            // Hide the title bar.
            $("#AddUserToOrganizationDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
            // Set the title.
            document.getElementById('spanChangeUserRoleDialogTitle').innerHTML = 'Add ' + bwParticipantFriendlyName + ' to an additional Organization.';

            // Make sure the send message checkbox is not selected to begin with.
            document.getElementById('cbUserRoleDialogEmailMessage').removeAttribute('checked', '');
            // Set the radio button selected to the current value.
            var roles = document.getElementsByName('rbChangeUserRole');
            for (var i = 0; i < roles.length; i++) {
                if (roles[i].value == currentRole) {
                    roles[i].checked = true;
                }
            }
            // Checkbox message customized with user name.
            var msg = 'Send email notification to ' + bwParticipantFriendlyName + ' (' + bwParticipantEmail + '). You can include an additional message as well:';
            $('#spanUserRoleDialogEmailMessageText').text(msg);
            // Event listener for the email checkbox.
            $('#cbUserRoleDialogEmailMessage').click(function (error) {
                //displayAlertDialog('it was clicked');
                var _checked = document.getElementById('cbUserRoleDialogEmailMessage').checked;
                if (_checked == true) {
                    var dialogButtons = $('#ChangeUserRoleDialog').dialog('option', 'buttons');
                    $.each(dialogButtons, function (buttonIndex, button) {
                        if (button.id === 'btnUserRoleDialogChangeRole') {
                            button.text = 'Change Role and Send Email';
                            button.style = 'color:red;';
                        }
                    })
                    $("#ChangeUserRoleDialog").dialog('option', 'buttons', dialogButtons);
                } else {
                    var dialogButtons = $('#ChangeUserRoleDialog').dialog('option', 'buttons');
                    $.each(dialogButtons, function (buttonIndex, button) {
                        if (button.id === 'btnUserRoleDialogChangeRole') {
                            button.text = 'Change Role';
                            button.style = 'color:red;';
                        }
                    })
                    $("#ChangeUserRoleDialog").dialog('option', 'buttons', dialogButtons);
                }
            });
            // Event listener for the radio buttons.
            $("input:radio[name=rbChangeUserRole]").click(function (error) {
                if (this.value == currentRole) {
                    // Make sure the button is disabled.
                    var dialogButtons = $('#ChangeUserRoleDialog').dialog('option', 'buttons');
                    $.each(dialogButtons, function (buttonIndex, button) {
                        if (button.id === 'btnUserRoleDialogChangeRole') {
                            button.disabled = true;
                        }
                    })
                    $("#ChangeUserRoleDialog").dialog('option', 'buttons', dialogButtons);
                } else {
                    // Enable the Change Role button.
                    var dialogButtons = $('#ChangeUserRoleDialog').dialog('option', 'buttons');
                    $.each(dialogButtons, function (buttonIndex, button) {
                        if (button.id === 'btnUserRoleDialogChangeRole') {
                            button.disabled = false;
                        }
                    })
                    $("#ChangeUserRoleDialog").dialog('option', 'buttons', dialogButtons);
                }
            });



        } catch (e) {
            console.log('Exception in addThisUserToAnOrganization(): ' + e.message + ', ' + e.stack);
        }
    },

    addUserToOrganizationAndSendEmail: function (bwParticipantId, bwParticipantFriendlyName, bwParticipantEmail, logonType) {
        try {
            console.log('In addUserToOrganizationAndSendEmail().'); // Related to this function: addNewPersonAndSendEmailNotification().
            var thiz = this;

            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            $("#AddUserToOrganizationDialog").dialog('close');
            // Get the Organization (bwWorkflowAppId) value from selectChangeUserRoleDialogOrganizationOwnerDropDown
            var appIdAndAppTitle = $('#selectChangeUserRoleDialogOrganizationOwnerDropDown option:selected').val();
            var bwWorkflowAppId = appIdAndAppTitle.split('|')[0]; //$('#selectChangeUserRoleDialogOrganizationOwnerDropDown option:selected').val();
            var bwWorkflowAppTitle = appIdAndAppTitle.split('|')[1];
            // Get the security role.
            var selectedRole;
            var roles = document.getElementsByName('rbAddUserToOrganizationSelectedSecurityRole');
            for (var i = 0; i < roles.length; i++) {
                if (roles[i].checked) selectedRole = roles[i].value;
            }
            if (!selectedRole) {
                alert('You must select a security role before ading a participant to an Organization.');
            } else {
                //
                var userInfo = {
                    bwWorkflowAppId: bwWorkflowAppId,
                    bwWorkflowAppTitle: bwWorkflowAppTitle,
                    securityRole: selectedRole,
                    bwParticipantId: participantId,
                    bwParticipantFriendlyName: participantFriendlyName,
                    bwParticipantEmail: participantEmail,
                    logonType: logonType
                }
                var operationUri = this.options.operationUriPrefix + "_bw/organization/addausertoaneworganization";
                $.ajax({
                    url: operationUri,
                    type: "POST",
                    data: userInfo,
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    },
                    success: function (data) {
                        if (data.message == 'This email address is already in use') {
                            thiz.displayAlertDialog('This email address is already registered with us. Please enter a different one, or login using the existing credentials.');
                            document.getElementById('txtAddANewPersonDialogEmail').focus();
                        } else if (data.message == 'SUCCESS') {


                            //participantId = data.participant.bwParticipantId;
                            //participantFriendlyName = data.participant.bwParticipantFriendlyName;
                            //participantEmail = data.participant.bwParticipantEmail;
                            //tenantId = data.participant.bwTenantId;
                            //workflowAppId = data.participant.bwLastSelectedWorkflowAppId;
                            //workflowAppTitle = data.participant.bwWorkflowAppTitle;
                            //participantLogonType = 'custom';
                            //participantLogonTypeUserId = participantId;

                            //emailNotificationFrequency = data.participant.bwEmailNotificationFrequency;
                            //emailNotificationTypes = data.participant.bwEmailNotificationTypes;

                            //if (data.participant.bwTipsDisplayOn == 'true') tipsDisplayOn = true;
                            //else tipsDisplayOn = false;

                            //if (data.participant.bwInvitationsOnHomePageDisplayOn == 'true') displayInvitationsOnHomePageDisplayOn = true;
                            //else displayInvitationsOnHomePageDisplayOn = false;

                            thiz.displayAlertDialog('The person has been added successfully, and they have been notified.');
                            //$('#divAddANewPersonDialog').dialog('close'); // Close the sign in dialog.
                            $('#divAddANewPersonDialog').dialog('close'); // Close the create your account dialog.
                            //initializeTheForm();
                        } else {
                            thiz.displayAlertDialog(data.message);
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        //handleExceptionWithAlert('Error in Start.js.displayConnectedWorkflows()', '1:' + errorCode + ', ' + errorMessage);
                        thiz.displayAlertDialog('Error in bwCoreComponent.js.addUserToOrganizationAndSendEmail().registeranewuser: ' + errorMessage);
                    }
                });

            }

        } catch (e) {
            console.log('Exception in addUserToOrganizationAndSendEmail(): ' + e.message + ', ' + e.stack);
        }
    },


    displayAlertDialog: function (errorMessage) {
        try {
            document.getElementById('spanErrorMessage').innerHTML = errorMessage;
            $("#divAlertDialog").dialog({
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
            $("#divAlertDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
        } catch (e) {
            console.log('Exception in bwBackendAdministrationForAllParticipants.js.displayAlertDialog(): ' + e.message + ', ' + e.stack);
        }
    }


});