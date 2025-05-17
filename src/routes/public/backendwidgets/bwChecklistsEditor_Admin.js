$.widget("bw.bwChecklistsEditor_Admin", {
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
        This is the bwChecklistsEditor_Admin.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        elementIdSuffix: null, // This is a custom guid which gets appended to element id's, making sure this widget keeps to itself.

        store: {
            Checklists: [],
            DraftChecklists: []
        },



        value: 0,

        DisplayAsNewTenantUserConfigurationEditor: null,


        bwTenantId: null,
        bwWorkflowAppId: null,
        checklistIndex: null, // If this is specified, then this is the one that is displayed by default, or on the first time coming to this screen.
        operationUriPrefix: null,
        ajaxTimeout: 15000,
        displayChecklistPicker: false,
        displayRoleIdColumn: false,
        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function (checklistIndex) {
        this.element.addClass("bwChecklistsEditor_Admin");

        try { // Using this table: BwChecklistTemplates
            console.log('In bwChecklistsEditor_Admin.js._create().');
            var thiz = this;

            selfDiscoverOperationUri(thiz); // This sets this.options.operationUriPrefix correctly.

            var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            this.options.elementIdSuffix = guid;

            //if (this.options.store.Checklists.length > 0) {

            //    // this.options.store is populated, so just render the checklists editor.
            //    var html = this.renderChecklistsEditor(checklistIndex); // We pass checklistIndex so we know which checklist to display from the json.
            //    this.element.html(html); // Render the checklists editor.

            //} else {

            // Check the database to see if we have any checklists saved there yet.
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');
            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                bwWorkflowAppId: workflowAppId,
                isActive: true
            };
            $.ajax({
                url: this.options.operationUriPrefix + "_bw/checklistsgloballibrarycontents",
                type: "POST",
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (ccResult) {
                    try {

                        //alert('xcx12321ccResult: ' + JSON.stringify(ccResult));

                        debugger; // Does the result look like the JSON below?


                        if (ccResult.status == 'NO_CHECKLISTS_EXIST') {


                            alert('xcx12321 NO_CHECKLISTS_EXIST ccResult: ' + JSON.stringify(ccResult));


                            //// Nothing is in the database yet, so just present the built in checklists.
                            //var bwChecklistTemplatesLibraryId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                            //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                            //    return v.toString(16);
                            //});
                            //var json = {
                            //    bwChecklistTemplatesLibraryId: bwChecklistTemplatesLibraryId,
                            //    Title: 'Environmental Considerations Checklist / Impact Statements',
                            //    Description: 'Descriptionxcx23124',
                            //    HoverOver: 'xx',
                            //    ChecklistTemplateRow: []

                            //};
                            //json.ChecklistTemplateRow.push({ TitleSection: 'Select Yes for all items that apply to this request. Comments and Completion Date are required for all items marked as Yes...' });
                            //json.ChecklistTemplateRow.push({ TitleSection: '<br />' });
                            //json.ChecklistTemplateRow.push({ TitleSection: '<br />' });
                            //json.ChecklistTemplateRow.push({ TitleSection: 'The following checklist will assist you with the preparation of the Environmental Impact Statement and Environmental Assessment, if required. Please note, this list is not meant to be exhaustive. For more detailed information see Nova Scotia Environment’s ‘Proponent’s Guide Environmental Assessment’ and ‘Proponents Guide to Wind Projects’.' });
                            //json.ChecklistTemplateRow.push({ TitleSection: '<br />' });
                            //json.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'Will preparing your project site and constructing your project impact the local environment?', YesText: '', NoText: '' } });
                            //json.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'What is the proximity of your project to local conservation areas (provincial, federal and municipal)?' } });
                            //json.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'Will your project or the construction of your project affect the migratory pattern of birds, bats, or other wildlife?' } });
                            //json.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'Will your project impact a large or important bird colony (herons, gulls, terns, raptors, waterfowl) or bats?' } });
                            //json.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'Is your project located within 5 km inland of costal waters (potential impact to shorebirds)?' } });
                            //json.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'Is your project near a protected municipal water supply?' } });
                            //json.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'Will the operation and maintenance of your project have environmental impacts?' } });
                            //json.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'Will your project effect the biophysical environment including the geological features, surface water, groundwater, wetlands, flora and fauna species and habitat, etc.?' } });
                            //json.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'Have you considered what the overall impacts of the project will be on the environment and vice versa, what the effects of the environment will be on your project?' } });
                            //json.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'Does your project impact Aboriginal rights or title?' } });
                            //json.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'Has the federal government provided you with financial assistance, sold, leased or disposed of federal lands for the purposes of your projects? If so, a federal environmental assessment may be required. For more information please visit www.ceaa.gc.ca.' } });
                            //json.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'Have you considered the time it will take you to obtain an environmental assessment and factored that in to your project planning? For more information on regulatory time frames visit  http://www.gov.ns.ca/nse/ea/docs/EA.RegistrationTimeFrames.pdf.' } });
                            //json.ChecklistTemplateRow.push({ TitleSection: '<br />' });
                            //json.ChecklistTemplateRow.push({ TitleSection: 'If there are minimal environmental impacts assessed for your project, your statement might include information such as:' });
                            //json.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'There are no known bat hibernacula within a 25 km radius' } });
                            //json.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'The project is not within a migratory staging or wintering area, or near a conservation area or habitat for large raptors,' } });
                            //json.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'The project is not expected to impact a watercourse' } });
                            //json.ChecklistTemplateRow.push({ TitleSection: '<br />' });
                            //json.ChecklistTemplateRow.push({ TitleSection: 'If you suspect there may be complex environmental issues related to the construction of your renewable electricity project please contact Nova Scotia Environment very early on during your project planning. For more information about environmental assessments please contact the Environmental Assessment Branch of Nova Scotia Environment at (902) 424-3230 or refer to www.gov.ns.ca/nse/ea.' });
                            //json.ChecklistTemplateRow.push({ TitleSection: '<br />' });
                            //json.ChecklistTemplateRow.push({ TitleSection: '<br />' });
                            //json.ChecklistTemplateRow.push({ TitleSection: 'Feel free to include any formal information and advice you receive from Nova Scotia Environment with the submission of your COMFIT application. Obtaining accurate information about the potential impacts of your project early in the process will allow your application to be processed more efficiently and will also allow you to communicate this information to the community and other interested stakeholders.' });
                            //json.ChecklistTemplateRow.push({ TitleSection: '<br />' });
                            //json.ChecklistTemplateRow.push({ TitleSection: '<br />' });
                            //json.ChecklistTemplateRow.push({ TitleSection: 'If you have questions about what you need to submit in your COMFIT application please send them to comfit@gov.ns.ca.' });
                            //json.ChecklistTemplateRow.push({ TitleSection: '<br />' });

                            //thiz.options.store.DraftChecklists.push(json);










                            thiz.renderChecklistsEditor1();

                            var html = '';

                            html += '<br /><br />';
                            html += 'No checklist(s) exist in the library. Click the "Create a Checklist" button to add the first one.';

                            $('#bwChecklistsEditor_Admin_ChecklistContent_' + thiz.options.elementIdSuffix).html(html);

                        } else if (ccResult.status == 'SUCCESS') {




                            // We got results from the database.
                            //thiz.options.store = { Checklists: [], DraftChecklists: [] }; // This is where the object is reinitialized.
                            for (var i = 0; i < ccResult.Checklists.length; i++) {
                                //var json = JSON.parse(result.Checklists[i].ChecklistJson);
                                if (!ccResult.Checklists[i].ChecklistJson) { // THIS SHOULD NEVER HAPPEN
                                    alert('Invalid ChecklistJson for checklist bwChecklistTemplatesLibraryId: ' + ccResult.Checklists[i].bwChecklistTemplatesLibraryId);
                                    debugger;
                                    ccResult.Checklists[i].ChecklistJson = JSON.stringify({
                                        bwChecklistTemplatesLibraryId: ccResult.Checklists[i].bwChecklistTemplatesLibraryId,
                                        Title: ccResult.Checklists[i].Title,
                                        Description: ccResult.Checklists[i].Description,
                                        HoverOver: 'xx',
                                        ChecklistTemplateRow: [
                                            {
                                                TitleSection: 'Invalid ChecklistJson. There must have been an error saving to the database.'
                                            }
                                        ]
                                    });
                                }
                                //thiz.options.store.Checklists.push(JSON.parse(ccResult.Checklists[i].ChecklistJson));
                                thiz.options.store.DraftChecklists.push(JSON.parse(ccResult.Checklists[i].ChecklistJson)); // If they don't match, we know to tell the user that they have made changes.

                            }


                            //for (var i = 0; i < ccResult.Checklists.length; i++) {
                            //    //var json = JSON.parse(result.Checklists[i].ChecklistJson);
                            //    thiz.options.store.Checklists.push(JSON.parse(ccResult.Checklists[i].ChecklistJson));
                            //    //thiz.options.store.DraftChecklists.push(JSON.parse(result.Checklists[i].ChecklistJson)); // If they don't match, we know to tell the user that they have made changes.
                            //}


                            //thiz.options.store.Checklists = ccResult.Checklists;

                            //debugger;
                            // Sort the checklists alphabetically. Not sure if this is the best place to do this, but it works! I am glad to do this on the client side! :D
                            thiz.options.store.DraftChecklists.sort(function (a, b) {
                                if (a.Title < b.Title) { return -1; }
                                if (a.Title > b.Title) { return 1; }
                                return 0;
                            });
                            //debugger;
                            thiz.options.store.Checklists = JSON.parse(JSON.stringify(thiz.options.store.DraftChecklists)); // Clone

                            thiz.renderChecklistsEditor1();

                        } else {

                            console.log('Error in bwChecklistsEditor_Admin.js._create(). Unexpected response from the server when looking for checklists: ' + JSON.stringify(ccResult));
                            displayAlertDialog('Error in bwChecklistsEditor_Admin.js._create(). Unexpected response from the server when looking for checklists: ' + JSON.stringify(ccResult));

                        }

                    } catch (e) {
                        console.log('Exception in bwChecklistsEditor_Admin.js._create(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwChecklistsEditor_Admin.js._create(): ' + e.message + ', ' + e.stack);
                    }
                }, error: function (data) {

                    var msg = 'Error in bwChecklistsEditor_Admin.js._create()./odata/Checklist/: ' + JSON.stringify(data);
                    console.log(msg);
                    displayAlertDialog(msg);

                    //if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                    //    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                    //} else {
                    //    msg = JSON.stringify(data);
                    //}
                    //alert('Exception in bwChecklistsEditor_Admin.Checklist()._create.Get:2: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                    //console.log('Exception in bwChecklistsEditor_Admin.Checklist()._create.Get:2: ' + JSON.stringify(data));

                }
            });

            //}
        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwChecklistEditor: CANNOT RENDER THE CHECKLIST EDITOR</span>';
            html += '<br />';
            html += '<span style="">Exception in bwChecklistEditor.js._create(): ' + e.message + ', ' + e.stack + '</span>';
            this.element.html(html);
        }
    },
    _setOption: function (key, value) {
        this.options[key] = value;
        this._update();
    },
    _update: function () {
        try {
            console.log('In bwChecklistsEditor_Admin.js._update(). This does nothing! (yet)');
        } catch (e) {
            console.log('Exception in bwChecklistsEditor_Admin.js._update(): ' + e.message + ', ' + e.stack);
        }
    },
    _destroy: function () {
        this.element
            .removeClass("bwWorkflowEditor")
            .text("");
    },
    renderChecklistsEditor1: function (bwChecklistTemplatesLibraryId) {
        try {
            console.log('In renderChecklistsEditor1(). bwChecklistTemplatesLibraryId: ' + bwChecklistTemplatesLibraryId);
            //alert('In renderChecklistsEditor1(). bwChecklistTemplatesLibraryId: ' + bwChecklistTemplatesLibraryId);
            var thiz = this;

            var html = '';

            html += '<div style="display:none;" id="divUndoChecklistPublishingDialog">';
            html += '  <table style="width:100%;">';
            html += '    <tr>';
            html += '      <td style="width:90%;">';
            html += '        <span id="spanUndoChecklistPublishingTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Checklist PUBLISHED</span>';
            html += '      </td>';
            html += '      <td style="width:9%;"></td>';
            html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divUndoChecklistPublishingDialog\').dialog(\'close\');">X</span>';
            html += '      </td>';
            html += '    </tr>';
            html += '  </table>';
            html += '  <br /><br />';
            html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '  <span id="spanUndoChecklistPublishingContent" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:20pt;">';
            html += '    This checklist has been published and will immediately impact the future workflow processes.'; // Please keep an eye on potential issues related to your change(s). ';
            html += '    <br />';
            html += '    <br />';
            html += '    <br />';
            html += '    <span style="font-weight:bold;cursor:pointer;">'; // onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'undoWorkflowActivation\');">';
            //html += '      You can change the "Active Workflow" using the drop-down at the top of this page any time';
            html += '    </span>';
            html += '  <br /><br />';
            html += '  <div class="divDialogButton" onclick="$(\'#divUndoChecklistPublishingDialog\').dialog(\'close\');">Close</div>';
            html += '  <br /><br />';
            html += '</div>';

            html += '<div style="display:none;" id="divDeleteChecklistDialog">';
            html += '  <table style="width:100%;">';
            html += '    <tr>';
            html += '      <td style="width:90%;">';
            html += '        <span id="spanUndoChecklistPublishingTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Checklist DELETED</span>';
            html += '      </td>';
            html += '      <td style="width:9%;"></td>';
            html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divDeleteChecklistDialog\').dialog(\'close\');">X</span>';
            html += '      </td>';
            html += '    </tr>';
            html += '  </table>';
            html += '  <br /><br />';
            html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '  <span id="spanUndoChecklistPublishingContent" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:20pt;">';
            html += '    This checklist has been deleted.'; // Please keep an eye on potential issues related to your change(s). ';
            html += '    <br />';
            html += '    <br />';
            html += '    <br />';
            html += '    <span style="font-weight:bold;cursor:pointer;">'; // onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'undoWorkflowActivation\');">';
            //html += '      You can change the "Active Workflow" using the drop-down at the top of this page any time';
            html += '    </span>';
            html += '  <br /><br />';
            html += '  <div class="divDialogButton" onclick="$(\'#divDeleteChecklistDialog\').dialog(\'close\');">Close</div>';
            html += '  <br /><br />';
            html += '</div>';





            html += '<div style="display:none;" id="divProgressBarDialog">';
            html += '<div id="progressbar" class="ui-progressbar"><div class="progress-label">Loading...</div></div>';
            html += '</div>';





            html += '<table style="width:100%;">';
            html += '   <tr>';
            html += '       <td>';
            //html += '           <h2>';

            // 3-13-2022
            //html += '               <span style="color:black;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 35pt;font-weight:bold;">Configure your "' + workflowAppTitle + '" checklists...&nbsp;';
            html += '               <span style="color:black;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 35pt;font-weight:bold;">Configure the Checklists Global Library&nbsp;&nbsp;&nbsp;';

            html += '               <span id="spanChecklistsEditorEllipsesButton" class="spanButton context-menu-checklistseditor" id="xcx" style="height:20px;width:150px;"> ... </span>';
            html += '           </span>'; // Velvet Morning is #95b1d3. This was the pantone color of the day for December 9, 2019! :D
            //html += '           </h2>';
            html += '       </td>';
            html += '       <td style="text-align:right;">';
            //html += '           <span class="printButton" title="print" onclick="cmdPrintForm();">&#x1f5a8;</span>';
            html += '       </td>';
            html += '   </tr>';
            html += '</table>';






            //var checklistIndex = null; // GET RID OF THIS VARIABLE EVENTUALLY


            html += '<br />';
            html += 'Checklist: ';
            html += '<select style="padding:5px 5px 5px 5px;" id="bwChecklistEditor_Admin_selectChecklist_' + thiz.options.elementIdSuffix + '" onchange="$(\'.bwChecklistsEditor_Admin\').bwChecklistsEditor_Admin(\'selectChecklist_OnChange\', \'viewing\');">';


            //alert('xcx444 this.options.store.DraftChecklists: ' + this.options.store.DraftChecklists);
            debugger;


            for (var i = 0; i < this.options.store.DraftChecklists.length; i++) {
                if (bwChecklistTemplatesLibraryId && (bwChecklistTemplatesLibraryId == this.options.store.DraftChecklists[i].bwChecklistTemplatesLibraryId)) {
                    html += '<option value="' + this.options.store.DraftChecklists[i].bwChecklistTemplatesLibraryId + '" selected>' + this.options.store.DraftChecklists[i].Title + '</option>';
                } else {
                    html += '<option value="' + this.options.store.DraftChecklists[i].bwChecklistTemplatesLibraryId + '">' + this.options.store.DraftChecklists[i].Title + '</option>';
                }
            }

            html += '</select>';
            html += '&nbsp;&nbsp;';
            html += '<input class="buttonAddNewAssignmentRow" style="padding:5px 10px 5px 10px;" onclick="$(\'.bwChecklistsEditor_Admin\').bwChecklistsEditor_Admin(\'editChecklist\');" type="button" value="Edit">';
            html += '&nbsp;&nbsp;';
            html += '<input class="buttonAddNewAssignmentRow" style="padding:5px 10px 5px 10px;" onclick="$(\'.bwChecklistsEditor_Admin\').bwChecklistsEditor_Admin(\'deleteChecklistFromGlobalLibrary\');" type="button" value="Delete">';
            html += '&nbsp;&nbsp;';
            html += '<input class="buttonAddNewAssignmentRow" style="padding:5px 10px 5px 10px;" onclick="$(\'.bwChecklistsEditor_Admin\').bwChecklistsEditor_Admin(\'createNewChecklist\', \'\');" type="button" value="+ Create a Checklist">';
            //html += '&nbsp;&nbsp;';
            //html += '<input class="buttonAddNewAssignmentRow" style="padding:5px 10px 5px 10px;" onclick="$(\'.bwChecklistsEditor_Admin\').bwChecklistsEditor_Admin(\'getChecklist\', \'\');" type="button" value="+ Get a Checklist">';
            html += '&nbsp;&nbsp;';
            html += '<input class="buttonAddNewAssignmentRow" style="padding:5px 10px 5px 10px;" onclick="$(\'.bwChecklistsEditor_Admin\').bwChecklistsEditor_Admin(\'downloadChecklistsJson\', \'\');" type="button" value="View Checklist JSON">';
            html += '<br />';
            html += '<br />';

            html += '<div id="bwChecklistsEditor_Admin_ChecklistContent_' + this.options.elementIdSuffix + '"></div>';

            this.element.html(html); // Render the checklists editor.


            // RIGHT-CLICK FUNCTIONALITY!!
            // This is our ellipsis context menu. MIT license and code at: https://swisnl.github.io/jQuery-contextMenu/demo/trigger-custom.html // event.stopImmediatePropagation()
            var button = document.getElementById('spanChecklistsEditorEllipsesButton');
            //for (var i = 0; i < buttons.length; i++) {
            $(button).on('click', function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                $(this).contextMenu();
                // or $('.context-menu-one').trigger("contextmenu");
                // or $('.context-menu-one').contextMenu({x: 100, y: 100});
            });
            //}

            //
            // This is our right-click context menu. MIT license and code at: https://swisnl.github.io/jQuery-contextMenu/demo/trigger-custom.html
            $.contextMenu({
                selector: '.context-menu-checklistseditor',
                callback: function (key, options) {
                    //var m = "clicked: " + key;
                    //window.console && console.log(m) || alert(m);
                    //if (key == 'viewtrashbincontents') {
                    //    //alert('This functionality is incomplete. Coming soon!');
                    //    cmdDisplayArchivePageTrashbinContents();
                    //} else if (key == 'viewextendedinformation') {
                    //    //alert('This functionality is incomplete. Coming soon!');
                    //    cmdDisplayArchivePageExtendedInformation();
                    //} else 
                    if (key == 'downloadjson') {
                        thiz.downloadChecklistsJson();
                    }
                },
                items: {
                    //"viewtrashbincontents": { name: "View Trashbin contents", icon: "fa-trash" }, // images/trash-can.png  // 🗑
                    //"viewextendedinformation": { name: "View Extended information", icon: "edit" },
                    "downloadjson": { name: "Checklists JSON", icon: "edit" }
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


        } catch (e) {
            console.log('Exception in renderChecklistsEditor1(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderChecklistsEditor1(): ' + e.message + ', ' + e.stack);
        }
    },
    renderChecklistsEditor: function (bwChecklistTemplatesLibraryId) {
        try {
            console.log('In bwChecklistsEditor_Admin.js.renderChecklistsEditor().');
            alert('In bwChecklistsEditor_Admin.js.renderChecklistsEditor(). bwChecklistTemplatesLibraryId: ' + bwChecklistTemplatesLibraryId);
            var thiz = this;

            var workflowAppTitle = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTitle');

            if (!bwChecklistTemplatesLibraryId) {

                //alert('In editChecklist(). Unexpected value for bwChecklistTemplatesLibraryId: ' + bwChecklistTemplatesLibraryId);
                bwChecklistTemplatesLibraryId = $('#bwChecklistEditor_Admin_selectChecklist_' + this.options.elementIdSuffix).find('option:selected').val();

            }

            alert('In renderChecklistsEditor(). bwChecklistTemplatesLibraryId: ' + bwChecklistTemplatesLibraryId);
            var thereHaveBeenChangesToThisChecklist = false;
            var checklist;
            debugger;
            for (var i = 0; i < this.options.store.DraftChecklists.length; i++) {
                if (bwChecklistTemplatesLibraryId == this.options.store.DraftChecklists[i].bwChecklistTemplatesLibraryId) {

                    ////var json = this.options.store.Checklists;
                    //var json = JSON.parse(this.options.store.DraftChecklists[i].ChecklistJson);
                    //document.getElementById('spanDisplayJsonDialogTitle').innerHTML = 'Checklist JSON';
                    //$('#txtDisplayJsonDialogJSON').empty();
                    //$('#txtDisplayJsonDialogJSON').append(JSON.stringify(json, null, 2));
                    //break;

                    checklist = this.options.store.DraftChecklists[i];

                    var oldJsonString = JSON.stringify(this.options.store.Checklists[i]);
                    var newJsonString = JSON.stringify(this.options.store.DraftChecklists[i]);
                    if (oldJsonString != newJsonString) {
                        thereHaveBeenChangesToThisChecklist = true;
                    }

                    //alert('car: ' + JSON.stringify(car));
                    break;
                }
            }



            var html = '';



            console.log('***');
            console.log('Checking thereHaveBeenChangesToThisChecklist xcx333854 thereHaveBeenChangesToThisChecklist: ' + thereHaveBeenChangesToThisChecklist);
            console.log('***');

            if (thereHaveBeenChangesToThisChecklist) {
                //console.log('In renderChecklistsEditor(). The user has made changes which have not been saved.');
                html += '<span style="font-style:italic;color:tomato;">You have changes that won\'t be available until you publish: </span>';
                html += '<input class="buttonAddNewAssignmentRow" type="button" value="Publish" style="padding:7px 10px 7px 10px;" onclick="$(\'.bwChecklistsEditor_Admin\').bwChecklistsEditor_Admin(\'publishChecklistToGlobalLibrary\', \'' + bwChecklistTemplatesLibraryId + '\');">';
                html += '&nbsp;<input class="buttonAddNewAssignmentRow" type="button" value="Cancel Changes" style="padding:7px 10px 7px 10px;" onclick="$(\'.bwChecklistsEditor_Admin\').bwChecklistsEditor_Admin(\'cancelChangesInDraftChecklistConfiguration\');" />';
                //html += '&nbsp;<input class="buttonAddNewAssignmentRow" type="button" value="Cancel Changes" style="padding:7px 10px 7px 10px;" onclick="$(\'.bwChecklistsEditor_Admin\').bwChecklistsEditor_Admin(\'cancelChangesInDraftChecklistConfiguration\');" />';
                html += '&nbsp;<input class="buttonAddNewAssignmentRow" style="padding:5px 10px 5px 10px;" onclick="$(\'.bwChecklistsEditor_Admin\').bwChecklistsEditor_Admin(\'downloadChecklistsJson\', \'\');" type="button" value="View Checklist JSON">';

            } else {
                // Do nothing because the user has made no changes to the checklist.
                //console.log('In renderChecklistsEditor(). THE USER HAS MADE NO CHANGES TO THE CHECKLIST.');
            }

            html += '<br />';
            html += '<br />';

            // Render the json.
            html += '<table class="xdFormLayout" style="width:100%;BORDER-TOP: #d8d8d8 1pt solid; BORDER-RIGHT: #d8d8d8 1pt solid; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 0px; PADDING-TOP: 0px; PADDING-LEFT: 15px; BORDER-LEFT: #d8d8d8 1pt solid; PADDING-RIGHT: 0px">';
            html += '<tr>';
            html += '<td>';
            debugger;



            //alert('>>>>>>>>>> checklist: ' + JSON.stringify(checklist));

            html += '<h4>' + checklist.Title + '</h4>';
            for (var i = 0; i < checklist.ChecklistTemplateRow.length; i++) {
                html += '<table style="width:50%;">';
                html += '<tr>';
                if (checklist.ChecklistTemplateRow[i].hasOwnProperty('TitleSection')) {
                    html += '<td colspan="2">';
                    html += checklist.ChecklistTemplateRow[i].TitleSection;
                    html += '</td>';
                } else if (checklist.ChecklistTemplateRow[i].hasOwnProperty('ChecklistItem')) {
                    html += '   <td style="width:95%;text-align:left;color:black;" class="bwSliderTitleCell">';
                    var question = checklist.ChecklistTemplateRow[i].ChecklistItem.Question.trim();
                    var lastCharacter = question.charAt(question.length - 1);
                    if (lastCharacter == '?') {
                        html += '       ' + checklist.ChecklistTemplateRow[i].ChecklistItem.Question + '';
                    } else {
                        html += '       ' + checklist.ChecklistTemplateRow[i].ChecklistItem.Question + ':';
                    }
                    html += '   </td>';
                    html += '   <td style="width:5%;" class="bwChartCalculatorLightCurrencyTableCell">';
                    html += '       <label for="configurationBehaviorRequireStartEndDatesSlider2"></label><input type="checkbox" name="configurationBehaviorRequireStartEndDatesSlider2" id="configurationBehaviorRequireStartEndDatesSlider2" />';
                    html += '   </td>';
                } else {
                    alert('Unrecognized json attribute xcx1-1: ' + JSON.stringify(checklist.ChecklistTemplateRow[i]));
                }
                html += '</tr>';
                html += '</table>';
            }
            html += '</td>';
            html += '</tr>';
            html += '</table>';



            this.element.html(html); // Render the checklists editor.

            var configurationBehaviorRequireStartEndDatesOptions2 = {
                checked: false, //requireStartEndDates,
                show_labels: true,         // Should we show the on and off labels?
                labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                on_label: "YES",            // Text to be displayed when checked
                off_label: "NO",          // Text to be displayed when unchecked
                width: 50,                 // Width of the button in pixels
                height: 22,                // Height of the button in pixels
                button_width: 24,         // Width of the sliding part in pixels
                clear_after: null         // Override the element after which the clearing div should be inserted
            };
            $("input#configurationBehaviorRequireStartEndDatesSlider2").switchButton(configurationBehaviorRequireStartEndDatesOptions2);




        } catch (e) {
            console.log('Exception in bwChecklistsEditor_Admin.js.renderChecklistsEditor: ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor_Admin.js.renderChecklistsEditor: ' + e.message + ', ' + e.stack);
            alert('Exception in bwChecklistsEditor_Admin.js.renderChecklistsEditor: ' + e.message + ', ' + e.stack);
        }
    },
    checkIfThereHaveBeenChangesToThisChecklist: function (bwChecklistTemplatesLibraryId) {
        try {
            console.log('In bwChecklistsEditor_Admin.js.checkIfThereHaveBeenChangesToThisChecklist(). bwChecklistTemplatesLibraryId: ' + bwChecklistTemplatesLibraryId);
            //alert('In bwChecklistsEditor_Admin.js.checkIfThereHaveBeenChangesToThisChecklist(). bwChecklistTemplatesLibraryId: ' + bwChecklistTemplatesLibraryId);
            var thiz = this;

            var workflowAppTitle = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTitle');

            if (!bwChecklistTemplatesLibraryId) {

                alert('In checkIfThereHaveBeenChangesToThisChecklist(). Unexpected value for bwChecklistTemplatesLibraryId: ' + bwChecklistTemplatesLibraryId);
                //bwChecklistTemplatesLibraryId = $('#bwChecklistEditor_Admin_selectChecklist_' + this.options.elementIdSuffix).find('option:selected').val();

            }

            //alert('In renderChecklistsEditor(). bwChecklistTemplatesLibraryId: ' + bwChecklistTemplatesLibraryId);
            var thereHaveBeenChangesToThisChecklist = false;
            var checklist;
            for (var i = 0; i < this.options.store.DraftChecklists.length; i++) {
                if (bwChecklistTemplatesLibraryId == this.options.store.DraftChecklists[i].bwChecklistTemplatesLibraryId) {

                    ////var json = this.options.store.Checklists;
                    //var json = JSON.parse(this.options.store.DraftChecklists[i].ChecklistJson);
                    //document.getElementById('spanDisplayJsonDialogTitle').innerHTML = 'Checklist JSON';
                    //$('#txtDisplayJsonDialogJSON').empty();
                    //$('#txtDisplayJsonDialogJSON').append(JSON.stringify(json, null, 2));
                    //break;

                    checklist = this.options.store.DraftChecklists[i];

                    var oldJsonString = JSON.stringify(this.options.store.Checklists[i]);
                    var newJsonString = JSON.stringify(this.options.store.DraftChecklists[i]);
                    if (oldJsonString != newJsonString) {
                        thereHaveBeenChangesToThisChecklist = true;
                    }

                    //alert('car: ' + JSON.stringify(car));
                    break;
                }
            }



            var html = '';


            //var thereHaveBeenChangesToThisChecklist = false;
            //var oldJsonString = JSON.stringify(this.options.store.Checklists[checklistIndex]);
            //var newJsonString = JSON.stringify(this.options.store.DraftChecklists[checklistIndex]);
            //if (oldJsonString != newJsonString) {
            //    thereHaveBeenChangesToThisChecklist = true;
            //}

            console.log('***');
            console.log('Checking thereHaveBeenChangesToThisChecklist xcx333854 thereHaveBeenChangesToThisChecklist: ' + thereHaveBeenChangesToThisChecklist);
            console.log('***');

            if (thereHaveBeenChangesToThisChecklist) {
                //console.log('In renderChecklistsEditor(). The user has made changes which have not been saved.');
                html += '<span style="font-style:italic;color:tomato;">You have changes that won\'t be available until you publish: </span>';
                html += '<input class="buttonAddNewAssignmentRow" type="button" value="Publish" style="padding:7px 10px 7px 10px;" onclick="$(\'.bwChecklistsEditor_Admin\').bwChecklistsEditor_Admin(\'publishChecklistToGlobalLibrary\', \'' + bwChecklistTemplatesLibraryId + '\');">';
                html += '&nbsp;<input class="buttonAddNewAssignmentRow" type="button" value="Cancel Changes" style="padding:7px 10px 7px 10px;" onclick="$(\'.bwChecklistsEditor_Admin\').bwChecklistsEditor_Admin(\'cancelChangesInDraftChecklistConfiguration\');" />';
                //html += '&nbsp;<input class="buttonAddNewAssignmentRow" type="button" value="Cancel Changes" style="padding:7px 10px 7px 10px;" onclick="$(\'.bwChecklistsEditor_Admin\').bwChecklistsEditor_Admin(\'cancelChangesInDraftChecklistConfiguration\');" />';
                html += '&nbsp;<input class="buttonAddNewAssignmentRow" style="padding:5px 10px 5px 10px;" onclick="$(\'.bwChecklistsEditor_Admin\').bwChecklistsEditor_Admin(\'downloadChecklistsJson\', \'\');" type="button" value="View Checklist JSON">';

            } else {
                // Do nothing because the user has made no changes to the checklist.
                //console.log('In renderChecklistsEditor(). THE USER HAS MADE NO CHANGES TO THE CHECKLIST.');
            }

            html += '<br />';
            html += '<br />';

            // Render the json.
            html += '<table class="xdFormLayout" style="width:100%;BORDER-TOP: #d8d8d8 1pt solid; BORDER-RIGHT: #d8d8d8 1pt solid; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 0px; PADDING-TOP: 0px; PADDING-LEFT: 15px; BORDER-LEFT: #d8d8d8 1pt solid; PADDING-RIGHT: 0px">';
            html += '<tr>';
            html += '<td>';
            debugger;
            //var checklist = this.options.store.DraftChecklists[checklistIndex];


            //alert('>>>>>>>>>> checklist: ' + JSON.stringify(checklist));

            html += '<h4>' + checklist.Title + '</h4>';
            for (var i = 0; i < checklist.ChecklistTemplateRow.length; i++) {
                html += '<table style="width:50%;">';
                html += '<tr>';
                if (checklist.ChecklistTemplateRow[i].hasOwnProperty('TitleSection')) {
                    html += '<td colspan="2">';
                    html += checklist.ChecklistTemplateRow[i].TitleSection;
                    html += '</td>';
                } else if (checklist.ChecklistTemplateRow[i].hasOwnProperty('ChecklistItem')) {
                    html += '   <td style="width:95%;text-align:left;color:black;" class="bwSliderTitleCell">';
                    var question = checklist.ChecklistTemplateRow[i].ChecklistItem.Question.trim();
                    var lastCharacter = question.charAt(question.length - 1);
                    if (lastCharacter == '?') {
                        html += '       ' + checklist.ChecklistTemplateRow[i].ChecklistItem.Question + '';
                    } else {
                        html += '       ' + checklist.ChecklistTemplateRow[i].ChecklistItem.Question + ':';
                    }
                    html += '   </td>';
                    html += '   <td style="width:5%;" class="bwChartCalculatorLightCurrencyTableCell">';
                    html += '       <label for="configurationBehaviorRequireStartEndDatesSlider2"></label><input type="checkbox" name="configurationBehaviorRequireStartEndDatesSlider2" id="configurationBehaviorRequireStartEndDatesSlider2" />';
                    html += '   </td>';
                } else {
                    alert('Unrecognized json attribute xcx1-2: ' + JSON.stringify(checklist.ChecklistTemplateRow[i]));
                }
                html += '</tr>';
                html += '</table>';
            }
            html += '</td>';
            html += '</tr>';
            html += '</table>';



            this.element.append(html); // Render the checklists editor.

            var configurationBehaviorRequireStartEndDatesOptions2 = {
                checked: false, //requireStartEndDates,
                show_labels: true,         // Should we show the on and off labels?
                labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                on_label: "YES",            // Text to be displayed when checked
                off_label: "NO",          // Text to be displayed when unchecked
                width: 50,                 // Width of the button in pixels
                height: 22,                // Height of the button in pixels
                button_width: 24,         // Width of the sliding part in pixels
                clear_after: null         // Override the element after which the clearing div should be inserted
            };
            $("input#configurationBehaviorRequireStartEndDatesSlider2").switchButton(configurationBehaviorRequireStartEndDatesOptions2);




        } catch (e) {
            console.log('Exception in bwChecklistsEditor_Admin.js.checkIfThereHaveBeenChangesToThisChecklist: ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor_Admin.js.checkIfThereHaveBeenChangesToThisChecklist: ' + e.message + ', ' + e.stack);
            alert('Exception in bwChecklistsEditor_Admin.js.checkIfThereHaveBeenChangesToThisChecklist: ' + e.message + ', ' + e.stack);
        }
    },
    createNewChecklist: function () {
        try {
            console.log('In createNewChecklist().');
            //alert('In createNewChecklist().');
            // This is where a user goes to add a new checklist to the global library.

            var bwChecklistTemplatesLibraryId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });

            //var bwChecklistTemplatesId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            //    return v.toString(16);
            //});
            var newChecklist = {
                bwChecklistTemplatesLibraryId: bwChecklistTemplatesLibraryId,
                Title: 'New Checklist 1',
                Description: '',
                //ChecklistJson: {
                //bwChecklistTemplatesId: bwChecklistTemplatesId,
                //Title: 'New Checklist 1',
                HoverOver: 'xx',
                ChecklistTemplateRow: []
                //}
            };
            var checklistIndex = this.options.store.Checklists.length;
            this.options.store.Checklists[checklistIndex] = JSON.parse(JSON.stringify(newChecklist)); // This initializes the json while also ensuring the checklist content is empty, so that we can determine if the new checklist needs to be published.
            this.options.store.DraftChecklists[checklistIndex] = JSON.parse(JSON.stringify(newChecklist));
            // Now put some rudimentary stuff in the new checklist to help the user get started...
            this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow.push({ TitleSection: 'Select Yes for all items that apply to this request. Comments and Completion Date are required for all items marked as Yes...' });
            this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow.push({ TitleSection: '<br />' });
            this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow.push({ TitleSection: '<br />' });
            this.editChecklist(bwChecklistTemplatesLibraryId);

        } catch (e) {
            console.log('Exception in bwChecklistsEditor_Admin.js.createNewChecklist(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwChecklistsEditor_Admin.js.createNewChecklist(): ' + e.message + ', ' + e.stack);
        }
    },
    getChecklist: function () {
        try {
            console.log('In getChecklist().'); // This is where a user goes to get a new checklist. We will hve a whole bunch of them in here.
            var thiz = this;

            var dialogId = 'divGetChecklistDialog_' + this.options.elementIdSuffix;

            var div = document.getElementById(dialogId);
            if (!div) {

                div = document.createElement('div');
                div.id = dialogId;
                div.style.display = 'none';
                document.body.appendChild(div); // Place at end of document

                var html = '';

                html += '        <table style="width:100%;">';
                html += '            <tr>';
                html += '                <td style="width:90%;">';
                html += '                    <span id="divRequestFormContent"></span>';
                html += '                </td>';
                html += '            </tr>';
                html += '        </table>';
                html += '        <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and zooming in on the iPhone. -->';
                html += '        <br /><br />';

                div.innerHTML = html;
            }

            $('#' + dialogId).dialog({
                modal: true,
                resizable: false,
                closeText: "Cancel",
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                width: "1000px",
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                position: {
                    my: "middle top+150", // This 115 is a rough good spot.... 3-27-2022
                    at: "middle top",
                    of: window
                },
                close: function () {
                    $('#' + dialogId).dialog('destroy');
                },
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $('#' + dialogId).dialog('close');
                    });

                    var element2 = document.getElementById(dialogId).parentNode; // This is the best way to get a handle on the jquery dialog.
                    var requestDialogParentId = dialogId + '_Parent'; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.
                    element2.id = requestDialogParentId; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.

                    var html = '';
                    html += '<table style="width:100%;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequestDialog\');">'; // This click event is like "pin". Once the user clicks the header of the request dialog, it no longer is modal and persists on the screen until they choose to close it.
                    html += '   <tr>';
                    html += '       <td style="width:95%;">';
                    html += '           <div id="slider_' + dialogId + '" style="width:20%;cursor:pointer;"></div>';
                    html += '       </td>';
                    html += '       <td>';
                    html += '           <span class="dialogXButton" style="font-size:25pt;cursor:pointer;width:100%;" onclick="$(\'.bwPageScrollingHandler\').bwPageScrollingHandler(\'CloseDialogAndPreventNextWindowScrollEvent\', \'' + dialogId.replace('_Parent', '') + '\');">X</span>';
                    html += '       </td>';
                    html += '   </tr>';
                    html += '</table>';

                    document.getElementById(dialogId).parentNode.querySelector(".ui-dialog-titlebar").innerHTML = html;

                    html = '';

                    html += '<table>';
                    html += '   <tr>';
                    html += '       <td colspan="2" style="vertical-align:top;">';
                    html += '           <span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:30pt;font-weight:bold;">';
                    html += '               Checklists Library';
                    html += '           </span>';
                    html += '           <br />';
                    html += '           <span id="spanConfigureEmailNotificationsDialogSubTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:15pt;font-weight:normal;">';
                    html += '               Select from this library of pre-existing checklists to add to your organization.';
                    html += '           </span>';
                    html += '       </td>';
                    html += '   </tr>';
                    html += '   <tr>';
                    html += '       <td colspan="2" style="vertical-align:top;">';
                    html += '           <br /><br /><br />';
                    html += '       </td>';
                    html += '   </tr>';
                    html += '   <tr class="xdTableOffsetRow2">';
                    html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
                    html += '           <span class="xdlabel" style="color:gray;font-size:12pt;">';
                    html += '               <input type="button" style="padding:5px 10px 5px 10px;cursor:pointer;" onclick="$(\'.bwChecklistsEditor_Admin\').bwChecklistsEditor_Admin(\'addChecklist\', \'0\');" value="Add checklist" />';
                    html += '           </span>';
                    html += '       </td>';
                    html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
                    html += '           <span>Nova Scotia Environment - Environmental Considerations Checklist / Impact Statements</span>';
                    html += '       </td>';
                    html += '   </tr>';

                    html += '   <tr class="xdTableOffsetRow2">';
                    html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
                    html += '           <span class="xdlabel" style="color:gray;font-size:12pt;">';
                    html += '               <input type="button" style="padding:5px 10px 5px 10px;cursor:pointer;" onclick="$(\'.bwChecklistsEditor_Admin\').bwChecklistsEditor_Admin(\'addChecklist\', \'0\');" value="Add checklist" />';
                    html += '           </span>';
                    html += '       </td>';
                    html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
                    html += '           <span>Generic Food Safety Checklist</span>';
                    html += '       </td>';
                    html += '   </tr>';

                    html += '   <tr class="xdTableOffsetRow2">';
                    html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
                    html += '           <span class="xdlabel" style="color:gray;font-size:12pt;">';
                    html += '               <input type="button" style="padding:5px 10px 5px 10px;cursor:pointer;" onclick="$(\'.bwChecklistsEditor_Admin\').bwChecklistsEditor_Admin(\'addChecklist\', \'0\');" value="Add checklist" />';;
                    html += '           </span>';
                    html += '       </td>';
                    html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
                    html += '           <span>Generic Health and Safety Checklist</span>';
                    html += '       </td>';
                    html += '   </tr>';

                    html += '</table>';

                    html += '<br />';
                    html += '<br />';
                    html += '<span id="spanConfigureEmailNotificationsDialogSubTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:15pt;font-weight:normal;">';
                    html += '   More checklists will be added to this library in the future. If there is a checklist you would like to see in this list, you are welcome to email suggestions to todd@budgetworkflow.com.';
                    html += '</span>';

                    html += '<br />';
                    html += '<br />';
                    html += '<br />';
                    html += '<br />';
                    html += '<div id="xcx2134235" class="divSignInButton" style="width:90%;text-align:center;line-height:0.8em;font-weight:bold;cursor:pointer;" onclick="$(\'#' + dialogId + '\').dialog(\'close\');">';
                    html += '   Close';
                    html += '</div>';
                    html += '<br />';
                    html += '<br />';

                    document.getElementById(dialogId).innerHTML = html;

                    $("#slider_" + dialogId).slider({
                        min: 50,
                        max: 200,
                        value: 100, // It starts off full size.
                        slide: function (event, ui) {
                            thiz.setZoom(ui.value, dialogId);
                        }//,
                        //change: function (event, ui) {
                        //    thiz.setZoom(ui.value, requestDialogId);
                        //}
                    });
                    thiz.setZoom(100, dialogId);

                }
            });

            //alert('This functionality is incomplete. Coming soon! This will allow a user to browse a library of pre existing checklists.');
            //var bwChecklistTemplatesId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            //    return v.toString(16);
            //});
            //var newChecklist = {
            //    bwChecklistTemplatesId: bwChecklistTemplatesId,
            //    bwTenantId: tenantId,
            //    bwWorkflowAppId: workflowAppId,
            //    Title: 'New Checklist 1',
            //    HoverOver: 'xx',
            //    ChecklistTemplateRow: []
            //};
            //var checklistIndex = this.options.store.Checklists.length;
            //this.options.store.Checklists[checklistIndex] = JSON.parse(JSON.stringify(newChecklist)); // This initializes the json while also ensuring the checklist content is empty, so that we can determine if the new checklist needs to be published.
            //this.options.store.DraftChecklists[checklistIndex] = JSON.parse(JSON.stringify(newChecklist));
            //// Now put some rudimentary stuff in the new checklist to help the user get started...
            //this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow.push({ TitleSection: 'Select Yes for all items that apply to this request. Comments and Completion Date are required for all items marked as Yes...' });
            //this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow.push({ TitleSection: '<br />' });
            //this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow.push({ TitleSection: '<br />' });
            //this.editChecklist(checklistIndex);
        } catch (e) {
            console.log('Exception in bwChecklistsEditor_Admin.js.getChecklist(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor_Admin.js.getChecklist(): ' + e.message + ', ' + e.stack);
        }
    },
    addChecklist: function (checklistId) {
        try {
            console.log('In bwChecklistsEditor_Admin.js.addChecklist().');

            alert('In bwChecklistsEditor_Admin.js.addChecklist(). checklistId: ' + checklistId + '. This functionality is incomplete. Coming soon!');







        } catch (e) {
            console.log('Exception in bwChecklistsEditor_Admin.js.addChecklist(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor_Admin.js.addChecklist(): ' + e.message + ', ' + e.stack);
        }
    },
    saveChecklistToGlobalLibrary: function () {
        try {
            console.log('In bwChecklistsEditor_Admin.js.saveChecklistToGlobalLibrary().');
            var thiz = this;

            var json1 = $('#txtDisplayJsonDialogJSON_' + this.options.elementIdSuffix).val();

            var json;
            var checklistHasFailedValidation = false;
            try {
                json = JSON.parse(json1);
            } catch (e) {
                displayAlertDialog('This JSON is not properly formatted.');
                checklistHasFailedValidation = true;
            }

            if (checklistHasFailedValidation != true) {

                if (json.length == 1) {

                    // Now we check to see if the expected json attributes exist.
                    //if (json[0].bwChecklistTemplatesLibraryId) {

                    if (json[0].Title) {

                        if (json[0].Description) {

                            // It has passed our simple test. Now lets save it.
                            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');
                            var data = {
                                bwParticipantId_LoggedIn: participantId,
                                bwActiveStateIdentifier: activeStateIdentifier,
                                bwWorkflowAppId_LoggedIn: workflowAppId,

                                Checklist: JSON.stringify(json[0]),
                                isActive: true
                            };
                            $.ajax({
                                url: this.options.operationUriPrefix + "_bw/savechecklisttogloballibrary",
                                type: "POST",
                                data: data,
                                headers: {
                                    "Accept": "application/json; odata=verbose"
                                },
                                success: function (ctlResult) {
                                    try {

                                        if (ctlResult.status != 'SUCCESS') {

                                            console.log('Error in bwChecklistsEditor_Admin.js.saveChecklistToGlobalLibrary(). ' + ctlResult.status + ': ' + ctlResult.message);
                                            displayAlertDialog('Error in bwChecklistsEditor_Admin.js.saveChecklistToGlobalLibrary(). ' + ctlResult.status + ': ' + ctlResult.message);

                                        } else {

                                            displayAlertDialog(ctlResult.message); //'The checklist was saved or updated succesfully.');

                                            $('#divChecklistJsonDialog_' + thiz.options.elementIdSuffix).dialog('close');

                                        }

                                    } catch (e) {
                                        console.log('Exception in bwChecklistsEditor_Admin.js.saveChecklistToGlobalLibrary(): ' + e.message + ', ' + e.stack);
                                        displayAlertDialog('Exception in bwChecklistsEditor_Admin.js.saveChecklistToGlobalLibrary(): ' + e.message + ', ' + e.stack);
                                    }
                                }, error: function (data) {

                                    var msg = 'Error in bwChecklistsEditor_Admin.js.saveChecklistToGlobalLibrary./savenewchecklisttogloballibrary(): ' + JSON.stringify(data);
                                    console.log(msg);
                                    displayAlertDialog(msg);

                                }
                            });

                        } else {
                            displayAlertDialog('This JSON is missing the attribute "Description".');
                        }
                    } else {
                        displayAlertDialog('This JSON is missing the attribute "Title".');
                    }
                    //} else {
                    //    displayAlertDialog('This JSON is missing the attribute "bwChecklistTemplatesLibraryId".');
                    //}
                } else {
                    displayAlertDialog('This JSON array does not have the expected length of 1.');
                }
            }

        } catch (e) {
            console.log('Exception in bwChecklistsEditor_Admin.js.saveChecklistToGlobalLibrary(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor_Admin.js.saveChecklistToGlobalLibrary(): ' + e.message + ', ' + e.stack);
        }
    },
    updateChecklistInGlobalLibrary: function () {
        try {
            console.log('In bwChecklistsEditor_Admin.js.updateChecklistInGlobalLibrary().');
            //alert('In bwChecklistsEditor_Admin.js.updateChecklistInGlobalLibrary(). This functionality is incomplete. Coming soon!');
            var thiz = this;

            var json1 = $('#divDownloadChecklistJsonDialog_txtDisplayJsonDialogJSON_' + this.options.elementIdSuffix).val();

            var json;
            var checklistHasFailedValidation = false;
            try {
                json = JSON.parse(json1);
            } catch (e) {
                displayAlertDialog('This JSON is not properly formatted.');
                checklistHasFailedValidation = true;
            }

            if (checklistHasFailedValidation != true) {

                if (json.length == 1) {

                    // Now we check to see if the expected json attributes exist.
                    //if (json[0].bwChecklistTemplatesLibraryId) {

                    if (json[0].Title) {

                        if (json[0].Description) {

                            // It has passed our simple test. Now lets save it.
                            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');
                            var data = {
                                bwParticipantId_LoggedIn: participantId,
                                bwActiveStateIdentifier: activeStateIdentifier,
                                bwWorkflowAppId_LoggedIn: workflowAppId,

                                Checklist: JSON.stringify(json[0]),
                                isActive: true
                            };
                            $.ajax({
                                url: this.options.operationUriPrefix + "_bw/savechecklisttogloballibrary",
                                type: "POST",
                                data: data,
                                headers: {
                                    "Accept": "application/json; odata=verbose"
                                },
                                success: function (ctlResult) {
                                    try {

                                        if (ctlResult.status != 'SUCCESS') {

                                            console.log('Error in bwChecklistsEditor_Admin.js.updateChecklistInGlobalLibrary(). ' + ctlResult.status + ': ' + ctlResult.message);
                                            displayAlertDialog('Error in bwChecklistsEditor_Admin.js.updateChecklistInGlobalLibrary(). ' + ctlResult.status + ': ' + ctlResult.message);

                                        } else {

                                            displayAlertDialog(ctlResult.message); //'The checklist was saved or updated succesfully.');

                                            $('#divChecklistJsonDialog_' + thiz.options.elementIdSuffix).dialog('close');

                                        }

                                    } catch (e) {
                                        console.log('Exception in bwChecklistsEditor_Admin.js.updateChecklistInGlobalLibrary(): ' + e.message + ', ' + e.stack);
                                        displayAlertDialog('Exception in bwChecklistsEditor_Admin.js.updateChecklistInGlobalLibrary(): ' + e.message + ', ' + e.stack);
                                    }
                                }, error: function (data) {

                                    var msg = 'Error in bwChecklistsEditor_Admin.js.updateChecklistInGlobalLibrary./savenewchecklisttogloballibrary(): ' + JSON.stringify(data);
                                    console.log(msg);
                                    displayAlertDialog(msg);

                                }
                            });

                        } else {
                            displayAlertDialog('This JSON is missing the attribute "Description".');
                        }
                    } else {
                        displayAlertDialog('This JSON is missing the attribute "Title".');
                    }
                    //} else {
                    //    displayAlertDialog('This JSON is missing the attribute "bwChecklistTemplatesLibraryId".');
                    //}
                } else {
                    displayAlertDialog('This JSON array does not have the expected length of 1.');
                }
            }

        } catch (e) {
            console.log('Exception in bwChecklistsEditor_Admin.js.updateChecklistInGlobalLibrary(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor_Admin.js.updateChecklistInGlobalLibrary(): ' + e.message + ', ' + e.stack);
        }
    },
    addChecklistUsingJson: function () {
        try {
            console.log('In bwChecklistsEditor_Admin.js.addChecklistUsingJson().');

            // Display a dialog box with a big textarea so that the contents can be copied and pasted.
            var dialogId = 'divChecklistJsonDialog_' + this.options.elementIdSuffix;
            var div = document.getElementById(dialogId);
            if (!div) {
                div = document.createElement('div');
                div.id = dialogId;
                div.style.display = 'none';
                document.body.appendChild(div); // Place at end of document
            }

            var html = '';

            html += '  <table style="width:100%;">';
            html += '    <tr>';
            html += '      <td style="width:90%;">';
            html += '        <span id="spanDisplayJsonDialogTitle_' + this.options.elementIdSuffix + '" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">[spanDisplayJsonDialogTitle]</span>';
            html += '      </td>';
            html += '      <td style="width:9%;"></td>';
            html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#' + dialogId + '\').dialog(\'close\');">X</span>';
            html += '      </td>';
            html += '    </tr>';
            html += '  </table>';
            html += '  <br /><br />';
            html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '  <span id="spanDisplayJsonDialogContent" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:20pt;">';
            html += 'Paste the checklist JSON here, change the checklist title if you wish, then click the "Save" button.';
            html += '</span>';
            html += '  <br />';
            html += '  <br />';
            // Copy to clipboard.
            //html += '<div class="tooltip">';
            //html += '   <button onclick="copyToClipboard(\'txtDisplayJsonDialogJSON\', \'spanDisplayJsonDialogCopyJsonTooltip\')" onmouseout="copyToClipboardMouseout(\'spanDisplayJsonDialogCopyJsonTooltip\')">';
            //html += '       <span class="tooltiptext" id="spanDisplayJsonDialogCopyJsonTooltip">Copy JSON to the clipboard</span>';
            //html += '       Copy'; // JSON...';
            //html += '   </button>';
            //html += '</div>';
            // end Copy to clipboard.
            html += '  <textarea id="txtDisplayJsonDialogJSON_' + this.options.elementIdSuffix + '" rows="30" cols="130" style="padding-top:4px;font-size:8pt;"></textarea>';
            //html += '  <pre id="txtDisplayJsonDialogJSON" style="overflow:auto;padding-top:4px;font-size:8pt;width:98%;height:300px;border:1px solid gainsboro;"></pre>';
            html += '  <br />';
            html += '  <br />';
            html += '  <div id="divSaveAsANewChecklist" class="divDialogButton" title="Click here to save this JSON as a new checklist..." onclick="$(\'.bwChecklistsEditor_Admin\').bwChecklistsEditor_Admin(\'saveChecklistToGlobalLibrary\');">';
            html += '   Save as a New Checklist';
            html += '  </div>';
            html += '  <br /><br />';
            html += '  <div class="divDialogButton" onclick="$(\'#' + dialogId + '\').dialog(\'close\');">';
            html += '   Close';
            html += '  </div>';
            html += '  <br />';
            html += '  <br />';

            div.innerHTML = html;

            $('#' + dialogId).dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: "820",
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false,//, // This means when hiding just disappear with no effects.
                open: function (event, ui) { $('.ui-widget-overlay').bind('click', function () { $('#' + dialogId).dialog('close'); }); } // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.
            });
            //$('#' + dialogId).dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();



























            //// Nothing is in the database yet, so just present the built in checklists.
            //var bwChecklistTemplatesId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            //    return v.toString(16);
            //});
            //var json = {
            //    bwChecklistTemplatesId: bwChecklistTemplatesId,
            //    bwTenantId: tenantId,
            //    bwWorkflowAppId: workflowAppId,
            //    Title: 'Environmental Considerations Checklist / Impact Statements',
            //    HoverOver: 'xx',
            //    ChecklistTemplateRow: []

            //};
            //json.ChecklistTemplateRow.push({ TitleSection: 'Select Yes for all items that apply to this request. Comments and Completion Date are required for all items marked as Yes...' });
            //json.ChecklistTemplateRow.push({ TitleSection: '<br />' });
            //json.ChecklistTemplateRow.push({ TitleSection: '<br />' });
            //json.ChecklistTemplateRow.push({ TitleSection: 'The following checklist will assist you with the preparation of the Environmental Impact Statement and Environmental Assessment, if required. Please note, this list is not meant to be exhaustive. For more detailed information see Nova Scotia Environment’s ‘Proponent’s Guide Environmental Assessment’ and ‘Proponents Guide to Wind Projects’.' });
            //json.ChecklistTemplateRow.push({ TitleSection: '<br />' });
            //json.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'Will preparing your project site and constructing your project impact the local environment?', YesText: '', NoText: '' } });
            //json.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'What is the proximity of your project to local conservation areas (provincial, federal and municipal)?' } });
            //json.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'Will your project or the construction of your project affect the migratory pattern of birds, bats, or other wildlife?' } });
            //json.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'Will your project impact a large or important bird colony (herons, gulls, terns, raptors, waterfowl) or bats?' } });
            //json.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'Is your project located within 5 km inland of costal waters (potential impact to shorebirds)?' } });
            //json.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'Is your project near a protected municipal water supply?' } });
            //json.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'Will the operation and maintenance of your project have environmental impacts?' } });
            //json.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'Will your project effect the biophysical environment including the geological features, surface water, groundwater, wetlands, flora and fauna species and habitat, etc.?' } });
            //json.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'Have you considered what the overall impacts of the project will be on the environment and vice versa, what the effects of the environment will be on your project?' } });
            //json.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'Does your project impact Aboriginal rights or title?' } });
            //json.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'Has the federal government provided you with financial assistance, sold, leased or disposed of federal lands for the purposes of your projects? If so, a federal environmental assessment may be required. For more information please visit www.ceaa.gc.ca.' } });
            //json.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'Have you considered the time it will take you to obtain an environmental assessment and factored that in to your project planning? For more information on regulatory time frames visit  http://www.gov.ns.ca/nse/ea/docs/EA.RegistrationTimeFrames.pdf.' } });
            //json.ChecklistTemplateRow.push({ TitleSection: '<br />' });
            //json.ChecklistTemplateRow.push({ TitleSection: 'If there are minimal environmental impacts assessed for your project, your statement might include information such as:' });
            //json.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'There are no known bat hibernacula within a 25 km radius' } });
            //json.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'The project is not within a migratory staging or wintering area, or near a conservation area or habitat for large raptors,' } });
            //json.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'The project is not expected to impact a watercourse' } });
            //json.ChecklistTemplateRow.push({ TitleSection: '<br />' });
            //json.ChecklistTemplateRow.push({ TitleSection: 'If you suspect there may be complex environmental issues related to the construction of your renewable electricity project please contact Nova Scotia Environment very early on during your project planning. For more information about environmental assessments please contact the Environmental Assessment Branch of Nova Scotia Environment at (902) 424-3230 or refer to www.gov.ns.ca/nse/ea.' });
            //json.ChecklistTemplateRow.push({ TitleSection: '<br />' });
            //json.ChecklistTemplateRow.push({ TitleSection: '<br />' });
            //json.ChecklistTemplateRow.push({ TitleSection: 'Feel free to include any formal information and advice you receive from Nova Scotia Environment with the submission of your COMFIT application. Obtaining accurate information about the potential impacts of your project early in the process will allow your application to be processed more efficiently and will also allow you to communicate this information to the community and other interested stakeholders.' });
            //json.ChecklistTemplateRow.push({ TitleSection: '<br />' });
            //json.ChecklistTemplateRow.push({ TitleSection: '<br />' });
            //json.ChecklistTemplateRow.push({ TitleSection: 'If you have questions about what you need to submit in your COMFIT application please send them to comfit@gov.ns.ca.' });
            //json.ChecklistTemplateRow.push({ TitleSection: '<br />' });
            ////this.options.store = json; // SAVE TO THE OBJECT






            //var bwChecklistTemplatesId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            //    return v.toString(16);
            //});
            //var json3 = {
            //    bwChecklistTemplatesLibraryId: bwChecklistTemplatesId,
            //    Title: 'Health and Safety',
            //    HoverOver: 'xx',
            //    ChecklistTemplateRow: []
            //};
            //json3.ChecklistTemplateRow.push({ TitleSection: 'Select Yes for all items that apply to this request. Comments and Completion Date are required for all items marked as Yes...' });
            //json3.ChecklistTemplateRow.push({ TitleSection: '<br />' });
            //json3.ChecklistTemplateRow.push({ TitleSection: '<br />' });
            //json3.ChecklistTemplateRow.push({ TitleSection: 'Nova Scotia Occupational Health and Safety Division - Occupational Health and Safety Checklist, Small Business.' });
            //json3.ChecklistTemplateRow.push({ TitleSection: '<br />' });
            //json3.ChecklistTemplateRow.push({ TitleSection: 'Form # 606. Date issued: 03/06. Form Revision date: 03/06. Approved by: Jim LeBlanc, Director.' });
            //json3.ChecklistTemplateRow.push({ TitleSection: '<br />' });
            //json3.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'Is a copy of the Occupational Health and Safety (OH&S) Act,  the company’s OH&S Policy (5 or more employees) and the current phone number for OH&S posted?', YesText: '', NoText: '' } });
            //json3.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'Has a Safety Representative been selected by staff (if you have 5 or more employees)?', YesText: '', NoText: '' } });
            //json3.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'Are all employees trained in how to work safely and in the hazards associated with their work?', YesText: '', NoText: '' } });
            //json3.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'Is there at least one employee on each shift with the appropriate first aid certificate, and a first aid kit available?', YesText: '', NoText: '' } });
            //json3.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'Is appropriate fall protection such as fall arrest harness, guardrails, roof brackets etc. in place?', YesText: '', NoText: '' } });
            //json3.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'Is scaffolding constructed by a competent person and adequately secured?', YesText: '', NoText: '' } });
            //json3.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'Are all employees who work with or near hazardous products trained in safe use, handling and storage of those products?', YesText: '', NoText: '' } });
            //json3.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'Are all controlled products properly labeled, and Material Safety Data Sheets available?', YesText: '', NoText: '' } });
            //json3.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'Is appropriate personal protective equipment used where a hazard exists?', YesText: '', NoText: '' } });
            //json3.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'Is there an adequate supply of fresh clean air in the workplace?', YesText: '', NoText: '' } });
            //json3.ChecklistTemplateRow.push({ TitleSection: '<br />' });
            ////thiz.options.store.Checklists.push(json3);
            ////thiz.options.store.DraftChecklists.push(json3);



            //var bwChecklistTemplatesLibraryId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            //    return v.toString(16);
            //});
            //var json2 = {
            //    bwChecklistTemplatesLibraryId: bwChecklistTemplatesLibraryId,
            //    Title: 'Food Safety',
            //    HoverOver: 'xx',
            //    ChecklistTemplateRow: []
            //};
            //json2.ChecklistTemplateRow.push({ TitleSection: 'Select Yes for all items that apply to this request. Comments and Completion Date are required for all items marked as Yes...' });
            //json2.ChecklistTemplateRow.push({ TitleSection: '<br />' });
            //json2.ChecklistTemplateRow.push({ TitleSection: '<br />' });
            //json2.ChecklistTemplateRow.push({ TitleSection: 'This checklist, while not replacing regulation, or the need to comply, will help in operating the organization in a healthy and sanitary manner.' });
            //json2.ChecklistTemplateRow.push({ TitleSection: '<br />' });
            //json2.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'Has a written menu plan has been reviewed by a Registered Dietitian?', YesText: '', NoText: '' } });
            //json2.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'Adequate refrigerated space is provided, is working and is capable of keeping foods at 4°C or lower.  Refrigerators are provided with thermometers?', YesText: '', NoText: '' } });
            //json2.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'Kitchen and food preparation area is provided with a separate hand washing sink equipped with hot and cold water, soap and single use towels?', YesText: '', NoText: '' } });
            //json2.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'Kitchen, food storage areas, equipment and utensils have been throughly cleaned prior to opening?', YesText: '', NoText: '' } });
            //json2.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'Floors and floor coverings are tight, smooth, and in good repair t in rooms where food is prepared and served and utensils washed?', YesText: '', NoText: '' } });
            //json2.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'Walls and ceilings in areas where food is prepared and served are tight, easily cleanable and in good repair?', YesText: '', NoText: '' } });
            //json2.ChecklistTemplateRow.push({ ChecklistItem: { Question: 'All cooking equipment is located under a hood or canopy equipped with filters, exhausted to the outside?', YesText: '', NoText: '' } });
            //json2.ChecklistTemplateRow.push({ TitleSection: '<br />' });
            ////thiz.options.store.Checklists.push(json2);
            ////thiz.options.store.DraftChecklists.push(json2);
















            var json = this.options.store.Checklists;
            $('#spanDisplayJsonDialogTitle_' + this.options.elementIdSuffix).html('Add a Checklist to the Checklists Global Library using JSON');
            $('#txtDisplayJsonDialogJSON_' + this.options.elementIdSuffix).empty();
            $('#txtDisplayJsonDialogJSON_' + this.options.elementIdSuffix).append(JSON.stringify(json, null, 2));


        } catch (e) {
            console.log('Exception in bwChecklistsEditor_Admin.js.addChecklistUsingJson(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor_Admin.js.addChecklistUsingJson(): ' + e.message + ', ' + e.stack);
        }
    },
    editChecklist: function () {
        try {
            console.log('In editChecklist().');
            //alert('In editChecklist().');


            var car = {};
            //if (!bwChecklistTemplatesLibraryId) {

            //    alert('In editChecklist(). Unexpected value for bwChecklistTemplatesLibraryId: ' + bwChecklistTemplatesLibraryId);
            var bwChecklistTemplatesLibraryId = $('#bwChecklistEditor_Admin_selectChecklist_' + this.options.elementIdSuffix).find('option:selected').val();

            //}

            //alert('In editChecklist(). bwChecklistTemplatesLibraryId: ' + bwChecklistTemplatesLibraryId);
            for (var i = 0; i < this.options.store.DraftChecklists.length; i++) {
                if (bwChecklistTemplatesLibraryId == this.options.store.DraftChecklists[i].bwChecklistTemplatesLibraryId) {

                    ////var json = this.options.store.Checklists;
                    //var json = JSON.parse(this.options.store.DraftChecklists[i].ChecklistJson);
                    //document.getElementById('spanDisplayJsonDialogTitle').innerHTML = 'Checklist JSON';
                    //$('#txtDisplayJsonDialogJSON').empty();
                    //$('#txtDisplayJsonDialogJSON').append(JSON.stringify(json, null, 2));
                    //break;

                    car = this.options.store.DraftChecklists[i];

                    //alert('car: ' + JSON.stringify(car));
                    break;
                }
            }




            var html = '';
            html += '<h2>Checklists Editor <span style="color:red;">[Edit Mode]</span></h2>';

            html += '                           <span class="printButton" title="print" onclick="cmdPrintForm();">&#x1f5a8;</span>';

            html += '<br />';
            html += 'Checklist: ';
            html += '<select style="padding:5px 5px 5px 5px;" id="bwChecklistEditor_Admin_selectChecklist_' + this.options.elementIdSuffix + '" onchange="$(\'.bwChecklistsEditor_Admin\').bwChecklistsEditor_Admin(\'selectChecklist_OnChange\', \'editing\', this);">';
            debugger;
            var selectedChecklistIndex;
            for (var i = 0; i < this.options.store.DraftChecklists.length; i++) {
                if (bwChecklistTemplatesLibraryId == this.options.store.DraftChecklists[i].bwChecklistTemplatesLibraryId) {
                    html += '<option value="' + this.options.store.DraftChecklists[i].bwChecklistTemplatesLibraryId + '" selected>' + this.options.store.DraftChecklists[i].Title + '</option>';
                    selectedChecklistIndex = i;
                } else {
                    html += '<option value="' + this.options.store.DraftChecklists[i].bwChecklistTemplatesLibraryId + '">' + this.options.store.DraftChecklists[i].Title + '</option>';
                }
            }
            html += '</select>';
            html += '&nbsp;&nbsp;';
            html += '<input class="buttonAddNewAssignmentRow" style="padding:5px 10px 5px 10px;" onclick="$(\'.bwChecklistsEditor_Admin\').bwChecklistsEditor_Admin(\'viewChecklist\', \'' + bwChecklistTemplatesLibraryId + '\');" type="button" value="View">';

            html += '&nbsp;&nbsp;';
            html += '<input class="buttonAddNewAssignmentRow" style="padding:5px 10px 5px 10px;" onclick="$(\'.bwChecklistsEditor_Admin\').bwChecklistsEditor_Admin(\'addChecklistUsingJson\', \'' + bwChecklistTemplatesLibraryId + '\');" type="button" value="Add checklist using Json">';

            html += '<br />';
            html += '<br />';
            html += '<br />';
            html += '<br />';

            // Render the json.
            html += '<table style="BORDER-TOP: #d8d8d8 1pt solid; BORDER-RIGHT: #d8d8d8 1pt solid; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 0px; PADDING-TOP: 0px; PADDING-LEFT: 0px; BORDER-LEFT: #d8d8d8 1pt solid; PADDING-RIGHT: 0px" >';
            html += '<tr><td>';
            html += '<br />';
            html += '</td></tr>';
            html += '<tr onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';
            html += '  <td onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';
            if (car) {
                html += '    <input id="strChecklistTitle" onkeyup="$(\'.bwChecklistsEditor_Admin\').bwChecklistsEditor_Admin(\'editChecklist_OnKeyUp\', \'' + selectedChecklistIndex + '\', \'title\');" style="color: black;font-family:Verdana,Geneva,Tahoma,sans-serif;font-weight:bold;font-size: 12pt;width:50vw;" type="text" value="' + car.Title + '" />';
            }
            html += '  </td>';
            html += '  <td colspan="2" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';
            html += '    <span style="white-space:nowrap;"><input style="width:100%;" onclick="$(\'.bwChecklistsEditor_Admin\').bwChecklistsEditor_Admin(\'addRowBelow\', \'checklistrow_-1\', \'' + selectedChecklistIndex + '\');" type="button" value="Add row below"></span>';
            html += '  </td>';
            html += '</tr>';
            if (car && car.ChecklistTemplateRow && car.ChecklistTemplateRow.length) {
                for (var i = 0; i < car.ChecklistTemplateRow.length; i++) {
                    html += '<tr id="checklistrow_' + i + '" style="border-bottom-color:red;" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';
                    if (car.ChecklistTemplateRow[i].hasOwnProperty('TitleSection')) { // TitleSection
                        if (car.ChecklistTemplateRow[i].TitleSection == '<br />') {
                            // BLANK LINE
                            html += this.renderBlankLineCell(selectedChecklistIndex, i)
                            html += '  <td style="vertical-align:top;style="border: 1px solid #d8d8d8;"" class="xdTableOffsetCellComponent" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';
                            html += '    <span style="white-space:nowrap;"><select style="padding:5px 5px 5px 5px;" id="selectRowType_' + i + '" class="xdComboBox xdBehavior_Select" size="1" onchange="$(\'.bwChecklistsEditor_Admin\').bwChecklistsEditor_Admin(\'selectRowType_OnChange\', \'checklistrow_' + i + '\', \'' + selectedChecklistIndex + '\');"><option value="Question">Question</option><option value="Instructions">Instructions</option><option selected value="Blank line">Blank line</option></select></span>';
                            html += '  </td>';
                        } else {
                            // INSTRUCTIONS
                            html += '  <td id="rowChecklistContentCell_' + i + '" style="border: 1px solid #d8d8d8;" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';
                            html += this.renderInstructionsCell(selectedChecklistIndex, i, car.ChecklistTemplateRow[i].TitleSection)
                            html += '  </td>';
                            html += '  <td style="border: 1px solid #d8d8d8;vertical-align:top;" class="xdTableOffsetCellComponent" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';
                            html += '    <span style="white-space:nowrap;"><select style="padding:5px 5px 5px 5px;" id="selectRowType_' + i + '" class="xdComboBox xdBehavior_Select" size="1" onchange="$(\'.bwChecklistsEditor_Admin\').bwChecklistsEditor_Admin(\'selectRowType_OnChange\', \'checklistrow_' + i + '\', \'' + selectedChecklistIndex + '\');"><option value="Question">Question</option><option selected value="Instructions">Instructions</option><option value="Blank line">Blank line</option></select></span>';
                            html += '  </td>';
                        }
                    } else if (car.ChecklistTemplateRow[i].hasOwnProperty('ChecklistItem')) {
                        // QUESTION
                        html += '  <td id="rowChecklistContentCell_' + i + '" style="border: 1px solid #d8d8d8;" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';
                        html += this.renderQuestionCell(selectedChecklistIndex, i, car.ChecklistTemplateRow[i].ChecklistItem.Question);
                        html += '  </td>';
                        html += '  <td style="border: 1px solid #d8d8d8;vertical-align:top;" class="xdTableOffsetCellComponent" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';
                        html += '    <span style="white-space:nowrap;"><select style="padding:5px 5px 5px 5px;" id="selectRowType_' + i + '" class="xdComboBox xdBehavior_Select" size="1" onchange="$(\'.bwChecklistsEditor_Admin\').bwChecklistsEditor_Admin(\'selectRowType_OnChange\', \'checklistrow_' + i + '\', \'' + selectedChecklistIndex + '\');"><option selected value="Question">Question</option><option value="Instructions">Instructions</option><option value="Blank line">Blank line</option></select></span>';
                        html += '  </td>';
                    } else {
                        alert('Unrecognized json attribute xcx1-3: ' + JSON.stringify(car.ChecklistTemplateRow[i]));
                    }
                    html += '  <td style="border: 1px solid #d8d8d8;vertical-align:top;" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';
                    html += '    <span style="white-space:nowrap;"><input style="width:100%;" onclick="$(\'.bwChecklistsEditor_Admin\').bwChecklistsEditor_Admin(\'deleteThisRow\', \'checklistrow_' + i + '\', \'' + selectedChecklistIndex + '\');" type="button" value="Delete this row"></span>';
                    html += '<br />';
                    if (i > 0) { // Don't show this button for the top row.
                        html += '    <span style="white-space:nowrap;"><input style="width:100%;" onclick="$(\'.bwChecklistsEditor_Admin\').bwChecklistsEditor_Admin(\'moveRowUp\', \'checklistrow_' + i + '\', \'' + selectedChecklistIndex + '\');" type="button" value="Move row up"></span>';
                        html += '<br />';
                    }
                    if (i < car.ChecklistTemplateRow.length - 1) { // Don't show this button for the bottom row.
                        html += '    <span style="white-space:nowrap;"><input style="width:100%;" onclick="$(\'.bwChecklistsEditor_Admin\').bwChecklistsEditor_Admin(\'moveRowDown\', \'checklistrow_' + i + '\', \'' + selectedChecklistIndex + '\');" type="button" value="Move row down"></span>';
                        html += '<br />';
                    }
                    html += '    <span style="white-space:nowrap;"><input style="width:100%;" onclick="$(\'.bwChecklistsEditor_Admin\').bwChecklistsEditor_Admin(\'addRowBelow\', \'checklistrow_' + i + '\', \'' + selectedChecklistIndex + '\');" type="button" value="Add row below"></span>';
                    html += '  </td>';

                    html += '</tr>';
                }
            }
            html += '</table>';
            this.element.html(html);

            var configurationBehaviorRequireStartEndDatesOptions2 = {
                checked: false, //requireStartEndDates,
                show_labels: true,         // Should we show the on and off labels?
                labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                on_label: "YES",            // Text to be displayed when checked
                off_label: "NO",          // Text to be displayed when unchecked
                width: 50,                 // Width of the button in pixels
                height: 22,                // Height of the button in pixels
                button_width: 24,         // Width of the sliding part in pixels
                clear_after: null         // Override the element after which the clearing div should be inserted
            };
            $("input#configurationBehaviorRequireStartEndDatesSlider2").switchButton(configurationBehaviorRequireStartEndDatesOptions2);

        } catch (e) {
            console.log('Exception in bwChecklistsEditor_Admin.js.editChecklist(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor_Admin.js.editChecklist(): ' + e.message + ', ' + e.stack);
        }
    },
    deleteChecklistFromGlobalLibrary: function () {
        try {
            console.log('In deleteChecklistFromGlobalLibrary().');
            var thiz = this;

            var bwChecklistTemplatesLibraryId = $('#bwChecklistEditor_Admin_selectChecklist_' + thiz.options.elementIdSuffix).find('option:selected').val();
            var title = $('#bwChecklistEditor_Admin_selectChecklist_' + thiz.options.elementIdSuffix).find('option:selected').text();

            var proceed = confirm('Do you wish to proceed Deleting checklist "' + title + ' [' + bwChecklistTemplatesLibraryId + ']"?');
            if (proceed) {

                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');
                var data = {
                    bwParticipantId_LoggedIn: participantId,
                    bwActiveStateIdentifier: activeStateIdentifier,
                    bwWorkflowAppId_LoggedIn: workflowAppId,

                    bwChecklistTemplatesLibraryId: bwChecklistTemplatesLibraryId
                };
                $.ajax({
                    url: this.options.operationUriPrefix + "_bw/deletechecklistfromgloballibrary",
                    type: "POST",
                    data: data,
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    },
                    success: function (ctlResult) {
                        try {

                            if (ctlResult.status != 'SUCCESS') {

                                console.log('Error in bwChecklistsEditor_Admin.js.saveChecklistToGlobalLibrary(). ' + ctlResult.status + ': ' + ctlResult.message);
                                displayAlertDialog('Error in bwChecklistsEditor_Admin.js.saveChecklistToGlobalLibrary(). ' + ctlResult.status + ': ' + ctlResult.message);

                            } else {

                                displayAlertDialog(ctlResult.message); //'The checklist was saved or updated succesfully.');

                                $('#divChecklistJsonDialog_' + thiz.options.elementIdSuffix).dialog('close');

                                thiz.renderChecklistsEditor1();

                            }

                        } catch (e) {
                            console.log('Exception in bwChecklistsEditor_Admin.js.saveChecklistToGlobalLibrary(): ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in bwChecklistsEditor_Admin.js.saveChecklistToGlobalLibrary(): ' + e.message + ', ' + e.stack);
                        }
                    }, error: function (data) {

                        var msg = 'Error in bwChecklistsEditor_Admin.js.saveChecklistToGlobalLibrary./savenewchecklisttogloballibrary(): ' + JSON.stringify(data);
                        console.log(msg);
                        displayAlertDialog(msg);

                    }
                });

            }

        } catch (e) {
            console.log('Exception in bwChecklistsEditor_Admin.js.deleteChecklistFromGlobalLibrary(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor_Admin.js.deleteChecklistFromGlobalLibrary(): ' + e.message + ', ' + e.stack);
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
            console.log('Exception in bwChecklistsEditor_Admin.js.showProgress(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor_Admin.js.showProgress(): ' + e.message + ', ' + e.stack);
        }
    },
    hideProgress: function () {
        try {
            console.log('In bwChecklistsEditor_Admin.js.hideProgress().');

            $('#divProgressBarDialog').dialog('close');
        } catch (e) {
            console.log('Exception in bwChecklistsEditor_Admin.js.hideProgress(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor_Admin.js.hideProgress(): ' + e.message + ', ' + e.stack);
        }
    },
    publishChecklistToGlobalLibrary: function (bwChecklistTemplatesLibraryId) {
        try {
            console.log('In bwChecklistsEditor_Admin.js.publishChecklistToGlobalLibrary(). bwChecklistTemplatesLibraryId: ' + bwChecklistTemplatesLibraryId);
            var thiz = this;

            var json_ChecklistJson;
            for (var i = 0; i < this.options.store.DraftChecklists.length; i++) {
                if (bwChecklistTemplatesLibraryId == this.options.store.DraftChecklists[i].bwChecklistTemplatesLibraryId) {

                    json_ChecklistJson = this.options.store.DraftChecklists[i]; //.ChecklistJson;

                    break;
                }
            }


            console.log('In publishChecklistToGlobalLibrary(). INSPECT THE JSON BEFORE it gets saved. Is this right?: ' + json_ChecklistJson);

            //var json = this.options.store.DraftChecklists[checklistIndex];

            //var json;
            //var checklistHasFailedValidation = false;
            //try {
            //    json = JSON.parse(json1);
            //} catch (e) {
            //    displayAlertDialog('This JSON is not properly formatted.');
            //    checklistHasFailedValidation = true;
            //}

            //if (checklistHasFailedValidation != true) {

            //if (json.length == 1) {

            // Now we check to see if the expected json attributes exist.
            //if (json[0].bwChecklistTemplatesLibraryId) {

            if (json_ChecklistJson.Title) {

                //if (json.Description) {

                // It has passed our simple test. Now lets save it.
                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');
                //alert('json_ChecklistJson strigified: ' + JSON.stringify(json_ChecklistJson));
                var data = {
                    bwParticipantId_LoggedIn: participantId,
                    bwActiveStateIdentifier: activeStateIdentifier,
                    bwWorkflowAppId_LoggedIn: workflowAppId,

                    Checklist: JSON.stringify(json_ChecklistJson),
                    isActive: true
                };
                $.ajax({
                    url: this.options.operationUriPrefix + "_bw/savechecklisttogloballibrary",
                    type: "POST",
                    data: data,
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    },
                    success: function (ctlResult) {
                        try {

                            if (ctlResult.status != 'SUCCESS') {

                                console.log('Error in bwChecklistsEditor_Admin.js.publishChecklistToGlobalLibrary(). ' + ctlResult.status + ': ' + ctlResult.message);
                                displayAlertDialog('Error in bwChecklistsEditor_Admin.js.publishChecklistToGlobalLibrary(). ' + ctlResult.status + ': ' + ctlResult.message);

                            } else {

                                displayAlertDialog(ctlResult.message); //'The checklist was saved or updated succesfully.');

                                //$('#divChecklistJsonDialog_' + thiz.options.elementIdSuffix).dialog('close');

                                thiz.renderChecklistsEditor1();

                            }

                        } catch (e) {
                            console.log('Exception in bwChecklistsEditor_Admin.js.publishChecklistToGlobalLibrary(): ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in bwChecklistsEditor_Admin.js.publishChecklistToGlobalLibrary(): ' + e.message + ', ' + e.stack);
                        }
                    }, error: function (data) {

                        var msg = 'Error in bwChecklistsEditor_Admin.js.publishChecklistToGlobalLibrary./savenewchecklisttogloballibrary(): ' + JSON.stringify(data);
                        console.log(msg);
                        displayAlertDialog(msg);

                    }
                });

                //} else {
                //    displayAlertDialog('This JSON is missing the attribute "Description".');
                //}
            } else {
                displayAlertDialog('This JSON is missing the attribute "Title".');
            }
            //} else {
            //    displayAlertDialog('This JSON is missing the attribute "bwChecklistTemplatesLibraryId".');
            //}
            //} else {
            //    displayAlertDialog('This JSON array does not have the expected length of 1.');
            //}
            //}

        } catch (e) {
            console.log('Exception in bwChecklistsEditor_Admin.js.publishChecklistToGlobalLibrary(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor_Admin.js.publishChecklistToGlobalLibrary(): ' + e.message + ', ' + e.stack);
        }
    },
    cancelChangesInDraftChecklistConfiguration: function () {
        try {
            console.log('In bwChecklistsEditor_Admin.js.cancelChangesInDraftChecklistConfiguration().');

            alert('This functionality is incomplete. Coming soon!');
            //var thiz = this;
            //var proceed = confirm('You may lose changes, and these will be unrecoverable. Do you wish to proceed Publishing checklist "' + this.options.store.DraftChecklists[checklistIndex].Title + '"?');
            //if (proceed) {
            //}
        } catch (e) {
            console.log('Exception in bwChecklistsEditor_Admin.js.cancelChangesInDraftChecklistConfiguration(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor_Admin.js.cancelChangesInDraftChecklistConfiguration(): ' + e.message + ', ' + e.stack);
        }
    },
    displayChecklist: function (checklistIndex) {
        try {
            console.log('In bwChecklistsEditor_Admin.js.displayChecklist().');

            var proceed = confirm('You may lose changes, and these will be unrecoverable. Do you wish to proceed?');
            if (proceed) {
                this._create(checklistIndex);
            } else {
                // do nothing
            }
            //alert('This functionality is incomplete. Coming soon!');
            //var car = this.options.store;
        } catch (e) {
            console.log('Exception in bwChecklistsEditor_Admin.js.displayChecklist(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor_Admin.js.displayChecklist(): ' + e.message + ', ' + e.stack);
        }
    },
    viewChecklist: function (bwChecklistTemplatesLibraryId) {
        try {
            console.log('In bwChecklistsEditor_Admin.js.viewChecklist(). bwChecklistTemplatesLibraryId: ' + bwChecklistTemplatesLibraryId);

            //alert('This functionality is incomplete. Coming soon!');

            this.renderChecklistsEditor1(bwChecklistTemplatesLibraryId);

            this.checkIfThereHaveBeenChangesToThisChecklist(bwChecklistTemplatesLibraryId);




        } catch (e) {
            console.log('Exception in bwChecklistsEditor_Admin.js.viewChecklist(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor_Admin.js.viewChecklist(): ' + e.message + ', ' + e.stack);
        }
    },
    deleteThisRow: function (elementId, checklistIndex) {
        try {
            console.log('In bwChecklistsEditor_Admin.js.deleteThisRow().');

            var row = elementId.split('_')[1];
            //alert('This functionality is incomplete. Coming soon! row: ' + row);

            this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow.splice(row, 1); //this.options.store.Workflow.Steps.Step[stepIndex].OnStart.Inform.splice(roleIndex, 1); // delete leaves a null, so we have to use splice.
            this.editChecklist(checklistIndex);
        } catch (e) {
            console.log('Exception in bwChecklistsEditor_Admin.js.deleteThisRow(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor_Admin.js.deleteThisRow(): ' + e.message + ', ' + e.stack);
        }
    },
    addRowBelow: function (elementId, checklistIndex) {
        try {
            console.log('In bwChecklistsEditor_Admin.js.addRowBelow().');

            //debugger;
            var row = Number(elementId.split('_')[1]) + 1;
            //var newrow = {
            //    ChecklistItem: { Question: 'What is the question?', YesText: '', NoText: '' }
            //};
            var newrow = {
                TitleSection: '<br />'
            };
            if (this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow) {
                this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow.splice(row, 0, newrow); // add the new row
            } else {
                this.options.store.DraftChecklists[checklistIndex]["ChecklistTemplateRow"] = [newrow];
            }
            this.editChecklist(checklistIndex); // render
        } catch (e) {
            console.log('Exception in bwChecklistsEditor_Admin.js.addRowBelow(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor_Admin.js.addRowBelow(): ' + e.message + ', ' + e.stack);
        }
    },
    moveRowUp: function (elementId, checklistIndex) {
        try {
            console.log('In bwChecklistsEditor_Admin.js.moveRowUp().');

            //debugger;
            var row = Number(elementId.split('_')[1]);
            var newRowIndex = row - 1;
            var rowJson;
            if (this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow[row].ChecklistItem) {
                rowJson = this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow[row];
                this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow.splice(row, 1); //  remove the row
                this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow.splice(newRowIndex, 0, rowJson); // add the new row
                this.editChecklist(checklistIndex); // render
            } else if (this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow[row].TitleSection) {
                rowJson = this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow[row];
                this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow.splice(row, 1); //  remove the row
                this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow.splice(newRowIndex, 0, rowJson); // add the new row
                this.editChecklist(checklistIndex); // render
            } else {
                console.log('Error in moveRowUp(). Unknown json in: ' + this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow[row]);
                alert('Unknown json in: ' + this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow[row]);
            }
        } catch (e) {
            console.log('Exception in bwChecklistsEditor_Admin.js.moveRowUp(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor_Admin.js.moveRowUp(): ' + e.message + ', ' + e.stack);
        }
    },
    moveRowDown: function (elementId, checklistIndex) {
        try {
            console.log('In bwChecklistsEditor_Admin.js.moveRowDown().');

            var row = Number(elementId.split('_')[1]);
            var newRowIndex = row + 1;
            var rowJson;
            if (this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow[row].ChecklistItem) {
                rowJson = this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow[row];
                this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow.splice(row, 1); //  remove the row
                this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow.splice(newRowIndex, 0, rowJson); // add the new row
                this.editChecklist(checklistIndex); // render
            } else if (this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow[row].TitleSection) {
                rowJson = this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow[row];
                this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow.splice(row, 1); //  remove the row
                this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow.splice(newRowIndex, 0, rowJson); // add the new row
                this.editChecklist(checklistIndex); // render
            } else {
                console.log('Error in moveRowDown(). Unknown json in: ' + this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow[row]);
                alert('Unknown json in: ' + this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow[row]);
            }
        } catch (e) {
            console.log('Exception in bwChecklistsEditor_Admin.js.moveRowDown(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor_Admin.js.moveRowDown(): ' + e.message + ', ' + e.stack);
        }
    },
    renderQuestionCell: function (checklistIndex, row, questionText) {
        try {
            console.log('In bwChecklistsEditor_Admin.js.renderQuestionCell().');

            var html = '';
            html += '    <table style="width:100%;border: 1px solid #d8d8d8;" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';
            html += '      <tr onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';
            html += '        <td style="text-align:left;color:darkgrey;" class="bwSliderTitleCell" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';

            html += '          <textarea id="strChecklistQuestion_' + row + '" onkeyup="$(\'.bwChecklistsEditor_Admin\').bwChecklistsEditor_Admin(\'editChecklist_OnKeyUp\', \'' + checklistIndex + '\', \'' + row + '\');" style="min-height: 5em;max-height: 50vh;width: 100%;color: #262626;font-size: 10pt;font-family:Verdana,Geneva,Tahoma,sans-serif;" type="text">' + questionText + '</textarea>';

            html += '        </td>';
            html += '        <td class="bwChartCalculatorLightCurrencyTableCell" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';
            html += '          <label for="configurationBehaviorRequireStartEndDatesSlider2"></label><input type="checkbox" name="configurationBehaviorRequireStartEndDatesSlider2" id="configurationBehaviorRequireStartEndDatesSlider2" />';
            html += '        </td>';
            html += '      </tr>';
            html += '    </table>';
            return html;
        } catch (e) {
            console.log('Exception in bwChecklistsEditor_Admin.js.renderQuestionCell(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor_Admin.js.renderQuestionCell(): ' + e.message + ', ' + e.stack);
        }
    },
    renderInstructionsCell: function (checklistIndex, row, instructionText) {
        try {
            console.log('In bwChecklistsEditor_Admin.js.renderInstructionsCell().');

            var html = '';
            html += '    <table style="width:100%;border: 1px solid #d8d8d8;" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';
            html += '      <tr onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';
            html += '         <td style="text-align:left;color:darkgrey;" class="bwSliderTitleCell" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';

            html += '           <textarea id="strChecklistInstructions_' + row + '" onkeyup="$(\'.bwChecklistsEditor_Admin\').bwChecklistsEditor_Admin(\'editChecklist_OnKeyUp\', \'' + checklistIndex + '\', \'' + row + '\');" style="min-height: 5em;max-height: 50vh;width: 100%;color: #262626;font-size: 10pt;font-family:Verdana,Geneva,Tahoma,sans-serif;" type="text">' + instructionText + '</textarea>';

            html += '         </td>';
            html += '      </tr>';
            html += '    </table>';
            return html;
        } catch (e) {
            console.log('Exception in bwChecklistsEditor_Admin.js.renderInstructionsCell(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor_Admin.js.renderInstructionsCell(): ' + e.message + ', ' + e.stack);
        }
    },
    renderBlankLineCell: function (checklistIndex, row) {
        try {
            console.log('In bwChecklistsEditor_Admin.js.renderBlankLineCell().');

            var html = '';
            //html += '<br />';
            html += '  <td id="rowChecklistContentCell_' + row + '" style="border: 1px solid #d8d8d8;" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';
            html += '  </td>';
            //html += '    <table style="width:100%;border: 1px solid #d8d8d8;" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';
            //html += '      <tr onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';
            //html += '         <td style="text-align:left;color:darkgrey;" class="bwSliderTitleCell" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';

            //html += '           <textarea id="strChecklistInstructions_' + row + '" onkeyup="$(\'.bwChecklistsEditor_Admin\').bwChecklistsEditor_Admin(\'editChecklist_OnKeyUp\', \'' + checklistIndex + '\', \'' + row + '\');" style="min-height: 5em;max-height: 50vh;width: 100%;color: #262626;font-size: 10pt;font-family:Verdana,Geneva,Tahoma,sans-serif;" type="text">' + instructionText + '</textarea>';

            //html += '         </td>';
            //html += '      </tr>';
            //html += '    </table>';
            return html;
        } catch (e) {
            console.log('Exception in bwChecklistsEditor_Admin.js.renderBlankLineCell(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor_Admin.js.renderBlankLineCell(): ' + e.message + ', ' + e.stack);
        }
    },
    selectRowType_OnChange: function (elementId, checklistIndex) {
        try {
            console.log('In selectRowType_OnChange(). elementId: ' + elementId + ', checklistIndex: ' + checklistIndex);
            alert('In selectRowType_OnChange(). elementId: ' + elementId + ', checklistIndex: ' + checklistIndex);

            var row = Number(elementId.split('_')[1]);
            var selectId = 'selectRowType_' + row;
            var rowType = document.getElementById(selectId).value; // Get the value of the drop down.
            var contentCell = document.getElementById('rowChecklistContentCell_' + row);
            console.log('In selectRowType_OnChange(). rowType: ' + rowType);
            var html = '';
            if (rowType == 'Question') {
                // Before we create the UI, we want to update the this.options.store.DraftChecklist[row] object. We are changing an existing row.
                // Check if there was text entered already if it was an 'Instructions' cell....
                var questionText = 'xWhat is the question?';
                if (this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow[row].TitleSection) {
                    if (this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow[row].TitleSection != '<br />') {
                        questionText = this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow[row].TitleSection;
                    }
                }
                var newrow = {
                    ChecklistItem: { Question: questionText }
                };
                this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow.splice(row, 0, newrow); // add the new row

                // Now we need to update the UI.
                contentCell.innerHTML = this.renderQuestionCell(checklistIndex, row, questionText); //html;

                var configurationBehaviorRequireStartEndDatesOptions3 = {
                    checked: false, //requireStartEndDates,
                    show_labels: true,         // Should we show the on and off labels?
                    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                    on_label: "YES",            // Text to be displayed when checked
                    off_label: "NO",          // Text to be displayed when unchecked
                    width: 50,                 // Width of the button in pixels
                    height: 22,                // Height of the button in pixels
                    button_width: 24,         // Width of the sliding part in pixels
                    clear_after: null         // Override the element after which the clearing div should be inserted
                };
                $("input#configurationBehaviorRequireStartEndDatesSlider3").switchButton(configurationBehaviorRequireStartEndDatesOptions3);

            } else if (rowType == 'Instructions') {
                // Before we create the UI, we want to update the this.options.store.DraftChecklist[row] object. We are changing an existing row.
                // Check if there was text entered already if it was a 'Question' cell....
                var instructionText = 'xWhat are the instructions?';
                if (this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow[row].ChecklistItem) {
                    if (this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow[row].ChecklistItem.Question.trim() != '') {
                        instructionText = this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow[row].ChecklistItem.Question;
                    }
                }
                var newrow = {
                    TitleSection: instructionText
                };
                this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow.splice(row, 0, newrow); // add the new row
                // Now we need to update the UI.
                //html += '    <table style="width:100%;border: 1px solid orange;">';
                //html += '      <tr>';
                //html += '         <td style="text-align:left;color:darkgrey;" class="bwSliderTitleCell">';
                //html += '           <textarea id="strChecklistInstructions_' + row + '" style="min-height: 5em;max-height: 50vh;width: 100%;color: #262626;font-size: 12pt;" type="text">' + instructionText + '</textarea>';
                //html += '         </td>';
                //html += '      </tr>';
                //html += '    </table>';
                //contentCell.innerHTML = html;
                contentCell.innerHTML = this.renderInstructionsCell(checklistIndex, row, instructionText);
            } else if (rowType == 'Blank line') {
                // Before we create the UI, we want to update the this.options.store.DraftChecklist[row] object. We are changing an existing row.
                var newrow = {
                    TitleSection: '<br />'
                };
                this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow.splice(row, 0, newrow); // add the new row
                // Now we need to update the UI.
                //html += '<br />';
                contentCell.innerHTML = this.renderBlankLineCell(checklistIndex, row); //html;
            } else {
                console.log('Error in selectRowType_OnChange(). Unexpected rowType: ' + rowType);
                alert('Error in selectRowType_OnChange(). Unexpected rowType: ' + rowType);
            }
        } catch (e) {
            console.log('Exception in bwChecklistsEditor_Admin.js.selectRowType_OnChange(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor_Admin.js.selectRowType_OnChange(): ' + e.message + ', ' + e.stack);
        }
    },
    selectChecklist_OnChange: function (mode, element) {
        try {
            console.log('In bwChecklistsEditor_Admin.js.selectChecklist_OnChange().');

            ////debugger;
            //var selectedValue = $(element).val(); //document.getElementById('selectChecklist').value;
            //var checklistIndex = null;
            //for (var i = 0; i < this.options.store.Checklists.length; i++) {
            //    if (selectedValue == this.options.store.Checklists[i].bwChecklistTemplatesId) {
            //        checklistIndex = i;
            //    }
            //}
            //if (checklistIndex != null) {
            //    var json = this.options.store.Checklists[i];
            //    if (mode == 'editing') {
            //        this.editChecklist(checklistIndex); // Render the checklist in edit mode.
            //    } else {
            //        this.element.html(this.renderChecklistsEditor(checklistIndex)); // Render the checklist in view mode.
            //    }
            //} else {
            //    console.log('In selectChecklist_OnChange(). Unexpected value for selectedValue: ' + selectedValue);
            //    alert('In selectChecklist_OnChange(). Unexpected value for selectedValue: ' + selectedValue);
            //}

            //var bwChecklistTemplatesLibraryId = $(element).val();
            var bwChecklistTemplatesLibraryId = $('#bwChecklistEditor_Admin_selectChecklist_' + this.options.elementIdSuffix).find('option:selected').val();

            if (bwChecklistTemplatesLibraryId) {
                var json;
                for (var i = 0; i < this.options.store.DraftChecklists.length; i++) {
                    if (bwChecklistTemplatesLibraryId && (bwChecklistTemplatesLibraryId == this.options.store.DraftChecklists[i].bwChecklistTemplatesLibraryId)) {
                        json = this.options.store.DraftChecklists[i];
                    } 
                }
                if (mode == 'editing') {
                    this.editChecklist(); // Render the checklist in edit mode.
                } else {
                    //this.element.html(this.renderChecklistsEditor(bwChecklistTemplatesLibraryId)); // Render the checklist in view mode.
                    this.viewChecklist(bwChecklistTemplatesLibraryId);
                }
            } else {
                console.log('In selectChecklist_OnChange(). Unexpected value for bwChecklistTemplatesLibraryId: ' + bwChecklistTemplatesLibraryId);
                alert('In selectChecklist_OnChange(). Unexpected value for bwChecklistTemplatesLibraryId: ' + bwChecklistTemplatesLibraryId);
            }

        } catch (e) {
            console.log('Exception in bwChecklistsEditor_Admin.js.selectChecklist_OnChange(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor_Admin.js.selectChecklist_OnChange(): ' + e.message + ', ' + e.stack);
        }
    },
    editChecklist_OnKeyUp: function (selectedChecklistIndex, rowIndex) {
        try {
            console.log('In bwChecklistsEditor_Admin.js.editChecklist_OnKeyUp(). selectedChecklistIndex: ' + selectedChecklistIndex + ', rowIndex: ' + rowIndex);

            // Save to the "draft/in progress" checklist json. Also known as the "waiting to be published" version.
            if (!this.options.store.Checklists) {
                // This should have happened already! 
                console.log('In editChecklist_OnKeyUp(). this.options.store.Checklists not populated.');
                alert('In editChecklist_OnKeyUp(). this.options.store.Checklists not populated.');
            } else {
                if (rowIndex == 'title') {
                    // The user is changing the title!
                    //debugger;
                    var title = document.getElementById('strChecklistTitle').value;
                    this.options.store.DraftChecklists[selectedChecklistIndex].Title = title;
                } else {
                    //var draftChecklist = this.options.store.DraftChecklists[checklistIndex]; // Get the row, and the control contents and type. Put it in the draft section here!
                    var rowType = document.getElementById('selectRowType_' + rowIndex).value.toLowerCase(); // Get the row type by getting the drop down selection
                    if (rowType == 'blank line') {
                        // do nothing
                    } else if (rowType == 'instructions') {
                        var x = document.getElementById('strChecklistInstructions_' + rowIndex).value;
                        this.options.store.DraftChecklists[selectedChecklistIndex].ChecklistTemplateRow[rowIndex].TitleSection = x; // = { TitleSection: x };
                    } else if (rowType == 'question') {
                        //debugger;
                        var x = document.getElementById('strChecklistQuestion_' + rowIndex).value;
                        this.options.store.DraftChecklists[selectedChecklistIndex].ChecklistTemplateRow[rowIndex].ChecklistItem.Question = x; // = { ChecklistItem: { Question: x, YesText: '', NoText: '' } };
                    } else {
                        alert('Unrecognized row type: ' + rowType);
                    }
                }
            }
        } catch (e) {
            console.log('Exception in bwChecklistsEditor_Admin.js.editChecklist_OnKeyUp(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor_Admin.js.editChecklist_OnKeyUp(): ' + e.message + ', ' + e.stack);
        }
    },
    downloadChecklistsJson: function () {
        try {
            console.log('In bwChecklistsEditor_Admin.js.downloadChecklistsJson().');

            // Display a dialog box with a big textarea so that the contents can be copied and pasted.
            //$("#divDisplayJsonDialog").dialog({
            //    modal: true,
            //    resizable: false,
            //    closeOnEscape: false, // Hit the ESC key to hide! Yeah!
            //    width: "760",
            //    dialogClass: "no-close", // No close button in the upper right corner.
            //    hide: false, // This means when hiding just disappear with no effects.
            //    open: function (event, ui) { $('.ui-widget-overlay').bind('click', function () { $("#divDisplayJsonDialog").dialog('close'); }); } // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.
            //});
            //$("#divDisplayJsonDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();





            // Display a dialog box with a big textarea so that the contents can be copied and pasted.
            var dialogId = 'divDownloadChecklistJsonDialog_' + this.options.elementIdSuffix;
            var div = document.getElementById(dialogId);
            if (!div) {
                div = document.createElement('div');
                div.id = dialogId;
                div.style.display = 'none';
                document.body.appendChild(div); // Place at end of document
            }

            var html = '';

            html += '  <table style="width:100%;">';
            html += '    <tr>';
            html += '      <td style="width:90%;">';
            html += '        <span id="divDownloadChecklistJsonDialog_spanDisplayJsonDialogTitle_' + this.options.elementIdSuffix + '" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">[divDownloadChecklistJsonDialog_spanDisplayJsonDialogTitle_' + this.options.elementIdSuffix + ']</span>';
            html += '      </td>';
            html += '      <td style="width:9%;"></td>';
            html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#' + dialogId + '\').dialog(\'close\');">X</span>';
            html += '      </td>';
            html += '    </tr>';
            html += '  </table>';
            html += '  <br /><br />';
            html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '  <span id="spanDisplayJsonDialogContent" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:20pt;">';
            html += 'Paste the checklist JSON here, change the checklist title if you wish, then click the "Save" button.';
            html += '</span>';
            html += '  <br />';
            html += '  <br />';
            // Copy to clipboard.
            //html += '<div class="tooltip">';
            //html += '   <button onclick="copyToClipboard(\'txtDisplayJsonDialogJSON\', \'spanDisplayJsonDialogCopyJsonTooltip\')" onmouseout="copyToClipboardMouseout(\'spanDisplayJsonDialogCopyJsonTooltip\')">';
            //html += '       <span class="tooltiptext" id="spanDisplayJsonDialogCopyJsonTooltip">Copy JSON to the clipboard</span>';
            //html += '       Copy'; // JSON...';
            //html += '   </button>';
            //html += '</div>';
            // end Copy to clipboard.
            html += '  <textarea id="divDownloadChecklistJsonDialog_txtDisplayJsonDialogJSON_' + this.options.elementIdSuffix + '" rows="30" cols="130" style="padding-top:4px;font-size:8pt;"></textarea>';
            //html += '  <pre id="txtDisplayJsonDialogJSON" style="overflow:auto;padding-top:4px;font-size:8pt;width:98%;height:300px;border:1px solid gainsboro;"></pre>';
            html += '  <br />';
            html += '  <br />';
            html += '  <div id="divSaveAsANewChecklist" class="divDialogButton" title="Click here to save this JSON as a new checklist..." onclick="$(\'.bwChecklistsEditor_Admin\').bwChecklistsEditor_Admin(\'updateChecklistInGlobalLibrary\');">';
            html += '   Save the Updated Checklist';
            html += '  </div>';
            html += '  <br /><br />';
            html += '  <div class="divDialogButton" onclick="$(\'#' + dialogId + '\').dialog(\'close\');">';
            html += '   Close';
            html += '  </div>';
            html += '  <br />';
            html += '  <br />';

            div.innerHTML = html;

            $('#' + dialogId).dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: "820",
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false,//, // This means when hiding just disappear with no effects.
                open: function (event, ui) { $('.ui-widget-overlay').bind('click', function () { $('#' + dialogId).dialog('close'); }); } // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.
            });
            //$('#' + dialogId).dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();






            var bwChecklistTemplatesLibraryId = $('#bwChecklistEditor_Admin_selectChecklist_' + this.options.elementIdSuffix).find('option:selected').val();

            if (!bwChecklistTemplatesLibraryId) {

                alert('In downloadChecklistsJson(). Unexpected value for bwChecklistTemplatesLibraryId: ' + bwChecklistTemplatesLibraryId);

                var json = this.options.store.DraftChecklists;
                document.getElementById('divDownloadChecklistJsonDialog_spanDisplayJsonDialogTitle_' + this.options.elementIdSuffix).innerHTML = 'Checklist JSON';
                $('#divDownloadChecklistJsonDialog_txtDisplayJsonDialogJSON_' + this.options.elementIdSuffix).empty();
                $('#divDownloadChecklistJsonDialog_txtDisplayJsonDialogJSON_' + this.options.elementIdSuffix).append(JSON.stringify(json, null, 2));

            } else {

                for (var i = 0; i < this.options.store.DraftChecklists.length; i++) {
                    if (bwChecklistTemplatesLibraryId == this.options.store.DraftChecklists[i].bwChecklistTemplatesLibraryId) {

                        //var json = this.options.store.Checklists;
                        debugger;
                        //var json = JSON.parse(this.options.store.DraftChecklists[i].ChecklistJson);
                        var json = this.options.store.DraftChecklists[i];
                        document.getElementById('divDownloadChecklistJsonDialog_spanDisplayJsonDialogTitle_' + this.options.elementIdSuffix).innerHTML = 'Checklist JSON';
                        $('#divDownloadChecklistJsonDialog_txtDisplayJsonDialogJSON_' + this.options.elementIdSuffix).empty();
                        $('#divDownloadChecklistJsonDialog_txtDisplayJsonDialogJSON_' + this.options.elementIdSuffix).append(JSON.stringify(json, null, 2));
                        break;
                    }
                }

            }

        } catch (e) {
            console.log('Exception in bwChecklistsEditor_Admin.js.downloadChecklistsJson(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor_Admin.js.downloadChecklistsJson(): ' + e.message + ', ' + e.stack);
        }
    },
    setZoom: function (originalZoom, elementId) {
        try {
            //console.log('In setZoom(' + originalZoom + ', ' + elementId + ')');
            var thiz = this;

            if (originalZoom > 20) { // Don't make any smaller than this!
                var zoom = originalZoom / 100;

                if (window.opener) {
                    // This is a popped-out request wndow... we need to handle zoom differently here.

                    console.log('In setZoom(). This is a popped-out request wndow... we need to handle zoom differently here. originalZoom: ' + originalZoom + ', elementId: ' + elementId);
                    var el = document.body; //.getElementById(elementId);

                    transformOrigin = [0, 0];

                    var p = ["webkit", "moz", "ms", "o"],
                        s = "scale(" + zoom + ")",
                        oString = (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%";

                    for (var i = 0; i < p.length; i++) {
                        el.style[p[i] + "Transform"] = s;
                        el.style[p[i] + "TransformOrigin"] = oString;
                    }

                    el.style["transform"] = s;
                    el.style["transformOrigin"] = oString;

                    // Now get the bounding rect, and resize the entire window...
                    var rectElement = $('#budgetrequestform').find('.xdFormLayout')[0];
                    if (rectElement) {
                        var rect = rectElement.getBoundingClientRect();

                        var height = rect.bottom - rect.top;
                        var width = rect.right - rect.left;

                        window.resizeTo(width, height);

                        console.log('In setZoom(' + originalZoom + ', ' + elementId + '). window.resizeTo width: ' + width + ', height: ' + height);
                    }

                } else {
                    console.log('In setZoom(' + originalZoom + ', ' + elementId + ')');

                    elementId = elementId.replace('_Parent', '');
                    elementId += '_Parent'; // This just makes sure it is here! :)
                    var el = document.getElementById(elementId);

                    transformOrigin = [0, 0];

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
                }

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
            displayAlertDialog('Exception in setZoom(): ' + e.message + ', ' + e.stack);
        }
    },
    pinRequestDialog: function () {
        try {
            console.log('In bwChecklistsEditor_Admin.js.pinRequestDialog().');
            // This makes the dialog non-modal, so that it can be dragged around and the underlying functionality accessible. This removes the overlay that makes the dialog modal, and also removes the click event which would have originally closed the request dialog.
            // The idea is to be able to have multiple requests open at once!
            $('.ui-widget-overlay').unbind('click');
            $(".ui-widget-overlay").remove();

            console.log('In bwChecklistsEditor_Admin.js.pinRequestDialog(). Scrolling window to top. This is experimental.');
            $(window).scrollTop(0);

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
            console.log('Exception in bwChecklistsEditor_Admin.js.pinRequestDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor_Admin.js.pinRequestDialog(): ' + e.message + ', ' + e.stack);
        }
    }

});