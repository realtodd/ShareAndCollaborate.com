$.widget("bw.bwCalendar", {
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
        This is the bwCalendar.js jQuery Widget. 
        ===========================================================

            The bwCalendar.js widget is an email client similar to most modern email clients. It is always accessible via the "MESSAGING" button.

            Instantiate bwCalendar.js:
                |-- _create()
                    |-- loadAndRenderEmails_Inbox()
                        |-- getAndRenderPagedEmails_Inbox()

            User clicks on MESSAGING > INBOX, then selects an email to view:
                |-- loadAndRenderEmails_Inbox()
                    |-- getAndRenderPagedEmails_Inbox()
                        |-- viewIndividualEmail_Inbox()
                            |-- displayExistingMessageHtml()
                                |-- loadIndividualEmail_Inbox()

            [more to follow]
                           
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

           [put your stuff here]

        ===========================================================
        
       */

        Inbox: null, // Initialize these as null, so we can tell later on if they have been loaded yet or not. We will check if they are an array, and that will indicate that they were loaded already.

        //
        // FORMAT: 6-21-2024. Introducing pagination.
        //        Inbox: 
        //              {
        //                  "docs": [], // These are the Inbox emails.
        //                  "totalDocs": 470,
        //                  "offset": 0,
        //                  "limit": 5,
        //                  "totalPages": 94,
        //                  "page": 1,
        //                  "pagingCounter": 1,
        //                  "hasPrevPage": false,
        //                  "hasNextPage": true,
        //                  "prevPage": null,
        //                  "nextPage": 2
        //              }
        //





        Sent: null, // Initialize these as null, so we can tell later on if they have been loaded yet or not. We will check if they are an array, and that will indicate that they were loaded already.
        Drafts: null, // Initialize these as null, so we can tell later on if they have been loaded yet or not. We will check if they are an array, and that will indicate that they were loaded already.
        TrashBin: null, // Initialize these as null, so we can tell later on if they have been loaded yet or not. We will check if they are an array, and that will indicate that they were loaded already.
        Search: null, // Initialize these as null, so we can tell later on if they have been loaded yet or not. We will check if they are an array, and that will indicate that they were loaded already.

        OnlyDisplayEmailsForCurrentParticipant: false, // When this is true, that means it is being displayed on the Configuration > Personal Settings page, and we only want to show the current participant emails, nothing else.

        // added 10-12-2020. npm install mongoose-paginate https://www.npmjs.com/package/mongoose-paginate
        pagingLimit_SentEmail: 20, // Only display 20 items at a time.

        pagingPage_PendingEmail: null,
        pagingPage_SentEmail: 0, // This is the page that is being displayed. This may be easier to use than offset? It is a zero based value.
        pagingPage_Drafts: 0, // This is the page that is being displayed. This may be easier to use than offset? It is a zero based value.
        pagingPage_ErrorsAndSuggestions: null,

        backendAdministrationMode: false, // Set this to true when displaying in the backend administration.
        operationUriPrefix: null,

        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function () { // assignmentRowChanged_ElementId) {
        this.element.addClass("bwCalendar");
        var thiz = this;
        try {
            if (this.options.operationUriPrefix == null) {
                // This formulates the operationUri, which is used throughout.
                var url1 = window.location.href.split('https://')[1];
                var url2 = url1.split('/')[0];
                this.options.operationUriPrefix = 'https://' + url2 + '/';
            }

            var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');

            // The inner left menu uses the same name for "Configuration", and in the future other functionality that uses the inner left menu. Therefore we make sure it is removed from the DOM before we put it back again. No duplicates!
            var element = document.getElementById('tableMainMenu2');
            if (element) {
                element.remove();
            }

            var html = '';

            html += '<style>';
            html += '   .bwEmailAttachment { ';
            html += '       cursor:pointer;max-width:550px;display:inline-block;white-space:nowrap;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif; font-size: 1em;min-width: 250px;min-height: 50px;border:2px solid lightgray;border-radius:10px 10px 10px 10px;padding:5px 10px 5px 10px;vertical-align:top;background-color:white;color:lightgray;';
            html += '   }';
            html += '   .bwEmailAttachment hover { ';
            html += '       background-color:aliceblue;';
            html += '       border:2px solid skyblue;';
            html += '       cursor:pointer !important;';
            html += '   }';
            html += '   .bwCalendarAttachment { ';
            html += `       cursor:pointer;
                            max-width:750px;
                            display:inline-block;
                            white-space:nowrap;
                            font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif; 
                            font-size: 1em;
                            min-width: 300px;
                            min-height: 50px;
                            border:2px solid lightgray;
                            border-radius:10px 10px 10px 10px;
                            padding:5px 10px 5px 10px;
                            vertical-align:top;
                            background-color:white;
                            color:lightgray;`;
            html += '   }';

            html += '   .bwCalendarAttachment hover { ';
            html += '       background-color:aliceblue;';
            html += '       border:2px solid skyblue;';
            html += '       cursor:pointer !important;';
            html += '   }';

            html += '   .bwCalendar_LeftMenuButton {';
            html += '       font-size:14pt;white-space:nowrap;cursor:pointer;padding:10px 40px 10px 40px;'; // T R B L
            html += '   }';
            html += '   .bwCalendar_LeftMenuButton:hover {';
            html += '       cursor:pointer;background-color:lightgray;';
            html += '   }';
            html += '   .bwCalendar_LeftMenuButton_Selected {';
            html += '       font-size:14pt;white-space:nowrap;cursor:pointer;padding:10px 40px 10px 40px;background-color:#DEECF9;';
            html += '   }';
            html += '   .bwCalendar_LeftMenuButton_UnicodeImage {';
            html += '       font-size:30px;color:gray;'; // T L B R
            html += '   }';

            html += '   .bwCalendar_InnerLeftMenuButton {';
            html += '       font-size:14pt;white-space:nowrap;cursor:pointer;padding:10px 40px 10px 40px;'; // T R B L
            // border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px; <<< This is the style attribute values in the code.
            html += '   }';
            html += '   .bwCalendar_InnerLeftMenuButton:hover {';
            html += '       cursor:pointer;background-color:aliceblue;';
            html += '   }';

            // Step 1: Get the color from our selected theme.
            var element = document.getElementById('divLeftMenuHeader'); // This is a good element to check.
            var style = window.getComputedStyle(element);
            var backgroundColor = style.getPropertyValue('background-color');

            //alert('xcx121231-3. backgroundColor: ' + backgroundColor);

            console.log('xcx2114. Setting selected email backgroundColor: ' + backgroundColor);
            console.log('xcx2114. Setting selected email backgroundColor: ' + backgroundColor);
            console.log('xcx2114. Setting selected email backgroundColor: ' + backgroundColor);
            //alert('xcx2114. Setting selected email backgroundColor: ' + backgroundColor); // rgb(255, 158, 13)

            //
            // Converting the eg: [rgb(255, 158, 13)] to [rgba(255, 158, 13, 0.5)]. This adds the alpha channel, allowing us to set the opacity. 6-18-2024.
            //
            var alpha = 0.155; // THIS IS THE ONLY PLACE WHERE THE BACKGROUND COLOR OF A SELECTED EMAIL IS SET IN THE EMAIL PICKER COLUMN. The selected email background color is set at [xcx213235991]. 6-18-2024.

            var tmp1 = backgroundColor.split('rgb(')[1];
            var r = tmp1.split(',')[0];
            var g = tmp1.split(',')[1];
            var tmp2 = tmp1.split(',')[2];
            var b = tmp2.split(')')[0];

            var strRgba = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
            //
            // end: Converting the eg: [rgb(255, 158, 13)] to [rgba(255, 158, 13, 0.5)]. This adds the alpha channel, allowing us to set the opacity. 6-18-2024.
            //

            html += '   .bwCalendar_InnerLeftMenuButton_Selected {';
            html += '       cursor:pointer;'; // It is already selected.
            //html += '       background-color:' + backgroundColor + ';';
            html += '       background-color:' + strRgba + ';';
            html += '   }';

            html += '   .bwCalendar_Trashbin {';
            html += '       cursor:pointer;background-color:aliceblue;'; // T R B L
            html += '   }';
            html += '   .bwCalendar_Trashbin:hover {';
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
            //html += '   <div id="divBwEmailMonitor_DeleteThePendingEmails" class="divSignInButton" onclick="$(\'.bwCalendar\').bwCalendar(\'deleteSelectedPendingEmails\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
            html += '   <div id="divBwEmailMonitor_DeleteThePendingEmails" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
            html += '       Delete the Pending Emails';
            html += '   </div>';
            html += '   <br /><br />';
            html += '   <div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em; font-weight: bold;" onclick="$(\'#divBwEmailMonitor_DeletePendingEmailsDialog\').dialog(\'close\');">';
            html += '       Cancel';
            html += '   </div>';
            html += '   <br /><br />';
            html += '</div>';









            //html += '<table id="tableMainMenu3" style="margin-left:-25px;width:100%;border-collapse: collapse;">';

            html += '    <!-- Left inner menu -->';
            html += '    <table id="tableMainMenu2" style="margin-left:-20px;margin-top:-25px;width:100%;border-collapse: collapse;">'; // THIS SETS THE GAP AT THE TOP OF THE INNER MENU. 6-18-2024. xcx231234-2.
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
            html += '                <div id="divPageContent2_Title" style="font-size:45px;color:black;white-space:nowrap;margin-top:-3px;font-weight:bolder;">✉&nbsp;[divPageContent2_Title]</div>';
            html += '            </td>';
            html += '            <td style="width:95%;vertical-align:top;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '                <div class="' + workflowAppTheme + '_noanimation noanimation" style="border-radius:0 26px 26px 0;width: 100%; float:left; height:50px; background-color:gray;" xcx="xcx213153">';
            html += '                </div>';
            html += '            </td>';
            html += '        </tr>';

            html += '        <tr>';
            html += '            <td id="tdInnerLeftSideMenu" style="vertical-align:top;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';

            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';


            html += '                <div id="divInnerLeftMenuTopSmallBar1" class="' + workflowAppTheme + '_noanimation noanimation" style="width: 100%; float:right; height:25px; background-color:#7788ff !important; color:white;font-family: \'Franklin Gothic Medium\', \'Arial Narrow\', Arial, sans-serif;display: flex !important;justify-content: flex-end !important;align-items: flex-end !important;">';
            //html += '🔊';
            html += '                </div>';

            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
            html += '                <div id="divInnerLeftMenuButton_NewMessage" class="leftButton ' + workflowAppTheme + '" weightedheightvalue="125" style="display:none;height:125px;" onclick="$(\'.bwCalendar:first\').bwCalendar(\'composeANewEmailMessage\');">';
            html += '                    <div class="leftButtonText2">AUGUST 2024</div>';
            html += '                </div>';

            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
            html += '                <div allow="clipboard-read;clipboard-write;" id="divInnerLeftMenuButton_Inbox" class="leftButton ' + workflowAppTheme + '" weightedheightvalue="125" style="display:none;height:125px;" onclick="$(\'.bwCalendar:first\').bwCalendar(\'loadAndRenderEmails_Inbox\');">';
            html += '                    <div class="leftButtonText2">CALENDAR ITEMS</div>';
            html += '                </div>';

            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
            html += '                <div id="divInnerLeftMenuButton_Sent" class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwCalendar:first\').bwCalendar(\'loadAndRenderEmails_Sent\');">';
            html += '                    <div class="leftButtonText2">ACTIVITY</div>';
            html += '                </div>';

            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
            html += '                <div id="divInnerLeftMenuButton_Drafts" class="leftButton ' + workflowAppTheme + '" weightedheightvalue="30" style="display:none;" onclick="$(\'.bwCalendar:first\').bwCalendar(\'loadAndRenderEmails_Drafts\');">';
            html += '                    <div class="leftButtonText2">DRAFTS</div>';
            html += '                </div>';

            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
            html += '                <div allow="clipboard-read;clipboard-write;" id="divInnerLeftMenuButton_Junk" class="leftButton ' + workflowAppTheme + '" weightedheightvalue="20" style="display:none;" onclick="$(\'.bwCalendar:first\').bwCalendar(\'loadAndRenderEmails_Junk\');">';
            html += '                    <div class="leftButtonText2">JUNK</div>';
            html += '                </div>';

            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
            html += '                <div allow="clipboard-read;clipboard-write;" id="divInnerLeftMenuButton_Archived" class="leftButton ' + workflowAppTheme + '" weightedheightvalue="30" style="display:none;" onclick="$(\'.bwCalendar:first\').bwCalendar(\'loadAndRenderEmails_Archived\');">';
            html += '                    <div class="leftButtonText2">ARCHIVED</div>';
            html += '                </div>';

            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
            html += '                <div allow="clipboard-read;clipboard-write;" id="divInnerLeftMenuButton_TrashBin" class="leftButton ' + workflowAppTheme + '" weightedheightvalue="30" style="display:none;" onclick="$(\'.bwCalendar:first\').bwCalendar(\'loadAndRenderEmails_TrashBin\');">';
            html += '                    <div class="leftButtonText2"><span><span class="bwCalendar_LeftMenuButton_UnicodeImage"><img src="/images/trashbin.png" style="height:40px;"></span></span></div>';
            html += '                </div>';

            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';

            var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');

            if (developerModeEnabled == true) {

                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForInnerLeftMenuButtons\', this, \'FORMS\');">';
                html += '                    <div class="leftButtonText2">✉ Pending Inbox. Emails waiting to be sent to you.</div>';
                html += '                </div>';

                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForInnerLeftMenuButtons\', this, \'WORKFLOW_AND_EMAIL\');">';
                html += '                    <div class="leftButtonText2"><span><span class="bwCalendar_LeftMenuButton_UnicodeImage">☎</span>&nbsp;Text Message INBOX</span></div>';
                html += '                </div>';

                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForInnerLeftMenuButtons\', this, \'WORKFLOW_AND_EMAIL\');">';
                html += '                    <div class="leftButtonText2"><span><span class="bwCalendar_LeftMenuButton_UnicodeImage">☎</span>&nbsp;SENT Text Message(s)</span></div>';
                html += '                </div>';



                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="125" style="display:none;height:125px;" onclick="$(\'.bwCalendar:first\').bwCalendar(\'displayAIConversation\');">';
                html += '                    <div class="leftButtonText2"><span><span class="bwCalendar_LeftMenuButton_UnicodeImage">🔊</span>&nbsp;AI Conversation</span><br><span style="font-size:10pt;font-style:italic;color:gray;">The system engages you in a <br>conversation about the <br>requests that you are <br>involved with.</span></div>';
                html += '                </div>';

            }

            html += '            </td>';
            html += '            <td colspan="3" style="vertical-align:top;">';
            html += '                <div id="divPageContent2" style="padding-left:10px;">';
            html += '';
            html += '                    <div id="divPageContent3" style="margin-left:-10px;margin-top:-40px;padding-left:20px;padding-top:15px;background-color:rgba(245,246,250,1.5);">'; // this opacity is what makes it look nice. 6-25-2024.
            //html += '                        <div style="border:1px dotted tomato;color:goldenrod;">';
            //html += '                            divPageContent3';










            //
            // Rendering the layout, within the divPageContent3 element.
            //

            html += '<table style="width:100%;" xcx="xcx232536">';
            html += '   <tr>';
            html += '       <td style="width:100%;">';
            html += '           <div id="displayedemaildetails" xcx="xcx4432-2" class="bwEmailForm" bwPendingEmailId="" bwSentEmailId="" bwerrororsuggestionid=""></div>'; // This is where we look when we want to know the type and GUID of the displayed email!

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
                html += '                               <span class="spanButton" title="Click to send this email now!" onclick="$(\'.bwCalendar\').bwCalendar(\'sendPendingEmailNow\');">';
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
            html += '               <col style="WIDTH:5%;" />';
            html += '               <col style="WIDTH:95%;" />';
            html += '           </colgroup>';
            html += '           <tbody>';
            html += '               <tr>';
            //html += '                   <td xcx="xcx111">';
            ////html += 'xcx111';
            //html += '                       <span class="emailEditor_newMessageButton" onclick="$(\'.bwCalendar:first\').bwCalendar(\'composeANewEmailMessage\');">'; //
            //html += '                           &nbsp;✉&nbsp;New message&nbsp;';
            //html += '                       </span>';
            //html += '                   </td>';
            html += '                   <td xcx="xcx222">';
            //html += 'xcx222';
            html += '                       <span id="spanSelectedEmailType_TopButtons" style="font-size:13pt;font-weight:normal;float:right;">[spanSelectedEmailType_TopButtons]</span>';
            html += '                   </td>';
            html += '                   <td xcx="xcx333-1-_create">';
            //html += 'xcx333';




            html += '<div id="bwCalendar_EmailTopButtons"></div>'; // 6-27-2024.




            html += `<span id="" style="float:right;white-space:nowrap;">
                        Search:
                        <span id="searchbox">
                            <input type="text" xcx="xcx7737712" value="Calendar Items" id="inputBwAuthentication_SearchBox" onkeydown="$('.bwCalendar').bwCalendar('searchBox_OnKeyDown', event);" style="opacity:0.25;WIDTH: 60%;font-family: 'Segoe UI Light','Segoe UI','Segoe',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;">
                            &nbsp;&nbsp;<span class="emailEditor_newMessageButton" onclick="$('.bwCalendar').bwCalendar('loadAndRenderEmails_Search');">Search</span>
                        </span>
                    </span>`;


            html += '                   </td>';
            html += '               </tr>';


            html += '               <tr>';
            html += '                   <td xcx="xcx222" style="vertical-align:top;">';

            // Middle column.
            html += '<table>';
            html += '   <tr>';
            html += '       <td style="width:350px;height:50px;text-align:left;background-color:white;margin:10px 20px 10px -3px;">';
            html += '           <div id="spanSelectedEmailType_Title" style="height:30px;font-size:15pt;font-weight:bold;">[spanSelectedEmailType_Title]</div>';
            html += '           <div id="spanSelectedEmailType_Status" style="padding-left:35px;font-size:10pt;font-weight:normal;">[spanSelectedEmailType_Status]</div>';
            html += '       </td>';
            html += '   </tr>';
            html += '   <tr>';
            html += '       <td>';
            //html += '           <div xcx="xcx21323663" style="width:460px;height:600px;overflow-y: scroll;overflow-x:hidden;">'; // The width is set here for the email list... 2-9-2022
            html += '               <span>';
            html += '                   <div id="divEmailPicker" xcx="xcx554324" style="width:460px;height:600px;overflow-y:scroll;overscroll-behavior-y:contain;">'; // The width is set here for the email list... 2-9-2022 scroll can be change dto hidden...
            html += '                       <table id="tableEmailPicker" xcx="xcx111948475664-1" style="max-width:460px;"></table>'; // width:460px;height:600px;overflow-y: scroll;overflow-x:hidden;
            html += '                   </div>';
            html += '               </span>';
            //html += '           </div>';
            html += '       </td>';
            html += '   </tr>';
            html += '</table>';
            // end: Middle column.

            html += '                   </td>';
            html += '                   <td id="tdbwCalendar_RightColumn" xcx="xcx333-2-2" style="vertical-align:middle;">';

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
            //$('#divPageContent3').html(html);






















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

















            // Instantiate the bwAttachmentDialog.js widget here. 2-16-2024.
            var div = document.getElementById('divBwAttachmentDialog');
            if (!div) {
                div = document.createElement('div');
                div.id = 'divBwAttachmentDialog';
                document.body.appendChild(div); // to place at end of document
            }
            var $bwAttachmentDialog = $('#divBwAttachmentDialog').bwAttachmentDialog({});


            this.loadAndRenderEmails_Inbox(); // This is a good user experience, displaying the Inbox emails first. If the user wants to view other emails, they can choose to do that.


            //
            // BROWSER COMPATIBILITY FOR DRAG-AND-DROP and RIGHT-CLICK to PASTE.
            //

            // BRAVE has full support:
            //      - Drag and drop to paste (invokes the drop event) - DataTransfer
            //      - Right click to paste (invokes the paste event) - ClipboardData

            // FIREFOX has partial support:
            //      - Drag and drop to paste <<< NO SUPPORT/DOESNT WORK >>> STILL DOESNT WORK AFTER NEW CHANGES TO BACKGROUND IMAGE.
            //      - Right click to paste (invokes the paste event) - ClipboardData

            // FIXED >>> EDGE has full support: The issue was the image!!!! I made it a background-image to circumvent this behaviour. 11-27-2023.
            //      - Drag and drop to paste (invokes the drop event) - DataTransfer
            //      - Right click to paste <<< NO SUPPORT/DOESNT WORK. The right-click context-menu paste option displays but is disabled.

            // FIXED >>> CHROME has full support: The issue was the image!!!! I made it a background-image to circumvent this behaviour. 11-27-2023.
            //      - Drag and drop to paste (invokes the drop event) - DataTransfer
            //      - Right click to paste <<< NO SUPPORT/DOESNT WORK. The right-click context-menu paste option displays but is disabled.

            // SAFARI
            //
            //

            // CHROME on MacOs
            //
            //

            // BRAVE on MacOs
            //
            //
            //

            //
            // Inbox. // Inbox, Junk, Archived, TrashBin.
            //

            var dropzone_inbox = document.getElementById('divInnerLeftMenuButton_Inbox');

            dropzone_inbox.addEventListener('dragenter', function (e) {
                try {
                    console.log('In bwCalendar.js.dropzone_inbox.dragenter().');
                    //alert('In renderAndPopulateAttachmentsxx.dropzone_inbox.dragenter().');
                    e.preventDefault();
                } catch (e) {
                    var msg = 'Exception in bwCalendar.js.dropzone_inbox.dragenter(): ' + e.message + ', ' + e.stack;
                    console.log(msg);
                    alert(msg);
                }
            });

            dropzone_inbox.addEventListener('dragover', function (e) {
                try {
                    console.log('In bwCalendar.js.dropzone_inbox.dragover().');
                    //alert('In renderAndPopulateAttachmentsxx.dropzone_inbox.dragover().');
                    e.preventDefault();
                } catch (e) {
                    var msg = 'Exception in bwCalendar.js.dropzone_inbox.drop(): ' + e.message + ', ' + e.stack;
                    console.log(msg);
                    alert(msg);
                }
            });

            dropzone_inbox.addEventListener('drop', function (e) {
                try {
                    console.log('In bwCalendar.js.dropzone_inbox.drop().');
                    //displayAlertDialog_Persistent('In bwCalendar.js.dropzone_inbox.drop(). xcx23124.');
                    e.preventDefault();

                    var gotData;
                    if (e.clipboardData) {
                        console.log('In bwCalendar.js.dropzone_inbox.drop(). Object is event.clipboardData.');
                        gotData = true;
                    } else if (e.dataTransfer) {
                        console.log('In bwCalendar.js.dropzone_inbox.drop(). Object is event.dataTransfer.');
                        gotData = true;
                    } else if (window.clipboardData) {
                        console.log('In bwCalendar.js.dropzone_inbox.drop(). Object is window.clipboardData.');
                        gotData = true;
                    } else {

                        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                            alert('FIREFOX BROWSER CANNOT DRAG-AND-DROP EXTERNAL FILES. THERE IS A WORK-AROUND: Please right click on your source file, and choose "COPY". Subsequently, right click here and choose "PASTE".');
                        } else {
                            alert('Error in bwCalendar.js.dropzone_inbox.drop(). Could not find a valid DataTransfer object. e: ' + JSON.stringify(e) + ', navigator.userAgent: ' + navigator.userAgent);
                        }

                    }

                    if (gotData == true) {
                        thiz.dodrop(e, 'INBOX');
                    } else {
                        alert('Error in bwCalendar.js.dropzone_inbox.drop(). Could not find a valid DataTransfer object.');
                    }

                } catch (e) {
                    var msg = 'Exception in bwCalendar.js.dropzone_inbox.drop(): ' + e.message + ', ' + e.stack;
                    console.log(msg);
                    alert(msg);
                }
            });

            dropzone_inbox.addEventListener('paste', function (e) {
                try {
                    console.log('In bwCalendar.js.dropzone_inbox.paste().');
                    //displayAlertDialog_Persistent('In bwCalendar.js.dropzone_inbox.paste().');
                    e.preventDefault();

                    var gotData;
                    if (e.clipboardData) {
                        console.log('In bwCalendar.js.dropzone_inbox.paste(). Object is event.clipboardData.');
                        gotData = true;
                    } else if (e.dataTransfer) {
                        console.log('In bwCalendar.js.dropzone_inbox.paste(). Object is event.dataTransfer.');
                        gotData = true;
                    } else if (window.clipboardData) {
                        console.log('In bwCalendar.js.dropzone_inbox.paste(). Object is window.clipboardData.');
                        gotData = true;
                    } else {

                        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                            alert('FIREFOX BROWSER CANNOT DRAG-AND-DROP EXTERNAL FILES. THERE IS A WORK-AROUND: Please right click on your source file, and choose "COPY". Subsequently, right click here and choose "PASTE".');
                        } else {
                            alert('Error in bwCalendar.js.dropzone_inbox.paste(). Could not find a valid DataTransfer object. e: ' + JSON.stringify(e) + ', navigator.userAgent: ' + navigator.userAgent);
                        }

                    }

                    if (gotData == true) {
                        thiz.dodrop(e, 'INBOX');
                    } else {
                        alert('Error in bwCalendar.js.dropzone_inbox.paste(). Could not find a valid DataTransfer object.');
                    }

                } catch (e) {
                    var msg = 'Exception in bwCalendar.js.dropzone_inbox.paste(): ' + e.message + ', ' + e.stack;
                    console.log(msg);
                    alert(msg);
                }
            });

            //
            // end: Inbox. // Inbox, Junk, Archived, TrashBin.
            //

            //
            // Junk. // Inbox, Junk, Archived, TrashBin.
            //

            var dropzone_junk = document.getElementById('divInnerLeftMenuButton_Junk');

            dropzone_junk.addEventListener('dragenter', function (e) {
                try {
                    console.log('In bwCalendar.js.dropzone_junk.dragenter().');
                    //alert('In renderAndPopulateAttachmentsxx.dropzone_junk.dragenter().');
                    e.preventDefault();
                } catch (e) {
                    var msg = 'Exception in bwCalendar.js.dropzone_junk.dragenter(): ' + e.message + ', ' + e.stack;
                    console.log(msg);
                    alert(msg);
                }
            });

            dropzone_junk.addEventListener('dragover', function (e) {
                try {
                    console.log('In bwCalendar.js.dropzone_junk.dragover().');
                    //alert('In renderAndPopulateAttachmentsxx.dropzone_junk.dragover().');
                    e.preventDefault();
                } catch (e) {
                    var msg = 'Exception in bwCalendar.js.dropzone_junk.drop(): ' + e.message + ', ' + e.stack;
                    console.log(msg);
                    alert(msg);
                }
            });

            dropzone_junk.addEventListener('drop', function (e) {
                try {
                    console.log('In bwCalendar.js.dropzone_junk.drop().');
                    //displayAlertDialog_Persistent('In bwCalendar.js.dropzone_junk.drop(). xcx23124.');
                    e.preventDefault();

                    var gotData;
                    if (e.clipboardData) {
                        console.log('In bwCalendar.js.dropzone_junk.drop(). Object is event.clipboardData.');
                        gotData = true;
                    } else if (e.dataTransfer) {
                        console.log('In bwCalendar.js.dropzone_junk.drop(). Object is event.dataTransfer.');
                        gotData = true;
                    } else if (window.clipboardData) {
                        console.log('In bwCalendar.js.dropzone_junk.drop(). Object is window.clipboardData.');
                        gotData = true;
                    } else {

                        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                            alert('FIREFOX BROWSER CANNOT DRAG-AND-DROP EXTERNAL FILES. THERE IS A WORK-AROUND: Please right click on your source file, and choose "COPY". Subsequently, right click here and choose "PASTE".');
                        } else {
                            alert('Error in bwCalendar.js.dropzone_junk.drop(). Could not find a valid DataTransfer object. e: ' + JSON.stringify(e) + ', navigator.userAgent: ' + navigator.userAgent);
                        }

                    }

                    if (gotData == true) {
                        thiz.dodrop(e, 'JUNK');
                    } else {
                        alert('Error in bwCalendar.js.dropzone_junk.drop(). Could not find a valid DataTransfer object.');
                    }

                } catch (e) {
                    var msg = 'Exception in bwCalendar.js.dropzone_junk.drop(): ' + e.message + ', ' + e.stack;
                    console.log(msg);
                    alert(msg);
                }
            });

            dropzone_junk.addEventListener('paste', function (e) {
                try {
                    console.log('In bwCalendar.js.dropzone_junk.paste().');
                    //displayAlertDialog_Persistent('In bwCalendar.js.dropzone_junk.paste().');
                    e.preventDefault();

                    var gotData;
                    if (e.clipboardData) {
                        console.log('In bwCalendar.js.dropzone_junk.paste(). Object is event.clipboardData.');
                        gotData = true;
                    } else if (e.dataTransfer) {
                        console.log('In bwCalendar.js.dropzone_junk.paste(). Object is event.dataTransfer.');
                        gotData = true;
                    } else if (window.clipboardData) {
                        console.log('In bwCalendar.js.dropzone_junk.paste(). Object is window.clipboardData.');
                        gotData = true;
                    } else {

                        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                            alert('FIREFOX BROWSER CANNOT DRAG-AND-DROP EXTERNAL FILES. THERE IS A WORK-AROUND: Please right click on your source file, and choose "COPY". Subsequently, right click here and choose "PASTE".');
                        } else {
                            alert('Error in bwCalendar.js.dropzone_junk.paste(). Could not find a valid DataTransfer object. e: ' + JSON.stringify(e) + ', navigator.userAgent: ' + navigator.userAgent);
                        }

                    }

                    if (gotData == true) {
                        thiz.dodrop(e, 'JUNK');
                    } else {
                        alert('Error in bwCalendar.js.dropzone_junk.paste(). Could not find a valid DataTransfer object.');
                    }

                } catch (e) {
                    var msg = 'Exception in bwCalendar.js.dropzone_junk.paste(): ' + e.message + ', ' + e.stack;
                    console.log(msg);
                    alert(msg);
                }
            });

            //
            // end: Junk. // Inbox, Junk, Archived, TrashBin.
            //

            //
            // Archived. // Inbox, Junk, Archived, TrashBin.
            //

            var dropzone_archived = document.getElementById('divInnerLeftMenuButton_Archived');

            dropzone_archived.addEventListener('dragenter', function (e) {
                try {
                    console.log('In bwCalendar.js.dropzone_archived.dragenter().');
                    //alert('In renderAndPopulateAttachmentsxx.dropzone_archived.dragenter().');
                    e.preventDefault();
                } catch (e) {
                    var msg = 'Exception in bwCalendar.js.dropzone_archived.dragenter(): ' + e.message + ', ' + e.stack;
                    console.log(msg);
                    alert(msg);
                }
            });

            dropzone_archived.addEventListener('dragover', function (e) {
                try {
                    console.log('In bwCalendar.js.dropzone_archived.dragover().');
                    //alert('In renderAndPopulateAttachmentsxx.dropzone_archived.dragover().');
                    e.preventDefault();
                } catch (e) {
                    var msg = 'Exception in bwCalendar.js.dropzone_archived.drop(): ' + e.message + ', ' + e.stack;
                    console.log(msg);
                    alert(msg);
                }
            });

            dropzone_archived.addEventListener('drop', function (e) {
                try {
                    console.log('In bwCalendar.js.dropzone_archived.drop().');
                    //displayAlertDialog_Persistent('In bwCalendar.js.dropzone_archived.drop(). xcx23124.');
                    e.preventDefault();

                    var gotData;
                    if (e.clipboardData) {
                        console.log('In bwCalendar.js.dropzone_archived.drop(). Object is event.clipboardData.');
                        gotData = true;
                    } else if (e.dataTransfer) {
                        console.log('In bwCalendar.js.dropzone_archived.drop(). Object is event.dataTransfer.');
                        gotData = true;
                    } else if (window.clipboardData) {
                        console.log('In bwCalendar.js.dropzone_archived.drop(). Object is window.clipboardData.');
                        gotData = true;
                    } else {

                        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                            alert('FIREFOX BROWSER CANNOT DRAG-AND-DROP EXTERNAL FILES. THERE IS A WORK-AROUND: Please right click on your source file, and choose "COPY". Subsequently, right click here and choose "PASTE".');
                        } else {
                            alert('Error in bwCalendar.js.dropzone_archived.drop(). Could not find a valid DataTransfer object. e: ' + JSON.stringify(e) + ', navigator.userAgent: ' + navigator.userAgent);
                        }

                    }

                    if (gotData == true) {
                        thiz.dodrop(e, 'ARCHIVED');
                    } else {
                        alert('Error in bwCalendar.js.dropzone_archived.drop(). Could not find a valid DataTransfer object.');
                    }

                } catch (e) {
                    var msg = 'Exception in bwCalendar.js.dropzone_archived.drop(): ' + e.message + ', ' + e.stack;
                    console.log(msg);
                    alert(msg);
                }
            });

            dropzone_archived.addEventListener('paste', function (e) {
                try {
                    console.log('In bwCalendar.js.dropzone_archived.paste().');
                    //displayAlertDialog_Persistent('In bwCalendar.js.dropzone_archived.paste().');
                    e.preventDefault();

                    var gotData;
                    if (e.clipboardData) {
                        console.log('In bwCalendar.js.dropzone_archived.paste(). Object is event.clipboardData.');
                        gotData = true;
                    } else if (e.dataTransfer) {
                        console.log('In bwCalendar.js.dropzone_archived.paste(). Object is event.dataTransfer.');
                        gotData = true;
                    } else if (window.clipboardData) {
                        console.log('In bwCalendar.js.dropzone_archived.paste(). Object is window.clipboardData.');
                        gotData = true;
                    } else {

                        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                            alert('FIREFOX BROWSER CANNOT DRAG-AND-DROP EXTERNAL FILES. THERE IS A WORK-AROUND: Please right click on your source file, and choose "COPY". Subsequently, right click here and choose "PASTE".');
                        } else {
                            alert('Error in bwCalendar.js.dropzone_archived.paste(). Could not find a valid DataTransfer object. e: ' + JSON.stringify(e) + ', navigator.userAgent: ' + navigator.userAgent);
                        }

                    }

                    if (gotData == true) {
                        thiz.dodrop(e, 'ARCHIVED');
                    } else {
                        alert('Error in bwCalendar.js.dropzone_archived.paste(). Could not find a valid DataTransfer object.');
                    }

                } catch (e) {
                    var msg = 'Exception in bwCalendar.js.dropzone_archived.paste(): ' + e.message + ', ' + e.stack;
                    console.log(msg);
                    alert(msg);
                }
            });

            //
            // end: Archived. // Inbox, Junk, Archived, TrashBin.
            //

            //
            // TrashBin. // Inbox, Junk, Archived, TrashBin.
            //

            var dropzone_trashbin = document.getElementById('divInnerLeftMenuButton_TrashBin');

            dropzone_trashbin.addEventListener('dragenter', function (e) {
                try {
                    console.log('In bwCalendar.js.dropzone_trashbin.dragenter().');
                    //alert('In renderAndPopulateAttachmentsxx.dropzone_trashbin.dragenter().');
                    e.preventDefault();
                } catch (e) {
                    var msg = 'Exception in bwCalendar.js.dropzone_trashbin.dragenter(): ' + e.message + ', ' + e.stack;
                    console.log(msg);
                    alert(msg);
                }
            });

            dropzone_trashbin.addEventListener('dragover', function (e) {
                try {
                    console.log('In bwCalendar.js.dropzone_trashbin.dragover().');
                    //alert('In renderAndPopulateAttachmentsxx.dropzone_trashbin.dragover().');
                    e.preventDefault();
                } catch (e) {
                    var msg = 'Exception in bwCalendar.js.dropzone_trashbin.drop(): ' + e.message + ', ' + e.stack;
                    console.log(msg);
                    alert(msg);
                }
            });

            dropzone_trashbin.addEventListener('drop', function (e) {
                try {
                    console.log('In bwCalendar.js.dropzone_trashbin.drop().');
                    //displayAlertDialog_Persistent('In bwCalendar.js.dropzone_trashbin.drop(). xcx23124.');
                    e.preventDefault();

                    var gotData;
                    if (e.clipboardData) {
                        console.log('In bwCalendar.js.dropzone_trashbin.drop(). Object is event.clipboardData.');
                        gotData = true;
                    } else if (e.dataTransfer) {
                        console.log('In bwCalendar.js.dropzone_trashbin.drop(). Object is event.dataTransfer.');
                        gotData = true;
                    } else if (window.clipboardData) {
                        console.log('In bwCalendar.js.dropzone_trashbin.drop(). Object is window.clipboardData.');
                        gotData = true;
                    } else {

                        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                            alert('FIREFOX BROWSER CANNOT DRAG-AND-DROP EXTERNAL FILES. THERE IS A WORK-AROUND: Please right click on your source file, and choose "COPY". Subsequently, right click here and choose "PASTE".');
                        } else {
                            alert('Error in bwCalendar.js.dropzone_trashbin.drop(). Could not find a valid DataTransfer object. e: ' + JSON.stringify(e) + ', navigator.userAgent: ' + navigator.userAgent);
                        }

                    }

                    if (gotData == true) {
                        thiz.dodrop(e, 'TRASHBIN');
                    } else {
                        alert('Error in bwCalendar.js.dropzone_trashbin.drop(). Could not find a valid DataTransfer object.');
                    }

                } catch (e) {
                    var msg = 'Exception in bwCalendar.js.dropzone_trashbin.drop(): ' + e.message + ', ' + e.stack;
                    console.log(msg);
                    alert(msg);
                }
            });

            dropzone_trashbin.addEventListener('paste', function (e) {
                try {
                    console.log('In bwCalendar.js.dropzone_trashbin.paste().');
                    //displayAlertDialog_Persistent('In bwCalendar.js.dropzone_trashbin.paste().');
                    e.preventDefault();

                    var gotData;
                    if (e.clipboardData) {
                        console.log('In bwCalendar.js.dropzone_trashbin.paste(). Object is event.clipboardData.');
                        gotData = true;
                    } else if (e.dataTransfer) {
                        console.log('In bwCalendar.js.dropzone_trashbin.paste(). Object is event.dataTransfer.');
                        gotData = true;
                    } else if (window.clipboardData) {
                        console.log('In bwCalendar.js.dropzone_trashbin.paste(). Object is window.clipboardData.');
                        gotData = true;
                    } else {

                        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                            alert('FIREFOX BROWSER CANNOT DRAG-AND-DROP EXTERNAL FILES. THERE IS A WORK-AROUND: Please right click on your source file, and choose "COPY". Subsequently, right click here and choose "PASTE".');
                        } else {
                            alert('Error in bwCalendar.js.dropzone_trashbin.paste(). Could not find a valid DataTransfer object. e: ' + JSON.stringify(e) + ', navigator.userAgent: ' + navigator.userAgent);
                        }

                    }

                    if (gotData == true) {
                        thiz.dodrop(e, 'TRASHBIN');
                    } else {
                        alert('Error in bwCalendar.js.dropzone_trashbin.paste(). Could not find a valid DataTransfer object.');
                    }

                } catch (e) {
                    var msg = 'Exception in bwCalendar.js.dropzone_trashbin.paste(): ' + e.message + ', ' + e.stack;
                    console.log(msg);
                    alert(msg);
                }
            });

            //
            // end: TrashBin. // Inbox, Junk, Archived, TrashBin.
            //




            console.log('Calling loadAndRenderEmails_Inbox() from _create().');



            console.log('In bwCalendar.js._create(). The widget has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwCalendar: CANNOT INITIALIZE THE WIDGET</span>';
            html += '<br />';
            html += '<span style="">Exception in bwCalendar.Create(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);

            var msg = 'Exception in bwCalendar.js._create(): ' + e.message + ', ' + e.stack;
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
            .removeClass("bwCalendar")
            .text("");
    },

    isScrolledIntoView: function (el) {
        var rect = el.getBoundingClientRect();
        var elemTop = rect.top;
        var elemBottom = rect.bottom;

        // Only completely visible elements return true:
        var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
        // Partially visible elements return true:
        //isVisible = elemTop < window.innerHeight && elemBottom >= 0;
        return isVisible;
    },

    // Inbox methods.
    loadAndRenderEmails_Inbox: function (bwWorkflowAppId) {
        try {
            console.log('In bwCalendar.js.loadAndRenderEmails_Inbox(). bwWorkflowAppId: ' + bwWorkflowAppId);
            //alert('In bwCalendar.js.loadAndRenderEmails_Inbox(). bwWorkflowAppId: ' + bwWorkflowAppId);
            var thiz = this;

            $(thiz.element).find('#tableEmailPicker tr').remove(); // Remove all the rows in the emails table/list.

            // Hide the red dot.
            console.log('In bwCalendar.js.loadAndRenderEmails_Inbox(). Hide the red dot. Presumably, when the user looks at an email, it is time to hide the dot. We will try it out and see... 5-5-2024.');

            var element1 = document.getElementById('imgMessagingNotificationRedDot');
            if (element1 && element1.style && element1.style.display) {
                document.getElementById('imgMessagingNotificationRedDot').style.display = 'none'; // Hide the red dot. Presumably, when the user looks at an email, it is time to hide the dot. We will try it out and see... 5-5-2024.
            }
            $('.bwNotificationSound').bwNotificationSound('renderFavicon', false); // Turn off the red dot on the favicon.
            // end: Hide the red dot.

            // Select the button here. 1-4-2024.
            var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
            var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

            // Step 1: Make all of the buttons un-selected.
            $('.bwCalendar:first').find('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
            });

            // Step 2: Set the specified button as the selected one.
            $('#divInnerLeftMenuButton_Inbox').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);

            // An email won't be selected until the user selects one.
            $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '<div xcx="xcx213123-2" style="font-size:25pt;color:lightgray;">SELECT A CALENDAR ITEM THAT YOU WISH TO VIEW.</div>';
            var x = document.getElementById('tdbwCalendar_RightColumn');
            x.style.verticalAlign = 'middle';
            // end: An email won't be selected until the user selects one.

            $('#bwCalendar_EmailTopButtons').html('');  // These are the top buttons when an email is displayed. Get rid of any lingering ones...

            $('#divPageContent2_Title').html('✉&nbsp;CALENDAR<span style="display:none;" xcx="xcx880-134265" />');

            // Display the radio button and the title.
            html = '';
            //html += '<input type="checkbox" style="transform:scale(2);" id="checkboxToggleSentEmailCheckboxes" onchange="$(\'.bwCalendar\').bwCalendar(\'toggleSentEmailCheckboxes\', this);" />&nbsp;&nbsp;';
            html += '✉ Calendar Items';
            $(thiz.element).find('#spanSelectedEmailType_Title')[0].innerHTML = html; //'Sent Email';
            // end: Display the radio button and the title.

            // Display the top buttons.
            var html = '';
            //html += '                           <span xcx="xcx231232-2" class="emailEditor_topbarbutton" onclick="$(\'.bwCalendar\').bwCalendar(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\');">';
            //html += '                               <img title="Delete..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx123468" />&nbsp;Delete';
            //html += '                           </span>';
            //html += '&nbsp;&nbsp;';
            html += '                           <span xcx="xcx231232-2" class="emailEditor_topbarbutton" onclick="$(\'.bwCalendar\').bwCalendar(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\', \'emptyfolder\');">';
            html += '                               <img title="Empty folder..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx23423467898">&nbsp;Empty folder';
            html += '                           </span>';
            $(thiz.element).find('#spanSelectedEmailType_TopButtons')[0].innerHTML = html;
            // end: Display the top buttons.

            //
            //
            // divEmailPicker onscroll. This is how we know when to retrieve more emails to add to the list. This behaves like an infinite scroll. 7-20-2024.
            //
            //

            var divEmailPicker = document.getElementById('divEmailPicker');

            thiz.options.divEmailPicker_scroll_ticking = false;

            $(divEmailPicker).off('scroll').scroll(function (error) {

                lastKnownScrollPosition = divEmailPicker.scrollTop; // window.scrollY;

                if (!thiz.options.divEmailPicker_scroll_ticking) {
                    window.requestAnimationFrame(() => {

                        var msg = 'The user has scrolled. divEmailPicker.scrollTop: ' + divEmailPicker.scrollTop + ', divEmailPicker.offsetHeight: ' + divEmailPicker.offsetHeight;
                        console.log(msg);
                        //displayAlertDialog(msg);

                        //
                        // Check if the 5th from the bottom is in view. If so, it is time to load more emails.
                        //
                        var elements = $('.bwemailitems');
                        var index = elements.length - 5;
                        if (index > 0) {
                            if (thiz.isScrolledIntoView(elements[index])) {
                                thiz.options.divEmailPicker_scroll_ticking = true; // Turn off scroll detection until we are done our work here.
                                thiz.getMoreRecords_Inbox();
                            }
                        }

                    });

                }
            });


            thiz.options.window_scroll_ticking = false;

            $(window).off('scroll').scroll(function (error) {

                console.log('In window.scroll.');
                //displayAlertDialog_QuickNotice('In window.scroll.');

                if (!thiz.options.window_scroll_ticking) {
                    window.requestAnimationFrame(() => {

                        //
                        // Check if the 5th from the bottom is in view. If so, it is time to load more emails.
                        // We are doing it with this window scroll event as well, because on mobile it seems the div scroll bar disappears in Chrome and doesn't alwasy scroll, as expected.
                        //
                        var elements = $('.bwemailitems');
                        var index = elements.length - 5;
                        if (index > 0) {
                            if (thiz.isScrolledIntoView(elements[index])) {
                                thiz.options.window_scroll_ticking = true; // Turn off scroll detection until we are done our work here.
                                thiz.getMoreRecords_Inbox();
                            }
                        }

                    });

                }
            });


            //
            //
            // end: divEmailPicker onscroll. This is how we know when to retrieve more emails to add to the list. This behaves like an infinite scroll. 7-20-2024.
            //
            //

            $('.bwActiveMenu').bwActiveMenu('adjustLeftSideMenu'); // This makes sure our new stretchy-left-menu redraws Ok.

            thiz.options.Inbox = null;

            thiz.getMoreRecords_Inbox(); // Get the first round of mailbox items. The scroll event listeners will call this again to get more, until they are potentially all loaded.

        } catch (e) {
            console.log('Exception in bwCalendar.js.loadAndRenderEmails_Inbox(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCalendar.js.loadAndRenderEmails_Inbox(): ' + e.message + ', ' + e.stack);
        }
    },
    getMoreRecords_Inbox: function () {
        console.log('In bwCalendar.js.getMoreRecords_Inbox().');
        //alert('In bwCalendar.js.getMoreRecords_Inbox().');
        var thiz = this;

        //
        // The user has scrolled to the bottom of the list. Get more emails and add them to the list.
        //

        //var msg = 'In xcx23213123.divEmailPicker.scroll.getMoreRequests(). divEmailPicker.scrollTop: ' + divEmailPicker.scrollTop + ', offsetHeight: ' + divEmailPicker.offsetHeight;
        var msg = 'In getMoreRecords_Inbox(). The user has scrolled to the bottom of the list. Get more emails and add them to the list.';
        console.log(msg);
        //displayAlertDialog(msg);

        var startIndex = 0;
        if (thiz.options.Inbox && thiz.options.Inbox.docs && thiz.options.Inbox.docs.length) {
            startIndex = thiz.options.Inbox.docs.length;
        }

        thiz.getAndRenderPagedEmails_Inbox(startIndex, 5)
            .then(function (results) {

                // Update the status.
                var msg = 'Displaying 1 to ' + thiz.options.Inbox.docs.length + ' of ' + thiz.options.Inbox.totalDocs + ' emails.';
                $('#spanSelectedEmailType_Status').html(msg);

                if (results.length && (results.length > 0)) {
                    startIndex += 5;
                    thiz.getAndRenderPagedEmails_Inbox(startIndex, 5)
                        .then(function (results) {

                            // Update the status.
                            var msg = 'Displaying 1 to ' + thiz.options.Inbox.docs.length + ' of ' + thiz.options.Inbox.totalDocs + ' emails.';
                            $('#spanSelectedEmailType_Status').html(msg);

                            if (results.length && (results.length > 0)) {
                                startIndex += 5;
                                thiz.getAndRenderPagedEmails_Inbox(startIndex, 5)
                                    .then(function (results) {

                                        // Update the status.
                                        var msg = 'Displaying 1 to ' + thiz.options.Inbox.docs.length + ' of ' + thiz.options.Inbox.totalDocs + ' emails.';
                                        $('#spanSelectedEmailType_Status').html(msg);

                                        if (results.length && (results.length > 0)) {
                                            startIndex += 5;
                                            thiz.getAndRenderPagedEmails_Inbox(startIndex, 5)
                                                .then(function (results) {

                                                    // Update the status.
                                                    var msg = 'Displaying 1 to ' + thiz.options.Inbox.docs.length + ' of ' + thiz.options.Inbox.totalDocs + ' emails.';
                                                    $('#spanSelectedEmailType_Status').html(msg);




                                                    //
                                                    //
                                                    // This is where we load the dataTransfer object, so that we can drag and drop emails among the email folders. 5-21-2024.
                                                    //
                                                    // 

                                                    var emailItems = document.getElementsByClassName('bwemailitems');
                                                    for (var i = startIndex; i < emailItems.length; i++) { // Add these event listeners to all of the new ones.

                                                        emailItems[i].addEventListener('dragstart', function (e) {
                                                            try {
                                                                console.log('In bwCalendar.js.loadAndRenderEmails_Inbox.dragstart().');

                                                                // Step 1: Set the opacity for all of these classes to 0.5: brushedAluminum_blue_noanimation

                                                                // Step 2: Set the opacity to 1 for these buttons. This will indicate a drop zone: Junk, Archived, TrashBin. [divInnerLeftMenuButton_Junk, divInnerLeftMenuButton_Archived, divInnerLeftMenuButton_TrashBin].

                                                                var elements1 = document.getElementsByClassName('brushedAluminum_blue_noanimation');
                                                                for (var j = 0; j < elements1.length; j++) {
                                                                    elements1[j].style.opacity = '0.2';
                                                                }

                                                                var elements1 = document.getElementsByClassName('brushedAluminum_blue');
                                                                for (var j = 0; j < elements1.length; j++) {
                                                                    elements1[j].style.opacity = '0.2';
                                                                }

                                                                document.getElementById('divInnerLeftMenuButton_Junk').style.opacity = 1.0;
                                                                document.getElementById('divInnerLeftMenuButton_Archived').style.opacity = 1.0;
                                                                document.getElementById('divInnerLeftMenuButton_TrashBin').style.opacity = 1.0;

                                                                // We have to set the _id in the dragstart event.
                                                                var _id = e.target.getAttribute('_id');
                                                                var result = {
                                                                    MailboxOrigin: 'INBOX',
                                                                    _id: _id
                                                                }
                                                                var result1 = JSON.stringify(result);
                                                                e.dataTransfer.setData('text/plain', result1);

                                                            } catch (e) {
                                                                var msg = 'Exception in In bwCalendar.js.loadAndRenderEmails_Inbox.dragstart(): ' + e.message + ', ' + e.stack;
                                                                console.log(msg);
                                                                alert(msg);
                                                            }
                                                        });

                                                        emailItems[i].addEventListener('dragend', function (e) {
                                                            try {
                                                                console.log('In bwCalendar.js.loadAndRenderEmails_Inbox.dragend().');

                                                                // Set the opacity for all of these classes to 1.0: [brushedAluminum_blue, brushedAluminum_blue_noanimation].

                                                                var elements1 = document.getElementsByClassName('brushedAluminum_blue_noanimation');
                                                                for (var j = 0; j < elements1.length; j++) {
                                                                    elements1[j].style.opacity = '1.0';
                                                                }

                                                                var elements1 = document.getElementsByClassName('brushedAluminum_blue');
                                                                for (var j = 0; j < elements1.length; j++) {
                                                                    elements1[j].style.opacity = '1.0';
                                                                }

                                                            } catch (e) {
                                                                var msg = 'Exception in In bwCalendar.js.loadAndRenderEmails_Inbox.dragend(): ' + e.message + ', ' + e.stack;
                                                                console.log(msg);
                                                                alert(msg);
                                                            }
                                                        });

                                                    }

                                                    thiz.options.divEmailPicker_scroll_ticking = false; // We have completed our work, now turn on the scroll detection again.

                                                }).catch(function (e) {



                                                });

                                        }


                                    }).catch(function (e) {



                                    });

                            }

                        }).catch(function (e) {



                        });

                }

            }).catch(function (e) {



            });

    },
    getAndRenderPagedEmails_Inbox: function (offset, limit) {
        var thiz = this;
        return new Promise(function (resolve, reject) {
            try {
                console.log('In bwCalendar.js.getAndRenderPagedEmails_Inbox().');
                //alert('In bwCalendar.js.getAndRenderPagedEmails_Inbox().');

                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                var data = {
                    bwParticipantId_LoggedIn: participantId,
                    bwActiveStateIdentifier: activeStateIdentifier,
                    bwWorkflowAppId_LoggedIn: workflowAppId,

                    offset: offset,
                    limit: limit
                    //bwWorkflowAppId: workflowAppId,
                    //bwParticipantId: participantId,
                };

                $.ajax({
                    url: thiz.options.operationUriPrefix + "_bw/participantemail_inbox",
                    type: 'POST',
                    data: data,
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    },
                    success: function (results) {
                        try {

                            console.log('xcx23213. These pids change. Often I get the 2 first with a pid, then the remaining 2 with another pid. This may be the round-robin behavior? pid: ' + results.pid);

                            if (results.status != 'SUCCESS') {

                                var msg = results.status + ': ' + results.message;
                                console.log(msg);
                                displayAlertDialog(msg);

                                //thiz.element.html(''); // This actually works to get rid of the widget. Ha! 11-8-2023.

                            } else {

                                if (!(thiz.options.Inbox && thiz.options.Inbox.docs && thiz.options.Inbox.docs.length)) {

                                    // The options.Inbox is empty, so just load it directly.
                                    thiz.options.Inbox = results.results;

                                } else {

                                    // The options.Inbox has some emails in it already, so load it like this.
                                    for (var i = 0; i < results.results.docs.length; i++) {
                                        thiz.options.Inbox.docs.push(results.results.docs[i]); // With pagination.
                                    }

                                    thiz.options.Inbox.totalDocs = results.results.totalDocs;
                                    thiz.options.Inbox.offset = results.results.offset;
                                    thiz.options.Inbox.limit = results.results.limit;
                                    thiz.options.Inbox.totalPages = results.results.totalPages;
                                    thiz.options.Inbox.page = results.results.page;
                                    thiz.options.Inbox.pagingCounter = results.results.pagingCounter;
                                    thiz.options.Inbox.hasPrevPage = results.results.hasPrevPage;
                                    thiz.options.Inbox.hasNextPage = results.results.hasNextPage;
                                    thiz.options.Inbox.prevPage = results.results.prevPage;
                                    thiz.options.Inbox.nextPage = results.results.nextPage;

                                }

                                if (!thiz.options.Inbox.docs.length || thiz.options.Inbox.docs.length == 0) {

                                    var html = '';

                                    html += '<tr><td><span style="font-size:10pt;font-weight:normal;color:black;">';
                                    html += '  There are no Inbox emails.';
                                    html += '<span></td></tr>';

                                    $(thiz.element).find('#tableEmailPicker').append(html);

                                    if ($(thiz.element).find('#spanSelectedEmail') && $(thiz.element).find('#spanSelectedEmail')[0]) {
                                        $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = '';
                                    }

                                } else {

                                    var element = $(thiz.element).find('#tableEmailPicker')[0];

                                    for (var i = 0; i < results.results.docs.length; i++) {

                                        thiz.renderMailboxItemInList(results.results.docs[i], element, 'Inbox'); // Generate the email listing HTML.

                                    }

                                    thiz.resize();

                                }

                            }

                            var result = {
                                status: 'SUCCESS',
                                message: 'SUCCESS',
                                length: results.results.docs.length
                            }
                            resolve(result);

                        } catch (e) {

                            var msg = 'Exception in bwCalendar.js.getAndRenderPagedEmails_Inbox():2: ' + e.message + ', ' + e.stack;
                            console.log(msg);

                            var result = {
                                status: 'EXCEPTION',
                                message: msg
                            }
                            reject(result);

                        }

                    },
                    error: function (data, errorCode, errorMessage) {

                        var msg = 'Error in bwCalendar.js.getAndRenderPagedEmails_Inbox():1: ' + errorCode + ', ' + errorMessage;
                        console.log(msg);

                        var result = {
                            status: 'EXCEPTION',
                            message: msg
                        }
                        reject(result);

                    }

                });

            } catch (e) {

                var msg = 'Exception in bwCalendar.js.getAndRenderPagedEmails_Inbox(): ' + e.message + ', ' + e.stack;
                console.log(msg);

                var result = {
                    status: 'EXCEPTION',
                    message: msg
                }
                reject(result);

            }

        });

    },
    viewIndividualEmail_Inbox: function (originElementId, bwParticipantId, bwParticipantFriendlyName, bwParticipantEmail, _id) {
        try {
            console.log('In bwCalendar.js.viewIndividualEmail_Inbox(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ', _id: ' + _id);
            //displayAlertDialog_Persistent('In bwCalendar.js.viewIndividualEmail_Inbox(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ', _id: ' + _id);
            //alert('In bwCalendar.js.viewIndividualEmail_Inbox().');
            var thiz = this;

            console.log('In bwCalendar.js.viewIndividualEmail_Inbox(). Hide the red dot. Presumably, when the user looks at an email, it is time to hide the dot. We will try it out and see... 5-5-2024.');
            document.getElementById('imgMessagingNotificationRedDot').style.display = 'none'; // Hide the red dot. Presumably, when the user looks at an email, it is time to hide the dot. We will try it out and see... 5-5-2024.
            $('.bwNotificationSound').bwNotificationSound('renderFavicon', false); // Turn off the red dot on the favicon.

            this.displayExistingMessageHtml().then(function (results) {
                try {
                    if (results.status != 'SUCCESS') {

                        var msg = 'Error in bwCalendar.js.viewIndividualEmail_Inbox(): ' + results.message;
                        console.log(msg);
                        displayAlertDialog(msg);

                    } else {

                        console.log('In bwCalendar.js.viewIndividualEmail_Inbox(). Successfully returned from displayExistingMessageHtml().');

                        thiz.loadIndividualEmail_Inbox(_id).then(function () {
                            try {

                                // Display the top buttons. Include reply, reply-all, forward, as appropriate.
                                var html = '';
                                //html += 'From: <span class="EmailAddress_From">' + emailAddress + '</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'; // + '[Reply]  [Reply All]  [Forward]';
                                html += '<button class="BwButton200" xcx="xcx2134264-1" onclick="$(\'.bwCalendar:first\').bwCalendar(\'composeANewEmailMessage_Reply\');">&nbsp;✉&nbsp;Reply&nbsp;</button>'; // emailEditor_newMessageButton
                                html += '&nbsp;&nbsp;&nbsp;';
                                html += '<button class="BwButton200" onclick="$(\'.bwCalendar:first\').bwCalendar(\'composeANewEmailMessage_Reply\');">&nbsp;✉&nbsp;Reply All&nbsp;</button>';
                                html += '&nbsp;&nbsp;&nbsp;';
                                html += '<button class="BwButton200" onclick="$(\'.bwCalendar:first\').bwCalendar(\'composeANewEmailMessage_Reply\');">&nbsp;✉&nbsp;Forward&nbsp;</button>';
                                $('#bwCalendar_EmailTopButtons').html(html);


                                thiz.renderIndividualEmail_ReadOnly(_id, 'Inbox').then(function (results) { // strMailbox: ['Inbox', 'Sent', etc.]
                                    try {

                                        if (results.status != 'SUCCESS') {

                                            var msg = 'Error in bwCalendar.js.viewIndividualEmail_Inbox(): ' + results.message;
                                            console.log(msg);
                                            displayAlertDialog(msg);

                                        } else {

                                            var _email = results.email;

                                            if (_email.hasOwnProperty('TheUserHasReadThisEmail') && (_email.TheUserHasReadThisEmail == true)) {

                                                console.log('xcx87090000-1. CHECKING TO CHANGE THE READ EMAIL UI. _email.TheUserHasReadThisEmail: ' + _email.TheUserHasReadThisEmail);

                                            } else {

                                                //
                                                //
                                                // This email is marked as unread, so we do a web service call here to mark this email as read on the server. 11-2-2023.
                                                //
                                                //

                                                console.log('xcx87090000-1. CHECKING TO CHANGE THE READ EMAIL UI. _email.TheUserHasReadThisEmail: ' + _email.TheUserHasReadThisEmail + '. This email is marked as unread, so we do a web service call here to mark this email as read on the server. 11-2-2023. _email._id: ' + _email._id);

                                                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                                                var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                                                var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                                                var data = {
                                                    bwParticipantId_LoggedIn: participantId,
                                                    bwActiveStateIdentifier: activeStateIdentifier,
                                                    bwWorkflowAppId_LoggedIn: workflowAppId,

                                                    bwWorkflowAppId: workflowAppId,
                                                    bwParticipantId: participantId,
                                                    _id: _email._id
                                                };

                                                $.ajax({
                                                    url: thiz.options.operationUriPrefix + "_bw/marksingleemailasread",
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

                                                                console.log('The email was successfully marked as read. _email._id: ' + _email._id + ', results.message: ' + results.message);

                                                                console.log('The email was successfully marked as read. We updated options.Inbox and redid the UI so that the user gets visual feedback.');

                                                                for (var i = 0; i < thiz.options.Inbox.docs.length; i++) {
                                                                    if (thiz.options.Inbox.docs[i]._id == _email._id) { // We can't use message_id because it may have an @ sign in it, which is not allowed in a valid html element id.

                                                                        thiz.options.Inbox.docs[i]["TheUserHasReadThisEmail"] = true;

                                                                        var mailboxEmails = $(thiz.element).find('.bwEmailMailboxRow');

                                                                        for (var j = 0; j < mailboxEmails.length; j++) {

                                                                            var tmpId = $(mailboxEmails[j]).attr('_id');
                                                                            if (tmpId == _email._id) {

                                                                                // We have found the email entry. Change the UI.
                                                                                var emailAddressElement = $(mailboxEmails[j]).find('.bwEmailMailboxRow_EmailAddress')[0];
                                                                                var subjectElement = $(mailboxEmails[j]).find('.bwEmailMailboxRow_Subject')[0];
                                                                                $(emailAddressElement).css('fontWeight', 'normal');
                                                                                $(subjectElement).css('fontWeight', 'lighter');
                                                                                break;

                                                                            }
                                                                        }

                                                                        break;

                                                                    }
                                                                }



                                                                console.log('xcx12323522. Calling bwActiveMenu.adjustInnerLeftSideMenu(). 8-1-2024. Does this do anything useful? :)');
                                                                $('.bwActiveMenu').bwActiveMenu('adjustLeftSideMenu'); // doing thsi to see if it helpsany. definately not most of the time......
                                                                $('.bwActiveMenu').bwActiveMenu('adjustInnerLeftSideMenu'); // 8-1-2024. Does this do anything useful? :)





                                                            }

                                                        } catch (e) {
                                                            var msg = 'Exception in bwCalendar.js.viewIndividualEmail_Inbox():8: ' + e.message + ', ' + e.stack;
                                                            console.log(msg);
                                                            displayAlertDialog(msg);
                                                        }
                                                    },
                                                    error: function (data, errorCode, errorMessage) {
                                                        var msg = 'Error in bwCalendar.js.viewIndividualEmail_Inbox(): ' + errorCode + ', ' + errorMessage;
                                                        console.log(msg);
                                                        displayAlertDialog(msg);
                                                    }
                                                });

                                            }

                                        }

                                    } catch (e) {
                                        var msg = 'Exception in bwCalendar.js.viewIndividualEmail_Inbox():7: ' + e.message + ', ' + e.stack;
                                        console.log(msg);
                                        displayAlertDialog(msg);
                                    }

                                }).catch(function (e) {
                                    var msg = 'Exception in bwCalendar.js.viewIndividualEmail_Inbox():6: ' + JSON.stringify(e);
                                    console.log(msg);
                                    displayAlertDialog(msg);
                                });

                            } catch (e) {
                                var msg = 'Exception in bwCalendar.js.viewIndividualEmail_Inbox():5: ' + e.message + ', ' + e.stack;
                                console.log(msg);
                                displayAlertDialog(msg);
                            }

                        }).catch(function (e) {
                            var msg = 'Exception in bwCalendar.js.viewIndividualEmail_Inbox():4: ' + JSON.stringify(e);
                            console.log(msg);
                            displayAlertDialog(msg);
                        });

                    }

                } catch (e) {
                    var msg = 'Exception in bwCalendar.js.viewIndividualEmail_Inbox():3: ' + e.message + ', ' + e.stack;
                    console.log(msg);
                    displayAlertDialog(msg);
                }

            }).catch(function (e) {
                var msg = 'Exception in bwCalendar.js.viewIndividualEmail_Inbox():2: ' + JSON.stringify(e);
                console.log(msg);
                displayAlertDialog(msg);
            });

        } catch (e) {
            var msg = 'Exception in bwCalendar.js.viewIndividualEmail_Inbox(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ': ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
        }
    },
    loadIndividualEmail_Inbox: function (_id) {
        var thiz = this;
        return new Promise(function (resolve, reject) {
            try {
                console.log('In bwCalendar.js.loadIndividualEmail_Inbox(). _id: ' + _id);
                //alert('In bwCalendar.js.loadIndividualEmail_Inbox(). _id: ' + _id);

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

                        var msg = 'Error in bwCalendar.js.loadIndividualEmail_Inbox(): Invalid value. Expected values for workflowAppId: ' + workflowAppId + ', participantId: ' + participantId + ', _id: ' + _id;
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
                            type: 'POST',
                            data: data,
                            headers: {
                                "Accept": "application/json; odata=verbose"
                            },
                            success: function (results) {
                                try {

                                    if (results.status != 'SUCCESS') {

                                        var msg = 'Error in bwCalendar.js.loadAndRenderEmails():xcx542: results: ' + JSON.stringify(results);
                                        console.log(msg);

                                        var result = {
                                            status: 'ERROR',
                                            message: msg
                                        }
                                        reject(result);

                                    } else {

                                        if (!results.doc) {

                                            console.log('xcx2131234-1 NO RESULTS!!!! results.doc: ' + JSON.stringify(results.doc) + ', data: ' + JSON.stringify(data));
                                            alert('xcx2131234-1 NO RESULTS!!!! results.doc: ' + JSON.stringify(results.doc) + ', data: ' + JSON.stringify(data));

                                        } else {

                                            var foundIt;
                                            for (var i = 0; i < thiz.options.Inbox.docs.length; i++) {
                                                if (thiz.options.Inbox.docs[i]._id == _id) {

                                                    thiz.options.Inbox.docs[i] = results.doc; // This is where we load the entire email into the mailbox.
                                                    foundIt = true;

                                                }
                                            }

                                            if (!foundIt) {

                                                var msg = 'Error in bwCalendar.js.loadAndRenderEmails():xcx231312-1: Could not find the email with _id: ' + _id;
                                                console.log(msg);

                                                var result = {
                                                    status: 'ERROR',
                                                    message: msg
                                                }
                                                reject(result);

                                            } else {

                                                var result = {
                                                    status: 'SUCCESS',
                                                    message: 'The email contents have added to the mailbox so that it available to be viewed.'
                                                }
                                                resolve(result);

                                            }

                                        }

                                    }

                                } catch (e) {

                                    var msg = 'Exception in bwCalendar.js.loadAndRenderEmails():2: ' + e.message + ', ' + e.stack;
                                    console.log(msg);

                                    var result = {
                                        status: 'EXCEPTION',
                                        message: msg
                                    }
                                    reject(result);

                                }
                            },
                            error: function (data, errorCode, errorMessage) {

                                var msg = 'Error in bwCalendar.js.loadAndRenderEmails():' + errorCode + ', ' + errorMessage;
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

                var msg = 'Exception in bwCalendar.js.loadIndividualEmail_Inbox():xcx453: ' + e.message + ', ' + e.stack;

                var result = {
                    status: 'EXCEPTION',
                    message: msg
                }
                reject(result);

            }

        })
    },

    // Sent methods.
    loadAndRenderEmails_Sent: function (bwWorkflowAppId) {
        try {
            console.log('In bwCalendar.js.loadAndRenderEmails_Sent(). bwWorkflowAppId: ' + bwWorkflowAppId);
            //alert('In bwCalendar.js.loadAndRenderEmails_Sent(). bwWorkflowAppId: ' + bwWorkflowAppId);
            var thiz = this;

            $(thiz.element).find('#tableEmailPicker tr').remove(); // Remove all the rows in the emails table/list.

            // Select the button here. 1-4-2024.
            var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
            var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

            // Step 1: Make all of the buttons un-selected.
            $('.bwCalendar:first').find('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
            });

            // Step 2: Set the specified button as the selected one.
            $('#divInnerLeftMenuButton_Sent').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);

            // An email won't be selected until the user selects one.
            $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '<div xcx="xcx213123-2" style="font-size:25pt;color:lightgray;">SELECT A CALENDAR ITEM THAT YOU WISH TO VIEW.</div>';
            var x = document.getElementById('tdbwCalendar_RightColumn');
            x.style.verticalAlign = 'middle';
            // end: An email won't be selected until the user selects one.

            $('#bwCalendar_EmailTopButtons').html('');  // These are the top buttons when an email is displayed. Get rid of any lingering ones...

            $('#divPageContent2_Title').html('✉&nbsp;SENT');

            // Display the radio button and the title.
            html = '';
            //html += '<input type="checkbox" style="transform:scale(2);" id="checkboxToggleSentEmailCheckboxes" onchange="$(\'.bwCalendar\').bwCalendar(\'toggleSentEmailCheckboxes\', this);" />&nbsp;&nbsp;';
            html += '✉ Sent Items';
            $(thiz.element).find('#spanSelectedEmailType_Title')[0].innerHTML = html; //'Sent Email';
            // end: Display the radio button and the title.

            // Display the top buttons.
            var html = '';
            //html += '                           <span xcx="xcx231232-2" class="emailEditor_topbarbutton" onclick="$(\'.bwCalendar\').bwCalendar(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\');">';
            //html += '                               <img title="Delete..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx123468" />&nbsp;Delete';
            //html += '                           </span>';
            //html += '&nbsp;&nbsp;';
            html += '                           <span xcx="xcx231232-2" class="emailEditor_topbarbutton" onclick="$(\'.bwCalendar\').bwCalendar(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\', \'emptyfolder\');">';
            html += '                               <img title="Empty folder..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx23423467898">&nbsp;Empty folder';
            html += '                           </span>';
            $(thiz.element).find('#spanSelectedEmailType_TopButtons')[0].innerHTML = html;
            // end: Display the top buttons.

            var divEmailPicker = document.getElementById('divEmailPicker');

            thiz.options.divEmailPicker_scroll_ticking = false;

            $(divEmailPicker).off('scroll').scroll(function (error) {

                lastKnownScrollPosition = divEmailPicker.scrollTop; // window.scrollY;

                if (!thiz.options.divEmailPicker_scroll_ticking) {
                    window.requestAnimationFrame(() => {

                        var msg = 'The user has scrolled. divEmailPicker.scrollTop: ' + divEmailPicker.scrollTop + ', divEmailPicker.offsetHeight: ' + divEmailPicker.offsetHeight;
                        console.log(msg);
                        //displayAlertDialog(msg);

                        //
                        // Check if the 5th from the bottom is in view. If so, it is time to load more emails.
                        //
                        var elements = $('.bwemailitems');
                        var index = elements.length - 5;
                        if (index > 0) {
                            if (thiz.isScrolledIntoView(elements[index])) {
                                thiz.options.divEmailPicker_scroll_ticking = true; // Turn off scroll detection until we are done our work here.
                                thiz.getMoreRecords_Sent();
                            }
                        }

                    });

                }
            });


            thiz.options.window_scroll_ticking = false;

            $(window).off('scroll').scroll(function (error) {

                console.log('In window.scroll.');
                //displayAlertDialog_QuickNotice('In window.scroll.');

                if (!thiz.options.window_scroll_ticking) {
                    window.requestAnimationFrame(() => {

                        //
                        // Check if the 5th from the bottom is in view. If so, it is time to load more emails.
                        // We are doing it with this window scroll event as well, because on mobile it seems the div scroll bar disappears in Chrome and doesn't alwasy scroll, as expected.
                        //
                        var elements = $('.bwemailitems');
                        var index = elements.length - 5;
                        if (index > 0) {
                            if (thiz.isScrolledIntoView(elements[index])) {
                                thiz.options.window_scroll_ticking = true; // Turn off scroll detection until we are done our work here.
                                thiz.getMoreRecords_Sent();
                            }
                        }

                    });

                }
            });


            //
            //
            // end: divEmailPicker onscroll. This is how we know when to retrieve more emails to add to the list. This behaves like an infinite scroll. 7-20-2024.
            //
            //

            $('.bwActiveMenu').bwActiveMenu('adjustLeftSideMenu'); // This makes sure our new stretchy-left-menu redraws Ok.

            thiz.options.Sent = null;

            thiz.getMoreRecords_Sent(); // Get the first round of mailbox items. The scroll event listeners will call this again to get more, until they are potentially all loaded.

        } catch (e) {
            console.log('Exception in bwCalendar.js.loadAndRenderEmails_Sent(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCalendar.js.loadAndRenderEmails_Sent(): ' + e.message + ', ' + e.stack);
        }
    },
    getMoreRecords_Sent: function () {
        console.log('In bwCalendar.js.getMoreRecords_Sent().');
        //alert('In bwCalendar.js.getMoreRecords_Sent().');
        var thiz = this;

        //
        // The user has scrolled to the bottom of the list. Get more emails and add them to the list.
        //

        //var msg = 'In xcx23213123.divEmailPicker.scroll.getMoreRequests(). divEmailPicker.scrollTop: ' + divEmailPicker.scrollTop + ', offsetHeight: ' + divEmailPicker.offsetHeight;
        var msg = 'In getMoreRecords_Sent(). The user has scrolled to the bottom of the list. Get more emails and add them to the list.';
        console.log(msg);
        //displayAlertDialog(msg);

        var startIndex = 0;
        if (thiz.options.Sent && thiz.options.Sent.docs && thiz.options.Sent.docs.length) {
            startIndex = thiz.options.Sent.docs.length;
        }

        thiz.getAndRenderPagedEmails_Sent(startIndex, 5)
            .then(function (results) {

                // Update the status.
                var msg = 'Displaying 1 to ' + thiz.options.Sent.docs.length + ' of ' + thiz.options.Sent.totalDocs + ' emails.';
                $('#spanSelectedEmailType_Status').html(msg);

                if (results.length && (results.length > 0)) {
                    startIndex += 5;
                    thiz.getAndRenderPagedEmails_Sent(startIndex, 5)
                        .then(function (results) {

                            // Update the status.
                            var msg = 'Displaying 1 to ' + thiz.options.Sent.docs.length + ' of ' + thiz.options.Sent.totalDocs + ' emails.';
                            $('#spanSelectedEmailType_Status').html(msg);

                            if (results.length && (results.length > 0)) {
                                startIndex += 5;
                                thiz.getAndRenderPagedEmails_Sent(startIndex, 5)
                                    .then(function (results) {

                                        // Update the status.
                                        var msg = 'Displaying 1 to ' + thiz.options.Sent.docs.length + ' of ' + thiz.options.Sent.totalDocs + ' emails.';
                                        $('#spanSelectedEmailType_Status').html(msg);

                                        if (results.length && (results.length > 0)) {
                                            startIndex += 5;
                                            thiz.getAndRenderPagedEmails_Sent(startIndex, 5)
                                                .then(function (results) {

                                                    // Update the status.
                                                    var msg = 'Displaying 1 to ' + thiz.options.Sent.docs.length + ' of ' + thiz.options.Sent.totalDocs + ' emails.';
                                                    $('#spanSelectedEmailType_Status').html(msg);




                                                    //
                                                    //
                                                    // This is where we load the dataTransfer object, so that we can drag and drop emails among the email folders. 5-21-2024.
                                                    //
                                                    // 

                                                    var emailItems = document.getElementsByClassName('bwemailitems');
                                                    for (var i = startIndex; i < emailItems.length; i++) { // Add these event listeners to all of the new ones.

                                                        emailItems[i].addEventListener('dragstart', function (e) {
                                                            try {
                                                                console.log('In bwCalendar.js.loadAndRenderEmails_Sent.dragstart().');

                                                                // Step 1: Set the opacity for all of these classes to 0.5: brushedAluminum_blue_noanimation

                                                                // Step 2: Set the opacity to 1 for these buttons. This will indicate a drop zone: Junk, Archived, TrashBin. [divInnerLeftMenuButton_Junk, divInnerLeftMenuButton_Archived, divInnerLeftMenuButton_TrashBin].

                                                                var elements1 = document.getElementsByClassName('brushedAluminum_blue_noanimation');
                                                                for (var j = 0; j < elements1.length; j++) {
                                                                    elements1[j].style.opacity = '0.2';
                                                                }

                                                                var elements1 = document.getElementsByClassName('brushedAluminum_blue');
                                                                for (var j = 0; j < elements1.length; j++) {
                                                                    elements1[j].style.opacity = '0.2';
                                                                }

                                                                document.getElementById('divInnerLeftMenuButton_Junk').style.opacity = 1.0;
                                                                document.getElementById('divInnerLeftMenuButton_Archived').style.opacity = 1.0;
                                                                document.getElementById('divInnerLeftMenuButton_TrashBin').style.opacity = 1.0;

                                                                // We have to set the _id in the dragstart event.
                                                                var _id = e.target.getAttribute('_id');
                                                                var result = {
                                                                    MailboxOrigin: 'SENT',
                                                                    _id: _id
                                                                }
                                                                var result1 = JSON.stringify(result);
                                                                e.dataTransfer.setData('text/plain', result1);

                                                            } catch (e) {
                                                                var msg = 'Exception in In bwCalendar.js.loadAndRenderEmails_Sent.dragstart(): ' + e.message + ', ' + e.stack;
                                                                console.log(msg);
                                                                alert(msg);
                                                            }
                                                        });

                                                        emailItems[i].addEventListener('dragend', function (e) {
                                                            try {
                                                                console.log('In bwCalendar.js.loadAndRenderEmails_Sent.dragend().');

                                                                // Set the opacity for all of these classes to 1.0: [brushedAluminum_blue, brushedAluminum_blue_noanimation].

                                                                var elements1 = document.getElementsByClassName('brushedAluminum_blue_noanimation');
                                                                for (var j = 0; j < elements1.length; j++) {
                                                                    elements1[j].style.opacity = '1.0';
                                                                }

                                                                var elements1 = document.getElementsByClassName('brushedAluminum_blue');
                                                                for (var j = 0; j < elements1.length; j++) {
                                                                    elements1[j].style.opacity = '1.0';
                                                                }

                                                            } catch (e) {
                                                                var msg = 'Exception in In bwCalendar.js.loadAndRenderEmails_Sent.dragend(): ' + e.message + ', ' + e.stack;
                                                                console.log(msg);
                                                                alert(msg);
                                                            }
                                                        });

                                                    }

                                                    thiz.options.divEmailPicker_scroll_ticking = false; // We have completed our work, now turn on the scroll detection again.

                                                }).catch(function (e) {



                                                });

                                        }


                                    }).catch(function (e) {



                                    });

                            }

                        }).catch(function (e) {



                        });

                }

            }).catch(function (e) {



            });

    },
    getAndRenderPagedEmails_Sent: function (offset, limit) {
        var thiz = this;
        return new Promise(function (resolve, reject) {
            try {
                console.log('In bwCalendar.js.getAndRenderPagedEmails_Sent().');
                //alert('In bwCalendar.js.getAndRenderPagedEmails_Sent().');

                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                var data = {
                    bwParticipantId_LoggedIn: participantId,
                    bwActiveStateIdentifier: activeStateIdentifier,
                    bwWorkflowAppId_LoggedIn: workflowAppId,

                    offset: offset,
                    limit: limit
                    //bwWorkflowAppId: workflowAppId,
                    //bwParticipantId: participantId,
                };

                $.ajax({
                    url: thiz.options.operationUriPrefix + "_bw/participantemail_sent",
                    type: 'POST',
                    data: data,
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    },
                    success: function (results) {
                        try {

                            console.log('xcx23213. These pids change. Often I get the 2 first with a pid, then the remaining 2 with another pid. This may be the round-robin behavior? pid: ' + results.pid);

                            if (results.status != 'SUCCESS') {

                                var msg = results.status + ': ' + results.message;
                                console.log(msg);
                                displayAlertDialog(msg);

                            } else {

                                if (!(thiz.options.Sent && thiz.options.Sent.docs && thiz.options.Sent.docs.length)) {

                                    // The options.Sent is empty, so just load it directly.
                                    //alert('The options.Sent is empty, so just load it directly because it is the first time.');
                                    thiz.options.Sent = results.results;

                                } else {

                                    // The options.Sent has some emails in it already, so load it like this.
                                    for (var i = 0; i < results.results.docs.length; i++) {
                                        thiz.options.Sent.docs.push(results.results.docs[i]); // With pagination.
                                    }

                                    thiz.options.Sent.totalDocs = results.results.totalDocs;
                                    thiz.options.Sent.offset = results.results.offset;
                                    thiz.options.Sent.limit = results.results.limit;
                                    thiz.options.Sent.totalPages = results.results.totalPages;
                                    thiz.options.Sent.page = results.results.page;
                                    thiz.options.Sent.pagingCounter = results.results.pagingCounter;
                                    thiz.options.Sent.hasPrevPage = results.results.hasPrevPage;
                                    thiz.options.Sent.hasNextPage = results.results.hasNextPage;
                                    thiz.options.Sent.prevPage = results.results.prevPage;
                                    thiz.options.Sent.nextPage = results.results.nextPage;

                                }

                                if (!thiz.options.Sent.docs.length || (thiz.options.Sent.docs.length == 0)) {

                                    var html = '';

                                    html += '<tr><td><span style="font-size:10pt;font-weight:normal;color:black;">';
                                    html += '  There are no Sent emails.';
                                    html += '<span></td></tr>';

                                    $(thiz.element).find('#tableEmailPicker').append(html);

                                    if ($(thiz.element).find('#spanSelectedEmail') && $(thiz.element).find('#spanSelectedEmail')[0]) {
                                        $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = '';
                                    }

                                } else {

                                    var element = $(thiz.element).find('#tableEmailPicker')[0];

                                    for (var i = 0; i < results.results.docs.length; i++) {

                                        thiz.renderMailboxItemInList(results.results.docs[i], element, 'Sent'); // Generate the email listing HTML.

                                    }

                                    thiz.resize();

                                }

                            }

                            var result = {
                                status: 'SUCCESS',
                                message: 'SUCCESS',
                                length: results.results.docs.length
                            }
                            resolve(result);

                        } catch (e) {

                            var msg = 'Exception in bwCalendar.js.getAndRenderPagedEmails_Sent():2: ' + e.message + ', ' + e.stack;
                            console.log(msg);

                            var result = {
                                status: 'EXCEPTION',
                                message: msg
                            }
                            reject(result);

                        }

                    },
                    error: function (data, errorCode, errorMessage) {

                        var msg = 'Error in bwCalendar.js.getAndRenderPagedEmails_Sent():1: ' + errorCode + ', ' + errorMessage;
                        console.log(msg);

                        var result = {
                            status: 'EXCEPTION',
                            message: msg
                        }
                        reject(result);

                    }

                });

            } catch (e) {

                var msg = 'Exception in bwCalendar.js.getAndRenderPagedEmails_Sent(): ' + e.message + ', ' + e.stack;
                console.log(msg);

                var result = {
                    status: 'EXCEPTION',
                    message: msg
                }
                reject(result);

            }

        });

    },
    viewIndividualEmail_Sent: function (originElementId, bwParticipantId, bwParticipantFriendlyName, bwParticipantEmail, _id) {
        try {
            console.log('In bwCalendar.js.viewIndividualEmail_Sent(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ', _id: ' + _id);
            //displayAlertDialog_Persistent('In bwCalendar.js.viewIndividualEmail_Sent(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ', _id: ' + _id);
            //alert('In bwCalendar.js.viewIndividualEmail_Sent().');
            var thiz = this;

            this.displayExistingMessageHtml().then(function (results) {
                try {
                    if (results.status != 'SUCCESS') {

                        var msg = 'Error in bwCalendar.js.viewIndividualEmail_Sent(): ' + results.message;
                        console.log(msg);
                        displayAlertDialog(msg);

                    } else {

                        console.log('In bwCalendar.js.viewIndividualEmail_Sent(). Successfully returned from displayExistingMessageHtml().');

                        thiz.loadIndividualEmail_Sent(_id).then(function () {
                            try {

                                // Display the top buttons. Include reply, reply-all, forward, as appropriate.
                                var html = '';
                                //html += 'From: <span class="EmailAddress_From">' + emailAddress + '</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'; // + '[Reply]  [Reply All]  [Forward]';
                                html += '<span class="emailEditor_newMessageButton" xcx="xcx2134264-2" onclick="$(\'.bwCalendar:first\').bwCalendar(\'composeANewEmailMessage_Reply\');">&nbsp;✉&nbsp;Reply&nbsp;</span>';
                                html += '&nbsp;&nbsp;&nbsp;';
                                html += '<span class="emailEditor_newMessageButton" onclick="$(\'.bwCalendar:first\').bwCalendar(\'composeANewEmailMessage_Reply\');">&nbsp;✉&nbsp;Reply All&nbsp;</span>';
                                html += '&nbsp;&nbsp;&nbsp;';
                                html += '<span class="emailEditor_newMessageButton" onclick="$(\'.bwCalendar:first\').bwCalendar(\'composeANewEmailMessage_Reply\');">&nbsp;✉&nbsp;Forward&nbsp;</span>';
                                $('#bwCalendar_EmailTopButtons').html(html);

                                thiz.renderIndividualEmail_ReadOnly(_id, 'Sent').then(function (results) { // strMailbox: ['Inbox', 'Sent', etc.]
                                    try {
                                        debugger;
                                        if (results.status != 'SUCCESS') {

                                            var msg = 'Error in bwCalendar.js.viewIndividualEmail_Sent(): ' + results.message;
                                            console.log(msg);
                                            displayAlertDialog(msg);

                                        } else {

                                            // Done

                                        }

                                    } catch (e) {
                                        var msg = 'Exception in bwCalendar.js.viewIndividualEmail_Sent():7: ' + e.message + ', ' + e.stack;
                                        console.log(msg);
                                        displayAlertDialog(msg);
                                    }

                                }).catch(function (e) {
                                    var msg = 'Exception in bwCalendar.js.viewIndividualEmail_Sent():6: ' + JSON.stringify(e);
                                    console.log(msg);
                                    displayAlertDialog(msg);
                                });

                            } catch (e) {
                                var msg = 'Exception in bwCalendar.js.viewIndividualEmail_Sent():5: ' + e.message + ', ' + e.stack;
                                console.log(msg);
                                displayAlertDialog(msg);
                            }

                        }).catch(function (e) {
                            var msg = 'Exception in bwCalendar.js.viewIndividualEmail_Sent():4: ' + JSON.stringify(e);
                            console.log(msg);
                            displayAlertDialog(msg);
                        });

                    }

                } catch (e) {
                    var msg = 'Exception in bwCalendar.js.viewIndividualEmail_Sent():3: ' + e.message + ', ' + e.stack;
                    console.log(msg);
                    displayAlertDialog(msg);
                }

            }).catch(function (e) {
                var msg = 'Exception in bwCalendar.js.viewIndividualEmail_Sent():2: ' + JSON.stringify(e);
                console.log(msg);
                displayAlertDialog(msg);
            });

        } catch (e) {
            var msg = 'Exception in bwCalendar.js.viewIndividualEmail_Sent(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ': ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
        }

    },
    loadIndividualEmail_Sent: function (_id) {
        var thiz = this;
        return new Promise(function (resolve, reject) {
            try {
                console.log('In bwCalendar.js.loadIndividualEmail_Sent(). _id: ' + _id);
                //alert('In bwCalendar.js.loadIndividualEmail_Sent(). _id: ' + _id);

                var hasBeenLoaded;
                for (var i = 0; i < thiz.options.Sent.docs.length; i++) {
                    if (thiz.options.Sent.docs[i]._id == _id) {

                        if (thiz.options.Sent.docs[i].html) {
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

                        var msg = 'Error in bwCalendar.js.loadIndividualEmail_Sent(): Invalid value. Expected values for workflowAppId: ' + workflowAppId + ', participantId: ' + participantId + ', _id: ' + _id;
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
                            url: thiz.options.operationUriPrefix + "_bw/getsingleparticipantemail_sent",
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

                                        var msg = 'Error in bwCalendar.js.loadIndividualEmail_Sent():xcx542: results: ' + JSON.stringify(results);
                                        console.log(msg);

                                        var result = {
                                            status: 'ERROR',
                                            message: msg
                                        }
                                        reject(result);

                                    } else {

                                        if (!results.doc) {

                                            console.log('xcx2131234-1 NO RESULTS!!!! results.doc: ' + JSON.stringify(results.doc) + ', data: ' + JSON.stringify(data));
                                            alert('xcx2131234-1 NO RESULTS!!!! results.doc: ' + JSON.stringify(results.doc) + ', data: ' + JSON.stringify(data));

                                        } else {

                                            var foundIt;
                                            for (var i = 0; i < thiz.options.Sent.docs.length; i++) {
                                                if (thiz.options.Sent.docs[i]._id == _id) {

                                                    thiz.options.Sent.docs[i] = results.doc; // This is where we load the entire email into the mailbox.
                                                    foundIt = true;

                                                }
                                            }

                                            if (!foundIt) {

                                                var msg = 'Error in bwCalendar.js.loadIndividualEmail_Sent():xcx231312: Could not find the email with _id: ' + _id;
                                                console.log(msg);

                                                var result = {
                                                    status: 'ERROR',
                                                    message: msg
                                                }
                                                reject(result);

                                            } else {

                                                var result = {
                                                    status: 'SUCCESS',
                                                    message: 'The email contents have added to the mailbox so that it available to be viewed.'
                                                }
                                                resolve(result);

                                            }

                                        }

                                    }

                                } catch (e) {

                                    var msg = 'Exception in bwCalendar.js.loadIndividualEmail_Sent():2: ' + e.message + ', ' + e.stack;
                                    console.log(msg);

                                    var result = {
                                        status: 'EXCEPTION',
                                        message: msg
                                    }
                                    reject(result);

                                }
                            },
                            error: function (data, errorCode, errorMessage) {

                                var msg = 'Error in bwCalendar.js.loadIndividualEmail_Sent():' + errorCode + ', ' + errorMessage;
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

                var msg = 'Exception in bwCalendar.js.loadIndividualEmail_Sent():xcx453: ' + e.message + ', ' + e.stack;

                var result = {
                    status: 'EXCEPTION',
                    message: msg
                }
                reject(result);

            }

        })
    },

    // Drafts methods.
    loadAndRenderEmails_Drafts: function (bwWorkflowAppId) {
        try {
            console.log('In bwCalendar.js.loadAndRenderEmails_Drafts(). bwWorkflowAppId: ' + bwWorkflowAppId);
            //alert('In bwCalendar.js.loadAndRenderEmails_Drafts(). bwWorkflowAppId: ' + bwWorkflowAppId);
            var thiz = this;

            $(thiz.element).find('#tableEmailPicker tr').remove(); // Remove all the rows in the emails table/list.

            // Select the button here. 1-4-2024.
            var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
            var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

            // Step 1: Make all of the buttons un-selected.
            $('.bwCalendar:first').find('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
            });

            // Step 2: Set the specified button as the selected one.
            $('#divInnerLeftMenuButton_Drafts').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);

            // An email won't be selected until the user selects one.
            $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '<div xcx="xcx213123-2" style="font-size:25pt;color:lightgray;">SELECT A CALENDAR ITEM THAT YOU WISH TO VIEW.</div>';
            var x = document.getElementById('tdbwCalendar_RightColumn');
            x.style.verticalAlign = 'middle';
            // end: An email won't be selected until the user selects one.

            $('#bwCalendar_EmailTopButtons').html('');  // These are the top buttons when an email is displayed. Get rid of any lingering ones...

            $('#divPageContent2_Title').html('✉&nbsp;DRAFTS');

            // Display the radio button and the title.
            html = '';
            //html += '<input type="checkbox" style="transform:scale(2);" id="checkboxToggleSentEmailCheckboxes" onchange="$(\'.bwCalendar\').bwCalendar(\'toggleSentEmailCheckboxes\', this);" />&nbsp;&nbsp;';
            html += '✉ Drafts';
            $(thiz.element).find('#spanSelectedEmailType_Title')[0].innerHTML = html;
            // end: Display the radio button and the title.

            // Display the top buttons.
            var html = '';
            //html += '                           <span xcx="xcx231232-2" class="emailEditor_topbarbutton" onclick="$(\'.bwCalendar\').bwCalendar(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\');">';
            //html += '                               <img title="Delete..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx123468" />&nbsp;Delete';
            //html += '                           </span>';
            //html += '&nbsp;&nbsp;';
            html += '                           <span xcx="xcx231232-2" class="emailEditor_topbarbutton" onclick="$(\'.bwCalendar\').bwCalendar(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\', \'emptyfolder\');">';
            html += '                               <img title="Empty folder..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx23423467898">&nbsp;Empty folder';
            html += '                           </span>';
            $(thiz.element).find('#spanSelectedEmailType_TopButtons')[0].innerHTML = html;
            // end: Display the top buttons.

            var divEmailPicker = document.getElementById('divEmailPicker');

            thiz.options.divEmailPicker_scroll_ticking = false;

            $(divEmailPicker).off('scroll').scroll(function (error) {

                lastKnownScrollPosition = divEmailPicker.scrollTop; // window.scrollY;

                if (!thiz.options.divEmailPicker_scroll_ticking) {
                    window.requestAnimationFrame(() => {

                        var msg = 'The user has scrolled. divEmailPicker.scrollTop: ' + divEmailPicker.scrollTop + ', divEmailPicker.offsetHeight: ' + divEmailPicker.offsetHeight;
                        console.log(msg);
                        //displayAlertDialog(msg);

                        //
                        // Check if the 5th from the bottom is in view. If so, it is time to load more emails.
                        //
                        var elements = $('.bwemailitems');
                        var index = elements.length - 5;
                        if (index > 0) {
                            if (thiz.isScrolledIntoView(elements[index])) {
                                thiz.options.divEmailPicker_scroll_ticking = true; // Turn off scroll detection until we are done our work here.
                                thiz.getMoreRecords_Drafts();
                            }
                        }

                    });

                }
            });


            thiz.options.window_scroll_ticking = false;

            $(window).off('scroll').scroll(function (error) {

                console.log('In window.scroll.');
                //displayAlertDialog_QuickNotice('In window.scroll.');

                if (!thiz.options.window_scroll_ticking) {
                    window.requestAnimationFrame(() => {

                        //
                        // Check if the 5th from the bottom is in view. If so, it is time to load more emails.
                        // We are doing it with this window scroll event as well, because on mobile it seems the div scroll bar disappears in Chrome and doesn't alwasy scroll, as expected.
                        //
                        var elements = $('.bwemailitems');
                        var index = elements.length - 5;
                        if (index > 0) {
                            if (thiz.isScrolledIntoView(elements[index])) {
                                thiz.options.window_scroll_ticking = true; // Turn off scroll detection until we are done our work here.
                                thiz.getMoreRecords_Drafts();
                            }
                        }

                    });

                }
            });


            //
            //
            // end: divEmailPicker onscroll. This is how we know when to retrieve more emails to add to the list. This behaves like an infinite scroll. 7-20-2024.
            //
            //

            $('.bwActiveMenu').bwActiveMenu('adjustLeftSideMenu'); // This makes sure our new stretchy-left-menu redraws Ok.

            thiz.options.Drafts = null;

            thiz.getMoreRecords_Drafts(); // Get the first round of mailbox items. The scroll event listeners will call this again to get more, until they are potentially all loaded.

        } catch (e) {
            console.log('Exception in bwCalendar.js.loadAndRenderEmails_Drafts(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCalendar.js.loadAndRenderEmails_Drafts(): ' + e.message + ', ' + e.stack);
        }
    },
    getMoreRecords_Drafts: function () {
        console.log('In bwCalendar.js.getMoreRecords_Drafts().');
        //alert('In bwCalendar.js.getMoreRecords_Drafts().');
        var thiz = this;

        //
        // The user has scrolled to the bottom of the list. Get more emails and add them to the list.
        //

        //var msg = 'In xcx23213123.divEmailPicker.scroll.getMoreRequests(). divEmailPicker.scrollTop: ' + divEmailPicker.scrollTop + ', offsetHeight: ' + divEmailPicker.offsetHeight;
        var msg = 'In getMoreRecords_Drafts(). The user has scrolled to the bottom of the list. Get more emails and add them to the list.';
        console.log(msg);
        //displayAlertDialog(msg);

        var startIndex = 0;
        if (thiz.options.Drafts && thiz.options.Drafts.docs && thiz.options.Drafts.docs.length) {
            startIndex = thiz.options.Drafts.docs.length;
        }

        thiz.getAndRenderPagedEmails_Drafts(startIndex, 5)
            .then(function (results) {

                // Update the status.
                var msg = 'Displaying 1 to ' + thiz.options.Drafts.docs.length + ' of ' + thiz.options.Drafts.totalDocs + ' emails.';
                $('#spanSelectedEmailType_Status').html(msg);

                if (results.length && (results.length > 0)) {
                    startIndex += 5;
                    thiz.getAndRenderPagedEmails_Drafts(startIndex, 5)
                        .then(function (results) {

                            // Update the status.
                            var msg = 'Displaying 1 to ' + thiz.options.Drafts.docs.length + ' of ' + thiz.options.Drafts.totalDocs + ' emails.';
                            $('#spanSelectedEmailType_Status').html(msg);

                            if (results.length && (results.length > 0)) {
                                startIndex += 5;
                                thiz.getAndRenderPagedEmails_Drafts(startIndex, 5)
                                    .then(function (results) {

                                        // Update the status.
                                        var msg = 'Displaying 1 to ' + thiz.options.Drafts.docs.length + ' of ' + thiz.options.Drafts.totalDocs + ' emails.';
                                        $('#spanSelectedEmailType_Status').html(msg);

                                        if (results.length && (results.length > 0)) {
                                            startIndex += 5;
                                            thiz.getAndRenderPagedEmails_Drafts(startIndex, 5)
                                                .then(function (results) {

                                                    // Update the status.
                                                    var msg = 'Displaying 1 to ' + thiz.options.Drafts.docs.length + ' of ' + thiz.options.Drafts.totalDocs + ' emails.';
                                                    $('#spanSelectedEmailType_Status').html(msg);




                                                    //
                                                    //
                                                    // This is where we load the dataTransfer object, so that we can drag and drop emails among the email folders. 5-21-2024.
                                                    //
                                                    // 

                                                    var emailItems = document.getElementsByClassName('bwemailitems');
                                                    for (var i = startIndex; i < emailItems.length; i++) { // Add these event listeners to all of the new ones.

                                                        emailItems[i].addEventListener('dragstart', function (e) {
                                                            try {
                                                                console.log('In bwCalendar.js.loadAndRenderEmails_Drafts.dragstart().');

                                                                // Step 1: Set the opacity for all of these classes to 0.5: brushedAluminum_blue_noanimation

                                                                // Step 2: Set the opacity to 1 for these buttons. This will indicate a drop zone: Junk, Archived, TrashBin. [divInnerLeftMenuButton_Junk, divInnerLeftMenuButton_Archived, divInnerLeftMenuButton_TrashBin].

                                                                var elements1 = document.getElementsByClassName('brushedAluminum_blue_noanimation');
                                                                for (var j = 0; j < elements1.length; j++) {
                                                                    elements1[j].style.opacity = '0.2';
                                                                }

                                                                var elements1 = document.getElementsByClassName('brushedAluminum_blue');
                                                                for (var j = 0; j < elements1.length; j++) {
                                                                    elements1[j].style.opacity = '0.2';
                                                                }

                                                                document.getElementById('divInnerLeftMenuButton_Junk').style.opacity = 1.0;
                                                                document.getElementById('divInnerLeftMenuButton_Archived').style.opacity = 1.0;
                                                                document.getElementById('divInnerLeftMenuButton_TrashBin').style.opacity = 1.0;

                                                                // We have to set the _id in the dragstart event.
                                                                var _id = e.target.getAttribute('_id');
                                                                var result = {
                                                                    MailboxOrigin: 'DRAFTS',
                                                                    _id: _id
                                                                }
                                                                var result1 = JSON.stringify(result);
                                                                e.dataTransfer.setData('text/plain', result1);

                                                            } catch (e) {
                                                                var msg = 'Exception in In bwCalendar.js.loadAndRenderEmails_Drafts.dragstart(): ' + e.message + ', ' + e.stack;
                                                                console.log(msg);
                                                                alert(msg);
                                                            }
                                                        });

                                                        emailItems[i].addEventListener('dragend', function (e) {
                                                            try {
                                                                console.log('In bwCalendar.js.loadAndRenderEmails_Drafts.dragend().');

                                                                // Set the opacity for all of these classes to 1.0: [brushedAluminum_blue, brushedAluminum_blue_noanimation].

                                                                var elements1 = document.getElementsByClassName('brushedAluminum_blue_noanimation');
                                                                for (var j = 0; j < elements1.length; j++) {
                                                                    elements1[j].style.opacity = '1.0';
                                                                }

                                                                var elements1 = document.getElementsByClassName('brushedAluminum_blue');
                                                                for (var j = 0; j < elements1.length; j++) {
                                                                    elements1[j].style.opacity = '1.0';
                                                                }

                                                            } catch (e) {
                                                                var msg = 'Exception in In bwCalendar.js.loadAndRenderEmails_Drafts.dragend(): ' + e.message + ', ' + e.stack;
                                                                console.log(msg);
                                                                alert(msg);
                                                            }
                                                        });

                                                    }

                                                    thiz.options.divEmailPicker_scroll_ticking = false; // We have completed our work, now turn on the scroll detection again.

                                                }).catch(function (e) {



                                                });

                                        }


                                    }).catch(function (e) {



                                    });

                            }

                        }).catch(function (e) {



                        });

                }

            }).catch(function (e) {



            });

    },
    getAndRenderPagedEmails_Drafts: function (offset, limit) {
        var thiz = this;
        return new Promise(function (resolve, reject) {
            try {
                console.log('In bwCalendar.js.getAndRenderPagedEmails_Drafts().');
                //alert('In bwCalendar.js.getAndRenderPagedEmails_Drafts().');

                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                var data = {
                    bwParticipantId_LoggedIn: participantId,
                    bwActiveStateIdentifier: activeStateIdentifier,
                    bwWorkflowAppId_LoggedIn: workflowAppId,

                    offset: offset,
                    limit: limit
                    //bwWorkflowAppId: workflowAppId,
                    //bwParticipantId: participantId,
                };

                $.ajax({
                    url: thiz.options.operationUriPrefix + "_bw/participantemail_drafts",
                    type: 'POST',
                    data: data,
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    },
                    success: function (results) {
                        try {

                            console.log('xcx23213. These pids change. Often I get the 2 first with a pid, then the remaining 2 with another pid. This may be the round-robin behavior? pid: ' + results.pid);

                            if (results.status != 'SUCCESS') {

                                var msg = results.status + ': ' + results.message;
                                console.log(msg);
                                displayAlertDialog(msg);

                            } else {

                                if (!(thiz.options.Drafts && thiz.options.Drafts.docs && thiz.options.Drafts.docs.length)) {

                                    // The options.Drafts is empty, so just load it directly.
                                    thiz.options.Drafts = results.results;

                                } else {

                                    // The options.Drafts has some emails in it already, so load it like this.
                                    for (var i = 0; i < results.results.docs.length; i++) {
                                        thiz.options.Drafts.docs.push(results.results.docs[i]); // With pagination.
                                    }

                                    thiz.options.Drafts.totalDocs = results.results.totalDocs;
                                    thiz.options.Drafts.offset = results.results.offset;
                                    thiz.options.Drafts.limit = results.results.limit;
                                    thiz.options.Drafts.totalPages = results.results.totalPages;
                                    thiz.options.Drafts.page = results.results.page;
                                    thiz.options.Drafts.pagingCounter = results.results.pagingCounter;
                                    thiz.options.Drafts.hasPrevPage = results.results.hasPrevPage;
                                    thiz.options.Drafts.hasNextPage = results.results.hasNextPage;
                                    thiz.options.Drafts.prevPage = results.results.prevPage;
                                    thiz.options.Drafts.nextPage = results.results.nextPage;

                                }

                                if (!thiz.options.Drafts.docs.length || (thiz.options.Drafts.docs.length == 0)) {

                                    var html = '';

                                    html += '<tr><td><span style="font-size:10pt;font-weight:normal;color:black;">';
                                    html += '  There are no Draft emails.';
                                    html += '<span></td></tr>';

                                    $(thiz.element).find('#tableEmailPicker').append(html);

                                    if ($(thiz.element).find('#spanSelectedEmail') && $(thiz.element).find('#spanSelectedEmail')[0]) {
                                        $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = '';
                                    }

                                } else {

                                    var element = $(thiz.element).find('#tableEmailPicker')[0];

                                    for (var i = 0; i < results.results.docs.length; i++) {

                                        thiz.renderMailboxItemInList(results.results.docs[i], element, 'Drafts'); // Generate the email listing HTML.

                                    }

                                    thiz.resize();

                                }

                            }

                            var result = {
                                status: 'SUCCESS',
                                message: 'SUCCESS',
                                length: results.results.docs.length
                            }
                            resolve(result);

                        } catch (e) {

                            var msg = 'Exception in bwCalendar.js.getAndRenderPagedEmails_Drafts():2: ' + e.message + ', ' + e.stack;
                            console.log(msg);

                            var result = {
                                status: 'EXCEPTION',
                                message: msg
                            }
                            reject(result);

                        }

                    },
                    error: function (data, errorCode, errorMessage) {

                        var msg = 'Error in bwCalendar.js.getAndRenderPagedEmails_Drafts():1: ' + errorCode + ', ' + errorMessage;
                        console.log(msg);

                        var result = {
                            status: 'EXCEPTION',
                            message: msg
                        }
                        reject(result);

                    }

                });

            } catch (e) {

                var msg = 'Exception in bwCalendar.js.getAndRenderPagedEmails_Drafts(): ' + e.message + ', ' + e.stack;
                console.log(msg);

                var result = {
                    status: 'EXCEPTION',
                    message: msg
                }
                reject(result);

            }

        });

    },
    viewIndividualEmail_Drafts: function (originElementId, bwParticipantId, bwParticipantFriendlyName, bwParticipantEmail, _id) {
        try {
            console.log('In bwCalendar.js.viewIndividualEmail_Drafts(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ', _id: ' + _id);
            //displayAlertDialog_Persistent('In bwCalendar.js.viewIndividualEmail_Drafts(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ', _id: ' + _id);
            //alert('In bwCalendar.js.viewIndividualEmail_Drafts(). _id: ' + _id);
            var thiz = this;

            this.displayNewMessageEditorHtml().then(function (results) {
                try {
                    if (results.status != 'SUCCESS') {

                        var msg = 'Error in bwCalendar.js.viewIndividualEmail_Drafts(): ' + results.message;
                        console.log(msg);
                        displayAlertDialog(msg);

                    } else {

                        console.log('In bwCalendar.js.viewIndividualEmail_Drafts(). Successfully returned from displayNewMessageEditorHtml().');

                        thiz.loadIndividualEmail_Drafts(_id).then(function () {
                            try {

                                // Display the top buttons.
                                html = '';
                                html += '<button xcx="xcx324234667" class="BwButton200" onclick="$(\'.bwCalendar:first\').bwCalendar(\'SendSingleEmailNow\');">SEND NOW</button>'; // BwButton200ForRequestForm
                                html += '&nbsp;&nbsp;&nbsp;&nbsp;';
                                html += '<button xcx="xcx213124-1" class="BwButton200" style="color:red;font-weight:bold;" onclick="$(\'.bwCalendar:first\').bwCalendar(\'saveDraft\');">SAVE DRAFT</button>'; // BwSmallButton
                                $('#bwCalendar_EmailTopButtons').html(html);
                                // end: Display the top buttons.

                                thiz.renderIndividualEmail_Editable(_id, 'Drafts').then(function (results) { // strMailbox: ['Inbox', 'Sent', etc.]
                                    try {

                                        if (results.status != 'SUCCESS') {

                                            var msg = 'Error in bwCalendar.js.viewIndividualEmail_Drafts(): ' + results.message;
                                            console.log(msg);
                                            displayAlertDialog(msg);

                                        } else {

                                            // Done

                                        }

                                    } catch (e) {
                                        var msg = 'Exception in bwCalendar.js.viewIndividualEmail_Drafts():7: ' + e.message + ', ' + e.stack;
                                        console.log(msg);
                                        displayAlertDialog(msg);
                                    }

                                }).catch(function (e) {
                                    var msg = 'Exception in bwCalendar.js.viewIndividualEmail_Drafts():6: ' + JSON.stringify(e);
                                    console.log(msg);
                                    displayAlertDialog(msg);
                                });

                            } catch (e) {
                                console.log('Exception in bwCalendar.js.viewIndividualEmail_Drafts():4: ' + e.message + ', ' + e.stack);
                                displayAlertDialog('Exception in bwCalendar.js.viewIndividualEmail_Drafts():4: ' + e.message + ', ' + e.stack);
                            }

                        }).catch(function (e) {

                            console.log('Exception in bwCalendar.js.viewIndividualEmail_Drafts():3: ' + JSON.stringify(e));
                            displayAlertDialog('Exception in bwCalendar.js.viewIndividualEmail_Drafts():3: ' + JSON.stringify(e));

                        });

                    }

                } catch (e) {

                    var msg = 'Exception in bwCalendar.js.viewIndividualEmail_Drafts.displayNewMessageEditorHtml():2: ' + e.message + ', ' + e.stack;
                    console.log(msg);
                    displayAlertDialog(msg);

                }

            }).catch(function (e) {

                var msg = 'Exception in bwCalendar.js.viewIndividualEmail_Drafts.displayNewMessageEditorHtml(): ' + JSON.stringify(e);
                console.log(msg);
                displayAlertDialog(msg);

            });

        } catch (e) {
            var msg = 'Exception in bwCalendar.js.viewIndividualEmail_Drafts(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ': ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
        }

    },
    loadIndividualEmail_Drafts: function (_id) {
        var thiz = this;
        return new Promise(function (resolve, reject) {
            try {
                console.log('In bwCalendar.js.loadIndividualEmail_Drafts(). _id: ' + _id);
                //displayAlertDialog_Persistent('In bwCalendar.js.loadIndividualEmail_Drafts(). _id: ' + _id);

                var hasBeenLoaded;
                for (var i = 0; i < thiz.options.Drafts.length; i++) {
                    if (thiz.options.Drafts[i]._id == _id) {

                        if (thiz.options.Drafts[i].html) {
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

                        var msg = 'Error in bwCalendar.js.loadIndividualEmail_Drafts(): Invalid value. Expected values for workflowAppId: ' + workflowAppId + ', participantId: ' + participantId + ', _id: ' + _id;
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
                            url: thiz.options.operationUriPrefix + "_bw/getsingleparticipantemail_drafts",
                            type: "POST",
                            data: data,
                            headers: {
                                "Accept": "application/json; odata=verbose"
                            },
                            success: function (results) {
                                try {

                                    if (results.status != 'SUCCESS') {

                                        var msg = 'Error in bwCalendar.js.loadIndividualEmail_Drafts():xcx542: results: ' + JSON.stringify(results);
                                        console.log(msg);

                                        var result = {
                                            status: 'ERROR',
                                            message: msg
                                        }
                                        reject(result);

                                    } else {

                                        if (!results.doc) {

                                            console.log('xcx2131234-1 NO RESULTS!!!! results.doc: ' + JSON.stringify(results.doc) + ', data: ' + JSON.stringify(data));
                                            alert('xcx2131234-1 NO RESULTS!!!! results.doc: ' + JSON.stringify(results.doc) + ', data: ' + JSON.stringify(data));

                                        } else {

                                            var foundIt;
                                            for (var i = 0; i < thiz.options.Drafts.docs.length; i++) {
                                                if (thiz.options.Drafts.docs[i]._id == _id) {

                                                    thiz.options.Drafts.docs[i] = results.doc; // This is where we load the entire email into the mailbox.
                                                    foundIt = true;

                                                }
                                            }

                                            if (!foundIt) {

                                                var msg = 'Error in bwCalendar.js.loadIndividualEmail_Drafts():xcx231312: Could not find the email.';
                                                console.log(msg);

                                                var result = {
                                                    status: 'ERROR',
                                                    message: msg
                                                }
                                                reject(result);

                                            } else {

                                                var result = {
                                                    status: 'SUCCESS',
                                                    message: 'The email contents have added to the mailbox so that it available to be viewed.'
                                                }
                                                resolve(result);

                                            }

                                        }

                                    }

                                } catch (e) {

                                    var msg = 'Exception in bwCalendar.js.loadIndividualEmail_Drafts():2: ' + e.message + ', ' + e.stack;
                                    console.log(msg);

                                    var result = {
                                        status: 'EXCEPTION',
                                        message: msg
                                    }
                                    reject(result);

                                }
                            },
                            error: function (data, errorCode, errorMessage) {

                                var msg = 'Error in bwCalendar.js.loadIndividualEmail_Drafts():' + errorCode + ', ' + errorMessage;
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

                var msg = 'Exception in bwCalendar.js.loadIndividualEmail_Drafts():xcx453: ' + e.message + ', ' + e.stack;

                var result = {
                    status: 'EXCEPTION',
                    message: msg
                }
                reject(result);

            }

        })
    },

    // Junk methods.
    loadAndRenderEmails_Junk: function (bwWorkflowAppId) {
        try {
            console.log('In bwCalendar.js.loadAndRenderEmails_Junk().');
            //alert('In bwCalendar.js.loadAndRenderEmails_Junk().');
            var thiz = this;

            $(thiz.element).find('#tableEmailPicker tr').remove(); // Remove all the rows in the emails table/list.

            // Select the button here. 1-4-2024.
            var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
            var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

            // Step 1: Make all of the buttons un-selected.
            $('.bwCalendar:first').find('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
            });

            // Step 2: Set the specified button as the selected one.
            $('#divInnerLeftMenuButton_Junk').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);

            // An email won't be selected until the user selects one.
            $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '<div xcx="xcx213123-2" style="font-size:25pt;color:lightgray;">SELECT A CALENDAR ITEM THAT YOU WISH TO VIEW.</div>';
            var x = document.getElementById('tdbwCalendar_RightColumn');
            x.style.verticalAlign = 'middle';
            // end: An email won't be selected until the user selects one.

            $('#bwCalendar_EmailTopButtons').html('');  // These are the top buttons when an email is displayed. Get rid of any lingering ones...

            $('#divPageContent2_Title').html('✉&nbsp;JUNK');

            // Display the radio button and the title.
            html = '';
            //html += '<input type="checkbox" style="transform:scale(2);" id="checkboxToggleSentEmailCheckboxes" onchange="$(\'.bwCalendar\').bwCalendar(\'toggleSentEmailCheckboxes\', this);" />&nbsp;&nbsp;';
            html += '✉ Junk Items';
            $(thiz.element).find('#spanSelectedEmailType_Title')[0].innerHTML = html; //'Sent Email';
            // end: Display the radio button and the title.

            // Display the top buttons.
            var html = '';
            html += '                           <span xcx="xcx231232-2" class="emailEditor_topbarbutton" onclick="$(\'.bwCalendar\').bwCalendar(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\');">';
            html += '                               <img title="Delete..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx123468" />&nbsp;Delete';
            html += '                           </span>';
            html += '&nbsp;&nbsp;';
            html += '                           <span xcx="xcx231232-2" class="emailEditor_topbarbutton" onclick="$(\'.bwCalendar\').bwCalendar(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\', \'emptyfolder\');">';
            html += '                               <img title="Empty folder..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx23423467898">&nbsp;Empty folder';
            html += '                           </span>';
            $(thiz.element).find('#spanSelectedEmailType_TopButtons')[0].innerHTML = html;
            // end: Display the top buttons.

            var divEmailPicker = document.getElementById('divEmailPicker');

            thiz.options.divEmailPicker_scroll_ticking = false;

            $(divEmailPicker).off('scroll').scroll(function (error) {

                lastKnownScrollPosition = divEmailPicker.scrollTop; // window.scrollY;

                if (!thiz.options.divEmailPicker_scroll_ticking) {
                    window.requestAnimationFrame(() => {

                        var msg = 'The user has scrolled. divEmailPicker.scrollTop: ' + divEmailPicker.scrollTop + ', divEmailPicker.offsetHeight: ' + divEmailPicker.offsetHeight;
                        console.log(msg);
                        //displayAlertDialog(msg);

                        //
                        // Check if the 5th from the bottom is in view. If so, it is time to load more emails.
                        //
                        var elements = $('.bwemailitems');
                        var index = elements.length - 5;
                        if (index > 0) {
                            if (thiz.isScrolledIntoView(elements[index])) {
                                thiz.options.divEmailPicker_scroll_ticking = true; // Turn off scroll detection until we are done our work here.
                                thiz.getMoreRecords_Junk();
                            }
                        }

                    });

                }
            });


            thiz.options.window_scroll_ticking = false;

            $(window).off('scroll').scroll(function (error) {

                console.log('In window.scroll.');
                //displayAlertDialog_QuickNotice('In window.scroll.');

                if (!thiz.options.window_scroll_ticking) {
                    window.requestAnimationFrame(() => {

                        //
                        // Check if the 5th from the bottom is in view. If so, it is time to load more emails.
                        // We are doing it with this window scroll event as well, because on mobile it seems the div scroll bar disappears in Chrome and doesn't alwasy scroll, as expected.
                        //
                        var elements = $('.bwemailitems');
                        var index = elements.length - 5;
                        if (index > 0) {
                            if (thiz.isScrolledIntoView(elements[index])) {
                                thiz.options.window_scroll_ticking = true; // Turn off scroll detection until we are done our work here.
                                thiz.getMoreRecords_Junk();
                            }
                        }

                    });

                }
            });

            //
            //
            // end: divEmailPicker onscroll. This is how we know when to retrieve more emails to add to the list. This behaves like an infinite scroll. 7-20-2024.
            //
            //

            $('.bwActiveMenu').bwActiveMenu('adjustLeftSideMenu'); // This makes sure our new stretchy-left-menu redraws Ok.

            thiz.options.Junk = null;

            thiz.getMoreRecords_Junk(); // Get the first round of mailbox items. The scroll event listeners will call this again to get more, until they are potentially all loaded.

        } catch (e) {
            console.log('Exception in bwCalendar.js.loadAndRenderEmails_Junk(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCalendar.js.loadAndRenderEmails_Junk(): ' + e.message + ', ' + e.stack);
        }
    },
    getMoreRecords_Junk: function () {
        console.log('In bwCalendar.js.getMoreRecords_Junk().');
        //alert('In bwCalendar.js.getMoreRecords_Junk().');
        var thiz = this;

        //
        // The user has scrolled to the bottom of the list. Get more emails and add them to the list.
        //

        //var msg = 'In xcx23213123.divEmailPicker.scroll.getMoreRequests(). divEmailPicker.scrollTop: ' + divEmailPicker.scrollTop + ', offsetHeight: ' + divEmailPicker.offsetHeight;
        var msg = 'In getMoreRecords_Junk(). The user has scrolled to the bottom of the list. Get more emails and add them to the list.';
        console.log(msg);
        //displayAlertDialog(msg);

        var startIndex = 0;
        if (thiz.options.Junk && thiz.options.Junk.docs && thiz.options.Junk.docs.length) {
            startIndex = thiz.options.Junk.docs.length;
        }

        thiz.getAndRenderPagedEmails_Junk(startIndex, 5)
            .then(function (results) {

                // Update the status.
                var msg = 'Displaying 1 to ' + thiz.options.Junk.docs.length + ' of ' + thiz.options.Junk.totalDocs + ' emails.';
                $('#spanSelectedEmailType_Status').html(msg);

                if (results.length && (results.length > 0)) {
                    startIndex += 5;
                    thiz.getAndRenderPagedEmails_Junk(startIndex, 5)
                        .then(function (results) {

                            // Update the status.
                            var msg = 'Displaying 1 to ' + thiz.options.Junk.docs.length + ' of ' + thiz.options.Junk.totalDocs + ' emails.';
                            $('#spanSelectedEmailType_Status').html(msg);

                            if (results.length && (results.length > 0)) {
                                startIndex += 5;
                                thiz.getAndRenderPagedEmails_Junk(startIndex, 5)
                                    .then(function (results) {

                                        // Update the status.
                                        var msg = 'Displaying 1 to ' + thiz.options.Junk.docs.length + ' of ' + thiz.options.Junk.totalDocs + ' emails.';
                                        $('#spanSelectedEmailType_Status').html(msg);

                                        if (results.length && (results.length > 0)) {
                                            startIndex += 5;
                                            thiz.getAndRenderPagedEmails_Junk(startIndex, 5)
                                                .then(function (results) {

                                                    // Update the status.
                                                    var msg = 'Displaying 1 to ' + thiz.options.Junk.docs.length + ' of ' + thiz.options.Junk.totalDocs + ' emails.';
                                                    $('#spanSelectedEmailType_Status').html(msg);

                                                    //
                                                    //
                                                    // This is where we load the dataTransfer object, so that we can drag and drop emails among the email folders. 5-21-2024.
                                                    //
                                                    // 

                                                    var emailItems = document.getElementsByClassName('bwemailitems');
                                                    for (var i = startIndex; i < emailItems.length; i++) { // Add these event listeners to all of the new ones.

                                                        emailItems[i].addEventListener('dragstart', function (e) {
                                                            try {
                                                                console.log('In bwCalendar.js.loadAndRenderEmails_Junk.dragstart().');

                                                                // Step 1: Set the opacity for all of these classes to 0.5: brushedAluminum_blue_noanimation

                                                                // Step 2: Set the opacity to 1 for these buttons. This will indicate a drop zone: Junk, Archived, TrashBin. [divInnerLeftMenuButton_Junk, divInnerLeftMenuButton_Archived, divInnerLeftMenuButton_TrashBin].

                                                                var elements1 = document.getElementsByClassName('brushedAluminum_blue_noanimation');
                                                                for (var j = 0; j < elements1.length; j++) {
                                                                    elements1[j].style.opacity = '0.2';
                                                                }

                                                                var elements1 = document.getElementsByClassName('brushedAluminum_blue');
                                                                for (var j = 0; j < elements1.length; j++) {
                                                                    elements1[j].style.opacity = '0.2';
                                                                }

                                                                document.getElementById('divInnerLeftMenuButton_Junk').style.opacity = 1.0;
                                                                document.getElementById('divInnerLeftMenuButton_Archived').style.opacity = 1.0;
                                                                document.getElementById('divInnerLeftMenuButton_TrashBin').style.opacity = 1.0;

                                                                // We have to set the _id in the dragstart event.
                                                                var _id = e.target.getAttribute('_id');
                                                                var result = {
                                                                    MailboxOrigin: 'JUNK',
                                                                    _id: _id
                                                                }
                                                                var result1 = JSON.stringify(result);
                                                                e.dataTransfer.setData('text/plain', result1);

                                                            } catch (e) {
                                                                var msg = 'Exception in In bwCalendar.js.loadAndRenderEmails_Junk.dragstart(): ' + e.message + ', ' + e.stack;
                                                                console.log(msg);
                                                                alert(msg);
                                                            }
                                                        });

                                                        emailItems[i].addEventListener('dragend', function (e) {
                                                            try {
                                                                console.log('In bwCalendar.js.loadAndRenderEmails_Junk.dragend().');

                                                                // Set the opacity for all of these classes to 1.0: [brushedAluminum_blue, brushedAluminum_blue_noanimation].

                                                                var elements1 = document.getElementsByClassName('brushedAluminum_blue_noanimation');
                                                                for (var j = 0; j < elements1.length; j++) {
                                                                    elements1[j].style.opacity = '1.0';
                                                                }

                                                                var elements1 = document.getElementsByClassName('brushedAluminum_blue');
                                                                for (var j = 0; j < elements1.length; j++) {
                                                                    elements1[j].style.opacity = '1.0';
                                                                }

                                                            } catch (e) {
                                                                var msg = 'Exception in In bwCalendar.js.loadAndRenderEmails_Junk.dragend(): ' + e.message + ', ' + e.stack;
                                                                console.log(msg);
                                                                alert(msg);
                                                            }
                                                        });

                                                    }

                                                    thiz.options.divEmailPicker_scroll_ticking = false; // We have completed our work, now turn on the scroll detection again.

                                                }).catch(function (e) {



                                                });

                                        }


                                    }).catch(function (e) {



                                    });

                            }

                        }).catch(function (e) {



                        });

                }

            }).catch(function (e) {



            });

    },
    getAndRenderPagedEmails_Junk: function (offset, limit) {
        var thiz = this;
        return new Promise(function (resolve, reject) {
            try {
                console.log('In bwCalendar.js.getAndRenderPagedEmails_Junk().');
                //alert('In bwCalendar.js.getAndRenderPagedEmails_Junk().');

                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                var data = {
                    bwParticipantId_LoggedIn: participantId,
                    bwActiveStateIdentifier: activeStateIdentifier,
                    bwWorkflowAppId_LoggedIn: workflowAppId,

                    offset: offset,
                    limit: limit
                    //bwWorkflowAppId: workflowAppId,
                    //bwParticipantId: participantId,
                };

                $.ajax({
                    url: thiz.options.operationUriPrefix + "_bw/participantemail_junk",
                    type: 'POST',
                    data: data,
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    },
                    success: function (results) {
                        try {

                            console.log('xcx23213. These pids change. Often I get the 2 first with a pid, then the remaining 2 with another pid. This may be the round-robin behavior? pid: ' + results.pid);

                            if (results.status != 'SUCCESS') {

                                var msg = results.status + ': ' + results.message;
                                console.log(msg);
                                displayAlertDialog(msg);

                            } else {

                                if (!(thiz.options.Junk && thiz.options.Junk.docs && thiz.options.Junk.docs.length)) {

                                    // The options.Junk is empty, so just load it directly.
                                    thiz.options.Junk = results.results;

                                } else {

                                    // The options.Junk has some emails in it already, so load it like this.
                                    for (var i = 0; i < results.results.docs.length; i++) {
                                        thiz.options.Junk.docs.push(results.results.docs[i]); // With pagination.
                                    }

                                    thiz.options.Junk.totalDocs = results.results.totalDocs;
                                    thiz.options.Junk.offset = results.results.offset;
                                    thiz.options.Junk.limit = results.results.limit;
                                    thiz.options.Junk.totalPages = results.results.totalPages;
                                    thiz.options.Junk.page = results.results.page;
                                    thiz.options.Junk.pagingCounter = results.results.pagingCounter;
                                    thiz.options.Junk.hasPrevPage = results.results.hasPrevPage;
                                    thiz.options.Junk.hasNextPage = results.results.hasNextPage;
                                    thiz.options.Junk.prevPage = results.results.prevPage;
                                    thiz.options.Junk.nextPage = results.results.nextPage;

                                }

                                if (!thiz.options.Junk.docs.length || thiz.options.Junk.docs.length == 0) {

                                    var html = '';

                                    html += '<tr><td><span style="font-size:10pt;font-weight:normal;color:black;">';
                                    html += '  There are no Junk emails.';
                                    html += '<span></td></tr>';

                                    $(thiz.element).find('#tableEmailPicker').append(html);

                                    if ($(thiz.element).find('#spanSelectedEmail') && $(thiz.element).find('#spanSelectedEmail')[0]) {
                                        $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = '';
                                    }

                                } else {

                                    var element = $(thiz.element).find('#tableEmailPicker')[0];

                                    for (var i = 0; i < results.results.docs.length; i++) {

                                        thiz.renderMailboxItemInList(results.results.docs[i], element, 'Junk'); // Generate the email listing HTML.

                                    }

                                    thiz.resize();

                                }

                            }

                            var result = {
                                status: 'SUCCESS',
                                message: 'SUCCESS',
                                length: results.results.docs.length
                            }
                            resolve(result);

                        } catch (e) {

                            var msg = 'Exception in bwCalendar.js.getAndRenderPagedEmails_Junk():2: ' + e.message + ', ' + e.stack;
                            console.log(msg);

                            var result = {
                                status: 'EXCEPTION',
                                message: msg
                            }
                            reject(result);

                        }

                    },
                    error: function (data, errorCode, errorMessage) {

                        var msg = 'Error in bwCalendar.js.getAndRenderPagedEmails_Junk():1: ' + errorCode + ', ' + errorMessage;
                        console.log(msg);

                        var result = {
                            status: 'EXCEPTION',
                            message: msg
                        }
                        reject(result);

                    }

                });

            } catch (e) {

                var msg = 'Exception in bwCalendar.js.getAndRenderPagedEmails_Junk(): ' + e.message + ', ' + e.stack;
                console.log(msg);

                var result = {
                    status: 'EXCEPTION',
                    message: msg
                }
                reject(result);

            }

        });

    },
    viewIndividualEmail_Junk: function (originElementId, bwParticipantId, bwParticipantFriendlyName, bwParticipantEmail, _id) {
        try {
            console.log('In bwCalendar.js.viewIndividualEmail_Junk(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ', _id: ' + _id);
            //displayAlertDialog_Persistent('In bwCalendar.js.viewIndividualEmail_Junk(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ', _id: ' + _id);
            //alert('In bwCalendar.js.viewIndividualEmail_Junk(). _id: ' + _id);
            var thiz = this;

            this.displayNewMessageEditorHtml().then(function (results) {
                try {
                    if (results.status != 'SUCCESS') {

                        var msg = 'Error in bwCalendar.js.viewIndividualEmail_Junk(): ' + results.message;
                        console.log(msg);
                        displayAlertDialog(msg);

                    } else {

                        console.log('In bwCalendar.js.viewIndividualEmail_Junk(). Successfully returned from displayNewMessageEditorHtml().');

                        thiz.loadIndividualEmail_Junk(_id).then(function () {
                            try {

                                // Display the top buttons.
                                html = '';
                                html += '<button xcx="xcx324234667" class="BwButton200" onclick="$(\'.bwCalendar:first\').bwCalendar(\'SendSingleEmailNow\');">SEND NOW</button>'; // BwButton200ForRequestForm
                                html += '&nbsp;&nbsp;&nbsp;&nbsp;';
                                html += '<button xcx="xcx213124-1" class="BwButton200" style="color:red;font-weight:bold;" onclick="$(\'.bwCalendar:first\').bwCalendar(\'saveDraft\');">SAVE DRAFT</button>'; // BwSmallButton
                                $('#bwCalendar_EmailTopButtons').html(html);
                                // end: Display the top buttons.

                                thiz.renderIndividualEmail_Editable(_id, 'Junk').then(function (results) { // strMailbox: ['Inbox', 'Sent', etc.]
                                    try {

                                        if (results.status != 'SUCCESS') {

                                            var msg = 'Error in bwCalendar.js.viewIndividualEmail_Junk(): ' + results.message;
                                            console.log(msg);
                                            displayAlertDialog(msg);

                                        } else {

                                            // Done

                                        }

                                    } catch (e) {
                                        var msg = 'Exception in bwCalendar.js.viewIndividualEmail_Junk():7: ' + e.message + ', ' + e.stack;
                                        console.log(msg);
                                        displayAlertDialog(msg);
                                    }

                                }).catch(function (e) {
                                    var msg = 'Exception in bwCalendar.js.viewIndividualEmail_Junk():6: ' + JSON.stringify(e);
                                    console.log(msg);
                                    displayAlertDialog(msg);
                                });

                            } catch (e) {
                                console.log('Exception in bwCalendar.js.viewIndividualEmail_Junk():4: ' + e.message + ', ' + e.stack);
                                displayAlertDialog('Exception in bwCalendar.js.viewIndividualEmail_Junk():4: ' + e.message + ', ' + e.stack);
                            }

                        }).catch(function (e) {

                            console.log('Exception in bwCalendar.js.viewIndividualEmail_Junk():3: ' + JSON.stringify(e));
                            displayAlertDialog('Exception in bwCalendar.js.viewIndividualEmail_Junk():3: ' + JSON.stringify(e));

                        });

                    }

                } catch (e) {

                    var msg = 'Exception in bwCalendar.js.viewIndividualEmail_Junk.displayNewMessageEditorHtml():2: ' + e.message + ', ' + e.stack;
                    console.log(msg);
                    displayAlertDialog(msg);

                }

            }).catch(function (e) {

                var msg = 'Exception in bwCalendar.js.viewIndividualEmail_Junk.displayNewMessageEditorHtml(): ' + JSON.stringify(e);
                console.log(msg);
                displayAlertDialog(msg);

            });

        } catch (e) {
            var msg = 'Exception in bwCalendar.js.viewIndividualEmail_Junk(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ': ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
        }
    },
    loadIndividualEmail_Junk: function (_id) {
        var thiz = this;
        return new Promise(function (resolve, reject) {
            try {
                console.log('In bwCalendar.js.loadIndividualEmail_Junk(). _id: ' + _id);
                //alert('In bwCalendar.js.loadIndividualEmail_Junk(). _id: ' + _id);

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

                        var msg = 'Error in bwCalendar.js.loadIndividualEmail_Junk(): Invalid value. Expected values for workflowAppId: ' + workflowAppId + ', participantId: ' + participantId + ', _id: ' + _id;
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
                            url: thiz.options.operationUriPrefix + "_bw/getsingleparticipantemail_junk",
                            type: 'POST',
                            data: data,
                            headers: {
                                "Accept": "application/json; odata=verbose"
                            },
                            success: function (results) {
                                try {
                                    //displayAlertDialog_Persistent('xcx2331234 RESPONSE FROM SERVER FOR getsingleparticipantemail_inbox. status: ' + results.status + ', message: ' + results.message);
                                    if (results.status != 'SUCCESS') {

                                        //thiz.element.html(''); // This actually works to get rid of the widget. Ha! 11-8-2023.

                                        var msg = 'Error in bwCalendar.js.loadIndividualEmail_Junk():xcx542: results: ' + JSON.stringify(results);
                                        console.log(msg);

                                        var result = {
                                            status: 'ERROR',
                                            message: msg
                                        }
                                        reject(result);

                                    } else {

                                        if (!results.doc) {

                                            console.log('xcx2131234-1 NO RESULTS!!!! results.doc: ' + JSON.stringify(results.doc) + ', data: ' + JSON.stringify(data));
                                            alert('xcx2131234-1 NO RESULTS!!!! results.doc: ' + JSON.stringify(results.doc) + ', data: ' + JSON.stringify(data));

                                        } else {

                                            var foundIt;
                                            for (var i = 0; i < thiz.options.Junk.docs.length; i++) {
                                                if (thiz.options.Junk.docs[i]._id == _id) {

                                                    thiz.options.Junk.docs[i] = results.doc; // This is where we load the entire email into the mailbox.
                                                    foundIt = true;

                                                }
                                            }

                                            if (!foundIt) {

                                                var msg = 'Error in bwCalendar.js.loadIndividualEmail_Junk():xcx231312-1: Could not find the email with _id: ' + _id;
                                                console.log(msg);

                                                var result = {
                                                    status: 'ERROR',
                                                    message: msg
                                                }
                                                reject(result);

                                            } else {

                                                var result = {
                                                    status: 'SUCCESS',
                                                    message: 'The email contents have added to the mailbox so that it available to be viewed.'
                                                }
                                                resolve(result);

                                            }

                                        }

                                    }

                                } catch (e) {

                                    var msg = 'Exception in bwCalendar.js.loadIndividualEmail_Junk():2: ' + e.message + ', ' + e.stack;
                                    console.log(msg);

                                    var result = {
                                        status: 'EXCEPTION',
                                        message: msg
                                    }
                                    reject(result);

                                }
                            },
                            error: function (data, errorCode, errorMessage) {

                                var msg = 'Error in bwCalendar.js.loadIndividualEmail_Junk():' + errorCode + ', ' + errorMessage;
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

                var msg = 'Exception in bwCalendar.js.loadIndividualEmail_Junk():xcx453: ' + e.message + ', ' + e.stack;

                var result = {
                    status: 'EXCEPTION',
                    message: msg
                }
                reject(result);

            }

        })
    },

    // Archived methods.
    loadAndRenderEmails_Archived: function (bwWorkflowAppId) {
        try {
            console.log('In bwCalendar.js.loadAndRenderEmails_Archived().');
            //alert('In bwCalendar.js.loadAndRenderEmails_Archived().');
            var thiz = this;

            $(thiz.element).find('#tableEmailPicker tr').remove(); // Remove all the rows in the emails table/list.

            // Select the button here. 1-4-2024.
            var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
            var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

            // Step 1: Make all of the buttons un-selected.
            $('.bwCalendar:first').find('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
            });

            // Step 2: Set the specified button as the selected one.
            $('#divInnerLeftMenuButton_Archived').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);

            // An email won't be selected until the user selects one.
            $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '<div xcx="xcx213123-2" style="font-size:25pt;color:lightgray;">SELECT A CALENDAR ITEM THAT YOU WISH TO VIEW.</div>';
            var x = document.getElementById('tdbwCalendar_RightColumn');
            x.style.verticalAlign = 'middle';
            // end: An email won't be selected until the user selects one.

            $('#bwCalendar_EmailTopButtons').html('');  // These are the top buttons when an email is displayed. Get rid of any lingering ones...

            $('#divPageContent2_Title').html('✉&nbsp;ARCHIVED');

            // Display the radio button and the title.
            html = '';
            //html += '<input type="checkbox" style="transform:scale(2);" id="checkboxToggleSentEmailCheckboxes" onchange="$(\'.bwCalendar\').bwCalendar(\'toggleSentEmailCheckboxes\', this);" />&nbsp;&nbsp;';
            html += '✉ Archived Items';
            $(thiz.element).find('#spanSelectedEmailType_Title')[0].innerHTML = html; //'Sent Email';
            // end: Display the radio button and the title.

            // Display the top buttons.
            var html = '';
            html += '                           <span xcx="xcx231232-2" class="emailEditor_topbarbutton" onclick="$(\'.bwCalendar\').bwCalendar(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\');">';
            html += '                               <img title="Delete..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx123468" />&nbsp;Delete';
            html += '                           </span>';
            html += '&nbsp;&nbsp;';
            html += '                           <span xcx="xcx231232-2" class="emailEditor_topbarbutton" onclick="$(\'.bwCalendar\').bwCalendar(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\', \'emptyfolder\');">';
            html += '                               <img title="Empty folder..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx23423467898">&nbsp;Empty folder';
            html += '                           </span>';
            $(thiz.element).find('#spanSelectedEmailType_TopButtons')[0].innerHTML = html;
            // end: Display the top buttons.

            var divEmailPicker = document.getElementById('divEmailPicker');

            thiz.options.divEmailPicker_scroll_ticking = false;

            $(divEmailPicker).off('scroll').scroll(function (error) {

                lastKnownScrollPosition = divEmailPicker.scrollTop; // window.scrollY;

                if (!thiz.options.divEmailPicker_scroll_ticking) {
                    window.requestAnimationFrame(() => {

                        var msg = 'The user has scrolled. divEmailPicker.scrollTop: ' + divEmailPicker.scrollTop + ', divEmailPicker.offsetHeight: ' + divEmailPicker.offsetHeight;
                        console.log(msg);
                        //displayAlertDialog(msg);

                        //
                        // Check if the 5th from the bottom is in view. If so, it is time to load more emails.
                        //
                        var elements = $('.bwemailitems');
                        var index = elements.length - 5;
                        if (index > 0) {
                            if (thiz.isScrolledIntoView(elements[index])) {
                                thiz.options.divEmailPicker_scroll_ticking = true; // Turn off scroll detection until we are done our work here.
                                thiz.getMoreRecords_Archived();
                            }
                        }

                    });

                }
            });


            thiz.options.window_scroll_ticking = false;

            $(window).off('scroll').scroll(function (error) {

                console.log('In window.scroll.');
                //displayAlertDialog_QuickNotice('In window.scroll.');

                if (!thiz.options.window_scroll_ticking) {
                    window.requestAnimationFrame(() => {

                        //
                        // Check if the 5th from the bottom is in view. If so, it is time to load more emails.
                        // We are doing it with this window scroll event as well, because on mobile it seems the div scroll bar disappears in Chrome and doesn't alwasy scroll, as expected.
                        //
                        var elements = $('.bwemailitems');
                        var index = elements.length - 5;
                        if (index > 0) {
                            if (thiz.isScrolledIntoView(elements[index])) {
                                thiz.options.window_scroll_ticking = true; // Turn off scroll detection until we are done our work here.
                                thiz.getMoreRecords_Archived();
                            }
                        }

                    });

                }
            });

            //
            //
            // end: divEmailPicker onscroll. This is how we know when to retrieve more emails to add to the list. This behaves like an infinite scroll. 7-20-2024.
            //
            //

            $('.bwActiveMenu').bwActiveMenu('adjustLeftSideMenu'); // This makes sure our new stretchy-left-menu redraws Ok.

            thiz.options.Archived = null;

            thiz.getMoreRecords_Archived(); // Get the first round of mailbox items. The scroll event listeners will call this again to get more, until they are potentially all loaded.

        } catch (e) {
            console.log('Exception in bwCalendar.js.loadAndRenderEmails_Archived(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCalendar.js.loadAndRenderEmails_Archived(): ' + e.message + ', ' + e.stack);
        }
    },
    getMoreRecords_Archived: function () {
        console.log('In bwCalendar.js.getMoreRecords_Archived().');
        //alert('In bwCalendar.js.getMoreRecords_Archived().');
        var thiz = this;

        //
        // The user has scrolled to the bottom of the list. Get more emails and add them to the list.
        //

        //var msg = 'In xcx23213123.divEmailPicker.scroll.getMoreRequests(). divEmailPicker.scrollTop: ' + divEmailPicker.scrollTop + ', offsetHeight: ' + divEmailPicker.offsetHeight;
        var msg = 'In getMoreRecords_Archived(). The user has scrolled to the bottom of the list. Get more emails and add them to the list.';
        console.log(msg);
        //displayAlertDialog(msg);

        var startIndex = 0;
        if (thiz.options.Archived && thiz.options.Archived.docs && thiz.options.Archived.docs.length) {
            startIndex = thiz.options.Archived.docs.length;
        }

        thiz.getAndRenderPagedEmails_Archived(startIndex, 5)
            .then(function (results) {

                // Update the status.
                var msg = 'Displaying 1 to ' + thiz.options.Archived.docs.length + ' of ' + thiz.options.Archived.totalDocs + ' emails.';
                $('#spanSelectedEmailType_Status').html(msg);

                if (results.length && (results.length > 0)) {
                    startIndex += 5;
                    thiz.getAndRenderPagedEmails_Archived(startIndex, 5)
                        .then(function (results) {

                            // Update the status.
                            var msg = 'Displaying 1 to ' + thiz.options.Archived.docs.length + ' of ' + thiz.options.Archived.totalDocs + ' emails.';
                            $('#spanSelectedEmailType_Status').html(msg);

                            if (results.length && (results.length > 0)) {
                                startIndex += 5;
                                thiz.getAndRenderPagedEmails_Archived(startIndex, 5)
                                    .then(function (results) {

                                        // Update the status.
                                        var msg = 'Displaying 1 to ' + thiz.options.Archived.docs.length + ' of ' + thiz.options.Archived.totalDocs + ' emails.';
                                        $('#spanSelectedEmailType_Status').html(msg);

                                        if (results.length && (results.length > 0)) {
                                            startIndex += 5;
                                            thiz.getAndRenderPagedEmails_Archived(startIndex, 5)
                                                .then(function (results) {

                                                    // Update the status.
                                                    var msg = 'Displaying 1 to ' + thiz.options.Archived.docs.length + ' of ' + thiz.options.Archived.totalDocs + ' emails.';
                                                    $('#spanSelectedEmailType_Status').html(msg);

                                                    //
                                                    //
                                                    // This is where we load the dataTransfer object, so that we can drag and drop emails among the email folders. 5-21-2024.
                                                    //
                                                    // 

                                                    var emailItems = document.getElementsByClassName('bwemailitems');
                                                    for (var i = startIndex; i < emailItems.length; i++) { // Add these event listeners to all of the new ones.

                                                        emailItems[i].addEventListener('dragstart', function (e) {
                                                            try {
                                                                console.log('In bwCalendar.js.loadAndRenderEmails_Archived.dragstart().');

                                                                // Step 1: Set the opacity for all of these classes to 0.5: brushedAluminum_blue_noanimation

                                                                // Step 2: Set the opacity to 1 for these buttons. This will indicate a drop zone: Archived, Archived, TrashBin. [divInnerLeftMenuButton_Archived, divInnerLeftMenuButton_Archived, divInnerLeftMenuButton_TrashBin].

                                                                var elements1 = document.getElementsByClassName('brushedAluminum_blue_noanimation');
                                                                for (var j = 0; j < elements1.length; j++) {
                                                                    elements1[j].style.opacity = '0.2';
                                                                }

                                                                var elements1 = document.getElementsByClassName('brushedAluminum_blue');
                                                                for (var j = 0; j < elements1.length; j++) {
                                                                    elements1[j].style.opacity = '0.2';
                                                                }

                                                                document.getElementById('divInnerLeftMenuButton_Archived').style.opacity = 1.0;
                                                                document.getElementById('divInnerLeftMenuButton_Archived').style.opacity = 1.0;
                                                                document.getElementById('divInnerLeftMenuButton_TrashBin').style.opacity = 1.0;

                                                                // We have to set the _id in the dragstart event.
                                                                var _id = e.target.getAttribute('_id');
                                                                var result = {
                                                                    MailboxOrigin: 'ARCHIVED',
                                                                    _id: _id
                                                                }
                                                                var result1 = JSON.stringify(result);
                                                                e.dataTransfer.setData('text/plain', result1);

                                                            } catch (e) {
                                                                var msg = 'Exception in In bwCalendar.js.loadAndRenderEmails_Archived.dragstart(): ' + e.message + ', ' + e.stack;
                                                                console.log(msg);
                                                                alert(msg);
                                                            }
                                                        });

                                                        emailItems[i].addEventListener('dragend', function (e) {
                                                            try {
                                                                console.log('In bwCalendar.js.loadAndRenderEmails_Archived.dragend().');

                                                                // Set the opacity for all of these classes to 1.0: [brushedAluminum_blue, brushedAluminum_blue_noanimation].

                                                                var elements1 = document.getElementsByClassName('brushedAluminum_blue_noanimation');
                                                                for (var j = 0; j < elements1.length; j++) {
                                                                    elements1[j].style.opacity = '1.0';
                                                                }

                                                                var elements1 = document.getElementsByClassName('brushedAluminum_blue');
                                                                for (var j = 0; j < elements1.length; j++) {
                                                                    elements1[j].style.opacity = '1.0';
                                                                }

                                                            } catch (e) {
                                                                var msg = 'Exception in In bwCalendar.js.loadAndRenderEmails_Archived.dragend(): ' + e.message + ', ' + e.stack;
                                                                console.log(msg);
                                                                alert(msg);
                                                            }
                                                        });

                                                    }

                                                    thiz.options.divEmailPicker_scroll_ticking = false; // We have completed our work, now turn on the scroll detection again.

                                                }).catch(function (e) {



                                                });

                                        }


                                    }).catch(function (e) {



                                    });

                            }

                        }).catch(function (e) {



                        });

                }

            }).catch(function (e) {



            });

    },
    getAndRenderPagedEmails_Archived: function (offset, limit) {
        var thiz = this;
        return new Promise(function (resolve, reject) {
            try {
                console.log('In bwCalendar.js.getAndRenderPagedEmails_Archived().');
                //alert('In bwCalendar.js.getAndRenderPagedEmails_Archived().');

                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                var data = {
                    bwParticipantId_LoggedIn: participantId,
                    bwActiveStateIdentifier: activeStateIdentifier,
                    bwWorkflowAppId_LoggedIn: workflowAppId,

                    offset: offset,
                    limit: limit
                    //bwWorkflowAppId: workflowAppId,
                    //bwParticipantId: participantId,
                };

                $.ajax({
                    url: thiz.options.operationUriPrefix + "_bw/participantemail_archived",
                    type: 'POST',
                    data: data,
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    },
                    success: function (results) {
                        try {

                            console.log('xcx23213. These pids change. Often I get the 2 first with a pid, then the remaining 2 with another pid. This may be the round-robin behavior? pid: ' + results.pid);

                            if (results.status != 'SUCCESS') {

                                var msg = results.status + ': ' + results.message;
                                console.log(msg);
                                displayAlertDialog(msg);

                            } else {

                                if (!(thiz.options.Archived && thiz.options.Archived.docs && thiz.options.Archived.docs.length)) {

                                    // The options.Archived is empty, so just load it directly.
                                    thiz.options.Archived = results.results;

                                } else {

                                    // The options.Archived has some emails in it already, so load it like this.
                                    for (var i = 0; i < results.results.docs.length; i++) {
                                        thiz.options.Archived.docs.push(results.results.docs[i]); // With pagination.
                                    }

                                    thiz.options.Archived.totalDocs = results.results.totalDocs;
                                    thiz.options.Archived.offset = results.results.offset;
                                    thiz.options.Archived.limit = results.results.limit;
                                    thiz.options.Archived.totalPages = results.results.totalPages;
                                    thiz.options.Archived.page = results.results.page;
                                    thiz.options.Archived.pagingCounter = results.results.pagingCounter;
                                    thiz.options.Archived.hasPrevPage = results.results.hasPrevPage;
                                    thiz.options.Archived.hasNextPage = results.results.hasNextPage;
                                    thiz.options.Archived.prevPage = results.results.prevPage;
                                    thiz.options.Archived.nextPage = results.results.nextPage;

                                }

                                if (!thiz.options.Archived.docs.length || thiz.options.Archived.docs.length == 0) {

                                    var html = '';

                                    html += '<tr><td><span style="font-size:10pt;font-weight:normal;color:black;">';
                                    html += '  There are no Archived emails.';
                                    html += '<span></td></tr>';

                                    $(thiz.element).find('#tableEmailPicker').append(html);

                                    if ($(thiz.element).find('#spanSelectedEmail') && $(thiz.element).find('#spanSelectedEmail')[0]) {
                                        $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = '';
                                    }

                                } else {

                                    var element = $(thiz.element).find('#tableEmailPicker')[0];

                                    for (var i = 0; i < results.results.docs.length; i++) {

                                        thiz.renderMailboxItemInList(results.results.docs[i], element, 'Archived'); // Generate the email listing HTML.

                                    }

                                    thiz.resize();

                                }

                            }

                            var result = {
                                status: 'SUCCESS',
                                message: 'SUCCESS',
                                length: results.results.docs.length
                            }
                            resolve(result);

                        } catch (e) {

                            var msg = 'Exception in bwCalendar.js.getAndRenderPagedEmails_Archived():2: ' + e.message + ', ' + e.stack;
                            console.log(msg);

                            var result = {
                                status: 'EXCEPTION',
                                message: msg
                            }
                            reject(result);

                        }

                    },
                    error: function (data, errorCode, errorMessage) {

                        var msg = 'Error in bwCalendar.js.getAndRenderPagedEmails_Archived():1: ' + errorCode + ', ' + errorMessage;
                        console.log(msg);

                        var result = {
                            status: 'EXCEPTION',
                            message: msg
                        }
                        reject(result);

                    }

                });

            } catch (e) {

                var msg = 'Exception in bwCalendar.js.getAndRenderPagedEmails_Archived(): ' + e.message + ', ' + e.stack;
                console.log(msg);

                var result = {
                    status: 'EXCEPTION',
                    message: msg
                }
                reject(result);

            }

        });

    },
    viewIndividualEmail_Archived: function (originElementId, bwParticipantId, bwParticipantFriendlyName, bwParticipantEmail, _id) {
        try {
            console.log('In bwCalendar.js.viewIndividualEmail_Archived(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ', _id: ' + _id);
            //displayAlertDialog_Persistent('In bwCalendar.js.viewIndividualEmail_Archived(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ', _id: ' + _id);
            //alert('In bwCalendar.js.viewIndividualEmail_Archived(). _id: ' + _id);
            var thiz = this;

            this.displayNewMessageEditorHtml().then(function (results) {
                try {
                    if (results.status != 'SUCCESS') {

                        var msg = 'Error in bwCalendar.js.viewIndividualEmail_Archived(): ' + results.message;
                        console.log(msg);
                        displayAlertDialog(msg);

                    } else {

                        console.log('In bwCalendar.js.viewIndividualEmail_Archived(). Successfully returned from displayNewMessageEditorHtml().');

                        thiz.loadIndividualEmail_Archived(_id).then(function () {
                            try {

                                // Display the top buttons.
                                html = '';
                                html += '<button xcx="xcx324234667" class="BwButton200" onclick="$(\'.bwCalendar:first\').bwCalendar(\'SendSingleEmailNow\');">SEND NOW</button>'; // BwButton200ForRequestForm
                                html += '&nbsp;&nbsp;&nbsp;&nbsp;';
                                html += '<button xcx="xcx213124-1" class="BwButton200" style="color:red;font-weight:bold;" onclick="$(\'.bwCalendar:first\').bwCalendar(\'saveDraft\');">SAVE DRAFT</button>'; // BwSmallButton
                                $('#bwCalendar_EmailTopButtons').html(html);
                                // end: Display the top buttons.

                                thiz.renderIndividualEmail_Editable(_id, 'Archived').then(function (results) { // strMailbox: ['Inbox', 'Sent', etc.]
                                    try {

                                        if (results.status != 'SUCCESS') {

                                            var msg = 'Error in bwCalendar.js.viewIndividualEmail_Archived(): ' + results.message;
                                            console.log(msg);
                                            displayAlertDialog(msg);

                                        } else {

                                            // Done

                                        }

                                    } catch (e) {
                                        var msg = 'Exception in bwCalendar.js.viewIndividualEmail_Archived():7: ' + e.message + ', ' + e.stack;
                                        console.log(msg);
                                        displayAlertDialog(msg);
                                    }

                                }).catch(function (e) {
                                    var msg = 'Exception in bwCalendar.js.viewIndividualEmail_Archived():6: ' + JSON.stringify(e);
                                    console.log(msg);
                                    displayAlertDialog(msg);
                                });

                            } catch (e) {
                                console.log('Exception in bwCalendar.js.viewIndividualEmail_Archived():4: ' + e.message + ', ' + e.stack);
                                displayAlertDialog('Exception in bwCalendar.js.viewIndividualEmail_Archived():4: ' + e.message + ', ' + e.stack);
                            }

                        }).catch(function (e) {

                            console.log('Exception in bwCalendar.js.viewIndividualEmail_Archived():3: ' + JSON.stringify(e));
                            displayAlertDialog('Exception in bwCalendar.js.viewIndividualEmail_Archived():3: ' + JSON.stringify(e));

                        });

                    }

                } catch (e) {

                    var msg = 'Exception in bwCalendar.js.viewIndividualEmail_Archived.displayNewMessageEditorHtml():2: ' + e.message + ', ' + e.stack;
                    console.log(msg);
                    displayAlertDialog(msg);

                }

            }).catch(function (e) {

                var msg = 'Exception in bwCalendar.js.viewIndividualEmail_Archived.displayNewMessageEditorHtml(): ' + JSON.stringify(e);
                console.log(msg);
                displayAlertDialog(msg);

            });

        } catch (e) {
            var msg = 'Exception in bwCalendar.js.viewIndividualEmail_Archived(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ': ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
        }

    },
    loadIndividualEmail_Archived: function (_id) {
        var thiz = this;
        return new Promise(function (resolve, reject) {
            try {
                console.log('In bwCalendar.js.loadIndividualEmail_Archived(). _id: ' + _id);
                //alert('In bwCalendar.js.loadIndividualEmail_Archived(). _id: ' + _id);

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

                        var msg = 'Error in bwCalendar.js.loadIndividualEmail_Archived(): Invalid value. Expected values for workflowAppId: ' + workflowAppId + ', participantId: ' + participantId + ', _id: ' + _id;
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
                            url: thiz.options.operationUriPrefix + "_bw/getsingleparticipantemail_archived",
                            type: 'POST',
                            data: data,
                            headers: {
                                "Accept": "application/json; odata=verbose"
                            },
                            success: function (results) {
                                try {

                                    if (results.status != 'SUCCESS') {

                                        var msg = 'Error in bwCalendar.js.loadIndividualEmail_Archived():xcx542: results: ' + JSON.stringify(results);
                                        console.log(msg);

                                        var result = {
                                            status: 'ERROR',
                                            message: msg
                                        }
                                        reject(result);

                                    } else {

                                        if (!results.results) {

                                            console.log('xcx2131234-3 NO RESULTS!!!! results.results: ' + JSON.stringify(results.results) + ', data: ' + JSON.stringify(data));
                                            alert('xcx2131234-3 NO RESULTS!!!! results.results: ' + JSON.stringify(results.results) + ', data: ' + JSON.stringify(data));

                                        } else {

                                            var foundIt;
                                            for (var i = 0; i < thiz.options.Archived.docs.length; i++) {
                                                if (thiz.options.Archived.docs[i]._id == _id) {

                                                    thiz.options.Archived.docs[i] = results.doc; // This is where we load the entire email into the mailbox.
                                                    foundIt = true;

                                                }
                                            }

                                            if (!foundIt) {

                                                var msg = 'Error in bwCalendar.js.loadIndividualEmail_Archived():xcx231312-1: Could not find the email with _id: ' + _id;
                                                console.log(msg);

                                                var result = {
                                                    status: 'ERROR',
                                                    message: msg
                                                }
                                                reject(result);

                                            } else {

                                                var result = {
                                                    status: 'SUCCESS',
                                                    message: 'The email contents have added to the mailbox so that it available to be viewed.'
                                                }
                                                resolve(result);

                                            }

                                        }

                                    }

                                } catch (e) {

                                    var msg = 'Exception in bwCalendar.js.loadIndividualEmail_Archived():2: ' + e.message + ', ' + e.stack;
                                    console.log(msg);

                                    var result = {
                                        status: 'EXCEPTION',
                                        message: msg
                                    }
                                    reject(result);

                                }
                            },
                            error: function (data, errorCode, errorMessage) {

                                var msg = 'Error in bwCalendar.js.loadIndividualEmail_Archived():' + errorCode + ', ' + errorMessage;
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

                var msg = 'Exception in bwCalendar.js.loadIndividualEmail_Archived():xcx453: ' + e.message + ', ' + e.stack;

                var result = {
                    status: 'EXCEPTION',
                    message: msg
                }
                reject(result);

            }

        })
    },

    // TrashBin methods.
    loadAndRenderEmails_TrashBin: function (bwWorkflowAppId) {
        try {
            console.log('In bwCalendar.js.loadAndRenderEmails_TrashBin(). bwWorkflowAppId: ' + bwWorkflowAppId);
            //alert('In bwCalendar.js.loadAndRenderEmails_TrashBin(). bwWorkflowAppId: ' + bwWorkflowAppId);
            var thiz = this;

            $(thiz.element).find('#tableEmailPicker tr').remove(); // Remove all the rows in the emails table/list.

            // Select the button here. 1-4-2024.
            var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
            var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

            // Step 1: Make all of the buttons un-selected.
            $('.bwCalendar:first').find('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
            });

            // Step 2: Set the specified button as the selected one.
            $('#divInnerLeftMenuButton_TrashBin').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);

            // An email won't be selected until the user selects one.
            $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '<div xcx="xcx213123-2" style="font-size:25pt;color:lightgray;">SELECT A CALENDAR ITEM THAT YOU WISH TO VIEW.</div>';
            var x = document.getElementById('tdbwCalendar_RightColumn');
            x.style.verticalAlign = 'middle';
            // end: An email won't be selected until the user selects one.

            $('#bwCalendar_EmailTopButtons').html('');  // These are the top buttons when an email is displayed. Get rid of any lingering ones...

            $('#divPageContent2_Title').html('✉&nbsp;TRASHBIN');

            // Display the radio button and the title.
            html = '';
            //html += '<input type="checkbox" style="transform:scale(2);" id="checkboxToggleSentEmailCheckboxes" onchange="$(\'.bwCalendar\').bwCalendar(\'toggleSentEmailCheckboxes\', this);" />&nbsp;&nbsp;';
            html += '✉ TrashBin Items';
            $(thiz.element).find('#spanSelectedEmailType_Title')[0].innerHTML = html; //'Sent Email';
            // end: Display the radio button and the title.

            // Display the top buttons.
            var html = '';
            html += '                           <span xcx="xcx231232-2" class="emailEditor_topbarbutton" onclick="$(\'.bwCalendar\').bwCalendar(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\');">';
            html += '                               <img title="Delete..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx123468" />&nbsp;Delete';
            html += '                           </span>';
            html += '&nbsp;&nbsp;';
            html += '                           <span xcx="xcx231232-2" class="emailEditor_topbarbutton" onclick="$(\'.bwCalendar\').bwCalendar(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\', \'emptyfolder\');">';
            html += '                               <img title="Empty folder..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx23423467898">&nbsp;Empty folder';
            html += '                           </span>';
            $(thiz.element).find('#spanSelectedEmailType_TopButtons')[0].innerHTML = html;
            // end: Display the top buttons.

            var divEmailPicker = document.getElementById('divEmailPicker');

            thiz.options.divEmailPicker_scroll_ticking = false;

            $(divEmailPicker).off('scroll').scroll(function (error) {

                lastKnownScrollPosition = divEmailPicker.scrollTop; // window.scrollY;

                if (!thiz.options.divEmailPicker_scroll_ticking) {
                    window.requestAnimationFrame(() => {

                        var msg = 'The user has scrolled. divEmailPicker.scrollTop: ' + divEmailPicker.scrollTop + ', divEmailPicker.offsetHeight: ' + divEmailPicker.offsetHeight;
                        console.log(msg);
                        //displayAlertDialog(msg);

                        //
                        // Check if the 5th from the bottom is in view. If so, it is time to load more emails.
                        //
                        var elements = $('.bwemailitems');
                        var index = elements.length - 5;
                        if (index > 0) {
                            if (thiz.isScrolledIntoView(elements[index])) {
                                thiz.options.divEmailPicker_scroll_ticking = true; // Turn off scroll detection until we are done our work here.
                                thiz.getMoreRecords_TrashBin();
                            }
                        }

                    });

                }
            });


            thiz.options.window_scroll_ticking = false;

            $(window).off('scroll').scroll(function (error) {

                console.log('In window.scroll.');
                //displayAlertDialog_QuickNotice('In window.scroll.');

                if (!thiz.options.window_scroll_ticking) {
                    window.requestAnimationFrame(() => {

                        //
                        // Check if the 5th from the bottom is in view. If so, it is time to load more emails.
                        // We are doing it with this window scroll event as well, because on mobile it seems the div scroll bar disappears in Chrome and doesn't alwasy scroll, as expected.
                        //
                        var elements = $('.bwemailitems');
                        var index = elements.length - 5;
                        if (index > 0) {
                            if (thiz.isScrolledIntoView(elements[index])) {
                                thiz.options.window_scroll_ticking = true; // Turn off scroll detection until we are done our work here.
                                thiz.getMoreRecords_TrashBin();
                            }
                        }

                    });

                }
            });

            //
            //
            // end: divEmailPicker onscroll. This is how we know when to retrieve more emails to add to the list. This behaves like an infinite scroll. 7-20-2024.
            //
            //

            $('.bwActiveMenu').bwActiveMenu('adjustLeftSideMenu'); // This makes sure our new stretchy-left-menu redraws Ok.

            thiz.options.TrashBin = null;

            thiz.getMoreRecords_TrashBin(); // Get the first round of mailbox items. The scroll event listeners will call this again to get more, until they are potentially all loaded.

        } catch (e) {
            console.log('Exception in bwCalendar.js.loadAndRenderEmails_TrashBin(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCalendar.js.loadAndRenderEmails_TrashBin(): ' + e.message + ', ' + e.stack);
        }
    },
    getMoreRecords_TrashBin: function () {
        console.log('In bwCalendar.js.getMoreRecords_TrashBin().');
        //alert('In bwCalendar.js.getMoreRecords_TrashBin().');
        var thiz = this;

        //
        // The user has scrolled to the bottom of the list. Get more emails and add them to the list.
        //

        //var msg = 'In xcx23213123.divEmailPicker.scroll.getMoreRequests(). divEmailPicker.scrollTop: ' + divEmailPicker.scrollTop + ', offsetHeight: ' + divEmailPicker.offsetHeight;
        var msg = 'In getMoreRecords_TrashBin(). The user has scrolled to the bottom of the list. Get more emails and add them to the list.';
        console.log(msg);
        //displayAlertDialog(msg);

        var startIndex = 0;
        if (thiz.options.TrashBin && thiz.options.TrashBin.docs && thiz.options.TrashBin.docs.length) {
            startIndex = thiz.options.TrashBin.docs.length;
        }

        thiz.getAndRenderPagedEmails_TrashBin(startIndex, 5)
            .then(function (results) {

                // Update the status.
                var msg = 'Displaying 1 to ' + thiz.options.TrashBin.docs.length + ' of ' + thiz.options.TrashBin.totalDocs + ' emails.';
                $('#spanSelectedEmailType_Status').html(msg);

                if (results.length && (results.length > 0)) {
                    startIndex += 5;
                    thiz.getAndRenderPagedEmails_TrashBin(startIndex, 5)
                        .then(function (results) {

                            // Update the status.
                            var msg = 'Displaying 1 to ' + thiz.options.TrashBin.docs.length + ' of ' + thiz.options.TrashBin.totalDocs + ' emails.';
                            $('#spanSelectedEmailType_Status').html(msg);

                            if (results.length && (results.length > 0)) {
                                startIndex += 5;
                                thiz.getAndRenderPagedEmails_TrashBin(startIndex, 5)
                                    .then(function (results) {

                                        // Update the status.
                                        var msg = 'Displaying 1 to ' + thiz.options.TrashBin.docs.length + ' of ' + thiz.options.TrashBin.totalDocs + ' emails.';
                                        $('#spanSelectedEmailType_Status').html(msg);

                                        if (results.length && (results.length > 0)) {
                                            startIndex += 5;
                                            thiz.getAndRenderPagedEmails_TrashBin(startIndex, 5)
                                                .then(function (results) {

                                                    // Update the status.
                                                    var msg = 'Displaying 1 to ' + thiz.options.TrashBin.docs.length + ' of ' + thiz.options.TrashBin.totalDocs + ' emails.';
                                                    $('#spanSelectedEmailType_Status').html(msg);

                                                    //
                                                    //
                                                    // This is where we load the dataTransfer object, so that we can drag and drop emails among the email folders. 5-21-2024.
                                                    //
                                                    // 

                                                    var emailItems = document.getElementsByClassName('bwemailitems');
                                                    for (var i = startIndex; i < emailItems.length; i++) { // Add these event listeners to all of the new ones.

                                                        emailItems[i].addEventListener('dragstart', function (e) {
                                                            try {
                                                                console.log('In bwCalendar.js.loadAndRenderEmails_TrashBin.dragstart().');

                                                                // Step 1: Set the opacity for all of these classes to 0.5: brushedAluminum_blue_noanimation

                                                                // Step 2: Set the opacity to 1 for these buttons. This will indicate a drop zone: TrashBin, TrashBin, TrashBin. [divInnerLeftMenuButton_TrashBin, divInnerLeftMenuButton_TrashBin, divInnerLeftMenuButton_TrashBin].

                                                                var elements1 = document.getElementsByClassName('brushedAluminum_blue_noanimation');
                                                                for (var j = 0; j < elements1.length; j++) {
                                                                    elements1[j].style.opacity = '0.2';
                                                                }

                                                                var elements1 = document.getElementsByClassName('brushedAluminum_blue');
                                                                for (var j = 0; j < elements1.length; j++) {
                                                                    elements1[j].style.opacity = '0.2';
                                                                }

                                                                document.getElementById('divInnerLeftMenuButton_TrashBin').style.opacity = 1.0;
                                                                document.getElementById('divInnerLeftMenuButton_TrashBin').style.opacity = 1.0;
                                                                document.getElementById('divInnerLeftMenuButton_TrashBin').style.opacity = 1.0;

                                                                // We have to set the _id in the dragstart event.
                                                                var _id = e.target.getAttribute('_id');
                                                                var result = {
                                                                    MailboxOrigin: 'TRASHBIN',
                                                                    _id: _id
                                                                }
                                                                var result1 = JSON.stringify(result);
                                                                e.dataTransfer.setData('text/plain', result1);

                                                            } catch (e) {
                                                                var msg = 'Exception in In bwCalendar.js.loadAndRenderEmails_TrashBin.dragstart(): ' + e.message + ', ' + e.stack;
                                                                console.log(msg);
                                                                alert(msg);
                                                            }
                                                        });

                                                        emailItems[i].addEventListener('dragend', function (e) {
                                                            try {
                                                                console.log('In bwCalendar.js.loadAndRenderEmails_TrashBin.dragend().');

                                                                // Set the opacity for all of these classes to 1.0: [brushedAluminum_blue, brushedAluminum_blue_noanimation].

                                                                var elements1 = document.getElementsByClassName('brushedAluminum_blue_noanimation');
                                                                for (var j = 0; j < elements1.length; j++) {
                                                                    elements1[j].style.opacity = '1.0';
                                                                }

                                                                var elements1 = document.getElementsByClassName('brushedAluminum_blue');
                                                                for (var j = 0; j < elements1.length; j++) {
                                                                    elements1[j].style.opacity = '1.0';
                                                                }

                                                            } catch (e) {
                                                                var msg = 'Exception in In bwCalendar.js.loadAndRenderEmails_TrashBin.dragend(): ' + e.message + ', ' + e.stack;
                                                                console.log(msg);
                                                                alert(msg);
                                                            }
                                                        });

                                                    }

                                                    thiz.options.divEmailPicker_scroll_ticking = false; // We have completed our work, now turn on the scroll detection again.

                                                }).catch(function (e) {



                                                });

                                        }


                                    }).catch(function (e) {



                                    });

                            }

                        }).catch(function (e) {



                        });

                }

            }).catch(function (e) {



            });

    },
    getAndRenderPagedEmails_TrashBin: function (offset, limit) {
        var thiz = this;
        return new Promise(function (resolve, reject) {
            try {
                console.log('In bwCalendar.js.getAndRenderPagedEmails_TrashBin().');
                //alert('In bwCalendar.js.getAndRenderPagedEmails_TrashBin().');

                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                var data = {
                    bwParticipantId_LoggedIn: participantId,
                    bwActiveStateIdentifier: activeStateIdentifier,
                    bwWorkflowAppId_LoggedIn: workflowAppId,

                    offset: offset,
                    limit: limit
                    //bwWorkflowAppId: workflowAppId,
                    //bwParticipantId: participantId,
                };

                $.ajax({
                    url: thiz.options.operationUriPrefix + "_bw/participantemail_trashbin",
                    type: 'POST',
                    data: data,
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    },
                    success: function (results) {
                        try {

                            console.log('xcx23213. These pids change. Often I get the 2 first with a pid, then the remaining 2 with another pid. This may be the round-robin behavior? pid: ' + results.pid);

                            if (results.status != 'SUCCESS') {

                                var msg = results.status + ': ' + results.message;
                                console.log(msg);
                                displayAlertDialog(msg);

                            } else {

                                if (!(thiz.options.TrashBin && thiz.options.TrashBin.docs && thiz.options.TrashBin.docs.length)) {

                                    // The options.TrashBin is empty, so just load it directly.
                                    thiz.options.TrashBin = results.results;

                                } else {

                                    // The options.TrashBin has some emails in it already, so load it like this.
                                    for (var i = 0; i < results.results.docs.length; i++) {
                                        thiz.options.TrashBin.docs.push(results.results.docs[i]); // With pagination.
                                    }

                                    thiz.options.TrashBin.totalDocs = results.results.totalDocs;
                                    thiz.options.TrashBin.offset = results.results.offset;
                                    thiz.options.TrashBin.limit = results.results.limit;
                                    thiz.options.TrashBin.totalPages = results.results.totalPages;
                                    thiz.options.TrashBin.page = results.results.page;
                                    thiz.options.TrashBin.pagingCounter = results.results.pagingCounter;
                                    thiz.options.TrashBin.hasPrevPage = results.results.hasPrevPage;
                                    thiz.options.TrashBin.hasNextPage = results.results.hasNextPage;
                                    thiz.options.TrashBin.prevPage = results.results.prevPage;
                                    thiz.options.TrashBin.nextPage = results.results.nextPage;

                                }

                                if (!thiz.options.TrashBin.docs.length || thiz.options.TrashBin.docs.length == 0) {

                                    var html = '';

                                    html += '<tr><td><span style="font-size:10pt;font-weight:normal;color:black;">';
                                    html += '  There are no emails in the TrashBin.';
                                    html += '<span></td></tr>';

                                    $(thiz.element).find('#tableEmailPicker').append(html);

                                    if ($(thiz.element).find('#spanSelectedEmail') && $(thiz.element).find('#spanSelectedEmail')[0]) {
                                        $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = '';
                                    }

                                } else {

                                    var element = $(thiz.element).find('#tableEmailPicker')[0];

                                    for (var i = 0; i < results.results.docs.length; i++) {

                                        thiz.renderMailboxItemInList(results.results.docs[i], element, 'TrashBin'); // Generate the email listing HTML.

                                    }

                                    thiz.resize();

                                }

                            }

                            var result = {
                                status: 'SUCCESS',
                                message: 'SUCCESS',
                                length: results.results.docs.length
                            }
                            resolve(result);

                        } catch (e) {

                            var msg = 'Exception in bwCalendar.js.getAndRenderPagedEmails_TrashBin():2: ' + e.message + ', ' + e.stack;
                            console.log(msg);

                            var result = {
                                status: 'EXCEPTION',
                                message: msg
                            }
                            reject(result);

                        }

                    },
                    error: function (data, errorCode, errorMessage) {

                        var msg = 'Error in bwCalendar.js.getAndRenderPagedEmails_TrashBin():1: ' + errorCode + ', ' + errorMessage;
                        console.log(msg);

                        var result = {
                            status: 'EXCEPTION',
                            message: msg
                        }
                        reject(result);

                    }

                });

            } catch (e) {

                var msg = 'Exception in bwCalendar.js.getAndRenderPagedEmails_TrashBin(): ' + e.message + ', ' + e.stack;
                console.log(msg);

                var result = {
                    status: 'EXCEPTION',
                    message: msg
                }
                reject(result);

            }

        });

    },
    viewIndividualEmail_TrashBin: function (originElementId, bwParticipantId, bwParticipantFriendlyName, bwParticipantEmail, _id) {
        try {
            console.log('In bwCalendar.js.viewIndividualEmail_TrashBin(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ', _id: ' + _id);
            //displayAlertDialog_Persistent('In bwCalendar.js.viewIndividualEmail_TrashBin(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ', _id: ' + _id);
            //alert('In bwCalendar.js.viewIndividualEmail_TrashBin().');
            var thiz = this;

            this.displayExistingMessageHtml().then(function (results) {
                try {
                    if (results.status != 'SUCCESS') {

                        var msg = 'Error in bwCalendar.js.viewIndividualEmail_TrashBin(): ' + results.message;
                        console.log(msg);
                        displayAlertDialog(msg);

                    } else {

                        console.log('In bwCalendar.js.viewIndividualEmail_TrashBin(). Successfully returned from displayExistingMessageHtml().');

                        thiz.loadIndividualEmail_TrashBin(_id).then(function () {
                            try {

                                // Display the top buttons. Include reply, reply-all, forward, as appropriate.
                                var html = '';
                                //html += 'From: <span class="EmailAddress_From">' + emailAddress + '</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'; // + '[Reply]  [Reply All]  [Forward]';
                                html += '<span class="emailEditor_newMessageButton" xcx="xcx2134264-3" onclick="$(\'.bwCalendar:first\').bwCalendar(\'composeANewEmailMessage_Reply\');">&nbsp;✉&nbsp;Reply&nbsp;</span>';
                                html += '&nbsp;&nbsp;&nbsp;';
                                html += '<span class="emailEditor_newMessageButton" onclick="$(\'.bwCalendar:first\').bwCalendar(\'composeANewEmailMessage_Reply\');">&nbsp;✉&nbsp;Reply All&nbsp;</span>';
                                html += '&nbsp;&nbsp;&nbsp;';
                                html += '<span class="emailEditor_newMessageButton" onclick="$(\'.bwCalendar:first\').bwCalendar(\'composeANewEmailMessage_Reply\');">&nbsp;✉&nbsp;Forward&nbsp;</span>';
                                $('#bwCalendar_EmailTopButtons').html(html);


                                thiz.renderIndividualEmail_ReadOnly(_id, 'TrashBin').then(function (results) { // strMailbox: ['Inbox', 'Sent', etc.]
                                    try {
                                        debugger;
                                        if (results.status != 'SUCCESS') {

                                            var msg = 'Error in bwCalendar.js.viewIndividualEmail_TrashBin(): ' + results.message;
                                            console.log(msg);
                                            displayAlertDialog(msg);

                                        } else {

                                            var _email = results.email;

                                            if (_email.hasOwnProperty('TheUserHasReadThisEmail') && (_email.TheUserHasReadThisEmail == true)) {

                                                console.log('xcx87090000-1. CHECKING TO CHANGE THE READ EMAIL UI. _email.TheUserHasReadThisEmail: ' + _email.TheUserHasReadThisEmail);

                                            } else {

                                                //
                                                //
                                                // This email is marked as unread, so we do a web service call here to mark this email as read on the server. 11-2-2023.
                                                //
                                                //

                                                console.log('xcx87090000-1. CHECKING TO CHANGE THE READ EMAIL UI. _email.TheUserHasReadThisEmail: ' + _email.TheUserHasReadThisEmail + '. This email is marked as unread, so we do a web service call here to mark this email as read on the server. 11-2-2023. _email._id: ' + _email._id);

                                                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                                                var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                                                var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                                                var data = {
                                                    bwParticipantId_LoggedIn: participantId,
                                                    bwActiveStateIdentifier: activeStateIdentifier,
                                                    bwWorkflowAppId_LoggedIn: workflowAppId,

                                                    bwWorkflowAppId: workflowAppId,
                                                    bwParticipantId: participantId,
                                                    _id: _email._id
                                                };

                                                $.ajax({
                                                    url: thiz.options.operationUriPrefix + "_bw/marksingleemailasread",
                                                    type: "POST",
                                                    data: data,
                                                    headers: {
                                                        "Accept": "application/json; odata=verbose"
                                                    },
                                                    success: function (results) {
                                                        try {

                                                            if (results.status != 'SUCCESS') {

                                                                var msg = 'Error in bwCalendar.js.viewIndividualEmail_TrashBin(): ' + results.message;
                                                                console.log(msg);
                                                                displayAlertDialog(msg);

                                                            } else {

                                                                console.log('The email was successfully marked as read. _email._id: ' + _email._id + ', results.message: ' + results.message);

                                                                for (var i = 0; i < thiz.options.TrashBin.docs.length; i++) {
                                                                    if (thiz.options.TrashBin.docs[i]._id == _email._id) { // We can't use message_id because it may have an @ sign in it, which is not allowed in a valid html element id.

                                                                        thiz.options.TrashBin.docs[i]["TheUserHasReadThisEmail"] = true;

                                                                        var mailboxEmails = $(thiz.element).find('.bwEmailMailboxRow');

                                                                        for (var j = 0; j < mailboxEmails.length; j++) {

                                                                            var tmpId = $(mailboxEmails[j]).attr('_id');
                                                                            if (tmpId == _email._id) {

                                                                                // We have found the email entry. Change the UI.
                                                                                var emailAddressElement = $(mailboxEmails[j]).find('.bwEmailMailboxRow_EmailAddress')[0];
                                                                                var subjectElement = $(mailboxEmails[j]).find('.bwEmailMailboxRow_Subject')[0];
                                                                                $(emailAddressElement).css('fontWeight', 'normal');
                                                                                $(subjectElement).css('fontWeight', 'lighter');
                                                                                break;

                                                                            }
                                                                        }

                                                                        break;

                                                                    }
                                                                }

                                                                // Done

                                                            }

                                                        } catch (e) {
                                                            var msg = 'Exception in bwCalendar.js.viewIndividualEmail_TrashBin():8: ' + e.message + ', ' + e.stack;
                                                            console.log(msg);
                                                            displayAlertDialog(msg);
                                                        }
                                                    },
                                                    error: function (data, errorCode, errorMessage) {
                                                        var msg = 'Error in bwCalendar.js.viewIndividualEmail_TrashBin(): ' + errorCode + ', ' + errorMessage;
                                                        console.log(msg);
                                                        displayAlertDialog(msg);
                                                    }
                                                });

                                            }

                                        }

                                    } catch (e) {
                                        var msg = 'Exception in bwCalendar.js.viewIndividualEmail_TrashBin():7: ' + e.message + ', ' + e.stack;
                                        console.log(msg);
                                        displayAlertDialog(msg);
                                    }

                                }).catch(function (e) {
                                    var msg = 'Exception in bwCalendar.js.viewIndividualEmail_TrashBin():6: ' + JSON.stringify(e);
                                    console.log(msg);
                                    displayAlertDialog(msg);
                                });

                            } catch (e) {
                                var msg = 'Exception in bwCalendar.js.viewIndividualEmail_TrashBin():5: ' + e.message + ', ' + e.stack;
                                console.log(msg);
                                displayAlertDialog(msg);
                            }

                        }).catch(function (e) {
                            var msg = 'Exception in bwCalendar.js.viewIndividualEmail_TrashBin():4: ' + JSON.stringify(e);
                            console.log(msg);
                            displayAlertDialog(msg);
                        });

                    }

                } catch (e) {
                    var msg = 'Exception in bwCalendar.js.viewIndividualEmail_TrashBin():3: ' + e.message + ', ' + e.stack;
                    console.log(msg);
                    displayAlertDialog(msg);
                }

            }).catch(function (e) {
                var msg = 'Exception in bwCalendar.js.viewIndividualEmail_TrashBin():2: ' + JSON.stringify(e);
                console.log(msg);
                displayAlertDialog(msg);
            });

        } catch (e) {
            var msg = 'Exception in bwCalendar.js.viewIndividualEmail_TrashBin(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ': ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
        }

    },
    loadIndividualEmail_TrashBin: function (_id) {
        var thiz = this;
        return new Promise(function (resolve, reject) {
            try {
                console.log('In bwCalendar.js.loadIndividualEmail_TrashBin(). _id: ' + _id);
                //displayAlertDialog_Persistent('In bwCalendar.js.loadIndividualEmail_TrashBin(). _id: ' + _id);

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

                        var msg = 'Error in bwCalendar.js.loadIndividualEmail_TrashBin(): Invalid value. Expected values for workflowAppId: ' + workflowAppId + ', participantId: ' + participantId + ', _id: ' + _id;
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
                            type: 'POST',
                            data: data,
                            headers: {
                                "Accept": "application/json; odata=verbose"
                            },
                            success: function (results) {
                                try {

                                    if (results.status != 'SUCCESS') {

                                        var msg = 'Error in bwCalendar.js.loadIndividualEmail_TrashBin():xcx542: results: ' + JSON.stringify(results);
                                        console.log(msg);

                                        var result = {
                                            status: 'ERROR',
                                            message: msg
                                        }
                                        reject(result);

                                    } else {

                                        if (!results.results) {

                                            console.log('xcx2131234-3 NO RESULTS!!!! results.results: ' + JSON.stringify(results.results) + ', data: ' + JSON.stringify(data));
                                            alert('xcx2131234-3 NO RESULTS!!!! results.results: ' + JSON.stringify(results.results) + ', data: ' + JSON.stringify(data));

                                        } else {

                                            var foundIt;
                                            for (var i = 0; i < thiz.options.TrashBin.docs.length; i++) {
                                                if (thiz.options.TrashBin.docs[i]._id == _id) {

                                                    thiz.options.TrashBin.docs[i] = results.doc; // This is where we load the entire email into the mailbox.
                                                    foundIt = true;

                                                }
                                            }

                                            if (!foundIt) {

                                                var msg = 'Error in bwCalendar.js.loadIndividualEmail_TrashBin():xcx231312: Could not find the email.';
                                                console.log(msg);

                                                var result = {
                                                    status: 'ERROR',
                                                    message: msg
                                                }
                                                reject(result);

                                            } else {

                                                var result = {
                                                    status: 'SUCCESS',
                                                    message: 'The email contents have added to the mailbox so that it available to be viewed.'
                                                }
                                                resolve(result);

                                            }

                                        }

                                    }

                                } catch (e) {

                                    var msg = 'Exception in bwCalendar.js.loadIndividualEmail_TrashBin():2: ' + e.message + ', ' + e.stack;
                                    console.log(msg);

                                    var result = {
                                        status: 'EXCEPTION',
                                        message: msg
                                    }
                                    reject(result);

                                }
                            },
                            error: function (data, errorCode, errorMessage) {

                                var msg = 'Error in bwCalendar.js.loadIndividualEmail_TrashBin():' + errorCode + ', ' + errorMessage;
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

                var msg = 'Exception in bwCalendar.js.loadIndividualEmail_TrashBin():xcx453: ' + e.message + ', ' + e.stack;

                var result = {
                    status: 'EXCEPTION',
                    message: msg
                }
                reject(result);

            }

        })
    },

    // Search methods.
    searchBox_OnKeyDown: function (event) {
        try {
            console.log('In bwCalendar.js.searchBox_OnKeyDown().');

            if (event.keyCode == 13) {
                console.log('Enter key was pressed.');
                this.loadAndRenderEmails_Search();
            }

        } catch (e) {
            console.log('Exception in bwCalendar.js.searchBox_OnKeyDown(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCalendar.js.searchBox_OnKeyDown(): ' + e.message + ', ' + e.stack);
        }
    },
    loadAndRenderEmails_Search: function (bwWorkflowAppId) {
        try {
            console.log('In bwCalendar.js.loadAndRenderEmails_Search().');
            //alert('In bwCalendar.js.loadAndRenderEmails_Search(). PREVIOUSLY KNOWN AS thiz.renderEmails_search(); DO WE GET HERE? divEmailPicker is recreated below, this needs to be fixed as it only gets created once in _create().');
            var thiz = this;

            
            bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            document.getElementById('inputBwAuthentication_SearchBox').blur(); // This is here to prevent the search box from getting the cursor and showing the keyboard.


            $(thiz.element).find('#tableEmailPicker tr').remove(); // Remove all the rows in the emails table/list.

            // Select the button here. 1-4-2024.
            var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
            var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

            // Step 1: Make all of the buttons un-selected.
            $('.bwCalendar:first').find('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
            });

            // Step 2: Set the specified button as the selected one.
            $('#divInnerLeftMenuButton_Search').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);

            // An email won't be selected until the user selects one.
            $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '<div xcx="xcx213123-2" style="font-size:25pt;color:lightgray;">SELECT A CALENDAR ITEM THAT YOU WISH TO VIEW.</div>';
            var x = document.getElementById('tdbwCalendar_RightColumn');
            x.style.verticalAlign = 'middle';
            // end: An email won't be selected until the user selects one.

            $('#bwCalendar_EmailTopButtons').html('');  // These are the top buttons when an email is displayed. Get rid of any lingering ones...

            $('#divPageContent2_Title').html('✉&nbsp;SEARCH');

            // Display the radio button and the title.
            html = '';
            //html += '<input type="checkbox" style="transform:scale(2);" id="checkboxToggleSentEmailCheckboxes" onchange="$(\'.bwCalendar\').bwCalendar(\'toggleSentEmailCheckboxes\', this);" />&nbsp;&nbsp;';
            html += '✉ Search Items';
            $(thiz.element).find('#spanSelectedEmailType_Title')[0].innerHTML = html; //'Sent Email';
            // end: Display the radio button and the title.

            // Display the top buttons.
            var html = '';
            html += '                           <span xcx="xcx231232-2" class="emailEditor_topbarbutton" onclick="$(\'.bwCalendar\').bwCalendar(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\');">';
            html += '                               <img title="Delete..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx123468" />&nbsp;Delete';
            html += '                           </span>';
            html += '&nbsp;&nbsp;';
            html += '                           <span xcx="xcx231232-2" class="emailEditor_topbarbutton" onclick="$(\'.bwCalendar\').bwCalendar(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\', \'emptyfolder\');">';
            html += '                               <img title="Empty folder..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx23423467898">&nbsp;Empty folder';
            html += '                           </span>';
            $(thiz.element).find('#spanSelectedEmailType_TopButtons')[0].innerHTML = html;
            // end: Display the top buttons.

            var divEmailPicker = document.getElementById('divEmailPicker');

            thiz.options.divEmailPicker_scroll_ticking = false;

            $(divEmailPicker).off('scroll').scroll(function (error) {

                lastKnownScrollPosition = divEmailPicker.scrollTop; // window.scrollY;

                if (!thiz.options.divEmailPicker_scroll_ticking) {
                    window.requestAnimationFrame(() => {

                        var msg = 'The user has scrolled. divEmailPicker.scrollTop: ' + divEmailPicker.scrollTop + ', divEmailPicker.offsetHeight: ' + divEmailPicker.offsetHeight;
                        console.log(msg);
                        //displayAlertDialog(msg);

                        //
                        // Check if the 5th from the bottom is in view. If so, it is time to load more emails.
                        //
                        var elements = $('.bwemailitems');
                        var index = elements.length - 5;
                        if (index > 0) {
                            if (thiz.isScrolledIntoView(elements[index])) {
                                thiz.options.divEmailPicker_scroll_ticking = true; // Turn off scroll detection until we are done our work here.
                                thiz.getMoreRecords_Search();
                            }
                        }

                    });

                }
            });


            thiz.options.window_scroll_ticking = false;

            $(window).off('scroll').scroll(function (error) {

                console.log('In window.scroll.');
                //displayAlertDialog_QuickNotice('In window.scroll.');

                if (!thiz.options.window_scroll_ticking) {
                    window.requestAnimationFrame(() => {

                        //
                        // Check if the 5th from the bottom is in view. If so, it is time to load more emails.
                        // We are doing it with this window scroll event as well, because on mobile it seems the div scroll bar disappears in Chrome and doesn't alwasy scroll, as expected.
                        //
                        var elements = $('.bwemailitems');
                        var index = elements.length - 5;
                        if (index > 0) {
                            if (thiz.isScrolledIntoView(elements[index])) {
                                thiz.options.window_scroll_ticking = true; // Turn off scroll detection until we are done our work here.
                                thiz.getMoreRecords_Search();
                            }
                        }

                    });

                }
            });

            //
            //
            // end: divEmailPicker onscroll. This is how we know when to retrieve more emails to add to the list. This behaves like an infinite scroll. 7-20-2024.
            //
            //

            $('.bwActiveMenu').bwActiveMenu('adjustLeftSideMenu'); // This makes sure our new stretchy-left-menu redraws Ok.

            thiz.options.Search = null;

            thiz.getMoreRecords_Search(); // Get the first round of mailbox items. The scroll event listeners will call this again to get more, until they are potentially all loaded.

        } catch (e) {
            console.log('Exception in bwCalendar.js.loadAndRenderEmails_Search(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCalendar.js.loadAndRenderEmails_Search(): ' + e.message + ', ' + e.stack);
        }
    },
    getMoreRecords_Search: function () {
        console.log('In bwCalendar.js.getMoreRecords_Search().');
        //alert('In bwCalendar.js.getMoreRecords_Search().');
        var thiz = this;

        //
        // The user has scrolled to the bottom of the list. Get more emails and add them to the list.
        //

        //var msg = 'In xcx23213123.divEmailPicker.scroll.getMoreRequests(). divEmailPicker.scrollTop: ' + divEmailPicker.scrollTop + ', offsetHeight: ' + divEmailPicker.offsetHeight;
        var msg = 'In getMoreRecords_Search(). The user has scrolled to the bottom of the list. Get more emails and add them to the list.';
        console.log(msg);
        //displayAlertDialog(msg);

        var startIndex = 0;
        if (thiz.options.Search && thiz.options.Search.docs && thiz.options.Search.docs.length) {
            startIndex = thiz.options.Search.docs.length;
        }

        thiz.getAndRenderPagedEmails_Search(startIndex, 5)
            .then(function (results) {

                // Update the status.
                var msg = 'Displaying 1 to ' + thiz.options.Search.docs.length + ' of ' + thiz.options.Search.totalDocs + ' emails.';
                $('#spanSelectedEmailType_Status').html(msg);

                if (results.length && (results.length > 0)) {
                    startIndex += 5;
                    thiz.getAndRenderPagedEmails_Search(startIndex, 5)
                        .then(function (results) {

                            // Update the status.
                            var msg = 'Displaying 1 to ' + thiz.options.Search.docs.length + ' of ' + thiz.options.Search.totalDocs + ' emails.';
                            $('#spanSelectedEmailType_Status').html(msg);

                            if (results.length && (results.length > 0)) {
                                startIndex += 5;
                                thiz.getAndRenderPagedEmails_Search(startIndex, 5)
                                    .then(function (results) {

                                        // Update the status.
                                        var msg = 'Displaying 1 to ' + thiz.options.Search.docs.length + ' of ' + thiz.options.Search.totalDocs + ' emails.';
                                        $('#spanSelectedEmailType_Status').html(msg);

                                        if (results.length && (results.length > 0)) {
                                            startIndex += 5;
                                            thiz.getAndRenderPagedEmails_Search(startIndex, 5)
                                                .then(function (results) {

                                                    // Update the status.
                                                    var msg = 'Displaying 1 to ' + thiz.options.Search.docs.length + ' of ' + thiz.options.Search.totalDocs + ' emails.';
                                                    $('#spanSelectedEmailType_Status').html(msg);

                                                    //
                                                    //
                                                    // This is where we load the dataTransfer object, so that we can drag and drop emails among the email folders. 5-21-2024.
                                                    //
                                                    // 

                                                    var emailItems = document.getElementsByClassName('bwemailitems');
                                                    for (var i = startIndex; i < emailItems.length; i++) { // Add these event listeners to all of the new ones.

                                                        emailItems[i].addEventListener('dragstart', function (e) {
                                                            try {
                                                                console.log('In bwCalendar.js.loadAndRenderEmails_Search.dragstart().');

                                                                // Step 1: Set the opacity for all of these classes to 0.5: brushedAluminum_blue_noanimation

                                                                // Step 2: Set the opacity to 1 for these buttons. This will indicate a drop zone: Search, Search, Search. [divInnerLeftMenuButton_Search, divInnerLeftMenuButton_Search, divInnerLeftMenuButton_Search].

                                                                var elements1 = document.getElementsByClassName('brushedAluminum_blue_noanimation');
                                                                for (var j = 0; j < elements1.length; j++) {
                                                                    elements1[j].style.opacity = '0.2';
                                                                }

                                                                var elements1 = document.getElementsByClassName('brushedAluminum_blue');
                                                                for (var j = 0; j < elements1.length; j++) {
                                                                    elements1[j].style.opacity = '0.2';
                                                                }

                                                                document.getElementById('divInnerLeftMenuButton_Search').style.opacity = 1.0;
                                                                document.getElementById('divInnerLeftMenuButton_Search').style.opacity = 1.0;
                                                                document.getElementById('divInnerLeftMenuButton_Search').style.opacity = 1.0;

                                                                // We have to set the _id in the dragstart event.
                                                                var _id = e.target.getAttribute('_id');
                                                                var result = {
                                                                    MailboxOrigin: 'SEARCH',
                                                                    _id: _id
                                                                }
                                                                var result1 = JSON.stringify(result);
                                                                e.dataTransfer.setData('text/plain', result1);

                                                            } catch (e) {
                                                                var msg = 'Exception in In bwCalendar.js.loadAndRenderEmails_Search.dragstart(): ' + e.message + ', ' + e.stack;
                                                                console.log(msg);
                                                                alert(msg);
                                                            }
                                                        });

                                                        emailItems[i].addEventListener('dragend', function (e) {
                                                            try {
                                                                console.log('In bwCalendar.js.loadAndRenderEmails_Search.dragend().');

                                                                // Set the opacity for all of these classes to 1.0: [brushedAluminum_blue, brushedAluminum_blue_noanimation].

                                                                var elements1 = document.getElementsByClassName('brushedAluminum_blue_noanimation');
                                                                for (var j = 0; j < elements1.length; j++) {
                                                                    elements1[j].style.opacity = '1.0';
                                                                }

                                                                var elements1 = document.getElementsByClassName('brushedAluminum_blue');
                                                                for (var j = 0; j < elements1.length; j++) {
                                                                    elements1[j].style.opacity = '1.0';
                                                                }

                                                            } catch (e) {
                                                                var msg = 'Exception in In bwCalendar.js.loadAndRenderEmails_Search.dragend(): ' + e.message + ', ' + e.stack;
                                                                console.log(msg);
                                                                alert(msg);
                                                            }
                                                        });

                                                    }

                                                    thiz.options.divEmailPicker_scroll_ticking = false; // We have completed our work, now turn on the scroll detection again.

                                                }).catch(function (e) {



                                                });

                                        }


                                    }).catch(function (e) {



                                    });

                            }

                        }).catch(function (e) {



                        });

                }

            }).catch(function (e) {



            });

    },
    getAndRenderPagedEmails_Search: function (offset, limit) {
        var thiz = this;
        return new Promise(function (resolve, reject) {
            try {
                console.log('In bwCalendar.js.getAndRenderPagedEmails_Search().');
                //alert('In bwCalendar.js.getAndRenderPagedEmails_Search().');

                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');


                document.getElementById('inputBwAuthentication_SearchBox').blur(); // This is here to prevent the search box from getting the cursor and showing the keyboard.

                var searchTerm = String($('#inputBwAuthentication_SearchBox').val()).trim();

                //ShowActivitySpinner('Searching your Inbox [we need to add support for the sent emails etc.] for "' + searchTerm + '"...');


                var data = {
                    bwParticipantId_LoggedIn: participantId,
                    bwActiveStateIdentifier: activeStateIdentifier,
                    bwWorkflowAppId_LoggedIn: workflowAppId,

                    offset: offset,
                    limit: limit,
                    searchTerm: searchTerm,
                    mailbox: 'INBOX' // mailbox: ['INBOX', 'SENT', ...]
                    //bwWorkflowAppId: workflowAppId,
                    //bwParticipantId: participantId,
                };

                $.ajax({
                    url: thiz.options.operationUriPrefix + "_bw/participantemail_search",
                    type: 'POST',
                    data: data,
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    },
                    success: function (results) {
                        try {

                            console.log('xcx23213. These pids change. Often I get the 2 first with a pid, then the remaining 2 with another pid. This may be the round-robin behavior? pid: ' + results.pid);

                            if (results.status != 'SUCCESS') {

                                var msg = results.status + ': ' + results.message;
                                console.log(msg);
                                displayAlertDialog(msg);

                            } else {

                                if (!(thiz.options.Search && thiz.options.Search.docs && thiz.options.Search.docs.length)) {

                                    // The options.Search is empty, so just load it directly.
                                    thiz.options.Search = results.results;

                                } else {

                                    // The options.Search has some emails in it already, so load it like this.
                                    for (var i = 0; i < results.results.docs.length; i++) {
                                        thiz.options.Search.docs.push(results.results.docs[i]); // With pagination.
                                    }

                                    thiz.options.Search.totalDocs = results.results.totalDocs;
                                    thiz.options.Search.offset = results.results.offset;
                                    thiz.options.Search.limit = results.results.limit;
                                    thiz.options.Search.totalPages = results.results.totalPages;
                                    thiz.options.Search.page = results.results.page;
                                    thiz.options.Search.pagingCounter = results.results.pagingCounter;
                                    thiz.options.Search.hasPrevPage = results.results.hasPrevPage;
                                    thiz.options.Search.hasNextPage = results.results.hasNextPage;
                                    thiz.options.Search.prevPage = results.results.prevPage;
                                    thiz.options.Search.nextPage = results.results.nextPage;

                                }

                                if (!thiz.options.Search.docs.length || thiz.options.Search.docs.length == 0) {

                                    var html = '';

                                    html += '<tr><td><span style="font-size:10pt;font-weight:normal;color:black;">';
                                    html += '  There are no emails in the Search.';
                                    html += '<span></td></tr>';

                                    $(thiz.element).find('#tableEmailPicker').append(html);

                                    if ($(thiz.element).find('#spanSelectedEmail') && $(thiz.element).find('#spanSelectedEmail')[0]) {
                                        $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = '';
                                    }

                                } else {

                                    var element = $(thiz.element).find('#tableEmailPicker')[0];

                                    for (var i = 0; i < results.results.docs.length; i++) {

                                        thiz.renderMailboxItemInList(results.results.docs[i], element, 'Search'); // Generate the email listing HTML.

                                    }

                                    thiz.resize();

                                }

                            }

                            var result = {
                                status: 'SUCCESS',
                                message: 'SUCCESS',
                                length: results.results.docs.length
                            }
                            resolve(result);

                        } catch (e) {

                            var msg = 'Exception in bwCalendar.js.getAndRenderPagedEmails_Search():2: ' + e.message + ', ' + e.stack;
                            console.log(msg);

                            var result = {
                                status: 'EXCEPTION',
                                message: msg
                            }
                            reject(result);

                        }

                    },
                    error: function (data, errorCode, errorMessage) {

                        var msg = 'Error in bwCalendar.js.getAndRenderPagedEmails_Search():1: ' + errorCode + ', ' + errorMessage;
                        console.log(msg);

                        var result = {
                            status: 'EXCEPTION',
                            message: msg
                        }
                        reject(result);

                    }

                });

            } catch (e) {

                var msg = 'Exception in bwCalendar.js.getAndRenderPagedEmails_Search(): ' + e.message + ', ' + e.stack;
                console.log(msg);

                var result = {
                    status: 'EXCEPTION',
                    message: msg
                }
                reject(result);

            }

        });

    },
    viewIndividualEmail_Search: function (originElementId, bwParticipantId, bwParticipantFriendlyName, bwParticipantEmail, _id) {
        try {
            console.log('In bwCalendar.js.viewIndividualEmail_Search(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ', _id: ' + _id);
            //displayAlertDialog_Persistent('In bwCalendar.js.viewIndividualEmail_Search(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ', _id: ' + _id);
            var thiz = this;

            this.displayExistingMessageHtml().then(function (results) {
                try {
                    if (results.status != 'SUCCESS') {

                        var msg = 'Error in bwCalendar.js.viewIndividualEmail_Search(): ' + results.message;
                        console.log(msg);
                        displayAlertDialog(msg);

                    } else {

                        console.log('In bwCalendar.js.viewIndividualEmail_Search(). Successfully returned from displayExistingMessageHtml().');

                        thiz.loadIndividualEmail_Search(_id).then(function () {
                            try {

                                // Display the top buttons. Include reply, reply-all, forward, as appropriate.
                                var html = '';
                                //html += 'From: <span class="EmailAddress_From">' + emailAddress + '</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'; // + '[Reply]  [Reply All]  [Forward]';
                                html += '<span class="emailEditor_newMessageButton" xcx="xcx2134264-3" onclick="$(\'.bwCalendar:first\').bwCalendar(\'composeANewEmailMessage_Reply\');">&nbsp;✉&nbsp;Reply&nbsp;</span>';
                                html += '&nbsp;&nbsp;&nbsp;';
                                html += '<span class="emailEditor_newMessageButton" onclick="$(\'.bwCalendar:first\').bwCalendar(\'composeANewEmailMessage_Reply\');">&nbsp;✉&nbsp;Reply All&nbsp;</span>';
                                html += '&nbsp;&nbsp;&nbsp;';
                                html += '<span class="emailEditor_newMessageButton" onclick="$(\'.bwCalendar:first\').bwCalendar(\'composeANewEmailMessage_Reply\');">&nbsp;✉&nbsp;Forward&nbsp;</span>';
                                $('#bwCalendar_EmailTopButtons').html(html);


                                thiz.renderIndividualEmail_ReadOnly(_id, 'Search').then(function (results) { // strMailbox: ['Inbox', 'Sent', etc.]
                                    try {
                                        debugger;
                                        if (results.status != 'SUCCESS') {

                                            var msg = 'Error in bwCalendar.js.viewIndividualEmail_Search(): ' + results.message;
                                            console.log(msg);
                                            displayAlertDialog(msg);

                                        } else {

                                            var _email = results.email;

                                            if (_email.hasOwnProperty('TheUserHasReadThisEmail') && (_email.TheUserHasReadThisEmail == true)) {

                                                console.log('xcx87090000-1. CHECKING TO CHANGE THE READ EMAIL UI. _email.TheUserHasReadThisEmail: ' + _email.TheUserHasReadThisEmail);

                                            } else {

                                                //
                                                //
                                                // This email is marked as unread, so we do a web service call here to mark this email as read on the server. 11-2-2023.
                                                //
                                                //

                                                console.log('xcx87090000-1. CHECKING TO CHANGE THE READ EMAIL UI. _email.TheUserHasReadThisEmail: ' + _email.TheUserHasReadThisEmail + '. This email is marked as unread, so we do a web service call here to mark this email as read on the server. 11-2-2023. _email._id: ' + _email._id);

                                                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                                                var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                                                var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                                                var data = {
                                                    bwParticipantId_LoggedIn: participantId,
                                                    bwActiveStateIdentifier: activeStateIdentifier,
                                                    bwWorkflowAppId_LoggedIn: workflowAppId,

                                                    bwWorkflowAppId: workflowAppId,
                                                    bwParticipantId: participantId,
                                                    _id: _email._id
                                                };

                                                $.ajax({
                                                    url: thiz.options.operationUriPrefix + "_bw/marksingleemailasread",
                                                    type: "POST",
                                                    data: data,
                                                    headers: {
                                                        "Accept": "application/json; odata=verbose"
                                                    },
                                                    success: function (results) {
                                                        try {

                                                            if (results.status != 'SUCCESS') {

                                                                var msg = 'Error in bwCalendar.js.viewIndividualEmail_Search(): ' + results.message;
                                                                console.log(msg);
                                                                displayAlertDialog(msg);

                                                            } else {

                                                                console.log('The email was successfully marked as read. _email._id: ' + _email._id + ', results.message: ' + results.message);

                                                                for (var i = 0; i < thiz.options.Search.docs.length; i++) {
                                                                    if (thiz.options.Search.docs[i]._id == _email._id) { // We can't use message_id because it may have an @ sign in it, which is not allowed in a valid html element id.

                                                                        thiz.options.Search.docs[i]["TheUserHasReadThisEmail"] = true;

                                                                        var mailboxEmails = $(thiz.element).find('.bwEmailMailboxRow');

                                                                        for (var j = 0; j < mailboxEmails.length; j++) {

                                                                            var tmpId = $(mailboxEmails[j]).attr('_id');
                                                                            if (tmpId == _email._id) {

                                                                                // We have found the email entry. Change the UI.
                                                                                var emailAddressElement = $(mailboxEmails[j]).find('.bwEmailMailboxRow_EmailAddress')[0];
                                                                                var subjectElement = $(mailboxEmails[j]).find('.bwEmailMailboxRow_Subject')[0];
                                                                                $(emailAddressElement).css('fontWeight', 'normal');
                                                                                $(subjectElement).css('fontWeight', 'lighter');
                                                                                break;

                                                                            }
                                                                        }

                                                                        break;

                                                                    }
                                                                }

                                                                // Done

                                                            }

                                                        } catch (e) {
                                                            var msg = 'Exception in bwCalendar.js.viewIndividualEmail_Search():8: ' + e.message + ', ' + e.stack;
                                                            console.log(msg);
                                                            displayAlertDialog(msg);
                                                        }
                                                    },
                                                    error: function (data, errorCode, errorMessage) {
                                                        var msg = 'Error in bwCalendar.js.viewIndividualEmail_Search(): ' + errorCode + ', ' + errorMessage;
                                                        console.log(msg);
                                                        displayAlertDialog(msg);
                                                    }
                                                });

                                            }

                                        }

                                    } catch (e) {
                                        var msg = 'Exception in bwCalendar.js.viewIndividualEmail_Search():7: ' + e.message + ', ' + e.stack;
                                        console.log(msg);
                                        displayAlertDialog(msg);
                                    }

                                }).catch(function (e) {
                                    var msg = 'Exception in bwCalendar.js.viewIndividualEmail_Search():6: ' + JSON.stringify(e);
                                    console.log(msg);
                                    displayAlertDialog(msg);
                                });

                            } catch (e) {
                                var msg = 'Exception in bwCalendar.js.viewIndividualEmail_Search():5: ' + e.message + ', ' + e.stack;
                                console.log(msg);
                                displayAlertDialog(msg);
                            }

                        }).catch(function (e) {
                            var msg = 'Exception in bwCalendar.js.viewIndividualEmail_Search():4: ' + JSON.stringify(e);
                            console.log(msg);
                            displayAlertDialog(msg);
                        });

                    }

                } catch (e) {
                    var msg = 'Exception in bwCalendar.js.viewIndividualEmail_Search():3: ' + e.message + ', ' + e.stack;
                    console.log(msg);
                    displayAlertDialog(msg);
                }

            }).catch(function (e) {
                var msg = 'Exception in bwCalendar.js.viewIndividualEmail_Search():2: ' + JSON.stringify(e);
                console.log(msg);
                displayAlertDialog(msg);
            });


        } catch (e) {
            console.log('Exception in bwCalendar.js.viewIndividualEmail_Search(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ': ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCalendar.js.viewIndividualEmail_Search(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ': ' + e.message + ', ' + e.stack);
        }
    },
    loadIndividualEmail_Search: function (_id) {
        var thiz = this;
        return new Promise(function (resolve, reject) {
            try {
                console.log('In bwCalendar.js.loadIndividualEmail_Search(). _id: ' + _id);
                //displayAlertDialog_Persistent('In bwCalendar.js.loadIndividualEmail_Search(). _id: ' + _id);

                var hasBeenLoaded;
                for (var i = 0; i < thiz.options.Search.length; i++) {
                    if (thiz.options.Search[i]._id == _id) {

                        if (thiz.options.Search[i].html) {
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

                        var msg = 'Error in bwCalendar.js.loadIndividualEmail_Search(): Invalid value. Expected values for workflowAppId: ' + workflowAppId + ', participantId: ' + participantId + ', _id: ' + _id;
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
                                   
                                    if (results.status != 'SUCCESS') {

                                        var msg = 'Error in bwCalendar.js.loadIndividualEmail_Search():xcx542: results: ' + JSON.stringify(results);
                                        console.log(msg);

                                        var result = {
                                            status: 'ERROR',
                                            message: msg
                                        }
                                        reject(result);

                                    } else {
                                        debugger;
                                        if (!results.doc) {

                                            console.log('xcx2131234-3-1 NO RESULTS!!!! results.results: ' + JSON.stringify(results.results) + ', data: ' + JSON.stringify(data));
                                            alert('xcx2131234-3-1 NO RESULTS!!!! results.results: ' + JSON.stringify(results.results) + ', data: ' + JSON.stringify(data));

                                        } else {

                                            var foundIt;
                                            for (var i = 0; i < thiz.options.Search.docs.length; i++) {
                                                if (thiz.options.Search.docs[i]._id == _id) {

                                                    thiz.options.Search.docs[i] = results.doc; // This is where we load the entire email into the mailbox.
                                                    foundIt = true;

                                                }
                                            }

                                            if (!foundIt) {

                                                var msg = 'Error in bwCalendar.js.loadIndividualEmail_Search():xcx231312-2: Could not find the email with _id: ' + _id;
                                                console.log(msg);

                                                var result = {
                                                    status: 'ERROR',
                                                    message: msg
                                                }
                                                reject(result);

                                            } else {

                                                var result = {
                                                    status: 'SUCCESS',
                                                    message: 'The email contents have added to the mailbox so that it available to be viewed.'
                                                }
                                                resolve(result);

                                            }

                                        }

                                    }

                                } catch (e) {

                                    var msg = 'Exception in bwCalendar.js.loadIndividualEmail_Search():2: ' + e.message + ', ' + e.stack;
                                    console.log(msg);

                                    var result = {
                                        status: 'EXCEPTION',
                                        message: msg
                                    }
                                    reject(result);

                                }
                            },
                            error: function (data, errorCode, errorMessage) {

                                var msg = 'Error in bwCalendar.js.loadIndividualEmail_Search():' + errorCode + ', ' + errorMessage;
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

                var msg = 'Exception in bwCalendar.js.loadIndividualEmail_Search():xcx453: ' + e.message + ', ' + e.stack;

                var result = {
                    status: 'EXCEPTION',
                    message: msg
                }
                reject(result);

            }

        })
    },




    displayNewMessageEditorHtml: function (email) {
        var thiz = this;
        return new Promise(function (resolve, reject) {
            try {
                console.log('In bwCalendar.js.displayNewMessageEditorHtml().');
                //alert('In bwCalendar.js.displayNewMessageEditorHtml().');

                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');

                var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                // Set the right column to vertical-align: top;
                var x = document.getElementById('tdbwCalendar_RightColumn');
                x.style.verticalAlign = 'top';
                // end: Set the right column to vertical-align: top;

                //// Display the top buttons.
                //html = '';
                //html += '<button xcx="xcx213124-1-2" class="BwSmallButton" onclick="$(\'.bwCalendar:first\').bwCalendar(\'SendSingleEmailNow\');">SEND NOW >></button>';
                //html += '&nbsp;&nbsp;&nbsp;&nbsp;';
                //html += '<button xcx="xcx213124-1" class="BwSmallButton" style="color:red;font-weight:bold;" onclick="$(\'.bwCalendar:first\').bwCalendar(\'saveDraft\');">SAVE DRAFT</button>';
                //$('#bwCalendar_EmailTopButtons').html(html);
                //// end: Display the top buttons.

                if (email && email._id) {
                    $(thiz.element).find('#divEmailClient_CompositionWindow')[0].setAttribute('_id', email._id);
                } else {
                    $(thiz.element).find('#divEmailClient_CompositionWindow')[0].setAttribute('_id', 'NEW_EMAIL');
                }



                // Render the From, To, Subject, and email Body. Also instantiate summernote.
                html = '';

                html += '<div style="margin-bottom:10px;"><div style="width:80px;display:inline-block;">To:</div>';
                html += '<input xcx="xcx2131123-2" type="text" id="bwCalendar_RecipientsList" style="WIDTH: 85%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';
                html += '<div id="bwCalendar_RecipientsList_PeoplePicker" style="display:none;"></div>';
                html += '</div>';

                html += '<div style="margin-bottom:10px;"><div style="width:80px;display:inline-block;">From:</div>';
                html += '<input type="text" value="' + participantEmail + '" id="bwCalendar_From" xcx="xcx2314" readonly="true" style="WIDTH: 85%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';
                html += '</div>';

                html += '<div style="margin-bottom:10px;"><div style="width:80px;display:inline-block;">Subject:</div>';
                html += '<input type="text" id="bwCalendar_EmailSubject" style="WIDTH: 85%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';
                html += '</div>';

                html += '<br />';

                html += '<table>';
                html += '<tr>';
                html += '   <td xcx="xcx123123536-1" style="vertical-align:top;">';
                html += '       Add files as attachments:';
                html += '       <div id="divBbwCalendar_BwAttachments"></div>';
                html += '   </td>';

                html += '   <td></td>';

                html += '   <td style="vertical-align:top;">';
                html += '       Add files inline in the email body:';
                html += '       <div id="divBbwCalendar_BwAttachments_Inline"></div>';
                html += '   </td>';
                html += '</tr>';
                html += '</table>';

                html += '<div xcx="xcx342352153145" id="bwCalendar_EmailBody" class="xdTextBoxRequired bwRequestJson" contenteditable="true" bwdatarequired="true" title="" style="height:500px; min-height: 100% !important;WORD-WRAP: break-word; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%;BACKGROUND-COLOR: white;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';
                html += '</div>';

                //$('#spanSelectedEmail').html(html); // divEmailClient_CompositionWindow
                $('#divEmailClient_CompositionWindow').html(html);

                var bodyElement = $(thiz.element).find('#bwCalendar_EmailBody')[0];

                //
                // We have to do this to make the [enter] key work as expected, without inserting p/paragraph elemenets.
                //

                console.log('In bwCalendar.js.displayNewMessageEditorHtml(). THIS IS THE ONLY PLACE WHERE THE SUMMERNOTE OBJECT SHOULD BE INSTANTIATED.');

                // "Is it possible to default to <br> instead of <p> on enter?" YES. See here: https://github.com/summernote/summernote/issues/546
                $.summernote.dom.emptyPara = "<div><br></div>"; // monkeypatch.

                $.extend($.summernote.plugins, {
                    'brenter': function (context) {
                        this.events = {
                            'summernote.enter': function (we, e) {
                                //get hold of the enter event and trigger a shift+enter keypress

                                e.trigger($.Event("keydown", {
                                    keyCode: 13, // ENTER
                                    shiftKey: true
                                }));

                                //stop the normal event from happening
                                e.preventDefault();
                            }
                        };
                    }
                });

                //
                // end: We have to do this to make the [enter] key work as expected, without inserting p/paragraph elemenets.
                //

                $(bodyElement).summernote({
                    placeholder: '', // data[0].Body, //'Hello stand alone ui',
                    tabsize: 2,
                    minHeight: 500,
                    //height: 400, // If you don’t set the height, editable area’s height will change according to contents. See: https://github.com/summernote/summernote/issues/1441 // 6-20-2024.
                    //airMode: true,
                    toolbar: [
                        ['style', ['style']],
                        ['font', ['bold', 'underline', 'clear']],
                        ['color', ['color']],
                        ['para', ['ul', 'ol', 'paragraph']],
                        ['table', ['table']],
                        ['insert', ['link', 'picture', 'video']],
                        ['view', ['codeview', 'help']]
                    ],
                    fontName: 'Calibri', //, Helvetica, sans-serif',
                    fontSize: '12'
                });
                debugger;

                //if (email) {
                //    alert('In bwCalendar.js.displayNewMessageEditorHtml(). Instantiating bwAttachments_ForEmail_ATTACHMENTS.js. email._id: ' + email._id);
                //} else {
                //    alert('In bwCalendar.js.displayNewMessageEditorHtml(). Instantiating bwAttachments_ForEmail_ATTACHMENTS.js.');
                //}

                $('#divBbwCalendar_BwAttachments').bwAttachments_ForEmail_ATTACHMENTS({ ATTACHMENTS: true });

                $('#divBbwCalendar_BwAttachments_Inline').bwAttachments_ForEmail_INLINE({ INLINE: true });

                //
                // Recipients list autocomplete for element [bwCalendar_RecipientsList].
                //

                $('#bwCalendar_RecipientsList_PeoplePicker').empty(); // Clear the search text box.

                // Now we can hook up the Participant text box for autocomplete.
                $("#bwCalendar_RecipientsList").autocomplete({
                    source: function (request, response) {
                        try {
                            //
                            // The user types their search term after the last email... meaning after the last semi-colon [;].
                            //
                            var searchTerm;

                            var emailsArray = request.term.split(';');
                            if (emailsArray.length && (emailsArray.length > 1)) {

                                searchTerm = emailsArray[emailsArray.length - 1];

                            } else {

                                searchTerm = request.term;

                            }

                            if (searchTerm == '') {
                                //this.renderAllParticipantsInThePeoplePicker(); // Nothing is in the search box, so show all participants.
                            } else {

                                $.ajax({
                                    url: webserviceurl + "/emailrecipientssearch/" + workflowAppId + "/" + participantId + "/" + activeStateIdentifier + "/" + searchTerm,
                                    success: function (results) {
                                        try {
                                            $('#bwCalendar_RecipientsList_PeoplePicker').html(''); // bwCalendar_RecipientsList_PeoplePicker

                                            var alreadyDisplayedEmailsArray = [];

                                            var html = '';

                                            if (results.data.length > 0) {

                                                for (var i = 0; i < results.data.length; i++) {

                                                    var emails = results.data[i];
                                                    if (emails.split(';').length == 1) {

                                                        var email = String(results.data[i]).replaceAll('"', '').trim();

                                                        if (alreadyDisplayedEmailsArray.indexOf(email) > -1) {

                                                            // Do nothing, this email address is displayed already.

                                                        } else {

                                                            alreadyDisplayedEmailsArray.push(email);

                                                            //html += email;

                                                            html += '<a style="cursor:pointer !important;text-decoration:underline;" onclick="$(\'.bwCalendar\').bwCalendar(\'cmdReturnEmailToToField\', \'' + email + '\');">' + email + '</a>'; // cmdReturnParticipantIdToFieldForJson


                                                            //html += '<a style="cursor:pointer !important;text-decoration:underline;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'cmdReturnParticipantIdToFieldForJson\', \'' + roleId + '\', \'' + roleName + '\', \'' + divisionIndex + '\', \'' + groupIndex + '\', \'' + entityIndex + '\', \'' + locationIndex + '\', \'' + data.participants[i].participant.split('|')[0] + '\', \'' + data.participants[i].participant.split('|')[1] + '\', \'' + data.participants[i].participant.split('|')[2] + '\');">' + data.participants[i].participant.split('|')[0] + '&nbsp;&nbsp;<i>(' + data.participants[i].participant.split('|')[2] + ')</i></a>';
                                                            html += '<br />';

                                                        }

                                                    }

                                                }

                                            } else {

                                                // There were no results.
                                                html += '<span><i>There were no results</i></span>';

                                            }

                                            $('#bwCalendar_RecipientsList_PeoplePicker').append(html);

                                            document.getElementById('bwCalendar_RecipientsList_PeoplePicker').style.display = 'inline';

                                        } catch (e) {
                                            var msg = 'Exception in bwCalendar.js.displayNewMessageEditorHtml.bwCalendar_RecipientsList.autocomplete.ajax(): ' + e.message + ', ' + e.stack;
                                            console.log(msg);
                                            alert(msg);
                                        }
                                    },
                                    error: function (results) {

                                        displayAlertDialog('ERROR! xcx23123123.');

                                    }
                                });
                            }

                        } catch (e) {
                            var msg = 'Exception in bwCalendar.js.displayNewMessageEditorHtml.bwCalendar_RecipientsList.autocomplete(): ' + e.message + ', ' + e.stack;
                            console.log(msg);
                            alert(msg);
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
                        //var peoplePickerParticipantName = this.value.split('|')[0];
                        //var peoplePickerParticipantId = this.value.split('|')[1];
                        //var peoplePickerParticipantEmail = this.value.split('|')[2];

                        //if (peoplePickerParticipantName.indexOf('undefined') > -1) {
                        //    document.getElementById('txtPeoplePickerDialogSearchBox').value = '';
                        //    document.getElementById('txtPeoplePickerDialogParticipantId').value = '';
                        //    document.getElementById('txtPeoplePickerDialogParticipantEmail').value = '';
                        //} else {
                        //    document.getElementById('txtPeoplePickerDialogSearchBox').value = peoplePickerParticipantName; //this.value.split(' ')[0] + ' ' + this.value.split(' ')[1]; // Just shows the Loan Number parameter (removing the borrower name) so it fits in the text box.
                        //    document.getElementById('txtPeoplePickerDialogParticipantId').value = peoplePickerParticipantId;
                        //    document.getElementById('txtPeoplePickerDialogParticipantEmail').value = peoplePickerParticipantEmail;
                        //}
                    }
                });

                // List all participants.
                //this.renderAllParticipantsInThePeoplePickerForJson(roleId, roleName, divisionIndex, groupIndex, entityIndex, locationIndex); // We do this the first time to make sure they are all displayed.

                //
                // end: Recipients list autocomplete for element [bwCalendar_RecipientsList].
                //















                ////
                //// BROWSER COMPATIBILITY FOR DRAG-AND-DROP and RIGHT-CLICK to PASTE.
                ////

                //// BRAVE has full support:
                ////      - Drag and drop to paste (invokes the drop event) - DataTransfer
                ////      - Right click to paste (invokes the paste event) - ClipboardData

                //// FIREFOX has partial support:
                ////      - Drag and drop to paste <<< NO SUPPORT/DOESNT WORK >>> STILL DOESNT WORK AFTER NEW CHANGES TO BACKGROUND IMAGE.
                ////      - Right click to paste (invokes the paste event) - ClipboardData

                //// FIXED >>> EDGE has full support: The issue was the image!!!! I made it a background-image to circumvent this behaviour. 11-27-2023.
                ////      - Drag and drop to paste (invokes the drop event) - DataTransfer
                ////      - Right click to paste <<< NO SUPPORT/DOESNT WORK. The right-click context-menu paste option displays but is disabled.

                //// FIXED >>> CHROME has full support: The issue was the image!!!! I made it a background-image to circumvent this behaviour. 11-27-2023.
                ////      - Drag and drop to paste (invokes the drop event) - DataTransfer
                ////      - Right click to paste <<< NO SUPPORT/DOESNT WORK. The right-click context-menu paste option displays but is disabled.

                //// SAFARI
                ////
                ////

                //// CHROME on MacOs
                ////
                ////

                //// BRAVE on MacOs
                ////
                ////
                ////

                //dropzone.addEventListener('drop', function (e) {
                //    try {
                //        console.log('In bwCalendar.js.composeANewEmailMessage.dropzone.drop().');
                //        e.preventDefault();

                //        var gotData;
                //        if (e.clipboardData) {
                //            console.log('In bwCalendar.js.composeANewEmailMessage.dropzone.drop(). Object is event.clipboardData.');
                //            gotData = true;
                //        } else if (e.dataTransfer) {
                //            console.log('In bwCalendar.js.composeANewEmailMessage.dropzone.drop(). Object is event.dataTransfer.');
                //            gotData = true;
                //        } else if (window.clipboardData) {
                //            console.log('In bwCalendar.js.composeANewEmailMessage.dropzone.drop(). Object is window.clipboardData.');
                //            gotData = true;
                //        } else {

                //            if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                //                alert('FIREFOX BROWSER CANNOT DRAG-AND-DROP EXTERNAL FILES. THERE IS A WORK-AROUND: Please right click on your source file, and choose "COPY". Subsequently, right click here and choose "PASTE".');
                //            } else {
                //                alert('Error in bwCalendar.js.composeANewEmailMessage.dropzone.drop(). Could not find a valid DataTransfer object. e: ' + JSON.stringify(e) + ', navigator.userAgent: ' + navigator.userAgent);
                //            }

                //        }

                //        if (gotData == true) {
                //            thiz.dodrop(e, bwBudgetRequestId);
                //        } else {
                //            alert('Error in bwCalendar.js.composeANewEmailMessage.dropzone.drop(). Could not find a valid DataTransfer object.');
                //        }

                //    } catch (e) {
                //        var msg = 'Exception in bwCalendar.js.composeANewEmailMessage.dropzone.drop(): ' + e.message + ', ' + e.stack;
                //        console.log(msg);
                //        alert(msg);
                //    }
                //});

                //dropzone.addEventListener('paste', function (e) {
                //    try {
                //        console.log('In bwCalendar.js.composeANewEmailMessage.dropzone.paste().');
                //        e.preventDefault();

                //        var gotData;
                //        if (e.clipboardData) {
                //            console.log('In bwCalendar.js.composeANewEmailMessage.dropzone.paste(). Object is event.clipboardData.');
                //            gotData = true;
                //        } else if (e.dataTransfer) {
                //            console.log('In bwCalendar.js.composeANewEmailMessage.dropzone.paste(). Object is event.dataTransfer.');
                //            gotData = true;
                //        } else if (window.clipboardData) {
                //            console.log('In bwCalendar.js.composeANewEmailMessage.dropzone.paste(). Object is window.clipboardData.');
                //            gotData = true;
                //        } else {

                //            if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                //                alert('FIREFOX BROWSER CANNOT DRAG-AND-DROP EXTERNAL FILES. THERE IS A WORK-AROUND: Please right click on your source file, and choose "COPY". Subsequently, right click here and choose "PASTE".');
                //            } else {
                //                alert('Error in bwCalendar.js.composeANewEmailMessage.dropzone.paste(). Could not find a valid DataTransfer object. e: ' + JSON.stringify(e) + ', navigator.userAgent: ' + navigator.userAgent);
                //            }

                //        }

                //        if (gotData == true) {
                //            thiz.dodrop(e, bwBudgetRequestId);
                //        } else {
                //            alert('Error in bwCalendar.js.composeANewEmailMessage.dropzone.paste(). Could not find a valid DataTransfer object.');
                //        }

                //    } catch (e) {
                //        var msg = 'Exception in bwCalendar.js.composeANewEmailMessage.dropzone.paste(): ' + e.message + ', ' + e.stack;
                //        console.log(msg);
                //        alert(msg);
                //    }
                //});

                var result = {
                    status: 'SUCCESS',
                    message: 'SUCCESS',
                    email: email
                }

                resolve(result);

            } catch (e) {

                var msg = 'Exception in bwCalendar.js.displayNewMessageEditorHtml(): ' + e.message + ', ' + e.stack;

                var result = {
                    status: 'EXCEPTION',
                    message: msg
                }

                reject(result);

            }

        });

    },
    displayExistingMessageHtml: function () {
        var thiz = this;
        return new Promise(function (resolve, reject) {
            try {
                console.log('In bwCalendar.js.displayExistingMessageHtml().');
                //alert('In bwCalendar.js.displayExistingMessageHtml().');

                // Set the right column to vertical-align: top;
                var x = document.getElementById('tdbwCalendar_RightColumn');
                x.style.verticalAlign = 'top';
                // end: Set the right column to vertical-align: top;

                //
                //
                // THIS IS WHERE WE CREATE THE EMAIL SCREEN SPECIFICALLY FOR VIEWING (NOT EDITING) EMAILS. 6-27-2024.
                //
                //

                var html = '';

                html += '<div xcx="xcx213124676" style="height:5px;">&nbsp;</div>';


                // WAS: bwEmailView_To, bwEmailView_From, spanSelectedEmailSubject. NOW: bwCalendar_RecipientsList, bwCalendar_From, bwCalendar_EmailSubject.

                html += '<div style="margin-bottom:10px;"><div style="width:80px;display:inline-block;">From:</div>';
                html += '<input type="text" value="' + participantEmail + '" id="bwCalendar_From" xcx="xcx2314" readonly="true" style="WIDTH: 75%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';
                html += '&nbsp;&nbsp;&nbsp;&nbsp;<span id="bwCalendar_InternalExternalStatus" style="color:tomato;font-weight:bold;">[bwCalendar_InternalExternalStatus]</span>';
                html += '</div>';

                html += '<div style="margin-bottom:10px;"><div style="width:80px;display:inline-block;">To:</div>';
                html += '<input xcx="xcx2131123-2" type="text" id="bwCalendar_RecipientsList" style="WIDTH: 85%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';
                //html += '<div id="bwCalendar_RecipientsList_PeoplePicker" style="display:none;"></div>';
                html += '</div>';

                html += '<div style="margin-bottom:10px;"><div style="width:80px;display:inline-block;">Subject:</div>';
                html += '<input type="text" id="bwCalendar_EmailSubject" style="WIDTH: 85%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';
                html += '</div>';

                html += '<br />';

                html += '   <div id="bwCalendar_EmailAttachments"></div>';



                //html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                //html += 'Body:';
                //html += '</span>';
                //html == '<br />';
                //html += '   <div id="bwQuilltoolbar">';

                //html += '   </div>';
                html += '   <div id="bwCalendar_EmailBody" xcx="xcx132166-6" style="padding:15px 20px 10px 15px;border:2px solid lightgray;background-color:white;min-height:500px;"></div>'; // This style is pretty good. I like the white background and padding. 7-8-2024.

                html += '</div>';


                $('#divEmailClient_CompositionWindow').html(html);

                //$(thiz.element).find('#divEmailClient_CompositionWindow')[0].setAttribute('_id', 'NEW_EMAIL');

                //var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

                //if (bwWorkflowAppId != 'all') {
                //    bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                //}

                //this.options.pagingPage_SentEmail = 0; // If we want items to display properly, these need to be reset/set back to the beginning here.
                //this.options.pagingLimit_SentEmail = 20;

                //$('#spanSelectedEmailSubject').html('');

                //try {
                //    var html = '';

                //    // Display the top buttons.
                //    html += '                           <span xcx="xcx231232-2" class="emailEditor_topbarbutton" onclick="$(\'.bwCalendar\').bwCalendar(\'cmdDisplayDeleteSentEmailsDialog\', \'' + workflowAppId + '\');">';
                //    html += '                               <img title="Delete..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx123468" />&nbsp;Delete';
                //    html += '                           </span>';
                //    html += '&nbsp;&nbsp;';
                //    html += '                           <span xcx="xcx231232-2" class="emailEditor_topbarbutton" onclick="$(\'.bwCalendar\').bwCalendar(\'cmdDisplayDeleteSentEmailsDialog\', \'' + workflowAppId + '\', \'emptyfolder\');">';
                //    html += '                               <img title="Empty folder..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx23423467898">&nbsp;Empty folder';
                //    html += '                           </span>';
                //    $(thiz.element).find('#spanSelectedEmailType_TopButtons')[0].innerHTML = html; //'Pending Email';

                //    // Display the radio button and the title.
                //    html = '';
                //    html += '<input type="checkbox" id="checkboxToggleSentEmailCheckboxes" onchange="$(\'.bwCalendar\').bwCalendar(\'toggleSentEmailCheckboxes\', this);" />&nbsp;&nbsp;';
                //    html += '✉ Sent Items';

                //    $(thiz.element).find('#spanSelectedEmailType_Title')[0].innerHTML = html; //'Sent Email';

                //    // Make this button appear selected.
                //    $(thiz.element).find('#spanDisplaySentEmailButton').removeClass('bwCalendar_LeftMenuButton').addClass('bwCalendar_LeftMenuButton_Selected');
                //    $(thiz.element).find('#spanDisplayPendingEmailButton').removeClass('bwCalendar_LeftMenuButton_Selected').addClass('bwCalendar_LeftMenuButton');

                //} catch (e) { }

                //// Clear these in the beginning, because it may take a few seconds to re-populate, and this gives the user some visual feedback that something is going on.
                //$(thiz.element).find('#spanEmailPicker')[0].innerHTML = '';
                //$(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '';







                ////// zoom in 5-27-2024. <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                ////document.getElementById('divPageContent3').requestFullscreen();



                //$('.bwActiveMenu:first').bwActiveMenu('adjustInnerLeftSideMenu'); // Do this first here, then do it again once the web service call below has completed. This gives the user a better looking UI to look at.




                ////var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

                ////if (bwWorkflowAppId != 'all') {
                ////    bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                ////}

                //thiz.options.pagingPage_InboxEmail = 0; // If we want items to display properly, these need to be reset/set back to the beginning here.
                ////this.options.pagingLimit_SentEmail = 20;

                //$('#spanSelectedEmailSubject').html('');

                ////try {
                //var html = '';

                ////// Display the top buttons.
                ////alert('XCX4236777 Display the top buttons.');
                ////html += '                           <span xcx="xcx231232-1" class="emailEditor_topbarbutton" onclick="$(\'.bwCalendar\').bwCalendar(\'cmdDisplayDeleteInboxEmailsDialog\', \'' + bwWorkflowAppId + '\');">';
                ////html += '                               <img title="Delete..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx123468" />&nbsp;Delete';
                ////html += '                           </span>';
                ////html += '&nbsp;&nbsp;';
                ////html += '                           <span xcx="xcx231232-1" class="emailEditor_topbarbutton" onclick="$(\'.bwCalendar\').bwCalendar(\'cmdDisplayDeleteInboxEmailsDialog\', \'' + bwWorkflowAppId + '\', \'emptyfolder\');">';
                ////html += '                               <img title="Empty folder..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx23423467898">&nbsp;Empty folder';
                ////html += '                           </span>';
                ////$(thiz.element).find('#spanSelectedEmailType_TopButtons')[0].innerHTML = html; //'Pending Email';

                //// Display the radio button and the title.
                //html = '';
                //html += '<input type="checkbox" id="checkboxToggleSentEmailCheckboxes" onchange="$(\'.bwCalendar\').bwCalendar(\'toggleSentEmailCheckboxes\', this);" />&nbsp;&nbsp;';
                //html += '✉ Inbox Items';

                //$(thiz.element).find('#spanSelectedEmailType_Title')[0].innerHTML = html; //'Sent Email';

                //// Make this button appear selected.
                //$(thiz.element).find('#spanDisplaySentEmailButton').removeClass('bwCalendar_LeftMenuButton').addClass('bwCalendar_LeftMenuButton_Selected');
                //$(thiz.element).find('#spanDisplayPendingEmailButton').removeClass('bwCalendar_LeftMenuButton_Selected').addClass('bwCalendar_LeftMenuButton');

                ////} catch (e) { }

                //// Clear these in the beginning, because it may take a few seconds to re-populate, and this gives the user some visual feedback that something is going on.
                //$(thiz.element).find('#spanEmailPicker')[0].innerHTML = '';
                //$(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '';



                //thiz.renderEmails_Inbox(); // This gets our HTML ready. Could possible just be broken out and put here.



                //
                // This is our email. 12-12-2023.
                //

                //html += '<table id="tableEmailPicker" xcx="xcx111948475664" style="max-width:460px;">'; // width:460px;height:600px;overflow-y: scroll;overflow-x:hidden;
                //html += '</table>';
                ////html += '           </div>';

                //$(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;


































                //var html = '';

                //html += '               <span id="spanSelectedEmailSubject" style="font-size:13pt;font-weight:bold;color:#95b1d3;"></span>';
                //html += '               <br />';
                //html += '               <span id="spanSelectedEmail"></span>';

                //$('#divEmailClient_CompositionWindow').html(html);

                //$(thiz.element).find('#divEmailClient_CompositionWindow')[0].setAttribute('_id', 'NEW_EMAIL');

                ////$('#spanSelectedEmailSubject').html('[spanSelectedEmailSubject] xcx21313442 It would be great to get sending text messages working from here really well..');

                ////$('#spanSelectedEmail').html('[spanSelectedEmail]');


                //html = '';

                //html += '<button xcx="xcx213124-1-2" class="BwSmallButton" onclick="$(\'.bwCalendar:first\').bwCalendar(\'SendSingleEmailNow\');">SEND NOW >></button>';

                //html += '&nbsp;&nbsp;&nbsp;&nbsp;';
                //html += '<button xcx="xcx213124-1" class="BwSmallButton" style="color:red;font-weight:bold;" onclick="$(\'.bwCalendar:first\').bwCalendar(\'saveDraft\');">SAVE DRAFT</button>';

                //html += '&nbsp;&nbsp;&nbsp;&nbsp;';

                //html += '<br /><br />';

                //html += '<div style="margin-bottom:10px;"><div style="width:80px;display:inline-block;">To:</div>';
                //html += '<input xcx="xcx2131123-2" type="text" id="bwCalendar_RecipientsList" style="WIDTH: 85%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';
                //html += '<div id="bwCalendar_RecipientsList_PeoplePicker" style="display:none;"></div>';
                //html += '</div>';

                //html += '<div style="margin-bottom:10px;"><div style="width:80px;display:inline-block;">From:</div>';
                //html += '<input type="text" value="' + participantEmail + '" id="bwCalendar_From" xcx="xcx2314" readonly="true" style="WIDTH: 85%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';
                //html += '</div>';

                //html += '<div style="margin-bottom:10px;"><div style="width:80px;display:inline-block;">Subject:</div>';
                //html += '<input type="text" id="bwCalendar_EmailSubject" style="WIDTH: 85%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';
                //html += '</div>';

                //html += '<br />';

                //html += '<table>';
                //html += '<tr>';
                //html += '   <td xcx="xcx123123536-1" style="vertical-align:top;">';
                //html += '       Add files as attachments:';
                //html += '       <div id="divBbwCalendar_BwAttachments"></div>';
                //html += '   </td>';

                //html += '   <td></td>';

                //html += '   <td style="vertical-align:top;">';
                //html += '       Add files inline in the email body:';
                //html += '       <div id="divBbwCalendar_BwAttachments_Inline"></div>';
                //html += '   </td>';
                //html += '</tr>';
                //html += '</table>';

                //html += '<div xcx="xcx342352153145" id="bwCalendar_EmailBody" class="xdTextBoxRequired bwRequestJson" contenteditable="true" bwdatarequired="true" title="" style="height:500px; min-height: 100% !important;WORD-WRAP: break-word; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%;BACKGROUND-COLOR: white;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';
                //html += '</div>';

                //$('#spanSelectedEmail').html(html);




                //$('#divBbwCalendar_BwAttachments').bwAttachments_ForEmail_ATTACHMENTS({ ATTACHMENTS: true });

                //$('#divBbwCalendar_BwAttachments_Inline').bwAttachments_ForEmail_INLINE({ INLINE: true });














                ////
                //// BROWSER COMPATIBILITY FOR DRAG-AND-DROP and RIGHT-CLICK to PASTE.
                ////

                //// BRAVE has full support:
                ////      - Drag and drop to paste (invokes the drop event) - DataTransfer
                ////      - Right click to paste (invokes the paste event) - ClipboardData

                //// FIREFOX has partial support:
                ////      - Drag and drop to paste <<< NO SUPPORT/DOESNT WORK >>> STILL DOESNT WORK AFTER NEW CHANGES TO BACKGROUND IMAGE.
                ////      - Right click to paste (invokes the paste event) - ClipboardData

                //// FIXED >>> EDGE has full support: The issue was the image!!!! I made it a background-image to circumvent this behaviour. 11-27-2023.
                ////      - Drag and drop to paste (invokes the drop event) - DataTransfer
                ////      - Right click to paste <<< NO SUPPORT/DOESNT WORK. The right-click context-menu paste option displays but is disabled.

                //// FIXED >>> CHROME has full support: The issue was the image!!!! I made it a background-image to circumvent this behaviour. 11-27-2023.
                ////      - Drag and drop to paste (invokes the drop event) - DataTransfer
                ////      - Right click to paste <<< NO SUPPORT/DOESNT WORK. The right-click context-menu paste option displays but is disabled.

                //// SAFARI
                ////
                ////

                //// CHROME on MacOs
                ////
                ////

                //// BRAVE on MacOs
                ////
                ////
                ////

                //dropzone.addEventListener('drop', function (e) {
                //    try {
                //        console.log('In bwCalendar.js.composeANewEmailMessage.dropzone.drop().');
                //        e.preventDefault();

                //        var gotData;
                //        if (e.clipboardData) {
                //            console.log('In bwCalendar.js.composeANewEmailMessage.dropzone.drop(). Object is event.clipboardData.');
                //            gotData = true;
                //        } else if (e.dataTransfer) {
                //            console.log('In bwCalendar.js.composeANewEmailMessage.dropzone.drop(). Object is event.dataTransfer.');
                //            gotData = true;
                //        } else if (window.clipboardData) {
                //            console.log('In bwCalendar.js.composeANewEmailMessage.dropzone.drop(). Object is window.clipboardData.');
                //            gotData = true;
                //        } else {

                //            if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                //                alert('FIREFOX BROWSER CANNOT DRAG-AND-DROP EXTERNAL FILES. THERE IS A WORK-AROUND: Please right click on your source file, and choose "COPY". Subsequently, right click here and choose "PASTE".');
                //            } else {
                //                alert('Error in bwCalendar.js.composeANewEmailMessage.dropzone.drop(). Could not find a valid DataTransfer object. e: ' + JSON.stringify(e) + ', navigator.userAgent: ' + navigator.userAgent);
                //            }

                //        }

                //        if (gotData == true) {
                //            thiz.dodrop(e, bwBudgetRequestId);
                //        } else {
                //            alert('Error in bwCalendar.js.composeANewEmailMessage.dropzone.drop(). Could not find a valid DataTransfer object.');
                //        }

                //    } catch (e) {
                //        var msg = 'Exception in bwCalendar.js.composeANewEmailMessage.dropzone.drop(): ' + e.message + ', ' + e.stack;
                //        console.log(msg);
                //        alert(msg);
                //    }
                //});

                //dropzone.addEventListener('paste', function (e) {
                //    try {
                //        console.log('In bwCalendar.js.composeANewEmailMessage.dropzone.paste().');
                //        e.preventDefault();

                //        var gotData;
                //        if (e.clipboardData) {
                //            console.log('In bwCalendar.js.composeANewEmailMessage.dropzone.paste(). Object is event.clipboardData.');
                //            gotData = true;
                //        } else if (e.dataTransfer) {
                //            console.log('In bwCalendar.js.composeANewEmailMessage.dropzone.paste(). Object is event.dataTransfer.');
                //            gotData = true;
                //        } else if (window.clipboardData) {
                //            console.log('In bwCalendar.js.composeANewEmailMessage.dropzone.paste(). Object is window.clipboardData.');
                //            gotData = true;
                //        } else {

                //            if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                //                alert('FIREFOX BROWSER CANNOT DRAG-AND-DROP EXTERNAL FILES. THERE IS A WORK-AROUND: Please right click on your source file, and choose "COPY". Subsequently, right click here and choose "PASTE".');
                //            } else {
                //                alert('Error in bwCalendar.js.composeANewEmailMessage.dropzone.paste(). Could not find a valid DataTransfer object. e: ' + JSON.stringify(e) + ', navigator.userAgent: ' + navigator.userAgent);
                //            }

                //        }

                //        if (gotData == true) {
                //            thiz.dodrop(e, bwBudgetRequestId);
                //        } else {
                //            alert('Error in bwCalendar.js.composeANewEmailMessage.dropzone.paste(). Could not find a valid DataTransfer object.');
                //        }

                //    } catch (e) {
                //        var msg = 'Exception in bwCalendar.js.composeANewEmailMessage.dropzone.paste(): ' + e.message + ', ' + e.stack;
                //        console.log(msg);
                //        alert(msg);
                //    }
                //});

                var result = {
                    status: 'SUCCESS',
                    message: 'SUCCESS'
                }

                resolve(result);

            } catch (e) {

                var msg = 'Exception in bwCalendar.js.displayExistingMessageHtml(): ' + e.message + ', ' + e.stack;

                var result = {
                    status: 'EXCEPTION',
                    message: msg
                }

                reject(result);

            }

        });

    },

    renderIndividualEmail_Editable: function (_id, strMailbox) { // strMailbox: ['Inbox', 'Sent', etc.]
        var thiz = this;
        return new Promise(function (resolve, reject) {
            try {
                console.log('In bwCalendar.js.renderIndividualEmail_Editable().');
                //alert('In bwCalendar.js.renderIndividualEmail_Editable().');

                //alert('Setting dom element _id to: ' + _id);
                $(thiz.element).find('#divEmailClient_CompositionWindow')[0].setAttribute('_id', _id);

                $(thiz.element).find('.bwCalendar_InnerLeftMenuButton_Selected').removeClass('bwCalendar_InnerLeftMenuButton_Selected'); // Reset them all, only 1 can be selected at a time.
                $('#bwCalendar_InnerLeftMenuButton_' + _id).removeClass('bwCalendar_InnerLeftMenuButton').addClass('bwCalendar_InnerLeftMenuButton_Selected'); // Indicate this one as selected.

                var email;

                for (var i = 0; i < thiz.options[strMailbox].docs.length; i++) {

                    if (thiz.options[strMailbox].docs[i]._id == _id) { // We can't use message_id because it may have an @ sign in it, which is not allowed in a valid html element id.

                        email = thiz.options[strMailbox].docs[i];
                        break;

                    }
                }

                if (!email) {

                    var msg = 'Error in bwCalendar.js.renderIndividualEmail_Editable(). COULD NOT LOCATE EMAIL. _id: ' + _id + ', strMailbox: ' + strMailbox;
                    console.log(msg);
                    alert(msg);

                    var result = {
                        status: 'ERROR',
                        message: msg
                    }

                    reject(result);


                } else {

                    // Set the "From" field. 
                    var emailAddress = '';
                    if (email.from && email.from[0] && email.from[0].address) {
                        emailAddress = email.from[0].address;
                    } else {
                        emailAddress = email.from;
                    }
                    $('#bwCalendar_From').val(emailAddress);

                    var internalExternalStatus;
                    if (email.ThisEmailIsFromAnInternalSource == true) {
                        internalExternalStatus = 'INTERNAL';
                        //emailToHtml += '&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:tomato;font-weight:bold;">INTERNAL</span>';
                    } else {
                        internalExternalStatus = 'EXTERNAL';
                        //emailToHtml += '&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:tomato;font-weight:bold;">EXTERNAL</span>';
                    }
                    $('#bwCalendar_InternalExternalStatus').html(internalExternalStatus);


                    // Set the "To" field.
                    var toEmailAddress = '';
                    if (email.to && email.to[0] && email.to[0].address) {
                        toEmailAddress = email.to[0].address;
                    } else {
                        toEmailAddress = email.to;
                    }
                    var emailToHtml = toEmailAddress;
                    $('#bwCalendar_RecipientsList').val(emailToHtml);

                    thiz.cleanEmailBodyHtmlForDisplay(email.html).then(function (results) {
                        try {

                            if (results.status != 'SUCCESS') {

                                var result = {
                                    status: 'ERROR',
                                    message: results.message
                                }

                                reject(result);

                            } else {

                                $('#bwCalendar_EmailBody').summernote('code', results.html);

                                console.log('In bwCalendar.js.viewIndividualEmail_Inbox(). >>>>>>>>>> Here is a good opportunity to vertically stretch the .note-editor. xcx99385667.');
                                //alert('In bwCalendar.js.viewIndividualEmail_Inbox(). >>>>>>>>>> Here is a good opportunity to vertically stretch the .note-editor. xcx99385667.');

                                var emailTemplateForSubject;
                                if (email && email.subject) {
                                    emailTemplateForSubject = email.subject;
                                }
                                //var emailTemplate;
                                //if (email && email.html) {
                                //    emailTemplate = email.html;
                                //}
                                if (emailTemplateForSubject && emailTemplateForSubject != '') {
                                    $(thiz.element).find('#bwCalendar_EmailSubject')[0].value = emailTemplateForSubject;
                                } else {
                                    $(thiz.element).find('#bwCalendar_EmailSubject')[0].value = '';
                                }

                                //console.log('In bwCalendar.js.viewIndividualEmail_Inbox(). Turned off this call to bwActiveMenu.js.adjustLeftSideMenu(). DO WE NEED IT BACK????????? 12-24-2022');
                                // THIS IS THE FIRST TIME WE ARE USING setTimeout for the call to bwActiveMenu.adjustLeftSideMenu(). 4-25-2022
                                //setTimeout(function () { // Only needs to happen for Chrome.
                                //    // menu should be re-done since the display has probably resized from the display of the email.
                                //    //alert('Calling bwActiveMenu.adjustLeftSideMenu().');
                                //    displayAlertDialog('Calling bwActiveMenu.adjustLeftSideMenu(). xcx123423521-6.');
                                //    $('.bwActiveMenu').bwActiveMenu('adjustLeftSideMenu');
                                //}, 500);

                                //alert('xcx213123. DONE YET?? strMailbox: ' + strMailbox + ', email._id: ' + email._id);

                                if (strMailbox == 'Drafts') {

                                    $('.bwAttachments_ForEmail_ATTACHMENTS:first').bwAttachments_ForEmail_ATTACHMENTS('renderAndPopulateAttachments_ATTACHMENTS');

                                } else {


                                    debugger;
                                    thiz.renderAttachments(email._id, email.attachments);


                                }







                                var result = {
                                    status: 'SUCCESS',
                                    message: 'SUCCESS',
                                    email: email
                                }

                                resolve(result);

                            }

                        } catch (e) {

                            var msg = 'Exception in bwCalendar.js.renderIndividualEmail_Editable():3: ' + e.message + ', ' + e.stack;

                            var result = {
                                status: 'EXCEPTION',
                                message: msg
                            }

                            reject(result);

                        }

                    }).catch(function (e) {

                        var msg = 'Exception in bwCalendar.js.renderIndividualEmail_Editable():2: ' + JSON.stringify(e);

                        var result = {
                            status: 'EXCEPTION',
                            message: msg
                        }

                        reject(result);

                    });

                }

            } catch (e) {

                var msg = 'Exception in bwCalendar.js.renderIndividualEmail_Editable(): ' + e.message + ', ' + e.stack;

                var result = {
                    status: 'EXCEPTION',
                    message: msg
                }

                reject(result);

            }

        });
    },
    renderIndividualEmail_ReadOnly: function (_id, strMailbox) { // strMailbox: ['Inbox', 'Sent', 'Drafts', 'Junk', 'Archived', 'TrashBin']
        var thiz = this;
        return new Promise(function (resolve, reject) {
            try {
                console.log('In bwCalendar.js.renderIndividualEmail_ReadOnly().');
                debugger;
                $(thiz.element).find('#divEmailClient_CompositionWindow')[0].setAttribute('_id', _id);

                $(thiz.element).find('.bwCalendar_InnerLeftMenuButton_Selected').removeClass('bwCalendar_InnerLeftMenuButton_Selected'); // Reset them all, only 1 can be selected at a time.
                $('#bwCalendar_InnerLeftMenuButton_' + _id).removeClass('bwCalendar_InnerLeftMenuButton').addClass('bwCalendar_InnerLeftMenuButton_Selected'); // Indicate this one as selected.

                var email;
                debugger;
                for (var i = 0; i < thiz.options[strMailbox].docs.length; i++) {
                    if (thiz.options[strMailbox].docs[i]._id == _id) { // We can't use message_id because it may have an @ sign in it, which is not allowed in a valid html element id.

                        email = thiz.options[strMailbox].docs[i];
                        break;

                    }
                }

                if (!email) {

                    var msg = 'Error in bwCalendar.js.renderIndividualEmail_ReadOnly(). COULD NOT LOCATE EMAIL. _id: ' + _id + ', strMailbox: ' + strMailbox;

                    var result = {
                        status: 'ERROR',
                        message: msg
                    }

                    reject(result);


                } else {
                    debugger;
                    thiz.renderAttachments(email._id, email.attachments);

                    // Set the "From" field. 
                    var emailAddress = '';
                    if (email.from && email.from[0] && email.from[0].address) {
                        emailAddress = email.from[0].address;
                    } else {
                        emailAddress = email.from;
                    }
                    $('#bwCalendar_From').val(emailAddress);

                    var internalExternalStatus;
                    if (email.ThisEmailIsFromAnInternalSource == true) {
                        internalExternalStatus = 'INTERNAL';
                        //emailToHtml += '&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:tomato;font-weight:bold;">INTERNAL</span>';
                    } else {
                        internalExternalStatus = 'EXTERNAL';
                        //emailToHtml += '&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:tomato;font-weight:bold;">EXTERNAL</span>';
                    }
                    $('#bwCalendar_InternalExternalStatus').html(internalExternalStatus);


                    // Set the "To" field.
                    var toEmailAddress = '';
                    if (email.to && email.to[0] && email.to[0].address) {
                        toEmailAddress = email.to[0].address;
                    } else {
                        toEmailAddress = email.to;
                    }
                    var emailToHtml = toEmailAddress;
                    $('#bwCalendar_RecipientsList').val(emailToHtml);
                    debugger;
                    thiz.cleanEmailBodyHtmlForDisplay(email.html).then(function (results) {
                        try {

                            if (results.status != 'SUCCESS') {

                                var result = {
                                    status: 'ERROR',
                                    message: results.message
                                }

                                reject(result);

                            } else {

                                //
                                // LAST STEP: Display the email. If there are attachments, we come behind and backfill them. This makes it easier so we can use the DOM to do this.
                                //
                                console.log('Displaying the email. xcx23123435.');

                                $('#bwCalendar_EmailBody').html(email.html);
                                // end: LAST STEP.





                                var emailTemplateForSubject;
                                if (email && email.subject) {
                                    emailTemplateForSubject = email.subject;
                                }
                                //var emailTemplate;
                                //if (email && email.html) {
                                //    emailTemplate = email.html;
                                //}
                                if (emailTemplateForSubject && emailTemplateForSubject != '') {
                                    $(thiz.element).find('#bwCalendar_EmailSubject')[0].value = emailTemplateForSubject;
                                } else {
                                    $(thiz.element).find('#bwCalendar_EmailSubject')[0].value = '';
                                }

                                console.log('In bwCalendar.js.viewIndividualEmail_Inbox(). >>>>>>>>>> Here is a good opportunity to vertically stretch the .note-editor. xcx99385667.');
                                //alert('>> CALLING renderAttachments() xcx1231241.');

                                //console.log('In bwCalendar.js.viewIndividualEmail_Inbox(). Turned off this call to bwActiveMenu.js.adjustLeftSideMenu(). DO WE NEED IT BACK????????? 12-24-2022');
                                // THIS IS THE FIRST TIME WE ARE USING setTimeout for the call to bwActiveMenu.adjustLeftSideMenu(). 4-25-2022
                                //setTimeout(function () { // Only needs to happen for Chrome.
                                //    // menu should be re-done since the display has probably resized from the display of the email.
                                //    //alert('Calling bwActiveMenu.adjustLeftSideMenu().');
                                //    displayAlertDialog('Calling bwActiveMenu.adjustLeftSideMenu(). xcx123423521-6.');
                                //    $('.bwActiveMenu').bwActiveMenu('adjustLeftSideMenu');
                                //}, 500);

                                var result = {
                                    status: 'SUCCESS',
                                    message: 'SUCCESS',
                                    email: email
                                }

                                resolve(result);

                            }

                        } catch (e) {

                            var msg = 'Exception in bwCalendar.js.renderIndividualEmail_ReadOnly():3: ' + e.message + ', ' + e.stack;

                            var result = {
                                status: 'EXCEPTION',
                                message: msg
                            }

                            reject(result);

                        }

                    }).catch(function (e) {

                        var msg = 'Exception in bwCalendar.js.renderIndividualEmail_ReadOnly():2: ' + JSON.stringify(e);

                        var result = {
                            status: 'EXCEPTION',
                            message: msg
                        }

                        reject(result);

                    });

                }

            } catch (e) {

                var msg = 'Exception in bwCalendar.js.renderIndividualEmail_ReadOnly(): ' + e.message + ', ' + e.stack;

                var result = {
                    status: 'EXCEPTION',
                    message: msg
                }

                reject(result);

            }

        });
    },
    renderAttachments: function (_id, attachments) { // attachments is the array named attachments, from the email object/json.
        try {
            console.log('In bwCalendar.js.renderAttachments().');
            //alert('In bwCalendar.js.renderAttachments().');
            var thiz = this;

            if (attachments && attachments.length && (attachments.length > 0)) {
                debugger;
                var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

                for (var j = 0; j < attachments.length; j++) {

                    if (attachments[j].contentDisposition == 'attachment') {

                        console.log('xcx2312343 attachments[j].contentType: ' + attachments[j].contentType + '. attachments[j].fileName: ' + attachments[j].fileName); // eg: donuts.jpg
                        //alert('xcx2312343 attachments[j].contentType: ' + attachments[j].contentType + '. attachments[j].filename: ' + attachments[j].filename); // eg: donuts.jpg

                        switch (attachments[j].contentType) {

                            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':

                                var html = '';

                                //html += '<style>';
                                //html += '.bwEmailAttachment { ';
                                ////html += '  cursor:pointer;max-width:550px;display:inline-block;white-space:nowrap;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif; font-size: 1em;min-width: 250px;min-height: 70px;border:2px solid lightgray;border-radius:30px 30px 30px 30px;padding:0 10px 20px 10px;vertical-align:top;background-color:white;';
                                //html += '  cursor:pointer;max-width:550px;display:inline-block;white-space:nowrap;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif; font-size: 1em;min-width: 250px;min-height: 50px;border:2px solid lightgray;border-radius:10px 10px 10px 10px;padding:5px 10px 5px 10px;vertical-align:top;background-color:white;color:lightgray;';
                                //html += '}';
                                ////html += '.bwEmailAttachment div:hover { ';
                                //html += '.bwEmailAttachment hover { ';
                                //html += '   background-color:aliceblue;';
                                //html += '   border:2px solid skyblue;';
                                //html += '   cursor:pointer !important;';
                                //html += '}';
                                //html += '</style>';

                                html += '<br /><div class="bwEmailAttachment" onclick="alert(\'xcx2131255-1 new functionality!\');" xcx="xcx2131255-1"><img src="images/docx_icon_120x120.png" style="height:60px;opacity:0.4;" />&nbsp;&nbsp;' + attachments[j].fileName + '</div>';
                                $('#bwCalendar_EmailAttachments').append(html);

                                break;

                            case 'application/pdf':

                                var html = '';

                                //html += '<style>';
                                //html += '.bwEmailAttachment { ';
                                ////html += '  cursor:pointer;max-width:550px;display:inline-block;white-space:nowrap;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif; font-size: 1em;min-width: 250px;min-height: 70px;border:2px solid lightgray;border-radius:30px 30px 30px 30px;padding:0 10px 20px 10px;vertical-align:top;background-color:white;';
                                //html += '  cursor:pointer;max-width:550px;display:inline-block;white-space:nowrap;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif; font-size: 1em;min-width: 250px;min-height: 50px;border:2px solid lightgray;border-radius:10px 10px 10px 10px;padding:5px 10px 5px 10px;vertical-align:top;background-color:white;color:lightgray;';
                                //html += '}';
                                ////html += '.bwEmailAttachment div:hover { ';
                                //html += '.bwEmailAttachment hover { ';
                                //html += '   background-color:aliceblue;';
                                //html += '   border:2px solid skyblue;';
                                //html += '   cursor:pointer !important;';
                                //html += '}';
                                //html += '</style>';






                                var extensionIndex, fileExtension;

                                if (!attachments[j].fileName) {

                                    if (!attachments[j].filename) {

                                        var msg = 'Error in bwCalendar.js.renderAttachments(): No valid value for filename or fileName was found for an email attachment. xcx213123123-2.';
                                        console.log(msg);
                                        displayAlertDialog_Persistent(msg);

                                    } else {

                                        var msg = 'Error in bwCalendar.js.renderAttachments(): No valid value for fileName was found for an email attachment, but did find a value for filename. xcx213123123-2.';
                                        console.log(msg);
                                        displayAlertDialog_Persistent(msg);

                                        extensionIndex = attachments[j].filename.split('.').length - 1;
                                        fileExtension = attachments[j].filename.toLowerCase().split('.')[extensionIndex];

                                    }

                                } else {

                                    extensionIndex = attachments[j].fileName.split('.').length - 1;
                                    fileExtension = attachments[j].fileName.toLowerCase().split('.')[extensionIndex];

                                }

                                //var extensionIndex = attachments[j].fileName.split('.').length - 1;
                                //var fileExtension = attachments[j].fileName.toLowerCase().split('.')[extensionIndex];

                                if (fileExtension == 'jfif') { // jfif files do not seem to display in the browser correctly. // This is also done the the email receiving Haraka code. Perhaps not the final solution to the jfif not displaying in the browser problem. 5-17-2024.
                                    fileExtension = 'jpeg';
                                }

                                var thumbnailFilename = attachments[j].fileName + '_60px_.' + fileExtension;

                                var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                                    return v.toString(16);
                                });

                                var fileUrl = '';
                                var fileUrl_thumbnail = '';

                                //if (email.ThisEmailIsFromAnInternalSource == true) { // THESE ARE STORED ON THE fileservices server. 5-23-2024.

                                var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

                                fileUrl_thumbnail = thiz.options.operationUriPrefix + '_files/_emailAttachments/' + participantId + '/' + _id + '/ATTACHMENTS/' + encodeURIComponent(thumbnailFilename) + '?v=' + preventCachingGuid + '&amp;ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier; // + '?ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier; // + '&v=' + preventCachingGuid; 
                                fileUrl = thiz.options.operationUriPrefix + '_files/_emailAttachments/' + participantId + '/' + _id + '/ATTACHMENTS/' + encodeURIComponent(attachments[j].fileName) + '?v=' + preventCachingGuid + '&amp;ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier; // + '?ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier; // + '&v=' + preventCachingGuid; 















                                // Original 6-21-2024.
                                //html += '<br /><div class="bwEmailAttachment" onclick="alert(\'xcx2131255-2 new functionality!\');" xcx="xcx2131255-2"><img src="images/pdf.png" style="height:60px;opacity:0.4;" />&nbsp;&nbsp;' + attachments[j].fileName + '</div>';





                                html += '<br /><div class="bwEmailAttachment" onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + fileUrl + '\', \'' + attachments[j].fileName + '\', \'undefined\', \'6626b414-13d0-43e3-a8e4-cef0202b2562\');" xcx="xcx2131255-2-23425"><img src="images/pdf.png" style="height:60px;opacity:0.4;" />&nbsp;&nbsp;' + attachments[j].fileName + '</div>';



                                $('#bwCalendar_EmailAttachments').append(html);

                                break;

                            case 'image/png': case 'image/jpeg': case 'image/pipeg':

                                var extensionIndex, fileExtension;

                                if (!attachments[j].fileName) {

                                    if (!attachments[j].filename) {

                                        var msg = 'Error in bwCalendar.js.renderAttachments(): No valid value for filename or fileName was found for an email attachment. xcx213123123-2.';
                                        console.log(msg);
                                        displayAlertDialog_Persistent(msg);

                                    } else {

                                        var msg = 'Error in bwCalendar.js.renderAttachments(): No valid value for fileName was found for an email attachment, but did find a value for filename. xcx213123123-2.';
                                        console.log(msg);
                                        displayAlertDialog_Persistent(msg);

                                        extensionIndex = attachments[j].filename.split('.').length - 1;
                                        fileExtension = attachments[j].filename.toLowerCase().split('.')[extensionIndex];

                                    }

                                } else {

                                    extensionIndex = attachments[j].fileName.split('.').length - 1;
                                    fileExtension = attachments[j].fileName.toLowerCase().split('.')[extensionIndex];

                                }

                                //var extensionIndex = attachments[j].fileName.split('.').length - 1;
                                //var fileExtension = attachments[j].fileName.toLowerCase().split('.')[extensionIndex];

                                if (fileExtension == 'jfif') { // jfif files do not seem to display in the browser correctly. // This is also done the the email receiving Haraka code. Perhaps not the final solution to the jfif not displaying in the browser problem. 5-17-2024.
                                    fileExtension = 'jpeg';
                                }

                                var thumbnailFilename = attachments[j].fileName + '_60px_.' + fileExtension;

                                var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                                    return v.toString(16);
                                });

                                var fileUrl = '';
                                var fileUrl_thumbnail = '';

                                //if (email.ThisEmailIsFromAnInternalSource == true) { // THESE ARE STORED ON THE fileservices server. 5-23-2024.

                                var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

                                fileUrl_thumbnail = thiz.options.operationUriPrefix + '_files/_emailAttachments/' + participantId + '/' + _id + '/ATTACHMENTS/' + encodeURIComponent(thumbnailFilename) + '?v=' + preventCachingGuid + '&amp;ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier; // + '?ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier; // + '&v=' + preventCachingGuid; 
                                fileUrl = thiz.options.operationUriPrefix + '_files/_emailAttachments/' + participantId + '/' + _id + '/ATTACHMENTS/' + encodeURIComponent(attachments[j].fileName) + '?v=' + preventCachingGuid + '&amp;ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier; // + '?ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier; // + '&v=' + preventCachingGuid;



                                var html = '';

                                html += '<div class="bwEmailAttachment" xcx="xcx2131255-3-2" onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + fileUrl + '\', \'' + '[no filename]' + '\', \'[no description]\', \'x0d3d3e8c-1026-4518-9744-cb313c66a153x\');" ><img src="' + fileUrl_thumbnail + '" style="height:60px;" onmouseenter="$(\'.bwCalendar:first\').bwCalendar(\'showRowHoverDetails\', \'' + fileUrl + '\', this);this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="$(\'.bwCalendar:first\').bwCalendar(\'hideRowHoverDetails\');this.style.backgroundColor=\'white\';" />&nbsp;&nbsp;' + attachments[j].fileName + '</div>';
                                $('#bwCalendar_EmailAttachments').append(html);

                                break;

                            case 'audio/mpeg':

                                var html = '';

                                var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                                    return v.toString(16);
                                });

                                var fileUrl = thiz.options.operationUriPrefix + 'attachments/' + _id + '/' + encodeURIComponent(attachments[j].fileName) + '?v=' + preventCachingGuid + '&amp;ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier; // + '?ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier; // + '&v=' + preventCachingGuid; 

                                html += '<br /><div class="bwEmailAttachment" xcx="xcx2131255-4" onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + fileUrl + '\', \'' + '[no filename]' + '\', \'[no description]\', \'x0d3d3e8c-1026-4518-9744-cb313c66a153x\');" ><img src="images/mp3.png" style="height:60px;opacity:0.4;"  />&nbsp;&nbsp;' + attachments[j].fileName + '</div>';

                                $('#bwCalendar_EmailAttachments').append(html);

                                break;

                            case 'text/calendar':

                                var html = '';



                                //attachments[j].fileName




                                //
                                // This is making the json available for troubleshooting and looking into adding new information. In the case of .ics files, get the meeting/appointment date.
                                //
                                // ICS files are plain text files that contain information about a calendar event, including the event's:
                                //
                                // - Title
                                // - Summary and description
                                // - Start and end times
                                // - Location
                                // - Alert trigger
                                // The ICS format is a universal calendar file format that all popular calendar applications, including Microsoft Outlook, Apple Calendar, Google Calendar, and Mozilla Thunderbird Lightning Calendar, create and recognize.
                                // Because all popular calendar applications can use ICS files to add event details to a calendar, ICS files are the most common type of files used to exchange calendar information.
                                // Most commonly, office workers and other professionals use ICS files to send each other meeting requests. You may also receive ICS reminders for an upcoming birthday, holiday, trip, party, or other events.
                                //

                                var bwCalendarContent = '';
                                if (attachments[j].bwCalendarContent) {

                                    bwCalendarContent = atob(attachments[j].bwCalendarContent); // This decodes the Base64 file content to utf-8. This is nice, because it means we are transmitting a much smaller amount of data in the .ics file. Woop!

                                    var vEventIndex_start = bwCalendarContent.indexOf('BEGIN:VEVENT');
                                    var vEventIndex_end = bwCalendarContent.indexOf('END:VEVENT');
                                    var vEvent = bwCalendarContent.substring(vEventIndex_start, vEventIndex_end);

                                    var organizerIndex_start = vEvent.indexOf('ORGANIZER;') + 10;
                                    var organizerIndex_end = vEvent.indexOf(';', organizerIndex_start);
                                    var organizer = vEvent.substring(organizerIndex_start, organizerIndex_end);

                                    var cnIndex_start = organizer.indexOf('CN=') + 3;
                                    var cnIndex_end = organizer.indexOf(':', cnIndex_start);
                                    var cn = organizer.substring(cnIndex_start, cnIndex_end);

                                    var emailIndex_start = organizer.indexOf('mailto:') + 7;
                                    var emailIndex_end = organizer.indexOf('\n', emailIndex_start);
                                    var emailAddress = organizer.substring(emailIndex_start, emailIndex_end).trim();

                                    var summaryIndex_Start = vEvent.indexOf('SUMMARY;') + 8;
                                    var summaryIndex_End = vEvent.indexOf('\n', summaryIndex_Start);
                                    var summary1 = vEvent.substring(summaryIndex_Start, summaryIndex_End);
                                    var tmpIndex = summary1.indexOf(':') + 1; // Get rid of the [LANGUAGE=EN-us;]
                                    var summary = summary1.substring(tmpIndex);

                                    var dateIndex_Start = vEvent.indexOf('DTSTART;') + 8;
                                    var dateIndex_End = vEvent.indexOf('\n', dateIndex_Start);
                                    debugger;
                                    var date1 = vEvent.substring(dateIndex_Start, dateIndex_End);

                                    var tzidIndex_End = date1.indexOf(':');

                                    var tzid = date1.substring(5, tzidIndex_End);

                                    var date2 = date1.substring(tzidIndex_End + 1);

                                    var strYear = date2.substr(0, 4);
                                    var strMonth = date2.substr(4, 2) - 1;
                                    var strDay = date2.substr(6, 2);
                                    var strHour = date2.substr(9, 2);
                                    var strMin = date2.substr(11, 2);
                                    var strSec = date2.substr(13, 2);

                                    var oDate = new Date(strYear, strMonth, strDay, strHour, strMin, strSec);

                                    var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(oDate); //, tzid);

                                    html += `
                                                    <br />
                                                    <div class="bwCalendarAttachment">
                                                        <img src="images/calendar_icon_120x120.png" style="height:60px;opacity:0.4;float:left;" />
                                                        ` + cn + ` [` + emailAddress + `]<br />  
                                                        ` + summary + `<br />
                                                        ` + timestamp4 + ` [<< possibly incorrect]
                                                    </div>
                                                `;

                                }



                                //html += '<br />::' + calendarContent + '::<br />'; // bwCalendarContent




                                $('#bwCalendar_EmailAttachments').append(html);

                                break;

                            default:

                                //alert('attachments[j].contentType: ' + attachments[j].contentType);
                                var html = '';

                                //html += '<style>';
                                //html += '.bwEmailAttachment { ';
                                ////html += '  cursor:pointer;max-width:550px;display:inline-block;white-space:nowrap;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif; font-size: 1em;min-width: 250px;min-height: 70px;border:2px solid lightgray;border-radius:30px 30px 30px 30px;padding:0 10px 20px 10px;vertical-align:top;background-color:white;';
                                //html += '  cursor:pointer;max-width:550px;display:inline-block;white-space:nowrap;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif; font-size: 1em;min-width: 250px;min-height: 50px;border:2px solid lightgray;border-radius:10px 10px 10px 10px;padding:5px 10px 5px 10px;vertical-align:top;background-color:white;color:lightgray;';
                                //html += '}';
                                ////html += '.bwEmailAttachment div:hover { ';
                                //html += '.bwEmailAttachment hover { ';
                                //html += '   background-color:aliceblue;';
                                //html += '   border:2px solid skyblue;';
                                //html += '   cursor:pointer !important;';
                                //html += '}';
                                //html += '</style>';

                                var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                                    return v.toString(16);
                                });

                                var fileUrl = thiz.options.operationUriPrefix + 'attachments/' + _id + '/' + encodeURIComponent(attachments[j].filename) + '?v=' + preventCachingGuid + '&amp;ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier; // + '?ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier; // + '&v=' + preventCachingGuid; 

                                html += '<br /><div class="bwEmailAttachment" xcx="xcx2131255-4" onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + fileUrl + '\', \'' + '[no filename]' + '\', \'[no description]\', \'x0d3d3e8c-1026-4518-9744-cb313c66a153x\');" ><img src="images/attachment_120x120.png" style="height:60px;opacity:0.4;"  />&nbsp;&nbsp;' + attachments[j].filename + '</div>';

                                $('#bwCalendar_EmailAttachments').append(html);

                        }

                    } else if (attachments[j].contentDisposition == 'inline') {

                        //
                        // We have an inline attachment.
                        //   - We need to find the <img element with the matching CID, then substitute this URL, so that it displays in the bwCalendar.js editor Ok.
                        //

                        var imgElements = $('#bwCalendar_EmailBody:first').find('img');

                        var cidString = 'cid:' + attachments[j].cid;

                        for (var k = 0; k < imgElements.length; k++) {

                            if (imgElements[k].src == cidString) {

                                var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                                    return v.toString(16);
                                });

                                var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

                                var fileUrl = thiz.options.operationUriPrefix + '_files/_emailAttachments/' + participantId + '/' + _id + '/INLINE/' + encodeURIComponent(attachments[j].filename) + '?v=' + preventCachingGuid + '&amp;ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier; // + '?ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier; // + '&v=' + preventCachingGuid;

                                imgElements[k].src = fileUrl;

                                console.log('Located and substituted image with cidString: ' + cidString + ' with fileUrl: ' + fileUrl);

                                break;

                            }

                        }

                    } else {

                        alert('xcx1231234 Error: Unexpected value for contentDisposition: ' + attachments[j].contentDisposition);

                    }

                }

            }

        } catch (e) {
            var msg = 'Exception in bwCalendar.js.renderAttachments(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
        }
    },

    cleanEmailBodyHtmlForDisplay: function (emailHtml) {
        var thiz = this;
        return new Promise(function (resolve, reject) {
            try {
                console.log('In bwCalendar.js.cleanEmailBodyHtmlForDisplay().');
                // See also: https://stackoverflow.com/questions/56300312/remove-a-style-from-an-html-string

                if (!emailHtml) {

                    var result = {
                        status: 'SUCCESS',
                        message: 'SUCCESS',
                        html: ''
                    }

                    resolve(result);

                } else {
                    debugger;
                    var divElement = document.createElement('div');

                    var body_start = emailHtml.indexOf('<body');
                    if (body_start > -1) {
                        var tmp1 = emailHtml.substring(body_start, emailHtml.length);
                        var body_start2 = tmp1.indexOf('>');

                        if (body_start2) {
                            body_start2 = body_start2 + 1;
                            body_start = body_start + body_start2;
                        }

                        var body_end = emailHtml.indexOf('</body>');

                        if (body_start && body_end) {
                            emailHtml = emailHtml.substring(body_start, body_end);
                        }
                    }

                    //displayAlertDialog_Persistent(emailHtml);
                    debugger;
                    divElement.innerHTML = emailHtml;

                    //
                    // Put all the DOM elements we want to remove() into this array [elementsToRemoveArray], then at the end loop through it to get rid of all of the elements.
                    //

                    var elementsToRemoveArray = [];

                    //
                    //
                    // THE FIRST THING WE WANT TO DO IS SEE IF THERE IS A BODY ELEMENT. IF SO, GET RID OF EVERYTHING ELSE.
                    //
                    //

                    var elements = divElement.getElementsByTagName('!--');
                    for (var i = 0; i < elements.length; i++) {
                        elementsToRemoveArray.push(elements[i]);
                    }

                    var elements = divElement.getElementsByTagName('xml');
                    for (var i = 0; i < elements.length; i++) {
                        elementsToRemoveArray.push(elements[i]);
                    }

                    var elements = divElement.getElementsByTagName('meta');
                    for (var i = 0; i < elements.length; i++) {
                        elementsToRemoveArray.push(elements[i]);
                    }

                    var elements = divElement.getElementsByTagName('title');
                    for (var i = 0; i < elements.length; i++) {
                        elementsToRemoveArray.push(elements[i]);
                    }

                    var elements = divElement.getElementsByTagName('script');
                    for (var i = 0; i < elements.length; i++) {
                        elementsToRemoveArray.push(elements[i]);
                    }

                    var elements = divElement.getElementsByTagName('link');
                    for (var i = 0; i < elements.length; i++) {
                        elementsToRemoveArray.push(elements[i]);
                    }

                    var elements = divElement.getElementsByTagName('style');
                    for (var i = 0; i < elements.length; i++) {
                        elementsToRemoveArray.push(elements[i]);
                    }

                    //
                    // Loop through the array and remove() all of the elements from the DOM.
                    //
                    for (var i = 0; i < elementsToRemoveArray.length; i++) {
                        elementsToRemoveArray[i].remove();
                    }

                    elementsToRemoveArray = []; // Start fresh.

                    //
                    // Go through all of the remaining DOM elements, and if they have a style of display:none, get rid of them.
                    //
                    var elements = divElement.getElementsByTagName('*');
                    for (var i = 0; i < elements.length; i++) {
                        if (elements[i] && elements[i].style && elements[i].style.display && (elements[i].style.display == 'none')) {
                            elementsToRemoveArray.push(elements[i]);
                        }
                    }

                    //
                    // Loop through the array and remove() all of the elements from the DOM.
                    //
                    for (var i = 0; i < elementsToRemoveArray.length; i++) {
                        elementsToRemoveArray[i].remove();
                    }

                    //
                    // Rename all of the classes using prefix [bw_email_].
                    //
                    var elements = divElement.getElementsByTagName('*');
                    for (var i = 0; i < elements.length; i++) {
                        if (elements[i] && elements[i].className) {

                            var classArray = elements[i].className.split(' ');
                            var newClassArray = [];

                            for (var j = 0; j < classArray.length; j++) {
                                var newClassName = 'bw_email_' + classArray[j];
                                newClassArray.push(newClassName);
                            }

                            var className = '';
                            for (var j = 0; j < newClassArray.length; j++) {
                                if (j > 0) {
                                    className += ' ';
                                }
                                className += newClassArray[j];
                            }

                            elements[i].className = className; // This empties all of the classes ....

                        }
                        if (elements[i] && elements[i].id) {
                            var newId = 'bw_email_' + elements[i].id;
                            elements[i].id = newId;
                        }
                    }

                    var html = divElement.innerHTML;  // We are back to handling it as a string.

                    //
                    // Remove HTML comments [<!-- -->]
                    //
                    var start = 0;
                    do {
                        start = html.indexOf('<!--');
                        if (start > -1) {
                            var prefix = html.substring(0, start);
                            var tmp = html.substring(start + 4);
                            var end = tmp.indexOf('-->');
                            var suffix = tmp.substring(end + 3);
                            html = prefix + suffix;
                        }
                    } while (start > -1);

                    html = html.trim(); // Getting rid of the surrounding spaces should not affect anything, right?




                    //displayAlertDialog_Persistent(html);

                    debugger;


                    divElement.remove();

                    var result = {
                        status: 'SUCCESS',
                        message: 'SUCCESS',
                        html: html
                    }

                    resolve(result);

                }

            } catch (e) {

                var msg = 'Exception in bwCalendar.js.cleanEmailBodyHtmlForDisplay(): ' + e.message + ', ' + e.stack;
                console.log(msg);
                displayAlertDialog(msg);

                var result = {
                    status: 'EXCEPTION',
                    message: msg
                }
                reject(result);

            }
        });
    },

    renderMailboxItemInList: function (doc, element, mailboxName, prepend) { // mailboxName: ['Inbox', 'Sent', etc.] // prepend: [true, false] optional
        try {
            console.log('In bwCalendar.js.renderMailboxItemInList().');
            var thiz = this;

            //
            // This returns the HTML when displaying the Inbox, and also when a notification comes in for a new email, this is called to add the email to the list (if it is displayed). This makes it so that we only have to generate this UI in 1 place.
            //

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            var html = '';

            html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" _id="' + doc._id + '" class="bwEmailMailboxRow" bwdevnote="The selected email background color is set at [xcx213235991]." xcx="xcx2224555-3" onclick="$(\'.bwCalendar\').bwCalendar(\'viewIndividualEmail_' + mailboxName + '\', \'' + 'btnEditRaciRoles_' + doc.bwParticipantId + '\', \'' + doc.bwParticipantId + '\', \'' + doc.bwParticipantFriendlyName + '\', \'' + doc.bwParticipantEmail + '\', \'' + doc._id + '\');" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + doc.bwParticipantId + '\', \'' + doc.bwParticipantId + '\');">';
            //html += '    <td style="vertical-align:top;max-width:20px;"><input type="checkbox" style="transform:scale(2);" class="inboxEmailCheckbox" bwinboxemailid="' + doc._id + '" /></td>';
            html += '    <td class="bwemailitems" _id="' + doc._id + '" draggable="true" id="bwCalendar_InnerLeftMenuButton_' + doc._id + '" style="border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px;max-width:350px;">';

            var emailAddress = '';
            if (mailboxName == 'Sent') {

                // The Sent mailbox displays the email address of "Who the email was sent to", which is unlike the inbox, etc.
                if (doc.to && doc.to[0] && doc.to[0].address) {
                    emailAddress = doc.to[0].address;
                } else {
                    emailAddress = doc.to;
                }

            } else {

                if (doc.from && doc.from[0] && doc.from[0].address) {
                    emailAddress = doc.from[0].address;
                } else {
                    emailAddress = doc.from;
                }

            }


            //
            // Attachments or calendar/meeting icon.
            //
            var iconHtml = '';

            if (doc.attachments && doc.attachments.length && (doc.attachments.length > 0)) {

                var displayedCalendar = false;
                var displayedAttachment = false;

                for (var j = (doc.attachments.length - 1); j > -1; j += -1) { // WE NEED TO DO THIS LOOP IN REVERSE BECAUSE WE ARE DISPLAYING USING style float:right; // 6-7-2024.

                    if (doc.attachments[j].contentDisposition == 'inline') { // contentDisposition: [inline, attachment]

                        switch (doc.attachments[j].contentType) {

                            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':

                                //alert('xcx21234123-1');

                                //alert('word xcx1255236');
                                iconHtml += '<img src="images/docx_icon_120x120.png" style="width:40px;float:right;" xcx="xcx55567" />';

                                break;

                            case 'application/pdf':

                                //alert('pdf xcx1255236');
                                iconHtml += '<img src="images/pdf.png" style="width:40px;float:right;" xcx="xcx1231455" />';

                                break;

                            case 'image/png': case 'image/jpeg':

                                var extensionIndex = doc.attachments[j].fileName.split('.').length - 1;
                                var fileExtension = doc.attachments[j].fileName.toLowerCase().split('.')[extensionIndex];

                                if (fileExtension == 'jfif') { // jfif files do not seem to display in the browser correctly. // This is also done the the email receiving Haraka code. Perhaps not the final solution to the jfif not displaying in the browser problem. 5-17-2024.
                                    fileExtension = 'jpeg';
                                }

                                var thumbnailFilename = doc.attachments[j].fileName + '_60px_.' + fileExtension;

                                var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                                    return v.toString(16);
                                });

                                var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

                                fileUrl_thumbnail = thiz.options.operationUriPrefix + '_files/_emailAttachments/' + participantId + '/' + doc._id + '/INLINE/' + encodeURIComponent(thumbnailFilename) + '?v=' + preventCachingGuid + '&amp;ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier; // + '?ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier; // + '&v=' + preventCachingGuid; 
                                fileUrl = thiz.options.operationUriPrefix + '_files/_emailAttachments/' + participantId + '/' + doc._id + '/INLINE/' + encodeURIComponent(doc.attachments[j].fileName) + '?v=' + preventCachingGuid + '&amp;ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier; // + '?ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier; // + '&v=' + preventCachingGuid; 


                                //}

                                iconHtml += '<img src="' + fileUrl_thumbnail + '" style="width:40px;float:right;" id="tempElementId1" xcx="xcx12312342-1-1" onmouseenter="$(\'.bwCalendar:first\').bwCalendar(\'showRowHoverDetails\', \'' + fileUrl + '\', this);this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="$(\'.bwCalendar:first\').bwCalendar(\'hideRowHoverDetails\');this.style.backgroundColor=\'white\';" />';

                                break;

                            case 'text/calendar':

                                if (displayedCalendar == false) {
                                    iconHtml += '<img src="images/calendar_icon_120x120.png" style="width:30px;float:right;" />';
                                    displayedCalendar = true;
                                }
                                break;

                            default:

                                if (displayedAttachment == false) {
                                    iconHtml += '<img src="images/attachment_30x30.png" style="width:30px;float:right;" />';
                                    displayedAttachment = true;
                                }

                        }

                    } else if (doc.attachments[j].contentDisposition == 'attachment') { // contentDisposition: [inline, attachment]

                        switch (doc.attachments[j].contentType) {

                            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':

                                iconHtml += '<img src="images/docx_icon_120x120.png" style="width:60px;float:right;" xcx="xcx55567" />';

                                break;

                            case 'application/pdf':

                                iconHtml += '<img src="images/pdf.png" style="width:40px;float:right;" xcx="xcx1231455" />';

                                break;

                            case 'image/png': case 'image/jpeg': case 'image/pipeg':

                                var extensionIndex, fileExtension;

                                if (!doc.attachments[j].fileName) {

                                    if (!doc.attachments[j].filename) {

                                        var msg = 'Error in bwCalendar.js.xx(): No valid value for filename or fileName was found for an email attachment. xcx213123123-1.';
                                        console.log(msg);
                                        displayAlertDialog_Persistent(msg);

                                    } else {

                                        var msg = 'Error in bwCalendar.js.xx(): No valid value for fileName was found for an email attachment, but did find a value for filename. xcx213123123-1.';
                                        console.log(msg);
                                        displayAlertDialog_Persistent(msg);

                                        extensionIndex = doc.attachments[j].filename.split('.').length - 1;
                                        fileExtension = doc.attachments[j].filename.toLowerCase().split('.')[extensionIndex];

                                    }

                                } else {

                                    extensionIndex = doc.attachments[j].fileName.split('.').length - 1;
                                    fileExtension = doc.attachments[j].fileName.toLowerCase().split('.')[extensionIndex];

                                }

                                if (fileExtension == 'jfif') { // jfif files do not seem to display in the browser correctly. // This is also done the the email receiving Haraka code. Perhaps not the final solution to the jfif not displaying in the browser problem. 5-17-2024.
                                    fileExtension = 'jpeg';
                                }

                                var thumbnailFilename = doc.attachments[j].fileName + '_60px_.' + fileExtension;

                                var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                                    return v.toString(16);
                                });

                                var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

                                fileUrl_thumbnail = thiz.options.operationUriPrefix + '_files/_emailAttachments/' + participantId + '/' + doc._id + '/ATTACHMENTS/' + encodeURIComponent(thumbnailFilename) + '?v=' + preventCachingGuid + '&amp;ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier; // + '?ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier; // + '&v=' + preventCachingGuid; 
                                fileUrl = thiz.options.operationUriPrefix + '_files/_emailAttachments/' + participantId + '/' + doc._id + '/ATTACHMENTS/' + encodeURIComponent(doc.attachments[j].fileName) + '?v=' + preventCachingGuid + '&amp;ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier; // + '?ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier; // + '&v=' + preventCachingGuid; 


                                //}

                                iconHtml += '<img src="' + fileUrl_thumbnail + '" style="width:40px;float:right;" id="tempElementId1" xcx="xcx12312342-1-2" onmouseenter="$(\'.bwCalendar:first\').bwCalendar(\'showRowHoverDetails\', \'' + fileUrl + '\', this);this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="$(\'.bwCalendar:first\').bwCalendar(\'hideRowHoverDetails\');this.style.backgroundColor=\'white\';" />';

                                break;

                            case 'text/calendar':

                                if (displayedCalendar == false) {
                                    iconHtml += '<img src="images/calendar_icon_120x120.png" style="width:30px;float:right;" />';
                                    displayedCalendar = true;
                                }
                                break;

                            default:

                                if (displayedAttachment == false) {
                                    iconHtml += '<img src="images/attachment_30x30.png" style="width:30px;float:right;" />';
                                    displayedAttachment = true;
                                }

                        }

                    } else {

                        alert('xcx12312424 Unexpected value for doc.attachments[j].contentDisposition: ' + doc.attachments[j].contentDisposition);

                    }

                }

            }

            if (doc.TheUserHasReadThisEmail == true) {
                html += '<span style="font-weight:normal;color:black;" class="bwEmailMailboxRow_EmailAddress">' + emailAddress + iconHtml + '<br />';
            } else {
                if (['Inbox', 'TrashBin'].indexOf(mailboxName) > -1) {
                    html += '<span style="font-weight:bold;color:black;" class="bwEmailMailboxRow_EmailAddress">' + emailAddress + iconHtml + '<br />';
                } else {
                    html += '<span style="font-weight:normal;color:black;" class="bwEmailMailboxRow_EmailAddress">' + emailAddress + iconHtml + '<br />';
                }
            }

            var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(doc.timestamp);
            html += '   <span style="font-weight:normal;color:tomato;">' + timestamp4 + '</span>';
            html += '       <br />';
            html += '</span>';

            var subject = '';
            if (doc.subject) {
                subject = doc.subject.substring(0, 55);
            } else {
                subject = '[no subject]';
            }

            if (doc.TheUserHasReadThisEmail == true) {
                html += '<span style="font-weight:normal;color:#95b1d3;" class="bwEmailMailboxRow_Subject">' + subject + ' ...</span>';
            } else {
                if (['Inbox', 'TrashBin'].indexOf(mailboxName) > -1) {
                    html += '<span style="font-weight:bold;color:#95b1d3;" class="bwEmailMailboxRow_Subject">' + subject + ' ...</span>';
                } else {
                    html += '<span style="font-weight:normal;color:#95b1d3;" class="bwEmailMailboxRow_Subject">' + subject + ' ...</span>';
                }
            }

            html += '       <br />';

            html += '<span style="font-weight:normal;color:lightgray;">Organization: [' + doc.bwWorkflowAppId + ']';

            // INTERNAL/EXTERNAL
            if (doc.ThisEmailIsFromAnInternalSource && (doc.ThisEmailIsFromAnInternalSource == true)) {
                html += ' <span style="color:tomato;">INTERNAL</span>';
            } else {
                html += ' <span style="color:tomato;">EXTERNAL</span>';
            }

            html += '</span>';
            html += '       <br />';

            html += '   </td>';

            html += '<td class="bwCalendar_Trashbin" style="max-width:40px;" onclick="$(\'.bwCalendar\').bwCalendar(\'deleteIndividualEmail\', \'' + doc._id + '\', \'' + mailboxName + '\');event.stopPropagation();">';
            html += '<img src="/images/trashbin.png" />';
            html += '</td>';

            html += '  </tr>';

            if (prepend && (prepend == true)) { // If prepend is true, this is because it is a new email that has arrived, so it will go at the top.
                $(element).prepend(html);
            } else {
                $(element).append(html);
            }

        } catch (e) {
            console.log('Exception in bwCalendar.js.renderMailboxItemInList(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCalendar.js.renderMailboxItemInList(): ' + e.message + ', ' + e.stack);
        }
    },

    loadNewEmail_bwNotificationSound_Notification: function (results) { // results come in as a string, the  results from _bw/doweneedtomakeanotificationsound.
        try {
            console.log('In bwCalendar.js.loadNewEmail_bwNotificationSound_Notification().');
            //displayAlertDialog_Persistent('In bwCalendar.js.loadNewEmail_bwNotificationSound_Notification(). results: ' + JSON.stringify(results));

            //
            //
            // This is a method called from bwNotificationSound.js.checkIfWeNeedToPlayANotificationSound().
            //  - bwCalendar will handle the smooth presentation and loading of the new email, but it doesn't check itself, it relies on being called from bwNotificationSound.js.checkIfWeNeedToPlayANotificationSound(). 6-18-2024.
            //  - WE NEED TO ADD HERE A CHECK ON options.Inbox to see if the email notification is not necessary, because the Inbox already has the new email, 
            //    and the user may have already viewed it [TheUserHasReadThisEmail]. <<< 7-5-2024. <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            //
            //

            debugger;
            var bwNotificationDetailsJson = JSON.parse(results.bwNotificationDetailsJson);

            var _ids = [];
            if (bwNotificationDetailsJson && bwNotificationDetailsJson.length) {

                var displayedInboxRows = $('#tableEmailPicker').find('.bwEmailMailboxRow');

                if (displayedInboxRows && displayedInboxRows.length && (displayedInboxRows.length > 0)) {

                    //
                    // The user is viewing their Inbox. We need to add the new email to their list. This makes or a pleasant user experience. 6-18-2024. NOTE IF THERE ARE NO ROWS, WE NEED TO FIX THAT!!!!!!!!!!!!!!!! <<<<<<<<<<<<<<<<<<<<<<<
                    //

                    //
                    // This returns the HTML when displaying the Inbox, and also when a notification comes in for a new email, this is called to add the email to the list (if it is displayed). This makes it so that we only have to generate this UI in 1 place.
                    //

                    for (var i = 0; i < bwNotificationDetailsJson.length; i++) {

                        // We need to check that it didn't get added already. This can happen if the user selects the Inbox in the time between the notification getting received.
                        var foundTheEmail = false;
                        if (!(this.options.Inbox && this.options.Inbox.docs && this.options.Inbox.docs.length)) {

                            var msg = 'Error in bwCalendar.js.loadNewEmail_bwNotificationSound_Notification(). No docs in the Inbox.';
                            console.log(msg);
                            displayAlertDialog(msg);

                        } else {

                            for (var j = 0; j < this.options.Inbox.docs.length; j++) {
                                if (this.options.Inbox.docs[j]._id == bwNotificationDetailsJson[i]._id) {
                                    foundTheEmail = true;
                                    break;
                                }
                            }

                            // xcx23133. THIS IS HOW WE PUT AN EMAIL AT THE TOP OF THE LIST. 6-20-2024.
                            if (foundTheEmail != true) {

                                this.options.Inbox.docs.push(bwNotificationDetailsJson[i]);
                                //var html_tr = this.generateInboxBrowserListItem(bwNotificationDetailsJson[i]); // renderMailboxItemInList
                                //var table = $('#divEmailPicker').find('table')[0];
                                //$(table).prepend(html_tr);


                                var element = $(this.element).find('#tableEmailPicker')[0];
                                console.log('xcx231223 calling renderMailboxItemInList().');
                                this.renderMailboxItemInList(bwNotificationDetailsJson[i], element, 'Inbox', true);

                            }

                        }

                    }

                }

            }

        } catch (e) {
            var msg = 'Exception in bwCalendar.js.loadNewEmail_bwNotificationSound_Notification(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
        }
    },





    dodrop: function (event, mailbox) { // mailbox: ['INBOX', ...] 
        try {
            console.log('In bwCalendar.js.dodrop(). mailbox: ' + mailbox);
            //alert('In bwCalendar.js.dodrop(). mailbox: ' + mailbox);
            var thiz = this;

            if (event.dataTransfer.items.length == 0) {

                alert('NO ITEMS xcx23123123');

            } else {

                var data1 = event.dataTransfer.getData('text/plain');

                try {
                    var data = JSON.parse(data1);
                } catch (e) {
                    debugger;
                    var x = event.dataTransfer.getData('text');
                }

                var fromMailbox = data.MailboxOrigin;
                var toMailbox = mailbox;

                console.log('In bwCalendar.js.dodrop(). Moving email [' + data._id + '] from ' + fromMailbox + ' to ' + toMailbox + '.');
                //alert('In bwCalendar.js.dodrop(). Moving email [' + data._id + '] from ' + fromMailbox + ' to ' + toMailbox + '.');

                //
                // Inbox >> Junk, Archived, TrashBin
                //

                if (fromMailbox == 'INBOX') {

                    if (toMailbox == 'TRASHBIN') {

                        this.deleteIndividualEmail(data._id, 'Inbox');
                        displayAlertDialog_QuickNotice('Moved item from INBOX to TRASHBIN.');

                    } else {

                        alert('xcx123123_1 unsupported action. fromMailbox: ' + fromMailbox + ', toMailbox: ' + toMailbox);

                    }

                } else if (fromMailbox == 'TRASHBIN') {

                    if (toMailbox == 'INBOX') {

                        this.undeleteIndividualEmail(data._id, 'Inbox');
                        displayAlertDialog_QuickNotice('Moved item from TRASHBIN to INBOX.');

                    } else {

                        alert('xcx123123_2 unsupported action.');

                    }

                } else {

                    var msg = 'In bwCalendar.js.dodrop(). Currently only moving items from the INBOX is supported. This action cannot be completed.';
                    console.log(msg);
                    displayAlertDialog(msg);

                }

            }

        } catch (e) {
            // Doing it this way in case it fails, we will be able to get the data from the client error logs on the server and be able to track it down. 7-9-2024.
            var msg = '';
            if (data1) {
                msg = 'Exception in bwCalendar.js.dodrop(). data1: ' + data1 + ' :: ' + e.message + ', ' + e.stack;
            } else {
                msg = 'Exception in bwCalendar.js.dodrop(): ' + e.message + ', ' + e.stack;
            }
            console.log(msg);
            displayAlertDialog_Persistent(msg);

        }
    },

    showRowHoverDetails: function (fileUrl, imgElement) {
        try {
            console.log('In bwCalendar.js.showRowHoverDetails().');
            //alert('In bwCalendar.js.showRowHoverDetails().'); // id: ' + $(imgElement).attr('id'));
            var thiz = this;

            var html = '';
            html += '<img src="' + fileUrl + '" style="max-width:650px;max-height:800px;" />';


            var div = document.getElementById('bwCalendar_ImageHoverOverDialog');
            if (!div) { // for some reason this gets added twice to the DOM. Figure this out someday, but for now this seems to fix it and is a good safety I suppose.
                div = document.createElement('div');
                div.id = 'bwCalendar_ImageHoverOverDialog';
                div.style.display = 'none';
                document.body.appendChild(div); // to place at end of document
            }
            div.innerHTML = html;

            position = {
                my: "left+60 top-60",
                at: "right top",
                of: $(imgElement)
            };

            $('#bwCalendar_ImageHoverOverDialog').dialog({
                resizable: false,
                draggable: false,
                width: "760",
                position: position,
                open: function (event, ui) {
                    try {

                        //$(this).unbind('click').bind('click', function () {
                        //    console.log('Displaying the request in the dialog [calling displayArInDialog()].');
                        //    $('.bwRequest').bwRequest('displayArInDialog', thiz.options.operationUriPrefix, bwBudgetRequest1.BwBudgetRequestId, bwBudgetRequest1.Title, bwBudgetRequest1.ProjectTitle, bwBudgetRequest1.Title);
                        //    thiz.hideRowHoverDetails();
                        //});

                    } catch (e) {
                        console.log('Exception in bwCalendar.js.showRowHoverDetails.dialog.open(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwCalendar.js.showRowHoverDetails.dialog.open(): ' + e.message + ', ' + e.stack);
                    }
                },
                close: function () {
                    $('#bwCalendar_ImageHoverOverDialog').dialog('destroy');
                }
            });
            $('#bwCalendar_ImageHoverOverDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();

        } catch (e) {
            console.log('Exception in bwCalendar.js.showRowHoverDetails(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCalendar.js.showRowHoverDetails(): ' + e.message + ', ' + e.stack);
        }
    },

    hideRowHoverDetails: function (e) {
        try {
            console.log('In bwCalendar.js.hideRowHoverDetails().');
            //alert('In bwCalendar.js.hideRowHoverDetails().');

            $('#bwCalendar_ImageHoverOverDialog').dialog('close');

        } catch (e) {
            console.log('Exception in bwCalendar.js.hideRowHoverDetails(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCalendar.js.hideRowHoverDetails(): ' + e.message + ', ' + e.stack);
        }
    },

    // Originated from displayArInDialog(). 4-25-2024.
    displayEmailInDialog: function (TrashBin, budgetRequestId, arNamexx, brTitle, title, bwAssignedToRaciRoleAbbreviation, bwWorkflowTaskItemId, bwRequestJson) { // If invoked from a task link, make sure bwWorkflowTaskItemId is populated!!!! 12-23-2021
        try {
            //
            // If invoked from a task link, make sure bwWorkflowTaskItemId is populated!!!
            //
            console.log('In bwCalendar.js.displayEmailInDialog(). budgetRequestId: ' + budgetRequestId + ', bwWorkflowTaskItemId: ' + bwWorkflowTaskItemId + ', TrashBin: ' + TrashBin);
            //alert('In bwCalendar.js.displayEmailInDialog(). budgetRequestId: ' + budgetRequestId + ', bwWorkflowTaskItemId: ' + bwWorkflowTaskItemId + ', TrashBin: ' + TrashBin);
            var thiz = this;

            //if (TrashBin == true) {
            //    alert('THIS IS A TRASHBINNED REQUEST.');
            //}

            var window1 = window; // This is how we make this work for popped-out request dialog windows.
            if (window.opener) {
                window1 = window.opener;
            }

            //
            // Check if the request is open already. 1-13-2023
            // We only have to check popp-out windows, because of the way the not-popped-out ones are named based on their bwBudgetRequestId and have the same element id, so never show up more than once.
            //
            var windowCount = 0;
            var poppedOutRequestWindows = window1.$('.bwAuthentication:first').bwAuthentication('option', 'poppedOutRequestWindows');
            if (poppedOutRequestWindows && poppedOutRequestWindows.length) {
                windowCount = poppedOutRequestWindows.length;
            }

            var alreadyDisplayingTheRequest = false;
            if (poppedOutRequestWindows && poppedOutRequestWindows.length && (poppedOutRequestWindows.length > 0)) {
                for (var i = 0; i < poppedOutRequestWindows.length; i++) {
                    if (poppedOutRequestWindows[i].bwBudgetRequestId == budgetRequestId) {
                        //displayAlertDialog('This request is already being displayed. Attempting to bring the request window to the front of the display.');

                        // Make sure it actually exists, and is just not orphaned in the list.
                        if (poppedOutRequestWindows[i].windowObjectReference.closed) {
                            console.log('Error? in bwCalendar.js.displayEmailInDialog(). The popped-out window was in the list, but does not actually exist.');
                            poppedOutRequestWindows.splice(i, 1);  // This removes it from the list. It needs to be removed from the list for it to be displayed, because we never display the same request twice!!!! :)
                        } else {
                            poppedOutRequestWindows[i].windowObjectReference.focus();
                            alreadyDisplayingTheRequest = true;
                        }
                        break;
                    }
                }
            }
            console.log('In bwCalendar.js.displayEmailInDialog(). There are ' + windowCount + ' popped-out windows for us to check to make sure we don\'t display a request more than once.');

            if (alreadyDisplayingTheRequest == true) {

                var msg = 'This request is already being displayed in a popped-out window.';
                console.log(msg);
                displayAlertDialog(msg);

            } else {

                var budgetrequestform;
                var budgetrequestforms = document.getElementsByClassName('budgetrequestform');
                for (var i = 0; i < budgetrequestforms.length; i++) {
                    var _budgetRequestId = $(budgetrequestforms[i])[0].getAttribute('bwbudgetrequestid');
                    if (budgetRequestId == _budgetRequestId) {
                        // We found the form.
                        budgetrequestform = $(budgetrequestforms[i]);
                        break;
                    }
                }
                if (budgetrequestform) {

                    console.log('');
                    console.log('==========================================');
                    console.log('In bwCalendar.js.displayEmailInDialog(). This request is already being displayed, so bringing it to the top. budgetRequestId: ' + budgetRequestId);
                    console.log('==========================================');
                    console.log('');

                    var dialogId = 'divRequestFormDialog_' + budgetRequestId;
                    $('#' + dialogId).dialog('moveToTop');

                } else {

                    if (!bwWorkflowTaskItemId) {
                        var msg = 'In displayArInDialog(). Invalid value for bwWorkflowTaskItemId: ' + bwWorkflowTaskItemId + ', xcx32423663473. This is Ok when it is a new request. It would be nice if we checked for bwRequest.BudgetWorkflowStatus == NOT_SUBMITTED here, but we don\'t have access to that data, do we?.';
                        console.log(msg);
                        //alert(msg);
                    }


                    if (bwRequestJson) {
                        console.log('In bwCalendar.js.displayEmailInDialog(). bwRequestJson has been passed.');
                    }

                    try {
                        // Code to hide divRowHoverDetails if it is displayed.
                        $('#divRowHoverDetails').dialog('close');
                    } catch (e) {
                        // do nothing
                    }

                    var participantId = window1.$('.bwAuthentication').bwAuthentication('option', 'participantId');

                    window.scrollTo(0, 0); // Scroll to top on button click. This makes sure things render Ok, and also just seems like a nicer user experience.
                    $('.bwActiveMenu').bwActiveMenu('adjustLeftSideMenu'); // This makes sure our new stretchy-left-menu redraws Ok.

                    if (displayTaskDetailsBeforeRequests != true) {

                        //
                        // THIS IS THE ONLY PLACE WHERE THE FORM GETS DISPLAYED. 
                        //

                        console.log('In bwCalendar.js.displayEmailInDialog(). IS THIS THE ONLY PLACE THIS SHOULD BE HAPPENING? 3-16-2022 xcx3243465');
                        //console.log('In displayArInDialog(). Calling displayRequestFormDialog().'); // bwAssignedToRaciRoleAbbreviation: ' + bwAssignedToRaciRoleAbbreviation + ', bwWorkflowTaskItemId: ' + bwWorkflowTaskItemId);

                        //alert('In displayArInDialog(). Calling displayRequestFormDialog(). TrashBin: ' + TrashBin + ', bwRequestJson: ' + JSON.stringify(bwRequestJson));

                        if (TrashBin != true) {

                            console.log('In displayArInDialog(). Calling displayRequestFormDialog(). TrashBin: ' + TrashBin);
                            this.displayRequestFormDialog(budgetRequestId, bwAssignedToRaciRoleAbbreviation, bwWorkflowTaskItemId, bwRequestJson); //, participantId, title); //, bwAssignedToRaciRoleAbbreviation, '', bwWorkflowTaskItemId);

                        } else {

                            console.log('In displayArInDialog(). Calling displayRequestFormDialog_FromTrashBin(). TrashBin: ' + TrashBin);
                            //alert('>>>>>> In displayArInDialog(). Calling displayRequestFormDialog_FromTrashBin(). TrashBin: ' + TrashBin);
                            this.displayRequestFormDialog_FromTrashBin(budgetRequestId, bwAssignedToRaciRoleAbbreviation, bwWorkflowTaskItemId, bwRequestJson); //, participantId, title); //, bwAssignedToRaciRoleAbbreviation, '', bwWorkflowTaskItemId);

                        }

                    } else {

                        console.log('In displayArInDialog(). Display the audit trail/approval trail first.');
                        //
                        // Display the audit trail/approval trail first.
                        if (!budgetRequestId && !brTitle) {
                            // This means we are coming from a .xsl, so we have to find the values.

                            alert('In bwCalendar.js.displayEmailInDialog(). This means we are coming from a .xsl, so we have to find the values.');

                            budgetRequestId = $('span[xd\\:binding = "my:BudgetRequestId"]')[0].innerHTML; // my:BudgetRequestId
                            appWebUrl = this.options.operationUriPrefix; //globalUrlPrefix + globalUrlForWebServices;
                            brTitle = $('span[xd\\:binding = "my:Project_Name"]')[0].innerHTML; // my:Project_Name
                            title = $('span[xd\\:binding = "my:Title"]')[0].innerHTML; // eg: BR-160001
                            //// debugger;
                            // This shows the AR in a jquery dialog window.
                            try {
                                $('#spanArDialogTitle').empty(); // We have to empty the contents of the dialog before it is displayed.
                                $('#spanArDialogTaskAuditTrail').empty(); // We have to empty the contents of the dialog before it is displayed.
                                $('#spanArDialogViewBudgetRequestLink').empty(); // We have to empty the contents of the dialog before it is displayed.
                                //// debugger; // xcx1


                                alert('xcx23425345-3');

                                alert('Displaying ArDialog. xcx23425345-3-1');

                                $("#ArDialog").dialog({
                                    //position: {
                                    //    my: "left top",
                                    //    at: "right top",
                                    //    of: "#selectHomePageWorkflowAppDropDown"
                                    //},

                                    modal: true,
                                    resizable: false,
                                    closeText: "Cancel",
                                    closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                                    title: brTitle + " (" + title + ")",
                                    width: "720px",
                                    dialogClass: "no-close", // No close button in the upper right corner.
                                    hide: false, // This means when hiding just disappear with no effects.



                                    //position: {
                                    //    my: "middle top+12",
                                    //    at: "middle top",
                                    //    of: window //"#btnAdvancedProductSearch"
                                    //},





                                    open: function (event, ui) {
                                        $('.ui-widget-overlay').bind('click', function () { $("#ArDialog").dialog('close'); });

                                        $(this).dialog('moveToTop');


                                        //var invitationUrl = globalUrlPrefix + globalUrl + '?invitation=' + invitationId;
                                        ////$('#invitationLink2').text(invitationUrl);
                                        //document.getElementById('textareaViewInvitationDialogInvitationDetails').innerHTML = invitationUrl;
                                        //document.getElementById('textareaViewInvitationDialogInvitationDetails').blur();
                                    },
                                    close: function (event, ui) {
                                        try {
                                            displayAlertDialog('In xcx23412(). The request form is being closed. We need to check if the user may be losing any changes. This functionality is incomplete. Coming soon! xcx12312-4');
                                        } catch (e) {

                                        }
                                    }
                                });
                                $("#ArDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

                                //$('#spanArDialogTitle').html(brTitle + ' (' + title + ')');
                                var titleHtml = '';
                                titleHtml += '☇ ☈';
                                titleHtml += '&nbsp;&nbsp;&nbsp;&nbsp;x11';
                                titleHtml += brTitle + ' (' + title + ')';
                                $('#spanArDialogTitle').html(titleHtml); //brTitle + ' (' + title + ')');

                                var operationUri = webserviceurl + "/bwworkflowtasks/getbybudgetrequestid/" + budgetRequestId;
                                $.ajax({
                                    url: operationUri,
                                    method: "GET",
                                    headers: {
                                        "Accept": "application/json; odata=verbose"
                                    },
                                    success: function (wtItems) {
                                        try {
                                            //console.log('wtItems: ' + JSON.stringify(wtItems));
                                            if (wtItems.d.results.length == 0) {
                                                // Todd: There were no results, so put some message on the screen to indicate that.?

                                                //html = '';
                                                //                html += '<table>';
                                                //                html += '   <tr>';
                                                //                html += '       <td>&nbsp;</td>';
                                                //                html += '   </tr>';
                                                //                html += '   <tr>';
                                                //                html += '       <td>';
                                                ////html += '           <a href="javascript:displayArOnTheHomePage(\'' + budgetRequestId + '\', \'' + participantId + '\', \'' + title + '\');">Click here to view the Budget Request</a>';
                                                //html += '           <a href="javascript:$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' +budgetRequestId + '\', \'' + participantId + '\', \'' +title + '\');">Click here to view the Budget Request</a>';
                                                //html += '       </td>';
                                                //                html += '   </tr>';
                                                //html += '</table>';

                                                //$('#spanArDialogViewBudgetRequestLink').html(html);


                                            } else {
                                                // First we have to create an array of user Id's so we can pass it the method in order to get back the friendly names.
                                                var userIds = [];
                                                userIds.push(wtItems.d.results[0].bwAuthorId);
                                                for (var ui = 0; ui < wtItems.d.results.length; ui++) {
                                                    userIds.push(wtItems.d.results[ui].bwAssignedToId);
                                                }
                                                var UserFriendlyNames = [];
                                                var dataRetrievalCount = 0;
                                                for (var uids = 0; uids < userIds.length; uids++) {
                                                    // Ok now we have to make a deferred call to get back the Friendly Names.
                                                    GetUserDetails[uids] = $.Deferred();
                                                    GetUserDetails[uids]
                                                        .done(function (data) {
                                                            try {
                                                                dataRetrievalCount += 1; // Increment the count!
                                                                // Add the results to the array.
                                                                UserFriendlyNames.push(data);
                                                                // Check if all of the data has come back yet.
                                                                if (dataRetrievalCount == userIds.length) {
                                                                    // Now that we have all the friendly names we need for the user Ids, we can proceed.
                                                                    var html = '';
                                                                    html += '<table>';
                                                                    html += '   <tr>';
                                                                    html += '       <td title="' + formatDateAndTimeFromBW(wtItems.d.results[0].Created) + '">';
                                                                    var authorName = '';
                                                                    for (var c = 0; c < UserFriendlyNames.length; c++) {
                                                                        if (UserFriendlyNames[c][0] == wtItems.d.results[0].bwAuthorId) authorName = UserFriendlyNames[c][1];
                                                                    }
                                                                    html += '           <strike><span style="cursor:help;">xcx10' + formatDateFromBW(wtItems.d.results[0].Created) + ' - Request submitted by ' + authorName + '</span></strike>';
                                                                    html += '       </td>';
                                                                    html += '   </tr>';
                                                                    html += '</table>';
                                                                    for (var ri = 0; ri < wtItems.d.results.length; ri++) {
                                                                        // Iterate through all of the tasks and build the list for this Budget Request ListItem.
                                                                        html += '<table>';
                                                                        html += '   <tr>';
                                                                        //html += '       <td title="' + formatDateAndTimeFromBW(wtItems.d.results[ri].Modified) + '">';
                                                                        // debugger;
                                                                        if ((wtItems.d.results[ri].bwPercentComplete == 100) && (wtItems.d.results[ri].bwStatus == 'Completed')) {
                                                                            html += '       <td title="' + formatDateAndTimeFromBW(wtItems.d.results[ri].Modified) + '">';
                                                                            html += '       <strike>';
                                                                            html += '<span style="cursor:help;">xcx11' + formatDateFromBW(wtItems.d.results[ri].Modified) + ' - ' + wtItems.d.results[ri].bwTaskOutcome + '[raci role1]</span>';
                                                                            html += '       </strike>';
                                                                            html += '       </td>';
                                                                        } else {
                                                                            var assignedToName = '';
                                                                            for (var c = 0; c < UserFriendlyNames.length; c++) {
                                                                                if (UserFriendlyNames[c][0] == wtItems.d.results[ri].bwAssignedToId) assignedToName = UserFriendlyNames[c][1];
                                                                            }
                                                                            html += '       <td title="' + formatDateAndTimeFromBW(wtItems.d.results[ri].Created) + '">';
                                                                            html += '<span style="cursor:help;">xcx12' + formatDateFromBW(wtItems.d.results[ri].Created) + ' - ' + wtItems.d.results[ri].bwTaskTitle + ' assigned to ' + assignedToName + '[raci role2]</span>';
                                                                            html += '       </td>';
                                                                        }
                                                                        //html += '       </td>';
                                                                        html += '   </tr>';
                                                                        html += '</table>';
                                                                    }

                                                                    $('#spanArDialogTaskAuditTrail').html(html);

                                                                    html = '';
                                                                    html += '<table>';
                                                                    html += '   <tr>';
                                                                    html += '       <td>&nbsp;</td>';
                                                                    html += '   </tr>';
                                                                    html += '   <tr>';
                                                                    html += '       <td>';
                                                                    //html += '           <a href="javascript:displayArOnTheHomePage(\'' + budgetRequestId + '\', \'' + participantId + '\', \'' + title + '\');">Click here to view the Budget Request</a>';
                                                                    // debugger;
                                                                    html += '           <a onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequestId + '\', \'' + participantId + '\', \'' + title + '\');">Click here to view the Budget Request</a>';
                                                                    html += '       </td>';
                                                                    html += '   </tr>';
                                                                    html += '</table>';

                                                                    $('#spanArDialogViewBudgetRequestLink').html(html);

                                                                    $('#ui-id-1').css('border-radius', '20px 0 0 20px');
                                                                }
                                                            } catch (e) {
                                                                console.log('Exception in bwRequest.displayArInDialog():xcx335-2: ' + e.message + ', ' + e.stack);
                                                                displayAlertDialog('Exception in bwRequest.displayArInDialog():xcx335-2: ' + e.message + ', ' + e.stack);
                                                            }
                                                        })
                                                        .fail(function (data) {
                                                            handleExceptionWithAlert('Error in bwRequest.displayArInDialog().GetUserDetails.fail()', 'GetUserDetails.fail()');
                                                        });
                                                    getUserDetails(userIds[uids], appWebUrl, uids);
                                                }
                                            }
                                        } catch (e) {
                                            console.log('Exception in bwRequest.displayArInDialog():xcx335-1: ' + e.message + ', ' + e.stack);
                                            displayAlertDialog('Exception in bwRequest.displayArInDialog():xcx335-1: ' + e.message + ', ' + e.stack);
                                        }
                                    },
                                    error: function (error) {
                                        handleExceptionWithAlert('Error in bwRequest.displayArInDialog()', '1:' + errorCode + ', ' + errorMessage);
                                    }
                                });
                            } catch (e) {
                                handleExceptionWithAlert('Error in bwRequest.displayArInDialog()', '2:' + e.message);
                            }
                        } else if (!budgetRequestId && !title) {
                            //displayAlertDialog('This means we are coming from the burn rate report.');
                            // This means we are coming from the burn rate report.
                            // First we have to get the budgetRequestId from the Title (eg: BR-00001).


                            alert('In bwCalendar.js.displayEmailInDialog(). !appWebUrl && !budgetRequestId && !title.');


                            var operationUri = webserviceurl + "/getbudgetrequestidfromtitle/" + brTitle;
                            $.ajax({
                                url: operationUri,
                                method: "GET",
                                headers: {
                                    "Accept": "application/json; odata=verbose"
                                },
                                success: function (data) {
                                    try {
                                        //displayAlertDialog(data);

                                        budgetRequestId = data[0].bwBudgetRequestId;
                                        appWebUrl = globalUrlPrefix + globalUrlForWebServices;
                                        brTitle = data[0].ProjectTitle; // my:Project_Name
                                        title = data[0].Title; // eg: BR-160001



                                        // This shows the AR in a jquery dialog window.
                                        try {
                                            $('#spanArDialogTitle').empty(); // We have to empty the contents of the dialog before it is displayed.
                                            $('#spanArDialogTaskAuditTrail').empty(); // We have to empty the contents of the dialog before it is displayed.
                                            $('#spanArDialogViewBudgetRequestLink').empty(); // We have to empty the contents of the dialog before it is displayed.
                                            // debugger; // xcx2

                                            alert('xcx23425345-2');

                                            alert('Displaying ArDialog. xcx23425345-3-2');

                                            $("#ArDialog").dialog({
                                                modal: true,
                                                resizable: false,
                                                closeText: "Cancel",
                                                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                                                title: brTitle + " (" + title + ")",
                                                width: "720px",
                                                dialogClass: "no-close", // No close button in the upper right corner.
                                                hide: false, // This means when hiding just disappear with no effects.





                                                //position: {
                                                //    my: "middle top+12",
                                                //    at: "middle top",
                                                //    of: window //"#btnAdvancedProductSearch"
                                                //},





                                                open: function (event, ui) {
                                                    $('.ui-widget-overlay').bind('click', function () {
                                                        $("#ArDialog").dialog('close');
                                                    });

                                                    $(this).dialog('moveToTop');

                                                    //var invitationUrl = globalUrlPrefix + globalUrl + '?invitation=' + invitationId;
                                                    ////$('#invitationLink2').text(invitationUrl);
                                                    //document.getElementById('textareaViewInvitationDialogInvitationDetails').innerHTML = invitationUrl;
                                                    //document.getElementById('textareaViewInvitationDialogInvitationDetails').blur();
                                                },
                                                close: function (event, ui) {
                                                    try {
                                                        displayAlertDialog('In xcx23412(). The request form is being closed. We need to check if the user may be losing any changes. This functionality is incomplete. Coming soon! xcx12312-5');
                                                    } catch (e) {

                                                    }
                                                }
                                                //buttons: {
                                                //    "Close": function () {
                                                //        $(this).dialog("close");
                                                //    }
                                                //}
                                            });
                                            $("#ArDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

                                            $('#spanArDialogTitle').html(brTitle + ' (' + title + ')x1');

                                            var operationUri = webserviceurl + "/bwworkflowtasks/getbybudgetrequestid/" + budgetRequestId;
                                            $.ajax({
                                                url: operationUri,
                                                method: "GET",
                                                headers: {
                                                    "Accept": "application/json; odata=verbose"
                                                },
                                                success: function (wtItems) {
                                                    try {
                                                        if (wtItems.d.results.length == 0) {
                                                            // Todd: There were no results, so put some message on the screen to indicate that.?
                                                        } else {
                                                            // First we have to create an array of user Id's so we can pass it the method in order to get back the friendly names.
                                                            var userIds = [];
                                                            userIds.push(wtItems.d.results[0].bwAuthorId);
                                                            for (var ui = 0; ui < wtItems.d.results.length; ui++) {
                                                                userIds.push(wtItems.d.results[ui].bwAssignedToId);
                                                            }
                                                            var UserFriendlyNames = [];
                                                            var dataRetrievalCount = 0;
                                                            for (var uids = 0; uids < userIds.length; uids++) {
                                                                // Ok now we have to make a deferred call to get back the Friendly Names.
                                                                GetUserDetails[uids] = $.Deferred();
                                                                GetUserDetails[uids]
                                                                    .done(function (data) {
                                                                        try {
                                                                            dataRetrievalCount += 1; // Increment the count!
                                                                            // Add the results to the array.
                                                                            UserFriendlyNames.push(data);
                                                                            // Check if all of the data has come back yet.
                                                                            if (dataRetrievalCount == userIds.length) {
                                                                                // Now that we have all the friendly names we need for the user Ids, we can proceed.
                                                                                var html = '';
                                                                                html += '<table>';
                                                                                html += '   <tr>';
                                                                                html += '       <td title="' + formatDateAndTimeFromBW(wtItems.d.results[0].Created) + '">';
                                                                                var authorName = '';
                                                                                for (var c = 0; c < UserFriendlyNames.length; c++) {
                                                                                    if (UserFriendlyNames[c][0] == wtItems.d.results[0].bwAuthorId) authorName = UserFriendlyNames[c][1];
                                                                                }
                                                                                html += '           <strike><span style="cursor:help;">xcx13' + formatDateFromBW(wtItems.d.results[0].Created) + ' - Request submitted by ' + authorName + '[raci role 3]</span></strike>';
                                                                                html += '       </td>';
                                                                                html += '   </tr>';
                                                                                html += '</table>';
                                                                                for (var ri = 0; ri < wtItems.d.results.length; ri++) {
                                                                                    // Iterate through all of the tasks and build the list for this Budget Request ListItem.
                                                                                    html += '<table>';
                                                                                    html += '   <tr>';
                                                                                    html += '       <td title="' + formatDateAndTimeFromBW(wtItems.d.results[ri].Modified) + '">';
                                                                                    if ((wtItems.d.results[ri].bwPercentComplete == 100) && (wtItems.d.results[ri].bwStatus == 'Completed')) {
                                                                                        html += '       <strike>';
                                                                                        html += '<span style="cursor:help;">xcx14' + formatDateFromBW(wtItems.d.results[ri].Modified) + ' - ' + wtItems.d.results[ri].bwTaskOutcome + '[raci role 4]</span>';
                                                                                        html += '       </strike>';
                                                                                    } else {
                                                                                        var assignedToName = '';
                                                                                        for (var c = 0; c < UserFriendlyNames.length; c++) {
                                                                                            if (UserFriendlyNames[c][0] == wtItems.d.results[ri].bwAssignedToId) assignedToName = UserFriendlyNames[c][1];
                                                                                        }
                                                                                        html += 'xcx15' + formatDateFromBW(wtItems.d.results[ri].Created) + ' - ' + wtItems.d.results[ri].bwTaskTitle + ' assigned to ' + assignedToName;
                                                                                    }
                                                                                    html += '       </td>';
                                                                                    html += '   </tr>';
                                                                                    html += '</table>';
                                                                                }


                                                                                $('#spanArDialogTaskAuditTrail').html(html);

                                                                                html = '';
                                                                                html += '<table>';
                                                                                html += '   <tr>';
                                                                                html += '       <td>&nbsp;</td>';
                                                                                html += '   </tr>';
                                                                                html += '   <tr>';
                                                                                html += '       <td>';
                                                                                //html += '           <a href="javascript:displayArOnTheHomePage(\'' + budgetRequestId + '\', \'' + participantId + '\', \'' + title + '\');">Click here to view the Budget Request</a>';
                                                                                // debugger;
                                                                                html += '           <a onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequestId + '\', \'' + participantId + '\', \'' + title + '\');">Click here to view the Budget Request</a>';
                                                                                html += '       </td>';
                                                                                html += '   </tr>';
                                                                                html += '</table>';
                                                                                $('#spanArDialogViewBudgetRequestLink').html(html);

                                                                                $('#ui-id-1').css('border-radius', '20px 0 0 20px');
                                                                            }
                                                                        } catch (e) {
                                                                            console.log('Exception in bwRequest.displayArInDialog():xcx335-5: ' + e.message + ', ' + e.stack);
                                                                            displayAlertDialog('Exception in bwRequest.displayArInDialog():xcx335-5: ' + e.message + ', ' + e.stack);
                                                                        }
                                                                    })
                                                                    .fail(function (data) {
                                                                        handleExceptionWithAlert('Error in bwRequest.displayArInDialog().GetUserDetails.fail()', 'GetUserDetails.fail()');
                                                                    });
                                                                getUserDetails(userIds[uids], appWebUrl, uids);
                                                            }
                                                        }
                                                    } catch (e) {
                                                        console.log('Exception in bwRequest.displayArInDialog():xcx335-4: ' + e.message + ', ' + e.stack);
                                                        displayAlertDialog('Exception in bwRequest.displayArInDialog():xcx335-4: ' + e.message + ', ' + e.stack);
                                                    }
                                                },
                                                error: function (error) {
                                                    handleExceptionWithAlert('Error in bwRequest.displayArInDialog()', '1:' + errorCode + ', ' + errorMessage);
                                                }
                                            });
                                        } catch (e) {
                                            handleExceptionWithAlert('Error in bwRequest.displayArInDialog()', '2:' + e.message);
                                        }
                                    } catch (e) {
                                        console.log('Exception in bwRequest.displayArInDialog():xcx335-3: ' + e.message + ', ' + e.stack);
                                        displayAlertDialog('Exception in bwRequest.displayArInDialog():xcx335-3: ' + e.message + ', ' + e.stack);
                                    }
                                },
                                error: function (error) {
                                    handleExceptionWithAlert('Error in bwRequest.displayArInDialog()', '1:' + errorCode + ', ' + errorMessage);
                                }
                            });
                        } else {
                            // Display the thing. We have enough info already!
                            // This shows the AR in the dialog.


                            alert('In bwCalendar.js.displayEmailInDialog(). This shows the AR in the dialog.');


                            try {
                                $('#spanArDialogTitle').empty(); // We have to empty the contents of the dialog before it is displayed.
                                $('#spanArDialogTaskAuditTrail').empty(); // We have to empty the contents of the dialog before it is displayed.
                                $('#spanArDialogViewBudgetRequestLink').empty(); // We have to empty the contents of the dialog before it is displayed.
                                // debugger; // xcx3

                                alert('xcx23425345');

                                alert('Displaying ArDialog. xcx23425345-3-3');

                                $("#ArDialog").dialog({
                                    modal: true,
                                    resizable: false,
                                    closeText: "Cancel",
                                    closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                                    title: brTitle + " (" + title + ")",
                                    width: "720px",
                                    dialogClass: "no-close", // No close button in the upper right corner.
                                    hide: false, // This means when hiding just disappear with no effects.



                                    // 3-16-2022 removed this so that it displays cascaded in the jquery.ui.dialog works in it's natural fashion...
                                    //position: {
                                    //    my: "middle top+12",
                                    //    at: "middle top",
                                    //    of: window //"#btnAdvancedProductSearch"
                                    //},






                                    open: function (event, ui) {
                                        $('.ui-widget-overlay').bind('click', function () {
                                            $("#ArDialog").dialog('close');
                                        });

                                        $(this).dialog('moveToTop');

                                        //var invitationUrl = globalUrlPrefix + globalUrl + '?invitation=' + invitationId;
                                        ////$('#invitationLink2').text(invitationUrl);
                                        //document.getElementById('textareaViewInvitationDialogInvitationDetails').innerHTML = invitationUrl;
                                        //document.getElementById('textareaViewInvitationDialogInvitationDetails').blur();








                                        //// First, let's create our drawing surface out of an existing SVG element
                                        //// If you want to create a new surface just provide dimensions
                                        //// like s = Snap(800, 600);
                                        //var s = Snap("#svg");
                                        //// Let's create a big circle in the middle:
                                        //var bigCircle = s.circle(150, 150, 100);






                                    },
                                    close: function (event, ui) {
                                        try {
                                            displayAlertDialog('In xcx23412(). The request form is being closed. We need to check if the user may be losing any changes. This functionality is incomplete. Coming soon! xcx12312-6');
                                        } catch (e) {

                                        }
                                    }
                                    //buttons: {
                                    //    "Close": function () {
                                    //        $(this).dialog("close");
                                    //    }
                                    //}
                                });
                                $("#ArDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

                                $('#spanArDialogTitle').html(brTitle + ' (' + title + ')x2');

                                var operationUri = webserviceurl + "/bwworkflowtasks/getbybudgetrequestid/" + budgetRequestId;
                                $.ajax({
                                    url: operationUri,
                                    method: "GET",
                                    headers: {
                                        "Accept": "application/json; odata=verbose"
                                    },
                                    success: function (wtItems) {
                                        try {
                                            if (wtItems.d.results.length == 0) {
                                                // Todd: There were no results, so put some message on the screen to indicate that.?



                                                //// debugger;
                                                html = '';
                                                html += '<table>';
                                                html += '   <tr>';
                                                html += '       <td>&nbsp;</td>';
                                                html += '   </tr>';
                                                html += '   <tr>';
                                                html += '       <td>';
                                                //html += '           <a href="javascript:displayArOnTheHomePage(\'' + budgetRequestId + '\', \'' + participantId + '\', \'' + title + '\');">Click here to view the Budget Request</a>';
                                                // debugger;
                                                html += '           <a onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequestId + '\', \'' + participantId + '\', \'' + title + '\');">Click here to view the Budget Request</a>';
                                                html += '       </td>';
                                                html += '   </tr>';
                                                html += '</table>';

                                                $('#spanArDialogViewBudgetRequestLink').html(html);



                                            } else {
                                                // First we have to create an array of user Id's so we can pass it the method in order to get back the friendly names.
                                                var userIds = [];
                                                userIds.push(wtItems.d.results[0].bwAuthorId);
                                                for (var ui = 0; ui < wtItems.d.results.length; ui++) {
                                                    userIds.push(wtItems.d.results[ui].bwAssignedToId);
                                                }
                                                var UserFriendlyNames = [];
                                                var dataRetrievalCount = 0;
                                                for (var uids = 0; uids < userIds.length; uids++) {
                                                    // Ok now we have to make a deferred call to get back the Friendly Names.
                                                    GetUserDetails[uids] = $.Deferred();
                                                    GetUserDetails[uids]
                                                        .done(function (data) {
                                                            try {
                                                                dataRetrievalCount += 1; // Increment the count!
                                                                // Add the results to the array.
                                                                UserFriendlyNames.push(data);
                                                                // Check if all of the data has come back yet.
                                                                if (dataRetrievalCount == userIds.length) {
                                                                    // Now that we have all the friendly names we need for the user Ids, we can proceed.
                                                                    var html = '';
                                                                    html += '<table>';
                                                                    html += '   <tr>';
                                                                    html += '       <td title="' + formatDateAndTimeFromBW(wtItems.d.results[0].Created) + '">';
                                                                    var authorName = '';
                                                                    for (var c = 0; c < UserFriendlyNames.length; c++) {
                                                                        if (UserFriendlyNames[c][0] == wtItems.d.results[0].bwAuthorId) authorName = UserFriendlyNames[c][1];
                                                                    }
                                                                    html += '           <strike><span style="cursor:help;">xcx16' + formatDateFromBW(wtItems.d.results[0].Created) + ' - Request submitted by ' + authorName + '</span></strike>';
                                                                    html += '       </td>';
                                                                    html += '   </tr>';
                                                                    html += '</table>';
                                                                    for (var ri = 0; ri < wtItems.d.results.length; ri++) {
                                                                        // Iterate through all of the tasks and build the list for this Budget Request ListItem.
                                                                        html += '<table>';
                                                                        html += '   <tr>';
                                                                        html += '       <td title="' + formatDateAndTimeFromBW(wtItems.d.results[ri].Modified) + '">';
                                                                        if ((wtItems.d.results[ri].bwPercentComplete == 100) && (wtItems.d.results[ri].bwStatus == 'Completed')) {
                                                                            html += '       <strike>';
                                                                            html += '<span style="cursor:help;">xcx17' + formatDateFromBW(wtItems.d.results[ri].Modified) + ' - ' + wtItems.d.results[ri].bwTaskOutcome + ' [' + wtItems.d.results[ri].bwAssignedToRaciRoleName + ' (' + wtItems.d.results[ri].bwAssignedToRaciRoleAbbreviation + ')]x</span>';
                                                                            html += '       </strike>';
                                                                        } else {
                                                                            var assignedToName = '';
                                                                            for (var c = 0; c < UserFriendlyNames.length; c++) {
                                                                                if (UserFriendlyNames[c][0] == wtItems.d.results[ri].bwAssignedToId) assignedToName = UserFriendlyNames[c][1];
                                                                            }
                                                                            html += 'xcx18' + formatDateFromBW(wtItems.d.results[ri].Created) + ' - ' + wtItems.d.results[ri].bwTaskTitle + ' assigned to ' + assignedToName + ' [' + wtItems.d.results[ri].bwAssignedToRaciRoleName + ' (' + wtItems.d.results[ri].bwAssignedToRaciRoleAbbreviation + ')]x';
                                                                        }
                                                                        html += '       </td>';
                                                                        html += '   </tr>';
                                                                        html += '</table>';
                                                                    }

                                                                    $('#spanArDialogTaskAuditTrail').html(html);

                                                                    html = '';
                                                                    html += '<table>';
                                                                    html += '   <tr>';
                                                                    html += '       <td>&nbsp;</td>';
                                                                    html += '   </tr>';
                                                                    html += '   <tr>';
                                                                    html += '       <td>';
                                                                    //html += '           <a href="javascript:displayArOnTheHomePage(\'' + budgetRequestId + '\', \'' + participantId + '\', \'' + title + '\');">Click here to view the Budget Request</a>';
                                                                    // debugger;
                                                                    html += '           <a onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequestId + '\', \'' + participantId + '\', \'' + title + '\');">Click here to view the Budget Request</a>';
                                                                    html += '       </td>';
                                                                    html += '   </tr>';
                                                                    html += '</table>';

                                                                    $('#spanArDialogViewBudgetRequestLink').html(html);

                                                                    $('#ui-id-1').css('border-radius', '20px 0 0 20px');
                                                                }
                                                            } catch (e) {
                                                                console.log('Exception in bwRequest.displayArInDialog():xcx335-7: ' + e.message + ', ' + e.stack);
                                                                displayAlertDialog('Exception in bwRequest.displayArInDialog():xcx335-7: ' + e.message + ', ' + e.stack);
                                                            }
                                                        })
                                                        .fail(function (data) {
                                                            handleExceptionWithAlert('Error in bwRequest.displayArInDialog().GetUserDetails.fail()', 'GetUserDetails.fail()');
                                                        });
                                                    getUserDetails(userIds[uids], appWebUrl, uids);
                                                }
                                            }
                                        } catch (e) {
                                            console.log('Exception in bwCalendar.js.displayEmailInDialog():xcx335-6: ' + e.message + ', ' + e.stack);
                                            displayAlertDialog('Exception in bwCalendar.js.displayEmailInDialog():xcx335-6: ' + e.message + ', ' + e.stack);
                                        }
                                    },
                                    error: function (error) {
                                        var msg = 'Error in bwCalendar.js.displayEmailInDialog(). error: ' + error;
                                        console.log(msg);
                                        alert(msg);
                                    }

                                });

                            } catch (e) {
                                var msg = 'Exception in bwCalendar.js.displayEmailInDialog():2: ' + e.message + ', ' + e.stack;
                                console.log(msg);
                                alert(msg);
                            }

                        }
                    }
                }

            }

        } catch (e) {
            var msg = 'Exception in bwCalendar.js.displayEmailInDialog():1: ' + e.message + ', ' + e.stack;
            console.log(msg);
            alert(msg);
        }
    },


    LaunchIntoDialog: function (requestDialogId, bwBudgetRequestId, bwWorkflowTaskItemId) { // See also method displayRequestFormInNewBrowserWindow().
        try {
            console.log('In bwCalendar.js.LaunchIntoDialog().');
            alert('In bwCalendar.js.LaunchIntoDialog().');
            //displayAlertDialog_Persistent('In LaunchIntoDialog().');


            // First, we have to set this flag in the dialog so that we aren't prompted to have to save the request before it is closed. Doing it t the beginning so it has time to take effect and avoid a race condition? I am not sure yet.
            //
            // The _setOption function is called when setting the option externally, like $('#my-widget1').colorize("option", "red", 0});

            //alert('In bwRequest.js.LaunchIntoDialog(). WE NEED TO SCRAPE THE REQUEST before displaying it in the new window. Otherwise force it to save. xcx993357.');
            //$('#' + requestDialogId).dialog('option', 'bwForceClose', true); // changed 4-3-2023



            // end


            //var rect = document.getElementById(requestDialogId).getBoundingClientRect();
            //var height = rect.bottom - rect.top;
            //var width = rect.right - rect.left;

            //// When opening a request in a new browser window, we need to use a distinct url. For example: https://budgetworkflow.com/?ActiveStateIdentifier=3e4e2de9-7d5b-476f-a34e-a4eaa0472b44&request=4691d358-c148-4df8-aa1b-70ee1bde0cc0

            //var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier')).ActiveStateIdentifier;

            //var url = this.options.operationUriPrefix + '?ActiveStateIdentifier=' + activeStateIdentifier + '&request=' + bwBudgetRequestId + '&taskid=' + bwWorkflowTaskItemId + '&openrequest=1';

            //// When the window.open is called, bwAuthentication.js.checkIfAuthenticatedAndProcessQuerystringParameters() handles the loading of the request form... by calling bwCalendar.js.displayRequestFormInNewBrowserWindow().
            ////$('#' + requestDialogId).dialog({ bwForceClose: true }); // Doing this at the top so we avoid a race condition. Keep this here for readability.
            ////var windowObjectReference = window.open(url, requestDialogId, 'toolbar=no,width=' + width + ',height=' + height + ',left=500,top=200,status=no,scrollbars=no,resize=no,location=0');

            //var windowObjectReference = window.open(url, requestDialogId, 'toolbar=no,width=' + width + ',height=' + height + ',left=5500,top=200,status=no,scrollbars=no,resize=no,location=0'); // Note that left is 5500. This is far too large a value, but the browser will correct this in order to keep this popup on the same monitor. I tried with multiple monitors, but can't get it to go on a different monitor. We will need a special application/browser plugin for that. 4-14-2024.





            //if (!windowObjectReference) {

            //    // The window wasn't allowed to open. This is likely caused by built-in popup blockers.
            //    console.log('The window wasn\'t allowed to open. This is likely caused by built-in popup blockers.');
            //    displayAlertDialog('The window wasn\'t allowed to open. This is likely caused by built-in popup blockers.');

            //} else {

            //    // Store this instance of a popped-out window in bwAuthentication.options.poppedOutRequestWindows
            //    var poppedOutRequestWindows = $('.bwAuthentication:first').bwAuthentication('option', 'poppedOutRequestWindows');
            //    if (!(poppedOutRequestWindows && poppedOutRequestWindows.length)) {
            //        poppedOutRequestWindows = [];
            //    }
            //    var poppedOutWindow = {
            //        windowWidgetType: 'bwRequest',
            //        requestDialogId: requestDialogId,
            //        bwBudgetRequestId: bwBudgetRequestId,
            //        bwWorkflowTaskItemId: bwWorkflowTaskItemId,
            //        windowObjectReference: windowObjectReference
            //    }
            //    poppedOutRequestWindows.push(poppedOutWindow);
            //    $('.bwAuthentication:first').bwAuthentication({ poppedOutRequestWindows: poppedOutRequestWindows });

            //}

        } catch (e) {
            console.log('Exception in bwCalendar.js.LaunchIntoDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCalendar.js.LaunchIntoDialog(): ' + e.message + ', ' + e.stack);
        }
    },

    saveDraft: function () {
        try {
            console.log('In bwCalendar.js.saveDraft().');
            //alert('In bwCalendar.js.saveDraft(). This functionality is incomplete. Coming soon!');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            var recipients; // = [];
            var singleRecipient = $('#bwCalendar_RecipientsList').val(); // 'fred@budgetworkflow.com;betty@budgetworkflow.com;dino@budgetworkflow.com'
            recipients = singleRecipient;

            var fromEmailAddress = participantEmail;
            var subject = $('#bwCalendar_EmailSubject').val();
            var body = $('#bwCalendar_EmailBody').summernote('code');
            var _id = $('#divEmailClient_CompositionWindow')[0].getAttribute('_id');

            if (!_id) {

                var msg = 'Error in bwCalendar.js.saveDraft(). INVALID VALUE FOR _id: ' + _id;
                console.log(msg);
                displayAlertDialog(msg);

            } else {

                //
                //
                // TO:DO: GET ALL OF THE ATTACHMENTS.
                //
                //

                var attachments = [];


                var data = {
                    bwParticipantId_LoggedIn: participantId,
                    bwActiveStateIdentifier: activeStateIdentifier,
                    bwWorkflowAppId_LoggedIn: workflowAppId,

                    _id: _id, // If this is valid, the web service will resave the draft, instead of creating a new one.

                    //bwEmailId: bwEmailId,
                    bwParticipantId: participantId,
                    //timestamp: new Date(),
                    from: fromEmailAddress,
                    to: recipients,
                    cc: [],
                    bcc: [],
                    subject: subject,
                    html: body,
                    attachments: attachments


                    //RelatedRequestId: null, //RelatedRequestId,

                    //FromEmailAddress: fromEmailAddress,
                    //Recipients: recipients,

                    //    ToParticipantId: String,
                    //    ToParticipantFriendlyName: String,
                    //    ToParticipantEmail: String,

                    //    CcAddress: String,
                    //    BccAddress: String,

                    //Subject: subject,
                    //Body: body
                };

                $.ajax({
                    url: this.options.operationUriPrefix + "_files/savedraftemail",
                    type: 'POST',
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

                                //thiz.element.html(''); // This actually works to get rid of the widget. Ha! 11-8-2023.

                            } else {

                                var _id = results.bwDraftEmail._id;

                                //alert('>>> In bwCalendar.js.saveDraft(). Saved DRAFT EMAIL, RETURNED VALUE FOR _id: ' + _id);

                                $(thiz.element).find('#divEmailClient_CompositionWindow')[0].setAttribute('_id', _id);

                                // Select the HOME button here. 1-4-2024.
                                var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
                                var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

                                // Step 1: Make all of the buttons un-selected.
                                $('.bwCalendar:first').find('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                                    $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
                                });

                                // Step 2: Set the specified button as the selected one.
                                $('#divInnerLeftMenuButton_Drafts').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);

                                displayAlertDialog_QuickNotice('DRAFT HAS BEEN SAVED'); // IS THIS TRUE????????????? 7-31-2024.

                                if (thiz.options.Drafts && thiz.options.Drafts.docs && thiz.options.Drafts.docs.length) {

                                    //
                                    // It has been loaded already. We won't go back and get them all.
                                    //

                                    // Check if this email is in the Drafts list yet. If not, add it.
                                    var foundTheEmail = false;
                                    for (var i = 0; i < thiz.options.Drafts.docs.length; i++) {
                                        if (thiz.options.Drafts.docs[i]._id == _id) {
                                            foundTheEmail = true;
                                            break;
                                        }
                                    }
                                    if (foundTheEmail != true) {

                                        thiz.options.Drafts.docs.push(data);

                                        var element = $(thiz.element).find('#tableEmailPicker')[0];
                                        thiz.renderMailboxItemInList(data, element, 'Drafts', true);

                                    }

                                    //displayAlertDialog_QuickNotice('DRAFT HAS BEEN SAVED');

                                } else {

                                    //
                                    // The Drafts list hasn't been loaded yet. We need to call a webservice to get the drafts for this user..
                                    //

                                    thiz.getAndRenderPagedEmails_Drafts(0, 5)
                                        .then(function (results) {

                                            if (results.length && (results.length > 0)) {
                                                thiz.getAndRenderPagedEmails_Drafts(5, 5)
                                                    .then(function (results) {

                                                        if (results.length && (results.length > 0)) {
                                                            thiz.getAndRenderPagedEmails_Drafts(10, 5)
                                                                .then(function (results) {

                                                                    if (results.length && (results.length > 0)) {
                                                                        thiz.getAndRenderPagedEmails_Drafts(15, 5)
                                                                            .then(function (results) {

                                                                                // At this point, the latest 20 emails should be displaying in the Inbox.


                                                                                //
                                                                                //
                                                                                // This is where we load the dataTransfer object, so that we can drag and drop emails among the email folders. 5-21-2024.
                                                                                //
                                                                                // 

                                                                                var emailItems = document.getElementsByClassName('bwemailitems');
                                                                                for (var i = 0; i < emailItems.length; i++) {

                                                                                    emailItems[i].addEventListener('dragstart', function (e) {
                                                                                        try {
                                                                                            console.log('In bwCalendar.js.loadAndRenderEmails_Drafts.dragstart().');

                                                                                            // Step 1: Set the opacity for all of these classes to 0.5: brushedAluminum_blue_noanimation

                                                                                            // Step 2: Set the opacity to 1 for these buttons. This will indicate a drop zone: Junk, Archived, TrashBin. [divInnerLeftMenuButton_Junk, divInnerLeftMenuButton_Archived, divInnerLeftMenuButton_TrashBin].

                                                                                            var elements1 = document.getElementsByClassName('brushedAluminum_blue_noanimation');
                                                                                            for (var j = 0; j < elements1.length; j++) {
                                                                                                elements1[j].style.opacity = '0.2';
                                                                                            }

                                                                                            var elements1 = document.getElementsByClassName('brushedAluminum_blue');
                                                                                            for (var j = 0; j < elements1.length; j++) {
                                                                                                elements1[j].style.opacity = '0.2';
                                                                                            }

                                                                                            document.getElementById('divInnerLeftMenuButton_Junk').style.opacity = 1.0;
                                                                                            document.getElementById('divInnerLeftMenuButton_Archived').style.opacity = 1.0;
                                                                                            document.getElementById('divInnerLeftMenuButton_TrashBin').style.opacity = 1.0;

                                                                                            // We have to set the _id in the dragstart event.
                                                                                            var _id = e.target.getAttribute('_id');
                                                                                            var result = {
                                                                                                MailboxOrigin: 'DRAFTS',
                                                                                                _id: _id
                                                                                            }
                                                                                            var result1 = JSON.stringify(result);
                                                                                            e.dataTransfer.setData('text/plain', result1);

                                                                                        } catch (e) {
                                                                                            var msg = 'Exception in In bwCalendar.js.loadAndRenderEmails_Drafts.dragstart(): ' + e.message + ', ' + e.stack;
                                                                                            console.log(msg);
                                                                                            alert(msg);
                                                                                        }
                                                                                    });

                                                                                    emailItems[i].addEventListener('dragend', function (e) {
                                                                                        try {
                                                                                            console.log('In bwCalendar.js.loadAndRenderEmails_Drafts.dragend().');

                                                                                            // Set the opacity for all of these classes to 1.0: [brushedAluminum_blue, brushedAluminum_blue_noanimation].

                                                                                            var elements1 = document.getElementsByClassName('brushedAluminum_blue_noanimation');
                                                                                            for (var j = 0; j < elements1.length; j++) {
                                                                                                elements1[j].style.opacity = '1.0';
                                                                                            }

                                                                                            var elements1 = document.getElementsByClassName('brushedAluminum_blue');
                                                                                            for (var j = 0; j < elements1.length; j++) {
                                                                                                elements1[j].style.opacity = '1.0';
                                                                                            }

                                                                                        } catch (e) {
                                                                                            var msg = 'Exception in In bwCalendar.js.loadAndRenderEmails_Drafts.dragend(): ' + e.message + ', ' + e.stack;
                                                                                            console.log(msg);
                                                                                            alert(msg);
                                                                                        }
                                                                                    });

                                                                                }

                                                                            }).catch(function (e) {



                                                                            });

                                                                    }


                                                                }).catch(function (e) {



                                                                });

                                                        }

                                                    }).catch(function (e) {



                                                    });

                                            }

                                        }).catch(function (e) {



                                        });

                                    //var data = {
                                    //    bwParticipantId_LoggedIn: participantId,
                                    //    bwActiveStateIdentifier: activeStateIdentifier,
                                    //    bwWorkflowAppId_LoggedIn: workflowAppId,

                                    //    bwWorkflowAppId: workflowAppId,
                                    //    bwParticipantId: participantId
                                    //};

                                    //$.ajax({
                                    //    url: thiz.options.operationUriPrefix + "_bw/participantemail_drafts",
                                    //    type: 'POST',
                                    //    data: data,
                                    //    headers: {
                                    //        "Accept": "application/json; odata=verbose"
                                    //    },
                                    //    success: function (results) {
                                    //        try {

                                    //            if (results.status != 'SUCCESS') {

                                    //                var msg = results.status + ': ' + results.message;
                                    //                console.log(msg);
                                    //                displayAlertDialog(msg);

                                    //                //thiz.element.html(''); // This actually works to get rid of the qidget. Ha! 11-8-2023.

                                    //            } else {

                                    //                thiz.options.Drafts = results.results;

                                    //                thiz.renderEmails_Drafts();

                                    //                displayAlertDialog_QuickNotice('DRAFT HAS BEEN SAVED xcx342.');

                                    //            }

                                    //        } catch (e) {
                                    //            console.log('Exception in bwCalendar.js.loadAndRenderEmails_Drafts():2: ' + e.message + ', ' + e.stack);
                                    //            displayAlertDialog('Exception in bwCalendar.js.loadAndRenderEmails_Drafts():2: ' + e.message + ', ' + e.stack);
                                    //        }
                                    //    },
                                    //    error: function (data, errorCode, errorMessage) {
                                    //        console.log('Error in bwCalendar.js.loadAndRenderEmails_Drafts():' + errorCode + ', ' + errorMessage);
                                    //        displayAlertDialog('Error in bwCalendar.js.loadAndRenderEmails_Drafts():' + errorCode + ', ' + errorMessage);
                                    //    }
                                    //});

                                }

                            }

                        } catch (e) {
                            console.log('Exception in bwCalendar.js.saveDraft():2: ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in bwCalendar.js.saveDraft():2: ' + e.message + ', ' + e.stack);
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        console.log('Error in bwCalendar.js.saveDraft():' + errorCode + ', ' + errorMessage);
                        displayAlertDialog('Error in bwCalendar.js.saveDraft():' + errorCode + ', ' + errorMessage);
                    }
                });

            }

        } catch (e) {
            console.log('Exception in bwCalendar.js.saveDraft(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCalendar.js.saveDraft(): ' + e.message + ', ' + e.stack);
        }
    },
    addAttachment: function () {
        try {
            console.log('In bwCalendar.js.addAttachment().');

            alert('This functionality is incomplete. Coming soon!');

        } catch (e) {
            console.log('Exception in bwCalendar.js.addAttachment(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCalendar.js.addAttachment(): ' + e.message + ', ' + e.stack);
        }
    },
    addInlineImage: function () {
        try {
            console.log('In bwCalendar.js.addInlineImage().');

            alert('This functionality is incomplete. Coming soon!');

        } catch (e) {
            console.log('Exception in bwCalendar.js.addInlineImage(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCalendar.js.addInlineImage(): ' + e.message + ', ' + e.stack);
        }
    },








    deleteIndividualEmail: function (_id, mailboxName) { // mailboxName: ['Inbox', 'Sent', 'Drafts', 'Junk', 'Archived', 'TrashBin']
        try {
            console.log('In bwCalendar.js.deleteIndividualEmail(). _id: ' + _id + ', mailboxName: ' + mailboxName);
            //alert('In bwCalendar.js.deleteIndividualEmail(). _id: ' + _id + ', mailboxName: ' + mailboxName);
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            if (!(workflowAppId && participantId && _id && mailboxName)) {

                console.log('Error in bwCalendar.js.deleteIndividualEmail(): Invalid value. Expected values for workflowAppId: ' + workflowAppId + ', participantId: ' + participantId + ', _id: ' + _id + ', mailboxName: ' + mailboxName);
                displayAlertDialog('Error in bwCalendar.js.deleteIndividualEmail(): Invalid value. Expected values for workflowAppId: ' + workflowAppId + ', participantId: ' + participantId + ', _id: ' + _id + ', mailboxName: ' + mailboxName);

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

                if (mailboxName == 'Inbox') {

                    ShowActivitySpinner_Promise('Moving to the TrashBin...')
                        .then(function (results) {
                            try {

                                $.ajax({
                                    url: thiz.options.operationUriPrefix + "_bw/deleteindividualemail",
                                    contentType: "application/json",
                                    type: 'POST',
                                    data: JSON.stringify(data),
                                    success: function (results) {
                                        try {

                                            if (results.status != 'SUCCESS') {

                                                HideActivitySpinner();
                                                displayAlertDialog(results.message);

                                            } else {

                                                HideActivitySpinner();

                                                console.log('The email has been deleted.');

                                                var foundIt;
                                                for (var i = 0; i < thiz.options.Inbox.docs.length; i++) {
                                                    if (thiz.options.Inbox.docs[i]._id == _id) {
                                                        // This is the one we just deleted. Instead of going out and getting the entire list again, just remove it here.
                                                        thiz.options.Inbox.docs.splice(i, 1); // Delete the item from the array.
                                                        foundIt = true;
                                                        break;
                                                    }
                                                }

                                                if (!foundIt) {

                                                    var msg = 'Error xcx231312-1. Could not find the email.';
                                                    console.log(msg);
                                                    displayAlertDialog(msg);

                                                } else {

                                                    // Update totalDocs.
                                                    thiz.options.Inbox.totalDocs -= 1;

                                                    // Update the status.
                                                    var msg = 'Displaying 1 to ' + thiz.options.Inbox.docs.length + ' of ' + thiz.options.Inbox.totalDocs + ' emails.';
                                                    $('#spanSelectedEmailType_Status').html(msg);

                                                    // Remove the email from the list.
                                                    var elementName = 'bwCalendar_InnerLeftMenuButton_' + _id;
                                                    var element = $('#' + elementName).closest('tr')[0];
                                                    element.remove();

                                                    //
                                                    // Check if the email was being displayed in the large right part of the screen.
                                                    //
                                                    var currentlyDisplayedEmail_id = $('#divEmailClient_CompositionWindow')[0].getAttribute('_id');

                                                    if (currentlyDisplayedEmail_id == _id) {

                                                        // Make the buttons disappear.
                                                        $('#bwCalendar_EmailTopButtons').html('');

                                                        // Clear the email display screen and replace with "SELECT AN EMAIL THAT YOU WISH TO VIEW".
                                                        // An email won't be selected until the user selects one.
                                                        $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '<div xcx="xcx213123-2" style="font-size:25pt;color:lightgray;">SELECT A CALENDAR ITEM THAT YOU WISH TO VIEW.</div>';
                                                        var x = document.getElementById('tdbwCalendar_RightColumn');
                                                        x.style.verticalAlign = 'middle';
                                                        // end: An email won't be selected until the user selects one.

                                                    }

                                                }

                                            }

                                        } catch (e) {

                                            HideActivitySpinner();

                                            console.log('Exception in bwCalendar.js.deleteIndividualEmail():4: ' + e.message + ', ' + e.stack);
                                            displayAlertDialog('Exception in bwCalendar.js.deleteIndividualEmail(): 4:' + e.message + ', ' + e.stack);
                                        }
                                    },
                                    error: function (data, errorCode, errorMessage) {

                                        HideActivitySpinner();

                                        var msg = 'Fail in bwCalendar.js.deleteIndividualEmail(): ' + JSON.stringify(data) + ', ' + errorCode + ', ' + errorMessage;
                                        console.log(msg);
                                        displayAlertDialog(msg);

                                    }
                                });

                            } catch (e) {

                                HideActivitySpinner();

                                var msg = 'Exception in bwCalendar.js.deleteIndividualEmail():3: ' + e.message + ', ' + e.stack;
                                console.log(msg);
                                displayAlertDialog(msg);

                            }

                        })
                        .catch(function (e) {
                            HideActivitySpinner();

                            var msg = 'Exception in bwCalendar.js.deleteIndividualEmail():2: ' + JSON.stringify(e);
                            console.log(msg);
                            displayAlertDialog(msg);

                        });

                } else if (mailboxName == 'Sent') {

                    ShowActivitySpinner_Promise('Moving to the TrashBin...')
                        .then(function (results) {
                            try {

                                $.ajax({
                                    url: thiz.options.operationUriPrefix + "_bw/deleteindividualemail_sent",
                                    contentType: "application/json",
                                    type: 'POST',
                                    data: JSON.stringify(data),
                                    success: function (results) {
                                        try {

                                            if (results.status != 'SUCCESS') {

                                                HideActivitySpinner();
                                                displayAlertDialog(results.message);

                                            } else {

                                                HideActivitySpinner();

                                                console.log('The email has been deleted.');

                                                var foundIt;
                                                for (var i = 0; i < thiz.options.Sent.docs.length; i++) {
                                                    if (thiz.options.Sent.docs[i]._id == _id) {
                                                        // This is the one we just deleted. Instead of going out and getting the entire list again, just remove it here.
                                                        thiz.options.Sent.docs.splice(i, 1); // Delete the item from the array.
                                                        foundIt = true;
                                                        break;
                                                    }
                                                }

                                                if (!foundIt) {

                                                    var msg = 'Error xcx231312-1. Could not find the email.';
                                                    console.log(msg);
                                                    displayAlertDialog(msg);

                                                } else {

                                                    // Update totalDocs.
                                                    thiz.options.Sent.totalDocs -= 1;

                                                    // Update the status.
                                                    var msg = 'Displaying 1 to ' + thiz.options.Sent.docs.length + ' of ' + thiz.options.Sent.totalDocs + ' emails.';
                                                    $('#spanSelectedEmailType_Status').html(msg);

                                                    // Remove the email from the list.
                                                    var elementName = 'bwCalendar_InnerLeftMenuButton_' + _id;
                                                    var element = $('#' + elementName).closest('tr')[0];
                                                    element.remove();

                                                    //
                                                    // Check if the email was being displayed in the large right part of the screen.
                                                    //
                                                    var currentlyDisplayedEmail_id = $('#divEmailClient_CompositionWindow')[0].getAttribute('_id');

                                                    if (currentlyDisplayedEmail_id == _id) {

                                                        // Make the buttons disappear.
                                                        $('#bwCalendar_EmailTopButtons').html('');

                                                        // Clear the email display screen and replace with "SELECT AN EMAIL THAT YOU WISH TO VIEW".
                                                        // An email won't be selected until the user selects one.
                                                        $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '<div xcx="xcx213123-2" style="font-size:25pt;color:lightgray;">SELECT A CALENDAR ITEM THAT YOU WISH TO VIEW.</div>';
                                                        var x = document.getElementById('tdbwCalendar_RightColumn');
                                                        x.style.verticalAlign = 'middle';
                                                        // end: An email won't be selected until the user selects one.

                                                    }

                                                }

                                            }

                                        } catch (e) {

                                            HideActivitySpinner();

                                            console.log('Exception in bwCalendar.js.deleteIndividualEmail():4: ' + e.message + ', ' + e.stack);
                                            displayAlertDialog('Exception in bwCalendar.js.deleteIndividualEmail(): 4:' + e.message + ', ' + e.stack);
                                        }
                                    },
                                    error: function (data, errorCode, errorMessage) {

                                        HideActivitySpinner();

                                        var msg = 'Fail in bwCalendar.js.deleteIndividualEmail(): ' + JSON.stringify(data) + ', ' + errorCode + ', ' + errorMessage;
                                        console.log(msg);
                                        displayAlertDialog(msg);

                                    }
                                });

                            } catch (e) {

                                HideActivitySpinner();

                                var msg = 'Exception in bwCalendar.js.deleteIndividualEmail():3: ' + e.message + ', ' + e.stack;
                                console.log(msg);
                                displayAlertDialog(msg);

                            }

                        })
                        .catch(function (e) {
                            HideActivitySpinner();

                            var msg = 'Exception in bwCalendar.js.deleteIndividualEmail():2: ' + JSON.stringify(e);
                            console.log(msg);
                            displayAlertDialog(msg);

                        });

                } else if (mailboxName == 'Drafts') {

                    ShowActivitySpinner_Promise('Moving to the TrashBin...')
                        .then(function (results) {
                            try {

                                $.ajax({
                                    url: thiz.options.operationUriPrefix + "_bw/deleteindividualemail_drafts",
                                    contentType: "application/json",
                                    type: 'POST',
                                    data: JSON.stringify(data),
                                    success: function (results) {
                                        try {

                                            if (results.status != 'SUCCESS') {

                                                HideActivitySpinner();
                                                displayAlertDialog(results.message);

                                            } else {

                                                HideActivitySpinner();

                                                console.log('The email has been deleted.');

                                                var foundIt;
                                                for (var i = 0; i < thiz.options.Drafts.docs.length; i++) {
                                                    if (thiz.options.Drafts.docs[i]._id == _id) {
                                                        // This is the one we just deleted. Instead of going out and getting the entire list again, just remove it here.
                                                        thiz.options.Drafts.docs.splice(i, 1); // Delete the item from the array.
                                                        foundIt = true;
                                                        break;
                                                    }
                                                }

                                                if (!foundIt) {

                                                    var msg = 'Error xcx231312-1. Could not find the email.';
                                                    console.log(msg);
                                                    displayAlertDialog(msg);

                                                } else {

                                                    // Update totalDocs.
                                                    thiz.options.Drafts.totalDocs -= 1;

                                                    // Update the status.
                                                    var msg = 'Displaying 1 to ' + thiz.options.Drafts.docs.length + ' of ' + thiz.options.Drafts.totalDocs + ' emails.';
                                                    $('#spanSelectedEmailType_Status').html(msg);

                                                    // Remove the email from the list.
                                                    var elementName = 'bwCalendar_InnerLeftMenuButton_' + _id;
                                                    var element = $('#' + elementName).closest('tr')[0];
                                                    element.remove();

                                                    //// An email won't be selected until the user selects one.
                                                    //$(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '<div xcx="xcx213123-2" style="font-size:25pt;color:lightgray;">SELECT A CALENDAR ITEM THAT YOU WISH TO VIEW.</div>';
                                                    //var x = document.getElementById('tdbwCalendar_RightColumn');
                                                    //x.style.verticalAlign = 'middle';
                                                    //// end: An email won't be selected until the user selects one.

                                                    //
                                                    // Check if the email was being displayed in the large right part of the screen.
                                                    //
                                                    var currentlyDisplayedEmail_id = $('#divEmailClient_CompositionWindow')[0].getAttribute('_id');

                                                    if (currentlyDisplayedEmail_id == _id) {

                                                        // Make the buttons disappear.
                                                        $('#bwCalendar_EmailTopButtons').html('');

                                                        // Clear the email display screen and replace with "SELECT AN EMAIL THAT YOU WISH TO VIEW".
                                                        // An email won't be selected until the user selects one.
                                                        $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '<div xcx="xcx213123-2" style="font-size:25pt;color:lightgray;">SELECT A CALENDAR ITEM THAT YOU WISH TO VIEW.</div>';
                                                        var x = document.getElementById('tdbwCalendar_RightColumn');
                                                        x.style.verticalAlign = 'middle';
                                                        // end: An email won't be selected until the user selects one.

                                                    }

                                                }

                                            }

                                        } catch (e) {

                                            HideActivitySpinner();

                                            console.log('Exception in bwCalendar.js.deleteIndividualEmail():4: ' + e.message + ', ' + e.stack);
                                            displayAlertDialog('Exception in bwCalendar.js.deleteIndividualEmail(): 4:' + e.message + ', ' + e.stack);
                                        }
                                    },
                                    error: function (data, errorCode, errorMessage) {

                                        HideActivitySpinner();

                                        var msg = 'Fail in bwCalendar.js.deleteIndividualEmail(): ' + JSON.stringify(data) + ', ' + errorCode + ', ' + errorMessage;
                                        console.log(msg);
                                        displayAlertDialog(msg);

                                    }
                                });

                            } catch (e) {

                                HideActivitySpinner();

                                var msg = 'Exception in bwCalendar.js.deleteIndividualEmail():3: ' + e.message + ', ' + e.stack;
                                console.log(msg);
                                displayAlertDialog(msg);

                            }

                        })
                        .catch(function (e) {
                            HideActivitySpinner();

                            var msg = 'Exception in bwCalendar.js.deleteIndividualEmail():2: ' + JSON.stringify(e);
                            console.log(msg);
                            displayAlertDialog(msg);

                        });

                } else if (mailboxName == 'Junk') {

                    ShowActivitySpinner_Promise('Moving to the TrashBin...')
                        .then(function (results) {
                            try {

                                $.ajax({
                                    url: thiz.options.operationUriPrefix + "_bw/deleteindividualemail_junk",
                                    contentType: "application/json",
                                    type: 'POST',
                                    data: JSON.stringify(data),
                                    success: function (results) {
                                        try {

                                            if (results.status != 'SUCCESS') {

                                                HideActivitySpinner();
                                                displayAlertDialog(results.message);

                                            } else {

                                                HideActivitySpinner();

                                                console.log('The email has been deleted.');

                                                var foundIt;
                                                for (var i = 0; i < thiz.options.Junk.docs.length; i++) {
                                                    if (thiz.options.Junk.docs[i]._id == _id) {
                                                        // This is the one we just deleted. Instead of going out and getting the entire list again, just remove it here.
                                                        thiz.options.Junk.docs.splice(i, 1); // Delete the item from the array.
                                                        foundIt = true;
                                                        break;
                                                    }
                                                }

                                                if (!foundIt) {

                                                    var msg = 'Error xcx231312-1. Could not find the email.';
                                                    console.log(msg);
                                                    displayAlertDialog(msg);

                                                } else {

                                                    // Update totalDocs.
                                                    thiz.options.Junk.totalDocs -= 1;

                                                    // Update the status.
                                                    var msg = 'Displaying 1 to ' + thiz.options.Junk.docs.length + ' of ' + thiz.options.Junk.totalDocs + ' emails.';
                                                    $('#spanSelectedEmailType_Status').html(msg);

                                                    // Remove the email from the list.
                                                    var elementName = 'bwCalendar_InnerLeftMenuButton_' + _id;
                                                    var element = $('#' + elementName).closest('tr')[0];
                                                    element.remove();

                                                    //// An email won't be selected until the user selects one.
                                                    //$(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '<div xcx="xcx213123-2" style="font-size:25pt;color:lightgray;">SELECT A CALENDAR ITEM THAT YOU WISH TO VIEW.</div>';
                                                    //var x = document.getElementById('tdbwCalendar_RightColumn');
                                                    //x.style.verticalAlign = 'middle';
                                                    //// end: An email won't be selected until the user selects one.

                                                    //
                                                    // Check if the email was being displayed in the large right part of the screen.
                                                    //
                                                    var currentlyDisplayedEmail_id = $('#divEmailClient_CompositionWindow')[0].getAttribute('_id');

                                                    if (currentlyDisplayedEmail_id == _id) {

                                                        // Make the buttons disappear.
                                                        $('#bwCalendar_EmailTopButtons').html('');

                                                        // Clear the email display screen and replace with "SELECT AN EMAIL THAT YOU WISH TO VIEW".
                                                        // An email won't be selected until the user selects one.
                                                        $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '<div xcx="xcx213123-2" style="font-size:25pt;color:lightgray;">SELECT A CALENDAR ITEM THAT YOU WISH TO VIEW.</div>';
                                                        var x = document.getElementById('tdbwCalendar_RightColumn');
                                                        x.style.verticalAlign = 'middle';
                                                        // end: An email won't be selected until the user selects one.

                                                    }

                                                }

                                            }

                                        } catch (e) {

                                            HideActivitySpinner();

                                            console.log('Exception in bwCalendar.js.deleteIndividualEmail():4: ' + e.message + ', ' + e.stack);
                                            displayAlertDialog('Exception in bwCalendar.js.deleteIndividualEmail(): 4:' + e.message + ', ' + e.stack);
                                        }
                                    },
                                    error: function (data, errorCode, errorMessage) {

                                        HideActivitySpinner();

                                        var msg = 'Fail in bwCalendar.js.deleteIndividualEmail(): ' + JSON.stringify(data) + ', ' + errorCode + ', ' + errorMessage;
                                        console.log(msg);
                                        displayAlertDialog(msg);

                                    }
                                });

                            } catch (e) {

                                HideActivitySpinner();

                                var msg = 'Exception in bwCalendar.js.deleteIndividualEmail():3: ' + e.message + ', ' + e.stack;
                                console.log(msg);
                                displayAlertDialog(msg);

                            }

                        })
                        .catch(function (e) {
                            HideActivitySpinner();

                            var msg = 'Exception in bwCalendar.js.deleteIndividualEmail():2: ' + JSON.stringify(e);
                            console.log(msg);
                            displayAlertDialog(msg);

                        });

                } else if (mailboxName == 'Archived') {

                    ShowActivitySpinner_Promise('Moving to the TrashBin...')
                        .then(function (results) {
                            try {

                                $.ajax({
                                    url: thiz.options.operationUriPrefix + "_bw/deleteindividualemail_archived",
                                    contentType: "application/json",
                                    type: 'POST',
                                    data: JSON.stringify(data),
                                    success: function (results) {
                                        try {

                                            if (results.status != 'SUCCESS') {

                                                HideActivitySpinner();
                                                displayAlertDialog(results.message);

                                            } else {

                                                HideActivitySpinner();

                                                console.log('The email has been deleted.');

                                                var foundIt;
                                                for (var i = 0; i < thiz.options.Archived.docs.length; i++) {
                                                    if (thiz.options.Archived.docs[i]._id == _id) {
                                                        // This is the one we just deleted. Instead of going out and getting the entire list again, just remove it here.
                                                        thiz.options.Archived.docs.splice(i, 1); // Delete the item from the array.
                                                        foundIt = true;
                                                        break;
                                                    }
                                                }

                                                if (!foundIt) {

                                                    var msg = 'Error xcx231312-1. Could not find the email.';
                                                    console.log(msg);
                                                    displayAlertDialog(msg);

                                                } else {

                                                    // Update totalDocs.
                                                    thiz.options.Archived.totalDocs -= 1;

                                                    // Update the status.
                                                    var msg = 'Displaying 1 to ' + thiz.options.Archived.docs.length + ' of ' + thiz.options.Archived.totalDocs + ' emails.';
                                                    $('#spanSelectedEmailType_Status').html(msg);

                                                    // Remove the email from the list.
                                                    var elementName = 'bwCalendar_InnerLeftMenuButton_' + _id;
                                                    var element = $('#' + elementName).closest('tr')[0];
                                                    element.remove();

                                                    //// An email won't be selected until the user selects one.
                                                    //$(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '<div xcx="xcx213123-2" style="font-size:25pt;color:lightgray;">SELECT A CALENDAR ITEM THAT YOU WISH TO VIEW.</div>';
                                                    //var x = document.getElementById('tdbwCalendar_RightColumn');
                                                    //x.style.verticalAlign = 'middle';
                                                    //// end: An email won't be selected until the user selects one.

                                                    //
                                                    // Check if the email was being displayed in the large right part of the screen.
                                                    //
                                                    var currentlyDisplayedEmail_id = $('#divEmailClient_CompositionWindow')[0].getAttribute('_id');

                                                    if (currentlyDisplayedEmail_id == _id) {

                                                        // Make the buttons disappear.
                                                        $('#bwCalendar_EmailTopButtons').html('');

                                                        // Clear the email display screen and replace with "SELECT AN EMAIL THAT YOU WISH TO VIEW".
                                                        // An email won't be selected until the user selects one.
                                                        $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '<div xcx="xcx213123-2" style="font-size:25pt;color:lightgray;">SELECT A CALENDAR ITEM THAT YOU WISH TO VIEW.</div>';
                                                        var x = document.getElementById('tdbwCalendar_RightColumn');
                                                        x.style.verticalAlign = 'middle';
                                                        // end: An email won't be selected until the user selects one.

                                                    }

                                                }

                                            }

                                        } catch (e) {

                                            HideActivitySpinner();

                                            console.log('Exception in bwCalendar.js.deleteIndividualEmail():4: ' + e.message + ', ' + e.stack);
                                            displayAlertDialog('Exception in bwCalendar.js.deleteIndividualEmail(): 4:' + e.message + ', ' + e.stack);
                                        }
                                    },
                                    error: function (data, errorCode, errorMessage) {

                                        HideActivitySpinner();

                                        var msg = 'Fail in bwCalendar.js.deleteIndividualEmail(): ' + JSON.stringify(data) + ', ' + errorCode + ', ' + errorMessage;
                                        console.log(msg);
                                        displayAlertDialog(msg);

                                    }
                                });

                            } catch (e) {

                                HideActivitySpinner();

                                var msg = 'Exception in bwCalendar.js.deleteIndividualEmail():3: ' + e.message + ', ' + e.stack;
                                console.log(msg);
                                displayAlertDialog(msg);

                            }

                        })
                        .catch(function (e) {
                            HideActivitySpinner();

                            var msg = 'Exception in bwCalendar.js.deleteIndividualEmail():2: ' + JSON.stringify(e);
                            console.log(msg);
                            displayAlertDialog(msg);

                        });

                } else if (mailboxName == 'TrashBin') {

                    ShowActivitySpinner_Promise('Permanently removing from the TrashBin...')
                        .then(function (results) {
                            try {

                                $.ajax({
                                    url: thiz.options.operationUriPrefix + "_bw/deleteindividualemail_trashbin",
                                    contentType: "application/json",
                                    type: 'POST',
                                    data: JSON.stringify(data),
                                    success: function (results) {
                                        try {

                                            if (results.status != 'SUCCESS') {

                                                HideActivitySpinner();
                                                displayAlertDialog(results.message);

                                            } else {

                                                HideActivitySpinner();

                                                console.log('The email has been deleted.');

                                                var foundIt;
                                                for (var i = 0; i < thiz.options.TrashBin.docs.length; i++) {
                                                    if (thiz.options.TrashBin.docs[i]._id == _id) {
                                                        // This is the one we just deleted. Instead of going out and getting the entire list again, just remove it here.
                                                        thiz.options.TrashBin.docs.splice(i, 1); // Delete the item from the array.
                                                        foundIt = true;
                                                        break;
                                                    }
                                                }

                                                if (!foundIt) {

                                                    var msg = 'Error xcx231312-1. Could not find the email.';
                                                    console.log(msg);
                                                    displayAlertDialog(msg);

                                                } else {

                                                    // Update totalDocs.
                                                    thiz.options.TrashBin.totalDocs -= 1;

                                                    // Update the status.
                                                    var msg = 'Displaying 1 to ' + thiz.options.TrashBin.docs.length + ' of ' + thiz.options.TrashBin.totalDocs + ' emails.';
                                                    $('#spanSelectedEmailType_Status').html(msg);

                                                    // Remove the email from the list.
                                                    var elementName = 'bwCalendar_InnerLeftMenuButton_' + _id;
                                                    var element = $('#' + elementName).closest('tr')[0];
                                                    element.remove();

                                                    //// An email won't be selected until the user selects one.
                                                    //$(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '<div xcx="xcx213123-2" style="font-size:25pt;color:lightgray;">SELECT A CALENDAR ITEM THAT YOU WISH TO VIEW.</div>';
                                                    //var x = document.getElementById('tdbwCalendar_RightColumn');
                                                    //x.style.verticalAlign = 'middle';
                                                    //// end: An email won't be selected until the user selects one.

                                                    //
                                                    // Check if the email was being displayed in the large right part of the screen.
                                                    //
                                                    var currentlyDisplayedEmail_id = $('#divEmailClient_CompositionWindow')[0].getAttribute('_id');

                                                    if (currentlyDisplayedEmail_id == _id) {

                                                        // Make the buttons disappear.
                                                        $('#bwCalendar_EmailTopButtons').html('');

                                                        // Clear the email display screen and replace with "SELECT AN EMAIL THAT YOU WISH TO VIEW".
                                                        // An email won't be selected until the user selects one.
                                                        $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '<div xcx="xcx213123-2" style="font-size:25pt;color:lightgray;">SELECT A CALENDAR ITEM THAT YOU WISH TO VIEW.</div>';
                                                        var x = document.getElementById('tdbwCalendar_RightColumn');
                                                        x.style.verticalAlign = 'middle';
                                                        // end: An email won't be selected until the user selects one.

                                                    }

                                                }

                                            }

                                        } catch (e) {

                                            HideActivitySpinner();

                                            console.log('Exception in bwCalendar.js.deleteIndividualEmail():4: ' + e.message + ', ' + e.stack);
                                            displayAlertDialog('Exception in bwCalendar.js.deleteIndividualEmail(): 4:' + e.message + ', ' + e.stack);
                                        }
                                    },
                                    error: function (data, errorCode, errorMessage) {

                                        HideActivitySpinner();

                                        var msg = 'Fail in bwCalendar.js.deleteIndividualEmail(): ' + JSON.stringify(data) + ', ' + errorCode + ', ' + errorMessage;
                                        console.log(msg);
                                        displayAlertDialog(msg);

                                    }
                                });

                            } catch (e) {

                                HideActivitySpinner();

                                var msg = 'Exception in bwCalendar.js.deleteIndividualEmail():3: ' + e.message + ', ' + e.stack;
                                console.log(msg);
                                displayAlertDialog(msg);

                            }

                        })
                        .catch(function (e) {
                            HideActivitySpinner();

                            var msg = 'Exception in bwCalendar.js.deleteIndividualEmail():2: ' + JSON.stringify(e);
                            console.log(msg);
                            displayAlertDialog(msg);

                        });

                } else {

                    var msg = 'Error in bwCalendar.js.deleteIndividualEmail(). Invalid value for mailboxName: ' + mailboxName;
                    console.log(msg);
                    displayAlertDialog(msg);

                }

            }

        } catch (e) {
            var msg = 'Exception in bwCalendar.js.deleteIndividualEmail(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
        }
    },
    undeleteIndividualEmail: function (_id) {
        try {
            console.log('In bwCalendar.js.undeleteIndividualEmail(). _id: ' + _id);
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            if (!(workflowAppId && participantId && _id)) {

                console.log('Error in bwCalendar.js.undeleteIndividualEmail(): Invalid value. Expected values for workflowAppId: ' + workflowAppId + ', participantId: ' + participantId + ', _id: ' + _id);
                displayAlertDialog('Error in bwCalendar.js.undeleteIndividualEmail(): Invalid value. Expected values for workflowAppId: ' + workflowAppId + ', participantId: ' + participantId + ', _id: ' + _id);

            } else {

                ShowActivitySpinner_Promise('Moving to the TrashBin...')
                    .then(function (results) {
                        try {

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
                                url: thiz.options.operationUriPrefix + "_bw/undeleteindividualemail",
                                contentType: "application/json",
                                type: 'POST',
                                data: JSON.stringify(data),
                                success: function (results) {
                                    try {

                                        if (results.status != 'SUCCESS') {

                                            HideActivitySpinner();
                                            displayAlertDialog(results.message);

                                        } else {

                                            HideActivitySpinner();

                                            console.log('The email has been undeleted.');
                                            //$('#divBwEmailMonitor_DeleteSentEmailsDialog').dialog('close');

                                            var foundIt;
                                            for (var i = 0; i < thiz.options.TrashBin.docs.length; i++) {
                                                if (thiz.options.TrashBin.docs[i]._id == _id) {
                                                    // This is the one we just deleted. Instead of going out and getting the entire list again, just remove it here.
                                                    thiz.options.Inbox.docs.push(thiz.options.TrashBin.docs[i]); // Add it to this array.
                                                    thiz.options.TrashBin.docs.splice(i, 1); // Delete it from this array.
                                                    foundIt = true;
                                                    break;
                                                }
                                            }

                                            if (!foundIt) {

                                                var msg = 'Error xcx231312-2-1. Could not find the email.';
                                                console.log(msg);
                                                displayAlertDialog(msg);

                                            } else {

                                                //thiz.renderEmails_TrashBin();
                                                thiz.loadAndRenderEmails_Inbox();

                                            }

                                        }

                                    } catch (e) {

                                        HideActivitySpinner();

                                        console.log('Exception in bwCalendar.js.undeleteIndividualEmail():4: ' + e.message + ', ' + e.stack);
                                        displayAlertDialog('Exception in bwCalendar.js.undeleteIndividualEmail(): 4:' + e.message + ', ' + e.stack);
                                    }

                                },
                                error: function (data, errorCode, errorMessage) {

                                    HideActivitySpinner();

                                    var msg = 'Fail in bwCalendar.js.undeleteIndividualEmail(): ' + JSON.stringify(data) + ', ' + errorCode + ', ' + errorMessage;
                                    console.log(msg);
                                    displayAlertDialog(msg);

                                }
                            });

                        } catch (e) {

                            HideActivitySpinner();

                            var msg = 'Exception in bwCalendar.js.undeleteIndividualEmail():3: ' + e.message + ', ' + e.stack;
                            console.log(msg);
                            displayAlertDialog(msg);

                        }

                    })
                    .catch(function (e) {
                        HideActivitySpinner();

                        var msg = 'Exception in bwCalendar.js.undeleteIndividualEmail():2: ' + JSON.stringify(e);
                        console.log(msg);
                        displayAlertDialog(msg);

                    });

            }

        } catch (e) {
            var msg = 'Exception in bwCalendar.js.undeleteIndividualEmail(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
        }
    },

    
    search: function (mailbox) { // mailbox: ['INBOX', 'SENT', ...]
        try {
            console.log('In bwCalendar.js.search(). mailbox: ' + mailbox);
            alert('In bwCalendar.js.search(). mailbox: ' + mailbox);
            var thiz = this;
            // search in bwBudgetRequest:
            //      - title (eg: BR-220002)
            //      - project title (eg: partial description text)
            //      - bwBudgetRequestJson

            document.getElementById('inputBwAuthentication_SearchBox').blur(); // This is here to prevent the search box from getting the cursor and showing the keyboard.

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            var searchTerm = String($('#inputBwAuthentication_SearchBox').val()).trim();

            ShowActivitySpinner('Searching your Inbox [we need to add support for the sent emails etc.] for "' + searchTerm + '"...');

            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                offset: offset,
                limit: limit,
                searchTerm: searchTerm,
                mailbox: mailbox // mailbox: ['INBOX', 'SENT', ...]

            };
            var operationUri = webserviceurl + "/participantemail_search";
            $.ajax({
                url: operationUri,
                type: "POST",
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (results) {
                    try {
                        debugger; // <<<<<<<<<<<<<<<<<<<< NEW RESULTS 7-22-2024 1-05pm adt
                        if (results.status != 'SUCCESS') {

                            HideActivitySpinner();
                            console.log('Error xcx12345: ' + JSON.stringify(results.message));
                            displayAlertDialog('Error xcx12345: ' + JSON.stringify(results.message));

                        } else {

                            HideActivitySpinner();

                            $('#divPageContent2_Title').html('✉&nbsp;INBOX xcx4431-1.');

                            // Select the HOME button here. 1-4-2024.
                            var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
                            var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

                            // Step 1: Make all of the buttons un-selected.
                            $('.bwCalendar:first').find('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                                $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
                            });

                            // Step 2: Set the specified button as the selected one.
                            $('#divInnerLeftMenuButton_Inbox').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);

                            thiz.options.Search = results.data;

                            //thiz.renderEmails_search(); // viewIndividualEmail_SearchResults
                            thiz.loadAndRenderEmails_Search(); // 7-11-2024.




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

                        }

                    } catch (e) {
                        HideActivitySpinner();
                        console.log('Exception in bwCalendar.js.search.getsearchresults.success(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwCalendar.js.search.getsearchresults.success(): ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    HideActivitySpinner();
                    console.log('Error in bwCalendar.js.search.getsearchresults.error(): ' + errorCode + ', ' + errorMessage + JSON.stringify(data));
                    displayAlertDialog('Error in bwCalendar.js.search.getsearchresults.error(): ' + errorCode + ', ' + errorMessage + JSON.stringify(data));
                }
            });

        } catch (e) {
            HideActivitySpinner();
            console.log('Exception in bwCalendar.js.search(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCalendar.js.search(): ' + e.message + ', ' + e.stack);
        }
    },


    cmdReturnEmailToToField: function (email) {
        try {
            console.log('In bwCalendar.js.cmdReturnEmailToToField().');

            var emails = $('#bwCalendar_RecipientsList').val();

            var emailsArray = emails.split(';');

            var newEmailsString = '';
            for (var i = 0; i < emailsArray.length; i++) {
                if (emailsArray[i].indexOf('@') > -1) {

                    // There is an [@] character, so we will assume that this is a complete email address.
                    if (newEmailsString == '') {
                        newEmailsString += emailsArray[i];
                    } else {
                        newEmailsString += ';' + emailsArray[i];
                    }

                }
            }

            if (newEmailsString == '') {
                newEmailsString += email + ';';
            } else {
                newEmailsString += ';' + email + ';';
            }

            $('#bwCalendar_RecipientsList').val(newEmailsString);

            $('#bwCalendar_RecipientsList_PeoplePicker').html('');

        } catch (e) {
            var msg = 'Exception in bwCalendar.js.cmdReturnEmailToToField(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
        }
    },


    composeANewEmailMessage: function () {
        try {
            console.log('In bwCalendar.js.composeANewEmailMessage().');
            //alert('In bwCalendar.js.composeANewEmailMessage().');
            var thiz = this;

            // Set the right column to vertical-align: top;
            var x = document.getElementById('tdbwCalendar_RightColumn');
            x.style.verticalAlign = 'top';
            // end: Set the right column to vertical-align: top;

            $('#divPageContent2_Title').html('✉&nbsp;NEW MESSAGE');

            // Select the HOME button here. 1-4-2024.
            var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');

            var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

            // Step 1: Make all of the buttons un-selected.
            $('.bwCalendar:first').find('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
            });

            // Step 2: Set the specified button as the selected one.
            $('#divInnerLeftMenuButton_NewMessage').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);


            // xcx232144-1.
            var newMessageButton = document.getElementById('divInnerLeftMenuButton_NewMessage');
            var height = Number(newMessageButton.style.height.split('px')[0]);

            console.log('xcxs21321312 >>> SETTING newMessageButton OriginalHeight to: ' + height);
            //alert('xcxs21321312 >>> SETTING newMessageButton OriginalHeight to: ' + height);

            // Display the top buttons.
            html = '';
            html += '<button xcx="xcx324234667" class="BwButton200" onclick="$(\'.bwCalendar:first\').bwCalendar(\'SendSingleEmailNow\');">SEND NOW</button>'; // BwButton200ForRequestForm
            html += '&nbsp;&nbsp;&nbsp;&nbsp;';
            html += '<button xcx="xcx213124-1" class="BwButton200" style="color:red;font-weight:bold;" onclick="$(\'.bwCalendar:first\').bwCalendar(\'saveDraft\');">SAVE DRAFT</button>'; // BwSmallButton
            $('#bwCalendar_EmailTopButtons').html(html);
            // end: Display the top buttons.

            this.displayNewMessageEditorHtml().then(function (results) {

                if (results.status != 'SUCCESS') {

                    var msg = 'Error in bwCalendar.js.composeANewEmailMessage(): ' + results.message;
                    console.log(msg);
                    displayAlertDialog(msg);

                } else {

                    console.log('In bwCalendar.js.composeANewEmailMessage(). Successfully returned from displayNewMessageEditorHtml().');

                }

            }).catch(function (e) {

                var msg = 'Exception in bwCalendar.js.composeANewEmailMessage(): ' + JSON.stringify(e);
                console.log(msg);
                displayAlertDialog(msg);

            });

        } catch (e) {
            console.log('Exception in bwCalendar.js.composeANewEmailMessage(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCalendar.js.composeANewEmailMessage(): ' + e.message + ', ' + e.stack);
        }
    },
    composeANewEmailMessage_Reply: function () {
        try {
            console.log('In bwCalendar.js.composeANewEmailMessage_Reply().');
            //alert('In bwCalendar.js.composeANewEmailMessage_Reply().');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            var originalEmail__id = $('#divEmailClient_CompositionWindow')[0].getAttribute('_id');

            // Set the right column to vertical-align: top;
            var x = document.getElementById('tdbwCalendar_RightColumn');
            x.style.verticalAlign = 'top';
            // end: Set the right column to vertical-align: top;

            $('#divPageContent2_Title').html('✉&nbsp;NEW MESSAGE');

            // Select the HOME button here. 1-4-2024.
            var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');

            var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

            // Step 1: Make all of the buttons un-selected.
            $('.bwCalendar:first').find('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
            });

            // Step 2: Set the specified button as the selected one.
            $('#divInnerLeftMenuButton_NewMessage').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);

            // xcx232144-1.
            var newMessageButton = document.getElementById('divInnerLeftMenuButton_NewMessage');
            var height = Number(newMessageButton.style.height.split('px')[0]);

            console.log('xcxs21321312 >>> SETTING newMessageButton OriginalHeight to: ' + height);
            //alert('xcxs21321312 >>> SETTING newMessageButton OriginalHeight to: ' + height);

            // Display the top buttons.
            html = '';
            html += '<button xcx="xcx324234667" class="BwButton200" onclick="$(\'.bwCalendar:first\').bwCalendar(\'SendSingleEmailNow\');">SEND NOW</button>'; // BwButton200ForRequestForm
            html += '&nbsp;&nbsp;&nbsp;&nbsp;';
            html += '<button xcx="xcx213124-1" class="BwButton200" style="color:red;font-weight:bold;" onclick="$(\'.bwCalendar:first\').bwCalendar(\'saveDraft\');">SAVE DRAFT</button>'; // BwSmallButton
            $('#bwCalendar_EmailTopButtons').html(html);
            // end: Display the top buttons.

            //
            // The webservice will look up this email in the Inbox, and copy it to the BwDraftEmail table, and respond with all of the details of the new email so we can display it.
            //

            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                originalEmail__id: originalEmail__id
            };

            $.ajax({
                url: this.options.operationUriPrefix + "_files/createdraftemailreply", // _bw/savedraftemail
                type: 'POST',
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (results) {
                    try {
                        debugger;
                        //displayAlertDialog_Persistent('xcx213123412 results: ' + JSON.stringify(results));
                        if (results.status != 'SUCCESS') {

                            var msg = results.status + ': ' + results.message;
                            console.log(msg);
                            displayAlertDialog(msg);

                        } else {

                            alert('In composeANewEmailMessage_Reply(). Just returned from _files/createdraftemailreply().');

                            thiz.displayNewMessageEditorHtml(results.bwDraftEmail).then(function (results) {
                                try {

                                    if (results.status != 'SUCCESS') {

                                        var msg = 'Error in bwCalendar.js.composeANewEmailMessage_Reply(): ' + results.message;
                                        console.log(msg);
                                        displayAlertDialog(msg);

                                    } else {

                                        console.log('In bwCalendar.js.composeANewEmailMessage_Reply(). Successfully returned from displayNewMessageEditorHtml().');

                                        var email = results.email;

                                        if (!email) {

                                            var msg = 'Error in bwCalendar.js.composeANewEmailMessage_Reply(). Could not locate the email in the bwDraftEmail table.';
                                            console.log(msg);
                                            displayAlertDialog(msg);

                                        } else {
                                            debugger;

                                            var sent = bwCommonScripts.getBudgetWorkflowStandardizedDate(email.received_date);

                                            var newBody = '';
                                            newBody += '<br />';
                                            newBody += '<br />';
                                            newBody += '<br />';
                                            newBody += '<hr />';
                                            newBody += 'From: ' + participantEmail;
                                            newBody += '<br />';
                                            newBody += 'Sent: ' + sent;
                                            newBody += '<br />';
                                            newBody += 'To: ' + JSON.stringify(email.from);
                                            newBody += '<br />';
                                            newBody += 'Subject: ' + email.subject;
                                            newBody += '<br />';
                                            newBody += '<br />';
                                            newBody += '<br />';
                                            newBody += email.html;
                                            debugger;
                                            thiz.cleanEmailBodyHtmlForDisplay(newBody).then(function (results) {
                                                try {

                                                    if (results.status != 'SUCCESS') {

                                                        var msg = 'Error in bwCalendar.js.composeANewEmailMessage_Reply.cleanEmailBodyHtmlForDisplay(). ' + results.status + ', ' + results.message;
                                                        console.log(msg);
                                                        displayAlertDialog(msg);

                                                    } else {
                                                        debugger; // results.html
                                                        $('#bwCalendar_EmailBody').summernote('code', results.html);

                                                        console.log('In bwCalendar.js.composeANewEmailMessage_Reply(). >>>>>>>>>> Here is a good opportunity to vertically stretch the .note-editor. xcx99385667.');







                                                        $('#bwCalendar_RecipientsList').val(email.to);

                                                        //var newSubject = 'Fwd: ' + email.subject;
                                                        //$('#bwCalendar_EmailSubject').val(newSubject);

                                                        //var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');






                                                        var emailTemplateForSubject;
                                                        if (email && email.subject) {
                                                            emailTemplateForSubject = email.subject;
                                                        }
                                                        //var emailTemplate;
                                                        //if (email && email.html) {
                                                        //    emailTemplate = email.html;
                                                        //}
                                                        if (emailTemplateForSubject && emailTemplateForSubject != '') {
                                                            $(thiz.element).find('#bwCalendar_EmailSubject')[0].value = emailTemplateForSubject;
                                                        } else {
                                                            $(thiz.element).find('#bwCalendar_EmailSubject')[0].value = '';
                                                        }

                                                        debugger;
                                                        thiz.renderAttachments(email._id, email.attachments);

                                                        //console.log('In bwCalendar.js.viewIndividualEmail_Inbox(). Turned off this call to bwActiveMenu.js.adjustLeftSideMenu(). DO WE NEED IT BACK????????? 12-24-2022');
                                                        // THIS IS THE FIRST TIME WE ARE USING setTimeout for the call to bwActiveMenu.adjustLeftSideMenu(). 4-25-2022
                                                        //setTimeout(function () { // Only needs to happen for Chrome.
                                                        //    // menu should be re-done since the display has probably resized from the display of the email.
                                                        //    //alert('Calling bwActiveMenu.adjustLeftSideMenu().');
                                                        //    displayAlertDialog('Calling bwActiveMenu.adjustLeftSideMenu(). xcx123423521-6.');
                                                        //    $('.bwActiveMenu').bwActiveMenu('adjustLeftSideMenu');
                                                        //}, 500);

                                                        var result = {
                                                            status: 'SUCCESS',
                                                            message: 'SUCCESS',
                                                            email: email
                                                        }

                                                        resolve(result);

                                                    }

                                                } catch (e) {

                                                    var msg = 'Exception in bwCalendar.js.composeANewEmailMessage_Reply():3: ' + e.message + ', ' + e.stack;

                                                    var result = {
                                                        status: 'EXCEPTION',
                                                        message: msg
                                                    }

                                                    reject(result);

                                                }

                                            }).catch(function (e) {

                                                var msg = 'Exception in bwCalendar.js.composeANewEmailMessage_Reply():2: ' + JSON.stringify(e);

                                                var result = {
                                                    status: 'EXCEPTION',
                                                    message: msg
                                                }

                                                reject(result);

                                            });

                                        }

                                    }

                                } catch (e) {
                                    console.log('Exception in bwCalendar.js.composeANewEmailMessage_Reply():3: ' + e.message + ', ' + e.stack);
                                    displayAlertDialog('Exception in bwCalendar.js.composeANewEmailMessage_Reply():3: ' + e.message + ', ' + e.stack);
                                }

                            }).catch(function (e) {

                                var msg = 'Exception in bwCalendar.js.composeANewEmailMessage_Reply():2: ' + JSON.stringify(e);
                                console.log(msg);
                                displayAlertDialog(msg);

                            });

                        }

                    } catch (e) {
                        console.log('Exception in bwCalendar.js.composeANewEmailMessage_Reply():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwCalendar.js.composeANewEmailMessage_Reply():2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in bwCalendar.js.composeANewEmailMessage_Reply():' + errorCode + ', ' + errorMessage);
                    displayAlertDialog('Error in bwCalendar.js.composeANewEmailMessage_Reply():' + errorCode + ', ' + errorMessage);
                }
            });

        } catch (e) {
            console.log('Exception in bwCalendar.js.composeANewEmailMessage_Reply(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCalendar.js.composeANewEmailMessage_Reply(): ' + e.message + ', ' + e.stack);
        }
    },

    SendSingleEmailNow: function () {
        try {
            console.log('In bwCalendar.js.SendSingleEmailNow().');
            //alert('In bwCalendar.js.SendSingleEmailNow().');

            var to; // = [];
            var singleRecipient = $('#bwCalendar_RecipientsList').val(); // 'fred@budgetworkflow.com;betty@budgetworkflow.com;dino@budgetworkflow.com'
            to = singleRecipient;

            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');

            var from = participantEmail;
            var subject = $('#bwCalendar_EmailSubject').val();
            var body = $('#bwCalendar_EmailBody').summernote('code');
            var _id = $('#divEmailClient_CompositionWindow')[0].getAttribute('_id');

            if (!_id) {

                var msg = 'Error in bwCalendar.js.SendSingleEmailNow(). INVALID VALUE FOR _id: ' + _id;
                console.log(msg);
                displayAlertDialog(msg);

            } else {

                console.log('In bwCalendar.js.SendSingleEmailNow(). xcx2312312 bwdraftemailid/_id: ' + _id);
                //alert('In bwCalendar.js.SendSingleEmailNow(). xcx2312312 bwdraftemailid/_id: ' + _id);

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

                        _id: _id,

                        //bwDraftEmailId: bwDraftEmailId, // This is dulpicate information. Leaving it for now, as there may be more work to be done. 5-23-2024.

                        to: to,
                        from: from,
                        subject: subject,
                        body: body

                    };

                    //console.log('xcx2112312 Sending email with bwDraftEmailId: ' + bwDraftEmailId);
                    debugger;
                    $.ajax({
                        //url: this.options.operationUriPrefix + "_bw/sendsingleemailnow",
                        url: this.options.operationUriPrefix + "_files/sendsingleemailnow", // Email has to be sent from a fileservices server, because that is where the attachments reside. // 4-25-2024. // See sendgrid docs: https://www.twilio.com/en-us/blog/sending-email-attachments-with-sendgrid
                        type: "POST",
                        data: data,
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        },
                        success: function (results) {
                            try {
                                debugger;
                                if (results.status != 'SUCCESS') {

                                    if ((results.status == 'INVALID_EMAIL_ADDRESS') || (results.status == 'INVALID_PARAMETER')) {

                                        displayAlertDialog(results.message);

                                    } else {

                                        displayAlertDialog(JSON.stringify(results));

                                    }

                                } else {

                                    console.log(results.message);
                                    displayAlertDialog_QuickNotice('The email was sent successfully.');
                                    //displayAlertDialog('The email was sent successfully. Server message: ' + results.message);

                                }

                            } catch (e) {
                                console.log('Exception in bwCalendar.js.SendSingleEmailNow():2: ' + e.message + ', ' + e.stack);
                                displayAlertDialog('Exception in bwCalendar.js.SendSingleEmailNow():2: ' + e.message + ', ' + e.stack);
                            }
                        },
                        error: function (data, errorCode, errorMessage) {
                            console.log('Error in bwCalendar.js.SendSingleEmailNow():' + errorCode + ', ' + errorMessage);
                            displayAlertDialog('Error in bwCalendar.js.SendSingleEmailNow():' + errorCode + ', ' + errorMessage);
                        }

                    });

                }

            }

        } catch (e) {
            console.log('Exception in bwCalendar.js.SendSingleEmailNow(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCalendar.js.SendSingleEmailNow(): ' + e.message + ', ' + e.stack);
        }
    },
    SendSingleEmailScheduled: function () {
        try {
            console.log('In bwCalendar.js.SendSingleEmailScheduled().');

            alert('In bwCalendar.js.SendSingleEmailScheduled(). This functionality is incomplete. Coming soon!');

            //var to; // = [];
            //var singleRecipient = $('#bwCalendar_RecipientsList').val(); // 'fred@budgetworkflow.com;betty@budgetworkflow.com;dino@budgetworkflow.com'
            //to = singleRecipient;

            //var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');

            //var from = participantEmail;

            //var subject = $('#bwCalendar_EmailSubject').val(); //'test subject xcx2131234234';

            //var body = $('#bwCalendar_EmailBody').html(); //'test body xcx12346u';

            //var proceed = confirm('Confirm these email details: \nTO: ' + to + '\nSUBJECT: ' + subject + '\nBODY: ' + body);
            //if (proceed) {

            //    var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            //    var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            //    var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            //    var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            //    var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            //    var data = {
            //        bwParticipantId_LoggedIn: participantId,
            //        bwActiveStateIdentifier: activeStateIdentifier,
            //        bwWorkflowAppId_LoggedIn: workflowAppId,

            //        bwWorkflowAppId: workflowAppId,
            //        bwParticipantId: participantId,
            //        bwParticipantEmail: participantEmail,
            //        bwParticipantFriendlyName: participantFriendlyName,

            //        To: to,
            //        From: from,
            //        Subject: subject,
            //        Body: body
            //    };

            //    $.ajax({
            //        url: this.options.operationUriPrefix + "_bw/SendSingleEmailNow",
            //        type: "POST",
            //        data: data,
            //        headers: {
            //            "Accept": "application/json; odata=verbose"
            //        },
            //        success: function (results) {
            //            try {

            //                if (results.status != 'SUCCESS') {

            //                    displayAlertDialog(JSON.stringify(results));

            //                } else {

            //                    console.log(results.message);
            //                    displayAlertDialog('The email was sent successfully.');

            //                }

            //            } catch (e) {
            //                console.log('Exception in SendSingleEmailNow():2: ' + e.message + ', ' + e.stack);
            //                displayAlertDialog('Exception in SendSingleEmailNow():2: ' + e.message + ', ' + e.stack);
            //            }
            //        },
            //        error: function (data, errorCode, errorMessage) {
            //            console.log('Error in SendSingleEmailNow():' + errorCode + ', ' + errorMessage);
            //            displayAlertDialog('Error in SendSingleEmailNow():' + errorCode + ', ' + errorMessage);
            //        }
            //    });

            //}

        } catch (e) {
            console.log('Exception in SendSingleEmailScheduled(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in SendSingleEmailScheduled(): ' + e.message + ', ' + e.stack);
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
                            html += '                   <div class="spanButton" onclick="$(\'.bwCalendar\').bwCalendar(\'displayForestPendingEmails\', \'' + 'all' + '\');" style="text-align:left;font-size:14px;white-space:nowrap;cursor:pointer;padding:20px 20px 20px 20px;" title="">';
                            html += '                       &nbsp;&nbsp;&nbsp;&nbsp;' + 'ADMIN/ALL';
                            html += '                   </div>';
                            if (!data.length || data.length == 0) {
                                html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
                                html += '  There are no forest pending emails for any orgs.';
                                html += '<span>';
                            } else {
                                for (var i = 0; i < data.length; i++) {
                                    html += '                   <div class="spanButton" onclick="$(\'.bwCalendar\').bwCalendar(\'displayForestPendingEmails\', \'' + data[i].bwWorkflowAppId + '\');" style="text-align:left;font-size:14px;white-space:nowrap;cursor:pointer;padding:20px 20px 20px 20px;" title="' + 'Owner: ' + data[i].bwTenantOwnerFriendlyName + ' (' + data[i].bwTenantOwnerEmail + ')' + '">';
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
                            html += '                   <div class="spanButton" onclick="$(\'.bwCalendar\').bwCalendar(\'displayPendingEmails\', \'' + 'all' + '\');" style="text-align:left;font-size:14px;white-space:nowrap;cursor:pointer;padding:20px 20px 20px 20px;" title="">';
                            html += '                       &nbsp;&nbsp;&nbsp;&nbsp;' + 'ADMIN/ALL';
                            html += '                   </div>';
                            if (!data.length || data.length == 0) {
                                html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
                                html += '  There are no pending emails for any orgs.';
                                html += '<span>';
                            } else {
                                for (var i = 0; i < data.length; i++) {
                                    html += '                   <div class="spanButton" onclick="$(\'.bwCalendar\').bwCalendar(\'displayPendingEmails\', \'' + data[i].bwWorkflowAppId + '\');" style="text-align:left;font-size:14px;white-space:nowrap;cursor:pointer;padding:20px 20px 20px 20px;" title="' + 'Owner: ' + data[i].bwTenantOwnerFriendlyName + ' (' + data[i].bwTenantOwnerEmail + ')' + '">';
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
                            html += '                   <div class="spanButton" onclick="$(\'.bwCalendar\').bwCalendar(\'displaySentEmails\', \'' + 'all' + '\');" style="text-align:left;font-size:14px;white-space:nowrap;cursor:pointer;padding:20px 20px 20px 20px;" title="">';
                            html += '                       &nbsp;&nbsp;&nbsp;&nbsp;' + 'ADMIN/ALL';
                            html += '                   </div>';
                            if (!data.length || data.length == 0) {
                                html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
                                html += '  There are no sent emails for any orgs.';
                                html += '<span>';
                            } else {
                                for (var i = 0; i < data.length; i++) {
                                    html += '                   <div class="spanButton" onclick="$(\'.bwCalendar\').bwCalendar(\'displaySentEmails\', \'' + data[i].bwWorkflowAppId + '\');" style="text-align:left;font-size:14px;white-space:nowrap;cursor:pointer;padding:20px 20px 20px 20px;" title="' + 'Owner: ' + data[i].bwTenantOwnerFriendlyName + ' (' + data[i].bwTenantOwnerEmail + ')' + '">';
                                    html += '                       &nbsp;&nbsp;&nbsp;&nbsp;' + data[i].bwWorkflowAppTitle;
                                    html += '                   </div>';
                                }
                            }

                            // Render the html.
                            $(thiz.element).find('#divSentEmailOrgsList')[0].innerHTML = html;

                        } catch (e) {
                            console.log('Exception in bwCalendar.js.expandOrCollapseSentEmails():1: ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in bwCalendar.js.expandOrCollapseSentEmails():1: ' + e.message + ', ' + e.stack);
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        console.log('Error in bwCalendar.js.expandOrCollapseSentEmails():' + errorCode + ', ' + errorMessage);
                        displayAlertDialog('Error in bwCalendar.js.expandOrCollapseSentEmails():' + errorCode + ', ' + errorMessage);
                    }
                });
            }
        } catch (e) {
            console.log('Exception in bwCalendar.js.expandOrCollapseSentEmails(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCalendar.js.expandOrCollapseSentEmails(): ' + e.message + ', ' + e.stack);
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
                            html += '                   <div class="spanButton" onclick="$(\'.bwCalendar\').bwCalendar(\'displayErrorsAndSuggestions\', \'' + 'all' + '\');" style="text-align:left;font-size:14px;white-space:nowrap;cursor:pointer;padding:20px 20px 20px 20px;" title="">';
                            html += '                       &nbsp;&nbsp;&nbsp;&nbsp;' + 'ADMIN/ALL';
                            html += '                   </div>';
                            if (!data.length || data.length == 0) {
                                html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
                                html += '  There are no errors or suggestions for any orgs.';
                                html += '<span>';
                            } else {
                                for (var i = 0; i < data.length; i++) {
                                    html += '                   <div class="spanButton" onclick="$(\'.bwCalendar\').bwCalendar(\'displayErrorsAndSuggestions\', \'' + data[i].bwWorkflowAppId + '\');" style="text-align:left;font-size:14px;white-space:nowrap;cursor:pointer;padding:20px 20px 20px 20px;" title="' + 'Owner: ' + data[i].bwTenantOwnerFriendlyName + ' (' + data[i].bwTenantOwnerEmail + ')' + '">';
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
                                    html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" xcx="xcx2224555-1" onclick="$(\'.bwCalendar\').bwCalendar(\'viewIndividualEmail_Inbox\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwSentEmailId + '\');" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
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
                html += '<input type="checkbox" id="checkboxToggleForestPendingEmailCheckboxes" onchange="$(\'.bwCalendar\').bwCalendar(\'toggleForestPendingEmailCheckboxes\', this);" />';
                html += '                           <span style="padding: 4px 4px 4px 4px;border:1px solid lightblue;cursor:pointer;" onclick="$(\'.bwCalendar\').bwCalendar(\'cmdDisplayDeleteForestPendingEmailsDialog\');">';
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
                                html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onclick="$(\'.bwCalendar\').bwCalendar(\'viewForestPendingEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwPendingEmailId + '\');" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
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
                            html += '                       <div class="spanButton" style="width:100px;text-align:right;" title="Click to send this email now!" onclick="$(\'.bwCalendar\').bwCalendar(\'sendForestPendingEmailNow\');">';
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
                            html += '   <div id="quillConfigureNewUserEmailsDialog_Body" xcx="xcx132166-2" style="height:375px;"></div>'; // Quill.

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
            console.log('In bwCalendar.js.displayAIConversation().');
            //alert('In bwCalendar.js.displayAIConversation().');
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
                        console.log('Exception in bwCalendar.js.displayAIConversation(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwCalendar.js.displayAIConversation(): ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in bwCalendar.js.displayAIConversation():' + errorCode + ', ' + errorMessage);
                }
            });

        } catch (e) {
            console.log('Exception in bwCalendar.js.displayAIConversation(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCalendar.js.displayAIConversation(): ' + e.message + ', ' + e.stack);
        }
    },

    displayPendingEmails: function () { // Accepts "all" as a value for bwWorkflowAppId. This is for the forest administrator.
        try {
            console.log('In displayPendingEmails().'); // bwWorkflowAppId: ' + bwWorkflowAppId);
            var thiz = this;

            //if (!bwWorkflowAppId) {
            //    alert('Error in bwCalendar.js.displayPendingEmails(). Invalid value for bwWorkflowAppId: ' + bwWorkflowAppId);
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
                html += '                           <span xcx="xcx231232-14" class="emailEditor_topbarbutton" onclick="$(\'.bwCalendar\').bwCalendar(\'cmdDisplayDeletePendingEmailsDialog\', \'' + bwWorkflowAppId + '\');">';
                html += '                               <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" xcx="664993" >&nbsp;Delete';
                html += '                           </span>';
                html += '&nbsp;&nbsp;';
                html += '                           <span xcx="xcx231232-14" class="emailEditor_topbarbutton" onclick="$(\'.bwCalendar\').bwCalendar(\'cmdDisplayDeletePendingEmailsDialog\', \'' + bwWorkflowAppId + '\', \'emptyfolder\');">';
                html += '                               <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" xcx="xcx324865" >&nbsp;Empty folder';
                html += '                           </span>';
                $(thiz.element).find('#spanSelectedEmailType_TopButtons')[0].innerHTML = html; //'Pending Email';

                // Display the radio button and the title.
                html = '';
                html += '<input type="checkbox" id="checkboxTogglePendingEmailCheckboxes" onchange="$(\'.bwCalendar\').bwCalendar(\'togglePendingEmailCheckboxes\', this);" />&nbsp;&nbsp;';
                html += '✉ Pending Inbox Items';
                $(thiz.element).find('#spanSelectedEmailType_Title')[0].innerHTML = html; //'Pending Email';

                // Make this button appear selected.
                $(thiz.element).find('#spanDisplaySentEmailButton').removeClass('bwCalendar_LeftMenuButton_Selected').addClass('bwCalendar_LeftMenuButton');
                $(thiz.element).find('#spanDisplayPendingEmailButton').removeClass('bwCalendar_LeftMenuButton').addClass('bwCalendar_LeftMenuButton_Selected');


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
                                    html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onclick="$(\'.bwCalendar\').bwCalendar(\'viewPendingEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwPendingEmailId + '\');" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
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
                                html += '                       <div class="spanButton" style="width:100px;text-align:right;" title="Click to send this email now!" onclick="$(\'.bwCalendar\').bwCalendar(\'sendPendingEmailNow\');">';
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
                                html += '   <div id="quillConfigureNewUserEmailsDialog_Body" xcx="xcx132166-3" style="height:375px;"></div>'; // Quill.

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
                                    html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onclick="$(\'.bwCalendar\').bwCalendar(\'viewPendingEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwPendingEmailId + '\');" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
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
                                html += '                       <div class="spanButton" style="width:100px;text-align:right;" title="Click to send this email now!" onclick="$(\'.bwCalendar\').bwCalendar(\'sendPendingEmailNow\');">';
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
                                html += '   <div id="quillConfigureNewUserEmailsDialog_Body" xcx="xcx132166-4" style="height:375px;"></div>'; // Quill.

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




    resize: function () {
        try {
            console.log('In bwCalendar.js.resize().');
            //alert('In bwCalendar.js.resize().');

            var divEmailPicker = document.getElementById('divEmailPicker');
            if (divEmailPicker) {

                // Setting height of the email selector.
                var intViewportHeight = window.innerHeight;

                var rect1 = divEmailPicker.getBoundingClientRect();
                var top1 = rect1.top;

                var height = intViewportHeight - top1;

                console.log('Setting divEmailPicker element height. xcx232345 intViewportHeight: ' + intViewportHeight + ', top: ' + top1);

                divEmailPicker.style.height = height + 'px';


                // Check if the scrollbar is visible/enabled.
                // If it isn't, we need to add more emails to the thing so it forces the scrollbar to display/work, as our auto-loading of the emails depends on it.

                var scrollbarIsEnabled = divEmailPicker.scrollHeight > height; // divEmailPicker.height();

                console.log('scrollbarIsEnabled: ' + scrollbarIsEnabled + ', divEmailPicker.scrollHeight: ' + divEmailPicker.scrollHeight + ', height: ' + height);
                //displayAlertDialog('scrollbarIsEnabled: ' + scrollbarIsEnabled);



            }

            var button = document.getElementById('divInnerLeftMenuButton_NewMessage');
            var height = Number(button.style.height.split('px')[0]);
            $('.bwActiveMenu').bwActiveMenu('option', 'divInnerLeftMenuButton_NewMessage_OriginalHeight', height);

        } catch (e) {
            var msg = 'Exception in bwCalendar.js.resize(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
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
                html += '                           <span xcx="xcx231232-15" class="emailEditor_topbarbutton" onclick="$(\'.bwCalendar\').bwCalendar(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\');">';
                html += '                               <img title="Delete..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx123468" />&nbsp;Delete';
                html += '                           </span>';
                html += '&nbsp;&nbsp;';
                html += '                           <span xcx="xcx231232-15" class="emailEditor_topbarbutton" onclick="$(\'.bwCalendar\').bwCalendar(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\', \'emptyfolder\');">';
                html += '                               <img title="Empty folder..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx23423467898">&nbsp;Empty folder';
                html += '                           </span>';
                $(thiz.element).find('#spanSelectedEmailType_TopButtons')[0].innerHTML = html; //'Pending Email';

                // Display the radio button and the title.
                html = '';
                //html += '<input type="checkbox" id="checkboxToggleSentEmailCheckboxes" onchange="$(\'.bwCalendar\').bwCalendar(\'toggleSentEmailCheckboxes\', this);" />&nbsp;&nbsp;';
                html += '✉ Incoming Items';






                html += '               <span id="spanSelectedEmailSubject" style="font-size:13pt;font-weight:bold;color:#95b1d3;"></span>';
                html += '               <br />';
                html += '               <span id="spanSelectedEmail"></span>';








                $(thiz.element).find('#spanSelectedEmailType_Title')[0].innerHTML = html; //'Sent Email';

                // Make this button appear selected.
                $(thiz.element).find('#spanDisplaySentEmailButton').removeClass('bwCalendar_LeftMenuButton').addClass('bwCalendar_LeftMenuButton_Selected');
                $(thiz.element).find('#spanDisplayPendingEmailButton').removeClass('bwCalendar_LeftMenuButton_Selected').addClass('bwCalendar_LeftMenuButton');

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

                                html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" xcx="xcx2224555-2" onclick="$(\'.bwCalendar\').bwCalendar(\'viewIndividualEmail_Inbox\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwSentEmailId + '\');" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';

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
                            //html += '                       <div class="spanButton" style="width:100px;text-align:right;" title="Click to send this email now!" onclick="$(\'.bwCalendar\').bwCalendar(\'sendEmailNow\');">';
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
                            html += '   <div id="quillConfigureNewUserEmailsDialog_Body" xcx="xcx132166-11" style="height:375px;"></div>'; // Quill.
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
            //                            html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" xcx="xcx2224555-3" onclick="$(\'.bwCalendar\').bwCalendar(\'viewIndividualEmail_Inbox\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwSentEmailId + '\');" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
            //                            //debugger; // xcx999999
            //                            html += '    <td style="vertical-align:top;"><input type="checkbox" class="sentEmailCheckbox" bwsentemailid="' + data[i].bwSentEmailId + '" /></td>';
            //                            //debugger;
            //                            //var timestamp = getFriendlyDateAndTime(data[i].Timestamp);
            //                            //html += '    <td style="white-space:nowrap;">' + timestamp + '</td>';
            //                            //html += '    <td>' + data[i].ToParticipantEmail + '</td>';
            //                            //html += '    <td>' + data[i].Subject + '</td>'; // html += '    <td>' + data[i].FromEmailAddress + '</td>';
            //                            //html += '    <td><input type="button" bwpendingemailid="xxpeid"' + data[i].EmailLink + '" value="View" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'viewPendingEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwPendingEmailId + '\');" /></td>';
            //                            html += '    <td id="bwCalendar_InnerLeftMenuButton_' + data[i].bwSentEmailId + '" colspan="4" style="border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px;">';
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
            //                            //html += '                       <div class="spanButton" style="width:100px;text-align:right;" title="Click to send this email now!" onclick="$(\'.bwCalendar\').bwCalendar(\'sendEmailNow\');">';
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
            //                console.log('Error in bwCalendar.js.displayIncomingEmails():xcx1: ' + errorCode + ', ' + errorMessage);
            //                //displayAlertDialog('Error in bwCalendar.js.displayIncomingEmails():xcx1: ' + errorCode + ', ' + errorMessage); // PUT THIS BACK SOMETIME 5-5-2022
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
            //                            html += '<tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" xcx="xcx2224555-4" onclick="$(\'.bwCalendar\').bwCalendar(\'viewIndividualEmail_Inbox\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwSentEmailId + '\');" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
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
            //                        //html += '                       <div class="spanButton" style="width:100px;text-align:right;" title="Click to send this email now!" onclick="$(\'.bwCalendar\').bwCalendar(\'sendEmailNow\');">';
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
            //                displayAlertDialog('Error in bwCalendar.js.displayIncomingEmails():xcx2: ' + errorCode + ', ' + errorMessage);
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

                        //$($(thiz.element).find('#quillConfigureNewUserEmailsDialog_Body')[0]).summernote({
                        //    placeholder: data[0].Body, //'Hello stand alone ui',
                        //    tabsize: 2,
                        //    height: 400,
                        //    //airMode: true,
                        //    toolbar: [
                        //        ['style', ['style']],
                        //        ['font', ['bold', 'underline', 'clear']],
                        //        ['color', ['color']],
                        //        ['para', ['ul', 'ol', 'paragraph']],
                        //        ['table', ['table']],
                        //        ['insert', ['link']], //, 'picture', 'video']],
                        //        ['view', ['codeview', 'help']]
                        //    ]
                        //});

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

                        //$($(thiz.element).find('#quillConfigureNewUserEmailsDialog_Body')[0]).summernote({
                        //    placeholder: data[0].Body, //'Hello stand alone ui',
                        //    tabsize: 2,
                        //    height: 400,
                        //    //airMode: true,
                        //    toolbar: [
                        //        ['style', ['style']],
                        //        ['font', ['bold', 'underline', 'clear']],
                        //        ['color', ['color']],
                        //        ['para', ['ul', 'ol', 'paragraph']],
                        //        ['table', ['table']],
                        //        ['insert', ['link']], //, 'picture', 'video']],
                        //        ['view', ['codeview', 'help']]
                        //    ]
                        //});

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



    deleteSelectedInboxEmails: function () {
        try {
            console.log('In deleteSelectedInboxEmails().');
            alert('In deleteSelectedInboxEmails().');
            debugger;
            var thiz = this;
            var _ids = [];
            var checkboxes = document.getElementsByClassName('inboxEmailCheckbox');
            for (var i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked == true) {
                    //debugger;
                    var _id = checkboxes[i].getAttribute('bwinboxemailid');
                    _ids.push(_id);
                } else {
                    // do nothing.
                }
            }
            var json = {
                _ids: _ids
            }
            //alert('Getting ready to delete ' + selectedinboxEmailIdsToDelete.length + ' pending emails. This action cannot be undone. This functionality is incomplete and needs further testing!!!!');
            $.ajax({
                url: this.options.operationUriPrefix + "_bw/deleteinboxemails", //deletependingemails", 
                //dataType: "json",
                contentType: "application/json",
                type: "Post",
                data: JSON.stringify(json)
            }).done(function (result) {
                try {
                    debugger;
                    console.log('In deleteSelectedInboxEmails(): Successfully updated DB.');

                    //debugger;
                    $('#divDeleteErrorsAndSuggestionsDialog').dialog('close');

                    thiz._create();

                } catch (e) {
                    console.log('Exception in deleteSelectedInboxEmails():2: ' + e.message + ', ' + e.stack);
                }
            }).fail(function (data) {
                //debugger;
                var msg;
                if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                } else {
                    msg = JSON.stringify(data) + ', json: ' + JSON.stringify(selectedPendingEmailIdsToDelete);
                }
                alert('Fail in deleteSelectedInboxEmails(): ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                console.log('Fail in deleteSelectedInboxEmails(): ' + JSON.stringify(data) + ', json: ' + JSON.stringify(selectedPendingEmailIdsToDelete));
                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                //var error = JSON.parse(data.responseText)["odata.error"];
                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            });
        } catch (e) {
            console.log('Exception in deleteSelectedInboxEmails(): ' + e.message + ', ' + e.stack);
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

    putSentFolderIntoTheTrashBin: function (bwWorkflowAppId, instruction) {
        try {
            console.log('In putSentFolderIntoTheTrashBin(). instruction: ' + instruction + ', bwWorkflowAppId: ' + bwWorkflowAppId);
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
                url: this.options.operationUriPrefix + "_bw/putsentmailboxintothetrashbin",
                contentType: "application/json",
                type: "POST",
                data: JSON.stringify(data),
                success: function (results) {
                    try {

                        if (results.status != 'SUCCESS') {

                            displayAlertDialog(results.message);

                        } else {

                            console.log('In putSentFolderIntoTheTrashBin(). The emails have been put in the TrashBin.');
                            $('#divBwEmailMonitor_DeleteSentEmailsDialog').dialog('close');

                            displayAlertDialog('The Sent mailbox was successfully moved to the TrashBin.');

                            //thiz.options.Sent.docs = [];

                            thiz.loadAndRenderEmails_Sent();

                        }

                    } catch (e) {
                        console.log('Exception in putSentFolderIntoTheTrashBin():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in putSentFolderIntoTheTrashBin():2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data) {
                    //debugger;
                    var msg;
                    //if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                    //    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                    //} else {
                    msg = data.message; //JSON.stringify(data) + ', json: ' + JSON.stringify(selectedSentEmailIdsToDelete);
                    //}
                    alert('Fail in putSentFolderIntoTheTrashBin(): ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                    console.log('Fail in putSentFolderIntoTheTrashBin(): ' + msg); // + JSON.stringify(data) + ', json: ' + JSON.stringify(selectedSentEmailIdsToDelete));
                    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                    //var error = JSON.parse(data.responseText)["odata.error"];
                    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                }
            });

        } catch (e) {
            console.log('Exception in putSentFolderIntoTheTrashBin(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in putSentFolderIntoTheTrashBin(): ' + e.message + ', ' + e.stack);
        }
    },

    //cmdDisplayDeleteSentEmailsDialog: function (bwWorkflowAppId, instruction) {
    cmdDisplayDeleteInboxEmailsDialog: function (bwWorkflowAppId, instruction) { // 6-24-2024.
        try {
            console.log('In cmdDisplayDeleteInboxEmailsDialog(). instruction: ' + instruction + ', bwWorkflowAppId: ' + bwWorkflowAppId);
            alert('In cmdDisplayDeleteInboxEmailsDialog(). instruction: ' + instruction + ', bwWorkflowAppId: ' + bwWorkflowAppId);
            var thiz = this;

            if (!bwWorkflowAppId || (bwWorkflowAppId == 'undefined')) {

                console.log('Error in cmdDisplayDeleteInboxEmailsDialog(): Invalid value for bwWorkflowAppId: ' + bwWorkflowAppId);
                displayAlertDialog('Error in cmdDisplayDeleteInboxEmailsDialog(): Invalid value for bwWorkflowAppId: ' + bwWorkflowAppId);

            } else {

                var div = document.getElementById('divBwEmailMonitor_DeleteInboxEmailsDialog');
                if (!div) { // for some reason this gets added twice to the DOM. Figure this out someday, but for now this seems to fix it and is a good safety I suppose.
                    div = document.createElement('div');
                    div.id = 'divBwEmailMonitor_DeleteInboxEmailsDialog';
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
                html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divBwEmailMonitor_DeleteInboxEmailsDialog\').dialog(\'close\');">X</span>';
                html += '           </td>';
                html += '       </tr>';
                html += '   </table>';
                html += '   <br /><br />';
                html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                html += '   <span id="spanBwEmailMonitor_DeleteInboxEmailsDialogContentText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;">';
                html += '[spanBwEmailMonitor_DeleteInboxEmailsDialogContentText]';
                html += '   </span>';
                html += '   <br /><br /><br />';
                //html += '   <div id="divBwEmailMonitor_DeleteTheSentEmails" class="divSignInButton" onclick="$(\'.bwCalendar\').bwCalendar(\'deleteSelectedSentEmails\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" >';
                html += '   <div id="divBwEmailMonitor_DeleteTheInboxEmails" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" >';
                html += '       Delete the Inbox Emails';
                html += '   </div>';
                html += '   <br /><br />';
                html += '   <div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em; font-weight: bold;" onclick="$(\'#divBwEmailMonitor_DeleteInboxEmailsDialog\').dialog(\'close\');">';
                html += '       Cancel';
                html += '   </div>';
                html += '   <br /><br />';

                div.innerHTML = html;

                $("#divBwEmailMonitor_DeleteInboxEmailsDialog").dialog({
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
                $("#divBwEmailMonitor_DeleteInboxEmailsDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

                if (instruction && instruction == 'emptyfolder') {
                    // The user has chosen to empty the entire folder.
                    var html = '';
                    html += 'You have chosen to put all Inbox emails into the TrashBin.';
                    document.getElementById('spanBwEmailMonitor_DeleteSentEmailsDialogContentText').innerHTML = html;

                    html = '';
                    html += '   <div id="divBwEmailMonitor_DeleteTheSentEmails" class="divSignInButton" onclick="$(\'.bwCalendar\').bwCalendar(\'putInboxFolderIntoTheTrashBin\', \'' + bwWorkflowAppId + '\', \'emptyfolder\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" >';
                    html += '       Delete the Inbox Emails';
                    html += '   </div>';
                    document.getElementById('divBwEmailMonitor_DeleteTheSentEmails').outerHTML = html;

                } else {

                    var emails = document.getElementsByClassName('inboxEmailCheckbox');
                    var selectedEmails = [];
                    for (var i = 0; i < emails.length; i++) {
                        if (emails[i].checked) {
                            selectedEmails.push(emails);
                        }
                    }
                    if (selectedEmails.length == 0) {

                        var html = '';
                        html += 'You have not selected any emails to delete. You have to select at least 1.';
                        document.getElementById('spanBwEmailMonitor_DeleteInboxEmailsDialogContentText').innerHTML = html;

                    } else {

                        var html = '';
                        html += 'You have chosen to delete ' + selectedEmails.length + ' Inbox emails. This action cannot be undone.';
                        document.getElementById('spanBwEmailMonitor_DeleteInboxEmailsDialogContentText').innerHTML = html;

                        html = '';
                        html += '   <div id="divBwEmailMonitor_DeleteTheInboxEmails" class="divSignInButton" onclick="$(\'.bwCalendar\').bwCalendar(\'deleteSelectedInboxEmails\', \'' + bwWorkflowAppId + '\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" >';
                        html += '       Delete the Inbox Emails';
                        html += '   </div>';
                        document.getElementById('divBwEmailMonitor_DeleteTheInboxEmails').outerHTML = html;

                    }

                }
            }
        } catch (e) {
            console.log('Exception in bwMonitoringTools.cmdDisplayDeleteInboxEmailsDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwMonitoringTools.cmdDisplayDeleteInboxEmailsDialog(): ' + e.message + ', ' + e.stack);
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
                    html += '   <div id="divBwEmailMonitor_DeleteThePendingEmails" class="divSignInButton" onclick="$(\'.bwCalendar\').bwCalendar(\'deleteSelectedPendingEmails\', \'' + bwWorkflowAppId + '\', \'emptyfolder\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" >';
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
                        html += '   <div id="divBwEmailMonitor_DeleteThePendingEmails" class="divSignInButton" onclick="$(\'.bwCalendar\').bwCalendar(\'deleteSelectedPendingEmails\', \'' + bwWorkflowAppId + '\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" >';
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
                //html += '   <div id="divBwEmailMonitor_DeleteTheSentEmails" class="divSignInButton" onclick="$(\'.bwCalendar\').bwCalendar(\'deleteSelectedSentEmails\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" >';
                html += '   <div id="divBwEmailMonitor_DeleteTheSentEmails" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" >';
                html += '       Delete the Sent Emails';
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
                    html += 'You have chosen to put all Sent emails into the TrashBin.';
                    document.getElementById('spanBwEmailMonitor_DeleteSentEmailsDialogContentText').innerHTML = html;

                    html = '';
                    html += '   <div id="divBwEmailMonitor_DeleteTheSentEmails" class="divSignInButton" onclick="$(\'.bwCalendar\').bwCalendar(\'putSentFolderIntoTheTrashBin\', \'' + bwWorkflowAppId + '\', \'emptyfolder\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" >';
                    html += '       Delete the Sent Emails';
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
                        html += '   <div id="divBwEmailMonitor_DeleteTheSentEmails" class="divSignInButton" onclick="$(\'.bwCalendar\').bwCalendar(\'deleteSelectedSentEmails\', \'' + bwWorkflowAppId + '\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" >';
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
    cmdDisplayDeleteDraftEmailsDialog: function (bwWorkflowAppId, instruction) {
        try {
            console.log('In cmdDisplayDeleteDraftEmailsDialog(). instruction: ' + instruction + ', bwWorkflowAppId: ' + bwWorkflowAppId);
            alert('In cmdDisplayDeleteDraftEmailsDialog(). instruction: ' + instruction + ', bwWorkflowAppId: ' + bwWorkflowAppId);
            var thiz = this;

            if (!bwWorkflowAppId || (bwWorkflowAppId == 'undefined')) {

                console.log('Error in cmdDisplayDeleteDraftEmailsDialog(): Invalid value for bwWorkflowAppId: ' + bwWorkflowAppId);
                displayAlertDialog('Error in cmdDisplayDeleteDraftEmailsDialog(): Invalid value for bwWorkflowAppId: ' + bwWorkflowAppId);

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
                //html += '   <div id="divBwEmailMonitor_DeleteTheSentEmails" class="divSignInButton" onclick="$(\'.bwCalendar\').bwCalendar(\'deleteSelectedSentEmails\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" >';
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
                    html += '   <div id="divBwEmailMonitor_DeleteTheSentEmails" class="divSignInButton" onclick="$(\'.bwCalendar\').bwCalendar(\'putInboxFolderIntoTheTrashBin\', \'' + bwWorkflowAppId + '\', \'emptyfolder\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" >';
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
                        html += '   <div id="divBwEmailMonitor_DeleteTheSentEmails" class="divSignInButton" onclick="$(\'.bwCalendar\').bwCalendar(\'deleteSelectedSentEmails\', \'' + bwWorkflowAppId + '\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" >';
                        html += '       Delete the Sent Emails';
                        html += '   </div>';
                        document.getElementById('divBwEmailMonitor_DeleteTheSentEmails').outerHTML = html;

                    }

                }
            }
        } catch (e) {
            console.log('Exception in bwMonitoringTools.cmdDisplayDeleteDraftEmailsDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwMonitoringTools.cmdDisplayDeleteDraftEmailsDialog(): ' + e.message + ', ' + e.stack);
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
    toggleDraftEmailCheckboxes: function (element) {
        try {
            console.log('In toggleDraftEmailCheckboxes().');
            alert('In toggleDraftEmailCheckboxes().');
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
            console.log('Exception in toggleDraftEmailCheckboxes(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in toggleDraftEmailCheckboxes(): ' + e.message + ', ' + e.stack);
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





    //// GET RID OF THESE ONES!!!!!!!!!!!
    //renderEmails_Inbox: function (bwWorkflowAppId) {
    //    try {
    //        alert('xcx23123 DO WE STILL USE THIS????');
    //        console.log('In bwCalendar.js.renderEmails_Inbox(). bwWorkflowAppId: ' + bwWorkflowAppId);
    //        alert('In bwCalendar.js.renderEmails_Inbox(). bwWorkflowAppId: ' + bwWorkflowAppId);
    //        var thiz = this;

    //        if (bwWorkflowAppId != 'all') {
    //            bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
    //        }

    //        //this.options.pagingPage_SentEmail = 0; // If we want items to display properly, these need to be reset/set back to the beginning here.

    //        //$('#spanSelectedEmailSubject').html('');

    //        //var html = '';

    //        //// Display the top buttons.
    //        //html += '                           <span xcx="xcx231232-7" class="emailEditor_topbarbutton" onclick="$(\'.bwCalendar\').bwCalendar(\'cmdDisplayDeleteInboxEmailsDialog\', \'' + bwWorkflowAppId + '\');">';
    //        //html += '                               <img title="Delete..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx123468" />&nbsp;Delete';
    //        //html += '                           </span>';
    //        //html += '&nbsp;&nbsp;';
    //        //html += '                           <span xcx="xcx231232-7" class="emailEditor_topbarbutton" onclick="$(\'.bwCalendar\').bwCalendar(\'cmdDisplayDeleteInboxEmailsDialog\', \'' + bwWorkflowAppId + '\', \'emptyfolder\');">';
    //        //html += '                               <img title="Empty folder..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx23423467898">&nbsp;Empty folder';
    //        //html += '                           </span>';
    //        //$(thiz.element).find('#spanSelectedEmailType_TopButtons')[0].innerHTML = html; //'Pending Email';

    //        //// Display the radio button and the title.
    //        //html = '';
    //        //html += '<input type="checkbox" id="checkboxToggleSentEmailCheckboxes" onchange="$(\'.bwCalendar\').bwCalendar(\'toggleSentEmailCheckboxes\', this);" />&nbsp;&nbsp;';
    //        //html += '✉ Inbox Items';

    //        //$(thiz.element).find('#spanSelectedEmailType_Title')[0].innerHTML = html; //'Sent Email';

    //        //// Make this button appear selected.
    //        //$(thiz.element).find('#spanDisplaySentEmailButton').removeClass('bwCalendar_LeftMenuButton').addClass('bwCalendar_LeftMenuButton_Selected');
    //        //$(thiz.element).find('#spanDisplayPendingEmailButton').removeClass('bwCalendar_LeftMenuButton_Selected').addClass('bwCalendar_LeftMenuButton');

    //        //// Clear these in the beginning, because it may take a few seconds to re-populate, and this gives the user some visual feedback that something is going on.
    //        ////var html = '&nbsp;&nbsp;<img style="width:100px;height:100px;vertical-align:middle;white-space:nowrap;" src="/images/ajax-loader.gif" />&nbsp;&nbsp;<span style="font-size:25pt;white-space:nowrap;">Loading...</span>';
    //        //$(thiz.element).find('#spanEmailPicker')[0].innerHTML = '';


    //        //$(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '';

    //        //console.log('xcx2313555. In bwCalendar.js.renderEmails_Inbox(). Calling GET ' + webserviceurl + '/participantemail_inbox/ this.options.OnlyDisplayEmailsForCurrentParticipant: ' + this.options.OnlyDisplayEmailsForCurrentParticipant);

    //        //var html = '';

    //        //html += '           <div id="divEmailPicker" xcx="xcx21323663-1" style="width:460px;height:600px;overflow-y: scroll;overflow-x:scroll;">'; // The width is set here for the email list... 2-9-2022 scroll can be change dto hidden...
    //        //html += '           </div>';

    //        //$(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;


    //        if (!(thiz.options.Inbox && thiz.options.Inbox.length && (thiz.options.Inbox.length > 0))) {

    //            html = '';

    //            html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
    //            html += '  There are no Inbox emails.';
    //            html += '<span>';

    //            $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;
    //            debugger;
    //            //$(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;

    //            //html += '           </div>';



    //            //if ($(thiz.element).find('#spanEmailPicker') && $(thiz.element).find('#spanEmailPicker')[0]) { // spanEmailPicker
    //            //    $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;
    //            //}
    //            if ($(thiz.element).find('#spanSelectedEmail') && $(thiz.element).find('#spanSelectedEmail')[0]) {
    //                $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = '';
    //            }
    //            debugger;
    //        } else {

    //            //
    //            // This is our email. 12-12-2023.
    //            //

    //            html += '<table id="tableEmailPicker" xcx="xcx111948475664" style="max-width:460px;">'; // width:460px;height:600px;overflow-y: scroll;overflow-x:hidden;
    //            html += '</table>';
    //            html += '           </div>';

    //            $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;

    //            var element = $(thiz.element).find('#tableEmailPicker')[0];

    //            debugger;
    //            for (var i = 0; i < thiz.options.Inbox.length; i++) {

    //                html += this.generateInboxBrowserListItem_AndRender(thiz.options.Inbox[i], element); // Generate the email listing HTML.

    //            }

    //            //html += '</table>';

    //            //html += '           </div>';

    //            // This if statement is here because the user may use a menu button to switch to a different screen before this happens... so this prevents the error being displayed.
    //            if ($(thiz.element).find('#spanEmailPicker') && $(thiz.element).find('#spanEmailPicker')[0]) {

    //                //$(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;

    //                try {

    //                    $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '<div xcx="xcx213123-1" style="font-size:25pt;color:lightgray;">SELECT A CALENDAR ITEM THAT YOU WISH TO VIEW.</div>';

    //                    var x = document.getElementById('tdbwCalendar_RightColumn');
    //                    x.style.verticalAlign = 'middle';

    //                } catch (e) { }

    //                //
    //                //
    //                // This is where we load the dataTransfer object, so that we can drag and drop emails among the email folders. 5-21-2024.
    //                //
    //                //

    //                var emailItems = document.getElementsByClassName('bwemailitems');
    //                for (var i = 0; i < emailItems.length; i++) {

    //                    emailItems[i].addEventListener('dragstart', function (e) {
    //                        try {
    //                            console.log('In bwCalendar.js.renderEmails_Inbox.dragstart().');

    //                            // Step 1: Set the opacity for all of these classes to 0.5: brushedAluminum_blue_noanimation

    //                            // Step 2: Set the opacity to 1 for these buttons. This will indicate a drop zone: Junk, Archived, TrashBin. [divInnerLeftMenuButton_Junk, divInnerLeftMenuButton_Archived, divInnerLeftMenuButton_TrashBin].

    //                            var elements1 = document.getElementsByClassName('brushedAluminum_blue_noanimation');
    //                            for (var j = 0; j < elements1.length; j++) {
    //                                elements1[j].style.opacity = '0.2';
    //                            }

    //                            var elements1 = document.getElementsByClassName('brushedAluminum_blue');
    //                            for (var j = 0; j < elements1.length; j++) {
    //                                elements1[j].style.opacity = '0.2';
    //                            }

    //                            document.getElementById('divInnerLeftMenuButton_Junk').style.opacity = 1.0;
    //                            document.getElementById('divInnerLeftMenuButton_Archived').style.opacity = 1.0;
    //                            document.getElementById('divInnerLeftMenuButton_TrashBin').style.opacity = 1.0;

    //                            // We have to set the _id in the dragstart event.
    //                            var _id = e.target.getAttribute('_id');
    //                            var result = {
    //                                MailboxOrigin: 'INBOX',
    //                                _id: _id
    //                            }
    //                            var result1 = JSON.stringify(result);
    //                            e.dataTransfer.setData('text/plain', result1);

    //                        } catch (e) {
    //                            var msg = 'Exception in In bwCalendar.js.renderEmails_Inbox.dragstart(): ' + e.message + ', ' + e.stack;
    //                            console.log(msg);
    //                            alert(msg);
    //                        }
    //                    });

    //                    emailItems[i].addEventListener('dragend', function (e) {
    //                        try {
    //                            console.log('In bwCalendar.js.renderEmails_Inbox.dragend().');

    //                            // Set the opacity for all of these classes to 1.0: [brushedAluminum_blue, brushedAluminum_blue_noanimation].

    //                            var elements1 = document.getElementsByClassName('brushedAluminum_blue_noanimation');
    //                            for (var j = 0; j < elements1.length; j++) {
    //                                elements1[j].style.opacity = '1.0';
    //                            }

    //                            var elements1 = document.getElementsByClassName('brushedAluminum_blue');
    //                            for (var j = 0; j < elements1.length; j++) {
    //                                elements1[j].style.opacity = '1.0';
    //                            }

    //                        } catch (e) {
    //                            var msg = 'Exception in In bwCalendar.js.renderEmails_Inbox.dragend(): ' + e.message + ', ' + e.stack;
    //                            console.log(msg);
    //                            alert(msg);
    //                        }
    //                    });

    //                }

    //            }

    //        }

    //        thiz.resize();

    //    } catch (e) {
    //        console.log('Exception in bwCalendar.js.renderEmails_Inbox(): ' + e.message + ', ' + e.stack);
    //        alert('Exception in bwCalendar.js.renderEmails_Inbox(): ' + e.message + ', ' + e.stack);
    //    }
    //},
    //renderEmails_Sent: function (bwWorkflowAppId) {
    //    try {
    //        alert('xcx23123 DO WE STILL USE THIS????');
    //        console.log('In renderEmails_Sent(). bwWorkflowAppId: ' + bwWorkflowAppId);
    //        //alert('In renderEmails_Sent(). bwWorkflowAppId: ' + bwWorkflowAppId);
    //        var thiz = this;

    //        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

    //        if (bwWorkflowAppId != 'all') {
    //            bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
    //        }

    //        this.options.pagingPage_SentEmail = 0; // If we want items to display properly, these need to be reset/set back to the beginning here.
    //        //this.options.pagingLimit_SentEmail = 20;

    //        $('#spanSelectedEmailSubject').html('');

    //        var html = '';

    //        // Display the top buttons.
    //        html += '                           <span xcx="xcx231232-8" class="emailEditor_topbarbutton" onclick="$(\'.bwCalendar\').bwCalendar(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\');">';
    //        html += '                               <img title="Delete..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx123468" />&nbsp;Delete';
    //        html += '                           </span>';
    //        html += '&nbsp;&nbsp;';
    //        html += '                           <span xcx="xcx231232-8" class="emailEditor_topbarbutton" onclick="$(\'.bwCalendar\').bwCalendar(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\', \'emptyfolder\');">';
    //        html += '                               <img title="Empty folder..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx23423467898">&nbsp;Empty folder';
    //        html += '                           </span>';
    //        $(thiz.element).find('#spanSelectedEmailType_TopButtons')[0].innerHTML = html; //'Pending Email';

    //        // Display the radio button and the title.
    //        html = '';
    //        html += '<input type="checkbox" id="checkboxToggleSentEmailCheckboxes" onchange="$(\'.bwCalendar\').bwCalendar(\'toggleSentEmailCheckboxes\', this);" />&nbsp;&nbsp;';
    //        html += '✉ Sent Items';

    //        $(thiz.element).find('#spanSelectedEmailType_Title')[0].innerHTML = html; //'Sent Email';

    //        // Make this button appear selected.
    //        $(thiz.element).find('#spanDisplaySentEmailButton').removeClass('bwCalendar_LeftMenuButton').addClass('bwCalendar_LeftMenuButton_Selected');
    //        $(thiz.element).find('#spanDisplayPendingEmailButton').removeClass('bwCalendar_LeftMenuButton_Selected').addClass('bwCalendar_LeftMenuButton');

    //        // Clear these in the beginning, because it may take a few seconds to re-populate, and this gives the user some visual feedback that something is going on.
    //        $(thiz.element).find('#spanEmailPicker')[0].innerHTML = '';
    //        $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '';

    //        console.log('xcx2313555. In bwCalendar.js.renderEmails_Sent(). Calling GET ' + webserviceurl + '/participantemail_inbox/ this.options.OnlyDisplayEmailsForCurrentParticipant: ' + this.options.OnlyDisplayEmailsForCurrentParticipant);


    //        var html = '';

    //        html += '           <div id="divEmailPicker" xcx="xcx21323663-2" style="width:460px;height:600px;overflow-y: scroll;overflow-x:scroll;">'; // The width is set here for the email list... 2-9-2022 scroll can be change dto hidden...
    //        debugger;
    //        if (!thiz.options.Sent.length || thiz.options.Sent.length == 0) {

    //            html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
    //            html += '  There are no sent emails.';
    //            html += '<span>';

    //            html += '           </div>';

    //            if ($(thiz.element).find('#spanEmailPicker') && $(thiz.element).find('#spanEmailPicker')[0]) {
    //                $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;
    //            }
    //            if ($(thiz.element).find('#spanSelectedEmail') && $(thiz.element).find('#spanSelectedEmail')[0]) {
    //                $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = '';
    //            }

    //        } else {

    //            //
    //            // This is our email. 12-12-2023.
    //            //

    //            html += '<table xcx="xcx111948475664" style="max-width:460px;">'; // width:460px;height:600px;overflow-y: scroll;overflow-x:hidden;

    //            for (var i = 0; i < thiz.options.Sent.length; i++) {
    //                //html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
    //                html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" _id="' + thiz.options.Sent[i]._id + '" class="bwEmailSentItemsRow" xcx="xcx2224555-3" onclick="$(\'.bwCalendar\').bwCalendar(\'viewIndividualEmail_Sent\', \'' + 'btnEditRaciRoles_' + thiz.options.Sent[i].bwParticipantId + '\', \'' + thiz.options.Sent[i].bwParticipantId + '\', \'' + thiz.options.Sent[i].bwParticipantFriendlyName + '\', \'' + thiz.options.Sent[i].bwParticipantEmail + '\', \'' + thiz.options.Sent[i]._id + '\');" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + thiz.options.Sent[i].bwParticipantId + '\', \'' + thiz.options.Sent[i].bwParticipantId + '\');">';
    //                //debugger; // xcx999999
    //                html += '    <td style="vertical-align:top;max-width:20px;"><input type="checkbox" class="sentEmailCheckbox" bwsentemailid="' + thiz.options.Sent[i].bwSentEmailId + '" /></td>';
    //                //debugger;
    //                //var timestamp = getFriendlyDateAndTime(data[i].Timestamp);
    //                //html += '    <td style="white-space:nowrap;">' + timestamp + '</td>';
    //                //html += '    <td>' + data[i].ToParticipantEmail + '</td>';
    //                //html += '    <td>' + data[i].Subject + '</td>'; // html += '    <td>' + data[i].FromEmailAddress + '</td>';
    //                //html += '    <td><input type="button" bwpendingemailid="xxpeid"' + data[i].EmailLink + '" value="View" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'viewPendingEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwPendingEmailId + '\');" /></td>';



    //                html += '    <td class="bwemailitems" _id="' + thiz.options.Sent[i]._id + '" draggable="true" id="bwCalendar_InnerLeftMenuButton_' + thiz.options.Sent[i]._id + '" style="border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px;max-width:350px;">';
    //                //debugger; // RelatedRequestId	ad19f2b8-707f-40ad-8228-a07d55a1ddac



    //                // data[i].mail_from
    //                //html += '<span style="font-weight:bold;color:black;">' + data[i].ToParticipantFriendlyName + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';
    //                //html += '<span style="font-weight:bold;color:black;">' + data[i].mail_from.original + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';

    //                //var emailAddress = '';
    //                //if (thiz.options.Sent[i].from && thiz.options.Sent[i].from[0] && thiz.options.Sent[i].from[0].address) {
    //                //    emailAddress = thiz.options.Sent[i].from[0].address;
    //                //} else {
    //                //    emailAddress = thiz.options.Sent[i].from;
    //                //}

    //                var emailAddress = thiz.options.Sent[i].ToParticipantEmail;

    //                //if (thiz.options.Sent[i].TheUserHasReadThisEmail && (thiz.options.Sent[i].TheUserHasReadThisEmail == true)) {
    //                //    html += '<span style="font-weight:normal;color:black;" class="bwEmailInboxRow_EmailAddress">' + emailAddress + '<br />';
    //                //} else {
    //                //    html += '<span style="font-weight:bold;color:black;" class="bwEmailInboxRow_EmailAddress">' + emailAddress + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';
    //                //}

    //                html += '<span style="font-weight:normal;color:black;" class="bwEmailInboxRow_EmailAddress">' + emailAddress + '<br />';

    //                //html += '<span style="font-weight:normal;color:tomato;">' + timestamp + '</span>';
    //                // 2-3-2022
    //                var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(thiz.options.Sent[i].Timestamp);
    //                html += '<span style="font-weight:normal;color:tomato;">' + timestamp4 + '</span>';



    //                html += '       <br />';
    //                //debugger;
    //                //html += 'RelatedRequestId: ' + data[i].RelatedRequestId + '</span></span>';
    //                html += '</span>';
    //                //html += '       <br />';

    //                var subject = '';
    //                if (thiz.options.Sent[i].Subject) {
    //                    subject = thiz.options.Sent[i].Subject.substring(0, 55);
    //                } else {
    //                    subject = '[no subject]';
    //                }

    //                //if (thiz.options.Sent[i].TheUserHasReadThisEmail && (thiz.options.Sent[i].TheUserHasReadThisEmail == true)) {
    //                //    html += '<span style="font-weight:lighter;color:#95b1d3;" class="bwEmailInboxRow_Subject">' + subject + ' ...</span>';
    //                //} else {
    //                //    html += '<span style="font-weight:bold;color:#95b1d3;" class="bwEmailInboxRow_Subject">' + subject + ' ...</span>';
    //                //}

    //                html += '<span style="font-weight:bold;color:#95b1d3;" class="bwEmailInboxRow_Subject">' + subject + ' ...</span>';

    //                html += '       <br />';

    //                //if (bwWorkflowAppId == 'all') { // This is for the forest administrator.
    //                html += '<span style="font-weight:normal;color:lightgray;">Organization: [' + thiz.options.Sent[i].bwWorkflowAppId + ']';

    //                // INTERNAL/EXTERNAL
    //                if (thiz.options.Sent[i].ThisEmailIsFromAnInternalSource && (thiz.options.Sent[i].ThisEmailIsFromAnInternalSource == true)) {
    //                    html += ' <span style="color:tomato;">INTERNAL</span>';
    //                } else {
    //                    html += ' <span style="color:tomato;">EXTERNAL</span>';
    //                }

    //                html += '</span>';
    //                html += '       <br />';
    //                //}

    //                //var bodyTextStartIndex = data[i].Body.indexOf('>');
    //                //var bodyTextEndIndex = data[i].Body.substring(bodyTextStartIndex).indexOf('<') + 1;
    //                //var bodyTextEndIndex2 = data[i].Body.substring(bodyTextEndIndex).indexOf('<') + 1;
    //                //var bodyText = data[i].Body.substring(bodyTextEndIndex, bodyTextEndIndex2);
    //                //html += '<span style="color:grey;">' + bodyText + ' ...</span>'; //  we have to do this because i we render the html it affect s the whole display in an unpredictable manner!!!
    //                //html += '       <br />';

    //                html += '   </td>';
    //                //displayAlertDialog('xcx231232 thiz.options.Sent[i]: ' + JSON.stringify(thiz.options.Sent[i]));


    //                html += '<td class="bwCalendar_Trashbin" style="max-width:40px;" onclick="$(\'.bwCalendar\').bwCalendar(\'deleteIndividualEmail\', \'' + thiz.options.Sent[i]._id + '\');event.stopPropagation();">';
    //                html += '<img src="/images/trashbin.png" />';
    //                html += '</td>';



    //                html += '  </tr>';
    //            }
    //            html += '</table>';

    //            html += '           </div>';

    //            // This if statement is here because the user may use a menu button to switch to a different screen before this happens... so this prevents the error being displayed.
    //            if ($(thiz.element).find('#spanEmailPicker') && $(thiz.element).find('#spanEmailPicker')[0]) {

    //                $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;





    //                try {
    //                    //$(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = html;

    //                    $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '<div xcx="xcx213123-2" style="font-size:25pt;color:lightgray;">SELECT A CALENDAR ITEM THAT YOU WISH TO VIEW.</div>';

    //                    var x = document.getElementById('tdbwCalendar_RightColumn');
    //                    x.style.verticalAlign = 'middle';

    //                } catch (e) { }








    //                //// Quill subject editor.
    //                //html = '';
    //                //html += '<div style="height:15px;">&nbsp;</div>';



    //                ////html += '                       <div class="spanButton" style="width:100px;text-align:right;" title="Click to send this email now!" onclick="$(\'.bwCalendar\').bwCalendar(\'sendEmailNow\');">';
    //                ////html += '                           ✉&nbsp;Send Now > xcx5';
    //                ////html += '                       </div>';






    //                ////html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
    //                ////html += 'From:';
    //                ////html += '</span>';
    //                //html += '<br />';
    //                //html += '   <div id="bwEmailView_From" xcx="xcx34255555-4"></div>';
    //                //html += '<br />';

    //                //html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
    //                //html += 'To:';
    //                //html += '</span>';
    //                //html += '<br />';
    //                //html += '   <div id="bwEmailView_To"></div>';
    //                //html += '<br />';


    //                //html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
    //                //html += 'Subject:';
    //                //html += '</span>';
    //                //html += '<br />';
    //                //html += '   <div id="bwQuilltoolbarForSubject">';
    //                ////html += '       <button id="btnQuill_InsertADataItemForSubject" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
    //                //html += '   </div>';
    //                ////html += '   <div id="quillConfigureNewUserEmailsDialog_Subject" style="height:50px;"></div>'; // Quill.
    //                //html += '<input type="text" id="quillConfigureNewUserEmailsDialog_Subject" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';

    //                //// Quill body editor.
    //                //html += '<br /><br />';
    //                //html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
    //                //html += 'Body:';
    //                //html += '</span>';
    //                //html == '<br />';
    //                //html += '   <div id="bwQuilltoolbar">';
    //                ////html += '       <button id="btnQuill_InsertADataItem" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';

    //                //html += '   </div>';
    //                //html += '   <div id="quillConfigureNewUserEmailsDialog_Body" xcx="xcx132166-6" style="height:375px;"></div>'; // Quill.
    //                //// Save button.
    //                ////html += '   <br />';
    //                ////html += '   <span id="spanConfigureEmailNotificationsDialogSaveButton">[spanConfigureEmailNotificationsDialogSaveButton]</span>'; // ☑
    //                ////html += '   <br /><br />';
    //                //// Preview/Edit button.
    //                ////html += '   <div id="divNewUserEmailEditor_PreviewAndEditButton" class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;"></div>';
    //                ////html += '   <br /><br />';
    //                //html += '</div>';


    //                ////$(thiz.element).find('#spanSelectedEmail')[0].innerHTML = html;
    //                //try {
    //                //    $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = html;
    //                //} catch (e) { }



    //                //
    //                //
    //                // This is where we load the dataTransfer object, so that we can drag and drop emails among the email folders. 5-21-2024.
    //                //
    //                //

    //                var emailItems = document.getElementsByClassName('bwemailitems');
    //                for (var i = 0; i < emailItems.length; i++) {

    //                    emailItems[i].addEventListener('dragstart', function (e) {
    //                        try {
    //                            console.log('In bwCalendar.js.renderEmails_Sent.dragstart().');

    //                            // Step 1: Set the opacity for all of these classes to 0.5: brushedAluminum_blue_noanimation

    //                            // Step 2: Set the opacity to 1 for these buttons. This will indicate a drop zone: Junk, Archived, TrashBin. [divInnerLeftMenuButton_Archived, divInnerLeftMenuButton_TrashBin].

    //                            var elements1 = document.getElementsByClassName('brushedAluminum_blue_noanimation');
    //                            for (var j = 0; j < elements1.length; j++) {
    //                                elements1[j].style.opacity = '0.2';
    //                            }

    //                            var elements1 = document.getElementsByClassName('brushedAluminum_blue');
    //                            for (var j = 0; j < elements1.length; j++) {
    //                                elements1[j].style.opacity = '0.2';
    //                            }

    //                            document.getElementById('divInnerLeftMenuButton_Archived').style.opacity = 1.0;
    //                            document.getElementById('divInnerLeftMenuButton_TrashBin').style.opacity = 1.0;

    //                            // We have to set the _id in the dragstart event.
    //                            var _id = e.target.getAttribute('_id');
    //                            var result = {
    //                                MailboxOrigin: 'SENT',
    //                                _id: _id
    //                            }
    //                            var result1 = JSON.stringify(result);
    //                            e.dataTransfer.setData('text/plain', result1);

    //                        } catch (e) {
    //                            var msg = 'Exception in bwCalendar.js.renderEmails_Sent.dragstart(): ' + e.message + ', ' + e.stack;
    //                            console.log(msg);
    //                            alert(msg);
    //                        }
    //                    });

    //                    emailItems[i].addEventListener('dragend', function (e) {
    //                        try {
    //                            console.log('In bwCalendar.js.renderEmails_Sent.dragend().');

    //                            // Set the opacity for all of these classes to 1.0: [brushedAluminum_blue, brushedAluminum_blue_noanimation].

    //                            var elements1 = document.getElementsByClassName('brushedAluminum_blue_noanimation');
    //                            for (var j = 0; j < elements1.length; j++) {
    //                                elements1[j].style.opacity = '1.0';
    //                            }

    //                            var elements1 = document.getElementsByClassName('brushedAluminum_blue');
    //                            for (var j = 0; j < elements1.length; j++) {
    //                                elements1[j].style.opacity = '1.0';
    //                            }

    //                        } catch (e) {
    //                            var msg = 'Exception in In bwCalendar.js.renderEmails_Sent.dragend(): ' + e.message + ', ' + e.stack;
    //                            console.log(msg);
    //                            alert(msg);
    //                        }
    //                    });

    //                }

    //            }
    //        }

    //        this.resize();

    //    } catch (e) {
    //        console.log('Exception in bwCalendar.js.renderEmails_Sent(): ' + e.message + ', ' + e.stack);
    //        alert('Exception in bwCalendar.js.renderEmails_Sent(): ' + e.message + ', ' + e.stack);
    //    }
    //},
    //renderEmails_Drafts: function (bwWorkflowAppId) {
    //    try {
    //        alert('xcx23123 DO WE STILL USE THIS????');
    //        console.log('In renderEmails_Drafts(). bwWorkflowAppId: ' + bwWorkflowAppId);
    //        //alert('In renderEmails_Drafts(). bwWorkflowAppId: ' + bwWorkflowAppId);
    //        var thiz = this;

    //        //var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

    //        if (bwWorkflowAppId != 'all') {
    //            bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
    //        }

    //        this.options.pagingPage_Drafts = 0; // If we want items to display properly, these need to be reset/set back to the beginning here.
    //        //this.options.pagingLimit_SentEmail = 20;

    //        $('#spanSelectedEmailSubject').html('');

    //        var html = '';

    //        // Display the top buttons.
    //        html += '                           <span xcx="xcx231232-9" class="emailEditor_topbarbutton" onclick="$(\'.bwCalendar\').bwCalendar(\'cmdDisplayDeleteDraftEmailsDialog\', \'' + bwWorkflowAppId + '\');">';
    //        html += '                               <img title="Delete..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx123468" />&nbsp;Delete';
    //        html += '                           </span>';
    //        html += '&nbsp;&nbsp;';
    //        html += '                           <span xcx="xcx231232-9" class="emailEditor_topbarbutton" onclick="$(\'.bwCalendar\').bwCalendar(\'cmdDisplayDeleteDraftEmailsDialog\', \'' + bwWorkflowAppId + '\', \'emptyfolder\');">';
    //        html += '                               <img title="Empty folder..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx23423467898">&nbsp;Empty folder';
    //        html += '                           </span>';
    //        $(thiz.element).find('#spanSelectedEmailType_TopButtons')[0].innerHTML = html; //'Pending Email';

    //        // Display the radio button and the title.
    //        html = '';
    //        html += '<input type="checkbox" id="checkboxToggleDraftEmailCheckboxes" onchange="$(\'.bwCalendar\').bwCalendar(\'toggleDraftEmailCheckboxes\', this);" />&nbsp;&nbsp;';
    //        html += '✉ Draft Items';

    //        $(thiz.element).find('#spanSelectedEmailType_Title')[0].innerHTML = html; //'Draft Email';

    //        // Make this button appear selected.
    //        $(thiz.element).find('#spanDisplayDraftEmailButton').removeClass('bwCalendar_LeftMenuButton').addClass('bwCalendar_LeftMenuButton_Selected');
    //        $(thiz.element).find('#spanDisplayPendingEmailButton').removeClass('bwCalendar_LeftMenuButton_Selected').addClass('bwCalendar_LeftMenuButton');

    //        // Clear these in the beginning, because it may take a few seconds to re-populate, and this gives the user some visual feedback that something is going on.
    //        $(thiz.element).find('#spanEmailPicker')[0].innerHTML = '';
    //        $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '';

    //        console.log('xcx2313555. In bwCalendar.js.renderEmails_Drafts(). Calling GET ' + webserviceurl + '/participantemail_inbox/ this.options.OnlyDisplayEmailsForCurrentParticipant: ' + this.options.OnlyDisplayEmailsForCurrentParticipant);


    //        var html = '';

    //        html += '           <div id="divEmailPicker" xcx="xcx21323663-3" style="width:460px;height:600px;overflow-y: scroll;overflow-x:scroll;">'; // The width is set here for the email list... 2-9-2022 scroll can be change dto hidden...

    //        if (!(thiz.options.Drafts && thiz.options.Drafts.length && (thiz.options.Drafts.length > 0))) {

    //            html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
    //            html += '  There are no draft emails.';
    //            html += '<span>';

    //            html += '           </div>';

    //            if ($(thiz.element).find('#spanEmailPicker') && $(thiz.element).find('#spanEmailPicker')[0]) {
    //                $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;
    //            }
    //            if ($(thiz.element).find('#spanSelectedEmail') && $(thiz.element).find('#spanSelectedEmail')[0]) {
    //                $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = '';
    //            }

    //        } else {

    //            //
    //            // This is our email. 12-12-2023.
    //            //

    //            html += '<table xcx="xcx111948475664" style="max-width:460px;">'; // width:460px;height:600px;overflow-y: scroll;overflow-x:hidden;
    //            debugger;
    //            for (var i = 0; i < thiz.options.Drafts.length; i++) {
    //                //html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
    //                html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" _id="' + thiz.options.Drafts[i]._id + '" class="bwEmailDraftItemsRow" xcx="xcx2224555-3" onclick="$(\'.bwCalendar\').bwCalendar(\'viewIndividualEmail_Drafts\', \'' + 'btnEditRaciRoles_' + thiz.options.Drafts[i].bwParticipantId + '\', \'' + thiz.options.Drafts[i].bwParticipantId + '\', \'' + thiz.options.Drafts[i].bwParticipantFriendlyName + '\', \'' + thiz.options.Drafts[i].bwParticipantEmail + '\', \'' + thiz.options.Drafts[i]._id + '\');" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + thiz.options.Drafts[i].bwParticipantId + '\', \'' + thiz.options.Drafts[i].bwParticipantId + '\');">';
    //                //debugger; // xcx999999
    //                html += '    <td style="vertical-align:top;max-width:20px;"><input type="checkbox" class="draftEmailCheckbox" bwdraftemailid="' + thiz.options.Drafts[i].bwDraftEmailId + '" /></td>';
    //                //debugger;
    //                //var timestamp = getFriendlyDateAndTime(data[i].Timestamp);
    //                //html += '    <td style="white-space:nowrap;">' + timestamp + '</td>';
    //                //html += '    <td>' + data[i].ToParticipantEmail + '</td>';
    //                //html += '    <td>' + data[i].Subject + '</td>'; // html += '    <td>' + data[i].FromEmailAddress + '</td>';
    //                //html += '    <td><input type="button" bwpendingemailid="xxpeid"' + data[i].EmailLink + '" value="View" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'viewPendingEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwPendingEmailId + '\');" /></td>';



    //                html += '    <td class="bwemailitems" _id="' + thiz.options.Drafts[i]._id + '" draggable="true" id="bwCalendar_InnerLeftMenuButton_' + thiz.options.Drafts[i]._id + '" style="border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px;max-width:350px;">';
    //                //debugger; // RelatedRequestId	ad19f2b8-707f-40ad-8228-a07d55a1ddac



    //                // data[i].mail_from
    //                //html += '<span style="font-weight:bold;color:black;">' + data[i].ToParticipantFriendlyName + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';
    //                //html += '<span style="font-weight:bold;color:black;">' + data[i].mail_from.original + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';

    //                var emailAddress = '';
    //                if (thiz.options.Drafts[i].from && thiz.options.Drafts[i].from[0] && thiz.options.Drafts[i].from[0].address) {
    //                    emailAddress = thiz.options.Drafts[i].from[0].address;
    //                } else {
    //                    emailAddress = thiz.options.Drafts[i].from;
    //                }

    //                if (thiz.options.Drafts[i].TheUserHasReadThisEmail && (thiz.options.Drafts[i].TheUserHasReadThisEmail == true)) {
    //                    html += '<span style="font-weight:normal;color:black;" class="bwEmailInboxRow_EmailAddress">' + emailAddress + '<br />';
    //                } else {
    //                    html += '<span style="font-weight:bold;color:black;" class="bwEmailInboxRow_EmailAddress">' + emailAddress + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';
    //                }

    //                //html += '<span style="font-weight:normal;color:tomato;">' + timestamp + '</span>';
    //                // 2-3-2022
    //                var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(thiz.options.Drafts[i].Created);
    //                html += '<span style="font-weight:normal;color:tomato;">' + timestamp4 + '</span>';



    //                html += '       <br />';
    //                //debugger;
    //                //html += 'RelatedRequestId: ' + data[i].RelatedRequestId + '</span></span>';
    //                html += '</span>';
    //                //html += '       <br />';

    //                var subject = '';
    //                if (thiz.options.Drafts[i].Subject) {
    //                    subject = thiz.options.Drafts[i].Subject.substring(0, 55);
    //                } else {
    //                    subject = '[no subject]';
    //                }

    //                if (thiz.options.Drafts[i].TheUserHasReadThisEmail && (thiz.options.Drafts[i].TheUserHasReadThisEmail == true)) {
    //                    html += '<span style="font-weight:lighter;color:#95b1d3;" class="bwEmailInboxRow_Subject">' + subject + ' ...</span>';
    //                } else {
    //                    html += '<span style="font-weight:bold;color:#95b1d3;" class="bwEmailInboxRow_Subject">' + subject + ' ...</span>';
    //                }

    //                html += '       <br />';

    //                //if (bwWorkflowAppId == 'all') { // This is for the forest administrator.
    //                html += '<span style="font-weight:normal;color:lightgray;">Organization: [' + thiz.options.Drafts[i].bwWorkflowAppId + ']';

    //                // INTERNAL/EXTERNAL
    //                if (thiz.options.Drafts[i].ThisEmailIsFromAnInternalSource && (thiz.options.Drafts[i].ThisEmailIsFromAnInternalSource == true)) {
    //                    html += ' <span style="color:tomato;">INTERNAL</span>';
    //                } else {
    //                    html += ' <span style="color:tomato;">EXTERNAL</span>';
    //                }

    //                html += '</span>';
    //                html += '       <br />';
    //                //}

    //                //var bodyTextStartIndex = data[i].Body.indexOf('>');
    //                //var bodyTextEndIndex = data[i].Body.substring(bodyTextStartIndex).indexOf('<') + 1;
    //                //var bodyTextEndIndex2 = data[i].Body.substring(bodyTextEndIndex).indexOf('<') + 1;
    //                //var bodyText = data[i].Body.substring(bodyTextEndIndex, bodyTextEndIndex2);
    //                //html += '<span style="color:grey;">' + bodyText + ' ...</span>'; //  we have to do this because i we render the html it affect s the whole display in an unpredictable manner!!!
    //                //html += '       <br />';

    //                html += '   </td>';
    //                //displayAlertDialog('xcx231232 thiz.options.Sent[i]: ' + JSON.stringify(thiz.options.Sent[i]));


    //                html += '<td class="bwCalendar_Trashbin" style="max-width:40px;" onclick="$(\'.bwCalendar\').bwCalendar(\'deleteIndividualEmail_Drafts\', \'' + thiz.options.Drafts[i]._id + '\');event.stopPropagation();">';
    //                html += '<img src="/images/trashbin.png" />';
    //                html += '</td>';



    //                html += '  </tr>';
    //            }
    //            html += '</table>';

    //            html += '           </div>';

    //            // This if statement is here because the user may use a menu button to switch to a different screen before this happens... so this prevents the error being displayed.
    //            if ($(thiz.element).find('#spanEmailPicker') && $(thiz.element).find('#spanEmailPicker')[0]) {

    //                $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;

    //                //// Quill subject editor.
    //                //html = '';
    //                //html += '<div style="height:15px;">&nbsp;</div>';



    //                ////html += '                       <div class="spanButton" style="width:100px;text-align:right;" title="Click to send this email now!" onclick="$(\'.bwCalendar\').bwCalendar(\'sendEmailNow\');">';
    //                ////html += '                           ✉&nbsp;Send Now > xcx5';
    //                ////html += '                       </div>';






    //                ////html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
    //                ////html += 'From:';
    //                ////html += '</span>';
    //                //html += '<br />';
    //                //html += '   <div id="bwEmailView_From"></div>';
    //                //html += '<br />';

    //                //html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
    //                //html += 'To:';
    //                //html += '</span>';
    //                //html += '<br />';
    //                //html += '   <div id="bwEmailView_To"></div>';
    //                //html += '<br />';


    //                //html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
    //                //html += 'Subject:';
    //                //html += '</span>';
    //                //html += '<br />';
    //                //html += '   <div id="bwQuilltoolbarForSubject">';
    //                ////html += '       <button id="btnQuill_InsertADataItemForSubject" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
    //                //html += '   </div>';
    //                ////html += '   <div id="quillConfigureNewUserEmailsDialog_Subject" style="height:50px;"></div>'; // Quill.
    //                //html += '<input type="text" id="quillConfigureNewUserEmailsDialog_Subject" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';

    //                //// Quill body editor.
    //                //html += '<br /><br />';
    //                //html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
    //                //html += 'Body:';
    //                //html += '</span>';
    //                //html == '<br />';
    //                //html += '   <div id="bwQuilltoolbar">';
    //                ////html += '       <button id="btnQuill_InsertADataItem" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';

    //                //html += '   </div>';
    //                //html += '   <div id="quillConfigureNewUserEmailsDialog_Body" style="height:375px;"></div>'; // Quill.
    //                //// Save button.
    //                ////html += '   <br />';
    //                ////html += '   <span id="spanConfigureEmailNotificationsDialogSaveButton">[spanConfigureEmailNotificationsDialogSaveButton]</span>'; // ☑
    //                ////html += '   <br /><br />';
    //                //// Preview/Edit button.
    //                ////html += '   <div id="divNewUserEmailEditor_PreviewAndEditButton" class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;"></div>';
    //                ////html += '   <br /><br />';
    //                //html += '</div>';


    //                ////$(thiz.element).find('#spanSelectedEmail')[0].innerHTML = html;
    //                //try {
    //                //    $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = html;
    //                //} catch (e) { }


    //                ////thiz.viewIndividualEmail_Inbox('btnEditRaciRoles_undefined', 'undefined', 'undefined', 'undefined', data[0].bwSentEmailId);




    //                try {
    //                    //$(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = html;

    //                    $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '<div xcx="xcx213123-3" style="font-size:25pt;color:lightgray;">SELECT A CALENDAR ITEM THAT YOU WISH TO VIEW.</div>';

    //                    var x = document.getElementById('tdbwCalendar_RightColumn');
    //                    x.style.verticalAlign = 'middle';

    //                } catch (e) { }

    //                //
    //                //
    //                // This is where we load the dataTransfer object, so that we can drag and drop emails among the email folders. 5-21-2024.
    //                //
    //                //

    //                var emailItems = document.getElementsByClassName('bwemailitems');
    //                for (var i = 0; i < emailItems.length; i++) {

    //                    emailItems[i].addEventListener('dragstart', function (e) {
    //                        try {
    //                            console.log('In bwCalendar.js.renderEmails_Drafts.dragstart().');

    //                            // Step 1: Set the opacity for all of these classes to 0.5: brushedAluminum_blue_noanimation

    //                            // Step 2: Set the opacity to 1 for these buttons. This will indicate a drop zone: Junk, Archived, TrashBin. [divInnerLeftMenuButton_TrashBin].

    //                            var elements1 = document.getElementsByClassName('brushedAluminum_blue_noanimation');
    //                            for (var j = 0; j < elements1.length; j++) {
    //                                elements1[j].style.opacity = '0.2';
    //                            }

    //                            var elements1 = document.getElementsByClassName('brushedAluminum_blue');
    //                            for (var j = 0; j < elements1.length; j++) {
    //                                elements1[j].style.opacity = '0.2';
    //                            }

    //                            document.getElementById('divInnerLeftMenuButton_TrashBin').style.opacity = 1.0;

    //                            // We have to set the _id in the dragstart event.
    //                            var _id = e.target.getAttribute('_id');
    //                            var result = {
    //                                MailboxOrigin: 'DRAFTS',
    //                                _id: _id
    //                            }
    //                            var result1 = JSON.stringify(result);
    //                            e.dataTransfer.setData('text/plain', result1);

    //                        } catch (e) {
    //                            var msg = 'Exception in In bwCalendar.js.renderEmails_Drafts.dragstart(): ' + e.message + ', ' + e.stack;
    //                            console.log(msg);
    //                            alert(msg);
    //                        }
    //                    });

    //                    emailItems[i].addEventListener('dragend', function (e) {
    //                        try {
    //                            console.log('In bwCalendar.js.renderEmails_Drafts.dragend().');

    //                            // Set the opacity for all of these classes to 1.0: [brushedAluminum_blue, brushedAluminum_blue_noanimation].

    //                            var elements1 = document.getElementsByClassName('brushedAluminum_blue_noanimation');
    //                            for (var j = 0; j < elements1.length; j++) {
    //                                elements1[j].style.opacity = '1.0';
    //                            }

    //                            var elements1 = document.getElementsByClassName('brushedAluminum_blue');
    //                            for (var j = 0; j < elements1.length; j++) {
    //                                elements1[j].style.opacity = '1.0';
    //                            }

    //                        } catch (e) {
    //                            var msg = 'Exception in In bwCalendar.js.renderEmails_Drafts.dragend(): ' + e.message + ', ' + e.stack;
    //                            console.log(msg);
    //                            alert(msg);
    //                        }
    //                    });

    //                }

    //            }
    //        }

    //        thiz.resize();

    //    } catch (e) {
    //        console.log('Exception in bwCalendar.js.renderEmails_Drafts(): ' + e.message + ', ' + e.stack);
    //        displayAlertDialog('Exception in bwCalendar.js.renderEmails_Drafts(): ' + e.message + ', ' + e.stack);
    //    }
    //},
    //renderEmails_Junk: function (bwWorkflowAppId) {
    //    try {
    //        alert('xcx23123 DO WE STILL USE THIS????');
    //        console.log('In renderEmails_Junk(). bwWorkflowAppId: ' + bwWorkflowAppId);
    //        var thiz = this;

    //        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

    //        if (bwWorkflowAppId != 'all') {
    //            bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
    //        }

    //        this.options.pagingPage_SentEmail = 0; // If we want items to display properly, these need to be reset/set back to the beginning here.
    //        //this.options.pagingLimit_SentEmail = 20;

    //        $('#spanSelectedEmailSubject').html('');

    //        var html = '';

    //        // Display the top buttons.
    //        html += '                           <span xcx="xcx231232-10" class="emailEditor_topbarbutton" onclick="$(\'.bwCalendar\').bwCalendar(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\');">';
    //        html += '                               <img title="Delete..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx123468" />&nbsp;Delete';
    //        html += '                           </span>';
    //        html += '&nbsp;&nbsp;';
    //        html += '                           <span xcx="xcx231232-10" class="emailEditor_topbarbutton" onclick="$(\'.bwCalendar\').bwCalendar(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\', \'emptyfolder\');">';
    //        html += '                               <img title="Empty folder..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx23423467898">&nbsp;Empty folder';
    //        html += '                           </span>';
    //        $(thiz.element).find('#spanSelectedEmailType_TopButtons')[0].innerHTML = html; //'Pending Email';

    //        // Display the radio button and the title.
    //        html = '';
    //        html += '<input type="checkbox" id="checkboxToggleSentEmailCheckboxes" onchange="$(\'.bwCalendar\').bwCalendar(\'toggleSentEmailCheckboxes\', this);" />&nbsp;&nbsp;';
    //        html += '✉ Sent Items';

    //        $(thiz.element).find('#spanSelectedEmailType_Title')[0].innerHTML = html; //'Sent Email';

    //        // Make this button appear selected.
    //        $(thiz.element).find('#spanDisplaySentEmailButton').removeClass('bwCalendar_LeftMenuButton').addClass('bwCalendar_LeftMenuButton_Selected');
    //        $(thiz.element).find('#spanDisplayPendingEmailButton').removeClass('bwCalendar_LeftMenuButton_Selected').addClass('bwCalendar_LeftMenuButton');

    //        // Clear these in the beginning, because it may take a few seconds to re-populate, and this gives the user some visual feedback that something is going on.
    //        $(thiz.element).find('#spanEmailPicker')[0].innerHTML = '';
    //        $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '';

    //        console.log('xcx2313555. In bwCalendar.js.renderEmails_Junk(). Calling GET ' + webserviceurl + '/participantemail_inbox/ this.options.OnlyDisplayEmailsForCurrentParticipant: ' + this.options.OnlyDisplayEmailsForCurrentParticipant);


    //        var html = '';

    //        html += '           <div xcx="xcx21323663-4" style="width:460px;height:600px;overflow-y: scroll;overflow-x:scroll;">'; // The width is set here for the email list... 2-9-2022 scroll can be change dto hidden...

    //        if (!thiz.options.Junk.length || thiz.options.Junk.length == 0) {

    //            html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
    //            html += '  There are no Junk emails.';
    //            html += '<span>';

    //            html += '           </div>';

    //            if ($(thiz.element).find('#spanEmailPicker') && $(thiz.element).find('#spanEmailPicker')[0]) {
    //                $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;
    //            }
    //            if ($(thiz.element).find('#spanSelectedEmail') && $(thiz.element).find('#spanSelectedEmail')[0]) {
    //                $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = '';
    //            }

    //        } else {

    //            //
    //            // This is our email. 12-12-2023.
    //            //

    //            html += '<table xcx="xcx111948475664" style="max-width:460px;">'; // width:460px;height:600px;overflow-y: scroll;overflow-x:hidden;

    //            for (var i = 0; i < thiz.options.Junk.length; i++) {
    //                //html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
    //                html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" _id="' + thiz.options.Junk[i]._id + '" class="bwEmailJunkItemsRow" xcx="xcx2224555-3" onclick="$(\'.bwCalendar\').bwCalendar(\'viewIndividualEmail_Inbox\', \'' + 'btnEditRaciRoles_' + thiz.options.Junk[i].bwParticipantId + '\', \'' + thiz.options.Junk[i].bwParticipantId + '\', \'' + thiz.options.Junk[i].bwParticipantFriendlyName + '\', \'' + thiz.options.Junk[i].bwParticipantEmail + '\', \'' + thiz.options.Junk[i]._id + '\');" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + thiz.options.Junk[i].bwParticipantId + '\', \'' + thiz.options.Junk[i].bwParticipantId + '\');">';
    //                //debugger; // xcx999999
    //                html += '    <td style="vertical-align:top;max-width:20px;"><input type="checkbox" class="sentEmailCheckbox" bwsentemailid="' + thiz.options.Junk[i].bwSentEmailId + '" /></td>';
    //                //debugger;
    //                //var timestamp = getFriendlyDateAndTime(data[i].Timestamp);
    //                //html += '    <td style="white-space:nowrap;">' + timestamp + '</td>';
    //                //html += '    <td>' + data[i].ToParticipantEmail + '</td>';
    //                //html += '    <td>' + data[i].Subject + '</td>'; // html += '    <td>' + data[i].FromEmailAddress + '</td>';
    //                //html += '    <td><input type="button" bwpendingemailid="xxpeid"' + data[i].EmailLink + '" value="View" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'viewPendingEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwPendingEmailId + '\');" /></td>';



    //                html += '    <td class="bwemailitems" _id="' + thiz.options.Junk[i]._id + '" draggable="true" id="bwCalendar_InnerLeftMenuButton_' + thiz.options.Junk[i]._id + '" style="border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px;max-width:350px;">';
    //                //debugger; // RelatedRequestId	ad19f2b8-707f-40ad-8228-a07d55a1ddac



    //                // data[i].mail_from
    //                //html += '<span style="font-weight:bold;color:black;">' + data[i].ToParticipantFriendlyName + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';
    //                //html += '<span style="font-weight:bold;color:black;">' + data[i].mail_from.original + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';

    //                var emailAddress = '';
    //                if (thiz.options.Junk[i].from && thiz.options.Junk[i].from[0] && thiz.options.Junk[i].from[0].address) {
    //                    emailAddress = thiz.options.Junk[i].from[0].address;
    //                } else {
    //                    emailAddress = thiz.options.Junk[i].from;
    //                }

    //                if (thiz.options.Junk[i].TheUserHasReadThisEmail && (thiz.options.Junk[i].TheUserHasReadThisEmail == true)) {
    //                    html += '<span style="font-weight:normal;color:black;" class="bwEmailInboxRow_EmailAddress">' + emailAddress + '<br />';
    //                } else {
    //                    html += '<span style="font-weight:bold;color:black;" class="bwEmailInboxRow_EmailAddress">' + emailAddress + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';
    //                }

    //                //html += '<span style="font-weight:normal;color:tomato;">' + timestamp + '</span>';
    //                // 2-3-2022
    //                var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(thiz.options.Junk[i].timestamp);
    //                html += '<span style="font-weight:normal;color:tomato;">' + timestamp4 + '</span>';



    //                html += '       <br />';
    //                //debugger;
    //                //html += 'RelatedRequestId: ' + data[i].RelatedRequestId + '</span></span>';
    //                html += '</span>';
    //                //html += '       <br />';

    //                var subject = '';
    //                if (thiz.options.Junk[i].subject) {
    //                    subject = thiz.options.Junk[i].subject.substring(0, 55);
    //                } else {
    //                    subject = '[no subject]';
    //                }

    //                if (thiz.options.Junk[i].TheUserHasReadThisEmail && (thiz.options.Junk[i].TheUserHasReadThisEmail == true)) {
    //                    html += '<span style="font-weight:lighter;color:#95b1d3;" class="bwEmailInboxRow_Subject">' + subject + ' ...</span>';
    //                } else {
    //                    html += '<span style="font-weight:bold;color:#95b1d3;" class="bwEmailInboxRow_Subject">' + subject + ' ...</span>';
    //                }

    //                html += '       <br />';

    //                //if (bwWorkflowAppId == 'all') { // This is for the forest administrator.
    //                html += '<span style="font-weight:normal;color:lightgray;">Organization: [' + thiz.options.Junk[i].bwWorkflowAppId + ']';

    //                // INTERNAL/EXTERNAL
    //                if (thiz.options.Junk[i].ThisEmailIsFromAnInternalSource && (thiz.options.Junk[i].ThisEmailIsFromAnInternalSource == true)) {
    //                    html += ' <span style="color:tomato;">INTERNAL</span>';
    //                } else {
    //                    html += ' <span style="color:tomato;">EXTERNAL</span>';
    //                }

    //                html += '</span>';
    //                html += '       <br />';
    //                //}

    //                //var bodyTextStartIndex = data[i].Body.indexOf('>');
    //                //var bodyTextEndIndex = data[i].Body.substring(bodyTextStartIndex).indexOf('<') + 1;
    //                //var bodyTextEndIndex2 = data[i].Body.substring(bodyTextEndIndex).indexOf('<') + 1;
    //                //var bodyText = data[i].Body.substring(bodyTextEndIndex, bodyTextEndIndex2);
    //                //html += '<span style="color:grey;">' + bodyText + ' ...</span>'; //  we have to do this because i we render the html it affect s the whole display in an unpredictable manner!!!
    //                //html += '       <br />';

    //                html += '   </td>';
    //                //displayAlertDialog('xcx231232 thiz.options.Junk[i]: ' + JSON.stringify(thiz.options.Junk[i]));


    //                html += '<td class="bwCalendar_Trashbin" style="max-width:40px;" onclick="$(\'.bwCalendar\').bwCalendar(\'deleteIndividualEmail\', \'' + thiz.options.Junk[i]._id + '\');event.stopPropagation();">';
    //                html += '<img src="/images/trashbin.png" />';
    //                html += '</td>';



    //                html += '  </tr>';
    //            }
    //            html += '</table>';

    //            html += '           </div>';

    //            // This if statement is here because the user may use a menu button to switch to a different screen before this happens... so this prevents the error being displayed.
    //            if ($(thiz.element).find('#spanEmailPicker') && $(thiz.element).find('#spanEmailPicker')[0]) {

    //                $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;

    //                // Quill subject editor.
    //                html = '';
    //                html += '<div style="height:15px;">&nbsp;</div>';



    //                //html += '                       <div class="spanButton" style="width:100px;text-align:right;" title="Click to send this email now!" onclick="$(\'.bwCalendar\').bwCalendar(\'sendEmailNow\');">';
    //                //html += '                           ✉&nbsp;Send Now > xcx5';
    //                //html += '                       </div>';






    //                //html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
    //                //html += 'From:';
    //                //html += '</span>';
    //                html += '<br />';
    //                html += '   <div id="bwEmailView_From" xcx="xcx34255555-5"></div>';
    //                html += '<br />';

    //                html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
    //                html += 'To:';
    //                html += '</span>';
    //                html += '<br />';
    //                html += '   <div id="bwEmailView_To"></div>';
    //                html += '<br />';


    //                html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
    //                html += 'Subject:';
    //                html += '</span>';
    //                html += '<br />';
    //                html += '   <div id="bwQuilltoolbarForSubject">';
    //                //html += '       <button id="btnQuill_InsertADataItemForSubject" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
    //                html += '   </div>';
    //                //html += '   <div id="quillConfigureNewUserEmailsDialog_Subject" style="height:50px;"></div>'; // Quill.
    //                html += '<input type="text" id="quillConfigureNewUserEmailsDialog_Subject" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';

    //                // Quill body editor.
    //                html += '<br /><br />';
    //                html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
    //                html += 'Body:';
    //                html += '</span>';
    //                html == '<br />';
    //                html += '   <div id="bwQuilltoolbar">';
    //                //html += '       <button id="btnQuill_InsertADataItem" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';

    //                html += '   </div>';
    //                html += '   <div id="quillConfigureNewUserEmailsDialog_Body" xcx="xcx132166-8" style="height:375px;"></div>'; // Quill.
    //                // Save button.
    //                //html += '   <br />';
    //                //html += '   <span id="spanConfigureEmailNotificationsDialogSaveButton">[spanConfigureEmailNotificationsDialogSaveButton]</span>'; // ☑
    //                //html += '   <br /><br />';
    //                // Preview/Edit button.
    //                //html += '   <div id="divNewUserEmailEditor_PreviewAndEditButton" class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;"></div>';
    //                //html += '   <br /><br />';
    //                html += '</div>';


    //                //$(thiz.element).find('#spanSelectedEmail')[0].innerHTML = html;
    //                try {
    //                    $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = html;
    //                } catch (e) { }



    //                //
    //                //
    //                // This is where we load the dataTransfer object, so that we can drag and drop emails among the email folders. 5-21-2024.
    //                //
    //                //

    //                var emailItems = document.getElementsByClassName('bwemailitems');
    //                for (var i = 0; i < emailItems.length; i++) {

    //                    emailItems[i].addEventListener('dragstart', function (e) {
    //                        try {
    //                            console.log('In bwCalendar.js.renderEmails_Junk.dragstart().');

    //                            // Step 1: Set the opacity for all of these classes to 0.5: brushedAluminum_blue_noanimation

    //                            // Step 2: Set the opacity to 1 for these buttons. This will indicate a drop zone: Junk, Archived, TrashBin. [divInnerLeftMenuButton_Inbox, divInnerLeftMenuButton_Archived, divInnerLeftMenuButton_TrashBin].

    //                            var elements1 = document.getElementsByClassName('brushedAluminum_blue_noanimation');
    //                            for (var j = 0; j < elements1.length; j++) {
    //                                elements1[j].style.opacity = '0.2';
    //                            }

    //                            var elements1 = document.getElementsByClassName('brushedAluminum_blue');
    //                            for (var j = 0; j < elements1.length; j++) {
    //                                elements1[j].style.opacity = '0.2';
    //                            }

    //                            document.getElementById('divInnerLeftMenuButton_Inbox').style.opacity = 1.0;
    //                            document.getElementById('divInnerLeftMenuButton_Archived').style.opacity = 1.0;
    //                            document.getElementById('divInnerLeftMenuButton_TrashBin').style.opacity = 1.0;

    //                            // We have to set the _id in the dragstart event.
    //                            var _id = e.target.getAttribute('_id');
    //                            var result = {
    //                                MailboxOrigin: 'SENT',
    //                                _id: _id
    //                            }
    //                            var result1 = JSON.stringify(result);
    //                            e.dataTransfer.setData('text/plain', result1);

    //                        } catch (e) {
    //                            var msg = 'Exception in bwCalendar.js.renderEmails_Junk.dragstart(): ' + e.message + ', ' + e.stack;
    //                            console.log(msg);
    //                            alert(msg);
    //                        }
    //                    });

    //                    emailItems[i].addEventListener('dragend', function (e) {
    //                        try {
    //                            console.log('In bwCalendar.js.renderEmails_Junk.dragend().');

    //                            // Set the opacity for all of these classes to 1.0: [brushedAluminum_blue, brushedAluminum_blue_noanimation].

    //                            var elements1 = document.getElementsByClassName('brushedAluminum_blue_noanimation');
    //                            for (var j = 0; j < elements1.length; j++) {
    //                                elements1[j].style.opacity = '1.0';
    //                            }

    //                            var elements1 = document.getElementsByClassName('brushedAluminum_blue');
    //                            for (var j = 0; j < elements1.length; j++) {
    //                                elements1[j].style.opacity = '1.0';
    //                            }

    //                        } catch (e) {
    //                            var msg = 'Exception in In bwCalendar.js.renderEmails_Junk.dragend(): ' + e.message + ', ' + e.stack;
    //                            console.log(msg);
    //                            alert(msg);
    //                        }
    //                    });

    //                }



    //            }
    //        }

    //    } catch (e) {
    //        console.log('Exception in bwCalendar.js.renderEmails_Junk(): ' + e.message + ', ' + e.stack);
    //        alert('Exception in bwCalendar.js.renderEmails_Junk(): ' + e.message + ', ' + e.stack);
    //    }
    //},
    //renderEmails_Archived: function (bwWorkflowAppId) {
    //    try {
    //        alert('xcx23123 DO WE STILL USE THIS????');
    //        console.log('In renderEmails_Archived(). bwWorkflowAppId: ' + bwWorkflowAppId);
    //        var thiz = this;

    //        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

    //        if (bwWorkflowAppId != 'all') {
    //            bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
    //        }

    //        this.options.pagingPage_SentEmail = 0; // If we want items to display properly, these need to be reset/set back to the beginning here.
    //        //this.options.pagingLimit_SentEmail = 20;

    //        $('#spanSelectedEmailSubject').html('');

    //        var html = '';

    //        // Display the top buttons.
    //        html += '                           <span xcx="xcx231232-11" class="emailEditor_topbarbutton" onclick="$(\'.bwCalendar\').bwCalendar(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\');">';
    //        html += '                               <img title="Delete..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx123468" />&nbsp;Delete';
    //        html += '                           </span>';
    //        html += '&nbsp;&nbsp;';
    //        html += '                           <span xcx="xcx231232-11" class="emailEditor_topbarbutton" onclick="$(\'.bwCalendar\').bwCalendar(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\', \'emptyfolder\');">';
    //        html += '                               <img title="Empty folder..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx23423467898">&nbsp;Empty folder';
    //        html += '                           </span>';
    //        $(thiz.element).find('#spanSelectedEmailType_TopButtons')[0].innerHTML = html; //'Pending Email';

    //        // Display the radio button and the title.
    //        html = '';
    //        html += '<input type="checkbox" id="checkboxToggleSentEmailCheckboxes" onchange="$(\'.bwCalendar\').bwCalendar(\'toggleSentEmailCheckboxes\', this);" />&nbsp;&nbsp;';
    //        html += '✉ Sent Items';

    //        $(thiz.element).find('#spanSelectedEmailType_Title')[0].innerHTML = html; //'Sent Email';

    //        // Make this button appear selected.
    //        $(thiz.element).find('#spanDisplaySentEmailButton').removeClass('bwCalendar_LeftMenuButton').addClass('bwCalendar_LeftMenuButton_Selected');
    //        $(thiz.element).find('#spanDisplayPendingEmailButton').removeClass('bwCalendar_LeftMenuButton_Selected').addClass('bwCalendar_LeftMenuButton');

    //        // Clear these in the beginning, because it may take a few seconds to re-populate, and this gives the user some visual feedback that something is going on.
    //        $(thiz.element).find('#spanEmailPicker')[0].innerHTML = '';
    //        $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '';

    //        console.log('xcx2313555. In bwCalendar.js.renderEmails_Archived(). Calling GET ' + webserviceurl + '/participantemail_inbox/ this.options.OnlyDisplayEmailsForCurrentParticipant: ' + this.options.OnlyDisplayEmailsForCurrentParticipant);


    //        var html = '';

    //        html += '           <div xcx="xcx21323663-5" style="width:460px;height:600px;overflow-y: scroll;overflow-x:scroll;">'; // The width is set here for the email list... 2-9-2022 scroll can be change dto hidden...

    //        if (!thiz.options.Sent.length || thiz.options.Sent.length == 0) {

    //            html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
    //            html += '  There are no Archived emails.';
    //            html += '<span>';

    //            html += '           </div>';

    //            if ($(thiz.element).find('#spanEmailPicker') && $(thiz.element).find('#spanEmailPicker')[0]) {
    //                $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;
    //            }
    //            if ($(thiz.element).find('#spanSelectedEmail') && $(thiz.element).find('#spanSelectedEmail')[0]) {
    //                $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = '';
    //            }

    //        } else {

    //            //
    //            // This is our email. 12-12-2023.
    //            //

    //            html += '<table xcx="xcx111948475664" style="max-width:460px;">'; // width:460px;height:600px;overflow-y: scroll;overflow-x:hidden;

    //            for (var i = 0; i < thiz.options.Sent.length; i++) {
    //                //html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
    //                html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" _id="' + thiz.options.Sent[i]._id + '" class="bwEmailArchivedItemsRow" xcx="xcx2224555-3" onclick="$(\'.bwCalendar\').bwCalendar(\'viewIndividualEmail_Inbox\', \'' + 'btnEditRaciRoles_' + thiz.options.Sent[i].bwParticipantId + '\', \'' + thiz.options.Sent[i].bwParticipantId + '\', \'' + thiz.options.Sent[i].bwParticipantFriendlyName + '\', \'' + thiz.options.Sent[i].bwParticipantEmail + '\', \'' + thiz.options.Sent[i]._id + '\');" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + thiz.options.Sent[i].bwParticipantId + '\', \'' + thiz.options.Sent[i].bwParticipantId + '\');">';
    //                //debugger; // xcx999999
    //                html += '    <td style="vertical-align:top;max-width:20px;"><input type="checkbox" class="sentEmailCheckbox" bwsentemailid="' + thiz.options.Sent[i].bwSentEmailId + '" /></td>';
    //                //debugger;
    //                //var timestamp = getFriendlyDateAndTime(data[i].Timestamp);
    //                //html += '    <td style="white-space:nowrap;">' + timestamp + '</td>';
    //                //html += '    <td>' + data[i].ToParticipantEmail + '</td>';
    //                //html += '    <td>' + data[i].Subject + '</td>'; // html += '    <td>' + data[i].FromEmailAddress + '</td>';
    //                //html += '    <td><input type="button" bwpendingemailid="xxpeid"' + data[i].EmailLink + '" value="View" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'viewPendingEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwPendingEmailId + '\');" /></td>';



    //                html += '    <td class="bwemailitems" _id="' + thiz.options.Sent[i]._id + '" draggable="true" id="bwCalendar_InnerLeftMenuButton_' + thiz.options.Sent[i]._id + '" style="border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px;max-width:350px;">';
    //                //debugger; // RelatedRequestId	ad19f2b8-707f-40ad-8228-a07d55a1ddac



    //                // data[i].mail_from
    //                //html += '<span style="font-weight:bold;color:black;">' + data[i].ToParticipantFriendlyName + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';
    //                //html += '<span style="font-weight:bold;color:black;">' + data[i].mail_from.original + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';

    //                var emailAddress = '';
    //                if (thiz.options.Sent[i].from && thiz.options.Sent[i].from[0] && thiz.options.Sent[i].from[0].address) {
    //                    emailAddress = thiz.options.Sent[i].from[0].address;
    //                } else {
    //                    emailAddress = thiz.options.Sent[i].from;
    //                }

    //                if (thiz.options.Sent[i].TheUserHasReadThisEmail && (thiz.options.Sent[i].TheUserHasReadThisEmail == true)) {
    //                    html += '<span style="font-weight:normal;color:black;" class="bwEmailInboxRow_EmailAddress">' + emailAddress + '<br />';
    //                } else {
    //                    html += '<span style="font-weight:bold;color:black;" class="bwEmailInboxRow_EmailAddress">' + emailAddress + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';
    //                }

    //                //html += '<span style="font-weight:normal;color:tomato;">' + timestamp + '</span>';
    //                // 2-3-2022
    //                var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(thiz.options.Sent[i].timestamp);
    //                html += '<span style="font-weight:normal;color:tomato;">' + timestamp4 + '</span>';



    //                html += '       <br />';
    //                //debugger;
    //                //html += 'RelatedRequestId: ' + data[i].RelatedRequestId + '</span></span>';
    //                html += '</span>';
    //                //html += '       <br />';

    //                var subject = '';
    //                if (thiz.options.Sent[i].subject) {
    //                    subject = thiz.options.Sent[i].subject.substring(0, 55);
    //                } else {
    //                    subject = '[no subject]';
    //                }

    //                if (thiz.options.Sent[i].TheUserHasReadThisEmail && (thiz.options.Sent[i].TheUserHasReadThisEmail == true)) {
    //                    html += '<span style="font-weight:lighter;color:#95b1d3;" class="bwEmailInboxRow_Subject">' + subject + ' ...</span>';
    //                } else {
    //                    html += '<span style="font-weight:bold;color:#95b1d3;" class="bwEmailInboxRow_Subject">' + subject + ' ...</span>';
    //                }

    //                html += '       <br />';

    //                //if (bwWorkflowAppId == 'all') { // This is for the forest administrator.
    //                html += '<span style="font-weight:normal;color:lightgray;">Organization: [' + thiz.options.Sent[i].bwWorkflowAppId + ']';

    //                // INTERNAL/EXTERNAL
    //                if (thiz.options.Sent[i].ThisEmailIsFromAnInternalSource && (thiz.options.Sent[i].ThisEmailIsFromAnInternalSource == true)) {
    //                    html += ' <span style="color:tomato;">INTERNAL</span>';
    //                } else {
    //                    html += ' <span style="color:tomato;">EXTERNAL</span>';
    //                }

    //                html += '</span>';
    //                html += '       <br />';
    //                //}

    //                //var bodyTextStartIndex = data[i].Body.indexOf('>');
    //                //var bodyTextEndIndex = data[i].Body.substring(bodyTextStartIndex).indexOf('<') + 1;
    //                //var bodyTextEndIndex2 = data[i].Body.substring(bodyTextEndIndex).indexOf('<') + 1;
    //                //var bodyText = data[i].Body.substring(bodyTextEndIndex, bodyTextEndIndex2);
    //                //html += '<span style="color:grey;">' + bodyText + ' ...</span>'; //  we have to do this because i we render the html it affect s the whole display in an unpredictable manner!!!
    //                //html += '       <br />';

    //                html += '   </td>';
    //                //displayAlertDialog('xcx231232 thiz.options.Sent[i]: ' + JSON.stringify(thiz.options.Sent[i]));


    //                html += '<td class="bwCalendar_Trashbin" style="max-width:40px;" onclick="$(\'.bwCalendar\').bwCalendar(\'deleteIndividualEmail\', \'' + thiz.options.Sent[i]._id + '\');event.stopPropagation();">';
    //                html += '<img src="/images/trashbin.png" />';
    //                html += '</td>';



    //                html += '  </tr>';
    //            }
    //            html += '</table>';

    //            html += '           </div>';

    //            // This if statement is here because the user may use a menu button to switch to a different screen before this happens... so this prevents the error being displayed.
    //            if ($(thiz.element).find('#spanEmailPicker') && $(thiz.element).find('#spanEmailPicker')[0]) {

    //                $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;

    //                // Quill subject editor.
    //                html = '';
    //                html += '<div style="height:15px;">&nbsp;</div>';



    //                //html += '                       <div class="spanButton" style="width:100px;text-align:right;" title="Click to send this email now!" onclick="$(\'.bwCalendar\').bwCalendar(\'sendEmailNow\');">';
    //                //html += '                           ✉&nbsp;Send Now > xcx5';
    //                //html += '                       </div>';






    //                //html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
    //                //html += 'From:';
    //                //html += '</span>';
    //                html += '<br />';
    //                html += '   <div id="bwEmailView_From" xcx="xcx34255555-6"></div>';
    //                html += '<br />';

    //                html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
    //                html += 'To:';
    //                html += '</span>';
    //                html += '<br />';
    //                html += '   <div id="bwEmailView_To"></div>';
    //                html += '<br />';


    //                html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
    //                html += 'Subject:';
    //                html += '</span>';
    //                html += '<br />';
    //                html += '   <div id="bwQuilltoolbarForSubject">';
    //                //html += '       <button id="btnQuill_InsertADataItemForSubject" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
    //                html += '   </div>';
    //                //html += '   <div id="quillConfigureNewUserEmailsDialog_Subject" style="height:50px;"></div>'; // Quill.
    //                html += '<input type="text" id="quillConfigureNewUserEmailsDialog_Subject" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';

    //                // Quill body editor.
    //                html += '<br /><br />';
    //                html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
    //                html += 'Body:';
    //                html += '</span>';
    //                html == '<br />';
    //                html += '   <div id="bwQuilltoolbar">';
    //                //html += '       <button id="btnQuill_InsertADataItem" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';

    //                html += '   </div>';
    //                html += '   <div id="quillConfigureNewUserEmailsDialog_Body" xcx="xcx132166-9" style="height:375px;"></div>'; // Quill.
    //                // Save button.
    //                //html += '   <br />';
    //                //html += '   <span id="spanConfigureEmailNotificationsDialogSaveButton">[spanConfigureEmailNotificationsDialogSaveButton]</span>'; // ☑
    //                //html += '   <br /><br />';
    //                // Preview/Edit button.
    //                //html += '   <div id="divNewUserEmailEditor_PreviewAndEditButton" class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;"></div>';
    //                //html += '   <br /><br />';
    //                html += '</div>';


    //                //$(thiz.element).find('#spanSelectedEmail')[0].innerHTML = html;
    //                try {
    //                    $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = html;
    //                } catch (e) { }


    //                //
    //                //
    //                // This is where we load the dataTransfer object, so that we can drag and drop emails among the email folders. 5-21-2024.
    //                //
    //                //

    //                var emailItems = document.getElementsByClassName('bwemailitems');
    //                for (var i = 0; i < emailItems.length; i++) {

    //                    emailItems[i].addEventListener('dragstart', function (e) {
    //                        try {
    //                            console.log('In bwCalendar.js.renderEmails_Archived.dragstart().');

    //                            // Step 1: Set the opacity for all of these classes to 0.5: brushedAluminum_blue_noanimation

    //                            // Step 2: Set the opacity to 1 for these buttons. This will indicate a drop zone: Junk, Archived, TrashBin. [divInnerLeftMenuButton_Inbox, divInnerLeftMenuButton_Sent, divInnerLeftMenuButton_TrashBin].

    //                            var elements1 = document.getElementsByClassName('brushedAluminum_blue_noanimation');
    //                            for (var j = 0; j < elements1.length; j++) {
    //                                elements1[j].style.opacity = '0.2';
    //                            }

    //                            var elements1 = document.getElementsByClassName('brushedAluminum_blue');
    //                            for (var j = 0; j < elements1.length; j++) {
    //                                elements1[j].style.opacity = '0.2';
    //                            }

    //                            document.getElementById('divInnerLeftMenuButton_Inbox').style.opacity = 1.0;
    //                            document.getElementById('divInnerLeftMenuButton_Sent').style.opacity = 1.0;
    //                            document.getElementById('divInnerLeftMenuButton_TrashBin').style.opacity = 1.0;

    //                            // We have to set the _id in the dragstart event.
    //                            var _id = e.target.getAttribute('_id');
    //                            var result = {
    //                                MailboxOrigin: 'SENT',
    //                                _id: _id
    //                            }
    //                            var result1 = JSON.stringify(result);
    //                            e.dataTransfer.setData('text/plain', result1);

    //                        } catch (e) {
    //                            var msg = 'Exception in bwCalendar.js.renderEmails_Archived.dragstart(): ' + e.message + ', ' + e.stack;
    //                            console.log(msg);
    //                            alert(msg);
    //                        }
    //                    });

    //                    emailItems[i].addEventListener('dragend', function (e) {
    //                        try {
    //                            console.log('In bwCalendar.js.renderEmails_Archived.dragend().');

    //                            // Set the opacity for all of these classes to 1.0: [brushedAluminum_blue, brushedAluminum_blue_noanimation].

    //                            var elements1 = document.getElementsByClassName('brushedAluminum_blue_noanimation');
    //                            for (var j = 0; j < elements1.length; j++) {
    //                                elements1[j].style.opacity = '1.0';
    //                            }

    //                            var elements1 = document.getElementsByClassName('brushedAluminum_blue');
    //                            for (var j = 0; j < elements1.length; j++) {
    //                                elements1[j].style.opacity = '1.0';
    //                            }

    //                        } catch (e) {
    //                            var msg = 'Exception in In bwCalendar.js.renderEmails_Archived.dragend(): ' + e.message + ', ' + e.stack;
    //                            console.log(msg);
    //                            alert(msg);
    //                        }
    //                    });

    //                }


    //            }
    //        }

    //    } catch (e) {
    //        console.log('Exception in bwCalendar.js.renderEmails_Archived(): ' + e.message + ', ' + e.stack);
    //        alert('Exception in bwCalendar.js.renderEmails_Archived(): ' + e.message + ', ' + e.stack);
    //    }
    //},
    //renderEmails_TrashBin: function (bwWorkflowAppId) {
    //    try {
    //        alert('xcx23123 DO WE STILL USE THIS????');
    //        console.log('In renderEmails_TrashBin(). bwWorkflowAppId: ' + bwWorkflowAppId);
    //        alert('In renderEmails_TrashBin(). bwWorkflowAppId: ' + bwWorkflowAppId);
    //        var thiz = this;

    //        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

    //        if (bwWorkflowAppId != 'all') {
    //            bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
    //        }

    //        this.options.pagingPage_SentEmail = 0; // If we want items to display properly, these need to be reset/set back to the beginning here.
    //        //this.options.pagingLimit_SentEmail = 20;

    //        $('#spanSelectedEmailSubject').html('');

    //        var html = '';

    //        // Display the top buttons.
    //        html += '                           <span xcx="xcx231232-12" class="emailEditor_topbarbutton" onclick="$(\'.bwCalendar\').bwCalendar(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\');">';
    //        html += '                               <img title="Delete..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx123468" />&nbsp;Delete';
    //        html += '                           </span>';
    //        html += '&nbsp;&nbsp;';
    //        html += '                           <span xcx="xcx231232-12" class="emailEditor_topbarbutton" onclick="$(\'.bwCalendar\').bwCalendar(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\', \'emptyfolder\');">';
    //        html += '                               <img title="Empty folder..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx23423467898">&nbsp;Empty folder';
    //        html += '                           </span>';
    //        $(thiz.element).find('#spanSelectedEmailType_TopButtons')[0].innerHTML = html; //'Pending Email';

    //        // Display the radio button and the title.
    //        html = '';
    //        html += '<input type="checkbox" id="checkboxToggleSentEmailCheckboxes" onchange="$(\'.bwCalendar\').bwCalendar(\'toggleSentEmailCheckboxes\', this);" />&nbsp;&nbsp;';
    //        html += '✉ TrashBin Items';

    //        $(thiz.element).find('#spanSelectedEmailType_Title')[0].innerHTML = html; //'Sent Email';

    //        // Make this button appear selected.
    //        $(thiz.element).find('#spanDisplaySentEmailButton').removeClass('bwCalendar_LeftMenuButton').addClass('bwCalendar_LeftMenuButton_Selected');
    //        $(thiz.element).find('#spanDisplayPendingEmailButton').removeClass('bwCalendar_LeftMenuButton_Selected').addClass('bwCalendar_LeftMenuButton');

    //        // Clear these in the beginning, because it may take a few seconds to re-populate, and this gives the user some visual feedback that something is going on.
    //        $(thiz.element).find('#spanEmailPicker')[0].innerHTML = '';
    //        $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '';

    //        console.log('xcx2313555. In bwCalendar.js.renderEmails_TrashBin(). Calling GET ' + webserviceurl + '/participantemail_inbox/ this.options.OnlyDisplayEmailsForCurrentParticipant: ' + this.options.OnlyDisplayEmailsForCurrentParticipant);


    //        var html = '';

    //        html += '           <div xcx="xcx21323663-6" style="width:460px;height:600px;overflow-y: scroll;overflow-x:scroll;">'; // The width is set here for the email list... 2-9-2022 scroll can be change dto hidden...

    //        if (!thiz.options.TrashBin.length || thiz.options.TrashBin.length == 0) {

    //            html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
    //            html += '  There are no TrashBin emails.';
    //            html += '<span>';

    //            html += '           </div>';

    //            if ($(thiz.element).find('#spanEmailPicker') && $(thiz.element).find('#spanEmailPicker')[0]) {
    //                $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;
    //            }
    //            if ($(thiz.element).find('#spanSelectedEmail') && $(thiz.element).find('#spanSelectedEmail')[0]) {
    //                $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = '';
    //            }

    //        } else {

    //            //
    //            // This is our email. 12-12-2023.
    //            //

    //            html += '<table xcx="xcx111948475664" style="max-width:460px;">'; // width:460px;height:600px;overflow-y: scroll;overflow-x:hidden;

    //            for (var i = 0; i < thiz.options.TrashBin.length; i++) {
    //                //html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
    //                html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" _id="' + thiz.options.TrashBin[i]._id + '" class="bwEmailTrashBinItemsRow" xcx="xcx2224555-3" onclick="$(\'.bwCalendar\').bwCalendar(\'viewIndividualEmail_TrashBin\', \'' + 'btnEditRaciRoles_' + thiz.options.TrashBin[i].bwParticipantId + '\', \'' + thiz.options.TrashBin[i].bwParticipantId + '\', \'' + thiz.options.TrashBin[i].bwParticipantFriendlyName + '\', \'' + thiz.options.TrashBin[i].bwParticipantEmail + '\', \'' + thiz.options.TrashBin[i]._id + '\');" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + thiz.options.TrashBin[i].bwParticipantId + '\', \'' + thiz.options.TrashBin[i].bwParticipantId + '\');">';
    //                //debugger; // xcx999999
    //                html += '    <td style="vertical-align:top;max-width:20px;"><input type="checkbox" class="sentEmailCheckbox" bwsentemailid="' + thiz.options.TrashBin[i].bwSentEmailId + '" /></td>';
    //                //debugger;
    //                //var timestamp = getFriendlyDateAndTime(data[i].Timestamp);
    //                //html += '    <td style="white-space:nowrap;">' + timestamp + '</td>';
    //                //html += '    <td>' + data[i].ToParticipantEmail + '</td>';
    //                //html += '    <td>' + data[i].Subject + '</td>'; // html += '    <td>' + data[i].FromEmailAddress + '</td>';
    //                //html += '    <td><input type="button" bwpendingemailid="xxpeid"' + data[i].EmailLink + '" value="View" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'viewPendingEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwPendingEmailId + '\');" /></td>';



    //                html += '    <td class="bwemailitems" _id="' + thiz.options.TrashBin[i]._id + '" draggable="true" id="bwCalendar_InnerLeftMenuButton_' + thiz.options.TrashBin[i]._id + '" style="border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px;max-width:350px;">';
    //                //debugger; // RelatedRequestId	ad19f2b8-707f-40ad-8228-a07d55a1ddac



    //                // data[i].mail_from
    //                //html += '<span style="font-weight:bold;color:black;">' + data[i].ToParticipantFriendlyName + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';
    //                //html += '<span style="font-weight:bold;color:black;">' + data[i].mail_from.original + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';

    //                var emailAddress = '';
    //                if (thiz.options.TrashBin[i].from && thiz.options.TrashBin[i].from[0] && thiz.options.TrashBin[i].from[0].address) {
    //                    emailAddress = thiz.options.TrashBin[i].from[0].address;
    //                } else {
    //                    emailAddress = thiz.options.TrashBin[i].from;
    //                }

    //                if (thiz.options.TrashBin[i].TheUserHasReadThisEmail && (thiz.options.TrashBin[i].TheUserHasReadThisEmail == true)) {
    //                    html += '<span style="font-weight:normal;color:black;" class="bwEmailInboxRow_EmailAddress">' + emailAddress + '<br />';
    //                } else {
    //                    html += '<span style="font-weight:bold;color:black;" class="bwEmailInboxRow_EmailAddress">' + emailAddress + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';
    //                }

    //                //html += '<span style="font-weight:normal;color:tomato;">' + timestamp + '</span>';
    //                // 2-3-2022
    //                var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(thiz.options.TrashBin[i].timestamp);
    //                html += '<span style="font-weight:normal;color:tomato;">' + timestamp4 + '</span>';



    //                html += '       <br />';
    //                //debugger;
    //                //html += 'RelatedRequestId: ' + data[i].RelatedRequestId + '</span></span>';
    //                html += '</span>';
    //                //html += '       <br />';

    //                var subject = '';
    //                if (thiz.options.TrashBin[i].subject) {
    //                    subject = thiz.options.TrashBin[i].subject.substring(0, 55);
    //                } else {
    //                    subject = '[no subject]';
    //                }

    //                if (thiz.options.TrashBin[i].TheUserHasReadThisEmail && (thiz.options.TrashBin[i].TheUserHasReadThisEmail == true)) {
    //                    html += '<span style="font-weight:lighter;color:#95b1d3;" class="bwEmailInboxRow_Subject">' + subject + ' ...</span>';
    //                } else {
    //                    html += '<span style="font-weight:bold;color:#95b1d3;" class="bwEmailInboxRow_Subject">' + subject + ' ...</span>';
    //                }

    //                html += '       <br />';

    //                //if (bwWorkflowAppId == 'all') { // This is for the forest administrator.
    //                html += '<span style="font-weight:normal;color:lightgray;">Organization: [' + thiz.options.TrashBin[i].bwWorkflowAppId + ']';

    //                // INTERNAL/EXTERNAL
    //                if (thiz.options.TrashBin[i].ThisEmailIsFromAnInternalSource && (thiz.options.TrashBin[i].ThisEmailIsFromAnInternalSource == true)) {
    //                    html += ' <span style="color:tomato;">INTERNAL</span>';
    //                } else {
    //                    html += ' <span style="color:tomato;">EXTERNAL</span>';
    //                }

    //                html += '</span>';
    //                html += '       <br />';
    //                //}

    //                //var bodyTextStartIndex = data[i].Body.indexOf('>');
    //                //var bodyTextEndIndex = data[i].Body.substring(bodyTextStartIndex).indexOf('<') + 1;
    //                //var bodyTextEndIndex2 = data[i].Body.substring(bodyTextEndIndex).indexOf('<') + 1;
    //                //var bodyText = data[i].Body.substring(bodyTextEndIndex, bodyTextEndIndex2);
    //                //html += '<span style="color:grey;">' + bodyText + ' ...</span>'; //  we have to do this because i we render the html it affect s the whole display in an unpredictable manner!!!
    //                //html += '       <br />';

    //                html += '   </td>';
    //                //displayAlertDialog('xcx231232 thiz.options.TrashBin[i]: ' + JSON.stringify(thiz.options.TrashBin[i]));


    //                html += '<td class="bwCalendar_Trashbin" style="max-width:40px;" onclick="$(\'.bwCalendar\').bwCalendar(\'deleteIndividualEmail\', \'' + thiz.options.TrashBin[i]._id + '\');event.stopPropagation();">';
    //                html += '<img src="/images/trashbin.png" />';
    //                html += '</td>';



    //                html += '  </tr>';
    //            }
    //            html += '</table>';

    //            html += '           </div>';

    //            // This if statement is here because the user may use a menu button to switch to a different screen before this happens... so this prevents the error being displayed.
    //            if ($(thiz.element).find('#spanEmailPicker') && $(thiz.element).find('#spanEmailPicker')[0]) {

    //                $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;








    //                try {
    //                    //$(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = html;

    //                    $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '<div xcx="xcx213123-4" style="font-size:25pt;color:lightgray;">SELECT A CALENDAR ITEM THAT YOU WISH TO VIEW.</div>';

    //                    var x = document.getElementById('tdbwCalendar_RightColumn');
    //                    x.style.verticalAlign = 'middle';

    //                } catch (e) { }










    //                //
    //                //
    //                // This is where we load the dataTransfer object, so that we can drag and drop emails among the email folders. 5-21-2024.
    //                //
    //                //

    //                var emailItems = document.getElementsByClassName('bwemailitems');
    //                for (var i = 0; i < emailItems.length; i++) {

    //                    emailItems[i].addEventListener('dragstart', function (e) {
    //                        try {
    //                            console.log('In bwCalendar.js.renderEmails_TrashBin.dragstart().');

    //                            // Step 1: Set the opacity for all of these classes to 0.5: brushedAluminum_blue_noanimation

    //                            // Step 2: Set the opacity to 1 for these buttons. This will indicate a drop zone: Junk, Archived, TrashBin. [divInnerLeftMenuButton_Inbox, divInnerLeftMenuButton_Sent, divInnerLeftMenuButton_Junk, divInnerLeftMenuButton_Archived].

    //                            var elements1 = document.getElementsByClassName('brushedAluminum_blue_noanimation');
    //                            for (var j = 0; j < elements1.length; j++) {
    //                                elements1[j].style.opacity = '0.2';
    //                            }

    //                            var elements1 = document.getElementsByClassName('brushedAluminum_blue');
    //                            for (var j = 0; j < elements1.length; j++) {
    //                                elements1[j].style.opacity = '0.2';
    //                            }

    //                            document.getElementById('divInnerLeftMenuButton_Inbox').style.opacity = 1.0;
    //                            document.getElementById('divInnerLeftMenuButton_Sent').style.opacity = 1.0;
    //                            document.getElementById('divInnerLeftMenuButton_Junk').style.opacity = 1.0;
    //                            document.getElementById('divInnerLeftMenuButton_Archived').style.opacity = 1.0;

    //                            // We have to set the _id in the dragstart event.
    //                            var _id = e.target.getAttribute('_id');
    //                            var result = {
    //                                MailboxOrigin: 'TRASHBIN',
    //                                _id: _id
    //                            }
    //                            var result1 = JSON.stringify(result);
    //                            e.dataTransfer.setData('text/plain', result1);

    //                        } catch (e) {
    //                            var msg = 'Exception in bwCalendar.js.renderEmails_TrashBin.dragstart(): ' + e.message + ', ' + e.stack;
    //                            console.log(msg);
    //                            alert(msg);
    //                        }
    //                    });

    //                    emailItems[i].addEventListener('dragend', function (e) {
    //                        try {
    //                            console.log('In bwCalendar.js.renderEmails_TrashBin.dragend().');

    //                            // Set the opacity for all of these classes to 1.0: [brushedAluminum_blue, brushedAluminum_blue_noanimation].

    //                            var elements1 = document.getElementsByClassName('brushedAluminum_blue_noanimation');
    //                            for (var j = 0; j < elements1.length; j++) {
    //                                elements1[j].style.opacity = '1.0';
    //                            }

    //                            var elements1 = document.getElementsByClassName('brushedAluminum_blue');
    //                            for (var j = 0; j < elements1.length; j++) {
    //                                elements1[j].style.opacity = '1.0';
    //                            }

    //                        } catch (e) {
    //                            var msg = 'Exception in In bwCalendar.js.renderEmails_TrashBin.dragend(): ' + e.message + ', ' + e.stack;
    //                            console.log(msg);
    //                            alert(msg);
    //                        }
    //                    });

    //                }


    //            }
    //        }

    //    } catch (e) {
    //        console.log('Exception in bwCalendar.js.renderEmails_TrashBin(): ' + e.message + ', ' + e.stack);
    //        alert('Exception in bwCalendar.js.renderEmails_TrashBin(): ' + e.message + ', ' + e.stack);
    //    }
    //},
    //renderEmails_search: function (bwWorkflowAppId) {
    //    try {
    //        alert('xcx23123 DO WE STILL USE THIS????');
    //        console.log('In bwCalendar.js.renderEmails_search(). bwWorkflowAppId: ' + bwWorkflowAppId);
    //        //alert('In bwCalendar.js.renderEmails_search(). bwWorkflowAppId: ' + bwWorkflowAppId);
    //        var thiz = this;
    //        debugger;
    //        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

    //        if (bwWorkflowAppId != 'all') {
    //            bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
    //        }

    //        this.options.pagingPage_SentEmail = 0; // If we want items to display properly, these need to be reset/set back to the beginning here.
    //        //this.options.pagingLimit_SentEmail = 20;

    //        $('#spanSelectedEmailSubject').html('');

    //        var html = '';

    //        // Display the top buttons.
    //        html += '                           <span xcx="xcx231232-13" class="emailEditor_topbarbutton" onclick="$(\'.bwCalendar\').bwCalendar(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\');">';
    //        html += '                               <img title="Delete..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx123468" />&nbsp;Delete';
    //        html += '                           </span>';
    //        html += '&nbsp;&nbsp;';
    //        //html += '                           <span class="emailEditor_topbarbutton" onclick="$(\'.bwCalendar\').bwCalendar(\'cmdDisplayDeleteSentEmailsDialog\', \'' + bwWorkflowAppId + '\', \'emptyfolder\');">';
    //        //html += '                               <img title="Empty folder..." style="cursor:pointer;" src="images/trash-can.png" xcx="xcx23423467898">&nbsp;Empty folder';
    //        //html += '                           </span>';
    //        $(thiz.element).find('#spanSelectedEmailType_TopButtons')[0].innerHTML = html; //'Pending Email';

    //        // Display the radio button and the title.
    //        html = '';
    //        html += '<input type="checkbox" id="checkboxToggleSentEmailCheckboxes" onchange="$(\'.bwCalendar\').bwCalendar(\'toggleSentEmailCheckboxes\', this);" />&nbsp;&nbsp;';
    //        html += '✉ Search Results (' + this.options.SearchResults.length + ')';

    //        $(thiz.element).find('#spanSelectedEmailType_Title')[0].innerHTML = html; //'Sent Email';

    //        // Make this button appear selected.
    //        $(thiz.element).find('#spanDisplaySentEmailButton').removeClass('bwCalendar_LeftMenuButton').addClass('bwCalendar_LeftMenuButton_Selected');
    //        $(thiz.element).find('#spanDisplayPendingEmailButton').removeClass('bwCalendar_LeftMenuButton_Selected').addClass('bwCalendar_LeftMenuButton');

    //        // Clear these in the beginning, because it may take a few seconds to re-populate, and this gives the user some visual feedback that something is going on.
    //        $(thiz.element).find('#spanEmailPicker')[0].innerHTML = '';
    //        $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = '';

    //        console.log('xcx2313555. In bwCalendar.js.renderEmails_search(). Calling GET ' + webserviceurl + '/participantemail_inbox/ this.options.OnlyDisplayEmailsForCurrentParticipant: ' + this.options.OnlyDisplayEmailsForCurrentParticipant);


    //        var html = '';

    //        html += '           <div id="divEmailPicker" xcx="xcx21323663-1" style="width:460px;height:600px;overflow-y: scroll;overflow-x:scroll;">'; // The width is set here for the email list... 2-9-2022 scroll can be change dto hidden...
    //        debugger;
    //        if (!thiz.options.SearchResults.length || thiz.options.SearchResults.length == 0) {

    //            html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
    //            html += '  There are no Search emails.';
    //            html += '<span>';

    //            html += '           </div>';

    //            if ($(thiz.element).find('#spanEmailPicker') && $(thiz.element).find('#spanEmailPicker')[0]) {
    //                $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;
    //            }
    //            if ($(thiz.element).find('#spanSelectedEmail') && $(thiz.element).find('#spanSelectedEmail')[0]) {
    //                $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = '';
    //            }

    //        } else {

    //            //
    //            // This is our email. 12-12-2023.
    //            //

    //            html += '<table xcx="xcx111948475664" style="max-width:460px;">'; // width:460px;height:600px;overflow-y: scroll;overflow-x:hidden;

    //            for (var i = 0; i < thiz.options.SearchResults.length; i++) {
    //                //html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
    //                html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" _id="' + thiz.options.SearchResults[i]._id + '" class="bwEmailSearchItemsRow" xcx="xcx2224555-3" onclick="$(\'.bwCalendar\').bwCalendar(\'viewIndividualEmail_SearchResults\', \'' + 'btnEditRaciRoles_' + thiz.options.SearchResults[i].bwParticipantId + '\', \'' + thiz.options.SearchResults[i].bwParticipantId + '\', \'' + thiz.options.SearchResults[i].bwParticipantFriendlyName + '\', \'' + thiz.options.SearchResults[i].bwParticipantEmail + '\', \'' + thiz.options.SearchResults[i]._id + '\');" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + thiz.options.SearchResults[i].bwParticipantId + '\', \'' + thiz.options.SearchResults[i].bwParticipantId + '\');">';
    //                //debugger; // xcx999999
    //                html += '    <td style="vertical-align:top;max-width:20px;"><input type="checkbox" class="sentEmailCheckbox" bwsentemailid="' + thiz.options.SearchResults[i].bwSentEmailId + '" /></td>';
    //                //debugger;
    //                //var timestamp = getFriendlyDateAndTime(data[i].Timestamp);
    //                //html += '    <td style="white-space:nowrap;">' + timestamp + '</td>';
    //                //html += '    <td>' + data[i].ToParticipantEmail + '</td>';
    //                //html += '    <td>' + data[i].Subject + '</td>'; // html += '    <td>' + data[i].FromEmailAddress + '</td>';
    //                //html += '    <td><input type="button" bwpendingemailid="xxpeid"' + data[i].EmailLink + '" value="View" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'viewPendingEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwPendingEmailId + '\');" /></td>';



    //                html += '    <td class="bwemailitems" _id="' + thiz.options.SearchResults[i]._id + '" draggable="true" id="bwCalendar_InnerLeftMenuButton_' + thiz.options.SearchResults[i]._id + '" style="border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px;max-width:350px;">';
    //                //debugger; // RelatedRequestId	ad19f2b8-707f-40ad-8228-a07d55a1ddac



    //                // data[i].mail_from
    //                //html += '<span style="font-weight:bold;color:black;">' + data[i].ToParticipantFriendlyName + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';
    //                //html += '<span style="font-weight:bold;color:black;">' + data[i].mail_from.original + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';

    //                var emailAddress = '';
    //                if (thiz.options.SearchResults[i].from && thiz.options.SearchResults[i].from[0] && thiz.options.SearchResults[i].from[0].address) {
    //                    emailAddress = thiz.options.SearchResults[i].from[0].address;
    //                } else {
    //                    emailAddress = thiz.options.SearchResults[i].from;
    //                }

    //                if (thiz.options.SearchResults[i].TheUserHasReadThisEmail && (thiz.options.SearchResults[i].TheUserHasReadThisEmail == true)) {
    //                    html += '<span style="font-weight:normal;color:black;" class="bwEmailInboxRow_EmailAddress">' + emailAddress + '<br />';
    //                } else {
    //                    html += '<span style="font-weight:bold;color:black;" class="bwEmailInboxRow_EmailAddress">' + emailAddress + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';
    //                }

    //                //html += '<span style="font-weight:normal;color:tomato;">' + timestamp + '</span>';
    //                // 2-3-2022
    //                var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(thiz.options.SearchResults[i].timestamp);
    //                html += '<span style="font-weight:normal;color:tomato;">' + timestamp4 + '</span>';



    //                html += '       <br />';
    //                //debugger;
    //                //html += 'RelatedRequestId: ' + data[i].RelatedRequestId + '</span></span>';
    //                html += '</span>';
    //                //html += '       <br />';

    //                var subject = '';
    //                if (thiz.options.SearchResults[i].subject) {
    //                    subject = thiz.options.SearchResults[i].subject.substring(0, 55);
    //                } else {
    //                    subject = '[no subject]';
    //                }

    //                if (thiz.options.SearchResults[i].TheUserHasReadThisEmail && (thiz.options.SearchResults[i].TheUserHasReadThisEmail == true)) {
    //                    html += '<span style="font-weight:lighter;color:#95b1d3;" class="bwEmailInboxRow_Subject">' + subject + ' ...</span>';
    //                } else {
    //                    html += '<span style="font-weight:bold;color:#95b1d3;" class="bwEmailInboxRow_Subject">' + subject + ' ...</span>';
    //                }

    //                html += '       <br />';

    //                //if (bwWorkflowAppId == 'all') { // This is for the forest administrator.
    //                html += '<span style="font-weight:normal;color:lightgray;">Organization: [' + thiz.options.SearchResults[i].bwWorkflowAppId + ']';

    //                // INTERNAL/EXTERNAL
    //                if (thiz.options.SearchResults[i].ThisEmailIsFromAnInternalSource && (thiz.options.SearchResults[i].ThisEmailIsFromAnInternalSource == true)) {
    //                    html += ' <span style="color:tomato;">INTERNAL</span>';
    //                } else {
    //                    html += ' <span style="color:tomato;">EXTERNAL</span>';
    //                }

    //                html += '</span>';
    //                html += '       <br />';
    //                //}

    //                //var bodyTextStartIndex = data[i].Body.indexOf('>');
    //                //var bodyTextEndIndex = data[i].Body.substring(bodyTextStartIndex).indexOf('<') + 1;
    //                //var bodyTextEndIndex2 = data[i].Body.substring(bodyTextEndIndex).indexOf('<') + 1;
    //                //var bodyText = data[i].Body.substring(bodyTextEndIndex, bodyTextEndIndex2);
    //                //html += '<span style="color:grey;">' + bodyText + ' ...</span>'; //  we have to do this because i we render the html it affect s the whole display in an unpredictable manner!!!
    //                //html += '       <br />';

    //                html += '   </td>';
    //                //displayAlertDialog('xcx231232 thiz.options.SearchResults[i]: ' + JSON.stringify(thiz.options.SearchResults[i]));


    //                html += '<td class="bwCalendar_Trashbin" style="max-width:40px;" onclick="$(\'.bwCalendar\').bwCalendar(\'deleteIndividualEmail\', \'' + thiz.options.SearchResults[i]._id + '\');event.stopPropagation();">';
    //                html += '<img src="/images/trashbin.png" />';
    //                html += '</td>';



    //                html += '  </tr>';
    //            }
    //            html += '</table>';

    //            html += '           </div>';

    //            // This if statement is here because the user may use a menu button to switch to a different screen before this happens... so this prevents the error being displayed.
    //            if ($(thiz.element).find('#spanEmailPicker') && $(thiz.element).find('#spanEmailPicker')[0]) {

    //                $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;

    //                // Quill subject editor.
    //                html = '';
    //                html += '<div style="height:15px;">&nbsp;</div>';



    //                //html += '                       <div class="spanButton" style="width:100px;text-align:right;" title="Click to send this email now!" onclick="$(\'.bwCalendar\').bwCalendar(\'sendEmailNow\');">';
    //                //html += '                           ✉&nbsp;Send Now > xcx5';
    //                //html += '                       </div>';






    //                //html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
    //                //html += 'From:';
    //                //html += '</span>';
    //                html += '<br />';
    //                html += '   <div id="bwEmailView_From" xcx="xcx34255555-3"></div>';
    //                html += '<br />';

    //                html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
    //                html += 'To:';
    //                html += '</span>';
    //                html += '<br />';
    //                html += '   <div id="bwEmailView_To"></div>';
    //                html += '<br />';


    //                html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
    //                html += 'Subject:';
    //                html += '</span>';
    //                html += '<br />';
    //                html += '   <div id="bwQuilltoolbarForSubject">';
    //                //html += '       <button id="btnQuill_InsertADataItemForSubject" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
    //                html += '   </div>';
    //                //html += '   <div id="quillConfigureNewUserEmailsDialog_Subject" style="height:50px;"></div>'; // Quill.
    //                html += '<input type="text" id="quillConfigureNewUserEmailsDialog_Subject" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';

    //                // Quill body editor.
    //                html += '<br /><br />';
    //                html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
    //                html += 'Body:';
    //                html += '</span>';
    //                html == '<br />';
    //                html += '   <div id="bwQuilltoolbar">';
    //                //html += '       <button id="btnQuill_InsertADataItem" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';

    //                html += '   </div>';
    //                html += '   <div id="quillConfigureNewUserEmailsDialog_Body" xcx="xcx132166-5" style="height:375px;"></div>'; // Quill.
    //                // Save button.
    //                //html += '   <br />';
    //                //html += '   <span id="spanConfigureEmailNotificationsDialogSaveButton">[spanConfigureEmailNotificationsDialogSaveButton]</span>'; // ☑
    //                //html += '   <br /><br />';
    //                // Preview/Edit button.
    //                //html += '   <div id="divNewUserEmailEditor_PreviewAndEditButton" class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;"></div>';
    //                //html += '   <br /><br />';
    //                html += '</div>';


    //                //$(thiz.element).find('#spanSelectedEmail')[0].innerHTML = html;
    //                try {
    //                    $(thiz.element).find('#divEmailClient_CompositionWindow')[0].innerHTML = html;
    //                } catch (e) { }


    //                //
    //                //
    //                // This is where we load the dataTransfer object, so that we can drag and drop emails among the email folders. 5-21-2024.
    //                //
    //                //

    //                var emailItems = document.getElementsByClassName('bwemailitems');
    //                for (var i = 0; i < emailItems.length; i++) {

    //                    emailItems[i].addEventListener('dragstart', function (e) {
    //                        try {
    //                            console.log('In bwCalendar.js.renderEmails_search.dragstart().');

    //                            // Step 1: Set the opacity for all of these classes to 0.5: brushedAluminum_blue_noanimation

    //                            // Step 2: Set the opacity to 1 for these buttons. This will indicate a drop zone: Junk, Archived, TrashBin. [divInnerLeftMenuButton_Junk, divInnerLeftMenuButton_Archived, divInnerLeftMenuButton_TrashBin].

    //                            var elements1 = document.getElementsByClassName('brushedAluminum_blue_noanimation');
    //                            for (var j = 0; j < elements1.length; j++) {
    //                                elements1[j].style.opacity = '0.2';
    //                            }

    //                            var elements1 = document.getElementsByClassName('brushedAluminum_blue');
    //                            for (var j = 0; j < elements1.length; j++) {
    //                                elements1[j].style.opacity = '0.2';
    //                            }

    //                            document.getElementById('divInnerLeftMenuButton_Junk').style.opacity = 1.0;
    //                            document.getElementById('divInnerLeftMenuButton_Archived').style.opacity = 1.0;
    //                            document.getElementById('divInnerLeftMenuButton_TrashBin').style.opacity = 1.0;

    //                            // We have to set the _id in the dragstart event.
    //                            var _id = e.target.getAttribute('_id');
    //                            var result = {
    //                                MailboxOrigin: 'SearchResults',
    //                                _id: _id
    //                            }
    //                            var result1 = JSON.stringify(result);
    //                            e.dataTransfer.setData('text/plain', result1);

    //                        } catch (e) {
    //                            var msg = 'Exception in In bwCalendar.js.renderEmails_search.dragstart(): ' + e.message + ', ' + e.stack;
    //                            console.log(msg);
    //                            alert(msg);
    //                        }
    //                    });

    //                    emailItems[i].addEventListener('dragend', function (e) {
    //                        try {
    //                            console.log('In bwCalendar.js.renderEmails_search.dragend().');

    //                            // Set the opacity for all of these classes to 1.0: [brushedAluminum_blue, brushedAluminum_blue_noanimation].

    //                            var elements1 = document.getElementsByClassName('brushedAluminum_blue_noanimation');
    //                            for (var j = 0; j < elements1.length; j++) {
    //                                elements1[j].style.opacity = '1.0';
    //                            }

    //                            var elements1 = document.getElementsByClassName('brushedAluminum_blue');
    //                            for (var j = 0; j < elements1.length; j++) {
    //                                elements1[j].style.opacity = '1.0';
    //                            }

    //                        } catch (e) {
    //                            var msg = 'Exception in In bwCalendar.js.renderEmails_search.dragend(): ' + e.message + ', ' + e.stack;
    //                            console.log(msg);
    //                            alert(msg);
    //                        }
    //                    });

    //                }


    //            }
    //        }

    //        thiz.resize();

    //    } catch (e) {
    //        console.log('Exception in bwCalendar.js.renderEmails_search(): ' + e.message + ', ' + e.stack);
    //        alert('Exception in bwCalendar.js.renderEmails_search(): ' + e.message + ', ' + e.stack);
    //    }
    //},
    //// end: GET RID OF THESE ONES!!!!!!!!!!!




    //deleteIndividualEmail_Drafts: function (_id) {
    //    try {
    //        console.log('In bwCalendar.js.deleteIndividualEmail_Drafts(). _id: ' + _id);
    //        //alert('In bwCalendar.js.deleteIndividualEmail_Drafts(). _id: ' + _id);
    //        var thiz = this;

    //        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
    //        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

    //        if (!(workflowAppId && participantId && _id)) {

    //            console.log('Error in bwCalendar.js.deleteIndividualEmail_Drafts(): Invalid value. Expected values for workflowAppId: ' + workflowAppId + ', participantId: ' + participantId + ', _id: ' + _id);
    //            displayAlertDialog('Error in bwCalendar.js.deleteIndividualEmail_Drafts(): Invalid value. Expected values for workflowAppId: ' + workflowAppId + ', participantId: ' + participantId + ', _id: ' + _id);

    //        } else {

    //            ShowActivitySpinner_Promise('Moving to the TrashBin...')
    //                .then(function (results) {
    //                    try {

    //                        var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

    //                        var data = {
    //                            bwParticipantId_LoggedIn: participantId,
    //                            bwActiveStateIdentifier: activeStateIdentifier,
    //                            bwWorkflowAppId_LoggedIn: workflowAppId,

    //                            bwWorkflowAppId: workflowAppId,
    //                            bwParticipantId: participantId,
    //                            _id: _id
    //                        }

    //                        $.ajax({
    //                            url: thiz.options.operationUriPrefix + "_bw/deleteindividualemail_drafts",
    //                            contentType: "application/json",
    //                            type: 'POST',
    //                            data: JSON.stringify(data)
    //                        }).success(function (result) {
    //                            try {

    //                                if (result.status != 'SUCCESS') {

    //                                    HideActivitySpinner();
    //                                    displayAlertDialog(result.message);

    //                                } else {

    //                                    HideActivitySpinner();

    //                                    console.log('The email has been deleted.');
    //                                    //$('#divBwEmailMonitor_DeleteSentEmailsDialog').dialog('close');

    //                                    var foundIt;
    //                                    for (var i = 0; i < thiz.options.Drafts.docs.length; i++) {
    //                                        if (thiz.options.Drafts.docs[i]._id == _id) {
    //                                            // This is the one we just deleted. Instead of going out and getting the entire list again, just remove it here.
    //                                            thiz.options.Drafts.docs.splice(i, 1); // Delete the item from the array.
    //                                            foundIt = true;
    //                                            break;
    //                                        }
    //                                    }

    //                                    if (!foundIt) {

    //                                        var msg = 'Error xcx231312-2-2. Could not find the email.';
    //                                        console.log(msg);
    //                                        displayAlertDialog(msg);

    //                                    } else {

    //                                        thiz.renderEmails_Drafts();
    //                                    }

    //                                }

    //                            } catch (e) {

    //                                HideActivitySpinner();

    //                                console.log('Exception in bwCalendar.js.deleteIndividualEmail_Drafts():4: ' + e.message + ', ' + e.stack);
    //                                displayAlertDialog('Exception in bwCalendar.js.deleteIndividualEmail_Drafts(): 4:' + e.message + ', ' + e.stack);
    //                            }

    //                        }).error(function (data, errorCode, errorMessage) {

    //                            HideActivitySpinner();

    //                            var msg = 'Fail in bwCalendar.js.deleteIndividualEmail_Drafts(): ' + JSON.stringify(data) + ', ' + errorCode + ', ' + errorMessage;
    //                            console.log(msg);
    //                            displayAlertDialog(msg);

    //                        });

    //                    } catch (e) {

    //                        HideActivitySpinner();

    //                        var msg = 'Exception in bwCalendar.js.deleteIndividualEmail_Drafts():3: ' + e.message + ', ' + e.stack;
    //                        console.log(msg);
    //                        displayAlertDialog(msg);

    //                    }

    //                })
    //                .catch(function (e) {
    //                    HideActivitySpinner();

    //                    var msg = 'Exception in bwCalendar.js.deleteIndividualEmail_Drafts():2: ' + JSON.stringify(e);
    //                    console.log(msg);
    //                    displayAlertDialog(msg);

    //                });

    //        }

    //    } catch (e) {
    //        var msg = 'Exception in bwCalendar.js.deleteIndividualEmail_Drafts(): ' + e.message + ', ' + e.stack;
    //        console.log(msg);
    //        displayAlertDialog(msg);
    //    }
    //},


});