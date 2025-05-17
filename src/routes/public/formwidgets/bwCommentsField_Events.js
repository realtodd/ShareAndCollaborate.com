$.widget("bw.bwCommentsField_Events", {
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
        This is the bwCommentsField_Events.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        fieldTitle: 'System Messages', // This is the title, which shows up on the form in the left column.

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
        this.element.addClass("bwCommentsField_Events");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {

            selfDiscoverOperationUri(thiz); // This sets this.options.operationUriPrefix correctly.

            if (this.options.inFormsEditor == true) {
                //this.options.store = {}; // Need to provide this because if it tries to hit the database and poopulate, it won't render in time to be used in the toolbox!!!! 6-28-2020
                this.renderAndPopulateCommentsField_ReadOnly(); // Need to render, not allowing the user to make modifications.
            } else if (this.options.allowRequestModifications == false) {
                this.renderAndPopulateCommentsField_ReadOnly(); // Need to render, not allowing the user to make modifications.
            } else if (this.options.allowRequestModifications == true) {
                this.renderAndPopulateCommentsField();
            } else {
                var html = '';
                html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwCommentsField_Events</span>';
                html += '<br />';
                html += '<span style="">Invalid value for allowRequestModifications: ' + this.options.allowRequestModifications + '</span>';
                this.element.html(html);
            }

            console.log('In bwCommentsField_Events._create(). The widget has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwCommentsField_Events</span>';
            html += '<br />';
            html += '<span style="">Exception in bwCommentsField_Events.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwCommentsField_Events")
            .text("");
    },
    getDataType: function () {
        try {
            console.log('In bwCommentsField_Events.js.getDataType().');

            return 'string';

        } catch (e) {
            console.log('Exception in bwCommentsField_Events.js.getDataType(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwCommentsField_Events.js.getDataType(): ' + e.message + ', ' + e.stack);
        }
    },
    getData: function () {
        try {
            console.log('In bwCommentsField_Events.getData().');

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

            //var reviewerComments = $(this.element).find('#ReviewerComments')[0].innerHTML;
            //if (reviewerComments && reviewerComments.trim() != '' && reviewerComments.trim() != '<br>') {
            //    var comment = {
            //        ReviewerComments: reviewerComments,
            //        CreatedByFriendlyName: participantFriendlyName,
            //        CreatedByEmail: participantEmail,
            //        CreatedById: participantId,
            //        Created: new Date()
            //    }
            //    comments.push(comment);
            //}

            return comments;

        } catch (e) {
            console.log('Exception in bwCommentsField_Events.getData(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwCommentsField_Events.getData(): ' + e.message + ', ' + e.stack);
        }
    },
    isARequiredField: function () {
        try {
            console.log('In bwCommentsField_Events.isARequiredField().');
            return this.options.renderAsARequiredField;
        } catch (e) {
            console.log('Exception in bwCommentsField_Events.isARequiredField(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwCommentsField_Events.isARequiredField(): ' + e.message + ', ' + e.stack);
        }
    },
    getfieldTitle: function () {
        try {
            console.log('In bwCommentsField_Events.getfieldTitle().');
            return this.options.fieldTitle;
        } catch (e) {
            console.log('Exception in bwCommentsField_Events.getfieldTitle(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwCommentsField_Events.getfieldTitle(): ' + e.message + ', ' + e.stack);
        }
    },

    renderExistingComments: function () {
        try {
            console.log('In bwCommentsField_Events.js.renderExistingComments().');
            var thiz = this;

            if (this.options.jsonData['bwCommentsField']) {
                var json = this.options.jsonData['bwCommentsField'].value;
                if (json.length) {

                    var html = '';

                    html += '<ul>';
                    var thereAreSystemMessages = false;
                    for (var i = 0; i < json.length; i++) {
                        var comment = json[i].ReviewerComments;

                        if (comment && (comment.indexOf('SYSTEM MESSSAGE:') > -1)) {
                            // This is a system message/event. We will display these ones in the bwCommentsField_EventsEvents.js widget.
                            thereAreSystemMessages = true;

                            var timestamp = json[i].Created;

                            if (!timestamp) {

                                html += '<span style="color:tomato;font-size:10pt;">Error in bwCommentsField_Events.js.renderExistingComments(). This may be an old request. The comments JSON has been updated since Jan 25, 2022. This message is for informational purposes only. <span style="color:black;">json: ' + JSON.stringify(json) + '</span></span>';

                            } else {

                                var bwParticipantId = json[i].CreatedById;
                                var bwParticipantFriendlyName = json[i].CreatedByFriendlyName;
                                var bwParticipantEmail = json[i].CreatedByEmail;

                                html += '<li>';
                                var timestamp4 = $('.bwAuthentication').bwAuthentication('getBudgetWorkflowStandardizedDate', timestamp);
                                html += '   <span style="color:black;">';
                                html += '       <span style="font-size:8pt;color:black;">' + timestamp4 + '</span>';
                                html += '       <br />';
                                //html += '       <span style="font-size:8pt;">' + bwParticipantFriendlyName + ' (' + bwParticipantEmail + ') said:</span>';
                                //html += '       <br />';
                                html += '       <span style="font-size:10pt;">' + comment.replace('SYSTEM MESSSAGE: ', '') + '</span>';
                                html += '   </span>';
                                html += '</li>';

                            }
                        } else {
                            // These ones get displayed in the bwCommentsField.js widget.
                        }
                    }

                    if (thereAreSystemMessages == false) {
                        html += 'There are no system messages.';
                    }
                    html += '</ul>';
                    //alert('this.options.requestDialogId: ' + this.options.requestDialogId + '_ConsolidatedComments_Events');
                    //debugger;
                    $(this.element).find('#' + this.options.requestDialogId + '_ConsolidatedComments_Events')[0].innerHTML = html;
                }
                //var test = 'test';
            }


        } catch (e) {
            console.log('Exception in bwCommentsField_Events.js.renderExistingComments(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCommentsField_Events.js.renderExistingComments(): ' + e.message + ', ' + e.stack);
        }
    },

    renderAndPopulateCommentsField: function (requestDialogId) {
        try {
            console.log('In bwCommentsField_Events.js.renderAndPopulateCommentsField().');
            var thiz = this;
            var html = '';

            html += '<table style="width:100%;">';
            html += '                        <tbody><tr class="xdTableOffsetRow xdTableOffsetRow-editor" id="toolboxdraggablerow_2" draggable="true" bwwidgetname="bwCommentsField_Events">';
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
            //html += '                                          <tr>';
            //html += '                                            <td colspan="2">';
            //if (this.options.renderAsARequiredField == false) {
            //    html += '                                              <span id="ReviewerComments" class="xdTextBoxRequired" bwDataRequired="false" bwFieldname="ReviewerComments" bwDataType="String" title="" contentEditable="true" tabIndex="0" style="WORD-WRAP: break-word; HEIGHT: 90px; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%;BACKGROUND-COLOR: white;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';
            //} else {
            //    html += '                                              <span id="ReviewerComments" class="xdTextBoxRequired" bwDataRequired="true" bwFieldname="ReviewerComments" bwDataType="String" title="" contentEditable="true" tabIndex="0" style="WORD-WRAP: break-word; HEIGHT: 90px; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%;BACKGROUND-COLOR: white;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';
            //}
            //html += '                                              </span>';
            //html += '                                            </td>';
            //html += '                                          </tr>';

            if (this.options.jsonData != null) {
                if (this.options.jsonData['bwCommentsField']) {
                    var json = this.options.jsonData['bwCommentsField'].value;
                    if (json.length) {

                        html += '                                            <tr>';
                        html += '                                              <td width="1%" style="VERTICAL-ALIGN: top;">';
                        html += '                                                <a onclick="$(\'#' + this.options.requestDialogId + '\').find(\'.bwCommentsField_Events\').bwCommentsField_Events(\'ToggleExpandComments\');">';
                        html += '                                                  <img id="imgExpandComments" src="../images/plus-sign.png" style="text-align:left; cursor:pointer;width:35px;height:35px;"/>';
                        html += '                                                </a>';
                        html += '                                              </td>';
                        html += '                                              <td style="VERTICAL-ALIGN: top;">';
                        html += '                                                <span id="' + this.options.requestDialogId + '_ConsolidatedComments_Events" title="" class="xdTextBox" style="display:none; text-align: left; WORD-WRAP: break-word; HEIGHT: 240px; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 520px;" >';
                        html += '                                                </span>';
                        html += '                                              </td>';
                        html += '                                            </tr>';
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
            console.log('Exception in renderAndPopulateCommentsField: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwCommentsField_Events</span>';
            html += '<br />';
            html += '<span style="">Exception in bwCommentsField_Events.renderAndPopulateCommentsField(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    },

    renderAndPopulateCommentsField_ReadOnly: function (requestDialogId) {
        try {
            console.log('In bwCommentsField_Events.js.renderAndPopulateCommentsField_ReadOnly().');
            var thiz = this;
            var html = '';

            html += '<table style="width:100%;">';
            html += '                        <tbody><tr class="xdTableOffsetRow xdTableOffsetRow-editor" id="toolboxdraggablerow_2" draggable="true" bwwidgetname="bwCommentsField_Events">';
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
            //html += '                                          <tr>';
            //html += '                                            <td colspan="2">';
            //if (this.options.renderAsARequiredField == false) {
            //    html += '                                              <span id="ReviewerComments" contentEditable="false" disabled class="xdTextBoxRequired" bwDataRequired="false" bwFieldname="ReviewerComments" bwDataType="String" title="" hideFocus="1" xd:datafmt="&quot;string&quot;,&quot;plainMultiline&quot;" style="WORD-WRAP: break-word; HEIGHT: 90px; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%;BACKGROUND-COLOR: white;">';
            //} else {
            //    html += '                                              <span id="ReviewerComments" contentEditable="false" disabled class="xdTextBoxRequired" bwDataRequired="true" bwFieldname="ReviewerComments" bwDataType="String" title="" hideFocus="1" xd:datafmt="&quot;string&quot;,&quot;plainMultiline&quot;" style="WORD-WRAP: break-word; HEIGHT: 90px; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%;BACKGROUND-COLOR: white;">';
            //}
            //html += '                                              </span>';
            //html += '                                            </td>';
            //html += '                                          </tr>';

            if (this.options.jsonData != null) {
                if (this.options.jsonData['bwCommentsField']) {
                    var json = this.options.jsonData['bwCommentsField'].value;
                    if (json.length) {

                        html += '                                            <tr>';
                        html += '                                              <td width="1%" style="VERTICAL-ALIGN: top;">';
                        html += '                                                <a onclick="$(\'.bwCommentsField_Events\').bwCommentsField_Events(\'ToggleExpandComments\');">';
                        html += '                                                  <img id="imgExpandComments" src="../images/plus-sign.png" style="text-align:left; cursor:pointer;width:35px;height:35px;"/>';
                        html += '                                                </a>';
                        html += '                                              </td>';
                        html += '                                              <td style="VERTICAL-ALIGN: top;">';
                        html += '                                                <span id="' + this.options.requestDialogId + '_ConsolidatedComments_Events" title="" class="xdTextBox" style="display:none; text-align: left; WORD-WRAP: break-word; HEIGHT: 240px; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%;" >';
                        html += '                                                </span>';
                        html += '                                              </td>';
                        html += '                                            </tr>';

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
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwCommentsField_Events</span>';
            html += '<br />';
            html += '<span style="">Exception in bwCommentsField_Events.renderAndPopulateCommentsField_ReadOnly(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    },

    ToggleExpandComments: function () {
        try {
            console.log('In bwCommentsField_Events.js.ToggleExpandComments().');

            var image = $(this.element).find('#imgExpandComments')[0]; // document.getElementById('imgExpandComments');
            if (image) {
                //debugger;

                //var bwBudgetRequestId = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
                //var elementId = 'divRequestFormDialog_' + bwBudgetRequestId + '_ConsolidatedComments_Events';
                //var element = $(this.element).find('span')[0];
                //debugger;
                //var elementId = element.id;

                if (image.src.toString().indexOf('plus-sign.png') > -1) {
                    image.src = '../images/minus-sign.png';
                    document.getElementById(this.options.requestDialogId + '_ConsolidatedComments_Events').style.display = 'block';
                    //document.getElementById(elementId).style.display = 'block';
                } else {
                    image.src = '../images/plus-sign.png';
                    document.getElementById(this.options.requestDialogId + '_ConsolidatedComments_Events').style.display = 'none';
                    //document.getElementById(elementId).style.display = 'none';
                }
            }
        } catch (e) {
            console.log('Error in bwCommentsField_Events.js.ToggleExpandComments(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Error in bwCommentsField_Events.js.ToggleExpandComments(): ' + e.message + ', ' + e.stack);
        }
    }

});