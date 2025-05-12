$.widget("bw.bwStartDatePicker", {
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
        This is the bwStartDatePicker.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        fieldTitle: 'Start Date', // This is the title, which shows up on the form in the left column.

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
        this.element.addClass("bwStartDatePicker");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {
            if (this.options.operationUriPrefix == null) {
                // This formulates the operationUri, which is used throughout.
                var url1 = window.location.href.split('https://')[1];
                var url2 = url1.split('/')[0];
                this.options.operationUriPrefix = 'https://' + url2 + '/';
            }

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
                    html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwStartDatePicker</span>';
                    html += '<br />';
                    html += '<span style="">Invalid value for allowRequestModifications: ' + this.options.allowRequestModifications + '</span>';
                    this.element.html(html);
                }
            }

            console.log('In bwStartDatePicker._create(). The widget has been initialized.');
            this.options.instantiated = true; // This is so we can check if the thing is instantiated yet.

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwStartDatePicker</span>';
            html += '<br />';
            html += '<span style="">Exception in bwStartDatePicker.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwStartDatePicker")
            .text("");
    },
    getData: function () {
        try {
            var date = $(this.element).find("#dtEstimatedStartDate").datepicker('getDate');
            if (date == null) {
                return null;
            } else {
                return new Date(date);
            }
        } catch (e) {
            console.log('Exception in bwStartDatePicker.getData(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwStartDatePicker.getData(): ' + e.message + ', ' + e.stack);
        }
    },
    instantiated: function () {
        try {
            console.log('In bwStartDatePicker.instantiated().');
            return this.options.instantiated;
        } catch (e) {
            console.log('Exception in bwStartDatePicker.instantiated(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwStartDatePicker.instantiated(): ' + e.message + ', ' + e.stack);
        }
    },
    isARequiredField: function () {
        try {
            console.log('In bwStartDatePicker.isARequiredField().');
            return this.options.renderAsARequiredField;
        } catch (e) {
            console.log('Exception in bwStartDatePicker.isARequiredField(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwStartDatePicker.isARequiredField(): ' + e.message + ', ' + e.stack);
        }
    },
    getfieldTitle: function () {
        try {
            console.log('In bwStartDatePicker.getfieldTitle().');
            return this.options.fieldTitle;
        } catch (e) {
            console.log('Exception in bwStartDatePicker.getfieldTitle(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwStartDatePicker.getfieldTitle(): ' + e.message + ', ' + e.stack);
        }
    },
    recalculate: function () {
        try {
            console.log('In bwStartDatePicker.recalculate().');

            //debugger;
            $('.bwDurationInMonthsCalculatedField').bwDurationInMonthsCalculatedField('recalculate');


        } catch (e) {
            console.log('Exception in bwStartDatePicker.recalculate(): ' + e.message + ', ' + e.stack);
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
            html += '                        <tbody><tr class="xdTableOffsetRow xdTableOffsetRow-editor" bwwidgetname="bwStartDatePicker">';
            html += '                            <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
            html += '                                <span class="xdlabel">';
            html += '                                    Start Date:';
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
            html += '<input autocomplete="off" class="bwRequestJson" id="dtEstimatedStartDate" style="cursor:pointer;WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: left;" type="text" bwfieldname="EstimatedStartDate" bwdatatype="Date" bwdatarequired="true">';
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

            $(this.element).find('#dtEstimatedStartDate').datepicker();


            // test 
            //var dataElementTest = $(this.element).find('.bwRequestJson');
            //displayAlertDialog('xcx123423 dataElementTest.length: ' + dataElementTest.length + ', this.options.jsonData: ' + JSON.stringify(this.options.jsonData));
            //var bwFieldName = dataElement.getAttribute('bwfieldname');


            // If we have jsonData, populate the element.
            if (this.options.jsonData != null) {
                var dataElement = $(this.element).find('.bwRequestJson:first');
                var bwFieldName = $(dataElement).attr('bwfieldname');
                if (this.options.jsonData[bwFieldName] && this.options.jsonData[bwFieldName].value) {
                    var value = this.options.jsonData[bwFieldName].value;
                    //dataElement.value = value;
                    $(dataElement).val(value);
                }
            }


            $(this.element).find('#dtEstimatedStartDate').change(function (e) {
                try {
                    //debugger; // This needs to check if it has to re-render the spend forecast!
                    console.log('In dtEstimatedStartDate.change()xcx1. This needs to check if it has to re-render the spend forecast! value: ' + e.target.value);
                    var startDate = thiz.getData(); 
                    //var endDate = $(this.element).find("#dtEstimatedEndDate").datepicker('getData');
                    var endDate = $('.bwEndDatePicker').bwEndDatePicker('getData');
                    if (startDate !== null && endDate !== null) { // if any date selected in datepicker
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
                    //thiz.options.store.EstimatedStartDate = startDate;
                    $('.bwSpendGrid').bwSpendGrid('renderAndPopulateSpendGrid');

                    thiz.recalculate(); // 7-12-2020

                } catch (e) {
                    console.log('Exception in bwStartDatePicker.change(): ' + e.message + ', ' + e.stack);
                }
            });




        } catch (e) {
            console.log('Exception in renderAndPopulateDatePicker: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwStartDatePicker</span>';
            html += '<br />';
            html += '<span style="">Exception in bwStartDatePicker.renderAndPopulateDatePicker(): ' + e.message + ', ' + e.stack + '</span>';
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
            html += '                        <tbody><tr class="xdTableOffsetRow xdTableOffsetRow-editor" bwwidgetname="bwStartDatePicker">';
            html += '                            <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
            html += '                                <span class="xdlabel">';
            html += '                                    Start Date:';
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
            html += '<input autocomplete="off" class="bwRequestJson" id="dtEstimatedStartDate" contentEditable="false" disabled style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: left;" type="text" bwfieldname="EstimatedStartDate" bwdatatype="Date" bwdatarequired="true">';
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

            //$(this.element).find('#dtEstimatedStartDate').datepicker();

            // If we have jsonData, populate the element.
            //if (this.options.jsonData != null) {
            //    var dataElement = $(this.element).find('.bwRequestJson')[0];
            //    var bwFieldName = dataElement.getAttribute('bwfieldname');
            //    var value = this.options.jsonData[bwFieldName].value;
            //    dataElement.value = value;
            //}

            if (this.options.jsonData != null) {
                var dataElement = $(this.element).find('.bwRequestJson:first');
                var bwFieldName = $(dataElement).attr('bwfieldname');
                if (this.options.jsonData[bwFieldName] && this.options.jsonData[bwFieldName].value) {
                    var value = this.options.jsonData[bwFieldName].value;
                    //dataElement.value = value;
                    $(dataElement).val(value);
                }
            }


            //$(this.element).find('#dtEstimatedStartDate').change(function (e) {
            //    try {
            //        //debugger; // This needs to check if it has to re-render the spend forecast!
            //        console.log('In dtEstimatedStartDate.change(). This needs to check if it has to re-render the spend forecast! value: ' + e.target.value);
            //        var startDate = thiz.getData(); //$(this.element).bwStartDatePicker('getData'); //.find("#dtEstimatedStartDate").datepicker('getData');
            //        //var endDate = $(this.element).find("#dtEstimatedEndDate").datepicker('getData');
            //        var endDate = $('.bwEndDatePicker').bwEndDatePicker('getData');
            //        if (startDate !== null && endDate !== null) { // if any date selected in datepicker
            //            var daysTotal = Date.daysBetween(startDate, endDate);
            //            console.log('daysTotal: ' + daysTotal);
            //            if (daysTotal == -1)
            //                //lblDateRange.SetText("Invalid date range");
            //                //document.getElementById('numberOfDays').value = 'Invalid date range';
            //                console.log('Invalid date range');
            //            else
            //                //lblDateRange.SetText(daysTotal + " days");
            //                //document.getElementById('numberOfDays').value = daysTotal + ' days';
            //                console.log(daysTotal + ' days');
            //        }
            //        //thiz.options.store.EstimatedStartDate = startDate;
            //        $('.bwSpendGrid').bwSpendGrid('renderAndPopulateSpendGrid');
            //    } catch (e) {
            //        console.log('Exception in bwEndDatePicker.change(): ' + e.message + ', ' + e.stack);
            //    }
            //});




        } catch (e) {
            console.log('Exception in renderAndPopulateDatePicker_ReadOnly: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwStartDatePicker</span>';
            html += '<br />';
            html += '<span style="">Exception in bwStartDatePicker.renderAndPopulateDatePicker_ReadOnly(): ' + e.message + ', ' + e.stack + '</span>';
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
            html += '       <tr class="xdTableOffsetRow" bwwidgetname="bwStartDatePicker">';
            html += '           <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
            html += '               <span class="xdlabel">';
            html += '                   Start Date:';
            html += '               </span>';
            html += '           </td>';
            html += '           <td class="xdTableOffsetCellComponent" style="white-space:nowrap;text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">';
            html += '               <input autocomplete="off" class="bwRequestJson" id="dtEstimatedStartDate" style="cursor:pointer;WIDTH: 135px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: left;" type="text" bwfieldname="EstimatedStartDate" bwdatatype="Date" bwdatarequired="true">';
            html += '           </td>';
            html += '       </tr>';
            html += '   </tbody>';
            html += '</table>';

            // Render the html.
            this.element.html(html);

            $(this.element).find('#dtEstimatedStartDate').datepicker();

            //
            // THIS IS THE ONLY PLACE THE START DATE IS SET.
            //
            
            var startDate; // January 1 of the previous year is the default start date. This mans that when January 1 hits,users can still see the last years' requests. Very important. 1-1-2023.
            var yearDate = new Date();
            var now = new Date();
            if (now.getMonth() > 2) { // Greater than March.

                var year = yearDate.getFullYear(); // The previous year.
                startDate = new Date(year, 0, 1, 0, 0, 0, 0); // January 1 of the previous year is the default start date. This mans that when January 1 hits,users can still see the last years' requests. Very important. 1-1-2023.

            } else {
                
                var year = yearDate.getFullYear() - 1; // The previous year.
                startDate = new Date(year, 0, 1, 0, 0, 0, 0); // January 1 of the previous year is the default start date. This mans that when January 1 hits,users can still see the last years' requests. Very important. 1-1-2023.
            }

            

            $(this.element).find('#dtEstimatedStartDate').datepicker('setDate', startDate);
            //
            // end: THIS IS THE ONLY PLACE THE START DATE IS SET.
            //

            $(this.element).find('#dtEstimatedStartDate').change(function (e) {
                try {
                    // This needs to check if it has to re-render the spend forecast!
                    console.log('In dtEstimatedStartDate.change()xcx2. This needs to check if it has to re-render the spend forecast! value: ' + e.target.value);
                    var startDate = thiz.getData(); //$(this.element).bwStartDatePicker('getData'); //.find("#dtEstimatedStartDate").datepicker('getData');
                    
                    //
                    // This is where we detect where this widget is placed. This determines how we filter our data. It is only meant, at the moment, to be used for bwDataGrid and bwTrackSpending, but is meant to be expanded upon in the future. 2-24-2022
                    //
                    var bwDataGrid = $(thiz.element).closest('.bwDataGrid')[0];
                    var bwTrackSpending = $(thiz.element).closest('.bwTrackSpending')[0];
                    //var bwParticipantsEditor = $(thiz.element).find('.bwParticipantsEditor')[0];
                    if (bwDataGrid) {

                        //thiz.options.bwOrgId = bwOrgId;
                        //thiz.options.bwOrgName = bwOrgName;
                        console.log('In bwStartDatePicker(). Calling bwDataGrid.js.loadDataAndRenderDetailedListOrExecutiveSummary().');
                        //$('.bwDataGrid').bwDataGrid('loadDataAndRenderDetailedListOrExecutiveSummary'); 
                        $('.bwDataGrid').bwDataGrid('renderDetailedListOrExecutiveSummary');
                       
                    } else if (bwTrackSpending) {

                        if (thiz.options.inVisualizations == true) {

                            //alert('Need to redraw chart.xcx2');
                            $('.bwTrackSpending').bwTrackSpending('createPieChart');

                        } else {
                            var endDate = $('.bwEndDatePicker').bwEndDatePicker('getData');
                            if (startDate !== null && endDate !== null) { // if any date selected in datepicker
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

                            $('.bwSpendGrid').bwSpendGrid('renderAndPopulateSpendGrid');
                            thiz.recalculate(); // 7-12-2020
                        }

                        ////alert('In bwOrganizationPicker.js.selectLocation(). Its bwTrackSpending.');
                        ////var divBwDataGrid_Content_Html = $(thiz.element).find('#divBwDataGrid_Content').html(); // If this is empty, it means the DataGrid has never been rendered... it is the first time here.
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

                        displayAlertDialog('Error in bwStartDatePicker(): xcx32426546675.');
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
                    console.log('Exception in bwStartDatePicker.change(): ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in bwStartDatePicker.change(): ' + e.message + ', ' + e.stack);
                }
            });

        } catch (e) {
            console.log('Exception in renderAndPopulateDatePicker_Visualizations: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwStartDatePicker</span>';
            html += '<br />';
            html += '<span style="">Exception in bwStartDatePicker.renderAndPopulateDatePicker_Visualizations(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    }

});