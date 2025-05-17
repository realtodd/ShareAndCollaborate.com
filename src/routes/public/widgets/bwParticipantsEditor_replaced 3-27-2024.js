$.widget("bw.bwParticipantsEditor", {
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
        This is the bwParticipantsEditor.js jQuery Widget. 
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
        //bwTenantId: null,
        //bwWorkflowAppId: null,
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
        this.element.addClass("bwParticipantsEditor");
        var thiz = this; // Need this because of the asynchronous operations below.

        //var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
        //var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
        //var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
        //var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
        //var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

        //debugger;
        try {

            selfDiscoverOperationUri(thiz); // This sets this.options.operationUriPrefix correctly.

            this.loadAndRenderParticipantsEditor();

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwParticipantsEditor: CANNOT RENDER</span>';
            html += '<br />';
            html += '<span style="">Exception in bwParticipantsEditor.Create(): ' + e.message + ', ' + e.stack + '</span>';
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

    loadAndRenderParticipantsEditor: function (force) {
        try {
            console.log('In loadAndRenderParticipantsEditor().');
            var thiz = this;

            // 
            // Load this object first so we don't have to keep making web service calls.
            //
            if ((!force) && (this.options.store != null)) {

                this.renderParticipantsEditor();

            } else {
                // this.options.store was null, or force was set to true, so go get it from the database.

                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');
                var data = {
                    bwWorkflowAppId_LoggedIn: workflowAppId,
                    bwParticipantId_LoggedIn: participantId,
                    bwActiveStateIdentifier: activeStateIdentifier,
                    bwWorkflowAppId: workflowAppId
                };
                $.ajax({
                    url: this.options.operationUriPrefix + "_bw/workflow/participants",
                    type: "POST",
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    success: function (pdata) {
                        try {

                            thiz.options.store = pdata;
                            thiz.renderParticipantsEditor();

                        } catch (e) {
                            console.log('Exception in bwParticipantsEditor.loadAndRenderParticipantsEditor():2: ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in bwParticipantsEditor.loadAndRenderParticipantsEditor():2: ' + e.message + ', ' + e.stack);
                        }
                    },
                }).fail(function (data) {
                    var msg;
                    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                    } else {
                        msg = JSON.stringify(data);
                    }
                    console.log('Fail in bwParticipantsEditor.loadAndRenderParticipantsEditor(): ' + msg + ', data: ' + JSON.stringify(data));
                    alert('Fail in bwParticipantsEditor.loadAndRenderParticipantsEditor(): ' + msg + ', data: ' + JSON.stringify(data));

                });
            }

        } catch (e) {
            console.log('Exception in bwParticipantsEditor.loadAndRenderParticipantsEditor(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwParticipantsEditor.loadAndRenderParticipantsEditor(): ' + e.message + ', ' + e.stack);
        }
    },

    renderParticipantsEditor: function () {
        try {
            console.log('In renderParticipantsEditor().');
            var thiz = this;

            var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            //debugger;
            $('#bwQuickLaunchMenuTd').css({
                width: '0'
            }); // This gets rid of the jumping around.

            $('#divFunctionalAreasMasterDiv').empty(); // Clear the div and rebuild it with out new 'Departments' title.
            $('#divFunctionalAreasMasterSubMenuDiv').hide(); //This is the top bar which we want to hide in this case.
            var html = '';
            html += '<table style="border-width: 0px; margin: 0px; padding: 0px; width: 100%;"><tbody><tr style="border-width: 0px; margin: 0px; padding: 0px;"><td style="border-width: 0px; margin: 0px; padding: 0px;">';
            html += 'Participants: <span style="font-weight:bold;color:#95b1d3;">Manage the participants in this organization...</span>';
            html += '</td></tr></tbody></table>';
            $('#divFunctionalAreasMasterDiv').html(html);
            //
            //disableParticipantsButton();
            //
            //$('#divFunctionalAreasButton').css({'background-color':'#6682b5'});
            //
            //$('#divParticipants').css({ 'height': '28px', 'width': '82%', 'white-space': 'nowrap', 'border-radius': '0 0 0 0', 'padding': '12px 0 0 20px', 'margin': '0 0 0 20px', 'border-width': '0 0 0 0', 'background-color': '#6682b5' });
            //
            //$('#divFunctionalAreasSubSubMenus').empty();
            var html = '';

            html += '<div id="divBwInvitation"></div>';
            // Include jquery-ui stylesheet.
            //html += '<link rel="stylesheet" href="css/jquery/1.11.1/themes/smoothness/jquery-ui.min.css?v=0">'; // removed 8-18-2022



            html += '<div style="display:none;" id="ChangeUserRoleDialog">';
            html += '    <table style="width:100%;">';
            html += '        <tr>';
            html += '            <td style="width:90%;">';
            html += '                <span id="spanChangeUserRoleDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;"></span>';
            html += '            </td>';
            html += '            <td style="width:9%;"></td>';
            html += '            <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '                <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#ChangeUserRoleDialog\').dialog(\'close\');">X</span>';
            html += '            </td>';
            html += '        </tr>';
            html += '    </table>';
            html += '    <br /><br />';
            html += '    <!--<span id="spanChangeUserRoleDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 22pt;font-weight:bold;">Change the role for...</span><br /><br />-->';
            html += '    <!--<input type="radio" name="xxrbChangeUserRole" id="xxrbChangeUserRole1" value="vendor" disabled />&nbsp;<span style="font-style:italic;color:lightgray;"><span style="color:black;">Vendor or Partner</span></span><br />-->';

            html += '    <input type="radio" name="rbChangeUserRole" id="rbChangeUserRole5" value="customer" onmouseout="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'updateInvitationSecurityRole_Mouseout\', this);" onchange="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'selectInvitationUserRole_Onchange\', this);" />';
            html += '    Customer&nbsp;';
            html += '    <span style="font-size:10pt;font-style:italic;">Can view specific requests.</span><br />';

            html += '    <input type="radio" name="rbChangeUserRole" id="rbChangeUserRole0" value="vendor" onmouseout="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'updateInvitationSecurityRole_Mouseout\', this);" onchange="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'selectInvitationUserRole_Onchange\', this);" />';
            html += '    Vendor&nbsp;';
            html += '    <span style="font-size:10pt;font-style:italic;">Can participate in workflow task assignments.</span><br />';
            html += '    <input type="radio" name="rbChangeUserRole" id="rbChangeUserRole1" value="participant" />&nbsp;Participant&nbsp;<span style="font-size:10pt;font-style:italic;">Can create requests and participate in workflow task assignments.</span><br />';
            html += '    <input type="radio" name="rbChangeUserRole" id="rbChangeUserRole1" value="archiveviewer" />&nbsp;Archive Viewer&nbsp;<span style="font-size:10pt;font-style:italic;">Can view all requests, and is able to delete them.</span><br />';
            html += '   <input type="radio" name="rbChangeUserRole" id="rbChangeUserRole1" value="reportviewer" />&nbsp;Report Viewer&nbsp;<span style="font-size:10pt;font-style:italic;">Can track spending and use analysis tools.</span><br />';
            html += '   <input type="radio" checked="checked" name="rbChangeUserRole" id="rbChangeUserRole1" value="configurationmanager" />&nbsp;Configuration Manager&nbsp;<span style="font-size:10pt;font-style:italic;">Like the owner, they can do anything.</span><br />';
            html += '    <br /><br />';
            html += '    <input type="checkbox" id="cbUserRoleDialogEmailMessage" />&nbsp;';
            html += '    <span id="spanUserRoleDialogEmailMessageText"></span>';
            html += '    <textarea id="txtUserRoleDialogEmailMessage" rows="4" cols="60"></textarea>';
            html += '    <br /><br />';
            html += '   <div id="btnUserRoleDialogChangeRole" class="divSignInButton" style="width:90%;text-align:center;line-height:0.8em;font-weight:bold;">';
            html += '       Change Role';
            html += '   </div>';
            html += '   <br /><br />';
            html += '   <div id="xxxx" class="divSignInButton" style="width:90%;text-align:center;line-height:0.8em;font-weight:bold;" onclick="$(\'#ChangeUserRoleDialog\').dialog(\'close\');">';
            html += '        Close';
            html += '    </div>';
            html += '    <br /><br />';
            html += '</div>';



            html += '<div style="display:none;" id="divParticipantOrgRolePickerDialog">';
            html += '  <table style="width:100%;">';
            html += '    <tr>';
            html += '      <td style="width:90%;">';
            html += '        <span id="spanParticipantOrgRolePickerDialog_HeaderTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Insert a data item</span>';
            html += '                    <br />';
            html += '                    <span id="spanParticipantOrgRolePickerDialog_HeaderTitle2" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:15pt;font-weight:normal;"></span>';
            html += '      </td>';
            html += '      <td style="width:9%;"></td>';
            html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divParticipantOrgRolePickerDialog\').dialog(\'close\');">X</span>';
            html += '      </td>';
            html += '    </tr>';
            html += '  </table>';
            html += '  <br /><br />';
            html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '  <span id="spanParticipantOrgRolePickerDialogContent">[spanParticipantOrgRolePickerDialogContent]</span>';
            html += '    <br />';
            html += '    <br />';
            html += '  <span id="spanParticipantOrgRolePickerDialogContent_Bottom">[spanParticipantOrgRolePickerDialogContent_Bottom]</span>';
            html += '    <br />';
            html += '    <br />';
            html += '    <br />';
            html += '    <span id="spanEmailDataItemPickerDialogContentBottomxx" style="font-weight:bold;cursor:pointer;">';
            html += '    </span>';
            html += '   <div id="divParticipantOrgRolePickerDialog_PublishButton"></div>';
            html += '   <br /><br />';
            html += '   <div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" onclick="$(\'#divParticipantOrgRolePickerDialog\').dialog(\'close\');">';
            html += '       Close';
            html += '   </div>';
            html += '   <br /><br />';
            html += '</div>';

            html += '<div style="display:none;" id="divUndoOrgRolesActivationDialog2">';
            html += '  <table style="width:100%;">';
            html += '    <tr>';
            html += '      <td style="width:90%;">';
            html += '        <span id="spanUndoOrgRolesActivationTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Organization UPDATED</span>';
            html += '      </td>';
            html += '      <td style="width:9%;"></td>';
            html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divUndoOrgRolesActivationDialog2\').dialog(\'close\');">X</span>';
            html += '      </td>';
            html += '    </tr>';
            html += '  </table>';
            html += '  <br /><br />';
            html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '  <span id="spanUndoOrgRolesActivationContent" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:20pt;">';
            html += '    The organization has been updated. The changes will immediately impact the future workflow processes. ';
            html += '    <br />';
            html += '    <br />';
            html += '    <br />';
            html += '    <br />';
            html += '</div>';

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
            html += '   <div id="bwQuilltoolbarForSubject">';
            html += '       <button id="btnQuill_InsertADataItemForSubject" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
            html += '   </div>';
            html += '   <div id="quillConfigureNewUserEmailsDialog_Subject" style="height:50px;"></div>'; // Quill.
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
            html += '   <div id="divNewUserEmailEditor_PreviewAndEditButton" class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;"></div>';
            html += '   <br /><br />';

            html += '   <div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'publishEmailTemplateConfigurationAndActivate\');">';
            html += '   ☑ Publish this email template';
            html += '   </div>';
            html += '   <br /><br />';

            html += '</div>';


            html += '<div style="display:none;" id="ReassignUserTasksDialog">';
            html += '        <table style="width:100%;">';
            html += '            <tr>';
            html += '                <td style="width:90%;">';
            html += '                    <span id="spanReassignUserTasksDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;"></span>';
            html += '                </td>';
            html += '                <td style="width:9%;"></td>';
            html += '                <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '                    <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#ReassignUserTasksDialog\').dialog(\'close\');">X</span>';
            html += '                </td>';
            html += '            </tr>';
            html += '        </table>';
            html += '        <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '        <!--<span id="spanReassignUserTasksDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 22pt;font-weight:bold;">Reassign user from this workflow.</span>-->';
            html += '        <br /><br />';
            html += '        <span id="spanReassignUserTasksDialogUserDependencyDetails"></span>';
            html += '        <br />';
            html += '        <span id="spanReassignUserTasksDialogChooseAUserSection">';
            html += '            <span id="spanReassignUserTasksDialogUserToReassignFriendlyName"></span>:';
            html += '            <span style="white-space:nowrap;">';
            html += '                <input contenteditable="false" id="txtReassignUserTasksDialogUserToReplaceFriendyName" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'displayPeoplePickerDialog\', \'txtReassignUserTasksDialogUserToReplaceFriendyName\', \'txtReassignUserTasksDialogUserToReplaceId\', \'txtReassignUserTasksDialogUserToReplaceEmail\');" title="" />';
            html += '&nbsp;<img src="images/addressbook-icon18x18.png" id="txtReassignUserTasksDialogUserToReplacePeoplePicker" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'displayPeoplePickerDialog\', \'txtReassignUserTasksDialogUserToReplaceFriendyName\', \'txtReassignUserTasksDialogUserToReplaceId\', \'txtReassignUserTasksDialogUserToReplaceEmail\');" style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" />';
            html += '            </span>';
            html += '            <input id="txtReassignUserTasksDialogUserToReplaceId" style="display:none;" />';
            html += '            <input id="txtReassignUserTasksDialogUserToReplaceEmail" style="display:none;" />';
            html += '        </span>';
            //html += '        <span id="spanReassignUserTasksDialogEmailMessage">';
            //html += '            &nbsp;&nbsp;&nbsp;&nbsp;';
            //html += '            <input type="checkbox" id="cbReassignUserTasksDialogEmailMessage" />&nbsp;';
            //html += '            <span id="spanReassignUserTasksDialogEmailMessageText" style="font-size:small;">';
            //html += '                Email me the details for my records.';
            //html += '            </span>';
            //html += '        </span>';

            html += '        <br /><br />';
            html += '        <span style="font-size:small;font-style:italic;">';

            html += 'A summary will be emailed.';
            html += '<br />';
            html += '            Reassigning responsibilities allows you to continue if someone is not available to participate at the moment, but you still want to keep them listed here as a participant so that they can create new budget requests and other functionality. If you just want to remove them, click on the trash can to delete them and the tasks will be reassigned as you specify.';
            html += '        </span>';
            html += '        <br /><br />';
            html += '        <span id="spanReassignUserTasksDialogReassignTasksButton">';
            html += '            <!--<div id="btnReassignUserTasksDialogReassignTasks" class="divSignInButton" style="width:90%;text-align:center;line-height:0.8em;font-weight:bold;">';
            html += '                Reassign Now!';
            html += '            </div>-->';
            html += '        </span>';
            html += '        <br /><br />';
            html += '        <div id="xxxx" class="divSignInButton" style="width:90%;text-align:center;line-height:0.8em;font-weight:bold;" onclick="$(\'#ReassignUserTasksDialog\').dialog(\'close\');">';
            html += '            Close';
            html += '        </div>';
            html += '        <br /><br />';
            html += '    </div>';




























            //html += '<h2>Participants Editor</h2>';

            //html += '                           <span class="printButton" title="print" onclick="cmdPrintForm();">&#x1f5a8;</span>';

            var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');

            html += '<table style="width:100%;" class="context-menu-bwroleseditor2">';
            html += '   <tr>';
            html += '       <td>';
            //html += '           <h2>';
            //html += '           Participants Editor: <span style="color:#95b1d3;">Manage the participants in this organization...&nbsp;<span id="spanParticipantsEditorEllipsesContextMenuButton" class="spanButton context-menu-bwroleseditor2" style="height:20px;width:150px;"> ... </span></span>'; // Velvet Morning is #95b1d3. This was the pantone color of the day for December 9, 2019! :D
            html += '           <span style="color:black;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 35pt;font-weight:bold;">Manage the participants in this organization.&nbsp;';

            if (developerModeEnabled == true) {
                html += '               <span id="spanParticipantsEditorEllipsesContextMenuButton" class="spanButton context-menu-bwroleseditor2" style="height:20px;width:150px;"> ... </span>';
            }

            html += '           </span>'; // Velvet Morning is #95b1d3. This was the pantone color of the day for December 9, 2019! :D

            //html += '           </h2>';
            html += '       </td>';
            html += '       <td style="text-align:right;">';


            if (developerModeEnabled == true) {
                html += '           <span class="printButton" title="print" onclick="cmdPrintForm();">&#x1f5a8;</span>';
            }

            html += '       </td>';
            html += '   </tr>';
            html += '</table>';


            html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;" class="context-menu-bwroleseditor2">';
            html += '  <tr>';
            html += '    <td>';
            //
            html += '<br />';
            html += '<div class="codeSnippetContainer" id="code-snippet-4" xmlns="">';
            html += '    <div class="codeSnippetContainerTabs">';
            html += '        <div class="codeSnippetContainerTabSingle" dir="ltr"><a>&nbsp;&nbsp;Participants&nbsp;&nbsp;</a></div>';
            html += '    </div>';
            html += '    <div class="codeSnippetContainerCodeContainer">';
            html += '        <div class="codeSnippetToolBar">';
            html += '            <div class="codeSnippetToolBarText">';
            html += '                <a name="CodeSnippetCopyLink" title="Copy to clipboard." style="display: none;" href="javascript:displayAlertDialog(\'Copy support is not yet implemented.\');">Copy</a>';
            html += '            </div>';
            html += '        </div>';
            html += '        <div class="codeSnippetContainerCode" id="CodeSnippetContainerCode_5207fb9c-60fd-402f-8729-5795651a5ad3" dir="ltr">';
            html += '            <div>';
            html += '                <span id="spanBwParticipantsConfiguration" style="font-size:x-small;">';
            //debugger;
            var pdata = this.options.store.BwWorkflowUsers;

            var bwParticipantId_Admin;

            if (this.options.store.BwWorkflowUserRoleAdmin && this.options.store.BwWorkflowUserRoleAdmin.length == 1) {
                bwParticipantId_Admin = this.options.store.BwWorkflowUserRoleAdmin[0].bwParticipantId;
            }

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


            html += '<div style="height:500px;overflow-y: scroll;">';


            html += '<table class="dataGridTable">';
            html += '  <tr class="headerRow">';
            html += '    <td></td>';
            html += '    <td>';
            html += '       Name';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'sortDataGrid\', \'NAME\', \'descending\', this);">           <img src="images/descending.png" style="width:25px;vertical-align:middle;">       </span>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'sortDataGrid\', \'NAME\', \'ascending\', this);">           <img src="images/ascending.png" style="width:25px;vertical-align:middle;">       </span>';
            html += '    </td>';
            html += '    <td>';
            html += '       Email';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'sortDataGrid\', \'EMAIL\', \'descending\', this);">           <img src="images/descending.png" style="width:25px;vertical-align:middle;">       </span>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'sortDataGrid\', \'EMAIL\', \'ascending\', this);">           <img src="images/ascending.png" style="width:25px;vertical-align:middle;">       </span>';
            html += '    </td>';
            html += '    <td>';
            html += '       Id';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'sortDataGrid\', \'ID\', \'descending\', this);">           <img src="images/descending.png" style="width:25px;vertical-align:middle;">       </span>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'sortDataGrid\', \'ID\', \'ascending\', this);">           <img src="images/ascending.png" style="width:25px;vertical-align:middle;">       </span>';
            html += '    </td>';
            html += '    <td>';
            html += '       Joined the Organization';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'sortDataGrid\', \'JOINED_THE_ORGANIZATION\', \'descending\', this);">           <img src="images/descending.png" style="width:25px;vertical-align:middle;">       </span>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'sortDataGrid\', \'JOINED_THE_ORGANIZATION\', \'ascending\', this);">           <img src="images/ascending.png" style="width:25px;vertical-align:middle;">       </span>';
            html += '    </td>';
            html += '    <td>';
            html += '       Logon Provider';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'sortDataGrid\', \'LOGON_PROVIDER\', \'descending\', this);">           <img src="images/descending.png" style="width:25px;vertical-align:middle;">       </span>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'sortDataGrid\', \'LOGON_PROVIDER\', \'ascending\', this);">           <img src="images/ascending.png" style="width:25px;vertical-align:middle;">       </span>';
            html += '    </td>';
            html += '    <td>';
            html += '       Security Role';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'sortDataGrid\', \'SECURITY_ROLE\', \'descending\', this);">           <img src="images/descending.png" style="width:25px;vertical-align:middle;">       </span>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'sortDataGrid\', \'SECURITY_ROLE\', \'ascending\', this);">           <img src="images/ascending.png" style="width:25px;vertical-align:middle;">       </span>';
            html += '    </td>';
            html += '    <td></td>';
            html += '    <td></td>';
            html += '    <td></td>';
            html += '  </tr>';

            var participantsImageFetchingInformation = [];
            var alternatingRow = 'light'; // Use this to color the rows.
            for (var i = 0; i < pdata.length; i++) {
                var adminRoleMessage = '';
                if (alternatingRow == 'light') {

                    if ((pdata[i].bwParticipantRole == 'emailrecipient')) {
                        html += '  <tr class="alternatingRowLight">';
                    } else {
                        //html += '  <tr class="alternatingRowLight" style="cursor:pointer;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayParticipantRoleMultiPickerInACircle\', true, \'' + 'btnEditRaciRoles_' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantFriendlyName + '\', \'' + pdata[i].bwParticipantEmail + '\', \'' + pdata[i].bwParticipantLogonType + '\');">';
                        html += '  <tr class="alternatingRowLight">';
                    }

                    html += '    <td>';
                    html += '       <img xcx="xcx88356-1" id="participantsEditorParticipantsListItem_' + i + '" style="cursor:pointer;width:50px;height:50px;" src="' + thiz.options.operationUriPrefix + 'images/businesswoman2.png' + '" ';
                    html += '           onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayParticipantRoleMultiPickerInACircle\', true, \'' + 'btnEditRaciRoles_' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantFriendlyName + '\', \'' + pdata[i].bwParticipantEmail + '\', \'' + pdata[i].bwParticipantLogonType + '\');" ';
                    html += '       />';
                    html += '   </td>';
                    alternatingRow = 'dark';
                } else {

                    if ((pdata[i].bwParticipantRole == 'emailrecipient')) {
                        html += '  <tr class="alternatingRowDark">';
                    } else {
                        //html += '  <tr class="alternatingRowDark" style="cursor:pointer;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayParticipantRoleMultiPickerInACircle\', true, \'' + 'btnEditRaciRoles_' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantFriendlyName + '\', \'' + pdata[i].bwParticipantEmail + '\', \'' + pdata[i].bwParticipantLogonType + '\');">';
                        html += '  <tr class="alternatingRowDark">';
                    }

                    html += '    <td>';
                    html += '       <img  xcx="xcx88356-2" id="participantsEditorParticipantsListItem_' + i + '" style="cursor:pointer;width:50px;height:50px;" src="' + thiz.options.operationUriPrefix + 'images/userimage.png' + '" ';
                    html += '           onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayParticipantRoleMultiPickerInACircle\', true, \'' + 'btnEditRaciRoles_' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantFriendlyName + '\', \'' + pdata[i].bwParticipantEmail + '\', \'' + pdata[i].bwParticipantLogonType + '\');" ';
                    html += '       />';
                    html += '   </td>';
                    alternatingRow = 'light';
                }


                // Use this to retrieve the images after the fact, farther below in this code.
                var participantImageFetchingInformation = {
                    imageId: 'participantsEditorParticipantsListItem_' + i,
                    bwParticipantId: pdata[i].bwParticipantId
                };
                participantsImageFetchingInformation.push(participantImageFetchingInformation);


                if ((pdata[i].bwParticipantRole == 'emailrecipient')) {

                    // No click event for this row.
                    html += '    <td>' + pdata[i].bwParticipantFriendlyName + '</td>';
                    html += '    <td>' + pdata[i].bwParticipantEmail + '</td>';
                    html += '    <td>' + pdata[i].bwParticipantId + '</td>';

                    // Joined the organization.
                    var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(pdata[i].Created);
                    html += '    <td>' + timestamp4 + '</td>';

                    var _logonType = pdata[i].bwParticipantLogonType;
                    if (_logonType == 'custom') {
                        _logonType = 'BudgetWorkflow.com';
                    } else if (_logonType == 'microsoft') {
                        _logonType = 'Microsoft';
                    }
                    html += '    <td>' + _logonType + '</td>';

                    // Check if this user is an admin. If so, reflect this in the UI.
                    if (bwParticipantId_Admin) {
                        if (bwParticipantId_Admin == pdata[i].bwParticipantId) {
                            adminRoleMessage = ' / ADMIN';
                        }
                    }
                    html += '    <td>' + pdata[i].bwParticipantRole + adminRoleMessage + '</td>';

                } else {

                    // Need click event for this row.
                    html += '    <td style="cursor:pointer;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayParticipantRoleMultiPickerInACircle\', true, \'' + 'btnEditRaciRoles_' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantFriendlyName + '\', \'' + pdata[i].bwParticipantEmail + '\', \'' + pdata[i].bwParticipantLogonType + '\');">' + pdata[i].bwParticipantFriendlyName + '</td>';
                    html += '    <td style="cursor:pointer;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayParticipantRoleMultiPickerInACircle\', true, \'' + 'btnEditRaciRoles_' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantFriendlyName + '\', \'' + pdata[i].bwParticipantEmail + '\', \'' + pdata[i].bwParticipantLogonType + '\');">' + pdata[i].bwParticipantEmail + '</td>';
                    html += '    <td style="cursor:pointer;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayParticipantRoleMultiPickerInACircle\', true, \'' + 'btnEditRaciRoles_' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantFriendlyName + '\', \'' + pdata[i].bwParticipantEmail + '\', \'' + pdata[i].bwParticipantLogonType + '\');">' + pdata[i].bwParticipantId + '</td>';

                    // Joined the organization.
                    var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(pdata[i].Created);
                    html += '    <td style="cursor:pointer;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayParticipantRoleMultiPickerInACircle\', true, \'' + 'btnEditRaciRoles_' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantFriendlyName + '\', \'' + pdata[i].bwParticipantEmail + '\', \'' + pdata[i].bwParticipantLogonType + '\');">' + timestamp4 + '</td>';

                    var _logonType = pdata[i].bwParticipantLogonType;
                    if (_logonType == 'custom') {
                        _logonType = 'BudgetWorkflow.com';
                    } else if (_logonType == 'microsoft') {
                        _logonType = 'Microsoft';
                    }
                    html += '    <td style="cursor:pointer;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayParticipantRoleMultiPickerInACircle\', true, \'' + 'btnEditRaciRoles_' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantFriendlyName + '\', \'' + pdata[i].bwParticipantEmail + '\', \'' + pdata[i].bwParticipantLogonType + '\');">' + _logonType + '</td>';

                    // Check if this user is an admin. If so, reflect this in the UI.
                    if (bwParticipantId_Admin) {
                        if (bwParticipantId_Admin == pdata[i].bwParticipantId) {
                            adminRoleMessage = ' / ADMIN';
                        }
                    }
                    html += '    <td style="cursor:pointer;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayParticipantRoleMultiPickerInACircle\', true, \'' + 'btnEditRaciRoles_' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantFriendlyName + '\', \'' + pdata[i].bwParticipantEmail + '\', \'' + pdata[i].bwParticipantLogonType + '\');">' + pdata[i].bwParticipantRole + adminRoleMessage + '</td>';

                }




                // Right side column buttons...
                if ((pdata[i].bwParticipantId == participantId) || (pdata[i].bwParticipantRole == 'owner')) {
                    html += '    <td style="cursor:pointer;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayParticipantRoleMultiPickerInACircle\', true, \'' + 'btnEditRaciRoles_' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantFriendlyName + '\', \'' + pdata[i].bwParticipantEmail + '\', \'' + pdata[i].bwParticipantLogonType + '\');" id="btnEditRaciRoles_' + pdata[i].bwParticipantId + '">';
                    html += '    </td>';

                    //html += '    <td></td>'; // We need to be able to reassign the owner's responsibilities to someone else.
                    html += '   <td>';
                    html += '       <button class="BwSmallButton" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'cmdDisplayReassignUserTasksDialog\', \'' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantFriendlyName + '\', \'' + pdata[i].bwParticipantEmail + '\', \'' + pdata[i].bwParticipantRole + '\', \'' + pdata[i].bwParticipantLogonType + '\');">';
                    html += '           Reassign roles<br />and responsibilities';
                    html += '       </button>';
                    html += '   </td>';
                    html += '   <td></td>';
                } else {

                    if ((pdata[i].bwParticipantRole == 'emailrecipient')) {
                        html += '   <td>';
                        //html += '       <button class="BwSmallButton" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'cmdDisplayChangeUserRoleDialog\', \'' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantFriendlyName + '\', \'' + pdata[i].bwParticipantEmail + '\', \'' + pdata[i].bwParticipantRole + '\', \'' + pdata[i].bwParticipantLogonType + '\');">';
                        //html += '           &nbsp;&nbsp;Change<br />security role&nbsp;&nbsp;';
                        //html += '       </button>';
                        html += '   </td>';

                        html += '   <td>';
                        //html += '       <button class="BwSmallButton" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'cmdDisplayReassignUserTasksDialog\', \'' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantFriendlyName + '\', \'' + pdata[i].bwParticipantEmail + '\', \'' + pdata[i].bwParticipantRole + '\', \'' + pdata[i].bwParticipantLogonType + '\');">';
                        //html += '           Reassign roles<br />and responsibilities';
                        //html += '       </button>';
                        html += '   </td>';
                    } else {
                        html += '   <td>';
                        html += '       <button class="BwSmallButton" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'cmdDisplayChangeUserRoleDialog\', \'' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantFriendlyName + '\', \'' + pdata[i].bwParticipantEmail + '\', \'' + pdata[i].bwParticipantRole + '\', \'' + pdata[i].bwParticipantLogonType + '\');">';
                        html += '           &nbsp;&nbsp;Change<br />security role&nbsp;&nbsp;';
                        html += '       </button>';
                        html += '   </td>';

                        html += '   <td>';
                        html += '       <button class="BwSmallButton" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'cmdDisplayReassignUserTasksDialog\', \'' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantFriendlyName + '\', \'' + pdata[i].bwParticipantEmail + '\', \'' + pdata[i].bwParticipantRole + '\', \'' + pdata[i].bwParticipantLogonType + '\');">';
                        html += '           Reassign roles<br />and responsibilities';
                        html += '       </button>';
                        html += '   </td>';
                    }

                    html += '    <td>';
                    html += '       <img src="images/trash-can.png" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'cmdDisplayDeleteUserDialog\', \'' + pdata[i].bwParticipantId + '\', \'' + pdata[i].bwParticipantFriendlyName + '\', \'' + pdata[i].bwParticipantEmail + '\', \'' + pdata[i].bwParticipantRole + '\', \'' + pdata[i].bwParticipantLogonType + '\');" title="Delete" style="cursor:pointer;" />';
                    html += '   </td>';
                }
                html += '  </tr>';
            }
            html += '</table>';





            html += '</div>';






            // Add a Person/Participant/Vendor...
            html += '<br />';
            //html += '<span class="emailEditor_newMessageButton" onclick="$(\'.bwCircleDialog\').bwCircleDialog(\'displayAddANewPersonInACircle\', true);">       &nbsp;&nbsp;👥&nbsp;Add a Person/Participant/Vendor...&nbsp;&nbsp;   </span>';
            //html += '<br />';
            //html += '<br />';
            //html += '<span class="emailEditor_newMessageButton" onclick="$(\'.bwInvitation\').bwInvitation(\'inviteNewParticipant\');">       &nbsp;&nbsp;✉&nbsp;Create the invitation...&nbsp;&nbsp;   </span>';
            //html += '<span class="emailEditor_newMessageButton" onclick="$(\'.bwCircleDialog\').bwCircleDialog(\'displayAddANewPersonInACircle\', true);">   &nbsp;&nbsp;👥&nbsp;Add a new person...&nbsp;&nbsp;</span>';





            //html += '&nbsp;<input style="padding:5px 10px 5px 10px;" id="btnInviteNewParticipant" onclick="cmdInviteNewParticipant();" type="button" value="Generate a new invitation link">';

            //
            html += '                </span>';
            html += '            </div>';
            html += '        </div>';
            html += '    </div>';
            html += '</div>';
            //
            //html += '<br />';
            //html += '<div class="codeSnippetContainer" id="code-snippet-4" xmlns="">';
            //html += '    <div class="codeSnippetContainerTabs">';
            //html += '        <div class="codeSnippetContainerTabSingle" dir="ltr"><a>&nbsp;&nbsp;Invitations&nbsp;&nbsp;</a></div>';
            //html += '    </div>';
            //html += '    <div class="codeSnippetContainerCodeContainer">';
            //html += '        <div class="codeSnippetToolBar">';
            //html += '            <div class="codeSnippetToolBarText">';
            //html += '                <a name="CodeSnippetCopyLink" title="Copy to clipboard." style="display: none;" href="javascript:displayAlertDialog(\'Copy support is not yet implemented.\');">Copy</a>';
            //html += '            </div>';
            //html += '        </div>';
            //html += '        <div class="codeSnippetContainerCode" id="CodeSnippetContainerCode_5207fb9c-60fd-402f-8729-5795651a5ad3" dir="ltr">';
            //html += '            <div>';
            //html += '                <span id="spanBwInvitations" style="font-size:x-small;">';

            //var bwParticipantId;
            //if (pdata[i]) {
            //    bwParticipantId = pdata[i].bwParticipantId;
            //}

            //
            //var data = {
            //    //"bwTenantId": tenantId,
            //    bwWorkflowAppId: workflowAppId
            //};
            //$.ajax({
            //    url: thiz.options.operationUriPrefix + "_bw/bwinvitationsunclaimed",
            //    type: "DELETE",
            //    contentType: 'application/json',
            //    data: JSON.stringify(data),
            //    success: function (data) {
            //if (data.length == 0) {
            //    html += 'There are no unclaimed invitations.';
            //} else {






            //    html += '<div style="height:300px;overflow-y: scroll;">';









            //    html += '<table class="myStuffTable">';
            //    html += '  <tr>';
            //    //html += '    <td>name</td>';
            //    //html += '    <td>role</td>';
            //    //html += '    <td>email</td>';
            //    //html += '    <td>participant id</td>';
            //    html += '    <td>Created By</td>';
            //    html += '    <td>Created Date</td>';
            //    html += '    <td>Organization</td>';
            //    html += '    <td>Logon Providerxcx1</td>';
            //    html += '    <td>Security Role</td>';
            //    html += '    <td>Accepted (true/false)</td>';
            //    html += '    <td>Accepted By</td>';
            //    html += '    <td>Accepted Timestamp</td>';
            //    html += '    <td></td>';
            //    html += '    <td></td>';
            //    //html += '    <td>invitation delivered</td>';
            //    html += '  </tr>';
            //    for (var v = 0; v < data.length; v++) {
            //        html += '  <tr>';
            //        //html += '    <td>' + data[i].bwParticipantFriendlyName + '</td>';
            //        //html += '    <td>' + data[i].bwParticipantRole + '</td>';
            //        //html += '    <td>' + data[i].bwParticipantEmail + '</td>';
            //        //html += '    <td>' + data[i].bwParticipantId + '</td>';
            //        html += '    <td title="' + data[v].bwInvitationCreatedByEmail + '" style="cursor:default;">' + data[v].bwInvitationCreatedByFriendlyName + '</td>';
            //        html += '    <td>' + data[v].bwInvitationCreatedTimestamp + '</td>';
            //        html += '    <td>' + data[v].bwWorkflowAppTitle + '</td>';
            //        //debugger;
            //        var _logonType = data[v].bwParticipantLogonType;
            //        if (_logonType == 'custom') {
            //            _logonType = 'BudgetWorkflow.com';
            //        } else if (_logonType == 'microsoft') {
            //            _logonType = 'Microsoft';
            //        }
            //        html += '    <td>' + _logonType + '</td>';

            //        html += '    <td>' + data[v].bwInvitationParticipantRole + '</td>';
            //        var invitationAccepted = false;
            //        if (data[v].bwInvitationAcceptedByFriendlyName) {
            //            invitationAccepted = true;
            //        }
            //        html += '    <td>' + invitationAccepted + '</td>';
            //        if (invitationAccepted == true) {
            //            html += '    <td>' + data[v].bwInvitationAcceptedByFriendlyName + ' (' + data[v].bwInvitationAcceptedByEmail + ')</td>';
            //            html += '    <td>' + data[v].bwInvitationAcceptedTimestamp + '</td>';
            //        } else {
            //            html += '    <td></td>';
            //            html += '    <td></td>';
            //        }

            //        html += '    <td><button style="padding:5px 10px 5px 10px;" onclick="cmdViewInvitation(\'' + data[v].bwInvitationId + '\', \'' + data[v].bwInvitationParticipantRole + '\');" class="BwSmallButton">view</button></td>';
            //        html += '    <td><button style="padding:5px 10px 5px 10px;" onclick="cmdDeleteInvitation(\'' + data[v].bwInvitationId + '\');" class="BwSmallButton">delete</button></td>';
            //        //html += '    <td>' + data[i].bwTenantId + '</td>';
            //        //html += '    <td>' + data[i].bwParticipantInvitationDelivered + '</td>';
            //        html += '  </tr>';
            //    }
            //    //html += '<tr><td colspan="5">DONE</td></tr>';
            //    html += '</table>';
            //}
            ////
            //html += '                </span>';
            //html += '            </div>';


            //html += '<br />';
            //html += '<br />';
            //html += '<span style="font-size:small;font-style:italic;">When a person accepts an invitation and logs in for the first time, they receive the lowest permissions role of "Participant". You will receive an email when they have joined, then you can come back here and use the "change security role" button to increase their permissions.</span>';


            //html += '        </div>';
            //html += '    </div>';
            //html += '</div>';
            ////
            ////html += '<br />';



            ////html += '<div class="codeSnippetContainer" id="code-snippet-4" xmlns="">';
            ////html += '<div class="codeSnippetContainerTabs">';
            ////html += '<div class="codeSnippetContainerTabSingle" dir="ltr">';
            ////html == '  <a>&nbsp;&nbsp;Invite a participant to your budget workflow by emailing them this link&nbsp;&nbsp;</a>';
            ////html += '</div>';
            ////html += '</div>';
            ////html += '<div class="codeSnippetContainerCodeContainer">';
            ////html += '    <div class="codeSnippetToolBar">';
            ////html += '        <div class="codeSnippetToolBarText">';
            ////html += '            <a name="CodeSnippetCopyLink" title="Copy to clipboard." style="display: none;" href="javascript:displayAlertDialog(\'Copy support is not yet implemented.\');">Copy</a>';
            ////html += '        </div>';
            ////html += '    </div>';
            ////html += '    <div class="codeSnippetContainerCode" id="CodeSnippetContainerCode_5207fb9c-60fd-402f-8729-5795651a5ad3" dir="ltr">';
            ////html += '        <div style="color:Black;"><pre>';
            ////html += '<span id="invitationLink"></span>';
            ////html += '           </pre>';
            //////html += '<table style="width:100%;text-align:right;"><tr><td><button id="btnInviteNewParticipant" onclick="cmdInviteNewParticipant();" class="BwButton350">Generate a new invitation link</button></td></tr></table>';
            ////html += '               </div>';
            ////html += '                   </div>';
            ////html += '               </div>';
            ////html += '           </div>';




            ////
            ////html += '<span style="font-size:small;font-style:italic;">When a person accepts an invitation and logs in for the first time, they receive the lowest permissions role of "Participant". You will receive an email when they have joined, then you can come back here and use the "change role" button to increase their permissions.</span>';
            //////



            ////html += '<span id="spanConfigurationParticipantsBwRoleEditor"></span>';














            ////html += '<br /><hr />';
            ////html += 'View Workflow Roles/Participants:<span id="spanConfigurationParticipants_SelectWorkflowRequestType">[spanConfigurationParticipants_SelectWorkflowRequestType]</span>';
            ////html += '<select id="selectWorkflowRequestTypeDropDown" onchange="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'WorkflowRequestTypeDropDown_Onchange\', \'selectWorkflowRequestTypeDropDown\');" style=\'display:inline;border-color: whitesmoke; color: grey; font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 14pt; font-weight: bold; cursor: pointer;\'>'; // was .5em
            ////html += '   <option value="' + 'all' + '" selected >' + 'All request types' + '</option>';
            ////html += '</select>';
            ////html += '<br />';
            ////html += '<span id="spanConfigurationParticipantsRaciRoleEditor"></span>';






            ////html += '<br />';




            ////html += '<input id="btnCreateRole2" onclick="displayAddANewPersonDialog();" type="button" value="Add a Person...">';
            //////html += '<input id="btnCreateRole2" onclick="alert(\'why isnt this working!!!\');" type="button" value="Add a Person...">';

            //// *************************************************************************
            //// todd added 12-23-19 3-36pm ast may casuse issues keep an eye on this
            ////html += '<div id="divRolePickerDropDown2" style="display:none;height:300px;width:400px;border:1px solid #066b8b;background-color:white;position:absolute;z-index:10;">'; // Scrollable div wrapper for the role picker. // dark blue border. // position and z-index makes it show up on top and to not move the other elements around.

            ////html += '<div id="divParticipantSummaryDialog" style="display:none;height:600px;width:600px;border:1px solid #066b8b;background-color:white;position:absolute;z-index:10;"></div>'; // Scrollable div wrapper for the role picker. // dark blue border. // position and z-index makes it show up on top and to not move the other elements around.
            //html += '<div style="height:100vh;"></div>'; // todd added 12-23-19 is this necessary? It may help the circle participant dialogs

            //html += '    </td>';
            //html += '  </tr>';

            //html += '</table>';







            //html += '</div>';






            //html += '<div style="height:100vh;"></div>';

            html += '<br />';
            html += '<div id="divBwTardyParticipants"></div>';
            html += '<br />';
            html += '<br />';
            html += '<br />';

            //var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');
            if (developerModeEnabled) {
                // Configure Introductory Email button.
                html += '<span class="spanButton" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'configureEmailTemplate_IntroductoryEmail\', \'Create\');"><span style="font-size:15pt;display:inline-block;">✉</span> Configure "Introductory" email&nbsp;&nbsp;</span>';
                html += '&nbsp;&nbsp;<span style="font-size:small;color:grey;vertical-align:bottom;">This organization\'s custom introductory email for newly added and invited users.</span>';
                html += '<br /><br />';

                // "Change Security Role" Configure Email button.
                html += '<span class="spanButton" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'configureEmailTemplate_ChangedSecurityRole\', \'Createxx\');"><span style="font-size:15pt;display:inline-block;">✉</span> Configure "Changed security role" email&nbsp;&nbsp;</span>';
                html += '&nbsp;&nbsp;<span style="font-size:small;color:grey;vertical-align:bottom;">This organization\'s custom "Your security role has been changed" email template.</span>';
                html += '<br /><br />';

                // "Reassign Responsibilities" Configure Email button.
                html += '<span class="spanButton" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'configureEmailTemplate_ReassignedResponsibilities\', \'Createxx\');"><span style="font-size:15pt;display:inline-block;">✉</span> Configure "Reassigned responsibilities" email&nbsp;&nbsp;</span>';
                html += '&nbsp;&nbsp;<span style="font-size:small;color:grey;vertical-align:bottom;">This organization\'s custom "Your responsibilities have changed" email template.</span>';
            }

            html += '<br />';
            html += '<br />';
            html += '<br />';
            html += '<br />';

            // Render the html. THIS WAY IS PREFERABLE COME BACK AND FIX SOMETIME
            thiz.element.html(html);

            $('#divBwInvitation').bwInvitation({}); // Instantiate the invitation widget.

            $('#divBwTardyParticipants').bwTardyParticipants({});

            //
            // NEW 5-2-2020. THIS IS DONE HERE BECAUSE THE HTML HAS TO RENDER PRIOR TO RESIZING!!!!!!!!!!!!!!!!!! <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            //
            //
            var canvas = document.getElementById("myCanvas");
            if (canvas) {
                var ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines
                canvas.style.zIndex = -1;

                //
                // Resize the canvas so that this is rendered on the entire page, even the parts of the page which are scrolled out of view at the moment.
                var body = document.getElementsByTagName('body')[0];
                var clientWidth = body.scrollWidth;
                var clientHeight = Math.max(
                    body.scrollHeight, document.documentElement.scrollHeight,
                    body.offsetHeight, document.documentElement.offsetHeight,
                    body.clientHeight, document.documentElement.clientHeight, body.scrollHeight, body.getBoundingClientRect().height
                );
                //
                // This doesn't work 100% here because the whole screen has not been rendered yet, so we get an incorrect height value which is much less than the entire length of the page.
                // Therefore we need to remember to resize the canvas when drawing stuff, and use the sizing code from the resize event just below this code, and save it back to this.options.Canvas and this.options.CanvasContext.
                //canvas.width = document.documentElement.clientWidth;
                //canvas.height = document.documentElement.clientHeight;
                canvas.width = clientWidth;
                canvas.height = clientHeight;
            }
















            // Render the RACI role editor. REMOVED 7-23-2020
            //$('.bwCoreComponent').bwCoreComponent('renderMasterRoleListForEditing', 'spanConfigurationParticipantsRaciRoleEditor'); // THIS DISPLAYS the roles that are in the JSON org definition.

            //// Render the RACI role editor.
            //$('.bwCoreComponent').bwCoreComponent('renderBwRoles', 'spanConfigurationParticipantsBwRoleEditor'); // THIS DISPLAYS the roles that are in the JSON org definition.

            //
            // If the user clicks on the ADMIN role row, it will display the participant circle dialog for the person who is the ADMIN.
            //
            //debugger;
            //$('#masterRoleList_AdminRow').click(function () {
            //    // Display the ADMIN participant in a circle dialog.
            //    debugger;
            //    if (thiz.options.store.BwWorkflowUserRoleAdmin && thiz.options.store.BwWorkflowUserRoleAdmin.length == 1) {
            //        $('.bwAuthentication').bwAuthentication('displayParticipantRoleMultiPickerInACircle', true, '', '' + thiz.options.store.BwWorkflowUserRoleAdmin[0].bwParticipantId + '', '' + thiz.options.store.BwWorkflowUserRoleAdmin[0].bwParticipantFriendlyName + '', '' + thiz.options.store.BwWorkflowUserRoleAdmin[0].bwParticipantEmail + '');
            //    }
            //    // $('.bwAuthentication').bwAuthentication('displayParticipantRoleMultiPickerInACircle', true, 'btnEditRaciRoles_84404479-87b3-4f9c-b096-e65db5426c5e', '84404479-87b3-4f9c-b096-e65db5426c5e', 'Todd Hiltz', 'budgetworkflow@gmail.com');
            //});


            //
            // Render the custom Participant images
            //
            for (var i = 0; i < participantsImageFetchingInformation.length; i++) {
                if (participantsImageFetchingInformation[i].bwParticipantId) {





                    var imagePath; // = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/participantimages/' + participantsImageFetchingInformation[i].bwParticipantId + '/' + 'userimage.png';

                    var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });

                    var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

                    if (activeStateIdentifier.status != 'SUCCESS') {

                        imagePath = '[No image. Unauthorized. xcx213124-34556]';

                    } else {

                        //html += '<img id="attachmentstest1" xcx="xcx2312-2-2" src="' + thiz.options.operationUriPrefix + fileUrl_Thumbnail + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;max-width:250px;border:1px solid gray;border-radius:0 30px 0 0;" alt="" ';

                        imagePath = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/participantimages/' + participantsImageFetchingInformation[i].bwParticipantId + '/' + 'userimage.png?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;

                    }





                    var lookForParticipantImage = function (imagePath, i) {
                        return new Promise(function (resolve, reject) {
                            $.get(imagePath).done(function () {
                                var img = new Image();
                                img.src = imagePath;
                                img.onload = function (e) {
                                    try {
                                        document.getElementById(participantsImageFetchingInformation[i].imageId).src = imagePath;
                                        resolve();
                                    } catch (e) {
                                        // The code gets here if the user switches pages quickly.
                                        console.log('Exception in renderParticipantsEditor().img.onload(). The code gets here if the user switches pages quickly: ' + e.message + ', ' + e.stack);
                                        //alert('Exception in renderParticipantsEditor().img.onload(): ' + e.message + ', ' + e.stack);
                                        reject();
                                    }
                                }
                            }).fail(function () {
                                // do nothing, it just didn't find an image.
                                resolve();
                            });
                        });
                    }
                    lookForParticipantImage(imagePath, i);
                }
            }




            // RIGHT-CLICK FUNCTIONALITY!!
            // This is our ellipsis context menu. MIT license and code at: https://swisnl.github.io/jQuery-contextMenu/demo/trigger-custom.html // event.stopImmediatePropagation()
            var button = document.getElementById('spanParticipantsEditorEllipsesContextMenuButton');
            //for (var i = 0; i < buttons.length; i++) {
            $(button).on('click', function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                $(this).contextMenu();
                // or $('.context-menu-one').trigger("contextmenu");
                // or $('.context-menu-one').contextMenu({x: 100, y: 100});
            });
            //}


            if (developerModeEnabled == true) {
                //
                // This is our right-click context menu. MIT license and code at: https://swisnl.github.io/jQuery-contextMenu/demo/trigger-custom.html
                $.contextMenu({
                    selector: '.context-menu-bwroleseditor2',
                    callback: function (key, options) {
                        try {
                            //var m = "clicked: " + key;
                            //window.console && console.log(m) || alert(m);
                            if (key == 'runrolediagnostics') {
                                $('.bwCoreComponent').bwCoreComponent('displayEditRolesDialog');
                            } else if (key == 'runuserrolediagnostics') {

                                //debugger;
                                //var options = {
                                //    displayWorkflowPicker: true,
                                //    bwTenantId: tenantId,
                                //    bwWorkflowAppId: workflowAppId,
                                //    bwEnabledRequestTypes: bwEnabledRequestTypes
                                //};
                                //var $bworgroleseditor = $("#divBwOrganizationEditor2").bwOrganizationEditor(options); // This is not the right way to do this! It currently means the whole thing gets rendered invisibly.... need to move this part of the architecture around somehow in the future.

                                //setTimeout(function () { $('.bwOrganizationEditor').bwOrganizationEditor('downloadOrganizationJson'); }, 500);
                                $('.bwOrganizationEditor').bwOrganizationEditor('downloadOrganizationJson');

                                //thiz.downloadOrganizationJson();
                            } else if (key == 'backfillrolesfromorgandworkflowjson') {



                                //thiz.createBackfillRolesArrayFromOrgAndWorkflowsJson();
                                $('.bwCoreComponent').bwCoreComponent('createBackfillRolesArrayFromOrgAndWorkflowsJson');

                            }
                        } catch (e) {
                            console.log('Exception in context-menu-bwroleseditor.callback(): ' + e.message + ', ' + e.stack);
                        }
                    },
                    items: {
                        "runuserrolediagnostics": { name: "Organization structure, roles and participants JSON", icon: "edit" },
                        "runrolediagnostics": { name: "Run Role Diagnostics", icon: "edit" },
                        "backfillrolesfromorgandworkflowjson": { name: "Backfill roles from Org and Workflow(s) json...", icon: "edit" }
                        //"downloadjson": { name: "Organization Roles Diagnostics", icon: "edit" },
                        //"viewtrashbincontents": { name: "View Trashbin contents", icon: "fa-trash" }//, // images/trash-can.png  // 🗑
                        //"viewextendedinformation": { name: "View Extended information", icon: "edit" }
                        //copy: { name: "Copy", icon: "copy" },
                        //"paste": { name: "Paste", icon: "paste" },
                        //"delete": { name: "Delete", icon: "delete" },
                        //"sep1": "---------",
                        //"quit": {
                        //    name: "Quit", icon: function () {
                        //        return 'context-menu-icon context-menu-icon-quit';
                        //    }
                        //}
                    }
                });
                // End: This is our right-click context menu.
                //
            }







            //    },
            //    error: function (data, errorCode, errorMessage) {
            //        //window.waitDialog.close();
            //        //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            //        displayAlertDialog('Error in my.js.renderConfigurationParticipants():1:' + errorCode + ', ' + errorMessage);
            //    }
            //});
        } catch (e) {
            console.log('Exception in renderOrgRolesEditor(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderOrgRolesEditor(): ' + e.message + ', ' + e.stack);
        }
    },

    sortDataGrid: function (dataElement, sortOrder, element) {
        try {
            console.log('In bwParticipantsEditor.js.sortDataGrid(). dataElement: ' + dataElement + ', sortOrder: ' + sortOrder);
            alert('In bwParticipantsEditor.js.sortDataGrid(). This functionality is incomplete. Coming soon!'); // dataElement: ' + dataElement + ', sortOrder: ' + sortOrder); // this.options.store.BwWorkflowUsers; << this is what we are sorting
            //this.loadDataAndRenderDetailedListOrExecutiveSummary(dataElement, sortOrder);

        } catch (e) {
            console.log('Exception in sortDataGrid(): ' + e.message + ', ' + e.stack);
        }
    },

    cmdDisplayChangeUserRoleDialog: function (userId, userFriendlyName, userEmail, currentRole, logonType) {
        try {
            console.log('In cmdDisplayChangeUserRoleDialog().');
            var thiz = this;

            //$('#ChangeUserRoleDialog').attr('z-index', 99999);

            $('#ChangeUserRoleDialog').dialog({
                modal: true,
                resizable: false,
                closeText: "Cancel",
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                width: "700px",
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function (event, ui) {

                    //// This is a bad fix to keep this dialog on top.... we will come up with something better at a later date.
                    //setTimeout(function () {
                    //    $('#ChangeUserRoleDialog').dialog('moveToTop');
                    //}, 500);

                    $('.ui-widget-overlay').bind('click', function () { $("#ChangeUserRoleDialog").dialog('close'); });
                    $('#btnUserRoleDialogChangeRole').bind('click', function () {
                        //debugger;
                        thiz.cmdChangeUserRoleAndSendEmail(userId, userFriendlyName, userEmail, logonType);
                        $("#ChangeUserRoleDialog").dialog('close');
                    });
                    // 
                    //var invitationUrl = globalUrlPrefix + globalUrl + '?invitation=' + invitationId;
                    ////$('#invitationLink2').text(invitationUrl);
                    //document.getElementById('textareaViewInvitationDialogInvitationDetails').innerHTML = invitationUrl;
                    //document.getElementById('textareaViewInvitationDialogInvitationDetails').blur();
                },
                close: function () {
                    $("#ChangeUserRoleDialog").dialog('destroy');
                }
            });
            //$("#ChangeUserRoleDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            // Set the title.
            document.getElementById('spanChangeUserRoleDialogTitle').innerHTML = 'Change the security role for ' + userFriendlyName + '.';

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
            var msg = 'Send email notification to ' + userFriendlyName + ' (' + userEmail + '). You can include an additional message as well:';
            $('#spanUserRoleDialogEmailMessageText').text(msg);
            // Event listener for the email checkbox.
            $('#cbUserRoleDialogEmailMessage').off('click').click(function (error) {
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
            console.log('Exception in cmdDisplayChangeUserRoleDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in cmdDisplayChangeUserRoleDialog(): ' + e.message + ', ' + e.stack);
        }
    },

    cmdChangeUserRoleAndSendEmail: function (userId, userFriendlyName, userEmail, logonType) {
        try {
            console.log('In cmdChangeUserRoleAndSendEmail(). userId: ' + userId + ', userFriendlyName: ' + userFriendlyName + ', userEmail: ' + userEmail + ', logonType: ' + logonType);
            //displayAlertDialog('In cmdChangeUserRoleAndSendEmail(). userId: ' + userId + ', userFriendlyName: ' + userFriendlyName + ', userEmail: ' + userEmail + ', logonType: ' + logonType);
            var thiz = this;

            //var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var workflowAppTitle = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTitle');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            var sendEmailNotification = document.getElementById('cbUserRoleDialogEmailMessage').checked; // This returns true or false.
            var emailNotificationAdditionalMessage = document.getElementById('txtUserRoleDialogEmailMessage').textContent;
            var newRole;
            var roles = document.getElementsByName('rbChangeUserRole');
            for (var i = 0; i < roles.length; i++) {
                if (roles[i].checked) newRole = roles[i].value;
            }

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');
            data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                sendEmailNotification: sendEmailNotification,
                emailNotificationAdditionalMessage: emailNotificationAdditionalMessage,
                bwWorkflowAppId: workflowAppId,
                bwWorkflowAppTitle: workflowAppTitle,
                bwParticipantId: userId,
                bwParticipantFriendlyName: userFriendlyName,
                bwParticipantEmail: userEmail,
                bwParticipantLogonType: logonType,
                bwParticipantRole: newRole,
                ModifiedById: participantId,
                ModifiedByFriendlyName: participantFriendlyName,
                ModifiedByEmail: participantEmail
            };
            var operationUri = webserviceurl + "/bwparticipant/updateuserrole";
            $.ajax({
                url: operationUri,
                type: "POST",
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    try {

                        displayAlertDialog(data);

                        $('.bwCircleDialog').bwCircleDialog('hideAndDestroyCircleDialog');
                        $("#divBwParticipantsEditor").bwParticipantsEditor({ store: null }); // Clear the data to force the widget to reload the data.
                        $("#divBwParticipantsEditor").bwParticipantsEditor('loadAndRenderParticipantsEditor');

                    } catch (e) {
                        console.log('Exception in cmdChangeUserRoleAndSendEmail():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in cmdChangeUserRoleAndSendEmail():2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in my.js.cmdChangeUserRoleAndSendEmail(): ' + errorMessage + ' ' + JSON.stringify(data));
                    displayAlertDialog('Error in my.js.cmdChangeUserRoleAndSendEmail(): ' + errorMessage + ' ' + JSON.stringify(data));
                }
            });

        } catch (e) {
            console.log('Exception in cmdChangeUserRoleAndSendEmail(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in cmdChangeUserRoleAndSendEmail(): ' + e.message + ', ' + e.stack);
        }
    },


    cmdDisplayReassignUserTasksDialog: function (userId, userFriendlyName, userEmail, currentRole, logonType) {
        try {
            console.log('In bwParticipantsEditor.js.cmdDisplayReassignUserTasksDialog().');
            //alert('In bwParticipantsEditor.js.cmdDisplayReassignUserTasksDialog().');

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            $("#ReassignUserTasksDialog").dialog({
                modal: true,
                resizable: false,
                closeText: "Cancel",
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                //title: 'Reassign ' + userFriendlyName + '\'s tasks in this workflow.',
                width: "570px",
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                close: function (event, ui) {
                    // Unbind the click event. This is important so it doesn't fire multiple times.
                    //$('#btnReassignUserTasksDialogReassignTasks').unbind('click', function () {
                    //    ReassignParticipantResponsibilities(userId);
                    //});
                    $('#ReassignUserTasksDialog').dialog('destroy');
                },
                open: function (event, ui) {
                    try {
                        //$('.ui-widget-overlay').bind('click', function () { $("#ReassignUserTasksDialog").dialog('close'); });

                        //// Bind the click event!
                        //$('#btnReassignUserTasksDialogReassignTasks').bind('click', function () {
                        //    ReassignParticipantResponsibilities(userId);
                        //});

                        //document.getElementById('btnReassignUserTasksDialogReassignTasks').onclick = 'ReassignParticipantResponsibilities(' + userId + ');';

                        // Display the details on the dialog.
                        data = {
                            bwParticipantId: userId,
                            bwWorkflowAppId: workflowAppId
                        };
                        var operationUri = webserviceurl + "/bwworkflow/itemizeparticipantdependencies";
                        $.ajax({
                            url: operationUri,
                            type: "POST",
                            data: data,
                            headers: {
                                "Accept": "application/json; odata=verbose"
                            },
                            success: function (data) {
                                try {
                                    // Show or hide the replacement user selection box depening if there are any dependencies (tasks or functional areas).
                                    if (data.message != 'SUCCESS') {
                                        displayAlertDialog(JSON.stringify(data)); // Todd: put a good message here.
                                    } else {

                                        debugger;
                                        if (data.NumberOfOrganizationRoles == 0 && data.NumberOfFunctionalAreas == 0 && data.NumberOfIncompleteTasks == 0 && data.NumberOfIncompleteBudgetRequestsSpecifiedAsManager == 0) {
                                            // There are no dependencies.
                                            var html = '';

                                            //html += JSON.stringify(data);
                                            //html += '<br />';
                                            html += 'This user has no Organization Roles, Tasks, is not an approver for any Functional Areas, and is not a Manager for any Budget Requests.';
                                            document.getElementById('spanReassignUserTasksDialogUserDependencyDetails').innerHTML = html;
                                            // Hide the user selection box.
                                            document.getElementById('spanReassignUserTasksDialogChooseAUserSection').style.display = 'none';
                                            // Hide the Delete button. 
                                            document.getElementById('spanReassignUserTasksDialogReassignTasksButton').style.display = 'none';
                                            // Hide the "Email me" checkbox. 
                                            document.getElementById('spanReassignUserTasksDialogEmailMessage').style.display = 'none';


                                            //var dialogButtons = $('#ReassignUserTasksDialog').dialog('option', 'buttons');
                                            //$.each(dialogButtons, function (buttonIndex, button) {
                                            //    if (button.id === 'btnReassignUserTasksAndReplaceWithNewUser') {
                                            //        button.text = 'Reassign ' + userFriendlyName;
                                            //        button.disabled = false;
                                            //    }
                                            //})
                                            //$("#ReassignUserTasksDialog").dialog('option', 'buttons', dialogButtons);
                                        } else {

                                            // Show the user selection box.
                                            document.getElementById('spanReassignUserTasksDialogChooseAUserSection').style.display = 'inline';
                                            // Show the Delete button. 
                                            document.getElementById('spanReassignUserTasksDialogReassignTasksButton').style.display = 'inline';
                                            // Show the "Email me" checkbox. 
                                            document.getElementById('spanReassignUserTasksDialogEmailMessage').style.display = 'inline';

                                            try {
                                                document.getElementById('txtReassignUserTasksDialogUserToReplaceFriendyName').value = ''; // = ''; // Clear the text box.
                                                document.getElementById('txtReassignUserTasksDialogUserToReplaceId').value = '';
                                                document.getElementById('txtReassignUserTasksDialogUserToReplaceEmail').value = '';
                                            } catch (e) {
                                                displayAlertDialog('Error:' + e.message + e.stack);
                                            }

                                            // There ARE dependencies and we need to assign a replacement user.
                                            var html = '';
                                            html += 'When this users responsibilities are reassigned, the following will need to be reassigned to a new user (alternatively, you can change them one at a time):';
                                            html += '<ul>';

                                            html += '<li style="color:red;"><span style="color:black;">' + data.NumberOfOrganizationRoles + ' Organization Role(s)</span></li>';

                                            html += '<li style="color:red;"><span style="color:black;">' + data.NumberOfFunctionalAreas + ' Financial Area(s)</span></li>'; // 3-9-2022 REMOVING FOR NOW UNTIL WE PUT THESE BACK!!!!!!
                                            html += '<li style="color:red;"><span style="color:black;">' + data.NumberOfIncompleteTasks + ' incomplete Task(s)</span></li>';
                                            html += '<li style="color:red;"><span style="color:black;">' + data.NumberOfIncompleteBudgetRequestsSpecifiedAsManager + ' incomplete Budget Request(s) where specified as the Manager</span></li>';
                                            html += '</ul>';
                                            document.getElementById('spanReassignUserTasksDialogUserDependencyDetails').innerHTML = html;
                                            // 
                                            var html = '';
                                            html += 'Select the user to take over these tasks from <span style="white-space:nowrap;"><i>' + userFriendlyName + ' (' + userEmail + ')</i></span>';
                                            document.getElementById('spanReassignUserTasksDialogUserToReassignFriendlyName').innerHTML = html;

                                            //
                                            var html = '';
                                            html += '<div id="btnReassignUserTasksDialogReassignTasks" class="divSignInButton" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'ReassignParticipantResponsibilities\', \'' + userId + '\',\'' + userFriendlyName + '\',\'' + userEmail + '\');" style="width:90%;text-align:center;line-height:0.8em;font-weight:bold;word-wrap:break-word;">';
                                            //html += 'Replace ' + userFriendlyName + ' with the new user'; // Got rid of this until we get it to wrap in the div properly.
                                            html += '   Reassign Responsibilities';
                                            html += '</div>';
                                            document.getElementById('spanReassignUserTasksDialogReassignTasksButton').innerHTML = html;

                                            // Change the button text.
                                            //$('#btnReassignUserTasksDialogReassignTasks').innerHTML = 'Replace ' + userFriendlyName + ' with the new user';
                                            //var dialogButtons = $('#ReassignUserTasksDialog').dialog('option', 'buttons');
                                            //$.each(dialogButtons, function (buttonIndex, button) {
                                            //    if (button.id === 'btnReassignUserTasksAndReplaceWithNewUser') {
                                            //        button.text = 'Replace ' + userFriendlyName + ' with the new user';
                                            //        button.disabled = false;
                                            //        button.style = 'color:red;';
                                            //    }
                                            //})
                                            //$("#ReassignUserTasksDialog").dialog('option', 'buttons', dialogButtons);
                                        }
                                    }
                                } catch (e) {
                                    console.log('Exception in my.js.cmdDisplayReassignUserTasksDialog():1: ' + e.message + ', ' + e.stack);
                                    displayAlertDialog('Exception in my.js.cmdDisplayReassignUserTasksDialog():1: ' + e.message + ', ' + e.stack);
                                }
                            },
                            error: function (data, errorCode, errorMessage) {
                                console.log('Error in my.js.cmdDisplayReassignUserTasksDialog().itemizeparticipantdependencies: ' + errorMessage);
                                displayAlertDialog('Error in my.js.cmdDisplayReassignUserTasksDialog().itemizeparticipantdependencies: ' + errorMessage);
                            }
                        });
                    } catch (e) {
                        console.log('Exception in bwParticipantsEditor.js.cmdDisplayReassignUserTasksDialog():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwParticipantsEditor.js.cmdDisplayReassignUserTasksDialog():2: ' + e.message + ', ' + e.stack);
                    }
                }
                //buttons: {
                //    "Reassign and replace with the new user": {
                //        text: 'Reassign Tasks',
                //        id: 'btnReassignAParticipantAndReplaceWithNewUser',
                //        disabled: 'true',
                //        click: function () {
                //            var justDeleteAlready = true;
                //            try {
                //                var newUserFriendlyName = document.getElementById('txtReassignUserTasksDialogUserToReplaceFriendyName').value;
                //                justDeleteAlready = false;
                //            } catch (e) {
                //                // No need to catch, just checking if it exists!
                //            }
                //            if (justDeleteAlready == false) {
                //                // Here we assign the new user.
                //                var proceed = confirm('This action cannot be undone.\n\n\nClick the OK button to proceed...');
                //                if (proceed) {
                //                    cmdDeleteParticipantAndAssignANewUser(userId);
                //                    $(this).dialog("close");
                //                }
                //            } else {
                //                // A new user does not have to be assigned since there are no dependencies.
                //                var proceed = confirm('This action cannot be undone.\n\n\nClick the OK button to proceed...');
                //                if (proceed) {
                //                    cmdDeleteParticipant(userId);
                //                    $(this).dialog("close");
                //                }
                //            }
                //        }
                //    },
                //    "Cancel": function () {
                //        $(this).dialog("close");
                //    }
                //},
                //open: function () {

                //}
            });

            // Hide the title bar.
            $("#ReassignUserTasksDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
            // Set the title.
            document.getElementById('spanReassignUserTasksDialogTitle').innerHTML = 'Reassign ' + userFriendlyName + '\'s roles & responsibilities in this organization.';

        } catch (e) {
            console.log('Exception in bwParticipantsEditor.js.cmdDisplayReassignUserTasksDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwParticipantsEditor.js.cmdDisplayReassignUserTasksDialog(): ' + e.message + ', ' + e.stack);
        }
    },

    cmdDisplayDeleteUserDialog: function (userId, userFriendlyName, userEmail, currentRole, logonType) {
        try {
            console.log('In bwParticipantsEditor.js.cmdDisplayDeleteUserDialog().');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            $("#DeleteAParticipantDialog").dialog({
                modal: true,
                resizable: false,
                closeText: "Cancel",
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                //title: 'Remove ' + userFriendlyName + ' from this workflow.',
                width: "570px",
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    try {
                        $('.ui-widget-overlay').bind('click', function () { $("#DeleteAParticipantDialog").dialog('close'); });


                        var data = [];
                        data = {
                            bwParticipantId: userId,
                            bwWorkflowAppId: workflowAppId
                        };
                        var operationUri = webserviceurl + "/bwworkflow/itemizeparticipantdependencies"; //removeaparticipant";
                        $.ajax({
                            url: operationUri,
                            type: "POST",
                            data: data,
                            headers: {
                                "Accept": "application/json; odata=verbose"
                            },
                            success: function (data) {
                                try {
                                    // Show or hide the replacement user selection box depening if there are any dependencies (tasks or functional areas).
                                    if (data.message != 'SUCCESS') {
                                        displayAlertDialog(JSON.stringify(data)); // Todd: put a good message here.
                                    } else {
                                        if (data.NumberOfFunctionalAreas == 0 && data.NumberOfIncompleteTasks == 0 && data.NumberOfIncompleteBudgetRequestsSpecifiedAsManager == 0) {
                                            // There are no dependencies.
                                            var html = '';
                                            html += 'This user has no Tasks, is not an approver for any Functional Areas, and is not a Manager for any Budget Requests.xcx2';
                                            document.getElementById('spanDeleteAParticipantDialogUserDependencyDetails').innerHTML = html;
                                            // Hide the user selection box.
                                            document.getElementById('spanDeleteAParticipantDialogChooseAUserSection').innerHTML = '';
                                            // Hide the Delete button. 
                                            //document.getElementById('divDeleteAParticipantDialogReassignTasks').style.display = 'none';

                                            // Bind the click event! added 3-1-2020
                                            $('#divDeleteAParticipantDialogReassignTasks').bind('click', function () {
                                                thiz.DeleteParticipantWhoHasNoResponsibilities(userId);
                                            });

                                            // Change the button text.
                                            //var dialogButtons = $('#DeleteAParticipantDialog').dialog('option', 'buttons');
                                            //$.each(dialogButtons, function (buttonIndex, button) {
                                            //    if (button.id === 'btnDeleteAParticipantAndReplaceWithNewUser') {
                                            //        button.text = 'Delete ' + userFriendlyName;
                                            //        button.disabled = false;
                                            //    }
                                            //})
                                            //$("#DeleteAParticipantDialog").dialog('option', 'buttons', dialogButtons);
                                        } else {
                                            // There ARE dependencies and we need to assign a replacement user.
                                            var html = '';
                                            html += 'When this user is removed, the following will need to be re-assigned to a new user (or you may be able to go back and change them one at a time):';
                                            html += '<ul>';
                                            html += '<li style="color:red;"><span style="color:black;">' + data.NumberOfFunctionalAreas + ' Financial Area(s)</span></li>';
                                            html += '<li style="color:red;"><span style="color:black;">' + data.NumberOfIncompleteTasks + ' incomplete Task(s)</span></li>';
                                            html += '<li style="color:red;"><span style="color:black;">' + data.NumberOfIncompleteBudgetRequestsSpecifiedAsManager + ' incomplete Budget Request(s) where specified as the Manager</span></li>';
                                            html += '</ul>';
                                            document.getElementById('spanDeleteAParticipantDialogUserDependencyDetails').innerHTML = html;
                                            // 
                                            var html = '';
                                            html += 'Select the user to take over these tasks from <span style="white-space:nowrap;"><i>' + userFriendlyName + ' (' + userEmail + ')</i></span>';
                                            document.getElementById('spanDeleteAParticipantDialogUserToDeleteFriendlyName').innerHTML = html;
                                            // Change the button text.
                                            $('#divDeleteAParticipantDialogReassignTasks').innerHTML = 'Replace ' + userFriendlyName + ' with the new user';
                                            // Bind the click event!
                                            $('#divDeleteAParticipantDialogReassignTasks').bind('click', function () {
                                                thiz.ReassignParticipantResponsibilitiesAndDelete(userId);
                                            });

                                            //// Change the button text.
                                            //var dialogButtons = $('#DeleteAParticipantDialog').dialog('option', 'buttons');
                                            //$.each(dialogButtons, function (buttonIndex, button) {
                                            //    if (button.id === 'btnDeleteAParticipantAndReplaceWithNewUser') {
                                            //        button.text = 'Replace ' + userFriendlyName + ' with the new user';
                                            //        button.disabled = false;
                                            //        button.style = 'color:red;';
                                            //    }
                                            //})
                                            //$("#DeleteAParticipantDialog").dialog('option', 'buttons', dialogButtons);
                                        }
                                    }
                                } catch (e) {
                                    displayAlertDialog('Error in my.js.cmdDisplayDeleteUserDialog():1: ' + e.message);

                                }
                            },
                            error: function (data, errorCode, errorMessage) {
                                //handleExceptionWithAlert('Error in Start.js.displayConnectedWorkflows()', '1:' + errorCode + ', ' + errorMessage);
                                displayAlertDialog('Error in my.js.cmdDisplayDeleteUserDialog().itemizeparticipantdependencies: ' + errorMessage);
                            }
                        });
                    } catch (e) {

                        displayAlertDialog('Error in my.js.cmdDisplayDeleteUserDialog():2x: ' + e.message + ', ' + e.stack);
                    }
                }
            });

            $('.ui-widget-overlay').bind('click', function () { $("#DeleteAParticipantDialog").dialog('close'); }); // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.

            // Hide the title bar.
            $("#DeleteAParticipantDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
            // Set the title.
            document.getElementById('spanDeleteAParticipantDialogTitle').innerHTML = 'Remove ' + userFriendlyName + ' from this workflow.';

            //// Bind the click event!
            //$('#divDeleteAParticipantDialogReassignTasks').bind('click', function () {
            //    DeleteParticipantWhoHasNoResponsibilities(userId);
            //});


        } catch (e) {
            displayAlertDialog('Error in my.js.cmdDisplayDeleteUserDialog():2: ' + e.message + e.stack);
        }
    },

    DeleteParticipantWhoHasNoResponsibilities: function (bwParticipantId) {
        try {
            console.log('In bwParticipantsEditor.js.DeleteParticipantWhoHasNoResponsibilities(' + bwParticipantId + ').');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            var data = [];
            data = {
                participantToDeleteParticipantId: bwParticipantId,
                //ModifiedById: participantId,
                //ModifiedByFriendlyName: participantFriendlyName,
                //ModifiedByEmail: participantEmail,
                bwWorkflowAppId: workflowAppId
            };
            var operationUri = webserviceurl + "/bwworkflow/removeaparticipant"; //deleteparticipantfromworkflowapp";
            $.ajax({
                url: operationUri,
                type: "POST",
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (result) {
                    try {
                        displayAlertDialog(result.message);
                        //populateStartPageItem('divParticipants', 'Reports', '');

                        // Hide these:
                        $('#DeleteAParticipantDialog').dialog('close');
                        $('.bwCircleDialog').bwCircleDialog('hideAndDestroyCircleDialog');

                        //thiz.renderConfigurationParticipants(); // redraw the screen.
                        thiz.loadAndRenderParticipantsEditor(true);

                    } catch (e) {
                        console.log('Exception in DeleteParticipantWhoHasNoResponsibilities(' + bwParticipantId + '):2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in DeleteParticipantWhoHasNoResponsibilities(' + bwParticipantId + '):2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in my.js.DeleteParticipantWhoHasNoResponsibilities(): ' + errorMessage);
                }
            });
        } catch (e) {
            console.log('Exception in DeleteParticipantWhoHasNoResponsibilities(' + bwParticipantId + '): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in DeleteParticipantWhoHasNoResponsibilities(' + bwParticipantId + '): ' + e.message + ', ' + e.stack);
        }

    },
    ReassignParticipantResponsibilitiesAndDelete: function (userId) {
        console.log('In bwParticipantsEditor.js.ReassignParticipantResponsibilitiesAndDelete(' + userId + ').');

        var newUserFriendlyName = document.getElementById('txtDeleteAParticipantDialogUserToReplaceFriendyName').value;
        var newUserId = document.getElementById('txtDeleteAParticipantDialogUserToReplaceId').value;
        var newUserEmail = document.getElementById('txtDeleteAParticipantDialogUserToReplaceEmail').value;
        var emailTheDetails = document.getElementById('cbReassignUserTasksDialogEmailMessage').checked;

        if (newUserFriendlyName != '') {
            var data = [];
            data = {
                oldUserId: userId,
                ModifiedById: participantId,
                ModifiedByFriendlyName: participantFriendlyName,
                ModifiedByEmail: participantEmail,
                bwWorkflowAppId: workflowAppId,
                newUserFriendlyName: newUserFriendlyName,
                newUserId: newUserId,
                newUserEmail: newUserEmail
            };
            var operationUri = webserviceurl + "/bwworkflow/reassigntoanexistingparticipant";
            $.ajax({
                url: operationUri,
                type: "POST", timeout: ajaxTimeout,
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {

                    displayAlertDialog(data);
                    populateStartPageItem('divParticipants', 'Reports', '');

                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in my.js.ReassignParticipantResponsibilitiesAndDelete(): ' + errorMessage);
                }
            });
        } else {
            displayAlertDialog('Error in my.js.ReassignParticipantResponsibilitiesAndDelete(): newUserFriendlyName = ' + newUserFriendlyName);
        }


    },

    ReassignParticipantResponsibilities: function (userId, userFriendlyName, userEmail) {
        try {
            console.log('In ReassignParticipantResponsibilities().');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var workflowAppTitle = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTitle');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            var newUserFriendlyName = document.getElementById('txtReassignUserTasksDialogUserToReplaceFriendyName').value;
            var newUserId = document.getElementById('txtReassignUserTasksDialogUserToReplaceId').value;
            var newUserEmail = document.getElementById('txtReassignUserTasksDialogUserToReplaceEmail').value;
            var emailTheDetails = document.getElementById('cbReassignUserTasksDialogEmailMessage').checked;

            if (newUserFriendlyName == '') {

                displayAlertDialog('Please select the user to take over these responsibilities.');

            } else {

                var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                data = {
                    bwParticipantId_LoggedIn: participantId,
                    bwActiveStateIdentifier: activeStateIdentifier,
                    bwWorkflowAppId_LoggedIn: workflowAppId,

                    oldUserId: userId,
                    oldUserFriendlyName: userFriendlyName,
                    oldUserEmail: userEmail,
                    ModifiedById: participantId,
                    ModifiedByFriendlyName: participantFriendlyName,
                    ModifiedByEmail: participantEmail,
                    bwWorkflowAppId: workflowAppId,
                    newUserFriendlyName: newUserFriendlyName,
                    newUserId: newUserId,
                    newUserEmail: newUserEmail,
                    emailTheJustificationDetails: emailTheDetails,
                    workflowAppTitle: workflowAppTitle
                };
                var operationUri = this.options.operationUriPrefix + "_bw/bwworkflow/reassigntoanexistingparticipant";
                $.ajax({
                    url: operationUri,
                    type: "POST",
                    data: data,
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    },
                    success: function (result) {

                        if (result.message != 'SUCCESS') {

                            displayAlertDialog(result.message);

                        } else {

                            $('#ReassignUserTasksDialog').dialog('close');
                            $('.bwCircleDialog').bwCircleDialog('hideAndDestroyCircleDialog');

                            thiz.loadAndRenderParticipantsEditor(true);

                        }

                    },
                    error: function (data, errorCode, errorMessage) {
                        console.log('Error in my.js.ReassignParticipantResponsibilities(): ' + errorMessage);
                        displayAlertDialog('Error in my.js.ReassignParticipantResponsibilities(): ' + errorMessage);
                    }
                });
            }
        } catch (e) {
            console.log('Exception in ReassignParticipantResponsibilities(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in ReassignParticipantResponsibilities(): ' + e.message + ', ' + e.stack);
        }
    },







    //selectInvitationUserRole_Onchange: function (element) {
    //    try {
    //        console.log('In selectInvitationUserRole_Onchange(). selectedValue: ' + element.value);
    //        alert('In selectInvitationUserRole_Onchange(). selectedValue: ' + element.value);
    //        // participant, archiveviewer, reportviewer, configurationmanager.



    //        // MAKE THE WEB SERVICE CALL HERE 9-11-2020

    //        // GET bwInvitationId <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    //        var bwInvitationId = document.getElementById('textareaViewInvitationDialogInvitationDetails').value.split('?invitation=')[1];

    //        var newRole;
    //        var roles = document.getElementsByName('rbChangeUserRole');
    //        for (var i = 0; i < roles.length; i++) {
    //            if (roles[i].checked) newRole = roles[i].value;
    //        }
    //        debugger;
    //        data = {
    //            //sendEmailNotification: sendEmailNotification,
    //            //emailNotificationAdditionalMessage: emailNotificationAdditionalMessage,
    //            bwTenantId: tenantId,
    //            bwWorkflowAppId: workflowAppId,
    //            bwInvitationId: bwInvitationId,
    //            //bwWorkflowAppTitle: workflowAppTitle,
    //            //bwParticipantId: userId,
    //            //bwParticipantFriendlyName: userFriendlyName,
    //            //bwParticipantEmail: userEmail,
    //            //bwParticipantLogonType: logonType,
    //            bwInvitationParticipantRole: newRole,
    //            ModifiedById: participantId,
    //            ModifiedByFriendlyName: participantFriendlyName,
    //            ModifiedByEmail: participantEmail
    //        };
    //        var operationUri = webserviceurl + "/bwparticipant/updateinvitationsecurityrole"; //updateuserrole";
    //        $.ajax({
    //            url: operationUri,
    //            type: "POST",
    //            timeout: ajaxTimeout,
    //            data: data,
    //            headers: {
    //                "Accept": "application/json; odata=verbose"
    //            },
    //            success: function (data) {
    //                //displayAlertDialog(data);

    //                //if (tooltipElementId) {
    //                //    var tooltip = document.getElementById(tooltipElementId);
    //                //} else {
    //                var tooltip = document.getElementById('tooltipUpdateSecurityRoleForInvitation');
    //                //}
    //                tooltip.innerHTML = 'The Security Role for this Invitation has been updated!';
    //                tooltip.style.backgroundColor = 'seagreen';
    //                tooltip.style.color = 'white';

    //                renderConfigurationParticipants(); // redraw the perticipants editor.

    //            },
    //            error: function (data, errorCode, errorMessage) {
    //                displayAlertDialog('Error in selectInvitationUserRole_Onchange(): ' + errorMessage + ' ' + JSON.stringify(data));
    //                //WriteToErrorLog('Error in InitBudgetRequest.js.cmdCreateBudgetRequest()', 'Error creating the budget request in budgetrequests library: ' + errorCode + ', ' + errorMessage);
    //            }
    //        });
    //    } catch (e) {
    //        console.log('Exception in selectInvitationUserRole_Onchange(): ' + e.message + ', ' + e.stack);
    //    }
    //},
    //updateInvitationSecurityRole_Mouseout: function (element) {
    //    try {
    //        //console.log('In updateInvitationSecurityRole_Mouseout().');
    //        //if (element) {
    //        //    var tooltip = document.getElementById(element.id);
    //        //} else {
    //        var tooltip = document.getElementById('tooltipUpdateSecurityRoleForInvitation');
    //        //}
    //        tooltip.innerHTML = '';
    //        tooltip.style.backgroundColor = '#555';
    //        tooltip.style.color = 'white';
    //    } catch (e) {
    //        console.log('Exception in updateInvitationSecurityRole_Mouseout(): ' + e.message + ', ' + e.stack);
    //    }
    //},

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
            thiz.options.quill.setText(emailHtml);

            thiz.options.CurrentEmailTemplate.DraftEmailTemplate.Body = emailHtml;
            //this.checkIfWeHaveToDisplayThePublishChangesButton();
        } catch (e) {
            console.log('Exception in editEmailHtml(): ' + e.message + ', ' + e.stack);
        }
    },



    configureEmailTemplate_IntroductoryEmail: function () {
        try {
            console.log('In configureEmailTemplate_IntroductoryEmail().');
            var thiz = this;

            //var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            //var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            //var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            //var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            // Hit the database and get the introductory email for this organization/workflowApp.

            $.ajax({
                url: this.options.operationUriPrefix + "_bw/OrganizationIntroductoryEmailSettings/" + workflowAppId,
                dataType: "json",
                contentType: "application/json",
                type: "Get"
            }).done(function (result) {
                try {
                    debugger;
                    if (result.message != 'SUCCESS') {
                        alert('ERROR: ' + result.message);
                    } else {
                        // Set the dialog sub title.
                        var html = '';
                        html += 'This email gets sent to a "New User" when they first join this organization.';

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
                            width: '800',
                            dialogClass: 'no-close', // No close button in the upper right corner.
                            hide: false, // This means when hiding just disappear with no effects.
                            close: function () {
                                $('#divConfigureNewUserEmailsDialog').dialog('destroy');
                            },
                            open: function () {
                                try {
                                    $('.ui-widget-overlay').bind('click', function () {
                                        $('#divConfigureNewUserEmailsDialog').dialog('close');
                                    });








                                    debugger; // Display the email editor. // 9-5-2021 THIS IS THE ONE THAT WORKS. COPY CODE FROM HERE TO editStepEmails() in bwNewUserEmailEditor. <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                                    thiz.options.quillSubjectEditor = new Quill('#quillConfigureNewUserEmailsDialog_Subject', {
                                        modules: {
                                            toolbar: '#bwQuilltoolbarForSubject'
                                        },
                                        //placeholder: 'The enhanced notification email editor functionality is coming soon...', 
                                        theme: 'snow'
                                    });
                                    // Hook up this button event so that the user can insert data items into the email.
                                    var customButton1 = document.querySelector('#btnQuill_InsertADataItemForSubject');
                                    customButton1.addEventListener('click', function () {
                                        //console.log('btnQuill_InsertADataItem: This functionality is incomplete. Coming soon!');
                                        thiz.displayEmailDataItemPickerDialog('subject');
                                    });
                                    //debugger;
                                    thiz.options.quill = new Quill('#quillConfigureNewUserEmailsDialog_Body', {
                                        modules: {
                                            toolbar: '#bwQuilltoolbar'
                                        },
                                        //placeholder: 'The enhanced notification email editor functionality is coming soon...', 
                                        theme: 'snow'
                                    });


                                    thiz.options.quillSubjectEditor.on('text-change', function (delta, oldDelta, source) {
                                        //debugger;
                                        thiz.options.userHasMadeChangesToTheEmailTemplate = true;
                                        //thiz.checkIfWeHaveToDisplayThePublishChangesButton();
                                    });

                                    thiz.options.quill.on('text-change', function (delta, oldDelta, source) {
                                        //debugger;
                                        thiz.options.userHasMadeChangesToTheEmailTemplate = true;
                                        //thiz.checkIfWeHaveToDisplayThePublishChangesButton();
                                    });



                                    // Hook up this button event so that the user can insert data items into the email.
                                    var customButton = document.querySelector('#btnQuill_InsertADataItem');
                                    customButton.addEventListener('click', function () {
                                        //console.log('btnQuill_InsertADataItem: This functionality is incomplete. Coming soon!');
                                        thiz.displayEmailDataItemPickerDialog('body');
                                    });
                                    //// Retrieve the email from the workflow and display it in the editor.


                                    var button = document.getElementById('divNewUserEmailEditor_PreviewAndEditButton');
                                    button.innerHTML = '       ❐ Edit email HTML';
                                    $(button).unbind('click').click(function (error) {
                                        try {
                                            console.log('In renderEmailEditor.divNewUserEmailEditor_PreviewAndEditButton.click().');
                                            thiz.editEmailHtml();
                                        } catch (e) {
                                            console.log('Exception in renderEmailEditor.divNewUserEmailEditor_PreviewAndEditButton.click(): ' + e.message + ', ' + e.stack);
                                        }
                                    });



                                    //debugger;
                                    var emailTemplateForSubject;
                                    var emailTemplate;
                                    if (result.bwIntroductoryEmailHtml) {
                                        // Yay, we got the email template from the database for this organization/workflowApp.
                                        emailTemplate = JSON.parse(result.bwIntroductoryEmailHtml);
                                        emailTemplateForSubject = emailTemplate.Subject;
                                        emailTemplate = emailTemplate.Body;
                                    } else {
                                        var prettyGlobalUrl2 = 'BudgetWorkflow.com';
                                        var globalUrl = 'budgetworkflow.com';
                                        //
                                        // At this point we should send a nice email introducing BudgetRequests.com!
                                        //
                                        var emailSubject = 'Welcome to ' + prettyGlobalUrl2 + '';
                                        var emailBody = '';

                                        emailBody += '<table style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;">';
                                        emailBody += '        <tr>';
                                        emailBody += '            <td>';
                                        emailBody += '                <span style="font-weight:bold;">Welcome to ' + prettyGlobalUrl2 + '</span>';
                                        emailBody += '                <br /><br />';
                                        emailBody += '            </td>';
                                        emailBody += '        </tr>';

                                        emailBody += '        <tr>';
                                        emailBody += '            <td>';
                                        emailBody += '                Here is a video to help get you started: "Using your budget request system."';
                                        emailBody += '            </td>';
                                        emailBody += '        </tr>';

                                        emailBody += '        <tr>';
                                        emailBody += '            <td>';
                                        emailBody += '                <a href="https://www.youtube.com/watch?v=uEqW4ang8SI&t=3s" target="_blank"><img src="https://' + globalUrl + '/images/marketing/white-on-black-360x360-roun.png" style="width:180px;height:180px;" title="Click to play video..." /></a>';
                                        emailBody += '            </td>';
                                        emailBody += '        </tr>';

                                        emailBody += '        <tr>';
                                        emailBody += '            <td>';
                                        emailBody += '                <br /><br />';
                                        emailBody += '            </td>';
                                        emailBody += '        </tr>';

                                        emailBody += '        <tr>';
                                        emailBody += '            <td>';
                                        emailBody += '                <span style="font-weight:bold;">Here are some tips which will help you get up and running quickly!</span>';
                                        emailBody += '            </td>';
                                        emailBody += '        </tr>';

                                        emailBody += '        <tr>';
                                        emailBody += '            <td>';
                                        emailBody += '                <br />';
                                        emailBody += '            </td>';
                                        emailBody += '        </tr>';

                                        emailBody += '        <tr>';
                                        emailBody += '            <td>';
                                        emailBody += '                After you logon, the next step is to invite participants to your budget request system. Click the "Generate invitation" button, then copy and paste the invitation link into an email. You will be notified with an email when they have joined!';
                                        emailBody += '            </td>';
                                        emailBody += '        </tr>';

                                        emailBody += '        <tr>';
                                        emailBody += '            <td>';
                                        emailBody += '                <img src="https://' + globalUrl + '/images/marketing/send-an-invitation.png" />';
                                        emailBody += '            </td>';
                                        emailBody += '        </tr>';

                                        emailBody += '        <tr>';
                                        emailBody += '            <td>';
                                        emailBody += '                <br /><br />';
                                        emailBody += '            </td>';
                                        emailBody += '        </tr>';

                                        emailBody += '        <tr>';
                                        emailBody += '            <td>';
                                        emailBody += '                You can start using your budget request system immediately by filling out a new budget request. A sample financial area - called <i>Miscellaneous (express setup)</i> - lets you see how the system works right away.';
                                        emailBody += '            </td>';
                                        emailBody += '        </tr>';

                                        emailBody += '        <tr>';
                                        emailBody += '            <td>';
                                        emailBody += '                <img src="https://' + globalUrl + '/images/marketing/new-budget-request.png" />';
                                        emailBody += '            </td>';
                                        emailBody += '        </tr>';

                                        emailBody += '        <tr>';
                                        emailBody += '            <td>';
                                        emailBody += '                <br /><br />';
                                        emailBody += '            </td>';
                                        emailBody += '        </tr>';

                                        emailBody += '        <tr>';
                                        emailBody += '            <td>';
                                        emailBody += '                Create financial areas unique to your budget request system. These may reflect your general ledger accounts, or departmental and management structure.';
                                        emailBody += '            </td>';
                                        emailBody += '        </tr>';

                                        emailBody += '        <tr>';
                                        emailBody += '            <td>';
                                        emailBody += '                <img src="https://' + globalUrl + '/images/marketing/financial-areas.png" />';
                                        emailBody += '            </td>';
                                        emailBody += '        </tr>';

                                        emailBody += '        <tr>';
                                        emailBody += '            <td>';
                                        emailBody += '                <br /><br />';
                                        emailBody += '            </td>';
                                        emailBody += '        </tr>';

                                        emailBody += '        <tr>';
                                        emailBody += '            <td>';
                                        emailBody += '                If you use an iPhone or Android, the display is designed for these smaller devices.';
                                        emailBody += '            </td>';
                                        emailBody += '        </tr>';

                                        emailBody += '        <tr>';
                                        emailBody += '            <td>';
                                        emailBody += '                <img src="https://' + globalUrl + '/images/marketing/mobile-screenshot.png" />';
                                        emailBody += '            </td>';
                                        emailBody += '        </tr>';

                                        emailBody += '        <tr>';
                                        emailBody += '            <td>';
                                        emailBody += '                <br /><br />';
                                        emailBody += '            </td>';
                                        emailBody += '        </tr>';

                                        emailBody += '        <tr>';
                                        emailBody += '            <td>';
                                        emailBody += '                <hr />';
                                        emailBody += '                <i>I would like to introduce myself. My name is Todd Hiltz, and I am the creator of this software. Feel free to contact me anytime at todd_hiltz@hotmail.com with any questions or comments you may have! I want to help everyone get the most out of this software! - Todd Hiltz</i>';
                                        emailBody += '                <br />';
                                        emailBody += '            </td>';
                                        emailBody += '        </tr>';

                                        emailBody += '        <tr>';
                                        emailBody += '            <td>';
                                        emailBody += '                <hr />';
                                        emailBody += '                <i>This is an automated email from <a href="https://' + globalUrl + '" target="_blank">' + prettyGlobalUrl2 + '</a>.</i>';
                                        emailBody += '            </td>';
                                        emailBody += '        </tr>';
                                        emailBody += '    </table>';
                                        emailTemplateForSubject = emailSubject;
                                        emailTemplate = emailBody;
                                    }

                                    //var emailTemplateForSubject = thiz.options.CurrentEmailTemplate.EmailTemplate.Subject;
                                    //var emailTemplate = thiz.options.CurrentEmailTemplate.EmailTemplate.Body;

                                    if (emailTemplateForSubject && emailTemplateForSubject != '') {
                                        thiz.options.quillSubjectEditor.setText(emailTemplateForSubject);
                                    } else {
                                        thiz.options.quillSubjectEditor.setText('xcx44');
                                    }
                                    //debugger;
                                    if (emailTemplate && emailTemplate != '') {
                                        //debugger;
                                        thiz.options.quill.setText(''); // Do this first so we don't get double the email!
                                        //thiz.options.quill.root.innerHTML = emailTemplate; //.setText(emailTemplate);
                                        //thiz.options.quill.setText(emailTemplate);
                                        thiz.options.quill.clipboard.dangerouslyPasteHTML(0, emailTemplate);
                                    } else {
                                        thiz.options.quill.setText('');
                                    }












                                } catch (e) {
                                    console.log('Exception in configureEmailTemplate_IntroductoryEmail:1-1: ' + e.message + ', ' + e.stack);
                                }




                            }
                        });


                    }

                } catch (e) {
                    console.log('Exception in configureEmailTemplate_IntroductoryEmail:1-2: ' + e.message + ', ' + e.stack);
                }








            }).fail(function (data) {
                console.log('In xx1.fail(): ' + JSON.stringify(data));
                var msg;
                if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                } else {
                    msg = JSON.stringify(data);
                }
                alert('Exception in configureEmailTemplate_IntroductoryEmail:2: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                console.log('Exception in configureEmailTemplate_IntroductoryEmail:2: ' + JSON.stringify(data));
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
            console.log('Exception in configureEmailTemplate_IntroductoryEmail(): ' + e.message + ', ' + e.stack);
        }
    },

    configureEmailTemplate_ChangedSecurityRole: function () {
        try {
            console.log('In configureEmailTemplate_ChangedSecurityRole().');

            alert('This functionality is incomplete. Coming soon!');
        } catch (e) {
            console.log('Exception in xx(): ' + e.message + ', ' + e.stack);
        }
    },
    configureEmailTemplate_ReassignedResponsibilities: function () {
        try {
            console.log('In configureEmailTemplate_ChangedSecurityRole().');

            alert('This functionality is incomplete. Coming soon!');
        } catch (e) {
            console.log('Exception in xx(): ' + e.message + ', ' + e.stack);
        }
    },



    publishEmailTemplateConfigurationAndActivate: function () {
        var thiz = this;
        try {
            console.log('In publishEmailTemplateConfigurationAndActivate().');
            //debugger;
            var json = {
                Subject: thiz.options.quillSubjectEditor.getText(),
                Body: thiz.options.quill.container.firstChild.innerHTML
            };
            var json = {
                bwWorkflowAppId: workflowAppId,
                bwIntroductoryEmailHtml: JSON.stringify(json)
            };
            $.ajax({
                url: thiz.options.operationUriPrefix + "_bw/PublishOrganizationIntroductoryEmailTemplate",
                type: "Post",
                timeout: thiz.options.ajaxTimeout,
                data: json,
                headers: {
                    "Accept": "application/json; odata=verbose"
                }
            }).success(function (result) {
                try {
                    if (result.message != 'SUCCESS') {
                        alert('ERROR: ' + result.message);
                    } else {
                        console.log('In PublishOrganizationIntroductoryEmailTemplate().post: Successfully updated DB. result: ' + JSON.stringify(result));
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
                                thiz.checkIfWeHaveToDisplayThePublishChangesButton();

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
                    console.log('Exception in PublishOrganizationIntroductoryEmailTemplate().xx.update: ' + e.message + ', ' + e.stack);
                    alert('Exception in PublishOrganizationIntroductoryEmailTemplate().xx.update: ' + e.message + ', ' + e.stack);
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
                console.log('Fail in PublishOrganizationIntroductoryEmailTemplate().xx.update: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
                alert('Fail in PublishOrganizationIntroductoryEmailTemplate().xx.update: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                //var error = JSON.parse(data.responseText)["odata.error"];
                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            });
        } catch (e) {
            debugger;
            //thiz.hideProgress();
            alert('Exception in PublishOrganizationIntroductoryEmailTemplate(): ' + e.message + ', ' + e.stack);
            console.log('Exception in PublishOrganizationIntroductoryEmailTemplate(): ' + e.message + ', ' + e.stack);
        }
    },















    assignParticipantToOrgRole: function (bwParticipantId, bwParticipantFriendlyName, bwParticipantEmail, bwRoleId, bwRoleName) {
        try {
            console.log('In bwParticipantsEditor.js.assignParticipantToOrgRole(). bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail);
            var thiz = this;

            var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            //alert('In bwParticipantsEditor.js.assignParticipantToOrgRole(). <br />We need to check:<br />- Check that noone already belongs to this role in this org location.<br />- Check that it is not a singleton role, and that someone belongs to it already.<br />- The organization has been updated.<br />- Once it is published, notify the user that the change is immediate, and that to change it in the future, go to Configuration > Organization and view the Kentville org location.');

            //ShowActivitySpinner();
            // Perhaps display the activity spinner... this may take a few seconds... since we have to load the orgRoles Json, etc.
            // Step 1: Load the OrgRoles Json. Step 2: Make the change. Step 3: When saving, make sure it hasn't been changed by someone else. Concurrency!!!!!







            //$.ajax({
            //    url: this.options.operationUriPrefix + "odata/OrgRolesConfiguration/" + workflowAppId + "/true", //?$filter=Active eq true", //('eCarWorkflow')", // Get the eCarWorkflow json/definition from the database.
            //    dataType: "json",
            //    contentType: "application/json",
            //    type: "Get"
            //}).done(function (result) {

            //var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            //var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');
            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                bwWorkflowAppId: workflowAppId,
                isActive: true,
                bwRequestType: 'ALL'
            };

            $.ajax({
                url: this.options.operationUriPrefix + "_bw/orgrolesconfiguration",
                type: "POST",
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (result) {
                    try {


                        HideActivitySpinner();

                        debugger;
                        var json = result.value;

                        var orgId = $('#divParticipantOrgRolePickerDialog').find('.bwOrganizationPicker').bwOrganizationPicker('option', 'bwOrgId');
                        var orgName = $('#divParticipantOrgRolePickerDialog').find('.bwOrganizationPicker').bwOrganizationPicker('option', 'bwOrgName');

                        //
                        // We need to find this org in the JSON.
                        //
                        var d1, g1, e1, l1;
                        //var orgName = '';
                        if (orgId == json.Global.Id) {
                            d1 = 'root';
                            g1 = undefined;
                            e1 = undefined;
                            l1 = undefined;
                        } else {
                            for (var d = 0; d < json.Global.Divisions.Items.length; d++) {
                                if (orgId == json.Global.Divisions.Items[d].Id) {
                                    d1 = d;
                                    g1 = undefined;
                                    e1 = undefined;
                                    l1 = undefined;
                                    break;
                                }
                                for (var g = 0; g < json.Global.Divisions.Items[d].Groups.Items.length; g++) {
                                    if (orgId == json.Global.Divisions.Items[d].Groups.Items[g].Id) {
                                        d1 = d;
                                        g1 = g;
                                        e1 = undefined;
                                        l1 = undefined;
                                        break;
                                    }
                                    for (var e = 0; e < json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items.length; e++) {
                                        if (orgId == json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Id) {
                                            d1 = d;
                                            g1 = g;
                                            e1 = e;
                                            l1 = undefined;
                                            break;
                                        }
                                        for (var l = 0; l < json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items.length; l++) {
                                            if (orgId == json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Id) {
                                                d1 = d;
                                                g1 = g;
                                                e1 = e;
                                                l1 = l;
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        var divisionIndex = d1;
                        var groupIndex = g1;
                        var entityIndex = e1;
                        var locationIndex = l1;

                        //debugger;

                        //
                        // Now that we have the location in the JSON, we have to make sure there is a "Roles" attribute at the correct org/location.
                        //
                        var roles;
                        if ((locationIndex && locationIndex != 'undefined') || locationIndex > -1) {
                            if (!json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex].Roles) {
                                json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex]["Roles"] = [];
                            }
                            roles = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex].Roles;
                        } else if ((entityIndex && entityIndex != 'undefined') || entityIndex > -1) {
                            if (!json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Roles) {
                                json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex]["Roles"] = [];
                            }
                            roles = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Roles;
                        } else if ((groupIndex && groupIndex != 'undefined') || groupIndex > -1) {
                            if (!json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Roles) {
                                json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex]["Roles"] = [];
                            }
                            roles = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Roles;
                        } else if ((divisionIndex && divisionIndex != 'undefined') || divisionIndex > -1) {
                            if (divisionIndex == 'root') {
                                if (!json.Global.Roles) {
                                    json.Global["Roles"] = [];
                                }
                                roles = json.Global.Roles;
                            } else {
                                if (!json.Global.Divisions.Items[divisionIndex].Roles) {
                                    json.Global.Divisions.Items[divisionIndex]["Roles"] = [];
                                }
                                roles = json.Global.Divisions.Items[divisionIndex].Roles;
                            }
                        } else {
                            alert('Error: Unexpected parameter in OrgRoleCheckbox_Onchange():1:.');
                        }


                        var theRoleAssignmentExistsHereAlready = false;
                        var existingRoleAssignment;
                        for (var i = 0; i < roles.length; i++) {
                            if (bwRoleId == roles[i].RoleId) {
                                // This role assignment already exists. Prompt the user, "This role assignment already exists for user "xx". Do you wish to replace this person with "xx"?
                                theRoleAssignmentExistsHereAlready = true;
                                existingRoleAssignment = roles[i];
                            }
                        }

                        if (theRoleAssignmentExistsHereAlready == true) {
                            var html = '';
                            //html += 'The role of "' + existingRoleAssignment.RoleName + '" (' + existingRoleAssignment.RoleId + ') is already assigned to "' + existingRoleAssignment.ParticipantFriendlyName + '" (' + existingRoleAssignment.ParticipantEmail + ') for "' + orgName + '".';
                            //html += '\n\nDo you wish to replace "' + existingRoleAssignment.ParticipantFriendlyName + '" (in ' + orgName + '), and assign this role to "' + bwParticipantFriendlyName + '"?';
                            //html += '\n\n' + existingRoleAssignment.ParticipantFriendlyName + ' may have outstanding tasks in their role as ' + existingRoleAssignment.RoleName + '. Do you wish to assign these to ' + bwParticipantFriendlyName + '?';
                            //html += '\n\n' + existingRoleAssignment.ParticipantFriendlyName + ' may be leaving the organization? Do you wish to assign all of their tasks to ' + bwParticipantFriendlyName + '?';


                            html += '<span style="color:tomato;">The role of "' + existingRoleAssignment.RoleName + '" (' + existingRoleAssignment.RoleId + ') is currently assigned to "' + existingRoleAssignment.ParticipantFriendlyName + '" (' + existingRoleAssignment.ParticipantEmail + ') for "' + orgName + '".';
                            html += '<br /><br />You cannot change this here. Go to "Configuration > Organization" to change the person who is in the role of "' + existingRoleAssignment.RoleName + '" for "' + orgName + '".</span>'
                            $('#spanParticipantOrgRolePickerDialogContent_Bottom').html(html);

                            // Prompt the user to select "Yes" or "No".
                            // If they choose "Yes", we have to:
                            //  - Find out what tasks need to be re-assigned. When a role membership changes, we have to check if there are tasks that need to be re-assigned.


                            //html = '<div class="divSignInButton_Disabled" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" >';
                            //html += 'Publish this update to the Organization';
                            //html += '</div>';
                            $('#divParticipantOrgRolePickerDialog_PublishButton').html('');



                        } else {

                            //
                            // Step 1: Add this role to the OrgRoles JSON.
                            //
                            var newRole = {
                                RoleId: bwRoleId,
                                RoleName: bwRoleName,
                                ParticipantId: bwParticipantId,
                                ParticipantFriendlyName: bwParticipantFriendlyName,
                                ParticipantEmail: bwParticipantEmail,
                                ParticipantIsDirty: true, // Using this so we can go through and make sure the entries are made in the BwWorkflowUserRole table! 
                                ParticipantIsDirtyAction: 'ADDORUPDATE'
                            };
                            roles.push(newRole);


                            //
                            // Step 3: The bwOrganizationEditor saves it this way:
                            //
                            var data = {
                                bwTenantId: tenantId,
                                bwWorkflowAppId: workflowAppId,
                                CreatedBy: participantFriendlyName,
                                CreatedById: participantId,
                                CreatedByEmail: participantEmail,
                                bwOrgRolesJson: JSON.stringify(json.Global), // thiz.options.store.Global),
                                bwOrgRolesActive: true
                            };

                            $.ajax({
                                url: thiz.options.operationUriPrefix + "_bw/SaveBwOrgRoles_With_SynchronizeParticipantOrgRoles", // This also updates the participants when Role.ParticipantIsDirty == true. The web service has to iterate through all nodes and process these. Then mark as false, before saving the json.
                                type: "Post",
                                data: data,
                                headers: {
                                    "Accept": "application/json; odata=verbose"
                                }
                            },
                                success: function (result) {
                                    try {
                                        debugger;
                                        if (result.message != 'SUCCESS') {
                                            alert('Error in assignParticipantToOrgRole(): ' + JSON.stringify(result));
                                        } else {
                                            //debugger;
                                            //thiz.hideProgress();
                                            console.log('In assignParticipantToOrgRole().post: Successfully updated DB. result: ' + JSON.stringify(result)); // using (' + JSON.stringify(json) + ').');
                                            // Display a dialog with an "Undo" button!!!!
                                            //alert('Successfully updated the database. THIS WORKFLOW CHANGE WILL TAKE PLACE IMMEDIATELY!');
                                            //debugger; // xcx1

                                            $('#divParticipantOrgRolePickerDialog').dialog('close');


                                            //if ($('#divUndoOrgRolesActivationDialog').is(':visible') != true) { // FIX!!!!!!!!!!!!!!!!! DOING THIS JUST TO GET THINGS WORKING. This gets called too many times here...
                                            $('#divUndoOrgRolesActivationDialog2').dialog({
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
                                                        $('#divUndoOrgRolesActivationDialog2').dialog('close');
                                                    });
                                                },
                                                close: function () {
                                                    //$('#divUndoOrgRolesActivationDialog').dialog("destroy");
                                                    //    //thiz._create(); // When the user closes this dialog, we regenerate the screen to reflect the newly created and activated workflow. <<< NOT NECESSARY!!!! ONLY USING FOR TESTING.
                                                    //    debugger;
                                                    //    thiz.checkIfWeHaveToDisplayThePublishChangesButton();
                                                }
                                            });
                                            //$('#divUndoOrgRolesActivationDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
                                            //}
                                            // re-sync this.options.store
                                            //var oldJsonString = JSON.stringify(this.options.store.Workflow);
                                            //thiz.options.store.DraftGlobal = JSON.parse(JSON.stringify(thiz.options.store.Global)); //var newJsonString = JSON.stringify(this.options.store.DraftWorkflow);

                                            //thiz.checkIfWeHaveToDisplayThePublishChangesButton();


                                            //alert('In saveOrgRolesConfigurationAndActivateAndUpdateParticipants(): WE NEED TO CHECK THE JSON FOR ParticipantIsDirty SO THAT WE UPDATE THE xx TABLE ACCODINGLY!!!!');
                                        }

                                    } catch (e) {
                                        console.log('Exception in assignParticipantToOrgRole().xx.update: ' + e.message + ', ' + e.stack);
                                        alert('Exception in assignParticipantToOrgRole().xx.update: ' + e.message + ', ' + e.stack);
                                    }
                                },
                                error: function (data, errorCode, errorMessage) {
                                    try {
                                        //debugger;
                                        ////thiz.hideProgress();
                                        //var msg;
                                        //if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                                        //    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                                        //} else {
                                        //    msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
                                        //}
                                        //console.log('Fail in assignParticipantToOrgRole().xx.update: ' + ', url: ' + thiz.options.operationUriPrefix + "_bw/SaveBwOrgRoles_With_SynchronizeParticipantOrgRoles, data: " + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
                                        //alert('Fail in assignParticipantToOrgRole().xx.update: ' + ', url: ' + thiz.options.operationUriPrefix + "_bw/SaveBwOrgRoles_With_SynchronizeParticipantOrgRoles, data: " + JSON.stringify(data) + ', json: ' + JSON.stringify(json)); //+ error.message.value + ' ' + error.innererror.message);
                                        ////console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                                        ////var error = JSON.parse(data.responseText)["odata.error"];
                                        ////alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                                    } catch (e) {
                                        console.log('Exception in assignParticipantToOrgRole().xx.update: ' + e.message + ', ' + e.stack);
                                        alert('Exception in assignParticipantToOrgRole().xx.update: ' + e.message + ', ' + e.stack);
                                    }
                                }
                                    });




            //alert('This functionality is incomplete. Coming soon! xcxq23423526');

            //}


            //
            // The user has added this role. 

            //} else {
            //    // The user has removed this role.
            //    for (var i = 0; i < roles.length; i++) {
            //        if (roles[i].RoleId == roleId) {
            //            //// Delete this role from the roles array!!
            //            //roles.splice(i, 1);
            //            // Mark this role to be deleted when published back to the server!
            //            roles[i].ParticipantIsDirty = true;
            //            roles[i].ParticipantIsDirtyAction = 'REMOVE';
            //        }
            //    }
            //}


            //debugger;
            //var test = '';


            //}).fail(function (data) {
        } catch (e) {
            console.log('Exception in bwParticipantsEditor.js.assignParticipantToOrgRole(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwParticipantsEditor.js.assignParticipantToOrgRole(): ' + e.message + ', ' + e.stack);
        }
    },
    error: function (data, errorCode, errorMessage) {
        console.log('Error in bwParticipantsEditor.js.assignParticipantToOrgRole(). errorMessage: ' + errorMessage + ', errorCode: ' + errorCode + ', data: ' + JSON.stringify(data));
        displayAlertDialog('Error in bwParticipantsEditor.js.assignParticipantToOrgRole(). errorMessage: ' + errorMessage + ', errorCode: ' + errorCode + ', data: ' + JSON.stringify(data));
    }
});

        } catch (e) {
    console.log('Exception in bwParticipantsEditor.js.assignParticipantToOrgRole(): ' + e.message + ', ' + e.stack);
    displayAlertDialog('Exception in bwParticipantsEditor.js.assignParticipantToOrgRole(): ' + e.message + ', ' + e.stack);
}
    },


orgPicker_OnChange: function () {
    try {
        console.log('In orgPicker_OnChange().');

        var bwOrgName = $('#divParticipantOrgRolePickerDialog_OrgPicker').bwOrganizationPicker('option', 'bwOrgName');

        //alert('In orgPicker_OnChange().');

        // Add the role assignment for this user.
        var html = '';
        html += bwOrgName
        //html += 'Assign Role "' + bwRoleName + '" (' + bwRoleId + ') to "' + bwParticipantFriendlyName + '" (' + bwParticipantEmail + ') for "' + bwOrgName + '".';
        $('#spanParticipantOrgRolePickerDialog_HeaderTitle_bwOrgName').html(html);


    } catch (e) {
        console.log('Exception in orgPicker_OnChange(): ' + e.message + ', ' + e.stack);
        displayAlertDialog('Exception in orgPicker_OnChange(): ' + e.message + ', ' + e.stack);
    }
},

participantOrgRoleCheckbox_OnChange: function (checkboxElement, bwParticipantId, bwParticipantFriendlyName, bwParticipantEmail, bwRoleId, bwRoleName) {
    try {
        console.log('In bwParticipantsEditor.js.participantOrgRoleCheckbox_OnChange(). bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ', bwRoleId: ' + bwRoleId + ', bwRoleName: ' + bwRoleName);

        //alert('In bwParticipantsEditor.js.participantOrgRoleCheckbox_OnChange(). This functionality is incomplete. Coming soon!');


        $('#spanParticipantOrgRolePickerDialogContent').empty(); // We have to empty the contents of the dialog before it is displayed.
        $("#divParticipantOrgRolePickerDialog").dialog({
            modal: false,
            resizable: true,
            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
            width: "720px",
            dialogClass: "no-close", // No close button in the upper right corner.
            hide: false,//, // This means when hiding just disappear with no effects.
            position: {
                my: "middle top+12",
                at: "middle top",
                of: window
            },
            close: function () {

                $('.bwCircleDialog').bwCircleDialog('hideAndDestroyCircleDialog'); // This has to be closed, otherwise the user will be looking at a User/Role chackbox in the incorrect state.
                $(this).dialog('destroy');

            },
            open: function () {
                try {
                    $('#spanParticipantOrgRolePickerDialogContent').html('<div id="divParticipantOrgRolePickerDialog_OrgPicker"></div>');

                    $('#divParticipantOrgRolePickerDialog_OrgPicker').bwOrganizationPicker({
                        parentElementId: 'divParticipantOrgRolePickerDialog', launchedFromDialog: true
                    });

                    var bwOrgName = $('#divParticipantOrgRolePickerDialog_OrgPicker').bwOrganizationPicker('option', 'bwOrgName');

                    if ($(checkboxElement).prop("checked") == false) {

                        // Remove the role assignment for this user.
                        $('#spanParticipantOrgRolePickerDialog_HeaderTitle').html('Remove role assignment for Todd Hiltz for this Org Location.');

                    } else if ($(checkboxElement).prop("checked") == true) {

                        // Add the role assignment for this user.
                        var html = '';

                        html = 'Assign Role "' + bwRoleName + '"';
                        $('#spanParticipantOrgRolePickerDialog_HeaderTitle').html(html);

                        html = '<span style="font-weight:bold;">Select the Role Location from the Organization picker:</span><br /><br />';
                        $('#spanParticipantOrgRolePickerDialogContent').prepend(html);

                        html = '<span style="color:tomato;">Assign Role "' + bwRoleName + '" (' + bwRoleId + ') to "' + bwParticipantFriendlyName + '" (' + bwParticipantEmail + ') for "' + '<span id="spanParticipantOrgRolePickerDialog_HeaderTitle_bwOrgName">[spanParticipantOrgRolePickerDialog_HeaderTitle_bwOrgName]</span>' + '".</span>';
                        $('#spanParticipantOrgRolePickerDialogContent_Bottom').html(html);

                        // Set the button.
                        html = '<div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'assignParticipantToOrgRole\', \'' + bwParticipantId + '\', \'' + bwParticipantFriendlyName + '\', \'' + bwParticipantEmail + '\', \'' + bwRoleId + '\', \'' + bwRoleName + '\');">';
                        html += 'Publish this update to the Organization';
                        html += '</div>';
                        $('#divParticipantOrgRolePickerDialog_PublishButton').html(html);

                    } else {

                        // Unexpected value for checkobx.
                        var msg = 'Unexpected value for checkbox state: checkboxElement checked: ' + $(checkboxElement).prop("checked");
                        $('#spanParticipantOrgRolePickerDialog_HeaderTitle').html(msg);
                        console.log(msg);
                        displayAlertDialog(msg);

                    }






                    //debugger; // 1-8-2022
                    //var requestDialogId = 'AttachmentsDialog1';

                    //$('#' + requestDialogId).css('overflow', 'hidden'); // This keeps the scroll bars from showing up on the form dialog!!!!!!!! 7-13-2020

                    //var element = document.getElementById(requestDialogId).parentNode; // This is the best way to get a handle on the jquery dialog.
                    //var requestDialogParentId = requestDialogId + '_Parent'; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.
                    //element.id = requestDialogParentId; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.

                    //// This creates the custom header/draggable bar on the dialog!!! 4-2-2020. // ☈ ☇ https://www.toptal.com/designers/htmlarrows/symbols/thunderstorm/
                    //var html = '';

                    //html += '<table style="width:100%;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequestDialog\');">'; // This click event is like "pin". Once the user clicks the header of the request dialog, it no longer is modal and persists on the screen until they choose to close it.
                    //html += '   <tr>';
                    //html += '       <td style="width:95%;">';
                    ////html += '           <div id="slider_' + budgetRequestId + '" style="width:20%;cursor:pointer;"></div>';
                    //html += '           <div id="slider_' + requestDialogId + '" style="width:20%;cursor:pointer;"></div>';
                    //html += '       </td>';



                    //html += '       <td style="vertical-align:middle;width:5%;padding:0;border:0;margin:0;">';
                    //// 2-11-2022
                    //html += '           <div title="pin" class="pinButton" style="display:inline-block;font-size:18pt;cursor:pointer !important;" onclick="$(\'.bwRequest\').bwRequest(\'pinAttachmentsDialog\');"><img src="/images/pin2.jpeg" style="width:50px;height:50px;cursor:pointer !important;" onclick="$(\'.bwRequest\').bwRequest(\'pinAttachmentsDialog\');" /></div>';


                    //html += '       </td>';

                    //html += '       <td style="vertical-align:middle;width:5%;padding:0;border:0;margin:0;">';






                    //html += '           <div title="print" class="printButton" style="display:inline-block;font-size:18pt;cursor:pointer !important;" onclick="$(\'.bwPrintButton\').bwPrintButton(\'PrintIndividualRequestReport\', \'' + 'divAttachmentsDialog1Contents' + '\');"><img src="/images/iosprinter_blue.png" style="width:50px;height:50px;cursor:pointer !important;"  /></div>';





                    //html += '       </td>';
                    //html += '       <td>&nbsp;&nbsp;</td>';
                    //html += '       <td>';
                    //html += '           <span class="dialogXButton" style="font-size:25pt;cursor:pointer;width:100%;font-weight:bold;" onclick="$(\'.bwPageScrollingHandler\').bwPageScrollingHandler(\'CloseDialogAndPreventNextWindowScrollEvent\', \'' + requestDialogId.replace('_Parent', '') + '\');">X</span>';
                    //html += '       </td>';
                    //html += '   </tr>';
                    //html += '</table>';
                    //document.getElementById(requestDialogId).parentNode.querySelector(".ui-dialog-titlebar").innerHTML = html;

                    //$("#slider_" + requestDialogId).slider({
                    //    min: 50,
                    //    max: 200,
                    //    value: 100, // It starts off full size.
                    //    slide: function (event, ui) {
                    //        //thiz.setZoom(ui.value, requestDialogId);
                    //        $('.bwRequest').bwRequest('setZoom', ui.value, requestDialogId);
                    //    }//,
                    //    //change: function (event, ui) {
                    //    //    thiz.setZoom(ui.value, requestDialogId);
                    //    //}
                    //});
                    //$('.bwRequest').bwRequest('setZoom', '100', requestDialogId);
                } catch (e) {
                    console.log('Exception in bwParticipantsEditor.js.participantOrgRoleCheckbox_OnChange.dialog.open(): ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in bwParticipantsEditor.js.participantOrgRoleCheckbox_OnChange.dialog.open(): ' + e.message + ', ' + e.stack);
                }
            }
        });
        //$("#AttachmentsDialog1").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();






    } catch (e) {
        console.log('Exception in bwParticipantsEditor.js.participantOrgRoleCheckbox_OnChange(): ' + e.message + ', ' + e.stack);
        displayAlertDialog('Exception in bwParticipantsEditor.js.participantOrgRoleCheckbox_OnChange(): ' + e.message + ', ' + e.stack);
    }
},




reassignAdminRole: function (assignToId, assignToFriendlyName, assignToEmail, modifiedById, modifiedByFriendlyName, modifiedByEmail) {
    try {
        console.log('In reassignAdminRole(). assignToId: ' + assignToId + ', assignToFriendlyName: ' + assignToFriendlyName + ', assignToEmail: ' + assignToEmail + ', modifiedById: ' + modifiedById + ', modifiedByFriendlyName: ' + modifiedByFriendlyName + ', modifiedByEmail: ' + modifiedByEmail);
        $('#btnChangeAdminRoleDialogChangeRole').unbind();
        var thiz = this;
        // We need to be able to reassign the ADMIN role here!!!
        if (!(assignToId && assignToFriendlyName && assignToEmail && modifiedById && modifiedByFriendlyName && modifiedByEmail)) {
            alert('Not all information was specified for reassignAdminRole(). This process cannot continue.');
        } else {
            // BwWorkflowUserRole
            //alert('In reassignAdminRole(). This functionality is incomplete. Coming soon!');
            var json = {
                bwTenantId: tenantId,
                bwWorkflowAppId: workflowAppId,
                bwParticipantId: assignToId,
                bwParticipantFriendlyName: assignToFriendlyName,
                bwParticipantEmail: assignToEmail,
                ModifiedByFriendlyName: modifiedByFriendlyName,
                ModifiedById: modifiedById,
                ModifiedByEmail: modifiedByEmail
            };
            $.ajax({
                url: thiz.options.operationUriPrefix + "odata/ReassignAdminRole",
                type: "Post",
                timeout: thiz.options.ajaxTimeout,
                data: json,
                headers: {
                    "Accept": "application/json; odata=verbose"
                }
            }).success(function (result) {
                try {


                    alert(result.message);
                    // CLEAN UP and reload bwParticipantsEditor.
                    $("#ChangeAdminRoleDialog").dialog('close');
                    $('.bwCircleDialog').bwCircleDialog('hideAndDestroyCircleDialog');
                    // Also clear the data as it needs reloading.
                    thiz.options.store = null;
                    thiz._create();

                } catch (e) {
                    console.log('Exception in reassignAdminRole: ' + e.message + ', ' + e.stack);
                    alert('Exception in reassignAdminRole: ' + e.message + ', ' + e.stack);
                }
            }).error(function (data, errorCode, errorMessage) {
                //thiz.hideProgress();
                var msg;
                if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                } else {
                    msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
                }
                console.log('Fail in reassignAdminRole: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
                alert('Fail in reassignAdminRole: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                //var error = JSON.parse(data.responseText)["odata.error"];
                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            });
        }
    } catch (e) {
        console.log('Exception in reassignAdminRole(): ' + e.message + ', ' + e.stack);
    }
},


//renderParticipantRoleMultiPickerInACircle: function (originElementId, bwParticipantId, bwParticipantFriendlyName, bwParticipantEmail) {
//    try {
//        console.log('In renderParticipantRoleMultiPickerInACircle().');
//        var thiz = this;

//        console.log('In displayRoleMultiPicker(). bwParticipantId: ' + bwParticipantId);
//        $.ajax({
//            url: this.options.operationUriPrefix + "odata/Roles/" + workflowAppId + "/" + bwParticipantId,
//            dataType: "json",
//            contentType: "application/json",
//            type: "Get",
//            timeout: ajaxTimeout
//        }).done(function (result) {
//            try {
//                //if (result.message.indexOf('RETURNING NO WORKFLOW') > -1) {
//                //    // Must be a new tenant, because there is no workflow yet. We will use the pre-canned one here. Doing this on the client side.

//                //}
//                //console.log('In my.js.displayRoleMultiPicker().Get[odata/Roles].done: result.userRoles: ' + JSON.stringify(result.userRoles));
//                //
//                var car = result.workflow;
//                //
//                //debugger;
//                var roles;
//                if (result) {
//                    roles = result.userRoles;
//                } else {
//                    console.log('In my.js.displayRoleMultiPicker().Get[odata/Roles].done: result: bad identifier here, please reword.. ' + JSON.stringify(result));
//                }
//                //
//                var html = '';
//                html += '<table>';
//                // Iterate through the steps. Then the informs, then the assigns. Make an array of the roles. { RoleId, RoleName }
//                //debugger;
//                for (var i = 0; i < car.Workflow.Steps.Step.length; i++) {
//                    var stepName = car.Workflow.Steps.Step[i]["@Name"];
//                    if (stepName == 'Create' || stepName == 'Revise' || stepName == 'Admin') {
//                        // Do nothing, not displaying these steps.
//                    } else {
//                        // Display Inform roles.
//                        if (car.Workflow.Steps.Step[i].OnStart && car.Workflow.Steps.Step[i].OnStart.Inform) {
//                            if (car.Workflow.Steps.Step[i].OnStart.Inform.length > 0) {
//                                for (var j = 0; j < car.Workflow.Steps.Step[i].OnStart.Inform.length; j++) {
//                                    html += '<tr class="orgRow">';
//                                    var isSelected = false;
//                                    var userOrgsForRole = [];
//                                    for (var r = 0; r < roles.length; r++) {
//                                        if (roles[r].RoleId == car.Workflow.Steps.Step[i].OnStart.Inform[j]["@Role"]) {
//                                            userOrgsForRole.push(roles[r].OrgId);
//                                            isSelected = true;
//                                        }
//                                    }
//                                    if (isSelected) {
//                                        html += '   <td><input id="' + 'roleCheckbox_' + j + '" type="checkbox" checked /></td>';
//                                    } else {
//                                        html += '   <td><input id="' + 'roleCheckbox_' + j + '" type="checkbox" /></td>';
//                                    }
//                                    html += '       <td class="roleId">' + car.Workflow.Steps.Step[i].OnStart.Inform[j]["@Role"] + '</td>';
//                                    html += '       <td>&nbsp;</td>';
//                                    html += '       <td class="roleName">' + car.Workflow.Steps.Step[i].OnStart.Inform[j]["@RoleName"] + '</td>';

//                                    // Display orgs for user role
//                                    html += '       <td>&nbsp;</td>';
//                                    if (isSelected) {
//                                        html += '   <td>' + userOrgsForRole + '</td>';
//                                    } else {
//                                        html += '       <td></td>';
//                                    }

//                                    html += '</tr>';
//                                }
//                            }
//                        }
//                        // Display Assign roles.
//                        if (car.Workflow.Steps.Step[i].Assign) {
//                            if (car.Workflow.Steps.Step[i].Assign.length > 0) {
//                                for (var j = 0; j < car.Workflow.Steps.Step[i].Assign.length; j++) {
//                                    html += '<tr class="orgRow">';
//                                    var isSelected = false;
//                                    var userOrgsForRole = [];
//                                    for (var r = 0; r < roles.length; r++) {
//                                        if (roles[r].RoleId == car.Workflow.Steps.Step[i].Assign[j]["@Role"]) {
//                                            userOrgsForRole.push(roles[r].OrgId);
//                                            isSelected = true;
//                                        }
//                                    }
//                                    if (isSelected) {
//                                        html += '   <td><input id="' + 'roleCheckbox_' + i + '" type="checkbox" checked /></td>';
//                                    } else {
//                                        html += '   <td><input id="' + 'roleCheckbox_' + i + '" type="checkbox" /></td>';
//                                    }
//                                    html += '       <td class="roleId">' + car.Workflow.Steps.Step[i].Assign[j]["@Role"] + '</td>';
//                                    html += '       <td>&nbsp;</td>';
//                                    html += '       <td class="roleName">' + car.Workflow.Steps.Step[i].Assign[j]["@RoleName"] + '</td>';

//                                    html += '       <td>&nbsp;</td>';
//                                    if (isSelected) {
//                                        html += '   <td>' + userOrgsForRole + '</td>';
//                                    } else {
//                                        html += '       <td></td>';
//                                    }

//                                    html += '</tr>';
//                                }
//                            }
//                        }
//                    }
//                }
//                html += '</table>';

//                var selectedRolesHtml = html;

//                var html = '';

//                html += '  <table style="width:100%;">';
//                html += '    <tr>';
//                html += '      <td style="width:90%;">';
//                //debugger;
//                //html += '        <span style="color: #3f3f3f;font-size:30pt;font-weight:bold;">' + roles[0].bwParticipantFriendlyName + '</span>';
//                html += '        <span style="color: #3f3f3f;font-size:30pt;font-weight:bold;">' + bwParticipantFriendlyName + '</span>';
//                html += '      </td>';
//                html += '      <td style="width:9%;"></td>';
//                html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
//                html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'hideParticipantRoleMultiPickerInACircle\');">X</span>';
//                html += '      </td>';
//                html += '    </tr>';
//                html += '  </table>';
//                html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
//                html += '<span id="spanDivRolePickerDropDown_OrgPath" style="color:purple;font-size:15pt;">';
//                //html += roles[0].bwParticipantEmail;
//                html += bwParticipantEmail;
//                html += '</span>';
//                html += '<br />';
//                html += '<br />';
//                html += '<div id="spanSelectedRolesInRolePickerDropdown" style="overflow-y:auto;height:480px;">';
//                //html += '<span id="spanSelectedRolesInRolePickerDropdown"></span>';
//                html += '</div>';

//                var divParticipantSummaryDialog = document.getElementById('divParticipantSummaryDialog'); 
//                divParticipantSummaryDialog.innerHTML = html;

//                document.getElementById('spanSelectedRolesInRolePickerDropdown').innerHTML = selectedRolesHtml; // Display the selected roles.

//                var tableElement = document.getElementById('tableOrgRoles2'); // This is the table which is also in the same size and position as the canvas.
//                var tableRect = tableElement.getBoundingClientRect();
//                //var tableTop = tableRect.top;
//                //var tableLeft = tableRect.left;

//                //var canvas = document.getElementById('myCanvas');
//                //canvas.style.zIndex = 11; // Bring it to the front!
//                //canvas.width = tableElement.offsetWidth; // This resizes the bitmap from 300x150 to what we want. This prevents scaling of our drawing...
//                //canvas.height = tableElement.offsetHeight; // This resizes the bitmap from 300x150 to what we want. This prevents scaling of our drawing...
//                //var ctx = canvas.getContext('2d');
//                //ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas.

//                var tableTop = window.top;
//                var tableLeft = window.left;

//                var originTop = 400;
//                var originLeft = 600;

//                var dialogWidth = '600px';
//                var dialogHeight = '600px';

//                //var originElement = document.getElementById(originElementId); // This is the button for the Org, so that the circle is placed next to this org tree node.
//                //var originRect = originElement.getBoundingClientRect();
//                //var originTop = originRect.bottom + window.pageYOffset;
//                //var originLeft = originRect.left + window.pageXOffset;

//                //var dialogWidth = '600px';
//                //var dialogHeight = '600px';
//                divParticipantSummaryDialog.style.top = originTop + 'px';
//                divParticipantSummaryDialog.style.left = originLeft + 'px';
//                divParticipantSummaryDialog.style.width = dialogWidth;
//                divParticipantSummaryDialog.style.height = dialogHeight;
//                divParticipantSummaryDialog.style.display = 'block';
//                divParticipantSummaryDialog.style.background = 'transparent';
//                divParticipantSummaryDialog.style.border = '0px';
//                divParticipantSummaryDialog.style.zIndex = 12;

//                var dialogRect = divParticipantSummaryDialog.getBoundingClientRect();
//                var dialogWidth = dialogRect.right - dialogRect.left;

//                var largeCircleRadius = (dialogWidth * Math.sqrt(2)) / 2;

//                var smallCircleCenterX = dialogRect.left + 150;
//                var smallCircleCenterY = dialogRect.top - 150;
//                var smallCircleRadius = ((dialogWidth / 4) * Math.sqrt(2)) / 2;
//                var smallCircleDiameter = smallCircleRadius * 2;

//                var smallCircleX = smallCircleCenterX - smallCircleRadius;
//                var centerOfCanvasX = (tableRect.right - tableRect.left) / 2;
//                var smallCircleRight = smallCircleX + smallCircleRadius + window.pageXOffset + smallCircleRadius;
//                var tableRight = centerOfCanvasX + (tableRect.width / 2);

//                var distanceFromRightEdgeOfCanvas = tableRight - smallCircleRight;
//                if (distanceFromRightEdgeOfCanvas > -1) {
//                    //alert('No clipping of the dialog is occuring. distanceFromRightEdgeOfCanvas: ' + distanceFromRightEdgeOfCanvas);
//                } else {
//                    //alert('The dialog right side is clipped so we need to recalculate. distanceFromRightEdgeOfCanvas: ' + distanceFromRightEdgeOfCanvas);
//                    var pixelsToTheLeftOfTheBigCircle = centerOfCanvasX - largeCircleRadius;
//                    //var newCenterpointX = (((pixelsToTheLeftOfTheBigCircle - distanceFromRightEdgeOfCanvas) / 2) + largeCircleRadius) + tableLeft;
//                    var newCenterpointX = (((pixelsToTheLeftOfTheBigCircle) / 2) + largeCircleRadius) + tableLeft;
//                    originLeft = (newCenterpointX - (dialogWidth / 2));
//                    divParticipantSummaryDialog.style.left = originLeft + 'px'; // Center the dialog on this spot.
//                    // Reset the appropriate measurements so it gets redrawn Ok!
//                    var dialogRect = divParticipantSummaryDialog.getBoundingClientRect();
//                    var dialogWidth = dialogRect.right - dialogRect.left;

//                    var largeCircleRadius = (dialogWidth * Math.sqrt(2)) / 2;

//                    var smallCircleCenterX = dialogRect.left + 150;
//                    var smallCircleCenterY = dialogRect.top - 150;
//                    var smallCircleRadius = ((dialogWidth / 4) * Math.sqrt(2)) / 2;
//                    var smallCircleDiameter = smallCircleRadius * 2;

//                    var smallCircleX = smallCircleCenterX - smallCircleRadius;
//                    var centerOfCanvasX = (tableRect.right - tableRect.left) / 2;
//                    var smallCircleRight = smallCircleX + smallCircleRadius + window.pageXOffset + smallCircleRadius;
//                    var tableRight = centerOfCanvasX + (tableRect.width / 2);
//                }

//                // This circle encompasses divOrgRoleSummaryDialog.
//                var centerX = dialogRect.left + ((dialogRect.right - dialogRect.left) / 2) - tableLeft;
//                var centerY = dialogRect.top + ((dialogRect.bottom - dialogRect.top) / 2) - tableTop;
//                ctx.beginPath();
//                ctx.lineWidth = 3;
//                ctx.strokeStyle = '#95b1d3';
//                ctx.arc(centerX, centerY, largeCircleRadius, 0, 2 * Math.PI);
//                ctx.stroke();
//                ctx.fillStyle = 'white';
//                ctx.fill();
//                // This is the small circle which displays the Org image.
//                ctx.beginPath();
//                ctx.lineWidth = 3;
//                ctx.strokeStyle = '#95b1d3';
//                ctx.arc(smallCircleCenterX, smallCircleCenterY, smallCircleRadius, 0, 2 * Math.PI);
//                ctx.stroke();
//                ctx.fillStyle = 'aliceblue';
//                ctx.fill();
//                // This is where the image is loaded and displayed.
//                var dy = smallCircleCenterY - smallCircleRadius;
//                var img = new Image();
//                img.src = 'images/userimage.png';
//                img.onload = function (e) {
//                    ctx.drawImage(img, 0, 0, 512, 512, smallCircleX, dy, smallCircleDiameter, smallCircleDiameter);
//                }

//                // REFERENCE CODE: Mark the center point.
//                // Draw a circle in the X center of the canvas.
//                //ctx.beginPath();
//                //ctx.lineWidth = 3;
//                //ctx.strokeStyle = 'red';
//                //ctx.arc(centerOfCanvasX, 400, 5, 0, 2 * Math.PI);
//                //ctx.stroke();
//                //// Draw a line to demonstrate the edge of the dialog small circle.
//                //ctx.beginPath(); // Always use beginPath() in order to have predictable behavior!!
//                //ctx.lineWidth = 10;
//                //ctx.strokeStyle = 'red';
//                //ctx.moveTo(smallCircleRight, 400); // This is where the line starts...
//                //ctx.lineTo(tableRight, 400); // This is the tr tag for the roleId in the workflow view.
//                //ctx.stroke();
//                // End: REFERENCE CODE.

//                canvas.style.background = 'rgba(240, 248, 255, 0.5)';

//                canvas.onclick = function (e) {
//                    console.log('CLEAN UP bwParticipantsEditor! Figure out where the user clicked and respond accordingly. :D');
//                    thiz.hideParticipantRoleMultiPickerInACircle(); // CLOSE THE WHOLE THING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! THIS AINT PERFECT, NEEDS WORK!
//                };

//            } catch (e) {
//                console.log('Exception in raci.html.displayRoleMultiPicker().Get[odata/Orgs].done: ' + e.message + ', ' + e.stack);
//            }
//        }).fail(function (data) {
//            var msg;
//            if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
//                msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
//            } else {
//                msg = JSON.stringify(data);
//            }
//            alert('Error in raci.html.displayRoleMultiPicker().Get[odata/Orgs].fail: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
//            console.log('Error in raci.html.displayRoleMultiPicker().Get[odata/Orgs].fail:' + JSON.stringify(data));
//            //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
//            //var error = JSON.parse(data.responseText)["odata.error"];
//            //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
//        });
























//    } catch (e) {
//        console.log('Exception in my.js.renderParticipantRoleMultiPickerInACircle(): ' + e.message + ', ' + e.stack);
//    }
//},

hideParticipantRoleMultiPickerInACircle: function () {
    try {
        console.log('In hideParticipantRoleMultiPickerInACircle().');

        var divRolePickerDropDown = document.getElementById('divParticipantSummaryDialog');
        divRolePickerDropDown.style.display = 'none';

        var canvas = document.getElementById("myCanvas");
        canvas.style.zIndex = -1; // Important to send it to back, otherwise the user won't be able to interact with the UI.
        var ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //this.renderOrgRoleConnectorsToWorkflow(false, divisionIndex, groupIndex, entityIndex, locationIndex);
        //debugger;
        canvas.style.background = ''; // Resets the background to the normal behavior. Pretty cool! 
        //canvas.style.background = 'red'; // Resets the background to the normal behavior. Pretty cool! 

    } catch (e) {
        console.log('Exception in hideParticipantRoleMultiPickerInACircle(): ' + e.message + ', ' + e.stack);
    }
},














renderOrgRolesEditor: function (assignmentRowChanged_ElementId) {
    try {
        console.log('In renderOrgRolesEditor().');

        var thiz = this;
        //debugger;
        var json = this.options.store; //.OrgStructureAndRoles;
        var html = '';
        html += '<style>';
        html += '.ui-widget-header {';
        html += '    border: 1px solid #066b8b;'; // dark blue border.
        html += '    background: #6682b5 url("images/ui-bg_gloss-wave_35_f6a828_500x100.png") 50% 50% repeat-x;'; // lighter blue background.
        html += '    color: #fff;';
        html += '    font-weight: bold;';
        html += '}';
        html += '</style>';

        html += '<style>';
        html += '.dropdown-tree > ul{overflow-y: auto;overflow-x: hidden;white-space: nowrap;}';
        html += '.dropdown-tree li{list-style: none}';
        html += '.dropdown-tree li > i {margin-left: 10px;}';
        html += '.dropdown-tree li:hover{ background: #eee;}';
        html += '.dropdown-tree li:hover ul { background: white; }';
        html += '.dropdown-tree li:hover ul li:hover { background: #eee; } ';
        html += '.dropdown-tree a{display: inline-block !important;padding: 3px 20px;clear: both;font-weight: 400;line-height: 1.42857143;color: #333;white-space: nowrap;text-decoration: none;background:transparent !important; position: relative;}';
        html += '.dropdown-tree .arrow{position: absolute;margin-left: -15px;top: 50%; transform: translateY(-50%);}';
        html += '/*RTL CSS*/';
        html += '.rtl-dropdown-tree{direction: rtl !important}';
        html += '.rtl-dropdown-tree > ul{right: 0 ; left: unset; text-align: right}';
        html += '.rtl-dropdown-tree .arrow{right: 6px}';
        html += '.rtl-dropdown-tree li > i {margin-left: 0;margin-right: 10px;}';
        html += '</style>';

        // Header with print button.
        html += '<table style="width:100%;">';
        html += '   <tr style="height:90pt;vertical-align:top;">';
        html += '       <td>';

        html += '<table>';
        html += '   <tr>';
        html += '       <td>';
        html += '           <h2>';
        html += '           Org and Roles Editor: <span style="color:#95b1d3;">Manage your organizational structure and 👤Roles...</span>'; // Velvet Morning is #95b1d3. This was the pantone color of the day for December 9, 2019! :D
        html += '           </h2>';
        html += '       </td>';
        html += '   </tr>';
        html += '   <tr>';
        html += '       <td>';
        html += 'Select how your organization is structured:';
        html += '   <select style="padding:5px 5px 5px 5px;" id="selectOrganizationalStructure" onchange="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'selectOrganizationalStructure_OnChange\', \'viewing\');">';
        html += '       <option value="Single Location">Single Location (local)</option>';
        html += '       <option value="Legal Entity > Location">Legal Entity > Locations (local/national)</option>';
        html += '       <option value="Group > Legal Entity > Location" selected>Group > Legal Entity > Location (national/international)</option>';
        html += '       <option value="Division > Group > Legal Entity > Location" selected>Division > Group > Legal Entity > Location (international)</option>';
        html += '   </select>';
        html += '<br />';
        // Activate button.
        html += '<table>';
        if (thiz.options.displayOrgRolesPicker) {
            html += '<tr>';
            html += '  <td>';
            html += '  </td>';
            html += '  <td>';
            html += '    <span id="spanOrgRolesDropDownList"></span>';
            html += '  </td>';
            html += '  <td>';
            html += '    <input style="padding:5px 10px 5px 10px;width:100px;" id="btnActivateOrgRolesConfiguration" type="button" value="  Activatex doesntwork  " onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'activateOrgRolesConfiguration\');" disabled />';
            //html += '    <input id="btnResetRaciConfiguration" type="button" value="  RESET  " onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'resetRaciConfiguration\');" />';
            html += '  </td>';
            html += '</tr>';
        }
        // Publish message and button.
        html += '<tr>';
        html += '  <td></td>';
        html += '  <td style="text-align:right;height:30pt;">'; // The height keeps the whole screen form moving around.
        html += '    <span id="spanThereAreChangesToPublishText" style="font-style:italic;color:tomato;"></span>';
        html += '  </td>';
        html += '  <td>';
        html += '    <span id="spanThereAreChangesToPublishButton"></span>';
        html += '  </td>';
        html += '</tr>';
        html += '</table>';
        html += '       </td>';
        html += '   </tr>';
        html += '</table>';

        html += '       </td>';
        html += '       <td style="text-align:right;">';
        html += '           <span class="printButton" title="print" onclick="cmdPrintForm();">&#x1f5a8;</span>';
        html += '       </td>';
        html += '   </tr>';
        html += '</table>';
        // End: Header with print button.

        //debugger;
        //html += '<br />';
        html += 'Location Picker: <div id="divBwLocationPicker"></div>';
        html += '<br />';
        //html += '<span id="spanCanvas"></span>';

        // Display workflow picker.
        if (thiz.options.displayWorkflowPicker) {

            //html += '<h2>Workflow Editor</h2>';

            //html += '<span style="color:grey;">';
            //html += '  Double-click on a row to edit, delete, or add to the workflow. Then enter a description, and click the "Save" button.<br />';
            //html += '</span>';
            //html += '<br />'; //<br />';

            //html += '                           <span class="printButton" title="print" onclick="cmdPrintForm();">&#x1f5a8;</span>';




            //html += '<table style="width:100%;">';
            //html += '   <tr>';
            //html += '       <td>';
            //html += '           <h2>';
            //html += '           Workflows Editor: <span style="color:#95b1d3;">Manage your workflows...</span>'; // Velvet Morning is #95b1d3. This was the pantone color of the day for December 9, 2019! :D
            //html += '           </h2>';
            //html += '       </td>';
            //html += '       <td style="text-align:right;">';
            //html += '           <span class="printButton" title="print" onclick="cmdPrintForm();">&#x1f5a8;</span>';
            //html += '       </td>';
            //html += '   </tr>';
            //html += '</table>';


            //html += '<br />';
            //html += '<br />';








            html += '<table>';

            html += '<tr>';
            html += '  <td>';
            // Create the drop down at the top of the page, and select the last used option!

            var requestTypes = thiz.options.bwEnabledRequestTypes.EnabledItems;

            var bwLastSelectedNewRequestType = 'capitalplanproject';
            if (requestTypes.length == 1) { // If there is only one, don't display as a drop down, just as plain text.
                html += '<span style="font_weight:bold;color:black;">Active workflow for: </span>';
            } else { // There is more than 1, so we have to display as a drop down.
                html += '<span style="font_weight:bold;color:black;">Active workflow for: ';
                //html += '   <select id="selectNewRequestFormRequestTypeDropDown" style=\'border-color: whitesmoke; color: rgb(38, 38, 38); font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 14pt; font-weight: bold; cursor: pointer;\'>'; // was .5em
                //for (var i = 0; i < requestTypes.length; i++) {
                //    if (requestTypes[i][0] == bwLastSelectedNewRequestType) { // Selected
                //        html += '<option value="' + requestTypes[i][0] + '" ' + requestTypes[i][2] + ' selected >' + requestTypes[i][1] + '</option>';
                //    } else { // Not selected
                //        html += '<option value="' + requestTypes[i][0] + '" ' + requestTypes[i][2] + '>' + requestTypes[i][1] + '</option>';
                //    }
                //}
                //html += '   </select>';
                html += '</span>';
            }
            html += '  </td>';
            html += '  <td>';

            // Render the drop down at the top of the page, and select the last used option!
            var bwLastSelectedNewRequestType = 'all';
            if (requestTypes.length == 1) { // If there is only one, don't display as a drop down, just as plain text.
                html += '<span style="font_weight:bold;color:black;"><strong>' + requestTypes[0][1] + '</strong></span>';
            } else { // There is more than 1, so we have to display as a drop down.
                html += '<span style="font_weight:bold;color:black;"><strong>';
                html += '   <select id="selectWorkflowRequestTypeDropDown" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'WorkflowRequestTypeDropDown_Onchange\', \'selectWorkflowRequestTypeDropDown\');"" style=\'border-color: whitesmoke; color: rgb(38, 38, 38); font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 14pt; font-weight: bold; cursor: pointer;\'>'; // was .5em
                html += '<option value="' + 'All request types' + '" selected >' + 'All request types' + '</option>';
                for (var i = 0; i < requestTypes.length; i++) {
                    if (requestTypes[i][0] == bwLastSelectedNewRequestType) { // Selected
                        html += '<option value="' + requestTypes[i][0] + '" selected >' + requestTypes[i][1] + '</option>';
                    } else { // Not selected
                        html += '<option value="' + requestTypes[i][0] + '">' + requestTypes[i][1] + '</option>';
                    }
                }
                html += '   </select>';
                html += '</span>';
            }

            html += '&nbsp;&nbsp;<span style="font-weight:normal;font-style:italic;color:grey;"><input id="WorkflowForAllRequestTypesCheckbox" type="checkbox" checked="checked" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'WorkflowForAllRequestTypesCheckbox_Onchange\');" />All request types inherit this workflow</span>';

            html += '  </td>';
            html += '  <td>';
            //html += '    <input style="padding:5px 10px 5px 10px;" id="btnActivateRaciConfiguration" type="button" value="  Activate  " onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'activateRaciConfiguration\');" disabled />';
            //html += '    <input id="btnResetRaciConfiguration" type="button" value="  RESET  " onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'resetRaciConfiguration\');" />';
            html += '  </td>';
            html += '</tr>';
            // Activate button.
            html += '<tr>';
            html += '  <td>';
            html += '  </td>';
            html += '  <td>';
            html += '    <span id="spanWorkflowsDropDownList"></span>';
            html += '  </td>';
            html += '  <td>';
            html += '    <input style="padding:5px 10px 5px 10px;width:100px;" id="btnActivateRaciConfiguration" type="button" value="  Activatey doesntwork  " onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'activateRaciConfiguration\');" disabled />';
            //html += '    <input id="btnResetRaciConfiguration" type="button" value="  RESET  " onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'resetRaciConfiguration\');" />';
            html += '  </td>';
            html += '</tr>';
            // Publish message and button.
            html += '<tr>';
            html += '  <td>';
            html += '';
            html += '  </td>';
            html += '  <td style="text-align:right;">';
            html += '    <span id="spanThereAreChangesToPublishText" style="font-style:italic;color:tomato;"></span>'; //<input value=" There are unsaved changes. Enter a description here and click Save..." type="text" id="txtNewWorkflowDescription" style="width:450px;color:grey;font-style:italic;padding:5px 5px 5px 5px;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewWorkflowDescriptionTextBox_Onkeyup\');" />';
            html += '  </td>';
            html += '  <td>';
            html += '    <span id="spanThereAreChangesToPublishButton"></span>'; //<input style="padding:5px 10px 5px 10px;" id="btnSaveWorkflowConfigurationAndActivate" type="button" value="    Save    " onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveWorkflowConfigurationAndActivate\');" />';
            html += '  </td>';
            html += '</tr>';

            html += '</table>';
            html += '<br />';
        }
        // End: Display workflow picker.











        // PUTTING the workflow view next to the treeview
        //html += '<table id="tableOrgRoles1" style="border:1px solid green;">';
        html += '<table>';
        html += '  <tr>';
        html += '    <td style="vertical-align:top;">';
        html += '<table>';
        html += '   <tr id="orgrow_d_g_e_l">';
        html += '       <td></td>';
        html += '       <td>';
        html += '           <table style="padding-left:15px;">';
        html += '               <tr>';
        html += '                   <td>';
        html += '                       <span style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'collapseTree\', \'\', \'root\');">';
        html += '⚊ <span id="spanOrgX_root" class="orgTreeNode" style="cursor:pointer;" onmouseover="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflow\', true, \'root\');" onmouseout="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflowReset\', \'' + 'spanOrgX_root\', \'root\');"><span style="font-weight:normal;">◍</span> ' + json.Global.Name + ' <span style="font-weight:normal;">◍</span> </span> </span>';

        //html += '                       <span id="divisionsRootNode" style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;text-decoration:underline;" title="Add a Division..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'addADivision\');"> ✚ Add</span>';
        //html == '                       <br />';
        html += '                       <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgEditorInACircle\', \'' + 'root' + '\');">👤👤🔍</span>';
        html += '                       <span id="spanWorkflowPeoplePicker_' + 'root' + '"></span>';

        html += '                    </td>';
        html += '               </tr>';
        //debugger;
        for (var d = 0; d < json.Global.Divisions.Items.length; d++) {
            html += '           <tr>';
            html += '               <td id="rootDivisionCell" style="padding-left:40px;">';
            //html += '                   ◍ ' + json.Global.Divisions.Items[d].Name + ' ◍ ';
            //html += '<span style="cursor:pointer;" onclick="alert(\'This functionality is incomplete. Coming soon! Collapse this division!\');">                                 ⚊</span>';

            html += '<span style="cursor:pointer;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'collapseTree\', \'' + 'collapsethisdivision' + '\', \'' + d + '\');">                                 ⚊</span>';

            html += ' <span id="spanOrgX_' + d + '" class="orgTreeNode" style="cursor:pointer;" onmouseover="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflow\', true, \'' + d + '\');" onmouseout="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflowReset\', \'' + 'spanOrgX_' + d + '\', \'' + d + '\');">◍ ' + json.Global.Divisions.Items[d].Name + ' ◍ </span>';


            //html += '<img src="/images/pin2.jpeg" title="Pin this request so that you can keep an eye on it!" style="height:80px;width:80px;cursor:pointer;" onclick="javascript:displayAlertDialog(\'Pin this request so that you can keep an eye on it! This functionality is incomplete but is coming soon!\');" />';



            //html += '  <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'editDivision\', \'' + d + '\');">✎<span style="text-decoration:underline;">Edit</span></span>';
            html == '  <br />';
            html += '  <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgEditorInACircle\', \'' + d + '\');">👤👤🔍</span>';
            html += '  <span id="spanWorkflowPeoplePicker_' + d + '"></span>';

            html += '               </td>';
            html += '           </tr>';
            html += '           <tr>';
            html += '               <td style="padding-left:40px;">';
            html += '                   <table style="padding-left:15px;">';
            if (json.Global.Divisions.Items[d].Groups.Style == 'display:none;') {
                html += '                       <tr>';
                html += '                           <td>';
                html += '                               <span style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'expandTree\', \'' + d + '\');">';
                html += '✚ ✣ Groups ✣  </span>';
                html += '                               <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;text-decoration:underline;" title="Add a Group..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'addAGroup\', \'' + json.Global.Divisions.Items[d].Id + '\', \'' + d + '\', \'' + g + '\', \'' + e + '\');"> ✚ Add</span>';
                html += '                           </td>';
                html += '                       </tr>';
            } else {
                html += '                       <tr>';
                html += '                           <td>';
                html += '                               <span id="spanOrgX_' + d + '_' + 'GroupsNode' + '" class="orgTreeNode" style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'collapseTree\', \'\', \'' + d + '\');" onmouseout="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflowReset\', \'' + 'spanOrgX_' + d + '_' + 'GroupsNode' + '\', \'' + d + '\', \'' + 'GroupsNode' + '\');" onmouseover="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflow\', true, \'' + d + '\', \'' + 'GroupsNode' + '\');">';
                html += '⚊ ✣ Groups ✣  </span>';
                html += '                               <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;text-decoration:underline;" title="Add a Group..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'addAGroup\', \'' + json.Global.Divisions.Items[d].Id + '\', \'' + d + '\', \'' + g + '\', \'' + e + '\');"> ✚ Add</span>';
                html += '                           </td>';
                html += '                       </tr>';
                for (var g = 0; g < json.Global.Divisions.Items[d].Groups.Items.length; g++) {
                    html += '                   <tr>';
                    html += '                       <td style="padding-left:40px;">';
                    //html += '                           ✣ ' + json.Global.Divisions.Items[d].Groups.Items[g].Name + ' ✣ ';
                    html += '                                   <span id="spanOrgX_' + d + '_' + g + '" class="orgTreeNode" style="cursor:pointer;" onmouseover="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflow\', true, \'' + d + '\', \'' + g + '\');" onmouseout="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflowReset\', \'' + 'spanOrgX_' + d + '_' + g + '\', \'' + d + '\', \'' + g + '\');">✣ ' + json.Global.Divisions.Items[d].Groups.Items[g].Name + ' ✣ '; //</span>';





                    //html += '  <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'editGroup\', \'' + d + '\', \'' + g + '\');">✎<span style="text-decoration:underline;">Edit</span></span>';
                    //html == '  <br />';
                    html += '                                       <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgEditorInACircle\', \'' + d + '\', \'' + g + '\');">👤👤🔍<span style="text-decoration:underline;"></span></span>';

                    html += '                                </span>';
                    html += '  <span id="spanWorkflowPeoplePicker_' + d + '_' + g + '"></span>';

                    html += '                       </td>';
                    html += '                   </tr>';
                    html += '                   <tr>';
                    html += '                       <td style="padding-left:40px;">';
                    html += '                           <table style="padding-left:15px;">';
                    if (json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Style == 'display:none;') {
                        html += '                               <tr>';
                        html += '                                   <td>';
                        html += '                               <span style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'expandTree\', \'' + d + '\', \'' + g + '\');">';
                        html += '✚ ⚖ Legal Entities  </span>';
                        html += '                                       <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;text-decoration:underline;" title="Add a Legal Entity..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'addALegalEntity\', \'' + json.Global.Divisions.Items[d].Groups.Items[g].Id + '\', \'' + d + '\', \'' + g + '\', \'' + e + '\');"> ✚ Add ⚖</span>';
                        html += '                                   </td>';
                        html += '                               </tr>';
                    } else {
                        html += '                               <tr>';
                        html += '                                   <td>';
                        html += '                               <span style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'collapseTree\', \'\', \'' + d + '\', \'' + g + '\');">';
                        html += '⚊ ⚖ Legal Entities  </span>';
                        html += '                                       <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;text-decoration:underline;" title="Add a Legal Entity..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'addALegalEntity\', \'' + json.Global.Divisions.Items[d].Groups.Items[g].Id + '\', \'' + d + '\', \'' + g + '\', \'' + e + '\');"> ✚ Add ⚖</span>';
                        html += '                                   </td>';
                        html += '                               </tr>';
                        for (var e = 0; e < json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items.length; e++) {
                            html += '                           <tr>';
                            html += '                               <td style="padding-left:40px;">';
                            html += '<span style="cursor:pointer;" onclick="alert(\'This functionality is incomplete. Coming soon! Collapse this legal entity!\');">                                 ⚊</span>';
                            // #29685F galapagos green
                            html += '   <span id="spanOrgX_' + d + '_' + g + '_' + e + '" class="orgTreeNode" style="cursor:pointer;color:#29685F;" onmouseover="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflow\', true, \'' + d + '\', \'' + g + '\', \'' + e + '\');" onmouseout="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflowReset\', \'' + 'spanOrgX_' + d + '_' + g + '_' + e + '\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">⚖ ' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Name + ' ⚖ '; //</span>';

                            //html += '  <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'editLegalEntity\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">✎<span style="text-decoration:underline;">Edit</span></span>';
                            //html == '  <br />';
                            html += '       <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgEditorInACircle\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">👤👤🔍</span>';

                            html += '  </span>';
                            html += '  <span id="spanWorkflowPeoplePicker_' + d + '_' + g + '_' + e + '"></span>';

                            html += '                               </td>';
                            html += '                           </tr>';
                            html += '                           <tr>';
                            html += '                               <td style="padding-left:15px;">';
                            html += '                                   <table style="padding-left:15px;">';
                            if (json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Style == 'display:none;') {
                                html += '                                   <tr>';
                                html += '                                       <td>';
                                html += '                               <span style="cursor:pointer;font-weight:bold;" title="Expand Locations" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'expandTree\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">';
                                html += '✚ 🏠 Locations </span>';
                                html += '                                           <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;" title="Add a Location..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'addALocation\', \'' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Id + '\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">✚ Add 🏠</span>';
                                html += '                                       </td>';
                                html += '                                   </tr>';
                            } else {
                                html += '                                   <tr>';
                                html += '                                       <td>';
                                html += '                               <span style="cursor:pointer;font-weight:bold;" title="Collapse Locations" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'collapseTree\', \'\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">';
                                html += '⚊ 🏠 Locations </span>';
                                html += '                                           <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;" title="Add a Location..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'addALocation\', \'' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Id + '\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">✚ Add 🏠</span>';
                                html += '                                       </td>';
                                html += '                                   </tr>';
                                for (var l = 0; l < json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items.length; l++) {
                                    html += '                               <tr style="' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Style + '">';
                                    html += '                                   <td style="padding-left:40px;white-space:nowrap;">';
                                    html += '<span style="white-space:nowrap;">';
                                    //html += '&nbsp;⚙';
                                    //html += ' 🏠 ' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Name + ' 🏠 ';
                                    html += '                                   <span id="spanOrgX_' + d + '_' + g + '_' + e + '_' + l + '" class="orgTreeNode" style="cursor:pointer;white-space:nowrap;" onmouseover="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflow\', true, \'' + d + '\', \'' + g + '\', \'' + e + '\', \'' + l + '\');" onmouseout="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflowReset\', \'' + 'spanOrgX_' + d + '_' + g + '_' + e + '_' + l + '\', \'' + d + '\', \'' + g + '\', \'' + e + '\', \'' + l + '\');">🏠 ' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Name + ' 🏠 '; //</span>';


                                    //html += '  <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;white-space:nowrap;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'editLocation\', \'' + d + '\', \'' + g + '\', \'' + e + '\', \'' + l + '\');">✎<span style="text-decoration:underline;white-space:nowrap;">Edit</span></span>';
                                    //html += '<br />';
                                    html += '<span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;white-space:nowrap;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgEditorInACircle\', \'' + d + '\', \'' + g + '\', \'' + e + '\', \'' + l + '\');">👤👤🔍</span>';
                                    html += '                                   </span>';
                                    html += '<span id="spanWorkflowPeoplePicker_' + d + '_' + g + '_' + e + '_' + l + '" style="white-space:nowrap;"></span>';

                                    html += '</span>';
                                    html += '                                   </td>';
                                    html += '                               </tr>';
                                }
                            }
                            html += '                                   </table>';
                            html += '                               </td>';
                            html += '                           </tr>';
                        }
                    }
                    html += '                           </table>';
                    html += '                       </td>';
                    html += '                   </tr>';
                }
            }
            html += '                   </table>';
            html += '               </td>';
            html += '           </tr>';
        }
        html += '           </table>';
        html += '       </td>';
        html += '   </tr>';
        html += '</table>';

        html += '    </td>';
        html += '    <td style="vertical-align:top;width:100px;height:100%;">';
        html += '    </td>';
        html += '    <td id="workflowcontainer1" style="vertical-align:top;">';
        html += '      <span id="spanWorkflowPeoplePicker_right">[insert workflow view here]</span>';
        html += '    </td>';
        html += '  </tr>';
        html += '</table>';

        html += '<br />';
        html += '<br />';
        html += '<br />';
        html += '<br />';

        //html += '<div style="display:none;" id="divCreateANewRoleDialog">';
        //html += '  <table style="width:100%;">';
        //html += '    <tr>';
        //html += '      <td style="width:90%;">';
        //html += '        <span id="spanCustomSignUpDialogTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Create a new Role</span>';
        //html += '      </td>';
        //html += '      <td style="width:9%;"></td>';
        //html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
        //html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divCreateANewRoleDialog\').dialog(\'close\');">X</span>';
        //html += '      </td>';
        //html += '    </tr>';
        //html += '  </table>';
        //html += '  <br /><br />';
        //html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
        //html += '  <span id="spanCustomSignUpDialogInvitationDescriptionText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;"></span><br />';
        //html += '  <span style="font-family: calibri;">Role Abbreviation</span><br />';
        //html += '  <input type="text" id="txtCreateANewRoleDialog_RoleId" style="WIDTH: 93%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 40pt;" /><br /><br />';
        //html += '  <span style="font-family: calibri;">Role Name</span><br />';
        //html += '  <input type="text" id="txtCreateANewRoleDialog_RoleName" style="WIDTH: 93%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 40pt;" /><br /><br />';
        ////html += '  <span style="font-family: calibri;">RoleBits</span><br />';
        ////html += '  <input type="password" id="txtCreateANewRoleDialog_RoleBits" style="WIDTH: 93%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 40pt;" /><br />';
        //html += '  <br />';
        ////html += '  <div id="xxxx" class="divSignInButton" style="width:90%;text-align:center;line-height:1.6em;font-weight:bold;" onclick="cmdCustomRegistration();">Create your new role now!&nbsp;</div>';

        //html += '  <table style="width:100%;">';
        //html += '     <tr>';
        //html += '       <td style="text-align:center;">';
        //html += '  <input type="button" value="Create your new role now!" style="height:30pt;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'createANewRole\');" />';
        //html += '       </td>';
        //html += '     </tr>';
        ////html += '     <tr><td>&nbsp;</td></tr>';
        ////html += '     <tr>';
        ////html += '       <td style="text-align:center;">';
        ////html += '  <span style="font-family: calibri;font-style:italic;font-size:30pt;"> <a href="javascript:$(\'#divCreateANewRoleDialog\').dialog(\'close\');">Cancel</a></span>';
        ////html += '       </td>';
        ////html += '     </tr>';
        //html += '  </table>';
        //html += '  <br /><br />';
        //html += '</div>';

        html += '<div style="height:100vh;"></div>';


        //html += '<div style="display:none;" id="divAddAnOrgItemDialog">';
        //html += '   <table style="width:100%;">';
        //html += '       <tr>';
        //html += '           <td style="width:90%;">';
        //html += '               <span id="spanAddAnOrgItemDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">[spanAddAnOrgItemDialogTitle]</span>';
        //html += '           </td>';
        //html += '           <td style="width:9%;"></td>';
        //html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
        //html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divAddAnOrgItemDialog\').dialog(\'close\');">X</span>';
        //html += '           </td>';
        //html += '       </tr>';
        //html += '   </table>';
        //html += '   <br /><br />';
        //html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
        //html += '   <span id="spanAddAnOrgItemDialogInvitationDescriptionText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;"></span>';
        //html += '   <span style="font-family: calibri;">Name</span>';
        //html += '   <br />';
        //html += '   <input type="text" id="txtAddAnOrgItemDialogName" style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />';
        //html += '   <br /><br />';
        //html += '   <span style="font-family: calibri;">Abbreviation</span>';
        //html += '   <br />';
        //html += '   <input type="text" id="txtAddANewPersonDialogAbbreviation" style="width:25%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />';
        //html += '   <br /><br />';
        //html += '   <span style="font-family: calibri;">Id</span>';
        //html += '   <br />';
        //html += '   <input id="txtAddANewPersonDialogId" type="text" disabled style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" /><br />';
        ////html += '   <br /><br />';
        ////html += '   <span style="white-space:nowrap;"><input id="checkboxAddANewPersonDialogActive" type="checkbox" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />Active</span>';
        //html += '   <br /><br /><br />';
        //html += '   <div id="divAddAnOrgItemDialogSubmitButton" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
        //html += '       Add the xx';
        //html += '   </div>';
        //html += '   <br /><br />';
        //html += '   <div class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;" onclick="$(\'#divAddAnOrgItemDialog\').dialog(\'close\');">';
        //html += '       Close';
        //html += '   </div>';
        //html += '   <br /><br />';
        //html += '</div>';

        html += '<div style="display:none;" id="divRoleMultiPickerDialog2">';
        html += '  <table style="width:100%;">';
        html += '    <tr>';
        html += '      <td style="width:90%;">';
        html += '        <span id="spanRoleMultiPickerDialogTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Roles</span>';
        html += '      </td>';
        html += '      <td style="width:9%;"></td>';
        html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
        html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divRoleMultiPickerDialog2\').dialog(\'close\');">X</span>';
        html += '      </td>';
        html += '    </tr>';
        html += '  </table>';
        html += '  <br /><br />';
        html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
        html += '  <span id="spanRoleMultiPickerDialogContent" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:20pt;"></span><br />';
        html += '  <br /><br />';
        html += '  <input type="button" value="SAVE" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'projectTypeMultiPickerDialog_RenderResults\');" />';
        html += '  <br /><br />';
        html += '</div>';

        html += '<div style="display:none;" id="divUndoOrgRolesActivationDialog">';
        html += '  <table style="width:100%;">';
        html += '    <tr>';
        html += '      <td style="width:90%;">';
        html += '        <span id="spanUndoOrgRolesActivationTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Org and Roles ACTIVATED</span>';
        html += '      </td>';
        html += '      <td style="width:9%;"></td>';
        html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
        html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divUndoOrgRolesActivationDialog\').dialog(\'close\');">X</span>';
        html += '      </td>';
        html += '    </tr>';
        html += '  </table>';
        html += '  <br /><br />';
        html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
        html += '  <span id="spanUndoOrgRolesActivationContent" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:20pt;">';
        html += '    Org and Roles have been activated and will immediately impact the future OrgRoles processes. Please keep an eye on potential issues related to your change(s). ';
        html += '    <br />';
        html += '    <br />';
        html += '    <br />';


        if (thiz.options.displayOrgRolesPicker == true) {
            html += '    <span style="font-weight:bold;cursor:pointer;">'; // onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'undoWorkflowActivation\');">';
            html += '       You can change the "Active OrgRoles" using the drop-down at the top of this page any time';
            html += '       <br />';
            html += '       <span style="color:tomato;font-weight:bold;">In saveOrgRolesConfigurationAndActivateAndUpdateParticipants(): WE NEED TO CHECK THE JSON FOR ParticipantIsDirty SO THAT WE UPDATE THE xx TABLE ACCODINGLY!!!!</span>';
            html += '       </span>';
            html += '   </span>';
        }


        //html += 'BIG CLOSE BUTTONxx';

        html += '  <br /><br />';

        html += '</div>';

        html += '<div id="divRolePickerDropDown" style="display:none;height:300px;width:400px;border:1px solid #066b8b;background-color:white;position:absolute;z-index:10;">'; // Scrollable div wrapper for the role picker. // dark blue border. // position and z-index makes it show up on top and to not move the other elements around.

        // Render the html.
        thiz.element.html(html);
        //debugger;


        //var html = '<canvas id="myCanvas" style="position:absolute;border:1px solid red;height:' + height + 'px;width:' + width + 'px;z-index:-1;"></canvas>';
        var html = '<canvas id="myCanvas" style="position:absolute;height:' + height + 'px;width:' + width + 'px;z-index:-1;"></canvas>';
        document.getElementById('spanCanvas2').innerHTML = html;
        var canvas = document.getElementById("myCanvas");











        // The following lines resizes the bitmap from 300x150 to what we want. This prevents scaling of our drawing...
        //var tableElement = document.getElementById('tableOrgRoles1');
        var tableElement = document.getElementById('tableOrgRoles2');
        //tableElement.style.border = '3px solid yellow';


        var height = tableElement.offsetHeight;
        var width = tableElement.offsetWidth;
        canvas.width = width;
        canvas.height = height;
        canvas.style.top = tableElement.style.top;


        thiz.checkIfWeHaveToDisplayThePublishChangesButton();

        if (thiz.options.displayOrgRolesPicker) {
            thiz.renderOrgRolesDropDownList();
        }


        // This may be abke to go elsewhere.?
        var options = {
            bwTenantId: tenantId,
            bwWorkflowAppId: workflowAppId,
            bwParticipantId: participantId,
            bwParticipantEmail: participantEmail,
            bwParticipantFriendlyName: participantFriendlyName,
            bwEnabledRequestTypes: bwEnabledRequestTypes
        };
        var $bwLocationPicker = $("#divBwLocationPicker").bwLocationPicker(options);






    } catch (e) {
        console.log('Exception in renderOrgRolesEditor(): ' + e.message + ', ' + e.stack);
    }
},
renderWorkflowPeoplePicker: function (tagName) {
    // This was originally a copy of the bwWorkflowEditor.renderWorkflowEditor method! May be an opportunity to abstract/break out this in the future.
    try {
        console.log('In renderWorkflowPeoplePicker().');
        var thiz = this;
        $.ajax({
            url: this.options.operationUriPrefix + "odata/racirolesandparticipants/" + this.options.bwWorkflowAppId, // Get the eCarWorkflow json/definition from the database.
            dataType: "json",
            contentType: "application/json",
            type: "Get",
            timeout: this.options.ajaxTimeout
        }).done(function (rolesAndParticipants) {
            try {
                console.log('In renderWorkflowPeoplePicker():2:.');
                //debugger;
                var car = thiz.options.workflow; //.store;
                var html = '';
                if (car == null) {
                    html += '<span style="font-size:24pt;color:red;">NO DATA</span>';
                    //debugger;
                } else {
                    //debugger;
                    // Include jquery-ui stylesheet.
                    //html += '<link rel="stylesheet" href="css/jquery/1.11.1/themes/smoothness/jquery-ui.min.css?v=0">'; // removed 8-18-2022
                    // Inline styles.
                    html += '<style>';
                    html += '.titlecell {';
                    html += '    vertical-align:top;';
                    html += '    padding-top:3px;';
                    html += '    padding-bottom:3px;';
                    html += '    padding-left:5px;';
                    html += '    padding-right:10px;';
                    html += '    white-space:nowrap;';
                    html += '    color:grey;';
                    html += '    text-decoration:underline;';
                    html += '}';
                    html += '.steprowcell {';
                    html += '    vertical-align:top;';
                    html += '    padding-top:10px;';
                    html += '    padding-bottom:10px;';
                    html += '    padding-left:5px;';
                    html += '    padding-right:5px;';
                    html += '    white-space:nowrap;';
                    html += '}';
                    html += '.steprow-hidden {';
                    html += '    visibility: collapse;';
                    html += '}';

                    html += '.steprow:hover {';
                    html += '    background-color: lightgoldenrodyellow;';
                    html += '}';

                    html += '.activeEditRow {';
                    html += '    background-color: #EBF6F9;';
                    html += '}';
                    html += '.ui-progressbar {';
                    html += '    position: relative;';
                    html += '}';
                    html += '.progress-label {';
                    html += '    position: absolute;';
                    html += '    left: 10%;';
                    html += '    top: 4px;';
                    html += '    font-weight: bold;';
                    html += '    color: black;';
                    html += '    text-shadow: 1px 1px 0 #fff;';
                    html += '}';
                    html += '#progressbar .ui-progressbar-value {';
                    html += '    background-color: cyan;';
                    html += '}';
                    html += '.transparent-dialog {';
                    html += '  background: transparent;';
                    html += '  border: none;';
                    html += '}';
                    html += '.transparent-dialog .ui-widget-header {';
                    html += '  border: none;';
                    html += '  background: transparent;';
                    html += '}';
                    html += '.transparent-dialog .ui-widget-content {';
                    html += '  background: transparent;';
                    html += '}';
                    //
                    // This is the dialog draggable handle bar colored lightgoldenrodyellow.
                    //
                    html += '.ui-dialog-title {';
                    html += '    background-color: lightgoldenrodyellow;';
                    html += '    border-color: orange;';
                    html += '}';
                    html += '.ui-draggable-handle {';
                    html += '    background-color: lightgoldenrodyellow !important;';
                    html += '    border-color: red !important;';
                    html += '}';
                    html += '.ui-corner-all {';
                    html += '    border-color: #FFE1AC !important;'; // Navajo White outlining the dialog boxes! Yeah!!! :)
                    html += '}';

                    html += '</style>';

                    html += '<table border="1" style="border-color:#d8d8d8;">';

                    // Iterate through all of the steps.
                    for (var i = 0; i < car.Workflow.Steps.Step.length; i++) {
                        var stepName = car.Workflow.Steps.Step[i]["@Name"];
                        if (false) {
                            // Do nothing, not displaying these steps. << DISPLAYING all steps now!
                        } else {
                            var newStepName = '';
                            if (stepName == 'Create') {
                                newStepName = 'Create';
                            } else if (stepName == 'Revise') {
                                newStepName = 'Revise';
                            } else if (stepName == 'Admin') {
                                newStepName = 'Admin';
                            } else if (stepName == 'Collaboration') {
                                newStepName = 'Collaborate and Develop Consensus';
                            } else if (stepName == 'VPLevel') {
                                newStepName = 'Requesting Manager Approvals';
                            } else if (stepName == 'ExecLevel') {
                                newStepName = 'Requesting Executive Approvals';
                            } else if (stepName == 'CLevel') {
                                newStepName = 'Requesting Board of Directors Approvals';
                            } else if (stepName == 'Done') {
                                newStepName = 'Approved';
                            } else if (stepName == 'IssueOrderNumber') {
                                newStepName = 'Requesting Purchase Order Number from Accounting';
                            }

                            if (stepName == 'Done') {
                                stepName = 'Completed (Done)'; // This is what we want the Done step renamed to in the future...
                            }

                            var cellColor = '#f5f6f7';

                            if (newStepName != 'Create' && newStepName != 'Revise' && newStepName != 'Admin') {

                                // Display the header row for this step.
                                html += '<tr id="stepheaderrow_' + i + '" style="border:0px">';
                                html += '  <td colspan="11" style="font-weight:bold;padding:10px;background-color:' + cellColor + ';" >';
                                html += '    <table style="width:100%;">';
                                html += '      <tr>';
                                html += '        <td>';
                                html += '          <span style="white-space:nowrap;"><span id="stepname_' + i + '" class="stepname" style="cursor:cell;" title="Double-click to edit the step name...">' + newStepName + '</span></span>';
                                html += '        </td>';
                                html += '        <td></td>';
                                html += '        <td style="text-align:center;">';
                                // Display the consensus timeout section and the "Configure Email", and "Add PArticipants" buttons.
                                html += '           <table style="width:100%;">';
                                html += '               <tr>';
                                html += '                   <td></td>';
                                html += '                   <td>';

                                html += '                   </td>';
                                html += '                   <td></td>';
                                html += '                   <td style="text-align:right;">';
                                if (stepName.toLowerCase() == 'admin') {
                                    // No "Add a participant" button for the ADMIN step/stage.
                                } else {
                                    //html += '&nbsp;&nbsp;&nbsp;&nbsp;';
                                    //html += '          <input type="button" class="buttonAddNewAssignmentRow" style="white-space:nowrap;padding:5px 10px 5px 10px;" value="✚ Add a Participant" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'addNewRow\', \'' + 'steprow-inform_' + i + '_' + '0' + '\');" />';
                                }
                                html += '                   </td>';
                                html += '               </tr>';
                                html += '           </table>';
                                html += '        </td>';
                                html += '      </tr>';
                                html += '    </table>';
                                html += '  </td>';
                                html += '</tr>';
                                // End: Display the header row for this step.

                                if (stepName == 'Create' || stepName == 'Revise' || stepName == 'Admin') {

                                } else {
                                    // Display Inform roles.
                                    if (car.Workflow.Steps.Step[i].OnStart && car.Workflow.Steps.Step[i].OnStart.Inform) {
                                        if (car.Workflow.Steps.Step[i].OnStart.Inform.length > 0) {
                                            for (var j = 0; j < car.Workflow.Steps.Step[i].OnStart.Inform.length; j++) {
                                                var xid = 'steprow-inform_' + i + '_' + j;
                                                var additionalRowClass = '';
                                                html += '<tr id="steprow-inform_' + i + '_' + j + '" class="steprow' + additionalRowClass + '" style="cursor:cell;" title="Double-click on this row to edit this role assignment..." >';
                                                html += '  <td style="width:30px;"></td>';

                                                if (thiz.options.displayRoleIdColumn) {
                                                    if (car.Workflow.Steps.Step[i].OnStart.Inform[j]) {
                                                        if (car.Workflow.Steps.Step[i].OnStart.Inform[j]["@Role"]) {
                                                            html += '<td style="background-color:' + cellColor + ';" class="roleid steprowcell" bwRoleId="' + car.Workflow.Steps.Step[i].OnStart.Inform[j]["@Role"] + '" bwOldValue="' + car.Workflow.Steps.Step[i].OnStart.Inform[j]["@Role"] + '">' + car.Workflow.Steps.Step[i].OnStart.Inform[j]["@Role"] + '</td>';
                                                        } else {
                                                            html += '<td style="background-color:' + cellColor + ';" class="roleid steprowcell" bwRoleId="' + car.Workflow.Steps.Step[i].OnStart.Inform[j]["@Role"] + '" bwOldValue="' + car.Workflow.Steps.Step[i].OnStart.Inform[j]["@Role"] + '">' + car.Workflow.Steps.Step[i].OnStart.Inform[j]["@IdField"] + '</td>';
                                                        }
                                                    }
                                                }

                                                // Todd changed 10-13-19 7-32am ast
                                                var roleName = '';
                                                var roleId = '';
                                                if (car.Workflow.Steps.Step[i].OnStart.Inform[j]) {
                                                    roleName = car.Workflow.Steps.Step[i].OnStart.Inform[j]["@RoleName"];
                                                    roleId = car.Workflow.Steps.Step[i].OnStart.Inform[j]["@Role"];
                                                }
                                                //
                                                // Now that we have the roleName, we need to travel up through the organizational structure to determine if this role is assigned already!
                                                //
                                                html += '<td style="background-color:' + cellColor + ';" class="rolename steprowcell" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'' + cellColor + '\';" bwStepname="' + car.Workflow.Steps.Step[i]["@Name"] + '" bwRoleId="' + car.Workflow.Steps.Step[i].OnStart.Inform[j]["@Role"] + '" bwOldValue="' + roleName + '">';
                                                var roleAssigned = true;
                                                if (roleAssigned) {
                                                    //html += '<span style="color:grey;font-size:12pt;font-style:italic;">';
                                                    html += '<span style="font-size:12pt;">';
                                                    html += roleName;

                                                    //html += '<br />';
                                                    //html += 'Nova Scotia 98765 Inc.';

                                                    html += '</span>';
                                                } else {
                                                    html += '<span style="color:red;font-size:12pt;font-style:italic;">';
                                                    html += roleName;
                                                    html += '</span>';
                                                }
                                                html += '</td>';

                                                html += '  <td class="steprowbuttons steprowcell" style="background-color:' + cellColor + ';width:80px;text-align:right;padding-right:15px;" >';

                                                //
                                                // Display the role participants.
                                                //
                                                var participantFriendlyName;
                                                try {
                                                    for (var p = 0; p < rolesAndParticipants.RolesAndParticipants.length; p++) {
                                                        if (roleId == rolesAndParticipants.RolesAndParticipants[p].RoleId) {
                                                            participantFriendlyName = rolesAndParticipants.RolesAndParticipants[p].Participants[0].bwParticipantFriendlyName;
                                                        }
                                                    }
                                                } catch (e) {
                                                    console.log('Exception displaying participants:1: ' + e.message + ', ' + e.stack);
                                                }
                                                if (participantFriendlyName) html += participantFriendlyName;

                                                //html += '[PEOPLE PICKER]  [...]';
                                                //html += '&nbsp;&nbsp;';
                                                //html += '    <input style="padding:5px 10px 5px 10px;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'renderEditSteprow\', \'' + xid + '\');" type="button" value="⚙ Edit">';

                                                html += '  </td>';

                                                html += '</tr>';
                                            }
                                        }
                                    }
                                    // Display Assign roles.
                                    if (car.Workflow.Steps.Step[i].Assign) {
                                        if (car.Workflow.Steps.Step[i].Assign.length > 0) {
                                            for (var j = 0; j < car.Workflow.Steps.Step[i].Assign.length; j++) {
                                                var xid = 'steprow-assign_' + i + '_' + j;
                                                var additionalRowClass = '';
                                                html += '<tr id="steprow-assign_' + i + '_' + j + '" class="steprow' + additionalRowClass + '" style="cursor:cell;" title="Double-click on this row to edit this role assignment..." >';

                                                html += '  <td style="width:30px;"></td>';

                                                if (thiz.options.displayRoleIdColumn) {
                                                    html += '<td style="background-color:' + cellColor + ';" class="roleid steprowcell" bwRoleId="' + car.Workflow.Steps.Step[i].Assign[j]["@Role"] + '" bwOldValue="' + car.Workflow.Steps.Step[i].Assign[j]["@Role"] + '">' + car.Workflow.Steps.Step[i].Assign[j]["@Role"] + '</td>';
                                                }

                                                // Todd changed 10-13-19 7-32am ast
                                                var roleName = '';
                                                var roleId = '';
                                                if (car.Workflow.Steps.Step[i].Assign[j]) {
                                                    roleName = car.Workflow.Steps.Step[i].Assign[j]["@RoleName"];
                                                    roleId = car.Workflow.Steps.Step[i].Assign[j]["@Role"];
                                                }

                                                html += '<td style="background-color:' + cellColor + ';" class="rolename steprowcell" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'' + cellColor + '\';" bwStepname="' + car.Workflow.Steps.Step[i]["@Name"] + '" bwRoleId="' + car.Workflow.Steps.Step[i].Assign[j]["@Role"] + '" bwOldValue="' + roleName + '">';

                                                html += roleName;
                                                html += '<br />';
                                                html += '</td>';

                                                html += '<td class="steprowbuttons steprowcell" style="background-color:' + cellColor + ';width:80px;text-align:right;padding-right:15px;" >';

                                                //
                                                // Display the role participants.
                                                //
                                                var participantFriendlyName;
                                                try {
                                                    for (var p = 0; p < rolesAndParticipants.RolesAndParticipants.length; p++) {
                                                        if (roleId == rolesAndParticipants.RolesAndParticipants[p].RoleId) {
                                                            participantFriendlyName = rolesAndParticipants.RolesAndParticipants[p].Participants[0].bwParticipantFriendlyName;
                                                        }
                                                    }
                                                } catch (e) {
                                                    console.log('Exception displaying participants:1: ' + e.message + ', ' + e.stack);
                                                }
                                                if (participantFriendlyName) html += participantFriendlyName;

                                                //html += '[PEOPLE PICKER2]  [...]';
                                                //html += '&nbsp;&nbsp;';
                                                //html += '  <input style="padding:5px 10px 5px 10px;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'renderEditSteprow\', \'' + xid + '\');" type="button" value="⚙ Edit">';

                                                html += '</td>';

                                                html += '</tr>';
                                            }
                                        }
                                    }
                                }
                                //html += '</tr>';
                            }
                        }
                    }
                    html += '</table>';





                    //html += '<div style="display:none;" id="divCreateANewRoleDialog">';
                    //html += '  <table style="width:100%;">';
                    //html += '    <tr>';
                    //html += '      <td style="width:90%;">';
                    //html += '        <span id="spanCustomSignUpDialogTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Create a new Role</span>';
                    //html += '      </td>';
                    //html += '      <td style="width:9%;"></td>';
                    //html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
                    //html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divCreateANewRoleDialog\').dialog(\'close\');">X</span>';
                    //html += '      </td>';
                    //html += '    </tr>';
                    //html += '  </table>';
                    //html += '  <br /><br />';
                    //html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                    //html += '  <span id="spanCustomSignUpDialogInvitationDescriptionText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;"></span><br />';
                    //html += '  <span style="font-family: calibri;">Role Abbreviation</span><br />';
                    //html += '  <input type="text" id="txtCreateANewRoleDialog_RoleId" style="WIDTH: 93%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 40pt;" /><br /><br />';
                    //html += '  <span style="font-family: calibri;">Role Name</span><br />';
                    //html += '  <input type="text" id="txtCreateANewRoleDialog_RoleName" style="WIDTH: 93%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 40pt;" /><br /><br />';
                    //html += '  <br />';

                    //html += '  <table style="width:100%;">';
                    //html += '     <tr>';
                    //html += '       <td style="text-align:center;">';
                    //html += '  <input type="button" value="Create your new role now!" style="height:30pt;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'createANewRole\');" />';
                    //html += '       </td>';
                    //html += '     </tr>';
                    //html += '  </table>';
                    //html += '  <br /><br />';
                    //html += '</div>';

                    html += '<div style="display:none;" id="divOrgMultiPickerDialog">';
                    html += '  <table style="width:100%;">';
                    html += '    <tr>';
                    html += '      <td style="width:90%;">';
                    html += '        <span id="spanOrgMultiPickerDialogTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Location(s)</span>';
                    html += '      </td>';
                    html += '      <td style="width:9%;"></td>';
                    html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
                    html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divOrgMultiPickerDialog\').dialog(\'close\');">X</span>';
                    html += '      </td>';
                    html += '    </tr>';
                    html += '  </table>';
                    html += '  <br /><br />';
                    html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                    html += '  <span id="spanOrgMultiPickerDialogContent" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;"></span><br />';
                    html += '  <br /><br />';
                    html += '  <input type="button" value="SAVE" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'orgMultiPickerDialog_RenderResults\');" />';
                    html += '  <br /><br />';
                    html += '</div>';


                    html += '<div style="display:none;" id="divMessageDialog">';
                    html += '  <table style="width:100%;">';
                    html += '    <tr>';
                    html += '      <td style="width:90%;">';
                    html += '        <span id="spanMessageDialogTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">[spanMessageDialogTitle]</span>';
                    html += '      </td>';
                    html += '      <td style="width:9%;"></td>';
                    html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
                    html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divMessageDialog\').dialog(\'close\');">X</span>';
                    html += '      </td>';
                    html += '    </tr>';
                    html += '  </table>';
                    html += '  <br /><br />';
                    html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                    html += '  <span id="spanMessageDialogContentTop" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;">[spanMessageDialogContentTop]</span>';
                    html += '    <br />';
                    html += '    <br />';
                    html += '    <br />';
                    html += '    <span id="spanMessageDialogContentBottom" style="font-weight:bold;cursor:pointer;">';
                    html += '      [spanMessageDialogContentBottom]';
                    html += '    </span>';
                    html += '  <br /><br />';
                    html += '</div>';




                    html += '<div style="display:none;" id="divWorkflowActionsUnderlyingPropertiesDialog">';
                    html += '  <table style="width:100%;">';
                    html += '    <tr>';
                    html += '      <td style="width:90%;">';
                    html += '        <span id="spanWorkflowActionsUnderlyingPropertiesDialog" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Action Properties</span>';
                    html += '                    <br />';
                    html += '                    <span id="spanWorkflowActionsUnderlyingPropertiesDialogSubTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:normal;">[spanWorkflowActionsUnderlyingPropertiesDialogSubTitle]</span>';
                    html += '      </td>';
                    html += '      <td style="width:9%;"></td>';
                    html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
                    html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divWorkflowActionsUnderlyingPropertiesDialog\').dialog(\'close\');">X</span>';
                    html += '      </td>';
                    html += '    </tr>';
                    html += '  </table>';
                    html += '  <br /><br />';
                    html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                    html += '  <span id="spanWorkflowActionsUnderlyingPropertiesDialogContentTop">[spanWorkflowActionsUnderlyingPropertiesDialogContentTop]</span>';
                    html += '    <br />';
                    html += '    <br />';
                    html += '    <br />';
                    html += '    <span id="spanWorkflowActionsUnderlyingPropertiesDialogContentBottom" style="font-weight:bold;cursor:pointer;">';
                    //html += '      [spanEmailDataItemPickerDialogContentBottom]';
                    html += '    </span>';
                    html += '  <br /><br />';
                    html += '</div>';

                    html += '<div style="display:none;" id="divProgressBarDialog">';
                    html += '<div id="progressbar" class="ui-progressbar"><div class="progress-label">Loading...</div></div>';
                    html += '</div>';

                    //document.getElementById(tagName).innerHTML = html;

                }

                //debugger;
                document.getElementById(tagName).innerHTML = html;

                var x = '';
            } catch (e) {
                debugger;
                //lpSpinner.Hide();
                console.log('Exception in raci.html._create().renderRaci.xx.Get: ' + e.message + ', ' + e.stack);
            }
        }).fail(function (data) {
            //lpSpinner.Hide();
            debugger;
            var msg;
            if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
            } else {
                msg = JSON.stringify(data);
            }
            alert('Exception in raci.html._create().renderRaci.Get[Roles].fail: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
            console.log('Exception in raci.html._create().renderRaci.Get[Roles].fail: ' + JSON.stringify(data));
            //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
            //var error = JSON.parse(data.responseText)["odata.error"];
            //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
        });
    } catch (e) {
        debugger;
        console.log('EXCEPTION IN render1: ' + e.message + ', ' + e.stack);
    }
},
//renderOrgRoleConnectorsToWorkflow: function (clearCanvas, divisionIndex, groupIndex, entityIndex, locationIndex) {
//    try {
//        // On hover or click, this draws the lines and highlights any missing role assignments.
//        //debugger;
//        console.log('In renderOrgRoleConnectorsToWorkflow(). divisionIndex: ' + divisionIndex + ', groupIndex: ' + groupIndex + ', entityIndex: ' + entityIndex + ', locationIndex: ' + locationIndex);

//        //var tableElement = document.getElementById('tableOrgRoles1');
//        var tableElement = document.getElementById('tableOrgRoles2');
//        var height = tableElement.offsetHeight;
//        var width = tableElement.offsetWidth;
//        var canvas = document.getElementById("myCanvas");
//        // The following resizes the bitmap from 300x150 to what we want. This prevents scaling of our drawing...
//        canvas.width = width;
//        canvas.height = height;
//        ctx = canvas.getContext("2d");

//        // We have to reset our drawing
//        if (clearCanvas == true) {
//            ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines
//        }
//        //
//        // We have to reset our drawing and highlighting and start fresh.
//        //
//        $('.orgTreeNode').css('color', this.options.color.Default); // tree org node
//        $('.rolename').css('color', this.options.color.Default); // role name in the workflow editor 
//        $('.steprowbuttons').html(''); // Clear the participant names in the workflow editor

//        // Reset complete.
//        var json = this.options.store;
//        var originElementId, orgName, orgPath;
//        var originElementIdsAndRoles = []; // This gets passed to the drawing routine and has the origin and the roles to draw the lines for...
//        var originElementIdsAndRolesForChildNodes = []; // This gets passed to the drawing routine and has the origin and the roles to draw the lines for the child nodes. These will be grey or a lighter color so they appear in the background so to speak.
//        if ((locationIndex && locationIndex != 'undefined') || locationIndex > -1) {
//            if (json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex].Roles) {
//                var locationOriginAndRoles = {
//                    originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex + '_' + entityIndex + '_' + locationIndex,
//                    roles: json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex].Roles,
//                    orgElementId: 'spanOrgX_' + divisionIndex + '_' + groupIndex + '_' + entityIndex + '_' + locationIndex
//                }
//            } else {
//                var locationOriginAndRoles = {
//                    originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex + '_' + entityIndex + '_' + locationIndex,
//                    roles: [],
//                    orgElementId: 'spanOrgX_' + divisionIndex + '_' + groupIndex + '_' + entityIndex + '_' + locationIndex
//                }
//            }
//            originElementIdsAndRoles.push(locationOriginAndRoles);
//            if (json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Roles) {
//                var legalEntityOriginAndRoles = {
//                    originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex + '_' + entityIndex,
//                    roles: json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Roles,
//                    orgElementId: 'spanOrgX_' + divisionIndex + '_' + groupIndex + '_' + entityIndex
//                }
//            } else {
//                var legalEntityOriginAndRoles = {
//                    originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex + '_' + entityIndex,
//                    roles: [],
//                    orgElementId: 'spanOrgX_' + divisionIndex + '_' + groupIndex + '_' + entityIndex
//                }
//            }
//            originElementIdsAndRoles.push(legalEntityOriginAndRoles);
//            if (json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Roles) {
//                var groupOriginAndRoles = {
//                    originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex,
//                    roles: json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Roles,
//                    orgElementId: 'spanOrgX_' + divisionIndex + '_' + groupIndex
//                }
//            } else {
//                var groupOriginAndRoles = {
//                    originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex,
//                    roles: [],
//                    orgElementId: 'spanOrgX_' + divisionIndex + '_' + groupIndex
//                }
//            }
//            originElementIdsAndRoles.push(groupOriginAndRoles);
//            if (json.Global.Divisions.Items[divisionIndex].Roles) {
//                var divisionOriginAndRoles = {
//                    originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex,
//                    roles: json.Global.Divisions.Items[divisionIndex].Roles,
//                    orgElementId: 'spanOrgX_' + divisionIndex
//                }
//            } else {
//                var divisionOriginAndRoles = {
//                    originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex,
//                    roles: [],
//                    orgElementId: 'spanOrgX_' + divisionIndex
//                }
//            }
//            originElementIdsAndRoles.push(divisionOriginAndRoles);
//            if (json.Global.Roles) {
//                var globalRootOriginElementIdAndRoles = {
//                    originElementId: 'spanWorkflowPeoplePicker_' + 'root',
//                    roles: json.Global.Roles,
//                    orgElementId: 'spanOrgX_' + 'root'
//                }
//            } else {
//                var globalRootOriginElementIdAndRoles = {
//                    originElementId: 'spanWorkflowPeoplePicker_' + 'root',
//                    roles: [],
//                    orgElementId: 'spanOrgX_' + 'root'
//                }
//            }
//            originElementIdsAndRoles.push(globalRootOriginElementIdAndRoles);
//        } else if ((entityIndex && entityIndex != 'undefined') || entityIndex > -1) {
//            if (json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Roles) {
//                var legalEntityOriginAndRoles = {
//                    originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex + '_' + entityIndex,
//                    roles: json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Roles,
//                    orgElementId: 'spanOrgX_' + divisionIndex + '_' + groupIndex + '_' + entityIndex
//                }
//            } else {
//                var legalEntityOriginAndRoles = {
//                    originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex + '_' + entityIndex,
//                    roles: [],
//                    orgElementId: 'spanOrgX_' + divisionIndex + '_' + groupIndex + '_' + entityIndex
//                }
//            }
//            originElementIdsAndRoles.push(legalEntityOriginAndRoles);
//            if (json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Roles) {
//                var groupOriginAndRoles = {
//                    originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex,
//                    roles: json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Roles,
//                    orgElementId: 'spanOrgX_' + divisionIndex + '_' + groupIndex
//                }
//            } else {
//                var groupOriginAndRoles = {
//                    originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex,
//                    roles: [],
//                    orgElementId: 'spanOrgX_' + divisionIndex + '_' + groupIndex
//                }
//            }
//            originElementIdsAndRoles.push(groupOriginAndRoles);
//            if (json.Global.Divisions.Items[divisionIndex].Roles) {
//                var divisionOriginAndRoles = {
//                    originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex,
//                    roles: json.Global.Divisions.Items[divisionIndex].Roles,
//                    orgElementId: 'spanOrgX_' + divisionIndex
//                }
//            } else {
//                var divisionOriginAndRoles = {
//                    originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex,
//                    roles: [],
//                    orgElementId: 'spanOrgX_' + divisionIndex
//                }
//            }
//            originElementIdsAndRoles.push(divisionOriginAndRoles);
//            if (json.Global.Roles) {
//                var globalRootOriginElementIdAndRoles = {
//                    originElementId: 'spanWorkflowPeoplePicker_' + 'root',
//                    roles: json.Global.Roles,
//                    orgElementId: 'spanOrgX_' + 'root'
//                }
//            } else {
//                var globalRootOriginElementIdAndRoles = {
//                    originElementId: 'spanWorkflowPeoplePicker_' + 'root',
//                    roles: [],
//                    orgElementId: 'spanOrgX_' + 'root'
//                }
//            }
//            originElementIdsAndRoles.push(globalRootOriginElementIdAndRoles);
//            //
//            // Now populate the Locations object so we can draw the grey lines!!!
//            // 
//            for (var i = 0; i < json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items.length; i++) {
//                if (json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[i].Roles) {
//                    var locationOriginAndRoles = {
//                        originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex + '_' + entityIndex + '_' + i,
//                        roles: json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[i].Roles,
//                        orgElementId: 'spanOrgX_' + divisionIndex + '_' + groupIndex + '_' + entityIndex + '_' + i
//                    }
//                } else {
//                    var locationOriginAndRoles = {
//                        originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex + '_' + entityIndex + '_' + i,
//                        roles: [],
//                        orgElementId: 'spanOrgX_' + divisionIndex + '_' + groupIndex + '_' + entityIndex + '_' + i
//                    }
//                }
//                originElementIdsAndRolesForChildNodes.push(locationOriginAndRoles);
//            }
//        } else if ((groupIndex && groupIndex != 'undefined') || groupIndex > -1) {
//            if (json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Roles) {
//                var groupOriginAndRoles = {
//                    originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex,
//                    roles: json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Roles,
//                    orgElementId: 'spanOrgX_' + divisionIndex + '_' + groupIndex
//                }
//            } else {
//                var groupOriginAndRoles = {
//                    originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex,
//                    roles: [],
//                    orgElementId: 'spanOrgX_' + divisionIndex + '_' + groupIndex
//                }
//            }
//            originElementIdsAndRoles.push(groupOriginAndRoles);
//            if (json.Global.Divisions.Items[divisionIndex].Roles) {
//                var divisionOriginAndRoles = {
//                    originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex,
//                    roles: json.Global.Divisions.Items[divisionIndex].Roles,
//                    orgElementId: 'spanOrgX_' + divisionIndex
//                }
//            } else {
//                var divisionOriginAndRoles = {
//                    originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex,
//                    roles: [],
//                    orgElementId: 'spanOrgX_' + divisionIndex
//                }
//            }
//            originElementIdsAndRoles.push(divisionOriginAndRoles);
//            if (json.Global.Roles) {
//                var globalRootOriginElementIdAndRoles = {
//                    originElementId: 'spanWorkflowPeoplePicker_' + 'root',
//                    roles: json.Global.Roles,
//                    orgElementId: 'spanOrgX_' + 'root'
//                }
//            } else {
//                var globalRootOriginElementIdAndRoles = {
//                    originElementId: 'spanWorkflowPeoplePicker_' + 'root',
//                    roles: [],
//                    orgElementId: 'spanOrgX_' + 'root'
//                }
//            }
//            originElementIdsAndRoles.push(globalRootOriginElementIdAndRoles);


//            //
//            // Now populate the Legal Entity object so we can draw the grey lines!!!
//            // 
//            for (var e = 0; e < json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items.length; e++) {
//                if (json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[e].Roles) {
//                    var legalEntityOriginAndRoles = {
//                        originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex + '_' + e,
//                        roles: json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[e].Roles,
//                        orgElementId: 'spanOrgX_' + divisionIndex + '_' + groupIndex + '_' + e
//                    }
//                } else {
//                    var legalEntityOriginAndRoles = {
//                        originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex + '_' + e,
//                        roles: [],
//                        orgElementId: 'spanOrgX_' + divisionIndex + '_' + groupIndex + '_' + e
//                    }
//                }
//                originElementIdsAndRolesForChildNodes.push(legalEntityOriginAndRoles);
//                //
//                // Now populate the Locations object so we can draw the grey lines!!!
//                // 
//                for (var l = 0; l < json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[e].Locations.Items.length; l++) {
//                    if (json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[e].Locations.Items[l].Roles) {
//                        var locationOriginAndRoles = {
//                            originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex + '_' + e + '_' + l,
//                            roles: json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[e].Locations.Items[l].Roles,
//                            orgElementId: 'spanOrgX_' + divisionIndex + '_' + groupIndex + '_' + e + '_' + l
//                        }
//                    } else {
//                        var locationOriginAndRoles = {
//                            originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex + '_' + e + '_' + l,
//                            roles: [],
//                            orgElementId: 'spanOrgX_' + divisionIndex + '_' + groupIndex + '_' + e + '_' + l
//                        }
//                    }
//                    originElementIdsAndRolesForChildNodes.push(locationOriginAndRoles);
//                }
//            }


//        } else if ((divisionIndex && divisionIndex != 'undefined') || divisionIndex > -1) {
//            if (divisionIndex == 'root') {
//                if (json.Global.Roles) {
//                    var globalRootOriginElementIdAndRoles = {
//                        originElementId: 'spanWorkflowPeoplePicker_' + 'root',
//                        roles: json.Global.Roles,
//                        orgElementId: 'spanOrgX_' + 'root'
//                    }
//                } else {
//                    var globalRootOriginElementIdAndRoles = {
//                        originElementId: 'spanWorkflowPeoplePicker_' + 'root',
//                        roles: [],
//                        orgElementId: 'spanOrgX_' + 'root'
//                    }
//                }
//                originElementIdsAndRoles.push(globalRootOriginElementIdAndRoles);

//                //
//                // Now populate the Divisions object so we can draw the grey lines!!!
//                // 
//                for (var d = 0; d < json.Global.Divisions.Items.length; d++) {
//                    if (json.Global.Divisions.Items[d].Roles) {
//                        var divisionOriginAndRoles = {
//                            originElementId: 'spanWorkflowPeoplePicker_' + d,
//                            roles: json.Global.Divisions.Items[d].Roles,
//                            orgElementId: 'spanOrgX_' + d
//                        }
//                    } else {
//                        var divisionOriginAndRoles = {
//                            originElementId: 'spanWorkflowPeoplePicker_' + d,
//                            roles: [],
//                            orgElementId: 'spanOrgX_' + d
//                        }
//                    }
//                    originElementIdsAndRolesForChildNodes.push(divisionOriginAndRoles);
//                    //
//                    // Now populate the Group object so we can draw the grey lines!!!
//                    // 
//                    for (var g = 0; g < json.Global.Divisions.Items[d].Groups.Items.length; g++) {
//                        if (json.Global.Divisions.Items[d].Groups.Items[g].Roles) {
//                            var groupOriginAndRoles = {
//                                originElementId: 'spanWorkflowPeoplePicker_' + d + '_' + g,
//                                roles: json.Global.Divisions.Items[d].Groups.Items[g].Roles,
//                                orgElementId: 'spanOrgX_' + d + '_' + g
//                            }
//                        } else {
//                            var groupOriginAndRoles = {
//                                originElementId: 'spanWorkflowPeoplePicker_' + d + '_' + g,
//                                roles: [],
//                                orgElementId: 'spanOrgX_' + d + '_' + g
//                            }
//                        }
//                        originElementIdsAndRolesForChildNodes.push(groupOriginAndRoles);
//                        //
//                        // Now populate the Legal Entity object so we can draw the grey lines!!!
//                        // 
//                        for (var e = 0; e < json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items.length; e++) {
//                            if (json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Roles) {
//                                var legalEntityOriginAndRoles = {
//                                    originElementId: 'spanWorkflowPeoplePicker_' + d + '_' + g + '_' + e,
//                                    roles: json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Roles,
//                                    orgElementId: 'spanOrgX_' + d + '_' + g + '_' + e
//                                }
//                            } else {
//                                var legalEntityOriginAndRoles = {
//                                    originElementId: 'spanWorkflowPeoplePicker_' + d + '_' + g + '_' + e,
//                                    roles: [],
//                                    orgElementId: 'spanOrgX_' + d + '_' + g + '_' + e
//                                }
//                            }
//                            originElementIdsAndRolesForChildNodes.push(legalEntityOriginAndRoles);
//                            //
//                            // Now populate the Locations object so we can draw the grey lines!!!
//                            // 
//                            for (var l = 0; l < json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items.length; l++) {
//                                if (json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Roles) {
//                                    var locationOriginAndRoles = {
//                                        originElementId: 'spanWorkflowPeoplePicker_' + d + '_' + g + '_' + e + '_' + l,
//                                        roles: json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Roles,
//                                        orgElementId: 'spanOrgX_' + d + '_' + g + '_' + e + '_' + l
//                                    }
//                                } else {
//                                    var locationOriginAndRoles = {
//                                        originElementId: 'spanWorkflowPeoplePicker_' + d + '_' + g + '_' + e + '_' + l,
//                                        roles: [],
//                                        orgElementId: 'spanOrgX_' + d + '_' + g + '_' + e + '_' + l
//                                    }
//                                }
//                                originElementIdsAndRolesForChildNodes.push(locationOriginAndRoles);
//                            }
//                        }
//                    }
//                }

//            } else {
//                if (json.Global.Divisions.Items[divisionIndex].Roles) {
//                    var divisionOriginAndRoles = {
//                        originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex,
//                        roles: json.Global.Divisions.Items[divisionIndex].Roles,
//                        orgElementId: 'spanOrgX_' + divisionIndex
//                    }
//                } else {
//                    var divisionOriginAndRoles = {
//                        originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex,
//                        roles: [],
//                        orgElementId: 'spanOrgX_' + divisionIndex
//                    }
//                }
//                originElementIdsAndRoles.push(divisionOriginAndRoles);
//                if (json.Global.Roles) {
//                    var globalRootOriginElementIdAndRoles = {
//                        originElementId: 'spanWorkflowPeoplePicker_' + 'root',
//                        roles: json.Global.Roles,
//                        orgElementId: 'spanOrgX_' + 'root'
//                    }
//                } else {
//                    var globalRootOriginElementIdAndRoles = {
//                        originElementId: 'spanWorkflowPeoplePicker_' + 'root',
//                        roles: [],
//                        orgElementId: 'spanOrgX_' + 'root'
//                    }
//                }
//                originElementIdsAndRoles.push(globalRootOriginElementIdAndRoles);

//                //
//                // Now populate the Group object so we can draw the grey lines!!!
//                // 
//                for (var g = 0; g < json.Global.Divisions.Items[divisionIndex].Groups.Items.length; g++) {
//                    if (json.Global.Divisions.Items[divisionIndex].Groups.Items[g].Roles) {
//                        var groupOriginAndRoles = {
//                            originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + g,
//                            roles: json.Global.Divisions.Items[divisionIndex].Groups.Items[g].Roles,
//                            orgElementId: 'spanOrgX_' + divisionIndex + '_' + g
//                        }
//                    } else {
//                        var groupOriginAndRoles = {
//                            originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + g,
//                            roles: [],
//                            orgElementId: 'spanOrgX_' + divisionIndex + '_' + g
//                        }
//                    }
//                    originElementIdsAndRolesForChildNodes.push(groupOriginAndRoles);
//                    //
//                    // Now populate the Legal Entity object so we can draw the grey lines!!!
//                    // 
//                    for (var e = 0; e < json.Global.Divisions.Items[divisionIndex].Groups.Items[g].LegalEntities.Items.length; e++) {
//                        if (json.Global.Divisions.Items[divisionIndex].Groups.Items[g].LegalEntities.Items[e].Roles) {
//                            var legalEntityOriginAndRoles = {
//                                originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + g + '_' + e,
//                                roles: json.Global.Divisions.Items[divisionIndex].Groups.Items[g].LegalEntities.Items[e].Roles,
//                                orgElementId: 'spanOrgX_' + divisionIndex + '_' + g + '_' + e
//                            }
//                        } else {
//                            var legalEntityOriginAndRoles = {
//                                originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + g + '_' + e,
//                                roles: [],
//                                orgElementId: 'spanOrgX_' + divisionIndex + '_' + g + '_' + e
//                            }
//                        }
//                        originElementIdsAndRolesForChildNodes.push(legalEntityOriginAndRoles);
//                        //
//                        // Now populate the Locations object so we can draw the grey lines!!!
//                        // 
//                        for (var l = 0; l < json.Global.Divisions.Items[divisionIndex].Groups.Items[g].LegalEntities.Items[e].Locations.Items.length; l++) {
//                            if (json.Global.Divisions.Items[divisionIndex].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Roles) {
//                                var locationOriginAndRoles = {
//                                    originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + g + '_' + e + '_' + l,
//                                    roles: json.Global.Divisions.Items[divisionIndex].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Roles,
//                                    orgElementId: 'spanOrgX_' + divisionIndex + '_' + g + '_' + e + '_' + l
//                                }
//                            } else {
//                                var locationOriginAndRoles = {
//                                    originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + g + '_' + e + '_' + l,
//                                    roles: [],
//                                    orgElementId: 'spanOrgX_' + divisionIndex + '_' + g + '_' + e + '_' + l
//                                }
//                            }
//                            originElementIdsAndRolesForChildNodes.push(locationOriginAndRoles);
//                        }
//                    }
//                }

//            }
//        } else {
//            //debugger;
//            console.log('Error: Unexpected parameter in renderOrgRoleConnectorsToWorkflow(). clearCanvas: ' + clearCanvas + ', divisionIndex: ' + divisionIndex + ', groupIndex: ' + groupIndex + ', entityIndex: ' + entityIndex + ',locationIndex: ' + locationIndex);
//            alert('Error: Unexpected parameter in renderOrgRoleConnectorsToWorkflow(). clearCanvas: ' + clearCanvas + ', divisionIndex: ' + divisionIndex + ', groupIndex: ' + groupIndex + ', entityIndex: ' + entityIndex + ',locationIndex: ' + locationIndex);
//        }

//        // Render the child node lines first so they are in the background.
//        this.drawLineFromOrgToWorkflowRoleAndHighlightOrg(ctx, originElementIdsAndRolesForChildNodes, this.options.color.ChildNode, this.options.color.ChildNode);

//        // Render the lines.
//        this.drawLineFromOrgToWorkflowRoleAndHighlightOrg(ctx, originElementIdsAndRoles, this.options.color.Active, this.options.color.Active);

//    } catch (e) {
//        console.log('Exception in renderOrgRoleConnectorsToWorkflow(): ' + e.message + ', ' + e.stack);
//    }
//},

//renderOrgRoleConnectorsToWorkflowReset: function (elementId, divisionIndex, groupIndex, entityIndex, locationIndex) {
//    try {
//        // On hover or click, this draws the lines and highlights any missing role assignments.
//        //console.log('In renderOrgRoleConnectorsToWorkflowReset(). elementId: ' + elementId + ', divisionIndex: ' + divisionIndex + ', groupIndex: ' + groupIndex + ', entityIndex: ' + entityIndex + ', locationIndex: ' + locationIndex);

//        //var element = document.getElementById(elementId);
//        //element.style.color = 'black';


//        //try {
//        //    // Make all of the parent orgs the active color. TODD: THIS NEEDS WORK!!!!
//        //    var globalId = 'spanOrgX_root';
//        //    var divisionId = 'spanOrgX_' + divisionIndex;
//        //    var groupId = 'spanOrgX_' + divisionIndex + '_' + groupIndex;
//        //    var legalEntityId = 'spanOrgX_' + divisionIndex + '_' + groupIndex + '_' + entityIndex;
//        //    var globalElement = document.getElementById(globalId);
//        //    globalElement.style.color = this.options.color.Default;
//        //    var divisionElement = document.getElementById(divisionId);
//        //    divisionElement.style.color = this.options.color.Default;
//        //    var groupElement = document.getElementById(groupId);
//        //    groupElement.style.color = this.options.color.Default;
//        //    var legalEntityElement = document.getElementById(legalEntityId);
//        //    legalEntityElement.style.color = this.options.color.Default;
//        //    //End: Make all of the parent orgs the active color.
//        //} catch (e) {
//        //    // do nothing this is temporary
//        //}

//        //// Selected element.
//        //var element = document.getElementById(elementId);
//        //element.style.color = this.options.color.Default; //'aqua'; //.fontWeight = 'bold';

//    } catch (e) {
//        console.log('Exception in renderOrgRoleConnectorsToWorkflowReset(): ' + e.message + ', ' + e.stack);
//    }
//},


//renderOrgEditorInACircle: function (divisionIndex, groupIndex, entityIndex, locationIndex) {
//    try {
//        console.log('In renderOrgEditorInACircle().');
//        var thiz = this;

//        // This determines the id of the element, depending on the passed parameters.
//        var originElementId;
//        if (locationIndex || locationIndex > -1) {
//            originElementId = 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex + '_' + entityIndex + '_' + locationIndex; // eg: spanWorkflowPeoplePicker_0_0_0_1
//        } else if (entityIndex || entityIndex > -1) {
//            originElementId = 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex + '_' + entityIndex;
//        } else if (groupIndex || groupIndex > -1) {
//            originElementId = 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex;
//        } else if (divisionIndex || divisionIndex > -1) {
//            originElementId = 'spanWorkflowPeoplePicker_' + divisionIndex;
//        } else {
//            debugger;
//            alert('Error: Unexpected parameter in renderOrgEditorInACircle().');
//        }

//        //
//        // DISPLAY THE ROLES INCLUDED IN THE JSON 
//        //
//        var json = this.options.store;
//        var roles, orgName, orgPath;
//        if (locationIndex || locationIndex > -1) {
//            roles = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex].Roles;
//            orgName = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex].Name;
//            orgPath = json.Global.Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex].Name;
//        } else if (entityIndex || entityIndex > -1) {
//            roles = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Roles;
//            orgName = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Name;
//            orgPath = json.Global.Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Name;
//        } else if (groupIndex || groupIndex > -1) {
//            roles = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Roles;
//            orgName = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Name;
//            orgPath = json.Global.Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Name;
//        } else if (divisionIndex || divisionIndex > -1) {
//            if (divisionIndex == 'root') {
//                roles = json.Global.Roles;
//                orgName = json.Global.Name;
//                orgPath = json.Global.Name;
//            } else {
//                roles = json.Global.Divisions.Items[divisionIndex].Roles;
//                orgName = json.Global.Divisions.Items[divisionIndex].Name;
//                orgPath = json.Global.Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Name;
//            }
//        } else {
//            debugger;
//            alert('Error: Unexpected parameter in renderOrgEditorInACircle():2:.');
//        }


//        var html = '';
//        html += '  <table style="width:100%;">';
//        html += '    <tr>';
//        html += '      <td style="width:90%;">';
//        html += '        <span style="color: #3f3f3f;font-size:30pt;font-weight:bold;">' + orgName + '</span>';
//        html += '      </td>';
//        html += '      <td style="width:9%;"></td>';
//        html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
//        html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'hideOrgEditorInACircle\', \'' + divisionIndex + '\', \'' + groupIndex + '\', \'' + entityIndex + '\', \'' + locationIndex + '\');">X</span>';
//        html += '      </td>';
//        html += '    </tr>';
//        html += '  </table>';
//        //html += '  <br /><br />';
//        html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';

//        //html += '<span style="color:blue;">' + orgName + '</span>';
//        //html += '<br />';



//        html += '<span id="spanDivRolePickerDropDown_OrgPath" style="color:purple;font-size:15pt;">';
//        html += orgPath;
//        html += '</span>';
//        html += '<br />';
//        html += '<br />';



//        html += '<span id="spanSelectedRolesInRolePickerDropdown"></span>';

//        var selectedRolesHtml = '';
//        if (roles && roles.length) {
//            for (var r = 0; r < roles.length; r++) {
//                if (roles[r].ParticipantIsDirty == true && roles[r].ParticipantIsDirtyAction == 'REMOVE') {
//                    // Do nothing. Don't display, this is just so that the user org role gets removed when published back to the server.
//                    selectedRolesHtml += '<span style="color:tomato;">';
//                    selectedRolesHtml += '*ROLE ' + roles[r].RoleName + ' (' + roles[r].RoleId + ') IS PENDING DELETION ON NEXT PUBLISH*';
//                    selectedRolesHtml += '</span>';
//                    selectedRolesHtml += '<br />';
//                } else {
//                    selectedRolesHtml += roles[r].RoleName + ' (' + roles[r].RoleId + ') - ' + '<span style="cursor:pointer;" title="' + roles[r].ParticipantEmail + '">' + roles[r].ParticipantFriendlyName + '</span>';
//                    var stepIndex = -1;
//                    var roleIndex = -1;
//                    selectedRolesHtml += '&nbsp;<img style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayPeoplePickerDialogForJson\', \'' + roles[r].RoleId + '\', \'' + roles[r].RoleName + '\', \'' + divisionIndex + '\', \'' + groupIndex + '\', \'' + entityIndex + '\', \'' + locationIndex + '\');" src="images/addressbook-icon18x18.png">';
//                    selectedRolesHtml += '<br />';
//                }
//            }
//        } else {
//            selectedRolesHtml += '<span style="color:tomato;">';
//            selectedRolesHtml += '*NO ROLES SPECIFIED FOR THIS ORG*';
//            selectedRolesHtml += '</span>';
//            selectedRolesHtml += '<br />';
//        }

//        $.ajax({
//            url: globalUrlPrefix + globalUrlForWebServices + "/odata/Roles/" + workflowAppId + "/" + participantId,
//            dataType: "json",
//            contentType: "application/json",
//            type: "Get",
//            timeout: ajaxTimeout
//        }).done(function (result) {
//            try {
//                console.log('In bwOrganizationEditor.js.renderOrgEditorInACircle().Get[odata/Roles].done().');
//                var car = result.workflow;
//                var roles2;
//                if (result) {
//                    roles2 = result.userRoles;
//                } else {
//                    console.log('In bwOrganizationEditor.js.renderOrgEditorInACircle().Get[odata/Roles].done: result: bad identifier here, please reword.. ' + JSON.stringify(result));
//                }

//                html += '<hr style="border-top: 1px dashed #95b1d3;" />'; // border-top: 1px dashed red;
//                html += '<span style="font-style:italic;">Add or remove roles by using the checkboxes:</span><br />';


//                // Iterate through the steps. Then the informs, then the assigns. Make an array of the roles. { RoleId, RoleName }
//                var workflowRoles = [];
//                for (var i = 0; i < car.Workflow.Steps.Step.length; i++) {
//                    var stepName = car.Workflow.Steps.Step[i]["@Name"];
//                    if (stepName == 'Create' || stepName == 'Revise' || stepName == 'Admin') {
//                        // Do nothing, not displaying these steps.
//                    } else {
//                        // Populate Inform roles.
//                        if (car.Workflow.Steps.Step[i].OnStart && car.Workflow.Steps.Step[i].OnStart.Inform) {
//                            if (car.Workflow.Steps.Step[i].OnStart.Inform.length > 0) {
//                                for (var j = 0; j < car.Workflow.Steps.Step[i].OnStart.Inform.length; j++) {
//                                    var isSelected = false;
//                                    if (roles) {
//                                        for (var r = 0; r < roles.length; r++) {
//                                            if (roles[r].RoleId == car.Workflow.Steps.Step[i].OnStart.Inform[j]["@Role"]) {
//                                                isSelected = true;
//                                            }
//                                        }
//                                    }
//                                    var shouldWeSaveThisRoleToTheArray = true;
//                                    var roleId = car.Workflow.Steps.Step[i].OnStart.Inform[j]["@Role"];
//                                    for (var x = 0; x < workflowRoles.length; x++) {
//                                        if (workflowRoles[x].RoleId == roleId) {
//                                            // It is already in the array, so don't save it.
//                                            shouldWeSaveThisRoleToTheArray = false;
//                                        }
//                                    }
//                                    if (shouldWeSaveThisRoleToTheArray) {
//                                        var roleName = car.Workflow.Steps.Step[i].OnStart.Inform[j]["@RoleName"];
//                                        var workflowRole = {
//                                            RoleId: roleId,
//                                            RoleName: roleName,
//                                            Selected: isSelected
//                                        };
//                                        workflowRoles.push(workflowRole);
//                                    }
//                                }
//                            }
//                        }
//                        // Populate Assign roles.
//                        if (car.Workflow.Steps.Step[i].Assign) {
//                            if (car.Workflow.Steps.Step[i].Assign.length > 0) {
//                                for (var j = 0; j < car.Workflow.Steps.Step[i].Assign.length; j++) {
//                                    var isSelected = false;
//                                    if (roles) {
//                                        for (var r = 0; r < roles.length; r++) {
//                                            if (roles[r].RoleId == car.Workflow.Steps.Step[i].Assign[j]["@Role"]) {
//                                                isSelected = true;
//                                            }
//                                        }
//                                    }
//                                    var shouldWeSaveThisRoleToTheArray = true;
//                                    var roleId = car.Workflow.Steps.Step[i].Assign[j]["@Role"];
//                                    for (var x = 0; x < workflowRoles.length; x++) {
//                                        if (workflowRoles[x].RoleId == roleId) {
//                                            // It is already in the array, so don't save it.
//                                            shouldWeSaveThisRoleToTheArray = false;
//                                        }
//                                    }
//                                    if (shouldWeSaveThisRoleToTheArray) {
//                                        var roleName = car.Workflow.Steps.Step[i].Assign[j]["@RoleName"];
//                                        var workflowRole = {
//                                            RoleId: roleId,
//                                            RoleName: roleName,
//                                            Selected: isSelected
//                                        };
//                                        workflowRoles.push(workflowRole);
//                                    }
//                                }
//                            }
//                        }
//                    }
//                }

//                // Sort alphabetically.
//                var prop = 'RoleId';
//                workflowRoles = workflowRoles.sort(function (a, b) {
//                    if (true) { //asc, false for desc.
//                        if (a[prop] > b[prop]) return 1;
//                        if (a[prop] < b[prop]) return -1;
//                        return 0;
//                    } else {
//                        if (b[prop] > a[prop]) return 1;
//                        if (b[prop] < a[prop]) return -1;
//                        return 0;
//                    }
//                });
//                // End: Sort alphabetically.

//                // Iterate through the "workflow" roles and display the ui.
//                html += '<div id="divRolePickerDropDown_RolesCheckboxes" style="overflow-y:auto;">'; // Scrollable div containing the available roles.
//                if (workflowRoles.length) {
//                    html += '<table>';
//                    for (var w = 0; w < workflowRoles.length; w++) {
//                        html += '<tr class="orgRow">';
//                        var isSelected = false;
//                        if (roles) {
//                            for (var r = 0; r < roles.length; r++) {
//                                if (roles[r].ParticipantIsDirty == true && roles[r].ParticipantIsDirtyAction == 'REMOVE') {
//                                    // Do nothing. Don't display, this is just so that the user org role gets removed when published back to the server.
//                                    html += '<span style="color:tomato;">';
//                                    html += '*ROLE ' + roles[r].RoleName + ' (' + roles[r].RoleId + ') IS PENDING DELETION ON NEXT PUBLISH*';
//                                    html += '</span>';
//                                    html += '<br />';
//                                } else {
//                                    if (roles[r].RoleId == workflowRoles[w].RoleId) {
//                                        isSelected = true;
//                                    }
//                                }
//                            }
//                        }
//                        if (isSelected) {
//                            html += '<td>xcx55<input id="' + 'orgRoleCheckbox_' + w + '" type="checkbox" checked onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'OrgRoleCheckbox_Onchange\', \'' + 'orgRoleCheckbox_' + w + '\', \'' + workflowRoles[w].RoleId + '\', \'' + workflowRoles[w].RoleName + '\', \'' + divisionIndex + '\', \'' + groupIndex + '\', \'' + entityIndex + '\', \'' + locationIndex + '\');" /></td>';
//                        } else {
//                            html += '<td>xcx56<input id="' + 'orgRoleCheckbox_' + w + '" type="checkbox" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'OrgRoleCheckbox_Onchange\', \'' + 'orgRoleCheckbox_' + w + '\', \'' + workflowRoles[w].RoleId + '\', \'' + workflowRoles[w].RoleName + '\', \'' + divisionIndex + '\', \'' + groupIndex + '\', \'' + entityIndex + '\', \'' + locationIndex + '\');" /></td>';
//                        }
//                        html += '<td class="roleId">' + workflowRoles[w].RoleId + '</td>';
//                        html += '<td>&nbsp;</td>';
//                        html += '<td class="roleName">' + workflowRoles[w].RoleName + '</td>';
//                        html += '</tr>';
//                    }
//                    html += '</table>';
//                } else {
//                    html += '<br />NO WORKFLOW ROLES TO DISPLAY!<br />';
//                }
//                html += '</div>';
//                html += '<br />';
//                html += '&nbsp;<input style="padding:5px 10px 5px 10px;" id="btnCreateRole2" type="button" value="New Role..." onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'displayCreateANewRoleDialog\');" />';

//                //
//                // This determines which button will be displayed... Add or Edit, etc.
//                //
//                if (locationIndex || locationIndex > -1) {
//                    html += '  <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;white-space:nowrap;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'editLocation\', \'' + divisionIndex + '\', \'' + groupIndex + '\', \'' + entityIndex + '\', \'' + locationIndex + '\');">✎<span style="text-decoration:underline;white-space:nowrap;">Edit</span></span>';
//                } else if (entityIndex || entityIndex > -1) {
//                    html += '  <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'editLegalEntity\', \'' + divisionIndex + '\', \'' + groupIndex + '\', \'' + entityIndex + '\');">✎<span style="text-decoration:underline;">Edit</span></span>';
//                } else if (groupIndex || groupIndex > -1) {
//                    html += '  <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'editGroup\', \'' + divisionIndex + '\', \'' + groupIndex + '\');">✎<span style="text-decoration:underline;">Edit</span></span>';
//                } else if (divisionIndex || divisionIndex > -1) {
//                    if (divisionIndex == 'root') {
//                        html += '&nbsp;<span title="Add a Division..." id="divisionsRootNode" style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;text-decoration:underline;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'addADivision\');"> ✚ Add a new Division</span>';
//                    } else {
//                        html += '  <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'editDivision\', \'' + divisionIndex + '\');">✎<span style="text-decoration:underline;">Edit</span></span>';
//                    }
//                } else {
//                    debugger;
//                    alert('Error: Unexpected parameter in renderOrgEditorInACircle():3:.');
//                }





//                document.getElementById('divRolePickerDropDown').innerHTML = html;

//                document.getElementById('spanSelectedRolesInRolePickerDropdown').innerHTML = selectedRolesHtml; // Display the selected roles.

//                var divRolePickerDropDown = document.getElementById('divRolePickerDropDown');
//                // When the user is done selecting a location, hide the location picker drop down.
//                //if (document.getElementById('divRolePickerDropDown').style.display == 'none') {
//                var width = '600px';
//                var height = '600px';

//                divRolePickerDropDown.style.width = width;
//                divRolePickerDropDown.style.height = height;
//                divRolePickerDropDown.style.display = 'block';
//                var spanElement = document.getElementById(originElementId);
//                var spanRect = spanElement.getBoundingClientRect(); //TABLE OFFSET // Should put the line in the middle of the row/tr tag.
//                var top = spanRect.bottom + window.pageYOffset;
//                var left = spanRect.left + window.pageXOffset;
//                divRolePickerDropDown.style.top = top + 'px';
//                divRolePickerDropDown.style.left = left + 'px';
//                // 
//                // This makes it show up on top and to not move the other elements around.
//                //document.getElementById('divLocationPickerDropDown').style.position = 'absolute';
//                //document.getElementById('divLocationPickerDropDown').style.zIndex = '10';
//                //}


//                //var tableElement = document.getElementById('tableOrgRoles1');
//                var tableElement = document.getElementById('tableOrgRoles2');
//                var height = tableElement.offsetHeight;
//                var width = tableElement.offsetWidth;

//                var canvas = document.getElementById("myCanvas");
//                canvas.style.zIndex = 11;
//                // The following resizes the bitmap from 300x150 to what we want. This prevents scaling of our drawing...
//                canvas.width = width;
//                canvas.height = height;
//                // End: bitmap stuff.
//                var ctx = canvas.getContext("2d");

//                // This circle encompasses divRolePickerDropDown
//                var masterTableRect = tableElement.getBoundingClientRect(); //TABLE OFFSET 
//                top = masterTableRect.top;
//                left = masterTableRect.left;
//                var rect = divRolePickerDropDown.getBoundingClientRect();
//                // The width of the dialog box/div:
//                var divWidth = rect.right - rect.left;
//                var radius = (divWidth * Math.sqrt(2)) / 2;
//                var divX = rect.left + ((rect.right - rect.left) / 2) - left;
//                var divY = rect.top + ((rect.bottom - rect.top) / 2) - top;

//                ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines

//                thiz.renderOrgRoleConnectorsToWorkflow(false, divisionIndex, groupIndex, entityIndex, locationIndex);

//                ctx.beginPath();
//                ctx.lineWidth = 3;
//                ctx.strokeStyle = '#95b1d3';
//                ctx.arc(divX, divY, radius, 0, 2 * Math.PI);
//                ctx.stroke();
//                ctx.fillStyle = 'white';
//                ctx.fill();

//                divRolePickerDropDown.style.border = '0px';
//                divRolePickerDropDown.style.zIndex = 12;

//                //.ui-widget-overlay {
//                //    opacity: 0.5;
//                //    filter: Alpha(Opacity=50);
//                //    background-color: black;
//                //}

//            } catch (e) {
//                //lpSpinner.Hide();
//                console.log('Exception in bwOrganizationEditor.js.renderOrgEditorInACircle().Get[odata/Orgs].done: ' + e.message + ', ' + e.stack);
//            }
//        }).fail(function (data) {
//            //lpSpinner.Hide();
//            var msg;
//            if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
//                msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
//            } else {
//                msg = JSON.stringify(data);
//            }
//            alert('Error in bwOrganizationEditor.js.renderOrgEditorInACircle().Get[odata/Orgs].fail: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
//            console.log('Error in bwOrganizationEditor.js.renderOrgEditorInACircle().Get[odata/Orgs].fail:' + JSON.stringify(data));
//            //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
//            //var error = JSON.parse(data.responseText)["odata.error"];
//            //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
//        });


//    } catch (e) {
//        console.log('Exception in bwOrganizationEditor.js.renderOrgEditorInACircle(): ' + e.message + ', ' + e.stack);
//    }
//},

displayADMINParticipantInCircleDialog: function () {
    try {
        // Display the ADMIN participant in a circle dialog. If the user clicks on the ADMIN role row, it will display the participant circle dialog for the person who is the ADMIN.
        console.log('In displayADMINParticipantInCircleDialog().');

        if (this.options.store.BwWorkflowUserRoleAdmin && this.options.store.BwWorkflowUserRoleAdmin.length == 1) {
            $('.bwAuthentication').bwAuthentication('displayParticipantRoleMultiPickerInACircle', true, '', '' + this.options.store.BwWorkflowUserRoleAdmin[0].bwParticipantId + '', '' + this.options.store.BwWorkflowUserRoleAdmin[0].bwParticipantFriendlyName + '', '' + this.options.store.BwWorkflowUserRoleAdmin[0].bwParticipantEmail + '', '' + this.options.store.BwWorkflowUserRoleAdmin[0].bwParticipantLogonType + '');
        }

    } catch (e) {
        console.log('Exception in displayADMINParticipantInCircleDialog(): ' + e.message + ', ' + e.stack);
    }
},

OrgRoleCheckbox_Onchange: function (checkboxId, roleId, roleName, divisionIndex, groupIndex, entityIndex, locationIndex, bwParticipantId, bwParticipantFriendlyName, bwParticipantEmail) {
    try {
        //
        // This is in the Participant Circle Dialog.
        //
        // We need to be able to reassign the ADMIN role here!!!
        //
        //
        //var identityJson = {
        //    bwParticipantId: bwParticipantId,
        //    bwParticipantFriendlyName: bwParticipantFriendlyName,
        //    bwParticipantEmail: bwParticipantEmail
        //};

        //debugger;
        console.log('In OrgRoleCheckbox_Onchange(). checkboxId: ' + checkboxId + ', roleId: ' + roleId + ', roleName: ' + roleName + ', divisionIndex: ' + divisionIndex + ', groupIndex: ' + groupIndex + ', entityIndex: ' + entityIndex + ', locationIndex: ' + locationIndex);
        var thiz = this;
        //alert('In bwParticipantsEditor.OrgRoleCheckbox_Onchange(). This functionality is IN PROGRESS. Expect unexpected results until testing is complete.');

        var thisCheckbox = document.getElementById(checkboxId);

        //
        if (roleId == 'ADMIN') {
            var bwParticipantFriendlyName_Admin;
            //var adminRoleMessage = '';
            //debugger;
            if (this.options.store.BwWorkflowUserRoleAdmin && this.options.store.BwWorkflowUserRoleAdmin.length == 1) {
                bwParticipantFriendlyName_Admin = this.options.store.BwWorkflowUserRoleAdmin[0].bwParticipantFriendlyName;
            }
            if (thisCheckbox.checked) {
                // The user will now become the ADMIN.
                //alert('' + bwParticipantFriendlyName_Admin + ' is currently the ADMIN. Are you certain you wish to re-assign this role to Todd Hiltz?');


                // ChangeAdminRoleDialog
                $("#ChangeAdminRoleDialog").dialog({
                    modal: true,
                    resizable: false,
                    closeText: "Cancel",
                    closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                    //title: 'Change the role for ' + userFriendlyName + '...',
                    width: "570px",
                    dialogClass: "no-close", // No close button in the upper right corner.
                    hide: false, // This means when hiding just disappear with no effects.
                    open: function (event, ui) {
                        $('.ui-widget-overlay').bind('click', function () { $("#ChangeAdminRoleDialog").dialog('close'); });
                        document.getElementById('spanChangeAdminRoleDialogContent').innerHTML = '' + bwParticipantFriendlyName_Admin + ' is currently the ADMIN. Are you certain you wish to re-assign this role to ' + bwParticipantFriendlyName + '?';
                        // 
                        document.getElementById('spanChangeAdminRoleDialogEmailMessageText').innerHTML = 'Send email notification to ' + bwParticipantFriendlyName + ' (' + bwParticipantEmail + '). You can include an additional message as well:';;

                        $('#btnChangeAdminRoleDialogChangeRole').bind('click', function () {

                            thiz.reassignAdminRole(bwParticipantId, bwParticipantFriendlyName, bwParticipantEmail, participantId, participantFriendlyName, participantEmail);
                            //debugger;
                            //    cmdChangeUserRoleAndSendEmail(userId, userFriendlyName, userEmail, logonType);
                            //    $("#ChangeUserRoleDialog").dialog('close');
                        });
                    }
                });
                // Hide the title bar.
                $("#ChangeAdminRoleDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();




            } else {
                // The user will no longer be the ADMIN.
                // We need to find the owner.
                var ownerId, ownerFriendlyName, ownerEmail;
                for (var i = 0; i < this.options.store.BwWorkflowUsers.length; i++) {
                    if (this.options.store.BwWorkflowUsers[i].bwParticipantRole == 'owner') {
                        ownerId = this.options.store.BwWorkflowUsers[i].bwParticipantId;
                        ownerFriendlyName = this.options.store.BwWorkflowUsers[i].bwParticipantFriendlyName;
                        ownerEmail = this.options.store.BwWorkflowUsers[i].bwParticipantEmail;
                    }
                }
                //alert('By removing Fred Flintstone from the ADMIN role, ' + ownerFriendlyName + ' (the owner of this budget request system) will assume ADMIN role responsibilities.');


                if (ownerId == bwParticipantId) {
                    alert('You cannot remove ' + bwParticipantFriendlyName + ' from the ADMIN role without assigning it to someone else. Assign the ADMIN role by choosing a different participant.');
                    $("#ChangeAdminRoleDialog").dialog('close');
                } else {
                    $("#ChangeAdminRoleDialog").dialog({
                        modal: true,
                        resizable: false,
                        closeText: "Cancel",
                        closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                        //title: 'Change the role for ' + userFriendlyName + '...',
                        width: "570px",
                        dialogClass: "no-close", // No close button in the upper right corner.
                        hide: false, // This means when hiding just disappear with no effects.
                        open: function (event, ui) {

                            $('.ui-widget-overlay').bind('click', function () { $("#ChangeAdminRoleDialog").dialog('close'); });
                            document.getElementById('spanChangeAdminRoleDialogContent').innerHTML = 'By removing ' + bwParticipantFriendlyName + ' from the ADMIN role, ' + ownerFriendlyName + ' (the owner of this budget request system) will assume ADMIN role responsibilities.';
                            //
                            document.getElementById('spanChangeAdminRoleDialogEmailMessageText').innerHTML = 'Send email notification to ' + ownerFriendlyName + ' (' + ownerEmail + '). You can include an additional message as well:';

                            $('#btnChangeAdminRoleDialogChangeRole').bind('click', function () {
                                thiz.reassignAdminRole(ownerId, ownerFriendlyName, ownerEmail, participantId, participantFriendlyName, participantEmail);
                            });
                        }
                    });
                    // Hide the title bar.
                    $("#ChangeAdminRoleDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
                }
            }
        } else {
            // ADMIN is a special case. Do all other changes here. The ADMIN is not in the JSON, only in the database table.
            debugger;


            if (thisCheckbox.checked) {
                // The user has added this role.
                var newRole = {
                    RoleId: roleId,
                    RoleName: roleName,
                    ParticipantId: null,
                    ParticipantFriendlyName: null,
                    ParticipantEmail: null
                };
                roles.push(newRole);
            } else {
                // The user has removed this role.
                for (var i = 0; i < roles.length; i++) {
                    if (roles[i].RoleId == roleId) {
                        //// Delete this role from the roles array!!
                        //roles.splice(i, 1);
                        // Mark this role to be deleted when published back to the server!
                        roles[i].ParticipantIsDirty = true;
                        roles[i].ParticipantIsDirtyAction = 'REMOVE';
                    }
                }
            }

            var json = this.options.store;
            var roles;
            if ((locationIndex && locationIndex != 'undefined') || locationIndex > -1) {
                if (!json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex].Roles) {
                    json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex]["Roles"] = [];
                }
                roles = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex].Roles;
            } else if ((entityIndex && entityIndex != 'undefined') || entityIndex > -1) {
                if (!json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Roles) {
                    json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex]["Roles"] = [];
                }
                roles = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Roles;
            } else if ((groupIndex && groupIndex != 'undefined') || groupIndex > -1) {
                if (!json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Roles) {
                    json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex]["Roles"] = [];
                }
                roles = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Roles;
            } else if ((divisionIndex && divisionIndex != 'undefined') || divisionIndex > -1) {
                if (divisionIndex == 'root') {
                    if (!json.Global.Roles) {
                        json.Global["Roles"] = [];
                    }
                    roles = json.Global.Roles;
                } else {
                    if (!json.Global.Divisions.Items[divisionIndex].Roles) {
                        json.Global.Divisions.Items[divisionIndex]["Roles"] = [];
                    }
                    roles = json.Global.Divisions.Items[divisionIndex].Roles;
                }
            } else {
                alert('Error: Unexpected parameter in OrgRoleCheckbox_Onchange():1:.');
            }
            var thisCheckbox = document.getElementById(checkboxId);
            if (thisCheckbox.checked) {
                // The user has added this role.
                var newRole = {
                    RoleId: roleId,
                    RoleName: roleName,
                    ParticipantId: null,
                    ParticipantFriendlyName: null,
                    ParticipantEmail: null
                };
                roles.push(newRole);
            } else {
                // The user has removed this role.
                for (var i = 0; i < roles.length; i++) {
                    if (roles[i].RoleId == roleId) {
                        //// Delete this role from the roles array!!
                        //roles.splice(i, 1);
                        // Mark this role to be deleted when published back to the server!
                        roles[i].ParticipantIsDirty = true;
                        roles[i].ParticipantIsDirtyAction = 'REMOVE';
                    }
                }
            }

            // Render.
            var html = '';
            if (roles && roles.length) {
                for (var r = 0; r < roles.length; r++) {
                    if (roles[r].ParticipantIsDirty == true && roles[r].ParticipantIsDirtyAction == 'REMOVE') {
                        // Do nothing. Don't display, this is just so that the user org role gets removed when published back to the server.
                        html += '<span style="color:tomato;">';
                        html += '*ROLE ' + roles[r].RoleName + ' (' + roles[r].RoleId + ') IS PENDING DELETION ON NEXT PUBLISH*';
                        html += '</span>';
                        html += '<br />';
                    } else {
                        html += roles[r].RoleName + ' (' + roles[r].RoleId + ') - ' + '<span style="cursor:pointer;" title="' + roles[r].ParticipantEmail + '">' + roles[r].ParticipantFriendlyName + '</span>';
                        var stepIndex = -1;
                        var roleIndex = -1;
                        html += '&nbsp;<img style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayPeoplePickerDialogForJson\', \'' + roles[r].RoleId + '\', \'' + roles[r].RoleName + '\', \'' + divisionIndex + '\', \'' + groupIndex + '\', \'' + entityIndex + '\', \'' + locationIndex + '\');" src="images/addressbook-icon18x18.png">';
                        html += '<br />';
                    }
                }
            } else {
                html += '<span style="color:tomato;">';
                html += '*NO ROLES SPECIFIED FOR THIS ORG*';
                html += '</span>';
                html += '<br />';
            }
            document.getElementById('spanSelectedRolesInRolePickerDropdown').innerHTML = html; // Display the selected roles.

            // Size adjustment so that the dialog stays in the circle height of 300px;
            var orgPathElement = document.getElementById('spanDivRolePickerDropDown_OrgPath'); // The org path breadcrumb. It varies in height.
            var orgPathRect = orgPathElement.getBoundingClientRect();
            var orgPathHeight = orgPathRect.bottom - orgPathRect.top;
            var selectedRolesElement = document.getElementById('spanSelectedRolesInRolePickerDropdown'); // This is the listing of selected roles at the top, which varies in height.
            var selectedRolesRect = selectedRolesElement.getBoundingClientRect();
            var selectedRolesHeight = selectedRolesRect.bottom - selectedRolesRect.top;
            //
            var height = 425 - orgPathHeight - selectedRolesHeight; // 600 // 400
            document.getElementById('divRolePickerDropDown_RolesCheckboxes').style.height = height + 'px';





            // Check if we need to display the publish button.
            this.checkIfWeHaveToDisplayThePublishChangesButton();
        }
    } catch (e) {
        console.log('Exception in OrgRoleCheckbox_Onchange(): ' + e.message + ', ' + e.stack);
    }
},
hideOrgEditorInACircle: function (divisionIndex, groupIndex, entityIndex, locationIndex) {
    try {
        console.log('In hideOrgEditorInACircle().');

        //var divRolePickerDropDown = document.getElementById('divRolePickerDropDown');
        var divRolePickerDropDown = document.getElementById('divCircleDialog1');
        divRolePickerDropDown.style.display = 'none';

        var canvas = document.getElementById("myCanvas");
        canvas.style.zIndex = -1; // Important to send it to back, otherwise the user won't be able to interact with the UI.
        var ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //alert('canvas.remove()');
        //$('canvas').remove();

        this.renderOrgRoleConnectorsToWorkflow(false, divisionIndex, groupIndex, entityIndex, locationIndex);

    } catch (e) {
        console.log('Exception in hideOrgEditorInACircle(): ' + e.message + ', ' + e.stack);
    }
},
drawLineFromOrgToWorkflowRole2: function (ctx, tableElement, width, height, roles, originElementId, divisionIndex, groupIndex, entityIndex, locationIndex) {
    try {
        //console.log('In drawLineFromOrgToWorkflowRole2(). roleId: ' + roleId);
        var json = this.options.store;
        var _x = 0;
        var _y = 0;
        var top, left;
        // Find the location of the CIO in the Workflow diagram.
        var elements = tableElement.getElementsByClassName('rolename');

        this.drawLineFromOrgToWorkflowRole3(ctx, elements, roles, originElementId, tableElement, this.options.color.Active); //'red');

        //
        // Crawl backwards through the ORG (to the top), looking for a matching RoleId. Go all the way to the top to ensure there aren't duplicates!!!
        //
        var originElementId;
        if (locationIndex || locationIndex > -1) {
            // Look at the parent Legal Entity.
            originElementId = 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex + '_' + entityIndex;
            var roles = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Roles;
            this.drawLineFromOrgToWorkflowRole3(ctx, elements, roles, originElementId, tableElement, this.options.color.LegalEntity2); //'#29685F'); // #29685F galapagos green
            // Look at the parent Group.
            originElementId = 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex;
            var roles = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Roles;
            this.drawLineFromOrgToWorkflowRole3(ctx, elements, roles, originElementId, tableElement, this.options.color.LegalEntity); //'#ff9900');
            // Look at the parent Division.
            originElementId = 'spanWorkflowPeoplePicker_' + divisionIndex;
            var roles = json.Global.Divisions.Items[divisionIndex].Roles;
            this.drawLineFromOrgToWorkflowRole3(ctx, elements, roles, originElementId, tableElement, this.options.color.Group); //'#ffff00');
            // Look at the root/Global.
            originElementId = 'spanWorkflowPeoplePicker_root';
            var roles = json.Global.Roles;
            this.drawLineFromOrgToWorkflowRole3(ctx, elements, roles, originElementId, tableElement, this.options.color.Global); //'#0066ff');
        } else if (entityIndex || entityIndex > -1) {
            // Look at the parent Group.
            originElementId = 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex;
            var roles = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Roles;
            this.drawLineFromOrgToWorkflowRole3(ctx, elements, roles, originElementId, tableElement, this.options.color.LegalEntity); // '#ff9900');
            // Look at the parent Division.
            originElementId = 'spanWorkflowPeoplePicker_' + divisionIndex;
            var roles = json.Global.Divisions.Items[divisionIndex].Roles;
            this.drawLineFromOrgToWorkflowRole3(ctx, elements, roles, originElementId, tableElement, this.options.color.Group); //'#ffff00');
            // Look at the root/Global.
            originElementId = 'spanWorkflowPeoplePicker_root';
            var roles = json.Global.Roles;
            this.drawLineFromOrgToWorkflowRole3(ctx, elements, roles, originElementId, tableElement, this.options.color.Global); //'#0066ff');
        } else if (groupIndex || groupIndex > -1) {
            // Look at the parent Division.
            originElementId = 'spanWorkflowPeoplePicker_' + divisionIndex;
            var roles = json.Global.Divisions.Items[divisionIndex].Roles;
            this.drawLineFromOrgToWorkflowRole3(ctx, elements, roles, originElementId, tableElement, this.options.color.Group); //'#ffff00');
            // Look at the root/Global.
            originElementId = 'spanWorkflowPeoplePicker_root';
            var roles = json.Global.Roles;
            this.drawLineFromOrgToWorkflowRole3(ctx, elements, roles, originElementId, tableElement, this.options.color.Global); //'#0066ff');
        } else if (divisionIndex || divisionIndex > -1) {
            if (divisionIndex == 'root') {
                // Do nothing, already at the root/Global node.
            } else {
                // Look at the root/Global.
                originElementId = 'spanWorkflowPeoplePicker_root';
                var roles = json.Global.Roles;
                this.drawLineFromOrgToWorkflowRole3(ctx, elements, roles, originElementId, tableElement, this.options.color.Global); //'#0066ff');
            }
        } else {
            debugger;
            alert('Error: Unexpected parameter in drawLineFromOrgToWorkflowRole2():2:.');
        }

    } catch (e) {
        console.log('Exception in drawLineFromOrgToWorkflowRole2(): ' + e.message + ', ' + e.stack);
    }
},
//drawLineFromOrgToWorkflowRoleAndHighlightOrg: function (ctx, originElementIdsAndRoles, lineColor, highlightColor) {
//    try {
//        console.log('In drawLineFromOrgToWorkflowRoleAndHighlightOrg().');
//        //var tableElement = document.getElementById('tableOrgRoles1');
//        var tableElement = document.getElementById('tableOrgRoles2');
//        //debugger;
//        for (var d = 0; d < originElementIdsAndRoles.length; d++) {
//            var drewALineForThisRole = false;
//            var elements = tableElement.getElementsByClassName('rolename');
//            var originElementId = originElementIdsAndRoles[d].originElementId;
//            var roles = originElementIdsAndRoles[d].roles;
//            var orgElementId = originElementIdsAndRoles[d].orgElementId; // We get this so we can highlight this org node in the treeview.
//            var orgElement = document.getElementById(orgElementId);
//            orgElement.style.color = highlightColor; //this.options.color.Active;
//            if (roles) {
//                for (var i = 0; i < roles.length; i++) {
//                    for (var x = 0; x < elements.length; x++) {
//                        if (elements[x].hasAttributes('bwroleid')) {
//                            var roleId2 = elements[x].getAttribute('bwroleid');
//                            if (roleId2 == roles[i].RoleId) {
//                                // Found it! Now get the row element.
//                                var thisRow = elements[x].closest('tr');
//                                var rect = thisRow.getBoundingClientRect();

//                                var masterTableRect = tableElement.getBoundingClientRect();
//                                var top = masterTableRect.top;
//                                var left = masterTableRect.left;

//                                _x = rect.left - left;
//                                _y = rect.top + ((rect.bottom - rect.top) / 2) - top;

//                                // Get the origin.
//                                var thisOrigin = document.getElementById(originElementId);
//                                var originRect = thisOrigin.getBoundingClientRect();
//                                var originY = originRect.top + ((originRect.bottom - originRect.top) / 2) - top;
//                                var originX = originRect.left - left;


//                                // Draw the line.
//                                ctx.beginPath(); // Always use beginPath() in order to have predictable behavior!!
//                                ctx.lineWidth = 1;
//                                ctx.strokeStyle = lineColor;
//                                ctx.moveTo(originX, originY); // This is where the line starts...
//                                ctx.lineTo(_x, _y); // This is the tr tag for the roleId in the workflow view.
//                                ctx.stroke();
//                                // Circle around the workflow diagram left roles-sides.
//                                ctx.beginPath();
//                                ctx.arc(_x, _y, 5, 0, 2 * Math.PI);
//                                //ctx.closePath();
//                                ctx.stroke();

//                                drewALineForThisRole = true;

//                                //console.log('DREW A LINE');

//                                // Now populate the participant, if available.
//                                var html = '';
//                                if (roles[i].ParticipantFriendlyName == null) {
//                                    html += '<span style="color:' + highlightColor + ';">';
//                                    html += 'No participant assigned. Is this true?';
//                                    html += '</span>';
//                                } else {
//                                    html += '<span style="color:' + highlightColor + ';">';
//                                    html += roles[i].ParticipantFriendlyName; // + '. Is this true?';
//                                    html += '</span>';
//                                }
//                                var participantCell = thisRow.getElementsByClassName('steprowbuttons')[0];
//                                participantCell.innerHTML = html;

//                                var roleNameCell = thisRow.getElementsByClassName('rolename')[0];
//                                roleNameCell.style.color = highlightColor; //'red';
//                            }
//                        }
//                    }
//                    if (!drewALineForThisRole) {
//                        // If we get here, it means that a role is specified that does NOT show up at this level in the workflow!!!!!!!
//                        alert('Error: Role "' + JSON.stringify(roles[i]) + '" is specified in the ORG but is not in the Workflow definition!');
//                    }
//                }
//            }
//        }
//    } catch (e) {
//        console.log('Exception in drawLineFromOrgToWorkflowRoleAndHighlightOrg(): ' + e.message + ', ' + e.stack);
//    }
//},
selectOrganizationalStructure_OnChange: function () {
    try {
        console.log('In selectOrganizationalStructure_OnChange().');
        var selectedValue = document.getElementById('selectOrganizationalStructure').value;


        alert('In selectOrganizationalStructure_OnChange(). selectedValue: ' + selectedValue + '. This functionality is incomplete. Coming soon!');
    } catch (e) {
        console.log('Exception in selectOrganizationalStructure_OnChange(): ' + e.message + ', ' + e.stack);
    }
},
collapseTree: function (instructions, divisionIndex, groupIndex, entityIndex) {
    try {
        console.log('In collapseTree().');

        if (instructions == 'collapsethisdivision') {
            // Todd: Incorporating instructions so we get this working 100%.
            debugger;




        }



        if (entityIndex || entityIndex > -1) {
            this.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Style = 'display:none;'; // Collapse!
            this._create();
        } else if (groupIndex || groupIndex > -1) {
            this.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Style = 'display:none;'; // Collapse!
            this._create();
        } else if (divisionIndex || divisionIndex > -1) {
            if (divisionIndex == 'root') {
                this.options.store.Global.Divisions.Style = 'display:none;'; // Collapse!
                this._create();
            } else {
                this.options.store.Global.Divisions.Items[divisionIndex].Groups.Style = 'display:none;'; // Collapse!
                this._create();
            }
        } else {
            debugger;
            alert('Error: Unexpected parameter in collapseTree().');
        }
    } catch (e) {
        console.log('Exception in collapseTree(): ' + e.message + ', ' + e.stack);
    }
},
expandTree: function (divisionIndex, groupIndex, entityIndex) {
    try {
        console.log('In expandTree().');
        if (entityIndex || entityIndex > -1) {
            this.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Style = 'display:block;'; // Expand!
            this._create();
        } else if (groupIndex || groupIndex > -1) {
            this.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Style = 'display:block;'; // Expand!
            this._create();
        } else if (divisionIndex || divisionIndex > -1) {
            if (divisionIndex == 'root') {
                this.options.store.Global.Divisions.Style = 'display:block;'; // Expand!
                this._create();
            } else {
                this.options.store.Global.Divisions.Items[divisionIndex].Groups.Style = 'display:block;'; // Expand!
                this._create();
            }
        } else {
            debugger;
            alert('Error: Unexpected parameter in expandTree().');
        }
    } catch (e) {
        console.log('Exception in expandTree(): ' + e.message + ', ' + e.stack);
    }
},
manageRaciRoles: function (divisionIndex, groupIndex, entityIndex) {
    try {
        console.log('In manageRaciRoles().');
        //alert('In manageRaciRoles(). This functionality is incomplete. Coming soon!');

        //$('.bwOrganizationEditor').bwOrganizationEditor('displayCreateANewRoleDialog');

        var availableRoles = ['Chief Financial Officer', 'Product Manager', 'Marketing Generalist', 'Sales Representative', 'Customer Support Representative', 'Business Development Manager', 'Chief Information Officer', 'Assistant Vice President', 'Vice President', 'Chief Marketing Officer', 'Chief Technology Officer', 'President', 'Chief Operating Officer', 'Chief Financial Officer', 'Chief Executive Officer', 'Project Manager', 'Project Sponsor', 'Accountant', 'Financial Analyst'];

        var html = '';
        html += '<table>';
        for (var i = 0; i < availableRoles.length; i++) {
            html += '<tr class="projectTypeRow">';
            // Iterate through the list to see if we have a selected one or not.
            var isSelected = false;
            //if (selectedProjectTypes) {
            //    for (var p = 0; p < selectedProjectTypes.split(',').length; p++) {
            //        if (availableProjectTypes[i].ProjectTypeId == selectedProjectTypes.split(',')[p]) {
            //            //console.log('availableProjectTypes[i].ProjectTypeId: ' + availableProjectTypes[i].ProjectTypeId + ', selectedProjectTypes.split(',')[p]: ' + selectedProjectTypes.split(',')[p]);
            //            isSelected = true;
            //        }
            //    }
            //}
            //if (isSelected) {
            //    html += '<td><input id="' + 'projectTypeCheckbox_' + i + '" type="checkbox" checked /></td>';
            //} else {
            html += '<td>xcx60-1<input id="' + 'roleCheckbox_' + i + '" type="checkbox" /></td>';
            //}
            html += '<td class="roleId">' + availableRoles[i] + '</td>';
            html += '<td>&nbsp;</td>';
            //html += '<td class="projectTypeName">' + availableProjectTypes[i].bwFunctionalAreaTitle + '</td>';
            html += '<td class="roleName"></td>';
            html += '</tr>';
        }
        html += '</table>';


        document.getElementById('spanRoleMultiPickerDialogContent').innerHTML = html;


        //$("#divRoleMultiPickerDialog2").dialog({
        //    modal: true,
        //    resizable: false,
        //    closeOnEscape: false, // Hit the ESC key to hide! Yeah!
        //    width: '800',
        //    dialogClass: 'no-close', // No close button in the upper right corner.
        //    hide: false, // This means when hiding just disappear with no effects.
        //    open: function () {
        //        $('.ui-widget-overlay').bind('click', function () {
        //            $('#divRoleMultiPickerDialog').dialog('close');
        //        });
        //    },
        //    close: function () {
        //        $('#divRoleMultiPickerDialog').dialog('destroy');
        //    }
        //});
        //$('#divRoleMultiPickerDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();




        $("#divRoleMultiPickerDialog2").dialog({
            modal: true,
            resizable: false,
            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
            width: '500',
            dialogClass: "no-close", // No close button in the upper right corner.
            hide: false, // This means when hiding just disappear with no effects.
            open: function () {
                $('.ui-widget-overlay').bind('click', function () {
                    $("#divRoleMultiPickerDialog2").dialog('close');
                });
            },
            close: function () {
                $('#divRoleMultiPickerDialog2').dialog('destroy');
            }
        });





    } catch (e) {
        console.log('Exception in manageRaciRoles(): ' + e.message + ', ' + e.stack);
    }
},
addADivision: function (elementId, divisionIndex, groupIndex, entityIndex) {
    try {
        console.log('In addADivision().');
        var thiz = this;
        document.getElementById('spanAddAnOrgItemDialogTitle').innerHTML = 'Add a new Division ◍';
        document.getElementById('divAddAnOrgItemDialogSubmitButton').innerHTML = 'Add the new Division ◍';

        document.getElementById('txtAddAnOrgItemDialogName').value = '';
        document.getElementById('txtAddANewPersonDialogAbbreviation').value = '';
        document.getElementById('txtAddANewPersonDialogId').value = '';

        //
        // ToDo: Add the click event to this Save button!
        //
        $("#divAddAnOrgItemDialog").dialog({
            modal: true,
            resizable: false,
            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
            width: '500',
            dialogClass: "no-close", // No close button in the upper right corner.
            hide: false, // This means when hiding just disappear with no effects.
            open: function () {
                $('.ui-widget-overlay').bind('click', function () {
                    $("#divAddAnOrgItemDialog").dialog('close');
                });
            },
            close: function () {
                $('#divAddAnOrgItemDialog').dialog('destroy');
            }
        });
        //$("#divAddAnOrgItemDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

        $('#divAddAnOrgItemDialogSubmitButton').off('click').click(function (error) {
            try {
                console.log('In addADivision.divAddAnOrgItemDialogSubmitButton.click().');
                var name = document.getElementById('txtAddAnOrgItemDialogName').value.trim();
                var abbreviation = document.getElementById('txtAddANewPersonDialogAbbreviation').value.trim();
                if (name.length > 4 && abbreviation.length > 1) {
                    // Save the new org entry.
                    var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                    //var active = document.getElementById('checkboxAddANewPersonDialogActive').checked;

                    var division = {
                        Name: name,
                        Abbreviation: abbreviation,
                        Id: guid,
                        Style: 'display:block;',
                        Groups: {
                            Style: 'display:block;',
                            Items: []
                        }
                    };
                    thiz.options.store.Global.Divisions.Items.push(division);
                    $("#divAddAnOrgItemDialog").dialog('close');
                    thiz.renderOrgRolesEditor();
                } else {
                    alert('Please enter a name (5 characters or more) and an abbreviation (2 characters or more).');
                }
            } catch (e) {
                console.log('Exception in divAddAnOrgItemDialogSubmitButton.click(): ' + e.message + ', ' + e.stack);
            }
        });
    } catch (e) {
        console.log('Exception in addADivision(): ' + e.message + ', ' + e.stack);
    }
},
addAGroup: function (elementId, divisionIndex, groupIndex, entityIndex) {
    try {
        console.log('In addAGroup(). elementId: ' + elementId);
        var thiz = this;
        document.getElementById('spanAddAnOrgItemDialogTitle').innerHTML = 'Add a new Group ✣';
        document.getElementById('divAddAnOrgItemDialogSubmitButton').innerHTML = 'Add the new Group ✣';

        document.getElementById('txtAddAnOrgItemDialogName').value = '';
        document.getElementById('txtAddANewPersonDialogAbbreviation').value = '';
        document.getElementById('txtAddANewPersonDialogId').value = '';

        //
        // ToDo: Add the click event to this Save button!
        //
        $("#divAddAnOrgItemDialog").dialog({
            modal: true,
            resizable: false,
            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
            width: '500',
            dialogClass: "no-close", // No close button in the upper right corner.
            hide: false, // This means when hiding just disappear with no effects.
            open: function () {
                $('.ui-widget-overlay').bind('click', function () {
                    $("#divAddAnOrgItemDialog").dialog('close');
                });
            },
            close: function () {
                $('#divAddAnOrgItemDialog').dialog('destroy');
            }
        });
        //$("#divAddAnOrgItemDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

        $('#divAddAnOrgItemDialogSubmitButton').off('click').click(function (error) {
            try {
                console.log('In addAGroup.divAddAnOrgItemDialogSubmitButton.click().');
                var name = document.getElementById('txtAddAnOrgItemDialogName').value.trim();
                var abbreviation = document.getElementById('txtAddANewPersonDialogAbbreviation').value.trim();
                if (name.length > 4 && abbreviation.length > 1) {
                    // Save the new org entry.
                    var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                    //var active = document.getElementById('checkboxAddANewPersonDialogActive').checked;

                    var group = {
                        Name: name,
                        Abbreviation: abbreviation,
                        Id: guid,
                        Style: 'display:block;',
                        LegalEntities: {
                            Style: 'display:block;',
                            Items: []
                        }
                    };
                    debugger;
                    thiz.options.store.Global.Divisions.Items[divisionIndex].Groups.Items.push(group);
                    $("#divAddAnOrgItemDialog").dialog('close');
                    thiz.renderOrgRolesEditor();
                } else {
                    alert('Please enter a name (5 characters or more) and an abbreviation (2 characters or more).');
                }
            } catch (e) {
                console.log('Exception in divAddAnOrgItemDialogSubmitButton.click(): ' + e.message + ', ' + e.stack);
            }
        });
    } catch (e) {
        console.log('Exception in addAGroup(): ' + e.message + ', ' + e.stack);
    }
},
addALegalEntity: function (elementId, divisionIndex, groupIndex, entityIndex) {
    try {
        console.log('In addALegalEntity(). elementId: ' + elementId);
        var thiz = this;
        document.getElementById('spanAddAnOrgItemDialogTitle').innerHTML = 'Add a new Legal Entity ⚖';
        document.getElementById('divAddAnOrgItemDialogSubmitButton').innerHTML = 'Add the new Legal Entity ⚖';

        document.getElementById('txtAddAnOrgItemDialogName').value = '';
        document.getElementById('txtAddANewPersonDialogAbbreviation').value = '';
        document.getElementById('txtAddANewPersonDialogId').value = '';

        //
        // ToDo: Add the click event to this Save button!
        //
        $("#divAddAnOrgItemDialog").dialog({
            modal: true,
            resizable: false,
            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
            width: '500',
            dialogClass: "no-close", // No close button in the upper right corner.
            hide: false, // This means when hiding just disappear with no effects.
            open: function () {
                $('.ui-widget-overlay').bind('click', function () {
                    $("#divAddAnOrgItemDialog").dialog('close');
                });
            },
            close: function () {
                $('#divAddAnOrgItemDialog').dialog('destroy');
            }
        });
        //$("#divAddAnOrgItemDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

        $('#divAddAnOrgItemDialogSubmitButton').off('click').click(function (error) {
            try {
                console.log('In addALegalEntity.divAddAnOrgItemDialogSubmitButton.click().');
                var name = document.getElementById('txtAddAnOrgItemDialogName').value.trim();
                var abbreviation = document.getElementById('txtAddANewPersonDialogAbbreviation').value.trim();
                if (name.length > 4 && abbreviation.length > 1) {
                    // Save the new org entry.
                    var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                    //var active = document.getElementById('checkboxAddANewPersonDialogActive').checked;

                    var legalentity = {
                        Name: name,
                        Abbreviation: abbreviation,
                        Id: guid,
                        Style: 'display:block;',
                        Locations: {
                            Style: 'display:block;',
                            Items: []
                        }
                    };
                    thiz.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items.push(legalentity);
                    $("#divAddAnOrgItemDialog").dialog('close');
                    thiz.renderOrgRolesEditor();
                } else {
                    alert('Please enter a name (5 characters or more) and an abbreviation (2 characters or more).');
                }
            } catch (e) {
                console.log('Exception in divAddAnOrgItemDialogSubmitButton.click(): ' + e.message + ', ' + e.stack);
            }
        });
    } catch (e) {
        console.log('Exception in addALegalEntity(): ' + e.message + ', ' + e.stack);
    }
},
addALocation: function (elementId, divisionIndex, groupIndex, entityIndex) {
    try {
        console.log('In addALocation(). elementId: ' + elementId);
        var thiz = this;
        document.getElementById('spanAddAnOrgItemDialogTitle').innerHTML = 'Add a new Location 🏠';
        document.getElementById('divAddAnOrgItemDialogSubmitButton').innerHTML = 'Add the new Location 🏠';

        document.getElementById('txtAddAnOrgItemDialogName').value = '';
        document.getElementById('txtAddANewPersonDialogAbbreviation').value = '';
        document.getElementById('txtAddANewPersonDialogId').value = '';

        //
        // ToDo: Add the click event to this Save button!
        //
        $("#divAddAnOrgItemDialog").dialog({
            modal: true,
            resizable: false,
            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
            width: '500',
            dialogClass: "no-close", // No close button in the upper right corner.
            hide: false, // This means when hiding just disappear with no effects.
            open: function () {
                $('.ui-widget-overlay').bind('click', function () {
                    $("#divAddAnOrgItemDialog").dialog('close');
                });
            },
            close: function () {
                $('#divAddAnOrgItemDialog').dialog('destroy');
            }
        });
        //$("#divAddAnOrgItemDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

        $('#divAddAnOrgItemDialogSubmitButton').off('click').click(function (error) {
            try {
                console.log('In addALocation.divAddAnOrgItemDialogSubmitButton.click().');
                var name = document.getElementById('txtAddAnOrgItemDialogName').value.trim();
                var abbreviation = document.getElementById('txtAddANewPersonDialogAbbreviation').value.trim();
                if (name.length > 4 && abbreviation.length > 1) {
                    // Save the new org entry.
                    var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                    //var active = document.getElementById('checkboxAddANewPersonDialogActive').checked;

                    var location = {
                        Name: name,
                        Abbreviation: abbreviation,
                        Id: guid,
                        Style: 'display:block;'
                    };
                    thiz.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items.push(location);
                    $("#divAddAnOrgItemDialog").dialog('close');
                    thiz.renderOrgRolesEditor();
                } else {
                    alert('Please enter a name (5 characters or more) and an abbreviation (2 characters or more).');
                }
            } catch (e) {
                console.log('Exception in divAddAnOrgItemDialogSubmitButton.click(): ' + e.message + ', ' + e.stack);
            }
        });
    } catch (e) {
        console.log('Exception in addALocation(): ' + e.message + ', ' + e.stack);
    }
},
editDivision: function (divisionIndex, groupIndex, entityIndex) {
    try {
        console.log('In editDivision().');
        var thiz = this;
        document.getElementById('spanAddAnOrgItemDialogTitle').innerHTML = 'Edit Division';
        document.getElementById('divAddAnOrgItemDialogSubmitButton').innerHTML = 'Save';

        document.getElementById('txtAddAnOrgItemDialogName').value = this.options.store.Global.Divisions.Items[divisionIndex].Name;
        document.getElementById('txtAddANewPersonDialogAbbreviation').value = this.options.store.Global.Divisions.Items[divisionIndex].Abbreviation;
        document.getElementById('txtAddANewPersonDialogId').value = this.options.store.Global.Divisions.Items[divisionIndex].Id;

        //
        // ToDo: Add the click event to this button!
        //
        $("#divAddAnOrgItemDialog").dialog({
            modal: true,
            resizable: false,
            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
            width: '500',
            dialogClass: "no-close", // No close button in the upper right corner.
            hide: false, // This means when hiding just disappear with no effects.
            open: function () {
                $('.ui-widget-overlay').bind('click', function () {
                    $("#divAddAnOrgItemDialog").dialog('close');
                });
            },
            close: function () {
                $('#divAddAnOrgItemDialog').dialog('destroy');
            }
        });
        //$("#divAddAnOrgItemDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

        $('#divAddAnOrgItemDialogSubmitButton').off('click').click(function (error) {
            try {
                console.log('In editDivision.divAddAnOrgItemDialogSubmitButton.click().');
                var name = document.getElementById('txtAddAnOrgItemDialogName').value.trim();
                var abbreviation = document.getElementById('txtAddANewPersonDialogAbbreviation').value.trim();
                if (name.length > 4 && abbreviation.length > 1) {
                    // Save the new org entry.
                    var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                    //var active = document.getElementById('checkboxAddANewPersonDialogActive').checked;

                    thiz.options.store.Global.Divisions.Items[divisionIndex].Name = name;
                    thiz.options.store.Global.Divisions.Items[divisionIndex].Abbreviation = abbreviation;
                    $("#divAddAnOrgItemDialog").dialog('close');
                    thiz.renderOrgRolesEditor();
                } else {
                    alert('Please enter a name (5 characters or more) and an abbreviation (2 characters or more).');
                }
            } catch (e) {
                console.log('Exception in divAddAnOrgItemDialogSubmitButton.click(): ' + e.message + ', ' + e.stack);
            }
        });
    } catch (e) {
        console.log('Exception in editDivision(): ' + e.message + ', ' + e.stack);
    }
},
editGroup: function (divisionIndex, groupIndex, entityIndex) {
    try {
        console.log('In editGroup().');
        var thiz = this;
        document.getElementById('spanAddAnOrgItemDialogTitle').innerHTML = 'Edit Group';
        document.getElementById('divAddAnOrgItemDialogSubmitButton').innerHTML = 'Save';

        document.getElementById('txtAddAnOrgItemDialogName').value = this.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Name;
        document.getElementById('txtAddANewPersonDialogAbbreviation').value = this.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Abbreviation;
        document.getElementById('txtAddANewPersonDialogId').value = this.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Id;

        //
        // ToDo: Add the click event to this button!
        //
        $("#divAddAnOrgItemDialog").dialog({
            modal: true,
            resizable: false,
            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
            width: '500',
            dialogClass: "no-close", // No close button in the upper right corner.
            hide: false, // This means when hiding just disappear with no effects.
            open: function () {
                $('.ui-widget-overlay').bind('click', function () {
                    $("#divAddAnOrgItemDialog").dialog('close');
                });
            },
            close: function () {
                $('#divAddAnOrgItemDialog').dialog('destroy');
            }
        });
        //$("#divAddAnOrgItemDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

        $('#divAddAnOrgItemDialogSubmitButton').off('click').click(function (error) {
            try {
                console.log('In editGroup.divAddAnOrgItemDialogSubmitButton.click().');
                var name = document.getElementById('txtAddAnOrgItemDialogName').value.trim();
                var abbreviation = document.getElementById('txtAddANewPersonDialogAbbreviation').value.trim();
                if (name.length > 4 && abbreviation.length > 1) {
                    // Save the new org entry.
                    var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                    //var active = document.getElementById('checkboxAddANewPersonDialogActive').checked;

                    thiz.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Name = name;
                    thiz.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Abbreviation = abbreviation;
                    $("#divAddAnOrgItemDialog").dialog('close');
                    thiz.renderOrgRolesEditor();
                } else {
                    alert('Please enter a name (5 characters or more) and an abbreviation (2 characters or more).');
                }
            } catch (e) {
                console.log('Exception in divAddAnOrgItemDialogSubmitButton.click(): ' + e.message + ', ' + e.stack);
            }
        });
    } catch (e) {
        console.log('Exception in editGroup(): ' + e.message + ', ' + e.stack);
    }
},
editLegalEntity: function (divisionIndex, groupIndex, entityIndex) {
    try {
        console.log('In editLegalEntity().');
        var thiz = this;
        document.getElementById('spanAddAnOrgItemDialogTitle').innerHTML = 'Edit Legal Entity';
        document.getElementById('divAddAnOrgItemDialogSubmitButton').innerHTML = 'Save';

        document.getElementById('txtAddAnOrgItemDialogName').value = this.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Name;
        document.getElementById('txtAddANewPersonDialogAbbreviation').value = this.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Abbreviation;
        document.getElementById('txtAddANewPersonDialogId').value = this.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Id;

        //
        // ToDo: Add the click event to this button!
        //
        $("#divAddAnOrgItemDialog").dialog({
            modal: true,
            resizable: false,
            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
            width: '500',
            dialogClass: "no-close", // No close button in the upper right corner.
            hide: false, // This means when hiding just disappear with no effects.
            open: function () {
                $('.ui-widget-overlay').bind('click', function () {
                    $("#divAddAnOrgItemDialog").dialog('close');
                });
            },
            close: function () {
                $('#divAddAnOrgItemDialog').dialog('destroy');
            }
        });
        //$("#divAddAnOrgItemDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

        $('#divAddAnOrgItemDialogSubmitButton').off('click').click(function (error) {
            try {
                console.log('In editLegalEntity.divAddAnOrgItemDialogSubmitButton.click().');
                var name = document.getElementById('txtAddAnOrgItemDialogName').value.trim();
                var abbreviation = document.getElementById('txtAddANewPersonDialogAbbreviation').value.trim();
                if (name.length > 4 && abbreviation.length > 1) {
                    // Save the new org entry.
                    var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                    //var active = document.getElementById('checkboxAddANewPersonDialogActive').checked;

                    thiz.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Name = name;
                    thiz.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Abbreviation = abbreviation;
                    $("#divAddAnOrgItemDialog").dialog('close');
                    thiz.renderOrgRolesEditor();
                } else {
                    alert('Please enter a name (5 characters or more) and an abbreviation (2 characters or more).');
                }
            } catch (e) {
                console.log('Exception in divAddAnOrgItemDialogSubmitButton.click(): ' + e.message + ', ' + e.stack);
            }
        });
    } catch (e) {
        console.log('Exception in editLegalEntity(): ' + e.message + ', ' + e.stack);
    }
},
editLocation: function (divisionIndex, groupIndex, entityIndex, locationIndex1) {
    try {
        console.log('In editLocation().');
        var thiz = this;
        document.getElementById('spanAddAnOrgItemDialogTitle').innerHTML = 'Edit Location';
        document.getElementById('divAddAnOrgItemDialogSubmitButton').innerHTML = 'Save';
        //debugger;
        document.getElementById('txtAddAnOrgItemDialogName').value = this.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex1].Name;
        document.getElementById('txtAddANewPersonDialogAbbreviation').value = this.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex1].Abbreviation;
        document.getElementById('txtAddANewPersonDialogId').value = this.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex1].Id;

        //
        // ToDo: Add the click event to this button!
        //
        $("#divAddAnOrgItemDialog").dialog({
            modal: true,
            resizable: false,
            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
            width: '500',
            dialogClass: "no-close", // No close button in the upper right corner.
            hide: false, // This means when hiding just disappear with no effects.
            open: function () {
                $('.ui-widget-overlay').bind('click', function () {
                    $("#divAddAnOrgItemDialog").dialog('close');
                });
            },
            close: function () {
                $('#divAddAnOrgItemDialog').dialog('destroy');
            }
        });
        //$("#divAddAnOrgItemDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

        $('#divAddAnOrgItemDialogSubmitButton').off('click').click(function (error) {
            try {
                console.log('In editLocation.divAddAnOrgItemDialogSubmitButton.click().');
                var name = document.getElementById('txtAddAnOrgItemDialogName').value.trim();
                var abbreviation = document.getElementById('txtAddANewPersonDialogAbbreviation').value.trim();
                if (name.length > 4 && abbreviation.length > 1) {
                    // Save the new org entry.
                    var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                    //var active = document.getElementById('checkboxAddANewPersonDialogActive').checked;

                    thiz.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex1].Name = name;
                    thiz.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex1].Abbreviation = abbreviation;
                    $("#divAddAnOrgItemDialog").dialog('close');
                    thiz.renderOrgRolesEditor();
                } else {
                    alert('Please enter a name (5 characters or more) and an abbreviation (2 characters or more).');
                }
            } catch (e) {
                console.log('Exception in divAddAnOrgItemDialogSubmitButton.click(): ' + e.message + ', ' + e.stack);
            }
        });
    } catch (e) {
        console.log('Exception in editLocation(): ' + e.message + ', ' + e.stack);
    }
},

displayCreateANewRoleDialog: function () {
    try {
        console.log('In displayCreateANewRoleDialog().');
        $("#divCreateANewRoleDialog").dialog({
            modal: true,
            resizable: false,
            //closeText: "Cancel",
            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
            title: 'Create a new Role',
            width: '800',
            dialogClass: "no-close", // No close button in the upper right corner.
            hide: false, // This means when hiding just disappear with no effects.
            open: function () {
                $('.ui-widget-overlay').bind('click', function () {
                    $("#divCreateANewRoleDialog").dialog('close');
                });
                //document.getElementById('txtCreateANewRoleDialog_RoleId').value = document.getElementById('textNewRoleId').value;
                //document.getElementById('txtCreateANewRoleDialog_RoleName').value = document.getElementById('textNewRoleName').value;
            },
            close: function () {
                $('#divCreateANewRoleDialog').dialog('destroy');
            }
        });
        $("#divCreateANewRoleDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();


    } catch (e) {
        console.log('Exception in displayCreateANewRoleDialog(): ' + e.message + ', ' + e.stack);
    }
},

renderEditSteprow: function (elementId) {
    try {
        console.log('In renderEditSteprow().');
        var thiz = this;
        //thiz.showProgress('Loading...');
        $('.activeEditRow').remove(); // This gets rid of the row editor... we should only display one at a time.
        $('.steprow-hidden').removeClass('steprow-hidden'); // Display the previous row again (if there is one).
        // Get the values from the hidden row.
        var roleid = $('#' + elementId).find('.roleid').attr('bwOldValue');
        var rolename = $('#' + elementId).find('.rolename').attr('bwOldValue');
        var rolecategory = $('#' + elementId).find('.rolecategory').attr('bwOldValue');
        var tasks = $('#' + elementId).find('.tasks').attr('bwOldValue');
        var timeout = $('#' + elementId).find('.timeout').attr('bwOldValue');
        var cond = $('#' + elementId).find('.cond').attr('bwOldValue');
        console.log('In renderEditSteprow. roleid: ' + roleid + ', rolename: ' + rolename + ', rolecategory: ' + rolecategory + ', tasks: ' + tasks + ', timeout: ' + timeout + ', cond: ' + cond);
        //
        var html = '';
        html += '<tr class="activeEditRow">';
        //
        html += '<td style="width:30px;"></td>';
        //html += '<td style="vertical-align:top;">';

        //html += '  <table style="width:100%;">';
        //html += '  <tr>';
        //html += '    <td>';
        //html += '      <input type="button" style="width:100%;" value="Save" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveAssignmentRow\', \'' + elementId + '\');" />';
        //html += '    </td>';
        //html += '  </tr>';
        //html += '  <tr>';
        //html += '    <td>';
        //html += '      <input type="button" style="width:100%;" value="Delete" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'deleteRoleCategory\', \'' + elementId + '\');" />';
        //html += '    </td>';
        //html += '  </tr>';
        //html += '  <tr>';
        //html += '    <td>';
        //html += '      <input type="button" style="width:100%;" value="Cancel" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'cancelStepRowEditing\', \'' + elementId + '\');" />';
        //html += '    </td>';
        //html += '  </tr>';
        //html += '  <tr>';
        //html += '    <td>';
        //html += '      <input type="button" style="width:100px;white-space:normal;overflow-wrap:break-word;" value="Configure Email Notifications" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayConfigureEmailNotificationsDialog\', \'' + elementId + '\');" />';
        //html += '    </td>';
        //html += '  </tr>';
        //html += '  </table>';

        //html += '</td>';
        //

        if (thiz.options.displayRoleIdColumn) {
            html += '<td class="steprowcell">' + roleid + '</td>';
        }





        html += '<td class="selectroleorperson-editcell steprowcell">';
        //html += ' <img style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayPeoplePickerDialog\', \'' + 'txtApprover2FriendlyName' + '\', \'' + 'txtApprover2Id' + '\', \'' + 'txtApprover2Email' + '\');" src="images/addressbook-icon18x18.png">';
        //html += '&nbsp;' + rolename;
        html += '</td>';







        // Render the "RoleCategory" drop-down.
        html += '<td class="steprowcell">';
        html += '<select style="padding:5px 5px 5px 5px;" id="selectRoleCategory" class="rolecategory-dropdown" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'RoleCategoryDropDown_Onchange\', \'' + elementId + '\');">';
        var rcs = ['Inform', 'Collaborator', 'Approver'];
        var rcs2 = ['Inform (Informed)', 'Collaborator (Consulted)', 'Approver (Accountable)'];
        for (var rci = 0; rci < rcs.length; rci++) {
            if (rolecategory == rcs[rci]) {
                html += '  <option value="' + rcs[rci] + '" selected>' + rcs2[rci] + '</option>';
            } else {
                html += '  <option value="' + rcs[rci] + '">' + rcs2[rci] + '</option>';
            }
        }
        html += '</select>';
        html += '</td>';

        html += '<td class="actions-editcell steprowcell"></td>';
        // This gets render below using thiz.renderActionsSection(); It gets populated there as well.

        //html += '<td></td>';
        //html += '<td></td>';
        //html += '<td></td>';
        //html += '<td></td>';

        //html += '<td class="timeout-editcell steprowcell"></td>';

        html += '<td class="conditions-editcell steprowcell"></td>';

        html += '<td style="vertical-align:top;">';

        html += '  <table style="width:100%;">';
        html += '  <tr>';
        html += '    <td>';
        html += '      <input type="button" style="width:100%;" value="Save" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveAssignmentRow\', \'' + elementId + '\');" />';
        html += '    </td>';
        html += '  </tr>';
        html += '  <tr>';
        html += '    <td>';
        html += '      <input type="button" style="width:100%;" value="Delete" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'deleteRoleCategory\', \'' + elementId + '\');" />';
        html += '    </td>';
        html += '  </tr>';
        html += '  <tr>';
        html += '    <td>';
        html += '      <input type="button" style="width:100%;" value="Cancel" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'cancelStepRowEditing\', \'' + elementId + '\');" />';
        html += '    </td>';
        html += '  </tr>';
        //html += '  <tr>';
        //html += '    <td>';
        //html += '      <input type="button" style="width:100px;white-space:normal;overflow-wrap:break-word;" value="Configure Email Notifications" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayConfigureEmailNotificationsDialog\', \'' + elementId + '\');" />';
        //html += '    </td>';
        //html += '  </tr>';
        html += '  </table>';

        html += '</td>';

        html += '</tr>';

        //var elementId = element.id;
        thiz.disableScrolling(); // This keeps the screen from jumping around.

        $('#' + elementId).closest('tr').after(html); // Render the whole thing




        thiz.renderSelectRoleOrPersonSection(elementId);




        // BEGIN: Populate the actions section (check the checkboxes).
        thiz.renderActionsSection(elementId); // render the actions section
        if (rolecategory == 'Approver') { // Populate the actions ection
            var actions = ['Approve', 'Cancel', 'Decline', 'Revise/Hold'];
            var x = elementId.split('_')[1];
            var step = x.split('_')[0];
            var row = elementId.split('_')[2];
            for (var i = 0; i < actions.length; i++) {
                var actionChecked = false;
                var requireCommentsChecked = false;
                if (tasks) {
                    for (var t = 0; t < tasks.split('|').length; t++) {
                        var x = tasks.split('|')[t];
                        var task = x.split('~')[0];
                        var requireComments = x.split('~')[1];
                        if (task == actions[i]) {
                            actionChecked = true;
                            if (requireComments && Boolean(requireComments.toLowerCase()) == true) {
                                requireCommentsChecked = true;
                            }
                        }
                    }
                }

                var checkboxId = 'Action-' + actions[i] + '_' + step + '_' + row;
                var childCheckboxId = 'RequireComments-' + actions[i] + '_' + step + '_' + row;
                if (actionChecked) {
                    document.getElementById(checkboxId).checked = true;
                    if (requireCommentsChecked) {
                        document.getElementById(childCheckboxId).checked = true;
                    }
                } else {
                    document.getElementById(checkboxId).checked = false;
                    document.getElementById(childCheckboxId).checked = false;
                }
            }
        }
        // END: Render and Populate the actions section

        //thiz.renderTimeoutSection(elementId);
        //debugger;
        thiz.renderConditionsSection(elementId, cond);

        $('#' + elementId).addClass('steprow-hidden'); // Hide the row while we display it in editable-mode. This allows us to display it again when done editng, and also gives us a place to look up the old values.
        thiz.enableScrolling(); // This keeps the screen from jumping around.
        //thiz.hideProgress();



    } catch (e) {
        console.log('Exception in renderEditSteprow(): ' + e.message + ', ' + e.stack);
    }
},







displayAddANewPersonDialog: function () {
    try {
        console.log('In displayAddANewPersonDialog().');
        if (!participantId) {
            console.log('In displayAddANewPersonDialog(). User is not logged in, so displaying the logon.');
            initializeTheLogon(); // The user needs to be logged in before they add anyone.
        } else {
            $("#divAddANewPersonDialog").dialog({
                modal: true,
                resizable: false,
                //closeText: "Cancel",
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                title: 'Add a New Person',
                width: '800',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divAddANewPersonDialog").dialog('close');
                    });
                    //document.getElementById('txtCreateANewRoleDialog_RoleId').value = document.getElementById('textNewRoleId').value;
                    //document.getElementById('txtCreateANewRoleDialog_RoleName').value = document.getElementById('textNewRoleName').value;
                },
                close: function () {
                    //$(this).dialog('destroy').remove();
                }
            });
            $("#divAddANewPersonDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
        }
    } catch (e) {
        console.log('Exception in displayAddANewPersonDialog(): ' + e.message + ', ' + e.stack);
    }
},
//createANewRole: function () {
//    try {
//        console.log('In createANewRole().');
//        // Make sure the RoleId is 2 or more charcaters. Make sure the RoleName is longer than 5 characters.
//        var thiz = this;
//        var roleId = document.getElementById('txtCreateANewRoleDialog_RoleId').value;
//        var roleName = document.getElementById('txtCreateANewRoleDialog_RoleName').value;
//        if (roleId && roleName) {
//            if (roleId.length > 1 && roleName.length > 4) {
//                // Ajax call to save the new role.
//                var json = {
//                    RoleId: roleId,
//                    RoleName: roleName,
//                    RoleBits: 17,
//                    IsWorkflowRole: true
//                };
//                $.ajax({
//                    url: thiz.options.operationUriPrefix + "odata/Roles",
//                    dataType: "json",
//                    contentType: "application/json",
//                    type: "Post",
//                    data: JSON.stringify(json)
//                }).done(function (result) {
//                    try {
//                        console.log('In raci.html.createANewRole().xx.update: Successfully updated DB.');
//                        $("#divMessageDialog").dialog({
//                            modal: true,
//                            resizable: false,
//                            //closeText: "Cancel",
//                            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
//                            //title: 'Project Type picker',
//                            width: '800',
//                            dialogClass: 'no-close', // No close button in the upper right corner.
//                            hide: false, // This means when hiding just disappear with no effects.
//                            open: function () {
//                                $("#divCreateANewRoleDialog").dialog('close');
//                                $('.ui-widget-overlay').bind('click', function () {
//                                    $('#divMessageDialog').dialog('close');
//                                });
//                                document.getElementById('spanMessageDialogTitle').innerHTML = 'Role CREATED';
//                                document.getElementById('spanMessageDialogContentTop').innerHTML = 'This role has been created. Your screen will refresh, and the new role will be immediately available.';
//                                document.getElementById('spanMessageDialogContentBottom').innerHTML = 'This role has no users assigned to it. You must do this before any new CARs are processed by this role.';
//                            },
//                            close: function () {
//                                location.reload(); // When the user closes this dialog, we regenerate the screen to reflect the newly created and activated workflow.
//                            }
//                        });
//                        $('#divMessageDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
//                    } catch (e) {
//                        console.log('Exception in raci.html.createANewRole().xx.update: ' + e.message + ', ' + e.stack);
//                    }
//                }).fail(function (data) {
//                    //thiz.hideProgress();
//                    var msg;
//                    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
//                        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
//                    } else {
//                        msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
//                    }
//                    alert('Fail in raci.html.createANewRole().xx.update: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
//                    console.log('Fail in raci.html.createANewRole().xx.update: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
//                    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
//                    //var error = JSON.parse(data.responseText)["odata.error"];
//                    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
//                });
//            } else {
//                alert('ERROR: Cannot save these values. RoleId must be 2 or more characters, and RoleName must be 5 or more charcters.');
//            }
//        } else {
//            alert('ERROR: Cannot save these values. RoleId must be 2 or more characters, and RoleName must be 5 or more charcters.');
//        }
//    } catch (e) {
//        console.log('Exception in createANewRole(): ' + e.message + ', ' + e.stack);
//    }
//},
addARaciStep: function () {
    try {
        console.log('InaddARaciStep().');
        //var newStepCount = 0;
        //for (var i = 0; i < this.options.store.RaciSteps.length; i++) {
        //    if (this.options.store.RaciSteps[i].StepName == ('NewStep' + newStepCount)) {
        //        newStepCount++;
        //    }
        //}
        var stepGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });

        var step = {
            StepName: "NewStep-" + stepGuid,
            InformRoles: [
                {
                    RoleId: 'Choose a role...',
                    RoleName: 'Choose a role...',
                    IdField: ''
                }
            ],
            AssignRoles: [
                {
                    RoleId: 'Choose a role...',
                    RoleName: 'Choose a role...',
                    RoleCategory: 'Choose a role category...',
                    Participants: [
                        {
                            UserId: 0,
                            UserName: 'Choose a user...',
                            UserEmail: 'Choose a user'
                        }]
                }
            ]
        };
        this.options.store.RaciSteps.push(step);

        //alert('In addARaciStep(). this.options.store: ' + JSON.stringify(this.options.store));

        this._create();
    } catch (e) {
        console.log('Exception in addARaciStep(): ' + e.message + ', ' + e.stack);
    }
},
addNewRow: function (elementId) {
    try {
        console.log('In addNewRow(). elementId: ' + elementId);
        //this.disableButton('buttonAddNewAssignmentRow');
        var thiz = this;
        var x = elementId.split('_')[0];
        var stepIndex = elementId.split('_')[1]; // eg: 3
        var roleIndex = elementId.split('_')[2]; // eg: 8
        this.cancelStepRowEditing(elementId); // This cancels the diting row from a previous edit. There can only be one at a time.
        var html = '';
        html += '<tr class="activeEditRow">'; // activeEditRow lets us determin what is being edited, and be able to close/remove them all at once when we want to.


        //html += '<td style="vertical-align:top;">';

        ////html += '  <table style="width:100%;">';
        ////html += '  <tr>';
        ////html += '    <td>';
        ////html += '      <input type="button" style="width:100%;" value="Save" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveAssignmentRow\', \'' + elementId + '\', \'' + 'xx' + '\');" />';
        ////html += '    </td>';
        ////html += '  </tr>';
        ////html += '  <tr>';
        ////html += '    <td>';
        ////html += '      <input type="button" style="width:100%;" value="Cancel" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'cancelStepRowEditing\', \'' + elementId + '\', \'' + 'xx' + '\');" />';
        ////html += '    </td>';
        ////html += '  </tr>';
        ////html += '  </table>';

        //html += '  <table style="width:100%;">';
        //html += '  <tr>';
        //html += '    <td>';
        //html += '      <input type="button" style="width:100%;" value="Save" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveAssignmentRow\', \'' + elementId + '\');" />';
        //html += '    </td>';
        //html += '  </tr>';
        ////html += '  <tr>';
        ////html += '    <td>';
        ////html += '      <input type="button" style="width:100%;" value="Delete" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'deleteRoleCategory\', \'' + elementId + '\');" />';
        ////html += '    </td>';
        ////html += '  </tr>';
        //html += '  <tr>';
        //html += '    <td>';
        //html += '      <input type="button" style="width:100%;" value="Cancel" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'cancelStepRowEditing\', \'' + elementId + '\');" />';
        //html += '    </td>';
        //html += '  </tr>';
        //html += '  <tr>';
        //html += '    <td>';
        //html += '      <input type="button" style="width:100px;white-space:normal;overflow-wrap:break-word;" value="Configure Email Notifications" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayConfigureEmailNotificationsDialog\', \'' + elementId + '\');" />';
        //html += '    </td>';
        //html += '  </tr>';
        //html += '  </table>';


        //html += '</td>';

        html += '<td></td>';


        // Populate the "Roles" drop down.

        $.ajax({
            url: this.options.operationUriPrefix + "odata/Roles?$filter=IsWorkflowRole eq true",
            dataType: "json",
            contentType: "application/json",
            type: "Get",
            timeout: this.options.ajaxTimeout
        }).done(function (result) {
            try {
                //console.log('In raci.html.displayOrgMultiPicker().Get[odata/Orgs].done: result: ' + JSON.stringify(result));
                var roles;
                if (result) {
                    roles = result.value;
                } else {
                    console.log('In raci.html.addNewRow().Get[odata/Roles].done: result: ' + JSON.stringify(result));
                }

                if (thiz.options.displayRoleIdColumn) {
                    html += '<td class="steprowcell">';
                    //html += '<span class="selectarow-labeltext">Select a role:</span>';
                    //html += '<br />';
                    html += '<select id="selectRoleId"  onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'RoleDropDown_Onchange\', \'' + 'selectRoleId' + '\');">';
                    html += '  <option value=""></option>';
                    for (var i = 0; i < roles.length; i++) {
                        html += '  <option value="' + roles[i].RoleId + '">' + roles[i].RoleId + '</option>';
                    }
                    html += '</select>';
                    //html += '<br />or create a new role:'; //<br /><input id="textNewRoleId" type="text" style="width:75pt;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewRoleTextBox_Onkeyup\', \'' + 'textNewRoleId' + '\');" />';
                    html += '<br /><input style="padding:5px 10px 5px 10px;" id="btnCreateRole1" type="button" value="Create a Role..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayCreateANewRoleDialog\');" />';

                    html += '<br />or select a person:'; //<br /><input id="textNewRoleId" type="text" style="width:75pt;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewRoleTextBox_Onkeyup\', \'' + 'textNewRoleId' + '\');" />';
                    html += '<br /><input style="padding:5px 10px 5px 10px;" id="btnCreateRole1" type="button" value="Select Person..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayCreateANewRoleDialog\');" />';

                    //html += '<br />or add a new person:'; //<br /><input id="textNewRoleId" type="text" style="width:75pt;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewRoleTextBox_Onkeyup\', \'' + 'textNewRoleId' + '\');" />';
                    html += '<br /><input style="padding:5px 10px 5px 10px;" id="btnCreateRole1" type="button" value="Add a Person/Participant/Vendor..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayCreateANewRoleDialog\');" />';

                    html += '</td > ';
                }





                html += '<td class="selectroleorperson-editcell steprowcell">';
                //html += '<span class="selectarow-labeltext">Select a role:</span>';
                //html += '<br />';
                ////html += ' <img style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayPeoplePickerDialog\', \'' + 'txtApprover2FriendlyName' + '\', \'' + 'txtApprover2Id' + '\', \'' + 'txtApprover2Email' + '\');" src="images/addressbook-icon18x18.png">';
                ////html == '&nbsp;&nbsp;';
                //html += '<select id="selectRoleName"  onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'RoleDropDown_Onchange\', \'' + 'selectRoleName' + '\');">';
                //html += '  <option value=""></option>';
                //for (var i = 0; i < roles.length; i++) {
                //    html += '  <option value="' + roles[i].RoleId + '">' + roles[i].RoleName + '</option>';
                //}
                //html += '</select>';
                ////html += '<br />or create a new role:'; //<br /><input id="textNewRoleName" type="text" style="width:210pt;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewRoleTextBox_Onkeyup\', \'' + 'textNewRoleName' + '\');" />';
                //html += '<br /><input id="btnCreateRole2" type="button" value="Create a Role..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayCreateANewRoleDialog\');" />';

                //html += '<br />or select a person:'; //<br /><input id="textNewRoleId" type="text" style="width:75pt;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewRoleTextBox_Onkeyup\', \'' + 'textNewRoleId' + '\');" />';
                //html += '<br /><img style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayPeoplePickerDialog\', \'' + 'txtApprover2FriendlyName' + '\', \'' + 'txtApprover2Id' + '\', \'' + 'txtApprover2Email' + '\');" src="images/addressbook-icon18x18.png">';
                //html == '&nbsp;&nbsp;';
                //html += '<input id="btnCreateRole1" type="button" value="Select Person..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayCreateANewRoleDialog\');" />';

                ////html += '<br />or add a new person:'; //<br /><input id="textNewRoleId" type="text" style="width:75pt;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewRoleTextBox_Onkeyup\', \'' + 'textNewRoleId' + '\');" />';
                //html += '<br /><input id="btnCreateRole1" type="button" value="Add a Person..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayCreateANewRoleDialog\');" />';

                html += '</td > ';








                // The "RoleCategory" dropdown.
                html += '<td class="steprowcell">';
                html += '<select style="padding:5px 5px 5px 5px;" id="selectRoleCategory" class="rolecategory-dropdown" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'RoleCategoryDropDown_Onchange\', \'' + thiz.id + '\');">';
                var stepName = thiz.options.store.Workflow.Steps.Step[stepIndex]["@Name"];
                var rcs;
                var rcs2 = ['Inform (Informed)', 'Collaborator (Consulted)', 'Approver (Accountable)'];
                if (stepName == 'Done') {
                    rcs = ['Inform']; // The "Completed" step can only have the "Inform" role category.
                } else {
                    rcs = ['Inform', 'Collaborator', 'Approver'];
                }
                for (var i = 0; i < rcs.length; i++) {
                    html += '  <option value="' + rcs[i] + '">' + rcs2[i] + '</option>';
                }
                html += '</select>';
                html += '</td > ';

                // The "Actions" cell. This gets rendered below using thiz.renderActionsSection().
                html += '<td id="action-cell_' + stepIndex + '_' + roleIndex + '" class="actions-editcell steprowcell"></td>';

                //html += '<td></td>';
                //html += '<td></td>';
                //html += '<td></td>';
                //html += '<td></td>';

                // The "timeout" cell. This gets rendered below using thiz.renderTimeoutSection().
                //html += '<td class="timeout-editcell steprowcell"></td>';

                // Render the "Cond" cell. This gets rendered below using thiz.renderConditionsSection().
                html += '<td class="conditions-editcell steprowcell">';

                html += '</td>';








                html += '<td style="vertical-align:top;">';

                //html += '  <table style="width:100%;">';
                //html += '  <tr>';
                //html += '    <td>';
                //html += '      <input type="button" style="width:100%;" value="Save" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveAssignmentRow\', \'' + elementId + '\', \'' + 'xx' + '\');" />';
                //html += '    </td>';
                //html += '  </tr>';
                //html += '  <tr>';
                //html += '    <td>';
                //html += '      <input type="button" style="width:100%;" value="Cancel" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'cancelStepRowEditing\', \'' + elementId + '\', \'' + 'xx' + '\');" />';
                //html += '    </td>';
                //html += '  </tr>';
                //html += '  </table>';

                html += '  <table style="width:100%;">';
                html += '  <tr>';
                html += '    <td>';
                html += '      <input type="button" style="width:100%;" value="Save" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveAssignmentRow\', \'' + elementId + '\');" />';
                html += '    </td>';
                html += '  </tr>';
                //html += '  <tr>';
                //html += '    <td>';
                //html += '      <input type="button" style="width:100%;" value="Delete" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'deleteRoleCategory\', \'' + elementId + '\');" />';
                //html += '    </td>';
                //html += '  </tr>';
                html += '  <tr>';
                html += '    <td>';
                html += '      <input type="button" style="width:100%;" value="Cancel" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'cancelStepRowEditing\', \'' + elementId + '\');" />';
                html += '    </td>';
                html += '  </tr>';
                //html += '  <tr>';
                //html += '    <td>';
                //html += '      <input type="button" style="width:100px;white-space:normal;overflow-wrap:break-word;" value="Configure Email Notifications" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayConfigureEmailNotificationsDialog\', \'' + elementId + '\');" />';
                //html += '    </td>';
                //html += '  </tr>';
                html += '  </table>';


                html += '</td>';















                html += '</tr>';

                // It is a new row, to be displayed at the top.
                $('#stepheaderrow_' + stepIndex).after(html);


                thiz.renderSelectRoleOrPersonSection(elementId);


                thiz.renderActionsSection(elementId); // render the actions section
                //thiz.renderTimeoutSection(elementId); // render the timeout section
                thiz.renderConditionsSection(elementId); // render the condition section
            } catch (e) {
                //lpSpinner.Hide();
                //$('.buttonAddNewAssignmentRow').attr('disabled', false); // Disables these buttons while there is the editor row displaying.
                console.log('Exception in raci.html.addNewRow().Get[odata/Roles].done: ' + e.message + ', ' + e.stack);
            }
        }).fail(function (data) {
            //lpSpinner.Hide();
            //$('.buttonAddNewAssignmentRow').attr('disabled', false); // Disables these buttons while there is the editor row displaying.
            var msg;
            if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
            } else {
                msg = JSON.stringify(data);
            }
            alert('Error in raci.html.addNewRow().Get[odata/Roles].fail: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
            console.log('Error in raci.html.addNewRow().Get[odata/Roles].fail:' + JSON.stringify(data));
            //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
            //var error = JSON.parse(data.responseText)["odata.error"];
            //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
        });
        //}
    } catch (e) {
        //$('.buttonAddNewAssignmentRow').attr('disabled', false); // Disables these buttons while there is the editor row displaying.
        console.log('Exception in addNewRow(): ' + e.message + ', ' + e.stack);
    }
},
deleteStep: function () {
    try {
        console.log('In deleteStep().');
        alert('In deleteStep: This functionality is incomplete.');
    } catch (e) {
        console.log('Exception in deleteStep(): ' + e.message + ', ' + e.stack);
    }
},
deleteRoleCategory: function (elementId) {
    try {
        console.log('In deleteRoleCategory(). : ' + elementId);
        var x = elementId.split('_')[0];
        var sourceRoleCategory = x.split('-')[1]; // "inform" or "assign"
        var stepIndex = elementId.split('_')[1]; // eg: 3
        var roleIndex = elementId.split('_')[2]; // eg: 8
        //if (confirm("Please confirm you wish to delete this role/rolecategory from this step. This will not affect the workflow until it has been saved & activated.")) {
        if (stepIndex && sourceRoleCategory && roleIndex > -1) {
            if (sourceRoleCategory == 'inform') {
                this.options.store.Workflow.Steps.Step[stepIndex].OnStart.Inform.splice(roleIndex, 1); // delete leaves a null, so we have to use splice.
            } else if (sourceRoleCategory == 'assign') {
                this.options.store.Workflow.Steps.Step[stepIndex].Assign.splice(roleIndex, 1); // delete leaves a null, so we have to use splice.
            } else {
                alert('ERROR: Invalid sourceRoleCategory in deleteRoleCategory().'); // We should never get here.
            }
        } else {
            // We should never get here!!!
            alert('ERROR: Failed to locate the step or role in the underlying json in deleteRoleCategory().');
        }
        this._create();
        //} else {
        //    // do nothing.
        //}
    } catch (e) {
        console.log('Exception in deleteRoleCategory(): ' + e.message + ', ' + e.stack);
    }
},
activateOrgRolesConfiguration: function () {
    try {
        debugger;
        var thiz = this;
        var orgRolesToActivate_Id;
        $('#spanOrgRolesDropDownList').find('option:selected').each(function (index, element) {
            orgRolesToActivate_Id = element.value;
        });
        console.log('In activateOrgRolesConfiguration(). workflowToActivate_Id: ' + orgRolesToActivate_Id);
        if (confirm("Are you certain you wish to activate this orgRoles?")) {
            this.showProgress('Activating your Selected Org Roles...');
            // First we have to deactivate the existing active workflow. Get the Id first, then mark as inactive.
            $.ajax({
                url: thiz.options.operationUriPrefix + "odata/OrgRolesConfiguration/" + workflowAppId, //?$filter=Active eq true",
                dataType: "json",
                contentType: "application/json",
                type: "Get"
            }).done(function (result) {
                try {
                    var workflow = result.value;
                    if (workflow.length != 1) {
                        alert('ERROR: An incorrect number of org roles are marked as active! This process cannot continue. There can only be 1 active orgRoles.');
                    } else {
                        var orgRolesToDeactivate_Id = workflow[0].Id;
                        var json = {
                            Active: false
                        };
                        $.ajax({
                            url: thiz.options.operationUriPrefix + "odata/OrgRolesConfiguration('" + orgRolesToDeactivate_Id + "')",
                            dataType: "json",
                            contentType: "application/json",
                            type: "Patch",
                            data: JSON.stringify(json)
                        }).done(function (result) {
                            try {
                                console.log('In bwOrganizationEditor.js.activateOrgRolesConfiguration.update: Successfully updated DB using (' + JSON.stringify(json) + ').');
                                // Now set this one to Active.
                                var json = {
                                    Active: true
                                };
                                $.ajax({
                                    url: thiz.options.operationUriPrefix + "odata/OrgRolesConfiguration('" + orgRolesToActivate_Id + "')",
                                    dataType: "json",
                                    contentType: "application/json",
                                    type: "Patch",
                                    data: JSON.stringify(json)
                                }).done(function (result) {
                                    try {
                                        console.log('In raci.html.activateRaciConfiguration().xx.update: Successfully updated DB using (' + JSON.stringify(json) + ').');
                                        // Display a dialog with an "Undo" button!!!!
                                        //alert('Successfully updated the database. THIS WORKFLOW CHANGE WILL TAKE PLACE IMMEDIATELY!');
                                        $("#divUndoOrgRolesActivationDialog").dialog({
                                            modal: true,
                                            resizable: false,
                                            //closeText: "Cancel",
                                            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                                            title: 'Project Type picker',
                                            width: '800',
                                            dialogClass: 'no-close', // No close button in the upper right corner.
                                            hide: false, // This means when hiding just disappear with no effects.
                                            open: function () {
                                                try {
                                                    $('.ui-widget-overlay').bind('click', function () {
                                                        $('#divUndoOrgRolesActivationDialog').dialog('close');
                                                    });
                                                } catch (e) {
                                                    console.log('Exception in activateOrgRolesConfiguration().divUndoOrgRolesActivationDialog.open(): ' + e.message + ', ' + e.stack);
                                                }
                                            },
                                            close: function () {
                                                location.reload(); // When the user closes this dialog, we regenerate the screen to reflect the newly created and activated workflow.
                                            }
                                        });
                                        $('#divUndoOrgRolesActivationDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
                                    } catch (e) {
                                        console.log('Exception in activateOrgRolesConfiguration().xx.update: ' + e.message + ', ' + e.stack);
                                    }
                                }).fail(function (data) {
                                    thiz.hideProgress();
                                    var msg;
                                    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                                        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                                    } else {
                                        msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
                                    }
                                    alert('Fail in activateOrgRolesConfiguration().xx.update: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                                    console.log('Fail in activateOrgRolesConfiguration().xx.update: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
                                    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                                    //var error = JSON.parse(data.responseText)["odata.error"];
                                    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                                });
                            } catch (e) {
                                console.log('Exception in activateOrgRolesConfiguration().xx.update: ' + e.message + ', ' + e.stack);
                            }
                        }).fail(function (data) {
                            thiz.hideProgress();
                            var msg;
                            if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                                msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                            } else {
                                msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
                            }
                            alert('Fail in activateOrgRolesConfiguration().xx.update: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                            console.log('Fail in activateOrgRolesConfiguration().xx.update: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
                            //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                            //var error = JSON.parse(data.responseText)["odata.error"];
                            //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                        });

                    }
                } catch (e) {
                    //lpSpinner.Hide();
                    console.log('Exception in activateOrgRolesConfiguration._create().xx.Get:3: ' + e.message + ', ' + e.stack);
                }
            }).fail(function (data) {
                //lpSpinner.Hide();
                console.log('In xx.fail(): ' + JSON.stringify(data));
                var msg;
                if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                } else {
                    msg = JSON.stringify(data);
                }
                alert('Exception in activateOrgRolesConfiguration.Get: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                console.log('Exception in activateOrgRolesConfiguration.Get: ' + JSON.stringify(data));
                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                //var error = JSON.parse(data.responseText)["odata.error"];
                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            });
        }
    } catch (e) {
        console.log('Exception in activateOrgRolesConfiguration(): ' + e.message + ', ' + e.stack);
    }
},
resetRaciConfiguration: function () {
    try {
        var thiz = this;
        //var workflowToActivate_Id;
        //$('#spanWorkflowsDropDownList').find('option:selected').each(function (index, element) {
        //    workflowToActivate_Id = element.value;
        //});
        //console.log('In activateRaciConfiguration(). workflowToActivate_Id: ' + workflowToActivate_Id);
        //if (confirm("Are you certain you wish to activate this workflow?")) {
        //    this.showProgress('Activating your Selected Workflow...');
        //    // First we have to deactivate the existing active workflow. Get the Id first, then mark as inactive.

        $.ajax({
            url: thiz.options.operationUriPrefix + "odata/WorkflowConfiguration/" + tenantId + '/' + workflowAppId + "/reset", //?$filter=Active eq true",
            dataType: "json",
            contentType: "application/json",
            type: "Get",
            timeout: thiz.options.ajaxTimeout
        }).success(function (result) {

            alert('Workflow has been reset');
        }).error(function (data) {
            //lpSpinner.Hide();

            console.log('In resetRaciConfiguration.fail(): ' + JSON.stringify(data));
            var msg;
            if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
            } else {
                msg = JSON.stringify(data);
            }
            alert('Exception in raci.html.activateRaciConfiguration.Get: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
            console.log('Exception in raci.html.activateRaciConfiguration.Get: ' + JSON.stringify(data));
            //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
            //var error = JSON.parse(data.responseText)["odata.error"];
            //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
        });
        //}
    } catch (e) {
        console.log('Exception in activateRaciConfiguration(): ' + e.message + ', ' + e.stack);
    }
},
saveOrgRolesConfigurationAndActivateAndUpdateParticipants: function () {
    var thiz = this;
    try {
        console.log('In bwWorkflowEditor.js.saveOrgRolesConfigurationAndActivateAndUpdateParticipants().');
        //debugger;
        //var description = document.getElementById('txtNewWorkflowDescription').value;
        //if (description.trim() == '') {
        //    alert('You must enter a "Description" for this workflow change!');
        //} else {
        //this.showProgress('Saving and Activating your Workflow Change...');
        //var bwOrgRolesId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        //    return v.toString(16);
        //});
        //var dtNow = new Date();

        var json = {
            bwTenantId: tenantId,
            bwWorkflowAppId: workflowAppId,
            CreatedBy: participantFriendlyName,
            CreatedById: participantId,
            CreatedByEmail: participantEmail,
            bwOrgRolesJson: JSON.stringify(thiz.options.store.Global),
            bwOrgRolesActive: true
        };
        $.ajax({
            url: thiz.options.operationUriPrefix + "_bw/SaveBwOrgRoles_With_SynchronizeParticipantOrgRoles", // This also updates the participants when Role.ParticipantIsDirty == true. The web service has to iterate through all nodes and process these. Then mark as false, before saving the json.
            type: "Post",
            timeout: thiz.options.ajaxTimeout,
            data: json,
            headers: {
                "Accept": "application/json; odata=verbose"
            }
        }).success(function (result) {
            try {
                if (result != 'SUCCESS') {
                    alert('Error in saveOrgRolesConfigurationAndActivateAndUpdateParticipants(): ' + JSON.stringify(result));
                } else {
                    //debugger;
                    //thiz.hideProgress();
                    console.log('In bwOrganizationEditor.js.saveOrgRolesConfigurationAndActivateAndUpdateParticipants().post: Successfully updated DB. result: ' + JSON.stringify(result)); // using (' + JSON.stringify(json) + ').');
                    // Display a dialog with an "Undo" button!!!!
                    //alert('Successfully updated the database. THIS WORKFLOW CHANGE WILL TAKE PLACE IMMEDIATELY!');
                    //debugger;
                    $("#divUndoOrgRolesActivationDialog").dialog({
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
                                $('#divUndoOrgRolesActivationDialog').dialog('close');
                            });
                        },
                        close: function () {
                            $('#divUndoOrgRolesActivationDialog').dialog("destroy");
                            //    //thiz._create(); // When the user closes this dialog, we regenerate the screen to reflect the newly created and activated workflow. <<< NOT NECESSARY!!!! ONLY USING FOR TESTING.
                            //    debugger;
                            //    thiz.checkIfWeHaveToDisplayThePublishChangesButton();
                        }
                    });
                    $('#divUndoOrgRolesActivationDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();

                    // re-sync this.options.store
                    //var oldJsonString = JSON.stringify(this.options.store.Workflow);
                    thiz.options.store.DraftGlobal = JSON.parse(JSON.stringify(thiz.options.store.Global)); //var newJsonString = JSON.stringify(this.options.store.DraftWorkflow);

                    thiz.checkIfWeHaveToDisplayThePublishChangesButton();


                    //alert('In saveOrgRolesConfigurationAndActivateAndUpdateParticipants(): WE NEED TO CHECK THE JSON FOR ParticipantIsDirty SO THAT WE UPDATE THE xx TABLE ACCODINGLY!!!!');
                }

            } catch (e) {
                console.log('Exception in bwOrganizationEditor.js.saveOrgRolesConfigurationAndActivateAndUpdateParticipants().xx.update: ' + e.message + ', ' + e.stack);
                alert('Exception in bwOrganizationEditor.js.saveOrgRolesConfigurationAndActivateAndUpdateParticipants().xx.update: ' + e.message + ', ' + e.stack);
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
            console.log('Fail in bwOrganizationEditor.js.saveOrgRolesConfigurationAndActivateAndUpdateParticipants().xx.update: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
            alert('Fail in bwOrganizationEditor.js.saveOrgRolesConfigurationAndActivateAndUpdateParticipants().xx.update: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
            //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
            //var error = JSON.parse(data.responseText)["odata.error"];
            //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
        });

        //}
    } catch (e) {
        debugger;
        //thiz.hideProgress();
        alert('Exception in bwOrganizationEditor.js.saveOrgRolesConfigurationAndActivateAndUpdateParticipants(): ' + e.message + ', ' + e.stack);
        console.log('Exception in bwOrganizationEditor.js.saveOrgRolesConfigurationAndActivateAndUpdateParticipants(): ' + e.message + ', ' + e.stack);
    }
},
saveStepname: function (tagname, originalStepname) {
    try {
        console.log('saveStepname(). tagname: ' + tagname + ', originalStepname: ' + originalStepname);
        //alert('In saveStepname(). Editing this step name will impact all of the workflows.');
        var newStepName = document.getElementById(tagname).firstElementChild.value;
        for (var i = 0; i < this.options.store.RaciSteps.length; i++) {
            if (this.options.store.RaciSteps[i].StepName == originalStepname) {
                this.options.store.RaciSteps[i].StepName = newStepName;
                document.getElementById(tagname).innerHTML = newStepName; // Doing this instead of calling this._create();
            }
        }
    } catch (e) {
        console.log('Exception in saveStepname(): ' + e.message + ', ' + e.stack);
    }
    //this._create();
},
//saveActionOrRequireCommentsCheckbox: function (checkboxId) {
//    try {
//        // Get the action and checkbox type. eg: Action-Approve_3_13, RequireComments-Approve_3_13
//        var x = checkboxId.split('_')[0];
//        var checkboxType = x.split('-')[0]; // "Action" or "RequireComments"
//        var action = x.split('-')[1]; // "Approve"
//        var stepIndex = checkboxId.split('_')[1]; // eg: 2
//        var roleIndex = checkboxId.split('_')[2]; // eg: 13
//        console.log('In saveActionOrRequireCommentsCheckbox(). checkboxId: ' + checkboxId + ', checkboxType: ' + checkboxType + ', action: ' + action + ', stepIndex: ' + stepIndex + ', roleIndex: ' + roleIndex);
//        var actionCheckboxState;
//        var requireCommentsCheckboxState;
//        if (checkboxType == 'RequireComments') {
//            var actionCheckbox_Id = 'Action-Approve_' + stepIndex + '_' + roleIndex;
//            actionCheckboxState = document.getElementById(actionCheckbox_Id).checked;
//            requireCommentsCheckboxState = document.getElementById(checkboxId).checked;
//        } else {
//            var requireCommentsCheckbox_Id = 'RequireComments-Approve_' + stepIndex + '_' + roleIndex;
//            actionCheckboxState = document.getElementById(checkboxId).checked;
//            requireCommentsCheckboxState = document.getElementById(requireCommentsCheckbox_Id).checked;
//        }

//        if (this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex].Action.length) {
//            console.log('ASSIGN'); // THIS WORKS!!!!!!!!!!!!!!!!!!!!!!
//            var x;
//            if (requireCommentsCheckboxState) {
//                x = {
//                    Action: {
//                        '@Name': 'Approve',
//                        '@State': 'Done',
//                        '@RequireComments': 'True',
//                        Tooltip: 'Approve the request and submit comments'
//                    }
//                };
//            } else {
//                x = {
//                    Action: {
//                        '@Name': 'Approve',
//                        '@State': 'Done',
//                        Tooltip: 'Approve the request and submit comments'
//                    }
//                };
//            }
//            this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex].Action.push(x);
//        } else if (this.options.store.Workflow.Steps.Step[stepIndex].OnStart.Inform.length) {
//            //console.log('INFORM');
//            // INFORM DOES NOT HAVE THESE ONES.
//        } else {
//            alert('ERROR: Invalid assign or inform value.');
//            console.log('not ASSIGN or INFORM. this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex]: ' + JSON.stringify(this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex]));
//        }
//    } catch (e) {
//        console.log('Exception in saveActionOrRequireCommentsCheckbox(): ' + e.message + ', ' + e.stack);
//    }
//},
cancelChangesInDraftOrgRolesConfiguration: function () {
    try {
        console.log('In cancelChangesInDraftOrgRolesConfiguration().');
        this.options.store.Global = JSON.parse(JSON.stringify(this.options.store.DraftGlobal)); // Creating "DraftWorkflow" so we can tell if the workflow has been changed or not, and then inform the user that changes need to be published.
        this.renderOrgRolesEditor(); // Definition is renderOrgRolesEditor(assignmentRowChanged_ElementId).
    } catch (e) {
        console.log('Exception in cancelChangesInDraftOrgRolesConfiguration(): ' + e.message + ', ' + e.stack);
    }
},
checkIfWeHaveToDisplayThePublishChangesButton: function () {
    try {
        //debugger;
        console.log('In checkIfWeHaveToDisplayThePublishChangesButton().');
        var thereHaveBeenChangesToTheOrgRoles = false;
        var oldJsonString = JSON.stringify(this.options.store.Global);
        var newJsonString = JSON.stringify(this.options.store.DraftGlobal);
        if (oldJsonString != newJsonString) {
            thereHaveBeenChangesToTheOrgRoles = true;
        }
        if (thereHaveBeenChangesToTheOrgRoles) {
            // The user has made changes to the workflow.
            document.getElementById('spanThereAreChangesToPublishText').innerHTML = 'You have changes that won\'t be available until you publish: ';
            var html = '';
            html += '<input style="padding:5px 10px 5px 10px;width:100px;" id="btnsaveOrgRolesConfigurationAndActivateAndUpdateParticipants" type="button" value="Publish" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'saveOrgRolesConfigurationAndActivateAndUpdateParticipants\');" />';
            html += '&nbsp;<input style="padding:5px 10px 5px 10px;" id="btncancelChangesInDraftOrgRolesConfiguration" type="button" value="Cancel Changes" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'cancelChangesInDraftOrgRolesConfiguration\');" />';
            document.getElementById('spanThereAreChangesToPublishButton').innerHTML = html; //'<input style="padding:5px 10px 5px 10px;" id="btnSaveWorkflowConfigurationAndActivate" type="button" value="  Publish  " onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveWorkflowConfigurationAndActivate\');" />';
        } else {
            // Do nothing because the user has made no changes to the workflow.
            document.getElementById('spanThereAreChangesToPublishText').innerHTML = '';
            document.getElementById('spanThereAreChangesToPublishButton').innerHTML = '';
        }
    } catch (e) {
        console.log('Exception in checkIfWeHaveToDisplayThePublishChangesButton(): ' + e.message + ', ' + e.stack);
    }
},
saveCollaborationTimeout: function () {
    try {
        // This makes sure the user enters a number here, which is greater than 0 and less than 28.
        var timeout = document.getElementById('textTimeout').value;
        var timeoutUnits;
        $('#selectTimeoutUnits').find('option:selected').each(function (index, element) {
            timeoutUnits = element.value;
        });
        console.log('In saveCollaborationTimeout(). timeout: ' + timeout + ', timeoutUnits: ' + timeoutUnits);
        if (timeoutUnits == 'Days') {
            var newTimeout = '';
            for (var i = 0; i < timeout.length; i++) {
                var charCode = timeout.charCodeAt(i);
                if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
                    // do nothing
                } else {
                    newTimeout += timeout[i];
                }
            }
            if (Number(newTimeout) > 28) newTimeout = 28;
            var timeoutValueToSave = '';
            if (newTimeout) {
                document.getElementById('textTimeout').value = newTimeout;
                timeoutValueToSave = newTimeout;
            } else {
                document.getElementById('textTimeout').value = '';
            }
        } else if (timeoutUnits == 'Hours') {
            var newTimeout = '';
            for (var i = 0; i < timeout.length; i++) {
                var charCode = timeout.charCodeAt(i);
                if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
                    // do nothing
                } else {
                    newTimeout += timeout[i];
                }
            }
            if (Number(newTimeout) > 24) newTimeout = 24;
            var timeoutValueToSave = '';
            if (newTimeout) {
                document.getElementById('textTimeout').value = newTimeout;
                timeoutValueToSave = newTimeout;
            } else {
                document.getElementById('textTimeout').value = '';
            }
        } else if (timeoutUnits == 'Minutes') {
            var newTimeout = '';
            for (var i = 0; i < timeout.length; i++) {
                var charCode = timeout.charCodeAt(i);
                if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
                    // do nothing
                } else {
                    newTimeout += timeout[i];
                }
            }
            if (Number(newTimeout) > 60) newTimeout = 60;
            var timeoutValueToSave = '';
            if (newTimeout) {
                document.getElementById('textTimeout').value = newTimeout;
                timeoutValueToSave = newTimeout;
            } else {
                document.getElementById('textTimeout').value = '';
            }
        } else {
            alert('In saveCollaborationTimeout(): Unrecognized timeout units.');
        }
        //
        // Iterate through the steps to find the Collaboration one, so that we can save it.
        //
        for (var i = 0; i < this.options.store.Workflow.Steps.Step.length; i++) {
            if (this.options.store.Workflow.Steps.Step[i]["@Name"] == 'Collaboration') {
                this.options.store.Workflow.Steps.Step[i]["@Timeout"] = timeoutValueToSave; // Save the timeout value.
                this.options.store.Workflow.Steps.Step[i]["@TimeoutUnits"] = timeoutUnits; // Save the timeout units: [Days, Hours, Minutes]
            }
        }
        this.checkIfWeHaveToDisplayThePublishChangesButton();
    } catch (e) {
        console.log('Exception in saveCollaborationTimeout(): ' + e.message + ', ' + e.stack);
    }
},
//saveCollaborationTimeout: function() {
//    try {
//        console.log('In saveCollaborationTimeout().');
//        var timeout = document.getElementById('textTimeout').value;
//        var timeoutUnits; 
//        $('#selectTimeoutUnits').find('option:selected').each(function (index, element) {
//            timeoutUnits = element.value;
//        });

//        debugger;


//    } catch (e) {
//        console.log('Exception in saveCollaborationTimeout(): ' + e.message + ', ' + e.stack);
//    }
//},
saveAssignmentRow: function (elementId) {
    try {
        console.log('In saveAssignmentRow(). WE WILL GET RID OF THIS SAVE BUTTON BECAUSE WE WANT TO JUST HAVE THE Publish BUTTON BECOME ENABLED. THIS WILL BE MORE INTUITIVE I THNK..??!! elementId: ' + elementId); // eg: elementId: steprow-inform_3_8
        var thiz = this;
        var x = elementId.split('_')[0];
        var sourceRoleCategory = x.split('-')[1]; // "inform" or "assign"
        var stepIndex = elementId.split('_')[1]; // eg: 3
        var roleIndex = elementId.split('_')[2]; // eg: 8
        //if (confirm("Please confirm you wish to save this change. This will not affect the workflow until it has been saved & activated.")) {
        // Step 1: Change the underlying JSON. These loops help us locate the node the user wants to change.
        var car = this.options.store;
        if (stepIndex && sourceRoleCategory && roleIndex > -1) {
            // Step 1: Get the Role.
            var newRoleId;
            $('#selectRoleName').find('option:selected').each(function (index, element) {
                newRoleId = element.value;
            });

            var newRoleCategory; // Step 1: Get the "RoleCategory".
            $('#selectRoleCategory').find('option:selected').each(function (index, element) {
                newRoleCategory = element.value;
            });
            var newActions = []; // Step 2: Get the "Actions".
            if (newRoleCategory == 'Approver') { // We only get "Actions" when it is "Approve".
                // "Approve" action. eg: Action-Approve_3_8, RequireComments-Approve_3_8
                var approve_action_CheckboxId = 'Action-Approve_' + stepIndex + '_' + roleIndex;
                var approve_requireComments_CheckboxId = 'RequireComments-Approve_' + stepIndex + '_' + roleIndex;
                if (document.getElementById(approve_action_CheckboxId).checked) {
                    var x;
                    if (document.getElementById(approve_requireComments_CheckboxId).checked) {
                        x = {
                            '@Name': 'Approve',
                            '@State': 'Done',
                            '@RequireComments': 'True',
                            Tooltip: 'Approve the request and submit comments'
                        };
                    } else {
                        x = {
                            '@Name': 'Approve',
                            '@State': 'Done',
                            Tooltip: 'Approve the request and submit comments'
                        };
                    }
                    newActions.push(x);
                }
                // "Cancel" action. eg: Action-Cancel_3_8, RequireComments-Cancel_3_8
                var cancel_action_CheckboxId = 'Action-Cancel_' + stepIndex + '_' + roleIndex;
                var cancel_requireComments_CheckboxId = 'RequireComments-Cancel_' + stepIndex + '_' + roleIndex;
                if (document.getElementById(cancel_action_CheckboxId).checked) {
                    var x;
                    if (document.getElementById(cancel_requireComments_CheckboxId).checked) {
                        x = {
                            '@Name': 'Cancel',
                            '@State': 'Cancel',
                            '@RequireComments': 'True',
                            Tooltip: 'Cancel the entire CAR'
                        };
                    } else {
                        x = {
                            '@Name': 'Cancel',
                            '@State': 'Cancel',
                            Tooltip: 'Cancel the entire CAR'
                        };
                    }
                    newActions.push(x);
                }
                // "Decline" action. eg: Action-Decline_3_8, RequireComments-Decline_3_8
                var decline_action_CheckboxId = 'Action-Decline_' + stepIndex + '_' + roleIndex;
                var decline_requireComments_CheckboxId = 'RequireComments-Decline_' + stepIndex + '_' + roleIndex;
                if (document.getElementById(decline_action_CheckboxId).checked) {
                    var x;
                    if (document.getElementById(decline_requireComments_CheckboxId).checked) {
                        x = {
                            '@Name': 'Decline',
                            '@State': 'Cancel',
                            '@RequireComments': 'True',
                            Tooltip: 'Decline the entire CAR'
                        };
                    } else {
                        x = {
                            '@Name': 'Decline',
                            '@State': 'Cancel',
                            Tooltip: 'Decline the entire CAR'
                        };
                    }
                    newActions.push(x);
                }
                // "Revise/Hold" action. eg: Action-Revise/Hold_3_8, RequireComments-Revise/Hold_3_8
                var reviseHold_action_CheckboxId = 'Action-Revise/Hold_' + stepIndex + '_' + roleIndex;
                var reviseHold_requireComments_CheckboxId = 'RequireComments-Revise/Hold_' + stepIndex + '_' + roleIndex;
                if (document.getElementById(reviseHold_action_CheckboxId).checked) {
                    var x;
                    if (document.getElementById(reviseHold_requireComments_CheckboxId).checked) {
                        x = {
                            '@Name': 'Revise/Hold',
                            '@Target': 'Revise',
                            '@RequireComments': 'True',
                            Invalidate: { '@Step': 'Admin' },
                            Invalidate: { '@Step': 'VPLevel' },
                            Invalidate: { '@Step': 'ExecLevel' },
                            Invalidate: { '@Step': 'CLevel' },
                            Tooltip: 'Send the CAR back to the original creator'
                        };
                    } else {
                        x = {
                            '@Name': 'Revise/Hold',
                            '@Target': 'Revise',
                            Invalidate: { '@Step': 'Admin' },
                            Invalidate: { '@Step': 'VPLevel' },
                            Invalidate: { '@Step': 'ExecLevel' },
                            Invalidate: { '@Step': 'CLevel' },
                            Tooltip: 'Send the CAR back to the original creator'
                        };
                    }
                    newActions.push(x);
                }
            }
            //debugger;
            var newConditionString = document.getElementById('spanConditionEditorContents').innerHTML; // Step 3: Get the "Cond".

            if (document.getElementById('selectRoleName')) {
                var e = document.getElementById("selectRoleName");
                var newRoleId = e.options[e.selectedIndex].value;
                var newRoleName = e.options[e.selectedIndex].text;
            }

            //
            // We now have all of our new values. Now we have to determine if we use the same node in the JSON, or if it has to move.
            // This depends on whether the user has selected a different "RoleCategory" (Inform, Collaborator, Approver).
            //
            debugger;
            if (sourceRoleCategory == 'inform' && (newRoleCategory == 'Collaborator' || newRoleCategory == 'Approver')) {
                // Change from inform to assign row.
                //var roleId;
                //if (this.options.store.Workflow.Steps.Step[stepIndex].OnStart.Inform[roleIndex]["@Role"]) {
                //    roleId = this.options.store.Workflow.Steps.Step[stepIndex].OnStart.Inform[roleIndex]["@Role"];
                //} else {
                //    roleId = this.options.store.Workflow.Steps.Step[stepIndex].OnStart.Inform[roleIndex]["@IdField"];
                //}
                // eg: <Assign Role="ADMIN" Form="CARForm.aspx" DoneForm="CARComments.aspx" Title="Add Comments/Approve" MailTemplate="Assign1.xsl" Subject="eCAR3 - New Work Item ({0})" RoleCategory="Approver">
                var row = {
                    '@Role': newRoleId,
                    '@RoleName': newRoleName,





                    '@RoleCategory': newRoleCategory,
                    '@Cond': newConditionString
                };
                if (newRoleCategory == 'Approver' && newActions) {
                    row.Action = newActions;
                }
                // Delete the old row.
                debugger; // WHY IS THIS AN INFORM?
                this.options.store.Workflow.Steps.Step[stepIndex].OnStart.Inform.splice(roleIndex, 1); // delete leaves a null, so we have to use splice.
                // Depending on the new RoleCategory, figure out where in the json to insert this assignment row. For instance, if it is "Approver", it should show up at the top of the "Approvers", and be highlighted so th euser know what they just changed.
                // Iterate through all of the assignment rows and find this out.
                var assignIndex;
                var weFoundIt = false;
                for (var i = 0; i < this.options.store.Workflow.Steps.Step[stepIndex].Assign.length; i++) {
                    console.log('this.options.store.Workflow.Steps.Step[stepIndex].Assign[i]: ' + this.options.store.Workflow.Steps.Step[stepIndex].Assign[i]["@RoleCategory"] + ', newRoleCategory: ' + newRoleCategory);
                    if (!weFoundIt && this.options.store.Workflow.Steps.Step[stepIndex].Assign[i]["@RoleCategory"] == newRoleCategory) {
                        // We have found the first of this role category, so we will insert this new assignment row at the top.
                        this.options.store.Workflow.Steps.Step[stepIndex].Assign.splice(i, 0, row); // Create the row
                        assignIndex = i;
                        weFoundIt = true;
                    }
                }
            } else if (sourceRoleCategory == 'assign' && newRoleCategory == 'Inform') {
                // Change from assign to inform row.
                //var roleId = this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex]["@Role"];
                this.options.store.Workflow.Steps.Step[stepIndex].Assign.splice(roleIndex, 1); // delete leaves a null, so we have to use splice.
                // eg: <Inform Role="DIRSAFE" MailTemplate="Inform1.xsl" Subject="eCAR3 - New Project {0} created" Cond="$ProjectType~IM,LR,EQ,SG,FS,WS,ENV,INO,PSM,IT,TRANS,WH" />
                var row = {
                    '@Role': newRoleId,
                    '@RoleName': newRoleName,


                    '@Cond': newConditionString
                }
                this.options.store.Workflow.Steps.Step[stepIndex].OnStart.Inform.splice(0, 0, row); // Create the row
            } else {
                // No change to RoleCategory, stay in the same row. THIS IS THE ONLY PLACE WHERE we save values to an existing row in the workflow.
                if (sourceRoleCategory == 'inform') {
                    this.options.store.Workflow.Steps.Step[stepIndex].OnStart.Inform[roleIndex]["@Cond"] = newConditionString; // The only thing that could change here is "Cond".
                    debugger;
                    if (newRoleId) {
                        this.options.store.Workflow.Steps.Step[stepIndex].OnStart.Inform[roleIndex]["@Role"] = newRoleId;
                        this.options.store.Workflow.Steps.Step[stepIndex].OnStart.Inform[roleIndex]["@RoleName"] = newRoleName;
                    }
                } else if (sourceRoleCategory == 'assign') {
                    if (newRoleCategory == 'Approver' && newActions) {
                        //debugger;
                        // Find out if we changed the Tooltip and JavaScript values already. They save differently..... not sure if this is best approach yet.
                        var actionIndex;
                        for (var a = 0; a < this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex].Action.length; a++) {
                            var x1 = this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex].Action[a]["@Name"];
                            for (var b = 0; b < newActions.length; b++) {
                                var x2 = newActions[b]["@Name"];
                                if (x1 == x2) {
                                    //debugger;
                                    var tooltip = this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex].Action[a].Tooltip;
                                    var javascript = this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex].Action[a]["@JavaScript"];
                                    newActions[b].Tooltip = tooltip;
                                    newActions[b]["@JavaScript"] = javascript;

                                }
                            }
                        }
                        this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex].Action = newActions;
                    }
                    //debugger;
                    this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex]["@Cond"] = newConditionString;
                    this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex]["@Role"] = newRoleId;
                    this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex]["@RoleName"] = newRoleName;
                } else {
                    alert('ERROR: Invalid sourceRoleCategory: ' + sourceRoleCategory);
                }
            }
            //
            // Now we have to save the user(s) in the BwWorkflowUserRole schema.
            //
            var userId = document.getElementById('txtRoleMembersId_' + stepIndex + '_' + roleIndex).value;
            if (userId) {
                // A user(s) has been selected, so update the table.
                var userFriendlyName = document.getElementById('txtRoleMembersFriendlyName_' + stepIndex + '_' + roleIndex).value;
                var userEmail = document.getElementById('txtRoleMembersEmail_' + stepIndex + '_' + roleIndex).value;
                var dtNow = new Date();
                var json = {
                    bwTenantId: tenantId,
                    bwWorkflowAppId: workflowAppId,
                    bwParticipantId: userId,
                    bwParticipantFriendlyName: userFriendlyName,
                    bwParticipantEmail: userEmail,
                    RoleId: newRoleId,
                    RoleName: newRoleName, // JUST ADDED MAKE SURE THIS WORKS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                    OrgId: 'ALL', // UNTIL WE GET THE Orgs figured out, use 'ALL' as the default.
                    Active: true,
                    Created: dtNow,
                    Modified: dtNow,
                    ModifiedByFriendlyName: participantFriendlyName,
                    ModifiedById: participantId,
                    ModifiedByEmail: participantEmail
                };
                $.ajax({
                    url: thiz.options.operationUriPrefix + "odata/UserRole",
                    type: "Post",
                    timeout: thiz.options.ajaxTimeout,
                    data: json,
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    }
                }).success(function (result) {
                    try {
                        // Re-render the screen.
                        thiz._create();
                    } catch (e) {
                        console.log('Exception in bwWorkflowEditor.js.saveAssignmentRow().xx.update: ' + e.message + ', ' + e.stack);
                        alert('Exception in bwWorkflowEditor.js.saveAssignmentRow().xx.update: ' + e.message + ', ' + e.stack);
                    }
                }).error(function (data, errorCode, errorMessage) {
                    //thiz.hideProgress();
                    var msg;
                    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                    } else {
                        msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
                    }
                    console.log('Fail in bwWorkflowEditor.js.saveAssignmentRow().xx.update: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
                    alert('Fail in bwWorkflowEditor.js.saveAssignmentRow().xx.update: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                    //var error = JSON.parse(data.responseText)["odata.error"];
                    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                });
            } else {
                // Re-render the screen.
                this._create();
            }
        } else {
            // We should never get here!!!
            alert('ERROR: Failed to locate the step or role in the underlying json.');
        }
    } catch (e) {
        console.log('Exception in saveAssignmentRow(): ' + e.message + ', ' + e.stack);
    }
},
cancelStepRowEditing: function (elementId) {
    try {
        console.log('In cancelStepRowEditing(). elementId: ' + elementId);
        try {
            //document.getElementById(elementId).style.visibility = 'visible'; // We can display it again after the user is done editing.
            $('#' + elementId).removeClass('steprow-hidden');  // Display the row again.
            document.getElementById(elementId).style.backgroundColor = '#EBF6F9'; //.closest('tr').style.backgroundColor = 'lightgrey'; // Make the row highlighted so the user has a visual queue so that they can remember where they left off!
            //enableButton('buttonAddNewAssignmentRow');
        } catch (e) {
            // do nothing
        }
        $('.activeEditRow').remove(); // Get rid of the editable row.
    } catch (e) {
        console.log('Exception in cancelStepRowEditing(): ' + e.message + ', ' + e.stack);
    }
},
undoWorkflowActivation: function () {
    try {
        console.log('In undoWorkflowActivation().');
        alert('In undoWorkflowActivation(). This functionality is not complete. Coming soon!')
    } catch (e) {
        console.log('Exception in undoWorkflowActivation(): ' + e.message + ', ' + e.stack);
    }
},
displayRoleMultiPicker_notusedyet: function (elementId) {
    try {
        console.log('In displayRoleMultiPicker().');
        try {
            console.log('In displayRoleMultiPicker(). elementId: ' + elementId);

            $.ajax({
                url: this.options.operationUriPrefix + "odata/Roles", //Orgs",
                dataType: "json",
                contentType: "application/json",
                type: "Get",
                timeout: this.options.ajaxTimeout
            }).done(function (result) {
                try {
                    //console.log('In raci.html.displayRoleMultiPicker().Get[odata/Orgs].done: result: ' + JSON.stringify(result));
                    var availablePillars;
                    if (result) {
                        availablePillars = result.value;
                    } else {
                        console.log('In raci.html.displayRoleMultiPicker().Get[odata/Roles].done: result: ' + JSON.stringify(result));
                    }
                    // Get the "Cond" value.
                    var cond = $('#' + elementId).find('.cond').attr('bwOldValue'); // eg: 	$ProjectType~IM,FS,WS,ENV,PSM,IT,EXP
                    if (cond) {
                        // We have to parse out the selected/existing project types here.
                        var selectedPillars = cond.split('$ParentOrg~')[1];
                        if (selectedPillars && selectedPillars.indexOf('&') > -1) {
                            selectedPillars = selectedPillars.split('&')[0];
                        }
                    }
                    var html = '';
                    html += '<input type="hidden" id="RoleMultiPickerDialog_AssignmentElementId" value="' + elementId + '" />'; // This is how we will be able to look up the assignment row.
                    if (availablePillars) {
                        html += '<table>';
                        for (var i = 0; i < availablePillars.length; i++) {
                            html += '<tr class="orgRow">';
                            // Iterate through the list to see if we have a selected one or not.
                            var isSelected = false;
                            if (selectedPillars) {
                                for (var p = 0; p < selectedPillars.split(',').length; p++) {
                                    if (availablePillars[i].OrgId == selectedPillars.split(',')[p]) {
                                        //console.log('availablePillars[i].OrgId: ' + availablePillars[i].OrgId + ', selectedPillars.split(',')[p]: ' + selectedPillars.split(',')[p]);
                                        isSelected = true;
                                    }
                                }
                            }
                            if (isSelected) {
                                html += '<td>xcx61<input id="' + 'roleCheckbox_' + i + '" type="checkbox" checked /></td>';
                            } else {
                                html += '<td>xcx62<input id="' + 'roleCheckbox_' + i + '" type="checkbox" /></td>';
                            }
                            html += '<td class="roleId">' + availablePillars[i].OrgId + '</td>';
                            html += '<td>&nbsp;</td>';
                            html += '<td class="roleName">' + availablePillars[i].OrgName + '</td>';
                            html += '</tr>';
                        }
                        html += '</table>';
                    } else {
                        html += 'No "Roles" were available.';
                    }
                    $('#spanRoleMultiPickerDialogContent').html(html);

                    $("#divRoleMultiPickerDialog").dialog({
                        modal: true,
                        resizable: false,
                        //closeText: "Cancel",
                        closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                        title: 'Project Type picker',
                        width: '800',
                        dialogClass: 'no-close', // No close button in the upper right corner.
                        hide: false, // This means when hiding just disappear with no effects.
                        open: function () {
                            $('.ui-widget-overlay').bind('click', function () {
                                $('#divRoleMultiPickerDialog').dialog('close');
                            });
                        },
                        close: function () {
                            //$(this).dialog('destroy').remove();
                        }
                        //buttons: {
                        //    "Close": function () {
                        //        $(this).dialog("close");
                        //    }
                        //}
                    });
                    $('#divRoleMultiPickerDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
                } catch (e) {
                    //lpSpinner.Hide();
                    console.log('Exception in raci.html.displayRoleMultiPicker().Get[odata/Orgs].done: ' + e.message + ', ' + e.stack);
                }
            }).fail(function (data) {
                //lpSpinner.Hide();
                var msg;
                if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                } else {
                    msg = JSON.stringify(data);
                }
                alert('Error in raci.html.displayRoleMultiPicker().Get[odata/Orgs].fail: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                console.log('Error in raci.html.displayRoleMultiPicker().Get[odata/Orgs].fail:' + JSON.stringify(data));
                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                //var error = JSON.parse(data.responseText)["odata.error"];
                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            });
        } catch (e) {
            console.log('Exception in displayRoleMultiPicker(): ' + e.message + ', ' + e.stack);
        }
    } catch (e) {
        console.log('Exception in displayRoleMultiPicker(): ' + e.message + ', ' + e.stack);
    }
},
displayOrgMultiPicker: function (elementId) {
    try {
        console.log('In displayOrgMultiPicker().');
        try {
            console.log('In displayOrgMultiPicker(). elementId: ' + elementId);
            $.ajax({
                url: this.options.operationUriPrefix + "odata/Orgs",
                dataType: "json",
                contentType: "application/json",
                type: "Get",
                timeout: this.options.ajaxTimeout
            }).done(function (result) {
                try {
                    //console.log('In raci.html.displayOrgMultiPicker().Get[odata/Orgs].done: result: ' + JSON.stringify(result));
                    var availablePillars;
                    if (result) {
                        availablePillars = result.value;
                    } else {
                        console.log('In raci.html.displayOrgMultiPicker().Get[odata/Roles].done: result: ' + JSON.stringify(result));
                    }
                    // Get the "Cond" value.
                    var cond = $('#' + elementId).find('.cond').attr('bwOldValue'); // eg: 	$ProjectType~IM,FS,WS,ENV,PSM,IT,EXP
                    if (cond) {
                        // We have to parse out the selected/existing project types here.
                        var selectedPillars = cond.split('$ParentOrg~')[1];
                        if (selectedPillars && selectedPillars.indexOf('&') > -1) {
                            selectedPillars = selectedPillars.split('&')[0];
                        }
                    }
                    var html = '';
                    html += '<input type="hidden" id="OrgMultiPickerDialog_AssignmentElementId" value="' + elementId + '" />'; // This is how we will be able to look up the assignment row.
                    if (availablePillars) {
                        html += '<table>';
                        for (var i = 0; i < availablePillars.length; i++) {
                            html += '<tr class="orgRow">';
                            // Iterate through the list to see if we have a selected one or not.
                            var isSelected = false;
                            if (selectedPillars) {
                                for (var p = 0; p < selectedPillars.split(',').length; p++) {
                                    if (availablePillars[i].OrgId == selectedPillars.split(',')[p]) {
                                        //console.log('availablePillars[i].OrgId: ' + availablePillars[i].OrgId + ', selectedPillars.split(',')[p]: ' + selectedPillars.split(',')[p]);
                                        isSelected = true;
                                    }
                                }
                            }
                            if (isSelected) {
                                html += '<td><input id="' + 'orgCheckbox_' + i + '" type="checkbox" checked /></td>';
                            } else {
                                html += '<td><input id="' + 'orgCheckbox_' + i + '" type="checkbox" /></td>';
                            }
                            html += '<td class="orgId">' + availablePillars[i].OrgId + '</td>';
                            html += '<td>&nbsp;</td>';
                            html += '<td class="orgName">' + availablePillars[i].OrgName + '</td>';
                            html += '</tr>';
                        }
                        html += '</table>';
                    } else {
                        html += 'No "Orgs" were available.';
                    }
                    $('#spanOrgMultiPickerDialogContent').html(html);

                    $("#divOrgMultiPickerDialog").dialog({
                        modal: true,
                        resizable: false,
                        //closeText: "Cancel",
                        closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                        title: 'Project Type picker',
                        width: '800',
                        dialogClass: 'no-close', // No close button in the upper right corner.
                        hide: false, // This means when hiding just disappear with no effects.
                        open: function () {
                            $('.ui-widget-overlay').bind('click', function () {
                                $('#divOrgMultiPickerDialog').dialog('close');
                            });
                        },
                        close: function () {
                            //$(this).dialog('destroy').remove();
                        }
                        //buttons: {
                        //    "Close": function () {
                        //        $(this).dialog("close");
                        //    }
                        //}
                    });
                    $('#divOrgMultiPickerDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
                } catch (e) {
                    //lpSpinner.Hide();
                    console.log('Exception in raci.html.displayOrgMultiPicker().Get[odata/Orgs].done: ' + e.message + ', ' + e.stack);
                }
            }).fail(function (data) {
                //lpSpinner.Hide();
                var msg;
                if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                } else {
                    msg = JSON.stringify(data);
                }
                alert('Error in raci.html.displayOrgMultiPicker().Get[odata/Orgs].fail: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                console.log('Error in raci.html.displayOrgMultiPicker().Get[odata/Orgs].fail:' + JSON.stringify(data));
                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                //var error = JSON.parse(data.responseText)["odata.error"];
                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            });
        } catch (e) {
            console.log('Exception in displayOrgMultiPicker(): ' + e.message + ', ' + e.stack);
        }
    } catch (e) {
        console.log('Exception in displayOrgMultiPicker(): ' + e.message + ', ' + e.stack);
    }
},
displayProjectTypeMultiPicker: function (elementId) {
    try {
        console.log('In displayProjectTypeMultiPicker(). elementId: ' + elementId);



        var thiz = this;
        var operationUri = webserviceurl + "/getfunctionalareasbyappid/" + this.options.workflowAppId + "/" + "RETURNALL";
        $.ajax({
            url: operationUri,
            method: "GET",
            headers: {
                "Accept": "application/json; odata=verbose"
            },
            success: function (data) {
                try {
                    //var year = document.getElementById('ddlYear').value;
                    //var year = '2016'; // todd hardcoded
                    //var year = new Date().getFullYear().toString(); // todd hardcoded.
                    //$('#ddlFunctionalArea').empty(); // Clear the previous entries before we populate it.





                    if (thiz.options.workflowAppId == null) {
                        // Not logged in so we will use these defaults for the time being.
                        var availableProjectTypes = [
                            { bwFunctionalAreaYear: '2019', IsHidden: 'false', bwFunctionalAreaId: '1', bwFunctionalAreaQuote: 'false', bwFunctionalAreaTitle: 'Buildings' },
                            { bwFunctionalAreaYear: '2019', IsHidden: 'false', bwFunctionalAreaId: '1', bwFunctionalAreaQuote: 'false', bwFunctionalAreaTitle: 'Computer equipment' },
                            { bwFunctionalAreaYear: '2019', IsHidden: 'false', bwFunctionalAreaId: '1', bwFunctionalAreaQuote: 'false', bwFunctionalAreaTitle: 'Office equipment' },
                            { bwFunctionalAreaYear: '2019', IsHidden: 'false', bwFunctionalAreaId: '1', bwFunctionalAreaQuote: 'false', bwFunctionalAreaTitle: 'Furniture and fixtures' },
                            { bwFunctionalAreaYear: '2019', IsHidden: 'false', bwFunctionalAreaId: '1', bwFunctionalAreaQuote: 'false', bwFunctionalAreaTitle: 'Intangible assets' },
                            { bwFunctionalAreaYear: '2019', IsHidden: 'false', bwFunctionalAreaId: '1', bwFunctionalAreaQuote: 'false', bwFunctionalAreaTitle: 'Land' },
                            { bwFunctionalAreaYear: '2019', IsHidden: 'false', bwFunctionalAreaId: '1', bwFunctionalAreaQuote: 'false', bwFunctionalAreaTitle: 'Machinery' },
                            { bwFunctionalAreaYear: '2019', IsHidden: 'false', bwFunctionalAreaId: '1', bwFunctionalAreaQuote: 'false', bwFunctionalAreaTitle: 'Software' },
                            { bwFunctionalAreaYear: '2019', IsHidden: 'false', bwFunctionalAreaId: '1', bwFunctionalAreaQuote: 'false', bwFunctionalAreaTitle: 'Vehicles' },
                        ];
                        //var data = {
                        //    d: {
                        //        results: result
                        //    }
                        //};
                    }

                    //Buildings (including subsequent costs that extend the useful life of a building)
                    //Computer equipment
                    //Office equipment
                    //Furniture and fixtures (including the cost of furniture that is aggregated and treated as a single unit, such as a group of desks)
                    //Intangible assets (such as a purchased taxi license or a patent)
                    //Land (including the cost of upgrading the land, such as the cost of an irrigation system or a parking lot)
                    //Machinery (including the costs required to bring the equipment to its intended location and for its intended use)
                    //Software
                    //Vehicles

                    var html = '';
                    html += '<table>';
                    for (var i = 0; i < availableProjectTypes.length; i++) {
                        html += '<tr class="projectTypeRow">';
                        // Iterate through the list to see if we have a selected one or not.
                        var isSelected = false;
                        //if (selectedProjectTypes) {
                        //    for (var p = 0; p < selectedProjectTypes.split(',').length; p++) {
                        //        if (availableProjectTypes[i].ProjectTypeId == selectedProjectTypes.split(',')[p]) {
                        //            //console.log('availableProjectTypes[i].ProjectTypeId: ' + availableProjectTypes[i].ProjectTypeId + ', selectedProjectTypes.split(',')[p]: ' + selectedProjectTypes.split(',')[p]);
                        //            isSelected = true;
                        //        }
                        //    }
                        //}
                        //if (isSelected) {
                        //    html += '<td><input id="' + 'projectTypeCheckbox_' + i + '" type="checkbox" checked /></td>';
                        //} else {
                        html += '<td><input id="' + 'projectTypeCheckbox_' + i + '" type="checkbox" /></td>';
                        //}
                        html += '<td class="projectTypeId">' + availableProjectTypes[i].bwFunctionalAreaTitle + '</td>';
                        html += '<td>&nbsp;</td>';
                        //html += '<td class="projectTypeName">' + availableProjectTypes[i].bwFunctionalAreaTitle + '</td>';
                        html += '<td class="projectTypeName"></td>';
                        html += '</tr>';
                    }
                    html += '</table>';


                    $('#spanProjectTypeMultiPickerDialogContent').html(html);


                    $("#divProjectTypeMultiPickerDialog").dialog({
                        modal: true,
                        resizable: false,
                        //closeText: "Cancel",
                        closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                        title: 'Project Type picker',
                        width: '800',
                        dialogClass: 'no-close', // No close button in the upper right corner.
                        hide: false, // This means when hiding just disappear with no effects.
                        open: function () {
                            $('.ui-widget-overlay').bind('click', function () {
                                $('#divProjectTypeMultiPickerDialog').dialog('close');
                            });
                        },
                        close: function () {
                            //$(this).dialog('destroy').remove();
                        }
                        //buttons: {
                        //    "Close": function () {
                        //        $(this).dialog("close");
                        //    }
                        //}
                    });
                    $('#divProjectTypeMultiPickerDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
















                } catch (e) {
                    //lpSpinner.Hide();
                    console.log('Exception in raci.html.displayProjectTypeMultiPicker().Get[odata/ProjectTypes].done: ' + e.message + ', ' + e.stack);
                }
            },
            error: function (data, errorCode, errorMessage) {
                displayAlertDialog('Error populating functional areas.');
                //WriteToErrorLog('Error in bw.initar.js.populateFunctionalAreas()', 'Error populating functional areas: ' + errorCode + ', ' + errorMessage);
            }
        });
















        //$.ajax({
        //    url: this.options.operationUriPrefix + "odata/ProjectTypes", //
        //    dataType: "json",
        //    contentType: "application/json",
        //    type: "Get",
        //    timeout: this.options.ajaxTimeout
        //}).done(function (result) {
        //    try {
        //        //console.log('In raci.html.displayProjectTypeMultiPicker().Get[odata/ProjectTypes].done: result: ' + JSON.stringify(result));
        //        var availableProjectTypes;
        //        if (result) {
        //            availableProjectTypes = result.value;
        //        } else {
        //            console.log('In raci.html.displayProjectTypeMultiPicker().Get[odata/Roles].done: result: ' + JSON.stringify(result));
        //        }
        //        // Get the "Cond" value.
        //        var cond = $('#' + elementId).find('.cond').attr('bwOldValue'); // eg: 	$ProjectType~IM,FS,WS,ENV,PSM,IT,EXP
        //        if (cond) {
        //            // We have to parse out the selected/existing project types here.
        //            var selectedProjectTypes = cond.split('$ProjectType~')[1];
        //            if (selectedProjectTypes && selectedProjectTypes.indexOf('&') > -1) {
        //                selectedProjectTypes = selectedProjectTypes.split('&')[0];
        //            }
        //        }
        //        var html = '';
        //        html += '<input type="hidden" id="ProjectTypeMultiPickerDialog_AssignmentElementId" value="' + elementId + '" />'; // This is how we will be able to look up the assignment row.
        //        if (availableProjectTypes) {
        //            html += '<table>';
        //            for (var i = 0; i < availableProjectTypes.length; i++) {
        //                html += '<tr class="projectTypeRow">';
        //                // Iterate through the list to see if we have a selected one or not.
        //                var isSelected = false;
        //                if (selectedProjectTypes) {
        //                    for (var p = 0; p < selectedProjectTypes.split(',').length; p++) {
        //                        if (availableProjectTypes[i].ProjectTypeId == selectedProjectTypes.split(',')[p]) {
        //                            //console.log('availableProjectTypes[i].ProjectTypeId: ' + availableProjectTypes[i].ProjectTypeId + ', selectedProjectTypes.split(',')[p]: ' + selectedProjectTypes.split(',')[p]);
        //                            isSelected = true;
        //                        }
        //                    }
        //                }
        //                if (isSelected) {
        //                    html += '<td><input id="' + 'projectTypeCheckbox_' + i + '" type="checkbox" checked /></td>';
        //                } else {
        //                    html += '<td><input id="' + 'projectTypeCheckbox_' + i + '" type="checkbox" /></td>';
        //                }
        //                html += '<td class="projectTypeId">' + availableProjectTypes[i].ProjectTypeId + '</td>';
        //                html += '<td>&nbsp;</td>';
        //                html += '<td class="projectTypeName">' + availableProjectTypes[i].Name + '</td>';
        //                html += '</tr>';
        //            }
        //            html += '</table>';
        //        } else {
        //            html += 'No "Project Types" were available.';
        //        }

        //        $('#spanProjectTypeMultiPickerDialogContent').html(html);

        //        $("#divProjectTypeMultiPickerDialog").dialog({
        //            modal: true,
        //            resizable: false,
        //            //closeText: "Cancel",
        //            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
        //            title: 'Project Type picker',
        //            width: '800',
        //            dialogClass: 'no-close', // No close button in the upper right corner.
        //            hide: false, // This means when hiding just disappear with no effects.
        //            open: function () {
        //                $('.ui-widget-overlay').bind('click', function () {
        //                    $('#divProjectTypeMultiPickerDialog').dialog('close');
        //                });
        //            },
        //            close: function () {
        //                //$(this).dialog('destroy').remove();
        //            }
        //            //buttons: {
        //            //    "Close": function () {
        //            //        $(this).dialog("close");
        //            //    }
        //            //}
        //        });
        //        $('#divProjectTypeMultiPickerDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
        //    } catch (e) {
        //        //lpSpinner.Hide();
        //        console.log('Exception in raci.html.displayProjectTypeMultiPicker().Get[odata/ProjectTypes].done: ' + e.message + ', ' + e.stack);
        //    }
        //}).fail(function (data) {
        //    //lpSpinner.Hide();
        //    var msg;
        //    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
        //        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
        //    } else {
        //        msg = JSON.stringify(data);
        //    }
        //    alert('Error in raci.html.displayProjectTypeMultiPicker().Get[odata/ProjectTypes].fail: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
        //    console.log('Error in raci.html.displayProjectTypeMultiPicker().Get[odata/ProjectTypes].fail:' + JSON.stringify(data));
        //    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
        //    //var error = JSON.parse(data.responseText)["odata.error"];
        //    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
        //});
    } catch (e) {
        console.log('Exception in displayProjectTypeMultiPicker(): ' + e.message + ', ' + e.stack);
    }
},
displayPillarMultiPicker: function (elementId) {
    try {
        console.log('In displayPillarMultiPicker().');
        try {
            console.log('In displayPillarMultiPicker(). elementId: ' + elementId);
            $.ajax({
                url: this.options.operationUriPrefix + "odata/Pillars",
                dataType: "json",
                contentType: "application/json",
                type: "Get",
                timeout: this.options.ajaxTimeout
            }).done(function (result) {
                try {
                    //console.log('In raci.html.displayPillarMultiPicker().Get[odata/Pillars].done: result: ' + JSON.stringify(result));
                    var availablePillars;
                    if (result) {
                        availablePillars = result.value;
                    } else {
                        console.log('In raci.html.displayPillarMultiPicker().Get[odata/Roles].done: result: ' + JSON.stringify(result));
                    }
                    // Get the "Cond" value.
                    var cond = $('#' + elementId).find('.cond').attr('bwOldValue'); // eg: 	$ProjectType~IM,FS,WS,ENV,PSM,IT,EXP
                    if (cond) {
                        // We have to parse out the selected/existing project types here.
                        var selectedPillars = cond.split('$PillarId~')[1];
                        if (selectedPillars && selectedPillars.indexOf('&') > -1) {
                            selectedPillars = selectedPillars.split('&')[0];
                        }
                    }
                    var html = '';
                    html += '<input type="hidden" id="PillarMultiPickerDialog_AssignmentElementId" value="' + elementId + '" />'; // This is how we will be able to look up the assignment row.
                    if (availablePillars) {
                        html += '<table>';
                        for (var i = 0; i < availablePillars.length; i++) {
                            html += '<tr class="pillarRow">';
                            // Iterate through the list to see if we have a selected one or not.
                            var isSelected = false;
                            if (selectedPillars) {
                                for (var p = 0; p < selectedPillars.split(',').length; p++) {
                                    if (availablePillars[i].PillarId == selectedPillars.split(',')[p]) {
                                        //console.log('availablePillars[i].PillarId: ' + availablePillars[i].PillarId + ', selectedPillars.split(',')[p]: ' + selectedPillars.split(',')[p]);
                                        isSelected = true;
                                    }
                                }
                            }
                            if (isSelected) {
                                html += '<td><input id="' + 'pillarCheckbox_' + i + '" type="checkbox" checked /></td>';
                            } else {
                                html += '<td><input id="' + 'pillarCheckbox_' + i + '" type="checkbox" /></td>';
                            }
                            html += '<td class="pillarId">' + availablePillars[i].PillarId + '</td>';
                            html += '<td>&nbsp;</td>';
                            html += '<td class="pillarName">' + availablePillars[i].Name + '</td>';
                            html += '</tr>';
                        }
                        html += '</table>';
                    } else {
                        html += 'No "Pillars" were available.';
                    }
                    $('#spanPillarMultiPickerDialogContent').html(html);

                    $("#divPillarMultiPickerDialog").dialog({
                        modal: true,
                        resizable: false,
                        //closeText: "Cancel",
                        closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                        title: 'Project Type picker',
                        width: '800',
                        dialogClass: 'no-close', // No close button in the upper right corner.
                        hide: false, // This means when hiding just disappear with no effects.
                        open: function () {
                            $('.ui-widget-overlay').bind('click', function () {
                                $('#divPillarMultiPickerDialog').dialog('close');
                            });
                        },
                        close: function () {
                            //$(this).dialog('destroy').remove();
                        }
                        //buttons: {
                        //    "Close": function () {
                        //        $(this).dialog("close");
                        //    }
                        //}
                    });
                    $('#divPillarMultiPickerDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
                } catch (e) {
                    //lpSpinner.Hide();
                    console.log('Exception in raci.html.displayPillarMultiPicker().Get[odata/Pillars].done: ' + e.message + ', ' + e.stack);
                }
            }).fail(function (data) {
                //lpSpinner.Hide();
                var msg;
                if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                } else {
                    msg = JSON.stringify(data);
                }
                alert('Error in raci.html.displayPillarMultiPicker().Get[odata/Pillars].fail: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                console.log('Error in raci.html.displayPillarMultiPicker().Get[odata/Pillars].fail:' + JSON.stringify(data));
                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                //var error = JSON.parse(data.responseText)["odata.error"];
                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            });
        } catch (e) {
            console.log('Exception in displayPillarMultiPicker(): ' + e.message + ', ' + e.stack);
        }
    } catch (e) {
        console.log('Exception in displayPillarMultiPicker(): ' + e.message + ', ' + e.stack);
    }
},

displayPeoplePickerDialog: function (friendlyNameSourceField, idSourceField, emailSourceField, buttonToEnable) {
    try {
        console.log('In displayPeoplePickerDialog().');
        var thiz = this;

        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

        if (!participantId) {
            console.log('In displayPeoplePickerDialog(). User is not logged in, so displaying the logon.');
            initializeTheLogon(); // The user needs to be logged in before they add anyone.
        } else {
            $('#txtPeoplePickerDialogSearchBox').empty(); // Clear the search text box.
            $('#PeoplePickerDialog').dialog({
                modal: true,
                resizable: false,
                closeText: "Cancel",
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                //title: "Select a person...", //"Enter your early adopter code...",
                width: "570px",
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#PeoplePickerDialog").dialog('close');
                    });
                } // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.
            });
            $("#PeoplePickerDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            $('#spanPeoplePickerDialogTitle').html('Select a person...');

            // Now we can hook up the Participant text box for autocomplete.
            $("#txtPeoplePickerDialogSearchBox").autocomplete({
                source: function (request, response) {
                    if (request.term == '') {
                        this.renderAllParticipantsInThePeoplePicker(); // Nothing is in the search box, so show all participants.
                    } else {
                        $.ajax({
                            //url: appweburl + "/tenant/" + tenantId + "/participants/" + request.term,
                            url: webserviceurl + "/workflow/" + workflowAppId + "/participants/" + request.term,
                            dataType: "json",
                            success: function (data) {
                                $('#spanPeoplePickerParticipantsList').empty();
                                var html = '';
                                if (data.participants.length > 0) {
                                    //var searchArray = [];
                                    for (var i = 0; i < data.participants.length; i++) {
                                        //searchArray[i] = data.participants[i].participant;
                                        //var strParticipant = '<a href="">' + data.participants[i].participant.split('|')[0] + ' <i>(' + data.participants[i].participant.split('|')[2] + ')</i></a>';

                                        html += '<a href="javascript:$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'cmdReturnParticipantIdToField\', \'' + friendlyNameSourceField + '\', \'' + idSourceField + '\', \'' + emailSourceField + '\', \'' + data.participants[i].participant.split('|')[0] + '\', \'' + data.participants[i].participant.split('|')[1] + '\', \'' + data.participants[i].participant.split('|')[2] + '\', \'' + buttonToEnable + '\');">' + data.participants[i].participant.split('|')[0] + '&nbsp;&nbsp;<i>(' + data.participants[i].participant.split('|')[2] + ')</i></a>';


                                        //html += strParticipant; //data.participants[i].participant;
                                        html += '<br />';
                                        //response(searchArray);
                                    }
                                } else {
                                    // There were no results.
                                    html += '<span><i>There were no results</i></span>';
                                }
                                $('#spanPeoplePickerParticipantsList').append(html);
                            }
                        });
                    }
                },
                minLength: 0, // minLength specifies how many characters have to be typed before this gets invoked.
                select: function (event, ui) {
                    //log(ui.item ? "Selected: " + ui.item.label : "Nothing selected, input was " + this.value);
                    //document.getElementById('btnSearch').disabled = false; // Enable the search button when there is valid content in it.
                },
                open: function () {
                    //$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
                    //document.getElementById('btnSearch').disabled = true; // Disable the search button until there is valid content in it.
                },
                close: function () {
                    //$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                    var peoplePickerParticipantName = this.value.split('|')[0];
                    var peoplePickerParticipantId = this.value.split('|')[1];
                    var peoplePickerParticipantEmail = this.value.split('|')[2];

                    if (peoplePickerParticipantName.indexOf('undefined') > -1) {
                        document.getElementById('txtPeoplePickerDialogSearchBox').value = '';
                        document.getElementById('txtPeoplePickerDialogParticipantId').value = '';
                        document.getElementById('txtPeoplePickerDialogParticipantEmail').value = '';
                    } else {
                        document.getElementById('txtPeoplePickerDialogSearchBox').value = peoplePickerParticipantName; //this.value.split(' ')[0] + ' ' + this.value.split(' ')[1]; // Just shows the Loan Number parameter (removing the borrower name) so it fits in the text box.
                        document.getElementById('txtPeoplePickerDialogParticipantId').value = peoplePickerParticipantId;
                        document.getElementById('txtPeoplePickerDialogParticipantEmail').value = peoplePickerParticipantEmail;
                    }
                }
            });

            // List all participants.
            this.renderAllParticipantsInThePeoplePicker(friendlyNameSourceField, idSourceField, emailSourceField, buttonToEnable); // We do this the first time to make sure they are all displayed.
        }
    } catch (e) {
        console.log('Exception in displayPeoplePickerDialog: ' + e.message + ', ' + e.stack);
        displayAlertDialog('Exception in displayPeoplePickerDialog: ' + e.message + ', ' + e.stack);
    }
},

displayPeoplePickerDialogForJson: function (roleId, roleName, divisionIndex, groupIndex, entityIndex, locationIndex) {
    try {
        //debugger;
        console.log('In displayPeoplePickerDialogForJson().');
        if (!participantId) {
            console.log('In displayPeoplePickerDialogForJson(). User is not logged in, so displaying the logon.');
            initializeTheLogon(); // The user needs to be logged in before they add anyone.
        } else {
            $('#txtPeoplePickerDialogSearchBox').empty(); // Clear the search text box.
            $('#PeoplePickerDialog').dialog({
                modal: true,
                resizable: false,
                closeText: "Cancel",
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                //title: "Select a person...", //"Enter your early adopter code...",
                width: "570px",
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#PeoplePickerDialog").dialog('close');
                    });
                } // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.
            });
            $("#PeoplePickerDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            $('#spanPeoplePickerDialogTitle').html('Select a person...');

            // Now we can hook up the Participant text box for autocomplete.
            $("#txtPeoplePickerDialogSearchBox").autocomplete({
                source: function (request, response) {
                    if (request.term == '') {
                        this.renderAllParticipantsInThePeoplePicker(); // Nothing is in the search box, so show all participants.
                    } else {
                        $.ajax({
                            //url: appweburl + "/tenant/" + tenantId + "/participants/" + request.term,
                            url: webserviceurl + "/workflow/" + workflowAppId + "/participants/" + request.term,
                            dataType: "json",
                            success: function (data) {
                                $('#spanPeoplePickerParticipantsList').empty();
                                var html = '';
                                if (data.participants.length > 0) {
                                    //var searchArray = [];
                                    for (var i = 0; i < data.participants.length; i++) {
                                        //searchArray[i] = data.participants[i].participant;
                                        //var strParticipant = '<a href="">' + data.participants[i].participant.split('|')[0] + ' <i>(' + data.participants[i].participant.split('|')[2] + ')</i></a>';

                                        html += '<a href="javascript:$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'cmdReturnParticipantIdToFieldForJson\', \'' + roleId + '\', \'' + roleName + '\', \'' + divisionIndex + '\', \'' + groupIndex + '\', \'' + entityIndex + '\', \'' + locationIndex + '\', \'' + data.participants[i].participant.split('|')[0] + '\', \'' + data.participants[i].participant.split('|')[1] + '\', \'' + data.participants[i].participant.split('|')[2] + '\');">' + data.participants[i].participant.split('|')[0] + '&nbsp;&nbsp;<i>(' + data.participants[i].participant.split('|')[2] + ')</i></a>';


                                        //html += strParticipant; //data.participants[i].participant;
                                        html += '<br />';
                                        //response(searchArray);
                                    }
                                } else {
                                    // There were no results.
                                    html += '<span><i>There were no results</i></span>';
                                }
                                $('#spanPeoplePickerParticipantsList').append(html);
                            }
                        });
                    }
                },
                minLength: 0, // minLength specifies how many characters have to be typed before this gets invoked.
                select: function (event, ui) {
                    //log(ui.item ? "Selected: " + ui.item.label : "Nothing selected, input was " + this.value);
                    //document.getElementById('btnSearch').disabled = false; // Enable the search button when there is valid content in it.
                },
                open: function () {
                    //$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
                    //document.getElementById('btnSearch').disabled = true; // Disable the search button until there is valid content in it.
                },
                close: function () {
                    //$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                    debugger;
                    var peoplePickerParticipantName = this.value.split('|')[0];
                    var peoplePickerParticipantId = this.value.split('|')[1];
                    var peoplePickerParticipantEmail = this.value.split('|')[2];

                    if (peoplePickerParticipantName.indexOf('undefined') > -1) {
                        document.getElementById('txtPeoplePickerDialogSearchBox').value = '';
                        document.getElementById('txtPeoplePickerDialogParticipantId').value = '';
                        document.getElementById('txtPeoplePickerDialogParticipantEmail').value = '';
                    } else {
                        document.getElementById('txtPeoplePickerDialogSearchBox').value = peoplePickerParticipantName; //this.value.split(' ')[0] + ' ' + this.value.split(' ')[1]; // Just shows the Loan Number parameter (removing the borrower name) so it fits in the text box.
                        document.getElementById('txtPeoplePickerDialogParticipantId').value = peoplePickerParticipantId;
                        document.getElementById('txtPeoplePickerDialogParticipantEmail').value = peoplePickerParticipantEmail;
                    }
                }
            });

            // List all participants.
            this.renderAllParticipantsInThePeoplePickerForJson(roleId, roleName, divisionIndex, groupIndex, entityIndex, locationIndex); // We do this the first time to make sure they are all displayed.
        }
    } catch (e) {
        console.log('Exception in displayPeoplePickerDialogForJson: ' + e.message + ', ' + e.stack);
    }
},

displayConfigureEmailNotificationsDialog: function (elementId) {
    try {
        console.log('In displayConfigureEmailNotificationsDialog().');
        try {
            console.log('In displayConfigureEmailNotificationsDialog(). elementId: ' + elementId);
            $.ajax({
                url: this.options.operationUriPrefix + "odata/Pillars",
                dataType: "json",
                contentType: "application/json",
                type: "Get",
                timeout: this.options.ajaxTimeout
            }).done(function (result) {
                try {
                    //console.log('In raci.html.displayPillarMultiPicker().Get[odata/Pillars].done: result: ' + JSON.stringify(result));
                    var availablePillars;
                    if (result) {
                        availablePillars = result.value;
                    } else {
                        console.log('In raci.html.displayConfigureEmailNotificationsDialog().Get[odata/Roles].done: result: ' + JSON.stringify(result));
                    }
                    // Get the "Cond" value.
                    var cond = $('#' + elementId).find('.cond').attr('bwOldValue'); // eg: 	$ProjectType~IM,FS,WS,ENV,PSM,IT,EXP
                    if (cond) {
                        // We have to parse out the selected/existing project types here.
                        var selectedPillars = cond.split('$PillarId~')[1];
                        if (selectedPillars && selectedPillars.indexOf('&') > -1) {
                            selectedPillars = selectedPillars.split('&')[0];
                        }
                    }
                    var html = '';
                    html += '<input type="hidden" id="ConfigureEmailNotificationsDialog_AssignmentElementId" value="' + elementId + '" />'; // This is how we will be able to look up the assignment row.
                    if (availablePillars) {
                        html += '<table>';
                        for (var i = 0; i < availablePillars.length; i++) {
                            html += '<tr class="pillarRow">';
                            // Iterate through the list to see if we have a selected one or not.
                            var isSelected = false;
                            if (selectedPillars) {
                                for (var p = 0; p < selectedPillars.split(',').length; p++) {
                                    if (availablePillars[i].PillarId == selectedPillars.split(',')[p]) {
                                        //console.log('availablePillars[i].PillarId: ' + availablePillars[i].PillarId + ', selectedPillars.split(',')[p]: ' + selectedPillars.split(',')[p]);
                                        isSelected = true;
                                    }
                                }
                            }
                            if (isSelected) {
                                html += '<td><input id="' + 'pillarCheckbox_' + i + '" type="checkbox" checked /></td>';
                            } else {
                                html += '<td><input id="' + 'pillarCheckbox_' + i + '" type="checkbox" /></td>';
                            }
                            html += '<td class="pillarId">' + availablePillars[i].PillarId + '</td>';
                            html += '<td>&nbsp;</td>';
                            html += '<td class="pillarName">' + availablePillars[i].Name + '</td>';
                            html += '</tr>';
                        }
                        html += '</table>';
                    } else {
                        html += 'No "Pillars" were available.';
                    }
                    $('#spanConfigureEmailNotificationsDialogContent').html(html);

                    $("#divConfigureEmailNotificationsDialog").dialog({
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
                                $('#divConfigureEmailNotificationsDialog').dialog('close');
                            });

                            //console.log('$(".ql-toolbar"): ' + JSON.stringify($('.ql-toolbar')));
                            //if (!document.getElementById('ConfigureEmailNotificationsDialogEditor').length || document.getElementById('ConfigureEmailNotificationsDialogEditor').length == 0) { // Check if it has been instantiated already.
                            //if (!document.getElementById('ConfigureEmailNotificationsDialogEditor').div == 'undefined') { // Check if it has been instantiated already.
                            //if (!$('.ql-toolbar')) {
                            var quill = new Quill('#ConfigureEmailNotificationsDialogEditor', {
                                modules: {
                                    toolbar: [
                                        [{ header: [1, 2, false] }],
                                        ['bold', 'italic', 'underline'],
                                        ['image', 'code-block']
                                    ]
                                },
                                placeholder: 'The enhanced notification email editor functionality is coming soon...', //'Compose an epic...',
                                theme: 'snow'  // or 'bubble'
                            });
                        },
                        close: function () {
                            $('#divConfigureEmailNotificationsDialog').dialog('destroy');
                        }
                    });
                    $('#divConfigureEmailNotificationsDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
                } catch (e) {
                    //lpSpinner.Hide();
                    console.log('Exception in raci.html.displayConfigureEmailNotificationsDialog().Get[odata/Pillars].done: ' + e.message + ', ' + e.stack);
                }
            }).fail(function (data) {
                //lpSpinner.Hide();
                var msg;
                if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                } else {
                    msg = JSON.stringify(data);
                }
                alert('Error in raci.html.displayConfigureEmailNotificationsDialog().Get[odata/Pillars].fail: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                console.log('Error in raci.html.displayConfigureEmailNotificationsDialog().Get[odata/Pillars].fail:' + JSON.stringify(data));
                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                //var error = JSON.parse(data.responseText)["odata.error"];
                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            });
        } catch (e) {
            console.log('Exception in displayConfigureEmailNotificationsDialog(): ' + e.message + ', ' + e.stack);
        }
    } catch (e) {
        console.log('Exception in displayConfigureEmailNotificationsDialog(): ' + e.message + ', ' + e.stack);
    }
},
//editCollaborationTimeoutEmail: function() {
//    try {
//        console.log('In editCollaborationTimeoutEmail().');
//        var thiz = this;
//        // Set the dialog title.
//        document.getElementById('spanConfigureEmailNotificationsDialogSubTitle').innerHTML = 'This email gets sent to participants of the "Collaboration" stage when it times out';
//        // Display the email editor.
//        $("#divConfigureEmailNotificationsDialog").dialog({
//            modal: true,
//            resizable: false,
//            //closeText: "Cancel",
//            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
//            //title: 'divConfigureEmailNotificationsDialog',
//            width: '800',
//            dialogClass: 'no-close', // No close button in the upper right corner.
//            hide: false, // This means when hiding just disappear with no effects.
//            open: function () {
//                $('.ui-widget-overlay').bind('click', function () {
//                    $('#divConfigureEmailNotificationsDialog').dialog('close');
//                });
//                // Display the email editor.
//                thiz.options.quill = new Quill('#ConfigureEmailNotificationsDialogEditor', {
//                    modules: {
//                        toolbar: '#bwQuilltoolbar'
//                    },
//                    //placeholder: 'The enhanced notification email editor functionality is coming soon...', 
//                    theme: 'snow'  
//                });
//                // Hook up this button event so that the user can insert data items into the email.
//                var customButton = document.querySelector('#btnQuill_InsertADataItem');
//                customButton.addEventListener('click', function () {
//                    console.log('btnQuill_InsertADataItem: This functionality is incomplete. Coming soon!');
//                    thiz.displayEmailDataItemPickerDialog();
//                });
//                // Retrieve the email from the workflow and display it in the editor.
//                var emailTemplate = '';
//                for (var i = 0; i < thiz.options.store.Workflow.Steps.Step.length; i++) {
//                    if (thiz.options.store.Workflow.Steps.Step[i]["@Name"] == 'Collaboration') {
//                        emailTemplate = thiz.options.store.Workflow.Steps.Step[i]["@EmailTemplate"];
//                        break;
//                    }
//                }
//                if (emailTemplate && emailTemplate != '') {
//                    thiz.options.quill.setText(emailTemplate); 
//                } else {
//                    thiz.options.quill.setText('');
//                }
//            },
//            close: function () {
//                //$(this).dialog('destroy').remove();
//            }
//        });
//        $('#divConfigureEmailNotificationsDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
//    } catch (e) {
//        console.log('Exception in editCollaborationTimeoutEmail(): ' + e.message + ', ' + e.stack);
//    }
//},
editStepEmails: function (stepName) {
    try {
        console.log('In editStepEmails().');
        var thiz = this;
        // Set the dialog title.
        document.getElementById('spanConfigureEmailNotificationsDialogSubTitle').innerHTML = 'This email gets sent to participants of the "' + stepName + '" stage';
        // Set the "Save" button.
        var html = '';
        html += '<div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveEmailTemplateForStep\', \'' + stepName + '\');">';
        html += 'Save this email template';
        html += '</div>';
        document.getElementById('spanConfigureEmailNotificationsDialogSaveButton').innerHTML = html;
        // Display the email editor.
        $("#divConfigureEmailNotificationsDialog").dialog({
            modal: true,
            resizable: false,
            //closeText: "Cancel",
            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
            //title: 'divConfigureEmailNotificationsDialog',
            width: '800',
            dialogClass: 'no-close', // No close button in the upper right corner.
            hide: false, // This means when hiding just disappear with no effects.
            open: function () {
                $('.ui-widget-overlay').bind('click', function () {
                    $('#divConfigureEmailNotificationsDialog').dialog('close');
                });
                // Display the email editor.
                thiz.options.quill = new Quill('#ConfigureEmailNotificationsDialogEditor', {
                    modules: {
                        toolbar: '#bwQuilltoolbar'
                    },
                    //placeholder: 'The enhanced notification email editor functionality is coming soon...', 
                    theme: 'snow'
                });
                // Hook up this button event so that the user can insert data items into the email.
                var customButton = document.querySelector('#btnQuill_InsertADataItem');
                customButton.addEventListener('click', function () {
                    console.log('btnQuill_InsertADataItem: This functionality is incomplete. Coming soon!');
                    thiz.displayEmailDataItemPickerDialog();
                });
                // Retrieve the email from the workflow and display it in the editor.
                var emailTemplate = '';
                for (var i = 0; i < thiz.options.store.Workflow.Steps.Step.length; i++) {
                    if (thiz.options.store.Workflow.Steps.Step[i]["@Name"] == stepName) {
                        emailTemplate = thiz.options.store.Workflow.Steps.Step[i]["@EmailTemplate"];
                        break;
                    }
                }
                if (emailTemplate && emailTemplate != '') {
                    thiz.options.quill.setText(emailTemplate);
                } else {
                    thiz.options.quill.setText('');
                }
            },
            close: function () {
                $('#divConfigureEmailNotificationsDialog').dialog('destroy');
            }
        });
        $('#divConfigureEmailNotificationsDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
    } catch (e) {
        console.log('Exception in editStepEmails(): ' + e.message + ', ' + e.stack);
    }
},
displayEmailDataItemPickerDialog: function () {
    try {
        console.log('In displayEmailDataItemPickerDialog().');
        //
        //debugger;
        $("#divEmailDataItemPickerDialog").dialog({
            modal: true,
            resizable: false,
            //closeText: "Cancel",
            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
            //title: 'divEmailDataItemPickerDialog',
            width: '600',
            dialogClass: "no-close", // No close button in the upper right corner.
            hide: false, // This means when hiding just disappear with no effects.
            open: function () {
                $('.ui-widget-overlay').bind('click', function () {
                    $("#divEmailDataItemPickerDialog").dialog('close');
                });
                //document.getElementById('txtCreateANewRoleDialog_RoleId').value = document.getElementById('textNewRoleId').value;
                //document.getElementById('txtCreateANewRoleDialog_RoleName').value = document.getElementById('textNewRoleName').value;
            },
            close: function () {
                //$(this).dialog('destroy').remove();
                $('#divEmailDataItemPickerDialog').dialog('destroy');
            }
        });
        //$("#divEmailDataItemPickerDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
        //debugger;
        document.getElementById('spanEmailDataItemPickerDialogSubTitle').innerHTML = 'Select a data item then click the "Insert" button...';
        var html = '';
        html += '<select id="selectEmailDataItemPickerDialogDataItem" style="padding:5px 5px 5px 5px;">';
        html += '   <option value="1">Select a data item...</option>';
        html += '   <option value="3">&#10697; Company Logo</option>';
        html += '   <option value="2">&#9863; Participant Friendly Name</option>';
        html += '   <option value="2">&#9863; Participant Email</option>';
        html += '   <option value="3">&#9992; Budget Request Link</option>';
        html += '   <option value="3">&#9993; Configure Email Settings Link</option>';
        html += '   <option value="3">&#9775; Disclaimer/Legal Text</option>';
        html += '   <option value="3">&#9746; Unsubscribe Link</option>';
        html += '   <option value="3">Budget Request Number</option>';
        html += '   <option value="3">Role Abbreviation</option>';
        html += '   <option value="3">Role Name</option>';
        html += '</select>';
        html += '&nbsp;&nbsp;';
        html += '<input style="padding:5px 10px 5px 10px;" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'insertEmailDataItem\');" type="button" value="Insert">';
        document.getElementById('spanEmailDataItemPickerDialogContentTop').innerHTML = html;
    } catch (e) {
        console.log('Exception in displayEmailDataItemPickerDialog(): ' + e.message + ', ' + e.stack);
    }
},
displayWorkflowActionsUnderlyingPropertiesDialog: function (elementId, actionTitle) {
    try {
        console.log('In displayWorkflowActionsUnderlyingPropertiesDialog(). elementId: ' + elementId + ', actionTitle: ' + actionTitle);
        var x = elementId.split('_')[1];
        var stepIndex = x.split('_')[0];
        var rowIndex = elementId.split('_')[2];

        //$("#divEmailDataItemPickerDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
        //debugger;
        document.getElementById('spanWorkflowActionsUnderlyingPropertiesDialogSubTitle').innerHTML = 'Update the properties for the "' + actionTitle + '" button, then click "Save"...';
        var html = '';
        // "@JavaScript": "$('#divRequestFormDialog').dialog('close');", "Tooltip": "Cancel the entire request"
        var tooltip = '';
        var javascript = '';
        //debugger;
        for (var i = 0; i < this.options.store.DraftWorkflow.Steps.Step[stepIndex].Assign[rowIndex].Action.length; i++) {
            if (this.options.store.DraftWorkflow.Steps.Step[stepIndex].Assign[rowIndex].Action[i]["@Name"] == actionTitle) {
                //debugger;
                var action = this.options.store.DraftWorkflow.Steps.Step[stepIndex].Assign[rowIndex].Action[i];
                if (action.Tooltip) tooltip = action.Tooltip;
                if (action["@JavaScript"]) javascript = action["@JavaScript"];
                break;
            }
        }
        html += 'Tooltip: <input id="WorkflowActionsUnderlyingPropertiesDialog_Tooltip" type="text" style="width:425px;" value="' + tooltip + '"/>';
        html += '<br />';
        html += '<br />';
        html += 'JavaScript: <input id="WorkflowActionsUnderlyingPropertiesDialog_JavaScript" type="text" style="width:425px;" value="' + javascript + '"/>';
        html += '<br />';
        html += '<br />';
        html += '&nbsp;&nbsp;';
        html += '<input style="padding:5px 10px 5px 10px;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveWorkflowActionsUnderlyingProperties\', \'' + elementId + '\', \'' + actionTitle + '\');" type="button" value="Save">';
        document.getElementById('spanWorkflowActionsUnderlyingPropertiesDialogContentTop').innerHTML = html;

        $("#divWorkflowActionsUnderlyingPropertiesDialog").dialog({
            modal: true,
            resizable: false,
            //closeText: "Cancel",
            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
            //title: 'divEmailDataItemPickerDialog',
            width: '600',
            dialogClass: "no-close", // No close button in the upper right corner.
            hide: false, // This means when hiding just disappear with no effects.
            open: function () {
                $('.ui-widget-overlay').bind('click', function () {
                    $('#divWorkflowActionsUnderlyingPropertiesDialog').dialog('close');
                });
            },
            close: function () {
                //$(this).dialog('destroy'); //.remove();
                $('#divWorkflowActionsUnderlyingPropertiesDialog').dialog('destroy');
            }
        });
    } catch (e) {
        console.log('Exception in displayWorkflowActionsUnderlyingPropertiesDialog(): ' + e.message + ', ' + e.stack);
    }
},
saveWorkflowActionsUnderlyingProperties: function (elementId, actionTitle) {
    try {
        console.log('In saveWorkflowActionsUnderlyingProperties(' + elementId + ', ' + actionTitle + '). actionTitle: ' + actionTitle);
        var x = elementId.split('_')[1];
        var stepIndex = x.split('_')[0];
        var rowIndex = elementId.split('_')[2];
        //debugger;
        var tooltip = document.getElementById('WorkflowActionsUnderlyingPropertiesDialog_Tooltip').value;
        var javascript = document.getElementById('WorkflowActionsUnderlyingPropertiesDialog_JavaScript').value;

        for (var i = 0; i < this.options.store.Workflow.Steps.Step[stepIndex].Assign[rowIndex].Action.length; i++) {
            if (this.options.store.Workflow.Steps.Step[stepIndex].Assign[rowIndex].Action[i]["@Name"] == actionTitle) {
                //debugger;
                this.options.store.Workflow.Steps.Step[stepIndex].Assign[rowIndex].Action[i].Tooltip = tooltip;
                this.options.store.Workflow.Steps.Step[stepIndex].Assign[rowIndex].Action[i]["@JavaScript"] = javascript;
                //break;
            }
        }
        $('#divWorkflowActionsUnderlyingPropertiesDialog').dialog('close');
        this.checkIfWeHaveToDisplayThePublishChangesButton();
    } catch (e) {
        console.log('Exception in saveWorkflowActionsUnderlyingProperties(' + actionTitle + '): ' + e.message + ', ' + e.stack);
    }
},
insertEmailDataItem: function () {
    try {
        console.log('In insertEmailDataItem().');
        // Get the selected value.
        var selectedDataItem;
        $('#selectEmailDataItemPickerDialogDataItem').find('option:selected').each(function (index, element) {
            selectedDataItem = element.innerHTML;
        });
        // Close the dialog.
        $("#divEmailDataItemPickerDialog").dialog('close');
        // Update the email editor.
        var insertIndex = 0;
        var range = this.options.quill.getSelection();
        if (range) {
            if (range.length == 0) {
                console.log('User cursor is at index', range.index);
                insertIndex = range.index;
            } else {
                var text = quill.getText(range.index, range.length);
                console.log('User has highlighted: ', text);
                insertIndex = range.index;
            }
        } else {
            console.log('User cursor is not in editor');
        }

        var html = '';
        //html += '<span style="">';
        html += '%' + selectedDataItem + '%';
        //html += '</span>';
        this.options.quill.insertText(insertIndex, html, {
            //'color': 'green',
            //'bold': true
        });


    } catch (e) {
        console.log('Exception in insertEmailDataItem(): ' + e.message + ', ' + e.stack);
    }
},
//saveEmailTemplateForStep: function (stepName) { // was named saveCollaborationTimeoutEmail 
//    try {
//        console.log('In saveEmailTemplateForStep(' + stepName + ').');
//        var emailTemplate = this.options.quill.getText();
//        for (var i = 0; i < this.options.store.Workflow.Steps.Step.length; i++) {
//            if (this.options.store.Workflow.Steps.Step[i]["@Name"] == stepName) { //'Collaboration') {
//                this.options.store.Workflow.Steps.Step[i]["@EmailTemplate"] = emailTemplate;
//                $('#divConfigureEmailNotificationsDialog').dialog('close');
//                this.checkIfWeHaveToDisplayThePublishChangesButton();
//                break;
//            }
//        }
//    } catch (e) {
//        console.log('Exception in saveEmailTemplateForStep(' + stepName + '): ' + e.message + ', ' + e.stack);
//    }
//},
renderAllParticipantsInThePeoplePicker: function (friendlyNameSourceField, idSourceField, emailSourceField, buttonToEnable) {
    try {
        console.log('In bwParticipantsEditor.js.renderAllParticipantsInThePeoplePicker().');

        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
        var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

        $('#spanPeoplePickerParticipantsList').empty();
        var data = {
            bwParticipantId_LoggedIn: participantId,
            bwActiveStateIdentifier: activeStateIdentifier,
            bwWorkflowAppId_LoggedIn: workflowAppId,

            bwWorkflowAppId: workflowAppId
        };
        $.ajax({
            url: webserviceurl + "/workflow/participants",
            type: "POST",
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (data1) {
                try {

                    var data = data1.BwWorkflowUsers;
                    var html = '';
                    for (var i = 0; i < data.length; i++) {
                        //html += '<a href="javascript:$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'cmdReturnParticipantIdToField\', \'' + friendlyNameSourceField + '\', \'' + idSourceField + '\', \'' + emailSourceField + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantEmail + '\', \'' + buttonToEnable + '\');">' + data[i].bwParticipantFriendlyName + '&nbsp;&nbsp;<i>(' + data[i].bwParticipantEmail + ')</i></a>';

                        html += '<span style="text-decoration:underline;cursor:pointer;" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'cmdReturnParticipantIdToField\', \'' + friendlyNameSourceField + '\', \'' + idSourceField + '\', \'' + emailSourceField + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantEmail + '\', \'' + buttonToEnable + '\');">' + data[i].bwParticipantFriendlyName + '&nbsp;&nbsp;<i>(' + data[i].bwParticipantEmail + ')</i></span>';


                        html += '<br />';
                    }
                    $('#spanPeoplePickerParticipantsList').append(html);

                } catch (e) {
                    console.log('Exception in renderAllParticipantsInThePeoplePicker():2: ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in renderAllParticipantsInThePeoplePicker():2: ' + e.message + ', ' + e.stack);
                }
            },
            error: function (data, errorCode, errorMessage) {
                console.log('Error in my.js.renderAllParticipantsInThePeoplePicker():' + errorCode + ', ' + errorMessage);
                displayAlertDialog('Error in my.js.renderAllParticipantsInThePeoplePicker():' + errorCode + ', ' + errorMessage);
            }
        });
    } catch (e) {
        console.log('Exception in renderAllParticipantsInThePeoplePicker(): ' + e.message + ', ' + e.stack);
        displayAlertDialog('Exception in renderAllParticipantsInThePeoplePicker(): ' + e.message + ', ' + e.stack);
    }
},
renderAllParticipantsInThePeoplePickerForJson: function (roleId, roleName, divisionIndex, groupIndex, entityIndex, locationIndex) {
    try {
        $('#spanPeoplePickerParticipantsList').empty();
        var data = {
            "bwWorkflowAppId": workflowAppId
        };
        $.ajax({
            url: webserviceurl + "/workflow/participants",
            type: "DELETE",
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (data1) {
                var data = data1.BwWorkflowUsers;
                var html = '';
                for (var i = 0; i < data.length; i++) {
                    //html += '<a href="javascript:$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'cmdReturnParticipantIdToFieldForJson\', \'' + friendlyNameSourceField + '\', \'' + idSourceField + '\', \'' + emailSourceField + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantEmail + '\', \'' + buttonToEnable + '\');">' + data[i].bwParticipantFriendlyName + '&nbsp;&nbsp;<i>(' + data[i].bwParticipantEmail + ')</i></a>';


                    html += '<a href="javascript:$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'cmdReturnParticipantIdToFieldForJson\', \'' + roleId + '\', \'' + roleName + '\', \'' + divisionIndex + '\', \'' + groupIndex + '\', \'' + entityIndex + '\', \'' + locationIndex + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantEmail + '\');">' + data[i].bwParticipantFriendlyName + '&nbsp;&nbsp;<i>(' + data[i].bwParticipantEmail + ')</i></a>';


                    html += '<br />';
                }
                $('#spanPeoplePickerParticipantsList').append(html);
            },
            error: function (data, errorCode, errorMessage) {
                displayAlertDialog('Error in my.js.renderAllParticipantsInThePeoplePicker():' + errorCode + ', ' + errorMessage);
            }
        });
    } catch (e) {
        console.log('Exception in renderAllParticipantsInThePeoplePickerForJson(): ' + e.message + ', ' + e.stack);
    }
},
cmdReturnParticipantIdToField: function (friendlyNameSourceField, idSourceField, emailSourceField, selectedParticipantFriendlyName, selectedParticipantId, selectedParticipantEmail, buttonToEnable) {
    try {
        console.log('In cmdReturnParticipantIdToField().');

        debugger;
        // The people picker calls this and 
        //displayAlertDialog('You selected participant ' + selectedParticipantFriendlyName + ' to go in friendly name field ' + friendlyNameSourceField + '.\n\nThis functionality is incomplete. Coming soon!');
        document.getElementById(friendlyNameSourceField).value = selectedParticipantFriendlyName;
        document.getElementById(friendlyNameSourceField).setAttribute('title', selectedParticipantEmail);
        document.getElementById(idSourceField).value = selectedParticipantId;
        document.getElementById(emailSourceField).value = selectedParticipantEmail;

        //$('#' + friendlyNameSourceField).val(selectedParticipantFriendlyName);
        //$('#' + idSourceField).val(selectedParticipantId);
        //$('#' + emailSourceField).val(selectedParticipantEmail);

        // This enables the save button that may be next to the text box.
        if (buttonToEnable && buttonToEnable != 'undefined') document.getElementById(buttonToEnable).disabled = false;

        $('#PeoplePickerDialog').dialog('close');

        // The following doesn't work for some reason.
        //$('#' + friendlyNameSourceField).blur(); // Removes the focus from the field so that the user can't type in it.
        //document.getElementById(friendlyNameSourceField).blur();
    } catch (e) {
        console.log('Exception in cmdReturnParticipantIdToField(): ' + e.message + ', ' + e.stack);
        displayAlertDialog('Exception in cmdReturnParticipantIdToField(): ' + e.message + ', ' + e.stack);
    }
},
cmdReturnParticipantIdToFieldForJson: function (roleId, roleName, divisionIndex, groupIndex, entityIndex, locationIndex, selectedParticipantFriendlyName, selectedParticipantId, selectedParticipantEmail) {
    try {
        // The people picker calls this and 
        //displayAlertDialog('You selected participant ' + selectedParticipantFriendlyName + ' to go in friendly name field ' + friendlyNameSourceField + '.\n\nThis functionality is incomplete. Coming soon!');
        //debugger;
        var json = this.options.store;
        var org;
        var roles;
        //debugger;
        if ((locationIndex && locationIndex != 'undefined') || locationIndex > -1) {
            org = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex];
        } else if ((entityIndex && entityIndex != 'undefined') || entityIndex > -1) {
            org = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex];
        } else if ((groupIndex && groupIndex != 'undefined') || groupIndex > -1) {
            org = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex];
        } else if ((divisionIndex && divisionIndex != 'undefined') || divisionIndex > -1) {
            if (divisionIndex == 'root') {
                org = json.Global;
            } else {
                org = json.Global.Divisions.Items[divisionIndex];
            }
        } else {
            debugger;
            alert('Error: Unexpected parameter in cmdReturnParticipantIdToFieldForJson().');
        }
        if (org.Roles) {
            for (var i = 0; i < org.Roles.length; i++) {
                if (org.Roles[i].RoleId == roleId) {
                    // This is the one. Add the participant info here.
                    org.Roles[i].ParticipantId = selectedParticipantId;
                    org.Roles[i].ParticipantFriendlyName = selectedParticipantFriendlyName;
                    org.Roles[i].ParticipantEmail = selectedParticipantEmail;
                    org.Roles[i].ParticipantIsDirty = true; // Using this so we can go through and make sure the entries are made in the BwWorkflowUserRole table! 
                    org.Roles[i].ParticipantIsDirtyAction = 'ADDORUPDATE';
                }
            }
        } else {
            var role = {
                RoleId: roleId,
                RoleName: roleName,
                ParticipantId: selectedParticipantId,
                ParticipantFriendlyName: selectedParticipantFriendlyName,
                ParticipantEmail: selectedParticipantEmail,
                ParticipantIsDirty: true, // Using this so we can go through and make sure the entries are made in the BwWorkflowUserRole table! 
                ParticipantIsDirtyAction: 'ADDORUPDATE'
            };
            org.Roles = [];
            org.Roles.push(role);
        }


        // Render.
        var html = '';
        if (org.Roles && org.Roles.length) {
            for (var r = 0; r < org.Roles.length; r++) {
                if (org.Roles[r].ParticipantIsDirty == true && org.Roles[r].ParticipantIsDirtyAction == 'REMOVE') {
                    // Do nothing. Don't display, this is just so that the user org role gets removed when published back to the server.
                    html += '<span style="color:tomato;">';
                    html += '*ROLE ' + org.Roles[r].RoleName + ' (' + org.Roles[r].RoleId + ') IS PENDING DELETION ON NEXT PUBLISH*';
                    html += '</span>';
                    html += '<br />';
                } else {
                    html += org.Roles[r].RoleName + ' (' + org.Roles[r].RoleId + ') - ' + '<span style="cursor:pointer;" title="' + org.Roles[r].ParticipantEmail + '">' + org.Roles[r].ParticipantFriendlyName + '</span>';
                    var stepIndex = -1;
                    var roleIndex = -1;
                    html += '&nbsp;<img style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayPeoplePickerDialogForJson\', \'' + org.Roles[r].RoleId + '\', \'' + org.Roles[r].RoleName + '\', \'' + divisionIndex + '\', \'' + groupIndex + '\', \'' + entityIndex + '\', \'' + locationIndex + '\');" src="images/addressbook-icon18x18.png">';
                    html += '<br />';
                }
            }
        } else {
            html += '<span style="color:tomato;">';
            html += '*NO ROLES SPECIFIED FOR THIS ORG*';
            html += '</span>';
            html += '<br />';
        }
        document.getElementById('spanSelectedRolesInRolePickerDropdown').innerHTML = html; // Display the selected roles.




        this.checkIfWeHaveToDisplayThePublishChangesButton();
        $('#PeoplePickerDialog').dialog('close');

    } catch (e) {
        console.log('Exception in cmdReturnParticipantIdToFieldForJson(): ' + e.message + ', ' + e.stack);
    }
},
renderParticipantInformation: function (userId) {
    try {
        console.log('renderParticipantInformation(). userId: ' + userId);
        alert('In renderParticipantInformation(). userId: ' + userId);

        //var stepGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        //    return v.toString(16);
        //});

        //var step = {
        //    StepName: "NewStep-" + stepGuid,
        //    InformRoles: [{}],
        //    AssignRoles: [{}]
        //};
        //this.options.store.RaciSteps.push(step);

        ////alert('In addARaciStep(). this.options.store: ' + JSON.stringify(this.options.store));

        //this._create();
    } catch (e) {
        console.log('Exception in renderParticipantInformation(): ' + e.message + ', ' + e.stack);
    }
},
renderOrgRolesDropDownList: function () {
    try {
        alert('In bwParticipantsEditor.js.renderOrgRolesDropDownList(). Dev: xcx12314 incomplete code here...');

        $.ajax({
            url: this.options.operationUriPrefix + "odata/OrgRolesConfiguration/" + workflowAppId + '/all',
            dataType: "json",
            contentType: "application/json",
            type: "Get",
            timeout: this.options.ajaxTimeout
        }).done(function (result) {
            try {
                //debugger;
                var html = '';
                html += '<select style="padding:5px 5px 5px 5px;" id="orgRolesDropDown" onchange="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'OrgRolesDropDown_Onchange\');">';
                for (var i = 0; i < result.value.length; i++) {
                    var isTheActiveOrgRoles = Boolean(result.value[i].bwOrgRolesActive);
                    if (isTheActiveOrgRoles) {
                        html += '<option value="' + result.value[i].bwOrgRolesId + '" selected>';
                        html += '>>>>> ACTIVE <<<<<   ';
                        html += result.value[i].Description + ' ----- [Created by ' + result.value[i].CreatedBy + ', ' + result.value[i].Created + ']';
                        html += '</option>';
                    } else {
                        html += '<option value="' + result.value[i].bwOrgRolesId + '" >';
                        html += result.value[i].Description + ' ----- [Created by ' + result.value[i].CreatedBy + ', ' + result.value[i].Created + ']';
                        html += '</option>';
                    }
                }
                html += '</select>';
                document.getElementById('spanOrgRolesDropDownList').innerHTML = html;
            } catch (e) {
                console.log('Exception in renderOrgRolesDropDownList().done: ' + e.message + ', ' + e.stack);
            }
        }).fail(function (data, errorCode) {

            //lpSpinner.Hide();
            console.log('In xx.fail(): ' + JSON.stringify(data));
            var msg;
            if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
            } else {
                msg = JSON.stringify(data);
            }
            alert('Exception in bwOrganizationEditor.js.renderOrgRolesDropDownList().xx.Get: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
            console.log('Exception in bwOrganizationEditor.js.renderOrgRolesDropDownList().xx.Get: ' + JSON.stringify(data));
            //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
            //var error = JSON.parse(data.responseText)["odata.error"];
            //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
        });
    } catch (e) {
        console.log('Exception in renderOrgRolesDropDownList(): ' + e.message + ', ' + e.stack);
    }
},
renderSelectRoleOrPersonSection: function (elementId) {
    try {
        console.log('In renderSelectRoleOrPersonSection().');
        var thiz = this;
        var selectRoleOrPersonCell = $('.selectroleorperson-editcell');
        var stepIndex = elementId.split('_')[1]; // eg: 3
        var roleIndex = elementId.split('_')[2]; // eg: 8
        // Populate the "Roles" drop down.

        $.ajax({
            url: this.options.operationUriPrefix + "odata/Roles?$filter=IsWorkflowRole eq true",
            dataType: "json",
            contentType: "application/json",
            type: "Get",
            timeout: this.options.ajaxTimeout
        }).done(function (result) {
            try {
                // We need to get the workflowAppId, as well as roleId in order to get the list of users who belong to the role.
                var roles;
                if (result) {
                    roles = result.value;
                } else {
                    console.log('In renderSelectRoleOrPersonSection().Get[odata/Roles].done: result: ' + JSON.stringify(result));
                }

                var html = '';
                //html += '<td class="steprowcell">';

                //html += '<span class="selectarow-labeltext">Select a role:</span>';
                //html += '<br />';

                //html += ' <img style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayPeoplePickerDialog\', \'' + 'txtApprover2FriendlyName' + '\', \'' + 'txtApprover2Id' + '\', \'' + 'txtApprover2Email' + '\');" src="images/addressbook-icon18x18.png">';
                //html == '&nbsp;&nbsp;';

                var rolename = $('#' + elementId).find('.rolename').attr('bwOldValue');
                var roleId = $('#' + elementId).find('.rolename').attr('bwRoleId');
                html += '<select style="padding:5px 5px 5px 5px;" id="selectRoleName"  onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'RoleDropDown_Onchange\', \'' + 'selectRoleName' + '\');">';
                html += '  <option value=""></option>';
                for (var i = 0; i < roles.length; i++) {
                    if (rolename == roles[i].RoleName) {
                        html += '  <option value="' + roles[i].RoleId + '" selected >' + roles[i].RoleName + '</option>';
                    } else {
                        html += '  <option value="' + roles[i].RoleId + '">' + roles[i].RoleName + '</option>';
                    }
                }
                html += '</select>';

                html += '&nbsp;<input style="padding:5px 10px 5px 10px;" id="btnCreateRole2" type="button" value="New Role..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayCreateANewRoleDialog\');" />';
                //html += '<br />[display role member(s)]';


                html += '<br />';
                //html += '<input id="txtRoleMembersFriendlyName_' + stepIndex + '_' + roleIndex + '" style="width:150px;color:grey;font-style:italic;" type="text" value=" [display role member(s)]" />';

                var orgId1 = 'ALL'; // using ALL until we build in the multiple locations support.
                $.ajax({
                    url: thiz.options.operationUriPrefix + "odata/UserRole/" + workflowAppId + "/" + orgId1 + "/" + roleId, // pass workflowAppId, as well as roleId in order to get the list of users who belong to the role.
                    dataType: "json",
                    contentType: "application/json",
                    type: "Get",
                    timeout: thiz.options.ajaxTimeout
                }).done(function (result) {
                    try {

                        //
                        // Display the role members!!!<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                        //

                        html += '<input style="padding:5px 5px 5px 5px;" id="txtRoleMembersFriendlyName_' + stepIndex + '_' + roleIndex + '" style="width:150px;color:grey;font-style:italic;" type="text" value=" [select role member(s)]" />';



                        //html += '<input id="txtRoleMembersFriendlyName_' + stepIndex + '_' + roleIndex + '" style="width:150px;color:grey;font-style:italic;" type="text" value=" ' + roleMembersHtml + '" />';






                        html += '<input id="txtRoleMembersId_' + stepIndex + '_' + roleIndex + '" style="display:none;" />';
                        html += '<input id="txtRoleMembersEmail_' + stepIndex + '_' + roleIndex + '" style="display:none;" />';


                        html += '&nbsp;<img style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayPeoplePickerDialog\', \'' + 'txtRoleMembersFriendlyName_' + stepIndex + '_' + roleIndex + '' + '\', \'' + 'txtRoleMembersId_' + stepIndex + '_' + roleIndex + '' + '\', \'' + 'txtRoleMembersEmail_' + stepIndex + '_' + roleIndex + '' + '\');" src="images/addressbook-icon18x18.png">';
                        html += '&nbsp;<input style="padding:5px 10px 5px 10px;" id="btnCreateRole1" type="button" value="New Person..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayAddANewPersonDialog\');" />';


                        if (participantId) { // Only display when logged in. We need to do more work here!!
                            if (result.length > 0) {
                                var roleMembersHtml = '';
                                roleMembersHtml += '<br /><span style="color:darkgrey;">Role Member(s):<ul>';
                                for (var i = 0; i < result.length; i++) {
                                    //roleMembersHtml += '<br />' + String(i + 1) + ': ' + result[i].bwParticipantFriendlyName;
                                    roleMembersHtml += '<li title="' + result[i].bwParticipantEmail + '">' + result[i].bwParticipantFriendlyName;
                                    //roleMembersHtml += '<span style="cursor:pointer;" onclick="alert(\'This functionality is incomplete. Coming soon!trashbinx\');">&nbsp;&#128465;</span></li>';
                                    roleMembersHtml += '<span style="cursor:pointer;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'DeleteRoleMember\', \'' + elementId + '\', \'' + result[i].bwParticipantId + '\');">&nbsp;&#128465;</span></li>';
                                }
                                roleMembersHtml += '</ul></span>';
                                //html == '<br />';
                                html += roleMembersHtml;
                                //html == '<br />';
                            }
                        }

                        //html += '<br />or create a new role:'; //<br /><input id="textNewRoleName" type="text" style="width:210pt;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewRoleTextBox_Onkeyup\', \'' + 'textNewRoleName' + '\');" />';
                        //html += '<br /><input id="btnCreateRole2" type="button" value="Create a Role..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayCreateANewRoleDialog\');" />';

                        //html += '<br />or select a person:'; //<br /><input id="textNewRoleId" type="text" style="width:75pt;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewRoleTextBox_Onkeyup\', \'' + 'textNewRoleId' + '\');" />';
                        //html += '<br /><img style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayPeoplePickerDialog\', \'' + 'txtApprover2FriendlyName' + '\', \'' + 'txtApprover2Id' + '\', \'' + 'txtApprover2Email' + '\');" src="images/addressbook-icon18x18.png">';
                        //html == '&nbsp;&nbsp;';
                        //html += '<input id="btnCreateRole1" type="button" value="Select Person..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayPeoplePickerDialog\', \'' + 'txtApprover2FriendlyName' + '\', \'' + 'txtApprover2Id' + '\', \'' + 'txtApprover2Email' + '\');" />';

                        //html += '<br />or add a new person:'; //<br /><input id="textNewRoleId" type="text" style="width:75pt;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewRoleTextBox_Onkeyup\', \'' + 'textNewRoleId' + '\');" />';
                        //html += '<br /><input id="btnCreateRole1" type="button" value="Add a Person..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayAddANewPersonDialog\');" />';

                        //html += '</td > ';

                        selectRoleOrPersonCell.html(html);
                    } catch (e) {
                        //lpSpinner.Hide();
                        console.log('Exception in raci.html.displayRoleMultiPicker().Get[odata/UserRoles].done: ' + e.message + ', ' + e.stack);
                    }
                }).fail(function (data) {
                    //lpSpinner.Hide();

                    var msg;
                    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                    } else {
                        msg = JSON.stringify(data);
                    }
                    alert('Error in raci.html.displayRoleMultiPicker().Get[odata/UserRoles].fail: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                    console.log('Error in raci.html.displayRoleMultiPicker().Get[odata/UserRoles].fail:' + JSON.stringify(data));
                    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                    //var error = JSON.parse(data.responseText)["odata.error"];
                    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                });
            } catch (e) {
                console.log('Exception in renderSelectRoleOrPersonSection()[odata/Roles].done: ' + e.message + ', ' + e.stack);
            }
        }).fail(function (data) {
            //lpSpinner.Hide();
            //$('.buttonAddNewAssignmentRow').attr('disabled', false); // Disables these buttons while there is the editor row displaying.
            var msg;
            if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
            } else {
                msg = JSON.stringify(data);
            }
            alert('Error in renderSelectRoleOrPersonSection().Get[odata/Roles].fail: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
            console.log('Error in renderSelectRoleOrPersonSection().Get[odata/Roles].fail:' + JSON.stringify(data));
            //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
            //var error = JSON.parse(data.responseText)["odata.error"];
            //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
        });
    } catch (e) {
        console.log('Exception in renderSelectRoleOrPersonSection(): ' + e.message + ', ' + e.stack);
    }
},
renderActionsSection: function (elementId) {
    try {
        var selectedRoleCategory;
        $('#selectRoleCategory').find('option:selected').each(function (index, element) {
            selectedRoleCategory = element.value;
        });
        var actionsCell = $('.actions-editcell');
        if (elementId == 'undefined') {
            elementId = actionsCell.attr('id');
        }
        console.log('In renderActionsSection. elementId: ' + elementId);

        var html = '';

        if (selectedRoleCategory != 'Inform' && selectedRoleCategory != 'Collaborator' && selectedRoleCategory != 'Approver') {
            selectedRoleCategory = 'Inform'; // Thismakes it the default when it is not present.
        }

        if (selectedRoleCategory == 'Inform') {
            actionsCell.html(html);
        } else if (selectedRoleCategory == 'Collaborator') {


            // TO-DO: WHEN "Collaborator" has been selcted, a timeout can be specified. Display this option!!!!!!!!!!!!!!!!!!!!!!<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<,,


            actionsCell.html(html);
        } else if (selectedRoleCategory == 'Approver') {
            // Display the Actions/Tasks pickers... TO-DO: REMEMBER TO COME BACK AND POPULATE existing values. eg: If the user toggles the drop down, these values get lost..... <<<<<<<<<<<<<<<<<<<<<<<<<<<<
            var actions = ['Approve', 'Cancel', 'Decline', 'Revise/Hold'];
            var x = elementId.split('_')[1];
            var step = x.split('_')[0];
            var row = elementId.split('_')[2];
            for (var i = 0; i < actions.length; i++) {
                var checkboxId = 'Action-' + actions[i] + '_' + step + '_' + row;
                var childCheckboxId = 'RequireComments-' + actions[i] + '_' + step + '_' + row;
                html += '<span style="white-space:nowrap;">';
                if (actions[i] == 'Approve' || actions[i] == 'Revise/Hold') {
                    // This forces the "Approve" and "Revise/Hold" actions to always remain checked. We always need these checked!
                    html += '  <input type="checkbox" id="' + checkboxId + '" onclick="return false;" />&nbsp;' + actions[i];
                } else {
                    html += '  <input type="checkbox" id="' + checkboxId + '" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'toggleChildCheckbox\', \'' + checkboxId + '\', \'' + childCheckboxId + '\');" />&nbsp;' + actions[i];
                }
                html += '  &nbsp;';
                html += '  <input id="' + childCheckboxId + '" type="checkbox" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'toggleParentCheckbox\', \'' + childCheckboxId + '\', \'' + checkboxId + '\');" />&nbsp;require comments';
                html += '  &nbsp;<span style="cursor:pointer;" title="Select to configure underlying properties..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayWorkflowActionsUnderlyingPropertiesDialog\', \'' + elementId + '\', \'' + actions[i] + '\');">&#8230;</span>'
                html += '</span>';
                html += '<br />';
            }
            actionsCell.html(html);
            // We have to make sure the "Approve" and "Revise/Hold" actioon checkboxes are selected. It always has to be selected no matter what!
            approveCheckboxId = 'Action-Approve_' + step + '_' + row;
            revisHoldCheckboxId = 'Action-Revise/Hold_' + step + '_' + row;
            document.getElementById(approveCheckboxId).checked = true;
            document.getElementById(revisHoldCheckboxId).checked = true;
        } else {
            alert('ERROR: Unrecognized "Role Category" selected.');
        }
    } catch (e) {
        console.log('Exception in renderActionsSection(): ' + e.message + ', ' + e.stack);
    }
},
renderTimeoutSection: function (elementId) {
    try {
        console.log('In renderTimeoutSection. elementId: ' + elementId);
        var selectedRoleCategory;
        $('#selectRoleCategory').find('option:selected').each(function (index, element) {
            selectedRoleCategory = element.value;
        });
        var timeoutCell = $('.timeout-editcell');
        var html = '';
        if (selectedRoleCategory != 'Inform' && selectedRoleCategory != 'Collaborator' && selectedRoleCategory != 'Approver') {
            selectedRoleCategory = 'Inform'; // Thismakes it the default when it is not present.
        }
        if (selectedRoleCategory == 'Inform') {
            timeoutCell.html(html);
        } else if (selectedRoleCategory == 'Collaborator') {
            // When "Collaborator" has been selected, a timeout can be specified. 
            html += '<span style="white-space:nowrap;">Timeout:&nbsp;<input type="text" id="textTimeout" style="width:25px;padding:5px 5px 5px 5px;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'TimeoutTextBox_Onkeyup\', \'' + 'textTimeout' + '\');" />&nbsp;days</span>';
            timeoutCell.html(html);
        } else if (selectedRoleCategory == 'Approver') {
            timeoutCell.html(html);
        } else {
            alert('ERROR: Unrecognized "Role Category" selected.');
        }
    } catch (e) {
        console.log('Exception in renderTimeoutSection(): ' + e.message + ', ' + e.stack);
    }
},

renderTheCondReadOnly: function (cond) {
    try {
        console.log('In bwOrganizationEditor.renderTheCondReadOnly().');
        // this is a placeholder!!! hardcoded
        var result = '';
        if (true) {
            //result += 'In bwOrganizationEditor.renderTheCondReadOnly().'; // uncomment this if wanting to put this section back!!
        } else {
            if (cond && cond.trim() != '') {
                // This is where we parse the cond and make it look the the editable one, but read only!!!!
                var conditionString = cond;


                var selectedRoleCategory;
                $('#selectRoleCategory').find('option:selected').each(function (index, element) {
                    selectedRoleCategory = element.value;
                });
                //var conditionCell = $('.conditions-editcell');
                //if (elementId == 'undefined') {
                //    elementId = conditionCell.attr('id');
                //}
                //console.log('In renderTheCondReadOnly. elementId: ' + elementId + ', conditionString: ' + conditionString);




                var html = '';
                //html += '<span style="color:gray;font-style:italic;">This role is a subject matter expert in these areasx:</span><br />';



                var html2 = '';
                // Is Exec
                if (conditionString) {
                    // We have to parse out "isExec" here.
                    var isExec = conditionString.split('$IsExec=')[1];

                    console.log('isExec: ' + isExec);

                    if (isExec && isExec.indexOf('&') > -1) {
                        isExec = isExec.split('&')[0];
                    }
                }
                if (isExec && isExec == 'True') {
                    html2 += '<span style="white-space:nowrap;"><input id="cbIsExec" type="checkbox" checked onclick="return false;" />&nbsp;' + 'Exec' + '&nbsp;</span>';
                } else {
                    //html += '<span style="white-space:nowrap;"><input id="cbIsExec" type="checkbox" onclick="return false;" />&nbsp;' + 'Exec' + '&nbsp;</span>';
                }
                //html += '&nbsp;';

                // Is Legal
                if (conditionString) {
                    // We have to parse out "IsLegal" here.
                    var isLegal = conditionString.split('$IsLegal=')[1];
                    if (isLegal && isLegal.indexOf('&') > -1) {
                        isLegal = isLegal.split('&')[0];
                    }
                }
                if (isLegal && isLegal == 'True') {
                    html2 += '<span style="white-space:nowrap;"><input id="cbIsLegal" type="checkbox" checked onclick="return false;" />&nbsp;' + 'Legal' + '&nbsp;</span>';
                } else {
                    //html += '<span style="white-space:nowrap;"><input id="cbIsLegal" type="checkbox" onclick="return false;" />&nbsp;' + 'Legal' + '&nbsp;</span>';
                }
                //html += '&nbsp;';

                // Is Lease
                if (conditionString) {
                    // We have to parse out "isLease" here.
                    var isLease = conditionString.split('$IsLease=')[1];
                    if (isLease && isLease.indexOf('&') > -1) {
                        isLease = isLease.split('&')[0];
                    }
                }
                if (isLease && isLease == 'True') {
                    html2 += '<span style="white-space:nowrap;"><input id="cbIsLease" type="checkbox" checked onclick="return false;" />&nbsp;' + 'Lease' + '&nbsp;</span>';
                } else {
                    //html += '<span style="white-space:nowrap;"><input id="cbIsLease" type="checkbox" onclick="return false;" />&nbsp;' + 'Lease' + '&nbsp;</span>';
                }
                //html += '&nbsp;';

                // Is IT
                //html += '&nbsp;';
                //html += '<span style="white-space:nowrap;"><input type="checkbox" onclick="return false;" />&nbsp;' + 'IT' + '&nbsp;<span style="font-style:italic;"></span></span>';

                // Is H&S 
                //html += '&nbsp;';
                //html += '<span style="white-space:nowrap;"><input type="checkbox" onclick="return false;" />&nbsp;' + 'H&S' + '&nbsp;<span style="font-style:italic;"></span></span>';

                // Is Compliance
                //html += '&nbsp;';
                //html += '<span style="white-space:nowrap;"><input type="checkbox" onclick="return false;" />&nbsp;' + 'Compliance' + '&nbsp;<span style="font-style:italic;"></span></span>';

                // Is Audit
                //html += '&nbsp;';
                //html += '<span style="white-space:nowrap;"><input type="checkbox"  onclick="return false;" />&nbsp;' + 'Audit' + '&nbsp;<span style="font-style:italic;"></span></span>';

                if (html2 != '') {
                    html += '<span style="color:gray;font-style:italic;">This role is a subject matter expert in these areasx:</span><br />';
                    html += html2;
                    html += '<hr>';
                }

                //html += '<br />';This role is required to complete the following checklist(s):





                html += '<span style="color:gray;font-style:italic;">This role contributes to these parts of the company:</span>';

                //// Render the "Cond".
                //html += '  <span id="spanConditionEditorContents" style="visibility:hidden;display:none;">';
                //if (conditionString) html += conditionString;
                //html += '  </span>';






                //html += '<span style="cursor:pointer;color:red;text-decoration:underline;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayOrgMultiPicker\', \'' + this.id + '\');">Location(s)</span>';
                //html += '&nbsp;&nbsp;&nbsp;&nbsp;';
                //html += '<span style="cursor:pointer;color:red;text-decoration:underline;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayProjectTypeMultiPicker\', \'' + this.id + '\');">Functional area(s)</span>';
                //html += '&nbsp;&nbsp;&nbsp;&nbsp;';
                //html += '<span style="cursor:pointer;color:red;text-decoration:underline;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayPillarMultiPicker\', \'' + this.id + '\');">Growth</span>';
                html += '<br />';

                html += 'Locations:';
                html += '<ul>';
                html += '  <li>All locations</li>';
                html += '</ul>';
                html += 'Functional areas:';
                html += '<ul>';
                html += '  <li>All functional areas</li>';
                html += '</ul>';
                html += 'Growth:';
                html += '<ul>';
                html += '  <li>All growth areas (pillars)</li>';
                html += '</ul>';




                // Render the "Cond".
                //html += '  <span id="spanConditionEditorContents" style="visibility:hidden;display:none;">';
                //if (conditionString) html += conditionString;
                //html += '  </span>';
                if (conditionString.indexOf('$ChecklistsRequired~') > -1) {
                    html += '<hr>';
                    html += '<span style="color:gray;font-style:italic;">This role is required to complete the following checklist(s):</span><br />';
                    var checklists = [];
                    for (var i = 0; i < this.options.Checklists.length; i++) {
                        var checklist = { bwChecklistTemplatesId: JSON.parse(this.options.Checklists[i].ChecklistJson).bwChecklistTemplatesId, Title: JSON.parse(this.options.Checklists[i].ChecklistJson).Title };
                        checklists.push(checklist);
                    }
                    checklists.sort(function (a, b) {
                        if (a.Title < b.Title) { return -1; }
                        if (a.Title > b.Title) { return 1; }
                        return 0;
                    });
                    for (var i = 0; i < checklists.length; i++) {
                        if (conditionString.indexOf(checklists[i].bwChecklistTemplatesId) > -1) {
                            html += '<span style="white-space:nowrap;">';
                            html += '<input id="cbChecklistRequired_' + checklists[i].bwChecklistTemplatesId + '" type="checkbox" onclick="return false;" checked="" />&nbsp;' + checklists[i].Title + '&nbsp;';
                            html += '<span style="font-style:italic;"></span>';
                            html += '</span>';
                            html += '<br />';
                        }
                    }

                }

                result += html;
            } else {
                // do nothing.
                alert('??xx?? eaborate here devs pls');
            }
        }
        return result;
    } catch (e) {
        var msg = 'Exception in renderTheCondReadOnly(): ' + e.message + ', ' + e.stack;
        console.log('Exception in renderTheCondReadOnly(): ' + e.message + ', ' + e.stack);
        return msg;
    }
},
renderConditionsSection: function (elementId, conditionString) {
    try {
        console.log('In bwOrganizationEditor.renderConditionsSection().');
        // this is a placeholder!!! hardcoded
        var html = '';
        if (true) {
            html += 'In bwOrganizationEditor.renderConditionsSection().';
        } else {
            var selectedRoleCategory;
            $('#selectRoleCategory').find('option:selected').each(function (index, element) {
                selectedRoleCategory = element.value;
            });
            var conditionCell = $('.conditions-editcell');
            if (elementId == 'undefined') {
                elementId = conditionCell.attr('id');
            }
            console.log('In renderConditionsSection. elementId: ' + elementId + ', conditionString: ' + conditionString);



            // Display this section
            if (selectedRoleCategory == 'Inform') {
                html += '<span style="color:gray;font-style:italic;">This role will be informed about these areas:</span><br />';
            } else {
                html += '<span style="color:gray;font-style:italic;">This role is a subject matter expert in these areas:</span><br />';
            }

            // Is Exec
            if (conditionString) {
                // We have to parse out "isExec" here.
                var isExec = conditionString.split('$IsExec=')[1];
                console.log('isExec: ' + isExec);
                if (isExec && isExec.indexOf('&') > -1) {
                    isExec = isExec.split('&')[0];
                }
            }
            if (isExec && isExec == 'True') {
                html += '<span style="white-space:nowrap;"><input id="cbIsExec" type="checkbox" checked onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isExecCondition_CheckChanged\');" />&nbsp;' + 'Exec' + '&nbsp;</span>';
            } else {
                html += '<span style="white-space:nowrap;"><input id="cbIsExec" type="checkbox" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isExecCondition_CheckChanged\');" />&nbsp;' + 'Exec' + '&nbsp;</span>';
            }
            html += '&nbsp;';
            // Is Legal
            if (conditionString) {
                // We have to parse out "IsLegal" here.
                var isLegal = conditionString.split('$IsLegal=')[1];
                if (isLegal && isLegal.indexOf('&') > -1) {
                    isLegal = isLegal.split('&')[0];
                }
            }
            if (isLegal && isLegal == 'True') {
                html += '<span style="white-space:nowrap;"><input id="cbIsLegal" type="checkbox" checked onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isLegalCondition_CheckChanged\');" />&nbsp;' + 'Legal' + '&nbsp;</span>';
            } else {
                html += '<span style="white-space:nowrap;"><input id="cbIsLegal" type="checkbox" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isLegalCondition_CheckChanged\');" />&nbsp;' + 'Legal' + '&nbsp;</span>';
            }
            html += '&nbsp;';
            // Is Lease
            if (conditionString) {
                // We have to parse out "isLease" here.
                var isLease = conditionString.split('$IsLease=')[1];
                if (isLease && isLease.indexOf('&') > -1) {
                    isLease = isLease.split('&')[0];
                }
            }
            if (isLease && isLease == 'True') {
                html += '<span style="white-space:nowrap;"><input id="cbIsLease" type="checkbox" checked onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isLeaseCondition_CheckChanged\');" />&nbsp;' + 'Lease' + '&nbsp;</span>';
            } else {
                html += '<span style="white-space:nowrap;"><input id="cbIsLease" type="checkbox" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isLeaseCondition_CheckChanged\');" />&nbsp;' + 'Lease' + '&nbsp;</span>';
            }
            html += '&nbsp;';
            // Is IT
            html += '&nbsp;';
            html += '<span style="white-space:nowrap;"><input type="checkbox" disabled />&nbsp;' + 'IT' + '&nbsp;<span style="font-style:italic;"></span></span>';
            // Is H&S 
            html += '&nbsp;';
            html += '<span style="white-space:nowrap;"><input type="checkbox" disabled />&nbsp;' + 'H&S' + '&nbsp;<span style="font-style:italic;"></span></span>';
            // Is Compliance
            html += '&nbsp;';
            html += '<span style="white-space:nowrap;"><input type="checkbox" disabled />&nbsp;' + 'Compliance' + '&nbsp;<span style="font-style:italic;"></span></span>';
            // Is Audit
            html += '&nbsp;';
            html += '<span style="white-space:nowrap;"><input type="checkbox" disabled />&nbsp;' + 'Audit' + '&nbsp;<span style="font-style:italic;"></span></span>';

            html += '<hr>';



            html += '<span style="color:gray;font-style:italic;">This role contributes to these parts of the company:</span><br />';

            // Render the "Cond".
            html += '  <span id="spanConditionEditorContents" style="visibility:hidden;display:none;">';
            if (conditionString) html += conditionString;
            html += '  </span>';

            html += '<span style="cursor:pointer;color:red;text-decoration:underline;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayOrgMultiPicker\', \'' + this.id + '\');">Location(s)</span>';
            html += '&nbsp;&nbsp;&nbsp;&nbsp;';
            html += '<span style="cursor:pointer;color:red;text-decoration:underline;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayProjectTypeMultiPicker\', \'' + this.id + '\');">Functional area(s)</span>';
            html += '&nbsp;&nbsp;&nbsp;&nbsp;';
            html += '<span style="cursor:pointer;color:red;text-decoration:underline;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayPillarMultiPicker\', \'' + this.id + '\');">Growth</span>';

            // Display the checklists.
            if (selectedRoleCategory == 'Approver' || selectedRoleCategory == 'Collaborator') {
                html += '<hr>';
                html += '<span style="color:gray;font-style:italic;">This role is required to complete the following checklist(s)x:</span><br />';
                if (this.options.Checklists) {
                    // Todd: This is a bit messy and the result of maybe not getting from the database in the best way. Good for now but could maybe improved someday... think through thoroughly first!
                    var checklists = [];
                    for (var i = 0; i < this.options.Checklists.length; i++) {
                        var checklist = { bwChecklistTemplatesId: JSON.parse(this.options.Checklists[i].ChecklistJson).bwChecklistTemplatesId, Title: JSON.parse(this.options.Checklists[i].ChecklistJson).Title };
                        checklists.push(checklist);
                    }
                    checklists.sort(function (a, b) {
                        if (a.Title < b.Title) { return -1; }
                        if (a.Title > b.Title) { return 1; }
                        return 0;
                    });
                    for (var i = 0; i < checklists.length; i++) {
                        html += '<span style="white-space:nowrap;">';

                        // Decide whether to check the checkbox.
                        if (conditionString) {
                            if (conditionString.indexOf(checklists[i].bwChecklistTemplatesId) > -1) {
                                html += '<input id="cbChecklistRequired_' + checklists[i].bwChecklistTemplatesId + '" type="checkbox" checked="" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isChecklistRequired_CheckChanged\', \'' + checklists[i].bwChecklistTemplatesId + '\');" />';
                                html += '&nbsp;' + checklists[i].Title + '&nbsp;';
                            } else {
                                html += '<input id="cbChecklistRequired_' + checklists[i].bwChecklistTemplatesId + '" type="checkbox" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isChecklistRequired_CheckChanged\', \'' + checklists[i].bwChecklistTemplatesId + '\');" />';
                                html += '&nbsp;' + checklists[i].Title + '&nbsp;';
                            }
                        } else {
                            html += '<input id="cbChecklistRequired_' + checklists[i].bwChecklistTemplatesId + '" type="checkbox" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isChecklistRequired_CheckChanged\', \'' + checklists[i].bwChecklistTemplatesId + '\');" />';
                            html += '&nbsp;' + checklists[i].Title + '&nbsp;';
                        }
                        html += '<input style="padding:5px 10px 5px 10px;" type="button" value="Edit Checklist" onclick="populateStartPageItem(\'divChecklistsSettings\', \'Reports\', \'' + i + '\');" />';

                        //html += '<span style="font-style:italic;"></span>';
                        html += '<span style="cursor:pointer;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'DeleteChecklist\', \'' + elementId + '\', \'' + checklists[i].bwChecklistTemplatesId + '\');">&nbsp;&#128465;</span>';

                        html += '</span>';
                        html += '<br />';
                    }
                } else {
                    html += '[no checklists found]';
                }
            }
        }
        conditionCell.html(html);
    } catch (e) {
        console.log('Exception in renderConditionsSection(): ' + e.message + ', ' + e.stack);
    }
},
DeleteChecklist: function (elementId, bwChecklistTemplatesId) {
    try {
        console.log('In DeleteChecklist(). elementId: ' + elementId + ', bwChecklistTemplatesId: ' + bwChecklistTemplatesId);
        var stepIndex = elementId.split('_')[1]; // eg: 3
        var roleIndex = elementId.split('_')[2]; // eg: 8

        //var cond = this.options.store.DraftWorkflow.Steps.Step[stepIndex].Assign[roleIndex]["@Cond"];
        //spanConditionEditorContents
        var cond = document.getElementById('spanConditionEditorContents').innerHTML;
        // $ChecklistsRequired~becef88f-f43c-4e82-9ff8-0fd4d16b9555,f830e44a-d29f-4261-80c6-756236355e96,f2ac3575-ca0b-4a85-9708-c1cb6eb4929d,f2ac3575-ca0b-4a85-9708-c1cb6eb4929d,becef88f-f43c-4e82-9ff8-0fd4d16b9555,f830e44a-d29f-4261-80c6-756236355e96

        String.prototype.replaceAll = function (search, replacement) {
            var target = this;
            return target.replace(new RegExp(search, 'g'), replacement);
        };

        if (cond) {
            cond = cond.replaceAll('&amp;', '&'); // Not sure why but the encoding gets messed somewhere along the way.
        }

        console.log('In DeleteChecklist(). This functionality is incomplete. Coming soon! cond: ' + cond);

        if (confirm("Are you certain you wish delete ALL CHECKLISTS??? (this checklist?)")) {
            //debugger;
            var newCond;
            var prefix = cond.split('$ChecklistsRequired~')[0];
            if (prefix.substring(prefix.length - 1) == '&') prefix = prefix.substring(0, prefix.length - 1); // Remove the trailing '&' (ampersand).
            var suffix = cond.split('$ChecklistsRequired~')[1].split('&')[1];
            if (suffix) {
                newCond = prefix + suffix;
            } else {
                newCond = prefix;
            }
            //this.options.store.DraftWorkflow.Steps.Step[stepIndex].Assign[roleIndex]["@Cond"] = result;
            debugger;
            //document.getElementById('spanConditionEditorContents').innerHTML = result;
            this.renderConditionsSection(elementId, newCond);
        }

    } catch (e) {
        console.log('Exception in DeleteChecklist(): ' + e.message + ', ' + e.stack);
    }
},
DeleteRoleMember: function (elementId, bwParticipantId) {
    try {
        console.log('In DeleteRoleMember(). elementId: ' + elementId + ', bwParticipantId: ' + bwParticipantId);
        var stepIndex = elementId.split('_')[1]; // eg: 3
        var roleIndex = elementId.split('_')[2]; // eg: 8

        //var cond = this.options.store.DraftWorkflow.Steps.Step[stepIndex].Assign[roleIndex]["@Cond"];
        //// $ChecklistsRequired~becef88f-f43c-4e82-9ff8-0fd4d16b9555,f830e44a-d29f-4261-80c6-756236355e96,f2ac3575-ca0b-4a85-9708-c1cb6eb4929d,f2ac3575-ca0b-4a85-9708-c1cb6eb4929d,becef88f-f43c-4e82-9ff8-0fd4d16b9555,f830e44a-d29f-4261-80c6-756236355e96

        //String.prototype.replaceAll = function (search, replacement) {
        //    var target = this;
        //    return target.replace(new RegExp(search, 'g'), replacement);
        //};

        //if (cond) {
        //    cond = cond.replaceAll('&amp;', '&'); // Not sure why but the encoding gets messed somewhere along the way.
        //}

        console.log('In DeleteRoleMember(). This functionality is incomplete. Coming soon!');

        if (confirm("Are you certain you wish delete ALL ROLEMEMBERS??? (this role member?)")) {
            debugger;
            //    var result;
            //    var prefix = cond.split('$ChecklistsRequired~')[0];
            //    if (prefix.substring(prefix.length - 1) == '&') prefix = prefix.substring(0, prefix.length - 1); // Remove the trailing '&' (ampersand).
            //    var suffix = cond.split('$ChecklistsRequired~')[1].split('&')[1];
            //    if (suffix) {
            //        result = prefix + suffix;
            //    } else {
            //        result = prefix;
            //    }
            //    this.options.store.DraftWorkflow.Steps.Step[stepIndex].Assign[roleIndex]["@Cond"] = result;
        }

    } catch (e) {
        console.log('Exception in DeleteRoleMember(): ' + e.message + ', ' + e.stack);
    }
},
RoleCategoryDropDown_Onchange: function (elementId) {
    try {
        console.log('In RoleCategoryDropDown_Onchange(). elementId: ' + elementId);
        this.renderActionsSection(elementId);
        //this.renderTimeoutSection(elementId);
        this.renderConditionsSection(elementId);
    } catch (e) {
        console.log('Exception in RoleCategoryDropDown_Onchange(): ' + e.message + ', ' + e.stack);
    }
},
RoleDropDown_Onchange: function (elementId) {
    try {
        // This keeps the RoleId and RoleName drop-downs coordinated so that they always display the same role id.
        console.log('In RoleDropDown_Onchange(). elementId: ' + elementId);
        var roleId;
        if (elementId == 'selectRoleId') {
            $('#selectRoleId').find('option:selected').each(function (index, element) {
                roleId = element.value;
            });
            $('#selectRoleName').val(roleId); // set selected option
        } else if (elementId == 'selectRoleName') {
            $('#selectRoleName').find('option:selected').each(function (index, element) {
                roleId = element.value;
            });
            $('#selectRoleId').val(roleId); // set selected option
        } else {
            alert('ERROR: Invalid elementId in RoleDropDown_Onchange().');
        }
    } catch (e) {
        console.log('Exception in RoleDropDown_Onchange(): ' + e.message + ', ' + e.stack);
    }
},
OrgRolesDropDown_Onchange: function () {
    try {
        // This enables the "Activate" button when the ">>>Active<<<" workflow is not selected.
        debugger;
        var selected;
        $('#orgRolesDropDown').find('option:selected').each(function (index, element) {
            selected = element.innerHTML;
        });
        console.log('In OrgRolesDropDown_Onchange(). selected: ' + selected);
        if (selected.indexOf('ACTIVE') > -1) {
            document.getElementById('btnActivateOrgRolesConfiguration').disabled = true;
        } else {
            document.getElementById('btnActivateOrgRolesConfiguration').disabled = false;
        }
    } catch (e) {
        console.log('Exception in OrgRolesDropDown_Onchange(): ' + e.message + ', ' + e.stack);
    }
},
WorkflowRequestTypeDropDown_Onchange: function (elementId) {
    try {
        console.log('In WorkflowRequestTypeDropDown_Onchange().');
        document.getElementById(elementId).selectedIndex = 0; // This just forces it to always be the top selection for the time being.
        alert('This functionality is incomplete. Coming soon! This functionality will allow a workflow for each budget request type.');

        //// This enables the "Activate" button when the ">>>Active<<<" workflow is not selected.
        //var selected;
        //$('#workflowsDropDown').find('option:selected').each(function (index, element) {
        //    selected = element.innerHTML;
        //});
        //console.log('In WorkflowRequestTypeDropDown_Onchange(). selected: ' + selected);
        //if (selected.indexOf('ACTIVE') > -1) {
        //    document.getElementById('btnActivateRaciConfiguration').disabled = true;
        //} else {
        //    document.getElementById('btnActivateRaciConfiguration').disabled = false;
        //}
    } catch (e) {
        console.log('Exception in WorkflowRequestTypeDropDown_Onchange(): ' + e.message + ', ' + e.stack);
    }
},
WorkflowForAllRequestTypesCheckbox_Onchange: function () {
    try {
        console.log('In WorkflowForAllRequestTypesCheckbox_Onchange().');
        document.getElementById('WorkflowForAllRequestTypesCheckbox').checked = true; // This just forces it to always be checked for the time being.
        alert('In WorkflowForAllRequestTypesCheckbox_Onchange(). This functionality is incomplete. Coming soon! This functionality will allow a workflow for each budget request type.');

        //// This enables the "Activate" button when the ">>>Active<<<" workflow is not selected.
        //var selected;
        //$('#workflowsDropDown').find('option:selected').each(function (index, element) {
        //    selected = element.innerHTML;
        //});
        //console.log('In WorkflowRequestTypeDropDown_Onchange(). selected: ' + selected);
        //if (selected.indexOf('ACTIVE') > -1) {
        //    document.getElementById('btnActivateRaciConfiguration').disabled = true;
        //} else {
        //    document.getElementById('btnActivateRaciConfiguration').disabled = false;
        //}
    } catch (e) {
        console.log('Exception in WorkflowForAllRequestTypesCheckbox_Onchange(): ' + e.message + ', ' + e.stack);
    }
},
NewRoleTextBox_Onkeyup: function (elementId) {
    try {
        // This keeps the RoleId and RoleName drop-downs coordinated so that they always display the same role id.
        console.log('In NewRoleTextBox_Onkeyup(). elementId: ' + elementId);
        var roleId = document.getElementById('textNewRoleId').value;
        var roleName = document.getElementById('textNewRoleName').value;
        if (roleId == '' && roleName == '') {
            document.getElementById('selectRoleId').disabled = false;
            document.getElementById('selectRoleName').disabled = false;
            $(".selectarow-labeltext").css("color", "black");
        } else {
            $('#selectRoleId').val('');
            $('#selectRoleName').val('');
            document.getElementById('selectRoleId').disabled = true;
            document.getElementById('selectRoleName').disabled = true;
            $(".selectarow-labeltext").css("color", "lightgrey");
        }
        if (elementId == 'textNewRoleId') { // Ensure the RoleId is always capitalized.
            document.getElementById('textNewRoleId').value = roleId.toUpperCase();
        }
        if (elementId == 'textNewRoleName') { // Ensure the RoleName is always Title cased.
            var x = roleName.replace(
                /\w\S*/g,
                function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                }
            );
            document.getElementById('textNewRoleName').value = x.replace(' Of ', ' of ').replace(' Or ', ' or ').replace(' And ', ' and ').replace(' For ', ' for ').replace(' A ', ' a ').replace(' The ', ' the ');
        }
        if (roleId && roleName) {
            if (roleId.length > 1 && roleName.length > 4) {
                document.getElementById('btnCreateRole1').disabled = false;
                document.getElementById('btnCreateRole2').disabled = false;
            } else {
                document.getElementById('btnCreateRole1').disabled = true;
                document.getElementById('btnCreateRole2').disabled = true;
            }
        } else {
            document.getElementById('btnCreateRole1').disabled = true;
            document.getElementById('btnCreateRole2').disabled = true;
        }



        //var roleId;
        //if (elementId == 'selectRoleId') {
        //    $('#selectRoleId').find('option:selected').each(function (index, element) {
        //        roleId = element.value;
        //    });
        //    $('#selectRoleName').val(roleId); // set selected option
        //} else if (elementId == 'selectRoleName') {
        //    $('#selectRoleName').find('option:selected').each(function (index, element) {
        //        roleId = element.value;
        //    });
        //    $('#selectRoleId').val(roleId); // set selected option
        //} else {
        //    alert('ERROR: Invalid elementId in NewRoleTextBox_Onkeyup().');
        //}
    } catch (e) {
        console.log('Exception in NewRoleTextBox_Onkeyup(): ' + e.message + ', ' + e.stack);
    }
},
NewWorkflowDescriptionTextBox_Onkeyup: function () {
    try {
        // This makes sure that the user has entered at least 5 characters before enabling the "Save & Activate" button.
        console.log('In NewWorkflowDescriptionTextBox_Onkeyup().');
        var newWorkflowDescription = document.getElementById('txtNewWorkflowDescription').value;
        if (newWorkflowDescription && newWorkflowDescription.length > 4) {
            document.getElementById('btnsaveOrgRolesConfigurationAndActivateAndUpdateParticipants').disabled = false;
        } else {
            document.getElementById('btnsaveOrgRolesConfigurationAndActivateAndUpdateParticipants').disabled = true;
        }
    } catch (e) {
        console.log('Exception in NewWorkflowDescriptionTextBox_Onkeyup(): ' + e.message + ', ' + e.stack);
    }
},

disableButton: function (className) {
    try {
        console.log('In disableButton(). className: ' + className);
        var buttons = document.getElementsByClassName(className);
        var att = document.createAttribute("disabled");       // Create a "class" attribute
        att.value = "true";
        for (var i = 0; i < buttons.length; i++) {
            //buttons[i].disabled = true;
            //buttons[i].removeAttribute('disabled');      
            try {
                buttons[i].setAttributeNode(att);
            } catch (e) {

            }
        }
    } catch (e) {
        console.log('Exception in disableButton(): ' + e.message + ', ' + e.stack);
    }
},
enableButton: function (className) {
    try {
        console.log('In enableButton(). className: ' + className);
        var buttons = document.getElementsByClassName(className);
        //var att = document.createAttribute("disabled");       // Create a "class" attribute
        //att.value = "true";                           // Set the value of the class attribute
        for (var i = 0; i < buttons.length; i++) {
            //buttons[i].disabled = false;
            buttons[i].removeAttribute('disabled');
        }
    } catch (e) {
        console.log('Exception in enableButton(): ' + e.message + ', ' + e.stack);
    }
},
disableScrolling: function () {
    var x = window.scrollX;
    var y = window.scrollY;
    window.onscroll = function () { window.scrollTo(x, y); };
},
enableScrolling: function () {
    window.onscroll = function () { };
},
moveStepUp: function (step) {
    try {
        console.log('moveStepUp(). step: ' + step);
        alert('In moveStepUp(). Moving this step down will impact all of the budget requests. step: ' + step);

        //var stepGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        //    return v.toString(16);
        //});

        //var step = {
        //    StepName: "NewStep-" + stepGuid,
        //    InformRoles: [{}],
        //    AssignRoles: [{}]
        //};
        //this.options.store.RaciSteps.push(step);

        ////alert('In addARaciStep(). this.options.store: ' + JSON.stringify(this.options.store));

        //this._create();
    } catch (e) {
        console.log('Exception in moveStepUp(): ' + e.message + ', ' + e.stack);
    }
},
moveStepDown: function (step) {
    try {
        console.log('moveStepDown(). step: ' + step);
        alert('In moveStepDown(). Moving this step down will impact all of the budget requests. step: ' + step);

        var stepJson;
        for (var i = 0; i < this.options.store.RaciSteps.length; i++) {
            if (this.options.store.RaciSteps[i].StepName == step) {
                selectedIndex = i;
                stepJson = this.options.store.RaciSteps[i]; // Save the step
                console.log('In moveStepDown(). selectedIndex: ' + selectedIndex + ', stepJson: ' + JSON.stringify(stepJson));
                //this.options.store.splice(i + 1, 0, stepJson); // reinsert the step
                //delete this.options.store.RaciSteps[i]; // delete the step
                //
            }
        }
        alert('In moveStepDown(). this.options.store: ' + JSON.stringify(this.options.store));
        this._create();
    } catch (e) {
        console.log('Exception in moveStepDown(): ' + e.message + ', ' + e.stack);
    }
},
showProgress: function (displayText) {
    try {
        $("#divProgressBarDialog").dialog({
            modal: true,
            resizable: false,
            //closeText: "Cancel",
            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
            //title: 'Create a new Role',
            width: '800',
            height: '120',
            dialogClass: "no-close transparent-dialog", // No close button in the upper right corner.
            hide: false, // This means when hiding just disappear with no effects.
            open: function () {
                //$('.ui-widget-overlay').bind('click', function () {
                //    $("#divCreateANewRoleDialog").dialog('close');
                //});
                $("#progressbar").progressbar({
                    value: false
                });
                $('.progress-label').text(displayText);
            },
            close: function () {
                //$(this).dialog('destroy').remove();
                //$("#divProgressBarDialog").dialog('destroy').remove();
            }
            //buttons: {
            //    "Close": function () {
            //        $(this).dialog("close");
            //    }
            //}
        });
        $("#divProgressBarDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
    } catch (e) {
        console.log('Exception in showProgress(): ' + e.message + ', ' + e.stack);
    }
},
hideProgress: function () {
    try {
        $('#divProgressBarDialog').dialog('close');
    } catch (e) {
        console.log('Exception in showProgress(): ' + e.message + ', ' + e.stack);
    }
},
toggleChildCheckbox: function (checkboxId, childCheckboxId) {
    try {
        console.log('In toggleChildCheckbox(). checkboxId: ' + checkboxId + ', childCheckboxId: ' + childCheckboxId);
        document.getElementById(childCheckboxId).checked = document.getElementById(checkboxId).checked;
        //this.saveActionOrRequireCommentsCheckbox(checkboxId);
    } catch (e) {
        console.log('Exception in toggleChildCheckbox(): ' + e.message + ', ' + e.stack);
    }
},
toggleParentCheckbox: function (checkboxId, parentCheckboxId) {
    try {
        console.log('In toggleParentCheckbox(). checkboxId: ' + checkboxId + ', parentCheckboxId: ' + parentCheckboxId);
        if (document.getElementById(checkboxId).checked) {
            document.getElementById(parentCheckboxId).checked = true;
        }
        //this.saveActionOrRequireCommentsCheckbox(checkboxId);
    } catch (e) {
        console.log('Exception in toggleParentCheckbox(): ' + e.message + ', ' + e.stack);
    }
},

isLegalCondition_CheckChanged: function (elementId) {
    try {
        console.log('In isLegalCondition_CheckChanged(). elementId: ' + elementId);
        var oldConditionString = document.getElementById('spanConditionEditorContents').innerHTML.trim().replace(/&amp;/g, '&'); // Changes &amp; to &. DecodeURI doesn't work! weird!
        //
        var newConditionString = '';
        var oldConditionsArray = oldConditionString.split('&');
        var x = [];
        for (var i = 0; i < oldConditionsArray.length; i++) {
            if (oldConditionsArray[i].indexOf('$IsLegal=') > -1) {
                // do nothing.
            } else {
                x.push(oldConditionsArray[i]);
            }
        }
        // reassemble
        for (var i = 0; i < x.length; i++) {
            newConditionString += x[i];
            if (i < (x.length - 1)) {
                // There is more, so insert an ampersand.
                newConditionString += '&';
            }
        }
        //
        // Now we just have to create the $ChecklistsRequired~ string and add it to the newConditionString.
        //
        if (document.getElementById('cbIsLegal').checked) {
            // The checkbox has been selected.
            if (oldConditionString.indexOf('$IsLegal=True') > -1) {
                // do nothing
            } else {
                // We don't have the entry, so we have to add it.
                if (newConditionString.length > 0) {
                    newConditionString += '&' + '$IsLegal=True';
                } else {
                    newConditionString += '$IsLegal=True';
                }
            }
        } else {
            // The checkbox is not selected, so make sure the condition string does not have this checklist entry.
            var checklistArray = (oldConditionString.split('$IsLegal=')[1].split('&')[0]).split(',');
            var newChecklistArray = [];
            for (var x = 0; x < checklistArray.length; x++) {
                if (checklistArray[x] != '$IsLegal=True') {
                    newChecklistArray.push(checklistArray[x]);
                }
            }
        }
        document.getElementById('spanConditionEditorContents').innerHTML = newConditionString;
        //console.log('In isLegalCondition_CheckChanged(). this.checked: ' + document.getElementById('cbIsLegal').checked);
        //// Merge to get newConditionString.
        //var oldConditionString = document.getElementById('spanConditionEditorContents').innerHTML;
        //if (oldConditionString) oldConditionString = oldConditionString.trim();
        //var newConditionString = '';
        //var conditionString = '';
        //if (document.getElementById('cbIsLegal').checked) {
        //    conditionString = '$IsLegal=True';
        //}
        //var conditonStringWasAppended = false;
        //if (oldConditionString.length > 0) {
        //    for (var i = 0; i < oldConditionString.split('&amp;').length; i++) {
        //        if (oldConditionString.split('&amp;')[i].indexOf('$IsLegal=') > -1) {
        //            // We have the same condition type, so we have to replace the values.
        //            if (conditionString != '') {
        //                if (newConditionString == '') {
        //                    newConditionString += conditionString;
        //                } else {
        //                    newConditionString += '&' + conditionString;
        //                }
        //                conditonStringWasAppended = true;
        //            }
        //        } else {
        //            if (oldConditionString.split('&amp;')[i] != '') {
        //                if (newConditionString == '') {
        //                    newConditionString += oldConditionString.split('&amp;')[i];
        //                } else {
        //                    newConditionString += '&' + oldConditionString.split('&amp;')[i];
        //                }
        //            }
        //        }
        //    }
        //}
        //if (!conditonStringWasAppended) {
        //    if (conditionString != '') {
        //        if (newConditionString == '') {
        //            newConditionString += conditionString;
        //        } else {
        //            newConditionString += '&' + conditionString;
        //        }
        //    }
        //}
        //document.getElementById('spanConditionEditorContents').innerHTML = newConditionString;
    } catch (e) {
        console.log('Exception in isLegalCondition_CheckChanged(): ' + e.message + ', ' + e.stack);
    }
},

isLeaseCondition_CheckChanged: function (elementId) {
    try {
        console.log('In isLeaseCondition_CheckChanged(). elementId: ' + elementId);
        var oldConditionString = document.getElementById('spanConditionEditorContents').innerHTML.trim().replace(/&amp;/g, '&'); // Changes &amp; to &. DecodeURI doesn't work! weird!
        //
        var newConditionString = '';
        var oldConditionsArray = oldConditionString.split('&');
        var x = [];
        for (var i = 0; i < oldConditionsArray.length; i++) {
            if (oldConditionsArray[i].indexOf('$IsLease=') > -1) {
                // do nothing.
            } else {
                x.push(oldConditionsArray[i]);
            }
        }
        // reassemble
        for (var i = 0; i < x.length; i++) {
            newConditionString += x[i];
            if (i < (x.length - 1)) {
                // There is more, so insert an ampersand.
                newConditionString += '&';
            }
        }
        //
        // Now we just have to create the $ChecklistsRequired~ string and add it to the newConditionString.
        //
        if (document.getElementById('cbIsLease').checked) {
            // The checkbox has been selected.
            if (oldConditionString.indexOf('$IsLease=True') > -1) {
                // do nothing
            } else {
                // We don't have the entry, so we have to add it.
                if (newConditionString.length > 0) {
                    newConditionString += '&' + '$IsLease=True';
                } else {
                    newConditionString += '$IsLease=True';
                }
            }
        } else {
            // The checkbox is not selected, so make sure the condition string does not have this checklist entry.
            var checklistArray = (oldConditionString.split('$IsLease=')[1].split('&')[0]).split(',');
            var newChecklistArray = [];
            for (var x = 0; x < checklistArray.length; x++) {
                if (checklistArray[x] != '$IsLease=True') {
                    newChecklistArray.push(checklistArray[x]);
                }
            }
        }
        document.getElementById('spanConditionEditorContents').innerHTML = newConditionString;
        //console.log('In isLeaseCondition_CheckChanged(). this.checked: ' + document.getElementById('cbIsLease').checked);
        //// Merge to get newConditionString.
        //var oldConditionString = document.getElementById('spanConditionEditorContents').innerHTML;
        //if (oldConditionString) oldConditionString = oldConditionString.trim();
        //var newConditionString = '';
        //var conditionString = '';
        //if (document.getElementById('cbIsLease').checked) {
        //    conditionString = '$IsLease=True';
        //}
        //var conditonStringWasAppended = false;
        //if (oldConditionString.length > 0) {
        //    for (var i = 0; i < oldConditionString.split('&amp;').length; i++) {
        //        if (oldConditionString.split('&amp;')[i].indexOf('$IsLease=') > -1) {
        //            // We have the same condition type, so we have to replace the values.
        //            if (conditionString != '') {
        //                if (newConditionString == '') {
        //                    newConditionString += conditionString;
        //                } else {
        //                    newConditionString += '&' + conditionString;
        //                }
        //                conditonStringWasAppended = true;
        //            }
        //        } else {
        //            if (oldConditionString.split('&amp;')[i] != '') {
        //                if (newConditionString == '') {
        //                    newConditionString += oldConditionString.split('&amp;')[i];
        //                } else {
        //                    newConditionString += '&' + oldConditionString.split('&amp;')[i];
        //                }
        //            }
        //        }
        //    }
        //}
        //if (!conditonStringWasAppended) {
        //    if (conditionString != '') {
        //        if (newConditionString == '') {
        //            newConditionString += conditionString;
        //        } else {
        //            newConditionString += '&' + conditionString;
        //        }
        //    }
        //}
        //document.getElementById('spanConditionEditorContents').innerHTML = newConditionString;
    } catch (e) {
        console.log('Exception in isLeaseCondition_CheckChanged(): ' + e.message + ', ' + e.stack);
    }
},

isChecklistRequired_CheckChanged: function (bwChecklistTemplatesId) {
    try {
        console.log('In isChecklistRequired_CheckChanged(). bwChecklistTemplatesId: ' + bwChecklistTemplatesId);
        var oldConditionString = document.getElementById('spanConditionEditorContents').innerHTML.trim().replace(/&amp;/g, '&'); // Changes &amp; to &. DecodeURI doesn't work! weird!
        var newConditionString = '';
        var oldConditionsArray = oldConditionString.split('&');
        var x = [];
        for (var i = 0; i < oldConditionsArray.length; i++) {
            if (oldConditionsArray[i].indexOf('$ChecklistsRequired~') > -1) {
                // do nothing.
            } else {
                x.push(oldConditionsArray[i]);
            }
        }
        // reassemble
        for (var i = 0; i < x.length; i++) {
            newConditionString += x[i];
        }
        //
        // Now we just have to create the $ChecklistsRequired~ string and add it to the newConditionString.
        //
        if (document.getElementById('cbChecklistRequired_' + bwChecklistTemplatesId).checked) {
            // The checkbox has been selected.
            if (oldConditionString.indexOf('$ChecklistsRequired~') > -1) {
                // We already have the entry, so add the checklist guid.
                var newCond = oldConditionString.split('$ChecklistsRequired~')[1].split('&')[0];
                newCond += ',' + bwChecklistTemplatesId;
                if (newConditionString.length > 0) {
                    newConditionString += '&' + '$ChecklistsRequired~' + newCond;
                } else {
                    newConditionString += '$ChecklistsRequired~' + newCond;
                }
            } else {
                // We don't have the entry, so we have to add it.
                if (newConditionString.length > 0) {
                    newConditionString += '&' + '$ChecklistsRequired~' + bwChecklistTemplatesId;
                } else {
                    newConditionString += '$ChecklistsRequired~' + bwChecklistTemplatesId;
                }
            }
        } else {
            // The checkbox is not selected, so make sure the condition string does not have this checklist entry.
            if (oldConditionString.indexOf(bwChecklistTemplatesId) > -1) {
                var checklistArray = (oldConditionString.split('$ChecklistsRequired~')[1].split('&')[0]).split(',');
                var newChecklistArray = [];
                for (var x = 0; x < checklistArray.length; x++) {
                    if (checklistArray[x] != bwChecklistTemplatesId) {
                        newChecklistArray.push(checklistArray[x]);
                    }
                }
                var newCond = newChecklistArray.join(); // Creates a comma separated string.
                if (newCond.length > 0) {
                    if (newConditionString.length > 0) {
                        newConditionString += '&' + '$ChecklistsRequired~' + newCond;
                    } else {
                        newConditionString += '$ChecklistsRequired~' + newCond;
                    }
                }
            }
        }
        document.getElementById('spanConditionEditorContents').innerHTML = newConditionString;
    } catch (e) {
        console.log('Exception in isChecklistRequired_CheckChanged(): ' + e.message + ', ' + e.stack);
    }
},

isExecCondition_CheckChanged: function (elementId) {
    try {
        console.log('In isExecCondition_CheckChanged(). elementId: ' + elementId);
        var oldConditionString = document.getElementById('spanConditionEditorContents').innerHTML.trim().replace(/&amp;/g, '&'); // Changes &amp; to &. DecodeURI doesn't work! weird!
        //
        var newConditionString = '';
        var oldConditionsArray = oldConditionString.split('&');
        var x = [];
        for (var i = 0; i < oldConditionsArray.length; i++) {
            if (oldConditionsArray[i].indexOf('$IsExec=') > -1) {
                // do nothing.
            } else {
                x.push(oldConditionsArray[i]);
            }
        }
        // reassemble
        for (var i = 0; i < x.length; i++) {
            newConditionString += x[i];
            if (i < (x.length - 1)) {
                // There is more, so insert an ampersand.
                newConditionString += '&';
            }
        }
        //
        // Now we just have to create the $ChecklistsRequired~ string and add it to the newConditionString.
        //
        if (document.getElementById('cbIsExec').checked) {
            // The checkbox has been selected.
            if (oldConditionString.indexOf('$IsExec=True') > -1) {
                // do nothing
            } else {
                // We don't have the entry, so we have to add it.
                if (newConditionString.length > 0) {
                    newConditionString += '&' + '$IsExec=True';
                } else {
                    newConditionString += '$IsExec=True';
                }
            }
        } else {
            // The checkbox is not selected, so make sure the condition string does not have this checklist entry.
            var checklistArray = (oldConditionString.split('$IsExec=')[1].split('&')[0]).split(',');
            var newChecklistArray = [];
            for (var x = 0; x < checklistArray.length; x++) {
                if (checklistArray[x] != '$IsExec=True') {
                    newChecklistArray.push(checklistArray[x]);
                }
            }
        }
        document.getElementById('spanConditionEditorContents').innerHTML = newConditionString;
    } catch (e) {
        console.log('Exception in isExecCondition_CheckChanged(): ' + e.message + ', ' + e.stack);
    }
},

orgMultiPickerDialog_RenderResults: function () {
    try {
        console.log('In orgMultiPickerDialog_RenderResults().');
        var elementId = $('#OrgMultiPickerDialog_AssignmentElementId').val();
        var selectedOrgs = [];
        var orgRows = $('#divOrgMultiPickerDialog').find('.orgRow');
        for (var i = 0; i < orgRows.length; i++) {
            // Check if the checkbox is checked.
            var isSelected = document.getElementById('orgCheckbox_' + i).checked;
            if (isSelected) {
                var orgId = $(orgRows[i]).find('.orgId').text();
                var orgName = $(orgRows[i]).find('.orgName').text();
                var x = { OrgId: orgId, Name: orgName };
                selectedOrgs.push(x);
            }
        }
        var conditionString = '';
        if (selectedOrgs.length > 0) {
            // Now that we have the value(s), build the condition string.
            conditionString = '$ParentOrg~';
            var needsComma = false;
            for (var i = 0; i < selectedOrgs.length; i++) {
                if (needsComma) conditionString += ',';
                conditionString += selectedOrgs[i].OrgId;
                needsComma = true;
            }
        }

        // Merge the new values from conditionString with oldCond to get newConditionString.
        var oldConditionString = document.getElementById('spanConditionEditorContents').innerHTML;
        if (oldConditionString) oldConditionString = oldConditionString.trim();
        var newConditionString = '';
        var conditonStringWasAppended = false;
        if (oldConditionString.length > 0) {
            for (var i = 0; i < oldConditionString.split('&amp;').length; i++) {
                if (oldConditionString.split('&amp;')[i].indexOf('$ParentOrg~') > -1) {
                    // We have the same condition type, so we have to replace the values.
                    if (conditionString != '') {
                        if (newConditionString == '') {
                            newConditionString += conditionString;
                        } else {
                            newConditionString += '&' + conditionString;
                        }
                        conditonStringWasAppended = true;
                    }
                } else {
                    if (oldConditionString.split('&amp;')[i] != '') {
                        if (newConditionString == '') {
                            newConditionString += oldConditionString.split('&amp;')[i];
                        } else {
                            newConditionString += '&' + oldConditionString.split('&amp;')[i];
                        }
                    }
                }
            }
        }
        if (!conditonStringWasAppended) {
            if (conditionString != '') {
                if (newConditionString == '') {
                    newConditionString += conditionString;
                } else {
                    newConditionString += '&' + conditionString;
                }
            }
        }
        document.getElementById('spanConditionEditorContents').innerHTML = newConditionString + '<br />';

        // Figure out which step and row we are in, so that we can inject this into our json.
        //var x = elementId.split('_')[1];
        //var step = x.split('_')[0];
        //var row = elementId.split('_')[2];
        //console.log('In orgMultiPickerDialog_RenderResults: elementId: ' + elementId + ', step: ' + step + ', row: ' + row + ', newConditionString: ' + JSON.stringify(newConditionString));
        // Figure out if this an "Inform" or an "Assign" row.
        //if (elementId.indexOf('-assign') > -1) {
        //    this.options.store.Workflow.Steps.Step[step].Assign[row]["@Cond"] = newConditionString; // Update our json.
        //} else if (elementId.indexOf('-inform') > -1) {
        //    this.options.store.Workflow.Steps.Step[step].OnStart.Inform[row]["@Cond"] = newConditionString; // Update our json.
        //} else {
        //    alert('ERROR: Could not locate assignment row.');
        //}
        $('#divOrgMultiPickerDialog').dialog('close');
    } catch (e) {
        console.log('Exception in orgMultiPickerDialog_RenderResults(): ' + e.message + ', ' + e.stack);
    }
},
projectTypeMultiPickerDialog_RenderResults: function () {
    try {
        console.log('In projectTypeMultiPickerDialog_RenderResults().');
        var elementId = $('#ProjectTypeMultiPickerDialog_AssignmentElementId').val();
        var selectedProjectTypes = [];
        var projectTypeRows = $('#divProjectTypeMultiPickerDialog').find('.projectTypeRow');
        for (var i = 0; i < projectTypeRows.length; i++) {
            // Check if the checkbox is checked.
            var isSelected = document.getElementById('projectTypeCheckbox_' + i).checked;
            if (isSelected) {
                var projectTypeId = $(projectTypeRows[i]).find('.projectTypeId').text();
                var projectTypeName = $(projectTypeRows[i]).find('.projectTypeName').text();
                var x = { ProjectTypeId: projectTypeId, Name: projectTypeName };
                selectedProjectTypes.push(x);
            }
        }
        var conditionString = '';
        if (selectedProjectTypes.length > 0) {
            // Now that we have the value(s), build the condition string.
            conditionString = '$ProjectType~';
            var needsComma = false;
            for (var i = 0; i < selectedProjectTypes.length; i++) {
                if (needsComma) conditionString += ',';
                conditionString += selectedProjectTypes[i].ProjectTypeId;
                needsComma = true;
            }
        }

        // Merge the new values from conditionString with oldCond to get newConditionString.
        var oldConditionString = document.getElementById('spanConditionEditorContents').innerHTML;
        if (oldConditionString) oldConditionString = oldConditionString.trim();
        var newConditionString = '';
        var conditonStringWasAppended = false;
        if (oldConditionString.length > 0) {
            for (var i = 0; i < oldConditionString.split('&amp;').length; i++) {
                if (oldConditionString.split('&amp;')[i].indexOf('$ProjectType~') > -1) {
                    // We have the same condition type, so we have to replace the values.
                    if (conditionString != '') {
                        if (newConditionString == '') {
                            newConditionString += conditionString;
                        } else {
                            newConditionString += '&' + conditionString;
                        }
                        conditonStringWasAppended = true;
                    }
                } else {
                    if (oldConditionString.split('&amp;')[i] != '') {
                        if (newConditionString == '') {
                            newConditionString += oldConditionString.split('&amp;')[i];
                        } else {
                            newConditionString += '&' + oldConditionString.split('&amp;')[i];
                        }
                    }
                }
            }
        }
        if (!conditonStringWasAppended) {
            if (conditionString != '') {
                if (newConditionString == '') {
                    newConditionString += conditionString;
                } else {
                    newConditionString += '&' + conditionString;
                }
            }
        }
        document.getElementById('spanConditionEditorContents').innerHTML = newConditionString + '<br />';

        // Figure out which step and row we are in, so that we can inject this into our json.
        //var x = elementId.split('_')[1];
        //var step = x.split('_')[0];
        //var row = elementId.split('_')[2];
        //console.log('In projectTypeMultiPickerDialog_RenderResults: elementId: ' + elementId + ', step: ' + step + ', row: ' + row + ', newConditionString: ' + JSON.stringify(newConditionString));
        // Figure out if this an "Inform" or an "Assign" row.
        //if (elementId.indexOf('-assign') > -1) {
        //    this.options.store.Workflow.Steps.Step[step].Assign[row]["@Cond"] = newConditionString; // Update our json.
        //} else if (elementId.indexOf('-inform') > -1) {
        //    this.options.store.Workflow.Steps.Step[step].OnStart.Inform[row]["@Cond"] = newConditionString; // Update our json.
        //} else {
        //    alert('ERROR: Could not locate assignment row.');
        //}
        $('#divProjectTypeMultiPickerDialog').dialog('close');
    } catch (e) {
        console.log('Exception in projectTypeMultiPickerDialog_RenderResults(): ' + e.message + ', ' + e.stack);
    }
},
pillarMultiPickerDialog_RenderResults: function () {
    try {
        console.log('In pillarMultiPickerDialog_RenderResults().');
        var elementId = $('#PillarMultiPickerDialog_AssignmentElementId').val();
        var selectedPillars = [];
        var pillarRows = $('#divPillarMultiPickerDialog').find('.pillarRow');
        for (var i = 0; i < pillarRows.length; i++) {
            // Check if the checkbox is checked.
            var isSelected = document.getElementById('pillarCheckbox_' + i).checked;
            if (isSelected) {
                var pillarId = $(pillarRows[i]).find('.pillarId').text();
                var pillarName = $(pillarRows[i]).find('.pillarName').text();
                var x = { PillarId: pillarId, Name: pillarName };
                selectedPillars.push(x);
            }
        }
        var conditionString = '';
        if (selectedPillars.length > 0) {
            // Now that we have the value(s), build the condition string.
            conditionString = '$PillarId~';
            var needsComma = false;
            for (var i = 0; i < selectedPillars.length; i++) {
                if (needsComma) conditionString += ',';
                conditionString += selectedPillars[i].PillarId;
                needsComma = true;
            }
        }

        // Merge the new values from conditionString with oldCond to get newConditionString.
        var oldConditionString = document.getElementById('spanConditionEditorContents').innerHTML;
        if (oldConditionString) oldConditionString = oldConditionString.trim();
        var newConditionString = '';
        var conditonStringWasAppended = false;
        if (oldConditionString.length > 0) {
            for (var i = 0; i < oldConditionString.split('&amp;').length; i++) {
                if (oldConditionString.split('&amp;')[i].indexOf('$PillarId~') > -1) {
                    // We have the same condition type, so we have to replace the values.
                    if (conditionString != '') {
                        if (newConditionString == '') {
                            newConditionString += conditionString;
                        } else {
                            newConditionString += '&' + conditionString;
                        }
                        conditonStringWasAppended = true;
                    }
                } else {
                    if (oldConditionString.split('&amp;')[i] != '') {
                        if (newConditionString == '') {
                            newConditionString += oldConditionString.split('&amp;')[i];
                        } else {
                            newConditionString += '&' + oldConditionString.split('&amp;')[i];
                        }
                    }
                }
            }
        }
        if (!conditonStringWasAppended) {
            if (conditionString != '') {
                if (newConditionString == '') {
                    newConditionString += conditionString;
                } else {
                    newConditionString += '&' + conditionString;
                }
            }
        }
        document.getElementById('spanConditionEditorContents').innerHTML = newConditionString + '<br />';

        // Figure out which step and row we are in, so that we can inject this into our json.
        //var x = elementId.split('_')[1];
        //var step = x.split('_')[0];
        //var row = elementId.split('_')[2];
        //console.log('In pillarMultiPickerDialog_RenderResults: elementId: ' + elementId + ', step: ' + step + ', row: ' + row + ', newConditionString: ' + JSON.stringify(newConditionString));
        // Figure out if this an "Inform" or an "Assign" row.
        //if (elementId.indexOf('-assign') > -1) {
        //    this.options.store.Workflow.Steps.Step[step].Assign[row]["@Cond"] = newConditionString; // Update our json.
        //} else if (elementId.indexOf('-inform') > -1) {
        //    this.options.store.Workflow.Steps.Step[step].OnStart.Inform[row]["@Cond"] = newConditionString; // Update our json.
        //} else {
        //    alert('ERROR: Could not locate assignment row.');
        //}
        $('#divPillarMultiPickerDialog').dialog('close');
    } catch (e) {
        console.log('Exception in pillarMultiPickerDialog_RenderResults(): ' + e.message + ', ' + e.stack);
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
        console.log('Exception in WorkflowEditor.js.displayAlertDialog(): ' + e.message + ', ' + e.stack);
    }
},



});