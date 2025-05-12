$.widget("bw.bwChecklistsEditor", {
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
        This is the bwChecklistsEditor.js jQuery Widget. 
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
        this.element.addClass("bwChecklistsEditor");

        try { // Using this table: BwChecklistTemplates
            console.log('In bwChecklistsEditor.js._create().');
            var thiz = this;

            if (this.options.operationUriPrefix == null) {
                // This formulates the operationUri, which is used throughout.
                var url1 = window.location.href.split('https://')[1];
                var url2 = url1.split('/')[0];
                this.options.operationUriPrefix = 'https://' + url2 + '/';
            }

            var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            this.options.elementIdSuffix = guid;

            if (this.options.DisplayAsNewTenantUserConfigurationEditor == true) {
                //
                // This is when it is displayed on the administration pages.
                //

                // First load the NewTenantSettings from the database.
                $.ajax({
                    url: thiz.options.operationUriPrefix + "_bw/NewTenantChecklistsSettings", //"_bw/NewTenantFormsSettings", //"_bw/NewTenantWorkflowsSettings", // "_bw/NewTenantOrganizationSettings",
                    dataType: "json",
                    contentType: "application/json",
                    type: "Get"
                }).done(function (result) {
                    try {
                        if (result.message != 'SUCCESS') {
                            alert('ERROR: ' + result.message);
                        } else {
                            debugger; // GET THIS CODE WORKING FOR CHECKLISTS!!!!!!!!!!<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 5-27-2020.

                            var html = result.value[0].bwFormHtml;

                            thiz.options.CurrentForm.Form = html;
                            thiz.options.CurrentForm.DraftForm = html;

                            thiz.renderFormsEditor(); // Render the forms editor.

                            ////thiz.options.store = {
                            ////    Global: JSON.parse(result.bwOrgRolesJson)
                            ////};
                            //thiz.options.Workflows = result.bwWorkflows; //JSON.parse(result.bwOrgRolesJson);
                            //thiz.options.CurrentWorkflow = result.bwWorkflows[0];

                            ////thiz.element.html(thiz.renderOrgRolesEditor2()); // Render the org chart.
                            //thiz.element.html(thiz.renderWorkflowEditor1(assignmentRowChanged_ElementId)); // Render the Workflow Editor. 

                        }
                    } catch (e) {
                        //lpSpinner.Hide();
                        console.log('Exception in bwChecklistsEditor._create().Get.NewTenantChecklistsSettings.done(): ' + e.message + ', ' + e.stack);
                    }
                }).fail(function (data) {
                    //lpSpinner.Hide();
                    //debugger;
                    //console.log('In xx.fail(): ' + JSON.stringify(data));
                    var msg;
                    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                    } else {
                        msg = JSON.stringify(data);
                    }
                    alert('Error in bwChecklistsEditor._create().Get.NewTenantChecklistsSettings.fail(): ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                    console.log('Error in bwChecklistsEditor._create().Get.NewTenantChecklistsSettings.fail ' + JSON.stringify(data));
                    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                    //var error = JSON.parse(data.responseText)["odata.error"];
                    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                });

            } else {

                this.loadChecklists();
                //this.renderChecklistsEditor1();

            }
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
            console.log('In bwChecklistsEditor.js._update(). This does nothing! (yet)');
        } catch (e) {
            console.log('Exception in bwChecklistsEditor.js._update(): ' + e.message + ', ' + e.stack);
        }
    },
    _destroy: function () {
        this.element
            .removeClass("bwWorkflowEditor")
            .text("");
    },
    loadChecklists: function () {
        try {
            console.log('In bwChecklistsEditor.js.loadChecklists().');
            //alert('In bwChecklistsEditor.js.loadChecklists().');
            var thiz = this;

            this.element.html(''); // Completely re-do the display here. This solves an issue with the select drop-down element.

            this.options.store = {
                Checklists: [],
                DraftChecklists: []
            };


            //if (this.options.store.Checklists.length > 0) {

            //    // this.options.store is populated, so just render the checklists editor.
            //    var html = this.renderChecklistsEditor(checklistIndex); // We pass checklistIndex so we know which checklist to display from the json.
            //    this.element.html(html); // Render the checklists editor.

            //} else {

            // Check the database to see if we have any checklists saved there yet.
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            //alert('xcx123124 activeStateIdentifier: ' + activeStateIdentifier);

            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                bwWorkflowAppId: workflowAppId,
                isActive: true
            };
            $.ajax({
                url: this.options.operationUriPrefix + "_bw/checklistsconfiguration", // bwChecklistTemplatesLibraryId << get rid of this and replace with this >>>> bwChecklistTemplatesId
                type: "POST",
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (ccResult) {
                    try {

                        //alert('xcx213123 ccResult: ' + JSON.stringify(ccResult));

                        if (ccResult.status == 'NO_CHECKLISTS_EXIST_FOR_THIS_ORGANIZATION') {

                            thiz.renderChecklistsEditor1();

                            var html = '';

                            html += '<br /><br />';
                            html += 'No checklist(s) have been assigned to this organization. Click the "Get a Checklist" button to add the first one.';

                            $('#bwChecklistsEditor_ChecklistContent_' + thiz.options.elementIdSuffix).html(html);

                        } else if (ccResult.status == 'SUCCESS') {
                            // We got results from the database.
                            //thiz.options.store = { Checklists: [], DraftChecklists: [] }; // This is where the object is defined!!!
                            //for (var i = 0; i < result.Checklists.length; i++) {
                            //    //var json = JSON.parse(result.Checklists[i].ChecklistJson);
                            //    thiz.options.store.Checklists.push(JSON.parse(result.Checklists[i].ChecklistJson));
                            //    thiz.options.store.DraftChecklists.push(JSON.parse(result.Checklists[i].ChecklistJson)); // If they don't match, we know to tell the user that they have made changes.
                            //}


                            for (var i = 0; i < ccResult.Checklists.length; i++) {
                                //var json = JSON.parse(result.Checklists[i].ChecklistJson);
                                thiz.options.store.DraftChecklists.push(JSON.parse(ccResult.Checklists[i].ChecklistJson));
                                //thiz.options.store.DraftChecklists.push(JSON.parse(result.Checklists[i].ChecklistJson)); // If they don't match, we know to tell the user that they have made changes.
                            }
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

                            //} else if (ccResult.message == 'No checklists exist in the database') {


                            //    if (!ccResult.Checklists || (ccResult.Checklists.length == 0)) {
                            //        displayAlertDialog('No checklist(s) have been assigned to this organization.');
                            //    }










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

                            ////debugger;
                            //thiz.options.store = { Checklists: [], DraftChecklists: [] };
                            //thiz.options.store.Checklists.push(json);
                            //thiz.options.store.DraftChecklists.push(json);

                            //var bwChecklistTemplatesId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                            //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                            //    return v.toString(16);
                            //});
                            //var json2 = {
                            //    bwChecklistTemplatesId: bwChecklistTemplatesId,
                            //    bwTenantId: tenantId,
                            //    bwWorkflowAppId: workflowAppId,
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
                            //thiz.options.store.Checklists.push(json2);
                            //thiz.options.store.DraftChecklists.push(json2);

                            //var bwChecklistTemplatesId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                            //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                            //    return v.toString(16);
                            //});
                            //var json3 = {
                            //    bwChecklistTemplatesId: bwChecklistTemplatesId,
                            //    bwTenantId: tenantId,
                            //    bwWorkflowAppId: workflowAppId,
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
                            //thiz.options.store.Checklists.push(json3);
                            //thiz.options.store.DraftChecklists.push(json3);






                            // SAVE THESE TO THE database. >>>> REMOVING THE SAVE 9-28-2022
                            //var json = {
                            //    Checklists: JSON.stringify(thiz.options.store.Checklists)
                            //};
                            //$.ajax({
                            //    url: thiz.options.operationUriPrefix + "odata/Checklists", // Saves all checklists.
                            //    type: "POST",
                            //    data: json,
                            //    headers: {
                            //        "Accept": "application/json; odata=verbose"
                            //    }
                            //}).success(function (result) {
                            //    try {

                            //thiz.renderChecklistsEditor();

                            //    } catch (e) {
                            //        console.log('Exception in bwChecklistsEditor.js._create().xx.update: ' + e.message + ', ' + e.stack);
                            //        alert('Exception in bwChecklistsEditor.js._create().xx.update: ' + e.message + ', ' + e.stack);
                            //    }
                            //}).error(function (data, errorCode, errorMessage) {

                            //    //var msg;
                            //    //if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                            //    //    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                            //    //} else {
                            //    //    msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
                            //    //}
                            //    var msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
                            //    console.log('Error in bwChecklistsEditor.js._create()./odata/Checklists: ' + msg);
                            //    displayAlertDialog('Error in bwChecklistsEditor.js._create()./odata/Checklists: ' + msg); //+ error.message.value + ' ' + error.innererror.message);

                            //});

                        } else {

                            console.log('Error in bwChecklistsEditor.js._create(). Unexpected response from the server when looking for checklists: ' + JSON.stringify(ccResult));
                            displayAlertDialog('Error in bwChecklistsEditor.js._create(). Unexpected response from the server when looking for checklists: ' + JSON.stringify(ccResult));

                        }

                    } catch (e) {
                        console.log('Exception in bwChecklistsEditor.js._create(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwChecklistsEditor.js._create(): ' + e.message + ', ' + e.stack);
                    }
                }, error: function (data) {

                    var msg = 'Error in bwChecklistsEditor.js._create()./odata/Checklist/: ' + JSON.stringify(data);
                    console.log(msg);
                    displayAlertDialog(msg);

                    //if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                    //    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                    //} else {
                    //    msg = JSON.stringify(data);
                    //}
                    //alert('Exception in bwChecklistsEditor.Checklist()._create.Get:2: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                    //console.log('Exception in bwChecklistsEditor.Checklist()._create.Get:2: ' + JSON.stringify(data));

                }
            });

        } catch (e) {
            console.log('Exception in bwChecklistsEditor.js.loadChecklists(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor.js.loadChecklists(): ' + e.message + ', ' + e.stack);
        }
    },
    renderChecklistsEditor1: function () {
        try {
            console.log('In renderChecklistsEditor1().');
            //alert('In renderChecklistsEditor1().');
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
            html += '               <span style="color:black;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 35pt;font-weight:bold;">Configure the Checklists&nbsp;&nbsp;&nbsp;';

            html += '               <span id="spanChecklistsEditorEllipsesButton" class="spanButton context-menu-checklistseditor" id="xcx" style="height:20px;width:150px;"> ... </span>';
            html += '           </span>'; // Velvet Morning is #95b1d3. This was the pantone color of the day for December 9, 2019! :D
            //html += '           </h2>';
            html += '       </td>';
            html += '       <td style="text-align:right;">';
            //html += '           <span class="printButton" title="print" onclick="cmdPrintForm();">&#x1f5a8;</span>';
            html += '       </td>';
            html += '   </tr>';
            html += '</table>';






            var checklistIndex = null; // GET RID OF THIS VARIABLE EVENTUALLY


            html += '<br />';
            html += 'Checklist: ';
            html += '<select style="padding:5px 5px 5px 5px;" id="bwChecklistEditor_selectChecklist_' + this.options.elementIdSuffix + '" onchange="$(\'.bwChecklistsEditor\').bwChecklistsEditor(\'selectChecklist_OnChange\', \'viewing\');">';
            for (var i = 0; i < this.options.store.DraftChecklists.length; i++) {

                console.log('verify that this.options.store.DraftChecklists[i].bwChecklistTemplatesId is there. this.options.store.DraftChecklists[i]: ' + JSON.stringify(this.options.store.DraftChecklists[i]));

                //if (bwChecklistTemplatesId == this.options.store.DraftChecklists[i].bwChecklistTemplatesId) {
                //    html += '<option value="' + this.options.store.DraftChecklists[i].bwChecklistTemplatesId + '" selected>' + this.options.store.DraftChecklists[i].Title + '</option>';
                //} else {
                html += '<option value="' + this.options.store.DraftChecklists[i].bwChecklistTemplatesId + '">' + this.options.store.DraftChecklists[i].Title + '</option>';
                //}
            }
            html += '</select>';

            html += '<span id="bwChecklistEditor_spanButtons_' +  this.options.elementIdSuffix + '">';
            html += '&nbsp;&nbsp;';
            html += '<input class="buttonAddNewAssignmentRow" style="padding:5px 10px 5px 10px;" onclick="$(\'.bwChecklistsEditor\').bwChecklistsEditor(\'editChecklist\', \'' + checklistIndex + '\');" type="button" value="Edit">';
            html += '&nbsp;&nbsp;';
            html += '<input class="buttonAddNewAssignmentRow" style="padding:5px 10px 5px 10px;" onclick="$(\'.bwChecklistsEditor\').bwChecklistsEditor(\'deleteChecklist\', \'' + checklistIndex + '\');" type="button" value="Delete">';
            html += '&nbsp;&nbsp;';
            html += '<input class="buttonAddNewAssignmentRow" style="padding:5px 10px 5px 10px;" onclick="$(\'.bwChecklistsEditor\').bwChecklistsEditor(\'createNewChecklist\', \'\');" type="button" value="+ Create a Checklist">';
            html += '&nbsp;&nbsp;';
            html += '<input class="buttonAddNewAssignmentRow" style="padding:5px 10px 5px 10px;" onclick="$(\'.bwChecklistsEditor\').bwChecklistsEditor(\'getChecklistFromGlobalChecklistLibrary\', \'\');" type="button" value="+ Get a Checklist">';
            html += '</span>';

            html += '<br />';
            html += '<br />';

            html += '<div id="bwChecklistsEditor_ChecklistContent_' + this.options.elementIdSuffix + '"></div>';

            this.element.html(html); // Render the checklists editor.


            this.selectChecklist_OnChange('viewing');



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
    renderChecklistsEditor2: function (bwChecklistTemplatesId) {
        try {
            console.log('In bwChecklistsEditor.js.renderChecklistsEditor(). bwChecklistTemplatesId: ' + bwChecklistTemplatesId);
            //alert('In bwChecklistsEditor.js.renderChecklistsEditor(). bwChecklistTemplatesId: ' + bwChecklistTemplatesId);
            var thiz = this;

            var workflowAppTitle = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTitle');

            //var bwChecklistTemplatesId = $('#bwChecklistEditor_selectChecklist_' + this.options.elementIdSuffix).find('option:selected').val();

            //if (checklistIndex) {
            //    // do nothing
            //} else {
            //    if (this.options.checklistIndex) {
            //        checklistIndex = this.options.checklistIndex;
            //    } else {
            //        checklistIndex = 0; // default is 0
            //    }
            //}
            //if (document.getElementById('selectChecklist')) {
            //    var selectedValue = document.getElementById('selectChecklist').value;
            var checklist, checklistIndex;
            for (var i = 0; i < this.options.store.DraftChecklists.length; i++) {
                if (bwChecklistTemplatesId == this.options.store.DraftChecklists[i].bwChecklistTemplatesId) {
                    checklist = this.options.store.DraftChecklists[i];
                    checklistIndex = i;
                    break;
                }
            }
            //}

            var html = '';

            if (checklist) {
                html += '&nbsp;&nbsp;';
                html += '<input class="buttonAddNewAssignmentRow" style="padding:5px 10px 5px 10px;" onclick="$(\'.bwChecklistsEditor\').bwChecklistsEditor(\'editChecklist\', \'' + checklistIndex + '\');" type="button" value="Edit">';
                html += '&nbsp;&nbsp;';
                html += '<input class="buttonAddNewAssignmentRow" style="padding:5px 10px 5px 10px;" onclick="$(\'.bwChecklistsEditor\').bwChecklistsEditor(\'deleteChecklist\', \'' + checklistIndex + '\');" type="button" value="Delete">';
            }
            html += '&nbsp;&nbsp;';
            html += '<input class="buttonAddNewAssignmentRow" style="padding:5px 10px 5px 10px;" onclick="$(\'.bwChecklistsEditor\').bwChecklistsEditor(\'createNewChecklist\', \'\');" type="button" value="+ Create a Checklist">';
            html += '&nbsp;&nbsp;';
            html += '<input class="buttonAddNewAssignmentRow" style="padding:5px 10px 5px 10px;" onclick="$(\'.bwChecklistsEditor\').bwChecklistsEditor(\'getChecklistFromGlobalChecklistLibrary\', \'\');" type="button" value="+ Get a Checklist">';

            $('#bwChecklistEditor_spanButtons_' + this.options.elementIdSuffix).html(html);






            //var thereHaveBeenChangesToThisChecklist = false;
            //var oldJsonString = JSON.stringify(this.options.store.Checklists[checklistIndex]);
            //var newJsonString = JSON.stringify(this.options.store.DraftChecklists[checklistIndex]);
            //if (oldJsonString != newJsonString) {
            //    thereHaveBeenChangesToThisChecklist = true;
            //}

            //console.log('***');
            //console.log('Checking thereHaveBeenChangesToThisChecklist xcx333854 thereHaveBeenChangesToThisChecklist: ' + thereHaveBeenChangesToThisChecklist);
            //console.log('***');

            //if (thereHaveBeenChangesToThisChecklist) {
            //    //console.log('In renderChecklistsEditor(). The user has made changes which have not been saved.');
            //    html += '<span style="font-style:italic;color:tomato;">You have changes that won\'t be available until you publish: </span>';
            //    html += '<input class="buttonAddNewAssignmentRow" type="button" value="Publish" style="padding:7px 10px 7px 10px;" onclick="$(\'.bwChecklistsEditor\').bwChecklistsEditor(\'publishChecklist\', \'' + checklistIndex + '\');">';
            //    html += '&nbsp;<input class="buttonAddNewAssignmentRow" type="button" value="Cancel Changes" style="padding:7px 10px 7px 10px;" onclick="$(\'.bwChecklistsEditor\').bwChecklistsEditor(\'cancelChangesInDraftChecklistConfiguration\');" />';

            //} else {
            //    // Do nothing because the user has made no changes to the checklist.
            //    //console.log('In renderChecklistsEditor(). THE USER HAS MADE NO CHANGES TO THE CHECKLIST.');
            //}



            if (checklist) {


                html += '<br />';
                html += '<br />';

                // Render the json.
                html += '<table class="xdFormLayout" style="width:100%;BORDER-TOP: #d8d8d8 1pt solid; BORDER-RIGHT: #d8d8d8 1pt solid; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 0px; PADDING-TOP: 0px; PADDING-LEFT: 15px; BORDER-LEFT: #d8d8d8 1pt solid; PADDING-RIGHT: 0px">';
                html += '<tr>';
                html += '<td>';
                //debugger;

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
                        alert('Unrecognized json attribute: ' + checklist.ChecklistTemplateRow[i]);
                    }
                    html += '</tr>';
                    html += '</table>';
                }
                html += '</td>';
                html += '</tr>';
                html += '</table>';
            }


            //this.element.html(html); // Render the checklists editor.
            $('#bwChecklistsEditor_ChecklistContent_' + this.options.elementIdSuffix).html(html);

            this.checkIfThereHaveBeenChangesToThisChecklist(bwChecklistTemplatesId);

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
            console.log('Exception in bwChecklistsEditor.js.renderChecklistsEditor: ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor.js.renderChecklistsEditor: ' + e.message + ', ' + e.stack);
            alert('Exception in bwChecklistsEditor.js.renderChecklistsEditor: ' + e.message + ', ' + e.stack);
        }
    },
    checkIfThereHaveBeenChangesToThisChecklist: function (bwChecklistTemplatesId) {
        try {
            console.log('In bwChecklistsEditor.js.checkIfThereHaveBeenChangesToThisChecklist(). bwChecklistTemplatesId: ' + bwChecklistTemplatesId);
            //alert('In bwChecklistsEditor.js.checkIfThereHaveBeenChangesToThisChecklist(). bwChecklistTemplatesLibraryId: ' + bwChecklistTemplatesLibraryId);
            var thiz = this;

            var workflowAppTitle = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTitle');

            if (!bwChecklistTemplatesId) {

                console.log('In checkIfThereHaveBeenChangesToThisChecklist(). Unexpected value for bwChecklistTemplatesId: ' + bwChecklistTemplatesId);
                //bwChecklistTemplatesLibraryId = $('#bwChecklistEditor_Admin_selectChecklist_' + this.options.elementIdSuffix).find('option:selected').val();

            }

            //alert('In renderChecklistsEditor(). bwChecklistTemplatesLibraryId: ' + bwChecklistTemplatesLibraryId);
            var thereHaveBeenChangesToThisChecklist = false;
            var checklist;
            for (var i = 0; i < this.options.store.DraftChecklists.length; i++) {
                if (bwChecklistTemplatesId == this.options.store.DraftChecklists[i].bwChecklistTemplatesId) {

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
                html += '<input class="buttonAddNewAssignmentRow" type="button" value="Publish" style="padding:7px 10px 7px 10px;" onclick="$(\'.bwChecklistsEditor\').bwChecklistsEditor(\'publishChecklist\', \'' + bwChecklistTemplatesId + '\');">';
                html += '&nbsp;<input class="buttonAddNewAssignmentRow" type="button" value="Cancel Changes" style="padding:7px 10px 7px 10px;" onclick="$(\'.bwChecklistsEditor\').bwChecklistsEditor(\'cancelChangesInDraftChecklistConfiguration\');" />';
                //html += '&nbsp;<input class="buttonAddNewAssignmentRow" type="button" value="Cancel Changes" style="padding:7px 10px 7px 10px;" onclick="$(\'.bwChecklistsEditor\').bwChecklistsEditor(\'cancelChangesInDraftChecklistConfiguration\');" />';
                html += '&nbsp;<input class="buttonAddNewAssignmentRow" style="padding:5px 10px 5px 10px;" onclick="$(\'.bwChecklistsEditor\').bwChecklistsEditor(\'downloadChecklistsJson\', \'\');" type="button" value="View Checklist JSON">';

            } else {
                // Do nothing because the user has made no changes to the checklist.
                //console.log('In renderChecklistsEditor(). THE USER HAS MADE NO CHANGES TO THE CHECKLIST.');
            }




            if (checklist) {

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

            }







            //this.element.append(html); // Render the checklists editor.
            $('#bwChecklistsEditor_ChecklistContent_' + this.options.elementIdSuffix).html(html);

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
            console.log('Exception in bwChecklistsEditor.js.checkIfThereHaveBeenChangesToThisChecklist: ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor.js.checkIfThereHaveBeenChangesToThisChecklist: ' + e.message + ', ' + e.stack);
            alert('Exception in bwChecklistsEditor.js.checkIfThereHaveBeenChangesToThisChecklist: ' + e.message + ', ' + e.stack);
        }
    },
    createNewChecklist: function () {
        try {
            console.log('In createNewChecklist().');
            // This is where a user goes to add a new checklist.

            var bwChecklistTemplatesId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            var newChecklist = {
                bwChecklistTemplatesId: bwChecklistTemplatesId,
                bwTenantId: tenantId,
                bwWorkflowAppId: workflowAppId,
                Title: 'New Checklist 1',
                HoverOver: 'xx',
                ChecklistTemplateRow: []
            };
            var checklistIndex = this.options.store.Checklists.length;
            this.options.store.Checklists[checklistIndex] = JSON.parse(JSON.stringify(newChecklist)); // This initializes the json while also ensuring the checklist content is empty, so that we can determine if the new checklist needs to be published.
            this.options.store.DraftChecklists[checklistIndex] = JSON.parse(JSON.stringify(newChecklist));
            // Now put some rudimentary stuff in the new checklist to help the user get started...
            this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow.push({ TitleSection: 'Select Yes for all items that apply to this request. Comments and Completion Date are required for all items marked as Yes...' });
            this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow.push({ TitleSection: '<br />' });
            this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow.push({ TitleSection: '<br />' });
            this.editChecklist(checklistIndex);
        } catch (e) {
            console.log('Exception in bwChecklistsEditor.js.createNewChecklist(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor.js.createNewChecklist(): ' + e.message + ', ' + e.stack);
        }
    },
    getChecklistFromGlobalChecklistLibrary: function () {
        try {
            console.log('In getChecklistFromGlobalChecklistLibrary().'); // This is where a user goes to get a new checklist. We will hve a whole bunch of them in here.
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




                    var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                    var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                    var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');
                    var data = {
                        bwParticipantId_LoggedIn: participantId,
                        bwActiveStateIdentifier: activeStateIdentifier,
                        bwWorkflowAppId_LoggedIn: workflowAppId,

                        isActive: true
                    };
                    $.ajax({
                        url: thiz.options.operationUriPrefix + "_bw/checklistsgloballibrarycontents",
                        type: "POST",
                        data: data,
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        },
                        success: function (ccResult) {
                            try {
                                //alert('xcx213123 ccResult: ' + JSON.stringify(ccResult));
                                if (ccResult.status == 'NO_CHECKLISTS_EXIST') {

                                    //alert('In bwChecklistsEditor.js.getChecklist(). No checklists found in the global checklists library.');
                                    html += '   <tr class="xdTableOffsetRow2">';
                                    html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
                                    html += '           <span class="xdlabel" style="color:gray;font-size:12pt;">';
                                    //html += '               <input type="button" style="padding:5px 10px 5px 10px;cursor:pointer;" onclick="$(\'.bwChecklistsEditor\').bwChecklistsEditor(\'addChecklist\', \'0\');" value="Add checklist" />';
                                    html += '           </span>';
                                    html += '       </td>';
                                    html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
                                    html += '           <span style="color:tomato;">No checklists found in the global checklists library.</span>';
                                    html += '       </td>';
                                    html += '   </tr>';

                                } else if (ccResult.status == 'SUCCESS') {

                                    for (var i = 0; i < ccResult.Checklists.length; i++) {
                                        html += '   <tr class="xdTableOffsetRow2">';
                                        html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
                                        html += '           <span class="xdlabel" style="color:gray;font-size:12pt;">';
                                        html += '               <input type="button" style="padding:5px 10px 5px 10px;cursor:pointer;" onclick="$(\'.bwChecklistsEditor\').bwChecklistsEditor(\'addChecklistFromGlobalLibrary\', \'' + ccResult.Checklists[i].bwChecklistTemplatesLibraryId + '\');" value="Add checklist" />';
                                        html += '           </span>';
                                        html += '       </td>';
                                        html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
                                        html += '           <span>' + ccResult.Checklists[i].Title + '</span>';
                                        html += '       </td>';
                                        html += '   </tr>';
                                    }

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

                                } else {

                                    console.log('Error in bwChecklistsEditor.js.getChecklistFromGlobalChecklistLibrary(). Unexpected response from the server when looking for checklists: ' + JSON.stringify(ccResult));
                                    displayAlertDialog('Error in bwChecklistsEditor.js.getChecklistFromGlobalChecklistLibrary(). Unexpected response from the server when looking for checklists: ' + JSON.stringify(ccResult));

                                }

                            } catch (e) {
                                console.log('Exception in bwChecklistsEditor.js.getChecklistFromGlobalChecklistLibrary(): ' + e.message + ', ' + e.stack);
                                displayAlertDialog('Exception in bwChecklistsEditor.js.getChecklistFromGlobalChecklistLibrary(): ' + e.message + ', ' + e.stack);
                            }
                        }, error: function (data) {

                            var msg = 'Error in bwChecklistsEditor.js.getChecklistFromGlobalChecklistLibrary()./odata/Checklist/: ' + JSON.stringify(data);
                            console.log(msg);
                            displayAlertDialog(msg);

                        }
                    });

                }
            });

        } catch (e) {
            console.log('Exception in bwChecklistsEditor.js.getChecklistFromGlobalChecklistLibrary(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor.js.getChecklistFromGlobalChecklistLibrary(): ' + e.message + ', ' + e.stack);
        }
    },
    addChecklistFromGlobalLibrary: function (bwChecklistTemplatesLibraryId) {
        try {
            console.log('In bwChecklistsEditor.js.addChecklistFromGlobalLibrary().');
            var thiz = this;

            // Add this checklist to the organization, from the global checklist library.
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');
            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                bwWorkflowAppId: workflowAppId,
                bwChecklistTemplatesLibraryId: bwChecklistTemplatesLibraryId
            };
            $.ajax({
                url: this.options.operationUriPrefix + "_bw/addchecklisttothisorganizationfromtheglobalchecklistlibrary",
                type: "POST",
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (ccResult) {
                    try {

                        if (ccResult.status != 'SUCCESS') {

                            alert('Error in addChecklistFromGlobalLibrary(). ' + ccResult.status + ', ' + ccResult.message);

                        } else {

                            alert('SUCCESS ccResult: ' + JSON.stringify(ccResult));

                           
                            thiz.loadChecklists();

                        }

                    } catch (e) {
                        console.log('Exception in bwChecklistsEditor.js.addChecklistFromGlobalLibrary.success(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwChecklistsEditor.js.addChecklistFromGlobalLibrary.success(): ' + e.message + ', ' + e.stack);
                    }
                }, error: function (data) {

                    var msg = 'Error in bwChecklistsEditor.js.addChecklistFromGlobalLibrary.error(): ' + JSON.stringify(data);
                    console.log(msg);
                    displayAlertDialog(msg);

                }
            });

        } catch (e) {
            console.log('Exception in bwChecklistsEditor.js.addChecklistFromGlobalLibrary(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor.js.addChecklistFromGlobalLibrary(): ' + e.message + ', ' + e.stack);
        }
    },
    editChecklist: function () {
        try {
            console.log('In editChecklist().');
            //alert('In editChecklist().');

            var car = {};
            //if (!bwChecklistTemplatesLibraryId) {

            //    alert('In editChecklist(). Unexpected value for bwChecklistTemplatesLibraryId: ' + bwChecklistTemplatesLibraryId);
            var bwChecklistTemplatesId = $('#bwChecklistEditor_selectChecklist_' + this.options.elementIdSuffix).find('option:selected').val();

            console.log('In editChecklist(). from drop-down: bwChecklistTemplatesId: ' + bwChecklistTemplatesId + ', this.options.store.DraftChecklists: ' + JSON.stringify(this.options.store.DraftChecklists));
            //}

            //alert('In editChecklist(). bwChecklistTemplatesLibraryId: ' + bwChecklistTemplatesLibraryId);
            var selectedChecklistIndex;
            for (var i = 0; i < this.options.store.DraftChecklists.length; i++) {
                if (bwChecklistTemplatesId == this.options.store.DraftChecklists[i].bwChecklistTemplatesId) {

                    ////var json = this.options.store.Checklists;
                    //var json = JSON.parse(this.options.store.DraftChecklists[i].ChecklistJson);
                    //document.getElementById('spanDisplayJsonDialogTitle').innerHTML = 'Checklist JSON';
                    //$('#txtDisplayJsonDialogJSON').empty();
                    //$('#txtDisplayJsonDialogJSON').append(JSON.stringify(json, null, 2));
                    //break;

                    car = this.options.store.DraftChecklists[i];

                    selectedChecklistIndex = i;

                    //alert('xcx21312 car: ' + JSON.stringify(car));
                    break;
                }
            }







            //alert('In editChecklist(). checklistIndex: ' + checklistIndex + ', this.options.store.DraftChecklists: ' + JSON.stringify(this.options.store.DraftChecklists));

            //var car = this.options.store.DraftChecklists[checklistIndex];

            var html = '';

            html += '&nbsp;&nbsp;';
            html += '<input class="buttonAddNewAssignmentRow" style="padding:5px 10px 5px 10px;" onclick="$(\'.bwChecklistsEditor\').bwChecklistsEditor(\'viewChecklist\', \'' + bwChecklistTemplatesId + '\');" type="button" value="View">';

            $('#bwChecklistEditor_spanButtons_' + this.options.elementIdSuffix).html(html);

            html = '';
            //html += '<h2>Checklists Editor <span style="color:red;">[Edit Mode]</span></h2>';

            //html += '                           <span class="printButton" title="print" onclick="cmdPrintForm();">&#x1f5a8;</span>';

            //html += '<br />';
            //html += 'Checklist: ';
            //html += '<select style="padding:5px 5px 5px 5px;" id="bwChecklistEditor_selectChecklist_' + this.options.elementIdSuffix + '" onchange="$(\'.bwChecklistsEditor\').bwChecklistsEditor(\'selectChecklist_OnChange\', \'editing\');">';
            //var selectedChecklistIndex;
            //for (var i = 0; i < this.options.store.DraftChecklists.length; i++) {
            //    if (bwChecklistTemplatesId == this.options.store.DraftChecklists[i].bwChecklistTemplatesId) {
            //        html += '<option value="' + this.options.store.DraftChecklists[i].bwChecklistTemplatesId + '" selected>' + this.options.store.DraftChecklists[i].Title + '</option>';
            //    } else {
            //        html += '<option value="' + this.options.store.DraftChecklists[i].bwChecklistTemplatesId + '">' + this.options.store.DraftChecklists[i].Title + '</option>';
            //    }
            //}
            //html += '</select>';
            //html += '&nbsp;&nbsp;';
            //html += '<input class="buttonAddNewAssignmentRow" style="padding:5px 10px 5px 10px;" onclick="$(\'.bwChecklistsEditor\').bwChecklistsEditor(\'viewChecklist\', \'' + bwChecklistTemplatesId + '\');" type="button" value="View">';
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
            html += '    <input id="strChecklistTitle" onkeyup="$(\'.bwChecklistsEditor\').bwChecklistsEditor(\'editChecklist_OnKeyUp\', \'' + selectedChecklistIndex + '\', \'title\');" style="color: black;font-family:Verdana,Geneva,Tahoma,sans-serif;font-weight:bold;font-size: 12pt;width:50vw;" type="text" value="' + car.Title + '" />';
            html += '  </td>';
            html += '  <td colspan="2" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';
            html += '    <span style="white-space:nowrap;"><input style="width:100%;" onclick="$(\'.bwChecklistsEditor\').bwChecklistsEditor(\'addRowBelow\', \'checklistrow_-1\', \'' + selectedChecklistIndex + '\');" type="button" value="Add row below"></span>';
            html += '  </td>';
            html += '</tr>';

            //alert('xcx1243123 checking  car.ChecklistTemplateRow.  car: ' + JSON.stringify(car));


            for (var i = 0; i < car.ChecklistTemplateRow.length; i++) {
                html += '<tr id="checklistrow_' + i + '" style="border-bottom-color:red;" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';
                if (car.ChecklistTemplateRow[i].hasOwnProperty('TitleSection')) {
                    if (car.ChecklistTemplateRow[i].TitleSection == '<br />') {
                        // BLANK LINE
                        html += this.renderBlankLineCell(selectedChecklistIndex, i)
                        html += '  <td style="vertical-align:top;style="border: 1px solid #d8d8d8;"" class="xdTableOffsetCellComponent" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';
                        html += '    <span style="white-space:nowrap;"><select style="padding:5px 5px 5px 5px;" id="selectRowType_' + i + '" class="xdComboBox xdBehavior_Select" size="1" onchange="$(\'.bwChecklistsEditor\').bwChecklistsEditor(\'selectRowType_OnChange\', \'checklistrow_' + i + '\', \'' + selectedChecklistIndex + '\');"><option value="Question">Question</option><option value="Instructions">Instructions</option><option selected value="Blank line">Blank line</option></select></span>';
                        html += '  </td>';
                    } else {
                        // INSTRUCTIONS
                        html += '  <td id="rowChecklistContentCell_' + i + '" style="border: 1px solid #d8d8d8;" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';
                        html += this.renderInstructionsCell(selectedChecklistIndex, i, car.ChecklistTemplateRow[i].TitleSection)
                        html += '  </td>';
                        html += '  <td style="border: 1px solid #d8d8d8;vertical-align:top;" class="xdTableOffsetCellComponent" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';
                        html += '    <span style="white-space:nowrap;"><select style="padding:5px 5px 5px 5px;" id="selectRowType_' + i + '" class="xdComboBox xdBehavior_Select" size="1" onchange="$(\'.bwChecklistsEditor\').bwChecklistsEditor(\'selectRowType_OnChange\', \'checklistrow_' + i + '\', \'' + selectedChecklistIndex + '\');"><option value="Question">Question</option><option selected value="Instructions">Instructions</option><option value="Blank line">Blank line</option></select></span>';
                        html += '  </td>';
                    }
                } else if (car.ChecklistTemplateRow[i].hasOwnProperty('ChecklistItem')) {
                    // QUESTION
                    html += '  <td id="rowChecklistContentCell_' + i + '" style="border: 1px solid #d8d8d8;" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';
                    html += this.renderQuestionCell(selectedChecklistIndex, i, car.ChecklistTemplateRow[i].ChecklistItem.Question);
                    html += '  </td>';
                    html += '  <td style="border: 1px solid #d8d8d8;vertical-align:top;" class="xdTableOffsetCellComponent" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';
                    html += '    <span style="white-space:nowrap;"><select style="padding:5px 5px 5px 5px;" id="selectRowType_' + i + '" class="xdComboBox xdBehavior_Select" size="1" onchange="$(\'.bwChecklistsEditor\').bwChecklistsEditor(\'selectRowType_OnChange\', \'checklistrow_' + i + '\', \'' + selectedChecklistIndex + '\');"><option selected value="Question">Question</option><option value="Instructions">Instructions</option><option value="Blank line">Blank line</option></select></span>';
                    html += '  </td>';
                } else {
                    alert('Unrecognized json attribute: ' + car.ChecklistTemplateRow[i]);
                }
                html += '  <td style="border: 1px solid #d8d8d8;vertical-align:top;" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';
                html += '    <span style="white-space:nowrap;"><input style="width:100%;" onclick="$(\'.bwChecklistsEditor\').bwChecklistsEditor(\'deleteThisRow\', \'checklistrow_' + i + '\', \'' + selectedChecklistIndex + '\');" type="button" value="Delete this row"></span>';
                html += '<br />';
                if (i > 0) { // Don't show this button for the top row.
                    html += '    <span style="white-space:nowrap;"><input style="width:100%;" onclick="$(\'.bwChecklistsEditor\').bwChecklistsEditor(\'moveRowUp\', \'checklistrow_' + i + '\', \'' + selectedChecklistIndex + '\');" type="button" value="Move row up"></span>';
                    html += '<br />';
                }
                if (i < car.ChecklistTemplateRow.length - 1) { // Don't show this button for the bottom row.
                    html += '    <span style="white-space:nowrap;"><input style="width:100%;" onclick="$(\'.bwChecklistsEditor\').bwChecklistsEditor(\'moveRowDown\', \'checklistrow_' + i + '\', \'' + selectedChecklistIndex + '\');" type="button" value="Move row down"></span>';
                    html += '<br />';
                }
                html += '    <span style="white-space:nowrap;"><input style="width:100%;" onclick="$(\'.bwChecklistsEditor\').bwChecklistsEditor(\'addRowBelow\', \'checklistrow_' + i + '\', \'' + selectedChecklistIndex + '\');" type="button" value="Add row below"></span>';
                html += '  </td>';

                html += '</tr>';
            }
            html += '</table>';

            //this.element.html(html);
            $('#bwChecklistsEditor_ChecklistContent_' + this.options.elementIdSuffix).html(html);

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
            console.log('Exception in bwChecklistsEditor.js.editChecklist(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor.js.editChecklist(): ' + e.message + ', ' + e.stack);
        }
    },
    deleteChecklist: function () {
        try {
            console.log('In deleteChecklist().');
            var thiz = this;
            //
            // This calls the /deletechecklist() web service, which checks the workflow JSON to make sure we can safely TrashBin this checklist. 
            //   - Not strictly necessary, since the bwRequestJson contains the entire definition for a checklist, but for consistency's sake, we should enforce this. It helps with reporting... "Who filled out this checklist? What requests had this checklist?"... 10-25-2022
            //
            var bwChecklistTemplatesId = $('#bwChecklistEditor_selectChecklist_' + thiz.options.elementIdSuffix).find('option:selected').val();
            var title = $('#bwChecklistEditor_selectChecklist_' + thiz.options.elementIdSuffix).find('option:selected').text();

            var proceed = confirm('Do you wish to proceed Deleting checklist "' + title + ' [' + bwChecklistTemplatesId + ']" (put in the TrashBin) ?');
            if (proceed) {

                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

                var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');
                var data = {
                    bwParticipantId_LoggedIn: participantId,
                    bwActiveStateIdentifier: activeStateIdentifier,
                    bwWorkflowAppId_LoggedIn: workflowAppId,

                    bwWorkflowAppId: workflowAppId,
                    bwChecklistTemplatesId: bwChecklistTemplatesId
                };
                $.ajax({
                    url: thiz.options.operationUriPrefix + "_bw/deletechecklist",
                    type: "Post",
                    data: data,
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    }
                }).success(function (result) {
                    try {

                        if (result.status != 'SUCCESS') {

                            alert('Unexpected response in deleteChecklist(): ' + JSON.stringify(result));

                        } else {

                            //document.getElementById('spanUndoChecklistPublishingTitle').innerHTML = 'Checklist DELETED';
                            alert('Checklist deleted successfully.');
                            thiz.loadChecklists();

                        }

                    } catch (e) {
                        console.log('Exception in bwChecklistsEditor.js.deleteChecklist().xx.update: ' + e.message + ', ' + e.stack);
                        alert('Exception in bwChecklistsEditor.js.deleteChecklist().xx.update: ' + e.message + ', ' + e.stack);
                    }
                }).error(function (data, errorCode, errorMessage) {
                    thiz.hideProgress();
                    var msg;
                    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                    } else {
                        msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
                    }
                    console.log('Error in bwChecklistsEditor.js.deleteChecklist().xx.update: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
                    alert('Error in bwChecklistsEditor.js.deleteChecklist().xx.update: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                });

            }

        } catch (e) {
            console.log('Exception in bwChecklistsEditor.js.deleteChecklist(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor.js.deleteChecklist(): ' + e.message + ', ' + e.stack);
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
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divCreateANewRoleDialog").dialog('close');
                    });
                    $("#progressbar").progressbar({
                        value: false
                    });
                    $('.progress-label').text(displayText);
                },
                close: function () {
                    //$(this).dialog('destroy').remove();
                    $("#divProgressBarDialog").dialog('destroy').remove();
                }
                //buttons: {
                //    "Close": function () {
                //        $(this).dialog("close");
                //    }
                //}
            });
            $("#divProgressBarDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

        } catch (e) {
            console.log('Exception in bwChecklistsEditor.js.showProgress(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor.js.showProgress(): ' + e.message + ', ' + e.stack);
        }
    },
    hideProgress: function () {
        try {
            console.log('In bwChecklistsEditor.js.hideProgress().');

            $('#divProgressBarDialog').dialog('close');
        } catch (e) {
            console.log('Exception in bwChecklistsEditor.js.hideProgress(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor.js.hideProgress(): ' + e.message + ', ' + e.stack);
        }
    },
    publishChecklist: function (bwChecklistTemplatesId) {
        try {
            console.log('In bwChecklistsEditor.js.publishChecklist().');
            var thiz = this;

            var selectedChecklistIndex;
            for (var i = 0; i < this.options.store.DraftChecklists.length; i++) {
                if (bwChecklistTemplatesId == this.options.store.DraftChecklists[i].bwChecklistTemplatesId) {
                    //car = this.options.store.DraftChecklists[i];
                    selectedChecklistIndex = i;
                    break;
                }
            }

            var proceed = confirm('You may lose changes, and these will be unrecoverable. Do you wish to proceed Publishing checklist "' + this.options.store.DraftChecklists[selectedChecklistIndex].Title + '"?');
            if (proceed) {

                this.showProgress('Publishing checklist "' + this.options.store.DraftChecklists[selectedChecklistIndex].Title + '"...');

                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');
                var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');

                var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                var json = {
                    bwParticipantId_LoggedIn: participantId,
                    bwActiveStateIdentifier: activeStateIdentifier,
                    bwWorkflowAppId_LoggedIn: workflowAppId,

                    bwChecklistTemplatesId: bwChecklistTemplatesId,
                    bwWorkflowAppId: workflowAppId,

                    CreatedById: participantId,
                    CreatedByFriendlyName: participantFriendlyName,
                    CreatedByEmail: participantEmail,

                    Title: this.options.store.DraftChecklists[selectedChecklistIndex].Title,
                    Description: '',
                    ChecklistJson: JSON.stringify(thiz.options.store.DraftChecklists[selectedChecklistIndex]),
                    isActive: true
                };
                $.ajax({
                    url: thiz.options.operationUriPrefix + '_bw/publishchecklistfororganization', // "odata/Checklist", // _bw/publishchecklistfororganization
                    type: "Post",
                    data: json,
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    }
                }).success(function (result) {
                    try {

                        thiz.hideProgress();

                        if (result.status != 'SUCCESS') {

                            console.log('Error in bwChecklistsEditor.js.publishChecklist(). ' + result.status + ': ' + result.message);
                            displayAlertDialog('Error in bwChecklistsEditor.js.publishChecklist(). ' + result.status + ': ' + result.message);

                        } else {

                            

                            displayAlertDialog(result.message); //'The checklist was saved or updated succesfully.');

                            //$('#divChecklistJsonDialog_' + thiz.options.elementIdSuffix).dialog('close');

                            thiz.loadChecklists();

                        }

                    } catch (e) {
                        console.log('Exception in bwChecklistsEditor.js.publishChecklist().xx.update: ' + e.message + ', ' + e.stack);
                        alert('Exception in bwChecklistsEditor.js.publishChecklist().xx.update: ' + e.message + ', ' + e.stack);
                    }
                }).error(function (data, errorCode, errorMessage) {
                    //debugger;
                    thiz.hideProgress();
                    var msg;
                    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                    } else {
                        msg = JSON.stringify(data); // + ', json: ' + JSON.stringify(json);
                    }
                    console.log('Error in bwChecklistsEditor.js.publishChecklist().xx.update: ' + msg); // + ', json: ' + JSON.stringify(json));
                    alert('Error in bwChecklistsEditor.js.publishChecklist().xx.update: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                    //var error = JSON.parse(data.responseText)["odata.error"];
                    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                });
            }

        } catch (e) {
            console.log('Exception in bwChecklistsEditor.js.publishChecklist(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor.js.publishChecklist(): ' + e.message + ', ' + e.stack);
        }
    },
    cancelChangesInDraftChecklistConfiguration: function () {
        try {
            console.log('In bwChecklistsEditor.js.cancelChangesInDraftChecklistConfiguration().');

            alert('This functionality is incomplete. Coming soon!');
            //var thiz = this;
            //var proceed = confirm('You may lose changes, and these will be unrecoverable. Do you wish to proceed Publishing checklist "' + this.options.store.DraftChecklists[checklistIndex].Title + '"?');
            //if (proceed) {
            //}
        } catch (e) {
            console.log('Exception in bwChecklistsEditor.js.cancelChangesInDraftChecklistConfiguration(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor.js.cancelChangesInDraftChecklistConfiguration(): ' + e.message + ', ' + e.stack);
        }
    },
    displayChecklist: function (checklistIndex) {
        try {
            console.log('In bwChecklistsEditor.js.displayChecklist().');

            var proceed = confirm('You may lose changes, and these will be unrecoverable. Do you wish to proceed?');
            if (proceed) {
                this._create(checklistIndex);
            } else {
                // do nothing
            }
            //alert('This functionality is incomplete. Coming soon!');
            //var car = this.options.store;
        } catch (e) {
            console.log('Exception in bwChecklistsEditor.js.displayChecklist(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor.js.displayChecklist(): ' + e.message + ', ' + e.stack);
        }
    },
    viewChecklist: function (bwChecklistTemplatesId) {
        try {
            console.log('In bwChecklistsEditor.js.viewChecklist().'); // 10-18-2022

            //alert('This functionality is incomplete. Coming soon!');
            //this._create(checklistIndex);

            this.renderChecklistsEditor2(bwChecklistTemplatesId);

            this.checkIfThereHaveBeenChangesToThisChecklist(bwChecklistTemplatesId);

        } catch (e) {
            console.log('Exception in bwChecklistsEditor.js.viewChecklist(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor.js.viewChecklist(): ' + e.message + ', ' + e.stack);
        }
    },
    deleteThisRow: function (elementId, checklistIndex) {
        try {
            console.log('In bwChecklistsEditor.js.deleteThisRow().');

            var row = elementId.split('_')[1];
            //alert('This functionality is incomplete. Coming soon! row: ' + row);

            this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow.splice(row, 1); // delete leaves a null, so we have to use splice.
            this.editChecklist(checklistIndex);
        } catch (e) {
            console.log('Exception in bwChecklistsEditor.js.deleteThisRow(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor.js.deleteThisRow(): ' + e.message + ', ' + e.stack);
        }
    },
    addRowBelow: function (elementId, checklistIndex) {
        try {
            console.log('In bwChecklistsEditor.js.addRowBelow().');

            //debugger;
            var row = Number(elementId.split('_')[1]) + 1;
            //var newrow = {
            //    ChecklistItem: { Question: 'What is the question?', YesText: '', NoText: '' }
            //};
            var newrow = {
                TitleSection: '<br />'
            };
            this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow.splice(row, 0, newrow); // add the new row
            this.editChecklist(checklistIndex); // render
        } catch (e) {
            console.log('Exception in bwChecklistsEditor.js.addRowBelow(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor.js.addRowBelow(): ' + e.message + ', ' + e.stack);
        }
    },
    moveRowUp: function (elementId, checklistIndex) {
        try {
            console.log('In bwChecklistsEditor.js.moveRowUp().');

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
            console.log('Exception in bwChecklistsEditor.js.moveRowUp(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor.js.moveRowUp(): ' + e.message + ', ' + e.stack);
        }
    },
    moveRowDown: function (elementId, checklistIndex) {
        try {
            console.log('In bwChecklistsEditor.js.moveRowDown().');

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
            console.log('Exception in bwChecklistsEditor.js.moveRowDown(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor.js.moveRowDown(): ' + e.message + ', ' + e.stack);
        }
    },
    renderQuestionCell: function (checklistIndex, row, questionText) {
        try {
            console.log('In bwChecklistsEditor.js.renderQuestionCell().');

            var html = '';
            html += '    <table style="width:100%;border: 1px solid #d8d8d8;" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';
            html += '      <tr onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';
            html += '        <td style="text-align:left;color:darkgrey;" class="bwSliderTitleCell" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';

            html += '          <textarea id="strChecklistQuestion_' + row + '" onkeyup="$(\'.bwChecklistsEditor\').bwChecklistsEditor(\'editChecklist_OnKeyUp\', \'' + checklistIndex + '\', \'' + row + '\');" style="min-height: 5em;max-height: 50vh;width: 100%;color: #262626;font-size: 10pt;font-family:Verdana,Geneva,Tahoma,sans-serif;" type="text">' + questionText + '</textarea>';

            html += '        </td>';
            html += '        <td class="bwChartCalculatorLightCurrencyTableCell" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';
            html += '          <label for="configurationBehaviorRequireStartEndDatesSlider2"></label><input type="checkbox" name="configurationBehaviorRequireStartEndDatesSlider2" id="configurationBehaviorRequireStartEndDatesSlider2" />';
            html += '        </td>';
            html += '      </tr>';
            html += '    </table>';
            return html;
        } catch (e) {
            console.log('Exception in bwChecklistsEditor.js.renderQuestionCell(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor.js.renderQuestionCell(): ' + e.message + ', ' + e.stack);
        }
    },
    renderInstructionsCell: function (checklistIndex, row, instructionText) {
        try {
            console.log('In bwChecklistsEditor.js.renderInstructionsCell().');

            var html = '';
            html += '    <table style="width:100%;border: 1px solid #d8d8d8;" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';
            html += '      <tr onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';
            html += '         <td style="text-align:left;color:darkgrey;" class="bwSliderTitleCell" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';

            html += '           <textarea id="strChecklistInstructions_' + row + '" onkeyup="$(\'.bwChecklistsEditor\').bwChecklistsEditor(\'editChecklist_OnKeyUp\', \'' + checklistIndex + '\', \'' + row + '\');" style="min-height: 5em;max-height: 50vh;width: 100%;color: #262626;font-size: 10pt;font-family:Verdana,Geneva,Tahoma,sans-serif;" type="text">' + instructionText + '</textarea>';

            html += '         </td>';
            html += '      </tr>';
            html += '    </table>';
            return html;
        } catch (e) {
            console.log('Exception in bwChecklistsEditor.js.renderInstructionsCell(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor.js.renderInstructionsCell(): ' + e.message + ', ' + e.stack);
        }
    },
    renderBlankLineCell: function (checklistIndex, row) {
        try {
            console.log('In bwChecklistsEditor.js.renderBlankLineCell().');

            var html = '';
            //html += '<br />';
            html += '  <td id="rowChecklistContentCell_' + row + '" style="border: 1px solid #d8d8d8;" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';
            html += '  </td>';
            //html += '    <table style="width:100%;border: 1px solid #d8d8d8;" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';
            //html += '      <tr onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';
            //html += '         <td style="text-align:left;color:darkgrey;" class="bwSliderTitleCell" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'white\';">';

            //html += '           <textarea id="strChecklistInstructions_' + row + '" onkeyup="$(\'.bwChecklistsEditor\').bwChecklistsEditor(\'editChecklist_OnKeyUp\', \'' + checklistIndex + '\', \'' + row + '\');" style="min-height: 5em;max-height: 50vh;width: 100%;color: #262626;font-size: 10pt;font-family:Verdana,Geneva,Tahoma,sans-serif;" type="text">' + instructionText + '</textarea>';

            //html += '         </td>';
            //html += '      </tr>';
            //html += '    </table>';
            return html;
        } catch (e) {
            console.log('Exception in bwChecklistsEditor.js.renderBlankLineCell(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor.js.renderBlankLineCell(): ' + e.message + ', ' + e.stack);
        }
    },
    selectRowType_OnChange: function (elementId, checklistIndex) {
        try {
            console.log('In selectRowType_OnChange(). elementId: ' + elementId + ', checklistIndex: ' + checklistIndex);

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
            console.log('Exception in bwChecklistsEditor.js.selectRowType_OnChange(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor.js.selectRowType_OnChange(): ' + e.message + ', ' + e.stack);
        }
    },
    selectChecklist_OnChange: function (mode) {
        try {
            console.log('In bwChecklistsEditor.js.selectChecklist_OnChange().');

            //debugger;
            //var selectedValue = document.getElementById('selectChecklist').value;
            var bwChecklistTemplatesId = $('#bwChecklistEditor_selectChecklist_' + this.options.elementIdSuffix).find('option:selected').val();

            //var checklistIndex = null;
            var json;
            for (var i = 0; i < this.options.store.Checklists.length; i++) {
                if (bwChecklistTemplatesId == this.options.store.Checklists[i].bwChecklistTemplatesId) {
                    json = this.options.store.Checklists[i];
                }
            }
            //if (checklistIndex != null) {
            //    var json = this.options.store.Checklists[i];
            if (mode == 'editing') {
                this.editChecklist(); // Render the checklist in edit mode.
            } else {
                //this.element.html(this.renderChecklistsEditor(checklistIndex)); // Render the checklist in view mode.
                this.viewChecklist(bwChecklistTemplatesId);
            }
            //} else {
            //    console.log('In selectChecklist_OnChange(). Unexpected value for selectedValue: ' + selectedValue);
            //    alert('In selectChecklist_OnChange(). Unexpected value for selectedValue: ' + selectedValue);
            //}
        } catch (e) {
            console.log('Exception in bwChecklistsEditor.js.selectChecklist_OnChange(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor.js.selectChecklist_OnChange(): ' + e.message + ', ' + e.stack);
        }
    },
    editChecklist_OnKeyUp: function (checklistIndex, rowIndex) {
        try {
            console.log('In bwChecklistsEditor.js.editChecklist_OnKeyUp(). checklistIndex: ' + checklistIndex + ', rowIndex: ' + rowIndex);

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
                    this.options.store.DraftChecklists[checklistIndex].Title = title;
                } else {
                    //var draftChecklist = this.options.store.DraftChecklists[checklistIndex]; // Get the row, and the control contents and type. Put it in the draft section here!
                    var rowType = document.getElementById('selectRowType_' + rowIndex).value.toLowerCase(); // Get the row type by getting the drop down selection
                    if (rowType == 'blank line') {
                        // do nothing
                    } else if (rowType == 'instructions') {
                        var x = document.getElementById('strChecklistInstructions_' + rowIndex).value;
                        this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow[rowIndex].TitleSection = x; // = { TitleSection: x };
                    } else if (rowType == 'question') {
                        //debugger;
                        var x = document.getElementById('strChecklistQuestion_' + rowIndex).value;
                        this.options.store.DraftChecklists[checklistIndex].ChecklistTemplateRow[rowIndex].ChecklistItem.Question = x; // = { ChecklistItem: { Question: x, YesText: '', NoText: '' } };
                    } else {
                        alert('Unrecognized row type: ' + rowType);
                    }
                }
            }
        } catch (e) {
            console.log('Exception in bwChecklistsEditor.js.editChecklist_OnKeyUp(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor.js.editChecklist_OnKeyUp(): ' + e.message + ', ' + e.stack);
        }
    },
    downloadChecklistsJson: function () {
        try {
            console.log('In bwChecklistsEditor.js.downloadChecklistsJson().');

            // Display a dialog box with a big textarea so that the contents can be copied and pasted.
            $("#divDisplayJsonDialog").dialog({
                modal: true,
                resizable: false,
                //closeText: "Cancel",
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                //title: 'Alert',
                width: "760",
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false,//, // This means when hiding just disappear with no effects.
                //buttons: {
                //    "Close": function () {
                //        $(this).dialog("close");
                //    }
                //}
                open: function (event, ui) { $('.ui-widget-overlay').bind('click', function () { $("#divDisplayJsonDialog").dialog('close'); }); } // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.
            });
            $("#divDisplayJsonDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            var json = this.options.store.Checklists;
            document.getElementById('spanDisplayJsonDialogTitle').innerHTML = 'Checklist JSON';
            $('#txtDisplayJsonDialogJSON').empty();
            $('#txtDisplayJsonDialogJSON').append(JSON.stringify(json, null, 2));

        } catch (e) {
            console.log('Exception in bwChecklistsEditor.js.downloadChecklistsJson(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor.js.downloadChecklistsJson(): ' + e.message + ', ' + e.stack);
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
            console.log('In bwChecklistsEditor.js.pinRequestDialog().');
            // This makes the dialog non-modal, so that it can be dragged around and the underlying functionality accessible. This removes the overlay that makes the dialog modal, and also removes the click event which would have originally closed the request dialog.
            // The idea is to be able to have multiple requests open at once!
            $('.ui-widget-overlay').unbind('click');
            $(".ui-widget-overlay").remove();

            console.log('In bwChecklistsEditor.js.pinRequestDialog(). Scrolling window to top. This is experimental.');
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
            console.log('Exception in bwChecklistsEditor.js.pinRequestDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwChecklistsEditor.js.pinRequestDialog(): ' + e.message + ', ' + e.stack);
        }
    }

});