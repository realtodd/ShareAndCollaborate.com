$.widget("bw.bwLocationPicker", {
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
        This is the bwLocationPicker.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        jsonData: null, // 1-31-2022 THIS IS A FRAMEWORK ATTRIBUTE. Every formwidget uses this. We will look here for OrgId and OrgName in the _create() method.



        fieldTitle: 'Location', // This is the title, which shows up on the form in the left column.

        instantiated: false, // This si so we can check if the thing is all populated and ready to go.

        allowRequestModifications: false,
        renderAsARequiredField: null, // If this is true, then just display the red asterisk.

        inFormsEditor: null, // This is when forms are being designed. This prevents the widget from hitting the database (going asynchronous) when this is true. If that happens, a race condition may occur and addition to the toolbox may partially fail.
        inVisualizations: null, // This is when in the Visualizations section.

        requestForm: null, // This is the request for that we are in!
        pickerDialog: null, // This is where we store the pointer to the dialog, so we don't have to keep looking for it! We support multiple request forms, so this is crucial.


        value: 0,
        json: null,
        store: null, // This is where we store our OrgRoles data.
        Checklists: null,
        bwTenantId: null,
        bwWorkflowAppId: null,
        bwOrgId: null,
        bwOrgName: null,
        bwEnabledRequestTypes: null, // An array of the following: ['Budget Request', 'Quote Request', 'Reimbursement Request', 'Recurring Expense', 'Capital Plan Project', 'Work Order']
        operationUriPrefix: null,
        ajaxTimeout: 15000,
        quill: null,
        displayWorkflowPicker: false,
        displayRoleIdColumn: false,
        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function (assignmentRowChanged_ElementId) {
        this.element.addClass("bwLocationPicker");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {

            selfDiscoverOperationUri(thiz); // This sets this.options.operationUriPrefix correctly.

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            var participantRole = $('.bwAuthentication').bwAuthentication('option', 'participantRole');

            // If we have jsonData, populate the element.
            if (this.options.jsonData && this.options.jsonData.bwLocationPicker && this.options.jsonData.bwLocationPicker.value) {

                this.options.bwOrgId = this.options.jsonData.bwLocationPicker.value.bwOrgId;
                this.options.bwOrgName = this.options.jsonData.bwLocationPicker.value.bwOrgName;

            }

            console.log('In bwLocationPicker.js(). ALL OF THE FORM WIDGETS NEED TO CHECK IF THIS IS A CUSTOMER, VENDOR, OR [participant, archiveviewer, reportviewer, configurationmanager, owner].');

            //
            // ALL OF THE FORM WIDGETS NEED TO CHECK IF THIS IS A CUSTOMER, VENDOR, OR [participant, archiveviewer, reportviewer, configurationmanager, owner].
            //
            // CUSTOMERS DO NOT HAVE ACCESS TO ORG INFORMATION, AND GET EVERYTHING READ-ONLY.
            //
            // SO FAR THIS SEEMS TO ALWAYS BE TRUE. 3-12-2024.
            //
            debugger;


            // THIS USER IS A CUSTOMER. bwParticipantRole     wuResult[0].bwParticipantRole: customer

            //alert('In bwOrganizationPicker2.js(). participantRole: ' + participantRole);


            if (!(participantRole && ((participantRole == 'customer') || (participantRole == 'participant') || (participantRole == 'archiveviewer') || (participantRole == 'reportviewer') || (participantRole == 'configurationmanager') || (participantRole == 'owner')))) {

                var html = '';
                html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwLocationPicker</span>';
                html += '<br />';
                html += '<span style="">Invalid value for participantRole: ' + participantRole + '</span>';
                this.element.html(html);

            } else if (participantRole && (participantRole == 'customer')) {

                this.element.html(this.renderLocationPicker_ReadOnly(assignmentRowChanged_ElementId)); // Need to render, not allowing the user to make modifications.

            } else {



                //if (this.options.inVisualizations == true) {
                //    $.ajax({
                //        url: this.options.operationUriPrefix + "odata/OrgRolesConfiguration/" + workflowAppId + "/true", //?$filter=Active eq true", //('eCarWorkflow')", // Get the eCarWorkflow json/definition from the database.
                //        dataType: "json",
                //        contentType: "application/json",
                //        type: "Get"
                //    }).done(function (result) {
                //        try {
                //            var orgRoles;
                //            if (!participantId) {
                //                // The user is not logged in.

                //                console.log('The user is not logged in, so displaying the default WorkflowEditor.');
                //                orgRoles = result.value[0].ConfigurationValues; // Works when the user is not logged in. 
                //            } else {
                //                // The user is logged in.
                //                orgRoles = result.value; // Works when the user is logged in.
                //            }
                //            thiz.options.store = {
                //                Global: orgRoles
                //            }

                //            if (!(thiz.options.bwOrgId && thiz.options.bwOrgName)) {
                //                thiz.options.bwOrgId = orgRoles.Global.Id; // This is the default that is displayed when the picker is rendered for the first time.
                //                thiz.options.bwOrgName = orgRoles.Global.Name; // This is the default that is displayed when the picker is rendered for the first time.
                //            }

                //            thiz.renderLocationPicker_Visualizations();

                //        } catch (e) {
                //            console.log('Exception in bwLocationPicker._create().xx.Get:1-1: ' + e.message + ', ' + e.stack);
                //        }
                //    }).fail(function (data) {

                //        console.log('In bwLocationPicker._create.fail(): ' + JSON.stringify(data));
                //        var msg;
                //        if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                //            msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                //        } else {
                //            msg = JSON.stringify(data);
                //        }
                //        alert('Exception in bwLocationPicker._create().xx.Get:2-1: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                //        console.log('Exception in bwLocationPicker._create().xx.Get:2-1: ' + JSON.stringify(data));
                //        //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                //        //var error = JSON.parse(data.responseText)["odata.error"];
                //        //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                //    });

                //} else {

                this.options.requestForm = this.element.closest("#budgetrequestform");

                if (this.options.inFormsEditor == true) {
                    this.options.store = {}; // Need to provide this because if it tries to hit the database and poopulate, it won't render in time to be used in the toolbox!!!! 6-28-2020
                    this.element.html(this.renderLocationPicker_ReadOnly(assignmentRowChanged_ElementId)); // Need to render, not allowing the user to make modifications.
                } else if (this.options.store != null) {
                    if (this.options.allowRequestModifications == false) {
                        this.element.html(this.renderLocationPicker_ReadOnly(assignmentRowChanged_ElementId)); // Need to render, not allowing the user to make modifications.
                    } else if (this.options.allowRequestModifications == true) {
                        this.element.html(this.renderLocationPicker(assignmentRowChanged_ElementId)); // Render the org chart.
                    } else {
                        var html = '';
                        html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwLocationPicker</span>';
                        html += '<br />';
                        html += '<span style="">Invalid value for allowRequestModifications:1: ' + this.options.allowRequestModifications + '</span>';
                        this.element.html(html);
                    }
                } else {

                    var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                    //alert('xcx2134235 activeStateIdentifier: ' + JSON.stringify(activeStateIdentifier));

                    var data = {
                        bwParticipantId_LoggedIn: participantId,
                        bwActiveStateIdentifier: activeStateIdentifier,
                        bwWorkflowAppId_LoggedIn: workflowAppId,

                        bwWorkflowAppId: workflowAppId,
                        isActive: true
                    };
                    $.ajax({
                        url: this.options.operationUriPrefix + "_bw/orgrolesconfiguration",
                        type: 'POST',
                        data: data,
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        },
                        success: function (orcResult) {
                            try {

                                var orgRoles;
                                if (!participantId) {
                                    // The user is not logged in.
                                    console.log('The user is not logged in, so displaying the default WorkflowEditor.');
                                    orgRoles = orcResult.value[0].ConfigurationValues; // Works when the user is not logged in. 
                                } else {
                                    // The user is logged in.
                                    //debugger;
                                    orgRoles = orcResult.value; // Works when the user is logged in.
                                }

                                thiz.options.store = {
                                    Global: orgRoles
                                }

                                if (!(thiz.options.bwOrgId && thiz.options.bwOrgName)) {

                                    console.log('');
                                    console.log('***************');
                                    console.log('In bwLocationPicker.js._create(). Another crazy fix here, come back sometime to revisit. xcx3245347-2');
                                    console.log('***************');
                                    console.log('');
                                    //debugger; // 12-24-2021 this section is not quite right yet
                                    if (orgRoles.Global) {
                                        thiz.options.bwOrgId = orgRoles.Global.Id;  // 12-9-2021 orgRoles.Global.Id; // This is the default that is displayed when the picker is rendered for the first time.
                                        thiz.options.bwOrgName = orgRoles.Global.Name; // 12-9-2021 orgRoles.Global.Name; // This is the default that is displayed when the picker is rendered for the first time.
                                    } else {
                                        thiz.options.bwOrgId = orgRoles.Id;  // 12-9-2021 orgRoles.Global.Id; // This is the default that is displayed when the picker is rendered for the first time.
                                        thiz.options.bwOrgName = orgRoles.Name; // 12-9-2021 orgRoles.Global.Name; // This is the default that is displayed when the picker is rendered for the first time.
                                    }
                                    //thiz.renderLocationPicker(assignmentRowChanged_ElementId); // Render the Location Picker. 

                                }

                                if (thiz.options.allowRequestModifications == false) {
                                    thiz.renderLocationPicker_ReadOnly(assignmentRowChanged_ElementId); // Render the Location Picker.  // Render the org chart. // Need to render, not allowing the user to make modifications.
                                } else if (thiz.options.allowRequestModifications == true) {
                                    thiz.renderLocationPicker(assignmentRowChanged_ElementId); // Render the Location Picker. 
                                } else {
                                    var html = '';
                                    html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwLocationPicker</span>';
                                    html += '<br />';
                                    html += '<span style="">Invalid value for allowRequestModifications:2: ' + thiz.options.allowRequestModifications + '</span>';
                                    thiz.element.html(html);
                                }

                            } catch (e) {
                                console.log('Exception in bwLocationPicker._create().xx.Get:1-2: ' + e.message + ', ' + e.stack);
                                displayAlertDialog('Exception in bwLocationPicker._create().xx.Get:1-2: ' + e.message + ', ' + e.stack);
                            }
                        }, error: function (jqXHR, settings, errorThrown) {





                            //console.log('In bwLocationPicker._create.error(): ' + JSON.stringify(data));
                            //var msg;
                            //if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                            //    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                            //} else {
                            //    msg = JSON.stringify(data);
                            //}
                            //alert('Exception in bwLocationPicker._create().xx.Get:2-2: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                            //console.log('Exception in bwLocationPicker._create().xx.Get:2-2: ' + JSON.stringify(data));

                            if (jqXHR.status == 401) { // HTTP 401 "Unauthorized".

                                console.log('HTTP 401 "Unauthorized".');
                                console.log('HTTP 401 "Unauthorized".');
                                console.log('Error in bwLocationPicker._create().xx.Get:2-2: xcx213124-1-1-xx Unauthorized. Please refresh your browser and log in again. jqXHR.status: ' + jqXHR.status + ', settings: ' + settings + ', errorThrown: ' + errorThrown);
                                //alert('Error in bwRequest.js.displayRequestForm.getsinglebudgetrequest(). xcx213124-1-1 Unauthorized. Please refresh your browser and log in again. jqXHR.status: ' + jqXHR.status + ', settings: ' + settings + ', errorThrown: ' + errorThrown);
                                console.log('HTTP 401 "Unauthorized".');
                                console.log('HTTP 401 "Unauthorized".');

                            } else {
                                console.log('Error in bwLocationPicker._create().xx.Get:2-2: ' + settings + ', ' + errorThrown + ' I suspect this may be a service unavailable error but not sure by any means! More investigation needed!' + JSON.stringify(jqXHR));
                                alert('Error in bwLocationPicker._create().xx.Get:2-2: ' + settings + ', ' + errorThrown + ' I suspect this may be a service unavailable error but not sure by any means! More investigation needed!' + JSON.stringify(jqXHR));
                            }







                        }

                    });

                }
  
            }

            console.log('In bwLocationPicker.js._create(). The widget has been initialized.');
            this.options.instantiated = true; // This is so we can check if the thing is instantiated yet.

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwLocationPicker</span>';
            html += '<br />';
            html += '<span style="">Exception in bwLocationPicker.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
    getData: function () {
        try {
            console.log('In bwLocationPicker.getData().');
            //var value = $(this.element).find('#txtLocationPickerFilter')[0].value; // Kentville
            var value = {
                bwOrgId: this.options.bwOrgId,
                bwOrgName: this.options.bwOrgName
            }

            //if (this.options.jsonData) { // this.options.bwOrgId // this.options.bwOrgName
            //    this.options.bwOrgId = this.options.jsonData.bwOrgId;
            //    this.options.bwOrgName = this.options.jsonData.bwOrgName;
            //    debugger;
            //}

            //alert('In bwLocationPicker.getData(). value: ' + value);

            return value;
        } catch (e) {
            console.log('Exception in bwLocationPicker.getData(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwLocationPicker.getData(): ' + e.message + ', ' + e.stack);
        }
    },
    getDataType: function () {
        try {
            console.log('In ProjectTitle.getDataType().');

            return 'organization_location';
        } catch (e) {
            console.log('Exception in ProjectTitle.getDataType(): ' + e.message + ', ' + e.stack);
            alert('Exception in ProjectTitle.getDataType(): ' + e.message + ', ' + e.stack);
        }
    },
    instantiated: function () {
        try {
            console.log('In bwLocationPicker.instantiated().');
            return this.options.instantiated;
        } catch (e) {
            console.log('Exception in bwLocationPicker.instantiated(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwLocationPicker.instantiated(): ' + e.message + ', ' + e.stack);
        }
    },
    isARequiredField: function () {
        try {
            console.log('In bwLocationPicker.isARequiredField().');
            return true; // This field/widget is always required. 11-12-2022 // this.options.renderAsARequiredField;
        } catch (e) {
            console.log('Exception in bwLocationPicker.isARequiredField(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwLocationPicker.isARequiredField(): ' + e.message + ', ' + e.stack);
        }
    },
    getfieldTitle: function () {
        try {
            console.log('In bwLocationPicker.getfieldTitle().');
            return this.options.fieldTitle;
        } catch (e) {
            console.log('Exception in bwLocationPicker.getfieldTitle(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwLocationPicker.getfieldTitle(): ' + e.message + ', ' + e.stack);
        }
    },
    renderLocationPicker: function (assignmentRowChanged_ElementId) {
        try {
            console.log('In renderLocationPicker(). xcx213-1');

            var html = '';

            html += '<table style="width:100%;">';
            html += '   <tbody>';
            html += '       <tr class="xdTableOffsetRow xdTableOffsetRow-editor" id="toolboxdraggablerow_2554" draggable="true" bwwidgetname="bwLocationPicker">';
            html += '           <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
            html += '               <span class="xdlabel">';
            html += '                   Location:';
            html += '               </span>';

            if (this.options.inFormsEditor == true) {
                html += '           <span class="ToggleRequiredAsterisk" title="Select this asterick to make this a required field." onclick="$(\'.bwFormsEditor\').bwFormsEditor(\'toggleFormRequiredField\', this);">*</span>';
            } else if (this.options.renderAsARequiredField == true) {
                html += '           <span style="color:red;font-size:medium;">*</span>';
            } else if (this.options.renderAsARequiredField == false) {
                //
            }

            html += '           </td>';
            //html += '                            <td class="xdTableOffsetCellComponent" style="white-space:nowrap;text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">';
            html += '           <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">';

            // Fixed this 12-27-2021
            var parentElementId;
            if ($(this.element).closest('.ui-dialog-content')[0] && $(this.element).closest('.ui-dialog-content')[0].id) {
                parentElementId = $(this.element).closest('.ui-dialog-content')[0].id; // If it is in a dialog, this returns the dialog id.
            } else {
                if (!assignmentRowChanged_ElementId) {
                    // It is not in a dialog, so it must be a new request.
                    parentElementId = 'divPageContent1';
                }
            }

            //html += '               <input id="txtLocationPickerFilter" type="text" style="width:450px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" onkeyup="$(\'#' + parentElementId + '\').find(\'.bwLocationPicker\').bwLocationPicker(\'txtLocationPickerFilter_OnKeyup\', \'txtLocationPickerFilter\');" onmouseup="$(\'#' + parentElementId + '\').find(\'.bwLocationPicker\').bwLocationPicker(\'txtLocationPickerFilter_OnMouseup\', \'txtLocationPickerFilter\');"></input>';
            html += '               <input id="txtLocationPickerFilter" type="text" style="width:100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" onkeyup="$(\'#' + parentElementId + '\').find(\'.bwLocationPicker\').bwLocationPicker(\'txtLocationPickerFilter_OnKeyup\', \'txtLocationPickerFilter\');" onmouseup="$(\'#' + parentElementId + '\').find(\'.bwLocationPicker\').bwLocationPicker(\'txtLocationPickerFilter_OnMouseup\', \'txtLocationPickerFilter\');"></input>';
            html += '               <br />';
            html += '               <div id="divLocationPickerDropDown" style="display:none;background-color:white;overflow-x:hidden;"></div>'; // Scrollable div wrapper for the treeview. // dark blue border. // position and z-index makes it show up on top and to not move the other elements around.
            html += '               <span id="spanNewRequestFormLocationPickerBreadcrumb" style="cursor:pointer;color:purple;font-size:8pt;">[spanNewRequestFormLocationPickerBreadcrumb]</span>';
            html += '           </td>';
            html += '       </tr>';
            html += '   </tbody>';
            html += '</table>';

            // Render the html.
            if (this.options.inFormsEditor != true) {
                // THIS IS VERY IMPORTANT AND NEEDS TO BE IN EVERY WIDGET!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 7-12-2020
                // Even though the widget regenerates itself (re-renders), the parent TR tag gets missed!!! Therefore we have to handle getting rid of our form editor draggable attribute here.
                this.element.closest('tr').removeAttr('draggable');
            }
            this.element.html(html);
            this.renderLocationPickerTreeview2(parentElementId); // changed 4-7-2023 added parentElementId

            this.selectLocation(this.options.bwOrgId, this.options.bwOrgName); //this.options.bwOrgId, this.options.bwOrgName);

        } catch (e) {

            console.log('Exception in renderLocationPicker: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwLocationPicker</span>';
            html += '<br />';
            html += '<span style="">Exception in bwLocationPicker.renderLocationPicker(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);

        }
    },

    renderLocationPicker_ReadOnly: function (assignmentRowChanged_ElementId) {
        try {
            console.log('In bwLocationPicker.js.renderLocationPicker_ReadOnly().');

            var html = '';

            html += '<table style="width:100%;">';
            html += '   <tbody>';
            html += '       <tr class="xdTableOffsetRow xdTableOffsetRow-editor" id="toolboxdraggablerow_2554" draggable="true" bwwidgetname="bwLocationPicker">';
            html += '           <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
            html += '               <span class="xdlabel">';
            html += '                   Location:';
            html += '               </span>';
            //html += '             <span style="color:red;font-size:medium;">*</span>';

            if (this.options.inFormsEditor == true) {
                html += '           <span class="ToggleRequiredAsterisk" title="Select this asterick to make this a required field." onclick="$(\'.bwFormsEditor\').bwFormsEditor(\'toggleFormRequiredField\', this);">*</span>';
            } else if (this.options.renderAsARequiredField == true) {
                html += '           <span style="color:red;font-size:medium;">*</span>';
            } else if (this.options.renderAsARequiredField == false) {
                //
            }

            html += '           </td>';
            html += '           <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">';
            //html += '               <input id="txtLocationPickerFilter" class="bwRequestJson" bwdatarequired="true" bwdatatype="String" bwfieldname="bwLocationPicker" contentEditable="false" disabled type="text" style="width:450px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;"></input>';
            html += '               <input id="txtLocationPickerFilter" class="bwRequestJson" bwdatarequired="true" bwdatatype="String" bwfieldname="bwLocationPicker" contentEditable="false" disabled type="text" style="width:100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;"></input>';
            html += '               <br />';
            html += '               <span id="spanNewRequestFormLocationPickerBreadcrumb" style="cursor:pointer;color:purple;font-size:8pt;">[spanNewRequestFormLocationPickerBreadcrumb]</span>';
            html += '           </td>';
            html += '       </tr>';
            html += '   </tbody>';
            html += '</table>';

            // Render the html.
            if (this.options.inFormsEditor != true) {
                // THIS IS VERY IMPORTANT AND NEEDS TO BE IN EVERY WIDGET!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 7-12-2020
                // Even though the widget regenerates itself (re-renders), the parent TR tag gets missed!!! Therefore we have to handle getting rid of our form editor draggable attribute here.
                this.element.closest('tr').removeAttr('draggable');
            }
            this.element.html(html);

            this.selectLocation(this.options.bwOrgId, this.options.bwOrgName);

        } catch (e) {

            console.log('Exception in renderLocationPicker_ReadOnly: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwLocationPicker</span>';
            html += '<br />';
            html += '<span style="">Exception in bwLocationPicker.renderLocationPicker_ReadOnly(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);

        }
    },

    renderLocationPicker_Visualizations: function (assignmentRowChanged_ElementId) {
        try {
            console.log('In renderLocationPicker_Visualizations(). xcx213-2');
            //debugger;
            //var thiz = this;
            //var json = this.options.store;
            var html = '';





            html += '<table style="width:100%;">';
            html += '                        <tbody><tr class="xdTableOffsetRow" bwwidgetname="bwLocationPicker">';
            html += '                            <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
            html += '                                <span class="xdlabel">';
            html += '                                    Location:';
            html += '                                </span>';

            //if (this.options.inFormsEditor == true) {
            //    html += '                               <span class="ToggleRequiredAsterisk" title="Select this asterick to make this a required field." onclick="$(\'.bwFormsEditor\').bwFormsEditor(\'toggleFormRequiredField\', this);">*</span>';
            //} else if (this.options.renderAsARequiredField == true) {
            //    html += '                               <span style="color:red;font-size:medium;">*</span>';
            //} else if (this.options.renderAsARequiredField == false) {
            //    //
            //}


            html += '                            </td>';
            html += '                            <td class="xdTableOffsetCellComponent" style="white-space:nowrap;text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">';


            //debugger;
            var parentElementId;
            try {
                parentElementId = $(this.options.requestForm).closest('.ui-dialog-content')[0].id; // If it is in a dialog, this returns the dialog id.
            } catch (e) { }
            if (!parentElementId) {
                // It is not in a dialog, so it must be a new request.
                parentElementId = 'divCreateRequestFormContent';
            }

            //var locationElementId = 
            //var x = $(form).closest('span')[0].id;
            ////var y = x.id;
            //var id = $(this.element).closest('#budgetrequestform').closest('span').id;

            //html += '<input id="txtLocationPickerFilter" type="text" style="width:450px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" ';
            html += '<input id="txtLocationPickerFilter" type="text" style="width:100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" ';
            html += ' onkeyup="$(\'.bwLocationPicker\').bwLocationPicker(\'txtLocationPickerFilter_OnKeyup\', \'txtLocationPickerFilter\');" ';
            html += ' onmouseup="$(\'.bwLocationPicker\').bwLocationPicker(\'txtLocationPickerFilter_OnMouseup\', \'txtLocationPickerFilter\');">';
            html += '</input>';
            //html == '<input id="txtLocationPickerFilterSelectedLocationId" type="hidden" value="" />';


            html += '<br />';
            //html += '<div id="divLocationPickerDropDown" style="display:none;height:300px;width:400px;border:1px solid #066b8b;overflow-y:auto;background-color:white;position:absolute;z-index:10;">'; // Scrollable div wrapper for the treeview. // dark blue border. // position and z-index makes it show up on top and to not move the other elements around.
            //html += '</div>'; // Scrollable div wrapper for the treeview.

            html += '<div id="divLocationPickerDropDown" style="display:none;background-color:white;overflow-x:hidden;">'; // Scrollable div wrapper for the treeview. // dark blue border. // position and z-index makes it show up on top and to not move the other elements around.
            html += '</div>'; // Scrollable div wrapper for the treeview.

            //html += '<br />';
            html += '                                                           <span id="spanNewRequestFormLocationPickerBreadcrumb" style="cursor:pointer;color:purple;font-size:8pt;">[spanNewRequestFormLocationPickerBreadcrumb]</span>';


            html += '                            </td>';
            html += '                        </tr>';
            html += '                    </tbody>';
            html += '</table>';







            // Render the html.
            //if (this.options.inFormsEditor != true) {
            //    // THIS IS VERY IMPORTANT AND NEEDS TO BE IN EVERY WIDGET!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 7-12-2020
            //    // Even though the widget regenerates itself (re-renders), the parent TR tag gets missed!!! Therefore we have to handle getting rid of our form editor draggable attribute here.
            //    this.element.closest('tr').removeAttr('draggable');
            //}
            this.element.html(html);
            this.renderLocationPickerTreeview3();
            //debugger;




            //if (this.options.bwOrgId) { // only render if we have this value. This means this doesn't happen for a new request
            //    var formElement = this.element.closest("#budgetrequestform");
            //    $(formElement).find('#txtLocationPickerFilter')[0].setAttribute('bwOrgId', this.options.bwOrgId);
            //    $(formElement).find('#txtLocationPickerFilter').value = this.options.bwOrgName; // Set the textbox to the selected location Name. 
            //debugger;
            this.selectLocation(this.options.bwOrgId, this.options.bwOrgName);
            //}

        } catch (e) {
            console.log('Exception in renderLocationPicker_Visualizations: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwLocationPicker</span>';
            html += '<br />';
            html += '<span style="">Exception in bwLocationPicker.renderLocationPicker_Visualizations(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    },

    renderLocationPickerTreeview1: function (assignmentRowChanged_ElementId) {
        try {
            console.log('In renderLocationPickerTreeview1().');
            //debugger;
            var thiz = this;
            var json = this.options.store.Global;
            if (!json.Global) {
                json = this.options.store;
            }
            var html = '';

            html += '<table style="font-style:normal;">';
            html += '   <tr id="orgrow_d_g_e_l">';
            html += '       <td></td>';
            html += '       <td>';
            html += '           <table style="padding-left:15px;">';
            html += '               <tr>';
            html += '                   <td>';
            html += '                       <span style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwLocationPicker\').bwLocationPicker(\'collapseTree\', \'root\');">';
            //debugger;
            html += '⚊ <span style="font-weight:normal;">◍</span> ' + json.Global.Name + ' <span style="font-weight:normal;">◍</span>  </span>';
            html += '                    </td>';
            html += '               </tr>';
            for (var d = 0; d < json.Global.Divisions.Items.length; d++) {
                html += '           <tr>';
                html += '               <td style="padding-left:40px;">';
                html += '                   ◍ ' + json.Global.Divisions.Items[d].Name + ' ◍';
                html += '               </td>';
                html += '           </tr>';
                html += '           <tr>';
                html += '               <td style="padding-left:40px;">';
                html += '                   <table style="padding-left:15px;">';
                if (json.Global.Divisions.Items[d].Groups.Style == 'display:none;') {
                    html += '                       <tr>';
                    html += '                           <td>';
                    html += '                               <span style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwLocationPicker\').bwLocationPicker(\'expandTree\', \'' + d + '\');">';
                    html += '✚ ✣ Groups ✣  </span>';
                    html += '                           </td>';
                    html += '                       </tr>';
                } else {
                    html += '                       <tr>';
                    html += '                           <td>';
                    html += '                               <span style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwLocationPicker\').bwLocationPicker(\'collapseTree\', \'' + d + '\');">';
                    html += '⚊ ✣ Groups ✣  </span>';
                    html += '                           </td>';
                    html += '                       </tr>';
                    for (var g = 0; g < json.Global.Divisions.Items[d].Groups.Items.length; g++) {
                        html += '                   <tr>';
                        html += '                       <td style="padding-left:40px;">';
                        html += '                           ✣ ' + json.Global.Divisions.Items[d].Groups.Items[g].Name + ' ✣';
                        html += '                       </td>';
                        html += '                   </tr>';
                        html += '                   <tr>';
                        html += '                       <td style="padding-left:40px;">';
                        html += '                           <table style="padding-left:15px;">';
                        if (json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Style == 'display:none;') {
                            html += '                               <tr>';
                            html += '                                   <td>';
                            html += '                               <span style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwLocationPicker\').bwLocationPicker(\'expandTree\', \'' + d + '\', \'' + g + '\');">';
                            html += '✚ ⚖ Legal Entities ⚖  </span>';
                            html += '                                   </td>';
                            html += '                               </tr>';
                        } else {
                            html += '                               <tr>';
                            html += '                                   <td>';
                            html += '                               <span style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwLocationPicker\').bwLocationPicker(\'collapseTree\', \'' + d + '\', \'' + g + '\');">';
                            html += '⚊ ⚖ Legal Entities ⚖  </span>';
                            html += '                                   </td>';
                            html += '                               </tr>';
                            for (var e = 0; e < json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items.length; e++) {
                                html += '                           <tr>';
                                html += '                               <td style="padding-left:40px;">';
                                html += '                                   ⚖ ' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Name + ' ⚖';
                                html += '                               </td>';
                                html += '                           </tr>';
                                html += '                           <tr>';
                                html += '                               <td style="padding-left:15px;">';
                                html += '                                   <table style="padding-left:15px;">';
                                if (json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Style == 'display:none;') {
                                    html += '                                   <tr>';
                                    html += '                                       <td>';
                                    html += '                               <span style="cursor:pointer;font-weight:bold;" title="Expand Locations" onclick="$(\'.bwLocationPicker\').bwLocationPicker(\'expandTree\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">';
                                    html += '✚ 🏠 Locations 🏠</span>';
                                    html += '                                       </td>';
                                    html += '                                   </tr>';
                                } else {
                                    html += '                                   <tr>';
                                    html += '                                       <td>';
                                    html += '                               <span style="cursor:pointer;font-weight:bold;" title="Collapse Locations" onclick="$(\'.bwLocationPicker\').bwLocationPicker(\'collapseTree\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">';
                                    html += '⚊ 🏠 Locations 🏠</span>';
                                    html += '                                       </td>';
                                    html += '                                   </tr>';
                                    for (var l = 0; l < json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items.length; l++) {
                                        html += '                               <tr style="' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Style + '">';
                                        html += '                                   <td style="padding-left:40px;">';

                                        var requestFormId;
                                        try {
                                            requestFormId = $(this.options.requestForm).closest('.ui-dialog-content')[0].id;
                                        } catch (e) {
                                            requestFormId = $(this.options.requestForm).closest('span')[0].id;
                                        }

                                        var tmpName = String(json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Name).replace(/[']/g, ''); // encodeURIComponent does not do apostrophe's, which we need here, because we are passing this as defined method calls in the code, preformulated.
                                        html += '<span style="cursor:pointer;" title="Manage Roles..." onclick="$(\'#' + requestFormId + '\').find(\'.bwLocationPicker\').bwLocationPicker(\'selectLocation\', \'' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Id + '\', \'' + tmpName + '\');">';
                                        html += ' 🏠 ' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Name + ' 🏠 ';
                                        html += '</span>';
                                        html += '                                   </td>';
                                        html += '                               </tr>';
                                    }
                                    html += '                                   <tr>';
                                    html += '                                       <td style="padding-left:15px;">';
                                    html += '                                       </td>';
                                    html += '                                   </tr>';
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

            document.getElementById('divLocationPickerDropDown').innerHTML = html;

        } catch (e) {
            console.log('Exception in renderLocationPickerTreeview1: ' + e.message + ', ' + e.stack);
        }
    },

    renderLocationPickerTreeview2: function (parentElementId) { //assignmentRowChanged_ElementId) {
        try {
            console.log('In renderLocationPickerTreeview2().');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            var json = this.options.store.Global;
            if (!json.Global) {
                json = this.options.store;
            }
            var orgsImageFetchingInformation = [];
            var html = '';
            html += '<table  class="context-menu-organizationeditor2">';
            html += '   <tr>';
            html += '       <td style="vertical-align:top;">';
            html += '           <table>';
            html += '               <tr id="orgrow_d_g_e_l2">';
            html += '                   <td></td>';
            html += '                   <td>';
            html += '                       <table style="padding-left:15px;">';
            html += '                           <tr>';
            html += '                               <td>';
            //html += '                                   <span id="spanRootTreeExpandCollapseButton" style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="">⚊ </span>';
            //html += '                                   <span class="orgTreeNode2" style="cursor:pointer;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayOrgRoleEditorInACircle\', true, \'' + 'root' + '\');" onmouseover="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflow\', true, \'root\');" onmouseout="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflowReset\', \'' + 'spanOrgX_root\', \'root\');">';




            // changed 10-18-2020
            //var requestFormId;
            //try {
            //    requestFormId = $(this.options.requestForm).closest('.ui-dialog-content')[0].id;
            //} catch (e) {
            //    requestFormId = $(this.options.requestForm).closest('span')[0].id;
            //}

            //var bwBudgetRequestId = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
            //var requestFormId = 'divRequestFormDialog_' + bwBudgetRequestId; // eg: divRequestFormDialog_d338d498-987f-4fec-872a-3fe6a3cc65c7
            //debugger;
            //if ($('#' + requestFormId)) {
            //    // This is the name of the dialog.
            //} else {
            //    requestFormId = 'divCreateRequestFormDialog'; // changed 12-27-2021 // 'divCreateRequestFormContent'; // This is the name of the dialog. // divRequestFormDialog_dd3c7447-5725-44d1-a290-f75f3bb6ad83'
            //}

            // Fixed this 12-27-2021
            var requestFormId;
            if ($(this.element).closest('.ui-dialog-content')[0] && $(this.element).closest('.ui-dialog-content')[0].id) {
                requestFormId = $(this.element).closest('.ui-dialog-content')[0].id; // If it is in a dialog, this returns the dialog id.
            } else {
                //if (!assignmentRowChanged_ElementId) {
                // It is not in a dialog, so it must be a new request.
                requestFormId = 'divPageContent1';
                //}
            }



            var tmpName = String(json.Global.Name).replace(/[']/g, ''); // encodeURIComponent does not do apostrophe's, which we need here, because we are passing this as defined method calls in the code, preformulated.
            html += '                                   <span class="orgTreeNode2" xcx="xcx12314-1" style="cursor:pointer;" onclick="$(\'#' + requestFormId + '\').find(\'.bwLocationPicker\').bwLocationPicker(\'selectLocation\', \'root\', \'' + tmpName + '\');" >';
            html += '                                       <span style="font-weight:normal;">';



            html += '<img id="orgImage2_root" style="width:70px;height:70px;vertical-align:middle;" src="' + this.options.operationUriPrefix + 'images/corporeal.png" />';
            // Use this to retrieve the images after the fact, farther below in this code.
            var orgImageFetchingInformation = {
                imageId: 'orgImage2_root',
                bwOrgId: 'root'
            };
            orgsImageFetchingInformation.push(orgImageFetchingInformation);


            html += '&nbsp;&nbsp;</span><span style="font-size:15pt;">' + json.Global.Name + '</span> ';
            html += '                                   </span> ';
            html += '                       <span id="spanWorkflowPeoplePicker_' + 'root' + '"></span>';
            html += '                    </td>';
            html += '               </tr>';





            html += '<tr>';
            html += '<td>';
            // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            html += '                               <span id="spanDivisionsTreeExpandCollapseButton" style="cursor:pointer;" onclick="$(\'.bwLocationPicker\').bwLocationPicker(\'collapseOrExpandTree\', \'\', \'spanDivisionsTreeExpandCollapseButton\', \'root\');">';
            //html += '                               ⚊ ';
            html += '                               <img title="collapse" style="cursor:pointer;width:23px;height:23px;vertical-align:middle;" src="images/drawer-close.png"> ';
            html += '                               </span>';
            html += '                               <span class="orgTreeNode2" xcx="xcx12314-2" style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'collapseTree\', \'\', \'' + '' + '\');" >';
            //html += '                               ◍ Divisions ◍  ';
            html += '                               Divisions &nbsp;&nbsp; ';
            html += '                               </span>';
            //html += '                               <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;text-decoration:underline;" title="Add a Division..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'addAGroup\', \'' + 'json.Global.Divisions.Items[d].Id' + '\', \'' + '' + '\', \'' + '' + '\', \'' + '' + '\');">';
            //html += '                               ✚ New';
            //html += '                               </span>';
            html += '</td>';
            html += '</tr>';









            //debugger;
            for (var d = 0; d < json.Global.Divisions.Items.length; d++) {
                html += '           <tr>';
                html += '               <td id="rootDivisionCell" style="padding-left:40px;">';

                html += '<span id="spanDivisionTreeExpandCollapseButton_' + d + '" style="cursor:pointer;" onclick="$(\'.bwLocationPicker\').bwLocationPicker(\'collapseOrExpandTree\', \'\', \'spanDivisionTreeExpandCollapseButton_' + d + '\', \'' + d + '\');">';
                //html += '⚊';
                html += '<img title="collapse" style="cursor:pointer;width:23px;height:23px;vertical-align:middle;" src="images/drawer-close.png">';
                html += '</span>';

                //html += ' <span class="orgTreeNode2" style="cursor:pointer;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayOrgRoleEditorInACircle\', true, \'' + d + '\');" onmouseover="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflow\', true, \'' + d + '\');" onmouseout="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflowReset\', \'' + 'spanOrgX_' + d + '\', \'' + d + '\');">';

                //debugger; // xcx3
                //var requestFormId;
                //try {
                //    requestFormId = $(this.options.requestForm).closest('.ui-dialog-content')[0].id;
                //} catch (e) {
                //    requestFormId = $(this.options.requestForm).closest('span')[0].id;
                //}

                var tmpName = String(json.Global.Divisions.Items[d].Name).replace(/[']/g, ''); // encodeURIComponent does not do apostrophe's, which we need here, because we are passing this as defined method calls in the code, preformulated.
                html += ' <span class="orgTreeNode2" xcx="xcx12314-3" style="cursor:pointer;" onclick="$(\'#' + requestFormId + '\').find(\'.bwLocationPicker\').bwLocationPicker(\'selectLocation\', \'' + json.Global.Divisions.Items[d].Id + '\', \'' + tmpName + '\');" >';


                html += '<img id="orgImage2_' + json.Global.Divisions.Items[d].Id + '" style="width:60px;height:60px;vertical-align:middle;" src="' + this.options.operationUriPrefix + 'images/corporeal.png" />';
                // Use this to retrieve the images after the fact, farther below in this code.
                var orgImageFetchingInformation = {
                    imageId: 'orgImage2_' + json.Global.Divisions.Items[d].Id,
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
                    html += '                               <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;text-decoration:underline;" title="Add a Group..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'addAGroup\', \'' + json.Global.Divisions.Items[d].Id + '\', \'' + d + '\', \'' + g + '\', \'' + e + '\');"> ✚ Add</span>';
                    html += '                           </td>';
                    html += '                       </tr>';
                } else {
                    html += '                       <tr>';
                    html += '                           <td>';








                    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                    html += '                               <span id="spanGroupsTreeExpandCollapseButton_' + d + '" style="cursor:pointer;" onclick="$(\'.bwLocationPicker\').bwLocationPicker(\'collapseOrExpandTree\', \'groupsnode\', \'spanGroupsTreeExpandCollapseButton_' + d + '\', \'' + d + '\');">';
                    //html += '                               ⚊ ';
                    html += '<img title="collapse" style="cursor:pointer;width:23px;height:23px;vertical-align:middle;" src="images/drawer-close.png" />';
                    html += '                               </span>';
                    //html += '                               <span id="spanOrgX_' + d + '_' + 'GroupsNode' + '" class="orgTreeNode" style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'collapseTree\', \'\', \'' + d + '\');" onmouseout="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflowReset\', \'' + 'spanOrgX_' + d + '_' + 'GroupsNode' + '\', \'' + d + '\', \'' + 'GroupsNode' + '\');" onmouseover="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflow\', true, \'' + d + '\', \'' + 'GroupsNode' + '\');">';
                    html += '                               <span class="orgTreeNode2" xcx="xcx12314-4" style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'collapseTree\', \'\', \'' + d + '\');" >';

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
                        html += '                               <span id="spanGroupTreeExpandCollapseButton_' + d + '_' + g + '" style="cursor:pointer;" onclick="$(\'.bwLocationPicker\').bwLocationPicker(\'collapseOrExpandTree\', \'\', \'spanGroupTreeExpandCollapseButton_' + d + '_' + g + '\', \'' + d + '\', \'' + g + '\');">';
                        html += '<img title="collapse" style="cursor:pointer;width:23px;height:23px;vertical-align:middle;" src="images/drawer-close.png" />';
                        html += '                               </span>';




                        //debugger; // xcx4
                        //var requestFormId;
                        //try {
                        //    requestFormId = $(this.options.requestForm).closest('.ui-dialog-content')[0].id;
                        //} catch (e) {
                        //    requestFormId = $(this.options.requestForm).closest('span')[0].id;
                        //}

                        var tmpName = String(json.Global.Divisions.Items[d].Groups.Items[g].Name).replace(/[']/g, ''); // encodeURIComponent does not do apostrophe's, which we need here, because we are passing this as defined method calls in the code, preformulated.
                        html += '                                   <span class="orgTreeNode2" xcx="xcx12314-5" style="cursor:pointer;" onclick="$(\'#' + requestFormId + '\').find(\'.bwLocationPicker\').bwLocationPicker(\'selectLocation\', \'' + json.Global.Divisions.Items[d].Groups.Items[g].Id + '\', \'' + tmpName + '\');" >';



                        html += '<img id="orgImage2_' + json.Global.Divisions.Items[d].Groups.Items[g].Id + '" style="width:50px;height:50px;vertical-align:middle;" src="' + this.options.operationUriPrefix + 'images/corporeal.png" />';
                        // Use this to retrieve the images after the fact, farther below in this code.
                        var orgImageFetchingInformation = {
                            imageId: 'orgImage2_' + json.Global.Divisions.Items[d].Groups.Items[g].Id,
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
                            html += '                                       <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;text-decoration:underline;" title="Add a Legal Entity..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'addALegalEntity\', \'' + json.Global.Divisions.Items[d].Groups.Items[g].Id + '\', \'' + d + '\', \'' + g + '\', \'' + e + '\');"> ✚ New</span>';
                            html += '                                   </td>';
                            html += '                               </tr>';
                        } else {
                            html += '                               <tr>';
                            html += '                                   <td style="white-space:nowrap;font-weight:bold;">';
                            html += '                                       <span id="spanLegalEntitiesTreeExpandCollapseButton_' + d + '_' + g + '" style="cursor:pointer;font-weight:bold;white-space:nowrap;" title="Collapse..." onclick="$(\'.bwLocationPicker\').bwLocationPicker(\'collapseOrExpandTree\', \'legalentitiesnode\', \'spanLegalEntitiesTreeExpandCollapseButton_' + d + '_' + g + '\', \'' + d + '\', \'' + g + '\');">';
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
                                html += '                               <span id="spanGroupsTreeExpandCollapseButton_' + d + '_' + g + '_' + e + '" style="cursor:pointer;" onclick="$(\'.bwLocationPicker\').bwLocationPicker(\'collapseOrExpandTree\', \'\', \'spanGroupsTreeExpandCollapseButton_' + d + '_' + g + '_' + e + '\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">';
                                //html += '                               ⚊ ';
                                html += '<img title="collapse" style="cursor:pointer;width:23px;height:23px;vertical-align:middle;" src="images/drawer-close.png" />';
                                html += '                               </span>';





                                // #29685F galapagos green
                                //debugger; // xcx5
                                //var requestFormId;
                                //try {
                                //    requestFormId = $(this.options.requestForm).closest('.ui-dialog-content')[0].id;
                                //} catch (e) {
                                //    requestFormId = $(this.options.requestForm).closest('span')[0].id;
                                //}

                                var tmpName = String(json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Name).replace(/[']/g, ''); // encodeURIComponent does not do apostrophe's, which we need here, because we are passing this as defined method calls in the code, preformulated.
                                html += '   <span class="orgTreeNode2" xcx="xcx12314-6" style="cursor:pointer;color:#29685F;white-space:nowrap;" onclick="$(\'#' + requestFormId + '\').find(\'.bwLocationPicker\').bwLocationPicker(\'selectLocation\', \'' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Id + '\', \'' + tmpName + '\');" >';




                                html += '<img id="orgImage2_' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Id + '" style="width:40px;height:40px;vertical-align:middle;" src="' + this.options.operationUriPrefix + 'images/corporeal.png" />';
                                // Use this to retrieve the images after the fact, farther below in this code.
                                var orgImageFetchingInformation = {
                                    imageId: 'orgImage2_' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Id,
                                    bwOrgId: json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Id
                                };
                                orgsImageFetchingInformation.push(orgImageFetchingInformation);




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
                                    html += '                                           <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;" title="Add a Location..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'addALocation\', \'' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Id + '\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">✚ New</span>';
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
                                        //html += '                                   <span id="spanOrgX_' + d + '_' + g + '_' + e + '_' + l + '" class="orgTreeNode" style="cursor:pointer;white-space:nowrap;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayOrgRoleEditorInACircle\', true, \'' + d + '\', \'' + g + '\', \'' + e + '\', \'' + l + '\');" onmouseover="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflow\', true, \'' + d + '\', \'' + g + '\', \'' + e + '\', \'' + l + '\');" onmouseout="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflowReset\', \'' + 'spanOrgX_' + d + '_' + g + '_' + e + '_' + l + '\', \'' + d + '\', \'' + g + '\', \'' + e + '\', \'' + l + '\');">';

                                        //debugger; // xcx6
                                        //var requestFormId;
                                        //try {
                                        //    requestFormId = $(this.options.requestForm).closest('.ui-dialog-content')[0].id;
                                        //} catch (e) {
                                        //    requestFormId = $(this.options.requestForm).closest('span')[0].id;
                                        //}

                                        // The following is not 100% yet, apostrophe issues... 12-25-2022

                                        var tmpName = String(json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Name).replace(/[']/g, ''); // encodeURIComponent does not do apostrophe's, which we need here, because we are passing this as defined method calls in the code, preformulated.
                                        html += '                                   <span class="orgTreeNode2" xcx="xcx12314-7" style="cursor:pointer;white-space:nowrap;" onclick="$(\'#' + requestFormId + '\').find(\'.bwLocationPicker\').bwLocationPicker(\'selectLocation\', \'' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Id + '\', \'' + tmpName + '\');">';




                                        //html += '<img id="orgImage_' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Id + '" style="width:30px;height:30px;" src="' +this.options.operationUriPrefix + 'images/corporeal.png" />';
                                        // Use this to retrieve the images after the fact, farther below in this code.
                                        var orgImageFetchingInformation = {
                                            imageId: 'orgImage2_' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Id,
                                            bwOrgId: json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Id,
                                            spanOrgId: 'spanOrgImage2_' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Id,
                                        };
                                        orgsImageFetchingInformation.push(orgImageFetchingInformation);

                                        html += '<span style="vertical-align:middle;" id="spanOrgImage2_' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Id + '" >';
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

            //var formElement = this.element.closest("#budgetrequestform");
            $(this.options.requestForm).find('#divLocationPickerDropDown')[0].innerHTML = html;
            //debugger;
            //$(this.element).find("#divLocationPickerDropDown")[0].innerHTML = html;
            ////$(formElement).find('#divLocationPickerDropDown')[0].innerHTML = html;

            //
            // Render the custom Org images
            //
            for (var i = 0; i < orgsImageFetchingInformation.length; i++) {
                if (orgsImageFetchingInformation[i].bwOrgId) {

                    //alert('xcx213121243214234 fix the image url here....');
                    //var imagePath = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/orgimages/' + orgsImageFetchingInformation[i].bwOrgId + '/' + 'orgimage.png';


                    var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });

                    var imagePath;

                    var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

                    if (activeStateIdentifier.status != 'SUCCESS') {

                        imagePath = '[No image. Unauthorized. xcx213124-34556-555-57]';

                    } else {

                        //html += '<img id="attachmentstest1" xcx="xcx2312-2-2" src="' + thiz.options.operationUriPrefix + fileUrl_Thumbnail + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;max-width:250px;border:1px solid gray;border-radius:0 30px 0 0;" alt="" ';

                        imagePath = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/orgimages/' + orgsImageFetchingInformation[i].bwOrgId + '/' + 'orgimage.png?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;

                    }








                    //var lookForOrgImage = function (imagePath, i) {
                    //    return new Promise(function (resolve, reject) {
                    //        $.get(imagePath).done(function () {
                    //            var img = new Image();
                    //            img.src = imagePath;
                    //            img.onload = function (e) {
                    //                try {

                    //                    var html = '';
                    //                    html += '<img id="orgImage2_' + '' + '" style="width:30px;height:30px;vertical-align:middle;" src="' + imagePath + '" />';
                    //                    //This element might not exist!
                    //                    var parentElementId;
                    //                    try {
                    //                        parentElementId = $(thiz.options.requestForm).closest('.ui-dialog-content')[0].id; // If it is in a dialog, this returns the dialog id.
                    //                    } catch (e) { }
                    //                    if (!parentElementId) {
                    //                        // It is not in a dialog, so it must be a new request.
                    //                        parentElementId = 'divCreateRequestFormContent';
                    //                    }
                    //                    try {
                    //                        //debugger;
                    //                        //document.getElementById(orgsImageFetchingInformation[i].spanOrgId).innerHTML = html; //imagePath;
                    //                        $('#' + parentElementId).find('#' + orgsImageFetchingInformation[i].spanOrgId)[0].innerHTML = html; //imagePath;
                    //                        resolve();
                    //                    } catch (e) {
                    //                        // ACTUALLY WE SHOUDL BE LOADING THE ELEMENT HERE MAYBE? IT USED TO WORK! 2-5-2020
                    //                        //document.getElementById(orgsImageFetchingInformation[i].imageId).src = imagePath;


                    //                        alert('xcx23324 Loading image into element. parentElementId: ' + parentElementId + ', img element id: ' + orgsImageFetchingInformation[i].imageId);


                    //                        $('#' + parentElementId).find('#' + orgsImageFetchingInformation[i].imageId)[0].src = imagePath;
                    //                        //console.log('Exception in bwOrganizationEditor.js.renderOrgRolesEditor(): span tag with id="' + orgsImageFetchingInformation[i].spanOrgId + '" does not exist! ' + e.message + ', ' + e.stack);
                    //                        resolve();
                    //                    }

                    //                } catch (e) {
                    //                    console.log('Exception in bwLocationPicker.js.renderLocationPickerTreeview2.lookForOrgImage.img.onload(): ' + e.message + ', ' + e.stack);
                    //                    //alert('Exception in xx().img.onload(): ' + e.message + ', ' + e.stack);
                    //                    reject();
                    //                }
                    //            }
                    //        }).fail(function () {
                    //            // do nothing, it just didn't find an image.
                    //            resolve();
                    //        });
                    //    });
                    //}


                    var lookForOrgImage = function (imagePath, i, parentElementId) {
                        return new Promise(function (resolve, reject) {
                            $.get(imagePath).done(function () {
                                var img = new Image();
                                img.src = imagePath;
                                img.onload = function (e) {
                                    try {

                                        //var html = '';
                                        //html += '<img id="orgImage2_' + '' + '" style="width:30px;height:30px;vertical-align:middle;" src="' + imagePath + '" />';


                                        //This element might not exist!
                                        //var parentElement = $(thiz.options.requestForm).closest('.ui-dialog-content')[0]; // If it is in a dialog, this returns the dialog id.


                                        //var parentElement = $(thiz.element).closest('.ui-dialog-content')[0]; // If it is in a dialog, this returns the dialog id.



                                        if (!parentElementId) {

                                            // It is not in a dialog, so it must be a new request.
                                            //parentElementId = 'divCreateRequestFormContent';
                                            // Do nothing. Changed 4-7-2023.
                                            var msg = 'Error in bwLocationPicker.js.renderLocationPickerTreeview2.lookForOrgImage.img.onload(). CANNOT FIND DIALOG to assign image. orgsImageFetchingInformation[i].imageId: ' + orgsImageFetchingInformation[i].imageId + ', orgsImageFetchingInformation[i].spanOrgId: ' + orgsImageFetchingInformation[i].spanOrgId + ', imagePath: ' + imagePath;
                                            reject(msg);

                                        } else {

                                            //var parentElementId = $(parentElement).id; // If it is in a dialog, this returns the dialog id.

                                            //alert('xcx23123 parentElementId: ' + parentElementId);

                                            //$('#' + parentElementId).find('#' + orgsImageFetchingInformation[i].spanOrgId)[0].innerHTML = html; //imagePath;

                                            if ($('#' + parentElementId).find('#' + orgsImageFetchingInformation[i].imageId)[0]) {
                                                $('#' + parentElementId).find('#' + orgsImageFetchingInformation[i].imageId)[0].src = imagePath;
                                            } else {
                                                console.log('xcx23234 weird error here, sometimes the element does not exist. This didn\'t happen with the new shareandcollaborate database and file system...');
                                            }
                                            resolve();
                                            //} catch (e) {
                                            //    // ACTUALLY WE SHOUDL BE LOADING THE ELEMENT HERE MAYBE? IT USED TO WORK! 2-5-2020
                                            //    //document.getElementById(orgsImageFetchingInformation[i].imageId).src = imagePath;


                                            //    alert('xcx23324 Loading image into element. parentElementId: ' + parentElementId + ', img element id: ' + orgsImageFetchingInformation[i].imageId);


                                            //    $('#' + parentElementId).find('#' + orgsImageFetchingInformation[i].imageId)[0].src = imagePath;
                                            //    //console.log('Exception in bwOrganizationEditor.js.renderOrgRolesEditor(): span tag with id="' + orgsImageFetchingInformation[i].spanOrgId + '" does not exist! ' + e.message + ', ' + e.stack);
                                            //    resolve();
                                            //}

                                        }

                                    } catch (e) {

                                        var msg = 'Exception in bwLocationPicker.js.renderLocationPickerTreeview2.lookForOrgImage.img.onload(): ' + e.message + ', ' + e.stack;
                                        console.log(msg);

                                        reject(msg);

                                    }
                                }
                            }).fail(function () {
                                // do nothing, it just didn't find an image.
                                resolve();
                            });
                        });
                    }
                    lookForOrgImage(imagePath, i, parentElementId).then(function (results) {

                        console.log('found org image, populating org dropdown selector for bwLocationPicker widget on the request form. xcx213123425');

                    }).catch(function (e) {

                        alert('xcx2131234 Exception looking for org image: ' + e);

                    });
                }
            }


        } catch (e) {
            //console.log('Exception in renderLocationPickerTreeview2: ' + e.message + ', ' + e.stack);
            console.log('Exception in renderLocationPickerTreeview2: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwLocationPicker</span>';
            html += '<br />';
            html += '<span style="">Exception in bwLocationPicker.renderLocationPickerTreeview2(): ' + e.message + ', ' + e.stack + '</span>';
            this.element.html(html);
        }
    },

    renderLocationPickerTreeview3: function (assignmentRowChanged_ElementId) {
        try {
            console.log('In renderLocationPickerTreeview3().');
            //debugger;
            var thiz = this;
            var json = this.options.store.Global;
            if (!json.Global) {
                json = this.options.store;
            }
            var html = '';

            html += '<table style="font-style:normal;">';
            html += '   <tr id="orgrow_d_g_e_l">';
            html += '       <td></td>';
            html += '       <td>';
            html += '           <table style="padding-left:15px;">';
            html += '               <tr>';
            html += '                   <td>';
            html += '                       <span style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwLocationPicker\').bwLocationPicker(\'collapseTree\', \'root\');">';
            //debugger;
            html += '⚊ <span style="font-weight:normal;">◍</span> ' + json.Global.Name + ' <span style="font-weight:normal;">◍</span>  </span>';
            html += '                    </td>';
            html += '               </tr>';
            for (var d = 0; d < json.Global.Divisions.Items.length; d++) {
                html += '           <tr>';
                html += '               <td style="padding-left:40px;">';
                html += '                   ◍ ' + json.Global.Divisions.Items[d].Name + ' ◍';
                html += '               </td>';
                html += '           </tr>';
                html += '           <tr>';
                html += '               <td style="padding-left:40px;">';
                html += '                   <table style="padding-left:15px;">';
                if (json.Global.Divisions.Items[d].Groups.Style == 'display:none;') {
                    html += '                       <tr>';
                    html += '                           <td>';
                    html += '                               <span style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwLocationPicker\').bwLocationPicker(\'expandTree\', \'' + d + '\');">';
                    html += '✚ ✣ Groups ✣  </span>';
                    html += '                           </td>';
                    html += '                       </tr>';
                } else {
                    html += '                       <tr>';
                    html += '                           <td>';
                    html += '                               <span style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwLocationPicker\').bwLocationPicker(\'collapseTree\', \'' + d + '\');">';
                    html += '⚊ ✣ Groups ✣  </span>';
                    html += '                           </td>';
                    html += '                       </tr>';
                    for (var g = 0; g < json.Global.Divisions.Items[d].Groups.Items.length; g++) {
                        html += '                   <tr>';
                        html += '                       <td style="padding-left:40px;">';
                        html += '                           ✣ ' + json.Global.Divisions.Items[d].Groups.Items[g].Name + ' ✣';
                        html += '                       </td>';
                        html += '                   </tr>';
                        html += '                   <tr>';
                        html += '                       <td style="padding-left:40px;">';
                        html += '                           <table style="padding-left:15px;">';
                        if (json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Style == 'display:none;') {
                            html += '                               <tr>';
                            html += '                                   <td>';
                            html += '                               <span style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwLocationPicker\').bwLocationPicker(\'expandTree\', \'' + d + '\', \'' + g + '\');">';
                            html += '✚ ⚖ Legal Entities ⚖  </span>';
                            html += '                                   </td>';
                            html += '                               </tr>';
                        } else {
                            html += '                               <tr>';
                            html += '                                   <td>';
                            html += '                               <span style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwLocationPicker\').bwLocationPicker(\'collapseTree\', \'' + d + '\', \'' + g + '\');">';
                            html += '⚊ ⚖ Legal Entities ⚖  </span>';
                            html += '                                   </td>';
                            html += '                               </tr>';
                            for (var e = 0; e < json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items.length; e++) {
                                html += '                           <tr>';
                                html += '                               <td style="padding-left:40px;">';
                                html += '                                   ⚖ ' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Name + ' ⚖';
                                html += '                               </td>';
                                html += '                           </tr>';
                                html += '                           <tr>';
                                html += '                               <td style="padding-left:15px;">';
                                html += '                                   <table style="padding-left:15px;">';
                                if (json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Style == 'display:none;') {
                                    html += '                                   <tr>';
                                    html += '                                       <td>';
                                    html += '                               <span style="cursor:pointer;font-weight:bold;" title="Expand Locations" onclick="$(\'.bwLocationPicker\').bwLocationPicker(\'expandTree\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">';
                                    html += '✚ 🏠 Locations 🏠</span>';
                                    html += '                                       </td>';
                                    html += '                                   </tr>';
                                } else {
                                    html += '                                   <tr>';
                                    html += '                                       <td>';
                                    html += '                               <span style="cursor:pointer;font-weight:bold;" title="Collapse Locations" onclick="$(\'.bwLocationPicker\').bwLocationPicker(\'collapseTree\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">';
                                    html += '⚊ 🏠 Locations 🏠</span>';
                                    html += '                                       </td>';
                                    html += '                                   </tr>';
                                    for (var l = 0; l < json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items.length; l++) {
                                        html += '                               <tr style="' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Style + '">';
                                        html += '                                   <td style="padding-left:40px;">';
                                        //debugger; // xcx1
                                        //var requestFormId;
                                        //try {
                                        //    requestFormId = $(this.options.requestForm).closest('.ui-dialog-content')[0].id;
                                        //} catch (e) {
                                        //    requestFormId = $(this.options.requestForm).closest('span')[0].id;
                                        //}

                                        var tmpName = String(json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Name).replace(/[']/g, ''); // encodeURIComponent does not do apostrophe's, which we need here, because we are passing this as defined method calls in the code, preformulated.
                                        html += '<span style="cursor:pointer;" title="Manage Roles..." onclick="$(\'.bwTrackSpending\').find(\'.bwLocationPicker\').bwLocationPicker(\'selectLocation\', \'' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Id + '\', \'' + tmpName + '\');">';
                                        html += ' 🏠 ' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Name + ' 🏠 ';
                                        html += '</span>';
                                        html += '                                   </td>';
                                        html += '                               </tr>';
                                    }
                                    html += '                                   <tr>';
                                    html += '                                       <td style="padding-left:15px;">';
                                    html += '                                       </td>';
                                    html += '                                   </tr>';
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

            document.getElementById('divLocationPickerDropDown').innerHTML = html;

        } catch (e) {
            console.log('Exception in renderLocationPickerTreeview3: ' + e.message + ', ' + e.stack);
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

                alert('Error: Unexpected parameter in collapseOrExpandTree().');
            }
        } catch (e) {
            console.log('Exception in collapseOrExpandTree(): ' + e.message + ', ' + e.stack);
        }
    },

    selectOrganizationalStructure_OnChange: function () {
        try {
            console.log('In selectOrganizationalStructure_OnChange().');

            var selectedValue = document.getElementById('selectOrganizationalStructure').value;


            alert('In selectOrganizationalStructure_OnChange(). selectedValue: ' + selectedValue);
        } catch (e) {
            console.log('Exception in selectOrganizationalStructure_OnChange(): ' + e.message + ', ' + e.stack);
        }
    },
    selectLocation: function (bwOrgId, bwOrgName) {
        try {
            // The user has selected a location from the drop down in the Location textbox, or the code is calling this when displaying the request form.
            console.log('In bwLocationPicker.js.selectLocation(). bwOrgId: ' + bwOrgId + ' xcx1, bwOrgName: ' + bwOrgName);
            //alert('In bwLocationPicker.js.selectLocation(). bwOrgId: ' + bwOrgId + ', bwOrgName: ' + bwOrgName + '. xcx213134243.');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            var parentElementId;
            try {
                parentElementId = $(this.element).closest('#budgetrequestform').closest('.ui-dialog-content')[0].id; // If it is in a dialog, this returns the dialog id.
            } catch (e) { }
            if (!parentElementId) {
                // It is not in a dialog, so it must be a new request.
                parentElementId = 'divCreateRequestFormContent';
            }
            // what is parentElementId????


            if (!bwOrgId || bwOrgId == null) {
                // If no values are specified, try to get them from the form. If they aren't there, then just use the root org.

                if ($(this.options.requestForm) && $(this.options.requestForm)[0]) { // 1-31-2022
                    bwOrgId = $(this.options.requestForm)[0].getAttribute('bworgid');
                }

                if (!bwOrgId || bwOrgId == null) {





                    console.log();
                    console.log('**********************');
                    console.log('12-24-2021 this is a crazy fix.... we will figure this out eventually! :)');
                    console.log('**********************');
                    console.log();

                    if (!(this.options.bwOrgId && this.option.bwOrgName)) {
                        bwOrgId = this.options.bwOrgId;
                        bwOrgName = this.option.bwOrgName;
                    } else {

                        // None specified, so just using the root org.
                        if (this.options.store.Global.Global) {  // 12-24-2021 this is a crazy fix.... we will figure this out eventually! :) 
                            bwOrgId = this.options.store.Global.Global.Id;
                            bwOrgName = this.options.store.Global.Global.Name;
                        } else {
                            bwOrgId = this.options.store.Global.Id;
                            bwOrgName = this.options.store.Global.Name;
                        }


                    }







                } else {
                    bwOrgName = $(this.options.requestForm)[0].getAttribute('bworgname');
                }
            }
            var bwBudgetRequestId;
            if (this.options.requestForm) {
                if ($(this.options.requestForm) && $(this.options.requestForm)[0]) {
                    bwBudgetRequestId = $(this.options.requestForm)[0].getAttribute('bwbudgetrequestid');
                    $(this.options.requestForm).find('#txtLocationPickerFilter')[0].setAttribute('bwOrgId', bwOrgId);
                    $(this.options.requestForm)[0].setAttribute('bworgid', bwOrgId);
                    $(this.options.requestForm)[0].setAttribute('bworgname', bwOrgName);

                    this.options.bwOrgId = bwOrgId;
                    this.options.bwOrgName = bwOrgName;

                } else {
                    console.log('');
                    console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
                    console.log('COULD THIS BE A BIG PROBLEM xcx 213854?');
                    console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
                    console.log('');
                }
            }

            console.log('In bwLocationPicker.js.selectLocation(). bwOrgId: ' + bwOrgId + ' xcx2, bwOrgName: ' + bwOrgName);
            //debugger;





            //document.getElementById('txtLocationPickerFilterSelectedLocationId').value = locationId; // Set the textbox to the selected location Id.
            //debugger;

            try {

                this.options.pickerDialog.dialog('close'); // 7-13-2020 THIS closes all of them that are open. Ok for now! and maybe the preferred way!!


                //// divLocationPickerDropDown
                //if ($(this.options.requestForm).find('#divLocationPickerDropDown') && $(this.options.requestForm).find('#divLocationPickerDropDown') && $(this.options.requestForm).find('#divLocationPickerDropDown').dialog && $(this.options.requestForm).find('#divLocationPickerDropDown').is(':visible')) { // $('#' + requestDialogId).is(':visible')
                //    //$(this.options.requestForm).find('#divLocationPickerDropDown').dialog('close');
                //    //thiz.options.pickerDialog.dialog('close');

                //    //$('#divLocationPickerDropDown').dialog('close');
                //    $(this.element).find("#divLocationPickerDropDown").dialog('close');

                //}

            } catch (e) {
                console.log('Caught Exception in bwLocationPicker.selectLocation.dialog.close():xcx1: ' + e.message + ', ' + e.stack);
                //debugger;
                var x = 'why are we here?';
            }


            //var renderTheOrgBreadcrumb2 = function (json, orgId) {

            //    var d1, g1, e1, l1;
            //    var orgName = '';

            //    console.log('');
            //    console.log('***************');
            //    console.log('In bwLocationPiker.js.selectLocation(). Another crazy fix here, come back sometime to revisit. xcx3245347-1');
            //    console.log('***************');
            //    console.log('');

            //    if (json.Global) {
            //        if (json.Global.Global) {
            //            json.Global = json.Global.Global;
            //        }
            //    } else {
            //        console.log('');
            //        console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
            //        console.log('COULD THIS BE A PROBLEM? xcx2349953-1?');
            //        console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
            //        console.log('');
            //    }

            //    //debugger; // 1-31-2022 why is the last part of the breadcrumb not have a clickable link/url?




            //    if (json.Global && (orgId == json.Global.Id)) {
            //        //orgName = json.Global.Name;
            //        d1 = 'root';
            //        g1 = undefined;
            //        e1 = undefined;
            //        l1 = undefined;
            //        //debugger;
            //    } else {
            //        debugger; // 12-24-2021 //json.Global.Divisions may be undefined here...
            //        if (!(json.Global && json.Global.Divisions)) {

            //            console.log('');
            //            console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
            //            console.log('COULD THIS BE A PROBLEM? xcx2349953-2?');
            //            console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
            //            console.log('');

            //        } else {
            //            for (var d = 0; d < json.Global.Divisions.Items.length; d++) {
            //                if (orgId == json.Global.Divisions.Items[d].Id) {
            //                    //orgName = json.Global.Divisions.Items[d].Name;
            //                    d1 = d;
            //                    g1 = undefined;
            //                    e1 = undefined;
            //                    l1 = undefined;
            //                    break;
            //                }
            //                for (var g = 0; g < json.Global.Divisions.Items[d].Groups.Items.length; g++) {
            //                    if (orgId == json.Global.Divisions.Items[d].Groups.Items[g].Id) {
            //                        //orgName = json.Global.Divisions.Items[d].Groups.Items[g].Name;
            //                        d1 = d;
            //                        g1 = g;
            //                        e1 = undefined;
            //                        l1 = undefined;
            //                        break;
            //                    }
            //                    for (var e = 0; e < json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items.length; e++) {
            //                        if (orgId == json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Id) {
            //                            //orgName = json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Name;
            //                            d1 = d;
            //                            g1 = g;
            //                            e1 = e;
            //                            l1 = undefined;
            //                            break;
            //                        }
            //                        for (var l = 0; l < json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items.length; l++) {
            //                            if (orgId == json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Id) {
            //                                //orgName = json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Name;
            //                                d1 = d;
            //                                g1 = g;
            //                                e1 = e;
            //                                l1 = l;
            //                                break;
            //                            }
            //                        }
            //                    }
            //                }
            //            }
            //        }
            //    }

            //    var roles, orgId, orgName, orgPath, orgPathClickable;

            //    var divisionIndex = d1;
            //    var groupIndex = g1;
            //    var entityIndex = e1;
            //    var locationIndex = l1;

            //    if ((locationIndex || locationIndex > -1) && locationIndex != 'undefined') {
            //        //debugger;
            //        roles = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex].Roles;
            //        orgId = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex].Id;
            //        orgName = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex].Name;
            //        orgPath = json.Global.Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex].Name;
            //        orgPathClickable = '<span style="cursor:pointer;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayOrgRoleEditorInACircle\', true, \'' + 'root' + '\');">' + json.Global.Name + '</span>' + ' > ' + '<span style="cursor:pointer;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayOrgRoleEditorInACircle\', true, \'' + divisionIndex + '\');">' + json.Global.Divisions.Items[divisionIndex].Name + '</span>' + ' > ' + '<span style="cursor:pointer;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayOrgRoleEditorInACircle\', true, \'' + divisionIndex + '\', \'' + groupIndex + '\');">' + json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Name + '</span>' + ' > ' + '<span style="cursor:pointer;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayOrgRoleEditorInACircle\', true, \'' + divisionIndex + '\', \'' + groupIndex + '\', \'' + entityIndex + '\');">' + json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Name + '</span>' + ' > ' + '<span style="cursor:pointer;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayOrgRoleEditorInACircle\', true, \'' + divisionIndex + '\', \'' + groupIndex + '\', \'' + entityIndex + '\', \'' + locationIndex + '\');">' + json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex].Name + '</span>';
            //    } else if ((entityIndex || entityIndex > -1) && entityIndex != 'undefined') {
            //        roles = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Roles;
            //        orgId = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Id;
            //        orgName = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Name;
            //        orgPath = json.Global.Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Name;
            //        orgPathClickable = '<span style="cursor:pointer;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayOrgRoleEditorInACircle\', true, \'' + 'root' + '\');">' + json.Global.Name + '</span>' + ' > ' + '<span style="cursor:pointer;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayOrgRoleEditorInACircle\', true, \'' + divisionIndex + '\');">' + json.Global.Divisions.Items[divisionIndex].Name + '</span>' + ' > ' + '<span style="cursor:pointer;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayOrgRoleEditorInACircle\', true, \'' + divisionIndex + '\', \'' + groupIndex + '\');">' + json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Name + '</span>' + ' > ' + json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Name;
            //    } else if ((groupIndex || groupIndex > -1) && groupIndex != 'undefined') {
            //        roles = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Roles;
            //        orgId = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Id;
            //        orgName = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Name;
            //        orgPath = json.Global.Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Name;
            //        orgPathClickable = '<span style="cursor:pointer;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayOrgRoleEditorInACircle\', true, \'' + 'root' + '\');">' + json.Global.Name + '</span>' + ' > ' + '<span style="cursor:pointer;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayOrgRoleEditorInACircle\', true, \'' + divisionIndex + '\');">' + json.Global.Divisions.Items[divisionIndex].Name + '</span>' + ' > ' + '<span style="cursor:pointer;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayOrgRoleEditorInACircle\', true, \'' + divisionIndex + '\', \'' + groupIndex + '\');">' + json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Name + '</span>'; // 1-31-2022
            //    } else if ((divisionIndex || divisionIndex > -1) && divisionIndex != 'undefined') {
            //        if (divisionIndex == 'root') {
            //            //debugger;
            //            roles = json.Global.Roles;
            //            orgId = json.Global.Id;
            //            orgName = json.Global.Name;
            //            orgPath = json.Global.Name;
            //            //orgPathClickable = json.Global.Name;
            //            orgPathClickable = '<span style="cursor:pointer;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayOrgRoleEditorInACircle\', true, \'' + 'root' + '\');">' + json.Global.Name + '</span>';
            //        } else {
            //            roles = json.Global.Divisions.Items[divisionIndex].Roles;
            //            orgId = json.Global.Divisions.Items[divisionIndex].Id;
            //            orgName = json.Global.Divisions.Items[divisionIndex].Name;
            //            orgPath = json.Global.Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Name;
            //            orgPathClickable = '<span style="cursor:pointer;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayOrgRoleEditorInACircle\', true, \'' + 'root' + '\');">' + json.Global.Name + '</span>' + ' > ' + json.Global.Divisions.Items[divisionIndex].Name;
            //        }
            //    } else {
            //        debugger;
            //        console.log('Error in bwLocationPicker.selectLocation(): Unexpected parameter in displayOrgRoleEditorInACircle():2:.');
            //    }
            //    //debugger;

            //    //document.getElementById(requestDialogId + '_requestOrgClickableBreadcrumb').innerHTML = orgPathClickable;
            //    //$('#' + requestDialogId).find('#requestOrgClickableBreadcrumb')[0].innerHTML = orgPathClickable;



            //    //var divisionIndex = d1;
            //    //var groupIndex = g1;
            //    //var entityIndex = e1;
            //    //var locationIndex = l1;

            //    var result = {
            //        orgPathClickable: orgPathClickable,
            //        divisionIndex: divisionIndex,
            //        groupIndex: groupIndex,
            //        entityIndex: entityIndex,
            //        locationIndex: locationIndex
            //    }

            //    return result;

            //};

            //var orgPathClickable = renderTheOrgBreadcrumb2(this.options.store, bwOrgId);  // 12-9-2021 var orgPathClickable = renderTheOrgBreadcrumb2(this.options.store.Global, bwOrgId);



            //$('.bwRequest').bwRequest('displayOrgImageForNewRequestForm', locationId, locationName, orgPathClickable);


            //
            // Try to get a custom image. If none found, use the OOB one.
            //
            //html += '<img src="' + thiz.options.operationUriPrefix + 'images/corporeal.png" style="width:200px;height:200px;"/>'; // This is the original code. Remove at some point.
            //var imagePath2 = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/orgimages/' + brData.BudgetRequests[0].OrgId + '/' + 'orgimage.png'; // thiz.options.store.OrgId

            //var imagePath2 = this.options.operationUriPrefix + '_files/' + workflowAppId + '/orgimages/' + bwOrgId + '/' + 'orgimage.png';

            var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });

            var imagePath2;

            var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

            if (activeStateIdentifier.status != 'SUCCESS') {

                imagePath2 = '[No image. Unauthorized. xcx213124-34556-34-234-3245-xx-55]';

            } else {

                imagePath2 = this.options.operationUriPrefix + '_files/' + workflowAppId + '/orgimages/' + bwOrgId + '/' + 'orgimage.png?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;

            }



            $.get(imagePath2).done(function () {

                var img = new Image();
                img.src = imagePath2;
                img.onload = function (e) {
                    setTimeout(function () {
                        try {

                            if ($('#' + parentElementId).find('#divCreateRequestFormContent_imgRequestOrgImage') && $('#' + parentElementId).find('#divCreateRequestFormContent_imgRequestOrgImage')[0]) {

                                $('#' + parentElementId).find('#divCreateRequestFormContent_imgRequestOrgImage')[0].setAttribute('xcx', 'xcx213235-1'); // xcx attribute may help find this...
                                $('#' + parentElementId).find('#divCreateRequestFormContent_imgRequestOrgImage')[0].setAttribute('src', imagePath2);

                            } else {

                                console.log('Error finding divCreateRequestFormContent_imgRequestOrgImage xcx12342554326-1 this is imagePath2 maybe not important right now...xcx12342');

                            }
                        } catch (e) {

                            if ($('#' + parentElementId).find('#divCreateRequestFormContent_imgRequestOrgImage') && $('#' + parentElementId).find('#divCreateRequestFormContent_imgRequestOrgImage')[0]) {

                                $('#' + parentElementId).find('#divCreateRequestFormContent_imgRequestOrgImage')[0].setAttribute('xcx', 'xcx213235-2'); // xcx attribute may help find this...
                                $('#' + parentElementId).find('#divCreateRequestFormContent_imgRequestOrgImage')[0].setAttribute('src', thiz.options.operationUriPrefix + 'images/corporeal.png');

                            } else {

                                console.log('Error finding divCreateRequestFormContent_imgRequestOrgImage xcx12342554326-2 this is imagePath2 maybe not important right now...xcx12342');

                            }
                        }
                    }, 500);
                }
            }).fail(function () {

                //document.getElementById(imgId).src = globalUrlPrefix + globalUrl + '/images/mp4.jfif'; // There is no thumbnail, so display the icon.
            });



            //$.get(imagePath2).done(function () {
            //    setTimeout(function () { // Only needs to happen for Chrome.
            //        //var img = document.getElementById('imgRequestOrgImage');
            //        //img.attr.src = imagePath2;
            //        //var requestDialogId = elementId + '_' + thiz.options.bwBudgetRequestId; // elementId: divCreateRequestFormContent
            //        //debugger;
            //        //var requestDialogId = 'divCreateRequestFormContent_imgRequestOrgImage'; // + '_' + thiz.options.bwBudgetRequestId; // elementId: divCreateRequestFormContent

            //        // 1-13-2022
            //        //try {


            //        if ($('#' + parentElementId).find('#divCreateRequestFormContent_imgRequestOrgImage') && $('#' + parentElementId).find('#divCreateRequestFormContent_imgRequestOrgImage')[0]) {

            //            $('#' + parentElementId).find('#divCreateRequestFormContent_imgRequestOrgImage')[0].setAttribute('src', imagePath2); //.attr('src', imagePath2);

            //        } else {

            //            console.log('Error finding divCreateRequestFormContent_imgRequestOrgImage xcx12342554326 this is imagePath2 maybe not important right now...xcx12342');

            //        }

            //        //} catch (e) { }




            //    }, 500);
            //}).fail(function () {
            //    //alert("This org has no image."); // do nothing 
            //});
            // End: Getting the custom image
            //

            // Display the breakcrumb.
            //debugger;


            // changed below 10-18-2020
            //if (this.options.requestForm) {
            //    $('#' + parentElementId).find('#divCreateRequestFormContent_requestOrgClickableBreadcrumb')[0].innerHTML = orgPathClickable; // spanNewRequestFormLocationPickerBreadcrumb
            //    $('#' + parentElementId).find('#txtLocationPickerFilter')[0].value = bwOrgName; // Set the textbox to the selected location Name. 
            //    $(this.options.requestForm)[0].setAttribute('bwOrgName', bwOrgName);
            //    // Display the breadcrumb just below the picker.
            //    $('#' + parentElementId).find('#spanNewRequestFormLocationPickerBreadcrumb')[0].innerHTML = orgPathClickable;
            //} else {
            //    $(this.element).find('#txtLocationPickerFilter')[0].value = bwOrgName; // Set the textbox to the selected location Name. 
            //    $(this.element).find('#spanNewRequestFormLocationPickerBreadcrumb')[0].innerHTML = orgPathClickable;
            //}

            var orgPathClickable = $('.bwAuthentication').bwAuthentication('renderTheOrgBreadcrumb2', this.options.store, bwOrgId); // 10-5-2022  // 12-9-2021 var orgPathClickable = renderTheOrgBreadcrumb2(this.options.store.Global, bwOrgId);

            if (parentElementId == 'divCreateRequestFormContent') {

                $(this.element).find('#txtLocationPickerFilter')[0].value = bwOrgName; // Set the textbox to the selected location Name. 
                $(this.element).find('#spanNewRequestFormLocationPickerBreadcrumb')[0].innerHTML = orgPathClickable.orgPathClickable;

                // divCreateRequestFormContent_requestOrgClickableBreadcrumb

                var budgetrequestform = $(this.element).closest('#budgetrequestform')[0];

                if (budgetrequestform) {
                    $(budgetrequestform).find('#divCreateRequestFormContent_requestOrgClickableBreadcrumb')[0].innerHTML = orgPathClickable.orgPathClickable; // 1-13-2022 

                }

                //
                // Try to get a custom image. If none found, use the OOB one.
                //
                //html += '<img src="' + thiz.options.operationUriPrefix + 'images/corporeal.png" style="width:200px;height:200px;"/>'; // This is the original code. Remove at some point.
                //var imagePath2 = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/orgimages/' + brData.BudgetRequests[0].OrgId + '/' + 'orgimage.png'; // thiz.options.store.OrgId

                //debugger;

                var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });

                //var imagePath2 = this.options.operationUriPrefix + '_files/' + workflowAppId + '/orgimages/' + bwOrgId + '/' + 'orgimage.png';

                var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

                if (activeStateIdentifier.status != 'SUCCESS') {

                    imagePath2 = '[No image. Unauthorized. xcx213124-34556-34-32555]';

                } else {

                    //html += '<img id="attachmentstest1" xcx="xcx2312-2-2" src="' + thiz.options.operationUriPrefix + fileUrl_Thumbnail + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;max-width:250px;border:1px solid gray;border-radius:0 30px 0 0;" alt="" ';

                    imagePath2 = this.options.operationUriPrefix + '_files/' + workflowAppId + '/orgimages/' + bwOrgId + '/' + 'orgimage.png?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;

                }




                $.get(imagePath2).done(function () {
                    //debugger;
                    var img = new Image();
                    img.src = imagePath2;
                    img.onload = function (e) {
                        setTimeout(function () {
                            try {
                                //debugger;
                                console.log('');
                                console.log('00000000000000000000000000000000');
                                console.log('In bwLocationPicker.js.selectLocation.get.imagePath2.done(). imagePath2: ' + imagePath2);
                                console.log('00000000000000000000000000000000');
                                console.log('');

                                $(budgetrequestform).find('#divCreateRequestFormContent_imgRequestOrgImage')[0].setAttribute('src', imagePath2);

                                $(budgetrequestform).find('#divCreateRequestFormContent_imgRequestOrgImage')[0].setAttribute('onclick', '$(\'.bwCircleDialog2\').bwCircleDialog2(\'displayOrgRoleEditorInACircle\', true, \'' + orgPathClickable.divisionIndex + '\', \'' + orgPathClickable.groupIndex + '\', \'' + orgPathClickable.entityIndex + '\', \'' + orgPathClickable.locationIndex + '\');');

                            } catch (e) {
                                debugger;
                                //$('#' + requestDialogId + '_imgRequestOrgImage').attr('src', thiz.options.operationUriPrefix + 'images/corporeal.png');
                                $(budgetrequestform).find('#divCreateRequestFormContent_imgRequestOrgImage')[0].setAttribute('src', thiz.options.operationUriPrefix + 'images/corporeal.png');

                                $(budgetrequestform).find('#divCreateRequestFormContent_imgRequestOrgImage')[0].setAttribute('onclick', '$(\'.bwCircleDialog2\').bwCircleDialog2(\'displayOrgRoleEditorInACircle\', true, \'' + orgPathClickable.divisionIndex + '\', \'' + orgPathClickable.groupIndex + '\', \'' + orgPathClickable.entityIndex + '\', \'' + orgPathClickable.locationIndex + '\');');

                            }
                        }, 500);
                    }
                }).fail(function () {
                    debugger;
                    //document.getElementById(imgId).src = globalUrlPrefix + globalUrl + '/images/mp4.jfif'; // There is no thumbnail, so display the icon.
                });



                //$.get(imagePath2).done(function () {
                //    setTimeout(function () { 
                //        //var img = document.getElementById('imgRequestOrgImage');
                //        //img.attr.src = imagePath2;
                //        //var requestDialogId = elementId + '_' + thiz.options.bwBudgetRequestId; // elementId: divCreateRequestFormContent
                //        //debugger;
                //        //var requestDialogId = 'divCreateRequestFormContent_imgRequestOrgImage'; // + '_' + thiz.options.bwBudgetRequestId; // elementId: divCreateRequestFormContent

                //        // 1-13-2022
                //        //try {

                //        console.log('');
                //        console.log('00000000000000000000000000000000');
                //        console.log('In bwLocationPicker.js.selectLocation.get.imagePath2.done(). imagePath2: ' + imagePath2);
                //        console.log('00000000000000000000000000000000');
                //        console.log('');
                //        $(budgetrequestform).find('#divCreateRequestFormContent_imgRequestOrgImage')[0].setAttribute('src', imagePath2);

                //        // $('.bwCircleDialog').bwCircleDialog('displayOrgRoleEditorInACircle', true, 'root');

                //        //orgPathClickable: orgPathClickable,
                //        //divisionIndex: divisionIndex,
                //        //groupIndex: groupIndex,
                //        //entityIndex: entityIndex,
                //        //locationIndex: locationIndex


                //        $(budgetrequestform).find('#divCreateRequestFormContent_imgRequestOrgImage')[0].setAttribute('onclick', '$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayOrgRoleEditorInACircle\', true, \'' + orgPathClickable.divisionIndex + '\', \'' + orgPathClickable.groupIndex + '\', \'' + orgPathClickable.entityIndex + '\', \'' + orgPathClickable.locationIndex + '\');');

                //        //$('#' + parentElementId).find('#divCreateRequestFormContent_imgRequestOrgImage')[0].setAttribute('src', imagePath2); // divCreateRequestFormContent_imgRequestOrgImage
                //        //} catch (e) { }




                //    }, 500);
                //}).fail(function () {
                //    //alert("This org has no image."); // do nothing 
                //    console.log('');
                //    console.log('00000000000000000000000000000000');
                //    console.log('In bwLocationPicker.js.selectLocation.get.imagePath2.fail(). imagePath2: ' + imagePath2);
                //    console.log('00000000000000000000000000000000');
                //    console.log('');
                //});
                // End: Getting the custom image
                //








            } else {
                $('#' + parentElementId).find('#divCreateRequestFormContent_requestOrgClickableBreadcrumb')[0].innerHTML = orgPathClickable.orgPathClickable;
                $('#' + parentElementId).find('#txtLocationPickerFilter')[0].value = bwOrgName; // Set the textbox to the selected location Name. 
                $(this.options.requestForm)[0].setAttribute('bwOrgName', bwOrgName);
                // Display the breadcrumb just below the picker.
                $('#' + parentElementId).find('#spanNewRequestFormLocationPickerBreadcrumb')[0].innerHTML = orgPathClickable.orgPathClickable;
            }







            //
            // This is where we check if the workflow dialog is displayed. If so, update the thing to correspond to this org id.
            //
            console.log('In bwLocationPicker.selectLocation(). This is where we check if the workflow dialog is displayed. If so, update the thing to correspond to this org id.');
            //var bwBudgetRequestId = $(formElement).find('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
            var requestDialogParentId = 'divNewRequestWorkflowParticipantsDialog_' + bwBudgetRequestId + '_Parent';
            if ($('#' + requestDialogParentId).is(':visible')) {
                //var xx = document.getElementById(requestDialogParentId); //.offsetHeight;
                //debugger;
                //if (xx != null && xx.offsetHeight > 0) {
                //var bwWorkflowId = document.getElementById(requestDialogParentId + '_spanWorkflowGuidAndRequestTypeForTesting2').getAttribute('bwworkflowid'); //.innerHTML;
                //var bwWorkflowId = document.getElementById('budgetrequestform').getAttribute('bwworkflowid');


                //var formElement = this.element.closest("#budgetrequestform");
                //var bwBudgetRequestId = $(formElement)[0].getAttribute('bwbudgetrequestid');
                var requestDialogId = 'divRequestFormDialog_' + bwBudgetRequestId;

                //$('.bwRequest').bwRequest('renderNewRequestWorkflowParticipants', requestDialogParentId, bwWorkflowId);
                $('.bwRequest').bwRequest('displayNewRequestWorkflowParticipantsDialog', requestDialogId);



            }

            if (this.options.inVisualizations == true) {

                //alert('Need to redraw chart.xcx1');
                console.log('In bwLocationPicker.selectLocation(). Need to redraw chart.xcx1');

            }


        } catch (e) {
            try {
                thiz.options.pickerDialog.dialog('close'); // 7-13-2020 THIS closes all of them that are open. Ok for now! and maybe the preferred way!!
            } catch (e) {
                //console.log('Exception in bwLocationPicker.selectLocation.dialog.close():xcx1: ' + e.message + ', ' + e.stack);
                ////debugger;
                //var x = 'why are we here?';
            }

            console.log('Exception in bwLocationPicker.js.selectLocation(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwLocationPicker.js.selectLocation(): ' + e.message + ', ' + e.stack);
        }
    },
    txtLocationPickerFilter_OnKeyup: function (elementId) {
        try {
            console.log('In txtLocationPickerFilter_OnKeyup(). elementId: ' + elementId);
            var formElement = this.element.closest("#budgetrequestform");
            //if (formElement) {
            if ($(formElement).find('#divLocationPickerDropDown')[0].style.display == 'none') {
                //// When displaying the location picker, make it size itself a bit wider than the user entry textbox.
                //var width1 = document.getElementById('txtLocationPickerFilter').style.width;
                //var width2 = width1.split('px')[0];
                //var width3 = Number(width2) + 50;
                //var width = width3 + 'px';
                //$(formElement).find('#divLocationPickerDropDown')[0].style.width = width;
                //$(formElement).find('#divLocationPickerDropDown')[0].style.display = 'block';





                this.txtLocationPickerFilter_OnMouseup();












            }
            //} else {
            //    // Must be on Visualizations
            //    if ($('.bwTrackSpending').find('#divLocationPickerDropDown')[0].style.display == 'none') {
            //        // When displaying the location picker, make it size itself a bit wider than the user entry textbox.
            //        var width1 = document.getElementById('txtLocationPickerFilter').style.width;
            //        var width2 = width1.split('px')[0];
            //        var width3 = Number(width2) + 50;
            //        var width = width3 + 'px';
            //        $('.bwTrackSpending').find('#divLocationPickerDropDown')[0].style.width = width;
            //        $('.bwTrackSpending').find('#divLocationPickerDropDown')[0].style.display = 'block';
            //    }
            //}
        } catch (e) {
            console.log('Exception in txtLocationPickerFilter_OnKeyup(): ' + e.message + ', ' + e.stack);
        }
    },
    txtLocationPickerFilter_OnMouseup: function () {
        try {

            console.log('In txtLocationPickerFilter_OnMouseup().');
            var thiz = this;
            // When the user is done selecting a location, hide the location picker drop down.
            var parentElementId;
            try {
                parentElementId = $(this.element).closest('#budgetrequestform').closest('.ui-dialog-content')[0].id; // If it is in a dialog, this returns the dialog id.
            } catch (e) { }
            if (!parentElementId) {
                // It is not in a dialog, so it must be a new request.
                parentElementId = 'divCreateRequestFormContent';
            }



            //var formElement = $(this.element).closest("#budgetrequestform");
            //debugger;
            try {
                var dialogId = $('#' + parentElementId).closest('.ui-dialog')[0].id;
                console.log('In txtLocationPickerFilter_OnMouseup(). dialogId: ' + dialogId);
            } catch (e) {
                // This fails on the new request form. Fix someday or maybe not...
            }
            //if ($(formElement).find('#divLocationPickerDropDown')[0].style.display == 'none') {


            // When displaying the location picker, make it size itself a bit wider than the user entry textbox.
            var width1;
            if ($('#' + parentElementId).find('#txtLocationPickerFilter')[0]) {
                width1 = $('#' + parentElementId).find('#txtLocationPickerFilter')[0].style.width;
            } else {
                width1 = $(this.element).find('#txtLocationPickerFilter')[0].style.width;
            }

            var width2 = width1.split('px')[0];
            var width3 = Number(width2) + 50;
            var width = width3; // + 'px';
            //$(formElement).find('#divLocationPickerDropDown')[0].style.width = width;
            //$(formElement).find('#divLocationPickerDropDown')[0].style.display = 'block';

            // This makes it show up on top and to not move the other elements around.
            //document.getElementById('divLocationPickerDropDown').style.position = 'absolute';
            //document.getElementById('divLocationPickerDropDown').style.zIndex = '10';



            // CHANGED 8-25-2020
            thiz.options.pickerDialog = $(this.element).find("#divLocationPickerDropDown"); // $('#' + parentElementId).find("#divLocationPickerDropDown"); // THIS IS how we can reference the dialog later on and close it etc.

            // thiz.options.pickerDialog.dialog({ // divLocationPickerDropDown
            $(this.element).find("#divLocationPickerDropDown").dialog({
                position: {
                    my: "left top",
                    at: "left bottom",
                    of: $(thiz.element).find('#txtLocationPickerFilter') // $('#' + parentElementId).find('#txtLocationPickerFilter') //"#txtLocationPickerFilter"
                },
                modal: true,
                resizable: false,
                closeText: "Cancel",
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                //title: '',
                height: 300,
                width: width,
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hi


                open: function (event, ui) {
                    //var this2 = this;
                    $('.ui-widget-overlay').bind('click', function () {
                        //$(this2).dialog('close');
                        thiz.options.pickerDialog.dialog('close');
                        //$(this.element).find("#divLocationPickerDropDown").dialog('close');
                    });

                    // Hide the title bar.
                    $(this).dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
                },
                close: function () {

                    //debugger;
                    //var this2 = this;
                    //$('#' + parentElementId).find("#divLocationPickerDropDown").dialog('destroy');
                    thiz.options.pickerDialog.dialog('destroy');
                }

            });



            //}
        } catch (e) {
            console.log('Exception in txtLocationPickerFilter_OnMouseup(): ' + e.message + ', ' + e.stack);
        }
    },

    collapseTree: function (divisionIndex, groupIndex, entityIndex) {
        try {
            console.log('In collapseTree().');
            //if (elementId == 'locationsRootNode') {
            //    this.options.jsonTreeState.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Style = 'display:none;'; // Collapse!
            //    this.renderLocationPickerTreeview(); //_create();
            //} else if (elementId == 'legalEntitiesRootNode') {
            //    this.options.jsonTreeState.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Style = 'display:none;'; // Collapse!
            //    this.renderLocationPickerTreeview(); //_create();
            //} else if (elementId == 'groupsRootNode') {
            //    this.options.jsonTreeState.Divisions.Items[divisionIndex].Groups.Style = 'display:none;'; // Collapse!
            //    this.renderLocationPickerTreeview(); //_create();
            //} else if (elementId == 'divisionsRootNode') {
            //    this.options.jsonTreeState.Divisions.Style = 'display:none;'; // Collapse!
            //    this.renderLocationPickerTreeview(); //_create();
            //} else {
            //    alert('In collapseTree(). Unexpected elementId: ' + elementId);
            //}
            if (entityIndex || entityIndex > -1) {
                this.options.jsonTreeState.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Style = 'display:none;'; // Collapse!
                this._create();
            } else if (groupIndex || groupIndex > -1) {
                this.options.jsonTreeState.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Style = 'display:none;'; // Collapse!
                this._create();
            } else if (divisionIndex || divisionIndex > -1) {
                if (divisionIndex == 'root') {
                    this.options.jsonTreeState.Global.Divisions.Style = 'display:none;'; // Collapse!
                    this._create();
                } else {
                    this.options.jsonTreeState.Global.Divisions.Items[divisionIndex].Groups.Style = 'display:none;'; // Collapse!
                    this._create();
                }
            } else {

                alert('Error: Unexpected parameter in collapseTree().');
            }
        } catch (e) {
            console.log('Exception in collapseTree(): ' + e.message + ', ' + e.stack);
        }
    },
    expandTree: function (divisionIndex, groupIndex, entityIndex) {
        try {
            console.log('In expandTree().');
            //if (elementId == 'locationsRootNode') {
            //    this.options.jsonTreeState.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Style = 'display:block;'; // Expand!
            //    this.renderLocationPickerTreeview(); //_create();
            //} else if (elementId == 'legalEntitiesRootNode') {
            //    this.options.jsonTreeState.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Style = 'display:block;'; // Expand!
            //    this.renderLocationPickerTreeview(); //_create();
            //} else if (elementId == 'groupsRootNode') {
            //    this.options.jsonTreeState.Divisions.Items[divisionIndex].Groups.Style = 'display:block;'; // Expand!
            //    this.renderLocationPickerTreeview(); //_create();
            //} else if (elementId == 'divisionsRootNode') {
            //    this.options.jsonTreeState.Divisions.Style = 'display:block;'; // Expand!
            //    this.renderLocationPickerTreeview(); //_create();
            //} else {
            //    alert('In expandTree(). Unexpected elementId: ' + elementId);
            //}
            if (entityIndex || entityIndex > -1) {
                this.options.jsonTreeState.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Style = 'display:block;'; // Expand!
                this._create();
            } else if (groupIndex || groupIndex > -1) {
                this.options.jsonTreeState.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Style = 'display:block;'; // Expand!
                this._create();
            } else if (divisionIndex || divisionIndex > -1) {
                if (divisionIndex == 'root') {
                    this.options.jsonTreeState.Global.Divisions.Style = 'display:block;'; // Expand!
                    this._create();
                } else {
                    this.options.jsonTreeState.Global.Divisions.Items[divisionIndex].Groups.Style = 'display:block;'; // Expand!
                    this._create();
                }
            } else {

                alert('Error: Unexpected parameter in expandTree().');
            }
        } catch (e) {
            console.log('Exception in expandTree(): ' + e.message + ', ' + e.stack);
        }
    },

});