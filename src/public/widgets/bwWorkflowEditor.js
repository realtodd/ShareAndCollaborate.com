$.widget("bw.bwWorkflowEditor", {
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
        This is the bwWorkflowEditor.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        value: 0,

        DisplayAsNewTenantUserConfigurationEditor: null,

        CurrentWorkflow: null,

        Workflows: null, // This is all of the workflows.

        Checklists: null,

        //bwTenantId: null,
        //bwWorkflowAppId: null,
        bwEnabledRequestTypes: null, // An array of the following: ['Budget Request', 'Quote Request', 'Reimbursement Request', 'Recurring Expense', 'Capital Plan Project', 'Work Order']
        operationUriPrefix: null,
        ajaxTimeout: 15000,
        quill: null, // Email body editor.
        quillSubjectEditor: null, // Email subject editor.
        displayWorkflowPicker: false,
        displayRoleIdColumn: false,
        autoSenseDeviceType: false, // Automatic UI based on device type. Alpha version so far.
        MultipleWorkflowsEnabled: false,
        LastSelectedRequestType: null
    },

    _create: function (assignmentRowChanged_ElementId) {
        this.element.addClass("bwWorkflowEditor");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {
            if (this.options.operationUriPrefix == null) {
                // This formulates the operationUri, which is used throughout.
                var url1 = window.location.href.split('https://')[1];
                var url2 = url1.split('/')[0];
                this.options.operationUriPrefix = 'https://' + url2 + '/';
            }

            if (this.options.CurrentWorkflow != null) {
                this.element.html(this.renderWorkflowEditor1(assignmentRowChanged_ElementId)); // Render the Workflow Editor. 
            } else {
                var promise = this.loadWorkflowsAndCurrentWorkflow(); //'budgetrequest'); // This is the default.
                promise.then(function (result) {
                    try {
                        thiz.element.html(thiz.renderWorkflowEditor1(assignmentRowChanged_ElementId)); // Render the Workflow Editor. 
                    } catch (e) {
                        console.log('Exception in bwWorkflowEditor._create().loadWorkflowsAndCurrentWorkflow(): ' + e.message + ', ' + e.stack);
                        thiz.element.html('Exception in bwWorkflowEditor._create().loadWorkflowsAndCurrentWorkflow(): ' + e.message + ', ' + e.stack);
                    }
                });
            }

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwWorkflowEditor: CANNOT RENDER THE WORKFLOW MATRIX</span>';
            html += '<br />';
            html += '<span style="">Exception in bwWorkflowEditor.Create(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    },

    addANewEmailNotification: function () {
        try {
            console.log('In bwWorkflowEditor.js.addANewEmailNotification().');
            var thiz = this;

            var dialogId = 'bwWorkflowEditor_EmailNotification_EditorDialog';

            var div = document.getElementById(dialogId);
            if (!div) {

                div = document.createElement('div');
                div.id = dialogId;
                div.style.display = 'none';
                document.body.appendChild(div); // Place at end of document

                var html = '';

                html += '  <table style="width:100%;">';
                html += '    <tr>';
                html += '      <td style="width:90%;">';
                html += '        <span style="color: #3f3f3f;font-size:30pt;font-weight:bold;">New Email Notification</span>';
                html += '      </td>';
                html += '      <td style="width:9%;"></td>';
                html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
                html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#' + dialogId + '\').dialog(\'close\');">X</span>';
                html += '      </td>';
                html += '    </tr>';
                html += '  </table>';
                html += '  <br /><br />';
                html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                //html += '  <span id="" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:20pt;">xcx3241234214</span>';
                html += '  <br />';
                html += '  <br />';

                debugger;

                // Now set the current workflow based on the selection from the drop-down.
                var bwRequestTypeId;
                $('#selectRequestTypeDropDown').find('option:selected').each(function (index, element) {
                    bwRequestTypeId = element.value;
                });

                html += `<span style="font-family:Verdana;font-size:14pt;">Select the step: </span><select style="font-family: 'Segoe UI Light','Segoe UI','Segoe',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;font-weight:bold;">`;

                for (var i = 0; i < thiz.options.Workflows.length; i++) {
                    if ((thiz.options.Workflows[i].bwRequestTypeId == bwRequestTypeId) && (thiz.options.Workflows[i].isActive == true)) {

                        

                        if (thiz.options.Workflows[i].bwWorkflowJson) {

                            var bwWorkflowJson = thiz.options.Workflows[i].bwWorkflowJson;

                            var workflow = JSON.parse(bwWorkflowJson);

                            for (var j = 0; j < workflow.Steps.Step.length; j++) {

                                html += `<option value="">` + workflow.Steps.Step[j]["@Name"] + `</option>`;

                            }
                            debugger; // Iterate and list the steps
                           

                            //thiz.options.CurrentWorkflow["Workflow"] = JSON.parse(thiz.options.Workflows[i].bwWorkflowJson);
                            //thiz.options.CurrentWorkflow["DraftWorkflow"] = JSON.parse(thiz.options.Workflows[i].bwWorkflowJson); // Creating "DraftWorkflow" so we can tell if the workflow has been changed or not, and then inform the user that changes need to be published.

                            //car = thiz.options.Workflows[i]; // 1-4-2022
                            //alert('Set CurrentWorkflow xcx111774-8');
                            console.log('Set CurrentWorkflow xcx111774-8');
                            break;
                        } else {
                            console.log('');
                            console.log('INVALID VALUE FOR thiz.options.Workflows[i].bwWorkflowJson: ' + thiz.options.Workflows[i].bwWorkflowJson);
                            console.log('');
                        }


                    }
                }
                html += `</select>`;



                html += `                        <br /><br />
                        <span style="font-family:Verdana;font-size:14pt;">Select the step event: </span><select style="font-family: 'Segoe UI Light','Segoe UI','Segoe',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;font-weight:bold;">
                            <option value="">step starting</option>
                            <option value="">step ending</option>
                        </select>
                        <br /><br />
                        <span style="font-family:Verdana;font-size:14pt;">Select the audience: </span><select style="font-family: 'Segoe UI Light','Segoe UI','Segoe',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;font-weight:bold;">
                            <option value="">Approver</option>
                            <option value="">Collaborator</option>
                            <option value="">Informed</option>
                            <option value="">Creator</option>
                            <option value="">Manager/Sponsor</option>
                            <option value="">Workflow Administrator (ADMIN)</option>
                            <option value="">Customer</option>
                            <option value="">Vendor</option>
                            <option value="">Everyone</option>
                        </select>
                        <br /><br />`;




                html += '  <br />';
                html += '  <br />';
                html += '  <div id="btnRunDiagnosticsxxx" class="divDialogButton" title="Click here to create the new email...">';
                html += '   Create Email Notification...';
                html += '  </div>';
                html += '  <br /><br />';
                html += '  <div class="divDialogButton" onclick="$(\'#' + dialogId + '\').dialog(\'close\');">';
                html += '   Close';
                html += '  </div>';
                html += '  <br />';
                html += '  <br />';

                div.innerHTML = html;
            }

            // Display a dialog box with a big textarea so that the contents can be copied and pasted.
            $('#' + dialogId).dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: "820",
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false,//, // This means when hiding just disappear with no effects.
                open: function (event, ui) {
                    $('.ui-widget-overlay').bind('click', function () {
                        $('#' + dialogId).dialog('close');
                    });

                    //$('#spanImageAnalysisContent_' + thiz.options.elementIdSuffix).val(JSON.stringify(results.data, null, 2));


                }, // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.
                close: function () {
                    $('#' + dialogId).dialog('destroy');
                }
            });
            //$("#divDisplayJsonDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();



        } catch (e) {
            var msg = 'Exception in bwWorkflowEditor.js.addANewEmailNotification(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
        }
    },
    createNewWorkflowJson: function (bwRequestType) {
        try {
            alert('In createNewWorkflowJson(). This functionality is incomplete. Coming soon!');
        } catch (e) {
            console.log('Exception in createNewWorkflowJson(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in createNewWorkflowJson(): ' + e.message + ', ' + e.stack);
        }
    },

    displayEditWorkflowJsonDialog: function (bwWorkflowId) {
        try {
            console.log('In displayEditWorkflowJsonDialog(). bwWorkflowId: ' + bwWorkflowId);
            alert('In displayEditWorkflowJsonDialog(). bwWorkflowId: ' + bwWorkflowId);
            // THIS WORKS JUST SHUT OFF FOR THE MOMENT 5-12-2020
            var thiz = this;




            // TODD WHATS UP WHY ? 2-9-2022





            var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');



            var bwRequestTypeId;
            for (var i = 0; i < this.options.Workflows.length; i++) {
                if (bwWorkflowId == this.options.Workflows[i].bwWorkflowId) {
                    bwRequestTypeId = this.options.Workflows[i].bwRequestTypeId;
                    break;
                }
            }

            debugger; // 2-9-2022
            if (!bwRequestTypeId) {
                // If we get here, we can lookup the bwRequestTypeId from the selectRequestTypeDropDown drop-down.
                $('#selectRequestTypeDropDown').find('option:selected').each(function (index, element) {
                    bwRequestTypeId = element.value;
                });
            }


            if (!bwRequestTypeId) {
                console.log('In displayEditWorkflowJsonDialog(). Invalid value for bwRequestTypeId: ' + bwRequestTypeId);
                displayAlertDialog('In displayEditWorkflowJsonDialog(). Invalid value for bwRequestTypeId: ' + bwRequestTypeId);
            } else {

                $("#divDisplayJsonDialog").dialog({
                    modal: true,
                    resizable: false,
                    closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                    width: '900',
                    dialogClass: 'no-close', // No close button in the upper right corner.
                    hide: false, // This means when hiding just disappear with no effects.
                    open: function () {
                        try {
                            debugger; // 1-4-2022

                            $('.ui-widget-overlay').bind('click', function () {
                                $('#divDisplayJsonDialog').dialog('close');
                            });

                            $(this).find('#spanDisplayJsonDialogTitle').html('Edit Workflow JSON'); //document.getElementById('spanDisplayJsonDialogTitle').innerHTML = 'Edit Workflow JSON';

                            var html = '';
                            html += 'Workflow Id: ' + bwWorkflowId;
                            //html += '<br />';
                            //html += 'DEV NOTE: The JSON does not completely render in the box below. Use this button to copy the JSON: <input type="button" value="Copy2" onclick="alert(\'This functionality is incomplete. Coming soon!\');" />';
                            //html += '<br />';
                            $(this).find('#spanDisplayJsonDialogContent').html(html); // document.getElementById('spanDisplayJsonDialogContent').innerHTML = 'Workflow: ' + bwWorkflowId;

                            $(this).find('#btnRunDiagnostics').html('<span style="font-size:30pt;">⚠ Save/Update Workflow JSON</span>'); // document.getElementById('btnRunDiagnostics').innerHTML = '<span style="font-size:30pt;">⚠ Save/Update Workflow JSON</span>'; // btnRunDiagnostics

                            $(this).find('#btnRunDiagnostics').off('click').click(function () {
                                try {
                                    debugger; // 1-4-2022
                                    // This is where we validate the JSON and save it back to the database, activating the new workflow JSON/Definition.
                                    var bwWorkflowJson = $('#divDisplayJsonDialog').find('#txtDisplayJsonDialogJSON').val(); // document.getElementById('txtDisplayJsonDialogJSON').value;
                                    var validJson = true;
                                    try {
                                        var json2 = JSON.parse(bwWorkflowJson);
                                    } catch (e) {
                                        validJson = false;
                                    }
                                    if (validJson != true) {
                                        console.log('Error in displayEditWorkflowJsonDialog(). INVALID JSON. Cannot proceed.');
                                        displayAlertDialog('Error in displayEditWorkflowJsonDialog(). INVALID JSON. Cannot proceed.');

                                    } else {
                                        //alert('VALID JSON');

                                        //var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
                                        //var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                                        //var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                                        //var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
                                        //var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

                                        if (confirm("This is valid JSON. Are you certain you wish to activate this workflow? THIS ACTION CANNOT BE UNDONE.")) {
                                            // Send JSON to the database for this workflow. // json
                                            //debugger;
                                            var json = {
                                                bwTenantId: tenantId,
                                                bwWorkflowAppId: workflowAppId,
                                                bwWorkflowId: bwWorkflowId,
                                                bwRequestTypeId: bwRequestTypeId,
                                                ModifiedByFriendlyName: participantFriendlyName,
                                                ModifiedById: participantId,
                                                ModifiedByEmail: participantEmail,
                                                Description: '',
                                                bwWorkflowJson: bwWorkflowJson
                                            };
                                            $.ajax({
                                                url: thiz.options.operationUriPrefix + "odata/publishworkflow2", // ???????????????????????????????????????????????????????????????????????????????????????????????????
                                                type: "Post",
                                                data: json,
                                                headers: {
                                                    "Accept": "application/json; odata=verbose"
                                                }
                                            }).success(function (result) {
                                                try {
                                                    debugger; // 1-4-2022
                                                    if (result == 'SUCCESS') {
                                                        console.log('In bwWorkflowEditor.js.displayEditWorkflowJsonDialog().post: Successfully updated DB. result: ' + JSON.stringify(result)); // using (' + JSON.stringify(json) + ').');
                                                        alert('In bwWorkflowEditor.js.displayEditWorkflowJsonDialog().post: Successfully updated DB.');
                                                    } else {
                                                        thiz.displayAlertDialog('Error in displayEditWorkflowJsonDialog(): ' + result);
                                                    }
                                                    // Display a dialog with an "Undo" button!!!!
                                                    //$("#divUndoWorkflowActivationDialog").dialog({
                                                    //    modal: true,
                                                    //    resizable: false,
                                                    //    closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                                                    //    width: '800',
                                                    //    dialogClass: 'no-close', // No close button in the upper right corner.
                                                    //    hide: false, // This means when hiding just disappear with no effects.
                                                    //    open: function () {
                                                    //        $('.ui-widget-overlay').bind('click', function () {
                                                    //            $('#divUndoWorkflowActivationDialog').dialog('close');
                                                    //        });
                                                    //    },
                                                    //    close: function () {
                                                    //        var promise = thiz.loadWorkflowsAndCurrentWorkflow(selectedRequestType);
                                                    //        promise.then(function (result) {
                                                    //            try {
                                                    //                $('#divUndoWorkflowActivationDialog').dialog("destroy");
                                                    //                $('#divActivateSelectedWorkflowDialog').dialog('close');
                                                    //                $('#divWorkflowsConfigurationDialog').dialog('close');
                                                    //                thiz.renderWorkflowEditor2();
                                                    //                thiz.checkIfWeHaveToDisplayThePublishChangesButton();
                                                    //            } catch (e) {
                                                    //                console.log('Exception in bwWorkflowEditor._create().loadWorkflowsAndCurrentWorkflow(): ' + e.message + ', ' + e.stack);
                                                    //            }
                                                    //        });
                                                    //    }
                                                    //});
                                                    //$('#divUndoWorkflowActivationDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();

                                                    //thiz.options.CurrentWorkflow.DraftWorkflow = JSON.parse(JSON.stringify(thiz.options.CurrentWorkflow.Workflow)); 
                                                    //thiz.checkIfWeHaveToDisplayThePublishChangesButton();

                                                } catch (e) {
                                                    console.log('Exception in bwWorkflowEditor.js.displayEditWorkflowJsonDialog().xx.update: ' + e.message + ', ' + e.stack);
                                                    displayAlertDialog('Exception in bwWorkflowEditor.js.displayEditWorkflowJsonDialog().xx.update: ' + e.message + ', ' + e.stack);
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
                                                console.log('Fail in bwWorkflowEditor.js.displayEditWorkflowJsonDialog().xx.update: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
                                                displayAlertDialog('Fail in bwWorkflowEditor.js.displayEditWorkflowJsonDialog().xx.update: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                                                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                                                //var error = JSON.parse(data.responseText)["odata.error"];
                                                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                                            });

                                        }
                                    }
                                } catch (e) {
                                    console.log('Exception in xx.btnRunDiagnostics.click(): ' + e.message + ', ' + e.stack);
                                    displayAlertDialog('Exception in xx.btnRunDiagnostics.click(): ' + e.message + ', ' + e.stack);
                                }
                            });

                            debugger; // 2-9-2022 if this gets and error its because we renamed the webservice from WorkflowConfiguration4 to ActiveWorkflowForOrganizationRequestType BUT DIDNT DO IT HERE is this old code??????????
                            //$.ajax({
                            //    //url: thiz.options.operationUriPrefix + "odata/WorkflowConfiguration4/" + tenantId + '/' + workflowAppId + '/' + bwWorkflowId,
                            //    //url: thiz.options.operationUriPrefix + "_bw/ActiveWorkflowForOrganizationRequestType/" + workflowAppId + '/' + bwWorkflowId, // 
                            //    url: thiz.options.operationUriPrefix + "_bw/ActiveWorkflowForOrganizationRequestType/" + workflowAppId + '/' + bwRequestTypeId,
                            //    dataType: "json",
                            //    contentType: "application/json",
                            //    type: "Get",
                            //    timeout: thiz.options.ajaxTimeout
                            //}).done(function (result) {
                            //    try {

                            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                            var data = {
                                bwParticipantId_LoggedIn: participantId,
                                bwActiveStateIdentifier: activeStateIdentifier,
                                bwWorkflowAppId_LoggedIn: workflowAppId,

                                bwWorkflowAppId: workflowAppId,
                                bwRequestTypeId: bwRequestTypeId,
                                isActive: true
                            };
                            $.ajax({
                                url: thiz.options.operationUriPrefix + "_bw/workflowconfiguration",
                                type: "POST",
                                data: data,
                                headers: {
                                    "Accept": "application/json; odata=verbose"
                                },
                                success: function (result) {
                                    try {
                                        debugger; // 1-4-2022

                                        if (!(result.value && result.value[0] && result.value[0].bwWorkflowJson)) {
                                            $('#txtDisplayJsonDialogJSON').empty();
                                            $('#txtDisplayJsonDialogJSON').append('THERE IS NO bwWorkflowJson for bwWorkflowAppId xcx93465: ' + bwWorkflowAppId + ', bwWorkflowId: ' + bwWorkflowId);
                                        } else {
                                            var json = JSON.parse(result.value[0].bwWorkflowJson);

                                            $('#txtDisplayJsonDialogJSON').empty();






                                            //var string = JSON.stringify(json, null, 2);
                                            //
                                            // Since the @EmailTemplate attribute doesn't work 100% correctly, probably due to the html elements in it, or perhaps quotes... we will go through and fix them up so that the text can be copied successfully.
                                            // THE WHOLE GOAL OF THIS EFFORT is to make it so that a workflow can be copied an dpasted in the browser from one place to another, preserving the email templates contained therein.
                                            //
                                            //var json = JSON.parse(thiz.options.Workflows[i].bwWorkflowJson);
                                            for (var i = 0; i < json.Steps.Step.length; i++) {
                                                if (json.Steps.Step[i]["@EmailTemplate"]) {
                                                    // IF WE GET HERE there is an email template.
                                                    var template = json.Steps.Step[i]["@EmailTemplate"];
                                                    debugger;

                                                    //template = template.replace(/["]/g, '&quot;'); // Replace double-quote with &quot;


                                                    console.log('');
                                                    console.log('===================================================================================');
                                                    console.log('This is where we make sure the email templates JSON works OK in the workflow JSON. xcx1');
                                                    console.log('===================================================================================');
                                                    console.log('');



                                                    template = template.replace(/\n/g, ''); // '<br />'); // I don't think we need these so just getting rid of them.

                                                    template = template.replace(/</g, '&lt;'); // Replace greater and lesser than characters.
                                                    template = template.replace(/>/g, '&gt;'); // Replace greater and lesser than characters.

                                                    //emailTemplate = emailTemplate.replace(/\\/g, '&bsol;'); // Backslash : \  : &#92; : &bsol;

                                                    json.Steps.Step[i]["@EmailTemplate"] = template; //'REPLACED REPLACED';
                                                }
                                                // EmailTemplateForSubject
                                                if (json.Steps.Step[i]["@EmailTemplateForSubject"]) {
                                                    // IF WE GET HERE there is an email template.
                                                    var template = json.Steps.Step[i]["@EmailTemplateForSubject"];
                                                    debugger;

                                                    //template = template.replace(/["]/g, '&quot;'); // Replace double-quote with &quot;


                                                    console.log('');
                                                    console.log('===================================================================================');
                                                    console.log('This is where we make sure the email templates JSON works OK in the workflow JSON. xcx1');
                                                    console.log('===================================================================================');
                                                    console.log('');



                                                    template = template.replace(/\n/g, ''); // '<br />'); // I don't think we need these so just getting rid of them.

                                                    template = template.replace(/</g, '&lt;'); // Replace greater and lesser than characters.
                                                    template = template.replace(/>/g, '&gt;'); // Replace greater and lesser than characters.

                                                    //emailTemplate = emailTemplate.replace(/\\/g, '&bsol;'); // Backslash : \  : &#92; : &bsol;

                                                    json.Steps.Step[i]["@EmailTemplateForSubject"] = template; //'REPLACED REPLACED';
                                                }
                                            }












                                            $('#txtDisplayJsonDialogJSON').append(JSON.stringify(json, null, 2));
                                        }

                                    } catch (e) {
                                        console.log('Exception in displayEditWorkflowJsonDialog().done: ' + e.message + ', ' + e.stack);
                                        displayAlertDialog('Exception in displayEditWorkflowJsonDialog().done: ' + e.message + ', ' + e.stack);
                                    }

                                },
                                error: function (data) {
                                    //lpSpinner.Hide();
                                    console.log(' : ' + JSON.stringify(data));
                                    var msg;
                                    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                                        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                                    } else {
                                        msg = JSON.stringify(data);
                                    }
                                    displayAlertDialog('Error in bwWorkflowEditor.js.displayEditWorkflowJsonDialog().xx.Get: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                                    console.log('Error in bwWorkflowEditor.js.displayEditWorkflowJsonDialog().xx.Get: ' + JSON.stringify(data));
                                    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                                    //var error = JSON.parse(data.responseText)["odata.error"];
                                    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                                }
                            });
                            //}).fail(function (data, errorCode) {

                            //    //lpSpinner.Hide();
                            //    console.log(' : ' + JSON.stringify(data));
                            //    var msg;
                            //    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                            //        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                            //    } else {
                            //        msg = JSON.stringify(data);
                            //    }
                            //    displayAlertDialog('Error in bwWorkflowEditor.js.displayEditWorkflowJsonDialog().xx.Get: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                            //    console.log('Error in bwWorkflowEditor.js.displayEditWorkflowJsonDialog().xx.Get: ' + JSON.stringify(data));
                            //    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                            //    //var error = JSON.parse(data.responseText)["odata.error"];
                            //    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                            //});
                        } catch (e) {
                            console.log('Exception in displayEditWorkflowJsonDialog():2: ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in displayEditWorkflowJsonDialog():2: ' + e.message + ', ' + e.stack);
                        }
                    },
                    close: function () {
                        $('#divDisplayJsonDialog').dialog('destroy');
                    }
                });
                //$('#divConfigureJsonAndUploadDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
            }
        } catch (e) {
            console.log('Exception in displayEditWorkflowJsonDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in displayEditWorkflowJsonDialog(): ' + e.message + ', ' + e.stack);
        }
    },

    displayEditWorkflowJsonDialog2: function () {
        try {
            console.log('In displayEditWorkflowJsonDialog2().');
            var thiz = this;

            var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            // 2-9-2022
            var bwRequestTypeId;
            $('#selectRequestTypeDropDown').find('option:selected').each(function (index, element) {
                bwRequestTypeId = element.value;
            });


            // Find the bwWorkflowId.
            if (thiz.options.CurrentWorkflow && thiz.options.CurrentWorkflow.bwRequestTypeId && (thiz.options.CurrentWorkflow.bwRequestTypeId == bwRequestTypeId)) { // If there is already a workflow assigned, lets just check that it is the same one that is in the drop down. If so, we will not reassign it here leave it alone.
                // Do nothing, we already have this workflow displayed and it is the same as the one selected in the drop down.
                debugger;
                var x = '';

            } else {
                debugger;
                var x = '';
                //for (var i = 0; i < thiz.options.Workflows.length; i++) {
                //    if ((thiz.options.Workflows[i].bwRequestTypeId == bwRequestTypeId) && thiz.options.Workflows[i].bwWorkflowActive == true) {
                //        //if ((thiz.options.Workflows[i].Workflow || thiz.options.Workflows[i].bwWorkflowJson)) {
                //        if (thiz.options.Workflows[i].bwWorkflowJson) {
                //            // 1-5-2022
                //            debugger;
                //            var bwWorkflowJson = thiz.options.Workflows[i].bwWorkflowJson;
                //            thiz.options.CurrentWorkflow = {
                //                bwRequestTypeId: bwRequestTypeId,
                //                Workflow: JSON.parse(bwWorkflowJson),
                //                DraftWorkflow: JSON.parse(bwWorkflowJson)
                //            }


                //            //thiz.options.CurrentWorkflow["Workflow"] = JSON.parse(thiz.options.Workflows[i].bwWorkflowJson);
                //            //thiz.options.CurrentWorkflow["DraftWorkflow"] = JSON.parse(thiz.options.Workflows[i].bwWorkflowJson); // Creating "DraftWorkflow" so we can tell if the workflow has been changed or not, and then inform the user that changes need to be published.

                //            //car = thiz.options.Workflows[i]; // 1-4-2022
                //            //alert('Set CurrentWorkflow xcx111774-8');
                //            console.log('Set CurrentWorkflow xcx111774-8');
                //            break;
                //        } else {
                //            console.log('');
                //            console.log('INVALID VALUE FOR thiz.options.Workflows[i].bwWorkflowJson: ' + thiz.options.Workflows[i].bwWorkflowJson);
                //            console.log('');
                //        }
                //    }
                //}
            }


            debugger;

            if (!bwRequestTypeId) {
                console.log('In displayEditWorkflowJsonDialog2(). Invalid value for bwRequestTypeId: ' + bwRequestTypeId);
                displayAlertDialog('In displayEditWorkflowJsonDialog2(). Invalid value for bwRequestTypeId: ' + bwRequestTypeId);
            } else {

                $("#divDisplayJsonDialog").dialog({
                    modal: true,
                    resizable: false,
                    closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                    width: '900',
                    dialogClass: 'no-close', // No close button in the upper right corner.
                    hide: false, // This means when hiding just disappear with no effects.
                    open: function () {
                        try {
                            debugger; // 1-4-2022

                            $('.ui-widget-overlay').bind('click', function () {
                                $('#divDisplayJsonDialog').dialog('close');
                            });

                            $(this).find('#spanDisplayJsonDialogTitle').html('Edit Workflow JSON'); //document.getElementById('spanDisplayJsonDialogTitle').innerHTML = 'Edit Workflow JSON';

                            var html = '';
                            debugger;
                            html += 'Workflow Id: ' + 'xcx34235'; //thiz.options.CurrentWorkflow.bwWorkflowId;
                            //html += '<br />';
                            //html += 'DEV NOTE: The JSON does not completely render in the box below. Use this button to copy the JSON: <input type="button" value="Copy2" onclick="alert(\'This functionality is incomplete. Coming soon!\');" />';
                            //html += '<br />';
                            $(this).find('#spanDisplayJsonDialogContent').html(html);

                            $(this).find('#btnRunDiagnostics').html('<span style="font-size:30pt;">⚠ Save/Update Workflow JSON</span>'); // document.getElementById('btnRunDiagnostics').innerHTML = '<span style="font-size:30pt;">⚠ Save/Update Workflow JSON</span>'; // btnRunDiagnostics

                            $(this).find('#btnRunDiagnostics').off('click').click(function () {
                                try {
                                    debugger; // 1-4-2022
                                    // This is where we validate the JSON and save it back to the database, activating the new workflow JSON/Definition.
                                    var bwWorkflowJson = $('#divDisplayJsonDialog').find('#txtDisplayJsonDialogJSON').val(); // document.getElementById('txtDisplayJsonDialogJSON').value;
                                    var validJson = true;
                                    try {
                                        var json2 = JSON.parse(bwWorkflowJson);
                                    } catch (e) {
                                        validJson = false;
                                    }
                                    if (validJson != true) {
                                        console.log('Error in displayEditWorkflowJsonDialog2(). INVALID JSON. Cannot proceed.');
                                        displayAlertDialog('Error in displayEditWorkflowJsonDialog2(). INVALID JSON. Cannot proceed.');

                                    } else {
                                        //alert('VALID JSON');

                                        //var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
                                        //var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                                        //var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                                        //var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
                                        //var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

                                        if (confirm("This is valid JSON. Are you certain you wish to activate this workflow? THIS ACTION CANNOT BE UNDONE.")) {
                                            // Send JSON to the database for this workflow. // json
                                            //debugger;
                                            var json = {
                                                bwTenantId: tenantId,
                                                bwWorkflowAppId: workflowAppId,
                                                bwRequestTypeId: bwRequestTypeId,
                                                ModifiedByFriendlyName: participantFriendlyName,
                                                ModifiedById: participantId,
                                                ModifiedByEmail: participantEmail,
                                                Description: '',
                                                bwWorkflowJson: bwWorkflowJson
                                            };
                                            $.ajax({
                                                url: thiz.options.operationUriPrefix + "odata/publishworkflow2",
                                                type: "Post",
                                                data: json,
                                                headers: {
                                                    "Accept": "application/json; odata=verbose"
                                                }
                                            }).success(function (result) {
                                                try {
                                                    debugger; // 1-4-2022
                                                    if (result == 'SUCCESS') {
                                                        console.log('In bwWorkflowEditor.js.displayEditWorkflowJsonDialog2().post: Successfully updated DB. result: ' + JSON.stringify(result)); // using (' + JSON.stringify(json) + ').');
                                                        alert('In bwWorkflowEditor.js.displayEditWorkflowJsonDialog2().post: Successfully updated DB.');
                                                    } else {
                                                        thiz.displayAlertDialog('Error in displayEditWorkflowJsonDialog2(): ' + result);
                                                    }
                                                    // Display a dialog with an "Undo" button!!!!
                                                    //$("#divUndoWorkflowActivationDialog").dialog({
                                                    //    modal: true,
                                                    //    resizable: false,
                                                    //    closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                                                    //    width: '800',
                                                    //    dialogClass: 'no-close', // No close button in the upper right corner.
                                                    //    hide: false, // This means when hiding just disappear with no effects.
                                                    //    open: function () {
                                                    //        $('.ui-widget-overlay').bind('click', function () {
                                                    //            $('#divUndoWorkflowActivationDialog').dialog('close');
                                                    //        });
                                                    //    },
                                                    //    close: function () {
                                                    //        var promise = thiz.loadWorkflowsAndCurrentWorkflow(selectedRequestType);
                                                    //        promise.then(function (result) {
                                                    //            try {
                                                    //                $('#divUndoWorkflowActivationDialog').dialog("destroy");
                                                    //                $('#divActivateSelectedWorkflowDialog').dialog('close');
                                                    //                $('#divWorkflowsConfigurationDialog').dialog('close');
                                                    //                thiz.renderWorkflowEditor2();
                                                    //                thiz.checkIfWeHaveToDisplayThePublishChangesButton();
                                                    //            } catch (e) {
                                                    //                console.log('Exception in bwWorkflowEditor._create().loadWorkflowsAndCurrentWorkflow(): ' + e.message + ', ' + e.stack);
                                                    //            }
                                                    //        });
                                                    //    }
                                                    //});
                                                    //$('#divUndoWorkflowActivationDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();

                                                    //thiz.options.CurrentWorkflow.DraftWorkflow = JSON.parse(JSON.stringify(thiz.options.CurrentWorkflow.Workflow)); 
                                                    //thiz.checkIfWeHaveToDisplayThePublishChangesButton();

                                                } catch (e) {
                                                    console.log('Exception in bwWorkflowEditor.js.displayEditWorkflowJsonDialog2().xx.update: ' + e.message + ', ' + e.stack);
                                                    displayAlertDialog('Exception in bwWorkflowEditor.js.displayEditWorkflowJsonDialog2().xx.update: ' + e.message + ', ' + e.stack);
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
                                                console.log('Fail in bwWorkflowEditor.js.displayEditWorkflowJsonDialog2().xx.update: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
                                                displayAlertDialog('Fail in bwWorkflowEditor.js.displayEditWorkflowJsonDialog2().xx.update: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                                                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                                                //var error = JSON.parse(data.responseText)["odata.error"];
                                                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                                            });

                                        }
                                    }
                                } catch (e) {
                                    console.log('Exception in displayEditWorkflowJsonDialog2.click(): ' + e.message + ', ' + e.stack);
                                    displayAlertDialog('Exception in displayEditWorkflowJsonDialog2.click(): ' + e.message + ', ' + e.stack);
                                }
                            });

                            debugger; // 2-9-2022
                            //$.ajax({
                            //    //url: thiz.options.operationUriPrefix + "odata/WorkflowConfiguration4/" + tenantId + '/' + workflowAppId + '/' + thiz.options.CurrentWorkflow.bwWorkflowId,
                            //    url: thiz.options.operationUriPrefix + "_bw/ActiveWorkflowForOrganizationRequestType/" + workflowAppId + '/' + bwRequestTypeId,
                            //    dataType: "json",
                            //    contentType: "application/json",
                            //    type: "Get"
                            //}).done(function (result) {
                            //try {

                            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                            var data = {
                                bwParticipantId_LoggedIn: participantId,
                                bwActiveStateIdentifier: activeStateIdentifier,
                                bwWorkflowAppId_LoggedIn: workflowAppId,

                                bwWorkflowAppId: workflowAppId,
                                bwRequestTypeId: bwRequestTypeId,
                                isActive: true
                            };
                            $.ajax({
                                url: thiz.options.operationUriPrefix + "_bw/workflowconfiguration",
                                type: "POST",
                                data: data,
                                headers: {
                                    "Accept": "application/json; odata=verbose"
                                },
                                success: function (result) {
                                    try {
                                        debugger; // 1-4-2022

                                        if (!(result.value && result.value[0] && result.value[0].bwWorkflowJson)) {
                                            $('#txtDisplayJsonDialogJSON').empty();
                                            $('#txtDisplayJsonDialogJSON').append('THERE IS NO bwWorkflowJson for bwWorkflowAppId xcx93465: ' + workflowAppId + ', thiz.options.CurrentWorkflow.bwWorkflowId: ' + thiz.options.CurrentWorkflow.bwWorkflowId);
                                        } else {
                                            var json = JSON.parse(result.value[0].bwWorkflowJson);

                                            $('#txtDisplayJsonDialogJSON').empty();






                                            //var string = JSON.stringify(json, null, 2);
                                            //
                                            // Since the @EmailTemplate attribute doesn't work 100% correctly, probably due to the html elements in it, or perhaps quotes... we will go through and fix them up so that the text can be copied successfully.
                                            // THE WHOLE GOAL OF THIS EFFORT is to make it so that a workflow can be copied an dpasted in the browser from one place to another, preserving the email templates contained therein.
                                            //
                                            //var json = JSON.parse(thiz.options.Workflows[i].bwWorkflowJson);
                                            for (var i = 0; i < json.Steps.Step.length; i++) {
                                                if (json.Steps.Step[i]["@EmailTemplate"]) {
                                                    // IF WE GET HERE there is an email template.
                                                    var template = json.Steps.Step[i]["@EmailTemplate"];
                                                    debugger;

                                                    //template = template.replace(/["]/g, '&quot;'); // Replace double-quote with &quot;


                                                    console.log('');
                                                    console.log('===================================================================================');
                                                    console.log('This is where we make sure the email templates JSON works OK in the workflow JSON. xcx1');
                                                    console.log('===================================================================================');
                                                    console.log('');



                                                    template = template.replace(/\n/g, ''); // '<br />'); // I don't think we need these so just getting rid of them.

                                                    template = template.replace(/</g, '&lt;'); // Replace greater and lesser than characters.
                                                    template = template.replace(/>/g, '&gt;'); // Replace greater and lesser than characters.

                                                    //emailTemplate = emailTemplate.replace(/\\/g, '&bsol;'); // Backslash : \  : &#92; : &bsol;

                                                    json.Steps.Step[i]["@EmailTemplate"] = template; //'REPLACED REPLACED';
                                                }
                                                // EmailTemplateForSubject
                                                if (json.Steps.Step[i]["@EmailTemplateForSubject"]) {
                                                    // IF WE GET HERE there is an email template.
                                                    var template = json.Steps.Step[i]["@EmailTemplateForSubject"];
                                                    debugger;

                                                    //template = template.replace(/["]/g, '&quot;'); // Replace double-quote with &quot;


                                                    console.log('');
                                                    console.log('===================================================================================');
                                                    console.log('This is where we make sure the email templates JSON works OK in the workflow JSON. xcx1');
                                                    console.log('===================================================================================');
                                                    console.log('');



                                                    template = template.replace(/\n/g, ''); // '<br />'); // I don't think we need these so just getting rid of them.

                                                    template = template.replace(/</g, '&lt;'); // Replace greater and lesser than characters.
                                                    template = template.replace(/>/g, '&gt;'); // Replace greater and lesser than characters.

                                                    //emailTemplate = emailTemplate.replace(/\\/g, '&bsol;'); // Backslash : \  : &#92; : &bsol;

                                                    json.Steps.Step[i]["@EmailTemplateForSubject"] = template; //'REPLACED REPLACED';
                                                }
                                            }












                                            $('#txtDisplayJsonDialogJSON').append(JSON.stringify(json, null, 2));
                                        }

                                    } catch (e) {
                                        console.log('Exception in displayEditWorkflowJsonDialog2().done: ' + e.message + ', ' + e.stack);
                                        displayAlertDialog('Exception in displayEditWorkflowJsonDialog2().done: ' + e.message + ', ' + e.stack);
                                    }

                                },
                                error: function (data) {
                                    //lpSpinner.Hide();
                                    console.log(' : ' + JSON.stringify(data));
                                    var msg;
                                    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                                        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                                    } else {
                                        msg = JSON.stringify(data);
                                    }
                                    displayAlertDialog('Error in bwWorkflowEditor.js.displayEditWorkflowJsonDialog2().xx.Get: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                                    console.log('Error in bwWorkflowEditor.js.displayEditWorkflowJsonDialog2().xx.Get: ' + JSON.stringify(data));
                                    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                                    //var error = JSON.parse(data.responseText)["odata.error"];
                                    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                                }
                            });
                            //}).fail(function (data, errorCode) {

                            //    //lpSpinner.Hide();
                            //    console.log(' : ' + JSON.stringify(data));
                            //    var msg;
                            //    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                            //        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                            //    } else {
                            //        msg = JSON.stringify(data);
                            //    }
                            //    displayAlertDialog('Error in bwWorkflowEditor.js.displayEditWorkflowJsonDialog2().xx.Get: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                            //    console.log('Error in bwWorkflowEditor.js.displayEditWorkflowJsonDialog2().xx.Get: ' + JSON.stringify(data));
                            //    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                            //    //var error = JSON.parse(data.responseText)["odata.error"];
                            //    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                            //});
                        } catch (e) {
                            console.log('Exception in displayEditWorkflowJsonDialog2():2: ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in displayEditWorkflowJsonDialog2():2: ' + e.message + ', ' + e.stack);
                        }
                    },
                    close: function () {
                        $('#divDisplayJsonDialog').dialog('destroy');
                    }
                });
                //$('#divConfigureJsonAndUploadDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
            }
        } catch (e) {
            console.log('Exception in displayEditWorkflowJsonDialog2(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in displayEditWorkflowJsonDialog2(): ' + e.message + ', ' + e.stack);
        }
    },

    loadWorkflowsAndCurrentWorkflow: function (bwRequestTypeId) { //selectedRequestType) { // This should be renamed to "loadAllWorkflowsForOrganization"
        try {
            console.log('In loadWorkflowsAndCurrentWorkflow().');
            var thiz = this;
            return new Promise(function (resolve, reject) {
                try {
                    console.log('In loadWorkflowsAndCurrentWorkflow().2.');
                    var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                    var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

                    var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                    var data;
                    if (!bwRequestTypeId) {
                        data = {
                            bwParticipantId_LoggedIn: participantId,
                            bwActiveStateIdentifier: activeStateIdentifier,
                            bwWorkflowAppId_LoggedIn: workflowAppId,

                            bwWorkflowAppId: workflowAppId,
                            bwRequestTypeId: 'ALL',
                            // bwRequestType: 'ALL'
                            //isActive: true

                        };
                    } else {
                        data = {
                            bwParticipantId_LoggedIn: participantId,
                            bwActiveStateIdentifier: activeStateIdentifier,
                            bwWorkflowAppId_LoggedIn: workflowAppId,

                            bwWorkflowAppId: workflowAppId,
                            bwRequestTypeId: bwRequestTypeId, //'ALL',
                            bwRequestType: 'ALL', // Is this used by "_bw/orgrolesconfiguration"?
                            //isActive: true

                        };
                    }

                    $.ajax({
                        url: thiz.options.operationUriPrefix + "_bw/orgrolesconfiguration",
                        type: "POST",
                        data: data,
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        },
                        success: function (orcResult) {
                            try {

                                $.ajax({
                                    url: thiz.options.operationUriPrefix + "_bw/workflowconfiguration", // "odata/WorkflowConfiguration2/" + tenantId + '/' + workflowAppId + '/' + 'all',
                                    type: "POST",
                                    data: data,
                                    headers: {
                                        "Accept": "application/json; odata=verbose"
                                    },
                                    success: function (wc2Result) {


                                        //alert('xcx213124124 wc2Result: ' + JSON.stringify(wc2Result));

                                        //    dataType: "json",
                                        //    contentType: "application/json",
                                        //    type: "Get",
                                        //    timeout: thiz.options.ajaxTimeout
                                        //}).done(function (result) {
                                        try {
                                            //alert('xcx21312454 checklists loaded!! orcResult.Checklists: ' + JSON.stringify(wc2Result.Checklists));
                                            thiz.options.Checklists = wc2Result.Checklists; // This web service call returns extra stuff. Optimize this int he future.
                                            //var selectedRequestType = 'budgetrequest'; // The default.
                                            thiz.options.Workflows = wc2Result.value; // Loads this so all workflows are available at any time without going back to the server.





                                            if (bwRequestTypeId) {
                                                // This means a request type has been specified. Therefore lets reload accordingly.

                                                for (var i = 0; i < thiz.options.Workflows.length; i++) {
                                                    if ((thiz.options.Workflows[i].bwRequestTypeId == bwRequestTypeId) && (thiz.options.Workflows[i].isActive == true)) {
                                                        //if ((thiz.options.Workflows[i].Workflow || thiz.options.Workflows[i].bwWorkflowJson)) {
                                                        if (thiz.options.Workflows[i].bwWorkflowJson) {
                                                            // 1-5-2022
                                                            debugger;
                                                            var bwWorkflowJson = thiz.options.Workflows[i].bwWorkflowJson;
                                                            thiz.options.CurrentWorkflow = {
                                                                bwRequestTypeId: bwRequestTypeId,
                                                                Workflow: JSON.parse(bwWorkflowJson),
                                                                DraftWorkflow: JSON.parse(bwWorkflowJson)
                                                            }


                                                            //thiz.options.CurrentWorkflow["Workflow"] = JSON.parse(thiz.options.Workflows[i].bwWorkflowJson);
                                                            //thiz.options.CurrentWorkflow["DraftWorkflow"] = JSON.parse(thiz.options.Workflows[i].bwWorkflowJson); // Creating "DraftWorkflow" so we can tell if the workflow has been changed or not, and then inform the user that changes need to be published.

                                                            //car = thiz.options.Workflows[i]; // 1-4-2022
                                                            //alert('Set CurrentWorkflow xcx111774-8');
                                                            console.log('Set CurrentWorkflow xcx111774-8-2');
                                                            break;
                                                        } else {
                                                            console.log('');
                                                            console.log('INVALID VALUE FOR thiz.options.Workflows[i].bwWorkflowJson:xcx2: ' + thiz.options.Workflows[i].bwWorkflowJson);
                                                            console.log('');

                                                            alert('xcx1231233. INVALID VALUE FOR thiz.options.Workflows[i].bwWorkflowJson:xcx2: ' + thiz.options.Workflows[i].bwWorkflowJson);

                                                        }
                                                    }
                                                }




                                            }




                                            //var bwEnabledRequestTypes = $('.bwAuthentication').bwAuthentication('option', 'bwEnabledRequestTypes');
                                            //var selectedRequestType = bwEnabledRequestTypes.EnabledItems[0]; //.Abbreviation; // .options.bwEnabledRequestTypes.EnabledItems[0][0];
                                            ////var selectedRequestType_text = bwEnabledRequestTypes.EnabledItems[0].RequestType; // thiz.options.bwEnabledRequestTypes.EnabledItems[0][1]; // to start with select the first one. This makes sure it will coordinate with the drop down selector. Also this json element needs to have properties and not just indexes.

                                            //debugger; // 1-5-2022
                                            //for (var i = 0; i < thiz.options.Workflows.length; i++) {
                                            //    //if ((thiz.options.Workflows[i].bwRequestType == selectedRequestType.Abbreviation || thiz.options.Workflows[i].bwRequestType == selectedRequestType.RequestType || thiz.options.Workflows[i].bwRequestType == selectedRequestType.bwRequestTypeId) && thiz.options.Workflows[i].bwWorkflowActive == true) {
                                            //    if ((thiz.options.Workflows[i].bwRequestTypeId == selectedRequestType.bwRequestTypeId) && thiz.options.Workflows[i].bwWorkflowActive == true) {

                                            //        // 1-5-2022
                                            //        thiz.options.CurrentWorkflow["Workflow"] = JSON.parse(thiz.options.Workflows[i].bwWorkflowJson);
                                            //        thiz.options.CurrentWorkflow["DraftWorkflow"] = JSON.parse(thiz.options.Workflows[i].bwWorkflowJson); // Creating "DraftWorkflow" so we can tell if the workflow has been changed or not, and then inform the user that changes need to be published.

                                            //        //thiz.options.CurrentWorkflow = thiz.options.Workflows[i];
                                            //        alert('Set CurrentWorkflow xcx111774-7');
                                            //        break;
                                            //    }
                                            //}
                                            //// IF WE cant find it using the .value of the drop down, then try using the .text. A fudge, we need to decide throughout ho to do this but not right now 11-24-2021
                                            ////if (!thiz.options.CurrentWorkflow) {
                                            ////    alert('Error: No workflow exists for this Request Type. Create one by customizing this default workflow, and clicking the Publish button.');
                                            ////}






                                            //}
                                            //thiz.options.LastSelectedRequestType = selectedRequestType_text;

                                            //for (var i = 0; i < thiz.options.Workflows.length; i++) {
                                            //    if (thiz.options.Workflows[i].bwRequestType == selectedRequestType && thiz.options.Workflows[i].bwWorkflowActive == true) {
                                            //        thiz.options.CurrentWorkflow = thiz.options.Workflows[i];
                                            //        break;
                                            //    }
                                            //}

                                            //if (thiz.options.CurrentWorkflow == null) {
                                            //    thiz.renderWorkflowEditor1();
                                            //} else {
                                            //try {
                                            //    thiz.options.CurrentWorkflow.Workflow = JSON.parse(thiz.options.CurrentWorkflow.bwWorkflowJson);
                                            //    thiz.options.CurrentWorkflow.DraftWorkflow = JSON.parse(thiz.options.CurrentWorkflow.bwWorkflowJson); // Creating "DraftWorkflow" so we can tell if the workflow has been changed or not, and then inform the user that changes need to be published.
                                            //} catch (e) { }
                                            if (wc2Result.value.length > 1) {
                                                thiz.options.MultipleWorkflowsEnabled = true; // The user has at some point decided to have a workflow for each request type.
                                            } else {
                                                thiz.options.MultipleWorkflowsEnabled = false;
                                            }
                                            //thiz.renderWorkflowEditor1(assignmentRowChanged_ElementId); // Render the Workflow Editor. 
                                            //}

                                            resolve();

                                        } catch (e) {
                                            console.log('Exception in bwWorkflowEditor._create().xx.Get:1: ' + e.message + ', ' + e.stack);
                                            displayAlertDialog('Exception in bwWorkflowEditor._create().xx.Get:1: ' + e.message + ', ' + e.stack);
                                            resolve();
                                        }
                                    },
                                    error: function (data) {
                                        console.log('In xx1.fail(): ' + JSON.stringify(data));
                                        var msg;
                                        if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                                            msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                                        } else {
                                            msg = JSON.stringify(data);
                                        }
                                        alert('Exception in bwWorkflowEditor._create().xx.Get:2-1: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                                        console.log('Exception in bwWorkflowEditor._create().xx.Get:2-1: ' + JSON.stringify(data));
                                        //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                                        //var error = JSON.parse(data.responseText)["odata.error"];
                                        //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                                        resolve();
                                    }
                                });
                            } catch (e) {
                                console.log('Exception in loadWorkflowsAndCurrentWorkflow():2: ' + e.message + ', ' + e.stack);
                                displayAlertDialog('Exception in loadWorkflowsAndCurrentWorkflow():2: ' + e.message + ', ' + e.stack);
                            }
                        },
                        error: function (data) {
                            //lpSpinner.Hide();
                            debugger;
                            console.log('In xx.fail(): ' + JSON.stringify(data));
                            var msg;
                            if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                                msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                            } else {
                                msg = JSON.stringify(data);
                            }
                            alert('Exception in bwWorkflowEditor._create().xx.Get:2-2: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                            console.log('Exception in bwWorkflowEditor._create().xx.Get:2-2: ' + JSON.stringify(data));
                            //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                            //var error = JSON.parse(data.responseText)["odata.error"];
                            //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                        }
                    });
                } catch (e) {
                    console.log('Exception in loadWorkflowsAndCurrentWorkflow():2: ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in loadWorkflowsAndCurrentWorkflow():2: ' + e.message + ', ' + e.stack);
                }
            });

        } catch (e) {
            console.log('Exception in loadWorkflowsAndCurrentWorkflow(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in loadWorkflowsAndCurrentWorkflow(): ' + e.message + ', ' + e.stack);
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

    getCurrentWorkflowJson: function () {
        try {
            console.log('In getCurrentWorkflowJson().');

            return this.options.CurrentWorkflow.DraftWorkflow;

        } catch (e) {
            console.log('Exception in getCurrentWorkflowJson(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in getCurrentWorkflowJson(): ' + e.message + ', ' + e.stack);
        }
    },

    renderWorkflowEditor1: function (assignmentRowChanged_ElementId, selectedRequestTypeId, expandedStepIndex) {
        try {
            console.log('In renderWorkflowEditor1().');
            var thiz = this;

            var bwEnabledRequestTypes = $('.bwAuthentication').bwAuthentication('option', 'bwEnabledRequestTypes');

            var html = '';

            if (!(bwEnabledRequestTypes && bwEnabledRequestTypes.EnabledItems)) {

                // The user is not logged in.
                html += '<span style="font-size:30pt;">The demo for the Workflow Editor is coming soon.</span>';
                $('#divPageContent3').html(html);

                this.element.html(html);





            } else {

                // Include jquery-ui stylesheet.
                //html += '<link rel="stylesheet" href="css/jquery/1.11.1/themes/smoothness/jquery-ui.css">'; // removed 8-18-2022
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
                html += '    font-size:11pt;';
                html += '}';
                html += '.steprow-hidden {';
                html += '    visibility: collapse;';
                html += '}';

                html += '.steprow:hover {';
                //html += '    background-color: lightblue;';
                html += '    background-color: lightgoldenrodyellow;';
                html += '}';

                html += '.stepheadercell:hover {';
                html += '    background-color: gainsboro !important;'; // This is the step header row which expans and collapses. 
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
                //html += '.ui-dialog-title {';
                //html += '    background-color: lightgoldenrodyellow;';
                //html += '    border-color: orange;';
                //html += '}';
                //html += '.ui-draggable-handle {';
                //html += '    background-color: lightgoldenrodyellow !important;';
                //html += '    border-color: red !important;';
                //html += '}';
                html += '.ui-corner-all {';
                html += '    border-color: #FFE1AC !important;'; // Navajo White outlining the dialog boxes! Yeah!!! :)
                html += '}';

                html += '</style>';




                html += '<div style="display:none;border-radius:30px 30px 30px 30px;border: 10px solid wheat;" id="divDataItemHoverDialog" >'; // onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'50963ec1-dac6-423c-a0e9-29715286ab65\', \'BR-180001\', \'Test 1\', \'BR-180001\');" >';
                html += '   <table id="tableDataItemHoverDetails" style="width:100%;">';
                html += '       <tr>';
                html += '           <td style="width:90%;text-align:top;">';
                html += '               <span id="spanDataItemHoverDetailsDialogTitleAndCurrentRACIStatus" style="color: #3f3f3f;"></span>';
                html += '           </td>';
                html += '           <td style="width:9%;"></td>';
                html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
                //html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 120pt;font-weight:bold;" onclick="$(\'#divRowHoverDetails\').dialog(\'close\');">X</span>';
                html += '           </td>';
                html += '       </tr>';
                html += '   </table>';
                html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                html += '   <div id="spanDataItemHoverDialog_Contents" style="font-size:12pt;float:center;height:200px;overflow:hidden;">[spanDataItemHoverDialog_Contents]</div>';
                html += '   <br /><br />';
                //html += '   <span id="spanImageXXx" style=""></span><br /><br />';
                html += '</div>';






                html += '<div style="display:none;" id="divWorkflowsConfigurationDialog" class="context-menu-workflowsconfiguration">';
                html += '  <table style="width:100%;">';
                html += '    <tr>';
                html += '      <td style="width:90%;">';
                html += '        <span id="spanWorkflowsMaintenanceDialogTitle" style="color:#3f3f3f;font-size:30pt;font-weight:bold;">Workflows Configuration</span>';
                html += '      </td>';
                html += '      <td style="width:9%;"></td>';
                html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
                html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divWorkflowsConfigurationDialog\').dialog(\'close\');">X</span>';
                html += '      </td>';
                html += '    </tr>';
                html += '  </table>';
                html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                //html += '  <span id="spaWorkflowsMaintenanceDialogDescriptionText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;">';
                //html += 'Configure active workflows for: ';
                //html += '  </span>';
                //html += '<select id="selectWorkflowRequestTypeDropDownInDialog2" style=\'border-color: whitesmoke; color: grey; font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 14pt; font-weight: bold; cursor: pointer;\' onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'WorkflowRequestTypeDropDownInDialog_Onchange\', \'selectWorkflowRequestTypeDropDownInDialog2\');" "=""><option value="all" selected="">All request types</option><option value="budgetrequest">Budget Requests</option><option value="capitalplanproject">Capital Plan Projects</option><option value="quoterequest">Quote Requests</option><option value="expenserequest">Reimbursement Requests</option><option value="recurringexpense">Recurring Expenses</option><option value="workorder">Work Orders</option>   </select>';
                html += '  <br />';
                html += '  <span id="spanWorkflowsMaintenanceDialogWorkflowActivationSection" style="white-space:nowrap;"></span>';
                html += '  <span id="spanWorkflowsMaintenanceDialogContent"></span>';
                html += '</div>';

                html += '<div style="display:none;" id="divActivateSelectedWorkflowDialog">';
                html += '        <!--DEV: The replace function is not doing the Manager for a Budget Request yet!!!-->';
                html += '        <table style="width:100%;">';
                html += '            <tr>';
                html += '                <td style="width:90%;">';
                html += '                    <span id="spanActivateSelectedWorkflowDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">Activate this workflow.</span>';
                html += '                </td>';
                html += '                <td style="width:9%;"></td>';
                html += '                <td style="width:1%;cursor:pointer;vertical-align:top;">';
                html += '                    <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divActivateSelectedWorkflowDialog\').dialog(\'close\');">X</span>';
                html += '                </td>';
                html += '            </tr>';
                html += '        </table>';
                html += '        <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                html += '        <br />';
                html += '        <span id="spanDeleteAWorkflowDialogContentSection">';
                html += 'Activate as this request type:';
                html += '        </span>';
                html += '<select id="selectWorkflowRequestTypeDropDownInActivateSelectedWorkflowDialog" style=\'border-color: whitesmoke; color: grey; font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 14pt; font-weight: bold; cursor: pointer;\'><option value="all" selected="">All request types</option><option value="budgetrequest" selected="">Budget Requests</option><option value="capitalplanproject">Capital Plan Projects</option><option value="quoterequest">Quote Requests</option><option value="expenserequest">Reimbursement Requests</option><option value="recurringexpense">Recurring Expenses</option><option value="workorder">Work Orders</option>   </select>';
                html += '        <br /><br />';
                html += '            <span id="spanActivateSelectedWorkflowButton">[spanActivateSelectedWorkflowButton]</span>';
                html += '        <br /><br />';
                html += '        <div class="divSignInButton" style="width:90%;text-align:center;line-height:0.8em;font-weight:bold;" onclick="$(\'#divActivateSelectedWorkflowDialog\').dialog(\'close\');">';
                html += '            Close';
                html += '        </div>';
                html += '        <br /><br />';
                html += '    </div>';











                html += '<div style="display:none;" id="divDeactivateSelectedWorkflowDialog">';
                html += '        <!--DEV: The replace function is not doing the Manager for a Budget Request yet!!!-->';
                html += '        <table style="width:100%;">';
                html += '            <tr>';
                html += '                <td style="width:90%;">';
                html += '                    <span id="spanDeactivateSelectedWorkflowDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">De-activate this workflow.</span>';
                html += '                </td>';
                html += '                <td style="width:9%;"></td>';
                html += '                <td style="width:1%;cursor:pointer;vertical-align:top;">';
                html += '                    <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divDeactivateSelectedWorkflowDialog\').dialog(\'close\');">X</span>';
                html += '                </td>';
                html += '            </tr>';
                html += '        </table>';
                html += '        <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                html += '        <br />';
                //html += '        <span id="spanDeleteAWorkflowDialogContentSection">';
                //html += 'Activate as this request type:';
                //html += '        </span>';
                //html += '<select id="selectWorkflowRequestTypeDropDownInDeactivateSelectedWorkflowDialog" style=\'border-color: whitesmoke; color: grey; font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 14pt; font-weight: bold; cursor: pointer;\'><option value="all" selected="">All request types</option><option value="budgetrequest" selected="">Budget Requests</option><option value="capitalplanproject">Capital Plan Projects</option><option value="quoterequest">Quote Requests</option><option value="expenserequest">Reimbursement Requests</option><option value="recurringexpense">Recurring Expenses</option><option value="workorder">Work Orders</option>   </select>';
                //html += '        <br /><br />';
                html += '            <span id="spanDeactivateSelectedWorkflowButton">[spanDeactivateSelectedWorkflowButton]</span>';
                html += '        <br /><br />';
                html += '        <div class="divSignInButton" style="width:90%;text-align:center;line-height:0.8em;font-weight:bold;" onclick="$(\'#divDeactivateSelectedWorkflowDialog\').dialog(\'close\');">';
                html += '            Close';
                html += '        </div>';
                html += '        <br /><br />';
                html += '    </div>';






















                html += '<div style="display:none;" id="divCreateANewRoleDialog">';
                html += '  <table style="width:100%;">';
                html += '    <tr>';
                html += '      <td style="width:90%;">';
                html += '        <span id="spanCustomSignUpDialogTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Create a new Role</span>';
                html += '      </td>';
                html += '      <td style="width:9%;"></td>';
                html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
                html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divCreateANewRoleDialog\').dialog(\'close\');">X</span>';
                html += '      </td>';
                html += '    </tr>';
                html += '  </table>';
                html += '  <br /><br />';
                html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                html += '  <span id="spanCustomSignUpDialogInvitationDescriptionText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;"></span><br />';
                html += '  <span style="font-family: calibri;">Role Abbreviation</span><br />';
                html += '  <input type="text" id="txtCreateANewRoleDialog_RoleId" style="WIDTH: 93%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 40pt;" /><br /><br />';
                html += '  <span style="font-family: calibri;">Role Name</span><br />';
                html += '  <input type="text" id="txtCreateANewRoleDialog_RoleName" style="WIDTH: 93%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 40pt;" /><br /><br />';
                //html += '  <span style="font-family: calibri;">RoleBits</span><br />';
                //html += '  <input type="password" id="txtCreateANewRoleDialog_RoleBits" style="WIDTH: 93%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 40pt;" /><br />';
                html += '  <br />';
                html += '  <table style="width:100%;">';
                html += '     <tr>';
                html += '       <td style="text-align:center;">';
                html += '  <input type="button" value="Create your new role now!" style="height:30pt;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'createANewRole\');" />';
                html += '       </td>';
                html += '     </tr>';
                //html += '     <tr><td>&nbsp;</td></tr>';
                //html += '     <tr>';
                //html += '       <td style="text-align:center;">';
                //html += '  <span style="font-family: calibri;font-style:italic;font-size:30pt;"> <a href="javascript:$(\'#divCreateANewRoleDialog\').dialog(\'close\');">Cancel</a></span>';
                //html += '       </td>';
                //html += '     </tr>';
                html += '  </table>';
                html += '  <br /><br />';
                html += '</div>';

                //html += '<div style="display:none;" id="divRoleMultiPickerDialog">';
                //html += '  <table style="width:100%;">';
                //html += '    <tr>';
                //html += '      <td style="width:90%;">';
                //html += '        <span id="spanRoleMultiPickerDialogTitle" style="color: #3f3f3f;font-size: 60pt;font-weight:bold;">Location(s)</span>';
                //html += '      </td>';
                //html += '      <td style="width:9%;"></td>';
                //html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
                //html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 120pt;font-weight:bold;" onclick="$(\'#divRoleMultiPickerDialog\').dialog(\'close\');">X</span>';
                //html += '      </td>';
                //html += '    </tr>';
                //html += '  </table>';
                //html += '  <br /><br />';
                //html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                //html += '  <span id="spanRoleMultiPickerDialogContent" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 15pt;"></span><br />';
                //html += '  <br /><br />';
                //html += '  <input type="button" value="SAVE" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'roleMultiPickerDialog_RenderResults\');" />';
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

                html += '<div style="display:none;" id="divProjectTypeMultiPickerDialog">';
                html += '  <table style="width:100%;">';
                html += '    <tr>';
                html += '      <td style="width:90%;">';
                html += '        <span id="spanProjectTypeMultiPickerDialogTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Functional area(s)</span>';
                html += '      </td>';
                html += '      <td style="width:9%;"></td>';
                html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
                html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divProjectTypeMultiPickerDialog\').dialog(\'close\');">X</span>';
                html += '      </td>';
                html += '    </tr>';
                html += '  </table>';
                html += '  <br /><br />';
                html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                html += '  <span id="spanProjectTypeMultiPickerDialogContent" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:20pt;"></span><br />';
                html += '  <br /><br />';
                html += '  <input type="button" value="SAVE" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'projectTypeMultiPickerDialog_RenderResults\');" />';
                html += '  <br /><br />';
                html += '</div>';

                html += '<div style="display:none;" id="divPillarMultiPickerDialog">';
                html += '  <table style="width:100%;">';
                html += '    <tr>';
                html += '      <td style="width:90%;">';
                html += '        <span id="spanPillarMultiPickerDialogTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Growth</span>';
                html += '      </td>';
                html += '      <td style="width:9%;"></td>';
                html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
                html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divPillarMultiPickerDialog\').dialog(\'close\');">X</span>';
                html += '      </td>';
                html += '    </tr>';
                html += '  </table>';
                html += '  <br /><br />';
                html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                html += '  <span id="spanPillarMultiPickerDialogContent" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:20pt;"></span><br />';
                html += '  <br /><br />';
                html += '  <input type="button" value="SAVE" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'pillarMultiPickerDialog_RenderResults\');" />';
                html += '  <br /><br />';
                html += '</div>';

                html += '<div style="display:none;" id="divUndoWorkflowActivationDialog">';
                html += '  <table style="width:100%;">';
                html += '    <tr>';
                html += '      <td style="width:90%;">';
                html += '        <span id="spanUndoWorkflowActivationTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Workflow ACTIVATED</span>';
                html += '      </td>';
                html += '      <td style="width:9%;"></td>';
                html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
                html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divUndoWorkflowActivationDialog\').dialog(\'close\');">X</span>';
                html += '      </td>';
                html += '    </tr>';
                html += '  </table>';
                html += '  <br /><br />';
                html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                html += '  <span id="spanUndoWorkflowActivationContent" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:20pt;">';
                html += '    This workflow has been activated and will immediately impact the future workflow processes. Please keep an eye on potential issues related to your change(s). ';
                html += '    <br />';
                html += '    <br />';
                html += '    <br />';
                //html += '    <span style="font-weight:bold;cursor:pointer;">';
                //html += '      You can change the "Active Workflow" using the drop-down at the top of this page any time';
                //html += '    </span>';
                html += '  </span>';
                //html += '  <br /><br />';
                html += '</div>';

                html += '<div style="display:none;" id="divUndoWorkflowDeletionDialog">';
                html += '  <table style="width:100%;">';
                html += '    <tr>';
                html += '      <td style="width:90%;">';
                html += '        <span id="spanUndoWorkflowDeletionTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Workflow DELETED</span>';
                html += '      </td>';
                html += '      <td style="width:9%;"></td>';
                html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
                html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divUndoWorkflowDeletionDialog\').dialog(\'close\');">X</span>';
                html += '      </td>';
                html += '    </tr>';
                html += '  </table>';
                html += '  <br /><br />';
                html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                html += '  <span id="spanUndoWorkflowDeletionContent" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:20pt;">';
                html += '    This workflow has been deleted and will immediately impact the future workflow processes. Please keep an eye on potential issues related to your change(s). ';
                html += '    <br />';
                html += '    <br />';
                html += '    <br />';
                //html += '    <span style="font-weight:bold;cursor:pointer;">';
                //html += '      You can change the "Active Workflow" using the drop-down at the top of this page any time';
                //html += '    </span>';
                html += '  </span>';
                //html += '  <br /><br />';
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

                html += '<div style="display:none;" id="divConfigureEmailNotificationsDialog">';
                html += '   <table style="width:100%;">';
                html += '       <tr>';
                html += '           <td style="width:90%;">';
                html += '               <span id="spanConfigureEmailNotificationsDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:30pt;font-weight:bold;">Configure email notifications</span>';
                html += '               <br />';
                html += '               <span id="spanConfigureEmailNotificationsDialogSubTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:15pt;font-weight:normal;">[spanConfigureEmailNotificationsDialogSubTitle]</span>';

                //html += '               <span id="spanConfigureEmailNotificationsDialogInstructionText_EditButton" title="Edit email instruction text..." style="width:200px;padding:5px 10px 5px 10px;margin:0 0 0 10px;white-space:nowrap;vertical-align:middle;border:1px solid lightblue;cursor:pointer;font-weight:normal;font-size:10pt;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayEditEmailInstructionTextDialog\');"><span style="display:inline-block;"> ⚙ </span></span>';
                html += '               <span id="spanConfigureEmailNotificationsDialogInstructionText_EditButton"></span>';

                html += '           </td>';
                html += '           <td style="width:9%;"></td>';
                html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
                html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divConfigureEmailNotificationsDialog\').dialog(\'close\');">X</span>';
                html += '           </td>';
                html += '       </tr>';
                html += '   </table>';
                html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                html += '   <br />';
                html += '   <span id="spanConfigureEmailNotificationsDialogSelectEditEmailForDropdown">[spanConfigureEmailNotificationsDialogSelectEditEmailForDropdown]</span>';
                //html += '   <br />';
                //html += '   <br />';

                html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                html += 'Subject line:';
                html += '</span>';
                html == '<br />';
                html += '   <div id="bwQuilltoolbarForSubject">';
                html += '       <button id="btnQuill_InsertADataItemForSubject" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
                html += '   </div>';

                html += '<input type="text" id="ConfigureEmailNotificationsDialogEditorForSubject" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 12pt;">';

                // summernote body editor.
                html += '<br />';
                html += '<br />';
                html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                html += 'Body:';
                html += '</span>';
                html == '<br />';
                html += '   <div id="bwQuilltoolbar">';
                html += '       <button id="btnQuill_InsertADataItem" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
                html += '   </div>';
                html += '   <div id="ConfigureEmailNotificationsDialogEditor" style="height:500px;"></div>'; // Quill. // This is where we set the height of the editor.
                // Save button.
                html += '   <br />';
                html += '   <span id="spanConfigureEmailNotificationsDialogSaveButton">[spanConfigureEmailNotificationsDialogSaveButton]</span>'; // ☑ 
                html += '   <br /><br />';
                // Preview button.
                //html += '   <div class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayEmailPreviewInDialog\');">';
                //html += '       ❏ Preview this email'; // &#10063;
                //html += '   </div>';
                //html += '   <br /><br />';
                html += '</div>';




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

                html += '<div style="display:none;" id="divWorkflowActionsUnderlyingPropertiesDialog_BwWorkflowEditor">';
                html += '  <table style="width:100%;">';
                html += '    <tr>';
                html += '      <td style="width:90%;">';
                html += '        <span id="spanWorkflowActionsUnderlyingPropertiesDialog" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Action Properties</span>';
                html += '                    <br />';
                html += '                    <span id="spanWorkflowActionsUnderlyingPropertiesDialogSubTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:normal;">[spanWorkflowActionsUnderlyingPropertiesDialogSubTitle]</span>';
                html += '      </td>';
                html += '      <td style="width:9%;"></td>';
                html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
                html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divWorkflowActionsUnderlyingPropertiesDialog_BwWorkflowEditor\').dialog(\'close\');">X</span>';
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

                html += '<div style="display:none;" id="divDeleteAWorkflowDialog">';
                html += '        <!--DEV: The replace function is not doing the Manager for a Budget Request yet!!!-->';
                html += '        <table style="width:100%;">';
                html += '            <tr>';
                html += '                <td style="width:90%;">';
                html += '                    <span id="spanDeleteAWorkflowDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">Delete this workflow.</span>';
                html += '                </td>';
                html += '                <td style="width:9%;"></td>';
                html += '                <td style="width:1%;cursor:pointer;vertical-align:top;">';
                html += '                    <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divDeleteAWorkflowDialog\').dialog(\'close\');">X</span>';
                html += '                </td>';
                html += '            </tr>';
                html += '        </table>';
                html += '        <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                html += '        <br />';
                html += '        <span id="spanDeleteAWorkflowDialogContentSection">';
                html += 'This action cannot be undone. Select the checkbox below so you can upload this workflow at a later date. (This functionality is incomplete. Coming soon!)';
                html += '        </span>';
                html += '        <br /><br />';
                html += '        <span id="spanWorkflowJsonEmailMessage">';
                html += '            &nbsp;&nbsp;&nbsp;&nbsp;';
                html += '            <input type="checkbox" id="cbWorkflowJsonEmailMessage" />&nbsp;';
                html += '            <span id="spanWorkflowJsonEmailMessageText" style="font-size:small;">';
                html += '                Email me this workflow Definition (JSON).';
                html += '            </span>';
                html += '        </span>';
                html += '        <br /><br />';
                html += '            <span id="spanDeleteWorkflowButton">[spanDeleteWorkflowButton]</span>';
                html += '        <br /><br />';
                html += '        <div class="divSignInButton" style="width:90%;text-align:center;line-height:0.8em;font-weight:bold;" onclick="$(\'#divDeleteAWorkflowDialog\').dialog(\'close\');">';
                html += '            Close';
                html += '        </div>';
                html += '        <br /><br />';
                html += '    </div>';

                html += '<div style="display:none;" id="divEditStepNameDialog">';
                html += '  <table style="width:100%;">';
                html += '    <tr>';
                html += '      <td style="width:90%;">';
                html += '        <span id="spanEditStepNameDialogTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Edit Step Name</span>';
                html += '      </td>';
                html += '      <td style="width:9%;"></td>';
                html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
                html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divEditStepNameDialog\').dialog(\'close\');">X</span>';
                html += '      </td>';
                html += '    </tr>';
                html += '  </table>';
                html += '  <br /><br />';
                html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                html += '  <span id="spanOldStepName" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:40pt;"></span>';
                html += '  <input type="hidden" id="txtEditStepNameDialog_bwRoleId" />'; // Our guid identifier.
                html += '  <br /><br />';
                html += '  <span style="font-family: calibri;">Step Abbreviation</span><br />';
                html += '  <input disabled="" type="text" id="txtEditStepNameDialog_StepNameAbbreviation" style="width:50%;font-family:\'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 40pt;" /><br /><br />';
                html += '  <span style="font-family: calibri;">Step Name</span><br />';
                html += '  <input type="text" id="txtEditStepNameDialog_StepNameFriendlyName" style="width:93%;font-family:\'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" /><br /><br />';
                html += '  <br />';
                html += '  <br />';
                html += '  <br />';
                html += '  <table style="width:100%;">';
                html += '     <tr>';
                html += '       <td style="text-align:center;">';
                html += '<span id="spanEditStepNameDialog_SaveButton"></span>';
                html += '       </td>';
                html += '     </tr>';
                html += '  </table>';
                html += '  <br /><br />';
                html += '</div>';

                html += '<div style="display:none;" id="divEditEmailInstructionTextDialog">';
                html += '  <table style="width:100%;">';
                html += '    <tr>';
                html += '      <td style="width:90%;">';
                html += '        <span id="spanEditEmailInstructionTextDialogTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Edit Email Instruction Text</span>';
                html += '      </td>';
                html += '      <td style="width:9%;"></td>';
                html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
                html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divEditEmailInstructionTextDialog\').dialog(\'close\');">X</span>';
                html += '      </td>';
                html += '    </tr>';
                html += '  </table>';
                html += '  <br /><br />';
                html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                //html += '  <span id="spanOldStepName" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:40pt;"></span>';
                //html += '  <input type="hidden" id="txtEditStepNameDialog_bwRoleId" />'; // Our guid identifier.
                //html += '  <br /><br />';
                //html += '  <span style="font-family: calibri;">Step Abbreviation</span><br />';
                //html += '  <input disabled="" type="text" id="txtEditStepNameDialog_StepNameAbbreviation" style="width:50%;font-family:\'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 40pt;" /><br /><br />';
                html += '  <span style="font-family: calibri;">Email Instruction Text</span><br />';
                html += '  <input type="text" id="txtEditEmailInstructionTextDialog_EmailInstructionText" style="width:93%;font-family:\'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 12pt;" /><br /><br />';
                html += '  <br />';
                html += '  <br />';
                html += '  <br />';
                html += '  <table style="width:100%;">';
                html += '     <tr>';
                html += '       <td style="text-align:center;">';
                html += '<span id="spanEditEmailInstructionTextDialog_SaveButton"></span>';
                html += '       </td>';
                html += '     </tr>';
                html += '  </table>';
                html += '  <br /><br />';
                html += '</div>';

                html += '<div style="display:none;" id="divProgressBarDialog">';
                html += '<div id="progressbar" class="ui-progressbar"><div class="progress-label">Loading...</div></div>';
                html += '</div>';

                // Display workflow picker.
                if (thiz.options.displayWorkflowPicker) {
                    if (thiz.options.DisplayAsNewTenantUserConfigurationEditor != true) {
                        html += '<table style="width:100%;">';
                        html += '   <tr>';
                        html += '       <td>';
                        //html += '           <h2>';
                        html += '               <span style="color:black;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 35pt;font-weight:bold;">';
                        html += 'Configure the workflow for ';
                        //html += '[dropdown]';







                        // 1-2-2022
                        //html += '   <div style="display:inline-block;vertical-align:middle;" id="divBwRequestTypeDropDown22">[divBwRequestTypeDropDown22]</div>';
                        var requestTypes = bwEnabledRequestTypes.EnabledItems; // Global, populated in the beginning when the app loads.
                        //if (requestTypes.length == 1) { // If there is only one, don't display as a drop down, just as plain text.
                        //html += '<span style="font_weight:bold;color:grey;">Active workflow for Request Type: </span>';
                        //} else { // There is more than 1, so we have to display as a drop down.
                        //html += '<span style="font_weight:bold;color:grey;">Active workflow for Request Type: </span>';
                        //}

                        // Render the drop down at the top of the page, and select the last used option!
                        //if (requestTypes.length == 1) { // If there is only one, don't display as a drop down, just as plain text.
                        //    html += '<span style="font_weight:bold;color:grey;"><strong>' + requestTypes[0].RequestType + '</strong></span>';
                        //} else { // There is more than 1, so we have to display as a drop down.
                        html += '<span style="font_weight:bold;color:grey;"><strong>';
                        html += '   <select id="selectRequestTypeDropDown" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'WorkflowRequestTypeDropDown_Onchange\', \'selectWorkflowRequestTypeDropDown\');" class="selectHomePageWorkflowAppDropDown" style=\'display:inline;border-color: whitesmoke; color: grey; font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 1em; font-weight: bold; cursor: pointer;  margin-bottom:15px;\'>'; // was .5em
                        for (var i = 0; i < requestTypes.length; i++) {
                            //var selected = '';
                            //if (requestTypes[i].Abbreviation == bwLastSelectedNewRequestType) { // Selected
                            //    selected = 'selected';
                            //}
                            //html += '<option value="' + requestTypes[i].bwRequestTypeId + '" ' + selected + ' >' + requestTypes[i].PluralName + '</option>';

                            if (selectedRequestTypeId) { // This is used when editing a workflow... when it redraws the UI it needs to know which workflow was being edited.
                                if (requestTypes[i].bwRequestTypeId == selectedRequestTypeId) {
                                    html += '<option value="' + requestTypes[i].bwRequestTypeId + '" selected="selected" >' + requestTypes[i].PluralName + '</option>';
                                } else {
                                    html += '<option value="' + requestTypes[i].bwRequestTypeId + '" >' + requestTypes[i].PluralName + '</option>';
                                }
                            } else {
                                html += '<option value="' + requestTypes[i].bwRequestTypeId + '" >' + requestTypes[i].PluralName + '</option>';
                            }


                        }
                        html += '   </select>';
                        html += '</span>';
                        //}














                        html += ' &nbsp;&nbsp;&nbsp;';

                        //html += '<span class="spanButton context-menu-workflowstep2" id="xcx" style="height:20px;width:150px;"> ... </span>';
                        html += '<span class="spanButton context_menu_workfloweditor_main" id="xcx" style="height:20px;width:150px;"> ... </span>';

                        html += '               </span>'; // Velvet Morning is #95b1d3. This was the pantone color of the day for December 9, 2019! :D
                        //html += '           </h2>';
                        html += '       </td>';
                        html += '       <td style="text-align:right;">';
                        //html += '           <span class="printButton" title="print" onclick="cmdPrintForm();">&#x1f5a8;</span>';
                        html += '       </td>';
                        html += '   </tr>';
                        html += '</table>';
                    }
                    // Publish message and button.
                    html += '<table>';

                    html += '<tr>';
                    html += '   <td colspan="3">';
                    html += '       <span id="spanWorkflowEditor_Error">[spanWorkflowEditor_Error]</span>';
                    html += '   </td>';
                    html += '</tr>';

                    html += '<tr>';
                    html += '  <td>';
                    html += '';
                    html += '  </td>';
                    html += '  <td style="text-align:right;">';
                    html += '    <span id="spanThereAreChangesToPublishText" style="font-style:italic;color:tomato;"></span>'; //<input value=" There are unsaved changes. Enter a description here and click Save..." type="text" id="txtNewWorkflowDescription" style="width:450px;color:grey;font-style:italic;padding:5px 5px 5px 5px;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewWorkflowDescriptionTextBox_Onkeyup\');" />';
                    html += '  </td>';
                    html += '  <td>';
                    html += '    <span id="spanThereAreChangesToPublishButton"></span>';
                    html += '  </td>';
                    html += '</tr>';
                    html += '</table>';

                    // Create the drop down at the top of the page, and select the last used option!
                    html += '<table>';
                    html += '<tr>';
                    html += '  <td colspan="3" style="white-space:nowrap;">';




                    //var requestTypes = bwEnabledRequestTypes.EnabledItems;
                    //if (requestTypes.length == 1) { // If there is only one, don't display as a drop down, just as plain text.
                    //    html += '<span style="font_weight:bold;color:grey;">Active workflow for: </span>';
                    //} else { // There is more than 1, so we have to display as a drop down.
                    //    html += '<span style="font_weight:bold;color:grey;">Active workflow for: ';
                    //    html += '</span>';
                    //}
                    ////html += '  </td>';
                    ////html += '  <td style="white-space:nowrap;">';
                    //// Render the drop down at the top of the page, and select the last used option!
                    ////var bwLastSelectedRequestType = 'all';
                    //if (requestTypes.length == 1) { // If there is only one, don't display as a drop down, just as plain text.
                    //    html += '<span style="font_weight:bold;color:black;"><strong>' + requestTypes[0].RequestType + '</strong></span>';
                    //} else { // There is more than 1, so we have to display as a drop down.
                    //    html += '<span style="font_weight:bold;color:black;"><strong>';
                    //    //debugger; // WE SHOPULD ONLY COME HERE ONCE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    //    html += '   <select id="selectWorkflowRequestTypeDropDown" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'WorkflowRequestTypeDropDown_Onchange\', \'selectWorkflowRequestTypeDropDown\');" style=\'border-color: whitesmoke; color: grey; font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 14pt; font-weight: bold; cursor: pointer;\'>'; // was .5em
                    //    //html += '<option value="' + 'all' + '" selected >' + 'All request types' + '</option>';
                    //    //debugger;
                    //    for (var i = 0; i < requestTypes.length; i++) {
                    //        if (requestTypes[i].Abbreviation == thiz.options.LastSelectedRequestType) { //bwLastSelectedRequestType) { // Selected
                    //            html += '<option value="' + requestTypes[i].Abbreviation + '" selected >' + requestTypes[i].RequestType + '</option>';
                    //        } else { // Not selected
                    //            html += '<option value="' + requestTypes[i].Abbreviation + '">' + requestTypes[i].RequestType + '</option>';
                    //        }
                    //    }
                    //    html += '   </select>';
                    //    html += '</span>';
                    //}



                    html += 'Configure the workflow and it\'s email templates, then select the "Publish" button. The changes will be available immediately.'; // 1-31-2022



                    // 1-2-2022
                    //html += '   <div style="display:inline-block;vertical-align:middle;" id="divBwRequestTypeDropDown22">[divBwRequestTypeDropDown22]</div>';
                    //var requestTypes = $('.bwAuthentication').bwAuthentication('option', 'bwEnabledRequestTypes').EnabledItems; // Global, populated in the beginning when the app loads.
                    //if (requestTypes.length == 1) { // If there is only one, don't display as a drop down, just as plain text.
                    //    html += '<span style="font_weight:bold;color:grey;">Active workflow for Request Type: </span>';
                    //} else { // There is more than 1, so we have to display as a drop down.
                    //    html += '<span style="font_weight:bold;color:grey;">Active workflow for Request Type: </span>';
                    //}

                    //// Render the drop down at the top of the page, and select the last used option!
                    //if (requestTypes.length == 1) { // If there is only one, don't display as a drop down, just as plain text.
                    //    html += '<span style="font_weight:bold;color:grey;"><strong>' + requestTypes[0].RequestType + '</strong></span>';
                    //} else { // There is more than 1, so we have to display as a drop down.
                    //    html += '<span style="font_weight:bold;color:grey;"><strong>';
                    //    html += '   <select id="selectRequestTypeDropDown" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'WorkflowRequestTypeDropDown_Onchange\', \'selectWorkflowRequestTypeDropDown\');" style=\'display:inline;border-color: whitesmoke; color: grey; font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 14pt; font-weight: bold; cursor: pointer;\'>'; // was .5em
                    //    for (var i = 0; i < requestTypes.length; i++) {
                    //        var selected = '';
                    //        //if (requestTypes[i].Abbreviation == bwLastSelectedNewRequestType) { // Selected
                    //        //    selected = 'selected';
                    //        //}
                    //        html += '<option value="' + requestTypes[i].bwRequestTypeId + '" ' + selected + ' >' + requestTypes[i].SingletonName + '</option>';
                    //    }
                    //    html += '   </select>';
                    //    html += '</span>';
                    //}









                    // We need to decide if we show the checkbox. If there are more than 1 active workflows, then disable/hide this checkbox!!!!!!!!!!!!<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                    if (thiz.options.MultipleWorkflowsEnabled == false) {
                        html += '&nbsp;&nbsp;<span style="font-weight:normal;font-style:italic;color:grey;white-space:nowrap;"><input id="WorkflowForAllRequestTypesCheckbox" type="checkbox" checked="checked" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'WorkflowForAllRequestTypesCheckbox_Onchange\');" />All request types inherit this workflow</span>';
                    } else {
                        //html += '&nbsp;&nbsp;<span style="font-weight:normal;font-style:italic;color:grey;white-space:nowrap;">Each request type has it\'s own workflow</span>';
                    }

                    var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');

                    if (developerModeEnabled == true) {
                        html += '<span title="Workflow(s) maintenance..." style="width:200px;padding:5px 10px 5px 10px;margin:0 0 0 10px;white-space:nowrap;vertical-align:middle;border:1px solid lightblue;cursor:pointer;font-weight:normal;font-size:10pt;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayWorkflowsConfigurationDialog\');"><span style="display:inline-block;"> ⚙ </span></span>';
                    }

                    html += '<br /><br />';



                    html += '  </td>';
                    //html += '  <td>';
                    //html += '  </td>';
                    html += '</tr>';

                    html += '</table';
                }
                // End: Display workflow picker.


                html += '<table>';



                html += '<tr><td>';
                html += '<span id="spanWorkflowEditor_SelectedWorkflow">[spanWorkflowEditor_SelectedWorkflow]</span>';
                html += '</td></tr>';
                html += '</table>';

                thiz.element.html(html);






                thiz.renderWorkflowEditor2(assignmentRowChanged_ElementId, expandedStepIndex);

            }


        } catch (e) {
            console.log('Exception in bwWorkflowEditor.js.renderWorkflowEditor1(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwWorkflowEditor.js.renderWorkflowEditor1(): ' + e.message + ', ' + e.stack);
        }
    },

    renderWorkflowEditor2: function (assignmentRowChanged_ElementId, expandedStepIndex) {
        try {
            console.log('In renderWorkflowEditor2().');
            //alert('In renderWorkflowEditor2(). Refactoring checklists.');
            var thiz = this;

            document.getElementById('spanWorkflowEditor_SelectedWorkflow').innerHTML = '';
            document.getElementById('spanWorkflowEditor_Error').innerHTML = '';
            document.getElementById('spanThereAreChangesToPublishText').innerHTML = '';
            document.getElementById('spanThereAreChangesToPublishButton').innerHTML = '';

            // Now set the current workflow based on the selection from the drop-down.
            var bwRequestTypeId;
            $('#selectRequestTypeDropDown').find('option:selected').each(function (index, element) {
                bwRequestTypeId = element.value;
            });

            if (!bwRequestTypeId) { //if (!bwRequestTypeId || (bwRequestTypeId == null)) {

                console.log('Error in bwWorkflowEditor.js.renderWorkflowEditor2(). Invalid value(s). bwRequestTypeId: ' + bwRequestTypeId);
                displayAlertDialog('Error in bwWorkflowEditor.js.renderWorkflowEditor2(). Invalid value(s). bwRequestTypeId: ' + bwRequestTypeId);

            } else {

                var car;

                // THIS IS THE ONLY PLACE WHERE THE WRKFLOW IS SELECTED AND THE CurrentWorkflow and DraftWorkflow are assigned.
                console.log('THIS IS THE ONLY PLACE WHERE THE WORKFLOW IS SELECTED AND THE CurrentWorkflow and DraftWorkflow are assigned.');
                if (thiz.options.CurrentWorkflow && thiz.options.CurrentWorkflow.bwRequestTypeId && (thiz.options.CurrentWorkflow.bwRequestTypeId == bwRequestTypeId)) { // If there is already a workflow assigned, lets just check that it is the same one that is in the drop down. If so, we will not reassign it here leave it alone.
                    // Do nothing, we already have this workflow displayed and it is the same as the one selected in the drop down.
                    debugger;
                } else {
                    debugger;
                    for (var i = 0; i < thiz.options.Workflows.length; i++) {
                        if ((thiz.options.Workflows[i].bwRequestTypeId == bwRequestTypeId) && (thiz.options.Workflows[i].isActive == true)) {
                            //if ((thiz.options.Workflows[i].Workflow || thiz.options.Workflows[i].bwWorkflowJson)) {
                            if (thiz.options.Workflows[i].bwWorkflowJson) {

                                var bwWorkflowJson = thiz.options.Workflows[i].bwWorkflowJson;
                                thiz.options.CurrentWorkflow = {
                                    bwRequestTypeId: bwRequestTypeId,
                                    Workflow: JSON.parse(bwWorkflowJson),
                                    DraftWorkflow: JSON.parse(bwWorkflowJson)
                                }


                                //thiz.options.CurrentWorkflow["Workflow"] = JSON.parse(thiz.options.Workflows[i].bwWorkflowJson);
                                //thiz.options.CurrentWorkflow["DraftWorkflow"] = JSON.parse(thiz.options.Workflows[i].bwWorkflowJson); // Creating "DraftWorkflow" so we can tell if the workflow has been changed or not, and then inform the user that changes need to be published.

                                //car = thiz.options.Workflows[i]; // 1-4-2022
                                //alert('Set CurrentWorkflow xcx111774-8');
                                console.log('Set CurrentWorkflow xcx111774-8');
                                break;
                            } else {
                                console.log('');
                                console.log('INVALID VALUE FOR thiz.options.Workflows[i].bwWorkflowJson: ' + thiz.options.Workflows[i].bwWorkflowJson);
                                console.log('');
                            }
                        }
                    }
                }
                debugger;
                if (thiz.options.CurrentWorkflow && thiz.options.CurrentWorkflow.DraftWorkflow) {
                    car = thiz.options.CurrentWorkflow.DraftWorkflow;
                } else {

                    alert('Error: xcx232131. IS THIS A RACE CONDITION? car should be populated... thiz.options.CurrentWorkflow: ' + JSON.stringify(thiz.options.CurrentWorkflow));

                }
                if (!car) {
                    // For some reason we have no workflow definition stored, so "No workflow found" in the display..
                    debugger;

                    var html = '';
                    html += '<span style="color:tomato;">Error: No workflow was found for this Request Type. Create one by customizing this default workflow, and clicking the Publish button.</span>';
                    //html += 'Click here to load the Introductory Workflows. You can alter these once they are laoded...';
                    document.getElementById('spanWorkflowEditor_Error').innerHTML = html;

                    //
                    // THIS IS WHERE IF THERE IS NO WORKFLOW SAVED IN THE DATABASE WE SPIT OUT THE DEFAULT.
                    //
                    console.log('');
                    console.log('*************************************************************************');
                    console.log('In bwWorkflowEditor.js.renderWorkflowEditor2(). THIS IS WHERE IF THERE IS NO WORKFLOW SAVED IN THE DATABASE WE SPIT OUT THE DEFAULT.');
                    console.log('*************************************************************************');
                    console.log('');

                    var bwWorkflowJson;
                    bwWorkflowJson = $('.bwAuthentication').bwAuthentication('option', 'bwWorkflowJson_Default').Workflow;
                    console.log('In renderWorkflowEditor2(). No workflow was found for this Request Type. Create one by customizing this default workflow, and clicking the Publish button.');

                    //
                    // end: THIS IS WHERE IF THERE IS NO WORKFLOW SAVED IN THE DATABASE WE SPIT OUT THE DEFAULT.
                    //

                    thiz.options.CurrentWorkflow = {
                        bwRequestTypeId: bwRequestTypeId,
                        Workflow: '',
                        DraftWorkflow: JSON.parse(JSON.stringify(bwWorkflowJson))
                    }

                    car = JSON.parse(JSON.stringify(bwWorkflowJson));

                    thiz.checkIfWeHaveToDisplayThePublishChangesButton();

                }

                // We need to get all the role descriptions from the database immediately so we can use them to populate the workflow/raci chart.
                $.ajax({
                    url: this.options.operationUriPrefix + "_bw/Roles", // Get the eCarWorkflow json/definition from the database.
                    dataType: "json",
                    contentType: "application/json",
                    type: "Get",
                    success: function (result) {
                        try {
                            debugger;
                            console.log('In bwWorkflowEditor.js.renderWorkflowEditor2.Get.odata/Roles(). result: ' + JSON.stringify(result));
                            var html = '';
                            var roles;
                            if (result) {
                                roles = result.value;
                                //console.log('In raci.html._create().renderWorkflowEditor.Get[odata/Roles].done: roles: ' + JSON.stringify(roles));
                            } else {
                                console.log('In renderWorkflowEditor2().done: result: ' + JSON.stringify(result));
                            }
                            //debugger;
                            console.log('In renderWorkflowEditor().');
                            if (car == null) {
                                html += '<span style="font-size:24pt;color:red;">NO DATA</span>';
                            } else {
                                html += '<div id="bwworkflow" bwrequesttype="" bwworkflowid="">';
                                html += '<table class="tableWithRightSliderPanel">';
                                html += '<tr>';
                                html += '  <td style ="vertical-align:top;">';
                                html += '       <table>';
                                html += '          <tr>';
                                html += '              <td style="text-align:right;">';

                                html += '                   <span id="spanExpandOrCollapseRightSliderPaneButton" style="cursor:pointer;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'expandOrCollapseSliderPanel\');">';
                                html += '                       <span title="Edit email template(s)..." style="width:200px;padding:5px 10px 5px 10px;margin:0 0 0 20px;white-space:nowrap;vertical-align:top;border:1px solid lightblue;cursor:pointer;font-weight:normal;font-size:20pt;">';
                                html += '                           <span style="display:inline-block;">+ ⚙✉</span>';
                                html += '                       </span>';
                                html += '                       <span id="divEmailEditorHorizontalSliderPane"></span>';
                                html += '                   </span>';
                                html += '             </td>';
                                html += '         </tr>';
                                html += '        <tr>';
                                html += '             <td>';
                                html += '                 <span>';

                                html += '<table id="tableWorkflowEditorWorkflow" style="border-color:#95b1d3;border-width:1px;border-style:dotted solid double dashed;">'; //  border: 1px dashed #95b1d3;">'; //color:#95b1d3;

                                html += '<tr>';
                                html += '  <td>';
                                //debugger;
                                //html += '<span id="spanBwWorkflowId" style="color:gainsboro;" bwWorkflowId="' + car.bwWorkflowId + '">' + car.bwWorkflowId + ' (' + car.bwRequestType + ')' + '</span>';

                                html += '                       <span title="Expand or Collapse ALL..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'expandOrCollapseAllWorkflowSteps\');" style="width:200px;padding:5px 10px 5px 10px;margin:0 0 0 20px;white-space:nowrap;vertical-align:top;border:1px solid lightblue;cursor:pointer;font-weight:normal;font-size:20pt;">';
                                html += '                           <span style="display:inline-block;">+/-</span>';
                                html += '                       </span>';


                                html += '</td>';
                                html += '  <td colspan="10" style="text-align:right;padding:10px;";>';
                                //debugger;
                                //if (!(car && car.bwWorkflowJson)) { //.Workflow) {

                                //    html += '    NO WORKFLOW JSON. CANNOT PROCEED. xcx32456-5';
                                //    html += '  </td>';
                                //    html += '</tr>';

                                //} else {

                                // quick refactor
                                //var bwWorkflowJson = JSON.parse(car.bwWorkflowJson);
                                car = {
                                    Workflow: car
                                }

                                //debugger;
                                html += '    <input type="button" class="BwSmallButton" style="padding:5px 10px 5px 10px;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'addNewWorkflowStep\', \'' + (car.Workflow.Steps.Step.length - 1) + '\');" value="Add a Step" title="bwWorkflowEditor.addNewWorkflowStep(). Doesn\'t work right yet..." />';
                                //var tooltip = 'Edit email template(s)...';
                                //html += '<span title="' + tooltip + '" style="padding:5px 10px 5px 10px;margin:0 0 0 20px;white-space:nowrap;vertical-align:top;border:1px solid lightblue;cursor:pointer;font-weight:normal;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'editStepEmails\', \'' + 'all' + '\');"><span style="font-size:15pt;display:inline-block;">✉</span> Task Notification Emails&nbsp;&nbsp;</span>';

                                html += '  </td>';
                                html += '</tr>';
                                debugger;
                                for (var i = 0; i < car.Workflow.Steps.Step.length; i++) {

                                    if (!car.Workflow.Steps.Step[i]) {

                                        displayAlertDialog('Error in bwWorkflowEditor.js.renderWorkflowEditor2(). This step is undefined. step index: ' + i);

                                    } else {


                                        var stepName = car.Workflow.Steps.Step[i]["@Name"];

                                        if (!stepName) {
                                            alert('xcx34566 INVALID VALUE FOR stepName: ' + stepName);
                                        }



                                        if (false) {
                                            // Do nothing, not displaying these steps. << DISPLAYING all steps now!
                                        } else {
                                            var newStepName;
                                            if (stepName == 'Create') {
                                                newStepName = 'Create';
                                            } else if (stepName == 'Revise') {
                                                newStepName = 'Revise';
                                            } else if (stepName == 'Admin') {
                                                newStepName = 'Admin';
                                            } else {
                                                newStepName = car.Workflow.Steps.Step[i]["@FriendlyName"];
                                            }

                                            // COMMENTED OUT 3-28-2020 1-06pm adt.
                                            //var newStepName = '';
                                            //if (stepName == 'Create') {
                                            //    newStepName = 'Create';
                                            //} else if (stepName == 'Revise') {
                                            //    newStepName = 'Revise';
                                            //} else if (stepName == 'Admin') {
                                            //    newStepName = 'Admin';
                                            //} else if (stepName == 'Collaboration') {
                                            //    newStepName = 'Collaborate and Develop Consensus';
                                            //} else if (stepName == 'VPLevel') {
                                            //    newStepName = 'Requesting Manager Approvals';
                                            //} else if (stepName == 'ExecLevel') {
                                            //    newStepName = 'Requesting Executive Approvals';
                                            //} else if (stepName == 'CLevel') {
                                            //    newStepName = 'Requesting Board of Directors Approvals';
                                            //} else if (stepName == 'Done') {
                                            //    newStepName = 'Approved';
                                            //} else if (stepName == 'IssueOrderNumber') {
                                            //    newStepName = 'Requesting Purchase Order Number from Accounting';
                                            //}

                                            //if (stepName == 'Done') {
                                            //    stepName = 'Completed (Done)'; // This is what we want the Done step renamed to in the future...
                                            //}

                                            //var cellColor = 'white';
                                            var cellColor = '#f5f6f7';
                                            // Todd: For now, all steps are going white!
                                            //if (stepName == 'Admin') {
                                            //    cellColor = 'lightblue';
                                            //} else if (stepName == 'Collaboration') {
                                            //    cellColor = 'lightblue';
                                            //} else if (stepName == 'VPLevel') {
                                            //    cellColor = '#ECECEE';
                                            //} else if (stepName == 'ExecLevel') {
                                            //    cellColor = 'lightgrey';
                                            //} else if (stepName == 'CLevel') {
                                            //    cellColor = 'grey';
                                            //} else if (stepName == 'Done') {
                                            //    cellColor = '#D4DBEE'; 
                                            //} else if (stepName == 'IssueOrderNumber') {
                                            //    cellColor = 'lightgreen';
                                            //}

                                            // Display the header row for this step.
                                            //debugger;
                                            html += '<tr id="stepheaderrow_' + i + '" style="border:0px;cursor:pointer;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'expandOrCollapseWorkflowStep\', \'' + 'stepname_' + i + '\', \'' + 'stepimage_' + i + '\', \'steprow-' + stepName.toLowerCase() + '_' + i + '_' + '0' + '\');">';
                                            html += '  <td colspan="11" class="stepheadercell context-menu-workflowstep" style="font-weight:bold;padding:10px;background-color:' + cellColor + ';" title="Right-click to edit the step name..." >';
                                            html += '    <table style="width:100%;">';
                                            html += '      <tr>';
                                            html += '        <td colspan="2" >';
                                            html += '          <span style="white-space:nowrap;">';

                                            // EXPAND COLLAPSE!!!!!!!!!!!!!!!! 1-26-2020
                                            html += '            <span xcx="xcx1232415" id="stepname_' + i + '" class="stepname" style="cursor:cell;vertical-align:middle;" >';
                                            html += '              <img id="stepimage_' + i + '" src="images/drawer-open.png" title="collapse" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;"  />';
                                            html += '              &nbsp;' + newStepName;
                                            html += '            </span>';

                                            //html += '            <span id="stepname_' + i + '" class="stepname" style="cursor:cell;vertical-align:middle;" title="Double-click to edit the step name...">' + newStepName + '</span>';
                                            html += '          </span>';
                                            html += '        </td>';
                                            //html += '        <td></td>';
                                            html += '        <td style="text-align:center;">';
                                            // Display the consensus timeout section and the "Configure Email", and "Add PArticipants" buttons.
                                            html += '           <table style="width:100%;">';
                                            html += '               <tr>';
                                            html += '                   <td></td>';
                                            html += '                   <td>';
                                            if (stepName == 'Collaboration') {
                                                html += '<span style="white-space:nowrap;font-weight:normal;padding:10px 10px 10px 10px;">';
                                                var timeout = '';
                                                var timeoutUnits = '';
                                                try {

                                                    if (car.Workflow.Steps.Step[i]["@Timeout"]) {
                                                        // This decides whether to display the timeout in minutes or days.
                                                        var timeoutMinutes = car.Workflow.Steps.Step[i]["@Timeout"];
                                                        var timeoutDays;
                                                        if (timeoutMinutes > 720) {
                                                            var minutesInASingleDay = 1440;
                                                            timeoutDays = timeoutMinutes / minutesInASingleDay;
                                                        }
                                                        if (timeoutDays) {
                                                            timeout += timeoutDays;
                                                        } else {
                                                            timeout += timeoutMinutes;
                                                        }
                                                    }
                                                    if (car.Workflow.Steps.Step[i]["@TimeoutUnits"]) {
                                                        timeoutUnits = car.Workflow.Steps.Step[i]["@TimeoutUnits"];
                                                    }
                                                } catch (e) {
                                                    console.log('In bwWorkflowEditor.js(). Exception trying to get the timeout: ' + e.message + ', ' + e.stack);
                                                }
                                                html += '<span style="white-space:nowrap;font-size:11pt;">';
                                                html += 'Consensus timeout:&nbsp;';
                                                html += '<input type="text" id="textTimeout" style="width:25px;padding:5px 5px 5px 5px;" value="' + timeout + '" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveCollaborationTimeout\', \'' + 'textTimeout' + '\');" />';
                                                html += '&nbsp;';
                                                html += '<select id="selectTimeoutUnits" style="padding:5px 5px 5px 5px;" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveCollaborationTimeout\', \'' + 'textTimeout' + '\');">';
                                                if (timeoutUnits == 'Days') html += '<option value="Days" selected >Days</option>';
                                                else html += '<option value="Days">Days</option>';
                                                if (timeoutUnits == 'Hours') html += '<option value="Hours" selected >Hours</option>';
                                                else html += '<option value="Hours">Hours</option>';
                                                if (timeoutUnits == 'Minutes') html += '<option value="Minutes" selected >Minutes</option>';
                                                else html += '<option value="Minutes">Minutes</option>';
                                                html += '</select>';
                                                html += '</span>';
                                                html += '</span>';
                                            }
                                            html += '                   </td>';
                                            html += '                   <td></td>';
                                            html += '                   <td style="text-align:right;white-space:nowrap;">';
                                            //if (stepName != 'Create' && stepName != 'Revise' && stepName != 'Admin') {



                                            // Display the "Configure Email" button. TODD: This can probably get encapsulated into 1 method call instead of editCollaborationTimeoutEmail() and editStepEmails().
                                            //var tooltip = 'Edit email template(s)...';
                                            //if (stepName.toLowerCase() == 'create') { // || stepName == 'Admin' || stepName == 'Revise') {
                                            //    html += '<span title="' + tooltip + '" style="padding:5px 10px 5px 10px;margin:0 0 0 20px;white-space:nowrap;vertical-align:top;border:1px solid lightblue;cursor:pointer;font-weight:normal;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'editStepEmails\', \'' + stepName + '\');"><span style="font-size:15pt;display:inline-block;">✉</span> Confirmation Email&nbsp;&nbsp;</span>';
                                            //} else {
                                            //    html += '<span title="' + tooltip + '" style="padding:5px 10px 5px 10px;margin:0 0 0 20px;white-space:nowrap;vertical-align:top;border:1px solid lightblue;cursor:pointer;font-weight:normal;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'editStepEmails\', \'' + stepName + '\');"><span style="font-size:15pt;display:inline-block;">✉</span> &quot;' + stepName + '&quot; Email&nbsp;&nbsp;</span>';

                                            //}
                                            //if (stepName.toLowerCase() == 'admin') {
                                            //    // No "Add a participant" button for the ADMIN step/stage.
                                            //} else {
                                            html += '&nbsp;&nbsp;&nbsp;&nbsp;';
                                            //html += '          <input type="button" class="buttonAddNewAssignmentRow" style="white-space:nowrap;padding:5px 10px 5px 10px;" value="✚ Add a Role/Participant" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'addARoleParticipant\', \'' + 'steprow-inform_' + i + '_' + '0' + '\');" />';
                                            html += '          <input type="button" class="BwSmallButton" style="white-space:nowrap;padding:5px 10px 5px 10px;" value="✚ Add a Role/Participant" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'addARoleParticipant\', \'' + 'steprow-inform_' + i + '_' + '0' + '\');" />';



                                            //alert('xcx213124 stepName: ' + stepName);




                                            //if (!(stepName.toLowerCase() == 'admin' || stepName.toLowerCase() == 'create' || stepName.toLowerCase() == 'revise')) { // Cannot delete these steps.
                                            if (!(stepName.toLowerCase() == 'create')) { // Cannot delete these steps.
                                                html += '&nbsp;&nbsp;&nbsp;&nbsp;';
                                                //html += '          <input type="button" class="" style="white-space:nowrap;padding:5px 10px 5px 10px;" value="Delete this Step" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'deleteStep\', \'' + 'steprow-inform_' + i + '_' + '0' + '\');" />';
                                                //html += '<img title="Delete" style="cursor:pointer;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'deleteStep\', \'' + 'steprow-inform_' + i + '_' + '0' + '\');" src="images/trash-can.png">';


                                                //html += '<span class="spanButton" style="height:20px;width:150px;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'deleteStep\', \'' + 'steprow-inform_' + i + '_' + '0' + '\');">';
                                                //html += '<img style="cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'deleteStep\', \'' + 'steprow-inform_' + i + '_' + '0' + '\');" src="images/trash-can.png">';
                                                //html += ' Delete this Step ';
                                                //html += '</span>';

                                                //html += '&nbsp;&nbsp;';
                                                html += '<span class="spanButton context-menu-workflowstep2" style="height:20px;width:150px;" id="steprow-inform_' + i + '_' + '0">';
                                                html += ' ... ';
                                                html += '</span>';

                                            }

                                            //}

                                            //html += 'xellipsisx';


                                            //}
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
                                                if (!(car.Workflow.Steps.Step[i].Assign || car.Workflow.Steps.Step[i].Assign[0])) { // changed to || (or) 1-23-2022

                                                    console.log('Error in bwWorkflowEditor.js.renderWorkflowEditor2(). NO ASSIGN STEP FOUND for step: ' + stepName);
                                                    displayAlertDialog('Error in bwWorkflowEditor.js.renderWorkflowEditor2(). NO ASSIGN STEP FOUND for step: ' + stepName);


                                                } else {

                                                    var assign2; // added 1-23-2022
                                                    if (car.Workflow.Steps.Step[i].Assign && car.Workflow.Steps.Step[i].Assign[0]) {
                                                        assign2 = car.Workflow.Steps.Step[i].Assign[0];
                                                    } else {
                                                        assign2 = car.Workflow.Steps.Step[i].Assign;
                                                    }


                                                    //
                                                    // THERE WILL ONLY EVER BE 1 node here.
                                                    //

                                                    //
                                                    // NOTE THAT THIS IS WHERE THE ROW IS NOT DISPLAYED INITIALLY!!!! 1-26-2020
                                                    //
                                                    html += '<tr id="steprow-' + stepName.toLowerCase() + '_' + i + '_' + '0' + '" class="steprow steprow_' + i + '" style="cursor:cell;display:none;" title="This role assignment cannot be changed, it is a part of the core workflow functionality." >';





                                                    html += '  <td style="width:30px;"></td>';

                                                    if (thiz.options.displayRoleIdColumn) {
                                                        html += '<td style="background-color:' + cellColor + ';" class="roleid steprowcell" bwRoleId="' + assign2["@Role"] + '" bwOldValue="' + assign2["@Role"] + '">' + assign2["@Role"] + '</td>';
                                                    }
                                                    debugger; 1 - 12 / 2022
                                                    var roleName = assign2["@Role"]; //["@RoleName"];
                                                    //debugger; // AllowRequestModifications xcx1
                                                    var allowRequestModifications = assign2["@AllowRequestModifications"];

                                                    var budgetThreshold = assign2["@BudgetThreshold"];

                                                    var instructions = assign2["@Instructions"];
                                                    if (instructions) {
                                                        instructions = instructions.replace(/["]/g, '&quot;').replace(/[']/g, '&#39;');
                                                    }
                                                    html += '<td style="background-color:' + cellColor + ';" class="rolename steprowcell" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';this.style.color=\'red\';" onMouseOut="this.style.backgroundColor=\'' + cellColor + '\';this.style.color=\'black\';" bwstepname="' + car.Workflow.Steps.Step[i]["@Name"] + '" bwRoleId="' + assign2["@Role"] + '" bwOldValue="' + roleName + '" bwallowrequestmodifications="' + allowRequestModifications + '" bwinstructions="' + instructions + '" bwbudgetthreshold="' + budgetThreshold + '">';
                                                    //html += ' <img style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayPeoplePickerDialog\', \'' + 'txtApprover2FriendlyName' + '\', \'' + 'txtApprover2Id' + '\', \'' + 'txtApprover2Email' + '\');" src="images/addressbook-icon18x18.png">';
                                                    //html += '&nbsp;' + roleName;
                                                    html += 'Role: ' + roleName;


                                                    html += '<br />';
                                                    if (!allowRequestModifications) {
                                                        html += '<span style="color:red;">✖</span>' + '&nbsp;<span style="font-size:8pt;">Can\'t modify the request.</span><br />';
                                                    } else {
                                                        html += '<span style="">✔</span>' + '&nbsp;<span style="font-size:8pt;">Can modify the request.</span><br />';
                                                    }




                                                    //html += '<br />';
                                                    //html += '<span style="color:grey;font-size:12pt;font-style:italic;">All participants can create a new request.</span>';
                                                    html += '</td>';

                                                    html += '<td class="steprowcell">';
                                                    html += ' <span id="rolecategory-assign_' + i + '_' + j + '" class="rolecategory" bwstepname="' + car.Workflow.Steps.Step[i]["@Name"] + '" bwRoleId="' + assign2["@Role"] + '" bwOldValue="' + assign2["@RoleCategory"] + '" style="cursor:cell;" title="Double-click to edit the role category...">';
                                                    html += assign2["@RoleCategory"];
                                                    html += ' </span>';
                                                    html += '</td>';

                                                    // Task(s)/Action(s)
                                                    var task = assign2.Action["@Name"]; // There is only 1, "Submit".
                                                    if (!task) task = '';
                                                    else task = '•&nbsp;' + task;
                                                    //if (stepName == 'Create' || stepName == 'Revise') {
                                                    if (stepName == 'Create') {
                                                        html += '<td colspan="3" class="tasks steprowcell" bwstepname="' + car.Workflow.Steps.Step[i]["@Name"] + '" bwRoleId="' + assign2["@Role"] + '" >' + task + '</td>';
                                                    } else {
                                                        // Admin needs an edit button so that this role can be assigned to someone else.
                                                        var xid = 'steprow-admin_' + i + '_' + '0';
                                                        html += '<td class="tasks steprowcell" bwstepname="' + car.Workflow.Steps.Step[i]["@Name"] + '" bwRoleId="' + assign2["@Role"] + '" >' + task + '</td>';
                                                        html += '<td></td>';
                                                        html += '<td class="steprowbuttons steprowcell" style="background-color:' + cellColor + ';width:80px;text-align:right;padding-right:15px;" >';
                                                        html += '  <input xcx="xcx213324-1" style="padding:5px 10px 5px 10px;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'renderEditSteprow\', \'' + xid + '\');" type="button" value="⚙ Edit">';
                                                        html += '</td>';
                                                    }
                                                    //html += '<td></td>';
                                                    //html += '<td></td>';
                                                    //html += '<td></td>';
                                                    //html += '<td></td>';

                                                    //var cond = '';
                                                    //html += '<td class="cond steprowcell" bwStepname = "' + car.Workflow.Steps.Step[i]["@Name"] + '" bwRoleId = "' + car.Workflow.Steps.Step[i].Assign["@Role"] + '" bwOldValue = "' + cond + '">' + thiz.renderTheChecklistsReadOnly(cond) + '</td>';


                                                    html += '</tr>';
                                                }

                                            } else {
















                                                //
                                                // COMMENTED OUT THIS INFORM SECTION 7-10-2023
                                                //

                                                // Display Inform roles.
                                                //if (car.Workflow.Steps.Step[i].Inform && car.Workflow.Steps.Step[i].Inform.length) {
                                                //    if (car.Workflow.Steps.Step[i].Inform.length > 0) {
                                                //        for (var j = 0; j < car.Workflow.Steps.Step[i].Inform.length; j++) {
                                                //            var xid = 'steprow-inform_' + i + '_' + j;
                                                //            var additionalRowClass = '';
                                                //            //debugger;
                                                //            if (assignmentRowChanged_ElementId) { // Todd added 11-6-19 5-18pm ast
                                                //                if (assignmentRowChanged_ElementId == xid) {
                                                //                    additionalRowClass = ' activeEditRow';
                                                //                }
                                                //            }
                                                //            html += '<tr xcx="xcx2131234-1" id="steprow-inform_' + i + '_' + j + '" class="steprow' + additionalRowClass + ' steprow_' + i + '" style="cursor:cell;display:none;" title="Double-click on this row to edit this role assignment..." >';
                                                //            //html += '  <td class="steprowbuttons steprowcell" style="background-color:' + cellColor + ';width:95px;" >';
                                                //            //html += '    <input style="padding:5px 10px 5px 10px;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'renderEditSteprow\', \'' + xid + '\');" type="button" value="Edit">';
                                                //            //html += '  </td>';
                                                //            html += '  <td style="width:30px;"></td>';

                                                //            if (thiz.options.displayRoleIdColumn) {
                                                //                if (car.Workflow.Steps.Step[i].Inform[j]) {
                                                //                    if (car.Workflow.Steps.Step[i].Inform[j]["@Role"]) {
                                                //                        html += '<td style="background-color:' + cellColor + ';" class="roleid steprowcell" bwRoleId="' + car.Workflow.Steps.Step[i].Inform[j]["@Role"] + '" bwOldValue="' + car.Workflow.Steps.Step[i].Inform[j]["@Role"] + '">' + car.Workflow.Steps.Step[i].Inform[j]["@Role"] + '</td>';
                                                //                    } else {
                                                //                        html += '<td style="background-color:' + cellColor + ';" class="roleid steprowcell" bwRoleId="' + car.Workflow.Steps.Step[i].Inform[j]["@Role"] + '" bwOldValue="' + car.Workflow.Steps.Step[i].Inform[j]["@Role"] + '">' + car.Workflow.Steps.Step[i].Inform[j]["@IdField"] + '</td>';
                                                //                    }
                                                //                }
                                                //            }

                                                //            // Todd changed 10-13-19 7-32am ast
                                                //            var roleName = '';
                                                //            var allowRequestModifications;
                                                //            var budgetThreshold;
                                                //            var instructions;
                                                //            if (car.Workflow.Steps.Step[i].Inform[j]) {
                                                //                roleName = car.Workflow.Steps.Step[i].Inform[j]["@RoleName"];
                                                //                //debugger; // AllowRequestModifications xcx2
                                                //                allowRequestModifications = car.Workflow.Steps.Step[i].Inform[j]["@AllowRequestModifications"];

                                                //                budgetThreshold = car.Workflow.Steps.Step[i].Inform[j]["@BudgetThreshold"];

                                                //                instructions = car.Workflow.Steps.Step[i].Inform[j]["@Instructions"];
                                                //            }

                                                //            if (instructions) {
                                                //                instructions = instructions.replace(/["]/g, '&quot;').replace(/[']/g, '&#39;');
                                                //            }

                                                //            html += '<td style="background-color:' + cellColor + ';" class="rolename steprowcell" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';this.style.color=\'red\';" onMouseOut="this.style.backgroundColor=\'' + cellColor + '\';this.style.color=\'black\';" bwstepname="' + car.Workflow.Steps.Step[i]["@Name"] + '" bwRoleId="' + car.Workflow.Steps.Step[i].Inform[j]["@Role"] + '" bwOldValue="' + roleName + '" bwallowrequestmodifications="' + allowRequestModifications + '" bwinstructions="' + instructions + '" bwbudgetthreshold="' + budgetThreshold + '">';



                                                //            //html += ' <img style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayPeoplePickerDialog\', \'' + 'txtApprover2FriendlyName' + '\', \'' + 'txtApprover2Id' + '\', \'' + 'txtApprover2Email' + '\');" src="images/addressbook-icon18x18.png">';
                                                //            //html += '&nbsp;' + roleName;
                                                //            html += roleName;
                                                //            html += '<br />';


                                                //            //html += allowRequestModifications + 'xcx75392385<br />';



                                                //            //if (participantId) {
                                                //            //    //html += '<span style="color:red;font-size:12pt;font-style:italic;">* no person has been assigned this rolex...</span>';
                                                //            //    html += '<span style="color:grey;font-size:12pt;font-style:italic;">[display if no people assigned this rolex]</span>';
                                                //            //}
                                                //            html += '</td>';

                                                //            html += '<td class="steprowcell">';
                                                //            html += ' <span id="rolecategory-inform_' + i + '_' + j + '" class="rolecategory" bwstepname="' + car.Workflow.Steps.Step[i]["@Name"] + '" bwRoleId="' + car.Workflow.Steps.Step[i].Inform[j]["@Role"] + '" bwOldValue="Inform" style="cursor:cell;" title="Double-click to edit the role category...">Informed</span>';
                                                //            html += '</td>';

                                                //            html += '<td></td>';

                                                //            if (car.Workflow.Steps.Step[i].Inform[j]["@Checklists"]) {
                                                //                //alert('xcx12312423-2 rendering bwoldvalue for cond');
                                                //                html += '<td class="cond steprowcell" bwStepname = "' + car.Workflow.Steps.Step[i]["@Name"] + '" bwRoleId = "' + car.Workflow.Steps.Step[i].Inform[j]["@Role"] + '" bwOldValue = "' + JSON.stringify(car.Workflow.Steps.Step[i].Inform[j]["@Checklists"]) + '">';
                                                //                var cond1 = car.Workflow.Steps.Step[i].Inform[j]["@Checklists"];
                                                //                //alert('>>>>xcx2131 cond1: ' + JSON.stringify(cond1));
                                                //                debugger;
                                                //                html += thiz.renderTheChecklistsReadOnly(cond1);

                                                //            } else {
                                                //                html += '<td>';
                                                //            }
                                                //            html += '</td>';

                                                //            html += '  <td class="steprowbuttons steprowcell" style="background-color:' + cellColor + ';width:80px;text-align:right;padding-right:15px;" >';
                                                //            html += '    <input xcx="xcx213324-2" style="padding:5px 10px 5px 10px;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'renderEditSteprow\', \'' + xid + '\');" type="button" value="⚙ Edit">';
                                                //            html += '  </td>';

                                                //            html += '</tr>';
                                                //        }
                                                //    }
                                                //}

                                                //
                                                // end: COMMENTED OUT THIS INFORM SECTION 7-10-2023
                                                //

















                                                // Display Assign roles.
                                                if (car.Workflow.Steps.Step[i].Assign) {
                                                    if (car.Workflow.Steps.Step[i].Assign.length > 0) {
                                                        for (var j = 0; j < car.Workflow.Steps.Step[i].Assign.length; j++) {


                                                            //debugger;

                                                            var xid = 'steprow-assign_' + i + '_' + j;
                                                            var additionalRowClass = '';
                                                            if (assignmentRowChanged_ElementId == xid) {
                                                                additionalRowClass = ' activeEditRow';
                                                            }
                                                            html += '<tr xcx="xcx2131234-2" id="steprow-assign_' + i + '_' + j + '" class="steprow' + additionalRowClass + ' steprow_' + i + '" style="cursor:cell;display:none;" title="Double-click on this row to edit this role assignment..." >';

                                                            //html += '<td class="steprowbuttons steprowcell" style="background-color:' + cellColor + ';width:95px;" >';
                                                            //html += '  <input style="padding:5px 10px 5px 10px;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'renderEditSteprow\', \'' + xid + '\');" type="button" value="Edit">';
                                                            //html += '</td>';
                                                            html += '  <td style="width:30px;"></td>';

                                                            if (thiz.options.displayRoleIdColumn) {
                                                                html += '<td style="background-color:' + cellColor + ';" class="roleid steprowcell" bwRoleId="' + car.Workflow.Steps.Step[i].Assign[j]["@Role"] + '" bwOldValue="' + car.Workflow.Steps.Step[i].Assign[j]["@Role"] + '">' + car.Workflow.Steps.Step[i].Assign[j]["@Role"] + '</td>';
                                                            }

                                                            // Todd changed 10-13-19 7-32am ast
                                                            var roleName = '';
                                                            var allowRequestModifications;
                                                            //var budgetThresholdEnabled = false;
                                                            var budgetThreshold = 0;
                                                            var instructions;
                                                            if (car.Workflow.Steps.Step[i].Assign[j]) {
                                                                roleName = car.Workflow.Steps.Step[i].Assign[j]["@RoleName"];
                                                                //debugger; // AllowRequestModifications xcx3
                                                                allowRequestModifications = car.Workflow.Steps.Step[i].Assign[j]["@AllowRequestModifications"];

                                                                budgetThreshold = car.Workflow.Steps.Step[i].Assign[j]["@BudgetThreshold"];

                                                                instructions = car.Workflow.Steps.Step[i].Assign[j]["@Instructions"];
                                                            }
                                                            //var roleName = '';
                                                            //for (var r = 0; r < roles.length; r++) {
                                                            //    if (car.Workflow.Steps.Step[i].Assign[j]["@Role"] == roles[r].RoleId) {
                                                            //        roleName = roles[r].RoleName;
                                                            //    }
                                                            //}
                                                            if (instructions) {
                                                                instructions = instructions.replace(/["]/g, '&quot;').replace(/[']/g, '&#39;');
                                                            }
                                                            html += '<td style="background-color:' + cellColor + ';" class="rolename steprowcell" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';this.style.color=\'red\';" onMouseOut="this.style.backgroundColor=\'' + cellColor + '\';this.style.color=\'black\';" bwstepname="' + car.Workflow.Steps.Step[i]["@Name"] + '" bwRoleId="' + car.Workflow.Steps.Step[i].Assign[j]["@Role"] + '" bwOldValue="' + roleName + '" bwallowrequestmodifications="' + allowRequestModifications + '" bwinstructions="' + instructions + '" bwbudgetthreshold="' + budgetThreshold + '">';
                                                            //html += ' <img style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayPeoplePickerDialog\', \'' + 'txtApprover2FriendlyName' + '\', \'' + 'txtApprover2Id' + '\', \'' + 'txtApprover2Email' + '\');" src="images/addressbook-icon18x18.png">';
                                                            //html += '&nbsp;' + roleName;
                                                            html += roleName;
                                                            html += '<br />';






                                                            // FIX THIS!! 7-7-2020
                                                            html += '<span style="font-size:15pt;color:green;font-weight:bold;">$</span>' + '&nbsp;<span style="font-size:8pt;">Only participate for amounts over ' + bwCommonScripts.getBudgetWorkflowStandardizedCurrencyWithoutDollarSign(budgetThreshold) + '.</span><br />';











                                                            if (!allowRequestModifications) {
                                                                html += '<span style="color:red;">✖</span>' + '&nbsp;<span style="font-size:8pt;">Can\'t modify the request.</span><br />';
                                                            } else {
                                                                html += '<span style="">✔</span>' + '&nbsp;<span style="font-size:8pt;">Can modify the request.</span><br />';
                                                            }



                                                            //if (participantId) {
                                                            //    //html += '<span style="color:red;font-size:12pt;font-style:italic;">* no person has been assigned this roley...</span>';
                                                            //    html += '<span style="color:grey;font-size:12pt;font-style:italic;">[display if no people assigned this role]</span>';
                                                            //}
                                                            html += '</td>';

                                                            html += '<td class="steprowcell">';
                                                            html += ' <span id="rolecategory-assign_' + i + '_' + j + '" class="rolecategory" bwstepname="' + car.Workflow.Steps.Step[i]["@Name"] + '" bwRoleId="' + car.Workflow.Steps.Step[i].Assign[j]["@Role"] + '" bwOldValue="' + car.Workflow.Steps.Step[i].Assign[j]["@RoleCategory"] + '" style="cursor:cell;" title="Double-click to edit the role category...">';
                                                            html += car.Workflow.Steps.Step[i].Assign[j]["@RoleCategory"];
                                                            html += ' </span>';
                                                            html += '</td>';








                                                            //
                                                            // Task(s)/Action(s). Only the Approver gets these... Informed and Collaborators do are not able to Approve, Reject etc. The Collaborator can make comments and publish changes to a request, but not take an action on it like an Approver can.
                                                            // A Collaborator is allowed to fill out Checklists as well. 12-8-2021
                                                            //
                                                            var oldValue = '';
                                                            var tasks = '';
                                                            var tmpRoleCategory = car.Workflow.Steps.Step[i].Assign[j]["@RoleCategory"];



                                                            //alert('xcx333334 tmpRoleCategory: ' + tmpRoleCategory); // ADDED 7-10-2023

                                                            if ((tmpRoleCategory == 'Approver') || (tmpRoleCategory == 'Collaborator')) { // 4-20-2022 added Collaborator
                                                                if (car.Workflow.Steps.Step[i].Assign[j].Action) {
                                                                    for (var t = 0; t < car.Workflow.Steps.Step[i].Assign[j].Action.length; t++) {

                                                                        ////debugger;
                                                                        //// for example: elementId = 'steprow-assign_3_0'
                                                                        //var actionChecked = false;
                                                                        //var elementId = 'steprow-assign_' + i + '_' + j; //steprow-assign_4_0
                                                                        //var tasks = $('#' + elementId).find('.tasks').attr('bwoldvalue');
                                                                        //if (tasks) {
                                                                        //    debugger
                                                                        //    for (var t = 0; t < tasks.split('|').length; t++) {
                                                                        //        var x = tasks.split('|')[t];
                                                                        //        var task = x.split('~')[0];
                                                                        //        //var requireComments = x.split('~')[1];
                                                                        //        if (task == actions[i]) {
                                                                        //            actionChecked = true;
                                                                        //            //if (requireComments && Boolean(requireComments.toLowerCase()) == true) {
                                                                        //            //    requireCommentsChecked = true;
                                                                        //            //}
                                                                        //        }
                                                                        //    }
                                                                        //} else {
                                                                        //    //debugger;
                                                                        //}
                                                                        //if (actionChecked == true) { // only display selected ones! 
                                                                        //debugger;
                                                                        //if (true) {


                                                                        var tmpRequireComments = '';

                                                                        if (car.Workflow.Steps.Step[i].Assign[j].Action[t]["@RequireComments"]) tmpRequireComments = car.Workflow.Steps.Step[i].Assign[j].Action[t]["@RequireComments"];
                                                                        oldValue += car.Workflow.Steps.Step[i].Assign[j].Action[t]["@Name"] + '~' + tmpRequireComments + '|'; // Using these for a delimiter since there are several values: "~', "|"


                                                                        tasks += '•&nbsp;<span style="white-space:nowrap;">' + car.Workflow.Steps.Step[i].Assign[j].Action[t]["@Name"];
                                                                        tasks += '<br />';

                                                                        //if (car.Workflow.Steps.Step[i].Assign[j].Action[t]["@RequireComments"]) {
                                                                        //    var requireComments = Boolean(car.Workflow.Steps.Step[i].Assign[j].Action[t]["@RequireComments"].toLowerCase());
                                                                        //    if (requireComments) {
                                                                        //        tasks += ' - <input type="checkbox" onclick="return false;" checked />&nbsp;<span style="font-style:italic;">comments requiredvvv</span></span><br />'; // Yes, comments are required.
                                                                        //    } else {
                                                                        //        tasks += ' - <input type="checkbox" onclick="return false;" />&nbsp;<span style="font-style:italic;">comments requiredvv</span></span><br />'; // No comments required.
                                                                        //    }
                                                                        //} else {
                                                                        //tasks += ' - <input type="checkbox" onclick="return false;" />&nbsp;<span style="font-style:italic;">comments requiredv</span></span><br />'; // No comments required.
                                                                        //}
                                                                        //}



                                                                    }
                                                                }
                                                            }
                                                            html += '<td class="tasks steprowcell" bwstepname="' + car.Workflow.Steps.Step[i]["@Name"] + '" bwRoleId="' + car.Workflow.Steps.Step[i].Assign[j]["@Role"] + '" bwOldValue="' + oldValue + '">' + tasks + '</td>';

                                                            //html += '<td></td>';
                                                            //html += '<td></td>';
                                                            //html += '<td></td>';
                                                            //html += '<td></td>';

                                                            //var timeout = '';
                                                            //if (car.Workflow.Steps.Step[i].Assign[j]["@Timeout"] && car.Workflow.Steps.Step[i].Assign[j]["@Timeout"].length > 0) {
                                                            //    // This decides whether to display the timeout in minutes or days.
                                                            //    var timeoutMinutes = car.Workflow.Steps.Step[i].Assign[j]["@Timeout"];
                                                            //    var timeoutDays;
                                                            //    if (timeoutMinutes > 720) {
                                                            //        var minutesInASingleDay = 1440;
                                                            //        timeoutDays = timeoutMinutes / minutesInASingleDay;;
                                                            //    }
                                                            //    if (timeoutDays) {
                                                            //        timeout += timeoutDays;
                                                            //        timeout += ' days';
                                                            //    } else {
                                                            //        timeout += timeoutMinutes;
                                                            //        timeout += ' minutes';
                                                            //    }
                                                            //}
                                                            //html += '<td class="timeout steprowcell" bwstepname="' + car.Workflow.Steps.Step[i]["@Name"] + '" bwRoleId="' + car.Workflow.Steps.Step[i].Assign[j]["@Role"] + '" bwOldValue="' + timeout + '">' + timeout + '</td>';








                                                            //debugger; // WE NEED TO BE GETTING THIS HERE. it must mean that the workflow is not getting saved??
                                                            var cond = '';
                                                            if (car.Workflow.Steps.Step[i].Assign[j]["@Checklists"]) {
                                                                //alert('xcxsafdsdgfdsggdfgafdsz JSON.stringify(car.Workflow.Steps.Step[i].Assign[j]["@Checklists"]: ' + JSON.stringify(car.Workflow.Steps.Step[i].Assign[j]["@Checklists"]));
                                                                try {

                                                                    JSON.parse(JSON.stringify(car.Workflow.Steps.Step[i].Assign[j]["@Checklists"])); // Doing this first to ensure that we have good Json. This will cause an exception if it does not.
                                                                    //var strCond = JSON.stringify(car.Workflow.Steps.Step[i].Assign[j]["@Checklists"]);
                                                                    //cond = escape(strCond);
                                                                    cond = car.Workflow.Steps.Step[i].Assign[j]["@Checklists"];

                                                                } catch (e) {

                                                                    displayAlertDialog('The checklist JSON is invalid. The checklists will be reset so that the process can continue.');
                                                                    car.Workflow.Steps.Step[i].Assign[j]["@Checklists"] = [];
                                                                    cond = [];

                                                                }

                                                            }

                                                            if (!cond) {
                                                                html += '<td class="cond steprowcell" bwStepname = "' + car.Workflow.Steps.Step[i]["@Name"] + '" bwRoleId = "' + car.Workflow.Steps.Step[i].Assign[j]["@Role"] + '" bwOldValue = "' + cond + '">' + '' + '</td>';
                                                            } else {
                                                                html += '<td class="cond steprowcell" bwStepname = "' + car.Workflow.Steps.Step[i]["@Name"] + '" bwRoleId = "' + car.Workflow.Steps.Step[i].Assign[j]["@Role"] + '" bwOldValue = "' + cond + '">' + thiz.renderTheChecklistsReadOnly(cond) + '</td>';
                                                            }

                                                            html += '<td class="steprowbuttons steprowcell" style="background-color:' + cellColor + ';width:80px;text-align:right;padding-right:15px;" >';
                                                            html += '  <input xcx="xcx213324-3" style="padding:5px 10px 5px 10px;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'renderEditSteprow\', \'' + xid + '\');" type="button" value="⚙ Edit">';
                                                            html += '</td>';

                                                            html += '</tr>';
                                                        }
                                                    }
                                                }
                                            } // ?????
                                            html += '</tr>';
                                        }
                                    }
                                }
                                html += '</table>';








                                //THIS IS WHERE THE TABLE GOES
                                //<br /><br /><br /><br /><br /><br />
                                html += '</span>';
                                html += '</td>';
                                html += '</tr>';
                                html += '</table>';
                                html += '</td>';
                                html += '<td class="rightSliderPanel" style="vertical-align:top;"></td>';
                                html += '</tr>';
                                html += '</table>';
                                html += '</div>';

                                document.getElementById('spanWorkflowEditor_SelectedWorkflow').innerHTML = html;

                                $('#spanWorkflowEditor_SelectedWorkflow').find('#bwworkflow')[0].setAttribute('bwrequesttype', car.bwRequestType);
                                $('#spanWorkflowEditor_SelectedWorkflow').find('#bwworkflow')[0].setAttribute('bwworkflowid', car.bwWorkflowId);

                                thiz.checkIfWeHaveToDisplayThePublishChangesButton();

                                thiz.expandOrCollapseSliderPanel(); // This makes the email editor display by default. added 9-29-2020




                                if (expandedStepIndex) {

                                    console.log('In bwWorkflowEditor.js.renderWorkflowEditor2(). expandedStepIndex exists, so expanding this step. expandedStepIndex: ' + expandedStepIndex);
                                    var stepName = thiz.options.CurrentWorkflow.DraftWorkflow.Steps.Step[expandedStepIndex]["@Name"];
                                    var rowId = 'stepname_' + expandedStepIndex;
                                    var imageId = 'stepimage_' + expandedStepIndex;
                                    var collapsibleRowId = 'steprow-' + stepName.toLowerCase() + '_' + expandedStepIndex + '_' + '0';
                                    //alert('In bwWorkflowEditor.js.renderWorkflowEditor2(). Calling expandOrCollapseWorkflowStep: rowId: ' + rowId + ', imageId: ' + imageId + ', collapsibleRowId: ' + collapsibleRowId);
                                    thiz.expandOrCollapseWorkflowStep(rowId, imageId, collapsibleRowId, 'expand');

                                }














                                //if (thiz.options.DisplayAsNewTenantUserConfigurationEditor != true) {
                                // RIGHT-CLICK FUNCTIONALITY!!
                                // This is our ellipsis context menu. MIT license and code at: https://swisnl.github.io/jQuery-contextMenu/demo/trigger-custom.html // event.stopImmediatePropagation()

                                var buttons = document.getElementsByClassName('context_menu_workfloweditor_main');
                                for (var i = 0; i < buttons.length; i++) {
                                    $(buttons[i]).on('click', function (e) {
                                        e.preventDefault();
                                        e.stopImmediatePropagation();
                                        $(this).contextMenu();
                                        // or $('.context-menu-one').trigger("contextmenu");
                                        // or $('.context-menu-one').contextMenu({x: 100, y: 100});
                                    });
                                }

                                $.contextMenu({
                                    selector: '.context_menu_workfloweditor_main',
                                    //trigger: 'hover',
                                    //    delay : 500,
                                    callback: function (key, options) {
                                        if (key == 'workflowjson') {
                                            thiz.displayEditWorkflowJsonDialog2(); // 2-9-2022 1pm adt
                                        } else if (key == 'addaworkflowstep') {
                                            thiz.addNewWorkflowStep($(this).attr('id'));
                                        }
                                    },
                                    items: {
                                        "workflowjson": {
                                            name: "View Workflow JSON", icon: "edit"
                                        },
                                        "addaworkflowstep": {
                                            name: "Add a New Workflow Step", icon: "edit"
                                        }
                                    }
                                });

                                var buttons = document.getElementsByClassName('context-menu-workflowstep2');
                                for (var i = 0; i < buttons.length; i++) {
                                    $(buttons[i]).on('click', function (e) {
                                        e.preventDefault();
                                        e.stopImmediatePropagation();
                                        $(this).contextMenu();
                                        // or $('.context-menu-one').trigger("contextmenu");
                                        // or $('.context-menu-one').contextMenu({x: 100, y: 100});
                                    });
                                }

                                $.contextMenu({
                                    selector: '.context-menu-workflowstep2',
                                    //trigger: 'hover',
                                    //    delay : 500,
                                    callback: function (key, options) {
                                        //var m = "clicked: " + key;
                                        //window.console && console.log(m) || alert(m);
                                        if (key == 'addaroleparticipant') {
                                            //cmdDisplayArchivePageTrashbinContents();
                                            thiz.addARoleParticipant($(this).attr('id'));
                                        } else if (key == 'editstepname') {
                                            //cmdDisplayArchivePageTrashbinContents();
                                            thiz.displayEditStepNameDialog($(this).attr('id'));
                                        } else if (key == 'editsteptype') {
                                            //cmdDisplayArchivePageTrashbinContents();
                                            thiz.displayEditStepTypeDialog($(this).attr('id'));
                                            //alert('This functionality is incomplete. xcx555444333');
                                        } else if (key == 'deletethisstep') {
                                            thiz.deleteStep($(this).attr('id'));
                                            //cmdDisplayArchivePageExtendedInformation();
                                        } else if (key == 'addastepbelow') {
                                            thiz.addNewWorkflowStep($(this).attr('id'));
                                        } else if (key == 'movestepup') {
                                            thiz.moveStepUp(this);
                                        } else if (key == 'movestepdown') {
                                            thiz.moveStepDown(this);
                                        }
                                    },
                                    items: {
                                        //"addaroleparticipant": {
                                        //    name: "Add a Role/Participant", icon: "edit"
                                        //},
                                        //"sep1": "---------",
                                        "editstepname": {
                                            name: "Edit Step Name", icon: "fa-trash"
                                        }, // images/trash-can.png  // 🗑
                                        "editsteptype": {
                                            name: "Edit Step Type", icon: "fa-trash"
                                        }, // images/trash-can.png  // 🗑
                                        "sep3-2": "---------",
                                        "deletethisstep": {
                                            name: "Delete this Step", icon: "edit"
                                        },
                                        "addastepbelow": {
                                            name: "Add a New Workflow Step", icon: "edit"
                                        },
                                        //"addarevisestep": {
                                        //    name: "Add a \"Revise\" Workflow Step", icon: "edit"
                                        //},
                                        "sep2": "---------",
                                        "movestepup": {
                                            name: "Move Step Up", icon: "edit"
                                        },
                                        "movestepdown": {
                                            name: "Move Step Down", icon: "edit"
                                        },
                                        //"sep3": "---------",
                                        //"viewextendedinformation3": {
                                        //    name: "Edit Timeframe Preferences", icon: "edit"
                                        //}

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
                                //}





                                //$('#spanConfigurationOrganizationAdditionalOptionsEllipsis').on('click', function (e) {
                                //    e.preventDefault();
                                //    var x = e.clientX;
                                //    var y = e.clientY;
                                //    //$('.context-menu-one').contextMenu({ x: x, y: y });
                                //    $('.context-menu-one').contextMenu(); //{ x: x, y: y }); // specifying x and y here doesn't work for left click. We need to get the left click position workng at some point but no biggie at this time.

                                //    // or $('.context-menu-one').trigger("contextmenu");
                                //    // or $('.context-menu-one').contextMenu({x: 100, y: 100});
                                //});
                                //$('.context-menu-workflowstep').on('click', function (e) {
                                //    //console.log('clicked', this);
                                //    if (this == 'viewtrashbincontents') {
                                //        alert('This functionality is incomplete. Coming soon!');
                                //    } else if (this == 'viewextendedinformation') {
                                //        alert('This functionality is incomplete. Coming soon!');
                                //    } //else {
                                //    //alert('Error: Unexpected value for context menu.');
                                //    //}
                                //})
                                // End: This is our ellipsis context menu.

















                                //$('.buttonAddNewAssignmentRow').attr('disabled', false); // Enable these buttons by default.
                                //thiz.enableButton('buttonAddNewAssignmentRow');
                                //var x = document.getElementsByClassName('buttonAddNewAssignmentRow'); //.createAttribute('disabled');
                                //for (var i = 0; i < x.length; i++) {
                                //    x.createAttribute('disabled');
                                //}

                                // Now we have to iterate through and connect all of the double-click events.
                                var steps = document.getElementsByClassName('stepname');
                                //for (var i = 0; i < steps.length; i++) {
                                var steprows = document.getElementsByClassName('steprow');
                                for (var j = 0; j < steprows.length; j++) {
                                    var workflowAssignmentRow = $("#" + steprows[j].id).closest('tr');
                                    //console.log('Attaching double-click event to: ' + $("#" + steprows[j].id).closest('tr').attr('id'));
                                    workflowAssignmentRow.dblclick(function () {
                                        try {
                                            thiz.renderEditSteprow(this.id);

                                            ////thiz.showProgress('Loading...');
                                            //$('.activeEditRow').remove(); // This gets rid of the row editor... we should only display one at a time.
                                            //$('.steprow-hidden').removeClass('steprow-hidden'); // Display the previous row again (if there is one).
                                            //// Get the values from the hidden row.
                                            //var roleid = $('#' + this.id).find('.roleid').attr('bwOldValue');
                                            //var rolename = $('#' + this.id).find('.rolename').attr('bwOldValue');
                                            //var rolecategory = $('#' + this.id).find('.rolecategory').attr('bwOldValue');
                                            //var tasks = $('#' + this.id).find('.tasks').attr('bwOldValue');
                                            //var timeout = $('#' + this.id).find('.timeout').attr('bwOldValue');
                                            //var cond = $('#' + this.id).find('.cond').attr('bwOldValue');
                                            //console.log('In raci.html._create().renderRaci.dblclick(). i: ' + i + ', j: ' + j + ', roleid: ' + roleid + ', rolename: ' + rolename + ', rolecategory: ' + rolecategory + ', tasks: ' + tasks + ', timeout: ' + timeout + ', cond: ' + cond);
                                            ////
                                            //var html = '';
                                            //html += '<tr class="activeEditRow">';
                                            ////
                                            //html += '<td style="vertical-align:top;">';

                                            //html += '  <table style="width:100%;">';
                                            //html += '  <tr>';
                                            //html += '    <td>';
                                            //html += '      <input type="button" style="width:100%;" value="Save" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveAssignmentRow\', \'' + this.id + '\');" />';
                                            //html += '    </td>';
                                            //html += '  </tr>';
                                            //html += '  <tr>';
                                            //html += '    <td>';
                                            //html += '      <input type="button" style="width:100%;" value="Delete" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'deleteRoleCategory\', \'' + this.id + '\');" />';
                                            //html += '    </td>';
                                            //html += '  </tr>';
                                            //html += '  <tr>';
                                            //html += '    <td>';
                                            //html += '      <input type="button" style="width:100%;" value="Cancel" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'cancelStepRowEditing\', \'' + this.id + '\');" />';
                                            //html += '    </td>';
                                            //html += '  </tr>';
                                            //html += '  <tr>';
                                            //html += '    <td>';
                                            //html += '      <input type="button" style="width:100px;white-space:normal;overflow-wrap:break-word;" value="Configure Email Notifications" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayConfigureEmailNotificationsDialog\', \'' + this.id + '\');" />';
                                            //html += '    </td>';
                                            //html += '  </tr>';
                                            //html += '  </table>';

                                            //html += '</td>';
                                            ////

                                            //if (thiz.options.displayRoleIdColumn) {
                                            //    html += '<td class="steprowcell">' + roleid + '</td>';
                                            //}





                                            //html += '<td class="selectroleorperson-editcell steprowcell">';
                                            ////html += ' <img style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayPeoplePickerDialog\', \'' + 'txtApprover2FriendlyName' + '\', \'' + 'txtApprover2Id' + '\', \'' + 'txtApprover2Email' + '\');" src="images/addressbook-icon18x18.png">';
                                            ////html += '&nbsp;' + rolename;
                                            //html += '</td>';







                                            //// Render the "RoleCategory" drop-down.
                                            //html += '<td class="steprowcell">';
                                            //html += '<select style="padding:5px 5px 5px 5px;" id="selectRoleCategory" class="rolecategory-dropdown" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'RoleCategoryDropDown_Onchange\', \'' + this.id + '\');">';
                                            //var rcs = ['Inform', 'Collaborator', 'Approver'];
                                            //var rcs2 = ['Inform (Informed)', 'Collaborator (Consulted)', 'Approver (Accountable)'];
                                            //for (var rci = 0; rci < rcs.length; rci++) {
                                            //    if (rolecategory == rcs[rci]) {
                                            //        html += '  <option value="' + rcs[rci] + '" selected>' + rcs2[rci] + '</option>';
                                            //    } else {
                                            //        html += '  <option value="' + rcs[rci] + '">' + rcs2[rci] + '</option>';
                                            //    }
                                            //}
                                            //html += '</select>';
                                            //html += '</td>';

                                            //html += '<td class="actions-editcell steprowcell"></td>';
                                            //// This gets render below using thiz.renderActionsSection(); It gets populated there as well.

                                            ////html += '<td></td>';
                                            ////html += '<td></td>';
                                            ////html += '<td></td>';
                                            ////html += '<td></td>';

                                            ////html += '<td class="timeout-editcell steprowcell"></td>';

                                            //html += '<td class="conditions-editcell steprowcell"></td>';

                                            //html += '</tr>';

                                            //var elementId = this.id;
                                            //thiz.disableScrolling(); // This keeps the screen from jumping around.

                                            //$('#' + elementId).closest('tr').after(html); // Render the whole thing




                                            //thiz.renderSelectRoleOrPersonSection(elementId);




                                            //// BEGIN: Populate the actions section (check the checkboxes).
                                            //thiz.renderActionsSection(elementId); // render the actions section
                                            //if (rolecategory == 'Approver') { // Populate the actions ection
                                            //    var actions = ['Approve', 'Cancel', 'Decline', 'Revise/Hold'];
                                            //    var x = elementId.split('_')[1];
                                            //    var step = x.split('_')[0];
                                            //    var row = elementId.split('_')[2];
                                            //    for (var i = 0; i < actions.length; i++) {
                                            //        var actionChecked = false;
                                            //        var requireCommentsChecked = false;
                                            //        if (tasks) {
                                            //            for (var t = 0; t < tasks.split('|').length; t++) {
                                            //                var x = tasks.split('|')[t];
                                            //                var task = x.split('~')[0];
                                            //                var requireComments = x.split('~')[1];
                                            //                if (task == actions[i]) {
                                            //                    actionChecked = true;
                                            //                    if (requireComments && Boolean(requireComments.toLowerCase()) == true) {
                                            //                        requireCommentsChecked = true;
                                            //                    }
                                            //                }
                                            //            }
                                            //        }

                                            //        var checkboxId = 'Action-' + actions[i] + '_' + step + '_' + row;
                                            //        var childCheckboxId = 'RequireComments-' + actions[i] + '_' + step + '_' + row;
                                            //        if (actionChecked) {
                                            //            document.getElementById(checkboxId).checked = true;
                                            //            if (requireCommentsChecked) {
                                            //                document.getElementById(childCheckboxId).checked = true;
                                            //            }
                                            //        } else {
                                            //            document.getElementById(checkboxId).checked = false;
                                            //            document.getElementById(childCheckboxId).checked = false;
                                            //        }
                                            //    }
                                            //}
                                            //// END: Render and Populate the actions section

                                            ////thiz.renderTimeoutSection(elementId);
                                            ////debugger;
                                            //thiz.renderConditionsSection(elementId, cond);

                                            //$('#' + elementId).addClass('steprow-hidden'); // Hide the row while we display it in editable-mode. This allows us to display it again when done editng, and also gives us a place to look up the old values.
                                            //thiz.enableScrolling(); // This keeps the screen from jumping around.
                                            ////thiz.hideProgress();
                                        } catch (e) {
                                            //thiz.hideProgress();
                                            console.log('Exception in raci.html._create().renderWorkflowEditor.dblclick(): ' + e.message + ', ' + e.stack);
                                        }
                                    });
                                }
                            }
                        } catch (e) {
                            //lpSpinner.Hide();
                            console.log('Exception in renderWorkflowEditor2: ' + e.message + ', ' + e.stack);

                            displayAlertDialog('Exception in renderWorkflowEditor2:xcx444: ' + e.message + ', ' + e.stack);

                            var html = '';
                            html += 'Exception in renderWorkflowEditor2: ' + e.message + ', ' + e.stack;
                            document.getElementById('spanWorkflowEditor_SelectedWorkflow').innerHTML = html;
                        }
                    },
                    error: function (data) {
                        var msg;
                        if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                            msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                        } else {
                            msg = JSON.stringify(data);
                        }
                        alert('Error in bwWorkflowEditor.js.renderWorkflowEditor2._bw/Roles.error(): ' + msg); 
                        console.log('Error in bwWorkflowEditor.js.renderWorkflowEditor2._bw/Roles.error(): ' + JSON.stringify(data));
                     }
                });
                
            }
        } catch (e) {
            console.log('EXCEPTION IN renderWorkflowEditor2: ' + e.message + ', ' + e.stack);
            displayAlertDialog('EXCEPTION IN renderWorkflowEditor2: ' + e.message + ', ' + e.stack);
        }
    },







    toggleWorkflowConfigurationCheckboxes: function (element) {
        try {
            // This is the top checkbox which the user can use to toggle all of the subsequent checkboxes on or off.
            console.log('In toggleWorkflowConfigurationCheckboxes().');
            var checkboxes = document.getElementsByClassName('workflowCheckbox');
            if (element.checked == true) {
                for (var i = 0; i < checkboxes.length; i++) {
                    if (!checkboxes[i].disabled) {
                        checkboxes[i].checked = true;
                    }
                }
            } else if (element.checked == false) {
                for (var i = 0; i < checkboxes.length; i++) {
                    if (!checkboxes[i].disabled) {
                        checkboxes[i].checked = false;
                    }
                }
            }
        } catch (e) {
            console.log('Exception in toggleWorkflowConfigurationCheckboxes(): ' + e.message + ', ' + e.stack);
        }
    },
    cmdDisplayDeleteWorkflowsDialog: function () {
        try {
            console.log('In cmdDisplayDeleteWorkflowsDialog().');
            //debugger;
            $("#divDeleteWorkflowsDialog").dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '500',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divDeleteWorkflowsDialog").dialog('close');
                    });
                },
                close: function () {
                    $('#divDeleteWorkflowsDialog').dialog('destroy');
                }
            });
            $("#divDeleteWorkflowsDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            var workflows = document.getElementsByClassName('workflowCheckbox');
            var selectedWorkflows = [];
            for (var i = 0; i < workflows.length; i++) {
                if (workflows[i].checked) {
                    selectedWorkflows.push(workflows);
                }
            }
            if (selectedWorkflows.length == 0) {
                var html = '';
                html += 'You have not selected any workflows to delete. You have to select at least 1.';
                document.getElementById('spanDeleteWorkflowsDialogContentText').innerHTML = html;
            } else {
                var html = '';
                html += 'You have chosen to delete ' + selectedWorkflows.length + ' workflows. This action cannot be undone.';
                document.getElementById('spanDeleteWorkflowsDialogContentText').innerHTML = html;
            }

        } catch (e) {
            console.log('Exception in cmdDisplayDeleteWorkflowsDialog(): ' + e.message + ', ' + e.stack);
        }
    },
    deleteSelectedWorkflows: function () {
        try {
            console.log('In deleteSelectedWorkflows().');
            var thiz = this;
            var selectedWorkflowsToDelete = [];
            var workflows = document.getElementsByClassName('workflowCheckbox');
            for (var i = 0; i < workflows.length; i++) {
                if (workflows[i].checked == true) {
                    var bwworkflowid = workflows[i].getAttribute('bwworkflowid');
                    selectedWorkflowsToDelete.push(bwworkflowid);
                } else {
                    // do nothing.
                }
            }
            var json = {
                bwWorkflowIds: selectedWorkflowsToDelete
            }
            alert('In deleteSelectedWorkflows(). CANNOT DELETE. WE NEED TO VERIFY THAT THE WORKFLOW HAS NO RELATED REQUESTS WHICH MAY BE ORPHANED. COMING SOON!'); //Getting ready to delete ' + selectedWorkflowsToDelete.length + ' workflows. This action cannot be undone. This functionality is incomplete and needs further testing!!!!');
            //$.ajax({
            //    url: this.options.operationUriPrefix + "_bw/deleteworkflows",
            //    dataType: "json",
            //    contentType: "application/json",
            //    type: "Post",
            //    data: JSON.stringify(json)
            //}).done(function (result) {
            //    try {
            //        console.log('In deleteSelectedWorkflows(): Successfully updated DB.');
            //        $("#divMessageDialog").dialog({
            //            modal: true,
            //            resizable: false,
            //            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
            //            width: '900',
            //            dialogClass: 'no-close', // No close button in the upper right corner.
            //            hide: false, // This means when hiding just disappear with no effects.
            //            open: function () {
            //                $('#divDeleteWorkflowsDialog').dialog('close');
            //                $('.ui-widget-overlay').bind('click', function () {
            //                    $('#divMessageDialog').dialog('close');
            //                });
            //                document.getElementById('spanMessageDialogTitle').innerHTML = 'Workflows DELETED';
            //                document.getElementById('spanMessageDialogContentTop').innerHTML = 'These workflows have been deleted.';

            //                thiz.displayWorkflowsConfigurationDialog();

            //            },
            //            close: function () {
            //                //location.reload(); // When the user closes this dialog, we regenerate the screen to reflect the newly created and activated workflow.
            //            }
            //        });
            //        $('#divMessageDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
            //    } catch (e) {
            //        console.log('Exception in deleteSelectedWorkflows():2: ' + e.message + ', ' + e.stack);
            //    }
            //}).fail(function (data) {
            //    //debugger;
            //    var msg;
            //    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
            //        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
            //    } else {
            //        msg = JSON.stringify(data) + ', json: ' + JSON.stringify(selectedPendingEmailIdsToDelete);
            //    }
            //    alert('Fail in deleteSelectedWorkflows(): ' + msg); //+ error.message.value + ' ' + error.innererror.message);
            //    console.log('Fail in deleteSelectedWorkflows(): ' + JSON.stringify(data) + ', json: ' + JSON.stringify(selectedPendingEmailIdsToDelete));
            //    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
            //    //var error = JSON.parse(data.responseText)["odata.error"];
            //    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            //});
        } catch (e) {
            console.log('Exception in deleteSelectedWorkflows(): ' + e.message + ', ' + e.stack);
        }
    },



    moveStepUp: function (element) {
        try {
            console.log('In bwWorkflowEditor.js.moveStepUp().');

            var tableRow = $(element).closest('.stepheadercell')[0];
            if (!tableRow) {

                displayAlertDialog('Error in bwWorkflowEditor.js.moveStepUp(). Unexpected null value for .stepheadercell.');

            } else {

                var spanStepName = $(tableRow).find('.stepname')[0];
                if (!spanStepName) {

                    displayAlertDialog('Error in bwWorkflowEditor.js.moveStepUp(). Unexpected null value for .stepname.');

                } else {

                    var id = $(spanStepName)[0].id;
                    if (!id) {

                        displayAlertDialog('Error in bwWorkflowEditor.js.moveStepUp(). Unexpected null value for id.');

                    } else {
                        debugger;
                        var stepIndex = Number(id.split('stepname_')[1]);

                        alert('stepIndex: ' + stepIndex);

                        if (stepIndex <= 1) {

                            // This step cannot move down another step. We are at the bottom.
                            displayAlertDialog('This step cannot move down up step. It is at the top.');

                        } else {

                            var workflowStepJson = this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex];
                            this.options.CurrentWorkflow.DraftWorkflow.Steps.Step.splice(stepIndex, 1); // delete leaves a null, so we have to use splice.
                            this.options.CurrentWorkflow.DraftWorkflow.Steps.Step.splice(stepIndex - 1, 0, workflowStepJson); // reinsert the step

                            this.element.html(this.renderWorkflowEditor2()); // Render the Workflow Editor. 

                        }

                    }
                }
            }

        } catch (e) {
            console.log('Exception in bwWorkflowEditor.js.moveStepUp(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwWorkflowEditor.js.moveStepUp(): ' + e.message + ', ' + e.stack);
        }
    },
    moveStepDown: function (element) {
        try {
            console.log('In bwWorkflowEditor.js.moveStepDown().');

            var tableRow = $(element).closest('.stepheadercell')[0];
            if (!tableRow) {

                displayAlertDialog('Error in bwWorkflowEditor.js.moveStepDown(). Unexpected null value for .stepheadercell.');

            } else {

                var spanStepName = $(tableRow).find('.stepname')[0];
                if (!spanStepName) {

                    displayAlertDialog('Error in bwWorkflowEditor.js.moveStepDown(). Unexpected null value for .stepname.');

                } else {

                    var id = $(spanStepName)[0].id;
                    if (!id) {

                        displayAlertDialog('Error in bwWorkflowEditor.js.moveStepDown(). Unexpected null value for id.');

                    } else {
                        debugger;
                        var stepIndex = Number(id.split('stepname_')[1]);

                        if ((stepIndex + 1) == this.options.CurrentWorkflow.DraftWorkflow.Steps.Step.length) {

                            // This step cannot move down another step. We are at the bottom.
                            displayAlertDialog('This step cannot move down another step. It is at the bottom.');

                        } else {

                            var workflowStepJson = this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex];
                            this.options.CurrentWorkflow.DraftWorkflow.Steps.Step.splice(stepIndex, 1); // delete leaves a null, so we have to use splice.
                            this.options.CurrentWorkflow.DraftWorkflow.Steps.Step.splice(stepIndex + 1, 0, workflowStepJson); // reinsert the step

                            this.element.html(this.renderWorkflowEditor2()); // Render the Workflow Editor. 

                        }

                    }
                }
            }

        } catch (e) {
            console.log('Exception in bwWorkflowEditor.js.moveStepDown(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwWorkflowEditor.js.moveStepDown(): ' + e.message + ', ' + e.stack);
        }
    },
    deleteStep: function (elementId) {
        try {
            console.log('In deleteStep(). elementId: ' + elementId);
            var thiz = this;
            var x = elementId.split('_')[0];
            var stepIndex = elementId.split('_')[1]; // eg: 3
            this.options.CurrentWorkflow.DraftWorkflow.Steps.Step.splice(stepIndex, 1);
            this.renderWorkflowEditor2();
        } catch (e) {
            console.log('Exception in deleteStep(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in deleteStep(): ' + e.message + ', ' + e.stack);
        }
    },

    editStepName: function (stepIndex) {
        try {
            var stepFriendlyName = document.getElementById('txtEditStepNameDialog_StepNameFriendlyName').value;
            console.log('In editStepName(). stepIndex: ' + stepIndex + ', stepFriendlyName: ' + stepFriendlyName);
            //alert('In editStepName(). stepIndex: ' + stepIndex + ', stepFriendlyName: ' + stepFriendlyName + '. This functionality is incomplete.');
            //debugger;
            this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex]["@FriendlyName"] = stepFriendlyName;
            $('#divEditStepNameDialog').dialog('close');
            this.renderWorkflowEditor2();
            // divEditStepNameDialog

        } catch (e) {
            console.log('Exception in editStepName(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in editStepName(): ' + e.message + ', ' + e.stack);
        }
    },
    displayEditStepNameDialog: function (elementId) {
        try {
            console.log('In displayEditStepNameDialog().');
            var thiz = this;
            var x = elementId.split('_')[0];
            var stepIndex = elementId.split('_')[1]; // eg: 3
            $("#divEditStepNameDialog").dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '800',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    try {
                        $('.ui-widget-overlay').bind('click', function () {
                            $("#divEditStepNameDialog").dialog('close');
                        });
                        debugger;
                        var stepNameAbbreviation = thiz.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex]["@Name"];
                        document.getElementById('txtEditStepNameDialog_StepNameAbbreviation').value = stepNameAbbreviation;

                        var stepFriendlyName = thiz.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex]["@FriendlyName"];
                        document.getElementById('txtEditStepNameDialog_StepNameFriendlyName').value = stepFriendlyName;

                        var html = '';
                        html += '  <input type="button" value="Save/Update step" style="height:30pt;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'editStepName\', \'' + stepIndex + '\');" />';
                        document.getElementById('spanEditStepNameDialog_SaveButton').innerHTML = html;
                    } catch (e) {
                        console.log('Exception in displayEditStepNameDialog():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in displayEditStepNameDialog():2: ' + e.message + ', ' + e.stack);
                    }
                },
                close: function () {
                    //$(this).dialog('destroy').remove();
                    document.getElementById('txtEditStepNameDialog_StepNameAbbreviation').value = '';
                    document.getElementById('txtEditStepNameDialog_StepNameFriendlyName').value = '';
                }
            });
            //$("#divCreateANewRoleDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
        } catch (e) {
            console.log('Exception in displayEditStepNameDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in displayEditStepNameDialog(): ' + e.message + ', ' + e.stack);
        }
    },
    displayEditStepTypeDialog: function (elementId) {
        try {
            console.log('In displayEditStepTypeDialog().');

            alert('In displayEditStepTypeDialog(). This functionality is incomplete. xcx555444333');

            //var thiz = this;
            //var x = elementId.split('_')[0];
            //var stepIndex = elementId.split('_')[1]; // eg: 3
            //$("#divEditStepNameDialog").dialog({
            //    modal: true,
            //    resizable: false,
            //    closeOnEscape: false, // Hit the ESC key to hide! Yeah!
            //    width: '800',
            //    dialogClass: "no-close", // No close button in the upper right corner.
            //    hide: false, // This means when hiding just disappear with no effects.
            //    open: function () {
            //        try {
            //            $('.ui-widget-overlay').bind('click', function () {
            //                $("#divEditStepNameDialog").dialog('close');
            //            });
            //            debugger;
            //            var stepNameAbbreviation = thiz.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex]["@Name"];
            //            document.getElementById('txtEditStepNameDialog_StepNameAbbreviation').value = stepNameAbbreviation;

            //            var stepFriendlyName = thiz.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex]["@FriendlyName"];
            //            document.getElementById('txtEditStepNameDialog_StepNameFriendlyName').value = stepFriendlyName;

            //            var html = '';
            //            html += '  <input type="button" value="Save/Update step" style="height:30pt;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'editStepName\', \'' + stepIndex + '\');" />';
            //            document.getElementById('spanEditStepNameDialog_SaveButton').innerHTML = html;
            //        } catch (e) {
            //            console.log('Exception in displayEditStepNameDialog():2: ' + e.message + ', ' + e.stack);
            //            displayAlertDialog('Exception in displayEditStepNameDialog():2: ' + e.message + ', ' + e.stack);
            //        }
            //    },
            //    close: function () {
            //        //$(this).dialog('destroy').remove();
            //        document.getElementById('txtEditStepNameDialog_StepNameAbbreviation').value = '';
            //        document.getElementById('txtEditStepNameDialog_StepNameFriendlyName').value = '';
            //    }
            //});
            //$("#divCreateANewRoleDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
        } catch (e) {
            console.log('Exception in displayEditStepTypeDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in displayEditStepTypeDialog(): ' + e.message + ', ' + e.stack);
        }
    },

    editEmailInstructionText: function (stepName) {
        try {
            console.log('In editEmailInstructionText().');
            //this.displayAlertDialog('In editEmailInstructionText(). stepName: ' + stepName); // spanConfigureEmailNotificationsDialogSubTitle
            //var emailTemplateForSubject = this.options.quillSubjectEditor.getText();
            //var emailTemplate = this.options.quill.root.innerHTML;
            //this.options.CurrentWorkflow.Workflow["EmailTemplateForSubject_TaskOverdue"] = emailTemplateForSubject;
            //this.options.CurrentWorkflow.Workflow["EmailTemplate_TaskOverdue"] = emailTemplate;

            //this.checkIfWeHaveToDisplayThePublishChangesButton();

            var emailInstructionText = document.getElementById('txtEditEmailInstructionTextDialog_EmailInstructionText').value;
            for (var i = 0; i < this.options.CurrentWorkflow.DraftWorkflow.Steps.Step.length; i++) {
                if (this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[i]["@Name"] == stepName) {
                    //emailTemplateForSubject = thiz.options.CurrentWorkflow.Workflow.Steps.Step[i]["@EmailTemplateForSubject"];
                    //emailTemplate = thiz.options.CurrentWorkflow.Workflow.Steps.Step[i]["@EmailTemplate"];
                    this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[i]["@EmailInstructionText"] = emailInstructionText;
                    break;
                }
            }

            $('#divEditEmailInstructionTextDialog').dialog('close');

            this.checkIfWeHaveToDisplayThePublishChangesButton();



        } catch (e) {
            console.log('Exception in editEmailInstructionText(): ' + e.message + ', ' + e.stack);
        }
    },
    displayEditEmailInstructionTextDialog: function (stepName) {
        try {
            console.log('In displayEditEmailInstructionTextDialog().');
            var thiz = this;
            //var x = elementId.split('_')[0];
            //var stepIndex = elementId.split('_')[1]; // eg: 3


            var html = '';
            html += '  <input type="button" value="Save/Update step" style="height:30pt;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'editEmailInstructionText\', \'' + stepName + '\');" />';
            document.getElementById('spanEditEmailInstructionTextDialog_SaveButton').innerHTML = html;

            var emailInstructionText = '';
            for (var i = 0; i < this.options.CurrentWorkflow.DraftWorkflow.Steps.Step.length; i++) {
                if (this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[i]["@Name"] == stepName) {
                    //emailTemplateForSubject = thiz.options.CurrentWorkflow.Workflow.Steps.Step[i]["@EmailTemplateForSubject"];
                    //emailTemplate = thiz.options.CurrentWorkflow.Workflow.Steps.Step[i]["@EmailTemplate"];
                    emailInstructionText = this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[i]["@EmailInstructionText"];
                    break;
                }
            }

            $("#divEditEmailInstructionTextDialog").dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '800',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divEditEmailInstructionTextDialog").dialog('close');
                    });
                    //debugger;
                    //var stepNameAbbreviation = thiz.options.CurrentWorkflow.Workflow.Steps.Step[stepIndex]["@Name"];
                    document.getElementById('txtEditEmailInstructionTextDialog_EmailInstructionText').value = emailInstructionText;

                    //var stepFriendlyName = thiz.options.CurrentWorkflow.Workflow.Steps.Step[stepIndex]["@FriendlyName"];
                    //document.getElementById('txtEditStepNameDialog_StepNameFriendlyName').value = stepFriendlyName;



                },
                close: function () {
                    //$(this).dialog('destroy').remove();
                    document.getElementById('txtEditEmailInstructionTextDialog_EmailInstructionText').value = '';
                    //document.getElementById('txtEditStepNameDialog_StepNameFriendlyName').value = '';
                }
            });
            //$("#divCreateANewRoleDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
        } catch (e) {
            console.log('Exception in displayEditEmailInstructionTextDialog(): ' + e.message + ', ' + e.stack);
        }
    },

    addARoleParticipant: function (elementId) {
        try {
            console.log('In bwWorkflowEditor.js.addARoleParticipant(). elementId: ' + elementId);
            var thiz = this;

            var isAdmin = false;
            if (elementId.indexOf('steprow-admin_') > -1) {
                // This is the ADMIN section. Limit what can be done here, just want to be able to change the assigned user.
                isAdmin = true;
            }

            $('.activeEditRow').remove(); // This gets rid of the row editor... we should only display one at a time.
            $('.steprow-hidden').removeClass('steprow-hidden'); // Display the previous row again (if there is one).

            var x = elementId.split('_')[0];
            var stepIndex = elementId.split('_')[1]; // eg: 3
            var roleIndex = elementId.split('_')[2]; // eg: 8
            this.cancelStepRowEditing(elementId); // This cancels the editing row from a previous edit. There can only be one at a time.


            var roleid = ''; // $('#' + elementId).find('.rolename').attr('bwroleid'); // 12-8-2021
            var rolename = ''; // $('#' + elementId).find('.rolename').attr('bwOldValue');
            var rolecategory = ''; // $('#' + elementId).find('.rolecategory').attr('bwOldValue');
            var tasks = ''; // $('#' + elementId).find('.tasks').attr('bwOldValue');
            var timeout = ''; // $('#' + elementId).find('.timeout').attr('bwOldValue');
            var cond = ''; // $('#' + elementId).find('.cond').attr('bwOldValue');
            console.log('In addARoleParticipant. roleid: ' + roleid + ', rolename: ' + rolename + ', rolecategory: ' + rolecategory + ', tasks: ' + tasks + ', timeout: ' + timeout + ', cond: ' + cond);


            var html = '';

            html += '<tr class="activeEditRow">'; // activeEditRow lets us determin what is being edited, and be able to close/remove them all at once when we want to.

            html += '<td style="width:30px;"></td>';

            html += '<td class="steprowcell"></td>';

            html += '<td class="selectroleorperson-editcell steprowcell"></td>';

            var rolecategory = 'Approver'; // Setting this as the default.

            if (isAdmin) {

                // Render the "RoleCategory" drop-down.
                html += '<td class="steprowcell">';
                html += '<select style="padding:5px 5px 5px 5px;" id="selectRoleCategory" class="rolecategory-dropdown">';
                html += '  <option value="' + 'Approver' + '" selected>' + 'Approver (Accountable)' + '</option>';
                html += '</select>';
                html += '</td>';

            } else {

                // Render the "RoleCategory" drop-down.
                html += '<td class="steprowcell">';
                html += '<select style="padding:5px 5px 5px 5px;" id="selectRoleCategory" xcx="xcx9934-3" class="rolecategory-dropdown" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'RoleCategoryDropDown_Onchange\', \'' + elementId + '\');">';
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

            }

            html += '<td class="actions-editcell steprowcell"></td>';

            html += '<td class="conditions-editcell steprowcell"></td>';

            html += '<td style="vertical-align:top;">';

            html += '  <table style="width:100%;">';




            html += '  <tr>';
            html += '    <td>';
            html += '       <input xcx="xcx213324-4" style="padding:5px 10px 5px 10px;opacity:.4;width:70px;" type="button" disabled value="⚙ Edit">';
            html += '    </td>';
            html += '  </tr>';




            html += '  <tr>';
            html += '    <td>';
            html += '      <input type="button" style="padding:5px 10px 5px 10px;width:70px;cursor:pointer;" value="Save" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveAssignmentRow\', \'' + elementId + '\');" />';
            html += '    </td>';
            html += '  </tr>';
            if (!isAdmin) { // The ADMIN row/step cannot be deleted.
                html += '  <tr>';
                html += '    <td>';
                html += '      <input type="button" style="padding:5px 10px 5px 10px;width:70px;cursor:pointer;" value="Delete" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'deleteRoleCategory\', \'' + elementId + '\');" />';
                html += '    </td>';
                html += '  </tr>';
            }
            html += '  <tr>';
            html += '    <td>';
            html += '      <input type="button" style="padding:5px 10px 5px 10px;width:70px;cursor:pointer;" value="Cancel" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'cancelStepRowEditing\', \'' + elementId + '\');" />';
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
            //thiz.disableScrolling(); // This keeps the screen from jumping around.

            // It is a new row, to be displayed at the top.
            $('#stepheaderrow_' + stepIndex).after(html);




            thiz.renderSelectRoleOrPersonSection(elementId);



            if (isAdmin) {
                //debugger;
                thiz.renderActionsSection(elementId); // render the actions section
            } else {
                //debugger;
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
                        //debugger;
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


                // Added 4-20-2022
                if (rolecategory == 'Collaborator') { // Populate the actions ection
                    var actions = ['Review Completed'];
                    var x = elementId.split('_')[1];
                    var step = x.split('_')[0];
                    var row = elementId.split('_')[2];
                    for (var i = 0; i < actions.length; i++) {
                        var actionChecked = false;
                        var requireCommentsChecked = false;
                        //debugger;
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

                        var checkboxId = 'Action-' + actions[i].replace(' ', '') + '_' + step + '_' + row;
                        var childCheckboxId = 'RequireComments-' + actions[i].replace(' ', '') + '_' + step + '_' + row;
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

                alert('xcx21434235-1 calling renderConditionsSection');
                thiz.renderConditionsSection(elementId, cond);
            }

            $('#' + elementId).addClass('steprow-hidden'); // Hide the row while we display it in editable-mode. This allows us to display it again when done editng, and also gives us a place to look up the old values.
            thiz.enableScrolling(); // This keeps the screen from jumping around.








            //// Populate the "Roles" drop down.

            //$.ajax({
            //    url: this.options.operationUriPrefix + "odata/Roles?$filter=IsWorkflowRole eq true",
            //    dataType: "json",
            //    contentType: "application/json",
            //    type: "Get",
            //    timeout: this.options.ajaxTimeout
            //}).done(function (result) {
            //    try {
            //        //console.log('In raci.html.displayOrgMultiPicker().Get[odata/Orgs].done: result: ' + JSON.stringify(result));
            //        var roles;
            //        if (result) {
            //            roles = result.value;
            //        } else {
            //            console.log('In addARoleParticipant().done: result: ' + JSON.stringify(result));
            //        }

            //        //alert('xcx1231243 thiz.options.displayRoleIdColumn: ' + thiz.options.displayRoleIdColumn);
            //        if (thiz.options.displayRoleIdColumn) {
            //            html += '<td class="steprowcell">';
            //            //html += '<span class="selectarow-labeltext">Select a role:</span>';
            //            //html += '<br />';
            //            html += '<select id="selectRoleId"  onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'RoleDropDown_Onchange\', \'' + 'selectRoleId' + '\');">';
            //            html += '  <option value=""></option>';
            //            for (var i = 0; i < roles.length; i++) {
            //                html += '  <option value="' + roles[i].RoleId + '">' + roles[i].RoleId + '</option>';
            //            }
            //            html += '</select>';
            //            //html += '<br />or create a new role:'; //<br /><input id="textNewRoleId" type="text" style="width:75pt;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewRoleTextBox_Onkeyup\', \'' + 'textNewRoleId' + '\');" />';
            //            html += '<br /><input style="padding:5px 10px 5px 10px;" id="btnCreateRole1" type="button" value="Create a Role..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayCreateANewRoleDialog\');" />';

            //            html += '<br />or select a person:'; //<br /><input id="textNewRoleId" type="text" style="width:75pt;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewRoleTextBox_Onkeyup\', \'' + 'textNewRoleId' + '\');" />';
            //            html += '<br /><input style="padding:5px 10px 5px 10px;" id="btnCreateRole1" type="button" value="Select Person..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayCreateANewRoleDialog\');" />';

            //            //html += '<br />or add a new person:'; //<br /><input id="textNewRoleId" type="text" style="width:75pt;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewRoleTextBox_Onkeyup\', \'' + 'textNewRoleId' + '\');" />';
            //            html += '<br /><input style="padding:5px 10px 5px 10px;" id="btnCreateRole1" type="button" value="Add a Person..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayCreateANewRoleDialog\');" />';

            //            html += '</td > ';
            //        }





            //        html += '<td class="selectroleorperson-editcell steprowcell">';
            //        //html += '<span class="selectarow-labeltext">Select a role:</span>';
            //        //html += '<br />';
            //        ////html += ' <img style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayPeoplePickerDialog\', \'' + 'txtApprover2FriendlyName' + '\', \'' + 'txtApprover2Id' + '\', \'' + 'txtApprover2Email' + '\');" src="images/addressbook-icon18x18.png">';
            //        ////html == '&nbsp;&nbsp;';
            //        //html += '<select id="selectRoleName"  onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'RoleDropDown_Onchange\', \'' + 'selectRoleName' + '\');">';
            //        //html += '  <option value=""></option>';
            //        //for (var i = 0; i < roles.length; i++) {
            //        //    html += '  <option value="' + roles[i].RoleId + '">' + roles[i].RoleName + '</option>';
            //        //}
            //        //html += '</select>';
            //        ////html += '<br />or create a new role:'; //<br /><input id="textNewRoleName" type="text" style="width:210pt;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewRoleTextBox_Onkeyup\', \'' + 'textNewRoleName' + '\');" />';
            //        //html += '<br /><input id="btnCreateRole2" type="button" value="Create a Role..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayCreateANewRoleDialog\');" />';

            //        //html += '<br />or select a person:'; //<br /><input id="textNewRoleId" type="text" style="width:75pt;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewRoleTextBox_Onkeyup\', \'' + 'textNewRoleId' + '\');" />';
            //        //html += '<br /><img style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayPeoplePickerDialog\', \'' + 'txtApprover2FriendlyName' + '\', \'' + 'txtApprover2Id' + '\', \'' + 'txtApprover2Email' + '\');" src="images/addressbook-icon18x18.png">';
            //        //html == '&nbsp;&nbsp;';
            //        //html += '<input id="btnCreateRole1" type="button" value="Select Person..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayCreateANewRoleDialog\');" />';

            //        ////html += '<br />or add a new person:'; //<br /><input id="textNewRoleId" type="text" style="width:75pt;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewRoleTextBox_Onkeyup\', \'' + 'textNewRoleId' + '\');" />';
            //        //html += '<br /><input id="btnCreateRole1" type="button" value="Add a Person..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayCreateANewRoleDialog\');" />';

            //        html += '</td > ';








            //        // The "RoleCategory" dropdown.
            //        html += '<td class="steprowcell">';
            //        html += '<select style="padding:5px 5px 5px 5px;" id="selectRoleCategory" xcx="xcx9934-1" class="rolecategory-dropdown" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'RoleCategoryDropDown_Onchange\', \'' + thiz.id + '\');">';
            //        var stepName = thiz.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex]["@Name"];
            //        var rcs;
            //        var rcs2 = ['Inform (Informed)', 'Collaborator (Consulted)', 'Approver (Accountable)'];
            //        if (stepName == 'Done') {
            //            rcs = ['Inform']; // The "Completed" step can only have the "Inform" role category.
            //        } else {
            //            rcs = ['Inform', 'Collaborator', 'Approver'];
            //        }
            //        for (var i = 0; i < rcs.length; i++) {
            //            html += '  <option value="' + rcs[i] + '">' + rcs2[i] + '</option>';
            //        }
            //        html += '</select>';
            //        html += '</td > ';

            //        // The "Actions" cell. This gets rendered below using thiz.renderActionsSection().
            //        html += '<td id="action-cell_' + stepIndex + '_' + roleIndex + '" class="actions-editcell steprowcell"></td>';

            //        //html += '<td></td>';
            //        //html += '<td></td>';
            //        //html += '<td></td>';
            //        //html += '<td></td>';

            //        // The "timeout" cell. This gets rendered below using thiz.renderTimeoutSection().
            //        //html += '<td class="timeout-editcell steprowcell"></td>';

            //        // Render the "Cond" cell. This gets rendered below using thiz.renderConditionsSection().
            //        html += '<td class="conditions-editcell steprowcell">';

            //        html += '</td>';








            //        html += '<td style="vertical-align:top;">';

            //        //html += '  <table style="width:100%;">';
            //        //html += '  <tr>';
            //        //html += '    <td>';
            //        //html += '      <input type="button" style="width:100%;" value="Save" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveAssignmentRow\', \'' + elementId + '\', \'' + 'xx' + '\');" />';
            //        //html += '    </td>';
            //        //html += '  </tr>';
            //        //html += '  <tr>';
            //        //html += '    <td>';
            //        //html += '      <input type="button" style="width:100%;" value="Cancel" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'cancelStepRowEditing\', \'' + elementId + '\', \'' + 'xx' + '\');" />';
            //        //html += '    </td>';
            //        //html += '  </tr>';
            //        //html += '  </table>';

            //        html += '  <table style="width:100%;">';
            //        html += '  <tr>';
            //        html += '    <td>';
            //        html += '      <input type="button" style="width:100%;" value="Save" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveAssignmentRow\', \'' + elementId + '\');" />xcx1671';
            //        html += '    </td>';
            //        html += '  </tr>';
            //        //html += '  <tr>';
            //        //html += '    <td>';
            //        //html += '      <input type="button" style="width:100%;" value="Delete" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'deleteRoleCategory\', \'' + elementId + '\');" />';
            //        //html += '    </td>';
            //        //html += '  </tr>';
            //        html += '  <tr>';
            //        html += '    <td>';
            //        html += '      <input type="button" style="width:100%;" value="Cancel" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'cancelStepRowEditing\', \'' + elementId + '\');" />';
            //        html += '    </td>';
            //        html += '  </tr>';
            //        //html += '  <tr>';
            //        //html += '    <td>';
            //        //html += '      <input type="button" style="width:100px;white-space:normal;overflow-wrap:break-word;" value="Configure Email Notifications" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayConfigureEmailNotificationsDialog\', \'' + elementId + '\');" />';
            //        //html += '    </td>';
            //        //html += '  </tr>';
            //        html += '  </table>';


            //        html += '</td>';















            //        html += '</tr>';

            //        // It is a new row, to be displayed at the top.
            //        $('#stepheaderrow_' + stepIndex).after(html);


            //        thiz.renderSelectRoleOrPersonSection(elementId);


            //        thiz.renderActionsSection(elementId); // render the actions section
            //        //thiz.renderTimeoutSection(elementId); // render the timeout section
            //        thiz.renderConditionsSection(elementId); // render the condition section
            //    } catch (e) {
            //        //lpSpinner.Hide();
            //        //$('.buttonAddNewAssignmentRow').attr('disabled', false); // Disables these buttons while there is the editor row displaying.
            //        console.log('Exception in addARoleParticipant().done: ' + e.message + ', ' + e.stack);
            //    }
            //}).fail(function (data) {
            //    //lpSpinner.Hide();
            //    //$('.buttonAddNewAssignmentRow').attr('disabled', false); // Disables these buttons while there is the editor row displaying.
            //    var msg;
            //    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
            //        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
            //    } else {
            //        msg = JSON.stringify(data);
            //    }
            //    alert('Error in addARoleParticipant().fail: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
            //    console.log('Error in addARoleParticipant().fail:' + JSON.stringify(data));
            //    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
            //    //var error = JSON.parse(data.responseText)["odata.error"];
            //    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            //});

        } catch (e) {
            //$('.buttonAddNewAssignmentRow').attr('disabled', false); // Disables these buttons while there is the editor row displaying.
            console.log('Exception in bwWorkflowEditor.js.addARoleParticipant(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwWorkflowEditor.js.addARoleParticipant(): ' + e.message + ', ' + e.stack);
        }
    },



    //addARoleParticipant_original 11-26-2022: function (elementId) {
    //    try {
    //        console.log('In addARoleParticipant(). elementId: ' + elementId);


    //        //expandOrCollapseWorkflowStep



    //        //this.disableButton('buttonAddNewAssignmentRow');
    //        var thiz = this;
    //        var x = elementId.split('_')[0];
    //        var stepIndex = elementId.split('_')[1]; // eg: 3
    //        var roleIndex = elementId.split('_')[2]; // eg: 8
    //        this.cancelStepRowEditing(elementId); // This cancels the diting row from a previous edit. There can only be one at a time.
    //        var html = '';
    //        html += '<tr class="activeEditRow">'; // activeEditRow lets us determin what is being edited, and be able to close/remove them all at once when we want to.


    //        //html += '<td style="vertical-align:top;">';

    //        ////html += '  <table style="width:100%;">';
    //        ////html += '  <tr>';
    //        ////html += '    <td>';
    //        ////html += '      <input type="button" style="width:100%;" value="Save" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveAssignmentRow\', \'' + elementId + '\', \'' + 'xx' + '\');" />';
    //        ////html += '    </td>';
    //        ////html += '  </tr>';
    //        ////html += '  <tr>';
    //        ////html += '    <td>';
    //        ////html += '      <input type="button" style="width:100%;" value="Cancel" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'cancelStepRowEditing\', \'' + elementId + '\', \'' + 'xx' + '\');" />';
    //        ////html += '    </td>';
    //        ////html += '  </tr>';
    //        ////html += '  </table>';

    //        //html += '  <table style="width:100%;">';
    //        //html += '  <tr>';
    //        //html += '    <td>';
    //        //html += '      <input type="button" style="width:100%;" value="Save" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveAssignmentRow\', \'' + elementId + '\');" />';
    //        //html += '    </td>';
    //        //html += '  </tr>';
    //        ////html += '  <tr>';
    //        ////html += '    <td>';
    //        ////html += '      <input type="button" style="width:100%;" value="Delete" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'deleteRoleCategory\', \'' + elementId + '\');" />';
    //        ////html += '    </td>';
    //        ////html += '  </tr>';
    //        //html += '  <tr>';
    //        //html += '    <td>';
    //        //html += '      <input type="button" style="width:100%;" value="Cancel" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'cancelStepRowEditing\', \'' + elementId + '\');" />';
    //        //html += '    </td>';
    //        //html += '  </tr>';
    //        //html += '  <tr>';
    //        //html += '    <td>';
    //        //html += '      <input type="button" style="width:100px;white-space:normal;overflow-wrap:break-word;" value="Configure Email Notifications" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayConfigureEmailNotificationsDialog\', \'' + elementId + '\');" />';
    //        //html += '    </td>';
    //        //html += '  </tr>';
    //        //html += '  </table>';


    //        //html += '</td>';

    //        html += '<td></td>';


    //        // Populate the "Roles" drop down.

    //        $.ajax({
    //            url: this.options.operationUriPrefix + "odata/Roles?$filter=IsWorkflowRole eq true",
    //            dataType: "json",
    //            contentType: "application/json",
    //            type: "Get",
    //            timeout: this.options.ajaxTimeout
    //        }).done(function (result) {
    //            try {
    //                //console.log('In raci.html.displayOrgMultiPicker().Get[odata/Orgs].done: result: ' + JSON.stringify(result));
    //                var roles;
    //                if (result) {
    //                    roles = result.value;
    //                } else {
    //                    console.log('In addARoleParticipant().done: result: ' + JSON.stringify(result));
    //                }

    //                //alert('xcx1231243 thiz.options.displayRoleIdColumn: ' + thiz.options.displayRoleIdColumn);
    //                if (thiz.options.displayRoleIdColumn) { 
    //                    html += '<td class="steprowcell">';
    //                    //html += '<span class="selectarow-labeltext">Select a role:</span>';
    //                    //html += '<br />';
    //                    html += '<select id="selectRoleId"  onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'RoleDropDown_Onchange\', \'' + 'selectRoleId' + '\');">';
    //                    html += '  <option value=""></option>';
    //                    for (var i = 0; i < roles.length; i++) {
    //                        html += '  <option value="' + roles[i].RoleId + '">' + roles[i].RoleId + '</option>';
    //                    }
    //                    html += '</select>';
    //                    //html += '<br />or create a new role:'; //<br /><input id="textNewRoleId" type="text" style="width:75pt;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewRoleTextBox_Onkeyup\', \'' + 'textNewRoleId' + '\');" />';
    //                    html += '<br /><input style="padding:5px 10px 5px 10px;" id="btnCreateRole1" type="button" value="Create a Role..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayCreateANewRoleDialog\');" />';

    //                    html += '<br />or select a person:'; //<br /><input id="textNewRoleId" type="text" style="width:75pt;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewRoleTextBox_Onkeyup\', \'' + 'textNewRoleId' + '\');" />';
    //                    html += '<br /><input style="padding:5px 10px 5px 10px;" id="btnCreateRole1" type="button" value="Select Person..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayCreateANewRoleDialog\');" />';

    //                    //html += '<br />or add a new person:'; //<br /><input id="textNewRoleId" type="text" style="width:75pt;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewRoleTextBox_Onkeyup\', \'' + 'textNewRoleId' + '\');" />';
    //                    html += '<br /><input style="padding:5px 10px 5px 10px;" id="btnCreateRole1" type="button" value="Add a Person..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayCreateANewRoleDialog\');" />';

    //                    html += '</td > ';
    //                }





    //                html += '<td class="selectroleorperson-editcell steprowcell">';
    //                //html += '<span class="selectarow-labeltext">Select a role:</span>';
    //                //html += '<br />';
    //                ////html += ' <img style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayPeoplePickerDialog\', \'' + 'txtApprover2FriendlyName' + '\', \'' + 'txtApprover2Id' + '\', \'' + 'txtApprover2Email' + '\');" src="images/addressbook-icon18x18.png">';
    //                ////html == '&nbsp;&nbsp;';
    //                //html += '<select id="selectRoleName"  onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'RoleDropDown_Onchange\', \'' + 'selectRoleName' + '\');">';
    //                //html += '  <option value=""></option>';
    //                //for (var i = 0; i < roles.length; i++) {
    //                //    html += '  <option value="' + roles[i].RoleId + '">' + roles[i].RoleName + '</option>';
    //                //}
    //                //html += '</select>';
    //                ////html += '<br />or create a new role:'; //<br /><input id="textNewRoleName" type="text" style="width:210pt;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewRoleTextBox_Onkeyup\', \'' + 'textNewRoleName' + '\');" />';
    //                //html += '<br /><input id="btnCreateRole2" type="button" value="Create a Role..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayCreateANewRoleDialog\');" />';

    //                //html += '<br />or select a person:'; //<br /><input id="textNewRoleId" type="text" style="width:75pt;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewRoleTextBox_Onkeyup\', \'' + 'textNewRoleId' + '\');" />';
    //                //html += '<br /><img style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayPeoplePickerDialog\', \'' + 'txtApprover2FriendlyName' + '\', \'' + 'txtApprover2Id' + '\', \'' + 'txtApprover2Email' + '\');" src="images/addressbook-icon18x18.png">';
    //                //html == '&nbsp;&nbsp;';
    //                //html += '<input id="btnCreateRole1" type="button" value="Select Person..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayCreateANewRoleDialog\');" />';

    //                ////html += '<br />or add a new person:'; //<br /><input id="textNewRoleId" type="text" style="width:75pt;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewRoleTextBox_Onkeyup\', \'' + 'textNewRoleId' + '\');" />';
    //                //html += '<br /><input id="btnCreateRole1" type="button" value="Add a Person..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayCreateANewRoleDialog\');" />';

    //                html += '</td > ';








    //                // The "RoleCategory" dropdown.
    //                html += '<td class="steprowcell">';
    //                html += '<select style="padding:5px 5px 5px 5px;" id="selectRoleCategory" xcx="xcx9934-1" class="rolecategory-dropdown" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'RoleCategoryDropDown_Onchange\', \'' + thiz.id + '\');">';
    //                var stepName = thiz.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex]["@Name"];
    //                var rcs;
    //                var rcs2 = ['Inform (Informed)', 'Collaborator (Consulted)', 'Approver (Accountable)'];
    //                if (stepName == 'Done') {
    //                    rcs = ['Inform']; // The "Completed" step can only have the "Inform" role category.
    //                } else {
    //                    rcs = ['Inform', 'Collaborator', 'Approver'];
    //                }
    //                for (var i = 0; i < rcs.length; i++) {
    //                    html += '  <option value="' + rcs[i] + '">' + rcs2[i] + '</option>';
    //                }
    //                html += '</select>';
    //                html += '</td > ';

    //                // The "Actions" cell. This gets rendered below using thiz.renderActionsSection().
    //                html += '<td id="action-cell_' + stepIndex + '_' + roleIndex + '" class="actions-editcell steprowcell"></td>';

    //                //html += '<td></td>';
    //                //html += '<td></td>';
    //                //html += '<td></td>';
    //                //html += '<td></td>';

    //                // The "timeout" cell. This gets rendered below using thiz.renderTimeoutSection().
    //                //html += '<td class="timeout-editcell steprowcell"></td>';

    //                // Render the "Cond" cell. This gets rendered below using thiz.renderConditionsSection().
    //                html += '<td class="conditions-editcell steprowcell">';

    //                html += '</td>';








    //                html += '<td style="vertical-align:top;">';

    //                //html += '  <table style="width:100%;">';
    //                //html += '  <tr>';
    //                //html += '    <td>';
    //                //html += '      <input type="button" style="width:100%;" value="Save" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveAssignmentRow\', \'' + elementId + '\', \'' + 'xx' + '\');" />';
    //                //html += '    </td>';
    //                //html += '  </tr>';
    //                //html += '  <tr>';
    //                //html += '    <td>';
    //                //html += '      <input type="button" style="width:100%;" value="Cancel" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'cancelStepRowEditing\', \'' + elementId + '\', \'' + 'xx' + '\');" />';
    //                //html += '    </td>';
    //                //html += '  </tr>';
    //                //html += '  </table>';

    //                html += '  <table style="width:100%;">';
    //                html += '  <tr>';
    //                html += '    <td>';
    //                html += '      <input type="button" style="width:100%;" value="Save" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveAssignmentRow\', \'' + elementId + '\');" />xcx1671';
    //                html += '    </td>';
    //                html += '  </tr>';
    //                //html += '  <tr>';
    //                //html += '    <td>';
    //                //html += '      <input type="button" style="width:100%;" value="Delete" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'deleteRoleCategory\', \'' + elementId + '\');" />';
    //                //html += '    </td>';
    //                //html += '  </tr>';
    //                html += '  <tr>';
    //                html += '    <td>';
    //                html += '      <input type="button" style="width:100%;" value="Cancel" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'cancelStepRowEditing\', \'' + elementId + '\');" />';
    //                html += '    </td>';
    //                html += '  </tr>';
    //                //html += '  <tr>';
    //                //html += '    <td>';
    //                //html += '      <input type="button" style="width:100px;white-space:normal;overflow-wrap:break-word;" value="Configure Email Notifications" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayConfigureEmailNotificationsDialog\', \'' + elementId + '\');" />';
    //                //html += '    </td>';
    //                //html += '  </tr>';
    //                html += '  </table>';


    //                html += '</td>';















    //                html += '</tr>';

    //                // It is a new row, to be displayed at the top.
    //                $('#stepheaderrow_' + stepIndex).after(html);


    //                thiz.renderSelectRoleOrPersonSection(elementId);


    //                thiz.renderActionsSection(elementId); // render the actions section
    //                //thiz.renderTimeoutSection(elementId); // render the timeout section
    //                thiz.renderConditionsSection(elementId); // render the condition section
    //            } catch (e) {
    //                //lpSpinner.Hide();
    //                //$('.buttonAddNewAssignmentRow').attr('disabled', false); // Disables these buttons while there is the editor row displaying.
    //                console.log('Exception in addARoleParticipant().done: ' + e.message + ', ' + e.stack);
    //            }
    //        }).fail(function (data) {
    //            //lpSpinner.Hide();
    //            //$('.buttonAddNewAssignmentRow').attr('disabled', false); // Disables these buttons while there is the editor row displaying.
    //            var msg;
    //            if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
    //                msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
    //            } else {
    //                msg = JSON.stringify(data);
    //            }
    //            alert('Error in addARoleParticipant().fail: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
    //            console.log('Error in addARoleParticipant().fail:' + JSON.stringify(data));
    //            //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
    //            //var error = JSON.parse(data.responseText)["odata.error"];
    //            //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
    //        });
    //        //}
    //    } catch (e) {
    //        //$('.buttonAddNewAssignmentRow').attr('disabled', false); // Disables these buttons while there is the editor row displaying.
    //        console.log('Exception in addARoleParticipant(): ' + e.message + ', ' + e.stack);
    //    }
    //},


    addNewWorkflowStep: function (elementId) {
        try {
            console.log('In addNewWorkflowStep(). elementId: ' + elementId);
            var thiz = this;

            alert('In addNewWorkflowStep(). elementId: ' + elementId + '. Pick from one of the step types: Normal, Collaborate, Revise. Include some text to describe each step type.');




            //debugger;
            //this.disableButton('buttonAddNewAssignmentRow');

            //var x = elementId.split('_')[0];
            var stepIndex = elementId.split('_')[1]; // eg: 3
            //var roleIndex = elementId.split('_')[2]; // eg: 8
            //this.cancelStepRowEditing(elementId); // This cancels the diting row from a previous edit. There can only be one at a time.
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
                        html += '<br /><input style="padding:5px 10px 5px 10px;" id="btnCreateRole1" type="button" value="Add a Person..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayCreateANewRoleDialog\');" />';

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
                    html += '<select style="padding:5px 5px 5px 5px;" id="selectRoleCategory" xcx="xcx9934-2" class="rolecategory-dropdown" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'RoleCategoryDropDown_Onchange\', \'' + thiz.id + '\');">';
                    //debugger;
                    var stepName = 'stepName'; //thiz.options.CurrentWorkflow.Workflow.Steps.Step[stepIndex]["@Name"];
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
                    roleIndex = 0;
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
                    var elementId = 0;
                    html += '  <table style="width:100%;">';
                    html += '  <tr>';
                    html += '    <td>';
                    html += '      <input type="button" style="width:100%;" value="Save" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveAssignmentRow\', \'' + elementId + '\');" />xcx1672';
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

                    //debugger;
                    //thiz.renderSelectRoleOrPersonSection(elementId);












                    var stepGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });

                    var step = {
                        StepName: "NewStep-" + stepGuid,
                        "@Name": "NewStep-" + stepGuid,
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
                    thiz.options.CurrentWorkflow.DraftWorkflow.Steps.Step.push(step);
                    //debugger;

                    thiz.renderWorkflowEditor2();







                    //thiz.renderActionsSection(elementId); // render the actions section
                    ////thiz.renderTimeoutSection(elementId); // render the timeout section
                    //thiz.renderConditionsSection(elementId); // render the condition section

                    thiz.checkIfWeHaveToDisplayThePublishChangesButton();

                } catch (e) {
                    //lpSpinner.Hide();
                    //$('.buttonAddNewAssignmentRow').attr('disabled', false); // Disables these buttons while there is the editor row displaying.
                    console.log('Exception in addNewWorkflowStep.done: ' + e.message + ', ' + e.stack);
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
                alert('Error in addNewWorkflowStep.fail: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                console.log('Error in addNewWorkflowStep.fail:' + JSON.stringify(data));
                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                //var error = JSON.parse(data.responseText)["odata.error"];
                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            });
            //}
        } catch (e) {
            //$('.buttonAddNewAssignmentRow').attr('disabled', false); // Disables these buttons while there is the editor row displaying.
            console.log('Exception in addNewWorkflowStep(): ' + e.message + ', ' + e.stack);
        }
    },

    saveStepname: function (tagname, originalStepname) {
        try {
            console.log('saveStepname(). tagname: ' + tagname + ', originalStepname: ' + originalStepname);
            //alert('In saveStepname(). Editing this step name will impact all of the workflows.');
            var newStepName = document.getElementById(tagname).firstElementChild.value;
            for (var i = 0; i < this.options.CurrentWorkflow.RaciSteps.length; i++) {
                if (this.options.CurrentWorkflow.RaciSteps[i].StepName == originalStepname) {
                    this.options.CurrentWorkflow.RaciSteps[i].StepName = newStepName;
                    document.getElementById(tagname).innerHTML = newStepName; // Doing this instead of calling this._create();
                }
            }
        } catch (e) {
            console.log('Exception in saveStepname(): ' + e.message + ', ' + e.stack);
        }
        //this._create();
    },








    expandOrCollapseSliderPanel: function () {
        // This is the irght hand side slider panel we are using for the email settings.
        var html = '';
        if (document.getElementsByClassName('rightSliderPanel')[0].innerHTML == '') {
            html += '<table style="background-color:aliceblue;padding-left:5px;padding-right:35px;">';



            //var tbl = document.getElementById('your table').rows;
            //alert(tbl[0].offsetHeight); // row 1

            var tbl = document.getElementById('tableWorkflowEditorWorkflow').rows; // This is the workflow. We are going to use this to decide the height for the cells (td tags) in the email template editing slider panel which shows up to the right of this table. We want the td tags to line up!
            ////var count = tableElement.rows.length;
            ////var row1 = tableElement.rows[1];
            ////var row1_cells_count = row1.cells.length;
            ////var row1_cell0 = row1.cells[0];
            ////var rowHeight = row1_cell0.offsetHeight;
            ////var rowHeight2 = tableElement.rows[1].cells[0].offsetHeight;
            //var rowHeight3 = tableElement.rows[1].offsetHeight;
            //debugger;


            html += '   <tr style="height:' + tbl[0].offsetHeight + 'px;">';
            html += '       <td class="rightsliderpanel" style="white-space:nowrap;">';

            html += '<table style="width:100%">';
            html += '   <tr>';
            html += '       <td style="width:95%;">';
            html += '           <span style="">Customize Email Templates</span>';
            html += '       </td>';
            html += '       <td>';
            html += '           <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'expandOrCollapseSliderPanel\');">X</span>';
            html += '       </td>';
            html += '   </tr>';
            html += '</table>';
            html += '<span style="font-size:8pt;white-space:normal;">Customize the emails that get sent automatically by the system. <span style="color:tomato;">DEV NOTE: We need a way to edit the email sent when a collaboration step has been completed/times-out.</span></span>';

            html += `<input type="button" class="BwSmallButton" style="white-space:nowrap;padding:5px 10px 5px 10px;" value="✚ Add a New Email Notification" onclick="$('.bwWorkflowEditor').bwWorkflowEditor('addANewEmailNotification');">`;

            html += '       </td>';
            html += '   </tr>';



            html += '   <tr>';
            html += '       <td><hr /></td>';
            html += '   </tr>';

            html += '   <tr>';
            html += '       <td class="stepheadercell workflowEmailTemplateEditButton" style="text-align:center;">';
            var instructionText = 'These emails get sent daily to people with outstanding tasks.<br />Tasks are only active for a single step of the workflow at a time, and it executes from top to bottom, with the bottom step being the last one to be performed.';





            html += '           <div class="spanButtonHeaderTitle" style="font-weight:bold;" xcx="xcx923424457777-1">Overdue Task(s)<span style="font-size:15pt;display:inline-block;padding-left:5px;">✉</span></div>';

            html += '           <div style="font-size:8pt;padding-bottom:5px;">' + instructionText + '</div>';

            html += '           <span class="spanButton" xcx="xcx923424457777-1" title="Edit email template(s)..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'editStepEmails\', \'' + 'Overdue' + '\', \'' + 'Overdue Task(s)' + '\', \'' + instructionText + '\');"><span style="font-size:15pt;display:inline-block;padding-right:5px;">✉</span>Approver</span>';
            html += '           <span class="spanButton" xcx="xcx923424457777-1" title="Edit email template(s)..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'editStepEmails\', \'' + 'Overdue' + '\', \'' + 'Overdue Task(s)' + '\', \'' + instructionText + '\');"><span style="font-size:15pt;display:inline-block;padding-right:5px;">✉</span>Collaborator</span>';
            html += '           <span class="spanButton" xcx="xcx923424457777-1" title="Edit email template(s)..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'editStepEmails\', \'' + 'Overdue' + '\', \'' + 'Overdue Task(s)' + '\', \'' + instructionText + '\');"><span style="font-size:15pt;display:inline-block;padding-right:5px;">✉</span>Informed</span>';

            html += '           <span class="spanButton" title="Edit email template(s)..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'editStepEmails\', \'' + 'Overdue' + '\', \'' + 'Overdue Task(s)' + '\', \'' + instructionText + '\');"><span style="font-size:15pt;display:inline-block;padding-right:5px;padding-top:12px;">✉</span>Creator</span>';
            html += '           <span class="spanButton" title="Edit email template(s)..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'editStepEmails\', \'' + 'Overdue' + '\', \'' + 'Overdue Task(s)' + '\', \'' + instructionText + '\');"><span style="font-size:15pt;display:inline-block;padding-right:5px;padding-top:12px;">✉</span>Sponsor/ADMIN</span>';

            html += '       </td>';
            html += '   </tr>';

            //html += '   <tr>';
            //html += '       <td><hr /></td>';
            //html += '   </tr>';

            //html += '   <tr>';
            //html += '       <td class="stepheadercell workflowEmailTemplateEditButton" style="text-align:center;">';
            //var instructionText = 'This email get sent to the creator to acknowledge that their new request has been received.';
            //html += '           <span class="spanButton" title="Edit email template(s)..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'editStepEmails\', \'' + 'RequestReceived' + '\', \'' + 'Request Received' + '\', \'' + instructionText + '\');"><span style="font-size:15pt;display:inline-block;">✉</span> "' + 'Request Received' + '" &nbsp;&nbsp;</span>';
            //html += '           <br />';
            //html += '           <div style="font-size:8pt;margin-top:10px;">' + instructionText + '</div>';
            //html += '       </td>';
            //html += '   </tr>';

            //html += '   <tr>';
            //html += '       <td><hr /></td>';
            //html += '   </tr>';

            //html += '   <tr>';
            //html += '       <td class="stepheadercell" style="text-align:center;">';
            //html += '           <span class="spanButton" title="Edit email template..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'editStepEmails\',\'Create\');"><span style="font-size:15pt;display:inline-block;">✉</span> "Your request has been received" &nbsp;</span><br /><span style="font-size:8pt;padding:0 25px 0 25px;">These emails get sent to people when they first create a request.</span>';
            //html += '       </td>';
            //html += '   </tr>';

            //html += '   <tr>';
            //html += '       <td><hr /></td>';
            //html += '   </tr>';

            //html += '   <tr>';
            //html += '       <td class="stepheadercell" style="text-align:center;">';
            //html += '           <span class="spanButton" title="Edit email template..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'editOverdueTasksEmailTemplatexxx\');"><span style="font-size:15pt;display:inline-block;">✉</span> "A new request has been submitted" &nbsp;</span><br /><span style="font-size:8pt;padding:0 25px 0 25px;">This email gets sent to the ADMIN (Workflow Administrator) when a new request is submitted.</span>';
            //html += '       </td>';
            //html += '   </tr>';

            //html += '   <tr>';
            //html += '       <td><hr /></td>';
            //html += '   </tr>';

            //html += '   <tr>';
            //html += '       <td>';
            //html += '           <span title="Edit email template..." style="width:200px;padding:5px 10px 5px 10px;margin:0 0 0 20px;white-space:nowrap;vertical-align:top;border:1px solid lightblue;cursor:pointer;font-weight:normal;font-size:20pt;"><span style="display:inline-block;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'expandTaskEmailEditorButtons\');">+ ⚙✉</span></span>';
            //html += '       </td>';
            //html += '   </tr>';

            html += '   <tr>';
            html += '       <td>';
            html += '           <span id="taskEmailEditorButtons" style="">[taskEmailEditorButtons]</span>';
            html += '       </td>';
            html += '   </tr>';

            //var car = this.options.CurrentWorkflow;
            //for (var i = 0; i < car.Workflow.Steps.Step.length; i++) {
            //    var stepName = car.Workflow.Steps.Step[i]["@Name"];
            //    var buttonText = stepName;
            //    //if (stepName == 'Create') {
            //    //    buttonText = 'Confirmation';
            //    //} else if (stepName == 'Done') {
            //    //    buttonText = 'Completed (Done)';
            //    //}
            //    if (document.getElementById('stepheaderrow_' + i)) {
            //        html += '   <tr style="height:' + document.getElementById('stepheaderrow_' + i).getBoundingClientRect().height + 'px;background-color:whitesmoke;">';
            //    } else {
            //        html += '   <tr style="background-color:whitesmoke;">';
            //    }

            //    html += '       <td class="stepheadercell" onmouseover="document.getElementById(\'stepheaderrow_' + i + '\').cells[0].style.backgroundColor=\'gainsboro\';" onmouseout="document.getElementById(\'stepheaderrow_' + i + '\').cells[0].style.backgroundColor=\'whitesmoke\';">';
            //    //html += '           <span class="spanButton" title="Edit email template(s)..." style="padding:5px 10px 5px 10px;margin:0 0 0 20px;white-space:nowrap;vertical-align:top;border:1px solid lightblue;cursor:pointer;font-weight:normal;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'editStepEmails\', \'' + stepName + '\');"><span style="font-size:15pt;display:inline-block;">✉</span> "' + buttonText + '" Email&nbsp;&nbsp;</span>';
            //    html += '           <span class="spanButton" title="Edit email template(s)..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'editStepEmails\', \'' + stepName + '\');"><span style="font-size:15pt;display:inline-block;">✉</span> "' + buttonText + '" Email&nbsp;&nbsp;</span>';
            //    html += '       </td>';
            //    html += '   </tr>';

            //}



            //html += '   <tr>';
            //html += '       <td><hr /></td>';
            //html += '   </tr>';

            //html += '   <tr>';
            //html += '       <td class="stepheadercell">';
            //html += '           <span class="spanButton" title="Edit email template(s)..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'editStepEmails\', \'all\');"><span style="font-size:15pt;display:inline-block;">✉</span> Task Notification Emails&nbsp;&nbsp;-itworx</span>';
            //html += '       </td>';
            //html += '   </tr>';


            html += '   <tr>';
            html += '       <td><br /></td>';
            html += '   </tr>';
            html += '</table>';

            var html2 = '';
            //html2 += '<input style="padding:5px 10px 5px 10px;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'addARaciStep\', \'' + 'all' + '\');" type="button" value="Add a Step" />';
            var tooltip = 'Edit email template(s)...';
            html2 += '<span title="' + tooltip + '" style="width:200px;padding:5px 10px 5px 10px;margin:0 0 0 20px;white-space:nowrap;vertical-align:top;border:1px solid lightblue;cursor:pointer;font-weight:normal;font-size:20pt;"><span style="display:inline-block;">- ✉</span></span>';
            html2 += '<span id="divEmailEditorHorizontalSliderPane" style="width:200px;display:inline;"></span>';

            document.getElementById('spanExpandOrCollapseRightSliderPaneButton').innerHTML = html2; //'- ✉[divemaileditorhorizontalsliderpane]';
        } else {

            var html2 = '';
            //html2 += '<input style="padding:5px 10px 5px 10px;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'addARaciStep\', \'' + 'all' + '\');" type="button" value="Add a Step" />';
            var tooltip = 'Edit email template(s)...';
            html2 += '<span title="' + tooltip + '" style="width:200px;padding:5px 10px 5px 10px;margin:0 0 0 20px;white-space:nowrap;vertical-align:top;border:1px solid lightblue;cursor:pointer;font-weight:normal;font-size:20pt;"><span style="display:inline-block;">+ ✉</span></span>';
            html2 += '<span id="divEmailEditorHorizontalSliderPane" style="width:200px;display:inline;"></span>';

            document.getElementById('spanExpandOrCollapseRightSliderPaneButton').innerHTML = html2; //'+ ✉[divemaileditorhorizontalsliderpane]';
        }
        document.getElementsByClassName('rightSliderPanel')[0].innerHTML = html;

        //this.expandTaskEmailEditorButtons();

        try {
            console.log('In expandTaskEmailEditorButtons().');
            var html = '';
            html += '<table>';
            var car = this.options.CurrentWorkflow;
            for (var i = 0; i < car.DraftWorkflow.Steps.Step.length; i++) {
                var stepName = car.DraftWorkflow.Steps.Step[i]["@Name"];
                var stepFriendlyName;
                var buttonText;

                if (car.DraftWorkflow.Steps.Step[i]["@FriendlyName"]) {
                    stepFriendlyName = car.DraftWorkflow.Steps.Step[i]["@FriendlyName"];
                    buttonText = car.DraftWorkflow.Steps.Step[i]["@FriendlyName"];
                } else {
                    stepFriendlyName = stepName;
                    buttonText = stepName;
                }


                var instructionText = car.DraftWorkflow.Steps.Step[i]["@EmailInstructionText"];


                //if (stepName != 'Create') {
                //    buttonText = 'Confirmation';
                //} else if (stepName == 'Done') {
                //    buttonText = 'Completed (Done)';
                //}

                html += '   <tr>';
                html += '       <td><hr /></td>';
                html += '   </tr>';

                if (document.getElementById('stepheaderrow_' + i)) {
                    html += '   <tr style="height:' + document.getElementById('stepheaderrow_' + i).getBoundingClientRect().height + 'px;background-color:whitesmoke;">';
                } else {
                    html += '   <tr style="background-color:whitesmoke;">';
                }



                //alert('stepFriendlyName: ' + stepFriendlyName);

                html += '       <td class="stepheadercell workflowEmailTemplateEditButton" style="text-align:center;padding:0 25px 0 25px;" onmouseover="document.getElementById(\'stepheaderrow_' + i + '\').cells[0].style.backgroundColor=\'gainsboro\';" onmouseout="document.getElementById(\'stepheaderrow_' + i + '\').cells[0].style.backgroundColor=\'whitesmoke\';">';

                html += '           <div class="spanButtonHeaderTitle" style="font-weight:bold;" xcx="xcx923424457777-2">' + buttonText + '<span style="font-size:15pt;display:inline-block;padding-left:5px;">✉</span></div>';

                html += '           <div style="font-size:8pt;padding-bottom:5px;">' + instructionText + '</div>';

                html += '           <span class="spanButton" title="Edit email template(s)..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'editStepEmails\', \'' + stepName + '\', \'' + stepFriendlyName + '\', \'' + instructionText + '\');"><span style="font-size:15pt;display:inline-block;padding-right:5px;">✉</span>Approver</span>';
                html += '           <span class="spanButton" title="Edit email template(s)..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'editStepEmails\', \'' + stepName + '\', \'' + stepFriendlyName + '\', \'' + instructionText + '\');"><span style="font-size:15pt;display:inline-block;padding-right:5px;">✉</span>Collaborator</span>';
                html += '           <span class="spanButton" title="Edit email template(s)..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'editStepEmails\', \'' + stepName + '\', \'' + stepFriendlyName + '\', \'' + instructionText + '\');"><span style="font-size:15pt;display:inline-block;padding-right:5px;">✉</span>Informed</span>';

                html += '           <span class="spanButton" title="Edit email template(s)..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'editStepEmails\', \'' + stepName + '\', \'' + stepFriendlyName + '\', \'' + instructionText + '\');"><span style="font-size:15pt;display:inline-block;padding-right:5px;padding-top:12px;">✉</span>Creator</span>';
                html += '           <span class="spanButton" title="Edit email template(s)..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'editStepEmails\', \'' + stepName + '\', \'' + stepFriendlyName + '\', \'' + instructionText + '\');"><span style="font-size:15pt;display:inline-block;padding-right:5px;padding-top:12px;">✉</span>Sponsor/ADMIN</span>';


                html += '       </td>';
                html += '   </tr>';





                //
                //
                // STARTED THIS 6-11-2024. WORKFLOW JSON CHANGE FOR EMAILS bwWorkflowEditor.js. 
                //
                // We currently have these properties:
                //    @EmailInstructionText
                //    @EmailTemplateForSubject
                //    @EmailTemplate
                //
                // NOW WE NEED TO ADD THESE ONES:
                //    @EmailInstructionText_ENDOFSTEP
                //    @EmailTemplateForSubject_ENDOFSTEP
                //    @EmailTemplate_ENDOFSTEP
                //
                //

                if (stepName != 'Create') {
                    if (document.getElementById('stepheaderrow_' + i)) {
                        html += '   <tr style="height:' + document.getElementById('stepheaderrow_' + i).getBoundingClientRect().height + 'px;background-color:whitesmoke;">';
                    } else {
                        html += '   <tr style="background-color:whitesmoke;">';
                    }



                    //alert('stepFriendlyName: ' + stepFriendlyName);

                    html += '       <td class="stepheadercell workflowEmailTemplateEditButton" style="text-align:center;padding:0 25px 0 25px;" onmouseover="document.getElementById(\'stepheaderrow_' + i + '\').cells[0].style.backgroundColor=\'gainsboro\';" onmouseout="document.getElementById(\'stepheaderrow_' + i + '\').cells[0].style.backgroundColor=\'whitesmoke\';">';

                    //html += '           <div class="spanButtonHeaderTitle" style="font-weight:bold;" xcx="xcx923424457777-2">' + buttonText + '<span style="font-size:15pt;display:inline-block;padding-left:5px;">✉</span></div>';
                    html += '           <div class="spanButtonHeaderTitle" style="font-weight:bold;">&nbsp;</div>';

                    html += '           <div style="font-size:8pt;padding-bottom:5px;">' + instructionText + '</div>';

                    html += '           <span class="spanButton" title="Edit email template(s)..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'editStepEmails\', \'' + stepName + '\', \'' + stepFriendlyName + '\', \'' + instructionText + '\');"><span style="font-size:15pt;display:inline-block;padding-right:5px;">✉</span>Approver</span>';
                    html += '           <span class="spanButton" title="Edit email template(s)..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'editStepEmails\', \'' + stepName + '\', \'' + stepFriendlyName + '\', \'' + instructionText + '\');"><span style="font-size:15pt;display:inline-block;padding-right:5px;">✉</span>Collaborator</span>';
                    html += '           <span class="spanButton" title="Edit email template(s)..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'editStepEmails\', \'' + stepName + '\', \'' + stepFriendlyName + '\', \'' + instructionText + '\');"><span style="font-size:15pt;display:inline-block;padding-right:5px;">✉</span>Informed</span>';

                    html += '           <span class="spanButton" title="Edit email template(s)..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'editStepEmails\', \'' + stepName + '\', \'' + stepFriendlyName + '\', \'' + instructionText + '\');"><span style="font-size:15pt;display:inline-block;padding-right:5px;padding-top:12px;">✉</span>Creator</span>';
                    html += '           <span class="spanButton" title="Edit email template(s)..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'editStepEmails\', \'' + stepName + '\', \'' + stepFriendlyName + '\', \'' + instructionText + '\');"><span style="font-size:15pt;display:inline-block;padding-right:5px;padding-top:12px;">✉</span>Sponsor/ADMIN</span>';


                    html += '       </td>';
                    html += '   </tr>';

                }























                //}
            }
            html += '</table>';
            document.getElementById('taskEmailEditorButtons').innerHTML = html;
        } catch (e) {
            console.log('Exception in expandTaskEmailEditorButtons(): ' + e.message + ', ' + e.stack);
        }
    },

    expandOrCollapseWorkflowStep: function (rowId, imageId, collapsibleRowId, expandOrCollapse) { // collapsibleRowId = steprow-' + stepName.toLowerCase() + '_' + i + '_' + '0'
        try {

            if (document.activeElement.type == 'text' || document.activeElement.type == 'select-one') {
                // do nothing. This is how we prevent the row expand/collapse when the user just wants to change the collaboration timeout values.
            } else {

                // Get the steprow_i class name. This is how we identify the underlying rows so that we can collapse or expand the whole step/section.
                var rowindex = imageId.split('stepimage_')[1];
                var stepSectionClass = 'steprow_' + rowindex;

                var img = document.getElementById(imageId);
                var urlClosed = this.options.operationUriPrefix + 'images/drawer-close.png'; //https://budgetworkflow.com/images/drawer-close.png
                var urlOpened = this.options.operationUriPrefix + 'images/drawer-open.png';
                var collapsibleRow = document.getElementById(collapsibleRowId);

                console.log('In bwWorkflowEditor.js.expandOrCollapseWorkflowStep(' + rowId + ', ' + imageId + ', ' + collapsibleRowId + ', ' + expandOrCollapse + ').');
                //alert('In bwWorkflowEditor.js.expandOrCollapseWorkflowStep(' + rowId + ', ' + imageId + ', ' + collapsibleRowId + ', ' + expandOrCollapse + ').');

                if (expandOrCollapse) {
                    // expand or collapse.

                    if (expandOrCollapse == 'collapse') {
                        img.src = urlOpened;
                        //collapsibleRow.style.display = 'none';
                        var elems = document.getElementsByClassName(stepSectionClass);
                        for (var i = 0; i < elems.length; i++) {
                            elems[i].style.display = 'none';
                        }
                    } else {
                        img.src = urlClosed;
                        //collapsibleRow.style.display = 'table-row';
                        var elems = document.getElementsByClassName(stepSectionClass);
                        for (var i = 0; i < elems.length; i++) {
                            elems[i].style.display = 'table-row';
                        }
                    }

                } else {

                    if (img.src == urlClosed) {
                        img.src = urlOpened;
                        //collapsibleRow.style.display = 'none';
                        var elems = document.getElementsByClassName(stepSectionClass);
                        for (var i = 0; i < elems.length; i++) {
                            elems[i].style.display = 'none';
                        }
                    } else {
                        img.src = urlClosed;
                        //collapsibleRow.style.display = 'table-row';
                        var elems = document.getElementsByClassName(stepSectionClass);
                        for (var i = 0; i < elems.length; i++) {
                            elems[i].style.display = 'table-row';
                        }
                    }
                }

            }

        } catch (e) {
            console.log('Exception in bwWorkflowEditor.js.expandOrCollapseWorkflowStep(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwWorkflowEditor.js.expandOrCollapseWorkflowStep(): ' + e.message + ', ' + e.stack);
        }
    },

    expandOrCollapseAllWorkflowSteps: function () {
        try {
            console.log('In expandOrCollapseAllWorkflowSteps().');

            // The following is an example of the first workflow step. It makes sense for this to be the one which determines the toggle... if it's closed, then open.
            // <img id="stepimage_0" src="https://www.budgetworkflow.com/images/drawer-close.png" title="collapse" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;">
            var urlClosed = this.options.operationUriPrefix + 'images/drawer-close.png'; //https://budgetworkflow.com/images/drawer-close.png
            var urlOpened = this.options.operationUriPrefix + 'images/drawer-open.png';

            var expandOrCollapse = 'collapse';
            if (document.getElementById('stepimage_0').src == urlOpened) {
                expandOrCollapse = 'expand';
            }

            for (var i = 0; i < this.options.CurrentWorkflow.DraftWorkflow.Steps.Step.length; i++) {

                var stepName = this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[i]["@Name"];
                var rowId = 'stepname_' + i;
                var imageId = 'stepimage_' + i;
                var collapsibleRowId = 'steprow-' + stepName.toLowerCase() + '_' + i + '_' + '0';
                this.expandOrCollapseWorkflowStep(rowId, imageId, collapsibleRowId, expandOrCollapse);

            }

        } catch (e) {
            console.log('Exception in expandOrCollapseAllWorkflowSteps(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in expandOrCollapseAllWorkflowSteps(): ' + e.message + ', ' + e.stack);
        }
    },

    downloadWorkflowJson: function () {
        try {
            console.log('In downloadWorkflowJson().');
            // THIS WORKS JUST COMMENTING OT FOR NOW>
            //alert('In downloadWorkflowJson(). This functionality is incomplete. Coming soon!');
            // Display a dialog box with a big textarea so that the contents can be copied and pasted.
            $("#divDisplayJsonDialog").dialog({
                modal: true,
                resizable: false,
                //closeText: "Cancel",
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                //title: 'Alert',
                width: "900",
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false,//, // This means when hiding just disappear with no effects.
                //buttons: {
                //    "Close": function () {
                //        $(this).dialog("close");
                //    }
                //}
                open: function (event, ui) {
                    $('.ui-widget-overlay').bind('click', function () { $("#divDisplayJsonDialog").dialog('close'); });
                } // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.
            });
            $("#divDisplayJsonDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            //var json = this.options.CurrentWorkflow;
            document.getElementById('spanDisplayJsonDialogTitle').innerHTML = 'Workflow JSON';
            $('#txtDisplayJsonDialogJSON').empty();






            var json = this.options.CurrentWorkflow.DraftWorkflow; //JSON.parse(thiz.options.Workflows[i].bwWorkflowJson);
            //var string = JSON.stringify(json, null, 2);
            //
            // Since the @EmailTemplate attribute doesn't work 100% correctly, probably due to the html elements in it, or perhaps quotes... we will go through and fix them up so that the text can be copied successfully.
            // THE WHOLE GOAL OF THIS EFFORT is to make it so that a workflow can be copied an dpasted in the browser from one place to another, preserving the email templates contained therein.
            //
            //var json = JSON.parse(thiz.options.Workflows[i].bwWorkflowJson);
            for (var i = 0; i < json.Steps.Step.length; i++) {
                if (json.Steps.Step[i]["@EmailTemplate"]) {
                    // IF WE GET HERE there is an email template.
                    var template = json.Steps.Step[i]["@EmailTemplate"];
                    debugger;

                    //template = template.replace(/["]/g, '&quot;'); // Replace double-quote with &quot;

                    console.log('');
                    console.log('===================================================================================');
                    console.log('This is where we make sure the email templates JSON works OK in the workflow JSON. xcx1');
                    console.log('===================================================================================');
                    console.log('');

                    template = template.replace(/\n/g, ''); // '<br />'); // I don't think we need these so just getting rid of them.

                    template = template.replace(/</g, '&lt;'); // Replace greater and lesser than characters.
                    template = template.replace(/>/g, '&gt;'); // Replace greater and lesser than characters.

                    //emailTemplate = emailTemplate.replace(/\\/g, '&bsol;'); // Backslash : \  : &#92; : &bsol;

                    json.Steps.Step[i]["@EmailTemplate"] = template; // This was already here need to put everywhere 2-3-2022!!!!!!!!!!!!!!!!!!! <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< xcx2-3-2022 TODD HILTZ
                }
                // EmailTemplateForSubject
                if (json.Steps.Step[i]["@EmailTemplateForSubject"]) {
                    // IF WE GET HERE there is an email template.
                    var template = json.Steps.Step[i]["@EmailTemplateForSubject"];
                    debugger;

                    //template = template.replace(/["]/g, '&quot;'); // Replace double-quote with &quot;

                    console.log('');
                    console.log('===================================================================================');
                    console.log('This is where we make sure the email templates JSON works OK in the workflow JSON. xcx2');
                    console.log('===================================================================================');
                    console.log('');

                    template = template.replace(/\n/g, ''); // '<br />'); // I don't think we need these so just getting rid of them.

                    template = template.replace(/</g, '&lt;'); // Replace greater and lesser than characters.
                    template = template.replace(/>/g, '&gt;'); // Replace greater and lesser than characters.

                    //emailTemplate = emailTemplate.replace(/\\/g, '&bsol;'); // Backslash : \  : &#92; : &bsol;

                    json.Steps.Step[i]["@EmailTemplateForSubject"] = template; // This was already here need to put everywhere 2-3-2022!!!!!!!!!!!!!!!!!!! <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< xcx2-3-2022 TODD HILTZ
                }
            }




            //$('#txtDisplayJsonDialogJSON').append(JSON.stringify(this.options.CurrentWorkflow.DraftWorkflow, null, 2)); // pretty print
            $('#txtDisplayJsonDialogJSON').append(JSON.stringify(json, null, 2)); // pretty print

        } catch (e) {
            console.log('Exception in bwWorkflowEditor.js.downloadWorkflowJson(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwWorkflowEditor.js.downloadWorkflowJson(): ' + e.message + ', ' + e.stack);
        }
    },

    displayEmailPreviewInDialog: function () {
        try {
            console.log('In displayEmailPreviewInDialog().');

            //

            $("#divEmailPreviewDialog").dialog({
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
                        $("#divEmailPreviewDialog").dialog('close');
                    });
                    //document.getElementById('txtCreateANewRoleDialog_RoleId').value = document.getElementById('textNewRoleId').value;
                    //document.getElementById('txtCreateANewRoleDialog_RoleName').value = document.getElementById('textNewRoleName').value;
                },
                close: function () {
                    //$(this).dialog('destroy').remove();
                }
            });
            $("#divEmailPreviewDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

        } catch (e) {
            console.log('Exception in displayEmailPreviewInDialog(): ' + e.message + ', ' + e.stack);
        }
    },
    selectEditEmailFor_OnChange: function () {
        try {
            console.log('In selectEditEmailFor_OnChange().');
            var emailTemplateTitle = document.getElementById('selectEditEmailFor').value;
            var emailTemplateForSubject;
            var emailTemplate;
            if (emailTemplateTitle == 'Informed') {
                emailTemplateForSubject = this.options.CurrentWorkflow.DraftWorkflow["EmailTemplateForSubject_Informed"];
                emailTemplate = this.options.CurrentWorkflow.DraftWorkflow["EmailTemplate_Informed"];
            } else if (emailTemplateTitle == 'Task Assigned') {
                emailTemplateForSubject = this.options.CurrentWorkflow.DraftWorkflow["EmailTemplateForSubject_TaskAssigned"];
                emailTemplate = this.options.CurrentWorkflow.DraftWorkflow["EmailTemplate_TaskAssigned"];
            } else if (emailTemplateTitle == 'Task Overdue') {
                emailTemplateForSubject = this.options.CurrentWorkflow.DraftWorkflow["@EmailTemplateForSubject_TaskOverdue"];
                emailTemplate = this.options.CurrentWorkflow.DraftWorkflow["@EmailTemplate_TaskOverdue"];
            } else if (emailTemplateTitle == 'Task Cancelled') {
                emailTemplateForSubject = this.options.CurrentWorkflow.DraftWorkflow["EmailTemplateForSubject_TaskCancelled"];
                emailTemplate = this.options.CurrentWorkflow.DraftWorkflow["EmailTemplate_TaskCancelled"];
            } else {
                alert('Unexpected emailTemplateTitle in selectEditEmailFor_OnChange(): ' + emailTemplateTitle);
            }
            if (emailTemplateForSubject && emailTemplateForSubject != '') {
                this.options.quillSubjectEditor.setText(emailTemplateForSubject);
            } else {
                this.options.quillSubjectEditor.setText('');
            }
            if (emailTemplate && emailTemplate != '') {
                this.options.quill.root.innerHTML = emailTemplate; //setText(emailTemplate);
            } else {
                this.options.quill.setText('');
            }


            //this.options.quill.on('text-change', function (delta, oldDelta, source) {
            //    if (source == 'api') {
            //        console.log("An API call triggered this change.");
            //    } else if (source == 'user') {
            //        console.log("A user action triggered this change.");






            //    }
            //});




        } catch (e) {
            console.log('Exception in selectEditEmailFor_OnChange(): ' + e.message + ', ' + e.stack);
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
                    //$(this).dialog('destroy').remove();
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
            var isAdmin = false;
            if (elementId.indexOf('steprow-admin_') > -1) {
                // This is the ADMIN section. Limit what can be done here, just want to be able to change the assigned user.
                isAdmin = true;
            }
            var thiz = this;
            //thiz.showProgress('Loading...');
            $('.activeEditRow').remove(); // This gets rid of the row editor... we should only display one at a time.
            $('.steprow-hidden').removeClass('steprow-hidden'); // Display the previous row again (if there is one).


            // Get the values from the hidden row.

            debugger; // 12-8-2021


            //var roleid = $('#' + elementId).find('.roleid').attr('bwOldValue');
            var roleid = $('#' + elementId).find('.rolename').attr('bwroleid'); // 12-8-2021
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




            //if (!isAdmin) {
            html += '<td class="selectroleorperson-editcell steprowcell">';
            //html += ' <img style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayPeoplePickerDialog\', \'' + 'txtApprover2FriendlyName' + '\', \'' + 'txtApprover2Id' + '\', \'' + 'txtApprover2Email' + '\');" src="images/addressbook-icon18x18.png">';
            //html += '&nbsp;' + rolename;
            //html += 'xcx98345';
            html += '</td>';
            //}





            if (isAdmin) {
                // Render the "RoleCategory" drop-down.
                //html += '<td class="steprowcell">';
                ////html += '<select style="padding:5px 5px 5px 5px;" id="selectRoleCategory" class="rolecategory-dropdown" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'RoleCategoryDropDown_Onchange\', \'' + elementId + '\');">';
                ////var rcs = ['Inform', 'Collaborator', 'Approver'];
                ////var rcs2 = ['Inform (Informed)', 'Collaborator (Consulted)', 'Approver (Accountable)'];
                ////for (var rci = 0; rci < rcs.length; rci++) {
                ////    if (rolecategory == rcs[rci]) {
                ////        html += '  <option value="' + rcs[rci] + '" selected>' + rcs2[rci] + '</option>';
                ////    } else {
                ////        html += '  <option value="' + rcs[rci] + '">' + rcs2[rci] + '</option>';
                ////    }
                ////}
                ////html += '</select>';
                //html += '</td>';

                html += '<td class="steprowcell">';
                html += '<select style="padding:5px 5px 5px 5px;" id="selectRoleCategory" class="rolecategory-dropdown">';
                //var rcs = ['Inform', 'Collaborator', 'Approver'];
                //var rcs2 = ['Inform (Informed)', 'Collaborator (Consulted)', 'Approver (Accountable)'];
                //for (var rci = 0; rci < rcs.length; rci++) {
                //    if (rolecategory == rcs[rci]) {
                //        html += '  <option value="' + rcs[rci] + '" selected>' + rcs2[rci] + '</option>';
                //    } else {
                //        html += '  <option value="' + rcs[rci] + '">' + rcs2[rci] + '</option>';
                //    }
                //}
                html += '  <option value="' + 'Approver' + '" selected>' + 'Approver (Accountable)' + '</option>';
                html += '</select>';















                html += '</td>';


            } else {
                // Render the "RoleCategory" drop-down.
                html += '<td class="steprowcell">';
                html += '<select style="padding:5px 5px 5px 5px;" id="selectRoleCategory" xcx="xcx9934-3" class="rolecategory-dropdown" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'RoleCategoryDropDown_Onchange\', \'' + elementId + '\');">';
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
            }


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
            html += '       <input xcx="xcx213324-5" style="padding:5px 10px 5px 10px;opacity:.4;width:70px;" type="button" disabled value="⚙ Edit">';
            html += '    </td>';
            html += '  </tr>';




            html += '  <tr>';
            html += '    <td>';
            html += '      <input type="button" style="padding:5px 10px 5px 10px;width:70px;cursor:pointer;" value="Save" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveAssignmentRow\', \'' + elementId + '\');" />';
            html += '    </td>';
            html += '  </tr>';
            if (!isAdmin) { // The ADMIN row/step cannot be deleted.
                html += '  <tr>';
                html += '    <td>';
                html += '      <input type="button" style="padding:5px 10px 5px 10px;width:70px;cursor:pointer;" value="Delete" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'deleteRoleCategory\', \'' + elementId + '\');" />';
                html += '    </td>';
                html += '  </tr>';
            }
            html += '  <tr>';
            html += '    <td>';
            html += '      <input type="button" style="padding:5px 10px 5px 10px;width:70px;cursor:pointer;" value="Cancel" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'cancelStepRowEditing\', \'' + elementId + '\');" />';
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



            if (isAdmin) {
                //debugger;
                thiz.renderActionsSection(elementId); // render the actions section
            } else {
                //debugger;
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
                        //debugger;
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


                // Added 4-20-2022
                if (rolecategory == 'Collaborator') { // Populate the actions ection
                    var actions = ['Review Completed'];
                    var x = elementId.split('_')[1];
                    var step = x.split('_')[0];
                    var row = elementId.split('_')[2];
                    for (var i = 0; i < actions.length; i++) {
                        var actionChecked = false;
                        var requireCommentsChecked = false;
                        //debugger;
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

                        var checkboxId = 'Action-' + actions[i].replace(' ', '') + '_' + step + '_' + row;
                        var childCheckboxId = 'RequireComments-' + actions[i].replace(' ', '') + '_' + step + '_' + row;
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
                console.log('xcx21434235-2 calling renderConditionsSection');
                thiz.renderConditionsSection(elementId, null, cond);
            }

            $('#' + elementId).addClass('steprow-hidden'); // Hide the row while we display it in editable-mode. This allows us to display it again when done editng, and also gives us a place to look up the old values.
            thiz.enableScrolling(); // This keeps the screen from jumping around.
            //thiz.hideProgress();

        } catch (e) {
            console.log('Exception in renderEditSteprow(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderEditSteprow(): ' + e.message + ', ' + e.stack);
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
                    this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Inform.splice(roleIndex, 1); // delete leaves a null, so we have to use splice.


                    // 1-24-2023
                    var selectedRequestTypeId; // If we get here, we can lookup the bwRequestTypeId from the selectRequestTypeDropDown drop-down.
                    $('#selectRequestTypeDropDown').find('option:selected').each(function (index, element) {
                        selectedRequestTypeId = element.value;
                    });
                    this.element.html(this.renderWorkflowEditor1(null, selectedRequestTypeId, stepIndex)); // Render the Workflow Editor. 
                    this.checkIfWeHaveToDisplayThePublishChangesButton();




                } else if (sourceRoleCategory == 'assign') {
                    this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign.splice(roleIndex, 1); // delete leaves a null, so we have to use splice.


                    // 1-24-2023
                    var selectedRequestTypeId; // If we get here, we can lookup the bwRequestTypeId from the selectRequestTypeDropDown drop-down.
                    $('#selectRequestTypeDropDown').find('option:selected').each(function (index, element) {
                        selectedRequestTypeId = element.value;
                    });
                    this.element.html(this.renderWorkflowEditor1(null, selectedRequestTypeId, stepIndex)); // Render the Workflow Editor. 
                    this.checkIfWeHaveToDisplayThePublishChangesButton();




                } else {
                    alert('ERROR: Invalid sourceRoleCategory in deleteRoleCategory().'); // We should never get here.
                }
            } else {
                // We should never get here!!!
                alert('ERROR: Failed to locate the step or role in the underlying json in deleteRoleCategory().');
            }
            //this._create();
            //} else {
            //    // do nothing.
            //}

        } catch (e) {
            console.log('Exception in deleteRoleCategory(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in deleteRoleCategory(): ' + e.message + ', ' + e.stack);
        }
    },

    displayWorkflowsConfigurationDialog: function () {
        try {
            console.log('In displayWorkflowsConfigurationDialog().');
            alert('In displayWorkflowsConfigurationDialog().');
            var thiz = this;

            var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            //var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            //var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            //var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            var isOpen = false;
            var selectedRequestType = 'all';
            //try {
            //    if ($('#divWorkflowsConfigurationDialog').dialog('isOpen')) {
            //        isOpen = true;
            //        $('#selectWorkflowRequestTypeDropDownInDialog2').find('option:selected').each(function (index, element) {
            //            selectedRequestType = element.value;
            //        });
            //    }
            //} catch (e) {
            //    // do nothing.
            //}
            if (isOpen == false) {
                $('#divWorkflowsConfigurationDialog').dialog({
                    modal: true,
                    resizable: false,
                    closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                    width: '1400',
                    dialogClass: "no-close", // No close button in the upper right corner.
                    hide: false, // This means when hiding just disappear with no effects.
                    open: function () {
                        try {
                            $('.ui-widget-overlay').bind('click', function () {
                                $("#divWorkflowsConfigurationDialog").dialog('close');
                            });



                            $.contextMenu({
                                selector: '.context-menu-workflowsconfiguration',
                                //trigger: 'hover',
                                //    delay : 500,
                                callback: function (key, options) {
                                    //var m = "clicked: " + key;
                                    //window.console && console.log(m) || alert(m);
                                    if (key == 'editworkflowjson') {
                                        //cmdDisplayArchivePageTrashbinContents();
                                        //alert('This functionality is incomplete. Coming soon! ')
                                        thiz.displayEditWorkflowJsonDialog('xcxdontknow123');
                                    }
                                },
                                items: {
                                    "editworkflowjson": {
                                        name: "Edit Workflow JSON", icon: "edit"
                                    }
                                }
                            });

                        } catch (e) {
                            console.log('Exception in displayWorkflowsConfigurationDialog().: ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in displayWorkflowsConfigurationDialog().: ' + e.message + ', ' + e.stack);
                        }

                    },
                    close: function () {
                        $('#divWorkflowsConfigurationDialog').dialog('destroy');
                    }
                });
                //$("#divCreateANewRoleDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
            }

            // This can show up in a few places. On the "Configuration > Participants" page, in a modal dialog, etc.
            //console.log('In displayWorkflowsConfigurationDialog().'); //' + elementId + ').');
            var html = '';

            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                bwWorkflowAppId: workflowAppId,
                bwRequestTypeId: 'ALL',
                // bwRequestType: 'ALL'
                isActive: true
            };
            $.ajax({
                url: thiz.options.operationUriPrefix + "_bw/workflowconfiguration", // "odata/WorkflowConfiguration2/" + tenantId + '/' + workflowAppId + '/' + 'all',
                type: "POST",
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (result) {
                    try {
                        var workflows = result.value;
                        //
                        // At this point we have the workflow, however not all RequestTypes may have a workflow, so iterating through them to make sure we also display all Request types.
                        //
                        debugger;
                        var bwEnabledRequestTypes = $('.bwAuthentication').bwAuthentication('option', 'bwEnabledRequestTypes');
                        var requestTypes = bwEnabledRequestTypes.EnabledItems;
                        for (var i = 0; i < requestTypes.length; i++) {
                            var requestTypeHasAtLeastOneWorkflow = false;
                            for (var j = 0; j < workflows.length; j++) {
                                if (requestTypes[i].bwRequestTypeId == workflows[j].bwRequestTypeId) {
                                    requestTypeHasAtLeastOneWorkflow = true;
                                    break;
                                }
                            }
                            if (requestTypeHasAtLeastOneWorkflow == false) { // This request type has no workflow yet, but we want it to show up in the list, so adding it here.
                                emptyWorkflow = {
                                    Modified: '',
                                    ModifiedByEmail: '',
                                    ModifiedByFriendlyName: '',
                                    ModifiedById: '',
                                    bwRequestType: requestTypes[i].PluralName,
                                    bwRequestTypeId: requestTypes[i].bwRequestTypeId,
                                    bwTenantId: tenantId,
                                    bwWorkflowActive: false,
                                    bwWorkflowAppId: workflowAppId,
                                    bwWorkflowId: '',
                                    bwWorkflowJson: 'NEEDS_TO_BE_CREATED'
                                }
                                workflows.push(emptyWorkflow);
                            } else {

                            }
                        }
                        //
                        // Now we want to go through and set the RequestType of the workflows, so that it is easy to read and not just a guid.
                        //
                        for (var i = 0; i < workflows.length; i++) {
                            for (var j = 0; j < requestTypes.length; j++) {
                                if (workflows[i].bwRequestTypeId == requestTypes[j].bwRequestTypeId) {
                                    //
                                    // Check if the item has a bwRequestType
                                    //
                                    if (workflows[i].bwRequestType) {
                                        // Do nothing
                                    } else {
                                        workflows[i].bwRequestType = requestTypes[j].PluralName
                                    }
                                    break;
                                }
                            }
                        }
                        debugger;

                        var html = '';
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
                        html += '.alternatingRowDark:hover { background-color:lightgoldenrodyellow; }'; // 
                        html += '.roleName { white-space:nowrap; }';
                        html += '</style>';

                        // File folder UI.
                        html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                        html += '  <tr>';
                        html += '    <td>';
                        //
                        html += '<br />';
                        html += '<div class="codeSnippetContainer" id="code-snippet-4" xmlns="">';
                        html += '    <div class="codeSnippetContainerTabs">';
                        html += '        <div class="codeSnippetContainerTabSingle" dir="ltr"><a>&nbsp;&nbsp;Workflows&nbsp;&nbsp;</a></div>';
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
                        // end File folder UI top section.

                        html += '<table class="dataGridTable">';

                        html += '  <tr style="font-size:10pt;font-weight:normal;color:black;">';
                        html += '    <td></td>';
                        html += '    <td colspan="9">';
                        html += '       <span style="padding: 4px 4px 4px 4px;border:1px solid lightblue;cursor:pointer;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'cmdDisplayDeleteWorkflowsDialog\');">';
                        html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png">&nbsp;Delete';
                        html += '       </span>';
                        html += '    </td>';
                        html += '  </tr>';

                        html += '  <tr class="headerRow">';
                        html += '    <td><input type="checkbox" id="checkboxTogglePendingEmailCheckboxes" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'toggleWorkflowConfigurationCheckboxes\', this);" /></td>';
                        html += '    <td>Request Type</td>';
                        html += '    <td>Request Type Id</td>';
                        html += '    <td>Active</td>';
                        html += '    <td>Created Date</td>';
                        html += '    <td>Created By</td>';
                        html += '    <td>^Last Modified Date</td>';
                        html += '    <td>Last Modified By</td>';
                        html += '    <td>bwWorkflowId</td>';
                        html += '    <td>bwWorkflowJson</td>';
                        html += '    <td>bwWorkflowAppId</td>';
                        html += '    <td></td>';
                        html += '    <td></td>';
                        html += '  </tr>';
                        var alternatingRow = 'light'; // Use this to color the rows.
                        for (var i = 0; i < workflows.length; i++) {
                            if (alternatingRow == 'light') {
                                html += '  <tr class="alternatingRowLight" style="cursor:pointer;" >';
                                alternatingRow = 'dark';
                            } else {
                                html += '  <tr class="alternatingRowDark" style="cursor:pointer;" >';
                                alternatingRow = 'light';
                            }
                            var isTheActiveWorkflow = Boolean(workflows[i].isActive);
                            if (workflows[i].isActive == true) {
                                html += '    <td><input disabled="" type="checkbox" class="workflowCheckbox" bwworkflowid="' + workflows[i].bwWorkflowId + '" /></td>';
                            } else {
                                html += '    <td><input type="checkbox" class="workflowCheckbox" bwworkflowid="' + workflows[i].bwWorkflowId + '" /></td>';
                            }

                            html += '       <td class="roleId">' + workflows[i].bwRequestType + '</td>';
                            html += '       <td class="roleId">' + workflows[i].bwRequestTypeId + '</td>';
                            if (workflows[i].isActive == true) {
                                html += '       <td class="roleName" style="color:green;">✔ ' + workflows[i].isActive + '</td>';
                            } else {
                                html += '       <td class="roleName" style="color:gray;">' + workflows[i].isActive + '</td>';
                            }
                            html += '       <td class="roleDetails">' + workflows[i].Created + '</td>';
                            html += '       <td class="roleDetails">' + workflows[i].CreatedBy + '</td>';
                            html += '       <td class="roleDetails">' + workflows[i].Modified + '</td>';
                            html += '       <td class="roleDetails">' + workflows[i].ModifiedByFriendlyName + '</td>';
                            html += '       <td class="roleDetails">' + workflows[i].bwWorkflowId + '</td>';

                            if (workflows[i].bwWorkflowJson && workflows[i].bwWorkflowJson != 'NEEDS_TO_BE_CREATED') {
                                html += '       <td class="roleDetails">Ok</td>';
                            } else {
                                html += '<td></td>';
                            }

                            html += '<td>' + workflowAppId + '</td>'; // using for troubleshooting. 7-6-2023.

                            if (workflows[i].bwWorkflowJson == 'NEEDS_TO_BE_CREATED') {
                                //html += '   <td></td>'; 
                                html += '   <td colspan="2"><input style="padding:5px 10px 5px 10px;width:200px;color:tomato;" type="button" value="CREATE WORKFLOW" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'createNewWorkflowJson\', \'' + workflows[i].bwRequestType + '\');" /></td>';
                            } else {


                                if (workflows[i].isActive == true) {
                                    html += '   <td><input style="padding:5px 10px 5px 10px;width:100px;" id="btnActivateRaciConfiguration" type="button" value="De-activate" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayDeactivateSelectedWorkflowDialog\', \'' + workflows[i].bwWorkflowId + '\');" /></td>';
                                } else {
                                    html += '   <td><input style="padding:5px 10px 5px 10px;width:100px;" id="btnActivateRaciConfiguration" type="button" value="Activate" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayActivateSelectedWorkflowDialog\', \'' + workflows[i].bwWorkflowId + '\');" /></td>';
                                }




                                html += '   <td><input style="padding:5px 10px 5px 10px;width:100px;" type="button" value="Edit JSON" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayEditWorkflowJsonDialog\', \'' + workflows[i].bwWorkflowId + '\');" /></td>';
                            }


                            html += '</tr>';
                        }
                        html += '</table>';

                        // File folder UI bottom section.
                        html += '<br />';
                        html += '                </span>';
                        html += '            </div>';
                        html += '        </div>';
                        html += '    </div>';
                        html += '</div>';
                        html += '<br />';
                        html += '    </td>';
                        html += '  </tr>';
                        html += '</table>';
                        // end File folder UI bottom section.

                        html += '<div style="display:none;" id="divDeleteWorkflowsDialog">';
                        html += '   <table style="width:100%;">';
                        html += '       <tr>';
                        html += '           <td style="width:90%;">';
                        html += '               <span id="spanDeletePendingEmailsDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">Delete Workflows</span>';
                        html += '           </td>';
                        html += '           <td style="width:9%;"></td>';
                        html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
                        html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divDeleteWorkflowsDialog\').dialog(\'close\');">X</span>';
                        html += '           </td>';
                        html += '       </tr>';
                        html += '   </table>';
                        html += '   <br /><br />';
                        html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                        html += '   <span id="spanDeleteWorkflowsDialogContentText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;">';
                        html += '[spanDeleteWorkflowsDialogContentText]';
                        html += '   </span>';
                        html += '   <br /><br /><br />';
                        html += '   <div class="divSignInButton" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'deleteSelectedWorkflows\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
                        html += '       Delete the Workflows';
                        html += '   </div>';
                        html += '   <br /><br />';
                        html += '   <div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em; font-weight: bold;" onclick="$(\'#divDeleteWorkflowsDialog\').dialog(\'close\');">';
                        html += '       Cancel';
                        html += '   </div>';
                        html += '   <br /><br />';
                        html += '</div>';

                        document.getElementById('spanWorkflowsMaintenanceDialogContent').innerHTML = html;

                    } catch (e) {
                        console.log('Exception in displayWorkflowsConfigurationDialog().:2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in displayWorkflowsConfigurationDialog().:2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data) {
                    //lpSpinner.Hide();
                    console.log(' : ' + JSON.stringify(data));
                    var msg;
                    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                    } else {
                        msg = JSON.stringify(data);
                    }

                    console.log('Exception in bwWorkflowEditor.js.renderWorkflowsDropDownList().xx.Get: ' + JSON.stringify(data));
                    displayAlertDialog('Exception in bwWorkflowEditor.js.renderWorkflowsDropDownList().xx.Get: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                    //var error = JSON.parse(data.responseText)["odata.error"];
                    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                }
            });

        } catch (e) {
            console.log('Exception in displayWorkflowsConfigurationDialog():3: ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in displayWorkflowsConfigurationDialog():3: ' + e.message + ', ' + e.stack);
        }
    },


    deleteWorkflow: function (bwWorkflowId) {
        try {
            console.log('In deleteWorkflow(). bwWorkflowAppId: ' + this.options.bwWorkflowAppId + ', bwWorkflowId: ' + bwWorkflowId);
            var thiz = this;
            $.ajax({
                url: this.options.operationUriPrefix + "odata/deleteworkflow2/" + tenantId + '/' + workflowAppId + '/' + bwWorkflowId,
                dataType: "json",
                contentType: "application/json",
                type: "Get",
                timeout: this.options.ajaxTimeout
            }).done(function (result) {
                try {
                    debugger;
                    console.log('In deleteWorkflow(). result.message: ' + result.message);
                    if (result.message != 'SUCCESS') {

                        thiz.displayAlertDialog(result.message);

                    } else {
                        // Display a dialog with an "Undo" button!!!!
                        //alert('Successfully updated the database. THIS WORKFLOW CHANGE WILL TAKE PLACE IMMEDIATELY!');
                        $("#divUndoWorkflowDeletionDialog").dialog({
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
                                        $('#divUndoWorkflowDeletionDialog').dialog('close');
                                    });
                                } catch (e) {
                                    console.log('Exception in deleteWorkflow(): ' + e.message + ', ' + e.stack);
                                }
                            },
                            close: function () {
                                //location.reload(); // When the user closes this dialog, we regenerate the screen to reflect the newly created and activated workflow.

                                thiz.renderWorkflowsListForEditing('spanWorkflowsMaintenanceDialogWorkflowActivationSection');


                            }
                        });
                        $('#divUndoWorkflowActivationDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
                    }
                } catch (e) {
                    console.log('Exception in deleteWorkflow(): ' + e.message + ', ' + e.stack);
                }
            }).fail(function (data) {
                //lpSpinner.Hide();
                console.log('In xx2.fail(): ' + JSON.stringify(data));
                var msg;
                if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                } else {
                    msg = JSON.stringify(data);
                }
                alert('Exception in deleteWorkflow.Get: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                console.log('Exception in deleteWorkflow.Get: ' + JSON.stringify(data));
                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                //var error = JSON.parse(data.responseText)["odata.error"];
                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            });
        } catch (e) {
            console.log('Exception in deleteWorkflow(): ' + e.message + ', ' + e.stack);
        }
    },

    displayDeleteWorkflowDialog: function (bwWorkflowId, bwRequestType) {
        try {
            console.log('In displayDeleteWorkflowDialog(). bwWorkflowId: ' + bwWorkflowId + ', bwRequestType: ' + bwRequestType);
            $("#divDeleteAWorkflowDialog").dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '800',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divDeleteAWorkflowDialog").dialog('close');
                    });

                    var html = '';
                    html += '        <div id="divDeleteAWorkflowDialogReassignTasks" class="divSignInButton" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'deleteWorkflow\', \'' + bwWorkflowId + '\');" style="width:90%;text-align:center;line-height:0.8em;font-weight:bold;">';
                    html += '            Delete';
                    html += '        </div>';
                    document.getElementById('spanDeleteWorkflowButton').innerHTML = html;
                    //document.getElementById('txtCreateANewRoleDialog_RoleId').value = document.getElementById('textNewRoleId').value;
                    //document.getElementById('txtCreateANewRoleDialog_RoleName').value = document.getElementById('textNewRoleName').value;
                }
            });
            $("#divDeleteAWorkflowDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
        } catch (e) {
            console.log('Exception in displayDeleteWorkflowDialog(): ' + e.message + ', ' + e.stack);
        }
    },

    displayActivateSelectedWorkflowDialog: function (bwWorkflowId, bwRequestType) {
        try {
            console.log('In displayActivateSelectedWorkflowDialog(). bwWorkflowId: ' + bwWorkflowId + ', bwRequestType: ' + bwRequestType);
            $('#divActivateSelectedWorkflowDialog').dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '550',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divActivateSelectedWorkflowDialog").dialog('close');
                    });

                    if (bwRequestType) {
                        // do nothing.
                    } else {
                        var selectedRequestType;
                        $('#selectWorkflowRequestTypeDropDownInActivateSelectedWorkflowDialog').find('option:selected').each(function (index, element) {
                            selectedRequestType = element.value;
                        });
                        bwRequestType = selectedRequestType;
                    }
                    //debugger;
                    $('#selectWorkflowRequestTypeDropDownInActivateSelectedWorkflowDialog option[value="' + bwRequestType + '"]').attr('selected', 'selected');

                    var html = '';
                    html += '        <div id="divActivateSelectedWorkflowDialogReassignTasks" class="divSignInButton" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'activateSelectedWorkflow\', \'' + bwWorkflowId + '\', \'' + bwRequestType + '\');" style="width:90%;text-align:center;line-height:0.8em;font-weight:bold;">';
                    html += '            Activate';
                    html += '        </div>';
                    document.getElementById('spanActivateSelectedWorkflowButton').innerHTML = html;
                    //document.getElementById('txtCreateANewRoleDialog_RoleId').value = document.getElementById('textNewRoleId').value;
                    //document.getElementById('txtCreateANewRoleDialog_RoleName').value = document.getElementById('textNewRoleName').value;
                }
            });
            //$("#divActivateSelectedWorkflowDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
        } catch (e) {
            console.log('Exception in displayActivateSelectedWorkflowDialog(): ' + e.message + ', ' + e.stack);
        }
    },







    displayDeactivateSelectedWorkflowDialog: function (bwWorkflowId, bwRequestType) {
        try {
            console.log('In displayDeactivateSelectedWorkflowDialog(). bwWorkflowId: ' + bwWorkflowId + ', bwRequestType: ' + bwRequestType);
            $('#divDeactivateSelectedWorkflowDialog').dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '550',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divDeactivateSelectedWorkflowDialog").dialog('close');
                    });

                    //if (bwRequestType) {
                    //    // do nothing.
                    //} else {
                    //    var selectedRequestType;
                    //    $('#selectWorkflowRequestTypeDropDownInActivateSelectedWorkflowDialog').find('option:selected').each(function (index, element) {
                    //        selectedRequestType = element.value;
                    //    });
                    //    bwRequestType = selectedRequestType;
                    //}
                    ////debugger;
                    //$('#selectWorkflowRequestTypeDropDownInActivateSelectedWorkflowDialog option[value="' + bwRequestType + '"]').attr('selected', 'selected');

                    var html = '';
                    html += '        <div id="divDeactivateSelectedWorkflowDialogReassignTasks" class="divSignInButton" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'deactivateSelectedWorkflow\', \'' + bwWorkflowId + '\', \'' + bwRequestType + '\');" style="width:90%;text-align:center;line-height:0.8em;font-weight:bold;">';
                    html += '            De-activate xcx2134';
                    html += '        </div>';
                    document.getElementById('spanDeactivateSelectedWorkflowButton').innerHTML = html;
                    //document.getElementById('txtCreateANewRoleDialog_RoleId').value = document.getElementById('textNewRoleId').value;
                    //document.getElementById('txtCreateANewRoleDialog_RoleName').value = document.getElementById('textNewRoleName').value;
                }
            });
            //$("#divActivateSelectedWorkflowDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
        } catch (e) {
            console.log('Exception in displayDeactivateSelectedWorkflowDialog(): ' + e.message + ', ' + e.stack);
        }
    },







    activateSelectedWorkflow: function (bwWorkflowId, bwRequestType) {
        try {
            // This is where the user has selected to activate a workflow from the Workflow Configuration dialog.
            debugger;
            var thiz = this;
            var selectedRequestType;
            $('#selectWorkflowRequestTypeDropDownInActivateSelectedWorkflowDialog').find('option:selected').each(function (index, element) {
                selectedRequestType = element.value;
            });
            console.log('In activateSelectedWorkflow(). selectedRequestType: ' + selectedRequestType);
            if (confirm("Are you certain you wish to activate this workflow?")) {
                //this.showProgress('Activating your Selected Workflow...');
                if (selectedRequestType == bwRequestType) {
                    // Just activate the workflow. If they were different, we would have to publish instead.
                    $.ajax({
                        url: thiz.options.operationUriPrefix + "odata/activateworkflow2/" + tenantId + '/' + workflowAppId + '/' + selectedRequestType + '/' + bwWorkflowId,
                        dataType: "json",
                        contentType: "application/json",
                        type: "Get",
                        timeout: thiz.options.ajaxTimeout
                    }).done(function (result) {
                        try {
                            console.log('In activateSelectedWorkflow(). activateworkflow2. result.message: ' + result.message);
                            if (result.message != 'SUCCESS') {
                                thiz.displayAlertDialog(result.message);
                            } else {
                                // Display a dialog with an "Undo" button!!!!
                                //alert('Successfully updated the database. THIS WORKFLOW CHANGE WILL TAKE PLACE IMMEDIATELY!');
                                alert('xcx23123-1 displaying workflow published dialog');
                                $("#divUndoWorkflowActivationDialog").dialog({
                                    modal: true,
                                    resizable: false,
                                    closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                                    width: '800',
                                    dialogClass: 'no-close', // No close button in the upper right corner.
                                    hide: false, // This means when hiding just disappear with no effects.
                                    open: function () {
                                        try {
                                            $('.ui-widget-overlay').bind('click', function () {
                                                $('#divUndoWorkflowActivationDialog').dialog('close');
                                            });
                                        } catch (e) {
                                            console.log('Exception in activateSelectedWorkflow().divUndoWorkflowActivationDialog.open(): ' + e.message + ', ' + e.stack);
                                        }
                                    },
                                    close: function () {
                                        var promise = thiz.loadWorkflowsAndCurrentWorkflow(selectedRequestType);
                                        promise.then(function (result) {
                                            try {
                                                $('#divUndoWorkflowActivationDialog').dialog("destroy");
                                                $('#divActivateSelectedWorkflowDialog').dialog('close');
                                                $('#divWorkflowsConfigurationDialog').dialog('close');
                                                thiz.renderWorkflowEditor2();
                                                thiz.checkIfWeHaveToDisplayThePublishChangesButton();
                                            } catch (e) {
                                                console.log('Exception in bwWorkflowEditor._create().loadWorkflowsAndCurrentWorkflow(): ' + e.message + ', ' + e.stack);
                                            }
                                        });
                                    }
                                });
                                $('#divUndoWorkflowActivationDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
                            }
                        } catch (e) {
                            console.log('Exception in raci.html.activateSelectedWorkflow().xx.update: ' + e.message + ', ' + e.stack);
                        }
                    }).fail(function (data) {
                        //lpSpinner.Hide();
                        console.log('In xx2.fail(): ' + JSON.stringify(data));
                        var msg;
                        if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                            msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                        } else {
                            msg = JSON.stringify(data);
                        }
                        alert('Exception in raci.html.activateSelectedWorkflow.Get: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                        console.log('Exception in raci.html.activateSelectedWorkflow.Get: ' + JSON.stringify(data));
                        //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                        //var error = JSON.parse(data.responseText)["odata.error"];
                        //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                    });
                } else {
                    // Since the request types are different, we ahve to "Publish". A new workflow will be created and activated for this request type.
                    //alert('Since the request types are different, we have to "Publish". A new workflow will be created and activated for this request type. This functionality is incomplete. Coming soon! eg: publishWorkflowConfigurationAndActivate');
                    var bwWorkflowJson; // Find the workflow we are copying from.
                    for (var i = 0; i < thiz.options.Workflows.length; i++) {
                        if (bwWorkflowId == thiz.options.Workflows[i].bwWorkflowId) {
                            bwWorkflowJson = thiz.options.Workflows[i].bwWorkflowJson;
                            break;
                        }
                    }
                    //debugger;
                    var json = {
                        bwTenantId: tenantId,
                        bwWorkflowAppId: workflowAppId,
                        CreatedBy: participantFriendlyName,
                        CreatedById: participantId,
                        CreatedByEmail: participantEmail,
                        Description: '',
                        bwWorkflowJson: bwWorkflowJson, //thiz.options.CurrentWorkflow.Workflow), //JSON.stringify(thiz.options.CurrentWorkflow), // WE KNOW WE ARE NOT GETTING THE CORRECT JSON HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                        bwRequestType: selectedRequestType
                    };
                    $.ajax({
                        url: thiz.options.operationUriPrefix + "odata/publishworkflow3",
                        type: "Post",
                        timeout: thiz.options.ajaxTimeout,
                        data: json,
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        }
                    }).success(function (result) {
                        try {
                            //debugger;
                            console.log('In bwWorkflowEditor.js.publishWorkflowConfigurationAndActivate().post: Successfully updated DB. result: ' + JSON.stringify(result)); // using (' + JSON.stringify(json) + ').');
                            // Display a dialog with an "Undo" button!!!!
                            alert('xcx23123-2 displaying workflow published dialog');
                            $("#divUndoWorkflowActivationDialog").dialog({
                                modal: true,
                                resizable: false,
                                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                                width: '800',
                                dialogClass: 'no-close', // No close button in the upper right corner.
                                hide: false, // This means when hiding just disappear with no effects.
                                open: function () {
                                    $('.ui-widget-overlay').bind('click', function () {
                                        $('#divUndoWorkflowActivationDialog').dialog('close');
                                    });
                                },
                                close: function () {
                                    var promise = thiz.loadWorkflowsAndCurrentWorkflow(selectedRequestType);
                                    promise.then(function (result) {
                                        try {
                                            $('#divUndoWorkflowActivationDialog').dialog("destroy");
                                            $('#divActivateSelectedWorkflowDialog').dialog('close');
                                            $('#divWorkflowsConfigurationDialog').dialog('close');
                                            thiz.renderWorkflowEditor2();
                                            thiz.checkIfWeHaveToDisplayThePublishChangesButton();
                                        } catch (e) {
                                            console.log('Exception in bwWorkflowEditor._create().loadWorkflowsAndCurrentWorkflow(): ' + e.message + ', ' + e.stack);
                                        }
                                    });
                                }
                            });
                            $('#divUndoWorkflowActivationDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();

                            //thiz.options.CurrentWorkflow.DraftWorkflow = JSON.parse(JSON.stringify(thiz.options.CurrentWorkflow.Workflow)); 
                            //thiz.checkIfWeHaveToDisplayThePublishChangesButton();

                        } catch (e) {
                            console.log('Exception in bwWorkflowEditor.js.publishWorkflowConfigurationAndActivate().xx.update: ' + e.message + ', ' + e.stack);
                            alert('Exception in bwWorkflowEditor.js.publishWorkflowConfigurationAndActivate().xx.update: ' + e.message + ', ' + e.stack);
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
                        console.log('Fail in bwWorkflowEditor.js.publishWorkflowConfigurationAndActivate().xx.update: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
                        alert('Fail in bwWorkflowEditor.js.publishWorkflowConfigurationAndActivate().xx.update: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                        //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                        //var error = JSON.parse(data.responseText)["odata.error"];
                        //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                    });
                }
            }
        } catch (e) {
            console.log('Exception in activateSelectedWorkflow(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in activateSelectedWorkflow(): ' + e.message + ', ' + e.stack);
        }
    },



















    deactivateSelectedWorkflow: function (bwWorkflowId, bwRequestType) {
        try {
            // This is where the user has selected to activate a workflow from the Workflow Configuration dialog.
            var thiz = this;
            //var selectedRequestType;
            //$('#selectWorkflowRequestTypeDropDownInActivateSelectedWorkflowDialog').find('option:selected').each(function (index, element) {
            //    selectedRequestType = element.value;
            //});
            console.log('In activateSelectedWorkflow().'); // selectedRequestType: ' + selectedRequestType);
            if (confirm("Are you certain you wish to activate this workflow?")) {
                //this.showProgress('Activating your Selected Workflow...');
                //if (selectedRequestType == bwRequestType) {
                // Just activate the workflow. If they were different, we would have to publish instead.
                $.ajax({
                    //url: thiz.options.operationUriPrefix + "odata/activateworkflow2/" + tenantId + '/' + workflowAppId + '/' + selectedRequestType + '/' + bwWorkflowId,
                    url: thiz.options.operationUriPrefix + "odata/deactivateworkflow2/" + tenantId + '/' + workflowAppId + '/' + selectedRequestType + '/' + bwWorkflowId,
                    dataType: "json",
                    contentType: "application/json",
                    type: "Get"//,
                    //timeout: thiz.options.ajaxTimeout
                }).done(function (result) {
                    try {
                        console.log('In deactivateSelectedWorkflow(). activateworkflow2. result.message: ' + result.message);
                        if (result.message != 'SUCCESS') {
                            thiz.displayAlertDialog(result.message);
                        } else {
                            // Display a dialog with an "Undo" button!!!!
                            //alert('Successfully updated the database. THIS WORKFLOW CHANGE WILL TAKE PLACE IMMEDIATELY!');
                            alert('xcx23123-3 displaying workflow published dialog');
                            $("#divUndoWorkflowActivationDialog").dialog({
                                modal: true,
                                resizable: false,
                                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                                width: '800',
                                dialogClass: 'no-close', // No close button in the upper right corner.
                                hide: false, // This means when hiding just disappear with no effects.
                                open: function () {
                                    try {
                                        $('.ui-widget-overlay').bind('click', function () {
                                            $('#divUndoWorkflowActivationDialog').dialog('close');
                                        });
                                    } catch (e) {
                                        console.log('Exception in activateSelectedWorkflow().divUndoWorkflowActivationDialog.open(): ' + e.message + ', ' + e.stack);
                                    }
                                },
                                close: function () {
                                    var promise = thiz.loadWorkflowsAndCurrentWorkflow(selectedRequestType);
                                    promise.then(function (result) {
                                        try {
                                            $('#divUndoWorkflowActivationDialog').dialog("destroy");
                                            $('#divActivateSelectedWorkflowDialog').dialog('close');
                                            $('#divWorkflowsConfigurationDialog').dialog('close');
                                            thiz.renderWorkflowEditor2();
                                            thiz.checkIfWeHaveToDisplayThePublishChangesButton();
                                        } catch (e) {
                                            console.log('Exception in bwWorkflowEditor._create().loadWorkflowsAndCurrentWorkflow(): ' + e.message + ', ' + e.stack);
                                        }
                                    });
                                }
                            });
                            $('#divUndoWorkflowActivationDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
                        }
                    } catch (e) {
                        console.log('Exception in raci.html.activateSelectedWorkflow().xx.update: ' + e.message + ', ' + e.stack);
                    }
                }).fail(function (data) {
                    //lpSpinner.Hide();
                    console.log('In xx2.fail(): ' + JSON.stringify(data));
                    var msg;
                    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                    } else {
                        msg = JSON.stringify(data);
                    }
                    alert('Exception in raci.html.deactivateSelectedWorkflow.Get: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                    console.log('Exception in raci.html.deactivateSelectedWorkflow.Get: ' + JSON.stringify(data));
                    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                    //var error = JSON.parse(data.responseText)["odata.error"];
                    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                });
                //} else {
                //    // Since the request types are different, we ahve to "Publish". A new workflow will be created and activated for this request type.
                //    //alert('Since the request types are different, we have to "Publish". A new workflow will be created and activated for this request type. This functionality is incomplete. Coming soon! eg: publishWorkflowConfigurationAndActivate');
                //    var bwWorkflowJson; // Find the workflow we are copying from.
                //    for (var i = 0; i < thiz.options.Workflows.length; i++) {
                //        if (bwWorkflowId == thiz.options.Workflows[i].bwWorkflowId) {
                //            bwWorkflowJson = thiz.options.Workflows[i].bwWorkflowJson;
                //            break;
                //        }
                //    }
                //    //debugger;
                //    var json = {
                //        bwTenantId: tenantId,
                //        bwWorkflowAppId: workflowAppId,
                //        CreatedBy: participantFriendlyName,
                //        CreatedById: participantId,
                //        CreatedByEmail: participantEmail,
                //        Description: '',
                //        bwWorkflowJson: bwWorkflowJson, //thiz.options.CurrentWorkflow.Workflow), //JSON.stringify(thiz.options.CurrentWorkflow), // WE KNOW WE ARE NOT GETTING THE CORRECT JSON HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                //        bwRequestType: selectedRequestType
                //    };
                //    $.ajax({
                //        url: thiz.options.operationUriPrefix + "odata/publishworkflow3",
                //        type: "Post",
                //        timeout: thiz.options.ajaxTimeout,
                //        data: json,
                //        headers: {
                //            "Accept": "application/json; odata=verbose"
                //        }
                //    }).success(function (result) {
                //        try {
                //            //debugger;
                //            console.log('In bwWorkflowEditor.js.publishWorkflowConfigurationAndActivate().post: Successfully updated DB. result: ' + JSON.stringify(result)); // using (' + JSON.stringify(json) + ').');
                //            // Display a dialog with an "Undo" button!!!!
                //            $("#divUndoWorkflowActivationDialog").dialog({
                //                modal: true,
                //                resizable: false,
                //                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                //                width: '800',
                //                dialogClass: 'no-close', // No close button in the upper right corner.
                //                hide: false, // This means when hiding just disappear with no effects.
                //                open: function () {
                //                    $('.ui-widget-overlay').bind('click', function () {
                //                        $('#divUndoWorkflowActivationDialog').dialog('close');
                //                    });
                //                },
                //                close: function () {
                //                    var promise = thiz.loadWorkflowsAndCurrentWorkflow(selectedRequestType);
                //                    promise.then(function (result) {
                //                        try {
                //                            $('#divUndoWorkflowActivationDialog').dialog("destroy");
                //                            $('#divActivateSelectedWorkflowDialog').dialog('close');
                //                            $('#divWorkflowsConfigurationDialog').dialog('close');
                //                            thiz.renderWorkflowEditor2();
                //                            thiz.checkIfWeHaveToDisplayThePublishChangesButton();
                //                        } catch (e) {
                //                            console.log('Exception in bwWorkflowEditor._create().loadWorkflowsAndCurrentWorkflow(): ' + e.message + ', ' + e.stack);
                //                        }
                //                    });
                //                }
                //            });
                //            $('#divUndoWorkflowActivationDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();

                //            //thiz.options.CurrentWorkflow.DraftWorkflow = JSON.parse(JSON.stringify(thiz.options.CurrentWorkflow.Workflow)); 
                //            //thiz.checkIfWeHaveToDisplayThePublishChangesButton();

                //        } catch (e) {
                //            console.log('Exception in bwWorkflowEditor.js.publishWorkflowConfigurationAndActivate().xx.update: ' + e.message + ', ' + e.stack);
                //            alert('Exception in bwWorkflowEditor.js.publishWorkflowConfigurationAndActivate().xx.update: ' + e.message + ', ' + e.stack);
                //        }
                //    }).error(function (data, errorCode, errorMessage) {
                //        debugger;
                //        //thiz.hideProgress();
                //        var msg;
                //        if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                //            msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                //        } else {
                //            msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
                //        }
                //        console.log('Fail in bwWorkflowEditor.js.publishWorkflowConfigurationAndActivate().xx.update: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
                //        alert('Fail in bwWorkflowEditor.js.publishWorkflowConfigurationAndActivate().xx.update: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                //        //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                //        //var error = JSON.parse(data.responseText)["odata.error"];
                //        //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                //    });
                //}
            }
        } catch (e) {
            console.log('Exception in activateSelectedWorkflow(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in activateSelectedWorkflow(): ' + e.message + ', ' + e.stack);
        }
    },




















    resetRaciConfiguration: function () {
        try {
            var thiz = this;
            //var workflowToActivate_Id;
            //$('#spanWorkflowsDropDownList').find('option:selected').each(function (index, element) {
            //    workflowToActivate_Id = element.value;
            //});
            //console.log('In activateSelectedWorkflow(). workflowToActivate_Id: ' + workflowToActivate_Id);
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
                alert('Exception in raci.html.activateSelectedWorkflow.Get: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                console.log('Exception in raci.html.activateSelectedWorkflow.Get: ' + JSON.stringify(data));
                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                //var error = JSON.parse(data.responseText)["odata.error"];
                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            });
            //}
        } catch (e) {
            console.log('Exception in activateSelectedWorkflow(): ' + e.message + ', ' + e.stack);
        }
    },
    publishWorkflowConfigurationAndActivate: function () {
        try {
            console.log('In bwWorkflowEditor.js.publishWorkflowConfigurationAndActivate().');
            var thiz = this;
            debugger; // 1-4-2022

            var bwRequestTypeId;
            $('#selectRequestTypeDropDown').find('option:selected').each(function (index, element) {
                bwRequestTypeId = element.value;
            });

            if (!bwRequestTypeId || (bwRequestTypeId == null)) {

                console.log('xcx44886 Invalid bwRequestTypeId: ' + bwRequestTypeId);
                displayAlertDialog('xcx44886 Invalid bwRequestTypeId: ' + bwRequestTypeId);

            } else {
                //var bwWorkflowId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                //    return v.toString(16);
                //});
                //var dtNow = new Date();


                // Find the old workflow here. This is the one we are superseding with the new one. This methos gets this passed: old_bwWorkflowId

                //var workflows = thiz.options.store.Workflow; 

                debugger; // 1-4-2022

                //var bwWorkflowId = document.getElementById('bwworkflow').getAttribute('bwworkflowid');
                //if (!bwWorkflowId || (bwWorkflowId == null) || (bwWorkflowId == 'undefined')) {
                //    // 1-4-2022
                //    console.log('xcx44886-2 Invalid bwWorkflowId: ' + bwWorkflowId);
                //    displayAlertDialog('xcx44886-2 Invalid bwWorkflowId: ' + bwWorkflowId);
                //} else {


                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
                var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

                //var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                var bwWorkflowJson = JSON.stringify(thiz.options.CurrentWorkflow.DraftWorkflow);
                var json = {
                    //bwParticipantId_LoggedIn: participantId,
                    //bwActiveStateIdentifier: activeStateIdentifier,
                    //bwWorkflowAppId_LoggedIn: workflowAppId,

                    //bwWorkflowId: bwWorkflowId, //?????????????????????????
                    //bwTenantId: tenantId,
                    bwWorkflowAppId: workflowAppId,
                    //Created: dtNow,
                    //CreatedBy: participantFriendlyName,
                    //CreatedById: participantId,
                    //CreatedByEmail: participantEmail,
                    //Modified: dtNow,
                    ModifiedByFriendlyName: participantFriendlyName,
                    ModifiedById: participantId,
                    ModifiedByEmail: participantEmail,
                    //Description: description,
                    bwWorkflowJson: bwWorkflowJson, //, //.bwWorkflowJson, //JSON.stringify(thiz.options.CurrentWorkflow), // WE KNOW WE ARE NOT GETTING THE CORRECT JSON HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                    //bwWorkflowActive: true, // The web service marks it true, so no need to send this. There canonly be 1 active one for a request type! And Publish makes it active, that is what it means. :)
                    bwRequestTypeId: bwRequestTypeId //<<<<<<<<<<< The web service needs to be recoded to recognize this! <<<<<<<<<<<<<<<<<
                };
                //debugger;
                $.ajax({
                    url: thiz.options.operationUriPrefix + "odata/publishworkflow2",
                    type: "Post",
                    data: json,
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    }
                }).done(function (result) {
                    try {


                        // ADD AUTHORIZATION AND CLEAN THIS UP. CHANGE TO success AND error EVENTS. <<<<<<<<<<<<<<<<<<<<<<<< 10-18-2022



                        debugger; // 1-4-2022
                        if (result != 'SUCCESS') {

                            alert(result);

                        } else {

                            console.log('In bwWorkflowEditor.js.publishWorkflowConfigurationAndActivate().post: Successfully updated DB. result: ' + JSON.stringify(result)); // using (' + JSON.stringify(json) + ').');

                            thiz.options.CurrentWorkflow.Workflow = JSON.parse(bwWorkflowJson);

                            for (var i = 0; i < thiz.options.Workflows.length; i++) {
                                if (bwRequestTypeId == thiz.options.Workflows[i].bwRequestTypeId) {
                                    thiz.options.Workflows[i].bwWorkflowJson = bwWorkflowJson; // Update the correct workflow we have already stored.
                                    break;
                                }
                            }

                            thiz.checkIfWeHaveToDisplayThePublishChangesButton();

                            thiz.renderWorkflowEditor2();

                            document.getElementById('spanWorkflowEditor_SelectedWorkflow').innerHTML = '';
                            document.getElementById('spanWorkflowEditor_Error').innerHTML = '';
                            document.getElementById('spanThereAreChangesToPublishText').innerHTML = '';
                            document.getElementById('spanThereAreChangesToPublishButton').innerHTML = '';

                            // Display a dialog with an "Undo" button!!!!
                            //alert('Successfully updated the database. THIS WORKFLOW CHANGE WILL TAKE PLACE IMMEDIATELY!');
                            console.log('xcx23123-4 displaying workflow published dialog');
                            $("#divUndoWorkflowActivationDialog").dialog({
                                modal: true,
                                resizable: false,
                                //closeText: "Cancel",
                                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                                //title: 'Project Type picker',
                                width: '800',
                                dialogClass: 'no-close', // No close button in the upper right corner.
                                hide: false, // This means when hiding just disappear with no effects.
                                open: function () {
                                    try {
                                        $('.ui-widget-overlay').bind('click', function () {
                                            $('#divUndoWorkflowActivationDialog').dialog('close');
                                        });


                                        // re-sync this.options.store
                                        //thiz.options.CurrentWorkflow.DraftWorkflow = JSON.parse(JSON.stringify(thiz.options.CurrentWorkflow.Workflow)); 
                                        //thiz.checkIfWeHaveToDisplayThePublishChangesButton();

                                        //debugger; // 1-4-2022 // make sure the request type is correct!!!!!!!!!!!!!!!!!!!!!
                                        //var promise = thiz.loadWorkflowsAndCurrentWorkflow(bwRequestTypeId); // This is the default. // 1-4-2022 changed from bwRequestType
                                        //promise.then(function (result) {
                                        //    try {
                                        //        debugger; // 1-4-2022
                                        //        thiz.renderWorkflowEditor2();
                                        //        thiz.checkIfWeHaveToDisplayThePublishChangesButton();
                                        //    } catch (e) {
                                        //        console.log('Exception in bwWorkflowEditor._create().loadWorkflowsAndCurrentWorkflow(): ' + e.message + ', ' + e.stack);
                                        //        displayAlertDialog('Exception in bwWorkflowEditor._create().loadWorkflowsAndCurrentWorkflow(): ' + e.message + ', ' + e.stack);
                                        //    }
                                        //});
                                    } catch (e) {
                                        console.log('Exception in bwWorkflowEditor._create().loadWorkflowsAndCurrentWorkflow():xcx56: ' + e.message + ', ' + e.stack);
                                        displayAlertDialog('Exception in bwWorkflowEditor._create().loadWorkflowsAndCurrentWorkflow():xcx56: ' + e.message + ', ' + e.stack);
                                    }
                                },
                                close: function () {
                                    $('#divUndoWorkflowActivationDialog').dialog("destroy");
                                    //    //thiz._create(); // When the user closes this dialog, we regenerate the screen to reflect the newly created and activated workflow. <<< NOT NECESSARY!!!! ONLY USING FOR TESTING.
                                    //    debugger;
                                    //    thiz.checkIfWeHaveToDisplayThePublishChangesButton();
                                }
                            });
                            $('#divUndoWorkflowActivationDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
                            setTimeout(function () {
                                $('#divUndoWorkflowActivationDialog').dialog('close');
                            }, 3500);

                        }

                    } catch (e) {
                        console.log('Exception in bwWorkflowEditor.js.publishWorkflowConfigurationAndActivate().xx.update: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwWorkflowEditor.js.publishWorkflowConfigurationAndActivate().xx.update: ' + e.message + ', ' + e.stack);
                    }
                }).fail(function (data, errorCode, errorMessage) {
                    debugger;
                    //thiz.hideProgress();
                    var msg;
                    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                    } else {
                        msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
                    }
                    console.log('Fail in bwWorkflowEditor.js.publishWorkflowConfigurationAndActivate().xx.update:xcx661: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
                    displayAlertDialog('Fail in bwWorkflowEditor.js.publishWorkflowConfigurationAndActivate().xx.update:xcx661: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                    //var error = JSON.parse(data.responseText)["odata.error"];
                    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                });
                //}

            }
        } catch (e) {
            debugger;
            //thiz.hideProgress();
            console.log('Exception in bwWorkflowEditor.js.publishWorkflowConfigurationAndActivate(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwWorkflowEditor.js.publishWorkflowConfigurationAndActivate(): ' + e.message + ', ' + e.stack);
        }
    },
    cancelChangesInDraftWorkflowConfiguration: function () {
        try {
            console.log('In cancelChangesInDraftWorkflowConfiguration().');
            this.options.CurrentWorkflow["DraftWorkflow"] = JSON.parse(JSON.stringify(this.options.CurrentWorkflow["Workflow"])); // Creating "DraftWorkflow" so we can tell if the workflow has been changed or not, and then inform the user that changes need to be published.
            this.renderWorkflowEditor2(); // Definition is renderWorkflowEditor(assignmentRowChanged_ElementId).
        } catch (e) {
            console.log('Exception in cancelChangesInDraftWorkflowConfiguration(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in cancelChangesInDraftWorkflowConfiguration(): ' + e.message + ', ' + e.stack);
        }
    },

    checkIfWeHaveToDisplayThePublishChangesButton: function () {
        try {
            //debugger;
            console.log('In checkIfWeHaveToDisplayThePublishChangesButton().');
            var thereHaveBeenChangesToTheWorkflow = false;
            var oldJsonString = JSON.stringify(this.options.CurrentWorkflow.Workflow);
            var newJsonString = JSON.stringify(this.options.CurrentWorkflow.DraftWorkflow);
            if (oldJsonString != newJsonString) {
                thereHaveBeenChangesToTheWorkflow = true;
            }
            if (thereHaveBeenChangesToTheWorkflow) {
                // The user has made changes to the workflow.
                document.getElementById('spanThereAreChangesToPublishText').innerHTML = 'You have changes that won\'t be available until you publish: ';

                var html = '';
                if (this.options.DisplayAsNewTenantUserConfigurationEditor == true) {
                    html += '<input style="padding:5px 10px 5px 10px;width:100px;" id="btnSaveWorkflowConfigurationAndActivate" type="button" value="Publish" onclick="$(\'.bwNewUserWorkflowEditor\').bwNewUserWorkflowEditor(\'publishNewUserWorkflowConfigurationAndActivate\');" />';
                    html += '&nbsp;<input style="padding:5px 10px 5px 10px;" id="btnCancelChangesInDraftWorkflowConfiguration" type="button" value="Cancel Changes" onclick="$(\'.bwNewUserWorkflowEditor\').bwNewUserWorkflowEditor(\'cancelChangesInDraftWorkflowConfiguration\');" />';
                } else {
                    html += '<input style="padding:5px 10px 5px 10px;width:100px;" id="btnSaveWorkflowConfigurationAndActivate" type="button" value="Publish" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'publishWorkflowConfigurationAndActivate\');" />';
                    html += '&nbsp;<input style="padding:5px 10px 5px 10px;" id="btnCancelChangesInDraftWorkflowConfiguration" type="button" value="Cancel Changes" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'cancelChangesInDraftWorkflowConfiguration\');" />';
                }

                document.getElementById('spanThereAreChangesToPublishButton').innerHTML = html;
            } else {
                // Do nothing because the user has made no changes to the workflow.
                document.getElementById('spanThereAreChangesToPublishText').innerHTML = '';
                document.getElementById('spanThereAreChangesToPublishButton').innerHTML = '';
            }
        } catch (e) {
            console.log('Exception in checkIfWeHaveToDisplayThePublishChangesButton(): ' + e.message + ', ' + e.stack);
        }
    },
    saveCollaborationTimeout: function (e) {
        try {
            // This makes sure the user enters a number here, which is greater than 0 and less than 28.
            //e.stopPropagation();
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
            for (var i = 0; i < this.options.CurrentWorkflow.DraftWorkflow.Steps.Step.length; i++) {
                if (this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[i]["@Name"] == 'Collaboration') {
                    this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[i]["@Timeout"] = timeoutValueToSave; // Save the timeout value.
                    this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[i]["@TimeoutUnits"] = timeoutUnits; // Save the timeout units: [Days, Hours, Minutes]
                }
            }
            this.checkIfWeHaveToDisplayThePublishChangesButton();
        } catch (e) {
            console.log('Exception in saveCollaborationTimeout(): ' + e.message + ', ' + e.stack);
        }
    },
    saveAssignmentRow: function (elementId) {
        try {
            console.log('');
            console.log('In saveAssignmentRow(). 12-18-2021 WE WILL GET RID OF THIS SAVE BUTTON BECAUSE WE WANT TO JUST HAVE THE Publish BUTTON BECOME ENABLED. THIS WILL BE MORE INTUITIVE I THNK..??!! elementId: ' + elementId); // eg: elementId: steprow-inform_3_8
            console.log('');
            console.log('In saveAssignmentRow(). Refactoring checklists.');
            //var thiz = this;

            debugger;
            var x = elementId.split('_')[0];
            var sourceRoleCategory = x.split('-')[1]; // "inform" or "assign"
            var stepIndex = elementId.split('_')[1]; // eg: 3
            var roleIndex = elementId.split('_')[2]; // eg: 8
            //if (confirm("Please confirm you wish to save this change. This will not affect the workflow until it has been saved & activated.")) {
            // Step 1: Change the underlying JSON. These loops help us locate the node the user wants to change.
            //debugger; 
            var car = this.options.CurrentWorkflow;
            if (stepIndex && sourceRoleCategory && roleIndex > -1) {
                // Step 1: Get the Role.
                var newRoleId;
                var newRoleName;
                $('#selectRoleName').find('option:selected').each(function (index, element) {
                    //debugger;
                    newRoleId = element.value;
                    newRoleName = element.text;
                });

                var newRoleCategory; // Step 1: Get the "RoleCategory".
                $('#selectRoleCategory').find('option:selected').each(function (index, element) {
                    newRoleCategory = element.value;
                });
                var newActions = []; // Step 2: Get the "Actions".
                //debugger;
                if ((newRoleCategory == 'Approver')) { // We only get "Actions" when it is "Approve" of in the "ADMIN" step >> added ADMIN part on 10-14-2020
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
                    //debugger;
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
                                Invalidate: {
                                    '@Step': 'Admin'
                                },
                                Invalidate: {
                                    '@Step': 'VPLevel'
                                },
                                Invalidate: {
                                    '@Step': 'ExecLevel'
                                },
                                Invalidate: {
                                    '@Step': 'CLevel'
                                },
                                Tooltip: 'Send the CAR back to the original creator'
                            };
                        } else {
                            x = {
                                '@Name': 'Revise/Hold',
                                '@Target': 'Revise',
                                Invalidate: {
                                    '@Step': 'Admin'
                                },
                                Invalidate: {
                                    '@Step': 'VPLevel'
                                },
                                Invalidate: {
                                    '@Step': 'ExecLevel'
                                },
                                Invalidate: {
                                    '@Step': 'CLevel'
                                },
                                Tooltip: 'Send the CAR back to the original creator'
                            };
                        }
                        newActions.push(x);
                    }
                }







                // Added 4-20-2022
                if ((newRoleCategory == 'Collaborator')) { // We only get "Actions" when it is "Review Completed" 

                    // "Review Completed" action. eg: Action-ReviewCompleted_3_8, RequireComments-ReviewCompleted_3_8
                    var approve_action_CheckboxId = 'Action-ReviewCompleted_' + stepIndex + '_' + roleIndex;
                    var approve_requireComments_CheckboxId = 'RequireComments-ReviewCompleted_' + stepIndex + '_' + roleIndex;
                    if (document.getElementById(approve_action_CheckboxId).checked) {
                        var x;
                        if (document.getElementById(approve_requireComments_CheckboxId).checked) {
                            x = {
                                '@Name': 'Review Completed',
                                '@State': 'Done',
                                '@RequireComments': 'True',
                                '@JavaScript': '$(\'.bwRequest\').bwRequest(\'cmdReviewRequest\', this);',
                                Tooltip: 'Review the request and submit comments'
                            };
                        } else {
                            x = {
                                '@Name': 'Review Completed',
                                '@State': 'Done',
                                '@JavaScript': '$(\'.bwRequest\').bwRequest(\'cmdReviewRequest\', this);',
                                Tooltip: 'Review the request and submit comments'
                            };
                        }
                        newActions.push(x);
                    }
                }




                // 1-18-2023
                var selectedChecklists = [];
                if (document.getElementById('spanConditionEditorContents')) { // if (document.getElementById('spanConditionEditorContents')) {
                    strChecklists = unescape(document.getElementById('spanConditionEditorContents').innerHTML).trim();
                    if (strChecklists) {
                        //alert('In saveAssignmentRow(). >> strChecklists: ' + strChecklists);
                        selectedChecklists = JSON.parse(strChecklists);
                    }
                }





                //debugger; // THE COND IS MESSED UP HERE! WE NEED TO A BETTER JOB OF POPULATING THIS HERE!!! This is why we see so many checklist displayed on the request form.!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 4-16-2020
                var newConditionString = '';
                if (document.getElementById('spanConditionEditorContents')) {
                    //debugger;
                    console.log('xcx1234324-1 getting the cond');
                    newConditionString = document.getElementById('spanConditionEditorContents').innerHTML; // Step 3: Get the "Cond".
                }
                //debugger;






                if (document.getElementById('selectRoleName')) {
                    var e = document.getElementById("selectRoleName");
                    newRoleId = e.options[e.selectedIndex].value;
                    newRoleName = e.options[e.selectedIndex].text;
                }



                // BUDGET THRESHOLD.
                // Get the budget threshold amount.
                var textOnlyInvolveRoleForAmountsOver_Id = 'textOnlyInvolveRoleForAmountsOver_' + stepIndex + '_' + roleIndex;
                var txtBudgetThreshold = document.getElementById(textOnlyInvolveRoleForAmountsOver_Id).value;
                // Get the value.
                var budgetThreshold = bwCommonScripts.getBudgetWorkflowStandardizedCurrencyWithoutDollarSign(txtBudgetThreshold);

                //alert('xcx12312342314 budgetThreshold: ' + budgetThreshold);


                // Get the value for checkbox "Allow Request Modifications". 6-26-2020
                var allowRequestModifications_CheckboxId = 'cbAllowRequestModifications_' + stepIndex + '_' + roleIndex;
                var allowRequestModifications = document.getElementById(allowRequestModifications_CheckboxId).checked;



                // Get the instructions.
                var textInstructions_Id = 'textInstructions_' + stepIndex + '_' + roleIndex;
                var instructions = document.getElementById(textInstructions_Id).value;

                //alert('instructions: ' + instructions);
                debugger;
















                //
                // CHANGING FROM INFORM 7-10-2023.
                //


                //
                // We now have all of our new values. Now we have to determine if we use the same node in the JSON, or if it has to move.
                // This depends on whether the user has selected a different "RoleCategory" (Inform, Collaborator, Approver).
                //
                ////debugger;
                //if (sourceRoleCategory == 'inform' && (newRoleCategory == 'Collaborator' || newRoleCategory == 'Approver')) {
                //    // Change from inform to assign row.
                //    // eg: <Assign Role="ADMIN" Form="CARForm.aspx" DoneForm="CARComments.aspx" Title="Add Comments/Approve" MailTemplate="Assign1.xsl" Subject="eCAR3 - New Work Item ({0})" RoleCategory="Approver">
                //    var row = {
                //        '@Role': newRoleId,
                //        '@RoleName': newRoleName,
                //        '@AllowRequestModifications': allowRequestModifications,
                //        '@RoleCategory': newRoleCategory,
                //        '@Instructions': instructions,
                //        '@Checklists': selectedChecklists,
                //        '@BudgetThreshold': budgetThreshold

                //    };
                //    if (newRoleCategory == 'Approver' && newActions) {
                //        row.Action = newActions;
                //    }


                //    // Delete the old row.
                //    // WHY IS THIS AN INFORM? Not sure about this line 1-11-2023 <<<<<<<<<<<<<<<<
                //    if (this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Inform) {
                //        this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Inform.splice(roleIndex, 1); // delete leaves a null, so we have to use splice.
                //    }




                //    // Depending on the new RoleCategory, figure out where in the json to insert this assignment row. For instance, if it is "Approver", it should show up at the top of the "Approvers", and be highlighted so th euser know what they just changed.
                //    // Iterate through all of the assignment rows and find this out.
                //    var assignIndex;
                //    var weFoundIt = false;
                //    //debugger;
                //    for (var i = 0; i < this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign.length; i++) {
                //        console.log('this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[i]: ' + this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[i]["@RoleCategory"] + ', newRoleCategory: ' + newRoleCategory);
                //        if (!weFoundIt && this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[i]["@RoleCategory"] == newRoleCategory) {
                //            // We have found the first of this role category, so we will insert this new assignment row at the top.
                //            this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign.splice(i, 0, row); // Create the row
                //            assignIndex = i;
                //            weFoundIt = true;
                //        }
                //    }
                //} else if (sourceRoleCategory == 'assign' && newRoleCategory == 'Inform') {
                //    // Change from assign to inform row.

                //    debugger; // 12-9-2021
                //    //var roleId = this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex]["@Role"];
                //    this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign.splice(roleIndex, 1); // delete leaves a null, so we have to use splice.
                //    // eg: <Inform Role="DIRSAFE" MailTemplate="Inform1.xsl" Subject="eCAR3 - New Project {0} created" Cond="$ProjectType~IM,LR,EQ,SG,FS,WS,ENV,INO,PSM,IT,TRANS,WH" />
                //    var row = {
                //        '@Role': newRoleId,
                //        '@RoleName': newRoleName,
                //        '@AllowRequestModifications': allowRequestModifications,
                //        '@Instructions': instructions,
                //        '@Checklists': selectedChecklists,
                //        '@BudgetThreshold': budgetThreshold

                //    }
                //    if (this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Inform) {
                //        this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Inform.splice(0, 0, row); // Create the row
                //    } else {

                //        this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex]["Inform"].push(row);

                //    }

                //} else {

                // No change to RoleCategory, stay in the same row. THIS IS THE ONLY PLACE WHERE we save values to an existing row in the workflow.
                //if (sourceRoleCategory == 'inform') {

                //    if (this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Inform && this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Inform.length && this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Inform[roleIndex]) {

                //        // This is an existing row in the JSON which we will overwrite.
                //        this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Inform[roleIndex]["@Checklists"] = selectedChecklists; // The only thing that could change here is "Cond".
                //        if (newRoleId) {
                //            this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Inform[roleIndex]["@Role"] = newRoleId;
                //            this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Inform[roleIndex]["@RoleName"] = newRoleName;
                //            this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Inform[roleIndex]["@Instructions"] = instructions;

                //            this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Inform[roleIndex]["@BudgetThreshold"] = budgetThreshold;
                //        }

                //    } else {

                //        // This is a new row to add to the JSON.
                //        if (!this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Inform) {
                //            this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex]["Inform"] = [];
                //        }
                //        if (!this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Inform.length) {
                //            this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex]["Inform"] = [];
                //        }

                //        if (newRoleId) {

                //            var json = {
                //                '@Checklists': selectedChecklists,
                //                '@Role': newRoleId,
                //                '@RoleName': newRoleName,
                //                '@Instructions': instructions,
                //                '@BudgetThreshold': budgetThreshold
                //            }
                //            this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Inform.push(json);

                //        }

                //    }


                //    //
                //    // end: CHANGING FROM INFORM 7-10-2023.
                //    //












                // sourceRoleCategory == 'inform' && (newRoleCategory =


                //if (sourceRoleCategory == newRoleCategory) {



                //}



                if (sourceRoleCategory == 'inform') {

                    var json = {
                        '@RoleCategory': newRoleCategory,
                        '@Checklists': selectedChecklists,
                        '@Role': newRoleId,
                        '@RoleName': newRoleName,
                        '@AllowRequestModifications': false, // It's an Inform role... always false for this.
                        '@Instructions': instructions,
                        '@BudgetThreshold': budgetThreshold,
                        'Action': []
                    }

                    if (!this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign) {
                        this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex]["Assign"] = []; // Create the array.
                    }

                    this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign.push(json);

                    //alert('xcx123144 Pushed json to the workflow!!!!!!!!!!!!!!!!');

                } else if (sourceRoleCategory == 'assign') {

                    if (((newRoleCategory == 'Approver') || (newRoleCategory == 'Collaborator') || (newRoleCategory == 'Inform')) && newActions) { // 4-20-2022 added "Collaborator"
                        // Find out if we changed the Tooltip and JavaScript values already. They save differently..... not sure if this is best approach yet.
                        var actionIndex;

                        //alert('xcx423 sourceRoleCategory: ' + sourceRoleCategory + ', newRoleCategory: ' + newRoleCategory + ', stepIndex: ' + stepIndex + ', roleIndex: ' + roleIndex);


                        //if (!this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign) {
                        //    alert('WE NEED TO ADD JSON HERE xcx347747');
                        //}






                        for (var a = 0; a < this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[roleIndex].Action.length; a++) {
                            var x1 = this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[roleIndex].Action[a]["@Name"];
                            for (var b = 0; b < newActions.length; b++) {
                                var buttonTitle = newActions[b]["@Name"];
                                if (x1 == buttonTitle) {
                                    //debugger;
                                    var tooltip = this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[roleIndex].Action[a].Tooltip;
                                    //var javascript = this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[roleIndex].Action[a]["@JavaScript"]; // commented out 12-20-2021 THSI FORCES THE JS HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                                    newActions[b].Tooltip = tooltip;
                                    debugger;
                                    //if (!javascript) {
                                    debugger;
                                    console.log('BUTTON JAVASCRIPT IS FORCED HERE, SO USER CHANGES WILL BE OVERWRITTEN. xcx995347');
                                    switch (buttonTitle) {
                                        //case 'Review Completed':
                                        //    javascript = "$('.bwRequest').bwRequest('cmdApproveRequest', this);"; // 4-20-2022
                                        //    break;
                                        case 'Approve':
                                            javascript = "$('.bwRequest').bwRequest('cmdApproveRequest', this);"; // 12-20-2021
                                            break;
                                        case 'Decline':
                                            javascript = "$('.bwRequest').bwRequest('cmdDeclineRequest', this);"; // 12-20-2021
                                            break;
                                        case 'Revise/Hold':
                                            javascript = "$('.bwRequest').bwRequest('cmdReviseHoldRequest', this);"; // 12-20-2021
                                            break;
                                        case 'Cancel':
                                            javascript = "$('.bwRequest').bwRequest('cmdCancelRequest', this);"; // 12-20-2021
                                            break;
                                        default:
                                            console.log('Error: Invalid button title xcx2356.');
                                            alert('Error: Invalid button title xcx2356.');
                                            break;
                                    }

                                    //}
                                    newActions[b]["@JavaScript"] = javascript;

                                }
                            }
                        }
                        this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[roleIndex].Action = newActions;
                    }
                    //debugger;
                    this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[roleIndex]["@RoleCategory"] = newRoleCategory; // 12-20-2021
                    this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[roleIndex]["@Checklists"] = selectedChecklists;
                    this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[roleIndex]["@Role"] = newRoleId;
                    this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[roleIndex]["@RoleName"] = newRoleName;
                    this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[roleIndex]["@AllowRequestModifications"] = allowRequestModifications;
                    this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[roleIndex]["@Instructions"] = instructions;


                    this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[roleIndex]["@BudgetThreshold"] = budgetThreshold;


                } else if (sourceRoleCategory == 'admin') {
                    //debugger;
                    // Not doing anything here. All we want to be able to do is change the active 'ADMIN' user, which happens below when it is saved to the database.
                    //newRoleId = 'ADMIN';
                    //newRoleName = '';


                    // 1-12-2022
                    alert('xcx123452');
                    debugger;

                    this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign = [{
                        '@Role': newRoleId,
                        '@RoleName': newRoleName,
                        '@Title': '',
                        '@AllowRequestModifications': allowRequestModifications,
                        '@RoleCategory': newRoleCategory,
                        '@Instructions': instructions,
                        '@Checklists': selectedChecklists,
                        '@BudgetThreshold': budgetThreshold

                    }];

                    debugger;
                    //this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign["@AllowRequestModifications"] = allowRequestModifications;
                    this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[0].Action = newActions;

                } else {
                    alert('xcx23123124 ERROR: Invalid sourceRoleCategory: ' + sourceRoleCategory);
                }
                //}

                var selectedRequestTypeId; // If we get here, we can lookup the bwRequestTypeId from the selectRequestTypeDropDown drop-down.
                $('#selectRequestTypeDropDown').find('option:selected').each(function (index, element) {
                    selectedRequestTypeId = element.value;
                });
                this.element.html(this.renderWorkflowEditor1(null, selectedRequestTypeId, stepIndex)); // Render the Workflow Editor. 
                this.checkIfWeHaveToDisplayThePublishChangesButton();





                //}
            } else {
                // We should never get here!!!
                displayAlertDialog('ERROR: Failed to locate the step or role in the underlying json.');
            }
        } catch (e) {
            console.log('Exception in saveAssignmentRow(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in saveAssignmentRow(): ' + e.message + ', ' + e.stack);
        }
    },
    //saveAssignmentRow: function (elementId) { // CHANGED THIS METHOD, REMOVING/CHANGING INFORM 7-10-2023.
    //    try {
    //        console.log('');
    //        console.log('In saveAssignmentRow(). 12-18-2021 WE WILL GET RID OF THIS SAVE BUTTON BECAUSE WE WANT TO JUST HAVE THE Publish BUTTON BECOME ENABLED. THIS WILL BE MORE INTUITIVE I THNK..??!! elementId: ' + elementId); // eg: elementId: steprow-inform_3_8
    //        console.log('');
    //        console.log('In saveAssignmentRow(). Refactoring checklists.');
    //        //var thiz = this;

    //        debugger;
    //        var x = elementId.split('_')[0];
    //        var sourceRoleCategory = x.split('-')[1]; // "inform" or "assign"
    //        var stepIndex = elementId.split('_')[1]; // eg: 3
    //        var roleIndex = elementId.split('_')[2]; // eg: 8
    //        //if (confirm("Please confirm you wish to save this change. This will not affect the workflow until it has been saved & activated.")) {
    //        // Step 1: Change the underlying JSON. These loops help us locate the node the user wants to change.
    //        //debugger; 
    //        var car = this.options.CurrentWorkflow;
    //        if (stepIndex && sourceRoleCategory && roleIndex > -1) {
    //            // Step 1: Get the Role.
    //            var newRoleId;
    //            var newRoleName;
    //            $('#selectRoleName').find('option:selected').each(function (index, element) {
    //                //debugger;
    //                newRoleId = element.value;
    //                newRoleName = element.text;
    //            });

    //            var newRoleCategory; // Step 1: Get the "RoleCategory".
    //            $('#selectRoleCategory').find('option:selected').each(function (index, element) {
    //                newRoleCategory = element.value;
    //            });
    //            var newActions = []; // Step 2: Get the "Actions".
    //            //debugger;
    //            if ((newRoleCategory == 'Approver')) { // We only get "Actions" when it is "Approve" of in the "ADMIN" step >> added ADMIN part on 10-14-2020
    //                // "Approve" action. eg: Action-Approve_3_8, RequireComments-Approve_3_8
    //                var approve_action_CheckboxId = 'Action-Approve_' + stepIndex + '_' + roleIndex;
    //                var approve_requireComments_CheckboxId = 'RequireComments-Approve_' + stepIndex + '_' + roleIndex;
    //                if (document.getElementById(approve_action_CheckboxId).checked) {
    //                    var x;
    //                    if (document.getElementById(approve_requireComments_CheckboxId).checked) {
    //                        x = {
    //                            '@Name': 'Approve',
    //                            '@State': 'Done',
    //                            '@RequireComments': 'True',
    //                            Tooltip: 'Approve the request and submit comments'
    //                        };
    //                    } else {
    //                        x = {
    //                            '@Name': 'Approve',
    //                            '@State': 'Done',
    //                            Tooltip: 'Approve the request and submit comments'
    //                        };
    //                    }
    //                    newActions.push(x);
    //                }
    //                // "Cancel" action. eg: Action-Cancel_3_8, RequireComments-Cancel_3_8
    //                var cancel_action_CheckboxId = 'Action-Cancel_' + stepIndex + '_' + roleIndex;
    //                var cancel_requireComments_CheckboxId = 'RequireComments-Cancel_' + stepIndex + '_' + roleIndex;
    //                if (document.getElementById(cancel_action_CheckboxId).checked) {
    //                    var x;
    //                    if (document.getElementById(cancel_requireComments_CheckboxId).checked) {
    //                        x = {
    //                            '@Name': 'Cancel',
    //                            '@State': 'Cancel',
    //                            '@RequireComments': 'True',
    //                            Tooltip: 'Cancel the entire CAR'
    //                        };
    //                    } else {
    //                        x = {
    //                            '@Name': 'Cancel',
    //                            '@State': 'Cancel',
    //                            Tooltip: 'Cancel the entire CAR'
    //                        };
    //                    }
    //                    newActions.push(x);
    //                }
    //                // "Decline" action. eg: Action-Decline_3_8, RequireComments-Decline_3_8
    //                var decline_action_CheckboxId = 'Action-Decline_' + stepIndex + '_' + roleIndex;
    //                var decline_requireComments_CheckboxId = 'RequireComments-Decline_' + stepIndex + '_' + roleIndex;
    //                if (document.getElementById(decline_action_CheckboxId).checked) {
    //                    var x;
    //                    if (document.getElementById(decline_requireComments_CheckboxId).checked) {
    //                        x = {
    //                            '@Name': 'Decline',
    //                            '@State': 'Cancel',
    //                            '@RequireComments': 'True',
    //                            Tooltip: 'Decline the entire CAR'
    //                        };
    //                    } else {
    //                        x = {
    //                            '@Name': 'Decline',
    //                            '@State': 'Cancel',
    //                            Tooltip: 'Decline the entire CAR'
    //                        };
    //                    }
    //                    newActions.push(x);
    //                }
    //                //debugger;
    //                // "Revise/Hold" action. eg: Action-Revise/Hold_3_8, RequireComments-Revise/Hold_3_8
    //                var reviseHold_action_CheckboxId = 'Action-Revise/Hold_' + stepIndex + '_' + roleIndex;
    //                var reviseHold_requireComments_CheckboxId = 'RequireComments-Revise/Hold_' + stepIndex + '_' + roleIndex;
    //                if (document.getElementById(reviseHold_action_CheckboxId).checked) {
    //                    var x;
    //                    if (document.getElementById(reviseHold_requireComments_CheckboxId).checked) {
    //                        x = {
    //                            '@Name': 'Revise/Hold',
    //                            '@Target': 'Revise',
    //                            '@RequireComments': 'True',
    //                            Invalidate: {
    //                                '@Step': 'Admin'
    //                            },
    //                            Invalidate: {
    //                                '@Step': 'VPLevel'
    //                            },
    //                            Invalidate: {
    //                                '@Step': 'ExecLevel'
    //                            },
    //                            Invalidate: {
    //                                '@Step': 'CLevel'
    //                            },
    //                            Tooltip: 'Send the CAR back to the original creator'
    //                        };
    //                    } else {
    //                        x = {
    //                            '@Name': 'Revise/Hold',
    //                            '@Target': 'Revise',
    //                            Invalidate: {
    //                                '@Step': 'Admin'
    //                            },
    //                            Invalidate: {
    //                                '@Step': 'VPLevel'
    //                            },
    //                            Invalidate: {
    //                                '@Step': 'ExecLevel'
    //                            },
    //                            Invalidate: {
    //                                '@Step': 'CLevel'
    //                            },
    //                            Tooltip: 'Send the CAR back to the original creator'
    //                        };
    //                    }
    //                    newActions.push(x);
    //                }
    //            }







    //            // Added 4-20-2022
    //            if ((newRoleCategory == 'Collaborator')) { // We only get "Actions" when it is "Review Completed" 

    //                // "Review Completed" action. eg: Action-ReviewCompleted_3_8, RequireComments-ReviewCompleted_3_8
    //                var approve_action_CheckboxId = 'Action-ReviewCompleted_' + stepIndex + '_' + roleIndex;
    //                var approve_requireComments_CheckboxId = 'RequireComments-ReviewCompleted_' + stepIndex + '_' + roleIndex;
    //                if (document.getElementById(approve_action_CheckboxId).checked) {
    //                    var x;
    //                    if (document.getElementById(approve_requireComments_CheckboxId).checked) {
    //                        x = {
    //                            '@Name': 'Review Completed',
    //                            '@State': 'Done',
    //                            '@RequireComments': 'True',
    //                            '@JavaScript': '$(\'.bwRequest\').bwRequest(\'cmdReviewRequest\', this);',
    //                            Tooltip: 'Review the request and submit comments'
    //                        };
    //                    } else {
    //                        x = {
    //                            '@Name': 'Review Completed',
    //                            '@State': 'Done',
    //                            '@JavaScript': '$(\'.bwRequest\').bwRequest(\'cmdReviewRequest\', this);',
    //                            Tooltip: 'Review the request and submit comments'
    //                        };
    //                    }
    //                    newActions.push(x);
    //                }
    //            }




    //            // 1-18-2023
    //            var selectedChecklists = [];
    //            if (document.getElementById('spanConditionEditorContents')) { // if (document.getElementById('spanConditionEditorContents')) {
    //                strChecklists = unescape(document.getElementById('spanConditionEditorContents').innerHTML).trim();
    //                if (strChecklists) {
    //                    //alert('In saveAssignmentRow(). >> strChecklists: ' + strChecklists);
    //                    selectedChecklists = JSON.parse(strChecklists);
    //                }
    //            }





    //            //debugger; // THE COND IS MESSED UP HERE! WE NEED TO A BETTER JOB OF POPULATING THIS HERE!!! This is why we see so many checklist displayed on the request form.!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 4-16-2020
    //            var newConditionString = '';
    //            if (document.getElementById('spanConditionEditorContents')) {
    //                //debugger;
    //                console.log('xcx1234324-1 getting the cond');
    //                newConditionString = document.getElementById('spanConditionEditorContents').innerHTML; // Step 3: Get the "Cond".
    //            }
    //            //debugger;






    //            if (document.getElementById('selectRoleName')) {
    //                var e = document.getElementById("selectRoleName");
    //                newRoleId = e.options[e.selectedIndex].value;
    //                newRoleName = e.options[e.selectedIndex].text;
    //            }



    //            // BUDGET THRESHOLD.
    //            // Get the budget threshold amount.
    //            var textOnlyInvolveRoleForAmountsOver_Id = 'textOnlyInvolveRoleForAmountsOver_' + stepIndex + '_' + roleIndex;
    //            var txtBudgetThreshold = document.getElementById(textOnlyInvolveRoleForAmountsOver_Id).value;
    //            // Get the value.
    //            var budgetThreshold = bwCommonScripts.getBudgetWorkflowStandardizedCurrencyWithoutDollarSign(txtBudgetThreshold);

    //            //alert('xcx12312342314 budgetThreshold: ' + budgetThreshold);


    //            // Get the value for checkbox "Allow Request Modifications". 6-26-2020
    //            var allowRequestModifications_CheckboxId = 'cbAllowRequestModifications_' + stepIndex + '_' + roleIndex;
    //            var allowRequestModifications = document.getElementById(allowRequestModifications_CheckboxId).checked;



    //            // Get the instructions.
    //            var textInstructions_Id = 'textInstructions_' + stepIndex + '_' + roleIndex;
    //            var instructions = document.getElementById(textInstructions_Id).value;

    //            //alert('instructions: ' + instructions);
    //            debugger;
















    //            //
    //            // CHANGING FROM INFORM 7-10-2023.
    //            //


    //            //
    //            // We now have all of our new values. Now we have to determine if we use the same node in the JSON, or if it has to move.
    //            // This depends on whether the user has selected a different "RoleCategory" (Inform, Collaborator, Approver).
    //            //
    //            //debugger;
    //            if (sourceRoleCategory == 'inform' && (newRoleCategory == 'Collaborator' || newRoleCategory == 'Approver')) {
    //                // Change from inform to assign row.
    //                // eg: <Assign Role="ADMIN" Form="CARForm.aspx" DoneForm="CARComments.aspx" Title="Add Comments/Approve" MailTemplate="Assign1.xsl" Subject="eCAR3 - New Work Item ({0})" RoleCategory="Approver">
    //                var row = {
    //                    '@Role': newRoleId,
    //                    '@RoleName': newRoleName,
    //                    '@AllowRequestModifications': allowRequestModifications,
    //                    '@RoleCategory': newRoleCategory,
    //                    '@Instructions': instructions,
    //                    '@Checklists': selectedChecklists,
    //                    '@BudgetThreshold': budgetThreshold

    //                };
    //                if (newRoleCategory == 'Approver' && newActions) {
    //                    row.Action = newActions;
    //                }


    //                // Delete the old row.
    //                // WHY IS THIS AN INFORM? Not sure about this line 1-11-2023 <<<<<<<<<<<<<<<<
    //                if (this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Inform) {
    //                    this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Inform.splice(roleIndex, 1); // delete leaves a null, so we have to use splice.
    //                }




    //                // Depending on the new RoleCategory, figure out where in the json to insert this assignment row. For instance, if it is "Approver", it should show up at the top of the "Approvers", and be highlighted so th euser know what they just changed.
    //                // Iterate through all of the assignment rows and find this out.
    //                var assignIndex;
    //                var weFoundIt = false;
    //                //debugger;
    //                for (var i = 0; i < this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign.length; i++) {
    //                    console.log('this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[i]: ' + this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[i]["@RoleCategory"] + ', newRoleCategory: ' + newRoleCategory);
    //                    if (!weFoundIt && this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[i]["@RoleCategory"] == newRoleCategory) {
    //                        // We have found the first of this role category, so we will insert this new assignment row at the top.
    //                        this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign.splice(i, 0, row); // Create the row
    //                        assignIndex = i;
    //                        weFoundIt = true;
    //                    }
    //                }
    //            } else if (sourceRoleCategory == 'assign' && newRoleCategory == 'Inform') {
    //                // Change from assign to inform row.

    //                debugger; // 12-9-2021
    //                //var roleId = this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex]["@Role"];
    //                this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign.splice(roleIndex, 1); // delete leaves a null, so we have to use splice.
    //                // eg: <Inform Role="DIRSAFE" MailTemplate="Inform1.xsl" Subject="eCAR3 - New Project {0} created" Cond="$ProjectType~IM,LR,EQ,SG,FS,WS,ENV,INO,PSM,IT,TRANS,WH" />
    //                var row = {
    //                    '@Role': newRoleId,
    //                    '@RoleName': newRoleName,
    //                    '@AllowRequestModifications': allowRequestModifications,
    //                    '@Instructions': instructions,
    //                    '@Checklists': selectedChecklists,
    //                    '@BudgetThreshold': budgetThreshold

    //                }
    //                if (this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Inform) {
    //                    this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Inform.splice(0, 0, row); // Create the row
    //                } else {

    //                    this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex]["Inform"].push(row);

    //                }

    //            } else {

    //                // No change to RoleCategory, stay in the same row. THIS IS THE ONLY PLACE WHERE we save values to an existing row in the workflow.
    //                if (sourceRoleCategory == 'inform') {

    //                    if (this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Inform && this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Inform.length && this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Inform[roleIndex]) {

    //                        // This is an existing row in the JSON which we will overwrite.
    //                        this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Inform[roleIndex]["@Checklists"] = selectedChecklists; // The only thing that could change here is "Cond".
    //                        if (newRoleId) {
    //                            this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Inform[roleIndex]["@Role"] = newRoleId;
    //                            this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Inform[roleIndex]["@RoleName"] = newRoleName;
    //                            this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Inform[roleIndex]["@Instructions"] = instructions;

    //                            this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Inform[roleIndex]["@BudgetThreshold"] = budgetThreshold;
    //                        }

    //                    } else {

    //                        // This is a new row to add to the JSON.
    //                        if (!this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Inform) {
    //                            this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex]["Inform"] = [];
    //                        }
    //                        if (!this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Inform.length) {
    //                            this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex]["Inform"] = [];
    //                        }

    //                        if (newRoleId) {

    //                            var json = {
    //                                '@Checklists': selectedChecklists,
    //                                '@Role': newRoleId,
    //                                '@RoleName': newRoleName,
    //                                '@Instructions': instructions,
    //                                '@BudgetThreshold': budgetThreshold
    //                            }
    //                            this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Inform.push(json);

    //                        }

    //                    }


    //                    //
    //                    // end: CHANGING FROM INFORM 7-10-2023.
    //                    //
















    //                } else if (sourceRoleCategory == 'assign') {
    //                    if (((newRoleCategory == 'Approver') || (newRoleCategory == 'Collaborator')) && newActions) { // 4-20-2022 added "Collaborator"
    //                        // Find out if we changed the Tooltip and JavaScript values already. They save differently..... not sure if this is best approach yet.
    //                        var actionIndex;
    //                        for (var a = 0; a < this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[roleIndex].Action.length; a++) {
    //                            var x1 = this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[roleIndex].Action[a]["@Name"];
    //                            for (var b = 0; b < newActions.length; b++) {
    //                                var buttonTitle = newActions[b]["@Name"];
    //                                if (x1 == buttonTitle) {
    //                                    //debugger;
    //                                    var tooltip = this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[roleIndex].Action[a].Tooltip;
    //                                    //var javascript = this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[roleIndex].Action[a]["@JavaScript"]; // commented out 12-20-2021 THSI FORCES THE JS HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //                                    newActions[b].Tooltip = tooltip;
    //                                    debugger;
    //                                    //if (!javascript) {
    //                                    debugger;
    //                                    console.log('BUTTON JAVASCRIPT IS FORCED HERE, SO USER CHANGES WILL BE OVERWRITTEN. xcx995347');
    //                                    switch (buttonTitle) {
    //                                        //case 'Review Completed':
    //                                        //    javascript = "$('.bwRequest').bwRequest('cmdApproveRequest', this);"; // 4-20-2022
    //                                        //    break;
    //                                        case 'Approve':
    //                                            javascript = "$('.bwRequest').bwRequest('cmdApproveRequest', this);"; // 12-20-2021
    //                                            break;
    //                                        case 'Decline':
    //                                            javascript = "$('.bwRequest').bwRequest('cmdDeclineRequest', this);"; // 12-20-2021
    //                                            break;
    //                                        case 'Revise/Hold':
    //                                            javascript = "$('.bwRequest').bwRequest('cmdReviseHoldRequest', this);"; // 12-20-2021
    //                                            break;
    //                                        case 'Cancel':
    //                                            javascript = "$('.bwRequest').bwRequest('cmdCancelRequest', this);"; // 12-20-2021
    //                                            break;
    //                                        default:
    //                                            console.log('Error: Invalid button title xcx2356.');
    //                                            alert('Error: Invalid button title xcx2356.');
    //                                            break;
    //                                    }

    //                                    //}
    //                                    newActions[b]["@JavaScript"] = javascript;

    //                                }
    //                            }
    //                        }
    //                        this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[roleIndex].Action = newActions;
    //                    }
    //                    //debugger;
    //                    this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[roleIndex]["@RoleCategory"] = newRoleCategory; // 12-20-2021
    //                    this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[roleIndex]["@Checklists"] = selectedChecklists;
    //                    this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[roleIndex]["@Role"] = newRoleId;
    //                    this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[roleIndex]["@RoleName"] = newRoleName;
    //                    this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[roleIndex]["@AllowRequestModifications"] = allowRequestModifications;
    //                    this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[roleIndex]["@Instructions"] = instructions;


    //                    this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[roleIndex]["@BudgetThreshold"] = budgetThreshold;


    //                } else if (sourceRoleCategory == 'admin') {
    //                    //debugger;
    //                    // Not doing anything here. All we want to be able to do is change the active 'ADMIN' user, which happens below when it is saved to the database.
    //                    //newRoleId = 'ADMIN';
    //                    //newRoleName = '';


    //                    // 1-12-2022
    //                    alert('xcx123452');
    //                    debugger;

    //                    this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign = [{
    //                        '@Role': newRoleId,
    //                        '@RoleName': newRoleName,
    //                        '@Title': '',
    //                        '@AllowRequestModifications': allowRequestModifications,
    //                        '@RoleCategory': newRoleCategory,
    //                        '@Instructions': instructions,
    //                        '@Checklists': selectedChecklists,
    //                        '@BudgetThreshold': budgetThreshold

    //                    }];

    //                    debugger;
    //                    //this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign["@AllowRequestModifications"] = allowRequestModifications;
    //                    this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[0].Action = newActions;



    //                    // Added 6-27-2020
    //                    //debugger;
    //                    //this.options.CurrentWorkflow.Workflow.Steps.Step[stepIndex].Assign[roleIndex]["@AllowRequestModifications"] = allowRequestModifications;

    //                    //debugger;
    //                    //if (newRoleCategory == 'Approver' && newActions) {
    //                    //    //Find out if we changed the Tooltip and JavaScript values already. They save differently..... not sure if this is best approach yet.

    //                    //    //DON'T SAVE THE ACTIONS UNTIL WE FIGURE OUT IF WE WANT TO
    //                    //    var actionIndex;
    //                    //    for (var a = 0; a < this.options.CurrentWorkflow.Workflow.Steps.Step[stepIndex].Assign.Action.length; a++) {
    //                    //        var x1 = this.options.CurrentWorkflow.Workflow.Steps.Step[stepIndex].Assign.Action[a]["@Name"];
    //                    //        for (var b = 0; b < newActions.length; b++) {
    //                    //            var x2 = newActions[b]["@Name"];
    //                    //            if (x1 == x2) {
    //                    //                //debugger;
    //                    //                var tooltip = this.options.CurrentWorkflow.Workflow.Steps.Step[stepIndex].Assign.Action[a].Tooltip;
    //                    //                var javascript = this.options.CurrentWorkflow.Workflow.Steps.Step[stepIndex].Assign.Action[a]["@JavaScript"];
    //                    //                newActions[b].Tooltip = tooltip;
    //                    //                newActions[b]["@JavaScript"] = javascript;

    //                    //            }
    //                    //        }
    //                    //    }
    //                    //    this.options.CurrentWorkflow.Workflow.Steps.Step[stepIndex].Assign.Action = newActions;
    //                    //    //End: // DON'T SAVE THE ACTIONS UNTIL WE FIGURE OUT IF WE WANT TO
    //                    //}
    //                    //debugger;
    //                    //this.options.store.Workflow.Steps.Step[stepIndex].Assign["@Cond"] = newConditionString;
    //                    //this.options.store.Workflow.Steps.Step[stepIndex].Assign["@Role"] = newRoleId;
    //                    //this.options.store.Workflow.Steps.Step[stepIndex].Assign["@RoleName"] = newRoleName;
    //                } else {
    //                    alert('ERROR: Invalid sourceRoleCategory: ' + sourceRoleCategory);
    //                }
    //            }
    //            //
    //            // Now we have to save the user(s) in the BwWorkflowUserRole schema.
    //            //
    //            //
    //            //debugger;
    //            //var userId; // Not sure why this is happening 6-2-2020 REMOVED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //            //try {
    //            //    userId = document.getElementById('txtRoleMembersId_' + stepIndex + '_' + roleIndex).value;
    //            //} catch(e) { }
    //            //if (userId) {
    //            //    // A user(s) has been selected, so update the table.
    //            //    var userFriendlyName = document.getElementById('txtRoleMembersFriendlyName_' + stepIndex + '_' + roleIndex).value;
    //            //    var userEmail = document.getElementById('txtRoleMembersEmail_' + stepIndex + '_' + roleIndex).value;
    //            //    var dtNow = new Date();
    //            //    var json = {
    //            //        bwTenantId: tenantId,
    //            //        bwWorkflowAppId: workflowAppId,
    //            //        bwParticipantId: userId,
    //            //        bwParticipantFriendlyName: userFriendlyName,
    //            //        bwParticipantEmail: userEmail,
    //            //        RoleId: newRoleId,
    //            //        RoleName: newRoleName, // JUST ADDED MAKE SURE THIS WORKS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    //            //        OrgId: 'ALL', // UNTIL WE GET THE Orgs figured out, use 'ALL' as the default.
    //            //        Active: true,
    //            //        Created: dtNow,
    //            //        Modified: dtNow,
    //            //        ModifiedByFriendlyName: participantFriendlyName,
    //            //        ModifiedById: participantId,
    //            //        ModifiedByEmail: participantEmail
    //            //    };
    //            //    $.ajax({
    //            //        url: thiz.options.operationUriPrefix + "odata/UserRole",
    //            //        type: "Post",
    //            //        timeout: thiz.options.ajaxTimeout,
    //            //        data: json,
    //            //        headers: {
    //            //            "Accept": "application/json; odata=verbose"
    //            //        }
    //            //    }).success(function (result) {
    //            //        try {
    //            //            // Re-render the screen.
    //            //            thiz._create();
    //            //        } catch (e) {
    //            //            console.log('Exception in bwWorkflowEditor.js.saveAssignmentRow().xx.update: ' + e.message + ', ' + e.stack);
    //            //            alert('Exception in bwWorkflowEditor.js.saveAssignmentRow().xx.update: ' + e.message + ', ' + e.stack);
    //            //        }
    //            //    }).error(function (data, errorCode, errorMessage) {
    //            //        //thiz.hideProgress();
    //            //        var msg;
    //            //        if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
    //            //            msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
    //            //        } else {
    //            //            msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
    //            //        }
    //            //        console.log('Fail in bwWorkflowEditor.js.saveAssignmentRow().xx.update: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
    //            //        alert('Fail in bwWorkflowEditor.js.saveAssignmentRow().xx.update: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
    //            //        //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
    //            //        //var error = JSON.parse(data.responseText)["odata.error"];
    //            //        //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
    //            //    });
    //            //} else {

    //            //debugger;



    //            // Re-render the screen.
    //            //this._create();

    //            // 12-20-2021
    //            //debugger;
    //            //var x = this.options.CurrentWorkflow; // THIS SHOULD BE OK BUT NOT FOR SOME REASON.


    //            //var assignmentRowChanged_ElementId;
    //            //this.element.html(this.renderWorkflowEditor1(assignmentRowChanged_ElementId)); // Render the Workflow Editor. 

    //            //this.checkIfWeHaveToDisplayThePublishChangesButton();



    //            // 1-24-2023
    //            var selectedRequestTypeId; // If we get here, we can lookup the bwRequestTypeId from the selectRequestTypeDropDown drop-down.
    //            $('#selectRequestTypeDropDown').find('option:selected').each(function (index, element) {
    //                selectedRequestTypeId = element.value;
    //            });
    //            this.element.html(this.renderWorkflowEditor1(null, selectedRequestTypeId, stepIndex)); // Render the Workflow Editor. 
    //            this.checkIfWeHaveToDisplayThePublishChangesButton();





    //            //}
    //        } else {
    //            // We should never get here!!!
    //            displayAlertDialog('ERROR: Failed to locate the step or role in the underlying json.');
    //        }
    //    } catch (e) {
    //        console.log('Exception in saveAssignmentRow(): ' + e.message + ', ' + e.stack);
    //        displayAlertDialog('Exception in saveAssignmentRow(): ' + e.message + ', ' + e.stack);
    //    }
    //},
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
                                    html += '<td><input id="' + 'roleCheckbox_' + i + '" type="checkbox" checked /></td>';
                                } else {
                                    html += '<td><input id="' + 'roleCheckbox_' + i + '" type="checkbox" /></td>';
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
                                {
                                    bwFunctionalAreaYear: '2019', IsHidden: 'false', bwFunctionalAreaId: '1', bwFunctionalAreaQuote: 'false', bwFunctionalAreaTitle: 'Buildings'
                                },
                                {
                                    bwFunctionalAreaYear: '2019', IsHidden: 'false', bwFunctionalAreaId: '1', bwFunctionalAreaQuote: 'false', bwFunctionalAreaTitle: 'Computer equipment'
                                },
                                {
                                    bwFunctionalAreaYear: '2019', IsHidden: 'false', bwFunctionalAreaId: '1', bwFunctionalAreaQuote: 'false', bwFunctionalAreaTitle: 'Office equipment'
                                },
                                {
                                    bwFunctionalAreaYear: '2019', IsHidden: 'false', bwFunctionalAreaId: '1', bwFunctionalAreaQuote: 'false', bwFunctionalAreaTitle: 'Furniture and fixtures'
                                },
                                {
                                    bwFunctionalAreaYear: '2019', IsHidden: 'false', bwFunctionalAreaId: '1', bwFunctionalAreaQuote: 'false', bwFunctionalAreaTitle: 'Intangible assets'
                                },
                                {
                                    bwFunctionalAreaYear: '2019', IsHidden: 'false', bwFunctionalAreaId: '1', bwFunctionalAreaQuote: 'false', bwFunctionalAreaTitle: 'Land'
                                },
                                {
                                    bwFunctionalAreaYear: '2019', IsHidden: 'false', bwFunctionalAreaId: '1', bwFunctionalAreaQuote: 'false', bwFunctionalAreaTitle: 'Machinery'
                                },
                                {
                                    bwFunctionalAreaYear: '2019', IsHidden: 'false', bwFunctionalAreaId: '1', bwFunctionalAreaQuote: 'false', bwFunctionalAreaTitle: 'Software'
                                },
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



                                alert('Just changed this code: xcx9205793.');



                                //var quill = new Quill('#ConfigureEmailNotificationsDialogEditor', {
                                //    modules: {
                                //        toolbar: [
                                //          [{ header: [1, 2, false] }],
                                //          ['bold', 'italic', 'underline'],
                                //          ['image', 'code-block']
                                //        ]
                                //    },
                                //    placeholder: 'The enhanced notification email editor functionality is coming soon...', //'Compose an epic...',
                                //    theme: 'snow'  // or 'bubble'
                                //});




                                $($(thiz.element).find('#ConfigureEmailNotificationsDialogEditor')[0]).summernote({
                                    placeholder: 'xcx475856896', //data[0].Body, //'Hello stand alone ui',
                                    tabsize: 2,
                                    height: 400,
                                    //airMode: true,
                                    toolbar: [
                                        ['style', ['style']],
                                        ['font', ['bold', 'underline', 'clear']],
                                        ['color', ['color']],
                                        ['para', ['ul', 'ol', 'paragraph']],
                                        ['table', ['table']],
                                        ['insert', ['link', 'picture', 'video']],
                                        ['view', ['codeview', 'help']]
                                    ]
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
    editStepEmails: function (stepName, stepFriendlyName, instructionText) {
        try {
            console.log('In editStepEmails().');
            var thiz = this;

            // Set the dialog title.
            var html = '';
            html += 'Configure "' + stepFriendlyName + '" emails';
            document.getElementById('spanConfigureEmailNotificationsDialogTitle').innerHTML = html;

            // Set the dialog sub title.
            document.getElementById('spanConfigureEmailNotificationsDialogSubTitle').innerHTML = instructionText;

            // Populate the "selectEditEmailFor" drop-down based on the workflow step etc.
            var html = '';
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
            //} else {
            //    // no drop down
            //}
            document.getElementById('spanConfigureEmailNotificationsDialogSelectEditEmailForDropdown').innerHTML = html;

            // Set the "Save" button.
            var html = '';
            html += '<div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveEmailTemplateForStep\', \'' + stepName + '\');">';
            html += '☑ Save this email template';
            html += '</div>';
            document.getElementById('spanConfigureEmailNotificationsDialogSaveButton').innerHTML = html;

            var html = ''; // displayEditEmailInstructionTextDialog needs to pass stepName

            // Display the email editor.
            $("#divConfigureEmailNotificationsDialog").dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '1100',
                dialogClass: 'no-close', // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $('#divConfigureEmailNotificationsDialog').dialog('close');
                    });

                    var html = '';
                    html += '<span title="Edit email instruction text..." style="width:200px;padding:5px 10px 5px 10px;margin:0 0 0 10px;white-space:nowrap;vertical-align:middle;border:1px solid lightblue;cursor:pointer;font-weight:normal;font-size:10pt;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayEditEmailInstructionTextDialog\',\'' + stepName + '\');"><span style="display:inline-block;"> ⚙ </span></span>';
                    document.getElementById('spanConfigureEmailNotificationsDialogInstructionText_EditButton').innerHTML = html;

                    // Hook up this button event so that the user can insert data items into the email.
                    var customButton1 = document.querySelector('#btnQuill_InsertADataItemForSubject');
                    customButton1.addEventListener('click', function () {
                        thiz.displayEmailDataItemPickerDialog('subject');
                    });

                    //$('#ConfigureEmailNotificationsDialogEditor').summernote({
                    //    dialogsInBody: true, // Use this if hosting the summernote widget in a dialog, or if generally having dialog issues when using the toolbar.
                    //    placeholder: 'placeholder xcx44956', //data[0].Body, //'Hello stand alone ui',
                    //    tabsize: 2,
                    //    height: 400,
                    //    //airMode: true,
                    //    toolbar: [
                    //      ['style', ['style']],
                    //      ['font', ['bold', 'underline', 'clear']],
                    //      ['color', ['color']],
                    //      ['para', ['ul', 'ol', 'paragraph']],
                    //      ['table', ['table']],
                    //      ['insert', ['link']], //, 'picture', 'video']],
                    //      ['view', ['codeview', 'help']]
                    //    ]
                    //});

                    // Hook up this button event so that the user can insert data items into the email.
                    var customButton = document.querySelector('#btnQuill_InsertADataItem');
                    customButton.addEventListener('click', function () {
                        thiz.displayEmailDataItemPickerDialog('body');
                    });

                    // Retrieve the email from the workflow and display it in the editor.
                    var emailTemplateForSubject;
                    var emailTemplate = '';
                    if (stepName == 'Overdue') {

                        emailTemplateForSubject = thiz.options.CurrentWorkflow.DraftWorkflow["@EmailTemplateForSubject_TaskOverdue"];
                        emailTemplateForSubject = emailTemplateForSubject.replace(/&lt;/g, '<'); // This makes it so the editor recognizes the HTML.
                        emailTemplateForSubject = emailTemplateForSubject.replace(/&gt;/g, '>'); // This makes it so the editor recognizes the HTML.

                        emailTemplate = thiz.options.CurrentWorkflow.DraftWorkflow["@EmailTemplate_TaskOverdue"];
                        emailTemplate = emailTemplate.replace(/&lt;/g, '<'); // This makes it so the editor recognizes the HTML.
                        emailTemplate = emailTemplate.replace(/&gt;/g, '>'); // This makes it so the editor recognizes the HTML.

                        //var emailTemplateTitle = document.getElementById('selectEditEmailFor').value;
                        //if (emailTemplateTitle == 'Informed') {
                        //    emailTemplateForSubject = thiz.options.CurrentWorkflow.Workflow["EmailTemplateForSubject_Informed"];
                        //    emailTemplate = thiz.options.CurrentWorkflow.Workflow["EmailTemplate_Informed"];
                        //} else if (emailTemplateTitle == 'Task Assigned') {
                        //    emailTemplateForSubject = thiz.options.CurrentWorkflow.Workflow["EmailTemplateForSubject_TaskAssigned"];
                        //    emailTemplate = thiz.options.CurrentWorkflow.Workflow["EmailTemplate_TaskAssigned"];
                        //} else if (emailTemplateTitle == 'Task Overdue') {
                        //    emailTemplateForSubject = thiz.options.CurrentWorkflow.Workflow["EmailTemplateForSubject_TaskOverdue"];
                        //    emailTemplate = thiz.options.CurrentWorkflow.Workflow["EmailTemplate_TaskOverdue"];
                        //} else if (emailTemplateTitle == 'Task Cancelled') {
                        //    emailTemplateForSubject = thiz.options.CurrentWorkflow.Workflow["EmailTemplateForSubject_TaskCancelled"];
                        //    emailTemplate = thiz.options.CurrentWorkflow.Workflow["EmailTemplate_TaskCancelled"];
                        //} else {
                        //    alert('Unexpected emailTemplateTitle in editStepEmails(): ' + emailTemplateTitle);
                        //}
                    } else {
                        for (var i = 0; i < thiz.options.CurrentWorkflow.DraftWorkflow.Steps.Step.length; i++) {
                            if (thiz.options.CurrentWorkflow.DraftWorkflow.Steps.Step[i]["@Name"] == stepName) {
                                emailTemplateForSubject = thiz.options.CurrentWorkflow.DraftWorkflow.Steps.Step[i]["@EmailTemplateForSubject"];
                                if (emailTemplateForSubject) {
                                    emailTemplateForSubject = emailTemplateForSubject.replace(/&lt;/g, '<'); // This makes it so the editor recognizes the HTML.
                                    emailTemplateForSubject = emailTemplateForSubject.replace(/&gt;/g, '>'); // This makes it so the editor recognizes the HTML.
                                }

                                emailTemplate = thiz.options.CurrentWorkflow.DraftWorkflow.Steps.Step[i]["@EmailTemplate"];
                                if (emailTemplate) {
                                    emailTemplate = emailTemplate.replace(/&lt;/g, '<'); // This makes it so the editor recognizes the HTML.
                                    emailTemplate = emailTemplate.replace(/&gt;/g, '>'); // This makes it so the editor recognizes the HTML.
                                }

                                break;
                            }
                        }
                    }
                    if (emailTemplateForSubject && emailTemplateForSubject != '') {
                        $('#ConfigureEmailNotificationsDialogEditorForSubject')[0].value = emailTemplateForSubject;
                    } else {
                        $('#ConfigureEmailNotificationsDialogEditorForSubject')[0].value = '';
                    }

                    $('#ConfigureEmailNotificationsDialogEditor').summernote({
                        dialogsInBody: true, // Use this if hosting the summernote widget in a dialog, or if generally having dialog issues when using the toolbar.
                        placeholder: 'placeholder xcx44956', //data[0].Body, //'Hello stand alone ui',
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

                    if (emailTemplate && emailTemplate != '') {
                        //$('#ConfigureEmailNotificationsDialogEditor').summernote('reset');
                        debugger;
                        $('#ConfigureEmailNotificationsDialogEditor').summernote('code', emailTemplate);
                    } else {
                        $('#ConfigureEmailNotificationsDialogEditor').summernote('reset');
                    }

                },
                close: function () {
                    $('#divConfigureEmailNotificationsDialog').dialog('destroy');
                }
            });
            //$('#divConfigureEmailNotificationsDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();

        } catch (e) {
            console.log('Exception in editStepEmails(): ' + e.message + ', ' + e.stack);
            this.displayAlertDialog('Exception in editStepEmails(): ' + e.message + ', ' + e.stack);
        }
    },

    //editOverdueTasksEmailTemplate: function () {
    //    try {
    //        console.log('In editOverdueTasksEmailTemplate().');
    //        var thiz = this;
    //        //
    //        // Set the dialog sub title.
    //        //
    //        var html = '';

    //        html = 'Configure "Overdue Task" emails';
    //        document.getElementById('spanConfigureEmailNotificationsDialogTitle').innerHTML = html;

    //        html = 'These emails get sent to participants to remind them of overdue tasks.';
    //        document.getElementById('spanConfigureEmailNotificationsDialogSubTitle').innerHTML = html;
    //        //
    //        // Populate the "selectEditEmailFor" drop-down based on the workflow step etc.
    //        //
    //        //var html = '';


    //        //html += '<br />';
    //        //html += '<span style="font-style:italic;font-size:small;color:tomato;">The participants with RACI role of Informed will receive this email when significant notifications need to be delivered to them.</span>';
    //        //html += '<br />';

    //        document.getElementById('spanConfigureEmailNotificationsDialogSelectEditEmailForDropdown').innerHTML = '';

    //        //
    //        // Set the "Save" button.
    //        //
    //        var html = '';
    //        html += '<div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveEmailTemplateForOverdueTasks\', \'' + 'stepName' + '\');">';
    //        html += '☑ Save this email template';
    //        html += '</div>';
    //        document.getElementById('spanConfigureEmailNotificationsDialogSaveButton').innerHTML = html;
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
    //                thiz.options.quillSubjectEditor = new Quill('#ConfigureEmailNotificationsDialogEditorForSubject', {
    //                    modules: {
    //                        toolbar: '#bwQuilltoolbarForSubject'
    //                    },
    //                    //placeholder: 'The enhanced notification email editor functionality is coming soon...', 
    //                    theme: 'snow'
    //                });
    //                // Hook up this button event so that the user can insert data items into the email.
    //                var customButton1 = document.querySelector('#btnQuill_InsertADataItemForSubject');
    //                customButton1.addEventListener('click', function () {
    //                    //console.log('btnQuill_InsertADataItem: This functionality is incomplete. Coming soon!');
    //                    thiz.displayEmailDataItemPickerDialog('subject');
    //                });

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
    //                    //console.log('btnQuill_InsertADataItem: This functionality is incomplete. Coming soon!');
    //                    thiz.displayEmailDataItemPickerDialog('body');
    //                });
    //                // Retrieve the email from the workflow and display it in the editor.
    //                var emailTemplateForSubject;
    //                var emailTemplate = '';
    //                //if (stepName == 'all') {
    //                //    var emailTemplateTitle = document.getElementById('selectEditEmailFor').value;
    //                //    if (emailTemplateTitle == 'Informed') {
    //                //        emailTemplateForSubject = thiz.options.CurrentWorkflow.Workflow["EmailTemplateForSubject_Informed"];
    //                //        emailTemplate = thiz.options.CurrentWorkflow.Workflow["EmailTemplate_Informed"];
    //                //    } else if (emailTemplateTitle == 'Task Assigned') {
    //                //        emailTemplateForSubject = thiz.options.CurrentWorkflow.Workflow["EmailTemplateForSubject_TaskAssigned"];
    //                //        emailTemplate = thiz.options.CurrentWorkflow.Workflow["EmailTemplate_TaskAssigned"];
    //                //    } else if (emailTemplateTitle == 'Task Overdue') {
    //                //        emailTemplateForSubject = thiz.options.CurrentWorkflow.Workflow["EmailTemplateForSubject_TaskOverdue"];
    //                //        emailTemplate = thiz.options.CurrentWorkflow.Workflow["EmailTemplate_TaskOverdue"];
    //                //    } else if (emailTemplateTitle == 'Task Cancelled') {
    //                //        emailTemplateForSubject = thiz.options.CurrentWorkflow.Workflow["EmailTemplateForSubject_TaskCancelled"];
    //                //        emailTemplate = thiz.options.CurrentWorkflow.Workflow["EmailTemplate_TaskCancelled"];
    //                //    } else {
    //                //        alert('Unexpected emailTemplateTitle in editStepEmails(): ' + emailTemplateTitle);
    //                //    }
    //                //} else {
    //                //for (var i = 0; i < thiz.options.CurrentWorkflow.Workflow.Steps.Step.length; i++) {
    //                //if (thiz.options.CurrentWorkflow.Workflow.Steps.Step[i]["@Name"] == stepName) {
    //                debugger;
    //                emailTemplateForSubject = thiz.options.CurrentWorkflow.Workflow["EmailTemplateForSubject_TaskOverdue"];
    //                emailTemplate = thiz.options.CurrentWorkflow.Workflow["EmailTemplate_TaskOverdue"];
    //                //    break;
    //                //}
    //                //}
    //                //}
    //                if (emailTemplateForSubject && emailTemplateForSubject != '') {
    //                    thiz.options.quillSubjectEditor.setText(emailTemplateForSubject);
    //                } else {
    //                    thiz.options.quillSubjectEditor.setText('');
    //                }
    //                if (emailTemplate && emailTemplate != '') {
    //                    //debugger;
    //                    thiz.options.quill.root.innerHTML = emailTemplate; //.setText(emailTemplate);
    //                } else {
    //                    thiz.options.quill.setText('');
    //                }
    //            },
    //            close: function () {
    //                $('#divConfigureEmailNotificationsDialog').dialog('destroy');
    //            }
    //        });
    //        //$('#divConfigureEmailNotificationsDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();









    //    } catch (e) {
    //        console.log('Exception in editOverdueTasksEmailTemplate(): ' + e.message + ', ' + e.stack);
    //    }
    //},
    hideDataItemHoverDialog: function (e) {
        try {
            console.log('In hideDataItemHoverDialog().');

            if (document.getElementById('divDataItemHoverDialog').style.display != 'none') {
                $('#divDataItemHoverDialog').dialog('close');
            }

        } catch (e) {
            console.log('Exception in hideDataItemHoverDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in hideDataItemHoverDialog(): ' + e.message + ', ' + e.stack);
        }
    },
    showDataItemHoverDialog: function (element) {
        try {
            console.log('In showDataItemHoverDialog().');
            var thiz = this;

            $('#spanDataItemHoverDialog_Contents').html('');
            var dataItem = $(element).html().trim();

            var promise = bwCommonScripts.getEmailDataItemTemplateSample(dataItem);
            promise.then(function (result) {

                if (result.message != 'SUCCESS') {

                    console.log('Error in showDataItemHoverDialog(): ' + result.message);
                    displayAlertDialog('Error in showDataItemHoverDialog(): ' + result.message);

                } else {

                    //if (dataItem.indexOf('%Task Summary Section%') > -1) {
                    //    document.getElementById('spanDataItemHoverDialog_Contents').style.transform = 'scale(0.5)';
                    //} else {
                    //    document.getElementById('spanDataItemHoverDialog_Contents').style.transform = 'scale(1)';
                    //}


                    $('#spanDataItemHoverDialog_Contents').html(result.Template);

                    $('#divDataItemHoverDialog').dialog({
                        resizable: false,
                        draggable: false,
                        width: "800",
                        position: {
                            my: "middle top+100",
                            at: "middle top",
                            of: window
                        },
                        open: function (event, ui) {

                            $('#divDataItemHoverDialog').unbind('click', function () { });

                        },
                        close: function () {
                            $('#divDataItemHoverDialog').dialog('close');
                        }
                    });
                    $('#divDataItemHoverDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();

                }

            }).catch(function (result) {

                console.log('Exception in showDataItemHoverDialog():2: ' + result.message);
                displayAlertDialog('Exception in showDataItemHoverDialog():2: ' + result.message);

            });

        } catch (e) {
            console.log('Exception in showDataItemHoverDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in showDataItemHoverDialog(): ' + e.message + ', ' + e.stack);
        }
    },

    bwWorkflowEditor_txtLocationPickerFilter_OnMouseup: function () {
        try {
            console.log('In bwWorkflowEditor_txtLocationPickerFilter_OnMouseup().');
            var thiz = this;

            // When the user is done selecting a location, hide the location picker drop down.

            // When displaying the location picker, make it size itself a bit wider than the user entry textbox.
            var width1 = $('#bwWorkflowEditor_txtLocationPickerFilter')[0].style.width;
            var width2 = width1.split('px')[0];
            var width3 = Number(width2) + 50;
            var width = width3; // + 'px';

            $("#bwWorkflowEditor_divLocationPickerDropDown").dialog({
                position: {
                    my: "left top",
                    at: "left bottom",
                    of: $('#bwWorkflowEditor_txtLocationPickerFilter')
                },
                modal: true,
                resizable: false,
                closeText: "Cancel",
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                height: 300,
                width: width,
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hi
                open: function (event, ui) {

                    $('.ui-widget-overlay').bind('click', function () {
                        $("#bwWorkflowEditor_divLocationPickerDropDown").dialog('close');
                    });

                    // Hide the title bar.
                    $("#bwWorkflowEditor_divLocationPickerDropDown").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
                },
                close: function () {
                    try {
                        if ($('#divDataItemHoverDialog') && $('#divDataItemHoverDialog').dialog) {
                            $('#divDataItemHoverDialog').dialog('close');
                        }
                        $("#bwWorkflowEditor_divLocationPickerDropDown").dialog('destroy');
                    } catch (e) {
                        console.log('Exception in bwWorkflowEditor_txtLocationPickerFilter_OnMouseup.dialog.close():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwWorkflowEditor_txtLocationPickerFilter_OnMouseup.dialog.close():2: ' + e.message + ', ' + e.stack);
                    }
                }

            });

        } catch (e) {
            console.log('Exception in bwWorkflowEditor_txtLocationPickerFilter_OnMouseup(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwWorkflowEditor_txtLocationPickerFilter_OnMouseup(): ' + e.message + ', ' + e.stack);
        }
    },
    bwWorkflowEditor_txtLocationPickerFilter_OnKeyup: function (elementId) {
        try {
            console.log('In bwWorkflowEditor_txtLocationPickerFilter_OnKeyup(). elementId: ' + elementId);

            if ($('#bwWorkflowEditor_divLocationPickerDropDown')[0].style.display == 'none') {
                this.bwWorkflowEditor_txtLocationPickerFilter_OnMouseup();
            }

        } catch (e) {
            console.log('Exception in bwWorkflowEditor_txtLocationPickerFilter_OnKeyup(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwWorkflowEditor_txtLocationPickerFilter_OnKeyup(): ' + e.message + ', ' + e.stack);
        }
    },
    bwWorkflowEditor_SelectADataItem: function (element) {
        try {
            console.log('In bwWorkflowEditor_SelectADataItem().');

            var selectedDataItem = $(element).html();
            $("#bwWorkflowEditor_divLocationPickerDropDown").dialog('close');
            $('#bwWorkflowEditor_txtLocationPickerFilter').val(selectedDataItem);

            //alert('In bwWorkflowEditor_SelectADataItem(). selectedDataItem: ' + selectedDataItem);

            //if ($('#bwWorkflowEditor_divLocationPickerDropDown')[0].style.display == 'none') {
            //    this.bwWorkflowEditor_txtLocationPickerFilter_OnMouseup();
            //}

        } catch (e) {
            console.log('Exception in bwWorkflowEditor_SelectADataItem(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwWorkflowEditor_SelectADataItem(): ' + e.message + ', ' + e.stack);
        }
    },
    displayEmailDataItemPickerDialog: function (emailSection) { // emailSection is either 'subject' or 'body'.
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
                    if ($('#divDataItemHoverDialog') && $('#divDataItemHoverDialog').dialog) {
                        $('#divDataItemHoverDialog').dialog('close');
                    }
                    $('#divEmailDataItemPickerDialog').dialog('destroy');
                }
            });
            //$("#divEmailDataItemPickerDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
            //debugger;
            document.getElementById('spanEmailDataItemPickerDialogSubTitle').innerHTML = 'Data items use percentage delimiters, for example: %data item name%<br /><br />Select a data item then click the "Insert" button to have it inserted at the cursor...';


            var dataConversionJson = bwCommonScripts.getEmailTemplateConversionJson();



            // 4-4-2022 Adding functionality so that when an item in the drop-down is hovered-over, a hover-dialog appears with a visual representation of the data-item-tag. 




            var html = '';

            // This is the old drop-down, before we decided we want to have a hover-dialog for the items in the drop-down. 4-5-2022
            //html += '<select id="selectEmailDataItemPickerDialogDataItem" style="padding:5px 5px 5px 5px;">';
            //html += '   <option value="1">Select a data item...</option>';
            //var keys = Object.keys(dataConversionJson);
            //for (var i = 0; i < keys.length; i++) {
            //    html += '   <option value="3" onmouseover="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayDataItemHoverDialog\', this);" >' + dataConversionJson[keys[i]].TemplateText + ' xcx1</option>';
            //}




            //
            // New drop-down with hover/onmouseover event.
            //
            html += '<input id="bwWorkflowEditor_txtLocationPickerFilter" value="Select a data item..." type="text" style="width:450px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'bwWorkflowEditor_txtLocationPickerFilter_OnKeyup\', \'txtLocationPickerFilter\');" onmouseup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'bwWorkflowEditor_txtLocationPickerFilter_OnMouseup\', \'txtLocationPickerFilter\');" />'; //</input>';
            html += '<br />';
            html += '<div id="bwWorkflowEditor_divLocationPickerDropDown" style="display:none;background-color:white;overflow-x:hidden;">'; // Scrollable div wrapper for the drop-down. // dark blue border. // position and z-index makes it show up on top and to not move the other elements around.
            //html += '   <div value="3">' + 'Select a data item...' + '</div>';
            var keys = Object.keys(dataConversionJson);
            for (var i = 0; i < keys.length; i++) {
                html += '   <div class="dataItemInDropDown" onmouseover="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'showDataItemHoverDialog\', this);" onmouseout="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'hideDataItemHoverDialog\', this);" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'bwWorkflowEditor_SelectADataItem\', this);" >' + dataConversionJson[keys[i]].TemplateText + ' </div>';
            }
            html += '</div>'; // Scrollable div wrapper for the drop-down.













            //html += '   <option value="3">&#10697; Company Logo</option>';
            //html += '   <option value="2">&#9863; Participant Friendly Name</option>';
            //html += '   <option value="2">&#9863; Participant Email</option>';
            //html += '   <option value="3">&#9992; Budget Request Link</option>';
            //html += '   <option value="3">&#9993; Configure Email Settings Link</option>';
            //html += '   <option value="3">&#9775; Disclaimer/Legal Text</option>';
            //html += '   <option value="3">&#9746; Unsubscribe Link</option>';
            //html += '   <option value="3">Budget Request Number</option>';
            //html += '   <option value="3">Budget Request Title</option>'; // Project Title, or also known as "Description".
            //html += '   <option value="3">Next Task Assignment Text</option>';
            //html += '   <option value="3">Role Abbreviation</option>';
            //html += '   <option value="3">Role Name</option>';

            html += '</select>';
            html += '&nbsp;&nbsp;';
            html += '<input style="padding:5px 10px 5px 10px;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'insertEmailDataItem\', \'' + emailSection + '\');" type="button" value="Insert">';
            document.getElementById('spanEmailDataItemPickerDialogContentTop').innerHTML = html;

        } catch (e) {
            console.log('Exception in displayEmailDataItemPickerDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in displayEmailDataItemPickerDialog(): ' + e.message + ', ' + e.stack);
        }
    },
    displayWorkflowActionsUnderlyingPropertiesDialog: function (elementId, actionTitle) {
        try {
            console.log('In displayWorkflowActionsUnderlyingPropertiesDialog(). elementId: ' + elementId + ', actionTitle: ' + actionTitle);
            var x = elementId.split('_')[1];
            var stepIndex = x.split('_')[0];
            var rowIndex = elementId.split('_')[2];

            document.getElementById('spanWorkflowActionsUnderlyingPropertiesDialogSubTitle').innerHTML = 'Update the properties for the "' + actionTitle + '" button, then click "Save"...';
            var html = '';
            // "@JavaScript": "$('#divRequestFormDialog').dialog('close');", "Tooltip": "Cancel the entire request"
            var buttontext = '';
            var tooltip = '';
            var javascript = '';

            if (this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[rowIndex]) {
                for (var i = 0; i < this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[rowIndex].Action.length; i++) {
                    if (this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[rowIndex].Action[i]["@Name"] == actionTitle) {

                        var action = this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[rowIndex].Action[i];
                        if (action.Tooltip) tooltip = action.Tooltip;
                        if (action["@JavaScript"]) javascript = action["@JavaScript"];
                        break;
                    }
                }
            } else {
                for (var i = 0; i < this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign.Action.length; i++) {
                    if (this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign.Action[i]["@Name"] == actionTitle) {

                        var action = this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign.Action[i];
                        if (action.Tooltip) tooltip = action.Tooltip;
                        if (action["@JavaScript"]) javascript = action["@JavaScript"];
                        break;
                    }
                }
            }

            html += 'Button Text: <input id="WorkflowActionsUnderlyingPropertiesDialog_ButtonText" type="text" style="width:425px;" value="' + actionTitle + '"/>';
            html += '<br />';
            html += '<br />';
            html += 'Tooltip: <input id="WorkflowActionsUnderlyingPropertiesDialog_Tooltip" type="text" style="width:425px;" value="' + tooltip + '"/>';
            html += '<br />';
            html += '<br />';
            html += 'JavaScript: <input id="WorkflowActionsUnderlyingPropertiesDialog_JavaScript" type="text" style="width:425px;font-size:10pt;" value="' + javascript + '"/>';
            html += '<br />';
            html += '<br />';
            html += '&nbsp;&nbsp;';
            html += '<input style="padding:5px 10px 5px 10px;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveWorkflowActionsUnderlyingProperties\', \'' + elementId + '\', \'' + actionTitle + '\');" type="button" value="Save">';
            document.getElementById('spanWorkflowActionsUnderlyingPropertiesDialogContentTop').innerHTML = html;

            $("#divWorkflowActionsUnderlyingPropertiesDialog_BwWorkflowEditor").dialog({
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
                        $('#divWorkflowActionsUnderlyingPropertiesDialog_BwWorkflowEditor').dialog('close');
                    });
                },
                close: function () {
                    //$(this).dialog('destroy'); //.remove();
                    $('#divWorkflowActionsUnderlyingPropertiesDialog_BwWorkflowEditor').dialog('destroy');
                }
            });

        } catch (e) {
            console.log('Exception in displayWorkflowActionsUnderlyingPropertiesDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in displayWorkflowActionsUnderlyingPropertiesDialog(): ' + e.message + ', ' + e.stack);
        }
    },
    saveWorkflowActionsUnderlyingProperties: function (elementId, actionTitle) {
        try {
            console.log('In saveWorkflowActionsUnderlyingProperties(' + elementId + ', ' + actionTitle + '). actionTitle: ' + actionTitle);
            var x = elementId.split('_')[1];
            var stepIndex = x.split('_')[0];
            var rowIndex = elementId.split('_')[2];

            var buttontext = document.getElementById('WorkflowActionsUnderlyingPropertiesDialog_ButtonText').value;

            if (!buttontext || !(buttontext.length && (buttontext.length > 4))) {

                displayAlertDialog('The workflow cannot be updated. The text that appears on the button has to be more than 4 characters long.');

            } else {
                var tooltip = document.getElementById('WorkflowActionsUnderlyingPropertiesDialog_Tooltip').value;
                var javascript = document.getElementById('WorkflowActionsUnderlyingPropertiesDialog_JavaScript').value;
                if (this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[rowIndex]) {
                    for (var i = 0; i < this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[rowIndex].Action.length; i++) {
                        if (this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[rowIndex].Action[i]["@Name"] == actionTitle) {

                            this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[rowIndex].Action[i]["@Name"] = buttontext;
                            this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[rowIndex].Action[i].Tooltip = tooltip;
                            this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign[rowIndex].Action[i]["@JavaScript"] = javascript;
                            break;
                        }
                    }
                } else {
                    for (var i = 0; i < this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign.Action.length; i++) {
                        if (this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign.Action[i]["@Name"] == actionTitle) {

                            this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign.Action[i]["@Name"] = buttontext;
                            this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign.Action[i].Tooltip = tooltip;
                            this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[stepIndex].Assign.Action[i]["@JavaScript"] = javascript;
                            break;
                        }
                    }
                }

                $('#divWorkflowActionsUnderlyingPropertiesDialog').dialog('close');
                this.checkIfWeHaveToDisplayThePublishChangesButton();
            }

        } catch (e) {
            console.log('Exception in saveWorkflowActionsUnderlyingProperties(' + actionTitle + '): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in saveWorkflowActionsUnderlyingProperties(' + actionTitle + '): ' + e.message + ', ' + e.stack);
        }
    },
    insertEmailDataItem: function (emailSection) { // emailSection is either 'subject' or 'body'.
        try {
            console.log('In insertEmailDataItem(). emailSection: ' + emailSection);
            // Get the selected value.

            var selectedDataItem = $('#bwWorkflowEditor_txtLocationPickerFilter').val(); // 4-5-2022

            //$('#selectEmailDataItemPickerDialogDataItem').find('option:selected').each(function (index, element) {
            //    selectedDataItem = element.innerHTML;
            //});

            // Close the dialog.
            $("#divEmailDataItemPickerDialog").dialog('close');
            if (emailSection == 'subject') {
                //var insertIndex = 0;
                //var range = this.options.quillSubjectEditor.getSelection();
                //if (range) {
                //    if (range.length == 0) {
                //        console.log('User cursor is at index', range.index);
                //        insertIndex = range.index;
                //    } else {
                //        var text = quillSubjectEditor.getText(range.index, range.length);
                //        console.log('User has highlighted: ', text);
                //        insertIndex = range.index;
                //    }
                //} else {
                //    console.log('User cursor is not in editor');
                //}
                //var html = '';
                //html += selectedDataItem;


                this.options.quillSubjectEditor.insertText(insertIndex, html, {
                    //'color': 'green',
                    //'bold': true
                });



            } else if (emailSection = 'body') {

                //var insertIndex = 0;
                //var range = this.options.quill.getSelection();
                //if (range) {
                //    if (range.length == 0) {
                //        console.log('User cursor is at index', range.index);
                //        insertIndex = range.index;
                //    } else {
                //        var text = quill.getText(range.index, range.length);
                //        console.log('User has highlighted: ', text);
                //        insertIndex = range.index;
                //    }
                //} else {
                //    console.log('User cursor is not in editor');
                //}
                var html = '';
                html += selectedDataItem;
                $('#ConfigureEmailNotificationsDialogEditor').summernote('insertText', html);

            } else {
                alert('Unexpected value for emailSection in insertEmailDataItem(): ' + emailSection);
            }
        } catch (e) {
            console.log('Exception in insertEmailDataItem(): ' + e.message + ', ' + e.stack);
        }
    },
    saveEmailTemplateForStep: function (stepName) {
        try {
            console.log('In saveEmailTemplateForStep(' + stepName + ').');
            //alert('In saveEmailTemplateForStep(' + stepName + ').');
            debugger;

            console.log('');
            console.log('===================================================================================');
            console.log('This is where we make sure the email templates JSON works OK in the workflow JSON. xcx1');
            console.log('===================================================================================');
            console.log('');


            //
            //
            // NOTE: I COMMENTED OUT ALL THESE LINES BELOW!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! >>>>>>>> .replace(/</g, '&lt;');
            // 2-10-2023
            //
            //

            if (stepName == 'Overdue') {

                var emailTemplateForSubject = $('#ConfigureEmailNotificationsDialogEditorForSubject')[0].value;
                emailTemplateForSubject = emailTemplateForSubject.replace(/\n/g, ''); // '<br />'); // I don't think we need these so just getting rid of them.
                //emailTemplateForSubject = emailTemplateForSubject.replace(/</g, '&lt;'); // Replace greater and lesser than characters.
                //emailTemplateForSubject = emailTemplateForSubject.replace(/>/g, '&gt;'); // Replace greater and lesser than characters.
                this.options.CurrentWorkflow.DraftWorkflow["@EmailTemplateForSubject_TaskOverdue"] = emailTemplateForSubject;

                var emailTemplate = $('#ConfigureEmailNotificationsDialogEditor').summernote('code').replace('<p><br></p>', ''); // This removes the first occurrance of this, which occurs at the top. It is put in by summernote so that it can get focus, is what the docs say.
                emailTemplate = emailTemplate.replace(/\n/g, ''); // '<br />'); // I don't think we need these so just getting rid of them.
                //emailTemplate = emailTemplate.replace(/</g, '&lt;'); // Replace greater and lesser than characters.
                //emailTemplate = emailTemplate.replace(/>/g, '&gt;'); // Replace greater and lesser than characters.
                this.options.CurrentWorkflow.DraftWorkflow["@EmailTemplate_TaskOverdue"] = emailTemplate;

                $('#divConfigureEmailNotificationsDialog').dialog('close');
                this.checkIfWeHaveToDisplayThePublishChangesButton();

            } else if (stepName == 'all') {

                // Get the value of the drop-down to determine where to store the email template.
                var emailTemplateTitle = document.getElementById('selectEditEmailFor').value;

                var emailTemplateForSubject = $('#ConfigureEmailNotificationsDialogEditorForSubject')[0].value;
                emailTemplateForSubject = emailTemplateForSubject.replace(/\n/g, ''); // '<br />'); // I don't think we need these so just getting rid of them.
                //emailTemplateForSubject = emailTemplateForSubject.replace(/</g, '&lt;'); // Replace greater and lesser than characters.
                //emailTemplateForSubject = emailTemplateForSubject.replace(/>/g, '&gt;'); // Replace greater and lesser than characters.

                var emailTemplate = $('#ConfigureEmailNotificationsDialogEditor').summernote('code').replace('<p><br></p>', ''); // This removes the first occurrance of this, which occurs at the top. It is put in by summernote so that it can get focus, is what the docs say.
                emailTemplate = emailTemplate.replace(/\n/g, ''); // '<br />'); // I don't think we need these so just getting rid of them.
                //emailTemplate = emailTemplate.replace(/</g, '&lt;'); // Replace greater and lesser than characters.
                //emailTemplate = emailTemplate.replace(/>/g, '&gt;'); // Replace greater and lesser than characters.

                if (emailTemplateTitle == 'Informed') {
                    this.options.CurrentWorkflow.DraftWorkflow["EmailTemplateForSubject_Informed"] = emailTemplateForSubject;
                    this.options.CurrentWorkflow.DraftWorkflow["EmailTemplate_Informed"] = emailTemplate;
                } else if (emailTemplateTitle == 'Task Assigned') {
                    this.options.CurrentWorkflow.DraftWorkflow["EmailTemplateForSubject_TaskAssigned"] = emailTemplateForSubject;
                    this.options.CurrentWorkflow.DraftWorkflow["EmailTemplate_TaskAssigned"] = emailTemplate;
                } else if (emailTemplateTitle == 'Task Overdue') {
                    this.options.CurrentWorkflow.DraftWorkflow["@EmailTemplateForSubject_TaskOverdue"] = emailTemplateForSubject;
                    this.options.CurrentWorkflow.DraftWorkflow["@EmailTemplate_TaskOverdue"] = emailTemplate;
                } else if (emailTemplateTitle == 'Task Cancelled') {
                    this.options.CurrentWorkflow.DraftWorkflow["EmailTemplateForSubject_TaskCancelled"] = emailTemplateForSubject;
                    this.options.CurrentWorkflow.DraftWorkflow["EmailTemplate_TaskCancelled"] = emailTemplate;
                } else {
                    alert('Unexpected emailTemplateTitle in saveEmailTemplateForStep(): ' + emailTemplateTitle);
                }
                this.checkIfWeHaveToDisplayThePublishChangesButton();
                alert('Email template saved locally. You will have to click the "Publish" button to make this available.');

            } else { //if (stepName.toLowerCase() == 'create' || stepName.toLowerCase() == 'admin' || stepName.toLowerCase() == 'collaboration') {

                var emailTemplateForSubject = $('#ConfigureEmailNotificationsDialogEditorForSubject')[0].value;
                emailTemplateForSubject = emailTemplateForSubject.replace(/\n/g, ''); // '<br />'); // I don't think we need these so just getting rid of them.
                //emailTemplateForSubject = emailTemplateForSubject.replace(/</g, '&lt;'); // Replace greater and lesser than characters.
                //emailTemplateForSubject = emailTemplateForSubject.replace(/>/g, '&gt;'); // Replace greater and lesser than characters.

                var emailTemplate = $('#ConfigureEmailNotificationsDialogEditor').summernote('code').replace('<p><br></p>', ''); // This removes the first occurrance of this, which occurs at the top. It is put in by summernote so that it can get focus, is what the docs say.
                emailTemplate = emailTemplate.replace(/\n/g, ''); // '<br />'); // I don't think we need these so just getting rid of them.
                //emailTemplate = emailTemplate.replace(/</g, '&lt;'); // Replace greater and lesser than characters.
                //emailTemplate = emailTemplate.replace(/>/g, '&gt;'); // Replace greater and lesser than characters.

                for (var i = 0; i < this.options.CurrentWorkflow.DraftWorkflow.Steps.Step.length; i++) {
                    if (this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[i]["@Name"] == stepName) {
                        this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[i]["@EmailTemplateForSubject"] = emailTemplateForSubject;
                        debugger;
                        this.options.CurrentWorkflow.DraftWorkflow.Steps.Step[i]["@EmailTemplate"] = emailTemplate;
                        $('#divConfigureEmailNotificationsDialog').dialog('close');
                        this.checkIfWeHaveToDisplayThePublishChangesButton();
                        break;
                    }
                }

            } //else {
            //    alert('Unexpected value for stepName in saveEmailTemplateForStep(): ' + stepName);
            //}
        } catch (e) {
            console.log('Exception in saveEmailTemplateForStep(' + stepName + '): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in saveEmailTemplateForStep(' + stepName + '): ' + e.message + ', ' + e.stack);
        }
    },
    //saveEmailTemplateForOverdueTasks: function () { // was named saveCollaborationTimeoutEmail 
    //    try {
    //        console.log('In saveEmailTemplateForOverdueTasks().');
    //        var emailTemplateForSubject = this.options.quillSubjectEditor.getText();
    //        var emailTemplate = this.options.quill.root.innerHTML;
    //        this.options.CurrentWorkflow.DraftWorkflow["@EmailTemplateForSubject_TaskOverdue"] = emailTemplateForSubject;
    //        this.options.CurrentWorkflow.DraftWorkflow["@EmailTemplate_TaskOverdue"] = emailTemplate;

    //        this.checkIfWeHaveToDisplayThePublishChangesButton();
    //    } catch (e) {
    //        console.log('Exception in saveEmailTemplateForOverdueTasks(): ' + e.message + ', ' + e.stack);
    //    }
    //}, // 

    //expandTaskEmailEditorButtons: function () { // was named saveCollaborationTimeoutEmail 
    //    try {
    //        console.log('In expandTaskEmailEditorButtons().');
    //        var html = '';
    //        html += '<table>';
    //        var car = this.options.CurrentWorkflow;
    //        for (var i = 0; i < car.Workflow.Steps.Step.length; i++) {
    //            var stepName = car.Workflow.Steps.Step[i]["@Name"];
    //            var stepFriendlyName;
    //            if (car.Workflow.Steps.Step[i]["@FriendlyName"]) {
    //                stepFriendlyName = car.Workflow.Steps.Step[i]["@FriendlyName"];
    //                var buttonText = car.Workflow.Steps.Step[i]["@FriendlyName"];
    //            } else {
    //                var buttonText = stepName;
    //            }


    //            //var instructionText = '';
    //            //if (stepName == 'Create') {
    //            //    instructionText = 'This email gets sent to the creator of the request to acknowledge that it has been received.';
    //            //} else if (stepName == 'Revise') {
    //            //    instructionText = 'This email gets sent to the creator of the request when a request has been rejected or set to revise/hold, so that they can revise the request and re-submit.';
    //            //} else if (stepName == 'Admin') {
    //            //    instructionText = 'This email gets sent to the Workflow Administrator so that they can review and approve the request before it begins the rest of the workflow steps.';
    //            //} else if (stepName == 'xx') {

    //            //} else if (stepName == 'xx') {

    //            //} else {
    //            //    instructionText = 'This email gets sent to people who are involved in this stage of the workflow when this step begins.';
    //            //}

    //            var instructionText = car.Workflow.Steps.Step[i]["@EmailInstructionText"];


    //            //if (stepName != 'Create') {
    //            //    buttonText = 'Confirmation';
    //            //} else if (stepName == 'Done') {
    //            //    buttonText = 'Completed (Done)';
    //            //}

    //            html += '   <tr>';
    //            html += '       <td><hr /></td>';
    //            html += '   </tr>';

    //            if (document.getElementById('stepheaderrow_' + i)) {
    //                html += '   <tr style="height:' + document.getElementById('stepheaderrow_' + i).getBoundingClientRect().height + 'px;background-color:whitesmoke;">';
    //            } else {
    //                html += '   <tr style="background-color:whitesmoke;">';
    //            }

    //            html += '       <td class="stepheadercell" style="text-align:center;padding:0 25px 0 25px;" onmouseover="document.getElementById(\'stepheaderrow_' + i + '\').cells[0].style.backgroundColor=\'gainsboro\';" onmouseout="document.getElementById(\'stepheaderrow_' + i + '\').cells[0].style.backgroundColor=\'whitesmoke\';">';
    //            //html += '           <span class="spanButton" title="Edit email template(s)..." style="padding:5px 10px 5px 10px;margin:0 0 0 20px;white-space:nowrap;vertical-align:top;border:1px solid lightblue;cursor:pointer;font-weight:normal;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'editStepEmails\', \'' + stepName + '\');"><span style="font-size:15pt;display:inline-block;">✉</span> "' + buttonText + '" Email&nbsp;&nbsp;</span>';
    //            html += '           <span class="spanButton" title="Edit email template(s)..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'editStepEmails\', \'' + stepName + '\', \'' + stepFriendlyName + '\', \'' + instructionText + '\');"><span style="font-size:15pt;display:inline-block;">✉</span> "' + buttonText + '" &nbsp;&nbsp;</span><br /><div style="font-size:8pt;margin-top:10px;">' + instructionText + '</div>';
    //            html += '       </td>';
    //            html += '   </tr>';
    //            //}
    //        }
    //        html += '</table>';
    //        document.getElementById('taskEmailEditorButtons').innerHTML = html;
    //    } catch (e) {
    //        console.log('Exception in expandTaskEmailEditorButtons(): ' + e.message + ', ' + e.stack);
    //    }
    //},
    renderAllParticipantsInThePeoplePicker: function (friendlyNameSourceField, idSourceField, emailSourceField, buttonToEnable) {
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
                        html += '<a href="javascript:$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'cmdReturnParticipantIdToField\', \'' + friendlyNameSourceField + '\', \'' + idSourceField + '\', \'' + emailSourceField + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantEmail + '\', \'' + buttonToEnable + '\');">' + data[i].bwParticipantFriendlyName + '&nbsp;&nbsp;<i>(' + data[i].bwParticipantEmail + ')</i></a>';
                        html += '<br />';
                    }
                    $('#spanPeoplePickerParticipantsList').append(html);
                },
                error: function (data, errorCode, errorMessage) {
                    this.displayAlertDialog('Error in my.js.renderAllParticipantsInThePeoplePicker():' + errorCode + ', ' + errorMessage);
                }
            });
        } catch (e) {
            console.log('Exception in renderAllParticipantsInThePeoplePicker(): ' + e.message + ', ' + e.stack);
        }
    },
    cmdReturnParticipantIdToField: function (friendlyNameSourceField, idSourceField, emailSourceField, selectedParticipantFriendlyName, selectedParticipantId, selectedParticipantEmail, buttonToEnable) {
        try {
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

    renderSelectRoleOrPersonSection: function (elementId) {
        try {
            console.log('In bwWorkflowEditor.js.renderSelectRoleOrPersonSection().');
            //alert('In bwWorkflowEditor.js.renderSelectRoleOrPersonSection().');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            var activeStateIdentifier = $('.bwAuthentication').bwAuthentication('getActiveStateIdentifier');

            var isAdmin = false;
            if (elementId.indexOf('steprow-admin_') > -1) {
                // This is the ADMIN section. Limit what can be done here, just want to be able to change the assigned user.
                isAdmin = true;
            }

            var selectRoleOrPersonCell = $('.selectroleorperson-editcell');
            var stepIndex = elementId.split('_')[1]; // eg: 3
            var roleIndex = elementId.split('_')[2]; // eg: 8
            if (isAdmin) {
                // This is the ADMIN section. Limit what can be done here, just want to be able to change the assigned user.
                var html = '';
                //var rolename = $('#' + elementId).find('.rolename').attr('bwOldValue');
                var roleId = 'ADMIN'; //$('#' + elementId).find('.rolename').attr('bwRoleId');
                //html += '<select style="padding:5px 5px 5px 5px;" id="selectRoleName"  onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'RoleDropDown_Onchange\', \'' + 'selectRoleName' + '\');">';
                //html += '  <option value=""></option>';
                //for (var i = 0; i < roles.length; i++) {
                //    if (rolename == roles[i].RoleName) {
                //        html += '  <option value="' + roles[i].RoleId + '" selected >' + roles[i].RoleName + '</option>';
                //    } else {
                //        html += '  <option value="' + roles[i].RoleId + '">' + roles[i].RoleName + '</option>';
                //    }
                //}
                //html += '</select>';

                //alert('xcx6694923-1');


                var allowRequestModifications = $('#' + elementId).find('.rolename').attr('bwallowrequestmodifications');
                if (!allowRequestModifications || allowRequestModifications == 'undefined') {
                    allowRequestModifications = false; // default to false. This is the safe way to introduce this attribute ot the workflows.
                }
                if (allowRequestModifications == 'true') {
                    // It is checked.
                    html += '<input type="checkbox" checked id="cbAllowRequestModifications_' + stepIndex + '_' + roleIndex + '">&nbsp;Allow modification of the request';
                } else {
                    // It is not checked.
                    html += '<input type="checkbox" id="cbAllowRequestModifications_' + stepIndex + '_' + roleIndex + '">&nbsp;Allow modification of the request';
                }
                html += '<br />';
                html += '<span style="font-style:italic;font-size:8pt;">Currently no auditing of modifications. Coming soon!</span>';





                // 2-11-2022 Instructions.
                var instructions = $('#' + elementId).find('.rolename').attr('bwinstructions');
                instructions = instructions.replace(/["]/g, '&quot;').replace(/[']/g, '&#39;');
                html += '<br />';
                html += '<br />';
                html += 'Instructions for the user. These appear on the request form next to the buttons:';
                html += '<br />';
                // The textarea box-sizing means that the width works as expected.
                html += '<textarea xcx="xcx2345289" id="textInstructions_' + stepIndex + '_' + roleIndex + '" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;width: 100%;">' + instructions + '</textarea>';
                html += '<br />';












                var orgId1 = 'ALL'; // using ALL until we build in the multiple locations support.
                $.ajax({
                    url: thiz.options.operationUriPrefix + "odata/UserRole/" + workflowAppId + "/" + orgId1 + "/" + roleId, // pass workflowAppId, as well as roleId in order to get the list of users who belong to the role.
                    dataType: "json",
                    contentType: "application/json",
                    type: "Get",
                    timeout: thiz.options.ajaxTimeout
                }).done(function (result) {
                    try {





                        //// Display the role members!!!<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                        //html += '<input style="padding:5px 5px 5px 5px;" id="txtRoleMembersFriendlyName_' + stepIndex + '_' + roleIndex + '" style="width:150px;color:grey;font-style:italic;" type="text" value=" [select role member(s)]" />';
                        //html += '<input id="txtRoleMembersId_' + stepIndex + '_' + roleIndex + '" style="display:none;" />';
                        //html += '<input id="txtRoleMembersEmail_' + stepIndex + '_' + roleIndex + '" style="display:none;" />';
                        //html += '&nbsp;<img style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayPeoplePickerDialog\', \'' + 'txtRoleMembersFriendlyName_' + stepIndex + '_' + roleIndex + '' + '\', \'' + 'txtRoleMembersId_' + stepIndex + '_' + roleIndex + '' + '\', \'' + 'txtRoleMembersEmail_' + stepIndex + '_' + roleIndex + '' + '\');" src="images/addressbook-icon18x18.png">';
                        //if (participantId) { // Only display when logged in. We need to do more work here!!
                        //    if (result.length > 0) {
                        //        var roleMembersHtml = '';
                        //        roleMembersHtml += '<br /><span style="color:darkgrey;">Role Member3(s):<ul>';
                        //        for (var i = 0; i < result.length; i++) {
                        //            roleMembersHtml += '<li title="' + result[i].bwParticipantEmail + '">' + result[i].bwParticipantFriendlyName;
                        //            roleMembersHtml += '<span style="cursor:pointer;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'DeleteRoleMember\', \'' + elementId + '\', \'' + result[i].bwParticipantId + '\');">&nbsp;&#128465;</span></li>';
                        //        }
                        //        roleMembersHtml += '</ul></span>';
                        //        html += roleMembersHtml;
                        //    }
                        //}













                        //html += '<br />or create a new role:'; //<br /><input id="textNewRoleName" type="text" style="width:210pt;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewRoleTextBox_Onkeyup\', \'' + 'textNewRoleName' + '\');" />';
                        //html += '<br /><input id="btnCreateRole2" type="button" value="Create a Role..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayCreateANewRoleDialog\');" />';

                        //html += '<br />or select a person:'; //<br /><input id="textNewRoleId" type="text" style="width:75pt;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewRoleTextBox_Onkeyup\', \'' + 'textNewRoleId' + '\');" />';
                        //html += '<br /><img style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayPeoplePickerDialog\', \'' + 'txtApprover2FriendlyName' + '\', \'' + 'txtApprover2Id' + '\', \'' + 'txtApprover2Email' + '\');" src="images/addressbook-icon18x18.png">';
                        //html == '&nbsp;&nbsp;';
                        //html += '<input id="btnCreateRole1" type="button" value="Select Person..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayPeoplePickerDialog\', \'' + 'txtApprover2FriendlyName' + '\', \'' + 'txtApprover2Id' + '\', \'' + 'txtApprover2Email' + '\');" />';

                        //html += '<br />or add a new person:'; //<br /><input id="textNewRoleId" type="text" style="width:75pt;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewRoleTextBox_Onkeyup\', \'' + 'textNewRoleId' + '\');" />';
                        //html += '<br /><input id="btnCreateRole1" type="button" value="Add a Person..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayAddANewPersonDialog\');" />';

                        //html += '</td > ';
                        //debugger;
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
            } else {

                //
                // Populate the "Roles" drop down.
                //
                var data = {
                    bwParticipantId_LoggedIn: participantId,
                    bwActiveStateIdentifier: activeStateIdentifier,
                    bwWorkflowAppId_LoggedIn: workflowAppId,

                    bwWorkflowAppId: workflowAppId
                };
                var operationUri = thiz.options.operationUriPrefix + '_bw/bwroles';
                $.ajax({
                    url: operationUri,
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    success: function (results) {
                        try {

                            if (results.status != 'SUCCESS') {

                                var msg = 'Error in bwWorkflowEditor.js.renderSelectRoleOrPersonSection(). ' + results.status + ', ' + results.message;
                                console.log(msg);
                                displayAlertDialog(msg);

                            } else {

                                //debugger;
                                // We need to get the workflowAppId, as well as roleId in order to get the list of users who belong to the role.
                                var roles;
                                if (results) {
                                    roles = results.data;
                                } else {
                                    console.log('In bwWorkflowEditor.js.renderSelectRoleOrPersonSection().Get[odata/Roles].done: results: ' + JSON.stringify(results));
                                    alert('Unexpected condition in bwWorkflowEditor.js.renderSelectRoleOrPersonSection(). xx1');
                                }
                                var html = '';
                                var rolename = $('#' + elementId).find('.rolename').attr('bwOldValue');
                                var roleId = $('#' + elementId).find('.rolename').attr('bwRoleId');
                                debugger; // 12-8-2021 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                                html += 'Role:&nbsp;<select test="xcx1001" style="padding:5px 5px 5px 5px;" id="selectRoleName"  onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'RoleDropDown_Onchange\', \'' + 'selectRoleName' + '\');">';
                                html += '  <option value=""></option>';
                                for (var i = 0; i < roles.length; i++) {
                                    if (rolename == roles[i].RoleName) {
                                        html += '  <option value="' + roles[i].RoleId + '" selected >' + roles[i].RoleName + '</option>';
                                    } else {
                                        html += '  <option value="' + roles[i].RoleId + '">' + roles[i].RoleName + '</option>';
                                    }
                                }
                                html += '</select>';

                                html += '<br />';


                                // FIX!!! 7-7-2020
                                html += '<br />';
                                html += '<br />';

                                var budgetThreshold = $('#' + elementId).find('.rolename').attr('bwbudgetthreshold'); // 'bwinstructions');

                                html += 'Only participate for amounts over:';
                                html += '<br />';
                                html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" id="textOnlyInvolveRoleForAmountsOver_' + stepIndex + '_' + roleIndex + '" value="$' + budgetThreshold + '" style="text-align:right;" />'; // modified 11-17-2022
                                html += '<br />';
                                html += '<br />';

                                var allowRequestModifications = $('#' + elementId).find('.rolename').attr('bwallowrequestmodifications');
                                if (!allowRequestModifications || allowRequestModifications == 'undefined') {
                                    allowRequestModifications = false; // default to false. This is the safe way to introduce this attribute ot the workflows.
                                }
                                //allowRequestModifications = Boolean(allowRequestModifications);
                                if (allowRequestModifications == 'true') {
                                    // It is checked.
                                    html += '<input type="checkbox" checked id="cbAllowRequestModifications_' + stepIndex + '_' + roleIndex + '">&nbsp;Allow modification of the request';
                                } else {
                                    // It is not checked.
                                    html += '<input type="checkbox" id="cbAllowRequestModifications_' + stepIndex + '_' + roleIndex + '">&nbsp;Allow modification of the request';
                                }


                                html += '<br />';
                                html += '<span style="font-style:italic;font-size:8pt;">Currently no auditing of modifications. Coming soon!</span>';

                                // 2-11-2022 Instructions.
                                var instructions = $('#' + elementId).find('.rolename').attr('bwinstructions');
                                if (instructions) {
                                    instructions = instructions.replace(/["]/g, '&quot;').replace(/[']/g, '&#39;');
                                }
                                html += '<br />';
                                html += '<br />';
                                html += 'Instructions for the user. These appear on the request form next to the buttons:';
                                html += '<br />';
                                // The textarea box-sizing means that the width works as expected.
                                if (instructions && (instructions != 'undefined')) {
                                    html += '<textarea id="textInstructions_' + stepIndex + '_' + roleIndex + '" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;width: 100%;">' + instructions + '</textarea>';
                                } else {
                                    html += '<textarea id="textInstructions_' + stepIndex + '_' + roleIndex + '" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;width: 100%;">' + '' + '</textarea>';
                                }
                                html += '<br />';


                                selectRoleOrPersonCell.html(html);

                            }

                        } catch (e) {
                            console.log('Exception in bwWorkflowEditor.js.renderSelectRoleOrPersonSection(): ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in bwWorkflowEditor.js.renderSelectRoleOrPersonSection(): ' + e.message + ', ' + e.stack);
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        console.log('Error in bwWorkflowEditor.js.renderSelectRoleOrPersonSection(): ' + errorMessage + ', ' + errorCode + ', ' + JSON.stringify(data));
                        displayAlertDialog('Error in bwWorkflowEditor.js.renderSelectRoleOrPersonSection(): ' + errorMessage + ', ' + errorCode + ', ' + JSON.stringify(data));
                    }
                });

            }

        } catch (e) {
            console.log('Exception in bwWorkflowEditor.js.renderSelectRoleOrPersonSection(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwWorkflowEditor.js.renderSelectRoleOrPersonSection(): ' + e.message + ', ' + e.stack);
        }
    },
    renderActionsSection: function (elementId) {
        try {
            console.log('In renderActionsSection().');
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

            if ((selectedRoleCategory != 'Inform') && (selectedRoleCategory != 'Collaborator') && (selectedRoleCategory != 'Approver')) {
                selectedRoleCategory = 'Inform'; // This makes it the default when it is not present.
            }

            if (selectedRoleCategory == 'Inform') {
                actionsCell.html(html);
            } else if (selectedRoleCategory == 'Collaborator') {


                // ?? >> This is an old comment, not sure.....  TO-DO: WHEN "Collaborator" has been selected, a timeout can be specified. Display this option!!!!!!!!!!!!!!!!!!!!!!<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<,,

                //
                // 4-20-2022 Adding a "Review Completed" button.
                var actions = ['Review Completed'];
                var x = elementId.split('_')[1];
                var step = x.split('_')[0];
                var row = elementId.split('_')[2];
                for (var i = 0; i < actions.length; i++) {
                    var checkboxId = 'Action-' + actions[i].replace(' ', '') + '_' + step + '_' + row; // 4-20-2022 getting rid of space in "Review Completed".
                    var childCheckboxId = 'RequireComments-' + actions[i].replace(' ', '') + '_' + step + '_' + row; // 4-20-2022 getting rid of space in "Review Completed".
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
                // end: 4-20-2022
                //
                actionsCell.html(html);

            } else if (selectedRoleCategory == 'Approver') {

                //debugger; // 10-14-2020


                // Display the Actions/Tasks pickers... TO-DO: REMEMBER TO COME BACK AND POPULATE existing values. eg: If the user toggles the drop down, these values get lost..... <<<<<<<<<<<<<<<<<<<<<<<<<<<<
                var actions = ['Approve', 'Cancel', 'Decline', 'Revise/Hold'];
                var x = elementId.split('_')[1];
                var step = x.split('_')[0];
                var row = elementId.split('_')[2];
                for (var i = 0; i < actions.length; i++) {
                    var checkboxId = 'Action-' + actions[i] + '_' + step + '_' + row;
                    var childCheckboxId = 'RequireComments-' + actions[i] + '_' + step + '_' + row;
                    html += '<span style="white-space:nowrap;">';
                    //if (actions[i] == 'Approve' || actions[i] == 'Revise/Hold') {
                    //if (actions[i] == 'Approve' || actions[i] == 'Revise/Hold') {
                    //    // This forces the "Approve" and "Revise/Hold" actions to always remain checked. We always need these checked!
                    //    html += '  <input type="checkbox" id="' + checkboxId + '" onclick="return false;" />&nbsp;' + actions[i];
                    //} else {
                    html += '  <input type="checkbox" id="' + checkboxId + '" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'toggleChildCheckbox\', \'' + checkboxId + '\', \'' + childCheckboxId + '\');" />&nbsp;' + actions[i];
                    //}
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
            displayAlertDialog('Exception in renderActionsSection(): ' + e.message + ', ' + e.stack);
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

    renderTheChecklistsReadOnly: function (checklistsJsonArray) {
        try {
            console.log('In renderTheChecklistsReadOnly().');
            //alert('In >>>>>>>>>>>>>>>>renderTheChecklistsReadOnly(). checklistsJsonArray: ' + JSON.stringify(checklistsJsonArray));

            var result = '';
            debugger;
            if (!checklistsJsonArray || (checklistsJsonArray.length == 0)) {
                // do nothing.
            } else {

                // This is where we parse the checklists and make it look the the editable one, but read only!!!!
                //strChecklists2 = unescape(strChecklists);
                var checklists = checklistsJsonArray; //JSON.parse(strChecklists2);

                var html = '';

                if (checklists && checklists.length && (checklists.length > 0)) {

                    html += '<span xcx="xcx213123-1" style="color:gray;font-style:italic;">Checklist(s):</span><br />';

                    // This loop displays the ones which are not in this.options.Checklists, but which remain in the workflow JSON. Orphaned ones.
                    for (var i = 0; i < checklists.length; i++) {
                        var isInChecklists = false;
                        for (var j = 0; j < this.options.Checklists.length; j++) {
                            if (checklists[i].bwChecklistTemplatesId == this.options.Checklists[j].bwChecklistTemplatesId) {
                                isInChecklists = true;
                                break;
                            }
                        }
                        if (isInChecklists != true) {
                            debugger;
                            console.log('>>>>>>>> xcx1231234 ????');
                            debugger;
                            // Show this checklist greyed-out because it doesn't exist in the checklists library for this organization. It is orphaned.
                            html += '<span xcx="xcx2234-1" style="white-space:nowrap;">';
                            html += '<input id="cbChecklistRequired_' + checklists[i].bwChecklistTemplatesId + '" type="checkbox" onclick="return false;" checked="" disabled />&nbsp;' + checklists[i].bwChecklistTemplatesId + '&nbsp;';
                            html += '<span style="font-style:italic;"></span>';
                            html += '</span>';
                            html += '<br />';

                        }
                    }

                    // This displays all the checklists in this.options.Checklists. Ones that are not orphaned.
                    var checklists2 = [];
                    if (this.options.Checklists) {
                        for (var i = 0; i < this.options.Checklists.length; i++) {
                            var checklist = {
                                bwChecklistTemplatesId: JSON.parse(this.options.Checklists[i].ChecklistJson).bwChecklistTemplatesId, Title: JSON.parse(this.options.Checklists[i].ChecklistJson).Title
                            };
                            checklists2.push(checklist);
                        }
                        checklists2.sort(function (a, b) {
                            if (a.Title < b.Title) {
                                return -1;
                            }
                            if (a.Title > b.Title) {
                                return 1;
                            }
                            return 0;
                        });

                        for (var i = 0; i < checklists2.length; i++) {
                            var isInChecklists = false;
                            for (var j = 0; j < checklists.length; j++) {
                                if (checklists2[i].bwChecklistTemplatesId == checklists[j].bwChecklistTemplatesId) {
                                    isInChecklists = true;
                                }
                            }
                            if (isInChecklists == true) {
                                console.log('xcx1231243 >>>>>>>>>> rndering checkbox');
                                html += '<span xcx="xcx2234-3" style="white-space:nowrap;">';
                                html += '<input id="cbChecklistRequired_' + checklists2[i].bwChecklistTemplatesId + '" type="checkbox" onclick="return false;" checked="" />&nbsp;' + checklists2[i].Title + ' [' + checklists2[i].bwChecklistTemplatesId + ']&nbsp;';
                                html += '<span style="font-style:italic;"></span>';
                                html += '</span>';
                                html += '<br />';

                            }
                        }
                    }

                }

                result += html;
            }
            return result;

            //html += '<span style="color:gray;font-style:italic;">This role is a subject matter expert in these areasx:</span><br />';



            //var html2 = '';
            //// Is Exec
            //if (conditionString) {
            //    // We have to parse out "isExec" here.
            //    var isExec = conditionString.split('$IsExec=')[1];

            //    console.log('isExec: ' + isExec);

            //    if (isExec && isExec.indexOf('&') > -1) {
            //        isExec = isExec.split('&')[0];
            //    }
            //}
            //if (isExec && isExec == 'True') {
            //    html2 += '<span style="white-space:nowrap;"><input id="cbIsExec" type="checkbox" checked onclick="return false;" />&nbsp;' + 'Exec' + '&nbsp;</span>';
            //} else {
            //    //html += '<span style="white-space:nowrap;"><input id="cbIsExec" type="checkbox" onclick="return false;" />&nbsp;' + 'Exec' + '&nbsp;</span>';
            //}
            ////html += '&nbsp;';

            //// Is Legal
            //if (conditionString) {
            //    // We have to parse out "IsLegal" here.
            //    var isLegal = conditionString.split('$IsLegal=')[1];
            //    if (isLegal && isLegal.indexOf('&') > -1) {
            //        isLegal = isLegal.split('&')[0];
            //    }
            //}
            //if (isLegal && isLegal == 'True') {
            //    html2 += '<span style="white-space:nowrap;"><input id="cbIsLegal" type="checkbox" checked onclick="return false;" />&nbsp;' + 'Legal' + '&nbsp;</span>';
            //} else {
            //    //html += '<span style="white-space:nowrap;"><input id="cbIsLegal" type="checkbox" onclick="return false;" />&nbsp;' + 'Legal' + '&nbsp;</span>';
            //}
            ////html += '&nbsp;';

            //// Is Lease
            //if (conditionString) {
            //    // We have to parse out "isLease" here.
            //    var isLease = conditionString.split('$IsLease=')[1];
            //    if (isLease && isLease.indexOf('&') > -1) {
            //        isLease = isLease.split('&')[0];
            //    }
            //}
            //if (isLease && isLease == 'True') {
            //    html2 += '<span style="white-space:nowrap;"><input id="cbIsLease" type="checkbox" checked onclick="return false;" />&nbsp;' + 'Lease' + '&nbsp;</span>';
            //} else {
            //    //html += '<span style="white-space:nowrap;"><input id="cbIsLease" type="checkbox" onclick="return false;" />&nbsp;' + 'Lease' + '&nbsp;</span>';
            //}
            ////html += '&nbsp;';

            //if (html2 != '') {
            //    html += '<span style="color:gray;font-style:italic;">This role is a subject matter expert in these areasx:</span><br />';
            //    html += html2;
            //    html += '<hr>';
            //}


            //html += '<span style="color:gray;font-style:italic;">This role contributes to these parts of the company:</span>';

            ////// Render the "Cond".
            ////html += '  <span id="spanConditionEditorContents" style="visibility:hidden;display:none;">';
            ////if (conditionString) html += conditionString;
            ////html += '  </span>';

            //html += '<br />';

            //html += 'Locations:';
            //html += '<ul>';
            //html += '  <li>All locations</li>';
            //html += '</ul>';
            //html += 'Functional areas:';
            //html += '<ul>';
            //html += '  <li>All functional areas</li>';
            //html += '</ul>';
            //html += 'Growth:';
            //html += '<ul>';
            //html += '  <li>All growth areas (pillars)</li>';
            //html += '</ul>';



        } catch (e) {
            var msg = 'Exception in renderTheChecklistsReadOnly(): ' + e.message + ', ' + e.stack;
            console.log('Exception in renderTheChecklistsReadOnly(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderTheChecklistsReadOnly(): ' + e.message + ', ' + e.stack);
            return msg;
        }
    },
    renderConditionsSection: function (elementId, conditionString, strChecklists) {
        try {
            console.log('In renderConditionsSection().');
            console.log('In renderConditionsSection(). strChecklists: ' + strChecklists);

            var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');

            var selectedRoleCategory;
            $('#selectRoleCategory').find('option:selected').each(function (index, element) {
                selectedRoleCategory = element.value;
            });
            var conditionCell = $('.conditions-editcell');
            if (elementId == 'undefined') {
                elementId = conditionCell.attr('id');
            }

            var html = '';


            if (developerModeEnabled == true) {
                html += '<table>';
                html += '<tr>';
                html += '<td colspan="2">';
                html += 'This role will be involved in these Project Types and Pillars:';
                html += '</td>';
                html += '</tr>';
                html += '<tr>';
                html += '<td style="vertical-align:top;">';
                html += '<div id="divBwProjectTypeCheckboxGroup"></div>';
                html += '</td>';
                html += '<td style="vertical-align:top;">';
                html += '<div id="divBwPillarTypeCheckboxGroup"></div>';
                html += '</td>';
                html += '</tr>';
                html += '</table>';

                html += '<hr>';

            }

            // THE @COND IS CHANGING!!!!!!!!!!!!!!!! (to accomodate "Project Types" and "Pillar Types".
            // OLD:
            //     $IsLease=True$IsLegal=True$IsExec=True&$ChecklistsRequired~f830e44a-d29f-4261-80c6-756236355e96,cebeba6a-e89b-48c8-a8c7-52083fd429a9
            // NEW:
            //     $ProjectTypes~xxx-xx-xx-xx,xx-xx-xx-xx&$PillarTypes~xx-xxxxx-xx-xxxx-xx-xx,xx-xxxx-xx-xxxx-xx&$ChecklistsRequired~f830e44a-d29f-4261-80c6-756236355e96,cebeba6a-e89b-48c8-a8c7-52083fd429a9






            // THIS IS HOW WE PARSE THE COND
            //// Is Exec
            //if (conditionString) {
            //    // We have to parse out "isExec" here.
            //    var isExec = conditionString.split('$IsExec=')[1];
            //    console.log('isExec: ' + isExec);
            //    if (isExec && isExec.indexOf('&') > -1) {
            //        isExec = isExec.split('&')[0];
            //    }
            //}
            //if (isExec && isExec == 'True') {
            //    html += '<span style="white-space:nowrap;"><input id="cbIsExec" type="checkbox" checked onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isExecCondition_CheckChanged\');" />&nbsp;' + 'Exec' + '&nbsp;</span>';
            //} else {
            //    html += '<span style="white-space:nowrap;"><input id="cbIsExec" type="checkbox" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isExecCondition_CheckChanged\');" />&nbsp;' + 'Exec' + '&nbsp;</span>';
            //}










            //// Display this section
            //if (selectedRoleCategory == 'Inform') {
            //    html += '<span style="color:gray;font-style:italic;">This role will be informed about these areas:</span><br />';
            //} else {
            //    html += '<span style="color:gray;font-style:italic;">This role is a subject matter expert in these areas:</span><br />';
            //}

            //// Is Exec
            //if (conditionString) {
            //    // We have to parse out "isExec" here.
            //    var isExec = conditionString.split('$IsExec=')[1];
            //    console.log('isExec: ' + isExec);
            //    if (isExec && isExec.indexOf('&') > -1) {
            //        isExec = isExec.split('&')[0];
            //    }
            //}
            //if (isExec && isExec == 'True') {
            //    html += '<span style="white-space:nowrap;"><input id="cbIsExec" type="checkbox" checked onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isExecCondition_CheckChanged\');" />&nbsp;' + 'Exec' + '&nbsp;</span>';
            //} else {
            //    html += '<span style="white-space:nowrap;"><input id="cbIsExec" type="checkbox" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isExecCondition_CheckChanged\');" />&nbsp;' + 'Exec' + '&nbsp;</span>';
            //}
            //html += '&nbsp;';
            //// Is Legal
            //if (conditionString) {
            //    // We have to parse out "IsLegal" here.
            //    var isLegal = conditionString.split('$IsLegal=')[1];
            //    if (isLegal && isLegal.indexOf('&') > -1) {
            //        isLegal = isLegal.split('&')[0];
            //    }
            //}
            //if (isLegal && isLegal == 'True') {
            //    html += '<span style="white-space:nowrap;"><input id="cbIsLegal" type="checkbox" checked onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isLegalCondition_CheckChanged\');" />&nbsp;' + 'Legal' + '&nbsp;</span>';
            //} else {
            //    html += '<span style="white-space:nowrap;"><input id="cbIsLegal" type="checkbox" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isLegalCondition_CheckChanged\');" />&nbsp;' + 'Legal' + '&nbsp;</span>';
            //}
            //html += '&nbsp;';
            //// Is Lease
            //if (conditionString) {
            //    // We have to parse out "isLease" here.
            //    var isLease = conditionString.split('$IsLease=')[1];
            //    if (isLease && isLease.indexOf('&') > -1) {
            //        isLease = isLease.split('&')[0];
            //    }
            //}
            //if (isLease && isLease == 'True') {
            //    html += '<span style="white-space:nowrap;"><input id="cbIsLease" type="checkbox" checked onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isLeaseCondition_CheckChanged\');" />&nbsp;' + 'Lease' + '&nbsp;</span>';
            //} else {
            //    html += '<span style="white-space:nowrap;"><input id="cbIsLease" type="checkbox" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isLeaseCondition_CheckChanged\');" />&nbsp;' + 'Lease' + '&nbsp;</span>';
            //}
            //html += '&nbsp;';
            //// Is IT
            //html += '&nbsp;';
            //html += '<span style="white-space:nowrap;"><input type="checkbox" disabled />&nbsp;' + 'IT' + '&nbsp;<span style="font-style:italic;"></span></span>';
            //// Is H&S 
            //html += '&nbsp;';
            //html += '<span style="white-space:nowrap;"><input type="checkbox" disabled />&nbsp;' + 'H&S' + '&nbsp;<span style="font-style:italic;"></span></span>';
            //// Is Compliance
            //html += '&nbsp;';
            //html += '<span style="white-space:nowrap;"><input type="checkbox" disabled />&nbsp;' + 'Compliance' + '&nbsp;<span style="font-style:italic;"></span></span>';
            //// Is Audit
            //html += '&nbsp;';
            //html += '<span style="white-space:nowrap;"><input type="checkbox" disabled />&nbsp;' + 'Audit' + '&nbsp;<span style="font-style:italic;"></span></span>';

            //html += '<hr>';



            //html += '<span style="color:gray;font-style:italic;">This role contributes to these parts of the company:</span><br />';

            //// Render the "Cond".
            html += '  <span id="spanConditionEditorContents" style="visibility:hidden;display:none;">';
            console.log('xcx2131234 setting spanConditionEditorContents strChecklists: ' + strChecklists);
            if (strChecklists) {
                html += strChecklists.trim();
            }
            html += '  </span>';

            //html += '<span style="cursor:pointer;color:red;text-decoration:underline;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayOrgMultiPicker\', \'' + this.id + '\');">Location(s)</span>';
            //html += '&nbsp;&nbsp;&nbsp;&nbsp;';
            //html += '<span style="cursor:pointer;color:red;text-decoration:underline;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayProjectTypeMultiPicker\', \'' + this.id + '\');">Functional area(s)</span>';
            //html += '&nbsp;&nbsp;&nbsp;&nbsp;';
            //html += '<span style="cursor:pointer;color:red;text-decoration:underline;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayPillarMultiPicker\', \'' + this.id + '\');">Growth</span>';

            // Display the checklists.
            if (selectedRoleCategory == 'Approver' || selectedRoleCategory == 'Collaborator') {
                //html += '<hr>';
                html += '<span xcx="xcx213123-2" style="color:gray;font-style:italic;">Checklist(s):</span><br />';
                //debugger;
                if (this.options.Checklists) {
                    // Todd: This is a bit messy and the result of maybe not getting from the database in the best way. Good for now but could maybe improved someday... think through thoroughly first!
                    var checklists = [];
                    for (var i = 0; i < this.options.Checklists.length; i++) {
                        var checklist = {
                            bwChecklistTemplatesId: JSON.parse(this.options.Checklists[i].ChecklistJson).bwChecklistTemplatesId, Title: JSON.parse(this.options.Checklists[i].ChecklistJson).Title
                        };
                        checklists.push(checklist);
                    }
                    checklists.sort(function (a, b) {
                        if (a.Title < b.Title) {
                            return -1;
                        }
                        if (a.Title > b.Title) {
                            return 1;
                        }
                        return 0;
                    });
                    for (var i = 0; i < checklists.length; i++) {
                        html += '<span style="white-space:nowrap;">';

                        if (strChecklists) {
                            var checklistCheckboxId = 'cbChecklistRequired_' + elementId + '_' + checklists[i].bwChecklistTemplatesId;

                            // Set the checkbox. 1-18-2023
                            var tmpChecklists = unescape(strChecklists);
                            var checklistsJson = JSON.parse(tmpChecklists);
                            var renderedTheChecklist = false;
                            for (var j = 0; j < checklistsJson.length; j++) {
                                if (checklists[i].bwChecklistTemplatesId == checklistsJson[j].bwChecklistTemplatesId) {
                                    html += '<input id="' + checklistCheckboxId + '" checked="" type="checkbox" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isChecklistRequired_CheckChanged\', \'' + checklists[i].bwChecklistTemplatesId + '\', \'' + checklistCheckboxId + '\');" />';
                                    //html += '<input id="cbChecklistRequired_' + checklists[i].bwChecklistTemplatesId + '" type="checkbox" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isChecklistRequired_CheckChanged\', this);" />';
                                    html += '&nbsp;' + checklists[i].Title + '&nbsp;';
                                    renderedTheChecklist = true;
                                }
                            }
                            if (renderedTheChecklist != true) {
                                html += '<input id="' + checklistCheckboxId + '" type="checkbox" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isChecklistRequired_CheckChanged\', \'' + checklists[i].bwChecklistTemplatesId + '\', \'' + checklistCheckboxId + '\');" />';
                                //html += '<input id="cbChecklistRequired_' + checklists[i].bwChecklistTemplatesId + '" type="checkbox" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isChecklistRequired_CheckChanged\', this);" />';
                                html += '&nbsp;' + checklists[i].Title + '&nbsp;';
                            }

                        } else {
                            html += '<input id="' + checklistCheckboxId + '" type="checkbox" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isChecklistRequired_CheckChanged\', \'' + checklists[i].bwChecklistTemplatesId + '\', \'' + checklistCheckboxId + '\');" />';
                            //html += '<input id="cbChecklistRequired_' + checklists[i].bwChecklistTemplatesId + '" type="checkbox" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isChecklistRequired_CheckChanged\', this);" />';
                            html += '&nbsp;' + checklists[i].Title + '&nbsp;';
                        }
                        //html += '<input style="padding:5px 10px 5px 10px;" type="button" value="Edit Checklist" onclick="populateStartPageItem(\'divChecklistsSettings\', \'Reports\', \'' + i + '\');" />';

                        //html += '<input style="padding:5px 10px 5px 10px;" type="button" value="Edit Checklist" onclick="$(\'.bwChecklistsEditor\').bwChecklistsEditor(\'editChecklist\', \'' + i + '\');" />';
                        //html += '<span style="cursor:pointer;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'DeleteChecklist\', \'' + elementId + '\', \'' + checklists[i].bwChecklistTemplatesId + '\');">&nbsp;&#128465;</span>';

                        html += '</span>';
                        html += '<br />';
                    }
                } else {
                    html += '[no checklists found]';
                }
            }
            //debugger;
            conditionCell.html(html);


            // Display the "Project Type Checkboxes" in the workflow editor.
            var bwProjectTypeCheckboxGroupOptions = {
                ConditionString: conditionString
            };
            $('#divBwProjectTypeCheckboxGroup').bwProjectTypeCheckboxGroup(bwProjectTypeCheckboxGroupOptions);

            // Display the "Pillar Type Checkboxes" in the workflow editor.
            var bwPillarTypeCheckboxGroupOptions = {
                ConditionString: conditionString
            };
            $('#divBwPillarTypeCheckboxGroup').bwPillarTypeCheckboxGroup(bwPillarTypeCheckboxGroupOptions);


            //debugger;
            //// Bind the chckbox onclick events!!!
            //if (conditionString) {
            //    for (var i = 0; i < checklists.length; i++) {
            //        var checklistCheckboxId = 'cbChecklistRequired_' + elementId + '_' + checklists[i].bwChecklistTemplatesId;
            //        $('#checklistCheckboxId').bind('click', function () {
            //            alert('click');
            //        });
            //    }
            //}




        } catch (e) {
            console.log('Exception in renderConditionsSection(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderConditionsSection(): ' + e.message + ', ' + e.stack);
        }
    },
    DeleteChecklist: function (elementId, bwChecklistTemplatesId) {
        try {
            console.log('In DeleteChecklist(). elementId: ' + elementId + ', bwChecklistTemplatesId: ' + bwChecklistTemplatesId);
            alert('In DeleteChecklist(). Refactoring checklists.');
            var stepIndex = elementId.split('_')[1]; // eg: 3
            var roleIndex = elementId.split('_')[2]; // eg: 8

            //var cond = this.options.store.DraftWorkflow.Steps.Step[stepIndex].Assign[roleIndex]["@Cond"];
            //spanConditionEditorContents
            alert('xcx1234324-2 getting the cond');
            var cond = document.getElementById('spanConditionEditorContents').innerHTML;
            // $ChecklistsRequired~becef88f-f43c-4e82-9ff8-0fd4d16b9555,f830e44a-d29f-4261-80c6-756236355e96,f2ac3575-ca0b-4a85-9708-c1cb6eb4929d,f2ac3575-ca0b-4a85-9708-c1cb6eb4929d,becef88f-f43c-4e82-9ff8-0fd4d16b9555,f830e44a-d29f-4261-80c6-756236355e96

            String.prototype.replaceAll = function (search, replacement) {
                var target = this;
                return target.replace(new RegExp(search, 'g'), replacement);
            };

            //if (cond) {
            //    cond = cond.replaceAll('&amp;', '&'); // Not sure why but the encoding gets messed somewhere along the way.
            //}

            alert('In DeleteChecklist(). xcx123423 cond: ' + cond);

            if (confirm("Are you certain you wish delete ALL CHECKLISTS??? (this checklist?)")) {
                //debugger;
                var newCond = '';
                //var prefix = cond.split('$ChecklistsRequired~')[0];
                //if (prefix.substring(prefix.length - 1) == '&') prefix = prefix.substring(0, prefix.length - 1); // Remove the trailing '&' (ampersand).
                //var suffix = cond.split('$ChecklistsRequired~')[1].split('&')[1];
                //if (suffix) {
                //    newCond = prefix + suffix;
                //} else {
                //    newCond = prefix;
                //}
                ////this.options.store.DraftWorkflow.Steps.Step[stepIndex].Assign[roleIndex]["@Cond"] = result;
                //debugger;
                alert('xcx3432432 setting spanConditionEditorContents');
                document.getElementById('spanConditionEditorContents').innerHTML = result;
                alert('xcx21434235-3 calling renderConditionsSection');
                this.renderConditionsSection(elementId, newCond, strChecklists);
            }

        } catch (e) {
            console.log('Exception in DeleteChecklist(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in DeleteChecklist(): ' + e.message + ', ' + e.stack);
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
            console.log('In RoleCategoryDropDown_Onchange(). elementId: ' + elementId + '.');

            this.renderActionsSection(elementId);
            //this.renderTimeoutSection(elementId);
            console.log('xcx21434235-4 calling renderConditionsSection');
            this.renderConditionsSection(elementId, null, null);

        } catch (e) {
            console.log('Exception in RoleCategoryDropDown_Onchange(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in RoleCategoryDropDown_Onchange(): ' + e.message + ', ' + e.stack);
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


    WorkflowsDropDown_Onchange: function () {
        try {
            // This enables the "Activate" button when the ">>>Active<<<" workflow is not selected.
            var selected;
            $('#workflowsDropDown').find('option:selected').each(function (index, element) {
                selected = element.innerHTML;
            });
            console.log('In WorkflowsDropDown_Onchange(). selected: ' + selected);
            if (selected.indexOf('ACTIVE') > -1) {
                document.getElementById('btnActivateRaciConfiguration').disabled = true;
            } else {
                document.getElementById('btnActivateRaciConfiguration').disabled = false;
            }
        } catch (e) {
            console.log('Exception in WorkflowsDropDown_Onchange(): ' + e.message + ', ' + e.stack);
        }
    },
    WorkflowRequestTypeDropDown_Onchange: function (elementId) {
        try {
            console.log('In WorkflowRequestTypeDropDown_Onchange().');

            this.options.CurrentWorkflow = null; // We are going to get a new one below...

            this.renderWorkflowEditor2(); // Render the Workflow Editor. 

        } catch (e) {
            console.log('Exception in WorkflowRequestTypeDropDown_Onchange(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in WorkflowRequestTypeDropDown_Onchange(): ' + e.message + ', ' + e.stack);
        }
    },


    WorkflowRequestTypeDropDownInDialog_Onchange: function (elementId) {
        try {
            console.log('In WorkflowRequestTypeDropDownInDialog_Onchange().');

            this.displayWorkflowsConfigurationDialog();

        } catch (e) {
            console.log('Exception in WorkflowRequestTypeDropDownInDialog_Onchange(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in WorkflowRequestTypeDropDownInDialog_Onchange(): ' + e.message + ', ' + e.stack);
        }
    },



    WorkflowForAllRequestTypesCheckbox_Onchange: function () {
        try {
            console.log('In WorkflowForAllRequestTypesCheckbox_Onchange().');
            var thiz = this;
            var checked = document.getElementById('WorkflowForAllRequestTypesCheckbox').checked;
            if (checked == true) {
                document.getElementById('WorkflowForAllRequestTypesCheckbox').checked = false; // This just forces it to not be checked for the time being.
                alert('This functionality will create a single workflow for all of the request types. This should never happen. This functionality is incomplete.');
            } else {
                document.getElementById('WorkflowForAllRequestTypesCheckbox').checked = true; // This just forces it to not be checked for the time being.
                //alert('This functionality will create a workflow for each budget request type. This functionality is incomplete. Coming soon!');

                var json = {
                    //bwRoleId: bwRoleId,
                    bwTenantId: this.options.bwTenantId,
                    bwWorkflowAppId: this.options.bwWorkflowAppId
                    //RoleId: roleId,
                    //RoleName: roleName,
                    //ModifiedById: participantId,
                    //ModifiedByFriendlyName: participantFriendlyName,
                    //ModifiedByEmail: participantEmail
                };
                $.ajax({
                    url: this.options.operationUriPrefix + "_bw/copyactiveworkflowtoallotherrequesttypes", // deletebwrole1",
                    dataType: "json",
                    contentType: "application/json",
                    type: "Post",
                    data: JSON.stringify(json)
                }).done(function (result) {
                    try {
                        //$("#divDeleteRoleDialog").dialog('close');
                        //if (result.message == 'SUCCESS') {

                        thiz.displayAlertDialog(result.message);
                        // copyactiveworkflowtoallotherrequesttypes


                        // Step 1: Check that there is only Active workflow. If there is more than 1, we cannot proceed.

                        // Step 2: 



                        //var bwWorkflowSchema = new mongoose.Schema({
                        //    bwWorkflowId: { type: String, index: { unique: true } },
                        //    bwTenantId: String,
                        //    bwWorkflowAppId: String,
                        //    Created: String,
                        //    CreatedBy: String,
                        //    CreatedById: String,
                        //    CreatedByEmail: String,
                        //    Modified: String,
                        //    ModifiedByFriendlyName: String,
                        //    ModifiedById: String,
                        //    ModifiedByEmail: String,

                        //    bwRequestType: String, // Added 3-18-2020 to support a workflow for each request type. 'ALL' or empty if there is just one workflow for all request types.

                        //    Description: String,
                        //    bwWorkflowJson: String,
                        //    bwWorkflowActive: Boolean, // In the code we need to make sure only 1 of these is marked as active.

                        //    // Are these two even used? In any case, using this schema to store out workflow JSON.
                        //    bwWorkflowInstanceId: String,
                        //    bwRelatedItemId: String,
                        //    bwWorkflowParams: String, // ProjectManager (display name), ManagerId, ProjectTitle, AppWebUrl, Quote, FunctionalAreaId

                        //    bwWorkflowPlaceholder1: String,
                        //    bwWorkflowPlaceholder2: String,
                        //    bwWorkflowPlaceholder3: String,
                        //    bwWorkflowPlaceholder4: String,
                        //    bwWorkflowPlaceholder5: String,
                        //    bwWorkflowPlaceholder6: String,
                        //    bwWorkflowPlaceholder7: String,
                        //    bwWorkflowPlaceholder8: String,
                        //    bwWorkflowPlaceholder9: String,
                        //    bwWorkflowPlaceholder10: String
                        //});
                        //var BwWorkflow = mongoose.model('BwWorkflow', bwWorkflowSchema);


                    } catch (e) {
                        console.log('Exception in bwCoreComponent.deleteBwRole(): ' + e.message + ', ' + e.stack);
                    }
                }).fail(function (data) {
                    var msg;
                    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                    } else {
                        msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
                    }
                    thiz.displayAlertDialog('Fail in bwCoreComponent.deleteBwRole(): ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                    console.log('Fail in bwCoreComponent.deleteBwRole(): ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
                    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                    //var error = JSON.parse(data.responseText)["odata.error"];
                    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                });
            }
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
                document.getElementById('btnSaveWorkflowConfigurationAndActivate').disabled = false;
            } else {
                document.getElementById('btnSaveWorkflowConfigurationAndActivate').disabled = true;
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
        window.onscroll = function () {
            window.scrollTo(x, y);
        };
    },
    enableScrolling: function () {
        window.onscroll = function () {
        };
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
            alert('xcx1234324-3 getting the cond');
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
            alert('xcx213234 setting spanConditionEditorContents');
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
            alert('xcx1234324-4 getting the cond');
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
            alert('xcx1234234 setting spanConditionEditorContents');
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
    isChecklistRequired_CheckChanged: function (bwChecklistTemplatesId, checklistCheckboxId) {
        try {
            console.log('In isChecklistRequired_CheckChanged(). bwChecklistTemplatesId: ' + bwChecklistTemplatesId + ', checklistCheckboxId: ' + checklistCheckboxId);
            console.log('In isChecklistRequired_CheckChanged(). Refactoring checklists.');
            console.log('xcx1234324-5 getting the cond');

            var checklists = [];
            var strChecklists = document.getElementById('spanConditionEditorContents').innerHTML.trim();
            if (strChecklists) {
                strChecklists = unescape(document.getElementById('spanConditionEditorContents').innerHTML).trim();
                checklists = JSON.parse(strChecklists);
            }

            if (document.getElementById(checklistCheckboxId).checked == true) {

                // The checkbox has been selected.
                var checklistIsInTheList = false;
                for (var i = 0; i < checklists.length; i++) {
                    if (bwChecklistTemplatesId == checklists[i].bwChecklistTemplatesId) {
                        checklistIsInTheList = true;
                        break;
                    }
                }
                if (checklistIsInTheList != true) {
                    var json = {
                        bwChecklistTemplatesId: bwChecklistTemplatesId
                    }
                    checklists.push(json);
                }

            } else {

                // The checkbox is not selected, so make sure the json does not have this checklist entry.
                for (var i = 0; i < checklists.length; i++) {
                    if (bwChecklistTemplatesId == checklists[i].bwChecklistTemplatesId) {
                        checklists.splice(i, 1);
                    }
                }

            }

            strChecklists = '';
            if (checklists.length > 0) {
                strChecklists = escape(JSON.stringify(checklists));
            }
            document.getElementById('spanConditionEditorContents').innerHTML = strChecklists;

            console.log('xcx1243253 setting spanConditionEditorContents strChecklists: ' + strChecklists);


            //
            // OLD CODE KEEP IT UNTIL we get the old con all replaced.
            //

            //var oldConditionString = document.getElementById('spanConditionEditorContents').innerHTML.trim().replace(/&amp;/g, '&'); // Changes &amp; to &. DecodeURI doesn't work! weird!
            //var newConditionString = '';
            //var oldConditionsArray = oldConditionString.split('&');
            //var x = [];
            //for (var i = 0; i < oldConditionsArray.length; i++) {
            //    if (oldConditionsArray[i].indexOf('$ChecklistsRequired~') > -1) {
            //        // do nothing.
            //    } else {
            //        x.push(oldConditionsArray[i]);
            //    }
            //}
            //// reassemble
            //for (var i = 0; i < x.length; i++) {
            //    //debugger;
            //    newConditionString += x[i];
            //    if ((i + 1) != x.length) {
            //        //debugger;
            //        newConditionString += '&'; // MAKE SURE WE HAVE THE AMPERSAND!!!!!!!!!!!!!!!!!!!
            //    }
            //}
            //if (document.getElementById(checklistCheckboxId).checked == true) {
            //    // The checkbox has been selected.
            //    if (oldConditionString.indexOf('$ChecklistsRequired~') > -1) {
            //        // We already have the entry, so add the checklist guid.
            //        var oldChecklistsRequiredArray = oldConditionString.split('$ChecklistsRequired~')[1].split('&')[0].split(',');
            //        var newChecklistsRequiredArray = [];
            //        newChecklistsRequiredArray.push(bwChecklistTemplatesId);
            //        for (var i = 0; i < oldChecklistsRequiredArray.length; i++) {
            //            if (!newChecklistsRequiredArray.includes(oldChecklistsRequiredArray[i])) newChecklistsRequiredArray.push(oldChecklistsRequiredArray[i]);
            //        }
            //        if (newConditionString.length > 0) {
            //            newConditionString += '&' + '$ChecklistsRequired~' + newChecklistsRequiredArray.toString();
            //        } else {
            //            newConditionString += '$ChecklistsRequired~' + newChecklistsRequiredArray.toString();
            //        }
            //    } else {
            //        // We don't have the entry, so we have to add it.
            //        if (newConditionString.length > 0) {
            //            newConditionString += '&' + '$ChecklistsRequired~' + bwChecklistTemplatesId;
            //        } else {
            //            newConditionString += '$ChecklistsRequired~' + bwChecklistTemplatesId;
            //        }
            //    }
            //} else {
            //    // The checkbox is not selected, so make sure the condition string does not have this checklist entry.
            //    if (oldConditionString.indexOf(bwChecklistTemplatesId) > -1) {
            //        var checklistArray = (oldConditionString.split('$ChecklistsRequired~')[1].split('&')[0]).split(',');
            //        var newChecklistArray = [];
            //        for (var x = 0; x < checklistArray.length; x++) {
            //            if (checklistArray[x] != bwChecklistTemplatesId) {
            //                newChecklistArray.push(checklistArray[x]);
            //            }
            //        }
            //        var newCond = newChecklistArray.join(); // Creates a comma separated string.
            //        if (newCond.length > 0) {
            //            if (newConditionString.length > 0) {
            //                newConditionString += '&' + '$ChecklistsRequired~' + newCond;
            //            } else {
            //                newConditionString += '$ChecklistsRequired~' + newCond;
            //            }
            //        }
            //    }
            //}
            //debugger;

        } catch (e) {
            console.log('Exception in isChecklistRequired_CheckChanged(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in isChecklistRequired_CheckChanged(): ' + e.message + ', ' + e.stack);
        }
    },
    cbProjectType_CheckChanged: function (element) {
        try {
            //debugger;
            console.log('In cbProjectType_CheckChanged().'); // elementId: ' + elementId);
            alert('xcx1234324-6 getting the cond');
            var oldConditionString = document.getElementById('spanConditionEditorContents').innerHTML.trim().replace(/&amp;/g, '&'); // Changes &amp; to &. DecodeURI doesn't work! weird!
            var newConditionString = '';
            var oldConditionsArray = oldConditionString.split('&');
            var x = [];
            for (var i = 0; i < oldConditionsArray.length; i++) {
                if (oldConditionsArray[i].indexOf('$ProjectTypes~') > -1) {
                    // do nothing.
                } else {
                    x.push(oldConditionsArray[i]);
                }
            }
            // reassemble
            for (var i = 0; i < x.length; i++) {
                //debugger;
                newConditionString += x[i];
                if ((i + 1) != x.length) {
                    //debugger;
                    newConditionString += '&'; // MAKE SURE WE HAVE THE AMPERSAND!!!!!!!!!!!!!!!!!!!
                }
            }
            var bwProjectTypeId = element.getAttribute('bwProjectTypeId');
            if (element.checked == true) {
                // The checkbox has been selected.
                if (oldConditionString.indexOf('$ProjectTypes~') > -1) {
                    // We already have the entry, so add the checklist guid.
                    var oldChecklistsRequiredArray = oldConditionString.split('$ProjectTypes~')[1].split('&')[0].split(',');
                    var newChecklistsRequiredArray = [];
                    newChecklistsRequiredArray.push(bwProjectTypeId);
                    for (var i = 0; i < oldChecklistsRequiredArray.length; i++) {
                        if (!newChecklistsRequiredArray.includes(oldChecklistsRequiredArray[i])) newChecklistsRequiredArray.push(oldChecklistsRequiredArray[i]);
                    }
                    if (newConditionString.length > 0) {
                        newConditionString += '&' + '$ProjectTypes~' + newChecklistsRequiredArray.toString();
                    } else {
                        newConditionString += '$ProjectTypes~' + newChecklistsRequiredArray.toString();
                    }
                } else {
                    // We don't have the entry, so we have to add it.
                    if (newConditionString.length > 0) {
                        newConditionString += '&' + '$ProjectTypes~' + bwProjectTypeId;
                    } else {
                        newConditionString += '$ProjectTypes~' + bwProjectTypeId;
                    }
                }
            } else {
                // The checkbox is not selected, so make sure the condition string does not have this checklist entry.
                if (oldConditionString.indexOf(bwProjectTypeId) > -1) {
                    var checklistArray = (oldConditionString.split('$ProjectTypes~')[1].split('&')[0]).split(',');
                    var newChecklistArray = [];
                    for (var x = 0; x < checklistArray.length; x++) {
                        if (checklistArray[x] != bwProjectTypeId) {
                            newChecklistArray.push(checklistArray[x]);
                        }
                    }
                    var newCond = newChecklistArray.join(); // Creates a comma separated string.
                    if (newCond.length > 0) {
                        if (newConditionString.length > 0) {
                            newConditionString += '&' + '$ProjectTypes~' + newCond;
                        } else {
                            newConditionString += '$ProjectTypes~' + newCond;
                        }
                    }
                }
            }
            //debugger;
            alert('xcx2143234 setting spanConditionEditorContents');
            document.getElementById('spanConditionEditorContents').innerHTML = newConditionString;
        } catch (e) {
            console.log('Exception in cbProjectType_CheckChanged(): ' + e.message + ', ' + e.stack);
        }
    },
    cbPillarType_CheckChanged: function (element) {
        try {
            console.log('In cbPillarType_CheckChanged().'); // elementId: ' + elementId);
            alert('xcx1234324-7 getting the cond');
            var oldConditionString = document.getElementById('spanConditionEditorContents').innerHTML.trim().replace(/&amp;/g, '&'); // Changes &amp; to &. DecodeURI doesn't work! weird!
            var newConditionString = '';
            var oldConditionsArray = oldConditionString.split('&');
            var x = [];
            //debugger;
            for (var i = 0; i < oldConditionsArray.length; i++) {
                if (oldConditionsArray[i].indexOf('$PillarTypes~') > -1) {
                    // do nothing.
                } else {
                    x.push(oldConditionsArray[i]);
                }
            }
            // reassemble
            for (var i = 0; i < x.length; i++) {
                //debugger;
                newConditionString += x[i];
                if ((i + 1) != x.length) {
                    //debugger;
                    newConditionString += '&'; // MAKE SURE WE HAVE THE AMPERSAND!!!!!!!!!!!!!!!!!!!
                }
            }
            //debugger; // this should have all the sections except the pillar one!!!!
            var bwPillarTypeId = element.getAttribute('bwPillarTypeId');
            if (element.checked == true) {
                // The checkbox has been selected.
                if (oldConditionString.indexOf('$PillarTypes~') > -1) {
                    // We already have the entry, so add the checklist guid.
                    var oldPillarTypesRequiredArray = oldConditionString.split('$PillarTypes~')[1].split('&')[0].split(',');
                    var newPillarTypesRequiredArray = [];
                    newPillarTypesRequiredArray.push(bwPillarTypeId);
                    for (var i = 0; i < oldPillarTypesRequiredArray.length; i++) {
                        if (!newPillarTypesRequiredArray.includes(oldPillarTypesRequiredArray[i])) newPillarTypesRequiredArray.push(oldPillarTypesRequiredArray[i]);
                    }
                    //debugger;
                    if (newConditionString.length > 0) {
                        newConditionString += '&' + '$PillarTypes~' + newPillarTypesRequiredArray.toString();
                    } else {
                        newConditionString += '$PillarTypes~' + newPillarTypesRequiredArray.toString();
                    }
                } else {
                    // We don't have the entry, so we have to add it.
                    if (newConditionString.length > 0) {
                        newConditionString += '&' + '$PillarTypes~' + bwPillarTypeId;
                    } else {
                        newConditionString += '$PillarTypes~' + bwPillarTypeId;
                    }
                }
            } else {
                // The checkbox is not selected, so make sure the condition string does not have this Pillar Type entry.
                if (oldConditionString.indexOf(bwPillarTypeId) > -1) {
                    var pillarTypeArray = (oldConditionString.split('$PillarTypes~')[1].split('&')[0]).split(',');
                    var newPillarTypeArray = [];
                    for (var x = 0; x < pillarTypeArray.length; x++) {
                        if (pillarTypeArray[x] != bwPillarTypeId) {
                            newPillarTypeArray.push(pillarTypeArray[x]);
                        }
                    }
                    var newCond = newPillarTypeArray.join(); // Creates a comma separated string.
                    if (newCond.length > 0) {
                        if (newConditionString.length > 0) {
                            newConditionString += '&' + '$PillarTypes~' + newCond;
                        } else {
                            newConditionString += '$PillarTypes~' + newCond;
                        }
                    }
                }
            }
            //debugger;
            alert('xcx1234253 setting spanConditionEditorContents');
            document.getElementById('spanConditionEditorContents').innerHTML = newConditionString;
        } catch (e) {
            console.log('Exception in cbPillarType_CheckChanged(): ' + e.message + ', ' + e.stack);
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
                    var x = {
                        OrgId: orgId, Name: orgName
                    };
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
            alert('xcx1234324-8 getting the cond');
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
            alert('xcx1234423 setting spanConditionEditorContents');
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
                    var x = {
                        ProjectTypeId: projectTypeId, Name: projectTypeName
                    };
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
            alert('xcx1234324-9 getting the cond');
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
            alert('xcx123423 setting spanConditionEditorContents');
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
                    var x = {
                        PillarId: pillarId, Name: pillarName
                    };
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
            alert('xcx1234324-10 getting the cond');
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
            alert('xcx1234234 setting spanConditionEditorContents');
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


    addARaciStep: function () {
        try {
            console.log('InaddARaciStep().');
            //alert('This functionality is incomplete. Coming soon!');
            //var newStepCount = 0;
            //for (var i = 0; i < this.options.store.RaciSteps.length; i++) {
            //    if (this.options.store.RaciSteps[i].StepName == ('NewStep' + newStepCount)) {
            //        newStepCount++;
            //    }
            //}
            debugger;
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
            this.options.CurrentWorkflow.DraftWorkflow.Steps.Step.push(step);

            //alert('In addARaciStep(). this.options.store: ' + JSON.stringify(this.options.store));

            this._create();
        } catch (e) {
            console.log('Exception in addARaciStep(): ' + e.message + ', ' + e.stack);
        }
    }

});