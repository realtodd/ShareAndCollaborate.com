$.widget("bw.bwPillarTypeDropDown", {
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
        This is the bwPillarTypeDropDown.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        fieldTitle: 'Pillar Type', // This is the title, which shows up on the form in the left column.

        jsonData: null,

        pillarTypes: [],

        allowRequestModifications: false,
        renderAsARequiredField: null, // If this is true, then just display the red asterisk.

        inFormsEditor: null, // This is when forms are being designed. This prevents the widget from hitting the database (going asynchronous) when this is true. If that happens, a race condition may occur and addition to the toolbox may partially fail.

        operationUriPrefix: null,
        ajaxTimeout: 15000,
        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function () {
        this.element.addClass("bwPillarTypeDropDown");
        //debugger;
        var thiz = this; // Need this because of the asynchronous operations below.

        var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
        //var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
        //var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
        //var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

        try {

            selfDiscoverOperationUri(thiz); // This sets this.options.operationUriPrefix correctly.

            if (this.options.inFormsEditor == true) {
                this.renderAndPopulatePillarTypeDropDown_ReadOnly(); // Need to render, not allowing the user to make modifications.
            } else {
                //debugger;
            // 
            // Load this object first so we don't have to keep making web service calls.
            //
            //if (this.options.pillarTypes.length > 0) {
            //    this.renderAndPopulatePillarTypeDropDown();
            //} else {
                $.ajax({
                    url: this.options.operationUriPrefix + "odata/PillarTypes/" + workflowAppId + "/true", //
                    dataType: "json",
                    contentType: "application/json",
                    type: "Get",
                    timeout: this.options.ajaxTimeout
                }).done(function (result) {
                    try {
                        //debugger;
                        if (result.message != 'SUCCESS') {
                            var html = '';
                            html += '<span style="font-size:24pt;color:red;">bwPillarTypeEditor: CANNOT RENDER</span>';
                            html += '<br />';
                            html += '<span style="">Error in bwPillarTypeEditor.Create(): ' + result.message + '</span>';
                            thiz.element.html(html);
                        } else {
                            //debugger;
                            thiz.options.pillarTypes = result.PillarTypes;

                            if (thiz.options.allowRequestModifications == false) {
                                thiz.renderAndPopulatePillarTypeDropDown_ReadOnly(); // Need to render, not allowing the user to make modifications.
                            } else if (thiz.options.allowRequestModifications == true) {
                                thiz.renderAndPopulatePillarTypeDropDown();
                            } else {
                                var html = '';
                                html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwPillarTypeDropDown xcx1</span>';
                                html += '<br />';
                                html += '<span style="">Invalid value for allowRequestModifications: ' + thiz.options.allowRequestModifications + '</span>';
                                thiz.element.html(html);
                            }

                            console.log('In bwPillarTypeDropDown._create(). The widget has been initialized.');
                        }
                    } catch (e) {
                        console.log('Exception in bwPillarTypeEditor._create().xx.Get:1: ' + e.message + ', ' + e.stack);
                    }

                }).fail(function (data) {
                    //lpSpinner.Hide();
                    debugger;
                    console.log('In bwPillarTypeEditor._create.PillarTypes.fail(): ' + JSON.stringify(data));
                    var msg;
                    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                    } else {
                        msg = JSON.stringify(data);
                    }
                    alert('Exception in bwPillarTypeEditor._create().xx.Get:2: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                    console.log('Exception in bwPillarTypeEditor._create().xx.Get:2: ' + JSON.stringify(data));
                    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                    //var error = JSON.parse(data.responseText)["odata.error"];
                    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                });
            }

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwPillarTypeDropDown xcx2</span>';
            html += '<br />';
            html += '<span style="">Exception in bwPillarTypeDropDown.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwPillarTypeDropDown")
            .text("");
    },
    getData: function () {
        try {
            console.log('In bwPillarTypeDropDown.getData().');
            var dropDownElement = $(this.element).find('#selectPillarType')[0];
            var selectedValue = $(dropDownElement).find('option:selected').val();
            //debugger;
            if (selectedValue.indexOf('Select a') > -1) {
                return null;
            } else {
                return selectedValue;
            }
        } catch (e) {
            console.log('Exception in bwPillarTypeDropDown.getData(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwPillarTypeDropDown.getData(): ' + e.message + ', ' + e.stack);
        }
    },
    isARequiredField: function () {
        try {
            console.log('In bwPillarTypeDropDown.isARequiredField().');
            return this.options.renderAsARequiredField;
        } catch (e) {
            console.log('Exception in bwPillarTypeDropDown.isARequiredField(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwPillarTypeDropDown.isARequiredField(): ' + e.message + ', ' + e.stack);
        }
    },
    getfieldTitle: function () {
        try {
            console.log('In bwPillarTypeDropDown.getfieldTitle().');
            return this.options.fieldTitle;
        } catch (e) {
            console.log('Exception in bwPillarTypeDropDown.getfieldTitle(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwPillarTypeDropDown.getfieldTitle(): ' + e.message + ', ' + e.stack);
        }
    },
    renderAndPopulatePillarTypeDropDown: function (requestDialogId) {
        try {
            console.log('In renderAndPopulatePillarTypeDropDown().');
            var thiz = this;
            var html = '';

            html += '<table style="width:100%;">';
            html += '                        <tbody><tr class="xdTableOffsetRow xdTableOffsetRow-editor" id="toolboxdraggablerow_254g" draggable="true" bwwidgetname="bwPillarTypeDropDown">';
            html += '                            <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
            html += '                                <span class="xdlabel">';
            html += '                                    Pillar Type:';
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
            
            html += '   <div>';

            html += '     <span >';
            html += '       <select id="selectPillarType" class="bwRequestJson" bwfieldname="PillarType" bwdatatype="String" bwdatarequired="true" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: right;" onchange="$(\'.bwRequest\').bwRequest(\'selectPillarType_OnChange\', this);" size="1" >';

            if (this.options.pillarTypes.length == 0) {
                html += '   <option>No pillar types exist...</option>';
            } else {

                var selectedValue = '';
                if (this.options.jsonData != null) {
                    if (this.options.jsonData['PillarType']) {
                        selectedValue = this.options.jsonData['PillarType'].value;
                    }
                }
                //debugger;

                html += '    <option>' + 'Select a Pillar Type...' + '</option>';
                for (var i = 0; i < thiz.options.pillarTypes.length; i++) {
                    if (thiz.options.pillarTypes[i].isActive == true) {
                        var concatenatedAbbreviationAndType = thiz.options.pillarTypes[i].Abbreviation + ' - ' + thiz.options.pillarTypes[i].PillarType;
                        if (concatenatedAbbreviationAndType == selectedValue) {
                            html += '    <option selected >' + thiz.options.pillarTypes[i].Abbreviation + ' - ' + thiz.options.pillarTypes[i].PillarType + '</option>';
                        } else {
                            html += '    <option>' + thiz.options.pillarTypes[i].Abbreviation + ' - ' + thiz.options.pillarTypes[i].PillarType + '</option>';
                        }
                    }
                }
            }



            html += '       </select>';
            html += '     </span>';
            html += '   </div>';
            
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

            ////debugger;
            //if (this.options.inFormsEditor != true) {
            //    // If we have jsonData, populate the element.
            //    if (this.options.jsonData != null) {
            //        var dataElement = $(this.element).find('.bwRequestJson')[0];
            //        var bwFieldName = dataElement.getAttribute('bwfieldname');
            //        var value = this.options.jsonData[bwFieldName].value;
            //        dataElement.value = value;
            //    }
            //}

            // If we have jsonData, populate the element.
            //try {
            //    if (this.options.jsonData != null) {
            //        //var dataElement = $(this.element).find('.bwRequestJson')[0];
            //        //var bwFieldName = dataElement.getAttribute('bwfieldname');
            //        //debugger;
            //        //var value;
            //        if (this.options.jsonData['PillarType']) {
            //            //var value = this.options.jsonData['PillarType'].value;
            //            //dataElement.value = value;
            //        } else {
            //            this.options.jsonData['PillarType'] = {
            //                value: null
            //            }
            //        }


            //    }
            //} catch (e) {
            //    console.log('Exception in renderAndPopulateProjectTypeDropDown.jsonData: ' + e.message + ', ' + e.stack);
            //    //$('#' + requestDialogId).find('#spanRequestForm_Error')[0].innerHTML = 'Exception in renderAndPopulateProjectTypeDropDown.jsonData: ' + e.message + ', ' + e.stack;
            //}

        } catch (e) {
            console.log('Exception in renderAndPopulatePillarTypeDropDown: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwPillarTypeDropDown xcx3</span>';
            html += '<br />';
            html += '<span style="">Exception in bwPillarTypeDropDown.renderAndPopulatePillarTypeDropDown(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    },

    renderAndPopulatePillarTypeDropDown_ReadOnly: function (requestDialogId) {
        try {
            console.log('In renderAndPopulatePillarTypeDropDown_ReadOnly().');
            var thiz = this;
            var html = '';

            html += '<table style="width:100%;">';
            html += '                        <tbody><tr class="xdTableOffsetRow xdTableOffsetRow-editor" id="toolboxdraggablerow_254g" draggable="true" bwwidgetname="bwPillarTypeDropDown">';
            html += '                            <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
            html += '                                <span class="xdlabel">';
            html += '                                    Pillar Type:';
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

            html += '   <div>';

            html += '     <span >';
            html += '       <select id="selectPillarType" contentEditable="false" disabled class="bwRequestJson" bwfieldname="PillarType" bwdatatype="String" bwdatarequired="true" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: right;" onchange="$(\'.bwRequest\').bwRequest(\'selectPillarType_OnChange\', this);" size="1" >';

            if (this.options.inFormsEditor != true) {
                if (this.options.jsonData == null) {
                    if (this.options.inFormsEditor != true) {
                        html += '   <option>No pillar has been selected.</option>';
                    }
                } else {
                    try {
                        


                        //var dataElement = $(this.element).find('.bwRequestJson')[0];
                        //var bwFieldName = dataElement.getAttribute('bwfieldname');
                        var dataElement = $(this.element).find('.bwRequestJson:first');
                        var bwFieldName = $(dataElement).attr('bwfieldname');

                        var value = this.options.jsonData[bwFieldName].value;
                        html += '    <option>' + value + '</option>';
                    } catch (e) {
                        if (this.options.inFormsEditor != true) {
                            html += '   <option>ERROR populating dropdown.</option>';
                        }
                    }
                }
            }


            html += '       </select>';
            html += '     </span>';
            html += '   </div>';

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
            //if (this.options.jsonData != null) {
            //    var dataElement = $(this.element).find('.bwRequestJson')[0];
            //    var bwFieldName = dataElement.getAttribute('bwfieldname');
            //    var value = this.options.jsonData[bwFieldName].value;
            //    dataElement.value = value;
            //}

        } catch (e) {
            console.log('Exception in renderAndPopulatePillarTypeDropDown_ReadOnly: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwPillarTypeDropDown xcx4</span>';
            html += '<br />';
            html += '<span style="">Exception in bwPillarTypeDropDown.renderAndPopulatePillarTypeDropDown_ReadOnly(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    }


});