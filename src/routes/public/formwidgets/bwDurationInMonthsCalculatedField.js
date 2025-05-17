$.widget("bw.bwDurationInMonthsCalculatedField", {
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
        This is the bwDurationInMonthsCalculatedField.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        fieldTitle: 'The life expectancy of this project (months)', // This is the title, which shows up on the form in the left column.

        requestDialogId: null, // This is the unique id of the request dialog being displayed. We prepend this to id's in order to make sure we can display many dialogs at one time on screen and make them unique in the dom.

        allowRequestModifications: false,
        renderAsARequiredField: null, // If this is true, then just display the red asterisk.

        inFormsEditor: null, // This is when forms are being designed. This prevents the widget from hitting the database (going asynchronous) when this is true. If that happens, a race condition may occur and addition to the toolbox may partially fail.

        bwTenantId: null,
        bwWorkflowAppId: null,

        operationUriPrefix: null,
        ajaxTimeout: 15000,
        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function () {
        this.element.addClass("bwDurationInMonthsCalculatedField");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {

            selfDiscoverOperationUri(thiz); // This sets this.options.operationUriPrefix correctly.

            this.renderAndPopulateDurationInMonthsCalculatedField();

            console.log('In bwDurationInMonthsCalculatedField._create(). The dialog has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwDurationInMonthsCalculatedField</span>';
            html += '<br />';
            html += '<span style="">Exception in bwDurationInMonthsCalculatedField.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwDurationInMonthsCalculatedField")
            .text("");
    },
    getData: function () {
        try {
            console.log('In bwDurationInMonthsCalculatedField.getData().');
            //return 'This getData method is incomplete.';
            return null;
        } catch (e) {
            console.log('Exception in bwDurationInMonthsCalculatedField.getData(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwDurationInMonthsCalculatedField.getData(): ' + e.message + ', ' + e.stack);
        }
    },
    isARequiredField: function () {
        try {
            console.log('In bwDurationInMonthsCalculatedField.isARequiredField().');
            return this.options.renderAsARequiredField;
        } catch (e) {
            console.log('Exception in bwDurationInMonthsCalculatedField.isARequiredField(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwDurationInMonthsCalculatedField.isARequiredField(): ' + e.message + ', ' + e.stack);
        }
    },
    getfieldTitle: function () {
        try {
            console.log('In bwDurationInMonthsCalculatedField.getfieldTitle().');
            return this.options.fieldTitle;
        } catch (e) {
            console.log('Exception in bwDurationInMonthsCalculatedField.getfieldTitle(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwDurationInMonthsCalculatedField.getfieldTitle(): ' + e.message + ', ' + e.stack);
        }
    },
    recalculate: function () {
        try {
            //debugger;
            var startDate = $('.bwStartDatePicker').bwStartDatePicker('getData');
            var endDate = $('.bwEndDatePicker').bwEndDatePicker('getData');
            if (startDate && endDate) {
                var value = Date.monthsBetween(startDate, endDate); // Date.daysBetween(startDate, endDate);
                $(this.element).find('#dblDurationInMonths')[0].value = value;
            }
        } catch (e) {
            console.log('Exception in bwDurationInMonthsCalculatedField.recalculate(): ' + e.message + ', ' + e.stack);
        }
    },

    renderAndPopulateDurationInMonthsCalculatedField: function (requestDialogId) {
        try {
            console.log('In renderAndPopulateDurationInMonthsCalculatedField().');
            var thiz = this;
            var html = '';
            //html += '<div style="white-space:nowrap;">';
            //html += '   <input type="text" class="bwRequestJson" bwDataRequired="true" bwDataType="string" bwFieldname="ProjectTitle" id="strProjectTitle" onkeyup="$(\'.bwRequest\').bwRequest(\'editTextbox_OnKeyUp\', this);" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" /> <!-- was 2.77em -->';
            ////html += '   <button class="spanButton2" style="height:42px;width:85px;margin-bottom:12px;" onclick="$(\'.bwRequest\').bwRequest(\'cmdSaveRequestTitle\');">Publish</button>';
            //html += '</div>';

            html += '<table style="width:100%;">';
            html += '                        <tbody><tr class="xdTableOffsetRow xdTableOffsetRow-editor" bwwidgetname="bwDurationInMonthsCalculatedField">';
            html += '                            <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
            html += '                                <span class="xdlabel">';
            html += '                                    The life expectancy of this project (months):';
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
            html += '<input class="bwRequestJson" id="dblDurationInMonths" disabled style="color:black;WIDTH: 15%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: right;" type="text" bwfieldname="LifeExpectancyOfProjectInMonths" bwdatatype="number" bwdatarequired="false" />';
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

            // NEED TO DO THE CALCULATION HERE!
            // 1. Check if both start and end dates are present
            // 2. If so, calculate the months in between.


            // If we have jsonData, populate the element.
            if (this.options.jsonData != null) {
                var dataElement = $(this.element).find('.bwRequestJson')[0];
                if (this.options.jsonData['EstimatedStartDate'] && this.options.jsonData['EstimatedEndDate']) {
                    var startDate = this.options.jsonData['EstimatedStartDate'].value;
                    var endDate = this.options.jsonData['EstimatedEndDate'].value;
                    if (startDate && endDate) {
                        var value = Date.monthsBetween(startDate, endDate); // Date.daysBetween(startDate, endDate);
                        //dataElement.value = value;
                        $(dataElement).val(value);
                    }
                }
            }


        } catch (e) {
            console.log('Exception in renderAndPopulateDurationInMonthsCalculatedField: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwDurationInMonthsCalculatedField</span>';
            html += '<br />';
            html += '<span style="">Exception in bwDurationInMonthsCalculatedField.renderAndPopulateDurationInMonthsCalculatedField(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    }


});