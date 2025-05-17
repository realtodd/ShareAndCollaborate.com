$.widget("bw.bwPaybackGrid", {
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
        This is the bwPaybackGrid.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        fieldTitle: 'Payback', // This is the title, which shows up on the form in the left column.

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
        this.element.addClass("bwPaybackGrid");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {

            selfDiscoverOperationUri(thiz); // This sets this.options.operationUriPrefix correctly.

            if (!this.options.jsonData) {
                this.options.jsonData = [];
            }

            if (this.options.jsonData.length == 0) {
                this.options.jsonData['bwPaybackGrid'] = {}; // Instantiate the data object. bwPaybackGrid
            }

            this.renderAndPopulatePaybackGrid();

            console.log('In bwPaybackGrid._create(). The dialog has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwPaybackGrid</span>';
            html += '<br />';
            html += '<span style="">Exception in bwPaybackGrid.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwPaybackGrid")
            .text("");
    },
    getDataType: function () {
        try {
            console.log('In bwPaybackGrid.js.getDataType().');

            return 'spreadsheet';
        } catch (e) {
            console.log('Exception in bwPaybackGrid.js.getDataType(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwPaybackGrid.js.getDataType(): ' + e.message + ', ' + e.stack);
        }
    },
    getData: function () {
        try {
            console.log('In bwPaybackGrid.js.getData().');
            var data = $(this.element).find('#jsGridPayback_small').jsGrid('option', 'data');
            if (data.length < 1) {
                return null;
            } else {
                return data;
            }
        } catch (e) {
            console.log('Exception in bwPaybackGrid.getData(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwPaybackGrid.getData(): ' + e.message + ', ' + e.stack);
        }
    },
    isARequiredField: function () {
        try {
            console.log('In bwPaybackGrid.isARequiredField().');
            return this.options.renderAsARequiredField;
        } catch (e) {
            console.log('Exception in bwPaybackGrid.isARequiredField(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwPaybackGrid.isARequiredField(): ' + e.message + ', ' + e.stack);
        }
    },
    getfieldTitle: function () {
        try {
            console.log('In bwPaybackGrid.getfieldTitle().');
            return this.options.fieldTitle;
        } catch (e) {
            console.log('Exception in bwPaybackGrid.getfieldTitle(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwPaybackGrid.getfieldTitle(): ' + e.message + ', ' + e.stack);
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
            console.log('Exception in bwPaybackGrid.js.pinRequestDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwPaybackGrid.js.pinRequestDialog(): ' + e.message + ', ' + e.stack);
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
            console.log('Exception in bwPaybackGrid.js.setZoom(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwPaybackGrid.js.setZoom(): ' + e.message + ', ' + e.stack);
        }
    },

    renderAndPopulatePaybackGrid: function (requestDialogId) {
        try {
            console.log('In renderAndPopulatePaybackGrid().');
            var thiz = this;
            var html = '';

            // This is our data grid section. THE WIDTH IS SET HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            html += '                       <table style="width:100px;">';
            html += '                        <tbody><tr class="xdTableOffsetRow xdTableOffsetRow-editor" id="toolboxdraggablerow_2" draggable="true" bwwidgetname="bwPaybackGrid" bwfieldname="bwPaybackGrid">';
            html += '                            <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px;white-space:nowrap;">';
            //html += '                               <span style="font-size:20pt;cursor:zoom-in;" onclick="$(\'.bwPaybackGrid\').bwPaybackGrid(\'viewInLargeWindow\');"><img src="/images/zoom.jpg" style="width:20px;height:20px;" /></span>';
            html += '                                <span class="xdlabel">';
            html += '                                    Payback:';
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

            //html += 'Attach the "Business Justification" spreadsheet to automatically populate the values for NPV(Net Present Value), IRR(Internal Rate of Return), and DCP (Discounted Cash Payback Period).';
            //html += '<br />';

            html += '<table>';
            html += '   <tr>';
            html += '       <td>';
            html += '           <div id="jsGridPayback_small" style="font-size:60%;"></div>';
            html += '       </td>';
            //html += '       <td style="vertical-align:top;">';
            //if (this.options.inFormsEditor != true) {
            //    html += '       <span style="font-size:20pt;cursor:zoom-in;" onclick="$(\'#' + this.options.jsonData.requestDialogId + '\').find(\'.bwPaybackGrid\').bwPaybackGrid(\'viewInLargeWindow\');"><img class="gridMagnifyingGlass" src="/images/zoom.jpg" style="width:50px;height:50px;" /></span>';
            //}
            //html += '       </td>';
            html += '   </tr>';
            html += '</table';


            html += '<br />';
            html += '<table class="xdFormLayout xdTableStyleTwoCol" style="BORDER-TOP-STYLE: none; WORD-WRAP: break-word; BORDER-LEFT-STYLE: none; BORDER-COLLAPSE: collapse; TABLE-LAYOUT: fixed; BORDER-BOTTOM-STYLE: none; BORDER-RIGHT-STYLE: none;">';
            html += '   <colgroup>';
            html += '       <col style="WIDTH: 70px" />';
            html += '       <col style="" />';
            html += '   </colgroup>';
            html += '<tbody valign="top">';


            html += '               <tr class="xdTableOffsetRow2">';
            html += '                   <td colspan="2" class="xdTableOffsetCellLabel" style="text-align:right; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            html += '                       <span class="xdlabel" style="font-size:12pt;">Total Payback:</span>';
            html += '                           &nbsp;&nbsp;';
            html += '                           <input type="text" readonly="true"  id="grandTotalPayback_small" contentEditable="false" style="WIDTH: 140px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 18pt;TEXT-ALIGN: right;" />';
            html += '                   </td>';
            html += '               </tr>';


            html += '   <tr class="xdTableOffsetRow2">';
            html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            html += '           <div class="xdlabel" style="cursor:help;" title="Net Present Value">NPV $:</div>';
            html += '       </td>';
            html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
            html += '           <div>';
            html += '               <input type="number" step="0.01" id="projectedCapitalSpending" style="WIDTH: 140px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: right;" onblur="$(\'.bwRequest\').bwRequest(\'formatRequestedCapital_InitBudgetRequest\');" >';
            html += '               <span style="cursor:pointer;" title="Learn more about NPV (Net Present Value)">[i]</span>&nbsp;';
            html += '               [View Spend Forecast xcx342358]';
            html += '           </div>';
            html += '       </td>';
            html += '   </tr>';
            html += '   <tr class="xdTableOffsetRow2">';
            html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            html += '           <span class="xdlabel" style="cursor:help;" title="Internal Rate of Return">IRR %:</span>';
            html += '       </td>';
            html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
            html += '           <div>';
            html += '               <input type="number" step="0.01" id="amountForecast" style="WIDTH: 140px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: right;" onblur="$(\'.bwRequest\').bwRequest(\'formatRequestedCapital_InitBudgetRequest\');" >';
            html += '           </div>';
            html += '       </td>';
            html += '   </tr>';
            html += '   <tr class="xdTableOffsetRow2">';
            html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            html += '           <span class="xdlabel" style="cursor:help;" title="Discounted Cash Payback Period (years), Debtors Conversion Period (capital management)">DCP:</span>';
            html += '       </td>';
            html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
            html += '           <div>';
            html += '               <input type="number" step="0.01" id="amountLeftToForecast" style="WIDTH: 140px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: right;" onblur="$(\'.bwRequest\').bwRequest(\'formatRequestedCapital_InitBudgetRequest\');" >';
            html += '           </div>';
            html += '       </td>';
            html += '   </tr>';
            html += '   <tr class="xdTableOffsetRow2">';
            html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            html += '           <span class="xdlabel" style="cursor:help;" title="This value is recalculated, so may differ slightly from the spreadsheet.">Months:</span>';
            html += '       </td>';
            html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
            html += '           <div>';
            html += '               <input type="number" step="0.01" id="amountLeftToForecast" style="WIDTH: 140px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: right;" onblur="$(\'.bwRequest\').bwRequest(\'formatRequestedCapital_InitBudgetRequest\');">';

            if (this.options.inFormsEditor != true) {
                html += '       <span style="font-size:20pt;cursor:zoom-in;float:right;" onclick="$(\'#' + this.options.jsonData.requestDialogId + '\').find(\'.bwPaybackGrid\').bwPaybackGrid(\'viewInLargeWindow\');"><img class="gridMagnifyingGlass" src="/images/zoom.jpg" style="width:50px;height:50px;" /></span>';
            }

            html += '           </div>';

            html += '       </td>';
            html += '   </tr>';

            html += '</tbody>';
            html += '</table>';

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


            //// If we have jsonData, populate the element.
            //if (thiz.options.jsonData["bwPaybackGrid"]) {
            //    // already have data
            //} else {
            //    // no data yet
            //    thiz.options.jsonData["bwPaybackGrid"] = {
            //        value: null
            //    }
            //}

            // If we have jsonData, populate the element.
            if (thiz.options.jsonData["bwPaybackGrid"]) {
                // already have data
                //var value = this.options.jsonData['bwCostsGrid'].value;
                //dataElement.value = value;
                //debugger;
                if (thiz.options.jsonData["bwPaybackGrid"].value) {

                } else {
                    thiz.options.jsonData["bwPaybackGrid"]["value"] = [];
                }
            } else {
                // no data yet
                thiz.options.jsonData["bwPaybackGrid"] = {
                    value: []
                }
            }

            //var json = [
            //  { "Description-payback": "Storage", "Lease": 0, "Expense": 0, "Capital": 0, "Total": 0 },
            //  { "Description-payback": "New equipment", "Lease": 0, "Expense": 0, "Capital": 0, "Total": 0 },
            //  { "Description-payback": "Labor", "Lease": 0, "Expense": 0, "Capital": 0, "Total": 0 },
            //  { "Description-payback": "Contracting", "Lease": 0, "Expense": 0, "Capital": 0, "Total": 0 },
            //  { "Description-payback": "Financing costs", "Lease": 0, "Expense": 0, "Capital": 0, "Total": 0 }
            //];

            $(this.element).find("#jsGridPayback_small").jsGrid({
                width: "100%",
                //height: "auto",

                inserting: true,
                editing: true,
                sorting: true,
                paging: true,

                confirmDeleting: false, // false prevents the alert from popping up

                data: thiz.options.jsonData["bwPaybackGrid"].value, //json, 
                noDataContent: "Click the \"Plus\" (+) sign to add a Payback item...",

                onRefreshed: function (args) { // jsGridPayback_small
                    try {
                        if (thiz.options.inFormsEditor != true) {
                            var totalLease = Number(0);
                            var totalExpense = Number(0);
                            var totalCapital = Number(0);
                            this.data.forEach(function (item) {
                                var total = Number(0);
                                if (item.Lease) {
                                    totalLease += Number(item.Lease);
                                    total += Number(item.Lease);
                                }
                                if (item.Expense) {
                                    totalExpense += Number(item.Expense);
                                    total += Number(item.Expense);
                                }
                                if (item.Capital) {
                                    totalCapital += Number(item.Capital);
                                    total += Number(item.Capital);
                                }
                                if (item.Total) {
                                    item.Total = total;
                                }
                            });
                            var grandTotal = totalLease + totalExpense + totalCapital;

                            var html = '';
                            html += '<tr>';

                            html += '<td>';
                            html == 'Total Payback';
                            html += '</td>';

                            html += '<td class="jsgrid-cell" style="text-align:right;">';
                            //html += formatCurrencyNoDecimalNoDollarSign(totalLease); 
                            html += formatCurrencyWithoutDollarSign(totalLease);
                            html += '</td>';

                            html += '<td class="jsgrid-cell" style="text-align:right;">';
                            //html += formatCurrencyNoDecimalNoDollarSign(totalExpense);
                            html += formatCurrencyWithoutDollarSign(totalExpense);
                            html += '</td>';

                            html += '<td class="jsgrid-cell" style="text-align:right;">';
                            //html += formatCurrencyNoDecimalNoDollarSign(totalCapital);
                            html += formatCurrencyWithoutDollarSign(totalCapital);
                            html += '</td>';

                            html += '<td class="jsgrid-cell" style="text-align:right;">';
                            //html += formatCurrencyNoDecimalNoDollarSign(grandTotal);
                            html += formatCurrencyWithoutDollarSign(grandTotal);
                            html += '</td>';

                            html += '</tr>';
                            this._content.append(html);

                            thiz.options.jsonData["bwPaybackGrid"].value = this.data; // Store in the widget.

                            //$(thiz.element).closest('#budgetrequestform').find("#grandTotalPayback_small")[0].value = formatCurrencyNoDecimal(grandTotal); // Update the smaller grid grand total.
                            $(thiz.element).closest('#budgetrequestform').find("#grandTotalPayback_small")[0].value = formatCurrency(grandTotal); // Update the smaller grid grand total.

                            var bwBudgetRequestId = $(thiz.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
                            var requestDialogId = 'divZoomedBwPaybackGridDialog_' + bwBudgetRequestId;
                            if ($('#' + requestDialogId).find('#jsGridPayback_large')) { // If the large one is displayed, update it!
                                if ($('#' + requestDialogId).find('#grandTotalPayback_large')[0]) {
                                    //$('#' + requestDialogId).find('#grandTotalPayback_large')[0].value = formatCurrencyNoDecimal(grandTotal); // Update the grand total in the large window.
                                    $('#' + requestDialogId).find('#grandTotalPayback_large')[0].value = formatCurrency(grandTotal); // Update the grand total in the large window.
                                }
                            }
                        }
                    } catch (e) {
                        console.log('Exception in bwPaybackGrid.onRefreshed: ' + e.message + ', ' + e.stack);
                        $('#spanBwPaybackGrid_Error')[0].innerHTML = 'Exception in bwPaybackGrid.onRefreshed: ' + e.message + ', ' + e.stack;
                    }
                },

                onItemInserted: function () { // jsGridCosts_small
                    try {
                        var bwBudgetRequestId = $(thiz.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
                        var requestDialogId = 'divZoomedBwPaybackGridDialog_' + bwBudgetRequestId;
                        if ($('#' + requestDialogId).find('#jsGridPayback_large')) { // If the large one is displayed, update it!
                            $('#' + requestDialogId).find("#jsGridPayback_large").jsGrid("option", "data", thiz.options.jsonData["bwPaybackGrid"].value); // Update the larger grid.
                        }

                    } catch (e) {
                        console.log('Exception in bwCostsGrid.onItemInserted: ' + e.message + ', ' + e.stack);
                        $('#spanBwPaybackGrid_Error')[0].innerHTML = 'Exception in bwPaybackGrid.onItemInserted: ' + e.message + ', ' + e.stack;
                    }
                },
                onItemUpdated: function () { // jsGridCosts_small
                    try {
                        //console.log('In bwCostsGrid.onItemInserted().');
                        var bwBudgetRequestId = $(thiz.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
                        var requestDialogId = 'divZoomedBwPaybackGridDialog_' + bwBudgetRequestId;
                        if ($('#' + requestDialogId).find('#jsGridPayback_large')) { // If the large one is displayed, update it!
                            $('#' + requestDialogId).find("#jsGridPayback_large").jsGrid("option", "data", thiz.options.jsonData["bwPaybackGrid"].value); // Update the larger grid.
                        }

                    } catch (e) {
                        console.log('Exception in bwCostsGrid.onItemInserted: ' + e.message + ', ' + e.stack);
                        $('#spanBwPaybackGrid_Error')[0].innerHTML = 'Exception in bwPaybackGrid.onItemUpdated: ' + e.message + ', ' + e.stack;
                    }
                },
                onItemDeleted: function () { // jsGridCosts_small
                    try {
                        //console.log('In bwCostsGrid.onItemInserted().');
                        var bwBudgetRequestId = $(thiz.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
                        var requestDialogId = 'divZoomedBwPaybackGridDialog_' + bwBudgetRequestId;
                        if ($('#' + requestDialogId).find('#jsGridPayback_large')) { // If the large one is displayed, update it!
                            $('#' + requestDialogId).find("#jsGridPayback_large").jsGrid("option", "data", thiz.options.jsonData["bwPaybackGrid"].value); // Update the larger grid.
                        }

                    } catch (e) {
                        console.log('Exception in bwPaybackGrid.onItemInserted: ' + e.message + ', ' + e.stack);
                        $('#spanBwPaybackGrid_Error')[0].innerHTML = 'Exception in bwPaybackGrid.onItemDeleted: ' + e.message + ', ' + e.stack;
                    }
                },
                fields: [
                    {
                        name: "Description", type: "text", width: 150, validate: "required"
                    },
                    {
                        name: "Lease", type: "decimal", width: 50
                    },
                    {
                        name: "Expense", type: "decimal", width: 50
                    },
                    {
                        name: "Capital", type: "decimal", width: 50
                    },
                    {
                        name: "Total", type: "decimal", width: 50
                    },
                    { type: "control" }
                ]
            });

        } catch (e) {
            console.log('Exception in renderAndPopulatePaybackGrid: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwPaybackGrid</span>';
            html += '<br />';
            html += '<span style="">Exception in bwPaybackGrid.renderAndPopulatePaybackGrid(): ' + e.message + ', ' + e.stack + '</span>';
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
            var requestDialogId = 'divZoomedBwPaybackGridDialog_' + bwBudgetRequestId;
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
                width: '1100px',
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
                        html += '       <td style="float:right;">';
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














                        html += '                   </span>';
                        html += '                        </td>';
                        html += '                        <td colspan="2" style="text-align:left;vertical-align:top;">';
                        //html += '                           &nbsp;&nbsp;<span id="' + requestDialogParentId + '_BwRequestType" style="font-size:1em;">';
                        //html += '                               [._BwRequestType]';
                        //html += '                           </span>';
                        html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 40pt;font-weight:bold;">Payback</span>';
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
                        html += '<tr><td colspan="4" style="height:15px;"></td></tr>';
                        html += '                </table>';

                        html += '<span id="' + requestDialogParentId + '_Content"></span>';
                        document.getElementById(requestDialogId).innerHTML = html;



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

                        //document.getElementById(requestDialogParentId + '_BwRequestType').innerHTML = 'TODD!'; //workflowParent.bwRequestType;
                        //document.getElementById(requestDialogParentId + '_WorkflowGuid').innerHTML = 'TODD2'; //workflowParent.bwWorkflowId;

                        //var html = '';
                        //html += 'Render the bwPaybackGrid here. This will allow the user to edit and view the Payback grid in a large window. This functionality is incomplete. Coming soon!';
                        //html += '<br /><br /><br /><br /><br /><br /><br /><br /><br /><br />';
                        //document.getElementById(requestDialogParentId + '_Content').innerHTML = html;
                        var html = '';
                        html += '   <table>';
                        html += '       <tr>';
                        html += '           <td>';
                        html += '               <div id="jsGridPayback_large" style="font-size:60%;"></div>';
                        html += '           </td>';
                        //html += '           <td style="vertical-align:top;">';
                        //html += '               <span style="font-size:20pt;cursor:zoom-in;" onclick="$(\'.bwCostsGrid\').bwCostsGrid(\'viewInLargeWindow\');"><img class="gridMagnifyingGlass" src="/images/zoom.jpg" style="width:50px;height:50px;" /></span>';
                        //html += '           </td>';
                        html += '       </tr>';
                        html += '       <tr>';
                        html += '           <td style="text-align:right;">';
                        html += '<br />';
                        html += '               <span class="xdlabel" style="font-size:15pt;font-weight:bold;">Total Payback:</span>';
                        html += '               <input id="grandTotalPayback_large" contentEditable="false" style="WIDTH: 140px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 18pt;TEXT-ALIGN: right;" type="text">';
                        html += '               &nbsp;&nbsp;';
                        html += '               <br /><br /><br />';
                        html += '           </td>';
                        html += '       </tr>';
                        html += '   </table';
                        document.getElementById(requestDialogParentId + '_Content').innerHTML = html;

                        // If we have jsonData, populate the element.
                        if (thiz.options.jsonData["bwPaybackGrid"]) {
                            // already have data
                        } else {
                            // no data yet
                            thiz.options.jsonData["bwPaybackGrid"] = {
                                value: null
                            }
                        }

                        //var clients = [
                        //  { "Description": "Storage", "Lease": 0, "Expense": 0, "Capital": 0, "Total": 0 },
                        //  { "Description": "New equipment", "Lease": 0, "Expense": 0, "Capital": 0, "Total": 0 },
                        //  { "Description": "Labor", "Lease": 0, "Expense": 0, "Capital": 0, "Total": 0 },
                        //  { "Description": "Contracting", "Lease": 0, "Expense": 0, "Capital": 0, "Total": 0 },
                        //  { "Description": "Financing costs", "Lease": 0, "Expense": 0, "Capital": 0, "Total": 0 }
                        //];

                        $('#' + requestDialogParentId + '_Content').find("#jsGridPayback_large").jsGrid({
                            width: "100%",
                            //height: "100%", 
                            maxHeight: 'auto',

                            inserting: true,
                            editing: true,
                            sorting: true,
                            paging: true,

                            confirmDeleting: false, // false prevents the alert from popping up

                            data: thiz.options.jsonData["bwPaybackGrid"].value, //json, // clients
                            noDataContent: "Click the \"Plus\" (+) sign to add a Cost item...",

                            onInit: function () {
                                try {
                                    console.log('In bwPaybackGrid.onInit-large().');
                                    var grandTotal = Number(0);
                                    for (var i = 0; i < this.data.length; i++) { // Iterate through the rows and calculate the totals and grand total.
                                        var total = Number(0);
                                        if (this.data[i].Lease) total += Number(this.data[i].Lease);
                                        if (this.data[i].Expense) total += Number(this.data[i].Expense);
                                        if (this.data[i].Capital) total += Number(this.data[i].Capital);
                                        this.data[i].Total = total;
                                        grandTotal += Number(total);
                                    }
                                    if ($('#' + requestDialogParentId + '_Content').find('#grandTotalPayback_large')[0]) {
                                        //$('#' + requestDialogParentId + '_Content').find('#grandTotalPayback_large')[0].value = formatCurrencyNoDecimal(grandTotal); // Update the grand total in the large window.
                                        $('#' + requestDialogParentId + '_Content').find('#grandTotalPayback_large')[0].value = formatCurrency(grandTotal); // Update the grand total in the large window.
                                    }
                                    //$(thiz.element).closest('#budgetrequestform').find("#grandTotal")[0].value = formatCurrencyNoDecimal(grandTotal); // Update the smaller grid grand total.
                                } catch (e) {
                                    console.log('Exception in bwPaybackGrid.onInit: ' + e.message + ', ' + e.stack);
                                    $('#spanBwPaybackGrid_Error')[0].innerHTML = 'Exception in bwPaybackGrid.onInit: ' + e.message + ', ' + e.stack;

                                }
                            },
                            onItemInserted: function () {
                                try {
                                    //console.log('In bwCostsGrid.onItemInserted().');
                                    thiz.options.jsonData["bwPaybackGrid"].value = this.data; // Store in the widget.
                                    $(thiz.element).closest('#budgetrequestform').find("#jsGridPayback_small").jsGrid("option", "data", thiz.options.jsonData["bwPaybackGrid"].value); // Update the smaller grid.
                                } catch (e) {
                                    console.log('Exception in bwPaybackGrid.onItemInserted: ' + e.message + ', ' + e.stack);
                                    $('#spanBwPaybackGrid_Error')[0].innerHTML = 'Exception in bwPaybackGrid.onItemInserted: ' + e.message + ', ' + e.stack;
                                }
                            },
                            onItemUpdated: function () {
                                try {
                                    //console.log('In bwCostsGrid.onItemInserted().');
                                    thiz.options.jsonData["bwPaybackGrid"].value = this.data; // Store in the widget.
                                    $(thiz.element).closest('#budgetrequestform').find("#jsGridPayback_small").jsGrid("option", "data", thiz.options.jsonData["bwPaybackGrid"].value); // Update the smaller grid.
                                } catch (e) {
                                    console.log('Exception in bwPaybackGrid.onItemInserted: ' + e.message + ', ' + e.stack);
                                    $('#spanBwPaybackGrid_Error')[0].innerHTML = 'Exception in bwPaybackGrid.onItemInserted: ' + e.message + ', ' + e.stack;
                                }
                            },
                            onItemDeleted: function () {
                                try {
                                    //console.log('In bwCostsGrid.onItemInserted().');
                                    thiz.options.jsonData["bwPaybackGrid"].value = this.data; // Store in the widget.
                                    $(thiz.element).closest('#budgetrequestform').find("#jsGridPayback_small").jsGrid("option", "data", thiz.options.jsonData["bwPaybackGrid"].value); // Update the smaller grid.
                                } catch (e) {
                                    console.log('Exception in bwPaybackGrid.onItemInserted: ' + e.message + ', ' + e.stack);
                                    $('#spanBwPaybackGrid_Error')[0].innerHTML = 'Exception in bwPaybackGrid.onItemInserted: ' + e.message + ', ' + e.stack;
                                }
                            },
                            fields: [
                                {
                                    name: "Description", type: "text", width: 150, validate: "required"
                                },
                                {
                                    name: "Lease", type: "decimal", width: 50
                                },
                                {
                                    name: "Expense", type: "decimal", width: 50
                                },
                                {
                                    name: "Capital", type: "decimal", width: 50
                                },
                                {
                                    name: "Total", type: "decimal", width: 50, readOnly: true
                                },
                                { type: "control" }
                            ]
                        });

                    } catch (e) {
                        console.log('Exception in bwPaybackGrid.viewInLargeWindow().dialog.open(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwPaybackGrid.viewInLargeWindow().dialog.open(): ' + e.message + ', ' + e.stack);
                    }
                }
            });
            try {
                $('.ui-widget-overlay')[0].style.zIndex = 9;
                $('#' + requestDialogId).dialog().parents('.ui-dialog')[0].style.zIndex = 10; // THIS IS A HACK ?? IS THIS THE BEST PLACE FOR THIS ?? >>>>>>>>>>>>>>>>>>>>>>>>>>>> 2-15-2020
            } catch (e) {

            }
        } catch (e) {
            console.log('Exception in bwPaybackGrid.viewInLargeWindow(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwPaybackGrid.viewInLargeWindow(): ' + e.message + ', ' + e.stack);
        }
    }

});