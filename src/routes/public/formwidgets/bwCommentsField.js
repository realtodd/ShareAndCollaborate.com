$.widget("bw.bwCommentsField", {
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
        This is the bwCommentsField.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        fieldTitle: 'Comments', // This is the title, which shows up on the form in the left column.

        jsonData: null,

        customRenderingInstructions: null,

        allowRequestModifications: false,
        renderAsARequiredField: null, // If this is true, then just display the red asterisk.

        inFormsEditor: null, // This is when forms are being designed. This prevents the widget from hitting the database (going asynchronous) when this is true. If that happens, a race condition may occur and addition to the toolbox may partially fail.

        requestDialogId: null, // This is the unique id of the request dialog being displayed. We prepend this to id's in order to make sure we can display many dialogs at one time on screen and make them unique in the dom.

        operationUriPrefix: null,
        ajaxTimeout: 15000,
        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function () {
        this.element.addClass("bwCommentsField");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {

            selfDiscoverOperationUri(thiz); // This sets this.options.operationUriPrefix correctly.

            var customRenderingInstruction;
            if (this.options.customRenderingInstructions) {
                for (var i = 0; i < this.options.customRenderingInstructions.length; i++) {
                    if (this.options.customRenderingInstructions[i].bwCommentsField) {
                        customRenderingInstruction = this.options.customRenderingInstructions[i].bwCommentsField.CustomRenderingInstruction;
                        break;
                    }
                }
            }

            if (customRenderingInstruction && (customRenderingInstruction == 'RENDER_FOR_PRINTED_INVOICE')) {

                this.renderAndPopulateCommentsField(null, customRenderingInstruction);

            } else {

                if (this.options.inFormsEditor == true) {
                    //this.options.store = {}; // Need to provide this because if it tries to hit the database and poopulate, it won't render in time to be used in the toolbox!!!! 6-28-2020
                    this.renderAndPopulateCommentsField_ReadOnly(); // Need to render, not allowing the user to make modifications.
                } else if (this.options.allowRequestModifications == false) {
                    this.renderAndPopulateCommentsField_ReadOnly(); // Need to render, not allowing the user to make modifications.
                } else if (this.options.allowRequestModifications == true) {
                    this.renderAndPopulateCommentsField();
                } else {
                    var html = '';
                    html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwCommentsField</span>';
                    html += '<br />';
                    html += '<span style="">Invalid value for allowRequestModifications: ' + this.options.allowRequestModifications + '</span>';
                    this.element.html(html);
                }

            }

            console.log('In bwCommentsField._create(). The widget has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwCommentsField</span>';
            html += '<br />';
            html += '<span style="">Exception in bwCommentsField.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwCommentsField")
            .text("");
    },
    getDataType: function () {
        try {
            console.log('In bwCommentsField.js.getDataType().');

            return 'string';

        } catch (e) {
            console.log('Exception in bwCommentsField.js.getDataType(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwCommentsField.js.getDataType(): ' + e.message + ', ' + e.stack);
        }
    },
    getData: function () {
        try {
            console.log('In bwCommentsField.getData().');

            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            // Get the latest user-entered comment, and add the previous comments to it so that everything gets returned Ok!
            var comments;
            if (this.options.jsonData && this.options.jsonData['bwCommentsField'] && this.options.jsonData['bwCommentsField'].value && this.options.jsonData['bwCommentsField'].value.length && this.options.jsonData['bwCommentsField'].value.length > 0) {
                // Since their are historical comments, we need to add them!
                comments = this.options.jsonData['bwCommentsField'].value;
            } else {
                // This is the first comment!
                comments = [];
            }

            var reviewerComments = $(this.element).find('#ReviewerComments')[0].innerHTML;
            if (reviewerComments && reviewerComments.trim() != '' && reviewerComments.trim() != '<br>') {
                var comment = {
                    ReviewerComments: reviewerComments,
                    CreatedByFriendlyName: participantFriendlyName,
                    CreatedByEmail: participantEmail,
                    CreatedById: participantId,
                    Created: new Date()
                }
                comments.push(comment);
            }

            return comments;

        } catch (e) {
            console.log('Exception in bwCommentsField.getData(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwCommentsField.getData(): ' + e.message + ', ' + e.stack);
        }
    },
    isARequiredField: function () {
        try {
            console.log('In bwCommentsField.isARequiredField().');
            return this.options.renderAsARequiredField;
        } catch (e) {
            console.log('Exception in bwCommentsField.isARequiredField(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwCommentsField.isARequiredField(): ' + e.message + ', ' + e.stack);
        }
    },
    getfieldTitle: function () {
        try {
            console.log('In bwCommentsField.getfieldTitle().');
            return this.options.fieldTitle;
        } catch (e) {
            console.log('Exception in bwCommentsField.getfieldTitle(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwCommentsField.getfieldTitle(): ' + e.message + ', ' + e.stack);
        }
    },

    renderExistingComments: function () {
        try {
            console.log('In bwCommentsField.js.renderExistingComments().');
            //alert('In bwCommentsField.js.renderExistingComments().');
            var thiz = this;

            if (this.options.jsonData['bwCommentsField']) {
                var json = this.options.jsonData['bwCommentsField'].value;
                if (json.length && (json.length > 0)) {

                    var thereAreNormalComments = false;
                    for (var i = 0; i < json.length; i++) {
                        var comment = json[i].ReviewerComments;
                        if (comment && (comment.indexOf('SYSTEM MESSSAGE:') > -1)) {
                            //
                        } else {
                            thereAreNormalComments = true;
                        }
                    }

                    if (thereAreNormalComments == true) {
                        var html = '';
                        html += '<ul>';
                        for (var i = 0; i < json.length; i++) {
                            var comment = json[i].ReviewerComments;

                            if (comment && (comment.indexOf('SYSTEM MESSSAGE:') > -1)) {
                                // This is a system message/event. We will display these ones in the bwCommentsFieldEvents.js widget.
                            } else {
                                var timestamp = json[i].Created;

                                if (!timestamp) {

                                    html += '<span style="color:tomato;font-size:10pt;">Error in bwCommentsField.js.renderExistingComments(). This may be an old request. The comments JSON has been updated since Jan 25, 2022. This message is for informational purposes only. <span style="color:black;">json: ' + JSON.stringify(json) + '</span></span>';

                                } else {

                                    var bwParticipantId = json[i].CreatedById;
                                    var bwParticipantFriendlyName = json[i].CreatedByFriendlyName;
                                    var bwParticipantEmail = json[i].CreatedByEmail;

                                    html += '<li>';
                                    var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(timestamp);
                                    html += '   <span style="color:black;">';
                                    html += '       <span style="font-size:8pt;color:black;">' + timestamp4 + '</span>';
                                    html += '       <br />';
                                    html += '       <span style="font-size:8pt;">' + bwParticipantFriendlyName + ' (' + bwParticipantEmail + ') said:</span>';
                                    html += '       <br />';
                                    html += '       <span style="font-size:10pt;">' + comment + '</span>';
                                    html += '   </span>';
                                    html += '</li>';

                                }
                            }
                        }
                        html += '</ul>';
                        $(this.element).find('#' + this.options.jsonData.requestDialogId + '_ConsolidatedComments')[0].innerHTML = html;
                    }

                }
                var test = 'test';
            }


        } catch (e) {
            console.log('Exception in renderExistingComments(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderExistingComments(): ' + e.message + ', ' + e.stack);
        }
    },

    renderAndPopulateCommentsField: function (requestDialogId, customRenderingInstruction) {
        try {
            console.log('In renderAndPopulateCommentsField().');
            //alert('In renderAndPopulateCommentsField().');
            var thiz = this;
            var html = '';

            //if (customRenderingInstruction && (customRenderingInstruction == 'RENDER_FOR_PRINTED_INVOICE')) {

            //    html += '<br />';
            //    html = '[bwCommentsField.js.customRenderingInstruction: ' + customRenderingInstruction + '] xcx342351';
            //    html += '<br />';

            //    this.element.html(html);


            //} else {


                html += '<table style="width:100%;">';
                html += '                        <tbody><tr class="xdTableOffsetRow xdTableOffsetRow-editor" id="toolboxdraggablerow_2" draggable="true" bwwidgetname="bwCommentsField">';
                html += '                            <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
                html += '                                <span class="xdlabel">';
                html += '                                    ' + this.options.fieldTitle + ':';
                html += '                                </span>';

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
                html += '                                            <td colspan="2">';
                if (this.options.renderAsARequiredField == false) {
                    html += '                                              <span id="ReviewerComments" class="xdTextBoxRequired" bwDataRequired="false" bwFieldname="ReviewerComments" bwDataType="String" title="" contentEditable="true" tabIndex="0" style="WORD-WRAP: break-word; HEIGHT: 90px; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%;BACKGROUND-COLOR: white;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';
                } else {
                    html += '                                              <span id="ReviewerComments" class="xdTextBoxRequired" bwDataRequired="true" bwFieldname="ReviewerComments" bwDataType="String" title="" contentEditable="true" tabIndex="0" style="WORD-WRAP: break-word; HEIGHT: 90px; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%;BACKGROUND-COLOR: white;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';
                }
                html += '                                              </span>';
                html += '                                            </td>';
                html += '                                          </tr>';

                console.log('In bwCommentsField.js.renderAndPopulateCommentsField(). this.options.jsonData: ' + JSON.stringify(this.options.jsonData));




                ////
                //// If we have jsonData, populate the element.
                ////
                //if (this.options.jsonData) {
                //    var dataElement = $(this.element).find('.bwRequestJson:first');
                //    if (dataElement) {
                //        if (this.options.jsonData[this.widgetName] && this.options.jsonData[this.widgetName].value) {
                //            var value = this.options.jsonData[this.widgetName].value;
                //            $(dataElement).html(value);
                //            console.log('In bwJustificationDetailsField.js.renderAndPopulateJustificationDetailsField(). Displayed jsonData for form widget: ' + this.widgetName + ', data: ' + JSON.stringify(this.options.jsonData[this.widgetName]));
                //        }
                //    } else {
                //        console.log('Error in form widget "' + this.widgetName + '". Could not find the display element.');
                //        var html = '';
                //        html += '<span style="font-size:24pt;color:red;">Error in form widget bwJustificationDetailsField. Could not find the display element.</span>';
                //        html += '<br />';
                //        html += '<span style="">Exception in bwJustificationDetailsField.js.renderAndPopulateJustificationDetailsField(): ' + e.message + ', ' + e.stack + '</span>';
                //        thiz.element.html(html);
                //    }
                //}
                ////
                //// end: If we have jsonData, populate the element.
                ////




                //debugger;

                if (this.options.jsonData) {
                    if (this.options.jsonData['bwCommentsField']) {
                        var json = this.options.jsonData['bwCommentsField'].value;
                        if (json.length && (json.length > 0)) {

                            var thereAreNormalComments = false;
                            for (var i = 0; i < json.length; i++) {
                                var comment = json[i].ReviewerComments;
                                if (comment && (comment.indexOf('SYSTEM MESSSAGE:') > -1)) {
                                    //
                                } else {
                                    thereAreNormalComments = true;
                                }
                            }

                            if (thereAreNormalComments == true) {
                                html += '                                            <tr>';
                                html += '                                              <td width="1%" style="VERTICAL-ALIGN: top;">';
                                html += '                                                <a onclick="$(\'#' + this.options.jsonData.requestDialogId + '\').find(\'.bwCommentsField\').bwCommentsField(\'ToggleExpandComments\');">';
                                html += '                                                  <img id="imgExpandComments" src="../images/plus-sign.png" style="text-align:left; cursor:pointer;width:35px;height:35px;"/>';
                                html += '                                                </a>';
                                html += '                                              </td>';
                                html += '                                              <td style="VERTICAL-ALIGN: top;">';
                                html += '                                                <span id="' + this.options.jsonData.requestDialogId + '_ConsolidatedComments" title="" class="xdTextBox" style="display:none; text-align: left; WORD-WRAP: break-word; HEIGHT: 240px; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 520px;" >';
                                html += '                                                </span>';
                                html += '                                              </td>';
                                html += '                                            </tr>';
                            }

                        }
                    }
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

                    this.renderExistingComments();

                }

            //}

        } catch (e) {
            console.log('Exception in renderAndPopulateCommentsField: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwCommentsField</span>';
            html += '<br />';
            html += '<span style="">Exception in bwCommentsField.renderAndPopulateCommentsField(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    },

    renderAndPopulateCommentsField_ReadOnly: function (requestDialogId) {
        try {
            console.log('In renderAndPopulateCommentsField_ReadOnly().');
            var thiz = this;
            var html = '';

            html += '<table style="width:100%;">';
            html += '                        <tbody><tr class="xdTableOffsetRow xdTableOffsetRow-editor" id="toolboxdraggablerow_2" draggable="true" bwwidgetname="bwCommentsField">';
            html += '                            <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
            html += '                                <span class="xdlabel">';
            html += '                                    ' + this.options.fieldTitle + ':';
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
            html += '                                      <div>';
            html += '                                        <table width="100%">';
            html += '                                          <tr>';
            html += '                                            <td colspan="2">';
            if (this.options.renderAsARequiredField == false) {
                html += '                                              <span id="ReviewerComments" contentEditable="false" disabled class="xdTextBoxRequired" bwDataRequired="false" bwFieldname="ReviewerComments" bwDataType="String" title="" hideFocus="1" xd:datafmt="&quot;string&quot;,&quot;plainMultiline&quot;" style="WORD-WRAP: break-word; HEIGHT: 90px; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%;BACKGROUND-COLOR: white;">';
            } else {
                html += '                                              <span id="ReviewerComments" contentEditable="false" disabled class="xdTextBoxRequired" bwDataRequired="true" bwFieldname="ReviewerComments" bwDataType="String" title="" hideFocus="1" xd:datafmt="&quot;string&quot;,&quot;plainMultiline&quot;" style="WORD-WRAP: break-word; HEIGHT: 90px; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%;BACKGROUND-COLOR: white;">';
            }
            html += '                                              </span>';
            html += '                                            </td>';
            html += '                                          </tr>';

            if (this.options.jsonData != null) {
                if (this.options.jsonData['bwCommentsField']) {
                    var json = this.options.jsonData['bwCommentsField'].value;
                    if (json.length && (json.length > 0)) {

                        var thereAreNormalComments = false;
                        for (var i = 0; i < json.length; i++) {
                            var comment = json[i].ReviewerComments;
                            if (comment && (comment.indexOf('SYSTEM MESSSAGE:') > -1)) {
                                //
                            } else {
                                thereAreNormalComments = true;
                            }
                        }

                        if (thereAreNormalComments == true) {
                            html += '                                            <tr>';
                            html += '                                              <td width="1%" style="VERTICAL-ALIGN: top;">';
                            html += '                                                <a onclick="$(\'.bwCommentsField\').bwCommentsField(\'ToggleExpandComments\');">';
                            html += '                                                  <img id="imgExpandComments" src="../images/plus-sign.png" style="text-align:left; cursor:pointer;width:35px;height:35px;"/>';
                            html += '                                                </a>';
                            html += '                                              </td>';
                            html += '                                              <td style="VERTICAL-ALIGN: top;">';
                            html += '                                                <span id="' + this.options.jsonData.requestDialogId + '_ConsolidatedComments" title="" class="xdTextBox" style="display:none; text-align: left; WORD-WRAP: break-word; HEIGHT: 240px; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%;" >';
                            html += '                                                </span>';
                            html += '                                              </td>';
                            html += '                                            </tr>';
                        }

                    }
                }
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

                this.renderExistingComments();

            }

        } catch (e) {
            console.log('Exception in renderAndPopulateCommentsField_ReadOnly: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwCommentsField</span>';
            html += '<br />';
            html += '<span style="">Exception in bwCommentsField.renderAndPopulateCommentsField_ReadOnly(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    },

    ToggleExpandComments: function () {
        try {
            var image = $(this.element).find('#imgExpandComments')[0]; // document.getElementById('imgExpandComments');
            if (image) {
                //debugger;

                //var bwBudgetRequestId = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
                //var elementId = 'divRequestFormDialog_' + bwBudgetRequestId + '_ConsolidatedComments';
                //var element = $(this.element).find('span')[0];
                //debugger;
                //var elementId = element.id;

                if (image.src.toString().indexOf('plus-sign.png') > -1) {
                    image.src = '../images/minus-sign.png';
                    document.getElementById(this.options.jsonData.requestDialogId + '_ConsolidatedComments').style.display = 'block';
                    //document.getElementById(elementId).style.display = 'block';
                } else {
                    image.src = '../images/plus-sign.png';
                    document.getElementById(this.options.jsonData.requestDialogId + '_ConsolidatedComments').style.display = 'none';
                    //document.getElementById(elementId).style.display = 'none';
                }
            }
        } catch (e) {
            console.log('Error in ToggleExpandComments(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Error in ToggleExpandComments(): ' + e.message + ', ' + e.stack);
        }
    }

});