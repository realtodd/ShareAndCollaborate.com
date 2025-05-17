$.widget("bw.bwResubscribeUserEmailEditor", {
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
        This is the bwResubscribeUserEmailEditor.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        CurrentEmailTemplate: {
            EmailTemplate: {
                Subject: null,
                Body: null
            },
            DraftEmailTemplate: {
                Subject: null,
                Body: null
            }
        },

        value: 0,
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


        //quill: null, // was this used somewhere? 6-29-2020
        quill: null, // Email body editor.
        quillSubjectEditor: null, // Email subject editor.





        displayOrgRolesPicker: false, //true, // Should be false by default but this is good for now.
        displayRoleIdColumn: false,
        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function (assignmentRowChanged_ElementId) {
        //debugger;
        this.element.addClass("bwResubscribeUserEmailEditor");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {
            console.log('In bwResubscribeUserEmailEditor._create().');

            selfDiscoverOperationUri(thiz); // This sets this.options.operationUriPrefix correctly.

            //$.ajax({
            //    url: this.options.operationUriPrefix + "_bw/NewTenantIntroductoryEmailSettings",
            //    dataType: "json",
            //    contentType: "application/json",
            //    type: "Get",
            //    timeout: thiz.options.ajaxTimeout
            //}).done(function (result) {
            //    try {
            //        if (result.message != 'SUCCESS') {
            //            alert('ERROR: ' + result.message);
            //        } else {
            //            //debugger;
            //            thiz.options.CurrentEmailTemplate.EmailTemplate = JSON.parse(result.EmailTemplate);
            //            thiz.options.CurrentEmailTemplate.DraftEmailTemplate = JSON.parse(JSON.stringify(thiz.options.CurrentEmailTemplate.EmailTemplate));
            //            //debugger;
            thiz.renderEmailEditor();
            //        }
            //    } catch (e) {
            //        console.log('Exception in bwWorkflowEditor._create().xx.Get:1: ' + e.message + ', ' + e.stack);
            //    }
            //}).fail(function (data) {
            //    console.log('In xx1.fail(): ' + JSON.stringify(data));
            //    var msg;
            //    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
            //        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
            //    } else {
            //        msg = JSON.stringify(data);
            //    }
            //    alert('Exception in bwWorkflowEditor._create().xx.Get:2: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
            //    console.log('Exception in bwWorkflowEditor._create().xx.Get:2: ' + JSON.stringify(data));
            //    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
            //    //var error = JSON.parse(data.responseText)["odata.error"];
            //    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            //});
        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwResubscribeUserEmailEditor: CANNOT RENDER</span>';
            html += '<br />';
            html += '<span style="">Exception in bwResubscribeUserEmailEditor.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwResubscribeUserEmailEditor")
            .text("");
    },


    renderEmailEditor: function () {
        try {
            //debugger; // 9-5-2021
            console.log('In renderEmailEditor().');
            var thiz = this;
            var html = '';

            html += '<div style="display:none;" id="divEmailDataItemPickerDialog">';
            html += '  <table style="width:100%;">';
            html += '    <tr>';
            html += '      <td style="width:90%;">';
            html += '        <span id="spanEmailDataItemPickerDialog" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Insert a data item</span>';
            html += '                    <br />';
            html += '                    <span id="spanEmailDataItemPickerDialogSubTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:normal;">[spanEmailDataItemPickerDialogSubTitle]</span>';
            html += '      </td>';
            html += '      <td style="width:9%;"></td>';
            html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divEmailDataItemPickerDialog\').dialog(\'close\');">X</span>';
            html += '      </td>';
            html += '    </tr>';
            html += '  </table>';
            html += '  <br /><br />';
            html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '  <span id="spanEmailDataItemPickerDialogContentTop">[spanEmailDataItemPickerDialogContentTop]</span>';
            html += '    <br />';
            html += '    <br />';
            html += '    <br />';
            html += '    <span id="spanEmailDataItemPickerDialogContentBottom" style="font-weight:bold;cursor:pointer;">';
            //html += '      [spanEmailDataItemPickerDialogContentBottom]';
            html += '    </span>';
            html += '  <br /><br />';
            html += '</div>';


            html += '   <div style="display:none;" id="divUndoResubscribeUserEmailTemplateActivationDialog">';
            html += '       <table style="width:100%;">';
            html += '           <tr>';
            html += '               <td style="width:90%;">';
            html += '                   <span id="spanUndoWorkflowActivationTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Resubscribe Email ACTIVATED</span>';
            html += '               </td>';
            html += '               <td style="width:9%;"></td>';
            html += '               <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '                   <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divUndoResubscribeUserEmailTemplateActivationDialog\').dialog(\'close\');">X</span>';
            html += '               </td>';
            html += '           </tr>';
            html += '       </table>';
            html += '       <br /><br />';
            html += '       <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '       <span id="spanUndoWorkflowActivationContentcccxxxccc" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:20pt;">';
            html += '       This new user introductory email has been activated and will immediately impact the future processes. Please keep an eye on potential issues related to your change(s). ';
            html += '       <br />';
            html += '       <br />';
            html += '       <br />';
            html += '       <span style="font-weight:bold;cursor:pointer;">';
            html += '           You can change the "Active Resubscribe Email" using the drop-down at the top of this page any time';
            html += '       </span>';
            html += '       </span>';
            html += '       <br /><br />';
            html += '   </div>';


            // "New user introductory email" configuration dialog.
            html += '<div style="display:none;" id="divConfigureResubscribeUserEmailsDialog">';
            html += '   <table style="width:100%;">';
            html += '       <tr>';
            html += '           <td style="width:90%;">';
            html += '               <span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:30pt;font-weight:bold;">Configure "Resubscribe Email"</span>';
            html += '<span title="Resubscribe Email maintenance..." style="width:200px;padding:5px 10px 5px 10px;margin:0 0 0 10px;white-space:nowrap;vertical-align:middle;border:1px solid lightblue;cursor:pointer;font-weight:normal;font-size:10pt;" onclick="$(\'.bwResubscribeUserEmailEditor\').bwResubscribeUserEmailEditor(\'displayWorkflowsConfigurationDialog\');"><span style="display:inline-block;"> ⚙ </span></span>';
            html += '               <br />';
            html += '               <span id="spanConfigureEmailNotificationsDialogSubTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:normal;">[spanConfigureEmailNotificationsDialogSubTitle]</span>';
            html += '           </td>';
            html += '           <td style="width:9%;"></td>';
            html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divConfigureResubscribeUserEmailsDialog\').dialog(\'close\');">X</span>';
            html += '           </td>';
            html += '       </tr>';
            html += '   </table>';
            html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '   <br />';
            //// Publish message and button.
            //html += '<table>';
            //html += '<tr>';
            //html += '  <td>';
            //html += '';
            //html += '  </td>';
            //html += '  <td style="text-align:right;">';
            //html += '    <span id="spanThereAreChangesToPublishText4" style="font-style:italic;color:tomato;"></span>'; //<input value=" There are unsaved changes. Enter a description here and click Save..." type="text" id="txtNewWorkflowDescription" style="width:450px;color:grey;font-style:italic;padding:5px 5px 5px 5px;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewWorkflowDescriptionTextBox_Onkeyup\');" />';
            //html += '  </td>';
            //html += '  <td>';
            //html += '    <span id="spanThereAreChangesToPublishButton4"></span>';
            //html += '  </td>';
            //html += '</tr>';
            //html += '</table>';
            //html += '   <span id="spanConfigureEmailNotificationsDialogSelectEditEmailForDropdown">[spanConfigureEmailNotificationsDialogSelectEditEmailForDropdown]</span>';
            //html += '   <br />';
            //html += '   <br />';
            // Quill subject editor.
            html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
            html += 'Subject line:';
            html += '</span>';
            html == '<br />';
            //html += '   <div id="bwQuilltoolbarForSubject">';
            //html += '       <button id="btnQuill_InsertADataItemForSubject" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
            //html += '   </div>';


            //html += '   <div id="quillConfigureResubscribeUserEmailsDialog_Subject" style="height:50px;"></div>'; // Quill.
            html += '<input type="text" id="quillConfigureResubscribeUserEmailsDialog_Subject" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';




            // Quill body editor.
            html += '<br />';
            html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
            html += 'Body: xcx7';
            html += '</span>';
            html == '<br />';
            html += '   <div id="bwQuilltoolbar">';
            html += '       <button id="btnQuill_InsertADataItem" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
            html += '       <select class="ql-size">';
            html += '           <option value="small"></option>';
            html += '           <option selected></option>';
            html += '           <option value="large"></option>';
            html += '           <option value="huge"></option>';
            html += '       </select>';
            html += '       <button class="ql-bold"></button>';
            html += '       <button class="ql-script" value="sub"></button>';
            html += '       <button class="ql-script" value="super"></button>';
            html += '   </div>';
            html += '   <div id="quillConfigureResubscribeUserEmailsDialog_Body" style="height:375px;"></div>'; // Quill.
            // Save button.
            //html += '   <br />';
            //html += '   <span id="spanConfigureEmailNotificationsDialogSaveButton">[spanConfigureEmailNotificationsDialogSaveButton]</span>'; // ☑ 
            html += '   <br /><br />';
            // Preview/Edit button.
            //html += '   <div id="divResubscribeUserEmailEditor_PreviewAndEditButton" class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;"></div>';
            //html += '   <br /><br />';

            html += '   <div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" onclick="$(\'.bwResubscribeUserEmailEditor\').bwResubscribeUserEmailEditor(\'publishEmailTemplateConfigurationAndActivate\');">';
            html += '   ☑ Publish this email template';
            html += '   </div>';
            html += '   <br /><br />';

            html += '</div>';

            // Render the html.
            this.element.html(html);

            //var button = document.getElementById('divResubscribeUserEmailEditor_PreviewAndEditButton');
            //button.innerHTML = '       ❐ Edit email HTML';
            //$(button).unbind('click').click(function (error) {
            //    try {
            //        console.log('In renderEmailEditor.divResubscribeUserEmailEditor_PreviewAndEditButton.click().');
            //        thiz.editEmail();
            //    } catch (e) {
            //        console.log('Exception in renderEmailEditor.divResubscribeUserEmailEditor_PreviewAndEditButton.click(): ' + e.message + ', ' + e.stack);
            //    }
            //});



            // List all of the Tenants/WorkflowApps in the drop down.
            //$.ajax({
            //    url: thiz.options.operationUriPrefix + "_bw/bwtenantsfindall",
            //    type: "DELETE",
            //    contentType: 'application/json',
            //    success: function (tenants) {
            //        $.ajax({
            //            url: thiz.options.operationUriPrefix + "_bw/bwworkflowapps",
            //            type: "DELETE",
            //            contentType: 'application/json',
            //            success: function (workflowApps) {

            //                var html = '';
            //                html += '<select id="selectChangeUserRoleDialogOrganizationOwnerDropDown2" style="vertical-align:top;padding:5px 5px 5px 5px;">';
            //                html += '<option value="" >Select a Tenant/Organization...</option>'; // data[i].bwWorkflows: [{ id: String, title: String, url: String }],
            //                for (var i = 0; i < tenants.length; i++) {
            //                    for (var w = 0; w < workflowApps.length; w++) {
            //                        if (tenants[i].bwTenantId == workflowApps[w].bwTenantId) {
            //                            html += '<option value="' + workflowApps[w].bwWorkflowAppId + '|' + workflowApps[w].bwWorkflowAppTitle + '" >' + workflowApps[w].bwWorkflowAppTitle + ': ' + tenants[i].bwTenantOwnerFriendlyName + ' (' + tenants[i].bwTenantOwnerEmail + ')</option>'; // data[i].bwWorkflows: [{ id: String, title: String, url: String }],
            //                        }
            //                    }
            //                }
            //                html += '</select>';
            //                document.getElementById('spanChangeUserRoleDialogOrganizationOwnerDropDown2').innerHTML = html;

            //                var html = '';
            //                html += '<select id="selectChangeUserRoleDialogOrganizationOwnerDropDown3" style="vertical-align:top;padding:5px 5px 5px 5px;">';
            //                html += '<option value="" >Select a Tenant/Organization...</option>'; // data[i].bwWorkflows: [{ id: String, title: String, url: String }],
            //                for (var i = 0; i < tenants.length; i++) {
            //                    for (var w = 0; w < workflowApps.length; w++) {
            //                        if (tenants[i].bwTenantId == workflowApps[w].bwTenantId) {
            //                            html += '<option value="' + workflowApps[w].bwTenantId + '|' + workflowApps[w].bwWorkflowAppTitle + '" >' + workflowApps[w].bwWorkflowAppTitle + ': ' + tenants[i].bwTenantOwnerFriendlyName + ' (' + tenants[i].bwTenantOwnerEmail + ')</option>'; // data[i].bwWorkflows: [{ id: String, title: String, url: String }],
            //                        }
            //                    }
            //                }
            //                html += '</select>';
            //                document.getElementById('spanLogInAsTenantOrganizationOwnerDropDown').innerHTML = html;

            //                //$('#btnUserRoleDialogChangeRole').bind('click', function () {
            //                //    //debugger;
            //                //    thiz.addUserToOrganizationAndSendEmail(bwParticipantId, bwParticipantFriendlyName, bwParticipantEmail, logonType);
            //                //    //$("#AddUserToOrganizationDialog").dialog('close');
            //                //});

            //            },
            //            error: function (data, errorCode, errorMessage) {
            //                displayAlertDialog('Error in bwBackendAdministrationForAllParticipants.addThisUserToAnOrganization.bwworkflowapps():' + errorCode + ', ' + errorMessage);
            //            }
            //        });

            //    },
            //    error: function (data, errorCode, errorMessage) {
            //        displayAlertDialog('Error in bwBackendAdministrationForAllParticipants.addThisUserToAnOrganization.bwtenantsfindall():' + errorCode + ', ' + errorMessage);
            //    }
            //});

        } catch (e) {
            console.log('Exception in renderEmailEditor(): ' + e.message + ', ' + e.stack);
        }
    },

    previewEmailHtml: function () {
        try {
            console.log('In previewEmailHtml().');
            var thiz = this;
            var button = document.getElementById('divResubscribeUserEmailEditor_PreviewAndEditButton');
            button.innerHTML = '       ❐ Edit email HTML';
            $(button).unbind('click').click(function (error) {
                try {
                    console.log('In previewEmail.divResubscribeUserEmailEditor_PreviewAndEditButton.click().');
                    thiz.editEmailHtml();
                } catch (e) {
                    console.log('Exception in previewEmail.divResubscribeUserEmailEditor_PreviewAndEditButton.click(): ' + e.message + ', ' + e.stack);
                }
            });

            var emailHtml = thiz.options.quill.getText();
            this.options.quill.container.firstChild.innerHTML = '';
            this.options.quill.clipboard.dangerouslyPasteHTML(0, emailHtml);

            this.options.CurrentEmailTemplate.DraftEmailTemplate.Body = emailHtml;
            //this.checkIfWeHaveToDisplayThePublishChangesButton();
        } catch (e) {
            console.log('Exception in previewEmailHtml(): ' + e.message + ', ' + e.stack);
        }
    },
    editEmailHtml: function () {
        try {
            console.log('In editEmailHtml().');
            var thiz = this;
            var button = document.getElementById('divResubscribeUserEmailEditor_PreviewAndEditButton');
            button.innerHTML = '       ❏ Preview this email';
            $(button).unbind('click').click(function (error) {
                try {
                    console.log('In editEmailHtml.divResubscribeUserEmailEditor_PreviewAndEditButton.click().');
                    thiz.previewEmailHtml();
                } catch (e) {
                    console.log('Exception in editEmailHtml.divResubscribeUserEmailEditor_PreviewAndEditButton.click(): ' + e.message + ', ' + e.stack);
                }
            });
            var emailHtml = thiz.options.quill.container.firstChild.innerHTML;
            thiz.options.quill.container.firstChild.innerHTML = '';
            debugger; // CHECK TO SEE if this looks right. 11-4-2021
            thiz.options.quill.setText(emailHtml);

            thiz.options.CurrentEmailTemplate.DraftEmailTemplate.Body = emailHtml;
            //this.checkIfWeHaveToDisplayThePublishChangesButton();
        } catch (e) {
            console.log('Exception in editEmailHtml(): ' + e.message + ', ' + e.stack);
        }
    },

    displayConfigureResubscribeEmailDialog: function () {
        try {
            console.log('In displayConfigureResubscribeEmailDialog().');
            debugger;
            var thiz = this;
            // Hit the database and get the introductory email for this organization/workflowApp.

            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            var json = {
                bwParticipantId: participantId,
                bwParticipantEmail: participantEmail,
                bwParticipantFriendlyName: participantFriendlyName
            }

            $.ajax({
                url: this.options.operationUriPrefix + "_bw/UserResubscribeEmailSettings/",  // "_bw/UserUnsubscribeEmailSettings/", // Added this widget 12-21-2022. Copied from /UserUnsubscribeEmailSettings widget.
                dataType: "json",
                contentType: "application/json",
                type: "Post",
                data: JSON.stringify(json)
            }).done(function (result) {
                try {
                    if (result.message != 'SUCCESS') {
                        alert('ERROR: ' + result.message);
                    } else {
                        // Set the dialog sub title.
                        var html = '';
                        html += 'This email gets sent to a User when they resubscribe to BudgetWorkflow.com.';

                        document.getElementById('spanConfigureEmailNotificationsDialogSubTitle').innerHTML = html;

                        //
                        // Set the "Save" button.
                        //
                        //var html = '';
                        //html += '<div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" onclick="alert(\'This functionality is incomplete. Coming soon!\');">';
                        //html += '☑ Save this email template';
                        //html += '</div>';
                        //document.getElementById('spanConfigureEmailNotificationsDialogSaveButton').innerHTML = html;
                        // Display the email editor.
                        $("#divConfigureResubscribeUserEmailsDialog").dialog({
                            modal: true,
                            resizable: false,
                            //closeText: "Cancel",
                            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                            //title: 'divConfigureResubscribeUserEmailsDialog',
                            width: '900',
                            dialogClass: 'no-close', // No close button in the upper right corner.
                            hide: false, // This means when hiding just disappear with no effects.
                            open: function () {
                                try {
                                    $('.ui-widget-overlay').bind('click', function () {
                                        $('#divConfigureResubscribeUserEmailsDialog').dialog('close');
                                    });




                                    var emailTemplateForSubject;
                                    var emailTemplate;

                                    if (result.bwIntroductoryEmailHtml) {
                                        try {
                                            debugger;
                                            // Yay, we got the email template from the database for this organization/workflowApp.
                                            emailTemplate = JSON.parse(result.bwIntroductoryEmailHtml);
                                            emailTemplateForSubject = emailTemplate.Subject;
                                            emailTemplate = emailTemplate.Body;
                                        } catch (e) {
                                            //console.log();
                                            //alert();
                                            emailTemplateForSubject = '[corrupted subject]';
                                            emailTemplate = '[corrupted body]';
                                        }
                                    } else {
                                        alert('No email template was provided!!! xcx9927-2');
                                        emailTemplateForSubject = '[no subject]';
                                        emailTemplate = '[no body]';
                                    }



                                    //try {
                                    //$(thiz.element).find('#displayedemaildetails')[0].setAttribute('bwSentEmailId', bwEmailId);

                                    // Hook up this button event so that the user can insert data items into the email.
                                    //var customButton1 = document.querySelector('#btnQuill_InsertADataItemForSubject');
                                    //customButton1.addEventListener('click', function () {
                                    //    //console.log('btnQuill_InsertADataItem: This functionality is incomplete. Coming soon!');
                                    //    thiz.displayEmailDataItemPickerDialog('subject');
                                    //});

                                    $($('#divConfigureResubscribeUserEmailsDialog').find('#quillConfigureResubscribeUserEmailsDialog_Body')[0]).summernote({
                                        placeholder: '', //emailTemplate, //data[0].Body, //'Hello stand alone ui',
                                        tabsize: 2,
                                        height: 400,
                                        //airMode: true,
                                        toolbar: [
                                            ['style', ['style']],
                                            ['font', ['bold', 'underline', 'clear']],
                                            ['color', ['color']],
                                            ['para', ['ul', 'ol', 'paragraph']],
                                            ['table', ['table']],
                                            ['insert', ['link']], //, 'picture', 'video']],
                                            ['view', ['codeview', 'help']]
                                        ]
                                    });

                                    // Hook up this button event so that the user can insert data items into the email.
                                    var customButton = $('#divConfigureResubscribeUserEmailsDialog').find('#btnQuill_InsertADataItem')[0]; //document.querySelector('#btnQuill_InsertADataItem'); //
                                    customButton.addEventListener('click', function () {
                                        console.log('In viewPendingEmail.quill.customButton.click().')
                                        //console.log('btnQuill_InsertADataItem: This functionality is incomplete. Coming soon!');
                                        //thiz.displayEmailDataItemPickerDialog('body');
                                    });

                                    //var emailTemplateForSubject = data[0].Subject; //thiz.options.CurrentEmailTemplate.EmailTemplate.Subject;
                                    //var emailTemplate = data[0].Body; //thiz.options.CurrentEmailTemplate.EmailTemplate.Body;

                                    if (emailTemplateForSubject && emailTemplateForSubject != '') {
                                        //$('#divConfigureResubscribeUserEmailsDialog').find('#quillConfigureResubscribeUserEmailsDialog_Subject')[0].value = emailTemplateForSubject;
                                        $('#divConfigureResubscribeUserEmailsDialog').find('#quillConfigureResubscribeUserEmailsDialog_Subject')[0].value = emailTemplateForSubject;
                                    } else {
                                        //$('#divConfigureResubscribeUserEmailsDialog').find('#quillConfigureResubscribeUserEmailsDialog_Subject')[0].value = '';
                                        $('#divConfigureResubscribeUserEmailsDialog').find('#quillConfigureResubscribeUserEmailsDialog_Subject')[0].value = '';
                                    }

                                    //if (emailTemplate && emailTemplate != '') {
                                    //    $($(thiz.element).find('#quillConfigureResubscribeUserEmailsDialog_Body')[0]).summernote('reset');
                                    //    $($(thiz.element).find('#quillConfigureResubscribeUserEmailsDialog_Body')[0]).summernote('pasteHTML', emailTemplate);
                                    //} else {
                                    //    $($(thiz.element).find('#quillConfigureResubscribeUserEmailsDialog_Body')[0]).summernote('reset');
                                    //}
                                    if (emailTemplate && emailTemplate != '') {
                                        //$('#ConfigureEmailNotificationsDialogEditor').summernote('reset');
                                        debugger;
                                        $($('#divConfigureResubscribeUserEmailsDialog').find('#quillConfigureResubscribeUserEmailsDialog_Body')[0]).summernote('code', emailTemplate);
                                    } else {
                                        $($('#divConfigureResubscribeUserEmailsDialog').find('#quillConfigureResubscribeUserEmailsDialog_Body')[0]).summernote('reset');
                                    }

                                    //var timestamp = new Date(); // getFriendlyDateAndTime(data[0].Timestamp);
                                    //var html = '';
                                    ////debugger;
                                    ////var toParticipantEmail = data[0].ToParticipantEmail.replace('<', '&lt;').replace('>', '&gt;');
                                    //html += '<span style="color:black;">To:</span> ' + data[0].ToParticipantFriendlyName + ' (' + data[0].ToParticipantEmail + ')';
                                    //html += '<br />';
                                    //html += '<span style="font-weight:normal;font-size:10pt;color:black;">' + timestamp + '</span>';
                                    //$('#divConfigureResubscribeUserEmailsDialog').find('#spanSelectedEmailSubject')[0].innerHTML = html;

                                    //} catch (e) {
                                    //    console.log('Exception in viewSentEmail(): ' + e.message + ', ' + e.stack);
                                    //}



                                } catch (e) {
                                    console.log('Exception in bwWorkflowEditor._create().xx.Get:1-2: ' + e.message + ', ' + e.stack);
                                    alert('Exception in bwWorkflowEditor._create().xx.Get:1-2: ' + e.message + ', ' + e.stack);
                                }




                            }
                        });


                    }

                } catch (e) {
                    console.log('Exception in bwWorkflowEditor._create().xx.Get:1-1: ' + e.message + ', ' + e.stack);
                    alert('Exception in bwWorkflowEditor._create().xx.Get:1-1: ' + e.message + ', ' + e.stack);
                }








            }).fail(function (data) {
                console.log('In xx1.fail(): ' + JSON.stringify(data));
                var msg;
                if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                } else {
                    msg = JSON.stringify(data);
                }
                alert('Exception in bwWorkflowEditor._create().xx.Get:2: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                console.log('Exception in bwWorkflowEditor._create().xx.Get:2: ' + JSON.stringify(data));
                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                //var error = JSON.parse(data.responseText)["odata.error"];
                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            });














            //        } catch (e) {
            //            console.log('Exception in displayConfigureResubscribeEmailDialog.divConfigureResubscribeUserEmailsDialog.open(): ' + e.message + ', ' + e.stack);
            //        }
            //    },
            //    close: function () {
            //        $('#divConfigureResubscribeUserEmailsDialog').dialog('destroy');
            //    }

            //});
            //$('#divConfigureResubscribeUserEmailsDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();









        } catch (e) {
            console.log('Exception in displayConfigureResubscribeEmailDialog(): ' + e.message + ', ' + e.stack);
        }
    },
    publishEmailTemplateConfigurationAndActivate: function () {
        var thiz = this;
        try {
            console.log('In publishEmailTemplateConfigurationAndActivate().');
            alert('In publishEmailTemplateConfigurationAndActivate().');
            //debugger;




            //alert('In publishEmailTemplateConfigurationAndActivate(). I dont think this is getting the correct new html!!!');

            debugger;

            var subject = $('#divConfigureResubscribeUserEmailsDialog').find('#quillConfigureResubscribeUserEmailsDialog_Subject')[0].value;
            var body = $($('#divConfigureResubscribeUserEmailsDialog').find('#quillConfigureResubscribeUserEmailsDialog_Body')[0]).summernote("code");

            var json = {
                Subject: subject,
                Body: body
            };
            var json2 = {
                bwIntroductoryEmailHtml: JSON.stringify(json)
            };
            $.ajax({
                url: thiz.options.operationUriPrefix + "_bw/PublishUserResubscribeEmailTemplate", //PublishOrganizationIntroductoryEmailTemplate",
                type: "Post",
                data: json2,
                headers: {
                    "Accept": "application/json; odata=verbose"
                }
            }).success(function (result) {
                try {
                    if (result.message != 'SUCCESS') {
                        alert('ERROR: ' + result.message);
                    } else {
                        console.log('In publishEmailTemplateConfigurationAndActivate().post: Successfully updated DB. result: ' + JSON.stringify(result));
                        $("#divUndoResubscribeUserEmailTemplateActivationDialog").dialog({
                            modal: true,
                            resizable: false,
                            //closeText: "Cancel",
                            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                            //title: 'Project Type picker',
                            width: '800',
                            dialogClass: 'no-close', // No close button in the upper right corner.
                            hide: false, // This means when hiding just disappear with no effects.
                            open: function () {
                                $('.ui-widget-overlay').bind('click', function () {
                                    $('#divUndoResubscribeUserEmailTemplateActivationDialog').dialog('close');
                                });

                                // re-sync this.options.store
                                thiz.options.CurrentEmailTemplate.EmailTemplate = JSON.parse(JSON.stringify(json));
                                thiz.options.CurrentEmailTemplate.DraftEmailTemplate = JSON.parse(JSON.stringify(json));
                                //thiz.checkIfWeHaveToDisplayThePublishChangesButton();

                            },
                            close: function () {
                                $('#divUndoResubscribeUserEmailTemplateActivationDialog').dialog("destroy");
                                //    //thiz._create(); // When the user closes this dialog, we regenerate the screen to reflect the newly created and activated workflow. <<< NOT NECESSARY!!!! ONLY USING FOR TESTING.
                                //    debugger;
                                //    thiz.checkIfWeHaveToDisplayThePublishChangesButton();
                            }
                        });
                        $('#divUndoResubscribeUserEmailTemplateActivationDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
                    }

                } catch (e) {
                    console.log('Exception in publishEmailTemplateConfigurationAndActivate().xx.update: ' + e.message + ', ' + e.stack);
                    alert('Exception in publishEmailTemplateConfigurationAndActivate().xx.update: ' + e.message + ', ' + e.stack);
                }
            }).error(function (data, errorCode, errorMessage) {
                debugger;
                //thiz.hideProgress();
                var msg;
                if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                } else {
                    msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
                }
                console.log('Fail in publishEmailTemplateConfigurationAndActivate().xx.update: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
                alert('Fail in publishEmailTemplateConfigurationAndActivate().xx.update: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                //var error = JSON.parse(data.responseText)["odata.error"];
                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            });
        } catch (e) {
            debugger;
            //thiz.hideProgress();
            alert('Exception in publishEmailTemplateConfigurationAndActivate(): ' + e.message + ', ' + e.stack);
            console.log('Exception in publishEmailTemplateConfigurationAndActivate(): ' + e.message + ', ' + e.stack);
        }
    }


    //displayConfigureResubscribeEmailDialog: function () {
    //    try {
    //        console.log('In displayConfigureResubscribeEmailDialog().');
    //        debugger;
    //        var thiz = this;
    //        // Hit the database and get the introductory email for this organization/workflowApp.

    //        $.ajax({
    //            url: this.options.operationUriPrefix + "_bw/NewTenantIntroductoryEmailSettings", //OrganizationIntroductoryEmailSettings/" + workflowAppId,
    //            dataType: "json",
    //            contentType: "application/json",
    //            type: "Get",
    //            timeout: thiz.options.ajaxTimeout
    //        }).done(function (result) {
    //            try {
    //                if (result.message != 'SUCCESS') {
    //                    alert('ERROR: ' + result.message);
    //                } else {
    //                    // Set the dialog sub title.
    //                    var html = '';
    //                    html += 'This email gets sent to a "New User" when they first join BudgetWorkflow.com.';

    //                    document.getElementById('spanConfigureEmailNotificationsDialogSubTitle').innerHTML = html;

    //                    //
    //                    // Set the "Save" button.
    //                    //
    //                    //var html = '';
    //                    //html += '<div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" onclick="alert(\'This functionality is incomplete. Coming soon!\');">';
    //                    //html += '☑ Save this email template';
    //                    //html += '</div>';
    //                    //document.getElementById('spanConfigureEmailNotificationsDialogSaveButton').innerHTML = html;
    //                    // Display the email editor.
    //                    $("#divConfigureResubscribeUserEmailsDialog").dialog({
    //                        modal: true,
    //                        resizable: false,
    //                        //closeText: "Cancel",
    //                        closeOnEscape: false, // Hit the ESC key to hide! Yeah!
    //                        //title: 'divConfigureResubscribeUserEmailsDialog',
    //                        width: '800',
    //                        dialogClass: 'no-close', // No close button in the upper right corner.
    //                        hide: false, // This means when hiding just disappear with no effects.
    //                        open: function () {
    //                            try {
    //                                $('.ui-widget-overlay').bind('click', function () {
    //                                    $('#divConfigureResubscribeUserEmailsDialog').dialog('close');
    //                                });








    //                                debugger; // Display the email editor. // 9-5-2021 THIS IS THE ONE THAT WORKS. COPY CODE FROM HERE TO editStepEmails() in bwResubscribeUserEmailEditor. <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    //                                thiz.options.quillSubjectEditor = new Quill('#quillConfigureResubscribeUserEmailsDialog_Subject', {
    //                                    modules: {
    //                                        toolbar: '#bwQuilltoolbarForSubject'
    //                                    },
    //                                    //placeholder: 'The enhanced notification email editor functionality is coming soon...', 
    //                                    theme: 'snow'
    //                                });
    //                                // Hook up this button event so that the user can insert data items into the email.
    //                                var customButton1 = document.querySelector('#btnQuill_InsertADataItemForSubject');
    //                                customButton1.addEventListener('click', function () {
    //                                    //console.log('btnQuill_InsertADataItem: This functionality is incomplete. Coming soon!');
    //                                    thiz.displayEmailDataItemPickerDialog('subject');
    //                                });
    //                                //debugger;
    //                                thiz.options.quill = new Quill('#quillConfigureResubscribeUserEmailsDialog_Body', {
    //                                    modules: {
    //                                        toolbar: '#bwQuilltoolbar'
    //                                    },
    //                                    //placeholder: 'The enhanced notification email editor functionality is coming soon...', 
    //                                    theme: 'snow'
    //                                });


    //                                thiz.options.quillSubjectEditor.on('text-change', function (delta, oldDelta, source) {
    //                                    //debugger;
    //                                    thiz.options.userHasMadeChangesToTheEmailTemplate = true;
    //                                    //thiz.checkIfWeHaveToDisplayThePublishChangesButton();
    //                                });

    //                                thiz.options.quill.on('text-change', function (delta, oldDelta, source) {
    //                                    //debugger;
    //                                    thiz.options.userHasMadeChangesToTheEmailTemplate = true;
    //                                    //thiz.checkIfWeHaveToDisplayThePublishChangesButton();
    //                                });



    //                                // Hook up this button event so that the user can insert data items into the email.
    //                                var customButton = document.querySelector('#btnQuill_InsertADataItem');
    //                                customButton.addEventListener('click', function () {
    //                                    //console.log('btnQuill_InsertADataItem: This functionality is incomplete. Coming soon!');
    //                                    thiz.displayEmailDataItemPickerDialog('body');
    //                                });
    //                                //// Retrieve the email from the workflow and display it in the editor.


    //                                var button = document.getElementById('divResubscribeUserEmailEditor_PreviewAndEditButton');
    //                                button.innerHTML = '       ❐ Edit email HTML';
    //                                $(button).unbind('click').click(function (error) {
    //                                    try {
    //                                        console.log('In renderEmailEditor.divResubscribeUserEmailEditor_PreviewAndEditButton.click().');
    //                                        thiz.editEmailHtml();
    //                                    } catch (e) {
    //                                        console.log('Exception in renderEmailEditor.divResubscribeUserEmailEditor_PreviewAndEditButton.click(): ' + e.message + ', ' + e.stack);
    //                                    }
    //                                });



    //                                //debugger;
    //                                var emailTemplateForSubject;
    //                                var emailTemplate;
    //                                debugger;
    //                                if (result.bwIntroductoryEmailHtml) {
    //                                    try {
    //                                        debugger;
    //                                        // Yay, we got the email template from the database for this organization/workflowApp.
    //                                        emailTemplate = JSON.parse(result.bwIntroductoryEmailHtml);
    //                                        emailTemplateForSubject = emailTemplate.Subject;
    //                                        emailTemplate = emailTemplate.Body;
    //                                    } catch (e) {
    //                                        //console.log();
    //                                        //alert();
    //                                        emailTemplateForSubject = '[corrupted subject]';
    //                                        emailTemplate = '[corrupted body]'; 
    //                                    }
    //                                } else {
    //                                    alert('No email template was provided!!! xcx9927');
    //                                    var prettyGlobalUrl2 = 'BudgetWorkflow.com';
    //                                    var globalUrl = 'budgetworkflow.com';
    //                                    //
    //                                    // At this point we should send a nice email introducing BudgetRequests.com!
    //                                    //
    //                                    var emailSubject = 'Welcome to ' + prettyGlobalUrl2 + '';
    //                                    var emailBody = '';

    //                                    emailBody += '<table style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;">';
    //                                    emailBody += '        <tr>';
    //                                    emailBody += '            <td>';
    //                                    emailBody += '                <span style="font-weight:bold;">Welcome to ' + prettyGlobalUrl2 + '</span>';
    //                                    emailBody += '                <br /><br />';
    //                                    emailBody += '            </td>';
    //                                    emailBody += '        </tr>';

    //                                    emailBody += '        <tr>';
    //                                    emailBody += '            <td>';
    //                                    emailBody += '                Here is a video to help get you started: "Using your budget request system."';
    //                                    emailBody += '            </td>';
    //                                    emailBody += '        </tr>';

    //                                    emailBody += '        <tr>';
    //                                    emailBody += '            <td>';
    //                                    emailBody += '                <a href="https://www.youtube.com/watch?v=uEqW4ang8SI&t=3s" target="_blank"><img src="https://' + globalUrl + '/images/marketing/white-on-black-360x360-roun.png" style="width:180px;height:180px;" title="Click to play video..." /></a>';
    //                                    emailBody += '            </td>';
    //                                    emailBody += '        </tr>';

    //                                    emailBody += '        <tr>';
    //                                    emailBody += '            <td>';
    //                                    emailBody += '                <br /><br />';
    //                                    emailBody += '            </td>';
    //                                    emailBody += '        </tr>';

    //                                    emailBody += '        <tr>';
    //                                    emailBody += '            <td>';
    //                                    emailBody += '                <span style="font-weight:bold;">Here are some tips which will help you get up and running quickly!</span>';
    //                                    emailBody += '            </td>';
    //                                    emailBody += '        </tr>';

    //                                    emailBody += '        <tr>';
    //                                    emailBody += '            <td>';
    //                                    emailBody += '                <br />';
    //                                    emailBody += '            </td>';
    //                                    emailBody += '        </tr>';

    //                                    emailBody += '        <tr>';
    //                                    emailBody += '            <td>';
    //                                    emailBody += '                After you logon, the next step is to invite participants to your budget request system. Click the "Generate invitation" button, then copy and paste the invitation link into an email. You will be notified with an email when they have joined!';
    //                                    emailBody += '            </td>';
    //                                    emailBody += '        </tr>';

    //                                    emailBody += '        <tr>';
    //                                    emailBody += '            <td>';
    //                                    emailBody += '                <img src="https://' + globalUrl + '/images/marketing/send-an-invitation.png" />';
    //                                    emailBody += '            </td>';
    //                                    emailBody += '        </tr>';

    //                                    emailBody += '        <tr>';
    //                                    emailBody += '            <td>';
    //                                    emailBody += '                <br /><br />';
    //                                    emailBody += '            </td>';
    //                                    emailBody += '        </tr>';

    //                                    emailBody += '        <tr>';
    //                                    emailBody += '            <td>';
    //                                    emailBody += '                You can start using your budget request system immediately by filling out a new budget request. A sample financial area - called <i>Miscellaneous (express setup)</i> - lets you see how the system works right away.';
    //                                    emailBody += '            </td>';
    //                                    emailBody += '        </tr>';

    //                                    emailBody += '        <tr>';
    //                                    emailBody += '            <td>';
    //                                    emailBody += '                <img src="https://' + globalUrl + '/images/marketing/new-budget-request.png" />';
    //                                    emailBody += '            </td>';
    //                                    emailBody += '        </tr>';

    //                                    emailBody += '        <tr>';
    //                                    emailBody += '            <td>';
    //                                    emailBody += '                <br /><br />';
    //                                    emailBody += '            </td>';
    //                                    emailBody += '        </tr>';

    //                                    emailBody += '        <tr>';
    //                                    emailBody += '            <td>';
    //                                    emailBody += '                Create financial areas unique to your budget request system. These may reflect your general ledger accounts, or departmental and management structure.';
    //                                    emailBody += '            </td>';
    //                                    emailBody += '        </tr>';

    //                                    emailBody += '        <tr>';
    //                                    emailBody += '            <td>';
    //                                    emailBody += '                <img src="https://' + globalUrl + '/images/marketing/financial-areas.png" />';
    //                                    emailBody += '            </td>';
    //                                    emailBody += '        </tr>';

    //                                    emailBody += '        <tr>';
    //                                    emailBody += '            <td>';
    //                                    emailBody += '                <br /><br />';
    //                                    emailBody += '            </td>';
    //                                    emailBody += '        </tr>';

    //                                    emailBody += '        <tr>';
    //                                    emailBody += '            <td>';
    //                                    emailBody += '                If you use an iPhone or Android, the display is designed for these smaller devices.';
    //                                    emailBody += '            </td>';
    //                                    emailBody += '        </tr>';

    //                                    emailBody += '        <tr>';
    //                                    emailBody += '            <td>';
    //                                    emailBody += '                <img src="https://' + globalUrl + '/images/marketing/mobile-screenshot.png" />';
    //                                    emailBody += '            </td>';
    //                                    emailBody += '        </tr>';

    //                                    emailBody += '        <tr>';
    //                                    emailBody += '            <td>';
    //                                    emailBody += '                <br /><br />';
    //                                    emailBody += '            </td>';
    //                                    emailBody += '        </tr>';

    //                                    emailBody += '        <tr>';
    //                                    emailBody += '            <td>';
    //                                    emailBody += '                <hr />';
    //                                    emailBody += '                <i>I would like to introduce myself. My name is Todd Hiltz, and I am the creator of this software. Feel free to contact me anytime at todd_hiltz@hotmail.com with any questions or comments you may have! I want to help everyone get the most out of this software! - Todd Hiltz</i>';
    //                                    emailBody += '                <br />';
    //                                    emailBody += '            </td>';
    //                                    emailBody += '        </tr>';

    //                                    emailBody += '        <tr>';
    //                                    emailBody += '            <td>';
    //                                    emailBody += '                <hr />';
    //                                    emailBody += '                <i>This is an automated email from <a href="https://' + globalUrl + '" target="_blank">' + prettyGlobalUrl2 + '</a>.</i>';
    //                                    emailBody += '            </td>';
    //                                    emailBody += '        </tr>';
    //                                    emailBody += '    </table>';
    //                                    emailTemplateForSubject = emailSubject;
    //                                    emailTemplate = emailBody;
    //                                }

    //                                //var emailTemplateForSubject = thiz.options.CurrentEmailTemplate.EmailTemplate.Subject;
    //                                //var emailTemplate = thiz.options.CurrentEmailTemplate.EmailTemplate.Body;

    //                                if (emailTemplateForSubject && emailTemplateForSubject != '') {
    //                                    thiz.options.quillSubjectEditor.setText(emailTemplateForSubject);
    //                                } else {
    //                                    thiz.options.quillSubjectEditor.setText('xcx44');
    //                                }
    //                                //debugger;
    //                                if (emailTemplate && emailTemplate != '') {
    //                                    //debugger;
    //                                    thiz.options.quill.setText(''); // Do this first so we don't get double the email!
    //                                    //thiz.options.quill.root.innerHTML = emailTemplate; //.setText(emailTemplate);
    //                                    //thiz.options.quill.setText(emailTemplate);
    //                                    thiz.options.quill.clipboard.dangerouslyPasteHTML(0, emailTemplate);
    //                                } else {
    //                                    thiz.options.quill.setText('');
    //                                }












    //                            } catch (e) {
    //                                console.log('Exception in bwWorkflowEditor._create().xx.Get:1-2: ' + e.message + ', ' + e.stack);
    //                                alert('Exception in bwWorkflowEditor._create().xx.Get:1-2: ' + e.message + ', ' + e.stack);
    //                            }




    //                        }
    //                    });


    //                }

    //            } catch (e) {
    //                console.log('Exception in bwWorkflowEditor._create().xx.Get:1-1: ' + e.message + ', ' + e.stack);
    //                alert('Exception in bwWorkflowEditor._create().xx.Get:1-1: ' + e.message + ', ' + e.stack);
    //            }








    //        }).fail(function (data) {
    //            console.log('In xx1.fail(): ' + JSON.stringify(data));
    //            var msg;
    //            if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
    //                msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
    //            } else {
    //                msg = JSON.stringify(data);
    //            }
    //            alert('Exception in bwWorkflowEditor._create().xx.Get:2: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
    //            console.log('Exception in bwWorkflowEditor._create().xx.Get:2: ' + JSON.stringify(data));
    //            //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
    //            //var error = JSON.parse(data.responseText)["odata.error"];
    //            //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
    //        });














    //        //        } catch (e) {
    //        //            console.log('Exception in displayConfigureResubscribeEmailDialog.divConfigureResubscribeUserEmailsDialog.open(): ' + e.message + ', ' + e.stack);
    //        //        }
    //        //    },
    //        //    close: function () {
    //        //        $('#divConfigureResubscribeUserEmailsDialog').dialog('destroy');
    //        //    }

    //        //});
    //        //$('#divConfigureResubscribeUserEmailsDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();









    //    } catch (e) {
    //        console.log('Exception in displayConfigureResubscribeEmailDialog(): ' + e.message + ', ' + e.stack);
    //    }
    //},


});