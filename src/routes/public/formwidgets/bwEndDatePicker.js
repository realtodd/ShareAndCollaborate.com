$.widget("bw.bwEndDatePicker", {
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
        This is the bwEndDatePicker.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        fieldTitle: 'End Date', // This is the title, which shows up on the form in the left column.

        jsonData: null,

        instantiated: false, // This si so we can check if the thing is all populated and ready to go.

        allowRequestModifications: false,
        renderAsARequiredField: null, // If this is true, then just display the red asterisk.

        inFormsEditor: null, // This is when forms are being designed. This prevents the widget from hitting the database (going asynchronous) when this is true. If that happens, a race condition may occur and addition to the toolbox may partially fail.
        inVisualizations: null, // This is when in the Visualizations section.

        requestDialogId: null, // This is the unique id of the request dialog being displayed. We prepend this to id's in order to make sure we can display many dialogs at one time on screen and make them unique in the dom.

        bwTenantId: null,
        bwWorkflowAppId: null,

        operationUriPrefix: null,
        ajaxTimeout: 15000,
        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function () {
        this.element.addClass("bwEndDatePicker");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {

            selfDiscoverOperationUri(thiz); // This sets this.options.operationUriPrefix correctly.

            if (this.options.inVisualizations == true) {

                this.renderAndPopulateDatePicker_Visualizations();

            } else {

                if (this.options.inFormsEditor == true) {
                    //this.options.store = {}; // Need to provide this because if it tries to hit the database and poopulate, it won't render in time to be used in the toolbox!!!! 6-28-2020
                    this.renderAndPopulateDatePicker_ReadOnly(); // Need to render, not allowing the user to make modifications.
                } else if (this.options.allowRequestModifications == false) {
                    this.renderAndPopulateDatePicker_ReadOnly(); // Need to render, not allowing the user to make modifications.
                } else if (this.options.allowRequestModifications == true) {
                    this.renderAndPopulateDatePicker();
                } else {
                    var html = '';
                    html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwEndDatePicker</span>';
                    html += '<br />';
                    html += '<span style="">Invalid value for allowRequestModifications: ' + this.options.allowRequestModifications + '</span>';
                    this.element.html(html);
                }
            }

            console.log('In bwEndDatePicker._create(). The widget has been initialized.');
            this.options.instantiated = true; // This is so we can check if the thing is instantiated yet.

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwEndDatePicker</span>';
            html += '<br />';
            html += '<span style="">Exception in bwEndDatePicker.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwEndDatePicker")
            .text("");
    },
    getData: function () {
        try {
            var date = $(this.element).find("#dtEstimatedEndDate").datepicker('getDate');
            if (date == null) {
                return null;
            } else {
                return new Date(date);
            }
        } catch (e) {
            console.log('Exception in bwEndDatePicker.getData(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwEndDatePicker.getData(): ' + e.message + ', ' + e.stack);
        }
    },
    instantiated: function () {
        try {
            console.log('In bwEndDatePicker.instantiated().');
            return this.options.instantiated;
        } catch (e) {
            console.log('Exception in bwEndDatePicker.instantiated(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwEndDatePicker.instantiated(): ' + e.message + ', ' + e.stack);
        }
    },
    isARequiredField: function () {
        try {
            console.log('In bwEndDatePicker.isARequiredField().');
            return this.options.renderAsARequiredField;
        } catch (e) {
            console.log('Exception in bwEndDatePicker.isARequiredField(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwEndDatePicker.isARequiredField(): ' + e.message + ', ' + e.stack);
        }
    },
    getfieldTitle: function () {
        try {
            console.log('In bwEndDatePicker.getfieldTitle().');
            return this.options.fieldTitle;
        } catch (e) {
            console.log('Exception in bwEndDatePicker.getfieldTitle(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwEndDatePicker.getfieldTitle(): ' + e.message + ', ' + e.stack);
        }
    },
    recalculate: function () {
        try {
            console.log('In bwEndDatePicker.recalculate().');

            //debugger;
            $('.bwDurationInMonthsCalculatedField').bwDurationInMonthsCalculatedField('recalculate');


        } catch (e) {
            console.log('Exception in bwEndDatePicker.recalculate(): ' + e.message + ', ' + e.stack);
        }
    },

    renderAndPopulateDatePicker: function (requestDialogId) {
        try {
            console.log('In renderAndPopulateDatePicker().');
            var thiz = this;
            var html = '';
            //html += '<div style="white-space:nowrap;">';
            //html += '   <input type="text" class="bwRequestJson" bwDataRequired="true" bwDataType="string" bwFieldname="ProjectTitle" id="strProjectTitle" onkeyup="$(\'.bwRequest\').bwRequest(\'editTextbox_OnKeyUp\', this);" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" /> <!-- was 2.77em -->';
            ////html += '   <button class="spanButton2" style="height:42px;width:85px;margin-bottom:12px;" onclick="$(\'.bwRequest\').bwRequest(\'cmdSaveRequestTitle\');">Publish</button>';
            //html += '</div>';

            html += '<table style="width:100%;">';
            html += '                        <tbody><tr class="xdTableOffsetRow xdTableOffsetRow-editor" bwwidgetname="bwEndDatePicker">';
            html += '                            <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
            html += '                                <span class="xdlabel">';
            html += '                                    End Date:';
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
            html += '<input autocomplete="off" class="bwRequestJson" id="dtEstimatedEndDate" bwfieldname="EstimatedEndDate" bwdatatype="Date" bwdatarequired="true" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: left;" type="text" >';
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

            $(this.element).find('#dtEstimatedEndDate').datepicker();

            // If we have jsonData, populate the element.
            if (this.options.jsonData != null) {
                //var dataElement = $(this.element).find('.bwRequestJson')[0];
                //var bwFieldName = dataElement.getAttribute('bwfieldname');
                //var value = this.options.jsonData[bwFieldName].value;
                ////debugger;
                //dataElement.value = value;

                var dataElement = $(this.element).find('.bwRequestJson:first');
                var bwFieldName = $(dataElement).attr('bwfieldname');
                if (this.options.jsonData[bwFieldName] && this.options.jsonData[bwFieldName].value) {
                    var value = this.options.jsonData[bwFieldName].value;
                    //dataElement.value = value;
                    $(dataElement).val(value);
                }
            }


            $(this.element).find('#dtEstimatedEndDate').change(function (e) {
                try {
                    console.log('In dtEstimatedEndDate.change(). This needs to check if it has to re-render the spend forecast!xcx1 value: ' + e.target.value);
                    var endDate = thiz.getData(); //$(this.element).find("#dtEstimatedEndDate").datepicker('getData');



                    //
                    // This is where we detect where this widget is placed. This determines how we filter our data. It is only meant, at the moment, to be used for bwDataGrid and bwTrackSpending, but is meant to be expanded upon in the future. 2-24-2022
                    //
                    var bwDataGrid = $(thiz.element).closest('.bwDataGrid')[0];
                    var bwTrackSpending = $(thiz.element).closest('.bwTrackSpending')[0];
                    //var bwParticipantsEditor = $(thiz.element).find('.bwParticipantsEditor')[0];
                    if (bwDataGrid) {

                        //thiz.options.bwOrgId = bwOrgId;
                        //thiz.options.bwOrgName = bwOrgName;
                        console.log('In bwEndDatePicker(). Calling bwDataGrid.js.loadDataAndRenderDetailedListOrExecutiveSummary().');
                        $('.bwDataGrid').bwDataGrid('loadDataAndRenderDetailedListOrExecutiveSummary');



                    } else if (bwTrackSpending) {


                        console.log('In bwEndDatePicker(). Calling bwTrackSpending.js.createPieChart().');
                        //$('.bwDataGrid').bwDataGrid('loadDataAndRenderDetailedListOrExecutiveSummary');
                        $('.bwTrackSpending').bwTrackSpending('ArchiveRequestTypeDropDown_Onchange'); // 4-12-2022 // createPieChart');

                        //if (startDate !== null && endDate !== null) { // if any date selected in datepicker
                        //    var startDate = $('.bwStartDatePicker').bwStartDatePicker('getData');
                        //    var daysTotal = Date.daysBetween(startDate, endDate);
                        //    console.log('daysTotal: ' + daysTotal);
                        //    if (daysTotal == -1)
                        //        //lblDateRange.SetText("Invalid date range");
                        //        //document.getElementById('numberOfDays').value = 'Invalid date range';
                        //        console.log('Invalid date range');
                        //    else
                        //        //lblDateRange.SetText(daysTotal + " days");
                        //        //document.getElementById('numberOfDays').value = daysTotal + ' days';
                        //        console.log(daysTotal + ' days');
                        //}
                        ////thiz.options.store.EstimatedEndDate = endDate;
                        //$('.bwSpendGrid').bwSpendGrid('renderAndPopulateSpendGrid');

                        //thiz.recalculate(); // 7-12-2020

                        //if (thiz.options.inVisualizations == true) {

                        //    //alert('Need to redraw chart.xcx2');
                        //    $('.bwTrackSpending').bwTrackSpending('createPieChart');

                        //} else {
                        //    var endDate = $('.bwEndDatePicker').bwEndDatePicker('getData');
                        //    if (startDate !== null && endDate !== null) { // if any date selected in datepicker
                        //        var daysTotal = Date.daysBetween(startDate, endDate);
                        //        console.log('daysTotal: ' + daysTotal);
                        //        if (daysTotal == -1)
                        //            //lblDateRange.SetText("Invalid date range");
                        //            //document.getElementById('numberOfDays').value = 'Invalid date range';
                        //            console.log('Invalid date range');
                        //        else
                        //            //lblDateRange.SetText(daysTotal + " days");
                        //            //document.getElementById('numberOfDays').value = daysTotal + ' days';
                        //            console.log(daysTotal + ' days');
                        //    }

                        //    $('.bwSpendGrid').bwSpendGrid('renderAndPopulateSpendGrid');
                        //    thiz.recalculate(); // 7-12-2020
                        //}




                    } else {

                        displayAlertDialog('Error in bwEndDatePicker(): xcx32426546675.');
                        //thiz.options.bwOrgId = bwOrgId;
                        //thiz.options.bwOrgName = bwOrgName;

                        //// divParticipantOrgRolePickerDialog
                        //var participantOrgRolePickerDialog_OrgPicker = $('#divParticipantOrgRolePickerDialog_OrgPicker'); //.find('.bwOrganizationPicker')[0];   // bwOrganizationPicker
                        //if (participantOrgRolePickerDialog_OrgPicker) {
                        //    //alert('xcxw53452353 participantOrgRolePickerDialog_OrgPicker');
                        //    $('.bwParticipantsEditor').bwParticipantsEditor('orgPicker_OnChange'); // This gives the bwParticipantsEditor to change it's display to reflect the newly chosen org/location.
                        //}

                        //console.log('Error in bwOrganizationPicker.js.selectLocation(). Could not locate widgets bwDataGrid, bwTrackSpending.');
                        ////displayAlertDialog('Error in bwOrganizationPicker.js.selectLocation(). Could not locate widgets bwDataGrid, bwTrackSpending, or bwParticipantsEditor.');

                    }

                } catch (e) {
                    console.log('Exception in bwEndDatePicker.change(): ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in bwEndDatePicker.change(): ' + e.message + ', ' + e.stack);
                }
            });

        } catch (e) {
            console.log('Exception in renderAndPopulateDatePicker: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwEndDatePicker</span>';
            html += '<br />';
            html += '<span style="">Exception in bwEndDatePicker.renderAndPopulateDatePicker(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    },
    renderAndPopulateDatePicker_ReadOnly: function (requestDialogId) {
        try {
            console.log('In renderAndPopulateDatePicker_ReadOnly().');
            var thiz = this;
            var html = '';
            //html += '<div style="white-space:nowrap;">';
            //html += '   <input type="text" class="bwRequestJson" bwDataRequired="true" bwDataType="string" bwFieldname="ProjectTitle" id="strProjectTitle" onkeyup="$(\'.bwRequest\').bwRequest(\'editTextbox_OnKeyUp\', this);" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" /> <!-- was 2.77em -->';
            ////html += '   <button class="spanButton2" style="height:42px;width:85px;margin-bottom:12px;" onclick="$(\'.bwRequest\').bwRequest(\'cmdSaveRequestTitle\');">Publish</button>';
            //html += '</div>';

            html += '<table style="width:100%;">';
            html += '                        <tbody><tr class="xdTableOffsetRow xdTableOffsetRow-editor" bwwidgetname="bwEndDatePicker">';
            html += '                            <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
            html += '                                <span class="xdlabel">';
            html += '                                    End Date:';
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
            html += '<input autocomplete="off" class="bwRequestJson" id="dtEstimatedEndDate" contentEditable="false" disabled bwfieldname="EstimatedEndDate" bwdatatype="Date" bwdatarequired="true" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: left;" type="text" >';
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

            //$(this.element).find('#dtEstimatedEndDate').datepicker();

            // If we have jsonData, populate the element.
            if (this.options.jsonData != null) {
                //var dataElement = $(this.element).find('.bwRequestJson')[0];
                //var bwFieldName = dataElement.getAttribute('bwfieldname');
                //var value = this.options.jsonData[bwFieldName].value;
                ////debugger;
                //dataElement.value = value;

                var dataElement = $(this.element).find('.bwRequestJson:first');
                var bwFieldName = $(dataElement).attr('bwfieldname');
                if (this.options.jsonData[bwFieldName] && this.options.jsonData[bwFieldName].value) {
                    var value = this.options.jsonData[bwFieldName].value;
                    //dataElement.value = value;
                    $(dataElement).val(value);
                }
            }


        } catch (e) {
            console.log('Exception in renderAndPopulateDatePicker_ReadOnly: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwEndDatePicker</span>';
            html += '<br />';
            html += '<span style="">Exception in bwEndDatePicker.renderAndPopulateDatePicker_ReadOnly(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    },

    renderAndPopulateDatePicker_Visualizations: function (requestDialogId) {
        try {
            console.log('In renderAndPopulateDatePicker_Visualizations().');
            var thiz = this;
            var html = '';
            html += '<table style="width:100%;">';
            html += '   <tbody>';
            html += '       <tr class="xdTableOffsetRow" bwwidgetname="bwEndDatePicker">';
            html += '           <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
            html += '               <span class="xdlabel">';
            html += '                   End Date:';
            html += '               </span>';
            html += '           </td>';
            html += '           <td class="xdTableOffsetCellComponent" style="white-space:nowrap;text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">';
            html += '               <input autocomplete="off" class="bwRequestJson" id="dtEstimatedEndDate" bwfieldname="EstimatedEndDate" bwdatatype="Date" bwdatarequired="true" style="cursor:pointer;WIDTH: 135px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: left;" type="text" >';
            html += '           </td>';
            html += '       </tr>';
            html += '   </tbody>';
            html += '</table>';

            // Render the html.
            this.element.html(html);


            $(this.element).find('#dtEstimatedEndDate').datepicker();

            var endDate = new Date(); // Today is the end date.
            $(this.element).find('#dtEstimatedEndDate').datepicker('setDate', endDate);

            $(this.element).find('#dtEstimatedEndDate').change(function (e) {
                try {
                    console.log('In dtEstimatedEndDate.change(). This needs to check if it has to re-render the spend forecast!xcx2 value: ' + e.target.value);
                    var endDate = thiz.getData(); //$(this.element).find("#dtEstimatedEndDate").datepicker('getData');



                    //
                    // This is where we detect where this widget is placed. This determines how we filter our data. It is only meant, at the moment, to be used for bwDataGrid and bwTrackSpending, but is meant to be expanded upon in the future. 2-24-2022
                    //
                    var bwDataGrid = $(thiz.element).closest('.bwDataGrid')[0];
                    var bwTrackSpending = $(thiz.element).closest('.bwTrackSpending')[0];
                    //var bwParticipantsEditor = $(thiz.element).find('.bwParticipantsEditor')[0];
                    if (bwDataGrid) {

                        //thiz.options.bwOrgId = bwOrgId;
                        //thiz.options.bwOrgName = bwOrgName;
                        console.log('In bwEndDatePicker(). Calling bwDataGrid.js.loadDataAndRenderDetailedListOrExecutiveSummary().');
                        $('.bwDataGrid').bwDataGrid('loadDataAndRenderDetailedListOrExecutiveSummary');



                    } else if (bwTrackSpending) {

                        if (startDate !== null && endDate !== null) { // if any date selected in datepicker
                            var startDate = $('.bwStartDatePicker').bwStartDatePicker('getData');
                            var daysTotal = Date.daysBetween(startDate, endDate);
                            console.log('daysTotal: ' + daysTotal);
                            if (daysTotal == -1)
                                //lblDateRange.SetText("Invalid date range");
                                //document.getElementById('numberOfDays').value = 'Invalid date range';
                                console.log('Invalid date range');
                            else
                                //lblDateRange.SetText(daysTotal + " days");
                                //document.getElementById('numberOfDays').value = daysTotal + ' days';
                                console.log(daysTotal + ' days');
                        }
                        //thiz.options.store.EstimatedEndDate = endDate;
                        //$('.bwSpendGrid').bwSpendGrid('renderAndPopulateSpendGrid');

                        //thiz.recalculate(); // 7-12-2020


                        console.log('In bwEndDatePicker(). Calling bwTrackSpending.js.createPieChart().');
                        $('.bwTrackSpending').bwTrackSpending('createPieChart'); // ArchiveRequestTypeDropDown_Onchange'); // 4-12-2022 // createPieChart');




                        //if (thiz.options.inVisualizations == true) {

                        //    //alert('Need to redraw chart.xcx2');
                        //    $('.bwTrackSpending').bwTrackSpending('createPieChart');

                        //} else {
                        //    var endDate = $('.bwEndDatePicker').bwEndDatePicker('getData');
                        //    if (startDate !== null && endDate !== null) { // if any date selected in datepicker
                        //        var daysTotal = Date.daysBetween(startDate, endDate);
                        //        console.log('daysTotal: ' + daysTotal);
                        //        if (daysTotal == -1)
                        //            //lblDateRange.SetText("Invalid date range");
                        //            //document.getElementById('numberOfDays').value = 'Invalid date range';
                        //            console.log('Invalid date range');
                        //        else
                        //            //lblDateRange.SetText(daysTotal + " days");
                        //            //document.getElementById('numberOfDays').value = daysTotal + ' days';
                        //            console.log(daysTotal + ' days');
                        //    }

                        //    $('.bwSpendGrid').bwSpendGrid('renderAndPopulateSpendGrid');
                        //    thiz.recalculate(); // 7-12-2020
                        //}




                    } else {

                        displayAlertDialog('Error in bwEndDatePicker(): xcx32426546675.');
                        //thiz.options.bwOrgId = bwOrgId;
                        //thiz.options.bwOrgName = bwOrgName;

                        //// divParticipantOrgRolePickerDialog
                        //var participantOrgRolePickerDialog_OrgPicker = $('#divParticipantOrgRolePickerDialog_OrgPicker'); //.find('.bwOrganizationPicker')[0];   // bwOrganizationPicker
                        //if (participantOrgRolePickerDialog_OrgPicker) {
                        //    //alert('xcxw53452353 participantOrgRolePickerDialog_OrgPicker');
                        //    $('.bwParticipantsEditor').bwParticipantsEditor('orgPicker_OnChange'); // This gives the bwParticipantsEditor to change it's display to reflect the newly chosen org/location.
                        //}

                        //console.log('Error in bwOrganizationPicker.js.selectLocation(). Could not locate widgets bwDataGrid, bwTrackSpending.');
                        ////displayAlertDialog('Error in bwOrganizationPicker.js.selectLocation(). Could not locate widgets bwDataGrid, bwTrackSpending, or bwParticipantsEditor.');

                    }

                    ////debugger; // This needs to check if it has to re-render the spend forecast!
                    //console.log('In dtEstimatedEndDate.change(). This needs to check if it has to re-render the spend forecast! value: ' + e.target.value);
                    ////var startDate = $(this.element).find("#dtEstimatedStartDate").datepicker('getData');
                    //var startDate = $('.bwStartDatePicker').bwStartDatePicker('getData');

                    //if (thiz.options.inVisualizations == true) {

                    //    //alert('Need to redraw chart.xcx3');
                    //    $('.bwTrackSpending').bwTrackSpending('createPieChart');

                    //} else {
                    //    var endDate = thiz.getData(); //$(this.element).find("#dtEstimatedEndDate").datepicker('getData');
                    //    if (startDate !== null && endDate !== null) { // if any date selected in datepicker
                    //        var daysTotal = Date.daysBetween(startDate, endDate);
                    //        console.log('daysTotal: ' + daysTotal);
                    //        if (daysTotal == -1)
                    //            //lblDateRange.SetText("Invalid date range");
                    //            //document.getElementById('numberOfDays').value = 'Invalid date range';
                    //            console.log('Invalid date range');
                    //        else
                    //            //lblDateRange.SetText(daysTotal + " days");
                    //            //document.getElementById('numberOfDays').value = daysTotal + ' days';
                    //            console.log(daysTotal + ' days');
                    //    }
                    //    //thiz.options.store.EstimatedEndDate = endDate;
                    //    $('.bwSpendGrid').bwSpendGrid('renderAndPopulateSpendGrid');
                    //    thiz.recalculate(); // 7-12-2020
                    //}

                } catch (e) {
                    console.log('Exception in bwEndDatePicker.change(): ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in bwEndDatePicker.change(): ' + e.message + ', ' + e.stack);
                }
            });

        } catch (e) {
            console.log('Exception in renderAndPopulateDatePicker_Visualizations: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwEndDatePicker</span>';
            html += '<br />';
            html += '<span style="">Exception in bwEndDatePicker.renderAndPopulateDatePicker_Visualizations(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    }
});