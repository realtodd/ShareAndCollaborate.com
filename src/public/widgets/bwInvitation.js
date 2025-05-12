$.widget("bw.bwInvitation", {
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
        This is the bwInvitation.js jQuery Widget. 
        ===========================================================

           [more to follow]
                           
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

           [put your stuff here]

        ===========================================================
        
       */

        carouselImageTracker: null,
        carouselTagline: [],
        carouselHeaderText: [],
        audio: null,
        audioMuted: true, // Default to the audio being turned off.
        slideTransitionTime: 6, // This is where we set the transition time between slides.
        slideTransitionLastSystemTime: 0, // This is used to make sure that the slides are switched a consistent number of seconds.
        timerObject: null,

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
        this.element.addClass("bwInvitation");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {
            if (this.options.operationUriPrefix == null) {
                // This formulates the operationUri, which is used throughout.
                var url1 = window.location.href.split('https://')[1];
                var url2 = url1.split('/')[0];
                this.options.operationUriPrefix = 'https://' + url2 + '/';
            }

            var html = '';

            html += '<style>';
            html += '   .bwInvitationRadioButton {';
            html += '       transform: scale(2); ';
            html += '   }';
            html += '   .bwInvitationRadioButton_td {';
            html += '       padding: 5px 5px 5px 5px; ';
            html += '   }';
            html += '</style>';

            html += '<div style="display:none;background-color:white;" id="ViewInvitationDialog">';
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
            html += '               <input type="radio" disabled class="bwInvitationRadioButton" name="rbChangeUserRole" id="rbChangeUserRole5" value="customer" style="cursor:pointer !important;" onmouseout="$(\'.bwInvitation\').bwInvitation(\'updateInvitationSecurityRole_Mouseout\', this);" onchange="$(\'.bwInvitation\').bwInvitation(\'selectInvitationUserRole_Onchange\', this);" />';
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
            html += '               <input type="radio" disabled class="bwInvitationRadioButton" name="rbChangeUserRole" id="rbChangeUserRole0" value="vendor" style="cursor:pointer !important;" onmouseout="$(\'.bwInvitation\').bwInvitation(\'updateInvitationSecurityRole_Mouseout\', this);" onchange="$(\'.bwInvitation\').bwInvitation(\'selectInvitationUserRole_Onchange\', this);" />';
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
            html += '               <input type="radio" checked="checked" class="bwInvitationRadioButton" name="rbChangeUserRole" id="rbChangeUserRole4" value="configurationmanager" style="cursor:pointer !important;" onmouseout="$(\'.bwInvitation\').bwInvitation(\'updateInvitationSecurityRole_Mouseout\', this);" onchange="$(\'.bwInvitation\').bwInvitation(\'selectInvitationUserRole_Onchange\', this);" />';
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
            //html += '       <br />';
            //html += '       <span style="font-family: calibri;font-style:italic;">Alternatively, you can enter their details:</span>';
            //html += '   <div id="xxxx" class="divSignInButton" style="width:90%;text-align:center;line-height:0.8em;font-weight:bold;cursor:pointer !important;" onclick="$(\'#ViewInvitationDialog\').dialog(\'close\');">';
            //html += '       Add a Person by Entering their details...';
            //html += '   </div>';
            html += '   <br /><br />';
            html += '</div>';

            //
            // The home page section.
            //
            //if (displayInvitationsOnHomePageDisplayOn == true) {
            html += '<br />';
            html += '<div id="divInvitationSectionOnHomePage" xcx="xcx23424235" style="border:2px solid lightgray;border-radius:20px 20px 20px 20px;padding:20px;width:75%;">'; // This defines the rounded lightgray div.
            //html += '   <span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 22pt;">';
            //html += '       Add a Person:&nbsp;&nbsp;';
            //html += '   </span>';
            //html += '   <br />';
            //html += '   <br />';
            //html += '   <span class="emailEditor_newMessageButton" onclick="$(\'.bwInvitation\').bwInvitation(\'inviteNewParticipant\');">';
            //html += '       &nbsp;&nbsp;✉&nbsp;Create the invitation...&nbsp;&nbsp;';
            //html += '   </span>';
            html += '<span class="emailEditor_newMessageButton" onclick="$(\'.bwCircleDialog\').bwCircleDialog(\'displayAddANewPersonInACircle\', true);">';
            html += '   &nbsp;&nbsp;👥&nbsp;Add a new person...&nbsp;&nbsp;';
            html += '</span>';

            var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');

            if (developerModeEnabled == true) {
                html += '   <span class="emailEditor_newMessageButton" style="float:right;width:350px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 22pt;">';
                html += '       PRIORITY GROUPING (5)&nbsp;&nbsp;';
                html += '   </span>';
            }


            html += '</div>';
            html += '<br />';
            //html += '<span id="invitationLink2"></span>';
            //html += '<br />';

            this.element.html(html);

            console.log('In bwInvitation._create(). The widget has been initialized.');

        } catch (e) {

            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwInvitation: CANNOT RENDER THE WIDGET</span>';
            html += '<br />';
            html += '<span style="">Exception in bwInvitation.Create(): ' + e.message + ', ' + e.stack + '</span>';
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



    // Begin: Copy invitation link to clipboard.
    copyToClipboard_Invitation: function (element) {
        try {
            console.log('In copyToClipboard_Invitation().');
            //alert('In copyToClipboard_Invitation(). element: ' + element);

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

                                        if (element) {
                                            element.innerHTML += '<br /><br />The invitation has been copied and is ready to paste.';
                                        } else {

                                            var tooltip = document.getElementById('myTooltip');

                                            tooltip.innerHTML = 'The invitation has been copied and is ready to paste.'; //<br /><br />The invitation has been copied and is ready to paste.';
                                            ////tooltip.style.backgroundColor = 'seagreen';
                                            ////tooltip.style.color = 'white';
                                            ////tooltip.style.padding = '5px 5px 5px 5px';
                                            ////tooltip.style.display = 'inline'; // Show it.
                                            
                                        }
                                      
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
            console.log('Exception in copyToClipboard_Invitation(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in copyToClipboard_Invitation(): ' + e.message + ', ' + e.stack);
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
        if (elementId) {
            var tooltip = document.getElementById(elementId);
        } else {
            var tooltip = document.getElementById('myTooltip');
        }
        tooltip.innerHTML = 'Copy to clipboard';
        tooltip.style.backgroundColor = '#555';
        tooltip.style.color = 'white';
    },
    // End: Copy invitation link to clipboard.

    inviteNewParticipant: function () {
        try {
            console.log('In inviteNewParticipant().');
            var thiz = this;

            var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var workflowAppTitle = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTitle');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            var created = new Date();

            var newRole;
            var roles = document.getElementsByName('rbChangeUserRole');
            for (var i = 0; i < roles.length; i++) {
                if (roles[i].checked) newRole = roles[i].value;
            }

            var data = {
                bwTenantId: tenantId,
                bwWorkflowAppId: workflowAppId,
                bwWorkflowAppTitle: workflowAppTitle,
                bwInvitationParticipantRole: newRole,
                bwInvitationCreatedById: participantId,
                bwInvitationCreatedByFriendlyName: participantFriendlyName,
                bwInvitationCreatedByEmail: participantEmail,
                bwInvitationCreatedTimestamp: created
            };
            $.ajax({
                url: this.options.operationUriPrefix + "_bw/participants/invite",
                type: "PUT",
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (data) {

                    var invitationUrl = globalUrlPrefix + globalUrl + '?invitation=' + data;
                    $('#invitationLink').text(invitationUrl);

                    thiz.viewInvitationDialog(data); // This displays the modal dialog.

                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in bwInvitation.js.inviteNewParticipant():' + errorCode + ', ' + errorMessage + '::' + JSON.stringify(data));
                    displayAlertDialog('Error in bwInvitation.js.inviteNewParticipant():' + errorCode + ', ' + errorMessage + '::' + JSON.stringify(data));
                }
            });

        } catch (e) {
            console.log('Exception in inviteNewParticipant(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in inviteNewParticipant(): ' + e.message + ', ' + e.stack);
        }
    },

    viewInvitationDialog: function (invitationId, selectedSecurityRole) { 
        try {
            console.log('In viewInvitationDialog(). selectedSecurityRole: ' + selectedSecurityRole);
            //alert('In viewInvitationDialog(). selectedSecurityRole: ' + selectedSecurityRole);

            if (!selectedSecurityRole) {
                selectedSecurityRole = 'participant'; // The default.
            }

            $('.bwCircleDialog').bwCircleDialog('hideCircleDialog'); // This hides the other one, if it is displayed.

            $("#ViewInvitationDialog").dialog({
                modal: true,
                resizable: false,
                closeText: "Cancel",
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
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
            //$("#ViewInvitationDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

        } catch (e) {
            console.log('Exception in my3.js.cmdViewInvitation(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in my3.js.cmdViewInvitation(): ' + e.message + ', ' + e.stack);
        }
    },

    updateInvitationSecurityRole_Mouseout: function (element) {
        try {
            console.log('In updateInvitationSecurityRole_Mouseout().');

            //var tooltip = document.getElementById('tooltipUpdateSecurityRoleForInvitation');

            //tooltip.innerHTML = '';
            //tooltip.style.backgroundColor = '#555';
            //tooltip.style.color = 'white';

        } catch (e) {
            console.log('Exception in bwInvitation.js.updateInvitationSecurityRole_Mouseout(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwInvitation.js.updateInvitationSecurityRole_Mouseout(): ' + e.message + ', ' + e.stack);
        }
    },
    selectInvitationUserRole_Onchange: function (element) {
        try {
            console.log('In selectInvitationUserRole_Onchange(). selectedValue: ' + element.value);
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
            console.log('Exception in bwInvitation.js.selectInvitationUserRole_Onchange(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwInvitation.js.selectInvitationUserRole_Onchange(): ' + e.message + ', ' + e.stack);
        }
    }

});