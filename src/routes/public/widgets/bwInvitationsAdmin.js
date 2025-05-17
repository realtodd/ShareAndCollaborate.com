$.widget("bw.bwInvitationsAdmin", {
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
        This is the bwInvitationsAdmin.js jQuery Widget. 
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
        this.element.addClass("bwInvitationsAdmin");
        var thiz = this; // Need this because of the asynchronous operations below.

        //var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
        //var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
        //var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
        //var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

        //debugger;
        try {

            selfDiscoverOperationUri(thiz); // This sets this.options.operationUriPrefix correctly.

            // 
            // Load this object first so we don't have to keep making web service calls.
            //
            if (this.options.store != null) {
                this.renderInvitationsAdmin();
            } else {

                this.loadInvitationDataAndRender();
                
            }
        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwInvitationsAdmin: CANNOT RENDER</span>';
            html += '<br />';
            html += '<span style="">Exception in bwInvitationsAdmin.js._create(): ' + e.message + ', ' + e.stack + '</span>';
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


    cmdViewInvitation: function () {
        try {
            console.log('In bwInvitationsAdmin.js.cmdViewInvitation().');

            alert('This functionality is incomplete. Coming soon!');

        } catch (e) {
            console.log('Exception in bwInvitationsAdmin.js.cmdViewInvitation(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwInvitationsAdmin.js.cmdViewInvitation(): ' + e.message + ', ' + e.stack);
        }
    },


    loadInvitationDataAndRender: function () {
        try {
            console.log('In bwInvitationsAdmin.js.loadInvitationDataAndRender().');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            var data = {
                bwWorkflowAppId: workflowAppId
            };
            $.ajax({
                url: thiz.options.operationUriPrefix + "_bw/bwinvitationsunclaimed",
                type: "DELETE",
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (data) {
                    try {
                        thiz.options.store = data;

                        thiz.renderInvitationsAdmin();

                    } catch (e) {
                        console.log('Exception in bwInvitationsAdmin.js.loadInvitationDataAndRender():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwInvitationsAdmin.js.loadInvitationDataAndRender():2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    //window.waitDialog.close();
                    //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
                    console.log('Error in bwInvitationsAdmin.js.loadInvitationDataAndRender():1:' + errorCode + ', ' + errorMessage);
                    displayAlertDialog('Error in bwInvitationsAdmin.js.loadInvitationDataAndRender():1:' + errorCode + ', ' + errorMessage);
                }
            });

        } catch (e) {
            console.log('Exception in bwInvitationsAdmin.js.loadInvitationDataAndRender(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwInvitationsAdmin.js.loadInvitationDataAndRender(): ' + e.message + ', ' + e.stack);
        }
    },

    viewInvitationDialog: function (invitationId, selectedSecurityRole) { // cmdViewInvitation
        try {
            console.log('In bwInvitationsAdmin.js.viewInvitationDialog().');

            //displayAlertDialog('This functionality is incomplete. Coming soon! cmdViewInvitation().');

            $("#ViewInvitationDialog").dialog({
                modal: true,
                resizable: false,
                closeText: "Cancel",
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                title: 'Invitation',
                width: "800px",
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                //buttons: {
                //"Copy to clipboard": {
                //    text: 'Copy to clipboard',
                //    id: 'btnCopyInvitationToClipboard',
                //    style: "'Segoe UI Light','Segoe UI','Segoe',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;color:black;",
                //    //disabled: 'true',
                //    click: function () {
                //        copyInvitationToClipboard();
                //    }
                //},
                //    "Close":  {
                //        text: 'Close',
                //        style: "'Segoe UI Light','Segoe UI','Segoe',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;color:black;",
                //        click: function () {
                //            $(this).dialog("close");
                //        }
                //    }
                //},,
                close: function () {

                    document.getElementById('tooltipUpdateSecurityRoleForInvitation').innerHTML = ''; // Clear the contents
                    document.getElementById('tooltipUpdateSecurityRoleForInvitation').style.display = 'none'; // Hide it.

                    $('#ViewInvitationDialog').dialog('destroy');

                },
                open: function (event, ui) {
                    try {
                        $('.ui-widget-overlay').bind('click', function () {
                            $("#ViewInvitationDialog").dialog('close');
                        });
                        var invitationUrl = globalUrlPrefix + globalUrl + '?invitation=' + invitationId;
                        document.getElementById('textareaViewInvitationDialogInvitationDetails').innerHTML = invitationUrl;
                        document.getElementById('textareaViewInvitationDialogInvitationDetails').blur();

                        var roles = document.getElementsByName('rbChangeUserRole');
                        for (var i = 0; i < roles.length; i++) {
                            if (roles[i].value == selectedSecurityRole) {
                                roles[i].checked = true;
                            } else {
                                roles[i].checked = false;
                            }
                        }

                    } catch (e) {
                        console.log('Exception in cmdViewInvitation.open(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in cmdViewInvitation.open(): ' + e.message + ', ' + e.stack);
                    }
                }
            });

            // Hide the title bar.
            $("#ViewInvitationDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

        } catch (e) {
            console.log('Exception in bwInvitationsAdmin.js.cmdViewInvitation(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwInvitationsAdmin.js.cmdViewInvitation(): ' + e.message + ', ' + e.stack);
        }
    },

    renderInvitationsAdmin: function () {
        try {
            console.log('In renderInvitationsAdmin().');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            this.element.html('');

            var data = this.options.store;

            var html = '';

            html += '<div style="display:none;" id="ViewInvitationDialog">';
            html += '   <table style="width:100%;">';
            html += '       <tr>';
            html += '           <td style="width:90%;">';
            //html += '                    <span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;"><span style="font-weight:lighter;font-size:45pt;">✉</span> Send the invitation</span>';
            html += '               <span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;"><span style="font-weight:lighter;font-size:45pt;">✉</span> Invite a person to your organization by sending them this invitation link.</span>';
            html += '           </td>';
            html += '           <td style="width:9%;"></td>';
            html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#ViewInvitationDialog\').dialog(\'close\');">X</span>';
            html += '           </td>';
            html += '       </tr>';
            html += '   </table>';
            html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            //html += '        <span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:30pt;">';
            //html += '           Invite a participant to your organization by sending them this invitation link.';
            //html += '        </span>';
            html += '   <br />';
            html += '   <span style="font-size:12pt;">';
            html += '       <span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:20pt;">';
            html += '           Select their security role below, then copy the link and send it to them.<br />';
            html += '       </span>';
            html += '       <span style="font-size:10pt;font-style:italic;">';
            html += '           <br />';
            html += '           You will receive an email to let you know when they have logged in. This link is only good for 1 person.';
            html += '       </span>';
            html += '   </span>';
            html += '   <br /><br />';
            html += '   <div class="tooltiptext" id="tooltipUpdateSecurityRoleForInvitation" style="display:none;background-color:rgb(85, 85, 85);color:white;border-radius:10px 10px 10px 10px;text-align:center;padding:20px 0 20px 0;"></div>';
            html += '   <br />';
            html += '   <table class="dataGridTable">';
            html += '       <tr><td colspan="4">&nbsp;</td></tr>';
            // Customer
            html += '       <tr>';
            html += '           <td class="bwInvitationRadioButton_td">';
            html += '               <input type="radio" class="bwInvitationRadioButton" checked="checked" name="rbChangeUserRole" id="rbChangeUserRole5" value="customer" style="cursor:pointer !important;" onmouseout="$(\'.bwInvitation\').bwInvitation(\'updateInvitationSecurityRole_Mouseout\', this);" onchange="$(\'.bwInvitation\').bwInvitation(\'selectInvitationUserRole_Onchange\', this);" />';
            html += '           </td>';
            html += '           <td>';
            html += '               &nbsp;Customer&nbsp;';
            html += '           </td>';
            html += '           <td style="width:30px;"></td>';
            html += '           <td>';
            html += '               <span style="font-size:10pt;font-style:italic;">Can only view specific requests.</span><br />';
            html += '           </td>';
            html += '       </tr>';
            // Vendor or Partner
            html += '       <tr>';
            html += '           <td class="bwInvitationRadioButton_td">';
            html += '               <input type="radio" class="bwInvitationRadioButton" checked="checked" name="rbChangeUserRole" id="rbChangeUserRole0" value="vendor" style="cursor:pointer !important;" onmouseout="$(\'.bwInvitation\').bwInvitation(\'updateInvitationSecurityRole_Mouseout\', this);" onchange="$(\'.bwInvitation\').bwInvitation(\'selectInvitationUserRole_Onchange\', this);" />';
            html += '           </td>';
            html += '           <td>';
            html += '               &nbsp;Vendor or Partner&nbsp;';
            html += '           </td>';
            html += '           <td style="width:30px;"></td>';
            html += '           <td>';
            html += '               <span style="font-size:10pt;font-style:italic;">Can participate in workflow task assignments.</span><br />';
            html += '           </td>';
            html += '       </tr>';
            // Participant
            html += '       <tr>';
            html += '           <td class="bwInvitationRadioButton_td">';
            html += '               <input type="radio" class="bwInvitationRadioButton" name="rbChangeUserRole" id="rbChangeUserRole1" value="participant" style="cursor:pointer !important;" onmouseout="$(\'.bwInvitation\').bwInvitation(\'updateInvitationSecurityRole_Mouseout\', this);" onchange="$(\'.bwInvitation\').bwInvitation(\'selectInvitationUserRole_Onchange\', this);" />';
            html += '           </td>';
            html += '           <td>';
            html += '               &nbsp;Participant&nbsp;';
            html += '           </td>';
            html += '           <td style="width:30px;"></td>';
            html += '           <td>';
            html += '               <span style="font-size:10pt;font-style:italic;">Can create requests and participate in workflow task assignments.</span><br />';
            html += '           </td>';
            html += '       </tr>';
            // Archive Viewer
            html += '       <tr>';
            html += '           <td class="bwInvitationRadioButton_td">';
            html += '               <input type="radio" class="bwInvitationRadioButton" name="rbChangeUserRole" id="rbChangeUserRole2" value="archiveviewer" style="cursor:pointer !important;" onmouseout="$(\'.bwInvitation\').bwInvitation(\'updateInvitationSecurityRole_Mouseout\', this);" onchange="$(\'.bwInvitation\').bwInvitation(\'selectInvitationUserRole_Onchange\', this);" />';
            html += '           </td>';
            html += '           <td>';
            html += '               &nbsp;Archive Viewer&nbsp;';
            html += '           </td>';
            html += '           <td style="width:30px;"></td>';
            html += '           <td>';
            html += '               <span style="font-size:10pt;font-style:italic;">Can view all requests, and is able to delete them.</span><br />';
            html += '           </td>';
            html += '       </tr>';
            // Report Viewer
            html += '       <tr>';
            html += '           <td class="bwInvitationRadioButton_td">';
            html += '               <input type="radio" class="bwInvitationRadioButton" name="rbChangeUserRole" id="rbChangeUserRole3" value="reportviewer" style="cursor:pointer !important;" onmouseout="$(\'.bwInvitation\').bwInvitation(\'updateInvitationSecurityRole_Mouseout\', this);" onchange="$(\'.bwInvitation\').bwInvitation(\'selectInvitationUserRole_Onchange\', this);" />';
            html += '           </td>';
            html += '           <td>';
            html += '               &nbsp;Report Viewer&nbsp;';
            html += '           </td>';
            html += '           <td style="width:30px;"></td>';
            html += '           <td>';
            html += '               <span style="font-size:10pt;font-style:italic;">Can track spending and use analysis tools.</span><br />';
            html += '           </td>';
            html += '       </tr>';
            // Configuration Manager
            html += '       <tr>';
            html += '           <td class="bwInvitationRadioButton_td">';
            html += '               <input type="radio" class="bwInvitationRadioButton" name="rbChangeUserRole" id="rbChangeUserRole4" value="configurationmanager" style="cursor:pointer !important;" onmouseout="$(\'.bwInvitation\').bwInvitation(\'updateInvitationSecurityRole_Mouseout\', this);" onchange="$(\'.bwInvitation\').bwInvitation(\'selectInvitationUserRole_Onchange\', this);" />';
            html += '           </td>';
            html += '           <td>';
            html += '               &nbsp;Configuration Manager&nbsp;';
            html += '           </td>';
            html += '           <td style="width:30px;"></td>';
            html += '           <td>';
            html += '               <span style="font-size:10pt;font-style:italic;">Like the owner, they can do anything.</span><br />';
            html += '           </td>';
            html += '       </tr>';
            html += '   </table>';
            html += '   <br /><br />';
            html += '   <div class="tooltip">';
            html += '       <button onclick="$(\'.bwInvitation\').bwInvitation(\'copyToClipboard_Invitation\')" onmouseout="$(\'.bwInvitation\').bwInvitation(\'copyToClipboardMouseout\')" style="cursor:pointer !important;">';
            html += '           <span class="tooltiptext" id="myTooltip">Copy invitation link to clipboard</span>';
            html += '               Copy invitation link...';
            html += '       </button>';
            html += '   </div>';
            html += '   <textarea id="textareaViewInvitationDialogInvitationDetails" rows="1" style="font-size:12pt;width:98%;" contenteditable="true" readonly="false"></textarea>';
            html += '   <br /><br />';
            html += '   <br /><br />';
            html += '   <div id="xxxx" class="divSignInButton" style="width:90%;text-align:center;line-height:0.8em;font-weight:bold;cursor:pointer !important;" onclick="$(\'#ViewInvitationDialog\').dialog(\'close\');">';
            html += '       Close';
            html += '   </div>';
            html += '   <br /><br />';
            html += '</div>';



            html += '           <span style="font-size:20pt;font-weight:normal;">Invitations</span>';
            html += '<br />';
            html += '<span style="font-size:small;font-style:italic;">When a person accepts an invitation and logs in, you will receive an email confirming that they have joined.</span>';
            if (data.length == 0) {
                html += 'There are no unclaimed invitations.';
            } else {

                html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;" class="context-menu-bwroleseditor2">';
                html += '  <tr>';
                html += '    <td>';
                //
                html += '<br />';
                html += '<div class="codeSnippetContainer" id="code-snippet-4" xmlns="">';
                html += '    <div class="codeSnippetContainerTabs">';
                html += '        <div class="codeSnippetContainerTabSingle" dir="ltr"><a>&nbsp;&nbsp;Invitations&nbsp;&nbsp;</a></div>';
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

                html += '<div style="height:300px;overflow-y: scroll;">';

                html += '<table class="dataGridTable">';
                html += '<tbody>';
                html += '  <tr class="headerRow">';
                html += '    <td>Created By</td>';
                html += '    <td>Created Date</td>';
                html += '    <td>Organization</td>';
                html += '    <td>Logon Provider</td>';
                html += '    <td>Security Role</td>';
                html += '    <td>Accepted (true/false)</td>';
                html += '    <td>Accepted By</td>';
                html += '    <td>Accepted Timestamp</td>';
                html += '    <td></td>';
                html += '    <td></td>';
                //html += '    <td>invitation delivered</td>';
                html += '  </tr>';

                var alternatingRow = 'light'; // Use this to color the rows.
                for (var v = 0; v < data.length; v++) {
                    var style = 'cursor:pointer;';
                    if (alternatingRow == 'light') {
                        html += '  <tr class="alternatingRowLight" style="' + style + '">';
                        alternatingRow = 'dark';
                    } else {
                        html += '  <tr class="alternatingRowDark" style="' + style + '">';
                        alternatingRow = 'light';
                    }

                    html += '    <td title="' + data[v].bwInvitationCreatedByEmail + '" style="cursor:default;">' + data[v].bwInvitationCreatedByFriendlyName + '</td>';

                    // Created Date. 
                    var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(data[v].bwInvitationCreatedTimestamp);
                    html += '    <td>' + timestamp4 + '</td>';

                    html += '    <td>' + data[v].bwWorkflowAppTitle + '</td>';
                    //debugger;
                    //var _logonType = data[v].bwParticipantLogonType;
                    //if (_logonType == 'custom') {
                    //    _logonType = 'BudgetWorkflow.com';
                    //} else if (_logonType == 'microsoft') {
                    //    _logonType = 'Microsoft';
                    //}
                    html += '    <td>' + data[v].bwParticipantLogonType + ' xcx325346523</td>';

                    html += '    <td>' + data[v].bwInvitationParticipantRole + '</td>';
                    var invitationAccepted = false;
                    if (data[v].bwInvitationAcceptedByFriendlyName) {
                        invitationAccepted = true;
                    }
                    html += '    <td>' + invitationAccepted + '</td>';
                    if (invitationAccepted == true) {
                        html += '    <td>' + data[v].bwInvitationAcceptedByFriendlyName + ' (' + data[v].bwInvitationAcceptedByEmail + ')</td>';

                        // Accepted timestamp. 
                        var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(data[v].bwInvitationAcceptedTimestamp);
                        html += '    <td>' + timestamp4 + '</td>';

                    } else {
                        html += '    <td></td>';
                        html += '    <td></td>';
                    }

                    html += '    <td><button style="padding:5px 10px 5px 10px;" onclick="$(\'.bwInvitationsAdmin\').bwInvitationsAdmin(\'viewInvitationDialog\', \'' + data[v].bwInvitationId + '\', \'' + data[v].bwInvitationParticipantRole + '\');" class="BwSmallButton">view</button></td>';
                    html += '    <td><button style="padding:5px 10px 5px 10px;" onclick="$(\'.bwInvitationsAdmin\').bwInvitationsAdmin(\'cmdDeleteInvitation\', \'' + data[v].bwInvitationId + '\');" class="BwSmallButton">delete</button></td>';
                    html += '  </tr>';
                }
                html += '</tbody>';
                html += '</table>';
            }

            html += '</div>';
            html += '<br />';
            html += '                </span>';
            html += '            </div>';
            html += '        </div>';
            html += '    </div>';
            html += '</div>';
            //

            html += '                </span>';
            html += '            </div>';

            html += '        </div>';
            html += '    </div>';
            html += '</div>';

            html += '    </td>';
            html += '  </tr>';
            html += '</table>';

            html += '</div>';

            // Render the html. THIS WAY IS PREFERABLE COME BACK AND FIX SOMETIME
            thiz.element.html(html);

        } catch (e) {
            console.log('Exception in bwInvitationsAdmin.js.renderInvitationsAdmin(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwInvitationsAdmin.js.renderInvitationsAdmin(): ' + e.message + ', ' + e.stack);
        }
    },
    cmdDeleteInvitation: function (invitationId) {
        try {
            console.log('In bwInvitationAdmin.js.cmdDeleteInvitation(). invitationId: ' + invitationId);
            var thiz = this;

            invitation = {
                bwInvitationId: invitationId
            };
            var operationUri = this.options.operationUriPrefix + "_bw/bwinvitationsunclaimed/deletethisinvitation";
            $.ajax({
                url: operationUri,
                type: "POST",
                data: invitation,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    if (data.n == 1 && data.ok == 1) {
                        // Re-render the screen.
                        //populateStartPageItem('divParticipants', 'Reports', '');
                        //renderConfigurationParticipants();
                        thiz.loadInvitationDataAndRender();
                    } else {
                        // Something went wrong!
                        displayAlertDialog('There was a problem deleting this invitation. Error: ' + JSON.stringify(data));
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in cmdDeleteInvitation()xcx1: ' + errorMessage);
                }
            });
        } catch (e) {
            console.log('Exception in bwInvitationAdmin.js.cmdDeleteInvitation(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwInvitationAdmin.js.cmdDeleteInvitation(): ' + e.message + ', ' + e.stack);
        }
    },

    updateInvitationSecurityRole_Mouseout: function (element) {
        try {
            console.log('In bwInvitationsAdmin.js.updateInvitationSecurityRole_Mouseout().');

            //var tooltip = document.getElementById('tooltipUpdateSecurityRoleForInvitation');

            //tooltip.innerHTML = '';
            //tooltip.style.backgroundColor = '#555';
            //tooltip.style.color = 'white';

        } catch (e) {
            console.log('Exception in bwInvitationsAdmin.js.updateInvitationSecurityRole_Mouseout(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwInvitationsAdmin.js.updateInvitationSecurityRole_Mouseout(): ' + e.message + ', ' + e.stack);
        }
    },
    selectInvitationUserRole_Onchange: function (element) {
        try {
            console.log('In bwInvitationsAdmin.js.selectInvitationUserRole_Onchange(). selectedValue: ' + element.value);
            var thiz = this;

            var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            //var workflowAppTitle = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTitle');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            var bwInvitationId = document.getElementById('textareaViewInvitationDialogInvitationDetails').value.split('?invitation=')[1];

            var newRole;
            var roles = document.getElementsByName('rbChangeUserRole');
            for (var i = 0; i < roles.length; i++) {
                if (roles[i].checked) newRole = roles[i].value;
            }

            data = {
                bwTenantId: tenantId,
                bwWorkflowAppId: workflowAppId,
                bwInvitationId: bwInvitationId,
                bwInvitationParticipantRole: newRole,
                bwParticipantLogonType: 'budgetworkflow.com',
                ModifiedById: participantId,
                ModifiedByFriendlyName: participantFriendlyName,
                ModifiedByEmail: participantEmail
            };
            var operationUri = webserviceurl + "/bwparticipant/updateinvitationsecurityrole";
            $.ajax({
                url: operationUri,
                type: "POST",
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {

                    var tooltip = document.getElementById('tooltipUpdateSecurityRoleForInvitation');

                    var roleFriendlyName = '';
                    if (newRole == 'customer') {
                        roleFriendlyName = 'Customer';
                    } else if (newRole == 'participant') {
                        roleFriendlyName = 'Participant';
                    } else if (newRole == 'vendor') {
                        roleFriendlyName = 'Vendor or Partner';
                    } else if (newRole == 'archiveviewer') {
                        roleFriendlyName = 'Archive Viewer';
                    } else if (newRole == 'reportviewer') {
                        roleFriendlyName = 'Report Viewer';
                    } else if (newRole == 'configurationmanager') {
                        roleFriendlyName = 'Configuration Manager';
                    }

                    tooltip.innerHTML = 'The security role for this invitation has been updated to ' + roleFriendlyName + '.'; //<br /><br />The invitation has been copied and is ready to paste.';
                    tooltip.style.backgroundColor = 'seagreen';
                    tooltip.style.color = 'white';
                    tooltip.style.padding = '5px 5px 5px 5px';
                    tooltip.style.display = 'inline'; // Show it.

                    thiz.copyToClipboard_Invitation(tooltip);
                    //thiz.copyToClipboardMouseout();

                    // This line has been commented out, but if we create an invitation, we do want it to show up on the screen in the inventory widget.. more work needed here maybe.?
                    // renderConfigurationParticipants(); // redraw the perticipants editor.

                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in selectInvitationUserRole_Onchange(): ' + errorMessage + ' ' + JSON.stringify(data));
                    displayAlertDialog('Error in selectInvitationUserRole_Onchange(): ' + errorMessage + ' ' + JSON.stringify(data));
                }
            });

        } catch (e) {
            console.log('Exception in bwInvitationsAdmin.js.selectInvitationUserRole_Onchange(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwInvitationsAdmin.js.selectInvitationUserRole_Onchange(): ' + e.message + ', ' + e.stack);
        }
    },

    // Begin: Copy invitation link to clipboard.
    copyToClipboard_Invitation: function (element) {
        try {
            console.log('In bwInvitationsAdmin.js.copyToClipboard_Invitation().');

            var copyElement = document.getElementById('textareaViewInvitationDialogInvitationDetails');
            var copyText = copyElement.value;

            console.log('In copyToClipboard().2');
            if (!copyText) {
                alert('No text to copy.');
            } else {
                console.log('In copyToClipboard().3');

                var browserString = navigator.userAgent;
                if ((browserString.indexOf("Macintosh") > -1) && (browserString.indexOf("Safari") > -1)) { // Macintosh Safari 

                    // Safari and Android WebView do not support navigator.permissions.
                    console.log('In copyToClipboard().3.5 browserString: ' + browserString);
                    displayAlertDialog('In copyToClipboard().3.5 browserString: ' + browserString);

                } else {
                    console.log('In copyToClipboard().4 browserString: ' + browserString);
                    var permissions = navigator.permissions;
                    permissions.query({ name: 'clipboard-write' }).then(function (result) {
                        try {

                            console.log('result.state: ' + result.state);

                            if (result.state === 'granted') {
                                console.log('In copyToClipboard().5');
                                //const type = 'text/plain';
                                //const blob = new Blob([message], { type });
                                //let data = [new ClipboardItem({ [type]: blob })];
                                //navigator.clipboard.write(data).then(function() {
                                //    $.growl.notice({ message: ResourceService.getKey("CopyToClipboardSuccess"), location: "tc", title: "" });
                                //}, function() {
                                //    $.growl.error({ message: ResourceService.getKey("CopyToClipboardError"), location: "tc", title: "" });
                                //});
                                var data = [new ClipboardItem({ "text/plain": new Blob([copyText], { type: "text/plain" }) })];
                                navigator.clipboard.write(data).then(function () {
                                    try {

                                        console.log('In copyToClipboard().6');
                                        element.innerHTML += '<br /><br />The invitation has been copied and is ready to paste.';

                                    } catch (e) {
                                        console.log('Exception3: ' + e.message + ', ' + e.stack);
                                    }
                                }, function (e) {
                                    console.log("Unable to write to clipboard. :-(");

                                    //element.innerHTML += '<br /><br />Unable to write to clipboard: ' + JSON.stringify(e);

                                }).catch(function (e) {

                                    console.log('Exception2. If we get here, it is likely that we need to use the document.execCommand("copy") function.... Does it work? needs testing.: ' + e.message + ', ' + e.stack);

                                    // If we get here, it is likely that we need to use the document.execCommand("copy") function....
                                    copyElement.select();
                                    copyElement.setSelectionRange(0, 99999);
                                    document.execCommand('copy');
                                    console.log('Copied: ' + copyElement.value);

                                });

                                console.log('In copyToClipboard().7');
                            } else {

                                console.log('NO PERMISSIONS xcx326');

                            }
                        } catch (e) {
                            console.log('Exception1: ' + e.message + ', ' + e.stack);
                        }
                    }).catch(function (e) {
                        console.log('Exception2.5 xcx99385: ' + e.message + ', ' + e.stack);
                    });

                }

            }

            //but Clipboard API and events are still working draft, I recommend using an alternatives like clipboard.js
            // iOS Safari: https://stackoverflow.com/questions/34045777/copy-to-clipboard-using-javascript-in-ios

        } catch (e) {
            console.log('Exception in bwInvitationsAdmin.js.copyToClipboard_Invitation(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwInvitationsAdmin.js.copyToClipboard_Invitation(): ' + e.message + ', ' + e.stack);
        }
        //if (elementId) {
        //    var copyText = document.getElementById(elementId);
        //} else {
        //    var copyText = document.getElementById('textareaViewInvitationDialogInvitationDetails');
        //}
        //copyText.select();
        //copyText.setSelectionRange(0, 99999);
        //document.execCommand('copy');

        //if (tooltipElementId) {
        //    var tooltip = document.getElementById(tooltipElementId);
        //} else {
        //    var tooltip = document.getElementById('myTooltip');
        //}
        ////tooltip.innerHTML = "Copied: " + copyText.value;
        //tooltip.innerHTML = 'Copied successfully. Now go and paste it! :)';
        //tooltip.style.backgroundColor = 'seagreen';
        //tooltip.style.color = 'white';
    },

    copyToClipboardMouseout: function (elementId) {
        console.log('In bwInvitationsAdmin.js.copyToClipboardMouseoutx');
        if (elementId) {
            var tooltip = document.getElementById(elementId);
        } else {
            var tooltip = document.getElementById('myTooltip');
        }
        tooltip.innerHTML = 'Copy to clipboard';
        tooltip.style.backgroundColor = '#555';
        tooltip.style.color = 'white';
    }
    // End: Copy invitation link to clipboard.

});