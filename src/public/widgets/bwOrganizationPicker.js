$.widget("bw.bwOrganizationPicker", {
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
        This is the bwOrganizationPicker.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        parentElementId: 'divPageContent1',
        //launchedFromDialog: false,

        bwOrgId: null, // bwDataGrid reaches out for this value.
        bwOrgName: null, // bwDataGrid reaches out for this value.


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

        bwEnabledRequestTypes: null, // An array of the following: ['Budget Request', 'Quote Request', 'Reimbursement Request', 'Recurring Expense', 'Capital Plan Project', 'Work Order']
        operationUriPrefix: null,
        ajaxTimeout: 15000,
        quill: null,
        displayWorkflowPicker: false,
        displayRoleIdColumn: false,
        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },

    _create: function (assignmentRowChanged_ElementId) {
        this.element.addClass("bwOrganizationPicker");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {

            if (this.options.operationUriPrefix == null) {
                // This formulates the operationUri, which is used throughout.
                var url1 = window.location.href.split('https://')[1];
                var url2 = url1.split('/')[0];
                this.options.operationUriPrefix = 'https://' + url2 + '/';
            }

            //var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            if (this.options.jsonData) {
                this.options.bwOrgId = this.options.jsonData.bwOrgId;
                this.options.bwOrgName = this.options.jsonData.bwOrgName;
            }

            if (this.options.inVisualizations == true) {
                $.ajax({
                    url: this.options.operationUriPrefix + "odata/OrgRolesConfiguration/" + workflowAppId + "/true", //?$filter=Active eq true", //('eCarWorkflow')", // Get the eCarWorkflow json/definition from the database.
                    dataType: "json",
                    contentType: "application/json",
                    type: "Get"
                }).done(function (result) {
                    try {
                        var orgRoles;
                        if (!participantId) {
                            // The user is not logged in.
                            console.log('The user is not logged in, so displaying the default WorkflowEditor.');
                            orgRoles = result.value[0].ConfigurationValues; // Works when the user is not logged in.
                        } else {
                            // The user is logged in.
                            orgRoles = result.value; // Works when the user is logged in.
                        }
                        thiz.options.store = {
                            Global: orgRoles
                        }

                        if (!(thiz.options.bwOrgId && thiz.options.bwOrgName)) {
                            thiz.options.bwOrgId = orgRoles.Global.Id; // This is the default that is displayed when the picker is rendered for the first time.
                            thiz.options.bwOrgName = orgRoles.Global.Name; // This is the default that is displayed when the picker is rendered for the first time.
                        }

                        thiz.renderLocationPicker_Visualizations();

                    } catch (e) {
                        console.log('Exception in bwOrganizationPicker._create().xx.Get:1-1: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwOrganizationPicker._create().xx.Get:1-1: ' + e.message + ', ' + e.stack);
                    }
                }).fail(function (data) {
                    console.log('In bwOrganizationPicker._create.fail(): ' + JSON.stringify(data));
                    var msg;
                    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                    } else {
                        msg = JSON.stringify(data);
                    }
                    alert('Exception in bwOrganizationPicker._create().xx.Get:2-1: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                    console.log('Exception in bwOrganizationPicker._create().xx.Get:2-1: ' + JSON.stringify(data));
                    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                    //var error = JSON.parse(data.responseText)["odata.error"];
                    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                });

            } else {

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
                        html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwOrganizationPickerxcx1</span>';
                        html += '<br />';
                        html += '<span style="">Invalid value for allowRequestModifications:1: ' + this.options.allowRequestModifications + '</span>';
                        this.element.html(html);
                    }
                } else {

                    var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');
                    var data = {
                        bwParticipantId_LoggedIn: participantId,
                        bwActiveStateIdentifier: activeStateIdentifier,
                        bwWorkflowAppId_LoggedIn: workflowAppId,

                        bwWorkflowAppId: workflowAppId,
                        isActive: true
                    };
                    $.ajax({
                        url: this.options.operationUriPrefix + "_bw/orgrolesconfiguration",
                        type: "POST",
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
                                    console.log('In bwOrganizationPicker.js._create(). Another crazy fix here, come back sometime to revisit. xcx3245347-2');
                                    console.log('***************');
                                    console.log('');

                                    //alert('In bwOrganizationPicker.js._create(). Another crazy fix here, come back sometime to revisit. xcx3245347-2');

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





                                //debugger;
                                //if (thiz.options.allowRequestModifications == false) {
                                //    thiz.renderLocationPicker_ReadOnly(assignmentRowChanged_ElementId); // Render the Location Picker.  // Render the org chart. // Need to render, not allowing the user to make modifications.
                                //} else if (thiz.options.allowRequestModifications == true) {
                                thiz.renderLocationPicker(assignmentRowChanged_ElementId); // Render the Location Picker.
                                //} else {
                                //    var html = '';
                                //    html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwOrganizationPicker</span>';
                                //    html += '<br />';
                                //    html += '<span style="">Invalid value for allowRequestModifications:2: ' + thiz.options.allowRequestModifications + '</span>';
                                //    thiz.element.html(html);
                                //}




                            } catch (e) {
                                console.log('Exception in bwOrganizationPicker._create().xx.Get:1-2: ' + e.message + ', ' + e.stack);
                                displayAlertDialog('Exception in bwOrganizationPicker._create().xx.Get:1-2: ' + e.message + ', ' + e.stack);
                            }
                        },
                        error: function (jqXHR, settings, errorThrown) {

                            if (jqXHR.status == 401) { // HTTP 401 "Unauthorized".

                                console.log('Error in bwOrganizationPicker.js._create.orgrolesconfiguration(). xcx213124-1 Unauthorized. Please refresh your browser and log in again. jqXHR.status: ' + jqXHR.status + ', settings: ' + settings + ', errorThrown: ' + errorThrown);

                            } else {
                                console.log('Error in bwOrganizationPicker.js._create.orgrolesconfiguration():1: ' + settings + ', ' + errorThrown + ' I suspect this may be a service unavailable error but not sure by any means! More investigation needed!' + JSON.stringify(jqXHR));
                                alert('Error in bwOrganizationPicker.js._create.orgrolesconfiguration():1: ' + settings + ', ' + errorThrown + ' I suspect this may be a service unavailable error but not sure by any means! More investigation needed!' + JSON.stringify(jqXHR));
                            }

                        }
                    });

                }
            }

            console.log('In bwOrganizationPicker._create(). The widget has been initialized.');
            this.options.instantiated = true; // This is so we can check if the thing is instantiated yet.

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwOrganizationPickerxcx2</span>';
            html += '<br />';
            html += '<span style="">Exception in bwOrganizationPicker.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            console.log('In bwOrganizationPicker.getData().');
            var value = $(this.element).find('#txtOrganizationPickerFilter')[0].value;
            return value;
        } catch (e) {
            console.log('Exception in bwOrganizationPicker.getData(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwOrganizationPicker.getData(): ' + e.message + ', ' + e.stack);
        }
    },
    instantiated: function () {
        try {
            console.log('In bwOrganizationPicker.instantiated().');
            return this.options.instantiated;
        } catch (e) {
            console.log('Exception in bwOrganizationPicker.instantiated(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwOrganizationPicker.instantiated(): ' + e.message + ', ' + e.stack);
        }
    },
    isARequiredField: function () {
        try {
            console.log('In bwOrganizationPicker.isARequiredField().');
            return this.options.renderAsARequiredField;
        } catch (e) {
            console.log('Exception in bwOrganizationPicker.isARequiredField(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwOrganizationPicker.isARequiredField(): ' + e.message + ', ' + e.stack);
        }
    },
    getfieldTitle: function () {
        try {
            console.log('In bwOrganizationPicker.getfieldTitle().');
            return this.options.fieldTitle;
        } catch (e) {
            console.log('Exception in bwOrganizationPicker.getfieldTitle(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwOrganizationPicker.getfieldTitle(): ' + e.message + ', ' + e.stack);
        }
    },
    renderLocationPicker: function (assignmentRowChanged_ElementId) {
        try {
            console.log('In bwOrganizationPicker.js.renderLocationPicker().');

            var html = '';

            var parentElementId = this.options.parentElementId; //'divPageContent1';
            html += '           <div id="spanNewRequestFormLocationPickerBreadcrumb" style="cursor:pointer;color:purple;font-size:8pt;">[spanNewRequestFormLocationPickerBreadcrumb]</div>';


            // 3-12-2022 was width:450px;
            html += '           <input id="txtOrganizationPickerFilter" type="text" class="selectHomePageWorkflowAppDropDown" style="width:750px;border-color: whitesmoke; color: grey;font-size: 1em; font-weight: bold; cursor: pointer; font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;" onkeyup="$(\'#' + parentElementId + '\').find(\'.bwOrganizationPicker\').bwOrganizationPicker(\'txtOrganizationPickerFilter_OnKeyup\', \'txtOrganizationPickerFilter\');" onmouseup="$(\'#' + parentElementId + '\').find(\'.bwOrganizationPicker\').bwOrganizationPicker(\'txtOrganizationPickerFilter_OnMouseup\', \'txtOrganizationPickerFilter\');" />';


            html += '           <div id="divLocationPickerDropDown" style="display:none;background-color:white;overflow-x:hidden;"></div>'; // Scrollable div wrapper for the treeview. Position and z-index makes it show up on top and to not move the other elements around.

            this.element.html(html); // Render the html.

            this.renderLocationPickerTreeview2();

            //if (this.options.bwOrgId) { // only render if we have this value. This means this doesn't happen for a new request
            //    var formElement = this.element.closest("#budgetrequestform");
            //    $(formElement).find('#txtOrganizationPickerFilter')[0].setAttribute('bwOrgId', this.options.bwOrgId);
            //    $(formElement).find('#txtOrganizationPickerFilter').value = this.options.bwOrgName; // Set the textbox to the selected location Name. 
            //    debugger;
            this.selectLocation(this.options.bwOrgId, this.options.bwOrgName);
            //}

        } catch (e) {
            console.log('Exception in renderLocationPicker: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwOrganizationPickerxcx3</span>';
            html += '<br />';
            html += '<span style="">Exception in bwOrganizationPicker.renderLocationPicker(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    },

    //renderLocationPicker_ReadOnly: function (assignmentRowChanged_ElementId) {
    //    try {
    //        console.log('In renderLocationPicker_ReadOnly().');
    //        //debugger;
    //        //var thiz = this;
    //        //var json = this.options.store;
    //        var html = '';





    //        html += '<table style="width:100%;">';
    //        html += '                        <tbody><tr class="xdTableOffsetRow" id="toolboxdraggablerow_2554" bwwidgetname="bwOrganizationPicker">';
    //        html += '                            <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
    //        html += '                                <span class="xdlabel">';
    //        html += '                                    Locationxcx2:';
    //        html += '                                </span>';
    //        //html += '                                <span style="color:red;font-size:medium;">*</span>';

    //        if (this.options.inFormsEditor == true) {
    //            html += '                               <span class="ToggleRequiredAsterisk" title="Select this asterick to make this a required field." onclick="$(\'.bwFormsEditor\').bwFormsEditor(\'toggleFormRequiredField\', this);">*</span>';
    //        } else if (this.options.renderAsARequiredField == true) {
    //            html += '                               <span style="color:red;font-size:medium;">*</span>';
    //        } else if (this.options.renderAsARequiredField == false) {
    //            //
    //        }


    //        html += '                            </td>';
    //        html += '                            <td class="xdTableOffsetCellComponent" style="white-space:normal;text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">';


    //        html += '<input id="txtOrganizationPickerFilter" class="bwRequestJson" bwdatarequired="true" bwdatatype="String" bwfieldname="bwOrganizationPicker" contentEditable="false" disabled type="text" style="width:450px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;"></input>';
    //        //html == '<input id="txtOrganizationPickerFilterSelectedLocationId" type="hidden" value="" />';


    //        //html += '<br />';
    //        //html += '<div id="divLocationPickerDropDown" style="display:none;height:300px;width:400px;border:1px solid #066b8b;overflow-y:auto;background-color:white;position:absolute;z-index:10;">'; // Scrollable div wrapper for the treeview. // dark blue border. // position and z-index makes it show up on top and to not move the other elements around.

    //        //html += '</div>'; // Scrollable div wrapper for the treeview.
    //        //debugger;
    //        html += '<br />';
    //        html += '                                                           <span id="spanNewRequestFormLocationPickerBreadcrumb" style="cursor:pointer;color:purple;font-size:8pt;">[spanNewRequestFormLocationPickerBreadcrumb]</span>';


    //        html += '                            </td>';
    //        html += '                        </tr>';
    //        html += '                    </tbody>';
    //        html += '</table>';







    //        // Render the html.
    //        //if (this.options.inFormsEditor != true) {
    //        //    // THIS IS VERY IMPORTANT AND NEEDS TO BE IN EVERY WIDGET!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 7-12-2020
    //        //    // Even though the widget regenerates itself (re-renders), the parent TR tag gets missed!!! Therefore we have to handle getting rid of our form editor draggable attribute here.
    //        //    this.element.closest('tr').removeAttr('draggable');
    //        //}
    //        this.element.html(html);
    //        //this.renderLocationPickerTreeview2();
    //        //debugger;




    //        //if (this.options.bwOrgId) { // only render if we have this value. This means this doesn't happen for a new request
    //        //    var formElement = this.element.closest("#budgetrequestform");
    //        //    $(formElement).find('#txtOrganizationPickerFilter')[0].setAttribute('bwOrgId', this.options.bwOrgId);
    //        //    $(formElement).find('#txtOrganizationPickerFilter').value = this.options.bwOrgName; // Set the textbox to the selected location Name. 
    //        //    debugger;
    //        //this.selectLocation(); //this.options.bwOrgId, this.options.bwOrgName);
    //        this.selectLocation(this.options.bwOrgId, this.options.bwOrgName);
    //        //}

    //    } catch (e) {
    //        console.log('Exception in renderLocationPicker_ReadOnly: ' + e.message + ', ' + e.stack);
    //        var html = '';
    //        html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwOrganizationPickerxcx4</span>';
    //        html += '<br />';
    //        html += '<span style="">Exception in bwOrganizationPicker.renderLocationPicker_ReadOnly(): ' + e.message + ', ' + e.stack + '</span>';
    //        thiz.element.html(html);
    //    }
    //},

    //renderLocationPicker_Visualizations: function (assignmentRowChanged_ElementId) {
    //    try {
    //        console.log('In renderLocationPicker_Visualizations(). xcx213-2');
    //        //debugger;
    //        //var thiz = this;
    //        //var json = this.options.store;
    //        var html = '';





    //        html += '<table style="width:100%;">';
    //        html += '                        <tbody><tr class="xdTableOffsetRow" bwwidgetname="bwOrganizationPicker">';
    //        html += '                            <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
    //        html += '                                <span class="xdlabel">';
    //        html += '                                    Locationxcx3:';
    //        html += '                                </span>';

    //        //if (this.options.inFormsEditor == true) {
    //        //    html += '                               <span class="ToggleRequiredAsterisk" title="Select this asterick to make this a required field." onclick="$(\'.bwFormsEditor\').bwFormsEditor(\'toggleFormRequiredField\', this);">*</span>';
    //        //} else if (this.options.renderAsARequiredField == true) {
    //        //    html += '                               <span style="color:red;font-size:medium;">*</span>';
    //        //} else if (this.options.renderAsARequiredField == false) {
    //        //    //
    //        //}


    //        html += '                            </td>';
    //        html += '                            <td class="xdTableOffsetCellComponent" style="white-space:nowrap;text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">';


    //        //debugger;
    //        var parentElementId;
    //        try {
    //            parentElementId = $(this.options.requestForm).closest('.ui-dialog-content')[0].id; // If it is in a dialog, this returns the dialog id.
    //        } catch (e) { }
    //        if (!parentElementId) {
    //            // It is not in a dialog, so it must be a new request.
    //            parentElementId = 'divCreateRequestFormContent';
    //        }

    //        //var locationElementId = 
    //        //var x = $(form).closest('span')[0].id;
    //        ////var y = x.id;
    //        //var id = $(this.element).closest('#budgetrequestform').closest('span').id;

    //        html += '<input id="txtOrganizationPickerFilter" type="text" style="width:450px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" ';
    //        html += ' onkeyup="$(\'.bwOrganizationPicker\').bwOrganizationPicker(\'txtOrganizationPickerFilter_OnKeyup\', \'txtOrganizationPickerFilter\');" ';
    //        html += ' onmouseup="$(\'.bwOrganizationPicker\').bwOrganizationPicker(\'txtOrganizationPickerFilter_OnMouseup\', \'txtOrganizationPickerFilter\');">';
    //        html += '</input>';
    //        //html == '<input id="txtOrganizationPickerFilterSelectedLocationId" type="hidden" value="" />';


    //        html += '<br />';
    //        //html += '<div id="divLocationPickerDropDown" style="display:none;height:300px;width:400px;border:1px solid #066b8b;overflow-y:auto;background-color:white;position:absolute;z-index:10;">'; // Scrollable div wrapper for the treeview. // dark blue border. // position and z-index makes it show up on top and to not move the other elements around.
    //        //html += '</div>'; // Scrollable div wrapper for the treeview.

    //        html += '<div id="divLocationPickerDropDown" style="display:none;background-color:white;overflow-x:hidden;">'; // Scrollable div wrapper for the treeview. // dark blue border. // position and z-index makes it show up on top and to not move the other elements around.
    //        html += '</div>'; // Scrollable div wrapper for the treeview.

    //        //html += '<br />';
    //        html += '                                                           <span id="spanNewRequestFormLocationPickerBreadcrumb" style="cursor:pointer;color:purple;font-size:8pt;">[spanNewRequestFormLocationPickerBreadcrumb]</span>';


    //        html += '                            </td>';
    //        html += '                        </tr>';
    //        html += '                    </tbody>';
    //        html += '</table>';







    //        // Render the html.
    //        //if (this.options.inFormsEditor != true) {
    //        //    // THIS IS VERY IMPORTANT AND NEEDS TO BE IN EVERY WIDGET!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 7-12-2020
    //        //    // Even though the widget regenerates itself (re-renders), the parent TR tag gets missed!!! Therefore we have to handle getting rid of our form editor draggable attribute here.
    //        //    this.element.closest('tr').removeAttr('draggable');
    //        //}
    //        this.element.html(html);
    //        this.renderLocationPickerTreeview3();
    //        //debugger;




    //        //if (this.options.bwOrgId) { // only render if we have this value. This means this doesn't happen for a new request
    //        //    var formElement = this.element.closest("#budgetrequestform");
    //        //    $(formElement).find('#txtOrganizationPickerFilter')[0].setAttribute('bwOrgId', this.options.bwOrgId);
    //        //    $(formElement).find('#txtOrganizationPickerFilter').value = this.options.bwOrgName; // Set the textbox to the selected location Name. 
    //        //debugger;
    //        this.selectLocation(this.options.bwOrgId, this.options.bwOrgName);
    //        //}

    //    } catch (e) {
    //        console.log('Exception in renderLocationPicker_Visualizations: ' + e.message + ', ' + e.stack);
    //        var html = '';
    //        html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwOrganizationPickerxcx5</span>';
    //        html += '<br />';
    //        html += '<span style="">Exception in bwOrganizationPicker.renderLocationPicker_Visualizations(): ' + e.message + ', ' + e.stack + '</span>';
    //        thiz.element.html(html);
    //    }
    //},

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
            html += '                       <span style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwOrganizationPicker\').bwOrganizationPicker(\'collapseTree\', \'root\');">';
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
                    html += '                               <span style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwOrganizationPicker\').bwOrganizationPicker(\'expandTree\', \'' + d + '\');">';
                    html += '✚ ✣ Groups ✣  </span>';
                    html += '                           </td>';
                    html += '                       </tr>';
                } else {
                    html += '                       <tr>';
                    html += '                           <td>';
                    html += '                               <span style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwOrganizationPicker\').bwOrganizationPicker(\'collapseTree\', \'' + d + '\');">';
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
                            html += '                               <span style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwOrganizationPicker\').bwOrganizationPicker(\'expandTree\', \'' + d + '\', \'' + g + '\');">';
                            html += '✚ ⚖ Legal Entities ⚖  </span>';
                            html += '                                   </td>';
                            html += '                               </tr>';
                        } else {
                            html += '                               <tr>';
                            html += '                                   <td>';
                            html += '                               <span style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwOrganizationPicker\').bwOrganizationPicker(\'collapseTree\', \'' + d + '\', \'' + g + '\');">';
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
                                    html += '                               <span style="cursor:pointer;font-weight:bold;" title="Expand Locations" onclick="$(\'.bwOrganizationPicker\').bwOrganizationPicker(\'expandTree\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">';
                                    html += '✚ 🏠 Locations 🏠</span>';
                                    html += '                                       </td>';
                                    html += '                                   </tr>';
                                } else {
                                    html += '                                   <tr>';
                                    html += '                                       <td>';
                                    html += '                               <span style="cursor:pointer;font-weight:bold;" title="Collapse Locations" onclick="$(\'.bwOrganizationPicker\').bwOrganizationPicker(\'collapseTree\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">';
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
                                        html += '<span style="cursor:pointer;" title="Manage Roles..." onclick="$(\'#' + requestFormId + '\').find(\'.bwOrganizationPicker\').bwOrganizationPicker(\'selectLocation\', \'' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Id + '\', \'' + tmpName + '\');">';
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


            alert('xcx3423462');

            document.getElementById('divLocationPickerDropDown').innerHTML = html;

        } catch (e) {
            console.log('Exception in bwOrganizationPicker.js.renderLocationPickerTreeview1: ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwOrganizationPicker.js.renderLocationPickerTreeview1: ' + e.message + ', ' + e.stack);
        }
    },

    renderLocationPickerTreeview2: function (assignmentRowChanged_ElementId) {
        try {
            console.log('In renderLocationPickerTreeview2().');

            var thiz = this;
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




            //debugger; // changed 10-18-2020
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
            //if ($(this.element).closest('.ui-dialog-content')[0] && $(this.element).closest('.ui-dialog-content')[0].id) {
            //    requestFormId = $(this.element).closest('.ui-dialog-content')[0].id; // If it is in a dialog, this returns the dialog id.
            //} else {
            //if (!assignmentRowChanged_ElementId) {
            // It is not in a dialog, so it must be a new request.
            requestFormId = this.options.parentElementId; //'divPageContent1';
            //}
            //}



            var tmpName = String(json.Global.Name).replace(/[']/g, ''); // encodeURIComponent does not do apostrophe's, which we need here, because we are passing this as defined method calls in the code, preformulated.
            html += '                                   <span class="orgTreeNode2" xcx="xcx12314-10" style="cursor:pointer;" onclick="$(\'#' + requestFormId + '\').find(\'.bwOrganizationPicker\').bwOrganizationPicker(\'selectLocation\', \'root\', \'' + tmpName + '\');" >';
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
            html += '                               <span id="spanDivisionsTreeExpandCollapseButton" style="cursor:pointer;" onclick="$(\'.bwOrganizationPicker\').bwOrganizationPicker(\'collapseOrExpandTree\', \'\', \'spanDivisionsTreeExpandCollapseButton\', \'root\');">';
            //html += '                               ⚊ ';
            html += '                               <img title="collapse" style="cursor:pointer;width:23px;height:23px;vertical-align:middle;" src="images/drawer-close.png"> ';
            html += '                               </span>';
            html += '                               <span class="orgTreeNode2" xcx="xcx12314-11" style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'collapseTree\', \'\', \'' + '' + '\');" >';
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

                html += '<span id="spanDivisionTreeExpandCollapseButton_' + d + '" style="cursor:pointer;" onclick="$(\'.bwOrganizationPicker\').bwOrganizationPicker(\'collapseOrExpandTree\', \'\', \'spanDivisionTreeExpandCollapseButton_' + d + '\', \'' + d + '\');">';
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
                html += ' <span class="orgTreeNode2" xcx="xcx12314-12" style="cursor:pointer;" onclick="$(\'#' + requestFormId + '\').find(\'.bwOrganizationPicker\').bwOrganizationPicker(\'selectLocation\', \'' + json.Global.Divisions.Items[d].Id + '\', \'' + tmpName + '\');" >';


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
                    html += '                               <span id="spanGroupsTreeExpandCollapseButton_' + d + '" style="cursor:pointer;" onclick="$(\'.bwOrganizationPicker\').bwOrganizationPicker(\'collapseOrExpandTree\', \'groupsnode\', \'spanGroupsTreeExpandCollapseButton_' + d + '\', \'' + d + '\');">';
                    //html += '                               ⚊ ';
                    html += '<img title="collapse" style="cursor:pointer;width:23px;height:23px;vertical-align:middle;" src="images/drawer-close.png" />';
                    html += '                               </span>';
                    //html += '                               <span id="spanOrgX_' + d + '_' + 'GroupsNode' + '" class="orgTreeNode" style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'collapseTree\', \'\', \'' + d + '\');" onmouseout="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflowReset\', \'' + 'spanOrgX_' + d + '_' + 'GroupsNode' + '\', \'' + d + '\', \'' + 'GroupsNode' + '\');" onmouseover="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflow\', true, \'' + d + '\', \'' + 'GroupsNode' + '\');">';
                    html += '                               <span class="orgTreeNode2" xcx="xcx12314-13" style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'collapseTree\', \'\', \'' + d + '\');" >';

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
                        html += '                               <span id="spanGroupTreeExpandCollapseButton_' + d + '_' + g + '" style="cursor:pointer;" onclick="$(\'.bwOrganizationPicker\').bwOrganizationPicker(\'collapseOrExpandTree\', \'\', \'spanGroupTreeExpandCollapseButton_' + d + '_' + g + '\', \'' + d + '\', \'' + g + '\');">';
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
                        html += '                                   <span class="orgTreeNode2" xcx="xcx12314-14" style="cursor:pointer;" onclick="$(\'#' + requestFormId + '\').find(\'.bwOrganizationPicker\').bwOrganizationPicker(\'selectLocation\', \'' + json.Global.Divisions.Items[d].Groups.Items[g].Id + '\', \'' + tmpName + '\');" >';



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
                            html += '                                       <span id="spanLegalEntitiesTreeExpandCollapseButton_' + d + '_' + g + '" style="cursor:pointer;font-weight:bold;white-space:nowrap;" title="Collapse..." onclick="$(\'.bwOrganizationPicker\').bwOrganizationPicker(\'collapseOrExpandTree\', \'legalentitiesnode\', \'spanLegalEntitiesTreeExpandCollapseButton_' + d + '_' + g + '\', \'' + d + '\', \'' + g + '\');">';
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
                                html += '                               <span id="spanGroupsTreeExpandCollapseButton_' + d + '_' + g + '_' + e + '" style="cursor:pointer;" onclick="$(\'.bwOrganizationPicker\').bwOrganizationPicker(\'collapseOrExpandTree\', \'\', \'spanGroupsTreeExpandCollapseButton_' + d + '_' + g + '_' + e + '\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">';
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


                                // 
                                var tmpName = String(json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Name).replace(/[']/g, ''); // encodeURIComponent does not do apostrophe's, which we need here, because we are passing this as defined method calls in the code, preformulated.
                                html += '   <span class="orgTreeNode2" xcx="xcx12314-15" style="cursor:pointer;color:#29685F;white-space:nowrap;" onclick="$(\'#' + requestFormId + '\').find(\'.bwOrganizationPicker\').bwOrganizationPicker(\'selectLocation\', \'' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Id + '\', \'' + tmpName + '\');" >';




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
                                        html += '                                   <span class="orgTreeNode2" xcx="xcx12314-16" style="cursor:pointer;white-space:nowrap;" onclick="$(\'#' + requestFormId + '\').find(\'.bwOrganizationPicker\').bwOrganizationPicker(\'selectLocation\', \'' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Id + '\', \'' + tmpName + '\');">';




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


            //alert('xcx3253564-1xxxxxisithere');

            //if ($(this.options.requestForm)) {
            //    if ($(this.options.requestForm).find('#divLocationPickerDropDown') && $(this.options.requestForm).find('#divLocationPickerDropDown')[0]) {
            //        $(this.options.requestForm).find('#divLocationPickerDropDown')[0].innerHTML = html;
            //    } else {
            //        alert('Error in renderLocationPickerTreeview2(). NO FORM!!!!!!!!xcx2');
            //    }
            //} else {
            //    alert('Error in renderLocationPickerTreeview2(). NO FORM!!!!!!!!xcx1');
            //}



            //debugger;
            $(this.element).find("#divLocationPickerDropDown")[0].innerHTML = html;
            ////$(formElement).find('#divLocationPickerDropDown')[0].innerHTML = html;

            //
            // Render the custom Org images
            //
            var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

            for (var i = 0; i < orgsImageFetchingInformation.length; i++) {
                if (orgsImageFetchingInformation[i].bwOrgId) {
                    if (!workflowAppId) {
                        alert('ERROR xcx5554332');
                    }
                    var imagePath = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/orgimages/' + orgsImageFetchingInformation[i].bwOrgId + '/' + 'orgimage.png';


                    console.log('Added activeStateIdentifier to this image url xcx21312414');






                    var imagePath;


                    if (activeStateIdentifier.status != 'SUCCESS') {

                        imagePath = '[No image. Unauthorized. xcx213124-34556-34-234-3245-xx-9]';

                    } else {
                        if (!workflowAppId) {
                            alert('ERROR xcx5554311');
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
                                        html += '<img id="orgImage2_' + '' + '" style="width:30px;height:30px;vertical-align:middle;" src="' + imagePath + '" />';
                                        //This element might not exist!
                                        var parentElementId = thiz.options.parentElementId;
                                        //try {
                                        //    parentElementId = $(thiz.options.requestForm).closest('.ui-dialog-content')[0].id; // If it is in a dialog, this returns the dialog id.
                                        //} catch (e) { }
                                        //if (!parentElementId) {
                                        // It is not in a dialog, so it must be a new request.
                                        //parentElementId = 'divPageContent1';
                                        //}
                                        try {
                                            //debugger;
                                            //document.getElementById(orgsImageFetchingInformation[i].spanOrgId).innerHTML = html; //imagePath;
                                            $('#' + parentElementId).find('#' + orgsImageFetchingInformation[i].spanOrgId)[0].innerHTML = html; //imagePath;
                                            resolve();
                                        } catch (e) {
                                            // ACTUALLY WE SHOUDL BE LOADING THE ELEMENT HERE MAYBE? IT USED TO WORK! 2-5-2020
                                            //document.getElementById(orgsImageFetchingInformation[i].imageId).src = imagePath;
                                            $('#' + parentElementId).find('#' + orgsImageFetchingInformation[i].imageId)[0].src = imagePath;
                                            //console.log('Exception in bwOrganizationEditor.js.renderOrgRolesEditor(): span tag with id="' + orgsImageFetchingInformation[i].spanOrgId + '" does not exist! ' + e.message + ', ' + e.stack);
                                            resolve();
                                        }

                                    } catch (e) {
                                        console.log('Exception in bwOrganizationEditor.js.xx-2().img.onload(): ' + e.message + ', ' + e.stack);
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


        } catch (e) {
            //console.log('Exception in renderLocationPickerTreeview2: ' + e.message + ', ' + e.stack);
            console.log('Exception in renderLocationPickerTreeview2: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwOrganizationPickerxcx6</span>';
            html += '<br />';
            html += '<span style="">Exception in bwOrganizationPicker.renderLocationPickerTreeview2(): ' + e.message + ', ' + e.stack + '</span>';
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
            html += '                       <span style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwOrganizationPicker\').bwOrganizationPicker(\'collapseTree\', \'root\');">';
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
                    html += '                               <span style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwOrganizationPicker\').bwOrganizationPicker(\'expandTree\', \'' + d + '\');">';
                    html += '✚ ✣ Groups ✣  </span>';
                    html += '                           </td>';
                    html += '                       </tr>';
                } else {
                    html += '                       <tr>';
                    html += '                           <td>';
                    html += '                               <span style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwOrganizationPicker\').bwOrganizationPicker(\'collapseTree\', \'' + d + '\');">';
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
                            html += '                               <span style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwOrganizationPicker\').bwOrganizationPicker(\'expandTree\', \'' + d + '\', \'' + g + '\');">';
                            html += '✚ ⚖ Legal Entities ⚖  </span>';
                            html += '                                   </td>';
                            html += '                               </tr>';
                        } else {
                            html += '                               <tr>';
                            html += '                                   <td>';
                            html += '                               <span style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwOrganizationPicker\').bwOrganizationPicker(\'collapseTree\', \'' + d + '\', \'' + g + '\');">';
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
                                    html += '                               <span style="cursor:pointer;font-weight:bold;" title="Expand Locations" onclick="$(\'.bwOrganizationPicker\').bwOrganizationPicker(\'expandTree\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">';
                                    html += '✚ 🏠 Locations 🏠</span>';
                                    html += '                                       </td>';
                                    html += '                                   </tr>';
                                } else {
                                    html += '                                   <tr>';
                                    html += '                                       <td>';
                                    html += '                               <span style="cursor:pointer;font-weight:bold;" title="Collapse Locations" onclick="$(\'.bwOrganizationPicker\').bwOrganizationPicker(\'collapseTree\', \'' + d + '\', \'' + g + '\', \'' + e + '\');">';
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
                                        html += '<span style="cursor:pointer;" title="Manage Roles..." onclick="$(\'.bwTrackSpending\').find(\'.bwOrganizationPicker\').bwOrganizationPicker(\'selectLocation\', \'' + json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Id + '\', \'' + tmpName + '\');">';
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


            alert('xcx2547688-1');
            document.getElementById('divLocationPickerDropDown').innerHTML = html;

        } catch (e) {
            console.log('Exception in renderLocationPickerTreeview3: ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderLocationPickerTreeview3: ' + e.message + ', ' + e.stack);
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
            console.log('In bwOrganizationPicker.js.selectOrganizationalStructure_OnChange().');

            var selectedValue = document.getElementById('selectOrganizationalStructure').value;


            alert('In bwOrganizationPicker.js.selectOrganizationalStructure_OnChange(). selectedValue: ' + selectedValue);
        } catch (e) {
            console.log('Exception in bwOrganizationPicker.js.selectOrganizationalStructure_OnChange(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwOrganizationPicker.js.selectOrganizationalStructure_OnChange(): ' + e.message + ', ' + e.stack);
        }
    },
    selectLocation: function (bwOrgId, bwOrgName) {
        try {
            // The user has selected a location from the drop down in the Location textbox, or the code is calling this when displaying the request form.
            console.log('In bwOrganizationPicker.js.selectLocation(). bwOrgId: ' + bwOrgId + ' xcx1, bwOrgName: ' + bwOrgName);
            //alert('In bwOrganizationPicker.js.selectLocation(). bwOrgId: ' + bwOrgId + ' xcx1, bwOrgName: ' + bwOrgName);
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            var parentElementId = this.options.parentElementId; //'divPageContent1';

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
            //var bwBudgetRequestId;
            //if (this.options.requestForm) {
            //    if ($(this.options.requestForm) && $(this.options.requestForm)[0]) {
            //        bwBudgetRequestId = $(this.options.requestForm)[0].getAttribute('bwbudgetrequestid');
            //        $(this.options.requestForm).find('#txtOrganizationPickerFilter')[0].setAttribute('bwOrgId', bwOrgId);
            //        $(this.options.requestForm)[0].setAttribute('bworgid', bwOrgId);
            //        $(this.options.requestForm)[0].setAttribute('bworgname', bwOrgName);
            //    } else {
            //        console.log('');
            //        console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
            //        console.log('COULD THIS BE A BIG PROBLEM xcx 213854?');
            //        console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
            //        console.log('');
            //    }
            //}

            console.log('In bwOrganizationPicker.js.selectLocation(). bwOrgId: ' + bwOrgId + ' xcx2, bwOrgName: ' + bwOrgName);
            //debugger;





            //document.getElementById('txtOrganizationPickerFilterSelectedLocationId').value = locationId; // Set the textbox to the selected location Id.
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
                console.log('Caught exception in bwOrganizationPicker.selectLocation.dialog.close():xcx1: ' + e.message + ', ' + e.stack);
                //debugger;
                //var x = 'why are we here?';
            }


            //var renderTheOrgBreadcrumb2 = function (json, orgId) {

            //    var d1, g1, e1, l1;
            //    var orgName = '';

            //    console.log('');
            //    console.log('***************');
            //    console.log('In bwOrganizationPicker.js.selectLocation(). Another crazy fix here, come back sometime to revisit. xcx3245347-1');
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
            //        console.log('Error in bwOrganizationPicker.selectLocation(): Unexpected parameter in displayOrgRoleEditorInACircle():2:.');
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


            var orgPathClickable = $('.bwAuthentication').bwAuthentication('renderTheOrgBreadcrumb2', this.options.store, bwOrgId); // 10-5-2022  // 12-9-2021 var orgPathClickable = renderTheOrgBreadcrumb2(this.options.store.Global, bwOrgId);

            //$('.bwRequest').bwRequest('displayOrgImageForNewRequestForm', locationId, locationName, orgPathClickable);

            //
            // Try to get a custom image. If none found, use the OOB one.
            //
            //var imagePath2 = this.options.operationUriPrefix + '_files/' + workflowAppId + '/orgimages/' + bwOrgId + '/' + 'orgimage.png'; // thiz.options.store.OrgId


            var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });

            var imagePath2;

            var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

            if (activeStateIdentifier.status != 'SUCCESS') {

                imagePath2 = '[No image. Unauthorized. xcx213124-34556-34-234-3245-xx-55-33-6]';

            } else {
                if (!workflowAppId) {
                    alert('ERROR xcx5554399');
                }
                imagePath2 = this.options.operationUriPrefix + '_files/' + workflowAppId + '/orgimages/' + bwOrgId + '/' + 'orgimage.png?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;

            }




            console.log('Added activeStateIdentifier to this image url xcx21312414-2');


            $.get(imagePath2).done(function () {
                setTimeout(function () { // Only needs to happen for Chrome.
                    //var img = document.getElementById('imgRequestOrgImage');
                    //img.attr.src = imagePath2;
                    //var requestDialogId = elementId + '_' + thiz.options.bwBudgetRequestId; // elementId: divCreateRequestFormContent
                    //debugger;
                    //var requestDialogId = 'divCreateRequestFormContent_imgRequestOrgImage'; // + '_' + thiz.options.bwBudgetRequestId; // elementId: divCreateRequestFormContent

                    // 1-13-2022
                    //try {

                    if ($('#' + parentElementId).find('#divCreateRequestFormContent_imgRequestOrgImage')[0]) {
                        $('#' + parentElementId).find('#divCreateRequestFormContent_imgRequestOrgImage')[0].setAttribute('src', imagePath2); //.attr('src', imagePath2);
                    } else {
                        console.log('Error xcx234254-1. Could not find element #divCreateRequestFormContent_imgRequestOrgImage. Is this Ok?');
                    }
                    //} catch (e) { }




                }, 500);
            }).fail(function () {
                //alert("This org has no image."); // do nothing 
            });
            // End: Getting the custom image
            //

            // Display the breakcrumb.
            //debugger;


            //debugger; // changed below 10-18-2020
            //if (this.options.requestForm) {
            //    $('#' + parentElementId).find('#divCreateRequestFormContent_requestOrgClickableBreadcrumb')[0].innerHTML = orgPathClickable; // spanNewRequestFormLocationPickerBreadcrumb
            //    $('#' + parentElementId).find('#txtOrganizationPickerFilter')[0].value = bwOrgName; // Set the textbox to the selected location Name. 
            //    $(this.options.requestForm)[0].setAttribute('bwOrgName', bwOrgName);
            //    // Display the breadcrumb just below the picker.
            //    $('#' + parentElementId).find('#spanNewRequestFormLocationPickerBreadcrumb')[0].innerHTML = orgPathClickable;
            //} else {
            //    $(this.element).find('#txtOrganizationPickerFilter')[0].value = bwOrgName; // Set the textbox to the selected location Name. 
            //    $(this.element).find('#spanNewRequestFormLocationPickerBreadcrumb')[0].innerHTML = orgPathClickable;
            //}

            if (parentElementId == thiz.options.parentElementId) { //'divPageContent1') { // 3-3-2022

                $(this.element).find('#txtOrganizationPickerFilter')[0].value = bwOrgName; // Set the textbox to the selected location Name. 
                $(this.element).find('#spanNewRequestFormLocationPickerBreadcrumb')[0].innerHTML = orgPathClickable.orgPathClickable;

                // divCreateRequestFormContent_requestOrgClickableBreadcrumb

                var budgetrequestform = $(this.element).closest('#budgetrequestform')[0];

                if (budgetrequestform) {
                    $(budgetrequestform).find('#divCreateRequestFormContent_requestOrgClickableBreadcrumb')[0].innerHTML = orgPathClickable.orgPathClickable; // 1-13-2022 

                }



                //
                // Now we need to get the new resultset for the widget, for our newly selected location/org. 2-7-2022
                //
                console.log('');
                console.log('#############################################');
                console.log('Now we need to get the new resultset for the widget, for our newly selected location/org. 2-7-2022');
                console.log('#############################################');
                console.log('');







                //$('#spanBwBudgetRequests').bwDataGrid({ bwOrgId: bwOrgId, bwOrgName: bwOrgName }); // set these values in bwDataGrid, so it can read them there, and produce the resultset on screen.



                //
                // This is where we detect where this widget is placed. This determines how we filter our data. It is only meant, at the moment, to be used for bwDataGrid and bwTrackSpending, but is meant to be expanded upon in the future. 2-24-2022
                //
                var bwDataGrid = $(thiz.element).closest('.bwDataGrid')[0];
                var bwTrackSpending = $(thiz.element).closest('.bwTrackSpending')[0];
                //var bwParticipantsEditor = $(thiz.element).find('.bwParticipantsEditor')[0];
                if (bwDataGrid) {

                    thiz.options.bwOrgId = bwOrgId;
                    thiz.options.bwOrgName = bwOrgName;

                    console.log('In bwOrganizationPicker.js. Calling bwDataGrid.renderDetailedListOrExecutiveSummary(). COMMENTED OUT.');
                    //alert('In bwOrganizationPicker.js. Calling bwDataGrid.renderDetailedListOrExecutiveSummary(). COMMENTED OUT.');
                    $('.bwDataGrid').bwDataGrid('renderDetailedListOrExecutiveSummary');

                    ////alert('In bwOrganizationPicker.js.selectLocation(). Its bwDataGrid.');
                    //var divBwDataGrid_Content_Html = $(thiz.element).find('#divBwDataGrid_Content').html(); // If this is empty, it means the DataGrid has never been rendered... it is the first time here.
                    //if (((thiz.options.bwOrgId == bwOrgId) && (thiz.options.bwOrgName == bwOrgName)) && divBwDataGrid_Content_Html) { // If it hasn't been rendered, this allows it to get rendered the first time.
                    //    // It is the same, so do not re-render.
                    //    //alert('In bwOrganizationPicker.js.selectLocation(). Its bwDataGrid. It is the same, so do not re-render. bwOrgId: ' + bwOrgId);
                    //} else {
                    //    // The user has selected a different location/org, so re-render.
                    //    console.log('In bwOrganizationPicker.js.selectLocation(). bwOrgId: ' + bwOrgId + ', bwOrgName: ' + bwOrgName + ', and calling bwDataGrid.renderDataGrid().');
                    //    //alert('In bwOrganizationPicker.js.selectLocation(). A new location/org has been selected for the bwDataGrid widget.');
                    //    thiz.options.bwOrgId = bwOrgId;
                    //    thiz.options.bwOrgName = bwOrgName;


                    //    //alert('xcx12432534532');

                    //    //// 4-9-2022
                    //    //var bwDisplayFormat = localStorage.getItem('bwDisplayFormat');
                    //    //if (bwDisplayFormat == 'ExecutiveSummaries') {

                    //    //    //$(bwDataGrid).bwDataGrid('displayExecutiveSummaries');  // $(bwDataGrid).bwDataGrid('renderDataGrid');

                    //    //} else if (bwDisplayFormat == 'DetailedList') {

                    //    //    //$(bwDataGrid).bwDataGrid('displayDetailedList');  // $(bwDataGrid).bwDataGrid('renderDataGrid');

                    //    //} else {

                    //    //    console.log('In bwOrganizationPicker.js.selectLocation(). Unexpected value for bwDisplayFormat: ' + bwDisplayFormat);
                    //    //    //displayAlertDialog('In xx(). Unexpected value for bwDisplayFormat: ' + bwDisplayFormat);
                    //    //    //$(bwDataGrid).bwDataGrid('displayExecutiveSummaries');

                    //    //}








                    //}

                } else if (bwTrackSpending) {

                    //alert('In bwOrganizationPicker.js.selectLocation(). Its bwTrackSpending.');
                    //var divBwDataGrid_Content_Html = $(thiz.element).find('#divBwDataGrid_Content').html(); // If this is empty, it means the DataGrid has never been rendered... it is the first time here.
                    if ((thiz.options.bwOrgId == bwOrgId) && (thiz.options.bwOrgName == bwOrgName)) {
                        // It is the same, so do not re-render.
                    } else {
                        // The user has selected a different location/org, so re-render.
                        console.log('In bwOrganizationPicker.js.selectLocation(). bwOrgId: ' + bwOrgId + ', bwOrgName: ' + bwOrgName + ', and calling bwTrackSpending.renderTrackSpending().');
                        //alert('In bwOrganizationPicker.js.selectLocation(). A new location/org has been selected for the bwTrackSpending widget.');
                        thiz.options.bwOrgId = bwOrgId;
                        thiz.options.bwOrgName = bwOrgName;
                        $(bwTrackSpending).bwTrackSpending('createPieChart');
                    }

                    //} //else if (bwParticipantsEditor) {

                    //alert('In bwOrganizationPicker.js.selectLocation(). Its bwTrackSpending.');
                    //var divBwDataGrid_Content_Html = $(thiz.element).find('#divBwDataGrid_Content').html(); // If this is empty, it means the DataGrid has never been rendered... it is the first time here.
                    //if ((thiz.options.bwOrgId == bwOrgId) && (thiz.options.bwOrgName == bwOrgName)) {
                    //    // It is the same, so do not re-render.
                    //} else {
                    //    // The user has selected a different location/org, so re-render.
                    //    console.log('In bwOrganizationPicker.js.selectLocation(). bwOrgId: ' + bwOrgId + ', bwOrgName: ' + bwOrgName + ', and calling bwTrackSpending.renderTrackSpending().');
                    //    //alert('In bwOrganizationPicker.js.selectLocation(). A new location/org has been selected for the bwTrackSpending widget.');
                    //    thiz.options.bwOrgId = bwOrgId;
                    //    thiz.options.bwOrgName = bwOrgName;
                    //    $(bwTrackSpending).bwTrackSpending('createPieChart');
                    //}

                } else {

                    thiz.options.bwOrgId = bwOrgId;
                    thiz.options.bwOrgName = bwOrgName;

                    // divParticipantOrgRolePickerDialog
                    var participantOrgRolePickerDialog_OrgPicker = $('#divParticipantOrgRolePickerDialog_OrgPicker'); //.find('.bwOrganizationPicker')[0];   // bwOrganizationPicker
                    if (participantOrgRolePickerDialog_OrgPicker) {
                        //alert('xcxw53452353 participantOrgRolePickerDialog_OrgPicker');
                        $('.bwParticipantsEditor').bwParticipantsEditor('orgPicker_OnChange'); // This gives the bwParticipantsEditor to change it's display to reflect the newly chosen org/location.
                    }

                    console.log('Error in bwOrganizationPicker.js.selectLocation(). Could not locate widgets bwDataGrid, bwTrackSpending.');
                    //displayAlertDialog('Error in bwOrganizationPicker.js.selectLocation(). Could not locate widgets bwDataGrid, bwTrackSpending, or bwParticipantsEditor.');

                }















                //
                // Try to get a custom image. If none found, use the OOB one.
                //
                //var imagePath2 = this.options.operationUriPrefix + '_files/' + workflowAppId + '/orgimages/' + bwOrgId + '/' + 'orgimage.png'; // thiz.options.store.OrgId


                var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });

                var imagePath2;

                var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

                if (activeStateIdentifier.status != 'SUCCESS') {

                    imagePath2 = '[No image. Unauthorized. xcx213124-34556-34-234-3245-xx-55-33]';

                } else {
                    if (!workflowAppId) {
                        alert('ERROR xcx555434556');
                    }
                    imagePath2 = this.options.operationUriPrefix + '_files/' + workflowAppId + '/orgimages/' + bwOrgId + '/' + 'orgimage.png?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;

                }


                console.log('Check if this image url has a null workflowAppID xcx21312414 imagePath2: ' + imagePath2);



                $.get(imagePath2).done(function () {
                    setTimeout(function () { // Only needs to happen for Chrome.
                        //var img = document.getElementById('imgRequestOrgImage');
                        //img.attr.src = imagePath2;
                        //var requestDialogId = elementId + '_' + thiz.options.bwBudgetRequestId; // elementId: divCreateRequestFormContent
                        //debugger;
                        //var requestDialogId = 'divCreateRequestFormContent_imgRequestOrgImage'; // + '_' + thiz.options.bwBudgetRequestId; // elementId: divCreateRequestFormContent

                        // 1-13-2022
                        //try {

                        console.log('');
                        console.log('00000000000000000000000000000000');
                        console.log('In bwOrganizationPicker.js.selectLocation.get.imagePath2.done(). imagePath2: ' + imagePath2);
                        console.log('00000000000000000000000000000000');
                        console.log('');


                        if ($(budgetrequestform).find('#divCreateRequestFormContent_imgRequestOrgImage')[0]) {
                            $(budgetrequestform).find('#divCreateRequestFormContent_imgRequestOrgImage')[0].setAttribute('src', imagePath2);
                        } else {
                            console.log('Error xcx234254-2. Could not find element #divCreateRequestFormContent_imgRequestOrgImage. Is this Ok?');
                        }

                        // $('.bwCircleDialog').bwCircleDialog('displayOrgRoleEditorInACircle', true, 'root');

                        //orgPathClickable: orgPathClickable,
                        //divisionIndex: divisionIndex,
                        //groupIndex: groupIndex,
                        //entityIndex: entityIndex,
                        //locationIndex: locationIndex




                        if ($(budgetrequestform).find('#divCreateRequestFormContent_imgRequestOrgImage')[0]) {
                            $(budgetrequestform).find('#divCreateRequestFormContent_imgRequestOrgImage')[0].setAttribute('onclick', '$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayOrgRoleEditorInACircle\', true, \'' + orgPathClickable.divisionIndex + '\', \'' + orgPathClickable.groupIndex + '\', \'' + orgPathClickable.entityIndex + '\', \'' + orgPathClickable.locationIndex + '\');');
                        } else {
                            console.log('Error xcx234254-3. Could not find element #divCreateRequestFormContent_imgRequestOrgImage. Is this Ok?');
                        }





                        //$('#' + parentElementId).find('#divCreateRequestFormContent_imgRequestOrgImage')[0].setAttribute('src', imagePath2); // divCreateRequestFormContent_imgRequestOrgImage
                        //} catch (e) { }




                    }, 500);
                }).fail(function () {
                    //alert("This org has no image."); // do nothing 
                    console.log('');
                    console.log('00000000000000000000000000000000');
                    console.log('In bwOrganizationPicker.js.selectLocation.get.imagePath2.fail(). imagePath2: ' + imagePath2);
                    console.log('00000000000000000000000000000000');
                    console.log('');
                });
                // End: Getting the custom image
                //








            } else {

                alert('Error in bwOrganizationPicker.js.selectLocation(). Unexpected value for parentElementId: ' + parentElementId);

                $('#' + parentElementId).find('#divCreateRequestFormContent_requestOrgClickableBreadcrumb')[0].innerHTML = orgPathClickable.orgPathClickable; // spanNewRequestFormLocationPickerBreadcrumb
                $('#' + parentElementId).find('#txtOrganizationPickerFilter')[0].value = bwOrgName; // Set the textbox to the selected location Name. 
                $(this.options.requestForm)[0].setAttribute('bwOrgName', bwOrgName);
                // Display the breadcrumb just below the picker.
                $('#' + parentElementId).find('#spanNewRequestFormLocationPickerBreadcrumb')[0].innerHTML = orgPathClickable.orgPathClickable;
            }







            //
            // This is where we check if the workflow dialog is displayed. If so, update the thing to correspond to this org id.
            //
            //console.log('In bwOrganizationPicker.selectLocation(). This is where we check if the workflow dialog is displayed. If so, update the thing to correspond to this org id.');
            //var bwBudgetRequestId = $(formElement).find('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
            //var requestDialogParentId = 'divNewRequestWorkflowParticipantsDialog_' + bwBudgetRequestId + '_Parent';
            //if ($('#' + requestDialogParentId).is(':visible')) {
            //    //var xx = document.getElementById(requestDialogParentId); //.offsetHeight;
            //    //debugger;
            //    //if (xx != null && xx.offsetHeight > 0) {
            //    //var bwWorkflowId = document.getElementById(requestDialogParentId + '_spanWorkflowGuidAndRequestTypeForTesting2').getAttribute('bwworkflowid'); //.innerHTML;
            //    //var bwWorkflowId = document.getElementById('budgetrequestform').getAttribute('bwworkflowid');

            //    debugger;
            //    //var formElement = this.element.closest("#budgetrequestform");
            //    //var bwBudgetRequestId = $(formElement)[0].getAttribute('bwbudgetrequestid');
            //    var requestDialogId = 'divRequestFormDialog_' + bwBudgetRequestId;

            //    //$('.bwRequest').bwRequest('renderNewRequestWorkflowParticipants', requestDialogParentId, bwWorkflowId);
            //    $('.bwRequest').bwRequest('displayNewRequestWorkflowParticipantsDialog', requestDialogId);



            //}

            //if (this.options.inVisualizations == true) {

            //    //alert('Need to redraw chart.xcx1');
            //    console.log('In bwOrganizationPicker.selectLocation(). Need to redraw chart.xcx1');

            //}


        } catch (e) {
            try {
                thiz.options.pickerDialog.dialog('close'); // 7-13-2020 THIS closes all of them that are open. Ok for now! and maybe the preferred way!!
            } catch (e) {
                //console.log('Exception in bwOrganizationPicker.selectLocation.dialog.close():xcx1: ' + e.message + ', ' + e.stack);
                ////debugger;
                //var x = 'why are we here?';
            }

            console.log('Exception in bwOrganizationPicker.js.selectLocation(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwOrganizationPicker.js.selectLocation(): ' + e.message + ', ' + e.stack);
        }
    },
    txtOrganizationPickerFilter_OnKeyup: function (elementId) {
        try {
            console.log('In bwOrganizationPicker.js.txtOrganizationPickerFilter_OnKeyup(). elementId: ' + elementId);
            //var formElement = this.element.closest("#budgetrequestform");
            //if (formElement) {
            //if ($(formElement).find('#divLocationPickerDropDown')[0].style.display == 'none') {
            if ($(this.element).find("#divLocationPickerDropDown")[0].style.display == 'none') {
                //// When displaying the location picker, make it size itself a bit wider than the user entry textbox.
                //var width1 = document.getElementById('txtOrganizationPickerFilter').style.width;
                //var width2 = width1.split('px')[0];
                //var width3 = Number(width2) + 50;
                //var width = width3 + 'px';
                //$(formElement).find('#divLocationPickerDropDown')[0].style.width = width;
                //$(formElement).find('#divLocationPickerDropDown')[0].style.display = 'block';





                this.txtOrganizationPickerFilter_OnMouseup();












            }
            //} else {
            //    // Must be on Visualizations
            //    if ($('.bwTrackSpending').find('#divLocationPickerDropDown')[0].style.display == 'none') {
            //        // When displaying the location picker, make it size itself a bit wider than the user entry textbox.
            //        var width1 = document.getElementById('txtOrganizationPickerFilter').style.width;
            //        var width2 = width1.split('px')[0];
            //        var width3 = Number(width2) + 50;
            //        var width = width3 + 'px';
            //        $('.bwTrackSpending').find('#divLocationPickerDropDown')[0].style.width = width;
            //        $('.bwTrackSpending').find('#divLocationPickerDropDown')[0].style.display = 'block';
            //    }
            //}
        } catch (e) {
            console.log('Exception in txtOrganizationPickerFilter_OnKeyup(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in txtOrganizationPickerFilter_OnKeyup(): ' + e.message + ', ' + e.stack);
        }
    },
    txtOrganizationPickerFilter_OnMouseup: function () {
        try {
            //debugger;
            console.log('In bwOrganizationPicker.js.txtOrganizationPickerFilter_OnMouseup().');
            var thiz = this;
            // When the user is done selecting a location, hide the location picker drop down.
            var parentElementId = this.options.parentElementId; //'divPageContent1';
            //try {
            //    parentElementId = $(this.element).closest('#budgetrequestform').closest('.ui-dialog-content')[0].id; // If it is in a dialog, this returns the dialog id.
            //} catch (e) { }
            //if (!parentElementId) {
            //    // It is not in a dialog, so it must be a new request.
            //    parentElementId = 'divCreateRequestFormContent';
            //}



            //var formElement = $(this.element).closest("#budgetrequestform");
            //debugger;
            try {
                var dialogId = $('#' + parentElementId).closest('.ui-dialog')[0].id;
                console.log('In txtOrganizationPickerFilter_OnMouseup(). dialogId: ' + dialogId);
            } catch (e) {
                // This fails on the new request form. Fix someday or maybe not...
            }
            //if ($(formElement).find('#divLocationPickerDropDown')[0].style.display == 'none') {




            //(!elem.getClientRects().length || !elem.getBoundingClientRect().width) ?
            //              swap(elem, cssShow, function () {
            //                  return getWidthOrHeight(elem, dimension, extra);
            //              }) :
            //              getWidthOrHeight(elem, dimension, extra);


            // When displaying the location picker, make it size itself a bit wider than the user entry textbox.
            //var width1;
            //if ($('#' + parentElementId).find('#txtOrganizationPickerFilter')[0]) {
            //    //width1 = $('#' + parentElementId).find('#txtOrganizationPickerFilter')[0].style.width;
            //    width1 = $('#' + parentElementId).find('#txtOrganizationPickerFilter')[0].getBoundingClientRect().width;
            //} else {
            //    //width1 = $(this.element).find('#txtOrganizationPickerFilter')[0].style.width;
            //    width1 = $(this.element).find('#txtOrganizationPickerFilter')[0].getBoundingClientRect().width;
            //}

            var width2 = document.getElementById('txtOrganizationPickerFilter').getBoundingClientRect().width;


            //alert('xcx24234: ' + JSON.stringify(width1));

            //debugger;
            //var width2 = width1.split('px')[0];
            var width3 = Number(width2) + 150;
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
                    of: $(thiz.element).find('#txtOrganizationPickerFilter') // $('#' + parentElementId).find('#txtOrganizationPickerFilter') //"#txtOrganizationPickerFilter"
                },
                modal: true,
                resizable: false,
                closeText: "Cancel",
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                height: 800,
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
            console.log('Exception in txtOrganizationPickerFilter_OnMouseup(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in txtOrganizationPickerFilter_OnMouseup(): ' + e.message + ', ' + e.stack);
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