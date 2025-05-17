$.widget("bw.bwProjectTypeDropDown", {
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
        This is the bwProjectTypeDropDown.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        fieldTitle: 'Project Type', // This is the title, which shows up on the form in the left column.

        jsonData: null,

        projectTypes: [],

        allowRequestModifications: false,
        renderAsARequiredField: null, // If this is true, then just display the red asterisk.

        inFormsEditor: null, // This is when forms are being designed. This prevents the widget from hitting the database (going asynchronous) when this is true. If that happens, a race condition may occur and addition to the toolbox may partially fail.

        operationUriPrefix: null,
        ajaxTimeout: 15000,
        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function () {
        this.element.addClass("bwProjectTypeDropDown");
        try {
            //debugger;
            var thiz = this; // Need this because of the asynchronous operations below.

            var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            //var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            //var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            //var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            selfDiscoverOperationUri(thiz); // This sets this.options.operationUriPrefix correctly.

            if (this.options.inFormsEditor == true) {
                this.renderAndPopulateProjectTypeDropDown_ReadOnly(); // Need to render, not allowing the user to make modifications.
            } else {
                //debugger;
            // 
            // Load this object first so we don't have to keep making web service calls.
            //
            //if (this.options.projectTypes.length > 0) {
            //    this.renderAndPopulateProjectTypeDropDown();
            //} else {
                $.ajax({
                    url: this.options.operationUriPrefix + "odata/ProjectTypes/" + workflowAppId + "/true", //
                    dataType: "json",
                    contentType: "application/json",
                    type: "Get",
                    timeout: this.options.ajaxTimeout
                }).done(function (result) {
                    try {
                        if (result.message != 'SUCCESS') {
                            var html = '';
                            html += '<span style="font-size:24pt;color:red;">bwProjectTypeEditor: CANNOT RENDER</span>';
                            html += '<br />';
                            html += '<span style="">Error in bwProjectTypeEditor.Create(): ' + result.message + '</span>';
                            thiz.element.html(html);
                        } else {
                            thiz.options.projectTypes = result.ProjectTypes;

                            if (thiz.options.allowRequestModifications == false) {
                                thiz.renderAndPopulateProjectTypeDropDown_ReadOnly(); // Need to render, not allowing the user to make modifications.
                            } else if (thiz.options.allowRequestModifications == true) {
                                thiz.renderAndPopulateProjectTypeDropDown();
                            } else {
                                var html = '';
                                html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwProjectTypeDropDown</span>';
                                html += '<br />';
                                html += '<span style="">Invalid value for allowRequestModifications: ' + thiz.options.allowRequestModifications + '</span>';
                                thiz.element.html(html);
                            }

                            console.log('In bwProjectTypeDropDown._create(). The widget has been initialized.');
                        }
                    } catch (e) {
                        console.log('Exception in bwProjectTypeEditor._create().xx.Get:1: ' + e.message + ', ' + e.stack);
                    }

                }).fail(function (data) {
                    //lpSpinner.Hide();
                    debugger;
                    console.log('In bwProjectTypeEditor._create.ProjectTypes.fail(): ' + JSON.stringify(data));
                    var msg;
                    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                    } else {
                        msg = JSON.stringify(data);
                    }
                    alert('Exception in bwProjectTypeEditor._create().xx.Get:2: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                    console.log('Exception in bwProjectTypeEditor._create().xx.Get:2: ' + JSON.stringify(data));
                    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                    //var error = JSON.parse(data.responseText)["odata.error"];
                    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                });
            }

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwProjectTypeDropDown</span>';
            html += '<br />';
            html += '<span style="">Exception in bwProjectTypeDropDown.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwProjectTypeDropDown")
            .text("");
    },
    getData: function () {
        try {
            console.log('In bwProjectTypeDropDown.getData().');
            var dropDownElement = $(this.element).find('#selectProjectType')[0];
            var selectedValue = $(dropDownElement).find('option:selected').val();
            if (selectedValue.indexOf('Select a') > -1) {
                return null;
            } else {
                return selectedValue;
            }
        } catch (e) {
            console.log('Exception in bwProjectTypeDropDown.getData(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwProjectTypeDropDown.getData(): ' + e.message + ', ' + e.stack);
        }
    },
    isARequiredField: function () {
        try {
            console.log('In bwProjectTypeDropDown.isARequiredField().');
            return this.options.renderAsARequiredField;
        } catch (e) {
            console.log('Exception in bwProjectTypeDropDown.isARequiredField(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwProjectTypeDropDown.isARequiredField(): ' + e.message + ', ' + e.stack);
        }
    },
    getfieldTitle: function () {
        try {
            console.log('In bwProjectTypeDropDown.getfieldTitle().');
            return this.options.fieldTitle;
        } catch (e) {
            console.log('Exception in bwProjectTypeDropDown.getfieldTitle(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwProjectTypeDropDown.getfieldTitle(): ' + e.message + ', ' + e.stack);
        }
    },
    renderAndPopulateProjectTypeDropDown: function (requestDialogId) {
        try {
            console.log('In renderAndPopulateProjectTypeDropDown().');
            var thiz = this;

            

            var html = '';

            html += '<table style="width:100%;">';
            html += '                        <tbody><tr class="xdTableOffsetRow xdTableOffsetRow-editor" id="toolboxdraggablerow_254f" draggable="true" bwwidgetname="bwProjectTypeDropDown">';
            html += '                            <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
            html += '                                <span class="xdlabel">';
            html += '                                    Project Type:';
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
            html += '       <select id="selectProjectType" class="bwRequestJson" bwfieldname="ProjectType" bwdatatype="String" bwdatarequired="true" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: right;" onchange="$(\'.bwRequest\').bwRequest(\'selectProjectType_OnChange\', this);" size="1" >';
            //class="bwRequestJson" bwDataRequired="true" bwDataType="string" bwFieldname="ProjectTitle" id="strProjectTitle" 

            if (this.options.projectTypes.length == 0) {
                html += '   <option>No project types exist...</option>';
            } else {

                var selectedValue = '';
                if (this.options.jsonData != null) {
                    if (this.options.jsonData['ProjectType']) {
                        selectedValue = this.options.jsonData['ProjectType'].value;
                    } 
                }
                //debugger;

                html += '    <option>' + 'Select a Project Type...' + '</option>';
                for (var i = 0; i < thiz.options.projectTypes.length; i++) {
                    if (thiz.options.projectTypes[i].isActive == true) {
                        var concatenatedAbbreviationAndType = thiz.options.projectTypes[i].Abbreviation + ' - ' + thiz.options.projectTypes[i].ProjectType;
                        if (concatenatedAbbreviationAndType == selectedValue) {
                            html += '    <option selected >' + thiz.options.projectTypes[i].Abbreviation + ' - ' + thiz.options.projectTypes[i].ProjectType + '</option>';
                        } else {
                            html += '    <option>' + thiz.options.projectTypes[i].Abbreviation + ' - ' + thiz.options.projectTypes[i].ProjectType + '</option>';
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

            //debugger;
            //// If we have jsonData, populate the element.
            //try {
            //    if (this.options.jsonData != null) {
            //        //var dataElement = $(this.element).find('.bwRequestJson')[0];
            //        //var bwFieldName = dataElement.getAttribute('bwfieldname');
            //        //debugger;
            //        //var value;
            //        if (this.options.jsonData['ProjectType']) {
            //            //var value = this.options.jsonData['ProjectType'].value;
            //            //dataElement.value = value;
            //        } else {
            //            this.options.jsonData['ProjectType'] = {
            //                value: null
            //            }
            //        }
                    
                    
            //    }
            //} catch (e) {
            //    console.log('Exception in renderAndPopulateProjectTypeDropDown.jsonData: ' + e.message + ', ' + e.stack);
            //    //$('#' + requestDialogId).find('#spanRequestForm_Error')[0].innerHTML = 'Exception in renderAndPopulateProjectTypeDropDown.jsonData: ' + e.message + ', ' + e.stack;
            //}

        } catch (e) {
            console.log('Exception in renderAndPopulateProjectTypeDropDown: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwProjectTypeDropDown</span>';
            html += '<br />';
            html += '<span style="">Exception in bwProjectTypeDropDown.renderAndPopulateProjectTypeDropDown(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    },

    renderAndPopulateProjectTypeDropDown_ReadOnly: function (requestDialogId) {
        try {
            console.log('In renderAndPopulateProjectTypeDropDown_ReadOnly().');
            var thiz = this;
            var html = '';

            html += '<table style="width:100%;">';
            html += '                        <tbody><tr class="xdTableOffsetRow xdTableOffsetRow-editor" id="toolboxdraggablerow_254f" draggable="true" bwwidgetname="bwProjectTypeDropDown">';
            html += '                            <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
            html += '                                <span class="xdlabel">';
            html += '                                    Project Type:';
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
            html += '       <select id="selectProjectType" contentEditable="false" disabled class="bwRequestJson" bwfieldname="ProjectType" bwdatatype="String" bwdatarequired="true" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: right;" onchange="$(\'.bwRequest\').bwRequest(\'selectProjectType_OnChange\', this);" size="1" >';
            // class="bwRequestJson" bwDataRequired="true" bwDataType="string" bwFieldname="ProjectTitle" id="strProjectTitle" 
            //debugger;
            if (this.options.inFormsEditor != true) {
                if (this.options.jsonData == null) {
                    if (this.options.inFormsEditor != true) {
                        html += '   <option>No project type has been selected.</option>';
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

        } catch (e) {
            console.log('Exception in renderAndPopulateProjectTypeDropDown_ReadOnly: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwProjectTypeDropDown</span>';
            html += '<br />';
            html += '<span style="">Exception in bwProjectTypeDropDown.renderAndPopulateProjectTypeDropDown_ReadOnly(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    }


});