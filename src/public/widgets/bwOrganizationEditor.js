$.widget("bw.bwOrganizationEditor", {
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
        This is the bwOrganizationEditor.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        elementIdSuffix: null, // This is a custom guid which gets appended to element id's, making sure this widget keeps to itself.

        canvasElementId: null, // 4-26-2022 This is the new way we are handling the canvas.

        DisplayAsNewTenantUserConfigurationEditor: null, // This has to be set to true when using it on the administration pages.

        value: 0,
        json: null,

        Workflows: null, // This is all of the workflows.

        CurrentWorkflow: null, // workflow: null, // This is all of the workflows. 

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
        lastSelectedDivisionGroupEntityLocationIndexes: null, // lastSelectedDivisionGroupEntityLocation { Division, Group, LegalEntity, Location }
        quill: null,
        displayOrgRolesPicker: false, //true, // Should be false by default but this is good for now.
        displayRoleIdColumn: false,
        autoSenseDeviceType: false, // Automatic UI based on device type. Alpha version so far.
        LastSelectedNewRequestType: null
    },
    _create: function (assignmentRowChanged_ElementId) {
        this.element.addClass("bwOrganizationEditor");
        var thiz = this; // Need this because of the asynchronous operations below.

        try {
            console.log('In bwOrganizationEditor.js._create().');
            //alert('In bwOrganizationEditor.js._create().');

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
            this.options.canvasElementId = 'canvasBusinessModelEditor_' + guid;

            //var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
            //var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            //var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            if (this.options.store != null) {

                // 8-17-2022 removed
                // this.options.store is populated, so just render the OrgRoles.
                //$('#divPageContent3').html(this.renderOrgRolesEditor(assignmentRowChanged_ElementId));
                //HideActivitySpinner();

            } else {

                // 8-17-2022 removed
                this.loadBusinessModelEditor();

            }

        } catch (e) {
            HideActivitySpinner();
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwOrganizationEditor: CANNOT RENDER THE WORKFLOW MATRIX</span>';
            html += '<br />';
            html += '<span style="">Exception in bwOrganizationEditor._create(): ' + e.message + ', ' + e.stack + '</span>';
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
    loadBusinessModelEditor: function (renderTheOrganizationEditor) {
        var thiz = this;
        return new Promise(function (resolve, reject) {
            try {
                console.log('In bwOrganizationEditor.js.loadBusinessModelEditor().');
                //alert('In bwOrganizationEditor.js.loadBusinessModelEditor().');

                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

                var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                var data = {
                    bwParticipantId_LoggedIn: participantId,
                    bwActiveStateIdentifier: activeStateIdentifier,
                    bwWorkflowAppId_LoggedIn: workflowAppId,

                    bwWorkflowAppId: workflowAppId,
                    bwRequestTypeId: 'ALL',
                    isActive: true
                };

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
                                url: thiz.options.operationUriPrefix + "_bw/workflowconfiguration",
                                type: "POST",
                                data: data,
                                headers: {
                                    "Accept": "application/json; odata=verbose"
                                },
                                success: function (result2) {
                                    try {

                                        if (thiz.options.DisplayAsNewTenantUserConfigurationEditor == true) {

                                            var orgRoles = orcResult.value;
                                            if (!orgRoles.Global) {
                                                var x = {
                                                    Global: orgRoles
                                                };
                                                orgRoles = JSON.parse(JSON.stringify(x));
                                            }

                                            var draftGlobal = JSON.parse(JSON.stringify(orgRoles.Global));
                                            thiz.options.store = {
                                                DraftGlobal: draftGlobal,
                                                Global: orgRoles.Global
                                            }








                                            //thiz.element.html(thiz.renderOrgRolesEditor2()); // Render the org chart.
                                            $('#divPageContent3').html(thiz.renderOrgRolesEditor2());

                                            thiz.checkIfWeHaveToDisplayThePublishChangesButton();
                                            HideActivitySpinner();

                                        } else {

                                            thiz.options.Checklists = orcResult.Checklists;

                                            //console.log('The user is not logged in, so displaying the default WorkflowEditor.');
                                            var orgRoles;

                                            if (!participantId) {
                                                // The user is not logged in.
                                                console.log('The user is not logged in, so displaying the default WorkflowEditor.');
                                                orgRoles = orcResult.value[0].ConfigurationValues; // Works when the user is not logged in. 
                                                thiz.options.Workflows = result2.value[0].ConfigurationValues;
                                            } else {
                                                // The user is logged in.
                                                orgRoles = orcResult.value; // Works when the user is logged in.
                                                thiz.options.Workflows = result2.value;

                                                //
                                                //
                                                // WORKFLOWS ARE NOW STORED IN bwAuthentication.js. WE NEED TO REMOVE IT FROM HERE SOMEDAY and use bwAuthentication.js as the source. THIS IS A WORK IN PROGRESS at the moment... 6-14-2024.
                                                //
                                                //
                                                //alert('WE ARE WORKING TO GET THE WORKFLOWS STORED IN bwAuthentication.js. THIS IS A WORK IN PROGRESS at the moment... 6-1-2024.');
                                                //$('.bwAuthentication:first').bwAuthentication('option', 'Workflows', JSON.parse(JSON.stringify(result2.value))); // Deep copy at the moment. Not sure if this is necessary long term or at all.






                                            }

                                            if (!orgRoles.Global) {
                                                var x = {
                                                    Global: orgRoles
                                                };
                                                orgRoles = JSON.parse(JSON.stringify(x));
                                            }

                                            var draftGlobal = JSON.parse(JSON.stringify(orgRoles.Global));
                                            thiz.options.store = {
                                                DraftGlobal: draftGlobal,
                                                Global: orgRoles.Global
                                            }


                                            if (renderTheOrganizationEditor && (renderTheOrganizationEditor == true)) {

                                                // Render the organization editor.
                                                //console.log('Preparing to render the organization editor.');
                                                //alert('Preparing to render the organization editor.');
                                                $('#divPageContent3').html(thiz.renderOrgRolesEditor());

                                            }

                                        }

                                        var result = {
                                            status: 'SUCCESS',
                                            message: 'SUCCESS'
                                        }
                                        resolve(result);

                                    } catch (e) {

                                        var msg = 'Exception in bwOrganizationEditor._create().Get.WorkflowConfiguration.done(): ' + e.message + ', ' + e.stack;
                                        var result = {
                                            status: 'EXCEPTION',
                                            message: msg
                                        }
                                        reject(result);

                                    }
                                },
                                error: function (data) {

                                    var msg = 'Error in bwOrganizationEditor.js.loadBusinessModelEditor.POST.workflowconfiguration(): ' + errorMessage + ', ' + JSON.stringify(data);
                                    var result = {
                                        status: 'ERROR',
                                        message: msg
                                    }
                                    reject(result);

                                }
                            });
                        } catch (e) {

                            var msg = 'Exception in bwOrganizationEditor._create().Get.OrgRolesConfiguration.done(): ' + e.message + ', ' + e.stack;
                            var result = {
                                status: 'EXCEPTION',
                                message: msg
                            }
                            reject(result);

                        }
                    },
                    error: function (data, errorCode, errorMessage) {

                        var msg = 'Error in bwOrganizationEditor.js.loadBusinessModelEditor.POST.OrgRolesConfiguration(): ' + errorMessage + ', ' + JSON.stringify(data);
                        var result = {
                            status: 'ERROR',
                            message: msg
                        }
                        reject(result);

                    }
                });

            } catch (e) {

                var msg = 'Exception in bwOrganizationEditor.js.loadBusinessModelEditor(): ' + e.message + ', ' + e.stack;
                var result = {
                    status: 'EXCEPTION',
                    message: msg
                }
                reject(result);

            }
        })
    },
    renderBusinessModelEditor: function () {
        try {
            console.log('In bwOrganizationEditor.js.renderBusinessModelEditor().');

            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            if (!participantId) {

                // The user is not logged in.
                var html = '';
                html += '<span style="font-size:30pt;">The demo for the Organization Editor is coming soon.</span>';
                $('#divPageContent3').html(html); //thiz.renderOrgRolesEditor2());

            } else {

                // Render the organization editor.
                console.log('In bwOrganizationEditor.js.renderBusinessModelEditor(). Preparing to render the organization editor.');
                $('#divPageContent3').html(this.renderOrgRolesEditor());

                this.renderWorkflowPeoplePicker('spanWorkflowPeoplePicker_right');
            }

        } catch (e) {
            console.log('Exception in bwOrganizationEditor.js.renderBusinessModelEditor(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwOrganizationEditor.js.renderBusinessModelEditor(): ' + e.message + ', ' + e.stack);
        }
    },

    renderTreeviewWithNewJson: function () {
        try {
            console.log('In bwOrganizationEditor.js.renderTreeviewWithNewJson().');
            debugger;
            //var json = document.getElementById('txtNewUserOrganizationModelJSON').innerHTML;
            var json = $('#divConfigureBusinessModelNotificationsDialog2-1').find('#txtNewUserOrganizationModelJSON')[0].innerHTML;

            //debugger;
            this.options.store.Global = JSON.parse(json).DraftGlobal;

            //this.options.store = {
            //    DraftGlobal: JSON.parse(JSON.stringify(json.Global)),
            //    Global: json.Global
            //}


            var instance = $('#divConfigureBusinessModelNotificationsDialog2-1').find('.bwOrganizationEditor')[0]; //.innerHTML;


            //this.element.html(this.renderOrgRolesEditor2()); // Render the org chart.
            $(instance).html(this.renderOrgRolesEditor2()); // Render the org chart.

        } catch (e) {
            console.log('Exception in bwOrganizationEditor.js.renderTreeviewWithNewJson(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwOrganizationEditor.js.renderTreeviewWithNewJson(): ' + e.message + ', ' + e.stack);
        }
    },
    getDatastore: function () {
        try {
            console.log('In bwOrganizationEditor.js.getDatastore().');
            //debugger;



            //if (this.options.store != null) {
            return this.options.store; // the CircleDialog needs to reach out to this.
            //} else {






            //    debugger;
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

            //                    if (!orgRoles.Global) {
            //                        var x = {
            //                            Global: orgRoles
            //                        };
            //                        orgRoles = JSON.parse(JSON.stringify(x));
            //                    }
            //                    //debugger;
            //                    var draftGlobal = JSON.parse(JSON.stringify(orgRoles.Global));
            //                    thiz.options.store = {
            //                        DraftGlobal: draftGlobal,
            //                        Global: orgRoles.Global
            //                    }
            //                    //debugger;

            //                    thiz.options.CurrentWorkflow = workflow;

            //                    //thiz.element.html(thiz.renderOrgRolesEditor()); //assignmentRowChanged_ElementId)); // Render the org chart.

            //                    //debugger;
            //                    // TODD THIS COULD BE MOVED TO A DIFFERENT LOCATION PROB
            //                    //var tagname = 'spanWorkflowPeoplePicker_right'; // Just showing it at the top for the moment
            //                    ////debugger;
            //                    //thiz.renderWorkflowPeoplePicker(tagname); // spanWorkflowPeoplePicker1

            //                    //return thiz.options.store;

            //                } catch (e) {
            //                    //lpSpinner.Hide();
            //                    console.log('Exception in bwOrganizationEditor.getDatastore().xx.Get:1: ' + e.message + ', ' + e.stack);
            //                }
            //            }).fail(function (data) {
            //                //lpSpinner.Hide();
            //                debugger;
            //                console.log('In getDatastore.fail(): ' + JSON.stringify(data));
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
            //            console.log('Exception in bwOrganizationEditor.getDatastore().xx.Get:1: ' + e.message + ', ' + e.stack);
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
            //        alert('Exception in bwOrganizationEditor.getDatastore().xx.Get:2: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
            //        console.log('Exception in bwOrganizationEditor.getDatastore().xx.Get:2: ' + JSON.stringify(data));
            //        //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
            //        //var error = JSON.parse(data.responseText)["odata.error"];
            //        //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            //    });


            //}







        } catch (e) {
            console.log('Exception in getDatastore(): ' + e.message + ', ' + e.stack);
        }
    },



    renderOrgRolesEditor: function (assignmentRowChanged_ElementId) {
        try {
            console.log('In bwOrganizationEditor.js.renderOrgRolesEditor().');

            $('.bwCircleDialog').bwCircleDialog('hideAndDestroyCircleDialog'); // This makes sure the circle dialog doesn't pop up again by accident ona screen resize.

            //var thiz = this;
            ////debugger;
            //var json = this.options.store; //.OrgStructureAndRoles;
            //var orgsImageFetchingInformation = [];
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




            html += '<div style="display:none;" id="divDisplayJsonDialogForBusinessModelEditor_' + this.options.elementIdSuffix + '">';
            html += '  <table style="width:100%;">';
            html += '    <tr>';
            html += '      <td style="width:90%;">';
            html += '        <span id="spanDisplayJsonDialogTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">[spanDisplayJsonDialogTitle]</span>';
            html += '      </td>';
            html += '      <td style="width:9%;"></td>';
            html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divDisplayJsonDialogForBusinessModelEditor_' + this.options.elementIdSuffix + '\').dialog(\'close\');">X</span>';
            html += '      </td>';
            html += '    </tr>';
            html += '  </table>';
            html += '  <br /><br />';
            html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '  <span id="spanDisplayJsonDialogContent" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:20pt;">[spanDisplayJsonDialogContent]</span>';
            html += '  <br />';
            html += '  <br />';
            // Copy to clipboard.
            html += '<div class="tooltip">';
            html += '   <button onclick="copyToClipboard(\'txtDisplayJsonDialogJSON\', \'spanDisplayJsonDialogCopyJsonTooltip\')" onmouseout="copyToClipboardMouseout(\'spanDisplayJsonDialogCopyJsonTooltip\')">';
            html += '       <span class="tooltiptext" id="spanDisplayJsonDialogCopyJsonTooltip">Copy JSON to the clipboard</span>';
            html += '       Copy'; // JSON...';
            html += '   </button>';
            html += '</div>';
            // end Copy to clipboard.
            html += '  <textarea id="divDisplayJsonDialogForBusinessModelEditor_txtDisplayJsonDialogJSON" rows="30" cols="130" style="padding-top:4px;font-size:8pt;"></textarea>';
            //html += '  <pre id="txtDisplayJsonDialogJSON" style="overflow:auto;padding-top:4px;font-size:8pt;width:98%;height:300px;border:1px solid gainsboro;"></pre>';
            html += '  <br />';
            html += '  <br />';
            html += '  <div id="btnRunDiagnostics" class="divDialogButton" title="Click here to run diagnostics..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'runJsonDiagnostics\');">';
            html += '   Run Diagnostics...';
            html += '  </div>';
            html += '  <br /><br />';
            html += '  <div class="divDialogButton" onclick="$(\'#divDisplayJsonDialogForBusinessModelEditor_' + this.options.elementIdSuffix + '\').dialog(\'close\');">';
            html += '   Close';
            html += '  </div>';
            html += '  <br />';
            html += '  <br />';
            html += '</div>';












            // Header with print button.
            html += '<table style="width:100%;"  class="context-menu-organizationeditor">';
            //html += '   <tr style="height:90pt;vertical-align:top;">';
            html += '   <tr style="vertical-align:top;">';
            html += '       <td>';

            html += '           <table>';



















            html += '               <tr>';
            html += '                   <td>';
            //html += '                       <h2>';


            //html += '                       Organization Editor: ';
            html += '                       <span style="color:#95b1d3;cursor:help;" ';
            // Hoverover text for RACI.
            html += ' title="';
            //html += 'Role distinction: ';
            //html += 'There is a distinction between a role and individually identified people: a role is a descriptor of an associated set of tasks; may be performed by many people; and one person can perform many roles. For example, an organization may have ten people who can perform the role of project manager, although traditionally each project only has one project manager at any one time; and a person who is able to perform the role of project manager may also be able to perform the role of analyst and tester. ';
            //html += 'R = Responsible (also Recommender)';
            //html += 'Those who do the work to complete the task.[6] There is at least one role with a participation type of responsible, although others can be delegated to assist in the work required (see also RASCI below for separately identifying those who participate in a supporting role).';
            //html += 'A = Accountable (also Approver or final approving authority)';
            //html += 'The one ultimately answerable for the correct and thorough completion of the deliverable or task, the one who ensures the prerequisites of the task are met and who delegates the work to those responsible.[6] In other words, an accountable must sign off (approve) work that responsible provides. There must be only one accountable specified for each task or deliverable.[7]';
            //html += 'C = Consulted (sometimes Consultant or counsel)';
            //html += 'Those whose opinions are sought, typically subject matter experts; and with whom there is two-way communication.[6]';
            //html += 'I = Informed (also Informee)';
            //html += 'Those who are kept up-to-date on progress, often only on completion of the task or deliverable; and with whom there is just one-way communication.[6]';
            //html += 'Very often the role that is accountable for a task or deliverable may also be responsible for completing it (indicated on the matrix by the task or deliverable having a role accountable for it, but no role responsible for its completion, i.e. it is implied). Outside of this exception, it is generally recommended that each role in the project or process for each task receive, at most, just one of the participation types. Where more than one participation type is shown, this generally implies that participation has not yet been fully resolved, which can impede the value of this technique in clarifying the participation of each role on each task. ';



            html += 'RACI: ';
            html += '\n';
            html += 'R = Responsible (also Recommender)  ';
            html += '\n';
            html += 'A = Accountable (also Approver or final approving authority)  ';
            html += '\n';
            html += 'C = Consulted (sometimes Consultant or counsel)  ';
            html += '\n';
            html += 'I = Informed (also Informee)  ';


            html += '" ';
            html += '>';


            //
            // This is our ellipsis context menu.
            //html += '<style>';
            //html += '.bwEllipsis { cursor:pointer;padding:6px 4px 0px 4px;border: 1px solid goldenrodyellow;vertical-align:bottom; }';
            //html += '';
            //html += '.bwEllipsis:hover { color:red;background-color:whitesmoke; }';
            //html += '';
            //html += '</style>';
            //html += '&n

            html += '<span style="color:black;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 35pt;font-weight:bold;">';

            // 4-19-2022
            //html += '   <span id="spanBwBusinessModelEditor_TopTitle1">Configure the Organization&nbsp;&nbsp;&nbsp;</span>';
            html += '   <span id="spanBwBusinessModelEditor_TopTitle1">Configure the Organization and Workflow for [drop-down]&nbsp;&nbsp;&nbsp;</span>';




            html += '   <span id="spanBusinessEditorEllipsesContextMenu" class="spanButton context-menu-organizationeditor" style="height:20px;width:150px;"> ... </span>';
            html += '</span>';


            //html += '<span id="spanConfigurationOrganizationAdditionalOptionsEllipsis" style="font-size:18pt;" class="bwEllipsis context-menu-one btn btn-neutral" title="View additional options...">';
            //html += '...'; // AP format 
            //html += '. . .'; // Chicago format
            //html += '⋯'; // Mid-line ellipsis 
            //html += '</span>';
            // End: This is our ellipsis context menu.
            //



            html += '                       </span>'; // Velvet Morning is #95b1d3. This was the pantone color of the day for December 9, 2019! :D


            //html += '                       </h2>';
            html += '                   </td>';
            html += '               </tr>';


















            html += '               <tr>';
            html += '                   <td>';
            //html += 'Select how your organization is structured:';
            //html += '   <select style="padding:5px 5px 5px 5px;" id="selectOrganizationalStructure" onchange="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'selectOrganizationalStructure_OnChange\', \'viewing\');">';
            //html += '       <option value="Single Location">Single Location (local)</option>';
            //html += '       <option value="Legal Entity > Location">Legal Entity > Locations (local/national)</option>';
            //html += '       <option value="Group > Legal Entity > Location" selected>Group > Legal Entity > Location (national/international)</option>';
            //html += '       <option value="Division > Group > Legal Entity > Location" selected>Division > Group > Legal Entity > Location (international)</option>';
            //html += '   </select>';
            //html += '<br />';
            // Activate button.
            html += '                       <table>';
            html += '                           <tr>';
            //html += '  <td></td>';
            //html += '                               <td colspan="3" style="text-align:right;height:30pt;">'; // The height keeps the whole screen from moving around.
            html += '                               <td colspan="3" style="text-align:right;">'; // The height keeps the whole screen from moving around.
            html += '                                   <span id="spanOrganizationError" style="font-style:italic;color:tomato;font-size:6pt;"></span>';
            html += '                               </td>';
            //html += '  <td>';
            //html += '    <span id="spanThereAreChangesToPublishButton"></span>';
            //html += '  </td>';
            html += '                           </tr>';

            //if (thiz.options.displayOrgRolesPicker) {
            //    html += '<tr>';
            //    html += '  <td>';
            //    html += '  </td>';
            //    html += '  <td>';
            //    html += '    <span id="spanOrgRolesDropDownList"></span>';
            //    html += '  </td>';
            //    html += '  <td>';
            //    html += '    <input style="padding:5px 10px 5px 10px;width:100px;" id="btnActivateOrgRolesConfiguration" type="button" value="  Activatex doesntwork  " onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'activateOrgRolesConfiguration\');" disabled />';
            //    //html += '    <input id="btnResetRaciConfiguration" type="button" value="  RESET  " onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'resetRaciConfiguration\');" />';
            //    html += '  </td>';
            //    html += '</tr>';
            //}




            // Publish message and button.
            html += '                           <tr>';
            html += '                               <td></td>';
            //html += '                               <td style="text-align:right;height:30pt;">'; // The height keeps the whole screen form moving around. WHEN NOT DISPLAYED THIS SHOULD SHRINK...????? <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            html += '                               <td style="text-align:right;">'; // The height keeps the whole screen form moving around. WHEN NOT DISPLAYED THIS SHOULD SHRINK...????? <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            html += '                                   <span id="spanThereAreChangesToPublishText" style="font-style:italic;color:tomato;"></span>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <span id="spanThereAreChangesToPublishButton"></span>';
            html += '                               </td>';
            html += '                           </tr>';



            html += '                       </table>';
            html += '                   </td>';
            html += '               </tr>';
            html += '           </table>';

            html += '       </td>';
            html += '       <td style="text-align:right;">';
            //html += '           <span class="printButton" title="print" onclick="cmdPrintForm();">&#x1f5a8;</span>';
            html += '       </td>';
            html += '   </tr>';
            html += '</table>';
            // End: Header with print button.

            this.renderOrgRolesEditor2(html, assignmentRowChanged_ElementId);

            this.selectOrganizationWorkflowOrRolesView_Onchange(); // This makes sure the top title sectin of the page is upo to date,.

        } catch (e) {
            console.log('Exception in renderOrgRolesEditor(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderOrgRolesEditor(): ' + e.message + ', ' + e.stack);
        }
    },


    expandOrCollapseAllWorkflowSteps: function () {
        try {
            console.log('In bwOrganizationEditor.js.expandOrCollapseAllWorkflowSteps().');
            ////alert('In expandOrCollapseAllWorkflowSteps(). This functionality is incomplete. Coming soon!');
            //var workflow;
            //var selectedRequestType = {
            //    Abbreviation: null,
            //    RequestType: null,
            //    bwRequestTypeId: null
            //}
            ////var selectedRequestType_text;
            //$('#selectWorkflowRequestTypeDropDown').find('option:selected').each(function (index, element) {
            //    selectedRequestType.Abbreviation = element.value;
            //    selectedRequestType.RequestType = element.text;
            //});

            //debugger;
            //if (this.options.CurrentWorkflow.length && this.options.CurrentWorkflow.length) {
            //    for (var i = 0; i < this.options.CurrentWorkflow.length; i++) {
            //        if ((this.options.CurrentWorkflow[i].bwRequestType == selectedRequestType.Abbreviation || this.options.CurrentWorkflow[i].bwRequestType == selectedRequestType.RequestType || this.options.CurrentWorkflow[i].bwRequestType == selectedRequestType.bwRequestTypeId) && this.options.CurrentWorkflow[i].bwWorkflowActive == true) {
            //            //debugger;
            //            // This is the workflow.
            //            workflow = this.options.CurrentWorkflow[i];
            //            break;
            //        }
            //    }
            //} else {
            //    if ((this.options.CurrentWorkflow.bwRequestType == selectedRequestType.Abbreviation || this.options.CurrentWorkflow.bwRequestType == selectedRequestType.RequestType || this.options.CurrentWorkflow.bwRequestType == selectedRequestType.bwRequestTypeId) && this.options.CurrentWorkflow.bwWorkflowActive == true) {
            //        //debugger;
            //        // This is the workflow.
            //        workflow = this.options.CurrentWorkflow;
            //    }
            //}
            //if (!workflow) {
            //    alert('Could not locate the workflow. This process cannot continue. xcx2354536.');
            //    //    for (var i = 0; i < this.options.CurrentWorkflow.length; i++) {
            //    //        if (this.options.CurrentWorkflow[i].bwRequestType == selectedRequestType_text && this.options.CurrentWorkflow[i].bwWorkflowActive == true) {
            //    //            //debugger;
            //    //            // This is the workflow.
            //    //            workflow = this.options.CurrentWorkflow[i];
            //    //            break;
            //    //        }
            //    //    }
            //} else {


            for (var i = 0; i < this.options.CurrentWorkflow.Workflow.Steps.Step.length; i++) {
                // $('.bwWorkflowEditor').bwWorkflowEditor('expandOrCollapseWorkflowStep', 'stepname_0', 'stepimage_0', 'steprow-create_0_0');
                var stepName = this.options.CurrentWorkflow.Workflow.Steps.Step[i]["@Name"];
                var rowId = 'stepname_' + i;
                var imageId = 'stepimage_' + i;
                var collapsibleRowId = 'steprow-' + stepName.toLowerCase() + '_' + i + '_' + '0';
                this.expandOrCollapseWorkflowStep(rowId, imageId, collapsibleRowId);
            }
            //}
        } catch (e) {
            console.log('Exception in expandOrCollapseAllWorkflowSteps(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in expandOrCollapseAllWorkflowSteps(): ' + e.message + ', ' + e.stack);
        }
    },


    renderOrgRolesEditor2: function (headerHtml, assignmentRowChanged_ElementId) {
        try {
            console.log('In bwOrganizationEditor.js.renderOrgRolesEditor2().');
            //alert('In bwOrganizationEditor.js.renderOrgRolesEditor2().');
            var thiz = this;

            //var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');


            //if (thiz.options.canvasElementId) {
            //    // Do nothing, it already exists.
            //} else {
            //var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            //    return v.toString(16);
            //});
            //thiz.options.elementIdSuffix = guid;
            //thiz.options.canvasElementId = 'canvasBusinessModelEditor_' + thiz.options.elementIdSuffix;
            var canvas = document.getElementById(thiz.options.canvasElementId);
            if (!canvas) {
                console.log('In bwOrganizationEditor.js.renderOrgRolesEditor2(). Adding the canvas element to the dom.');
                $(document.body).prepend('<canvas id="' + thiz.options.canvasElementId + '" class="canvasBwBusinessModelEditor" style="position:absolute;z-index:-1;border:1px solid aliceblue;"></canvas>');
                //$('#divPageContent3').prepend('<canvas id="' + this.options.canvasElementId + '" class="canvasBwBusinessModelEditor" style="position:absolute;z-index:-1;border:1px solid aliceblue;"></canvas>');
            }
            //}


            var html = '';

            //debugger;
            var json = this.options.store; //.OrgStructureAndRoles;
            var orgsImageFetchingInformation = [];

            if (headerHtml) {
                html = headerHtml; // display the header.
            }

            //html += 'Location Picker: <div id="divBwLocationPicker"></div>';






            //html += '<div style="display:none;" id="bwOrganizationEditor_divUndoOrgRolesActivationDialog">';
            //html += '  <table style="width:100%;">';
            //html += '    <tr>';
            //html += '      <td style="width:90%;">';
            //html += '        <span id="spanUndoOrgRolesActivationTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Organization UPDATED</span>';
            //html += '      </td>';
            //html += '      <td style="width:9%;"></td>';
            //html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
            //html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#bwOrganizationEditor_divUndoOrgRolesActivationDialog\').dialog(\'close\');">X</span>';
            //html += '      </td>';
            //html += '    </tr>';
            //html += '  </table>';
            //html += '  <br /><br />';
            //html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            //html += '  <span id="spanUndoOrgRolesActivationContent" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:20pt;">';
            //html += '    The organization has been updated. The changes will immediately impact the future workflow processes. ';
            //html += '    <br />';
            //html += '    <br />';
            //html += '    <br />';


            ////if (thiz.options.displayOrgRolesPicker == true) {
            ////    html += '    <span style="font-weight:bold;cursor:pointer;">'; // onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'undoWorkflowActivation\');">';
            ////    html += '       You can change the "Active OrgRoles" using the drop-down at the top of this page any time';
            ////    html += '       <br />';
            ////    html += '       <span style="color:tomato;font-weight:bold;">In saveOrgRolesConfigurationAndActivateAndUpdateParticipants(): WE NEED TO CHECK THE JSON FOR ParticipantIsDirty SO THAT WE UPDATE THE xx TABLE ACCORDINGLY!!!!</span>';
            ////    html += '       </span>';
            ////    html += '   </span>';
            ////}


            ////html += 'BIG CLOSE BUTTONxx';

            //html += '  <br /><br />';

            //html += '</div>';










            //alert('xcx23124-1. Calling displayOrgRoleEditorInACircle().');




            // PUTTING the workflow view next to the treeview
            //html += '<table id="tableOrgRoles1" style="border:1px solid green;">';
            html += '<table  class="context-menu-organizationeditor">';
            html += '   <tr>';
            html += '       <td style="vertical-align:top;">';
            html += '           <table>';
            html += '               <tr id="orgrow_d_g_e_l">';
            html += '                   <td></td>';
            html += '                   <td>';
            html += '                       <table style="padding-left:15px;">';
            html += '                           <tr>';
            html += '                               <td>';
            //html += '                                   <span id="spanRootTreeExpandCollapseButton" style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="">⚊ </span>';
            html += '                                   <span id="spanOrgX_root" class="orgTreeNode" style="cursor:pointer;white-space:nowrap;" onclick="window.scrollTo(0, 0);$(\'.bwCircleDialog2\').bwCircleDialog2(\'displayOrgRoleEditorInACircle\', true, \'' + 'root' + '\');" onmouseover="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflow\', true, \'root\');" onmouseout="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflowReset\', \'' + 'spanOrgX_root\', \'root\');">';
            html += '                                       <span style="font-weight:normal;">';



            html += '<img id="orgImage_root" style="width:70px;height:70px;vertical-align:middle;" src="' + this.options.operationUriPrefix + 'images/corporeal.png" />';

            // Use this to retrieve the images after the fact, farther below in this code.
            var orgImageFetchingInformation = {
                imageId: 'orgImage_root',
                bwOrgId: 'root'
            };
            orgsImageFetchingInformation.push(orgImageFetchingInformation);

            //debugger;
            html += '&nbsp;&nbsp;</span><span style="font-size:15pt;white-space:nowrap;">' + json.Global.Name + '</span> ';
            html += '                                   </span> ';
            html += '                       <span id="spanWorkflowPeoplePicker_' + 'root' + '"></span>';
            html += '                    </td>';
            html += '               </tr>';





            html += '<tr>';
            html += '<td>';
            // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            html += '                               <span id="spanDivisionsTreeExpandCollapseButton" style="cursor:pointer;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'collapseOrExpandTree\', \'\', \'spanDivisionsTreeExpandCollapseButton\', \'root\');">';
            //html += '                               ⚊ ';
            html += '                               <img title="collapse" style="cursor:pointer;width:23px;height:23px;vertical-align:middle;" src="images/drawer-close.png"> ';
            html += '                               </span>';
            html += '                               <span id="spanOrgX_' + d + '_' + 'GroupsNode' + '" class="orgTreeNode" style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'collapseTree\', \'\', \'' + '' + '\');" onmouseout="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflowReset\', \'' + 'spanOrgX_' + d + '_' + 'GroupsNode' + '\', \'' + '' + '\', \'' + 'GroupsNode' + '\');" onmouseover="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflow\', true, \'' + '' + '\', \'' + 'GroupsNode' + '\');">';
            //html += '                               ◍ Divisions ◍  ';
            html += '                               Divisions &nbsp;&nbsp; ';
            html += '                               </span>';
            //html += '                               <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;text-decoration:underline;" title="Add a Division..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'addADivision\', \'' + '' + '\', \'' + '' + '\', \'' + '' + '\', \'' + '' + '\');">';
            //html += '                               ✚ New';
            //html += '                               </span>';
            html += '</td>';
            html += '</tr>';




            //alert('xcx23124-2. Calling displayOrgRoleEditorInACircle().');




            //debugger;
            for (var d = 0; d < json.Global.Divisions.Items.length; d++) {
                html += '           <tr>';
                html += '               <td id="rootDivisionCell" style="padding-left:40px;white-space:nowrap;">';

                html += '<span id="spanDivisionTreeExpandCollapseButton_' + d + '" style="cursor:pointer;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'collapseOrExpandTree\', \'\', \'spanDivisionTreeExpandCollapseButton_' + d + '\', \'' + d + '\');">';
                //html += '⚊';
                html += '<img title="collapse" style="cursor:pointer;width:23px;height:23px;vertical-align:middle;" src="images/drawer-close.png">';
                html += '</span>';

                html += ' <span id="spanOrgX_' + d + '" class="orgTreeNode" style="cursor:pointer;white-space:nowrap;" onclick="window.scrollTo(0, 0);$(\'.bwCircleDialog2\').bwCircleDialog2(\'displayOrgRoleEditorInACircle\', true, \'' + d + '\');" onmouseover="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflow\', true, \'' + d + '\');" onmouseout="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflowReset\', \'' + 'spanOrgX_' + d + '\', \'' + d + '\');">';


                html += '<img id="orgImage_' + json.Global.Divisions.Items[d].Id + '" style="width:60px;height:60px;vertical-align:middle;" src="' + this.options.operationUriPrefix + 'images/corporeal.png" />';
                // Use this to retrieve the images after the fact, farther below in this code.
                var orgImageFetchingInformation = {
                    imageId: 'orgImage_' + json.Global.Divisions.Items[d].Id,
                    bwOrgId: json.Global.Divisions.Items[d].Id
                };
                orgsImageFetchingInformation.push(orgImageFetchingInformation);



                html += '    ' + json.Global.Divisions.Items[d].Name + '  ';
                html += '</span>';
                html += '  <span id="spanWorkflowPeoplePicker_' + d + '"></span>';
                html += '               </td>';
                html += '           </tr>';




                html += '           <tr id="trDivisionGroups_' + d + '">'; // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 1-29-20208-02am ast




                html += '               <td style="padding-left:40px;white-space:nowrap;">';
                html += '                   <table style="padding-left:15px;">';
                if (json.Global.Divisions.Items[d].Groups.Style == 'display:none;') {
                    html += '                       <tr>';
                    html += '                           <td>';
                    html += '                               <span style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'expandTree\', \'' + d + '\');">';
                    html += '✚ ✣ Groups ✣  </span>';
                    //html += '                               <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;text-decoration:underline;" title="Add a Group..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'addAGroup\', \'' + json.Global.Divisions.Items[d].Id + '\', \'' + d + '\', \'' + g + '\', \'' + e + '\');"> ✚ Add</span>';
                    html += '                           </td>';
                    html += '                       </tr>';
                } else {
                    html += '                       <tr>';
                    html += '                           <td>';








                    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                    html += '                               <span id="spanGroupsTreeExpandCollapseButton_' + d + '" style="cursor:pointer;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'collapseOrExpandTree\', \'groupsnode\', \'spanGroupsTreeExpandCollapseButton_' + d + '\', \'' + d + '\');">';
                    //html += '                               ⚊ ';
                    html += '<img title="collapse" style="cursor:pointer;width:23px;height:23px;vertical-align:middle;" src="images/drawer-close.png" />';
                    html += '                               </span>';
                    //html += '                               <span id="spanOrgX_' + d + '_' + 'GroupsNode' + '" class="orgTreeNode" style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'collapseTree\', \'\', \'' + d + '\');" onmouseout="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflowReset\', \'' + 'spanOrgX_' + d + '_' + 'GroupsNode' + '\', \'' + d + '\', \'' + 'GroupsNode' + '\');" onmouseover="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflow\', true, \'' + d + '\', \'' + 'GroupsNode' + '\');">';
                    html += '                               <span id="spanOrgX_' + d + '_' + 'GroupsNode' + '" class="orgTreeNode" style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'collapseTree\', \'\', \'' + d + '\');" >';

                    html += 'Groups  &nbsp;&nbsp; ';
                    html += '                               </span>';
                    //html += '                               <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;text-decoration:underline;" title="Add a Group..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'addAGroup\', \'' + json.Global.Divisions.Items[d].Id + '\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">';
                    //html += '                               ✚ New';
                    //html += '                               </span>';








                    html += '                           </td>';
                    html += '                       </tr>';
                    for (var g = 0; g < json.Global.Divisions.Items[d].Groups.Items.length; g++) {

                        html += '                   <tr>'; // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

                        html += '                       <td style="padding-left:40px;">';
                        //html += '                           ✣ ' + json.Global.Divisions.Items[d].Groups.Items[g].Name + ' ✣ ';



                        // New expand/collapse 3-7-2020
                        html += '                               <span id="spanGroupTreeExpandCollapseButton_' + d + '_' + g + '" style="cursor:pointer;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'collapseOrExpandTree\', \'\', \'spanGroupTreeExpandCollapseButton_' + d + '_' + g + '\', \'' + d + '\', \'' + g + '\');">';
                        html += '<img title="collapse" style="cursor:pointer;width:23px;height:23px;vertical-align:middle;" src="images/drawer-close.png" />';
                        html += '                               </span>';


                        //alert('xcx23124-3. Calling displayOrgRoleEditorInACircle().');


                        html += '                                   <span id="spanOrgX_' + d + '_' + g + '" class="orgTreeNode" style="cursor:pointer;" onclick="window.scrollTo(0, 0);$(\'.bwCircleDialog2\').bwCircleDialog2(\'displayOrgRoleEditorInACircle\', true, \'' + d + '\', \'' + g + '\');" onmouseover="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflow\', true, \'' + d + '\', \'' + g + '\');" onmouseout="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflowReset\', \'' + 'spanOrgX_' + d + '_' + g + '\', \'' + d + '\', \'' + g + '\');">';



                        html += '<img id="orgImage_' + json.Global.Divisions.Items[d].Groups.Items[g].Id + '" style="width:50px;height:50px;vertical-align:middle;" src="' + this.options.operationUriPrefix + 'images/corporeal.png" />';
                        // Use this to retrieve the images after the fact, farther below in this code.
                        var orgImageFetchingInformation = {
                            imageId: 'orgImage_' + json.Global.Divisions.Items[d].Groups.Items[g].Id,
                            bwOrgId: json.Global.Divisions.Items[d].Groups.Items[g].Id
                        };
                        orgsImageFetchingInformation.push(orgImageFetchingInformation);










                        html += '&nbsp;' + json.Global.Divisions.Items[d].Groups.Items[g].Name + '';





                        //html += '  <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'editGroup\', \'' + d + '\', \'' + g + '\');">✎<span style="text-decoration:underline;">Edit</span></span>';
                        //html == '  <br />';
                        //html += '                                       <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgEditorInACircle\', \'' + d + '\', \'' + g + '\');">👤👤🔍';
                        //html += '<span style="text-decoration:underline;"></span>';
                        //html += '</span>';

                        html += '                                </span>';
                        html += '  <span id="spanWorkflowPeoplePicker_' + d + '_' + g + '"></span>';

                        html += '                       </td>';
                        html += '                   </tr>';
                        html += '                   <tr  id="trDivisionGroupsGroup_' + d + '_' + g + '">';
                        html += '                       <td style="padding-left:40px;white-space:nowrap;">';
                        html += '                           <table style="padding-left:15px;">';
                        if (json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Style == 'display:none;') {
                            html += '                               <tr>';
                            html += '                                   <td>';
                            html += '                               <span style="cursor:pointer;font-weight:bold;white-space:nowrap;" title="Collapse..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'expandTree\', \'' + d + '\', \'' + g + '\');">';
                            html += '✚ ⚖ Legal Entities  </span>';
                            //html += '                                       <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;text-decoration:underline;" title="Add a Legal Entity..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'addALegalEntity\', \'' + json.Global.Divisions.Items[d].Groups.Items[g].Id + '\', \'' + d + '\', \'' + g + '\', \'' + e + '\');"> ✚ New</span>';
                            html += '                                   </td>';
                            html += '                               </tr>';
                        } else {
                            html += '                               <tr>';
                            html += '                                   <td style="white-space:nowrap;font-weight:bold;">';
                            html += '                                       <span id="spanLegalEntitiesTreeExpandCollapseButton_' + d + '_' + g + '" style="cursor:pointer;font-weight:bold;white-space:nowrap;" title="Collapse..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'collapseOrExpandTree\', \'legalentitiesnode\', \'spanLegalEntitiesTreeExpandCollapseButton_' + d + '_' + g + '\', \'' + d + '\', \'' + g + '\');">';
                            //html += '                                       ⚊ ';
                            html += '<img title="collapse" style="cursor:pointer;width:23px;height:23px;vertical-align:middle;" src="images/drawer-close.png">';
                            html += '                                       </span>';
                            html += 'Legal Entities &nbsp;&nbsp; ';
                            //html += '                                       </span>';
                            //html += '                                       <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;text-decoration:underline;" title="Add a Legal Entity..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'addALegalEntity\', \'' + json.Global.Divisions.Items[d].Groups.Items[g].Id + '\', \'' + d + '\', \'' + g + '\', \'' + e + '\');"> ✚ New</span>';
                            html += '                                   </td>';
                            html += '                               </tr>';
                            for (var e = 0; e < json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items.length; e++) {
                                html += '                           <tr id="trDivisionGroupsGroupLegalEntities_' + d + '_' + g + '_' + e + '">';
                                html += '                               <td style="padding-left:40px;">';





                                //html += '<span style="cursor:pointer;" onclick="alert(\'This functionality is incomplete. Coming soon! Collapse this legal entity!\');">';
                                ////html += '                                 ⚊';
                                //html += '<img title="collapse" style="cursor:pointer;width:23px;height:23px;vertical-align:middle;" src="images/drawer-close.png">';
                                //html += '</span>';


                                // new 3-7-2020
                                html += '                               <span id="spanGroupsTreeExpandCollapseButton_' + d + '_' + g + '_' + e + '" style="cursor:pointer;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'collapseOrExpandTree\', \'\', \'spanGroupsTreeExpandCollapseButton_' + d + '_' + g + '_' + e + '\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">';
                                //html += '                               ⚊ ';
                                html += '<img title="collapse" style="cursor:pointer;width:23px;height:23px;vertical-align:middle;" src="images/drawer-close.png" />';
                                html += '                               </span>';

                                //alert('xcx23124-4. Calling displayOrgRoleEditorInACircle().');



                                // #29685F galapagos green
                                html += '   <span id="spanOrgX_' + d + '_' + g + '_' + e + '" class="orgTreeNode" style="cursor:pointer;color:#29685F;white-space:nowrap;" onclick="window.scrollTo(0, 0);$(\'.bwCircleDialog2\').bwCircleDialog2(\'displayOrgRoleEditorInACircle\', true, \'' + d + '\', \'' + g + '\', \'' + e + '\');" onmouseover="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflow\', true, \'' + d + '\', \'' + g + '\', \'' + e + '\');" onmouseout="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflowReset\', \'' + 'spanOrgX_' + d + '_' + g + '_' + e + '\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">';




                                html += '<img id="orgImage_' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Id + '" style="width:40px;height:40px;vertical-align:middle;" src="' + this.options.operationUriPrefix + 'images/corporeal.png" />';
                                // Use this to retrieve the images after the fact, farther below in this code.
                                var orgImageFetchingInformation = {
                                    imageId: 'orgImage_' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Id,
                                    bwOrgId: json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Id
                                };
                                orgsImageFetchingInformation.push(orgImageFetchingInformation);


                                //alert('xcx23124-5. Calling displayOrgRoleEditorInACircle().');

                                html += '&nbsp;' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Name + '';

                                //html += '  <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'editLegalEntity\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">✎<span style="text-decoration:underline;">Edit</span></span>';
                                //html == '  <br />';
                                //html += '       <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgEditorInACircle\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">👤👤🔍</span>';

                                html += '  </span>';
                                html += '  <span id="spanWorkflowPeoplePicker_' + d + '_' + g + '_' + e + '"></span>';

                                html += '                               </td>';
                                html += '                           </tr>';
                                html += '                           <tr id="trDivisionGroupsGroupLegalEntitiesLocations_' + d + '_' + g + '_' + e + '" >';
                                html += '                               <td style="padding-left:15px;white-space:nowrap;">';
                                html += '                                   <table style="padding-left:15px;">';
                                if (json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Style == 'display:none;') {
                                    html += '                                   <tr>';
                                    html += '                                       <td>';
                                    html += '                               <span style="cursor:pointer;font-weight:bold;" title="Expand Locations" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'expandTree\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">';
                                    html += ' ✚ 🏠 Locations </span>';
                                    //html += '                                           <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;" title="Add a Location..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'addALocation\', \'' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Id + '\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">✚ New</span>';
                                    html += '                                       </td>';
                                    html += '                                   </tr>';
                                } else {
                                    html += '                                   <tr>';
                                    html += '                                       <td style="padding-left:45px;white-space:nowrap;">';
                                    html += '                               <span style="cursor:pointer;font-weight:bold;" title="Collapse Locations" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'collapseTree\', \'\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">';
                                    //html += '<img title="collapse" style="cursor:pointer;width:23px;height:23px;vertical-align:middle;" src="images/drawer-close.png" />';
                                    html += 'Locations &nbsp;&nbsp; </span>';
                                    //html += '                                           <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;" title="Add a Location..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'addALocation\', \'' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Id + '\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">✚ New</span>';
                                    html += '                                       </td>';
                                    html += '                                   </tr>';
                                    for (var l = 0; l < json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items.length; l++) {
                                        html += '                               <tr style="' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Style + '">';
                                        html += '                                   <td style="padding-left:60px;white-space:nowrap;">';
                                        html += '<span style="white-space:nowrap;">';
                                        html += '                                   <span id="spanOrgX_' + d + '_' + g + '_' + e + '_' + l + '" class="orgTreeNode" style="cursor:pointer;white-space:nowrap;" onclick="window.scrollTo(0, 0);$(\'.bwCircleDialog2\').bwCircleDialog2(\'displayOrgRoleEditorInACircle\', true, \'' + d + '\', \'' + g + '\', \'' + e + '\', \'' + l + '\');" onmouseover="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflow\', true, \'' + d + '\', \'' + g + '\', \'' + e + '\', \'' + l + '\');" onmouseout="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflowReset\', \'' + 'spanOrgX_' + d + '_' + g + '_' + e + '_' + l + '\', \'' + d + '\', \'' + g + '\', \'' + e + '\', \'' + l + '\');">';




                                        //html += '<img id="orgImage_' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Id + '" style="width:30px;height:30px;" src="' +this.options.operationUriPrefix + 'images/corporeal.png" />';
                                        // Use this to retrieve the images after the fact, farther below in this code.
                                        var orgImageFetchingInformation = {
                                            imageId: 'orgImage_' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Id,
                                            bwOrgId: json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Id,
                                            spanOrgId: 'spanOrgImage_' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Id,
                                        };
                                        orgsImageFetchingInformation.push(orgImageFetchingInformation);

                                        html += '<span style="vertical-align:middle;" id="spanOrgImage_' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Id + '" >';
                                        //html += '  <img id="orgImage_' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Id + '" style="width:30px;height:30px;" src="' + this.options.operationUriPrefix + 'images/corporeal.png" />';
                                        html += '  🏠 ';
                                        html += '</span>';
                                        html += '&nbsp;' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Name;
                                        //html += ' 🏠 ';

                                        //html += '🏠 ' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Name + ' 🏠 ';
                                        html += '                                   </span>';
                                        html += '   <span id="spanWorkflowPeoplePicker_' + d + '_' + g + '_' + e + '_' + l + '" style="white-space:nowrap;"></span>';

                                        html += '</span>';
                                        html += '                                   </td>';
                                        html += '                               </tr>';
                                    }
                                }
                                html += '                                   </table>';
                                html += '                               </td>';
                                html += '                           </tr>';
                            }
                        }
                        html += '                           </table>';
                        html += '                       </td>';
                        html += '                   </tr>';
                    }
                }
                html += '                   </table>';
                html += '               </td>';
                html += '           </tr>';
            }
            html += '           </table>';
            html += '       </td>';
            html += '   </tr>';
            html += '</table>';

            html += '    </td>';
            html += '    <td style="vertical-align:top;width:100px;height:100%;">';
            html += '    </td>';
            html += '    <td id="workflowcontainer1" style="vertical-align:top;">';







            // Display workflow picker.
            if (thiz.options.displayWorkflowPicker) {
                html += '<table>';

                html += '<tr>';
                html += '  <td>';
                // Create the drop down at the top of the page, and select the last used option!

                //var bwEnabledRequestTypes = $('.bwAuthentication').bwAuthentication('option', 'bwEnabledRequestTypes');
                //var requestTypes = bwEnabledRequestTypes.EnabledItems;

                //var bwLastSelectedNewRequestType = 'capitalplanproject';

                //
                //
                // Pu thtis back when we want to put the roles here as well as the workflow!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! took out 2-13-2020 just to keep the UI clean for now.
                //if (requestTypes.length == 1) { // If there is only one, don't display as a drop down, just as plain text.
                //    html += '<span style="font_weight:bold;color:grey;">';
                //    html += '<input type="radio" name="orgRoleOrWorkflowRadioButtonList" />&nbsp;Roles<br /><br /><input type="radio" name="orgRoleOrWorkflowRadioButtonList" checked />&nbsp;Workflow      ';
                //    html += '</span>';
                //} else { // There is more than 1, so we have to display as a drop down.
                //    html += '<span style="font_weight:bold;color:grey;">';
                //    html += '<input type="radio" name="orgRoleOrWorkflowRadioButtonList" />&nbsp;Roles<br /><br /><input type="radio" name="orgRoleOrWorkflowRadioButtonList" checked />&nbsp;Workflow      ';
                //    html += '</span>';
                //}
                html += '  </td>';
                html += '  <td>';


                html += '<span style="font_weight:bold;color:grey;">';
                html += '   Displaying: ';
                // Changing to radio buttons 4-7-2020.
                html += '   <input type="radio" id="selectOrganizationWorkflowOrRolesView_RolesAndParticipants" name="selectOrganizationWorkflowOrRolesView" onchange="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'selectOrganizationWorkflowOrRolesView_Onchange\');" />&nbsp;Roles and Participants';
                html += '   &nbsp;&nbsp';
                html += '   <input type="radio" id="selectOrganizationWorkflowOrRolesView_Workflow" name="selectOrganizationWorkflowOrRolesView" checked onchange="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'selectOrganizationWorkflowOrRolesView_Onchange\');" />&nbsp;Workflows      ';



                var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');
                if (developerModeEnabled == true) {
                    // NEW FEATURE! Requests broken down by request type, with lines drawing from the Orgs. 4-18-2020.
                    html += '   &nbsp;&nbsp';
                    html += '   <input type="radio" id="selectOrganizationWorkflowOrRolesView_Workflowxx" name="selectOrganizationWorkflowOrRolesViewxx" onchange="alert(\'This functionality is incomplete. Coming soon! Requests broken down by request type, with lines drawing from the Orgs.\');this.checked = false;" />&nbsp;Requests      ';
                }





                html += '</span>';
                html += '&nbsp;&nbsp;&nbsp;&nbsp;';

                //var requestTypes = $('.bwAuthentication').bwAuthentication('option', 'bwEnabledRequestTypes').EnabledItems; // Global, populated in the beginning when the app loads.
                //if (requestTypes.length == 1) { // If there is only one, don't display as a drop down, just as plain text.
                //    html += '<span style="font_weight:bold;color:grey;">Request Type: </span>';
                //} else { // There is more than 1, so we have to display as a drop down.
                //    html += '<span style="font_weight:bold;color:grey;">Select Request Type: </span>';
                //}
                //debugger;
                // Render the drop down at the top of the page, and select the last used option!
                //if (requestTypes.length == 1) { // If there is only one, don't display as a drop down, just as plain text.
                //    //html += '<span style="font_weight:bold;color:grey;"><strong>' + requestTypes[0].SingletonName + '</strong></span>';

                //    html += '<span style="font_weight:bold;color:grey;"><strong>';
                //    html += '   <select id="selectRequestTypeDropDown" onchange="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'WorkflowRequestTypeDropDown_Onchange\');" style=\'display:inline;border-color: whitesmoke; color: grey; font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 14pt; font-weight: bold; cursor: pointer;\'>'; // was .5em
                //    for (var i = 0; i < requestTypes.length; i++) {
                //        var selected = '';
                //        //if (requestTypes[i].Abbreviation == bwLastSelectedNewRequestType) { // Selected
                //        //    selected = 'selected';
                //        //}
                //        html += '<option value="' + requestTypes[i].bwRequestTypeId + '" ' + selected + ' >' + requestTypes[i].SingletonName + '</option>';
                //    }
                //    html += '   </select>';
                //    html += '</span>';

                //} else { // There is more than 1, so we have to display as a drop down.
                //html += '<span style="font_weight:bold;color:grey;"><strong>';
                //html += '   <select id="selectRequestTypeDropDown" onchange="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'WorkflowRequestTypeDropDown_Onchange\');" style=\'display:inline;border-color: whitesmoke; color: grey; font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 14pt; font-weight: bold; cursor: pointer;\'>'; // was .5em
                //for (var i = 0; i < requestTypes.length; i++) {
                //    var selected = '';
                //    //if (requestTypes[i].Abbreviation == bwLastSelectedNewRequestType) { // Selected
                //    //    selected = 'selected';
                //    //}
                //    html += '<option value="' + requestTypes[i].bwRequestTypeId + '" ' + selected + ' >' + requestTypes[i].SingletonName + '</option>';
                //}
                //html += '   </select>';
                //html += '</span>';
                //}

















                //html += '&nbsp;&nbsp;<span style="font-weight:normal;font-style:italic;color:grey;"><input id="WorkflowForAllRequestTypesCheckbox" type="checkbox" checked="checked" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'WorkflowForAllRequestTypesCheckbox_Onchange\');" />All request types inherit this workflow</span>';

                html += '  </td>';
                html += '</tr>';
                // 
                html += '<tr>';
                html += '  <td>';
                html += '  </td>';
                html += '  <td>';
                html += '    <span id="spanWorkflowsDropDownList"></span>';
                html += '  </td>';
                html += '</tr>';

                html += '</table>';
            }
            // End: Display workflow picker.




            // Display the bwWorkflowId guid and request type
            //html += '<span id="spanWorkflowGuidAndRequestTypeForTesting" style="color:gainsboro;"></span>'; //' + car.bwWorkflowId + ' (' + car.bwRequestType + ')' + '</span>';
            //html += '<br />';






            html += '      <span id="spanWorkflowPeoplePicker_right"><span style="font-style:italic;color:tomato;">Rendering...</span></span>';
            html += '    </td>';
            html += '  </tr>';
            html += '</table>';

            html += '<br />';
            html += '<br />';
            html += '<br />';
            html += '<br />';

            html += '<div style="height:100vh;"></div>';

            //debugger; // 9-6-2021 shouldn't this be included for the division edit button?
            if (thiz.options.DisplayAsNewTenantUserConfigurationEditor == true) { // Since we instantiate this widget twice, doing this prevents duplicate DOM object.
                html += '<div style="display:none;" id="divAddAnOrgItemDialog2">';
                html += '   <table style="width:100%;">';
                html += '       <tr>';
                html += '           <td style="width:90%;">';
                html += '               <span id="spanAddAnOrgItemDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">[spanAddAnOrgItemDialogTitle]</span>';
                html += '           </td>';
                html += '           <td style="width:9%;"></td>';
                html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
                html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divAddAnOrgItemDialog2\').dialog(\'close\');">X</span>';
                //html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(this).dialog(\'close\');">X</span>';
                html += '           </td>';
                html += '       </tr>';
                html += '   </table>';
                html += '   <br /><br />';
                html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                html += '   <span id="spanAddAnOrgItemDialogInvitationDescriptionText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;"></span>';
                html += '   <span style="font-family: calibri;">Name</span>';
                html += '   <br />';
                html += '   <input type="text" id="txtAddAnOrgItemDialogName" style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />';
                html += '   <br /><br />';
                html += '   <span style="font-family: calibri;">Abbreviation</span>';
                html += '   <br />';
                html += '   <input type="text" id="txtAddANewPersonDialogAbbreviation" style="width:25%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />';
                html += '   <br /><br />';
                html += '   <span style="font-family: calibri;">Id</span>';
                html += '   <br />';
                html += '   <input id="txtAddANewPersonDialogId" type="text" disabled style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" /><br />';
                //html += '   <br /><br />';
                //html += '   <span style="white-space:nowrap;"><input id="checkboxAddANewPersonDialogActive" type="checkbox" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />Active</span>';
                html += '   <br /><br /><br />';
                html += '   <div id="divAddAnOrgItemDialogSubmitButton" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
                html += '       Add the xx';
                html += '   </div>';

                html += '   <br /><br />';
                html += '   <div id="divDeleteAnOrgItemDialogSubmitButton" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
                html += '       Delete';
                html += '   </div>';

                html += '   <br /><br />';
                html += '   <div class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;" onclick="$(\'#divAddAnOrgItemDialog2\').dialog(\'close\');">';
                html += '       Close';
                html += '   </div>';
                html += '   <br /><br />';
                html += '</div>';
            }




            html += '<div style="display:none;" id="divRoleMultiPickerDialog2">';
            html += '  <table style="width:100%;">';
            html += '    <tr>';
            html += '      <td style="width:90%;">';
            html += '        <span id="spanRoleMultiPickerDialogTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Roles</span>';
            html += '      </td>';
            html += '      <td style="width:9%;"></td>';
            html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divRoleMultiPickerDialog2\').dialog(\'close\');">X</span>';
            html += '      </td>';
            html += '    </tr>';
            html += '  </table>';
            html += '  <br /><br />';
            html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '  <span id="spanRoleMultiPickerDialogContent" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:20pt;"></span><br />';
            html += '  <br /><br />';
            html += '  <input type="button" value="SAVE" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'projectTypeMultiPickerDialog_RenderResults\');" />';
            html += '  <br /><br />';
            html += '</div>';

            //html += '<div style="display:none;" id="bwOrganizationEditor_divUndoOrgRolesActivationDialog">';
            //html += '  <table style="width:100%;">';
            //html += '    <tr>';
            //html += '      <td style="width:90%;">';
            //html += '        <span id="spanUndoOrgRolesActivationTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Organization UPDATED</span>';
            //html += '      </td>';
            //html += '      <td style="width:9%;"></td>';
            //html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
            //html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#bwOrganizationEditor_divUndoOrgRolesActivationDialog\').dialog(\'close\');">X</span>';
            //html += '      </td>';
            //html += '    </tr>';
            //html += '  </table>';
            //html += '  <br /><br />';
            //html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            //html += '  <span id="spanUndoOrgRolesActivationContent" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:20pt;">';
            //html += '    The organization has been updated. The changes will immediately impact the future workflow processes. ';
            //html += '    <br />';
            //html += '    <br />';
            //html += '    <br />';


            //if (thiz.options.displayOrgRolesPicker == true) {
            //    html += '    <span style="font-weight:bold;cursor:pointer;">'; // onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'undoWorkflowActivation\');">';
            //    html += '       You can change the "Active OrgRoles" using the drop-down at the top of this page any time';
            //    html += '       <br />';
            //    html += '       <span style="color:tomato;font-weight:bold;">In saveOrgRolesConfigurationAndActivateAndUpdateParticipants(): WE NEED TO CHECK THE JSON FOR ParticipantIsDirty SO THAT WE UPDATE THE xx TABLE ACCORDINGLY!!!!</span>';
            //    html += '       </span>';
            //    html += '   </span>';
            //}


            ////html += 'BIG CLOSE BUTTONxx';

            //html += '  <br /><br />';

            //html += '</div>';







            html += '<div id="divOrgRoleSummaryDialog" style="display:none;height:300px;width:400px;border:1px solid #066b8b;background-color:white;position:absolute;z-index:10;">'; // Scrollable div wrapper for the role picker. // dark blue border. // position and z-index makes it show up on top and to not move the other elements around.






            //debugger;
            // Render the html.
            //thiz.element.html(html);
            $('#divPageContent3').html(html);








            if (thiz.options.DisplayAsNewTenantUserConfigurationEditor == true) {
                //debugger;
                var html = '';
                html += '  <textarea id="txtNewUserOrganizationModelJSON" rows="90" cols="100" style="padding-top:4px;font-size:8pt;"></textarea>';
                //html += '  <pre id="txtDisplayJsonDialogJSON" style="overflow:auto;padding-top:4px;font-size:8pt;width:98%;height:300px;border:1px solid gainsboro;"></pre>';

                //document.getElementById('workflowcontainer1').innerHTML = html;
                //document.getElementById('txtNewUserOrganizationModelJSON').innerHTML = JSON.stringify(thiz.options.store, null, 2);
                //debugger;
                console.log('In bwOrganizationEditor.js.xx(). DISPLAYING JSON!!!xcx1');
                $(thiz.element).find('#workflowcontainer1')[0].innerHTML = html;
                $(thiz.element).find('#txtNewUserOrganizationModelJSON')[0].innerHTML = JSON.stringify(thiz.options.store, null, 2);

            }



            //debugger; // is DisplayAsNewTenantUserConfigurationEditor getting set??
            if (thiz.options.DisplayAsNewTenantUserConfigurationEditor != true) {
                //// Use this to retrieve the images after the fact, farther below in this code.
                //var orgImageFetchingInformation = {
                //    imageId: 'orgImage_root',
                //    bwOrgId: 'root'
                //};
                //orgsImageFetchingInformation.push(orgImageFetchingInformation);

                //
                // Render the custom Org images
                //
                for (var i = 0; i < orgsImageFetchingInformation.length; i++) {
                    if (orgsImageFetchingInformation[i].bwOrgId) {
                        //debugger;
                        var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                            return v.toString(16);
                        });

                        //var imagePath = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/orgimages/' + orgsImageFetchingInformation[i].bwOrgId + '/' + 'orgimage.png?v=' + imageVersionGuid; // + guid;

                        var imagePath;

                        var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

                        if (activeStateIdentifier.status != 'SUCCESS') {

                            imagePath = '[No image. Unauthorized. xcx213124-34556-2354235]';

                        } else {

                            //html += '<img id="attachmentstest1" xcx="xcx2312-2-2" src="' + thiz.options.operationUriPrefix + fileUrl_Thumbnail + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;max-width:250px;border:1px solid gray;border-radius:0 30px 0 0;" alt="" ';
                            if (!workflowAppId) {
                                alert('ERROR xcx5554334423');
                            }
                            imagePath = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/orgimages/' + orgsImageFetchingInformation[i].bwOrgId + '/' + 'orgimage.png?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;

                        }









                        var lookForOrgImage = function (imagePath, i) {
                            return new Promise(function (resolve, reject) {
                                $.get(imagePath).done(function () {
                                    var img = new Image();
                                    img.src = imagePath;
                                    img.onload = function (e) {
                                        try {

                                            var html = '';
                                            html += '<img id="orgImage_' + '' + '" style="width:30px;height:30px;vertical-align:middle;" src="' + imagePath + '" />';
                                            //This element might not exist!
                                            try {
                                                //debugger;
                                                document.getElementById(orgsImageFetchingInformation[i].spanOrgId).innerHTML = html; //imagePath;
                                                resolve();
                                            } catch (e) {
                                                // ACTUALLY WE SHOUDL BE LOADING THE ELEMENT HERE MAYBE? IT USED TO WORK! 2-5-2020
                                                document.getElementById(orgsImageFetchingInformation[i].imageId).src = imagePath;
                                                //console.log('Exception in bwOrganizationEditor.js.renderOrgRolesEditor(): span tag with id="' + orgsImageFetchingInformation[i].spanOrgId + '" does not exist! ' + e.message + ', ' + e.stack);
                                                resolve();
                                            }

                                        } catch (e) {
                                            console.log('Exception in bwOrganizationEditor.js.xx-1().img.onload(): ' + e.message + ', ' + e.stack);
                                            //alert('Exception in xx().img.onload(): ' + e.message + ', ' + e.stack);
                                            reject();
                                        }
                                    }
                                }).fail(function () {
                                    // do nothing, it just didn't find an image.
                                    resolve();
                                });
                            });
                        }
                        lookForOrgImage(imagePath, i);
                    }
                }



            }






            thiz.checkIfWeHaveToDisplayThePublishChangesButton();

            if (thiz.options.displayOrgRolesPicker) {
                thiz.renderOrgRolesDropDownList();
            }


            if (thiz.options.DisplayAsNewTenantUserConfigurationEditor != true) {

                try {
                    // This may be able to go elsewhere.?
                    var options = {
                        //bwTenantId: tenantId,
                        bwWorkflowAppId: workflowAppId,
                        bwParticipantId: participantId,
                        bwParticipantEmail: participantEmail,
                        bwParticipantFriendlyName: participantFriendlyName,
                        bwEnabledRequestTypes: bwEnabledRequestTypes
                    };
                    var $bwLocationPicker = $("#divBwLocationPicker").bwLocationPicker(options);
                } catch (e) {
                    console.log('Caught Exception in bwOrganizationEditor.js.renderOrgRolesEditor2(). bwLocationPicker.js may not have loaded yet.. race condition perhaps. ');
                    alert('Caught Exception in bwOrganizationEditor.js.renderOrgRolesEditor2(). bwLocationPicker.js may not have loaded yet.. race condition perhaps. ');
                }
            }


            // RIGHT-CLICK FUNCTIONALITY!!
            // This is our ellipsis context menu. MIT license and code at: https://swisnl.github.io/jQuery-contextMenu/demo/trigger-custom.html // event.stopImmediatePropagation()
            var button = document.getElementById('spanBusinessEditorEllipsesContextMenu'); //.getElementsByClassName('context-menu-organizationeditor');
            //for(var i = 0; i < buttons.length; i++) {
            $(button).on('click', function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                $(this).contextMenu();
                // or $('.context-menu-one').trigger("contextmenu");
                // or $('.context-menu-one').contextMenu({x: 100, y: 100});
            });
            //}
            //

            if (thiz.options.DisplayAsNewTenantUserConfigurationEditor != true) {

                var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');
                if (developerModeEnabled == true) {

                    // This is our right-click context menu. MIT license and code at: https://swisnl.github.io/jQuery-contextMenu/demo/trigger-custom.html
                    $.contextMenu({
                        selector: '.context-menu-organizationeditor',
                        callback: function (key, options) {
                            //var m = "clicked: " + key;
                            //window.console && console.log(m) || alert(m);
                            if (key == 'viewtrashbincontents') {
                                //alert('This functionality is incomplete. Coming soon!');
                                cmdDisplayArchivePageTrashbinContents();
                            } else if (key == 'editorganizationjson') {
                                //alert('This functionality is incomplete. Coming soon! xcx2316794');
                                thiz.editOrganizationJson();
                            } else if (key == 'viewextendedinformation') {
                                //alert('This functionality is incomplete. Coming soon!');
                                cmdDisplayArchivePageExtendedInformation();
                            } else if (key == 'organizationjsondiagnostics') {
                                thiz.downloadOrganizationJson();
                                //$('.bwCoreComponent').bwCoreComponent('downloadOrganizationJson');
                            } else if (key == 'vieworganizationroles') {
                                $('.bwCoreComponent').bwCoreComponent('displayEditRolesDialog'); // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                            } else if (key == 'importorganizationdata') {
                                thiz.displayConfigureOrganizationJsonDialog();
                                //thiz.displayAlertDialog('This functionality is incomplete. Coming soon! This functionality needs to be copied from the Forest Administration section.\n\n<span style="font-size:12pt;">$(\'.bwNewUserBusinessModelEditor\').bwNewUserBusinessModelEditor(\'displayDialog\', \'Create\');</span>');
                            }
                        },
                        items: {
                            "importorganizationdata": {
                                name: "Add/Delete Organization divisions/groups/legal entities/locations...", icon: "edit"
                            },
                            "editorganizationjson": {
                                name: "Edit Organization JSON", icon: "edit"
                            },
                            "organizationjsondiagnostics": {
                                name: "Organization JSON Diagnostics", icon: "edit"
                            },
                            "vieworganizationroles": {
                                name: "Edit Organization Roles", icon: "edit"
                            }
                        }
                    });
                    // End: This is our right-click context menu.
                    //
                } else {

                    // This is our right-click context menu. MIT license and code at: https://swisnl.github.io/jQuery-contextMenu/demo/trigger-custom.html
                    $.contextMenu({
                        selector: '.context-menu-organizationeditor',
                        callback: function (key, options) {
                            //var m = "clicked: " + key;
                            //window.console && console.log(m) || alert(m);
                            if (key == 'viewtrashbincontents') {
                                //alert('This functionality is incomplete. Coming soon!');
                                cmdDisplayArchivePageTrashbinContents();
                            } else if (key == 'editorganizationjson') {
                                //alert('This functionality is incomplete. Coming soon! xcx2316794');
                                thiz.editOrganizationJson();
                            } else if (key == 'viewextendedinformation') {
                                //alert('This functionality is incomplete. Coming soon!');
                                cmdDisplayArchivePageExtendedInformation();
                            } else if (key == 'organizationjsondiagnostics') {
                                thiz.downloadOrganizationJson();
                                //$('.bwCoreComponent').bwCoreComponent('downloadOrganizationJson');
                            } else if (key == 'vieworganizationroles') {
                                $('.bwCoreComponent').bwCoreComponent('displayEditRolesDialog'); // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                            } else if (key == 'importorganizationdata') {

                                // 8-19-2022
                                //$('.bwOrganizationEditorAdmin').bwOrganizationEditorAdmin('displayConfigureOrganizationJsonDialog');

                                thiz.displayConfigureOrganizationJsonDialog();
                                //thiz.displayAlertDialog('This functionality is incomplete. Coming soon! This functionality needs to be copied from the Forest Administration section.\n\n<span style="font-size:12pt;">$(\'.bwNewUserBusinessModelEditor\').bwNewUserBusinessModelEditor(\'displayDialog\', \'Create\');</span>');
                            }
                        },
                        items: {
                            "importorganizationdata": {
                                name: "Add/Delete Organization divisions/groups/legal entities/locations...", icon: "edit"
                            }//,
                            //"editorganizationjson": {
                            //    name: "Edit Organization JSON", icon: "edit"
                            //}
                        }
                    });
                    // End: This is our right-click context menu.
                    //

                }





            }

        } catch (e) {
            console.log('Exception in bwOrganizationEditor.js.renderOrgRolesEditor2(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwOrganizationEditor.js.renderOrgRolesEditor2(): ' + e.message + ', ' + e.stack);
        }
    },














    cmdCreateJsonFromSqlServerData: function (orgs) {
        try {
            console.log('In bwOrganizationEditor.js.cmdCreateJsonFromSqlServerData().');

            var requestDialogId = 'divImportOrganizationFromSqlServerDialog';
            var orgIdFieldName = $('#' + requestDialogId).find('#selectOrgIdFieldName option:selected').val();
            var orgTypeFieldName = $('#' + requestDialogId).find('#selectOrgTypeFieldName option:selected').val();
            var divisionValue = $('#' + requestDialogId).find('#selectDivisionValue').val();
            var groupValue = $('#' + requestDialogId).find('#selectGroupValue').val();
            var legalEntityValue = $('#' + requestDialogId).find('#selectLegalEntityValue').val();
            var locationValue = $('#' + requestDialogId).find('#selectLocationValue').val();
            var parentOrgIdFieldName = $('#' + requestDialogId).find('#selectParentOrgIdFieldName option:selected').val();
            var orgNameFieldName = $('#' + requestDialogId).find('#selectOrgNameFieldName option:selected').val();
            var orgAbbreviationFieldName = $('#' + requestDialogId).find('#selectOrgAbbreviationFieldName option:selected').val();
            //
            // We now have enough information to create the OrgRoles JSON!
            //
            var json = {
                Divisions: {
                    Style: 'display:block;',
                    Items: []
                }
            };
            // First, create the "Division" nodes.
            for (var i = 0; i < orgs.length; i++) {
                if (orgs[i][orgTypeFieldName] == divisionValue) {
                    var division = {
                        Name: orgs[i][orgNameFieldName], //"Corporate",
                        Abbreviation: orgs[i][orgAbbreviationFieldName], //"WLFV",
                        Id: orgs[i][orgIdFieldName], //"xxxx-xxx-xcxccx-xxxxxx1",
                        Style: "display:block;",
                        Roles: [],
                        Groups: {
                            Style: "display:block;",
                            Items: []
                        }
                    };
                    json.Divisions.Items.push(division);
                }
            }
            // Second, add the Groups.
            // Iterate through the JSON, and add the groups for each division.
            for (var d = 0; d < json.Divisions.Items.length; d++) {
                var currentDivisionOrgId = json.Divisions.Items[d].Id;
                // Iterate through the database results, and find the parent org id's.
                for (var i = 0; i < orgs.length; i++) {
                    if (orgs[i][orgTypeFieldName] == groupValue) { // This means it is a "Group".
                        var parentOrgId = orgs[i][parentOrgIdFieldName];
                        if (currentDivisionOrgId == parentOrgId) {
                            // This Group belongs to this Division. Add it!
                            var group = {
                                Name: orgs[i][orgNameFieldName], //"Corporate",
                                Abbreviation: orgs[i][orgAbbreviationFieldName], //"WLFV",
                                Id: orgs[i][orgIdFieldName], //"xxxx-xxx-xcxccx-xxxxxx1",
                                Style: "display:block;",
                                Roles: [],
                                LegalEntities: {
                                    Style: "display:block;",
                                    Items: []
                                }
                            };
                            json.Divisions.Items[d].Groups.Items.push(group);
                        }
                    }
                }
            }
            // Third, add the Legal Entities.
            // Iterate through the JSON, and add the legal entities for each group.
            for (var d = 0; d < json.Divisions.Items.length; d++) {
                for (var g = 0; g < json.Divisions.Items[d].Groups.Items.length; g++) {
                    var currentGroupOrgId = json.Divisions.Items[d].Groups.Items[g].Id;
                    // Iterate through the database results, and find the parent org id's.
                    for (var i = 0; i < orgs.length; i++) {
                        if (orgs[i][orgTypeFieldName] == legalEntityValue) { // This means it is a "Legal Entity".
                            var parentOrgId = orgs[i][parentOrgIdFieldName];
                            if (currentGroupOrgId == parentOrgId) {
                                // This Legal Entity belongs to this Group. Add it!
                                var legalEntity = {
                                    Name: orgs[i][orgNameFieldName], //"Corporate",
                                    Abbreviation: orgs[i][orgAbbreviationFieldName], //"WLFV",
                                    Id: orgs[i][orgIdFieldName], //"xxxx-xxx-xcxccx-xxxxxx1",
                                    Style: "display:block;",
                                    Roles: [],
                                    Locations: {
                                        Style: "display:block;",
                                        Items: []
                                    }
                                };
                                json.Divisions.Items[d].Groups.Items[g].LegalEntities.Items.push(legalEntity);
                            }
                        }
                    }
                }
            }
            // Fourth, add the Locations.
            // Iterate through the JSON, and add the legal entities for each group.
            for (var d = 0; d < json.Divisions.Items.length; d++) {
                var currentDivisionOrgId = json.Divisions.Items[d].Id;
                for (var g = 0; g < json.Divisions.Items[d].Groups.Items.length; g++) {
                    for (var e = 0; e < json.Divisions.Items[d].Groups.Items[g].LegalEntities.Items.length; e++) {
                        var currentLegalEntityOrgId = json.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Id;
                        // Iterate through the database results, and find the parent org id's.
                        for (var i = 0; i < orgs.length; i++) {
                            if (orgs[i][orgTypeFieldName] == locationValue) { // This means it is a "Location".
                                var parentOrgId = orgs[i][parentOrgIdFieldName];
                                if (currentLegalEntityOrgId == parentOrgId) {
                                    // This Legal Entity belongs to this Group. Add it!
                                    var location = {
                                        Name: orgs[i][orgNameFieldName], //"Corporate",
                                        Abbreviation: orgs[i][orgAbbreviationFieldName], //"WLFV",
                                        Id: orgs[i][orgIdFieldName], //"xxxx-xxx-xcxccx-xxxxxx1",
                                        Style: "display:block;",
                                        Roles: []
                                    };
                                    json.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items.push(location);
                                }
                            }
                        }
                    }
                }
            }

            // Display the JSON.
            this.options.store.DraftGlobal.Divisions = JSON.parse(JSON.stringify(json.Divisions));
            var json2 = {
                DraftGlobal: this.options.store.DraftGlobal
            };
            $('#divConfigureBusinessModelNotificationsDialog2-1').find('#txtNewUserOrganizationModelJSON')[0].innerHTML = JSON.stringify(json2, null, 2); // txtNewUserOrganizationModelJSON







            //
            // Now we have to get the Org Roles/Participants, and import into the Organization JSON.
            //
            var data = [];
            data = {
                //bwTenantId: tenantId,
                //bwWorkflowAppId: workflowAppId
            };
            var operationUri = globalUrlPrefix + globalUrlForWebServices + '/_bw' + "/getorgrolesfromsqlserver";
            $.ajax({
                url: operationUri,
                type: "POST",
                timeout: ajaxTimeout,
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (result) {
                    if (result.connectionStatus == 'connected') {
                        debugger;
                        var orgRolesParticipants = JSON.parse(result.results);

                        //// Now we need to parse the results and start getting ready for a migration!!!!!!!!!!
                        //var requestDialogId = 'divImportOrganizationFromSqlServerDialog';
                        //if ($('#' + requestDialogId).is(':visible')) {
                        //    $('#' + requestDialogId).dialog('close');
                        //}
                        //var html = '';
                        ////html += '<div style="display:none;" id="divRequestFormDialog">';
                        //html += '        <table style="width:100%;">';
                        //html += '            <tr>';
                        //html += '                <td style="width:90%;">';
                        ////html += '                    <span id="divRequestWorkflowAuditTrailContent"></span>';
                        //html += '                    <span id="divImportOrganizationFromSqlServerDialogContent"></span>';
                        //html += '                </td>';
                        //html += '            </tr>';
                        //html += '        </table>';
                        //html += '        <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and zooming in on the iPhone. -->';
                        //html += '        <br /><br />';
                        ////html += '    </div>';

                        ////
                        //// THIS IS PART OF THE PIN FUNCTIONALITY 4-1-2020
                        ////
                        //var div = document.getElementById(requestDialogId); // 4-1-2020 12-28pm adt.
                        //if (!div) { // for some reason this gets added twice to the DOM. Figure this out someday, but for now this seems to fix it and is a good safety I suppose.
                        //    div = document.createElement('div');
                        //    div.id = requestDialogId;
                        //    document.body.appendChild(div); // to place at end of document
                        //}
                        //div.innerHTML = html;
                        //// Now that it is part of the DOM, we can display it!
                        //$('#' + requestDialogId).dialog({
                        //    modal: false,
                        //    resizable: true,
                        //    closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                        //    width: '1200px',
                        //    dialogClass: "no-close", // No close button in the upper right corner.
                        //    hide: false, // This means when hiding just disappear with no effects.
                        //    open: function () {
                        //        try {
                        //            var element2 = document.getElementById(requestDialogId).parentNode; // This is the best way to get a handle on the jquery dialog.
                        //            var requestDialogParentId = requestDialogId + '_Parent'; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.
                        //            element2.id = requestDialogParentId; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.

                        //            // This creates the custom header/draggable bar on the dialog!!! 4-2-2020. // ☈ ☇ https://www.toptal.com/designers/htmlarrows/symbols/thunderstorm/
                        //            var html = '';
                        //            html += '<table style="width:100%;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequestDialog\');">'; // This click event is like "pin". Once the user clicks the header of the request dialog, it no longer is modal and persists on the screen until they choose to close it.
                        //            html += '   <tr>';
                        //            html += '       <td style="width:95%;">';
                        //            //html += '           <div id="slider_' + requestDialogId + '" style="width:20%;cursor:pointer;">[' + 'slider_' + requestDialogId + ']</div>';
                        //            html += '           <div id="slider_' + requestDialogId + '" style="width:20%;cursor:pointer;"></div>';
                        //            html += '       </td>';
                        //            html += '       <td>';
                        //            html += '           <span class="dialogXButton" style="font-size:25pt;cursor:pointer;width:100%;" onclick="$(\'#' + requestDialogId.replace('_Parent', '') + '\').dialog(\'close\');">X</span>';
                        //            html += '       </td>';
                        //            html += '   </tr>';
                        //            html += '</table>';

                        //            document.getElementById(requestDialogId).parentNode.querySelector(".ui-dialog-titlebar").innerHTML = html;

                        //            html = '';

                        //            html += '<table>';
                        //            html += '  <tr>';
                        //            html += '    <td>';
                        //            html += '       Org Id field:&nbsp;';
                        //            html += '       <select id="selectOrgIdFieldName">';
                        //            var columns = orgs[0];
                        //            for (var key in columns) {
                        //                if (key == 'OrgId') {
                        //                    html += '       <option selected>' + key + '</option>';
                        //                } else {
                        //                    html += '       <option>' + key + '</option>';
                        //                }
                        //            }
                        //            html += '       </select>';
                        //            html += '    </td>';
                        //            html += '  </tr>';

                        //            html += '  <tr>';
                        //            html += '    <td>';
                        //            html += '       Org type field:&nbsp;';
                        //            html += '       <select id="selectOrgTypeFieldName">';
                        //            var columns = orgs[0];
                        //            for (var key in columns) {
                        //                if (key == 'OrgTypeId') {
                        //                    html += '       <option selected>' + key + '</option>';
                        //                } else {
                        //                    html += '       <option>' + key + '</option>';
                        //                }
                        //            }
                        //            html += '       </select>';
                        //            var orgTypes = [];
                        //            for (var i = 0; i < orgs.length; i++) {
                        //                if (!(orgTypes.indexOf(orgs[i]["OrgTypeId"]) > -1)) orgTypes.push(orgs[i]["OrgTypeId"]);
                        //            }
                        //            html += '&nbsp;Division value: ';
                        //            html += '       <select id="selectDivisionValue">';
                        //            for (var i = 0; i < orgTypes.length; i++) {
                        //                if (orgTypes[i] == 'D') {
                        //                    html += '       <option selected>' + orgTypes[i] + '</option>';
                        //                } else {
                        //                    html += '       <option>' + orgTypes[i] + '</option>';
                        //                }
                        //            }
                        //            html += '       </select>';
                        //            html += '&nbsp;Group value: ';
                        //            html += '       <select id="selectGroupValue">';
                        //            for (var i = 0; i < orgTypes.length; i++) {
                        //                if (orgTypes[i] == 'G') {
                        //                    html += '       <option selected>' + orgTypes[i] + '</option>';
                        //                } else {
                        //                    html += '       <option>' + orgTypes[i] + '</option>';
                        //                }
                        //            }
                        //            html += '       </select>';
                        //            html += '&nbsp;Legal Entity value: ';
                        //            html += '       <select id="selectLegalEntityValue">';
                        //            for (var i = 0; i < orgTypes.length; i++) {
                        //                if (orgTypes[i] == 'E') {
                        //                    html += '       <option selected>' + orgTypes[i] + '</option>';
                        //                } else {
                        //                    html += '       <option>' + orgTypes[i] + '</option>';
                        //                }
                        //            }
                        //            html += '       </select>';
                        //            html += '&nbsp;Location value: ';
                        //            html += '       <select id="selectLocationValue">';
                        //            for (var i = 0; i < orgTypes.length; i++) {
                        //                if (orgTypes[i] == 'L') {
                        //                    html += '       <option selected>' + orgTypes[i] + '</option>';
                        //                } else {
                        //                    html += '       <option>' + orgTypes[i] + '</option>';
                        //                }
                        //            }
                        //            html += '       </select>';
                        //            html += '    </td>';
                        //            html += '  </tr>';

                        //            html += '  <tr>';
                        //            html += '    <td>';
                        //            html += '       Parent Org Id field:&nbsp;';
                        //            html += '       <select id="selectParentOrgIdFieldName">';
                        //            var columns = orgs[0];
                        //            for (var key in columns) {
                        //                if (key == 'ParentOrgId') {
                        //                    html += '       <option selected>' + key + '</option>';
                        //                } else {
                        //                    html += '       <option>' + key + '</option>';
                        //                }
                        //            }
                        //            html += '       </select>';
                        //            html += '    </td>';
                        //            html += '  </tr>';

                        //            html += '  <tr>';
                        //            html += '    <td>';
                        //            html += '       Org Name field:&nbsp;';
                        //            html += '       <select id="selectOrgNameFieldName">';
                        //            var columns = orgs[0];
                        //            for (var key in columns) {
                        //                if (key == 'OrgName') {
                        //                    html += '       <option selected>' + key + '</option>';
                        //                } else {
                        //                    html += '       <option>' + key + '</option>';
                        //                }
                        //            }
                        //            html += '       </select>';
                        //            html += '    </td>';
                        //            html += '  </tr>';

                        //            html += '  <tr>';
                        //            html += '    <td>';
                        //            html += '       Org abbreviation field:&nbsp;';
                        //            html += '       <select id="selectOrgAbbreviationFieldName">';
                        //            var columns = orgs[0];
                        //            for (var key in columns) {
                        //                if (key == 'CARNumberingAbbreviation') {
                        //                    html += '       <option selected>' + key + '</option>';
                        //                } else {
                        //                    html += '       <option>' + key + '</option>';
                        //                }
                        //            }
                        //            html += '       </select>';
                        //            html += '    </td>';
                        //            html += '  </tr>';

                        //            html += '  <tr>';
                        //            html += '    <td></td>';
                        //            html += '  </tr>';

                        //            html += '  <tr>';
                        //            html += '    <td>';
                        //            html += '       <input id="btnCreateJson" type="button" value="CREATE JSON" style="cursor:pointer;" />'; //onclick="cmdCreateJsonFromSqlServerData(' + orgs + ');" />';
                        //            html += '    </td>';
                        //            html += '  </tr>';

                        //            html += '</table>';

                        //            //html += 'Successfully connected to SQL Server. results: ' + result.results;

                        //            document.getElementById('divImportOrganizationFromSqlServerDialogContent').innerHTML = html;


                        //            $('#' + requestDialogId).find('#btnCreateJson').click(function (error) {
                        //                thiz.cmdCreateJsonFromSqlServerData(orgs);
                        //            });


                        //        } catch (e) {
                        //            console.log('Exception in bwSpendGrid.viewInLargeWindow().dialog.open(): ' + e.message + ', ' + e.stack);
                        //        }
                        //    }
                        //});
                        //try {
                        //    $('.ui-widget-overlay')[0].style.zIndex = 9;
                        //    $('#' + requestDialogId).dialog().parents('.ui-dialog')[0].style.zIndex = 10; // THIS IS A HACK ?? IS THIS THE BEST PLACE FOR THIS ?? >>>>>>>>>>>>>>>>>>>>>>>>>>>> 2-15-2020
                        //} catch (e) {

                        //}

                    } else if (result.connectionStatus == 'not connected') {
                        displayAlertDialog('Connection to SQL Server failed. Exception: ' + result.exception.message);
                    } else {
                        displayAlertDialog('UNEXPECTED RESPONSE xcx85494068');
                    }

                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('In cmdImportOrganizationFromSqlServer.error(): ' + errorCode + ' ' + errorMessage);
                }
            });











        } catch (e) {
            console.log('Exception in cmdCreateJsonFromSqlServerData(): ' + e.message + ', ' + e.stack);
        }
    },


    cmdImportOrganizationFromSqlServer: function () {
        try {
            console.log('In bwOrganizationEditor.js.cmdConnectToSqlServer().');
            var thiz = this;
            //debugger;
            var data = [];
            data = {
                //bwTenantId: tenantId,
                //bwWorkflowAppId: workflowAppId
            };
            var operationUri = globalUrlPrefix + globalUrlForWebServices + '/_bw' + "/getorgsfromsqlserver";
            $.ajax({
                url: operationUri,
                type: "POST", timeout: ajaxTimeout,
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (result) {
                    if (result.connectionStatus == 'connected') {
                        //displayAlertDialog('Successfully connected to SQL Server. results: ' + result.results);
                        var orgs = JSON.parse(result.results);

                        // Now we need to parse the results and start getting ready for a migration!!!!!!!!!!
                        var requestDialogId = 'divImportOrganizationFromSqlServerDialog';
                        if ($('#' + requestDialogId).is(':visible')) {
                            $('#' + requestDialogId).dialog('close');
                        }
                        var html = '';
                        //html += '<div style="display:none;" id="divRequestFormDialog">';
                        html += '        <table style="width:100%;">';
                        html += '            <tr>';
                        html += '                <td style="width:90%;">';
                        //html += '                    <span id="divRequestWorkflowAuditTrailContent"></span>';
                        html += '                    <span id="divImportOrganizationFromSqlServerDialogContent"></span>';
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
                            modal: false,
                            resizable: true,
                            closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                            width: '1200px',
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
                                    html += '       <td>';
                                    html += '           <span class="dialogXButton" style="font-size:25pt;cursor:pointer;width:100%;" onclick="$(\'#' + requestDialogId.replace('_Parent', '') + '\').dialog(\'close\');">X</span>';
                                    html += '       </td>';
                                    html += '   </tr>';
                                    html += '</table>';

                                    document.getElementById(requestDialogId).parentNode.querySelector(".ui-dialog-titlebar").innerHTML = html;

                                    html = '';

                                    html += '<table>';
                                    html += '  <tr>';
                                    html += '    <td>';
                                    html += '       Org Id field:&nbsp;';
                                    html += '       <select id="selectOrgIdFieldName">';
                                    var columns = orgs[0];
                                    for (var key in columns) {
                                        if (key == 'OrgId') {
                                            html += '       <option selected>' + key + '</option>';
                                        } else {
                                            html += '       <option>' + key + '</option>';
                                        }
                                    }
                                    html += '       </select>';
                                    html += '    </td>';
                                    html += '  </tr>';

                                    html += '  <tr>';
                                    html += '    <td>';
                                    html += '       Org type field:&nbsp;';
                                    html += '       <select id="selectOrgTypeFieldName">';
                                    var columns = orgs[0];
                                    for (var key in columns) {
                                        if (key == 'OrgTypeId') {
                                            html += '       <option selected>' + key + '</option>';
                                        } else {
                                            html += '       <option>' + key + '</option>';
                                        }
                                    }
                                    html += '       </select>';
                                    var orgTypes = [];
                                    for (var i = 0; i < orgs.length; i++) {
                                        if (!(orgTypes.indexOf(orgs[i]["OrgTypeId"]) > -1)) orgTypes.push(orgs[i]["OrgTypeId"]);
                                    }
                                    html += '&nbsp;Division value: ';
                                    html += '       <select id="selectDivisionValue">';
                                    for (var i = 0; i < orgTypes.length; i++) {
                                        if (orgTypes[i] == 'D') {
                                            html += '       <option selected>' + orgTypes[i] + '</option>';
                                        } else {
                                            html += '       <option>' + orgTypes[i] + '</option>';
                                        }
                                    }
                                    html += '       </select>';
                                    html += '&nbsp;Group value: ';
                                    html += '       <select id="selectGroupValue">';
                                    for (var i = 0; i < orgTypes.length; i++) {
                                        if (orgTypes[i] == 'G') {
                                            html += '       <option selected>' + orgTypes[i] + '</option>';
                                        } else {
                                            html += '       <option>' + orgTypes[i] + '</option>';
                                        }
                                    }
                                    html += '       </select>';
                                    html += '&nbsp;Legal Entity value: ';
                                    html += '       <select id="selectLegalEntityValue">';
                                    for (var i = 0; i < orgTypes.length; i++) {
                                        if (orgTypes[i] == 'E') {
                                            html += '       <option selected>' + orgTypes[i] + '</option>';
                                        } else {
                                            html += '       <option>' + orgTypes[i] + '</option>';
                                        }
                                    }
                                    html += '       </select>';
                                    html += '&nbsp;Location value: ';
                                    html += '       <select id="selectLocationValue">';
                                    for (var i = 0; i < orgTypes.length; i++) {
                                        if (orgTypes[i] == 'L') {
                                            html += '       <option selected>' + orgTypes[i] + '</option>';
                                        } else {
                                            html += '       <option>' + orgTypes[i] + '</option>';
                                        }
                                    }
                                    html += '       </select>';
                                    html += '    </td>';
                                    html += '  </tr>';

                                    html += '  <tr>';
                                    html += '    <td>';
                                    html += '       Parent Org Id field:&nbsp;';
                                    html += '       <select id="selectParentOrgIdFieldName">';
                                    var columns = orgs[0];
                                    for (var key in columns) {
                                        if (key == 'ParentOrgId') {
                                            html += '       <option selected>' + key + '</option>';
                                        } else {
                                            html += '       <option>' + key + '</option>';
                                        }
                                    }
                                    html += '       </select>';
                                    html += '    </td>';
                                    html += '  </tr>';

                                    html += '  <tr>';
                                    html += '    <td>';
                                    html += '       Org Name field:&nbsp;';
                                    html += '       <select id="selectOrgNameFieldName">';
                                    var columns = orgs[0];
                                    for (var key in columns) {
                                        if (key == 'OrgName') {
                                            html += '       <option selected>' + key + '</option>';
                                        } else {
                                            html += '       <option>' + key + '</option>';
                                        }
                                    }
                                    html += '       </select>';
                                    html += '    </td>';
                                    html += '  </tr>';

                                    html += '  <tr>';
                                    html += '    <td>';
                                    html += '       Org abbreviation field:&nbsp;';
                                    html += '       <select id="selectOrgAbbreviationFieldName">';
                                    var columns = orgs[0];
                                    for (var key in columns) {
                                        if (key == 'CARNumberingAbbreviation') {
                                            html += '       <option selected>' + key + '</option>';
                                        } else {
                                            html += '       <option>' + key + '</option>';
                                        }
                                    }
                                    html += '       </select>';
                                    html += '    </td>';
                                    html += '  </tr>';

                                    html += '  <tr>';
                                    html += '    <td></td>';
                                    html += '  </tr>';

                                    html += '  <tr>';
                                    html += '    <td>';
                                    html += '       <input id="btnCreateJson" type="button" value="CREATE JSON" style="cursor:pointer;" />'; //onclick="cmdCreateJsonFromSqlServerData(' + orgs + ');" />';
                                    html += '    </td>';
                                    html += '  </tr>';

                                    html += '</table>';

                                    //html += 'Successfully connected to SQL Server. results: ' + result.results;

                                    document.getElementById('divImportOrganizationFromSqlServerDialogContent').innerHTML = html;


                                    $('#' + requestDialogId).find('#btnCreateJson').off('click').click(function (error) {
                                        thiz.cmdCreateJsonFromSqlServerData(orgs);
                                    });


                                } catch (e) {
                                    console.log('Exception in bwSpendGrid.viewInLargeWindow().dialog.open(): ' + e.message + ', ' + e.stack);
                                }
                            }
                        });
                        try {
                            $('.ui-widget-overlay')[0].style.zIndex = 9;
                            $('#' + requestDialogId).dialog().parents('.ui-dialog')[0].style.zIndex = 10; // THIS IS A HACK ?? IS THIS THE BEST PLACE FOR THIS ?? >>>>>>>>>>>>>>>>>>>>>>>>>>>> 2-15-2020
                        } catch (e) {

                        }

                    } else if (result.connectionStatus == 'not connected') {
                        displayAlertDialog('Connection to SQL Server failed. Exception: ' + result.exception.message);
                    } else {
                        displayAlertDialog('UNEXPECTED RESPONSE xcx85494068');
                    }

                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('In cmdImportOrganizationFromSqlServer.error(): ' + errorCode + ' ' + errorMessage);
                }
            });

        } catch (e) {
            console.log('Exception in cmdImportOrganizationFromSqlServer(): ' + e.message + ', ' + e.stack);
        }
    },













    displayConfigureOrganizationJsonDialog: function (stepName) {
        try {
            console.log('In bwOrganizationEditor.js.displayConfigureOrganizationJsonDialog().');
            var thiz = this;

            var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');

            // Set the dialog sub title.
            var html = '';

            //html += '<div style="display:none;" id="divConfigureBusinessModelNotificationsDialog2-1">';
            html += '   <table style="width:100%;">';
            html += '       <tr>';
            html += '           <td style="width:90%;">';
            html += '               <span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:30pt;font-weight:bold;">Configure the Organization</span>';
            html += '               <br />';
            //html += '               <span id="spanConfigureEmailNotificationsDialogSubTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:normal;">[spanConfigureEmailNotificationsDialogSubTitle]</span>';
            html += '           </td>';
            html += '           <td style="width:9%;"></td>';
            html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#bwOrganizationEditor_AdminDialog\').dialog(\'close\');">X</span>';
            html += '           </td>';
            html += '       </tr>';
            html += '   </table>';
            html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            //html += '</div>';

            if (developerModeEnabled == true) {
                html += 'Editing this JSON may be necessary pre-loading, and troubleshooting ORG ROLES synchronization with the BwWorkflowUserRole table.';

                html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '  <tr>';
                html += '    <td>';
                html += '        <span style="font-size:small;font-style:italic;">Import the ORGANIZATION from Sql Server (BETA Step 1).</span>';
                html += '    </td></tr>';
                html += '</table>';
                html += '<table>';
                html += '  <tr>';
                html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                html += '       <input type="button" id="btnConnectToSqlServer" value="Step 1: Import Your Organization from Sql Server" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'cmdImportOrganizationFromSqlServer\');" style="cursor:pointer;padding:5px 10px 5px 10px;" />';
                html += '    </td>';
                html += '  </tr>';
                html += '</table>';

                html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '  <tr>';
                html += '    <td>';
                html += '        <span style="font-size:small;font-style:italic;">Import the ORG ROLES/PARTICIPANTS from Sql Server (BETA Step 2).</span>';
                html += '    </td></tr>';
                html += '</table>';
                html += '<table>';
                html += '  <tr>';
                html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                html += '       <input type="button" id="btnConnectToSqlServer" value="Step 2: Import Your Org Roles/Participants from Sql Server" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'cmdImportOrgRolesParticipantsFromSqlServer\');" style="cursor:pointer;padding:5px 10px 5px 10px;" />';
                html += '    </td>';
                html += '  </tr>';
                html += '</table>';

            }

            // Publish message and button.
            html += '<table>';
            html += '<tr>';
            html += '  <td>';
            html += '';
            html += '  </td>';
            html += '  <td style="text-align:right;">';
            html += '    <span id="spanThereAreChangesToPublishText51" style="font-style:italic;color:tomato;">[spanThereAreChangesToPublishText51]</span>'; //<input value=" There are unsaved changes. Enter a description here and click Save..." type="text" id="txtNewWorkflowDescription" style="width:450px;color:grey;font-style:italic;padding:5px 5px 5px 5px;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewWorkflowDescriptionTextBox_Onkeyup\');" />';
            html += '  </td>';
            html += '  <td>';
            html += '    <span id="spanThereAreChangesToPublishButton51">[spanThereAreChangesToPublishButton51]</span>';
            html += '  </td>';
            html += '  <td>';
            //html += '    <span onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderTreeviewWithNewJson\');" style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;">RE-RENDER</span>';
            html += '  </td>';
            html += '</tr>';
            html += '</table>';

            html += '   <br />';
            html += '   <span id="bwOrganizationEditor_AdminDialog_DialogContent2">[bwOrganizationEditor_AdminDialog_DialogContent2]</span>';
            html += '   <br />';
            html += '   <br />';
            //html += '</div>';


            // 8-19-2022 Rename divConfigureBusinessModelNotificationsDialog2-1 to bwOrganizationEditor_AdminDialog

            var div = document.getElementById('bwOrganizationEditor_AdminDialog');
            if (!div) { // for some reason this gets added twice to the DOM. Figure this out someday, but for now this seems to fix it and is a good safety I suppose.
                div = document.createElement('div');
                div.id = 'bwOrganizationEditor_AdminDialog';
                div.style.display = 'none';
                document.body.appendChild(div); // to place at end of document
            }
            div.innerHTML = html;

            $("#bwOrganizationEditor_AdminDialog").dialog({
                modal: false,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                position: {
                    my: "middle top+12",
                    at: "middle top",
                    of: window
                },
                width: '1200',
                dialogClass: 'no-close', // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    try {
                        //$('.ui-widget-overlay').bind('click', function () {
                        //    $('#divConfigureBusinessModelNotificationsDialog2-1').dialog('close');
                        //});

                        console.log('xcx123488 Instantiating widget bwOrganizationEditorAdmin.js in element [bwOrganizationEditor_AdminDialog_DialogContent2]');


                        var options = {
                            DisplayAsNewTenantUserConfigurationEditor: true//,
                            //bwTenantId: tenantId,
                            //bwWorkflowAppId: workflowAppId,
                            //bwEnabledRequestTypes: bwEnabledRequestTypes
                        };
                        var $bworgroleseditor = $("#bwOrganizationEditor_AdminDialog_DialogContent2").bwOrganizationEditorAdmin(options); // spanConfigureOrganizationJsonDialogContent

                    } catch (e) {
                        console.log('Exception in bwOrganizationEditor.js.displayConfigureOrganizationJsonDialog.bwOrganizationEditor_AdminDialog.open(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwOrganizationEditor.js.displayConfigureOrganizationJsonDialog.bwOrganizationEditor_AdminDialog.open(): ' + e.message + ', ' + e.stack);
                    }
                },
                close: function () {
                    $('#bwOrganizationEditor_AdminDialog').dialog('destroy');
                }

            });
            //$('#divConfigureBusinessModelNotificationsDialog2-1').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();

        } catch (e) {
            console.log('Exception in bwOrganizationEditor.js.displayConfigureOrganizationJsonDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwOrganizationEditor.js.displayConfigureOrganizationJsonDialog(): ' + e.message + ', ' + e.stack);
        }
    },


    downloadOrganizationJson: function () {
        try {
            console.log('In bwOrganizationEditor.js.downloadOrganizationJson().');
            var thiz = this;
            // Display a dialog box with a big textarea so that the contents can be copied and pasted.
            $("#divDisplayJsonDialogForBusinessModelEditor").dialog({
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
                open: function (event, ui) {
                    $('.ui-widget-overlay').bind('click', function () { $("#divDisplayJsonDialogForBusinessModelEditor").dialog('close'); });
                }, // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.
                close: function () {
                    $("#divDisplayJsonDialogForBusinessModelEditor").dialog('destroy');
                }
            });
            //$("#divDisplayJsonDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            var json = this.options.store.Global;
            $("#divDisplayJsonDialogForBusinessModelEditor").find('#spanDisplayJsonDialogTitle')[0].innerHTML = 'Organization structure, roles and participants JSON'; // Title
            $("#divDisplayJsonDialogForBusinessModelEditor").find('#spanDisplayJsonDialogContent')[0].innerHTML = 'We trust the app to keep this JSON in sync with the BwWorkflowUserRole table.'; // Summary text
            //$('#txtDisplayJsonDialogJSON').empty();
            //$('#txtDisplayJsonDialogJSON').append(JSON.stringify(json, null, 2));
            var html = '';
            html += JSON.stringify(json, null, 2);
            html += '<br /><br /><span style="font-weight:bold;">DONE</span><br />';
            $("#divDisplayJsonDialogForBusinessModelEditor").find('#txtDisplayJsonDialogJSON')[0].innerHTML = html;

            //debugger;
            // "Run Diagnostics" button.
            //$(this.element).find('#btnRunDiagnostics')[0].click(function (error) {
            //    thiz.runJsonDiagnostics();
            //});

        } catch (e) {
            console.log('Exception in downloadOrganizationJson(): ' + e.message + ', ' + e.stack);
            this.displayAlertDialog('Exception in downloadOrganizationJson(): ' + e.message + ', ' + e.stack);
        }
    },

    editOrganizationJson: function () {
        try {
            console.log('In bwOrganizationEditor.js.editOrganizationJson().');
            var thiz = this;

            // Display a dialog box with a big textarea so that the contents can be copied and pasted.
            $('#divDisplayJsonDialogForBusinessModelEditor_' + this.options.elementIdSuffix).dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: "760",
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false,//, // This means when hiding just disappear with no effects.
                open: function (event, ui) {
                    try {
                        console.log('In bwOrganizationEditor.js.editOrganizationJson.divDisplayJsonDialogForBusinessModelEditor_' + thiz.options.elementIdSuffix + '.dialog.open().');

                        $('.ui-widget-overlay').bind('click', function () { $('#divDisplayJsonDialogForBusinessModelEditor_' + thiz.options.elementIdSuffix).dialog('close'); });


                        var json = thiz.options.store.Global;
                        $('#divDisplayJsonDialogForBusinessModelEditor_' + thiz.options.elementIdSuffix).find('#spanDisplayJsonDialogTitle')[0].innerHTML = 'Edit Organization JSON'; // Title
                        $('#divDisplayJsonDialogForBusinessModelEditor_' + thiz.options.elementIdSuffix).find('#spanDisplayJsonDialogContent')[0].innerHTML = 'We trust the app to keep this JSON in sync with the BwWorkflowUserRole table.'; // Summary text
                        //$('#txtDisplayJsonDialogJSON').empty();
                        //$('#txtDisplayJsonDialogJSON').append(JSON.stringify(json, null, 2));
                        var html = '';
                        html += JSON.stringify(json, null, 2);
                        //html += '<br /><br /><span style="font-weight:bold;">DONE</span><br />';
                        $('#divDisplayJsonDialogForBusinessModelEditor_' + thiz.options.elementIdSuffix).find('#divDisplayJsonDialogForBusinessModelEditor_txtDisplayJsonDialogJSON')[0].innerHTML = html;

                        console.log('Displayed json: ' + html);
                        //debugger;

                        //$('#divDisplayJsonDialogForBusinessModelEditor_' + thiz.options.elementIdSuffix).find('#btnRunDiagnostics').html('<span style="font-size:30pt;">⚠ Save/Update Organization JSON</span>'); // document.getElementById('btnRunDiagnostics').innerHTML = '<span style="font-size:30pt;">⚠ Save/Update Workflow JSON</span>'; // btnRunDiagnostics
                        //$('#divDisplayJsonDialogForBusinessModelEditor_' + thiz.options.elementIdSuffix).find('#btnRunDiagnostics').off('click').click(function (error) {


                        //    //console.log('In editOrganizationJson().');


                        //    var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
                        //    var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                        //    var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                        //    var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');

                        //    debugger; // 1-4-2022
                        //    // This is where we validate the JSON and save it back to the database, activating the new workflow JSON/Definition.
                        //    var bwOrgRolesJson = $('#divDisplayJsonDialogForBusinessModelEditor_' + thiz.options.elementIdSuffix).find('#txtDisplayJsonDialogJSON').val(); // txtDisplayJsonDialogJSON
                        //    var validJson = true;
                        //    try {
                        //        var json2 = JSON.parse(bwOrgRolesJson);
                        //    } catch (e) {
                        //        validJson = false;
                        //    }
                        //    if (validJson != true) {
                        //        console.log('Error in editOrganizationJson(). INVALID JSON. Cannot proceed.');
                        //        displayAlertDialog('Error in editOrganizationJson(). INVALID JSON. Cannot proceed.');

                        //    } else {
                        //        //alert('VALID JSON');

                        //        //var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
                        //        //var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                        //        //var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                        //        //var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
                        //        //var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

                        //        if (confirm("This is valid JSON. Are you certain you wish to activate this workflow? THIS ACTION CANNOT BE UNDONE.")) {
                        //            // Send JSON to the database for this workflow. // json
                        //            var json = {
                        //                bwTenantId: tenantId,
                        //                bwWorkflowAppId: workflowAppId,
                        //                CreatedBy: participantFriendlyName,
                        //                CreatedById: participantId,
                        //                CreatedByEmail: participantEmail,
                        //                bwOrgRolesJson: bwOrgRolesJson, //JSON.stringify(json),
                        //                bwOrgRolesActive: true
                        //            };
                        //            debugger;
                        //            $.ajax({
                        //                //url: thiz.options.operationUriPrefix + "odata/OrgRolesConfiguration", // This also updates the participants when Role.ParticipantIsDirty == true. The web service has to iterate through all nodes and process these. Then mark as false, before saving the json.
                        //                //url: this.options.operationUriPrefix + "_bw/ForceSaveBwOrgRoles_Without_SynchronizeParticipantOrgRoles", // This also updates the participants when Role.ParticipantIsDirty == true. The web service has to iterate through all nodes and process these. Then mark as false, before saving the json.
                        //                url: thiz.options.operationUriPrefix + "_bw/SaveBwOrgRoles_With_SynchronizeParticipantOrgRoles", // This also updates the participants when Role.ParticipantIsDirty == true. The web service has to iterate through all nodes and process these. Then mark as false, before saving the json.
                        //                type: "Post",
                        //                data: json,
                        //                headers: {
                        //                    "Accept": "application/json; odata=verbose"
                        //                }
                        //            }).success(function (result) {
                        //                try {
                        //                    //debugger;
                        //                    if (result != 'SUCCESS') {
                        //                        alert('Error in editOrganizationJson(): ' + JSON.stringify(result));
                        //                    } else {
                        //                        //debugger;
                        //                        //thiz.hideProgress();
                        //                        console.log('In editOrganizationJson().post: Successfully updated DB. result: ' + JSON.stringify(result)); // using (' + JSON.stringify(json) + ').');
                        //                        // Display a dialog with an "Undo" button!!!!
                        //                        //alert('Successfully updated the database. THIS WORKFLOW CHANGE WILL TAKE PLACE IMMEDIATELY!');
                        //                        //debugger; // xcx1

                        //                        $('#divDisplayJsonDialogForBusinessModelEditor_' + thiz.options.elementIdSuffix).dialog('close'); // Close the editor dialog.

                        //                        // Re-render the Configuration > Organization screen.
                        //                        //$("#divBwOrganizationEditor").bwOrganizationEditor('loadAndRenderBusinessModelEditor'); // This forces the widget to call the webservice and get new OrgRoles data.
                        //                        thiz.loadAndRenderBusinessModelEditor(); // This forces the widget to call the webservice and get new OrgRoles data.

                        //                        //RenderContentForInnerLeftMenuButtons(this, 'ORGANIZATION');


                        //                        //if ($('#divUndoOrgRolesActivationDialog3').is(':visible') != true) { // FIX!!!!!!!!!!!!!!!!! DOING THIS JUST TO GET THINGS WORKING. This gets called too many times here...
                        //                        $(thiz.element).find("#divUndoOrgRolesActivationDialog3").dialog({
                        //                            modal: true,
                        //                            resizable: false,
                        //                            //closeText: "Cancel",
                        //                            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                        //                            //title: 'Project Type picker',
                        //                            width: '800',
                        //                            dialogClass: 'no-close', // No close button in the upper right corner.
                        //                            hide: false, // This means when hiding just disappear with no effects.
                        //                            open: function () {
                        //                                $('.ui-widget-overlay').bind('click', function () {
                        //                                    $(thiz.element).find('#divUndoOrgRolesActivationDialog3').dialog('close');
                        //                                });
                        //                            },
                        //                            close: function () {
                        //                                $('#divUndoOrgRolesActivationDialog3').dialog("destroy");
                        //                                //    //thiz._create(); // When the user closes this dialog, we regenerate the screen to reflect the newly created and activated workflow. <<< NOT NECESSARY!!!! ONLY USING FOR TESTING.
                        //                                //    debugger;
                        //                                //    thiz.checkIfWeHaveToDisplayThePublishChangesButton();
                        //                            }
                        //                        });
                        //                        //$('#divUndoOrgRolesActivationDialog3').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
                        //                        //}
                        //                        // re-sync this.options.store
                        //                        //var oldJsonString = JSON.stringify(this.options.store.Workflow);
                        //                        //thiz.options.store.DraftGlobal = JSON.parse(JSON.stringify(thiz.options.store.Global)); //var newJsonString = JSON.stringify(this.options.store.DraftWorkflow);

                        //                        //thiz.checkIfWeHaveToDisplayThePublishChangesButton();


                        //                        //alert('In saveOrgRolesConfigurationAndActivateAndUpdateParticipants(): WE NEED TO CHECK THE JSON FOR ParticipantIsDirty SO THAT WE UPDATE THE xx TABLE ACCODINGLY!!!!');
                        //                    }

                        //                } catch (e) {
                        //                    console.log('Exception in editOrganizationJson().xx.update: ' + e.message + ', ' + e.stack);
                        //                    alert('Exception in editOrganizationJson().xx.update: ' + e.message + ', ' + e.stack);
                        //                }
                        //            }).error(function (data, errorCode, errorMessage) {
                        //                debugger;
                        //                //thiz.hideProgress();
                        //                var msg;
                        //                if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                        //                    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                        //                } else {
                        //                    msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
                        //                }
                        //                console.log('Fail in editOrganizationJson().xx.update: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
                        //                alert('Fail in editOrganizationJson().xx.update: ' + thiz.options.operationUriPrefix + '_bw/SaveBwOrgRoles_Without_SynchronizeParticipantOrgRoles' + ', ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                        //                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                        //                //var error = JSON.parse(data.responseText)["odata.error"];
                        //                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                        //            });

                        //        }
                        //    }

                        //});

                    } catch (e) {
                        console.log('Exception in editOrganizationJson():2: ' + e.message + ', ' + e.stack);
                        alert('Exception in editOrganizationJson():2: ' + e.message + ', ' + e.stack);
                    }

                }, // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.
                close: function () {

                    $('#divDisplayJsonDialogForBusinessModelEditor_' + thiz.options.elementIdSuffix).dialog('destroy');

                }
            });
            //$("#divDisplayJsonDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

        } catch (e) {
            console.log('Exception in bwOrganizationEditor.js.editOrganizationJson(): ' + e.message + ', ' + e.stack);
            this.displayAlertDialog('Exception in bwOrganizationEditor.js.editOrganizationJson(): ' + e.message + ', ' + e.stack);
        }
    },


    runJsonDiagnostics: function () {
        try {
            // "Run Diagnostics" button.
            console.log('In bwOrganizationEditor.js.runJsonDiagnostics().');
            var thiz = this;

            var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            // Call web service to do this. GET rundiagnosticsfororganizationjsonandbwworkflowuserroletablesynchronization().
            $.ajax({
                url: this.options.operationUriPrefix + "odata/rundiagnosticsfororganizationjsonandbwworkflowuserroletablesynchronization/" + tenantId + '/' + workflowAppId, //?$filter=Active eq true", //('eCarWorkflow')", // Get the eCarWorkflow json/definition from the database.
                dataType: "json",
                contentType: "application/json",
                type: "Get",
                timeout: this.options.ajaxTimeout
            }).done(function (result) {
                //debugger;
                try {
                    if (result.message != 'SUCCESS') {
                        displayAlertDialog(result.message);
                    } else {



                        //displayAlertDialog('A diagnostics screen will be displayed here. This makes sure the organization JSON is synchronized with the BwWorkflowUserRole table. result: ' + JSON.stringify(result));

                        //
                        // We trust the app to keep this JSON in sync with the BwWorkflowUserRole table. It may not be 100%, that is why we have these diagnostics.
                        // 

                        //
                        // Now that we have the JSON we need to iterate through and check it matches with the xx table.
                        //
                        // We are doing it by "Org". We are iterating through each Org in the JSON, then querying the database to compare and add to the report.
                        //
                        //
                        // We send all the data back to the client, where the report will be produced. This keeps a bunch of work off the server and pushes it to the client side.
                        //

                        //var result = {
                        //    message: 'SUCCESS',
                        //    OrganizationJson: organizationJson,
                        //    BwWorkflowUserRoleTable: wurResult
                        //};

                        // This is how we are formatting this role object.
                        //var Role = {
                        //    OrgId: xx,
                        //    OrgName: xx, // Not available from the table.
                        //    RoleId: xx,
                        //    RoleName: xx, // Not available from the table.
                        //    ParticipantId: xx,
                        //    ParticipantFriendlyName: xx,
                        //    ParticipantEmail: xx
                        //}

                        var JsonRoles = []; // Array of "Role"
                        var TableRoles = []; // Array of "Role"

                        //
                        // Populate TableRoles.
                        //
                        var bwWorkflowUserRoleTable = result.BwWorkflowUserRoleTable;
                        for (var i = 0; i < bwWorkflowUserRoleTable.length; i++) {
                            var orgId = bwWorkflowUserRoleTable[i].OrgId; // 'ALL', etc. //RoleId
                            var roleId = bwWorkflowUserRoleTable[i].RoleId;
                            var bwParticipantId = bwWorkflowUserRoleTable[i].bwParticipantId;
                            var bwParticipantFriendlyName = bwWorkflowUserRoleTable[i].bwParticipantFriendlyName;
                            var bwParticipantEmail = bwWorkflowUserRoleTable[i].bwParticipantEmail;
                            var role = {
                                OrgId: orgId,
                                //OrgName: xx, // Not available from the table.
                                RoleId: roleId,
                                //RoleName: xx, // Not available from the table.
                                ParticipantId: bwParticipantId,
                                ParticipantFriendlyName: bwParticipantFriendlyName,
                                ParticipantEmail: bwParticipantEmail
                            }
                            TableRoles.push(role);
                        }

                        //
                        // Populate JsonRoles.
                        //
                        var json = result.OrganizationJson;
                        // First we process the root node, json.Global.Roles;
                        var orgId = json.Global.Id; // 'ALL', etc. 
                        var orgName = json.Global.Name;
                        if (json.Global.Roles) {
                            for (var r = 0; r < json.Global.Roles.length; r++) {
                                var roleId = json.Global.Roles[r].RoleId;
                                var roleName = json.Global.Roles[r].RoleName;
                                var bwParticipantId = json.Global.Roles[r].ParticipantId;
                                var bwParticipantFriendlyName = json.Global.Roles[r].ParticipantFriendlyName;
                                var bwParticipantEmail = json.Global.Roles[r].ParticipantEmail;
                                var role = {
                                    OrgId: orgId,
                                    OrgName: orgName,
                                    RoleId: roleId,
                                    RoleName: roleName,
                                    ParticipantId: bwParticipantId,
                                    ParticipantFriendlyName: bwParticipantFriendlyName,
                                    ParticipantEmail: bwParticipantEmail
                                }
                                JsonRoles.push(role);
                            }
                        }
                        // Then we iterate through the Divisions.
                        for (var d = 0; d < json.Global.Divisions.Items.length; d++) {
                            var orgId = json.Global.Divisions.Items[d].Id; // 'ALL', etc. 
                            var orgName = json.Global.Divisions.Items[d].Name;
                            if (json.Global.Divisions.Items[d].Roles) {
                                for (var r = 0; r < json.Global.Divisions.Items[d].Roles.length; r++) {
                                    var roleId = json.Global.Divisions.Items[d].Roles[r].RoleId;
                                    var roleName = json.Global.Divisions.Items[d].Roles[r].RoleName;
                                    var bwParticipantId = json.Global.Divisions.Items[d].Roles[r].ParticipantId;
                                    var bwParticipantFriendlyName = json.Global.Divisions.Items[d].Roles[r].ParticipantFriendlyName;
                                    var bwParticipantEmail = json.Global.Divisions.Items[d].Roles[r].ParticipantEmail;
                                    var role = {
                                        OrgId: orgId,
                                        OrgName: orgName,
                                        RoleId: roleId,
                                        RoleName: roleName,
                                        ParticipantId: bwParticipantId,
                                        ParticipantFriendlyName: bwParticipantFriendlyName,
                                        ParticipantEmail: bwParticipantEmail
                                    }
                                    JsonRoles.push(role);
                                }
                            }
                            //Now interate through the Groups.
                            for (var g = 0; g < json.Global.Divisions.Items[d].Groups.Items.length; g++) {
                                var orgId = json.Global.Divisions.Items[d].Groups.Items[g].Id; // 'ALL', etc. 
                                var orgName = json.Global.Divisions.Items[d].Groups.Items[g].Name;
                                if (json.Global.Divisions.Items[d].Groups.Items[g].Roles) {
                                    for (var r = 0; r < json.Global.Divisions.Items[d].Groups.Items[g].Roles.length; r++) {
                                        var roleId = json.Global.Divisions.Items[d].Groups.Items[g].Roles[r].RoleId;
                                        var roleName = json.Global.Divisions.Items[d].Groups.Items[g].Roles[r].RoleName;
                                        var bwParticipantId = json.Global.Divisions.Items[d].Groups.Items[g].Roles[r].ParticipantId;
                                        var bwParticipantFriendlyName = json.Global.Divisions.Items[d].Groups.Items[g].Roles[r].ParticipantFriendlyName;
                                        var bwParticipantEmail = json.Global.Divisions.Items[d].Groups.Items[g].Roles[r].ParticipantEmail;
                                        var role = {
                                            OrgId: orgId,
                                            OrgName: orgName,
                                            RoleId: roleId,
                                            RoleName: roleName,
                                            ParticipantId: bwParticipantId,
                                            ParticipantFriendlyName: bwParticipantFriendlyName,
                                            ParticipantEmail: bwParticipantEmail
                                        }
                                        JsonRoles.push(role);
                                    }
                                }
                                // Now iterate through the Legal Entities.
                                for (var e = 0; e < json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items.length; e++) {
                                    var orgId = json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Id; // 'ALL', etc. 
                                    var orgName = json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Name;
                                    if (json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Roles) {
                                        for (var r = 0; r < json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Roles.length; r++) {
                                            var roleId = json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Roles[r].RoleId;
                                            var roleName = json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Roles[r].RoleName;
                                            var bwParticipantId = json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Roles[r].ParticipantId;
                                            var bwParticipantFriendlyName = json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Roles[r].ParticipantFriendlyName;
                                            var bwParticipantEmail = json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Roles[r].ParticipantEmail;
                                            var role = {
                                                OrgId: orgId,
                                                OrgName: orgName,
                                                RoleId: roleId,
                                                RoleName: roleName,
                                                ParticipantId: bwParticipantId,
                                                ParticipantFriendlyName: bwParticipantFriendlyName,
                                                ParticipantEmail: bwParticipantEmail
                                            }
                                            JsonRoles.push(role);
                                        }
                                    }
                                    // Now iterate through the Locations.
                                    for (var l = 0; l < json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items.length; l++) {
                                        var orgId = json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Id; // 'ALL', etc. 
                                        var orgName = json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Name;
                                        if (json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Roles) {
                                            for (var r = 0; r < json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Roles.length; r++) {
                                                var roleId = json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Roles[r].RoleId;
                                                var roleName = json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Roles[r].RoleName;
                                                var bwParticipantId = json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Roles[r].ParticipantId;
                                                var bwParticipantFriendlyName = json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Roles[r].ParticipantFriendlyName;
                                                var bwParticipantEmail = json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Roles[r].ParticipantEmail;
                                                var role = {
                                                    OrgId: orgId,
                                                    OrgName: orgName,
                                                    RoleId: roleId,
                                                    RoleName: roleName,
                                                    ParticipantId: bwParticipantId,
                                                    ParticipantFriendlyName: bwParticipantFriendlyName,
                                                    ParticipantEmail: bwParticipantEmail
                                                }
                                                JsonRoles.push(role);
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        //
                        // At this point we have our two arrays: 
                        //var JsonRoles = []; // Array of "Role"
                        //var TableRoles = []; // Array of "Role"
                        //
                        // We need to compare them and find what is missing and does not match.
                        //


                        var TheseRolesAreMissingInTheJson = [];
                        var TheseRolesAreMissingInTheTable = [];

                        for (var t = 0; t < TableRoles.length; t++) {
                            var tableRole = TableRoles[t];
                            var tableRoleExistsInJson = false;
                            for (var j = 0; j < JsonRoles.length; j++) {
                                // Check if the TableRole exist in the JsonRoles.
                                if (JsonRoles[j].OrgId == TableRoles[t].OrgId && JsonRoles[j].RoleId == TableRoles[t].RoleId) {
                                    tableRoleExistsInJson = true;
                                }
                            }
                            if (tableRoleExistsInJson == false) {
                                TheseRolesAreMissingInTheJson.push(TableRoles[t]);
                            }
                        }

                        for (var j = 0; j < JsonRoles.length; j++) {
                            var jsonRole = JsonRoles[j];
                            var jsonRoleExistsInTable = false;
                            for (var t = 0; t < TableRoles.length; t++) {
                                // Check if the TableRole exist in the JsonRoles.
                                if (JsonRoles[j].OrgId == TableRoles[t].OrgId && JsonRoles[j].RoleId == TableRoles[t].RoleId) {
                                    jsonRoleExistsInTable = true;
                                }
                            }
                            if (jsonRoleExistsInTable == false) {
                                TheseRolesAreMissingInTheTable.push(JsonRoles[j]);
                            }
                        }

                        //displayAlertDialog('TheseRolesAreMissingInTheJson: ' + JSON.stringify(TheseRolesAreMissingInTheJson) + ', TheseRolesAreMissingInTheTable: ' + JSON.stringify(TheseRolesAreMissingInTheTable));
                        //var json = this.options.store.Global;
                        //document.getElementById('spanDisplayJsonDialogTitle').innerHTML = 'Organization JSON'; // Title
                        //document.getElementById('spanDisplayJsonDialogContent').innerHTML = 'Diagnostics results:'; //'We trust the app to keep this JSON in sync with the BwWorkflowUserRole table.'; // Summary text
                        //debugger;
                        var html = '';
                        html += '<span style="font-weight:bold;color:tomato;">Diagnostics results</span><br /><br />';
                        html += '<span style="font-weight:bold;">These Roles Are Missing In The Json:</span><br />' + JSON.stringify(TheseRolesAreMissingInTheJson, null, 2);
                        html += '<br /><br />';
                        html += '<span style="font-weight:bold;">These Roles Are Missing In The Table:</span><br />' + JSON.stringify(TheseRolesAreMissingInTheTable, null, 2);
                        html += '<br /><br /><span style="font-weight:bold;">DONE</span><br />';
                        $('#divDisplayJsonDialogForBusinessModelEditor_' + thiz.options.elementIdSuffix).find('#divDisplayJsonDialogForBusinessModelEditor_txtDisplayJsonDialogJSON')[0].innerHTML = html; // $("#divDisplayJsonDialogForBusinessModelEditor").find('#txtDisplayJsonDialogJSON')[0].innerHTML = html;
                        //$('#txtDisplayJsonDialogJSON').empty();
                        //$('#txtDisplayJsonDialogJSON').append('<span style="font-weight:bold;color:tomato;">Diagnostics results</span><br /><br />');
                        //$('#txtDisplayJsonDialogJSON').append('<span style="font-weight:bold;">These Roles Are Missing In The Json:</span><br />' + JSON.stringify(TheseRolesAreMissingInTheJson, null, 2));
                        //$('#txtDisplayJsonDialogJSON').append('<br /><br />');
                        //$('#txtDisplayJsonDialogJSON').append('<span style="font-weight:bold;">These Roles Are Missing In The Table:</span><br />' + JSON.stringify(TheseRolesAreMissingInTheTable, null, 2));
                        //$('#txtDisplayJsonDialogJSON').append('<br /><br /><span style="font-weight:bold;">DONE</span><br />');

                    }
                } catch (e) {
                    console.log('Exception in bwOrganizationEditor.runJsonDiagnostics():1: ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in bwOrganizationEditor.runJsonDiagnostics():1: ' + e.message + ', ' + e.stack);
                }
            }).fail(function (data) {
                console.log('In runJsonDiagnostics.fail(): ' + JSON.stringify(data));
                var msg;
                if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                } else {
                    msg = JSON.stringify(data);
                }
                alert('.fail() in bwOrganizationEditor.runJsonDiagnostics():2: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                console.log('.fail() in bwOrganizationEditor.runJsonDiagnostics():2: ' + JSON.stringify(data));
                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                //var error = JSON.parse(data.responseText)["odata.error"];
                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            });

        } catch (e) {
            console.log('Exception in bwOrganizationEditor.runJsonDiagnostics(): ' + e.message + ', ' + e.stack);
        }
    },


    expandOrCollapseWorkflowStep: function (rowId, imageId, collapsibleRowId) { // collapsibleRowId = steprow-' + stepName.toLowerCase() + '_' + i + '_' + '0'
        try {
            console.log('In bwOrganizationEditor.js.expandOrCollapseWorkflowStep(' + rowId + ', ' + imageId + ', ' + collapsibleRowId + ').');

            //
            // Get the steprow_i class name. This is how we identify the underlying rows so that we can collapse or expand the whole step/section.
            var rowindex = imageId.split('stepimage_')[1];
            var stepSectionClass = 'steprow_' + rowindex;
            //debugger;
            var img = document.getElementById(imageId);
            if (img) {
                var urlClosed = this.options.operationUriPrefix + 'images/drawer-close.png'; //https://budgetworkflow.com/images/drawer-close.png
                var urlOpened = this.options.operationUriPrefix + 'images/drawer-open.png';
                var collapsibleRow = document.getElementById(collapsibleRowId);
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

            // Since a workflow step has been either expanded or collapsed, we need to redraw the lines.
            this.renderOrgRoleConnectorsToWorkflow(true); // lastSelectedDivisionGroupEntityLocationIndexes: null, // lastSelectedDivisionGroupEntityLocation { Division, Group, LegalEntity, Location }



        } catch (e) {
            console.log('Exception in expandOrCollapseWorkflowStep(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in expandOrCollapseWorkflowStep(): ' + e.message + ', ' + e.stack);
        }
    },

    renderWorkflowPeoplePicker: function (tagName) {
        // This was originally a copy of the bwWorkflowEditor.renderWorkflowEditor method! May be an opportunity to abstract/break out this in the future.
        try {
            console.log('In bwOrganizationEditor.js.renderWorkflowPeoplePicker().');
            var thiz = this;

            if (document.getElementById('selectRequestTypeDropDown') && document.getElementById('selectRequestTypeDropDown').style && document.getElementById('selectRequestTypeDropDown').style.display) {
                document.getElementById('selectRequestTypeDropDown').style.display = 'inline'; // Only display this when "Workflow" is selected.
            }

            var bwRequestTypeId;
            $('#selectRequestTypeDropDown').find('option:selected').each(function (index, element) {
                bwRequestTypeId = element.value;
            });
            debugger; // We need to make sure that CurrentWorkflow gets loaded here...
            for (var i = 0; i < thiz.options.Workflows.length; i++) {
                if ((thiz.options.Workflows[i].bwRequestTypeId == bwRequestTypeId) && (thiz.options.Workflows[i].isActive == true)) {
                    if (thiz.options.Workflows[i].bwWorkflowJson) {
                        var bwWorkflowJson = thiz.options.Workflows[i].bwWorkflowJson;
                        thiz.options.CurrentWorkflow = {
                            bwRequestTypeId: bwRequestTypeId,
                            Workflow: JSON.parse(bwWorkflowJson),
                            DraftWorkflow: JSON.parse(bwWorkflowJson)
                        }
                        break;
                    } else {
                        console.log('');
                        console.log('INVALID VALUE FOR thiz.options.Workflows[i].bwWorkflowJson:xcx2354: ' + thiz.options.Workflows[i].bwWorkflowJson);
                        console.log('');
                    }
                }
            }

            if (!thiz.options.CurrentWorkflow) {

                var requestTypes = $('.bwAuthentication').bwAuthentication('option', 'bwEnabledRequestTypes').EnabledItems;

                var thisRequestType;
                for (var i = 0; i < requestTypes.length; i++) {
                    if (requestTypes[i].bwRequestTypeId == bwRequestTypeId) {
                        thisRequestType = requestTypes[i].PluralName;
                        break;
                    }
                }

                var msg = 'Error in renderWorkflowPeoplePicker(). Could not find the workflow, failed to set CurrentWorkflow. bwRequestTypeId: ' + bwRequestTypeId + ', "' + thisRequestType + '". There were a total of ' + thiz.options.Workflows.length + ' workflows.';
                console.log(msg);
                displayAlertDialog(msg);

            } else {

                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

                var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                var data = {
                    bwParticipantId_LoggedIn: participantId,
                    bwActiveStateIdentifier: activeStateIdentifier,
                    bwWorkflowAppId_LoggedIn: workflowAppId,

                    bwWorkflowAppId: workflowAppId,
                    bwRequestTypeId: bwRequestTypeId,
                    bwOrgId: 'root' // 'root' returns everything/all.
                };

                var operationUri = this.options.operationUriPrefix + '_bw/racirolesandparticipants';
                $.ajax({
                    url: operationUri,
                    type: 'POST',
                    data: data,
                    headers: { "Accept": "application/json; odata=verbose" },
                    success: function (results) {
                        try {
                            console.log('In renderWorkflowPeoplePicker():2:.');

                            if (results.status != 'SUCCESS') {

                                var msg = 'Error in bwOrganizationEditor.js.renderWorkflowPeoplePicker(). ' + results.status + ', ' + results.message;
                                console.log(msg);
                                displayAlertDialog(msg);

                            } else {

                                var workflow;
                                workflow = thiz.options.CurrentWorkflow; // We are doing it this way, but odata/racirolesandparticipants/ returns the workflow as well so look at this and readjust at some point. 3-21-2023.

                                if (!workflow) {
                                    //debugger;
                                    console.log('NO WORKFLOW FOUND. THIS PROCESS CANNOT CONTINUE.xcx2 workflowAppId: ' + workflowAppId + ', bwRequestTypeId: ' + bwRequestTypeId);
                                    //    for (var i = 0; i < thiz.options.CurrentWorkflow.length; i++) {
                                    //        if (thiz.options.CurrentWorkflow[i].bwRequestType == selectedRequestType_text && thiz.options.CurrentWorkflow[i].bwWorkflowActive == true) {
                                    //            //debugger;
                                    //            // This is the workflow.
                                    //            workflow = thiz.options.CurrentWorkflow[i];
                                    //            break;
                                    //        }
                                    //    }
                                }

                                var car = workflow; //thiz.options.CurrentWorkflow; //.store;

                                var html = '';
                                if (car == null) {
                                    html += '<span style="font-size:24pt;color:red;">NO DATA</span>';
                                } else {

                                    // Include jquery-ui stylesheet.
                                    //html += '<link rel="stylesheet" href="css/jquery/1.11.1/themes/smoothness/jquery-ui.min.css?v=0">'; // removed 8-18-2022
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
                                    html += '}';
                                    html += '.steprow-hidden {';
                                    html += '    visibility: collapse;';
                                    html += '}';

                                    html += '.steprow:hover {';
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

                                    html += '<table border="1" style="border-color:#d8d8d8;">';
                                    //debugger;
                                    if (!car.Workflow) {
                                        html += '<tr>';
                                        html += '  <td>';
                                        html += '    NO WORKFLOW JSON. CANNOT PROCEED. xcx32456-1';
                                        html += '  </td>';
                                        html += '</tr>';

                                    } else {

                                        html += '                       <span title="Expand or Collapse ALL..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'expandOrCollapseAllWorkflowSteps\');" style="width:200px;padding:5px 10px 5px 10px;margin:0 0 0 20px;white-space:nowrap;vertical-align:top;border:1px solid lightblue;cursor:pointer;font-weight:normal;font-size:20pt;">';
                                        html += '                           <span style="display:inline-block;">+/-</span>';
                                        html += '                       </span>';










                                        // Iterate through all of the steps.
                                        for (var i = 0; i < car.Workflow.Steps.Step.length; i++) {
                                            var stepName = car.Workflow.Steps.Step[i]["@Name"];
                                            if (false) {
                                                // Do nothing, not displaying these steps. << DISPLAYING all steps now!
                                            } else {
                                                var newStepName = car.Workflow.Steps.Step[i]["@FriendlyName"];
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

                                                var cellColor = '#f5f6f7';

                                                if (stepName != 'Create' && stepName != 'Revise' && stepName != 'Admin') {

                                                    // Display the header row for this step.
                                                    html += '<tr id="stepheaderrow_' + i + '" style="border:0px;cursor:pointer;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'expandOrCollapseWorkflowStep\', \'' + 'stepname_' + i + '\', \'' + 'stepimage_' + i + '\', \'steprow-' + stepName.toLowerCase() + '_' + i + '_' + '0' + '\');">';
                                                    html += '  <td colspan="11" class="stepheadercell" style="font-weight:bold;padding:10px;background-color:' + cellColor + ';" >';
                                                    html += '    <table style="width:100%;">';
                                                    html += '      <tr>';
                                                    html += '        <td>';
                                                    //html += '          <span style="white-space:nowrap;"><span id="stepname_' + i + '" class="stepname" style="cursor:cell;" title="Double-click to edit the step name...">' + newStepName + '</span>';
                                                    html += '          <span style="white-space:nowrap;">';


                                                    //html += '<span id="stepname_' +i + '" class="stepname" style="cursor:cell;" title="Double-click to edit the step name...">' +newStepName + '</span>';
                                                    // EXPAND COLLAPSE!!!!!!!!!!!!!!!! 1-26-2020
                                                    html += '            <span id="stepname_' + i + '" class="stepname" style="cursor:cell;vertical-align:middle;" >';
                                                    html += '              <img id="stepimage_' + i + '" src="images/drawer-open.png" title="collapse" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;"  />';
                                                    html += '              &nbsp;' + newStepName;

                                                    if (car.Workflow.Steps.Step[i]["@Name"] == 'Collaboration') {
                                                        //debugger;
                                                        var timeout = car.Workflow.Steps.Step[i]["@Timeout"];
                                                        var timeoutUnits = car.Workflow.Steps.Step[i]["@TimeoutUnits"]
                                                        html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + timeout + '&nbsp' + timeoutUnits;
                                                    }



                                                    html += '            </span>';


                                                    html += '          </span>';
                                                    html += '        </td>';
                                                    html += '        <td></td>';
                                                    html += '        <td style="text-align:center;">';
                                                    // Display the consensus timeout section and the "Configure Email", and "Add PArticipants" buttons.
                                                    html += '           <table style="width:100%;">';
                                                    html += '               <tr>';
                                                    html += '                   <td></td>';
                                                    html += '                   <td></td>';
                                                    html += '                   <td></td>';

                                                    html += '                   <td></td>';

                                                    html += '                   <td style="text-align:right;">';
                                                    if (stepName.toLowerCase() == 'admin') {
                                                        // No "Add a participant" button for the ADMIN step/stage.
                                                    } else {
                                                        //html += '&nbsp;&nbsp;&nbsp;&nbsp;';
                                                        //html += '          <input type="button" class="buttonAddNewAssignmentRow" style="white-space:nowrap;padding:5px 10px 5px 10px;" value="✚ Add a Participant" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'addNewRow\', \'' + 'steprow-inform_' + i + '_' + '0' + '\');" />';
                                                    }
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

                                                    } else {
                                                        // Display Inform roles.
                                                        if (car.Workflow.Steps.Step[i].Inform && car.Workflow.Steps.Step[i].Inform.length) {
                                                            if (car.Workflow.Steps.Step[i].Inform.length > 0) {
                                                                for (var j = 0; j < car.Workflow.Steps.Step[i].Inform.length; j++) {
                                                                    var xid = 'steprow-inform_' + i + '_' + j;
                                                                    var additionalRowClass = '';
                                                                    html += '<tr id="steprow-inform_' + i + '_' + j + '" class="steprow' + additionalRowClass + ' steprow_' + i + '" style="cursor:cell;display:none;" >';
                                                                    html += '  <td style="width:30px;"></td>';

                                                                    if (thiz.options.displayRoleIdColumn) {
                                                                        if (car.Workflow.Steps.Step[i].Inform[j]) {
                                                                            if (car.Workflow.Steps.Step[i].Inform[j]["@Role"]) {
                                                                                html += '<td style="background-color:' + cellColor + ';" class="roleid steprowcell" bwroleid="' + car.Workflow.Steps.Step[i].Inform[j]["@Role"] + '" bwOldValue="' + car.Workflow.Steps.Step[i].Inform[j]["@Role"] + '">' + car.Workflow.Steps.Step[i].Inform[j]["@Role"] + '</td>';
                                                                            } else {
                                                                                html += '<td style="background-color:' + cellColor + ';" class="roleid steprowcell" bwroleid="' + car.Workflow.Steps.Step[i].Inform[j]["@Role"] + '" bwOldValue="' + car.Workflow.Steps.Step[i].Inform[j]["@Role"] + '">' + car.Workflow.Steps.Step[i].Inform[j]["@IdField"] + '</td>';
                                                                            }
                                                                        }
                                                                    }

                                                                    // Todd changed 10-13-19 7-32am ast
                                                                    var roleName = '';
                                                                    var roleId = '';
                                                                    var roleCategory = '';
                                                                    if (car.Workflow.Steps.Step[i].Inform[j]) {
                                                                        roleName = car.Workflow.Steps.Step[i].Inform[j]["@RoleName"];
                                                                        roleId = car.Workflow.Steps.Step[i].Inform[j]["@Role"];
                                                                        roleCategory = 'Inform';
                                                                    }
                                                                    //
                                                                    // Now that we have the roleName, we need to travel up through the organizational structure to determine if this role is assigned already!
                                                                    //
                                                                    html += '<td style="background-color:' + cellColor + ';" class="rolename steprowcell" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'' + cellColor + '\';" bwStepname="' + car.Workflow.Steps.Step[i]["@Name"] + '" bwroleid="' + car.Workflow.Steps.Step[i].Inform[j]["@Role"] + '" bwOldValue="' + roleName + '">';
                                                                    var roleAssigned = true;
                                                                    if (roleAssigned) {
                                                                        //html += '<span style="color:grey;font-size:12pt;font-style:italic;">';
                                                                        html += '<span style="font-size:12pt;">';
                                                                        html += roleName;

                                                                        //html += '<br />';
                                                                        //html += 'Nova Scotia 98765 Inc.';

                                                                        html += '</span>';
                                                                    } else {
                                                                        html += '<span style="color:red;font-size:12pt;font-style:italic;">';
                                                                        html += roleName;
                                                                        html += '</span>';
                                                                    }
                                                                    html += '</td>';


                                                                    var tooltip = 'RACI: ';
                                                                    tooltip += '\n';
                                                                    tooltip += 'R = Responsible (also Recommender)  ';
                                                                    tooltip += '\n';
                                                                    tooltip += 'A = Accountable (also Approver or final approving authority)  ';
                                                                    tooltip += '\n';
                                                                    tooltip += 'C = Consulted (sometimes Consultant or counsel)  ';
                                                                    tooltip += '\n';
                                                                    tooltip += 'I = Informed (also Informee)  ';


                                                                    html += '<td title="' + tooltip + '" style="color:grey;">' + roleCategory + '</td>';






                                                                    html += '  <td class="steprowbuttons steprowcell" style="background-color:' + cellColor + ';width:80px;text-align:right;padding-right:15px;" >';
                                                                    //debugger; // 1
                                                                    //
                                                                    // Display the role participants.
                                                                    //
                                                                    var bwParticipantId, bwParticipantFriendlyName, bwParticipantEmail;
                                                                    try {
                                                                        for (var p = 0; p < results.RolesAndParticipants.length; p++) {
                                                                            if (roleId == results.RolesAndParticipants[p].RoleId) {
                                                                                bwParticipantId = results.RolesAndParticipants[p].Participants[0].bwParticipantId;
                                                                                bwParticipantFriendlyName = results.RolesAndParticipants[p].Participants[0].bwParticipantFriendlyName;
                                                                                bwParticipantEmail = results.RolesAndParticipants[p].Participants[0].bwParticipantEmail;
                                                                            }
                                                                        }
                                                                    } catch (e) {
                                                                        console.log('Exception displaying participants:1-1: ' + e.message + ', ' + e.stack);
                                                                    }
                                                                    if (bwParticipantFriendlyName) {
                                                                        //debugger; // 1
                                                                        html += '<span xcx="xcx234566-1" style="cursor:pointer;" onclick="$(\'.bwCircleDialog2\').bwCircleDialog2(\'displayParticipantRoleMultiPickerInACircle\', true, \'\', \'' + bwParticipantId + '\', \'' + bwParticipantFriendlyName + '\', \'' + bwParticipantEmail + '\', \'' + bwParticipantLogonType + '\');">';
                                                                        html += bwParticipantFriendlyName;
                                                                        html += '</span>';
                                                                    }

                                                                    //html += '[PEOPLE PICKER]  [...]';
                                                                    //html += '&nbsp;&nbsp;';
                                                                    //html += '    <input style="padding:5px 10px 5px 10px;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'renderEditSteprow\', \'' + xid + '\');" type="button" value="⚙ Edit">';

                                                                    html += '  </td>';

                                                                    html += '</tr>';
                                                                }
                                                            }
                                                        }
                                                        // Display Assign roles.
                                                        if (car.Workflow.Steps.Step[i].Assign) {
                                                            if (car.Workflow.Steps.Step[i].Assign.length > 0) {
                                                                for (var j = 0; j < car.Workflow.Steps.Step[i].Assign.length; j++) {
                                                                    var xid = 'steprow-assign_' + i + '_' + j;
                                                                    var additionalRowClass = '';
                                                                    html += '<tr id="steprow-assign_' + i + '_' + j + '" class="steprow' + additionalRowClass + ' steprow_' + i + '" style="cursor:cell;display:none;" >';

                                                                    html += '  <td style="width:30px;"></td>';

                                                                    if (thiz.options.displayRoleIdColumn) {
                                                                        html += '<td style="background-color:' + cellColor + ';" class="roleid steprowcell" bwroleid="' + car.Workflow.Steps.Step[i].Assign[j]["@Role"] + '" bwOldValue="' + car.Workflow.Steps.Step[i].Assign[j]["@Role"] + '">' + car.Workflow.Steps.Step[i].Assign[j]["@Role"] + '</td>';
                                                                    }

                                                                    // Todd changed 10-13-19 7-32am ast
                                                                    var roleName = '';
                                                                    var roleId = '';
                                                                    var roleCategory = '';
                                                                    if (car.Workflow.Steps.Step[i].Assign[j]) {
                                                                        roleName = car.Workflow.Steps.Step[i].Assign[j]["@RoleName"];
                                                                        roleId = car.Workflow.Steps.Step[i].Assign[j]["@Role"];
                                                                        roleCategory = car.Workflow.Steps.Step[i].Assign[j]["@RoleCategory"];
                                                                    }

                                                                    html += '<td style="background-color:' + cellColor + ';" class="rolename steprowcell" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'' + cellColor + '\';" bwStepname="' + car.Workflow.Steps.Step[i]["@Name"] + '" bwroleid="' + car.Workflow.Steps.Step[i].Assign[j]["@Role"] + '" bwOldValue="' + roleName + '">';

                                                                    html += roleName;
                                                                    html += '<br />';
                                                                    html += '</td>';

                                                                    var tooltip = 'RACI: ';
                                                                    tooltip += '\n';
                                                                    tooltip += 'R = Responsible (also Recommender)  ';
                                                                    tooltip += '\n';
                                                                    tooltip += 'A = Accountable (also Approver or final approving authority)  ';
                                                                    tooltip += '\n';
                                                                    tooltip += 'C = Consulted (sometimes Consultant or counsel)  ';
                                                                    tooltip += '\n';
                                                                    tooltip += 'I = Informed (also Informee)  ';




                                                                    var checklistHtml = '';
                                                                    if (car.Workflow.Steps.Step[i].Assign[j]["@Cond"]) {
                                                                        var conditionString = car.Workflow.Steps.Step[i].Assign[j]["@Cond"];
                                                                        if (conditionString.indexOf('$ChecklistsRequired~') > -1) {
                                                                            // We know checklists(s) are required, but we only have the checklists GUIDs here... can we look them up so the user can see which checklists?
                                                                            checklistHtml = '<span style="cursor:pointer;" title="This role has checklist(s) to complete: ';
                                                                            var checklists = thiz.options.Checklists;
                                                                            for (var ci = 0; ci < checklists.length; ci++) {
                                                                                if (conditionString.indexOf(checklists[ci].bwChecklistTemplatesId) > -1) {
                                                                                    // We have found a checklist that needs to be completed.
                                                                                    checklistHtml += '\n';
                                                                                    checklistHtml += JSON.parse(checklists[ci].ChecklistJson).Title; // This is the title of the checklist.
                                                                                }
                                                                            }
                                                                            checklistHtml += '">';
                                                                            checklistHtml += '&nbsp;✔&nbsp</span>';
                                                                            //debugger;
                                                                        }
                                                                    }



                                                                    html += '<td title="' + tooltip + '" style="color:grey;">' + roleCategory + checklistHtml + '</td>';



                                                                    html += '<td class="steprowbuttons steprowcell" style="background-color:' + cellColor + ';width:80px;text-align:right;padding-right:15px;" >';
                                                                    //debugger; // 2
                                                                    //
                                                                    // Display the role participants.
                                                                    //
                                                                    var bwParticipantId, bwParticipantFriendlyName, bwParticipantEmail;
                                                                    try {
                                                                        for (var p = 0; p < results.RolesAndParticipants.length; p++) {
                                                                            if (roleId == results.RolesAndParticipants[p].RoleId) {
                                                                                bwParticipantId = results.RolesAndParticipants[p].Participants[0].bwParticipantId;
                                                                                bwParticipantFriendlyName = results.RolesAndParticipants[p].Participants[0].bwParticipantFriendlyName;
                                                                                bwParticipantEmail = results.RolesAndParticipants[p].Participants[0].bwParticipantEmail;
                                                                            }
                                                                        }
                                                                    } catch (e) {
                                                                        console.log('Exception displaying participants:1-2: ' + e.message + ', ' + e.stack);
                                                                    }
                                                                    if (bwParticipantFriendlyName) {
                                                                        //debugger; // 2
                                                                        html += '<span test="xcxtest2" style="cursor:pointer;" onclick="$(\'.bwCircleDialog2\').bwCircleDialog2(\'displayParticipantRoleMultiPickerInACircle\', true, \'\', \'' + bwParticipantId + '\', \'' + bwParticipantFriendlyName + '\', \'' + bwParticipantEmail + '\', \'' + bwParticipantLogonType + '\');">';
                                                                        html += bwParticipantFriendlyName;
                                                                        html += '</span>';
                                                                    }

                                                                    //html += '[PEOPLE PICKER2]  [...]';
                                                                    //html += '&nbsp;&nbsp;';
                                                                    //html += '  <input style="padding:5px 10px 5px 10px;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'renderEditSteprow\', \'' + xid + '\');" type="button" value="⚙ Edit">';

                                                                    html += '</td>';

                                                                    html += '</tr>';
                                                                }
                                                            }
                                                        }
                                                    }
                                                    //html += '</tr>';
                                                }
                                            }
                                        }
                                    }
                                    html += '</table>';





                                    //html += '<div style="display:none;" id="divCreateANewRoleDialog">';
                                    //html += '  <table style="width:100%;">';
                                    //html += '    <tr>';
                                    //html += '      <td style="width:90%;">';
                                    //html += '        <span id="spanCustomSignUpDialogTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Create a new Role</span>';
                                    //html += '      </td>';
                                    //html += '      <td style="width:9%;"></td>';
                                    //html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
                                    //html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divCreateANewRoleDialog\').dialog(\'close\');">X</span>';
                                    //html += '      </td>';
                                    //html += '    </tr>';
                                    //html += '  </table>';
                                    //html += '  <br /><br />';
                                    //html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                                    //html += '  <span id="spanCustomSignUpDialogInvitationDescriptionText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;"></span><br />';
                                    //html += '  <span style="font-family: calibri;">Role Abbreviation</span><br />';
                                    //html += '  <input type="text" id="txtCreateANewRoleDialog_RoleId" style="WIDTH: 93%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 40pt;" /><br /><br />';
                                    //html += '  <span style="font-family: calibri;">Role Name</span><br />';
                                    //html += '  <input type="text" id="txtCreateANewRoleDialog_RoleName" style="WIDTH: 93%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 40pt;" /><br /><br />';
                                    //html += '  <br />';

                                    //html += '  <table style="width:100%;">';
                                    //html += '     <tr>';
                                    //html += '       <td style="text-align:center;">';
                                    //html += '  <input type="button" value="Create your new role now!" style="height:30pt;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'createANewRole\');" />';
                                    //html += '       </td>';
                                    //html += '     </tr>';
                                    //html += '  </table>';
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




                                    html += '<div style="display:none;" id="divWorkflowActionsUnderlyingPropertiesDialog">';
                                    html += '  <table style="width:100%;">';
                                    html += '    <tr>';
                                    html += '      <td style="width:90%;">';
                                    html += '        <span id="spanWorkflowActionsUnderlyingPropertiesDialog" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Action Properties</span>';
                                    html += '                    <br />';
                                    html += '                    <span id="spanWorkflowActionsUnderlyingPropertiesDialogSubTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:normal;">[spanWorkflowActionsUnderlyingPropertiesDialogSubTitle]</span>';
                                    html += '      </td>';
                                    html += '      <td style="width:9%;"></td>';
                                    html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
                                    html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divWorkflowActionsUnderlyingPropertiesDialog\').dialog(\'close\');">X</span>';
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

                                    html += '<div style="display:none;" id="divProgressBarDialog">';
                                    html += '<div id="progressbar" class="ui-progressbar"><div class="progress-label">Loading...</div></div>';
                                    html += '</div>';

                                }

                                document.getElementById(tagName).innerHTML = html; // Had an error from this 8-18-2023. Did not fix just making this note for future reference.

                                thiz.expandOrCollapseAllWorkflowSteps(); // expand by default

                                // Redraw the lines!
                                thiz.renderOrgRoleConnectorsToWorkflow(true, 'root');

                            }

                            HideActivitySpinner();

                        } catch (e) {
                            HideActivitySpinner();
                            var msg = 'Exception in bwOrganizationEditor.js.renderWorkflowPeoplePicker.get.racirolesandparticipants.success(): ' + e.message + ', ' + e.stack;
                            console.log(msg);
                            displayAlertDialog(msg);
                            //document.getElementById(tagName).innerHTML = '<span style="color:tomato;">Errorxcx9205: ' + e.message + ', ' + e.stack + '</span>';
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        HideActivitySpinner();
                        var msg = 'Error in bwOrganizationEditor.js.renderWorkflowPeoplePicker.racirolesandparticipants.error(): ' + errorMessage + ', data: ' + JSON.stringify(data);
                        console.log(msg);
                        displayAlertDialog(msg);
                    }
                });

            }

        } catch (e) {
            HideActivitySpinner();
            var msg = 'Exception in bwOrganizationEditor.js.renderWorkflowPeoplePicker(): ' + e.mesage + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
        }
    },

    selectOrganizationWorkflowOrRolesView_Onchange: function () {
        try {
            console.log('In bwOrganizationEditor.js.selectOrganizationWorkflowOrRolesView_Onchange().');

            if (document.getElementById('selectOrganizationWorkflowOrRolesView_Workflow').checked == true) {

                var requestTypes = $('.bwAuthentication').bwAuthentication('option', 'bwEnabledRequestTypes').EnabledItems; // Global, populated in the beginning when the app loads.

                var html = '';
                html += 'Configure the Organizations\' ';
                html += '<span style="font_weight:bold;color:grey;"><strong>';
                html += '   <select id="selectRequestTypeDropDown" class="selectHomePageWorkflowAppDropDown" onchange="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'WorkflowRequestTypeDropDown_Onchange\');" style=\'display:inline;border-color: whitesmoke; color: grey; font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 1em; font-weight: bold; cursor: pointer;\'>'; // was .5em
                for (var i = 0; i < requestTypes.length; i++) {
                    var selected = '';
                    html += '<option value="' + requestTypes[i].bwRequestTypeId + '" ' + selected + ' >' + requestTypes[i].PluralName + '</option>';
                }
                html += '   </select>';
                html += '</span>';
                $('#spanBwBusinessModelEditor_TopTitle1').html(html);

                this.renderWorkflowPeoplePicker('spanWorkflowPeoplePicker_right');

            } else if (document.getElementById('selectOrganizationWorkflowOrRolesView_RolesAndParticipants').checked == true) {

                var html = '';
                html += 'Configure the Organizations\' Roles and Participants&nbsp;&nbsp;&nbsp;';
                $('#spanBwBusinessModelEditor_TopTitle1').html(html);

                this.renderRolesPeoplePicker('spanWorkflowPeoplePicker_right');

            } else {

                alert('In bwOrganizationEditor.js.selectOrganizationWorkflowOrRolesView_Onchange(). Unexpected value for radio buttons.');

            }

        } catch (e) {
            console.log('Exception in bwOrganizationEditor.js.selectOrganizationWorkflowOrRolesView_Onchange(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwOrganizationEditor.js.selectOrganizationWorkflowOrRolesView_Onchange(): ' + e.message + ', ' + e.stack);
        }
    },

    //renderRolesPeoplePicker_old: function (tagName) {
    //    // This is displayed to the right of the treeview when "Roles and Participants" is selected from the drop down. 
    //    try {
    //        console.log('In renderRolesPeoplePicker(). This is displayed to the right of the treeview when "Roles and Participants" is selected from the drop down.');
    //        var thiz = this;
    //        document.getElementById('selectWorkflowRequestTypeDropDown').style.display = 'none'; // Only display this when "Workflow" is selected.
    //        var data = {
    //            "bwWorkflowId": workflowAppId
    //        };
    //        $.ajax({
    //            url: this.options.operationUriPrefix + "_bw/workflow/participants",
    //            type: "DELETE",
    //            contentType: 'application/json',
    //            data: JSON.stringify(data),
    //            success: function (data1) {
    //                var data = data1.BwWorkflowUsers;
    //                var html = '';
    //                // Include jquery-ui stylesheet.
    //                html += '<link rel="stylesheet" href="css/jquery/1.11.1/themes/smoothness/jquery-ui.min.css?v=0">';
    //                // Inline styles.
    //                html += '<style>';
    //                html += '.titlecell {';
    //                html += '    vertical-align:top;';
    //                html += '    padding-top:3px;';
    //                html += '    padding-bottom:3px;';
    //                html += '    padding-left:5px;';
    //                html += '    padding-right:10px;';
    //                html += '    white-space:nowrap;';
    //                html += '    color:grey;';
    //                html += '    text-decoration:underline;';
    //                html += '}';
    //                html += '.steprowcell {';
    //                html += '    vertical-align:top;';
    //                html += '    padding-top:10px;';
    //                html += '    padding-bottom:10px;';
    //                html += '    padding-left:5px;';
    //                html += '    padding-right:5px;';
    //                html += '    white-space:nowrap;';
    //                html += '}';
    //                html += '.steprow-hidden {';
    //                html += '    visibility: collapse;';
    //                html += '}';
    //                html += '.steprow:hover {';
    //                html += '    background-color: lightgoldenrodyellow;';
    //                html += '}';
    //                html += '.stepheadercell:hover {';
    //                html += '    background-color: gainsboro !important;'; // This is the step header row which expans and collapses.
    //                html += '}';
    //                html += '.activeEditRow {';
    //                html += '    background-color: #EBF6F9;';
    //                html += '}';
    //                html += '.ui-progressbar {';
    //                html += '    position: relative;';
    //                html += '}';
    //                html += '.progress-label {';
    //                html += '    position: absolute;';
    //                html += '    left: 10%;';
    //                html += '    top: 4px;';
    //                html += '    font-weight: bold;';
    //                html += '    color: black;';
    //                html += '    text-shadow: 1px 1px 0 #fff;';
    //                html += '}';
    //                html += '#progressbar .ui-progressbar-value {';
    //                html += '    background-color: cyan;';
    //                html += '}';
    //                html += '.transparent-dialog {';
    //                html += '  background: transparent;';
    //                html += '  border: none;';
    //                html += '}';
    //                html += '.transparent-dialog .ui-widget-header {';
    //                html += '  border: none;';
    //                html += '  background: transparent;';
    //                html += '}';
    //                html += '.transparent-dialog .ui-widget-content {';
    //                html += '  background: transparent;';
    //                html += '}';
    //                //
    //                // This is the dialog draggable handle bar colored lightgoldenrodyellow.
    //                //
    //                //html += '.ui-dialog-title {';
    //                //html += '    background-color: lightgoldenrodyellow;';
    //                //html += '    border-color: orange;';
    //                //html += '}';
    //                //html += '.ui-draggable-handle {';
    //                //html += '    background-color: lightgoldenrodyellow !important;';
    //                //html += '    border-color: red !important;';
    //                //html += '}';
    //                html += '.ui-corner-all {';
    //                html += '    border-color: #FFE1AC !important;'; // Navajo White outlining the dialog boxes! Yeah!!! :)
    //                html += '}';
    //                html += '</style>';

    //                // Now get the workflow
    //                $.ajax({
    //                    url: thiz.options.operationUriPrefix + "odata/WorkflowConfiguration/" + thiz.options.bwTenantId + '/' + thiz.options.bwWorkflowAppId + "/true",
    //                    dataType: "json",
    //                    contentType: "application/json",
    //                    type: "Get",
    //                    timeout: thiz.options.ajaxTimeout
    //                }).done(function (result2) {
    //                    try {
    //                        debugger;
    //                        var workflow;
    //                        var roles;

    //                        //if (!participantId) {
    //                        //    // The user is not logged in.
    //                        //    debugger;
    //                        //    console.log('The user is not logged in, so displaying the default WorkflowEditor.');
    //                        //    //orgRoles = result.value[0].ConfigurationValues; // Works when the user is not logged in. 
    //                        //    workflow = result2.value[0].ConfigurationValues; // Works when the user is not logged in. 
    //                        //} else {
    //                        //    // The user is logged in.
    //                        //    //debugger;
    //                        //    //orgRoles = result.value; // Works when the user is logged in.
    //                        //    workflow = result2.value; // Works when the user is logged in.
    //                        //}

    //                        workflow = JSON.parse(result2.value[0].bwWorkflowJson); // Works when the user is logged in.
    //                        debugger;
    //                        thiz.options.CurrentWorkflow = workflow;
    //                        alert('Set CurrentWorkflow xcx111774-2');
    //                        var car = thiz.options.CurrentWorkflow;

    //                        html += '    <table style="width:100%;border-color:#d8d8d8;" border="1">';

    //                        // Iterate through the steps. Then the informs, then the assigns. Make an array of the roles. { RoleId, RoleName }
    //                        var alternatingRow = 'light'; // Use this to color the rows.
    //                        for (var i = 0; i < car.Workflow.Steps.Step.length; i++) {
    //                            var stepName = car.Workflow.Steps.Step[i]["@Name"];
    //                            if (stepName == 'Create' || stepName == 'Revise') { // || stepName == 'Admin') {
    //                                // Do nothing, not displaying these steps.
    //                            } else {
    //                                // Display Inform roles.
    //                                if (car.Workflow.Steps.Step[i].OnStart && car.Workflow.Steps.Step[i].OnStart.Inform) {
    //                                    if (car.Workflow.Steps.Step[i].OnStart.Inform.length > 0) {
    //                                        for (var j = 0; j < car.Workflow.Steps.Step[i].OnStart.Inform.length; j++) {

    //                                            if (alternatingRow == 'light') {
    //                                                html += '  <tr class="alternatingRowLight steprow" style="cursor:pointer;" >';
    //                                                alternatingRow = 'dark';
    //                                            } else {
    //                                                html += '  <tr class="alternatingRowDark steprow" style="cursor:pointer;" >';
    //                                                alternatingRow = 'light';
    //                                            }

    //                                            var isSelected = false;
    //                                            var userOrgsForRole = [];
    //                                            if (roles) {
    //                                                for (var r = 0; r < roles.length; r++) {
    //                                                    if (roles[r].RoleId == car.Workflow.Steps.Step[i].OnStart.Inform[j]["@Role"]) {
    //                                                        userOrgsForRole.push(roles[r].OrgId);
    //                                                        isSelected = true;
    //                                                    }
    //                                                }
    //                                            }

    //                                            html += '       <td class="roleId steprowcell">' + car.Workflow.Steps.Step[i].OnStart.Inform[j]["@Role"] + '</td>';

    //                                            html += '       <td class="rolename steprowcell" style="color:rgb(255, 0, 0);background-color:rgb(245, 246, 247);" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'#f5f6f7\';" bwoldvalue="' + car.Workflow.Steps.Step[i].OnStart.Inform[j]["@RoleName"] + '" bwroleid="' + car.Workflow.Steps.Step[i].OnStart.Inform[j]["@Role"] + '">' + car.Workflow.Steps.Step[i].OnStart.Inform[j]["@RoleName"] + '<br></td>';

    //                                            //html += '       <td class="steprowbuttons steprowcell" style="background-color:#f5f6f7;width:80px;text-align:right;padding-right:15px;"><span test="xcxtest3" style="color:#ff0000;cursor:pointer;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayParticipantRoleMultiPickerInACircle\', true, \'\', \'84404479-87b3-4f9c-b096-e65db5426c5e\', \'Todd Hiltz\', \'budgetworkflow@gmail.com\');">Todd Hiltz</span></td>';
    //                                            html += '       <td class="steprowbuttons steprowcell" style="background-color:#f5f6f7;width:80px;text-align:right;padding-right:15px;"><span test="xcxtest3" style="color:#ff0000;cursor:pointer;"></span></td>';

    //                                            html += '</tr>';
    //                                        }
    //                                    }
    //                                }
    //                                // Display Assign roles.
    //                                if (car.Workflow.Steps.Step[i].Assign) {
    //                                    if (car.Workflow.Steps.Step[i].Assign.length > 0) {
    //                                        for (var j = 0; j < car.Workflow.Steps.Step[i].Assign.length; j++) {
    //                                            //html += '<tr class="orgRow">';

    //                                            if (alternatingRow == 'light') {
    //                                                html += '  <tr class="alternatingRowLight steprow" style="cursor:pointer;" >';
    //                                                alternatingRow = 'dark';
    //                                            } else {
    //                                                html += '  <tr class="alternatingRowDark steprow" style="cursor:pointer;" >';
    //                                                alternatingRow = 'light';
    //                                            }


    //                                            var isSelected = false;
    //                                            var userOrgsForRole = [];
    //                                            if (roles) {
    //                                                for (var r = 0; r < roles.length; r++) {
    //                                                    if (roles[r].RoleId == car.Workflow.Steps.Step[i].Assign[j]["@Role"]) {
    //                                                        userOrgsForRole.push(roles[r].OrgId);
    //                                                        isSelected = true;
    //                                                    }
    //                                                }
    //                                            }

    //                                            html += '       <td class="roleId steprowcell">' + car.Workflow.Steps.Step[i].Assign[j]["@Role"] + '</td>';

    //                                            html += '       <td class="rolename steprowcell" style="color: rgb(255, 0, 0); background-color: rgb(245, 246, 247);" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'#f5f6f7\';" bwoldvalue="' + car.Workflow.Steps.Step[i].Assign[j]["@RoleName"] + '" bwroleid="' + car.Workflow.Steps.Step[i].Assign[j]["@Role"] + '">' + car.Workflow.Steps.Step[i].Assign[j]["@RoleName"] + '<br></td>';

    //                                            html += '<td class="steprowbuttons steprowcell" style="background-color:#f5f6f7;width:80px;text-align:right;padding-right:15px;"><span test="xcxtest4" style="color:#ff0000;cursor:pointer;"></span></td>';

    //                                            html += '</tr>';
    //                                        }
    //                                    }
    //                                    //
    //                                    // Just in case it is not an array but just a single item/role.
    //                                    //
    //                                    //debugger;
    //                                    if (car.Workflow.Steps.Step[i].Assign["@Role"]) {
    //                                        if (car.Workflow.Steps.Step[i].Assign["@Role"] == 'ADMIN') {
    //                                            //
    //                                            // If the user clicks on the ADMIN role row, it will display the participant circle dialog for the person who is the ADMIN.
    //                                            //
    //                                            if (alternatingRow == 'light') {
    //                                                //html += '  <tr class="alternatingRowLight" style="cursor:pointer;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'displayADMINParticipantInCircleDialog\');" >'; // We use this id to attach a click event later on. If the user clicks on the ADMIN role row, it will display the participant circle dialog for the person who is the ADMIN.
    //                                                html += '  <tr class="alternatingRowLight steprow" style="cursor:pointer;" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'displayADMINParticipantInCircleDialog\');" >'; // We use this id to attach a click event later on. If the user clicks on the ADMIN role row, it will display the participant circle dialog for the person who is the ADMIN.
    //                                                alternatingRow = 'dark';
    //                                            } else {
    //                                                html += '  <tr class="alternatingRowDark steprow" style="cursor:pointer;" >'; // We use this id to attach a click event later on. If the user clicks on the ADMIN role row, it will display the participant circle dialog for the person who is the ADMIN.
    //                                                alternatingRow = 'light';
    //                                            }


    //                                        } else {
    //                                            if (alternatingRow == 'light') {
    //                                                html += '  <tr class="alternatingRowLight steprow" style="cursor:pointer;" >';
    //                                                alternatingRow = 'dark';
    //                                            } else {
    //                                                html += '  <tr class="alternatingRowDark steprow" style="cursor:pointer;" >';
    //                                                alternatingRow = 'light';
    //                                            }
    //                                        }


    //                                        var isSelected = false;
    //                                        var userOrgsForRole = [];
    //                                        if (roles) {
    //                                            for (var r = 0; r < roles.length; r++) {
    //                                                if (roles[r].RoleId == car.Workflow.Steps.Step[i].Assign["@Role"]) {
    //                                                    userOrgsForRole.push(roles[r].OrgId);
    //                                                    isSelected = true;
    //                                                }
    //                                            }
    //                                        }

    //                                        html += '       <td class="roleId steprowcell">' + car.Workflow.Steps.Step[i].Assign["@Role"] + '</td>';

    //                                        if (car.Workflow.Steps.Step[i].Assign["@Role"] == 'ADMIN') {
    //                                            if (car.Workflow.Steps.Step[i].Assign["@RoleName"]) {
    //                                                //html += '       <td class="roleName">' + car.Workflow.Steps.Step[i].Assign["@RoleName"] + '</td>';
    //                                                html += '       <td class="rolename steprowcell" style="color: rgb(255, 0, 0); background-color: rgb(245, 246, 247);" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'#f5f6f7\';" bwoldvalue="' + car.Workflow.Steps.Step[i].Assign["@RoleName"] + '" bwroleid="' + car.Workflow.Steps.Step[i].Assign["@Role"] + '">' + car.Workflow.Steps.Step[i].Assign["@RoleName"] + '<br></td>';

    //                                            } else {
    //                                                html += '       <td class="roleName steprowcell">' + 'Workflow Administrator' + '</td>';
    //                                            }

    //                                            html += '<td class="steprowbuttons steprowcell" style="background-color:#f5f6f7;width:80px;text-align:right;padding-right:15px;"><span test="xcxtest5" style="color:#ff0000;cursor:pointer;"></span></td>';


    //                                        } else {
    //                                            if (car.Workflow.Steps.Step[i].Assign["@RoleName"]) {
    //                                                //html += '       <td class="roleName">' + car.Workflow.Steps.Step[i].Assign["@RoleName"] + '</td>';
    //                                                html += '       <td class="rolename steprowcell" style="color: rgb(255, 0, 0); background-color: rgb(245, 246, 247);" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'#f5f6f7\';" bwoldvalue="' + car.Workflow.Steps.Step[i].Assign["@RoleName"] + '" bwroleid="' + car.Workflow.Steps.Step[i].Assign["@Role"] + '">' + car.Workflow.Steps.Step[i].Assign["@RoleName"] + '<br></td>';
    //                                            } else {
    //                                                html += '       <td class="roleName steprowcell">' + '' + '</td>';
    //                                            }

    //                                            html += '<td class="steprowbuttons steprowcell" style="background-color:#f5f6f7;width:80px;text-align:right;padding-right:15px;"><span test="xcxtest6" style="color:#ff0000;cursor:pointer;"></span></td>';

    //                                        }

    //                                        html += '</tr>';
    //                                    }

    //                                }
    //                            }
    //                        }
    //                        html += '</table>';

    //                        document.getElementById(tagName).innerHTML = html;

    //                        // Redraw the lines!
    //                        thiz.renderOrgRoleConnectorsToWorkflow(true, 'root');

    //                    } catch (e) {
    //                        //lpSpinner.Hide();
    //                        console.log('Exception in bwOrganizationEditor._create().xx.Get:1: ' + e.message + ', ' + e.stack);
    //                    }
    //                }).fail(function (data) {
    //                    //lpSpinner.Hide();
    //                    debugger;
    //                    console.log('In xx.fail(): ' + JSON.stringify(data));
    //                    var msg;
    //                    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
    //                        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
    //                    } else {
    //                        msg = JSON.stringify(data);
    //                    }
    //                    alert('Exception in bwOrganizationEditor._create().xx.Get:2: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
    //                    console.log('Exception in bwOrganizationEditor._create().xx.Get:2: ' + JSON.stringify(data));
    //                    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
    //                    //var error = JSON.parse(data.responseText)["odata.error"];
    //                    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
    //                });
    //            },
    //            error: function (data, errorCode, errorMessage) {
    //                //window.waitDialog.close();
    //                //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
    //                displayAlertDialog('Error in my.js.renderMasterRoleListForEditing(' + elementId + '):2:' + errorCode + ', ' + errorMessage);
    //            }
    //        });
    //    } catch (e) {
    //        debugger;
    //        console.log('EXCEPTION IN renderRolesPeoplePicker: ' + e.message + ', ' + e.stack);
    //    }
    //},

    // This is displayed to the right of the treeview when "Roles and Participants" is selected from the drop down. 
    renderRolesPeoplePicker: function (tagName) {
        try {
            console.log('In bwOrganizationEditor.js.renderRolesPeoplePicker(). This is displayed to the right of the treeview when "Roles and Participants" is selected from the drop down. tagName: ' + tagName);
            //alert('In bwOrganizationEditor.js.renderRolesPeoplePicker(). This is displayed to the right of the treeview when "Roles and Participants" is selected from the drop down. tagName: ' + tagName);
            var thiz = this;

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
                url: this.options.operationUriPrefix + "_bw/workflow/participants",
                type: "POST",
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (result) {
                    try {

                        if (result.status != 'SUCCESS') {

                            //alert('xcx44567 result: ' + JSON.stringify(result));
                            displayAlertDialog(result.status + ', ' + result.message);

                        } else {

                            var data = result.BwWorkflowUsers;
                            var html = '';
                            // Include jquery-ui stylesheet.
                            //html += '<link rel="stylesheet" href="css/jquery/1.11.1/themes/smoothness/jquery-ui.min.css?v=0">'; // removed 8-18-2022
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
                            html += '}';
                            html += '.steprow-hidden {';
                            html += '    visibility: collapse;';
                            html += '}';
                            html += '.steprow:hover {';
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

                            // Now get the workflow
                            //$.ajax({
                            //    url: thiz.options.operationUriPrefix + "odata/WorkflowConfiguration/" + thiz.options.bwTenantId + '/' + thiz.options.bwWorkflowAppId + "/true",
                            //    dataType: "json",
                            //    contentType: "application/json",
                            //    type: "Get",
                            //    timeout: thiz.options.ajaxTimeout
                            //}).done(function (result2) {
                            //    try {
                            var json = {
                                bwParticipantId_LoggedIn: participantId,
                                bwActiveStateIdentifier: activeStateIdentifier,
                                bwWorkflowAppId_LoggedIn: workflowAppId,

                                bwWorkflowAppId: workflowAppId
                            };

                            $.ajax({
                                url: thiz.options.operationUriPrefix + '_bw/bwroles',
                                type: 'POST',
                                contentType: 'application/json',
                                data: JSON.stringify(json),
                                success: function (result) {
                                    try {

                                        html += '    <table style="width:100%;border-color:#d8d8d8;" border="1">';
                                        var alternatingRow = 'light'; // Use this to color the rows.
                                        for (var i = 0; i < result.data.length; i++) {
                                            if (result.data[i].RoleId != 'ADMIN') { // ADMIN (Workflow Administrator) is a unique role, and we do not want to display it here.
                                                if (alternatingRow == 'light') {
                                                    html += '  <tr class="alternatingRowLight steprow" style="cursor:pointer;" >';
                                                    alternatingRow = 'dark';
                                                } else {
                                                    html += '  <tr class="alternatingRowDark steprow" style="cursor:pointer;" >';
                                                    alternatingRow = 'light';
                                                }
                                                html += '       <td class="roleid steprowcell">' + result.data[i].RoleId + '</td>';
                                                html += '       <td class="rolename steprowcell" style="color:rgb(255, 0, 0);background-color:rgb(245, 246, 247);" onmouseover="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseout="this.style.backgroundColor=\'#f5f6f7\';" bwoldvalue="' + result.data[i].RoleName + '" bwroleid="' + result.data[i].RoleId + '">' + result.data[i].RoleName + '<br></td>';
                                                html += '       <td class="steprowbuttons steprowcell" style="background-color:#f5f6f7;width:80px;text-align:right;padding-right:15px;"><span test="xcxtest3" style="color:#ff0000;cursor:pointer;"></span></td>';
                                                html += '</tr>';
                                            }
                                        }

                                        html += '</table>';

                                        document.getElementById(tagName).innerHTML = html;

                                        // Redraw the lines!
                                        thiz.renderOrgRoleConnectorsToWorkflow(true, 'root');

                                    } catch (e) {
                                        console.log('Exception in renderRolesPeoplePicker.bwroles.success(): ' + e.message + ', ' + e.stack);
                                        displayAlertDialog('Exception in renderRolesPeoplePicker.bwroles.success(): ' + e.message + ', ' + e.stack);
                                    }
                                },
                                error: function (data, errorCode, errorMessage) {
                                    console.log('Error in bwOrganizationEditor.js.renderRolesPeoplePicker(). ' + errorCode + ', ' + errorMessage + ', ' + JSON.stringify(data));
                                    displayAlertDialog('Error in bwOrganizationEditor.js.renderRolesPeoplePicker(). ' + errorCode + ', ' + errorMessage + ', ' + JSON.stringify(data));
                                }

                            });

                        }

                    } catch (e) {
                        console.log('Exception in bwOrganizationEditor.js.renderRolesPeoplePicker(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwOrganizationEditor.js.renderRolesPeoplePicker(): ' + e.message + ', ' + e.stack);
                    }

                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in bwOrganizationEditor.js.renderRolesPeoplePicker():' + errorCode + ', ' + errorMessage + ', ' + JSON.stringify(data));
                    displayAlertDialog('Error in bwOrganizationEditor.js.renderRolesPeoplePicker():' + errorCode + ', ' + errorMessage + ', ' + JSON.stringify(data));
                }

            });

        } catch (e) {
            console.log('Exception in bwOrganizationEditor.js.renderRolesPeoplePicker(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwOrganizationEditor.js.renderRolesPeoplePicker(): ' + e.message + ', ' + e.stack);
        }
    },

    renderOrgRoleConnectorsToWorkflow: function (clearCanvas, divisionIndex, groupIndex, entityIndex, locationIndex) {
        try {
            // On hover or click, this draws the lines and highlights any missing role assignments.
            console.log('In renderOrgRoleConnectorsToWorkflow(). divisionIndex: ' + divisionIndex + ', groupIndex: ' + groupIndex + ', entityIndex: ' + entityIndex + ', locationIndex: ' + locationIndex);

            if (!divisionIndex && !groupIndex && !entityIndex && !locationIndex) {
                // If no values are passed, then we look up the last used values/last selected Org. This occurs when the workflow steps are expanded and collapsed.
                var ind = this.options.lastSelectedDivisionGroupEntityLocationIndexes;
                if (ind) {
                    divisionIndex = ind.Division;
                    groupIndex = ind.Group;
                    entityIndex = ind.LegalEntity;
                    locationIndex = ind.Location;
                }
            }

            // Todd: in progress 1-24-2020. I gave up on this hover dialog, it makes things too busy on the screen.
            //$('.bwCoreComponent').bwCoreComponent('showRowHoverDetails_OrgSmall', 'BR-180001', 'Test 1', 'test', '6f308d4e-66fd-4e6f-925e-714b3135fef3', '50963ec1-dac6-423c-a0e9-29715286ab65');

            //var canvas = document.getElementById("myCanvas");
            var canvas = document.getElementById(this.options.canvasElementId);
            ctx = canvas.getContext("2d");

            // We have to reset our drawing
            if (clearCanvas == true) {
                ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines
            }
            //
            // Resize the canvas so that this is rendered on the entire page, even the parts of the page which are scrolled out of view at the moment.
            var body = document.getElementsByTagName('body')[0];
            var clientWidth = body.scrollWidth;
            var clientHeight = Math.max(
                body.scrollHeight, document.documentElement.scrollHeight,
                body.offsetHeight, document.documentElement.offsetHeight,
                body.clientHeight, document.documentElement.clientHeight, body.scrollHeight, body.getBoundingClientRect().height
            );
            // This doesn't work 100% here because the whole screen has not been rendered yet, so we get an incorrect height value which is much less than the entire length of the page.
            // Therefore we need to remember to resize the canvas when drawing stuff, and use the sizing code from the resize event just below this code, and save it back to this.options.Canvas and this.options.CanvasContext.
            // The following resizes the bitmap from 300x150 to what we want. This prevents scaling of our drawing...
            canvas.width = clientWidth;
            canvas.height = clientHeight;




            //
            // We have to reset our drawing and highlighting and start fresh.
            //
            $('.orgTreeNode').css('color', this.options.color.Default); // tree org node
            $('.rolename').css('color', this.options.color.Default); // role name in the workflow editor 
            $('.steprowbuttons').html(''); // Clear the participant names in the workflow editor

            // Reset complete.
            var json = this.options.store;





            //debugger;
            var originElementId, orgName, orgPath;
            var originElementIdsAndRoles = []; // This gets passed to the drawing routine and has the origin and the roles to draw the lines for...
            var originElementIdsAndRolesForChildNodes = []; // This gets passed to the drawing routine and has the origin and the roles to draw the lines for the child nodes. These will be grey or a lighter color so they appear in the background so to speak.
            if ((locationIndex && locationIndex != 'undefined') || locationIndex > -1) {
                if (json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex].Roles) {
                    var locationOriginAndRoles = {
                        originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex + '_' + entityIndex + '_' + locationIndex,
                        roles: json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex].Roles,
                        orgElementId: 'spanOrgX_' + divisionIndex + '_' + groupIndex + '_' + entityIndex + '_' + locationIndex
                    }
                } else {
                    var locationOriginAndRoles = {
                        originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex + '_' + entityIndex + '_' + locationIndex,
                        roles: [],
                        orgElementId: 'spanOrgX_' + divisionIndex + '_' + groupIndex + '_' + entityIndex + '_' + locationIndex
                    }
                }
                originElementIdsAndRoles.push(locationOriginAndRoles);
                if (json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Roles) {
                    var legalEntityOriginAndRoles = {
                        originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex + '_' + entityIndex,
                        roles: json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Roles,
                        orgElementId: 'spanOrgX_' + divisionIndex + '_' + groupIndex + '_' + entityIndex
                    }
                } else {
                    var legalEntityOriginAndRoles = {
                        originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex + '_' + entityIndex,
                        roles: [],
                        orgElementId: 'spanOrgX_' + divisionIndex + '_' + groupIndex + '_' + entityIndex
                    }
                }
                originElementIdsAndRoles.push(legalEntityOriginAndRoles);
                if (json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Roles) {
                    var groupOriginAndRoles = {
                        originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex,
                        roles: json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Roles,
                        orgElementId: 'spanOrgX_' + divisionIndex + '_' + groupIndex
                    }
                } else {
                    var groupOriginAndRoles = {
                        originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex,
                        roles: [],
                        orgElementId: 'spanOrgX_' + divisionIndex + '_' + groupIndex
                    }
                }
                originElementIdsAndRoles.push(groupOriginAndRoles);
                if (json.Global.Divisions.Items[divisionIndex].Roles) {
                    var divisionOriginAndRoles = {
                        originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex,
                        roles: json.Global.Divisions.Items[divisionIndex].Roles,
                        orgElementId: 'spanOrgX_' + divisionIndex
                    }
                } else {
                    var divisionOriginAndRoles = {
                        originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex,
                        roles: [],
                        orgElementId: 'spanOrgX_' + divisionIndex
                    }
                }
                originElementIdsAndRoles.push(divisionOriginAndRoles);
                if (json.Global.Roles) {
                    var globalRootOriginElementIdAndRoles = {
                        originElementId: 'spanWorkflowPeoplePicker_' + 'root',
                        roles: json.Global.Roles,
                        orgElementId: 'spanOrgX_' + 'root'
                    }
                } else {
                    var globalRootOriginElementIdAndRoles = {
                        originElementId: 'spanWorkflowPeoplePicker_' + 'root',
                        roles: [],
                        orgElementId: 'spanOrgX_' + 'root'
                    }
                }
                originElementIdsAndRoles.push(globalRootOriginElementIdAndRoles);
            } else if ((entityIndex && entityIndex != 'undefined') || entityIndex > -1) {
                if (json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Roles) {
                    var legalEntityOriginAndRoles = {
                        originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex + '_' + entityIndex,
                        roles: json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Roles,
                        orgElementId: 'spanOrgX_' + divisionIndex + '_' + groupIndex + '_' + entityIndex
                    }
                } else {
                    var legalEntityOriginAndRoles = {
                        originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex + '_' + entityIndex,
                        roles: [],
                        orgElementId: 'spanOrgX_' + divisionIndex + '_' + groupIndex + '_' + entityIndex
                    }
                }
                originElementIdsAndRoles.push(legalEntityOriginAndRoles);
                if (json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Roles) {
                    var groupOriginAndRoles = {
                        originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex,
                        roles: json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Roles,
                        orgElementId: 'spanOrgX_' + divisionIndex + '_' + groupIndex
                    }
                } else {
                    var groupOriginAndRoles = {
                        originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex,
                        roles: [],
                        orgElementId: 'spanOrgX_' + divisionIndex + '_' + groupIndex
                    }
                }
                originElementIdsAndRoles.push(groupOriginAndRoles);
                if (json.Global.Divisions.Items[divisionIndex].Roles) {
                    var divisionOriginAndRoles = {
                        originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex,
                        roles: json.Global.Divisions.Items[divisionIndex].Roles,
                        orgElementId: 'spanOrgX_' + divisionIndex
                    }
                } else {
                    var divisionOriginAndRoles = {
                        originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex,
                        roles: [],
                        orgElementId: 'spanOrgX_' + divisionIndex
                    }
                }
                originElementIdsAndRoles.push(divisionOriginAndRoles);
                if (json.Global.Roles) {
                    var globalRootOriginElementIdAndRoles = {
                        originElementId: 'spanWorkflowPeoplePicker_' + 'root',
                        roles: json.Global.Roles,
                        orgElementId: 'spanOrgX_' + 'root'
                    }
                } else {
                    var globalRootOriginElementIdAndRoles = {
                        originElementId: 'spanWorkflowPeoplePicker_' + 'root',
                        roles: [],
                        orgElementId: 'spanOrgX_' + 'root'
                    }
                }
                originElementIdsAndRoles.push(globalRootOriginElementIdAndRoles);
                //
                // Now populate the Locations object so we can draw the grey lines!!!
                // 
                for (var i = 0; i < json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items.length; i++) {
                    if (json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[i].Roles) {
                        var locationOriginAndRoles = {
                            originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex + '_' + entityIndex + '_' + i,
                            roles: json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[i].Roles,
                            orgElementId: 'spanOrgX_' + divisionIndex + '_' + groupIndex + '_' + entityIndex + '_' + i
                        }
                    } else {
                        var locationOriginAndRoles = {
                            originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex + '_' + entityIndex + '_' + i,
                            roles: [],
                            orgElementId: 'spanOrgX_' + divisionIndex + '_' + groupIndex + '_' + entityIndex + '_' + i
                        }
                    }
                    originElementIdsAndRolesForChildNodes.push(locationOriginAndRoles);
                }
            } else if ((groupIndex && groupIndex != 'undefined') || groupIndex > -1) {
                //debugger;
                //if (json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex] && json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Roles) {
                //alert(JSON.stringify(json));
                if (json.Global.Divisions.Items[divisionIndex] && json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Roles) {
                    var groupOriginAndRoles = {
                        originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex,
                        roles: json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Roles,
                        orgElementId: 'spanOrgX_' + divisionIndex + '_' + groupIndex
                    }
                } else {
                    var groupOriginAndRoles = {
                        originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex,
                        roles: [],
                        orgElementId: 'spanOrgX_' + divisionIndex + '_' + groupIndex
                    }
                }
                originElementIdsAndRoles.push(groupOriginAndRoles);
                if (json.Global.Divisions.Items[divisionIndex] && json.Global.Divisions.Items[divisionIndex].Roles) {
                    var divisionOriginAndRoles = {
                        originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex,
                        roles: json.Global.Divisions.Items[divisionIndex].Roles,
                        orgElementId: 'spanOrgX_' + divisionIndex
                    }
                } else {
                    var divisionOriginAndRoles = {
                        originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex,
                        roles: [],
                        orgElementId: 'spanOrgX_' + divisionIndex
                    }
                }
                originElementIdsAndRoles.push(divisionOriginAndRoles);
                if (json.Global.Roles) {
                    var globalRootOriginElementIdAndRoles = {
                        originElementId: 'spanWorkflowPeoplePicker_' + 'root',
                        roles: json.Global.Roles,
                        orgElementId: 'spanOrgX_' + 'root'
                    }
                } else {
                    var globalRootOriginElementIdAndRoles = {
                        originElementId: 'spanWorkflowPeoplePicker_' + 'root',
                        roles: [],
                        orgElementId: 'spanOrgX_' + 'root'
                    }
                }
                originElementIdsAndRoles.push(globalRootOriginElementIdAndRoles);


                //
                // Now populate the Legal Entity object so we can draw the grey lines!!!
                // 
                if (json.Global.Divisions.Items[divisionIndex]) { // 7-2-2022
                    for (var e = 0; e < json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items.length; e++) {
                        if (json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[e].Roles) {
                            var legalEntityOriginAndRoles = {
                                originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex + '_' + e,
                                roles: json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[e].Roles,
                                orgElementId: 'spanOrgX_' + divisionIndex + '_' + groupIndex + '_' + e
                            }
                        } else {
                            var legalEntityOriginAndRoles = {
                                originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex + '_' + e,
                                roles: [],
                                orgElementId: 'spanOrgX_' + divisionIndex + '_' + groupIndex + '_' + e
                            }
                        }
                        originElementIdsAndRolesForChildNodes.push(legalEntityOriginAndRoles);
                        //
                        // Now populate the Locations object so we can draw the grey lines!!!
                        // 
                        for (var l = 0; l < json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[e].Locations.Items.length; l++) {
                            if (json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[e].Locations.Items[l].Roles) {
                                var locationOriginAndRoles = {
                                    originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex + '_' + e + '_' + l,
                                    roles: json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[e].Locations.Items[l].Roles,
                                    orgElementId: 'spanOrgX_' + divisionIndex + '_' + groupIndex + '_' + e + '_' + l
                                }
                            } else {
                                var locationOriginAndRoles = {
                                    originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex + '_' + e + '_' + l,
                                    roles: [],
                                    orgElementId: 'spanOrgX_' + divisionIndex + '_' + groupIndex + '_' + e + '_' + l
                                }
                            }
                            originElementIdsAndRolesForChildNodes.push(locationOriginAndRoles);
                        }
                    }
                }

            } else if ((divisionIndex && divisionIndex != 'undefined') || divisionIndex > -1) {
                if (divisionIndex == 'root') {
                    //debugger;
                    if (json.Global.Roles) {
                        var globalRootOriginElementIdAndRoles = {
                            originElementId: 'spanWorkflowPeoplePicker_' + 'root',
                            roles: json.Global.Roles,
                            orgElementId: 'spanOrgX_' + 'root'
                        }
                    } else {
                        var globalRootOriginElementIdAndRoles = {
                            originElementId: 'spanWorkflowPeoplePicker_' + 'root',
                            roles: [],
                            orgElementId: 'spanOrgX_' + 'root'
                        }
                    }
                    originElementIdsAndRoles.push(globalRootOriginElementIdAndRoles);

                    //
                    // Now populate the Divisions object so we can draw the grey lines!!!
                    // 
                    for (var d = 0; d < json.Global.Divisions.Items.length; d++) {
                        if (json.Global.Divisions.Items[d].Roles) {
                            var divisionOriginAndRoles = {
                                originElementId: 'spanWorkflowPeoplePicker_' + d,
                                roles: json.Global.Divisions.Items[d].Roles,
                                orgElementId: 'spanOrgX_' + d
                            }
                        } else {
                            var divisionOriginAndRoles = {
                                originElementId: 'spanWorkflowPeoplePicker_' + d,
                                roles: [],
                                orgElementId: 'spanOrgX_' + d
                            }
                        }
                        originElementIdsAndRolesForChildNodes.push(divisionOriginAndRoles);
                        //
                        // Now populate the Group object so we can draw the grey lines!!!
                        // 
                        for (var g = 0; g < json.Global.Divisions.Items[d].Groups.Items.length; g++) {
                            if (json.Global.Divisions.Items[d].Groups.Items[g].Roles) {
                                var groupOriginAndRoles = {
                                    originElementId: 'spanWorkflowPeoplePicker_' + d + '_' + g,
                                    roles: json.Global.Divisions.Items[d].Groups.Items[g].Roles,
                                    orgElementId: 'spanOrgX_' + d + '_' + g
                                }
                            } else {
                                var groupOriginAndRoles = {
                                    originElementId: 'spanWorkflowPeoplePicker_' + d + '_' + g,
                                    roles: [],
                                    orgElementId: 'spanOrgX_' + d + '_' + g
                                }
                            }
                            originElementIdsAndRolesForChildNodes.push(groupOriginAndRoles);
                            //
                            // Now populate the Legal Entity object so we can draw the grey lines!!!
                            // 
                            for (var e = 0; e < json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items.length; e++) {
                                if (json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Roles) {
                                    var legalEntityOriginAndRoles = {
                                        originElementId: 'spanWorkflowPeoplePicker_' + d + '_' + g + '_' + e,
                                        roles: json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Roles,
                                        orgElementId: 'spanOrgX_' + d + '_' + g + '_' + e
                                    }
                                } else {
                                    var legalEntityOriginAndRoles = {
                                        originElementId: 'spanWorkflowPeoplePicker_' + d + '_' + g + '_' + e,
                                        roles: [],
                                        orgElementId: 'spanOrgX_' + d + '_' + g + '_' + e
                                    }
                                }
                                originElementIdsAndRolesForChildNodes.push(legalEntityOriginAndRoles);
                                //
                                // Now populate the Locations object so we can draw the grey lines!!!
                                // 
                                for (var l = 0; l < json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items.length; l++) {
                                    if (json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Roles) {
                                        var locationOriginAndRoles = {
                                            originElementId: 'spanWorkflowPeoplePicker_' + d + '_' + g + '_' + e + '_' + l,
                                            roles: json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Roles,
                                            orgElementId: 'spanOrgX_' + d + '_' + g + '_' + e + '_' + l
                                        }
                                    } else {
                                        var locationOriginAndRoles = {
                                            originElementId: 'spanWorkflowPeoplePicker_' + d + '_' + g + '_' + e + '_' + l,
                                            roles: [],
                                            orgElementId: 'spanOrgX_' + d + '_' + g + '_' + e + '_' + l
                                        }
                                    }
                                    originElementIdsAndRolesForChildNodes.push(locationOriginAndRoles);
                                }
                            }
                        }
                    }

                } else {
                    if (json.Global.Divisions.Items[divisionIndex].Roles) {
                        var divisionOriginAndRoles = {
                            originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex,
                            roles: json.Global.Divisions.Items[divisionIndex].Roles,
                            orgElementId: 'spanOrgX_' + divisionIndex
                        }
                    } else {
                        var divisionOriginAndRoles = {
                            originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex,
                            roles: [],
                            orgElementId: 'spanOrgX_' + divisionIndex
                        }
                    }
                    originElementIdsAndRoles.push(divisionOriginAndRoles);
                    if (json.Global.Roles) {
                        var globalRootOriginElementIdAndRoles = {
                            originElementId: 'spanWorkflowPeoplePicker_' + 'root',
                            roles: json.Global.Roles,
                            orgElementId: 'spanOrgX_' + 'root'
                        }
                    } else {
                        var globalRootOriginElementIdAndRoles = {
                            originElementId: 'spanWorkflowPeoplePicker_' + 'root',
                            roles: [],
                            orgElementId: 'spanOrgX_' + 'root'
                        }
                    }
                    originElementIdsAndRoles.push(globalRootOriginElementIdAndRoles);

                    //
                    // Now populate the Group object so we can draw the grey lines!!!
                    // 
                    for (var g = 0; g < json.Global.Divisions.Items[divisionIndex].Groups.Items.length; g++) {
                        if (json.Global.Divisions.Items[divisionIndex].Groups.Items[g].Roles) {
                            var groupOriginAndRoles = {
                                originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + g,
                                roles: json.Global.Divisions.Items[divisionIndex].Groups.Items[g].Roles,
                                orgElementId: 'spanOrgX_' + divisionIndex + '_' + g
                            }
                        } else {
                            var groupOriginAndRoles = {
                                originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + g,
                                roles: [],
                                orgElementId: 'spanOrgX_' + divisionIndex + '_' + g
                            }
                        }
                        originElementIdsAndRolesForChildNodes.push(groupOriginAndRoles);
                        //
                        // Now populate the Legal Entity object so we can draw the grey lines!!!
                        // 
                        for (var e = 0; e < json.Global.Divisions.Items[divisionIndex].Groups.Items[g].LegalEntities.Items.length; e++) {
                            if (json.Global.Divisions.Items[divisionIndex].Groups.Items[g].LegalEntities.Items[e].Roles) {
                                var legalEntityOriginAndRoles = {
                                    originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + g + '_' + e,
                                    roles: json.Global.Divisions.Items[divisionIndex].Groups.Items[g].LegalEntities.Items[e].Roles,
                                    orgElementId: 'spanOrgX_' + divisionIndex + '_' + g + '_' + e
                                }
                            } else {
                                var legalEntityOriginAndRoles = {
                                    originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + g + '_' + e,
                                    roles: [],
                                    orgElementId: 'spanOrgX_' + divisionIndex + '_' + g + '_' + e
                                }
                            }
                            originElementIdsAndRolesForChildNodes.push(legalEntityOriginAndRoles);
                            //
                            // Now populate the Locations object so we can draw the grey lines!!!
                            // 
                            for (var l = 0; l < json.Global.Divisions.Items[divisionIndex].Groups.Items[g].LegalEntities.Items[e].Locations.Items.length; l++) {
                                if (json.Global.Divisions.Items[divisionIndex].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Roles) {
                                    var locationOriginAndRoles = {
                                        originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + g + '_' + e + '_' + l,
                                        roles: json.Global.Divisions.Items[divisionIndex].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Roles,
                                        orgElementId: 'spanOrgX_' + divisionIndex + '_' + g + '_' + e + '_' + l
                                    }
                                } else {
                                    var locationOriginAndRoles = {
                                        originElementId: 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + g + '_' + e + '_' + l,
                                        roles: [],
                                        orgElementId: 'spanOrgX_' + divisionIndex + '_' + g + '_' + e + '_' + l
                                    }
                                }
                                originElementIdsAndRolesForChildNodes.push(locationOriginAndRoles);
                            }
                        }
                    }

                }
            } else {
                //debugger;
                console.log('Error: Unexpected parameter in renderOrgRoleConnectorsToWorkflow(). clearCanvas: ' + clearCanvas + ', divisionIndex: ' + divisionIndex + ', groupIndex: ' + groupIndex + ', entityIndex: ' + entityIndex + ',locationIndex: ' + locationIndex);
                //alert('Error: Unexpected parameter in renderOrgRoleConnectorsToWorkflow(). clearCanvas: ' + clearCanvas + ', divisionIndex: ' + divisionIndex + ', groupIndex: ' + groupIndex + ', entityIndex: ' + entityIndex + ',locationIndex: ' + locationIndex);
            }

            this.options.lastSelectedDivisionGroupEntityLocationIndexes = {
                Division: divisionIndex,
                Group: groupIndex,
                LegalEntity: entityIndex,
                Location: locationIndex
            }
            //debugger;
            // Render the child node lines first so they are in the background. (grey)
            this.drawLineFromOrgToWorkflowRoleAndHighlightOrg(ctx, originElementIdsAndRolesForChildNodes, this.options.color.ChildNode, this.options.color.ChildNode, true);

            //debugger;
            // Render the lines. (red)
            this.drawLineFromOrgToWorkflowRoleAndHighlightOrg(ctx, originElementIdsAndRoles, this.options.color.Active, this.options.color.Active);

        } catch (e) {
            console.log('Exception in renderOrgRoleConnectorsToWorkflow(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderOrgRoleConnectorsToWorkflow(): ' + e.message + ', ' + e.stack);
        }
    },

    drawLineFromOrgToWorkflowRoleAndHighlightOrg: function (ctx, originElementIdsAndRoles, lineColor, highlightColor, displayParticipantInBackgroundAsGreyText) { // displayParticipantInBackgroundAsGreyText << We need to show multiples!! 4-19-2022
        try {
            console.log('********************************************');
            console.log('In drawLineFromOrgToWorkflowRoleAndHighlightOrg().');
            console.log('********************************************');


            var roleIdsAlreadyDisplayed = []; // We are using this to prevent the issue mentioned below.
            // If the role/participant is already displayed, then do not display it again, as we may get another role in a node higher up in the tree, and as a result it may display the incorrect participant here. This is very important. 4-19-2022


            //var tableElement = document.getElementById('tableOrgRoles2');
            var tableElement = document.getElementById('divPageContent3'); // 8-14-2021

            for (var d = 0; d < originElementIdsAndRoles.length; d++) {
                var drewALineForThisRole = false;


                var elements = tableElement.getElementsByClassName('rolename');

                //debugger;
                var roles = originElementIdsAndRoles[d].roles;


                //console.log('originElementIdsAndRoles[d].roles: ' + JSON.stringify(originElementIdsAndRoles[d].roles));


                var orgElementId = originElementIdsAndRoles[d].orgElementId; // We get this so we can highlight this org node in the treeview.
                var orgElement = document.getElementById(orgElementId);



                // This is where we have to check if the element is visible or not. It may be invisible because of the collapsed tree view. This makes sure a line still gets drawn to the correct element.
                if (orgElement && (orgElement.offsetParent === null)) {
                    // this element is not visible.
                    var elementId = orgElement.id;
                    // Remove the trailing bit of the id, and retry to see if that is visible.
                    var idSuffixCount = elementId.split('_').length - 1;
                    var parentElementId = '';
                    for (var pi = 0; pi < idSuffixCount; pi++) {
                        parentElementId += elementId.split('_')[pi];
                        if (pi < idSuffixCount - 1) parentElementId += '_';
                    }
                    if (document.getElementById(parentElementId) && (document.getElementById(parentElementId).offsetParent === null)) {
                        // The parent is not visible either, so lets go up another level. Remove the trailing bit of the id, and retry to see if that is visible.
                        var idSuffixCount = parentElementId.split('_').length - 1;
                        var parentElementId = '';
                        for (var pi = 0; pi < idSuffixCount; pi++) {
                            parentElementId += elementId.split('_')[pi];
                            if (pi < idSuffixCount - 1) parentElementId += '_';
                        }
                        if (document.getElementById(parentElementId) && (document.getElementById(parentElementId).offsetParent === null)) {
                            // The parent is not visible either, so lets go up another level. Remove the trailing bit of the id, and retry to see if that is visible.
                            var idSuffixCount = parentElementId.split('_').length - 1;
                            var parentElementId = '';
                            for (var pi = 0; pi < idSuffixCount; pi++) {
                                parentElementId += elementId.split('_')[pi];
                                if (pi < idSuffixCount - 1) parentElementId += '_';
                            }
                            if (document.getElementById(parentElementId) && (document.getElementById(parentElementId).offsetParent === null)) {
                                //debugger;
                            } else {
                                orgElement = document.getElementById(parentElementId);
                            }
                        } else {
                            orgElement = document.getElementById(parentElementId);
                        }
                    } else {
                        orgElement = document.getElementById(parentElementId);
                    }
                }




                if (orgElement) {
                    orgElement.style.color = highlightColor; //this.options.color.Active;

                    if (roles) {
                        //debugger;





                        for (var i = 0; i < roles.length; i++) {
                            for (var x = 0; x < elements.length; x++) {
                                if (elements[x].hasAttributes('bwroleid')) {
                                    var roleId2 = elements[x].getAttribute('bwroleid');
                                    if (roleId2 == roles[i].RoleId) {


                                        // Found it! Now get the row element.
                                        var thisRow = $(elements[x]).closest('tr')[0]; // closest is jquery so needs to be wrapped in jquery so that this works ok in IE specifically! 2-6-2020
                                        var rect = thisRow.getBoundingClientRect(); // $(thisRow).getBoundingClientRect(); // thisRow.getBoundingClientRect(); // document.getElementById(thisRow.id).getBoundingClientRect();


                                        // Check if the workflow step/row is collapsed. We get all zeros for rect when this is the case.
                                        if (rect.left == 0 && rect.top == 0) {
                                            // We need to get a different rect!!
                                            var id = thisRow.id; // steprow-assign_6_2
                                            var stepIndex = id.split('_')[1].split('_')[0];
                                            var stepHeaderId = 'stepheaderrow_' + stepIndex;
                                            var thisRow2 = document.getElementById(stepHeaderId); // This finds the tr tag outside which should be the step tr which is always displayed.
                                            console.log('id: ' + thisRow2.id);
                                            var rect = thisRow2.getBoundingClientRect();
                                        }


                                        var masterTableRect = tableElement.getBoundingClientRect();
                                        var top = masterTableRect.top;
                                        var left = masterTableRect.left;
                                        _x = rect.left;
                                        _y = rect.top + ((rect.bottom - rect.top) / 2);


                                        // Get the origin.
                                        var thisOrigin = orgElement;






                                        var originRect = thisOrigin.getBoundingClientRect();
                                        //var originY = originRect.top + ((originRect.bottom - originRect.top) / 2) - top;
                                        //var originX = originRect.left - left;
                                        var originY = originRect.top + ((originRect.bottom - originRect.top) / 2);
                                        var originX = originRect.right; // left; // todd changed 1-28-2020 9-38am ast



                                        // We need to account for scrolling!!! This works! Yeah!
                                        //var canvas = document.getElementById("myCanvas");
                                        var canvas = document.getElementById(this.options.canvasElementId);
                                        var BB = canvas.getBoundingClientRect();
                                        originX = originX - BB.left;
                                        originY = originY - BB.top;
                                        _x = _x - BB.left;
                                        _y = _y - BB.top;
                                        // End: Accounting for scrolling.



                                        // Draw the line.
                                        ctx.beginPath(); // Always use beginPath() in order to have predictable behavior!!
                                        ctx.lineWidth = 1;
                                        ctx.strokeStyle = lineColor;
                                        ctx.moveTo(originX, originY); // This is where the line starts...
                                        ctx.lineTo(_x, _y); // This is the tr tag for the roleId in the workflow view.
                                        ctx.stroke();
                                        // Circle around the workflow diagram left roles-sides.
                                        ctx.beginPath();
                                        ctx.arc(_x, _y, 5, 0, 2 * Math.PI);
                                        //ctx.closePath();
                                        ctx.stroke();

                                        drewALineForThisRole = true;
                                        //console.log('DREW A LINE');








                                        // Now populate the participant, if available.
                                        console.log('*****************');
                                        console.log('Now populate the participant, if available. xcx12314967. roleIdsAlreadyDisplayed: ' + JSON.stringify(roleIdsAlreadyDisplayed) + ', roles[i].RoleId: ' + roles[i].RoleId + ', roles[i].ParticipantFriendlyName: ' + roles[i].ParticipantFriendlyName); // + ', roles: ' + JSON.stringify(roles));
                                        console.log('*****************');





                                        var html = '';


                                        if (roleIdsAlreadyDisplayed.indexOf(roles[i].RoleId) > -1) {
                                            // This role participant is already displayed.
                                            // If the line is already drawn, then do not populate this again, as we may get another role in a node higher up in the tree, and as a result it may display the incorrect participant here. This is very important. 4-19-2022

                                            if (displayParticipantInBackgroundAsGreyText == true) {
                                                // Display multiple role participants. 4-19-2022

                                                html += '<span bwtestid="xcx314201" style="color:' + highlightColor + ';cursor:pointer;" onclick="$(\'.bwCircleDialog2\').bwCircleDialog2(\'displayParticipantRoleMultiPickerInACircle\', true, \'\', \'' + roles[i].ParticipantId + '\', \'' + roles[i].ParticipantFriendlyName + '\', \'' + roles[i].ParticipantEmail + '\', \'' + roles[i].ParticipantLogonType + '\');">';
                                                //debugger;
                                                html += ', ' + roles[i].ParticipantFriendlyName;
                                                html += '</span>';

                                                var participantCell = thisRow.getElementsByClassName('steprowbuttons')[0];
                                                //participantCell.innerHTML = html;
                                                $(participantCell).append(html);
                                            }





                                        } else {

                                            roleIdsAlreadyDisplayed.push(roles[i].RoleId);

                                            console.log('DISPLAYING roles[i].ParticipantFriendlyName: ' + roles[i].ParticipantFriendlyName + ', roles[i].RoleId: ' + roles[i].RoleId + ', roleIdsAlreadyDisplayed: ' + JSON.stringify(roleIdsAlreadyDisplayed));

                                            if (roles[i].ParticipantFriendlyName == null) {
                                                html += '<span style="color:' + highlightColor + ';">';
                                                //html += 'No participant assigned. Is this true?';
                                                html += '</span>';
                                            } else {
                                                //debugger;
                                                html += '<span bwtestid="xcx314201" style="color:' + highlightColor + ';cursor:pointer;" onclick="$(\'.bwCircleDialog2\').bwCircleDialog2(\'displayParticipantRoleMultiPickerInACircle\', true, \'\', \'' + roles[i].ParticipantId + '\', \'' + roles[i].ParticipantFriendlyName + '\', \'' + roles[i].ParticipantEmail + '\', \'' + roles[i].ParticipantLogonType + '\');">';
                                                //debugger;
                                                html += roles[i].ParticipantFriendlyName;
                                                html += '</span>';



                                                //html += '<span style="color:' + highlightColor + ';">';
                                                //html += roles[i].ParticipantFriendlyName; // + '. Is this true?';
                                                //html += '</span>';

                                            }
                                            var participantCell = thisRow.getElementsByClassName('steprowbuttons')[0];
                                            participantCell.innerHTML = html;

                                            var roleNameCell = thisRow.getElementsByClassName('rolename')[0];
                                            roleNameCell.style.color = highlightColor; //'red';
                                        }





                                    }
                                }
                            }
                            if (!drewALineForThisRole) {
                                // If we get here, it means that a role is specified that does NOT show up at this level in the workflow!!!!!!!
                                // This is Ok if it is the 'ADMIN'.
                                if (roles[i].RoleId != 'ADMIN') {
                                    //alert('Error: Role "' + JSON.stringify(roles[i]) + '" is specified in the ORG but is not in the Workflow definition!');
                                    //var html = '';
                                    //html += 'Error: Role "' + JSON.stringify(roles[i]) + '" is specified in the ORG but is not in the Workflow definition!';
                                    //var x = document.getElementById('spanOrganizationError');
                                    //x.innerHTML = html; // This only shows the latest error, but better than nothing for the moment.
                                    console.log('Error in bwOrganizationEditor.drawLineFromOrgToWorkflowRoleAndHighlightOrg(). Could not draw a line for this role: ' + roles[i].RoleId + ' (' + roles[i].RoleName + ')');
                                }
                            }
                        }
                    }
                }
            }
        } catch (e) {



            // 9-27-2022
            console.log('***');
            console.log('***');
            console.log('***');
            console.log('Exception in drawLineFromOrgToWorkflowRoleAndHighlightOrg(): ' + e.message + ', ' + e.stack);
            console.log('***');
            console.log('***');
            console.log('***');
            displayAlertDialog('Exception in drawLineFromOrgToWorkflowRoleAndHighlightOrg(): ' + e.message + ', ' + e.stack);





        }
    },

    renderOrgRoleConnectorsToWorkflowReset: function (elementId, divisionIndex, groupIndex, entityIndex, locationIndex) {
        try {
            // On hover or click, this draws the lines and highlights any missing role assignments.
            //console.log('In renderOrgRoleConnectorsToWorkflowReset(). elementId: ' + elementId + ', divisionIndex: ' + divisionIndex + ', groupIndex: ' + groupIndex + ', entityIndex: ' + entityIndex + ', locationIndex: ' + locationIndex);





            // Todd: in progress 1-24-2020
            //$('.bwCoreComponent').bwCoreComponent('hideRowHoverDetails');





            //var element = document.getElementById(elementId);
            //element.style.color = 'black';


            //try {
            //    // Make all of the parent orgs the active color. TODD: THIS NEEDS WORK!!!!
            //    var globalId = 'spanOrgX_root';
            //    var divisionId = 'spanOrgX_' + divisionIndex;
            //    var groupId = 'spanOrgX_' + divisionIndex + '_' + groupIndex;
            //    var legalEntityId = 'spanOrgX_' + divisionIndex + '_' + groupIndex + '_' + entityIndex;
            //    var globalElement = document.getElementById(globalId);
            //    globalElement.style.color = this.options.color.Default;
            //    var divisionElement = document.getElementById(divisionId);
            //    divisionElement.style.color = this.options.color.Default;
            //    var groupElement = document.getElementById(groupId);
            //    groupElement.style.color = this.options.color.Default;
            //    var legalEntityElement = document.getElementById(legalEntityId);
            //    legalEntityElement.style.color = this.options.color.Default;
            //    //End: Make all of the parent orgs the active color.
            //} catch (e) {
            //    // do nothing this is temporary
            //}

            //// Selected element.
            //var element = document.getElementById(elementId);
            //element.style.color = this.options.color.Default; //'aqua'; //.fontWeight = 'bold';

        } catch (e) {
            console.log('Exception in renderOrgRoleConnectorsToWorkflowReset(): ' + e.message + ', ' + e.stack);
        }
    },


    renderOrgEditorInACircle: function (divisionIndex, groupIndex, entityIndex, locationIndex) {
        try {
            console.log('In renderOrgEditorInACircle().');
            var thiz = this;

            //var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            // This determines the id of the element, depending on the passed parameters.
            var originElementId;
            if (locationIndex || locationIndex > -1) {
                originElementId = 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex + '_' + entityIndex + '_' + locationIndex; // eg: spanWorkflowPeoplePicker_0_0_0_1
            } else if (entityIndex || entityIndex > -1) {
                originElementId = 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex + '_' + entityIndex;
            } else if (groupIndex || groupIndex > -1) {
                originElementId = 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex;
            } else if (divisionIndex || divisionIndex > -1) {
                originElementId = 'spanWorkflowPeoplePicker_' + divisionIndex;
            } else {
                debugger;
                alert('Error: Unexpected parameter in renderOrgEditorInACircle().');
            }

            //
            // DISPLAY THE ROLES INCLUDED IN THE JSON 
            //
            var json = this.options.store;
            var roles, orgName, orgPath;
            if (locationIndex || locationIndex > -1) {
                roles = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex].Roles;
                orgName = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex].Name;
                orgPath = json.Global.Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex].Name;
            } else if (entityIndex || entityIndex > -1) {
                roles = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Roles;
                orgName = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Name;
                orgPath = json.Global.Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Name;
            } else if (groupIndex || groupIndex > -1) {
                roles = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Roles;
                orgName = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Name;
                orgPath = json.Global.Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Name;
            } else if (divisionIndex || divisionIndex > -1) {
                if (divisionIndex == 'root') {
                    roles = json.Global.Roles;
                    orgName = json.Global.Name;
                    orgPath = json.Global.Name;
                } else {
                    roles = json.Global.Divisions.Items[divisionIndex].Roles;
                    orgName = json.Global.Divisions.Items[divisionIndex].Name;
                    orgPath = json.Global.Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Name;
                }
            } else {
                debugger;
                alert('Error: Unexpected parameter in renderOrgEditorInACircle():2:.');
            }


            var html = '';
            html += '  <table style="width:100%;">';
            html += '    <tr>';
            html += '      <td style="width:90%;">';
            html += '        <span style="color: #3f3f3f;font-size:30pt;font-weight:bold;">' + orgName + '</span>';
            html += '      </td>';
            html += '      <td style="width:9%;"></td>';
            html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'hideOrgEditorInACircle\', \'' + divisionIndex + '\', \'' + groupIndex + '\', \'' + entityIndex + '\', \'' + locationIndex + '\');">X</span>';
            html += '      </td>';
            html += '    </tr>';
            html += '  </table>';
            //html += '  <br /><br />';
            html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';

            //html += '<span style="color:blue;">' + orgName + '</span>';
            //html += '<br />';



            html += '<span id="spanDivRolePickerDropDown_OrgPath" style="color:purple;font-size:15pt;">';
            html += orgPath;
            html += '</span>';
            html += '<br />';
            html += '<br />';



            html += '<span id="spanSelectedRolesInRolePickerDropdown"></span>';

            var selectedRolesHtml = '';
            if (roles && roles.length) {
                for (var r = 0; r < roles.length; r++) {
                    if (roles[r].ParticipantIsDirty == true && roles[r].ParticipantIsDirtyAction == 'REMOVE') {
                        // Do nothing. Don't display, this is just so that the user org role gets removed when published back to the server.
                        selectedRolesHtml += '<span style="color:tomato;">';
                        selectedRolesHtml += '*ROLE ' + roles[r].RoleName + ' (' + roles[r].RoleId + ') IS PENDING DELETION ON NEXT PUBLISH*';
                        selectedRolesHtml += '</span>';
                        selectedRolesHtml += '<br />';
                    } else {



                        //debugger;
                        //// 1-16-2022
                        //if (roles[r].RoleId == 'ADMIN') {
                        //    selectedRolesHtml += roles[r].RoleName + ' (' + roles[r].RoleId + ') - ' + '<span style="cursor:pointer;" title="' + roles[r].ParticipantEmail + '">' + roles[r].ParticipantFriendlyName + '</span>';
                        //    var stepIndex = -1;
                        //    var roleIndex = -1;
                        //    //selectedRolesHtml += '&nbsp;<img style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayPeoplePickerDialogForJson\', \'' + roles[r].RoleId + '\', \'' + roles[r].RoleName + '\', \'' + divisionIndex + '\', \'' + groupIndex + '\', \'' + entityIndex + '\', \'' + locationIndex + '\');" src="images/addressbook-icon18x18.png">';
                        //    selectedRolesHtml += '<br />';
                        //} else {
                        //    selectedRolesHtml += roles[r].RoleName + ' (' + roles[r].RoleId + ') - ' + '<span style="cursor:pointer;" title="' + roles[r].ParticipantEmail + '">' + roles[r].ParticipantFriendlyName + '</span>';
                        //    var stepIndex = -1;
                        //    var roleIndex = -1;
                        //    selectedRolesHtml += '&nbsp;<img style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayPeoplePickerDialogForJson\', \'' + roles[r].RoleId + '\', \'' + roles[r].RoleName + '\', \'' + divisionIndex + '\', \'' + groupIndex + '\', \'' + entityIndex + '\', \'' + locationIndex + '\');" src="images/addressbook-icon18x18.png">';
                        //    selectedRolesHtml += '<br />';
                        //}





                        selectedRolesHtml += roles[r].RoleName + ' (' + roles[r].RoleId + ') - ' + '<span style="cursor:pointer;" title="' + roles[r].ParticipantEmail + '">' + roles[r].ParticipantFriendlyName + '</span>';
                        var stepIndex = -1;
                        var roleIndex = -1;
                        selectedRolesHtml += '&nbsp;<img style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayPeoplePickerDialogForJson\', \'' + roles[r].RoleId + '\', \'' + roles[r].RoleName + '\', \'' + divisionIndex + '\', \'' + groupIndex + '\', \'' + entityIndex + '\', \'' + locationIndex + '\');" src="images/addressbook-icon18x18.png">';
                        selectedRolesHtml += '<br />';


                    }
                }
            } else {
                selectedRolesHtml += '<span style="color:tomato;">';
                selectedRolesHtml += '*NO ROLES SPECIFIED FOR THIS ORG*';
                selectedRolesHtml += '</span>';
                selectedRolesHtml += '<br />';
            }

            $.ajax({
                url: globalUrlPrefix + globalUrlForWebServices + "/odata/Roles/" + workflowAppId + "/" + participantId,
                dataType: "json",
                contentType: "application/json",
                type: "Get",
                timeout: ajaxTimeout
            }).done(function (result) {
                try {
                    console.log('In bwOrganizationEditor.js.renderOrgEditorInACircle().Get[odata/Roles].done().');
                    var car = result.workflow;
                    var roles2;
                    if (result) {
                        roles2 = result.userRoles;
                    } else {
                        console.log('In bwOrganizationEditor.js.renderOrgEditorInACircle().Get[odata/Roles].done: result: bad identifier here, please reword.. ' + JSON.stringify(result));
                    }

                    html += '<hr style="border-top: 1px dashed #95b1d3;" />'; // border-top: 1px dashed red;
                    html += '<span style="font-style:italic;">Add or remove roles by using the checkboxes:</span><br />';


                    // Iterate through the steps. Then the informs, then the assigns. Make an array of the roles. { RoleId, RoleName }
                    var workflowRoles = [];
                    for (var i = 0; i < car.Workflow.Steps.Step.length; i++) {
                        var stepName = car.Workflow.Steps.Step[i]["@Name"];
                        if (stepName == 'Create' || stepName == 'Revise' || stepName == 'Admin') {
                            // Do nothing, not displaying these steps.
                        } else {
                            // Populate Inform roles.
                            if (car.Workflow.Steps.Step[i].Inform && car.Workflow.Steps.Step[i].Inform.length) {
                                if (car.Workflow.Steps.Step[i].Inform.length > 0) {
                                    for (var j = 0; j < car.Workflow.Steps.Step[i].Inform.length; j++) {
                                        var isSelected = false;
                                        if (roles) {
                                            for (var r = 0; r < roles.length; r++) {
                                                if (roles[r].RoleId == car.Workflow.Steps.Step[i].Inform[j]["@Role"]) {
                                                    isSelected = true;
                                                }
                                            }
                                        }
                                        var shouldWeSaveThisRoleToTheArray = true;
                                        var roleId = car.Workflow.Steps.Step[i].Inform[j]["@Role"];
                                        for (var x = 0; x < workflowRoles.length; x++) {
                                            if (workflowRoles[x].RoleId == roleId) {
                                                // It is already in the array, so don't save it.
                                                shouldWeSaveThisRoleToTheArray = false;
                                            }
                                        }
                                        if (shouldWeSaveThisRoleToTheArray) {
                                            var roleName = car.Workflow.Steps.Step[i].Inform[j]["@RoleName"];
                                            var workflowRole = {
                                                RoleId: roleId,
                                                RoleName: roleName,
                                                Selected: isSelected
                                            };
                                            workflowRoles.push(workflowRole);
                                        }
                                    }
                                }
                            }
                            // Populate Assign roles.
                            if (car.Workflow.Steps.Step[i].Assign) {
                                if (car.Workflow.Steps.Step[i].Assign.length > 0) {
                                    for (var j = 0; j < car.Workflow.Steps.Step[i].Assign.length; j++) {
                                        var isSelected = false;
                                        if (roles) {
                                            for (var r = 0; r < roles.length; r++) {
                                                if (roles[r].RoleId == car.Workflow.Steps.Step[i].Assign[j]["@Role"]) {
                                                    isSelected = true;
                                                }
                                            }
                                        }
                                        var shouldWeSaveThisRoleToTheArray = true;
                                        var roleId = car.Workflow.Steps.Step[i].Assign[j]["@Role"];
                                        for (var x = 0; x < workflowRoles.length; x++) {
                                            if (workflowRoles[x].RoleId == roleId) {
                                                // It is already in the array, so don't save it.
                                                shouldWeSaveThisRoleToTheArray = false;
                                            }
                                        }
                                        if (shouldWeSaveThisRoleToTheArray) {
                                            var roleName = car.Workflow.Steps.Step[i].Assign[j]["@RoleName"];
                                            var workflowRole = {
                                                RoleId: roleId,
                                                RoleName: roleName,
                                                Selected: isSelected
                                            };
                                            workflowRoles.push(workflowRole);
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Sort alphabetically.
                    var prop = 'RoleId';
                    workflowRoles = workflowRoles.sort(function (a, b) {
                        if (true) { //asc, false for desc.
                            if (a[prop] > b[prop]) return 1;
                            if (a[prop] < b[prop]) return -1;
                            return 0;
                        } else {
                            if (b[prop] > a[prop]) return 1;
                            if (b[prop] < a[prop]) return -1;
                            return 0;
                        }
                    });
                    // End: Sort alphabetically.

                    // Iterate through the "workflow" roles and display the ui.
                    html += '<div id="divRolePickerDropDown_RolesCheckboxes" style="overflow-y:auto;">'; // Scrollable div containing the available roles.
                    if (workflowRoles.length) {
                        html += '<table>';
                        for (var w = 0; w < workflowRoles.length; w++) {
                            html += '<tr class="orgRow">';
                            var isSelected = false;
                            if (roles) {
                                for (var r = 0; r < roles.length; r++) {
                                    if (roles[r].ParticipantIsDirty == true && roles[r].ParticipantIsDirtyAction == 'REMOVE') {
                                        // Do nothing. Don't display, this is just so that the user org role gets removed when published back to the server.
                                        html += '<span style="color:tomato;">';
                                        html += '*ROLE ' + roles[r].RoleName + ' (' + roles[r].RoleId + ') IS PENDING DELETION ON NEXT PUBLISH*';
                                        html += '</span>';
                                        html += '<br />';
                                    } else {
                                        if (roles[r].RoleId == workflowRoles[w].RoleId) {
                                            isSelected = true;
                                        }
                                    }
                                }
                            }
                            if (isSelected) {
                                html += '<td>xcx51<input id="' + 'orgRoleCheckbox_' + w + '" type="checkbox" checked onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'OrgRoleCheckbox_Onchange\', \'' + 'orgRoleCheckbox_' + w + '\', \'' + workflowRoles[w].RoleId + '\', \'' + workflowRoles[w].RoleName + '\', \'' + divisionIndex + '\', \'' + groupIndex + '\', \'' + entityIndex + '\', \'' + locationIndex + '\');" /></td>';
                            } else {
                                html += '<td>xcx52<input id="' + 'orgRoleCheckbox_' + w + '" type="checkbox" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'OrgRoleCheckbox_Onchange\', \'' + 'orgRoleCheckbox_' + w + '\', \'' + workflowRoles[w].RoleId + '\', \'' + workflowRoles[w].RoleName + '\', \'' + divisionIndex + '\', \'' + groupIndex + '\', \'' + entityIndex + '\', \'' + locationIndex + '\');" /></td>';
                            }
                            html += '<td class="roleId">' + workflowRoles[w].RoleId + '</td>';
                            html += '<td>&nbsp;</td>';
                            html += '<td class="roleName">' + workflowRoles[w].RoleName + '</td>';
                            html += '</tr>';
                        }
                        html += '</table>';
                    } else {
                        html += '<br /><span style="color:tomato;">Error: No workflow roles to display.xcx1</span><br />';
                    }
                    html += '</div>';
                    html += '<br />';
                    html += '&nbsp;<input style="padding:5px 10px 5px 10px;" id="btnCreateRole2" type="button" value="cxc1Edit Roles..." onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'displayCreateANewRoleDialog\');" />';

                    //
                    // This determines which button will be displayed... Add or Edit, etc.
                    //
                    if (locationIndex || locationIndex > -1) {
                        html += '  <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;white-space:nowrap;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'editLocation\', \'' + divisionIndex + '\', \'' + groupIndex + '\', \'' + entityIndex + '\', \'' + locationIndex + '\');">✎<span style="text-decoration:underline;white-space:nowrap;">Edit</span></span>';
                    } else if (entityIndex || entityIndex > -1) {
                        html += '  <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'editLegalEntity\', \'' + divisionIndex + '\', \'' + groupIndex + '\', \'' + entityIndex + '\');">✎<span style="text-decoration:underline;">Edit</span></span>';
                    } else if (groupIndex || groupIndex > -1) {
                        html += '  <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'editGroup\', \'' + divisionIndex + '\', \'' + groupIndex + '\');">✎<span style="text-decoration:underline;">Edit</span></span>';
                    } else if (divisionIndex || divisionIndex > -1) {
                        if (divisionIndex == 'root') {
                            //html += '&nbsp;<span title="Add a Division..." id="divisionsRootNode" style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;text-decoration:underline;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'addADivision\');"> ✚ Add a new Divisionxx</span>';

                            //debugger;
                            //// Add an Edit button here so that the user can rename the root org!
                            //html += '  <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'editDivision\', \'' + divisionIndex + '\');">✎<span style="text-decoration:underline;">Edit</span></span>';



                        } else {
                            html += '  <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'editDivision\', \'' + divisionIndex + '\');">✎<span style="text-decoration:underline;">Edit</span></span>';
                        }
                    } else {
                        debugger;
                        alert('Error: Unexpected parameter in renderOrgEditorInACircle():3:.');
                    }

                    var divOrgRoleSummaryDialog = document.getElementById('divOrgRoleSummaryDialog');
                    divOrgRoleSummaryDialog.innerHTML = html;

                    document.getElementById('spanSelectedRolesInRolePickerDropdown').innerHTML = selectedRolesHtml; // Display the selected roles.

                    //var canvas = document.getElementById('myCanvas');
                    var canvas = document.getElementById(thiz.options.canvasElementId);
                    canvas.style.zIndex = 11; // Bring it to the front!
                    //canvas.width = maxWidth; // This resizes the bitmap from 300x150 to what we want. This prevents scaling of our drawing...
                    //canvas.height = maxHeight; // This resizes the bitmap from 300x150 to what we want. This prevents scaling of our drawing...
                    var ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas.
                    thiz.renderOrgRoleConnectorsToWorkflow(false, divisionIndex, groupIndex, entityIndex, locationIndex); // Draw the lines. // The canvas gets sized properly in this method.

                    var tableElement = document.getElementById('tableOrgRoles2'); // This is the table which is also in the same size and position as the canvas.
                    var tableRect = tableElement.getBoundingClientRect();
                    var tableTop = tableRect.top;
                    var tableLeft = tableRect.left;

                    var originElement = document.getElementById(originElementId); // This is the button for the Org, so that the circle is placed next to this org tree node.
                    var originRect = originElement.getBoundingClientRect();
                    var originTop = originRect.bottom + window.pageYOffset;
                    var originLeft = originRect.left + window.pageXOffset;

                    var dialogWidth = '600px';
                    var dialogHeight = '600px';
                    divOrgRoleSummaryDialog.style.top = originTop + 'px';
                    divOrgRoleSummaryDialog.style.left = originLeft + 'px';
                    divOrgRoleSummaryDialog.style.width = dialogWidth;
                    divOrgRoleSummaryDialog.style.height = dialogHeight;
                    divOrgRoleSummaryDialog.style.display = 'block';
                    divOrgRoleSummaryDialog.style.background = 'transparent';
                    divOrgRoleSummaryDialog.style.border = '0px';
                    divOrgRoleSummaryDialog.style.zIndex = 12;

                    var dialogRect = divOrgRoleSummaryDialog.getBoundingClientRect();
                    var dialogWidth = dialogRect.right - dialogRect.left;

                    var largeCircleRadius = (dialogWidth * Math.sqrt(2)) / 2;

                    var smallCircleCenterX = dialogRect.left + 150;
                    var smallCircleCenterY = dialogRect.top - 150;
                    var smallCircleRadius = ((dialogWidth / 4) * Math.sqrt(2)) / 2;
                    var smallCircleDiameter = smallCircleRadius * 2;

                    var smallCircleX = smallCircleCenterX - smallCircleRadius;
                    var centerOfCanvasX = (tableRect.right - tableRect.left) / 2;
                    var smallCircleRight = smallCircleX + smallCircleRadius + window.pageXOffset + smallCircleRadius;
                    var tableRight = centerOfCanvasX + (tableRect.width / 2);

                    var distanceFromRightEdgeOfCanvas = tableRight - smallCircleRight;
                    if (distanceFromRightEdgeOfCanvas > -1) {
                        //alert('No clipping of the dialog is occuring. distanceFromRightEdgeOfCanvas: ' + distanceFromRightEdgeOfCanvas);
                    } else {
                        //alert('The dialog right side is clipped so we need to recalculate. distanceFromRightEdgeOfCanvas: ' + distanceFromRightEdgeOfCanvas);
                        var pixelsToTheLeftOfTheBigCircle = centerOfCanvasX - largeCircleRadius;
                        var newCenterpointX = (((pixelsToTheLeftOfTheBigCircle - distanceFromRightEdgeOfCanvas) / 2) + largeCircleRadius) + tableLeft;
                        originLeft = (newCenterpointX - (dialogWidth / 2));
                        divOrgRoleSummaryDialog.style.left = originLeft + 'px'; // Center the dialog on this spot.
                        // Reset the appropriate measurements so it gets redrawn Ok!
                        var dialogRect = divOrgRoleSummaryDialog.getBoundingClientRect();
                        var dialogWidth = dialogRect.right - dialogRect.left;

                        var largeCircleRadius = (dialogWidth * Math.sqrt(2)) / 2;

                        var smallCircleCenterX = dialogRect.left + 150;
                        var smallCircleCenterY = dialogRect.top - 150;
                        var smallCircleRadius = ((dialogWidth / 4) * Math.sqrt(2)) / 2;
                        var smallCircleDiameter = smallCircleRadius * 2;

                        var smallCircleX = smallCircleCenterX - smallCircleRadius;
                        var centerOfCanvasX = (tableRect.right - tableRect.left) / 2;
                        var smallCircleRight = smallCircleX + smallCircleRadius + window.pageXOffset + smallCircleRadius;
                        var tableRight = centerOfCanvasX + (tableRect.width / 2);
                    }

                    // This circle encompasses divOrgRoleSummaryDialog.
                    var centerX = dialogRect.left + ((dialogRect.right - dialogRect.left) / 2) - tableLeft;
                    var centerY = dialogRect.top + ((dialogRect.bottom - dialogRect.top) / 2) - tableTop;
                    ctx.beginPath();
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = '#95b1d3';
                    ctx.arc(centerX, centerY, largeCircleRadius, 0, 2 * Math.PI);
                    ctx.stroke();
                    ctx.fillStyle = 'white';
                    ctx.fill();
                    // This is the small circle which displays the Org image.
                    ctx.beginPath();
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = '#95b1d3';
                    ctx.arc(smallCircleCenterX, smallCircleCenterY, smallCircleRadius, 0, 2 * Math.PI);
                    ctx.stroke();
                    ctx.fillStyle = 'aliceblue';
                    ctx.fill();
                    // This is where the image is loaded and displayed.
                    var dy = smallCircleCenterY - smallCircleRadius;
                    var img = new Image();
                    img.src = 'images/corporeal.png';
                    img.onload = function (e) {
                        ctx.drawImage(img, 0, 0, 400, 400, smallCircleX, dy, smallCircleDiameter, smallCircleDiameter);
                    }

                    // REFERENCE CODE: Mark the center point.
                    // Draw a circle in the X center of the canvas.
                    //ctx.beginPath();
                    //ctx.lineWidth = 3;
                    //ctx.strokeStyle = 'red';
                    //ctx.arc(centerOfCanvasX, 400, 5, 0, 2 * Math.PI);
                    //ctx.stroke();
                    //// Draw a line to demonstrate the edge of the dialog small circle.
                    //ctx.beginPath(); // Always use beginPath() in order to have predictable behavior!!
                    //ctx.lineWidth = 10;
                    //ctx.strokeStyle = 'red';
                    //ctx.moveTo(smallCircleRight, 400); // This is where the line starts...
                    //ctx.lineTo(tableRight, 400); // This is the tr tag for the roleId in the workflow view.
                    //ctx.stroke();
                    // End: REFERENCE CODE.





                    //var dy = divY - radius + (radius * 2);
                    //var img = new Image();
                    //img.src = 'images/userimage.png';
                    //img.onload = function (e) {
                    //    ctx.drawImage(img, 0, 0, 512, 512, dx, dy, diameter, diameter);

                    //    var dy2 = dy + (radius * 2);
                    //    ctx.drawImage(img, 0, 0, 512, 512, dx, dy2, diameter, diameter);

                    //    var dy3 = dy2 + (radius * 2);
                    //    ctx.drawImage(img, 0, 0, 512, 512, dx, dy3, diameter, diameter);

                    //}

                    //var dy2 = dy + (radius * 2);
                    //var img2 = new Image();
                    //img2.src = 'images/userimage.png';
                    //img2.onload = function (e) {
                    //    ctx.drawImage(img, 0, 0, 512, 512, dx, dy2, diameter, diameter);
                    //}

                    //if (roles2 && roles2.length) {
                    //    for (var r = 0; r < roles2.length; r++) {
                    //        // NEW USER ROLE ASSIGNMENT FOR THIS ORG!!!!!!!!!!!!!!!!
                    //        var dx = divX - radius;
                    //        var dy = (divY - radius + (radius * 2)) * r;
                    //        var img = new Image();
                    //        img.src = 'images/userimage.png';
                    //        img.onload = function (e) {
                    //            ctx.drawImage(img, 0, 0, 512, 512, dx, dy, diameter, diameter);
                    //        }
                    //    }
                    //}



                    //canvas.style.background = 'rgba(240, 248, 255, 0.5)'; // This gives a visual indication that nothing except the stuff in the circles can be clicked on.
                    canvas.style.background = 'rgba(0, 0, 0, 0.2)'; // This gives a visual indication that nothing except the stuff in the circles can be clicked on.
                    canvas.onclick = function (e) {
                        // This event closes the circle when it's clicked on, just like the jquery dialogs (see below).
                        console.log('The user clicked the canvas, so hiding the circle dialog.');
                        thiz.hideOrgEditorInACircle();
                        //.ui-widget-overlay {
                        //    opacity: 0.5;
                        //    filter: Alpha(Opacity=50);
                        //    background-color: black;
                        //}
                    };

                } catch (e) {
                    console.log('Exception in bwOrganizationEditor.js.renderOrgEditorInACircle().Get[odata/Orgs].done: ' + e.message + ', ' + e.stack);
                }
            }).fail(function (data) {
                var msg;
                if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                } else {
                    msg = JSON.stringify(data);
                }
                alert('Error in bwOrganizationEditor.js.renderOrgEditorInACircle().Get[odata/Orgs].fail: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                console.log('Error in bwOrganizationEditor.js.renderOrgEditorInACircle().Get[odata/Orgs].fail:' + JSON.stringify(data));
                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                //var error = JSON.parse(data.responseText)["odata.error"];
                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            });
        } catch (e) {
            console.log('Exception in bwOrganizationEditor.js.renderOrgEditorInACircle(): ' + e.message + ', ' + e.stack);
        }
    },
    OrgRoleCheckbox_Onchange: function (checkboxId, roleId, roleName, divisionIndex, groupIndex, entityIndex, locationIndex) {
        try {
            console.log('In OrgRoleCheckbox_Onchange(). checkboxId: ' + checkboxId + ', roleId: ' + roleId + ', roleName: ' + roleName + ', divisionIndex: ' + divisionIndex + ', groupIndex: ' + groupIndex + ', entityIndex: ' + entityIndex + ', locationIndex: ' + locationIndex);
            var json = this.options.store;
            var roles;
            if ((locationIndex && locationIndex != 'undefined') || locationIndex > -1) {
                if (!json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex].Roles) {
                    json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex]["Roles"] = [];
                }
                roles = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex].Roles;
            } else if ((entityIndex && entityIndex != 'undefined') || entityIndex > -1) {
                if (!json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Roles) {
                    json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex]["Roles"] = [];
                }
                roles = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Roles;
            } else if ((groupIndex && groupIndex != 'undefined') || groupIndex > -1) {
                if (!json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Roles) {
                    json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex]["Roles"] = [];
                }
                roles = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Roles;
            } else if ((divisionIndex && divisionIndex != 'undefined') || divisionIndex > -1) {
                if (divisionIndex == 'root') {
                    if (!json.Global.Roles) {
                        json.Global["Roles"] = [];
                    }
                    roles = json.Global.Roles;
                } else {
                    if (!json.Global.Divisions.Items[divisionIndex].Roles) {
                        json.Global.Divisions.Items[divisionIndex]["Roles"] = [];
                    }
                    roles = json.Global.Divisions.Items[divisionIndex].Roles;
                }
            } else {
                alert('Error: Unexpected parameter in OrgRoleCheckbox_Onchange():1:.');
            }
            var thisCheckbox = document.getElementById(checkboxId);
            if (thisCheckbox.checked) {
                // The user has added this role.
                var newRole = {
                    RoleId: roleId,
                    RoleName: roleName,
                    ParticipantId: null,
                    ParticipantFriendlyName: null,
                    ParticipantEmail: null
                };
                roles.push(newRole);
            } else {
                // The user has removed this role.
                for (var i = 0; i < roles.length; i++) {
                    if (roles[i].RoleId == roleId) {
                        //// Delete this role from the roles array!!
                        //roles.splice(i, 1);
                        // Mark this role to be deleted when published back to the server!
                        roles[i].ParticipantIsDirty = true;
                        roles[i].ParticipantIsDirtyAction = 'REMOVE';
                    }
                }
            }

            // Render.
            var html = '';
            if (roles && roles.length) {
                for (var r = 0; r < roles.length; r++) {
                    if (roles[r].ParticipantIsDirty == true && roles[r].ParticipantIsDirtyAction == 'REMOVE') {
                        // Do nothing. Don't display, this is just so that the user org role gets removed when published back to the server.
                        html += '<span style="color:tomato;">';
                        html += '*ROLE ' + roles[r].RoleName + ' (' + roles[r].RoleId + ') IS PENDING DELETION ON NEXT PUBLISH*';
                        html += '</span>';
                        html += '<br />';
                    } else {
                        html += roles[r].RoleName + ' (' + roles[r].RoleId + ') - ' + '<span style="cursor:pointer;" title="' + roles[r].ParticipantEmail + '">' + roles[r].ParticipantFriendlyName + '</span>';
                        var stepIndex = -1;
                        var roleIndex = -1;
                        html += '&nbsp;<img style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayPeoplePickerDialogForJson\', \'' + roles[r].RoleId + '\', \'' + roles[r].RoleName + '\', \'' + divisionIndex + '\', \'' + groupIndex + '\', \'' + entityIndex + '\', \'' + locationIndex + '\');" src="images/addressbook-icon18x18.png">';
                        html += '<br />';
                    }
                }
            } else {
                html += '<span style="color:tomato;">';
                html += '*NO ROLES SPECIFIED FOR THIS ORG*';
                html += '</span>';
                html += '<br />';
            }
            document.getElementById('spanSelectedRolesInRolePickerDropdown').innerHTML = html; // Display the selected roles.

            // Size adjustment so that the dialog stays in the circle height of 300px;
            var orgPathElement = document.getElementById('spanDivRolePickerDropDown_OrgPath'); // The org path breadcrumb. It varies in height.
            var orgPathRect = orgPathElement.getBoundingClientRect();
            var orgPathHeight = orgPathRect.bottom - orgPathRect.top;
            var selectedRolesElement = document.getElementById('spanSelectedRolesInRolePickerDropdown'); // This is the listing of selected roles at the top, which varies in height.
            var selectedRolesRect = selectedRolesElement.getBoundingClientRect();
            var selectedRolesHeight = selectedRolesRect.bottom - selectedRolesRect.top;
            //
            var height = 425 - orgPathHeight - selectedRolesHeight; // 600 // 400
            document.getElementById('divRolePickerDropDown_RolesCheckboxes').style.height = height + 'px';





            // Check if we need to display the publish button.
            this.checkIfWeHaveToDisplayThePublishChangesButton();
        } catch (e) {
            console.log('Exception in OrgRoleCheckbox_Onchange(): ' + e.message + ', ' + e.stack);
        }
    },
    hideOrgEditorInACircle: function (divisionIndex, groupIndex, entityIndex, locationIndex) {
        try {
            console.log('In hideOrgEditorInACircle().');
            //debugger;
            var divOrgRoleSummaryDialog = document.getElementById('divOrgRoleSummaryDialog');
            divOrgRoleSummaryDialog.style.display = 'none';

            //var canvas = document.getElementById("myCanvas");
            var canvas = document.getElementById(this.options.canvasElementId);
            canvas.style.zIndex = -1; // Important to send it to back, otherwise the user won't be able to interact with the UI.
            var ctx = canvas.getContext('2d');

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            this.renderOrgRoleConnectorsToWorkflow(false, divisionIndex, groupIndex, entityIndex, locationIndex);

            canvas.style.background = ''; // Resets the background to the normal behavior. Pretty cool! 


        } catch (e) {
            console.log('Exception in hideOrgEditorInACircle(): ' + e.message + ', ' + e.stack);
        }
    },
    drawLineFromOrgToWorkflowRole2: function (ctx, tableElement, width, height, roles, originElementId, divisionIndex, groupIndex, entityIndex, locationIndex) {
        try {
            //console.log('In drawLineFromOrgToWorkflowRole2(). roleId: ' + roleId);
            var json = this.options.store;
            var _x = 0;
            var _y = 0;
            var top, left;
            // Find the location of the CIO in the Workflow diagram.
            var elements = tableElement.getElementsByClassName('rolename');

            this.drawLineFromOrgToWorkflowRole3(ctx, elements, roles, originElementId, tableElement, this.options.color.Active); //'red');

            //
            // Crawl backwards through the ORG (to the top), looking for a matching RoleId. Go all the way to the top to ensure there aren't duplicates!!!
            //
            var originElementId;
            if (locationIndex || locationIndex > -1) {
                // Look at the parent Legal Entity.
                originElementId = 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex + '_' + entityIndex;
                var roles = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Roles;
                this.drawLineFromOrgToWorkflowRole3(ctx, elements, roles, originElementId, tableElement, this.options.color.LegalEntity2); //'#29685F'); // #29685F galapagos green
                // Look at the parent Group.
                originElementId = 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex;
                var roles = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Roles;
                this.drawLineFromOrgToWorkflowRole3(ctx, elements, roles, originElementId, tableElement, this.options.color.LegalEntity); //'#ff9900');
                // Look at the parent Division.
                originElementId = 'spanWorkflowPeoplePicker_' + divisionIndex;
                var roles = json.Global.Divisions.Items[divisionIndex].Roles;
                this.drawLineFromOrgToWorkflowRole3(ctx, elements, roles, originElementId, tableElement, this.options.color.Group); //'#ffff00');
                // Look at the root/Global.
                originElementId = 'spanWorkflowPeoplePicker_root';
                var roles = json.Global.Roles;
                this.drawLineFromOrgToWorkflowRole3(ctx, elements, roles, originElementId, tableElement, this.options.color.Global); //'#0066ff');
            } else if (entityIndex || entityIndex > -1) {
                // Look at the parent Group.
                originElementId = 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex;
                var roles = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Roles;
                this.drawLineFromOrgToWorkflowRole3(ctx, elements, roles, originElementId, tableElement, this.options.color.LegalEntity); // '#ff9900');
                // Look at the parent Division.
                originElementId = 'spanWorkflowPeoplePicker_' + divisionIndex;
                var roles = json.Global.Divisions.Items[divisionIndex].Roles;
                this.drawLineFromOrgToWorkflowRole3(ctx, elements, roles, originElementId, tableElement, this.options.color.Group); //'#ffff00');
                // Look at the root/Global.
                originElementId = 'spanWorkflowPeoplePicker_root';
                var roles = json.Global.Roles;
                this.drawLineFromOrgToWorkflowRole3(ctx, elements, roles, originElementId, tableElement, this.options.color.Global); //'#0066ff');
            } else if (groupIndex || groupIndex > -1) {
                // Look at the parent Division.
                originElementId = 'spanWorkflowPeoplePicker_' + divisionIndex;
                var roles = json.Global.Divisions.Items[divisionIndex].Roles;
                this.drawLineFromOrgToWorkflowRole3(ctx, elements, roles, originElementId, tableElement, this.options.color.Group); //'#ffff00');
                // Look at the root/Global.
                originElementId = 'spanWorkflowPeoplePicker_root';
                var roles = json.Global.Roles;
                this.drawLineFromOrgToWorkflowRole3(ctx, elements, roles, originElementId, tableElement, this.options.color.Global); //'#0066ff');
            } else if (divisionIndex || divisionIndex > -1) {
                if (divisionIndex == 'root') {
                    // Do nothing, already at the root/Global node.
                } else {
                    // Look at the root/Global.
                    originElementId = 'spanWorkflowPeoplePicker_root';
                    var roles = json.Global.Roles;
                    this.drawLineFromOrgToWorkflowRole3(ctx, elements, roles, originElementId, tableElement, this.options.color.Global); //'#0066ff');
                }
            } else {
                debugger;
                alert('Error: Unexpected parameter in drawLineFromOrgToWorkflowRole2():2:.');
            }

        } catch (e) {
            console.log('Exception in drawLineFromOrgToWorkflowRole2(): ' + e.message + ', ' + e.stack);
        }
    },

    selectOrganizationalStructure_OnChange: function () {
        try {
            console.log('In selectOrganizationalStructure_OnChange().');
            var selectedValue = document.getElementById('selectOrganizationalStructure').value;


            alert('In selectOrganizationalStructure_OnChange(). selectedValue: ' + selectedValue + '. This functionality is incomplete. Coming soon!');
        } catch (e) {
            console.log('Exception in selectOrganizationalStructure_OnChange(): ' + e.message + ', ' + e.stack);
        }
    },
    collapseOrExpandTree: function (instructions, elementId, divisionIndex, groupIndex, entityIndex) {
        try {
            console.log('In collapseOrExpandTree().');

            //if (instructions == 'collapsethisdivision') {
            //    // Todd: Incorporating instructions so we get this working 100%.
            //    debugger;




            //}


            //debugger;
            if (entityIndex || entityIndex > -1) {
                //debugger;
                //this.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Style = 'display:none;'; // Collapse!
                //this._create();


                if (document.getElementById(elementId).innerHTML.indexOf('drawer-open.png') > -1) {
                    // Expand all of the divisions.
                    document.getElementById(elementId).innerHTML = '<img title="collapse" style="cursor:pointer;width:23px;height:23px;vertical-align:middle;" src="images/drawer-close.png" /> ';
                    //var json = this.options.store;
                    //for (var g = 0; g < json.Global.Divisions.Items[divisionIndex].Groups.Items.length; g++) {
                    // expand
                    //debugger;
                    var elementId2 = 'trDivisionGroupsGroupLegalEntitiesLocations_' + divisionIndex + '_' + groupIndex + '_' + entityIndex;
                    //try {
                    document.getElementById(elementId2).style.display = 'table-row';
                    //} catch (e) { }
                    // change the icon
                    //document.getElementById('spanDivisionTreeExpandCollapseButton_' + divisionIndex).innerHTML = '⚊ '; // This is the division root node
                    //}
                } else {
                    // Collapse all of the divisions.
                    document.getElementById(elementId).innerHTML = '<img title="collapse" style="cursor:pointer;width:23px;height:23px;vertical-align:middle;" src="images/drawer-open.png" /> '; // This is the root global node.
                    //var json = this.options.store;
                    //for (var g = 0; g < json.Global.Divisions.Items[divisionIndex].Groups.Items.length; g++) {
                    // collapse
                    //debugger;
                    var elementId2 = 'trDivisionGroupsGroupLegalEntitiesLocations_' + divisionIndex + '_' + groupIndex + '_' + entityIndex;
                    //try {
                    document.getElementById(elementId2).style.display = 'none';
                    //} catch (e) { }
                    // change the icon
                    //document.getElementById('spanDivisionTreeExpandCollapseButton_' + divisionIndex).innerHTML = '✚ '; // This is the division root node
                    //}
                }



            } else if (groupIndex || groupIndex > -1) {
                //this.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Style = 'display:none;'; // Collapse!
                //this._create();
                //debugger;
                if (instructions == 'legalentitiesnode') {
                    if (document.getElementById(elementId).innerHTML.indexOf('drawer-open.png') > -1) {
                        // Expand all of the divisions.
                        document.getElementById(elementId).innerHTML = '<img title="collapse" style="cursor:pointer;width:23px;height:23px;vertical-align:middle;" src="images/drawer-close.png" /> ';
                        var json = this.options.store;
                        for (var e = 0; e < json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items.length; e++) {
                            // expand
                            //var elementId2 = 'trDivisionGroupsGroupLegalEntities_' + divisionIndex + '_' + groupIndex + '_' + e;
                            //document.getElementById(elementId2).style.display = 'table-row';

                            var elementId3 = 'trDivisionGroupsGroupLegalEntitiesLocations_' + divisionIndex + '_' + groupIndex + '_' + e; // + '_' + l;
                            document.getElementById(elementId3).style.display = 'table-row';

                        }
                    } else {
                        // Collapse all of the divisions.
                        document.getElementById(elementId).innerHTML = '<img title="collapse" style="cursor:pointer;width:23px;height:23px;vertical-align:middle;" src="images/drawer-open.png" /> '; // This is the root global node.
                        var json = this.options.store;
                        for (var e = 0; e < json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items.length; e++) {
                            // expand
                            //var elementId2 = 'trDivisionGroupsGroupLegalEntities_' + divisionIndex + '_' + groupIndex + '_' + e;
                            //document.getElementById(elementId2).style.display = 'none';

                            var elementId3 = 'trDivisionGroupsGroupLegalEntitiesLocations_' + divisionIndex + '_' + groupIndex + '_' + e; // + '_' + l;
                            document.getElementById(elementId3).style.display = 'none';

                        }
                    }

                } else {
                    if (document.getElementById(elementId).innerHTML.indexOf('drawer-open.png') > -1) {
                        // Expand all of the divisions.
                        document.getElementById(elementId).innerHTML = '<img title="collapse" style="cursor:pointer;width:23px;height:23px;vertical-align:middle;" src="images/drawer-close.png" /> ';
                        //var json = this.options.store;
                        //for (var g = 0; g < json.Global.Divisions.Items[divisionIndex].Groups.Items.length; g++) {
                        // expand
                        var elementId2 = 'trDivisionGroupsGroup_' + divisionIndex + '_' + groupIndex;
                        try {
                            document.getElementById(elementId2).style.display = 'table-row';
                        } catch (e) { }
                        // change the icon
                        //document.getElementById('spanDivisionTreeExpandCollapseButton_' + divisionIndex).innerHTML = '⚊ '; // This is the division root node
                        //}
                    } else {
                        // Collapse all of the divisions.
                        document.getElementById(elementId).innerHTML = '<img title="collapse" style="cursor:pointer;width:23px;height:23px;vertical-align:middle;" src="images/drawer-open.png" /> '; // This is the root global node.
                        //var json = this.options.store;
                        //for (var g = 0; g < json.Global.Divisions.Items[divisionIndex].Groups.Items.length; g++) {
                        // collapse
                        var elementId2 = 'trDivisionGroupsGroup_' + divisionIndex + '_' + groupIndex;
                        try {
                            document.getElementById(elementId2).style.display = 'none';
                        } catch (e) { }
                        // change the icon
                        //document.getElementById('spanDivisionTreeExpandCollapseButton_' + divisionIndex).innerHTML = '✚ '; // This is the division root node
                        //}
                    }
                }






            } else if (divisionIndex || divisionIndex > -1) {
                if (instructions == 'groupsnode') {
                    //debugger;
                    if (document.getElementById(elementId).innerHTML.indexOf('drawer-open.png') > -1) {
                        // Expand all of the divisions.
                        document.getElementById(elementId).innerHTML = '<img title="collapse" style="cursor:pointer;width:23px;height:23px;vertical-align:middle;" src="images/drawer-close.png" /> ';
                        var json = this.options.store;
                        for (var g = 0; g < json.Global.Divisions.Items[divisionIndex].Groups.Items.length; g++) {
                            // expand
                            var elementId2 = 'trDivisionGroupsGroup_' + divisionIndex + '_' + g;
                            document.getElementById(elementId2).style.display = 'table-row';
                            // change the icon
                            //document.getElementById('spanDivisionTreeExpandCollapseButton_' + divisionIndex).innerHTML = '⚊ '; // This is the division root node
                        }
                    } else {
                        // Collapse all of the divisions.
                        document.getElementById(elementId).innerHTML = '<img title="collapse" style="cursor:pointer;width:23px;height:23px;vertical-align:middle;" src="images/drawer-open.png" /> '; // This is the root global node.
                        var json = this.options.store;
                        for (var g = 0; g < json.Global.Divisions.Items[divisionIndex].Groups.Items.length; g++) {
                            // collapse
                            var elementId2 = 'trDivisionGroupsGroup_' + divisionIndex + '_' + g;
                            document.getElementById(elementId2).style.display = 'none';
                            // change the icon
                            //document.getElementById('spanDivisionTreeExpandCollapseButton_' + divisionIndex).innerHTML = '✚ '; // This is the division root node
                        }
                    }









                } else if (divisionIndex == 'root') {
                    if (document.getElementById(elementId).innerHTML.indexOf('drawer-open.png') > -1) {
                        // Expand all of the divisions.
                        document.getElementById(elementId).innerHTML = '<img title="collapse" style="cursor:pointer;width:23px;height:23px;vertical-align:middle;" src="images/drawer-close.png" /> ';
                        var json = this.options.store;
                        for (var d = 0; d < json.Global.Divisions.Items.length; d++) {
                            // expand
                            var elementId = 'trDivisionGroups_' + d;
                            document.getElementById(elementId).style.display = 'table-row';
                            // change the icon
                            document.getElementById('spanDivisionTreeExpandCollapseButton_' + d).innerHTML = '<img title="collapse" style="cursor:pointer;width:23px;height:23px;vertical-align:middle;" src="images/drawer-close.png" /> '; // This is the division root node
                        }
                    } else {
                        // Collapse all of the divisions.
                        document.getElementById(elementId).innerHTML = '<img title="collapse" style="cursor:pointer;width:23px;height:23px;vertical-align:middle;" src="images/drawer-open.png" /> '; // This is the root global node.
                        var json = this.options.store;
                        for (var d = 0; d < json.Global.Divisions.Items.length; d++) {
                            // collapse
                            var elementId = 'trDivisionGroups_' + d;
                            document.getElementById(elementId).style.display = 'none';
                            // change the icon
                            document.getElementById('spanDivisionTreeExpandCollapseButton_' + d).innerHTML = '<img title="collapse" style="cursor:pointer;width:23px;height:23px;vertical-align:middle;" src="images/drawer-open.png" /> '; // This is the division root node
                        }
                    }
                } else {
                    //debugger;
                    if (document.getElementById(elementId).innerHTML.indexOf('drawer-open.png') > -1) {
                        // Expand all of the divisions.
                        document.getElementById(elementId).innerHTML = '<img title="collapse" style="cursor:pointer;width:23px;height:23px;vertical-align:middle;" src="images/drawer-close.png" /> ';
                        var json = this.options.store;
                        //for (var d = 0; d < json.Global.Divisions.Items.length; d++) {
                        // expand
                        var elementId = 'trDivisionGroups_' + divisionIndex;
                        document.getElementById(elementId).style.display = 'table-row';
                        // change the icon
                        document.getElementById('spanDivisionTreeExpandCollapseButton_' + divisionIndex).innerHTML = '<img title="collapse" style="cursor:pointer;width:23px;height:23px;vertical-align:middle;" src="images/drawer-close.png" /> '; // This is the division root node
                        //}
                    } else {
                        // Collapse all of the divisions.
                        document.getElementById(elementId).innerHTML = '<img title="collapse" style="cursor:pointer;width:23px;height:23px;vertical-align:middle;" src="images/drawer-open.png" /> '; // This is the root global node.
                        var json = this.options.store;
                        //for (var d = 0; d < json.Global.Divisions.Items.length; d++) {
                        // collapse
                        var elementId = 'trDivisionGroups_' + divisionIndex;
                        document.getElementById(elementId).style.display = 'none';
                        // change the icon
                        document.getElementById('spanDivisionTreeExpandCollapseButton_' + divisionIndex).innerHTML = '<img title="collapse" style="cursor:pointer;width:23px;height:23px;vertical-align:middle;" src="images/drawer-open.png" /> '; // This is the division root node
                        //}
                    }
                }
            } else {
                debugger;
                alert('Error: Unexpected parameter in collapseOrExpandTree().');
            }
        } catch (e) {
            console.log('Exception in collapseOrExpandTree(): ' + e.message + ', ' + e.stack);
        }
    },
    expandTree: function (divisionIndex, groupIndex, entityIndex) {
        try {
            console.log('In expandTree().');
            if (entityIndex || entityIndex > -1) {
                this.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Style = 'display:block;'; // Expand!
                //this._create();
            } else if (groupIndex || groupIndex > -1) {
                this.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Style = 'display:block;'; // Expand!
                //this._create();
            } else if (divisionIndex || divisionIndex > -1) {
                if (divisionIndex == 'root') {
                    this.options.store.Global.Divisions.Style = 'display:block;'; // Expand!
                    //this._create();
                } else {
                    this.options.store.Global.Divisions.Items[divisionIndex].Groups.Style = 'display:block;'; // Expand!
                    //this._create();
                }
            } else {
                debugger;
                alert('Error: Unexpected parameter in expandTree().');
            }
        } catch (e) {
            console.log('Exception in expandTree(): ' + e.message + ', ' + e.stack);
        }
    },
    manageRaciRoles: function (divisionIndex, groupIndex, entityIndex) {
        try {
            console.log('In manageRaciRoles().');
            //alert('In manageRaciRoles(). This functionality is incomplete. Coming soon!');

            //$('.bwOrganizationEditor').bwOrganizationEditor('displayCreateANewRoleDialog');

            var availableRoles = ['Chief Financial Officer', 'Product Manager', 'Marketing Generalist', 'Sales Representative', 'Customer Support Representative', 'Business Development Manager', 'Chief Information Officer', 'Assistant Vice President', 'Vice President', 'Chief Marketing Officer', 'Chief Technology Officer', 'President', 'Chief Operating Officer', 'Chief Financial Officer', 'Chief Executive Officer', 'Project Manager', 'Project Sponsor', 'Accountant', 'Financial Analyst'];

            var html = '';
            html += '<table>';
            for (var i = 0; i < availableRoles.length; i++) {
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
                html += '<td><input id="' + 'roleCheckbox_' + i + '" type="checkbox" /></td>';
                //}
                html += '<td class="roleId">' + availableRoles[i] + '</td>';
                html += '<td>&nbsp;</td>';
                //html += '<td class="projectTypeName">' + availableProjectTypes[i].bwFunctionalAreaTitle + '</td>';
                html += '<td class="roleName"></td>';
                html += '</tr>';
            }
            html += '</table>';


            document.getElementById('spanRoleMultiPickerDialogContent').innerHTML = html;


            //$("#divRoleMultiPickerDialog2").dialog({
            //    modal: true,
            //    resizable: false,
            //    closeOnEscape: false, // Hit the ESC key to hide! Yeah!
            //    width: '800',
            //    dialogClass: 'no-close', // No close button in the upper right corner.
            //    hide: false, // This means when hiding just disappear with no effects.
            //    open: function () {
            //        $('.ui-widget-overlay').bind('click', function () {
            //            $('#divRoleMultiPickerDialog').dialog('close');
            //        });
            //    },
            //    close: function () {
            //        $('#divRoleMultiPickerDialog').dialog('destroy');
            //    }
            //});
            //$('#divRoleMultiPickerDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();




            $("#divRoleMultiPickerDialog2").dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '500',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divRoleMultiPickerDialog2").dialog('close');
                    });
                },
                close: function () {
                    $('#divRoleMultiPickerDialog2').dialog('destroy');
                }
            });





        } catch (e) {
            console.log('Exception in manageRaciRoles(): ' + e.message + ', ' + e.stack);
        }
    },
    addADivision: function (elementId, divisionIndex, groupIndex, entityIndex) {
        try {
            console.log('In addADivision().');
            var thiz = this;
            //debugger; // WRONG WIDGET MAYBE 7-5-2020

            //debugger;
            //
            // ToDo: Add the click event to this Save button!
            //
            $('#divAddAnOrgItemDialog2').dialog({
                modal: true,
                resizable: false,
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                width: '500',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divAddAnOrgItemDialog2").dialog('close');
                    });

                    document.getElementById('spanAddAnOrgItemDialogTitle').innerHTML = 'Add a new Division ◍';
                    document.getElementById('divAddAnOrgItemDialogSubmitButton').innerHTML = 'Add the new Division ◍';

                    document.getElementById('txtAddAnOrgItemDialogName').value = '';
                    document.getElementById('txtAddANewPersonDialogAbbreviation').value = '';
                    document.getElementById('txtAddANewPersonDialogId').value = '';


                    $('#divAddAnOrgItemDialogSubmitButton').off('click').click(function (error) {
                        try {
                            //debugger;
                            console.log('In addADivision.divAddAnOrgItemDialogSubmitButton.click().');
                            var thisDialog = $(this).closest('.ui-dialog');
                            var name = $(thisDialog).find('#txtAddAnOrgItemDialogName').val().trim(); //document.getElementById('txtAddAnOrgItemDialogName').value.trim();
                            var abbreviation = $(thisDialog).find('#txtAddANewPersonDialogAbbreviation').val().trim(); //document.getElementById('txtAddANewPersonDialogAbbreviation').value.trim();
                            if (name.length > 4 && abbreviation.length > 1) {
                                // Save the new org entry.
                                var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                                    return v.toString(16);
                                });
                                //var active = document.getElementById('checkboxAddANewPersonDialogActive').checked;

                                var division = {
                                    Name: name,
                                    Abbreviation: abbreviation,
                                    Id: guid,
                                    Style: 'display:block;',
                                    Groups: {
                                        Style: 'display:block;',
                                        Items: []
                                    }
                                };
                                thiz.options.store.Global.Divisions.Items.push(division);
                                //$('#divAddAnOrgItemDialog2').dialog('close');
                                $('#divAddAnOrgItemDialog2').dialog('close');
                                thiz.renderOrgRolesEditor2();
                            } else {
                                alert('Please enter a name (5 characters or more) and an abbreviation (2 characters or more).');
                            }
                        } catch (e) {
                            console.log('Exception in divAddAnOrgItemDialogSubmitButton.click(): ' + e.message + ', ' + e.stack);
                        }
                    });

                },
                close: function () {
                    //debugger;
                    //    $('#divAddAnOrgItemDialog').dialog('destroy');

                    //$('#divAddAnOrgItemDialogSubmitButton').unbind('click');


                }
            });
            //$("#divAddAnOrgItemDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
            //}

        } catch (e) {
            console.log('Exception in addADivision(): ' + e.message + ', ' + e.stack);
        }
    },
    addAGroup: function (elementId, divisionIndex, groupIndex, entityIndex) {
        try {
            console.log('In addAGroup(). elementId: ' + elementId);
            var thiz = this;
            document.getElementById('spanAddAnOrgItemDialogTitle').innerHTML = 'Add a new Group ✣';
            document.getElementById('divAddAnOrgItemDialogSubmitButton').innerHTML = 'Add the new Group ✣';

            document.getElementById('txtAddAnOrgItemDialogName').value = '';
            document.getElementById('txtAddANewPersonDialogAbbreviation').value = '';
            document.getElementById('txtAddANewPersonDialogId').value = '';

            //
            // ToDo: Add the click event to this Save button!
            //
            $("#divAddAnOrgItemDialog").dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '500',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divAddAnOrgItemDialog").dialog('close');
                    });
                },
                close: function () {
                    $('#divAddAnOrgItemDialog').dialog('destroy');
                }
            });
            //$("#divAddAnOrgItemDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            $('#divAddAnOrgItemDialogSubmitButton').off('click').click(function (error) {
                try {
                    console.log('In addAGroup.divAddAnOrgItemDialogSubmitButton.click().');
                    var name = document.getElementById('txtAddAnOrgItemDialogName').value.trim();
                    var abbreviation = document.getElementById('txtAddANewPersonDialogAbbreviation').value.trim();
                    if (name.length > 4 && abbreviation.length > 1) {
                        // Save the new org entry.
                        var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                            return v.toString(16);
                        });
                        //var active = document.getElementById('checkboxAddANewPersonDialogActive').checked;

                        var group = {
                            Name: name,
                            Abbreviation: abbreviation,
                            Id: guid,
                            Style: 'display:block;',
                            LegalEntities: {
                                Style: 'display:block;',
                                Items: []
                            }
                        };
                        debugger;
                        thiz.options.store.Global.Divisions.Items[divisionIndex].Groups.Items.push(group);
                        $("#divAddAnOrgItemDialog").dialog('close');
                        thiz.renderOrgRolesEditor();
                    } else {
                        alert('Please enter a name (5 characters or more) and an abbreviation (2 characters or more).');
                    }
                } catch (e) {
                    console.log('Exception in divAddAnOrgItemDialogSubmitButton.click(): ' + e.message + ', ' + e.stack);
                }
            });
        } catch (e) {
            console.log('Exception in addAGroup(): ' + e.message + ', ' + e.stack);
        }
    },
    addALegalEntity: function (elementId, divisionIndex, groupIndex, entityIndex) {
        try {
            console.log('In addALegalEntity(). elementId: ' + elementId);
            var thiz = this;
            document.getElementById('spanAddAnOrgItemDialogTitle').innerHTML = 'Add a new Legal Entity ⚖';
            document.getElementById('divAddAnOrgItemDialogSubmitButton').innerHTML = 'Add the new Legal Entity ⚖';

            document.getElementById('txtAddAnOrgItemDialogName').value = '';
            document.getElementById('txtAddANewPersonDialogAbbreviation').value = '';
            document.getElementById('txtAddANewPersonDialogId').value = '';

            //
            // ToDo: Add the click event to this Save button!
            //
            $("#divAddAnOrgItemDialog").dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '500',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divAddAnOrgItemDialog").dialog('close');
                    });
                },
                close: function () {
                    $('#divAddAnOrgItemDialog').dialog('destroy');
                }
            });
            //$("#divAddAnOrgItemDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            $('#divAddAnOrgItemDialogSubmitButton').off('click').click(function (error) {
                try {
                    console.log('In addALegalEntity.divAddAnOrgItemDialogSubmitButton.click().');
                    var name = document.getElementById('txtAddAnOrgItemDialogName').value.trim();
                    var abbreviation = document.getElementById('txtAddANewPersonDialogAbbreviation').value.trim();
                    if (name.length > 4 && abbreviation.length > 1) {
                        // Save the new org entry.
                        var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                            return v.toString(16);
                        });
                        //var active = document.getElementById('checkboxAddANewPersonDialogActive').checked;

                        var legalentity = {
                            Name: name,
                            Abbreviation: abbreviation,
                            Id: guid,
                            Style: 'display:block;',
                            Locations: {
                                Style: 'display:block;',
                                Items: []
                            }
                        };
                        thiz.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items.push(legalentity);
                        $("#divAddAnOrgItemDialog").dialog('close');
                        thiz.renderOrgRolesEditor();
                    } else {
                        alert('Please enter a name (5 characters or more) and an abbreviation (2 characters or more).');
                    }
                } catch (e) {
                    console.log('Exception in divAddAnOrgItemDialogSubmitButton.click(): ' + e.message + ', ' + e.stack);
                }
            });
        } catch (e) {
            console.log('Exception in addALegalEntity(): ' + e.message + ', ' + e.stack);
        }
    },
    addALocation: function (elementId, divisionIndex, groupIndex, entityIndex) {
        try {
            console.log('In addALocation(). elementId: ' + elementId);
            var thiz = this;
            document.getElementById('spanAddAnOrgItemDialogTitle').innerHTML = 'Add a new Location 🏠';
            document.getElementById('divAddAnOrgItemDialogSubmitButton').innerHTML = 'Add the new Location 🏠';

            document.getElementById('txtAddAnOrgItemDialogName').value = '';
            document.getElementById('txtAddANewPersonDialogAbbreviation').value = '';
            document.getElementById('txtAddANewPersonDialogId').value = '';

            //
            // ToDo: Add the click event to this Save button!
            //
            $("#divAddAnOrgItemDialog").dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '500',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divAddAnOrgItemDialog").dialog('close');
                    });
                },
                close: function () {
                    $('#divAddAnOrgItemDialog').dialog('destroy');
                }
            });
            //$("#divAddAnOrgItemDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            $('#divAddAnOrgItemDialogSubmitButton').off('click').click(function (error) {
                try {
                    console.log('In addALocation.divAddAnOrgItemDialogSubmitButton.click().');
                    var name = document.getElementById('txtAddAnOrgItemDialogName').value.trim();
                    var abbreviation = document.getElementById('txtAddANewPersonDialogAbbreviation').value.trim();
                    if (name.length > 4 && abbreviation.length > 1) {
                        // Save the new org entry.
                        var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                            return v.toString(16);
                        });
                        //var active = document.getElementById('checkboxAddANewPersonDialogActive').checked;

                        var location = {
                            Name: name,
                            Abbreviation: abbreviation,
                            Id: guid,
                            Style: 'display:block;'
                        };
                        thiz.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items.push(location);
                        $("#divAddAnOrgItemDialog").dialog('close');
                        thiz.renderOrgRolesEditor();
                    } else {
                        alert('Please enter a name (5 characters or more) and an abbreviation (2 characters or more).');
                    }
                } catch (e) {
                    console.log('Exception in divAddAnOrgItemDialogSubmitButton.click(): ' + e.message + ', ' + e.stack);
                }
            });
        } catch (e) {
            console.log('Exception in addALocation(): ' + e.message + ', ' + e.stack);
        }
    },
    editRootOrg: function () {
        try {
            console.log('In editRootOrg().');
            alert('In editRootOrg(). This functionality is incomplete. Coming soon!');



            // TODD: TODO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!





        } catch (e) {
            console.log('Exception in editRootOrg(): ' + e.message + ', ' + e.stack);
        }
    },
    editDivision: function (divisionIndex, groupIndex, entityIndex) {
        try {
            console.log('In editDivision().');
            var thiz = this;
            document.getElementById('spanAddAnOrgItemDialogTitle').innerHTML = 'Edit Division';
            document.getElementById('divAddAnOrgItemDialogSubmitButton').innerHTML = 'Save';
            //document.getElementById('divDeleteAnOrgItemDialogSubmitButton').innerHTML = 'Delete'; // Delete this Org.

            debugger;
            if (divisionIndex == 'root') {
                document.getElementById('txtAddAnOrgItemDialogName').value = this.options.store.Global.Name;
                document.getElementById('txtAddANewPersonDialogAbbreviation').value = this.options.store.Global.Abbreviation;
                document.getElementById('txtAddANewPersonDialogId').value = this.options.store.Global.Id;
            } else {
                document.getElementById('txtAddAnOrgItemDialogName').value = this.options.store.Global.Divisions.Items[divisionIndex].Name;
                document.getElementById('txtAddANewPersonDialogAbbreviation').value = this.options.store.Global.Divisions.Items[divisionIndex].Abbreviation;
                document.getElementById('txtAddANewPersonDialogId').value = this.options.store.Global.Divisions.Items[divisionIndex].Id;
            }
            //
            // ToDo: Add the click event to this button!
            //
            $("#divAddAnOrgItemDialog").dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '500',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divAddAnOrgItemDialog").dialog('close');
                    });
                },
                close: function () {
                    $(this).empty().dialog('destroy'); // 7-5-2020 THIS IS THE PREFFERED SYNTAX FOR THIS FROM NOW ON!!!!!!!!!!!!!!!!!!!!!!!!!!!! REPLACE EVERYWHERE AND TEST!!!!!!!!!!!!!!!!!!!!!!!!!!
                }
            });
            //$("#divAddAnOrgItemDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            $('#divAddAnOrgItemDialogSubmitButton').off('click').click(function (error) {
                try {
                    console.log('In editDivision.divAddAnOrgItemDialogSubmitButton.click().');
                    var name = document.getElementById('txtAddAnOrgItemDialogName').value.trim();
                    var abbreviation = document.getElementById('txtAddANewPersonDialogAbbreviation').value.trim();
                    if (name.length > 4 && abbreviation.length > 1) {
                        // Save the new org entry.
                        var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                            return v.toString(16);
                        });
                        //var active = document.getElementById('checkboxAddANewPersonDialogActive').checked;

                        thiz.options.store.Global.Divisions.Items[divisionIndex].Name = name;
                        thiz.options.store.Global.Divisions.Items[divisionIndex].Abbreviation = abbreviation;
                        $("#divAddAnOrgItemDialog").dialog('close');
                        thiz.renderOrgRolesEditor();
                    } else {
                        alert('Please enter a name (5 characters or more) and an abbreviation (2 characters or more).');
                    }
                } catch (e) {
                    console.log('Exception in divAddAnOrgItemDialogSubmitButton.click(): ' + e.message + ', ' + e.stack);
                }
            });

            $('#divDeleteAnOrgItemDialogSubmitButton').off('click').click(function (error) {
                try {
                    console.log('In editDivision.divDeleteAnOrgItemDialogSubmitButton.click().');

                    //alert('This functionality is incomplete. Coming soon! delx123');
                    var json = thiz.options.store;
                    if ((divisionIndex && divisionIndex != 'undefined') || divisionIndex > -1) {
                        if (divisionIndex == 'root') {
                            // Can't delete this node!!

                            //json.Global.Roles;
                        } else {
                            json.Global.Divisions.Items.splice(divisionIndex, 1); //].Roles;
                        }
                    } else {
                        alert('Error: Unexpected parameter in editDivision.divDeleteAnOrgItemDialogSubmitButton.click():1:.');
                    }

                    $("#divAddAnOrgItemDialog").dialog('close');
                    //$('.bwCircleDialog').bwCircleDialog('hideAndDestroyCircleDialog'); // This makes sure the circle dialog doesn't pop up again by accident ona screen resize.
                    thiz.renderOrgRolesEditor();

                } catch (e) {
                    console.log('Exception in editDivision.divDeleteAnOrgItemDialogSubmitButton.click(): ' + e.message + ', ' + e.stack);
                }
            });

        } catch (e) {
            console.log('Exception in editDivision(): ' + e.message + ', ' + e.stack);
        }
    },
    editGroup: function (divisionIndex, groupIndex, entityIndex) {
        try {
            console.log('In editGroup().');
            var thiz = this;

            debugger;
            document.getElementById('spanAddAnOrgItemDialogTitle').innerHTML = 'Edit Group';
            document.getElementById('divAddAnOrgItemDialogSubmitButton').innerHTML = 'Save';
            //document.getElementById('divDeleteAnOrgItemDialogSubmitButton').innerHTML = 'Delete'; // Delete this Org.

            document.getElementById('txtAddAnOrgItemDialogName').value = this.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Name;
            document.getElementById('txtAddANewPersonDialogAbbreviation').value = this.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Abbreviation;
            document.getElementById('txtAddANewPersonDialogId').value = this.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Id;

            //
            // ToDo: Add the click event to this button!
            //
            $("#divAddAnOrgItemDialog").dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '500',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divAddAnOrgItemDialog").dialog('close');
                    });
                },
                close: function () {
                    $(this).empty().dialog('destroy'); // 7-5-2020 THIS IS THE PREFFERED SYNTAX FOR THIS FROM NOW ON!!!!!!!!!!!!!!!!!!!!!!!!!!!! REPLACE EVERYWHERE AND TEST!!!!!!!!!!!!!!!!!!!!!!!!!!
                }
            });
            //$("#divAddAnOrgItemDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            $('#divAddAnOrgItemDialogSubmitButton').off('click').click(function (error) {
                try {
                    console.log('In editGroup.divAddAnOrgItemDialogSubmitButton.click().');
                    var name = document.getElementById('txtAddAnOrgItemDialogName').value.trim();
                    var abbreviation = document.getElementById('txtAddANewPersonDialogAbbreviation').value.trim();
                    if (name.length > 4 && abbreviation.length > 1) {
                        // Save the new org entry.
                        var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                            return v.toString(16);
                        });
                        //var active = document.getElementById('checkboxAddANewPersonDialogActive').checked;

                        thiz.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Name = name;
                        thiz.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Abbreviation = abbreviation;
                        $("#divAddAnOrgItemDialog").dialog('close');
                        thiz.renderOrgRolesEditor();
                    } else {
                        alert('Please enter a name (5 characters or more) and an abbreviation (2 characters or more).');
                    }
                } catch (e) {
                    console.log('Exception in divAddAnOrgItemDialogSubmitButton.click(): ' + e.message + ', ' + e.stack);
                }
            });

            $('#divDeleteAnOrgItemDialogSubmitButton').off('click').click(function (error) {
                try {
                    console.log('In editGroup.divDeleteAnOrgItemDialogSubmitButton.click().');

                    //alert('This functionality is incomplete. Coming soon! delx123');
                    var json = thiz.options.store;
                    if ((groupIndex && groupIndex != 'undefined') || groupIndex > -1) {
                        json.Global.Divisions.Items[divisionIndex].Groups.Items.splice(groupIndex, 1); //].Roles;
                    } else {
                        alert('Error: Unexpected parameter in editGroup.divDeleteAnOrgItemDialogSubmitButton.click():1:.');
                    }

                    $("#divAddAnOrgItemDialog").dialog('close');
                    //$('.bwCircleDialog').bwCircleDialog('hideAndDestroyCircleDialog'); // This makes sure the circle dialog doesn't pop up again by accident ona screen resize.
                    thiz.renderOrgRolesEditor();

                } catch (e) {
                    console.log('Exception in editGroup.divDeleteAnOrgItemDialogSubmitButton.click(): ' + e.message + ', ' + e.stack);
                }
            });

        } catch (e) {
            console.log('Exception in editGroup(): ' + e.message + ', ' + e.stack);
        }
    },
    editLegalEntity: function (divisionIndex, groupIndex, entityIndex) {
        try {
            console.log('In editLegalEntity().');
            var thiz = this;
            document.getElementById('spanAddAnOrgItemDialogTitle').innerHTML = 'Edit Legal Entity';
            document.getElementById('divAddAnOrgItemDialogSubmitButton').innerHTML = 'Save';
            //document.getElementById('divDeleteAnOrgItemDialogSubmitButton').innerHTML = 'Delete'; // Delete this Org.

            document.getElementById('txtAddAnOrgItemDialogName').value = this.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Name;
            document.getElementById('txtAddANewPersonDialogAbbreviation').value = this.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Abbreviation;
            document.getElementById('txtAddANewPersonDialogId').value = this.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Id;

            //
            // ToDo: Add the click event to this button!
            //
            $("#divAddAnOrgItemDialog").dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '500',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divAddAnOrgItemDialog").dialog('close');
                    });
                },
                close: function () {
                    $(this).empty().dialog('destroy'); // 7-5-2020 THIS IS THE PREFFERED SYNTAX FOR THIS FROM NOW ON!!!!!!!!!!!!!!!!!!!!!!!!!!!! REPLACE EVERYWHERE AND TEST!!!!!!!!!!!!!!!!!!!!!!!!!!
                }
            });
            //$("#divAddAnOrgItemDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            $('#divAddAnOrgItemDialogSubmitButton').off('click').click(function (error) {
                try {
                    console.log('In editLegalEntity.divAddAnOrgItemDialogSubmitButton.click().');
                    var name = document.getElementById('txtAddAnOrgItemDialogName').value.trim();
                    var abbreviation = document.getElementById('txtAddANewPersonDialogAbbreviation').value.trim();
                    if (name.length > 4 && abbreviation.length > 1) {
                        // Save the new org entry.
                        var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                            return v.toString(16);
                        });
                        //var active = document.getElementById('checkboxAddANewPersonDialogActive').checked;

                        thiz.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Name = name;
                        thiz.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Abbreviation = abbreviation;
                        $("#divAddAnOrgItemDialog").dialog('close');
                        thiz.renderOrgRolesEditor();
                    } else {
                        alert('Please enter a name (5 characters or more) and an abbreviation (2 characters or more).');
                    }
                } catch (e) {
                    console.log('Exception in divAddAnOrgItemDialogSubmitButton.click(): ' + e.message + ', ' + e.stack);
                }
            });

            $('#divDeleteAnOrgItemDialogSubmitButton').off('click').click(function (error) {
                try {
                    console.log('In editLegalEntity.divDeleteAnOrgItemDialogSubmitButton.click().');

                    //alert('This functionality is incomplete. Coming soon! delx123');
                    var json = thiz.options.store;
                    if ((entityIndex && entityIndex != 'undefined') || entityIndex > -1) {
                        json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items.splice(entityIndex, 1); //.Roles;
                    } else {
                        alert('Error: Unexpected parameter in editLegalEntity.divDeleteAnOrgItemDialogSubmitButton.click():1:.');
                    }

                    $("#divAddAnOrgItemDialog").dialog('close');
                    //$('.bwCircleDialog').bwCircleDialog('hideAndDestroyCircleDialog'); // This makes sure the circle dialog doesn't pop up again by accident ona screen resize.
                    thiz.renderOrgRolesEditor();

                } catch (e) {
                    console.log('Exception in editLegalEntity.divDeleteAnOrgItemDialogSubmitButton.click(): ' + e.message + ', ' + e.stack);
                }
            });

        } catch (e) {
            console.log('Exception in editLegalEntity(): ' + e.message + ', ' + e.stack);
        }
    },
    editLocation: function (divisionIndex, groupIndex, entityIndex, locationIndex1) {
        try {
            console.log('In editLocation().');
            var thiz = this;
            document.getElementById('spanAddAnOrgItemDialogTitle').innerHTML = 'Edit Location';
            document.getElementById('divAddAnOrgItemDialogSubmitButton').innerHTML = 'Save';
            //document.getElementById('divDeleteAnOrgItemDialogSubmitButton').innerHTML = 'Delete'; // Delete this Org.
            //debugger;
            document.getElementById('txtAddAnOrgItemDialogName').value = this.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex1].Name;
            document.getElementById('txtAddANewPersonDialogAbbreviation').value = this.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex1].Abbreviation;
            document.getElementById('txtAddANewPersonDialogId').value = this.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex1].Id;

            //
            // ToDo: Add the click event to this button!
            //
            $("#divAddAnOrgItemDialog").dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '500',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divAddAnOrgItemDialog").dialog('close');
                    });
                },
                close: function () {
                    $(this).empty().dialog('destroy'); // 7-5-2020 THIS IS THE PREFFERED SYNTAX FOR THIS FROM NOW ON!!!!!!!!!!!!!!!!!!!!!!!!!!!! REPLACE EVERYWHERE AND TEST!!!!!!!!!!!!!!!!!!!!!!!!!!
                }
            });
            //$("#divAddAnOrgItemDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            $('#divAddAnOrgItemDialogSubmitButton').off('click').click(function (error) {
                try {
                    console.log('In editLocation.divAddAnOrgItemDialogSubmitButton.click().');
                    var name = document.getElementById('txtAddAnOrgItemDialogName').value.trim();
                    var abbreviation = document.getElementById('txtAddANewPersonDialogAbbreviation').value.trim();
                    if (name.length > 4 && abbreviation.length > 1) {
                        // Save the new org entry.
                        var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                            return v.toString(16);
                        });
                        //var active = document.getElementById('checkboxAddANewPersonDialogActive').checked;

                        thiz.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex1].Name = name;
                        thiz.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex1].Abbreviation = abbreviation;
                        $("#divAddAnOrgItemDialog").dialog('close');
                        thiz.renderOrgRolesEditor();
                    } else {
                        alert('Please enter a name (5 characters or more) and an abbreviation (2 characters or more).');
                    }
                } catch (e) {
                    console.log('Exception in divAddAnOrgItemDialogSubmitButton.click(): ' + e.message + ', ' + e.stack);
                }
            });

            $('#divDeleteAnOrgItemDialogSubmitButton').off('click').click(function (error) {
                try {
                    console.log('In editLocation.divDeleteAnOrgItemDialogSubmitButton.click().');

                    //alert('This functionality is incomplete. Coming soon! delx123');
                    var json = thiz.options.store;
                    if ((locationIndex1 && locationIndex1 != 'undefined') || locationIndex1 > -1) {
                        json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items.splice(locationIndex1, 1); //].Roles;
                    } else {
                        alert('Error: Unexpected parameter in editLocation.divDeleteAnOrgItemDialogSubmitButton.click():1:.');
                    }

                    $("#divAddAnOrgItemDialog").dialog('close');
                    //$('.bwCircleDialog').bwCircleDialog('hideAndDestroyCircleDialog'); // This makes sure the circle dialog doesn't pop up again by accident ona screen resize.
                    thiz.renderOrgRolesEditor();

                } catch (e) {
                    console.log('Exception in editLocation.divDeleteAnOrgItemDialogSubmitButton.click(): ' + e.message + ', ' + e.stack);
                }
            });

        } catch (e) {
            console.log('Exception in editLocation(): ' + e.message + ', ' + e.stack);
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
                    $('#divCreateANewRoleDialog').dialog('destroy');
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
            var thiz = this;
            //thiz.showProgress('Loading...');
            $('.activeEditRow').remove(); // This gets rid of the row editor... we should only display one at a time.
            $('.steprow-hidden').removeClass('steprow-hidden'); // Display the previous row again (if there is one).
            // Get the values from the hidden row.
            var roleid = $('#' + elementId).find('.roleid').attr('bwOldValue');
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





            html += '<td class="selectroleorperson-editcell steprowcell">';
            //html += ' <img style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayPeoplePickerDialog\', \'' + 'txtApprover2FriendlyName' + '\', \'' + 'txtApprover2Id' + '\', \'' + 'txtApprover2Email' + '\');" src="images/addressbook-icon18x18.png">';
            //html += '&nbsp;' + rolename;
            html += '</td>';







            // Render the "RoleCategory" drop-down.
            html += '<td class="steprowcell">';
            html += '<select style="padding:5px 5px 5px 5px;" id="selectRoleCategory" class="rolecategory-dropdown" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'RoleCategoryDropDown_Onchange\', \'' + elementId + '\');">';
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
            html += '      <input type="button" style="width:100%;" value="Save" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveAssignmentRow\', \'' + elementId + '\');" />';
            html += '    </td>';
            html += '  </tr>';
            html += '  <tr>';
            html += '    <td>';
            html += '      <input type="button" style="width:100%;" value="Delete" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'deleteRoleCategory\', \'' + elementId + '\');" />';
            html += '    </td>';
            html += '  </tr>';
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

            //var elementId = element.id;
            thiz.disableScrolling(); // This keeps the screen from jumping around.

            $('#' + elementId).closest('tr').after(html); // Render the whole thing




            thiz.renderSelectRoleOrPersonSection(elementId);




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
            // END: Render and Populate the actions section

            //thiz.renderTimeoutSection(elementId);
            //debugger;
            thiz.renderConditionsSection(elementId, cond);

            $('#' + elementId).addClass('steprow-hidden'); // Hide the row while we display it in editable-mode. This allows us to display it again when done editng, and also gives us a place to look up the old values.
            thiz.enableScrolling(); // This keeps the screen from jumping around.
            //thiz.hideProgress();



        } catch (e) {
            console.log('Exception in renderEditSteprow(): ' + e.message + ', ' + e.stack);
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
    //createANewRole: function () {
    //    try {
    //        console.log('In createANewRole().');
    //        // Make sure the RoleId is 2 or more charcaters. Make sure the RoleName is longer than 5 characters.
    //        var thiz = this;
    //        var roleId = document.getElementById('txtCreateANewRoleDialog_RoleId').value;
    //        var roleName = document.getElementById('txtCreateANewRoleDialog_RoleName').value;
    //        if (roleId && roleName) {
    //            if (roleId.length > 1 && roleName.length > 4) {
    //                // Ajax call to save the new role.
    //                var json = {
    //                    RoleId: roleId,
    //                    RoleName: roleName,
    //                    RoleBits: 17,
    //                    IsWorkflowRole: true
    //                };
    //                $.ajax({
    //                    url: thiz.options.operationUriPrefix + "odata/Roles",
    //                    dataType: "json",
    //                    contentType: "application/json",
    //                    type: "Post",
    //                    data: JSON.stringify(json)
    //                }).done(function (result) {
    //                    try {
    //                        console.log('In raci.html.createANewRole().xx.update: Successfully updated DB.');
    //                        $("#divMessageDialog").dialog({
    //                            modal: true,
    //                            resizable: false,
    //                            //closeText: "Cancel",
    //                            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
    //                            //title: 'Project Type picker',
    //                            width: '800',
    //                            dialogClass: 'no-close', // No close button in the upper right corner.
    //                            hide: false, // This means when hiding just disappear with no effects.
    //                            open: function () {
    //                                $("#divCreateANewRoleDialog").dialog('close');
    //                                $('.ui-widget-overlay').bind('click', function () {
    //                                    $('#divMessageDialog').dialog('close');
    //                                });
    //                                document.getElementById('spanMessageDialogTitle').innerHTML = 'Role CREATED';
    //                                document.getElementById('spanMessageDialogContentTop').innerHTML = 'This role has been created. Your screen will refresh, and the new role will be immediately available.';
    //                                document.getElementById('spanMessageDialogContentBottom').innerHTML = 'This role has no users assigned to it. You must do this before any new CARs are processed by this role.';
    //                            },
    //                            close: function () {
    //                                location.reload(); // When the user closes this dialog, we regenerate the screen to reflect the newly created and activated workflow.
    //                            }
    //                        });
    //                        $('#divMessageDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
    //                    } catch (e) {
    //                        console.log('Exception in raci.html.createANewRole().xx.update: ' + e.message + ', ' + e.stack);
    //                    }
    //                }).fail(function (data) {
    //                    //thiz.hideProgress();
    //                    var msg;
    //                    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
    //                        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
    //                    } else {
    //                        msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
    //                    }
    //                    alert('Fail in raci.html.createANewRole().xx.update: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
    //                    console.log('Fail in raci.html.createANewRole().xx.update: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
    //                    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
    //                    //var error = JSON.parse(data.responseText)["odata.error"];
    //                    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
    //                });
    //            } else {
    //                alert('ERROR: Cannot save these values. RoleId must be 2 or more characters, and RoleName must be 5 or more charcters.');
    //            }
    //        } else {
    //            alert('ERROR: Cannot save these values. RoleId must be 2 or more characters, and RoleName must be 5 or more charcters.');
    //        }
    //    } catch (e) {
    //        console.log('Exception in createANewRole(): ' + e.message + ', ' + e.stack);
    //    }
    //},
    addARaciStep: function () {
        try {
            console.log('InaddARaciStep().');
            //var newStepCount = 0;
            //for (var i = 0; i < this.options.store.RaciSteps.length; i++) {
            //    if (this.options.store.RaciSteps[i].StepName == ('NewStep' + newStepCount)) {
            //        newStepCount++;
            //    }
            //}
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
            this.options.store.RaciSteps.push(step);

            //alert('In addARaciStep(). this.options.store: ' + JSON.stringify(this.options.store));

            this._create();
        } catch (e) {
            console.log('Exception in addARaciStep(): ' + e.message + ', ' + e.stack);
        }
    },
    addNewRow: function (elementId) {
        try {
            console.log('In addNewRow(). elementId: ' + elementId);
            //this.disableButton('buttonAddNewAssignmentRow');
            var thiz = this;
            var x = elementId.split('_')[0];
            var stepIndex = elementId.split('_')[1]; // eg: 3
            var roleIndex = elementId.split('_')[2]; // eg: 8
            this.cancelStepRowEditing(elementId); // This cancels the diting row from a previous edit. There can only be one at a time.
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
                    html += '<select style="padding:5px 5px 5px 5px;" id="selectRoleCategory" class="rolecategory-dropdown" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'RoleCategoryDropDown_Onchange\', \'' + thiz.id + '\');">';
                    var stepName = thiz.options.store.Workflow.Steps.Step[stepIndex]["@Name"];
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

                    html += '  <table style="width:100%;">';
                    html += '  <tr>';
                    html += '    <td>';
                    html += '      <input type="button" style="width:100%;" value="Save" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveAssignmentRow\', \'' + elementId + '\');" />';
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


                    thiz.renderSelectRoleOrPersonSection(elementId);


                    thiz.renderActionsSection(elementId); // render the actions section
                    //thiz.renderTimeoutSection(elementId); // render the timeout section
                    thiz.renderConditionsSection(elementId); // render the condition section
                } catch (e) {
                    //lpSpinner.Hide();
                    //$('.buttonAddNewAssignmentRow').attr('disabled', false); // Disables these buttons while there is the editor row displaying.
                    console.log('Exception in raci.html.addNewRow().Get[odata/Roles].done: ' + e.message + ', ' + e.stack);
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
                alert('Error in raci.html.addNewRow().Get[odata/Roles].fail: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                console.log('Error in raci.html.addNewRow().Get[odata/Roles].fail:' + JSON.stringify(data));
                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                //var error = JSON.parse(data.responseText)["odata.error"];
                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            });
            //}
        } catch (e) {
            //$('.buttonAddNewAssignmentRow').attr('disabled', false); // Disables these buttons while there is the editor row displaying.
            console.log('Exception in addNewRow(): ' + e.message + ', ' + e.stack);
        }
    },
    deleteStep: function () {
        try {
            console.log('In deleteStep().');
            alert('In deleteStep: This functionality is incomplete.');
        } catch (e) {
            console.log('Exception in deleteStep(): ' + e.message + ', ' + e.stack);
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
                    this.options.store.Workflow.Steps.Step[stepIndex].Inform.splice(roleIndex, 1); // delete leaves a null, so we have to use splice.
                } else if (sourceRoleCategory == 'assign') {
                    this.options.store.Workflow.Steps.Step[stepIndex].Assign.splice(roleIndex, 1); // delete leaves a null, so we have to use splice.
                } else {
                    alert('ERROR: Invalid sourceRoleCategory in deleteRoleCategory().'); // We should never get here.
                }
            } else {
                // We should never get here!!!
                alert('ERROR: Failed to locate the step or role in the underlying json in deleteRoleCategory().');
            }
            this._create();
            //} else {
            //    // do nothing.
            //}
        } catch (e) {
            console.log('Exception in deleteRoleCategory(): ' + e.message + ', ' + e.stack);
        }
    },
    activateOrgRolesConfiguration: function () {
        try {
            debugger;
            var thiz = this;

            //var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            //var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            var orgRolesToActivate_Id;
            $('#spanOrgRolesDropDownList').find('option:selected').each(function (index, element) {
                orgRolesToActivate_Id = element.value;
            });
            console.log('In activateOrgRolesConfiguration(). workflowToActivate_Id: ' + orgRolesToActivate_Id);
            if (confirm("Are you certain you wish to activate this orgRoles?")) {
                this.showProgress('Activating your Selected Org Roles...');
                // First we have to deactivate the existing active workflow. Get the Id first, then mark as inactive.
                $.ajax({
                    url: thiz.options.operationUriPrefix + "odata/OrgRolesConfiguration/" + workflowAppId, //?$filter=Active eq true",
                    dataType: "json",
                    contentType: "application/json",
                    type: "Get",
                    timeout: thiz.options.ajaxTimeout
                }).done(function (result) {
                    try {
                        var workflow = result.value;
                        if (workflow.length != 1) {
                            alert('ERROR: An incorrect number of org roles are marked as active! This process cannot continue. There can only be 1 active orgRoles.');
                        } else {
                            var orgRolesToDeactivate_Id = workflow[0].Id;
                            var json = {
                                Active: false
                            };
                            $.ajax({
                                url: thiz.options.operationUriPrefix + "odata/OrgRolesConfiguration('" + orgRolesToDeactivate_Id + "')",
                                dataType: "json",
                                contentType: "application/json",
                                type: "Patch",
                                data: JSON.stringify(json)
                            }).done(function (result) {
                                try {
                                    console.log('In bwOrganizationEditor.js.activateOrgRolesConfiguration.update: Successfully updated DB using (' + JSON.stringify(json) + ').');
                                    // Now set this one to Active.
                                    var json = {
                                        Active: true
                                    };
                                    $.ajax({
                                        url: thiz.options.operationUriPrefix + "odata/OrgRolesConfiguration('" + orgRolesToActivate_Id + "')",
                                        dataType: "json",
                                        contentType: "application/json",
                                        type: "Patch",
                                        data: JSON.stringify(json)
                                    }).done(function (result) {
                                        try {
                                            console.log('In raci.html.activateRaciConfiguration().xx.update: Successfully updated DB using (' + JSON.stringify(json) + ').');
                                            alert('In raci.html.activateRaciConfiguration().xx.update: Successfully updated DB using (' + JSON.stringify(json) + ').');
                                            // Display a dialog with an "Undo" button!!!!
                                            //alert('Successfully updated the database. THIS WORKFLOW CHANGE WILL TAKE PLACE IMMEDIATELY!');
                                            debugger; // xcx2
                                            if ($('#bwOrganizationEditor_divUndoOrgRolesActivationDialog').is(':visible') != true) { // FIX!!!!!!!!!!!!!!!!! DOING THIS JUST TO GET THINGS WORKING. This gets called too many times here...



                                                alert('xcx11223-1');

                                                $("#bwOrganizationEditor_divUndoOrgRolesActivationDialog").dialog({
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
                                                                $('#bwOrganizationEditor_divUndoOrgRolesActivationDialog').dialog('close');
                                                            });
                                                        } catch (e) {
                                                            console.log('Exception in activateOrgRolesConfiguration().bwOrganizationEditor_divUndoOrgRolesActivationDialog.open(): ' + e.message + ', ' + e.stack);
                                                        }
                                                    },
                                                    close: function () {
                                                        $('#bwOrganizationEditor_divUndoOrgRolesActivationDialog').dialog('destroy');
                                                        //location.reload(); // When the user closes this dialog, we regenerate the screen to reflect the newly created and activated workflow.
                                                    }
                                                });
                                                $('#bwOrganizationEditor_divUndoOrgRolesActivationDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
                                            }
                                        } catch (e) {
                                            console.log('Exception in activateOrgRolesConfiguration().xx.update: ' + e.message + ', ' + e.stack);
                                        }
                                    }).fail(function (data) {
                                        thiz.hideProgress();
                                        var msg;
                                        if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                                            msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                                        } else {
                                            msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
                                        }
                                        alert('Fail in activateOrgRolesConfiguration().xx.update: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                                        console.log('Fail in activateOrgRolesConfiguration().xx.update: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
                                        //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                                        //var error = JSON.parse(data.responseText)["odata.error"];
                                        //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                                    });
                                } catch (e) {
                                    console.log('Exception in activateOrgRolesConfiguration().xx.update: ' + e.message + ', ' + e.stack);
                                }
                            }).fail(function (data) {
                                thiz.hideProgress();
                                var msg;
                                if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                                    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                                } else {
                                    msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
                                }
                                alert('Fail in activateOrgRolesConfiguration().xx.update: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                                console.log('Fail in activateOrgRolesConfiguration().xx.update: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
                                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                                //var error = JSON.parse(data.responseText)["odata.error"];
                                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                            });

                        }
                    } catch (e) {
                        //lpSpinner.Hide();
                        console.log('Exception in activateOrgRolesConfiguration._create().xx.Get:3: ' + e.message + ', ' + e.stack);
                    }
                }).fail(function (data) {
                    //lpSpinner.Hide();
                    console.log('In xx.fail(): ' + JSON.stringify(data));
                    var msg;
                    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                    } else {
                        msg = JSON.stringify(data);
                    }
                    alert('Exception in activateOrgRolesConfiguration.Get: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                    console.log('Exception in activateOrgRolesConfiguration.Get: ' + JSON.stringify(data));
                    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                    //var error = JSON.parse(data.responseText)["odata.error"];
                    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                });
            }
        } catch (e) {
            console.log('Exception in activateOrgRolesConfiguration(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in activateOrgRolesConfiguration(): ' + e.message + ', ' + e.stack);
        }
    },
    resetRaciConfiguration: function () {
        try {
            var thiz = this;
            console.log('In resetRaciConfiguration().');
            //var workflowToActivate_Id;
            //$('#spanWorkflowsDropDownList').find('option:selected').each(function (index, element) {
            //    workflowToActivate_Id = element.value;
            //});
            //console.log('In activateRaciConfiguration(). workflowToActivate_Id: ' + workflowToActivate_Id);
            //if (confirm("Are you certain you wish to activate this workflow?")) {
            //    this.showProgress('Activating your Selected Workflow...');
            //    // First we have to deactivate the existing active workflow. Get the Id first, then mark as inactive.

            var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            //var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

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
                alert('Exception in raci.html.activateRaciConfiguration.Get: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                console.log('Exception in raci.html.activateRaciConfiguration.Get: ' + JSON.stringify(data));
                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                //var error = JSON.parse(data.responseText)["odata.error"];
                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            });
            //}
        } catch (e) {
            console.log('Exception in activateRaciConfiguration(): ' + e.message + ', ' + e.stack);
        }
    },

    closePublishDialog: function () {
        $('#bwOrganizationEditor_divUndoOrgRolesActivationDialog').dialog('close');
    },
    saveOrgRolesConfigurationAndActivateAndUpdateParticipants: function () {
        try {
            console.log('In bwOrganizationEditor.js.saveOrgRolesConfigurationAndActivateAndUpdateParticipants().');
            //alert('In bwOrganizationEditor.js.saveOrgRolesConfigurationAndActivateAndUpdateParticipants().');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');
            debugger;
            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            //var description = document.getElementById('txtNewWorkflowDescription').value;
            //if (description.trim() == '') {
            //    alert('You must enter a "Description" for this workflow change!');
            //} else {
            //this.showProgress('Saving and Activating your Workflow Change...');
            //var bwOrgRolesId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            //    return v.toString(16);
            //});
            //var dtNow = new Date();

            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                bwWorkflowAppId: workflowAppId,
                CreatedBy: participantFriendlyName,
                CreatedById: participantId,
                CreatedByEmail: participantEmail,
                bwOrgRolesJson: JSON.stringify(thiz.options.store.Global),
                bwOrgRolesActive: true
            };
            $.ajax({
                url: thiz.options.operationUriPrefix + "_bw/SaveBwOrgRoles_With_SynchronizeParticipantOrgRoles", // This also updates the participants when Role.ParticipantIsDirty == true. The web service has to iterate through all nodes and process these. Then mark as false, before saving the json.
                type: 'POST',
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (results) {
                    try {
                        console.log('In bwOrganizationEditor.js.saveOrgRolesConfigurationAndActivateAndUpdateParticipants(). Returned from POST SaveBwOrgRoles_With_SynchronizeParticipantOrgRoles(): ' + JSON.stringify(results));

                        if (results.status != 'SUCCESS') {

                            var msg = 'Error in saveOrgRolesConfigurationAndActivateAndUpdateParticipants(). ' + results.status + ', ' + results.message;
                            console.log(msg);
                            displayAlertDialog(msg);

                        } else {

                            console.log('In saveOrgRolesConfigurationAndActivateAndUpdateParticipants(). Successfully updated DB. results: ' + JSON.stringify(results));

                            //$(thiz.element).find("#divUndoOrgRolesActivationDialog").dialog({
                            //    modal: true,
                            //    resizable: false,
                            //    closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                            //    width: '800',
                            //    dialogClass: 'no-close', // No close button in the upper right corner.
                            //    hide: false, // This means when hiding just disappear with no effects.
                            //    open: function () {
                            //        $('.ui-widget-overlay').bind('click', function () {
                            //            $(thiz.element).find('#divUndoOrgRolesActivationDialog').dialog('close');
                            //        });
                            //    },
                            //    close: function () {
                            //        $(thiz.element).find('#divUndoOrgRolesActivationDialog').dialog('destroy');
                            //    }
                            //});
                            //$('#divUndoOrgRolesActivationDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
                            alert('xcx11223-2');


                            $("#bwOrganizationEditor_divUndoOrgRolesActivationDialog").dialog({
                                modal: true,
                                resizable: false,
                                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                                width: '800',
                                dialogClass: 'no-close', // No close button in the upper right corner.
                                hide: false, // This means when hiding just disappear with no effects.
                                open: function () {

                                    $('.ui-widget-overlay').bind('click', function () {
                                        $('#bwOrganizationEditor_divUndoOrgRolesActivationDialog').dialog('close');
                                    });
                                },
                                close: function () {

                                    // 4-22-2022
                                    // Now we have to redraw the display based on this new json data/bworgrolesjson
                                    //thiz.element.html(thiz.renderOrgRolesEditor()); // Render the org chart.
                                    $('#divPageContent3').html(thiz.renderOrgRolesEditor());

                                    $('#bwOrganizationEditor_divUndoOrgRolesActivationDialog').dialog('destroy');

                                }
                            });

                            var json = JSON.parse(results.bwOrgRolesJson);

                            thiz.options.store.Global = JSON.parse(JSON.stringify(json.Global));
                            thiz.options.store.DraftGlobal = JSON.parse(JSON.stringify(json.Global));

                            // NOTE THAT THE WIDGET gets redisplayed in the close event of the dialog above.

                            //thiz.checkIfWeHaveToDisplayThePublishChangesButton();

                        }

                    } catch (e) {
                        var msg = 'Exception in bwOrganizationEditor.js.saveOrgRolesConfigurationAndActivateAndUpdateParticipants(): ' + e.message + ', ' + e.stack;
                        console.log(msg);
                        displayAlertDialog(msg);
                    }

                },
                error: function (data, errorCode, errorMessage) {
                    var msg = 'Error in bwOrganizationEditor.js.saveOrgRolesConfigurationAndActivateAndUpdateParticipants(). ' + errorCode + ', ' + errorMessage + ', ' + JSON.stringify(data);
                    console.log(msg);
                    displayAlertDialog(msg);
                }

            });

        } catch (e) {
            var msg = 'Exception in bwOrganizationEditor.js.saveOrgRolesConfigurationAndActivateAndUpdateParticipants(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
        }
    },
    saveStepname: function (tagname, originalStepname) {
        try {
            console.log('saveStepname(). tagname: ' + tagname + ', originalStepname: ' + originalStepname);
            //alert('In saveStepname(). Editing this step name will impact all of the workflows.');
            var newStepName = document.getElementById(tagname).firstElementChild.value;
            for (var i = 0; i < this.options.store.RaciSteps.length; i++) {
                if (this.options.store.RaciSteps[i].StepName == originalStepname) {
                    this.options.store.RaciSteps[i].StepName = newStepName;
                    document.getElementById(tagname).innerHTML = newStepName; // Doing this instead of calling this._create();
                }
            }
        } catch (e) {
            console.log('Exception in saveStepname(): ' + e.message + ', ' + e.stack);
        }
        //this._create();
    },
    //saveActionOrRequireCommentsCheckbox: function (checkboxId) {
    //    try {
    //        // Get the action and checkbox type. eg: Action-Approve_3_13, RequireComments-Approve_3_13
    //        var x = checkboxId.split('_')[0];
    //        var checkboxType = x.split('-')[0]; // "Action" or "RequireComments"
    //        var action = x.split('-')[1]; // "Approve"
    //        var stepIndex = checkboxId.split('_')[1]; // eg: 2
    //        var roleIndex = checkboxId.split('_')[2]; // eg: 13
    //        console.log('In saveActionOrRequireCommentsCheckbox(). checkboxId: ' + checkboxId + ', checkboxType: ' + checkboxType + ', action: ' + action + ', stepIndex: ' + stepIndex + ', roleIndex: ' + roleIndex);
    //        var actionCheckboxState;
    //        var requireCommentsCheckboxState;
    //        if (checkboxType == 'RequireComments') {
    //            var actionCheckbox_Id = 'Action-Approve_' + stepIndex + '_' + roleIndex;
    //            actionCheckboxState = document.getElementById(actionCheckbox_Id).checked;
    //            requireCommentsCheckboxState = document.getElementById(checkboxId).checked;
    //        } else {
    //            var requireCommentsCheckbox_Id = 'RequireComments-Approve_' + stepIndex + '_' + roleIndex;
    //            actionCheckboxState = document.getElementById(checkboxId).checked;
    //            requireCommentsCheckboxState = document.getElementById(requireCommentsCheckbox_Id).checked;
    //        }

    //        if (this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex].Action.length) {
    //            console.log('ASSIGN'); // THIS WORKS!!!!!!!!!!!!!!!!!!!!!!
    //            var x;
    //            if (requireCommentsCheckboxState) {
    //                x = {
    //                    Action: {
    //                        '@Name': 'Approve',
    //                        '@State': 'Done',
    //                        '@RequireComments': 'True',
    //                        Tooltip: 'Approve the request and submit comments'
    //                    }
    //                };
    //            } else {
    //                x = {
    //                    Action: {
    //                        '@Name': 'Approve',
    //                        '@State': 'Done',
    //                        Tooltip: 'Approve the request and submit comments'
    //                    }
    //                };
    //            }
    //            this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex].Action.push(x);
    //        } else if (this.options.store.Workflow.Steps.Step[stepIndex].OnStart.Inform.length) {
    //            //console.log('INFORM');
    //            // INFORM DOES NOT HAVE THESE ONES.
    //        } else {
    //            alert('ERROR: Invalid assign or inform value.');
    //            console.log('not ASSIGN or INFORM. this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex]: ' + JSON.stringify(this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex]));
    //        }
    //    } catch (e) {
    //        console.log('Exception in saveActionOrRequireCommentsCheckbox(): ' + e.message + ', ' + e.stack);
    //    }
    //},
    cancelChangesInDraftOrgRolesConfiguration: function () {
        try {
            console.log('In cancelChangesInDraftOrgRolesConfiguration().');
            this.options.store.Global = JSON.parse(JSON.stringify(this.options.store.DraftGlobal)); // Creating "DraftWorkflow" so we can tell if the workflow has been changed or not, and then inform the user that changes need to be published.
            this.renderOrgRolesEditor(); // Definition is renderOrgRolesEditor(assignmentRowChanged_ElementId).
        } catch (e) {
            console.log('Exception in cancelChangesInDraftOrgRolesConfiguration(): ' + e.message + ', ' + e.stack);
        }
    },
    checkIfWeHaveToDisplayThePublishChangesButton: function () {
        try {
            //debugger;
            console.log('In bwOrganizationEditor.js.checkIfWeHaveToDisplayThePublishChangesButton().');
            var thereHaveBeenChangesToTheOrgRoles = false;
            var oldJsonString = JSON.stringify(this.options.store.Global);
            var newJsonString = JSON.stringify(this.options.store.DraftGlobal);
            if (oldJsonString != newJsonString) {
                thereHaveBeenChangesToTheOrgRoles = true;
            }
            //debugger;
            if (this.options.DisplayAsNewTenantUserConfigurationEditor == true) {
                if (thereHaveBeenChangesToTheOrgRoles == true) {
                    // The user has made changes to the workflow.
                    document.getElementById('spanThereAreChangesToPublishText51').innerHTML = 'You have changes that won\'t be available until you publish: ';
                    var html = '';
                    html += '<input style="padding:5px 10px 5px 10px;width:100px;" id="btnSaveWorkflowConfigurationAndActivate" type="button" value="Publish" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'saveOrgRolesConfigurationAndActivateAndUpdateParticipants\');" />'; // was > publishNewUserBusinessModelConfigurationAndActivate
                    html += '&nbsp;<input style="padding:5px 10px 5px 10px;" id="btnCancelChangesInDraftWorkflowConfiguration" type="button" value="Cancel Changes" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'cancelChangesInDraftOrgRolesConfiguration\');" />'; // WAS >> cancelChangesInDraftWorkflowConfiguration
                    document.getElementById('spanThereAreChangesToPublishButton51').innerHTML = html;
                } else {
                    // Do nothing because the user has made no changes to the workflow.
                    document.getElementById('spanThereAreChangesToPublishText51').innerHTML = '';
                    document.getElementById('spanThereAreChangesToPublishButton51').innerHTML = '';
                }
            } else {
                if (thereHaveBeenChangesToTheOrgRoles) {
                    // The user has made changes to the workflow.
                    document.getElementById('spanThereAreChangesToPublishText').innerHTML = 'You have changes that won\'t be available until you publish: ';
                    var html = '';
                    html += '<input style="padding:5px 10px 5px 10px;width:100px;" id="btnsaveOrgRolesConfigurationAndActivateAndUpdateParticipants" type="button" value="Publish" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'saveOrgRolesConfigurationAndActivateAndUpdateParticipants\');" />';
                    html += '&nbsp;<input style="padding:5px 10px 5px 10px;" id="btncancelChangesInDraftOrgRolesConfiguration" type="button" value="Cancel Changes" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'cancelChangesInDraftOrgRolesConfiguration\');" />';
                    document.getElementById('spanThereAreChangesToPublishButton').innerHTML = html; //'<input style="padding:5px 10px 5px 10px;" id="btnSaveWorkflowConfigurationAndActivate" type="button" value="  Publish  " onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveWorkflowConfigurationAndActivate\');" />';
                } else {
                    try {
                        // Do nothing because the user has made no changes to the workflow.
                        document.getElementById('spanThereAreChangesToPublishText').innerHTML = '';
                        document.getElementById('spanThereAreChangesToPublishButton').innerHTML = '';
                    } catch (e) { }
                }
            }
        } catch (e) {
            console.log('Exception in bwOrganizationEditor.js.checkIfWeHaveToDisplayThePublishChangesButton(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwOrganizationEditor.js.checkIfWeHaveToDisplayThePublishChangesButton(): ' + e.message + ', ' + e.stack);
        }
    },


    checkIfWeHaveToDisplayThePublishChangesButton_ForDialogEditor: function () {
        try {
            console.log('In checkIfWeHaveToDisplayThePublishChangesButton_ForDialogEditor().');

            var thereHaveBeenChangesToTheOrgRoles = false;
            var oldJsonString = JSON.stringify(this.options.store.Global);
            var newJsonString = JSON.stringify(this.options.store.DraftGlobal);
            if (oldJsonString != newJsonString) {
                thereHaveBeenChangesToTheOrgRoles = true;
            }
            //debugger;
            if (this.options.DisplayAsNewTenantUserConfigurationEditor == true) {
                if (thereHaveBeenChangesToTheOrgRoles == true) {
                    // The user has made changes to the workflow.
                    document.getElementById('spanThereAreChangesToPublishText51').innerHTML = 'You have changes that won\'t be available until you publish: ';
                    var html = '';
                    html += '<input style="padding:5px 10px 5px 10px;width:100px;" id="btnSaveWorkflowConfigurationAndActivate" type="button" value="Publish" onclick="$(\'.bwOrganizationEditorAdmin\').bwOrganizationEditorAdmin(\'forceUpdateOrgRolesConfiguration\');" />'; // was > publishNewUserBusinessModelConfigurationAndActivate
                    html += '&nbsp;<input style="padding:5px 10px 5px 10px;" id="btnCancelChangesInDraftWorkflowConfiguration" type="button" value="Cancel Changes" onclick="$(\'.bwOrganizationEditorAdmin\').bwOrganizationEditorAdmin(\'cancelChangesInDraftOrgRolesConfiguration\');" />'; // WAS >> cancelChangesInDraftWorkflowConfiguration
                    document.getElementById('spanThereAreChangesToPublishButton51').innerHTML = html;
                } else {
                    // Do nothing because the user has made no changes to the workflow.
                    document.getElementById('spanThereAreChangesToPublishText51').innerHTML = '';
                    document.getElementById('spanThereAreChangesToPublishButton51').innerHTML = '';
                }
            } else {
                if (thereHaveBeenChangesToTheOrgRoles) {
                    // The user has made changes to the workflow.
                    document.getElementById('spanThereAreChangesToPublishText').innerHTML = 'You have changes that won\'t be available until you publish: ';
                    var html = '';
                    html += '<input style="padding:5px 10px 5px 10px;width:100px;" id="btnsaveOrgRolesConfigurationAndActivateAndUpdateParticipants" type="button" value="Publish" onclick="$(\'.bwOrganizationEditorAdmin\').bwOrganizationEditorAdmin(\'saveOrgRolesConfigurationAndActivateAndUpdateParticipants\');" />';
                    html += '&nbsp;<input style="padding:5px 10px 5px 10px;" id="btncancelChangesInDraftOrgRolesConfiguration" type="button" value="Cancel Changes" onclick="$(\'.bwOrganizationEditorAdmin\').bwOrganizationEditorAdmin(\'cancelChangesInDraftOrgRolesConfiguration\');" />';
                    document.getElementById('spanThereAreChangesToPublishButton').innerHTML = html; //'<input style="padding:5px 10px 5px 10px;" id="btnSaveWorkflowConfigurationAndActivate" type="button" value="  Publish  " onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveWorkflowConfigurationAndActivate\');" />';
                } else {
                    try {
                        // Do nothing because the user has made no changes to the workflow.
                        document.getElementById('spanThereAreChangesToPublishText').innerHTML = '';
                        document.getElementById('spanThereAreChangesToPublishButton').innerHTML = '';
                    } catch (e) { }
                }
            }
        } catch (e) {
            console.log('Exception in checkIfWeHaveToDisplayThePublishChangesButton_ForDialogEditor(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in checkIfWeHaveToDisplayThePublishChangesButton_ForDialogEditor(): ' + e.message + ', ' + e.stack);
        }
    },


    saveCollaborationTimeout: function () {
        try {
            // This makes sure the user enters a number here, which is greater than 0 and less than 28.
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
            for (var i = 0; i < this.options.store.Workflow.Steps.Step.length; i++) {
                if (this.options.store.Workflow.Steps.Step[i]["@Name"] == 'Collaboration') {
                    this.options.store.Workflow.Steps.Step[i]["@Timeout"] = timeoutValueToSave; // Save the timeout value.
                    this.options.store.Workflow.Steps.Step[i]["@TimeoutUnits"] = timeoutUnits; // Save the timeout units: [Days, Hours, Minutes]
                }
            }
            this.checkIfWeHaveToDisplayThePublishChangesButton();
        } catch (e) {
            console.log('Exception in saveCollaborationTimeout(): ' + e.message + ', ' + e.stack);
        }
    },
    //saveCollaborationTimeout: function() {
    //    try {
    //        console.log('In saveCollaborationTimeout().');
    //        var timeout = document.getElementById('textTimeout').value;
    //        var timeoutUnits; 
    //        $('#selectTimeoutUnits').find('option:selected').each(function (index, element) {
    //            timeoutUnits = element.value;
    //        });

    //        debugger;


    //    } catch (e) {
    //        console.log('Exception in saveCollaborationTimeout(): ' + e.message + ', ' + e.stack);
    //    }
    //},
    saveAssignmentRow: function (elementId) {
        try {
            console.log('In saveAssignmentRow(). WE WILL GET RID OF THIS SAVE BUTTON BECAUSE WE WANT TO JUST HAVE THE Publish BUTTON BECOME ENABLED. THIS WILL BE MORE INTUITIVE I THNK..??!! elementId: ' + elementId); // eg: elementId: steprow-inform_3_8
            var thiz = this;
            var x = elementId.split('_')[0];
            var sourceRoleCategory = x.split('-')[1]; // "inform" or "assign"
            var stepIndex = elementId.split('_')[1]; // eg: 3
            var roleIndex = elementId.split('_')[2]; // eg: 8
            //if (confirm("Please confirm you wish to save this change. This will not affect the workflow until it has been saved & activated.")) {
            // Step 1: Change the underlying JSON. These loops help us locate the node the user wants to change.
            var car = this.options.store;
            if (stepIndex && sourceRoleCategory && roleIndex > -1) {
                // Step 1: Get the Role.
                var newRoleId;
                $('#selectRoleName').find('option:selected').each(function (index, element) {
                    newRoleId = element.value;
                });

                var newRoleCategory; // Step 1: Get the "RoleCategory".
                $('#selectRoleCategory').find('option:selected').each(function (index, element) {
                    newRoleCategory = element.value;
                });
                var newActions = []; // Step 2: Get the "Actions".
                if (newRoleCategory == 'Approver') { // We only get "Actions" when it is "Approve".
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
                                Invalidate: { '@Step': 'Admin' },
                                Invalidate: { '@Step': 'VPLevel' },
                                Invalidate: { '@Step': 'ExecLevel' },
                                Invalidate: { '@Step': 'CLevel' },
                                Tooltip: 'Send the CAR back to the original creator'
                            };
                        } else {
                            x = {
                                '@Name': 'Revise/Hold',
                                '@Target': 'Revise',
                                Invalidate: { '@Step': 'Admin' },
                                Invalidate: { '@Step': 'VPLevel' },
                                Invalidate: { '@Step': 'ExecLevel' },
                                Invalidate: { '@Step': 'CLevel' },
                                Tooltip: 'Send the CAR back to the original creator'
                            };
                        }
                        newActions.push(x);
                    }
                }
                //debugger;
                var newConditionString = document.getElementById('spanConditionEditorContents').innerHTML; // Step 3: Get the "Cond".

                if (document.getElementById('selectRoleName')) {
                    var e = document.getElementById("selectRoleName");
                    var newRoleId = e.options[e.selectedIndex].value;
                    var newRoleName = e.options[e.selectedIndex].text;
                }

                //
                // We now have all of our new values. Now we have to determine if we use the same node in the JSON, or if it has to move.
                // This depends on whether the user has selected a different "RoleCategory" (Inform, Collaborator, Approver).
                //
                debugger;
                if (sourceRoleCategory == 'inform' && (newRoleCategory == 'Collaborator' || newRoleCategory == 'Approver')) {
                    // Change from inform to assign row.
                    //var roleId;
                    //if (this.options.store.Workflow.Steps.Step[stepIndex].OnStart.Inform[roleIndex]["@Role"]) {
                    //    roleId = this.options.store.Workflow.Steps.Step[stepIndex].OnStart.Inform[roleIndex]["@Role"];
                    //} else {
                    //    roleId = this.options.store.Workflow.Steps.Step[stepIndex].OnStart.Inform[roleIndex]["@IdField"];
                    //}
                    // eg: <Assign Role="ADMIN" Form="CARForm.aspx" DoneForm="CARComments.aspx" Title="Add Comments/Approve" MailTemplate="Assign1.xsl" Subject="eCAR3 - New Work Item ({0})" RoleCategory="Approver">
                    var row = {
                        '@Role': newRoleId,
                        '@RoleName': newRoleName,





                        '@RoleCategory': newRoleCategory,
                        '@Cond': newConditionString
                    };
                    if (newRoleCategory == 'Approver' && newActions) {
                        row.Action = newActions;
                    }
                    // Delete the old row.
                    debugger; // WHY IS THIS AN INFORM?
                    this.options.store.Workflow.Steps.Step[stepIndex].Inform.splice(roleIndex, 1); // delete leaves a null, so we have to use splice.
                    // Depending on the new RoleCategory, figure out where in the json to insert this assignment row. For instance, if it is "Approver", it should show up at the top of the "Approvers", and be highlighted so th euser know what they just changed.
                    // Iterate through all of the assignment rows and find this out.
                    var assignIndex;
                    var weFoundIt = false;
                    for (var i = 0; i < this.options.store.Workflow.Steps.Step[stepIndex].Assign.length; i++) {
                        console.log('this.options.store.Workflow.Steps.Step[stepIndex].Assign[i]: ' + this.options.store.Workflow.Steps.Step[stepIndex].Assign[i]["@RoleCategory"] + ', newRoleCategory: ' + newRoleCategory);
                        if (!weFoundIt && this.options.store.Workflow.Steps.Step[stepIndex].Assign[i]["@RoleCategory"] == newRoleCategory) {
                            // We have found the first of this role category, so we will insert this new assignment row at the top.
                            this.options.store.Workflow.Steps.Step[stepIndex].Assign.splice(i, 0, row); // Create the row
                            assignIndex = i;
                            weFoundIt = true;
                        }
                    }
                } else if (sourceRoleCategory == 'assign' && newRoleCategory == 'Inform') {
                    // Change from assign to inform row.
                    //var roleId = this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex]["@Role"];
                    this.options.store.Workflow.Steps.Step[stepIndex].Assign.splice(roleIndex, 1); // delete leaves a null, so we have to use splice.
                    // eg: <Inform Role="DIRSAFE" MailTemplate="Inform1.xsl" Subject="eCAR3 - New Project {0} created" Cond="$ProjectType~IM,LR,EQ,SG,FS,WS,ENV,INO,PSM,IT,TRANS,WH" />
                    var row = {
                        '@Role': newRoleId,
                        '@RoleName': newRoleName,


                        '@Cond': newConditionString
                    }
                    this.options.store.Workflow.Steps.Step[stepIndex].Inform.splice(0, 0, row); // Create the row
                } else {
                    // No change to RoleCategory, stay in the same row. THIS IS THE ONLY PLACE WHERE we save values to an existing row in the workflow.
                    if (sourceRoleCategory == 'inform') {
                        this.options.store.Workflow.Steps.Step[stepIndex].Inform[roleIndex]["@Cond"] = newConditionString; // The only thing that could change here is "Cond".
                        debugger;
                        if (newRoleId) {
                            this.options.store.Workflow.Steps.Step[stepIndex].Inform[roleIndex]["@Role"] = newRoleId;
                            this.options.store.Workflow.Steps.Step[stepIndex].Inform[roleIndex]["@RoleName"] = newRoleName;
                        }
                    } else if (sourceRoleCategory == 'assign') {
                        if (newRoleCategory == 'Approver' && newActions) {
                            //debugger;
                            // Find out if we changed the Tooltip and JavaScript values already. They save differently..... not sure if this is best approach yet.
                            var actionIndex;
                            for (var a = 0; a < this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex].Action.length; a++) {
                                var x1 = this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex].Action[a]["@Name"];
                                for (var b = 0; b < newActions.length; b++) {
                                    var x2 = newActions[b]["@Name"];
                                    if (x1 == x2) {
                                        //debugger;
                                        var tooltip = this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex].Action[a].Tooltip;
                                        var javascript = this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex].Action[a]["@JavaScript"];
                                        newActions[b].Tooltip = tooltip;
                                        newActions[b]["@JavaScript"] = javascript;

                                    }
                                }
                            }
                            this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex].Action = newActions;
                        }
                        //debugger;
                        this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex]["@Cond"] = newConditionString;
                        this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex]["@Role"] = newRoleId;
                        this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex]["@RoleName"] = newRoleName;
                    } else {
                        alert('ERROR: Invalid sourceRoleCategory: ' + sourceRoleCategory);
                    }
                }
                //
                // Now we have to save the user(s) in the BwWorkflowUserRole schema.
                //
                var userId = document.getElementById('txtRoleMembersId_' + stepIndex + '_' + roleIndex).value;
                if (userId) {
                    // A user(s) has been selected, so update the table.
                    var userFriendlyName = document.getElementById('txtRoleMembersFriendlyName_' + stepIndex + '_' + roleIndex).value;
                    var userEmail = document.getElementById('txtRoleMembersEmail_' + stepIndex + '_' + roleIndex).value;
                    var dtNow = new Date();
                    var json = {
                        bwTenantId: tenantId,
                        bwWorkflowAppId: workflowAppId,
                        bwParticipantId: userId,
                        bwParticipantFriendlyName: userFriendlyName,
                        bwParticipantEmail: userEmail,
                        RoleId: newRoleId,
                        RoleName: newRoleName, // JUST ADDED MAKE SURE THIS WORKS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                        OrgId: 'ALL', // UNTIL WE GET THE Orgs figured out, use 'ALL' as the default.
                        Active: true,
                        Created: dtNow,
                        Modified: dtNow,
                        ModifiedByFriendlyName: participantFriendlyName,
                        ModifiedById: participantId,
                        ModifiedByEmail: participantEmail
                    };
                    $.ajax({
                        url: thiz.options.operationUriPrefix + "odata/UserRole",
                        type: "Post",
                        timeout: thiz.options.ajaxTimeout,
                        data: json,
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        }
                    }).success(function (result) {
                        try {
                            // Re-render the screen.
                            thiz._create();
                        } catch (e) {
                            console.log('Exception in bwWorkflowEditor.js.saveAssignmentRow().xx.update: ' + e.message + ', ' + e.stack);
                            alert('Exception in bwWorkflowEditor.js.saveAssignmentRow().xx.update: ' + e.message + ', ' + e.stack);
                        }
                    }).error(function (data, errorCode, errorMessage) {
                        //thiz.hideProgress();
                        var msg;
                        if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                            msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                        } else {
                            msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
                        }
                        console.log('Fail in bwWorkflowEditor.js.saveAssignmentRow().xx.update: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
                        alert('Fail in bwWorkflowEditor.js.saveAssignmentRow().xx.update: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                        //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                        //var error = JSON.parse(data.responseText)["odata.error"];
                        //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                    });
                } else {
                    // Re-render the screen.
                    this._create();
                }
            } else {
                // We should never get here!!!
                alert('ERROR: Failed to locate the step or role in the underlying json.');
            }
        } catch (e) {
            console.log('Exception in saveAssignmentRow(): ' + e.message + ', ' + e.stack);
        }
    },
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
            var operationUri = webserviceurl + "/getfunctionalareasbyappid/" + this.options.CurrentWorkflowAppId + "/" + "RETURNALL";
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





                        if (thiz.options.CurrentWorkflowAppId == null) {
                            // Not logged in so we will use these defaults for the time being.
                            var availableProjectTypes = [
                                { bwFunctionalAreaYear: '2019', IsHidden: 'false', bwFunctionalAreaId: '1', bwFunctionalAreaQuote: 'false', bwFunctionalAreaTitle: 'Buildings' },
                                { bwFunctionalAreaYear: '2019', IsHidden: 'false', bwFunctionalAreaId: '1', bwFunctionalAreaQuote: 'false', bwFunctionalAreaTitle: 'Computer equipment' },
                                { bwFunctionalAreaYear: '2019', IsHidden: 'false', bwFunctionalAreaId: '1', bwFunctionalAreaQuote: 'false', bwFunctionalAreaTitle: 'Office equipment' },
                                { bwFunctionalAreaYear: '2019', IsHidden: 'false', bwFunctionalAreaId: '1', bwFunctionalAreaQuote: 'false', bwFunctionalAreaTitle: 'Furniture and fixtures' },
                                { bwFunctionalAreaYear: '2019', IsHidden: 'false', bwFunctionalAreaId: '1', bwFunctionalAreaQuote: 'false', bwFunctionalAreaTitle: 'Intangible assets' },
                                { bwFunctionalAreaYear: '2019', IsHidden: 'false', bwFunctionalAreaId: '1', bwFunctionalAreaQuote: 'false', bwFunctionalAreaTitle: 'Land' },
                                { bwFunctionalAreaYear: '2019', IsHidden: 'false', bwFunctionalAreaId: '1', bwFunctionalAreaQuote: 'false', bwFunctionalAreaTitle: 'Machinery' },
                                { bwFunctionalAreaYear: '2019', IsHidden: 'false', bwFunctionalAreaId: '1', bwFunctionalAreaQuote: 'false', bwFunctionalAreaTitle: 'Software' },
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
            console.log('In bwOrganizationEditor.js.displayPeoplePickerDialog().');
            alert('In bwOrganizationEditor.js.displayPeoplePickerDialog().');

            //var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            //var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            //var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

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

    displayPeoplePickerDialogForJson: function (roleId, roleName, divisionIndex, groupIndex, entityIndex, locationIndex) {
        try {
            console.log('In bwOrganizationEditor.js.displayPeoplePickerDialogForJson().');
            //alert('In bwOrganizationEditor.js.displayPeoplePickerDialogForJson().');

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            if (!participantId) {
                console.log('In displayPeoplePickerDialogForJson(). User is not logged in, so displaying the logon.');
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
                                url: webserviceurl + "/workflow/" + workflowAppId + "/participants/" + request.term,
                                dataType: "json",
                                success: function (data) {
                                    $('#spanPeoplePickerParticipantsList').empty();
                                    var html = '';
                                    if (data.participants.length > 0) {

                                        for (var i = 0; i < data.participants.length; i++) {
                                            html += '<a style="cursor:pointer !important;text-decoration:underline;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'cmdReturnParticipantIdToFieldForJson\', \'' + roleId + '\', \'' + roleName + '\', \'' + divisionIndex + '\', \'' + groupIndex + '\', \'' + entityIndex + '\', \'' + locationIndex + '\', \'' + data.participants[i].participant.split('|')[0] + '\', \'' + data.participants[i].participant.split('|')[1] + '\', \'' + data.participants[i].participant.split('|')[2] + '\');">' + data.participants[i].participant.split('|')[0] + '&nbsp;&nbsp;<i>(' + data.participants[i].participant.split('|')[2] + ')</i></a>';
                                            html += '<br />';
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
                        debugger;
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
                this.renderAllParticipantsInThePeoplePickerForJson(roleId, roleName, divisionIndex, groupIndex, entityIndex, locationIndex); // We do this the first time to make sure they are all displayed.
            }
        } catch (e) {
            console.log('Exception in displayPeoplePickerDialogForJson: ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in displayPeoplePickerDialogForJson: ' + e.message + ', ' + e.stack);
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
                                var quill = new Quill('#ConfigureEmailNotificationsDialogEditor', {
                                    modules: {
                                        toolbar: [
                                            [{ header: [1, 2, false] }],
                                            ['bold', 'italic', 'underline'],
                                            ['image', 'code-block']
                                        ]
                                    },
                                    placeholder: 'The enhanced notification email editor functionality is coming soon...', //'Compose an epic...',
                                    theme: 'snow'  // or 'bubble'
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
    //editCollaborationTimeoutEmail: function() {
    //    try {
    //        console.log('In editCollaborationTimeoutEmail().');
    //        var thiz = this;
    //        // Set the dialog title.
    //        document.getElementById('spanConfigureEmailNotificationsDialogSubTitle').innerHTML = 'This email gets sent to participants of the "Collaboration" stage when it times out';
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
    //                    console.log('btnQuill_InsertADataItem: This functionality is incomplete. Coming soon!');
    //                    thiz.displayEmailDataItemPickerDialog();
    //                });
    //                // Retrieve the email from the workflow and display it in the editor.
    //                var emailTemplate = '';
    //                for (var i = 0; i < thiz.options.store.Workflow.Steps.Step.length; i++) {
    //                    if (thiz.options.store.Workflow.Steps.Step[i]["@Name"] == 'Collaboration') {
    //                        emailTemplate = thiz.options.store.Workflow.Steps.Step[i]["@EmailTemplate"];
    //                        break;
    //                    }
    //                }
    //                if (emailTemplate && emailTemplate != '') {
    //                    thiz.options.quill.setText(emailTemplate); 
    //                } else {
    //                    thiz.options.quill.setText('');
    //                }
    //            },
    //            close: function () {
    //                //$(this).dialog('destroy').remove();
    //            }
    //        });
    //        $('#divConfigureEmailNotificationsDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
    //    } catch (e) {
    //        console.log('Exception in editCollaborationTimeoutEmail(): ' + e.message + ', ' + e.stack);
    //    }
    //},
    editStepEmails: function (stepName) {
        try {
            console.log('In editStepEmails().');
            var thiz = this;
            // Set the dialog title.
            document.getElementById('spanConfigureEmailNotificationsDialogSubTitle').innerHTML = 'This email gets sent to participants of the "' + stepName + '" stage';
            // Set the "Save" button.
            var html = '';
            html += '<div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveEmailTemplateForStep\', \'' + stepName + '\');">';
            html += 'Save this email template';
            html += '</div>';
            document.getElementById('spanConfigureEmailNotificationsDialogSaveButton').innerHTML = html;
            // Display the email editor.
            $("#divConfigureEmailNotificationsDialog").dialog({
                modal: true,
                resizable: false,
                //closeText: "Cancel",
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                //title: 'divConfigureEmailNotificationsDialog',
                width: '800',
                dialogClass: 'no-close', // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $('#divConfigureEmailNotificationsDialog').dialog('close');
                    });
                    // Display the email editor.
                    thiz.options.quill = new Quill('#ConfigureEmailNotificationsDialogEditor', {
                        modules: {
                            toolbar: '#bwQuilltoolbar'
                        },
                        //placeholder: 'The enhanced notification email editor functionality is coming soon...', 
                        theme: 'snow'
                    });
                    // Hook up this button event so that the user can insert data items into the email.
                    var customButton = document.querySelector('#btnQuill_InsertADataItem');
                    customButton.addEventListener('click', function () {
                        console.log('btnQuill_InsertADataItem: This functionality is incomplete. Coming soon!');
                        thiz.displayEmailDataItemPickerDialog();
                    });
                    // Retrieve the email from the workflow and display it in the editor.
                    var emailTemplate = '';
                    for (var i = 0; i < thiz.options.store.Workflow.Steps.Step.length; i++) {
                        if (thiz.options.store.Workflow.Steps.Step[i]["@Name"] == stepName) {
                            emailTemplate = thiz.options.store.Workflow.Steps.Step[i]["@EmailTemplate"];
                            break;
                        }
                    }
                    if (emailTemplate && emailTemplate != '') {
                        thiz.options.quill.setText(emailTemplate);
                    } else {
                        thiz.options.quill.setText('');
                    }
                },
                close: function () {
                    $('#divConfigureEmailNotificationsDialog').dialog('destroy');
                }
            });
            $('#divConfigureEmailNotificationsDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
        } catch (e) {
            console.log('Exception in editStepEmails(): ' + e.message + ', ' + e.stack);
        }
    },
    displayEmailDataItemPickerDialog: function () {
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
                    //$(this).dialog('destroy').remove();
                    $('#divEmailDataItemPickerDialog').dialog('destroy');
                }
            });
            //$("#divEmailDataItemPickerDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
            //debugger;
            document.getElementById('spanEmailDataItemPickerDialogSubTitle').innerHTML = 'Select a data item then click the "Insert" button...';
            var html = '';
            html += '<select id="selectEmailDataItemPickerDialogDataItem" style="padding:5px 5px 5px 5px;">';
            html += '   <option value="1">Select a data item...</option>';
            html += '   <option value="3">&#10697; Company Logo</option>';
            html += '   <option value="2">&#9863; Participant Friendly Name</option>';
            html += '   <option value="2">&#9863; Participant Email</option>';
            html += '   <option value="3">&#9992; Budget Request Link</option>';
            html += '   <option value="3">&#9993; Configure Email Settings Link</option>';
            html += '   <option value="3">&#9775; Disclaimer/Legal Text</option>';
            html += '   <option value="3">&#9746; Unsubscribe Link</option>';
            html += '   <option value="3">Budget Request Number</option>';
            html += '   <option value="3">Role Abbreviation</option>';
            html += '   <option value="3">Role Name</option>';
            html += '</select>';
            html += '&nbsp;&nbsp;';
            html += '<input style="padding:5px 10px 5px 10px;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'insertEmailDataItem\');" type="button" value="Insert">';
            document.getElementById('spanEmailDataItemPickerDialogContentTop').innerHTML = html;
        } catch (e) {
            console.log('Exception in displayEmailDataItemPickerDialog(): ' + e.message + ', ' + e.stack);
        }
    },
    displayWorkflowActionsUnderlyingPropertiesDialog: function (elementId, actionTitle) {
        try {
            console.log('In displayWorkflowActionsUnderlyingPropertiesDialog(). elementId: ' + elementId + ', actionTitle: ' + actionTitle);
            var x = elementId.split('_')[1];
            var stepIndex = x.split('_')[0];
            var rowIndex = elementId.split('_')[2];

            //$("#divEmailDataItemPickerDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
            //debugger;
            document.getElementById('spanWorkflowActionsUnderlyingPropertiesDialogSubTitle').innerHTML = 'Update the properties for the "' + actionTitle + '" button, then click "Save"...';
            var html = '';
            // "@JavaScript": "$('#divRequestFormDialog').dialog('close');", "Tooltip": "Cancel the entire request"
            var tooltip = '';
            var javascript = '';
            //debugger;
            for (var i = 0; i < this.options.store.DraftWorkflow.Steps.Step[stepIndex].Assign[rowIndex].Action.length; i++) {
                if (this.options.store.DraftWorkflow.Steps.Step[stepIndex].Assign[rowIndex].Action[i]["@Name"] == actionTitle) {
                    //debugger;
                    var action = this.options.store.DraftWorkflow.Steps.Step[stepIndex].Assign[rowIndex].Action[i];
                    if (action.Tooltip) tooltip = action.Tooltip;
                    if (action["@JavaScript"]) javascript = action["@JavaScript"];
                    break;
                }
            }
            html += 'Tooltip: <input id="WorkflowActionsUnderlyingPropertiesDialog_Tooltip" type="text" style="width:425px;" value="' + tooltip + '"/>';
            html += '<br />';
            html += '<br />';
            html += 'JavaScript: <input id="WorkflowActionsUnderlyingPropertiesDialog_JavaScript" type="text" style="width:425px;" value="' + javascript + '"/>';
            html += '<br />';
            html += '<br />';
            html += '&nbsp;&nbsp;';
            html += '<input style="padding:5px 10px 5px 10px;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveWorkflowActionsUnderlyingProperties\', \'' + elementId + '\', \'' + actionTitle + '\');" type="button" value="Save">';
            document.getElementById('spanWorkflowActionsUnderlyingPropertiesDialogContentTop').innerHTML = html;

            $("#divWorkflowActionsUnderlyingPropertiesDialog").dialog({
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
                        $('#divWorkflowActionsUnderlyingPropertiesDialog').dialog('close');
                    });
                },
                close: function () {
                    //$(this).dialog('destroy'); //.remove();
                    $('#divWorkflowActionsUnderlyingPropertiesDialog').dialog('destroy');
                }
            });
        } catch (e) {
            console.log('Exception in displayWorkflowActionsUnderlyingPropertiesDialog(): ' + e.message + ', ' + e.stack);
        }
    },
    saveWorkflowActionsUnderlyingProperties: function (elementId, actionTitle) {
        try {
            console.log('In saveWorkflowActionsUnderlyingProperties(' + elementId + ', ' + actionTitle + '). actionTitle: ' + actionTitle);
            var x = elementId.split('_')[1];
            var stepIndex = x.split('_')[0];
            var rowIndex = elementId.split('_')[2];
            //debugger;
            var tooltip = document.getElementById('WorkflowActionsUnderlyingPropertiesDialog_Tooltip').value;
            var javascript = document.getElementById('WorkflowActionsUnderlyingPropertiesDialog_JavaScript').value;

            for (var i = 0; i < this.options.store.Workflow.Steps.Step[stepIndex].Assign[rowIndex].Action.length; i++) {
                if (this.options.store.Workflow.Steps.Step[stepIndex].Assign[rowIndex].Action[i]["@Name"] == actionTitle) {
                    //debugger;
                    this.options.store.Workflow.Steps.Step[stepIndex].Assign[rowIndex].Action[i].Tooltip = tooltip;
                    this.options.store.Workflow.Steps.Step[stepIndex].Assign[rowIndex].Action[i]["@JavaScript"] = javascript;
                    //break;
                }
            }
            $('#divWorkflowActionsUnderlyingPropertiesDialog').dialog('close');
            this.checkIfWeHaveToDisplayThePublishChangesButton();
        } catch (e) {
            console.log('Exception in saveWorkflowActionsUnderlyingProperties(' + actionTitle + '): ' + e.message + ', ' + e.stack);
        }
    },
    insertEmailDataItem: function () {
        try {
            console.log('In insertEmailDataItem().');
            // Get the selected value.
            var selectedDataItem;
            $('#selectEmailDataItemPickerDialogDataItem').find('option:selected').each(function (index, element) {
                selectedDataItem = element.innerHTML;
            });
            // Close the dialog.
            $("#divEmailDataItemPickerDialog").dialog('close');
            // Update the email editor.
            var insertIndex = 0;
            var range = this.options.quill.getSelection();
            if (range) {
                if (range.length == 0) {
                    console.log('User cursor is at index', range.index);
                    insertIndex = range.index;
                } else {
                    var text = quill.getText(range.index, range.length);
                    console.log('User has highlighted: ', text);
                    insertIndex = range.index;
                }
            } else {
                console.log('User cursor is not in editor');
            }

            var html = '';
            //html += '<span style="">';
            html += '[' + selectedDataItem + ']';
            //html += '</span>';
            this.options.quill.insertText(insertIndex, html, {
                //'color': 'green',
                //'bold': true
            });


        } catch (e) {
            console.log('Exception in insertEmailDataItem(): ' + e.message + ', ' + e.stack);
        }
    },
    //saveEmailTemplateForStep: function (stepName) { // was named saveCollaborationTimeoutEmail 
    //    try {
    //        console.log('In saveEmailTemplateForStep(' + stepName + ').');
    //        var emailTemplate = this.options.quill.getText();
    //        for (var i = 0; i < this.options.store.Workflow.Steps.Step.length; i++) {
    //            if (this.options.store.Workflow.Steps.Step[i]["@Name"] == stepName) { //'Collaboration') {
    //                this.options.store.Workflow.Steps.Step[i]["@EmailTemplate"] = emailTemplate;
    //                $('#divConfigureEmailNotificationsDialog').dialog('close');
    //                this.checkIfWeHaveToDisplayThePublishChangesButton();
    //                break;
    //            }
    //        }
    //    } catch (e) {
    //        console.log('Exception in saveEmailTemplateForStep(' + stepName + '): ' + e.message + ', ' + e.stack);
    //    }
    //},
    renderAllParticipantsInThePeoplePicker: function (friendlyNameSourceField, idSourceField, emailSourceField, buttonToEnable) {
        try {
            $('#spanPeoplePickerParticipantsList').empty();

            //var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            //var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            //var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            //var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

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
    renderAllParticipantsInThePeoplePickerForJson: function (roleId, roleName, divisionIndex, groupIndex, entityIndex, locationIndex) {
        try {
            console.log('In renderAllParticipantsInThePeoplePickerForJson().');
            //alert('In renderAllParticipantsInThePeoplePickerForJson().');

            //var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            //var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            //var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            $('#spanPeoplePickerParticipantsList').empty();
            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,
                bwWorkflowAppId: workflowAppId
            };
            $.ajax({
                url: webserviceurl + "/workflow/participants",
                type: "POST",
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (result) {
                    try {
                        //alert('xcx66667: result.status: ' + result.status + ', result.message: ' + result.message);
                        if (result.status != 'SUCCESS') {

                            displayAlertDialog(result.message);

                        } else {

                            var data = result.BwWorkflowUsers;



                            var html = '';
                            for (var i = 0; i < data.length; i++) {
                                if (data[i].bwParticipantRole == 'emailrecipient') {
                                    // We don't want to display email recipients here.
                                } else {
                                    //html += '<a href="javascript:$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'cmdReturnParticipantIdToFieldForJson\', \'' + friendlyNameSourceField + '\', \'' + idSourceField + '\', \'' + emailSourceField + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantEmail + '\', \'' + buttonToEnable + '\');">' + data[i].bwParticipantFriendlyName + '&nbsp;&nbsp;<i>(' + data[i].bwParticipantEmail + ')</i></a>';


                                    html += '<a style="cursor:pointer !important;text-decoration:underline;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'cmdReturnParticipantIdToFieldForJson\', \'' + roleId + '\', \'' + roleName + '\', \'' + divisionIndex + '\', \'' + groupIndex + '\', \'' + entityIndex + '\', \'' + locationIndex + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantEmail + '\');">' + data[i].bwParticipantFriendlyName + '&nbsp;&nbsp;<i>(' + data[i].bwParticipantEmail + ')</i></a>';


                                    html += '<br />';
                                }
                            }
                            $('#spanPeoplePickerParticipantsList').append(html);

                        }

                    } catch (e) {
                        console.log('Exception in bwOrganizationEditor.js.renderAllParticipantsInThePeoplePickerForJson():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwOrganizationEditor.js.renderAllParticipantsInThePeoplePickerForJson():2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in bwOrganizationEditor.js.renderAllParticipantsInThePeoplePickerForJson():' + errorCode + ', ' + errorMessage);
                    displayAlertDialog('Error in bwOrganizationEditor.js.renderAllParticipantsInThePeoplePickerForJson():' + errorCode + ', ' + errorMessage);
                }
            });
        } catch (e) {
            console.log('Exception in bwOrganizationEditor.js.renderAllParticipantsInThePeoplePickerForJson(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwOrganizationEditor.js.renderAllParticipantsInThePeoplePickerForJson(): ' + e.message + ', ' + e.stack);
        }
    },
    cmdReturnParticipantIdToField: function (friendlyNameSourceField, idSourceField, emailSourceField, selectedParticipantFriendlyName, selectedParticipantId, selectedParticipantEmail, buttonToEnable) {
        try {
            debugger;
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
    cmdReturnParticipantIdToFieldForJson: function (roleId, roleName, divisionIndex, groupIndex, entityIndex, locationIndex, selectedParticipantFriendlyName, selectedParticipantId, selectedParticipantEmail) {
        try {
            // The people picker calls this and 
            //displayAlertDialog('You selected participant ' + selectedParticipantFriendlyName + ' to go in friendly name field ' + friendlyNameSourceField + '.\n\nThis functionality is incomplete. Coming soon!');
            //debugger;
            var json = this.options.store;
            var org;
            var roles;
            //debugger;
            if ((locationIndex && locationIndex != 'undefined') || locationIndex > -1) {
                org = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex];
            } else if ((entityIndex && entityIndex != 'undefined') || entityIndex > -1) {
                org = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex];
            } else if ((groupIndex && groupIndex != 'undefined') || groupIndex > -1) {
                org = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex];
            } else if ((divisionIndex && divisionIndex != 'undefined') || divisionIndex > -1) {
                if (divisionIndex == 'root') {
                    org = json.Global;
                } else {
                    org = json.Global.Divisions.Items[divisionIndex];
                }
            } else {
                debugger;
                alert('Error: Unexpected parameter in cmdReturnParticipantIdToFieldForJson().');
            }
            if (org.Roles) {
                for (var i = 0; i < org.Roles.length; i++) {
                    if (org.Roles[i].RoleId == roleId) {
                        // This is the one. Add the participant info here.
                        org.Roles[i].ParticipantId = selectedParticipantId;
                        org.Roles[i].ParticipantFriendlyName = selectedParticipantFriendlyName;
                        org.Roles[i].ParticipantEmail = selectedParticipantEmail;
                        org.Roles[i].ParticipantIsDirty = true; // Using this so we can go through and make sure the entries are made in the BwWorkflowUserRole table! 
                        org.Roles[i].ParticipantIsDirtyAction = 'ADDORUPDATE';
                    }
                }
            } else {
                var role = {
                    RoleId: roleId,
                    RoleName: roleName,
                    ParticipantId: selectedParticipantId,
                    ParticipantFriendlyName: selectedParticipantFriendlyName,
                    ParticipantEmail: selectedParticipantEmail,
                    ParticipantIsDirty: true, // Using this so we can go through and make sure the entries are made in the BwWorkflowUserRole table! 
                    ParticipantIsDirtyAction: 'ADDORUPDATE'
                };
                org.Roles = [];
                org.Roles.push(role);
            }


            // Render.
            var html = '';
            if (org.Roles && org.Roles.length) {
                for (var r = 0; r < org.Roles.length; r++) {
                    if (org.Roles[r].ParticipantIsDirty == true && org.Roles[r].ParticipantIsDirtyAction == 'REMOVE') {
                        // Do nothing. Don't display, this is just so that the user org role gets removed when published back to the server.
                        html += '<span style="color:tomato;">';
                        html += '*ROLE ' + org.Roles[r].RoleName + ' (' + org.Roles[r].RoleId + ') IS PENDING DELETION ON NEXT PUBLISH*';
                        html += '</span>';
                        html += '<br />';
                    } else {

                        html += org.Roles[r].RoleName + ' (' + org.Roles[r].RoleId + ') - ' + '<span style="cursor:pointer;" title="' + org.Roles[r].ParticipantEmail + '">' + org.Roles[r].ParticipantFriendlyName + '</span>';
                        var stepIndex = -1;
                        var roleIndex = -1;
                        html += '&nbsp;<img style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayPeoplePickerDialogForJson\', \'' + org.Roles[r].RoleId + '\', \'' + org.Roles[r].RoleName + '\', \'' + divisionIndex + '\', \'' + groupIndex + '\', \'' + entityIndex + '\', \'' + locationIndex + '\');" src="images/addressbook-icon18x18.png">';
                        html += '<br />';

                    }
                }
            } else {
                html += '<span style="color:tomato;">';
                html += '*NO ROLES SPECIFIED FOR THIS ORG*';
                html += '</span>';
                html += '<br />';
            }
            document.getElementById('spanSelectedRolesInRolePickerDropdown').innerHTML = html; // Display the selected roles.




            this.checkIfWeHaveToDisplayThePublishChangesButton();
            $('#PeoplePickerDialog').dialog('close');

        } catch (e) {
            console.log('Exception in cmdReturnParticipantIdToFieldForJson(): ' + e.message + ', ' + e.stack);
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
    renderOrgRolesDropDownList: function () {
        try {
            console.log('In renderOrgRolesDropDownList().');

            //var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            //var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            //var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            //var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            $.ajax({
                url: this.options.operationUriPrefix + "odata/OrgRolesConfiguration/" + workflowAppId + '/all',
                dataType: "json",
                contentType: "application/json",
                type: "Get"
            }).done(function (result) {
                try {
                    //debugger;
                    var html = '';
                    html += '<select style="padding:5px 5px 5px 5px;" id="orgRolesDropDown" onchange="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'OrgRolesDropDown_Onchange\');">';
                    for (var i = 0; i < result.value.length; i++) {
                        var isTheActiveOrgRoles = Boolean(result.value[i].bwOrgRolesActive);
                        if (isTheActiveOrgRoles) {
                            html += '<option value="' + result.value[i].bwOrgRolesId + '" selected>';
                            html += '>>>>> ACTIVE <<<<<   ';
                            html += result.value[i].Description + ' ----- [Created by ' + result.value[i].CreatedBy + ', ' + result.value[i].Created + ']';
                            html += '</option>';
                        } else {
                            html += '<option value="' + result.value[i].bwOrgRolesId + '" >';
                            html += result.value[i].Description + ' ----- [Created by ' + result.value[i].CreatedBy + ', ' + result.value[i].Created + ']';
                            html += '</option>';
                        }
                    }
                    html += '</select>';
                    document.getElementById('spanOrgRolesDropDownList').innerHTML = html;
                } catch (e) {
                    console.log('Exception in renderOrgRolesDropDownList().done: ' + e.message + ', ' + e.stack);
                }
            }).fail(function (data, errorCode) {

                //lpSpinner.Hide();
                console.log('In xx.fail(): ' + JSON.stringify(data));
                var msg;
                if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                } else {
                    msg = JSON.stringify(data);
                }
                alert('Exception in bwOrganizationEditor.js.renderOrgRolesDropDownList().xx.Get: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                console.log('Exception in bwOrganizationEditor.js.renderOrgRolesDropDownList().xx.Get: ' + JSON.stringify(data));
                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                //var error = JSON.parse(data.responseText)["odata.error"];
                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            });
        } catch (e) {
            console.log('Exception in renderOrgRolesDropDownList(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderOrgRolesDropDownList(): ' + e.message + ', ' + e.stack);
        }
    },
    renderSelectRoleOrPersonSection: function (elementId) {
        try {
            console.log('In renderSelectRoleOrPersonSection().');
            var thiz = this;

            //var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            //var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            //var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            //var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            var selectRoleOrPersonCell = $('.selectroleorperson-editcell');
            var stepIndex = elementId.split('_')[1]; // eg: 3
            var roleIndex = elementId.split('_')[2]; // eg: 8
            // Populate the "Roles" drop down.

            $.ajax({
                url: this.options.operationUriPrefix + "odata/Roles?$filter=IsWorkflowRole eq true",
                dataType: "json",
                contentType: "application/json",
                type: "Get",
                timeout: this.options.ajaxTimeout
            }).done(function (result) {
                try {
                    // We need to get the workflowAppId, as well as roleId in order to get the list of users who belong to the role.
                    var roles;
                    if (result) {
                        roles = result.value;
                    } else {
                        console.log('In renderSelectRoleOrPersonSection().Get[odata/Roles].done: result: ' + JSON.stringify(result));
                    }

                    var html = '';
                    //html += '<td class="steprowcell">';

                    //html += '<span class="selectarow-labeltext">Select a role:</span>';
                    //html += '<br />';

                    //html += ' <img style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayPeoplePickerDialog\', \'' + 'txtApprover2FriendlyName' + '\', \'' + 'txtApprover2Id' + '\', \'' + 'txtApprover2Email' + '\');" src="images/addressbook-icon18x18.png">';
                    //html == '&nbsp;&nbsp;';

                    var rolename = $('#' + elementId).find('.rolename').attr('bwOldValue');
                    var roleId = $('#' + elementId).find('.rolename').attr('bwRoleId');
                    html += '<select style="padding:5px 5px 5px 5px;" id="selectRoleName"  onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'RoleDropDown_Onchange\', \'' + 'selectRoleName' + '\');">';
                    html += '  <option value=""></option>';
                    for (var i = 0; i < roles.length; i++) {
                        if (rolename == roles[i].RoleName) {
                            html += '  <option value="' + roles[i].RoleId + '" selected >' + roles[i].RoleName + '</option>';
                        } else {
                            html += '  <option value="' + roles[i].RoleId + '">' + roles[i].RoleName + '</option>';
                        }
                    }
                    html += '</select>';

                    html += '&nbsp;<input style="padding:5px 10px 5px 10px;" id="btnCreateRole2" type="button" value="xcx2Edit Roles..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayCreateANewRoleDialog\');" />';
                    //html += '<br />[display role member(s)]';


                    html += '<br />';
                    //html += '<input id="txtRoleMembersFriendlyName_' + stepIndex + '_' + roleIndex + '" style="width:150px;color:grey;font-style:italic;" type="text" value=" [display role member(s)]" />';

                    var orgId1 = 'ALL'; // using ALL until we build in the multiple locations support.
                    $.ajax({
                        url: thiz.options.operationUriPrefix + "odata/UserRole/" + workflowAppId + "/" + orgId1 + "/" + roleId, // pass workflowAppId, as well as roleId in order to get the list of users who belong to the role.
                        dataType: "json",
                        contentType: "application/json",
                        type: "Get",
                        timeout: thiz.options.ajaxTimeout
                    }).done(function (result) {
                        try {

                            //
                            // Display the role members!!!<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                            //

                            html += '<input style="padding:5px 5px 5px 5px;" id="txtRoleMembersFriendlyName_' + stepIndex + '_' + roleIndex + '" style="width:150px;color:grey;font-style:italic;" type="text" value=" [select role member(s)]" />';



                            //html += '<input id="txtRoleMembersFriendlyName_' + stepIndex + '_' + roleIndex + '" style="width:150px;color:grey;font-style:italic;" type="text" value=" ' + roleMembersHtml + '" />';






                            html += '<input id="txtRoleMembersId_' + stepIndex + '_' + roleIndex + '" style="display:none;" />';
                            html += '<input id="txtRoleMembersEmail_' + stepIndex + '_' + roleIndex + '" style="display:none;" />';


                            html += '&nbsp;<img style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayPeoplePickerDialog\', \'' + 'txtRoleMembersFriendlyName_' + stepIndex + '_' + roleIndex + '' + '\', \'' + 'txtRoleMembersId_' + stepIndex + '_' + roleIndex + '' + '\', \'' + 'txtRoleMembersEmail_' + stepIndex + '_' + roleIndex + '' + '\');" src="images/addressbook-icon18x18.png">';
                            html += '&nbsp;<input style="padding:5px 10px 5px 10px;" id="btnCreateRole1" type="button" value="New Person..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayAddANewPersonDialog\');" />';


                            if (participantId) { // Only display when logged in. We need to do more work here!!
                                if (result.length > 0) {
                                    var roleMembersHtml = '';
                                    roleMembersHtml += '<br /><span style="color:darkgrey;">Role Member(s):<ul>';
                                    for (var i = 0; i < result.length; i++) {
                                        //roleMembersHtml += '<br />' + String(i + 1) + ': ' + result[i].bwParticipantFriendlyName;
                                        roleMembersHtml += '<li title="' + result[i].bwParticipantEmail + '">' + result[i].bwParticipantFriendlyName;
                                        //roleMembersHtml += '<span style="cursor:pointer;" onclick="alert(\'This functionality is incomplete. Coming soon!trashbinx\');">&nbsp;&#128465;</span></li>';
                                        roleMembersHtml += '<span style="cursor:pointer;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'DeleteRoleMember\', \'' + elementId + '\', \'' + result[i].bwParticipantId + '\');">&nbsp;&#128465;</span></li>';
                                    }
                                    roleMembersHtml += '</ul></span>';
                                    //html == '<br />';
                                    html += roleMembersHtml;
                                    //html == '<br />';
                                }
                            }

                            //html += '<br />or create a new role:'; //<br /><input id="textNewRoleName" type="text" style="width:210pt;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewRoleTextBox_Onkeyup\', \'' + 'textNewRoleName' + '\');" />';
                            //html += '<br /><input id="btnCreateRole2" type="button" value="Create a Role..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayCreateANewRoleDialog\');" />';

                            //html += '<br />or select a person:'; //<br /><input id="textNewRoleId" type="text" style="width:75pt;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewRoleTextBox_Onkeyup\', \'' + 'textNewRoleId' + '\');" />';
                            //html += '<br /><img style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayPeoplePickerDialog\', \'' + 'txtApprover2FriendlyName' + '\', \'' + 'txtApprover2Id' + '\', \'' + 'txtApprover2Email' + '\');" src="images/addressbook-icon18x18.png">';
                            //html == '&nbsp;&nbsp;';
                            //html += '<input id="btnCreateRole1" type="button" value="Select Person..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayPeoplePickerDialog\', \'' + 'txtApprover2FriendlyName' + '\', \'' + 'txtApprover2Id' + '\', \'' + 'txtApprover2Email' + '\');" />';

                            //html += '<br />or add a new person:'; //<br /><input id="textNewRoleId" type="text" style="width:75pt;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewRoleTextBox_Onkeyup\', \'' + 'textNewRoleId' + '\');" />';
                            //html += '<br /><input id="btnCreateRole1" type="button" value="Add a Person..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayAddANewPersonDialog\');" />';

                            //html += '</td > ';

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
                } catch (e) {
                    console.log('Exception in renderSelectRoleOrPersonSection()[odata/Roles].done: ' + e.message + ', ' + e.stack);
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
                alert('Error in renderSelectRoleOrPersonSection().Get[odata/Roles].fail: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                console.log('Error in renderSelectRoleOrPersonSection().Get[odata/Roles].fail:' + JSON.stringify(data));
                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                //var error = JSON.parse(data.responseText)["odata.error"];
                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            });
        } catch (e) {
            console.log('Exception in renderSelectRoleOrPersonSection(): ' + e.message + ', ' + e.stack);
        }
    },
    renderActionsSection: function (elementId) {
        try {
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

            if (selectedRoleCategory != 'Inform' && selectedRoleCategory != 'Collaborator' && selectedRoleCategory != 'Approver') {
                selectedRoleCategory = 'Inform'; // Thismakes it the default when it is not present.
            }

            if (selectedRoleCategory == 'Inform') {
                actionsCell.html(html);
            } else if (selectedRoleCategory == 'Collaborator') {


                // TO-DO: WHEN "Collaborator" has been selcted, a timeout can be specified. Display this option!!!!!!!!!!!!!!!!!!!!!!<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<,,


                actionsCell.html(html);
            } else if (selectedRoleCategory == 'Approver') {
                // Display the Actions/Tasks pickers... TO-DO: REMEMBER TO COME BACK AND POPULATE existing values. eg: If the user toggles the drop down, these values get lost..... <<<<<<<<<<<<<<<<<<<<<<<<<<<<
                var actions = ['Approve', 'Cancel', 'Decline', 'Revise/Hold'];
                var x = elementId.split('_')[1];
                var step = x.split('_')[0];
                var row = elementId.split('_')[2];
                for (var i = 0; i < actions.length; i++) {
                    var checkboxId = 'Action-' + actions[i] + '_' + step + '_' + row;
                    var childCheckboxId = 'RequireComments-' + actions[i] + '_' + step + '_' + row;
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

    renderTheCondReadOnly: function (cond) {
        try {
            console.log('In bwOrganizationEditor.renderTheCondReadOnly().');
            // this is a placeholder!!! hardcoded
            var result = '';
            if (true) {
                //result += 'In bwOrganizationEditor.renderTheCondReadOnly().'; // uncomment this if wanting to put this section back!!
            } else {
                if (cond && cond.trim() != '') {
                    // This is where we parse the cond and make it look the the editable one, but read only!!!!
                    var conditionString = cond;


                    var selectedRoleCategory;
                    $('#selectRoleCategory').find('option:selected').each(function (index, element) {
                        selectedRoleCategory = element.value;
                    });
                    //var conditionCell = $('.conditions-editcell');
                    //if (elementId == 'undefined') {
                    //    elementId = conditionCell.attr('id');
                    //}
                    //console.log('In renderTheCondReadOnly. elementId: ' + elementId + ', conditionString: ' + conditionString);




                    var html = '';
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

                    //if (html2 != '') {
                    //    html += '<span style="color:gray;font-style:italic;">This role is a subject matter expert in these areasx:</span><br />';
                    //    html += html2;
                    //    html += '<hr>';
                    //}

                    //html += '<br />';This role is required to complete the following checklist(s):





                    //html += '<span style="color:gray;font-style:italic;">This role contributes to these parts of the company:</span>';

                    //// Render the "Cond".
                    //html += '  <span id="spanConditionEditorContents" style="visibility:hidden;display:none;">';
                    //if (conditionString) html += conditionString;
                    //html += '  </span>';


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




                    // Render the "Cond".
                    if (conditionString.indexOf('$ChecklistsRequired~') > -1) {
                        html += '<hr>';
                        html += '<span style="color:gray;font-style:italic;">This role is required to complete the following checklist(s):</span><br />';
                        var checklists = [];
                        for (var i = 0; i < this.options.Checklists.length; i++) {
                            var checklist = { bwChecklistTemplatesId: JSON.parse(this.options.Checklists[i].ChecklistJson).bwChecklistTemplatesId, Title: JSON.parse(this.options.Checklists[i].ChecklistJson).Title };
                            checklists.push(checklist);
                        }
                        checklists.sort(function (a, b) {
                            if (a.Title < b.Title) { return -1; }
                            if (a.Title > b.Title) { return 1; }
                            return 0;
                        });
                        for (var i = 0; i < checklists.length; i++) {
                            if (conditionString.indexOf(checklists[i].bwChecklistTemplatesId) > -1) {
                                html += '<span style="white-space:nowrap;">';
                                html += '<input id="cbChecklistRequired_' + checklists[i].bwChecklistTemplatesId + '" type="checkbox" onclick="return false;" checked="" />&nbsp;' + checklists[i].Title + '&nbsp;';
                                html += '<span style="font-style:italic;"></span>';
                                html += '</span>';
                                html += '<br />';
                            }
                        }

                    }

                    result += html;
                } else {
                    // do nothing.
                    alert('??xx?? elaborate here devs pls');
                }
            }
            return result;
        } catch (e) {
            var msg = 'Exception in renderTheCondReadOnly(): ' + e.message + ', ' + e.stack;
            console.log('Exception in renderTheCondReadOnly(): ' + e.message + ', ' + e.stack);
            return msg;
        }
    },
    renderConditionsSection: function (elementId, conditionString) {
        try {
            console.log('In bwOrganizationEditor.renderConditionsSection().');
            // this is a placeholder!!! hardcoded
            var html = '';
            if (true) {
                html += 'In bwOrganizationEditor.renderConditionsSection().';
            } else {
                var selectedRoleCategory;
                $('#selectRoleCategory').find('option:selected').each(function (index, element) {
                    selectedRoleCategory = element.value;
                });
                var conditionCell = $('.conditions-editcell');
                if (elementId == 'undefined') {
                    elementId = conditionCell.attr('id');
                }
                console.log('In renderConditionsSection. elementId: ' + elementId + ', conditionString: ' + conditionString);



                // Display this section
                if (selectedRoleCategory == 'Inform') {
                    html += '<span style="color:gray;font-style:italic;">This role will be informed about these areas:</span><br />';
                } else {
                    html += '<span style="color:gray;font-style:italic;">This role is a subject matter expert in these areas:</span><br />';
                }

                // Is Exec
                if (conditionString) {
                    // We have to parse out "isExec" here.
                    var isExec = conditionString.split('$IsExec=')[1];
                    console.log('isExec: ' + isExec);
                    if (isExec && isExec.indexOf('&') > -1) {
                        isExec = isExec.split('&')[0];
                    }
                }
                if (isExec && isExec == 'True') {
                    html += '<span style="white-space:nowrap;"><input id="cbIsExec" type="checkbox" checked onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isExecCondition_CheckChanged\');" />&nbsp;' + 'Exec' + '&nbsp;</span>';
                } else {
                    html += '<span style="white-space:nowrap;"><input id="cbIsExec" type="checkbox" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isExecCondition_CheckChanged\');" />&nbsp;' + 'Exec' + '&nbsp;</span>';
                }
                html += '&nbsp;';
                // Is Legal
                if (conditionString) {
                    // We have to parse out "IsLegal" here.
                    var isLegal = conditionString.split('$IsLegal=')[1];
                    if (isLegal && isLegal.indexOf('&') > -1) {
                        isLegal = isLegal.split('&')[0];
                    }
                }
                if (isLegal && isLegal == 'True') {
                    html += '<span style="white-space:nowrap;"><input id="cbIsLegal" type="checkbox" checked onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isLegalCondition_CheckChanged\');" />&nbsp;' + 'Legal' + '&nbsp;</span>';
                } else {
                    html += '<span style="white-space:nowrap;"><input id="cbIsLegal" type="checkbox" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isLegalCondition_CheckChanged\');" />&nbsp;' + 'Legal' + '&nbsp;</span>';
                }
                html += '&nbsp;';
                // Is Lease
                if (conditionString) {
                    // We have to parse out "isLease" here.
                    var isLease = conditionString.split('$IsLease=')[1];
                    if (isLease && isLease.indexOf('&') > -1) {
                        isLease = isLease.split('&')[0];
                    }
                }
                if (isLease && isLease == 'True') {
                    html += '<span style="white-space:nowrap;"><input id="cbIsLease" type="checkbox" checked onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isLeaseCondition_CheckChanged\');" />&nbsp;' + 'Lease' + '&nbsp;</span>';
                } else {
                    html += '<span style="white-space:nowrap;"><input id="cbIsLease" type="checkbox" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isLeaseCondition_CheckChanged\');" />&nbsp;' + 'Lease' + '&nbsp;</span>';
                }
                html += '&nbsp;';
                // Is IT
                html += '&nbsp;';
                html += '<span style="white-space:nowrap;"><input type="checkbox" disabled />&nbsp;' + 'IT' + '&nbsp;<span style="font-style:italic;"></span></span>';
                // Is H&S 
                html += '&nbsp;';
                html += '<span style="white-space:nowrap;"><input type="checkbox" disabled />&nbsp;' + 'H&S' + '&nbsp;<span style="font-style:italic;"></span></span>';
                // Is Compliance
                html += '&nbsp;';
                html += '<span style="white-space:nowrap;"><input type="checkbox" disabled />&nbsp;' + 'Compliance' + '&nbsp;<span style="font-style:italic;"></span></span>';
                // Is Audit
                html += '&nbsp;';
                html += '<span style="white-space:nowrap;"><input type="checkbox" disabled />&nbsp;' + 'Audit' + '&nbsp;<span style="font-style:italic;"></span></span>';

                html += '<hr>';



                html += '<span style="color:gray;font-style:italic;">This role contributes to these parts of the company:</span><br />';

                // Render the "Cond".
                html += '  <span id="spanConditionEditorContents" style="visibility:hidden;display:none;">';
                if (conditionString) html += conditionString;
                html += '  </span>';

                html += '<span style="cursor:pointer;color:red;text-decoration:underline;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayOrgMultiPicker\', \'' + this.id + '\');">Location(s)</span>';
                html += '&nbsp;&nbsp;&nbsp;&nbsp;';
                html += '<span style="cursor:pointer;color:red;text-decoration:underline;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayProjectTypeMultiPicker\', \'' + this.id + '\');">Functional area(s)</span>';
                html += '&nbsp;&nbsp;&nbsp;&nbsp;';
                html += '<span style="cursor:pointer;color:red;text-decoration:underline;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayPillarMultiPicker\', \'' + this.id + '\');">Growth</span>';

                // Display the checklists.
                if (selectedRoleCategory == 'Approver' || selectedRoleCategory == 'Collaborator') {
                    html += '<hr>';
                    html += '<span style="color:gray;font-style:italic;">This role is required to complete the following checklist(s)x:</span><br />';
                    if (this.options.Checklists) {
                        // Todd: This is a bit messy and the result of maybe not getting from the database in the best way. Good for now but could maybe improved someday... think through thoroughly first!
                        var checklists = [];
                        for (var i = 0; i < this.options.Checklists.length; i++) {
                            var checklist = { bwChecklistTemplatesId: JSON.parse(this.options.Checklists[i].ChecklistJson).bwChecklistTemplatesId, Title: JSON.parse(this.options.Checklists[i].ChecklistJson).Title };
                            checklists.push(checklist);
                        }
                        checklists.sort(function (a, b) {
                            if (a.Title < b.Title) { return -1; }
                            if (a.Title > b.Title) { return 1; }
                            return 0;
                        });
                        for (var i = 0; i < checklists.length; i++) {
                            html += '<span style="white-space:nowrap;">';

                            // Decide whether to check the checkbox.
                            if (conditionString) {
                                if (conditionString.indexOf(checklists[i].bwChecklistTemplatesId) > -1) {
                                    html += '<input id="cbChecklistRequired_' + checklists[i].bwChecklistTemplatesId + '" type="checkbox" checked="" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isChecklistRequired_CheckChanged\', \'' + checklists[i].bwChecklistTemplatesId + '\');" />';
                                    html += '&nbsp;' + checklists[i].Title + '&nbsp;';
                                } else {
                                    html += '<input id="cbChecklistRequired_' + checklists[i].bwChecklistTemplatesId + '" type="checkbox" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isChecklistRequired_CheckChanged\', \'' + checklists[i].bwChecklistTemplatesId + '\');" />';
                                    html += '&nbsp;' + checklists[i].Title + '&nbsp;';
                                }
                            } else {
                                html += '<input id="cbChecklistRequired_' + checklists[i].bwChecklistTemplatesId + '" type="checkbox" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isChecklistRequired_CheckChanged\', \'' + checklists[i].bwChecklistTemplatesId + '\');" />';
                                html += '&nbsp;' + checklists[i].Title + '&nbsp;';
                            }
                            html += '<input style="padding:5px 10px 5px 10px;" type="button" value="Edit Checklist" onclick="populateStartPageItem(\'divChecklistsSettings\', \'Reports\', \'' + i + '\');" />';

                            //html += '<span style="font-style:italic;"></span>';
                            html += '<span style="cursor:pointer;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'DeleteChecklist\', \'' + elementId + '\', \'' + checklists[i].bwChecklistTemplatesId + '\');">&nbsp;&#128465;</span>';

                            html += '</span>';
                            html += '<br />';
                        }
                    } else {
                        html += '[no checklists found]';
                    }
                }
            }
            conditionCell.html(html);
        } catch (e) {
            console.log('Exception in renderConditionsSection(): ' + e.message + ', ' + e.stack);
        }
    },
    DeleteChecklist: function (elementId, bwChecklistTemplatesId) {
        try {
            console.log('In DeleteChecklist(). elementId: ' + elementId + ', bwChecklistTemplatesId: ' + bwChecklistTemplatesId);
            var stepIndex = elementId.split('_')[1]; // eg: 3
            var roleIndex = elementId.split('_')[2]; // eg: 8

            //var cond = this.options.store.DraftWorkflow.Steps.Step[stepIndex].Assign[roleIndex]["@Cond"];
            //spanConditionEditorContents
            var cond = document.getElementById('spanConditionEditorContents').innerHTML;
            // $ChecklistsRequired~becef88f-f43c-4e82-9ff8-0fd4d16b9555,f830e44a-d29f-4261-80c6-756236355e96,f2ac3575-ca0b-4a85-9708-c1cb6eb4929d,f2ac3575-ca0b-4a85-9708-c1cb6eb4929d,becef88f-f43c-4e82-9ff8-0fd4d16b9555,f830e44a-d29f-4261-80c6-756236355e96

            String.prototype.replaceAll = function (search, replacement) {
                var target = this;
                return target.replace(new RegExp(search, 'g'), replacement);
            };

            if (cond) {
                cond = cond.replaceAll('&amp;', '&'); // Not sure why but the encoding gets messed somewhere along the way.
            }

            console.log('In DeleteChecklist(). This functionality is incomplete. Coming soon! cond: ' + cond);

            if (confirm("Are you certain you wish delete ALL CHECKLISTS??? (this checklist?)")) {
                //debugger;
                var newCond;
                var prefix = cond.split('$ChecklistsRequired~')[0];
                if (prefix.substring(prefix.length - 1) == '&') prefix = prefix.substring(0, prefix.length - 1); // Remove the trailing '&' (ampersand).
                var suffix = cond.split('$ChecklistsRequired~')[1].split('&')[1];
                if (suffix) {
                    newCond = prefix + suffix;
                } else {
                    newCond = prefix;
                }
                //this.options.store.DraftWorkflow.Steps.Step[stepIndex].Assign[roleIndex]["@Cond"] = result;
                debugger;
                //document.getElementById('spanConditionEditorContents').innerHTML = result;
                this.renderConditionsSection(elementId, newCond);
            }

        } catch (e) {
            console.log('Exception in DeleteChecklist(): ' + e.message + ', ' + e.stack);
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
            console.log('In RoleCategoryDropDown_Onchange(). elementId: ' + elementId);
            this.renderActionsSection(elementId);
            //this.renderTimeoutSection(elementId);
            this.renderConditionsSection(elementId);
        } catch (e) {
            console.log('Exception in RoleCategoryDropDown_Onchange(): ' + e.message + ', ' + e.stack);
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
    OrgRolesDropDown_Onchange: function () {
        try {
            // This enables the "Activate" button when the ">>>Active<<<" workflow is not selected.
            debugger;
            var selected;
            $('#orgRolesDropDown').find('option:selected').each(function (index, element) {
                selected = element.innerHTML;
            });
            console.log('In OrgRolesDropDown_Onchange(). selected: ' + selected);
            if (selected.indexOf('ACTIVE') > -1) {
                document.getElementById('btnActivateOrgRolesConfiguration').disabled = true;
            } else {
                document.getElementById('btnActivateOrgRolesConfiguration').disabled = false;
            }
        } catch (e) {
            console.log('Exception in OrgRolesDropDown_Onchange(): ' + e.message + ', ' + e.stack);
        }
    },
    WorkflowRequestTypeDropDown_Onchange: function (elementId) {
        try {
            console.log('In bwOrganizationEditor.js.WorkflowRequestTypeDropDown_Onchange().');

            this.options.CurrentWorkflow = null; // We are going to get a new one below...

            this.renderWorkflowPeoplePicker('spanWorkflowPeoplePicker_right');

        } catch (e) {
            console.log('Exception in WorkflowRequestTypeDropDown_Onchange(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in WorkflowRequestTypeDropDown_Onchange(): ' + e.message + ', ' + e.stack);
        }
        //try {
        //    console.log('In WorkflowRequestTypeDropDown_Onchange().');
        //    document.getElementById(elementId).selectedIndex = 0; // This just forces it to always be the top selection for the time being.
        //    alert('This functionality is incomplete. Coming soon! This functionality will provide a workflow for each budget request type.');

        //    //// This enables the "Activate" button when the ">>>Active<<<" workflow is not selected.
        //    //var selected;
        //    //$('#workflowsDropDown').find('option:selected').each(function (index, element) {
        //    //    selected = element.innerHTML;
        //    //});
        //    //console.log('In WorkflowRequestTypeDropDown_Onchange(). selected: ' + selected);
        //    //if (selected.indexOf('ACTIVE') > -1) {
        //    //    document.getElementById('btnActivateRaciConfiguration').disabled = true;
        //    //} else {
        //    //    document.getElementById('btnActivateRaciConfiguration').disabled = false;
        //    //}
        //} catch (e) {
        //    console.log('Exception in WorkflowRequestTypeDropDown_Onchange(): ' + e.message + ', ' + e.stack);
        //}
    },
    WorkflowForAllRequestTypesCheckbox_Onchange: function () {
        try {
            console.log('In WorkflowForAllRequestTypesCheckbox_Onchange().');
            document.getElementById('WorkflowForAllRequestTypesCheckbox').checked = true; // This just forces it to always be checked for the time being.
            alert('In WorkflowForAllRequestTypesCheckbox_Onchange(). This functionality is incomplete. Coming soon! This functionality will allow a workflow for each budget request type.');

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
                document.getElementById('btnsaveOrgRolesConfigurationAndActivateAndUpdateParticipants').disabled = false;
            } else {
                document.getElementById('btnsaveOrgRolesConfigurationAndActivateAndUpdateParticipants').disabled = true;
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
        window.onscroll = function () { window.scrollTo(x, y); };
    },
    enableScrolling: function () {
        window.onscroll = function () { };
    },
    moveStepUp: function (step) {
        try {
            console.log('moveStepUp(). step: ' + step);
            alert('In moveStepUp(). Moving this step down will impact all of the budget requests. step: ' + step);

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
            console.log('Exception in moveStepUp(): ' + e.message + ', ' + e.stack);
        }
    },
    moveStepDown: function (step) {
        try {
            console.log('moveStepDown(). step: ' + step);
            alert('In moveStepDown(). Moving this step down will impact all of the budget requests. step: ' + step);

            var stepJson;
            for (var i = 0; i < this.options.store.RaciSteps.length; i++) {
                if (this.options.store.RaciSteps[i].StepName == step) {
                    selectedIndex = i;
                    stepJson = this.options.store.RaciSteps[i]; // Save the step
                    console.log('In moveStepDown(). selectedIndex: ' + selectedIndex + ', stepJson: ' + JSON.stringify(stepJson));
                    //this.options.store.splice(i + 1, 0, stepJson); // reinsert the step
                    //delete this.options.store.RaciSteps[i]; // delete the step
                    //
                }
            }
            alert('In moveStepDown(). this.options.store: ' + JSON.stringify(this.options.store));
            this._create();
        } catch (e) {
            console.log('Exception in moveStepDown(): ' + e.message + ', ' + e.stack);
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

    isChecklistRequired_CheckChanged: function (bwChecklistTemplatesId) {
        try {
            console.log('In isChecklistRequired_CheckChanged(). bwChecklistTemplatesId: ' + bwChecklistTemplatesId);
            var oldConditionString = document.getElementById('spanConditionEditorContents').innerHTML.trim().replace(/&amp;/g, '&'); // Changes &amp; to &. DecodeURI doesn't work! weird!
            var newConditionString = '';
            var oldConditionsArray = oldConditionString.split('&');
            var x = [];
            for (var i = 0; i < oldConditionsArray.length; i++) {
                if (oldConditionsArray[i].indexOf('$ChecklistsRequired~') > -1) {
                    // do nothing.
                } else {
                    x.push(oldConditionsArray[i]);
                }
            }
            // reassemble
            for (var i = 0; i < x.length; i++) {
                newConditionString += x[i];
            }
            //
            // Now we just have to create the $ChecklistsRequired~ string and add it to the newConditionString.
            //
            if (document.getElementById('cbChecklistRequired_' + bwChecklistTemplatesId).checked) {
                // The checkbox has been selected.
                if (oldConditionString.indexOf('$ChecklistsRequired~') > -1) {
                    // We already have the entry, so add the checklist guid.
                    var newCond = oldConditionString.split('$ChecklistsRequired~')[1].split('&')[0];
                    newCond += ',' + bwChecklistTemplatesId;
                    if (newConditionString.length > 0) {
                        newConditionString += '&' + '$ChecklistsRequired~' + newCond;
                    } else {
                        newConditionString += '$ChecklistsRequired~' + newCond;
                    }
                } else {
                    // We don't have the entry, so we have to add it.
                    if (newConditionString.length > 0) {
                        newConditionString += '&' + '$ChecklistsRequired~' + bwChecklistTemplatesId;
                    } else {
                        newConditionString += '$ChecklistsRequired~' + bwChecklistTemplatesId;
                    }
                }
            } else {
                // The checkbox is not selected, so make sure the condition string does not have this checklist entry.
                if (oldConditionString.indexOf(bwChecklistTemplatesId) > -1) {
                    var checklistArray = (oldConditionString.split('$ChecklistsRequired~')[1].split('&')[0]).split(',');
                    var newChecklistArray = [];
                    for (var x = 0; x < checklistArray.length; x++) {
                        if (checklistArray[x] != bwChecklistTemplatesId) {
                            newChecklistArray.push(checklistArray[x]);
                        }
                    }
                    var newCond = newChecklistArray.join(); // Creates a comma separated string.
                    if (newCond.length > 0) {
                        if (newConditionString.length > 0) {
                            newConditionString += '&' + '$ChecklistsRequired~' + newCond;
                        } else {
                            newConditionString += '$ChecklistsRequired~' + newCond;
                        }
                    }
                }
            }
            document.getElementById('spanConditionEditorContents').innerHTML = newConditionString;
        } catch (e) {
            console.log('Exception in isChecklistRequired_CheckChanged(): ' + e.message + ', ' + e.stack);
        }
    },

    isExecCondition_CheckChanged: function (elementId) {
        try {
            console.log('In isExecCondition_CheckChanged(). elementId: ' + elementId);
            var oldConditionString = document.getElementById('spanConditionEditorContents').innerHTML.trim().replace(/&amp;/g, '&'); // Changes &amp; to &. DecodeURI doesn't work! weird!
            //
            var newConditionString = '';
            var oldConditionsArray = oldConditionString.split('&');
            var x = [];
            for (var i = 0; i < oldConditionsArray.length; i++) {
                if (oldConditionsArray[i].indexOf('$IsExec=') > -1) {
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
            if (document.getElementById('cbIsExec').checked) {
                // The checkbox has been selected.
                if (oldConditionString.indexOf('$IsExec=True') > -1) {
                    // do nothing
                } else {
                    // We don't have the entry, so we have to add it.
                    if (newConditionString.length > 0) {
                        newConditionString += '&' + '$IsExec=True';
                    } else {
                        newConditionString += '$IsExec=True';
                    }
                }
            } else {
                // The checkbox is not selected, so make sure the condition string does not have this checklist entry.
                var checklistArray = (oldConditionString.split('$IsExec=')[1].split('&')[0]).split(',');
                var newChecklistArray = [];
                for (var x = 0; x < checklistArray.length; x++) {
                    if (checklistArray[x] != '$IsExec=True') {
                        newChecklistArray.push(checklistArray[x]);
                    }
                }
            }
            document.getElementById('spanConditionEditorContents').innerHTML = newConditionString;
        } catch (e) {
            console.log('Exception in isExecCondition_CheckChanged(): ' + e.message + ', ' + e.stack);
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
                    var x = { OrgId: orgId, Name: orgName };
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
                    var x = { ProjectTypeId: projectTypeId, Name: projectTypeName };
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
                    var x = { PillarId: pillarId, Name: pillarName };
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

    //displayAlertDialog: function (errorMessage) {
    //    try {
    //        document.getElementById('spanErrorMessage').innerHTML = errorMessage;
    //        $("#divAlertDialog").dialog({
    //            modal: true,
    //            resizable: false,
    //            //closeText: "Cancel",
    //            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
    //            //title: 'Add a New Person',
    //            width: '800',
    //            dialogClass: "no-close", // No close button in the upper right corner.
    //            hide: false, // This means when hiding just disappear with no effects.
    //            open: function () {
    //                $('.ui-widget-overlay').bind('click', function () {
    //                    $("#divAlertDialog").dialog('close');
    //                });
    //            },
    //            close: function () {
    //                //$(this).dialog('destroy').remove();
    //            }
    //        });
    //        $("#divAlertDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
    //    } catch (e) {
    //        console.log('Exception in WorkflowEditor.js.displayAlertDialog(): ' + e.message + ', ' + e.stack);
    //    }
    //}

});