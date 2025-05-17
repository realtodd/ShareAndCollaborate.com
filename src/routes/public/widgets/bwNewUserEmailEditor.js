$.widget("bw.bwNewUserEmailEditor", {
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
        This is the bwNewUserEmailEditor.js jQuery Widget. 
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
        this.element.addClass("bwNewUserEmailEditor");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {
            console.log('In bwNewUserEmailEditor._create().');

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
            html += '<span style="font-size:24pt;color:red;">bwNewUserEmailEditor: CANNOT RENDER</span>';
            html += '<br />';
            html += '<span style="">Exception in bwNewUserEmailEditor.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwNewUserEmailEditor")
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


            html += '   <div style="display:none;" id="divUndoNewUserEmailTemplateActivationDialog">';
            html += '       <table style="width:100%;">';
            html += '           <tr>';
            html += '               <td style="width:90%;">';
            html += '                   <span id="spanUndoWorkflowActivationTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Introductory Email ACTIVATED</span>';
            html += '               </td>';
            html += '               <td style="width:9%;"></td>';
            html += '               <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '                   <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divUndoNewUserEmailTemplateActivationDialog\').dialog(\'close\');">X</span>';
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
            html += '           You can change the "Active Introductory Email" using the drop-down at the top of this page any time';
            html += '       </span>';
            html += '       </span>';
            html += '       <br /><br />';
            html += '   </div>';


            // "New user introductory email" configuration dialog.
            html += '<div style="display:none;" id="divConfigureNewUserEmailsDialog">';
            html += '   <table style="width:100%;">';
            html += '       <tr>';
            html += '           <td style="width:90%;">';
            html += '               <span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:30pt;font-weight:bold;">Configure "Introductory Email"</span>';
            html += '<span title="Introductory Email maintenance..." style="width:200px;padding:5px 10px 5px 10px;margin:0 0 0 10px;white-space:nowrap;vertical-align:middle;border:1px solid lightblue;cursor:pointer;font-weight:normal;font-size:10pt;" onclick="$(\'.bwNewUserEmailEditor\').bwNewUserEmailEditor(\'displayWorkflowsConfigurationDialog\');"><span style="display:inline-block;"> ⚙ </span></span>';
            html += '               <br />';
            html += '               <span id="spanConfigureEmailNotificationsDialogSubTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:normal;">[spanConfigureEmailNotificationsDialogSubTitle]</span>';
            html += '           </td>';
            html += '           <td style="width:9%;"></td>';
            html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divConfigureNewUserEmailsDialog\').dialog(\'close\');">X</span>';
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


            //html += '   <div id="quillConfigureNewUserEmailsDialog_Subject" style="height:50px;"></div>'; // Quill.
            html += '<input type="text" id="quillConfigureNewUserEmailsDialog_Subject" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';




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
            html += '   <div id="quillConfigureNewUserEmailsDialog_Body" style="height:375px;"></div>'; // Quill.
            // Save button.
            //html += '   <br />';
            //html += '   <span id="spanConfigureEmailNotificationsDialogSaveButton">[spanConfigureEmailNotificationsDialogSaveButton]</span>'; // ☑ 
            html += '   <br /><br />';
            // Preview/Edit button.
            //html += '   <div id="divNewUserEmailEditor_PreviewAndEditButton" class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;"></div>';
            //html += '   <br /><br />';

            html += '   <div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" onclick="$(\'.bwNewUserEmailEditor\').bwNewUserEmailEditor(\'publishEmailTemplateConfigurationAndActivate\');">';
            html += '   ☑ Publish this email template';
            html += '   </div>';
            html += '   <br /><br />';

            html += '</div>';

            // Render the html.
            this.element.html(html);

            //var button = document.getElementById('divNewUserEmailEditor_PreviewAndEditButton');
            //button.innerHTML = '       ❐ Edit email HTML';
            //$(button).unbind('click').click(function (error) {
            //    try {
            //        console.log('In renderEmailEditor.divNewUserEmailEditor_PreviewAndEditButton.click().');
            //        thiz.editEmail();
            //    } catch (e) {
            //        console.log('Exception in renderEmailEditor.divNewUserEmailEditor_PreviewAndEditButton.click(): ' + e.message + ', ' + e.stack);
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
            var button = document.getElementById('divNewUserEmailEditor_PreviewAndEditButton');
            button.innerHTML = '       ❐ Edit email HTML';
            $(button).unbind('click').click(function (error) {
                try {
                    console.log('In previewEmail.divNewUserEmailEditor_PreviewAndEditButton.click().');
                    thiz.editEmailHtml();
                } catch (e) {
                    console.log('Exception in previewEmail.divNewUserEmailEditor_PreviewAndEditButton.click(): ' + e.message + ', ' + e.stack);
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
            var button = document.getElementById('divNewUserEmailEditor_PreviewAndEditButton');
            button.innerHTML = '       ❏ Preview this email';
            $(button).unbind('click').click(function (error) {
                try {
                    console.log('In editEmailHtml.divNewUserEmailEditor_PreviewAndEditButton.click().');
                    thiz.previewEmailHtml();
                } catch (e) {
                    console.log('Exception in editEmailHtml.divNewUserEmailEditor_PreviewAndEditButton.click(): ' + e.message + ', ' + e.stack);
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



    //displayConfigureIntroductoryEmailDialog: function () {
    //    try {
    //        console.log('In displayConfigureIntroductoryEmailDialog().');
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
    //                    $("#divConfigureNewUserEmailsDialog").dialog({
    //                        modal: true,
    //                        resizable: false,
    //                        //closeText: "Cancel",
    //                        closeOnEscape: false, // Hit the ESC key to hide! Yeah!
    //                        //title: 'divConfigureNewUserEmailsDialog',
    //                        width: '800',
    //                        dialogClass: 'no-close', // No close button in the upper right corner.
    //                        hide: false, // This means when hiding just disappear with no effects.
    //                        open: function () {
    //                            try {
    //                                $('.ui-widget-overlay').bind('click', function () {
    //                                    $('#divConfigureNewUserEmailsDialog').dialog('close');
    //                                });








    //                                debugger; // Display the email editor. // 9-5-2021 THIS IS THE ONE THAT WORKS. COPY CODE FROM HERE TO editStepEmails() in bwNewUserEmailEditor. <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    //                                thiz.options.quillSubjectEditor = new Quill('#quillConfigureNewUserEmailsDialog_Subject', {
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
    //                                thiz.options.quill = new Quill('#quillConfigureNewUserEmailsDialog_Body', {
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


    //                                var button = document.getElementById('divNewUserEmailEditor_PreviewAndEditButton');
    //                                button.innerHTML = '       ❐ Edit email HTML';
    //                                $(button).unbind('click').click(function (error) {
    //                                    try {
    //                                        console.log('In renderEmailEditor.divNewUserEmailEditor_PreviewAndEditButton.click().');
    //                                        thiz.editEmailHtml();
    //                                    } catch (e) {
    //                                        console.log('Exception in renderEmailEditor.divNewUserEmailEditor_PreviewAndEditButton.click(): ' + e.message + ', ' + e.stack);
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
    //        //            console.log('Exception in displayConfigureIntroductoryEmailDialog.divConfigureNewUserEmailsDialog.open(): ' + e.message + ', ' + e.stack);
    //        //        }
    //        //    },
    //        //    close: function () {
    //        //        $('#divConfigureNewUserEmailsDialog').dialog('destroy');
    //        //    }

    //        //});
    //        //$('#divConfigureNewUserEmailsDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();









    //    } catch (e) {
    //        console.log('Exception in displayConfigureIntroductoryEmailDialog(): ' + e.message + ', ' + e.stack);
    //    }
    //},
    displayConfigureIntroductoryEmailDialog: function () {
        try {
            console.log('In displayConfigureIntroductoryEmailDialog().');
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
                url: this.options.operationUriPrefix + "_bw/NewTenantIntroductoryEmailSettings/", 
                dataType: "json",
                contentType: "application/json",
                type: "Post",
                data: JSON.stringify(json)
            }).done(function (result) {
                try {
                    //if (result.message != 'SUCCESS') {
                        alert('ERROR: ' + result.message);
                    //} else {
                        // Set the dialog sub title.
                        var html = '';
                        html += 'This email gets sent to a "New User" when they first join BudgetWorkflow.com.';

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
                        $("#divConfigureNewUserEmailsDialog").dialog({
                            modal: true,
                            resizable: false,
                            //closeText: "Cancel",
                            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                            //title: 'divConfigureNewUserEmailsDialog',
                            width: '900',
                            dialogClass: 'no-close', // No close button in the upper right corner.
                            hide: false, // This means when hiding just disappear with no effects.
                            open: function () {
                                try {
                                    $('.ui-widget-overlay').bind('click', function () {
                                        $('#divConfigureNewUserEmailsDialog').dialog('close');
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

                                    $($('#divConfigureNewUserEmailsDialog').find('#quillConfigureNewUserEmailsDialog_Body')[0]).summernote({
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
                                    var customButton = $('#divConfigureNewUserEmailsDialog').find('#btnQuill_InsertADataItem')[0]; //document.querySelector('#btnQuill_InsertADataItem'); //
                                    customButton.addEventListener('click', function () {
                                        console.log('In viewPendingEmail.quill.customButton.click().')
                                        //console.log('btnQuill_InsertADataItem: This functionality is incomplete. Coming soon!');
                                        //thiz.displayEmailDataItemPickerDialog('body');
                                    });

                                    //var emailTemplateForSubject = data[0].Subject; //thiz.options.CurrentEmailTemplate.EmailTemplate.Subject;
                                    //var emailTemplate = data[0].Body; //thiz.options.CurrentEmailTemplate.EmailTemplate.Body;

                                    if (emailTemplateForSubject && emailTemplateForSubject != '') {
                                        //$('#divConfigureNewUserEmailsDialog').find('#quillConfigureNewUserEmailsDialog_Subject')[0].value = emailTemplateForSubject;
                                        $('#divConfigureNewUserEmailsDialog').find('#quillConfigureNewUserEmailsDialog_Subject')[0].value = emailTemplateForSubject;
                                    } else {
                                        //$('#divConfigureNewUserEmailsDialog').find('#quillConfigureNewUserEmailsDialog_Subject')[0].value = '';
                                        $('#divConfigureNewUserEmailsDialog').find('#quillConfigureNewUserEmailsDialog_Subject')[0].value = '';
                                    }

                                    //if (emailTemplate && emailTemplate != '') {
                                    //    $($(thiz.element).find('#quillConfigureNewUserEmailsDialog_Body')[0]).summernote('reset');
                                    //    $($(thiz.element).find('#quillConfigureNewUserEmailsDialog_Body')[0]).summernote('pasteHTML', emailTemplate);
                                    //} else {
                                    //    $($(thiz.element).find('#quillConfigureNewUserEmailsDialog_Body')[0]).summernote('reset');
                                    //}
                                    if (emailTemplate && emailTemplate != '') {
                                        //$('#ConfigureEmailNotificationsDialogEditor').summernote('reset');
                                        debugger;
                                        $($('#divConfigureNewUserEmailsDialog').find('#quillConfigureNewUserEmailsDialog_Body')[0]).summernote('code', emailTemplate);
                                    } else {
                                        $($('#divConfigureNewUserEmailsDialog').find('#quillConfigureNewUserEmailsDialog_Body')[0]).summernote('reset');
                                    }

                                    //var timestamp = new Date(); // getFriendlyDateAndTime(data[0].Timestamp);
                                    //var html = '';
                                    ////debugger;
                                    ////var toParticipantEmail = data[0].ToParticipantEmail.replace('<', '&lt;').replace('>', '&gt;');
                                    //html += '<span style="color:black;">To:</span> ' + data[0].ToParticipantFriendlyName + ' (' + data[0].ToParticipantEmail + ')';
                                    //html += '<br />';
                                    //html += '<span style="font-weight:normal;font-size:10pt;color:black;">' + timestamp + '</span>';
                                    //$('#divConfigureNewUserEmailsDialog').find('#spanSelectedEmailSubject')[0].innerHTML = html;

                                    //} catch (e) {
                                    //    console.log('Exception in viewSentEmail(): ' + e.message + ', ' + e.stack);
                                    //}



                                } catch (e) {
                                    console.log('Exception in bwWorkflowEditor._create().xx.Get:1-2: ' + e.message + ', ' + e.stack);
                                    alert('Exception in bwWorkflowEditor._create().xx.Get:1-2: ' + e.message + ', ' + e.stack);
                                }




                            }
                        });


                    //}

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
            //            console.log('Exception in displayConfigureIntroductoryEmailDialog.divConfigureNewUserEmailsDialog.open(): ' + e.message + ', ' + e.stack);
            //        }
            //    },
            //    close: function () {
            //        $('#divConfigureNewUserEmailsDialog').dialog('destroy');
            //    }

            //});
            //$('#divConfigureNewUserEmailsDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();









        } catch (e) {
            console.log('Exception in displayConfigureIntroductoryEmailDialog(): ' + e.message + ', ' + e.stack);
        }
    },
    publishEmailTemplateConfigurationAndActivate: function () {
        var thiz = this;
        try {
            console.log('In publishEmailTemplateConfigurationAndActivate().');
            //debugger;

            //alert('WE SHOULD NOT BE HERE');


            //alert('In publishEmailTemplateConfigurationAndActivate(). I dont think this is getting the correct new html!!!');

            debugger;

            var subject = $('#divConfigureNewUserEmailsDialog').find('#quillConfigureNewUserEmailsDialog_Subject')[0].value;
            var body = $($('#divConfigureNewUserEmailsDialog').find('#quillConfigureNewUserEmailsDialog_Body')[0]).summernote("code");

            var json = {
                Subject: subject,
                Body: body
            };
            var json2 = {
                bwIntroductoryEmailHtml: JSON.stringify(json)
            };
            $.ajax({
                url: thiz.options.operationUriPrefix + "_bw/PublishNewTenantIntroductoryEmailTemplate", //PublishOrganizationIntroductoryEmailTemplate",
                type: "Post",
                timeout: thiz.options.ajaxTimeout,
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
                        $("#divUndoNewUserEmailTemplateActivationDialog").dialog({
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
                                    $('#divUndoNewUserEmailTemplateActivationDialog').dialog('close');
                                });

                                // re-sync this.options.store
                                thiz.options.CurrentEmailTemplate.EmailTemplate = JSON.parse(JSON.stringify(json));
                                thiz.options.CurrentEmailTemplate.DraftEmailTemplate = JSON.parse(JSON.stringify(json));
                                //thiz.checkIfWeHaveToDisplayThePublishChangesButton();

                            },
                            close: function () {
                                $('#divUndoNewUserEmailTemplateActivationDialog').dialog("destroy");
                                //    //thiz._create(); // When the user closes this dialog, we regenerate the screen to reflect the newly created and activated workflow. <<< NOT NECESSARY!!!! ONLY USING FOR TESTING.
                                //    debugger;
                                //    thiz.checkIfWeHaveToDisplayThePublishChangesButton();
                            }
                        });
                        $('#divUndoNewUserEmailTemplateActivationDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
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
    },









    //deployNewUserExperience: function () {
    //    try {
    //        var appIdAndAppTitle = $('#selectChangeUserRoleDialogOrganizationOwnerDropDown2 option:selected').val();
    //        console.log('In bwNewUserEmailEditor.deployNewUserExperience(). appIdAndAppTitle: ' + appIdAndAppTitle);
    //        var proceed = confirm('Are you certain that you want to deploy the "New User" forms to this Tenant? [' + appIdAndAppTitle + ']\n\nThis action cannot be undone.\n\n\nClick the OK button to proceed...');
    //        if (proceed != true) {
    //            //alert('You have chosen not to proceed.');
    //        } else {

    //            alert('This functionality is incomplete. Coming soon!');



    //        }
    //    } catch (e) {
    //        console.log('Exception in bwNewUserEmailEditor.deployNewUserExperience(): ' + e.message + ', ' + e.stack);
    //    }
    //},

    //renderEmailEditor: function () {
    //    try {
    //        debugger; // 9-5-2021
    //        console.log('In renderEmailEditor().');
    //        var thiz = this;
    //        var html = '';

    //        html += '<div style="display:none;" id="divConfigureNewUserEmailsDialog">';
    //        html += '   <table style="width:100%;">';
    //        html += '       <tr>';
    //        html += '           <td style="width:90%;">';
    //        html += '               <span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:30pt;font-weight:bold;">Configure "Introductory Email"</span>';

    //        html += '<span title="Introductory Email maintenance..." style="width:200px;padding:5px 10px 5px 10px;margin:0 0 0 10px;white-space:nowrap;vertical-align:middle;border:1px solid lightblue;cursor:pointer;font-weight:normal;font-size:10pt;" onclick="$(\'.bwNewUserEmailEditor\').bwNewUserEmailEditor(\'displayWorkflowsConfigurationDialog\');"><span style="display:inline-block;"> ⚙ </span></span>';

    //        html += '               <br />';
    //        html += '               <span id="spanConfigureEmailNotificationsDialogSubTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:normal;">[spanConfigureEmailNotificationsDialogSubTitle]</span>';
    //        html += '           </td>';
    //        html += '           <td style="width:9%;"></td>';
    //        html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
    //        html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divConfigureNewUserEmailsDialog\').dialog(\'close\');">X</span>';
    //        html += '           </td>';
    //        html += '       </tr>';
    //        html += '   </table>';
    //        html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
    //        html += '   <br />';

    //        html += '<div style="display:none;" id="divUndoNewUserEmailTemplateActivationDialog">';
    //        html += '  <table style="width:100%;">';
    //        html += '    <tr>';
    //        html += '      <td style="width:90%;">';
    //        html += '        <span id="spanUndoWorkflowActivationTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Introductory Email ACTIVATED</span>';
    //        html += '      </td>';
    //        html += '      <td style="width:9%;"></td>';
    //        html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
    //        html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divUndoNewUserEmailTemplateActivationDialog\').dialog(\'close\');">X</span>';
    //        html += '      </td>';
    //        html += '    </tr>';
    //        html += '  </table>';
    //        html += '  <br /><br />';
    //        html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
    //        html += '  <span id="spanUndoWorkflowActivationContentcccxxxccc" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:20pt;">';
    //        html += '    This new user introductory email has been activated and will immediately impact the future processes. Please keep an eye on potential issues related to your change(s). ';
    //        html += '    <br />';
    //        html += '    <br />';
    //        html += '    <br />';
    //        html += '    <span style="font-weight:bold;cursor:pointer;">';
    //        html += '      You can change the "Active Introductory Email" using the drop-down at the top of this page any time';
    //        html += '    </span>';
    //        html += '  </span>';
    //        html += '  <br /><br />';
    //        html += '</div>';

    //        // Publish message and button.
    //        html += '<table>';
    //        html += '<tr>';
    //        html += '  <td>';
    //        html += '';
    //        html += '  </td>';
    //        html += '  <td style="text-align:right;">';
    //        html += '    <span id="spanThereAreChangesToPublishText4" style="font-style:italic;color:tomato;"></span>'; //<input value=" There are unsaved changes. Enter a description here and click Save..." type="text" id="txtNewWorkflowDescription" style="width:450px;color:grey;font-style:italic;padding:5px 5px 5px 5px;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewWorkflowDescriptionTextBox_Onkeyup\');" />';
    //        html += '  </td>';
    //        html += '  <td>';
    //        html += '    <span id="spanThereAreChangesToPublishButton4"></span>';
    //        html += '  </td>';
    //        html += '</tr>';
    //        html += '</table>';



    //        //html += '   <span id="spanConfigureEmailNotificationsDialogSelectEditEmailForDropdown">[spanConfigureEmailNotificationsDialogSelectEditEmailForDropdown]</span>';
    //        //html += '   <br />';
    //        //html += '   <br />';
    //        // Quill subject editor.
    //        html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
    //        html += 'Subject line:';
    //        html += '</span>';
    //        html == '<br />';
    //        html += '   <div id="bwQuilltoolbarForSubject">';
    //        html += '       <button id="btnQuill_InsertADataItemForSubject" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
    //        html += '   </div>';
    //        html += '   <div id="quillConfigureNewUserEmailsDialog_Subject" style="height:50px;"></div>'; // Quill.
    //        // Quill body editor.
    //        html += '<br />';
    //        html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
    //        html += 'Body: xcx6';
    //        html += '</span>';
    //        html == '<br />';
    //        html += '   <div id="bwQuilltoolbar">';
    //        html += '       <button id="btnQuill_InsertADataItem" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
    //        html += '       <select class="ql-size">';
    //        html += '           <option value="small"></option>';
    //        html += '           <option selected></option>';
    //        html += '           <option value="large"></option>';
    //        html += '           <option value="huge"></option>';
    //        html += '       </select>';
    //        html += '       <button class="ql-bold"></button>';
    //        html += '       <button class="ql-script" value="sub"></button>';
    //        html += '       <button class="ql-script" value="super"></button>';
    //        html += '   </div>';
    //        html += '   <div id="quillConfigureNewUserEmailsDialog_Body" style="height:375px;"></div>'; // Quill.
    //        // Save button.
    //        //html += '   <br />';
    //        //html += '   <span id="spanConfigureEmailNotificationsDialogSaveButton">[spanConfigureEmailNotificationsDialogSaveButton]</span>'; // ☑ 
    //        html += '   <br /><br />';
    //        // Preview/Edit button.
    //        html += '   <div id="divNewUserEmailEditor_PreviewAndEditButton" class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;"></div>';
    //        html += '   <br /><br />';
    //        html += '</div>';


    //        html += '<div style="display:none;" id="divEmailPreviewDialog">';
    //        html += '  <table style="width:100%;">';
    //        html += '    <tr>';
    //        html += '      <td style="width:90%;">';
    //        html += '        <span id="spanEmailPreviewDialogTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Email preview</span>';
    //        html += '                    <br />';
    //        html += '                    <span id="spanEmailPreviewDialogSubTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:normal;">This email preview includes some randomly selected data.</span>';
    //        html += '      </td>';
    //        html += '      <td style="width:9%;"></td>';
    //        html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
    //        html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divEmailPreviewDialog\').dialog(\'close\');">X</span>';
    //        html += '      </td>';
    //        html += '    </tr>';
    //        html += '  </table>';
    //        html += '  <br /><br />';
    //        html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
    //        html += '  <span id="spanEmailPreviewDialogContentTop">[spanEmailPreviewDialogContentTop]</span>';
    //        html += '    <br />';
    //        html += '    <br />';
    //        html += '    <br />';
    //        html += '    <span id="spanEmailPreviewDialogContentBottom" style="font-weight:bold;cursor:pointer;">';
    //        html += '      [spanEmailPreviewDialogContentBottom]';
    //        html += '    </span>';
    //        html += '  <br /><br />';
    //        html += '</div>';

    //        html += '<div style="display:none;" id="divEmailDataItemPickerDialog">';
    //        html += '  <table style="width:100%;">';
    //        html += '    <tr>';
    //        html += '      <td style="width:90%;">';
    //        html += '        <span id="spanEmailDataItemPickerDialog" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Insert a data item</span>';
    //        html += '                    <br />';
    //        html += '                    <span id="spanEmailDataItemPickerDialogSubTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:normal;">[spanEmailDataItemPickerDialogSubTitle]</span>';
    //        html += '      </td>';
    //        html += '      <td style="width:9%;"></td>';
    //        html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
    //        html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divEmailDataItemPickerDialog\').dialog(\'close\');">X</span>';
    //        html += '      </td>';
    //        html += '    </tr>';
    //        html += '  </table>';
    //        html += '  <br /><br />';
    //        html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
    //        html += '  <span id="spanEmailDataItemPickerDialogContentTop">[spanEmailDataItemPickerDialogContentTop]</span>';
    //        html += '    <br />';
    //        html += '    <br />';
    //        html += '    <br />';
    //        html += '    <span id="spanEmailDataItemPickerDialogContentBottom" style="font-weight:bold;cursor:pointer;">';
    //        //html += '      [spanEmailDataItemPickerDialogContentBottom]';
    //        html += '    </span>';
    //        html += '  <br /><br />';
    //        html += '</div>';


    //        html += '<div style="display:none;" id="divNewUserEmailConfigurationDialog" class="context-menu-workflowsconfiguration">';
    //        html += '  <table style="width:100%;">';
    //        html += '    <tr>';
    //        html += '      <td style="width:90%;">';
    //        html += '        <span id="spanWorkflowsMaintenanceDialogTitle" style="color:#3f3f3f;font-size:30pt;font-weight:bold;">"Introductory Emails" Configuration</span>';
    //        html += '      </td>';
    //        html += '      <td style="width:9%;"></td>';
    //        html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
    //        html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divNewUserEmailConfigurationDialog\').dialog(\'close\');">X</span>';
    //        html += '      </td>';
    //        html += '    </tr>';
    //        html += '  </table>';
    //        html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
    //        //html += '  <span id="spaWorkflowsMaintenanceDialogDescriptionText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;">';
    //        //html += 'Configure active workflows for: ';
    //        //html += '  </span>';
    //        //html += '<select id="selectWorkflowRequestTypeDropDownInDialog2" style=\'border-color: whitesmoke; color: grey; font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 14pt; font-weight: bold; cursor: pointer;\' onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'WorkflowRequestTypeDropDownInDialog_Onchange\', \'selectWorkflowRequestTypeDropDownInDialog2\');" "=""><option value="all" selected="">All request types</option><option value="budgetrequest">Budget Requests</option><option value="capitalplanproject">Capital Plan Projects</option><option value="quoterequest">Quote Requests</option><option value="expenserequest">Reimbursement Requests</option><option value="recurringexpense">Recurring Expenses</option><option value="workorder">Work Orders</option>   </select>';
    //        //html += '  <br />';
    //        html += '  <span id="spanWorkflowsMaintenanceDialogWorkflowActivationSection" style="white-space:nowrap;"></span>';
    //        html += '  <span id="spanWorkflowsMaintenanceDialogContent"></span>';
    //        html += '</div>';








    //        html += '<table>';
    //        html += '  <tr>';
    //        html += '    <td style="text-align:left;vertical-align:top;" class="bwSliderTitleCell">';
    //        html += '<span style="font-size:12pt;white-space:normal;color:red;font-weight:bold;">';
    //        html += '       Configure the new "Tenant/Organization Experience":&nbsp;'; // BwNewTenantSettings
    //        html += '</span>';
    //        html += '<br />';
    //        html += '<br />';
    //        //html += '<span style="font-size:12pt;white-space:normal;color:green;">This is what the new user will experience after creating their account or accepting an invitation...</span>';
    //        html += '    </td>';

    //        html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
    //        html += '       <table>';
    //        html += '           <tr>';
    //        html += '               <td>';
    //        html += '                   <span id="xx" style="font-weight:bold;color:#009933;">';

    //        //html += '<span title="Edit email template(s)..." style="width:200px;padding:5px 10px 5px 10px;margin:0 0 0 20px;white-space:nowrap;vertical-align:top;border:1px solid lightblue;cursor:pointer;font-weight:normal;font-size:20pt;">                           <span style="display:inline-block;">+ ⚙✉</span>                       </span>';
    //        //html += '<span style="display:inline-block;">- ⚙✉</span>';
    //        //html += '</span>';
    //        //html += '<br />';
    //        //html += '<span style="font-size:12pt;white-space:normal;color:green;font-weight:bold;">Configure the "New User" experience:</span>';
    //        //html += '<br />';
    //        //html += '<br />';




    //        html += '<span class="spanButton" onclick="$(\'.bwNewUserEmailEditor\').bwNewUserEmailEditor(\'displayConfigureIntroductoryEmailDialog\', \'Create\');"><span style="font-size:15pt;display:inline-block;">✉</span> Configure "Introductory Email"&nbsp;&nbsp;</span>';
    //        //html += 'If the user is joining an existing WorkflowApp (Organization), if present, they will receive that introductory email. Otherwise, they will receive this introductory email. This allows the Organization to have it\'s own custom introductory email.';
    //        html += '&nbsp;&nbsp;<span style="font-size:small;color:grey;vertical-align:bottom;font-weight:normal;">If the user is joining an existing WorkflowApp (Organization), if present, they will receive that introductory email. Otherwise, they will receive this introductory email. This allows the Organization to have it\'s own custom introductory email.</span>';
    //        html += '<br /><br />';





    //        html += '&nbsp;&nbsp;&nbsp;&nbsp;';
    //        html += '<span class="spanButton" onclick="$(\'.bwNewUserRolesEditor\').bwNewUserRolesEditor(\'displayConfigureIntroductoryEmailDialog\', \'Create\');"><span style="font-size:15pt;display:inline-block;">⚙</span> Configure "Introductory Roles"&nbsp;&nbsp;</span>';

    //        html += '&nbsp;&nbsp;&nbsp;&nbsp;';
    //        html += '<span class="spanButton" onclick="$(\'.bwNewUserBusinessModelEditor\').bwNewUserBusinessModelEditor(\'displayDialog\', \'Create\');"><span style="font-size:15pt;display:inline-block;">⚙</span> Configure "Introductory Organization and Roles"&nbsp;&nbsp;</span>';

    //        //html += '&nbsp;&nbsp;&nbsp;&nbsp;';
    //        html += '<br /><br />';
    //        html += '<span class="spanButton" onclick="$(\'.bwNewUserWorkflowEditor\').bwNewUserWorkflowEditor(\'displayConfigureIntroductoryEmailDialog\', \'Create\');"><span style="font-size:15pt;display:inline-block;">⚙</span> Configure "Introductory Workflows"&nbsp;&nbsp;</span>';

    //        html += '&nbsp;&nbsp;&nbsp;&nbsp;';
    //        html += '<span class="spanButton" onclick="$(\'.bwNewUserChecklistsEditor\').bwNewUserChecklistsEditor(\'displayConfigureIntroductoryEmailDialog\', \'Create\');"><span style="font-size:15pt;display:inline-block;">⚙</span> Configure "Introductory Checklists"&nbsp;&nbsp;</span>';

    //        html += '&nbsp;&nbsp;&nbsp;&nbsp;';
    //        html += '<span class="spanButton" onclick="$(\'.bwNewUserFormsEditor\').bwNewUserFormsEditor(\'displayConfigureIntroductoryEmailDialog\', \'Create\');"><span style="font-size:15pt;display:inline-block;">⚙</span> Configure "Introductory Forms"&nbsp;&nbsp;</span>';

    //        html += '</span>';
    //        html += '<br />';
    //        html += '<br />';
    //        html += '               </td>';
    //        html += '           </tr>';
    //        html += '       </table>';
    //        html += '    </td>';
    //        html += '  </tr>';

    //        html += '</table>';



    //        html += '<table>';
    //        html += '  <tr>';
    //        html += '    <td style="text-align:left;vertical-align:top;" class="bwSliderTitleCell">';
    //        html += '<span style="font-size:12pt;white-space:normal;color:red;font-weight:bold;">';
    //        html += '       Deploy the new "Tenant/Organization Experience":&nbsp;'; // BwNewTenantSettings
    //        html += '</span>';
    //        html += '<br />';
    //        html += '<br />';
    //        //html += '<span style="font-size:12pt;white-space:normal;color:green;">This is what the new user will experience after creating their account or accepting an invitation...</span>';
    //        html += '    </td>';

    //        html += '    <td class="bwChartCalculatorLightCurrencyTableCell" style="vertical-align:top;">';
    //        html += '       <table>';
    //        html += '           <tr>';
    //        html += '               <td >';
    //        html += '                   <span id="xx" style="font-weight:bold;color:#009933;vertical-align:middle;">';




    //        html += '            Deploy to: <span id="spanChangeUserRoleDialogOrganizationOwnerDropDown2" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 22pt;font-weight:bold;vertical-align:top;">Organization picker:</span><br /><br />';


    //        //html += '<span style="white-space:nowrap;"><input id="cbChecklistRequired_f830e44a-d29f-4261-80c6-756236355e96" type="checkbox">&nbsp;Introductory Email&nbsp;<span style="font-style:italic;"></span></span>';
    //        //html += '<span style="white-space:nowrap;"><input id="cbChecklistRequired_f830e44a-d29f-4261-80c6-756236355e96" type="checkbox">&nbsp;Introductory Roles&nbsp;<span style="font-style:italic;"></span></span>';
    //        //html += '<span style="white-space:nowrap;"><input id="cbChecklistRequired_f830e44a-d29f-4261-80c6-756236355e96" type="checkbox">&nbsp;Introductory Organization and Roles&nbsp;<span style="font-style:italic;"></span></span>';
    //        //html += '<br />';
    //        //html += '<span style="white-space:nowrap;"><input id="cbChecklistRequired_f830e44a-d29f-4261-80c6-756236355e96" type="checkbox">&nbsp;Introductory Workflows&nbsp;<span style="font-style:italic;"></span></span>';
    //        //html += '<span style="white-space:nowrap;"><input id="cbChecklistRequired_f830e44a-d29f-4261-80c6-756236355e96" type="checkbox">&nbsp;Introductory Checklists&nbsp;<span style="font-style:italic;"></span></span>';
    //        //html += '<span style="white-space:nowrap;"><input id="cbChecklistRequired_f830e44a-d29f-4261-80c6-756236355e96" type="checkbox">&nbsp;Introductory Forms&nbsp;<span style="font-style:italic;"></span></span>';

    //        html += '<span class="spanButton" onclick="$(\'.bwNewUserEmailEditor\').bwNewUserEmailEditor(\'deployNewUserExperience\', \'Create\');"><span style="font-size:15pt;display:inline-block;">✉</span> Deploy "Introductory Email"&nbsp;&nbsp;</span>';

    //        html += '&nbsp;&nbsp;&nbsp;&nbsp;';
    //        html += '<span class="spanButton" onclick="$(\'.bwNewUserRolesEditor\').bwNewUserRolesEditor(\'deployNewUserExperience\', \'Create\');"><span style="font-size:15pt;display:inline-block;">⚙</span> Deploy "Introductory Roles"&nbsp;&nbsp;</span>';

    //        html += '&nbsp;&nbsp;&nbsp;&nbsp;';
    //        html += '<span class="spanButton" onclick="$(\'.bwNewUserBusinessModelEditor\').bwNewUserBusinessModelEditor(\'deployNewUserExperience\', \'Create\');"><span style="font-size:15pt;display:inline-block;">⚙</span> Deploy "Introductory Organization and Roles"&nbsp;&nbsp;</span>';

    //        //html += '&nbsp;&nbsp;&nbsp;&nbsp;';
    //        html += '<br /><br />';
    //        html += '<span class="spanButton" onclick="$(\'.bwNewUserWorkflowEditor\').bwNewUserWorkflowEditor(\'deployNewUserExperience\', \'Create\');"><span style="font-size:15pt;display:inline-block;">⚙</span> Deploy "Introductory Workflows"&nbsp;&nbsp;</span>';

    //        html += '&nbsp;&nbsp;&nbsp;&nbsp;';
    //        html += '<span class="spanButton" onclick="$(\'.bwNewUserChecklistsEditor\').bwNewUserChecklistsEditor(\'deployNewUserExperience\', \'Create\');"><span style="font-size:15pt;display:inline-block;">⚙</span> Deploy "Introductory Checklists"&nbsp;&nbsp;</span>';

    //        html += '&nbsp;&nbsp;&nbsp;&nbsp;';
    //        html += '<span class="spanButton" onclick="$(\'.bwNewUserFormsEditor\').bwNewUserFormsEditor(\'deployNewUserExperience\', \'Create\');"><span style="font-size:15pt;display:inline-block;">⚙</span> Deploy "Introductory Forms"&nbsp;&nbsp;</span>';


    //        html += '</span>';
    //        html += '<br />';
    //        html += '<br />';


    //        //html += '<button class="BwSmallButton" onclick="alert(\'This functionality is incomplete. Coming soon!\');">Deploy</button>';

    //        html += '               </td>';
    //        html += '           </tr>';
    //        html += '       </table>';
    //        html += '    </td>';
    //        html += '  </tr>';


    //        html += '</table>';












    //        html += '<table>';
    //        html += '  <tr>';
    //        html += '    <td style="text-align:left;vertical-align:top;" class="bwSliderTitleCell">';
    //        html += '<span style="font-size:12pt;white-space:normal;color:red;font-weight:bold;">';
    //        html += '       Log in as "Tenant/Organization Owner":&nbsp;'; // BwNewTenantSettings
    //        html += '</span>';
    //        html += '<br />';
    //        html += '<br />';
    //        //html += '<span style="font-size:12pt;white-space:normal;color:green;">This is what the new user will experience after creating their account or accepting an invitation...</span>';
    //        html += '    </td>';

    //        html += '    <td class="bwChartCalculatorLightCurrencyTableCell" style="vertical-align:top;">';
    //        html += '       <table>';
    //        html += '           <tr>';
    //        html += '               <td >';
    //        html += '                   <span id="xx" style="font-weight:bold;color:#009933;vertical-align:middle;">';




    //        html += '            <span id="spanLogInAsTenantOrganizationOwnerDropDown" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 22pt;font-weight:bold;vertical-align:top;">spanLogInAsTenantOrganizationOwnerDropDown</span>';
    //        html += '&nbsp;&nbsp;';
    //        html += '<span class="spanButton" onclick="$(\'.bwAuthentication\').bwAuthentication(\'logInAsTenantOrganizationOwner\', \'spanLogInAsTenantOrganizationOwnerDropDown\');"><span style="font-size:15pt;display:inline-block;">✉</span> Log In&nbsp;&nbsp;</span>';



    //        //html += '<button class="BwSmallButton" onclick="alert(\'This functionality is incomplete. Coming soon!\');">Deploy</button>';

    //        html += '               </td>';
    //        html += '           </tr>';
    //        html += '       </table>';
    //        html += '    </td>';
    //        html += '  </tr>';


    //        html += '</table>';
































    //        // Render the html.
    //        this.element.html(html);



    //        var button = document.getElementById('divNewUserEmailEditor_PreviewAndEditButton');
    //        button.innerHTML = '       ❐ Edit email HTML';
    //        $(button).unbind('click').click(function (error) {
    //            try {
    //                console.log('In renderEmailEditor.divNewUserEmailEditor_PreviewAndEditButton.click().');
    //                thiz.editEmail();
    //            } catch (e) {
    //                console.log('Exception in renderEmailEditor.divNewUserEmailEditor_PreviewAndEditButton.click(): ' + e.message + ', ' + e.stack);
    //            }
    //        });



    //        // List all of the Tenants/WorkflowApps in the drop down.
    //        $.ajax({
    //            url: thiz.options.operationUriPrefix + "_bw/bwtenantsfindall",
    //            type: "DELETE",
    //            contentType: 'application/json',
    //            success: function (tenants) {
    //                $.ajax({
    //                    url: thiz.options.operationUriPrefix + "_bw/bwworkflowapps",
    //                    type: "DELETE",
    //                    contentType: 'application/json',
    //                    success: function (workflowApps) {

    //                        var html = '';
    //                        html += '<select id="selectChangeUserRoleDialogOrganizationOwnerDropDown2" style="vertical-align:top;padding:5px 5px 5px 5px;">';
    //                        html += '<option value="" >Select a Tenant/Organization...</option>'; // data[i].bwWorkflows: [{ id: String, title: String, url: String }],
    //                        for (var i = 0; i < tenants.length; i++) {
    //                            for (var w = 0; w < workflowApps.length; w++) {
    //                                if (tenants[i].bwTenantId == workflowApps[w].bwTenantId) {
    //                                    html += '<option value="' + workflowApps[w].bwWorkflowAppId + '|' + workflowApps[w].bwWorkflowAppTitle + '" >' + workflowApps[w].bwWorkflowAppTitle + ': ' + tenants[i].bwTenantOwnerFriendlyName + ' (' + tenants[i].bwTenantOwnerEmail + ')</option>'; // data[i].bwWorkflows: [{ id: String, title: String, url: String }],
    //                                }
    //                            }
    //                        }
    //                        html += '</select>';
    //                        document.getElementById('spanChangeUserRoleDialogOrganizationOwnerDropDown2').innerHTML = html;

    //                        var html = '';
    //                        html += '<select id="selectChangeUserRoleDialogOrganizationOwnerDropDown3" style="vertical-align:top;padding:5px 5px 5px 5px;">';
    //                        html += '<option value="" >Select a Tenant/Organization...</option>'; // data[i].bwWorkflows: [{ id: String, title: String, url: String }],
    //                        for (var i = 0; i < tenants.length; i++) {
    //                            for (var w = 0; w < workflowApps.length; w++) {
    //                                if (tenants[i].bwTenantId == workflowApps[w].bwTenantId) {
    //                                    html += '<option value="' + workflowApps[w].bwTenantId + '|' + workflowApps[w].bwWorkflowAppTitle + '" >' + workflowApps[w].bwWorkflowAppTitle + ': ' + tenants[i].bwTenantOwnerFriendlyName + ' (' + tenants[i].bwTenantOwnerEmail + ')</option>'; // data[i].bwWorkflows: [{ id: String, title: String, url: String }],
    //                                }
    //                            }
    //                        }
    //                        html += '</select>';
    //                        document.getElementById('spanLogInAsTenantOrganizationOwnerDropDown').innerHTML = html;

    //                        //$('#btnUserRoleDialogChangeRole').bind('click', function () {
    //                        //    //debugger;
    //                        //    thiz.addUserToOrganizationAndSendEmail(bwParticipantId, bwParticipantFriendlyName, bwParticipantEmail, logonType);
    //                        //    //$("#AddUserToOrganizationDialog").dialog('close');
    //                        //});

    //                    },
    //                    error: function (data, errorCode, errorMessage) {
    //                        displayAlertDialog('Error in bwBackendAdministrationForAllParticipants.addThisUserToAnOrganization.bwworkflowapps():' + errorCode + ', ' + errorMessage);
    //                    }
    //                });

    //            },
    //            error: function (data, errorCode, errorMessage) {
    //                displayAlertDialog('Error in bwBackendAdministrationForAllParticipants.addThisUserToAnOrganization.bwtenantsfindall():' + errorCode + ', ' + errorMessage);
    //            }
    //        });

    //    } catch (e) {
    //        console.log('Exception in renderEmailEditor(): ' + e.message + ', ' + e.stack);
    //    }
    //},



    //previewEmail: function () {
    //    try {
    //        console.log('In previewEmail().');
    //        var thiz = this;
    //        var button = document.getElementById('divNewUserEmailEditor_PreviewAndEditButton');
    //        button.innerHTML = '       ❐ Edit email HTML';
    //        $(button).unbind('click').click(function (error) {
    //            try {
    //                console.log('In previewEmail.divNewUserEmailEditor_PreviewAndEditButton.click().');
    //                thiz.editEmail();
    //            } catch (e) {
    //                console.log('Exception in previewEmail.divNewUserEmailEditor_PreviewAndEditButton.click(): ' + e.message + ', ' + e.stack);
    //            }
    //        });

    //        var emailHtml = thiz.options.quill.getText();
    //        this.options.quill.container.firstChild.innerHTML = '';
    //        this.options.quill.clipboard.dangerouslyPasteHTML(0, emailHtml);

    //        this.options.CurrentEmailTemplate.DraftEmailTemplate.Body = emailHtml;
    //        this.checkIfWeHaveToDisplayThePublishChangesButton();
    //    } catch (e) {
    //        console.log('Exception in previewEmail(): ' + e.message + ', ' + e.stack);
    //    }
    //},
    //editEmail: function () {
    //    try {
    //        console.log('In editEmail().');
    //        var thiz = this;
    //        var button = document.getElementById('divNewUserEmailEditor_PreviewAndEditButton');
    //        button.innerHTML = '       ❏ Preview this email';
    //        $(button).unbind('click').click(function (error) {
    //            try {
    //                console.log('In editEmail.divNewUserEmailEditor_PreviewAndEditButton.click().');
    //                thiz.previewEmail();
    //            } catch (e) {
    //                console.log('Exception in editEmail.divNewUserEmailEditor_PreviewAndEditButton.click(): ' + e.message + ', ' + e.stack);
    //            }
    //        });
    //        var emailHtml = thiz.options.quill.container.firstChild.innerHTML;
    //        thiz.options.quill.container.firstChild.innerHTML = '';
    //        thiz.options.quill.setText(emailHtml);

    //        this.options.CurrentEmailTemplate.DraftEmailTemplate.Body = emailHtml;
    //        this.checkIfWeHaveToDisplayThePublishChangesButton();
    //    } catch (e) {
    //        console.log('Exception in editEmail(): ' + e.message + ', ' + e.stack);
    //    }
    //},

    //displayWorkflowsConfigurationDialog: function () {
    //    //alert('In displayWorkflowsConfigurationDialog(). This functionality is incomplete. Coming soon!');
    //    try {
    //        console.log('In displayWorkflowsConfigurationDialog().');
    //        //debugger;
    //        var isOpen = false;
    //        var selectedRequestType = 'all';
    //        try {
    //            if ($('#divNewUserEmailConfigurationDialog').dialog('isOpen')) {
    //                isOpen = true;
    //                $('#selectWorkflowRequestTypeDropDownInDialog2').find('option:selected').each(function (index, element) {
    //                    selectedRequestType = element.value;
    //                });
    //            }
    //        } catch (e) {
    //            // do nothing.
    //        }
    //        if (isOpen == false) {
    //            $('#divNewUserEmailConfigurationDialog').dialog({
    //                modal: true,
    //                resizable: false,
    //                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
    //                width: '1200',
    //                dialogClass: "no-close", // No close button in the upper right corner.
    //                hide: false, // This means when hiding just disappear with no effects.
    //                open: function () {
    //                    $('.ui-widget-overlay').bind('click', function () {
    //                        $("#divNewUserEmailConfigurationDialog").dialog('close');
    //                    });



    //                    $.contextMenu({
    //                        selector: '.context-menu-workflowsconfiguration',
    //                        //trigger: 'hover',
    //                        //    delay : 500,
    //                        callback: function (key, options) {
    //                            //var m = "clicked: " + key;
    //                            //window.console && console.log(m) || alert(m);
    //                            if (key == 'editworkflowjson') {
    //                                //cmdDisplayArchivePageTrashbinContents();
    //                                //alert('This functionality is incomplete. Coming soon! ')
    //                                thiz.displayEditWorkflowJsonDialog('xcxdontknow123');
    //                            }
    //                        },
    //                        items: {
    //                            "editworkflowjson": {
    //                                name: "Edit Workflow JSON", icon: "edit"
    //                            }
    //                        }
    //                    });



    //                }
    //            });
    //            //$("#divCreateANewRoleDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
    //        }

    //        // This can show up in a few places. On the "Configuration > Participants" page, in a modal dialog, etc.
    //        //console.log('In displayWorkflowsConfigurationDialog().'); //' + elementId + ').');
    //        var thiz = this;
    //        var html = '';
    //        //debugger;
    //        $.ajax({
    //            url: thiz.options.operationUriPrefix + "odata/WorkflowConfiguration2/" + thiz.options.bwTenantId + '/' + thiz.options.bwWorkflowAppId + '/' + selectedRequestType, //'all', //thiz.options.LastSelectedRequestType, //'budgetrequest', //
    //            dataType: "json",
    //            contentType: "application/json",
    //            type: "Get",
    //            timeout: thiz.options.ajaxTimeout
    //        }).done(function (result) {
    //            try {
    //                //debugger;
    //                var html = '';
    //                html += '<style>';
    //                html += '.dataGridTable { border: 1px solid gainsboro; font-size:14px; font-family: "Helvetica Neue","Segoe UI",Helvetica,Verdana,sans-serif; }';
    //                html += '.dataGridTable td { border-left: 0px; border-right: 1px solid gainsboro; }';
    //                html += '.headerRow { background-color:white; color:gray;border-bottom:1px solid gainsboro; }';
    //                html += '.headerRow td { border-bottom:1px solid gainsboro; padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
    //                html += '.filterRow td { border-bottom:1px solid whitesmoke; padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
    //                html += '.alternatingRowLight { background-color:white; }';
    //                html += '.alternatingRowLight td { padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
    //                html += '.alternatingRowLight:hover { background-color:lightgoldenrodyellow; }';
    //                html += '.alternatingRowDark { background-color:whitesmoke; }';
    //                html += '.alternatingRowDark td { padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
    //                html += '.alternatingRowDark:hover { background-color:lightgoldenrodyellow; }'; // 
    //                html += '.roleName { white-space:nowrap; }';
    //                html += '</style>';

    //                // File folder UI.
    //                html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
    //                html += '  <tr>';
    //                html += '    <td>';
    //                //
    //                html += '<br />';
    //                html += '<div class="codeSnippetContainer" id="code-snippet-4" xmlns="">';
    //                html += '    <div class="codeSnippetContainerTabs">';
    //                html += '        <div class="codeSnippetContainerTabSingle" dir="ltr"><a>&nbsp;&nbsp;Workflows&nbsp;&nbsp;</a></div>';
    //                html += '    </div>';
    //                html += '    <div class="codeSnippetContainerCodeContainer">';
    //                html += '        <div class="codeSnippetToolBar">';
    //                html += '            <div class="codeSnippetToolBarText">';
    //                html += '                <a name="CodeSnippetCopyLink" title="Copy to clipboard." style="display: none;" href="javascript:displayAlertDialog(\'Copy support is not yet implemented.\');">Copy</a>';
    //                html += '            </div>';
    //                html += '        </div>';
    //                html += '        <div class="codeSnippetContainerCode" id="CodeSnippetContainerCode_5207fb9c-60fd-402f-8729-5795651a5ad3" dir="ltr">';
    //                html += '            <div>';
    //                html += '                <span id="spanBwParticipantsConfiguration" style="font-size:x-small;">';
    //                // end File folder UI top section.

    //                html += '<table class="dataGridTable">';

    //                html += '  <tr style="font-size:10pt;font-weight:normal;color:black;">';
    //                html += '    <td></td>';
    //                html += '    <td colspan="9">';
    //                html += '       <span style="padding: 4px 4px 4px 4px;border:1px solid lightblue;cursor:pointer;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'cmdDisplayDeleteWorkflowsDialog\');">';
    //                html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png">&nbsp;Delete';
    //                html += '       </span>';
    //                html += '    </td>';
    //                html += '  </tr>';

    //                html += '  <tr class="headerRow">';
    //                html += '    <td><input type="checkbox" id="checkboxTogglePendingEmailCheckboxes" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'toggleWorkflowConfigurationCheckboxes\', this);" /></td>';
    //                html += '    <td>Request Type</td>';
    //                html += '    <td>Active</td>';
    //                html += '    <td>Created Date</td>';
    //                html += '    <td>Created By</td>';
    //                html += '    <td>^Last Modified Date</td>';
    //                html += '    <td>Last Modified By</td>';
    //                html += '    <td>Description</td>';
    //                html += '    <td>bwWorkflowJson</td>';
    //                html += '    <td></td>';
    //                html += '    <td></td>';
    //                html += '  </tr>';
    //                var alternatingRow = 'light'; // Use this to color the rows.
    //                for (var i = 0; i < result.value.length; i++) {
    //                    if (alternatingRow == 'light') {
    //                        html += '  <tr class="alternatingRowLight" style="cursor:pointer;" >';
    //                        alternatingRow = 'dark';
    //                    } else {
    //                        html += '  <tr class="alternatingRowDark" style="cursor:pointer;" >';
    //                        alternatingRow = 'light';
    //                    }
    //                    var isTheActiveWorkflow = Boolean(result.value[i].bwWorkflowActive);
    //                    if (result.value[i].bwWorkflowActive == true) {
    //                        html += '    <td><input disabled="" type="checkbox" class="workflowCheckbox" bwworkflowid="' + result.value[i].bwWorkflowId + '" /></td>';
    //                    } else {
    //                        html += '    <td><input type="checkbox" class="workflowCheckbox" bwworkflowid="' + result.value[i].bwWorkflowId + '" /></td>';
    //                    }

    //                    html += '       <td class="roleId">' + result.value[i].bwRequestType + '</td>';
    //                    if (result.value[i].bwWorkflowActive == true) {
    //                        html += '       <td class="roleName" style="color:green;">✔ ' + result.value[i].bwWorkflowActive + '</td>';
    //                    } else {
    //                        html += '       <td class="roleName" style="color:gray;">' + result.value[i].bwWorkflowActive + '</td>';
    //                    }
    //                    html += '       <td class="roleDetails">' + result.value[i].Created + '</td>';
    //                    html += '       <td class="roleDetails">' + result.value[i].CreatedBy + '</td>';
    //                    html += '       <td class="roleDetails">' + result.value[i].Modified + '</td>';
    //                    html += '       <td class="roleDetails">' + result.value[i].ModifiedByFriendlyName + '</td>';
    //                    html += '       <td class="roleDetails">' + result.value[i].bwWorkflowId + '</td>';

    //                    if (result.value[i].bwWorkflowJson) {
    //                        html += '       <td class="roleDetails">Ok</td>';
    //                    } else {
    //                        html += '<td></td>';
    //                    }

    //                    //if (result.value[i].bwWorkflowActive == true) {
    //                    //    html += '   <td></td>';
    //                    //} else {
    //                    html += '   <td><input style="padding:5px 10px 5px 10px;width:100px;" id="btnActivateRaciConfiguration" type="button" value="Activate" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayActivateSelectedWorkflowDialog\', \'' + result.value[i].bwWorkflowId + '\');" /></td>'; // thiz.options.LastSelectedRequestType
    //                    //}

    //                    html += '   <td><input style="padding:5px 10px 5px 10px;width:100px;" type="button" value="Edit JSON" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayEditWorkflowJsonDialog\', \'' + result.value[i].bwWorkflowId + '\');" /></td>';



    //                    html += '</tr>';
    //                }
    //                html += '</table>';

    //                // File folder UI bottom section.
    //                html += '<br />';
    //                html += '                </span>';
    //                html += '            </div>';
    //                html += '        </div>';
    //                html += '    </div>';
    //                html += '</div>';
    //                html += '<br />';
    //                html += '    </td>';
    //                html += '  </tr>';
    //                html += '</table>';
    //                // end File folder UI bottom section.

    //                html += '<div style="display:none;" id="divDeleteWorkflowsDialog">';
    //                html += '   <table style="width:100%;">';
    //                html += '       <tr>';
    //                html += '           <td style="width:90%;">';
    //                html += '               <span id="spanDeletePendingEmailsDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">Delete Workflows</span>';
    //                html += '           </td>';
    //                html += '           <td style="width:9%;"></td>';
    //                html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
    //                html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divDeleteWorkflowsDialog\').dialog(\'close\');">X</span>';
    //                html += '           </td>';
    //                html += '       </tr>';
    //                html += '   </table>';
    //                html += '   <br /><br />';
    //                html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
    //                html += '   <span id="spanDeleteWorkflowsDialogContentText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;">';
    //                html += '[spanDeleteWorkflowsDialogContentText]';
    //                html += '   </span>';
    //                html += '   <br /><br /><br />';
    //                html += '   <div class="divSignInButton" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'deleteSelectedWorkflows\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
    //                html += '       Delete the Workflows';
    //                html += '   </div>';
    //                html += '   <br /><br />';
    //                html += '   <div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em; font-weight: bold;" onclick="$(\'#divDeleteWorkflowsDialog\').dialog(\'close\');">';
    //                html += '       Cancel';
    //                html += '   </div>';
    //                html += '   <br /><br />';
    //                html += '</div>';

    //                document.getElementById('spanWorkflowsMaintenanceDialogContent').innerHTML = html;

    //            } catch (e) {
    //                console.log('Exception in renderWorkflowsDropDownList().done: ' + e.message + ', ' + e.stack);
    //            }
    //        }).fail(function (data, errorCode) {

    //            //lpSpinner.Hide();
    //            console.log(' : ' + JSON.stringify(data));
    //            var msg;
    //            if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
    //                msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
    //            } else {
    //                msg = JSON.stringify(data);
    //            }
    //            alert('Exception in bwWorkflowEditor.js.renderWorkflowsDropDownList().xx.Get: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
    //            console.log('Exception in bwWorkflowEditor.js.renderWorkflowsDropDownList().xx.Get: ' + JSON.stringify(data));
    //            //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
    //            //var error = JSON.parse(data.responseText)["odata.error"];
    //            //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
    //        });
    //    } catch (e) {
    //        console.log('Exception in displayWorkflowsConfigurationDialog(): ' + e.message + ', ' + e.stack)
    //    }
    //},

    //displayConfigureEmailNotificationsDialog: function (elementId) {
    //    try {
    //        console.log('In displayConfigureEmailNotificationsDialog().');
    //        try {
    //            console.log('In displayConfigureEmailNotificationsDialog(). elementId: ' + elementId);
    //            $.ajax({
    //                url: this.options.operationUriPrefix + "odata/Pillars",
    //                dataType: "json",
    //                contentType: "application/json",
    //                type: "Get",
    //                timeout: this.options.ajaxTimeout
    //            }).done(function (result) {
    //                try {
    //                    //console.log('In raci.html.displayPillarMultiPicker().Get[odata/Pillars].done: result: ' + JSON.stringify(result));
    //                    var availablePillars;
    //                    if (result) {
    //                        availablePillars = result.value;
    //                    } else {
    //                        console.log('In raci.html.displayConfigureEmailNotificationsDialog().Get[odata/Roles].done: result: ' + JSON.stringify(result));
    //                    }
    //                    // Get the "Cond" value.
    //                    var cond = $('#' + elementId).find('.cond').attr('bwOldValue'); // eg: 	$ProjectType~IM,FS,WS,ENV,PSM,IT,EXP
    //                    if (cond) {
    //                        // We have to parse out the selected/existing project types here.
    //                        var selectedPillars = cond.split('$PillarId~')[1];
    //                        if (selectedPillars && selectedPillars.indexOf('&') > -1) {
    //                            selectedPillars = selectedPillars.split('&')[0];
    //                        }
    //                    }
    //                    var html = '';
    //                    html += '<input type="hidden" id="ConfigureEmailNotificationsDialog_AssignmentElementId" value="' + elementId + '" />'; // This is how we will be able to look up the assignment row.
    //                    if (availablePillars) {
    //                        html += '<table>';
    //                        for (var i = 0; i < availablePillars.length; i++) {
    //                            html += '<tr class="pillarRow">';
    //                            // Iterate through the list to see if we have a selected one or not.
    //                            var isSelected = false;
    //                            if (selectedPillars) {
    //                                for (var p = 0; p < selectedPillars.split(',').length; p++) {
    //                                    if (availablePillars[i].PillarId == selectedPillars.split(',')[p]) {
    //                                        //console.log('availablePillars[i].PillarId: ' + availablePillars[i].PillarId + ', selectedPillars.split(',')[p]: ' + selectedPillars.split(',')[p]);
    //                                        isSelected = true;
    //                                    }
    //                                }
    //                            }
    //                            if (isSelected) {
    //                                html += '<td><input id="' + 'pillarCheckbox_' + i + '" type="checkbox" checked /></td>';
    //                            } else {
    //                                html += '<td><input id="' + 'pillarCheckbox_' + i + '" type="checkbox" /></td>';
    //                            }
    //                            html += '<td class="pillarId">' + availablePillars[i].PillarId + '</td>';
    //                            html += '<td>&nbsp;</td>';
    //                            html += '<td class="pillarName">' + availablePillars[i].Name + '</td>';
    //                            html += '</tr>';
    //                        }
    //                        html += '</table>';
    //                    } else {
    //                        html += 'No "Pillars" were available.';
    //                    }
    //                    $('#spanConfigureEmailNotificationsDialogContent').html(html);

    //                    $("#divConfigureNewUserEmailsDialog").dialog({
    //                        modal: true,
    //                        resizable: false,
    //                        //closeText: "Cancel",
    //                        closeOnEscape: false, // Hit the ESC key to hide! Yeah!
    //                        //title: 'Project Type picker',
    //                        width: '800',
    //                        dialogClass: 'no-close', // No close button in the upper right corner.
    //                        hide: false, // This means when hiding just disappear with no effects.
    //                        open: function () {
    //                            $('.ui-widget-overlay').bind('click', function () {
    //                                $('#divConfigureNewUserEmailsDialog').dialog('close');
    //                            });

    //                            //console.log('$(".ql-toolbar"): ' + JSON.stringify($('.ql-toolbar')));
    //                            //if (!document.getElementById('ConfigureEmailNotificationsDialogEditor').length || document.getElementById('ConfigureEmailNotificationsDialogEditor').length == 0) { // Check if it has been instantiated already.
    //                            //if (!document.getElementById('ConfigureEmailNotificationsDialogEditor').div == 'undefined') { // Check if it has been instantiated already.
    //                            //if (!$('.ql-toolbar')) {

    //                            var quill = new Quill('#ConfigureEmailNotificationsDialogEditor', {
    //                                modules: {
    //                                    toolbar: [
    //                                      [{ header: [1, 2, false] }],
    //                                      ['bold', 'italic', 'underline'],
    //                                      ['image', 'code-block']
    //                                    ]
    //                                },
    //                                placeholder: 'The enhanced notification email editor functionality is coming soon...', //'Compose an epic...',
    //                                theme: 'snow'  // or 'bubble'
    //                            });
    //                        },
    //                        close: function () {
    //                            $('#divConfigureNewUserEmailsDialog').dialog('destroy');
    //                        }
    //                    });
    //                    $('#divConfigureNewUserEmailsDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
    //                } catch (e) {
    //                    //lpSpinner.Hide();
    //                    console.log('Exception in raci.html.displayConfigureEmailNotificationsDialog().Get[odata/Pillars].done: ' + e.message + ', ' + e.stack);
    //                }
    //            }).fail(function (data) {
    //                //lpSpinner.Hide();
    //                var msg;
    //                if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
    //                    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
    //                } else {
    //                    msg = JSON.stringify(data);
    //                }
    //                alert('Error in raci.html.displayConfigureEmailNotificationsDialog().Get[odata/Pillars].fail: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
    //                console.log('Error in raci.html.displayConfigureEmailNotificationsDialog().Get[odata/Pillars].fail:' + JSON.stringify(data));
    //                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
    //                //var error = JSON.parse(data.responseText)["odata.error"];
    //                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
    //            });
    //        } catch (e) {
    //            console.log('Exception in displayConfigureEmailNotificationsDialog(): ' + e.message + ', ' + e.stack);
    //        }
    //    } catch (e) {
    //        console.log('Exception in displayConfigureEmailNotificationsDialog(): ' + e.message + ', ' + e.stack);
    //    }
    //},

    //previewEmailHtml: function () {
    //    try {
    //        console.log('In previewEmailHtml().');
    //        var thiz = this;
    //        var button = document.getElementById('divNewUserEmailEditor_PreviewAndEditButton');
    //        button.innerHTML = '       ❐ Edit email HTML';
    //        $(button).unbind('click').click(function (error) {
    //            try {
    //                console.log('In previewEmail.divNewUserEmailEditor_PreviewAndEditButton.click().');
    //                thiz.editEmailHtml();
    //            } catch (e) {
    //                console.log('Exception in previewEmail.divNewUserEmailEditor_PreviewAndEditButton.click(): ' + e.message + ', ' + e.stack);
    //            }
    //        });

    //        var emailHtml = thiz.options.quill.getText();
    //        this.options.quill.container.firstChild.innerHTML = '';
    //        this.options.quill.clipboard.dangerouslyPasteHTML(0, emailHtml);

    //        this.options.CurrentEmailTemplate.DraftEmailTemplate.Body = emailHtml;
    //        //this.checkIfWeHaveToDisplayThePublishChangesButton();
    //    } catch (e) {
    //        console.log('Exception in previewEmailHtml(): ' + e.message + ', ' + e.stack);
    //    }
    //},
    //editEmailHtml: function () {
    //    try {
    //        console.log('In editEmailHtml().');
    //        var thiz = this;
    //        var button = document.getElementById('divNewUserEmailEditor_PreviewAndEditButton');
    //        button.innerHTML = '       ❏ Preview this email';
    //        $(button).unbind('click').click(function (error) {
    //            try {
    //                console.log('In editEmailHtml.divNewUserEmailEditor_PreviewAndEditButton.click().');
    //                thiz.previewEmailHtml();
    //            } catch (e) {
    //                console.log('Exception in editEmailHtml.divNewUserEmailEditor_PreviewAndEditButton.click(): ' + e.message + ', ' + e.stack);
    //            }
    //        });
    //        var emailHtml = thiz.options.quill.container.firstChild.innerHTML;
    //        thiz.options.quill.container.firstChild.innerHTML = '';
    //        thiz.options.quill.setText(emailHtml);

    //        thiz.options.CurrentEmailTemplate.DraftEmailTemplate.Body = emailHtml;
    //        //this.checkIfWeHaveToDisplayThePublishChangesButton();
    //    } catch (e) {
    //        console.log('Exception in editEmailHtml(): ' + e.message + ', ' + e.stack);
    //    }
    //},
    //displayConfigureIntroductoryEmailDialog: function () {
    //    try {
    //        console.log('In displayConfigureIntroductoryEmailDialog().');
    //        debugger;
    //        var thiz = this;
    //        // Hit the database and get the introductory email for this organization/workflowApp.

    //        //$.ajax({
    //        //    url: this.options.operationUriPrefix + "_bw/OrganizationIntroductoryEmailSettings/" + workflowAppId,
    //        //    dataType: "json",
    //        //    contentType: "application/json",
    //        //    type: "Get",
    //        //    timeout: thiz.options.ajaxTimeout
    //        //}).done(function (result) {
    //        //    try {
    //        //if (result.message != 'SUCCESS') {
    //        //    alert('ERROR: ' + result.message);
    //        //} else {
    //        // Set the dialog sub title.
    //        var html = '';
    //        html += 'This email gets sent to a "New User" when they first join BudgetWorkflow.com.';

    //        document.getElementById('spanConfigureEmailNotificationsDialogSubTitle').innerHTML = html;

    //        //
    //        // Set the "Save" button.
    //        //
    //        //var html = '';
    //        //html += '<div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" onclick="alert(\'This functionality is incomplete. Coming soon!\');">';
    //        //html += '☑ Save this email template';
    //        //html += '</div>';
    //        //document.getElementById('spanConfigureEmailNotificationsDialogSaveButton').innerHTML = html;
    //        // Display the email editor.
    //        $("#divConfigureNewUserEmailsDialog").dialog({
    //            modal: true,
    //            resizable: false,
    //            //closeText: "Cancel",
    //            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
    //            //title: 'divConfigureNewUserEmailsDialog',
    //            width: '800',
    //            dialogClass: 'no-close', // No close button in the upper right corner.
    //            hide: false, // This means when hiding just disappear with no effects.
    //            open: function () {
    //                try {
    //                    $('.ui-widget-overlay').bind('click', function () {
    //                        $('#divConfigureNewUserEmailsDialog').dialog('close');
    //                    });








    //                    debugger; // Display the email editor. // 9-5-2021 THIS IS THE ONE THAT WORKS. COPY CODE FROM HERE TO editStepEmails() in bwNewUserEmailEditor. <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    //                    thiz.options.quillSubjectEditor = new Quill('#quillConfigureNewUserEmailsDialog_Subject', {
    //                        modules: {
    //                            toolbar: '#bwQuilltoolbarForSubject'
    //                        },
    //                        //placeholder: 'The enhanced notification email editor functionality is coming soon...', 
    //                        theme: 'snow'
    //                    });
    //                    // Hook up this button event so that the user can insert data items into the email.
    //                    var customButton1 = document.querySelector('#btnQuill_InsertADataItemForSubject');
    //                    customButton1.addEventListener('click', function () {
    //                        //console.log('btnQuill_InsertADataItem: This functionality is incomplete. Coming soon!');
    //                        thiz.displayEmailDataItemPickerDialog('subject');
    //                    });
    //                    //debugger;
    //                    thiz.options.quill = new Quill('#quillConfigureNewUserEmailsDialog_Body', {
    //                        modules: {
    //                            toolbar: '#bwQuilltoolbar'
    //                        },
    //                        //placeholder: 'The enhanced notification email editor functionality is coming soon...', 
    //                        theme: 'snow'
    //                    });


    //                    thiz.options.quillSubjectEditor.on('text-change', function (delta, oldDelta, source) {
    //                        //debugger;
    //                        thiz.options.userHasMadeChangesToTheEmailTemplate = true;
    //                        //thiz.checkIfWeHaveToDisplayThePublishChangesButton();
    //                    });

    //                    thiz.options.quill.on('text-change', function (delta, oldDelta, source) {
    //                        //debugger;
    //                        thiz.options.userHasMadeChangesToTheEmailTemplate = true;
    //                        //thiz.checkIfWeHaveToDisplayThePublishChangesButton();
    //                    });



    //                    // Hook up this button event so that the user can insert data items into the email.
    //                    var customButton = document.querySelector('#btnQuill_InsertADataItem');
    //                    customButton.addEventListener('click', function () {
    //                        //console.log('btnQuill_InsertADataItem: This functionality is incomplete. Coming soon!');
    //                        thiz.displayEmailDataItemPickerDialog('body');
    //                    });
    //                    //// Retrieve the email from the workflow and display it in the editor.


    //                    var button = document.getElementById('divNewUserEmailEditor_PreviewAndEditButton');
    //                    button.innerHTML = '       ❐ Edit email HTML';
    //                    $(button).unbind('click').click(function (error) {
    //                        try {
    //                            console.log('In renderEmailEditor.divNewUserEmailEditor_PreviewAndEditButton.click().');
    //                            thiz.editEmailHtml();
    //                        } catch (e) {
    //                            console.log('Exception in renderEmailEditor.divNewUserEmailEditor_PreviewAndEditButton.click(): ' + e.message + ', ' + e.stack);
    //                        }
    //                    });




    //                    //debugger;
    //                    var emailTemplateForSubject;
    //                    var emailTemplate;

    //                    // Yay, we got the email template from the database for this organization/workflowApp.
    //                    emailTemplate = thiz.options.CurrentEmailTemplate.EmailTemplate; //JSON.parse(result.bwIntroductoryEmailHtml);
    //                    emailTemplateForSubject = emailTemplate.Subject;
    //                    emailTemplate = emailTemplate.Body;


    //                    //var emailTemplateForSubject = thiz.options.CurrentEmailTemplate.EmailTemplate.Subject;
    //                    //var emailTemplate = thiz.options.CurrentEmailTemplate.EmailTemplate.Body;

    //                    if (emailTemplateForSubject && emailTemplateForSubject != '') {
    //                        thiz.options.quillSubjectEditor.setText(emailTemplateForSubject);
    //                    } else {
    //                        thiz.options.quillSubjectEditor.setText('xcx44');
    //                    }
    //                    //debugger;
    //                    if (emailTemplate && emailTemplate != '') {
    //                        //debugger;
    //                        thiz.options.quill.setText(''); // Do this first so we don't get double the email!
    //                        //thiz.options.quill.root.innerHTML = emailTemplate; //.setText(emailTemplate);
    //                        //thiz.options.quill.setText(emailTemplate);
    //                        thiz.options.quill.clipboard.dangerouslyPasteHTML(0, emailTemplate);
    //                    } else {
    //                        thiz.options.quill.setText('');
    //                    }


    //                } catch (e) {
    //                    console.log('Exception in bwWorkflowEditor._create().xx.Get:1: ' + e.message + ', ' + e.stack);
    //                }


    //            }
    //        });


    //    } catch (e) {
    //        console.log('Exception in displayConfigureIntroductoryEmailDialog(): ' + e.message + ', ' + e.stack);
    //    }
    //},


    //displayEmailDataItemPickerDialog: function (emailSection) { // emailSection is either 'subject' or 'body'.
    //    try {
    //        console.log('In displayEmailDataItemPickerDialog().');
    //        //
    //        //debugger;
    //        $("#divEmailDataItemPickerDialog").dialog({
    //            modal: true,
    //            resizable: false,
    //            //closeText: "Cancel",
    //            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
    //            //title: 'divEmailDataItemPickerDialog',
    //            width: '600',
    //            dialogClass: "no-close", // No close button in the upper right corner.
    //            hide: false, // This means when hiding just disappear with no effects.
    //            open: function () {
    //                $('.ui-widget-overlay').bind('click', function () {
    //                    $("#divEmailDataItemPickerDialog").dialog('close');
    //                });
    //                //document.getElementById('txtCreateANewRoleDialog_RoleId').value = document.getElementById('textNewRoleId').value;
    //                //document.getElementById('txtCreateANewRoleDialog_RoleName').value = document.getElementById('textNewRoleName').value;
    //            },
    //            close: function () {
    //                //$(this).dialog('destroy').remove();
    //                $('#divEmailDataItemPickerDialog').dialog('destroy');
    //            }
    //        });
    //        //$("#divEmailDataItemPickerDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
    //        //debugger;
    //        document.getElementById('spanEmailDataItemPickerDialogSubTitle').innerHTML = 'Data items use percentage delimiters, for example: %data item name%<br /><br />Select a data item then click the "Insert" button to have it inserted at the cursor...';
    //        var html = '';
    //        html += '<select id="selectEmailDataItemPickerDialogDataItem" style="padding:5px 5px 5px 5px;">';
    //        html += '   <option value="1">Select a data item...</option>';
    //        html += '   <option value="3">&#10697; Company Logo</option>';
    //        html += '   <option value="2">&#9863; Participant Friendly Name</option>';
    //        html += '   <option value="2">&#9863; Participant Email</option>';
    //        html += '   <option value="3">&#9992; Budget Request Link</option>';
    //        html += '   <option value="3">&#9993; Configure Email Settings Link</option>';
    //        html += '   <option value="3">&#9775; Disclaimer/Legal Text</option>';
    //        html += '   <option value="3">&#9746; Unsubscribe Link</option>';
    //        html += '   <option value="3">Budget Request Number</option>';
    //        html += '   <option value="3">Budget Request Title</option>'; // Project Title, or also known as "Description".
    //        html += '   <option value="3">Next Task Assignment Text</option>';
    //        html += '   <option value="3">Role Abbreviation</option>';
    //        html += '   <option value="3">Role Name</option>';
    //        html += '</select>';
    //        html += '&nbsp;&nbsp;';
    //        html += '<input style="padding:5px 10px 5px 10px;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'insertEmailDataItem\', \'' + emailSection + '\');" type="button" value="Insert">';
    //        document.getElementById('spanEmailDataItemPickerDialogContentTop').innerHTML = html;
    //    } catch (e) {
    //        console.log('Exception in displayEmailDataItemPickerDialog(): ' + e.message + ', ' + e.stack);
    //    }
    //},

    //checkIfWeHaveToDisplayThePublishChangesButton: function () {
    //    try {
    //        //debugger;
    //        console.log('In checkIfWeHaveToDisplayThePublishChangesButton4().');
    //        //var thereHaveBeenChangesToTheWorkflow = false;
    //        //var oldJsonString = JSON.stringify(this.options.CurrentEmailTemplate.EmailTemplate);
    //        //var newJsonString = JSON.stringify(this.options.CurrentEmailTemplate.DraftEmailTemplate);
    //        //if (oldJsonString != newJsonString) {
    //        //    thereHaveBeenChangesToTheWorkflow = true;
    //        //}
    //        if (this.options.userHasMadeChangesToTheEmailTemplate == true) {
    //            // The user has made changes to the workflow.
    //            document.getElementById('spanThereAreChangesToPublishText4').innerHTML = 'You have changes that won\'t be available until you publish: ';
    //            var html = '';
    //            html += '<input style="padding:5px 10px 5px 10px;width:100px;" id="btnSaveWorkflowConfigurationAndActivate" type="button" value="Publish" onclick="$(\'.bwNewUserEmailEditor\').bwNewUserEmailEditor(\'publishEmailTemplateConfigurationAndActivate\');" />';
    //            html += '&nbsp;<input style="padding:5px 10px 5px 10px;" id="btnCancelChangesInDraftWorkflowConfiguration" type="button" value="Cancel Changes" onclick="$(\'.bwNewUserEmailEditor\').bwNewUserEmailEditor(\'cancelChangesInDraftWorkflowConfiguration\');" />';
    //            document.getElementById('spanThereAreChangesToPublishButton4').innerHTML = html;
    //        } else {
    //            // Do nothing because the user has made no changes to the workflow.
    //            document.getElementById('spanThereAreChangesToPublishText4').innerHTML = '';
    //            document.getElementById('spanThereAreChangesToPublishButton4').innerHTML = '';
    //        }
    //    } catch (e) {
    //        console.log('Exception in checkIfWeHaveToDisplayThePublishChangesButton(): ' + e.message + ', ' + e.stack);
    //    }
    //},
    //publishEmailTemplateConfigurationAndActivate: function () {
    //    var thiz = this;
    //    try {
    //        console.log('In bwWorkflowEditor.js.publishEmailTemplateConfigurationAndActivate().');
    //        //debugger;
    //        var json = {
    //            Subject: thiz.options.quillSubjectEditor.getText(),
    //            Body: thiz.options.quill.container.firstChild.innerHTML
    //        };
    //        var json = {
    //            //bwIntroductoryEmailHtml: JSON.stringify(this.options.CurrentEmailTemplate.DraftEmailTemplate) // Stored as stringified json object eg: { Subject: null, Body: null }.
    //            bwIntroductoryEmailHtml: JSON.stringify(json)
    //        };
    //        $.ajax({
    //            url: thiz.options.operationUriPrefix + "_bw/PublishNewTenantIntroductoryEmailTemplate",
    //            type: "Post",
    //            timeout: thiz.options.ajaxTimeout,
    //            data: json,
    //            headers: {
    //                "Accept": "application/json; odata=verbose"
    //            }
    //        }).success(function (result) {
    //            try {
    //                if (result.message != 'SUCCESS') {
    //                    alert('ERROR: ' + result.message);
    //                } else {
    //                    console.log('In bwWorkflowEditor.js.publishEmailTemplateConfigurationAndActivate().post: Successfully updated DB. result: ' + JSON.stringify(result));
    //                    $("#divUndoNewUserEmailTemplateActivationDialog").dialog({
    //                        modal: true,
    //                        resizable: false,
    //                        //closeText: "Cancel",
    //                        closeOnEscape: false, // Hit the ESC key to hide! Yeah!
    //                        //title: 'Project Type picker',
    //                        width: '800',
    //                        dialogClass: 'no-close', // No close button in the upper right corner.
    //                        hide: false, // This means when hiding just disappear with no effects.
    //                        open: function () {
    //                            $('.ui-widget-overlay').bind('click', function () {
    //                                $('#divUndoNewUserEmailTemplateActivationDialog').dialog('close');
    //                            });

    //                            // re-sync this.options.store
    //                            thiz.options.CurrentEmailTemplate.EmailTemplate = JSON.parse(JSON.stringify(json));
    //                            thiz.options.CurrentEmailTemplate.DraftEmailTemplate = JSON.parse(JSON.stringify(json));
    //                            thiz.checkIfWeHaveToDisplayThePublishChangesButton();

    //                        },
    //                        close: function () {
    //                            $('#divUndoNewUserEmailTemplateActivationDialog').dialog("destroy");
    //                            //    //thiz._create(); // When the user closes this dialog, we regenerate the screen to reflect the newly created and activated workflow. <<< NOT NECESSARY!!!! ONLY USING FOR TESTING.
    //                            //    debugger;
    //                            //    thiz.checkIfWeHaveToDisplayThePublishChangesButton();
    //                        }
    //                    });
    //                    $('#divUndoNewUserEmailTemplateActivationDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
    //                }

    //            } catch (e) {
    //                console.log('Exception in publishEmailTemplateConfigurationAndActivate().xx.update: ' + e.message + ', ' + e.stack);
    //                alert('Exception in publishEmailTemplateConfigurationAndActivate().xx.update: ' + e.message + ', ' + e.stack);
    //            }
    //        }).error(function (data, errorCode, errorMessage) {
    //            debugger;
    //            //thiz.hideProgress();
    //            var msg;
    //            if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
    //                msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
    //            } else {
    //                msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
    //            }
    //            console.log('Fail in publishEmailTemplateConfigurationAndActivate().xx.update: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
    //            alert('Fail in publishEmailTemplateConfigurationAndActivate().xx.update: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
    //            //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
    //            //var error = JSON.parse(data.responseText)["odata.error"];
    //            //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
    //        });
    //    } catch (e) {
    //        debugger;
    //        //thiz.hideProgress();
    //        alert('Exception in publishEmailTemplateConfigurationAndActivate(): ' + e.message + ', ' + e.stack);
    //        console.log('Exception in publishEmailTemplateConfigurationAndActivate(): ' + e.message + ', ' + e.stack);
    //    }
    //},
    //cancelChangesInDraftWorkflowConfiguration: function () {
    //    try {
    //        debugger;
    //        console.log('In cancelChangesInDraftWorkflowConfiguration().');
    //        this.options.CurrentEmailTemplate.EmailTemplate = JSON.parse(JSON.stringify(this.options.CurrentEmailTemplate.DraftEmailTemplate)); // Creating "DraftWorkflow" so we can tell if the workflow has been changed or not, and then inform the user that changes need to be published.
    //        this.renderEmailEditor(); // Definition is renderWorkflowEditor(assignmentRowChanged_ElementId).
    //    } catch (e) {
    //        console.log('Exception in cancelChangesInDraftWorkflowConfiguration(): ' + e.message + ', ' + e.stack);
    //    }
    //},
});