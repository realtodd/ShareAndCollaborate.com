$.widget("bw.bwRequestTypeDropDown_NewTenant", {
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
        This is the bwRequestTypeDropDown_NewTenant.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        fieldTitle: '', // This is the title, which shows up on the form in the left column.

        dropdownChangeEventJavascript: null,

        requestTypes: null,

        //renderWithNoLabel: null, // This is where we just want to display the drop down without the label.
        instantiated: false, // This si so we can check if the thing is all populated and ready to go.

        inVisualizations: null, // This is when in the Visualizations section.

        displayRequestTypesAsSingletons: null, // eg: "Budget Request" vs "budget Requests". The singleton only gets used for a "New Request". 7-8-2020 NOT IMPLEMENTED YET!

        operationUriPrefix: null,
        ajaxTimeout: 15000,
        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function () {
        //debugger;
        this.element.addClass("bwRequestTypeDropDown_NewTenant");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {
            
            selfDiscoverOperationUri(thiz); // This sets this.options.operationUriPrefix correctly.
            
            //if (this.options.inVisualizations == true) {

            //    this.renderRequestTypeDropDown_Visualizations();

            //} else {
            //    this.renderRequestTypeDropDown();
            //}

            // 
            // Load this object first so we don't have to keep making web service calls.
            //
            if (this.options.requestTypes != null) {
                //this.renderRequestTypeEditor();
            } else {
                $.ajax({
                    url: this.options.operationUriPrefix + "_bw/Admin/RequestTypes_NewTenant", // + "/true", //
                    dataType: "json",
                    contentType: "application/json",
                    type: "Get",
                    timeout: this.options.ajaxTimeout
                }).done(function (result) {
                    try {
                        if (result.message != 'SUCCESS') {
                            var html = '';
                            html += '<span style="font-size:24pt;color:red;">bwRequestTypeDropDown_NewTenant: CANNOT RENDER</span>';
                            html += '<br />';
                            html += '<span style="">Error in bwRequestTypeDropDown_NewTenant.Create(): ' + result.message + '</span>';
                            thiz.element.html(html);
                        } else {
                            debugger;
                            thiz.options.requestTypes = result.RequestTypes;
                            thiz.renderRequestTypeDropDown();
                        }
                    } catch (e) {
                        console.log('Exception in bwRequestTypeDropDown_NewTenant._create().xx.Get:1: ' + e.message + ', ' + e.stack);
                    }

                }).fail(function (data) {
                    //lpSpinner.Hide();
                    debugger;
                    console.log('In bwRequestTypeEditor_NewTenant._create.RequestTypes.fail(): ' + JSON.stringify(data));
                    var msg;
                    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                    } else {
                        msg = JSON.stringify(data);
                    }
                    alert('Exception in bwRequestTypeEditor_NewTenant._create().xx.Get:2: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                    console.log('Exception in bwRequestTypeEditor_NewTenant._create().xx.Get:2: ' + JSON.stringify(data));
                    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                    //var error = JSON.parse(data.responseText)["odata.error"];
                    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                });
            }

            console.log('In bwRequestTypeDropDown_NewTenant._create(). The drop down has been initialized.');
            this.options.instantiated = true; // This is so we can check if the thing is instantiated yet.

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwWorkflowPicker: CANNOT RENDER THE request type drop down</span>';
            html += '<br />';
            html += '<span style="">Exception in bwRequestTypeDropDown_NewTenant.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwRequestTypeDropDown_NewTenant")
            .text("");
    },
    getData: function () {
        try {
            console.log('In bwRequestTypeDropDown_NewTenant.getData().');
            //return 'This getData method is incomplete.';
            return null;
        } catch (e) {
            console.log('Exception in bwRequestTypeDropDown_NewTenant.getData(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwRequestTypeDropDown_NewTenant.getData(): ' + e.message + ', ' + e.stack);
        }
    },
    instantiated: function () {
        try {
            console.log('In bwRequestTypeDropDown_NewTenant.instantiated().');
            return this.options.instantiated;
        } catch (e) {
            console.log('Exception in bwRequestTypeDropDown_NewTenant.instantiated(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwRequestTypeDropDown_NewTenant.instantiated(): ' + e.message + ', ' + e.stack);
        }
    },
    isARequiredField: function () {
        try {
            console.log('In bwRequestTypeDropDown_NewTenant.isARequiredField().');
            return this.options.renderAsARequiredField;
        } catch (e) {
            console.log('Exception in bwRequestTypeDropDown_NewTenant.isARequiredField(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwRequestTypeDropDown_NewTenant.isARequiredField(): ' + e.message + ', ' + e.stack);
        }
    },
    getfieldTitle: function () {
        try {
            console.log('In bwRequestTypeDropDown_NewTenant.getfieldTitle().');
            return this.options.fieldTitle;
        } catch (e) {
            console.log('Exception in bwRequestTypeDropDown_NewTenant.getfieldTitle(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwRequestTypeDropDown_NewTenant.getfieldTitle(): ' + e.message + ', ' + e.stack);
        }
    },
    renderRequestTypeDropDown: function () {
        try {
            console.log('In renderRequestTypeDropDown().');
            var thiz = this;
            var html = '';
            debugger;
            //var requestTypes = bwEnabledRequestTypes.EnabledItems; // Global, populated in the beginning when the app loads.

            if (thiz.options.requestTypes.length == 1) { // If there is only one, don't display as a drop down, just as plain text.
                html += '<span style="font_weight:bold;color:grey;">Active form for: </span>';
            } else { // There is more than 1, so we have to display as a drop down.
                html += '<span style="font_weight:bold;color:grey;">Active form for: ';
                html += '</span>';
            }

            // Render the drop down at the top of the page, and select the last used option!
            var bwLastSelectedNewRequestType = 'budgetrequest';
            if (thiz.options.requestTypes.length == 1) { // If there is only one, don't display as a drop down, just as plain text.
                html += '<span style="font_weight:bold;color:grey;"><strong>' + thiz.options.requestTypes[0].RequestType + '</strong></span>';
            } else { // There is more than 1, so we have to display as a drop down.
                html += '<span style="font_weight:bold;color:grey;"><strong>';
                html += '   <select id="selectRequestTypeDropDown" onchange="' + this.options.dropdownChangeEventJavascript + '" style=\'display:inline;border-color: whitesmoke; color: grey; font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 14pt; font-weight: bold; cursor: pointer;\'>'; // was .5em
                //html += '<option value="' + 'all' + '" selected >' + 'All request types' + '</option>';
                //debugger; // 7-8-2020
                for (var i = 0; i < thiz.options.requestTypes.length; i++) {
                    var selected = '';
                    if (thiz.options.requestTypes[i].RequestType == bwLastSelectedNewRequestType) { // Selected
                        selected = 'selected';
                    }
                    var requestType = thiz.options.requestTypes[i].RequestType;
                    if (thiz.options.displayRequestTypesAsSingletons == true) { // Display without the 's' at the end! Only for New Requests I think.
                        var yy = requestType.length;
                        var begin = yy - 1;
                        var end = yy;
                        if (requestType.substring(begin, end) == 's') {
                            requestType = requestType.substring(0, begin);
                        }
                    }
                    debugger;
                    html += '<option value="' + thiz.options.requestTypes[i].bwRequestTypeId + '" ' + selected + ' >' + requestType + '</option>';
                }
                html += '   </select>';
                html += '</span>';
            }

            // Render the html.
            this.element.html(html);

        } catch (e) {
            console.log('Exception in renderRequestTypeDropDown: ' + e.message + ', ' + e.stack);
        }
    },

    renderRequestTypeDropDown_Visualizations: function () {
        try {
            console.log('In renderRequestTypeDropDown_Visualizations().');
            var thiz = this;
            var html = '';
            //debugger;
            var requestTypes = bwEnabledRequestTypes.EnabledItems; // Global, populated in the beginning when the app loads.

            //if (requestTypes.length == 1) { // If there is only one, don't display as a drop down, just as plain text.
                //html += '<span style="font_weight:bold;color:grey;">Request type: </span>';
            //} else { // There is more than 1, so we have to display as a drop down.
            //    html += '<span style="font_weight:bold;color:grey;">Active form for: ';
            //    html += '</span>';
            //}



            html += '<table style="width:100%;">';
            html += '                        <tbody><tr class="xdTableOffsetRow" id="toolboxdraggablerow_254g" bwwidgetname="bwPillarTypeDropDown">';
            html += '                            <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
            html += '                                <span class="xdlabel">';
            html += '                                    Request Type:';
            html += '                                </span>';

            html += '                            </td>';
            html += '                            <td class="xdTableOffsetCellComponent" style="white-space:nowrap;text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">';








            // Render the drop down at the top of the page, and select the last used option!
            var bwLastSelectedNewRequestType = 'budgetrequest';
            if (requestTypes.length == 1) { // If there is only one, don't display as a drop down, just as plain text.
                html += '<span style="font_weight:bold;"><strong>' + requestTypes[0][1] + '</strong></span>';
            } else { // There is more than 1, so we have to display as a drop down.
                html += '<span style="font_weight:bold;"><strong>';
                html += '   <select id="selectRequestTypeDropDown" onchange="' + this.options.dropdownChangeEventJavascript + '" style=\'display:inline;border-color: whitesmoke; font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 14pt; font-weight: bold; cursor: pointer;\'>'; // was .5em
                html += '       <option value="' + 'all' + '" selected >' + 'All request types' + '</option>';
                //debugger; // 7-8-2020
                for (var i = 0; i < requestTypes.length; i++) {
                    var selected = '';
                    //if (requestTypes[i][0] == bwLastSelectedNewRequestType) { // Selected
                    //    selected = 'selected';
                    //}
                    var requestType = requestTypes[i][1];
                    if (thiz.options.displayRequestTypesAsSingletons == true) { // Display without the 's' at the end! Only for New Requests I think.
                        var yy = requestType.length;
                        var begin = yy - 1;
                        var end = yy;
                        if (requestType.substring(begin, end) == 's') {
                            requestType = requestType.substring(0, begin);
                        }
                    } 
                    html += '<option value="' + requestTypes[i][0] + '" ' + selected + ' >' + requestType + '</option>';
                }
                html += '   </select>';
                html += '</span>';
            }




            html += '                            </td>';
            html += '                        </tr>';
            html += '                    </tbody>';
            html += '</table>';


            // Render the html.
            this.element.html(html);

        } catch (e) {
            console.log('Exception in renderRequestTypeDropDown_Visualizations: ' + e.message + ', ' + e.stack);
        }
    }

});