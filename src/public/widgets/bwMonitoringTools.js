$.widget("bw.bwMonitoringTools", {
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
        This is the bwMonitoringTools.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

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

        //quill: null,
        //quillSubjectEditor: null,

        //quillErrorOrSuggestionDialogSubjectEditor: null,
        //quillErrorOrSuggestionDialogBodyEditor: null,

        displayOrgRolesPicker: false, //true, // Should be false by default but this is good for now.
        displayRoleIdColumn: false,
        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function (assignmentRowChanged_ElementId) {
        this.element.addClass("bwMonitoringTools");
        var thiz = this; // Need this because of the asynchronous operations below.
        //debugger;
        try {
            if (this.options.operationUriPrefix == null) {
                // This formulates the operationUri, which is used throughout.
                var url1 = window.location.href.split('https://')[1];
                var url2 = url1.split('/')[0];
                this.options.operationUriPrefix = 'https://' + url2 + '/';
            }
            //
            //if (this.options.store != null) {
            //    // this.options.store is populated, so just render the OrgRoles.
            //    debugger;

            this.renderMonitoringTools();

            //} else {
            //    // this.options.store was null, so go get it from the database.
            //    $.ajax({
            //        url: this.options.operationUriPrefix + "odata/OrgRolesConfiguration/" + this.options.bwTenantId + '/' + this.options.bwWorkflowAppId + "/true", //?$filter=Active eq true", //('eCarWorkflow')", // Get the eCarWorkflow json/definition from the database.
            //        dataType: "json",
            //        contentType: "application/json",
            //        type: "Get",
            //        timeout: this.options.ajaxTimeout
            //    }).done(function (result) {
            //        //debugger;
            //        try {
            //            $.ajax({
            //                url: thiz.options.operationUriPrefix + "odata/WorkflowConfiguration/" + thiz.options.bwTenantId + '/' + thiz.options.bwWorkflowAppId + "/true", //?$filter=Active eq true", //('eCarWorkflow')", // Get the eCarWorkflow json/definition from the database.
            //                dataType: "json",
            //                contentType: "application/json",
            //                type: "Get",
            //                timeout: thiz.options.ajaxTimeout
            //            }).done(function (result2) {
            //                try {


            //                    //console.log('The user is not logged in, so displaying the default WorkflowEditor.');
            //                    var orgRoles;
            //                    var workflow;
            //                    if (!participantId) {
            //                        // The user is not logged in.
            //                        debugger;
            //                        console.log('The user is not logged in, so displaying the default WorkflowEditor.');
            //                        orgRoles = result.value[0].ConfigurationValues; // Works when the user is not logged in. 
            //                        workflow = result2.value[0].ConfigurationValues; // Works when the user is not logged in. 
            //                    } else {
            //                        // The user is logged in.
            //                        //debugger;
            //                        orgRoles = result.value; // Works when the user is logged in.
            //                        workflow = result2.value; // Works when the user is logged in.
            //                    }
            //                    //debugger;

            //                    //var x = {
            //                    //    Global: orgRoles
            //                    //}
            //                    var draftGlobal = JSON.parse(JSON.stringify(orgRoles.Global));
            //                    thiz.options.store = {
            //                        DraftGlobal: draftGlobal,
            //                        Global: orgRoles.Global
            //                    }
            //                    //debugger;

            //                    thiz.options.workflow = workflow;

            //                    thiz.element.html(thiz.renderOrgRolesEditor()); //assignmentRowChanged_ElementId)); // Render the org chart.

            //                    //debugger;
            //                    // TODD THIS COULD BE MOVED TO A DIFFERENT LOCATION PROB
            //                    var tagname = 'spanWorkflowPeoplePicker_right'; // Just showing it at the top for th emoment
            //                    thiz.renderWorkflowPeoplePicker(tagname); // spanWorkflowPeoplePicker1


            //                } catch (e) {
            //                    //lpSpinner.Hide();
            //                    console.log('Exception in bwOrganizationEditor._create().xx.Get:1: ' + e.message + ', ' + e.stack);
            //                }
            //            }).fail(function (data) {
            //                //lpSpinner.Hide();
            //                debugger;
            //                console.log('In xx.fail(): ' + JSON.stringify(data));
            //                var msg;
            //                if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
            //                    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
            //                } else {
            //                    msg = JSON.stringify(data);
            //                }
            //                alert('Exception in bwOrganizationEditor._create().xx.Get:2: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
            //                console.log('Exception in bwOrganizationEditor._create().xx.Get:2: ' + JSON.stringify(data));
            //                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
            //                //var error = JSON.parse(data.responseText)["odata.error"];
            //                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            //            });
            //        } catch (e) {
            //            //lpSpinner.Hide();
            //            console.log('Exception in bwOrganizationEditor._create().xx.Get:1: ' + e.message + ', ' + e.stack);
            //        }
            //    }).fail(function (data) {
            //        //lpSpinner.Hide();
            //        debugger;
            //        console.log('In xx.fail(): ' + JSON.stringify(data));
            //        var msg;
            //        if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
            //            msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
            //        } else {
            //            msg = JSON.stringify(data);
            //        }
            //        alert('Exception in bwOrganizationEditor._create().xx.Get:2: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
            //        console.log('Exception in bwOrganizationEditor._create().xx.Get:2: ' + JSON.stringify(data));
            //        //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
            //        //var error = JSON.parse(data.responseText)["odata.error"];
            //        //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            //    });
            //}
        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwOrganizationEditor: CANNOT RENDER THE WORKFLOW MATRIX</span>';
            html += '<br />';
            html += '<span style="">Exception in bwOrganizationEditor.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
    renderMonitoringTools: function () {
        try {
            console.log('In renderMonitoringTools().');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');

            var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');

            //var json = this.options.store; //.OrgStructureAndRoles;
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




            //html += '<div style="display:none;" id="divViewIndividualEmailDialog">'; // divViewIndividualEmailDialog >> rename to >> divViewIndividualEmailDialog
            //html += '   <table style="width:100%;">';
            //html += '       <tr>';
            //html += '           <td style="width:90%;">';
            //html += '               <span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:30pt;font-weight:bold;">Email</span>';

            ////html += '<span title="Introductory Email maintenance..." style="width:200px;padding:5px 10px 5px 10px;margin:0 0 0 10px;white-space:nowrap;vertical-align:middle;border:1px solid lightblue;cursor:pointer;font-weight:normal;font-size:10pt;" onclick="$(\'.bwNewUserEmailEditor\').bwNewUserEmailEditor(\'displayWorkflowsConfigurationDialog\');">';
            ////html += '<span style="display:inline-block;"> ⚙ </span>';
            ////html += '</span>';

            //html += '               <br />';
            //html += '               <span id="spanConfigureEmailNotificationsDialogSubTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:normal;">[spanConfigureEmailNotificationsDialogSubTitle]</span>';
            //html += '           </td>';
            //html += '           <td style="width:9%;"></td>';
            //html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
            //html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divViewIndividualEmailDialog\').dialog(\'close\');">X</span>';
            //html += '           </td>';
            //html += '       </tr>';
            //html += '   </table>';
            //html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            //html += '   <br />';

            //html += '<div style="display:none;" id="divUndoNewUserEmailTemplateActivationDialog">';
            //html += '  <table style="width:100%;">';
            //html += '    <tr>';
            //html += '      <td style="width:90%;">';
            //html += '        <span id="spanUndoWorkflowActivationTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Introductory Email ACTIVATED</span>';
            //html += '      </td>';
            //html += '      <td style="width:9%;"></td>';
            //html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
            //html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divUndoNewUserEmailTemplateActivationDialog\').dialog(\'close\');">X</span>';
            //html += '      </td>';
            //html += '    </tr>';
            //html += '  </table>';
            //html += '  <br /><br />';
            //html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            //html += '  <span id="spanUndoWorkflowActivationContentcccxxxccc" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:20pt;">';
            //html += '    This new user introductory email has been activated and will immediately impact the future processes. Please keep an eye on potential issues related to your change(s). ';
            //html += '    <br />';
            //html += '    <br />';
            //html += '    <br />';
            //html += '    <span style="font-weight:bold;cursor:pointer;">';
            //html += '      You can change the "Active Introductory Email" using the drop-down at the top of this page any time';
            //html += '    </span>';
            //html += '  </span>';
            //html += '  <br /><br />';
            //html += '</div>';

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

            //html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
            //html += 'To:';
            //html += '</span>';
            //html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
            //html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
            //html += 'Created date:';
            //html += '</span>';
            //html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
            //html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
            //html += 'SEND NOW';
            //html += '</span>';
            //html += '<br />';
            //html += '<br />';
            //html += '<br />';

            ////html += '   <span id="spanConfigureEmailNotificationsDialogSelectEditEmailForDropdown">[spanConfigureEmailNotificationsDialogSelectEditEmailForDropdown]</span>';
            ////html += '   <br />';
            ////html += '   <br />';
            //// Quill subject editor.
            //html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
            //html += 'Subject:';
            //html += '</span>';
            //html += '<br />';
            //html += '   <div id="bwQuilltoolbarForSubject">';
            //html += '       <button id="btnQuill_InsertADataItemForSubject" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
            //html += '   </div>';
            //html += '   <div id="quillConfigureNewUserEmailsDialog_Subject" style="height:50px;"></div>'; // Quill.
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
            //html += '   <div id="quillConfigureNewUserEmailsDialog_Body" style="height:375px;"></div>'; // Quill.
            //// Save button.
            ////html += '   <br />';
            ////html += '   <span id="spanConfigureEmailNotificationsDialogSaveButton">[spanConfigureEmailNotificationsDialogSaveButton]</span>'; // ☑ 
            //html += '   <br /><br />';
            //// Preview/Edit button.
            //html += '   <div id="divNewUserEmailEditor_PreviewAndEditButton" class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;"></div>';
            //html += '   <br /><br />';
            //html += '</div>';





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
            html += '   <div class="divSignInButton" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'deleteSelectedErrorsAndSuggestions\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
            html += '       Delete the Errors And Suggestions';
            html += '   </div>';
            html += '   <br /><br />';
            html += '   <div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em; font-weight: bold;" onclick="$(\'#divDeleteErrorsAndSuggestionsDialog\').dialog(\'close\');">';
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
            html += '   <div class="divSignInButton" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'deleteSelectedSentEmails\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
            html += '       Delete the Sent Emails';
            html += '   </div>';
            html += '   <br /><br />';
            html += '   <div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em; font-weight: bold;" onclick="$(\'#divDeleteSentEmailsDialog\').dialog(\'close\');">';
            html += '       Cancel';
            html += '   </div>';
            html += '   <br /><br />';
            html += '</div>';

            html += '<div style="display:none;" id="divConfirmSendPendingEmailsDialog">';
            html += '   <table style="width:100%;">';
            html += '       <tr>';
            html += '           <td style="width:90%;">';
            html += '               <span id="spanConfirmSendPendingEmailsDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">Send Emails</span>';
            html += '           </td>';
            html += '           <td style="width:9%;"></td>';
            html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divConfirmSendPendingEmailsDialog\').dialog(\'close\');">X</span>';
            html += '           </td>';
            html += '       </tr>';
            html += '   </table>';
            html += '   <br /><br />';
            html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '   <span id="spanConfirmSendPendingEmailsDialogInvitationDescriptionText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;">';
            html += '       There are xx Pending Emails that will be sent when you turn email on. Are you certain you wish these emails to be sent?';
            html += '   </span>';
            html += '   <br /><br /><br />';
            html += '   <div class="divSignInButton" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'confirmSendPendingEmails\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
            html += '       Send the Pending Emails';
            html += '   </div>';
            html += '   <br /><br />';
            html += '   <div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em; font-weight: bold;" onclick="$(\'#divConfirmSendPendingEmailsDialog\').dialog(\'close\');">';
            html += '       Cancel';
            html += '   </div>';
            html += '   <br /><br />';
            html += '</div>';

















            //debugger;


            if (this.options.displayOnCreation == true) {
                var json = this.options.store;
                // Header with print button.
                html += '<table style="width:100%;">';
                html += '   <tr style="height:90pt;vertical-align:top;">';
                html += '       <td>';

                html += '<table>';

                //html += '   <tr>';
                //html += '       <td>';
                //html += '               <span style="color:black;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 35pt;font-weight:bold;">System Status and Health for this organization</span>'; // Velvet Morning is #95b1d3. This was the pantone color of the day for December 9, 2019! :D
                //html += '       </td>';
                //html += '   </tr>';


                html += '   <tr>';
                html += '       <td>';



                html += '<div id="divBwExternallySharedFiles"></div>';

                html += '<br />';






                //html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                //html += '  <tr>';
                //html += '    <td>';
                //html += '        <span id="configurationBehaviorTurnOffEmailSlider_Description" style="font-size:normal;">[configurationBehaviorTurnOffEmailSlider_Description]</span>';
                //html += '    </td></tr>';
                //html += '</table>';
                html += '<table>';
                //html += '  <tr>';
                //html += '    <td style="text-align:left;vertical-align:middle;" class="bwSliderTitleCell">';
                //html += '       Sending email:&nbsp;';
                //html += '    </td>';
                //html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                //html += '       <table>';
                //html += '           <tr>';
                //html += '               <td>';
                //html += '                   <label for="configurationBehaviorTurnOffEmailSlider"></label><input type="checkbox" name="configurationBehaviorTurnOffEmailSlider" id="configurationBehaviorTurnOffEmailSlider" />';
                //html += '               </td>';
                //html += '               <td>';
                //html += '                   &nbsp;&nbsp;';
                //html += '               </td>';
                //html += '               <td>';
                //html += '                   <span id="configurationBehaviorTurnOffEmailSlider_CurrentStatus"></span>';
                //html += '               </td>';
                //html += '           </tr>';
                //html += '       </table>';
                //html += '    </td>';
                //html += '  </tr>';










                html += `<br /><br />PUT CUSTOMER SHARED REQUESTS HERE. xcx993375.<br /><br />`;







               

                // Sending email.
                html += '  <tr>';
                html += '    <td style="text-align:left;vertical-align:middle;white-space:nowrap;vertical-align:top;" class="bwSliderTitleCell">';
                html += '       Sending email:&nbsp;';
                html += '    </td>';
                html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                html += '       <table>';
                html += '           <tr>';
                html += '               <td>';
                html += '                   <label for="configurationBehaviorTurnOffEmailSlider"></label><input type="checkbox" name="configurationBehaviorTurnOffEmailSlider" id="configurationBehaviorTurnOffEmailSlider" />';
                html += '               </td>';
                html += '               <td>';
                html += '                   &nbsp;&nbsp;';
                html += '               </td>';
                html += '               <td>';
                html += '                   <span id="configurationBehaviorTurnOffEmailSlider_CurrentStatus"></span>';
                html += '               </td>';
                html += '               <td>';
                html += '               </td>';
                html += '               <td>';
                html += '                   <span id="configurationBehaviorTurnOffEmailSlider_Description" style="font-size:normal;">[configurationBehaviorTurnOffEmailSlider_Description]</span>';
                html += '               </td>';
                html += '           </tr>';
                html += '       </table>';
                html += '    </td>';
                html += '  </tr>';

                html += '  <tr>';
                html += '    <td colspan="2">&nbsp;</td>';
                html += '  </tr>';










                // Moderate and review this organizations system generated emails
                html += '   <tr>';
                html += '       <td colspan="2" class="bwChartCalculatorLightCurrencyTableCell" style="width:100%;">';
                html += '           <span style="font-size:15pt;font-weight:normal;">Moderate and review this organizations system generated emails</span>';
                html += '           <br />';
                html += '           <span style="font-size:10pt;font-weight:normal;">The system sends participants in this organization emails, which you can review here as "Sent". "Pending" emails are ones that have not been sent yet, because the email system has been turned off.</span>';
                html += '           <br /><br />';
                html += '           <div id="divBwEmailMonitor">[divBwEmailMonitor]</div>';
                html += '       </td>';
                html += '   </tr>';

                html += '  <tr>';
                html += '    <td colspan="2">&nbsp;</td>';
                html += '  </tr>';






                // File services.
                html += '  <tr>';
                html += '    <td style="text-align:left;vertical-align:middle;white-space:nowrap;" class="bwSliderTitleCell">';
                html += '       File Services:&nbsp;';
                html += '    </td>';
                html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                html += '       <table>';
                html += '           <tr>';
                html += '               <td>';
                html += '                   <span id="spanAttachmentsServerStatus" style="font-weight:bold;color:#009933;"></span>';
                html += '               </td>';
                html += '               <td style="width:25px;">';
                html += '               </td>';
                html += '               <td>';
                html += '                   <span style="color:darkgrey;font-size:small;font-style:italic;">File Services upload and download attachments, organization images, and participant images.</span>';
                html += '               </td>';
                html += '           </tr>';
                html += '       </table>';
                html += '    </td>';
                html += '  </tr>';

                html += '  <tr>';
                html += '    <td colspan="2">&nbsp;</td>';
                html += '  </tr>';







                // Timer services.
                //html += '  <tr>';
                //html += '    <td style="text-align:left;vertical-align:middle;white-space:nowrap;" class="bwSliderTitleCell">';
                //html += '       Timer Services:&nbsp;';
                //html += '    </td>';
                //html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                //html += '       <div id="divBwTimerServicesManager"></div>';
                //html += '    </td>';
                //html += '  </tr>';
                html += '   <tr>';
                html += '       <td colspan="2" class="bwChartCalculatorLightCurrencyTableCell" style="width:100%;">';
                //html += '           <span style="font-size:15pt;font-weight:normal;">Moderate and review this organizations system generated emails</span>';
                //html += '           <br />';
                //html += '           <span style="font-size:10pt;font-weight:normal;">The system sends participants in this organization emails, which you can review here as "Sent". "Pending" emails are ones that have not been sent yet, because the email system has been turned off.</span>';
                //html += '           <br /><br />';
                html += '           <div id="divBwTimerServicesManager">[divBwTimerServicesManager]</div>';
                html += '       </td>';
                html += '   </tr>';

                html += '  <tr>';
                html += '    <td colspan="2">&nbsp;</td>';
                html += '  </tr>';















                if (developerModeEnabled == true) {
                    html += '  <tr>';
                    html += '    <td style="text-align:left;vertical-align:top;white-space:nowrap;" class="bwSliderTitleCell">';
                    html += '       Errors and suggestions:&nbsp;';
                    html += '    </td>';
                    html += '    <td class="bwChartCalculatorLightCurrencyTableCell" style="width:100%;">'; // 6-15-2020
                    html += '       <div id="displayederrororsuggestiondetails" style="display:none;" bwErrorOrSuggestionId="" ></div>'; // This is where we look when we want to know the type and GUID of the displayed email!
                    html += '       <table>';
                    html += '           <tr>';
                    html += '               <td  style="width:100%;">';
                    html += '                   <span id="spanErrorsOrSuggestions" style="width:100%;"></span>';
                    html += '               </td>';
                    html += '           </tr>';
                    html += '       </table>';
                    html += '    </td>';
                    html += '  </tr>';

                    html += '  <tr>';
                    html += '    <td colspan="2">&nbsp;</td>';
                    html += '  </tr>';
                }

                if (developerModeEnabled == true) {
                    html += '  <tr>';
                    html += '    <td style="text-align:left;vertical-align:top;white-space:nowrap;" class="bwSliderTitleCell">';
                    html += '        Import Requests from<br />Sql Server (BETA): ';
                    html += '    </td>';
                    html += '    <td class="bwChartCalculatorLightCurrencyTableCell" style="width:100%;">';
                    html += '       <input type="button" id="btnConnectToSqlServer" value="Import Requests from Sql Server" onclick="cmdImportRequestsFromSqlServer();" style="cursor:pointer;padding:5px 10px 5px 10px;" />';
                    html += '    </td>';
                    html += '  </tr>';

                    html += '  <tr>';
                    html += '    <td colspan="2">&nbsp;</td>';
                    html += '  </tr>';
                }


                //// Moderate and review this organizations system generated emails
                //html += '   <tr>';
                //html += '       <td colspan="2" class="bwChartCalculatorLightCurrencyTableCell" style="width:100%;">';
                //html += '           <span style="font-size:15pt;font-weight:normal;">Moderate and review this organizations system generated emails</span>';
                //html += '           <br />';
                //html += '           <span style="font-size:10pt;font-weight:normal;">The system sends participants in this organization emails, which you can review here as "Sent". "Pending" emails are ones that have not been sent yet, because the email system has been turned off.</span>';
                //html += '           <br /><br />';
                //html += '           <div id="divBwEmailMonitor">[divBwEmailMonitor]</div>';
                //html += '       </td>';
                //html += '   </tr>';

                //html += '  <tr>';
                //html += '    <td colspan="2">&nbsp;</td>';
                //html += '  </tr>';








                // 1-16-2022 
                //html += '<div id="divBwTardyParticipants">[divBwTardyParticipants]</div>';

                // 2-18-2022
                html += '   <tr>';
                html += '       <td colspan="2">';
                html += '           <div id="divBwTardyParticipants">[divBwTardyParticipants]</div>';
                html += '       </td>';
                html += '   </tr>';





                html += '  <tr>';
                html += '    <td colspan="2">&nbsp;</td>';
                html += '  </tr>';

















                // Invitations.
                html += '   <tr>';
                html += '       <td colspan="2" class="bwChartCalculatorLightCurrencyTableCell" style="width:100%;">';
                html += '           <div id="divBwInvitationsAdmin">[divBwInvitationsAdmin]</div>';
                html += '       </td>';
                html += '   </tr>';







                // Removed Unsubscribers section. 4-10-2022
                //html += '  <tr>';
                //html += '    <td colspan="2">&nbsp;</td>';
                //html += '  </tr>';

                //// Unsubscribers..
                //html += '   <tr>';
                //html += '       <td colspan="2" class="bwChartCalculatorLightCurrencyTableCell" style="width:100%;">';
                //html += '           <span style="font-size:15pt;font-weight:normal;">Unsubscribers</span>';
                //html += '           <br />';
                //html += '           <span style="font-size:10pt;font-weight:normal;">Unsubscribe is for... xcx2432-2</span>';
                //html += '           <br /><br />';
                //html += '           <div id="divBwUnsubscribers">[divBwUnsubscribers]</div>';
                //html += '       </td>';
                //html += '   </tr>';
















                html += '</table>';

                html += '<br />';


                //html += '               <span style="color:black;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 25pt;font-weight:bold;">System Status and Health for this organization</span>'; // Velvet Morning is #95b1d3. This was the pantone color of the day for December 9, 2019! :D
                //html += '<br /><br />';
                //html += '        <span id="spanWebsiteErrorThreats"></span>';
                //html += '        <!-- Severe #ff0000, High #ff9900, Elevated #ffff00, Guarded #0066ff, Low #009933 -->';
                //html += '        &nbsp;<textarea id="txtBwExceptionLogDetails" rows="10" cols="200" style="padding-top:4px;"></textarea>';
                //html += '        <br /><br />';
                html += '       </td>';
                html += '   </tr>';
                html += '</table>';

                html += '<br /><br />';
                html += '<div id="divBwOrganizationEvents"></div>';

                



            }


            html += '<br /><br />';

            html += '<br /><br /><br /><br /><br />';


            // Render the html.
            thiz.element.html(html);

            $('#divBwTimerServicesManager').bwTimerServicesManager({ ReadOnly: true }); // 2-18-2022

            $('#divBwTardyParticipants').bwTardyParticipants({});

            $('#divBwInvitationsAdmin').bwInvitationsAdmin({});

            $('#divBwOrganizationEvents').bwOrganizationEvents({});

            $('#divBwExternallySharedFiles').bwExternallySharedFiles({});

            //thiz.cmdDisplayWebsiteErrorThreats();

            if (this.options.displayOnCreation == true) {

                thiz.cmdGetStatusOfWorkflowTimer();

                thiz.displayStatusOfFileServices();


                if (emailEnabled == true) {
                    var html = '';
                    html += '<span style="font-size:small;font-style:italic;">';
                    html += 'Email is ON';
                    html += '</span>';
                    document.getElementById('configurationBehaviorTurnOffEmailSlider_Description').innerHTML = html;
                    //
                    //var html = '';
                    //html += '<span style="color:green;">';
                    //html += 'xx emails have been sent so far today.';

                    //html += '                   &nbsp;&nbsp;';
                    //html += '                   <input type="button" value="View all emails..." onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdViewAllEmails\');" style="cursor:pointer;padding:5px 10px 5px 10px;" />';

                    //html += '</span>';
                    //document.getElementById('configurationBehaviorTurnOffEmailSlider_CurrentStatus').innerHTML = html;
                } else {
                    var html = '';
                    html += '<span style="color:darkgrey;font-size:small;font-style:italic;">';
                    html += 'Turning off email may be desired if you wish to review or moderate emails before they get sent.';
                    html += '<br />';
                    html += 'When turned off, automatic emails get put into the Pending folder (below), where you can choose to send them, or delete them.';
                    html += '</span>';
                    document.getElementById('configurationBehaviorTurnOffEmailSlider_Description').innerHTML = html;
                    //
                    //var html = '';
                    //html += '<span style="color:red;">';
                    //html += 'There are xx unsent emails.';

                    //html += '                   &nbsp;&nbsp;';
                    //html += '                   <input type="button" value="View unsent emails..." onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdViewUnsentEmails\');" style="cursor:pointer;padding:5px 10px 5px 10px;" />';
                    //html += '                   &nbsp;&nbsp;';
                    //html += '                   <input type="button" value="View Email Log..." onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdViewAllEmails\');" style="cursor:pointer;padding:5px 10px 5px 10px;" />';

                    //html += '</span>';
                    //document.getElementById('configurationBehaviorTurnOffEmailSlider_CurrentStatus').innerHTML = html;
                }
                var configurationBehaviorTurnOffEmailOptions = {
                    checked: emailEnabled,
                    show_labels: true,         // Should we show the on and off labels?
                    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                    on_label: '<span style="color:green;font-weight:bold;">ON</span>',            // Text to be displayed when checked
                    off_label: '<span style="color:red;font-weight:bold;">OFF</span>',          // Text to be displayed when unchecked
                    width: 50,                 // Width of the button in pixels
                    height: 22,                // Height of the button in pixels
                    button_width: 24,         // Width of the sliding part in pixels
                    clear_after: null         // Override the element after which the clearing div should be inserted 
                };
                $("input#configurationBehaviorTurnOffEmailSlider").switchButton(configurationBehaviorTurnOffEmailOptions);






                $('#configurationBehaviorTurnOffEmailSlider').change(function () {
                    // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.


                    var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                    var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');

                    //if (this.checked) {
                    //    debugger;
                    //    var returnVal = confirm("Are you sure?");
                    //    //$(this).prop("checked", returnVal);
                    //    $('#configurationBehaviorTurnOffEmailSlider').switchbutton('checked', returnVal);
                    //} else {
                    //    debugger;
                    //}
                    ////$('#textbox1').val(this.checked);



                    console.log('In configurationBehaviorTurnOffEmailSlider.change(). emailEnabled: ' + emailEnabled);
                    if (emailEnabled == true) {
                        emailEnabled = false;
                        var _workflowDetails = [];
                        _workflowDetails = {
                            bwParticipantEmail: participantEmail,
                            bwWorkflowAppId: workflowAppId,
                            bwEmailEnabled: emailEnabled.toString()
                        };
                        var operationUri = webserviceurl + "/bwworkflow/updateworkflowconfigurationbehavioremailenabled";
                        $.ajax({
                            url: operationUri,
                            type: "POST", 
                            data: _workflowDetails,
                            headers: {
                                "Accept": "application/json; odata=verbose"
                            },
                            success: function (data) {
                                console.log('In configurationBehaviorTurnOffEmailSlider.change(). ' + data);
                                if (data != 'SUCCESS') {
                                    displayAlertDialog(data);
                                } else {
                                    console.log('In configurationBehaviorTurnOffEmailSlider.change(). Set emailEnabled to: ' + emailEnabled);
                                    if (emailEnabled == true) {
                                        var html = '';
                                        html += '<span style="font-size:small;font-style:italic;">';
                                        html += 'Email is ON';
                                        html += '</span>';
                                        document.getElementById('configurationBehaviorTurnOffEmailSlider_Description').innerHTML = html;
                                        //
                                        //var html = '';
                                        ////html += '<span style="color:green;">';
                                        ////html += 'xx emails have been sent so far today.';

                                        //html += '                   &nbsp;&nbsp;';
                                        //html += '                   <input type="button" value="View all emails..." onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdViewAllEmails\');" style="cursor:pointer;padding:5px 10px 5px 10px;" />';

                                        ////html += '</span>';
                                        //document.getElementById('configurationBehaviorTurnOffEmailSlider_CurrentStatus').innerHTML = html;
                                    } else {
                                        var html = '';
                                        html += '<span style="color:red;font-size:small;font-style:italic;">';
                                        html += 'Turning off email may be desired if the ADMIN is processing requests, or experimenting with the system. NOTE that if the workflow timers are running, this will send pending emails once it is turned on.';
                                        html += '</span>';
                                        document.getElementById('configurationBehaviorTurnOffEmailSlider_Description').innerHTML = html;
                                        //
                                        //var html = '';
                                        ////html += '<span style="color:red;">';
                                        ////html += 'There are xx unsent emails.';

                                        //html += '                   &nbsp;&nbsp;';
                                        //html += '                   <input type="button" value="View unsent emails..." onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdViewAllEmails\');" style="cursor:pointer;padding:5px 10px 5px 10px;" />';
                                        //html += '                   &nbsp;&nbsp;';
                                        //html += '                   <input type="button" value="View all emails..." onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdViewAllEmails\');" style="cursor:pointer;padding:5px 10px 5px 10px;" />';

                                        ////html += '</span>';
                                        //document.getElementById('configurationBehaviorTurnOffEmailSlider_CurrentStatus').innerHTML = html;
                                    }
                                }
                            },
                            error: function (data, errorCode, errorMessage) {
                                displayAlertDialog('Error in my.js.configurationBehaviorTurnOffEmailSlider.change(): ' + errorCode + ' ' + errorMessage);
                            }
                        });
                    } else {

                        // ******************************** 12-26-2021
                        // We need to make a web service call to find out how many pending emails will be sent when emailing is turned back on. Display in this element: spanConfirmSendPendingEmailsDialogInvitationDescriptionText
                        // ********************************
                        $.ajax({
                            url: webserviceurl + "/bwwebapppendingemailcount/" + workflowAppId,
                            type: "GET",
                            contentType: 'application/json',
                            success: function (result) {
                                try {
                                    if (!(result && result.message)) {
                                        console.log('Error in xx.js.renderMonitoringTools():3: Unexpected response.');
                                        alert('Error in xx.js.renderMonitoringTools():3: Unexpected response.');
                                    } else {
                                        if (result.message != 'SUCCESS') {
                                            console.log('Error in xx.js.renderMonitoringTools():4: ' + result.message);
                                            alert('Error in xx.js.renderMonitoringTools():4: ' + result.message);
                                        } else {


                                            if (result.count > 0) {
                                                //
                                                // Since we made it here, that means there are pending emails that will get sent when email sending gets turned on. WARN THE USER HERE WITH THIS DIALOG.
                                                //
                                                console.log('Since we made it here, that means there are pending emails that will get sent when email sending gets turned on. WARN THE USER HERE WITH THIS DIALOG.');

                                                var html = '';
                                                html += 'There are ' + result.count + ' Pending Emails that will be sent when you turn email on. Are you certain you wish these emails to be sent?';
                                                $('#spanConfirmSendPendingEmailsDialogInvitationDescriptionText').html(html);




                                                //alert('xcx3242345565747'); // 2-17-2022







                                                $("#divConfirmSendPendingEmailsDialog").dialog({
                                                    modal: true,
                                                    resizable: false,
                                                    closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                                                    width: '500',
                                                    dialogClass: "no-close", // No close button in the upper right corner.
                                                    hide: false, // This means when hiding just disappear with no effects.
                                                    open: function () {
                                                        try {
                                                            $('.ui-widget-overlay').bind('click', function () {
                                                                $("#divConfirmSendPendingEmailsDialog").dialog('close');
                                                            });

                                                        } catch (e) {
                                                            console.log('Exception in renderMonitoringTools()xcx3254: ' + e.message + ', ' + e.stack);
                                                            alert('Exception in renderMonitoringTools()xcx3254: ' + e.message + ', ' + e.stack);
                                                        }
                                                    },
                                                    close: function () {
                                                        $('#divConfirmSendPendingEmailsDialog').dialog('destroy');
                                                    }
                                                });
                                                $("#divConfirmSendPendingEmailsDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
                                            } else {

                                                // Turn on the email!!!!!!!!!! // 2-15-2022
                                                emailEnabled = true;
                                                var _workflowDetails = [];
                                                _workflowDetails = {
                                                    bwParticipantEmail: participantEmail,
                                                    bwWorkflowAppId: workflowAppId,
                                                    bwEmailEnabled: emailEnabled.toString()
                                                };
                                                var operationUri = webserviceurl + "/bwworkflow/updateworkflowconfigurationbehavioremailenabled";
                                                $.ajax({
                                                    url: operationUri,
                                                    type: "POST",
                                                    data: _workflowDetails,
                                                    headers: {
                                                        "Accept": "application/json; odata=verbose"
                                                    },
                                                    success: function (data) {
                                                        console.log('In configurationBehaviorTurnOffEmailSlider.change(). ' + data);
                                                        if (data != 'SUCCESS') {
                                                            displayAlertDialog(data);
                                                        } else {
                                                            console.log('In configurationBehaviorTurnOffEmailSlider.change(). Set emailEnabled to: ' + emailEnabled);
                                                            if (emailEnabled == true) {
                                                                var html = '';
                                                                html += '<span style="font-size:small;font-style:italic;">';
                                                                html += 'Email is ON';
                                                                html += '</span>';
                                                                document.getElementById('configurationBehaviorTurnOffEmailSlider_Description').innerHTML = html;
                                                                //
                                                                //var html = '';
                                                                ////html += '<span style="color:green;">';
                                                                ////html += 'xx emails have been sent so far today.';

                                                                //html += '                   &nbsp;&nbsp;';
                                                                //html += '                   <input type="button" value="View all emails..." onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdViewAllEmails\');" style="cursor:pointer;padding:5px 10px 5px 10px;" />';

                                                                ////html += '</span>';
                                                                //document.getElementById('configurationBehaviorTurnOffEmailSlider_CurrentStatus').innerHTML = html;
                                                            } else {
                                                                var html = '';
                                                                html += '<span style="color:red;font-size:small;font-style:italic;">';
                                                                html += 'Turning off email may be desired if the ADMIN is processing requests, or experimenting with the system. NOTE that if the workflow timers are running, this will send pending emails once it is turned on.';
                                                                html += '</span>';
                                                                document.getElementById('configurationBehaviorTurnOffEmailSlider_Description').innerHTML = html;
                                                                //
                                                                //var html = '';
                                                                ////html += '<span style="color:red;">';
                                                                ////html += 'There are xx unsent emails.';

                                                                //html += '                   &nbsp;&nbsp;';
                                                                //html += '                   <input type="button" value="View unsent emails..." onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdViewAllEmails\');" style="cursor:pointer;padding:5px 10px 5px 10px;" />';
                                                                //html += '                   &nbsp;&nbsp;';
                                                                //html += '                   <input type="button" value="View all emails..." onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdViewAllEmails\');" style="cursor:pointer;padding:5px 10px 5px 10px;" />';

                                                                ////html += '</span>';
                                                                //document.getElementById('configurationBehaviorTurnOffEmailSlider_CurrentStatus').innerHTML = html;
                                                            }
                                                        }
                                                    },
                                                    error: function (data, errorCode, errorMessage) {
                                                        displayAlertDialog('Error in my.js.configurationBehaviorTurnOffEmailSlider.change(): ' + errorCode + ' ' + errorMessage);
                                                    }
                                                });



                                            }











                                        }
                                    }
                                } catch (e) {
                                    console.log('Exception in renderMonitoringTools(): ' + e.message + ', ' + e.stack);
                                    alert('Exception in renderMonitoringTools(): ' + e.message + ', ' + e.stack);
                                }
                            },
                            error: function (data, errorCode, errorMessage) {
                                displayAlertDialog('Error in xx.js.renderMonitoringTools():' + errorCode + ', ' + errorMessage);
                            }
                        });
















































                    }
                });






                //$('.bwMonitoringTools').bwMonitoringTools('cmdListPendingEmail2');
                //debugger;
                $('.bwMonitoringTools').bwMonitoringTools('cmdListErrorsOrSuggestions2');

                //$('.bwMonitoringTools').bwMonitoringTools('cmdListSentEmail2');
                //// This may be abke to go elsewhere.?
                //var options = {
                //    bwTenantId: tenantId,
                //    bwWorkflowAppId: workflowAppId,
                //    bwParticipantId: participantId,
                //    bwParticipantEmail: participantEmail,
                //    bwParticipantFriendlyName: participantFriendlyName,
                //    bwEnabledRequestTypes: bwEnabledRequestTypes
                //};
                //var $bwLocationPicker = $("#divBwLocationPicker").bwLocationPicker(options);

                //var options = {
                //    //    bwTenantId: tenantId,
                //    //    bwWorkflowAppId: workflowAppId,
                //    //    bwParticipantId: participantId,
                //    //    bwParticipantEmail: participantEmail,
                //    //    bwParticipantFriendlyName: participantFriendlyName,
                //    //    bwEnabledRequestTypes: bwEnabledRequestTypes
                //};
                $('#divBwEmailMonitor').bwEmailMonitor({});

            }




        } catch (e) {
            console.log('Exception in renderMonitoringTools(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderMonitoringTools(): ' + e.message + ', ' + e.stack);
        }
    },



    confirmSendPendingEmails: function () {
        try {
            console.log('In confirmSendPendingEmails().');

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');

            //debugger;
            //$('#configurationBehaviorTurnOffEmailSlider').switchButton({ checked: true });
            emailEnabled = true;
            var _workflowDetails = [];
            _workflowDetails = {
                bwParticipantEmail: participantEmail,
                bwWorkflowAppId: workflowAppId,
                bwEmailEnabled: 'true'
            };
            var operationUri = webserviceurl + "/bwworkflow/updateworkflowconfigurationbehavioremailenabled";
            $.ajax({
                url: operationUri,
                type: "POST", timeout: ajaxTimeout,
                data: _workflowDetails,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    //debugger;
                    console.log('In confirmSendPendingEmails(). ' + data);
                    $('#divConfirmSendPendingEmailsDialog').dialog('close');
                    if (data != 'SUCCESS') {
                        displayAlertDialog(data);
                    } else {
                        console.log('In confirmSendPendingEmails(). Set emailEnabled to: ' + emailEnabled);
                        if (emailEnabled == true) {
                            var html = '';
                            html += '<span style="font-size:small;font-style:italic;">';
                            html += 'Email is ON';
                            html += '</span>';
                            document.getElementById('configurationBehaviorTurnOffEmailSlider_Description').innerHTML = html;
                            //
                            //var html = '';
                            ////html += '<span style="color:green;">';
                            ////html += 'xx emails have been sent so far today.';

                            //html += '                   &nbsp;&nbsp;';
                            //html += '                   <input type="button" value="View all emails..." onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdViewAllEmails\');" style="cursor:pointer;padding:5px 10px 5px 10px;" />';

                            ////html += '</span>';
                            //document.getElementById('configurationBehaviorTurnOffEmailSlider_CurrentStatus').innerHTML = html;
                        } else {
                            var html = '';
                            html += '<span style="color:red;font-size:small;font-style:italic;">';
                            html += 'Turning off email may be desired if the ADMIN is processing requests, or experimenting with the system.xcx334';
                            html += '</span>';
                            document.getElementById('configurationBehaviorTurnOffEmailSlider_Description').innerHTML = html;
                            //
                            //var html = '';
                            ////html += '<span style="color:red;">';
                            ////html += 'There are xx unsent emails.';

                            //html += '                   &nbsp;&nbsp;';
                            //html += '                   <input type="button" value="View unsent emails..." onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdViewAllEmails\');" style="cursor:pointer;padding:5px 10px 5px 10px;" />';
                            //html += '                   &nbsp;&nbsp;';
                            //html += '                   <input type="button" value="View all emails..." onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdViewAllEmails\');" style="cursor:pointer;padding:5px 10px 5px 10px;" />';

                            ////html += '</span>';
                            //document.getElementById('configurationBehaviorTurnOffEmailSlider_CurrentStatus').innerHTML = html;
                        }
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in confirmSendPendingEmails(): ' + errorCode + ' ' + errorMessage);
                }
            });
        } catch (e) {
            console.log('Exception in confirmSendPendingEmails(): ' + e.message + ', ' + e.stack);
        }
    },
    cancelSendPendingEmails: function () {
        try {
            console.log('In cancelSendPendingEmails().');
            alert('In cancelSendPendingEmails().');
            //debugger;
            $('#configurationBehaviorTurnOffEmailSlider').switchButton({ checked: false });
            // $(this).prop("checked", returnVal);
            emailEnabled = false;
            $('#divConfirmSendPendingEmailsDialog').dialog('close');
        } catch (e) {
            console.log('Exception in cancelSendPendingEmails(): ' + e.message + ', ' + e.stack);
        }
    },
    cmdGetStatusOfWorkflowTimer: function () {
        $('#spanWorkflowTimerStatus').empty();
        $.ajax({
            url: webserviceurl + "/getstatusofworkflowtimer",
            type: "GET",
            contentType: 'application/json',
            success: function (data) {
                var html = '';
                if (data == 'started') {
                    // Green.
                    html += '<span style="color:#009933;">' + data + '</span>';
                    //html += '&nbsp;&nbsp;<input type="button" value="stop" onclick="cmdStopWorkflowTimer();" />';
                } else {
                    // Red.
                    html += '<span style="color:#ff0000;">' + data + '</span>';
                    //html += '&nbsp;&nbsp;<input type="button" value="start" onclick="cmdStartWorkflowTimer();" />';
                }
                $('#spanWorkflowTimerStatus').append(html);
            },
            error: function (data, errorCode, errorMessage) {
                displayAlertDialog('Error in admin.js.cmdGetStatusOfWorkflowTimer():' + errorCode + ', ' + errorMessage);
            }
        });
    },

    displayStatusOfFileServices: function () {
        var operationUri = globalUrlPrefix + globalUrlForWebServices + "/_files/getstatusoffileservices";
        $.ajax({
            url: operationUri,
            type: "GET",
            contentType: 'application/json',
            success: function (data) {
                var html = '';
                if (data == 'SUCCESS') {
                    // Green.
                    html += '<span style="color:#009933;font-size:xx-large;font-weight:bold;border:5px solid orange;border-radius:30px 30px 30px 30px;padding:10px 10px 10px 10px;">' + 'responding' + '</span>';
                } else {
                    // Red.
                    html += '<span style="color:#ff0000;font-size:xx-large;font-weight:bold;border:5px solid orange;border-radius:30px 30px 30px 30px;padding:10px 10px 10px 10px;">' + data + '</span>';
                }
                document.getElementById('spanAttachmentsServerStatus').innerHTML = html;
            },
            error: function (data, errorCode, errorMessage) {
                // Red.
                var html = '';
                html += '<span style="color:#ff0000;">' + errorMessage + '</span>';
                document.getElementById('spanAttachmentsServerStatus').innerHTML = html;
            }
        });
    },
    cmdDisplayWebsiteErrorThreats: function () {
        console.log('In cmdDisplayWebsiteErrorThreats().');
        //alert('In cmdDisplayWebsiteErrorThreats(). xcx2342');

        debugger;
        // Use ajax.
        $('#spanWebsiteErrorThreats').empty();
        var data = {
            //"bwTenantId": "null",
            //"bwTenantOwnerFacebookUserId": "test1",
            //"bwTenantOwnerLinkedInUserId": "test1",
            //"bwTenantOwnerFriendlyName": "Todd Hiltz1",
            //"bwTenantOwnerEmail": "todd1@capexworkflow.com",
            //"bwWorkflows": "null"
        };

        $.ajax({
            url: webserviceurl + "/websiteerrorthreatsummary",
            type: "DELETE",
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (data) {
                // Severe #ff0000, High #ff9900, Elevated #ffff00, Guarded #0066ff, Low #009933
                var severeErrorThreats = [];
                severeErrorThreats = new Array();
                //
                var highLevelErrorThreats = [];
                highLevelErrorThreats = new Array();
                //
                var elevatedErrorThreats = [];
                elevatedErrorThreats = new Array();
                //
                var guardedErrorThreats = [];
                guardedErrorThreats = new Array();
                //
                var lowErrorThreats = [];
                lowErrorThreats = new Array();
                // Fill the arrays.
                for (var i = 0; i < data.length; i++) {
                    var exceptionLogEntry = data[i].Message; // Todd currently we are only getting the message. The detail display will want more of the information from the BwExceptionLog table.
                    if (data[i].ErrorThreatLevel == 'severe') {
                        severeErrorThreats.push(exceptionLogEntry);
                        // Severe threats include:
                        // - failure to send an email.
                        // - failure of a web method to reach it's intended conslusion.
                        // ...
                    } else if (data[i].ErrorThreatLevel == 'high') {
                        highLevelErrorThreats.push(exceptionLogEntry);
                    } else if (data[i].ErrorThreatLevel == 'elevated') {
                        elevatedErrorThreats.push(exceptionLogEntry);
                    } else if (data[i].ErrorThreatLevel == 'guarded') {
                        guardedErrorThreats.push(exceptionLogEntry);
                    } else if (data[i].ErrorThreatLevel == 'low') {
                        lowErrorThreats.push(exceptionLogEntry);
                    }
                }
                var html = '';
                html += '<span>';


                // This is the drop-down span tag!
                //html += '<span style="font-size:xx-large;color:darkgray;white-space:nowrap;">';
                //html += 'Activity (Display ';
                //html += '<select id="xx" class="xdComboBox xdBehavior_Select" style="border-color: whitesmoke; color: rgb(38, 38, 38); font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif; color: gray;font-size: 20pt;font-weight:bold;cursor: pointer;">';
                //html += '  <option style="border-color: whitesmoke; color: rgb(38, 38, 38); font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 3em; font-weight: bold; cursor: pointer;">12 hours</option>';
                //html += '  <option style="border-color: whitesmoke; color: rgb(38, 38, 38); font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 3em; font-weight: bold; cursor: pointer;">24 hours</option>';
                //html += '  <option>36 hours</option>';
                //html += '  <option>48 hours</option>';
                //html += '  <option>60 hours</option>';
                //html += '  <option>72 hours</option>';
                //html += '  <option>84 hours</option>';
                //html += '  <option>96 hours</option>';
                //html += '  <option>1 week</option>';
                //html += '  <option>2 weeks</option>';
                //html += '  <option>3 weeks</option>';
                //html += '  <option>4 weeks</option>';
                //html += '  <option>2 months</option>';
                //html += '  <option>4 months</option>';
                //html += '  <option>6 months</option>';
                //html += '  <option>1 year</option>';
                //html += '  <option>2 years</option>';
                //html += '  <option>4 years</option>';
                //html += '  <option>6 years</option>';
                //html += '</select>';
                //html += ')</span>';



                html += '<table>';
                html += '  <tr>';




                html += '    <td>';

                html += '      <span style="color:white;background-color:skyblue;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdRefreshWebsiteErrorThreatDetails\');">Refresh';
                //html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png">';
                html += '      </span>';

                html += '    </td>';



                html += '    <td>';




                //html += '    <td>';

                ////html += '      <span style="color:white;background-color:#009933;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" onclick="cmdDisplayWebsiteErrorThreatDetailsxx(\'verbose\');">Refresh';
                //////html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png">';
                ////html += '      </span>';


                ////html += '      <span style="color:white;background-color:#009933;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" onclick="cmdDisplayWebsiteErrorThreatDetails(\'verbose\');">Verbose: <span>' + verboseErrorThreats.length + '</span></span>';
                html += '      <span style="color:white;background-color:#009933;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdDisplayWebsiteErrorThreatDetails\', \'verbose\');">Verbose: <span>#</span>';
                //html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png">';
                html += '      </span>';
                html += '    </td>';







                html += '    <td>';
                html += '      <span style="color:white;background-color:#ff0000;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" >';
                html += '           <span onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdDisplayWebsiteErrorThreatDetails\', \'severe\');">Severe: ' + severeErrorThreats.length + '</span>';
                if (severeErrorThreats.length > 0) {
                    html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdDeleteAllExceptionLogs\', \'severe\');">';
                }
                html += '      </span>';
                html += '    </td>';

                html += '    <td>';
                html += '      <span style="color:white;background-color:#ff9900;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" >';
                html += '           <span onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdDisplayWebsiteErrorThreatDetails\', \'high\');">High: ' + highLevelErrorThreats.length + '</span>';
                if (highLevelErrorThreats.length > 0) {
                    html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdDeleteAllExceptionLogs\', \'high\');">';
                }
                html += '      </span>';
                html += '    </td>';

                html += '    <td>';
                html += '      <span style="color:#ff9900;background-color:#ffff00;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" >';
                html += '           <span onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdDisplayWebsiteErrorThreatDetails\', \'elevated\');">Elevated (client): ' + elevatedErrorThreats.length + '</span>';
                if (elevatedErrorThreats.length > 0) {
                    html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdDeleteAllExceptionLogs\', \'elevated\');">';
                }
                html += '      </span>';
                html += '    </td>';

                html += '    <td>';
                html += '      <span style="color:white;background-color:#0066ff;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" >';
                html += '           <span onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdDisplayWebsiteErrorThreatDetails\', \'guarded\');">Guarded: ' + guardedErrorThreats.length + '</span>';
                if (guardedErrorThreats.length) {
                    html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdDeleteAllExceptionLogs\', \'guarded\');">';
                }
                html += '      </span>';
                html += '    </td>';

                html += '    <td>';
                html += '      <span style="color:white;background-color:#009933;font-size:xx-large;font-weight:bold;cursor:pointer;padding:0 15px 4px 15px;white-space:nowrap;" >';
                html += '           <span onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdDisplayWebsiteErrorThreatDetails\', \'low\');">Low: ' + lowErrorThreats.length + '</span>';
                if (lowErrorThreats.length) {
                    html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdDeleteAllExceptionLogs\', \'low\');">';
                }
                html += '      </span>';
                html += '    </td>';

                html += '  </tr>';
                html += '</table>';
                html += '</span>';

                //html += '&nbsp;<textarea id="txtBwExceptionLogDetails" rows="10" cols="120" style="padding-top:4px;"></textarea>';
                //debugger;
                $('#spanWebsiteErrorThreats').append(html);
            },
            error: function (data, errorCode, errorMessage) {
                displayAlertDialog('Error in admin.js.cmdDisplayWebsiteErrorThreats()::xcx21123-2:' + errorCode + ', ' + errorMessage);
            }
        });
    },


    cmdDeleteAllExceptionLogs: function (threatLevel) {
        try {
            // If we specify a threatLevel, just delete those ones, or otherwise delete the whole logs.
            var thiz = this;
            console.log('In cmdDeleteAllExceptionLogs().');
            //debugger;
            document.getElementById('txtBwExceptionLogDetails').value = '';
            if (threatLevel) {
                $.ajax({
                    url: webserviceurl + "/bwexceptionlogs/delete/" + threatLevel,
                    type: "DELETE",
                    contentType: 'application/json',
                    success: function (data) {
                        thiz.cmdDisplayWebsiteErrorThreats();
                        //$('#txtBwTimerLogs').empty();
                        //var html = '';
                        ////for (var i = 0; i < data.length; i++) {
                        ////    //html += 'Owner:' + data[i].bwTenantOwnerFriendlyName + ', FB User Id:' + data[i].bwTenantOwnerFacebookUserId + ', Tenant Id:' + data[i].bwTenantId + '<br/>';
                        ////    html += 'Log Entry Justification details:' + data[i].bwTimerLogEntryDetails + '<br/>';
                        ////    //html += '';
                        ////}
                        //html += 'DONE';
                        //$('#txtBwTimerLogs').append(html);
                    },
                    error: function (data, errorCode, errorMessage) {
                        displayAlertDialog('Error in admin.js.cmdDeleteAllExceptionLogs():' + errorCode + ', ' + errorMessage);
                    }
                });
            } else {
                $.ajax({
                    url: webserviceurl + "/bwexceptionlogs/delete",
                    type: "DELETE",
                    contentType: 'application/json',
                    success: function (data) {
                        thiz.cmdDisplayWebsiteErrorThreats();
                        //$('#txtBwTimerLogs').empty();
                        //var html = '';
                        ////for (var i = 0; i < data.length; i++) {
                        ////    //html += 'Owner:' + data[i].bwTenantOwnerFriendlyName + ', FB User Id:' + data[i].bwTenantOwnerFacebookUserId + ', Tenant Id:' + data[i].bwTenantId + '<br/>';
                        ////    html += 'Log Entry Justification details:' + data[i].bwTimerLogEntryDetails + '<br/>';
                        ////    //html += '';
                        ////}
                        //html += 'DONE';
                        //$('#txtBwTimerLogs').append(html);
                    },
                    error: function (data, errorCode, errorMessage) {
                        displayAlertDialog('Error in admin.js.cmdDeleteAllExceptionLogs():' + errorCode + ', ' + errorMessage);
                    }
                });
            }
        } catch (e) {
            console.log('Exception in cmdDeleteAllExceptionLogs(): ' + e.message + ', ' + e.stack);
        }
    },

    cmdDisplayWebsiteErrorThreatDetails: function (threatLevel) {
        try {
            console.log('In bwMonitoringTools.js.cmdDisplayWebsiteErrorThreatDetails(' + threatLevel + ').');
            //alert('In bwMonitoringTools.js.cmdDisplayWebsiteErrorThreatDetails(' + threatLevel + ').');

            var thiz = this;

            //var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            //debugger;
            $(this.element).find('#txtBwExceptionLogDetails').val(''); //empty(); // txtBwExceptionLogDetails
            $.ajax({
                url: webserviceurl + "/websiteerrorthreatsummary",
                type: "DELETE",
                contentType: 'application/json',
                success: function (data) {
                    try {
                        var html = '';
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].ErrorThreatLevel == threatLevel) {

                                // 3-1-2022
                                var timestamp4 = $('.bwAuthentication').bwAuthentication('getBudgetWorkflowStandardizedDate', data[i].Timestamp);
                                html += timestamp4 + '  ';

                                if (data[i].bwExceptionLogIp || data[i].bwExceptionLogParticipantId || data[i].bwWorkflowAppId) {
                                    html += 'IP: [' + data[i].bwExceptionLogIp + '] Participant: [' + data[i].bwExceptionLogParticipantId + '] Organization: [' + data[i].bwWorkflowAppId + ']';
                                }
                                html += '\n';

                                html += '' + data[i].Message + ',  ';
                                html += 'Source xcx3394-3: ' + data[i].Source + ' ';

                                html += '\n\n';

                            }
                        }
                        html += 'DONE';
                        $(thiz.element).find('#txtBwExceptionLogDetails').val(html); //append(html);
                    } catch (e) {
                        console.log('Exception in cmdDisplayWebsiteErrorThreatDetails(' + threatLevel + '):2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    //window.waitDialog.close();
                    //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
                    thiz.displayAlertDialog('Error in bwMonitoringTools.cmdDisplayWebsiteErrorThreatDetails():' + errorCode + ', ' + errorMessage);
                }
            });
        } catch (e) {
            console.log('Exception in bwMonitoringTools.cmdDisplayWebsiteErrorThreatDetails(' + threatLevel + '): ' + e.message + ', ' + e.stack);
        }
    },
    cmdRefreshWebsiteErrorThreatDetails: function (threatLevel) {
        try {
            console.log('In cmdRefreshWebsiteErrorThreatDetails(' +threatLevel + ').');

            this.renderMonitoringTools();

        //var thiz = this;
            ////debugger;
            ////$(this.element).find('#txtBwExceptionLogDetails').val(''); //empty(); // txtBwExceptionLogDetails
            //$('#txtBwExceptionLogDetails').val('');
            //$.ajax({
            //    url: webserviceurl + "/websiteerrorthreatsummary",
            //    type: "DELETE",
                //    contentType: 'application/json',
                    //    success: function (data) {
                    //        try {
                    //            var html = '';
                    //            for (var i = 0; i < data.length; i++) {
                    //                if (data[i].ErrorThreatLevel == threatLevel) {
                    //                    html += 'Timestamp: ' + data[i].Timestamp + ', ';
                    //                    html += 'Message: ' + data[i].Message + ',  ';
                    //                    html += 'Source: ' + data[i].Source + ' ';
                    //                    html += '\n\n';
                    //                }
                    //            }
                    //            debugger;
                    //            html += 'DONE';
                    //            //$(thiz.element).find('#txtBwExceptionLogDetails').val(html); //append(html);
                    //            $('#txtBwExceptionLogDetails').val(html); //append(html);
                    //        } catch (e) {
                    //            console.log('Exception in cmdDisplayWebsiteErrorThreatDetails(' + threatLevel + '):2: ' + e.message + ', ' + e.stack);
                    //        }
                    //    },
                    //    error: function (data, errorCode, errorMessage) {
                    //        //window.waitDialog.close();
                //        //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
                //        thiz.displayAlertDialog('Error in bwMonitoringTools.v():' + errorCode + ', ' + errorMessage);
                //    }
                //});
                } catch (e) {
                console.log('Exception in bwMonitoringTools.cmdRefreshWebsiteErrorThreatDetails(' +threatLevel + '): ' + e.message + ', ' +e.stack);
                }
                },
    cmdListAllWebsiteTrafficLogs: function () {
        try {
            console.log('In cmdListAllWebsiteTrafficLogs(). bwWorkflowAppId: ' + this.options.bwWorkflowAppId);
            $('#txtBwWebsiteTrafficLogs').empty();
            $.ajax({
                url: webserviceurl + "/bwwebsitetrafficlogsforwebapp/" + this.options.bwWorkflowAppId,
                type: "DELETE",
                contentType: 'application/json',
                //data: JSON.stringify(data),
                success: function (data) {
                    try {
                        var html = '';
                        for (var i = 0; i < data.length; i++) {
                            html += 'Log entry details:' + data[i].bwWebsiteTrafficLogEntryDetails;
                            html += ', ';
                            html += 'Logon provider:' + data[i].bwWebsiteTrafficLogUserLogonType;
                            html += ', ';
                            html += 'Id:' + data[i].bwWebsiteTrafficLogUserLogonTypeId;
                            html += ', ';
                            html += 'Referrer:' + data[i].bwWebsiteTrafficLogReferrer;
                            html += ', ';
                            html += 'Ip:' + data[i].bwWebsiteTrafficLogEntryIp;
                            html += ', ';
                            html += 'Timestamp:' + data[i].bwWebsiteTrafficLogEntryCreatedTimestamp;
                            html += ', ';
                            html += 'User agent:' + data[i].bwWebsiteTrafficLogUserAgent;
                            html += ', ';
                            html += 'Participant:' + data[i].ParticipantFriendlyName;
                            html += ', ';
                            html += 'Email:' + data[i].ParticipantEmail;
                            html += '\n\n';
                            //html += '';
                        }
                        html += 'DONE';
                        $('#txtBwWebsiteTrafficLogs').append(html);
                    } catch (e) {
                        console.log('Exception in cmdListAllWebsiteTrafficLogs(): ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    //window.waitDialog.close();
                    //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
                    displayAlertDialog('Error in admin.js.cmdListAllWebsiteTrafficLogs():' + errorCode + ', ' + errorMessage);
                }
            });
        } catch (e) {
            console.log('Exception in cmdListAllWebsiteTrafficLogs(): ' + e.message + ', ' + e.stack);
        }
    },
    cmdListPendingEmail: function () {
        try {
            console.log('In cmdListPendingEmail().');
            $('#txtBwPendingEmail').empty();
            $.ajax({
                url: webserviceurl + "/bwwebapppendingemail/" + this.options.bwWorkflowAppId,
                type: "DELETE",
                contentType: 'application/json',
                //data: JSON.stringify(data),
                success: function (data) {
                    try {
                        var html = '';
                        for (var i = 0; i < data.length; i++) {
                            html += 'FromEmailAddress:' + data[i].FromEmailAddress;
                            html += ', ';
                            html += 'ToParticipantEmail:' + data[i].ToParticipantEmail;
                            html += ', ';
                            html += 'RelatedRequestId:' + data[i].RelatedRequestId;
                            html += ', ';
                            html += 'Subject:' + data[i].Subject;
                            //html += ', ';
                            //html += 'Ip:' + data[i].bwWebsiteTrafficLogEntryIp;
                            //html += ', ';
                            //html += 'Timestamp:' + data[i].bwWebsiteTrafficLogEntryCreatedTimestamp;
                            //html += ', ';
                            //html += 'User agent:' + data[i].bwWebsiteTrafficLogUserAgent;
                            html += '\n\n';
                            //html += '';
                        }
                        html += 'DONE';
                        $('#txtBwPendingEmail').append(html);
                    } catch (e) {
                        console.log('Exception in cmdListPendingEmail(): ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in xx.js.cmdListPendingEmail():' + errorCode + ', ' + errorMessage);
                }
            });
        } catch (e) {
            console.log('Exception in cmdListPendingEmail(): ' + e.message + ', ' + e.stack);
        }
    },
    cmdListPendingEmail2: function () {
        try {
            //debugger;
            console.log('In cmdListPendingEmail2().');
            $('#spanPendingEmails').empty();
            $.ajax({
                url: webserviceurl + "/bwwebapppendingemail/" + this.options.bwWorkflowAppId,
                type: "DELETE",
                contentType: 'application/json',
                //data: JSON.stringify(data),
                success: function (data) {
                    try {
                        var html = '';
                        //html += 'Pending Emails:';
                        if (!data.length || data.length == 0) {
                            html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
                            html += '  There are no pending emails.';
                            html += '<span>';
                        } else {
                            //html += '<br />';
                            html += '<table style="width:100%;">';
                            html += '<colgroup>';
                            html += ' <col style="WIDTH:3%;" />';
                            html += ' <col style="WIDTH:2%;" />';
                            html += ' <col style="WIDTH:5%;" />';
                            html += ' <col style="WIDTH:10%;" />';
                            html += ' <col style="WIDTH:10%;" />';
                            html += ' <col style="WIDTH:70%;" />';
                            html += '</colgroup>';
                            html += '<tbody>';

                            html += '  <tr style="font-size:10pt;font-weight:normal;color:black;">';
                            html += '    <td></td>';
                            html += '    <td colspan="4">';
                            html += '       <span style="padding: 4px 4px 4px 4px;border:1px solid lightblue;cursor:pointer;" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdDisplayDeletePendingEmailsDialog\');">';
                            html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png">&nbsp;Delete';
                            html += '       </span>';
                            html += '    </td>';
                            html += '    <td style="text-align:right;">';
                            //html += '       <span class="spanButton" style="padding: 4px 4px 4px 4px;border:1px solid lightblue;cursor:pointer;color:darkgrey;" title="Click to send this email now!" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'sendEmailNow\');">';
                            html += '       <span class="spanButton" title="Click to send this email now!" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'sendEmailNow\');">';
                            html += '           ✉&nbsp;Send Now >xcx1';
                            html += '       </span>';
                            html += '   </td>';
                            html += '  </tr>';

                            html += '  <tr style="font-size:10pt;font-weight:normal;color:black;">';
                            html += '    <td style="vertical-align:top;"><input type="checkbox" id="checkboxTogglePendingEmailCheckboxes" onchange="$(\'.bwMonitoringTools\').bwMonitoringTools(\'togglePendingEmailCheckboxes\', this);" /></td>';
                            html += '    <td colspan="4"><span style="font-size:13pt;font-weight:bold;">Pending/Not Sent Emails</span></td>';

                            html += '    <td>';
                            html += '       <span id="spanSelectedEmailSubject" style="font-size:13pt;font-weight:bold;color:#95b1d3;"></span>';
                            html += '   </td>';

                            html += '  </tr>';

                            html += '   <tr>';
                            html += '       <td colspan="5" style="vertical-align:top;">';

                            html += '<div style="height:600px;overflow-y: scroll;">';
                            html += '<table>';

                            for (var i = 0; i < data.length; i++) {
                                //html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
                                html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'adminViewPendingEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwPendingEmailId + '\');" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';

                                html += '    <td style="vertical-align:top;"><input type="checkbox" class="pendingEmailCheckbox" bwpendingemailid="' + data[i].bwPendingEmailId + '" /></td>';
                                //debugger;
                                var timestamp = getFriendlyDateAndTime(data[i].Timestamp);
                                //html += '    <td style="white-space:nowrap;">' + timestamp + '</td>';
                                //html += '    <td>' + data[i].ToParticipantEmail + '</td>';
                                //html += '    <td>' + data[i].Subject + '</td>'; // html += '    <td>' + data[i].FromEmailAddress + '</td>';
                                //html += '    <td><input type="button" bwpendingemailid="xxpeid"' + data[i].EmailLink + '" value="View" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'adminViewPendingEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwPendingEmailId + '\');" /></td>';
                                html += '    <td colspan="4" style="border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px;">';
                                //debugger; // RelatedRequestId	ad19f2b8-707f-40ad-8228-a07d55a1ddac
                                html += '<span style="font-weight:bold;color:black;">' + data[i].ToParticipantFriendlyName + '<br />'; // + '<span style="color:#95b1d3;">'; // (' + data[i].ToParticipantEmail + ')';
                                html += '<span style="font-weight:normal;color:tomato;">' + timestamp + '</span>';
                                html += '       <br />';
                                //debugger;
                                //html += 'RelatedRequestId: ' + data[i].RelatedRequestId + '</span></span>';
                                html += '</span>';
                                //html += '       <br />';
                                html += '<span style="font-weight:lighter;color:#95b1d3;">' + data[i].Subject.substring(0, 55) + ' ...</span>';
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
                            html += '</div>';

                            html += '   </td>';

                            html += '    <td style="vertical-align:top;width:500px;">';
                            //html += '       <span id="spanSelectedEmailBody">[spanSelectedEmailBody]';



                            // Quill subject editor.
                            html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                            html += 'Subject:';
                            html += '</span>';
                            html += '<br />';
                            html += '   <div id="bwQuilltoolbarForSubject">';
                            html += '       <button id="btnQuill_InsertADataItemForSubject" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
                            html += '   </div>';
                            html += '   <div id="quillConfigureNewUserEmailsDialog_Subject" style="height:50px;"></div>'; // Quill.
                            // Quill body editor.
                            html += '<br />';
                            html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                            html += 'Body: xcx5';
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
                            //html += '   <br /><br />';
                            // Preview/Edit button.
                            //html += '   <div id="divNewUserEmailEditor_PreviewAndEditButton" class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;"></div>';
                            //html += '   <br /><br />';
                            html += '</div>';








                            //html += '       </span>';
                            html += '   </td>';

                            html += '</tr>';
                            html += '</tbody>';
                            html += '</table>';

                        }
                        $('#spanPendingEmails').append(html);
                    } catch (e) {
                        console.log('Exception in cmdListPendingEmail2(): ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in xx.js.cmdListPendingEmail2():' + errorCode + ', ' + errorMessage);
                }
            });
        } catch (e) {
            console.log('Exception in cmdListPendingEmail2(): ' + e.message + ', ' + e.stack);
        }
    },
    flagThisMessage: function (bwErrorOrSuggestionId, flagged) {
        try {
            console.log('In flagThisMessage().');
            var thiz = this;
            //debugger;
            //alert('In flagThisMessage(). This functionality is incomplete. Coming soon!');
            //debugger; // 7-4-2020 THIS FUNCTIONALITY IS INCOMPLETE
            if (flagged) {
                flagged = false;
            } else {
                flagged = true;
            }
            var bwErrorOrSuggestion = {
                bwWorkflowAppId: workflowAppId,
                ModifiedById: participantId,
                ModifiedByFriendlyName: participantFriendlyName,
                ModifiedByEmail: participantEmail,
                bwErrorOrSuggestionId: bwErrorOrSuggestionId,
                Flagged: flagged
            };
            var operationUri = this.options.operationUriPrefix + "_bw/updatemessageflag";
            $.ajax({
                url: operationUri,
                type: "POST",
                timeout: this.options.ajaxTimeout,
                data: bwErrorOrSuggestion,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (result) {
                    try {
                        //debugger;
                        if (result.message != 'SUCCESS') {
                            displayAlertDialog(result);
                        } else {
                            console.log('In flagThisMessage(). Set flag to ' + flagged);

                            // Errors and suggestions:
                            thiz.cmdListErrorsOrSuggestions2();
                        }
                    } catch (e) {
                        console.log('Exception in flagThisMessage(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in flagThisMessage(): ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in flagThisMessage(): ' + errorCode + ' ' + errorMessage);
                }
            });

        } catch (e) {
            console.log('Exception in flagThisMessage(): ' + e.message + ', ' + e.stack);
        }
    },
    pinRequestDialog: function () {
        try {
            console.log('In pinRequestDialog().');
            // This makes the dialog non-modal, so that it can be dragged around and the underlying functionality accessible. This removes the overlay that makes the dialog modal, and also removes the click event which would have originally closed the request dialog.
            // The idea is to be able to have multiple requests open at once!
            $('.ui-widget-overlay').unbind('click');
            $(".ui-widget-overlay").remove();

            //document.getElementById("divRequestFormDialog").id = "divRequestFormDialog_2";
            //// Now that we have renamed the dialog div, we need to put it back so it will be there the next time a user wants to view another request dialog.
            //var html = '';
            ////html += '<div style="display:none;" id="divRequestFormDialog">';
            //html += '        <table style="width:100%;">';
            //html += '            <tr>';
            //html += '                <td style="width:90%;">';
            //html += '                    <span id="divRequestFormDialogContent"></span>';
            //html += '                </td>';
            //html += '            </tr>';
            //html += '        </table>';
            //html += '        <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and zooming in on the iPhone. -->';
            //html += '        <br /><br />';
            ////html += '    </div>';


            ////
            //// THIS IS PART OF THE PIN FUNCTIONALITY 4-1-2020
            ////
            //var div = document.getElementById("divRequestFormDialog"); // 4-1-2020 12-28pm adt.
            //if (!div) { // for some reason this gets added twice to the DOM. Figure this out someday, but for now this seems to fix it and is a good safety I suppose.
            //    div = document.createElement('div');
            //    div.id = 'divRequestFormDialog';
            //    document.body.appendChild(div); // to place at end of document
            //}
            //var divDocument = div.contentDocument;
            //divDocument.body.innerHTML = html;


        } catch (e) {
            console.log('Exception in pinRequestDialog(): ' + e.message + ', ' + e.stack);

        }
    },
    setZoom: function (originalZoom, elementId) {
        try {
            console.log('In setZoom(' + originalZoom + ', ' + elementId + ')');
            var thiz = this;
            if (originalZoom > 20) { // Don't make any smaller than this!
                var zoom = originalZoom / 100;
                elementId = elementId.replace('_Parent', '');
                elementId += '_Parent'; // This just makes sure it is here! :)
                var el = document.getElementById(elementId); //("#elementId"); //.slider("element");

                transformOrigin = [0, 0];
                //try {
                //    el = el || instance.getContainer();
                //} catch(e) { }

                var p = ["webkit", "moz", "ms", "o"],
                    s = "scale(" + zoom + ")",
                    oString = (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%";

                for (var i = 0; i < p.length; i++) {
                    el.style[p[i] + "Transform"] = s;
                    el.style[p[i] + "TransformOrigin"] = oString;
                }

                el.style["transform"] = s;
                el.style["transformOrigin"] = oString;


                this.pinRequestDialog(); // Gets rid of the clickable greyed out background... Makes the dialog not-modal.

                //elementId.draggable("option", "containment", "window");
                //$(".selector").draggable("option", "containment", "window");

                // New attempt to use the entire browser screen/window. 4-24-2020.
                //window.addEventListener("resize", function () {
                //    try {

                //var body = document.getElementsByTagName('body')[0];
                //var clientWidth = body.scrollWidth; //offsetWidth; //getBoundingClientRect().width +; //body.clientWidth; offsetHeight
                ////var clientHeight = Math.max(body.scrollHeight, document.documentElement.clientHeight, window.innerHeight || 0); //offsetHeight; //getBoundingClientRect().height; //body.clientHeight;
                //var clientHeight = Math.max(
                //    body.scrollHeight, document.documentElement.scrollHeight,
                //    body.offsetHeight, document.documentElement.offsetHeight,
                //    body.clientHeight, document.documentElement.clientHeight
                //);

                //    } catch (e) {
                //        //alert('Exception in xxxxx: ' + e.message + ', ' + e.stack);
                //    }
                //}, false);


            }
        } catch (e) {
            console.log('Exception in setZoom(): ' + e.message + ', ' + e.stack);
        }
    },
    displayEmailInDialog: function (bwErrorOrSuggestionId) {
        try {
            console.log('In displayEmailInDialog().'); // elementId: ' + elementId);

            this.pinRequestDialog();
            var thiz = this;
            var requestDialogId = 'divEmailDialog_' + bwErrorOrSuggestionId;

            var html = '';
            //html += '<div style="display:none;" id="divRequestFormDialog">';
            html += '        <table style="width:100%;">';
            html += '            <tr>';
            html += '                <td style="width:90%;">';
            //html += '                    <span id="divRequestWorkflowAuditTrailContent"></span>';
            html += '                    <span id="divRequestFormContent"></span>';
            html += '                </td>';
            html += '            </tr>';
            html += '        </table>';
            html += '        <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and zooming in on the iPhone. -->';
            html += '        <br /><br />';
            //html += '    </div>';

            //
            // THIS IS PART OF THE PIN FUNCTIONALITY 4-1-2020
            //
            var div = document.getElementById(requestDialogId); // 4-1-2020 12-28pm adt.
            if (!div) { // for some reason this gets added twice to the DOM. Figure this out someday, but for now this seems to fix it and is a good safety I suppose.
                div = document.createElement('div');
                div.id = requestDialogId;
                document.body.appendChild(div); // to place at end of document
            }
            div.innerHTML = html;
            // Now that it is part of the DOM, we can display it!
            $('#' + requestDialogId).dialog({
                modal: true,
                resizable: true,
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                width: '1400px',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    try {

                        var element2 = document.getElementById(requestDialogId).parentNode; // This is the best way to get a handle on the jquery dialog.
                        var requestDialogParentId = requestDialogId + '_Parent'; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.
                        element2.id = requestDialogParentId; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.

                        // This creates the custom header/draggable bar on the dialog!!! 4-2-2020. // ☈ ☇ https://www.toptal.com/designers/htmlarrows/symbols/thunderstorm/
                        var html = '';
                        html += '<table style="width:100%;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequestDialog\');">'; // This click event is like "pin". Once the user clicks the header of the request dialog, it no longer is modal and persists on the screen until they choose to close it.
                        html += '   <tr>';
                        html += '       <td style="width:95%;">';
                        //html += '           <div id="slider_' + requestDialogId + '" style="width:20%;cursor:pointer;">[' + 'slider_' + requestDialogId + ']</div>';
                        html += '           <div id="slider_' + requestDialogId + '" style="width:20%;cursor:pointer;"></div>';
                        html += '       </td>';
                        html += '       <td style="white-space:nowrap;">';
                        html += '           <span class="bwPrintButton" id="spanRequestPrintButton" style="text-align:right;">';
                        html += '               <span title="print" class="printButton" style="font-size:18pt;" onclick="$(\'#divBwPrintButton\').bwPrintButton(\'PrintIndividualRequestReport\');">🖨&nbsp;</span>';
                        html += '           </span>';
                        //html += '           &nbsp;&nbsp;';
                        html += '           <span class="dialogXButton" style="font-size:25pt;cursor:pointer;width:100%;" onclick="$(\'#' + requestDialogId.replace('_Parent', '') + '\').dialog(\'close\');">X</span>';
                        html += '       </td>';
                        html += '   </tr>';
                        html += '</table>';

                        document.getElementById(requestDialogId).parentNode.querySelector(".ui-dialog-titlebar").innerHTML = html;

                        html = '';
                        html += '<div id="budgetrequestworkflowparticipantsdialog" class="context-menu-newrequesteditorxx" align="left" bwbudgetrequestid="" bwrequesttype="" orgid="" orgname="">';
                        html += '<table style="BORDER-TOP-STYLE: none; WORD-WRAP: break-word; BORDER-LEFT-STYLE: none; BORDER-COLLAPSE: collapse; TABLE-LAYOUT: fixed; BORDER-BOTTOM-STYLE: none; BORDER-RIGHT-STYLE: none; " class="xdFormLayout">';
                        html += '    <colgroup>';
                        html += '        <col style="" />';
                        html += '    </colgroup>';
                        html += '    <tbody>';
                        html += '        <tr class="xdTableContentRow">';
                        html += '            <td style="display:block;BORDER-TOP: #d8d8d8 1pt solid; BORDER-RIGHT: #d8d8d8 1pt solid; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 0px; PADDING-TOP: 0px; PADDING-LEFT: 0px; BORDER-LEFT: #d8d8d8 1pt solid; PADDING-RIGHT: 0px" class="xdTableContentCell">';
                        html += '                <div />';
                        html += '                <table style="width:100%;">';
                        html += '                    <tr>';
                        html += '                        <td colspan="4">';
                        //html += '                           <span id="' + requestDialogId + '_requestOrgClickableBreadcrumb" style="color:purple;font-size:8pt;">' + bwOrgName + '</span>';
                        html += '                       </td>';
                        html += '                    </tr>';
                        html += '                    <tr>';
                        html += '                        <td width="5px"></td>';
                        html += '                        <td>';
                        html += '                   <span>';

                        html += '                   </span>';
                        html += '                        </td>';
                        html += '                        <td colspan="2" style="text-align:right;">';
                        //html += '                           &nbsp;&nbsp;<span id="' + requestDialogParentId + '_BwRequestType" style="font-size:1em;">';
                        //html += '                               [._BwRequestType]';
                        //html += '                           </span>';
                        //html += '                           <br />';
                        //html += '                           <span id="' + requestDialogParentId + '_WorkflowGuid" style="color:gray;">[._WorkflowGuid]</span>';
                        html += '                        </td>';
                        html += '                    </tr>';
                        html += '                </table>';

                        html += '<span id="' + requestDialogParentId + '_Content"></span>';
                        document.getElementById(requestDialogId).innerHTML = html;

                        //$.ajax({
                        //    url: thiz.options.operationUriPrefix + "_bw/bwwebapperrororsuggestion2/" + workflowAppId + '/' + bwErrorOrSuggestionId,
                        //    type: "DELETE",
                        //    contentType: 'application/json',
                        //    success: function (data) {
                        //        try {
                        //            //debugger;

                        //            //
                        //            // CREATE THE EMAIL DISPLAY HERE!!!!!!!!!
                        //            //
                        //            var html = '';
                        //            //html += 'CREATE THE EMAIL DISPLAY HERExcx1!!!!!!!!!';
                        //            html += '<span id="quillErrorOrSuggestionDialog_Subject"></span>';
                        //            html += '<span id="quillErrorOrSuggestionDialog_Body"></span>';




                        //            document.getElementById(requestDialogParentId + '_Content').innerHTML = html;



                        //            // Display the email editors.
                        //            thiz.options.quillErrorOrSuggestionDialogSubjectEditor = new Quill('#quillErrorOrSuggestionDialog_Subject', {
                        //                modules: {
                        //                    //toolbar: '#bwQuilltoolbarForErrorOrSuggestionSubject'
                        //                },
                        //                //placeholder: 'The enhanced notification email editor functionality is coming soon...', 
                        //                theme: 'snow'
                        //            });

                        //            thiz.options.quillErrorOrSuggestionDialogBodyEditor = new Quill('#quillErrorOrSuggestionDialog_Body', {
                        //                modules: {
                        //                    //toolbar: '#bwQuilltoolbarErrorOrSuggestion'
                        //                },
                        //                //placeholder: 'The enhanced notification email editor functionality is coming soon...', 
                        //                theme: 'snow'
                        //            });

                        //            //debugger;
                        //            var emailTemplateForSubject = data[0].Description; //thiz.options.CurrentEmailTemplate.EmailTemplate.Subject;
                        //            //debugger;
                        //            //var emailTemplate = thiz.populateScreenshots(bwErrorOrSuggestionId, thiz.options.quillErrorOrSuggestionDialogBodyEditor);


                        //            if (emailTemplateForSubject && emailTemplateForSubject != '') {
                        //                thiz.options.quillErrorOrSuggestionDialogSubjectEditor.setText(emailTemplateForSubject);
                        //            } else {
                        //                thiz.options.quillErrorOrSuggestionDialogSubjectEditor.setText('xcx44');
                        //            }

                        //            if (emailTemplate && emailTemplate != '') {
                        //                thiz.options.quillErrorOrSuggestionDialogBodyEditor.setText(''); // Do this first so we don't get double the email!
                        //                //thiz.options.quill.root.innerHTML = emailTemplate; //.setText(emailTemplate);
                        //                //thiz.options.quill.setText(emailTemplate);
                        //                thiz.options.quillErrorOrSuggestionDialogBodyEditor.clipboard.dangerouslyPasteHTML(0, emailTemplate);
                        //            } else {
                        //                thiz.options.quillErrorOrSuggestionDialogBodyEditor.setText('');
                        //            }




                        //            //$(thiz.element).find('#displayederrororsuggestiondetails')[0].setAttribute('bwErrorOrSuggestionId', bwErrorOrSuggestionId);
                        //            ////$(thiz.element).find('#displayedemaildetails')[0].setAttribute('bwSentEmailId', 'xx');



                        //            //// Hook up this button event so that the user can insert data items into the email.
                        //            //var customButton1 = document.querySelector('#btnQuill_InsertADataItemForErrorOrSuggestion');
                        //            //customButton1.addEventListener('click', function () {
                        //            //    //console.log('btnQuill_InsertADataItem: This functionality is incomplete. Coming soon!');
                        //            //    thiz.displayEmailDataItemPickerDialog('subject');
                        //            //});

                        //            //thiz.options.quill = new Quill('#quillConfigureErrorOrSuggestionDialog_Body', {
                        //            //    modules: {
                        //            //        toolbar: '#bwQuilltoolbarErrorOrSuggestion'
                        //            //    },
                        //            //    //placeholder: 'The enhanced notification email editor functionality is coming soon...', 
                        //            //    theme: 'snow'
                        //            //});

                        //            //thiz.options.quillSubjectEditor.on('text-change', function (delta, oldDelta, source) {
                        //            //    console.log('In adminViewErrorOrSuggestion.quillSubjectEditor.text-change().')
                        //            //    //thiz.options.userHasMadeChangesToTheEmailTemplate = true;
                        //            //    //thiz.checkIfWeHaveToDisplayThePublishChangesButton();
                        //            //});

                        //            //thiz.options.quill.on('text-change', function (delta, oldDelta, source) {
                        //            //    console.log('In adminViewErrorOrSuggestion.quill.text-change().')
                        //            //    //thiz.options.userHasMadeChangesToTheEmailTemplate = true;
                        //            //    //thiz.checkIfWeHaveToDisplayThePublishChangesButton();
                        //            //});

                        //            //// Hook up this button event so that the user can insert data items into the email.
                        //            //var customButton = document.querySelector('#btnQuill_InsertADataItemForErrorOrSuggestion');
                        //            //customButton.addEventListener('click', function () {
                        //            //    console.log('In adminViewErrorOrSuggestion.quill.customButton.click().')
                        //            //    //console.log('btnQuill_InsertADataItem: This functionality is incomplete. Coming soon!');
                        //            //    //thiz.displayEmailDataItemPickerDialog('body');
                        //            //});
                        //            //var emailTemplateForSubject = data[0].Description; //thiz.options.CurrentEmailTemplate.EmailTemplate.Subject;





                        //            //// Formulate the html to show the screenshots.
                        //            ////debugger;
                        //            ////debugger;
                        //            var emailTemplate = thiz.populateScreenshots(bwErrorOrSuggestionId); // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Get this working! 7-3-2020
                        //            ////var html = '';
                        //            ////html += 'WELCOME TO THE SCREENSHOTS!!!!!!!!!<br />';
                        //            ////html += '<img src="' + thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/' + bwErrorOrSuggestionId + '/' + 'filename.png' + '" />';
                        //            ////var emailTemplate = html; //data[0].Body; //thiz.options.CurrentEmailTemplate.EmailTemplate.Body;





                        //            //if (emailTemplateForSubject && emailTemplateForSubject != '') {
                        //            //    thiz.options.quillSubjectEditor.setText(emailTemplateForSubject);
                        //            //} else {
                        //            //    thiz.options.quillSubjectEditor.setText('xcx44');
                        //            //}

                        //            ////if (emailTemplate && emailTemplate != '') {
                        //            ////    thiz.options.quill.setText(''); // Do this first so we don't get double the email!
                        //            ////    //thiz.options.quill.root.innerHTML = emailTemplate; //.setText(emailTemplate);
                        //            ////    //thiz.options.quill.setText(emailTemplate);
                        //            ////    thiz.options.quill.clipboard.dangerouslyPasteHTML(0, emailTemplate);
                        //            ////} else {
                        //            ////    thiz.options.quill.setText('');
                        //            ////}
                        //            ////debugger;
                        //            //var timestamp = getFriendlyDateAndTime(data[0].Created);
                        //            //var html = '';
                        //            //////debugger;
                        //            ////var toParticipantEmail = data[0].ToParticipantEmail.replace('<', '&lt;').replace('>', '&gt;');
                        //            //html += '<span style="color:black;">To:</span> ' + data[0].CreatedByFriendlyName + ' (' + data[0].CreatedByEmail + ')';
                        //            //html += '<br />';
                        //            //html += '<span style="font-weight:normal;font-size:10pt;color:black;">' + timestamp + '</span>';
                        //            //$(thiz.element).find('#spanSelectedErrorsAndSuggestionsSubject')[0].innerHTML = html;

                        //        } catch (e) {
                        //            console.log('Exception in displayEmailInDialog(): ' + e.message + ', ' + e.stack);
                        //        }
                        //    },
                        //    error: function (data, errorCode, errorMessage) {
                        //        displayAlertDialog('Error in xx.js.displayEmailInDialog():' + errorCode + ', ' + errorMessage);
                        //    }
                        //});

                        $("#slider_" + requestDialogId).slider({
                            min: 50,
                            max: 200,
                            value: 100, // It starts off full size.
                            slide: function (event, ui) {
                                thiz.setZoom(ui.value, requestDialogId);
                            }//,
                            //change: function (event, ui) {
                            //    thiz.setZoom(ui.value, requestDialogId);
                            //}
                        });
                        thiz.setZoom(100, requestDialogId);

                        $('.ui-widget-overlay').bind('click', function () {
                            $('#' + requestDialogId).dialog('close');
                        });

                    } catch (e) {
                        console.log('Exception in displayEmailInDialog().dialog.open(): ' + e.message + ', ' + e.stack);
                    }
                }
            });
            try {
                $('.ui-widget-overlay')[0].style.zIndex = 9;
                $('#' + requestDialogId).dialog().parents('.ui-dialog')[0].style.zIndex = 10; // THIS IS A HACK ?? IS THIS THE BEST PLACE FOR THIS ?? >>>>>>>>>>>>>>>>>>>>>>>>>>>> 2-15-2020
            } catch (e) {

            }
        } catch (e) {
            console.log('Exception in displayEmailInDialog(): ' + e.message + ', ' + e.stack);
        }
    },
    cmdListErrorsOrSuggestions2: function () {
        try {
            //debugger;
            console.log('In cmdListErrorsOrSuggestions2().');
            $('#spanErrorsOrSuggestions').empty();
            //debugger;
            $.ajax({
                url: this.options.operationUriPrefix + "_bw/bwwebapperrororsuggestion/" + workflowAppId,
                type: "DELETE",
                contentType: 'application/json',
                timeout: this.options.ajaxTimeout,
                success: function (data) {
                    try {


                        //debugger; // In cmdListErrorsOrSuggestions2 xcx1


                        var html = '';
                        //html += 'Pending Emails:';
                        if (!data.result.length || data.result.length == 0) {
                            html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
                            html += '  There are no reported errors or suggestions.';
                            html += '<span>';
                        } else {
                            //html += '<br />';
                            html += '<table style="width:100%;">';
                            html += '<colgroup>';
                            html += ' <col style="WIDTH:3%;" />';
                            html += ' <col style="WIDTH:2%;" />';
                            html += ' <col style="WIDTH:5%;" />';
                            html += ' <col style="WIDTH:10%;" />';
                            html += ' <col style="WIDTH:10%;" />';
                            html += ' <col style="WIDTH:70%;" />';
                            html += '</colgroup>';
                            html += '<tbody>';

                            html += '  <tr style="font-size:10pt;font-weight:normal;color:black;">';
                            html += '    <td></td>';
                            html += '    <td colspan="4">';
                            html += '       <span style="padding: 4px 4px 4px 4px;border:1px solid lightblue;cursor:pointer;" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdDisplayDeleteErrorsAndSuggestionsDialog\');">';
                            html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png">&nbsp;Delete';
                            html += '       </span>';
                            html += '    </td>';
                            html += '    <td style="text-align:right;">';
                            html += '       <span style="padding: 4px 4px 4px 4px;border:1px solid lightblue;cursor:pointer;color:darkgrey;" title="Click to send a response now!" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'sendErrorsAndSuggestionsResponseNow\');">';
                            html += '           ✉&nbsp;Respond Now >';
                            html += '       </span>';
                            html += '   </td>';
                            html += '  </tr>';

                            html += '  <tr style="font-size:10pt;font-weight:normal;color:black;">';
                            html += '    <td style="vertical-align:top;"><input type="checkbox" id="checkboxToggleErrorsAndSuggestionsCheckboxes" onchange="$(\'.bwMonitoringTools\').bwMonitoringTools(\'toggleErrorsAndSuggestionsCheckboxes\', this);" /></td>';
                            html += '    <td colspan="4"><span style="font-size:13pt;font-weight:bold;">Errors and Suggestions</span></td>';

                            html += '    <td>';
                            html += '       <span id="spanSelectedErrorsAndSuggestionsSubject" style="font-size:13pt;font-weight:bold;color:#95b1d3;"></span>';
                            html += '   </td>';

                            html += '  </tr>';

                            html += '   <tr>';
                            html += '       <td colspan="5" style="vertical-align:top;">';

                            html += '<div style="height:600px;overflow-y: scroll;">';
                            html += '<table>';

                            for (var i = 0; i < data.result.length; i++) {
                                //debugger;
                                //html += '  <tr ondblclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'displayEmailInDialog\', \'' + data.result[i].bwErrorOrSuggestionId + '\');" style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'adminViewErrorOrSuggestion\', \'' + participantId + '\', \'' + participantFriendlyName + '\',\'' + participantEmail + '\',\'' + data.result[i].bwErrorOrSuggestionId + '\');">';
                                //html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" >';
                                html += '  <tr style="cursor:pointer;font-size:6pt;font-weight:normal;color:black;" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'transparent\';" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'adminViewErrorOrSuggestion\', \'' + participantId + '\', \'' + participantFriendlyName + '\',\'' + participantEmail + '\',\'' + data.result[i].bwErrorOrSuggestionId + '\');">';



                                html += '    <td style="vertical-align:top;"><input type="checkbox" class="pendingErrorOrSuggestionCheckbox" bwerrororsuggestionid="' + data.result[i].bwErrorOrSuggestionId + '" /></td>';
                                //debugger;
                                var timestamp = getFriendlyDateAndTime(data.result[i].Created);
                                //html += '    <td style="white-space:nowrap;">' + timestamp + '</td>';
                                //html += '    <td>' + data[i].ToParticipantEmail + '</td>';
                                //html += '    <td>' + data[i].Subject + '</td>'; // html += '    <td>' + data[i].FromEmailAddress + '</td>';
                                //html += '    <td><input type="button" bwpendingemailid="xxpeid"' + data[i].EmailLink + '" value="View" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'adminViewPendingEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwPendingEmailId + '\');" /></td>';
                                html += '    <td colspan="4" style="border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px;" >';

                                if (data.result[i].Flagged) {
                                    //debugger;
                                    html += '<span style="font-weight:bold;color:black;width:100%;">' + data.result[i].CreatedByFriendlyName + '&nbsp;&nbsp;&nbsp;&nbsp;';
                                    html += '<span title="Flag this message..." style="font-size:13pt;width:100%;text-align:right;color:red;" onmouseover="this.style.color=\'aqua\';" onmouseout="this.style.color=\'red\';" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'flagThisMessage\', \'' + data.result[i].bwErrorOrSuggestionId + '\', true);">⚑</span>';
                                } else {
                                    //debugger;
                                    html += '<span style="font-weight:bold;color:black;width:100%;">' + data.result[i].CreatedByFriendlyName + '&nbsp;&nbsp;&nbsp;&nbsp;';
                                    html += '<span title="Flag this message..." style="font-size:13pt;width:100%;text-align:right;" onmouseover="this.style.color=\'aqua\';" onmouseout="this.style.color=\'black\';" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'flagThisMessage\', \'' + data.result[i].bwErrorOrSuggestionId + '\', false);">⚐</span>';
                                }
                                html += '   <br />';
                                html += '   <span style="font-weight:normal;color:tomato;">' + timestamp + '</span>';
                                html += '   <br />';
                                html += '</span>';

                                html += '<span style="font-weight:lighter;color:#95b1d3;">' + data.result[i].Description.substring(0, 55) + ' ...</span>';
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
                            html += '</div>';

                            html += '   </td>';

                            html += '    <td style="vertical-align:top;width:500px;">';
                            //html += '       <span id="spanSelectedEmailBody">[spanSelectedEmailBody]';



                            // Quill subject editor.
                            html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                            html += 'Error or suggestion xcx1:';
                            html += '</span>';
                            html += '<br />';
                            html += '   <div id="bwQuilltoolbarForErrorOrSuggestionSubject">';
                            html += '       <button id="btnQuill_InsertADataItemForErrorOrSuggestion" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
                            html += '   </div>';
                            html += '   <div id="quillConfigureNewUserErrorOrSuggestionDialog_Subject" style="height:50px;"></div>'; // Quill.
                            // Quill body editor.
                            html += '<br />';
                            html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                            html += 'Screenshot(s): [8-15-2021 Screenshots don\'t function the way we want in the editor. Break them out seperately. In populateScreenshots().]';
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
                            html += '   <div id="quillConfigureErrorOrSuggestionDialog_Body" style="height:375px;"></div>'; // Quill.
                            // Save button.
                            //html += '   <br />';
                            //html += '   <span id="spanConfigureEmailNotificationsDialogSaveButton">[spanConfigureEmailNotificationsDialogSaveButton]</span>'; // ☑ 
                            //html += '   <br /><br />';
                            // Preview/Edit button.
                            //html += '   <div id="divNewUserEmailEditor_PreviewAndEditButton" class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;"></div>';
                            //html += '   <br /><br />';
                            html += '</div>';







                            //html += '       </span>';
                            html += '   </td>';

                            html += '</tr>';
                            html += '</tbody>';
                            html += '</table>';


                            // 8-15-2021
                            html += '<div id="divErrorOrSuggestion_Attachments">';
                            html += '[divErrorOrSuggestion_Attachments]';
                            html += '</div>';



                        }
                        $('#spanErrorsOrSuggestions').append(html);
                    } catch (e) {
                        console.log('Exception in cmdListErrorsOrSuggestions2(): ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in xx.js.cmdListErrorsOrSuggestions2():' + errorCode + ', ' + errorMessage);
                }
            });
        } catch (e) {
            console.log('Exception in cmdListErrorsOrSuggestions2(): ' + e.message + ', ' + e.stack);
        }
    },
    cmdListSentEmail2: function () {
        try {
            console.log('In cmdListSentEmail2().');
            $('#spanSentEmails').empty();
            $.ajax({
                //url: webserviceurl + "/bwwebapppendingemail/" + this.options.bwWorkflowAppId,
                url: webserviceurl + "/bwwebappsentemail/" + this.options.bwWorkflowAppId,
                type: "DELETE",
                contentType: 'application/json',
                //data: JSON.stringify(data),
                success: function (data) {
                    try {
                        //debugger;
                        var html = '';
                        //html += 'Pending Emails:';
                        if (!data.length || data.length == 0) {
                            html += '<span style="font-size:10pt;font-weight:normal;color:black;">';
                            html += '  There are no sent emails.';
                            html += '<span>';
                        } else {
                            //html += '<br />';
                            html += '<table style="width:600px;">';

                            html += '  <tr style="font-size:10pt;font-weight:normal;color:black;">';
                            html += '    <td></td>';
                            html += '    <td colspan="4">';
                            html += '       <span style="padding: 4px 4px 4px 4px;border:1px solid lightblue;cursor:pointer;" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdDisplayDeleteSentEmailsDialog\');">';
                            html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png">&nbsp;Delete xcx3';
                            html += '       </span>';
                            html += '    </td>';
                            html += '  </tr>';

                            html += '  <tr style="font-size:10pt;font-weight:normal;color:black;">';
                            html += '    <td><input type="checkbox" id="checkboxToggleSentEmailCheckboxes" onchange="$(\'.bwMonitoringTools\').bwMonitoringTools(\'toggleSentEmailCheckboxes\', this);" /></td>';
                            html += '    <td></td>';

                            html += '    <td>To</td>';
                            html += '    <td>Subject</td>';
                            //html += '    <td>From</td>';
                            html += '    <td></td>';
                            html += '  </tr>';
                            for (var i = 0; i < data.length; i++) {
                                html += '  <tr style="cursor:pointer;font-size:8pt;font-weight:normal;color:black;" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'renderParticipantRoleMultiPickerInACircle\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\');">';
                                html += '    <td><input type="checkbox" class="sentEmailCheckbox" bwsentemailid="' + data[i].bwSentEmailId + '" /></td>';
                                var timestamp = getFriendlyDateAndTime(data[i].Timestamp);
                                //var timestampFriendlyTime = data[i].Timestamp.split('T')[1].split('.')[0];
                                html += '    <td style="white-space:nowrap;">' + timestamp + '</td>';

                                html += '    <td>' + data[i].ToParticipantEmail + '</td>';
                                html += '    <td>' + data[i].Subject + '</td>';
                                //html += '    <td>' + data[i].FromEmailAddress + '</td>';
                                html += '    <td><input type="button" bwsentemailid="xxpeid"' + data[i].EmailLink + '" value="View" onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'adminViewSentEmail\', \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwSentEmailId + '\');" /></td>';
                                html += '  </tr>';
                            }
                            html += '</table>';
                        }
                        $('#spanSentEmails').append(html);
                    } catch (e) {
                        console.log('Exception in cmdListSentEmail2(): ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in xx.js.cmdListSentEmail2():' + errorCode + ', ' + errorMessage);
                }
            });
        } catch (e) {
            console.log('Exception in cmdListSentEmail2(): ' + e.message + ', ' + e.stack);
        }
    },
    adminViewPendingEmail: function (originElementId, bwParticipantId, bwParticipantFriendlyName, bwParticipantEmail, bwPendingEmailId) {
        try {
            //debugger;
            console.log('In adminViewPendingEmail(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ', bwPendingEmailId: ' + bwPendingEmailId);
            var thiz = this;
            $.ajax({
                url: webserviceurl + "/bwwebapppendingemail2/" + this.options.bwWorkflowAppId + '/' + bwPendingEmailId,
                type: "DELETE",
                contentType: 'application/json',
                success: function (data) {
                    try {
                        //debugger;
                        $(thiz.element).find('#displayedemaildetails')[0].setAttribute('bwPendingEmailId', bwPendingEmailId);
                        //$(thiz.element).find('#displayedemaildetails')[0].setAttribute('bwSentEmailId', 'xx');

                        // Display the email editor.
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

                        thiz.options.quill = new Quill('#quillConfigureNewUserEmailsDialog_Body', {
                            modules: {
                                toolbar: '#bwQuilltoolbar'
                            },
                            //placeholder: 'The enhanced notification email editor functionality is coming soon...', 
                            theme: 'snow'
                        });

                        thiz.options.quillSubjectEditor.on('text-change', function (delta, oldDelta, source) {
                            console.log('In adminViewPendingEmail.quillSubjectEditor.text-change().')
                            //thiz.options.userHasMadeChangesToTheEmailTemplate = true;
                            //thiz.checkIfWeHaveToDisplayThePublishChangesButton();
                        });

                        thiz.options.quill.on('text-change', function (delta, oldDelta, source) {
                            console.log('In adminViewPendingEmail.quill.text-change().')
                            //thiz.options.userHasMadeChangesToTheEmailTemplate = true;
                            //thiz.checkIfWeHaveToDisplayThePublishChangesButton();
                        });

                        // Hook up this button event so that the user can insert data items into the email.
                        var customButton = document.querySelector('#btnQuill_InsertADataItem');
                        customButton.addEventListener('click', function () {
                            console.log('In adminViewPendingEmail.quill.customButton.click().')
                            //console.log('btnQuill_InsertADataItem: This functionality is incomplete. Coming soon!');
                            //thiz.displayEmailDataItemPickerDialog('body');
                        });

                        var emailTemplateForSubject = data[0].Subject; //thiz.options.CurrentEmailTemplate.EmailTemplate.Subject;
                        var emailTemplate = data[0].Body; //thiz.options.CurrentEmailTemplate.EmailTemplate.Body;

                        if (emailTemplateForSubject && emailTemplateForSubject != '') {
                            thiz.options.quillSubjectEditor.setText(emailTemplateForSubject);
                        } else {
                            thiz.options.quillSubjectEditor.setText('xcx44');
                        }

                        if (emailTemplate && emailTemplate != '') {
                            thiz.options.quill.setText(''); // Do this first so we don't get double the email!
                            //thiz.options.quill.root.innerHTML = emailTemplate; //.setText(emailTemplate);
                            //thiz.options.quill.setText(emailTemplate);
                            thiz.options.quill.clipboard.dangerouslyPasteHTML(0, emailTemplate);
                        } else {
                            thiz.options.quill.setText('');
                        }

                        var timestamp = getFriendlyDateAndTime(data[0].Timestamp);
                        var html = '';
                        //debugger;
                        //var toParticipantEmail = data[0].ToParticipantEmail.replace('<', '&lt;').replace('>', '&gt;');
                        html += '<span style="color:black;">To:</span> ' + data[0].ToParticipantFriendlyName + ' (' + data[0].ToParticipantEmail + ')';
                        html += '<br />';
                        html += '<span style="font-weight:normal;font-size:10pt;color:black;">' + timestamp + '</span>';
                        $(thiz.element).find('#spanSelectedEmailSubject')[0].innerHTML = html;

                    } catch (e) {
                        console.log('Exception in adminViewPendingEmail(): ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in xx.js.adminViewPendingEmail():' + errorCode + ', ' + errorMessage);
                }
            });
        } catch (e) {
            console.log('Exception in adminViewPendingEmail(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ': ' + e.message + ', ' + e.stack);
        }
    },
    adminViewErrorOrSuggestion: function (bwParticipantId, bwParticipantFriendlyName, bwParticipantEmail, bwErrorOrSuggestionId) {
        try {
            //debugger;
            console.log('In adminViewErrorOrSuggestion(). bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ', bwErrorOrSuggestionId: ' + bwErrorOrSuggestionId);
            var thiz = this;

            //
            // THIS IS ONLY ADMIN functionality.
            //
            debugger;
            //var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
            //var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            //var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            //var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            //var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            $.ajax({
                url: webserviceurl + "/bwwebapperrororsuggestion2/" + workflowAppId + '/' + bwErrorOrSuggestionId,
                type: "DELETE",
                contentType: 'application/json',
                success: function (data) {
                    try {
                        //debugger;
                        $(thiz.element).find('#displayederrororsuggestiondetails')[0].setAttribute('bwErrorOrSuggestionId', bwErrorOrSuggestionId);
                        //$(thiz.element).find('#displayedemaildetails')[0].setAttribute('bwSentEmailId', 'xx');

                        // Display the email editor.
                        thiz.options.quillSubjectEditor = new Quill('#quillConfigureNewUserErrorOrSuggestionDialog_Subject', {
                            modules: {
                                toolbar: '#bwQuilltoolbarForErrorOrSuggestionSubject'
                            },
                            //placeholder: 'The enhanced notification email editor functionality is coming soon...', 
                            theme: 'snow'
                        });

                        // Hook up this button event so that the user can insert data items into the email.
                        var customButton1 = document.querySelector('#btnQuill_InsertADataItemForErrorOrSuggestion');
                        customButton1.addEventListener('click', function () {
                            //console.log('btnQuill_InsertADataItem: This functionality is incomplete. Coming soon!');
                            thiz.displayEmailDataItemPickerDialog('subject');
                        });

                        thiz.options.quill = new Quill('#quillConfigureErrorOrSuggestionDialog_Body', {
                            modules: {
                                toolbar: '#bwQuilltoolbarErrorOrSuggestion'
                            },
                            //placeholder: 'The enhanced notification email editor functionality is coming soon...', 
                            theme: 'snow'
                        });

                        thiz.options.quillSubjectEditor.on('text-change', function (delta, oldDelta, source) {
                            console.log('In adminViewErrorOrSuggestion.quillSubjectEditor.text-change().')
                            //thiz.options.userHasMadeChangesToTheEmailTemplate = true;
                            //thiz.checkIfWeHaveToDisplayThePublishChangesButton();
                        });

                        thiz.options.quill.on('text-change', function (delta, oldDelta, source) {
                            console.log('In adminViewErrorOrSuggestion.quill.text-change().')
                            //thiz.options.userHasMadeChangesToTheEmailTemplate = true;
                            //thiz.checkIfWeHaveToDisplayThePublishChangesButton();
                        });

                        // Hook up this button event so that the user can insert data items into the email.
                        var customButton = document.querySelector('#btnQuill_InsertADataItemForErrorOrSuggestion');
                        customButton.addEventListener('click', function () {
                            console.log('In adminViewErrorOrSuggestion.quill.customButton.click().')
                            //console.log('btnQuill_InsertADataItem: This functionality is incomplete. Coming soon!');
                            //thiz.displayEmailDataItemPickerDialog('body');
                        });
                        var emailTemplateForSubject = data[0].Description; //thiz.options.CurrentEmailTemplate.EmailTemplate.Subject;





                        // Formulate the html to show the screenshots.
                        //debugger;
                        debugger;
                        var emailTemplate = thiz.populateScreenshots(bwErrorOrSuggestionId, thiz.options.quill); // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Get this working! 7-3-2020
                        //var html = '';
                        //html += 'WELCOME TO THE SCREENSHOTS!!!!!!!!!<br />';
                        //html += '<img src="' + thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/' + bwErrorOrSuggestionId + '/' + 'filename.png' + '" />';
                        //var emailTemplate = html; //data[0].Body; //thiz.options.CurrentEmailTemplate.EmailTemplate.Body;





                        if (emailTemplateForSubject && emailTemplateForSubject != '') {
                            thiz.options.quillSubjectEditor.setText(emailTemplateForSubject);
                        } else {
                            thiz.options.quillSubjectEditor.setText('xcx44');
                        }

                        //if (emailTemplate && emailTemplate != '') {
                        //    thiz.options.quill.setText(''); // Do this first so we don't get double the email!
                        //    //thiz.options.quill.root.innerHTML = emailTemplate; //.setText(emailTemplate);
                        //    //thiz.options.quill.setText(emailTemplate);
                        //    thiz.options.quill.clipboard.dangerouslyPasteHTML(0, emailTemplate);
                        //} else {
                        //    thiz.options.quill.setText('');
                        //}
                        //debugger;
                        var timestamp = getFriendlyDateAndTime(data[0].Created);
                        var html = '';
                        ////debugger;
                        //var toParticipantEmail = data[0].ToParticipantEmail.replace('<', '&lt;').replace('>', '&gt;');
                        html += '<span style="color:black;">To:</span> ' + data[0].CreatedByFriendlyName + ' (' + data[0].CreatedByEmail + ')';
                        html += '<br />';
                        html += '<span style="font-weight:normal;font-size:10pt;color:black;">' + timestamp + '</span>';
                        $(thiz.element).find('#spanSelectedErrorsAndSuggestionsSubject')[0].innerHTML = html;

                    } catch (e) {
                        console.log('Exception in adminViewErrorOrSuggestion(): ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in xx.js.adminViewErrorOrSuggestion():' + errorCode + ', ' + errorMessage);
                }
            });
        } catch (e) {
            console.log('Exception in adminViewErrorOrSuggestion(). originElementId: ' + originElementId + ', bwParticipantId: ' + bwParticipantId + ', bwParticipantFriendlyName: ' + bwParticipantFriendlyName + ', bwParticipantEmail: ' + bwParticipantEmail + ': ' + e.message + ', ' + e.stack);
        }
    },
    showRowHoverDetails_ForAttachment: function () {
        try {


            console.log('In showRowHoverDetails().');

            var thiz = this;
            // Remove the event handler from <div>
            //document.getElementById("myDIV").removeEventListener("mousemove", myFunction);
            //var myFunction = function () { };
            //element.removeEventListener('onmouseout', myFunction);

            //
            // Display the header for the hover over details dialog.
            var html = '';
            html += '<table>';
            html += '  <tr>';
            html += '    <td style="text-align:center;">';
            html += '      <img id="imgRequestOrgImage2" src="' + thiz.options.operationUriPrefix + 'images/corporeal.png" style="width:180px;height:180px;" />';

            html += '        <br />';
            // The "under the org image" text
            html += '<span style="font-size:10pt;">';
            //html += workflowAppTitle + '<br />' + bwOrgName;
            html += '</span>';

            html += '    </td>';
            html += '    <td style="vertical-align:top;">';
            html += '      <span id="spanRowHoverDetails_AuditTrail_CurrentRACIStatus" style="font-size:10pt;">';
            html += '        <span style="font-size:30pt;font-weight:bold;">' + '' + '</span>';
            html += '        <br />';
            //html += '        [spanRowHoverDetails_AuditTrail_CurrentRACIStatus_xcx1]';
            html += '      </span>';
            html += '    </td>';
            html += '  </tr>';
            html += '</table>';
            document.getElementById('spanRowHoverDetailsDialogTitleAndCurrentRACIStatus').innerHTML = html;
            // End: Display the header for the hover over details dialog.
            //


            //html = projectTitle + '<br />' + briefDescriptionOfProject;
            //document.getElementById('spanRowHoverDetails_DialogContents').innerHTML = html;


            $('#divRowHoverDetails').dialog({
                resizable: false,
                draggable: false,
                width: "760",
                open: function (event, ui) {

                    $('#divRowHoverDetails').unbind('click', function () { });

                    $(this).bind('click', function () {
                        console.log('Displaying the request in the dialog [calling displayArInDialog()].');
                        $('.bwRequest').bwRequest('displayArInDialog', thiz.options.operationUriPrefix, bwBudgetRequestId, title, projectTitle, title);
                        thiz.hideRowHoverDetails();
                    });

                    //// Thismakes sure the event is only bound once.
                    //$('#divHomePageAlert:not(.bound)').addClass('bound').bind('mouseleave', function () {
                    ////    // When the user gets outside the alerts, the hover dialog gets closed here.
                    ////    $("#divRowHoverDetails").dialog('close');
                    //  thiz.hideRowHoverDetails();
                    //});





                }
            });
            $('#divRowHoverDetails').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();



            //html += '<img id="imgRequestOrgImage" src="' + thiz.options.operationUriPrefix + 'images/corporeal.png" style="width:200px;height:200px;"/>';
            //
            // Try to get a custom image. If none found, use the OOB one.
            //
            //html += '<img src="' + thiz.options.operationUriPrefix + 'images/corporeal.png" style="width:200px;height:200px;"/>'; // This is the original code. Remove at some point.
            //debugger;
            var imagePath2 = thiz.options.operationUriPrefix + '_files/' + bwWorkflowAppId + '/orgimages/' + bwOrgid + '/' + 'orgimage.png'; // thiz.options.store.OrgId
            $.get(imagePath2).done(function () {
                setTimeout(function () { // Only needs to happen for Chrome.
                    //var img = document.getElementById('imgRequestOrgImage');
                    //img.attr.src = imagePath2;
                    $('#imgRequestOrgImage2').attr('src', imagePath2);
                }, 500);
            }).fail(function () {
                //alert("This org has no image."); // do nothing 
            });
            // End: Getting the custom image
            //


            //
            // Ajax call to get the primary image.
            //
            var operationUri = this.options.operationUriPrefix + '_files/' + 'getprimaryimageforbudgetrequest/' + bwWorkflowAppId + '/' + bwBudgetRequestId; // _files allows us to use nginx to route these to a dedicated file server.
            $.ajax({
                url: operationUri,
                method: "GET",
                timeout: ajaxTimeout,
                headers: { "Accept": "application/json; odata=verbose" },
                success: function (data) {
                    try {

                        document.getElementById('spanImageXXx').innerHTML = '';
                        try {
                            for (var i = 0; i < data.length; i++) {
                                var fileName = data[i].Filename;
                                if (fileName.toUpperCase().indexOf('.XLSX') > -1 || fileName.toUpperCase().indexOf('.XLS') > -1) {
                                    html = '<img src="images/excelicon.png" style="width:100px;height:46px;cursor:pointer;" />';
                                    document.getElementById('spanImageXXx').innerHTML += html;
                                } else {
                                    var imageUrl = thiz.options.operationUriPrefix + '_files/' + bwWorkflowAppId + '/' + bwBudgetRequestId + '/' + fileName;
                                    html = '<img src="' + imageUrl + '" style="height:150px;" />';
                                    document.getElementById('spanImageXXx').innerHTML += html;
                                }
                            }
                        } catch (e) {
                            console.log('Didn\'t find an image for data: ' + JSON.stringify(data));
                            html = '[no image found]';
                            document.getElementById('spanImageXXx').innerHTML = html;
                        }


                    } catch (e) {
                        if (e.number) {
                            displayAlertDialog('Error in populateAttachments():1-1: ' + e.number + ', "' + e.message + '", ' + e.stack);
                        } else {
                            // This most likely means that the folders are there on the file services server, but there is nothing in them.
                            //
                            // Fileservices has an error, so show nothing! We will put a red exclamation pin in the attachments section eventually! - 10-1-17 todd
                            //displayAlertDialog('Fileservices has an error: ' + ' "' + e.message + '"');
                        }
                    }
                    //}
                },
                error: function (data, errorCode, errorMessage) {

                    if (errorCode === 'timeout' && errorMessage === 'timeout') {
                        displayAlertDialog('SERVICE UNAVAILABLE. File services is not respondingxcx2. communication timeout is set at ' + ajaxTimeout / 1000 + ' seconds: ' + errorCode + ', ' + errorMessage);
                    } else {

                        console.log('Error in showRowHoverDetails:2:4 ' + errorCode + ', ' + errorMessage);


                        displayAlertDialog('Error in showRowHoverDetails:2:4 ' + errorCode + ', ' + errorMessage);
                        // The latest error 1-17-2018 is errorCode:'error' and errorMessage:'Not Found'.
                        // What does this mean? You can replicate this error!
                        // at Url: https://budgetworkflow.com/ios8.html, view an offline (Un-submitted) request, and try to add an attachment.





                    }

                }
            });







        } catch (e) {
            console.log('Exception in xx(): ' + e.message + ', ' + e.stack);
        }
    },
    hideRowHoverDetails_ForAttachment: function () {
        try {


            console.log('In hideRowHoverDetails().');
            if (document.getElementById('divRowHoverDetails').style.display != 'none') {
                //// This means the dialog is being displayed.
                //var isMouseInBox = false;

                ////function isMouseInBox(e) {
                //var textbox = document.getElementById('divRowHoverDetails');

                //    // Box position & sizes
                //    var boxX = textbox.offsetLeft;
                //    var boxY = textbox.offsetTop;
                //    var boxWidth = textbox.offsetWidth;
                //    var boxHeight = textbox.offsetHeight;

                //    // Mouse position comes from the 'mousemove' event
                //    var mouseX = e.pageX;
                //    var mouseY = e.pageY;
                //    if (mouseX >= boxX && mouseX <= boxX + boxWidth) {
                //        if (mouseY >= boxY && mouseY <= boxY + boxHeight) {
                //            // Mouse is in the box
                //            isMouseInBox = true;
                //            //debugger;
                //        }
                //    }
                ////}


                //    if (isMouseInBox == false) {
                $('#divRowHoverDetails').dialog('close');
                //}
            }


        } catch (e) {
            console.log('Exception in xx(): ' + e.message + ', ' + e.stack);
        }
    },
    populateScreenshots: function (bwErrorOrSuggestionId, quill) {
        try {

            //$(this.element).find('#newrequestattachments')[0].innerHTML = '';
            ////var bwBudgetRequestId = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
            //console.log('In populateScreenshots(' + workflowAppId + ', ' + bwBudgetRequestId + ', ' + attachmentsTagId + ', ' + showRemoveAttachmentButton + ').');
            var thiz = this;
            //debugger;
            var operationUri = this.options.operationUriPrefix + '_files/' + 'getlistoferrororsuggestionscreenshots/' + workflowAppId + '/' + bwErrorOrSuggestionId; //this.options.bwBudgetRequestId; //_budgetRequestId; // _files allows us to use nginx to route these to a dedicated file server.
            $.ajax({
                url: operationUri,
                method: "GET",
                timeout: 15000, // This is done because file services may need more time. // this.options.ajaxTimeout,
                headers: { "Accept": "application/json; odata=verbose" },
                success: function (data) {
                    try {
                        //debugger;
                        if (!data) {
                            $(thiz.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">[Unexpected response from the file server]</span>';
                        } else if (data.code == 'ENOENT') {
                            // No such file or directory
                            //$(thiz.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">[Server response: No such file or directory: ' + data.path + ']</span>';
                            console.log('[Server response: No such file or directory: ' + data.path + ']. This is probably Ok.');
                            thiz.displayAlertDialog('[Server response: No such file or directory: ' + data.path + ']. This is probably Ok.');
                        } else if (data && data.length > 0) {
                            var html = '';

                            for (var i = 0; i < data.length; i++) {

                                //Filename: filename,
                                //Description: description
                                //debugger;
                                var filename = data[i].Filename;
                                var description = data[i].Description;

                                console.log('In populateScreenshots(). description: ' + description);

                                var fileUrl = thiz.options.operationUriPrefix + "_files/" + workflowAppId + "/ReportAnErrorOrMakeASuggestion/" + bwErrorOrSuggestionId + "/" + filename;




                                //html += '<div style="background-color:white;cursor:pointer;" onclick="alert(\'Display the screenshot. This functionality is incomplete. Coming soon!\');" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200002\', \'Pizza\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'c7c7836b-fb17-4d46-9f62-5bfac6795cea\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="https://budgetworkflow.com/images/zoom.jpg">    </div>';

                                // 8-15-2021 trying to zoom the screenshots. May have to take the attachments out of the Quill editor and just display them seperately in order to get this to work Ok.
                                //html += '<img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;cursor:pointer;" src="https://budgetworkflow.com/images/zoom.jpg" onclick="alert(\'Display the screenshot. This functionality is incomplete. Coming soon!\');">';

                                html += '<img  src="' + fileUrl + '" />';
                                html += '<br />';





                                //
                                // 8-15-2021
                                var html2 = '';
                                html2 += '<div style="background-color:white;cursor:pointer;" onclick="alert(\'Display the screenshot. This functionality is incomplete. Coming soon!\');" >';
                                //html2 += '  <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;cursor:pointer;" src="https://budgetworkflow.com/images/zoom.jpg" onclick="alert(\'Display the screenshot. This functionality is incomplete. Coming soon!\');">';
                                html2 += '  <img style="width:250px;" src="' + fileUrl + '" onmouseenter="$(\'.bwMonitoringTools\').bwMonitoringTools(\'showRowHoverDetails_ForAttachment\', \'BR-200002\', \'Pizza\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'c7c7836b-fb17-4d46-9f62-5bfac6795cea\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwMonitoringTools\').bwMonitoringTools(\'hideRowHoverDetails_ForAttachment\');" />';
                                html2 += '</div>';
                                $('#divErrorOrSuggestion_Attachments').html(html2);






                            }


                            //if (emailTemplate && emailTemplate != '') {
                            quill.setText(''); // Do this first so we don't get double the email!
                            //thiz.options.quill.root.innerHTML = emailTemplate; //.setText(emailTemplate);
                            //thiz.options.quill.setText(emailTemplate);
                            quill.clipboard.dangerouslyPasteHTML(0, html);
                            //} else {
                            //    thiz.options.quill.setText('');
                            //}



                        } else if (data) {

                            $(thiz.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">No attachments found: ' + JSON.stringify(data) + '</span>';

                        } else {
                            $(thiz.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">ERROR: Unexpected response: ' + JSON.stringify(data) + '</span>';
                        }
                    } catch (e) {
                        $(thiz.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">Exception in populateScreenshots:1: ' + e.message + ', ' + e.stack + '</span>';
                        if (e.number) {
                            displayAlertDialog('Exception in populateScreenshots():1: ' + e.message + ', ' + e.stack);
                        } else {
                            displayAlertDialog('Exception in populateScreenshots():0: ' + e.message + ', ' + e.stack);
                            // This most likely means that the folders are there on the file services server, but there is nothing in them.
                            //
                            // Fileservices has an error, so show nothing! We will put a red exclamation pin in the attachments section eventually! - 10-1-17 todd
                            //displayAlertDialog('Fileservices has an error: ' + ' "' + e.message + '"');
                        }
                    }
                    //}
                },
                error: function (data, errorCode, errorMessage) {

                    if (errorCode === 'timeout' && errorMessage === 'timeout') {
                        displayAlertDialog('File services is not responding. communication timeout is set at ' + ajaxTimeout / 1000 + ' seconds: ' + errorCode + ', ' + errorMessage);
                        $(thiz.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">File services is not responding. communication timeout is set at ' + ajaxTimeout / 1000 + ' seconds: ' + errorCode + ', ' + errorMessage + '</span>';
                    } else {

                        console.log('Error in populateAttachments():2: ' + errorCode + ', ' + errorMessage);
                        $(thiz.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">Error in populateScreenshots():2: ' + errorCode + ', ' + errorMessage + '</span>';

                        displayAlertDialog('Error in populateScreenshots():2: ' + errorCode + ', ' + errorMessage);
                        // The latest error 1-17-2018 is errorCode:'error' and errorMessage:'Not Found'.
                        // What does this mean? You can replicate this error!
                        // at Url: https://budgetworkflow.com/ios8.html, view an offline (Un-submitted) request, and try to add an attachment.


                    }
                }
            });
        } catch (e) {
            console.log('Exception in populateScreenshots: ' + e.message + ', ' + e.stack);

            //renderAndPopulateAttachments
            $(thiz.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">Exception in populateScreenshots: ' + e.message + ', ' + e.stack + '</span>';

        }
    },
    // 

    cmdViewAllEmails: function () {
        try {
            console.log('In cmdViewAllEmails().');
            displayAlertDialog('In cmdViewAllEmails(). We need a screen for this! This functionality is incomplete. Coming soon!');






        } catch (e) {
            console.log('Exception in cmdViewAllEmails(): ' + e.message + ', ' + e.stack);
        }
    },

    cmdViewUnsentEmails: function () {
        try {
            console.log('In cmdViewUnsentEmails().');
            displayAlertDialog('In cmdViewUnsentEmails(). We need a screen for this! This functionality is incomplete. Coming soon!');






        } catch (e) {
            console.log('Exception in cmdViewUnsentEmails(): ' + e.message + ', ' + e.stack);
        }
    },
    cmdListAllWorkflowTasks: function () {
        // Use ajax.
        $('#txtBwWorkflowTasks').empty();
        var data = {
            //"bwTenantId": "null",
            //"bwTenantOwnerFacebookUserId": "test1",
            //"bwTenantOwnerLinkedInUserId": "test1",
            //"bwTenantOwnerFriendlyName": "Todd Hiltz1",
            //"bwTenantOwnerEmail": "todd1@capexworkflow.com",
            //"bwWorkflows": "null"
        };

        $.ajax({
            url: webserviceurl + "/bwtasksfindallforadmin",
            type: "DELETE",
            contentType: 'application/json',
            //data: JSON.stringify(data),
            success: function (data) {
                var html = '';
                for (var i = 0; i < data.length; i++) {
                    html += 'bwTaskTitle:' + data[i].bwTaskTitle;
                    html += ', bwDueDate:' + data[i].bwDueDate;
                    html += ', bwTaskOutcome:' + data[i].bwTaskOutcome + ' bwPercentComplete:' + data[i].bwPercentComplete + ' bwHasBeenProcessedByTheWorkflowEngine:' + data[i].bwHasBeenProcessedByTheWorkflowEngine;
                    html += ', bwAssignedToId:' + data[i].bwAssignedToId;
                    html += ', TaskType:' + data[i].TaskType;

                    html += ', bwRelatedItemId:' + data[i].bwRelatedItemId;

                    html += ', bwAssignedToEmail:' + data[i].bwAssignedToEmail; //
                    html += ', bwAssignedToFriendlyName:' + data[i].bwAssignedToFriendlyName;
                    //html += ', bwTenantId:' + data[i].bwTenantId;
                    html += ', bwWorkflowAppId:' + data[i].bwWorkflowAppId;
                    html += ', Created:' + data[i].Created;
                    html += ', Modified:' + data[i].Modified;
                    //html += ', bwLastDayOverDueTaskReminderSentTimestamp:' + data[i].bwLastDayOverDueTaskReminderSentTimestamp;
                    html += ', DailyOverdueTaskNotificationDate:' + data[i].DailyOverdueTaskNotificationDate;
                    html += ', TrashBin:' + data[i].TrashBin;

                    html += ', WorkflowStepName:' + data[i].WorkflowStepName;
                    html += ', bwStatus:' + data[i].bwStatus;

                    html += ', bwAssignedToRaciRoleAbbreviation:' + data[i].bwAssignedToRaciRoleAbbreviation;
                    html += ', bwAssignedToRaciRoleName:' + data[i].bwAssignedToRaciRoleName;


                    html += '\n\n';
                    //html += '';
                }
                html += 'DONE';
                $('#txtBwWorkflowTasks').append(html);
            },
            error: function (data, errorCode, errorMessage) {
                //window.waitDialog.close();
                //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
                displayAlertDialog('Error in admin.js.cmdListAllWorkflowTasks():' + errorCode + ', ' + errorMessage);
            }
        });
    },




    cmdListAllWorkflowTasksThatWillHaveEmailsSentToday: function () {
        // Use ajax.
        $('#txtBwWorkflowTasksThatWillHaveEmailsSentToday').empty();
        var data = {
            //"bwTenantId": "null",
            //"bwTenantOwnerFacebookUserId": "test1",
            //"bwTenantOwnerLinkedInUserId": "test1",
            //"bwTenantOwnerFriendlyName": "Todd Hiltz1",
            //"bwTenantOwnerEmail": "todd1@capexworkflow.com",
            //"bwWorkflows": "null"
        };

        $.ajax({
            url: webserviceurl + "/bwtasksfindallforadminthatwillhaveemailssenttoday",
            type: "DELETE",
            contentType: 'application/json',
            //data: JSON.stringify(data),
            success: function (data) {
                var html = '';
                for (var i = 0; i < data.length; i++) {
                    html += 'bwWorkflowTaskItemId:' + data[i].bwWorkflowTaskItemId;
                    html += ', bwAssignedToEmail:' + data[i].bwAssignedToEmail; //
                    html += ', bwAssignedToFriendlyName:' + data[i].bwAssignedToFriendlyName;

                    html += ', bwTaskTitle:' + data[i].bwTaskTitle;
                    html += ', bwDueDate:' + data[i].bwDueDate;
                    html += ', bwTaskOutcome:' + data[i].bwTaskOutcome + ' bwPercentComplete:' + data[i].bwPercentComplete + ' bwHasBeenProcessedByTheWorkflowEngine:' + data[i].bwHasBeenProcessedByTheWorkflowEngine;
                    html += ', bwAssignedToId:' + data[i].bwAssignedToId;
                    html += ', TaskType:' + data[i].TaskType;

                    html += ', bwRelatedItemId:' + data[i].bwRelatedItemId;


                    //html += ', bwTenantId:' + data[i].bwTenantId;
                    html += ', bwWorkflowAppId:' + data[i].bwWorkflowAppId;
                    html += ', Created:' + data[i].Created;
                    html += ', Modified:' + data[i].Modified;
                    //html += ', bwLastDayOverDueTaskReminderSentTimestamp:' + data[i].bwLastDayOverDueTaskReminderSentTimestamp;
                    html += ', DailyOverdueTaskNotificationDate:' + data[i].DailyOverdueTaskNotificationDate;
                    html += ', TrashBin:' + data[i].TrashBin;
                    html += '\n\n';
                    //html += '';
                }
                html += 'DONE';
                $('#txtBwWorkflowTasksThatWillHaveEmailsSentToday').append(html);
            },
            error: function (data, errorCode, errorMessage) {
                //window.waitDialog.close();
                //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
                displayAlertDialog('Error in admin.js.cmdListAllWorkflowTasksThatWillHaveEmailsSentToday():' + errorCode + ', ' + errorMessage);
            }
        });
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
    }

});