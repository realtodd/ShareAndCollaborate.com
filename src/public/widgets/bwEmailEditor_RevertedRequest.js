$.widget("bw.bwEmailEditor_RevertedRequest", {
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
        This is the bwEmailEditor_RevertedRequest.js jQuery Widget. 
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
        //ajaxTimeout: 15000,


        //quill: null, // was this used somewhere? 6-29-2020
        quill: null, // Email body editor.
        quillSubjectEditor: null, // Email subject editor.





        displayOrgRolesPicker: false, //true, // Should be false by default but this is good for now.
        displayRoleIdColumn: false,
        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function (assignmentRowChanged_ElementId) {
        this.element.addClass("bwEmailEditor_RevertedRequest");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {
            console.log('In bwEmailEditor_RevertedRequest._create().');
            if (this.options.operationUriPrefix == null) {
                // This formulates the operationUri, which is used throughout.
                var url1 = window.location.href.split('https://')[1];
                var url2 = url1.split('/')[0];
                this.options.operationUriPrefix = 'https://' + url2 + '/';
            }

            this.renderEmailEditor();

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwEmailEditor_RevertedRequest: CANNOT RENDER</span>';
            html += '<br />';
            html += '<span style="">Exception in bwEmailEditor_RevertedRequest.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwEmailEditor_RevertedRequest")
            .text("");
    },

    displayConfigureIntroductoryEmailDialog: function () {
        try {
            console.log('In displayConfigureIntroductoryEmailDialog().');
            var thiz = this;

            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                bwWorkflowAppId: workflowAppId
            };
            debugger;
            $.ajax({
                url: this.options.operationUriPrefix + "_bw/WorkflowRevertedRequestNotificationEmail", //"_bw/WorkflowDeletedRequestNotificationEmail",
                type: "Post",
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (results) {
                    try {
                        if (results.message != 'SUCCESS') {

                            alert('ERROR: ' + results.message);

                        } else {

                            // Set the dialog sub title.
                            var html = '';
                            html += 'This email gets sent to participants when a Task is Reverted.';

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
                            $("#bwEmailEditor_RevertedRequest_divConfigureNewUserEmailsDialog").dialog({
                                modal: true,
                                resizable: false,
                                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                                width: '900',
                                dialogClass: 'no-close', // No close button in the upper right corner.
                                hide: false, // This means when hiding just disappear with no effects.
                                open: function () {
                                    try {
                                        $('.ui-widget-overlay').bind('click', function () {
                                            $('#bwEmailEditor_RevertedRequest_divConfigureNewUserEmailsDialog').dialog('close');
                                        });


                                        debugger;

                                        var emailTemplateForSubject;
                                        var emailTemplate;

                                        if (results.bwRevertedRequestNotificationEmailHtml) {
                                            try {
                                                debugger;
                                                // Yay, we got the email template from the database for this organization/workflowApp.
                                                emailTemplate = JSON.parse(results.bwRevertedRequestNotificationEmailHtml);
                                                emailTemplateForSubject = emailTemplate.Subject;
                                                emailTemplate = emailTemplate.Body;
                                            } catch (e) {
                                                //console.log();
                                                //alert();
                                                emailTemplateForSubject = '[corrupted subject]';
                                                emailTemplate = '[corrupted body]';
                                            }
                                        } else {
                                            displayAlertDialog('No email template was provided!!! xcx9927-2');
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

                                        $($('#bwEmailEditor_RevertedRequest_divConfigureNewUserEmailsDialog').find('#quillConfigureNewUserEmailsDialog_Body')[0]).summernote({
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
                                        var customButton = $('#bwEmailEditor_RevertedRequest_divConfigureNewUserEmailsDialog').find('#btnQuill_InsertADataItem')[0]; //document.querySelector('#btnQuill_InsertADataItem'); //
                                        customButton.addEventListener('click', function () {
                                            console.log('In viewPendingEmail.quill.customButton.click().')
                                            //console.log('btnQuill_InsertADataItem: This functionality is incomplete. Coming soon!');
                                            //thiz.displayEmailDataItemPickerDialog('body');
                                        });

                                        //var emailTemplateForSubject = data[0].Subject; //thiz.options.CurrentEmailTemplate.EmailTemplate.Subject;
                                        //var emailTemplate = data[0].Body; //thiz.options.CurrentEmailTemplate.EmailTemplate.Body;

                                        if (emailTemplateForSubject && emailTemplateForSubject != '') {
                                            //$('#bwEmailEditor_RevertedRequest_divConfigureNewUserEmailsDialog').find('#quillConfigureNewUserEmailsDialog_Subject')[0].value = emailTemplateForSubject;
                                            $('#bwEmailEditor_RevertedRequest_divConfigureNewUserEmailsDialog').find('#quillConfigureNewUserEmailsDialog_Subject')[0].value = emailTemplateForSubject;
                                        } else {
                                            //$('#bwEmailEditor_RevertedRequest_divConfigureNewUserEmailsDialog').find('#quillConfigureNewUserEmailsDialog_Subject')[0].value = '';
                                            $('#bwEmailEditor_RevertedRequest_divConfigureNewUserEmailsDialog').find('#quillConfigureNewUserEmailsDialog_Subject')[0].value = '';
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
                                            $($('#bwEmailEditor_RevertedRequest_divConfigureNewUserEmailsDialog').find('#quillConfigureNewUserEmailsDialog_Body')[0]).summernote('code', emailTemplate);
                                        } else {
                                            $($('#bwEmailEditor_RevertedRequest_divConfigureNewUserEmailsDialog').find('#quillConfigureNewUserEmailsDialog_Body')[0]).summernote('reset');
                                        }

                                        //var timestamp = new Date(); // getFriendlyDateAndTime(data[0].Timestamp);
                                        //var html = '';
                                        ////debugger;
                                        ////var toParticipantEmail = data[0].ToParticipantEmail.replace('<', '&lt;').replace('>', '&gt;');
                                        //html += '<span style="color:black;">To:</span> ' + data[0].ToParticipantFriendlyName + ' (' + data[0].ToParticipantEmail + ')';
                                        //html += '<br />';
                                        //html += '<span style="font-weight:normal;font-size:10pt;color:black;">' + timestamp + '</span>';
                                        //$('#bwEmailEditor_RevertedRequest_divConfigureNewUserEmailsDialog').find('#spanSelectedEmailSubject')[0].innerHTML = html;

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
                        var msg = 'Exception in bwEmailEditor_RevertedRequest.js.displayConfigureIntroductoryEmailDialog.WorkflowDeletedRequestNotificationEmail.success(): ' + e.message + ', ' + e.stack;
                        console.log(msg);
                        displayAlertDialog(msg);
                    }

                },
                error: function (data, errorCode, errorMessage) {

                    //var msg;
                    //if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                    //    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                    //} else {
                    //    msg = JSON.stringify(data) + ', errorCode: ' + errorCode + ', errorMessage: ' + errorMessage;
                    //}

                    var msg = 'Exception in bwEmailEditor_RevertedRequest.js.displayConfigureIntroductoryEmailDialog.WorkflowDeletedRequestNotificationEmail.error(): ' + JSON.stringify(data) + ', errorCode: ' + errorCode + ', errorMessage: ' + errorMessage;
                    console.log(msg);
                    displayAlertDialog(msg);

                }
            });

        } catch (e) {
            console.log('Exception in displayConfigureIntroductoryEmailDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in displayConfigureIntroductoryEmailDialog(): ' + e.message + ', ' + e.stack);
        }
    },
    publishEmailTemplateConfigurationAndActivate: function () {
        try {
            console.log('In publishEmailTemplateConfigurationAndActivate().');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            var subject = $('#bwEmailEditor_RevertedRequest_divConfigureNewUserEmailsDialog').find('#quillConfigureNewUserEmailsDialog_Subject')[0].value;
            var body = $($('#bwEmailEditor_RevertedRequest_divConfigureNewUserEmailsDialog').find('#quillConfigureNewUserEmailsDialog_Body')[0]).summernote("code");

            var bwRevertedRequestNotificationEmailHtml = {
                Subject: subject,
                Body: body
            };

            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                bwWorkflowAppId: workflowAppId,
                bwRevertedRequestNotificationEmailHtml: JSON.stringify(bwRevertedRequestNotificationEmailHtml)
            };

            $.ajax({
                url: thiz.options.operationUriPrefix + "_bw/PublishWorkflowRevertedRequestNotificationEmailTemplate", // "_bw/PublishWorkflowDeletedRequestNotificationEmailTemplate",
                type: "Post",
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                }
            }).success(function (results) {
                try {
                    if (results.message != 'SUCCESS') {
                        alert('ERROR: ' + results.message);
                    } else {

                        console.log('In publishEmailTemplateConfigurationAndActivate().post: Successfully updated DB. results: ' + JSON.stringify(results));

                        $("#bwEmailEditor_RevertedRequest_divUndoNewUserEmailTemplateActivationDialog").dialog({
                            modal: true,
                            resizable: false,
                            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                            width: '800',
                            dialogClass: 'no-close', // No close button in the upper right corner.
                            hide: false, // This means when hiding just disappear with no effects.
                            open: function () {
                                try {

                                    $('.ui-widget-overlay').bind('click', function () {
                                        $('#bwEmailEditor_RevertedRequest_divUndoNewUserEmailTemplateActivationDialog').dialog('close');
                                    });

                                    thiz.options.CurrentEmailTemplate.EmailTemplate = JSON.parse(JSON.stringify(bwRevertedRequestNotificationEmailHtml));
                                    thiz.options.CurrentEmailTemplate.DraftEmailTemplate = JSON.parse(JSON.stringify(bwRevertedRequestNotificationEmailHtml));

                                } catch (e) {
                                    console.log('Exception in publishEmailTemplateConfigurationAndActivate.success.dialog.open(): ' + e.message + ', ' + e.stack);
                                    alert('Exception in publishEmailTemplateConfigurationAndActivate.success.dialog.open(): ' + e.message + ', ' + e.stack);
                                }
                            },
                            close: function () {
                                $('#bwEmailEditor_RevertedRequest_divUndoNewUserEmailTemplateActivationDialog').dialog("destroy");
                            }
                        });
                        $('#bwEmailEditor_RevertedRequest_divUndoNewUserEmailTemplateActivationDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
                    }

                } catch (e) {
                    console.log('Exception in publishEmailTemplateConfigurationAndActivate().xx.update: ' + e.message + ', ' + e.stack);
                    alert('Exception in publishEmailTemplateConfigurationAndActivate().xx.update: ' + e.message + ', ' + e.stack);
                }
            }).error(function (data, errorCode, errorMessage) {

                var msg;
                if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                } else {
                    msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
                }
                console.log('Fail in publishEmailTemplateConfigurationAndActivate().xx.update: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
                alert('Fail in publishEmailTemplateConfigurationAndActivate().xx.update: ' + msg); //+ error.message.value + ' ' + error.innererror.message);

            });
        } catch (e) {
            console.log('Exception in publishEmailTemplateConfigurationAndActivate(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in publishEmailTemplateConfigurationAndActivate(): ' + e.message + ', ' + e.stack);
        }
    },




    renderEmailEditor: function () {
        try {
            //debugger; // 9-5-2021
            console.log('In renderEmailEditor().');
            var thiz = this;


            //
            //
            //
            // THIS CODE NEEDS TO BE ISOLATED FROM OTHERS IN THE DOM. 7-12-2023.
            //
            //
            //













            var html = '';

            html += '<div style="display:none;" id="bwEmailEditor_RevertedRequest_divEmailDataItemPickerDialog">';
            html += '  <table style="width:100%;">';
            html += '    <tr>';
            html += '      <td style="width:90%;">';
            html += '        <span id="spanEmailDataItemPickerDialog" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Insert a data item</span>';
            html += '                    <br />';
            html += '                    <span id="spanEmailDataItemPickerDialogSubTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:normal;">[spanEmailDataItemPickerDialogSubTitle]</span>';
            html += '      </td>';
            html += '      <td style="width:9%;"></td>';
            html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#bwEmailEditor_RevertedRequest_divEmailDataItemPickerDialog\').dialog(\'close\');">X</span>';
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


            html += '   <div style="display:none;" id="bwEmailEditor_RevertedRequest_divUndoNewUserEmailTemplateActivationDialog">';
            html += '       <table style="width:100%;">';
            html += '           <tr>';
            html += '               <td style="width:90%;">';
            html += '                   <span id="spanUndoWorkflowActivationTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Rolled-Back Task Email ACTIVATED</span>';
            html += '               </td>';
            html += '               <td style="width:9%;"></td>';
            html += '               <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '                   <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#bwEmailEditor_RevertedRequest_divUndoNewUserEmailTemplateActivationDialog\').dialog(\'close\');">X</span>';
            html += '               </td>';
            html += '           </tr>';
            html += '       </table>';
            html += '       <br /><br />';
            html += '       <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '       <span id="spanUndoWorkflowActivationContentcccxxxccc" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:20pt;">';
            html += '       This Reverted task email has been activated and will be available immediately. ';
            html += '       <br />';
            html += '       <br />';
            html += '       <br />';
            //html += '       <span style="font-weight:bold;cursor:pointer;">';
            //html += '           You can change the "Deleted Request Email" using the drop-down at the top of this page any time';
            //html += '       </span>';
            html += '       </span>';
            html += '       <br /><br />';
            html += '   </div>';


            // "New user introductory email" configuration dialog.
            html += '<div style="display:none;" id="bwEmailEditor_RevertedRequest_divConfigureNewUserEmailsDialog">';
            html += '   <table style="width:100%;">';
            html += '       <tr>';
            html += '           <td style="width:90%;">';
            html += '               <span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:30pt;font-weight:bold;">Configure "Reverted Task Email"</span>';
            html += '<span title="Introductory Email maintenance..." style="width:200px;padding:5px 10px 5px 10px;margin:0 0 0 10px;white-space:nowrap;vertical-align:middle;border:1px solid lightblue;cursor:pointer;font-weight:normal;font-size:10pt;" onclick="$(\'.bwEmailEditor_RevertedRequest\').bwEmailEditor_RevertedRequest(\'displayWorkflowsConfigurationDialog\');"><span style="display:inline-block;"> ⚙ </span></span>';
            html += '               <br />';
            html += '               <span id="spanConfigureEmailNotificationsDialogSubTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:normal;">[spanConfigureEmailNotificationsDialogSubTitle]</span>';
            html += '           </td>';
            html += '           <td style="width:9%;"></td>';
            html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#bwEmailEditor_RevertedRequest_divConfigureNewUserEmailsDialog\').dialog(\'close\');">X</span>';
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

            html += '   <div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" onclick="$(\'.bwEmailEditor_RevertedRequest\').bwEmailEditor_RevertedRequest(\'publishEmailTemplateConfigurationAndActivate\');">';
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




        } catch (e) {
            console.log('Exception in renderEmailEditor(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderEmailEditor(): ' + e.message + ', ' + e.stack);
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
    }

});