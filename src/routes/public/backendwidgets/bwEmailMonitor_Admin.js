$.widget("bw.bwEmailMonitor_Admin", {
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
        This is the bwEmailMonitor_Admin.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

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
        ajaxTimeout: 15000,

        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function (assignmentRowChanged_ElementId) {
        this.element.addClass("bwEmailMonitor_Admin");
        var thiz = this;
        try {

            selfDiscoverOperationUri(thiz); // This sets this.options.operationUriPrefix correctly.

            var html = '';

            if (this.options.backendAdministrationMode != true) {

                html += '<style>';

                html += '.bwEmailMonitor_Admin_LeftMenuButton {';
                html += '   font-size:14pt;white-space:nowrap;cursor:pointer;padding:10px 40px 10px 40px;'; // T L B R
                html += '}';

                html += '.bwEmailMonitor_Admin_LeftMenuButton:hover {';
                html += '   cursor:pointer;background-color:lightgray;';
                html += '}';

                html += '.bwEmailMonitor_Admin_LeftMenuButton_Selected {';
                html += '   font-size:14pt;white-space:nowrap;cursor:pointer;padding:10px 40px 10px 40px;background-color:#DEECF9;';
                html += '}';

                html += '.bwEmailMonitor_Admin_LeftMenuButton_UnicodeImage {';
                html += '   font-size:30px;color:gray;'; // T L B R
                html += '}';

                html += '</style>';

                

                html += '<div style="display:none;" id="divDeletePendingEmailsDialog">';
                html += '   <table style="width:100%;">';
                html += '       <tr>';
                html += '           <td style="width:90%;">';
                html += '               <span id="spanDeletePendingEmailsDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">Delete Emails</span>';
                html += '           </td>';
                html += '           <td style="width:9%;"></td>';
                html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
                html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divDeletePendingEmailsDialog\').dialog(\'close\');">X</span>';
                html += '           </td>';
                html += '       </tr>';
                html += '   </table>';
                html += '   <br /><br />';
                html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                html += '   <span id="spanDeletePendingEmailsDialogContentText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;">';
                html += '       [spanDeletePendingEmailsDialogContentText]';
                html += '   </span>';
                html += '   <br /><br /><br />';
                html += '   <div class="divSignInButton" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'deleteSelectedPendingEmails\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
                html += '       Delete the Pending Emails';
                html += '   </div>';
                html += '   <br /><br />';
                html += '   <div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em; font-weight: bold;" onclick="$(\'#divDeletePendingEmailsDialog\').dialog(\'close\');">';
                html += '       Cancel';
                html += '   </div>';
                html += '   <br /><br />';
                html += '</div>';

                html += '<table>';
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
                html += '                   <col style="WIDTH:90%;" />';
                html += '               </colgroup>';
                html += '               <tbody>';

                //html += '                       <tr>';
                //html += '                           <td colspan="7">';
                //html += '                               <span style="font-size:15pt;font-weight:normal;">Review your system generated emails</span>';
                //html += '                               <br />';
                //html += '                               <span style="font-size:10pt;font-weight:normal;">The system sends you emails, which you can review here as "Sent". "Pending" emails are ones that have not been sent yet, because the email system has been turned off.</span>';
                //html += '                               <br /><br />';
                //html += '                           </td>';
                //html += '                       </tr>';

                html += '                       <tr style="font-size:10pt;font-weight:normal;color:black;">';
                html += '                           <td></td>';
                html += '                           <td colspan="6">';
                html += '                               <span id="spanSelectedEmailType_TopButtons" style="font-size:13pt;font-weight:normal;">[spanSelectedEmailType_TopButtons]</span>';
                html += '                           </td>';
                html += '                       </tr>';

                html += '                       <tr style="font-size:10pt;font-weight:normal;color:black;">';
                html += '                           <td></td>';
                html += '                           <td></td>';
                html += '                           <td colspan="4">';
                html += '                           </td>';
                html += '                           <td style="text-align:right;width:97%;">';
                html += '                               <span class="spanButton" title="Click to send this email now!" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'sendPendingEmailNow\');">';
                html += '                                   ✉&nbsp;Send Now > xcx1';
                html += '                               </span>';
                html += '                           </td>';
                html += '                       </tr>';

                html += '                       <tr>';
                html += '                           <td id="tdDisplayPendingEmailButton">';
                html += '                           </td>';

                html += '                           <td colspan="5" style="height:50px;text-align:left;background-color:white;margin:10px 20px 10px -3px;"><span id="spanSelectedEmailType_Title" style="height:30px;font-size:15pt;font-weight:bold;">[spanSelectedEmailType_Title]</span></td>';

                html += '                           <td style="width:97%;">';
                html += '                               <span id="spanSelectedEmailSubject" style="font-size:13pt;font-weight:bold;color:#95b1d3;"></span>';
                html += '                           </td>';
                html += '                       </tr>';

                html += '                       <tr>';
                html += '                           <td style="vertical-align:top;">';
                html += '<table>';
                html += '   <tr>';
                html += '       <td id="spanDisplayPendingEmailButton" class="bwEmailMonitor_Admin_LeftMenuButton" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'displayPendingEmails\');" >';
                html += '           <span><span class="bwEmailMonitor_Admin_LeftMenuButton_UnicodeImage">✉</span> Pending email(s)</span>';
                html += '       </td>';
                html += '   </tr>';
                html += '   <tr>';
                html += '       <td id="spanDisplaySentEmailButton" class="bwEmailMonitor_Admin_LeftMenuButton" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'displaySentEmails\');">';
                html += '           <span><span class="bwEmailMonitor_Admin_LeftMenuButton_UnicodeImage">✉</span> Sent email(s)</span>';
                html += '       </td>';
                html += '   </tr>';
                html += '</table>';
                html += '                           </td>';

                html += '                           <td colspan="5" style="vertical-align:top;background-color:white;">';
                html += '                               <div style="width:350px;height:600px;overflow-y: scroll;">'; // The width is set here.
                html += '                                   <span id="spanEmailPicker"></span>';
                html += '                               </div>';
                html += '                           </td>';

                html += '                           <td style="vertical-align:top;width:97%;">';
                html += '                               <span id="spanSelectedEmail"></span>';
                html += '                           </td>';
                html += '                       </tr>';

                html += '               </tbody>';
                html += '           </table>';

                html += '       </td>';
                html += '   </tr>';
                html += '</table>';

                // Render the html.
                this.element.html(html);

                this.displayPendingEmails();

            } else {
                // this.options.backendAdministrationMode == true
                html += '<div style="display:none;" id="divDeleteForestPendingEmailsDialog">';
                html += '   <table style="width:100%;">';
                html += '       <tr>';
                html += '           <td style="width:90%;">';
                html += '               <span id="spanDeleteForestPendingEmailsDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">Delete Emails</span>';
                html += '           </td>';
                html += '           <td style="width:9%;"></td>';
                html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
                html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divDeleteForestPendingEmailsDialog\').dialog(\'close\');">X</span>';
                html += '           </td>';
                html += '       </tr>';
                html += '   </table>';
                html += '   <br /><br />';
                html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                html += '   <span id="spanDeleteForestPendingEmailsDialogContentText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;">';
                html += '[spanDeleteForestPendingEmailsDialogContentText]';
                html += '   </span>';
                html += '   <br /><br /><br />';
                html += '   <div class="divSignInButton" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'deleteSelectedForestPendingEmails\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
                html += '       Delete the Forest Pending Emails';
                html += '   </div>';
                html += '   <br /><br />';
                html += '   <div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em; font-weight: bold;" onclick="$(\'#divDeleteForestPendingEmailsDialog\').dialog(\'close\');">';
                html += '       Cancel';
                html += '   </div>';
                html += '   <br /><br />';
                html += '</div>';

                html += '<div style="display:none;" id="divDeletePendingEmailsDialog">';
                html += '   <table style="width:100%;">';
                html += '       <tr>';
                html += '           <td style="width:90%;">';
                html += '               <span id="spanDeletePendingEmailsDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">Delete Emails</span>';
                html += '           </td>';
                html += '           <td style="width:9%;"></td>';
                html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
                html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divDeletePendingEmailsDialog\').dialog(\'close\');">X</span>';
                html += '           </td>';
                html += '       </tr>';
                html += '   </table>';
                html += '   <br /><br />';
                html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                html += '   <span id="spanDeletePendingEmailsDialogContentText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;">';
                html += '[spanDeletePendingEmailsDialogContentText]';
                html += '   </span>';
                html += '   <br /><br /><br />';
                html += '   <div id="divDeleteThePendingEmails" class="divSignInButton" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'deleteSelectedPendingEmails\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
                html += '       Delete the Pending Emails';
                html += '   </div>';
                html += '   <br /><br />';
                html += '   <div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em; font-weight: bold;" onclick="$(\'#divDeletePendingEmailsDialog\').dialog(\'close\');">';
                html += '       Cancel';
                html += '   </div>';
                html += '   <br /><br />';
                html += '</div>';

                html += '<div style="display:none;" id="divDeleteSentEmailsDialog">';
                html += '   <table style="width:100%;">';
                html += '       <tr>';
                html += '           <td style="width:90%;">';
                html += '               <span id="spanDeleteSentEmailsDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">Delete Emails</span>';
                html += '           </td>';
                html += '           <td style="width:9%;"></td>';
                html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
                html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divDeleteSentEmailsDialog\').dialog(\'close\');">X</span>';
                html += '           </td>';
                html += '       </tr>';
                html += '   </table>';
                html += '   <br /><br />';
                html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                html += '   <span id="spanDeleteSentEmailsDialogContentText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;">';
                html += '[spanDeleteSentEmailsDialogContentText]';
                html += '   </span>';
                html += '   <br /><br /><br />';
                //html += '   <div id="divDeleteTheSentEmails" class="divSignInButton" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'deleteSelectedSentEmails\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
                html += '   <div id="divDeleteTheSentEmails" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
                html += '       Delete the Sent Emails';
                html += '   </div>';
                html += '   <br /><br />';
                html += '   <div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em; font-weight: bold;" onclick="$(\'#divDeleteSentEmailsDialog\').dialog(\'close\');">';
                html += '       Cancel';
                html += '   </div>';
                html += '   <br /><br />';
                html += '</div>';

                html += '<div style="display:none;" id="divDeleteErrorsAndSuggestionsDialog">';
                html += '   <table style="width:100%;">';
                html += '       <tr>';
                html += '           <td style="width:90%;">';
                html += '               <span id="spanDeleteErrorsAndSuggestionsDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">Delete Errors and Suggestions</span>';
                html += '           </td>';
                html += '           <td style="width:9%;"></td>';
                html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
                html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divDeleteErrorsAndSuggestionsDialog\').dialog(\'close\');">X</span>';
                html += '           </td>';
                html += '       </tr>';
                html += '   </table>';
                html += '   <br /><br />';
                html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                html += '   <span id="spanDeleteErrorsAndSuggestionsDialogContentText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;">';
                html += '[spanDeleteErrorsAndSuggestionsDialogContentText]';
                html += '   </span>';
                html += '   <br /><br /><br />';
                html += '   <div class="divSignInButton" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'deleteSelectedErrorsAndSuggestions\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
                html += '       Delete the Errors and Suggestions';
                html += '   </div>';
                html += '   <br /><br />';
                html += '   <div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em; font-weight: bold;" onclick="$(\'#divDeleteErrorsAndSuggestionsDialog\').dialog(\'close\');">';
                html += '       Cancel';
                html += '   </div>';
                html += '   <br /><br />';
                html += '</div>';

                // 3 column table
                html += '<table style="border:3px solid green;">';
                html += '   <tr>';
                html += '       <td style="width:10%;vertical-align:top;">'; // leftmost column
                // Collapsable table
                html += '           <table style="border:2px solid blue;">';

                // 8-31-2021
                html += '               <tr>';
                html += '                   <td onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'expandOrCollapseForestPendingEmails\');" style="background-color:lightskyblue;white-space:nowrap;cursor:pointer;" >';
                html += '                       <img title="collapse" id="emailSectionImage_ForestPendingEmails" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="images/drawer-open.png">';
                html += '                       ✉  Forest Pending';
                html += '                   </td>';
                html += '               </tr>';
                html += '               <tr id="trEmailSection_ForestPendingEmails">';
                html += '                   <td>';
                html += '                       <div id="divForestPendingEmailOrgsList"></div>';
                html += '                   </td>';
                html += '               </tr>';



                html += '               <tr>';
                html += '                   <td onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'expandOrCollapsePendingEmails\');" style="background-color:lightskyblue;white-space:nowrap;cursor:pointer;" >';
                html += '                       <img title="collapse" id="emailSectionImage_PendingEmails" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="images/drawer-open.png">';
                html += '                       ✉  Pending';
                html += '                   </td>';
                html += '               </tr>';
                html += '               <tr id="trEmailSection_PendingEmails">';
                html += '                   <td>';
                html += '                       <div id="divPendingEmailOrgsList">[divPendingEmailOrgsList]</div>';
                html += '                   </td>';
                html += '               </tr>';
                html += '               <tr>';
                html += '                   <td onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'expandOrCollapseSentEmails\');" style="font-size:16px;white-space:nowrap;cursor:pointer;">';
                html += '                       <img title="collapse" id="emailSectionImage_SentEmails" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="images/drawer-open.png">';
                html += '                       ✉ Sent';
                html += '                   </td>';
                html += '               </tr>';
                html += '               <tr id="trEmailSection_SentEmails" style="display:none;">';
                html += '                   <td>';
                html += '                       <div id="divSentEmailOrgsList">[divSentEmailOrgsList]</div>';
                html += '                   </td>';
                html += '               </tr>';
                html += '               <tr>';
                html += '                   <td onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'expandOrCollapseErrorsAndSuggestions\');" style="font-size:16px;white-space:nowrap;cursor:pointer;">';
                html += '                       <img title="collapse" id="emailSectionImage_ErrorsAndSuggestions" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="images/drawer-open.png">';
                html += '                       ✉ Errors & Suggestions';
                html += '                   </td>';
                html += '               </tr>';
                html += '               <tr id="trEmailSection_ErrorsAndSuggestions" style="display:none;">';
                html += '                   <td>';
                html += '                       <div id="divErrorsAndSuggestionsOrgsList">[divErrorsAndSuggestionsOrgsList]</div>';
                html += '                   </td>';
                html += '               </tr>';

                html += '               <tr>';
                html += '                   <td>';
                html += '                       <div class="spanButton" id="divWebServiceTest" style="cursor:pointer;" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'webServiceTest\');">Test the Web Service</div>';
                html += '                   </td>';
                html += '               </tr>';

                html += '           </table>';
                html += '       </td>';

                html += '       <td style="width:25%;vertical-align:top;">'; // middle column
                html += '           <table style="width:100%;">';
                html += '                   <tr style="font-size:10pt;font-weight:normal;color:black;">';
                html += '                       <td style="vertical-align:top;">';
                html += '                       </td>';
                html += '                       <td colspan="4" style="text-align:left;"><span id="spanSelectedEmailType_Title" style="font-size:13pt;font-weight:bold;">[spanSelectedEmailType_Title]</span></td>';
                html += '                   </tr>';
                html += '                   <tr>';
                html += '                       <td colspan="5" style="vertical-align:top;">';
                html += '                           <div style="height:600px;overflow-y: scroll;" onscroll="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'sentEmail_OnScroll\', this);">';
                html += '                               <span id="spanEmailPicker"></span>';
                html += '                           </div>';
                html += '                       </td>';
                html += '                   </tr>';
                html += '           </table>';
                html += '       </td>';

                html += '       <td style="width:97%;vertical-align:top;">'; // rightmost column
                html += '           <table>';
                html += '               <tr>';
                html += '                   <td style="vertical-align:top;">';
                //html += '                       <div id="displayedemaildetails" style="display:none;" bwPendingEmailId="" bwSentEmailId="" bwerrororsuggestionid=""></div>'; // This is where we look when we want to know the type and GUID of the displayed email!
                html += '                       <div id="displayedemaildetails" bwPendingEmailId="" bwSentEmailId="" bwerrororsuggestionid=""></div>'; // This is where we look when we want to know the type and GUID of the displayed email!

                //html += '                       <div class="spanButton" style="width:100px;text-align:right;" title="Click to send this email now!" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'sendEmailNow\');">';
                //html += '                           ✉&nbsp;Send Now > xcx2';
                //html += '                       </div>';
                html += '                       <span id="spanSelectedEmail"></span>';
                html += '                   </td>';
                html += '               </tr>';
                html += '           </table>';
                html += '       </td>';

                html += '   </tr>';
                html += '</table>';

                // Render the html.
                thiz.element.html(html);

                thiz.expandOrCollapsePendingEmails(); // This starts the thing with the Pending Emails section expanded.

            }

            console.log('In bwEmailMonitor_Admin._create(). Printing has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwEmailMonitor_Admin: CANNOT INITIALIZE THE WIDGET</span>';
            html += '<br />';
            html += '<span style="">Exception in bwEmailMonitor_Admin.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwEmailMonitor_Admin")
            .text("");
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
                            html += '                   <div class="spanButton" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'displayForestPendingEmails\', \'' + 'all' + '\');" style="text-align:left;font-size:14px;white-space:nowrap;cursor:pointer;padding:20px 20px 20px 20px;" title="">';
                            html += '                       &nbsp;&nbsp;&nbsp;&nbsp;' + 'ADMIN/ALL';
                            html += '                   </div>';
                            if (!data.length || data.length == 0) {
                                html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
                                html += '  There are no forest pending emails for any orgs.';
                                html += '<span>';
                            } else {
                                for (var i = 0; i < data.length; i++) {
                                    html += '                   <div class="spanButton" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'displayForestPendingEmails\', \'' + data[i].bwWorkflowAppId + '\');" style="text-align:left;font-size:14px;white-space:nowrap;cursor:pointer;padding:20px 20px 20px 20px;" title="' + 'Owner: ' + data[i].bwTenantOwnerFriendlyName + ' (' + data[i].bwTenantOwnerEmail + ')' + '">';
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
                            html += '                   <div class="spanButton" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'displayPendingEmails\', \'' + 'all' + '\');" style="text-align:left;font-size:14px;white-space:nowrap;cursor:pointer;padding:20px 20px 20px 20px;" title="">';
                            html += '                       &nbsp;&nbsp;&nbsp;&nbsp;' + 'ADMIN/ALL';
                            html += '                   </div>';
                            if (!data.length || data.length == 0) {
                                html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
                                html += '  There are no pending emails for any orgs.';
                                html += '<span>';
                            } else {
                                for (var i = 0; i < data.length; i++) {
                                    html += '                   <div class="spanButton" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'displayPendingEmails\', \'' + data[i].bwWorkflowAppId + '\');" style="text-align:left;font-size:14px;white-space:nowrap;cursor:pointer;padding:20px 20px 20px 20px;" title="' + 'Owner: ' + data[i].bwTenantOwnerFriendlyName + ' (' + data[i].bwTenantOwnerEmail + ')' + '">';
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
                            html += '                   <div class="spanButton" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'displaySentEmails\', \'' + 'all' + '\');" style="text-align:left;font-size:14px;white-space:nowrap;cursor:pointer;padding:20px 20px 20px 20px;" title="">';
                            html += '                       &nbsp;&nbsp;&nbsp;&nbsp;' + 'ADMIN/ALL';
                            html += '                   </div>';
                            //if (!data || !data.length || (data.length == 0)) {
                            if (!(data && data.length && (data.length > 0))) {
                                html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
                                html += '  There are no sent emails for any orgs.';
                                html += '<span>';
                            } else {
                                for (var i = 0; i < data.length; i++) {
                                    html += '                   <div class="spanButton" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'displaySentEmails\', \'' + data[i].bwWorkflowAppId + '\');" style="text-align:left;font-size:14px;white-space:nowrap;cursor:pointer;padding:20px 20px 20px 20px;" title="' + 'Owner: ' + data[i].bwTenantOwnerFriendlyName + ' (' + data[i].bwTenantOwnerEmail + ')' + '">';
                                    html += '                       &nbsp;&nbsp;&nbsp;&nbsp;' + data[i].bwWorkflowAppTitle;
                                    html += '                   </div>';
                                }
                            }

                            // Render the html.
                            $(thiz.element).find('#divSentEmailOrgsList')[0].innerHTML = html;

                        } catch (e) {
                            console.log('Exception in bwEmailMonitor_Admin.js.expandOrCollapseSentEmails():1: ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in bwEmailMonitor_Admin.js.expandOrCollapseSentEmails():1: ' + e.message + ', ' + e.stack);
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        console.log('Error in bwEmailMonitor_Admin.js.expandOrCollapseSentEmails():' + errorCode + ', ' + errorMessage);
                        displayAlertDialog('Error in bwEmailMonitor_Admin.js.expandOrCollapseSentEmails():' + errorCode + ', ' + errorMessage);
                    }
                });
            }
        } catch (e) {
            console.log('Exception in bwEmailMonitor_Admin.js.expandOrCollapseSentEmails(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwEmailMonitor_Admin.js.expandOrCollapseSentEmails(): ' + e.message + ', ' + e.stack);
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
                            html += '                   <div class="spanButton" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'displayErrorsAndSuggestions\', \'' + 'all' + '\');" style="text-align:left;font-size:14px;white-space:nowrap;cursor:pointer;padding:20px 20px 20px 20px;" title="">';
                            html += '                       &nbsp;&nbsp;&nbsp;&nbsp;' + 'ADMIN/ALL';
                            html += '                   </div>';
                            if (!data.length || data.length == 0) {
                                html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
                                html += '  There are no errors or suggestions for any orgs.';
                                html += '<span>';
                            } else {
                                for (var i = 0; i < data.length; i++) {
                                    html += '                   <div class="spanButton" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'displayErrorsAndSuggestions\', \'' + data[i].bwWorkflowAppId + '\');" style="text-align:left;font-size:14px;white-space:nowrap;cursor:pointer;padding:20px 20px 20px 20px;" title="' + 'Owner: ' + data[i].bwTenantOwnerFriendlyName + ' (' + data[i].bwTenantOwnerEmail + ')' + '">';
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
                            debugger;
                            if (!data.length || data.length == 0) {
                                // Do nothing, we must be displaying all of the data.
                            } else {
                                var html = '';
                                for (var i = 0; i < data.length; i++) {
                                    html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'viewSentEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwSentEmailId + '\');" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
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

                html += '<input type="checkbox" id="checkboxToggleForestPendingEmailCheckboxes" onchange="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'toggleForestPendingEmailCheckboxes\', this);" />';
                html += '<span style="padding: 4px 4px 4px 4px;border:1px solid lightblue;cursor:pointer;" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'cmdDisplayDeleteForestPendingEmailsDialog\');">';
                html += '   <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png">&nbsp;Delete';
                html += '</span>';
                html += '<br />';
                html += '✉ Forest Pending Email(s)';
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
                                html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'viewForestPendingEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwPendingEmailId + '\');" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
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
                            html += '                       <div class="spanButton" style="width:100px;text-align:right;" title="Click to send this email now!" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'sendForestPendingEmailNow\');">';
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
    displayPendingEmails: function (bwWorkflowAppId) { // Accepts "all" as a value for bwWorkflowAppId. This is for the forest administrator.
        try {
            console.log('In displayPendingEmails(). bwWorkflowAppId: ' + bwWorkflowAppId);
            var thiz = this;

            //if (!bwWorkflowAppId) {
            //    alert('Error in bwEmailMonitor_Admin.js.displayPendingEmails(). Invalid value for bwWorkflowAppId: ' + bwWorkflowAppId);
            //} else {
                var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                //var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
                //var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

                if (bwWorkflowAppId != 'all') {
                    bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                }

                $('#spanSelectedEmailSubject').html('');

                try {
                    var html = '';

                    //// Display the top buttons.
                    //html += '                           <span style="padding: 4px 4px 4px 4px;border:1px solid lightblue;cursor:pointer;" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'cmdDisplayDeletePendingEmailsDialog\');">';
                    //html += '                               <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png">&nbsp;Delete';
                    //html += '                           </span>';
                    //html += '&nbsp;&nbsp;';
                    //html += '                           <span style="padding: 4px 4px 4px 4px;border:1px solid lightblue;cursor:pointer;" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'cmdDisplayDeletePendingEmailsDialog\', \'emptyfolder\', \'' + bwWorkflowAppId + '\');">';
                    //html += '                               <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png">&nbsp;Empty folder xcx145';
                    //html += '                           </span>';
                    //$(thiz.element).find('#spanSelectedEmailType_TopButtons')[0].innerHTML = html; //'Pending Email';

                    //// Display the radio button and the title.
                    //html = '';
                    //html += '<input type="checkbox" id="checkboxTogglePendingEmailCheckboxes" onchange="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'togglePendingEmailCheckboxes\', this);" />&nbsp;&nbsp;';
                    //html += '✉ Pending email(s)';
                    //$(thiz.element).find('#spanSelectedEmailType_Title')[0].innerHTML = html; //'Pending Email';

                    html += '<input type="checkbox" id="checkboxTogglePendingEmailCheckboxes" onchange="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'toggleForestPendingEmailCheckboxesxx\', this);" />';
                    html += '<span style="padding: 4px 4px 4px 4px;border:1px solid lightblue;cursor:pointer;" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'cmdDisplayDeletePendingEmailsDialog\');">';
                    html += '   <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png">&nbsp;Delete';
                    html += '</span>';
                    html += '<br />';
                    html += '✉ Pending email(s)';
                    $(thiz.element).find('#spanSelectedEmailType_Title')[0].innerHTML = html; //'Pending Email';

                    // Make this button appear selected.
                    $(thiz.element).find('#spanDisplaySentEmailButton').removeClass('bwEmailMonitor_Admin_LeftMenuButton_Selected').addClass('bwEmailMonitor_Admin_LeftMenuButton');
                    $(thiz.element).find('#spanDisplayPendingEmailButton').removeClass('bwEmailMonitor_Admin_LeftMenuButton').addClass('bwEmailMonitor_Admin_LeftMenuButton_Selected');


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
                                        html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'viewPendingEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwPendingEmailId + '\');" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
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
                                    html += '                       <div class="spanButton" style="width:100px;text-align:right;" title="Click to send this email now!" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'sendPendingEmailNow\');">';
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
                                        html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'viewPendingEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwPendingEmailId + '\');" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
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
                                    html += '                       <div class="spanButton" style="width:100px;text-align:right;" title="Click to send this email now!" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'sendPendingEmailNow\');">';
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
    displaySentEmails: function (bwWorkflowAppId) {
        try {
            console.log('In displaySentEmails(). bwWorkflowAppId: ' + bwWorkflowAppId);
            var thiz = this;

            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            //var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            //var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            if (bwWorkflowAppId != 'all') {
                bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            }

            $('#spanSelectedEmailSubject').html('');

            //var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            

            this.options.pagingPage_SentEmail = 0; // If we want items to display properly, these need to be reset/set back to the beginning here.
            //this.options.pagingLimit_SentEmail = 20;

            try {
                //var parms = {
                //    bwWorkflowAppId: bwWorkflowAppId,
                //    action: 'emptyfolder'
                //}
                var html = '';

                //// Display the top buttons.
                //html += '                           <span style="padding: 4px 4px 4px 4px;border:1px solid lightblue;cursor:pointer;" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'cmdDisplayDeleteSentEmailsDialog\');">';
                //html += '                               <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png">&nbsp;Delete xcx2';
                //html += '                           </span>';
                //html += '&nbsp;&nbsp;';
                //html += '                           <span style="padding: 4px 4px 4px 4px;border:1px solid lightblue;cursor:pointer;" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'cmdDisplayDeleteSentEmailsDialog\', \'emptyfolder\', \'' + workflowAppId + '\');">';
                //html += '                               <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png">&nbsp;Empty folder xcx1';
                //html += '                           </span>';
                //$(thiz.element).find('#spanSelectedEmailType_TopButtons')[0].innerHTML = html; //'Pending Email';

                //// Display the radio button and the title.
                //html = '';
                //html += '<input type="checkbox" id="checkboxToggleSentEmailCheckboxes" onchange="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'toggleSentEmailCheckboxes\', this);" />&nbsp;&nbsp;';
                //html += '✉ Sent email(s)';
                //$(thiz.element).find('#spanSelectedEmailType_Title')[0].innerHTML = html; //'Sent Email';

                html += '<input type="checkbox" id="checkboxToggleSentEmailCheckboxes" onchange="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'toggleForestPendingEmailCheckboxesxx\', this);" />';
                html += '<span style="padding: 4px 4px 4px 4px;border:1px solid lightblue;cursor:pointer;" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'cmdDisplayDeleteSentEmailsDialog\');">';
                html += '   <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png">&nbsp;Delete';
                html += '</span>';
                html += '<br />';
                html += '✉ Sent email(s)';
                $(thiz.element).find('#spanSelectedEmailType_Title')[0].innerHTML = html; //'Pending Email';

                // Make this button appear selected.
                $(thiz.element).find('#spanDisplaySentEmailButton').removeClass('bwEmailMonitor_Admin_LeftMenuButton').addClass('bwEmailMonitor_Admin_LeftMenuButton_Selected');
                $(thiz.element).find('#spanDisplayPendingEmailButton').removeClass('bwEmailMonitor_Admin_LeftMenuButton_Selected').addClass('bwEmailMonitor_Admin_LeftMenuButton');


                //$(thiz.element).find('#tdDisplayPendingEmailButton')[0].style.backgroundColor = 'white';
                //$(thiz.element).find('#spanDisplaySentEmailButton')[0].style.backgroundColor = 'lightskyblue';

                //$(thiz.element).find('#spanDisplayErrorsAndSuggestionsButton')[0].style.backgroundColor = 'white';
            } catch (e) { }

            // Clear these in the beginning, because it may take a few seconds to re-populate, and this gives the user some visual feedback that something is going on.
            $(thiz.element).find('#spanEmailPicker')[0].innerHTML = '';
            $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = '';

            if (this.options.backendAdministrationMode == true) {
                debugger;
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
                            debugger; // In displaySentEmails().
                            var html = '';
                            if (!data.length || data.length == 0) {
                                html += '<span style="font-size:15pt;font-weight:normal;color:black;">';
                                html += '  There are no sent emails.';
                                html += '<span>';
                                $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;
                                $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = '';
                            } else {
                                html += '<table id="tableSentEmail1" bwworkflowappid="' + bwWorkflowAppId + '" >';

                                for (var i = 0; i < data.length; i++) {
                                    //html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
                                    html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'viewSentEmail\', \'' + 'btnEditRaciRoles_' + 'data[i].bwParticipantId' + '\', \'' + 'data[i].bwParticipantId' + '\', \'' + 'data[i].bwParticipantFriendlyName' + '\', \'' + 'data[i].bwParticipantEmail' + '\', \'' + data[i].bwEmailId + '\');" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + 'data[i].bwParticipantId' + '\', \'' + 'data[i].bwParticipantId' + '\');">';

                                    html += '    <td style="vertical-align:top;"><input type="checkbox" class="sentEmailCheckbox" bwsentemailid="' + data[i].bwEmailId + '" /></td>';
                                    //debugger;
                                    //var timestamp = getFriendlyDateAndTime(data[i].Timestamp);
                                    //html += '    <td style="white-space:nowrap;">' + timestamp + '</td>';
                                    //html += '    <td>' + data[i].ToParticipantEmail + '</td>';
                                    //html += '    <td>' + data[i].Subject + '</td>'; // html += '    <td>' + data[i].FromEmailAddress + '</td>';
                                    //html += '    <td><input type="button" bwpendingemailid="xxpeid"' + data[i].EmailLink + '" value="View" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'viewPendingEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwPendingEmailId + '\');" /></td>';
                                    html += '    <td colspan="4" style="border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px;">';
                                    //debugger; // RelatedRequestId	ad19f2b8-707f-40ad-8228-a07d55a1ddac
                                    html += '<span style="font-weight:bold;color:black;">' + data[i].to + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';


                                    //html += '<span style="font-weight:normal;color:tomato;">' + timestamp + '</span>';
                                    // 2-3-2022
                                    var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(data[i].timestamp);
                                    html += '<span style="font-weight:normal;color:tomato;">' + timestamp4 + '</span>';


                                    html += '       <br />';
                                    //debugger;
                                    //html += 'RelatedRequestId: ' + data[i].RelatedRequestId + '</span></span>';
                                    html += '</span>';
                                    //html += '       <br />';

                                    try {
                                        html += '<span style="font-weight:lighter;color:#95b1d3;">' + data[i].subject.substring(0, 55) + ' ...</span>';
                                    } catch (e) {
                                        html += '<span style="font-weight:lighter;color:#95b1d3;">' + 'error_xcx34325' + ' ...</span>';
                                    }
                                    
                                    html += '       <br />';

                                    //if (bwWorkflowAppId == 'all') { // This is for the forest administrator.
                                    html += '<span style="font-weight:normal;color:lightgray;">Organization: [' + 'data[i].bwWorkflowAppId' + ']</span>';
                                    html += '       <br />';
                                    //}

                                    //var bodyTextStartIndex = data[i].Body.indexOf('>');
                                    //var bodyTextEndIndex = data[i].Body.substring(bodyTextStartIndex).indexOf('<') + 1;
                                    //var bodyTextEndIndex2 = data[i].Body.substring(bodyTextEndIndex).indexOf('<') + 1;
                                    //var bodyText = data[i].Body.substring(bodyTextEndIndex, bodyTextEndIndex2);
                                    //html += '<span style="color:grey;">' + bodyText + ' ...</span>'; //  we have to do this because i we render the html it affect s the whole display in an unpredictable manner!!!
                                    //html += '       <br />';

                                    html += '   </td>';

                                    html += '  </tr>';
                                }
                                html += '</table>';

                                $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;

                                html = '';
                                html += '<div style="height:25px;">&nbsp;</div>';
                                //html += '                       <div class="spanButton" style="width:100px;text-align:right;" title="Click to send this email now!" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'sendEmailNow\');">';
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


                                thiz.viewSentEmail('btnEditRaciRoles_undefined', 'undefined', 'undefined', 'undefined', data[0].bwSentEmailId);


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
            } else {



                if (this.options.OnlyDisplayEmailsForCurrentParticipant == true) {

                    $.ajax({
                        url: webserviceurl + "/bwparticipantsentemail/" + bwWorkflowAppId + "/" + participantId, // bwparticipantpendingemail // bwwebappsentemail
                        type: "GET",
                        contentType: 'application/json',
                        success: function (data) {
                            try {
                                var html = '';

                                if (!data.length || data.length == 0) {
                                    html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
                                    html += '  There are no sent emails.';
                                    html += '<span>';
                                    $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;
                                    $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = '';
                                } else {

                                    html += '<table>';

                                    for (var i = 0; i < data.length; i++) {
                                        //html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
                                        html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'viewSentEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwSentEmailId + '\');" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
                                        //debugger; // xcx999999
                                        html += '    <td style="vertical-align:top;"><input type="checkbox" class="sentEmailCheckbox" bwsentemailid="' + data[i].bwSentEmailId + '" /></td>';
                                        //debugger;
                                        //var timestamp = getFriendlyDateAndTime(data[i].Timestamp);
                                        //html += '    <td style="white-space:nowrap;">' + timestamp + '</td>';
                                        //html += '    <td>' + data[i].ToParticipantEmail + '</td>';
                                        //html += '    <td>' + data[i].Subject + '</td>'; // html += '    <td>' + data[i].FromEmailAddress + '</td>';
                                        //html += '    <td><input type="button" bwpendingemailid="xxpeid"' + data[i].EmailLink + '" value="View" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'viewPendingEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwPendingEmailId + '\');" /></td>';
                                        html += '    <td colspan="4" style="border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px;">';
                                        //debugger; // RelatedRequestId	ad19f2b8-707f-40ad-8228-a07d55a1ddac
                                        html += '<span style="font-weight:bold;color:black;">' + data[i].ToParticipantFriendlyName + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';


                                        //html += '<span style="font-weight:normal;color:tomato;">' + timestamp + '</span>';
                                        // 2-3-2022
                                        var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(data[i].Timestamp);
                                        html += '<span style="font-weight:normal;color:tomato;">' + timestamp4 + '</span>';



                                        html += '       <br />';
                                        //debugger;
                                        //html += 'RelatedRequestId: ' + data[i].RelatedRequestId + '</span></span>';
                                        html += '</span>';
                                        //html += '       <br />';
                                        html += '<span style="font-weight:lighter;color:#95b1d3;">' + data[i].Subject.substring(0, 55) + ' ...</span>';
                                        html += '       <br />';

                                        //if (bwWorkflowAppId == 'all') { // This is for the forest administrator.
                                        html += '<span style="font-weight:normal;color:lightgray;">Organization: [' + data[i].bwWorkflowAppId + ']</span>';
                                        html += '       <br />';
                                        //}

                                        //var bodyTextStartIndex = data[i].Body.indexOf('>');
                                        //var bodyTextEndIndex = data[i].Body.substring(bodyTextStartIndex).indexOf('<') + 1;
                                        //var bodyTextEndIndex2 = data[i].Body.substring(bodyTextEndIndex).indexOf('<') + 1;
                                        //var bodyText = data[i].Body.substring(bodyTextEndIndex, bodyTextEndIndex2);
                                        //html += '<span style="color:grey;">' + bodyText + ' ...</span>'; //  we have to do this because i we render the html it affect s the whole display in an unpredictable manner!!!
                                        //html += '       <br />';

                                        html += '   </td>';

                                        html += '  </tr>';
                                    }
                                    html += '</table>';

                                    $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;

                                    // Quill subject editor.
                                    html = '';
                                    html += '<div style="height:25px;">&nbsp;</div>';
                                    //html += '                       <div class="spanButton" style="width:100px;text-align:right;" title="Click to send this email now!" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'sendEmailNow\');">';
                                    //html += '                           ✉&nbsp;Send Now > xcx5';
                                    //html += '                       </div>';
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
                                    html += 'Body: xcx4';
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


                                    thiz.viewSentEmail('btnEditRaciRoles_undefined', 'undefined', 'undefined', 'undefined', data[0].bwSentEmailId);

                                }







                            } catch (e) {
                                console.log('Exception in displaySentEmails(): ' + e.message + ', ' + e.stack);
                                displayAlertDialog('Exception in displaySentEmails(): ' + e.message + ', ' + e.stack);
                            }
                        },
                        error: function (data, errorCode, errorMessage) {
                            displayAlertDialog('Error in bwEmailMonitor_Admin.js.displaySentEmails():xcx1: ' + errorCode + ', ' + errorMessage);
                        }
                    });







                } else {
                    $.ajax({
                        url: webserviceurl + "/bwwebappsentemail/" + bwWorkflowAppId,
                        type: "DELETE",
                        contentType: 'application/json',
                        success: function (data) {
                            try {
                                var html = '';

                                if (!data.length || data.length == 0) {
                                    html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
                                    html += '  There are no sent emails.';
                                    html += '<span>';
                                    $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;
                                    $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = '';
                                } else {

                                    html += '<table>';

                                    for (var i = 0; i < data.length; i++) {
                                        //html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
                                        html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'viewSentEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwSentEmailId + '\');" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
                                        //debugger; // xcx999999
                                        html += '    <td style="vertical-align:top;"><input type="checkbox" class="sentEmailCheckbox" bwsentemailid="' + data[i].bwSentEmailId + '" /></td>';
                                        //debugger;
                                        //var timestamp = getFriendlyDateAndTime(data[i].Timestamp);
                                        //html += '    <td style="white-space:nowrap;">' + timestamp + '</td>';
                                        //html += '    <td>' + data[i].ToParticipantEmail + '</td>';
                                        //html += '    <td>' + data[i].Subject + '</td>'; // html += '    <td>' + data[i].FromEmailAddress + '</td>';
                                        //html += '    <td><input type="button" bwpendingemailid="xxpeid"' + data[i].EmailLink + '" value="View" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'viewPendingEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwPendingEmailId + '\');" /></td>';
                                        html += '    <td colspan="4" style="border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px;">';
                                        //debugger; // RelatedRequestId	ad19f2b8-707f-40ad-8228-a07d55a1ddac
                                        html += '<span style="font-weight:bold;color:black;">' + data[i].ToParticipantFriendlyName + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';


                                        //html += '<span style="font-weight:normal;color:tomato;">' + timestamp + '</span>';
                                        // 2-3-2022
                                        var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(data[i].Timestamp);
                                        html += '<span style="font-weight:normal;color:tomato;">' + timestamp4 + '</span>';


                                        html += '       <br />';
                                        //debugger;
                                        //html += 'RelatedRequestId: ' + data[i].RelatedRequestId + '</span></span>';
                                        html += '</span>';
                                        //html += '       <br />';
                                        html += '<span style="font-weight:lighter;color:#95b1d3;">' + data[i].Subject.substring(0, 55) + ' ...</span>';
                                        html += '       <br />';

                                        //if (bwWorkflowAppId == 'all') { // This is for the forest administrator.
                                        html += '<span style="font-weight:normal;color:lightgray;">Organization: [' + data[i].bwWorkflowAppId + ']</span>';
                                        html += '       <br />';
                                        //}

                                        //var bodyTextStartIndex = data[i].Body.indexOf('>');
                                        //var bodyTextEndIndex = data[i].Body.substring(bodyTextStartIndex).indexOf('<') + 1;
                                        //var bodyTextEndIndex2 = data[i].Body.substring(bodyTextEndIndex).indexOf('<') + 1;
                                        //var bodyText = data[i].Body.substring(bodyTextEndIndex, bodyTextEndIndex2);
                                        //html += '<span style="color:grey;">' + bodyText + ' ...</span>'; //  we have to do this because i we render the html it affect s the whole display in an unpredictable manner!!!
                                        //html += '       <br />';

                                        html += '   </td>';

                                        html += '  </tr>';
                                    }
                                    html += '</table>';

                                    $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;

                                    // Quill subject editor.
                                    html = '';
                                    html += '<div style="height:25px;">&nbsp;</div>';
                                    //html += '                       <div class="spanButton" style="width:100px;text-align:right;" title="Click to send this email now!" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'sendEmailNow\');">';
                                    //html += '                           ✉&nbsp;Send Now > xcx5';
                                    //html += '                       </div>';
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
                                    html += 'Body: xcx4';
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


                                    thiz.viewSentEmail('btnEditRaciRoles_undefined', 'undefined', 'undefined', 'undefined', data[0].bwSentEmailId);

                                }







                            } catch (e) {
                                console.log('Exception in displaySentEmails(): ' + e.message + ', ' + e.stack);
                                displayAlertDialog('Exception in displaySentEmails(): ' + e.message + ', ' + e.stack);
                            }
                        },
                        error: function (data, errorCode, errorMessage) {
                            displayAlertDialog('Error in bwEmailMonitor_Admin.js.displaySentEmails():xcx2: ' + errorCode + ', ' + errorMessage);
                        }
                    });
                }

            }

        } catch (e) {
            console.log('Exception in displaySentEmails(): ' + e.message + ', ' + e.stack);
            alert('Exception in displaySentEmails(): ' + e.message + ', ' + e.stack);
        }
    },
    displayErrorsAndSuggestions: function (workflowAppId) {
        try {
            console.log('In displayErrorsAndSuggestions(). workflowAppId: ' + workflowAppId);
            var thiz = this;

            //var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            //if (bwWorkflowAppId) {
            //    alert('In displayErrorsAndSuggestions(' + bwWorkflowAppId + ').');
            //}
            try {
                var html = '';

                html += '<input type="checkbox" id="checkboxToggleErrorsAndSuggestionsCheckboxes" onchange="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'toggleErrorsAndSuggestionsCheckboxes\', this);" />';
                html += '<span style="padding: 4px 4px 4px 4px;border:1px solid lightblue;cursor:pointer;" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'cmdDisplayDeleteErrorsAndSuggestionsDialog\');">';
                html += '   <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png">&nbsp;Delete';
                html += '</span>';
                html += '<br />';
                html += '✉ Errors & Suggestions';
                $(thiz.element).find('#spanSelectedEmailType_Title')[0].innerHTML = html; //'Errors & Suggestions';

                $(thiz.element).find('#tdDisplayPendingEmailButton')[0].style.backgroundColor = 'white';
                $(thiz.element).find('#spanDisplaySentEmailButton')[0].style.backgroundColor = 'white';
                $(thiz.element).find('#spanDisplayErrorsAndSuggestionsButton')[0].style.backgroundColor = 'lightskyblue';
            } catch (e) { }
            $.ajax({
                url: this.options.operationUriPrefix + "_bw/bwwebapperrororsuggestion/" + workflowAppId,
                type: "DELETE",
                contentType: 'application/json',
                timeout: this.options.ajaxTimeout,
                success: function (data) {
                    try {
                        debugger;
                        var html = '';

                        if (!data.result.length || data.result.length == 0) {
                            html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
                            html += '  There are no reported errors or suggestions.';
                            html += '<span>';
                            $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;
                            $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = '';
                        } else {
                            html += '<table>';

                            for (var i = 0; i < data.result.length; i++) {
                                //debugger;
                                html += '  <tr ondblclick="$(\'.bwMonitoringTools2\').bwMonitoringTools2(\'displayEmailInDialog\', \'' + data.result[i].bwErrorOrSuggestionId + '\');" style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwMonitoringTools2\').bwMonitoringTools2(\'adminViewErrorOrSuggestion\', \'' + participantId + '\', \'' + participantFriendlyName + '\',\'' + participantEmail + '\',\'' + data.result[i].bwErrorOrSuggestionId + '\',\'' + data.result[i].bwWorkflowAppId + '\');">';
                                //html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" >';

                                html += '    <td style="vertical-align:top;"><input type="checkbox" class="pendingErrorOrSuggestionCheckbox" bwerrororsuggestionid="' + data.result[i].bwErrorOrSuggestionId + '" /></td>';
                                //debugger;
                                //var timestamp = getFriendlyDateAndTime(data.result[i].Created);
                                //html += '    <td style="white-space:nowrap;">' + timestamp + '</td>';
                                //html += '    <td>' + data[i].ToParticipantEmail + '</td>';
                                //html += '    <td>' + data[i].Subject + '</td>'; // html += '    <td>' + data[i].FromEmailAddress + '</td>';
                                //html += '    <td><input type="button" bwpendingemailid="xxpeid"' + data[i].EmailLink + '" value="View" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'adminViewPendingEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwPendingEmailId + '\');" /></td>';
                                html += '    <td colspan="4" style="border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px;" >';

                                if (data.result[i].Flagged) {
                                    //debugger;
                                    html += '<span style="font-weight:bold;color:black;width:100%;">' + data.result[i].CreatedByFriendlyName + '&nbsp;&nbsp;&nbsp;&nbsp;';
                                    html += '<span title="Flag this message..." style="font-size:13pt;width:100%;text-align:right;color:red;" onmouseover="this.style.color=\'aqua\';" onmouseout="this.style.color=\'red\';" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'flagThisMessage\', \'' + data.result[i].bwErrorOrSuggestionId + '\', true);">⚑</span>';
                                } else {
                                    //debugger;
                                    html += '<span style="font-weight:bold;color:black;width:100%;">' + data.result[i].CreatedByFriendlyName + '&nbsp;&nbsp;&nbsp;&nbsp;';
                                    html += '<span title="Flag this message..." style="font-size:13pt;width:100%;text-align:right;" onmouseover="this.style.color=\'aqua\';" onmouseout="this.style.color=\'black\';" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'flagThisMessage\', \'' + data.result[i].bwErrorOrSuggestionId + '\', false);">⚐</span>';
                                }
                                html += '   <br />';


                                //html += '   <span style="font-weight:normal;color:tomato;">' + timestamp + '</span>';
                                // 2-3-2022
                                var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(data.result[i].Created);
                                html += '<span style="font-weight:normal;color:tomato;">' + timestamp4 + '</span>';


                                html += '   <br />';
                                html += '</span>';

                                html += '<span style="font-weight:lighter;color:#95b1d3;">' + data.result[i].Description.substring(0, 55) + ' ...</span>';
                                html += '       <br />';




                                // 12-27-2021 put workflowAppId here...
                                debugger;
                                html += '<span style="font-weight:normal;color:lightgray;">Organization: [' + data.result[i].bwWorkflowAppId + ']</span>';
                                html += '       <br />';


                                //var bodyTextStartIndex = data[i].Body.indexOf('>');
                                //var bodyTextEndIndex = data[i].Body.substring(bodyTextStartIndex).indexOf('<') + 1;
                                //var bodyTextEndIndex2 = data[i].Body.substring(bodyTextEndIndex).indexOf('<') + 1;
                                //var bodyText = data[i].Body.substring(bodyTextEndIndex, bodyTextEndIndex2);
                                //html += '<span style="color:grey;">' + bodyText + ' ...</span>'; //  we have to do this because i we render the html it affect s the whole display in an unpredictable manner!!!
                                //html += '       <br />';

                                html += '   </td>';

                                html += '  </tr>';
                            }
                            html += '</table>';

                            $(thiz.element).find('#spanEmailPicker')[0].innerHTML = html;

                            html = '';
                            html += '<div style="height:25px;">&nbsp;</div>';
                            //html += '                       <div class="spanButton" style="width:100px;text-align:right;" title="Click to send this email now!" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'sendEmailNow\');">';
                            //html += '                           ✉&nbsp;Send Now > xcx6';
                            //html += '                       </div>';
                            html += '<span id="spanSelectedErrorsAndSuggestionsSubject" style="font-size:13pt;font-weight:bold;color:#95b1d3;"></span>';
                            html += '<br /><br />';
                            // Quill subject editor.
                            html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                            html += 'Error or suggestion:xcx3423426';
                            html += '</span>';



                            html += '<span title="print" class="printButton" style="font-size:18pt;cursor:pointer !important;" onclick="$(\'.bwPrintButton\').bwPrintButton(\'PrintErrorAndSuggestion\', \'quillConfigureErrorOrSuggestionDialog_Body\', \'quillConfigureNewUserErrorOrSuggestionDialog_Subject\');">';
                            html += '   <img src="/images/iosprinter_blue.png" style="width:50px;height:50px;cursor:pointer !important;">';
                            html += '</span>';




                            html += '<br />';
                            html += '   <div id="bwQuilltoolbarForErrorOrSuggestionSubject">';
                            html += '       <button id="btnQuill_InsertADataItemForErrorOrSuggestion" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
                            html += '   </div>';
                            //html += '   <div id="quillConfigureNewUserErrorOrSuggestionDialog_Subject" style="height:50px;"></div>'; // Quill.
                            html += '<input type="text" id="quillConfigureNewUserErrorOrSuggestionDialog_Subject" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;height:250px;">';

                            // Quill body editor.
                            html += '<br />';
                            html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                            html += 'Screenshot(s):';
                            html += '</span>';
                            html == '<br />';
                            html += '   <div id="bwQuilltoolbarErrorOrSuggestion">';
                            html += '       <button id="btnQuillErrorOrSuggestion_InsertADataItem" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
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
                            html += '   <div id="quillConfigureErrorOrSuggestionDialog_Body" style="height:800px;"></div>'; // Quill.
                            // Save button.
                            //html += '   <br />';
                            //html += '   <span id="spanConfigureEmailNotificationsDialogSaveButton">[spanConfigureEmailNotificationsDialogSaveButton]</span>'; // ☑ 
                            //html += '   <br /><br />';
                            // Preview/Edit button.
                            //html += '   <div id="divNewUserEmailEditor_PreviewAndEditButton" class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;"></div>';
                            //html += '   <br /><br />';



                            html += '<br />';
                            html += 'Console Log:';
                            html == '<br />';
                            html += '<div id="bwErrorOrSuggestion_ConsoleLog"></div>';







                            html += '</div>';


                            $(thiz.element).find('#spanSelectedEmail')[0].innerHTML = html;




                        }
                        //$('#spanErrorsOrSuggestions').append(html);
                        //$(thiz.element).find('#spanPendingEmails')[0].innerHTML = html;
                    } catch (e) {
                        console.log('Exception in cmdListErrorsOrSuggestions2(): ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in xx.js.cmdListErrorsOrSuggestions2():' + errorCode + ', ' + errorMessage);
                }
            });

        } catch (e) {
            console.log('Exception in displayErrorsAndSuggestions(): ' + e.message + ', ' + e.stack);
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
                        html += '<span style="color:black;">To:</span> ' + data[0].ToParticipantFriendlyName + ' (' + data[0].ToParticipantEmail + ')';
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

                        alert('xcx121254 SUMMERNOTE BODY ');




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
                        html += '<span style="color:black;">To:</span> ' + data[0].ToParticipantFriendlyName + ' (' + data[0].ToParticipantEmail + ')';
                        html += '<br />';


                        //html += '<span style="font-weight:normal;font-size:10pt;color:black;">' + timestamp + '</span>';
                        // 2-3-2022
                        var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(data[0].Timestamp);
                        html += '<span style="font-weight:normal;font-size:10pt;color:black;">' + timestamp4 + '</span>';


                        $(thiz.element).find('#spanSelectedEmailSubject')[0].innerHTML = html;

                    } catch (e) {
                        console.log('Exception in viewPendingEmail(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in viewPendingEmail(): ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in xx.js.viewPendingEmail():' + errorCode + ', ' + errorMessage);
                    displayAlertDialog('Error in xx.js.viewPendingEmail():' + errorCode + ', ' + errorMessage);
                }
            });
        } catch (e) {
            console.log('Exception in viewPendingEmail(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ': ' + e.message + ', ' + e.stack);
        }
    },
    viewSentEmail: function (originElementId, bwParticipantId, bwParticipantFriendlyName, bwParticipantEmail, bwEmailId) {
        try {
            console.log('In viewSentEmail(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ', bwEmailId: ' + bwEmailId);
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            if (this.options.backendAdministrationMode == true) {
                $.ajax({
                    url: webserviceurl + "/singlesentemail/" + bwEmailId,
                    type: "DELETE",
                    contentType: 'application/json',
                    success: function (data) {
                        try {
                            $(thiz.element).find('#displayedemaildetails')[0].setAttribute('bwSentEmailId', bwEmailId);

                            // Hook up this button event so that the user can insert data items into the email.
                            var customButton1 = $(thiz.element).find('#btnQuill_InsertADataItemForSubject')[0];
                            customButton1.addEventListener('click', function () {
                                thiz.displayEmailDataItemPickerDialog('subject');
                            });

                            $($(thiz.element).find('#quillConfigureNewUserEmailsDialog_Body')[0]).summernote({
                                placeholder: data[0].html, //'Hello stand alone ui',
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
                            var customButton = $(thiz.element).find('#btnQuill_InsertADataItem')[0]; //document.querySelector('#btnQuill_InsertADataItem'); //
                            customButton.addEventListener('click', function () {
                                console.log('In viewPendingEmail.quill.customButton.click().')
                                //console.log('btnQuill_InsertADataItem: This functionality is incomplete. Coming soon!');
                                //thiz.displayEmailDataItemPickerDialog('body');
                            });

                            var emailTemplateForSubject = data[0].subject; //thiz.options.CurrentEmailTemplate.EmailTemplate.Subject;
                            var emailTemplate = data[0].html; //thiz.options.CurrentEmailTemplate.EmailTemplate.Body;

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
                            //debugger;
                            //var toParticipantEmail = data[0].ToParticipantEmail.replace('<', '&lt;').replace('>', '&gt;');
                            html += '<span style="color:black;">To:</span> ' + data[0].to + ' (' + data[0].to + ')';
                            html += '<br />';


                            //html += '<span style="font-weight:normal;font-size:10pt;color:black;">' + timestamp + '</span>';
                            // 2-3-2022
                            var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(data[0].timestamp);
                            html += '<span style="font-weight:normal;font-size:10pt;color:black;">' + timestamp4 + '</span>';


                            $(thiz.element).find('#spanSelectedEmailSubject')[0].innerHTML = html;

                        } catch (e) {
                            console.log('Exception in viewSentEmail(): ' + e.message + ', ' + e.stack);
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        displayAlertDialog('Error in xx.js.viewSentEmail():' + errorCode + ', ' + errorMessage);
                    }
                });



            } else {
                $.ajax({
                    url: webserviceurl + "/bwwebappsentemail2/" + workflowAppId + '/' + bwEmailId,
                    type: "DELETE",
                    contentType: 'application/json',
                    success: function (data) {
                        try {
                            //debugger;
                            $(thiz.element).find('#displayedemaildetails')[0].setAttribute('bwSentEmailId', bwEmailId);
                            //$(thiz.element).find('#displayedemaildetails')[0].setAttribute('bwSentEmailId', 'xx');

                            // Display the email editor.
                            //thiz.options.quillSubjectEditor = new Quill($(thiz.element).find('#quillConfigureNewUserEmailsDialog_Subject')[0], { // 
                            //    modules: {
                            //        toolbar: '#bwQuilltoolbarForSubject'
                            //    },
                            //    //placeholder: 'The enhanced notification email editor functionality is coming soon...', 
                            //    theme: 'snow'
                            //});

                            // Hook up this button event so that the user can insert data items into the email.
                            var customButton1 = $(thiz.element).find('#btnQuill_InsertADataItemForSubject')[0]; //document.querySelector('#btnQuill_InsertADataItemForSubject'); //
                            customButton1.addEventListener('click', function () {
                                //console.log('btnQuill_InsertADataItem: This functionality is incomplete. Coming soon!');
                                thiz.displayEmailDataItemPickerDialog('subject');
                            });

                            //thiz.options.quill = new Quill($(thiz.element).find('#quillConfigureNewUserEmailsDialog_Body')[0], { // 
                            //    modules: {
                            //        toolbar: '#bwQuilltoolbar'
                            //    },
                            //    //placeholder: 'The enhanced notification email editor functionality is coming soon...', 
                            //    theme: 'snow'
                            //});

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

                            //thiz.options.quillSubjectEditor.on('text-change', function (delta, oldDelta, source) {
                            //    console.log('In viewPendingEmail.quillSubjectEditor.text-change(). xcx3')
                            //    //thiz.options.userHasMadeChangesToTheEmailTemplate = true;
                            //    //thiz.checkIfWeHaveToDisplayThePublishChangesButton();
                            //});

                            //thiz.options.quill.on('text-change', function (delta, oldDelta, source) {
                            //    console.log('In viewPendingEmail.quill.text-change(). xcx3')
                            //    //thiz.options.userHasMadeChangesToTheEmailTemplate = true;
                            //    //thiz.checkIfWeHaveToDisplayThePublishChangesButton();
                            //});

                            // Hook up this button event so that the user can insert data items into the email.
                            var customButton = $(thiz.element).find('#btnQuill_InsertADataItem')[0]; //document.querySelector('#btnQuill_InsertADataItem'); //
                            customButton.addEventListener('click', function () {
                                console.log('In viewPendingEmail.quill.customButton.click().')
                                //console.log('btnQuill_InsertADataItem: This functionality is incomplete. Coming soon!');
                                //thiz.displayEmailDataItemPickerDialog('body');
                            });

                            var emailTemplateForSubject = data[0].Subject; //thiz.options.CurrentEmailTemplate.EmailTemplate.Subject;
                            var emailTemplate = data[0].Body; //thiz.options.CurrentEmailTemplate.EmailTemplate.Body;

                            if (emailTemplateForSubject && emailTemplateForSubject != '') {
                                $(thiz.element).find('#quillConfigureNewUserEmailsDialog_Subject')[0].value = emailTemplateForSubject;
                            } else {
                                $(thiz.element).find('#quillConfigureNewUserEmailsDialog_Subject')[0].value = '';
                            }

                            if (emailTemplate && emailTemplate != '') {
                                $($(thiz.element).find('#quillConfigureNewUserEmailsDialog_Body')[0]).summernote('reset');
                                $($(thiz.element).find('#quillConfigureNewUserEmailsDialog_Body')[0]).summernote('pasteHTML', emailTemplate);
                            } else {
                                $($(thiz.element).find('#quillConfigureNewUserEmailsDialog_Body')[0]).summernote('reset');
                            }

                            //var timestamp = getFriendlyDateAndTime(data[0].Timestamp);
                            var html = '';
                            //debugger;
                            //var toParticipantEmail = data[0].ToParticipantEmail.replace('<', '&lt;').replace('>', '&gt;');
                            html += '<span style="color:black;">To:</span> ' + data[0].ToParticipantFriendlyName + ' (' + data[0].ToParticipantEmail + ')';
                            html += '<br />';


                            //html += '<span style="font-weight:normal;font-size:10pt;color:black;">' + timestamp + '</span>';
                            // 2-3-2022
                            var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(data[0].Timestamp);
                            html += '<span style="font-weight:normal;font-size:10pt;color:black;">' + timestamp4 + '</span>';


                            $(thiz.element).find('#spanSelectedEmailSubject')[0].innerHTML = html;

                        } catch (e) {
                            console.log('Exception in viewSentEmail(): ' + e.message + ', ' + e.stack);
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        displayAlertDialog('Error in xx.js.viewSentEmail():' + errorCode + ', ' + errorMessage);
                    }
                });
            }

        } catch (e) {
            console.log('Exception in viewSentEmail(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ': ' + e.message + ', ' + e.stack);
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
    deleteSelectedPendingEmails: function (instruction, bwWorkflowAppId) {
        try {
            debugger;
            //console.log('In deleteSelectedPendingEmails().');
            console.log('In deleteSelectedPendingEmails(). instruction: ' + instruction + ', bwWorkflowAppId: ' + bwWorkflowAppId);
            var thiz = this;
            var selectedPendingEmailIdsToDelete;
            if (instruction && instruction == 'emptyfolder') {
                selectedPendingEmailIdsToDelete = {
                    instruction: instruction,
                    bwWorkflowAppId: bwWorkflowAppId
                }
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
                PendingEmailIds: selectedPendingEmailIdsToDelete
            }
            //alert('Getting ready to delete ' + selectedPendingEmailIdsToDelete.length + ' pending emails. This action cannot be undone. This functionality is incomplete and needs further testing!!!!');
            $.ajax({
                url: this.options.operationUriPrefix + "_bw/deletependingemails", //odata/Roles",
                //dataType: "json",
                contentType: "application/json",
                type: "Post",
                data: JSON.stringify(json)
            }).done(function (result) {
                try {
                    //debugger;
                    console.log('In deleteSelectedPendingEmails(): Successfully updated DB.');

                    //debugger;
                    $('#divDeletePendingEmailsDialog').dialog('close');

                    thiz._create();

                } catch (e) {
                    console.log('Exception in deleteSelectedPendingEmails():2: ' + e.message + ', ' + e.stack);
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
        } catch (e) {
            console.log('Exception in deleteSelectedPendingEmails(): ' + e.message + ', ' + e.stack);
        }
    },
    deleteSelectedSentEmails: function (instruction, bwWorkflowAppId) {
        try {
            console.log('In deleteSelectedSentEmails(). instruction: ' + instruction + ', bwWorkflowAppId: ' + bwWorkflowAppId);
            var thiz = this;

            var selectedSentEmailIdsToDelete;
            if (instruction && instruction == 'emptyfolder') {
                selectedSentEmailIdsToDelete = {
                    instruction: instruction,
                    bwWorkflowAppId: bwWorkflowAppId
                }
            } else {
                selectedSentEmailIdsToDelete = [];
                var checkboxes = document.getElementsByClassName('sentEmailCheckbox');
                for (var i = 0; i < checkboxes.length; i++) {
                    if (checkboxes[i].checked == true) {
                        debugger;
                        var bwPendingEmailId = checkboxes[i].getAttribute('bwsentemailid');
                        selectedSentEmailIdsToDelete.push(bwPendingEmailId);
                    } else {
                        // do nothing.
                    }
                }
            }

            var json = {
                SentEmailIds: selectedSentEmailIdsToDelete
            }

            $.ajax({
                url: this.options.operationUriPrefix + "_bw/deletesentemails", //deletependingemails", 
                dataType: "json",
                contentType: "application/json",
                type: "Post",
                //timeout: this.options.ajaxTimeout,
                data: JSON.stringify(json)
            }).success(function (result) {
                try {
                    //debugger;
                    console.log('The emails have been deleted.');
                    $('#divDeleteSentEmailsDialog').dialog('close');
                    //alert('The emails have been deleted.'); // 

                    //cmdRefreshAdminPage(); // This is not efficient but it is effective.
                    thiz._create();

                } catch (e) {
                    console.log('Exception in deleteSelectedSentEmails():2: ' + e.message + ', ' + e.stack);
                }
            }).error(function (data) {
                //debugger;
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
        } catch (e) {
            console.log('Exception in deleteSelectedSentEmails(): ' + e.message + ', ' + e.stack);
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
    cmdDisplayDeletePendingEmailsDialog: function (instruction, bwWorkflowAppId) {
        try {
            console.log('In cmdDisplayDeletePendingEmailsDialog(). instruction: ' + instruction + ', bwWorkflowAppId: ' + bwWorkflowAppId);
            alert('In cmdDisplayDeletePendingEmailsDialog(). instruction: ' + instruction + ', bwWorkflowAppId: ' + bwWorkflowAppId);
            debugger;
            $("#divDeletePendingEmailsDialog").dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '500',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divDeletePendingEmailsDialog").dialog('close');
                    });
                },
                close: function () {
                    $('#divDeletePendingEmailsDialog').dialog('destroy');
                }
            });
            $("#divDeletePendingEmailsDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            var button = document.getElementById("divDeleteThePendingEmails");
            if (button.removeEventListener) {
                button.removeEventListener("click", null);
            } else if (x.detachEvent) {
                button.detachEvent("click", null);
            }


            if (instruction && instruction == 'emptyfolder') {
                // The user has chosen to empty the entire folder.
                var html = '';
                html += 'You have chosen to delete all pending emails. This action cannot be undone.';
                document.getElementById('spanDeletePendingEmailsDialogContentText').innerHTML = html;

                button.addEventListener('click', function () {
                    console.log('In cmdDisplayDeletePendingEmailsDialog.click().')
                    $('.bwEmailMonitor_Admin').bwEmailMonitor_Admin('deleteSelectedPendingEmails', 'emptyfolder', bwWorkflowAppId);
                });

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
                    document.getElementById('spanDeletePendingEmailsDialogContentText').innerHTML = html;
                } else {
                    var html = '';
                    html += 'You have chosen to delete ' + selectedEmails.length + ' pending emails. This action cannot be undone.';
                    document.getElementById('spanDeletePendingEmailsDialogContentText').innerHTML = html;
                }

                button.addEventListener('click', function () {
                    console.log('In cmdDisplayDeletePendingEmailsDialog.click().')
                    $('.bwEmailMonitor_Admin').bwEmailMonitor_Admin('deleteSelectedPendingEmails');
                });
            }

        } catch (e) {
            console.log('Exception in cmdDisplayDeletePendingEmailsDialog(): ' + e.message + ', ' + e.stack);
        }
    },
    cmdDisplayDeleteSentEmailsDialog: function (instruction, bwWorkflowAppId) {
        try {
            console.log('In cmdDisplayDeleteSentEmailsDialog().');

            $("#divDeleteSentEmailsDialog").dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '500',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divDeleteSentEmailsDialog").dialog('close');
                    });
                },
                close: function () {
                    $('#divDeleteSentEmailsDialog').dialog('destroy');
                }
            });
            $("#divDeleteSentEmailsDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            var button = document.getElementById("divDeleteTheSentEmails");
            if (button.removeEventListener) {
                button.removeEventListener("click", null);
            } else if (x.detachEvent) {
                button.detachEvent("click", null);
            }

            if (instruction && instruction == 'emptyfolder') {
                // The user has chosen to empty the entire folder.
                var html = '';
                html += 'You have chosen to delete all sent emails. This action cannot be undone.';
                document.getElementById('spanDeleteSentEmailsDialogContentText').innerHTML = html;

                button.addEventListener('click', function () {
                    console.log('In cmdDisplayDeleteSentEmailsDialog.click().')
                    $('.bwEmailMonitor_Admin').bwEmailMonitor_Admin('deleteSelectedSentEmails', 'emptyfolder', bwWorkflowAppId);
                });

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
                    document.getElementById('spanDeleteSentEmailsDialogContentText').innerHTML = html;
                } else {
                    var html = '';
                    html += 'You have chosen to delete ' + selectedEmails.length + ' sent emails. This action cannot be undone.';
                    document.getElementById('spanDeleteSentEmailsDialogContentText').innerHTML = html;
                }

                button.addEventListener('click', function () {
                    console.log('In cmdDisplayDeleteSentEmailsDialog.click().')
                    $('.bwEmailMonitor_Admin').bwEmailMonitor_Admin('deleteSelectedSentEmails');
                });

            }
        } catch (e) {
            console.log('Exception in bwMonitoringTools.cmdDisplayDeleteSentEmailsDialog(): ' + e.message + ', ' + e.stack);
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





    webServiceTest: function () {
        try {
            console.log('In webServiceTest().');
            var thiz = this;
            var json = {
                "UserID": "UserADNamexx",
                "PrivilegeName": "PrivilegeNamexx",
                "EventName": "EventNamexx"
            };
            var operationUri = this.options.operationUriPrefix + "_bw/iProcessSQLJob.svc/ExecJob1/ExecJob";
            $.ajax({
                url: operationUri,
                type: "POST",
                timeout: this.options.ajaxTimeout,
                data: json,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (result) {
                    try {
                        if (result.message != 'SUCCESS') {
                            thiz.displayAlertDialog(result.message + '<br /><br />Results:<br />' + result.result);
                        } else {
                            thiz.displayAlertDialog('The web service was connected to successfully.' + '<br /><br />Results:<br />' + result.result);
                        }
                    } catch (e) {
                        console.log('Exception in webServiceTest():1: ' + e.message + ', ' + e.stack);
                        thiz.displayAlertDialog('Exception in webServiceTest():1: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in webServiceTest(): ' + errorCode + ' ' + errorMessage);
                    displayAlertDialog('Error in webServiceTest(): ' + errorCode + ' ' + errorMessage);
                }
            });
        } catch (e) {
            console.log('Exception in webServiceTest(): ' + e.message + ', ' + e.stack);
            thiz.displayAlertDialog('Exception in webServiceTest(): ' + e.message + ', ' + e.stack);
        }
    },
















    //cmdListSentEmail3: function () {
    //    try {
    //        console.log('In cmdListSentEmail3().');
    //        var thiz = this;
    //        //$('#spanSentEmails').empty();
    //        $.ajax({
    //            //url: webserviceurl + "/bwwebapppendingemail/" + this.options.bwWorkflowAppId,
    //            url: webserviceurl + "/bwwebappsentemail/" + workflowAppId,
    //            type: "DELETE",
    //            contentType: 'application/json',
    //            //data: JSON.stringify(data),
    //            success: function (data) {
    //                try {
    //                    //debugger;
    //                    var html = '';
    //                    //html += 'Pending Emails:';
    //                    if (!data.length || data.length == 0) {
    //                        html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
    //                        html += '  There are no sent emails.';
    //                        html += '<span>';
    //                    } else {
    //                        //html += '<br />';
    //                        html += '<table style="width:600px;">';

    //                        html += '  <tr style="font-size:10pt;font-weight:normal;color:black;">';
    //                        html += '    <td></td>';
    //                        html += '    <td colspan="4">';
    //                        html += '       <span style="padding: 4px 4px 4px 4px;border:1px solid lightblue;cursor:pointer;" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdDisplayDeleteSentEmailsDialog\');">';
    //                        html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png">&nbsp;Delete';
    //                        html += '       </span>';
    //                        html += '    </td>';
    //                        html += '  </tr>';

    //                        html += '  <tr style="font-size:10pt;font-weight:normal;color:black;">';
    //                        html += '    <td><input type="checkbox" id="checkboxToggleSentEmailCheckboxes" onchange="$(\'.bwMonitoringTools\').bwMonitoringTools(\'toggleSentEmailCheckboxes\', this);" /></td>';
    //                        html += '    <td></td>';

    //                        html += '    <td>To</td>';
    //                        html += '    <td>Subject</td>';
    //                        //html += '    <td>From</td>';
    //                        html += '    <td></td>';
    //                        html += '  </tr>';
    //                        for (var i = 0; i < data.length; i++) {
    //                            html += '  <tr style="cursor:pointer;font-size:8pt;font-weight:normal;color:black;" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
    //                            html += '    <td><input type="checkbox" class="sentEmailCheckbox" bwsentemailid="' + data[i].bwSentEmailId + '" /></td>';
    //                            var timestamp = getFriendlyDateAndTime(data[i].Timestamp);
    //                            //var timestampFriendlyTime = data[i].Timestamp.split('T')[1].split('.')[0];
    //                            html += '    <td style="white-space:nowrap;">' + timestamp + '</td>';

    //                            html += '    <td>' + data[i].ToParticipantEmail + '</td>';
    //                            html += '    <td>' + data[i].Subject + '</td>';
    //                            //html += '    <td>' + data[i].FromEmailAddress + '</td>';
    //                            html += '    <td><input type="button" bwsentemailid="xxpeid"' + data[i].EmailLink + '" value="View" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'adminViewSentEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwSentEmailId + '\');" /></td>';
    //                            html += '  </tr>';
    //                        }
    //                        html += '</table>';
    //                    }
    //                    $(thiz.element).find('#spanSentEmails')[0].innerHTML = html;
    //                } catch (e) {
    //                    console.log('Exception in cmdListSentEmail3(): ' + e.message + ', ' + e.stack);
    //                    displayAlertDialog('Exception in cmdListSentEmail3(): ' + e.message + ', ' + e.stack);
    //                }
    //            },
    //            error: function (data, errorCode, errorMessage) {
    //                displayAlertDialog('Error in xx.js.cmdListSentEmail3():' + errorCode + ', ' + errorMessage);
    //            }
    //        });
    //    } catch (e) {
    //        console.log('Exception in cmdListSentEmail3(): ' + e.message + ', ' + e.stack);
    //    }
    //},

    //cmdListPendingEmail3: function () {
    //    try {
    //        //debugger;
    //        console.log('In cmdListPendingEmail3().');
    //        var thiz = this;
    //        //$('#spanPendingEmails').empty();
    //        $.ajax({
    //            url: webserviceurl + "/bwwebapppendingemail/" + workflowAppId,
    //            type: "DELETE",
    //            contentType: 'application/json',
    //            //data: JSON.stringify(data),
    //            success: function (data) {
    //                try {
    //                    var html = '';
    //                    //html += 'Pending Emails:';
    //                    if (!data.length || data.length == 0) {
    //                        html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
    //                        html += '  There are no pending emails.';
    //                        html += '<span>';
    //                    } else {
    //                        //html += '<br />';
    //                        html += '<table style="width:100%;">';
    //                        html += '<colgroup>';
    //                        html += ' <col style="WIDTH:3%;" />';
    //                        html += ' <col style="WIDTH:2%;" />';
    //                        html += ' <col style="WIDTH:5%;" />';
    //                        html += ' <col style="WIDTH:10%;" />';
    //                        html += ' <col style="WIDTH:10%;" />';
    //                        html += ' <col style="WIDTH:70%;" />';
    //                        html += '</colgroup>';
    //                        html += '<tbody>';

    //                        html += '  <tr style="font-size:10pt;font-weight:normal;color:black;">';
    //                        html += '    <td style="background-color:aliceblue;"></td>';
    //                        html += '    <td></td>';
    //                        html += '    <td colspan="4">';
    //                        html += '       <span style="padding: 4px 4px 4px 4px;border:1px solid lightblue;cursor:pointer;" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdDisplayDeletePendingEmailsDialog\');">';
    //                        html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png">&nbsp;Delete';
    //                        html += '       </span>';
    //                        html += '    </td>';
    //                        html += '    <td style="text-align:right;">';
    //                        //html += '       <span class="spanButton" style="padding: 4px 4px 4px 4px;border:1px solid lightblue;cursor:pointer;color:darkgrey;" title="Click to send this email now!" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'sendEmailNow\');">';
    //                        html += '       <span class="spanButton" title="Click to send this email now!" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'sendEmailNow\');">';
    //                        html += '           ✉&nbsp;Send Now >';
    //                        html += '       </span>';
    //                        html += '   </td>';
    //                        html += '  </tr>';


    //                        html += '  <tr style="font-size:10pt;font-weight:normal;color:black;">';
    //                        html += '    <td style="background-color:lightskyblue;">';

    //                        html += '       <span onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'cmdListPendingEmail3\');" style="font-size:15px;white-space:nowrap;cursor:pointer;padding:20px 20px 20px 20px;">✉ Pending</span>';

    //                        html += '    </td>';
    //                        html += '    <td style="vertical-align:top;"><input type="checkbox" id="checkboxTogglePendingEmailCheckboxes" onchange="$(\'.bwMonitoringTools\').bwMonitoringTools(\'togglePendingEmailCheckboxes\', this);" /></td>';
    //                        html += '    <td colspan="4"><span style="font-size:13pt;font-weight:bold;">Pending/Not Sent Emails</span></td>';
    //                        html += '    <td>';
    //                        html += '       <span id="spanSelectedEmailSubject" style="font-size:13pt;font-weight:bold;color:#95b1d3;"></span>';
    //                        html += '   </td>';
    //                        html += '  </tr>';

    //                        html += '  <tr>';
    //                        html += '    <td style="vertical-align:top;background-color:aliceblue;padding:20px 20px 20px 20px;">';

    //                        html += '       <span onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'cmdListSentEmail2\');" style="font-size:15px;white-space:nowrap;cursor:pointer;">✉ Sent</span>';
    //                        html += '       <br />';
    //                        html += '       <span onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'cmdListErrorsOrSuggestions2\');" style="font-size:15px;white-space:nowrap;cursor:pointer;">✉ Errors & Suggestions</span>';

    //                        html += '    </td>';
    //                        html += '       <td colspan="5" style="vertical-align:top;">';
    //                        html += '       <div style="height:600px;overflow-y: scroll;">';
    //                        //html += '   </td>';
    //                        //html += '  </tr>';
    //                        html += '<table>';

    //                        for (var i = 0; i < data.length; i++) {
    //                            //html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
    //                            html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'viewPendingEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwPendingEmailId + '\');" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';

    //                            html += '    <td style="vertical-align:top;"><input type="checkbox" class="pendingEmailCheckbox" bwpendingemailid="' + data[i].bwPendingEmailId + '" /></td>';
    //                            //debugger;
    //                            var timestamp = getFriendlyDateAndTime(data[i].Timestamp);
    //                            //html += '    <td style="white-space:nowrap;">' + timestamp + '</td>';
    //                            //html += '    <td>' + data[i].ToParticipantEmail + '</td>';
    //                            //html += '    <td>' + data[i].Subject + '</td>'; // html += '    <td>' + data[i].FromEmailAddress + '</td>';
    //                            //html += '    <td><input type="button" bwpendingemailid="xxpeid"' + data[i].EmailLink + '" value="View" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'viewPendingEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwPendingEmailId + '\');" /></td>';
    //                            html += '    <td colspan="4" style="border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px;">';
    //                            //debugger; // RelatedRequestId	ad19f2b8-707f-40ad-8228-a07d55a1ddac
    //                            html += '<span style="font-weight:bold;color:black;">' + data[i].ToParticipantFriendlyName + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';
    //                            html += '<span style="font-weight:normal;color:tomato;">' + timestamp + '</span>';
    //                            html += '       <br />';
    //                            //debugger;
    //                            //html += 'RelatedRequestId: ' + data[i].RelatedRequestId + '</span></span>';
    //                            html += '</span>';
    //                            //html += '       <br />';
    //                            html += '<span style="font-weight:lighter;color:#95b1d3;">' + data[i].Subject.substring(0, 55) + ' ...</span>';
    //                            html += '       <br />';

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
    //                        html += '</div>';

    //                        html += '   </td>';

    //                        html += '    <td style="vertical-align:top;width:650px;">';
    //                        //html += '       <span id="spanSelectedEmailBody">[spanSelectedEmailBody]';



    //                        // Quill subject editor.
    //                        html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
    //                        html += 'Subject:';
    //                        html += '</span>';
    //                        html += '<br />';
    //                        html += '   <div id="bwQuilltoolbarForSubject">';
    //                        html += '       <button id="btnQuill_InsertADataItemForSubject" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
    //                        html += '   </div>';
    //                        html += '   <div id="quillConfigureNewUserEmailsDialog_Subject" style="height:50px;"></div>'; // Quill.
    //                        // Quill body editor.
    //                        html += '<br />';
    //                        html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
    //                        html += 'Body:';
    //                        html += '</span>';
    //                        html == '<br />';
    //                        html += '   <div id="bwQuilltoolbar">';
    //                        html += '       <button id="btnQuill_InsertADataItem" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
    //                        html += '       <select class="ql-size">';
    //                        html += '           <option value="small"></option>';
    //                        html += '           <option selected></option>';
    //                        html += '           <option value="large"></option>';
    //                        html += '           <option value="huge"></option>';
    //                        html += '       </select>';
    //                        html += '       <button class="ql-bold"></button>';
    //                        html += '       <button class="ql-script" value="sub"></button>';
    //                        html += '       <button class="ql-script" value="super"></button>';
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








    //                        //html += '       </span>';
    //                        html += '   </td>';

    //                        html += '</tr>';
    //                        html += '</tbody>';
    //                        html += '</table>';

    //                    }
    //                    $(thiz.element).find('#spanPendingEmails')[0].innerHTML = html;

    //                } catch (e) {
    //                    console.log('Exception in cmdListPendingEmail3(): ' + e.message + ', ' + e.stack);
    //                }
    //            },
    //            error: function (data, errorCode, errorMessage) {
    //                displayAlertDialog('Error in xx.js.cmdListPendingEmail3():' + errorCode + ', ' + errorMessage);
    //            }
    //        });
    //    } catch (e) {
    //        console.log('Exception in cmdListPendingEmail3(): ' + e.message + ', ' + e.stack);
    //    }
    //},



    //adminViewErrorOrSuggestion: function (bwParticipantId, bwParticipantFriendlyName, bwParticipantEmail, bwErrorOrSuggestionId) {
    //    try {
    //        //debugger;
    //        console.log('In adminViewErrorOrSuggestion(). bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ', bwErrorOrSuggestionId: ' + bwErrorOrSuggestionId);
    //        var thiz = this;
    //        $.ajax({
    //            url: webserviceurl + "/bwwebapperrororsuggestion2/" + workflowAppId + '/' + bwErrorOrSuggestionId,
    //            type: "DELETE",
    //            contentType: 'application/json',
    //            success: function (data) {
    //                try {
    //                    //debugger;
    //                    $(thiz.element).find('#displayederrororsuggestiondetails')[0].setAttribute('bwErrorOrSuggestionId', bwErrorOrSuggestionId);
    //                    //$(thiz.element).find('#displayedemaildetails')[0].setAttribute('bwSentEmailId', 'xx');

    //                    // Display the email editor.
    //                    thiz.options.quillSubjectEditor = new Quill('#quillConfigureNewUserErrorOrSuggestionDialog_Subject', {
    //                        modules: {
    //                            toolbar: '#bwQuilltoolbarForErrorOrSuggestionSubject'
    //                        },
    //                        //placeholder: 'The enhanced notification email editor functionality is coming soon...', 
    //                        theme: 'snow'
    //                    });

    //                    // Hook up this button event so that the user can insert data items into the email.
    //                    var customButton1 = document.querySelector('#btnQuill_InsertADataItemForErrorOrSuggestion');
    //                    customButton1.addEventListener('click', function () {
    //                        //console.log('btnQuill_InsertADataItem: This functionality is incomplete. Coming soon!');
    //                        thiz.displayEmailDataItemPickerDialog('subject');
    //                    });

    //                    thiz.options.quill = new Quill('#quillConfigureErrorOrSuggestionDialog_Body', {
    //                        modules: {
    //                            toolbar: '#bwQuilltoolbarErrorOrSuggestion'
    //                        },
    //                        //placeholder: 'The enhanced notification email editor functionality is coming soon...', 
    //                        theme: 'snow'
    //                    });

    //                    thiz.options.quillSubjectEditor.on('text-change', function (delta, oldDelta, source) {
    //                        console.log('In adminViewErrorOrSuggestion.quillSubjectEditor.text-change().')
    //                        //thiz.options.userHasMadeChangesToTheEmailTemplate = true;
    //                        //thiz.checkIfWeHaveToDisplayThePublishChangesButton();
    //                    });

    //                    thiz.options.quill.on('text-change', function (delta, oldDelta, source) {
    //                        console.log('In adminViewErrorOrSuggestion.quill.text-change().')
    //                        //thiz.options.userHasMadeChangesToTheEmailTemplate = true;
    //                        //thiz.checkIfWeHaveToDisplayThePublishChangesButton();
    //                    });

    //                    // Hook up this button event so that the user can insert data items into the email.
    //                    var customButton = document.querySelector('#btnQuill_InsertADataItemForErrorOrSuggestion');
    //                    customButton.addEventListener('click', function () {
    //                        console.log('In adminViewErrorOrSuggestion.quill.customButton.click().')
    //                        //console.log('btnQuill_InsertADataItem: This functionality is incomplete. Coming soon!');
    //                        //thiz.displayEmailDataItemPickerDialog('body');
    //                    });
    //                    var emailTemplateForSubject = data[0].Description; //thiz.options.CurrentEmailTemplate.EmailTemplate.Subject;





    //                    // Formulate the html to show the screenshots.
    //                    //debugger;
    //                    debugger;
    //                    var emailTemplate = thiz.populateScreenshots(bwErrorOrSuggestionId, thiz.options.quill); // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Get this working! 7-3-2020
    //                    //var html = '';
    //                    //html += 'WELCOME TO THE SCREENSHOTS!!!!!!!!!<br />';
    //                    //html += '<img src="' + thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/' + bwErrorOrSuggestionId + '/' + 'filename.png' + '" />';
    //                    //var emailTemplate = html; //data[0].Body; //thiz.options.CurrentEmailTemplate.EmailTemplate.Body;





    //                    if (emailTemplateForSubject && emailTemplateForSubject != '') {
    //                        thiz.options.quillSubjectEditor.setText(emailTemplateForSubject);
    //                    } else {
    //                        thiz.options.quillSubjectEditor.setText('xcx44');
    //                    }

    //                    //if (emailTemplate && emailTemplate != '') {
    //                    //    thiz.options.quill.setText(''); // Do this first so we don't get double the email!
    //                    //    //thiz.options.quill.root.innerHTML = emailTemplate; //.setText(emailTemplate);
    //                    //    //thiz.options.quill.setText(emailTemplate);
    //                    //    thiz.options.quill.clipboard.dangerouslyPasteHTML(0, emailTemplate);
    //                    //} else {
    //                    //    thiz.options.quill.setText('');
    //                    //}
    //                    //debugger;
    //                    var timestamp = getFriendlyDateAndTime(data[0].Created);
    //                    var html = '';
    //                    ////debugger;
    //                    //var toParticipantEmail = data[0].ToParticipantEmail.replace('<', '&lt;').replace('>', '&gt;');
    //                    html += '<span style="color:black;">To:</span> ' + data[0].CreatedByFriendlyName + ' (' + data[0].CreatedByEmail + ')';
    //                    html += '<br />';
    //                    html += '<span style="font-weight:normal;font-size:10pt;color:black;">' + timestamp + '</span>';
    //                    $(thiz.element).find('#spanSelectedErrorsAndSuggestionsSubject')[0].innerHTML = html;

    //                } catch (e) {
    //                    console.log('Exception in adminViewErrorOrSuggestion(): ' + e.message + ', ' + e.stack);
    //                }
    //            },
    //            error: function (data, errorCode, errorMessage) {
    //                displayAlertDialog('Error in xx.js.adminViewErrorOrSuggestion():' + errorCode + ', ' + errorMessage);
    //            }
    //        });
    //    } catch (e) {
    //        console.log('Exception in adminViewErrorOrSuggestion(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ': ' + e.message + ', ' + e.stack);
    //    }
    //},

    //cmdListErrorsOrSuggestions2: function () {
    //    try {
    //        //debugger;
    //        console.log('In cmdListErrorsOrSuggestions2().');
    //        //$('#spanErrorsOrSuggestions').empty();
    //        var thiz = this;
    //        $(this.element).find('#spanPendingEmails')[0].innerHTML = '';
    //        //debugger;
    //        $.ajax({
    //            url: this.options.operationUriPrefix + "_bw/bwwebapperrororsuggestion/" + workflowAppId,
    //            type: "DELETE",
    //            contentType: 'application/json',
    //            timeout: this.options.ajaxTimeout,
    //            success: function (data) {
    //                try {


    //                    //debugger; // In cmdListErrorsOrSuggestions2 xcx1


    //                    var html = '';
    //                    //html += 'Pending Emails:';
    //                    if (!data.result.length || data.result.length == 0) {
    //                        html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
    //                        html += '  There are no reported errors or suggestions.';
    //                        html += '<span>';
    //                    } else {
    //                        //html += '<br />';
    //                        html += '<table style="width:100%;">';
    //                        html += '<colgroup>';
    //                        html += ' <col style="WIDTH:3%;" />';
    //                        html += ' <col style="WIDTH:2%;" />';
    //                        html += ' <col style="WIDTH:5%;" />';
    //                        html += ' <col style="WIDTH:10%;" />';
    //                        html += ' <col style="WIDTH:10%;" />';
    //                        html += ' <col style="WIDTH:70%;" />';
    //                        html += '</colgroup>';
    //                        html += '<tbody>';

    //                        html += '  <tr style="font-size:10pt;font-weight:normal;color:black;">';
    //                        html += '    <td></td>';
    //                        html += '    <td colspan="4">';
    //                        html += '       <span style="padding: 4px 4px 4px 4px;border:1px solid lightblue;cursor:pointer;" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdDisplayDeleteErrorsAndSuggestionsDialog\');">';
    //                        html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png">&nbsp;Delete';
    //                        html += '       </span>';
    //                        html += '    </td>';
    //                        html += '    <td style="text-align:right;">';
    //                        html += '       <span style="padding: 4px 4px 4px 4px;border:1px solid lightblue;cursor:pointer;color:darkgrey;" title="Click to send a response now!" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'sendErrorsAndSuggestionsResponseNow\');">';
    //                        html += '           ✉&nbsp;Respond Now >';
    //                        html += '       </span>';
    //                        html += '   </td>';
    //                        html += '  </tr>';

    //                        html += '  <tr style="font-size:10pt;font-weight:normal;color:black;">';
    //                        html += '    <td style="vertical-align:top;"><input type="checkbox" id="checkboxToggleErrorsAndSuggestionsCheckboxes" onchange="$(\'.bwMonitoringTools\').bwMonitoringTools(\'toggleErrorsAndSuggestionsCheckboxes\', this);" /></td>';
    //                        html += '    <td colspan="4"><span style="font-size:13pt;font-weight:bold;">Errors and Suggestions</span></td>';

    //                        html += '    <td>';
    //                        html += '       <span id="spanSelectedErrorsAndSuggestionsSubject" style="font-size:13pt;font-weight:bold;color:#95b1d3;"></span>';
    //                        html += '   </td>';

    //                        html += '  </tr>';

    //                        html += '   <tr>';
    //                        html += '       <td colspan="5" style="vertical-align:top;">';

    //                        html += '<div style="height:600px;overflow-y: scroll;">';
    //                        html += '<table>';

    //                        for (var i = 0; i < data.result.length; i++) {
    //                            //debugger;
    //                            html += '  <tr ondblclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'displayEmailInDialog\', \'' + data.result[i].bwErrorOrSuggestionId + '\');" style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'adminViewErrorOrSuggestion\', \'' + participantId + '\', \'' + participantFriendlyName + '\',\'' + participantEmail + '\',\'' + data.result[i].bwErrorOrSuggestionId + '\');">';
    //                            //html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" >';

    //                            html += '    <td style="vertical-align:top;"><input type="checkbox" class="pendingErrorOrSuggestionCheckbox" bwerrororsuggestionid="' + data.result[i].bwErrorOrSuggestionId + '" /></td>';
    //                            //debugger;
    //                            var timestamp = getFriendlyDateAndTime(data.result[i].Created);
    //                            //html += '    <td style="white-space:nowrap;">' + timestamp + '</td>';
    //                            //html += '    <td>' + data[i].ToParticipantEmail + '</td>';
    //                            //html += '    <td>' + data[i].Subject + '</td>'; // html += '    <td>' + data[i].FromEmailAddress + '</td>';
    //                            //html += '    <td><input type="button" bwpendingemailid="xxpeid"' + data[i].EmailLink + '" value="View" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'adminViewPendingEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwPendingEmailId + '\');" /></td>';
    //                            html += '    <td colspan="4" style="border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px;" >';

    //                            if (data.result[i].Flagged) {
    //                                //debugger;
    //                                html += '<span style="font-weight:bold;color:black;width:100%;">' + data.result[i].CreatedByFriendlyName + '&nbsp;&nbsp;&nbsp;&nbsp;';
    //                                html += '<span title="Flag this message..." style="font-size:13pt;width:100%;text-align:right;color:red;" onmouseover="this.style.color=\'aqua\';" onmouseout="this.style.color=\'red\';" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'flagThisMessage\', \'' + data.result[i].bwErrorOrSuggestionId + '\', true);">⚑</span>';
    //                            } else {
    //                                //debugger;
    //                                html += '<span style="font-weight:bold;color:black;width:100%;">' + data.result[i].CreatedByFriendlyName + '&nbsp;&nbsp;&nbsp;&nbsp;';
    //                                html += '<span title="Flag this message..." style="font-size:13pt;width:100%;text-align:right;" onmouseover="this.style.color=\'aqua\';" onmouseout="this.style.color=\'black\';" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'flagThisMessage\', \'' + data.result[i].bwErrorOrSuggestionId + '\', false);">⚐</span>';
    //                            }
    //                            html += '   <br />';
    //                            html += '   <span style="font-weight:normal;color:tomato;">' + timestamp + '</span>';
    //                            html += '   <br />';
    //                            html += '</span>';

    //                            html += '<span style="font-weight:lighter;color:#95b1d3;">' + data.result[i].Description.substring(0, 55) + ' ...</span>';
    //                            html += '       <br />';

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
    //                        html += '</div>';

    //                        html += '   </td>';

    //                        html += '    <td style="vertical-align:top;width:500px;">';
    //                        //html += '       <span id="spanSelectedEmailBody">[spanSelectedEmailBody]';



    //                        // Quill subject editor.
    //                        html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
    //                        html += 'Error or suggestion:';
    //                        html += '</span>';
    //                        html += '<br />';
    //                        html += '   <div id="bwQuilltoolbarForErrorOrSuggestionSubject">';
    //                        html += '       <button id="btnQuill_InsertADataItemForErrorOrSuggestion" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
    //                        html += '   </div>';
    //                        html += '   <div id="quillConfigureNewUserErrorOrSuggestionDialog_Subject" style="height:50px;"></div>'; // Quill.
    //                        // Quill body editor.
    //                        html += '<br />';
    //                        html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
    //                        html += 'Screenshot(s):';
    //                        html += '</span>';
    //                        html == '<br />';
    //                        html += '   <div id="bwQuilltoolbarErrorOrSuggestion">';
    //                        html += '       <button id="btnQuillErrorOrSuggestion_InsertADataItem" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
    //                        html += '       <select class="ql-size">';
    //                        html += '           <option value="small"></option>';
    //                        html += '           <option selected></option>';
    //                        html += '           <option value="large"></option>';
    //                        html += '           <option value="huge"></option>';
    //                        html += '       </select>';
    //                        html += '       <button class="ql-bold"></button>';
    //                        html += '       <button class="ql-script" value="sub"></button>';
    //                        html += '       <button class="ql-script" value="super"></button>';
    //                        html += '   </div>';
    //                        html += '   <div id="quillConfigureErrorOrSuggestionDialog_Body" style="height:375px;"></div>'; // Quill.
    //                        // Save button.
    //                        //html += '   <br />';
    //                        //html += '   <span id="spanConfigureEmailNotificationsDialogSaveButton">[spanConfigureEmailNotificationsDialogSaveButton]</span>'; // ☑ 
    //                        //html += '   <br /><br />';
    //                        // Preview/Edit button.
    //                        //html += '   <div id="divNewUserEmailEditor_PreviewAndEditButton" class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;"></div>';
    //                        //html += '   <br /><br />';
    //                        html += '</div>';








    //                        //html += '       </span>';
    //                        html += '   </td>';

    //                        html += '</tr>';
    //                        html += '</tbody>';
    //                        html += '</table>';

    //                    }
    //                    //$('#spanErrorsOrSuggestions').append(html);
    //                    $(thiz.element).find('#spanPendingEmails')[0].innerHTML = html;
    //                } catch (e) {
    //                    console.log('Exception in cmdListErrorsOrSuggestions2(): ' + e.message + ', ' + e.stack);
    //                }
    //            },
    //            error: function (data, errorCode, errorMessage) {
    //                displayAlertDialog('Error in xx.js.cmdListErrorsOrSuggestions2():' + errorCode + ', ' + errorMessage);
    //            }
    //        });
    //    } catch (e) {
    //        console.log('Exception in cmdListErrorsOrSuggestions2(): ' + e.message + ', ' + e.stack);
    //    }
    //},








    //cmdListSentEmail2: function () {
    //    try {
    //        //debugger;
    //        console.log('In cmdListSentEmail2().');
    //        var thiz = this;
    //        //$('#spanPendingEmails').empty();
    //        $.ajax({
    //            url: webserviceurl + "/bwwebappsentemail/" + workflowAppId,
    //            type: "DELETE",
    //            contentType: 'application/json',
    //            //data: JSON.stringify(data),
    //            success: function (data) {
    //                try {
    //                    var html = '';
    //                    //html += 'Pending Emails:';
    //                    if (!data.length || data.length == 0) {
    //                        html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
    //                        html += '  There are no pending emails.';
    //                        html += '<span>';
    //                    } else {
    //                        //html += '<br />';
    //                        html += '<table style="width:100%;">';
    //                        html += '<colgroup>';
    //                        html += ' <col style="WIDTH:3%;" />';
    //                        html += ' <col style="WIDTH:2%;" />';
    //                        html += ' <col style="WIDTH:5%;" />';
    //                        html += ' <col style="WIDTH:10%;" />';
    //                        html += ' <col style="WIDTH:10%;" />';
    //                        html += ' <col style="WIDTH:70%;" />';
    //                        html += '</colgroup>';
    //                        html += '<tbody>';

    //                        html += '  <tr style="font-size:10pt;font-weight:normal;color:black;">';
    //                        html += '    <td style="background-color:aliceblue;"></td>';
    //                        html += '    <td></td>';
    //                        html += '    <td colspan="4">';
    //                        html += '       <span style="padding: 4px 4px 4px 4px;border:1px solid lightblue;cursor:pointer;" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdDisplayDeletePendingEmailsDialog\');">';
    //                        html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png">&nbsp;Delete';
    //                        html += '       </span>';
    //                        html += '    </td>';
    //                        html += '    <td style="text-align:right;">';
    //                        //html += '       <span class="spanButton" style="padding: 4px 4px 4px 4px;border:1px solid lightblue;cursor:pointer;color:darkgrey;" title="Click to send this email now!" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'sendEmailNow\');">';
    //                        html += '       <span class="spanButton" title="Click to send this email now!" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'sendEmailNow\');">';
    //                        html += '           ✉&nbsp;Send Now >';
    //                        html += '       </span>';
    //                        html += '   </td>';
    //                        html += '  </tr>';


    //                        html += '  <tr style="font-size:10pt;font-weight:normal;color:black;">';
    //                        html += '    <td style="background-color:lightskyblue;">';

    //                        html += '       <span onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'cmdListPendingEmail3\');" style="font-size:15px;white-space:nowrap;cursor:pointer;padding:20px 20px 20px 20px;">✉ Pending</span>';

    //                        html += '    </td>';
    //                        html += '    <td style="vertical-align:top;"><input type="checkbox" id="checkboxTogglePendingEmailCheckboxes" onchange="$(\'.bwMonitoringTools\').bwMonitoringTools(\'togglePendingEmailCheckboxes\', this);" /></td>';
    //                        html += '    <td colspan="4"><span style="font-size:13pt;font-weight:bold;">Pending/Not Sent Emails</span></td>';
    //                        html += '    <td>';
    //                        html += '       <span id="spanSelectedEmailSubject" style="font-size:13pt;font-weight:bold;color:#95b1d3;"></span>';
    //                        html += '   </td>';
    //                        html += '  </tr>';

    //                        html += '  <tr>';
    //                        html += '    <td style="vertical-align:top;background-color:aliceblue;padding:20px 20px 20px 20px;">';

    //                        html += '       <span onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'cmdListSentEmail2\');" style="font-size:15px;white-space:nowrap;cursor:pointer;">✉ Sent</span>';
    //                        html += '       <br />';
    //                        html += '       <span onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'cmdListErrorsOrSuggestions2\');" style="font-size:15px;white-space:nowrap;cursor:pointer;">✉ Errors & Suggestions</span>';

    //                        html += '    </td>';
    //                        html += '       <td colspan="5" style="vertical-align:top;">';
    //                        html += '       <div style="height:600px;overflow-y: scroll;">';
    //                        //html += '   </td>';
    //                        //html += '  </tr>';
    //                        html += '<table>';

    //                        for (var i = 0; i < data.length; i++) {
    //                            //html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
    //                            html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onclick="$(\'.bwEmailMonitor_Admin\').bwEmailMonitor_Admin(\'viewPendingEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwPendingEmailId + '\');" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';

    //                            html += '    <td style="vertical-align:top;"><input type="checkbox" class="pendingEmailCheckbox" bwpendingemailid="' + data[i].bwPendingEmailId + '" /></td>';
    //                            //debugger;
    //                            var timestamp = getFriendlyDateAndTime(data[i].Timestamp);
    //                            //html += '    <td style="white-space:nowrap;">' + timestamp + '</td>';
    //                            //html += '    <td>' + data[i].ToParticipantEmail + '</td>';
    //                            //html += '    <td>' + data[i].Subject + '</td>'; // html += '    <td>' + data[i].FromEmailAddress + '</td>';
    //                            //html += '    <td><input type="button" bwpendingemailid="xxpeid"' + data[i].EmailLink + '" value="View" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'viewPendingEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwPendingEmailId + '\');" /></td>';
    //                            html += '    <td colspan="4" style="border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px;">';
    //                            //debugger; // RelatedRequestId	ad19f2b8-707f-40ad-8228-a07d55a1ddac
    //                            html += '<span style="font-weight:bold;color:black;">' + data[i].ToParticipantFriendlyName + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';
    //                            html += '<span style="font-weight:normal;color:tomato;">' + timestamp + '</span>';
    //                            html += '       <br />';
    //                            //debugger;
    //                            //html += 'RelatedRequestId: ' + data[i].RelatedRequestId + '</span></span>';
    //                            html += '</span>';
    //                            //html += '       <br />';
    //                            html += '<span style="font-weight:lighter;color:#95b1d3;">' + data[i].Subject.substring(0, 55) + ' ...</span>';
    //                            html += '       <br />';

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
    //                        html += '</div>';

    //                        html += '   </td>';

    //                        html += '    <td style="vertical-align:top;width:650px;">';
    //                        //html += '       <span id="spanSelectedEmailBody">[spanSelectedEmailBody]';



    //                        // Quill subject editor.
    //                        html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
    //                        html += 'Subject:';
    //                        html += '</span>';
    //                        html += '<br />';
    //                        html += '   <div id="bwQuilltoolbarForSubject">';
    //                        html += '       <button id="btnQuill_InsertADataItemForSubject" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
    //                        html += '   </div>';
    //                        html += '   <div id="quillConfigureNewUserEmailsDialog_Subject" style="height:50px;"></div>'; // Quill.
    //                        // Quill body editor.
    //                        html += '<br />';
    //                        html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
    //                        html += 'Body:';
    //                        html += '</span>';
    //                        html == '<br />';
    //                        html += '   <div id="bwQuilltoolbar">';
    //                        html += '       <button id="btnQuill_InsertADataItem" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
    //                        html += '       <select class="ql-size">';
    //                        html += '           <option value="small"></option>';
    //                        html += '           <option selected></option>';
    //                        html += '           <option value="large"></option>';
    //                        html += '           <option value="huge"></option>';
    //                        html += '       </select>';
    //                        html += '       <button class="ql-bold"></button>';
    //                        html += '       <button class="ql-script" value="sub"></button>';
    //                        html += '       <button class="ql-script" value="super"></button>';
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








    //                        //html += '       </span>';
    //                        html += '   </td>';

    //                        html += '</tr>';
    //                        html += '</tbody>';
    //                        html += '</table>';

    //                    }
    //                    $(thiz.element).find('#spanPendingEmails')[0].innerHTML = html;

    //                } catch (e) {
    //                    console.log('Exception in cmdListSentEmail2(): ' + e.message + ', ' + e.stack);
    //                }
    //            },
    //            error: function (data, errorCode, errorMessage) {
    //                displayAlertDialog('Error in xx.js.cmdListSentEmail2():' + errorCode + ', ' + errorMessage);
    //            }
    //        });
    //    } catch (e) {
    //        console.log('Exception in cmdListSentEmail2(): ' + e.message + ', ' + e.stack);
    //    }
    //},

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
    }


});