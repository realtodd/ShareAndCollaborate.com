$.widget("bw.ProjectTitle", {
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
        This is the ProjectTitle.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        fieldTitle: 'Description', // This is the title, which shows up on the form in the left column.

        jsonData: null,

        allowRequestModifications: false,
        renderAsARequiredField: null, // If this is true, then just display the red asterisk.

        inFormsEditor: null, // This is when forms are being designed. This prevents the widget from hitting the database (going asynchronous) when this is true. If that happens, a race condition may occur and addition to the toolbox may partially fail.

        requestDialogId: null, // This is the unique id of the request dialog being displayed. We prepend this to id's in order to make sure we can display many dialogs at one time on screen and make them unique in the dom.

        operationUriPrefix: null,
        ajaxTimeout: 15000,
        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function () {
        this.element.addClass("ProjectTitle");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {

            selfDiscoverOperationUri(thiz); // This sets this.options.operationUriPrefix correctly.

            //alert('In ProjectTitle.js._create(). jsonData: ' + JSON.stringify(jsonData));
            if (this.options.inFormsEditor == true) {
                //this.options.store = {}; // Need to provide this because if it tries to hit the database and poopulate, it won't render in time to be used in the toolbox!!!! 6-28-2020
                this.renderAndPopulateDescriptionField_ReadOnly(); // Need to render, not allowing the user to make modifications.
            } else if (this.options.allowRequestModifications == false) {
                this.renderAndPopulateDescriptionField_ReadOnly(); // Need to render, not allowing the user to make modifications.
            } else if (this.options.allowRequestModifications == true) {
                this.renderAndPopulateDescriptionField();
            } else {
                var html = '';
                html += '<span style="font-size:24pt;color:red;">CANNOT RENDER ProjectTitle</span>';
                html += '<br />';
                html += '<span style="">Invalid value for allowRequestModifications: ' + this.options.allowRequestModifications + '</span>';
                this.element.html(html);
            }
            
            console.log('In ProjectTitle._create(). The widget has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER ProjectTitle</span>';
            html += '<br />';
            html += '<span style="">Exception in ProjectTitle._create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("ProjectTitle")
            .text("");
    },
    getData: function () {
        try {
            console.log('In ProjectTitle.getData().');

            //var value = $(this.element).find('#strProjectTitle')[0].value;

            var value;
            if ($(this.element) && $(this.element).find('#strProjectTitle') && $(this.element).find('#strProjectTitle')[0]) { // 11-7-2023. // } && $(this.element).find('#strProjectTitle')[0].innerHTML) {
                value = $(this.element).find('#strProjectTitle')[0].innerHTML;
            } else {
                value = 'Error in ProjectTitle.getData(). Cannot find value. xcx444958.';
            }

            return value;

        } catch (e) {
            console.log('Exception in ProjectTitle.getData(): ' + e.message + ', ' + e.stack);
            alert('Exception in ProjectTitle.getData(): ' + e.message + ', ' + e.stack);
        }
    },
    getDataType: function () {
        try {
            console.log('In ProjectTitle.getDataType().');

            return 'string';
        } catch (e) {
            console.log('Exception in ProjectTitle.getDataType(): ' + e.message + ', ' + e.stack);
            alert('Exception in ProjectTitle.getDataType(): ' + e.message + ', ' + e.stack);
        }
    },
    isARequiredField: function () {
        try {
            console.log('In ProjectTitle.isARequiredField().');
            return this.options.renderAsARequiredField;
        } catch (e) {
            console.log('Exception in ProjectTitle.isARequiredField(): ' + e.message + ', ' + e.stack);
            alert('Exception in ProjectTitle.isARequiredField(): ' + e.message + ', ' + e.stack);
        }
    },
    getfieldTitle: function () {
        try {
            console.log('In ProjectTitle.getfieldTitle().');
            return this.options.fieldTitle;
        } catch (e) {
            console.log('Exception in ProjectTitle.getfieldTitle(): ' + e.message + ', ' + e.stack);
            alert('Exception in ProjectTitle.getfieldTitle(): ' + e.message + ', ' + e.stack);
        }
    },
    renderAndPopulateDescriptionField: function (requestDialogId) {
        try {
            console.log('In ProjectTitle.js.renderAndPopulateDescriptionField().');
            var thiz = this;

            var html = '';

            html += '<table style="width:100%;">';
            html += '                        <tbody><tr class="xdTableOffsetRow xdTableOffsetRow-editor" id="toolboxdraggablerow_2" draggable="true" bwwidgetname="ProjectTitle">';
            html += '                            <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
            html += '                                <span class="xdlabel">';
            html += '                                    Description:';
            html += '                                </span>';
            if (this.options.inFormsEditor == true) {
                html += '                               <span class="ToggleRequiredAsterisk" title="Select this asterick to make this a required field." onclick="$(\'.bwFormsEditor\').bwFormsEditor(\'toggleFormRequiredField\', this);">*</span>';
            } else if (this.options.renderAsARequiredField == true) {
                html += '                               <span style="color:red;font-size:medium;">*</span>';
            } else if (this.options.renderAsARequiredField == false) {
                //
            }
            html += '                            </td>';
            html += '                            <td class="xdTableOffsetCellComponent" style="white-space:nowrap;text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">';



            //html += '   <input xcx="xcx1232341-1" type="text" class="bwRequestJson" bwDataRequired="true" bwDataType="string" bwFieldname="ProjectTitle" id="strProjectTitle" onkeyup="$(\'.bwRequest\').bwRequest(\'editTextbox_OnKeyUp\', this);" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;font-weight:bold;" /> <!-- was 2.77em -->';
            console.log('In xx(). Setting min-width, max-width here. This makes the form wide enough, but not too wide. A fudge?. xcx12312343.');
            html += '   <span id="strProjectTitle" class="bwRequestJson xdTextBoxRequired" contenteditable="true" bwDataRequired="true" bwDataType="string" bwFieldname="ProjectTitle" xcx="xcx1232341-1" onkeyup="$(\'.bwRequest\').bwRequest(\'editTextbox_OnKeyUp\', this);" style="min-width:550px;max-width:600px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;font-weight:bold;white-space:normal;overflow-wrap: break-word;"></span> <!-- was 2.77em -->';






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
            if (this.options.jsonData != null) {
                //var dataElement = $(this.element).find('.bwRequestJson')[0];
                //var bwFieldName = dataElement.getAttribute('bwfieldname');
                //var value = this.options.jsonData[bwFieldName].value;
                //dataElement.value = value;

                var dataElement = $(this.element).find('.bwRequestJson:first');
                var bwFieldName = $(dataElement).attr('bwfieldname');
                if (this.options.jsonData[bwFieldName] && this.options.jsonData[bwFieldName].value) {
                    var value = this.options.jsonData[bwFieldName].value;
                    $(dataElement).html(value);
                }
            }

        } catch (e) {
            console.log('Exception in renderAndPopulateDescriptionField: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER ProjectTitle</span>';
            html += '<br />';
            html += '<span style="">Exception in ProjectTitle.renderAndPopulateDescriptionField(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    },

    renderAndPopulateDescriptionField_ReadOnly: function (requestDialogId) {
        try {
            console.log('In renderAndPopulateDescriptionField_ReadOnly().');
            var thiz = this;
            var html = '';
            //html += '<div style="white-space:nowrap;">';
            //html += '   <input type="text" class="bwRequestJson" bwDataRequired="true" bwDataType="string" bwFieldname="ProjectTitle" id="strProjectTitle" onkeyup="$(\'.bwRequest\').bwRequest(\'editTextbox_OnKeyUp\', this);" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" /> <!-- was 2.77em -->';
            ////html += '   <button class="spanButton2" style="height:42px;width:85px;margin-bottom:12px;" onclick="$(\'.bwRequest\').bwRequest(\'cmdSaveRequestTitle\');">Publish</button>';
            //html += '</div>';


            html += '<table style="width:100%;">';
            html += '                        <tbody><tr class="xdTableOffsetRow xdTableOffsetRow-editor" id="toolboxdraggablerow_2" draggable="true" bwwidgetname="ProjectTitle">'; // 
            html += '                            <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
            html += '                                <span class="xdlabel">';
            html += '                                    Description:';
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




            //html += '   <input type="text" xcx="xcx1232341-2" contentEditable="false" disabled class="bwRequestJson" bwDataRequired="true" bwDataType="string" bwFieldname="ProjectTitle" id="strProjectTitle" onkeyup="$(\'.bwRequest\').bwRequest(\'editTextbox_OnKeyUp\', this);" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;font-weight:bold;" /> <!-- was 2.77em -->';
            console.log('In xx(). Setting min-width here. This makes the form wide enough, but a fudge. xcx12312343.');
            html += '   <span id="strProjectTitle" class="bwRequestJson xdTextBoxRequired" bwDataRequired="true" bwDataType="string" bwFieldname="ProjectTitle" xcx="xcx1232341-1" onkeyup="$(\'.bwRequest\').bwRequest(\'editTextbox_OnKeyUp\', this);" style="min-width:550px;max-width:600px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;font-weight:bold;white-space:normal;overflow-wrap: break-word;"></span> <!-- was 2.77em -->';






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
            if (this.options.jsonData != null) {
                //var dataElement = $(this.element).find('.bwRequestJson')[0];
                //var bwFieldName = dataElement.getAttribute('bwfieldname');
                //var value = this.options.jsonData[bwFieldName].value;
                //dataElement.value = value;

                var dataElement = $(this.element).find('.bwRequestJson:first');
                var bwFieldName = $(dataElement).attr('bwfieldname');
                if (this.options.jsonData[bwFieldName] && this.options.jsonData[bwFieldName].value) {
                    var value = this.options.jsonData[bwFieldName].value;
                    //dataElement.value = value;
                    $(dataElement).html(value);
                }
            }

        } catch (e) {
            console.log('Exception in renderAndPopulateDescriptionField_ReadOnly: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER ProjectTitle</span>';
            html += '<br />';
            html += '<span style="">Exception in ProjectTitle.renderAndPopulateDescriptionField_ReadOnly(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    }

});