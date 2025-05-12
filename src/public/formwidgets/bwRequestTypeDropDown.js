$.widget("bw.bwRequestTypeDropDown", {
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
        This is the bwRequestTypeDropDown.js jQuery Widget. 
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
        this.element.addClass("bwRequestTypeDropDown");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {
            if (this.options.operationUriPrefix == null) {
                // This formulates the operationUri, which is used throughout.
                var url1 = window.location.href.split('https://')[1];
                var url2 = url1.split('/')[0];
                this.options.operationUriPrefix = 'https://' + url2 + '/';
            }
            
            if (this.options.inVisualizations == true) {

                this.renderRequestTypeDropDown_Visualizations();

            } else {
                this.renderRequestTypeDropDown();
            }

            console.log('In bwRequestTypeDropDown._create(). The drop down has been initialized.');
            this.options.instantiated = true; // This is so we can check if the thing is instantiated yet.

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwWorkflowPicker: CANNOT RENDER THE request type drop down</span>';
            html += '<br />';
            html += '<span style="">Exception in bwRequestTypeDropDown.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwRequestTypeDropDown")
            .text("");
    },
    getData: function () {
        try {
            console.log('In bwRequestTypeDropDown.getData().');
            //return 'This getData method is incomplete.';
            return null;
        } catch (e) {
            console.log('Exception in bwRequestTypeDropDown.getData(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwRequestTypeDropDown.getData(): ' + e.message + ', ' + e.stack);
        }
    },
    instantiated: function () {
        try {
            console.log('In bwRequestTypeDropDown.instantiated().');
            return this.options.instantiated;
        } catch (e) {
            console.log('Exception in bwRequestTypeDropDown.instantiated(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwRequestTypeDropDown.instantiated(): ' + e.message + ', ' + e.stack);
        }
    },
    isARequiredField: function () {
        try {
            console.log('In bwRequestTypeDropDown.isARequiredField().');
            return this.options.renderAsARequiredField;
        } catch (e) {
            console.log('Exception in bwRequestTypeDropDown.isARequiredField(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwRequestTypeDropDown.isARequiredField(): ' + e.message + ', ' + e.stack);
        }
    },
    getfieldTitle: function () {
        try {
            console.log('In bwRequestTypeDropDown.getfieldTitle().');
            return this.options.fieldTitle;
        } catch (e) {
            console.log('Exception in bwRequestTypeDropDown.getfieldTitle(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwRequestTypeDropDown.getfieldTitle(): ' + e.message + ', ' + e.stack);
        }
    },
    renderRequestTypeDropDown: function () {
        try {
            console.log('In renderRequestTypeDropDown().');
            var thiz = this;
            var html = '';
            debugger;

            var bwEnabledRequestTypes = $('.bwAuthentication').bwAuthentication('option', 'bwEnabledRequestTypes');
            var requestTypes = bwEnabledRequestTypes.EnabledItems; // Global, populated in the beginning when the app loads.

            if (requestTypes.length == 1) { // If there is only one, don't display as a drop down, just as plain text.
                html += '<span style="font_weight:bold;color:grey;">Active form for: </span>';
            } else { // There is more than 1, so we have to display as a drop down.
                html += '<span style="font_weight:bold;color:grey;">Select Request Type: </span>';
            }

            // Render the drop down at the top of the page, and select the last used option!
            //var bwLastSelectedNewRequestType; // = 'budgetrequest';
            if (requestTypes.length == 1) { // If there is only one, don't display as a drop down, just as plain text.
                html += '<span style="font_weight:bold;color:grey;"><strong>' + requestTypes[0].RequestType + '</strong></span>';
            } else { // There is more than 1, so we have to display as a drop down.
                html += '<span style="font_weight:bold;color:grey;"><strong>';
                html += '   <select id="selectRequestTypeDropDown" onchange="' + this.options.dropdownChangeEventJavascript + '" style=\'display:inline;border-color: whitesmoke; color: grey; font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 14pt; font-weight: bold; cursor: pointer;\'>'; // was .5em
                //html += '<option value="' + 'all' + '" selected >' + 'All request types' + '</option>';
                //debugger; // 7-8-2020
                for (var i = 0; i < requestTypes.length; i++) {
                    var selected = '';
                    //if (requestTypes[i].Abbreviation == bwLastSelectedNewRequestType) { // Selected
                    //    selected = 'selected';
                    //}
                    //var requestType = requestTypes[i].RequestType;
                    //if (thiz.options.displayRequestTypesAsSingletons == true) { // Display without the 's' at the end! Only for New Requests I think.
                    //    var yy = requestType.length;
                    //    var begin = yy - 1;
                    //    var end = yy;
                    //    if (requestType.substring(begin, end) == 's') {
                    //        requestType = requestType.substring(0, begin);
                    //    }
                    //} 
                    html += '<option value="' + requestTypes[i].bwRequestTypeId + '" ' + selected + ' >' + requestTypes[i].SingletonName + '</option>';
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

            var bwEnabledRequestTypes = $('.bwAuthentication').bwAuthentication('option', 'bwEnabledRequestTypes');


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
            //var bwLastSelectedNewRequestType = 'budgetrequest';
            if (requestTypes.length == 1) { // If there is only one, don't display as a drop down, just as plain text.
                html += '<span style="font_weight:bold;"><strong>' + requestTypes[0].RequestType + '</strong></span>';
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
                    //var requestType = requestTypes[i][1];
                    //if (thiz.options.displayRequestTypesAsSingletons == true) { // Display without the 's' at the end! Only for New Requests I think.
                    //    var yy = requestType.length;
                    //    var begin = yy - 1;
                    //    var end = yy;
                    //    if (requestType.substring(begin, end) == 's') {
                    //        requestType = requestType.substring(0, begin);
                    //    }
                    //} 
                    html += '<option value="' + requestTypes[i].Abbreviation + '" ' + selected + ' >' + requestTypes[i].RequestType + '</option>';
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