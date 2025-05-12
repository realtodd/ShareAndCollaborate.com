$.widget("bw.bwRequestTitleFormatAdmin", {
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
        This is the bwRequestTitleFormatAdmin.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        operationUriPrefix: null,
        elementIdSuffix: null //,

        //requestTypes: null,

        //autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function (assignmentRowChanged_ElementId) {
        console.log('In bwRequestTitleFormatAdmin.js._create().');
        this.element.addClass("bwRequestTitleFormatAdmin");
        var thiz = this; // Need this because of the asynchronous operations below.

        try {
            //if (this.options.operationUriPrefix == null) {
            //    // This formulates the operationUri, which is used throughout.
            //    var url1 = window.location.href.split('https://')[1];
            //    var url2 = url1.split('/')[0];
            //    this.options.operationUriPrefix = 'https://' + url2 + '/';
            //}

            var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            this.options.elementIdSuffix = guid;

            //this.renderSharePointAppWizardOption();

            this.renderOnAppAdministrationPage();

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwRequestTitleFormatAdmin: CANNOT RENDER</span>';
            html += '<br />';
            html += '<span style="">Exception in bwRequestTitleFormatAdmin.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
    renderOnAppAdministrationPage: function () {
        try {
            console.log('In renderOnAppAdministrationPage().');
            var thiz = this;

            var html = '';

            html += '<style>';
            html += '.bwSliderTitleCell {';
            html += 'vertical-align: middle;';
            html += 'text-align: right;';
            html += 'border-top: #d8d8d8 1pt solid;';
            html += 'border-bottom: #d8d8d8 1pt solid;';
            html += 'padding-bottom: 4px;';
            html += 'padding-top: 4px;';
            html += 'padding-left: 22px;';
            html += 'padding-right: 10px;';
            html += 'background-color: white;';
            html += '}';

            html += '.bwChartCalculatorLightCurrencyTableCell {';
            html += 'vertical-align: top;';
            html += 'border-top: #d8d8d8 1pt solid;';
            html += 'border-bottom: #d8d8d8 1pt solid;';
            html += 'padding-bottom: 3px;';
            html += 'padding-top: 4px;';
            html += 'padding-left: 5px;';
            html += 'padding-right: 12px;';
            html += 'background-color: #f5f6f7;';
            html += '}';

            html += '</style>';

            //html += '<h4><strong>Step 1.</strong> Select the numbering format you would like to use for requests:&nbsp;&nbsp;'; //<span id="createanewfunctionalarealink"></span>, or this button to create a sample Functional Area: <span id="spanBtnFunctionalAreaExpressSetup"></span><p>&nbsp;</p>';
            //html += '<br />';

            var tableId_Custom = 'bwRequestTitleFormatAdmin_tableCustomTitleFormat_' + this.options.elementIdSuffix;
            html += '<table id="' + tableId_Custom + '" style="display:inline;width:100%;">';
            html += '   <tr>';
            html += '       <td style="vertical-align:top;text-align:left;width:30%;" class="bwSliderTitleCell">';
            html += '           Select the numbering format you would like to use for requests:';
            html += '       </td>';
            html += '       <td class="bwChartCalculatorLightCurrencyTableCell" style="width:70%;padding-left:15px;">';
            //html += '           <br />';
            //html += '           <span style="font-weight:bold;">Custom numbering format:</span>'
            //html += '           <br />';
            html += '           <select style="padding:5px 5px 5px 5px;" id="selectBudgetRequestTitleFormat" onchange="$(\'.bwRequestTitleFormatAdmin:first\').bwRequestTitleFormatAdmin(\'selectTitleFormat\');">';
            // default
            html += '               <option value="default" selected>';
            html += '                   [request type abbreviation]-[year]-[item #]';
            html += '               </option>';
            // custom
            html += '               <option value="custom1">';
            html += '                   [request type abbreviation]-[Request Classificaton Number]-[year]-[item #][Request Classification Suffix]';
            html += '               </option>';
            html += '           </select>';
            html += '           <br /><br />';

            var formatDetailsId = 'bwRequestTitleFormatAdmin_divTitleFormatDetails_' + this.options.elementIdSuffix;
            html += '           <div id="' + formatDetailsId + '"></div>';

            html += '           <br /><br />';
            html += '       </td>';
            html += '   </tr>';
            html += '</table>';

            var classificationNumberDialog_Id = 'bwRequestTitleFormatAdmin_classificationNumberDialog_' + this.options.elementIdSuffix;
            html += '<div style="display:none;" id="' + classificationNumberDialog_Id + '">';
            html += '   <table style="width:100%;">';
            html += '       <tr>';
            html += '           <td style="width:90%;">';
            html += '               <span id="spanAddAnOrgItemDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">[spanAddAnOrgItemDialogTitle]</span>';
            html += '           </td>';
            html += '           <td style="width:9%;"></td>';
            html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divManageProjectTypeDialog\').dialog(\'close\');">X</span>';
            html += '           </td>';
            html += '       </tr>';
            html += '   </table>';
            html += '   <br /><br />';
            html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '   <span id="spanAddAnOrgItemDialogInvitationDescriptionText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;"></span>';
            html += '   <span style="font-family: calibri;">Name</span>';
            html += '   <br />';
            html += '   <input type="text" id="txtManageProjectTypeDialog_Name" style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />';
            html += '   <br /><br />';
            html += '   <span style="font-family: calibri;">Abbreviation</span>';
            html += '   <br />';
            html += '   <input type="text" id="txtManageProjectTypeDialog_Abbreviation" style="width:25%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />';
            html += '   <br /><br />';
            html += '   <span style="font-family: calibri;">Id</span>';
            html += '   <br />';
            html += '   <input id="txtManageProjectTypeDialog_Id" type="text" disabled style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" /><br />';
            html += '   <br /><br /><br />';
            html += '   <div id="divManageProjectTypeDialogSubmitButton" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
            html += '       Add the xx';
            html += '   </div>';
            html += '   <br /><br />';
            html += '   <div class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;" onclick="$(\'#divManageProjectTypeDialog\').dialog(\'close\');">';
            html += '       Close';
            html += '   </div>';
            html += '   <br /><br />';
            html += '</div>';

            var classificationSuffixDialog_Id = 'bwRequestTitleFormatAdmin_classificationSuffixDialog_' + this.options.elementIdSuffix;
            html += '<div id="' + classificationSuffixDialog_Id + '" style="display:none;">';
            html += '   <span id="spanErrorMessage" style="font-size:40pt;"></span><br /><br />';
            html += '   <div id="divAlertDialogCloseButton" class="divDialogButton" onclick="cmdCloseError();">';
            html += '       Close';
            html += '   </div>';
            html += '   <br /><br />';
            html += '   <br /><br />';
            html += '   classificationSuffixDialog';
            html += '   <br /><br />';
            html += '</div>';

            // Render the html. THIS WAY IS PREFERABLE COME BACK AND FIX SOMETIME
            this.element.html(html);

            this.selectTitleFormat();

        } catch (e) {
            console.log('Exception in renderOnAppAdministrationPage(): ' + e.message + ', ' + e.stack);
            alert('Exception in renderOnAppAdministrationPage(): ' + e.message + ', ' + e.stack);
        }
    },
    renderSharePointAppWizardOption: function () {
        try {
            console.log('In renderSharePointAppWizardOption().');
            var thiz = this;

            var html = '';

            html += '<style>';
            html += '.bwSliderTitleCell {';
            html += 'vertical-align: middle;';
            html += 'text-align: right;';
            html += 'border-top: #d8d8d8 1pt solid;';
            html += 'border-bottom: #d8d8d8 1pt solid;';
            html += 'padding-bottom: 4px;';
            html += 'padding-top: 4px;';
            html += 'padding-left: 22px;';
            html += 'padding-right: 10px;';
            html += 'background-color: white;';
            html += '}';

            html += '.bwChartCalculatorLightCurrencyTableCell {';
            html += 'vertical-align: top;';
            html += 'border-top: #d8d8d8 1pt solid;';
            html += 'border-bottom: #d8d8d8 1pt solid;';
            html += 'padding-bottom: 3px;';
            html += 'padding-top: 4px;';
            html += 'padding-left: 5px;';
            html += 'padding-right: 12px;';
            html += 'background-color: #f5f6f7;';
            html += '}';

            html += '</style>';

            html += '<h4><strong>Step 1.</strong> Select the numbering format you would like to use for requests:&nbsp;&nbsp;'; //<span id="createanewfunctionalarealink"></span>, or this button to create a sample Functional Area: <span id="spanBtnFunctionalAreaExpressSetup"></span><p>&nbsp;</p>';
            html += '<br />';

            var tableId_Custom = 'bwRequestTitleFormatAdmin_tableCustomTitleFormat_' + this.options.elementIdSuffix;
            html += '<table id="' + tableId_Custom + '" style="display:inline;width:100%;">';
            html += '   <tr>';
            html += '       <td style="text-align:left;width:100px;" class="bwSliderTitleCell">';
            //html += '           Select the Request Title format:&nbsp;';
            html += '       </td>';
            html += '       <td class="bwChartCalculatorLightCurrencyTableCell" style="width:100%;padding-left:15px;">';
            //html += '           <br />';
            //html += '           <span style="font-weight:bold;">Custom numbering format:</span>'
            //html += '           <br />';
            html += '           <select style="padding:5px 5px 5px 5px;" id="selectBudgetRequestTitleFormat" onchange="$(\'.bwRequestTitleFormatAdmin:first\').bwRequestTitleFormatAdmin(\'selectTitleFormat\');">';
            // default
            html += '               <option value="default" selected>';
            html += '                   [request type abbreviation]-[year]-[item #]';
            html += '               </option>';
            // custom
            html += '               <option value="custom1">';
            html += '                   [request type abbreviation]-[Request Classificaton Number]-[year]-[item #][Request Classification Suffix]';
            html += '               </option>';
            html += '           </select>';
            html += '           <br /><br />';

            var formatDetailsId = 'bwRequestTitleFormatAdmin_divTitleFormatDetails_' + this.options.elementIdSuffix;
            html += '           <div id="' + formatDetailsId + '"></div>';

            html += '           <br /><br />';
            html += '       </td>';
            html += '   </tr>';
            html += '</table>';

            var classificationNumberDialog_Id = 'bwRequestTitleFormatAdmin_classificationNumberDialog_' + this.options.elementIdSuffix;
            html += '<div style="display:none;" id="' + classificationNumberDialog_Id + '">';
            html += '   <table style="width:100%;">';
            html += '       <tr>';
            html += '           <td style="width:90%;">';
            html += '               <span id="spanAddAnOrgItemDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">[spanAddAnOrgItemDialogTitle]</span>';
            html += '           </td>';
            html += '           <td style="width:9%;"></td>';
            html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divManageProjectTypeDialog\').dialog(\'close\');">X</span>';
            html += '           </td>';
            html += '       </tr>';
            html += '   </table>';
            html += '   <br /><br />';
            html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '   <span id="spanAddAnOrgItemDialogInvitationDescriptionText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;"></span>';
            html += '   <span style="font-family: calibri;">Name</span>';
            html += '   <br />';
            html += '   <input type="text" id="txtManageProjectTypeDialog_Name" style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />';
            html += '   <br /><br />';
            html += '   <span style="font-family: calibri;">Abbreviation</span>';
            html += '   <br />';
            html += '   <input type="text" id="txtManageProjectTypeDialog_Abbreviation" style="width:25%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />';
            html += '   <br /><br />';
            html += '   <span style="font-family: calibri;">Id</span>';
            html += '   <br />';
            html += '   <input id="txtManageProjectTypeDialog_Id" type="text" disabled style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" /><br />';
            html += '   <br /><br /><br />';
            html += '   <div id="divManageProjectTypeDialogSubmitButton" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
            html += '       Add the xx';
            html += '   </div>';
            html += '   <br /><br />';
            html += '   <div class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;" onclick="$(\'#divManageProjectTypeDialog\').dialog(\'close\');">';
            html += '       Close';
            html += '   </div>';
            html += '   <br /><br />';
            html += '</div>';

            var classificationSuffixDialog_Id = 'bwRequestTitleFormatAdmin_classificationSuffixDialog_' + this.options.elementIdSuffix;
            html += '<div id="' + classificationSuffixDialog_Id + '" style="display:none;">';
            html += '   <span id="spanErrorMessage" style="font-size:40pt;"></span><br /><br />';
            html += '   <div id="divAlertDialogCloseButton" class="divDialogButton" onclick="cmdCloseError();">';
            html += '       Close';
            html += '   </div>';
            html += '   <br /><br />';
            html += '   <br /><br />';
            html += '   classificationSuffixDialog';
            html += '   <br /><br />';
            html += '</div>';

            // Render the html. THIS WAY IS PREFERABLE COME BACK AND FIX SOMETIME
            this.element.html(html);

            this.selectTitleFormat();

        } catch (e) {
            console.log('Exception in renderSharePointAppWizardOption(): ' + e.message + ', ' + e.stack);
            alert('Exception in renderSharePointAppWizardOption(): ' + e.message + ', ' + e.stack);
        }
    },
    selectTitleFormat: function () {
        try {
            console.log('In selectTitleFormat().');
            var thiz = this;

            var rect1 = document.getElementById('divBwRequestTitleFormatAdmin').getBoundingClientRect();
            var width = rect1.right - rect1.left;
            console.log('In selectTitleFormat(). width:' + width);
            var tableId_Default = 'bwRequestTitleFormatAdmin_tableDefaultTitleFormat_' + this.options.elementIdSuffix;

            console.log('In selectTitleFormat(). Getting value from the [selectBudgetRequestTitleFormat] drop-down.');
            var titleFormat = $('#selectBudgetRequestTitleFormat option:selected').val(); // Expected values: ['default', 'custom1']

            if ((titleFormat == 'default') || (titleFormat == 'custom1')) {
                this.displayTitleFormatDetails(titleFormat);
            } else {
                console.log('xcx3242347 Unexpected value for titleFormat: ' + titleFormat);
                alert('xcx3242347 Unexpected value for titleFormat: ' + titleFormat);
            }


        } catch (e) {
            console.log('Exception in selectTitleFormat(): ' + e.message + ', ' + e.stack);
            alert('Exception in selectTitleFormat(): ' + e.message + ', ' + e.stack);
        }
    },
    displayTitleFormatDetails: function (titleFormat) {
        try {
            console.log('In displayTitleFormatDetails(). titleFormat: ' + titleFormat);

            var html = '';

            if (titleFormat == 'default') {
                html += 'An example of this format: BR-220001';
            } else if (titleFormat == 'custom1') {
                html += 'An example of this format: BR-108-22-001C';
                html += '<br /><br />';
                html += '<span style="font-style:italic;">This selection will create 2 additional lists to support this numbering format: "Request Classificaton Number" and "Request Classification Suffix".</span>';
            } else {
                html += 'UNEXPECTED VALUE FOR titleFormat: ' + titleFormat;
            }

            var formatDetailsId = 'bwRequestTitleFormatAdmin_divTitleFormatDetails_' + this.options.elementIdSuffix;
            $('#' + formatDetailsId).html(html);

        } catch (e) {
            console.log('Exception in displayTitleFormatDetails(): ' + e.message + ', ' + e.stack);
            alert('Exception in displayTitleFormatDetails(): ' + e.message + ', ' + e.stack);
        }
    },
    populateClassificationNumber: function () {
        try {
            console.log('In populateClassificationNumber().');

            var tableId_Custom = 'bwRequestTitleFormatAdmin_tableCustomTitleFormat_' + this.options.elementIdSuffix;
            var selectClassificationNumber = tableId_Custom + '_SelectClassificationNumber';
            var html = '';
            html += '               <option value="' + '108' + '" selected>';
            html += '108';
            html += '               </option>';
            $('#' + selectClassificationNumber).append(html);

        } catch (e) {
            console.log('Exception in populateClassificationNumber(): ' + e.message + ', ' + e.stack);
            alert('Exception in populateClassificationNumber(): ' + e.message + ', ' + e.stack);
        }
    },
    populateFiscalYear: function () {
        try {
            console.log('In populateFiscalYear().');

            var tableId_Custom = 'bwRequestTitleFormatAdmin_tableCustomTitleFormat_' + this.options.elementIdSuffix;
            var selectFiscalYear = tableId_Custom + '_SelectFiscalYear';
            var html = '';
            for (var i = 22; i < 100; i++) {
                html += '               <option value="' + i + '" selected>';
                html += i;
                html += '               </option>';
            }
            $('#' + selectFiscalYear).append(html);

        } catch (e) {
            console.log('Exception in populateFiscalYear(): ' + e.message + ', ' + e.stack);
            alert('Exception in populateFiscalYear(): ' + e.message + ', ' + e.stack);
        }
    },
    populateClassificationSuffix: function () {
        try {
            console.log('In populateClassificationSuffix().');

            var tableId_Custom = 'bwRequestTitleFormatAdmin_tableCustomTitleFormat_' + this.options.elementIdSuffix;
            var selectClassificationSuffix = tableId_Custom + '_SelectClassificationSuffix';
            var html = '';
            html += '               <option value="' + 'C' + '" selected>';
            html += 'C';
            html += '               </option>';
            $('#' + selectClassificationSuffix).append(html);

        } catch (e) {
            console.log('Exception in populateClassificationSuffix(): ' + e.message + ', ' + e.stack);
            alert('Exception in populateClassificationSuffix(): ' + e.message + ', ' + e.stack);
        }
    },
    displayClassificationNumberDialog: function () {
        try {
            console.log('In displayClassificationNumberDialog().');

            var classificationNumberDialog_Id = 'bwRequestTitleFormatAdmin_classificationNumberDialog_' + this.options.elementIdSuffix;
            $('#' + classificationNumberDialog_Id).dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '500',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $('#' + classificationNumberDialog_Id).dialog('close');
                    });
                },
                close: function () {
                    $('#' + classificationNumberDialog_Id).dialog('destroy');
                }
            });
            //$("#divManageTimerServiceDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();




        } catch (e) {
            console.log('Exception in displayClassificationNumberDialog(): ' + e.message + ', ' + e.stack);
            alert('Exception in displayClassificationNumberDialog(): ' + e.message + ', ' + e.stack);
        }
    },
    displayClassificationSuffixDialog: function () {
        try {
            console.log('In displayClassificationSuffixDialog().');

            var classificationSuffixDialog_Id = 'bwRequestTitleFormatAdmin_classificationSuffixDialog_' + this.options.elementIdSuffix;
            $('#' + classificationSuffixDialog_Id).dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '500',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $('#' + classificationSuffixDialog_Id).dialog('close');
                    });
                },
                close: function () {
                    $('#' + classificationSuffixDialog_Id).dialog('destroy');
                }
            });
            //$("#divManageTimerServiceDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();




        } catch (e) {
            console.log('Exception in displayClassificationSuffixDialog(): ' + e.message + ', ' + e.stack);
            alert('Exception in displayClassificationSuffixDialog(): ' + e.message + ', ' + e.stack);
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
            console.log('Exception in bwAttachments.displayAlertDialog(): ' + e.message + ', ' + e.stack);
        }
    }


});