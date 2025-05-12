$.widget("bw.bwConfiguration", {
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
        This is the bwConfiguration.js jQuery Widget. 
        ===========================================================

           [more to follow]
                           
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

           [put your stuff here]

        ===========================================================
        
       */

        Inbox: null,
        Sent: null,
        TrashBin: null,

        //quill: null, // removed 10-12-2020
        //quillSubjectEditor: null,

        OnlyDisplayEmailsForCurrentParticipant: false, // When this is true, that means it is being displayed on the Configuration > Personal Settings page, and we only want to show the current participant emails, nothing else.

        // added 10-12-2020. npm install mongoose-paginate https://www.npmjs.com/package/mongoose-paginate
        pagingLimit_SentEmail: 20, // Only display 20 items at a time.

        pagingPage_PendingEmail: null,
        pagingPage_SentEmail: 0, // This is the page that is being displayed. This may be easier to use than offset? It is a zero based value.
        pagingPage_ErrorsAndSuggestions: null,

        //pagingOffset_PendingEmail: null,
        //pagingOffset_SentEmail: 0, // The offset is the actual number of items.
        //pagingOffset_ErrorsAndSuggestions: null,

        backendAdministrationMode: false, // Set this to true when displaying in the backend administration.
        operationUriPrefix: null,
        //ajaxTimeout: 15000,

        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function () {
        this.element.addClass("bwConfiguration");
        var thiz = this;
        try {
            //alert('In bwConfiguration.js._create().');

            if (this.options.operationUriPrefix == null) {
                // This formulates the operationUri, which is used throughout.
                var url1 = window.location.href.split('https://')[1];
                var url2 = url1.split('/')[0];
                this.options.operationUriPrefix = 'https://' + url2 + '/';
            }

            var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');

            var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');

            // The inner left menu uses the same name for "Configuration", and in the future other functionality that uses the inner left menu. Therefore we make sure it is removed from the DOM before we put it back again. No duplicates!
            var element = document.getElementById('tableMainMenu2');
            if (element) {
                element.remove();
            }

            var html = '';

            html += '    <!-- Left inner menu -->';
            html += '    <table id="tableMainMenu2" style="margin-left:-20px;margin-top:-25px;width:100%;border-collapse: collapse;">'; // THIS SETS THE GAP AT THE TOP OF THE INNER MENU. 6-18-2024. xcx231234-1.
            html += '        <tr>';
            html += '            <td style="width:1%;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '                <div class="' + workflowAppTheme + '_noanimation noanimation" style="border-radius:20px 0 0 0;width: 225px; float:left; height:85px; background-color:gray; "></div>';
            html += '            </td>';
            html += '            <td style="width:0.1%;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '                <div style="float:left;height:85px;width:26px;background-color:gray;margin-left:-2px;margin-right:-2px;">';
            html += '                    <div class="' + workflowAppTheme + '_noanimation noanimation" style="float:left;height:85px;width:26px;position:relative;background-color:gray;">';
            html += '                        <div id="divInnerRoundWithWhiteOverlay" style="position:absolute; bottom:0;float:left;width: 26px; height:36px; background-color:#f5f6fa; border-radius:26px 0 0 0;margin-left:1px;margin-bottom:-1px;"></div> <!-- The background-color is set to space white (#f5f6fa) here, for the "under the curve" color of this element. -->';
            html += '                    </div>';
            html += '                </div>';
            html += '            </td>';
            html += '            <td style="width:2%;vertical-align:top;padding:0 6px 0 6px;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '                <div id="divPageContent2_Title" style="font-size:45px;color:black;white-space:nowrap;margin-top:-3px;font-weight:bolder;">[divPageContent2_Title]</div>';
            html += '            </td>';
            html += '            <td style="width:95%;vertical-align:top;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '                <div xcx="xcx2132-4" class="' + workflowAppTheme + '_noanimation noanimation" style="border-radius:0 26px 26px 0;width: 100%; float:left; height:50px; background-color:gray; ">';
            html += '                </div>';
            html += '            </td>';
            html += '        </tr>';
            html += '        <tr>';
            html += '            <td id="tdInnerLeftSideMenu" style="vertical-align:top;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '';
            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
            html += '';
            html += '                <div id="divInnerLeftMenuTopSmallBar1" class="' + workflowAppTheme + '_noanimation noanimation" style="width: 100%; float:right; height:25px; background-color:#7788ff !important; color:white;font-family: \'Franklin Gothic Medium\', \'Arial Narrow\', Arial, sans-serif;display: flex !important;justify-content: flex-end !important;align-items: flex-end !important;"></div>';
            html += '';
            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
            html += '                <div id="divInnerLeftMenuButton_PersonalBehavior" weightedheightvalue="40" class="leftButton ' + workflowAppTheme + '" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForInnerLeftMenuButtons\', this, \'PERSONAL_BEHAVIOR\');">';
            html += '                    <div class="leftButtonText2">PERSONAL SETTINGS</div>';
            html += '                </div>';
            html += '';
            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
            html += '                <div id="divInnerLeftMenuButton_Organization" class="leftButton ' + workflowAppTheme + '" weightedheightvalue="125" style="display:none;height:125px;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForInnerLeftMenuButtons\', this, \'ORGANIZATION\');">';
            html += '                    <div class="leftButtonText2">ORGANIZATION</div>';
            html += '                </div>';
            html += '';
            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
            html += '                <div id="divInnerLeftMenuButton_Roles" class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForInnerLeftMenuButtons\', this, \'ROLES\');">';
            html += '                    <div class="leftButtonText2">ROLES</div>';
            html += '                </div>';
            html += '';
            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
            html += '                <div id="divInnerLeftMenuButton_Participants" class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForInnerLeftMenuButtons\', this, \'PARTICIPANTS\');">';
            html += '                    <div class="leftButtonText2">PARTICIPANTS</div>';
            html += '                </div>';

            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
            html += '                <div id="divInnerLeftMenuButton_Inventory" class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForInnerLeftMenuButtons\', this, \'INVENTORY\');">';
            html += '                    <div class="leftButtonText2">INVENTORY</div>';
            html += '                </div>';

            html += '';
            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
            html += '                <div id="divInnerLeftMenuButton_Workflows" class="leftButton ' + workflowAppTheme + '" weightedheightvalue="125" style="display:none;height:125px;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForInnerLeftMenuButtons\', this, \'WORKFLOW_AND_EMAIL\');">';
            html += '                    <div class="leftButtonText2">WORKFLOWS</div>';
            html += '                </div>';

            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
            html += '                <div id="divInnerLeftMenuButton_Forms" class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForInnerLeftMenuButtons\', this, \'FORMS\');">';
            html += '                    <div class="leftButtonText2">FORMS</div>';
            html += '                </div>';

            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
            html += '                <div id="divInnerLeftMenuButton_Checklists" class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForInnerLeftMenuButtons\', this, \'CHECKLISTS\');">';
            html += '                    <div class="leftButtonText2">CHECKLISTS</div>';
            html += '                </div>';

            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
            html += '                <div id="divInnerLeftMenuButton_OrganizationSettings" class="leftButton ' + workflowAppTheme + '" weightedheightvalue="80" style="display:none;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForInnerLeftMenuButtons\', this, \'SETTINGS\');">';
            html += '                    <div class="leftButtonText2">ORGANIZATION SETTINGS</div>';
            html += '                </div>';
            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
            html += '                <div id="divInnerLeftMenuButton_MonitoringAndTools" class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;height:75px;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForInnerLeftMenuButtons\', this, \'MONITOR_PLUS_TOOLS\');">';
            html += '                    <div class="leftButtonText2">MONITORING & TOOLS</div>';
            html += '                </div>';

            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
            html += '                <div id="divInnerLeftMenuButton_FinancialAreas" class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;height:125px;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForInnerLeftMenuButtons\', this, \'FUNCTIONAL_AREAS\');">';
            html += '                    <div class="leftButtonText2">FINANCIAL AREAS</div>';
            html += '                </div>';


            html += '            </td>';
            html += '            <td colspan="3" style="vertical-align:top;">';
            html += '                <div id="divPageContent2" style="padding-left:10px;">';
            html += '';
            //html += '                    <div id="divPageContent3" style="right:-10px;top:-10px;padding-left:20px;padding-top:15px;">';
            //html += '                        <div style="border:1px dotted tomato;color:goldenrod;">';
            //html += '                            divPageContent3';
            html += '                    <div id="divPageContent3" style="right:-10px;top:-10px;padding-left:20px;padding-top:15px;">';
            html += '                        <div>';
            html += '                            <br />';
            html += '                            <br />';
            html += '                            <br />';
            html += '                            <br />';
            html += '                            <br />';
            html += '                            <br />';
            html += '                            <br />';
            html += '                            <br />';
            html += '                        </div>';
            html += '                    </div>';
            html += '';
            html += '                </div>';
            html += '            </td>';
            html += '        </tr>';
            html += '    </table>';

            this.element.html(html);

            $('.bwActiveMenu').bwActiveMenu('RenderContentForInnerLeftMenuButtons', this, 'PERSONAL_BEHAVIOR');

            console.log('In bwConfiguration._create(). The widget has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwConfiguration: CANNOT INITIALIZE THE WIDGET</span>';
            html += '<br />';
            html += '<span style="">Exception in bwConfiguration.Create(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);

            var msg = 'Exception in bwConfiguration.js._create(): ' + e.message + ', ' + e.stack;
            displayAlertDialog(msg);

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
            .removeClass("bwConfiguration")
            .text("");
    },

    loadAndRenderEmails: function (bwWorkflowAppId) {
        try {
            console.log('In bwConfiguration.js.loadAndRenderEmails(). bwWorkflowAppId: ' + bwWorkflowAppId);
            //alert('In bwConfiguration.js.loadAndRenderEmails(). bwWorkflowAppId: ' + bwWorkflowAppId);
            var thiz = this;

            $('#divPageContent2_Title').html('✉&nbsp;INBOX');


            // Select the HOME button here. 1-4-2024.
            var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');

            var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

            // Step 1: Make all of the buttons un-selected.
            $('.bwConfiguration:first').find('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
            });

            // Step 2: Set the specified button as the selected one.
            $('#divInnerLeftMenuButton_Inbox').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);

            //
            // Rendering the layout, within the divPageContent3 element.
            //

            var html = '';

            html += '<style>';
            html += '   .bwConfiguration_LeftMenuButton {';
            html += '       font-size:14pt;white-space:nowrap;cursor:pointer;padding:10px 40px 10px 40px;'; // T R B L
            html += '   }';
            html += '   .bwConfiguration_LeftMenuButton:hover {';
            html += '       cursor:pointer;background-color:lightgray;';
            html += '   }';
            html += '   .bwConfiguration_LeftMenuButton_Selected {';
            html += '       font-size:14pt;white-space:nowrap;cursor:pointer;padding:10px 40px 10px 40px;background-color:#DEECF9;';
            html += '   }';
            html += '   .bwConfiguration_LeftMenuButton_UnicodeImage {';
            html += '       font-size:30px;color:gray;'; // T L B R
            html += '   }';

            html += '   .bwConfiguration_InnerLeftMenuButton {';
            html += '       font-size:14pt;white-space:nowrap;cursor:pointer;padding:10px 40px 10px 40px;'; // T R B L
            // border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px; <<< This is the style attribute values in the code.
            html += '   }';
            html += '   .bwConfiguration_InnerLeftMenuButton:hover {';
            html += '       cursor:pointer;background-color:aliceblue;';
            html += '   }';

            html += '   .bwConfiguration_InnerLeftMenuButton_Selected {';
            //html += '       font-size:14pt;white-space:nowrap;cursor:pointer;padding:10px 40px 10px 40px;';
            html += '       cursor:pointer;background-color:aliceblue;';
            html += '   }';



            html += '   .bwConfiguration_Trashbin {';
            html += '       cursor:pointer;background-color:aliceblue;'; // T R B L
            html += '   }';
            html += '   .bwConfiguration_Trashbin:hover {';
            html += '       cursor:pointer;background-color:salmon;color:tomato;';
            html += '   }';



            html += '</style>';

            html += '<div style="display:none;border: 2px solid yellow;" id="divBwEmailMonitor_DeletePendingEmailsDialog">';
            html += '   <table style="width:100%;">';
            html += '       <tr>';
            html += '           <td style="width:90%;">';
            html += '               <span id="spanDeletePendingEmailsDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">Delete Emails</span>';
            html += '           </td>';
            html += '           <td style="width:9%;"></td>';
            html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divBwEmailMonitor_DeletePendingEmailsDialog\').dialog(\'close\');">X</span>';
            html += '           </td>';
            html += '       </tr>';
            html += '   </table>';
            html += '   <br /><br />';
            html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '   <span id="spanBwEmailMonitor_DeletePendingEmailsDialogContentText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;">';
            html += '[spanBwEmailMonitor_DeletePendingEmailsDialogContentText]';
            html += '   </span>';
            html += '   <br /><br /><br />';
            //html += '   <div id="divBwEmailMonitor_DeleteThePendingEmails" class="divSignInButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'deleteSelectedPendingEmails\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
            html += '   <div id="divBwEmailMonitor_DeleteThePendingEmails" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
            html += '       Delete the Pending Emails';
            html += '   </div>';
            html += '   <br /><br />';
            html += '   <div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em; font-weight: bold;" onclick="$(\'#divBwEmailMonitor_DeletePendingEmailsDialog\').dialog(\'close\');">';
            html += '       Cancel';
            html += '   </div>';
            html += '   <br /><br />';
            html += '</div>';

            //html += '<div style="display:none;border: 2px solid yellow;" id="divBwEmailMonitor_DeleteSentEmailsDialog">';
            //html += '   <table style="width:100%;">';
            //html += '       <tr>';
            //html += '           <td style="width:90%;">';
            //html += '               <span id="spanDeleteSentEmailsDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">Delete Emails</span>';
            //html += '           </td>';
            //html += '           <td style="width:9%;"></td>';
            //html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
            //html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divBwEmailMonitor_DeleteSentEmailsDialog\').dialog(\'close\');">X</span>';
            //html += '           </td>';
            //html += '       </tr>';
            //html += '   </table>';
            //html += '   <br /><br />';
            //html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            //html += '   <span id="spanBwEmailMonitor_DeleteSentEmailsDialogContentText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;">';
            //html += '[spanBwEmailMonitor_DeleteSentEmailsDialogContentText]';
            //html += '   </span>';
            //html += '   <br /><br /><br />';
            ////html += '   <div id="divBwEmailMonitor_DeleteTheSentEmails" class="divSignInButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'deleteSelectedSentEmails\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" >';
            //html += '   <div id="divBwEmailMonitor_DeleteTheSentEmails" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" >';
            //html += '       Delete the Sent Emails';
            //html += '   </div>';
            //html += '   <br /><br />';
            //html += '   <div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em; font-weight: bold;" onclick="$(\'#divBwEmailMonitor_DeleteSentEmailsDialog\').dialog(\'close\');">';
            //html += '       Cancel';
            //html += '   </div>';
            //html += '   <br /><br />';
            //html += '</div>';

            html += '<table style="width:100%;" xcx="xcx232536">';
            html += '   <tr>';
            html += '       <td style="width:100%;">';
            html += '           <div id="displayedemaildetails" bwPendingEmailId="" bwSentEmailId="" bwerrororsuggestionid=""></div>'; // This is where we look when we want to know the type and GUID of the displayed email!

            html += '           <table style="width:100%;">';
            html += '               <colgroup>';
            html += '                   <col style="WIDTH:3%;" />';
            html += '                   <col style="WIDTH:2%;" />';
            html += '                   <col style="WIDTH:5%;" />';
            html += '                   <col style="WIDTH:5%;" />';
            html += '                   <col style="WIDTH:5%;" />';
            html += '                   <col style="WIDTH:5%;" />';
            html += '                   <col style="WIDTH:90%;" />';
            html += '               </colgroup>';
            html += '               <tbody>';
            html += '                       <tr>';
            html += '                           <td>';
            //html += '                           <span class="emailEditor_newMessageButton" onclick="alert(\'This functionality is incomplete. Coming soon! xcx664993-2\');">'; //
            //html += '                               &nbsp;✉&nbsp;New message&nbsp;';
            //html += '                           </span>';
            html += '                           </td>';
            html += '                           <td colspan="6">';
            //html += '                               <span id="spanSelectedEmailType_TopButtons" style="font-size:13pt;font-weight:normal;">[spanSelectedEmailType_TopButtons]</span>';
            html += '                           </td>';
            html += '                       </tr>';

            html += '                       <tr style="font-size:10pt;font-weight:normal;color:black;">';
            html += '                           <td>';
            html += '                           </td>';
            html += '                           <td></td>';
            html += '                           <td colspan="4">';
            html += '                           </td>';
            html += '                           <td style="text-align:right;width:97%;">';

            var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');
            if (developerModeEnabled == true) {
                html += '                               <span class="spanButton" title="Click to send this email now!" onclick="$(\'.bwConfiguration\').bwConfiguration(\'sendPendingEmailNow\');">';
                html += '                                   ✉&nbsp;Send Now > xcx1';
                html += '                               </span>';
            }

            html += '                           </td>';
            html += '                       </tr>';

            //
            // This is the 3-column main display of the mail client.
            //
            html += '<tr>';
            html += '   <td colspan="7" style="width:100%;">';
            html += '       <table style="width:100%;">';
            html += '           <colgroup>';
            //html += '               <col style="WIDTH:23%;" />';
            html += '               <col style="WIDTH:25%;" />';
            html += '               <col style="WIDTH:62%;" />';
            html += '           </colgroup>';
            html += '           <tbody>';
            html += '               <tr>';
            //html += '                   <td xcx="xcx111">';
            ////html += 'xcx111';
            //html += '                       <span class="emailEditor_newMessageButton" onclick="$(\'.bwConfiguration:first\').bwConfiguration(\'composeANewEmailMessage\');">'; //
            //html += '                           &nbsp;✉&nbsp;New message&nbsp;';
            //html += '                       </span>';
            //html += '                   </td>';
            html += '                   <td xcx="xcx222">';
            //html += 'xcx222';
            html += '                       <span id="spanSelectedEmailType_TopButtons" style="font-size:13pt;font-weight:normal;">[spanSelectedEmailType_TopButtons]</span>';
            html += '                   </td>';
            html += '                   <td xcx="xcx333-1">';
            //html += 'xcx333';


            html += '<span id="" style="float:right;white-space:nowrap;">   Search:    <span id="searchbox">       <input type="text" id="inputBwAuthentication_SearchBox" onkeydown="$(\'.bwConfiguration\').bwConfiguration(\'searchBox_OnKeyDown\', event);" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;">       &nbsp;&nbsp;       <span class="emailEditor_newMessageButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'search\');">Search</span>   </span></span>';







            html += '                   </td>';
            html += '               </tr>';


            html += '               <tr>';
            //html += '                   <td xcx="xcx111" style="vertical-align:top;">';

            //// Left-most column.
            //html += '<table>';
            //html += '   <tr>';
            //html += '       <td id="tdDisplayPendingEmailButton">';
            //html += '       </td>';
            //html += '   </tr>';
            //html += '   <tr>';
            //html += '       <td>';
            //html += '           <table>';

            //if (developerModeEnabled == true) {
            //    html += '               <tr>';
            //    html += '                   <td id="spanDisplayAIConversationButton" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayAIConversation\');">';
            //    html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">🔊</span> AI Conversation</span>';
            //    html += '                       </br>';
            //    html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">The system engages you in a </br>conversation about the </br>requests that you are </br>involved with.</span>';
            //    html += '                   </td>';
            //    html += '               </tr>';
            //}


            //// 6-5-2023
            //html += '               <tr>';
            //html += '                   <td id="spanDisplaySentEmailButton" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayIncomingEmails\');">';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">✉</span> Incoming</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Emails sent to you from an external source.</span>';
            //html += '                   </td>';
            //html += '               </tr>';



            //html += '               <tr>';
            //html += '                   <td id="spanDisplaySentEmailButton" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displaySentEmails\');">';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">✉</span> Inbox</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Emails sent to you.</span>';
            //html += '                   </td>';
            //html += '               </tr>';

            //html += '               <tr>';
            //html += '                   <td id="spanDisplayPendingEmailButton" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayPendingEmailsxxxx\');" >';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">✉</span> Sent</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Emails you have sent. *beta</span>';
            //html += '                   </td>';
            //html += '               </tr>';

            //html += '               <tr>';
            //html += '                   <td id="spanDisplayPendingEmailButton" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayPendingEmails\');" >';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">✉</span> Pending Inbox</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Emails waiting to be sent to you.</span>';
            //html += '                   </td>';
            //html += '               </tr>';

            //html += '               <tr>';
            //html += '                   <td id="spanDisplayPendingEmailButton" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayPendingEmails\');" >';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage"><img src="/images/trashbin.png"></span> TrashBin (Inbox)</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Emails you have deleted.</span>';
            //html += '                   </td>';
            //html += '               </tr>';

            //html += '               <tr>';
            //html += '                   <td id="spanDisplayPendingEmailButtonxxx" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayPendingEmailsxxx\');" >';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">☎</span> Sent Text Message(s)</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Text Messages sent to you.</span>';
            //html += '                   </td>';
            //html += '               </tr>';
            //html += '               <tr>';
            //html += '                   <td id="spanDisplayPendingEmailButtonxxx" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayPendingEmailsxxx\');" >';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">☎</span> Pending Text Message(s)</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Text Messages waiting to be sent to you.</span>';
            //html += '                   </td>';
            //html += '               </tr>';
            //html += '           </table>';
            //html += '       </td>';
            //html += '   </tr>';
            //html += '</table>';
            //// end: Left-most column.

            //html += '                   </td>';
            html += '                   <td xcx="xcx222" style="vertical-align:top;">';

            // Middle column.
            html += '<table>';
            html += '   <tr>';
            html += '       <td style="width:350px;height:50px;text-align:left;background-color:white;margin:10px 20px 10px -3px;">';
            html += '           <span id="spanSelectedEmailType_Title" style="height:30px;font-size:15pt;font-weight:bold;">[spanSelectedEmailType_Title]</span>';
            html += '       </td>';
            html += '   </tr>';
            html += '   <tr>';
            html += '       <td>';
            //html += '           <div xcx="xcx21323663" style="width:460px;height:600px;overflow-y: scroll;overflow-x:hidden;">'; // The width is set here for the email list... 2-9-2022
            html += '               <span id="spanEmailPicker"></span>';
            //html += '           </div>';
            html += '       </td>';
            html += '   </tr>';
            html += '</table>';
            // end: Middle column.

            html += '                   </td>';
            html += '                   <td xcx="xcx333-2" style="vertical-align:top;">';

            // Right column.
            html += '<table style="width:100%;">';
            html += '   <tr>';
            html += '       <td>';
            html += '           <div id="divEmailClient_CompositionWindow">';
            //html += '               <span id="spanSelectedEmail_From" style="font-size:13pt;font-weight:bold;color:#95b1d3;">[spanSelectedEmail_From]</span>';
            //html += '               <br />';
            html += '               <span id="spanSelectedEmailSubject" style="font-size:13pt;font-weight:bold;color:#95b1d3;"></span>';
            html += '               <br />';
            html += '               <span id="spanSelectedEmail"></span>';
            html += '           </div>';
            html += '       </td>';
            html += '   </tr>';
            html += '</table>';
            // end: Right column.

            html += '                   </td>';

            html += '               </tr>';


            html += '           </tbody>';
            html += '       </table>';
            html += '   </td>';
            html += '</tr>';
            // end: This is the 3-column main display of the mail client.


            html += '               </tbody>';
            html += '           </table>';

            html += '       </td>';
            html += '   </tr>';
            html += '</table>';

            // Render the html.
            $('#divPageContent3').html(html);


















            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            if (bwWorkflowAppId != 'all') {
                bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            }

            this.options.pagingPage_SentEmail = 0; // If we want items to display properly, these need to be reset/set back to the beginning here.
            //this.options.pagingLimit_SentEmail = 20;

            $('#spanSelectedEmailSubject').html('');

            //try {
            var html = '';

            // Display the top buttons.
            html += '                           <span class="emailEditor_topbarbutton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\');">';
            html += '                               <img title="Delete..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx123468" />&nbsp;Delete';
            html += '                           </span>';
            html += '&nbsp;&nbsp;';
            html += '                           <span class="emailEditor_topbarbutton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\', \'emptyfolder\');">';
            html += '                               <img title="Empty folder..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx23423467898">&nbsp;Empty folder';
            html += '                           </span>';
            $(thiz.element).find('#spanSelectedEmailType_TopButtons')[0].innerHTML = html; //'Pending Email';

            // Display the radio button and the title.
            html = '';
            html += '<input type="checkbox" id="checkboxToggleSentEmailCheckboxes" onchange="$(\'.bwConfiguration\').bwConfiguration(\'toggleSentEmailCheckboxes\', this);" />&nbsp;&nbsp;';
            html += '✉ Inbox Items';

            $(thiz.element).find('#spanSelectedEmailType_Title')[0].innerHTML = html; //'Sent Email';

            // Make this button appear selected.
            $(thiz.element).find('#spanDisplaySentEmailButton').removeClass('bwConfiguration_LeftMenuButton').addClass('bwConfiguration_LeftMenuButton_Selected');
            $(thiz.element).find('#spanDisplayPendingEmailButton').removeClass('bwConfiguration_LeftMenuButton_Selected').addClass('bwConfiguration_LeftMenuButton');

            //} catch (e) { }

            // Clear these in the beginning, because it may take a few seconds to re-populate, and this gives the user some visual feedback that something is going on.
            $(thiz.element).find('#spanEmailPicker')[0].innerHTML = '';
            $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '';

            console.log('xcx2313555. In bwConfiguration.js.loadAndRenderEmails(). Calling GET ' + webserviceurl + '/participantemail_inbox/ this.options.OnlyDisplayEmailsForCurrentParticipant: ' + this.options.OnlyDisplayEmailsForCurrentParticipant);

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');
            debugger;
            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                bwWorkflowAppId: workflowAppId,
                bwParticipantId: participantId
            };

            $.ajax({
                url: this.options.operationUriPrefix + "_bw/participantemail_inbox", // DO THE INITIAL LOAD WITH no body/html... then back fill, logic for this TBD. // 1-7-2023.
                type: "POST",
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (results) {
                    try {

                        if (results.status != 'SUCCESS') {

                            var msg = results.status + ': ' + results.message;
                            console.log(msg);
                            displayAlertDialog(msg);

                            thiz.element.html(''); // This actually works to get rid of the widget. Ha! 11-8-2023.

                        } else {

                            thiz.options.Inbox = results.results;

                            thiz.renderEmails();

                            $('.bwActiveMenu:first').bwActiveMenu('adjustInnerLeftSideMenu');

                        }

                    } catch (e) {
                        console.log('Exception in bwConfiguration.js.loadAndRenderEmails():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwConfiguration.js.loadAndRenderEmails():2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in bwConfiguration.js.loadAndRenderEmails():' + errorCode + ', ' + errorMessage);
                    displayAlertDialog('Error in bwConfiguration.js.loadAndRenderEmails():' + errorCode + ', ' + errorMessage);
                }
            });

        } catch (e) {
            console.log('Exception in loadAndRenderEmails(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in loadAndRenderEmails(): ' + e.message + ', ' + e.stack);
        }
    },

    loadAndRenderEmails_Sent: function (bwWorkflowAppId) {
        try {
            console.log('In loadAndRenderEmails_Sent(). bwWorkflowAppId: ' + bwWorkflowAppId);
            var thiz = this;

            $('#divPageContent2_Title').html('✉&nbsp;SENT');


            // Select the HOME button here. 1-4-2024.
            var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');

            var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

            // Step 1: Make all of the buttons un-selected.
            $('.bwConfiguration:first').find('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
            });

            // Step 2: Set the specified button as the selected one.
            $('#divInnerLeftMenuButton_Inbox').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);

            //
            // Rendering the layout, within the divPageContent3 element.
            //

            var html = '';

            html += '<style>';
            html += '   .bwConfiguration_LeftMenuButton {';
            html += '       font-size:14pt;white-space:nowrap;cursor:pointer;padding:10px 40px 10px 40px;'; // T R B L
            html += '   }';
            html += '   .bwConfiguration_LeftMenuButton:hover {';
            html += '       cursor:pointer;background-color:lightgray;';
            html += '   }';
            html += '   .bwConfiguration_LeftMenuButton_Selected {';
            html += '       font-size:14pt;white-space:nowrap;cursor:pointer;padding:10px 40px 10px 40px;background-color:#DEECF9;';
            html += '   }';
            html += '   .bwConfiguration_LeftMenuButton_UnicodeImage {';
            html += '       font-size:30px;color:gray;'; // T L B R
            html += '   }';

            html += '   .bwConfiguration_InnerLeftMenuButton {';
            html += '       font-size:14pt;white-space:nowrap;cursor:pointer;padding:10px 40px 10px 40px;'; // T R B L
            // border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px; <<< This is the style attribute values in the code.
            html += '   }';
            html += '   .bwConfiguration_InnerLeftMenuButton:hover {';
            html += '       cursor:pointer;background-color:aliceblue;';
            html += '   }';

            html += '   .bwConfiguration_InnerLeftMenuButton_Selected {';
            //html += '       font-size:14pt;white-space:nowrap;cursor:pointer;padding:10px 40px 10px 40px;';
            html += '       cursor:pointer;background-color:aliceblue;';
            html += '   }';



            html += '   .bwConfiguration_Trashbin {';
            html += '       cursor:pointer;background-color:aliceblue;'; // T R B L
            html += '   }';
            html += '   .bwConfiguration_Trashbin:hover {';
            html += '       cursor:pointer;background-color:salmon;color:tomato;';
            html += '   }';



            html += '</style>';

            html += '<div style="display:none;border: 2px solid yellow;" id="divBwEmailMonitor_DeletePendingEmailsDialog">';
            html += '   <table style="width:100%;">';
            html += '       <tr>';
            html += '           <td style="width:90%;">';
            html += '               <span id="spanDeletePendingEmailsDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">Delete Emails</span>';
            html += '           </td>';
            html += '           <td style="width:9%;"></td>';
            html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divBwEmailMonitor_DeletePendingEmailsDialog\').dialog(\'close\');">X</span>';
            html += '           </td>';
            html += '       </tr>';
            html += '   </table>';
            html += '   <br /><br />';
            html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '   <span id="spanBwEmailMonitor_DeletePendingEmailsDialogContentText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;">';
            html += '[spanBwEmailMonitor_DeletePendingEmailsDialogContentText]';
            html += '   </span>';
            html += '   <br /><br /><br />';
            //html += '   <div id="divBwEmailMonitor_DeleteThePendingEmails" class="divSignInButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'deleteSelectedPendingEmails\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
            html += '   <div id="divBwEmailMonitor_DeleteThePendingEmails" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
            html += '       Delete the Pending Emails';
            html += '   </div>';
            html += '   <br /><br />';
            html += '   <div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em; font-weight: bold;" onclick="$(\'#divBwEmailMonitor_DeletePendingEmailsDialog\').dialog(\'close\');">';
            html += '       Cancel';
            html += '   </div>';
            html += '   <br /><br />';
            html += '</div>';

            //html += '<div style="display:none;border: 2px solid yellow;" id="divBwEmailMonitor_DeleteSentEmailsDialog">';
            //html += '   <table style="width:100%;">';
            //html += '       <tr>';
            //html += '           <td style="width:90%;">';
            //html += '               <span id="spanDeleteSentEmailsDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">Delete Emails</span>';
            //html += '           </td>';
            //html += '           <td style="width:9%;"></td>';
            //html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
            //html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divBwEmailMonitor_DeleteSentEmailsDialog\').dialog(\'close\');">X</span>';
            //html += '           </td>';
            //html += '       </tr>';
            //html += '   </table>';
            //html += '   <br /><br />';
            //html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            //html += '   <span id="spanBwEmailMonitor_DeleteSentEmailsDialogContentText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;">';
            //html += '[spanBwEmailMonitor_DeleteSentEmailsDialogContentText]';
            //html += '   </span>';
            //html += '   <br /><br /><br />';
            ////html += '   <div id="divBwEmailMonitor_DeleteTheSentEmails" class="divSignInButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'deleteSelectedSentEmails\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" >';
            //html += '   <div id="divBwEmailMonitor_DeleteTheSentEmails" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" >';
            //html += '       Delete the Sent Emails';
            //html += '   </div>';
            //html += '   <br /><br />';
            //html += '   <div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em; font-weight: bold;" onclick="$(\'#divBwEmailMonitor_DeleteSentEmailsDialog\').dialog(\'close\');">';
            //html += '       Cancel';
            //html += '   </div>';
            //html += '   <br /><br />';
            //html += '</div>';

            html += '<table style="width:100%;" xcx="xcx232536">';
            html += '   <tr>';
            html += '       <td style="width:100%;">';
            html += '           <div id="displayedemaildetails" bwPendingEmailId="" bwSentEmailId="" bwerrororsuggestionid=""></div>'; // This is where we look when we want to know the type and GUID of the displayed email!

            html += '           <table style="width:100%;">';
            html += '               <colgroup>';
            html += '                   <col style="WIDTH:3%;" />';
            html += '                   <col style="WIDTH:2%;" />';
            html += '                   <col style="WIDTH:5%;" />';
            html += '                   <col style="WIDTH:5%;" />';
            html += '                   <col style="WIDTH:5%;" />';
            html += '                   <col style="WIDTH:5%;" />';
            html += '                   <col style="WIDTH:90%;" />';
            html += '               </colgroup>';
            html += '               <tbody>';
            html += '                       <tr>';
            html += '                           <td>';
            //html += '                           <span class="emailEditor_newMessageButton" onclick="alert(\'This functionality is incomplete. Coming soon! xcx664993-2\');">'; //
            //html += '                               &nbsp;✉&nbsp;New message&nbsp;';
            //html += '                           </span>';
            html += '                           </td>';
            html += '                           <td colspan="6">';
            //html += '                               <span id="spanSelectedEmailType_TopButtons" style="font-size:13pt;font-weight:normal;">[spanSelectedEmailType_TopButtons]</span>';
            html += '                           </td>';
            html += '                       </tr>';

            html += '                       <tr style="font-size:10pt;font-weight:normal;color:black;">';
            html += '                           <td>';
            html += '                           </td>';
            html += '                           <td></td>';
            html += '                           <td colspan="4">';
            html += '                           </td>';
            html += '                           <td style="text-align:right;width:97%;">';

            var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');
            if (developerModeEnabled == true) {
                html += '                               <span class="spanButton" title="Click to send this email now!" onclick="$(\'.bwConfiguration\').bwConfiguration(\'sendPendingEmailNow\');">';
                html += '                                   ✉&nbsp;Send Now > xcx1';
                html += '                               </span>';
            }

            html += '                           </td>';
            html += '                       </tr>';

            //
            // This is the 3-column main display of the mail client.
            //
            html += '<tr>';
            html += '   <td colspan="7" style="width:100%;">';
            html += '       <table style="width:100%;">';
            html += '           <colgroup>';
            //html += '               <col style="WIDTH:23%;" />';
            html += '               <col style="WIDTH:25%;" />';
            html += '               <col style="WIDTH:62%;" />';
            html += '           </colgroup>';
            html += '           <tbody>';
            html += '               <tr>';
            //html += '                   <td xcx="xcx111">';
            ////html += 'xcx111';
            //html += '                       <span class="emailEditor_newMessageButton" onclick="$(\'.bwConfiguration:first\').bwConfiguration(\'composeANewEmailMessage\');">'; //
            //html += '                           &nbsp;✉&nbsp;New message&nbsp;';
            //html += '                       </span>';
            //html += '                   </td>';
            html += '                   <td xcx="xcx222">';
            //html += 'xcx222';
            html += '                       <span id="spanSelectedEmailType_TopButtons" style="font-size:13pt;font-weight:normal;">[spanSelectedEmailType_TopButtons]</span>';
            html += '                   </td>';
            html += '                   <td xcx="xcx333-1">';
            //html += 'xcx333';


            html += '<span id="" style="float:right;white-space:nowrap;">   Search:    <span id="searchbox">       <input type="text" id="inputBwAuthentication_SearchBox" onkeydown="$(\'.bwConfiguration\').bwConfiguration(\'searchBox_OnKeyDown\', event);" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;">       &nbsp;&nbsp;       <span class="emailEditor_newMessageButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'search\');">Search</span>   </span></span>';







            html += '                   </td>';
            html += '               </tr>';


            html += '               <tr>';
            //html += '                   <td xcx="xcx111" style="vertical-align:top;">';

            //// Left-most column.
            //html += '<table>';
            //html += '   <tr>';
            //html += '       <td id="tdDisplayPendingEmailButton">';
            //html += '       </td>';
            //html += '   </tr>';
            //html += '   <tr>';
            //html += '       <td>';
            //html += '           <table>';

            //if (developerModeEnabled == true) {
            //    html += '               <tr>';
            //    html += '                   <td id="spanDisplayAIConversationButton" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayAIConversation\');">';
            //    html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">🔊</span> AI Conversation</span>';
            //    html += '                       </br>';
            //    html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">The system engages you in a </br>conversation about the </br>requests that you are </br>involved with.</span>';
            //    html += '                   </td>';
            //    html += '               </tr>';
            //}


            //// 6-5-2023
            //html += '               <tr>';
            //html += '                   <td id="spanDisplaySentEmailButton" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayIncomingEmails\');">';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">✉</span> Incoming</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Emails sent to you from an external source.</span>';
            //html += '                   </td>';
            //html += '               </tr>';



            //html += '               <tr>';
            //html += '                   <td id="spanDisplaySentEmailButton" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displaySentEmails\');">';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">✉</span> Inbox</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Emails sent to you.</span>';
            //html += '                   </td>';
            //html += '               </tr>';

            //html += '               <tr>';
            //html += '                   <td id="spanDisplayPendingEmailButton" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayPendingEmailsxxxx\');" >';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">✉</span> Sent</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Emails you have sent. *beta</span>';
            //html += '                   </td>';
            //html += '               </tr>';

            //html += '               <tr>';
            //html += '                   <td id="spanDisplayPendingEmailButton" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayPendingEmails\');" >';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">✉</span> Pending Inbox</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Emails waiting to be sent to you.</span>';
            //html += '                   </td>';
            //html += '               </tr>';

            //html += '               <tr>';
            //html += '                   <td id="spanDisplayPendingEmailButton" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayPendingEmails\');" >';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage"><img src="/images/trashbin.png"></span> TrashBin (Inbox)</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Emails you have deleted.</span>';
            //html += '                   </td>';
            //html += '               </tr>';

            //html += '               <tr>';
            //html += '                   <td id="spanDisplayPendingEmailButtonxxx" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayPendingEmailsxxx\');" >';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">☎</span> Sent Text Message(s)</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Text Messages sent to you.</span>';
            //html += '                   </td>';
            //html += '               </tr>';
            //html += '               <tr>';
            //html += '                   <td id="spanDisplayPendingEmailButtonxxx" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayPendingEmailsxxx\');" >';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">☎</span> Pending Text Message(s)</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Text Messages waiting to be sent to you.</span>';
            //html += '                   </td>';
            //html += '               </tr>';
            //html += '           </table>';
            //html += '       </td>';
            //html += '   </tr>';
            //html += '</table>';
            //// end: Left-most column.

            //html += '                   </td>';
            html += '                   <td xcx="xcx222" style="vertical-align:top;">';

            // Middle column.
            html += '<table>';
            html += '   <tr>';
            html += '       <td style="width:350px;height:50px;text-align:left;background-color:white;margin:10px 20px 10px -3px;">';
            html += '           <span id="spanSelectedEmailType_Title" style="height:30px;font-size:15pt;font-weight:bold;">[spanSelectedEmailType_Title]</span>';
            html += '       </td>';
            html += '   </tr>';
            html += '   <tr>';
            html += '       <td>';
            //html += '           <div xcx="xcx21323663" style="width:460px;height:600px;overflow-y: scroll;overflow-x:hidden;">'; // The width is set here for the email list... 2-9-2022
            html += '               <span id="spanEmailPicker"></span>';
            //html += '           </div>';
            html += '       </td>';
            html += '   </tr>';
            html += '</table>';
            // end: Middle column.

            html += '                   </td>';
            html += '                   <td xcx="xcx333-2" style="vertical-align:top;">';

            // Right column.
            html += '<table style="width:100%;">';
            html += '   <tr>';
            html += '       <td>';
            html += '           <div id="divEmailClient_CompositionWindow">';
            //html += '               <span id="spanSelectedEmail_From" style="font-size:13pt;font-weight:bold;color:#95b1d3;">[spanSelectedEmail_From]</span>';
            //html += '               <br />';
            html += '               <span id="spanSelectedEmailSubject" style="font-size:13pt;font-weight:bold;color:#95b1d3;"></span>';
            html += '               <br />';
            html += '               <span id="spanSelectedEmail"></span>';
            html += '           </div>';
            html += '       </td>';
            html += '   </tr>';
            html += '</table>';
            // end: Right column.

            html += '                   </td>';

            html += '               </tr>';


            html += '           </tbody>';
            html += '       </table>';
            html += '   </td>';
            html += '</tr>';
            // end: This is the 3-column main display of the mail client.


            html += '               </tbody>';
            html += '           </table>';

            html += '       </td>';
            html += '   </tr>';
            html += '</table>';

            // Render the html.
            $('#divPageContent3').html(html);


















            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            if (bwWorkflowAppId != 'all') {
                bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            }

            //this.options.pagingPage_SentEmail = 0; // If we want items to display properly, these need to be reset/set back to the beginning here.
            //this.options.pagingLimit_SentEmail = 20;

            $('#spanSelectedEmailSubject').html('');

            try {
                var html = '';

                // Display the top buttons.
                html += '                           <span class="emailEditor_topbarbutton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\');">';
                html += '                               <img title="Delete..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx123468" />&nbsp;Delete';
                html += '                           </span>';
                html += '&nbsp;&nbsp;';
                html += '                           <span class="emailEditor_topbarbutton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\', \'emptyfolder\');">';
                html += '                               <img title="Empty folder..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx23423467898">&nbsp;Empty folder';
                html += '                           </span>';
                $(thiz.element).find('#spanSelectedEmailType_TopButtons')[0].innerHTML = html; //'Pending Email';

                // Display the radio button and the title.
                html = '';
                html += '<input type="checkbox" id="checkboxToggleSentEmailCheckboxes" onchange="$(\'.bwConfiguration\').bwConfiguration(\'toggleSentEmailCheckboxes\', this);" />&nbsp;&nbsp;';
                html += '✉ Sent Items';

                $(thiz.element).find('#spanSelectedEmailType_Title')[0].innerHTML = html; //'Sent Email';

                // Make this button appear selected.
                $(thiz.element).find('#spanDisplaySentEmailButton').removeClass('bwConfiguration_LeftMenuButton').addClass('bwConfiguration_LeftMenuButton_Selected');
                $(thiz.element).find('#spanDisplayPendingEmailButton').removeClass('bwConfiguration_LeftMenuButton_Selected').addClass('bwConfiguration_LeftMenuButton');

            } catch (e) { }

            // Clear these in the beginning, because it may take a few seconds to re-populate, and this gives the user some visual feedback that something is going on.
            $(thiz.element).find('#spanEmailPicker')[0].innerHTML = '';
            $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '';

            console.log('xcx2313555. In bwConfiguration.js.loadAndRenderEmails_Sent(). Calling GET ' + webserviceurl + '/participantemail_inbox/ this.options.OnlyDisplayEmailsForCurrentParticipant: ' + this.options.OnlyDisplayEmailsForCurrentParticipant);

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                bwWorkflowAppId: workflowAppId,
                bwParticipantId: participantId
            };

            $.ajax({
                url: this.options.operationUriPrefix + "_bw/participantemail_sent",
                type: "POST",
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (results) {
                    try {

                        if (results.status != 'SUCCESS') {

                            var msg = results.status + ': ' + results.message;
                            console.log(msg);
                            displayAlertDialog(msg);

                            thiz.element.html(''); // This actually works to get rid of the qidget. Ha! 11-8-2023.

                        } else {

                            thiz.options.Sent = results.results;

                            thiz.renderEmails_Sent();

                        }

                    } catch (e) {
                        console.log('Exception in bwConfiguration.js.loadAndRenderEmails_Sent():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwConfiguration.js.loadAndRenderEmails_Sent():2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in bwConfiguration.js.loadAndRenderEmails_Sent():' + errorCode + ', ' + errorMessage);
                    displayAlertDialog('Error in bwConfiguration.js.loadAndRenderEmails_Sent():' + errorCode + ', ' + errorMessage);
                }
            });

        } catch (e) {
            console.log('Exception in loadAndRenderEmails_Sent(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in loadAndRenderEmails_Sent(): ' + e.message + ', ' + e.stack);
        }
    },

    loadAndRenderEmails_Drafts: function (bwWorkflowAppId) {
        try {
            console.log('In bwConfiguration.js.loadAndRenderEmails_Drafts().');
            alert('In bwConfiguration.js.loadAndRenderEmails_Drafts().');
            var thiz = this;

            $('#divPageContent2_Title').html('✉&nbsp;DRAFTS');


            // Select the HOME button here. 1-4-2024.
            var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');

            var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

            // Step 1: Make all of the buttons un-selected.
            $('.bwConfiguration:first').find('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
            });

            // Step 2: Set the specified button as the selected one.
            $('#divInnerLeftMenuButton_Inbox').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);

            //
            // Rendering the layout, within the divPageContent3 element.
            //

            var html = '';

            html += '<style>';
            html += '   .bwConfiguration_LeftMenuButton {';
            html += '       font-size:14pt;white-space:nowrap;cursor:pointer;padding:10px 40px 10px 40px;'; // T R B L
            html += '   }';
            html += '   .bwConfiguration_LeftMenuButton:hover {';
            html += '       cursor:pointer;background-color:lightgray;';
            html += '   }';
            html += '   .bwConfiguration_LeftMenuButton_Selected {';
            html += '       font-size:14pt;white-space:nowrap;cursor:pointer;padding:10px 40px 10px 40px;background-color:#DEECF9;';
            html += '   }';
            html += '   .bwConfiguration_LeftMenuButton_UnicodeImage {';
            html += '       font-size:30px;color:gray;'; // T L B R
            html += '   }';

            html += '   .bwConfiguration_InnerLeftMenuButton {';
            html += '       font-size:14pt;white-space:nowrap;cursor:pointer;padding:10px 40px 10px 40px;'; // T R B L
            // border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px; <<< This is the style attribute values in the code.
            html += '   }';
            html += '   .bwConfiguration_InnerLeftMenuButton:hover {';
            html += '       cursor:pointer;background-color:aliceblue;';
            html += '   }';

            html += '   .bwConfiguration_InnerLeftMenuButton_Selected {';
            //html += '       font-size:14pt;white-space:nowrap;cursor:pointer;padding:10px 40px 10px 40px;';
            html += '       cursor:pointer;background-color:aliceblue;';
            html += '   }';



            html += '   .bwConfiguration_Trashbin {';
            html += '       cursor:pointer;background-color:aliceblue;'; // T R B L
            html += '   }';
            html += '   .bwConfiguration_Trashbin:hover {';
            html += '       cursor:pointer;background-color:salmon;color:tomato;';
            html += '   }';



            html += '</style>';

            html += '<div style="display:none;border: 2px solid yellow;" id="divBwEmailMonitor_DeletePendingEmailsDialog">';
            html += '   <table style="width:100%;">';
            html += '       <tr>';
            html += '           <td style="width:90%;">';
            html += '               <span id="spanDeletePendingEmailsDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">Delete Emails</span>';
            html += '           </td>';
            html += '           <td style="width:9%;"></td>';
            html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divBwEmailMonitor_DeletePendingEmailsDialog\').dialog(\'close\');">X</span>';
            html += '           </td>';
            html += '       </tr>';
            html += '   </table>';
            html += '   <br /><br />';
            html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '   <span id="spanBwEmailMonitor_DeletePendingEmailsDialogContentText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;">';
            html += '[spanBwEmailMonitor_DeletePendingEmailsDialogContentText]';
            html += '   </span>';
            html += '   <br /><br /><br />';
            //html += '   <div id="divBwEmailMonitor_DeleteThePendingEmails" class="divSignInButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'deleteSelectedPendingEmails\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
            html += '   <div id="divBwEmailMonitor_DeleteThePendingEmails" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
            html += '       Delete the Pending Emails';
            html += '   </div>';
            html += '   <br /><br />';
            html += '   <div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em; font-weight: bold;" onclick="$(\'#divBwEmailMonitor_DeletePendingEmailsDialog\').dialog(\'close\');">';
            html += '       Cancel';
            html += '   </div>';
            html += '   <br /><br />';
            html += '</div>';

            //html += '<div style="display:none;border: 2px solid yellow;" id="divBwEmailMonitor_DeleteSentEmailsDialog">';
            //html += '   <table style="width:100%;">';
            //html += '       <tr>';
            //html += '           <td style="width:90%;">';
            //html += '               <span id="spanDeleteSentEmailsDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">Delete Emails</span>';
            //html += '           </td>';
            //html += '           <td style="width:9%;"></td>';
            //html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
            //html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divBwEmailMonitor_DeleteSentEmailsDialog\').dialog(\'close\');">X</span>';
            //html += '           </td>';
            //html += '       </tr>';
            //html += '   </table>';
            //html += '   <br /><br />';
            //html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            //html += '   <span id="spanBwEmailMonitor_DeleteSentEmailsDialogContentText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;">';
            //html += '[spanBwEmailMonitor_DeleteSentEmailsDialogContentText]';
            //html += '   </span>';
            //html += '   <br /><br /><br />';
            ////html += '   <div id="divBwEmailMonitor_DeleteTheSentEmails" class="divSignInButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'deleteSelectedSentEmails\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" >';
            //html += '   <div id="divBwEmailMonitor_DeleteTheSentEmails" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" >';
            //html += '       Delete the Sent Emails';
            //html += '   </div>';
            //html += '   <br /><br />';
            //html += '   <div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em; font-weight: bold;" onclick="$(\'#divBwEmailMonitor_DeleteSentEmailsDialog\').dialog(\'close\');">';
            //html += '       Cancel';
            //html += '   </div>';
            //html += '   <br /><br />';
            //html += '</div>';

            html += '<table style="width:100%;" xcx="xcx232536">';
            html += '   <tr>';
            html += '       <td style="width:100%;">';
            html += '           <div id="displayedemaildetails" bwPendingEmailId="" bwSentEmailId="" bwerrororsuggestionid=""></div>'; // This is where we look when we want to know the type and GUID of the displayed email!

            html += '           <table style="width:100%;">';
            html += '               <colgroup>';
            html += '                   <col style="WIDTH:3%;" />';
            html += '                   <col style="WIDTH:2%;" />';
            html += '                   <col style="WIDTH:5%;" />';
            html += '                   <col style="WIDTH:5%;" />';
            html += '                   <col style="WIDTH:5%;" />';
            html += '                   <col style="WIDTH:5%;" />';
            html += '                   <col style="WIDTH:90%;" />';
            html += '               </colgroup>';
            html += '               <tbody>';
            html += '                       <tr>';
            html += '                           <td>';
            //html += '                           <span class="emailEditor_newMessageButton" onclick="alert(\'This functionality is incomplete. Coming soon! xcx664993-2\');">'; //
            //html += '                               &nbsp;✉&nbsp;New message&nbsp;';
            //html += '                           </span>';
            html += '                           </td>';
            html += '                           <td colspan="6">';
            //html += '                               <span id="spanSelectedEmailType_TopButtons" style="font-size:13pt;font-weight:normal;">[spanSelectedEmailType_TopButtons]</span>';
            html += '                           </td>';
            html += '                       </tr>';

            html += '                       <tr style="font-size:10pt;font-weight:normal;color:black;">';
            html += '                           <td>';
            html += '                           </td>';
            html += '                           <td></td>';
            html += '                           <td colspan="4">';
            html += '                           </td>';
            html += '                           <td style="text-align:right;width:97%;">';

            var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');
            if (developerModeEnabled == true) {
                html += '                               <span class="spanButton" title="Click to send this email now!" onclick="$(\'.bwConfiguration\').bwConfiguration(\'sendPendingEmailNow\');">';
                html += '                                   ✉&nbsp;Send Now > xcx1';
                html += '                               </span>';
            }

            html += '                           </td>';
            html += '                       </tr>';

            //
            // This is the 3-column main display of the mail client.
            //
            html += '<tr>';
            html += '   <td colspan="7" style="width:100%;">';
            html += '       <table style="width:100%;">';
            html += '           <colgroup>';
            //html += '               <col style="WIDTH:23%;" />';
            html += '               <col style="WIDTH:25%;" />';
            html += '               <col style="WIDTH:62%;" />';
            html += '           </colgroup>';
            html += '           <tbody>';
            html += '               <tr>';
            //html += '                   <td xcx="xcx111">';
            ////html += 'xcx111';
            //html += '                       <span class="emailEditor_newMessageButton" onclick="$(\'.bwConfiguration:first\').bwConfiguration(\'composeANewEmailMessage\');">'; //
            //html += '                           &nbsp;✉&nbsp;New message&nbsp;';
            //html += '                       </span>';
            //html += '                   </td>';
            html += '                   <td xcx="xcx222">';
            //html += 'xcx222';
            html += '                       <span id="spanSelectedEmailType_TopButtons" style="font-size:13pt;font-weight:normal;">[spanSelectedEmailType_TopButtons]</span>';
            html += '                   </td>';
            html += '                   <td xcx="xcx333-1">';
            //html += 'xcx333';


            html += '<span id="" style="float:right;white-space:nowrap;">   Search:    <span id="searchbox">       <input type="text" id="inputBwAuthentication_SearchBox" onkeydown="$(\'.bwConfiguration\').bwConfiguration(\'searchBox_OnKeyDown\', event);" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;">       &nbsp;&nbsp;       <span class="emailEditor_newMessageButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'search\');">Search</span>   </span></span>';







            html += '                   </td>';
            html += '               </tr>';


            html += '               <tr>';
            //html += '                   <td xcx="xcx111" style="vertical-align:top;">';

            //// Left-most column.
            //html += '<table>';
            //html += '   <tr>';
            //html += '       <td id="tdDisplayPendingEmailButton">';
            //html += '       </td>';
            //html += '   </tr>';
            //html += '   <tr>';
            //html += '       <td>';
            //html += '           <table>';

            //if (developerModeEnabled == true) {
            //    html += '               <tr>';
            //    html += '                   <td id="spanDisplayAIConversationButton" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayAIConversation\');">';
            //    html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">🔊</span> AI Conversation</span>';
            //    html += '                       </br>';
            //    html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">The system engages you in a </br>conversation about the </br>requests that you are </br>involved with.</span>';
            //    html += '                   </td>';
            //    html += '               </tr>';
            //}


            //// 6-5-2023
            //html += '               <tr>';
            //html += '                   <td id="spanDisplaySentEmailButton" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayIncomingEmails\');">';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">✉</span> Incoming</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Emails sent to you from an external source.</span>';
            //html += '                   </td>';
            //html += '               </tr>';



            //html += '               <tr>';
            //html += '                   <td id="spanDisplaySentEmailButton" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displaySentEmails\');">';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">✉</span> Inbox</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Emails sent to you.</span>';
            //html += '                   </td>';
            //html += '               </tr>';

            //html += '               <tr>';
            //html += '                   <td id="spanDisplayPendingEmailButton" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayPendingEmailsxxxx\');" >';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">✉</span> Sent</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Emails you have sent. *beta</span>';
            //html += '                   </td>';
            //html += '               </tr>';

            //html += '               <tr>';
            //html += '                   <td id="spanDisplayPendingEmailButton" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayPendingEmails\');" >';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">✉</span> Pending Inbox</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Emails waiting to be sent to you.</span>';
            //html += '                   </td>';
            //html += '               </tr>';

            //html += '               <tr>';
            //html += '                   <td id="spanDisplayPendingEmailButton" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayPendingEmails\');" >';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage"><img src="/images/trashbin.png"></span> TrashBin (Inbox)</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Emails you have deleted.</span>';
            //html += '                   </td>';
            //html += '               </tr>';

            //html += '               <tr>';
            //html += '                   <td id="spanDisplayPendingEmailButtonxxx" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayPendingEmailsxxx\');" >';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">☎</span> Sent Text Message(s)</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Text Messages sent to you.</span>';
            //html += '                   </td>';
            //html += '               </tr>';
            //html += '               <tr>';
            //html += '                   <td id="spanDisplayPendingEmailButtonxxx" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayPendingEmailsxxx\');" >';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">☎</span> Pending Text Message(s)</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Text Messages waiting to be sent to you.</span>';
            //html += '                   </td>';
            //html += '               </tr>';
            //html += '           </table>';
            //html += '       </td>';
            //html += '   </tr>';
            //html += '</table>';
            //// end: Left-most column.

            //html += '                   </td>';
            html += '                   <td xcx="xcx222" style="vertical-align:top;">';

            // Middle column.
            html += '<table>';
            html += '   <tr>';
            html += '       <td style="width:350px;height:50px;text-align:left;background-color:white;margin:10px 20px 10px -3px;">';
            html += '           <span id="spanSelectedEmailType_Title" style="height:30px;font-size:15pt;font-weight:bold;">[spanSelectedEmailType_Title]</span>';
            html += '       </td>';
            html += '   </tr>';
            html += '   <tr>';
            html += '       <td>';
            //html += '           <div xcx="xcx21323663" style="width:460px;height:600px;overflow-y: scroll;overflow-x:hidden;">'; // The width is set here for the email list... 2-9-2022
            html += '               <span id="spanEmailPicker"></span>';
            //html += '           </div>';
            html += '       </td>';
            html += '   </tr>';
            html += '</table>';
            // end: Middle column.

            html += '                   </td>';
            html += '                   <td xcx="xcx333-2" style="vertical-align:top;">';

            // Right column.
            html += '<table style="width:100%;">';
            html += '   <tr>';
            html += '       <td>';
            html += '           <div id="divEmailClient_CompositionWindow">';
            //html += '               <span id="spanSelectedEmail_From" style="font-size:13pt;font-weight:bold;color:#95b1d3;">[spanSelectedEmail_From]</span>';
            //html += '               <br />';
            html += '               <span id="spanSelectedEmailSubject" style="font-size:13pt;font-weight:bold;color:#95b1d3;"></span>';
            html += '               <br />';
            html += '               <span id="spanSelectedEmail"></span>';
            html += '           </div>';
            html += '       </td>';
            html += '   </tr>';
            html += '</table>';
            // end: Right column.

            html += '                   </td>';

            html += '               </tr>';


            html += '           </tbody>';
            html += '       </table>';
            html += '   </td>';
            html += '</tr>';
            // end: This is the 3-column main display of the mail client.


            html += '               </tbody>';
            html += '           </table>';

            html += '       </td>';
            html += '   </tr>';
            html += '</table>';

            // Render the html.
            $('#divPageContent3').html(html);


















            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            if (bwWorkflowAppId != 'all') {
                bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            }

            //this.options.pagingPage_SentEmail = 0; // If we want items to display properly, these need to be reset/set back to the beginning here.
            //this.options.pagingLimit_SentEmail = 20;

            $('#spanSelectedEmailSubject').html('');

            try {
                var html = '';

                // Display the top buttons.
                html += '                           <span class="emailEditor_topbarbutton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\');">';
                html += '                               <img title="Delete..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx123468" />&nbsp;Delete';
                html += '                           </span>';
                html += '&nbsp;&nbsp;';
                html += '                           <span class="emailEditor_topbarbutton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\', \'emptyfolder\');">';
                html += '                               <img title="Empty folder..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx23423467898">&nbsp;Empty folder';
                html += '                           </span>';
                $(thiz.element).find('#spanSelectedEmailType_TopButtons')[0].innerHTML = html; //'Pending Email';

                // Display the radio button and the title.
                html = '';
                html += '<input type="checkbox" id="checkboxToggleSentEmailCheckboxes" onchange="$(\'.bwConfiguration\').bwConfiguration(\'toggleSentEmailCheckboxes\', this);" />&nbsp;&nbsp;';
                html += '✉ Draft Items';

                $(thiz.element).find('#spanSelectedEmailType_Title')[0].innerHTML = html; //'Sent Email';

                // Make this button appear selected.
                $(thiz.element).find('#spanDisplaySentEmailButton').removeClass('bwConfiguration_LeftMenuButton').addClass('bwConfiguration_LeftMenuButton_Selected');
                $(thiz.element).find('#spanDisplayPendingEmailButton').removeClass('bwConfiguration_LeftMenuButton_Selected').addClass('bwConfiguration_LeftMenuButton');

            } catch (e) { }

            // Clear these in the beginning, because it may take a few seconds to re-populate, and this gives the user some visual feedback that something is going on.
            $(thiz.element).find('#spanEmailPicker')[0].innerHTML = '';
            $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '';

            console.log('xcx2313555. In bwConfiguration.js.loadAndRenderEmails_Drafts(). Calling GET ' + webserviceurl + '/participantemail_inbox/ this.options.OnlyDisplayEmailsForCurrentParticipant: ' + this.options.OnlyDisplayEmailsForCurrentParticipant);

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                bwWorkflowAppId: workflowAppId,
                bwParticipantId: participantId
            };

            $.ajax({
                url: this.options.operationUriPrefix + "_bw/participantemail_trashbin",
                type: "POST",
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (results) {
                    try {

                        if (results.status != 'SUCCESS') {

                            var msg = results.status + ': ' + results.message;
                            console.log(msg);
                            displayAlertDialog(msg);

                            thiz.element.html(''); // This actually works to get rid of the qidget. Ha! 11-8-2023.

                        } else {

                            thiz.options.TrashBin = results.results;

                            thiz.renderEmails_TrashBin();

                        }

                    } catch (e) {
                        console.log('Exception in bwConfiguration.js.loadAndRenderEmails_Drafts():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwConfiguration.js.loadAndRenderEmails_Drafts():2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in bwConfiguration.js.loadAndRenderEmails_Drafts():' + errorCode + ', ' + errorMessage);
                    displayAlertDialog('Error in bwConfiguration.js.loadAndRenderEmails_Drafts():' + errorCode + ', ' + errorMessage);
                }
            });

        } catch (e) {
            console.log('Exception in loadAndRenderEmails_Drafts(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in loadAndRenderEmails_Drafts(): ' + e.message + ', ' + e.stack);
        }
    },

    loadAndRenderEmails_Junk: function (bwWorkflowAppId) {
        try {
            console.log('In bwConfiguration.js.loadAndRenderEmails_Junk().');
            alert('In bwConfiguration.js.loadAndRenderEmails_Junk().');
            var thiz = this;

            $('#divPageContent2_Title').html('✉&nbsp;JUNK');


            // Select the HOME button here. 1-4-2024.
            var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');

            var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

            // Step 1: Make all of the buttons un-selected.
            $('.bwConfiguration:first').find('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
            });

            // Step 2: Set the specified button as the selected one.
            $('#divInnerLeftMenuButton_Inbox').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);

            //
            // Rendering the layout, within the divPageContent3 element.
            //

            var html = '';

            html += '<style>';
            html += '   .bwConfiguration_LeftMenuButton {';
            html += '       font-size:14pt;white-space:nowrap;cursor:pointer;padding:10px 40px 10px 40px;'; // T R B L
            html += '   }';
            html += '   .bwConfiguration_LeftMenuButton:hover {';
            html += '       cursor:pointer;background-color:lightgray;';
            html += '   }';
            html += '   .bwConfiguration_LeftMenuButton_Selected {';
            html += '       font-size:14pt;white-space:nowrap;cursor:pointer;padding:10px 40px 10px 40px;background-color:#DEECF9;';
            html += '   }';
            html += '   .bwConfiguration_LeftMenuButton_UnicodeImage {';
            html += '       font-size:30px;color:gray;'; // T L B R
            html += '   }';

            html += '   .bwConfiguration_InnerLeftMenuButton {';
            html += '       font-size:14pt;white-space:nowrap;cursor:pointer;padding:10px 40px 10px 40px;'; // T R B L
            // border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px; <<< This is the style attribute values in the code.
            html += '   }';
            html += '   .bwConfiguration_InnerLeftMenuButton:hover {';
            html += '       cursor:pointer;background-color:aliceblue;';
            html += '   }';

            html += '   .bwConfiguration_InnerLeftMenuButton_Selected {';
            //html += '       font-size:14pt;white-space:nowrap;cursor:pointer;padding:10px 40px 10px 40px;';
            html += '       cursor:pointer;background-color:aliceblue;';
            html += '   }';



            html += '   .bwConfiguration_Trashbin {';
            html += '       cursor:pointer;background-color:aliceblue;'; // T R B L
            html += '   }';
            html += '   .bwConfiguration_Trashbin:hover {';
            html += '       cursor:pointer;background-color:salmon;color:tomato;';
            html += '   }';



            html += '</style>';

            html += '<div style="display:none;border: 2px solid yellow;" id="divBwEmailMonitor_DeletePendingEmailsDialog">';
            html += '   <table style="width:100%;">';
            html += '       <tr>';
            html += '           <td style="width:90%;">';
            html += '               <span id="spanDeletePendingEmailsDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">Delete Emails</span>';
            html += '           </td>';
            html += '           <td style="width:9%;"></td>';
            html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divBwEmailMonitor_DeletePendingEmailsDialog\').dialog(\'close\');">X</span>';
            html += '           </td>';
            html += '       </tr>';
            html += '   </table>';
            html += '   <br /><br />';
            html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '   <span id="spanBwEmailMonitor_DeletePendingEmailsDialogContentText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;">';
            html += '[spanBwEmailMonitor_DeletePendingEmailsDialogContentText]';
            html += '   </span>';
            html += '   <br /><br /><br />';
            //html += '   <div id="divBwEmailMonitor_DeleteThePendingEmails" class="divSignInButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'deleteSelectedPendingEmails\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
            html += '   <div id="divBwEmailMonitor_DeleteThePendingEmails" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
            html += '       Delete the Pending Emails';
            html += '   </div>';
            html += '   <br /><br />';
            html += '   <div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em; font-weight: bold;" onclick="$(\'#divBwEmailMonitor_DeletePendingEmailsDialog\').dialog(\'close\');">';
            html += '       Cancel';
            html += '   </div>';
            html += '   <br /><br />';
            html += '</div>';

            //html += '<div style="display:none;border: 2px solid yellow;" id="divBwEmailMonitor_DeleteSentEmailsDialog">';
            //html += '   <table style="width:100%;">';
            //html += '       <tr>';
            //html += '           <td style="width:90%;">';
            //html += '               <span id="spanDeleteSentEmailsDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">Delete Emails</span>';
            //html += '           </td>';
            //html += '           <td style="width:9%;"></td>';
            //html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
            //html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divBwEmailMonitor_DeleteSentEmailsDialog\').dialog(\'close\');">X</span>';
            //html += '           </td>';
            //html += '       </tr>';
            //html += '   </table>';
            //html += '   <br /><br />';
            //html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            //html += '   <span id="spanBwEmailMonitor_DeleteSentEmailsDialogContentText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;">';
            //html += '[spanBwEmailMonitor_DeleteSentEmailsDialogContentText]';
            //html += '   </span>';
            //html += '   <br /><br /><br />';
            ////html += '   <div id="divBwEmailMonitor_DeleteTheSentEmails" class="divSignInButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'deleteSelectedSentEmails\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" >';
            //html += '   <div id="divBwEmailMonitor_DeleteTheSentEmails" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" >';
            //html += '       Delete the Sent Emails';
            //html += '   </div>';
            //html += '   <br /><br />';
            //html += '   <div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em; font-weight: bold;" onclick="$(\'#divBwEmailMonitor_DeleteSentEmailsDialog\').dialog(\'close\');">';
            //html += '       Cancel';
            //html += '   </div>';
            //html += '   <br /><br />';
            //html += '</div>';

            html += '<table style="width:100%;" xcx="xcx232536">';
            html += '   <tr>';
            html += '       <td style="width:100%;">';
            html += '           <div id="displayedemaildetails" bwPendingEmailId="" bwSentEmailId="" bwerrororsuggestionid=""></div>'; // This is where we look when we want to know the type and GUID of the displayed email!

            html += '           <table style="width:100%;">';
            html += '               <colgroup>';
            html += '                   <col style="WIDTH:3%;" />';
            html += '                   <col style="WIDTH:2%;" />';
            html += '                   <col style="WIDTH:5%;" />';
            html += '                   <col style="WIDTH:5%;" />';
            html += '                   <col style="WIDTH:5%;" />';
            html += '                   <col style="WIDTH:5%;" />';
            html += '                   <col style="WIDTH:90%;" />';
            html += '               </colgroup>';
            html += '               <tbody>';
            html += '                       <tr>';
            html += '                           <td>';
            //html += '                           <span class="emailEditor_newMessageButton" onclick="alert(\'This functionality is incomplete. Coming soon! xcx664993-2\');">'; //
            //html += '                               &nbsp;✉&nbsp;New message&nbsp;';
            //html += '                           </span>';
            html += '                           </td>';
            html += '                           <td colspan="6">';
            //html += '                               <span id="spanSelectedEmailType_TopButtons" style="font-size:13pt;font-weight:normal;">[spanSelectedEmailType_TopButtons]</span>';
            html += '                           </td>';
            html += '                       </tr>';

            html += '                       <tr style="font-size:10pt;font-weight:normal;color:black;">';
            html += '                           <td>';
            html += '                           </td>';
            html += '                           <td></td>';
            html += '                           <td colspan="4">';
            html += '                           </td>';
            html += '                           <td style="text-align:right;width:97%;">';

            var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');
            if (developerModeEnabled == true) {
                html += '                               <span class="spanButton" title="Click to send this email now!" onclick="$(\'.bwConfiguration\').bwConfiguration(\'sendPendingEmailNow\');">';
                html += '                                   ✉&nbsp;Send Now > xcx1';
                html += '                               </span>';
            }

            html += '                           </td>';
            html += '                       </tr>';

            //
            // This is the 3-column main display of the mail client.
            //
            html += '<tr>';
            html += '   <td colspan="7" style="width:100%;">';
            html += '       <table style="width:100%;">';
            html += '           <colgroup>';
            //html += '               <col style="WIDTH:23%;" />';
            html += '               <col style="WIDTH:25%;" />';
            html += '               <col style="WIDTH:62%;" />';
            html += '           </colgroup>';
            html += '           <tbody>';
            html += '               <tr>';
            //html += '                   <td xcx="xcx111">';
            ////html += 'xcx111';
            //html += '                       <span class="emailEditor_newMessageButton" onclick="$(\'.bwConfiguration:first\').bwConfiguration(\'composeANewEmailMessage\');">'; //
            //html += '                           &nbsp;✉&nbsp;New message&nbsp;';
            //html += '                       </span>';
            //html += '                   </td>';
            html += '                   <td xcx="xcx222">';
            //html += 'xcx222';
            html += '                       <span id="spanSelectedEmailType_TopButtons" style="font-size:13pt;font-weight:normal;">[spanSelectedEmailType_TopButtons]</span>';
            html += '                   </td>';
            html += '                   <td xcx="xcx333-1">';
            //html += 'xcx333';


            html += '<span id="" style="float:right;white-space:nowrap;">   Search:    <span id="searchbox">       <input type="text" id="inputBwAuthentication_SearchBox" onkeydown="$(\'.bwConfiguration\').bwConfiguration(\'searchBox_OnKeyDown\', event);" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;">       &nbsp;&nbsp;       <span class="emailEditor_newMessageButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'search\');">Search</span>   </span></span>';







            html += '                   </td>';
            html += '               </tr>';


            html += '               <tr>';
            //html += '                   <td xcx="xcx111" style="vertical-align:top;">';

            //// Left-most column.
            //html += '<table>';
            //html += '   <tr>';
            //html += '       <td id="tdDisplayPendingEmailButton">';
            //html += '       </td>';
            //html += '   </tr>';
            //html += '   <tr>';
            //html += '       <td>';
            //html += '           <table>';

            //if (developerModeEnabled == true) {
            //    html += '               <tr>';
            //    html += '                   <td id="spanDisplayAIConversationButton" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayAIConversation\');">';
            //    html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">🔊</span> AI Conversation</span>';
            //    html += '                       </br>';
            //    html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">The system engages you in a </br>conversation about the </br>requests that you are </br>involved with.</span>';
            //    html += '                   </td>';
            //    html += '               </tr>';
            //}


            //// 6-5-2023
            //html += '               <tr>';
            //html += '                   <td id="spanDisplaySentEmailButton" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayIncomingEmails\');">';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">✉</span> Incoming</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Emails sent to you from an external source.</span>';
            //html += '                   </td>';
            //html += '               </tr>';



            //html += '               <tr>';
            //html += '                   <td id="spanDisplaySentEmailButton" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displaySentEmails\');">';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">✉</span> Inbox</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Emails sent to you.</span>';
            //html += '                   </td>';
            //html += '               </tr>';

            //html += '               <tr>';
            //html += '                   <td id="spanDisplayPendingEmailButton" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayPendingEmailsxxxx\');" >';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">✉</span> Sent</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Emails you have sent. *beta</span>';
            //html += '                   </td>';
            //html += '               </tr>';

            //html += '               <tr>';
            //html += '                   <td id="spanDisplayPendingEmailButton" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayPendingEmails\');" >';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">✉</span> Pending Inbox</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Emails waiting to be sent to you.</span>';
            //html += '                   </td>';
            //html += '               </tr>';

            //html += '               <tr>';
            //html += '                   <td id="spanDisplayPendingEmailButton" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayPendingEmails\');" >';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage"><img src="/images/trashbin.png"></span> TrashBin (Inbox)</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Emails you have deleted.</span>';
            //html += '                   </td>';
            //html += '               </tr>';

            //html += '               <tr>';
            //html += '                   <td id="spanDisplayPendingEmailButtonxxx" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayPendingEmailsxxx\');" >';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">☎</span> Sent Text Message(s)</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Text Messages sent to you.</span>';
            //html += '                   </td>';
            //html += '               </tr>';
            //html += '               <tr>';
            //html += '                   <td id="spanDisplayPendingEmailButtonxxx" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayPendingEmailsxxx\');" >';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">☎</span> Pending Text Message(s)</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Text Messages waiting to be sent to you.</span>';
            //html += '                   </td>';
            //html += '               </tr>';
            //html += '           </table>';
            //html += '       </td>';
            //html += '   </tr>';
            //html += '</table>';
            //// end: Left-most column.

            //html += '                   </td>';
            html += '                   <td xcx="xcx222" style="vertical-align:top;">';

            // Middle column.
            html += '<table>';
            html += '   <tr>';
            html += '       <td style="width:350px;height:50px;text-align:left;background-color:white;margin:10px 20px 10px -3px;">';
            html += '           <span id="spanSelectedEmailType_Title" style="height:30px;font-size:15pt;font-weight:bold;">[spanSelectedEmailType_Title]</span>';
            html += '       </td>';
            html += '   </tr>';
            html += '   <tr>';
            html += '       <td>';
            //html += '           <div xcx="xcx21323663" style="width:460px;height:600px;overflow-y: scroll;overflow-x:hidden;">'; // The width is set here for the email list... 2-9-2022
            html += '               <span id="spanEmailPicker"></span>';
            //html += '           </div>';
            html += '       </td>';
            html += '   </tr>';
            html += '</table>';
            // end: Middle column.

            html += '                   </td>';
            html += '                   <td xcx="xcx333-2" style="vertical-align:top;">';

            // Right column.
            html += '<table style="width:100%;">';
            html += '   <tr>';
            html += '       <td>';
            html += '           <div id="divEmailClient_CompositionWindow">';
            //html += '               <span id="spanSelectedEmail_From" style="font-size:13pt;font-weight:bold;color:#95b1d3;">[spanSelectedEmail_From]</span>';
            //html += '               <br />';
            html += '               <span id="spanSelectedEmailSubject" style="font-size:13pt;font-weight:bold;color:#95b1d3;"></span>';
            html += '               <br />';
            html += '               <span id="spanSelectedEmail"></span>';
            html += '           </div>';
            html += '       </td>';
            html += '   </tr>';
            html += '</table>';
            // end: Right column.

            html += '                   </td>';

            html += '               </tr>';


            html += '           </tbody>';
            html += '       </table>';
            html += '   </td>';
            html += '</tr>';
            // end: This is the 3-column main display of the mail client.


            html += '               </tbody>';
            html += '           </table>';

            html += '       </td>';
            html += '   </tr>';
            html += '</table>';

            // Render the html.
            $('#divPageContent3').html(html);


















            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            if (bwWorkflowAppId != 'all') {
                bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            }

            //this.options.pagingPage_SentEmail = 0; // If we want items to display properly, these need to be reset/set back to the beginning here.
            //this.options.pagingLimit_SentEmail = 20;

            $('#spanSelectedEmailSubject').html('');

            try {
                var html = '';

                // Display the top buttons.
                html += '                           <span class="emailEditor_topbarbutton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\');">';
                html += '                               <img title="Delete..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx123468" />&nbsp;Delete';
                html += '                           </span>';
                html += '&nbsp;&nbsp;';
                html += '                           <span class="emailEditor_topbarbutton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\', \'emptyfolder\');">';
                html += '                               <img title="Empty folder..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx23423467898">&nbsp;Empty folder';
                html += '                           </span>';
                $(thiz.element).find('#spanSelectedEmailType_TopButtons')[0].innerHTML = html; //'Pending Email';

                // Display the radio button and the title.
                html = '';
                html += '<input type="checkbox" id="checkboxToggleSentEmailCheckboxes" onchange="$(\'.bwConfiguration\').bwConfiguration(\'toggleSentEmailCheckboxes\', this);" />&nbsp;&nbsp;';
                html += '✉ Junk Items';

                $(thiz.element).find('#spanSelectedEmailType_Title')[0].innerHTML = html; //'Sent Email';

                // Make this button appear selected.
                $(thiz.element).find('#spanDisplaySentEmailButton').removeClass('bwConfiguration_LeftMenuButton').addClass('bwConfiguration_LeftMenuButton_Selected');
                $(thiz.element).find('#spanDisplayPendingEmailButton').removeClass('bwConfiguration_LeftMenuButton_Selected').addClass('bwConfiguration_LeftMenuButton');

            } catch (e) { }

            // Clear these in the beginning, because it may take a few seconds to re-populate, and this gives the user some visual feedback that something is going on.
            $(thiz.element).find('#spanEmailPicker')[0].innerHTML = '';
            $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '';

            console.log('xcx2313555. In bwConfiguration.js.loadAndRenderEmails_Junk(). Calling GET ' + webserviceurl + '/participantemail_inbox/ this.options.OnlyDisplayEmailsForCurrentParticipant: ' + this.options.OnlyDisplayEmailsForCurrentParticipant);

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                bwWorkflowAppId: workflowAppId,
                bwParticipantId: participantId
            };

            $.ajax({
                url: this.options.operationUriPrefix + "_bw/participantemail_trashbin",
                type: "POST",
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (results) {
                    try {

                        if (results.status != 'SUCCESS') {

                            var msg = results.status + ': ' + results.message;
                            console.log(msg);
                            displayAlertDialog(msg);

                            thiz.element.html(''); // This actually works to get rid of the qidget. Ha! 11-8-2023.

                        } else {

                            thiz.options.TrashBin = results.results;

                            thiz.renderEmails_TrashBin();

                        }

                    } catch (e) {
                        console.log('Exception in bwConfiguration.js.loadAndRenderEmails_Junk():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwConfiguration.js.loadAndRenderEmails_Junk():2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in bwConfiguration.js.loadAndRenderEmails_Junk():' + errorCode + ', ' + errorMessage);
                    displayAlertDialog('Error in bwConfiguration.js.loadAndRenderEmails_Junk():' + errorCode + ', ' + errorMessage);
                }
            });

        } catch (e) {
            console.log('Exception in loadAndRenderEmails_Junk(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in loadAndRenderEmails_Junk(): ' + e.message + ', ' + e.stack);
        }
    },

    loadAndRenderEmails_Archived: function (bwWorkflowAppId) {
        try {
            console.log('In bwConfiguration.js.loadAndRenderEmails_Archived().');
            alert('In bwConfiguration.js.loadAndRenderEmails_Archived().');
            var thiz = this;

            $('#divPageContent2_Title').html('✉&nbsp;ARCHIVED');


            // Select the HOME button here. 1-4-2024.
            var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');

            var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

            // Step 1: Make all of the buttons un-selected.
            $('.bwConfiguration:first').find('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
            });

            // Step 2: Set the specified button as the selected one.
            $('#divInnerLeftMenuButton_Inbox').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);

            //
            // Rendering the layout, within the divPageContent3 element.
            //

            var html = '';

            html += '<style>';
            html += '   .bwConfiguration_LeftMenuButton {';
            html += '       font-size:14pt;white-space:nowrap;cursor:pointer;padding:10px 40px 10px 40px;'; // T R B L
            html += '   }';
            html += '   .bwConfiguration_LeftMenuButton:hover {';
            html += '       cursor:pointer;background-color:lightgray;';
            html += '   }';
            html += '   .bwConfiguration_LeftMenuButton_Selected {';
            html += '       font-size:14pt;white-space:nowrap;cursor:pointer;padding:10px 40px 10px 40px;background-color:#DEECF9;';
            html += '   }';
            html += '   .bwConfiguration_LeftMenuButton_UnicodeImage {';
            html += '       font-size:30px;color:gray;'; // T L B R
            html += '   }';

            html += '   .bwConfiguration_InnerLeftMenuButton {';
            html += '       font-size:14pt;white-space:nowrap;cursor:pointer;padding:10px 40px 10px 40px;'; // T R B L
            // border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px; <<< This is the style attribute values in the code.
            html += '   }';
            html += '   .bwConfiguration_InnerLeftMenuButton:hover {';
            html += '       cursor:pointer;background-color:aliceblue;';
            html += '   }';

            html += '   .bwConfiguration_InnerLeftMenuButton_Selected {';
            //html += '       font-size:14pt;white-space:nowrap;cursor:pointer;padding:10px 40px 10px 40px;';
            html += '       cursor:pointer;background-color:aliceblue;';
            html += '   }';



            html += '   .bwConfiguration_Trashbin {';
            html += '       cursor:pointer;background-color:aliceblue;'; // T R B L
            html += '   }';
            html += '   .bwConfiguration_Trashbin:hover {';
            html += '       cursor:pointer;background-color:salmon;color:tomato;';
            html += '   }';



            html += '</style>';

            html += '<div style="display:none;border: 2px solid yellow;" id="divBwEmailMonitor_DeletePendingEmailsDialog">';
            html += '   <table style="width:100%;">';
            html += '       <tr>';
            html += '           <td style="width:90%;">';
            html += '               <span id="spanDeletePendingEmailsDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">Delete Emails</span>';
            html += '           </td>';
            html += '           <td style="width:9%;"></td>';
            html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divBwEmailMonitor_DeletePendingEmailsDialog\').dialog(\'close\');">X</span>';
            html += '           </td>';
            html += '       </tr>';
            html += '   </table>';
            html += '   <br /><br />';
            html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '   <span id="spanBwEmailMonitor_DeletePendingEmailsDialogContentText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;">';
            html += '[spanBwEmailMonitor_DeletePendingEmailsDialogContentText]';
            html += '   </span>';
            html += '   <br /><br /><br />';
            //html += '   <div id="divBwEmailMonitor_DeleteThePendingEmails" class="divSignInButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'deleteSelectedPendingEmails\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
            html += '   <div id="divBwEmailMonitor_DeleteThePendingEmails" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
            html += '       Delete the Pending Emails';
            html += '   </div>';
            html += '   <br /><br />';
            html += '   <div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em; font-weight: bold;" onclick="$(\'#divBwEmailMonitor_DeletePendingEmailsDialog\').dialog(\'close\');">';
            html += '       Cancel';
            html += '   </div>';
            html += '   <br /><br />';
            html += '</div>';

            //html += '<div style="display:none;border: 2px solid yellow;" id="divBwEmailMonitor_DeleteSentEmailsDialog">';
            //html += '   <table style="width:100%;">';
            //html += '       <tr>';
            //html += '           <td style="width:90%;">';
            //html += '               <span id="spanDeleteSentEmailsDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">Delete Emails</span>';
            //html += '           </td>';
            //html += '           <td style="width:9%;"></td>';
            //html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
            //html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divBwEmailMonitor_DeleteSentEmailsDialog\').dialog(\'close\');">X</span>';
            //html += '           </td>';
            //html += '       </tr>';
            //html += '   </table>';
            //html += '   <br /><br />';
            //html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            //html += '   <span id="spanBwEmailMonitor_DeleteSentEmailsDialogContentText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;">';
            //html += '[spanBwEmailMonitor_DeleteSentEmailsDialogContentText]';
            //html += '   </span>';
            //html += '   <br /><br /><br />';
            ////html += '   <div id="divBwEmailMonitor_DeleteTheSentEmails" class="divSignInButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'deleteSelectedSentEmails\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" >';
            //html += '   <div id="divBwEmailMonitor_DeleteTheSentEmails" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" >';
            //html += '       Delete the Sent Emails';
            //html += '   </div>';
            //html += '   <br /><br />';
            //html += '   <div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em; font-weight: bold;" onclick="$(\'#divBwEmailMonitor_DeleteSentEmailsDialog\').dialog(\'close\');">';
            //html += '       Cancel';
            //html += '   </div>';
            //html += '   <br /><br />';
            //html += '</div>';

            html += '<table style="width:100%;" xcx="xcx232536">';
            html += '   <tr>';
            html += '       <td style="width:100%;">';
            html += '           <div id="displayedemaildetails" bwPendingEmailId="" bwSentEmailId="" bwerrororsuggestionid=""></div>'; // This is where we look when we want to know the type and GUID of the displayed email!

            html += '           <table style="width:100%;">';
            html += '               <colgroup>';
            html += '                   <col style="WIDTH:3%;" />';
            html += '                   <col style="WIDTH:2%;" />';
            html += '                   <col style="WIDTH:5%;" />';
            html += '                   <col style="WIDTH:5%;" />';
            html += '                   <col style="WIDTH:5%;" />';
            html += '                   <col style="WIDTH:5%;" />';
            html += '                   <col style="WIDTH:90%;" />';
            html += '               </colgroup>';
            html += '               <tbody>';
            html += '                       <tr>';
            html += '                           <td>';
            //html += '                           <span class="emailEditor_newMessageButton" onclick="alert(\'This functionality is incomplete. Coming soon! xcx664993-2\');">'; //
            //html += '                               &nbsp;✉&nbsp;New message&nbsp;';
            //html += '                           </span>';
            html += '                           </td>';
            html += '                           <td colspan="6">';
            //html += '                               <span id="spanSelectedEmailType_TopButtons" style="font-size:13pt;font-weight:normal;">[spanSelectedEmailType_TopButtons]</span>';
            html += '                           </td>';
            html += '                       </tr>';

            html += '                       <tr style="font-size:10pt;font-weight:normal;color:black;">';
            html += '                           <td>';
            html += '                           </td>';
            html += '                           <td></td>';
            html += '                           <td colspan="4">';
            html += '                           </td>';
            html += '                           <td style="text-align:right;width:97%;">';

            var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');
            if (developerModeEnabled == true) {
                html += '                               <span class="spanButton" title="Click to send this email now!" onclick="$(\'.bwConfiguration\').bwConfiguration(\'sendPendingEmailNow\');">';
                html += '                                   ✉&nbsp;Send Now > xcx1';
                html += '                               </span>';
            }

            html += '                           </td>';
            html += '                       </tr>';

            //
            // This is the 3-column main display of the mail client.
            //
            html += '<tr>';
            html += '   <td colspan="7" style="width:100%;">';
            html += '       <table style="width:100%;">';
            html += '           <colgroup>';
            //html += '               <col style="WIDTH:23%;" />';
            html += '               <col style="WIDTH:25%;" />';
            html += '               <col style="WIDTH:62%;" />';
            html += '           </colgroup>';
            html += '           <tbody>';
            html += '               <tr>';
            //html += '                   <td xcx="xcx111">';
            ////html += 'xcx111';
            //html += '                       <span class="emailEditor_newMessageButton" onclick="$(\'.bwConfiguration:first\').bwConfiguration(\'composeANewEmailMessage\');">'; //
            //html += '                           &nbsp;✉&nbsp;New message&nbsp;';
            //html += '                       </span>';
            //html += '                   </td>';
            html += '                   <td xcx="xcx222">';
            //html += 'xcx222';
            html += '                       <span id="spanSelectedEmailType_TopButtons" style="font-size:13pt;font-weight:normal;">[spanSelectedEmailType_TopButtons]</span>';
            html += '                   </td>';
            html += '                   <td xcx="xcx333-1">';
            //html += 'xcx333';


            html += '<span id="" style="float:right;white-space:nowrap;">   Search:    <span id="searchbox">       <input type="text" id="inputBwAuthentication_SearchBox" onkeydown="$(\'.bwConfiguration\').bwConfiguration(\'searchBox_OnKeyDown\', event);" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;">       &nbsp;&nbsp;       <span class="emailEditor_newMessageButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'search\');">Search</span>   </span></span>';







            html += '                   </td>';
            html += '               </tr>';


            html += '               <tr>';
            //html += '                   <td xcx="xcx111" style="vertical-align:top;">';

            //// Left-most column.
            //html += '<table>';
            //html += '   <tr>';
            //html += '       <td id="tdDisplayPendingEmailButton">';
            //html += '       </td>';
            //html += '   </tr>';
            //html += '   <tr>';
            //html += '       <td>';
            //html += '           <table>';

            //if (developerModeEnabled == true) {
            //    html += '               <tr>';
            //    html += '                   <td id="spanDisplayAIConversationButton" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayAIConversation\');">';
            //    html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">🔊</span> AI Conversation</span>';
            //    html += '                       </br>';
            //    html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">The system engages you in a </br>conversation about the </br>requests that you are </br>involved with.</span>';
            //    html += '                   </td>';
            //    html += '               </tr>';
            //}


            //// 6-5-2023
            //html += '               <tr>';
            //html += '                   <td id="spanDisplaySentEmailButton" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayIncomingEmails\');">';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">✉</span> Incoming</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Emails sent to you from an external source.</span>';
            //html += '                   </td>';
            //html += '               </tr>';



            //html += '               <tr>';
            //html += '                   <td id="spanDisplaySentEmailButton" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displaySentEmails\');">';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">✉</span> Inbox</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Emails sent to you.</span>';
            //html += '                   </td>';
            //html += '               </tr>';

            //html += '               <tr>';
            //html += '                   <td id="spanDisplayPendingEmailButton" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayPendingEmailsxxxx\');" >';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">✉</span> Sent</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Emails you have sent. *beta</span>';
            //html += '                   </td>';
            //html += '               </tr>';

            //html += '               <tr>';
            //html += '                   <td id="spanDisplayPendingEmailButton" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayPendingEmails\');" >';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">✉</span> Pending Inbox</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Emails waiting to be sent to you.</span>';
            //html += '                   </td>';
            //html += '               </tr>';

            //html += '               <tr>';
            //html += '                   <td id="spanDisplayPendingEmailButton" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayPendingEmails\');" >';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage"><img src="/images/trashbin.png"></span> TrashBin (Inbox)</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Emails you have deleted.</span>';
            //html += '                   </td>';
            //html += '               </tr>';

            //html += '               <tr>';
            //html += '                   <td id="spanDisplayPendingEmailButtonxxx" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayPendingEmailsxxx\');" >';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">☎</span> Sent Text Message(s)</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Text Messages sent to you.</span>';
            //html += '                   </td>';
            //html += '               </tr>';
            //html += '               <tr>';
            //html += '                   <td id="spanDisplayPendingEmailButtonxxx" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayPendingEmailsxxx\');" >';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">☎</span> Pending Text Message(s)</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Text Messages waiting to be sent to you.</span>';
            //html += '                   </td>';
            //html += '               </tr>';
            //html += '           </table>';
            //html += '       </td>';
            //html += '   </tr>';
            //html += '</table>';
            //// end: Left-most column.

            //html += '                   </td>';
            html += '                   <td xcx="xcx222" style="vertical-align:top;">';

            // Middle column.
            html += '<table>';
            html += '   <tr>';
            html += '       <td style="width:350px;height:50px;text-align:left;background-color:white;margin:10px 20px 10px -3px;">';
            html += '           <span id="spanSelectedEmailType_Title" style="height:30px;font-size:15pt;font-weight:bold;">[spanSelectedEmailType_Title]</span>';
            html += '       </td>';
            html += '   </tr>';
            html += '   <tr>';
            html += '       <td>';
            //html += '           <div xcx="xcx21323663" style="width:460px;height:600px;overflow-y: scroll;overflow-x:hidden;">'; // The width is set here for the email list... 2-9-2022
            html += '               <span id="spanEmailPicker"></span>';
            //html += '           </div>';
            html += '       </td>';
            html += '   </tr>';
            html += '</table>';
            // end: Middle column.

            html += '                   </td>';
            html += '                   <td xcx="xcx333-2" style="vertical-align:top;">';

            // Right column.
            html += '<table style="width:100%;">';
            html += '   <tr>';
            html += '       <td>';
            html += '           <div id="divEmailClient_CompositionWindow">';
            //html += '               <span id="spanSelectedEmail_From" style="font-size:13pt;font-weight:bold;color:#95b1d3;">[spanSelectedEmail_From]</span>';
            //html += '               <br />';
            html += '               <span id="spanSelectedEmailSubject" style="font-size:13pt;font-weight:bold;color:#95b1d3;"></span>';
            html += '               <br />';
            html += '               <span id="spanSelectedEmail"></span>';
            html += '           </div>';
            html += '       </td>';
            html += '   </tr>';
            html += '</table>';
            // end: Right column.

            html += '                   </td>';

            html += '               </tr>';


            html += '           </tbody>';
            html += '       </table>';
            html += '   </td>';
            html += '</tr>';
            // end: This is the 3-column main display of the mail client.


            html += '               </tbody>';
            html += '           </table>';

            html += '       </td>';
            html += '   </tr>';
            html += '</table>';

            // Render the html.
            $('#divPageContent3').html(html);


















            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            if (bwWorkflowAppId != 'all') {
                bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            }

            //this.options.pagingPage_SentEmail = 0; // If we want items to display properly, these need to be reset/set back to the beginning here.
            //this.options.pagingLimit_SentEmail = 20;

            $('#spanSelectedEmailSubject').html('');

            try {
                var html = '';

                // Display the top buttons.
                html += '                           <span class="emailEditor_topbarbutton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\');">';
                html += '                               <img title="Delete..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx123468" />&nbsp;Delete';
                html += '                           </span>';
                html += '&nbsp;&nbsp;';
                html += '                           <span class="emailEditor_topbarbutton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\', \'emptyfolder\');">';
                html += '                               <img title="Empty folder..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx23423467898">&nbsp;Empty folder';
                html += '                           </span>';
                $(thiz.element).find('#spanSelectedEmailType_TopButtons')[0].innerHTML = html; //'Pending Email';

                // Display the radio button and the title.
                html = '';
                html += '<input type="checkbox" id="checkboxToggleSentEmailCheckboxes" onchange="$(\'.bwConfiguration\').bwConfiguration(\'toggleSentEmailCheckboxes\', this);" />&nbsp;&nbsp;';
                html += '✉ Archived Items';

                $(thiz.element).find('#spanSelectedEmailType_Title')[0].innerHTML = html; //'Sent Email';

                // Make this button appear selected.
                $(thiz.element).find('#spanDisplaySentEmailButton').removeClass('bwConfiguration_LeftMenuButton').addClass('bwConfiguration_LeftMenuButton_Selected');
                $(thiz.element).find('#spanDisplayPendingEmailButton').removeClass('bwConfiguration_LeftMenuButton_Selected').addClass('bwConfiguration_LeftMenuButton');

            } catch (e) { }

            // Clear these in the beginning, because it may take a few seconds to re-populate, and this gives the user some visual feedback that something is going on.
            $(thiz.element).find('#spanEmailPicker')[0].innerHTML = '';
            $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '';

            console.log('xcx2313555. In bwConfiguration.js.loadAndRenderEmails_Archived(). Calling GET ' + webserviceurl + '/participantemail_inbox/ this.options.OnlyDisplayEmailsForCurrentParticipant: ' + this.options.OnlyDisplayEmailsForCurrentParticipant);

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                bwWorkflowAppId: workflowAppId,
                bwParticipantId: participantId
            };

            $.ajax({
                url: this.options.operationUriPrefix + "_bw/participantemail_trashbin",
                type: "POST",
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (results) {
                    try {

                        if (results.status != 'SUCCESS') {

                            var msg = results.status + ': ' + results.message;
                            console.log(msg);
                            displayAlertDialog(msg);

                            thiz.element.html(''); // This actually works to get rid of the qidget. Ha! 11-8-2023.

                        } else {

                            thiz.options.TrashBin = results.results;

                            thiz.renderEmails_TrashBin();

                        }

                    } catch (e) {
                        console.log('Exception in bwConfiguration.js.loadAndRenderEmails_Archived():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwConfiguration.js.loadAndRenderEmails_Archived():2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in bwConfiguration.js.loadAndRenderEmails_Archived():' + errorCode + ', ' + errorMessage);
                    displayAlertDialog('Error in bwConfiguration.js.loadAndRenderEmails_Archived():' + errorCode + ', ' + errorMessage);
                }
            });

        } catch (e) {
            console.log('Exception in loadAndRenderEmails_Archived(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in loadAndRenderEmails_Archived(): ' + e.message + ', ' + e.stack);
        }
    },

    loadAndRenderEmails_TrashBin: function (bwWorkflowAppId) {
        try {
            console.log('In loadAndRenderEmails_TrashBin(). bwWorkflowAppId: ' + bwWorkflowAppId);
            var thiz = this;

            $('#divPageContent2_Title').html('✉&nbsp;TRASHBIN');


            // Select the HOME button here. 1-4-2024.
            var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');

            var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

            // Step 1: Make all of the buttons un-selected.
            $('.bwConfiguration:first').find('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
            });

            // Step 2: Set the specified button as the selected one.
            $('#divInnerLeftMenuButton_Inbox').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);

            //
            // Rendering the layout, within the divPageContent3 element.
            //

            var html = '';

            html += '<style>';
            html += '   .bwConfiguration_LeftMenuButton {';
            html += '       font-size:14pt;white-space:nowrap;cursor:pointer;padding:10px 40px 10px 40px;'; // T R B L
            html += '   }';
            html += '   .bwConfiguration_LeftMenuButton:hover {';
            html += '       cursor:pointer;background-color:lightgray;';
            html += '   }';
            html += '   .bwConfiguration_LeftMenuButton_Selected {';
            html += '       font-size:14pt;white-space:nowrap;cursor:pointer;padding:10px 40px 10px 40px;background-color:#DEECF9;';
            html += '   }';
            html += '   .bwConfiguration_LeftMenuButton_UnicodeImage {';
            html += '       font-size:30px;color:gray;'; // T L B R
            html += '   }';

            html += '   .bwConfiguration_InnerLeftMenuButton {';
            html += '       font-size:14pt;white-space:nowrap;cursor:pointer;padding:10px 40px 10px 40px;'; // T R B L
            // border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px; <<< This is the style attribute values in the code.
            html += '   }';
            html += '   .bwConfiguration_InnerLeftMenuButton:hover {';
            html += '       cursor:pointer;background-color:aliceblue;';
            html += '   }';

            html += '   .bwConfiguration_InnerLeftMenuButton_Selected {';
            //html += '       font-size:14pt;white-space:nowrap;cursor:pointer;padding:10px 40px 10px 40px;';
            html += '       cursor:pointer;background-color:aliceblue;';
            html += '   }';



            html += '   .bwConfiguration_Trashbin {';
            html += '       cursor:pointer;background-color:aliceblue;'; // T R B L
            html += '   }';
            html += '   .bwConfiguration_Trashbin:hover {';
            html += '       cursor:pointer;background-color:salmon;color:tomato;';
            html += '   }';



            html += '</style>';

            html += '<div style="display:none;border: 2px solid yellow;" id="divBwEmailMonitor_DeletePendingEmailsDialog">';
            html += '   <table style="width:100%;">';
            html += '       <tr>';
            html += '           <td style="width:90%;">';
            html += '               <span id="spanDeletePendingEmailsDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">Delete Emails</span>';
            html += '           </td>';
            html += '           <td style="width:9%;"></td>';
            html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divBwEmailMonitor_DeletePendingEmailsDialog\').dialog(\'close\');">X</span>';
            html += '           </td>';
            html += '       </tr>';
            html += '   </table>';
            html += '   <br /><br />';
            html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '   <span id="spanBwEmailMonitor_DeletePendingEmailsDialogContentText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;">';
            html += '[spanBwEmailMonitor_DeletePendingEmailsDialogContentText]';
            html += '   </span>';
            html += '   <br /><br /><br />';
            //html += '   <div id="divBwEmailMonitor_DeleteThePendingEmails" class="divSignInButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'deleteSelectedPendingEmails\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
            html += '   <div id="divBwEmailMonitor_DeleteThePendingEmails" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
            html += '       Delete the Pending Emails';
            html += '   </div>';
            html += '   <br /><br />';
            html += '   <div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em; font-weight: bold;" onclick="$(\'#divBwEmailMonitor_DeletePendingEmailsDialog\').dialog(\'close\');">';
            html += '       Cancel';
            html += '   </div>';
            html += '   <br /><br />';
            html += '</div>';

            //html += '<div style="display:none;border: 2px solid yellow;" id="divBwEmailMonitor_DeleteSentEmailsDialog">';
            //html += '   <table style="width:100%;">';
            //html += '       <tr>';
            //html += '           <td style="width:90%;">';
            //html += '               <span id="spanDeleteSentEmailsDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">Delete Emails</span>';
            //html += '           </td>';
            //html += '           <td style="width:9%;"></td>';
            //html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
            //html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divBwEmailMonitor_DeleteSentEmailsDialog\').dialog(\'close\');">X</span>';
            //html += '           </td>';
            //html += '       </tr>';
            //html += '   </table>';
            //html += '   <br /><br />';
            //html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            //html += '   <span id="spanBwEmailMonitor_DeleteSentEmailsDialogContentText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;">';
            //html += '[spanBwEmailMonitor_DeleteSentEmailsDialogContentText]';
            //html += '   </span>';
            //html += '   <br /><br /><br />';
            ////html += '   <div id="divBwEmailMonitor_DeleteTheSentEmails" class="divSignInButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'deleteSelectedSentEmails\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" >';
            //html += '   <div id="divBwEmailMonitor_DeleteTheSentEmails" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" >';
            //html += '       Delete the Sent Emails';
            //html += '   </div>';
            //html += '   <br /><br />';
            //html += '   <div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em; font-weight: bold;" onclick="$(\'#divBwEmailMonitor_DeleteSentEmailsDialog\').dialog(\'close\');">';
            //html += '       Cancel';
            //html += '   </div>';
            //html += '   <br /><br />';
            //html += '</div>';

            html += '<table style="width:100%;" xcx="xcx232536">';
            html += '   <tr>';
            html += '       <td style="width:100%;">';
            html += '           <div id="displayedemaildetails" bwPendingEmailId="" bwSentEmailId="" bwerrororsuggestionid=""></div>'; // This is where we look when we want to know the type and GUID of the displayed email!

            html += '           <table style="width:100%;">';
            html += '               <colgroup>';
            html += '                   <col style="WIDTH:3%;" />';
            html += '                   <col style="WIDTH:2%;" />';
            html += '                   <col style="WIDTH:5%;" />';
            html += '                   <col style="WIDTH:5%;" />';
            html += '                   <col style="WIDTH:5%;" />';
            html += '                   <col style="WIDTH:5%;" />';
            html += '                   <col style="WIDTH:90%;" />';
            html += '               </colgroup>';
            html += '               <tbody>';
            html += '                       <tr>';
            html += '                           <td>';
            //html += '                           <span class="emailEditor_newMessageButton" onclick="alert(\'This functionality is incomplete. Coming soon! xcx664993-2\');">'; //
            //html += '                               &nbsp;✉&nbsp;New message&nbsp;';
            //html += '                           </span>';
            html += '                           </td>';
            html += '                           <td colspan="6">';
            //html += '                               <span id="spanSelectedEmailType_TopButtons" style="font-size:13pt;font-weight:normal;">[spanSelectedEmailType_TopButtons]</span>';
            html += '                           </td>';
            html += '                       </tr>';

            html += '                       <tr style="font-size:10pt;font-weight:normal;color:black;">';
            html += '                           <td>';
            html += '                           </td>';
            html += '                           <td></td>';
            html += '                           <td colspan="4">';
            html += '                           </td>';
            html += '                           <td style="text-align:right;width:97%;">';

            var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');
            if (developerModeEnabled == true) {
                html += '                               <span class="spanButton" title="Click to send this email now!" onclick="$(\'.bwConfiguration\').bwConfiguration(\'sendPendingEmailNow\');">';
                html += '                                   ✉&nbsp;Send Now > xcx1';
                html += '                               </span>';
            }

            html += '                           </td>';
            html += '                       </tr>';

            //
            // This is the 3-column main display of the mail client.
            //
            html += '<tr>';
            html += '   <td colspan="7" style="width:100%;">';
            html += '       <table style="width:100%;">';
            html += '           <colgroup>';
            //html += '               <col style="WIDTH:23%;" />';
            html += '               <col style="WIDTH:25%;" />';
            html += '               <col style="WIDTH:62%;" />';
            html += '           </colgroup>';
            html += '           <tbody>';
            html += '               <tr>';
            //html += '                   <td xcx="xcx111">';
            ////html += 'xcx111';
            //html += '                       <span class="emailEditor_newMessageButton" onclick="$(\'.bwConfiguration:first\').bwConfiguration(\'composeANewEmailMessage\');">'; //
            //html += '                           &nbsp;✉&nbsp;New message&nbsp;';
            //html += '                       </span>';
            //html += '                   </td>';
            html += '                   <td xcx="xcx222">';
            //html += 'xcx222';
            html += '                       <span id="spanSelectedEmailType_TopButtons" style="font-size:13pt;font-weight:normal;">[spanSelectedEmailType_TopButtons]</span>';
            html += '                   </td>';
            html += '                   <td xcx="xcx333-1">';
            //html += 'xcx333';


            html += '<span id="" style="float:right;white-space:nowrap;">   Search:    <span id="searchbox">       <input type="text" id="inputBwAuthentication_SearchBox" onkeydown="$(\'.bwConfiguration\').bwConfiguration(\'searchBox_OnKeyDown\', event);" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;">       &nbsp;&nbsp;       <span class="emailEditor_newMessageButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'search\');">Search</span>   </span></span>';







            html += '                   </td>';
            html += '               </tr>';


            html += '               <tr>';
            //html += '                   <td xcx="xcx111" style="vertical-align:top;">';

            //// Left-most column.
            //html += '<table>';
            //html += '   <tr>';
            //html += '       <td id="tdDisplayPendingEmailButton">';
            //html += '       </td>';
            //html += '   </tr>';
            //html += '   <tr>';
            //html += '       <td>';
            //html += '           <table>';

            //if (developerModeEnabled == true) {
            //    html += '               <tr>';
            //    html += '                   <td id="spanDisplayAIConversationButton" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayAIConversation\');">';
            //    html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">🔊</span> AI Conversation</span>';
            //    html += '                       </br>';
            //    html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">The system engages you in a </br>conversation about the </br>requests that you are </br>involved with.</span>';
            //    html += '                   </td>';
            //    html += '               </tr>';
            //}


            //// 6-5-2023
            //html += '               <tr>';
            //html += '                   <td id="spanDisplaySentEmailButton" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayIncomingEmails\');">';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">✉</span> Incoming</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Emails sent to you from an external source.</span>';
            //html += '                   </td>';
            //html += '               </tr>';



            //html += '               <tr>';
            //html += '                   <td id="spanDisplaySentEmailButton" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displaySentEmails\');">';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">✉</span> Inbox</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Emails sent to you.</span>';
            //html += '                   </td>';
            //html += '               </tr>';

            //html += '               <tr>';
            //html += '                   <td id="spanDisplayPendingEmailButton" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayPendingEmailsxxxx\');" >';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">✉</span> Sent</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Emails you have sent. *beta</span>';
            //html += '                   </td>';
            //html += '               </tr>';

            //html += '               <tr>';
            //html += '                   <td id="spanDisplayPendingEmailButton" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayPendingEmails\');" >';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">✉</span> Pending Inbox</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Emails waiting to be sent to you.</span>';
            //html += '                   </td>';
            //html += '               </tr>';

            //html += '               <tr>';
            //html += '                   <td id="spanDisplayPendingEmailButton" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayPendingEmails\');" >';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage"><img src="/images/trashbin.png"></span> TrashBin (Inbox)</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Emails you have deleted.</span>';
            //html += '                   </td>';
            //html += '               </tr>';

            //html += '               <tr>';
            //html += '                   <td id="spanDisplayPendingEmailButtonxxx" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayPendingEmailsxxx\');" >';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">☎</span> Sent Text Message(s)</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Text Messages sent to you.</span>';
            //html += '                   </td>';
            //html += '               </tr>';
            //html += '               <tr>';
            //html += '                   <td id="spanDisplayPendingEmailButtonxxx" class="bwConfiguration_LeftMenuButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayPendingEmailsxxx\');" >';
            //html += '                       <span><span class="bwConfiguration_LeftMenuButton_UnicodeImage">☎</span> Pending Text Message(s)</span>';
            //html += '                       </br>';
            //html += '                       <span style="font-size:10pt;font-style:italic;color:gray;">Text Messages waiting to be sent to you.</span>';
            //html += '                   </td>';
            //html += '               </tr>';
            //html += '           </table>';
            //html += '       </td>';
            //html += '   </tr>';
            //html += '</table>';
            //// end: Left-most column.

            //html += '                   </td>';
            html += '                   <td xcx="xcx222" style="vertical-align:top;">';

            // Middle column.
            html += '<table>';
            html += '   <tr>';
            html += '       <td style="width:350px;height:50px;text-align:left;background-color:white;margin:10px 20px 10px -3px;">';
            html += '           <span id="spanSelectedEmailType_Title" style="height:30px;font-size:15pt;font-weight:bold;">[spanSelectedEmailType_Title]</span>';
            html += '       </td>';
            html += '   </tr>';
            html += '   <tr>';
            html += '       <td>';
            //html += '           <div xcx="xcx21323663" style="width:460px;height:600px;overflow-y: scroll;overflow-x:hidden;">'; // The width is set here for the email list... 2-9-2022
            html += '               <span id="spanEmailPicker"></span>';
            //html += '           </div>';
            html += '       </td>';
            html += '   </tr>';
            html += '</table>';
            // end: Middle column.

            html += '                   </td>';
            html += '                   <td xcx="xcx333-2" style="vertical-align:top;">';

            // Right column.
            html += '<table style="width:100%;">';
            html += '   <tr>';
            html += '       <td>';
            html += '           <div id="divEmailClient_CompositionWindow">';
            //html += '               <span id="spanSelectedEmail_From" style="font-size:13pt;font-weight:bold;color:#95b1d3;">[spanSelectedEmail_From]</span>';
            //html += '               <br />';
            html += '               <span id="spanSelectedEmailSubject" style="font-size:13pt;font-weight:bold;color:#95b1d3;"></span>';
            html += '               <br />';
            html += '               <span id="spanSelectedEmail"></span>';
            html += '           </div>';
            html += '       </td>';
            html += '   </tr>';
            html += '</table>';
            // end: Right column.

            html += '                   </td>';

            html += '               </tr>';


            html += '           </tbody>';
            html += '       </table>';
            html += '   </td>';
            html += '</tr>';
            // end: This is the 3-column main display of the mail client.


            html += '               </tbody>';
            html += '           </table>';

            html += '       </td>';
            html += '   </tr>';
            html += '</table>';

            // Render the html.
            $('#divPageContent3').html(html);


















            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            if (bwWorkflowAppId != 'all') {
                bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            }

            //this.options.pagingPage_SentEmail = 0; // If we want items to display properly, these need to be reset/set back to the beginning here.
            //this.options.pagingLimit_SentEmail = 20;

            $('#spanSelectedEmailSubject').html('');

            try {
                var html = '';

                // Display the top buttons.
                html += '                           <span class="emailEditor_topbarbutton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\');">';
                html += '                               <img title="Delete..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx123468" />&nbsp;Delete';
                html += '                           </span>';
                html += '&nbsp;&nbsp;';
                html += '                           <span class="emailEditor_topbarbutton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\', \'emptyfolder\');">';
                html += '                               <img title="Empty folder..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx23423467898">&nbsp;Empty folder';
                html += '                           </span>';
                $(thiz.element).find('#spanSelectedEmailType_TopButtons')[0].innerHTML = html; //'Pending Email';

                // Display the radio button and the title.
                html = '';
                html += '<input type="checkbox" id="checkboxToggleSentEmailCheckboxes" onchange="$(\'.bwConfiguration\').bwConfiguration(\'toggleSentEmailCheckboxes\', this);" />&nbsp;&nbsp;';
                html += '✉ TrashBin Items';

                $(thiz.element).find('#spanSelectedEmailType_Title')[0].innerHTML = html; //'Sent Email';

                // Make this button appear selected.
                $(thiz.element).find('#spanDisplaySentEmailButton').removeClass('bwConfiguration_LeftMenuButton').addClass('bwConfiguration_LeftMenuButton_Selected');
                $(thiz.element).find('#spanDisplayPendingEmailButton').removeClass('bwConfiguration_LeftMenuButton_Selected').addClass('bwConfiguration_LeftMenuButton');

            } catch (e) { }

            // Clear these in the beginning, because it may take a few seconds to re-populate, and this gives the user some visual feedback that something is going on.
            $(thiz.element).find('#spanEmailPicker')[0].innerHTML = '';
            $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '';

            console.log('xcx2313555. In bwConfiguration.js.loadAndRenderEmails_TrashBin(). Calling GET ' + webserviceurl + '/participantemail_inbox/ this.options.OnlyDisplayEmailsForCurrentParticipant: ' + this.options.OnlyDisplayEmailsForCurrentParticipant);

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                bwWorkflowAppId: workflowAppId,
                bwParticipantId: participantId
            };

            $.ajax({
                url: this.options.operationUriPrefix + "_bw/participantemail_trashbin",
                type: "POST",
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (results) {
                    try {

                        if (results.status != 'SUCCESS') {

                            var msg = results.status + ': ' + results.message;
                            console.log(msg);
                            displayAlertDialog(msg);

                            thiz.element.html(''); // This actually works to get rid of the qidget. Ha! 11-8-2023.

                        } else {

                            thiz.options.TrashBin = results.results;

                            thiz.renderEmails_TrashBin();

                        }

                    } catch (e) {
                        console.log('Exception in bwConfiguration.js.loadAndRenderEmails_TrashBin():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwConfiguration.js.loadAndRenderEmails_TrashBin():2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in bwConfiguration.js.loadAndRenderEmails_TrashBin():' + errorCode + ', ' + errorMessage);
                    displayAlertDialog('Error in bwConfiguration.js.loadAndRenderEmails_TrashBin():' + errorCode + ', ' + errorMessage);
                }
            });

        } catch (e) {
            console.log('Exception in loadAndRenderEmails_TrashBin(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in loadAndRenderEmails_TrashBin(): ' + e.message + ', ' + e.stack);
        }
    },

    viewIndividualEmail_Inbox: function (originElementId, bwParticipantId, bwParticipantFriendlyName, bwParticipantEmail, _id) {
        try {
            console.log('In bwConfiguration.js.viewIndividualEmail_Inbox(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ', _id: ' + _id);
            //displayAlertDialog_Persistent('In bwConfiguration.js.viewIndividualEmail_Inbox(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ', _id: ' + _id);

            var thiz = this;

            // This if statement just checks we still have these displayed on the screen/available in the dom.
            if (!($(this.element).find('#displayedemaildetails') && $(this.element).find('#displayedemaildetails')[0] && $(this.element).find('#quillConfigureNewUserEmailsDialog_Body') && $(this.element).find('#quillConfigureNewUserEmailsDialog_Body')[0])) {

                alert('Error in bwConfiguration.js.viewIndividualEmail_Inbox(). An expected element is missing or not in the correct state. xcx124323643734.');

            } else {

                this.loadIndividualEmail_Inbox(_id).then(function () {
                    try {

                        $(thiz.element).find('#displayedemaildetails')[0].setAttribute('bwSentEmailId', _id);

                        $(thiz.element).find('.bwConfiguration_InnerLeftMenuButton_Selected').removeClass('bwConfiguration_InnerLeftMenuButton_Selected'); // Reset them all, only 1 can be selected at a time.
                        $('#bwConfiguration_InnerLeftMenuButton_' + _id).removeClass('bwConfiguration_InnerLeftMenuButton').addClass('bwConfiguration_InnerLeftMenuButton_Selected'); // Indicate this one as selected.

                        var email = null;
                        for (var i = 0; i < thiz.options.Inbox.length; i++) {

                            if (thiz.options.Inbox[i]._id == _id) { // We can't use message_id because it may have an @ sign in it, which is not allowed in a valid html element id.

                                email = thiz.options.Inbox[i];
                                break;

                            }
                        }

                        // Set the "From" field. Include reply, reply-all, forward, as appropriate.
                        var emailAddress = '';
                        if (email.from && email.from[0] && email.from[0].address) {
                            emailAddress = email.from[0].address;
                        } else {
                            emailAddress = email.from;
                        }
                        var html = '';
                        html += 'From: <span class="EmailAddress_From">' + emailAddress + '</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'; // + '[Reply]  [Reply All]  [Forward]';
                        html += '<span class="emailEditor_newMessageButton" onclick="$(\'.bwConfiguration:first\').bwConfiguration(\'composeANewEmailMessage_Reply\');">&nbsp;✉&nbsp;Reply&nbsp;</span>';
                        html += '&nbsp;&nbsp;&nbsp;';
                        html += '<span class="emailEditor_newMessageButton" onclick="$(\'.bwConfiguration:first\').bwConfiguration(\'composeANewEmailMessage_Reply\');">&nbsp;✉&nbsp;Reply All&nbsp;</span>';
                        html += '&nbsp;&nbsp;&nbsp;';
                        html += '<span class="emailEditor_newMessageButton" onclick="$(\'.bwConfiguration:first\').bwConfiguration(\'composeANewEmailMessage_Reply\');">&nbsp;✉&nbsp;Forward&nbsp;</span>';



                        $('#bwEmailView_From').html(html);

                        // Set the "To" field.
                        var toEmailAddress = '';
                        if (email.to && email.to[0] && email.to[0].address) {
                            toEmailAddress = email.to[0].address;
                        } else {
                            toEmailAddress = email.to;
                        }

                        var emailToHtml = toEmailAddress;
                        if (email.ThisEmailIsFromAnInternalSource == true) {
                            emailToHtml += '&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:tomato;font-weight:bold;">INTERNAL</span>';
                        } else {
                            emailToHtml += '&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:tomato;font-weight:bold;">EXTERNAL</span>';
                        }
                        $('#bwEmailView_To').html(emailToHtml);

                        //
                        //
                        // Check for a <style> element with body { }. We need to remove these ones.
                        //
                        //
                        var thereMayBeMore = true;
                        while (thereMayBeMore) {
                            var styleIndex = email.html.indexOf('<style>');
                            var bodyIndex = email.html.indexOf('body {', styleIndex);
                            if (bodyIndex != -1) {
                                var bodyEndIndex = email.html.indexOf('}', bodyIndex);
                                email.html = email.html.substring(0, bodyIndex) + email.html.substring(bodyEndIndex + 1, email.html.length - 1);
                            } else {
                                thereMayBeMore = false;
                            }
                        }

                        //
                        //
                        // Check for <meta /> elements. We need to remove these ones.
                        //
                        //
                        var thereMayBeMore = true;
                        while (thereMayBeMore) {
                            var metaIndex = email.html.indexOf('<meta ');
                            if (metaIndex != -1) {
                                var metaEndIndex = email.html.indexOf('>', metaIndex);
                                email.html = email.html.substring(0, metaIndex) + email.html.substring(metaEndIndex + 1, email.html.length - 1);
                            } else {
                                thereMayBeMore = false;
                            }
                        }

                        //
                        //
                        // Check for <link /> elements. We need to remove these ones.
                        //
                        //
                        var thereMayBeMore = true;
                        while (thereMayBeMore) {
                            var metaIndex = email.html.indexOf('<link ');
                            if (metaIndex != -1) {
                                var metaEndIndex = email.html.indexOf('>', metaIndex);
                                email.html = email.html.substring(0, metaIndex) + email.html.substring(metaEndIndex + 1, email.html.length - 1);
                            } else {
                                thereMayBeMore = false;
                            }
                        }

                        //
                        //
                        // Check for <style /> elements. We need to remove these ones.
                        //
                        //
                        var thereMayBeMore = true;
                        while (thereMayBeMore) {
                            var metaIndex = email.html.indexOf('<style ');
                            if (metaIndex != -1) {
                                var metaEndIndex = email.html.indexOf('>', metaIndex);
                                email.html = email.html.substring(0, metaIndex) + email.html.substring(metaEndIndex + 1, email.html.length - 1);
                            } else {
                                thereMayBeMore = false;
                            }
                        }






                        //
                        // SO FAR IT SEEMS THE EASIEST WAY IS THE WAY I AM DOING IT ABOUVE. STRING RELACEMENT MAY BE THE THING, JUST TAKE SOME TIME BEFORE WE IDENTIFY ALL THE TROUBLE AREAS.
                        // 1-12-2024.
                        //


                        //
                        //
                        // We need to rename the classes that may be present in the email HTML, in order to prevent class naming collissions in the application code.
                        //    - We are going to do it by creating an invisible DOM element, then putting the code into it, and accessing it like a regular DOM element to get all the classes.
                        //
                        //
                        //function getAllStyles(elem) {
                        //    if (!elem) return []; // Element does not exist, empty list.
                        //    var win = document.defaultView || window, style, styleNode = [];
                        //    if (win.getComputedStyle) { /* Modern browsers */
                        //        style = win.getComputedStyle(elem, '');
                        //        for (var i = 0; i < style.length; i++) {
                        //            styleNode.push(style[i] + ':' + style.getPropertyValue(style[i]));
                        //            //               ^name ^           ^ value ^
                        //        }
                        //    } else if (elem.currentStyle) { /* IE */
                        //        style = elem.currentStyle;
                        //        for (var name in style) {
                        //            styleNode.push(name + ':' + style[name]);
                        //        }
                        //    } else { /* Ancient browser..*/
                        //        style = elem.style;
                        //        for (var i = 0; i < style.length; i++) {
                        //            styleNode.push(style[i] + ':' + style[style[i]]);
                        //        }
                        //    }
                        //    return styleNode;
                        //}

                        //var div = document.getElementById('bwConfiguration_EmailBodyClassProcessor');
                        //if (!div) {
                        //    div = document.createElement('div');
                        //    div.id = 'bwConfiguration_EmailBodyClassProcessor';
                        //    div.style.display = 'none';
                        //    document.body.appendChild(div); // to place at end of document
                        //}
                        //div.innerHTML = email.html; // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Email body.

                        ////alert('In viewIndividualEmail_Inbox().');

                        //var styleNamesArray = []; // This is a list of unique style class names that we want to rename. We do this after changing all the styles for th eleemnts in the loop below.
                        //var stylesArray = [];
                        //var elements = div.getElementsByTagName('*');
                        //for (var i = 0; i < elements.length; i++) {
                        //    if (elements[i].classList.length > 0) {

                        //        //debugger;
                        //        //var styles = getAllStyles(elements[i]);

                        //        for (var j = 0; j < elements[i].classList.length; j++) {
                        //            var className = elements[i].classList[j];
                        //            var newClassName = 'x_' + className;
                        //            div.classList.remove(className);
                        //            div.classList.add(newClassName);
                        //            //debugger;
                        //            if (!(styleNamesArray.indexOf(className) > -1)) {
                        //                styleNamesArray.push(className);
                        //                //stylesArray.push(xx); // The actual style.
                        //            }

                        //        }

                        //    }

                        //}



                        ////
                        //// Now we are checking for a <style> lement, and making sure all of these are renamed.
                        ////    - Obtaining a stylesheet: https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet#obtaining_a_stylesheet <<<<<<<<<<<<<<<<<<<
                        ////    - STYLESHEETS: https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet
                        ////
                        //var styleElements = document.getElementsByTagName('style');

                        //for (var i = 0; i < styleElements.length; i++) {
                        //    debugger;
                        //    var x = styleElements[i];
                        //    debugger;
                        //    var x = 21;


                        //}



                        //var placeholder;
                        //if (email && email.html) {
                        //    debugger;
                        //    placeholder = div.innerHTML; // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Processed email body.
                        //}















                        //
                        //
                        // Now we need to loop through stylesArray and rename them here as well.
                        //
                        //







                        $($(thiz.element).find('#quillConfigureNewUserEmailsDialog_Body')[0]).summernote({
                            placeholder: email.html, // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Display the email.
                            tabsize: 2,
                            height: 1000, //400, // THIS IS THE ONE!!!!!!!!!!!!!!!!!!!! This is where we set the height of the email editor window. 9-26-2023.
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

                        var emailTemplateForSubject;
                        if (email && email.subject) {
                            emailTemplateForSubject = email.subject;
                        }
                        var emailTemplate;
                        if (email && email.html) {
                            emailTemplate = email.html;
                        }
                        if (emailTemplateForSubject && emailTemplateForSubject != '') {
                            $(thiz.element).find('#quillConfigureNewUserEmailsDialog_Subject')[0].value = emailTemplateForSubject;
                        } else {
                            $(thiz.element).find('#quillConfigureNewUserEmailsDialog_Subject')[0].value = '';
                        }
                        if (emailTemplate && emailTemplate != '') {
                            $(thiz.element).find('#quillConfigureNewUserEmailsDialog_Body').summernote('reset');
                            //$(thiz.element).find('#quillConfigureNewUserEmailsDialog_Body').summernote('pasteHTML', emailTemplate);
                            $(thiz.element).find('#quillConfigureNewUserEmailsDialog_Body').summernote('code', emailTemplate); // Warning, using 'pasteHTML' add some extra <p> that will mess up your original HTML. Use 'code' instead????

                            //$(thiz.element).find('#quillConfigureNewUserEmailsDialog_Body')[0].summernote('reset');
                            //$(thiz.element).find('#quillConfigureNewUserEmailsDialog_Body')[0].summernote('pasteHTML', emailTemplate);
                        } else {
                            $(thiz.element).find('#quillConfigureNewUserEmailsDialog_Body').summernote('reset');
                            //$(thiz.element).find('#quillConfigureNewUserEmailsDialog_Body')[0].summernote('reset');
                        }
                        //var html = '';

                        //html += '               <span id="spanSelectedEmailSubject" style="font-size:13pt;font-weight:bold;color:#95b1d3;"></span>';
                        //html += '               <br />';
                        //html += '               <span id="spanSelectedEmail"></span>';


                        //debugger;

                        //$(this.element).find('#spanSelectedEmailSubject')[0].innerHTML = html;






                        console.log('In bwConfiguration.js.viewIndividualEmail_Inbox(). Turned off this call to bwActiveMenu.js.adjustLeftSideMenu(). DO WE NEED IT BACK????????? 12-24-2022');
                        // THIS IS THE FIRST TIME WE ARE USING setTimeout for the call to bwActiveMenu.adjustLeftSideMenu(). 4-25-2022
                        //setTimeout(function () { // Only needs to happen for Chrome.
                        //    // menu should be re-done since the display has probably resized from the display of the email.
                        //    //alert('Calling bwActiveMenu.adjustLeftSideMenu().');
                        //    displayAlertDialog('Calling bwActiveMenu.adjustLeftSideMenu(). xcx123423521-6.');
                        //    $('.bwActiveMenu').bwActiveMenu('adjustLeftSideMenu');
                        //}, 500);


                        if (!(email.TheUserHasReadThisEmail && (email.TheUserHasReadThisEmail == true))) {

                            //
                            //
                            // If this email is marked as unread, then we do a web service call here to mark this email as read on the server. 11-2-2023.
                            //
                            //

                            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

                            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

                            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                            var data = {
                                bwParticipantId_LoggedIn: participantId,
                                bwActiveStateIdentifier: activeStateIdentifier,
                                bwWorkflowAppId_LoggedIn: workflowAppId,

                                bwWorkflowAppId: workflowAppId,
                                bwParticipantId: participantId,
                                _id: _id
                            };

                            $.ajax({
                                url: thiz.options.operationUriPrefix + "_bw/MarkSingleEmailAsRead",
                                type: "POST",
                                data: data,
                                headers: {
                                    "Accept": "application/json; odata=verbose"
                                },
                                success: function (results) {
                                    try {

                                        if (results.status != 'SUCCESS') {

                                            displayAlertDialog(JSON.stringify(results));

                                        } else {
                                            debugger;
                                            console.log('The email was successfully marked as read. _id: ' + _id + ', results.message: ' + results.message);

                                            console.log('The email was successfully marked as read. We updated options.Inbox and redid the UI so that the user gets visual feedback.');

                                            for (var i = 0; i < thiz.options.Inbox.length; i++) {
                                                if (thiz.options.Inbox[i]._id == _id) { // We can't use message_id because it may have an @ sign in it, which is not allowed in a valid html element id.

                                                    thiz.options.Inbox[i].TheUserHasReadThisEmail = true;

                                                    var inboxEmails = $(thiz.element).find('.bwEmailInboxRow');

                                                    for (var j = 0; j < inboxEmails.length; j++) {

                                                        var tmpId = $(inboxEmails[j]).attr('_id');
                                                        if (tmpId == _id) {
                                                            debugger;
                                                            // We have found the email entry. Change the UI.
                                                            var emailAddressElement = $(inboxEmails[j]).find('.bwEmailInboxRow_EmailAddress')[0];
                                                            var subjectElement = $(inboxEmails[j]).find('.bwEmailInboxRow_Subject')[0];
                                                            $(emailAddressElement).css('fontWeight', 'normal');
                                                            $(subjectElement).css('fontWeight', 'lighter');
                                                            break;

                                                        }
                                                    }

                                                    break;

                                                }
                                            }

                                        }

                                    } catch (e) {
                                        console.log('Exception in bwConfiguration.js.viewIndividualEmail_Inbox():2: ' + e.message + ', ' + e.stack);
                                        displayAlertDialog('Exception in bwConfiguration.js.viewIndividualEmail_Inbox():2: ' + e.message + ', ' + e.stack);
                                    }
                                },
                                error: function (data, errorCode, errorMessage) {
                                    console.log('Error in bwConfiguration.js.viewIndividualEmail_Inbox():' + errorCode + ', ' + errorMessage);
                                    displayAlertDialog('Error in bwConfiguration.js.viewIndividualEmail_Inbox():' + errorCode + ', ' + errorMessage);
                                }
                            });

                        }

                    } catch (e) {
                        console.log('Exception in bwConfiguration.js.viewIndividualEmail_Inbox():4: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwConfiguration.js.viewIndividualEmail_Inbox():4: ' + e.message + ', ' + e.stack);
                    }

                }).catch(function (e) {

                    console.log('Exception in bwConfiguration.js.viewIndividualEmail_Inbox():3: ' + JSON.stringify(e));
                    displayAlertDialog('Exception in bwConfiguration.js.viewIndividualEmail_Inbox():3: ' + JSON.stringify(e));

                });

            }

        } catch (e) {
            console.log('Exception in bwConfiguration.js.viewIndividualEmail_Inbox(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ': ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwConfiguration.js.viewIndividualEmail_Inbox(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ': ' + e.message + ', ' + e.stack);
        }
    },

    loadIndividualEmail_Inbox: function (_id) {
        var thiz = this;
        return new Promise(function (resolve, reject) {
            try {
                console.log('In bwConfiguration.js.loadIndividualEmail_Inbox(). _id: ' + _id);
                //displayAlertDialog_Persistent('In bwConfiguration.js.loadIndividualEmail_Inbox(). _id: ' + _id);

                var hasBeenLoaded;
                for (var i = 0; i < thiz.options.Inbox.length; i++) {
                    if (thiz.options.Inbox[i]._id == _id) {

                        if (thiz.options.Inbox[i].html) {
                            hasBeenLoaded = true;
                        }

                    }
                }

                if (hasBeenLoaded == true) {

                    // It has already been loaded.
                    resolve();

                } else {

                    var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                    var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

                    if (!(workflowAppId && participantId && _id)) {

                        var msg = 'Error in bwConfiguration.js.loadIndividualEmail_Inbox(): Invalid value. Expected values for workflowAppId: ' + workflowAppId + ', participantId: ' + participantId + ', _id: ' + _id;
                        console.log(msg);

                        var result = {
                            status: 'ERROR',
                            message: msg
                        }
                        reject(result);

                    } else {

                        var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                        var data = {
                            bwParticipantId_LoggedIn: participantId,
                            bwActiveStateIdentifier: activeStateIdentifier,
                            bwWorkflowAppId_LoggedIn: workflowAppId,

                            bwWorkflowAppId: workflowAppId,
                            bwParticipantId: participantId,
                            _id: _id
                        };
                        $.ajax({
                            url: thiz.options.operationUriPrefix + "_bw/getsingleparticipantemail_inbox",
                            type: "POST",
                            data: data,
                            headers: {
                                "Accept": "application/json; odata=verbose"
                            },
                            success: function (results) {
                                try {
                                    //displayAlertDialog_Persistent('xcx2331234 RESPONSE FROM SERVER FOR getsingleparticipantemail_inbox. status: ' + results.status + ', message: ' + results.message);
                                    if (results.status != 'SUCCESS') {

                                        //thiz.element.html(''); // This actually works to get rid of the widget. Ha! 11-8-2023.

                                        var msg = 'Error in bwConfiguration.js.loadAndRenderEmails():xcx542: results: ' + JSON.stringify(results);
                                        console.log(msg);

                                        var result = {
                                            status: 'ERROR',
                                            message: msg
                                        }
                                        reject(result);

                                    } else {

                                        var foundIt;
                                        for (var i = 0; i < thiz.options.Inbox.length; i++) {
                                            if (thiz.options.Inbox[i]._id == _id) {

                                                //displayAlertDialog_Persistent('BACKFILLING EMAIL BODY. i: ' + i + ', : ' + results.results.html);
                                                thiz.options.Inbox[i].html = results.results.html; //.text; //  splice(i, 1); // Delete the item from the array.
                                                foundIt = true;

                                            }
                                        }
                                        debugger;
                                        if (!foundIt) {

                                            var msg = 'Error in bwConfiguration.js.loadAndRenderEmails():xcx231312: Could not find the email.';
                                            console.log(msg);

                                            var result = {
                                                status: 'ERROR',
                                                message: msg
                                            }
                                            reject(result);

                                        } else {

                                            resolve();

                                        }

                                    }

                                } catch (e) {

                                    var msg = 'Exception in bwConfiguration.js.loadAndRenderEmails():2: ' + e.message + ', ' + e.stack;
                                    console.log(msg);

                                    var result = {
                                        status: 'EXCEPTION',
                                        message: msg
                                    }
                                    reject(result);

                                }
                            },
                            error: function (data, errorCode, errorMessage) {

                                var msg = 'Error in bwConfiguration.js.loadAndRenderEmails():' + errorCode + ', ' + errorMessage;
                                console.log(msg);

                                var result = {
                                    status: 'ERROR',
                                    message: msg
                                }
                                reject(result);

                            }
                        });

                    }

                }

            } catch (e) {

                var msg = 'Exception in bwConfiguration.js.loadIndividualEmail_Inbox():xcx453: ' + e.message + ', ' + e.stack;

                var result = {
                    status: 'EXCEPTION',
                    message: msg
                }
                reject(result);

            }

        })
    },




    viewIndividualEmail_TrashBin: function (originElementId, bwParticipantId, bwParticipantFriendlyName, bwParticipantEmail, _id) {
        try {
            console.log('In bwConfiguration.js.viewIndividualEmail_TrashBin(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ', _id: ' + _id);
            //displayAlertDialog_Persistent('In bwConfiguration.js.viewIndividualEmail_TrashBin(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ', _id: ' + _id);

            var thiz = this;

            // This if statement just checks we still have these displayed on the screen/available in the dom.
            if (!($(this.element).find('#displayedemaildetails') && $(this.element).find('#displayedemaildetails')[0] && $(this.element).find('#quillConfigureNewUserEmailsDialog_Body') && $(this.element).find('#quillConfigureNewUserEmailsDialog_Body')[0])) {

                alert('Error in bwConfiguration.js.viewIndividualEmail_TrashBin(). An expected element is missing or not in the correct state. xcx124323643734.');

            } else {

                this.loadIndividualEmail_TrashBin(_id).then(function () {
                    try {

                        $(thiz.element).find('#displayedemaildetails')[0].setAttribute('bwSentEmailId', _id);

                        $(thiz.element).find('.bwConfiguration_InnerLeftMenuButton_Selected').removeClass('bwConfiguration_InnerLeftMenuButton_Selected'); // Reset them all, only 1 can be selected at a time.
                        $('#bwConfiguration_InnerLeftMenuButton_' + _id).removeClass('bwConfiguration_InnerLeftMenuButton').addClass('bwConfiguration_InnerLeftMenuButton_Selected'); // Indicate this one as selected.

                        var email = null;
                        for (var i = 0; i < thiz.options.TrashBin.length; i++) {

                            if (thiz.options.TrashBin[i]._id == _id) { // We can't use message_id because it may have an @ sign in it, which is not allowed in a valid html element id.

                                email = thiz.options.TrashBin[i];
                                break;

                            }
                        }

                        // Set the "From" field. Include reply, reply-all, forward, as appropriate.
                        var emailAddress = '';
                        if (email.from && email.from[0] && email.from[0].address) {
                            emailAddress = email.from[0].address;
                        } else {
                            emailAddress = email.from;
                        }
                        var html = '';
                        html += 'From: <span class="EmailAddress_From">' + emailAddress + '</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'; // + '[Reply]  [Reply All]  [Forward]';
                        html += '<span class="emailEditor_newMessageButton" onclick="$(\'.bwConfiguration:first\').bwConfiguration(\'composeANewEmailMessage_Reply\');">&nbsp;✉&nbsp;Reply&nbsp;</span>';
                        html += '&nbsp;&nbsp;&nbsp;';
                        html += '<span class="emailEditor_newMessageButton" onclick="$(\'.bwConfiguration:first\').bwConfiguration(\'composeANewEmailMessage_Reply\');">&nbsp;✉&nbsp;Reply All&nbsp;</span>';
                        html += '&nbsp;&nbsp;&nbsp;';
                        html += '<span class="emailEditor_newMessageButton" onclick="$(\'.bwConfiguration:first\').bwConfiguration(\'composeANewEmailMessage_Reply\');">&nbsp;✉&nbsp;Forward&nbsp;</span>';



                        $('#bwEmailView_From').html(html);

                        // Set the "To" field.
                        var toEmailAddress = '';
                        if (email.to && email.to[0] && email.to[0].address) {
                            toEmailAddress = email.to[0].address;
                        } else {
                            toEmailAddress = email.to;
                        }

                        var emailToHtml = toEmailAddress;
                        if (email.ThisEmailIsFromAnInternalSource == true) {
                            emailToHtml += '&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:tomato;font-weight:bold;">INTERNAL</span>';
                        } else {
                            emailToHtml += '&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:tomato;font-weight:bold;">EXTERNAL</span>';
                        }
                        $('#bwEmailView_To').html(emailToHtml);

                        debugger;
                        var placeholder;
                        if (email && email.html) {
                            placeholder = email.html;
                        }

                        $($(thiz.element).find('#quillConfigureNewUserEmailsDialog_Body')[0]).summernote({
                            placeholder: placeholder, //'Hello stand alone ui',
                            tabsize: 2,
                            height: 1000, //400, // THIS IS THE ONE!!!!!!!!!!!!!!!!!!!! This is where we set the height of the email editor window. 9-26-2023.
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

                        var emailTemplateForSubject;
                        if (email && email.subject) {
                            emailTemplateForSubject = email.subject;
                        }
                        var emailTemplate;
                        if (email && email.html) {
                            emailTemplate = email.html;
                        }
                        if (emailTemplateForSubject && emailTemplateForSubject != '') {
                            $(thiz.element).find('#quillConfigureNewUserEmailsDialog_Subject')[0].value = emailTemplateForSubject;
                        } else {
                            $(thiz.element).find('#quillConfigureNewUserEmailsDialog_Subject')[0].value = '';
                        }
                        if (emailTemplate && emailTemplate != '') {
                            $(thiz.element).find('#quillConfigureNewUserEmailsDialog_Body').summernote('reset');
                            //$(thiz.element).find('#quillConfigureNewUserEmailsDialog_Body').summernote('pasteHTML', emailTemplate);
                            $(thiz.element).find('#quillConfigureNewUserEmailsDialog_Body').summernote('code', emailTemplate); // Warning, using 'pasteHTML' add some extra <p> that will mess up your original HTML. Use 'code' instead????

                            //$(thiz.element).find('#quillConfigureNewUserEmailsDialog_Body')[0].summernote('reset');
                            //$(thiz.element).find('#quillConfigureNewUserEmailsDialog_Body')[0].summernote('pasteHTML', emailTemplate);
                        } else {
                            $(thiz.element).find('#quillConfigureNewUserEmailsDialog_Body').summernote('reset');
                            //$(thiz.element).find('#quillConfigureNewUserEmailsDialog_Body')[0].summernote('reset');
                        }
                        //var html = '';

                        //html += '               <span id="spanSelectedEmailSubject" style="font-size:13pt;font-weight:bold;color:#95b1d3;"></span>';
                        //html += '               <br />';
                        //html += '               <span id="spanSelectedEmail"></span>';


                        //debugger;

                        //$(this.element).find('#spanSelectedEmailSubject')[0].innerHTML = html;






                        console.log('In bwConfiguration.js.viewIndividualEmail_TrashBin(). Turned off this call to bwActiveMenu.js.adjustLeftSideMenu(). DO WE NEED IT BACK????????? 12-24-2022');
                        // THIS IS THE FIRST TIME WE ARE USING setTimeout for the call to bwActiveMenu.adjustLeftSideMenu(). 4-25-2022
                        //setTimeout(function () { // Only needs to happen for Chrome.
                        //    // menu should be re-done since the display has probably resized from the display of the email.
                        //    //alert('Calling bwActiveMenu.adjustLeftSideMenu().');
                        //    displayAlertDialog('Calling bwActiveMenu.adjustLeftSideMenu(). xcx123423521-6.');
                        //    $('.bwActiveMenu').bwActiveMenu('adjustLeftSideMenu');
                        //}, 500);


                        if (!(email.TheUserHasReadThisEmail && (email.TheUserHasReadThisEmail == true))) {

                            //
                            //
                            // If this email is marked as unread, then we do a web service call here to mark this email as read on the server. 11-2-2023.
                            //
                            //

                            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

                            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

                            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                            var data = {
                                bwParticipantId_LoggedIn: participantId,
                                bwActiveStateIdentifier: activeStateIdentifier,
                                bwWorkflowAppId_LoggedIn: workflowAppId,

                                bwWorkflowAppId: workflowAppId,
                                bwParticipantId: participantId,
                                _id: _id
                            };

                            $.ajax({
                                url: thiz.options.operationUriPrefix + "_bw/MarkSingleEmailAsRead",
                                type: "POST",
                                data: data,
                                headers: {
                                    "Accept": "application/json; odata=verbose"
                                },
                                success: function (results) {
                                    try {

                                        if (results.status != 'SUCCESS') {

                                            displayAlertDialog(JSON.stringify(results));

                                        } else {
                                            debugger;
                                            console.log('The email was successfully marked as read. _id: ' + _id + ', results.message: ' + results.message);

                                            console.log('The email was successfully marked as read. We updated options.TrashBin and redid the UI so that the user gets visual feedback.');

                                            for (var i = 0; i < thiz.options.TrashBin.length; i++) {
                                                if (thiz.options.TrashBin[i]._id == _id) { // We can't use message_id because it may have an @ sign in it, which is not allowed in a valid html element id.

                                                    thiz.options.TrashBin[i].TheUserHasReadThisEmail = true;

                                                    var inboxEmails = $(thiz.element).find('.bwEmailInboxRow');

                                                    for (var j = 0; j < inboxEmails.length; j++) {

                                                        var tmpId = $(inboxEmails[j]).attr('_id');
                                                        if (tmpId == _id) {
                                                            debugger;
                                                            // We have found the email entry. Change the UI.
                                                            var emailAddressElement = $(inboxEmails[j]).find('.bwEmailInboxRow_EmailAddress')[0];
                                                            var subjectElement = $(inboxEmails[j]).find('.bwEmailInboxRow_Subject')[0];
                                                            $(emailAddressElement).css('fontWeight', 'normal');
                                                            $(subjectElement).css('fontWeight', 'lighter');
                                                            break;

                                                        }
                                                    }

                                                    break;

                                                }
                                            }

                                        }

                                    } catch (e) {
                                        console.log('Exception in bwConfiguration.js.viewIndividualEmail_TrashBin():2: ' + e.message + ', ' + e.stack);
                                        displayAlertDialog('Exception in bwConfiguration.js.viewIndividualEmail_TrashBin():2: ' + e.message + ', ' + e.stack);
                                    }
                                },
                                error: function (data, errorCode, errorMessage) {
                                    console.log('Error in bwConfiguration.js.viewIndividualEmail_TrashBin():' + errorCode + ', ' + errorMessage);
                                    displayAlertDialog('Error in bwConfiguration.js.viewIndividualEmail_TrashBin():' + errorCode + ', ' + errorMessage);
                                }
                            });

                        }

                    } catch (e) {
                        console.log('Exception in bwConfiguration.js.viewIndividualEmail_TrashBin():4: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwConfiguration.js.viewIndividualEmail_TrashBin():4: ' + e.message + ', ' + e.stack);
                    }

                }).catch(function (e) {

                    console.log('Exception in bwConfiguration.js.viewIndividualEmail_TrashBin():3: ' + JSON.stringify(e));
                    displayAlertDialog('Exception in bwConfiguration.js.viewIndividualEmail_TrashBin():3: ' + JSON.stringify(e));

                });

            }

        } catch (e) {
            console.log('Exception in bwConfiguration.js.viewIndividualEmail_TrashBin(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ': ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwConfiguration.js.viewIndividualEmail_TrashBin(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ': ' + e.message + ', ' + e.stack);
        }
    },

    loadIndividualEmail_TrashBin: function (_id) {
        var thiz = this;
        return new Promise(function (resolve, reject) {
            try {
                console.log('In bwConfiguration.js.loadIndividualEmail_TrashBin(). _id: ' + _id);
                //displayAlertDialog_Persistent('In bwConfiguration.js.loadIndividualEmail_TrashBin(). _id: ' + _id);

                var hasBeenLoaded;
                for (var i = 0; i < thiz.options.TrashBin.length; i++) {
                    if (thiz.options.TrashBin[i]._id == _id) {

                        if (thiz.options.TrashBin[i].html) {
                            hasBeenLoaded = true;
                        }

                    }
                }

                if (hasBeenLoaded == true) {

                    // It has already been loaded.
                    resolve();

                } else {

                    var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                    var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

                    if (!(workflowAppId && participantId && _id)) {

                        var msg = 'Error in bwConfiguration.js.loadIndividualEmail_TrashBin(): Invalid value. Expected values for workflowAppId: ' + workflowAppId + ', participantId: ' + participantId + ', _id: ' + _id;
                        console.log(msg);

                        var result = {
                            status: 'ERROR',
                            message: msg
                        }
                        reject(result);

                    } else {

                        var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                        var data = {
                            bwParticipantId_LoggedIn: participantId,
                            bwActiveStateIdentifier: activeStateIdentifier,
                            bwWorkflowAppId_LoggedIn: workflowAppId,

                            bwWorkflowAppId: workflowAppId,
                            bwParticipantId: participantId,
                            _id: _id
                        };
                        $.ajax({
                            url: thiz.options.operationUriPrefix + "_bw/getsingleparticipantemail_trashbin",
                            type: "POST",
                            data: data,
                            headers: {
                                "Accept": "application/json; odata=verbose"
                            },
                            success: function (results) {
                                try {
                                    //displayAlertDialog_Persistent('xcx2331234 RESPONSE FROM SERVER FOR getsingleparticipantemail_inbox. status: ' + results.status + ', message: ' + results.message);
                                    if (results.status != 'SUCCESS') {

                                        //thiz.element.html(''); // This actually works to get rid of the widget. Ha! 11-8-2023.

                                        var msg = 'Error in bwConfiguration.js.loadIndividualEmail_TrashBin():xcx542: results: ' + JSON.stringify(results);
                                        console.log(msg);

                                        var result = {
                                            status: 'ERROR',
                                            message: msg
                                        }
                                        reject(result);

                                    } else {

                                        var foundIt;
                                        for (var i = 0; i < thiz.options.TrashBin.length; i++) {
                                            if (thiz.options.TrashBin[i]._id == _id) {

                                                //displayAlertDialog_Persistent('BACKFILLING EMAIL BODY. i: ' + i + ', : ' + results.results.html);
                                                thiz.options.TrashBin[i].html = results.results.html; //.text; //  splice(i, 1); // Delete the item from the array.
                                                foundIt = true;

                                            }
                                        }
                                        debugger;
                                        if (!foundIt) {

                                            var msg = 'Error in bwConfiguration.js.loadIndividualEmail_TrashBin():xcx231312: Could not find the email.';
                                            console.log(msg);

                                            var result = {
                                                status: 'ERROR',
                                                message: msg
                                            }
                                            reject(result);

                                        } else {

                                            resolve();

                                        }

                                    }

                                } catch (e) {

                                    var msg = 'Exception in bwConfiguration.js.loadIndividualEmail_TrashBin():2: ' + e.message + ', ' + e.stack;
                                    console.log(msg);

                                    var result = {
                                        status: 'EXCEPTION',
                                        message: msg
                                    }
                                    reject(result);

                                }
                            },
                            error: function (data, errorCode, errorMessage) {

                                var msg = 'Error in bwConfiguration.js.loadIndividualEmail_TrashBin():' + errorCode + ', ' + errorMessage;
                                console.log(msg);

                                var result = {
                                    status: 'ERROR',
                                    message: msg
                                }
                                reject(result);

                            }
                        });

                    }

                }

            } catch (e) {

                var msg = 'Exception in bwConfiguration.js.loadIndividualEmail_TrashBin():xcx453: ' + e.message + ', ' + e.stack;

                var result = {
                    status: 'EXCEPTION',
                    message: msg
                }
                reject(result);

            }

        })
    },




    deleteIndividualEmail: function (_id) {
        try {
            console.log('In bwConfiguration.js.deleteIndividualEmail(). _id: ' + _id);
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            if (!(workflowAppId && participantId && _id)) {

                console.log('Error in bwConfiguration.js.deleteIndividualEmail(): Invalid value. Expected values for workflowAppId: ' + workflowAppId + ', participantId: ' + participantId + ', _id: ' + _id);
                displayAlertDialog('Error in bwConfiguration.js.deleteIndividualEmail(): Invalid value. Expected values for workflowAppId: ' + workflowAppId + ', participantId: ' + participantId + ', _id: ' + _id);

            } else {

                var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                var data = {
                    bwParticipantId_LoggedIn: participantId,
                    bwActiveStateIdentifier: activeStateIdentifier,
                    bwWorkflowAppId_LoggedIn: workflowAppId,

                    bwWorkflowAppId: workflowAppId,
                    bwParticipantId: participantId,
                    _id: _id
                }

                $.ajax({
                    url: this.options.operationUriPrefix + "_bw/deleteindividualemail",
                    contentType: "application/json",
                    type: "Post",
                    data: JSON.stringify(data)
                }).success(function (result) {
                    try {

                        if (result.status != 'SUCCESS') {

                            displayAlertDialog(result.message);

                        } else {

                            console.log('The emails have been deleted.');
                            //$('#divBwEmailMonitor_DeleteSentEmailsDialog').dialog('close');

                            var foundIt;
                            for (var i = 0; i < thiz.options.Inbox.length; i++) {
                                if (thiz.options.Inbox[i]._id == _id) {
                                    // This is the one we just deleted. Instead of going out and getting the entire list again, just remove it here.
                                    thiz.options.Inbox.splice(i, 1); // Delete the item from the array.
                                    foundIt = true;
                                    break;
                                }
                            }

                            if (!foundIt) {

                                var msg = 'Error xcx231312. Could not find the email.';
                                console.log(msg);
                                displayAlertDialog(msg);

                            } else {

                                thiz.renderEmails();
                            }

                        }

                    } catch (e) {
                        console.log('Exception in deleteSelectedSentEmails():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in deleteSelectedSentEmails():2: ' + e.message + ', ' + e.stack);
                    }
                }).error(function (data) {

                    var msg;
                    //if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                    //    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                    //} else {
                    msg = data.message; //JSON.stringify(data) + ', json: ' + JSON.stringify(selectedSentEmailIdsToDelete);
                    //}
                    alert('Fail in deleteSelectedSentEmails(): ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                    console.log('Fail in deleteSelectedSentEmails(): ' + msg); // + JSON.stringify(data) + ', json: ' + JSON.stringify(selectedSentEmailIdsToDelete));
                    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                    //var error = JSON.parse(data.responseText)["odata.error"];
                    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);

                });

            }

        } catch (e) {
            var msg = 'Exception in bwConfiguration.js.deleteIndividualEmail(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
        }
    },

    searchBox_OnKeyDown: function (event) {
        try {
            console.log('In bwConfiguration.js.searchBox_OnKeyDown().');

            if (event.keyCode == 13) {
                console.log('Enter key was pressed.');
                this.search();
            }

        } catch (e) {
            console.log('Exception in bwConfiguration.js.searchBox_OnKeyDown(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwConfiguration.js.searchBox_OnKeyDown(): ' + e.message + ', ' + e.stack);
        }
    },
    search: function () {
        try {
            console.log('In bwConfiguration.js.search().');
            var thiz = this;
            // search in bwBudgetRequest:
            //      - title (eg: BR-220002)
            //      - project title (eg: partial description text)
            //      - bwBudgetRequestJson

            alert('In bwConfiguration.js.search().');

            //document.getElementById('inputBwAuthentication_SearchBox').blur(); // This is here to prevent the search box from getting the cursor and showing the keyboard.

            //var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            //var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            //var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            //var searchTerm = String($('#inputBwAuthentication_SearchBox').val()).trim();

            //ShowActivitySpinner('Searching for "' + searchTerm + '"...');

            //var data = {
            //    bwParticipantId_LoggedIn: participantId,
            //    bwActiveStateIdentifier: activeStateIdentifier,
            //    bwWorkflowAppId_LoggedIn: workflowAppId,

            //    bwWorkflowAppId: workflowAppId,
            //    searchTerm: searchTerm

            //};
            //var operationUri = webserviceurl + "/getsearchresults";
            //$.ajax({
            //    url: operationUri,
            //    type: "POST",
            //    data: data,
            //    headers: {
            //        "Accept": "application/json; odata=verbose"
            //    },
            //    success: function (results) {
            //        try {

            //            if (results.status != 'SUCCESS') {

            //                HideActivitySpinner();
            //                console.log('Error xcx12345: ' + JSON.stringify(results.message));
            //                displayAlertDialog('Error xcx12345: ' + JSON.stringify(results.message));

            //            } else {

            //                HideActivitySpinner();
            //                thiz.collapseAllAlertsSection();

            //                window.scrollTo(0, 0); // Scroll to top on button click. This makes sure things render Ok, and also just seems like a nicer user experience.	\\192.168.1.14\budgetworkflow\public\widgets\bwAuthentication.js	4102	13

            //                var accordionDrawerElement = $('#divbwExecutiveSummariesCarousel2_SearchResults');

            //                var html = '';
            //                html += '<br /><div style="">Search results for "' + results.searchTerm + '" (' + results.data.length + '):</div>';
            //                $(accordionDrawerElement).html(html);

            //                for (var i = 0; i < results.data.length; i++) {
            //                    if (i < 100) { // This is where we set how many tasks we will display in the carousel. Zero-based, so < 5 means display 5 tasks.




            //                        var title = 'Executive Summary for: ' + results.data[i].Title + '. ' + ProjectTitle_clean;

            //                        var executiveSummaryElement = document.createElement('div');
            //                        executiveSummaryElement.classList.add('executiveSummaryInCarousel');
            //                        executiveSummaryElement.setAttribute('bwbudgetrequestid', results.data[i].bwBudgetRequestId);
            //                        executiveSummaryElement.title = title;
            //                        executiveSummaryElement.alt = title;
            //                        executiveSummaryElement.style.minWidth = '300px';
            //                        executiveSummaryElement.style.maxWidth = '550px';
            //                        executiveSummaryElement.style.display = 'inline-block';
            //                        executiveSummaryElement.style.whiteSpace = 'nowrap';
            //                        executiveSummaryElement.style.color = 'rgb(38, 38, 38)';
            //                        executiveSummaryElement.style.fontFamily = '"Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif';
            //                        executiveSummaryElement.style.fontSize = '1.25em';

            //                        var ProjectTitle_clean = String(results.data[i].ProjectTitle).replace(/["]/g, '&quot;').replace(/[']/g, '\\&#39;'); //&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method.
            //                        executiveSummaryElement.setAttribute('onclick', '$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'' + results.data[i].bwBudgetRequestId + '\', \'' + results.data[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + results.data[i].Title + '\', \'' + results.data[i].bwAssignedToRaciRoleAbbreviation + '\', \'' + '7777xcx7777777-324-1' + '\');');

            //                        $(accordionDrawerElement).append(executiveSummaryElement);




            //                        console.log('Calling renderExecutiveSummaryForRequest(). xcx332-6');

            //                        var promise = thiz.renderExecutiveSummaryForRequest(results.data[i], executiveSummaryElement);
            //                        promise.then(function (result) {
            //                            // Do nothing.
            //                        }).catch(function (e) {
            //                            alert('Exception xcx33995-2-1: ' + e);
            //                        });






            //                        //var carouselItem_Id = 'bwExecutiveSummariesCarousel2_executiveSummaryInCarousel_' + i;

            //                        //var html = '';

            //                        //html += '   <div id="' + carouselItem_Id + '" title="xcx231466534-1" alt="xcx231466534-1" class="executiveSummaryInCarousel" bwbudgetrequestid="' + results.data[i].bwBudgetRequestId + '" style="min-width:300px;max-width:550px;display:inline-block;white-space:nowrap;color: rgb(38, 38, 38); font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif; font-size: 1.25em;" ';

            //                        //var ProjectTitle_clean = '[no value for ProjectTitle]';
            //                        //if (results.data[i].ProjectTitle) {
            //                        //    ProjectTitle_clean = String(results.data[i].ProjectTitle).replace(/["]/g, '&quot;').replace(/[']/g, '\\&#39;'); //&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method.
            //                        //}
            //                        //html += '   xcx="342523326-5"    onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'' + results.data[i].bwBudgetRequestId + '\', \'' + results.data[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + results.data[i].Title + '\', \'' + results.data[i].bwAssignedToRaciRoleAbbreviation + '\', \'' + '' + '\');" ';
            //                        //html += '   >';

            //                        //html += '</div>';

            //                        //$(accordionDrawerElement).append(html);

            //                        //console.log('Calling renderExecutiveSummaryForRequest(). xcx332-5');
            //                        //var promise = thiz.renderExecutiveSummaryForRequest(results.data[i], accordionDrawerElement); //'divBwExecutiveSummariesCarousel_AllActiveRequests');
            //                        //promise.then(function (result) {
            //                        //    // Do nothing.
            //                        //}).catch(function (e) {
            //                        //    displayAlertDialog('Exception in bwExecutiveSummariesCarousel2.js.search(). xcx33995-2-dfssd: ' + JSON.stringify(e));
            //                        //});









            //                    } else {
            //                        break;
            //                    }

            //                }

            //            }

            //        } catch (e) {
            //            HideActivitySpinner();
            //            console.log('Exception in bwConfiguration.js.search.getsearchresults.success(): ' + e.message + ', ' + e.stack);
            //            displayAlertDialog('Exception in bwConfiguration.js.search.getsearchresults.success(): ' + e.message + ', ' + e.stack);
            //        }
            //    },
            //    error: function (data, errorCode, errorMessage) {
            //        HideActivitySpinner();
            //        console.log('Error in bwConfiguration.js.search.getsearchresults.error(): ' + errorCode + ', ' + errorMessage + JSON.stringify(data));
            //        displayAlertDialog('Error in bwConfiguration.js.search.getsearchresults.error(): ' + errorCode + ', ' + errorMessage + JSON.stringify(data));
            //    }
            //});

        } catch (e) {
            HideActivitySpinner();
            console.log('Exception in bwConfiguration.js.search(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwConfiguration.js.search(): ' + e.message + ', ' + e.stack);
        }
    },

    composeANewEmailMessage: function () {
        try {
            console.log('In bwConfiguration.js.composeANewEmailMessage().');
            //alert('In bwConfiguration.js.composeANewEmailMessage().');

            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');


            $('#divPageContent2_Title').html('✉&nbsp;NEW MESSAGE');

            // Select the HOME button here. 1-4-2024.
            var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');

            var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

            // Step 1: Make all of the buttons un-selected.
            $('.bwConfiguration:first').find('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
            });

            // Step 2: Set the specified button as the selected one.
            $('#divInnerLeftMenuButton_NewMessage').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);


            var html = '';

            //html += 'In bwConfiguration.js.composeANewEmailMessage().';
            html += '';
            html += '';
            html += '';
            html += '';
            html += '';
            html += '';



            html += '               <span id="spanSelectedEmailSubject" style="font-size:13pt;font-weight:bold;color:#95b1d3;"></span>';
            html += '               <br />';
            html += '               <span id="spanSelectedEmail"></span>';

            $('#divEmailClient_CompositionWindow').html(html);

            $('#spanSelectedEmailSubject').html('[spanSelectedEmailSubject] xcx21313442 It would be great to get sending text messages working from here really well..');

            $('#spanSelectedEmail').html('[spanSelectedEmail]');


            html = '';

            html += '<button class="BwSmallButton" onclick="$(\'.bwConfiguration:first\').bwConfiguration(\'SendSingleEmailNow\');">SEND NOW >></button>';

            html += '<br />';
            html += 'TO:';
            html += '<br />';
            html += '<input type="text" id="bwConfiguration_RecipientsList" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';

            html += '<br />';
            html += 'FROM:';
            html += '<br />';
            html += '<input type="text" value="' + participantEmail + '" id="bwConfiguration_From" xcx="xcx2314" readonly="true" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';

            html += '<br />';
            html += 'SUBJECT:';
            html += '<br />';
            html += '<input type="text" id="bwConfiguration_EmailSubject" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';

            html += '<br />';
            html += 'BODY:';
            html += '<br />';
            html += '<div id="bwConfiguration_EmailBody" class="xdTextBoxRequired bwRequestJson" contenteditable="true" bwdatarequired="true" bwfieldname="JustificationDetails" title="" style="height:500px; min-height: 100% !important;WORD-WRAP: break-word; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%;BACKGROUND-COLOR: white;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';
            html += '</div>';

            $('#spanSelectedEmail').html(html);

        } catch (e) {
            console.log('Exception in bwConfiguration.js.composeANewEmailMessage(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwConfiguration.js.composeANewEmailMessage(): ' + e.message + ', ' + e.stack);
        }
    },
    composeANewEmailMessage_Reply: function () {
        try {
            console.log('In bwConfiguration.js.composeANewEmailMessage_Reply().');
            //alert('In bwConfiguration.js.composeANewEmailMessage_Reply().');

            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');




            var bwConfiguration_RecipientsList = $('#bwEmailView_From').find('.EmailAddress_From')[0].innerHTML; // Just picking the first one.

            var subject = $(this.element).find('#quillConfigureNewUserEmailsDialog_Subject')[0].value;
            subject = subject.replaceAll('<', '').replaceAll('>', '');
            subject = 'Re: ' + subject;

            var body = $(this.element).find('#quillConfigureNewUserEmailsDialog_Body')[0].value;
            //body = encodeURI(body);
            body = '<br /><br /><br />Recieved xxx-xx-xx<br />Date: xxxx<br />==========================<br /><br />' + body;


            var html = '';

            //html += 'In bwConfiguration.js.composeANewEmailMessage_Reply().';
            html += '';
            html += '';
            html += '';
            html += '';
            html += '';
            html += '';



            html += '               <span id="spanSelectedEmailSubject" style="font-size:13pt;font-weight:bold;color:#95b1d3;"></span>';
            html += '               <br />';
            html += '               <span id="spanSelectedEmail"></span>';

            $('#divEmailClient_CompositionWindow').html(html);

            $('#spanSelectedEmailSubject').html('[spanSelectedEmailSubject] xcx21313442 It would be great to get sending text messages working from here really well..');

            $('#spanSelectedEmail').html('[spanSelectedEmail]');



            html = '';

            html += '<button class="BwSmallButton" onclick="$(\'.bwConfiguration:first\').bwConfiguration(\'SendSingleEmailNow\');">SEND NOW >></button>';

            html += '<br />';
            html += 'TO:';
            html += '<br />';
            html += '<input type="text" value="' + bwConfiguration_RecipientsList + '" id="bwConfiguration_RecipientsList" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';

            html += '<br />';
            html += 'FROM:';
            html += '<br />';
            html += '<input type="text" value="' + participantEmail + '" id="bwConfiguration_From" xcx="xcx2314" readonly="true" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';

            html += '<br />';
            html += 'SUBJECT:';
            html += '<br />';
            html += '<input type="text" value="' + subject + '" id="bwConfiguration_EmailSubject" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';

            html += '<br />';
            html += 'BODY:';
            html += '<br />';
            html += '<div id="bwConfiguration_EmailBody" class="xdTextBoxRequired bwRequestJson" contenteditable="true" bwdatarequired="true" bwfieldname="JustificationDetails" title="" style="height:500px; min-height: 100% !important;WORD-WRAP: break-word; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%;BACKGROUND-COLOR: white;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';
            html += body;
            html += '</div>';

            $('#spanSelectedEmail').html(html);





        } catch (e) {
            console.log('Exception in bwConfiguration.js.composeANewEmailMessage_Reply(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwConfiguration.js.composeANewEmailMessage_Reply(): ' + e.message + ', ' + e.stack);
        }
    },
    SendSingleEmailNow: function () {
        try {
            console.log('In bwConfiguration.js.SendSingleEmailNow().');

            var to; // = [];
            var singleRecipient = $('#bwConfiguration_RecipientsList').val(); // 'fred@budgetworkflow.com;betty@budgetworkflow.com;dino@budgetworkflow.com'
            to = singleRecipient;

            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');

            var from = participantEmail;

            var subject = $('#bwConfiguration_EmailSubject').val(); //'test subject xcx2131234234';

            var body = $('#bwConfiguration_EmailBody').html(); //'test body xcx12346u';

            var proceed = confirm('Confirm these email details: \nTO: ' + to + '\nSUBJECT: ' + subject + '\nBODY: ' + body);
            if (proceed) {

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
                    bwParticipantEmail: participantEmail,
                    bwParticipantFriendlyName: participantFriendlyName,

                    To: to,
                    From: from,
                    Subject: subject,
                    Body: body
                };

                $.ajax({
                    url: this.options.operationUriPrefix + "_bw/SendSingleEmailNow",
                    type: "POST",
                    data: data,
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    },
                    success: function (results) {
                        try {

                            if (results.status != 'SUCCESS') {

                                displayAlertDialog(JSON.stringify(results));

                            } else {

                                console.log(results.message);
                                displayAlertDialog('The email was sent successfully.');

                            }

                        } catch (e) {
                            console.log('Exception in SendSingleEmailNow():2: ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in SendSingleEmailNow():2: ' + e.message + ', ' + e.stack);
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        console.log('Error in SendSingleEmailNow():' + errorCode + ', ' + errorMessage);
                        displayAlertDialog('Error in SendSingleEmailNow():' + errorCode + ', ' + errorMessage);
                    }
                });

            }

        } catch (e) {
            console.log('Exception in SendSingleEmailNow(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in SendSingleEmailNow(): ' + e.message + ', ' + e.stack);
        }
    },
    expandOrCollapseForestPendingEmails: function (bwWorkflowAppId) {
        try {
            var thiz = this;
            var img = document.getElementById('emailSectionImage_ForestPendingEmails');
            var urlClose = 'images/drawer-close.png';
            var urlOpen = 'images/drawer-open.png';

            if (img.src.indexOf(urlClose) > -1) {
                document.getElementById('trEmailSection_ForestPendingEmails').style.display = 'none';
                document.getElementById('emailSectionImage_ForestPendingEmails').src = urlOpen;
            } else {
                document.getElementById('trEmailSection_ForestPendingEmails').style.display = 'table-row';
                document.getElementById('emailSectionImage_ForestPendingEmails').src = urlClose;

                $.ajax({
                    url: webserviceurl + "/bwwebapppendingemailorgs",
                    type: "DELETE",
                    contentType: 'application/json',
                    success: function (data) {
                        try {
                            var html = '';
                            html += '                   <div class="spanButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayForestPendingEmails\', \'' + 'all' + '\');" style="text-align:left;font-size:14px;white-space:nowrap;cursor:pointer;padding:20px 20px 20px 20px;" title="">';
                            html += '                       &nbsp;&nbsp;&nbsp;&nbsp;' + 'ADMIN/ALL';
                            html += '                   </div>';
                            if (!data.length || data.length == 0) {
                                html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
                                html += '  There are no forest pending emails for any orgs.';
                                html += '<span>';
                            } else {
                                for (var i = 0; i < data.length; i++) {
                                    html += '                   <div class="spanButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayForestPendingEmails\', \'' + data[i].bwWorkflowAppId + '\');" style="text-align:left;font-size:14px;white-space:nowrap;cursor:pointer;padding:20px 20px 20px 20px;" title="' + 'Owner: ' + data[i].bwTenantOwnerFriendlyName + ' (' + data[i].bwTenantOwnerEmail + ')' + '">';
                                    html += '                       &nbsp;&nbsp;&nbsp;&nbsp;' + data[i].bwWorkflowAppTitle;
                                    html += '                   </div>';
                                }
                            }

                            // Render the html.
                            $(thiz.element).find('#divForestPendingEmailOrgsList')[0].innerHTML = html;

                        } catch (e) {
                            console.log('Exception in expandOrCollapseForestPendingEmails(): ' + e.message + ', ' + e.stack);
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        displayAlertDialog('Error in xx.js.expandOrCollapseForestPendingEmails():' + errorCode + ', ' + errorMessage);
                    }
                });
            }
        } catch (e) {
            console.log('Exception in expandOrCollapseForestPendingEmails(): ' + e.message + ', ' + e.stack);
        }
    },
    expandOrCollapsePendingEmails: function (bwWorkflowAppId) {
        try {
            var thiz = this;
            var img = document.getElementById('emailSectionImage_PendingEmails');
            var urlClose = 'images/drawer-close.png';
            var urlOpen = 'images/drawer-open.png';

            if (img.src.indexOf(urlClose) > -1) {
                document.getElementById('trEmailSection_PendingEmails').style.display = 'none';
                document.getElementById('emailSectionImage_PendingEmails').src = urlOpen;
            } else {
                document.getElementById('trEmailSection_PendingEmails').style.display = 'table-row';
                document.getElementById('emailSectionImage_PendingEmails').src = urlClose;

                $.ajax({
                    url: webserviceurl + "/bwwebapppendingemailorgs",
                    type: "DELETE",
                    contentType: 'application/json',
                    success: function (data) {
                        try {
                            var html = '';
                            html += '                   <div class="spanButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayPendingEmails\', \'' + 'all' + '\');" style="text-align:left;font-size:14px;white-space:nowrap;cursor:pointer;padding:20px 20px 20px 20px;" title="">';
                            html += '                       &nbsp;&nbsp;&nbsp;&nbsp;' + 'ADMIN/ALL';
                            html += '                   </div>';
                            if (!data.length || data.length == 0) {
                                html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
                                html += '  There are no pending emails for any orgs.';
                                html += '<span>';
                            } else {
                                for (var i = 0; i < data.length; i++) {
                                    html += '                   <div class="spanButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayPendingEmails\', \'' + data[i].bwWorkflowAppId + '\');" style="text-align:left;font-size:14px;white-space:nowrap;cursor:pointer;padding:20px 20px 20px 20px;" title="' + 'Owner: ' + data[i].bwTenantOwnerFriendlyName + ' (' + data[i].bwTenantOwnerEmail + ')' + '">';
                                    html += '                       &nbsp;&nbsp;&nbsp;&nbsp;' + data[i].bwWorkflowAppTitle;
                                    html += '                   </div>';
                                }
                            }

                            // Render the html.
                            $(thiz.element).find('#divPendingEmailOrgsList')[0].innerHTML = html;

                        } catch (e) {
                            console.log('Exception in expandOrCollapsePendingEmails(): ' + e.message + ', ' + e.stack);
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        displayAlertDialog('Error in xx.js.expandOrCollapsePendingEmails():' + errorCode + ', ' + errorMessage);
                    }
                });
            }
        } catch (e) {
            console.log('Exception in expandOrCollapsePendingEmails(): ' + e.message + ', ' + e.stack);
        }
    },
    expandOrCollapseSentEmails: function (bwWorkflowAppId) {
        try {
            console.log('In expandOrCollapseSentEmails(). bwWorkflowAppId: ' + bwWorkflowAppId);
            var thiz = this;

            var img = document.getElementById('emailSectionImage_SentEmails');
            var urlClose = 'images/drawer-close.png';
            var urlOpen = 'images/drawer-open.png';

            if (img.src.indexOf(urlClose) > -1) {
                document.getElementById('trEmailSection_SentEmails').style.display = 'none';
                document.getElementById('emailSectionImage_SentEmails').src = urlOpen;
            } else {
                document.getElementById('trEmailSection_SentEmails').style.display = 'table-row';
                document.getElementById('emailSectionImage_SentEmails').src = urlClose;

                $.ajax({
                    url: webserviceurl + "/bwwebappsentemailorgs",
                    type: "DELETE",
                    contentType: 'application/json',
                    success: function (result) {
                        try {
                            //displayAlertDialog(result.sentEmailWorkflowAppIds_ForTesting);

                            var data = result.data;
                            var html = '';
                            html += '                   <div class="spanButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displaySentEmails\', \'' + 'all' + '\');" style="text-align:left;font-size:14px;white-space:nowrap;cursor:pointer;padding:20px 20px 20px 20px;" title="">';
                            html += '                       &nbsp;&nbsp;&nbsp;&nbsp;' + 'ADMIN/ALL';
                            html += '                   </div>';
                            if (!data.length || data.length == 0) {
                                html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
                                html += '  There are no sent emails for any orgs.';
                                html += '<span>';
                            } else {
                                for (var i = 0; i < data.length; i++) {
                                    html += '                   <div class="spanButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displaySentEmails\', \'' + data[i].bwWorkflowAppId + '\');" style="text-align:left;font-size:14px;white-space:nowrap;cursor:pointer;padding:20px 20px 20px 20px;" title="' + 'Owner: ' + data[i].bwTenantOwnerFriendlyName + ' (' + data[i].bwTenantOwnerEmail + ')' + '">';
                                    html += '                       &nbsp;&nbsp;&nbsp;&nbsp;' + data[i].bwWorkflowAppTitle;
                                    html += '                   </div>';
                                }
                            }

                            // Render the html.
                            $(thiz.element).find('#divSentEmailOrgsList')[0].innerHTML = html;

                        } catch (e) {
                            console.log('Exception in bwConfiguration.js.expandOrCollapseSentEmails():1: ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in bwConfiguration.js.expandOrCollapseSentEmails():1: ' + e.message + ', ' + e.stack);
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        console.log('Error in bwConfiguration.js.expandOrCollapseSentEmails():' + errorCode + ', ' + errorMessage);
                        displayAlertDialog('Error in bwConfiguration.js.expandOrCollapseSentEmails():' + errorCode + ', ' + errorMessage);
                    }
                });
            }
        } catch (e) {
            console.log('Exception in bwConfiguration.js.expandOrCollapseSentEmails(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwConfiguration.js.expandOrCollapseSentEmails(): ' + e.message + ', ' + e.stack);
        }
    },
    expandOrCollapseErrorsAndSuggestions: function (bwWorkflowAppId) {
        try {
            var thiz = this;
            var img = document.getElementById('emailSectionImage_ErrorsAndSuggestions');
            var urlClose = 'images/drawer-close.png';
            var urlOpen = 'images/drawer-open.png';

            if (img.src.indexOf(urlClose) > -1) {
                document.getElementById('trEmailSection_ErrorsAndSuggestions').style.display = 'none';
                document.getElementById('emailSectionImage_ErrorsAndSuggestions').src = urlOpen;
            } else {
                document.getElementById('trEmailSection_ErrorsAndSuggestions').style.display = 'table-row';
                document.getElementById('emailSectionImage_ErrorsAndSuggestions').src = urlClose;

                $.ajax({
                    url: webserviceurl + "/bwwebapperrorandsuggestionorgs",
                    type: "DELETE",
                    contentType: 'application/json',
                    success: function (data) {
                        try {
                            var html = '';
                            html += '                   <div class="spanButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayErrorsAndSuggestions\', \'' + 'all' + '\');" style="text-align:left;font-size:14px;white-space:nowrap;cursor:pointer;padding:20px 20px 20px 20px;" title="">';
                            html += '                       &nbsp;&nbsp;&nbsp;&nbsp;' + 'ADMIN/ALL';
                            html += '                   </div>';
                            if (!data.length || data.length == 0) {
                                html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
                                html += '  There are no errors or suggestions for any orgs.';
                                html += '<span>';
                            } else {
                                for (var i = 0; i < data.length; i++) {
                                    html += '                   <div class="spanButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'displayErrorsAndSuggestions\', \'' + data[i].bwWorkflowAppId + '\');" style="text-align:left;font-size:14px;white-space:nowrap;cursor:pointer;padding:20px 20px 20px 20px;" title="' + 'Owner: ' + data[i].bwTenantOwnerFriendlyName + ' (' + data[i].bwTenantOwnerEmail + ')' + '">';
                                    html += '                       &nbsp;&nbsp;&nbsp;&nbsp;' + data[i].bwWorkflowAppTitle;
                                    html += '                   </div>';
                                }
                            }

                            // Render the html.
                            $(thiz.element).find('#divErrorsAndSuggestionsOrgsList')[0].innerHTML = html;

                        } catch (e) {
                            console.log('Exception in expandOrCollapseErrorsAndSuggestions(): ' + e.message + ', ' + e.stack);
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        displayAlertDialog('Error in xx.js.expandOrCollapseErrorsAndSuggestions():' + errorCode + ', ' + errorMessage);
                    }
                });
            }
        } catch (e) {
            console.log('Exception in expandOrCollapseErrorsAndSuggestions(): ' + e.message + ', ' + e.stack);
        }
    },

    sentEmail_OnScroll: function (element) {
        try {
            //console.log('In sentEmail_OnScroll(). $(element).scrollTop(): ' + $(element).scrollTop() + ', $(element).height(): ' + $(element).height() + ', $(document).height(): ' + $(document).height() + ', tableSentEmail1.height(): ' + $('#tableSentEmail1').height());
            if ($('#tableSentEmail1').height() == $(element).height() + $(element).scrollTop()) {
                //
                // The user has scrolled to the bottom, so we need to fetch another page of data and append to the div/table.
                //
                console.log('In sentEmail_OnScroll(). ajax call get data from server and append to the div.');
                this.options.pagingPage_SentEmail = this.options.pagingPage_SentEmail + 1; // Increment the page counter.
                var bwWorkflowAppId = document.getElementById('tableSentEmail1').getAttribute('bwworkflowappid'); // We stored the value in the table attribute so we could esily find it any time.
                var json = {
                    bwWorkflowAppId: bwWorkflowAppId,
                    pagingPage: this.options.pagingPage_SentEmail,
                    pagingLimit: this.options.pagingLimit_SentEmail
                }
                $.ajax({
                    url: webserviceurl + "/bwadminsentemail2",
                    type: "POST",
                    timeout: this.options.ajaxTimeout,
                    data: json,
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    },
                    success: function (data) {
                        try {
                            if (!data.length || data.length == 0) {
                                // Do nothing, we must be displaying all of the data.
                            } else {
                                var html = '';
                                for (var i = 0; i < data.length; i++) {
                                    html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" xcx="xcx2224555-1" onclick="$(\'.bwConfiguration\').bwConfiguration(\'viewIndividualEmail_Inbox\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwSentEmailId + '\');" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
                                    html += '    <td style="vertical-align:top;"><input type="checkbox" class="sentEmailCheckbox" bwsentemailid="' + data[i].bwSentEmailId + '" /></td>';
                                    //var timestamp = getFriendlyDateAndTime(data[i].Timestamp);
                                    html += '    <td colspan="4" style="border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px;">';
                                    html += '       <span style="font-weight:bold;color:black;">' + data[i].ToParticipantFriendlyName + '<br />';


                                    //html += '           <span style="font-weight:normal;color:tomato;">' + timestamp + '</span>';
                                    // 2-3-2022
                                    var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(data[i].Timestamp);
                                    html += '<span style="font-weight:normal;color:tomato;">' + timestamp4 + '</span>';


                                    html += '           <br />';
                                    html += '       </span>';
                                    html += '       <span style="font-weight:lighter;color:#95b1d3;">' + data[i].Subject.substring(0, 55) + ' ...</span>';
                                    html += '       <br />';
                                    html += '   </td>';
                                    html += '  </tr>';
                                }
                                $('#tableSentEmail1 tr:last').after(html); // Append the rows to the table.
                            }
                        } catch (e) {
                            console.log('Exception in sentEmail_OnScroll(): ' + e.message + ', ' + e.stack);
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        displayAlertDialog('Error in sentEmail_OnScroll():' + errorCode + ', ' + errorMessage);
                    }
                });
            }
        } catch (e) {
            console.log('Exception in sentEmail_OnScroll(): ' + e.message + ', ' + e.stack);
        }
    },

    displayForestPendingEmails: function (bwWorkflowAppId) {
        try {
            console.log('In displayForestPendingEmails().');
            var thiz = this;
            try {
                var html = '';
                html += '<input type="checkbox" id="checkboxToggleForestPendingEmailCheckboxes" onchange="$(\'.bwConfiguration\').bwConfiguration(\'toggleForestPendingEmailCheckboxes\', this);" />';
                html += '                           <span style="padding: 4px 4px 4px 4px;border:1px solid lightblue;cursor:pointer;" onclick="$(\'.bwConfiguration\').bwConfiguration(\'cmdDisplayDeleteForestPendingEmailsDialog\');">';
                html += '                               <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png">&nbsp;Delete';
                html += '                           </span>';
                html += '<br />';
                html += 'Forest Pending Email';
                $(thiz.element).find('#spanSelectedEmailType_Title')[0].innerHTML = html; //'Pending Email';

                $(thiz.element).find('#tdDisplayForestPendingEmailButton')[0].style.backgroundColor = 'lightskyblue';
                $(thiz.element).find('#spanDisplaySentEmailButton')[0].style.backgroundColor = 'white';

                $(thiz.element).find('#spanDisplayErrorsAndSuggestionsButton')[0].style.backgroundColor = 'white';
            } catch (e) { }

            // Clear these in the beginning, because it may take a few seconds to re-populate, and this gives the user some visual feedback that something is going on.
            $(thiz.element).find('#spanEmailPicker')[0].innerHTML = '';
            $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = '';

            $.ajax({
                url: webserviceurl + "/bwadminforestpendingemail/" + bwWorkflowAppId,
                type: "DELETE",
                contentType: 'application/json',
                success: function (data) {
                    try {
                        var html = '';
                        //alert(JSON.stringify(data));
                        if (!data.length || data.length == 0) {
                            html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
                            html += '  There are no forest pending emails.';
                            html += '<span>';
                            $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;
                            $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = '';
                        } else {
                            html = '<table>';
                            for (var i = 0; i < data.length; i++) {
                                html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onclick="$(\'.bwConfiguration\').bwConfiguration(\'viewForestPendingEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwPendingEmailId + '\');" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
                                html += '    <td style="vertical-align:top;"><input type="checkbox" class="pendingEmailCheckbox" bwpendingemailid="' + data[i].bwPendingEmailId + '" /></td>';
                                //var timestamp = getFriendlyDateAndTime(data[i].Timestamp);
                                html += '    <td colspan="4" style="border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px;">';
                                html += '<span style="font-weight:bold;color:black;">' + data[i].ToParticipantFriendlyName + '<br />';


                                //html += '<span style="font-weight:normal;color:tomato;">' + timestamp + '</span>';
                                // 2-3-2022
                                var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(data[i].Timestamp);
                                html += '<span style="font-weight:normal;color:tomato;">' + timestamp4 + '</span>';



                                html += '       <br />';
                                html += '</span>';
                                if (data[i].Subject && data[i].Subject.length > 56) {
                                    html += '<span style="font-weight:lighter;color:#95b1d3;">' + data[i].Subject.substring(0, 55) + ' ...</span>';
                                } else {
                                    html += '<span style="font-weight:lighter;color:#95b1d3;">' + data[i].Subject + ' ...</span>';
                                }

                                html += '       <br />';
                                html += '   </td>';
                                html += '  </tr>';
                            }
                            html += '</table>';

                            $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;

                            html = '';
                            html += '                       <div class="spanButton" style="width:100px;text-align:right;" title="Click to send this email now!" onclick="$(\'.bwConfiguration\').bwConfiguration(\'sendForestPendingEmailNow\');">';
                            html += '                           ✉&nbsp;Send Now >xcx5-1 add check to send changes or not';
                            html += '                       </div>';
                            html += '<span id="spanSelectedEmailSubject" style="font-size:13pt;font-weight:bold;color:#95b1d3;"></span>';
                            html += '<br /><br />';
                            // Quill subject editor.
                            html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                            html += 'Subject:';
                            html += '</span>';
                            html += '<br />';
                            html += '   <div id="bwQuilltoolbarForSubject">';
                            html += '       <button id="btnQuill_InsertADataItemForSubject" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
                            html += '   </div>';
                            //html += '   <div id="quillConfigureNewUserEmailsDialog_Subject" style="height:50px;"></div>'; // Quill.
                            html += '<input type="text" id="quillConfigureNewUserEmailsDialog_Subject" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';

                            // Quill body editor.
                            html += '<br />';
                            html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                            html += 'Body: xcx2';
                            html += '</span>';
                            html == '<br />';
                            html += '   <div id="bwQuilltoolbar">';
                            html += '       <button id="btnQuill_InsertADataItem" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
                            //html += '       <select class="ql-size">';
                            //html += '           <option value="small"></option>';
                            //html += '           <option selected></option>';
                            //html += '           <option value="large"></option>';
                            //html += '           <option value="huge"></option>';
                            //html += '       </select>';
                            //html += '       <button class="ql-bold"></button>';
                            //html += '       <button class="ql-script" value="sub"></button>';
                            //html += '       <button class="ql-script" value="super"></button>';
                            html += '   </div>';
                            html += '   <div id="quillConfigureNewUserEmailsDialog_Body" style="height:375px;"></div>'; // Quill.

                            //html += '</div>';

                            $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = html;

                            thiz.viewPendingEmail('btnEditRaciRoles_undefined', 'undefined', 'undefined', 'undefined', data[0].bwPendingEmailId);
                        }
                    } catch (e) {
                        console.log('Exception in cmdListForestPendingEmail3(): ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in xx.js.cmdListForestPendingEmail3():' + errorCode + ', ' + errorMessage);
                }
            });
        } catch (e) {
            console.log('Exception in displayForestPendingEmails(): ' + e.message + ', ' + e.stack);
        }
    },

    displayAIConversation: function () {
        try {
            console.log('In bwConfiguration.js.displayAIConversation().');
            //alert('In bwConfiguration.js.displayAIConversation().');
            var thiz = this;

            //var bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                bwWorkflowAppId: workflowAppId
            };

            $.ajax({
                url: webserviceurl + "/getaiconversationlogfororganization",
                type: "POST",
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (results) {
                    try {

                        var html = '';

                        if (!(results.result && results.result.length)) {

                            // Must be a new user. Nothing to talk about yet!
                            html += 'This must be a new organization. There is nothing to talk about yet.';

                        } else {

                            html += '<ul>';
                            for (var i = 0; i < results.result.length; i++) {
                                html += '<li>' + results.result[i].Action_Message + '</li>';
                            }
                            html += '</ul>';

                        }

                        displayAlertDialog(html);

                    } catch (e) {
                        console.log('Exception in bwConfiguration.js.displayAIConversation(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwConfiguration.js.displayAIConversation(): ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in bwConfiguration.js.displayAIConversation():' + errorCode + ', ' + errorMessage);
                }
            });

        } catch (e) {
            console.log('Exception in bwConfiguration.js.displayAIConversation(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwConfiguration.js.displayAIConversation(): ' + e.message + ', ' + e.stack);
        }
    },

    displayPendingEmails: function () { // Accepts "all" as a value for bwWorkflowAppId. This is for the forest administrator.
        try {
            console.log('In displayPendingEmails().'); // bwWorkflowAppId: ' + bwWorkflowAppId);
            var thiz = this;

            //if (!bwWorkflowAppId) {
            //    alert('Error in bwConfiguration.js.displayPendingEmails(). Invalid value for bwWorkflowAppId: ' + bwWorkflowAppId);
            //} else {
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            //var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            //var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            //if (bwWorkflowAppId != 'all') {
            var bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            //}

            $('#spanSelectedEmailSubject').html('');

            try {
                var html = '';

                // Display the top buttons.
                html += '                           <span class="emailEditor_topbarbutton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'cmdDisplayDeletePendingEmailsDialog\', \'' + bwWorkflowAppId + '\');">';
                html += '                               <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" xcx="664993" >&nbsp;Delete';
                html += '                           </span>';
                html += '&nbsp;&nbsp;';
                html += '                           <span class="emailEditor_topbarbutton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'cmdDisplayDeletePendingEmailsDialog\', \'' + bwWorkflowAppId + '\', \'emptyfolder\');">';
                html += '                               <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" xcx="xcx324865" >&nbsp;Empty folder';
                html += '                           </span>';
                $(thiz.element).find('#spanSelectedEmailType_TopButtons')[0].innerHTML = html; //'Pending Email';

                // Display the radio button and the title.
                html = '';
                html += '<input type="checkbox" id="checkboxTogglePendingEmailCheckboxes" onchange="$(\'.bwConfiguration\').bwConfiguration(\'togglePendingEmailCheckboxes\', this);" />&nbsp;&nbsp;';
                html += '✉ Pending Inbox Items';
                $(thiz.element).find('#spanSelectedEmailType_Title')[0].innerHTML = html; //'Pending Email';

                // Make this button appear selected.
                $(thiz.element).find('#spanDisplaySentEmailButton').removeClass('bwConfiguration_LeftMenuButton_Selected').addClass('bwConfiguration_LeftMenuButton');
                $(thiz.element).find('#spanDisplayPendingEmailButton').removeClass('bwConfiguration_LeftMenuButton').addClass('bwConfiguration_LeftMenuButton_Selected');


                //$(thiz.element).find('#tdDisplayPendingEmailButton')[0].style.backgroundColor = 'lightskyblue';
                //$(thiz.element).find('#spanDisplaySentEmailButton')[0].style.backgroundColor = 'white';

                //$(thiz.element).find('#spanDisplayErrorsAndSuggestionsButton')[0].style.backgroundColor = 'white';
            } catch (e) { }

            // Clear these in the beginning, because it may take a few seconds to re-populate, and this gives the user some visual feedback that something is going on.
            $(thiz.element).find('#spanEmailPicker')[0].innerHTML = '';
            $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = '';


            if (this.options.OnlyDisplayEmailsForCurrentParticipant == true) {


                $.ajax({
                    url: webserviceurl + "/bwparticipantpendingemail/" + bwWorkflowAppId + "/" + participantId, // Accepts "all" as a value for bwWorkflowAppId. This is for the forest administrator.
                    type: "GET",
                    contentType: 'application/json',
                    success: function (data) {
                        try {
                            var html = '';
                            //alert(JSON.stringify(data));
                            if (!data.length || data.length == 0) {
                                html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
                                html += '  There are no pending emails.';
                                html += '<span>';
                                $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;
                                $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = '';
                            } else {
                                html = '<table>';
                                for (var i = 0; i < data.length; i++) {
                                    html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onclick="$(\'.bwConfiguration\').bwConfiguration(\'viewPendingEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwPendingEmailId + '\');" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
                                    html += '    <td style="vertical-align:top;"><input type="checkbox" class="pendingEmailCheckbox" bwpendingemailid="' + data[i].bwPendingEmailId + '" /></td>';
                                    //var timestamp = getFriendlyDateAndTime(data[i].Timestamp);
                                    html += '    <td colspan="4" style="border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px;">';
                                    html += '<span style="font-weight:bold;color:black;">' + data[i].ToParticipantFriendlyName + '<br />';

                                    // 2-3-2022
                                    var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(data[i].Timestamp);
                                    html += '<span style="font-weight:normal;color:tomato;">' + timestamp4 + '</span>';


                                    html += '       <br />';
                                    html += '</span>';
                                    if (data[i].Subject && data[i].Subject.length > 56) { // Display the subject up to 55 characters.
                                        html += '<span style="font-weight:lighter;color:#95b1d3;">' + data[i].Subject.substring(0, 55) + ' ...</span>';
                                    } else {
                                        html += '<span style="font-weight:lighter;color:#95b1d3;">' + data[i].Subject + ' ...</span>';
                                    }
                                    html += '       <br />';
                                    //if (bwWorkflowAppId == 'all') { // This is for the forest administrator.
                                    html += '<span style="font-weight:normal;color:lightgray;">Organization: [' + data[i].bwWorkflowAppId + ']</span>';
                                    html += '       <br />';
                                    //}
                                    html += '   </td>';
                                    html += '  </tr>';
                                }
                                html += '</table>';

                                $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;

                                html = '';
                                html += '                       <div class="spanButton" style="width:100px;text-align:right;" title="Click to send this email now!" onclick="$(\'.bwConfiguration\').bwConfiguration(\'sendPendingEmailNow\');">';
                                html += '                           ✉&nbsp;Send Now >xcx5-2 add check to send changes or not';
                                html += '                       </div>';
                                html += '<span id="spanSelectedEmailSubject" style="font-size:13pt;font-weight:bold;color:#95b1d3;"></span>';
                                html += '<br /><br />';
                                // Quill subject editor.
                                html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                                html += 'Subject:';
                                html += '</span>';
                                html += '<br />';
                                html += '   <div id="bwQuilltoolbarForSubject">';
                                html += '       <button id="btnQuill_InsertADataItemForSubject" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
                                html += '   </div>';
                                //html += '   <div id="quillConfigureNewUserEmailsDialog_Subject" style="height:50px;"></div>'; // Quill.
                                html += '<input type="text" id="quillConfigureNewUserEmailsDialog_Subject" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';

                                // Quill body editor.
                                html += '<br />';
                                html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                                html += 'Body: xcx2';
                                html += '</span>';
                                html == '<br />';
                                html += '   <div id="bwQuilltoolbar">';
                                html += '       <button id="btnQuill_InsertADataItem" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
                                //html += '       <select class="ql-size">';
                                //html += '           <option value="small"></option>';
                                //html += '           <option selected></option>';
                                //html += '           <option value="large"></option>';
                                //html += '           <option value="huge"></option>';
                                //html += '       </select>';
                                //html += '       <button class="ql-bold"></button>';
                                //html += '       <button class="ql-script" value="sub"></button>';
                                //html += '       <button class="ql-script" value="super"></button>';
                                html += '   </div>';
                                html += '   <div id="quillConfigureNewUserEmailsDialog_Body" style="height:375px;"></div>'; // Quill.

                                //html += '</div>';

                                $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = html;

                                thiz.viewPendingEmail('btnEditRaciRoles_undefined', 'undefined', 'undefined', 'undefined', data[0].bwPendingEmailId);
                            }
                        } catch (e) {
                            console.log('Exception in cmdListPendingEmail3(): ' + e.message + ', ' + e.stack);
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        displayAlertDialog('Error in xx.js.cmdListPendingEmail3():' + errorCode + ', ' + errorMessage);
                    }
                });




            } else {
                $.ajax({
                    url: webserviceurl + "/bwadminpendingemail/" + bwWorkflowAppId, // Accepts "all" as a value for bwWorkflowAppId. This is for the forest administrator.
                    type: "DELETE",
                    contentType: 'application/json',
                    success: function (data) {
                        try {
                            var html = '';
                            //alert(JSON.stringify(data));
                            if (!data.length || data.length == 0) {
                                html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
                                html += '  There are no pending emails.';
                                html += '<span>';
                                $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;
                                $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = '';
                            } else {
                                html = '<table>';
                                for (var i = 0; i < data.length; i++) {
                                    html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onclick="$(\'.bwConfiguration\').bwConfiguration(\'viewPendingEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwPendingEmailId + '\');" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
                                    html += '    <td style="vertical-align:top;"><input type="checkbox" class="pendingEmailCheckbox" bwpendingemailid="' + data[i].bwPendingEmailId + '" /></td>';
                                    //var timestamp = getFriendlyDateAndTime(data[i].Timestamp);
                                    html += '    <td colspan="4" style="border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px;">';
                                    html += '<span style="font-weight:bold;color:black;">' + data[i].ToParticipantFriendlyName + '<br />';


                                    // 2-3-2022
                                    var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(data[i].Timestamp);
                                    html += '<span style="font-weight:normal;color:tomato;">' + timestamp4 + '</span>';



                                    html += '       <br />';
                                    html += '</span>';
                                    if (data[i].Subject && data[i].Subject.length > 56) { // Display the subject up to 55 characters.
                                        html += '<span style="font-weight:lighter;color:#95b1d3;">' + data[i].Subject.substring(0, 55) + ' ...</span>';
                                    } else {
                                        html += '<span style="font-weight:lighter;color:#95b1d3;">' + data[i].Subject + ' ...</span>';
                                    }
                                    html += '       <br />';
                                    //if (bwWorkflowAppId == 'all') { // This is for the forest administrator.
                                    html += '<span style="font-weight:normal;color:lightgray;">Organization: [' + data[i].bwWorkflowAppId + ']</span>';
                                    html += '       <br />';
                                    //}
                                    html += '   </td>';
                                    html += '  </tr>';
                                }
                                html += '</table>';

                                $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;

                                html = '';
                                html += '                       <div class="spanButton" style="width:100px;text-align:right;" title="Click to send this email now!" onclick="$(\'.bwConfiguration\').bwConfiguration(\'sendPendingEmailNow\');">';
                                html += '                           ✉&nbsp;Send Now >xcx5-2 add check to send changes or not';
                                html += '                       </div>';
                                html += '<span id="spanSelectedEmailSubject" style="font-size:13pt;font-weight:bold;color:#95b1d3;"></span>';
                                html += '<br /><br />';
                                // Quill subject editor.
                                html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                                html += 'Subject:';
                                html += '</span>';
                                html += '<br />';
                                html += '   <div id="bwQuilltoolbarForSubject">';
                                html += '       <button id="btnQuill_InsertADataItemForSubject" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
                                html += '   </div>';
                                //html += '   <div id="quillConfigureNewUserEmailsDialog_Subject" style="height:50px;"></div>'; // Quill.
                                html += '<input type="text" id="quillConfigureNewUserEmailsDialog_Subject" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';

                                // Quill body editor.
                                html += '<br />';
                                html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                                html += 'Body: xcx2';
                                html += '</span>';
                                html == '<br />';
                                html += '   <div id="bwQuilltoolbar">';
                                html += '       <button id="btnQuill_InsertADataItem" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
                                //html += '       <select class="ql-size">';
                                //html += '           <option value="small"></option>';
                                //html += '           <option selected></option>';
                                //html += '           <option value="large"></option>';
                                //html += '           <option value="huge"></option>';
                                //html += '       </select>';
                                //html += '       <button class="ql-bold"></button>';
                                //html += '       <button class="ql-script" value="sub"></button>';
                                //html += '       <button class="ql-script" value="super"></button>';
                                html += '   </div>';
                                html += '   <div id="quillConfigureNewUserEmailsDialog_Body" style="height:375px;"></div>'; // Quill.

                                //html += '</div>';

                                $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = html;

                                thiz.viewPendingEmail('btnEditRaciRoles_undefined', 'undefined', 'undefined', 'undefined', data[0].bwPendingEmailId);
                            }
                        } catch (e) {
                            console.log('Exception in cmdListPendingEmail3(): ' + e.message + ', ' + e.stack);
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        displayAlertDialog('Error in xx.js.cmdListPendingEmail3():' + errorCode + ', ' + errorMessage);
                    }
                });
            }
            //}
        } catch (e) {
            console.log('Exception in displayPendingEmails(): ' + e.message + ', ' + e.stack);
        }
    },







    renderEmails: function (bwWorkflowAppId) {
        try {
            console.log('In bwConfiguration.js.renderEmails(). bwWorkflowAppId: ' + bwWorkflowAppId);
            //alert('In bwConfiguration.js.renderEmails(). bwWorkflowAppId: ' + bwWorkflowAppId);
            var thiz = this;

            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            if (bwWorkflowAppId != 'all') {
                bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            }

            this.options.pagingPage_SentEmail = 0; // If we want items to display properly, these need to be reset/set back to the beginning here.
            //this.options.pagingLimit_SentEmail = 20;

            $('#spanSelectedEmailSubject').html('');

            var html = '';

            // Display the top buttons.
            html += '                           <span class="emailEditor_topbarbutton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\');">';
            html += '                               <img title="Delete..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx123468" />&nbsp;Delete';
            html += '                           </span>';
            html += '&nbsp;&nbsp;';
            html += '                           <span class="emailEditor_topbarbutton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\', \'emptyfolder\');">';
            html += '                               <img title="Empty folder..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx23423467898">&nbsp;Empty folder';
            html += '                           </span>';
            $(thiz.element).find('#spanSelectedEmailType_TopButtons')[0].innerHTML = html; //'Pending Email';

            // Display the radio button and the title.
            html = '';
            html += '<input type="checkbox" id="checkboxToggleSentEmailCheckboxes" onchange="$(\'.bwConfiguration\').bwConfiguration(\'toggleSentEmailCheckboxes\', this);" />&nbsp;&nbsp;';
            html += '✉ Inbox Items';

            $(thiz.element).find('#spanSelectedEmailType_Title')[0].innerHTML = html; //'Sent Email';

            // Make this button appear selected.
            $(thiz.element).find('#spanDisplaySentEmailButton').removeClass('bwConfiguration_LeftMenuButton').addClass('bwConfiguration_LeftMenuButton_Selected');
            $(thiz.element).find('#spanDisplayPendingEmailButton').removeClass('bwConfiguration_LeftMenuButton_Selected').addClass('bwConfiguration_LeftMenuButton');

            // Clear these in the beginning, because it may take a few seconds to re-populate, and this gives the user some visual feedback that something is going on.
            $(thiz.element).find('#spanEmailPicker')[0].innerHTML = '';
            $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '';

            console.log('xcx2313555. In bwConfiguration.js.renderEmails(). Calling GET ' + webserviceurl + '/participantemail_inbox/ this.options.OnlyDisplayEmailsForCurrentParticipant: ' + this.options.OnlyDisplayEmailsForCurrentParticipant);


            var html = '';

            html += '           <div xcx="xcx21323663" style="width:460px;height:600px;overflow-y: scroll;overflow-x:scroll;">'; // The width is set here for the email list... 2-9-2022 scroll can be change dto hidden...
            debugger;
            if (!thiz.options.Inbox.length || thiz.options.Inbox.length == 0) {

                html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
                html += '  There are no sent emails.';
                html += '<span>';

                html += '           </div>';

                if ($(thiz.element).find('#spanEmailPicker') && $(thiz.element).find('#spanEmailPicker')[0]) {
                    $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;
                }
                if ($(thiz.element).find('#spanSelectedEmail') && $(thiz.element).find('#spanSelectedEmail')[0]) {
                    $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = '';
                }

            } else {

                //
                // This is our email. 12-12-2023.
                //

                html += '<table xcx="xcx111948475664" style="max-width:460px;">'; // width:460px;height:600px;overflow-y: scroll;overflow-x:hidden;

                for (var i = 0; i < thiz.options.Inbox.length; i++) {
                    //html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
                    html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" _id="' + thiz.options.Inbox[i]._id + '" class="bwEmailInboxRow" xcx="xcx2224555-3" onclick="$(\'.bwConfiguration\').bwConfiguration(\'viewIndividualEmail_Inbox\', \'' + 'btnEditRaciRoles_' + thiz.options.Inbox[i].bwParticipantId + '\', \'' + thiz.options.Inbox[i].bwParticipantId + '\', \'' + thiz.options.Inbox[i].bwParticipantFriendlyName + '\', \'' + thiz.options.Inbox[i].bwParticipantEmail + '\', \'' + thiz.options.Inbox[i]._id + '\');" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + thiz.options.Inbox[i].bwParticipantId + '\', \'' + thiz.options.Inbox[i].bwParticipantId + '\');">';
                    //debugger; // xcx999999
                    html += '    <td style="vertical-align:top;max-width:20px;"><input type="checkbox" class="sentEmailCheckbox" bwsentemailid="' + thiz.options.Inbox[i].bwSentEmailId + '" /></td>';
                    //debugger;
                    //var timestamp = getFriendlyDateAndTime(data[i].Timestamp);
                    //html += '    <td style="white-space:nowrap;">' + timestamp + '</td>';
                    //html += '    <td>' + data[i].ToParticipantEmail + '</td>';
                    //html += '    <td>' + data[i].Subject + '</td>'; // html += '    <td>' + data[i].FromEmailAddress + '</td>';
                    //html += '    <td><input type="button" bwpendingemailid="xxpeid"' + data[i].EmailLink + '" value="View" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'viewPendingEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwPendingEmailId + '\');" /></td>';



                    html += '    <td id="bwConfiguration_InnerLeftMenuButton_' + thiz.options.Inbox[i].bwSentEmailId + '" style="border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px;max-width:350px;">';
                    //debugger; // RelatedRequestId	ad19f2b8-707f-40ad-8228-a07d55a1ddac



                    // data[i].mail_from
                    //html += '<span style="font-weight:bold;color:black;">' + data[i].ToParticipantFriendlyName + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';
                    //html += '<span style="font-weight:bold;color:black;">' + data[i].mail_from.original + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';

                    var emailAddress = '';
                    if (thiz.options.Inbox[i].from && thiz.options.Inbox[i].from[0] && thiz.options.Inbox[i].from[0].address) {
                        emailAddress = thiz.options.Inbox[i].from[0].address;
                    } else {
                        emailAddress = thiz.options.Inbox[i].from;
                    }

                    if (thiz.options.Inbox[i].TheUserHasReadThisEmail && (thiz.options.Inbox[i].TheUserHasReadThisEmail == true)) {
                        html += '<span style="font-weight:normal;color:black;" class="bwEmailInboxRow_EmailAddress">' + emailAddress + '<br />';
                    } else {
                        html += '<span style="font-weight:bold;color:black;" class="bwEmailInboxRow_EmailAddress">' + emailAddress + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';
                    }

                    //html += '<span style="font-weight:normal;color:tomato;">' + timestamp + '</span>';
                    // 2-3-2022
                    var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(thiz.options.Inbox[i].timestamp);
                    html += '<span style="font-weight:normal;color:tomato;">' + timestamp4 + '</span>';



                    html += '       <br />';
                    //debugger;
                    //html += 'RelatedRequestId: ' + data[i].RelatedRequestId + '</span></span>';
                    html += '</span>';
                    //html += '       <br />';

                    var subject = '';
                    if (thiz.options.Inbox[i].subject) {
                        subject = thiz.options.Inbox[i].subject.substring(0, 55);
                    } else {
                        subject = '[no subject]';
                    }

                    if (thiz.options.Inbox[i].TheUserHasReadThisEmail && (thiz.options.Inbox[i].TheUserHasReadThisEmail == true)) {
                        html += '<span style="font-weight:lighter;color:#95b1d3;" class="bwEmailInboxRow_Subject">' + subject + ' ...</span>';
                    } else {
                        html += '<span style="font-weight:bold;color:#95b1d3;" class="bwEmailInboxRow_Subject">' + subject + ' ...</span>';
                    }

                    html += '       <br />';

                    //if (bwWorkflowAppId == 'all') { // This is for the forest administrator.
                    html += '<span style="font-weight:normal;color:lightgray;">Organization: [' + thiz.options.Inbox[i].bwWorkflowAppId + ']';

                    // INTERNAL/EXTERNAL
                    if (thiz.options.Inbox[i].ThisEmailIsFromAnInternalSource && (thiz.options.Inbox[i].ThisEmailIsFromAnInternalSource == true)) {
                        html += ' <span style="color:tomato;">INTERNAL</span>';
                    } else {
                        html += ' <span style="color:tomato;">EXTERNAL</span>';
                    }

                    html += '</span>';
                    html += '       <br />';
                    //}

                    //var bodyTextStartIndex = data[i].Body.indexOf('>');
                    //var bodyTextEndIndex = data[i].Body.substring(bodyTextStartIndex).indexOf('<') + 1;
                    //var bodyTextEndIndex2 = data[i].Body.substring(bodyTextEndIndex).indexOf('<') + 1;
                    //var bodyText = data[i].Body.substring(bodyTextEndIndex, bodyTextEndIndex2);
                    //html += '<span style="color:grey;">' + bodyText + ' ...</span>'; //  we have to do this because i we render the html it affect s the whole display in an unpredictable manner!!!
                    //html += '       <br />';

                    html += '   </td>';
                    //displayAlertDialog('xcx231232 thiz.options.Inbox[i]: ' + JSON.stringify(thiz.options.Inbox[i]));


                    html += '<td class="bwConfiguration_Trashbin" style="max-width:40px;" onclick="$(\'.bwConfiguration\').bwConfiguration(\'deleteIndividualEmail\', \'' + thiz.options.Inbox[i]._id + '\');event.stopPropagation();">';
                    html += '<img src="/images/trashbin.png" />';
                    html += '</td>';



                    html += '  </tr>';
                }
                html += '</table>';

                html += '           </div>';

                // This if statement is here because the user may use a menu button to switch to a different screen before this happens... so this prevents the error being displayed.
                if ($(thiz.element).find('#spanEmailPicker') && $(thiz.element).find('#spanEmailPicker')[0]) {

                    $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;

                    // Quill subject editor.
                    html = '';
                    html += '<div style="height:15px;">&nbsp;</div>';



                    //html += '                       <div class="spanButton" style="width:100px;text-align:right;" title="Click to send this email now!" onclick="$(\'.bwConfiguration\').bwConfiguration(\'sendEmailNow\');">';
                    //html += '                           ✉&nbsp;Send Now > xcx5';
                    //html += '                       </div>';






                    //html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                    //html += 'From:';
                    //html += '</span>';
                    html += '<br />';
                    html += '   <div id="bwEmailView_From"></div>';
                    html += '<br />';

                    html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                    html += 'To:';
                    html += '</span>';
                    html += '<br />';
                    html += '   <div id="bwEmailView_To"></div>';
                    html += '<br />';


                    html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                    html += 'Subject:';
                    html += '</span>';
                    html += '<br />';
                    html += '   <div id="bwQuilltoolbarForSubject">';
                    //html += '       <button id="btnQuill_InsertADataItemForSubject" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
                    html += '   </div>';
                    //html += '   <div id="quillConfigureNewUserEmailsDialog_Subject" style="height:50px;"></div>'; // Quill.
                    html += '<input type="text" id="quillConfigureNewUserEmailsDialog_Subject" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';

                    // Quill body editor.
                    html += '<br /><br />';
                    html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                    html += 'Body:';
                    html += '</span>';
                    html == '<br />';
                    html += '   <div id="bwQuilltoolbar">';
                    //html += '       <button id="btnQuill_InsertADataItem" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';

                    html += '   </div>';
                    html += '   <div id="quillConfigureNewUserEmailsDialog_Body" style="height:375px;"></div>'; // Quill.
                    // Save button.
                    //html += '   <br />';
                    //html += '   <span id="spanConfigureEmailNotificationsDialogSaveButton">[spanConfigureEmailNotificationsDialogSaveButton]</span>'; // ☑ 
                    //html += '   <br /><br />';
                    // Preview/Edit button.
                    //html += '   <div id="divNewUserEmailEditor_PreviewAndEditButton" class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;"></div>';
                    //html += '   <br /><br />';
                    html += '</div>';


                    //$(thiz.element).find('#spanSelectedEmail')[0].innerHTML = html;
                    try {
                        $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = html;
                    } catch (e) { }


                    //thiz.viewIndividualEmail_Inbox('btnEditRaciRoles_undefined', 'undefined', 'undefined', 'undefined', data[0].bwSentEmailId);
                }
            }

        } catch (e) {
            console.log('Exception in renderEmails(): ' + e.message + ', ' + e.stack);
            alert('Exception in renderEmails(): ' + e.message + ', ' + e.stack);
        }
    },

    renderEmails_Sent: function (bwWorkflowAppId) {
        try {
            console.log('In renderEmails_Sent(). bwWorkflowAppId: ' + bwWorkflowAppId);
            var thiz = this;

            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            if (bwWorkflowAppId != 'all') {
                bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            }

            this.options.pagingPage_SentEmail = 0; // If we want items to display properly, these need to be reset/set back to the beginning here.
            //this.options.pagingLimit_SentEmail = 20;

            $('#spanSelectedEmailSubject').html('');

            var html = '';

            // Display the top buttons.
            html += '                           <span class="emailEditor_topbarbutton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\');">';
            html += '                               <img title="Delete..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx123468" />&nbsp;Delete';
            html += '                           </span>';
            html += '&nbsp;&nbsp;';
            html += '                           <span class="emailEditor_topbarbutton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\', \'emptyfolder\');">';
            html += '                               <img title="Empty folder..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx23423467898">&nbsp;Empty folder';
            html += '                           </span>';
            $(thiz.element).find('#spanSelectedEmailType_TopButtons')[0].innerHTML = html; //'Pending Email';

            // Display the radio button and the title.
            html = '';
            html += '<input type="checkbox" id="checkboxToggleSentEmailCheckboxes" onchange="$(\'.bwConfiguration\').bwConfiguration(\'toggleSentEmailCheckboxes\', this);" />&nbsp;&nbsp;';
            html += '✉ Sent Items';

            $(thiz.element).find('#spanSelectedEmailType_Title')[0].innerHTML = html; //'Sent Email';

            // Make this button appear selected.
            $(thiz.element).find('#spanDisplaySentEmailButton').removeClass('bwConfiguration_LeftMenuButton').addClass('bwConfiguration_LeftMenuButton_Selected');
            $(thiz.element).find('#spanDisplayPendingEmailButton').removeClass('bwConfiguration_LeftMenuButton_Selected').addClass('bwConfiguration_LeftMenuButton');

            // Clear these in the beginning, because it may take a few seconds to re-populate, and this gives the user some visual feedback that something is going on.
            $(thiz.element).find('#spanEmailPicker')[0].innerHTML = '';
            $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '';

            console.log('xcx2313555. In bwConfiguration.js.renderEmails_Sent(). Calling GET ' + webserviceurl + '/participantemail_inbox/ this.options.OnlyDisplayEmailsForCurrentParticipant: ' + this.options.OnlyDisplayEmailsForCurrentParticipant);


            var html = '';

            html += '           <div xcx="xcx21323663" style="width:460px;height:600px;overflow-y: scroll;overflow-x:scroll;">'; // The width is set here for the email list... 2-9-2022 scroll can be change dto hidden...

            if (!thiz.options.Sent.length || thiz.options.Sent.length == 0) {

                html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
                html += '  There are no sent emails.';
                html += '<span>';

                html += '           </div>';

                if ($(thiz.element).find('#spanEmailPicker') && $(thiz.element).find('#spanEmailPicker')[0]) {
                    $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;
                }
                if ($(thiz.element).find('#spanSelectedEmail') && $(thiz.element).find('#spanSelectedEmail')[0]) {
                    $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = '';
                }

            } else {

                //
                // This is our email. 12-12-2023.
                //

                html += '<table xcx="xcx111948475664" style="max-width:460px;">'; // width:460px;height:600px;overflow-y: scroll;overflow-x:hidden;

                for (var i = 0; i < thiz.options.Sent.length; i++) {
                    //html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
                    html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" _id="' + thiz.options.Sent[i]._id + '" class="bwEmailInboxRow" xcx="xcx2224555-3" onclick="$(\'.bwConfiguration\').bwConfiguration(\'viewIndividualEmail_Inbox\', \'' + 'btnEditRaciRoles_' + thiz.options.Sent[i].bwParticipantId + '\', \'' + thiz.options.Sent[i].bwParticipantId + '\', \'' + thiz.options.Sent[i].bwParticipantFriendlyName + '\', \'' + thiz.options.Sent[i].bwParticipantEmail + '\', \'' + thiz.options.Sent[i]._id + '\');" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + thiz.options.Sent[i].bwParticipantId + '\', \'' + thiz.options.Sent[i].bwParticipantId + '\');">';
                    //debugger; // xcx999999
                    html += '    <td style="vertical-align:top;max-width:20px;"><input type="checkbox" class="sentEmailCheckbox" bwsentemailid="' + thiz.options.Sent[i].bwSentEmailId + '" /></td>';
                    //debugger;
                    //var timestamp = getFriendlyDateAndTime(data[i].Timestamp);
                    //html += '    <td style="white-space:nowrap;">' + timestamp + '</td>';
                    //html += '    <td>' + data[i].ToParticipantEmail + '</td>';
                    //html += '    <td>' + data[i].Subject + '</td>'; // html += '    <td>' + data[i].FromEmailAddress + '</td>';
                    //html += '    <td><input type="button" bwpendingemailid="xxpeid"' + data[i].EmailLink + '" value="View" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'viewPendingEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwPendingEmailId + '\');" /></td>';



                    html += '    <td id="bwConfiguration_InnerLeftMenuButton_' + thiz.options.Sent[i].bwSentEmailId + '" style="border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px;max-width:350px;">';
                    //debugger; // RelatedRequestId	ad19f2b8-707f-40ad-8228-a07d55a1ddac



                    // data[i].mail_from
                    //html += '<span style="font-weight:bold;color:black;">' + data[i].ToParticipantFriendlyName + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';
                    //html += '<span style="font-weight:bold;color:black;">' + data[i].mail_from.original + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';

                    var emailAddress = '';
                    if (thiz.options.Sent[i].from && thiz.options.Sent[i].from[0] && thiz.options.Sent[i].from[0].address) {
                        emailAddress = thiz.options.Sent[i].from[0].address;
                    } else {
                        emailAddress = thiz.options.Sent[i].from;
                    }

                    if (thiz.options.Sent[i].TheUserHasReadThisEmail && (thiz.options.Sent[i].TheUserHasReadThisEmail == true)) {
                        html += '<span style="font-weight:normal;color:black;" class="bwEmailInboxRow_EmailAddress">' + emailAddress + '<br />';
                    } else {
                        html += '<span style="font-weight:bold;color:black;" class="bwEmailInboxRow_EmailAddress">' + emailAddress + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';
                    }

                    //html += '<span style="font-weight:normal;color:tomato;">' + timestamp + '</span>';
                    // 2-3-2022
                    var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(thiz.options.Sent[i].timestamp);
                    html += '<span style="font-weight:normal;color:tomato;">' + timestamp4 + '</span>';



                    html += '       <br />';
                    //debugger;
                    //html += 'RelatedRequestId: ' + data[i].RelatedRequestId + '</span></span>';
                    html += '</span>';
                    //html += '       <br />';

                    var subject = '';
                    if (thiz.options.Sent[i].subject) {
                        subject = thiz.options.Sent[i].subject.substring(0, 55);
                    } else {
                        subject = '[no subject]';
                    }

                    if (thiz.options.Sent[i].TheUserHasReadThisEmail && (thiz.options.Sent[i].TheUserHasReadThisEmail == true)) {
                        html += '<span style="font-weight:lighter;color:#95b1d3;" class="bwEmailInboxRow_Subject">' + subject + ' ...</span>';
                    } else {
                        html += '<span style="font-weight:bold;color:#95b1d3;" class="bwEmailInboxRow_Subject">' + subject + ' ...</span>';
                    }

                    html += '       <br />';

                    //if (bwWorkflowAppId == 'all') { // This is for the forest administrator.
                    html += '<span style="font-weight:normal;color:lightgray;">Organization: [' + thiz.options.Sent[i].bwWorkflowAppId + ']';

                    // INTERNAL/EXTERNAL
                    if (thiz.options.Sent[i].ThisEmailIsFromAnInternalSource && (thiz.options.Sent[i].ThisEmailIsFromAnInternalSource == true)) {
                        html += ' <span style="color:tomato;">INTERNAL</span>';
                    } else {
                        html += ' <span style="color:tomato;">EXTERNAL</span>';
                    }

                    html += '</span>';
                    html += '       <br />';
                    //}

                    //var bodyTextStartIndex = data[i].Body.indexOf('>');
                    //var bodyTextEndIndex = data[i].Body.substring(bodyTextStartIndex).indexOf('<') + 1;
                    //var bodyTextEndIndex2 = data[i].Body.substring(bodyTextEndIndex).indexOf('<') + 1;
                    //var bodyText = data[i].Body.substring(bodyTextEndIndex, bodyTextEndIndex2);
                    //html += '<span style="color:grey;">' + bodyText + ' ...</span>'; //  we have to do this because i we render the html it affect s the whole display in an unpredictable manner!!!
                    //html += '       <br />';

                    html += '   </td>';
                    //displayAlertDialog('xcx231232 thiz.options.Sent[i]: ' + JSON.stringify(thiz.options.Sent[i]));


                    html += '<td class="bwConfiguration_Trashbin" style="max-width:40px;" onclick="$(\'.bwConfiguration\').bwConfiguration(\'deleteIndividualEmail\', \'' + thiz.options.Sent[i]._id + '\');event.stopPropagation();">';
                    html += '<img src="/images/trashbin.png" />';
                    html += '</td>';



                    html += '  </tr>';
                }
                html += '</table>';

                html += '           </div>';

                // This if statement is here because the user may use a menu button to switch to a different screen before this happens... so this prevents the error being displayed.
                if ($(thiz.element).find('#spanEmailPicker') && $(thiz.element).find('#spanEmailPicker')[0]) {

                    $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;

                    // Quill subject editor.
                    html = '';
                    html += '<div style="height:15px;">&nbsp;</div>';



                    //html += '                       <div class="spanButton" style="width:100px;text-align:right;" title="Click to send this email now!" onclick="$(\'.bwConfiguration\').bwConfiguration(\'sendEmailNow\');">';
                    //html += '                           ✉&nbsp;Send Now > xcx5';
                    //html += '                       </div>';






                    //html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                    //html += 'From:';
                    //html += '</span>';
                    html += '<br />';
                    html += '   <div id="bwEmailView_From"></div>';
                    html += '<br />';

                    html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                    html += 'To:';
                    html += '</span>';
                    html += '<br />';
                    html += '   <div id="bwEmailView_To"></div>';
                    html += '<br />';


                    html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                    html += 'Subject:';
                    html += '</span>';
                    html += '<br />';
                    html += '   <div id="bwQuilltoolbarForSubject">';
                    //html += '       <button id="btnQuill_InsertADataItemForSubject" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
                    html += '   </div>';
                    //html += '   <div id="quillConfigureNewUserEmailsDialog_Subject" style="height:50px;"></div>'; // Quill.
                    html += '<input type="text" id="quillConfigureNewUserEmailsDialog_Subject" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';

                    // Quill body editor.
                    html += '<br /><br />';
                    html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                    html += 'Body:';
                    html += '</span>';
                    html == '<br />';
                    html += '   <div id="bwQuilltoolbar">';
                    //html += '       <button id="btnQuill_InsertADataItem" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';

                    html += '   </div>';
                    html += '   <div id="quillConfigureNewUserEmailsDialog_Body" style="height:375px;"></div>'; // Quill.
                    // Save button.
                    //html += '   <br />';
                    //html += '   <span id="spanConfigureEmailNotificationsDialogSaveButton">[spanConfigureEmailNotificationsDialogSaveButton]</span>'; // ☑ 
                    //html += '   <br /><br />';
                    // Preview/Edit button.
                    //html += '   <div id="divNewUserEmailEditor_PreviewAndEditButton" class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;"></div>';
                    //html += '   <br /><br />';
                    html += '</div>';


                    //$(thiz.element).find('#spanSelectedEmail')[0].innerHTML = html;
                    try {
                        $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = html;
                    } catch (e) { }


                    //thiz.viewIndividualEmail_Inbox('btnEditRaciRoles_undefined', 'undefined', 'undefined', 'undefined', data[0].bwSentEmailId);
                }
            }

        } catch (e) {
            console.log('Exception in renderEmails_Sent(): ' + e.message + ', ' + e.stack);
            alert('Exception in renderEmails_Sent(): ' + e.message + ', ' + e.stack);
        }
    },




    renderEmails_Drafts: function (bwWorkflowAppId) {
        try {
            console.log('In renderEmails_Drafts(). bwWorkflowAppId: ' + bwWorkflowAppId);
            var thiz = this;

            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            if (bwWorkflowAppId != 'all') {
                bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            }

            this.options.pagingPage_SentEmail = 0; // If we want items to display properly, these need to be reset/set back to the beginning here.
            //this.options.pagingLimit_SentEmail = 20;

            $('#spanSelectedEmailSubject').html('');

            var html = '';

            // Display the top buttons.
            html += '                           <span class="emailEditor_topbarbutton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\');">';
            html += '                               <img title="Delete..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx123468" />&nbsp;Delete';
            html += '                           </span>';
            html += '&nbsp;&nbsp;';
            html += '                           <span class="emailEditor_topbarbutton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\', \'emptyfolder\');">';
            html += '                               <img title="Empty folder..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx23423467898">&nbsp;Empty folder';
            html += '                           </span>';
            $(thiz.element).find('#spanSelectedEmailType_TopButtons')[0].innerHTML = html; //'Pending Email';

            // Display the radio button and the title.
            html = '';
            html += '<input type="checkbox" id="checkboxToggleSentEmailCheckboxes" onchange="$(\'.bwConfiguration\').bwConfiguration(\'toggleSentEmailCheckboxes\', this);" />&nbsp;&nbsp;';
            html += '✉ Sent Items';

            $(thiz.element).find('#spanSelectedEmailType_Title')[0].innerHTML = html; //'Sent Email';

            // Make this button appear selected.
            $(thiz.element).find('#spanDisplaySentEmailButton').removeClass('bwConfiguration_LeftMenuButton').addClass('bwConfiguration_LeftMenuButton_Selected');
            $(thiz.element).find('#spanDisplayPendingEmailButton').removeClass('bwConfiguration_LeftMenuButton_Selected').addClass('bwConfiguration_LeftMenuButton');

            // Clear these in the beginning, because it may take a few seconds to re-populate, and this gives the user some visual feedback that something is going on.
            $(thiz.element).find('#spanEmailPicker')[0].innerHTML = '';
            $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '';

            console.log('xcx2313555. In bwConfiguration.js.renderEmails_Drafts(). Calling GET ' + webserviceurl + '/participantemail_inbox/ this.options.OnlyDisplayEmailsForCurrentParticipant: ' + this.options.OnlyDisplayEmailsForCurrentParticipant);


            var html = '';

            html += '           <div xcx="xcx21323663" style="width:460px;height:600px;overflow-y: scroll;overflow-x:scroll;">'; // The width is set here for the email list... 2-9-2022 scroll can be change dto hidden...

            if (!thiz.options.Sent.length || thiz.options.Sent.length == 0) {

                html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
                html += '  There are no sent emails.';
                html += '<span>';

                html += '           </div>';

                if ($(thiz.element).find('#spanEmailPicker') && $(thiz.element).find('#spanEmailPicker')[0]) {
                    $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;
                }
                if ($(thiz.element).find('#spanSelectedEmail') && $(thiz.element).find('#spanSelectedEmail')[0]) {
                    $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = '';
                }

            } else {

                //
                // This is our email. 12-12-2023.
                //

                html += '<table xcx="xcx111948475664" style="max-width:460px;">'; // width:460px;height:600px;overflow-y: scroll;overflow-x:hidden;

                for (var i = 0; i < thiz.options.Sent.length; i++) {
                    //html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
                    html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" _id="' + thiz.options.Sent[i]._id + '" class="bwEmailInboxRow" xcx="xcx2224555-3" onclick="$(\'.bwConfiguration\').bwConfiguration(\'viewIndividualEmail_Inbox\', \'' + 'btnEditRaciRoles_' + thiz.options.Sent[i].bwParticipantId + '\', \'' + thiz.options.Sent[i].bwParticipantId + '\', \'' + thiz.options.Sent[i].bwParticipantFriendlyName + '\', \'' + thiz.options.Sent[i].bwParticipantEmail + '\', \'' + thiz.options.Sent[i]._id + '\');" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + thiz.options.Sent[i].bwParticipantId + '\', \'' + thiz.options.Sent[i].bwParticipantId + '\');">';
                    //debugger; // xcx999999
                    html += '    <td style="vertical-align:top;max-width:20px;"><input type="checkbox" class="sentEmailCheckbox" bwsentemailid="' + thiz.options.Sent[i].bwSentEmailId + '" /></td>';
                    //debugger;
                    //var timestamp = getFriendlyDateAndTime(data[i].Timestamp);
                    //html += '    <td style="white-space:nowrap;">' + timestamp + '</td>';
                    //html += '    <td>' + data[i].ToParticipantEmail + '</td>';
                    //html += '    <td>' + data[i].Subject + '</td>'; // html += '    <td>' + data[i].FromEmailAddress + '</td>';
                    //html += '    <td><input type="button" bwpendingemailid="xxpeid"' + data[i].EmailLink + '" value="View" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'viewPendingEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwPendingEmailId + '\');" /></td>';



                    html += '    <td id="bwConfiguration_InnerLeftMenuButton_' + thiz.options.Sent[i].bwSentEmailId + '" style="border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px;max-width:350px;">';
                    //debugger; // RelatedRequestId	ad19f2b8-707f-40ad-8228-a07d55a1ddac



                    // data[i].mail_from
                    //html += '<span style="font-weight:bold;color:black;">' + data[i].ToParticipantFriendlyName + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';
                    //html += '<span style="font-weight:bold;color:black;">' + data[i].mail_from.original + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';

                    var emailAddress = '';
                    if (thiz.options.Sent[i].from && thiz.options.Sent[i].from[0] && thiz.options.Sent[i].from[0].address) {
                        emailAddress = thiz.options.Sent[i].from[0].address;
                    } else {
                        emailAddress = thiz.options.Sent[i].from;
                    }

                    if (thiz.options.Sent[i].TheUserHasReadThisEmail && (thiz.options.Sent[i].TheUserHasReadThisEmail == true)) {
                        html += '<span style="font-weight:normal;color:black;" class="bwEmailInboxRow_EmailAddress">' + emailAddress + '<br />';
                    } else {
                        html += '<span style="font-weight:bold;color:black;" class="bwEmailInboxRow_EmailAddress">' + emailAddress + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';
                    }

                    //html += '<span style="font-weight:normal;color:tomato;">' + timestamp + '</span>';
                    // 2-3-2022
                    var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(thiz.options.Sent[i].timestamp);
                    html += '<span style="font-weight:normal;color:tomato;">' + timestamp4 + '</span>';



                    html += '       <br />';
                    //debugger;
                    //html += 'RelatedRequestId: ' + data[i].RelatedRequestId + '</span></span>';
                    html += '</span>';
                    //html += '       <br />';

                    var subject = '';
                    if (thiz.options.Sent[i].subject) {
                        subject = thiz.options.Sent[i].subject.substring(0, 55);
                    } else {
                        subject = '[no subject]';
                    }

                    if (thiz.options.Sent[i].TheUserHasReadThisEmail && (thiz.options.Sent[i].TheUserHasReadThisEmail == true)) {
                        html += '<span style="font-weight:lighter;color:#95b1d3;" class="bwEmailInboxRow_Subject">' + subject + ' ...</span>';
                    } else {
                        html += '<span style="font-weight:bold;color:#95b1d3;" class="bwEmailInboxRow_Subject">' + subject + ' ...</span>';
                    }

                    html += '       <br />';

                    //if (bwWorkflowAppId == 'all') { // This is for the forest administrator.
                    html += '<span style="font-weight:normal;color:lightgray;">Organization: [' + thiz.options.Sent[i].bwWorkflowAppId + ']';

                    // INTERNAL/EXTERNAL
                    if (thiz.options.Sent[i].ThisEmailIsFromAnInternalSource && (thiz.options.Sent[i].ThisEmailIsFromAnInternalSource == true)) {
                        html += ' <span style="color:tomato;">INTERNAL</span>';
                    } else {
                        html += ' <span style="color:tomato;">EXTERNAL</span>';
                    }

                    html += '</span>';
                    html += '       <br />';
                    //}

                    //var bodyTextStartIndex = data[i].Body.indexOf('>');
                    //var bodyTextEndIndex = data[i].Body.substring(bodyTextStartIndex).indexOf('<') + 1;
                    //var bodyTextEndIndex2 = data[i].Body.substring(bodyTextEndIndex).indexOf('<') + 1;
                    //var bodyText = data[i].Body.substring(bodyTextEndIndex, bodyTextEndIndex2);
                    //html += '<span style="color:grey;">' + bodyText + ' ...</span>'; //  we have to do this because i we render the html it affect s the whole display in an unpredictable manner!!!
                    //html += '       <br />';

                    html += '   </td>';
                    //displayAlertDialog('xcx231232 thiz.options.Sent[i]: ' + JSON.stringify(thiz.options.Sent[i]));


                    html += '<td class="bwConfiguration_Trashbin" style="max-width:40px;" onclick="$(\'.bwConfiguration\').bwConfiguration(\'deleteIndividualEmail\', \'' + thiz.options.Sent[i]._id + '\');event.stopPropagation();">';
                    html += '<img src="/images/trashbin.png" />';
                    html += '</td>';



                    html += '  </tr>';
                }
                html += '</table>';

                html += '           </div>';

                // This if statement is here because the user may use a menu button to switch to a different screen before this happens... so this prevents the error being displayed.
                if ($(thiz.element).find('#spanEmailPicker') && $(thiz.element).find('#spanEmailPicker')[0]) {

                    $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;

                    // Quill subject editor.
                    html = '';
                    html += '<div style="height:15px;">&nbsp;</div>';



                    //html += '                       <div class="spanButton" style="width:100px;text-align:right;" title="Click to send this email now!" onclick="$(\'.bwConfiguration\').bwConfiguration(\'sendEmailNow\');">';
                    //html += '                           ✉&nbsp;Send Now > xcx5';
                    //html += '                       </div>';






                    //html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                    //html += 'From:';
                    //html += '</span>';
                    html += '<br />';
                    html += '   <div id="bwEmailView_From"></div>';
                    html += '<br />';

                    html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                    html += 'To:';
                    html += '</span>';
                    html += '<br />';
                    html += '   <div id="bwEmailView_To"></div>';
                    html += '<br />';


                    html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                    html += 'Subject:';
                    html += '</span>';
                    html += '<br />';
                    html += '   <div id="bwQuilltoolbarForSubject">';
                    //html += '       <button id="btnQuill_InsertADataItemForSubject" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
                    html += '   </div>';
                    //html += '   <div id="quillConfigureNewUserEmailsDialog_Subject" style="height:50px;"></div>'; // Quill.
                    html += '<input type="text" id="quillConfigureNewUserEmailsDialog_Subject" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';

                    // Quill body editor.
                    html += '<br /><br />';
                    html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                    html += 'Body:';
                    html += '</span>';
                    html == '<br />';
                    html += '   <div id="bwQuilltoolbar">';
                    //html += '       <button id="btnQuill_InsertADataItem" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';

                    html += '   </div>';
                    html += '   <div id="quillConfigureNewUserEmailsDialog_Body" style="height:375px;"></div>'; // Quill.
                    // Save button.
                    //html += '   <br />';
                    //html += '   <span id="spanConfigureEmailNotificationsDialogSaveButton">[spanConfigureEmailNotificationsDialogSaveButton]</span>'; // ☑ 
                    //html += '   <br /><br />';
                    // Preview/Edit button.
                    //html += '   <div id="divNewUserEmailEditor_PreviewAndEditButton" class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;"></div>';
                    //html += '   <br /><br />';
                    html += '</div>';


                    //$(thiz.element).find('#spanSelectedEmail')[0].innerHTML = html;
                    try {
                        $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = html;
                    } catch (e) { }


                    //thiz.viewIndividualEmail_Inbox('btnEditRaciRoles_undefined', 'undefined', 'undefined', 'undefined', data[0].bwSentEmailId);
                }
            }

        } catch (e) {
            console.log('Exception in renderEmails_Drafts(): ' + e.message + ', ' + e.stack);
            alert('Exception in renderEmails_Drafts(): ' + e.message + ', ' + e.stack);
        }
    },

    renderEmails_Junk: function (bwWorkflowAppId) {
        try {
            console.log('In renderEmails_Junk(). bwWorkflowAppId: ' + bwWorkflowAppId);
            var thiz = this;

            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            if (bwWorkflowAppId != 'all') {
                bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            }

            this.options.pagingPage_SentEmail = 0; // If we want items to display properly, these need to be reset/set back to the beginning here.
            //this.options.pagingLimit_SentEmail = 20;

            $('#spanSelectedEmailSubject').html('');

            var html = '';

            // Display the top buttons.
            html += '                           <span class="emailEditor_topbarbutton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\');">';
            html += '                               <img title="Delete..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx123468" />&nbsp;Delete';
            html += '                           </span>';
            html += '&nbsp;&nbsp;';
            html += '                           <span class="emailEditor_topbarbutton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\', \'emptyfolder\');">';
            html += '                               <img title="Empty folder..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx23423467898">&nbsp;Empty folder';
            html += '                           </span>';
            $(thiz.element).find('#spanSelectedEmailType_TopButtons')[0].innerHTML = html; //'Pending Email';

            // Display the radio button and the title.
            html = '';
            html += '<input type="checkbox" id="checkboxToggleSentEmailCheckboxes" onchange="$(\'.bwConfiguration\').bwConfiguration(\'toggleSentEmailCheckboxes\', this);" />&nbsp;&nbsp;';
            html += '✉ Sent Items';

            $(thiz.element).find('#spanSelectedEmailType_Title')[0].innerHTML = html; //'Sent Email';

            // Make this button appear selected.
            $(thiz.element).find('#spanDisplaySentEmailButton').removeClass('bwConfiguration_LeftMenuButton').addClass('bwConfiguration_LeftMenuButton_Selected');
            $(thiz.element).find('#spanDisplayPendingEmailButton').removeClass('bwConfiguration_LeftMenuButton_Selected').addClass('bwConfiguration_LeftMenuButton');

            // Clear these in the beginning, because it may take a few seconds to re-populate, and this gives the user some visual feedback that something is going on.
            $(thiz.element).find('#spanEmailPicker')[0].innerHTML = '';
            $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '';

            console.log('xcx2313555. In bwConfiguration.js.renderEmails_Junk(). Calling GET ' + webserviceurl + '/participantemail_inbox/ this.options.OnlyDisplayEmailsForCurrentParticipant: ' + this.options.OnlyDisplayEmailsForCurrentParticipant);


            var html = '';

            html += '           <div xcx="xcx21323663" style="width:460px;height:600px;overflow-y: scroll;overflow-x:scroll;">'; // The width is set here for the email list... 2-9-2022 scroll can be change dto hidden...

            if (!thiz.options.Sent.length || thiz.options.Sent.length == 0) {

                html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
                html += '  There are no sent emails.';
                html += '<span>';

                html += '           </div>';

                if ($(thiz.element).find('#spanEmailPicker') && $(thiz.element).find('#spanEmailPicker')[0]) {
                    $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;
                }
                if ($(thiz.element).find('#spanSelectedEmail') && $(thiz.element).find('#spanSelectedEmail')[0]) {
                    $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = '';
                }

            } else {

                //
                // This is our email. 12-12-2023.
                //

                html += '<table xcx="xcx111948475664" style="max-width:460px;">'; // width:460px;height:600px;overflow-y: scroll;overflow-x:hidden;

                for (var i = 0; i < thiz.options.Sent.length; i++) {
                    //html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
                    html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" _id="' + thiz.options.Sent[i]._id + '" class="bwEmailInboxRow" xcx="xcx2224555-3" onclick="$(\'.bwConfiguration\').bwConfiguration(\'viewIndividualEmail_Inbox\', \'' + 'btnEditRaciRoles_' + thiz.options.Sent[i].bwParticipantId + '\', \'' + thiz.options.Sent[i].bwParticipantId + '\', \'' + thiz.options.Sent[i].bwParticipantFriendlyName + '\', \'' + thiz.options.Sent[i].bwParticipantEmail + '\', \'' + thiz.options.Sent[i]._id + '\');" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + thiz.options.Sent[i].bwParticipantId + '\', \'' + thiz.options.Sent[i].bwParticipantId + '\');">';
                    //debugger; // xcx999999
                    html += '    <td style="vertical-align:top;max-width:20px;"><input type="checkbox" class="sentEmailCheckbox" bwsentemailid="' + thiz.options.Sent[i].bwSentEmailId + '" /></td>';
                    //debugger;
                    //var timestamp = getFriendlyDateAndTime(data[i].Timestamp);
                    //html += '    <td style="white-space:nowrap;">' + timestamp + '</td>';
                    //html += '    <td>' + data[i].ToParticipantEmail + '</td>';
                    //html += '    <td>' + data[i].Subject + '</td>'; // html += '    <td>' + data[i].FromEmailAddress + '</td>';
                    //html += '    <td><input type="button" bwpendingemailid="xxpeid"' + data[i].EmailLink + '" value="View" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'viewPendingEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwPendingEmailId + '\');" /></td>';



                    html += '    <td id="bwConfiguration_InnerLeftMenuButton_' + thiz.options.Sent[i].bwSentEmailId + '" style="border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px;max-width:350px;">';
                    //debugger; // RelatedRequestId	ad19f2b8-707f-40ad-8228-a07d55a1ddac



                    // data[i].mail_from
                    //html += '<span style="font-weight:bold;color:black;">' + data[i].ToParticipantFriendlyName + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';
                    //html += '<span style="font-weight:bold;color:black;">' + data[i].mail_from.original + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';

                    var emailAddress = '';
                    if (thiz.options.Sent[i].from && thiz.options.Sent[i].from[0] && thiz.options.Sent[i].from[0].address) {
                        emailAddress = thiz.options.Sent[i].from[0].address;
                    } else {
                        emailAddress = thiz.options.Sent[i].from;
                    }

                    if (thiz.options.Sent[i].TheUserHasReadThisEmail && (thiz.options.Sent[i].TheUserHasReadThisEmail == true)) {
                        html += '<span style="font-weight:normal;color:black;" class="bwEmailInboxRow_EmailAddress">' + emailAddress + '<br />';
                    } else {
                        html += '<span style="font-weight:bold;color:black;" class="bwEmailInboxRow_EmailAddress">' + emailAddress + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';
                    }

                    //html += '<span style="font-weight:normal;color:tomato;">' + timestamp + '</span>';
                    // 2-3-2022
                    var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(thiz.options.Sent[i].timestamp);
                    html += '<span style="font-weight:normal;color:tomato;">' + timestamp4 + '</span>';



                    html += '       <br />';
                    //debugger;
                    //html += 'RelatedRequestId: ' + data[i].RelatedRequestId + '</span></span>';
                    html += '</span>';
                    //html += '       <br />';

                    var subject = '';
                    if (thiz.options.Sent[i].subject) {
                        subject = thiz.options.Sent[i].subject.substring(0, 55);
                    } else {
                        subject = '[no subject]';
                    }

                    if (thiz.options.Sent[i].TheUserHasReadThisEmail && (thiz.options.Sent[i].TheUserHasReadThisEmail == true)) {
                        html += '<span style="font-weight:lighter;color:#95b1d3;" class="bwEmailInboxRow_Subject">' + subject + ' ...</span>';
                    } else {
                        html += '<span style="font-weight:bold;color:#95b1d3;" class="bwEmailInboxRow_Subject">' + subject + ' ...</span>';
                    }

                    html += '       <br />';

                    //if (bwWorkflowAppId == 'all') { // This is for the forest administrator.
                    html += '<span style="font-weight:normal;color:lightgray;">Organization: [' + thiz.options.Sent[i].bwWorkflowAppId + ']';

                    // INTERNAL/EXTERNAL
                    if (thiz.options.Sent[i].ThisEmailIsFromAnInternalSource && (thiz.options.Sent[i].ThisEmailIsFromAnInternalSource == true)) {
                        html += ' <span style="color:tomato;">INTERNAL</span>';
                    } else {
                        html += ' <span style="color:tomato;">EXTERNAL</span>';
                    }

                    html += '</span>';
                    html += '       <br />';
                    //}

                    //var bodyTextStartIndex = data[i].Body.indexOf('>');
                    //var bodyTextEndIndex = data[i].Body.substring(bodyTextStartIndex).indexOf('<') + 1;
                    //var bodyTextEndIndex2 = data[i].Body.substring(bodyTextEndIndex).indexOf('<') + 1;
                    //var bodyText = data[i].Body.substring(bodyTextEndIndex, bodyTextEndIndex2);
                    //html += '<span style="color:grey;">' + bodyText + ' ...</span>'; //  we have to do this because i we render the html it affect s the whole display in an unpredictable manner!!!
                    //html += '       <br />';

                    html += '   </td>';
                    //displayAlertDialog('xcx231232 thiz.options.Sent[i]: ' + JSON.stringify(thiz.options.Sent[i]));


                    html += '<td class="bwConfiguration_Trashbin" style="max-width:40px;" onclick="$(\'.bwConfiguration\').bwConfiguration(\'deleteIndividualEmail\', \'' + thiz.options.Sent[i]._id + '\');event.stopPropagation();">';
                    html += '<img src="/images/trashbin.png" />';
                    html += '</td>';



                    html += '  </tr>';
                }
                html += '</table>';

                html += '           </div>';

                // This if statement is here because the user may use a menu button to switch to a different screen before this happens... so this prevents the error being displayed.
                if ($(thiz.element).find('#spanEmailPicker') && $(thiz.element).find('#spanEmailPicker')[0]) {

                    $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;

                    // Quill subject editor.
                    html = '';
                    html += '<div style="height:15px;">&nbsp;</div>';



                    //html += '                       <div class="spanButton" style="width:100px;text-align:right;" title="Click to send this email now!" onclick="$(\'.bwConfiguration\').bwConfiguration(\'sendEmailNow\');">';
                    //html += '                           ✉&nbsp;Send Now > xcx5';
                    //html += '                       </div>';






                    //html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                    //html += 'From:';
                    //html += '</span>';
                    html += '<br />';
                    html += '   <div id="bwEmailView_From"></div>';
                    html += '<br />';

                    html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                    html += 'To:';
                    html += '</span>';
                    html += '<br />';
                    html += '   <div id="bwEmailView_To"></div>';
                    html += '<br />';


                    html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                    html += 'Subject:';
                    html += '</span>';
                    html += '<br />';
                    html += '   <div id="bwQuilltoolbarForSubject">';
                    //html += '       <button id="btnQuill_InsertADataItemForSubject" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
                    html += '   </div>';
                    //html += '   <div id="quillConfigureNewUserEmailsDialog_Subject" style="height:50px;"></div>'; // Quill.
                    html += '<input type="text" id="quillConfigureNewUserEmailsDialog_Subject" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';

                    // Quill body editor.
                    html += '<br /><br />';
                    html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                    html += 'Body:';
                    html += '</span>';
                    html == '<br />';
                    html += '   <div id="bwQuilltoolbar">';
                    //html += '       <button id="btnQuill_InsertADataItem" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';

                    html += '   </div>';
                    html += '   <div id="quillConfigureNewUserEmailsDialog_Body" style="height:375px;"></div>'; // Quill.
                    // Save button.
                    //html += '   <br />';
                    //html += '   <span id="spanConfigureEmailNotificationsDialogSaveButton">[spanConfigureEmailNotificationsDialogSaveButton]</span>'; // ☑ 
                    //html += '   <br /><br />';
                    // Preview/Edit button.
                    //html += '   <div id="divNewUserEmailEditor_PreviewAndEditButton" class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;"></div>';
                    //html += '   <br /><br />';
                    html += '</div>';


                    //$(thiz.element).find('#spanSelectedEmail')[0].innerHTML = html;
                    try {
                        $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = html;
                    } catch (e) { }


                    //thiz.viewIndividualEmail_Inbox('btnEditRaciRoles_undefined', 'undefined', 'undefined', 'undefined', data[0].bwSentEmailId);
                }
            }

        } catch (e) {
            console.log('Exception in renderEmails_Junk(): ' + e.message + ', ' + e.stack);
            alert('Exception in renderEmails_Junk(): ' + e.message + ', ' + e.stack);
        }
    },

    renderEmails_Archived: function (bwWorkflowAppId) {
        try {
            console.log('In renderEmails_Archived(). bwWorkflowAppId: ' + bwWorkflowAppId);
            var thiz = this;

            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            if (bwWorkflowAppId != 'all') {
                bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            }

            this.options.pagingPage_SentEmail = 0; // If we want items to display properly, these need to be reset/set back to the beginning here.
            //this.options.pagingLimit_SentEmail = 20;

            $('#spanSelectedEmailSubject').html('');

            var html = '';

            // Display the top buttons.
            html += '                           <span class="emailEditor_topbarbutton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\');">';
            html += '                               <img title="Delete..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx123468" />&nbsp;Delete';
            html += '                           </span>';
            html += '&nbsp;&nbsp;';
            html += '                           <span class="emailEditor_topbarbutton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\', \'emptyfolder\');">';
            html += '                               <img title="Empty folder..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx23423467898">&nbsp;Empty folder';
            html += '                           </span>';
            $(thiz.element).find('#spanSelectedEmailType_TopButtons')[0].innerHTML = html; //'Pending Email';

            // Display the radio button and the title.
            html = '';
            html += '<input type="checkbox" id="checkboxToggleSentEmailCheckboxes" onchange="$(\'.bwConfiguration\').bwConfiguration(\'toggleSentEmailCheckboxes\', this);" />&nbsp;&nbsp;';
            html += '✉ Sent Items';

            $(thiz.element).find('#spanSelectedEmailType_Title')[0].innerHTML = html; //'Sent Email';

            // Make this button appear selected.
            $(thiz.element).find('#spanDisplaySentEmailButton').removeClass('bwConfiguration_LeftMenuButton').addClass('bwConfiguration_LeftMenuButton_Selected');
            $(thiz.element).find('#spanDisplayPendingEmailButton').removeClass('bwConfiguration_LeftMenuButton_Selected').addClass('bwConfiguration_LeftMenuButton');

            // Clear these in the beginning, because it may take a few seconds to re-populate, and this gives the user some visual feedback that something is going on.
            $(thiz.element).find('#spanEmailPicker')[0].innerHTML = '';
            $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '';

            console.log('xcx2313555. In bwConfiguration.js.renderEmails_Archived(). Calling GET ' + webserviceurl + '/participantemail_inbox/ this.options.OnlyDisplayEmailsForCurrentParticipant: ' + this.options.OnlyDisplayEmailsForCurrentParticipant);


            var html = '';

            html += '           <div xcx="xcx21323663" style="width:460px;height:600px;overflow-y: scroll;overflow-x:scroll;">'; // The width is set here for the email list... 2-9-2022 scroll can be change dto hidden...

            if (!thiz.options.Sent.length || thiz.options.Sent.length == 0) {

                html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
                html += '  There are no sent emails.';
                html += '<span>';

                html += '           </div>';

                if ($(thiz.element).find('#spanEmailPicker') && $(thiz.element).find('#spanEmailPicker')[0]) {
                    $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;
                }
                if ($(thiz.element).find('#spanSelectedEmail') && $(thiz.element).find('#spanSelectedEmail')[0]) {
                    $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = '';
                }

            } else {

                //
                // This is our email. 12-12-2023.
                //

                html += '<table xcx="xcx111948475664" style="max-width:460px;">'; // width:460px;height:600px;overflow-y: scroll;overflow-x:hidden;

                for (var i = 0; i < thiz.options.Sent.length; i++) {
                    //html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
                    html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" _id="' + thiz.options.Sent[i]._id + '" class="bwEmailInboxRow" xcx="xcx2224555-3" onclick="$(\'.bwConfiguration\').bwConfiguration(\'viewIndividualEmail_Inbox\', \'' + 'btnEditRaciRoles_' + thiz.options.Sent[i].bwParticipantId + '\', \'' + thiz.options.Sent[i].bwParticipantId + '\', \'' + thiz.options.Sent[i].bwParticipantFriendlyName + '\', \'' + thiz.options.Sent[i].bwParticipantEmail + '\', \'' + thiz.options.Sent[i]._id + '\');" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + thiz.options.Sent[i].bwParticipantId + '\', \'' + thiz.options.Sent[i].bwParticipantId + '\');">';
                    //debugger; // xcx999999
                    html += '    <td style="vertical-align:top;max-width:20px;"><input type="checkbox" class="sentEmailCheckbox" bwsentemailid="' + thiz.options.Sent[i].bwSentEmailId + '" /></td>';
                    //debugger;
                    //var timestamp = getFriendlyDateAndTime(data[i].Timestamp);
                    //html += '    <td style="white-space:nowrap;">' + timestamp + '</td>';
                    //html += '    <td>' + data[i].ToParticipantEmail + '</td>';
                    //html += '    <td>' + data[i].Subject + '</td>'; // html += '    <td>' + data[i].FromEmailAddress + '</td>';
                    //html += '    <td><input type="button" bwpendingemailid="xxpeid"' + data[i].EmailLink + '" value="View" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'viewPendingEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwPendingEmailId + '\');" /></td>';



                    html += '    <td id="bwConfiguration_InnerLeftMenuButton_' + thiz.options.Sent[i].bwSentEmailId + '" style="border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px;max-width:350px;">';
                    //debugger; // RelatedRequestId	ad19f2b8-707f-40ad-8228-a07d55a1ddac



                    // data[i].mail_from
                    //html += '<span style="font-weight:bold;color:black;">' + data[i].ToParticipantFriendlyName + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';
                    //html += '<span style="font-weight:bold;color:black;">' + data[i].mail_from.original + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';

                    var emailAddress = '';
                    if (thiz.options.Sent[i].from && thiz.options.Sent[i].from[0] && thiz.options.Sent[i].from[0].address) {
                        emailAddress = thiz.options.Sent[i].from[0].address;
                    } else {
                        emailAddress = thiz.options.Sent[i].from;
                    }

                    if (thiz.options.Sent[i].TheUserHasReadThisEmail && (thiz.options.Sent[i].TheUserHasReadThisEmail == true)) {
                        html += '<span style="font-weight:normal;color:black;" class="bwEmailInboxRow_EmailAddress">' + emailAddress + '<br />';
                    } else {
                        html += '<span style="font-weight:bold;color:black;" class="bwEmailInboxRow_EmailAddress">' + emailAddress + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';
                    }

                    //html += '<span style="font-weight:normal;color:tomato;">' + timestamp + '</span>';
                    // 2-3-2022
                    var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(thiz.options.Sent[i].timestamp);
                    html += '<span style="font-weight:normal;color:tomato;">' + timestamp4 + '</span>';



                    html += '       <br />';
                    //debugger;
                    //html += 'RelatedRequestId: ' + data[i].RelatedRequestId + '</span></span>';
                    html += '</span>';
                    //html += '       <br />';

                    var subject = '';
                    if (thiz.options.Sent[i].subject) {
                        subject = thiz.options.Sent[i].subject.substring(0, 55);
                    } else {
                        subject = '[no subject]';
                    }

                    if (thiz.options.Sent[i].TheUserHasReadThisEmail && (thiz.options.Sent[i].TheUserHasReadThisEmail == true)) {
                        html += '<span style="font-weight:lighter;color:#95b1d3;" class="bwEmailInboxRow_Subject">' + subject + ' ...</span>';
                    } else {
                        html += '<span style="font-weight:bold;color:#95b1d3;" class="bwEmailInboxRow_Subject">' + subject + ' ...</span>';
                    }

                    html += '       <br />';

                    //if (bwWorkflowAppId == 'all') { // This is for the forest administrator.
                    html += '<span style="font-weight:normal;color:lightgray;">Organization: [' + thiz.options.Sent[i].bwWorkflowAppId + ']';

                    // INTERNAL/EXTERNAL
                    if (thiz.options.Sent[i].ThisEmailIsFromAnInternalSource && (thiz.options.Sent[i].ThisEmailIsFromAnInternalSource == true)) {
                        html += ' <span style="color:tomato;">INTERNAL</span>';
                    } else {
                        html += ' <span style="color:tomato;">EXTERNAL</span>';
                    }

                    html += '</span>';
                    html += '       <br />';
                    //}

                    //var bodyTextStartIndex = data[i].Body.indexOf('>');
                    //var bodyTextEndIndex = data[i].Body.substring(bodyTextStartIndex).indexOf('<') + 1;
                    //var bodyTextEndIndex2 = data[i].Body.substring(bodyTextEndIndex).indexOf('<') + 1;
                    //var bodyText = data[i].Body.substring(bodyTextEndIndex, bodyTextEndIndex2);
                    //html += '<span style="color:grey;">' + bodyText + ' ...</span>'; //  we have to do this because i we render the html it affect s the whole display in an unpredictable manner!!!
                    //html += '       <br />';

                    html += '   </td>';
                    //displayAlertDialog('xcx231232 thiz.options.Sent[i]: ' + JSON.stringify(thiz.options.Sent[i]));


                    html += '<td class="bwConfiguration_Trashbin" style="max-width:40px;" onclick="$(\'.bwConfiguration\').bwConfiguration(\'deleteIndividualEmail\', \'' + thiz.options.Sent[i]._id + '\');event.stopPropagation();">';
                    html += '<img src="/images/trashbin.png" />';
                    html += '</td>';



                    html += '  </tr>';
                }
                html += '</table>';

                html += '           </div>';

                // This if statement is here because the user may use a menu button to switch to a different screen before this happens... so this prevents the error being displayed.
                if ($(thiz.element).find('#spanEmailPicker') && $(thiz.element).find('#spanEmailPicker')[0]) {

                    $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;

                    // Quill subject editor.
                    html = '';
                    html += '<div style="height:15px;">&nbsp;</div>';



                    //html += '                       <div class="spanButton" style="width:100px;text-align:right;" title="Click to send this email now!" onclick="$(\'.bwConfiguration\').bwConfiguration(\'sendEmailNow\');">';
                    //html += '                           ✉&nbsp;Send Now > xcx5';
                    //html += '                       </div>';






                    //html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                    //html += 'From:';
                    //html += '</span>';
                    html += '<br />';
                    html += '   <div id="bwEmailView_From"></div>';
                    html += '<br />';

                    html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                    html += 'To:';
                    html += '</span>';
                    html += '<br />';
                    html += '   <div id="bwEmailView_To"></div>';
                    html += '<br />';


                    html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                    html += 'Subject:';
                    html += '</span>';
                    html += '<br />';
                    html += '   <div id="bwQuilltoolbarForSubject">';
                    //html += '       <button id="btnQuill_InsertADataItemForSubject" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
                    html += '   </div>';
                    //html += '   <div id="quillConfigureNewUserEmailsDialog_Subject" style="height:50px;"></div>'; // Quill.
                    html += '<input type="text" id="quillConfigureNewUserEmailsDialog_Subject" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';

                    // Quill body editor.
                    html += '<br /><br />';
                    html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                    html += 'Body:';
                    html += '</span>';
                    html == '<br />';
                    html += '   <div id="bwQuilltoolbar">';
                    //html += '       <button id="btnQuill_InsertADataItem" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';

                    html += '   </div>';
                    html += '   <div id="quillConfigureNewUserEmailsDialog_Body" style="height:375px;"></div>'; // Quill.
                    // Save button.
                    //html += '   <br />';
                    //html += '   <span id="spanConfigureEmailNotificationsDialogSaveButton">[spanConfigureEmailNotificationsDialogSaveButton]</span>'; // ☑ 
                    //html += '   <br /><br />';
                    // Preview/Edit button.
                    //html += '   <div id="divNewUserEmailEditor_PreviewAndEditButton" class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;"></div>';
                    //html += '   <br /><br />';
                    html += '</div>';


                    //$(thiz.element).find('#spanSelectedEmail')[0].innerHTML = html;
                    try {
                        $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = html;
                    } catch (e) { }


                    //thiz.viewIndividualEmail_Inbox('btnEditRaciRoles_undefined', 'undefined', 'undefined', 'undefined', data[0].bwSentEmailId);
                }
            }

        } catch (e) {
            console.log('Exception in renderEmails_Archived(): ' + e.message + ', ' + e.stack);
            alert('Exception in renderEmails_Archived(): ' + e.message + ', ' + e.stack);
        }
    },




    renderEmails_TrashBin: function (bwWorkflowAppId) {
        try {
            console.log('In renderEmails_TrashBin(). bwWorkflowAppId: ' + bwWorkflowAppId);
            var thiz = this;

            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            if (bwWorkflowAppId != 'all') {
                bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            }

            this.options.pagingPage_SentEmail = 0; // If we want items to display properly, these need to be reset/set back to the beginning here.
            //this.options.pagingLimit_SentEmail = 20;

            $('#spanSelectedEmailSubject').html('');

            var html = '';

            // Display the top buttons.
            html += '                           <span class="emailEditor_topbarbutton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\');">';
            html += '                               <img title="Delete..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx123468" />&nbsp;Delete';
            html += '                           </span>';
            html += '&nbsp;&nbsp;';
            html += '                           <span class="emailEditor_topbarbutton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\', \'emptyfolder\');">';
            html += '                               <img title="Empty folder..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx23423467898">&nbsp;Empty folder';
            html += '                           </span>';
            $(thiz.element).find('#spanSelectedEmailType_TopButtons')[0].innerHTML = html; //'Pending Email';

            // Display the radio button and the title.
            html = '';
            html += '<input type="checkbox" id="checkboxToggleSentEmailCheckboxes" onchange="$(\'.bwConfiguration\').bwConfiguration(\'toggleSentEmailCheckboxes\', this);" />&nbsp;&nbsp;';
            html += '✉ TrashBin Items';

            $(thiz.element).find('#spanSelectedEmailType_Title')[0].innerHTML = html; //'Sent Email';

            // Make this button appear selected.
            $(thiz.element).find('#spanDisplaySentEmailButton').removeClass('bwConfiguration_LeftMenuButton').addClass('bwConfiguration_LeftMenuButton_Selected');
            $(thiz.element).find('#spanDisplayPendingEmailButton').removeClass('bwConfiguration_LeftMenuButton_Selected').addClass('bwConfiguration_LeftMenuButton');

            // Clear these in the beginning, because it may take a few seconds to re-populate, and this gives the user some visual feedback that something is going on.
            $(thiz.element).find('#spanEmailPicker')[0].innerHTML = '';
            $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '';

            console.log('xcx2313555. In bwConfiguration.js.renderEmails_TrashBin(). Calling GET ' + webserviceurl + '/participantemail_inbox/ this.options.OnlyDisplayEmailsForCurrentParticipant: ' + this.options.OnlyDisplayEmailsForCurrentParticipant);


            var html = '';

            html += '           <div xcx="xcx21323663" style="width:460px;height:600px;overflow-y: scroll;overflow-x:scroll;">'; // The width is set here for the email list... 2-9-2022 scroll can be change dto hidden...

            if (!thiz.options.TrashBin.length || thiz.options.TrashBin.length == 0) {

                html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
                html += '  There are no sent emails.';
                html += '<span>';

                html += '           </div>';

                if ($(thiz.element).find('#spanEmailPicker') && $(thiz.element).find('#spanEmailPicker')[0]) {
                    $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;
                }
                if ($(thiz.element).find('#spanSelectedEmail') && $(thiz.element).find('#spanSelectedEmail')[0]) {
                    $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = '';
                }

            } else {

                //
                // This is our email. 12-12-2023.
                //

                html += '<table xcx="xcx111948475664" style="max-width:460px;">'; // width:460px;height:600px;overflow-y: scroll;overflow-x:hidden;

                for (var i = 0; i < thiz.options.TrashBin.length; i++) {
                    //html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
                    html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" _id="' + thiz.options.TrashBin[i]._id + '" class="bwEmailInboxRow" xcx="xcx2224555-3" onclick="$(\'.bwConfiguration\').bwConfiguration(\'viewIndividualEmail_TrashBin\', \'' + 'btnEditRaciRoles_' + thiz.options.TrashBin[i].bwParticipantId + '\', \'' + thiz.options.TrashBin[i].bwParticipantId + '\', \'' + thiz.options.TrashBin[i].bwParticipantFriendlyName + '\', \'' + thiz.options.TrashBin[i].bwParticipantEmail + '\', \'' + thiz.options.TrashBin[i]._id + '\');" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + thiz.options.TrashBin[i].bwParticipantId + '\', \'' + thiz.options.TrashBin[i].bwParticipantId + '\');">';
                    //debugger; // xcx999999
                    html += '    <td style="vertical-align:top;max-width:20px;"><input type="checkbox" class="sentEmailCheckbox" bwsentemailid="' + thiz.options.TrashBin[i].bwSentEmailId + '" /></td>';
                    //debugger;
                    //var timestamp = getFriendlyDateAndTime(data[i].Timestamp);
                    //html += '    <td style="white-space:nowrap;">' + timestamp + '</td>';
                    //html += '    <td>' + data[i].ToParticipantEmail + '</td>';
                    //html += '    <td>' + data[i].Subject + '</td>'; // html += '    <td>' + data[i].FromEmailAddress + '</td>';
                    //html += '    <td><input type="button" bwpendingemailid="xxpeid"' + data[i].EmailLink + '" value="View" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'viewPendingEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwPendingEmailId + '\');" /></td>';



                    html += '    <td id="bwConfiguration_InnerLeftMenuButton_' + thiz.options.TrashBin[i].bwSentEmailId + '" style="border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px;max-width:350px;">';
                    //debugger; // RelatedRequestId	ad19f2b8-707f-40ad-8228-a07d55a1ddac



                    // data[i].mail_from
                    //html += '<span style="font-weight:bold;color:black;">' + data[i].ToParticipantFriendlyName + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';
                    //html += '<span style="font-weight:bold;color:black;">' + data[i].mail_from.original + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';

                    var emailAddress = '';
                    if (thiz.options.TrashBin[i].from && thiz.options.TrashBin[i].from[0] && thiz.options.TrashBin[i].from[0].address) {
                        emailAddress = thiz.options.TrashBin[i].from[0].address;
                    } else {
                        emailAddress = thiz.options.TrashBin[i].from;
                    }

                    if (thiz.options.TrashBin[i].TheUserHasReadThisEmail && (thiz.options.TrashBin[i].TheUserHasReadThisEmail == true)) {
                        html += '<span style="font-weight:normal;color:black;" class="bwEmailInboxRow_EmailAddress">' + emailAddress + '<br />';
                    } else {
                        html += '<span style="font-weight:bold;color:black;" class="bwEmailInboxRow_EmailAddress">' + emailAddress + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';
                    }

                    //html += '<span style="font-weight:normal;color:tomato;">' + timestamp + '</span>';
                    // 2-3-2022
                    var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(thiz.options.TrashBin[i].timestamp);
                    html += '<span style="font-weight:normal;color:tomato;">' + timestamp4 + '</span>';



                    html += '       <br />';
                    //debugger;
                    //html += 'RelatedRequestId: ' + data[i].RelatedRequestId + '</span></span>';
                    html += '</span>';
                    //html += '       <br />';

                    var subject = '';
                    if (thiz.options.TrashBin[i].subject) {
                        subject = thiz.options.TrashBin[i].subject.substring(0, 55);
                    } else {
                        subject = '[no subject]';
                    }

                    if (thiz.options.TrashBin[i].TheUserHasReadThisEmail && (thiz.options.TrashBin[i].TheUserHasReadThisEmail == true)) {
                        html += '<span style="font-weight:lighter;color:#95b1d3;" class="bwEmailInboxRow_Subject">' + subject + ' ...</span>';
                    } else {
                        html += '<span style="font-weight:bold;color:#95b1d3;" class="bwEmailInboxRow_Subject">' + subject + ' ...</span>';
                    }

                    html += '       <br />';

                    //if (bwWorkflowAppId == 'all') { // This is for the forest administrator.
                    html += '<span style="font-weight:normal;color:lightgray;">Organization: [' + thiz.options.TrashBin[i].bwWorkflowAppId + ']';

                    // INTERNAL/EXTERNAL
                    if (thiz.options.TrashBin[i].ThisEmailIsFromAnInternalSource && (thiz.options.TrashBin[i].ThisEmailIsFromAnInternalSource == true)) {
                        html += ' <span style="color:tomato;">INTERNAL</span>';
                    } else {
                        html += ' <span style="color:tomato;">EXTERNAL</span>';
                    }

                    html += '</span>';
                    html += '       <br />';
                    //}

                    //var bodyTextStartIndex = data[i].Body.indexOf('>');
                    //var bodyTextEndIndex = data[i].Body.substring(bodyTextStartIndex).indexOf('<') + 1;
                    //var bodyTextEndIndex2 = data[i].Body.substring(bodyTextEndIndex).indexOf('<') + 1;
                    //var bodyText = data[i].Body.substring(bodyTextEndIndex, bodyTextEndIndex2);
                    //html += '<span style="color:grey;">' + bodyText + ' ...</span>'; //  we have to do this because i we render the html it affect s the whole display in an unpredictable manner!!!
                    //html += '       <br />';

                    html += '   </td>';
                    //displayAlertDialog('xcx231232 thiz.options.TrashBin[i]: ' + JSON.stringify(thiz.options.TrashBin[i]));


                    html += '<td class="bwConfiguration_Trashbin" style="max-width:40px;" onclick="$(\'.bwConfiguration\').bwConfiguration(\'deleteIndividualEmail\', \'' + thiz.options.TrashBin[i]._id + '\');event.stopPropagation();">';
                    html += '<img src="/images/trashbin.png" />';
                    html += '</td>';



                    html += '  </tr>';
                }
                html += '</table>';

                html += '           </div>';

                // This if statement is here because the user may use a menu button to switch to a different screen before this happens... so this prevents the error being displayed.
                if ($(thiz.element).find('#spanEmailPicker') && $(thiz.element).find('#spanEmailPicker')[0]) {

                    $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;

                    // Quill subject editor.
                    html = '';
                    html += '<div style="height:15px;">&nbsp;</div>';



                    //html += '                       <div class="spanButton" style="width:100px;text-align:right;" title="Click to send this email now!" onclick="$(\'.bwConfiguration\').bwConfiguration(\'sendEmailNow\');">';
                    //html += '                           ✉&nbsp;Send Now > xcx5';
                    //html += '                       </div>';






                    //html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                    //html += 'From:';
                    //html += '</span>';
                    html += '<br />';
                    html += '   <div id="bwEmailView_From"></div>';
                    html += '<br />';

                    html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                    html += 'To:';
                    html += '</span>';
                    html += '<br />';
                    html += '   <div id="bwEmailView_To"></div>';
                    html += '<br />';


                    html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                    html += 'Subject:';
                    html += '</span>';
                    html += '<br />';
                    html += '   <div id="bwQuilltoolbarForSubject">';
                    //html += '       <button id="btnQuill_InsertADataItemForSubject" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
                    html += '   </div>';
                    //html += '   <div id="quillConfigureNewUserEmailsDialog_Subject" style="height:50px;"></div>'; // Quill.
                    html += '<input type="text" id="quillConfigureNewUserEmailsDialog_Subject" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';

                    // Quill body editor.
                    html += '<br /><br />';
                    html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                    html += 'Body:';
                    html += '</span>';
                    html == '<br />';
                    html += '   <div id="bwQuilltoolbar">';
                    //html += '       <button id="btnQuill_InsertADataItem" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';

                    html += '   </div>';
                    html += '   <div id="quillConfigureNewUserEmailsDialog_Body" style="height:375px;"></div>'; // Quill.
                    // Save button.
                    //html += '   <br />';
                    //html += '   <span id="spanConfigureEmailNotificationsDialogSaveButton">[spanConfigureEmailNotificationsDialogSaveButton]</span>'; // ☑ 
                    //html += '   <br /><br />';
                    // Preview/Edit button.
                    //html += '   <div id="divNewUserEmailEditor_PreviewAndEditButton" class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;"></div>';
                    //html += '   <br /><br />';
                    html += '</div>';


                    //$(thiz.element).find('#spanSelectedEmail')[0].innerHTML = html;
                    try {
                        $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = html;
                    } catch (e) { }


                    //thiz.viewIndividualEmail_Inbox('btnEditRaciRoles_undefined', 'undefined', 'undefined', 'undefined', data[0].bwSentEmailId);
                }
            }

        } catch (e) {
            console.log('Exception in renderEmails_TrashBin(): ' + e.message + ', ' + e.stack);
            alert('Exception in renderEmails_TrashBin(): ' + e.message + ', ' + e.stack);
        }
    },

    displayIncomingEmails: function (bwWorkflowAppId) {
        try {
            console.log('In displayIncomingEmails(). bwWorkflowAppId: ' + bwWorkflowAppId);
            var thiz = this;
            debugger;
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            if (bwWorkflowAppId != 'all') {
                bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            }

            this.options.pagingPage_SentEmail = 0; // If we want items to display properly, these need to be reset/set back to the beginning here.
            //this.options.pagingLimit_SentEmail = 20;

            $('#spanSelectedEmailSubject').html('');

            try {
                var html = '';

                // Display the top buttons.
                html += '                           <span class="emailEditor_topbarbutton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\');">';
                html += '                               <img title="Delete..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx123468" />&nbsp;Delete';
                html += '                           </span>';
                html += '&nbsp;&nbsp;';
                html += '                           <span class="emailEditor_topbarbutton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\', \'emptyfolder\');">';
                html += '                               <img title="Empty folder..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx23423467898">&nbsp;Empty folder';
                html += '                           </span>';
                $(thiz.element).find('#spanSelectedEmailType_TopButtons')[0].innerHTML = html; //'Pending Email';

                // Display the radio button and the title.
                html = '';
                html += '<input type="checkbox" id="checkboxToggleSentEmailCheckboxes" onchange="$(\'.bwConfiguration\').bwConfiguration(\'toggleSentEmailCheckboxes\', this);" />&nbsp;&nbsp;';
                html += '✉ Incoming Items';






                html += '               <span id="spanSelectedEmailSubject" style="font-size:13pt;font-weight:bold;color:#95b1d3;"></span>';
                html += '               <br />';
                html += '               <span id="spanSelectedEmail"></span>';








                $(thiz.element).find('#spanSelectedEmailType_Title')[0].innerHTML = html; //'Sent Email';

                // Make this button appear selected.
                $(thiz.element).find('#spanDisplaySentEmailButton').removeClass('bwConfiguration_LeftMenuButton').addClass('bwConfiguration_LeftMenuButton_Selected');
                $(thiz.element).find('#spanDisplayPendingEmailButton').removeClass('bwConfiguration_LeftMenuButton_Selected').addClass('bwConfiguration_LeftMenuButton');

            } catch (e) { }

            // Clear these in the beginning, because it may take a few seconds to re-populate, and this gives the user some visual feedback that something is going on.
            $(thiz.element).find('#spanEmailPicker')[0].innerHTML = '';
            $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '';

            //if (this.options.backendAdministrationMode == true) {

            var json = {
                //bwWorkflowAppId: bwWorkflowAppId,
                pagingPage: this.options.pagingPage_SentEmail,
                pagingLimit: this.options.pagingLimit_SentEmail
            }
            $.ajax({
                url: webserviceurl + "/incomingemail", // "/bwadminsentemail2",
                type: "POST",
                data: json,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    try {
                        debugger;
                        var html = '';

                        if (!data.length || data.length == 0) {

                            html += '<span style="font-size:15pt;font-weight:normal;color:black;">';
                            html += '  There are no incoming emails.';
                            html += '<span>';
                            $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;
                            $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = '';

                        } else {

                            html += '<table id="tableSentEmail1" bwworkflowappid="' + bwWorkflowAppId + '" >';

                            for (var i = 0; i < data.length; i++) {

                                html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" xcx="xcx2224555-2" onclick="$(\'.bwConfiguration\').bwConfiguration(\'viewIndividualEmail_Inbox\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwSentEmailId + '\');" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';

                                html += '    <td style="vertical-align:top;"><input type="checkbox" class="sentEmailCheckbox" bwsentemailid="' + data[i].bwSentEmailId + '" /></td>';

                                html += '    <td colspan="4" style="border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px;">';
                                html += '       <span style="font-weight:bold;color:black;">' + data[i].ToParticipantFriendlyName + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';
                                var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(data[i].Timestamp);
                                html += '       <span style="font-weight:normal;color:tomato;">' + timestamp4 + '</span>';
                                html += '       <br />';
                                html += '       </span>';
                                html += '       <span style="font-weight:lighter;color:#95b1d3;">' + data[i].Subject.substring(0, 55) + ' ...</span>';
                                html += '       <br />';
                                html += '       <span style="font-weight:normal;color:lightgray;">Organization: [' + data[i].bwWorkflowAppId + ']</span>';
                                html += '       <br />';
                                html += '   </td>';

                                html += '  </tr>';
                            }
                            html += '</table>';

                            alert('xxxxxxxxxxxxxxxx34235. Does the code ever get here?'); // does the code ever get here? // 2-9-2022

                            $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;

                            html = '';
                            html += '<div style="height:25px;">&nbsp;</div>';
                            //html += '                       <div class="spanButton" style="width:100px;text-align:right;" title="Click to send this email now!" onclick="$(\'.bwConfiguration\').bwConfiguration(\'sendEmailNow\');">';
                            //html += '                           ✉&nbsp;Send Now > xcx4';
                            //html += '                       </div>';
                            html += '<span id="spanSelectedEmailSubject" style="font-size:13pt;font-weight:bold;color:#95b1d3;"></span>';
                            html += '<br /><br />';
                            // Quill subject editor.
                            html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                            html += 'Subject:';
                            html += '</span>';
                            html += '<br />';
                            html += '   <div id="bwQuilltoolbarForSubject">';
                            html += '       <button id="btnQuill_InsertADataItemForSubject" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
                            html += '   </div>';
                            //html += '   <div id="quillConfigureNewUserEmailsDialog_Subject" style="height:50px;"></div>'; // Quill.
                            html += '<input type="text" id="quillConfigureNewUserEmailsDialog_Subject" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';

                            // Quill body editor.
                            html += '<br />';
                            html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                            html += 'Body: xcx3';
                            html += '</span>';
                            html == '<br />';
                            html += '   <div id="bwQuilltoolbar">';
                            html += '       <button id="btnQuill_InsertADataItem" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
                            //html += '       <select class="ql-size">';
                            //html += '           <option value="small"></option>';
                            //html += '           <option selected></option>';
                            //html += '           <option value="large"></option>';
                            //html += '           <option value="huge"></option>';
                            //html += '       </select>';
                            //html += '       <button class="ql-bold"></button>';
                            //html += '       <button class="ql-script" value="sub"></button>';
                            //html += '       <button class="ql-script" value="super"></button>';
                            html += '   </div>';
                            html += '   <div id="quillConfigureNewUserEmailsDialog_Body" style="height:375px;"></div>'; // Quill.
                            // Save button.
                            //html += '   <br />';
                            //html += '   <span id="spanConfigureEmailNotificationsDialogSaveButton">[spanConfigureEmailNotificationsDialogSaveButton]</span>'; // ☑ 
                            //html += '   <br /><br />';
                            // Preview/Edit button.
                            //html += '   <div id="divNewUserEmailEditor_PreviewAndEditButton" class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;"></div>';
                            //html += '   <br /><br />';
                            html += '</div>';
















                            $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = html;


                            thiz.viewIndividualEmail_Inbox('btnEditRaciRoles_undefined', 'undefined', 'undefined', 'undefined', data[0].bwIncomingEmailId);


                        }
                    } catch (e) {
                        console.log('Exception in admin.js.cmdDisplaySentEmails(): ' + e.message + ', ' + e.stack);
                        alert('Exception in admin.js.cmdDisplaySentEmails(): ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in admin.js.cmdDisplaySentEmails():' + errorCode + ', ' + errorMessage);
                }
            });
            //} else {



            //    if (this.options.OnlyDisplayEmailsForCurrentParticipant == true) {

            //        $.ajax({
            //            url: webserviceurl + "/bwparticipantsentemail/" + bwWorkflowAppId + "/" + participantId, // bwparticipantpendingemail // bwwebappsentemail
            //            type: "GET",
            //            contentType: 'application/json',
            //            success: function (data) {
            //                try {
            //                    var html = '';

            //                    if (!data.length || data.length == 0) {
            //                        html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
            //                        html += '  There are no sent emails.';
            //                        html += '<span>';

            //                        if ($(thiz.element).find('#spanEmailPicker') && $(thiz.element).find('#spanEmailPicker')[0]) {
            //                            $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;
            //                        }
            //                        if ($(thiz.element).find('#spanSelectedEmail') && $(thiz.element).find('#spanSelectedEmail')[0]) {
            //                            $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = '';
            //                        }
            //                    } else {



            //                        console.log('xxxxxxxxxxxxxxxx9999. Does the code ever get here?'); // does the code ever get here? // 2-9-2022


            //                        html += '<table style="width:350px;">';

            //                        for (var i = 0; i < data.length; i++) {
            //                            //html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
            //                            html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" xcx="xcx2224555-3" onclick="$(\'.bwConfiguration\').bwConfiguration(\'viewIndividualEmail_Inbox\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwSentEmailId + '\');" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
            //                            //debugger; // xcx999999
            //                            html += '    <td style="vertical-align:top;"><input type="checkbox" class="sentEmailCheckbox" bwsentemailid="' + data[i].bwSentEmailId + '" /></td>';
            //                            //debugger;
            //                            //var timestamp = getFriendlyDateAndTime(data[i].Timestamp);
            //                            //html += '    <td style="white-space:nowrap;">' + timestamp + '</td>';
            //                            //html += '    <td>' + data[i].ToParticipantEmail + '</td>';
            //                            //html += '    <td>' + data[i].Subject + '</td>'; // html += '    <td>' + data[i].FromEmailAddress + '</td>';
            //                            //html += '    <td><input type="button" bwpendingemailid="xxpeid"' + data[i].EmailLink + '" value="View" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'viewPendingEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwPendingEmailId + '\');" /></td>';
            //                            html += '    <td id="bwConfiguration_InnerLeftMenuButton_' + data[i].bwSentEmailId + '" colspan="4" style="border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px;">';
            //                            //debugger; // RelatedRequestId	ad19f2b8-707f-40ad-8228-a07d55a1ddac
            //                            html += '<span style="font-weight:bold;color:black;">' + data[i].ToParticipantFriendlyName + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';


            //                            //html += '<span style="font-weight:normal;color:tomato;">' + timestamp + '</span>';
            //                            // 2-3-2022
            //                            var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(data[i].Timestamp);
            //                            html += '<span style="font-weight:normal;color:tomato;">' + timestamp4 + '</span>';



            //                            html += '       <br />';
            //                            //debugger;
            //                            //html += 'RelatedRequestId: ' + data[i].RelatedRequestId + '</span></span>';
            //                            html += '</span>';
            //                            //html += '       <br />';
            //                            html += '<span style="font-weight:lighter;color:#95b1d3;">' + data[i].Subject.substring(0, 55) + ' ...</span>';
            //                            html += '       <br />';

            //                            //if (bwWorkflowAppId == 'all') { // This is for the forest administrator.
            //                            html += '<span style="font-weight:normal;color:lightgray;">Organization: [' + data[i].bwWorkflowAppId + ']</span>';
            //                            html += '       <br />';
            //                            //}

            //                            //var bodyTextStartIndex = data[i].Body.indexOf('>');
            //                            //var bodyTextEndIndex = data[i].Body.substring(bodyTextStartIndex).indexOf('<') + 1;
            //                            //var bodyTextEndIndex2 = data[i].Body.substring(bodyTextEndIndex).indexOf('<') + 1;
            //                            //var bodyText = data[i].Body.substring(bodyTextEndIndex, bodyTextEndIndex2);
            //                            //html += '<span style="color:grey;">' + bodyText + ' ...</span>'; //  we have to do this because i we render the html it affect s the whole display in an unpredictable manner!!!
            //                            //html += '       <br />';

            //                            html += '   </td>';

            //                            html += '  </tr>';
            //                        }
            //                        html += '</table>';


            //                        // This if statement is here because the user may use a menu button to switch to a different screen before this happens... so this prevents the error being displayed.
            //                        if ($(thiz.element).find('#spanEmailPicker') && $(thiz.element).find('#spanEmailPicker')[0]) {

            //                            $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;

            //                            // Quill subject editor.
            //                            html = '';
            //                            html += '<div style="height:15px;">&nbsp;</div>';
            //                            //html += '                       <div class="spanButton" style="width:100px;text-align:right;" title="Click to send this email now!" onclick="$(\'.bwConfiguration\').bwConfiguration(\'sendEmailNow\');">';
            //                            //html += '                           ✉&nbsp;Send Now > xcx5';
            //                            //html += '                       </div>';
            //                            html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
            //                            html += 'Subject:';
            //                            html += '</span>';
            //                            html += '<br />';
            //                            html += '   <div id="bwQuilltoolbarForSubject">';
            //                            //html += '       <button id="btnQuill_InsertADataItemForSubject" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
            //                            html += '   </div>';
            //                            //html += '   <div id="quillConfigureNewUserEmailsDialog_Subject" style="height:50px;"></div>'; // Quill.
            //                            html += '<input type="text" id="quillConfigureNewUserEmailsDialog_Subject" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';

            //                            // Quill body editor.
            //                            html += '<br /><br />';
            //                            html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
            //                            html += 'Body:';
            //                            html += '</span>';
            //                            html == '<br />';
            //                            html += '   <div id="bwQuilltoolbar">';
            //                            //html += '       <button id="btnQuill_InsertADataItem" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';

            //                            html += '   </div>';
            //                            html += '   <div id="quillConfigureNewUserEmailsDialog_Body" style="height:375px;"></div>'; // Quill.
            //                            // Save button.
            //                            //html += '   <br />';
            //                            //html += '   <span id="spanConfigureEmailNotificationsDialogSaveButton">[spanConfigureEmailNotificationsDialogSaveButton]</span>'; // ☑ 
            //                            //html += '   <br /><br />';
            //                            // Preview/Edit button.
            //                            //html += '   <div id="divNewUserEmailEditor_PreviewAndEditButton" class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;"></div>';
            //                            //html += '   <br /><br />';
            //                            html += '</div>';


            //                            $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = html;


            //                            thiz.viewIndividualEmail_Inbox('btnEditRaciRoles_undefined', 'undefined', 'undefined', 'undefined', data[0].bwSentEmailId);
            //                        }
            //                    }







            //                } catch (e) {
            //                    console.log('Exception in displayIncomingEmails(): ' + e.message + ', ' + e.stack);
            //                    displayAlertDialog('Exception in displayIncomingEmails(): ' + e.message + ', ' + e.stack);
            //                }
            //            },
            //            error: function (data, errorCode, errorMessage) {
            //                console.log('Error in bwConfiguration.js.displayIncomingEmails():xcx1: ' + errorCode + ', ' + errorMessage);
            //                //displayAlertDialog('Error in bwConfiguration.js.displayIncomingEmails():xcx1: ' + errorCode + ', ' + errorMessage); // PUT THIS BACK SOMETIME 5-5-2022
            //            }
            //        });







            //    } else {
            //        $.ajax({
            //            url: webserviceurl + "/bwwebappsentemail/" + bwWorkflowAppId,
            //            type: "DELETE",
            //            contentType: 'application/json',
            //            success: function (data) {
            //                try {
            //                    var html = '';

            //                    if (!data.length || data.length == 0) {
            //                        html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
            //                        html += '  There are no sent emails.';
            //                        html += '<span>';
            //                        try {
            //                            $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;
            //                            $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = '';
            //                        } catch (e) { }
            //                    } else {

            //                        html += '<table>';
            //                        for (var i = 0; i < data.length; i++) {
            //                            html += '<tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" xcx="xcx2224555-4" onclick="$(\'.bwConfiguration\').bwConfiguration(\'viewIndividualEmail_Inbox\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwSentEmailId + '\');" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
            //                            html += '   <td style="vertical-align:top;"><input type="checkbox" class="sentEmailCheckbox" bwsentemailid="' + data[i].bwSentEmailId + '" /></td>';
            //                            html += '   <td colspan="4" style="border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px;">';
            //                            html += '       <span style="font-weight:bold;color:black;">' + data[i].ToParticipantFriendlyName + ' <span style="font-weight:normal;">(' + data[i].ToParticipantEmail + ')</span><br />';
            //                            var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(data[i].Timestamp);
            //                            html += '       <span style="font-weight:normal;color:tomato;">' + timestamp4 + '</span>';
            //                            html += '           <br />';
            //                            html += '       </span>';
            //                            html += '       <span style="font-weight:lighter;color:#95b1d3;">' + data[i].Subject.substring(0, 55) + ' ...</span>';
            //                            html += '           <br />';
            //                            html += '       <span style="font-weight:normal;color:lightgray;">Organization: [' + data[i].bwWorkflowAppId + ']</span>';
            //                            html += '       <br />';
            //                            html += '   </td>';
            //                            html += '</tr>';
            //                        }
            //                        html += '</table>';

            //                        try {
            //                            $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;
            //                        } catch (e) { }

            //                        // Quill subject editor.
            //                        html = '';


            //                        html += '               <span id="spanSelectedEmailSubject" style="font-size:13pt;font-weight:bold;color:#95b1d3;"></span>';
            //                        html += '               <br />';
            //                        html += '               <span id="spanSelectedEmail"></span>';


            //                        html += '<div style="height:15px;">&nbsp;</div>';
            //                        //html += '                       <div class="spanButton" style="width:100px;text-align:right;" title="Click to send this email now!" onclick="$(\'.bwConfiguration\').bwConfiguration(\'sendEmailNow\');">';
            //                        //html += '                           ✉&nbsp;Send Now > xcx5';
            //                        //html += '                       </div>';
            //                        html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
            //                        html += 'Subject:';
            //                        html += '</span>';
            //                        html += '<br />';
            //                        html += '   <div id="bwQuilltoolbarForSubject">';
            //                        //html += '       <button id="btnQuill_InsertADataItemForSubject" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
            //                        html += '   </div>';
            //                        //html += '   <div id="quillConfigureNewUserEmailsDialog_Subject" style="height:50px;"></div>'; // Quill.
            //                        html += '<input type="text" id="quillConfigureNewUserEmailsDialog_Subject" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';

            //                        // Quill body editor.
            //                        html += '<br /><br />';
            //                        html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
            //                        html += 'Body:';
            //                        html += '</span>';
            //                        html == '<br />';
            //                        html += '   <div id="bwQuilltoolbar">';
            //                        //html += '       <button id="btnQuill_InsertADataItem" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
            //                        //html += '       <select class="ql-size">';
            //                        //html += '           <option value="small"></option>';
            //                        //html += '           <option selected></option>';
            //                        //html += '           <option value="large"></option>';
            //                        //html += '           <option value="huge"></option>';
            //                        //html += '       </select>';
            //                        //html += '       <button class="ql-bold"></button>';
            //                        //html += '       <button class="ql-script" value="sub"></button>';
            //                        //html += '       <button class="ql-script" value="super"></button>';
            //                        html += '   </div>';
            //                        html += '   <div id="quillConfigureNewUserEmailsDialog_Body" style="height:375px;"></div>'; // Quill.
            //                        // Save button.
            //                        //html += '   <br />';
            //                        //html += '   <span id="spanConfigureEmailNotificationsDialogSaveButton">[spanConfigureEmailNotificationsDialogSaveButton]</span>'; // ☑ 
            //                        //html += '   <br /><br />';
            //                        // Preview/Edit button.
            //                        //html += '   <div id="divNewUserEmailEditor_PreviewAndEditButton" class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;"></div>';
            //                        //html += '   <br /><br />';
            //                        html += '</div>';

            //                        try {
            //                            $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = html;
            //                        } catch (e) { }

            //                        thiz.viewIndividualEmail_Inbox('btnEditRaciRoles_undefined', 'undefined', 'undefined', 'undefined', data[0].bwSentEmailId);

            //                    }







            //                } catch (e) {
            //                    console.log('Exception in displayIncomingEmails(): ' + e.message + ', ' + e.stack);
            //                    displayAlertDialog('Exception in displayIncomingEmails(): ' + e.message + ', ' + e.stack);
            //                }
            //            },
            //            error: function (data, errorCode, errorMessage) {
            //                displayAlertDialog('Error in bwConfiguration.js.displayIncomingEmails():xcx2: ' + errorCode + ', ' + errorMessage);
            //            }
            //        });
            //    }

            //}

        } catch (e) {
            console.log('Exception in displayIncomingEmails(): ' + e.message + ', ' + e.stack);
            alert('Exception in displayIncomingEmails(): ' + e.message + ', ' + e.stack);
        }
    },

    viewForestPendingEmail: function (originElementId, bwParticipantId, bwParticipantFriendlyName, bwParticipantEmail, bwPendingEmailId) {
        try {
            //debugger;
            console.log('In viewForestPendingEmail(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ', bwPendingEmailId: ' + bwPendingEmailId);
            var thiz = this;
            $.ajax({
                url: webserviceurl + "/bwwebappforestpendingemail2/" + bwPendingEmailId,
                type: "DELETE",
                contentType: 'application/json',
                success: function (data) {
                    try {
                        $(thiz.element).find('#displayedemaildetails')[0].setAttribute('bwPendingEmailId', bwPendingEmailId);

                        // Hook up this button event so that the user can insert data items into the email.
                        //var customButton1 = document.querySelector('#btnQuill_InsertADataItemForSubject');
                        var customButton1 = $(thiz.element).find('#btnQuill_InsertADataItemForSubject')[0]; //document.querySelector();
                        customButton1.addEventListener('click', function () {
                            thiz.displayEmailDataItemPickerDialog('subject');
                        });

                        $($(thiz.element).find('#quillConfigureNewUserEmailsDialog_Body')[0]).summernote({
                            placeholder: data[0].Body, //'Hello stand alone ui',
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
                        //var customButton = document.querySelector('#btnQuill_InsertADataItem');
                        var customButton = $(thiz.element).find('#btnQuill_InsertADataItem')[0]; //document.querySelector($(thiz.element).find('#btnQuill_InsertADataItem')[0]);
                        customButton.addEventListener('click', function () {
                            console.log('In viewForestPendingEmail.quill.customButton.click().')
                            //console.log('btnQuill_InsertADataItem: This functionality is incomplete. Coming soon!');
                            //thiz.displayEmailDataItemPickerDialog('body');
                        });
                        //debugger;
                        var emailTemplateForSubject = data[0].Subject; //thiz.options.CurrentEmailTemplate.EmailTemplate.Subject;
                        var emailTemplate = data[0].Body; //thiz.options.CurrentEmailTemplate.EmailTemplate.Body;

                        if (emailTemplateForSubject && emailTemplateForSubject != '') {
                            $(thiz.element).find('#quillConfigureNewUserEmailsDialog_Subject')[0].value = emailTemplateForSubject;
                        } else {
                            $(thiz.element).find('#quillConfigureNewUserEmailsDialog_Subject')[0].value = '';
                        }

                        //if (emailTemplate && emailTemplate != '') {
                        //    $($(thiz.element).find('#quillConfigureNewUserEmailsDialog_Body')[0]).summernote('reset');
                        //    $($(thiz.element).find('#quillConfigureNewUserEmailsDialog_Body')[0]).summernote('pasteHTML', emailTemplate);
                        //} else {
                        //    $($(thiz.element).find('#quillConfigureNewUserEmailsDialog_Body')[0]).summernote('reset');
                        //}
                        if (emailTemplate && emailTemplate != '') {
                            //$('#ConfigureEmailNotificationsDialogEditor').summernote('reset');
                            //debugger;
                            $($(thiz.element).find('#quillConfigureNewUserEmailsDialog_Body')[0]).summernote('code', emailTemplate);
                        } else {
                            $($(thiz.element).find('#quillConfigureNewUserEmailsDialog_Body')[0]).summernote('reset');
                        }

                        //var timestamp = getFriendlyDateAndTime(data[0].Timestamp);
                        var html = '';
                        html += '<span style="color:black;" xcx="xcx4499305-1" >To:</span> ' + data[0].ToParticipantFriendlyName + ' (' + data[0].ToParticipantEmail + ')';
                        html += '<br />';


                        //html += '<span style="font-weight:normal;font-size:10pt;color:black;">' + timestamp + '</span>';
                        // 2-3-2022
                        var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(data[0].Timestamp);
                        html += '<span style="font-weight:normal;font-size:10pt;color:black;">' + timestamp4 + '</span>';




                        $(thiz.element).find('#spanSelectedEmailSubject')[0].innerHTML = html;

                    } catch (e) {
                        console.log('Exception in viewForestPendingEmail(): ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in xx.js.viewForestPendingEmail():' + errorCode + ', ' + errorMessage);
                }
            });
        } catch (e) {
            console.log('Exception in viewForestPendingEmail(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ': ' + e.message + ', ' + e.stack);
        }
    },
    viewPendingEmail: function (originElementId, bwParticipantId, bwParticipantFriendlyName, bwParticipantEmail, bwPendingEmailId) {
        try {
            console.log('In viewPendingEmail(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ', bwPendingEmailId: ' + bwPendingEmailId);
            var thiz = this;

            //var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            $.ajax({
                url: webserviceurl + "/bwwebapppendingemail2/" + bwPendingEmailId,
                type: "DELETE",
                contentType: 'application/json',
                success: function (data) {
                    try {
                        //alert('In viewPendingEmail(). data: ' + JSON.stringify(data));
                        //debugger;
                        $(thiz.element).find('#displayedemaildetails')[0].setAttribute('bwPendingEmailId', bwPendingEmailId);

                        // Hook up this button event so that the user can insert data items into the email.
                        //var customButton1 = document.querySelector('#btnQuill_InsertADataItemForSubject');
                        var customButton1 = $(thiz.element).find('#btnQuill_InsertADataItemForSubject')[0]; //document.querySelector();
                        customButton1.addEventListener('click', function () {
                            thiz.displayEmailDataItemPickerDialog('subject');
                        });

                        $($(thiz.element).find('#quillConfigureNewUserEmailsDialog_Body')[0]).summernote({
                            placeholder: data[0].Body, //'Hello stand alone ui',
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
                        //var customButton = document.querySelector('#btnQuill_InsertADataItem');
                        var customButton = $(thiz.element).find('#btnQuill_InsertADataItem')[0]; //document.querySelector($(thiz.element).find('#btnQuill_InsertADataItem')[0]);
                        customButton.addEventListener('click', function () {
                            console.log('In viewPendingEmail.quill.customButton.click().')
                            //console.log('btnQuill_InsertADataItem: This functionality is incomplete. Coming soon!');
                            //thiz.displayEmailDataItemPickerDialog('body');
                        });
                        //debugger;
                        var emailTemplateForSubject = data[0].Subject; //thiz.options.CurrentEmailTemplate.EmailTemplate.Subject;
                        var emailTemplate = data[0].Body; //thiz.options.CurrentEmailTemplate.EmailTemplate.Body;

                        if (emailTemplateForSubject && emailTemplateForSubject != '') {
                            $(thiz.element).find('#quillConfigureNewUserEmailsDialog_Subject')[0].value = emailTemplateForSubject;
                        } else {
                            $(thiz.element).find('#quillConfigureNewUserEmailsDialog_Subject')[0].value = '';
                        }

                        //if (emailTemplate && emailTemplate != '') {
                        //    $($(thiz.element).find('#quillConfigureNewUserEmailsDialog_Body')[0]).summernote('reset');
                        //    $($(thiz.element).find('#quillConfigureNewUserEmailsDialog_Body')[0]).summernote('pasteHTML', emailTemplate);
                        //} else {
                        //    $($(thiz.element).find('#quillConfigureNewUserEmailsDialog_Body')[0]).summernote('reset');
                        //}
                        if (emailTemplate && emailTemplate != '') {
                            //$('#ConfigureEmailNotificationsDialogEditor').summernote('reset');
                            //debugger;
                            $($(thiz.element).find('#quillConfigureNewUserEmailsDialog_Body')[0]).summernote('code', emailTemplate);
                        } else {
                            $($(thiz.element).find('#quillConfigureNewUserEmailsDialog_Body')[0]).summernote('reset');
                        }

                        //var timestamp = getFriendlyDateAndTime(data[0].Timestamp);
                        var html = '';
                        html += '<span style="color:black;" xcx="xcx4499305-2" >To:</span> ' + data[0].ToParticipantFriendlyName + ' (' + data[0].ToParticipantEmail + ')';
                        html += '<br />';


                        //html += '<span style="font-weight:normal;font-size:10pt;color:black;">' + timestamp + '</span>';
                        // 2-3-2022
                        var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(data[0].Timestamp);
                        html += '<span style="font-weight:normal;font-size:10pt;color:black;">' + timestamp4 + '</span>';



                        $(thiz.element).find('#spanSelectedEmailSubject')[0].innerHTML = html;

                    } catch (e) {
                        console.log('Exception in viewPendingEmail(): ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in xx.js.viewPendingEmail():' + errorCode + ', ' + errorMessage);
                }
            });
        } catch (e) {
            console.log('Exception in viewPendingEmail(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ': ' + e.message + ', ' + e.stack);
        }
    },




    deleteSelectedErrorsAndSuggestions: function () {
        try {
            console.log('In deleteSelectedErrorsAndSuggestions().');
            var thiz = this;
            var selectedPendingEmailIdsToDelete = [];
            var checkboxes = document.getElementsByClassName('pendingErrorOrSuggestionCheckbox');
            for (var i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked == true) {
                    //debugger;
                    var bwPendingEmailId = checkboxes[i].getAttribute('bwerrororsuggestionid');
                    selectedPendingEmailIdsToDelete.push(bwPendingEmailId);
                } else {
                    // do nothing.
                }
            }
            var json = {
                bwErrorOrSuggestionIds: selectedPendingEmailIdsToDelete
            }
            //alert('Getting ready to delete ' + selectedPendingEmailIdsToDelete.length + ' pending emails. This action cannot be undone. This functionality is incomplete and needs further testing!!!!');
            $.ajax({
                url: this.options.operationUriPrefix + "_bw/deleteerrorsandsuggestions", //deletependingemails", 
                dataType: "json",
                contentType: "application/json",
                type: "Post",
                data: JSON.stringify(json)
            }).done(function (result) {
                try {
                    //debugger;
                    console.log('In deleteSelectedErrorsAndSuggestions(): Successfully updated DB.');

                    //debugger;
                    $('#divDeleteErrorsAndSuggestionsDialog').dialog('close');

                    thiz._create();

                } catch (e) {
                    console.log('Exception in deleteSelectedErrorsAndSuggestions():2: ' + e.message + ', ' + e.stack);
                }
            }).fail(function (data) {
                //debugger;
                var msg;
                if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                } else {
                    msg = JSON.stringify(data) + ', json: ' + JSON.stringify(selectedPendingEmailIdsToDelete);
                }
                alert('Fail in deleteSelectedErrorsAndSuggestions(): ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                console.log('Fail in deleteSelectedErrorsAndSuggestions(): ' + JSON.stringify(data) + ', json: ' + JSON.stringify(selectedPendingEmailIdsToDelete));
                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                //var error = JSON.parse(data.responseText)["odata.error"];
                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            });
        } catch (e) {
            console.log('Exception in deleteSelectedErrorsAndSuggestions(): ' + e.message + ', ' + e.stack);
        }
    },
    deleteSelectedForestPendingEmails: function () {
        try {
            console.log('In deleteSelectedForestPendingEmails().');
            var thiz = this;
            var selectedPendingEmailIdsToDelete = [];
            var checkboxes = document.getElementsByClassName('pendingEmailCheckbox');
            //debugger;
            for (var i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked == true) {
                    //debugger;
                    var bwPendingEmailId = checkboxes[i].getAttribute('bwpendingemailid');
                    selectedPendingEmailIdsToDelete.push(bwPendingEmailId);
                } else {
                    // do nothing.
                }
            }
            var json = {
                PendingEmailIds: selectedPendingEmailIdsToDelete
            }
            //alert('Getting ready to delete ' + selectedPendingEmailIdsToDelete.length + ' pending emails. This action cannot be undone. This functionality is incomplete and needs further testing!!!!');
            $.ajax({
                url: this.options.operationUriPrefix + "_bw/deleteforestpendingemails", //odata/Roles",
                dataType: "json",
                contentType: "application/json",
                type: "Post",
                data: JSON.stringify(json)
            }).done(function (result) {
                try {
                    //debugger;
                    console.log('In deleteSelectedForestPendingEmails(): Successfully updated DB.');

                    //debugger;
                    $('#divDeleteForestPendingEmailsDialog').dialog('close');

                    thiz._create();

                } catch (e) {
                    console.log('Exception in deleteSelectedForestPendingEmails():2: ' + e.message + ', ' + e.stack);
                }
            }).fail(function (data) {
                //debugger;
                var msg;
                if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                } else {
                    msg = JSON.stringify(data) + ', json: ' + JSON.stringify(selectedPendingEmailIdsToDelete);
                }
                alert('Fail in deleteSelectedForestPendingEmails(): ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                console.log('Fail in deleteSelectedForestPendingEmails(): ' + JSON.stringify(data) + ', json: ' + JSON.stringify(selectedPendingEmailIdsToDelete));
                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                //var error = JSON.parse(data.responseText)["odata.error"];
                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            });
        } catch (e) {
            console.log('Exception in deleteSelectedForestPendingEmails(): ' + e.message + ', ' + e.stack);
        }
    },
    deleteSelectedPendingEmails: function (bwWorkflowAppId, instruction) {
        try {
            console.log('In deleteSelectedPendingEmails(). instruction: ' + instruction + ', bwWorkflowAppId: ' + bwWorkflowAppId);
            var thiz = this;

            if (!bwWorkflowAppId || (bwWorkflowAppId == 'undefined')) {

                console.log('Error in deleteSelectedPendingEmails(): Invalid value for bwWorkflowAppId: ' + bwWorkflowAppId);
                displayAlertDialog('Error in deleteSelectedPendingEmails(): Invalid value for bwWorkflowAppId: ' + bwWorkflowAppId);

            } else {

                var selectedPendingEmailIdsToDelete;

                if (instruction && instruction == 'emptyfolder') {
                    // Do nothing, we just don't have to create the array.
                } else {
                    var checkboxes = document.getElementsByClassName('pendingEmailCheckbox');
                    //debugger;
                    selectedPendingEmailIdsToDelete = [];
                    for (var i = 0; i < checkboxes.length; i++) {
                        if (checkboxes[i].checked == true) {
                            //debugger;
                            var bwPendingEmailId = checkboxes[i].getAttribute('bwpendingemailid');
                            selectedPendingEmailIdsToDelete.push(bwPendingEmailId);
                        } else {
                            // do nothing.
                        }
                    }

                }

                var json = {
                    PendingEmailIds: selectedPendingEmailIdsToDelete,
                    bwWorkflowAppId: bwWorkflowAppId,
                    instruction: instruction

                }
                $.ajax({
                    url: this.options.operationUriPrefix + "_bw/deletependingemails",
                    //dataType: "json",
                    contentType: "application/json",
                    type: "Post",
                    data: JSON.stringify(json)
                }).done(function (result) {
                    try {

                        if (result.message != 'SUCCESS') {
                            displayAlertDialog(result.message);
                        } else {
                            console.log('The emails have been deleted.');
                            $('#divBwEmailMonitor_DeletePendingEmailsDialog').dialog('close');

                            thiz.displayPendingEmails();
                        }

                    } catch (e) {
                        console.log('Exception in deleteSelectedPendingEmails():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in deleteSelectedPendingEmails():2: ' + e.message + ', ' + e.stack);
                    }
                }).fail(function (data) {
                    //debugger;
                    var msg;
                    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                    } else {
                        msg = JSON.stringify(data) + ', json: ' + JSON.stringify(selectedPendingEmailIdsToDelete);
                    }
                    alert('Fail in deleteSelectedPendingEmails(): ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                    console.log('Fail in deleteSelectedPendingEmails(): ' + JSON.stringify(data) + ', json: ' + JSON.stringify(selectedPendingEmailIdsToDelete));
                    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                    //var error = JSON.parse(data.responseText)["odata.error"];
                    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                });
            }

        } catch (e) {
            console.log('Exception in deleteSelectedPendingEmails(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in deleteSelectedPendingEmails(): ' + e.message + ', ' + e.stack);
        }
    },
    putInboxFolderIntoTheTrashBin: function (bwWorkflowAppId, instruction) {
        try {
            console.log('In putInboxFolderIntoTheTrashBin(). instruction: ' + instruction + ', bwWorkflowAppId: ' + bwWorkflowAppId);
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                bwParticipantId: participantId,
                bwWorkflowAppId: workflowAppId
            };

            $.ajax({
                url: this.options.operationUriPrefix + "_bw/putInboxIntoTheTrashBin",
                contentType: "application/json",
                type: "POST",
                data: JSON.stringify(data)
            }).success(function (results) {
                try {

                    if (results.status != 'SUCCESS') {
                        displayAlertDialog(results.message);
                    } else {
                        console.log('In putInboxFolderIntoTheTrashBin(). The emails have been put in the TrashBin.');
                        $('#divBwEmailMonitor_DeleteSentEmailsDialog').dialog('close');

                        displayAlertDialog(results.message);

                        thiz.loadAndRenderEmails();
                    }

                } catch (e) {
                    console.log('Exception in putInboxFolderIntoTheTrashBin():2: ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in putInboxFolderIntoTheTrashBin():2: ' + e.message + ', ' + e.stack);
                }
            }).error(function (data) {
                //debugger;
                var msg;
                //if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                //    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                //} else {
                msg = data.message; //JSON.stringify(data) + ', json: ' + JSON.stringify(selectedSentEmailIdsToDelete);
                //}
                alert('Fail in putInboxFolderIntoTheTrashBin(): ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                console.log('Fail in putInboxFolderIntoTheTrashBin(): ' + msg); // + JSON.stringify(data) + ', json: ' + JSON.stringify(selectedSentEmailIdsToDelete));
                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                //var error = JSON.parse(data.responseText)["odata.error"];
                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            });

        } catch (e) {
            console.log('Exception in putInboxFolderIntoTheTrashBin(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in putInboxFolderIntoTheTrashBin(): ' + e.message + ', ' + e.stack);
        }
    },

    cmdDisplayDeleteErrorsAndSuggestionsDialog: function () {
        try {
            console.log('In cmdDisplayDeleteErrorsAndSuggestionsDialog().');
            //debugger;
            $("#divDeleteErrorsAndSuggestionsDialog").dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '700',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divDeleteErrorsAndSuggestionsDialog").dialog('close');
                    });
                },
                close: function () {
                    $('#divDeleteErrorsAndSuggestionsDialog').dialog('destroy');
                }
            });
            $("#divDeleteErrorsAndSuggestionsDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            var emails = document.getElementsByClassName('pendingErrorOrSuggestionCheckbox');
            var selectedEmails = [];
            for (var i = 0; i < emails.length; i++) {
                if (emails[i].checked) {
                    selectedEmails.push(emails);
                }
            }
            if (selectedEmails.length == 0) {
                var html = '';
                html += 'You have not selected any errors or suggestions to delete. You have to select at least 1.';
                document.getElementById('spanDeleteErrorsOrSuggestionsDialogContentText').innerHTML = html;
            } else {
                var html = '';
                html += 'You have chosen to delete ' + selectedEmails.length + ' errors or suggestions. This action cannot be undone.';
                document.getElementById('spanDeleteErrorsOrSuggestionsDialogContentText').innerHTML = html;
            }

        } catch (e) {
            console.log('Exception in cmdDisplayDeleteErrorsAndSuggestionsDialog(): ' + e.message + ', ' + e.stack);
        }
    },
    cmdDisplayDeleteForestPendingEmailsDialog: function () {
        try {
            console.log('In cmdDisplayDeleteForestPendingEmailsDialog().');
            //debugger;
            $("#divDeleteForestPendingEmailsDialog").dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '500',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divDeleteForestPendingEmailsDialog").dialog('close');
                    });
                },
                close: function () {
                    $('#divDeleteForestPendingEmailsDialog').dialog('destroy');
                }
            });
            $("#divDeleteForestPendingEmailsDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            var emails = document.getElementsByClassName('pendingEmailCheckbox');
            var selectedEmails = [];
            for (var i = 0; i < emails.length; i++) {
                if (emails[i].checked) {
                    selectedEmails.push(emails);
                }
            }
            if (selectedEmails.length == 0) {
                var html = '';
                html += 'You have not selected any emails to delete. You have to select at least 1.';
                document.getElementById('spanDeleteForestPendingEmailsDialogContentText').innerHTML = html;
            } else {
                var html = '';
                html += 'You have chosen to delete ' + selectedEmails.length + ' forest pending emails. This action cannot be undone.';
                document.getElementById('spanDeleteForestPendingEmailsDialogContentText').innerHTML = html;
            }

        } catch (e) {
            console.log('Exception in cmdDisplayDeleteForestPendingEmailsDialog(): ' + e.message + ', ' + e.stack);
        }
    },
    cmdDisplayDeletePendingEmailsDialog: function (bwWorkflowAppId, instruction) {
        try {
            console.log('In cmdDisplayDeletePendingEmailsDialog(). instruction: ' + instruction + ', bwWorkflowAppId: ' + bwWorkflowAppId);
            var thiz = this;

            if (!bwWorkflowAppId || (bwWorkflowAppId == 'undefined')) {

                console.log('Error in cmdDisplayDeletePendingEmailsDialog(): Invalid value for bwWorkflowAppId: ' + bwWorkflowAppId);
                displayAlertDialog('Error in cmdDisplayDeletePendingEmailsDialog(): Invalid value for bwWorkflowAppId: ' + bwWorkflowAppId);

            } else {

                debugger;
                $("#divBwEmailMonitor_DeletePendingEmailsDialog").dialog({
                    modal: true,
                    resizable: false,
                    closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                    width: '500',
                    dialogClass: "no-close", // No close button in the upper right corner.
                    hide: false, // This means when hiding just disappear with no effects.
                    open: function () {
                        $('.ui-widget-overlay').bind('click', function () {
                            $("#divBwEmailMonitor_DeletePendingEmailsDialog").dialog('close');
                        });
                    },
                    close: function () {
                        //$('#divBwEmailMonitor_DeletePendingEmailsDialog').dialog('destroy');
                        $('#divBwEmailMonitor_DeletePendingEmailsDialog').dialog('destroy');
                    }
                });
                $("#divBwEmailMonitor_DeletePendingEmailsDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

                if (instruction && instruction == 'emptyfolder') {
                    // The user has chosen to empty the entire folder.
                    var html = '';
                    html += 'You have chosen to delete all pending emails. This action cannot be undone.';
                    document.getElementById('spanBwEmailMonitor_DeletePendingEmailsDialogContentText').innerHTML = html;

                    html = '';
                    html += '   <div id="divBwEmailMonitor_DeleteThePendingEmails" class="divSignInButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'deleteSelectedPendingEmails\', \'' + bwWorkflowAppId + '\', \'emptyfolder\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" >';
                    html += '       Delete the Pending Emails';
                    html += '   </div>';
                    document.getElementById('divBwEmailMonitor_DeleteThePendingEmails').outerHTML = html;

                } else {
                    var emails = document.getElementsByClassName('pendingEmailCheckbox');
                    var selectedEmails = [];
                    for (var i = 0; i < emails.length; i++) {
                        if (emails[i].checked) {
                            selectedEmails.push(emails);
                        }
                    }
                    if (selectedEmails.length == 0) {

                        var html = '';
                        html += 'You have not selected any emails to delete. You have to select at least 1.';
                        document.getElementById('spanBwEmailMonitor_DeletePendingEmailsDialogContentText').innerHTML = html;

                    } else {

                        var html = '';
                        html += 'You have chosen to delete ' + selectedEmails.length + ' pending emails. This action cannot be undone.';
                        document.getElementById('spanBwEmailMonitor_DeletePendingEmailsDialogContentText').innerHTML = html;

                        html = '';
                        html += '   <div id="divBwEmailMonitor_DeleteThePendingEmails" class="divSignInButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'deleteSelectedPendingEmails\', \'' + bwWorkflowAppId + '\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" >';
                        html += '       Delete the Pending Emails';
                        html += '   </div>';
                        document.getElementById('divBwEmailMonitor_DeleteThePendingEmails').outerHTML = html;

                    }

                }
            }

        } catch (e) {
            console.log('Exception in cmdDisplayDeletePendingEmailsDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in cmdDisplayDeletePendingEmailsDialog(): ' + e.message + ', ' + e.stack);
        }
    },
    cmdDisplayDeleteSentEmailsDialog: function (bwWorkflowAppId, instruction) {
        try {
            console.log('In cmdDisplayDeleteSentEmailsDialog(). instruction: ' + instruction + ', bwWorkflowAppId: ' + bwWorkflowAppId);
            var thiz = this;

            if (!bwWorkflowAppId || (bwWorkflowAppId == 'undefined')) {

                console.log('Error in cmdDisplayDeleteSentEmailsDialog(): Invalid value for bwWorkflowAppId: ' + bwWorkflowAppId);
                displayAlertDialog('Error in cmdDisplayDeleteSentEmailsDialog(): Invalid value for bwWorkflowAppId: ' + bwWorkflowAppId);

            } else {

                var div = document.getElementById('divBwEmailMonitor_DeleteSentEmailsDialog');
                if (!div) { // for some reason this gets added twice to the DOM. Figure this out someday, but for now this seems to fix it and is a good safety I suppose.
                    div = document.createElement('div');
                    div.id = 'divBwEmailMonitor_DeleteSentEmailsDialog';
                    div.style.display = 'none';
                    document.body.appendChild(div); // to place at end of document
                }

                var html = '';

                html += '   <table style="width:100%;">';
                html += '       <tr>';
                html += '           <td style="width:90%;">';
                html += '               <span id="spanDeleteSentEmailsDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">Delete Emails</span>';
                html += '           </td>';
                html += '           <td style="width:9%;"></td>';
                html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
                html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divBwEmailMonitor_DeleteSentEmailsDialog\').dialog(\'close\');">X</span>';
                html += '           </td>';
                html += '       </tr>';
                html += '   </table>';
                html += '   <br /><br />';
                html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                html += '   <span id="spanBwEmailMonitor_DeleteSentEmailsDialogContentText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;">';
                html += '[spanBwEmailMonitor_DeleteSentEmailsDialogContentText]';
                html += '   </span>';
                html += '   <br /><br /><br />';
                //html += '   <div id="divBwEmailMonitor_DeleteTheSentEmails" class="divSignInButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'deleteSelectedSentEmails\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" >';
                html += '   <div id="divBwEmailMonitor_DeleteTheSentEmails" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" >';
                html += '       Delete the Inbox Emails';
                html += '   </div>';
                html += '   <br /><br />';
                html += '   <div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em; font-weight: bold;" onclick="$(\'#divBwEmailMonitor_DeleteSentEmailsDialog\').dialog(\'close\');">';
                html += '       Cancel';
                html += '   </div>';
                html += '   <br /><br />';

                div.innerHTML = html;

                $("#divBwEmailMonitor_DeleteSentEmailsDialog").dialog({
                    modal: true,
                    resizable: false,
                    closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                    width: '500',
                    dialogClass: "no-close", // No close button in the upper right corner.
                    hide: false, // This means when hiding just disappear with no effects.
                    open: function () {
                        $('.ui-widget-overlay').bind('click', function () {
                            $("#divBwEmailMonitor_DeleteSentEmailsDialog").dialog('close');
                        });
                    },
                    close: function () {
                        $('#divBwEmailMonitor_DeleteSentEmailsDialog').dialog('destroy');
                    }
                });
                $("#divBwEmailMonitor_DeleteSentEmailsDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

                if (instruction && instruction == 'emptyfolder') {
                    // The user has chosen to empty the entire folder.
                    var html = '';
                    html += 'You have chosen to put all Inbox emails into the TrashBin.';
                    document.getElementById('spanBwEmailMonitor_DeleteSentEmailsDialogContentText').innerHTML = html;

                    html = '';
                    html += '   <div id="divBwEmailMonitor_DeleteTheSentEmails" class="divSignInButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'putInboxFolderIntoTheTrashBin\', \'' + bwWorkflowAppId + '\', \'emptyfolder\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" >';
                    html += '       Delete the Inbox Emails';
                    html += '   </div>';
                    document.getElementById('divBwEmailMonitor_DeleteTheSentEmails').outerHTML = html;

                } else {
                    var emails = document.getElementsByClassName('sentEmailCheckbox');
                    var selectedEmails = [];
                    for (var i = 0; i < emails.length; i++) {
                        if (emails[i].checked) {
                            selectedEmails.push(emails);
                        }
                    }
                    if (selectedEmails.length == 0) {

                        var html = '';
                        html += 'You have not selected any emails to delete. You have to select at least 1.';
                        document.getElementById('spanBwEmailMonitor_DeleteSentEmailsDialogContentText').innerHTML = html;

                    } else {

                        var html = '';
                        html += 'You have chosen to delete ' + selectedEmails.length + ' Inbox emails. This action cannot be undone.';
                        document.getElementById('spanBwEmailMonitor_DeleteSentEmailsDialogContentText').innerHTML = html;

                        html = '';
                        html += '   <div id="divBwEmailMonitor_DeleteTheSentEmails" class="divSignInButton" onclick="$(\'.bwConfiguration\').bwConfiguration(\'deleteSelectedSentEmails\', \'' + bwWorkflowAppId + '\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" >';
                        html += '       Delete the Sent Emails';
                        html += '   </div>';
                        document.getElementById('divBwEmailMonitor_DeleteTheSentEmails').outerHTML = html;

                    }

                }
            }
        } catch (e) {
            console.log('Exception in bwMonitoringTools.cmdDisplayDeleteSentEmailsDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwMonitoringTools.cmdDisplayDeleteSentEmailsDialog(): ' + e.message + ', ' + e.stack);
        }
    },

    toggleErrorsAndSuggestionsCheckboxes: function (element) {
        try {
            console.log('In toggleErrorsAndSuggestionsCheckboxes().');
            var checkboxes = document.getElementsByClassName('pendingErrorOrSuggestionCheckbox');
            if (element.checked == true) {
                for (var i = 0; i < checkboxes.length; i++) {
                    checkboxes[i].checked = true;
                }
            } else if (element.checked == false) {
                for (var i = 0; i < checkboxes.length; i++) {
                    checkboxes[i].checked = false;
                }
            }
        } catch (e) {
            console.log('Exception in toggleErrorsAndSuggestionsCheckboxes(): ' + e.message + ', ' + e.stack);
        }
    },
    togglePendingEmailCheckboxes: function (element) {
        try {
            console.log('In togglePendingEmailCheckboxes().');
            var checkboxes = document.getElementsByClassName('pendingEmailCheckbox');
            if (element.checked == true) {
                for (var i = 0; i < checkboxes.length; i++) {
                    checkboxes[i].checked = true;
                }
            } else if (element.checked == false) {
                for (var i = 0; i < checkboxes.length; i++) {
                    checkboxes[i].checked = false;
                }
            }
        } catch (e) {
            console.log('Exception in togglePendingEmailCheckboxes(): ' + e.message + ', ' + e.stack);
        }
    },
    toggleSentEmailCheckboxes: function (element) {
        try {
            console.log('In toggleSentEmailCheckboxes().');
            var checkboxes = document.getElementsByClassName('sentEmailCheckbox');
            if (element.checked == true) {
                for (var i = 0; i < checkboxes.length; i++) {
                    checkboxes[i].checked = true;
                }
            } else if (element.checked == false) {
                for (var i = 0; i < checkboxes.length; i++) {
                    checkboxes[i].checked = false;
                }
            }
        } catch (e) {
            console.log('Exception in toggleSentEmailCheckboxes(): ' + e.message + ', ' + e.stack);
        }
    },

    sendForestPendingEmailNow: function () {
        try {
            console.log('In sendForestPendingEmailNow().');
            var thiz = this;
            var bwPendingEmailId = $(this.element).find('#displayedemaildetails')[0].getAttribute('bwPendingEmailId');
            emailDetails = {
                //bwWorkflowAppId: workflowAppId,
                bwPendingEmailId: bwPendingEmailId,
                bwParticipantId: participantId,
                bwParticipantFriendlyName: participantFriendlyName,
                bwParticipantEmail: participantEmail
            };
            var operationUri = this.options.operationUriPrefix + "_bw/SendSingleForestPendingEmailNow";
            $.ajax({
                url: operationUri,
                type: "POST",
                timeout: this.options.ajaxTimeout,
                data: emailDetails,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (result) {
                    try {
                        if (result.message != 'SUCCESS') {
                            thiz.displayAlertDialog(result.message);
                        } else {
                            thiz.displayAlertDialog('The email was sent successfully');

                            thiz._create(); //renderMonitoringTools();
                        }
                    } catch (e) {
                        console.log('Exception in sendForestPendingEmailNow():1: ' + e.message + ', ' + e.stack);
                        thiz.displayAlertDialog('Exception in sendForestPendingEmailNow():1: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in sendForestPendingEmailNow(): ' + errorCode + ' ' + errorMessage);
                    displayAlertDialog('Error in sendForestPendingEmailNow(): ' + errorCode + ' ' + errorMessage);
                }
            });
        } catch (e) {
            console.log('Exception in sendForestPendingEmailNow(): ' + e.message + ', ' + e.stack);
            thiz.displayAlertDialog('Exception in sendForestPendingEmailNow(): ' + e.message + ', ' + e.stack);
        }
    },
    sendPendingEmailNow: function () {
        try {
            console.log('In sendPendingEmailNow().');
            var thiz = this;
            var bwPendingEmailId = $(this.element).find('#displayedemaildetails')[0].getAttribute('bwPendingEmailId');
            emailDetails = {
                //bwWorkflowAppId: workflowAppId,
                bwPendingEmailId: bwPendingEmailId,
                bwParticipantId: participantId,
                bwParticipantFriendlyName: participantFriendlyName,
                bwParticipantEmail: participantEmail
            };
            var operationUri = this.options.operationUriPrefix + "_bw/SendSinglePendingEmailNow";
            $.ajax({
                url: operationUri,
                type: "POST",
                timeout: this.options.ajaxTimeout,
                data: emailDetails,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (result) {
                    try {
                        if (result.message != 'SUCCESS') {
                            thiz.displayAlertDialog(result.message);
                        } else {
                            thiz.displayAlertDialog('The email was sent successfully');

                            thiz._create(); //renderMonitoringTools();
                        }
                    } catch (e) {
                        console.log('Exception in sendPendingEmailNow():1: ' + e.message + ', ' + e.stack);
                        thiz.displayAlertDialog('Exception in sendPendingEmailNow():1: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in sendPendingEmailNow(): ' + errorCode + ' ' + errorMessage);
                    displayAlertDialog('Error in sendPendingEmailNow(): ' + errorCode + ' ' + errorMessage);
                }
            });
        } catch (e) {
            console.log('Exception in sendPendingEmailNow(): ' + e.message + ', ' + e.stack);
            thiz.displayAlertDialog('Exception in sendPendingEmailNow(): ' + e.message + ', ' + e.stack);
        }
    },


    //displayInnerLeftActiveMenu: function () { // Originally copied from bwActiveMenu. This renders an inner left active menu for this widget. 1-4-2023.
    //    try {
    //        console.log('In bwConfiguration.js.displayInnerLeftActiveMenu().');

    //        var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');

    //        var html = '';

    //        html += '<table id="tableMainMenu3" style="margin-left:-25px;width:100%;border-collapse: collapse;">';

    //        html += '    <!-- Left inner menu -->';
    //        html += '    <table id="tableMainMenu2" style="display:none;width:100%;border-collapse: collapse;">';
    //        html += '        <tr>';
    //        html += '            <td style="width:1%;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
    //        html += '                <div class="' + workflowAppTheme + '_noanimation noanimation" style="border-radius:20px 0 0 0;width: 225px; float:left; height:85px; background-color:gray; "></div>';
    //        html += '            </td>';
    //        html += '            <td style="width:0.1%;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
    //        html += '                <div style="float:left;height:85px;width:26px;background-color:gray;margin-left:-2px;margin-right:-2px;">';
    //        html += '                    <div class="' + workflowAppTheme + '_noanimation noanimation" style="float:left;height:85px;width:26px;position:relative;background-color:gray;">';
    //        html += '                        <div id="divInnerRoundWithWhiteOverlay" style="position:absolute; bottom:0;float:left;width: 26px; height:36px; background-color:#f5f6fa; border-radius:26px 0 0 0;margin-left:1px;margin-bottom:-1px;"></div> <!-- The background-color is set to space white (#f5f6fa) here, for the "under the curve" color of this element. -->';
    //        html += '                    </div>';
    //        html += '                </div>';
    //        html += '            </td>';
    //        html += '            <td style="width:2%;vertical-align:top;padding:0 6px 0 6px;margin:0 0 0 0;border-width:0 0 0 0;">';
    //        html += '                <div id="divPageContent2_Title" style="font-size:45px;color:black;white-space:nowrap;margin-top:-3px;font-weight:bolder;">[divPageContent2_Title]</div>';
    //        html += '            </td>';
    //        html += '            <td style="width:95%;vertical-align:top;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
    //        html += '                <div class="' + workflowAppTheme + '_noanimation noanimation" style="border-radius:0 26px 26px 0;width: 100%; float:left; height:50px; background-color:gray; ">xcx2132-2';
    //        html += '                </div>';
    //        html += '            </td>';
    //        html += '        </tr>';




    //        html += '        <tr>';
    //        html += '            <td id="tdInnerLeftSideMenu" style="vertical-align:top;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
    //        html += '';
    //        html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
    //        html += '';


    //        html += '                <div id="divInnerLeftMenuTopSmallBar1" class="' + workflowAppTheme + '_noanimation noanimation" style="width: 100%; float:right; height:25px; background-color:#7788ff !important; color:white;font-family: \'Franklin Gothic Medium\', \'Arial Narrow\', Arial, sans-serif;display: flex !important;justify-content: flex-end !important;align-items: flex-end !important;">';
    //        //html += '🔊';
    //        html += '                </div>';


    //        html += '';
    //        html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
    //        html += '                <div id="divInnerLeftMenuButton_PersonalBehavior" weightedheightvalue="40" class="leftButton ' + workflowAppTheme + '" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForInnerLeftMenuButtons\', this, \'PERSONAL_BEHAVIOR\');">';
    //        html += '                    <div class="leftButtonText2">PERSONAL SETTINGS</div>';
    //        html += '                </div>';
    //        html += '';
    //        html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
    //        html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="125" style="display:none;height:125px;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForInnerLeftMenuButtons\', this, \'ORGANIZATION\');">';
    //        html += '                    <div class="leftButtonText2">ORGANIZATION</div>';
    //        html += '                </div>';
    //        //html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
    //        //html += '                <div class="leftButton brushedAluminum" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForInnerLeftMenuButtons\', this, \'SETTINGS\');">';
    //        //html += '                    <div class="leftButtonText2">SETTINGS</div>';
    //        //html += '                </div>';
    //        html += '';
    //        html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
    //        html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForInnerLeftMenuButtons\', this, \'ROLES\');">';
    //        html += '                    <div class="leftButtonText2">ROLES</div>';
    //        html += '                </div>';
    //        html += '';
    //        html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
    //        html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForInnerLeftMenuButtons\', this, \'PARTICIPANTS\');">';
    //        html += '                    <div class="leftButtonText2">PARTICIPANTS</div>';
    //        html += '                </div>';

    //        html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
    //        html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForInnerLeftMenuButtons\', this, \'INVENTORY\');">';
    //        html += '                    <div class="leftButtonText2">INVENTORY</div>';
    //        html += '                </div>';

    //        html += '';
    //        html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
    //        html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="125" style="display:none;height:125px;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForInnerLeftMenuButtons\', this, \'WORKFLOW_AND_EMAIL\');">';
    //        html += '                    <div class="leftButtonText2">WORKFLOWS</div>';
    //        html += '                </div>';

    //        html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
    //        html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForInnerLeftMenuButtons\', this, \'FORMS\');">';
    //        html += '                    <div class="leftButtonText2">FORMS</div>';
    //        html += '                </div>';

    //        html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
    //        html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForInnerLeftMenuButtons\', this, \'CHECKLISTS\');">';
    //        html += '                    <div class="leftButtonText2">CHECKLISTS</div>';
    //        html += '                </div>';


    //        html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
    //        html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="80" style="display:none;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForInnerLeftMenuButtons\', this, \'SETTINGS\');">';
    //        html += '                    <div class="leftButtonText2">ORGANIZATION SETTINGS</div>';
    //        html += '                </div>';
    //        html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
    //        html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;height:75px;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForInnerLeftMenuButtons\', this, \'MONITOR_PLUS_TOOLS\');">';
    //        html += '                    <div class="leftButtonText2">MONITORING & TOOLS</div>';
    //        html += '                </div>';



    //        html += '            </td>';
    //        html += '            <td colspan="3" style="vertical-align:top;">';
    //        html += '                <div id="divPageContent2" style="padding-left:10px;">';
    //        html += '';
    //        html += '                    <div id="divPageContent3" style="right:-10px;top:-10px;padding-left:20px;padding-top:15px;">';
    //        //html += '                        <div style="border:1px dotted tomato;color:goldenrod;">';
    //        //html += '                            divPageContent3';
    //        html += '                        <div>';
    //        //html += '                            divPageContent3';
    //        html += '                            <br />';
    //        html += '                            <br />';
    //        html += '                            <br />';
    //        html += '                            <br />';
    //        html += '                            <br />';
    //        html += '                            <br />';
    //        html += '                            <br />';
    //        html += '                            <br />';
    //        html += '                        </div>';
    //        html += '                    </div>';
    //        html += '';
    //        html += '                </div>';
    //        html += '            </td>';
    //        html += '        </tr>';
    //        html += '    </table>';
























    //        html += '</table>';


    //        //document.getElementById('divPageContent1').style.paddingLeft = '10px';

    //        //this.shrinkLeftMenu();



    //        ////
    //        //// This positions the inner menus and content. Doesn't work on iOS. <<<<<<<<<<<<
    //        ////
    //        //var leftSideMenu_BoundingClientRect = document.getElementById('tdLeftSideMenu').getBoundingClientRect();
    //        //var divTopBar_Long_BoundingClientRect = document.getElementById('divTopBar_Long').getBoundingClientRect();
    //        //var top = divTopBar_Long_BoundingClientRect.bottom;
    //        //var left = leftSideMenu_BoundingClientRect.right; // 1st time: 259   // 2nd time: 104


    //        //top = top + 5;
    //        //left = left - 155;
    //        //console.log('In displayConfiguration(). top: ' + top + ', left: ' + left);
    //        //debugger;
    //        //document.getElementById('divPageContent1').style.position = 'absolute';
    //        //document.getElementById('divPageContent1').style.top = top + 'px';
    //        //document.getElementById('divPageContent1').style.left = left + 'px';




    //        //document.getElementById('divPageContent1').innerHTML = html;
    //        // Render the html.
    //        this.element.html(html);

    //        alert('xcx213123123');

    //        // shrink left menu
    //        document.getElementById('divLeftMenuHeader').style.width = '100px';
    //        var cusid_ele = document.getElementsByClassName('leftButtonText');
    //        for (var i = 0; i < cusid_ele.length; ++i) {
    //            var item = cusid_ele[i];
    //            item.style.fontSize = '8pt';
    //        }



    //        // removed 12-13-2021
    //        //if (!(document.getElementById('tableMainMenu3'))) {
    //        //    console.log('In displayConfiguration(). Element tableMainMenu3 does not exist.');
    //        //} else {
    //        //    // zindex for the white overlay fix.
    //        //    console.log('>>In displayConfiguration(). Why are we getting z-index for element tableMainMenu3?');

    //        //    var zindex = document.getElementById('tableMainMenu3').style.zIndex; //getZIndex(document.getElementById('tableMainMenu3'));
    //        //    var zindex2 = document.getElementById('divInnerRoundWithWhiteOverlay').style.zIndex; // getZIndex(document.getElementById('divInnerRoundWithWhiteOverlay'));
    //        //    console.log('In displayConfiguration(). What is element tableMainMenu3? zindex: ' + zindex + ', zindex2:' + zindex2 + '.');

    //        //    document.getElementById('tableMainMenu3').style.zIndex = 100;
    //        //}

    //        console.log('Setting z-index for element "tableMainMenu3". Why are we doing this?');
    //        document.getElementById('tableMainMenu3').style.zIndex = 100;





    //        //
    //        //
    //        // The following commented code may prove useful... this is the Configuration" button code. 1-4-2023.
    //        //
    //        //

    //        //            case 'CONFIGURATION':


    //        //    //alert('xcx12313 CONFIGURATION');
    //        //    debugger;
    //        //    // Prevent this code being executed when the configuration button is already selected.
    //        //    //debugger;
    //        //    //if (document.getElementById('divConfigurationButton').className.indexOf('_SelectedButton') > -1) { // 2-2-2022
    //        //    //    // This means the configuration button is already selected. Do nothing.
    //        //    //    resetThePageAndButtons = false;
    //        //    //} else {

    //        //    //populateStartPageItem('divConfiguration', 'Reports', '');

    //        //    thiz.displayConfiguration();

    //        //    //this.shrinkLeftMenuBar();

    //        //    //Personal / Behavior
    //        //    //divWelcomePageLeftButtonsConfigurationButton
    //        //    //populateStartPageItem('divConfiguration', 'Reports', '');

    //        //    $('#bwQuickLaunchMenuTd').css({
    //        //        width: '0'
    //        //    }); // This gets rid of the jumping around.

    //        //    try {
    //        //        $('#FormsEditorToolbox').dialog('close');
    //        //    } catch(e) { }

    //        //                                        //generateConfigurationLeftSideMenu();
    //        //                                        //renderLeftButtons('divConfigurationPageLeftButtons');




    //        //                                        $('.bwAuthentication').bwAuthentication('securityTrimTheLeftMenuButtons_ConfigurationSection');

    //        //    ////if (selectedWorkflowAppRole == 'participant') {
    //        //    //    // 9-7-2021: TURN OFF ALL BUTTONS IN INNER LEFT MENU, EXCEPT PERSONAL/BAHAVIOR
    //        //    //debugger;

    //        //    //// selectedOrganization.OrganizationRole
    //        //    //var buttons = $('#tableMainMenu3').find('.leftButton');
    //        //    //    $(buttons).each(function (index, value) {
    //        //    //        if ($(buttons[index]).html().indexOf('PERSONAL/BEHAVIOR') > -1) {
    //        //    //            // Do nothing, we always want to display this button.
    //        //    //        } else {
    //        //    //            $(buttons[index]).removeClass('leftButton');
    //        //    //        }
    //        //    //    });
    //        //    ////}

    //        //    $('#divPageContent2_Title').html('PERSONAL SETTINGS');
    //        //    renderConfigurationPersonalBehavior();
    //        //                                        //}
    //        //                                        break;
    //        //}




























    //    } catch (e) {
    //        console.log('Exception in displayConfiguration(): ' + e.message + ', ' + e.stack);
    //        displayAlertDialog('Exception in displayConfiguration(): ' + e.message + ', ' + e.stack);
    //    }
    //},


});