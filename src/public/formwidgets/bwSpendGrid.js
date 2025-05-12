$.widget("bw.bwSpendGrid", {
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
        This is the bwSpendGrid.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        fieldTitle: 'Spend Forecast', // This is the title, which shows up on the form in the left column.

        jsonData: [],

        requestDialogId: null, // This is the id of the container where this form widget is displayed.

        allowRequestModifications: false,
        renderAsARequiredField: null, // If this is true, then just display the red asterisk.

        inFormsEditor: null, // This is when forms are being designed. This prevents the widget from hitting the database (going asynchronous) when this is true. If that happens, a race condition may occur and addition to the toolbox may partially fail.

        operationUriPrefix: null,
        ajaxTimeout: 15000,
        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function () {
        this.element.addClass("bwSpendGrid");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {
            if (this.options.operationUriPrefix == null) {
                // This formulates the operationUri, which is used throughout.
                var url1 = window.location.href.split('https://')[1];
                var url2 = url1.split('/')[0];
                this.options.operationUriPrefix = 'https://' + url2 + '/';
            }

            if (!this.options.jsonData) {
                this.options.jsonData = [];
            }

            if (this.options.jsonData.length == 0) {
                this.options.jsonData['bwSpendGrid'] = {}; // Instantiate the data object. bwSpendGrid
            }

            this.renderAndPopulateSpendGrid();

            console.log('In bwSpendGrid._create(). The dialog has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwSpendGrid</span>';
            html += '<br />';
            html += '<span style="">Exception in bwSpendGrid.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwSpendGrid")
            .text("");
    },
    getDataType: function () {
        try {
            console.log('In bwSpendGrid.js.getDataType().');

            return 'spreadsheet';
        } catch (e) {
            console.log('Exception in bwSpendGrid.js.getDataType(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwSpendGrid.js.getDataType(): ' + e.message + ', ' + e.stack);
        }
    },
    getData: function () {
        try {
            console.log('In bwSpendGrid.js.getData().');
            var data = $(this.element).find('#jsGridSpend_small').jsGrid('option', 'data');
            if (data.length < 1) {
                return null;
            } else {
                try {
                    JSON.stringify(data); // If this fails, return null. It most likely means that the columns have not been generated for the grid yet... which in turn means that the start and end dates have not been selected.
                    return data;
                } catch (e) {
                    return null;
                }
            }
        } catch (e) {
            console.log('Exception in bwSpendGrid.getData(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwSpendGrid.getData(): ' + e.message + ', ' + e.stack);
        }
    },
    isARequiredField: function () {
        try {
            console.log('In bwSpendGrid.isARequiredField().');
            return this.options.renderAsARequiredField;
        } catch (e) {
            console.log('Exception in bwSpendGrid.isARequiredField(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwSpendGrid.isARequiredField(): ' + e.message + ', ' + e.stack);
        }
    },
    getfieldTitle: function () {
        try {
            console.log('In bwSpendGrid.getfieldTitle().');
            return this.options.fieldTitle;
        } catch (e) {
            console.log('Exception in bwSpendGrid.getfieldTitle(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwSpendGrid.getfieldTitle(): ' + e.message + ', ' + e.stack);
        }
    },
    
    pinRequestDialog: function () {
        try {
            console.log('In pinRequestDialog().');
            // This makes the dialog non-modal, so that it can be dragged around and the underlying functionality accessible. This removes the overlay that makes the dialog modal, and also removes the click event which would have originally closed the request dialog.
            // The idea is to be able to have multiple requests open at once!
            $('.ui-widget-overlay').unbind('click');
            $(".ui-widget-overlay").remove();

            //document.getElementById("divRequestFormDialog").id = "divRequestFormDialog_2";
            //// Now that we have renamed the dialog div, we need to put it back so it will be there the next time a user wants to view another request dialog.
            //var html = '';
            ////html += '<div style="display:none;" id="divRequestFormDialog">';
            //html += '        <table style="width:100%;">';
            //html += '            <tr>';
            //html += '                <td style="width:90%;">';
            //html += '                    <span id="divRequestFormDialogContent"></span>';
            //html += '                </td>';
            //html += '            </tr>';
            //html += '        </table>';
            //html += '        <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and zooming in on the iPhone. -->';
            //html += '        <br /><br />';
            ////html += '    </div>';


            ////
            //// THIS IS PART OF THE PIN FUNCTIONALITY 4-1-2020
            ////
            //var div = document.getElementById("divRequestFormDialog"); // 4-1-2020 12-28pm adt.
            //if (!div) { // for some reason this gets added twice to the DOM. Figure this out someday, but for now this seems to fix it and is a good safety I suppose.
            //    div = document.createElement('div');
            //    div.id = 'divRequestFormDialog';
            //    document.body.appendChild(div); // to place at end of document
            //}
            //var divDocument = div.contentDocument;
            //divDocument.body.innerHTML = html;


        } catch (e) {
            console.log('Exception in pinRequestDialog(): ' + e.message + ', ' + e.stack);

        }
    },
    setZoom: function (originalZoom, elementId) {
        try {
            console.log('In setZoom(' + originalZoom + ', ' + elementId + ')');
            var thiz = this;
            if (originalZoom > 20) { // Don't make any smaller than this!
                var zoom = originalZoom / 100;
                elementId = elementId.replace('_Parent', '');
                elementId += '_Parent'; // This just makes sure it is here! :)
                var el = document.getElementById(elementId); //("#elementId"); //.slider("element");

                transformOrigin = [0, 0];
                //try {
                //    el = el || instance.getContainer();
                //} catch(e) { }

                var p = ["webkit", "moz", "ms", "o"],
                    s = "scale(" + zoom + ")",
                    oString = (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%";

                for (var i = 0; i < p.length; i++) {
                    el.style[p[i] + "Transform"] = s;
                    el.style[p[i] + "TransformOrigin"] = oString;
                }

                el.style["transform"] = s;
                el.style["transformOrigin"] = oString;


                this.pinRequestDialog(); // Gets rid of the clickable greyed out background... Makes the dialog not-modal.

                //elementId.draggable("option", "containment", "window");
                //$(".selector").draggable("option", "containment", "window");

                // New attempt to use the entire browser screen/window. 4-24-2020.
                //window.addEventListener("resize", function () {
                //    try {

                //var body = document.getElementsByTagName('body')[0];
                //var clientWidth = body.scrollWidth; //offsetWidth; //getBoundingClientRect().width +; //body.clientWidth; offsetHeight
                ////var clientHeight = Math.max(body.scrollHeight, document.documentElement.clientHeight, window.innerHeight || 0); //offsetHeight; //getBoundingClientRect().height; //body.clientHeight;
                //var clientHeight = Math.max(
                //    body.scrollHeight, document.documentElement.scrollHeight,
                //    body.offsetHeight, document.documentElement.offsetHeight,
                //    body.clientHeight, document.documentElement.clientHeight
                //);

                //    } catch (e) {
                //        //alert('Exception in xxxxx: ' + e.message + ', ' + e.stack);
                //    }
                //}, false);


            }
        } catch (e) {
            console.log('Exception in setZoom(): ' + e.message + ', ' + e.stack);
        }
    },

    renderAndPopulateSpendGrid: function (requestDialogId) {
        try {
            console.log('In renderAndPopulateSpendGrid().');
            var thiz = this;
            var html = '';

            // This is our data grid section. THE WIDTH IS SET HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            html += '                       <table style="width:100px;">';
            html += '                        <tbody><tr class="xdTableOffsetRow xdTableOffsetRow-editor" id="toolboxdraggablerow_2" draggable="true" bwwidgetname="bwSpendGrid" bwfieldname="bwSpendGrid">';
            html += '                            <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px;white-space:nowrap;">';
            //html += '                               <span style="font-size:20pt;cursor:zoom-in;" onclick="$(\'.bwSpendGrid\').bwSpendGrid(\'viewInLargeWindow\');"><img src="/images/zoom.jpg" style="width:20px;height:20px;" /></span>';
            html += '                                <span class="xdlabel">';
            html += '                                    Spend Forecast:';
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

            html += '<div id="divGridContainer">';
            html += '<table><tr><td>';
            html += '                                                    <div id="jsGridSpend_small" style="font-size:60%;"></div>'; // overflow-x:scroll;

            html += '<br />';
            html += '<table class="xdFormLayout xdTableStyleTwoCol" style="BORDER-TOP-STYLE: none; WORD-WRAP: break-word; BORDER-LEFT-STYLE: none; BORDER-COLLAPSE: collapse; TABLE-LAYOUT: fixed; BORDER-BOTTOM-STYLE: none; BORDER-RIGHT-STYLE: none;width:100%;">';
            html += '   <colgroup>';
            html += '       <col style="WIDTH: 195px" />';
            html += '       <col style="" />';
            html += '   </colgroup>';
            html += '<tbody valign="top">';

            html += '   <tr class="xdTableOffsetRow2">';
            html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            html += '           <span class="xdlabel" style="color:gray;font-size:10pt;">Projected Capital Spending:</span>';
            html += '       </td>';
            html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
            html += '                           <input id="projectedCapitalSpending_small" contentEditable="false" style="WIDTH: 140px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 18pt;TEXT-ALIGN: right;" type="text" />';

            html += '       </td>';
            html += '   </tr>';
            html += '   <tr class="xdTableOffsetRow2">';
            html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            html += '           <span class="xdlabel" style="color:gray;font-size:10pt;">Amount Forecast:</span>';
            html += '       </td>';
            html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
            html += '           <div>';
            html += '               <input id="amountForecast" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 13pt;TEXT-ALIGN: right;" onblur="$(\'.bwRequest\').bwRequest(\'formatRequestedCapital_InitBudgetRequest\');" type="text">';
            html += '           </div>';
            html += '       </td>';
            html += '   </tr>';
            html += '   <tr class="xdTableOffsetRow2">';
            html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            html += '           <span class="xdlabel" style="color:gray;font-size:10pt;">Amount left to forecast:</span>';
            html += '       </td>';
            html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
            html += '           <div>';
            html += '               <input id="amountLeftToForecast" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 13pt;TEXT-ALIGN: right;" onblur="$(\'.bwRequest\').bwRequest(\'formatRequestedCapital_InitBudgetRequest\');" type="text">';
            html += '           </div>';
            html += '       </td>';
            html += '   </tr>';
            html += '   <tr class="xdTableOffsetRow2">';
            html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            html += '           <span class="xdlabel" style="color:gray;font-size:10pt;">Capitalized Interest Rate (%):</span>';
            html += '       </td>';
            html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
            html += '           <div>';
            html += '               <input id="interestRate" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 13pt;TEXT-ALIGN: right;" onblur="$(\'.bwRequest\').bwRequest(\'formatRequestedCapital_InitBudgetRequest\');" type="text">';
            html += '           </div>';
            html += '       </td>';
            html += '   </tr>';
            html += '</tbody>';
            html += '</table>';

            html += '</td><td style="vertical-align:top;">';
            if (this.options.inFormsEditor != true) {
                //var bwBudgetRequestId = $(thiz.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
                //var requestDialogId = 'divRequestFormDialog_' + bwBudgetRequestId;
                html += '                               <span style="font-size:20pt;cursor:zoom-in;" onclick="$(\'#' + this.options.jsonData.requestDialogId + '\').find(\'.bwSpendGrid\').bwSpendGrid(\'viewInLargeWindow\');"><img class="gridMagnifyingGlass" src="/images/zoom.jpg" style="width:50px;height:50px;" /></span>';
            }
            html += '</td></tr>';

            html += '<tr>';
            html += '   <td>';
            html += '       <span class="xdlabel" id="spanBwSpendGrid_Error" style="color:tomato;white-space:normal;" hidefocus="1"></span>'; // Errors and exceptions get displayed here.
            html += '   </td>';
            html += '</tr>';

            html += '</table>';

            html += '                            </td>';
            html += '                        </tr>';
            html += '                    </tbody>';
            html += '</table>';
            html += '</div>';
            // Render the html.
            if (this.options.inFormsEditor != true) {
                // THIS IS VERY IMPORTANT AND NEEDS TO BE IN EVERY WIDGET!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 7-12-2020
                // Even though the widget regenerates itself (re-renders), the parent TR tag gets missed!!! Therefore we have to handle getting rid of our form editor draggable attribute here.
                this.element.closest('tr').removeAttr('draggable');
            }
            this.element.html(html);


            //if (!($('.bwStartDatePicker') && $('.bwStartDatePicker'))) {

            //    alert('In bwSpendGrid xcx325364y');

            //}
            var startDate = $('.bwStartDatePicker').bwStartDatePicker('getData');
            var endDate = $('.bwEndDatePicker').bwEndDatePicker('getData');
            if (startDate == null || endDate == null) {
            //if (!(startDate && endDate)) { // 1-15-2022
                // do nothing.
                var html = '';
                html += '<span style="color:tomato;font-size:12pt;">Select start and end dates to create this grid...</select>';
                $(this.element).find('#jsGridSpend_small')[0].innerHTML = html;
                //$(this.element).find('#divGridContainer')[0].innerHTML = html;
            } else {
                // If we have jsonData, populate the element.
                //var bwFieldName = 'bwSpendGrid';
                //var json = this.options.jsonData['bwSpendGrid'].value;

                var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
                var columns = [
                    //{ name: "SpendingRowId", type: "text", width: 150, validate: "required" },
                    { name: "Description", type: "text", width: 150 },
                    { name: "Total", type: "number", width: 50 }//,
                    //{ type: "control" }
                ];



                // 1-15-2022
                try {
                    for (var dt = startDate; dt < endDate.addDays(1) ; dt.setMonth(dt.getMonth() + 1)) {
                        var columnName = months[dt.getMonth()] + ' ' + dt.getFullYear();
                        var row = { name: columnName, type: "number", width: 50 };
                        columns.push(row);
                    }
                } catch (e) {
                    console.log('Caught exception in bwSpendGrid...xcx21421343 COME BACK AND FIX THIS.');
                }



                var editColumn = { type: "control" };
                columns.push(editColumn);

                if (thiz.options.jsonData["bwSpendGrid"]) {
                    // already have data
                    //var value = this.options.jsonData['bwCostsGrid'].value;
                    //dataElement.value = value;
                    //debugger;
                    if (thiz.options.jsonData["bwSpendGrid"].value) {

                    } else {
                        thiz.options.jsonData["bwSpendGrid"]["value"] = [];
                    }
                } else {
                    // no data yet
                    thiz.options.jsonData["bwSpendGrid"] = {
                        value: []
                    }
                }

                $(this.element).find("#jsGridSpend_small").jsGrid({
                    width: "400px", // Limiting it here because otherwise it makes the entire form expand horizontally.
                    height: "auto",

                    inserting: true,
                    editing: true,
                    sorting: true,
                    paging: true,

                    confirmDeleting: false, // false prevents the alert from popping up

                    data: thiz.options.jsonData["bwSpendGrid"].value, // json,
                    noDataContent: "Click the \"Plus\" (+) sign to add a Spend item...",

                    onInit: function () {
                        try {
                            console.log('In bwSpendGrid.onInit-small().');
                            //var grandTotal = Number(0);
                            for (var i = 0; i < this.data.length; i++) { 
                                // Now iterate through all the months and add them up. Just ignore "Description" and "Total" fields!!
                                var total = Number(0);
                                for (var c = 0; c < columns.length; c++) {
                                    if (columns[c].type == 'number' && columns[c].name != 'Total') {
                                        var columnName = columns[c].name;
                                        var columnValue = this.data[i][columnName];
                                        if (columnValue) {
                                            total += Number(columnValue);
                                        }
                                    }
                                }
                                this.data[i].Total = total;
                            }
                            //debugger;
                            //$(thiz.element).closest('#budgetrequestform').find("#projectedCapitalSpending_small")[0].value = formatCurrencyNoDecimal(grandTotal); // Update the smaller grid grand total.
                            ////$(thiz.element).find("#projectedCapitalSpending_small")[0].value = formatCurrencyNoDecimal(grandTotal); // Update the smaller grid grand total.

                        } catch (e) {
                            console.log('Exception in bwSpendGrid.onInit: ' + e.message + ', ' + e.stack);
                        }
                    },

                    onRefreshed: function (args) { // jsGridCosts_small
                        try {
                            if (thiz.options.inFormsEditor != true) {
                                var projectedCapitalSpending = Number(0);
                                for (var i = 0; i < this.data.length; i++) {
                                    // Now iterate through all the months and add them up. Just ignore "Description" and "Total" fields!!
                                    for (var c = 0; c < columns.length; c++) {
                                        if (columns[c].type == 'number' && columns[c].name != 'Total') {
                                            var columnName = columns[c].name;
                                            var columnValue = this.data[i][columnName];
                                            if (columnValue) {
                                                projectedCapitalSpending += Number(columnValue);
                                            }
                                        }
                                    }
                                    this.data[i].Total = projectedCapitalSpending;
                                }

                                //var totalLease = Number(0);
                                //var totalExpense = Number(0);
                                //var totalCapital = Number(0);
                                //this.data.forEach(function (item) {
                                //    var total = Number(0);
                                //    if (item.Lease) {
                                //        totalLease += Number(item.Lease);
                                //        total += Number(item.Lease);
                                //    }
                                //    if (item.Expense) {
                                //        totalExpense += Number(item.Expense);
                                //        total += Number(item.Expense);
                                //    }
                                //    if (item.Capital) {
                                //        totalCapital += Number(item.Capital);
                                //        total += Number(item.Capital);
                                //    }
                                //    if (item.Total) {
                                //        item.Total = total;
                                //    }
                                //});
                                //var grandTotal = totalLease + totalExpense + totalCapital;

                                //var html = '';
                                //html += '<tr>';

                                //html += '<td>';
                                //html == 'Total Costs';
                                //html += '</td>';

                                //html += '<td class="jsgrid-cell" style="text-align:right;">';
                                //html += formatCurrencyNoDecimalNoDollarSign(totalLease);
                                //html += '</td>';

                                //html += '<td class="jsgrid-cell" style="text-align:right;">';
                                //html += formatCurrencyNoDecimalNoDollarSign(totalExpense);
                                //html += '</td>';

                                //html += '<td class="jsgrid-cell" style="text-align:right;">';
                                //html += formatCurrencyNoDecimalNoDollarSign(totalCapital);
                                //html += '</td>';

                                //html += '<td class="jsgrid-cell" style="text-align:right;">';
                                //html += formatCurrencyNoDecimalNoDollarSign(grandTotal);
                                //html += '</td>';

                                //html += '</tr>';
                                //this._content.append(html);

                                var amountForecast = projectedCapitalSpending; // Oddly this seems correct..???
                                var amountLeftToForecast = projectedCapitalSpending;



                                thiz.options.jsonData["bwSpendGrid"].value = this.data; // Store in the widget.

                                $(thiz.element).closest('#budgetrequestform').find('#projectedCapitalSpending_small')[0].value = formatCurrencyNoDecimal(projectedCapitalSpending); // Update the smaller grid grand total.
                                $(thiz.element).closest('#budgetrequestform').find('#amountForecast')[0].value = formatCurrencyNoDecimal(amountForecast); // Update the smaller grid grand total.
                                $(thiz.element).closest('#budgetrequestform').find('#amountLeftToForecast')[0].value = formatCurrencyNoDecimal(amountLeftToForecast); // Update the smaller grid grand total.
                                $(thiz.element).closest('#budgetrequestform').find('#interestRate')[0].value = formatCurrencyNoDecimal(projectedCapitalSpending); // Update the smaller grid grand total.

                            }
                        } catch (e) {
                            console.log('Exception in bwSpendGrid.onRefreshed: ' + e.message + ', ' + e.stack);
                            $('#spanBwSpendGrid_Error')[0].innerHTML = 'Exception in bwSpendGrid.onRefreshed: ' + e.message + ', ' + e.stack;
                        }
                    },

                    onItemInserted: function () {
                        try {
                            //console.log('In bwCostsGrid.onItemInserted().');
                            var bwBudgetRequestId = $(thiz.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
                            var requestDialogId = 'divZoomedBwSpendGridDialog_' + bwBudgetRequestId;
                            if ($('#' + requestDialogId).find('#jsGridSpend_large')) { // If the large one is displayed, update it!
                                $('#' + requestDialogId).find("#jsGridSpend_large").jsGrid("option", "data", thiz.options.jsonData["bwSpendGrid"].value); // Update the larger grid.
                            }

                        } catch (e) {
                            console.log('Exception in bwSpendGrid.onItemInserted: ' + e.message + ', ' + e.stack);
                            $('#spanBwSpendGrid_Error')[0].innerHTML = 'Exception in bwSpendGrid.onItemInserted: ' + e.message + ', ' + e.stack;
                        }
                    },
                    onItemUpdated: function () {
                        try {
                            //console.log('In bwCostsGrid.onItemInserted().');
                            var bwBudgetRequestId = $(thiz.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
                            var requestDialogId = 'divZoomedBwSpendGridDialog_' + bwBudgetRequestId;
                            if ($('#' + requestDialogId).find('#jsGridSpend_large')) { // If the large one is displayed, update it!
                                $('#' + requestDialogId).find("#jsGridSpend_large").jsGrid("option", "data", thiz.options.jsonData["bwSpendGrid"].value); // Update the larger grid.
                            }

                        } catch (e) {
                            console.log('Exception in bwSpendGrid.onItemInserted: ' + e.message + ', ' + e.stack);
                            $('#spanBwSpendGrid_Error')[0].innerHTML = 'Exception in bwSpendGrid.onItemUpdated: ' + e.message + ', ' + e.stack;
                        }
                    },
                    onItemDeleted: function () {
                        try {
                            //console.log('In bwCostsGrid.onItemInserted().');
                            var bwBudgetRequestId = $(thiz.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
                            var requestDialogId = 'divZoomedBwSpendGridDialog_' + bwBudgetRequestId;
                            if ($('#' + requestDialogId).find('#jsGridSpend_large')) { // If the large one is displayed, update it!
                                $('#' + requestDialogId).find("#jsGridSpend_large").jsGrid("option", "data", thiz.options.jsonData["bwSpendGrid"].value); // Update the larger grid.
                            }

                        } catch (e) {
                            console.log('Exception in bwSpendGrid.onItemInserted: ' + e.message + ', ' + e.stack);
                            $('#spanBwSpendGrid_Error')[0].innerHTML = 'Exception in bwSpendGrid.onItemDeleted: ' + e.message + ', ' + e.stack;
                        }
                    },

                    fields: columns
                });
            }
            
            //$(this.element).find('#gridSummaryFields')[0].innerHTML = html;

        } catch (e) {
            console.log('Exception in renderAndPopulateSpendGrid: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwSpendGrid</span>';
            html += '<br />';
            html += '<span style="">Exception in bwSpendGrid.renderAndPopulateSpendGrid(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    },

    viewInLargeWindow: function () {
        try {
            console.log('In bwCostsGrid.viewInLargeWindow().');
            var thiz = this;

            window.scrollTo(0, 0);
            $('.bwActiveMenu').bwActiveMenu('adjustLeftSideMenu'); // This makes sure our new stretchy-left-menu redraws Ok.

            var bwBudgetRequestId = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
            var bwRequestType = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwrequesttype');
            var bwRequestTitle = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwrequesttitle');
            this.pinRequestDialog();
            var requestDialogId = 'divZoomedBwSpendGridDialog_' + bwBudgetRequestId;
            if ($('#' + requestDialogId).is(':visible')) {
                $('#' + requestDialogId).dialog('close');
            }
            var html = '';
            //html += '<div style="display:none;" id="divRequestFormDialog">';
            html += '        <table style="width:100%;">';
            html += '            <tr>';
            html += '                <td style="width:90%;">';
            //html += '                    <span id="divRequestWorkflowAuditTrailContent"></span>';
            html += '                    <span id="divRequestFormContent"></span>';
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
                position: {
                    my: "middle top+12",
                    at: "middle top",
                    of: window
                },
                open: function () {
                    try {
                        var element2 = document.getElementById(requestDialogId).parentNode; // This is the best way to get a handle on the jquery dialog.
                        var requestDialogParentId = requestDialogId + '_Parent'; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.
                        element2.id = requestDialogParentId; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.

                        // This creates the custom header/draggable bar on the dialog!!! 4-2-2020. // ☈ ☇ https://www.toptal.com/designers/htmlarrows/symbols/thunderstorm/
                        var html = '';
                        html += '<table style="width:100%;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequestDialog\');" ondblclick="$(\'.bwRequest\').bwRequest(\'zoomAndCenter\', \'' + requestDialogId + '\');">'; // This click event is like "pin". Once the user clicks the header of the request dialog, it no longer is modal and persists on the screen until they choose to close it.
                        html += '   <tr>';
                        html += '       <td style="width:95%;">';
                        //html += '           <div id="slider_' + requestDialogId + '" style="width:20%;cursor:pointer;">[' + 'slider_' + requestDialogId + ']</div>';
                        html += '           <div id="slider_' + requestDialogId + '" style="width:20%;cursor:pointer;"></div>';
                        html += '       </td>';
                        html += '       <td>';
                        html += '           <span class="dialogXButton" style="font-size:25pt;cursor:pointer;width:100%;font-weight:bold;" onclick="$(\'#' + requestDialogId.replace('_Parent', '') + '\').dialog(\'close\');">X</span>';
                        html += '       </td>';
                        html += '   </tr>';
                        html += '</table>';

                        document.getElementById(requestDialogId).parentNode.querySelector(".ui-dialog-titlebar").innerHTML = html;

                        html = '';
                        //var form = $('#divNewRequest').find('#budgetrequestform'); // var bwBudgetRequestId = $(element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
                        var bwOrgId = $(thiz.element).closest('#budgetrequestform')[0].getAttribute('bworgid'); // $('#' + requestDialogId).find('#budgetrequestform')[0].getAttribute('bworgid'); // document.getElementById('budgetrequestform').getAttribute('bworgid'); // selected OrgId on the new request form: txtLocationPickerFilter attribute bworgid
                        var bwOrgName = $(thiz.element).closest('#budgetrequestform')[0].getAttribute('bworgname'); // document.getElementById('budgetrequestform').getAttribute('bworgname'); // selected OrgId on the new request form: txtLocationPickerFilter attribute bworgid

                        html += '<div id="budgetrequestworkflowparticipantsdialog" class="context-menu-newrequesteditorxx" align="left" bwbudgetrequestid="" bwrequesttype="" orgid="" orgname="">';
                        html += '<table style="BORDER-TOP-STYLE: none; WORD-WRAP: break-word; BORDER-LEFT-STYLE: none; BORDER-COLLAPSE: collapse; TABLE-LAYOUT: fixed; BORDER-BOTTOM-STYLE: none; BORDER-RIGHT-STYLE: none; " class="xdFormLayout">';
                        html += '    <colgroup>';
                        html += '        <col style="" />';
                        html += '    </colgroup>';
                        html += '    <tbody>';
                        html += '        <tr class="xdTableContentRow">';
                        html += '            <td style="display:block;BORDER-TOP: #d8d8d8 1pt solid; BORDER-RIGHT: #d8d8d8 1pt solid; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 0px; PADDING-TOP: 0px; PADDING-LEFT: 0px; BORDER-LEFT: #d8d8d8 1pt solid; PADDING-RIGHT: 0px" class="xdTableContentCell">';
                        html += '                <div />';
                        html += '                <table style="width:100%;">';
                        html += '                    <tr>';
                        html += '                        <td colspan="4">';
                        html += '                           <span id="' + requestDialogId + '_requestOrgClickableBreadcrumb" style="color:purple;font-size:8pt;">' + bwOrgName + '</span>';
                        html += '                       </td>';
                        html += '                    </tr>';
                        html += '                    <tr>';
                        html += '                        <td width="5px"></td>';
                        html += '                        <td>';
                        html += '                   <span>';
                        html += '<img id="' + requestDialogId + '_imgRequestOrgImage" src="' + thiz.options.operationUriPrefix + 'images/corporeal.png" style="width:100px;height:100px;"/>';



                        // Try to get a custom image. If none found, use the OOB one.
                        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

                        var imagePath;

                        var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                            return v.toString(16);
                        });

                        var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

                        if (activeStateIdentifier.status != 'SUCCESS') {

                            imagePath += '[No image. Unauthorized. xcx213124-3-6664323-3]';

                        } else {

                            imagePath = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/orgimages/' + bwOrgId + '/' + 'orgimage.png?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;

                        }

                        $.get(imagePath).done(function () {
                            setTimeout(function () { // Only needs to happen for Chrome.
                                $('#' + requestDialogId + '_imgRequestOrgImage').attr('src', imagePath);
                            }, 500);
                        }).fail(function () {
                            //alert("This org has no image."); // do nothing 
                        });
                        // End: Getting the custom image


















                        html += '                   </span>';
                        html += '                        </td>';
                        html += '                        <td colspan="2" style="text-align:left;vertical-align:top;">';
                        //html += '                           &nbsp;&nbsp;<span id="' + requestDialogParentId + '_BwRequestType" style="font-size:1em;">';
                        //html += '                               [._BwRequestType]';
                        //html += '                           </span>';
                        html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 40pt;font-weight:bold;">Spend Forecast</span>';
                        html += '                           <br />';
                        //html += '                           <span id="' + requestDialogParentId + '_WorkflowGuid" style="color:gray;">[._WorkflowGuid]</span>';
                        if (bwRequestTitle == 'New') {
                            html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 25pt;font-weight:bold;">for New Budget Request</span>';
                        } else {
                            html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 25pt;font-weight:bold;cursor:pointer;text-decoration:underline;" '; //>for Budget Request: ' + bwRequestTitle + '</span>';
                            html += 'onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'' + bwBudgetRequestId + '\', \'' + bwRequestTitle + '\', \'\', \'' + bwRequestTitle + '\', \'\');" >';
                            html += 'for Budget Request: ' + bwRequestTitle + '</span>';
                        }
                        //html += '                           <br />';
                        //html += '                           <span style="text-decoration:underline;cursor:pointer;" onclick="$(\'.bwRequest\').bwRequest(\'displayNewRequestWorkflowParticipantsDialog\');" >View Workflow/Participants</span>';
                        html += '                        </td>';
                        html += '                    </tr>';
                        //html += '<tr><td colspan="4" style="height:15px;"></td></tr>';


                        html += '<tr>';
                        html += '   <td colspan="4" style="height:15px;">';
                        html += '       <span class="xdlabel" id="spanBwSpendGrid_Error" style="color:tomato;" hidefocus="1"></span>'; // Errors and exceptions get displayed here.
                        html += '   </td>';
                        html += '</tr>';

                        html += '                </table>';

                        html += '<span id="' + requestDialogParentId + '_Content"></span>';
                        document.getElementById(requestDialogId).innerHTML = html;

                        $("#slider_" + requestDialogId).slider({
                            min: 50,
                            max: 200,
                            value: 100, // It starts off full size.
                            slide: function (event, ui) {
                                thiz.setZoom(ui.value, requestDialogId);
                            }//,
                            //change: function (event, ui) {
                            //    thiz.setZoom(ui.value, requestDialogId);
                            //}
                        });
                        thiz.setZoom(100, requestDialogId);

                        var html = '';
                        html += '   <table>';
                        html += '       <tr>';
                        html += '           <td>';
                        html += '               <div id="jsGridSpend_large" style="font-size:60%;"></div>';
                        html += '           </td>';
                        //html += '           <td style="vertical-align:top;">';
                        //html += '               <span style="font-size:20pt;cursor:zoom-in;" onclick="$(\'.bwCostsGrid\').bwCostsGrid(\'viewInLargeWindow\');"><img class="gridMagnifyingGlass" src="/images/zoom.jpg" style="width:50px;height:50px;" /></span>';
                        //html += '           </td>';
                        html += '       </tr>';
                        html += '       <tr>';
                        html += '           <td>';



                        html += '<table class="xdFormLayout xdTableStyleTwoCol" style="BORDER-TOP-STYLE: none; WORD-WRAP: break-word; BORDER-LEFT-STYLE: none; BORDER-COLLAPSE: collapse; TABLE-LAYOUT: fixed; BORDER-BOTTOM-STYLE: none; BORDER-RIGHT-STYLE: none;">';
                        html += '   <colgroup>';
                        html += '       <col style="WIDTH: 195px" />';
                        html += '       <col style="" />';
                        html += '   </colgroup>';
                        html += '<tbody valign="top">';

                        html += '   <tr class="xdTableOffsetRow2">';
                        html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
                        html += '           <span class="xdlabel" style="color:gray;font-size:10pt;">Projected Capital Spending:</span>';
                        html += '       </td>';
                        html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
                        html += '           <div>';
                        html += '               <input id="projectedCapitalSpending_large" style="WIDTH: 140px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 13pt;TEXT-ALIGN: right;" onblur="$(\'.bwRequest\').bwRequest(\'formatRequestedCapital_InitBudgetRequest\');" type="text">';
                        html += '           </div>';
                        html += '       </td>';
                        html += '   </tr>';
                        html += '   <tr class="xdTableOffsetRow2">';
                        html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
                        html += '           <span class="xdlabel" style="color:gray;font-size:10pt;">Amount Forecast:</span>';
                        html += '       </td>';
                        html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
                        html += '           <div>';
                        html += '               <input id="amountForecast" style="WIDTH: 140px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 13pt;TEXT-ALIGN: right;" onblur="$(\'.bwRequest\').bwRequest(\'formatRequestedCapital_InitBudgetRequest\');" type="text">';
                        html += '           </div>';
                        html += '       </td>';
                        html += '   </tr>';
                        html += '   <tr class="xdTableOffsetRow2">';
                        html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
                        html += '           <span class="xdlabel" style="color:gray;font-size:10pt;">Amount left to forecast:</span>';
                        html += '       </td>';
                        html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
                        html += '           <div>';
                        html += '               <input id="amountLeftToForecast" style="WIDTH: 140px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 13pt;TEXT-ALIGN: right;" onblur="$(\'.bwRequest\').bwRequest(\'formatRequestedCapital_InitBudgetRequest\');" type="text">';
                        html += '           </div>';
                        html += '       </td>';
                        html += '   </tr>';
                        html += '   <tr class="xdTableOffsetRow2">';
                        html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
                        html += '           <span class="xdlabel" style="color:gray;font-size:10pt;">Capitalized Interest Rate (%):</span>';
                        html += '       </td>';
                        html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
                        html += '           <div>';
                        html += '               <input id="interestRate" style="WIDTH: 140px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 13pt;TEXT-ALIGN: right;" onblur="$(\'.bwRequest\').bwRequest(\'formatRequestedCapital_InitBudgetRequest\');" type="text">';
                        html += '           </div>';
                        html += '       </td>';
                        html += '   </tr>';
                        html += '</tbody>';
                        html += '</table>';




                        html += '               <br /><br />';
                        html += '           </td>';
                        html += '       </tr>';
                        html += '   </table';
                        document.getElementById(requestDialogParentId + '_Content').innerHTML = html;

                        // If we have jsonData, populate the element.
                        if (thiz.options.jsonData["bwSpendGrid"]) {
                            // already have data
                        } else {
                            // no data yet
                            thiz.options.jsonData["bwSpendGrid"] = {
                                value: null
                            }
                        }

                        var startDate = $('.bwStartDatePicker').bwStartDatePicker('getData');
                        var endDate = $('.bwEndDatePicker').bwEndDatePicker('getData');
                        if (startDate == null || endDate == null) {
                            // do nothing.
                            var html = '';
                            html += '<span style="color:tomato;font-size:12pt;">Select start and end dates to create this grid...</select>';
                            $('#' + requestDialogParentId + '_Content').find('#jsGridSpend_large')[0].innerHTML = html;
                            //$(this.element).find('#divGridContainer')[0].innerHTML = html;
                        } else {
                            // If we have jsonData, populate the element.
                            //var bwFieldName = 'bwSpendGrid';
                            //var json = this.options.jsonData['bwSpendGrid'].value;

                            // If we have jsonData, populate the element.
                            if (thiz.options.jsonData["bwSpendGrid"]) {
                                // already have data
                            } else {
                                // no data yet
                                thiz.options.jsonData["bwSpendGrid"] = {
                                    value: null
                                }
                            }

                            var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
                            var columns = [
                                //{ name: "SpendingRowId", type: "text", width: 150, validate: "required" },
                                { name: "Description", type: "text", width: 150 },
                                { name: "Total", type: "number", width: 50 }//,
                                //{ type: "control" }
                            ];
                            for (var dt = startDate; dt < endDate.addDays(1) ; dt.setMonth(dt.getMonth() + 1)) {
                                var columnName = months[dt.getMonth()] + ' ' + dt.getFullYear();
                                var row = { name: columnName, type: "number", width: 50 };
                                columns.push(row);
                            }
                            var editColumn = { type: "control" };
                            columns.push(editColumn);

                            $('#' + requestDialogParentId + '_Content').find("#jsGridSpend_large").jsGrid({
                                width: "100%",
                                //height: "400px",

                                //width: "auto",
                                height: "auto",

                                confirmDeleting: false, // false prevents the alert from popping up

                                inserting: true,
                                editing: true,
                                sorting: true,
                                paging: true,

                                data: thiz.options.jsonData["bwSpendGrid"].value, // json,
                                noDataContent: "Click the \"Plus\" (+) sign to add a Spend item...",

                                onRefreshed: function (args) { // jsGridCosts_small
                                    try {
                                        //debugger;
                                        var grandTotal = Number(0);
                                        for (var i = 0; i < this.data.length; i++) {
                                            // Now iterate through all the months and add them up. Just ignore "Description" and "Total" fields!!
                                            for (var c = 0; c < columns.length; c++) {
                                                if (columns[c].type == 'number' && columns[c].name != 'Total') {
                                                    var columnName = columns[c].name;
                                                    var columnValue = this.data[i][columnName];
                                                    if (columnValue) {
                                                        grandTotal += Number(columnValue);
                                                    }
                                                }
                                            }
                                            this.data[i].Total = grandTotal;
                                        }

                                        //var totalLease = Number(0);
                                        //var totalExpense = Number(0);
                                        //var totalCapital = Number(0);
                                        //this.data.forEach(function (item) {
                                        //    var total = Number(0);
                                        //    if (item.Lease) {
                                        //        totalLease += Number(item.Lease);
                                        //        total += Number(item.Lease);
                                        //    }
                                        //    if (item.Expense) {
                                        //        totalExpense += Number(item.Expense);
                                        //        total += Number(item.Expense);
                                        //    }
                                        //    if (item.Capital) {
                                        //        totalCapital += Number(item.Capital);
                                        //        total += Number(item.Capital);
                                        //    }
                                        //    if (item.Total) {
                                        //        item.Total = total;
                                        //    }
                                        //});
                                        //var grandTotal = totalLease + totalExpense + totalCapital;

                                        //var html = '';
                                        //html += '<tr>';

                                        //html += '<td>';
                                        //html == 'Total Costs';
                                        //html += '</td>';

                                        //html += '<td class="jsgrid-cell" style="text-align:right;">';
                                        //html += formatCurrencyNoDecimalNoDollarSign(totalLease);
                                        //html += '</td>';

                                        //html += '<td class="jsgrid-cell" style="text-align:right;">';
                                        //html += formatCurrencyNoDecimalNoDollarSign(totalExpense);
                                        //html += '</td>';

                                        //html += '<td class="jsgrid-cell" style="text-align:right;">';
                                        //html += formatCurrencyNoDecimalNoDollarSign(totalCapital);
                                        //html += '</td>';

                                        //html += '<td class="jsgrid-cell" style="text-align:right;">';
                                        //html += formatCurrencyNoDecimalNoDollarSign(grandTotal);
                                        //html += '</td>';

                                        //html += '</tr>';
                                        //this._content.append(html);

                                        thiz.options.jsonData["bwSpendGrid"].value = this.data; // Store in the widget.

                                        var bwBudgetRequestId = $(thiz.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
                                        var requestDialogId = 'divZoomedBwSpendGridDialog_' + bwBudgetRequestId;
                                        $('#' + requestDialogId).find('#projectedCapitalSpending_large')[0].value = formatCurrencyNoDecimal(grandTotal); // Update the smaller grid grand total.
                                        $('#' + requestDialogId).find('#amountForecast')[0].value = formatCurrencyNoDecimal(grandTotal); // Update the smaller grid grand total.
                                        $('#' + requestDialogId).find('#amountLeftToForecast')[0].value = formatCurrencyNoDecimal(grandTotal); // Update the smaller grid grand total.
                                        $('#' + requestDialogId).find('#interestRate')[0].value = formatCurrencyNoDecimal(grandTotal); // Update the smaller grid grand total.


                                        //document.getElementById('projectedCapitalSpending_small').value = formatCurrencyNoDecimal(grandTotal);
                                        //debugger;
                                        //$("#projectedCapitalSpending_small").value = formatCurrencyNoDecimal(grandTotal); // Update the smaller grid grand total.

                                        //if ($(thiz.element).closest('#budgetrequestform').find("#projectedCapitalSpending_small")[0]) {
                                        //$(thiz.element).closest('#budgetrequestform').find('#projectedCapitalSpending_small')[0].value = formatCurrencyNoDecimal(grandTotal); // Update the smaller grid grand total.
                                        //}

                                        //var bwBudgetRequestId = $(thiz.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
                                        //var requestDialogId = 'divZoomedBwCostsGridDialog_' + bwBudgetRequestId;
                                        //if ($('#' + requestDialogId).find('#jsGridCosts_large')) { // If the large one is displayed, update it!
                                        //    if ($('#' + requestDialogId).find('#grandTotal_large')[0]) {
                                        //        $('#' + requestDialogId).find('#grandTotal_large')[0].value = formatCurrencyNoDecimal(grandTotal); // Update the grand total in the large window.
                                        //    }
                                        //}

                                    } catch (e) {
                                        console.log('Exception in bwSpendGrid.onRefreshed: ' + e.message + ', ' + e.stack);
                                        $('#spanBwSpendGrid_Error')[0].innerHTML = 'Exception in bwSpendGrid.onRefreshed: ' + e.message + ', ' + e.stack;
                                    }
                                },
                                onItemInserted: function () {
                                    try {
                                        //console.log('In bwCostsGrid.onItemInserted().');
                                        thiz.options.jsonData["bwSpendGrid"].value = this.data; // Store in the widget.
                                        $(thiz.element).closest('#budgetrequestform').find("#jsGridSpend_small").jsGrid("option", "data", thiz.options.jsonData["bwSpendGrid"].value); // Update the smaller grid.
                                    } catch (e) {
                                        console.log('Exception in bwCostsGrid.onItemInserted: ' + e.message + ', ' + e.stack);
                                    }
                                },
                                onItemUpdated: function () {
                                    try {
                                        //console.log('In bwCostsGrid.onItemInserted().');
                                        thiz.options.jsonData["bwSpendGrid"].value = this.data; // Store in the widget.
                                        $(thiz.element).closest('#budgetrequestform').find("#jsGridSpend_small").jsGrid("option", "data", thiz.options.jsonData["bwSpendGrid"].value); // Update the smaller grid.
                                    } catch (e) {
                                        console.log('Exception in bwCostsGrid.onItemInserted: ' + e.message + ', ' + e.stack);
                                    }
                                },
                                onItemDeleted: function () {
                                    try {
                                        //console.log('In bwCostsGrid.onItemInserted().');
                                        thiz.options.jsonData["bwSpendGrid"].value = this.data; // Store in the widget.
                                        $(thiz.element).closest('#budgetrequestform').find("#jsGridSpend_small").jsGrid("option", "data", thiz.options.jsonData["bwSpendGrid"].value); // Update the smaller grid.
                                    } catch (e) {
                                        console.log('Exception in bwCostsGrid.onItemInserted: ' + e.message + ', ' + e.stack);
                                    }
                                },

                                fields: columns
                            });
                        }

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
        } catch (e) {
            console.log('Exception in bwSpendGrid.viewInLargeWindow(): ' + e.message + ', ' + e.stack);
        }
    },

    displayAlertDialog: function (errorMessage) {
        try {
            //debugger;
            var element = $("#divAlertDialog");
            $(element).find('#spanErrorMessage')[0].innerHTML = errorMessage;
            $(element).dialog({
                modal: true,
                resizable: false,
                //closeText: "Cancel",
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                //title: 'Add a New Person',
                width: '800',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divAlertDialog").dialog('close');
                    });
                },
                close: function () {
                    //$(this).dialog('destroy').remove();
                }
            });
            $(element).dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
        } catch (e) {
            console.log('Exception in bwSpendGrid.displayAlertDialog(): ' + e.message + ', ' + e.stack);
        }
    }

    //renderSpendForecast2: function () {
    //    try {
    //        console.log('In renderSpendForecast2().');

    //        var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

    //        var projCapitalSpending = 0;

    //        var spendForecastItems = new DevExpress.data.CustomStore({
    //            key: "ProjSpendingRowId",
    //            load: function (loadOptions) {
    //                var deferred = $.Deferred(),
    //                    args = {};
    //                if (loadOptions.sort) {
    //                    args.orderby = loadOptions.sort[0].selector;
    //                    if (loadOptions.sort[0].desc)
    //                        args.orderby += " desc";
    //                }
    //                args.skip = loadOptions.skip;
    //                args.take = loadOptions.take;
    //                $.ajax({
    //                    url: operationUriPrefix + "odata/vSpendForecasts?$filter=CARId eq " + gCarId,
    //                    dataType: "json",
    //                    data: args,
    //                    success: function (result) {
    //                        //console.log('In CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.vSpendForecasts.result.value: ' + JSON.stringify(result.value));
    //                        var unformatted = result.value;
    //                        var fiscalYear = document.getElementById('fiscalYear').value;
    //                        var dataGridRows = [];
    //                        //
    //                        // We always load with empty json because we don't know for certain the db has data for each month. (and the dxDataGrid is drawn based on this because it does it automatically.)
    //                        //
    //                        var startDate = $("#StartDate").datepicker('getData');
    //                        var endDate = $("#EndDate").datepicker('getData');
    //                        //alert('StartDate: ' + startDate + ' | EndDate: ' + endDate);
    //                        if (startDate == null || endDate == null) {
    //                            alert('4: Before you can enter "Spend Forecast" information, you must choose "Project Start Date" and "Completion Date" on the "BASIC INFO" tab.');
    //                            $('#tabs').tabs({ active: 0 }); // The dates weren't filled out, so take the user back to the 'BASIC INFO' tab.
    //                        } else {
    //                            //console.log('In CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems. startDate: ' + startDate + ', endDate: ' + endDate);
    //                            var dataGridRow = [];
    //                            dataGridRow = { "ProjSpendingRowId": null, "Title": null, "Fcst Total": null };
    //                            for (var dt = startDate; dt < endDate.addDays(1) ; dt.setMonth(dt.getMonth() + 1)) {
    //                                //console.log('In CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems. dt: ' + dt);
    //                                var columnName = months[dt.getMonth()] + ' ' + dt.getFullYear();
    //                                dataGridRow[columnName] = 0; //null;
    //                            }
    //                            dataGridRows.push(dataGridRow);
    //                        }
    //                        //
    //                        // This data comes in as several rows for each Spending row, so we have to merge all these lines into 1 line for each Spending row.
    //                        //
    //                        var spendingRow;
    //                        var spendingRows = [];
    //                        var projSpendingRow = [];
    //                        var projSpendingRowId, oldProjSpendingRowId;
    //                        for (var i = 0; i < unformatted.length; i++) {
    //                            projSpendingRowId = unformatted[i].ProjSpendingRowId;
    //                            //console.log('In CarForm3.aspx.populateSpendForecastNotReadOnly(). projSpendingRowId: ' + projSpendingRowId + ', oldProjSpendingRowId: ' + oldProjSpendingRowId + ', unformatted[' + i + ']: ' + JSON.stringify(unformatted[i]));
    //                            if (projSpendingRowId) {
    //                                if (projSpendingRowId == oldProjSpendingRowId) {
    //                                    // Do nothing, we will be adding to our current spending row.
    //                                } else {
    //                                    if (spendingRow) spendingRows.push(spendingRow); // Add our row, now that we have it completed. The if statement accomodate for the first time through.
    //                                    spendingRow = []; // We need to initalize a new spending row.
    //                                    spendingRow = { "CARId": unformatted[i].CARId, "ProjSpendingRowId": unformatted[i].ProjSpendingRowId, "Title": unformatted[i].Title, "MonthColumns": [] };
    //                                    //console.log('spendingRow: ' + JSON.stringify(spendingRow));
    //                                    oldProjSpendingRowId = unformatted[i].ProjSpendingRowId;
    //                                }
    //                            }
    //                            var monthColumn = [];
    //                            monthColumn = { "ProjSpendingId": unformatted[i].ProjSpendingId, "OrdinalMonth": unformatted[i].OrdinalMonth, "MonthStartDate": unformatted[i].MonthStartDate, "Spend": unformatted[i].Spend };
    //                            spendingRow.MonthColumns.push(monthColumn);
    //                            //console.log('In CarForm3.aspx.populateSpendForecastNotReadOnly().spendingRow: ' + JSON.stringify(spendingRow));
    //                        }
    //                        spendingRows.push(spendingRow); // Add our row, now that we have it completed. // This line gets the last one! :)
    //                        console.log('In CarForm3.aspx.populateSpendForecastNotReadOnly().spendingRows: ' + JSON.stringify(spendingRows));
    //                        //
    //                        // Now that we have the data in a reasonable format, we are going to format it one more time so that the grid can be auto generated.
    //                        //
    //                        //if (spendingRows) {
    //                        for (var i = 0; i < spendingRows.length; i++) {
    //                            var dataGridRow = [];
    //                            dataGridRow = { "ProjSpendingRowId": spendingRows[i].ProjSpendingRowId, "Title": spendingRows[i].Title, "Fcst Total": null };
    //                            var projSpendingIds = [];
    //                            for (var month = 0; month < spendingRows[i].MonthColumns.length; month++) {
    //                                var dtMonth = new Date(spendingRows[i].MonthColumns[month].MonthStartDate);
    //                                // This is our data column, which we can refer to by the column above.
    //                                var columnName = months[dtMonth.getMonth()] + ' ' + dtMonth.getFullYear(); // + '|' + spendingRows[i].MonthColumns[month].ProjSpendingId;
    //                                dataGridRow[columnName] = spendingRows[i].MonthColumns[month].Spend;
    //                            }
    //                            dataGridRows.push(dataGridRow);
    //                        }
    //                        //}
    //                        console.log('In CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.vSpendForecasts: >>>>>> dataGridRows: ' + JSON.stringify(dataGridRows));
    //                        //}
    //                        // Remove the empty row we used to set up our json object.
    //                        for (var k = 0; k < dataGridRows.length; k++) {
    //                            //console.log('dataGridRows[k].Title: ' + dataGridRows[k].Title);
    //                            if (dataGridRows[k].Title == null) {
    //                                delete dataGridRows[k];
    //                            }
    //                        }
    //                        deferred.resolve(dataGridRows, {});
    //                    },
    //                    error: function (data) {
    //                        var error = JSON.parse(data.responseText)["odata.error"];
    //                        var errormsg = 'Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.CustomStore.load(): ' + error.message.value;
    //                        if (error.innererror.message) errormsg += ' ' + error.innererror.message;
    //                        if (error.innererror.internalexception.message) errormsg += ' ' + error.innererror.internalexception.message;
    //                        deferred.reject("Data Loading Error : " + errormsg);
    //                    },
    //                    timeout: 60000
    //                });
    //                return deferred.promise();
    //            },
    //            insert: function (values) {
    //                //lpSpinner.SetText('Updating the Spend Forecast...');
    //                //lpSpinner.Show();
    //                if (values) { // Just checking if we need to save anything.
    //                    // Save the "Title/Name".
    //                    var title = values["Title"]; // The "Title/Name" value.
    //                    var updateJson = { "CARId": gCarId, "Name": title };
    //                    console.log('INSERT: updateJson: ' + JSON.stringify(updateJson) + ', values: ' + JSON.stringify(values)); // eg: INSERT: CARID: 896, values: {"Title":"test","July 2019":1,"Aug 2019":2,"Sept 2019":3,"Oct 2019":4}
    //                    $.ajax({
    //                        url: operationUriPrefix + "odata/ProjSpendingRows",
    //                        dataType: "json",
    //                        contentType: "application/json",
    //                        type: "Post",
    //                        data: JSON.stringify(updateJson)
    //                    }).done(function (result2) {
    //                        try {
    //                            console.log('SUCCESSFULLY inserted into ProjSpendingRows: ' + JSON.stringify(result2)); // eg: SUCCESSFULLY called Patch 999: {"odata.metadata":"https://localhost:44347/odata/$metadata#ProjSpendingRows/@Element","ProjSpendingRowId":569,"CARId":896,"CostSheetId":null,"Name":"test5"}
    //                            var projSpendingRowId = result2.ProjSpendingRowId;


    //                            var updateJsons = [];
    //                            for (var dt = $("#StartDate").datepicker('getData') ; dt < $("#EndDate").datepicker('getData').addDays(1) ; dt.setMonth(dt.getMonth() + 1)) {
    //                                console.log('In CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems. dt: ' + dt + ', getMonth(): ' + dt.getMonth());
    //                                var columnName = months[dt.getMonth()] + ' ' + dt.getFullYear();
    //                                var monthStartDate = new Date(dt.getFullYear(), dt.getMonth(), 1);
    //                                var spend = values[columnName];
    //                                var updateJson = { "ProjSpendingRowId": projSpendingRowId, "OrdinalMonth": dt.getMonth(), "MonthStartDate": monthStartDate, "Spend": spend };
    //                                console.log('updateJson: ' + JSON.stringify(updateJson));



    //                                $.ajax({
    //                                    url: operationUriPrefix + "odata/ProjSpendings",
    //                                    dataType: "json",
    //                                    contentType: "application/json",
    //                                    type: "Post",
    //                                    data: JSON.stringify(updateJson)
    //                                }).done(function (result2) {
    //                                    try {

    //                                        $("#jsGridSpendForecast").dxDataGrid("instance").refresh();
    //                                        $("#jsGridSpendForecastSummary").dxDataGrid("instance").refresh();

    //                                        console.log('PPPPPPPPP:::: result2: ' + result2);


    //                                    } catch (e) {
    //                                        console.log('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + e.message + ', ' + e.stack);
    //                                    }
    //                                }).fail(function (data) {
    //                                    console.log('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
    //                                    var error = JSON.parse(data.responseText)["odata.error"];
    //                                    alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
    //                                });

    //                                //updateJsons.push(updateJson);
    //                            }

    //                            //console.log('updateJsons: ' + JSON.stringify(updateJsons));
    //                            //var updateJson = { "ProjSpendingRowId": projSpendingRowId, "OrdinalMonth": ordinalMonth, "MonthStartDate": monthStartDate, "Spend": spend };

    //                            // WE NEED TO GET THE SCREEN TO REFRESH HERE!!!!!!!!!!!!!
    //                            console.log('WE NEED TO GET THE SCREEN TO REFRESH HERE!!!!!!!!!!!!!');

    //                        } catch (e) {
    //                            console.log('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + e.message + ', ' + e.stack);
    //                        }
    //                    }).fail(function (data) {
    //                        console.log('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
    //                        var error = JSON.parse(data.responseText)["odata.error"];
    //                        alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
    //                    });
    //                }
    //                else {
    //                    console.log('There was nothing to save back to the database.');
    //                    alert('There was nothing to save back to the database.');
    //                }
    //            },
    //            update: function (keys, values) {
    //                lpSpinner.SetText('Updating the Spend Forecast...');
    //                lpSpinner.Show();
    //                console.log('In CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: keys: ' + JSON.stringify(keys) + ', values: ' + JSON.stringify(values)); // eg: yyyyyyyyyyyyyyyyyyyyyyyyyy values: {"July 2019":7777}
    //                if (values) { // Just checking if we need to save anything.
    //                    var columnNames = Object.keys(values); // Get the column/field names so we can decide how to save things below...
    //                    console.log('Object.keys(values): columnNames: ' + columnNames);
    //                    var projSpendingRowId = keys; // The "ProjSpendingId" value.
    //                    //
    //                    // First we check if the title has been changed. If so, save it to the database.
    //                    //
    //                    if (columnNames.indexOf('Title') > -1) {
    //                        var ci = columnNames.indexOf('Title');
    //                        var title = values[columnNames[ci]]; // The "Title/Name" value.
    //                        var updateJson = { "Name": title };
    //                        console.log('In CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update.Title: Updating the Title: projSpendingRowId: ' + projSpendingRowId + ', updateJson: ' + JSON.stringify(updateJson));
    //                        $.ajax({
    //                            url: operationUriPrefix + "odata/ProjSpendingRows(" + projSpendingRowId + ")",
    //                            dataType: "json",
    //                            contentType: "application/json",
    //                            type: "Patch",
    //                            data: JSON.stringify(updateJson)
    //                        }).done(function (result2) {
    //                            try {
    //                                lpSpinner.Hide();
    //                                if (result2) {
    //                                    alert('Error: ' + JSON.stringify(result2));
    //                                } else {
    //                                    // If nothing comes back here (undefined) then it is Ok.
    //                                    console.log('In CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update.Title: SUCCESSFULLY updated the ProjSpendingRow table: projSpendingRowId: ' + projSpendingRowId + ', ' + JSON.stringify(updateJson));
    //                                    // 
    //                                    // Now we get all of the changed spend values for the months, and save them to the database.
    //                                    //
    //                                    $.ajax({
    //                                        url: operationUriPrefix + "odata/ProjSpendings?$filter=ProjSpendingRowId eq " + projSpendingRowId,
    //                                        dataType: "json",
    //                                        success: function (result) {
    //                                            lpSpinner.Hide();
    //                                            var rows = result.value;
    //                                            console.log('In CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update.Spend: projSpendingRowId: ' + projSpendingRowId + ', rows: ' + JSON.stringify(rows));
    //                                            //Now that we have the ProjSpendingRow, match up the columns, get the 
    //                                            var projSpendingId;
    //                                            var updateJson;
    //                                            for (var j = 0; j < rows.length; j++) {
    //                                                var dtMonth = new Date(rows[j].MonthStartDate);
    //                                                var columnName = months[dtMonth.getMonth()] + ' ' + dtMonth.getFullYear(); // eg: "Aug 2019"
    //                                                var spend = values[columnName]; // The "Spend" value.
    //                                                if (Number(spend) >= 0) {
    //                                                    //
    //                                                    // We have found the projSpendingId for the updated spend value.
    //                                                    //
    //                                                    projSpendingId = rows[j].ProjSpendingId;
    //                                                    updateJson = { "Spend": spend };
    //                                                    console.log('In CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update.Spend: getting ready to send to DB. projSpendingId: ' + projSpendingId + ', columnName: ' + columnName + ', spend: ' + spend + ', updateJson: ' + JSON.stringify(updateJson));
    //                                                    // We have it!!!! Update the database
    //                                                    lpSpinner.SetText('Saving...');
    //                                                    lpSpinner.Show();
    //                                                    $.ajax({
    //                                                        url: operationUriPrefix + "odata/ProjSpendings(" + projSpendingId + ")",
    //                                                        dataType: "json",
    //                                                        contentType: "application/json",
    //                                                        type: "Patch",
    //                                                        data: JSON.stringify(updateJson)
    //                                                    }).done(function (result2) {
    //                                                        try {
    //                                                            if (result2) {
    //                                                                lpSpinner.Hide();
    //                                                                alert('Error saving: ' + result2 + ', ' + JSON.stringify(result2));
    //                                                            } else {
    //                                                                console.log('In CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: Successfully updated DB using (' + JSON.stringify(updateJson) + '): result: ' + result2); // NOTHING COMES BACK HERE, it is undefined.... not sure why this is happening.
    //                                                                $("#jsGridSpendForecast").dxDataGrid("instance").refresh();
    //                                                                $("#jsGridSpendForecastSummary").dxDataGrid("instance").refresh();
    //                                                                lpSpinner.Hide();
    //                                                            }
    //                                                        } catch (e) {
    //                                                            lpSpinner.Hide();
    //                                                            console.log('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + e.message + ', ' + e.stack);
    //                                                        }
    //                                                    }).fail(function (data) {
    //                                                        lpSpinner.Hide();
    //                                                        var msg;
    //                                                        if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
    //                                                            msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
    //                                                        } else {
    //                                                            msg = JSON.stringify(data);
    //                                                        }
    //                                                        alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
    //                                                        console.log('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
    //                                                        //var error = JSON.parse(data.responseText)["odata.error"];
    //                                                    });
    //                                                } else {
    //                                                    $("#jsGridSpendForecast").dxDataGrid("instance").refresh();
    //                                                    $("#jsGridSpendForecastSummary").dxDataGrid("instance").refresh();
    //                                                }
    //                                            }
    //                                        },
    //                                        error: function (data) {
    //                                            lpSpinner.Hide();
    //                                            var error = JSON.parse(data.responseText)["odata.error"];
    //                                            var errormsg = 'Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().costSheetItems.CustomStore.load(): ' + error.message.value;
    //                                            if (error.innererror.message) errormsg += ' ' + error.innererror.message;
    //                                            if (error.innererror.internalexception.message) errormsg += ' ' + error.innererror.internalexception.message;
    //                                            deferred.reject("Data Loading Error : " + errormsg);
    //                                        },
    //                                        timeout: 60000
    //                                    });
    //                                }
    //                            } catch (e) {
    //                                lpSpinner.Hide();
    //                                alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update.Title: ' + e.message + ', ' + e.stack);
    //                                console.log('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update.Title: ' + e.message + ', ' + e.stack);
    //                            }
    //                        }).fail(function (data) {
    //                            lpSpinner.Hide();
    //                            var msg;
    //                            if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
    //                                msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
    //                            } else {
    //                                msg = JSON.stringify(data);
    //                            }
    //                            alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update.Title: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
    //                            console.log('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update.Title: ' + JSON.stringify(data));
    //                            var error = JSON.parse(data.responseText)["odata.error"];
    //                        });
    //                    } else {
    //                        // 
    //                        // Now we get all of the changed spend values for the months, and save them to the database.
    //                        //
    //                        $.ajax({
    //                            url: operationUriPrefix + "odata/ProjSpendings?$filter=ProjSpendingRowId eq " + projSpendingRowId,
    //                            dataType: "json",
    //                            success: function (result) {
    //                                lpSpinner.Hide();
    //                                var rows = result.value;
    //                                console.log('In CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update.Spend: projSpendingRowId: ' + projSpendingRowId + ', rows: ' + JSON.stringify(rows));
    //                                //Now that we have the ProjSpendingRow, match up the columns, get the 
    //                                var projSpendingId;
    //                                var updateJson;
    //                                for (var j = 0; j < rows.length; j++) {
    //                                    var dtMonth = new Date(rows[j].MonthStartDate);
    //                                    var columnName = months[dtMonth.getMonth()] + ' ' + dtMonth.getFullYear(); // eg: "Aug 2019"
    //                                    var spend = values[columnName]; // The "Spend" value.
    //                                    console.log('WWWWWWWWWWWWWWWWWWWWW spend: ' + spend);
    //                                    if (Number(spend) >= 0) {
    //                                        //
    //                                        // We have found the projSpendingId for the updated spend value.
    //                                        //
    //                                        projSpendingId = rows[j].ProjSpendingId;
    //                                        updateJson = { "Spend": spend };
    //                                        console.log('In CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update.Spend: getting ready to send to DB. projSpendingId: ' + projSpendingId + ', columnName: ' + columnName + ', spend: ' + spend + ', updateJson: ' + JSON.stringify(updateJson));
    //                                        // We have it!!!! Update the database
    //                                        lpSpinner.SetText('Saving...');
    //                                        lpSpinner.Show();
    //                                        $.ajax({
    //                                            url: operationUriPrefix + "odata/ProjSpendings(" + projSpendingId + ")",
    //                                            dataType: "json",
    //                                            contentType: "application/json",
    //                                            type: "Patch",
    //                                            data: JSON.stringify(updateJson)
    //                                        }).done(function (result2) {
    //                                            try {
    //                                                if (result2) {
    //                                                    lpSpinner.Hide();
    //                                                    alert('Error saving: ' + result2 + ', ' + JSON.stringify(result2));
    //                                                } else {
    //                                                    console.log('In CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: Successfully updated DB using (' + JSON.stringify(updateJson) + '): result: ' + result2); // NOTHING COMES BACK HERE, it is undefined.... not sure why this is happening.
    //                                                    $("#jsGridSpendForecast").dxDataGrid("instance").refresh();
    //                                                    $("#jsGridSpendForecastSummary").dxDataGrid("instance").refresh();
    //                                                    lpSpinner.Hide();
    //                                                }
    //                                            } catch (e) {
    //                                                lpSpinner.Hide();
    //                                                console.log('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + e.message + ', ' + e.stack);
    //                                            }
    //                                        }).fail(function (data) {
    //                                            lpSpinner.Hide();
    //                                            var msg;
    //                                            if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
    //                                                msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
    //                                            } else {
    //                                                msg = JSON.stringify(data);
    //                                            }
    //                                            alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
    //                                            console.log('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
    //                                            //var error = JSON.parse(data.responseText)["odata.error"];

    //                                            //lpSpinner.Hide();
    //                                            //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
    //                                            //var error = JSON.parse(data.responseText)["odata.error"];
    //                                            //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
    //                                        });
    //                                    } else {
    //                                        $("#jsGridSpendForecast").dxDataGrid("instance").refresh();
    //                                        $("#jsGridSpendForecastSummary").dxDataGrid("instance").refresh();
    //                                        lpSpinner.Hide();
    //                                    }
    //                                }
    //                            },
    //                            error: function (data) {
    //                                lpSpinner.Hide();
    //                                var error = JSON.parse(data.responseText)["odata.error"];
    //                                var errormsg = 'Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().costSheetItems.CustomStore.load(): ' + error.message.value;
    //                                if (error.innererror.message) errormsg += ' ' + error.innererror.message;
    //                                if (error.innererror.internalexception.message) errormsg += ' ' + error.innererror.internalexception.message;
    //                                deferred.reject("Data Loading Error : " + errormsg);
    //                            },
    //                            timeout: 60000
    //                        });
    //                    }
    //                } else {
    //                    lpSpinner.Hide();
    //                    console.log('There was nothing to save back to the database.');
    //                    alert('There was nothing to save back to the database.');
    //                }
    //            },
    //            remove: function (projSpendingRowId) {
    //                console.log('REMOVE: projSpendingRowId: ' + projSpendingRowId);
    //                $.ajax({
    //                    url: operationUriPrefix + "odata/ProjSpendings?$filter=ProjSpendingRowId eq " + projSpendingRowId,
    //                    dataType: "json",
    //                    success: function (result) {
    //                        lpSpinner.Hide();
    //                        var rows = result.value;
    //                        console.log('In CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.delete: projSpendingRowId: ' + projSpendingRowId + ', rows: ' + JSON.stringify(rows));
    //                        //Now that we have the ProjSpendingRow, match up the columns, get the 
    //                        var projSpendingId;
    //                        var updateJson;
    //                        for (var j = 0; j < rows.length; j++) {
    //                            projSpendingId = rows[j].ProjSpendingId;
    //                            // We have it!!!! Update the database
    //                            lpSpinner.SetText('Deleting...');
    //                            lpSpinner.Show();
    //                            $.ajax({
    //                                url: operationUriPrefix + "odata/ProjSpendings(" + projSpendingId + ")",
    //                                dataType: "json",
    //                                contentType: "application/json",
    //                                type: "Delete"
    //                            }).done(function (result2) {
    //                                try {
    //                                    if (result2) {
    //                                        lpSpinner.Hide();
    //                                        alert('Error deleting: ' + result2 + ', ' + JSON.stringify(result2));
    //                                    } else {
    //                                        console.log('In CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.delete: Successfully deleted from DB. result: ' + result2); // NOTHING COMES BACK HERE, it is undefined.... not sure why this is happening.
    //                                        $("#jsGridSpendForecast").dxDataGrid("instance").refresh();
    //                                        $("#jsGridSpendForecastSummary").dxDataGrid("instance").refresh();
    //                                        lpSpinner.Hide();
    //                                    }
    //                                } catch (e) {
    //                                    lpSpinner.Hide();
    //                                    console.log('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.delete: ' + e.message + ', ' + e.stack);
    //                                }
    //                            }).fail(function (data) {
    //                                lpSpinner.Hide();
    //                                var msg;
    //                                if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
    //                                    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
    //                                } else {
    //                                    msg = JSON.stringify(data);
    //                                }
    //                                alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.delete: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
    //                                console.log('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.delete: ' + JSON.stringify(data));
    //                                //var error = JSON.parse(data.responseText)["odata.error"];

    //                                //lpSpinner.Hide();
    //                                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
    //                                //var error = JSON.parse(data.responseText)["odata.error"];
    //                                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
    //                            });
    //                        }
    //                        //
    //                        // This is where we delete from ProjSpendingRow table.
    //                        //
    //                        $.ajax({
    //                            url: operationUriPrefix + "odata/ProjSpendingRows(" + projSpendingRowId + ")",
    //                            dataType: "json",
    //                            contentType: "application/json",
    //                            type: "Delete"
    //                        }).done(function (result2) {
    //                            try {
    //                                if (result2) {
    //                                    lpSpinner.Hide();
    //                                    alert('Error deleting: ' + result2 + ', ' + JSON.stringify(result2));
    //                                } else {
    //                                    console.log('In CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.delete: Successfully deleted from DB. result: ' + result2); // NOTHING COMES BACK HERE, it is undefined.... not sure why this is happening.
    //                                    $("#jsGridSpendForecast").dxDataGrid("instance").refresh();
    //                                    $("#jsGridSpendForecastSummary").dxDataGrid("instance").refresh();
    //                                    lpSpinner.Hide();
    //                                }
    //                            } catch (e) {
    //                                lpSpinner.Hide();
    //                                console.log('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.delete: ' + e.message + ', ' + e.stack);
    //                            }
    //                        }).fail(function (data) {
    //                            lpSpinner.Hide();
    //                            var msg;
    //                            if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
    //                                msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
    //                            } else {
    //                                msg = JSON.stringify(data);
    //                            }
    //                            alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.delete: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
    //                            console.log('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.delete: ' + JSON.stringify(data));
    //                            //var error = JSON.parse(data.responseText)["odata.error"];

    //                            //lpSpinner.Hide();
    //                            //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
    //                            //var error = JSON.parse(data.responseText)["odata.error"];
    //                            //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
    //                        });
    //                    },
    //                    error: function (data) {
    //                        lpSpinner.Hide();
    //                        var error = JSON.parse(data.responseText)["odata.error"];
    //                        var errormsg = 'Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.delete(): ' + error.message.value;
    //                        if (error.innererror.message) errormsg += ' ' + error.innererror.message;
    //                        if (error.innererror.internalexception.message) errormsg += ' ' + error.innererror.internalexception.message;
    //                        deferred.reject("Data Loading Error : " + errormsg);
    //                    },
    //                    timeout: 60000
    //                });
    //            }
    //        });

    //        var spendForecastSummaryItems = new DevExpress.data.CustomStore({
    //            load: function (loadOptions) {
    //                var deferred = $.Deferred(),
    //                    args = {};
    //                if (loadOptions.sort) {
    //                    args.orderby = loadOptions.sort[0].selector;
    //                    if (loadOptions.sort[0].desc)
    //                        args.orderby += " desc";
    //                }
    //                args.skip = loadOptions.skip;
    //                args.take = loadOptions.take;
    //                $.ajax({
    //                    url: operationUriPrefix + "odata/vSpendForecasts?$filter=CARId eq " + gCarId,
    //                    dataType: "json",
    //                    data: args,
    //                    success: function (result) {
    //                        //console.log('In CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastSummaryItems.vSpendForecasts.result.value: ' + JSON.stringify(result.value));
    //                        var unformatted = result.value;
    //                        var dataGridRows = [];

    //                        if (unformatted.length < 1) {
    //                            console.log('In CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastSummaryItems.vSpendForecasts: No data returned.');
    //                            // Since no data was returned, we have to get the start and end date, and create the dxDataGrid on the fly.
    //                            var startDate = $("#StartDate").datepicker('getData');
    //                            var endDate = $("#EndDate").datepicker('getData');
    //                            if (startDate == null || endDate == null) {
    //                                alert('5: Before you can enter "Spend Forecast" information, you must choose "Project Start Date" and "Completion Date" on the "BASIC INFO" tab.');
    //                                $('#tabs').tabs({ active: 0 }); // The dates weren't filled out, so take the user back to the 'BASIC INFO' tab.
    //                            } else {
    //                                var startMonthOrdinal = startDate.getMonth();
    //                                var endMonthOrdinal = endDate.getMonth();
    //                                console.log('startMonthOrdinal: ' + startMonthOrdinal + ', endMonthOrdinal: ' + endMonthOrdinal);
    //                                var dataGridRow = [];
    //                                dataGridRow_MonthSpending = { "ProjSpendingRowId": 0, "Title": "Month Spending" };
    //                                dataGridRow_ToMonthSpending = { "ProjSpendingRowId": 0, "Title": "To Date Spending" };
    //                                dataGridRow_Interest = { "ProjSpendingRowId": 0, "Title": "Interest" };
    //                                dataGridRow_InterestForMonth = { "ProjSpendingRowId": 0, "Title": "Interest for Month" };
    //                                dataGridRow_InterestToDate = { "ProjSpendingRowId": 0, "Title": "Interest To Date" };
    //                                for (var month = startMonthOrdinal; month < (endMonthOrdinal + 1) ; month++) {
    //                                    var columnName = months[month] + ' ' + fiscalYear;
    //                                    dataGridRow_MonthSpending[columnName] = null;
    //                                    dataGridRow_ToMonthSpending[columnName] = null;
    //                                    dataGridRow_Interest[columnName] = null;
    //                                    dataGridRow_InterestForMonth[columnName] = null;
    //                                    dataGridRow_InterestToDate[columnName] = null;
    //                                }
    //                                dataGridRows.push(dataGridRow_MonthSpending);
    //                                dataGridRows.push(dataGridRow_ToMonthSpending);
    //                                dataGridRows.push(dataGridRow_Interest);
    //                                dataGridRows.push(dataGridRow_InterestForMonth);
    //                                dataGridRows.push(dataGridRow_InterestToDate);
    //                            }
    //                        } else {
    //                            // This data comes in as several rows for each Spending row, so we have to merge all these lines into 1 line for each Spending row.
    //                            var spendingRow;
    //                            var spendingRows = [];
    //                            var projSpendingRow = [];
    //                            var projSpendingRowId, oldProjSpendingRowId;
    //                            for (var i = 0; i < unformatted.length; i++) {
    //                                projSpendingRowId = unformatted[i].ProjSpendingRowId;
    //                                //console.log('In CarForm3.aspx.populateSpendForecastNotReadOnly(). projSpendingRowId: ' + projSpendingRowId + ', oldProjSpendingRowId: ' + oldProjSpendingRowId + ', unformatted[' + i + ']: ' + JSON.stringify(unformatted[i]));
    //                                if (projSpendingRowId) {
    //                                    if (projSpendingRowId == oldProjSpendingRowId) {
    //                                        // Do nothing, we will be adding to our current spending row.
    //                                    } else {
    //                                        if (spendingRow) spendingRows.push(spendingRow); // Add our row, now that we have it completed. The if statement accomodate for the first time through.
    //                                        spendingRow = []; // We need to initalize a new spending row.
    //                                        spendingRow = { "CARId": unformatted[i].CARId, "ProjSpendingRowId": unformatted[i].ProjSpendingRowId, "Title": unformatted[i].Title, "MonthColumns": [] };
    //                                        //console.log('spendingRow: ' + JSON.stringify(spendingRow));
    //                                        oldProjSpendingRowId = unformatted[i].ProjSpendingRowId;
    //                                    }
    //                                }
    //                                var monthColumn = [];
    //                                monthColumn = { "ProjSpendingId": unformatted[i].ProjSpendingId, "OrdinalMonth": unformatted[i].OrdinalMonth, "MonthStartDate": unformatted[i].MonthStartDate, "Spend": unformatted[i].Spend };
    //                                spendingRow.MonthColumns.push(monthColumn);
    //                                //console.log('In CarForm3.aspx.populateSpendForecastNotReadOnly().spendingRow: ' + JSON.stringify(spendingRow));
    //                            }
    //                            spendingRows.push(spendingRow); // Add our row, now that we have it completed. // This line gets the last one! :)
    //                            console.log('In CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastSummaryItems.spendingRows: ' + JSON.stringify(spendingRows));
    //                            //
    //                            // Now that we have the data in a reasonable format, we are going to format it one more time so that the grid can be auto generated.
    //                            //
    //                            //var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    //                            //var fiscalYear = document.getElementById('fiscalYear').value;
    //                            //for (var i = 0; i < spendingRows.length; i++) {
    //                            //    var dataGridRow = [];
    //                            //    dataGridRow = { "ProjSpendingRowId": spendingRows[i].ProjSpendingRowId, "Title": spendingRows[i].Title, "Fcst Total": 0 };
    //                            //    for (var month = 0; month < spendingRows[i].MonthColumns.length; month++) {
    //                            //        var dtMonth = new Date(spendingRows[i].MonthColumns[month].MonthStartDate);
    //                            //        var columnName = months[dtMonth.getMonth()] + ' ' + fiscalYear;
    //                            //        dataGridRow[columnName] = spendingRows[i].MonthColumns[month].Spend;
    //                            //    }
    //                            //    dataGridRows.push(dataGridRow);
    //                            //}
    //                            //
    //                            // Now that we have our data formatted nicely, let's add/calculate the totals/summary rows at the bottom.
    //                            //

    //                            // "Month Spending" row: 
    //                            var dataGridRow_MonthSpending = [];
    //                            dataGridRow_MonthSpending = { "ProjSpendingRowId": 0, "Title": "Month Spending", "Fcst Total": null };
    //                            var forecastTotal = 0;
    //                            for (var j = 0; j < spendingRows[0].MonthColumns.length; j++) {
    //                                // Now get the totals for each month.
    //                                var thisMonthsTotal = 0;
    //                                var dtMonth = new Date(spendingRows[0].MonthColumns[j].MonthStartDate);
    //                                var columnName = months[dtMonth.getMonth()] + ' ' + gworkflow.FiscalYear;

    //                                for (var k = 0; k < spendingRows.length; k++) {
    //                                    thisMonthsTotal += spendingRows[k].MonthColumns[j].Spend;
    //                                }
    //                                dataGridRow_MonthSpending[columnName] = thisMonthsTotal;
    //                                forecastTotal += Number(thisMonthsTotal);
    //                            }

    //                            dataGridRow_MonthSpending["Fcst Total"] = forecastTotal;
    //                            dataGridRows.push(dataGridRow_MonthSpending);

    //                            // "To Date Spending" row:
    //                            var dataGridRow_ToDateSpending = [];
    //                            dataGridRow_ToDateSpending = { "ProjSpendingRowId": 0, "Title": "To Date Spending" };
    //                            var toDateSpending = 0;
    //                            for (var month = 0; month < spendingRows[0].MonthColumns.length; month++) {
    //                                var dtMonth = new Date(spendingRows[0].MonthColumns[month].MonthStartDate);
    //                                var columnName = months[dtMonth.getMonth()] + ' ' + gworkflow.FiscalYear;
    //                                var monthTotalSpend = dataGridRow_MonthSpending[columnName];
    //                                toDateSpending += Number(monthTotalSpend);
    //                                dataGridRow_ToDateSpending[columnName] = toDateSpending;
    //                            }
    //                            projCapitalSpending = toDateSpending;
    //                            dataGridRows.push(dataGridRow_ToDateSpending);

    //                            // "Interest" row:
    //                            var dataGridRow_Interest = [];
    //                            dataGridRow_Interest = { "ProjSpendingRowId": 0, "Title": "Interest" };
    //                            var interest = 0;
    //                            for (var month = 0; month < spendingRows[0].MonthColumns.length; month++) {
    //                                var dtMonth = new Date(spendingRows[0].MonthColumns[month].MonthStartDate);
    //                                var columnName = months[dtMonth.getMonth()] + ' ' + gworkflow.FiscalYear;
    //                                var monthTotalSpend = dataGridRow_MonthSpending[columnName];
    //                                dataGridRow_Interest[columnName] = 0;
    //                            }
    //                            dataGridRows.push(dataGridRow_Interest);

    //                            // "Interest for Month" row:
    //                            // Must be at least a year of spending
    //                            // (Current Year ToDate Spending * Interest Rate) / 12
    //                            var dataGridRow_InterestForMonth = [];
    //                            dataGridRow_InterestForMonth = { "ProjSpendingRowId": 0, "Title": "Interest for Month" };
    //                            var interest = gworkflow.InterestRate;
    //                            for (var month = 0; month < spendingRows[0].MonthColumns.length; month++) {
    //                                var dtMonth = new Date(spendingRows[0].MonthColumns[month].MonthStartDate);
    //                                var columnName = months[dtMonth.getMonth()] + ' ' + gworkflow.FiscalYear;
    //                                var monthTotalSpend = dataGridRow_MonthSpending[columnName];
    //                                toDateSpending = Number((monthTotalSpend * interest) / (1200));
    //                                dataGridRow_InterestForMonth[columnName] = toDateSpending;
    //                            }
    //                            dataGridRows.push(dataGridRow_InterestForMonth);

    //                            // "Interest To Date" row:
    //                            // Must be at least a year of spending
    //                            // if Month Capital Spending <= 0 --- 0
    //                            // if Month Capital Spending > 0 --- First Year ToDate Spending + Current Year ToDate Spending
    //                            var dataGridRow_InterestToDate = [];
    //                            dataGridRow_InterestToDate = { "ProjSpendingRowId": 0, "Title": "Interest To Date" };
    //                            var interest = gworkflow.InterestRate;
    //                            for (var month = 0; month < spendingRows[0].MonthColumns.length; month++) {
    //                                var dtMonth = new Date(spendingRows[0].MonthColumns[month].MonthStartDate);
    //                                var columnName = months[dtMonth.getMonth()] + ' ' + gworkflow.FiscalYear;
    //                                var dateTotalSpend = dataGridRow_ToDateSpending[columnName];
    //                                toDateSpending = Number((dateTotalSpend * interest) / (1200));
    //                                dataGridRow_InterestToDate[columnName] = toDateSpending;
    //                            }
    //                            dataGridRows.push(dataGridRow_InterestToDate);

    //                            document.getElementById('projectedCapitalSpending').value = projCapitalSpending;
    //                            document.getElementById('amountForecast').value = forecastTotal;
    //                            var amountLeft = Number(projCapitalSpending - forecastTotal);
    //                            document.getElementById('amountLeftToForecast').value = amountLeft;
    //                        }

    //                        deferred.resolve(dataGridRows, {});
    //                    },
    //                    error: function (data) {
    //                        lpSpinner.Hide();
    //                        var error = JSON.parse(data.responseText)["odata.error"];
    //                        var errormsg = 'Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().costSheetItems.CustomStore.load(): ' + error.message.value;
    //                        if (error.innererror.message) errormsg += ' ' + error.innererror.message;
    //                        if (error.innererror.internalexception.message) errormsg += ' ' + error.innererror.internalexception.message;
    //                        deferred.reject("Data Loading Error : " + errormsg);
    //                    },
    //                    timeout: 60000
    //                });
    //                return deferred.promise();
    //            }
    //        });

    //        var gridSpendForecastInstance = $("#jsGridSpendForecast").dxDataGrid({
    //            dataSource: {
    //                store: spendForecastItems
    //            },
    //            loadPanel: {
    //                enabled: false
    //            },
    //            cacheEnabled: true,
    //            editing: {
    //                mode: "row",
    //                allowUpdating: true,
    //                allowDeleting: true,
    //                allowAdding: true
    //            },
    //            remoteOperations: false,
    //            searchPanel: {
    //                visible: false
    //            },
    //            allowColumnReordering: false,
    //            allowColumnResizing: false,
    //            columnResizingMode: 'widget',
    //            rowAlternationEnabled: true,
    //            showBorders: true,
    //            filterRow: { visible: false },
    //            customizeColumns: function (columns) {
    //                // Make columns visible, set widths, etc.
    //                $.each(columns, function (_, column) {
    //                    if (column.dataField == 'ProjSpendingRowId') {
    //                        column.visible = false; // We want this row so we can get the value, but we don't want the user to see it.
    //                    } else if (column.dataField == 'Title') {
    //                        console.log('In gridSpendForecastSummaryInstance: Setting Title column to 300px.');
    //                        column.width = '300px';
    //                    }
    //                    else {
    //                        console.log('In gridSpendForecastSummaryInstance: Setting columns to 125px.');
    //                        column.width = '125px';
    //                        column.format = { type: "fixedPoint", precision: 0 } // This puts the comma in our currency values.
    //                    }
    //                });
    //            },
    //            onCellPrepared: function (e) {
    //                if (e.rowType === "data") {
    //                    if (e.column.dataField == 'Title') {
    //                        e.cellElement.css({ "font-weight": "bold", "color": "black" });
    //                    } else {
    //                        e.cellElement.css({ "font-weight": "normal", "color": "black" });
    //                    }
    //                }
    //            },
    //            onContentReady: function (e) {
    //                // Set the width of this dxDataGrid. Not sure why this is necessary, but it is...
    //                //try {
    //                //    var months = 0;
    //                //    for (var dt = $("#StartDate").datepicker('getData'); dt < $("#EndDate").datepicker('getData').addDays(1); dt.setMonth(dt.getMonth() + 1)) {
    //                //        months += 1;
    //                //    }
    //                //    var width = 200 + 120 + (months * 120) + 100;
    //                //    e.component.option("width", width + "px");
    //                //} catch (e) {
    //                //    console.log('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly():gridSpendForecastInstance().onContentReady: ' + e.message + ', ' + e.stack);
    //                //}
    //            },
    //            onRowValidating: function (e) {
    //                if (e.isValid && e.newData.Login === "Administrator") {
    //                    e.isValid = false;
    //                    e.errorText = "Your cannot log in as Administrator";
    //                }
    //            }
    //        });

    //        var gridSpendForecastSummaryInstance = $("#jsGridSpendForecastSummary").dxDataGrid({
    //            dataSource: {
    //                store: spendForecastSummaryItems
    //            },
    //            loadPanel: {
    //                enabled: false
    //            },
    //            cacheEnabled: true,
    //            editing: {
    //                mode: "row",
    //                allowUpdating: false,
    //                allowDeleting: false,
    //                allowAdding: false
    //            },
    //            remoteOperations: false,
    //            searchPanel: {
    //                visible: false
    //            },
    //            showColumnHeaders: false,
    //            allowColumnReordering: false,
    //            allowColumnResizing: false,
    //            columnResizingMode: 'widget',
    //            rowAlternationEnabled: true,
    //            showBorders: true,
    //            filterRow: { visible: false },
    //            customizeColumns: function (columns) {
    //                // Make columns visible, set widths, etc.
    //                $.each(columns, function (_, column) {
    //                    if (column.dataField == 'ProjSpendingRowId') {
    //                        column.visible = false; // We want this row so we can get the value, but we don't want the user to see it.
    //                    } else if (column.dataField == 'Title') {
    //                        console.log('In gridSpendForecastSummaryInstance: Setting Title column to 300px.');
    //                        column.width = '300px';
    //                    }
    //                    else {
    //                        console.log('In gridSpendForecastSummaryInstance: Setting columns to 125px.');
    //                        column.width = '125px';
    //                        column.format = { type: "fixedPoint", precision: 0 } // This puts the comma in our currency values.
    //                    }
    //                });

    //                //$.each(columns, function (_, column) {
    //                //    if (column.dataField == 'ProjSpendingRowId') {
    //                //        column.visible = false; // We want this row so we can get the value, but we don't want the user to see it.
    //                //    } else if (column.dataField == 'Title') {
    //                //        console.log('In gridSpendForecastSummaryInstance: Setting Title column to 200px.');
    //                //        column.width = '320px';
    //                //        //column.css = {"text-decoration": "underline"}; // this crap don't work! :)
    //                //    } else {
    //                //        console.log('In gridSpendForecastSummaryInstance: Setting columns to 120px.');
    //                //        column.width = '120px';
    //                //        column.format = { type: "fixedPoint", precision: 0 } // This puts the comma in our currency values.
    //                //    }
    //                //});
    //            },
    //            onCellPrepared: function (e) {
    //                if (e.rowType === "data") {
    //                    e.cellElement.css({ "font-style": "italic" });
    //                    //if (e.column.dataField == 'Title') {
    //                    //    e.cellElement.css({ "font-style": "italic", "text-decoration": "underline" });
    //                    //} 
    //                }
    //            },
    //            onContentReady: function (e) {
    //                // Set the width of this dxDataGrid. Not sure why this is necessary, but it is...
    //                //try {
    //                //    var sDate = new Date($("#StartDate").val());
    //                //    var eDate = new Date($("#EndDate").val());
    //                //    var months = 0;
    //                //    for (var dt = sDate; dt < eDate.addDays(1); dt.setMonth(dt.getMonth() + 1)) {
    //                //        months += 1;
    //                //    }
    //                //    var width = 200 + 120 + (months * 120);
    //                //    e.component.option("width", width + "px");
    //                //} catch (e) {
    //                //    console.log('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly():gridSpendForecastSummaryInstance().onContentReady: ' + e.message + ', ' + e.stack);
    //                //}
    //            }
    //        });
    //    } catch (e) {
    //        console.log('Exception in renderSpendForecast2(): ' + e.message + ', ' + e.stack);
    //    }
    //},

});