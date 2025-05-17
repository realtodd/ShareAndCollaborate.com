$.widget("bw.bwNewUserChecklistsEditor", {
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
        This is the bwNewUserChecklistsEditor.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        userHasMadeChangesToTheOrganizationJson: true, // for now we will always display the Publish functionality.

        bwEnabledRequestTypes: null, // An array of the following: ['Budget Request', 'Quote Request', 'Reimbursement Request', 'Recurring Expense', 'Capital Plan Project', 'Work Order']

        quill: null, // Email body editor.
        quillSubjectEditor: null, // Email subject editor.
        displayWorkflowPicker: false,

        operationUriPrefix: null,
        ajaxTimeout: 15000,
        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function (assignmentRowChanged_ElementId) {
        this.element.addClass("bwNewUserChecklistsEditor");
        //debugger;
        //var thiz = this; // Need this because of the asynchronous operations below.
        try {
            console.log('In bwNewUserChecklistsEditor._create().');

            selfDiscoverOperationUri(thiz); // This sets this.options.operationUriPrefix correctly.

            this.renderChecklistsEditor();

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwNewUserChecklistsEditor: CANNOT INITIALIZE HOME PAGE</span>';
            html += '<br />';
            html += '<span style="">Exception in bwNewUserChecklistsEditor.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwNewUserChecklistsEditor")
            .text("");
    },

    deployNewUserExperience: function () {
        try {
            var appIdAndAppTitle = $('#selectChangeUserRoleDialogOrganizationOwnerDropDown2 option:selected').val();
            console.log('In bwNewUserChecklistsEditor.deployNewUserExperience(). appIdAndAppTitle: ' + appIdAndAppTitle);
            var proceed = confirm('Are you certain that you want to deploy the "New User" forms to this Tenant? [' + appIdAndAppTitle + ']\n\nThis action cannot be undone.\n\n\nClick the OK button to proceed...');
            if (proceed != true) {
                //alert('You have chosen not to proceed.');
            } else {

                alert('This functionality is incomplete. Coming soon!');



            }
        } catch (e) {
            console.log('Exception in bwNewUserChecklistsEditor.deployNewUserExperience(): ' + e.message + ', ' + e.stack);
        }
    },

    renderChecklistsEditor: function () {
        try {
            //debugger;
            console.log('In renderChecklistsEditor().');
            var html = '';

            //html += 'In bwNewUserChecklistsEditor.renderChecklistsEditor(). Configure new Tenant Organization and Roles... THIS FUNCTIONALITY IS INCOMPLETE. This will allow a forest administrator to edit and choose the business model that will be initially presented to a new user. New users need a default organization!!! eg: Stark Enterprises.';


            html += '<div style="display:none;" id="divConfigureChecklistsNotificationsDialog">';
            html += '   <table style="width:100%;">';
            html += '       <tr>';
            html += '           <td style="width:90%;">';
            html += '               <span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:30pt;font-weight:bold;">Configure new tenant "Introductory Checklists"...</span>';
            html += '               <br />';
            html += '               <span id="spanConfigureEmailNotificationsDialogSubTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:normal;">[spanConfigureEmailNotificationsDialogSubTitle]</span>';
            html += '           </td>';
            html += '           <td style="width:9%;"></td>';
            html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divConfigureChecklistsNotificationsDialog\').dialog(\'close\');">X</span>';
            html += '           </td>';
            html += '       </tr>';
            html += '   </table>';
            html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';


            // Publish message and button.
            html += '<table>';
            html += '<tr>';
            html += '  <td>';
            html += '';
            html += '  </td>';
            html += '  <td style="text-align:right;">';
            html += '    <span id="spanThereAreChangesToPublishText5" style="font-style:italic;color:tomato;">[spanThereAreChangesToPublishText5]</span>'; //<input value=" There are unsaved changes. Enter a description here and click Save..." type="text" id="txtNewWorkflowDescription" style="width:450px;color:grey;font-style:italic;padding:5px 5px 5px 5px;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewWorkflowDescriptionTextBox_Onkeyup\');" />';
            html += '  </td>';
            html += '  <td>';
            html += '    <span id="spanThereAreChangesToPublishButton5">[spanThereAreChangesToPublishButton5]</span>';
            html += '  </td>';
            html += '  <td>';
            html += '    <span onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderTreeviewWithNewJson\');" style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;">RE-RENDER</span>';
            html += '  </td>';
            html += '</tr>';
            html += '</table>';



            html += '   <br />';
            html += '   <span id="spanConfigureChecklistsConfigurationDialogContent">[spanConfigureChecklistsConfigurationDialogContent]</span>';
            html += '   <br />';
            html += '   <br />';
            //// Quill subject editor.
            //html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
            //html += 'Subject line:';
            //html += '</span>';
            //html == '<br />';
            //html += '   <div id="bwQuilltoolbarForSubject">';
            //html += '       <button id="btnQuill_InsertADataItemForSubject" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
            //html += '   </div>';
            //html += '   <div id="ConfigureEmailNotificationsDialogEditorForSubject" style="height:50px;"></div>'; // Quill.
            //// Quill body editor.
            //html += '<br />';
            //html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
            //html += 'Body:';
            //html += '</span>';
            //html == '<br />';
            //html += '   <div id="bwQuilltoolbar">';
            //html += '       <button id="btnQuill_InsertADataItem" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
            //html += '       <select class="ql-size">';
            //html += '           <option value="small"></option>';
            //html += '           <option selected></option>';
            //html += '           <option value="large"></option>';
            //html += '           <option value="huge"></option>';
            //html += '       </select>';
            //html += '       <button class="ql-bold"></button>';
            //html += '       <button class="ql-script" value="sub"></button>';
            //html += '       <button class="ql-script" value="super"></button>';
            //html += '   </div>';
            //html += '   <div id="ConfigureEmailNotificationsDialogEditor" style="height:375px;"></div>'; // Quill.
            //// Save button.
            //html += '   <br />';
            //html += '   <span id="spanConfigureEmailNotificationsDialogSaveButton">[spanConfigureEmailNotificationsDialogSaveButton]</span>'; // ☑ 
            //html += '   <br /><br />';
            //// Preview button.
            //html += '   <div class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;" onclick="alert(\'This functionality is incomplete. Coming soon!\');">';
            //html += '       ❏ Preview this email'; // &#10063;
            //html += '   </div>';
            //html += '   <br /><br />';
            //html += '</div>';


            html += '<div style="display:none;" id="divEmailPreviewDialog">';
            html += '  <table style="width:100%;">';
            html += '    <tr>';
            html += '      <td style="width:90%;">';
            html += '        <span id="spanEmailPreviewDialogTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Email preview</span>';
            html += '                    <br />';
            html += '                    <span id="spanEmailPreviewDialogSubTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:normal;">This email preview includes some randomly selected data.</span>';
            html += '      </td>';
            html += '      <td style="width:9%;"></td>';
            html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divEmailPreviewDialog\').dialog(\'close\');">X</span>';
            html += '      </td>';
            html += '    </tr>';
            html += '  </table>';
            html += '  <br /><br />';
            html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '  <span id="spanEmailPreviewDialogContentTop">[spanEmailPreviewDialogContentTop]</span>';
            html += '    <br />';
            html += '    <br />';
            html += '    <br />';
            html += '    <span id="spanEmailPreviewDialogContentBottom" style="font-weight:bold;cursor:pointer;">';
            html += '      [spanEmailPreviewDialogContentBottom]';
            html += '    </span>';
            html += '  <br /><br />';
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

            html += '<div style="display:none;" id="divUndoNewUserBusinessModelActivationDialog">';
            html += '  <table style="width:100%;">';
            html += '    <tr>';
            html += '      <td style="width:90%;">';
            html += '        <span id="spanUndoBusinessModelActivationTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Business Model ACTIVATED</span>';
            html += '      </td>';
            html += '      <td style="width:9%;"></td>';
            html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divUndoNewUserBusinessModelActivationDialog\').dialog(\'close\');">X</span>';
            html += '      </td>';
            html += '    </tr>';
            html += '  </table>';
            html += '  <br /><br />';
            html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '  <span id="spanUndoWorkflowActivationContentcccxxxccc11" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:20pt;">';
            html += '    This Business Model has been activated and will immediately impact the future processes. Please keep an eye on potential issues related to your change(s). ';
            html += '    <br />';
            html += '    <br />';
            html += '    <br />';
            html += '    <span style="font-weight:bold;cursor:pointer;">';
            html += '      You can change the "Active Introductory Business Model" using the drop-down at the top of this page any time';
            html += '    </span>';
            html += '  </span>';
            html += '  <br /><br />';
            html += '</div>';
            

            //html += '<table>';
            //html += '  <tr>';
            //html += '    <td style="text-align:left;vertical-align:top;" class="bwSliderTitleCell">';
            //html += '       New User/Tenant Business Model Editor:&nbsp;';
            //html += '    </td>';

            //html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
            //html += '       <table>';
            //html += '           <tr>';
            //html += '               <td>';
            //html += '                   <span id="xx" style="font-weight:bold;color:#009933;">';

            //html += '<br />';
            //html += '<span title="Edit email template(s)..." class="spanButton" onclick="$(\'.bwNewUserChecklistsEditor\').bwNewUserChecklistsEditor(\'editStepEmails\', \'Create\');"><span style="font-size:15pt;display:inline-block;">✉</span> "New User" Business Model&nbsp;&nbsp;</span>';

            //html += '</span>';
            //html += '               </td>';
            //html += '           </tr>';
            //html += '       </table>';
            //html += '    </td>';
            //html += '  </tr>';
            //html += '</table>';

            // Render the html.
            this.element.html(html);

            this.checkIfWeHaveToDisplayThePublishChangesButton();

        } catch (e) {
            console.log('Exception in renderChecklistsEditor(): ' + e.message + ', ' + e.stack);
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

                        $("#divConfigureChecklistsNotificationsDialog").dialog({
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
                                    $('#divConfigureChecklistsNotificationsDialog').dialog('close');
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
                                $('#divConfigureChecklistsNotificationsDialog').dialog('destroy');
                            }
                        });
                        $('#divConfigureChecklistsNotificationsDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
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
    editStepEmails: function (stepName) {
        try {
            console.log('In editStepEmails().');
            var thiz = this;
            //
            // Set the dialog sub title.
            //
            var html = '';
            //if (stepName.toLowerCase() == 'all') {
                html += 'These emails get sent to participants to keep them apprised of the state of their assigned tasks.';
            //} else if (stepName.toLowerCase() == 'create') {
            //    html += 'This email gets sent to participants of the "' + stepName + '" stage to confirm that the new request was received.';
            //} else {
            //    html += 'This email gets sent to participants of the "' + stepName + '" stage';
            //}
            document.getElementById('spanConfigureEmailNotificationsDialogSubTitle').innerHTML = html;
            //
            // Populate the "selectEditEmailFor" drop-down based on the workflow step etc.
            //
            //var html = '';
            //if (stepName.toLowerCase() == 'all') { // We don't display this drop-down for the Create step.
            //    //for (var i = 0; i < thiz.options.store.Workflow.Steps.Step.length; i++) {
            //    //    if (thiz.options.store.Workflow.Steps.Step[i]["@Name"] == stepName) {
            //    //        //emailTemplate = thiz.options.store.Workflow.Steps.Step[i]["@EmailTemplate"];
            //    //        var roleCategories = [];
            //    //        //debugger;
            //    //        // Get all the inform roles
            //    //        if (thiz.options.store.Workflow.Steps.Step[i].OnStart) {
            //    //            if (thiz.options.store.Workflow.Steps.Step[i].OnStart.Inform.length && thiz.options.store.Workflow.Steps.Step[i].OnStart.Inform.length > 0) {
            //    //                var roleCategory = 'Informed'; //thiz.options.store.Workflow.Steps.Step[i].OnStart.Inform["@RoleCategory"]; << RoleCategory doesn't exist in the json here...
            //    //                if (roleCategories.indexOf(roleCategory) > -1) {
            //    //                    //
            //    //                } else {
            //    //                    roleCategories.push(roleCategory);
            //    //                }
            //    //            }
            //    //        }
            //    //        // Get all the assign roles (Collaborator, Approver, CREATE, ADMIN 
            //    //        if (thiz.options.store.Workflow.Steps.Step[i].Assign) {
            //    //            if (thiz.options.store.Workflow.Steps.Step[i].Assign.length) {
            //    //                for (var x = 0; x < thiz.options.store.Workflow.Steps.Step[i].Assign.length; x++) {
            //    //                    var roleCategory = thiz.options.store.Workflow.Steps.Step[i].Assign[x]["@RoleCategory"];
            //    //                    if (roleCategories.indexOf(roleCategory) > -1) {
            //    //                        //
            //    //                    } else {
            //    //                        roleCategories.push(roleCategory);
            //    //                    }
            //    //                }
            //    //            } else if (thiz.options.store.Workflow.Steps.Step[i].Assign) {
            //    //                var roleCategory = thiz.options.store.Workflow.Steps.Step[i].Assign["@RoleCategory"];
            //    //                if (roleCategories.indexOf(roleCategory) > -1) {
            //    //                    //
            //    //                } else {
            //    //                    roleCategories.push(roleCategory);
            //    //                }
            //    //            }
            //    //        }
            //    //        break;
            //    //    }
            //    //}
            //    html += 'Editing email template: ';



            //    //if (roleCategories.length == 1) {
            //    //    html += roleCategories[i];
            //    //} else {
            //    //html += '<select style="padding:5px 5px 5px 5px;" id="selectEditEmailFor" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'selectEditEmailFor_OnChange\', \'editing\');">';
            //    //for (var i = 0; i < roleCategories.length; i++) {
            //    //    html += '<option value="' + roleCategories[i] + '">' + roleCategories[i] + '</option>';
            //    //}
            //    //html += '</select>';
            //    //html += '&nbsp;&nbsp;';
            //    html += '<select style="padding:5px 5px 5px 5px;" id="selectEditEmailFor" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'selectEditEmailFor_OnChange\', \'editing\');">';
            //    html += '<option value="Informed" selected>Informed</option>';
            //    html += '<option value="Task Assigned">Task Assigned</option>';
            //    html += '<option value="Task Overdue">Task Overdue</option>';
            //    html += '<option value="Task Cancelled">Task Cancelled</option>';
            //    html += '</select>';
            //    //}
            //} else if (stepName.toLowerCase() == 'create') {
            //    // no drop down.
            //} else if (stepName.toLowerCase() == 'collaboration') {
            //    // no drop down.
            //} else {
            //    alert('Unexpected value for stepName in editStepEmails(): ' + stepName);
            //}

            //html += '<br />';
            //html += '<span style="font-style:italic;font-size:small;color:tomato;">The participants with RACI role of Informed will receive this email when significant notifications need to be delivered to them.</span>';
            ////html += '<br />';

            //document.getElementById('spanConfigureEmailNotificationsDialogSelectEditEmailForDropdown').innerHTML = html;

            //
            // Set the "Save" button.
            //
            //var html = '';
            //html += '<div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" onclick="alert(\'This functionality is incomplete. Coming soon!\');">';
            //html += '☑ Save this email template';
            //html += '</div>';
            //document.getElementById('spanConfigureEmailNotificationsDialogSaveButton').innerHTML = html;
            // Display the email editor.
            //debugger;
            $("#divConfigureChecklistsNotificationsDialog").dialog({
                modal: true,
                resizable: false,
                //closeText: "Cancel",
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                //title: 'divConfigureChecklistsNotificationsDialog',
                width: '1200',
                dialogClass: 'no-close', // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    try {
                        $('.ui-widget-overlay').bind('click', function () {
                            $('#divConfigureChecklistsNotificationsDialog').dialog('close');
                        });
                        

                        //debugger;


                        var html = '';
                        html += '<div id="divBwChecklistsEditor">[divBwChecklistsEditor]</div>';

                        document.getElementById('spanConfigureChecklistsConfigurationDialogContent').innerHTML = html;



                        bwEnabledRequestTypes.EnabledItems = [];
                        //if (true) {
                            bwEnabledRequestTypes.Details.BudgetRequests.Enabled = true; // Todd: We need to create a spot in the database for this, and add a settings slider....
                            var request = ['budgetrequest', 'Budget Request', 'selected'];
                            bwEnabledRequestTypes.EnabledItems.push(request);
                        //}
                        //if (true) {
                            bwEnabledRequestTypes.Details.CapitalPlanProjects.Enabled = true; // Todd: We need to create a spot in the database for this, and add a settings slider....
                            var request = ['capitalplanproject', 'Capital Plan Project', ''];
                            bwEnabledRequestTypes.EnabledItems.push(request);
                        //}
                        //if (userData.participant.participantWorkflowApps[wa].bwQuotingEnabled == 'true') {
                            bwEnabledRequestTypes.Details.QuoteRequests.Enabled = true;
                            var request = ['quoterequest', 'Quote Request', ''];
                            bwEnabledRequestTypes.EnabledItems.push(request);
                        //}
                        //if (userData.participant.participantWorkflowApps[wa].bwExpenseRequestsEnabled == 'true') {
                            bwEnabledRequestTypes.Details.ReimbursementRequests.Enabled = true;
                            var request = ['expenserequest', 'Reimbursement Request', ''];
                            bwEnabledRequestTypes.EnabledItems.push(request);

                        //}
                       // if (userData.participant.participantWorkflowApps[wa].bwRecurringExpensesEnabled == 'true') {
                            bwEnabledRequestTypes.Details.RecurringExpenses.Enabled = true;
                            var request = ['recurringexpense', 'Recurring Expense', ''];
                            bwEnabledRequestTypes.EnabledItems.push(request);
                        //}
                        //if (true) {
                            bwEnabledRequestTypes.Details.WorkOrders.Enabled = true; // Todd: We need to create a spot in the database for this, and add a settings slider....
                            var request = ['workorder', 'Work Order', ''];
                            bwEnabledRequestTypes.EnabledItems.push(request);
                        //}

                        var options = {
                            DisplayAsNewTenantUserConfigurationEditor: true,
                            //displayWorkflowPicker: true,
                            bwEnabledRequestTypes: bwEnabledRequestTypes
                            //bwTenantId: tenantId,
                            //bwWorkflowAppId: workflowAppId,
                            //bwEnabledRequestTypes: bwEnabledRequestTypes
                        };
                        var $bwchecklistseditor = $("#divBwChecklistsEditor").bwChecklistsEditor(options);


                        //debugger;


                        //document.getElementById('workflowcontainer1').innerHTML = 'TODD JSON GOES HERE';

                    } catch (e) {
                        console.log('Exception in editStepEmails.divConfigureChecklistsNotificationsDialog.open(): ' + e.message + ', ' + e.stack);
                    }
                },
                close: function () {
                    $('#divConfigureChecklistsNotificationsDialog').dialog('destroy');
                }

            });
            //$('#divConfigureChecklistsNotificationsDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();









        } catch (e) {
            console.log('Exception in editStepEmails(): ' + e.message + ', ' + e.stack);
        }
    },
    displayEmailDataItemPickerDialog: function (emailSection) { // emailSection is either 'subject' or 'body'.
        try {
            console.log('In displayEmailDataItemPickerDialog().');
            //
            debugger;
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
            document.getElementById('spanEmailDataItemPickerDialogSubTitle').innerHTML = 'Data items use percentage delimiters, for example: %data item name%<br /><br />Select a data item then click the "Insert" button to have it inserted at the cursor...';
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
            html += '   <option value="3">Budget Request Title</option>'; // Project Title, or also known as "Description".
            html += '   <option value="3">Next Task Assignment Text</option>';
            html += '   <option value="3">Role Abbreviation</option>';
            html += '   <option value="3">Role Name</option>';
            html += '</select>';
            html += '&nbsp;&nbsp;';
            html += '<input style="padding:5px 10px 5px 10px;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'insertEmailDataItem\', \'' + emailSection + '\');" type="button" value="Insert">';
            document.getElementById('spanEmailDataItemPickerDialogContentTop').innerHTML = html;
        } catch (e) {
            console.log('Exception in displayEmailDataItemPickerDialog(): ' + e.message + ', ' + e.stack);
        }
    },

    checkIfWeHaveToDisplayThePublishChangesButton: function () {
        try {
            //debugger;
            console.log('In checkIfWeHaveToDisplayThePublishChangesButton4().');
            //var thereHaveBeenChangesToTheWorkflow = false;
            //var oldJsonString = JSON.stringify(this.options.CurrentEmailTemplate.EmailTemplate);
            //var newJsonString = JSON.stringify(this.options.CurrentEmailTemplate.DraftEmailTemplate);
            //if (oldJsonString != newJsonString) {
            //    thereHaveBeenChangesToTheWorkflow = true;
            //}
            if (this.options.userHasMadeChangesToTheOrganizationJson == true) {
                // The user has made changes to the workflow.
                document.getElementById('spanThereAreChangesToPublishText5').innerHTML = 'You have changes that won\'t be available until you publish: ';
                var html = '';
                html += '<input style="padding:5px 10px 5px 10px;width:100px;" id="btnSaveWorkflowConfigurationAndActivate" type="button" value="Publish" onclick="$(\'.bwNewUserChecklistsEditor\').bwNewUserChecklistsEditor(\'publishNewUserBusinessModelConfigurationAndActivate\');" />';
                html += '&nbsp;<input style="padding:5px 10px 5px 10px;" id="btnCancelChangesInDraftWorkflowConfiguration" type="button" value="Cancel Changes" onclick="$(\'.bwNewUserChecklistsEditor\').bwNewUserChecklistsEditor(\'cancelChangesInDraftWorkflowConfiguration\');" />';
                document.getElementById('spanThereAreChangesToPublishButton5').innerHTML = html;
            } else {
                // Do nothing because the user has made no changes to the workflow.
                document.getElementById('spanThereAreChangesToPublishText5').innerHTML = '';
                document.getElementById('spanThereAreChangesToPublishButton5').innerHTML = '';
            }
        } catch (e) {
            console.log('Exception in checkIfWeHaveToDisplayThePublishChangesButton(): ' + e.message + ', ' + e.stack);
        }
    },
    publishNewUserBusinessModelConfigurationAndActivate: function () {
        var thiz = this;
        try {
            console.log('In publishNewUserBusinessModelConfigurationAndActivate().');
            //debugger;
            var bwOrgRolesJson = document.getElementById('txtNewUserOrganizationModelJSON').innerHTML;

            var json = {
                //bwIntroductoryEmailHtml: JSON.stringify(this.options.CurrentEmailTemplate.DraftEmailTemplate) // Stored as stringified json object eg: { Subject: null, Body: null }.
                bwOrgRolesJson: JSON.stringify(bwOrgRolesJson)
            };
            $.ajax({
                url: thiz.options.operationUriPrefix + "_bw/PublishNewTenantBusinessModelDefault",
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
                        console.log('In PublishNewTenantBusinessModelDefault().post: Successfully updated DB. result: ' + JSON.stringify(result));
                        $("#divUndoNewUserBusinessModelActivationDialog").dialog({
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
                                    $('#divUndoNewUserBusinessModelActivationDialog').dialog('close');
                                });

                                // re-sync this.options.store
                                //thiz.options.CurrentEmailTemplate.EmailTemplate = JSON.parse(JSON.stringify(json));
                                //thiz.options.CurrentEmailTemplate.DraftEmailTemplate = JSON.parse(JSON.stringify(json));
                                //thiz.checkIfWeHaveToDisplayThePublishChangesButton();

                            },
                            close: function () {
                                $('#divUndoNewUserBusinessModelActivationDialog').dialog("destroy");
                                //    //thiz._create(); // When the user closes this dialog, we regenerate the screen to reflect the newly created and activated workflow. <<< NOT NECESSARY!!!! ONLY USING FOR TESTING.
                                //    debugger;
                                //    thiz.checkIfWeHaveToDisplayThePublishChangesButton();
                            }
                        });
                        $('#divUndoNewUserBusinessModelActivationDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
                    }

                } catch (e) {
                    console.log('Exception in PublishNewTenantBusinessModelDefault().xx.update: ' + e.message + ', ' + e.stack);
                    alert('Exception in PublishNewTenantBusinessModelDefault().xx.update: ' + e.message + ', ' + e.stack);
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
                console.log('Fail in PublishNewTenantBusinessModelDefault().xx.update: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
                alert('Fail in PublishNewTenantBusinessModelDefault().xx.update: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                //var error = JSON.parse(data.responseText)["odata.error"];
                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            });
        } catch (e) {
            debugger;
            //thiz.hideProgress();
            alert('Exception in PublishNewTenantBusinessModelDefault(): ' + e.message + ', ' + e.stack);
            console.log('Exception in PublishNewTenantBusinessModelDefault(): ' + e.message + ', ' + e.stack);
        }
    },
    cancelChangesInDraftWorkflowConfiguration: function () {
        try {
            debugger;
            console.log('In cancelChangesInDraftWorkflowConfiguration().');
            //this.options.CurrentEmailTemplate.EmailTemplate = JSON.parse(JSON.stringify(this.options.CurrentEmailTemplate.DraftEmailTemplate)); // Creating "DraftWorkflow" so we can tell if the workflow has been changed or not, and then inform the user that changes need to be published.
            //this.renderEmailEditor(); // Definition is renderWorkflowEditor(assignmentRowChanged_ElementId).
        } catch (e) {
            console.log('Exception in cancelChangesInDraftWorkflowConfiguration(): ' + e.message + ', ' + e.stack);
        }
    },

});