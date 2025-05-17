//$.widget("bw.bwLocationEditor", {
//    options: {
//        value: 0,
//        json: null,
//        jsonTreeState: null,
//        workflow: null, // Storing it here so we can use it to see which roles are available. I think the workflow should be the origin for roles, but we will see if that is the case in the end... :)
//        //store: null,
//        Checklists: null,
//        bwTenantId: null,
//        bwWorkflowAppId: null,
//        bwEnabledRequestTypes: null, // An array of the following: ['Budget Request', 'Quote Request', 'Reimbursement Request', 'Recurring Expense', 'Capital Plan Project', 'Work Order']
//        operationUriPrefix: null,
//        ajaxTimeout: 15000,
//        quill: null,
//        displayWorkflowPicker: false,
//        displayRoleIdColumn: false,
//        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
//    },
//    _create: function (assignmentRowChanged_ElementId) {
//        this.element.addClass("bwLocationEditor");
//        var thiz = this; // Need this because of the asynchronous operations below.
//        //debugger;
//        try {
//            if (this.options.operationUriPrefix == null) {
//                // This formulates the operationUri, which is used throughout.
//                var url1 = window.location.href.split('https://')[1];
//                var url2 = url1.split('/')[0];
//                this.options.operationUriPrefix = 'https://' + url2 + '/';
//            }
//            //
//            if (this.options.jsonTreeState != null) {
//                // this.options.store is populated, so just render the raci.
//                //debugger;
//                this.element.html(this.renderLocationEditor(assignmentRowChanged_ElementId)); // Render the org chart.
//            } else {
//                // this.options.store was null, so go get it from the database.
//                //var workflowAppId = 0;
//                //debugger;
//                //if (!workflowAppId.length) var workflowAppId = 0;

//                var json = {
//                    Divisions: {
//                        Style: 'display:block;',
//                        Items: [{
//                            Name: 'Division 1',
//                            Abbreviation: 'DIV1',
//                            Id: 'xxxx-xxx-xcxccx-xxxxxx1',
//                            Style: 'display:block;',
//                            Groups: {
//                                Style: 'display:block;',
//                                Items: [{
//                                    Name: 'Group 1',
//                                    Abbreviation: 'GRP1',
//                                    Id: 'xxxx-xxx-xcxccx-xxxxxx2',
//                                    Style: 'display:block;',
//                                    LegalEntities: {
//                                        Style: 'display:block;',
//                                        Items: [
//                                        {
//                                            Name: 'Legal Entity 1',
//                                            Abbreviation: 'LGLENT1',
//                                            Id: 'xxxx-xxx-xcxccx-xxxxxx3',
//                                            Style: 'display:block;',
//                                            Locations: {
//                                                Style: 'display:block;',
//                                                Items: [
//                                                { Name: 'Location 1', Abbreviation: 'LOC1', Id: 'xxxx-xxx-xcxccx-xxxxxx4' }
//                                                ]
//                                            }
//                                        }]
//                                    }

//                                }]
//                            }
//                        }]
//                    }
//                };

//                //var json = {
//                //    Divisions: {
//                //        Style: 'display:block;',
//                //        Items: [{
//                //            Name: 'US Division',
//                //            Abbreviation: 'WLFV',
//                //            Id: 'xxxx-xxx-xcxccx-xxxxxx1',
//                //            Style: 'display:block;',
//                //            Groups: {
//                //                Style: 'display:block;',
//                //                Items: [{
//                //                    Name: 'Corporate',
//                //                    Abbreviation: 'WLFV',
//                //                    Id: 'xxxx-xxx-xcxccx-xxxxxx2',
//                //                    Style: 'display:block;',
//                //                    LegalEntities: {
//                //                        Style: 'display:block;',
//                //                        Items: [
//                //                        {
//                //                            Name: 'Maine Holdings Ltd.',
//                //                            Abbreviation: 'WLFV',
//                //                            Id: 'xxxx-xxx-xcxccx-xxxxxx3',
//                //                            Style: 'display:block;',
//                //                            Locations: {
//                //                                Style: 'display:block;',
//                //                                Items: [
//                //                                { Name: 'Kenebunkport', Abbreviation: 'KNBKPRT', Id: 'xxxx-xxx-xcxccx-xxxxxx4' },
//                //                                { Name: 'Sugar Loaf', Abbreviation: 'SLOAF', Id: 'xxxx-xxx-xcxccx-xxxxxx5' }
//                //                                ]
//                //                            }
//                //                        }]
//                //                    }

//                //                }, {
//                //                    Name: 'IT Services',
//                //                    Abbreviation: 'WLFV',
//                //                    Id: 'xxxx-xxx-xcxccx-xxxxxx6',
//                //                    Style: 'display:block;',
//                //                    LegalEntities: {
//                //                        Style: 'display:block;',
//                //                        Items: [
//                //                        {
//                //                            Name: 'New Hampshire Ltd.',
//                //                            Abbreviation: 'WLFV',
//                //                            Id: 'xxxx-xxx-xcxccx-xxxxxx7',
//                //                            Style: 'display:block;',
//                //                            Locations: {
//                //                                Style: 'display:block;',
//                //                                Items: [
//                //                                { Name: 'Frank City', Abbreviation: 'FRKCTY', Id: 'xxxx-xxx-xcxccx-xxxxxx8' },
//                //                                { Name: 'Mountain View', Abbreviation: 'MTVIEW', Id: 'xxxx-xxx-xcxccx-xxxxxx9' }
//                //                                ]
//                //                            }
//                //                        }]
//                //                    }
//                //                }]
//                //            }
//                //        }, {
//                //            Name: 'Canadian Division',
//                //            Abbreviation: 'WLFV',
//                //            Id: 'xxxx-xxx-xcxccx-xxxxxx10',
//                //            Style: 'display:block;',
//                //            Groups: {
//                //                Style: 'display:block;',
//                //                Items: [{
//                //                    Name: 'Corporate',
//                //                    Abbreviation: 'WLFV',
//                //                    Id: 'xxxx-xxx-xcxccx-xxxxxx11',
//                //                    Style: 'display:block;',
//                //                    LegalEntities: {
//                //                        Style: 'display:block;',
//                //                        Items: [
//                //                        {
//                //                            Name: 'Nova Scotia 54323 Inc.',
//                //                            Abbreviation: 'WLFV',
//                //                            Id: 'xxxx-xxx-xcxccx-xxxxxx12',
//                //                            Style: 'display:block;',
//                //                            Locations: {
//                //                                Style: 'display:block;',
//                //                                Items: [
//                //                                {
//                //                                    Name: 'Kentville', Abbreviation: 'KNTVL', Id: 'xxxx-xxx-xcxccx-xxxxxx13'
//                //                                },
//                //                                { Name: 'Kingsport', Abbreviation: 'KGNSPT', Id: 'xxxx-xxx-xcxccx-xxxxxx14' }
//                //                                ]
//                //                            }
//                //                        }]
//                //                    }
//                //                }, {
//                //                    Name: 'IT Services',
//                //                    Abbreviation: 'WLFV',
//                //                    Id: 'xxxx-xxx-xcxccx-xxxxxx15',
//                //                    Style: 'display:block;',
//                //                    LegalEntities: {
//                //                        Style: 'display:block;',
//                //                        Items: [
//                //                        {
//                //                            Name: 'Nova Scotia 98765 Inc.',
//                //                            Abbreviation: 'WLFV',
//                //                            Id: 'xxxx-xxx-xcxccx-xxxxxx16',
//                //                            //Style: 'display:none;', //'display:none;',
//                //                            Locations: {
//                //                                Style: 'display:block;',
//                //                                Items: [
//                //                                {
//                //                                    Name: 'Wolfvillex', Abbreviation: 'WLFV', Id: 'xxxx-xxx-xcxccx-xxxxxx17'
//                //                                },
//                //                                { Name: 'Halifaxx', Abbreviation: 'HFX', Id: 'xxxx-xxx-xcxccx-xxxxxx18' }
//                //                                ]
//                //                            }
//                //                        }]
//                //                    }
//                //                }]
//                //            }
//                //        }]
//                //    }
//                //};

//                this.options.jsonTreeState = JSON.parse(JSON.stringify(json)); // Clone.

//                this.element.html(this.renderLocationEditor(assignmentRowChanged_ElementId)); // Render the org/location tree view.

//                // Get the workflow and store it in this.options.workflow.
//                //debugger;
//                $.ajax({
//                    url: this.options.operationUriPrefix + "odata/WorkflowConfiguration/" + this.options.bwTenantId + '/' + this.options.bwWorkflowAppId + "/true", //?$filter=Active eq true", //('eCarWorkflow')", // Get the eCarWorkflow json/definition from the database.
//                    dataType: "json",
//                    contentType: "application/json",
//                    type: "Get",
//                    timeout: this.options.ajaxTimeout
//                }).done(function (result) {
//                    try {
//                        //debugger;
//                        //console.log('The user is not logged in, so displaying the default WorkflowEditor.');
//                        if (!participantId) {
//                            // The user is not logged in.
//                            debugger;
//                            console.log('The user is not logged in, so displaying the default WorkflowEditor.');
//                            var workflow = result.value[0].ConfigurationValues; // Works when the user is not logged in. 
//                        } else {
//                            // The user is logged in.
//                            //debugger;
//                            var workflow = result.value; //JSON.parse(result.value[0].bwWorkflowJson); // Works when the user is logged in.
//                        }
//                        //console.log('LOADED FROM DATABASE: workflow[0].ConfigurationValues: ' + JSON.stringify(workflow[0].ConfigurationValues)); 
//                        //if (workflow.length != 1) {
//                        //    alert('ERROR: An incorrect number of workflows are marked as active! This process cannot continue. There can only be 1 active workflow.');
//                        //} else {

//                        workflow["DraftWorkflow"] = JSON.parse(JSON.stringify(workflow["Workflow"])); // Creating "DraftWorkflow" so we can tell if the workflow has been changed or not, and then inform the user that changes need to be published.
//                        thiz.options.workflow = workflow;

//                        thiz.options.Checklists = result.Checklists;
//                        //thiz.renderLocationEditor(assignmentRowChanged_ElementId); // Render the Workflow Editor. 
//                    } catch (e) {
//                        //lpSpinner.Hide();
//                        console.log('Exception in bwLocationEditor._create().xx.Get:1: ' + e.message + ', ' + e.stack);
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
//                    alert('Exception in bwLocationEditor._create().xx.Get:2: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
//                    console.log('Exception in bwLocationEditor._create().xx.Get:2: ' + JSON.stringify(data));
//                    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
//                    //var error = JSON.parse(data.responseText)["odata.error"];
//                    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
//                });
//            }
//        } catch (e) {
//            var html = '';
//            html += '<span style="font-size:24pt;color:red;">bwLocationEditor: CANNOT RENDER THE WORKFLOW MATRIX</span>';
//            html += '<br />';
//            html += '<span style="">Exception in bwLocationEditor.Create(): ' + e.message + ', ' + e.stack + '</span>';
//            thiz.element.html(html);
//        }
//    },
//    _setOption: function (key, value) {
//        this.options[key] = value;
//        this._update();
//    },
//    _update: function () {
//        try {
//            console.log('In _update(). This does nothing! (yet)');
//        } catch (e) {
//            console.log('Exception in _update(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    _destroy: function () {
//        this.element
//            .removeClass("bwWorkflowEditor")
//            .text("");
//    },
//    renderLocationEditor: function (assignmentRowChanged_ElementId) {
//        try {
//            console.log('In renderLocationEditor().');
//            //debugger;
//            var thiz = this;
//            var json = this.options.jsonTreeState;
//            var html = '';
//            html += '<style>';
//            html += '.ui-widget-header {';
//            html += '    border: 1px solid #066b8b;'; // dark blue border.
//            html += '    background: #6682b5 url("images/ui-bg_gloss-wave_35_f6a828_500x100.png") 50% 50% repeat-x;'; // lighter blue background.
//            html += '    color: #fff;';
//            html += '    font-weight: bold;';
//            html += '}';
//            html += '</style>';

//            html += '<style>';
//            html += '.dropdown-tree > ul{overflow-y: auto;overflow-x: hidden;white-space: nowrap;}';
//            html += '.dropdown-tree li{list-style: none}';
//            html += '.dropdown-tree li > i {margin-left: 10px;}';
//            html += '.dropdown-tree li:hover{ background: #eee;}';
//            html += '.dropdown-tree li:hover ul { background: white; }';
//            html += '.dropdown-tree li:hover ul li:hover { background: #eee; } ';
//            html += '.dropdown-tree a{display: inline-block !important;padding: 3px 20px;clear: both;font-weight: 400;line-height: 1.42857143;color: #333;white-space: nowrap;text-decoration: none;background:transparent !important; position: relative;}';
//            html += '.dropdown-tree .arrow{position: absolute;margin-left: -15px;top: 50%; transform: translateY(-50%);}';
//            html += '/*RTL CSS*/';
//            html += '.rtl-dropdown-tree{direction: rtl !important}';
//            html += '.rtl-dropdown-tree > ul{right: 0 ; left: unset; text-align: right}';
//            html += '.rtl-dropdown-tree .arrow{right: 6px}';
//            html += '.rtl-dropdown-tree li > i {margin-left: 0;margin-right: 10px;}';
//            html += '</style>';



//            //html += '<h2>Locations Editor</h2>';
//            //html += '<span class="printButton" title="print" onclick="cmdPrintForm();">&#x1f5a8;</span>';


//            html += '<table style="width:100%;">';
//            html += '   <tr>';
//            html += '       <td>';
//            html += '           <h2>';
//            html += '           Locations Editor: <span style="color:#95b1d3;">Manage your locations...</span>'; // Velvet Morning is #95b1d3. This was the pantone color of the day for December 9, 2019! :D
//            html += '           </h2>';
//            html += '       </td>';
//            html += '       <td style="text-align:right;">';
//            html += '           <span class="printButton" title="print" onclick="cmdPrintForm();">&#x1f5a8;</span>';
//            html += '       </td>';
//            html += '   </tr>';
//            html += '</table>';





//            //html += '<br />';
//            html += '<br />';
//            html += 'Manage your organizational structure and 👤Roles...';
//            html += '<br />';
//            html += '<br />';
//            html += '<br />';
//            html += 'Select how your organization is structured:';
//            html += '   <select style="padding:5px 5px 5px 5px;" id="selectOrganizationalStructure" onchange="$(\'.bwLocationEditor\').bwLocationEditor(\'selectOrganizationalStructure_OnChange\', \'viewing\');">';
//            html += '       <option value="Single Location">Single Location (local)</option>';
//            html += '       <option value="Legal Entity > Location">Legal Entity > Locations (local/national)</option>';
//            html += '       <option value="Group > Legal Entity > Location" selected>Group > Legal Entity > Location (national/international)</option>';
//            html += '       <option value="Division > Group > Legal Entity > Location" selected>Division > Group > Legal Entity > Location (international)</option>';
//            html += '   </select>';
//            html += '<br />';

//            html += '<table>';
//            html += '   <tr id="orgrow_d_g_e_l">';
//            html += '       <td></td>';
//            html += '       <td>';
//            html += '           <table style="padding-left:15px;">';
//            html += '               <tr>';
//            html += '                   <td>';
//            html += '                       <span style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwLocationEditor\').bwLocationEditor(\'collapseTree\', \'divisionsRootNode\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">';
//            html += '⚊ <span style="font-weight:normal;">◍</span> International Divisions <span style="font-weight:normal;">◍</span>  </span>';
//            html += '                       <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;text-decoration:underline;" title="Add a Division..." onclick="$(\'.bwLocationEditor\').bwLocationEditor(\'addADivision\');"> ✚ Add</span>';
//            html += '                    </td>';
//            html += '               </tr>';
//            for (var d = 0; d < json.Divisions.Items.length; d++) {
//                html += '           <tr>';
//                html += '               <td style="padding-left:40px;">';
//                html += '                   ◍ ' + json.Divisions.Items[d].Name + ' ◍ ';

//                html += '  <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;" onclick="$(\'.bwLocationEditor\').bwLocationEditor(\'editDivision\', \'' + d + '\');">✎<span style="text-decoration:underline;">Edit</span></span>';
//                html == '<br />';
//                html += '  <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;" onclick="$(\'.bwLocationEditor\').bwLocationEditor(\'expandRoles\', \'' + d + '\');">👤<span style="text-decoration:underline;">Roles</span></span>';
//                html += '<span id="spanWorkflowPeoplePicker_' + d + '"></span>';

//                html += '               </td>';
//                html += '           </tr>';
//                html += '           <tr>';
//                html += '               <td style="padding-left:40px;">';
//                html += '                   <table style="padding-left:15px;">';
//                if (json.Divisions.Items[d].Groups.Style == 'display:none;') {
//                    html += '                       <tr>';
//                    html += '                           <td>';
//                    html += '                               <span style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwLocationEditor\').bwLocationEditor(\'expandTree\', \'groupsRootNode\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">';
//                    html += '✚ ✣ Groups ✣  </span>';
//                    html += '                               <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;text-decoration:underline;" title="Add a Group..." onclick="$(\'.bwLocationEditor\').bwLocationEditor(\'addAGroup\', \'' + json.Divisions.Items[d].Id + '\', \'' + d + '\', \'' + g + '\', \'' + e + '\');"> ✚ Add</span>';
//                    html += '                           </td>';
//                    html += '                       </tr>';
//                } else {
//                    html += '                       <tr>';
//                    html += '                           <td>';
//                    html += '                               <span style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwLocationEditor\').bwLocationEditor(\'collapseTree\', \'groupsRootNode\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">';
//                    html += '⚊ ✣ Groups ✣  </span>';
//                    html += '                               <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;text-decoration:underline;" title="Add a Group..." onclick="$(\'.bwLocationEditor\').bwLocationEditor(\'addAGroup\', \'' + json.Divisions.Items[d].Id + '\', \'' + d + '\', \'' + g + '\', \'' + e + '\');"> ✚ Add</span>';
//                    html += '                           </td>';
//                    html += '                       </tr>';
//                    for (var g = 0; g < json.Divisions.Items[d].Groups.Items.length; g++) {
//                        html += '                   <tr>';
//                        html += '                       <td style="padding-left:40px;">';
//                        html += '                           ✣ ' + json.Divisions.Items[d].Groups.Items[g].Name + ' ✣ ';

//                        html += '  <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;" onclick="$(\'.bwLocationEditor\').bwLocationEditor(\'editGroup\', \'' + d + '\', \'' + g + '\');">✎<span style="text-decoration:underline;">Edit</span></span>';
//                        html == '<br />';
//                        html += '  <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;" onclick="$(\'.bwLocationEditor\').bwLocationEditor(\'expandRoles\', \'' + d + '\', \'' + g + '\');">👤<span style="text-decoration:underline;">Roles</span></span>';
//                        html += '<span id="spanWorkflowPeoplePicker_' + d + '_' + g + '"></span>';

//                        html += '                       </td>';
//                        html += '                   </tr>';
//                        html += '                   <tr>';
//                        html += '                       <td style="padding-left:40px;">';
//                        html += '                           <table style="padding-left:15px;">';
//                        if (json.Divisions.Items[d].Groups.Items[g].LegalEntities.Style == 'display:none;') {
//                            html += '                               <tr>';
//                            html += '                                   <td>';
//                            html += '                               <span style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwLocationEditor\').bwLocationEditor(\'expandTree\', \'legalEntitiesRootNode\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">';
//                            html += '✚ ⚖ Legal Entities  </span>';
//                            html += '                                       <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;text-decoration:underline;" title="Add a Legal Entity..." onclick="$(\'.bwLocationEditor\').bwLocationEditor(\'addALegalEntity\', \'' + json.Divisions.Items[d].Groups.Items[g].Id + '\', \'' + d + '\', \'' + g + '\', \'' + e + '\');"> ✚ Add ⚖</span>';
//                            html += '                                   </td>';
//                            html += '                               </tr>';
//                        } else {
//                            html += '                               <tr>';
//                            html += '                                   <td>';
//                            html += '                               <span style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwLocationEditor\').bwLocationEditor(\'collapseTree\', \'legalEntitiesRootNode\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">';
//                            html += '⚊ ⚖ Legal Entities  </span>';
//                            html += '                                       <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;text-decoration:underline;" title="Add a Legal Entity..." onclick="$(\'.bwLocationEditor\').bwLocationEditor(\'addALegalEntity\', \'' + json.Divisions.Items[d].Groups.Items[g].Id + '\', \'' + d + '\', \'' + g + '\', \'' + e + '\');"> ✚ Add ⚖</span>';
//                            html += '                                   </td>';
//                            html += '                               </tr>';
//                            for (var e = 0; e < json.Divisions.Items[d].Groups.Items[g].LegalEntities.Items.length; e++) {
//                                html += '                           <tr>';
//                                html += '                               <td style="padding-left:40px;">';
//                                html += '                                   ⚖ ' + json.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Name + ' ⚖ ';

//                                html += '  <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;" onclick="$(\'.bwLocationEditor\').bwLocationEditor(\'editLegalEntity\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">✎<span style="text-decoration:underline;">Edit</span></span>';
//                                html == '<br />';
//                                html += '<span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;" onclick="$(\'.bwLocationEditor\').bwLocationEditor(\'expandRoles\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">👤<span style="text-decoration:underline;">Roles</span></span>';
//                                html += '<span id="spanWorkflowPeoplePicker_' + d + '_' + g + '_' + e + '"></span>';

//                                html += '                               </td>';
//                                html += '                           </tr>';
//                                html += '                           <tr>';
//                                html += '                               <td style="padding-left:15px;">';
//                                html += '                                   <table style="padding-left:15px;">';
//                                if (json.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Style == 'display:none;') {
//                                    html += '                                   <tr>';
//                                    html += '                                       <td>';
//                                    html += '                               <span style="cursor:pointer;font-weight:bold;" title="Expand Locations" onclick="$(\'.bwLocationEditor\').bwLocationEditor(\'expandTree\', \'locationsRootNode\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">';
//                                    html += '✚ 🏠 Locations </span>';
//                                    html += '                                           <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;" title="Add a Location..." onclick="$(\'.bwLocationEditor\').bwLocationEditor(\'addALocation\', \'' + json.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Id + '\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">✚ Add 🏠</span>';
//                                    html += '                                       </td>';
//                                    html += '                                   </tr>';
//                                } else {
//                                    html += '                                   <tr>';
//                                    html += '                                       <td>';
//                                    html += '                               <span style="cursor:pointer;font-weight:bold;" title="Collapse Locations" onclick="$(\'.bwLocationEditor\').bwLocationEditor(\'collapseTree\', \'locationsRootNode\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">';
//                                    html += '⚊ 🏠 Locations </span>';
//                                    html += '                                           <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;" title="Add a Location..." onclick="$(\'.bwLocationEditor\').bwLocationEditor(\'addALocation\', \'' + json.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Id + '\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">✚ Add 🏠</span>';
//                                    html += '                                       </td>';
//                                    html += '                                   </tr>';
//                                    for (var l = 0; l < json.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items.length; l++) {
//                                        html += '                               <tr style="' + json.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Style + '">';
//                                        html += '                                   <td style="padding-left:40px;">';
//                                        html += '<span>';
//                                        //html += '&nbsp;⚙';
//                                        html += ' 🏠 ' + json.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Name + ' 🏠 ';

//                                        html += '  <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;" onclick="$(\'.bwLocationEditor\').bwLocationEditor(\'editLocation\', \'' + d + '\', \'' + g + '\', \'' + e + '\', \'' + l + '\');">✎<span style="text-decoration:underline;">Edit</span></span>';
//                                        //html == '<br />';
//                                        //html += '  <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;" onclick="$(\'.bwLocationEditor\').bwLocationEditor(\'expandRoles\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">👤<span style="text-decoration:underline;">Roles</span></span>';



//                                        // NEW: Expand ROLES!!
//                                        html += '<br />';
//                                        html += '<span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;" onclick="$(\'.bwLocationEditor\').bwLocationEditor(\'expandRoles\', \'' + d + '\', \'' + g + '\', \'' + e + '\', \'' + l + '\');">✚👤</span>';
//                                        html += '<span id="spanWorkflowPeoplePicker_' + d + '_' + g + '_' + e + '_' + l + '"></span>';



//                                        html += '</span>';
//                                        html += '                                   </td>';
//                                        html += '                               </tr>';
//                                    }
//                                    //html += '                                   <tr>';
//                                    //html += '                                       <td style="padding-left:15px;">';
//                                    //html += '<span style="cursor:pointer;" title="Add a Location..." onclick="$(\'.bwLocationEditor\').bwLocationEditor(\'addALocation\', \'' + 'xx' + '\');">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✚ Add a location...</span>';
//                                    //html += '                                       </td>';
//                                    //html += '                                   </tr>';
//                                }
//                                html += '                                   </table>';
//                                html += '                               </td>';
//                                html += '                           </tr>';
//                            }
//                        }
//                        html += '                           </table>';
//                        html += '                       </td>';
//                        html += '                   </tr>';
//                    }
//                }
//                html += '                   </table>';
//                html += '               </td>';
//                html += '           </tr>';
//            }
//            html += '           </table>';
//            html += '       </td>';
//            html += '   </tr>';
//            html += '</table>';

//            html += '<br />';
//            html += '<br />';
//            html += '<br />';
//            html += '<br />';


//            html += '<div style="display:none;" id="divCreateANewRoleDialog">';
//            html += '  <table style="width:100%;">';
//            html += '    <tr>';
//            html += '      <td style="width:90%;">';
//            html += '        <span id="spanCustomSignUpDialogTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Create a new Role</span>';
//            html += '      </td>';
//            html += '      <td style="width:9%;"></td>';
//            html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
//            html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divCreateANewRoleDialog\').dialog(\'close\');">X</span>';
//            html += '      </td>';
//            html += '    </tr>';
//            html += '  </table>';
//            html += '  <br /><br />';
//            html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
//            html += '  <span id="spanCustomSignUpDialogInvitationDescriptionText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;"></span><br />';
//            html += '  <span style="font-family: calibri;">Role Abbreviation</span><br />';
//            html += '  <input type="text" id="txtCreateANewRoleDialog_RoleId" style="WIDTH: 93%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 40pt;" /><br /><br />';
//            html += '  <span style="font-family: calibri;">Role Name</span><br />';
//            html += '  <input type="text" id="txtCreateANewRoleDialog_RoleName" style="WIDTH: 93%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 40pt;" /><br /><br />';
//            //html += '  <span style="font-family: calibri;">RoleBits</span><br />';
//            //html += '  <input type="password" id="txtCreateANewRoleDialog_RoleBits" style="WIDTH: 93%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 40pt;" /><br />';
//            html += '  <br />';
//            //html += '  <div id="xxxx" class="divSignInButton" style="width:90%;text-align:center;line-height:1.6em;font-weight:bold;" onclick="cmdCustomRegistration();">Create your new role now!&nbsp;</div>';

//            html += '  <table style="width:100%;">';
//            html += '     <tr>';
//            html += '       <td style="text-align:center;">';
//            html += '  <input type="button" value="Create your new role now!" style="height:30pt;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'createANewRole\');" />';
//            html += '       </td>';
//            html += '     </tr>';
//            //html += '     <tr><td>&nbsp;</td></tr>';
//            //html += '     <tr>';
//            //html += '       <td style="text-align:center;">';
//            //html += '  <span style="font-family: calibri;font-style:italic;font-size:30pt;"> <a href="javascript:$(\'#divCreateANewRoleDialog\').dialog(\'close\');">Cancel</a></span>';
//            //html += '       </td>';
//            //html += '     </tr>';
//            html += '  </table>';
//            html += '  <br /><br />';
//            html += '</div>';

//            html += '<div style="height:100vh;"></div>';


//            //html += '<div style="display:none;" id="divAddAnOrgItemDialog">';
//            //html += '   <table style="width:100%;">';
//            //html += '       <tr>';
//            //html += '           <td style="width:90%;">';
//            //html += '               <span id="spanAddAnOrgItemDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">[spanAddAnOrgItemDialogTitle]</span>';
//            //html += '           </td>';
//            //html += '           <td style="width:9%;"></td>';
//            //html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
//            //html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divAddAnOrgItemDialog\').dialog(\'close\');">X</span>';
//            //html += '           </td>';
//            //html += '       </tr>';
//            //html += '   </table>';
//            //html += '   <br /><br />';
//            //html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
//            //html += '   <span id="spanAddAnOrgItemDialogInvitationDescriptionText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;"></span>';
//            //html += '   <span style="font-family: calibri;">Name</span>';
//            //html += '   <br />';
//            //html += '   <input type="text" id="txtAddAnOrgItemDialogName" style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />';
//            //html += '   <br /><br />';
//            //html += '   <span style="font-family: calibri;">Abbreviation</span>';
//            //html += '   <br />';
//            //html += '   <input type="text" id="txtAddANewPersonDialogAbbreviation" style="width:25%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />';
//            //html += '   <br /><br />';
//            //html += '   <span style="font-family: calibri;">Id</span>';
//            //html += '   <br />';
//            //html += '   <input id="txtAddANewPersonDialogId" type="text" disabled style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" /><br />';
//            //html += '   <br /><br />';
//            //html += '   <span style="white-space:nowrap;"><input id="checkboxAddANewPersonDialogActive" type="checkbox" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />Active</span>';
//            //html += '   <br /><br /><br />';
//            //html += '   <div id="divAddAnOrgItemDialogSubmitButton" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
//            //html += '       Add the xx';
//            //html += '   </div>';
//            //html += '   <br /><br />';
//            //html += '   <div class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;" onclick="$(\'#divAddAnOrgItemDialog\').dialog(\'close\');">';
//            //html += '       Close';
//            //html += '   </div>';
//            //html += '   <br /><br />';
//            //html += '</div>';

//            html += '<div style="display:none;" id="divRoleMultiPickerDialog2">';
//            html += '  <table style="width:100%;">';
//            html += '    <tr>';
//            html += '      <td style="width:90%;">';
//            html += '        <span id="spanRoleMultiPickerDialogTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Roles</span>';
//            html += '      </td>';
//            html += '      <td style="width:9%;"></td>';
//            html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
//            html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divRoleMultiPickerDialog2\').dialog(\'close\');">X</span>';
//            html += '      </td>';
//            html += '    </tr>';
//            html += '  </table>';
//            html += '  <br /><br />';
//            html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
//            html += '  <span id="spanRoleMultiPickerDialogContent" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:20pt;"></span><br />';
//            html += '  <br /><br />';
//            html += '  <input type="button" value="SAVE" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'projectTypeMultiPickerDialog_RenderResults\');" />';
//            html += '  <br /><br />';
//            html += '</div>';

//            // Render the html.
//            thiz.element.html(html);

//        } catch (e) {
//            console.log('Exception in renderLocationEditor: ' + e.message + ', ' + e.stack);
//        }
//    },
//    renderWorkflowPeoplePicker: function (tagName) {
//        // This was originally a copy of the bwWorkflowEditor.renderWorkflowEditor method! May be an opportunity to abstract/break out this in the future.
//        try {
//            console.log('In renderWorkflowPeoplePicker().');
//            var thiz = this;
//            $.ajax({
//                url: this.options.operationUriPrefix + "odata/racirolesandparticipants/" + this.options.bwWorkflowAppId, // Get the eCarWorkflow json/definition from the database.
//                dataType: "json",
//                contentType: "application/json",
//                type: "Get",
//                timeout: this.options.ajaxTimeout
//            }).done(function (rolesAndParticipants) {
//                try {
//                    console.log('In renderWorkflowPeoplePicker():2:.');
//                    //debugger;
//                    var car = thiz.options.workflow; //.store;
//                    var html = '';
//                    if (car == null) {
//                        html += '<span style="font-size:24pt;color:red;">NO DATA</span>';
//                        //debugger;
//                    } else {
//                        //debugger;
//                        // Include jquery-ui stylesheet.
//                        //html += '<link rel="stylesheet" href="css/jquery/1.11.1/themes/smoothness/jquery-ui.min.css?v=0">'; // removed 8-18-2022
//                        // Inline styles.
//                        html += '<style>';
//                        html += '.titlecell {';
//                        html += '    vertical-align:top;';
//                        html += '    padding-top:3px;';
//                        html += '    padding-bottom:3px;';
//                        html += '    padding-left:5px;';
//                        html += '    padding-right:10px;';
//                        html += '    white-space:nowrap;';
//                        html += '    color:grey;';
//                        html += '    text-decoration:underline;';
//                        html += '}';
//                        html += '.steprowcell {';
//                        html += '    vertical-align:top;';
//                        html += '    padding-top:10px;';
//                        html += '    padding-bottom:10px;';
//                        html += '    padding-left:5px;';
//                        html += '    padding-right:5px;';
//                        html += '    white-space:nowrap;';
//                        html += '}';
//                        html += '.steprow-hidden {';
//                        html += '    visibility: collapse;';
//                        html += '}';

//                        html += '.steprow:hover {';
//                        html += '    background-color: lightgoldenrodyellow;';
//                        html += '}';

//                        html += '.activeEditRow {';
//                        html += '    background-color: #EBF6F9;';
//                        html += '}';
//                        html += '.ui-progressbar {';
//                        html += '    position: relative;';
//                        html += '}';
//                        html += '.progress-label {';
//                        html += '    position: absolute;';
//                        html += '    left: 10%;';
//                        html += '    top: 4px;';
//                        html += '    font-weight: bold;';
//                        html += '    color: black;';
//                        html += '    text-shadow: 1px 1px 0 #fff;';
//                        html += '}';
//                        html += '#progressbar .ui-progressbar-value {';
//                        html += '    background-color: cyan;';
//                        html += '}';
//                        html += '.transparent-dialog {';
//                        html += '  background: transparent;';
//                        html += '  border: none;';
//                        html += '}';
//                        html += '.transparent-dialog .ui-widget-header {';
//                        html += '  border: none;';
//                        html += '  background: transparent;';
//                        html += '}';
//                        html += '.transparent-dialog .ui-widget-content {';
//                        html += '  background: transparent;';
//                        html += '}';
//                        //
//                        // This is the dialog draggable handle bar colored lightgoldenrodyellow.
//                        //
//                        html += '.ui-dialog-title {';
//                        html += '    background-color: lightgoldenrodyellow;';
//                        html += '    border-color: orange;';
//                        html += '}';
//                        html += '.ui-draggable-handle {';
//                        html += '    background-color: lightgoldenrodyellow !important;';
//                        html += '    border-color: red !important;';
//                        html += '}';
//                        html += '.ui-corner-all {';
//                        html += '    border-color: #FFE1AC !important;'; // Navajo White outlining the dialog boxes! Yeah!!! :)
//                        html += '}';

//                        html += '</style>';

//                        html += '<table border="1" style="border-color:#d8d8d8;">';

//                        // Iterate through all of the steps.
//                        for (var i = 0; i < car.Workflow.Steps.Step.length; i++) {
//                            var stepName = car.Workflow.Steps.Step[i]["@Name"];
//                            if (false) {
//                                // Do nothing, not displaying these steps. << DISPLAYING all steps now!
//                            } else {
//                                var newStepName = '';
//                                if (stepName == 'Create') {
//                                    newStepName = 'Create';
//                                } else if (stepName == 'Revise') {
//                                    newStepName = 'Revise';
//                                } else if (stepName == 'Admin') {
//                                    newStepName = 'Admin';
//                                } else if (stepName == 'Collaboration') {
//                                    newStepName = 'Collaborate and Develop Consensus';
//                                } else if (stepName == 'VPLevel') {
//                                    newStepName = 'Requesting Manager Approvals';
//                                } else if (stepName == 'ExecLevel') {
//                                    newStepName = 'Requesting Executive Approvals';
//                                } else if (stepName == 'CLevel') {
//                                    newStepName = 'Requesting Board of Directors Approvals';
//                                } else if (stepName == 'Done') {
//                                    newStepName = 'Approved';
//                                } else if (stepName == 'IssueOrderNumber') {
//                                    newStepName = 'Requesting Purchase Order Number from Accounting';
//                                }

//                                if (stepName == 'Done') {
//                                    stepName = 'Completed (Done)'; // This is what we want the Done step renamed to in the future...
//                                }

//                                var cellColor = '#f5f6f7';

//                                if (newStepName != 'Create' && newStepName != 'Revise' && newStepName != 'Admin') {

//                                    // Display the header row for this step.
//                                    html += '<tr id="stepheaderrow_' + i + '" style="border:0px">';
//                                    html += '  <td colspan="11" style="font-weight:bold;padding:10px;background-color:' + cellColor + ';" >';
//                                    html += '    <table style="width:100%;">';
//                                    html += '      <tr>';
//                                    html += '        <td>';
//                                    html += '          <span style="white-space:nowrap;"><span id="stepname_' + i + '" class="stepname" style="cursor:cell;" title="Double-click to edit the step name...">' + newStepName + '</span></span>';
//                                    html += '        </td>';
//                                    html += '        <td></td>';
//                                    html += '        <td style="text-align:center;">';
//                                    // Display the consensus timeout section and the "Configure Email", and "Add PArticipants" buttons.
//                                    html += '           <table style="width:100%;">';
//                                    html += '               <tr>';
//                                    html += '                   <td></td>';
//                                    html += '                   <td>';

//                                    html += '                   </td>';
//                                    html += '                   <td></td>';
//                                    html += '                   <td style="text-align:right;">';
//                                    if (stepName.toLowerCase() == 'admin') {
//                                        // No "Add a participant" button for the ADMIN step/stage.
//                                    } else {
//                                        //html += '&nbsp;&nbsp;&nbsp;&nbsp;';
//                                        //html += '          <input type="button" class="buttonAddNewAssignmentRow" style="white-space:nowrap;padding:5px 10px 5px 10px;" value="✚ Add a Participant" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'addNewRow\', \'' + 'steprow-inform_' + i + '_' + '0' + '\');" />';
//                                    }
//                                    html += '                   </td>';
//                                    html += '               </tr>';
//                                    html += '           </table>';
//                                    html += '        </td>';
//                                    html += '      </tr>';
//                                    html += '    </table>';
//                                    html += '  </td>';
//                                    html += '</tr>';
//                                    // End: Display the header row for this step.

//                                    if (stepName == 'Create' || stepName == 'Revise' || stepName == 'Admin') {

//                                    } else {
//                                        // Display Inform roles.
//                                        if (car.Workflow.Steps.Step[i].OnStart && car.Workflow.Steps.Step[i].OnStart.Inform) {
//                                            if (car.Workflow.Steps.Step[i].OnStart.Inform.length > 0) {
//                                                for (var j = 0; j < car.Workflow.Steps.Step[i].OnStart.Inform.length; j++) {
//                                                    var xid = 'steprow-inform_' + i + '_' + j;
//                                                    var additionalRowClass = '';
//                                                    html += '<tr id="steprow-inform_' + i + '_' + j + '" class="steprow' + additionalRowClass + '" style="cursor:cell;" title="Double-click on this row to edit this role assignment..." >';
//                                                    html += '  <td style="width:30px;"></td>';

//                                                    if (thiz.options.displayRoleIdColumn) {
//                                                        if (car.Workflow.Steps.Step[i].OnStart.Inform[j]) {
//                                                            if (car.Workflow.Steps.Step[i].OnStart.Inform[j]["@Role"]) {
//                                                                html += '<td style="background-color:' + cellColor + ';" class="roleid steprowcell" bwRoleId="' + car.Workflow.Steps.Step[i].OnStart.Inform[j]["@Role"] + '" bwOldValue="' + car.Workflow.Steps.Step[i].OnStart.Inform[j]["@Role"] + '">' + car.Workflow.Steps.Step[i].OnStart.Inform[j]["@Role"] + '</td>';
//                                                            } else {
//                                                                html += '<td style="background-color:' + cellColor + ';" class="roleid steprowcell" bwRoleId="' + car.Workflow.Steps.Step[i].OnStart.Inform[j]["@Role"] + '" bwOldValue="' + car.Workflow.Steps.Step[i].OnStart.Inform[j]["@Role"] + '">' + car.Workflow.Steps.Step[i].OnStart.Inform[j]["@IdField"] + '</td>';
//                                                            }
//                                                        }
//                                                    }

//                                                    // Todd changed 10-13-19 7-32am ast
//                                                    var roleName = '';
//                                                    var roleId = '';
//                                                    if (car.Workflow.Steps.Step[i].OnStart.Inform[j]) {
//                                                        roleName = car.Workflow.Steps.Step[i].OnStart.Inform[j]["@RoleName"];
//                                                        roleId = car.Workflow.Steps.Step[i].OnStart.Inform[j]["@Role"];
//                                                    }
//                                                    //
//                                                    // Now that we have the roleName, we need to travel up through the organizational structure to determine if this role is assigned already!
//                                                    //
//                                                    html += '<td style="background-color:' + cellColor + ';" class="rolename steprowcell" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'' + cellColor + '\';" bwStepname="' + car.Workflow.Steps.Step[i]["@Name"] + '" bwRoleId="' + car.Workflow.Steps.Step[i].OnStart.Inform[j]["@Role"] + '" bwOldValue="' + roleName + '">';
//                                                    var roleAssigned = true;
//                                                    if (roleAssigned) {
//                                                        html += '<span style="color:grey;font-size:12pt;font-style:italic;">';
//                                                        html += roleName;
//                                                        html += '<br />';
//                                                        html += 'Nova Scotia 98765 Inc.';
//                                                        html += '</span>';
//                                                    } else {
//                                                        html += '<span style="color:red;font-size:12pt;font-style:italic;">';
//                                                        html += roleName;
//                                                        html += '</span>';
//                                                    }
//                                                    html += '</td>';

//                                                    html += '  <td class="steprowbuttons steprowcell" style="background-color:' + cellColor + ';width:80px;text-align:right;padding-right:15px;" >';

//                                                    //
//                                                    // Display the role participants.
//                                                    //
//                                                    var participantFriendlyName;
//                                                    try {
//                                                        for (var p = 0; p < rolesAndParticipants.RolesAndParticipants.length; p++) {
//                                                            if (roleId == rolesAndParticipants.RolesAndParticipants[p].RoleId) {
//                                                                participantFriendlyName = rolesAndParticipants.RolesAndParticipants[p].Participants[0].bwParticipantFriendlyName;
//                                                            }
//                                                        }
//                                                    } catch (e) {
//                                                        console.log('Exception displaying participants:1: ' + e.message + ', ' + e.stack);
//                                                    }
//                                                    if (participantFriendlyName) html += participantFriendlyName;

//                                                    html += '[PEOPLE PICKER]  [...]';
//                                                    html += '&nbsp;&nbsp;';
//                                                    html += '    <input style="padding:5px 10px 5px 10px;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'renderEditSteprow\', \'' + xid + '\');" type="button" value="⚙ Edit">';
//                                                    html += '  </td>';

//                                                    html += '</tr>';
//                                                }
//                                            }
//                                        }
//                                        // Display Assign roles.
//                                        if (car.Workflow.Steps.Step[i].Assign) {
//                                            if (car.Workflow.Steps.Step[i].Assign.length > 0) {
//                                                for (var j = 0; j < car.Workflow.Steps.Step[i].Assign.length; j++) {
//                                                    var xid = 'steprow-assign_' + i + '_' + j;
//                                                    var additionalRowClass = '';
//                                                    html += '<tr id="steprow-assign_' + i + '_' + j + '" class="steprow' + additionalRowClass + '" style="cursor:cell;" title="Double-click on this row to edit this role assignment..." >';

//                                                    html += '  <td style="width:30px;"></td>';

//                                                    if (thiz.options.displayRoleIdColumn) {
//                                                        html += '<td style="background-color:' + cellColor + ';" class="roleid steprowcell" bwRoleId="' + car.Workflow.Steps.Step[i].Assign[j]["@Role"] + '" bwOldValue="' + car.Workflow.Steps.Step[i].Assign[j]["@Role"] + '">' + car.Workflow.Steps.Step[i].Assign[j]["@Role"] + '</td>';
//                                                    }

//                                                    // Todd changed 10-13-19 7-32am ast
//                                                    var roleName = '';
//                                                    var roleId = '';
//                                                    if (car.Workflow.Steps.Step[i].Assign[j]) {
//                                                        roleName = car.Workflow.Steps.Step[i].Assign[j]["@RoleName"];
//                                                        roleId = car.Workflow.Steps.Step[i].Assign[j]["@Role"];
//                                                    }

//                                                    html += '<td style="background-color:' + cellColor + ';" class="rolename steprowcell" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'' + cellColor + '\';" bwStepname="' + car.Workflow.Steps.Step[i]["@Name"] + '" bwRoleId="' + car.Workflow.Steps.Step[i].Assign[j]["@Role"] + '" bwOldValue="' + roleName + '">';

//                                                    html += roleName;
//                                                    html += '<br />';
//                                                    html += '</td>';

//                                                    html += '<td class="steprowbuttons steprowcell" style="background-color:' + cellColor + ';width:80px;text-align:right;padding-right:15px;" >';

//                                                    //
//                                                    // Display the role participants.
//                                                    //
//                                                    var participantFriendlyName;
//                                                    try {
//                                                        for (var p = 0; p < rolesAndParticipants.RolesAndParticipants.length; p++) {
//                                                            if (roleId == rolesAndParticipants.RolesAndParticipants[p].RoleId) {
//                                                                participantFriendlyName = rolesAndParticipants.RolesAndParticipants[p].Participants[0].bwParticipantFriendlyName;
//                                                            }
//                                                        }
//                                                    } catch (e) {
//                                                        console.log('Exception displaying participants:1: ' + e.message + ', ' + e.stack);
//                                                    }
//                                                    if (participantFriendlyName) html += participantFriendlyName;

//                                                    html += '[PEOPLE PICKER2]  [...]';
//                                                    html += '&nbsp;&nbsp;';
//                                                    html += '  <input style="padding:5px 10px 5px 10px;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'renderEditSteprow\', \'' + xid + '\');" type="button" value="⚙ Edit">';
//                                                    html += '</td>';

//                                                    html += '</tr>';
//                                                }
//                                            }
//                                        }
//                                    }
//                                    //html += '</tr>';
//                                }
//                            }
//                        }
//                        html += '</table>';

//                        html += '<div style="display:none;" id="divCreateANewRoleDialog">';
//                        html += '  <table style="width:100%;">';
//                        html += '    <tr>';
//                        html += '      <td style="width:90%;">';
//                        html += '        <span id="spanCustomSignUpDialogTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Create a new Role</span>';
//                        html += '      </td>';
//                        html += '      <td style="width:9%;"></td>';
//                        html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
//                        html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divCreateANewRoleDialog\').dialog(\'close\');">X</span>';
//                        html += '      </td>';
//                        html += '    </tr>';
//                        html += '  </table>';
//                        html += '  <br /><br />';
//                        html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
//                        html += '  <span id="spanCustomSignUpDialogInvitationDescriptionText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;"></span><br />';
//                        html += '  <span style="font-family: calibri;">Role Abbreviation</span><br />';
//                        html += '  <input type="text" id="txtCreateANewRoleDialog_RoleId" style="WIDTH: 93%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 40pt;" /><br /><br />';
//                        html += '  <span style="font-family: calibri;">Role Name</span><br />';
//                        html += '  <input type="text" id="txtCreateANewRoleDialog_RoleName" style="WIDTH: 93%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 40pt;" /><br /><br />';
//                        html += '  <br />';

//                        html += '  <table style="width:100%;">';
//                        html += '     <tr>';
//                        html += '       <td style="text-align:center;">';
//                        html += '  <input type="button" value="Create your new role now!" style="height:30pt;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'createANewRole\');" />';
//                        html += '       </td>';
//                        html += '     </tr>';
//                        html += '  </table>';
//                        html += '  <br /><br />';
//                        html += '</div>';

//                        html += '<div style="display:none;" id="divOrgMultiPickerDialog">';
//                        html += '  <table style="width:100%;">';
//                        html += '    <tr>';
//                        html += '      <td style="width:90%;">';
//                        html += '        <span id="spanOrgMultiPickerDialogTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Location(s)</span>';
//                        html += '      </td>';
//                        html += '      <td style="width:9%;"></td>';
//                        html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
//                        html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divOrgMultiPickerDialog\').dialog(\'close\');">X</span>';
//                        html += '      </td>';
//                        html += '    </tr>';
//                        html += '  </table>';
//                        html += '  <br /><br />';
//                        html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
//                        html += '  <span id="spanOrgMultiPickerDialogContent" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;"></span><br />';
//                        html += '  <br /><br />';
//                        html += '  <input type="button" value="SAVE" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'orgMultiPickerDialog_RenderResults\');" />';
//                        html += '  <br /><br />';
//                        html += '</div>';

//                        html += '<div style="display:none;" id="divProjectTypeMultiPickerDialog">';
//                        html += '  <table style="width:100%;">';
//                        html += '    <tr>';
//                        html += '      <td style="width:90%;">';
//                        html += '        <span id="spanProjectTypeMultiPickerDialogTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Functional area(s)</span>';
//                        html += '      </td>';
//                        html += '      <td style="width:9%;"></td>';
//                        html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
//                        html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divProjectTypeMultiPickerDialog\').dialog(\'close\');">X</span>';
//                        html += '      </td>';
//                        html += '    </tr>';
//                        html += '  </table>';
//                        html += '  <br /><br />';
//                        html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
//                        html += '  <span id="spanProjectTypeMultiPickerDialogContent" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:20pt;"></span><br />';
//                        html += '  <br /><br />';
//                        html += '  <input type="button" value="SAVE" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'projectTypeMultiPickerDialog_RenderResults\');" />';
//                        html += '  <br /><br />';
//                        html += '</div>';

//                        html += '<div style="display:none;" id="divPillarMultiPickerDialog">';
//                        html += '  <table style="width:100%;">';
//                        html += '    <tr>';
//                        html += '      <td style="width:90%;">';
//                        html += '        <span id="spanPillarMultiPickerDialogTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Growth</span>';
//                        html += '      </td>';
//                        html += '      <td style="width:9%;"></td>';
//                        html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
//                        html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divPillarMultiPickerDialog\').dialog(\'close\');">X</span>';
//                        html += '      </td>';
//                        html += '    </tr>';
//                        html += '  </table>';
//                        html += '  <br /><br />';
//                        html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
//                        html += '  <span id="spanPillarMultiPickerDialogContent" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:20pt;"></span><br />';
//                        html += '  <br /><br />';
//                        html += '  <input type="button" value="SAVE" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'pillarMultiPickerDialog_RenderResults\');" />';
//                        html += '  <br /><br />';
//                        html += '</div>';

//                        html += '<div style="display:none;" id="divUndoWorkflowActivationDialog">';
//                        html += '  <table style="width:100%;">';
//                        html += '    <tr>';
//                        html += '      <td style="width:90%;">';
//                        html += '        <span id="spanUndoWorkflowActivationTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Workflow ACTIVATED</span>';
//                        html += '      </td>';
//                        html += '      <td style="width:9%;"></td>';
//                        html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
//                        html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divUndoWorkflowActivationDialog\').dialog(\'close\');">X</span>';
//                        html += '      </td>';
//                        html += '    </tr>';
//                        html += '  </table>';
//                        html += '  <br /><br />';
//                        html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
//                        html += '  <span id="spanUndoWorkflowActivationContent" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:20pt;">';
//                        html += '    This workflow has been activated and will immediately impact the future workflow processes. Please keep an eye on potential issues related to your change(s). ';
//                        html += '    <br />';
//                        html += '    <br />';
//                        html += '    <br />';
//                        //html += '    <span style="font-weight:bold;cursor:pointer;">'; // onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'undoWorkflowActivation\');">';
//                        //html += '      You can change the "Active Workflow" using the drop-down at the top of this page any time';
//                        //html += '    </span>';

//                        //html += '  <br /><br />';
//                        html += '</div>';

//                        html += '<div style="display:none;" id="divMessageDialog">';
//                        html += '  <table style="width:100%;">';
//                        html += '    <tr>';
//                        html += '      <td style="width:90%;">';
//                        html += '        <span id="spanMessageDialogTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">[spanMessageDialogTitle]</span>';
//                        html += '      </td>';
//                        html += '      <td style="width:9%;"></td>';
//                        html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
//                        html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divMessageDialog\').dialog(\'close\');">X</span>';
//                        html += '      </td>';
//                        html += '    </tr>';
//                        html += '  </table>';
//                        html += '  <br /><br />';
//                        html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
//                        html += '  <span id="spanMessageDialogContentTop" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;">[spanMessageDialogContentTop]</span>';
//                        html += '    <br />';
//                        html += '    <br />';
//                        html += '    <br />';
//                        html += '    <span id="spanMessageDialogContentBottom" style="font-weight:bold;cursor:pointer;">';
//                        html += '      [spanMessageDialogContentBottom]';
//                        html += '    </span>';
//                        html += '  <br /><br />';
//                        html += '</div>';

//                        html += '<div style="display:none;" id="divConfigureEmailNotificationsDialog">';
//                        html += '   <table style="width:100%;">';
//                        html += '       <tr>';
//                        html += '           <td style="width:90%;">';
//                        html += '               <span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:30pt;font-weight:bold;">Configure email notifications</span>';
//                        html += '               <br />';
//                        html += '               <span id="spanConfigureEmailNotificationsDialogSubTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:normal;">[spanConfigureEmailNotificationsDialogSubTitle]</span>';
//                        html += '           </td>';
//                        html += '           <td style="width:9%;"></td>';
//                        html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
//                        html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divConfigureEmailNotificationsDialog\').dialog(\'close\');">X</span>';
//                        html += '           </td>';
//                        html += '       </tr>';
//                        html += '   </table>';
//                        html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
//                        html += '   <br />';
//                        html += '   <span id="spanConfigureEmailNotificationsDialogSelectEditEmailForDropdown">[spanConfigureEmailNotificationsDialogSelectEditEmailForDropdown]</span>';
//                        html += '   <br />';
//                        html += '   <br />';
//                        // Quill subject editor.
//                        html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:normal;">';
//                        html += 'Email subject line:';
//                        html += '</span>';
//                        html == '<br />';
//                        html += '   <div id="bwQuilltoolbarForSubject">';
//                        html += '       <button id="btnQuill_InsertADataItemForSubject" value="Insert a data item..." style="white-space:nowrap;border:1px solid lightgrey;font-size:10pt;width:175px;">Insert a data item...</button>';
//                        html += '   </div>';
//                        html += '   <div id="ConfigureEmailNotificationsDialogEditorForSubject" style="height:50px;"></div>'; // Quill.
//                        // Quill body editor.
//                        html += '<br />';
//                        html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:normal;">';
//                        html += 'Email body:';
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
//                        html += '   <div id="ConfigureEmailNotificationsDialogEditor" style="height:375px;"></div>'; // Quill.
//                        // Save button.
//                        html += '   <br />';
//                        html += '   <span id="spanConfigureEmailNotificationsDialogSaveButton">[spanConfigureEmailNotificationsDialogSaveButton]</span>'; // ☑ 
//                        html += '   <br /><br />';
//                        // Preview button.
//                        html += '   <div class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayEmailPreviewInDialog\');">';
//                        html += '       ❏ Preview this email'; // &#10063;
//                        html += '   </div>';
//                        html += '   <br /><br />';
//                        html += '</div>';

//                        html += '<div style="display:none;" id="divEmailPreviewDialog">';
//                        html += '  <table style="width:100%;">';
//                        html += '    <tr>';
//                        html += '      <td style="width:90%;">';
//                        html += '        <span id="spanEmailPreviewDialogTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Email preview</span>';
//                        html += '                    <br />';
//                        html += '                    <span id="spanEmailPreviewDialogSubTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:normal;">This email preview includes some randomly selected data.</span>';
//                        html += '      </td>';
//                        html += '      <td style="width:9%;"></td>';
//                        html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
//                        html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divEmailPreviewDialog\').dialog(\'close\');">X</span>';
//                        html += '      </td>';
//                        html += '    </tr>';
//                        html += '  </table>';
//                        html += '  <br /><br />';
//                        html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
//                        html += '  <span id="spanEmailPreviewDialogContentTop">[spanEmailPreviewDialogContentTop]</span>';
//                        html += '    <br />';
//                        html += '    <br />';
//                        html += '    <br />';
//                        html += '    <span id="spanEmailPreviewDialogContentBottom" style="font-weight:bold;cursor:pointer;">';
//                        html += '      [spanEmailPreviewDialogContentBottom]';
//                        html += '    </span>';
//                        html += '  <br /><br />';
//                        html += '</div>';

//                        html += '<div style="display:none;" id="divEmailDataItemPickerDialog">';
//                        html += '  <table style="width:100%;">';
//                        html += '    <tr>';
//                        html += '      <td style="width:90%;">';
//                        html += '        <span id="spanEmailDataItemPickerDialog" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Insert a data item</span>';
//                        html += '                    <br />';
//                        html += '                    <span id="spanEmailDataItemPickerDialogSubTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:normal;">[spanEmailDataItemPickerDialogSubTitle]</span>';
//                        html += '      </td>';
//                        html += '      <td style="width:9%;"></td>';
//                        html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
//                        html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divEmailDataItemPickerDialog\').dialog(\'close\');">X</span>';
//                        html += '      </td>';
//                        html += '    </tr>';
//                        html += '  </table>';
//                        html += '  <br /><br />';
//                        html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
//                        html += '  <span id="spanEmailDataItemPickerDialogContentTop">[spanEmailDataItemPickerDialogContentTop]</span>';
//                        html += '    <br />';
//                        html += '    <br />';
//                        html += '    <br />';
//                        html += '    <span id="spanEmailDataItemPickerDialogContentBottom" style="font-weight:bold;cursor:pointer;">';
//                        //html += '      [spanEmailDataItemPickerDialogContentBottom]';
//                        html += '    </span>';
//                        html += '  <br /><br />';
//                        html += '</div>';


//                        html += '<div style="display:none;" id="divWorkflowActionsUnderlyingPropertiesDialog">';
//                        html += '  <table style="width:100%;">';
//                        html += '    <tr>';
//                        html += '      <td style="width:90%;">';
//                        html += '        <span id="spanWorkflowActionsUnderlyingPropertiesDialog" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Action Properties</span>';
//                        html += '                    <br />';
//                        html += '                    <span id="spanWorkflowActionsUnderlyingPropertiesDialogSubTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:normal;">[spanWorkflowActionsUnderlyingPropertiesDialogSubTitle]</span>';
//                        html += '      </td>';
//                        html += '      <td style="width:9%;"></td>';
//                        html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
//                        html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divWorkflowActionsUnderlyingPropertiesDialog\').dialog(\'close\');">X</span>';
//                        html += '      </td>';
//                        html += '    </tr>';
//                        html += '  </table>';
//                        html += '  <br /><br />';
//                        html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
//                        html += '  <span id="spanWorkflowActionsUnderlyingPropertiesDialogContentTop">[spanWorkflowActionsUnderlyingPropertiesDialogContentTop]</span>';
//                        html += '    <br />';
//                        html += '    <br />';
//                        html += '    <br />';
//                        html += '    <span id="spanWorkflowActionsUnderlyingPropertiesDialogContentBottom" style="font-weight:bold;cursor:pointer;">';
//                        //html += '      [spanEmailDataItemPickerDialogContentBottom]';
//                        html += '    </span>';
//                        html += '  <br /><br />';
//                        html += '</div>';

//                        html += '<div style="display:none;" id="divProgressBarDialog">';
//                        html += '<div id="progressbar" class="ui-progressbar"><div class="progress-label">Loading...</div></div>';
//                        html += '</div>';

//                        //document.getElementById(tagName).innerHTML = html;

//                    }

//                    //debugger;
//                    document.getElementById(tagName).innerHTML = html;

//                    var x = '';
//                } catch (e) {
//                    debugger;
//                    //lpSpinner.Hide();
//                    console.log('Exception in raci.html._create().renderRaci.xx.Get: ' + e.message + ', ' + e.stack);
//                }
//            }).fail(function (data) {
//                //lpSpinner.Hide();
//                debugger;
//                var msg;
//                if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
//                    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
//                } else {
//                    msg = JSON.stringify(data);
//                }
//                alert('Exception in raci.html._create().renderRaci.Get[Roles].fail: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
//                console.log('Exception in raci.html._create().renderRaci.Get[Roles].fail: ' + JSON.stringify(data));
//                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
//                //var error = JSON.parse(data.responseText)["odata.error"];
//                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
//            });
//        } catch (e) {
//            debugger;
//            console.log('EXCEPTION IN render1: ' + e.message + ', ' + e.stack);
//        }
//    },

//    expandRoles: function (divisionIndex, groupIndex, entityIndex, locationIndex) {
//        try {
//            console.log('In expandRoles().');







//            var tagname = 'spanWorkflowPeoplePicker_' + divisionIndex + '_' + groupIndex + '_' + entityIndex + '_' + locationIndex;
//            this.renderWorkflowPeoplePicker(tagname); // spanWorkflowPeoplePicker1




//        } catch (e) {
//            console.log('Exception in expandRoles(): ' + e.message + ', ' + e.stack);
//        }
//    },

//    selectOrganizationalStructure_OnChange: function () {
//        try {
//            console.log('In selectOrganizationalStructure_OnChange().');
//            var selectedValue = document.getElementById('selectOrganizationalStructure').value;


//            alert('In selectOrganizationalStructure_OnChange(). selectedValue: ' + selectedValue + '. This functionality is incomplete. Coming soon!');
//        } catch (e) {
//            console.log('Exception in selectOrganizationalStructure_OnChange(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    collapseTree: function (elementId, divisionIndex, groupIndex, entityIndex) {
//        try {
//            console.log('In collapseTree(). elementId: ' + elementId);
//            if (elementId == 'locationsRootNode') {
//                this.options.jsonTreeState.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Style = 'display:none;'; // Collapse!
//                this._create();
//            } else if (elementId == 'legalEntitiesRootNode') {
//                this.options.jsonTreeState.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Style = 'display:none;'; // Collapse!
//                this._create();
//            } else if (elementId == 'groupsRootNode') {
//                this.options.jsonTreeState.Divisions.Items[divisionIndex].Groups.Style = 'display:none;'; // Collapse!
//                this._create();
//            } else if (elementId == 'divisionsRootNode') {
//                this.options.jsonTreeState.Divisions.Style = 'display:none;'; // Collapse!
//                this._create();
//            } else {
//                alert('In collapseTree(). Unexpected elementId: ' + elementId);
//            }
//        } catch (e) {
//            console.log('Exception in collapseTree(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    expandTree: function (elementId, divisionIndex, groupIndex, entityIndex) {
//        try {
//            console.log('In expandTree(). elementId: ' + elementId);
//            if (elementId == 'locationsRootNode') {
//                this.options.jsonTreeState.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Style = 'display:block;'; // Expand!
//                this._create();
//            } else if (elementId == 'legalEntitiesRootNode') {
//                this.options.jsonTreeState.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Style = 'display:block;'; // Expand!
//                this._create();
//            } else if (elementId == 'groupsRootNode') {
//                this.options.jsonTreeState.Divisions.Items[divisionIndex].Groups.Style = 'display:block;'; // Expand!
//                this._create();
//            } else if (elementId == 'divisionsRootNode') {
//                this.options.jsonTreeState.Divisions.Style = 'display:block;'; // Expand!
//                this._create();
//            } else {
//                alert('In expandTree(). Unexpected elementId: ' + elementId);
//            }
//        } catch (e) {
//            console.log('Exception in expandTree(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    manageRaciRoles: function (divisionIndex, groupIndex, entityIndex) {
//        try {
//            console.log('In manageRaciRoles().');
//            //alert('In manageRaciRoles(). This functionality is incomplete. Coming soon!');

//            //$('.bwLocationEditor').bwLocationEditor('displayCreateANewRoleDialog');

//            var availableRoles = ['Chief Financial Officer', 'Product Manager', 'Marketing Generalist', 'Sales Representative', 'Customer Support Representative', 'Business Development Manager', 'Chief Information Officer', 'Assistant Vice President', 'Vice President', 'Chief Marketing Officer', 'Chief Technology Officer', 'President', 'Chief Operating Officer', 'Chief Financial Officer', 'Chief Executive Officer', 'Project Manager', 'Project Sponsor', 'Accountant', 'Financial Analyst'];

//            var html = '';
//            html += '<table>';
//            for (var i = 0; i < availableRoles.length; i++) {
//                html += '<tr class="projectTypeRow">';
//                // Iterate through the list to see if we have a selected one or not.
//                var isSelected = false;
//                //if (selectedProjectTypes) {
//                //    for (var p = 0; p < selectedProjectTypes.split(',').length; p++) {
//                //        if (availableProjectTypes[i].ProjectTypeId == selectedProjectTypes.split(',')[p]) {
//                //            //console.log('availableProjectTypes[i].ProjectTypeId: ' + availableProjectTypes[i].ProjectTypeId + ', selectedProjectTypes.split(',')[p]: ' + selectedProjectTypes.split(',')[p]);
//                //            isSelected = true;
//                //        }
//                //    }
//                //}
//                //if (isSelected) {
//                //    html += '<td><input id="' + 'projectTypeCheckbox_' + i + '" type="checkbox" checked /></td>';
//                //} else {
//                html += '<td><input id="' + 'roleCheckbox_' + i + '" type="checkbox" /></td>';
//                //}
//                html += '<td class="roleId">' + availableRoles[i] + '</td>';
//                html += '<td>&nbsp;</td>';
//                //html += '<td class="projectTypeName">' + availableProjectTypes[i].bwFunctionalAreaTitle + '</td>';
//                html += '<td class="roleName"></td>';
//                html += '</tr>';
//            }
//            html += '</table>';


//            document.getElementById('spanRoleMultiPickerDialogContent').innerHTML = html;


//            //$("#divRoleMultiPickerDialog2").dialog({
//            //    modal: true,
//            //    resizable: false,
//            //    closeOnEscape: false, // Hit the ESC key to hide! Yeah!
//            //    width: '800',
//            //    dialogClass: 'no-close', // No close button in the upper right corner.
//            //    hide: false, // This means when hiding just disappear with no effects.
//            //    open: function () {
//            //        $('.ui-widget-overlay').bind('click', function () {
//            //            $('#divRoleMultiPickerDialog').dialog('close');
//            //        });
//            //    },
//            //    close: function () {
//            //        $('#divRoleMultiPickerDialog').dialog('destroy');
//            //    }
//            //});
//            //$('#divRoleMultiPickerDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();




//            $("#divRoleMultiPickerDialog2").dialog({
//                modal: true,
//                resizable: false,
//                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
//                width: '500',
//                dialogClass: "no-close", // No close button in the upper right corner.
//                hide: false, // This means when hiding just disappear with no effects.
//                open: function () {
//                    $('.ui-widget-overlay').bind('click', function () {
//                        $("#divRoleMultiPickerDialog2").dialog('close');
//                    });
//                },
//                close: function () {
//                    $('#divRoleMultiPickerDialog2').dialog('destroy');
//                }
//            });





//        } catch (e) {
//            console.log('Exception in manageRaciRoles(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    addADivision: function (elementId, divisionIndex, groupIndex, entityIndex) {
//        try {
//            console.log('In addADivision().');
//            var thiz = this;
//            document.getElementById('spanAddAnOrgItemDialogTitle').innerHTML = 'Add a new Division ◍';
//            document.getElementById('divAddAnOrgItemDialogSubmitButton').innerHTML = 'Add the new Division ◍';

//            document.getElementById('txtAddAnOrgItemDialogName').value = '';
//            document.getElementById('txtAddANewPersonDialogAbbreviation').value = '';
//            document.getElementById('txtAddANewPersonDialogId').value = '';

//            //
//            // ToDo: Add the click event to this Save button!
//            //
//            $("#divAddAnOrgItemDialog").dialog({
//                modal: true,
//                resizable: false,
//                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
//                width: '500',
//                dialogClass: "no-close", // No close button in the upper right corner.
//                hide: false, // This means when hiding just disappear with no effects.
//                open: function () {
//                    $('.ui-widget-overlay').bind('click', function () {
//                        $("#divAddAnOrgItemDialog").dialog('close');
//                    });
//                },
//                close: function () {
//                    $('#divAddAnOrgItemDialog').dialog('destroy');
//                }
//            });
//            //$("#divAddAnOrgItemDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

//            $('#divAddAnOrgItemDialogSubmitButton').off('click').click(function (error) {
//                try {
//                    console.log('In addADivision.divAddAnOrgItemDialogSubmitButton.click().');
//                    var name = document.getElementById('txtAddAnOrgItemDialogName').value.trim();
//                    var abbreviation = document.getElementById('txtAddANewPersonDialogAbbreviation').value.trim();
//                    if (name.length > 4 && abbreviation.length > 1) {
//                        // Save the new org entry.
//                        var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//                            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
//                            return v.toString(16);
//                        });
//                        var active = document.getElementById('checkboxAddANewPersonDialogActive').checked;

//                        var division = {
//                            Name: name,
//                            Abbreviation: abbreviation,
//                            Id: guid,
//                            Style: 'display:block;',
//                            Groups: {
//                                Style: 'display:block;',
//                                Items: []
//                            }
//                        };
//                        thiz.options.jsonTreeState.Divisions.Items.push(division);
//                        $("#divAddAnOrgItemDialog").dialog('close');
//                        thiz.renderLocationEditor();
//                    } else {
//                        alert('Please enter a name (5 characters or more) and an abbreviation (2 characters or more).');
//                    }
//                } catch (e) {
//                    console.log('Exception in divAddAnOrgItemDialogSubmitButton.click(): ' + e.message + ', ' + e.stack);
//                }
//            });
//        } catch (e) {
//            console.log('Exception in addADivision(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    addAGroup: function (elementId, divisionIndex, groupIndex, entityIndex) {
//        try {
//            console.log('In addAGroup(). elementId: ' + elementId);
//            var thiz = this;
//            document.getElementById('spanAddAnOrgItemDialogTitle').innerHTML = 'Add a new Group ✣';
//            document.getElementById('divAddAnOrgItemDialogSubmitButton').innerHTML = 'Add the new Group ✣';

//            document.getElementById('txtAddAnOrgItemDialogName').value = '';
//            document.getElementById('txtAddANewPersonDialogAbbreviation').value = '';
//            document.getElementById('txtAddANewPersonDialogId').value = '';

//            //
//            // ToDo: Add the click event to this Save button!
//            //
//            $("#divAddAnOrgItemDialog").dialog({
//                modal: true,
//                resizable: false,
//                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
//                width: '500',
//                dialogClass: "no-close", // No close button in the upper right corner.
//                hide: false, // This means when hiding just disappear with no effects.
//                open: function () {
//                    $('.ui-widget-overlay').bind('click', function () {
//                        $("#divAddAnOrgItemDialog").dialog('close');
//                    });
//                },
//                close: function () {
//                    $('#divAddAnOrgItemDialog').dialog('destroy');
//                }
//            });
//            //$("#divAddAnOrgItemDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

//            $('#divAddAnOrgItemDialogSubmitButton').off('click').click(function (error) {
//                try {
//                    console.log('In addAGroup.divAddAnOrgItemDialogSubmitButton.click().');
//                    var name = document.getElementById('txtAddAnOrgItemDialogName').value.trim();
//                    var abbreviation = document.getElementById('txtAddANewPersonDialogAbbreviation').value.trim();
//                    if (name.length > 4 && abbreviation.length > 1) {
//                        // Save the new org entry.
//                        var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//                            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
//                            return v.toString(16);
//                        });
//                        var active = document.getElementById('checkboxAddANewPersonDialogActive').checked;

//                        var group = {
//                            Name: name,
//                            Abbreviation: abbreviation,
//                            Id: guid,
//                            Style: 'display:block;',
//                            LegalEntities: {
//                                Style: 'display:block;',
//                                Items: []
//                            }
//                        };
//                        debugger;
//                        thiz.options.jsonTreeState.Divisions.Items[divisionIndex].Groups.Items.push(group);
//                        $("#divAddAnOrgItemDialog").dialog('close');
//                        thiz.renderLocationEditor();
//                    } else {
//                        alert('Please enter a name (5 characters or more) and an abbreviation (2 characters or more).');
//                    }
//                } catch (e) {
//                    console.log('Exception in divAddAnOrgItemDialogSubmitButton.click(): ' + e.message + ', ' + e.stack);
//                }
//            });
//        } catch (e) {
//            console.log('Exception in addAGroup(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    addALegalEntity: function (elementId, divisionIndex, groupIndex, entityIndex) {
//        try {
//            console.log('In addALegalEntity(). elementId: ' + elementId);
//            var thiz = this;
//            document.getElementById('spanAddAnOrgItemDialogTitle').innerHTML = 'Add a new Legal Entity ⚖';
//            document.getElementById('divAddAnOrgItemDialogSubmitButton').innerHTML = 'Add the new Legal Entity ⚖';

//            document.getElementById('txtAddAnOrgItemDialogName').value = '';
//            document.getElementById('txtAddANewPersonDialogAbbreviation').value = '';
//            document.getElementById('txtAddANewPersonDialogId').value = '';

//            //
//            // ToDo: Add the click event to this Save button!
//            //
//            $("#divAddAnOrgItemDialog").dialog({
//                modal: true,
//                resizable: false,
//                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
//                width: '500',
//                dialogClass: "no-close", // No close button in the upper right corner.
//                hide: false, // This means when hiding just disappear with no effects.
//                open: function () {
//                    $('.ui-widget-overlay').bind('click', function () {
//                        $("#divAddAnOrgItemDialog").dialog('close');
//                    });
//                },
//                close: function () {
//                    $('#divAddAnOrgItemDialog').dialog('destroy');
//                }
//            });
//            //$("#divAddAnOrgItemDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

//            $('#divAddAnOrgItemDialogSubmitButton').off('click').click(function (error) {
//                try {
//                    console.log('In addALegalEntity.divAddAnOrgItemDialogSubmitButton.click().');
//                    var name = document.getElementById('txtAddAnOrgItemDialogName').value.trim();
//                    var abbreviation = document.getElementById('txtAddANewPersonDialogAbbreviation').value.trim();
//                    if (name.length > 4 && abbreviation.length > 1) {
//                        // Save the new org entry.
//                        var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//                            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
//                            return v.toString(16);
//                        });
//                        var active = document.getElementById('checkboxAddANewPersonDialogActive').checked;

//                        var legalentity = {
//                            Name: name,
//                            Abbreviation: abbreviation,
//                            Id: guid,
//                            Style: 'display:block;',
//                            Locations: {
//                                Style: 'display:block;',
//                                Items: []
//                            }
//                        };
//                        thiz.options.jsonTreeState.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items.push(legalentity);
//                        $("#divAddAnOrgItemDialog").dialog('close');
//                        thiz.renderLocationEditor();
//                    } else {
//                        alert('Please enter a name (5 characters or more) and an abbreviation (2 characters or more).');
//                    }
//                } catch (e) {
//                    console.log('Exception in divAddAnOrgItemDialogSubmitButton.click(): ' + e.message + ', ' + e.stack);
//                }
//            });
//        } catch (e) {
//            console.log('Exception in addALegalEntity(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    addALocation: function (elementId, divisionIndex, groupIndex, entityIndex) {
//        try {
//            console.log('In addALocation(). elementId: ' + elementId);
//            var thiz = this;
//            document.getElementById('spanAddAnOrgItemDialogTitle').innerHTML = 'Add a new Location 🏠';
//            document.getElementById('divAddAnOrgItemDialogSubmitButton').innerHTML = 'Add the new Location 🏠';

//            document.getElementById('txtAddAnOrgItemDialogName').value = '';
//            document.getElementById('txtAddANewPersonDialogAbbreviation').value = '';
//            document.getElementById('txtAddANewPersonDialogId').value = '';

//            //
//            // ToDo: Add the click event to this Save button!
//            //
//            $("#divAddAnOrgItemDialog").dialog({
//                modal: true,
//                resizable: false,
//                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
//                width: '500',
//                dialogClass: "no-close", // No close button in the upper right corner.
//                hide: false, // This means when hiding just disappear with no effects.
//                open: function () {
//                    $('.ui-widget-overlay').bind('click', function () {
//                        $("#divAddAnOrgItemDialog").dialog('close');
//                    });
//                },
//                close: function () {
//                    $('#divAddAnOrgItemDialog').dialog('destroy');
//                }
//            });
//            //$("#divAddAnOrgItemDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

//            $('#divAddAnOrgItemDialogSubmitButton').off('click').click(function (error) {
//                try {
//                    console.log('In addALocation.divAddAnOrgItemDialogSubmitButton.click().');
//                    var name = document.getElementById('txtAddAnOrgItemDialogName').value.trim();
//                    var abbreviation = document.getElementById('txtAddANewPersonDialogAbbreviation').value.trim();
//                    if (name.length > 4 && abbreviation.length > 1) {
//                        // Save the new org entry.
//                        var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//                            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
//                            return v.toString(16);
//                        });
//                        var active = document.getElementById('checkboxAddANewPersonDialogActive').checked;

//                        var location = {
//                            Name: name,
//                            Abbreviation: abbreviation,
//                            Id: guid,
//                            Style: 'display:block;'
//                        };
//                        thiz.options.jsonTreeState.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items.push(location);
//                        $("#divAddAnOrgItemDialog").dialog('close');
//                        thiz.renderLocationEditor();
//                    } else {
//                        alert('Please enter a name (5 characters or more) and an abbreviation (2 characters or more).');
//                    }
//                } catch (e) {
//                    console.log('Exception in divAddAnOrgItemDialogSubmitButton.click(): ' + e.message + ', ' + e.stack);
//                }
//            });
//        } catch (e) {
//            console.log('Exception in addALocation(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    editDivision: function (divisionIndex, groupIndex, entityIndex) {
//        try {
//            console.log('In editDivision().');
//            var thiz = this;
//            document.getElementById('spanAddAnOrgItemDialogTitle').innerHTML = 'Edit Division';
//            document.getElementById('divAddAnOrgItemDialogSubmitButton').innerHTML = 'Save';

//            document.getElementById('txtAddAnOrgItemDialogName').value = this.options.jsonTreeState.Divisions.Items[divisionIndex].Name;
//            document.getElementById('txtAddANewPersonDialogAbbreviation').value = this.options.jsonTreeState.Divisions.Items[divisionIndex].Abbreviation;
//            document.getElementById('txtAddANewPersonDialogId').value = this.options.jsonTreeState.Divisions.Items[divisionIndex].Id;

//            //
//            // ToDo: Add the click event to this button!
//            //
//            $("#divAddAnOrgItemDialog").dialog({
//                modal: true,
//                resizable: false,
//                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
//                width: '500',
//                dialogClass: "no-close", // No close button in the upper right corner.
//                hide: false, // This means when hiding just disappear with no effects.
//                open: function () {
//                    $('.ui-widget-overlay').bind('click', function () {
//                        $("#divAddAnOrgItemDialog").dialog('close');
//                    });
//                },
//                close: function () {
//                    $('#divAddAnOrgItemDialog').dialog('destroy');
//                }
//            });
//            //$("#divAddAnOrgItemDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

//            $('#divAddAnOrgItemDialogSubmitButton').off('click').click(function (error) {
//                try {
//                    console.log('In editDivision.divAddAnOrgItemDialogSubmitButton.click().');
//                    var name = document.getElementById('txtAddAnOrgItemDialogName').value.trim();
//                    var abbreviation = document.getElementById('txtAddANewPersonDialogAbbreviation').value.trim();
//                    if (name.length > 4 && abbreviation.length > 1) {
//                        // Save the new org entry.
//                        var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//                            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
//                            return v.toString(16);
//                        });
//                        var active = document.getElementById('checkboxAddANewPersonDialogActive').checked;

//                        thiz.options.jsonTreeState.Divisions.Items[divisionIndex].Name = name;
//                        thiz.options.jsonTreeState.Divisions.Items[divisionIndex].Abbreviation = abbreviation;
//                        $("#divAddAnOrgItemDialog").dialog('close');
//                        thiz.renderLocationEditor();
//                    } else {
//                        alert('Please enter a name (5 characters or more) and an abbreviation (2 characters or more).');
//                    }
//                } catch (e) {
//                    console.log('Exception in divAddAnOrgItemDialogSubmitButton.click(): ' + e.message + ', ' + e.stack);
//                }
//            });
//        } catch (e) {
//            console.log('Exception in editDivision(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    editGroup: function (divisionIndex, groupIndex, entityIndex) {
//        try {
//            console.log('In editGroup().');
//            var thiz = this;
//            document.getElementById('spanAddAnOrgItemDialogTitle').innerHTML = 'Edit Group';
//            document.getElementById('divAddAnOrgItemDialogSubmitButton').innerHTML = 'Save';

//            document.getElementById('txtAddAnOrgItemDialogName').value = this.options.jsonTreeState.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Name;
//            document.getElementById('txtAddANewPersonDialogAbbreviation').value = this.options.jsonTreeState.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Abbreviation;
//            document.getElementById('txtAddANewPersonDialogId').value = this.options.jsonTreeState.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Id;

//            //
//            // ToDo: Add the click event to this button!
//            //
//            $("#divAddAnOrgItemDialog").dialog({
//                modal: true,
//                resizable: false,
//                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
//                width: '500',
//                dialogClass: "no-close", // No close button in the upper right corner.
//                hide: false, // This means when hiding just disappear with no effects.
//                open: function () {
//                    $('.ui-widget-overlay').bind('click', function () {
//                        $("#divAddAnOrgItemDialog").dialog('close');
//                    });
//                },
//                close: function () {
//                    $('#divAddAnOrgItemDialog').dialog('destroy');
//                }
//            });
//            //$("#divAddAnOrgItemDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

//            $('#divAddAnOrgItemDialogSubmitButton').off('click').click(function (error) {
//                try {
//                    console.log('In editGroup.divAddAnOrgItemDialogSubmitButton.click().');
//                    var name = document.getElementById('txtAddAnOrgItemDialogName').value.trim();
//                    var abbreviation = document.getElementById('txtAddANewPersonDialogAbbreviation').value.trim();
//                    if (name.length > 4 && abbreviation.length > 1) {
//                        // Save the new org entry.
//                        var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//                            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
//                            return v.toString(16);
//                        });
//                        var active = document.getElementById('checkboxAddANewPersonDialogActive').checked;

//                        thiz.options.jsonTreeState.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Name = name;
//                        thiz.options.jsonTreeState.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Abbreviation = abbreviation;
//                        $("#divAddAnOrgItemDialog").dialog('close');
//                        thiz.renderLocationEditor();
//                    } else {
//                        alert('Please enter a name (5 characters or more) and an abbreviation (2 characters or more).');
//                    }
//                } catch (e) {
//                    console.log('Exception in divAddAnOrgItemDialogSubmitButton.click(): ' + e.message + ', ' + e.stack);
//                }
//            });
//        } catch (e) {
//            console.log('Exception in editGroup(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    editLegalEntity: function (divisionIndex, groupIndex, entityIndex) {
//        try {
//            console.log('In editLegalEntity().');
//            var thiz = this;
//            document.getElementById('spanAddAnOrgItemDialogTitle').innerHTML = 'Edit Legal Entity';
//            document.getElementById('divAddAnOrgItemDialogSubmitButton').innerHTML = 'Save';

//            document.getElementById('txtAddAnOrgItemDialogName').value = this.options.jsonTreeState.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Name;
//            document.getElementById('txtAddANewPersonDialogAbbreviation').value = this.options.jsonTreeState.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Abbreviation;
//            document.getElementById('txtAddANewPersonDialogId').value = this.options.jsonTreeState.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Id;

//            //
//            // ToDo: Add the click event to this button!
//            //
//            $("#divAddAnOrgItemDialog").dialog({
//                modal: true,
//                resizable: false,
//                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
//                width: '500',
//                dialogClass: "no-close", // No close button in the upper right corner.
//                hide: false, // This means when hiding just disappear with no effects.
//                open: function () {
//                    $('.ui-widget-overlay').bind('click', function () {
//                        $("#divAddAnOrgItemDialog").dialog('close');
//                    });
//                },
//                close: function () {
//                    $('#divAddAnOrgItemDialog').dialog('destroy');
//                }
//            });
//            //$("#divAddAnOrgItemDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

//            $('#divAddAnOrgItemDialogSubmitButton').off('click').click(function (error) {
//                try {
//                    console.log('In editLegalEntity.divAddAnOrgItemDialogSubmitButton.click().');
//                    var name = document.getElementById('txtAddAnOrgItemDialogName').value.trim();
//                    var abbreviation = document.getElementById('txtAddANewPersonDialogAbbreviation').value.trim();
//                    if (name.length > 4 && abbreviation.length > 1) {
//                        // Save the new org entry.
//                        var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//                            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
//                            return v.toString(16);
//                        });
//                        var active = document.getElementById('checkboxAddANewPersonDialogActive').checked;

//                        thiz.options.jsonTreeState.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Name = name;
//                        thiz.options.jsonTreeState.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Abbreviation = abbreviation;
//                        $("#divAddAnOrgItemDialog").dialog('close');
//                        thiz.renderLocationEditor();
//                    } else {
//                        alert('Please enter a name (5 characters or more) and an abbreviation (2 characters or more).');
//                    }
//                } catch (e) {
//                    console.log('Exception in divAddAnOrgItemDialogSubmitButton.click(): ' + e.message + ', ' + e.stack);
//                }
//            });
//        } catch (e) {
//            console.log('Exception in editLegalEntity(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    editLocation: function (divisionIndex, groupIndex, entityIndex, locationIndex1) {
//        try {
//            console.log('In editLocation().');
//            var thiz = this;
//            document.getElementById('spanAddAnOrgItemDialogTitle').innerHTML = 'Edit Location';
//            document.getElementById('divAddAnOrgItemDialogSubmitButton').innerHTML = 'Save';
//            //debugger;
//            document.getElementById('txtAddAnOrgItemDialogName').value = this.options.jsonTreeState.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex1].Name;
//            document.getElementById('txtAddANewPersonDialogAbbreviation').value = this.options.jsonTreeState.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex1].Abbreviation;
//            document.getElementById('txtAddANewPersonDialogId').value = this.options.jsonTreeState.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex1].Id;

//            //
//            // ToDo: Add the click event to this button!
//            //
//            $("#divAddAnOrgItemDialog").dialog({
//                modal: true,
//                resizable: false,
//                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
//                width: '500',
//                dialogClass: "no-close", // No close button in the upper right corner.
//                hide: false, // This means when hiding just disappear with no effects.
//                open: function () {
//                    $('.ui-widget-overlay').bind('click', function () {
//                        $("#divAddAnOrgItemDialog").dialog('close');
//                    });
//                },
//                close: function () {
//                    $('#divAddAnOrgItemDialog').dialog('destroy');
//                }
//            });
//            //$("#divAddAnOrgItemDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

//            $('#divAddAnOrgItemDialogSubmitButton').off('click').click(function (error) {
//                try {
//                    console.log('In editLocation.divAddAnOrgItemDialogSubmitButton.click().');
//                    var name = document.getElementById('txtAddAnOrgItemDialogName').value.trim();
//                    var abbreviation = document.getElementById('txtAddANewPersonDialogAbbreviation').value.trim();
//                    if (name.length > 4 && abbreviation.length > 1) {
//                        // Save the new org entry.
//                        var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//                            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
//                            return v.toString(16);
//                        });
//                        var active = document.getElementById('checkboxAddANewPersonDialogActive').checked;

//                        thiz.options.jsonTreeState.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex1].Name = name;
//                        thiz.options.jsonTreeState.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex1].Abbreviation = abbreviation;
//                        $("#divAddAnOrgItemDialog").dialog('close');
//                        thiz.renderLocationEditor();
//                    } else {
//                        alert('Please enter a name (5 characters or more) and an abbreviation (2 characters or more).');
//                    }
//                } catch (e) {
//                    console.log('Exception in divAddAnOrgItemDialogSubmitButton.click(): ' + e.message + ', ' + e.stack);
//                }
//            });
//        } catch (e) {
//            console.log('Exception in editLocation(): ' + e.message + ', ' + e.stack);
//        }
//    },

//    displayCreateANewRoleDialog: function () {
//        try {
//            console.log('In displayCreateANewRoleDialog().');
//            $("#divCreateANewRoleDialog").dialog({
//                modal: true,
//                resizable: false,
//                //closeText: "Cancel",
//                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
//                title: 'Create a new Role',
//                width: '800',
//                dialogClass: "no-close", // No close button in the upper right corner.
//                hide: false, // This means when hiding just disappear with no effects.
//                open: function () {
//                    $('.ui-widget-overlay').bind('click', function () {
//                        $("#divCreateANewRoleDialog").dialog('close');
//                    });
//                    //document.getElementById('txtCreateANewRoleDialog_RoleId').value = document.getElementById('textNewRoleId').value;
//                    //document.getElementById('txtCreateANewRoleDialog_RoleName').value = document.getElementById('textNewRoleName').value;
//                },
//                close: function () {
//                    $('#divCreateANewRoleDialog').dialog('destroy');
//                }
//            });
//            $("#divCreateANewRoleDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();


//        } catch (e) {
//            console.log('Exception in displayCreateANewRoleDialog(): ' + e.message + ', ' + e.stack);
//        }
//    },

//    renderEditSteprow: function (elementId) {
//        try {
//            console.log('In renderEditSteprow().');
//            var thiz = this;
//            //thiz.showProgress('Loading...');
//            $('.activeEditRow').remove(); // This gets rid of the row editor... we should only display one at a time.
//            $('.steprow-hidden').removeClass('steprow-hidden'); // Display the previous row again (if there is one).
//            // Get the values from the hidden row.
//            var roleid = $('#' + elementId).find('.roleid').attr('bwOldValue');
//            var rolename = $('#' + elementId).find('.rolename').attr('bwOldValue');
//            var rolecategory = $('#' + elementId).find('.rolecategory').attr('bwOldValue');
//            var tasks = $('#' + elementId).find('.tasks').attr('bwOldValue');
//            var timeout = $('#' + elementId).find('.timeout').attr('bwOldValue');
//            var cond = $('#' + elementId).find('.cond').attr('bwOldValue');
//            console.log('In renderEditSteprow. roleid: ' + roleid + ', rolename: ' + rolename + ', rolecategory: ' + rolecategory + ', tasks: ' + tasks + ', timeout: ' + timeout + ', cond: ' + cond);
//            //
//            var html = '';
//            html += '<tr class="activeEditRow">';
//            //
//            html += '<td style="width:30px;"></td>';
//            //html += '<td style="vertical-align:top;">';

//            //html += '  <table style="width:100%;">';
//            //html += '  <tr>';
//            //html += '    <td>';
//            //html += '      <input type="button" style="width:100%;" value="Save" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveAssignmentRow\', \'' + elementId + '\');" />';
//            //html += '    </td>';
//            //html += '  </tr>';
//            //html += '  <tr>';
//            //html += '    <td>';
//            //html += '      <input type="button" style="width:100%;" value="Delete" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'deleteRoleCategory\', \'' + elementId + '\');" />';
//            //html += '    </td>';
//            //html += '  </tr>';
//            //html += '  <tr>';
//            //html += '    <td>';
//            //html += '      <input type="button" style="width:100%;" value="Cancel" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'cancelStepRowEditing\', \'' + elementId + '\');" />';
//            //html += '    </td>';
//            //html += '  </tr>';
//            //html += '  <tr>';
//            //html += '    <td>';
//            //html += '      <input type="button" style="width:100px;white-space:normal;overflow-wrap:break-word;" value="Configure Email Notifications" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayConfigureEmailNotificationsDialog\', \'' + elementId + '\');" />';
//            //html += '    </td>';
//            //html += '  </tr>';
//            //html += '  </table>';

//            //html += '</td>';
//            //

//            if (thiz.options.displayRoleIdColumn) {
//                html += '<td class="steprowcell">' + roleid + '</td>';
//            }





//            html += '<td class="selectroleorperson-editcell steprowcell">';
//            //html += ' <img style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayPeoplePickerDialog\', \'' + 'txtApprover2FriendlyName' + '\', \'' + 'txtApprover2Id' + '\', \'' + 'txtApprover2Email' + '\');" src="images/addressbook-icon18x18.png">';
//            //html += '&nbsp;' + rolename;
//            html += '</td>';







//            // Render the "RoleCategory" drop-down.
//            html += '<td class="steprowcell">';
//            html += '<select style="padding:5px 5px 5px 5px;" id="selectRoleCategory" class="rolecategory-dropdown" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'RoleCategoryDropDown_Onchange\', \'' + elementId + '\');">';
//            var rcs = ['Inform', 'Collaborator', 'Approver'];
//            var rcs2 = ['Inform (Informed)', 'Collaborator (Consulted)', 'Approver (Accountable)'];
//            for (var rci = 0; rci < rcs.length; rci++) {
//                if (rolecategory == rcs[rci]) {
//                    html += '  <option value="' + rcs[rci] + '" selected>' + rcs2[rci] + '</option>';
//                } else {
//                    html += '  <option value="' + rcs[rci] + '">' + rcs2[rci] + '</option>';
//                }
//            }
//            html += '</select>';
//            html += '</td>';

//            html += '<td class="actions-editcell steprowcell"></td>';
//            // This gets render below using thiz.renderActionsSection(); It gets populated there as well.

//            //html += '<td></td>';
//            //html += '<td></td>';
//            //html += '<td></td>';
//            //html += '<td></td>';

//            //html += '<td class="timeout-editcell steprowcell"></td>';

//            html += '<td class="conditions-editcell steprowcell"></td>';

//            html += '<td style="vertical-align:top;">';

//            html += '  <table style="width:100%;">';
//            html += '  <tr>';
//            html += '    <td>';
//            html += '      <input type="button" style="width:100%;" value="Save" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveAssignmentRow\', \'' + elementId + '\');" />';
//            html += '    </td>';
//            html += '  </tr>';
//            html += '  <tr>';
//            html += '    <td>';
//            html += '      <input type="button" style="width:100%;" value="Delete" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'deleteRoleCategory\', \'' + elementId + '\');" />';
//            html += '    </td>';
//            html += '  </tr>';
//            html += '  <tr>';
//            html += '    <td>';
//            html += '      <input type="button" style="width:100%;" value="Cancel" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'cancelStepRowEditing\', \'' + elementId + '\');" />';
//            html += '    </td>';
//            html += '  </tr>';
//            //html += '  <tr>';
//            //html += '    <td>';
//            //html += '      <input type="button" style="width:100px;white-space:normal;overflow-wrap:break-word;" value="Configure Email Notifications" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayConfigureEmailNotificationsDialog\', \'' + elementId + '\');" />';
//            //html += '    </td>';
//            //html += '  </tr>';
//            html += '  </table>';

//            html += '</td>';

//            html += '</tr>';

//            //var elementId = element.id;
//            thiz.disableScrolling(); // This keeps the screen from jumping around.

//            $('#' + elementId).closest('tr').after(html); // Render the whole thing




//            thiz.renderSelectRoleOrPersonSection(elementId);




//            // BEGIN: Populate the actions section (check the checkboxes).
//            thiz.renderActionsSection(elementId); // render the actions section
//            if (rolecategory == 'Approver') { // Populate the actions ection
//                var actions = ['Approve', 'Cancel', 'Decline', 'Revise/Hold'];
//                var x = elementId.split('_')[1];
//                var step = x.split('_')[0];
//                var row = elementId.split('_')[2];
//                for (var i = 0; i < actions.length; i++) {
//                    var actionChecked = false;
//                    var requireCommentsChecked = false;
//                    if (tasks) {
//                        for (var t = 0; t < tasks.split('|').length; t++) {
//                            var x = tasks.split('|')[t];
//                            var task = x.split('~')[0];
//                            var requireComments = x.split('~')[1];
//                            if (task == actions[i]) {
//                                actionChecked = true;
//                                if (requireComments && Boolean(requireComments.toLowerCase()) == true) {
//                                    requireCommentsChecked = true;
//                                }
//                            }
//                        }
//                    }

//                    var checkboxId = 'Action-' + actions[i] + '_' + step + '_' + row;
//                    var childCheckboxId = 'RequireComments-' + actions[i] + '_' + step + '_' + row;
//                    if (actionChecked) {
//                        document.getElementById(checkboxId).checked = true;
//                        if (requireCommentsChecked) {
//                            document.getElementById(childCheckboxId).checked = true;
//                        }
//                    } else {
//                        document.getElementById(checkboxId).checked = false;
//                        document.getElementById(childCheckboxId).checked = false;
//                    }
//                }
//            }
//            // END: Render and Populate the actions section

//            //thiz.renderTimeoutSection(elementId);
//            //debugger;
//            thiz.renderConditionsSection(elementId, cond);

//            $('#' + elementId).addClass('steprow-hidden'); // Hide the row while we display it in editable-mode. This allows us to display it again when done editng, and also gives us a place to look up the old values.
//            thiz.enableScrolling(); // This keeps the screen from jumping around.
//            //thiz.hideProgress();



//        } catch (e) {
//            console.log('Exception in renderEditSteprow(): ' + e.message + ', ' + e.stack);
//        }
//    },







//    displayAddANewPersonDialog: function () {
//        try {
//            console.log('In displayAddANewPersonDialog().');
//            if (!participantId) {
//                console.log('In displayAddANewPersonDialog(). User is not logged in, so displaying the logon.');
//                initializeTheLogon(); // The user needs to be logged in before they add anyone.
//            } else {
//                $("#divAddANewPersonDialog").dialog({
//                    modal: true,
//                    resizable: false,
//                    //closeText: "Cancel",
//                    closeOnEscape: false, // Hit the ESC key to hide! Yeah!
//                    title: 'Add a New Person',
//                    width: '800',
//                    dialogClass: "no-close", // No close button in the upper right corner.
//                    hide: false, // This means when hiding just disappear with no effects.
//                    open: function () {
//                        $('.ui-widget-overlay').bind('click', function () {
//                            $("#divAddANewPersonDialog").dialog('close');
//                        });
//                        //document.getElementById('txtCreateANewRoleDialog_RoleId').value = document.getElementById('textNewRoleId').value;
//                        //document.getElementById('txtCreateANewRoleDialog_RoleName').value = document.getElementById('textNewRoleName').value;
//                    },
//                    close: function () {
//                        //$(this).dialog('destroy').remove();
//                    }
//                });
//                $("#divAddANewPersonDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
//            }
//        } catch (e) {
//            console.log('Exception in displayAddANewPersonDialog(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    //createANewRole: function () {
//    //    try {
//    //        console.log('In createANewRole().');
//    //        // Make sure the RoleId is 2 or more charcaters. Make sure the RoleName is longer than 5 characters.
//    //        var thiz = this;
//    //        var roleId = document.getElementById('txtCreateANewRoleDialog_RoleId').value;
//    //        var roleName = document.getElementById('txtCreateANewRoleDialog_RoleName').value;
//    //        if (roleId && roleName) {
//    //            if (roleId.length > 1 && roleName.length > 4) {
//    //                // Ajax call to save the new role.
//    //                var json = {
//    //                    RoleId: roleId,
//    //                    RoleName: roleName,
//    //                    RoleBits: 17,
//    //                    IsWorkflowRole: true
//    //                };
//    //                $.ajax({
//    //                    url: thiz.options.operationUriPrefix + "odata/Roles",
//    //                    dataType: "json",
//    //                    contentType: "application/json",
//    //                    type: "Post",
//    //                    data: JSON.stringify(json)
//    //                }).done(function (result) {
//    //                    try {
//    //                        console.log('In raci.html.createANewRole().xx.update: Successfully updated DB.');
//    //                        $("#divMessageDialog").dialog({
//    //                            modal: true,
//    //                            resizable: false,
//    //                            //closeText: "Cancel",
//    //                            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
//    //                            //title: 'Project Type picker',
//    //                            width: '800',
//    //                            dialogClass: 'no-close', // No close button in the upper right corner.
//    //                            hide: false, // This means when hiding just disappear with no effects.
//    //                            open: function () {
//    //                                $("#divCreateANewRoleDialog").dialog('close');
//    //                                $('.ui-widget-overlay').bind('click', function () {
//    //                                    $('#divMessageDialog').dialog('close');
//    //                                });
//    //                                document.getElementById('spanMessageDialogTitle').innerHTML = 'Role CREATED';
//    //                                document.getElementById('spanMessageDialogContentTop').innerHTML = 'This role has been created. Your screen will refresh, and the new role will be immediately available.';
//    //                                document.getElementById('spanMessageDialogContentBottom').innerHTML = 'This role has no users assigned to it. You must do this before any new CARs are processed by this role.';
//    //                            },
//    //                            close: function () {
//    //                                location.reload(); // When the user closes this dialog, we regenerate the screen to reflect the newly created and activated workflow.
//    //                            }
//    //                        });
//    //                        $('#divMessageDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
//    //                    } catch (e) {
//    //                        console.log('Exception in raci.html.createANewRole().xx.update: ' + e.message + ', ' + e.stack);
//    //                    }
//    //                }).fail(function (data) {
//    //                    //thiz.hideProgress();
//    //                    var msg;
//    //                    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
//    //                        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
//    //                    } else {
//    //                        msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
//    //                    }
//    //                    alert('Fail in raci.html.createANewRole().xx.update: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
//    //                    console.log('Fail in raci.html.createANewRole().xx.update: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
//    //                    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
//    //                    //var error = JSON.parse(data.responseText)["odata.error"];
//    //                    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
//    //                });
//    //            } else {
//    //                alert('ERROR: Cannot save these values. RoleId must be 2 or more characters, and RoleName must be 5 or more charcters.');
//    //            }
//    //        } else {
//    //            alert('ERROR: Cannot save these values. RoleId must be 2 or more characters, and RoleName must be 5 or more charcters.');
//    //        }
//    //    } catch (e) {
//    //        console.log('Exception in createANewRole(): ' + e.message + ', ' + e.stack);
//    //    }
//    //},
//    addARaciStep: function () {
//        try {
//            console.log('InaddARaciStep().');
//            //var newStepCount = 0;
//            //for (var i = 0; i < this.options.store.RaciSteps.length; i++) {
//            //    if (this.options.store.RaciSteps[i].StepName == ('NewStep' + newStepCount)) {
//            //        newStepCount++;
//            //    }
//            //}
//            var stepGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
//                return v.toString(16);
//            });

//            var step = {
//                StepName: "NewStep-" + stepGuid,
//                InformRoles: [
//                {
//                    RoleId: 'Choose a role...',
//                    RoleName: 'Choose a role...',
//                    IdField: ''
//                }
//                ],
//                AssignRoles: [
//                {
//                    RoleId: 'Choose a role...',
//                    RoleName: 'Choose a role...',
//                    RoleCategory: 'Choose a role category...',
//                    Participants: [
//                    {
//                        UserId: 0,
//                        UserName: 'Choose a user...',
//                        UserEmail: 'Choose a user'
//                    }]
//                }
//                ]
//            };
//            this.options.store.RaciSteps.push(step);

//            //alert('In addARaciStep(). this.options.store: ' + JSON.stringify(this.options.store));

//            this._create();
//        } catch (e) {
//            console.log('Exception in addARaciStep(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    addNewRow: function (elementId) {
//        try {
//            console.log('In addNewRow(). elementId: ' + elementId);
//            //this.disableButton('buttonAddNewAssignmentRow');
//            var thiz = this;
//            var x = elementId.split('_')[0];
//            var stepIndex = elementId.split('_')[1]; // eg: 3
//            var roleIndex = elementId.split('_')[2]; // eg: 8
//            this.cancelStepRowEditing(elementId); // This cancels the diting row from a previous edit. There can only be one at a time.
//            var html = '';
//            html += '<tr class="activeEditRow">'; // activeEditRow lets us determin what is being edited, and be able to close/remove them all at once when we want to.


//            //html += '<td style="vertical-align:top;">';

//            ////html += '  <table style="width:100%;">';
//            ////html += '  <tr>';
//            ////html += '    <td>';
//            ////html += '      <input type="button" style="width:100%;" value="Save" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveAssignmentRow\', \'' + elementId + '\', \'' + 'xx' + '\');" />';
//            ////html += '    </td>';
//            ////html += '  </tr>';
//            ////html += '  <tr>';
//            ////html += '    <td>';
//            ////html += '      <input type="button" style="width:100%;" value="Cancel" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'cancelStepRowEditing\', \'' + elementId + '\', \'' + 'xx' + '\');" />';
//            ////html += '    </td>';
//            ////html += '  </tr>';
//            ////html += '  </table>';

//            //html += '  <table style="width:100%;">';
//            //html += '  <tr>';
//            //html += '    <td>';
//            //html += '      <input type="button" style="width:100%;" value="Save" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveAssignmentRow\', \'' + elementId + '\');" />';
//            //html += '    </td>';
//            //html += '  </tr>';
//            ////html += '  <tr>';
//            ////html += '    <td>';
//            ////html += '      <input type="button" style="width:100%;" value="Delete" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'deleteRoleCategory\', \'' + elementId + '\');" />';
//            ////html += '    </td>';
//            ////html += '  </tr>';
//            //html += '  <tr>';
//            //html += '    <td>';
//            //html += '      <input type="button" style="width:100%;" value="Cancel" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'cancelStepRowEditing\', \'' + elementId + '\');" />';
//            //html += '    </td>';
//            //html += '  </tr>';
//            //html += '  <tr>';
//            //html += '    <td>';
//            //html += '      <input type="button" style="width:100px;white-space:normal;overflow-wrap:break-word;" value="Configure Email Notifications" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayConfigureEmailNotificationsDialog\', \'' + elementId + '\');" />';
//            //html += '    </td>';
//            //html += '  </tr>';
//            //html += '  </table>';


//            //html += '</td>';

//            html += '<td></td>';


//            // Populate the "Roles" drop down.

//            $.ajax({
//                url: this.options.operationUriPrefix + "odata/Roles?$filter=IsWorkflowRole eq true",
//                dataType: "json",
//                contentType: "application/json",
//                type: "Get",
//                timeout: this.options.ajaxTimeout
//            }).done(function (result) {
//                try {
//                    //console.log('In raci.html.displayOrgMultiPicker().Get[odata/Orgs].done: result: ' + JSON.stringify(result));
//                    var roles;
//                    if (result) {
//                        roles = result.value;
//                    } else {
//                        console.log('In raci.html.addNewRow().Get[odata/Roles].done: result: ' + JSON.stringify(result));
//                    }

//                    if (thiz.options.displayRoleIdColumn) {
//                        html += '<td class="steprowcell">';
//                        //html += '<span class="selectarow-labeltext">Select a role:</span>';
//                        //html += '<br />';
//                        html += '<select id="selectRoleId"  onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'RoleDropDown_Onchange\', \'' + 'selectRoleId' + '\');">';
//                        html += '  <option value=""></option>';
//                        for (var i = 0; i < roles.length; i++) {
//                            html += '  <option value="' + roles[i].RoleId + '">' + roles[i].RoleId + '</option>';
//                        }
//                        html += '</select>';
//                        //html += '<br />or create a new role:'; //<br /><input id="textNewRoleId" type="text" style="width:75pt;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewRoleTextBox_Onkeyup\', \'' + 'textNewRoleId' + '\');" />';
//                        html += '<br /><input style="padding:5px 10px 5px 10px;" id="btnCreateRole1" type="button" value="Create a Role..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayCreateANewRoleDialog\');" />';

//                        html += '<br />or select a person:'; //<br /><input id="textNewRoleId" type="text" style="width:75pt;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewRoleTextBox_Onkeyup\', \'' + 'textNewRoleId' + '\');" />';
//                        html += '<br /><input style="padding:5px 10px 5px 10px;" id="btnCreateRole1" type="button" value="Select Person..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayCreateANewRoleDialog\');" />';

//                        //html += '<br />or add a new person:'; //<br /><input id="textNewRoleId" type="text" style="width:75pt;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewRoleTextBox_Onkeyup\', \'' + 'textNewRoleId' + '\');" />';
//                        html += '<br /><input style="padding:5px 10px 5px 10px;" id="btnCreateRole1" type="button" value="Add a Person..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayCreateANewRoleDialog\');" />';

//                        html += '</td > ';
//                    }





//                    html += '<td class="selectroleorperson-editcell steprowcell">';
//                    //html += '<span class="selectarow-labeltext">Select a role:</span>';
//                    //html += '<br />';
//                    ////html += ' <img style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayPeoplePickerDialog\', \'' + 'txtApprover2FriendlyName' + '\', \'' + 'txtApprover2Id' + '\', \'' + 'txtApprover2Email' + '\');" src="images/addressbook-icon18x18.png">';
//                    ////html == '&nbsp;&nbsp;';
//                    //html += '<select id="selectRoleName"  onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'RoleDropDown_Onchange\', \'' + 'selectRoleName' + '\');">';
//                    //html += '  <option value=""></option>';
//                    //for (var i = 0; i < roles.length; i++) {
//                    //    html += '  <option value="' + roles[i].RoleId + '">' + roles[i].RoleName + '</option>';
//                    //}
//                    //html += '</select>';
//                    ////html += '<br />or create a new role:'; //<br /><input id="textNewRoleName" type="text" style="width:210pt;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewRoleTextBox_Onkeyup\', \'' + 'textNewRoleName' + '\');" />';
//                    //html += '<br /><input id="btnCreateRole2" type="button" value="Create a Role..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayCreateANewRoleDialog\');" />';

//                    //html += '<br />or select a person:'; //<br /><input id="textNewRoleId" type="text" style="width:75pt;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewRoleTextBox_Onkeyup\', \'' + 'textNewRoleId' + '\');" />';
//                    //html += '<br /><img style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayPeoplePickerDialog\', \'' + 'txtApprover2FriendlyName' + '\', \'' + 'txtApprover2Id' + '\', \'' + 'txtApprover2Email' + '\');" src="images/addressbook-icon18x18.png">';
//                    //html == '&nbsp;&nbsp;';
//                    //html += '<input id="btnCreateRole1" type="button" value="Select Person..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayCreateANewRoleDialog\');" />';

//                    ////html += '<br />or add a new person:'; //<br /><input id="textNewRoleId" type="text" style="width:75pt;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewRoleTextBox_Onkeyup\', \'' + 'textNewRoleId' + '\');" />';
//                    //html += '<br /><input id="btnCreateRole1" type="button" value="Add a Person..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayCreateANewRoleDialog\');" />';

//                    html += '</td > ';








//                    // The "RoleCategory" dropdown.
//                    html += '<td class="steprowcell">';
//                    html += '<select style="padding:5px 5px 5px 5px;" id="selectRoleCategory" class="rolecategory-dropdown" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'RoleCategoryDropDown_Onchange\', \'' + thiz.id + '\');">';
//                    var stepName = thiz.options.store.Workflow.Steps.Step[stepIndex]["@Name"];
//                    var rcs;
//                    var rcs2 = ['Inform (Informed)', 'Collaborator (Consulted)', 'Approver (Accountable)'];
//                    if (stepName == 'Done') {
//                        rcs = ['Inform']; // The "Completed" step can only have the "Inform" role category.
//                    } else {
//                        rcs = ['Inform', 'Collaborator', 'Approver'];
//                    }
//                    for (var i = 0; i < rcs.length; i++) {
//                        html += '  <option value="' + rcs[i] + '">' + rcs2[i] + '</option>';
//                    }
//                    html += '</select>';
//                    html += '</td > ';

//                    // The "Actions" cell. This gets rendered below using thiz.renderActionsSection().
//                    html += '<td id="action-cell_' + stepIndex + '_' + roleIndex + '" class="actions-editcell steprowcell"></td>';

//                    //html += '<td></td>';
//                    //html += '<td></td>';
//                    //html += '<td></td>';
//                    //html += '<td></td>';

//                    // The "timeout" cell. This gets rendered below using thiz.renderTimeoutSection().
//                    //html += '<td class="timeout-editcell steprowcell"></td>';

//                    // Render the "Cond" cell. This gets rendered below using thiz.renderConditionsSection().
//                    html += '<td class="conditions-editcell steprowcell">';

//                    html += '</td>';








//                    html += '<td style="vertical-align:top;">';

//                    //html += '  <table style="width:100%;">';
//                    //html += '  <tr>';
//                    //html += '    <td>';
//                    //html += '      <input type="button" style="width:100%;" value="Save" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveAssignmentRow\', \'' + elementId + '\', \'' + 'xx' + '\');" />';
//                    //html += '    </td>';
//                    //html += '  </tr>';
//                    //html += '  <tr>';
//                    //html += '    <td>';
//                    //html += '      <input type="button" style="width:100%;" value="Cancel" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'cancelStepRowEditing\', \'' + elementId + '\', \'' + 'xx' + '\');" />';
//                    //html += '    </td>';
//                    //html += '  </tr>';
//                    //html += '  </table>';

//                    html += '  <table style="width:100%;">';
//                    html += '  <tr>';
//                    html += '    <td>';
//                    html += '      <input type="button" style="width:100%;" value="Save" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveAssignmentRow\', \'' + elementId + '\');" />';
//                    html += '    </td>';
//                    html += '  </tr>';
//                    //html += '  <tr>';
//                    //html += '    <td>';
//                    //html += '      <input type="button" style="width:100%;" value="Delete" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'deleteRoleCategory\', \'' + elementId + '\');" />';
//                    //html += '    </td>';
//                    //html += '  </tr>';
//                    html += '  <tr>';
//                    html += '    <td>';
//                    html += '      <input type="button" style="width:100%;" value="Cancel" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'cancelStepRowEditing\', \'' + elementId + '\');" />';
//                    html += '    </td>';
//                    html += '  </tr>';
//                    //html += '  <tr>';
//                    //html += '    <td>';
//                    //html += '      <input type="button" style="width:100px;white-space:normal;overflow-wrap:break-word;" value="Configure Email Notifications" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayConfigureEmailNotificationsDialog\', \'' + elementId + '\');" />';
//                    //html += '    </td>';
//                    //html += '  </tr>';
//                    html += '  </table>';


//                    html += '</td>';















//                    html += '</tr>';

//                    // It is a new row, to be displayed at the top.
//                    $('#stepheaderrow_' + stepIndex).after(html);


//                    thiz.renderSelectRoleOrPersonSection(elementId);


//                    thiz.renderActionsSection(elementId); // render the actions section
//                    //thiz.renderTimeoutSection(elementId); // render the timeout section
//                    thiz.renderConditionsSection(elementId); // render the condition section
//                } catch (e) {
//                    //lpSpinner.Hide();
//                    //$('.buttonAddNewAssignmentRow').attr('disabled', false); // Disables these buttons while there is the editor row displaying.
//                    console.log('Exception in raci.html.addNewRow().Get[odata/Roles].done: ' + e.message + ', ' + e.stack);
//                }
//            }).fail(function (data) {
//                //lpSpinner.Hide();
//                //$('.buttonAddNewAssignmentRow').attr('disabled', false); // Disables these buttons while there is the editor row displaying.
//                var msg;
//                if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
//                    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
//                } else {
//                    msg = JSON.stringify(data);
//                }
//                alert('Error in raci.html.addNewRow().Get[odata/Roles].fail: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
//                console.log('Error in raci.html.addNewRow().Get[odata/Roles].fail:' + JSON.stringify(data));
//                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
//                //var error = JSON.parse(data.responseText)["odata.error"];
//                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
//            });
//            //}
//        } catch (e) {
//            //$('.buttonAddNewAssignmentRow').attr('disabled', false); // Disables these buttons while there is the editor row displaying.
//            console.log('Exception in addNewRow(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    deleteStep: function () {
//        try {
//            console.log('In deleteStep().');
//            alert('In deleteStep: This functionality is incomplete.');
//        } catch (e) {
//            console.log('Exception in deleteStep(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    deleteRoleCategory: function (elementId) {
//        try {
//            console.log('In deleteRoleCategory(). : ' + elementId);
//            var x = elementId.split('_')[0];
//            var sourceRoleCategory = x.split('-')[1]; // "inform" or "assign"
//            var stepIndex = elementId.split('_')[1]; // eg: 3
//            var roleIndex = elementId.split('_')[2]; // eg: 8
//            //if (confirm("Please confirm you wish to delete this role/rolecategory from this step. This will not affect the workflow until it has been saved & activated.")) {
//            if (stepIndex && sourceRoleCategory && roleIndex > -1) {
//                if (sourceRoleCategory == 'inform') {
//                    this.options.store.Workflow.Steps.Step[stepIndex].OnStart.Inform.splice(roleIndex, 1); // delete leaves a null, so we have to use splice.
//                } else if (sourceRoleCategory == 'assign') {
//                    this.options.store.Workflow.Steps.Step[stepIndex].Assign.splice(roleIndex, 1); // delete leaves a null, so we have to use splice.
//                } else {
//                    alert('ERROR: Invalid sourceRoleCategory in deleteRoleCategory().'); // We should never get here.
//                }
//            } else {
//                // We should never get here!!!
//                alert('ERROR: Failed to locate the step or role in the underlying json in deleteRoleCategory().');
//            }
//            this._create();
//            //} else {
//            //    // do nothing.
//            //}
//        } catch (e) {
//            console.log('Exception in deleteRoleCategory(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    activateRaciConfiguration: function () {
//        try {
//            var thiz = this;
//            var workflowToActivate_Id;
//            $('#spanWorkflowsDropDownList').find('option:selected').each(function (index, element) {
//                workflowToActivate_Id = element.value;
//            });
//            console.log('In activateRaciConfiguration(). workflowToActivate_Id: ' + workflowToActivate_Id);
//            if (confirm("Are you certain you wish to activate this workflow?")) {
//                this.showProgress('Activating your Selected Workflow...');
//                // First we have to deactivate the existing active workflow. Get the Id first, then mark as inactive.
//                $.ajax({
//                    url: thiz.options.operationUriPrefix + "odata/WorkflowConfiguration/" + tenantId + '/' + workflowAppId, //?$filter=Active eq true",
//                    dataType: "json",
//                    contentType: "application/json",
//                    type: "Get",
//                    timeout: thiz.options.ajaxTimeout
//                }).done(function (result) {
//                    try {
//                        var workflow = result.value;
//                        if (workflow.length != 1) {
//                            alert('ERROR: An incorrect number of workflows are marked as active! This process cannot continue. There can only be 1 active workflow.');
//                        } else {
//                            var workflowToDeactivate_Id = workflow[0].Id;
//                            var json = {
//                                Active: false
//                            };
//                            $.ajax({
//                                url: thiz.options.operationUriPrefix + "odata/WorkflowConfiguration('" + workflowToDeactivate_Id + "')",
//                                dataType: "json",
//                                contentType: "application/json",
//                                type: "Patch",
//                                data: JSON.stringify(json)
//                            }).done(function (result) {
//                                try {
//                                    console.log('In raci.html.activateRaciConfiguration.update: Successfully updated DB using (' + JSON.stringify(json) + ').');
//                                    // Now set this one to Active.
//                                    var json = {
//                                        Active: true
//                                    };
//                                    $.ajax({
//                                        url: thiz.options.operationUriPrefix + "odata/WorkflowConfiguration('" + workflowToActivate_Id + "')",
//                                        dataType: "json",
//                                        contentType: "application/json",
//                                        type: "Patch",
//                                        data: JSON.stringify(json)
//                                    }).done(function (result) {
//                                        try {
//                                            console.log('In raci.html.activateRaciConfiguration().xx.update: Successfully updated DB using (' + JSON.stringify(json) + ').');
//                                            // Display a dialog with an "Undo" button!!!!
//                                            //alert('Successfully updated the database. THIS WORKFLOW CHANGE WILL TAKE PLACE IMMEDIATELY!');
//                                            $("#divUndoWorkflowActivationDialog").dialog({
//                                                modal: true,
//                                                resizable: false,
//                                                //closeText: "Cancel",
//                                                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
//                                                title: 'Project Type picker',
//                                                width: '800',
//                                                dialogClass: 'no-close', // No close button in the upper right corner.
//                                                hide: false, // This means when hiding just disappear with no effects.
//                                                open: function () {
//                                                    try {
//                                                        $('.ui-widget-overlay').bind('click', function () {
//                                                            $('#divUndoWorkflowActivationDialog').dialog('close');
//                                                        });
//                                                    } catch (e) {
//                                                        console.log('Exception in activateRaciConfiguration().divUndoWorkflowActivationDialog.open(): ' + e.message + ', ' + e.stack);
//                                                    }
//                                                },
//                                                close: function () {
//                                                    location.reload(); // When the user closes this dialog, we regenerate the screen to reflect the newly created and activated workflow.
//                                                }
//                                            });
//                                            $('#divUndoWorkflowActivationDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
//                                        } catch (e) {
//                                            console.log('Exception in raci.html.activateRaciConfiguration().xx.update: ' + e.message + ', ' + e.stack);
//                                        }
//                                    }).fail(function (data) {
//                                        thiz.hideProgress();
//                                        var msg;
//                                        if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
//                                            msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
//                                        } else {
//                                            msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
//                                        }
//                                        alert('Fail in raci.html.activateRaciConfiguration().xx.update: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
//                                        console.log('Fail in raci.html.activateRaciConfiguration().xx.update: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
//                                        //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
//                                        //var error = JSON.parse(data.responseText)["odata.error"];
//                                        //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
//                                    });
//                                } catch (e) {
//                                    console.log('Exception in raci.html.activateRaciConfiguration().xx.update: ' + e.message + ', ' + e.stack);
//                                }
//                            }).fail(function (data) {
//                                thiz.hideProgress();
//                                var msg;
//                                if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
//                                    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
//                                } else {
//                                    msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
//                                }
//                                alert('Fail in raci.html.activateRaciConfiguration().xx.update: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
//                                console.log('Fail in raci.html.activateRaciConfiguration().xx.update: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
//                                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
//                                //var error = JSON.parse(data.responseText)["odata.error"];
//                                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
//                            });

//                        }
//                    } catch (e) {
//                        //lpSpinner.Hide();
//                        console.log('Exception in raci.html._create().xx.Get:3: ' + e.message + ', ' + e.stack);
//                    }
//                }).fail(function (data) {
//                    //lpSpinner.Hide();
//                    console.log('In xx.fail(): ' + JSON.stringify(data));
//                    var msg;
//                    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
//                        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
//                    } else {
//                        msg = JSON.stringify(data);
//                    }
//                    alert('Exception in raci.html.activateRaciConfiguration.Get: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
//                    console.log('Exception in raci.html.activateRaciConfiguration.Get: ' + JSON.stringify(data));
//                    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
//                    //var error = JSON.parse(data.responseText)["odata.error"];
//                    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
//                });
//            }
//        } catch (e) {
//            console.log('Exception in activateRaciConfiguration(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    resetRaciConfiguration: function () {
//        try {
//            var thiz = this;
//            //var workflowToActivate_Id;
//            //$('#spanWorkflowsDropDownList').find('option:selected').each(function (index, element) {
//            //    workflowToActivate_Id = element.value;
//            //});
//            //console.log('In activateRaciConfiguration(). workflowToActivate_Id: ' + workflowToActivate_Id);
//            //if (confirm("Are you certain you wish to activate this workflow?")) {
//            //    this.showProgress('Activating your Selected Workflow...');
//            //    // First we have to deactivate the existing active workflow. Get the Id first, then mark as inactive.

//            $.ajax({
//                url: thiz.options.operationUriPrefix + "odata/WorkflowConfiguration/" + tenantId + '/' + workflowAppId + "/reset", //?$filter=Active eq true",
//                dataType: "json",
//                contentType: "application/json",
//                type: "Get",
//                timeout: thiz.options.ajaxTimeout
//            }).success(function (result) {

//                alert('Workflow has been reset');
//            }).error(function (data) {
//                //lpSpinner.Hide();

//                console.log('In resetRaciConfiguration.fail(): ' + JSON.stringify(data));
//                var msg;
//                if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
//                    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
//                } else {
//                    msg = JSON.stringify(data);
//                }
//                alert('Exception in raci.html.activateRaciConfiguration.Get: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
//                console.log('Exception in raci.html.activateRaciConfiguration.Get: ' + JSON.stringify(data));
//                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
//                //var error = JSON.parse(data.responseText)["odata.error"];
//                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
//            });
//            //}
//        } catch (e) {
//            console.log('Exception in activateRaciConfiguration(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    saveWorkflowConfigurationAndActivate: function () {
//        var thiz = this;
//        try {
//            console.log('In bwWorkflowEditor.js.saveWorkflowConfigurationAndActivate().');
//            //var description = document.getElementById('txtNewWorkflowDescription').value;
//            //if (description.trim() == '') {
//            //    alert('You must enter a "Description" for this workflow change!');
//            //} else {
//            //this.showProgress('Saving and Activating your Workflow Change...');
//            var bwWorkflowId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
//                return v.toString(16);
//            });
//            var dtNow = new Date();

//            var json = {
//                bwWorkflowId: bwWorkflowId,
//                bwTenantId: tenantId,
//                bwWorkflowAppId: workflowAppId,
//                Created: dtNow,
//                CreatedBy: participantFriendlyName,
//                CreatedById: participantId,
//                CreatedByEmail: participantEmail,
//                //Description: description,
//                bwWorkflowJson: JSON.stringify(thiz.options.store),
//                bwWorkflowActive: true
//            };
//            $.ajax({
//                url: thiz.options.operationUriPrefix + "odata/WorkflowConfiguration",
//                type: "Post",
//                timeout: thiz.options.ajaxTimeout,
//                data: json,
//                headers: {
//                    "Accept": "application/json; odata=verbose"
//                }
//            }).success(function (result) {
//                try {
//                    //debugger;
//                    //thiz.hideProgress();
//                    console.log('In bwWorkflowEditor.js.saveWorkflowConfigurationAndActivate().post: Successfully updated DB. result: ' + JSON.stringify(result)); // using (' + JSON.stringify(json) + ').');
//                    // Display a dialog with an "Undo" button!!!!
//                    //alert('Successfully updated the database. THIS WORKFLOW CHANGE WILL TAKE PLACE IMMEDIATELY!');
//                    $("#divUndoWorkflowActivationDialog").dialog({
//                        modal: true,
//                        resizable: false,
//                        //closeText: "Cancel",
//                        closeOnEscape: false, // Hit the ESC key to hide! Yeah!
//                        title: 'Project Type picker',
//                        width: '800',
//                        dialogClass: 'no-close', // No close button in the upper right corner.
//                        hide: false, // This means when hiding just disappear with no effects.
//                        open: function () {
//                            $('.ui-widget-overlay').bind('click', function () {
//                                $('#divUndoWorkflowActivationDialog').dialog('close');
//                            });
//                        },
//                        close: function () {
//                            $('#divUndoWorkflowActivationDialog').dialog("destroy");
//                            //    //thiz._create(); // When the user closes this dialog, we regenerate the screen to reflect the newly created and activated workflow. <<< NOT NECESSARY!!!! ONLY USING FOR TESTING.
//                            //    debugger;
//                            //    thiz.checkIfWeHaveToDisplayThePublishChangesButton();
//                        }
//                    });
//                    $('#divUndoWorkflowActivationDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();

//                    // re-sync this.options.store
//                    //var oldJsonString = JSON.stringify(this.options.store.Workflow);
//                    thiz.options.store.DraftWorkflow = JSON.parse(JSON.stringify(thiz.options.store.Workflow)); //var newJsonString = JSON.stringify(this.options.store.DraftWorkflow);

//                    thiz.checkIfWeHaveToDisplayThePublishChangesButton();
//                } catch (e) {
//                    console.log('Exception in bwWorkflowEditor.js.saveWorkflowConfigurationAndActivate().xx.update: ' + e.message + ', ' + e.stack);
//                    alert('Exception in bwWorkflowEditor.js.saveWorkflowConfigurationAndActivate().xx.update: ' + e.message + ', ' + e.stack);
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
//                console.log('Fail in bwWorkflowEditor.js.saveWorkflowConfigurationAndActivate().xx.update: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
//                alert('Fail in bwWorkflowEditor.js.saveWorkflowConfigurationAndActivate().xx.update: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
//                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
//                //var error = JSON.parse(data.responseText)["odata.error"];
//                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
//            });

//            //}
//        } catch (e) {
//            debugger;
//            //thiz.hideProgress();
//            alert('Exception in bwWorkflowEditor.js.saveWorkflowConfigurationAndActivate(): ' + e.message + ', ' + e.stack);
//            console.log('Exception in bwWorkflowEditor.js.saveWorkflowConfigurationAndActivate(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    saveStepname: function (tagname, originalStepname) {
//        try {
//            console.log('saveStepname(). tagname: ' + tagname + ', originalStepname: ' + originalStepname);
//            //alert('In saveStepname(). Editing this step name will impact all of the workflows.');
//            var newStepName = document.getElementById(tagname).firstElementChild.value;
//            for (var i = 0; i < this.options.store.RaciSteps.length; i++) {
//                if (this.options.store.RaciSteps[i].StepName == originalStepname) {
//                    this.options.store.RaciSteps[i].StepName = newStepName;
//                    document.getElementById(tagname).innerHTML = newStepName; // Doing this instead of calling this._create();
//                }
//            }
//        } catch (e) {
//            console.log('Exception in saveStepname(): ' + e.message + ', ' + e.stack);
//        }
//        //this._create();
//    },
//    //saveActionOrRequireCommentsCheckbox: function (checkboxId) {
//    //    try {
//    //        // Get the action and checkbox type. eg: Action-Approve_3_13, RequireComments-Approve_3_13
//    //        var x = checkboxId.split('_')[0];
//    //        var checkboxType = x.split('-')[0]; // "Action" or "RequireComments"
//    //        var action = x.split('-')[1]; // "Approve"
//    //        var stepIndex = checkboxId.split('_')[1]; // eg: 2
//    //        var roleIndex = checkboxId.split('_')[2]; // eg: 13
//    //        console.log('In saveActionOrRequireCommentsCheckbox(). checkboxId: ' + checkboxId + ', checkboxType: ' + checkboxType + ', action: ' + action + ', stepIndex: ' + stepIndex + ', roleIndex: ' + roleIndex);
//    //        var actionCheckboxState;
//    //        var requireCommentsCheckboxState;
//    //        if (checkboxType == 'RequireComments') {
//    //            var actionCheckbox_Id = 'Action-Approve_' + stepIndex + '_' + roleIndex;
//    //            actionCheckboxState = document.getElementById(actionCheckbox_Id).checked;
//    //            requireCommentsCheckboxState = document.getElementById(checkboxId).checked;
//    //        } else {
//    //            var requireCommentsCheckbox_Id = 'RequireComments-Approve_' + stepIndex + '_' + roleIndex;
//    //            actionCheckboxState = document.getElementById(checkboxId).checked;
//    //            requireCommentsCheckboxState = document.getElementById(requireCommentsCheckbox_Id).checked;
//    //        }

//    //        if (this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex].Action.length) {
//    //            console.log('ASSIGN'); // THIS WORKS!!!!!!!!!!!!!!!!!!!!!!
//    //            var x;
//    //            if (requireCommentsCheckboxState) {
//    //                x = {
//    //                    Action: {
//    //                        '@Name': 'Approve',
//    //                        '@State': 'Done',
//    //                        '@RequireComments': 'True',
//    //                        Tooltip: 'Approve the request and submit comments'
//    //                    }
//    //                };
//    //            } else {
//    //                x = {
//    //                    Action: {
//    //                        '@Name': 'Approve',
//    //                        '@State': 'Done',
//    //                        Tooltip: 'Approve the request and submit comments'
//    //                    }
//    //                };
//    //            }
//    //            this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex].Action.push(x);
//    //        } else if (this.options.store.Workflow.Steps.Step[stepIndex].OnStart.Inform.length) {
//    //            //console.log('INFORM');
//    //            // INFORM DOES NOT HAVE THESE ONES.
//    //        } else {
//    //            alert('ERROR: Invalid assign or inform value.');
//    //            console.log('not ASSIGN or INFORM. this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex]: ' + JSON.stringify(this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex]));
//    //        }
//    //    } catch (e) {
//    //        console.log('Exception in saveActionOrRequireCommentsCheckbox(): ' + e.message + ', ' + e.stack);
//    //    }
//    //},
//    cancelChangesInDraftWorkflowConfiguration: function () {
//        try {
//            console.log('In cancelChangesInDraftWorkflowConfiguration().');
//            this.options.store["Workflow"] = JSON.parse(JSON.stringify(this.options.store["DraftWorkflow"])); // Creating "DraftWorkflow" so we can tell if the workflow has been changed or not, and then inform the user that changes need to be published.
//            this.renderLocationEditor(); // Definition is renderLocationEditor(assignmentRowChanged_ElementId).
//        } catch (e) {
//            console.log('Exception in cancelChangesInDraftWorkflowConfiguration(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    checkIfWeHaveToDisplayThePublishChangesButton: function () {
//        try {
//            //debugger;
//            console.log('In checkIfWeHaveToDisplayThePublishChangesButton().');
//            var thereHaveBeenChangesToTheWorkflow = false;
//            var oldJsonString = JSON.stringify(this.options.store.Workflow);
//            var newJsonString = JSON.stringify(this.options.store.DraftWorkflow);
//            if (oldJsonString != newJsonString) {
//                thereHaveBeenChangesToTheWorkflow = true;
//            }
//            if (thereHaveBeenChangesToTheWorkflow) {
//                // The user has made changes to the workflow.
//                document.getElementById('spanThereAreChangesToPublishText').innerHTML = 'You have changes that won\'t be available until you publish: ';
//                var html = '';
//                html += '<input style="padding:5px 10px 5px 10px;width:100px;" id="btnSaveWorkflowConfigurationAndActivate" type="button" value="Publish" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveWorkflowConfigurationAndActivate\');" />';
//                html += '&nbsp;<input style="padding:5px 10px 5px 10px;" id="btnCancelChangesInDraftWorkflowConfiguration" type="button" value="Cancel Changes" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'cancelChangesInDraftWorkflowConfiguration\');" />';
//                document.getElementById('spanThereAreChangesToPublishButton').innerHTML = html; //'<input style="padding:5px 10px 5px 10px;" id="btnSaveWorkflowConfigurationAndActivate" type="button" value="  Publish  " onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveWorkflowConfigurationAndActivate\');" />';
//            } else {
//                // Do nothing because the user has made no changes to the workflow.
//                document.getElementById('spanThereAreChangesToPublishText').innerHTML = '';
//                document.getElementById('spanThereAreChangesToPublishButton').innerHTML = '';
//            }
//        } catch (e) {
//            console.log('Exception in checkIfWeHaveToDisplayThePublishChangesButton(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    saveCollaborationTimeout: function () {
//        try {
//            // This makes sure the user enters a number here, which is greater than 0 and less than 28.
//            var timeout = document.getElementById('textTimeout').value;
//            var timeoutUnits;
//            $('#selectTimeoutUnits').find('option:selected').each(function (index, element) {
//                timeoutUnits = element.value;
//            });
//            console.log('In saveCollaborationTimeout(). timeout: ' + timeout + ', timeoutUnits: ' + timeoutUnits);
//            if (timeoutUnits == 'Days') {
//                var newTimeout = '';
//                for (var i = 0; i < timeout.length; i++) {
//                    var charCode = timeout.charCodeAt(i);
//                    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
//                        // do nothing
//                    } else {
//                        newTimeout += timeout[i];
//                    }
//                }
//                if (Number(newTimeout) > 28) newTimeout = 28;
//                var timeoutValueToSave = '';
//                if (newTimeout) {
//                    document.getElementById('textTimeout').value = newTimeout;
//                    timeoutValueToSave = newTimeout;
//                } else {
//                    document.getElementById('textTimeout').value = '';
//                }
//            } else if (timeoutUnits == 'Hours') {
//                var newTimeout = '';
//                for (var i = 0; i < timeout.length; i++) {
//                    var charCode = timeout.charCodeAt(i);
//                    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
//                        // do nothing
//                    } else {
//                        newTimeout += timeout[i];
//                    }
//                }
//                if (Number(newTimeout) > 24) newTimeout = 24;
//                var timeoutValueToSave = '';
//                if (newTimeout) {
//                    document.getElementById('textTimeout').value = newTimeout;
//                    timeoutValueToSave = newTimeout;
//                } else {
//                    document.getElementById('textTimeout').value = '';
//                }
//            } else if (timeoutUnits == 'Minutes') {
//                var newTimeout = '';
//                for (var i = 0; i < timeout.length; i++) {
//                    var charCode = timeout.charCodeAt(i);
//                    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
//                        // do nothing
//                    } else {
//                        newTimeout += timeout[i];
//                    }
//                }
//                if (Number(newTimeout) > 60) newTimeout = 60;
//                var timeoutValueToSave = '';
//                if (newTimeout) {
//                    document.getElementById('textTimeout').value = newTimeout;
//                    timeoutValueToSave = newTimeout;
//                } else {
//                    document.getElementById('textTimeout').value = '';
//                }
//            } else {
//                alert('In saveCollaborationTimeout(): Unrecognized timeout units.');
//            }
//            //
//            // Iterate through the steps to find the Collaboration one, so that we can save it.
//            //
//            for (var i = 0; i < this.options.store.Workflow.Steps.Step.length; i++) {
//                if (this.options.store.Workflow.Steps.Step[i]["@Name"] == 'Collaboration') {
//                    this.options.store.Workflow.Steps.Step[i]["@Timeout"] = timeoutValueToSave; // Save the timeout value.
//                    this.options.store.Workflow.Steps.Step[i]["@TimeoutUnits"] = timeoutUnits; // Save the timeout units: [Days, Hours, Minutes]
//                }
//            }
//            this.checkIfWeHaveToDisplayThePublishChangesButton();
//        } catch (e) {
//            console.log('Exception in saveCollaborationTimeout(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    //saveCollaborationTimeout: function() {
//    //    try {
//    //        console.log('In saveCollaborationTimeout().');
//    //        var timeout = document.getElementById('textTimeout').value;
//    //        var timeoutUnits; 
//    //        $('#selectTimeoutUnits').find('option:selected').each(function (index, element) {
//    //            timeoutUnits = element.value;
//    //        });

//    //        debugger;


//    //    } catch (e) {
//    //        console.log('Exception in saveCollaborationTimeout(): ' + e.message + ', ' + e.stack);
//    //    }
//    //},
//    saveAssignmentRow: function (elementId) {
//        try {
//            console.log('In saveAssignmentRow(). WE WILL GET RID OF THIS SAVE BUTTON BECAUSE WE WANT TO JUST HAVE THE Publish BUTTON BECOME ENABLED. THIS WILL BE MORE INTUITIVE I THNK..??!! elementId: ' + elementId); // eg: elementId: steprow-inform_3_8
//            var thiz = this;
//            var x = elementId.split('_')[0];
//            var sourceRoleCategory = x.split('-')[1]; // "inform" or "assign"
//            var stepIndex = elementId.split('_')[1]; // eg: 3
//            var roleIndex = elementId.split('_')[2]; // eg: 8
//            //if (confirm("Please confirm you wish to save this change. This will not affect the workflow until it has been saved & activated.")) {
//            // Step 1: Change the underlying JSON. These loops help us locate the node the user wants to change.
//            var car = this.options.store;
//            if (stepIndex && sourceRoleCategory && roleIndex > -1) {
//                // Step 1: Get the Role.
//                var newRoleId;
//                $('#selectRoleName').find('option:selected').each(function (index, element) {
//                    newRoleId = element.value;
//                });

//                var newRoleCategory; // Step 1: Get the "RoleCategory".
//                $('#selectRoleCategory').find('option:selected').each(function (index, element) {
//                    newRoleCategory = element.value;
//                });
//                var newActions = []; // Step 2: Get the "Actions".
//                if (newRoleCategory == 'Approver') { // We only get "Actions" when it is "Approve".
//                    // "Approve" action. eg: Action-Approve_3_8, RequireComments-Approve_3_8
//                    var approve_action_CheckboxId = 'Action-Approve_' + stepIndex + '_' + roleIndex;
//                    var approve_requireComments_CheckboxId = 'RequireComments-Approve_' + stepIndex + '_' + roleIndex;
//                    if (document.getElementById(approve_action_CheckboxId).checked) {
//                        var x;
//                        if (document.getElementById(approve_requireComments_CheckboxId).checked) {
//                            x = {
//                                '@Name': 'Approve',
//                                '@State': 'Done',
//                                '@RequireComments': 'True',
//                                Tooltip: 'Approve the request and submit comments'
//                            };
//                        } else {
//                            x = {
//                                '@Name': 'Approve',
//                                '@State': 'Done',
//                                Tooltip: 'Approve the request and submit comments'
//                            };
//                        }
//                        newActions.push(x);
//                    }
//                    // "Cancel" action. eg: Action-Cancel_3_8, RequireComments-Cancel_3_8
//                    var cancel_action_CheckboxId = 'Action-Cancel_' + stepIndex + '_' + roleIndex;
//                    var cancel_requireComments_CheckboxId = 'RequireComments-Cancel_' + stepIndex + '_' + roleIndex;
//                    if (document.getElementById(cancel_action_CheckboxId).checked) {
//                        var x;
//                        if (document.getElementById(cancel_requireComments_CheckboxId).checked) {
//                            x = {
//                                '@Name': 'Cancel',
//                                '@State': 'Cancel',
//                                '@RequireComments': 'True',
//                                Tooltip: 'Cancel the entire CAR'
//                            };
//                        } else {
//                            x = {
//                                '@Name': 'Cancel',
//                                '@State': 'Cancel',
//                                Tooltip: 'Cancel the entire CAR'
//                            };
//                        }
//                        newActions.push(x);
//                    }
//                    // "Decline" action. eg: Action-Decline_3_8, RequireComments-Decline_3_8
//                    var decline_action_CheckboxId = 'Action-Decline_' + stepIndex + '_' + roleIndex;
//                    var decline_requireComments_CheckboxId = 'RequireComments-Decline_' + stepIndex + '_' + roleIndex;
//                    if (document.getElementById(decline_action_CheckboxId).checked) {
//                        var x;
//                        if (document.getElementById(decline_requireComments_CheckboxId).checked) {
//                            x = {
//                                '@Name': 'Decline',
//                                '@State': 'Cancel',
//                                '@RequireComments': 'True',
//                                Tooltip: 'Decline the entire CAR'
//                            };
//                        } else {
//                            x = {
//                                '@Name': 'Decline',
//                                '@State': 'Cancel',
//                                Tooltip: 'Decline the entire CAR'
//                            };
//                        }
//                        newActions.push(x);
//                    }
//                    // "Revise/Hold" action. eg: Action-Revise/Hold_3_8, RequireComments-Revise/Hold_3_8
//                    var reviseHold_action_CheckboxId = 'Action-Revise/Hold_' + stepIndex + '_' + roleIndex;
//                    var reviseHold_requireComments_CheckboxId = 'RequireComments-Revise/Hold_' + stepIndex + '_' + roleIndex;
//                    if (document.getElementById(reviseHold_action_CheckboxId).checked) {
//                        var x;
//                        if (document.getElementById(reviseHold_requireComments_CheckboxId).checked) {
//                            x = {
//                                '@Name': 'Revise/Hold',
//                                '@Target': 'Revise',
//                                '@RequireComments': 'True',
//                                Invalidate: { '@Step': 'Admin' },
//                                Invalidate: { '@Step': 'VPLevel' },
//                                Invalidate: { '@Step': 'ExecLevel' },
//                                Invalidate: { '@Step': 'CLevel' },
//                                Tooltip: 'Send the CAR back to the original creator'
//                            };
//                        } else {
//                            x = {
//                                '@Name': 'Revise/Hold',
//                                '@Target': 'Revise',
//                                Invalidate: { '@Step': 'Admin' },
//                                Invalidate: { '@Step': 'VPLevel' },
//                                Invalidate: { '@Step': 'ExecLevel' },
//                                Invalidate: { '@Step': 'CLevel' },
//                                Tooltip: 'Send the CAR back to the original creator'
//                            };
//                        }
//                        newActions.push(x);
//                    }
//                }
//                //debugger;
//                var newConditionString = document.getElementById('spanConditionEditorContents').innerHTML; // Step 3: Get the "Cond".

//                if (document.getElementById('selectRoleName')) {
//                    var e = document.getElementById("selectRoleName");
//                    var newRoleId = e.options[e.selectedIndex].value;
//                    var newRoleName = e.options[e.selectedIndex].text;
//                }

//                //
//                // We now have all of our new values. Now we have to determine if we use the same node in the JSON, or if it has to move.
//                // This depends on whether the user has selected a different "RoleCategory" (Inform, Collaborator, Approver).
//                //
//                debugger;
//                if (sourceRoleCategory == 'inform' && (newRoleCategory == 'Collaborator' || newRoleCategory == 'Approver')) {
//                    // Change from inform to assign row.
//                    //var roleId;
//                    //if (this.options.store.Workflow.Steps.Step[stepIndex].OnStart.Inform[roleIndex]["@Role"]) {
//                    //    roleId = this.options.store.Workflow.Steps.Step[stepIndex].OnStart.Inform[roleIndex]["@Role"];
//                    //} else {
//                    //    roleId = this.options.store.Workflow.Steps.Step[stepIndex].OnStart.Inform[roleIndex]["@IdField"];
//                    //}
//                    // eg: <Assign Role="ADMIN" Form="CARForm.aspx" DoneForm="CARComments.aspx" Title="Add Comments/Approve" MailTemplate="Assign1.xsl" Subject="eCAR3 - New Work Item ({0})" RoleCategory="Approver">
//                    var row = {
//                        '@Role': newRoleId,
//                        '@RoleName': newRoleName,
                        
                        
                        
                        
                        
//                        '@RoleCategory': newRoleCategory,
//                        '@Cond': newConditionString
//                    };
//                    if (newRoleCategory == 'Approver' && newActions) {
//                        row.Action = newActions;
//                    }
//                    // Delete the old row.
//                    debugger; // WHY IS THIS AN INFORM?
//                    this.options.store.Workflow.Steps.Step[stepIndex].OnStart.Inform.splice(roleIndex, 1); // delete leaves a null, so we have to use splice.
//                    // Depending on the new RoleCategory, figure out where in the json to insert this assignment row. For instance, if it is "Approver", it should show up at the top of the "Approvers", and be highlighted so th euser know what they just changed.
//                    // Iterate through all of the assignment rows and find this out.
//                    var assignIndex;
//                    var weFoundIt = false;
//                    for (var i = 0; i < this.options.store.Workflow.Steps.Step[stepIndex].Assign.length; i++) {
//                        console.log('this.options.store.Workflow.Steps.Step[stepIndex].Assign[i]: ' + this.options.store.Workflow.Steps.Step[stepIndex].Assign[i]["@RoleCategory"] + ', newRoleCategory: ' + newRoleCategory);
//                        if (!weFoundIt && this.options.store.Workflow.Steps.Step[stepIndex].Assign[i]["@RoleCategory"] == newRoleCategory) {
//                            // We have found the first of this role category, so we will insert this new assignment row at the top.
//                            this.options.store.Workflow.Steps.Step[stepIndex].Assign.splice(i, 0, row); // Create the row
//                            assignIndex = i;
//                            weFoundIt = true;
//                        }
//                    }
//                } else if (sourceRoleCategory == 'assign' && newRoleCategory == 'Inform') {
//                    // Change from assign to inform row.
//                    //var roleId = this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex]["@Role"];
//                    this.options.store.Workflow.Steps.Step[stepIndex].Assign.splice(roleIndex, 1); // delete leaves a null, so we have to use splice.
//                    // eg: <Inform Role="DIRSAFE" MailTemplate="Inform1.xsl" Subject="eCAR3 - New Project {0} created" Cond="$ProjectType~IM,LR,EQ,SG,FS,WS,ENV,INO,PSM,IT,TRANS,WH" />
//                    var row = {
//                        '@Role': newRoleId,
//                        '@RoleName': newRoleName,
                        
                        
//                        '@Cond': newConditionString
//                    }
//                    this.options.store.Workflow.Steps.Step[stepIndex].OnStart.Inform.splice(0, 0, row); // Create the row
//                } else {
//                    // No change to RoleCategory, stay in the same row. THIS IS THE ONLY PLACE WHERE we save values to an existing row in the workflow.
//                    if (sourceRoleCategory == 'inform') {
//                        this.options.store.Workflow.Steps.Step[stepIndex].OnStart.Inform[roleIndex]["@Cond"] = newConditionString; // The only thing that could change here is "Cond".
//                        debugger;
//                        if (newRoleId) {
//                            this.options.store.Workflow.Steps.Step[stepIndex].OnStart.Inform[roleIndex]["@Role"] = newRoleId;
//                            this.options.store.Workflow.Steps.Step[stepIndex].OnStart.Inform[roleIndex]["@RoleName"] = newRoleName;
//                        }
//                    } else if (sourceRoleCategory == 'assign') {
//                        if (newRoleCategory == 'Approver' && newActions) {
//                            //debugger;
//                            // Find out if we changed the Tooltip and JavaScript values already. They save differently..... not sure if this is best approach yet.
//                            var actionIndex;
//                            for (var a = 0; a < this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex].Action.length; a++) {
//                                var x1 = this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex].Action[a]["@Name"];
//                                for (var b = 0; b < newActions.length; b++) {
//                                    var x2 = newActions[b]["@Name"];
//                                    if (x1 == x2) {
//                                        //debugger;
//                                        var tooltip = this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex].Action[a].Tooltip;
//                                        var javascript = this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex].Action[a]["@JavaScript"];
//                                        newActions[b].Tooltip = tooltip;
//                                        newActions[b]["@JavaScript"] = javascript;

//                                    }
//                                }
//                            }
//                            this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex].Action = newActions;
//                        }
//                        //debugger;
//                        this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex]["@Cond"] = newConditionString;
//                        this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex]["@Role"] = newRoleId;
//                        this.options.store.Workflow.Steps.Step[stepIndex].Assign[roleIndex]["@RoleName"] = newRoleName;
//                    } else {
//                        alert('ERROR: Invalid sourceRoleCategory: ' + sourceRoleCategory);
//                    }
//                }
//                //
//                // Now we have to save the user(s) in the BwWorkflowUserRole schema.
//                //
//                var userId = document.getElementById('txtRoleMembersId_' + stepIndex + '_' + roleIndex).value;
//                if (userId) {
//                    // A user(s) has been selected, so update the table.
//                    var userFriendlyName = document.getElementById('txtRoleMembersFriendlyName_' + stepIndex + '_' + roleIndex).value;
//                    var userEmail = document.getElementById('txtRoleMembersEmail_' + stepIndex + '_' + roleIndex).value;
//                    var dtNow = new Date();
//                    var json = {
//                        bwTenantId: tenantId,
//                        bwWorkflowAppId: workflowAppId,
//                        bwParticipantId: userId,
//                        bwParticipantFriendlyName: userFriendlyName,
//                        bwParticipantEmail: userEmail,
//                        RoleId: newRoleId,
//                        RoleName: newRoleName, // JUST ADDED MAKE SURE THIS WORKS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//                        OrgId: 'ALL', // UNTIL WE GET THE Orgs figured out, use 'ALL' as the default.
//                        Active: true,
//                        Created: dtNow,
//                        Modified: dtNow,
//                        ModifiedByFriendlyName: participantFriendlyName,
//                        ModifiedById: participantId,
//                        ModifiedByEmail: participantEmail
//                    };
//                    $.ajax({
//                        url: thiz.options.operationUriPrefix + "odata/UserRole",
//                        type: "Post",
//                        timeout: thiz.options.ajaxTimeout,
//                        data: json,
//                        headers: {
//                            "Accept": "application/json; odata=verbose"
//                        }
//                    }).success(function (result) {
//                        try {
//                            // Re-render the screen.
//                            thiz._create();
//                        } catch (e) {
//                            console.log('Exception in bwWorkflowEditor.js.saveAssignmentRow().xx.update: ' + e.message + ', ' + e.stack);
//                            alert('Exception in bwWorkflowEditor.js.saveAssignmentRow().xx.update: ' + e.message + ', ' + e.stack);
//                        }
//                    }).error(function (data, errorCode, errorMessage) {
//                        //thiz.hideProgress();
//                        var msg;
//                        if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
//                            msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
//                        } else {
//                            msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
//                        }
//                        console.log('Fail in bwWorkflowEditor.js.saveAssignmentRow().xx.update: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
//                        alert('Fail in bwWorkflowEditor.js.saveAssignmentRow().xx.update: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
//                        //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
//                        //var error = JSON.parse(data.responseText)["odata.error"];
//                        //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
//                    });
//                } else {
//                    // Re-render the screen.
//                    this._create();
//                }
//            } else {
//                // We should never get here!!!
//                alert('ERROR: Failed to locate the step or role in the underlying json.');
//            }
//        } catch (e) {
//            console.log('Exception in saveAssignmentRow(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    cancelStepRowEditing: function (elementId) {
//        try {
//            console.log('In cancelStepRowEditing(). elementId: ' + elementId);
//            try {
//                //document.getElementById(elementId).style.visibility = 'visible'; // We can display it again after the user is done editing.
//                $('#' + elementId).removeClass('steprow-hidden');  // Display the row again.
//                document.getElementById(elementId).style.backgroundColor = '#EBF6F9'; //.closest('tr').style.backgroundColor = 'lightgrey'; // Make the row highlighted so the user has a visual queue so that they can remember where they left off!
//                //enableButton('buttonAddNewAssignmentRow');
//            } catch (e) {
//                // do nothing
//            }
//            $('.activeEditRow').remove(); // Get rid of the editable row.
//        } catch (e) {
//            console.log('Exception in cancelStepRowEditing(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    undoWorkflowActivation: function () {
//        try {
//            console.log('In undoWorkflowActivation().');
//            alert('In undoWorkflowActivation(). This functionality is not complete. Coming soon!')
//        } catch (e) {
//            console.log('Exception in undoWorkflowActivation(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    displayRoleMultiPicker_notusedyet: function (elementId) {
//        try {
//            console.log('In displayRoleMultiPicker().');
//            try {
//                console.log('In displayRoleMultiPicker(). elementId: ' + elementId);

//                $.ajax({
//                    url: this.options.operationUriPrefix + "odata/Roles", //Orgs",
//                    dataType: "json",
//                    contentType: "application/json",
//                    type: "Get",
//                    timeout: this.options.ajaxTimeout
//                }).done(function (result) {
//                    try {
//                        //console.log('In raci.html.displayRoleMultiPicker().Get[odata/Orgs].done: result: ' + JSON.stringify(result));
//                        var availablePillars;
//                        if (result) {
//                            availablePillars = result.value;
//                        } else {
//                            console.log('In raci.html.displayRoleMultiPicker().Get[odata/Roles].done: result: ' + JSON.stringify(result));
//                        }
//                        // Get the "Cond" value.
//                        var cond = $('#' + elementId).find('.cond').attr('bwOldValue'); // eg: 	$ProjectType~IM,FS,WS,ENV,PSM,IT,EXP
//                        if (cond) {
//                            // We have to parse out the selected/existing project types here.
//                            var selectedPillars = cond.split('$ParentOrg~')[1];
//                            if (selectedPillars && selectedPillars.indexOf('&') > -1) {
//                                selectedPillars = selectedPillars.split('&')[0];
//                            }
//                        }
//                        var html = '';
//                        html += '<input type="hidden" id="RoleMultiPickerDialog_AssignmentElementId" value="' + elementId + '" />'; // This is how we will be able to look up the assignment row.
//                        if (availablePillars) {
//                            html += '<table>';
//                            for (var i = 0; i < availablePillars.length; i++) {
//                                html += '<tr class="orgRow">';
//                                // Iterate through the list to see if we have a selected one or not.
//                                var isSelected = false;
//                                if (selectedPillars) {
//                                    for (var p = 0; p < selectedPillars.split(',').length; p++) {
//                                        if (availablePillars[i].OrgId == selectedPillars.split(',')[p]) {
//                                            //console.log('availablePillars[i].OrgId: ' + availablePillars[i].OrgId + ', selectedPillars.split(',')[p]: ' + selectedPillars.split(',')[p]);
//                                            isSelected = true;
//                                        }
//                                    }
//                                }
//                                if (isSelected) {
//                                    html += '<td><input id="' + 'roleCheckbox_' + i + '" type="checkbox" checked /></td>';
//                                } else {
//                                    html += '<td><input id="' + 'roleCheckbox_' + i + '" type="checkbox" /></td>';
//                                }
//                                html += '<td class="roleId">' + availablePillars[i].OrgId + '</td>';
//                                html += '<td>&nbsp;</td>';
//                                html += '<td class="roleName">' + availablePillars[i].OrgName + '</td>';
//                                html += '</tr>';
//                            }
//                            html += '</table>';
//                        } else {
//                            html += 'No "Roles" were available.';
//                        }
//                        $('#spanRoleMultiPickerDialogContent').html(html);

//                        $("#divRoleMultiPickerDialog").dialog({
//                            modal: true,
//                            resizable: false,
//                            //closeText: "Cancel",
//                            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
//                            title: 'Project Type picker',
//                            width: '800',
//                            dialogClass: 'no-close', // No close button in the upper right corner.
//                            hide: false, // This means when hiding just disappear with no effects.
//                            open: function () {
//                                $('.ui-widget-overlay').bind('click', function () {
//                                    $('#divRoleMultiPickerDialog').dialog('close');
//                                });
//                            },
//                            close: function () {
//                                //$(this).dialog('destroy').remove();
//                            }
//                            //buttons: {
//                            //    "Close": function () {
//                            //        $(this).dialog("close");
//                            //    }
//                            //}
//                        });
//                        $('#divRoleMultiPickerDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
//                    } catch (e) {
//                        //lpSpinner.Hide();
//                        console.log('Exception in raci.html.displayRoleMultiPicker().Get[odata/Orgs].done: ' + e.message + ', ' + e.stack);
//                    }
//                }).fail(function (data) {
//                    //lpSpinner.Hide();
//                    var msg;
//                    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
//                        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
//                    } else {
//                        msg = JSON.stringify(data);
//                    }
//                    alert('Error in raci.html.displayRoleMultiPicker().Get[odata/Orgs].fail: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
//                    console.log('Error in raci.html.displayRoleMultiPicker().Get[odata/Orgs].fail:' + JSON.stringify(data));
//                    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
//                    //var error = JSON.parse(data.responseText)["odata.error"];
//                    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
//                });
//            } catch (e) {
//                console.log('Exception in displayRoleMultiPicker(): ' + e.message + ', ' + e.stack);
//            }
//        } catch (e) {
//            console.log('Exception in displayRoleMultiPicker(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    displayOrgMultiPicker: function (elementId) {
//        try {
//            console.log('In displayOrgMultiPicker().');
//            try {
//                console.log('In displayOrgMultiPicker(). elementId: ' + elementId);
//                $.ajax({
//                    url: this.options.operationUriPrefix + "odata/Orgs",
//                    dataType: "json",
//                    contentType: "application/json",
//                    type: "Get",
//                    timeout: this.options.ajaxTimeout
//                }).done(function (result) {
//                    try {
//                        //console.log('In raci.html.displayOrgMultiPicker().Get[odata/Orgs].done: result: ' + JSON.stringify(result));
//                        var availablePillars;
//                        if (result) {
//                            availablePillars = result.value;
//                        } else {
//                            console.log('In raci.html.displayOrgMultiPicker().Get[odata/Roles].done: result: ' + JSON.stringify(result));
//                        }
//                        // Get the "Cond" value.
//                        var cond = $('#' + elementId).find('.cond').attr('bwOldValue'); // eg: 	$ProjectType~IM,FS,WS,ENV,PSM,IT,EXP
//                        if (cond) {
//                            // We have to parse out the selected/existing project types here.
//                            var selectedPillars = cond.split('$ParentOrg~')[1];
//                            if (selectedPillars && selectedPillars.indexOf('&') > -1) {
//                                selectedPillars = selectedPillars.split('&')[0];
//                            }
//                        }
//                        var html = '';
//                        html += '<input type="hidden" id="OrgMultiPickerDialog_AssignmentElementId" value="' + elementId + '" />'; // This is how we will be able to look up the assignment row.
//                        if (availablePillars) {
//                            html += '<table>';
//                            for (var i = 0; i < availablePillars.length; i++) {
//                                html += '<tr class="orgRow">';
//                                // Iterate through the list to see if we have a selected one or not.
//                                var isSelected = false;
//                                if (selectedPillars) {
//                                    for (var p = 0; p < selectedPillars.split(',').length; p++) {
//                                        if (availablePillars[i].OrgId == selectedPillars.split(',')[p]) {
//                                            //console.log('availablePillars[i].OrgId: ' + availablePillars[i].OrgId + ', selectedPillars.split(',')[p]: ' + selectedPillars.split(',')[p]);
//                                            isSelected = true;
//                                        }
//                                    }
//                                }
//                                if (isSelected) {
//                                    html += '<td><input id="' + 'orgCheckbox_' + i + '" type="checkbox" checked /></td>';
//                                } else {
//                                    html += '<td><input id="' + 'orgCheckbox_' + i + '" type="checkbox" /></td>';
//                                }
//                                html += '<td class="orgId">' + availablePillars[i].OrgId + '</td>';
//                                html += '<td>&nbsp;</td>';
//                                html += '<td class="orgName">' + availablePillars[i].OrgName + '</td>';
//                                html += '</tr>';
//                            }
//                            html += '</table>';
//                        } else {
//                            html += 'No "Orgs" were available.';
//                        }
//                        $('#spanOrgMultiPickerDialogContent').html(html);

//                        $("#divOrgMultiPickerDialog").dialog({
//                            modal: true,
//                            resizable: false,
//                            //closeText: "Cancel",
//                            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
//                            title: 'Project Type picker',
//                            width: '800',
//                            dialogClass: 'no-close', // No close button in the upper right corner.
//                            hide: false, // This means when hiding just disappear with no effects.
//                            open: function () {
//                                $('.ui-widget-overlay').bind('click', function () {
//                                    $('#divOrgMultiPickerDialog').dialog('close');
//                                });
//                            },
//                            close: function () {
//                                //$(this).dialog('destroy').remove();
//                            }
//                            //buttons: {
//                            //    "Close": function () {
//                            //        $(this).dialog("close");
//                            //    }
//                            //}
//                        });
//                        $('#divOrgMultiPickerDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
//                    } catch (e) {
//                        //lpSpinner.Hide();
//                        console.log('Exception in raci.html.displayOrgMultiPicker().Get[odata/Orgs].done: ' + e.message + ', ' + e.stack);
//                    }
//                }).fail(function (data) {
//                    //lpSpinner.Hide();
//                    var msg;
//                    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
//                        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
//                    } else {
//                        msg = JSON.stringify(data);
//                    }
//                    alert('Error in raci.html.displayOrgMultiPicker().Get[odata/Orgs].fail: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
//                    console.log('Error in raci.html.displayOrgMultiPicker().Get[odata/Orgs].fail:' + JSON.stringify(data));
//                    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
//                    //var error = JSON.parse(data.responseText)["odata.error"];
//                    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
//                });
//            } catch (e) {
//                console.log('Exception in displayOrgMultiPicker(): ' + e.message + ', ' + e.stack);
//            }
//        } catch (e) {
//            console.log('Exception in displayOrgMultiPicker(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    displayProjectTypeMultiPicker: function (elementId) {
//        try {
//            console.log('In displayProjectTypeMultiPicker(). elementId: ' + elementId);



//            var thiz = this;
//            var operationUri = webserviceurl + "/getfunctionalareasbyappid/" + this.options.workflowAppId + "/" + "RETURNALL";
//            $.ajax({
//                url: operationUri,
//                method: "GET",
//                headers: {
//                    "Accept": "application/json; odata=verbose"
//                },
//                success: function (data) {
//                    try {
//                        //var year = document.getElementById('ddlYear').value;
//                        //var year = '2016'; // todd hardcoded
//                        //var year = new Date().getFullYear().toString(); // todd hardcoded.
//                        //$('#ddlFunctionalArea').empty(); // Clear the previous entries before we populate it.





//                        if (thiz.options.workflowAppId == null) {
//                            // Not logged in so we will use these defaults for the time being.
//                            var availableProjectTypes = [
//                            { bwFunctionalAreaYear: '2019', IsHidden: 'false', bwFunctionalAreaId: '1', bwFunctionalAreaQuote: 'false', bwFunctionalAreaTitle: 'Buildings' },
//                            { bwFunctionalAreaYear: '2019', IsHidden: 'false', bwFunctionalAreaId: '1', bwFunctionalAreaQuote: 'false', bwFunctionalAreaTitle: 'Computer equipment' },
//                            { bwFunctionalAreaYear: '2019', IsHidden: 'false', bwFunctionalAreaId: '1', bwFunctionalAreaQuote: 'false', bwFunctionalAreaTitle: 'Office equipment' },
//                            { bwFunctionalAreaYear: '2019', IsHidden: 'false', bwFunctionalAreaId: '1', bwFunctionalAreaQuote: 'false', bwFunctionalAreaTitle: 'Furniture and fixtures' },
//                            { bwFunctionalAreaYear: '2019', IsHidden: 'false', bwFunctionalAreaId: '1', bwFunctionalAreaQuote: 'false', bwFunctionalAreaTitle: 'Intangible assets' },
//                            { bwFunctionalAreaYear: '2019', IsHidden: 'false', bwFunctionalAreaId: '1', bwFunctionalAreaQuote: 'false', bwFunctionalAreaTitle: 'Land' },
//                            { bwFunctionalAreaYear: '2019', IsHidden: 'false', bwFunctionalAreaId: '1', bwFunctionalAreaQuote: 'false', bwFunctionalAreaTitle: 'Machinery' },
//                            { bwFunctionalAreaYear: '2019', IsHidden: 'false', bwFunctionalAreaId: '1', bwFunctionalAreaQuote: 'false', bwFunctionalAreaTitle: 'Software' },
//                            { bwFunctionalAreaYear: '2019', IsHidden: 'false', bwFunctionalAreaId: '1', bwFunctionalAreaQuote: 'false', bwFunctionalAreaTitle: 'Vehicles' },
//                            ];
//                            //var data = {
//                            //    d: {
//                            //        results: result
//                            //    }
//                            //};
//                        }

//                        //Buildings (including subsequent costs that extend the useful life of a building)
//                        //Computer equipment
//                        //Office equipment
//                        //Furniture and fixtures (including the cost of furniture that is aggregated and treated as a single unit, such as a group of desks)
//                        //Intangible assets (such as a purchased taxi license or a patent)
//                        //Land (including the cost of upgrading the land, such as the cost of an irrigation system or a parking lot)
//                        //Machinery (including the costs required to bring the equipment to its intended location and for its intended use)
//                        //Software
//                        //Vehicles

//                        var html = '';
//                        html += '<table>';
//                        for (var i = 0; i < availableProjectTypes.length; i++) {
//                            html += '<tr class="projectTypeRow">';
//                            // Iterate through the list to see if we have a selected one or not.
//                            var isSelected = false;
//                            //if (selectedProjectTypes) {
//                            //    for (var p = 0; p < selectedProjectTypes.split(',').length; p++) {
//                            //        if (availableProjectTypes[i].ProjectTypeId == selectedProjectTypes.split(',')[p]) {
//                            //            //console.log('availableProjectTypes[i].ProjectTypeId: ' + availableProjectTypes[i].ProjectTypeId + ', selectedProjectTypes.split(',')[p]: ' + selectedProjectTypes.split(',')[p]);
//                            //            isSelected = true;
//                            //        }
//                            //    }
//                            //}
//                            //if (isSelected) {
//                            //    html += '<td><input id="' + 'projectTypeCheckbox_' + i + '" type="checkbox" checked /></td>';
//                            //} else {
//                            html += '<td><input id="' + 'projectTypeCheckbox_' + i + '" type="checkbox" /></td>';
//                            //}
//                            html += '<td class="projectTypeId">' + availableProjectTypes[i].bwFunctionalAreaTitle + '</td>';
//                            html += '<td>&nbsp;</td>';
//                            //html += '<td class="projectTypeName">' + availableProjectTypes[i].bwFunctionalAreaTitle + '</td>';
//                            html += '<td class="projectTypeName"></td>';
//                            html += '</tr>';
//                        }
//                        html += '</table>';


//                        $('#spanProjectTypeMultiPickerDialogContent').html(html);


//                        $("#divProjectTypeMultiPickerDialog").dialog({
//                            modal: true,
//                            resizable: false,
//                            //closeText: "Cancel",
//                            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
//                            title: 'Project Type picker',
//                            width: '800',
//                            dialogClass: 'no-close', // No close button in the upper right corner.
//                            hide: false, // This means when hiding just disappear with no effects.
//                            open: function () {
//                                $('.ui-widget-overlay').bind('click', function () {
//                                    $('#divProjectTypeMultiPickerDialog').dialog('close');
//                                });
//                            },
//                            close: function () {
//                                //$(this).dialog('destroy').remove();
//                            }
//                            //buttons: {
//                            //    "Close": function () {
//                            //        $(this).dialog("close");
//                            //    }
//                            //}
//                        });
//                        $('#divProjectTypeMultiPickerDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
















//                    } catch (e) {
//                        //lpSpinner.Hide();
//                        console.log('Exception in raci.html.displayProjectTypeMultiPicker().Get[odata/ProjectTypes].done: ' + e.message + ', ' + e.stack);
//                    }
//                },
//                error: function (data, errorCode, errorMessage) {
//                    displayAlertDialog('Error populating functional areas.');
//                    //WriteToErrorLog('Error in bw.initar.js.populateFunctionalAreas()', 'Error populating functional areas: ' + errorCode + ', ' + errorMessage);
//                }
//            });
















//            //$.ajax({
//            //    url: this.options.operationUriPrefix + "odata/ProjectTypes", //
//            //    dataType: "json",
//            //    contentType: "application/json",
//            //    type: "Get",
//            //    timeout: this.options.ajaxTimeout
//            //}).done(function (result) {
//            //    try {
//            //        //console.log('In raci.html.displayProjectTypeMultiPicker().Get[odata/ProjectTypes].done: result: ' + JSON.stringify(result));
//            //        var availableProjectTypes;
//            //        if (result) {
//            //            availableProjectTypes = result.value;
//            //        } else {
//            //            console.log('In raci.html.displayProjectTypeMultiPicker().Get[odata/Roles].done: result: ' + JSON.stringify(result));
//            //        }
//            //        // Get the "Cond" value.
//            //        var cond = $('#' + elementId).find('.cond').attr('bwOldValue'); // eg: 	$ProjectType~IM,FS,WS,ENV,PSM,IT,EXP
//            //        if (cond) {
//            //            // We have to parse out the selected/existing project types here.
//            //            var selectedProjectTypes = cond.split('$ProjectType~')[1];
//            //            if (selectedProjectTypes && selectedProjectTypes.indexOf('&') > -1) {
//            //                selectedProjectTypes = selectedProjectTypes.split('&')[0];
//            //            }
//            //        }
//            //        var html = '';
//            //        html += '<input type="hidden" id="ProjectTypeMultiPickerDialog_AssignmentElementId" value="' + elementId + '" />'; // This is how we will be able to look up the assignment row.
//            //        if (availableProjectTypes) {
//            //            html += '<table>';
//            //            for (var i = 0; i < availableProjectTypes.length; i++) {
//            //                html += '<tr class="projectTypeRow">';
//            //                // Iterate through the list to see if we have a selected one or not.
//            //                var isSelected = false;
//            //                if (selectedProjectTypes) {
//            //                    for (var p = 0; p < selectedProjectTypes.split(',').length; p++) {
//            //                        if (availableProjectTypes[i].ProjectTypeId == selectedProjectTypes.split(',')[p]) {
//            //                            //console.log('availableProjectTypes[i].ProjectTypeId: ' + availableProjectTypes[i].ProjectTypeId + ', selectedProjectTypes.split(',')[p]: ' + selectedProjectTypes.split(',')[p]);
//            //                            isSelected = true;
//            //                        }
//            //                    }
//            //                }
//            //                if (isSelected) {
//            //                    html += '<td><input id="' + 'projectTypeCheckbox_' + i + '" type="checkbox" checked /></td>';
//            //                } else {
//            //                    html += '<td><input id="' + 'projectTypeCheckbox_' + i + '" type="checkbox" /></td>';
//            //                }
//            //                html += '<td class="projectTypeId">' + availableProjectTypes[i].ProjectTypeId + '</td>';
//            //                html += '<td>&nbsp;</td>';
//            //                html += '<td class="projectTypeName">' + availableProjectTypes[i].Name + '</td>';
//            //                html += '</tr>';
//            //            }
//            //            html += '</table>';
//            //        } else {
//            //            html += 'No "Project Types" were available.';
//            //        }

//            //        $('#spanProjectTypeMultiPickerDialogContent').html(html);

//            //        $("#divProjectTypeMultiPickerDialog").dialog({
//            //            modal: true,
//            //            resizable: false,
//            //            //closeText: "Cancel",
//            //            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
//            //            title: 'Project Type picker',
//            //            width: '800',
//            //            dialogClass: 'no-close', // No close button in the upper right corner.
//            //            hide: false, // This means when hiding just disappear with no effects.
//            //            open: function () {
//            //                $('.ui-widget-overlay').bind('click', function () {
//            //                    $('#divProjectTypeMultiPickerDialog').dialog('close');
//            //                });
//            //            },
//            //            close: function () {
//            //                //$(this).dialog('destroy').remove();
//            //            }
//            //            //buttons: {
//            //            //    "Close": function () {
//            //            //        $(this).dialog("close");
//            //            //    }
//            //            //}
//            //        });
//            //        $('#divProjectTypeMultiPickerDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
//            //    } catch (e) {
//            //        //lpSpinner.Hide();
//            //        console.log('Exception in raci.html.displayProjectTypeMultiPicker().Get[odata/ProjectTypes].done: ' + e.message + ', ' + e.stack);
//            //    }
//            //}).fail(function (data) {
//            //    //lpSpinner.Hide();
//            //    var msg;
//            //    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
//            //        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
//            //    } else {
//            //        msg = JSON.stringify(data);
//            //    }
//            //    alert('Error in raci.html.displayProjectTypeMultiPicker().Get[odata/ProjectTypes].fail: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
//            //    console.log('Error in raci.html.displayProjectTypeMultiPicker().Get[odata/ProjectTypes].fail:' + JSON.stringify(data));
//            //    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
//            //    //var error = JSON.parse(data.responseText)["odata.error"];
//            //    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
//            //});
//        } catch (e) {
//            console.log('Exception in displayProjectTypeMultiPicker(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    displayPillarMultiPicker: function (elementId) {
//        try {
//            console.log('In displayPillarMultiPicker().');
//            try {
//                console.log('In displayPillarMultiPicker(). elementId: ' + elementId);
//                $.ajax({
//                    url: this.options.operationUriPrefix + "odata/Pillars",
//                    dataType: "json",
//                    contentType: "application/json",
//                    type: "Get",
//                    timeout: this.options.ajaxTimeout
//                }).done(function (result) {
//                    try {
//                        //console.log('In raci.html.displayPillarMultiPicker().Get[odata/Pillars].done: result: ' + JSON.stringify(result));
//                        var availablePillars;
//                        if (result) {
//                            availablePillars = result.value;
//                        } else {
//                            console.log('In raci.html.displayPillarMultiPicker().Get[odata/Roles].done: result: ' + JSON.stringify(result));
//                        }
//                        // Get the "Cond" value.
//                        var cond = $('#' + elementId).find('.cond').attr('bwOldValue'); // eg: 	$ProjectType~IM,FS,WS,ENV,PSM,IT,EXP
//                        if (cond) {
//                            // We have to parse out the selected/existing project types here.
//                            var selectedPillars = cond.split('$PillarId~')[1];
//                            if (selectedPillars && selectedPillars.indexOf('&') > -1) {
//                                selectedPillars = selectedPillars.split('&')[0];
//                            }
//                        }
//                        var html = '';
//                        html += '<input type="hidden" id="PillarMultiPickerDialog_AssignmentElementId" value="' + elementId + '" />'; // This is how we will be able to look up the assignment row.
//                        if (availablePillars) {
//                            html += '<table>';
//                            for (var i = 0; i < availablePillars.length; i++) {
//                                html += '<tr class="pillarRow">';
//                                // Iterate through the list to see if we have a selected one or not.
//                                var isSelected = false;
//                                if (selectedPillars) {
//                                    for (var p = 0; p < selectedPillars.split(',').length; p++) {
//                                        if (availablePillars[i].PillarId == selectedPillars.split(',')[p]) {
//                                            //console.log('availablePillars[i].PillarId: ' + availablePillars[i].PillarId + ', selectedPillars.split(',')[p]: ' + selectedPillars.split(',')[p]);
//                                            isSelected = true;
//                                        }
//                                    }
//                                }
//                                if (isSelected) {
//                                    html += '<td><input id="' + 'pillarCheckbox_' + i + '" type="checkbox" checked /></td>';
//                                } else {
//                                    html += '<td><input id="' + 'pillarCheckbox_' + i + '" type="checkbox" /></td>';
//                                }
//                                html += '<td class="pillarId">' + availablePillars[i].PillarId + '</td>';
//                                html += '<td>&nbsp;</td>';
//                                html += '<td class="pillarName">' + availablePillars[i].Name + '</td>';
//                                html += '</tr>';
//                            }
//                            html += '</table>';
//                        } else {
//                            html += 'No "Pillars" were available.';
//                        }
//                        $('#spanPillarMultiPickerDialogContent').html(html);

//                        $("#divPillarMultiPickerDialog").dialog({
//                            modal: true,
//                            resizable: false,
//                            //closeText: "Cancel",
//                            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
//                            title: 'Project Type picker',
//                            width: '800',
//                            dialogClass: 'no-close', // No close button in the upper right corner.
//                            hide: false, // This means when hiding just disappear with no effects.
//                            open: function () {
//                                $('.ui-widget-overlay').bind('click', function () {
//                                    $('#divPillarMultiPickerDialog').dialog('close');
//                                });
//                            },
//                            close: function () {
//                                //$(this).dialog('destroy').remove();
//                            }
//                            //buttons: {
//                            //    "Close": function () {
//                            //        $(this).dialog("close");
//                            //    }
//                            //}
//                        });
//                        $('#divPillarMultiPickerDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
//                    } catch (e) {
//                        //lpSpinner.Hide();
//                        console.log('Exception in raci.html.displayPillarMultiPicker().Get[odata/Pillars].done: ' + e.message + ', ' + e.stack);
//                    }
//                }).fail(function (data) {
//                    //lpSpinner.Hide();
//                    var msg;
//                    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
//                        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
//                    } else {
//                        msg = JSON.stringify(data);
//                    }
//                    alert('Error in raci.html.displayPillarMultiPicker().Get[odata/Pillars].fail: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
//                    console.log('Error in raci.html.displayPillarMultiPicker().Get[odata/Pillars].fail:' + JSON.stringify(data));
//                    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
//                    //var error = JSON.parse(data.responseText)["odata.error"];
//                    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
//                });
//            } catch (e) {
//                console.log('Exception in displayPillarMultiPicker(): ' + e.message + ', ' + e.stack);
//            }
//        } catch (e) {
//            console.log('Exception in displayPillarMultiPicker(): ' + e.message + ', ' + e.stack);
//        }
//    },

//    displayPeoplePickerDialog: function (friendlyNameSourceField, idSourceField, emailSourceField, buttonToEnable) {
//        try {
//            console.log('In displayPeoplePickerDialog().');
//            if (!participantId) {
//                console.log('In displayPeoplePickerDialog(). User is not logged in, so displaying the logon.');
//                initializeTheLogon(); // The user needs to be logged in before they add anyone.
//            } else {
//                $('#txtPeoplePickerDialogSearchBox').empty(); // Clear the search text box.
//                $('#PeoplePickerDialog').dialog({
//                    modal: true,
//                    resizable: false,
//                    closeText: "Cancel",
//                    closeOnEscape: true, // Hit the ESC key to hide! Yeah!
//                    //title: "Select a person...", //"Enter your early adopter code...",
//                    width: "570px",
//                    dialogClass: "no-close", // No close button in the upper right corner.
//                    hide: false, // This means when hiding just disappear with no effects.
//                    open: function () {
//                        $('.ui-widget-overlay').bind('click', function () {
//                            $("#PeoplePickerDialog").dialog('close');
//                        });
//                    } // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.
//                });
//                $("#PeoplePickerDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

//                $('#spanPeoplePickerDialogTitle').html('Select a person...');

//                // Now we can hook up the Participant text box for autocomplete.
//                $("#txtPeoplePickerDialogSearchBox").autocomplete({
//                    source: function (request, response) {
//                        if (request.term == '') {
//                            this.renderAllParticipantsInThePeoplePicker(); // Nothing is in the search box, so show all participants.
//                        } else {
//                            $.ajax({
//                                //url: appweburl + "/tenant/" + tenantId + "/participants/" + request.term,
//                                url: webserviceurl + "/workflow/" + workflowAppId + "/participants/" + request.term,
//                                dataType: "json",
//                                success: function (data) {
//                                    $('#spanPeoplePickerParticipantsList').empty();
//                                    var html = '';
//                                    if (data.participants.length > 0) {
//                                        //var searchArray = [];
//                                        for (var i = 0; i < data.participants.length; i++) {
//                                            //searchArray[i] = data.participants[i].participant;
//                                            //var strParticipant = '<a href="">' + data.participants[i].participant.split('|')[0] + ' <i>(' + data.participants[i].participant.split('|')[2] + ')</i></a>';

//                                            html += '<a href="javascript:$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'cmdReturnParticipantIdToField\', \'' + friendlyNameSourceField + '\', \'' + idSourceField + '\', \'' + emailSourceField + '\', \'' + data.participants[i].participant.split('|')[0] + '\', \'' + data.participants[i].participant.split('|')[1] + '\', \'' + data.participants[i].participant.split('|')[2] + '\', \'' + buttonToEnable + '\');">' + data.participants[i].participant.split('|')[0] + '&nbsp;&nbsp;<i>(' + data.participants[i].participant.split('|')[2] + ')</i></a>';


//                                            //html += strParticipant; //data.participants[i].participant;
//                                            html += '<br />';
//                                            //response(searchArray);
//                                        }
//                                    } else {
//                                        // There were no results.
//                                        html += '<span><i>There were no results</i></span>';
//                                    }
//                                    $('#spanPeoplePickerParticipantsList').append(html);
//                                }
//                            });
//                        }
//                    },
//                    minLength: 0, // minLength specifies how many characters have to be typed before this gets invoked.
//                    select: function (event, ui) {
//                        //log(ui.item ? "Selected: " + ui.item.label : "Nothing selected, input was " + this.value);
//                        //document.getElementById('btnSearch').disabled = false; // Enable the search button when there is valid content in it.
//                    },
//                    open: function () {
//                        //$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
//                        //document.getElementById('btnSearch').disabled = true; // Disable the search button until there is valid content in it.
//                    },
//                    close: function () {
//                        //$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
//                        var peoplePickerParticipantName = this.value.split('|')[0];
//                        var peoplePickerParticipantId = this.value.split('|')[1];
//                        var peoplePickerParticipantEmail = this.value.split('|')[2];

//                        if (peoplePickerParticipantName.indexOf('undefined') > -1) {
//                            document.getElementById('txtPeoplePickerDialogSearchBox').value = '';
//                            document.getElementById('txtPeoplePickerDialogParticipantId').value = '';
//                            document.getElementById('txtPeoplePickerDialogParticipantEmail').value = '';
//                        } else {
//                            document.getElementById('txtPeoplePickerDialogSearchBox').value = peoplePickerParticipantName; //this.value.split(' ')[0] + ' ' + this.value.split(' ')[1]; // Just shows the Loan Number parameter (removing the borrower name) so it fits in the text box.
//                            document.getElementById('txtPeoplePickerDialogParticipantId').value = peoplePickerParticipantId;
//                            document.getElementById('txtPeoplePickerDialogParticipantEmail').value = peoplePickerParticipantEmail;
//                        }
//                    }
//                });

//                // List all participants.
//                this.renderAllParticipantsInThePeoplePicker(friendlyNameSourceField, idSourceField, emailSourceField, buttonToEnable); // We do this the first time to make sure they are all displayed.
//            }
//        } catch (e) {
//            console.log('Exception in displayPeoplePickerDialog: ' + e.message + ', ' + e.stack);
//        }
//    },

//    displayConfigureEmailNotificationsDialog: function (elementId) {
//        try {
//            console.log('In displayConfigureEmailNotificationsDialog().');
//            try {
//                console.log('In displayConfigureEmailNotificationsDialog(). elementId: ' + elementId);
//                $.ajax({
//                    url: this.options.operationUriPrefix + "odata/Pillars",
//                    dataType: "json",
//                    contentType: "application/json",
//                    type: "Get",
//                    timeout: this.options.ajaxTimeout
//                }).done(function (result) {
//                    try {
//                        //console.log('In raci.html.displayPillarMultiPicker().Get[odata/Pillars].done: result: ' + JSON.stringify(result));
//                        var availablePillars;
//                        if (result) {
//                            availablePillars = result.value;
//                        } else {
//                            console.log('In raci.html.displayConfigureEmailNotificationsDialog().Get[odata/Roles].done: result: ' + JSON.stringify(result));
//                        }
//                        // Get the "Cond" value.
//                        var cond = $('#' + elementId).find('.cond').attr('bwOldValue'); // eg: 	$ProjectType~IM,FS,WS,ENV,PSM,IT,EXP
//                        if (cond) {
//                            // We have to parse out the selected/existing project types here.
//                            var selectedPillars = cond.split('$PillarId~')[1];
//                            if (selectedPillars && selectedPillars.indexOf('&') > -1) {
//                                selectedPillars = selectedPillars.split('&')[0];
//                            }
//                        }
//                        var html = '';
//                        html += '<input type="hidden" id="ConfigureEmailNotificationsDialog_AssignmentElementId" value="' + elementId + '" />'; // This is how we will be able to look up the assignment row.
//                        if (availablePillars) {
//                            html += '<table>';
//                            for (var i = 0; i < availablePillars.length; i++) {
//                                html += '<tr class="pillarRow">';
//                                // Iterate through the list to see if we have a selected one or not.
//                                var isSelected = false;
//                                if (selectedPillars) {
//                                    for (var p = 0; p < selectedPillars.split(',').length; p++) {
//                                        if (availablePillars[i].PillarId == selectedPillars.split(',')[p]) {
//                                            //console.log('availablePillars[i].PillarId: ' + availablePillars[i].PillarId + ', selectedPillars.split(',')[p]: ' + selectedPillars.split(',')[p]);
//                                            isSelected = true;
//                                        }
//                                    }
//                                }
//                                if (isSelected) {
//                                    html += '<td><input id="' + 'pillarCheckbox_' + i + '" type="checkbox" checked /></td>';
//                                } else {
//                                    html += '<td><input id="' + 'pillarCheckbox_' + i + '" type="checkbox" /></td>';
//                                }
//                                html += '<td class="pillarId">' + availablePillars[i].PillarId + '</td>';
//                                html += '<td>&nbsp;</td>';
//                                html += '<td class="pillarName">' + availablePillars[i].Name + '</td>';
//                                html += '</tr>';
//                            }
//                            html += '</table>';
//                        } else {
//                            html += 'No "Pillars" were available.';
//                        }
//                        $('#spanConfigureEmailNotificationsDialogContent').html(html);

//                        $("#divConfigureEmailNotificationsDialog").dialog({
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
//                                    $('#divConfigureEmailNotificationsDialog').dialog('close');
//                                });

//                                //console.log('$(".ql-toolbar"): ' + JSON.stringify($('.ql-toolbar')));
//                                //if (!document.getElementById('ConfigureEmailNotificationsDialogEditor').length || document.getElementById('ConfigureEmailNotificationsDialogEditor').length == 0) { // Check if it has been instantiated already.
//                                //if (!document.getElementById('ConfigureEmailNotificationsDialogEditor').div == 'undefined') { // Check if it has been instantiated already.
//                                //if (!$('.ql-toolbar')) {
//                                var quill = new Quill('#ConfigureEmailNotificationsDialogEditor', {
//                                    modules: {
//                                        toolbar: [
//                                          [{ header: [1, 2, false] }],
//                                          ['bold', 'italic', 'underline'],
//                                          ['image', 'code-block']
//                                        ]
//                                    },
//                                    placeholder: 'The enhanced notification email editor functionality is coming soon...', //'Compose an epic...',
//                                    theme: 'snow'  // or 'bubble'
//                                });
//                            },
//                            close: function () {
//                                $('#divConfigureEmailNotificationsDialog').dialog('destroy');
//                            }
//                        });
//                        $('#divConfigureEmailNotificationsDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
//                    } catch (e) {
//                        //lpSpinner.Hide();
//                        console.log('Exception in raci.html.displayConfigureEmailNotificationsDialog().Get[odata/Pillars].done: ' + e.message + ', ' + e.stack);
//                    }
//                }).fail(function (data) {
//                    //lpSpinner.Hide();
//                    var msg;
//                    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
//                        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
//                    } else {
//                        msg = JSON.stringify(data);
//                    }
//                    alert('Error in raci.html.displayConfigureEmailNotificationsDialog().Get[odata/Pillars].fail: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
//                    console.log('Error in raci.html.displayConfigureEmailNotificationsDialog().Get[odata/Pillars].fail:' + JSON.stringify(data));
//                    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
//                    //var error = JSON.parse(data.responseText)["odata.error"];
//                    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
//                });
//            } catch (e) {
//                console.log('Exception in displayConfigureEmailNotificationsDialog(): ' + e.message + ', ' + e.stack);
//            }
//        } catch (e) {
//            console.log('Exception in displayConfigureEmailNotificationsDialog(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    //editCollaborationTimeoutEmail: function() {
//    //    try {
//    //        console.log('In editCollaborationTimeoutEmail().');
//    //        var thiz = this;
//    //        // Set the dialog title.
//    //        document.getElementById('spanConfigureEmailNotificationsDialogSubTitle').innerHTML = 'This email gets sent to participants of the "Collaboration" stage when it times out';
//    //        // Display the email editor.
//    //        $("#divConfigureEmailNotificationsDialog").dialog({
//    //            modal: true,
//    //            resizable: false,
//    //            //closeText: "Cancel",
//    //            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
//    //            //title: 'divConfigureEmailNotificationsDialog',
//    //            width: '800',
//    //            dialogClass: 'no-close', // No close button in the upper right corner.
//    //            hide: false, // This means when hiding just disappear with no effects.
//    //            open: function () {
//    //                $('.ui-widget-overlay').bind('click', function () {
//    //                    $('#divConfigureEmailNotificationsDialog').dialog('close');
//    //                });
//    //                // Display the email editor.
//    //                thiz.options.quill = new Quill('#ConfigureEmailNotificationsDialogEditor', {
//    //                    modules: {
//    //                        toolbar: '#bwQuilltoolbar'
//    //                    },
//    //                    //placeholder: 'The enhanced notification email editor functionality is coming soon...', 
//    //                    theme: 'snow'  
//    //                });
//    //                // Hook up this button event so that the user can insert data items into the email.
//    //                var customButton = document.querySelector('#btnQuill_InsertADataItem');
//    //                customButton.addEventListener('click', function () {
//    //                    console.log('btnQuill_InsertADataItem: This functionality is incomplete. Coming soon!');
//    //                    thiz.displayEmailDataItemPickerDialog();
//    //                });
//    //                // Retrieve the email from the workflow and display it in the editor.
//    //                var emailTemplate = '';
//    //                for (var i = 0; i < thiz.options.store.Workflow.Steps.Step.length; i++) {
//    //                    if (thiz.options.store.Workflow.Steps.Step[i]["@Name"] == 'Collaboration') {
//    //                        emailTemplate = thiz.options.store.Workflow.Steps.Step[i]["@EmailTemplate"];
//    //                        break;
//    //                    }
//    //                }
//    //                if (emailTemplate && emailTemplate != '') {
//    //                    thiz.options.quill.setText(emailTemplate); 
//    //                } else {
//    //                    thiz.options.quill.setText('');
//    //                }
//    //            },
//    //            close: function () {
//    //                //$(this).dialog('destroy').remove();
//    //            }
//    //        });
//    //        $('#divConfigureEmailNotificationsDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
//    //    } catch (e) {
//    //        console.log('Exception in editCollaborationTimeoutEmail(): ' + e.message + ', ' + e.stack);
//    //    }
//    //},
//    editStepEmails: function (stepName) {
//        try {
//            console.log('In editStepEmails().');
//            var thiz = this;
//            // Set the dialog title.
//            document.getElementById('spanConfigureEmailNotificationsDialogSubTitle').innerHTML = 'This email gets sent to participants of the "' + stepName + '" stage';
//            // Set the "Save" button.
//            var html = '';
//            html += '<div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveEmailTemplateForStep\', \'' + stepName + '\');">';
//            html += 'Save this email template';
//            html += '</div>';
//            document.getElementById('spanConfigureEmailNotificationsDialogSaveButton').innerHTML = html;
//            // Display the email editor.
//            $("#divConfigureEmailNotificationsDialog").dialog({
//                modal: true,
//                resizable: false,
//                //closeText: "Cancel",
//                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
//                //title: 'divConfigureEmailNotificationsDialog',
//                width: '800',
//                dialogClass: 'no-close', // No close button in the upper right corner.
//                hide: false, // This means when hiding just disappear with no effects.
//                open: function () {
//                    $('.ui-widget-overlay').bind('click', function () {
//                        $('#divConfigureEmailNotificationsDialog').dialog('close');
//                    });
//                    // Display the email editor.
//                    thiz.options.quill = new Quill('#ConfigureEmailNotificationsDialogEditor', {
//                        modules: {
//                            toolbar: '#bwQuilltoolbar'
//                        },
//                        //placeholder: 'The enhanced notification email editor functionality is coming soon...', 
//                        theme: 'snow'
//                    });
//                    // Hook up this button event so that the user can insert data items into the email.
//                    var customButton = document.querySelector('#btnQuill_InsertADataItem');
//                    customButton.addEventListener('click', function () {
//                        console.log('btnQuill_InsertADataItem: This functionality is incomplete. Coming soon!');
//                        thiz.displayEmailDataItemPickerDialog();
//                    });
//                    // Retrieve the email from the workflow and display it in the editor.
//                    var emailTemplate = '';
//                    for (var i = 0; i < thiz.options.store.Workflow.Steps.Step.length; i++) {
//                        if (thiz.options.store.Workflow.Steps.Step[i]["@Name"] == stepName) {
//                            emailTemplate = thiz.options.store.Workflow.Steps.Step[i]["@EmailTemplate"];
//                            break;
//                        }
//                    }
//                    if (emailTemplate && emailTemplate != '') {
//                        thiz.options.quill.setText(emailTemplate);
//                    } else {
//                        thiz.options.quill.setText('');
//                    }
//                },
//                close: function () {
//                    $('#divConfigureEmailNotificationsDialog').dialog('destroy');
//                }
//            });
//            $('#divConfigureEmailNotificationsDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
//        } catch (e) {
//            console.log('Exception in editStepEmails(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    displayEmailDataItemPickerDialog: function () {
//        try {
//            console.log('In displayEmailDataItemPickerDialog().');
//            //
//            //debugger;
//            $("#divEmailDataItemPickerDialog").dialog({
//                modal: true,
//                resizable: false,
//                //closeText: "Cancel",
//                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
//                //title: 'divEmailDataItemPickerDialog',
//                width: '600',
//                dialogClass: "no-close", // No close button in the upper right corner.
//                hide: false, // This means when hiding just disappear with no effects.
//                open: function () {
//                    $('.ui-widget-overlay').bind('click', function () {
//                        $("#divEmailDataItemPickerDialog").dialog('close');
//                    });
//                    //document.getElementById('txtCreateANewRoleDialog_RoleId').value = document.getElementById('textNewRoleId').value;
//                    //document.getElementById('txtCreateANewRoleDialog_RoleName').value = document.getElementById('textNewRoleName').value;
//                },
//                close: function () {
//                    //$(this).dialog('destroy').remove();
//                    $('#divEmailDataItemPickerDialog').dialog('destroy');
//                }
//            });
//            //$("#divEmailDataItemPickerDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
//            //debugger;
//            document.getElementById('spanEmailDataItemPickerDialogSubTitle').innerHTML = 'Select a data item then click the "Insert" button...';
//            var html = '';
//            html += '<select id="selectEmailDataItemPickerDialogDataItem" style="padding:5px 5px 5px 5px;">';
//            html += '   <option value="1">Select a data item...</option>';
//            html += '   <option value="3">&#10697; Company Logo</option>';
//            html += '   <option value="2">&#9863; Participant Friendly Name</option>';
//            html += '   <option value="2">&#9863; Participant Email</option>';
//            html += '   <option value="3">&#9992; Budget Request Link</option>';
//            html += '   <option value="3">&#9993; Configure Email Settings Link</option>';
//            html += '   <option value="3">&#9775; Disclaimer/Legal Text</option>';
//            html += '   <option value="3">&#9746; Unsubscribe Link</option>';
//            html += '   <option value="3">Budget Request Number</option>';
//            html += '   <option value="3">Role Abbreviation</option>';
//            html += '   <option value="3">Role Name</option>';
//            html += '</select>';
//            html += '&nbsp;&nbsp;';
//            html += '<input style="padding:5px 10px 5px 10px;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'insertEmailDataItem\');" type="button" value="Insert">';
//            document.getElementById('spanEmailDataItemPickerDialogContentTop').innerHTML = html;
//        } catch (e) {
//            console.log('Exception in displayEmailDataItemPickerDialog(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    displayWorkflowActionsUnderlyingPropertiesDialog: function (elementId, actionTitle) {
//        try {
//            console.log('In displayWorkflowActionsUnderlyingPropertiesDialog(). elementId: ' + elementId + ', actionTitle: ' + actionTitle);
//            var x = elementId.split('_')[1];
//            var stepIndex = x.split('_')[0];
//            var rowIndex = elementId.split('_')[2];

//            //$("#divEmailDataItemPickerDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
//            //debugger;
//            document.getElementById('spanWorkflowActionsUnderlyingPropertiesDialogSubTitle').innerHTML = 'Update the properties for the "' + actionTitle + '" button, then click "Save"...';
//            var html = '';
//            // "@JavaScript": "$('#divRequestFormDialog').dialog('close');", "Tooltip": "Cancel the entire request"
//            var tooltip = '';
//            var javascript = '';
//            //debugger;
//            for (var i = 0; i < this.options.store.DraftWorkflow.Steps.Step[stepIndex].Assign[rowIndex].Action.length; i++) {
//                if (this.options.store.DraftWorkflow.Steps.Step[stepIndex].Assign[rowIndex].Action[i]["@Name"] == actionTitle) {
//                    //debugger;
//                    var action = this.options.store.DraftWorkflow.Steps.Step[stepIndex].Assign[rowIndex].Action[i];
//                    if (action.Tooltip) tooltip = action.Tooltip;
//                    if (action["@JavaScript"]) javascript = action["@JavaScript"];
//                    break;
//                }
//            }
//            html += 'Tooltip: <input id="WorkflowActionsUnderlyingPropertiesDialog_Tooltip" type="text" style="width:425px;" value="' + tooltip + '"/>';
//            html += '<br />';
//            html += '<br />';
//            html += 'JavaScript: <input id="WorkflowActionsUnderlyingPropertiesDialog_JavaScript" type="text" style="width:425px;" value="' + javascript + '"/>';
//            html += '<br />';
//            html += '<br />';
//            html += '&nbsp;&nbsp;';
//            html += '<input style="padding:5px 10px 5px 10px;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'saveWorkflowActionsUnderlyingProperties\', \'' + elementId + '\', \'' + actionTitle + '\');" type="button" value="Save">';
//            document.getElementById('spanWorkflowActionsUnderlyingPropertiesDialogContentTop').innerHTML = html;

//            $("#divWorkflowActionsUnderlyingPropertiesDialog").dialog({
//                modal: true,
//                resizable: false,
//                //closeText: "Cancel",
//                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
//                //title: 'divEmailDataItemPickerDialog',
//                width: '600',
//                dialogClass: "no-close", // No close button in the upper right corner.
//                hide: false, // This means when hiding just disappear with no effects.
//                open: function () {
//                    $('.ui-widget-overlay').bind('click', function () {
//                        $('#divWorkflowActionsUnderlyingPropertiesDialog').dialog('close');
//                    });
//                },
//                close: function () {
//                    //$(this).dialog('destroy'); //.remove();
//                    $('#divWorkflowActionsUnderlyingPropertiesDialog').dialog('destroy');
//                }
//            });
//        } catch (e) {
//            console.log('Exception in displayWorkflowActionsUnderlyingPropertiesDialog(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    saveWorkflowActionsUnderlyingProperties: function (elementId, actionTitle) {
//        try {
//            console.log('In saveWorkflowActionsUnderlyingProperties(' + elementId + ', ' + actionTitle + '). actionTitle: ' + actionTitle);
//            var x = elementId.split('_')[1];
//            var stepIndex = x.split('_')[0];
//            var rowIndex = elementId.split('_')[2];
//            //debugger;
//            var tooltip = document.getElementById('WorkflowActionsUnderlyingPropertiesDialog_Tooltip').value;
//            var javascript = document.getElementById('WorkflowActionsUnderlyingPropertiesDialog_JavaScript').value;

//            for (var i = 0; i < this.options.store.Workflow.Steps.Step[stepIndex].Assign[rowIndex].Action.length; i++) {
//                if (this.options.store.Workflow.Steps.Step[stepIndex].Assign[rowIndex].Action[i]["@Name"] == actionTitle) {
//                    //debugger;
//                    this.options.store.Workflow.Steps.Step[stepIndex].Assign[rowIndex].Action[i].Tooltip = tooltip;
//                    this.options.store.Workflow.Steps.Step[stepIndex].Assign[rowIndex].Action[i]["@JavaScript"] = javascript;
//                    //break;
//                }
//            }
//            $('#divWorkflowActionsUnderlyingPropertiesDialog').dialog('close');
//            this.checkIfWeHaveToDisplayThePublishChangesButton();
//        } catch (e) {
//            console.log('Exception in saveWorkflowActionsUnderlyingProperties(' + actionTitle + '): ' + e.message + ', ' + e.stack);
//        }
//    },
//    insertEmailDataItem: function () {
//        try {
//            console.log('In insertEmailDataItem().');
//            // Get the selected value.
//            var selectedDataItem;
//            $('#selectEmailDataItemPickerDialogDataItem').find('option:selected').each(function (index, element) {
//                selectedDataItem = element.innerHTML;
//            });
//            // Close the dialog.
//            $("#divEmailDataItemPickerDialog").dialog('close');
//            // Update the email editor.
//            var insertIndex = 0;
//            var range = this.options.quill.getSelection();
//            if (range) {
//                if (range.length == 0) {
//                    console.log('User cursor is at index', range.index);
//                    insertIndex = range.index;
//                } else {
//                    var text = quill.getText(range.index, range.length);
//                    console.log('User has highlighted: ', text);
//                    insertIndex = range.index;
//                }
//            } else {
//                console.log('User cursor is not in editor');
//            }

//            var html = '';
//            //html += '<span style="">';
//            html += '[' + selectedDataItem + ']';
//            //html += '</span>';
//            this.options.quill.insertText(insertIndex, html, {
//                //'color': 'green',
//                //'bold': true
//            });


//        } catch (e) {
//            console.log('Exception in insertEmailDataItem(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    //saveEmailTemplateForStep: function (stepName) { // was named saveCollaborationTimeoutEmail 
//    //    try {
//    //        console.log('In saveEmailTemplateForStep(' + stepName + ').');
//    //        var emailTemplate = this.options.quill.getText();
//    //        for (var i = 0; i < this.options.store.Workflow.Steps.Step.length; i++) {
//    //            if (this.options.store.Workflow.Steps.Step[i]["@Name"] == stepName) { //'Collaboration') {
//    //                this.options.store.Workflow.Steps.Step[i]["@EmailTemplate"] = emailTemplate;
//    //                $('#divConfigureEmailNotificationsDialog').dialog('close');
//    //                this.checkIfWeHaveToDisplayThePublishChangesButton();
//    //                break;
//    //            }
//    //        }
//    //    } catch (e) {
//    //        console.log('Exception in saveEmailTemplateForStep(' + stepName + '): ' + e.message + ', ' + e.stack);
//    //    }
//    //},
//    renderAllParticipantsInThePeoplePicker: function (friendlyNameSourceField, idSourceField, emailSourceField, buttonToEnable) {
//        try {
//            $('#spanPeoplePickerParticipantsList').empty();
//            var data = {
//                "bwWorkflowAppId": workflowAppId
//            };
//            $.ajax({
//                url: webserviceurl + "/workflow/participants",
//                type: "DELETE",
//                contentType: 'application/json',
//                data: JSON.stringify(data),
//                success: function (data1) {
//                    var data = data1.BwWorkflowUsers;
//                    var html = '';
//                    for (var i = 0; i < data.length; i++) {
//                        html += '<a href="javascript:$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'cmdReturnParticipantIdToField\', \'' + friendlyNameSourceField + '\', \'' + idSourceField + '\', \'' + emailSourceField + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantEmail + '\', \'' + buttonToEnable + '\');">' + data[i].bwParticipantFriendlyName + '&nbsp;&nbsp;<i>(' + data[i].bwParticipantEmail + ')</i></a>';
//                        html += '<br />';
//                    }
//                    $('#spanPeoplePickerParticipantsList').append(html);
//                },
//                error: function (data, errorCode, errorMessage) {
//                    this.displayAlertDialog('Error in my.js.renderAllParticipantsInThePeoplePicker():' + errorCode + ', ' + errorMessage);
//                }
//            });
//        } catch (e) {
//            console.log('Exception in renderAllParticipantsInThePeoplePicker(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    cmdReturnParticipantIdToField: function (friendlyNameSourceField, idSourceField, emailSourceField, selectedParticipantFriendlyName, selectedParticipantId, selectedParticipantEmail, buttonToEnable) {
//        try {
//            // The people picker calls this and 
//            //displayAlertDialog('You selected participant ' + selectedParticipantFriendlyName + ' to go in friendly name field ' + friendlyNameSourceField + '.\n\nThis functionality is incomplete. Coming soon!');
//            document.getElementById(friendlyNameSourceField).value = selectedParticipantFriendlyName;
//            document.getElementById(friendlyNameSourceField).setAttribute('title', selectedParticipantEmail);
//            document.getElementById(idSourceField).value = selectedParticipantId;
//            document.getElementById(emailSourceField).value = selectedParticipantEmail;

//            //$('#' + friendlyNameSourceField).val(selectedParticipantFriendlyName);
//            //$('#' + idSourceField).val(selectedParticipantId);
//            //$('#' + emailSourceField).val(selectedParticipantEmail);

//            // This enables the save button that may be next to the text box.
//            if (buttonToEnable && buttonToEnable != 'undefined') document.getElementById(buttonToEnable).disabled = false;

//            $('#PeoplePickerDialog').dialog('close');

//            // The following doesn't work for some reason.
//            //$('#' + friendlyNameSourceField).blur(); // Removes the focus from the field so that the user can't type in it.
//            //document.getElementById(friendlyNameSourceField).blur();
//        } catch (e) {
//            console.log('Exception in cmdReturnParticipantIdToField(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    renderParticipantInformation: function (userId) {
//        try {
//            console.log('renderParticipantInformation(). userId: ' + userId);
//            alert('In renderParticipantInformation(). userId: ' + userId);

//            //var stepGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//            //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
//            //    return v.toString(16);
//            //});

//            //var step = {
//            //    StepName: "NewStep-" + stepGuid,
//            //    InformRoles: [{}],
//            //    AssignRoles: [{}]
//            //};
//            //this.options.store.RaciSteps.push(step);

//            ////alert('In addARaciStep(). this.options.store: ' + JSON.stringify(this.options.store));

//            //this._create();
//        } catch (e) {
//            console.log('Exception in renderParticipantInformation(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    renderWorkflowsDropDownList: function () {
//        try {

//            $.ajax({
//                url: this.options.operationUriPrefix + "odata/WorkflowConfiguration/" + tenantId + '/' + workflowAppId + '/all',
//                dataType: "json",
//                contentType: "application/json",
//                type: "Get",
//                timeout: this.options.ajaxTimeout
//            }).done(function (result) {
//                try {
//                    var html = '';
//                    html += '<select style="padding:5px 5px 5px 5px;" id="workflowsDropDown" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'WorkflowsDropDown_Onchange\');">';
//                    for (var i = 0; i < result.value.length; i++) {
//                        var isTheActiveWorkflow = Boolean(result.value[i].bwWorkflowActive);
//                        if (isTheActiveWorkflow) {
//                            html += '<option value="' + result.value[i].bwWorkflowId + '" selected>';
//                            html += '>>>>> ACTIVE <<<<<   ';
//                            html += result.value[i].Description + ' ----- [Created by ' + result.value[i].CreatedBy + ', ' + result.value[i].Created + ']';
//                            html += '</option>';
//                        } else {
//                            html += '<option value="' + result.value[i].bwWorkflowId + '" >';
//                            html += result.value[i].Description + ' ----- [Created by ' + result.value[i].CreatedBy + ', ' + result.value[i].Created + ']';
//                            html += '</option>';
//                        }
//                    }
//                    html += '</select>';
//                    document.getElementById('spanWorkflowsDropDownList').innerHTML = html;
//                } catch (e) {
//                    console.log('Exception in renderWorkflowsDropDownList().done: ' + e.message + ', ' + e.stack);
//                }
//            }).fail(function (data, errorCode) {

//                //lpSpinner.Hide();
//                console.log('In xx.fail(): ' + JSON.stringify(data));
//                var msg;
//                if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
//                    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
//                } else {
//                    msg = JSON.stringify(data);
//                }
//                alert('Exception in bwWorkflowEditor.js.renderWorkflowsDropDownList().xx.Get: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
//                console.log('Exception in bwWorkflowEditor.js.renderWorkflowsDropDownList().xx.Get: ' + JSON.stringify(data));
//                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
//                //var error = JSON.parse(data.responseText)["odata.error"];
//                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
//            });
//        } catch (e) {
//            console.log('Exception in renderWorkflowsDropDownList(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    renderSelectRoleOrPersonSection: function (elementId) {
//        try {
//            console.log('In renderSelectRoleOrPersonSection().');
//            var thiz = this;
//            var selectRoleOrPersonCell = $('.selectroleorperson-editcell');
//            var stepIndex = elementId.split('_')[1]; // eg: 3
//            var roleIndex = elementId.split('_')[2]; // eg: 8
//            // Populate the "Roles" drop down.

//            $.ajax({
//                url: this.options.operationUriPrefix + "odata/Roles?$filter=IsWorkflowRole eq true",
//                dataType: "json",
//                contentType: "application/json",
//                type: "Get",
//                timeout: this.options.ajaxTimeout
//            }).done(function (result) {
//                try {
//                    // We need to get the workflowAppId, as well as roleId in order to get the list of users who belong to the role.
//                    var roles;
//                    if (result) {
//                        roles = result.value;
//                    } else {
//                        console.log('In renderSelectRoleOrPersonSection().Get[odata/Roles].done: result: ' + JSON.stringify(result));
//                    }

//                    var html = '';
//                    //html += '<td class="steprowcell">';

//                    //html += '<span class="selectarow-labeltext">Select a role:</span>';
//                    //html += '<br />';

//                    //html += ' <img style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayPeoplePickerDialog\', \'' + 'txtApprover2FriendlyName' + '\', \'' + 'txtApprover2Id' + '\', \'' + 'txtApprover2Email' + '\');" src="images/addressbook-icon18x18.png">';
//                    //html == '&nbsp;&nbsp;';

//                    var rolename = $('#' + elementId).find('.rolename').attr('bwOldValue');
//                    var roleId = $('#' + elementId).find('.rolename').attr('bwRoleId');
//                    html += '<select style="padding:5px 5px 5px 5px;" id="selectRoleName"  onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'RoleDropDown_Onchange\', \'' + 'selectRoleName' + '\');">';
//                    html += '  <option value=""></option>';
//                    for (var i = 0; i < roles.length; i++) {
//                        if (rolename == roles[i].RoleName) {
//                            html += '  <option value="' + roles[i].RoleId + '" selected >' + roles[i].RoleName + '</option>';
//                        } else {
//                            html += '  <option value="' + roles[i].RoleId + '">' + roles[i].RoleName + '</option>';
//                        }
//                    }
//                    html += '</select>';

//                    html += '&nbsp;<input style="padding:5px 10px 5px 10px;" id="btnCreateRole2" type="button" value="New Role..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayCreateANewRoleDialog\');" />';
//                    //html += '<br />[display role member(s)]';


//                    html += '<br />';
//                    //html += '<input id="txtRoleMembersFriendlyName_' + stepIndex + '_' + roleIndex + '" style="width:150px;color:grey;font-style:italic;" type="text" value=" [display role member(s)]" />';

//                    var orgId1 = 'ALL'; // using ALL until we build in the multiple locations support.
//                    $.ajax({
//                        url: thiz.options.operationUriPrefix + "odata/UserRole/" + workflowAppId + "/" + orgId1 + "/" + roleId, // pass workflowAppId, as well as roleId in order to get the list of users who belong to the role.
//                        dataType: "json",
//                        contentType: "application/json",
//                        type: "Get",
//                        timeout: thiz.options.ajaxTimeout
//                    }).done(function (result) {
//                        try {

//                            //
//                            // Display the role members!!!<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//                            //

//                            html += '<input style="padding:5px 5px 5px 5px;" id="txtRoleMembersFriendlyName_' + stepIndex + '_' + roleIndex + '" style="width:150px;color:grey;font-style:italic;" type="text" value=" [select role member(s)]" />';



//                            //html += '<input id="txtRoleMembersFriendlyName_' + stepIndex + '_' + roleIndex + '" style="width:150px;color:grey;font-style:italic;" type="text" value=" ' + roleMembersHtml + '" />';






//                            html += '<input id="txtRoleMembersId_' + stepIndex + '_' + roleIndex + '" style="display:none;" />';
//                            html += '<input id="txtRoleMembersEmail_' + stepIndex + '_' + roleIndex + '" style="display:none;" />';


//                            html += '&nbsp;<img style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayPeoplePickerDialog\', \'' + 'txtRoleMembersFriendlyName_' + stepIndex + '_' + roleIndex + '' + '\', \'' + 'txtRoleMembersId_' + stepIndex + '_' + roleIndex + '' + '\', \'' + 'txtRoleMembersEmail_' + stepIndex + '_' + roleIndex + '' + '\');" src="images/addressbook-icon18x18.png">';
//                            html += '&nbsp;<input style="padding:5px 10px 5px 10px;" id="btnCreateRole1" type="button" value="New Person..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayAddANewPersonDialog\');" />';


//                            if (participantId) { // Only display when logged in. We need to do more work here!!
//                                if (result.length > 0) {
//                                    var roleMembersHtml = '';
//                                    roleMembersHtml += '<br /><span style="color:darkgrey;">Role Member(s):<ul>';
//                                    for (var i = 0; i < result.length; i++) {
//                                        //roleMembersHtml += '<br />' + String(i + 1) + ': ' + result[i].bwParticipantFriendlyName;
//                                        roleMembersHtml += '<li title="' + result[i].bwParticipantEmail + '">' + result[i].bwParticipantFriendlyName;
//                                        //roleMembersHtml += '<span style="cursor:pointer;" onclick="alert(\'This functionality is incomplete. Coming soon!trashbinx\');">&nbsp;&#128465;</span></li>';
//                                        roleMembersHtml += '<span style="cursor:pointer;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'DeleteRoleMember\', \'' + elementId + '\', \'' + result[i].bwParticipantId + '\');">&nbsp;&#128465;</span></li>';
//                                    }
//                                    roleMembersHtml += '</ul></span>';
//                                    //html == '<br />';
//                                    html += roleMembersHtml;
//                                    //html == '<br />';
//                                }
//                            }

//                            //html += '<br />or create a new role:'; //<br /><input id="textNewRoleName" type="text" style="width:210pt;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewRoleTextBox_Onkeyup\', \'' + 'textNewRoleName' + '\');" />';
//                            //html += '<br /><input id="btnCreateRole2" type="button" value="Create a Role..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayCreateANewRoleDialog\');" />';

//                            //html += '<br />or select a person:'; //<br /><input id="textNewRoleId" type="text" style="width:75pt;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewRoleTextBox_Onkeyup\', \'' + 'textNewRoleId' + '\');" />';
//                            //html += '<br /><img style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayPeoplePickerDialog\', \'' + 'txtApprover2FriendlyName' + '\', \'' + 'txtApprover2Id' + '\', \'' + 'txtApprover2Email' + '\');" src="images/addressbook-icon18x18.png">';
//                            //html == '&nbsp;&nbsp;';
//                            //html += '<input id="btnCreateRole1" type="button" value="Select Person..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayPeoplePickerDialog\', \'' + 'txtApprover2FriendlyName' + '\', \'' + 'txtApprover2Id' + '\', \'' + 'txtApprover2Email' + '\');" />';

//                            //html += '<br />or add a new person:'; //<br /><input id="textNewRoleId" type="text" style="width:75pt;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewRoleTextBox_Onkeyup\', \'' + 'textNewRoleId' + '\');" />';
//                            //html += '<br /><input id="btnCreateRole1" type="button" value="Add a Person..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayAddANewPersonDialog\');" />';

//                            //html += '</td > ';

//                            selectRoleOrPersonCell.html(html);
//                        } catch (e) {
//                            //lpSpinner.Hide();
//                            console.log('Exception in raci.html.displayRoleMultiPicker().Get[odata/UserRoles].done: ' + e.message + ', ' + e.stack);
//                        }
//                    }).fail(function (data) {
//                        //lpSpinner.Hide();

//                        var msg;
//                        if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
//                            msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
//                        } else {
//                            msg = JSON.stringify(data);
//                        }
//                        alert('Error in raci.html.displayRoleMultiPicker().Get[odata/UserRoles].fail: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
//                        console.log('Error in raci.html.displayRoleMultiPicker().Get[odata/UserRoles].fail:' + JSON.stringify(data));
//                        //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
//                        //var error = JSON.parse(data.responseText)["odata.error"];
//                        //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
//                    });
//                } catch (e) {
//                    console.log('Exception in renderSelectRoleOrPersonSection()[odata/Roles].done: ' + e.message + ', ' + e.stack);
//                }
//            }).fail(function (data) {
//                //lpSpinner.Hide();
//                //$('.buttonAddNewAssignmentRow').attr('disabled', false); // Disables these buttons while there is the editor row displaying.
//                var msg;
//                if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
//                    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
//                } else {
//                    msg = JSON.stringify(data);
//                }
//                alert('Error in renderSelectRoleOrPersonSection().Get[odata/Roles].fail: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
//                console.log('Error in renderSelectRoleOrPersonSection().Get[odata/Roles].fail:' + JSON.stringify(data));
//                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
//                //var error = JSON.parse(data.responseText)["odata.error"];
//                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
//            });
//        } catch (e) {
//            console.log('Exception in renderSelectRoleOrPersonSection(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    renderActionsSection: function (elementId) {
//        try {
//            var selectedRoleCategory;
//            $('#selectRoleCategory').find('option:selected').each(function (index, element) {
//                selectedRoleCategory = element.value;
//            });
//            var actionsCell = $('.actions-editcell');
//            if (elementId == 'undefined') {
//                elementId = actionsCell.attr('id');
//            }
//            console.log('In renderActionsSection. elementId: ' + elementId);

//            var html = '';

//            if (selectedRoleCategory != 'Inform' && selectedRoleCategory != 'Collaborator' && selectedRoleCategory != 'Approver') {
//                selectedRoleCategory = 'Inform'; // Thismakes it the default when it is not present.
//            }

//            if (selectedRoleCategory == 'Inform') {
//                actionsCell.html(html);
//            } else if (selectedRoleCategory == 'Collaborator') {


//                // TO-DO: WHEN "Collaborator" has been selcted, a timeout can be specified. Display this option!!!!!!!!!!!!!!!!!!!!!!<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<,,


//                actionsCell.html(html);
//            } else if (selectedRoleCategory == 'Approver') {
//                // Display the Actions/Tasks pickers... TO-DO: REMEMBER TO COME BACK AND POPULATE existing values. eg: If the user toggles the drop down, these values get lost..... <<<<<<<<<<<<<<<<<<<<<<<<<<<<
//                var actions = ['Approve', 'Cancel', 'Decline', 'Revise/Hold'];
//                var x = elementId.split('_')[1];
//                var step = x.split('_')[0];
//                var row = elementId.split('_')[2];
//                for (var i = 0; i < actions.length; i++) {
//                    var checkboxId = 'Action-' + actions[i] + '_' + step + '_' + row;
//                    var childCheckboxId = 'RequireComments-' + actions[i] + '_' + step + '_' + row;
//                    html += '<span style="white-space:nowrap;">';
//                    if (actions[i] == 'Approve' || actions[i] == 'Revise/Hold') {
//                        // This forces the "Approve" and "Revise/Hold" actions to always remain checked. We always need these checked!
//                        html += '  <input type="checkbox" id="' + checkboxId + '" onclick="return false;" />&nbsp;' + actions[i];
//                    } else {
//                        html += '  <input type="checkbox" id="' + checkboxId + '" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'toggleChildCheckbox\', \'' + checkboxId + '\', \'' + childCheckboxId + '\');" />&nbsp;' + actions[i];
//                    }
//                    html += '  &nbsp;';
//                    html += '  <input id="' + childCheckboxId + '" type="checkbox" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'toggleParentCheckbox\', \'' + childCheckboxId + '\', \'' + checkboxId + '\');" />&nbsp;require comments';
//                    html += '  &nbsp;<span style="cursor:pointer;" title="Select to configure underlying properties..." onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayWorkflowActionsUnderlyingPropertiesDialog\', \'' + elementId + '\', \'' + actions[i] + '\');">&#8230;</span>'
//                    html += '</span>';
//                    html += '<br />';
//                }
//                actionsCell.html(html);
//                // We have to make sure the "Approve" and "Revise/Hold" actioon checkboxes are selected. It always has to be selected no matter what!
//                approveCheckboxId = 'Action-Approve_' + step + '_' + row;
//                revisHoldCheckboxId = 'Action-Revise/Hold_' + step + '_' + row;
//                document.getElementById(approveCheckboxId).checked = true;
//                document.getElementById(revisHoldCheckboxId).checked = true;
//            } else {
//                alert('ERROR: Unrecognized "Role Category" selected.');
//            }
//        } catch (e) {
//            console.log('Exception in renderActionsSection(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    renderTimeoutSection: function (elementId) {
//        try {
//            console.log('In renderTimeoutSection. elementId: ' + elementId);
//            var selectedRoleCategory;
//            $('#selectRoleCategory').find('option:selected').each(function (index, element) {
//                selectedRoleCategory = element.value;
//            });
//            var timeoutCell = $('.timeout-editcell');
//            var html = '';
//            if (selectedRoleCategory != 'Inform' && selectedRoleCategory != 'Collaborator' && selectedRoleCategory != 'Approver') {
//                selectedRoleCategory = 'Inform'; // Thismakes it the default when it is not present.
//            }
//            if (selectedRoleCategory == 'Inform') {
//                timeoutCell.html(html);
//            } else if (selectedRoleCategory == 'Collaborator') {
//                // When "Collaborator" has been selected, a timeout can be specified. 
//                html += '<span style="white-space:nowrap;">Timeout:&nbsp;<input type="text" id="textTimeout" style="width:25px;padding:5px 5px 5px 5px;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'TimeoutTextBox_Onkeyup\', \'' + 'textTimeout' + '\');" />&nbsp;days</span>';
//                timeoutCell.html(html);
//            } else if (selectedRoleCategory == 'Approver') {
//                timeoutCell.html(html);
//            } else {
//                alert('ERROR: Unrecognized "Role Category" selected.');
//            }
//        } catch (e) {
//            console.log('Exception in renderTimeoutSection(): ' + e.message + ', ' + e.stack);
//        }
//    },

//    renderTheCondReadOnly: function (cond) {
//        try {
//            console.log('In bwLocationEditor.renderTheCondReadOnly().');
//            // this is a placeholder!!! hardcoded
//            var result = '';
//            if (true) {
//                //result += 'In bwLocationEditor.renderTheCondReadOnly().'; // uncomment this if wanting to put this section back!!
//            } else {
//                if (cond && cond.trim() != '') {
//                    // This is where we parse the cond and make it look the the editable one, but read only!!!!
//                    var conditionString = cond;


//                    var selectedRoleCategory;
//                    $('#selectRoleCategory').find('option:selected').each(function (index, element) {
//                        selectedRoleCategory = element.value;
//                    });
//                    //var conditionCell = $('.conditions-editcell');
//                    //if (elementId == 'undefined') {
//                    //    elementId = conditionCell.attr('id');
//                    //}
//                    //console.log('In renderTheCondReadOnly. elementId: ' + elementId + ', conditionString: ' + conditionString);




//                    var html = '';
//                    //html += '<span style="color:gray;font-style:italic;">This role is a subject matter expert in these areasx:</span><br />';



//                    var html2 = '';
//                    // Is Exec
//                    if (conditionString) {
//                        // We have to parse out "isExec" here.
//                        var isExec = conditionString.split('$IsExec=')[1];

//                        console.log('isExec: ' + isExec);

//                        if (isExec && isExec.indexOf('&') > -1) {
//                            isExec = isExec.split('&')[0];
//                        }
//                    }
//                    if (isExec && isExec == 'True') {
//                        html2 += '<span style="white-space:nowrap;"><input id="cbIsExec" type="checkbox" checked onclick="return false;" />&nbsp;' + 'Exec' + '&nbsp;</span>';
//                    } else {
//                        //html += '<span style="white-space:nowrap;"><input id="cbIsExec" type="checkbox" onclick="return false;" />&nbsp;' + 'Exec' + '&nbsp;</span>';
//                    }
//                    //html += '&nbsp;';

//                    // Is Legal
//                    if (conditionString) {
//                        // We have to parse out "IsLegal" here.
//                        var isLegal = conditionString.split('$IsLegal=')[1];
//                        if (isLegal && isLegal.indexOf('&') > -1) {
//                            isLegal = isLegal.split('&')[0];
//                        }
//                    }
//                    if (isLegal && isLegal == 'True') {
//                        html2 += '<span style="white-space:nowrap;"><input id="cbIsLegal" type="checkbox" checked onclick="return false;" />&nbsp;' + 'Legal' + '&nbsp;</span>';
//                    } else {
//                        //html += '<span style="white-space:nowrap;"><input id="cbIsLegal" type="checkbox" onclick="return false;" />&nbsp;' + 'Legal' + '&nbsp;</span>';
//                    }
//                    //html += '&nbsp;';

//                    // Is Lease
//                    if (conditionString) {
//                        // We have to parse out "isLease" here.
//                        var isLease = conditionString.split('$IsLease=')[1];
//                        if (isLease && isLease.indexOf('&') > -1) {
//                            isLease = isLease.split('&')[0];
//                        }
//                    }
//                    if (isLease && isLease == 'True') {
//                        html2 += '<span style="white-space:nowrap;"><input id="cbIsLease" type="checkbox" checked onclick="return false;" />&nbsp;' + 'Lease' + '&nbsp;</span>';
//                    } else {
//                        //html += '<span style="white-space:nowrap;"><input id="cbIsLease" type="checkbox" onclick="return false;" />&nbsp;' + 'Lease' + '&nbsp;</span>';
//                    }
//                    //html += '&nbsp;';

//                    // Is IT
//                    //html += '&nbsp;';
//                    //html += '<span style="white-space:nowrap;"><input type="checkbox" onclick="return false;" />&nbsp;' + 'IT' + '&nbsp;<span style="font-style:italic;"></span></span>';

//                    // Is H&S 
//                    //html += '&nbsp;';
//                    //html += '<span style="white-space:nowrap;"><input type="checkbox" onclick="return false;" />&nbsp;' + 'H&S' + '&nbsp;<span style="font-style:italic;"></span></span>';

//                    // Is Compliance
//                    //html += '&nbsp;';
//                    //html += '<span style="white-space:nowrap;"><input type="checkbox" onclick="return false;" />&nbsp;' + 'Compliance' + '&nbsp;<span style="font-style:italic;"></span></span>';

//                    // Is Audit
//                    //html += '&nbsp;';
//                    //html += '<span style="white-space:nowrap;"><input type="checkbox"  onclick="return false;" />&nbsp;' + 'Audit' + '&nbsp;<span style="font-style:italic;"></span></span>';

//                    if (html2 != '') {
//                        html += '<span style="color:gray;font-style:italic;">This role is a subject matter expert in these areasx:</span><br />';
//                        html += html2;
//                        html += '<hr>';
//                    }

//                    //html += '<br />';This role is required to complete the following checklist(s):





//                    html += '<span style="color:gray;font-style:italic;">This role contributes to these parts of the company:</span>';

//                    //// Render the "Cond".
//                    //html += '  <span id="spanConditionEditorContents" style="visibility:hidden;display:none;">';
//                    //if (conditionString) html += conditionString;
//                    //html += '  </span>';






//                    //html += '<span style="cursor:pointer;color:red;text-decoration:underline;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayOrgMultiPicker\', \'' + this.id + '\');">Location(s)</span>';
//                    //html += '&nbsp;&nbsp;&nbsp;&nbsp;';
//                    //html += '<span style="cursor:pointer;color:red;text-decoration:underline;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayProjectTypeMultiPicker\', \'' + this.id + '\');">Functional area(s)</span>';
//                    //html += '&nbsp;&nbsp;&nbsp;&nbsp;';
//                    //html += '<span style="cursor:pointer;color:red;text-decoration:underline;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayPillarMultiPicker\', \'' + this.id + '\');">Growth</span>';
//                    html += '<br />';

//                    html += 'Locations:';
//                    html += '<ul>';
//                    html += '  <li>All locations</li>';
//                    html += '</ul>';
//                    html += 'Functional areas:';
//                    html += '<ul>';
//                    html += '  <li>All functional areas</li>';
//                    html += '</ul>';
//                    html += 'Growth:';
//                    html += '<ul>';
//                    html += '  <li>All growth areas (pillars)</li>';
//                    html += '</ul>';




//                    // Render the "Cond".
//                    //html += '  <span id="spanConditionEditorContents" style="visibility:hidden;display:none;">';
//                    //if (conditionString) html += conditionString;
//                    //html += '  </span>';
//                    if (conditionString.indexOf('$ChecklistsRequired~') > -1) {
//                        html += '<hr>';
//                        html += '<span style="color:gray;font-style:italic;">This role is required to complete the following checklist(s):</span><br />';
//                        var checklists = [];
//                        for (var i = 0; i < this.options.Checklists.length; i++) {
//                            var checklist = { bwChecklistTemplatesId: JSON.parse(this.options.Checklists[i].ChecklistJson).bwChecklistTemplatesId, Title: JSON.parse(this.options.Checklists[i].ChecklistJson).Title };
//                            checklists.push(checklist);
//                        }
//                        checklists.sort(function (a, b) {
//                            if (a.Title < b.Title) { return -1; }
//                            if (a.Title > b.Title) { return 1; }
//                            return 0;
//                        });
//                        for (var i = 0; i < checklists.length; i++) {
//                            if (conditionString.indexOf(checklists[i].bwChecklistTemplatesId) > -1) {
//                                html += '<span style="white-space:nowrap;">';
//                                html += '<input id="cbChecklistRequired_' + checklists[i].bwChecklistTemplatesId + '" type="checkbox" onclick="return false;" checked="" />&nbsp;' + checklists[i].Title + '&nbsp;';
//                                html += '<span style="font-style:italic;"></span>';
//                                html += '</span>';
//                                html += '<br />';
//                            }
//                        }

//                    }

//                    result += html;
//                } else {
//                    // do nothing.
//                    alert('??xx?? eaborate here devs pls');
//                }
//            }
//            return result;
//        } catch (e) {
//            var msg = 'Exception in renderTheCondReadOnly(): ' + e.message + ', ' + e.stack;
//            console.log('Exception in renderTheCondReadOnly(): ' + e.message + ', ' + e.stack);
//            return msg;
//        }
//    },
//    renderConditionsSection: function (elementId, conditionString) {
//        try {
//            console.log('In bwLocationEditor.renderConditionsSection().');
//            // this is a placeholder!!! hardcoded
//            var html = '';
//            if (true) {
//                html += 'In bwLocationEditor.renderConditionsSection().';
//            } else {
//                var selectedRoleCategory;
//                $('#selectRoleCategory').find('option:selected').each(function (index, element) {
//                    selectedRoleCategory = element.value;
//                });
//                var conditionCell = $('.conditions-editcell');
//                if (elementId == 'undefined') {
//                    elementId = conditionCell.attr('id');
//                }
//                console.log('In renderConditionsSection. elementId: ' + elementId + ', conditionString: ' + conditionString);



//                // Display this section
//                if (selectedRoleCategory == 'Inform') {
//                    html += '<span style="color:gray;font-style:italic;">This role will be informed about these areas:</span><br />';
//                } else {
//                    html += '<span style="color:gray;font-style:italic;">This role is a subject matter expert in these areas:</span><br />';
//                }

//                // Is Exec
//                if (conditionString) {
//                    // We have to parse out "isExec" here.
//                    var isExec = conditionString.split('$IsExec=')[1];
//                    console.log('isExec: ' + isExec);
//                    if (isExec && isExec.indexOf('&') > -1) {
//                        isExec = isExec.split('&')[0];
//                    }
//                }
//                if (isExec && isExec == 'True') {
//                    html += '<span style="white-space:nowrap;"><input id="cbIsExec" type="checkbox" checked onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isExecCondition_CheckChanged\');" />&nbsp;' + 'Exec' + '&nbsp;</span>';
//                } else {
//                    html += '<span style="white-space:nowrap;"><input id="cbIsExec" type="checkbox" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isExecCondition_CheckChanged\');" />&nbsp;' + 'Exec' + '&nbsp;</span>';
//                }
//                html += '&nbsp;';
//                // Is Legal
//                if (conditionString) {
//                    // We have to parse out "IsLegal" here.
//                    var isLegal = conditionString.split('$IsLegal=')[1];
//                    if (isLegal && isLegal.indexOf('&') > -1) {
//                        isLegal = isLegal.split('&')[0];
//                    }
//                }
//                if (isLegal && isLegal == 'True') {
//                    html += '<span style="white-space:nowrap;"><input id="cbIsLegal" type="checkbox" checked onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isLegalCondition_CheckChanged\');" />&nbsp;' + 'Legal' + '&nbsp;</span>';
//                } else {
//                    html += '<span style="white-space:nowrap;"><input id="cbIsLegal" type="checkbox" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isLegalCondition_CheckChanged\');" />&nbsp;' + 'Legal' + '&nbsp;</span>';
//                }
//                html += '&nbsp;';
//                // Is Lease
//                if (conditionString) {
//                    // We have to parse out "isLease" here.
//                    var isLease = conditionString.split('$IsLease=')[1];
//                    if (isLease && isLease.indexOf('&') > -1) {
//                        isLease = isLease.split('&')[0];
//                    }
//                }
//                if (isLease && isLease == 'True') {
//                    html += '<span style="white-space:nowrap;"><input id="cbIsLease" type="checkbox" checked onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isLeaseCondition_CheckChanged\');" />&nbsp;' + 'Lease' + '&nbsp;</span>';
//                } else {
//                    html += '<span style="white-space:nowrap;"><input id="cbIsLease" type="checkbox" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isLeaseCondition_CheckChanged\');" />&nbsp;' + 'Lease' + '&nbsp;</span>';
//                }
//                html += '&nbsp;';
//                // Is IT
//                html += '&nbsp;';
//                html += '<span style="white-space:nowrap;"><input type="checkbox" disabled />&nbsp;' + 'IT' + '&nbsp;<span style="font-style:italic;"></span></span>';
//                // Is H&S 
//                html += '&nbsp;';
//                html += '<span style="white-space:nowrap;"><input type="checkbox" disabled />&nbsp;' + 'H&S' + '&nbsp;<span style="font-style:italic;"></span></span>';
//                // Is Compliance
//                html += '&nbsp;';
//                html += '<span style="white-space:nowrap;"><input type="checkbox" disabled />&nbsp;' + 'Compliance' + '&nbsp;<span style="font-style:italic;"></span></span>';
//                // Is Audit
//                html += '&nbsp;';
//                html += '<span style="white-space:nowrap;"><input type="checkbox" disabled />&nbsp;' + 'Audit' + '&nbsp;<span style="font-style:italic;"></span></span>';

//                html += '<hr>';



//                html += '<span style="color:gray;font-style:italic;">This role contributes to these parts of the company:</span><br />';

//                // Render the "Cond".
//                html += '  <span id="spanConditionEditorContents" style="visibility:hidden;display:none;">';
//                if (conditionString) html += conditionString;
//                html += '  </span>';

//                html += '<span style="cursor:pointer;color:red;text-decoration:underline;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayOrgMultiPicker\', \'' + this.id + '\');">Location(s)</span>';
//                html += '&nbsp;&nbsp;&nbsp;&nbsp;';
//                html += '<span style="cursor:pointer;color:red;text-decoration:underline;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayProjectTypeMultiPicker\', \'' + this.id + '\');">Functional area(s)</span>';
//                html += '&nbsp;&nbsp;&nbsp;&nbsp;';
//                html += '<span style="cursor:pointer;color:red;text-decoration:underline;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'displayPillarMultiPicker\', \'' + this.id + '\');">Growth</span>';

//                // Display the checklists.
//                if (selectedRoleCategory == 'Approver' || selectedRoleCategory == 'Collaborator') {
//                    html += '<hr>';
//                    html += '<span style="color:gray;font-style:italic;">This role is required to complete the following checklist(s)x:</span><br />';
//                    if (this.options.Checklists) {
//                        // Todd: This is a bit messy and the result of maybe not getting from the database in the best way. Good for now but could maybe improved someday... think through thoroughly first!
//                        var checklists = [];
//                        for (var i = 0; i < this.options.Checklists.length; i++) {
//                            var checklist = { bwChecklistTemplatesId: JSON.parse(this.options.Checklists[i].ChecklistJson).bwChecklistTemplatesId, Title: JSON.parse(this.options.Checklists[i].ChecklistJson).Title };
//                            checklists.push(checklist);
//                        }
//                        checklists.sort(function (a, b) {
//                            if (a.Title < b.Title) { return -1; }
//                            if (a.Title > b.Title) { return 1; }
//                            return 0;
//                        });
//                        for (var i = 0; i < checklists.length; i++) {
//                            html += '<span style="white-space:nowrap;">';

//                            // Decide whether to check the checkbox.
//                            if (conditionString) {
//                                if (conditionString.indexOf(checklists[i].bwChecklistTemplatesId) > -1) {
//                                    html += '<input id="cbChecklistRequired_' + checklists[i].bwChecklistTemplatesId + '" type="checkbox" checked="" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isChecklistRequired_CheckChanged\', \'' + checklists[i].bwChecklistTemplatesId + '\');" />';
//                                    html += '&nbsp;' + checklists[i].Title + '&nbsp;';
//                                } else {
//                                    html += '<input id="cbChecklistRequired_' + checklists[i].bwChecklistTemplatesId + '" type="checkbox" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isChecklistRequired_CheckChanged\', \'' + checklists[i].bwChecklistTemplatesId + '\');" />';
//                                    html += '&nbsp;' + checklists[i].Title + '&nbsp;';
//                                }
//                            } else {
//                                html += '<input id="cbChecklistRequired_' + checklists[i].bwChecklistTemplatesId + '" type="checkbox" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'isChecklistRequired_CheckChanged\', \'' + checklists[i].bwChecklistTemplatesId + '\');" />';
//                                html += '&nbsp;' + checklists[i].Title + '&nbsp;';
//                            }
//                            html += '<input style="padding:5px 10px 5px 10px;" type="button" value="Edit Checklist" onclick="populateStartPageItem(\'divChecklistsSettings\', \'Reports\', \'' + i + '\');" />';

//                            //html += '<span style="font-style:italic;"></span>';
//                            html += '<span style="cursor:pointer;" onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'DeleteChecklist\', \'' + elementId + '\', \'' + checklists[i].bwChecklistTemplatesId + '\');">&nbsp;&#128465;</span>';

//                            html += '</span>';
//                            html += '<br />';
//                        }
//                    } else {
//                        html += '[no checklists found]';
//                    }
//                }
//            }
//            conditionCell.html(html);
//        } catch (e) {
//            console.log('Exception in renderConditionsSection(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    DeleteChecklist: function (elementId, bwChecklistTemplatesId) {
//        try {
//            console.log('In DeleteChecklist(). elementId: ' + elementId + ', bwChecklistTemplatesId: ' + bwChecklistTemplatesId);
//            var stepIndex = elementId.split('_')[1]; // eg: 3
//            var roleIndex = elementId.split('_')[2]; // eg: 8

//            //var cond = this.options.store.DraftWorkflow.Steps.Step[stepIndex].Assign[roleIndex]["@Cond"];
//            //spanConditionEditorContents
//            var cond = document.getElementById('spanConditionEditorContents').innerHTML;
//            // $ChecklistsRequired~becef88f-f43c-4e82-9ff8-0fd4d16b9555,f830e44a-d29f-4261-80c6-756236355e96,f2ac3575-ca0b-4a85-9708-c1cb6eb4929d,f2ac3575-ca0b-4a85-9708-c1cb6eb4929d,becef88f-f43c-4e82-9ff8-0fd4d16b9555,f830e44a-d29f-4261-80c6-756236355e96

//            String.prototype.replaceAll = function (search, replacement) {
//                var target = this;
//                return target.replace(new RegExp(search, 'g'), replacement);
//            };

//            if (cond) {
//                cond = cond.replaceAll('&amp;', '&'); // Not sure why but the encoding gets messed somewhere along the way.
//            }

//            console.log('In DeleteChecklist(). This functionality is incomplete. Coming soon! cond: ' + cond);

//            if (confirm("Are you certain you wish delete ALL CHECKLISTS??? (this checklist?)")) {
//                //debugger;
//                var newCond;
//                var prefix = cond.split('$ChecklistsRequired~')[0];
//                if (prefix.substring(prefix.length - 1) == '&') prefix = prefix.substring(0, prefix.length - 1); // Remove the trailing '&' (ampersand).
//                var suffix = cond.split('$ChecklistsRequired~')[1].split('&')[1];
//                if (suffix) {
//                    newCond = prefix + suffix;
//                } else {
//                    newCond = prefix;
//                }
//                //this.options.store.DraftWorkflow.Steps.Step[stepIndex].Assign[roleIndex]["@Cond"] = result;
//                debugger;
//                //document.getElementById('spanConditionEditorContents').innerHTML = result;
//                this.renderConditionsSection(elementId, newCond);
//            }

//        } catch (e) {
//            console.log('Exception in DeleteChecklist(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    DeleteRoleMember: function (elementId, bwParticipantId) {
//        try {
//            console.log('In DeleteRoleMember(). elementId: ' + elementId + ', bwParticipantId: ' + bwParticipantId);
//            var stepIndex = elementId.split('_')[1]; // eg: 3
//            var roleIndex = elementId.split('_')[2]; // eg: 8

//            //var cond = this.options.store.DraftWorkflow.Steps.Step[stepIndex].Assign[roleIndex]["@Cond"];
//            //// $ChecklistsRequired~becef88f-f43c-4e82-9ff8-0fd4d16b9555,f830e44a-d29f-4261-80c6-756236355e96,f2ac3575-ca0b-4a85-9708-c1cb6eb4929d,f2ac3575-ca0b-4a85-9708-c1cb6eb4929d,becef88f-f43c-4e82-9ff8-0fd4d16b9555,f830e44a-d29f-4261-80c6-756236355e96

//            //String.prototype.replaceAll = function (search, replacement) {
//            //    var target = this;
//            //    return target.replace(new RegExp(search, 'g'), replacement);
//            //};

//            //if (cond) {
//            //    cond = cond.replaceAll('&amp;', '&'); // Not sure why but the encoding gets messed somewhere along the way.
//            //}

//            console.log('In DeleteRoleMember(). This functionality is incomplete. Coming soon!');

//            if (confirm("Are you certain you wish delete ALL ROLEMEMBERS??? (this role member?)")) {
//                debugger;
//                //    var result;
//                //    var prefix = cond.split('$ChecklistsRequired~')[0];
//                //    if (prefix.substring(prefix.length - 1) == '&') prefix = prefix.substring(0, prefix.length - 1); // Remove the trailing '&' (ampersand).
//                //    var suffix = cond.split('$ChecklistsRequired~')[1].split('&')[1];
//                //    if (suffix) {
//                //        result = prefix + suffix;
//                //    } else {
//                //        result = prefix;
//                //    }
//                //    this.options.store.DraftWorkflow.Steps.Step[stepIndex].Assign[roleIndex]["@Cond"] = result;
//            }

//        } catch (e) {
//            console.log('Exception in DeleteRoleMember(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    RoleCategoryDropDown_Onchange: function (elementId) {
//        try {
//            console.log('In RoleCategoryDropDown_Onchange(). elementId: ' + elementId);
//            this.renderActionsSection(elementId);
//            //this.renderTimeoutSection(elementId);
//            this.renderConditionsSection(elementId);
//        } catch (e) {
//            console.log('Exception in RoleCategoryDropDown_Onchange(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    RoleDropDown_Onchange: function (elementId) {
//        try {
//            // This keeps the RoleId and RoleName drop-downs coordinated so that they always display the same role id.
//            console.log('In RoleDropDown_Onchange(). elementId: ' + elementId);
//            var roleId;
//            if (elementId == 'selectRoleId') {
//                $('#selectRoleId').find('option:selected').each(function (index, element) {
//                    roleId = element.value;
//                });
//                $('#selectRoleName').val(roleId); // set selected option
//            } else if (elementId == 'selectRoleName') {
//                $('#selectRoleName').find('option:selected').each(function (index, element) {
//                    roleId = element.value;
//                });
//                $('#selectRoleId').val(roleId); // set selected option
//            } else {
//                alert('ERROR: Invalid elementId in RoleDropDown_Onchange().');
//            }
//        } catch (e) {
//            console.log('Exception in RoleDropDown_Onchange(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    WorkflowsDropDown_Onchange: function () {
//        try {
//            // This enables the "Activate" button when the ">>>Active<<<" workflow is not selected.
//            var selected;
//            $('#workflowsDropDown').find('option:selected').each(function (index, element) {
//                selected = element.innerHTML;
//            });
//            console.log('In WorkflowsDropDown_Onchange(). selected: ' + selected);
//            if (selected.indexOf('ACTIVE') > -1) {
//                document.getElementById('btnActivateRaciConfiguration').disabled = true;
//            } else {
//                document.getElementById('btnActivateRaciConfiguration').disabled = false;
//            }
//        } catch (e) {
//            console.log('Exception in WorkflowsDropDown_Onchange(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    WorkflowRequestTypeDropDown_Onchange: function (elementId) {
//        try {
//            console.log('In WorkflowRequestTypeDropDown_Onchange().');
//            document.getElementById(elementId).selectedIndex = 0; // This just forces it to always be the top selection for the time being.
//            alert('This functionality is incomplete. Coming soon! This functionality will allow a workflow for each budget request type.');

//            //// This enables the "Activate" button when the ">>>Active<<<" workflow is not selected.
//            //var selected;
//            //$('#workflowsDropDown').find('option:selected').each(function (index, element) {
//            //    selected = element.innerHTML;
//            //});
//            //console.log('In WorkflowRequestTypeDropDown_Onchange(). selected: ' + selected);
//            //if (selected.indexOf('ACTIVE') > -1) {
//            //    document.getElementById('btnActivateRaciConfiguration').disabled = true;
//            //} else {
//            //    document.getElementById('btnActivateRaciConfiguration').disabled = false;
//            //}
//        } catch (e) {
//            console.log('Exception in WorkflowRequestTypeDropDown_Onchange(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    WorkflowForAllRequestTypesCheckbox_Onchange: function () {
//        try {
//            console.log('In WorkflowForAllRequestTypesCheckbox_Onchange().');
//            document.getElementById('WorkflowForAllRequestTypesCheckbox').checked = true; // This just forces it to always be checked for the time being.
//            alert('In WorkflowForAllRequestTypesCheckbox_Onchange(). This functionality is incomplete. Coming soon! This functionality will allow a workflow for each budget request type.');

//            //// This enables the "Activate" button when the ">>>Active<<<" workflow is not selected.
//            //var selected;
//            //$('#workflowsDropDown').find('option:selected').each(function (index, element) {
//            //    selected = element.innerHTML;
//            //});
//            //console.log('In WorkflowRequestTypeDropDown_Onchange(). selected: ' + selected);
//            //if (selected.indexOf('ACTIVE') > -1) {
//            //    document.getElementById('btnActivateRaciConfiguration').disabled = true;
//            //} else {
//            //    document.getElementById('btnActivateRaciConfiguration').disabled = false;
//            //}
//        } catch (e) {
//            console.log('Exception in WorkflowForAllRequestTypesCheckbox_Onchange(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    NewRoleTextBox_Onkeyup: function (elementId) {
//        try {
//            // This keeps the RoleId and RoleName drop-downs coordinated so that they always display the same role id.
//            console.log('In NewRoleTextBox_Onkeyup(). elementId: ' + elementId);
//            var roleId = document.getElementById('textNewRoleId').value;
//            var roleName = document.getElementById('textNewRoleName').value;
//            if (roleId == '' && roleName == '') {
//                document.getElementById('selectRoleId').disabled = false;
//                document.getElementById('selectRoleName').disabled = false;
//                $(".selectarow-labeltext").css("color", "black");
//            } else {
//                $('#selectRoleId').val('');
//                $('#selectRoleName').val('');
//                document.getElementById('selectRoleId').disabled = true;
//                document.getElementById('selectRoleName').disabled = true;
//                $(".selectarow-labeltext").css("color", "lightgrey");
//            }
//            if (elementId == 'textNewRoleId') { // Ensure the RoleId is always capitalized.
//                document.getElementById('textNewRoleId').value = roleId.toUpperCase();
//            }
//            if (elementId == 'textNewRoleName') { // Ensure the RoleName is always Title cased.
//                var x = roleName.replace(
//                    /\w\S*/g,
//                    function (txt) {
//                        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//                    }
//                );
//                document.getElementById('textNewRoleName').value = x.replace(' Of ', ' of ').replace(' Or ', ' or ').replace(' And ', ' and ').replace(' For ', ' for ').replace(' A ', ' a ').replace(' The ', ' the ');
//            }
//            if (roleId && roleName) {
//                if (roleId.length > 1 && roleName.length > 4) {
//                    document.getElementById('btnCreateRole1').disabled = false;
//                    document.getElementById('btnCreateRole2').disabled = false;
//                } else {
//                    document.getElementById('btnCreateRole1').disabled = true;
//                    document.getElementById('btnCreateRole2').disabled = true;
//                }
//            } else {
//                document.getElementById('btnCreateRole1').disabled = true;
//                document.getElementById('btnCreateRole2').disabled = true;
//            }



//            //var roleId;
//            //if (elementId == 'selectRoleId') {
//            //    $('#selectRoleId').find('option:selected').each(function (index, element) {
//            //        roleId = element.value;
//            //    });
//            //    $('#selectRoleName').val(roleId); // set selected option
//            //} else if (elementId == 'selectRoleName') {
//            //    $('#selectRoleName').find('option:selected').each(function (index, element) {
//            //        roleId = element.value;
//            //    });
//            //    $('#selectRoleId').val(roleId); // set selected option
//            //} else {
//            //    alert('ERROR: Invalid elementId in NewRoleTextBox_Onkeyup().');
//            //}
//        } catch (e) {
//            console.log('Exception in NewRoleTextBox_Onkeyup(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    NewWorkflowDescriptionTextBox_Onkeyup: function () {
//        try {
//            // This makes sure that the user has entered at least 5 characters before enabling the "Save & Activate" button.
//            console.log('In NewWorkflowDescriptionTextBox_Onkeyup().');
//            var newWorkflowDescription = document.getElementById('txtNewWorkflowDescription').value;
//            if (newWorkflowDescription && newWorkflowDescription.length > 4) {
//                document.getElementById('btnSaveWorkflowConfigurationAndActivate').disabled = false;
//            } else {
//                document.getElementById('btnSaveWorkflowConfigurationAndActivate').disabled = true;
//            }
//        } catch (e) {
//            console.log('Exception in NewWorkflowDescriptionTextBox_Onkeyup(): ' + e.message + ', ' + e.stack);
//        }
//    },

//    disableButton: function (className) {
//        try {
//            console.log('In disableButton(). className: ' + className);
//            var buttons = document.getElementsByClassName(className);
//            var att = document.createAttribute("disabled");       // Create a "class" attribute
//            att.value = "true";
//            for (var i = 0; i < buttons.length; i++) {
//                //buttons[i].disabled = true;
//                //buttons[i].removeAttribute('disabled');      
//                try {
//                    buttons[i].setAttributeNode(att);
//                } catch (e) {

//                }
//            }
//        } catch (e) {
//            console.log('Exception in disableButton(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    enableButton: function (className) {
//        try {
//            console.log('In enableButton(). className: ' + className);
//            var buttons = document.getElementsByClassName(className);
//            //var att = document.createAttribute("disabled");       // Create a "class" attribute
//            //att.value = "true";                           // Set the value of the class attribute
//            for (var i = 0; i < buttons.length; i++) {
//                //buttons[i].disabled = false;
//                buttons[i].removeAttribute('disabled');
//            }
//        } catch (e) {
//            console.log('Exception in enableButton(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    disableScrolling: function () {
//        var x = window.scrollX;
//        var y = window.scrollY;
//        window.onscroll = function () { window.scrollTo(x, y); };
//    },
//    enableScrolling: function () {
//        window.onscroll = function () { };
//    },
//    moveStepUp: function (step) {
//        try {
//            console.log('moveStepUp(). step: ' + step);
//            alert('In moveStepUp(). Moving this step down will impact all of the budget requests. step: ' + step);

//            //var stepGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//            //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
//            //    return v.toString(16);
//            //});

//            //var step = {
//            //    StepName: "NewStep-" + stepGuid,
//            //    InformRoles: [{}],
//            //    AssignRoles: [{}]
//            //};
//            //this.options.store.RaciSteps.push(step);

//            ////alert('In addARaciStep(). this.options.store: ' + JSON.stringify(this.options.store));

//            //this._create();
//        } catch (e) {
//            console.log('Exception in moveStepUp(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    moveStepDown: function (step) {
//        try {
//            console.log('moveStepDown(). step: ' + step);
//            alert('In moveStepDown(). Moving this step down will impact all of the budget requests. step: ' + step);

//            var stepJson;
//            for (var i = 0; i < this.options.store.RaciSteps.length; i++) {
//                if (this.options.store.RaciSteps[i].StepName == step) {
//                    selectedIndex = i;
//                    stepJson = this.options.store.RaciSteps[i]; // Save the step
//                    console.log('In moveStepDown(). selectedIndex: ' + selectedIndex + ', stepJson: ' + JSON.stringify(stepJson));
//                    //this.options.store.splice(i + 1, 0, stepJson); // reinsert the step
//                    //delete this.options.store.RaciSteps[i]; // delete the step
//                    //
//                }
//            }
//            alert('In moveStepDown(). this.options.store: ' + JSON.stringify(this.options.store));
//            this._create();
//        } catch (e) {
//            console.log('Exception in moveStepDown(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    showProgress: function (displayText) {
//        try {
//            $("#divProgressBarDialog").dialog({
//                modal: true,
//                resizable: false,
//                //closeText: "Cancel",
//                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
//                //title: 'Create a new Role',
//                width: '800',
//                height: '120',
//                dialogClass: "no-close transparent-dialog", // No close button in the upper right corner.
//                hide: false, // This means when hiding just disappear with no effects.
//                open: function () {
//                    //$('.ui-widget-overlay').bind('click', function () {
//                    //    $("#divCreateANewRoleDialog").dialog('close');
//                    //});
//                    $("#progressbar").progressbar({
//                        value: false
//                    });
//                    $('.progress-label').text(displayText);
//                },
//                close: function () {
//                    //$(this).dialog('destroy').remove();
//                    //$("#divProgressBarDialog").dialog('destroy').remove();
//                }
//                //buttons: {
//                //    "Close": function () {
//                //        $(this).dialog("close");
//                //    }
//                //}
//            });
//            $("#divProgressBarDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
//        } catch (e) {
//            console.log('Exception in showProgress(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    hideProgress: function () {
//        try {
//            $('#divProgressBarDialog').dialog('close');
//        } catch (e) {
//            console.log('Exception in showProgress(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    toggleChildCheckbox: function (checkboxId, childCheckboxId) {
//        try {
//            console.log('In toggleChildCheckbox(). checkboxId: ' + checkboxId + ', childCheckboxId: ' + childCheckboxId);
//            document.getElementById(childCheckboxId).checked = document.getElementById(checkboxId).checked;
//            //this.saveActionOrRequireCommentsCheckbox(checkboxId);
//        } catch (e) {
//            console.log('Exception in toggleChildCheckbox(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    toggleParentCheckbox: function (checkboxId, parentCheckboxId) {
//        try {
//            console.log('In toggleParentCheckbox(). checkboxId: ' + checkboxId + ', parentCheckboxId: ' + parentCheckboxId);
//            if (document.getElementById(checkboxId).checked) {
//                document.getElementById(parentCheckboxId).checked = true;
//            }
//            //this.saveActionOrRequireCommentsCheckbox(checkboxId);
//        } catch (e) {
//            console.log('Exception in toggleParentCheckbox(): ' + e.message + ', ' + e.stack);
//        }
//    },

//    isLegalCondition_CheckChanged: function (elementId) {
//        try {
//            console.log('In isLegalCondition_CheckChanged(). elementId: ' + elementId);
//            var oldConditionString = document.getElementById('spanConditionEditorContents').innerHTML.trim().replace(/&amp;/g, '&'); // Changes &amp; to &. DecodeURI doesn't work! weird!
//            //
//            var newConditionString = '';
//            var oldConditionsArray = oldConditionString.split('&');
//            var x = [];
//            for (var i = 0; i < oldConditionsArray.length; i++) {
//                if (oldConditionsArray[i].indexOf('$IsLegal=') > -1) {
//                    // do nothing.
//                } else {
//                    x.push(oldConditionsArray[i]);
//                }
//            }
//            // reassemble
//            for (var i = 0; i < x.length; i++) {
//                newConditionString += x[i];
//                if (i < (x.length - 1)) {
//                    // There is more, so insert an ampersand.
//                    newConditionString += '&';
//                }
//            }
//            //
//            // Now we just have to create the $ChecklistsRequired~ string and add it to the newConditionString.
//            //
//            if (document.getElementById('cbIsLegal').checked) {
//                // The checkbox has been selected.
//                if (oldConditionString.indexOf('$IsLegal=True') > -1) {
//                    // do nothing
//                } else {
//                    // We don't have the entry, so we have to add it.
//                    if (newConditionString.length > 0) {
//                        newConditionString += '&' + '$IsLegal=True';
//                    } else {
//                        newConditionString += '$IsLegal=True';
//                    }
//                }
//            } else {
//                // The checkbox is not selected, so make sure the condition string does not have this checklist entry.
//                var checklistArray = (oldConditionString.split('$IsLegal=')[1].split('&')[0]).split(',');
//                var newChecklistArray = [];
//                for (var x = 0; x < checklistArray.length; x++) {
//                    if (checklistArray[x] != '$IsLegal=True') {
//                        newChecklistArray.push(checklistArray[x]);
//                    }
//                }
//            }
//            document.getElementById('spanConditionEditorContents').innerHTML = newConditionString;
//            //console.log('In isLegalCondition_CheckChanged(). this.checked: ' + document.getElementById('cbIsLegal').checked);
//            //// Merge to get newConditionString.
//            //var oldConditionString = document.getElementById('spanConditionEditorContents').innerHTML;
//            //if (oldConditionString) oldConditionString = oldConditionString.trim();
//            //var newConditionString = '';
//            //var conditionString = '';
//            //if (document.getElementById('cbIsLegal').checked) {
//            //    conditionString = '$IsLegal=True';
//            //}
//            //var conditonStringWasAppended = false;
//            //if (oldConditionString.length > 0) {
//            //    for (var i = 0; i < oldConditionString.split('&amp;').length; i++) {
//            //        if (oldConditionString.split('&amp;')[i].indexOf('$IsLegal=') > -1) {
//            //            // We have the same condition type, so we have to replace the values.
//            //            if (conditionString != '') {
//            //                if (newConditionString == '') {
//            //                    newConditionString += conditionString;
//            //                } else {
//            //                    newConditionString += '&' + conditionString;
//            //                }
//            //                conditonStringWasAppended = true;
//            //            }
//            //        } else {
//            //            if (oldConditionString.split('&amp;')[i] != '') {
//            //                if (newConditionString == '') {
//            //                    newConditionString += oldConditionString.split('&amp;')[i];
//            //                } else {
//            //                    newConditionString += '&' + oldConditionString.split('&amp;')[i];
//            //                }
//            //            }
//            //        }
//            //    }
//            //}
//            //if (!conditonStringWasAppended) {
//            //    if (conditionString != '') {
//            //        if (newConditionString == '') {
//            //            newConditionString += conditionString;
//            //        } else {
//            //            newConditionString += '&' + conditionString;
//            //        }
//            //    }
//            //}
//            //document.getElementById('spanConditionEditorContents').innerHTML = newConditionString;
//        } catch (e) {
//            console.log('Exception in isLegalCondition_CheckChanged(): ' + e.message + ', ' + e.stack);
//        }
//    },

//    isLeaseCondition_CheckChanged: function (elementId) {
//        try {
//            console.log('In isLeaseCondition_CheckChanged(). elementId: ' + elementId);
//            var oldConditionString = document.getElementById('spanConditionEditorContents').innerHTML.trim().replace(/&amp;/g, '&'); // Changes &amp; to &. DecodeURI doesn't work! weird!
//            //
//            var newConditionString = '';
//            var oldConditionsArray = oldConditionString.split('&');
//            var x = [];
//            for (var i = 0; i < oldConditionsArray.length; i++) {
//                if (oldConditionsArray[i].indexOf('$IsLease=') > -1) {
//                    // do nothing.
//                } else {
//                    x.push(oldConditionsArray[i]);
//                }
//            }
//            // reassemble
//            for (var i = 0; i < x.length; i++) {
//                newConditionString += x[i];
//                if (i < (x.length - 1)) {
//                    // There is more, so insert an ampersand.
//                    newConditionString += '&';
//                }
//            }
//            //
//            // Now we just have to create the $ChecklistsRequired~ string and add it to the newConditionString.
//            //
//            if (document.getElementById('cbIsLease').checked) {
//                // The checkbox has been selected.
//                if (oldConditionString.indexOf('$IsLease=True') > -1) {
//                    // do nothing
//                } else {
//                    // We don't have the entry, so we have to add it.
//                    if (newConditionString.length > 0) {
//                        newConditionString += '&' + '$IsLease=True';
//                    } else {
//                        newConditionString += '$IsLease=True';
//                    }
//                }
//            } else {
//                // The checkbox is not selected, so make sure the condition string does not have this checklist entry.
//                var checklistArray = (oldConditionString.split('$IsLease=')[1].split('&')[0]).split(',');
//                var newChecklistArray = [];
//                for (var x = 0; x < checklistArray.length; x++) {
//                    if (checklistArray[x] != '$IsLease=True') {
//                        newChecklistArray.push(checklistArray[x]);
//                    }
//                }
//            }
//            document.getElementById('spanConditionEditorContents').innerHTML = newConditionString;
//            //console.log('In isLeaseCondition_CheckChanged(). this.checked: ' + document.getElementById('cbIsLease').checked);
//            //// Merge to get newConditionString.
//            //var oldConditionString = document.getElementById('spanConditionEditorContents').innerHTML;
//            //if (oldConditionString) oldConditionString = oldConditionString.trim();
//            //var newConditionString = '';
//            //var conditionString = '';
//            //if (document.getElementById('cbIsLease').checked) {
//            //    conditionString = '$IsLease=True';
//            //}
//            //var conditonStringWasAppended = false;
//            //if (oldConditionString.length > 0) {
//            //    for (var i = 0; i < oldConditionString.split('&amp;').length; i++) {
//            //        if (oldConditionString.split('&amp;')[i].indexOf('$IsLease=') > -1) {
//            //            // We have the same condition type, so we have to replace the values.
//            //            if (conditionString != '') {
//            //                if (newConditionString == '') {
//            //                    newConditionString += conditionString;
//            //                } else {
//            //                    newConditionString += '&' + conditionString;
//            //                }
//            //                conditonStringWasAppended = true;
//            //            }
//            //        } else {
//            //            if (oldConditionString.split('&amp;')[i] != '') {
//            //                if (newConditionString == '') {
//            //                    newConditionString += oldConditionString.split('&amp;')[i];
//            //                } else {
//            //                    newConditionString += '&' + oldConditionString.split('&amp;')[i];
//            //                }
//            //            }
//            //        }
//            //    }
//            //}
//            //if (!conditonStringWasAppended) {
//            //    if (conditionString != '') {
//            //        if (newConditionString == '') {
//            //            newConditionString += conditionString;
//            //        } else {
//            //            newConditionString += '&' + conditionString;
//            //        }
//            //    }
//            //}
//            //document.getElementById('spanConditionEditorContents').innerHTML = newConditionString;
//        } catch (e) {
//            console.log('Exception in isLeaseCondition_CheckChanged(): ' + e.message + ', ' + e.stack);
//        }
//    },

//    isChecklistRequired_CheckChanged: function (bwChecklistTemplatesId) {
//        try {
//            console.log('In isChecklistRequired_CheckChanged(). bwChecklistTemplatesId: ' + bwChecklistTemplatesId);
//            var oldConditionString = document.getElementById('spanConditionEditorContents').innerHTML.trim().replace(/&amp;/g, '&'); // Changes &amp; to &. DecodeURI doesn't work! weird!
//            var newConditionString = '';
//            var oldConditionsArray = oldConditionString.split('&');
//            var x = [];
//            for (var i = 0; i < oldConditionsArray.length; i++) {
//                if (oldConditionsArray[i].indexOf('$ChecklistsRequired~') > -1) {
//                    // do nothing.
//                } else {
//                    x.push(oldConditionsArray[i]);
//                }
//            }
//            // reassemble
//            for (var i = 0; i < x.length; i++) {
//                newConditionString += x[i];
//            }
//            //
//            // Now we just have to create the $ChecklistsRequired~ string and add it to the newConditionString.
//            //
//            if (document.getElementById('cbChecklistRequired_' + bwChecklistTemplatesId).checked) {
//                // The checkbox has been selected.
//                if (oldConditionString.indexOf('$ChecklistsRequired~') > -1) {
//                    // We already have the entry, so add the checklist guid.
//                    var newCond = oldConditionString.split('$ChecklistsRequired~')[1].split('&')[0];
//                    newCond += ',' + bwChecklistTemplatesId;
//                    if (newConditionString.length > 0) {
//                        newConditionString += '&' + '$ChecklistsRequired~' + newCond;
//                    } else {
//                        newConditionString += '$ChecklistsRequired~' + newCond;
//                    }
//                } else {
//                    // We don't have the entry, so we have to add it.
//                    if (newConditionString.length > 0) {
//                        newConditionString += '&' + '$ChecklistsRequired~' + bwChecklistTemplatesId;
//                    } else {
//                        newConditionString += '$ChecklistsRequired~' + bwChecklistTemplatesId;
//                    }
//                }
//            } else {
//                // The checkbox is not selected, so make sure the condition string does not have this checklist entry.
//                if (oldConditionString.indexOf(bwChecklistTemplatesId) > -1) {
//                    var checklistArray = (oldConditionString.split('$ChecklistsRequired~')[1].split('&')[0]).split(',');
//                    var newChecklistArray = [];
//                    for (var x = 0; x < checklistArray.length; x++) {
//                        if (checklistArray[x] != bwChecklistTemplatesId) {
//                            newChecklistArray.push(checklistArray[x]);
//                        }
//                    }
//                    var newCond = newChecklistArray.join(); // Creates a comma separated string.
//                    if (newCond.length > 0) {
//                        if (newConditionString.length > 0) {
//                            newConditionString += '&' + '$ChecklistsRequired~' + newCond;
//                        } else {
//                            newConditionString += '$ChecklistsRequired~' + newCond;
//                        }
//                    }
//                }
//            }
//            document.getElementById('spanConditionEditorContents').innerHTML = newConditionString;
//        } catch (e) {
//            console.log('Exception in isChecklistRequired_CheckChanged(): ' + e.message + ', ' + e.stack);
//        }
//    },

//    isExecCondition_CheckChanged: function (elementId) {
//        try {
//            console.log('In isExecCondition_CheckChanged(). elementId: ' + elementId);
//            var oldConditionString = document.getElementById('spanConditionEditorContents').innerHTML.trim().replace(/&amp;/g, '&'); // Changes &amp; to &. DecodeURI doesn't work! weird!
//            //
//            var newConditionString = '';
//            var oldConditionsArray = oldConditionString.split('&');
//            var x = [];
//            for (var i = 0; i < oldConditionsArray.length; i++) {
//                if (oldConditionsArray[i].indexOf('$IsExec=') > -1) {
//                    // do nothing.
//                } else {
//                    x.push(oldConditionsArray[i]);
//                }
//            }
//            // reassemble
//            for (var i = 0; i < x.length; i++) {
//                newConditionString += x[i];
//                if (i < (x.length - 1)) {
//                    // There is more, so insert an ampersand.
//                    newConditionString += '&';
//                }
//            }
//            //
//            // Now we just have to create the $ChecklistsRequired~ string and add it to the newConditionString.
//            //
//            if (document.getElementById('cbIsExec').checked) {
//                // The checkbox has been selected.
//                if (oldConditionString.indexOf('$IsExec=True') > -1) {
//                    // do nothing
//                } else {
//                    // We don't have the entry, so we have to add it.
//                    if (newConditionString.length > 0) {
//                        newConditionString += '&' + '$IsExec=True';
//                    } else {
//                        newConditionString += '$IsExec=True';
//                    }
//                }
//            } else {
//                // The checkbox is not selected, so make sure the condition string does not have this checklist entry.
//                var checklistArray = (oldConditionString.split('$IsExec=')[1].split('&')[0]).split(',');
//                var newChecklistArray = [];
//                for (var x = 0; x < checklistArray.length; x++) {
//                    if (checklistArray[x] != '$IsExec=True') {
//                        newChecklistArray.push(checklistArray[x]);
//                    }
//                }
//            }
//            document.getElementById('spanConditionEditorContents').innerHTML = newConditionString;
//        } catch (e) {
//            console.log('Exception in isExecCondition_CheckChanged(): ' + e.message + ', ' + e.stack);
//        }
//    },

//    orgMultiPickerDialog_RenderResults: function () {
//        try {
//            console.log('In orgMultiPickerDialog_RenderResults().');
//            var elementId = $('#OrgMultiPickerDialog_AssignmentElementId').val();
//            var selectedOrgs = [];
//            var orgRows = $('#divOrgMultiPickerDialog').find('.orgRow');
//            for (var i = 0; i < orgRows.length; i++) {
//                // Check if the checkbox is checked.
//                var isSelected = document.getElementById('orgCheckbox_' + i).checked;
//                if (isSelected) {
//                    var orgId = $(orgRows[i]).find('.orgId').text();
//                    var orgName = $(orgRows[i]).find('.orgName').text();
//                    var x = { OrgId: orgId, Name: orgName };
//                    selectedOrgs.push(x);
//                }
//            }
//            var conditionString = '';
//            if (selectedOrgs.length > 0) {
//                // Now that we have the value(s), build the condition string.
//                conditionString = '$ParentOrg~';
//                var needsComma = false;
//                for (var i = 0; i < selectedOrgs.length; i++) {
//                    if (needsComma) conditionString += ',';
//                    conditionString += selectedOrgs[i].OrgId;
//                    needsComma = true;
//                }
//            }

//            // Merge the new values from conditionString with oldCond to get newConditionString.
//            var oldConditionString = document.getElementById('spanConditionEditorContents').innerHTML;
//            if (oldConditionString) oldConditionString = oldConditionString.trim();
//            var newConditionString = '';
//            var conditonStringWasAppended = false;
//            if (oldConditionString.length > 0) {
//                for (var i = 0; i < oldConditionString.split('&amp;').length; i++) {
//                    if (oldConditionString.split('&amp;')[i].indexOf('$ParentOrg~') > -1) {
//                        // We have the same condition type, so we have to replace the values.
//                        if (conditionString != '') {
//                            if (newConditionString == '') {
//                                newConditionString += conditionString;
//                            } else {
//                                newConditionString += '&' + conditionString;
//                            }
//                            conditonStringWasAppended = true;
//                        }
//                    } else {
//                        if (oldConditionString.split('&amp;')[i] != '') {
//                            if (newConditionString == '') {
//                                newConditionString += oldConditionString.split('&amp;')[i];
//                            } else {
//                                newConditionString += '&' + oldConditionString.split('&amp;')[i];
//                            }
//                        }
//                    }
//                }
//            }
//            if (!conditonStringWasAppended) {
//                if (conditionString != '') {
//                    if (newConditionString == '') {
//                        newConditionString += conditionString;
//                    } else {
//                        newConditionString += '&' + conditionString;
//                    }
//                }
//            }
//            document.getElementById('spanConditionEditorContents').innerHTML = newConditionString + '<br />';

//            // Figure out which step and row we are in, so that we can inject this into our json.
//            //var x = elementId.split('_')[1];
//            //var step = x.split('_')[0];
//            //var row = elementId.split('_')[2];
//            //console.log('In orgMultiPickerDialog_RenderResults: elementId: ' + elementId + ', step: ' + step + ', row: ' + row + ', newConditionString: ' + JSON.stringify(newConditionString));
//            // Figure out if this an "Inform" or an "Assign" row.
//            //if (elementId.indexOf('-assign') > -1) {
//            //    this.options.store.Workflow.Steps.Step[step].Assign[row]["@Cond"] = newConditionString; // Update our json.
//            //} else if (elementId.indexOf('-inform') > -1) {
//            //    this.options.store.Workflow.Steps.Step[step].OnStart.Inform[row]["@Cond"] = newConditionString; // Update our json.
//            //} else {
//            //    alert('ERROR: Could not locate assignment row.');
//            //}
//            $('#divOrgMultiPickerDialog').dialog('close');
//        } catch (e) {
//            console.log('Exception in orgMultiPickerDialog_RenderResults(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    projectTypeMultiPickerDialog_RenderResults: function () {
//        try {
//            console.log('In projectTypeMultiPickerDialog_RenderResults().');
//            var elementId = $('#ProjectTypeMultiPickerDialog_AssignmentElementId').val();
//            var selectedProjectTypes = [];
//            var projectTypeRows = $('#divProjectTypeMultiPickerDialog').find('.projectTypeRow');
//            for (var i = 0; i < projectTypeRows.length; i++) {
//                // Check if the checkbox is checked.
//                var isSelected = document.getElementById('projectTypeCheckbox_' + i).checked;
//                if (isSelected) {
//                    var projectTypeId = $(projectTypeRows[i]).find('.projectTypeId').text();
//                    var projectTypeName = $(projectTypeRows[i]).find('.projectTypeName').text();
//                    var x = { ProjectTypeId: projectTypeId, Name: projectTypeName };
//                    selectedProjectTypes.push(x);
//                }
//            }
//            var conditionString = '';
//            if (selectedProjectTypes.length > 0) {
//                // Now that we have the value(s), build the condition string.
//                conditionString = '$ProjectType~';
//                var needsComma = false;
//                for (var i = 0; i < selectedProjectTypes.length; i++) {
//                    if (needsComma) conditionString += ',';
//                    conditionString += selectedProjectTypes[i].ProjectTypeId;
//                    needsComma = true;
//                }
//            }

//            // Merge the new values from conditionString with oldCond to get newConditionString.
//            var oldConditionString = document.getElementById('spanConditionEditorContents').innerHTML;
//            if (oldConditionString) oldConditionString = oldConditionString.trim();
//            var newConditionString = '';
//            var conditonStringWasAppended = false;
//            if (oldConditionString.length > 0) {
//                for (var i = 0; i < oldConditionString.split('&amp;').length; i++) {
//                    if (oldConditionString.split('&amp;')[i].indexOf('$ProjectType~') > -1) {
//                        // We have the same condition type, so we have to replace the values.
//                        if (conditionString != '') {
//                            if (newConditionString == '') {
//                                newConditionString += conditionString;
//                            } else {
//                                newConditionString += '&' + conditionString;
//                            }
//                            conditonStringWasAppended = true;
//                        }
//                    } else {
//                        if (oldConditionString.split('&amp;')[i] != '') {
//                            if (newConditionString == '') {
//                                newConditionString += oldConditionString.split('&amp;')[i];
//                            } else {
//                                newConditionString += '&' + oldConditionString.split('&amp;')[i];
//                            }
//                        }
//                    }
//                }
//            }
//            if (!conditonStringWasAppended) {
//                if (conditionString != '') {
//                    if (newConditionString == '') {
//                        newConditionString += conditionString;
//                    } else {
//                        newConditionString += '&' + conditionString;
//                    }
//                }
//            }
//            document.getElementById('spanConditionEditorContents').innerHTML = newConditionString + '<br />';

//            // Figure out which step and row we are in, so that we can inject this into our json.
//            //var x = elementId.split('_')[1];
//            //var step = x.split('_')[0];
//            //var row = elementId.split('_')[2];
//            //console.log('In projectTypeMultiPickerDialog_RenderResults: elementId: ' + elementId + ', step: ' + step + ', row: ' + row + ', newConditionString: ' + JSON.stringify(newConditionString));
//            // Figure out if this an "Inform" or an "Assign" row.
//            //if (elementId.indexOf('-assign') > -1) {
//            //    this.options.store.Workflow.Steps.Step[step].Assign[row]["@Cond"] = newConditionString; // Update our json.
//            //} else if (elementId.indexOf('-inform') > -1) {
//            //    this.options.store.Workflow.Steps.Step[step].OnStart.Inform[row]["@Cond"] = newConditionString; // Update our json.
//            //} else {
//            //    alert('ERROR: Could not locate assignment row.');
//            //}
//            $('#divProjectTypeMultiPickerDialog').dialog('close');
//        } catch (e) {
//            console.log('Exception in projectTypeMultiPickerDialog_RenderResults(): ' + e.message + ', ' + e.stack);
//        }
//    },
//    pillarMultiPickerDialog_RenderResults: function () {
//        try {
//            console.log('In pillarMultiPickerDialog_RenderResults().');
//            var elementId = $('#PillarMultiPickerDialog_AssignmentElementId').val();
//            var selectedPillars = [];
//            var pillarRows = $('#divPillarMultiPickerDialog').find('.pillarRow');
//            for (var i = 0; i < pillarRows.length; i++) {
//                // Check if the checkbox is checked.
//                var isSelected = document.getElementById('pillarCheckbox_' + i).checked;
//                if (isSelected) {
//                    var pillarId = $(pillarRows[i]).find('.pillarId').text();
//                    var pillarName = $(pillarRows[i]).find('.pillarName').text();
//                    var x = { PillarId: pillarId, Name: pillarName };
//                    selectedPillars.push(x);
//                }
//            }
//            var conditionString = '';
//            if (selectedPillars.length > 0) {
//                // Now that we have the value(s), build the condition string.
//                conditionString = '$PillarId~';
//                var needsComma = false;
//                for (var i = 0; i < selectedPillars.length; i++) {
//                    if (needsComma) conditionString += ',';
//                    conditionString += selectedPillars[i].PillarId;
//                    needsComma = true;
//                }
//            }

//            // Merge the new values from conditionString with oldCond to get newConditionString.
//            var oldConditionString = document.getElementById('spanConditionEditorContents').innerHTML;
//            if (oldConditionString) oldConditionString = oldConditionString.trim();
//            var newConditionString = '';
//            var conditonStringWasAppended = false;
//            if (oldConditionString.length > 0) {
//                for (var i = 0; i < oldConditionString.split('&amp;').length; i++) {
//                    if (oldConditionString.split('&amp;')[i].indexOf('$PillarId~') > -1) {
//                        // We have the same condition type, so we have to replace the values.
//                        if (conditionString != '') {
//                            if (newConditionString == '') {
//                                newConditionString += conditionString;
//                            } else {
//                                newConditionString += '&' + conditionString;
//                            }
//                            conditonStringWasAppended = true;
//                        }
//                    } else {
//                        if (oldConditionString.split('&amp;')[i] != '') {
//                            if (newConditionString == '') {
//                                newConditionString += oldConditionString.split('&amp;')[i];
//                            } else {
//                                newConditionString += '&' + oldConditionString.split('&amp;')[i];
//                            }
//                        }
//                    }
//                }
//            }
//            if (!conditonStringWasAppended) {
//                if (conditionString != '') {
//                    if (newConditionString == '') {
//                        newConditionString += conditionString;
//                    } else {
//                        newConditionString += '&' + conditionString;
//                    }
//                }
//            }
//            document.getElementById('spanConditionEditorContents').innerHTML = newConditionString + '<br />';

//            // Figure out which step and row we are in, so that we can inject this into our json.
//            //var x = elementId.split('_')[1];
//            //var step = x.split('_')[0];
//            //var row = elementId.split('_')[2];
//            //console.log('In pillarMultiPickerDialog_RenderResults: elementId: ' + elementId + ', step: ' + step + ', row: ' + row + ', newConditionString: ' + JSON.stringify(newConditionString));
//            // Figure out if this an "Inform" or an "Assign" row.
//            //if (elementId.indexOf('-assign') > -1) {
//            //    this.options.store.Workflow.Steps.Step[step].Assign[row]["@Cond"] = newConditionString; // Update our json.
//            //} else if (elementId.indexOf('-inform') > -1) {
//            //    this.options.store.Workflow.Steps.Step[step].OnStart.Inform[row]["@Cond"] = newConditionString; // Update our json.
//            //} else {
//            //    alert('ERROR: Could not locate assignment row.');
//            //}
//            $('#divPillarMultiPickerDialog').dialog('close');
//        } catch (e) {
//            console.log('Exception in pillarMultiPickerDialog_RenderResults(): ' + e.message + ', ' + e.stack);
//        }
//    },

//    displayAlertDialog: function (errorMessage) {
//        try {
//            document.getElementById('spanErrorMessage').innerHTML = errorMessage;
//            $("#divAlertDialog").dialog({
//                modal: true,
//                resizable: false,
//                //closeText: "Cancel",
//                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
//                //title: 'Add a New Person',
//                width: '800',
//                dialogClass: "no-close", // No close button in the upper right corner.
//                hide: false, // This means when hiding just disappear with no effects.
//                open: function () {
//                    $('.ui-widget-overlay').bind('click', function () {
//                        $("#divAlertDialog").dialog('close');
//                    });
//                },
//                close: function () {
//                    //$(this).dialog('destroy').remove();
//                }
//            });
//            $("#divAlertDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
//        } catch (e) {
//            console.log('Exception in WorkflowEditor.js.displayAlertDialog(): ' + e.message + ', ' + e.stack);
//        }
//    },

    

//});