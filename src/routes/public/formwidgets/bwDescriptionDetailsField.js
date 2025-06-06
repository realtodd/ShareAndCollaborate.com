﻿$.widget("bw.bwDescriptionDetailsField", {
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
        This is the bwDescriptionDetailsField.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        fieldTitle: '', // This is the title, which shows up on the form in the left column.

        jsonData: null,

        allowRequestModifications: false,
        renderAsARequiredField: null, // If this is true, then just display the red asterisk.

        inFormsEditor: null, // This is when forms are being designed. This prevents the widget from hitting the database (going asynchronous) when this is true. If that happens, a race condition may occur and addition to the toolbox may partially fail.

        requestDialogId: null, // This is the unique id of the request dialog being displayed. We prepend this to id's in order to make sure we can display many dialogs at one time on screen and make them unique in the dom.
        commentsAreRequired: false, // If comments are required the background is that light blue color to indicate data entry is required. 
        consolidatedCommentsJson: null,

        bwTenantId: null,
        bwWorkflowAppId: null,

        operationUriPrefix: null,
        ajaxTimeout: 15000,
        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function () {
        this.element.addClass("bwDescriptionDetailsField");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {

            selfDiscoverOperationUri(thiz); // This sets this.options.operationUriPrefix correctly.

            if (this.options.inFormsEditor == true) {
                //this.options.store = {}; // Need to provide this because if it tries to hit the database and poopulate, it won't render in time to be used in the toolbox!!!! 6-28-2020
                this.renderAndPopulateDescriptionDetailsField_ReadOnly(); // Need to render, not allowing the user to make modifications.
            } else if (this.options.allowRequestModifications == false) {
                this.renderAndPopulateDescriptionDetailsField_ReadOnly(); // Need to render, not allowing the user to make modifications.
            } else if (this.options.allowRequestModifications == true) {
                this.renderAndPopulateDescriptionDetailsField();
            } else {
                var html = '';
                html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwDescriptionDetailsField</span>';
                html += '<br />';
                html += '<span style="">Invalid value for allowRequestModifications: ' + this.options.allowRequestModifications + '</span>';
                this.element.html(html);
            }

            console.log('In bwDescriptionDetailsField._create(). The widget has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwDescriptionDetailsField</span>';
            html += '<br />';
            html += '<span style="">Exception in bwDescriptionDetailsField.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwDescriptionDetailsField")
            .text("");
    },
    getData: function () {
        try {
            console.log('In bwDescriptionDetailsField.getData().');
            //return 'This getData method is incomplete.';
            return null;
        } catch (e) {
            console.log('Exception in bwDescriptionDetailsField.getData(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwDescriptionDetailsField.getData(): ' + e.message + ', ' + e.stack);
        }
    },
    getDataType: function () {
        try {
            console.log('In bwDescriptionDetailsField.js.getDataType().');

            return 'string';
        } catch (e) {
            console.log('Exception in bwDescriptionDetailsField.js.getDataType(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwDescriptionDetailsField.js.getDataType(): ' + e.message + ', ' + e.stack);
        }
    },
    isARequiredField: function () {
        try {
            console.log('In bwDescriptionDetailsField.isARequiredField().');
            return this.options.renderAsARequiredField;
        } catch (e) {
            console.log('Exception in bwDescriptionDetailsField.isARequiredField(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwDescriptionDetailsField.isARequiredField(): ' + e.message + ', ' + e.stack);
        }
    },
    getfieldTitle: function () {
        try {
            console.log('In bwDescriptionDetailsField.getfieldTitle().');
            return this.options.fieldTitle;
        } catch (e) {
            console.log('Exception in bwDescriptionDetailsField.getfieldTitle(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwDescriptionDetailsField.getfieldTitle(): ' + e.message + ', ' + e.stack);
        }
    },
    renderAndPopulateDescriptionDetailsField: function (requestDialogId) {
        try {
            console.log('In renderAndPopulateDescriptionDetailsField().');
            var thiz = this;
            var html = '';
            

            html += '<table style="width:100%;">';
            html += '                        <tbody><tr class="xdTableOffsetRow xdTableOffsetRow-editor" id="toolboxdraggablerow_2" draggable="true" bwwidgetname="bwDescriptionDetailsField">';
            html += '                            <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
            html += '                                <span class="xdlabel">';
            html += '                                    Description Details:';
            html += '                                </span>';
            //html += '                                <span style="color:red;font-size:medium;">*</span>';

            if (this.options.renderAsARequiredField == true) {
                html += '                               <span style="color:red;font-size:medium;">*</span>';
            } else if (this.options.renderAsARequiredField == false) {
                //
            } else {
                html += '                               <span class="ToggleRequiredAsterisk" title="Select this asterick to make this a required field." onclick="$(\'.bwFormsEditor\').bwFormsEditor(\'toggleFormRequiredField\', this);">*</span>';
            }

            html += '                            </td>';
            html += '                            <td class="xdTableOffsetCellComponent" style="white-space:nowrap;text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">';



            html += '                                      <div>';
            html += '                                        <table width="100%">';
            html += '                                          <tr>';
            //if (this.options.commentsAreRequired == true) { // If comments are required the background is that light blue color to indicate data entry is required. 
            html += '                                            <td colspan="2">';
            if (this.options.commentsAreRequired == false) {
                //html += '                                              <span id="' + this.options.requestDialogId + '_DescriptionDetails" class="xdTextBoxRequired bwRequestJson" bwDataRequired="false" bwFieldname="DescriptionDetails"  title="" hideFocus="1" contentEditable="true" tabIndex="0" xd:datafmt="&quot;string&quot;,&quot;plainMultiline&quot;" style="WORD-WRAP: break-word; HEIGHT: 90px; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%;BACKGROUND-COLOR: white;">';
                html += '                                              <span id="DescriptionDetails" class="xdTextBoxRequired bwRequestJson" bwDataRequired="false" bwFieldname="DescriptionDetails"  title="" hideFocus="1" contentEditable="true" tabIndex="0" xd:datafmt="&quot;string&quot;,&quot;plainMultiline&quot;" style="WORD-WRAP: break-word; HEIGHT: 90px; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%;BACKGROUND-COLOR: white;">';
            } else {
                //html += '                                              <span id="' + this.options.requestDialogId + '_DescriptionDetails" class="xdTextBoxRequired bwRequestJson" bwDataRequired="true" bwFieldname="DescriptionDetails"  title="" hideFocus="1" contentEditable="true" tabIndex="0" xd:datafmt="&quot;string&quot;,&quot;plainMultiline&quot;" style="WORD-WRAP: break-word; HEIGHT: 90px; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%;BACKGROUND-COLOR: white;">';
                html += '                                              <span id="DescriptionDetails" class="xdTextBoxRequired bwRequestJson" bwDataRequired="true" bwFieldname="DescriptionDetails"  title="" hideFocus="1" contentEditable="true" tabIndex="0" xd:datafmt="&quot;string&quot;,&quot;plainMultiline&quot;" style="WORD-WRAP: break-word; HEIGHT: 90px; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%;BACKGROUND-COLOR: white;">';
            }
            //} else {
            //    html += '                                            <td colspan="2" class="xdTableOffsetCellComponent">';
            //    html += '                                              <span id="' + this.options.requestDialogId + '_DescriptionDetails"  title="" class="xdTextBox" hideFocus="1" contentEditable="true" tabIndex="0" xd:xctname="PlainText" xd:CtrlId="CTRL136" xd:binding="my:DescriptionDetails" xd:datafmt="&quot;string&quot;,&quot;plainMultiline&quot;" style="WORD-WRAP: break-word; HEIGHT: 120px; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%">';
            //}
            html += '                                              </span>';
            html += '                                            </td>';
            html += '                                          </tr>';
            if (this.options.consolidatedCommentsJson && this.options.consolidatedCommentsJson != null) { // If there are no commnets, then do not show the bottom expandable/collapsable text box which lists all of the entries.
                html += '                                          <xsl:if test="/*/my:ConsolidatedComments/*[text()]">';
                html += '                                            <tr>';
                html += '                                              <td width="1%" style="VERTICAL-ALIGN: top;">';
                html += '                                                <a onclick="$(\'.bwDescriptionDetailsField\').bwDescriptionDetailsField(\'ToggleExpandComments\');">';
                html += '                                                  <img id="imgExpandComments" src="../images/minus-sign.png" style="text-align:left; cursor:pointer;width:35px;height:35px;"/>';
                html += '                                                </a>';
                html += '                                              </td>';
                html += '                                              <td style="VERTICAL-ALIGN: top;">';
                html += '                                                <span id="' + this.options.requestDialogId + '_ConsolidatedComments" title="" xd:binding="my:ConsolidatedComments" class="xdTextBox" style="display:block; text-align: left; WORD-WRAP: break-word; HEIGHT: 240px; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%;" xd:xctname="NumberedList">';
                html += JSON.stringify(this.options.consolidatedCommentsJson);
                //html += '                                                  <ol style="LIST-STYLE-TYPE: square; MARGIN-BOTTOM: 0px; MARGIN-TOP: 0px">';
                //html += '                                                    <xsl:for-each select="my:ConsolidatedComments/my:Comment">';
                //html += '                                                      <li style="font-size:22pt;">';
                //html += '                                                        <xsl:value-of select="./@timestamp"/>&#160;&#160;<xsl:value-of select="./@ownerTitle"/>&#160;saidxcx33:&#160;<xsl:value-of select="."/>';
                //html += '                                                      </li>';
                //html += '                                                    </xsl:for-each>';
                //html += '                                                  </ol>';
                html += '                                                </span>';
                html += '                                              </td>';
                html += '                                            </tr>';
                html += '                                          </xsl:if>';
            }
            html += '                                        </table>';
            html += '                                      </div>';





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
                ////debugger;
                //var dataElement = $(this.element).find('.bwRequestJson')[0];
                //var bwFieldName = dataElement.getAttribute('bwfieldname');
                //var value = this.options.jsonData[bwFieldName].value;
                ////debugger;
                //dataElement.innerHTML = value;

                var dataElement = $(this.element).find('.bwRequestJson:first');
                var bwFieldName = $(dataElement).attr('bwfieldname');
                if (this.options.jsonData[bwFieldName] && this.options.jsonData[bwFieldName].value) {
                    var value = this.options.jsonData[bwFieldName].value;
                    //dataElement.value = value;
                    $(dataElement).val(value);
                }
            }

        } catch (e) {
            console.log('Exception in renderAndPopulateDescriptionDetailsField: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwDescriptionDetailsField</span>';
            html += '<br />';
            html += '<span style="">Exception in bwDescriptionDetailsField.renderAndPopulateDescriptionDetailsField(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    },

    renderAndPopulateDescriptionDetailsField_ReadOnly: function (requestDialogId) {
        try {
            console.log('In renderAndPopulateDescriptionDetailsField_ReadOnly().');
            var thiz = this;
            var html = '';


            html += '<table style="width:100%;">';
            html += '                        <tbody><tr class="xdTableOffsetRow xdTableOffsetRow-editor" id="toolboxdraggablerow_2" draggable="true" bwwidgetname="bwDescriptionDetailsField">';
            html += '                            <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
            html += '                                <span class="xdlabel">';
            html += '                                    Description Details:';
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



            html += '                                      <div>';
            html += '                                        <table width="100%">';
            html += '                                          <tr>';
            //if (this.options.commentsAreRequired == true) { // If comments are required the background is that light blue color to indicate data entry is required. 
            html += '                                            <td colspan="2">';
            if (this.options.commentsAreRequired == false) {
                //html += '                                              <span id="' + this.options.requestDialogId + '_DescriptionDetails" class="xdTextBoxRequired bwRequestJson" bwDataRequired="false" bwFieldname="DescriptionDetails"  title="" hideFocus="1" contentEditable="true" tabIndex="0" xd:datafmt="&quot;string&quot;,&quot;plainMultiline&quot;" style="WORD-WRAP: break-word; HEIGHT: 90px; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%;BACKGROUND-COLOR: white;">';
                html += '                                              <span id="DescriptionDetails" contentEditable="false" disabled class="xdTextBoxRequired bwRequestJson" bwDataRequired="false" bwFieldname="DescriptionDetails"  title="" hideFocus="1" xd:datafmt="&quot;string&quot;,&quot;plainMultiline&quot;" style="WORD-WRAP: break-word; HEIGHT: 90px; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%;BACKGROUND-COLOR: white;">';
            } else {
                //html += '                                              <span id="' + this.options.requestDialogId + '_DescriptionDetails" class="xdTextBoxRequired bwRequestJson" bwDataRequired="true" bwFieldname="DescriptionDetails"  title="" hideFocus="1" contentEditable="true" tabIndex="0" xd:datafmt="&quot;string&quot;,&quot;plainMultiline&quot;" style="WORD-WRAP: break-word; HEIGHT: 90px; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%;BACKGROUND-COLOR: white;">';
                html += '                                              <span id="DescriptionDetails" contentEditable="false" disabled class="xdTextBoxRequired bwRequestJson" bwDataRequired="true" bwFieldname="DescriptionDetails"  title="" hideFocus="1" xd:datafmt="&quot;string&quot;,&quot;plainMultiline&quot;" style="WORD-WRAP: break-word; HEIGHT: 90px; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%;BACKGROUND-COLOR: white;">';
            }
            //} else {
            //    html += '                                            <td colspan="2" class="xdTableOffsetCellComponent">';
            //    html += '                                              <span id="' + this.options.requestDialogId + '_DescriptionDetails"  title="" class="xdTextBox" hideFocus="1" contentEditable="true" tabIndex="0" xd:xctname="PlainText" xd:CtrlId="CTRL136" xd:binding="my:DescriptionDetails" xd:datafmt="&quot;string&quot;,&quot;plainMultiline&quot;" style="WORD-WRAP: break-word; HEIGHT: 120px; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%">';
            //}
            html += '                                              </span>';
            html += '                                            </td>';
            html += '                                          </tr>';
            if (this.options.consolidatedCommentsJson && this.options.consolidatedCommentsJson != null) { // If there are no commnets, then do not show the bottom expandable/collapsable text box which lists all of the entries.
                html += '                                          <xsl:if test="/*/my:ConsolidatedComments/*[text()]">';
                html += '                                            <tr>';
                html += '                                              <td width="1%" style="VERTICAL-ALIGN: top;">';
                html += '                                                <a onclick="$(\'.bwDescriptionDetailsField\').bwDescriptionDetailsField(\'ToggleExpandComments\');">';
                html += '                                                  <img id="imgExpandComments" src="../images/minus-sign.png" style="text-align:left; cursor:pointer;width:35px;height:35px;"/>';
                html += '                                                </a>';
                html += '                                              </td>';
                html += '                                              <td style="VERTICAL-ALIGN: top;">';
                html += '                                                <span id="' + this.options.requestDialogId + '_ConsolidatedComments" title="" xd:binding="my:ConsolidatedComments" class="xdTextBox" style="display:block; text-align: left; WORD-WRAP: break-word; HEIGHT: 240px; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%;" xd:xctname="NumberedList">';
                html += JSON.stringify(this.options.consolidatedCommentsJson);
                //html += '                                                  <ol style="LIST-STYLE-TYPE: square; MARGIN-BOTTOM: 0px; MARGIN-TOP: 0px">';
                //html += '                                                    <xsl:for-each select="my:ConsolidatedComments/my:Comment">';
                //html += '                                                      <li style="font-size:22pt;">';
                //html += '                                                        <xsl:value-of select="./@timestamp"/>&#160;&#160;<xsl:value-of select="./@ownerTitle"/>&#160;saidxcx33:&#160;<xsl:value-of select="."/>';
                //html += '                                                      </li>';
                //html += '                                                    </xsl:for-each>';
                //html += '                                                  </ol>';
                html += '                                                </span>';
                html += '                                              </td>';
                html += '                                            </tr>';
                html += '                                          </xsl:if>';
            }
            html += '                                        </table>';
            html += '                                      </div>';





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
                ////debugger;
                //var dataElement = $(this.element).find('.bwRequestJson')[0];
                //var bwFieldName = dataElement.getAttribute('bwfieldname');
                //var value = this.options.jsonData[bwFieldName].value;
                ////debugger;
                //dataElement.innerHTML = value;

                var dataElement = $(this.element).find('.bwRequestJson:first');
                var bwFieldName = $(dataElement).attr('bwfieldname');
                if (this.options.jsonData[bwFieldName] && this.options.jsonData[bwFieldName].value) {
                    var value = this.options.jsonData[bwFieldName].value;
                    //dataElement.value = value;
                    $(dataElement).val(value);
                }
            }

        } catch (e) {
            console.log('Exception in renderAndPopulateDescriptionDetailsField_ReadOnly: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwDescriptionDetailsField</span>';
            html += '<br />';
            html += '<span style="">Exception in bwDescriptionDetailsField.renderAndPopulateDescriptionDetailsField_ReadOnly(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    }

    

});