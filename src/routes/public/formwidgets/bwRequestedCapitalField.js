﻿$.widget("bw.bwRequestedCapitalField", {
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
        This is the bwRequestedCapitalField.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        fieldTitle: 'Requested Capital', // This is the title, which shows up on the form in the left column.

        jsonData: null,

        allowRequestModifications: false,
        renderAsARequiredField: null, // If this is true, then just display the red asterisk.

        inFormsEditor: null, // This is when forms are being designed. This prevents the widget from hitting the database (going asynchronous) when this is true. If that happens, a race condition may occur and addition to the toolbox may partially fail.

        requestDialogId: null, // This is the unique id of the request dialog being displayed. We prepend this to id's in order to make sure we can display many dialogs at one time on screen and make them unique in the dom.

        bwTenantId: null,
        bwWorkflowAppId: null,

        operationUriPrefix: null,
        ajaxTimeout: 15000,
        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function () {
        this.element.addClass("bwRequestedCapitalField");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {

            selfDiscoverOperationUri(thiz); // This sets this.options.operationUriPrefix correctly.

            if (this.options.inFormsEditor == true) {
                //this.options.store = {}; // Need to provide this because if it tries to hit the database and poopulate, it won't render in time to be used in the toolbox!!!! 6-28-2020
                this.renderAndPopulateRequestedCapitalField_ReadOnly(); // Need to render, not allowing the user to make modifications.
            } else if (this.options.allowRequestModifications == false) {
                this.renderAndPopulateRequestedCapitalField_ReadOnly(); // Need to render, not allowing the user to make modifications.
            } else if (this.options.allowRequestModifications == true) {
                this.renderAndPopulateRequestedCapitalField();
            } else {
                var html = '';
                html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwRequestedCapitalField</span>';
                html += '<br />';
                html += '<span style="">Invalid value for allowRequestModifications: ' + this.options.allowRequestModifications + '</span>';
                this.element.html(html);
            }

            console.log('In bwRequestedCapitalField._create(). The widget has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwRequestedCapitalField</span>';
            html += '<br />';
            html += '<span style="">Exception in bwRequestedCapitalField.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwRequestedCapitalField")
            .text("");
    },
    getDataType: function () {
        try {
            console.log('In bwRequestedCapitalField.getDataType().');

            return 'currency';
        } catch (e) {
            console.log('Exception in bwRequestedCapitalField.getDataType(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwRequestedCapitalField.getDataType(): ' + e.message + ', ' + e.stack);
        }
    },
    getData: function () {
        try {
            console.log('In bwRequestedCapitalField.getData().');

            var value = 0;

            if ($(this.element).find('#RequestedCapital') && $(this.element).find('#RequestedCapital')[0] && $(this.element).find('#RequestedCapital')[0].value) {
          
                var tmpValue = $(this.element).find('#RequestedCapital')[0].value;

                var tmp2 = Number(tmpValue);

                value = tmp2;


            }

            return value;
        } catch (e) {
            console.log('Exception in bwRequestedCapitalField.getData(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwRequestedCapitalField.getData(): ' + e.message + ', ' + e.stack);
        }
    },
    isARequiredField: function () {
        try {
            console.log('In bwRequestedCapitalField.isARequiredField().');
            return this.options.renderAsARequiredField;
        } catch (e) {
            console.log('Exception in bwRequestedCapitalField.isARequiredField(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwRequestedCapitalField.isARequiredField(): ' + e.message + ', ' + e.stack);
        }
    },
    getfieldTitle: function () {
        try {
            console.log('In bwRequestedCapitalField.getfieldTitle().');
            return this.options.fieldTitle;
        } catch (e) {
            console.log('Exception in bwRequestedCapitalField.getfieldTitle(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwRequestedCapitalField.getfieldTitle(): ' + e.message + ', ' + e.stack);
        }
    },
    renderAndPopulateRequestedCapitalField: function (requestDialogId) {
        try {
            console.log('In renderAndPopulateRequestedCapitalField().');
            //alert('In renderAndPopulateRequestedCapitalField().');
            var thiz = this;
            var html = '';

            html += '<table style="width:100%;">';
            html += '   <tbody>';


            // Requested Capital.
            html += '       <tr class="xdTableOffsetRow xdTableOffsetRow-editor" bwwidgetname="bwRequestedCapitalField">';
            html += '           <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
            html += '               <span class="xdlabel">';
            html += '                   Requested Capital:';
            html += '               </span>';
            if (this.options.inFormsEditor == true) {
                html += '           <span class="ToggleRequiredAsterisk" title="Select this asterick to make this a required field." onclick="$(\'.bwFormsEditor\').bwFormsEditor(\'toggleFormRequiredField\', this);">*</span>';
            } else if (this.options.renderAsARequiredField == true) {
                html += '           <span style="color:red;font-size:medium;">*</span>';
            } else if (this.options.renderAsARequiredField == false) {
                //
            }
            html += '           </td>';
            html += '           <td class="xdTableOffsetCellComponent" style="white-space:nowrap;text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">';
            html += '               <input id="RequestedCapital" class="bwRequestJson" type="number" step="0.01" bwfieldname="RequestedCapital" bwdatatype="Number" bwdatarequired="true" value="0" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: right;" />';
            html += '           </td>';
            html += '       </tr>';


            html += '   </tbody>';
            html += '</table>';

            

            html += '<table style="width:100%;">';
            html += '   <tbody>';



            //// Calculated Capital.
            //html += '       <tr class="xdTableOffsetRow xdTableOffsetRow-editor" bwwidgetname="bwRequestedCapitalField">';
            //html += '           <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
            //html += '               <span class="xdlabel">';
            //html += '                   Calculated Capital xcx1-1:';
            //html += '               </span>';
            //if (this.options.inFormsEditor == true) {
            //    html += '           <span class="ToggleRequiredAsterisk" title="Select this asterick to make this a required field." onclick="$(\'.bwFormsEditor\').bwFormsEditor(\'toggleFormRequiredField\', this);">*</span>';
            //} else if (this.options.renderAsARequiredField == true) {
            //    html += '           <span style="color:red;font-size:medium;">*</span>';
            //} else if (this.options.renderAsARequiredField == false) {
            //    //
            //}
            //html += '           </td>';
            //html += '           <td class="xdTableOffsetCellComponent" style="white-space:nowrap;text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">';
            //html += '               <input id="RequestedCapital" class="bwRequestJson" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: right;" type="text" bwfieldname="RequestedCapital" bwdatatype="Number" bwdatarequired="true" value="" />';
            //html += '           </td>';
            //html += '       </tr>';







            html += '   </tbody>';
            html += '</table>';

            // Render the html.
            if (this.options.inFormsEditor != true) {
                // THIS IS VERY IMPORTANT AND NEEDS TO BE IN EVERY WIDGET!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 7-12-2020
                // Even though the widget regenerates itself (re-renders), the parent TR tag gets missed!!! Therefore we have to handle getting rid of our form editor draggable attribute here.
                this.element.closest('tr').removeAttr('draggable');
            }
            this.element.html(html);
            //debugger;
            // If we have jsonData, populate the element.
            //if (this.options.jsonData != null) {
            //    var dataElement = $(this.element).find('.bwRequestJson')[0];
            //    var bwFieldName = dataElement.getAttribute('bwfieldname');
            //    if (this.options.jsonData[bwFieldName]) {
            //        var value = this.options.jsonData[bwFieldName].value;
            //        dataElement.value = formatCurrencyNoDecimal(value);  // formatCurrencyNoDecimalNoDollarSign(value);
            //    }
            //}

            if (this.options.jsonData != null) {

                var dataElement = $(this.element).find('.bwRequestJson:first');
                if (this.options.jsonData['bwRequestedCapitalField'] && this.options.jsonData['bwRequestedCapitalField'].value) {
                    var value = this.options.jsonData['bwRequestedCapitalField'].value;
                    $(dataElement).val(value);
                }

            }

        } catch (e) {
            console.log('Exception in renderAndPopulateRequestedCapitalField: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwRequestedCapitalField</span>';
            html += '<br />';
            html += '<span style="">Exception in bwRequestedCapitalField.renderAndPopulateRequestedCapitalField(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    },

    renderAndPopulateRequestedCapitalField_ReadOnly: function (requestDialogId) {
        try {
            console.log('In renderAndPopulateRequestedCapitalField().');
            //alert('In renderAndPopulateRequestedCapitalField_ReadOnly().');
            var thiz = this;
            var html = '';

            html += '<table style="width:100%;">';
            html += '                        <tbody><tr class="xdTableOffsetRow xdTableOffsetRow-editor" bwwidgetname="bwRequestedCapitalField">';
            html += '                            <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
            html += '                                <span class="xdlabel">';
            html += '                                    Requested Capital:';
            html += '                                </span>';
            //html += '                                <span style="color:red;font-size:medium;">*</span>';

            if (this.options.inFormsEditor == true) {
                html += '                               <span class="ToggleRequiredAsterisk" title="Select this asterick to make this a required field." onclick="$(\'.bwFormsEditor\').bwFormsEditor(\'toggleFormRequiredField\', this);">*</span>';
            } else if (this.options.renderAsARequiredField == true) {
                html += '                               <span style="color:red;font-size:medium;">*</span>';
            } else if (this.options.renderAsARequiredField == false) {
                //
            }




            html += '                            </td>';
            html += '                            <td class="xdTableOffsetCellComponent" style="white-space:nowrap;text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">';

            html += '<input contentEditable="false" disabled class="bwRequestJson" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: right;" type="text" bwfieldname="RequestedCapital" bwdatatype="Number" bwdatarequired="true">';

            html += '                            </td>';
            html += '                        </tr>';
            html += '                    </tbody>';
            html += '</table>';

            // Render the html.
            if (this.options.inFormsEditor != true) {
                // THIS IS VERY IMPORTANT AND NEEDS TO BE IN EVERY WIDGET!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 7-12-2020
                // Even though the widget regenerates itself (re-renders), the parent TR tag gets missed!!! Therefore we have to handle getting rid of our form editor draggable attribute here.
                this.element.closest('tr').removeAttr('draggable');
            }
            this.element.html(html);

            // If we have jsonData, populate the element.
            //if (this.options.jsonData != null) {
            //    var dataElement = $(this.element).find('.bwRequestJson')[0];
            //    var bwFieldName = dataElement.getAttribute('bwfieldname');
            //    var value = this.options.jsonData[bwFieldName].value;
            //    //dataElement.value = value;
            //    dataElement.value = formatCurrencyNoDecimal(value);  // formatCurrencyNoDecimalNoDollarSign(value);
            //}

            //if (this.options.jsonData != null) {
            //    var dataElement = $(this.element).find('.bwRequestJson:first');
            //    var bwFieldName = $(dataElement).attr('bwfieldname');
            //    if (this.options.jsonData[bwFieldName] && this.options.jsonData[bwFieldName].value) {
            //        var value = this.options.jsonData[bwFieldName].value;
            //        //dataElement.value = value;
            //        $(dataElement).val(value);
            //    }
            //}

            if (this.options.jsonData != null) {

                var dataElement = $(this.element).find('.bwRequestJson:first');
                if (this.options.jsonData['bwRequestedCapitalField'] && this.options.jsonData['bwRequestedCapitalField'].value) {
                    var value = this.options.jsonData['bwRequestedCapitalField'].value;
                    $(dataElement).val(value);
                }

            }

        } catch (e) {
            console.log('Exception in renderAndPopulateRequestedCapitalField_ReadOnly: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwRequestedCapitalField</span>';
            html += '<br />';
            html += '<span style="">Exception in bwRequestedCapitalField.renderAndPopulateRequestedCapitalField_ReadOnly(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    }


});