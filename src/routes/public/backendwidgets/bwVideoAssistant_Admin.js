$.widget("bw.bwVideoAssistant_Admin", {
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
        This is the bwVideoAssistant_Admin.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        fieldTitle: 'Attachments', // This is the title, which shows up on the form in the left column.

        file: null,
        filename: null,
        max_chunk_size: null, // testing using this to store the file.
        loaded: null,
        reader: null, // 64 * 1024; // bytes
        blob: null, // = 0;
        workflowAppId: null,
        bwBudgetRequestId: null,
        description: null,
        //var self = this; // we need a reference to the current object
        //var chunkReaderBlock = null;
        //chunkReaderBlock: null,


        allowRequestModifications: false,
        renderAsARequiredField: null, // If this is true, then just display the red asterisk.
        inFormsEditor: null, // This is when forms are being designed. This prevents the widget from hitting the database (going asynchronous) when this is true. If that happens, a race condition may occur and addition to the toolbox may partially fail.

        requestDialogId: null, // This is the unique id of the request dialog being displayed. We prepend this to id's in order to make sure we can display many dialogs at one time on screen and make them unique in the dom.

        attachmentsAreStoredInIndexDb: null, // We need to know if attachments get stored in IndexDb, or by calling the file service web service.

        operationUriPrefix: null,
        ajaxTimeout: 15000,
        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function () {
        console.log('In bwVideoAssistant_Admin.js._create().');
        this.element.addClass("bwVideoAssistant_Admin");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {
            
            selfDiscoverOperationUri(thiz); // This sets this.options.operationUriPrefix correctly.

            if (this.options.inFormsEditor == true) {
                console.log('In bwVideoAssistant_Admin.js._create().option.inFormsEditor == true.');
                this.renderAndPopulateAttachments_ReadOnly(); // Need to render, not allowing the user to make modifications.
            } else if (this.options.allowRequestModifications == false) {






                console.log('In bwVideoAssistant_Admin.js._create().option.allowRequestModifications == false.');
                //this.renderAndPopulateAttachments_ReadOnly(); // Need to render, not allowing the user to make modifications.
                this.renderAndPopulateAttachments(); // Need to render, not allowing the user to make modifications.








            } else if (this.options.allowRequestModifications == true) {
                //console.log('In bwVideoAssistant_Admin.js._create().option.allowRequestModifications == true.');

                this.renderAndPopulateAttachments();




            } else {
                var html = '';
                html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwVideoAssistant_Admin</span>';
                html += '<br />';
                html += '<span style="">Invalid value for allowRequestModifications: ' + this.options.allowRequestModifications + '</span>';
                this.element.html(html);
            }

            //var bwBudgetRequestId = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
            //console.log('In bwVideoAssistant_Admin._create(). The bwVideoAssistant_Admin widget has been initialized for bwBudgetRequestId: ' + bwBudgetRequestId + '.');





            // 1-11-2022
            // At the moment thi happens in cmdDisplayConfirmFileUploadDialog(). Where is the best place? It doesn't work here... :/ not sure what the issue is...
            //var html = '';
            //html += '<div style="display:none;" id="divConfirmFileUploadDialog">';
            //html += '        <table style="width:100%;">';
            //html += '            <tr>';
            //html += '                <td style="width:90%;">';
            //html += '                    <span id="spanConfirmFileUploadDialogTitle" style="color: #3f3f3f;font-size: 60pt;font-weight:bold;">';
            //html += '                        Select the \'Upload\' button...';
            //html += '                    </span>';
            //html += '                </td>';
            //html += '                <td style="width:9%;"></td>';
            //html += '                <td style="width:1%;cursor:pointer;vertical-align:top;">';
            //html += '                    <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 120pt;font-weight:bold;" onclick="$(\'#divConfirmFileUploadDialog\').dialog(\'close\');">X</span>';
            //html += '                </td>';
            //html += '            </tr>';
            //html += '        </table>';
            //html += '        <br /><br />';
            //html += '        <span style="font-style:italic;color:gray;font-size:15pt;">The file name and description are not required because they can be changed later on.' + '<br /> xcx66574 bwBudgetRequestId: ' + 'bwBudgetRequestId' + ' xcx3246</span>';
            //html += '        <br /><br />';


            //html += '            <img id="ConfirmFileUploadDialog_ImagePreview" src="#" alt="your image" />';


            //html += '        <table>';
            //html += '            <tr>';
            //html += '                <td><span style="font-style:italic;color:gray;font-size:20pt;">file name:</span></td>';
            //html += '                <td>';
            //html += '                    <input type="text" id="txtConfirmFileUploadDialogFilename" style="width:380px;font-size:20pt;" />&nbsp;<span style="font-style:italic;font-size:11pt;color:gray;">';
            //html += '                        <br />(don\'t include a file extension)';
            //html += '                    </span>';
            //html += '                </td>';
            //html += '            </tr>';
            //html += '            <tr>';
            //html += '                <td></td>';
            //html += '                <td></td>';
            //html += '            </tr>';
            //html += '            <tr>';
            //html += '                <td style="vertical-align:top;"><span style="font-style:italic;font-size:20pt;color:gray;">description:</span></td>';
            //html += '                <td><textarea id="txtConfirmFileUploadDialogFileDescription" style="overflow:hidden;font-size:20pt;" rows="4" cols="30"></textarea></td>';
            //html += '            </tr>';
            //html += '        </table>';
            //html += '        <!--<div id="btnUploadTheFileNow" class="divDialogButton" title="Click here to upload the attachment.">';
            //html += '            Upload';
            //html += '        </div>';
            //html += '        <br /><br />';
            //html += '        <div id="btnCancelUploadTheFileNow" class="divDialogButton" onclick="$(\'#divConfirmFileUploadDialog\').dialog(\'close\');">';
            //html += '            Cancel';
            //html += '        </div>-->';
            //html += '    </div>';
            //$(this.element).append(html);

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwVideoAssistant_Admin</span>';
            html += '<br />';
            html += '<span style="">Exception in bwVideoAssistant_Admin.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwVideoAssistant_Admin")
            .text("");
    },
    getData: function () {
        try {
            console.log('In bwVideoAssistant_Admin.getData().');
            var value = $(this.element).find('#newrequestattachments')[0].innerHTML.trim();
            if (value != '') {
                return 'has attachments';
            } else {
                return null;
            }
        } catch (e) {
            console.log('Exception in bwVideoAssistant_Admin.getData(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwVideoAssistant_Admin.getData(): ' + e.message + ', ' + e.stack);
        }
    },
    isARequiredField: function () {
        try {
            console.log('In bwVideoAssistant_Admin.isARequiredField().');
            return this.options.renderAsARequiredField;
        } catch (e) {
            console.log('Exception in bwVideoAssistant_Admin.isARequiredField(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwVideoAssistant_Admin.isARequiredField(): ' + e.message + ', ' + e.stack);
        }
    },
    getfieldTitle: function () {
        try {
            console.log('In bwVideoAssistant_Admin.getfieldTitle().');
            return this.options.fieldTitle;
        } catch (e) {
            console.log('Exception in bwVideoAssistant_Admin.getfieldTitle(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwVideoAssistant_Admin.getfieldTitle(): ' + e.message + ', ' + e.stack);
        }
    },

    renderAndPopulateAttachments: function () {
        try {
            console.log('');
            console.log('##################################');
            console.log('In bwVideoAssistant_Admin.js.renderAndPopulateAttachments().');
            console.log('##################################');
            console.log('');

            var requestDialogId;

            //debugger; // changed below 10-18-2020

           



            // THIS IS WHERE IT BEGINS!!!!!!!!!!!!!!!!!!!!!!!! 3-24-2022
            console.log('THIS IS WHERE IT BEGINS!!!!!!!!!!!!!!!!!!!!!!!! 3-24-2022');

            // We need to start rendering here............... Get th econtext first? Then call for the video link to display???











            var bwBudgetRequestId = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
            var requestDialogId = 'divRequestFormDialog_' + bwBudgetRequestId; // eg: divRequestFormDialog_d338d498-987f-4fec-872a-3fe6a3cc65c7
            if ($('#' + requestDialogId)) {
                // This is the name of the dialog.
            } else {
                requestDialogId = 'divCreateRequestFormContent'; // This is the name of the dialog.
            }





            var html = '';

            html += '<table style="width:100%;">';
            html += '                        <tbody><tr class="xdTableOffsetRow xdTableOffsetRow-editor" id="toolboxdraggablerow_2" draggable="true" bwwidgetname="bwVideoAssistant_Admin">';
            html += '                            <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
            html += '                                <span class="xdlabel">';
            html += '                                    Attachments:';
            html += '                                </span>';

            if (this.options.renderAsARequiredField == true) {
                html += '                               <span style="color:red;font-size:medium;">*</span>';
            } else if (this.options.renderAsARequiredField == false) {
                //
            } else {
                html += '                               <span class="ToggleRequiredAsterisk" title="Select this asterick to make this a required field." onclick="$(\'.bwFormsEditor\').bwFormsEditor(\'toggleFormRequiredField\', this);">*</span>';
            }

            html += '                            </td>';
            html += '                            <td class="xdTableOffsetCellComponent" style="white-space:nowrap;text-align:left; VERTICAL-ALIGN: top; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">';

            // ABILITY TO DROP AN ATTACHMENT FROM ANOTHE isplayed request dialog! 4-8-2020
            html += '           <div id="dropzone1" style="width:365px;height:55px;text-align:center;background-color:#f6f6f6;padding-left:0;">';

            html += '               <label for="inputFile_' + bwBudgetRequestId + '" class="divSignInButton" style="font-style:normal;width:100%;height:100%;text-align:center;line-height:1.65em;font-size:23pt;border-radius: 5px 5px 5px 5px;display:inline-block;padding-left:0;padding-top:0;">Choose file...&nbsp;&nbsp;&nbsp;&#128193;</label>';
            //html += '               <input type="file" id="inputFile_' + bwBudgetRequestId + '" class="upload" style="visibility:hidden;" onchange="try {if(!$(\'#' + requestDialogId + '\').find(\'.bwVideoAssistant_Admin\')) {alert(\'Could not find .bwVideoAssistant_Admin on the form.\');} else {$(\'#' + requestDialogId + '\').find(\'.bwVideoAssistant_Admin\').bwVideoAssistant_Admin(\'uploadAttachment\',\'newrequestattachments\', \'' + requestDialogId + '\', \'' + bwBudgetRequestId + '\');this.value=null;}} catch(e) {alert(\'xcx44956 \');}" />';






            html += '<form id="uploadForm_' + bwBudgetRequestId + '" action="/" enctype="multipart/form-data" method="post">';

            // These empty fields need to be here so they are forced to get sent to the web service before the file(s). This is important because we need these values to determine where we are saving the files.
            html += '<input type="hidden" name="bwWorkflowAppId" value="" />';
            html += '<input type="hidden" name="bwBudgetRequestId" value="" />';
            html += '<input type="hidden" name="bwParticipantId" value="" />';
            html += '<input type="hidden" name="bwParticipantEmail" value="" />';
            html += '<input type="hidden" name="bwParticipantFriendlyName" value="" />';
            html += '<input type="hidden" name="Filename" value="" />';
            html += '<input type="hidden" name="Description" value="" />';
            html += '<input type="hidden" name="Size" value="" />';

            html += '               <input type="file" name="multerFileUploadIdentifier" id="inputFile_' + bwBudgetRequestId + '" class="upload" style="visibility:hidden;" onchange="$(\'.bwVideoAssistant_Admin\').bwVideoAssistant_Admin(\'uploadAttachment\',\'newrequestattachments\', \'' + requestDialogId + '\', \'' + bwBudgetRequestId + '\');" />';

            //html += '<input type="file" name="multi-files" accept="image/*" multiple>';
            //html += '<input type="submit" value="Upload">';
            html += '</form>  ';





            //html += '               <input type="file" id="inputFile" class="upload" style="visibility:hidden;" onchange="$(\'this.element\').bwVideoAssistant_Admin(\'uploadAttachment\',\'newrequestattachments\', \'' + requestDialogId + '\');" />';


            //html += '               <input type="file" id="inputFile" class="upload" style="visibility:hidden;" onchange="alert(\'In onchange event.\');" onclick="this.value=null;" />';





            html += '           </div>';

            //html += '           <!--<br />';
            //html += '           <button name="recordMemoButton" title="Click here to record a memo." class="BwButton200" id="recordMemoButton" onclick="displayRecordAVoiceMemoDialog();">Start Recording Memo...</button>-->';
            //html += '           <!--<a href="https://budgetworkflow.com?memo=startrecordingaudio" target="_blank" style="font-size:40pt;">Click here to record a memo.</a>-->';

            //html += '           <br />';
            html += '           <p id="newrequestattachments"></p>';

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

            $(this.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;"></span>';

        } catch (e) {
            console.log('Exception in bwVideoAssistant_Admin.js.renderAndPopulateAttachments: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwVideoAssistant_Admin</span>';
            html += '<br />';
            html += '<span style="">Exception in bwVideoAssistant_Admin.renderAndPopulateAttachments(): ' + e.message + ', ' + e.stack + '</span>';
            this.element.html(html);
        }
    },

    renderAndPopulateAttachments_ReadOnly: function (requestDialogId) {
        try {
            console.log('In bwVideoAssistant_Admin.js.renderAndPopulateAttachments_ReadOnly().');
            //var thiz = this;
            var html = '';

            html += '<table style="width:100%;">';
            html += '                        <tbody><tr class="xdTableOffsetRow xdTableOffsetRow-editor" id="toolboxdraggablerow_2" draggable="true" bwwidgetname="bwVideoAssistant_Admin">';
            html += '                            <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
            html += '                                <span class="xdlabel">';
            html += '                                    Attachments:';
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
            html += '                            <td class="xdTableOffsetCellComponent2" style="white-space:nowrap;text-align:left; VERTICAL-ALIGN: top; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">';




            // ABILITY TO DROP AN ATTACHMENT FROM ANOTHE isplayed request dialog! 4-8-2020
            //html += '           <div id="dropzone1" class="divSignInButton" style="width:365px;height:55px;text-align:center;background-color:#f6f6f6;padding-left:0;">';
            //html += '           <div id="dropzone1" style="width:365px;height:55px;text-align:center;background-color:#f6f6f6;padding-left:0;">';

            //html += '               <label for="inputFile" class="divSignInButton" style="font-style:normal;width:100%;height:100%;text-align:center;line-height:1.65em;font-size:23pt;border-radius: 5px 5px 5px 5px;display:inline-block;padding-left:0;padding-top:0;">Choose file...&nbsp;&nbsp;&nbsp;&#128193;</label>';
            //html += '               <input type="file" id="inputFile" class="upload" style="visibility:hidden;" onchange="$(\'.bwVideoAssistant_Admin\').bwVideoAssistant_Admin(\'uploadAttachment\',\'newrequestattachments\');" />';
            //html += '           </div>';
            //html += '           <!--<br />';
            //html += '           <button name="recordMemoButton" title="Click here to record a memo." class="BwButton200" id="recordMemoButton" onclick="displayRecordAVoiceMemoDialog();">Start Recording Memo...</button>-->';
            //html += '           <!--<a href="https://budgetworkflow.com?memo=startrecordingaudio" target="_blank" style="font-size:40pt;">Click here to record a memo.</a>-->';

            //html += '           <br />';
            html += '           <p id="newrequestattachments"></p>';




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

            //var bwBudgetRequestId = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
            //var requestDialogId = null;
            //this.populateAttachments(workflowAppId, bwBudgetRequestId, 'newrequestattachments', true, requestDialogId);

            //$(this.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">[newrequestattachments]</span>';
            $(this.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;"></span>';

        } catch (e) {
            console.log('Exception in bwVideoAssistant_Admin.js.renderAndPopulateAttachments_ReadOnly: ' + e.message + ', ' + e.stack);

            //renderAndPopulateAttachments
            //$(this.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwVideoAssistant_Admin.renderAndPopulateAttachments_ReadOnly: ' + e.message + ', ' + e.stack;
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwVideoAssistant_Admin</span>';
            html += '<br />';
            html += '<span style="">Exception in bwVideoAssistant_Admin.js.renderAndPopulateAttachments_ReadOnly(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    },

    uploadAttachment: function (displayAttachmentsTagName, requestDialogId, bwBudgetRequestId) {
        try {
            //debugger;

            console.log('In bwVideoAssistant_Admin.js.uploadAttachment(). attachmentsAreStoredInIndexDb: ' + this.options.attachmentsAreStoredInIndexDb + ', bwBudgetRequestId: ' + bwBudgetRequestId);

            //var _budgetRequestId = this.options.bwBudgetRequestId; // document.getElementById('BudgetRequestId').innerHTML; //$('span[xd\\:binding = "my:BudgetRequestId"]')[0].innerHTML;
            //var _budgetRequestId = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
            //debugger;
            //displayAlertDialog('uploadAttachment() _budgetRequestId: ' + _budgetRequestId);
            var x = $('#inputFile_' + bwBudgetRequestId)[0]; // $('#' + requestDialogId).find('#inputFile')[0];
            var file = x.files; //[0]; //[0];
            if (!file) { // Don't like doing this but sometimes file is undefined... is this a race condition or a duplicate DOM element?? 6-23-2020
                this.displayAlertDialog('There was an error attaching this file. Please try again.');

            } else {
                if (file.size > 100000000) {
                    // Don't allow files over 5MB.
                    this.displayAlertDialog('Currently the system does not allow files over 100MB.');
                    x.replaceWith($('#inputFile_' + bwBudgetRequestId).clone()); //$('#' + requestDialogId).find('#inputFile').replaceWith($('#inputFile').clone()); // Clear the file upload box. May not work in all browsers doing it this way.
                } else {

                    this.cmdDisplayConfirmFileUploadDialog(displayAttachmentsTagName, bwBudgetRequestId, requestDialogId, x);
                    //displayAlertDialog('In uploadAttachment(). Result: ' + upload);

                    //var upload = confirm("Click OK to upload the file...");
                    //if (upload) {
                    //    $("#divWorkingOnItDialog").dialog({
                    //        modal: true,
                    //        resizable: false,
                    //        //closeText: "Cancel",
                    //        closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                    //        title: 'Working on it...',
                    //        width: "360",
                    //        dialogClass: "no-close", // No close button in the upper right corner.
                    //        hide: false//, // This means when hiding just disappear with no effects.
                    //        //buttons: {
                    //        //    "Close": function () {
                    //        //        $(this).dialog("close");
                    //        //    }
                    //        //}
                    //    });
                    //    $("#divWorkingOnItDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

                    //    ProcessUpload(displayAttachmentsTagName, _budgetRequestId);
                    //} else {
                    //    $('#inputFile').replaceWith($('#inputFile').clone()); // Clear the file upload box. May not work in all browsers doing it this way.
                    //    //populateAttachments();
                    //}
                }
            }
        } catch (e) {
            this.displayAlertDialog('Error in bwVideoAssistant_Admin.js.uploadAttachment(): ' + e.message + ', ' + e.stack);
            $(this.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwVideoAssistant_Admin.uploadAttachment: ' + e.message + ', ' + e.stack;
        }
        // TODD: MAY HAVE TO ADD THIS LATER!!!!
        //// Ensure the HTML5 FileReader API is supported
        //if (window.FileReader) {
        //    var parts = document.getElementById("inputFile").value.split("\\");
        //    var filename = parts[parts.length - 1];
        //    file = document.getElementById("inputFile").files[0];
        //    //BW.Jsom.Libs.upload("Documents", filename, file);

        //    var fr = new FileReader();
        //    fr.onload = receivedBinary;
        //    fr.readAsDataURL(file);

        //} else {
        //    displayAlertDialog("The HTML5 FileSystem APIs are not fully supported in this browser.");
        //}

    },

    UploadButton_OnClick: function () {

    },
    CancelButton_OnClick: function () {

    },
    cmdDisplayConfirmFileUploadDialog: function (displayAttachmentsTagName, bwBudgetRequestId, requestDialogId, element) {
        try {
            console.log('In bwVideoAssistant_Admin.js.cmdDisplayConfirmFileUploadDialog().');
            var thiz = this;
            debugger;

            //var dialog = $(this.element).find('#divConfirmFileUploadDialog_ForAttachments');
            //if (!(dialog && dialog.length && (dialog.length > 0))) { // !document.getElementById('divConfirmFileUploadDialog')) {
            //    var html = '';
            //    html += '<div style="display:none;" id="divConfirmFileUploadDialog">';
            //    html += '        <table style="width:100%;">';
            //    html += '            <tr>';
            //    html += '                <td style="width:90%;">';
            //    html += '                    <span id="spanConfirmFileUploadDialogTitle" style="color: #3f3f3f;font-size: 60pt;font-weight:bold;">';
            //    html += '                        Select the \'Upload\' button...';
            //    html += '                    </span>';
            //    html += '                </td>';
            //    html += '                <td style="width:9%;"></td>';
            //    html += '                <td style="width:1%;cursor:pointer;vertical-align:top;">';
            //    html += '                    <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 120pt;font-weight:bold;" onclick="$(\'#divConfirmFileUploadDialog\').dialog(\'close\');">X</span>';
            //    html += '                </td>';
            //    html += '            </tr>';
            //    html += '        </table>';
            //    html += '        <br /><br />';
            //    html += '        <span style="font-style:italic;color:gray;font-size:15pt;">The file name and description are not required because they can be changed later on.' + '<br /> xcx66574 bwBudgetRequestId: ' + bwBudgetRequestId + '</span>';
            //    html += '        <br /><br />';


            //    html += '            <img id="ConfirmFileUploadDialog_ImagePreview" src="#" alt="your image" />';


            //    html += '        <table>';
            //    html += '            <tr>';
            //    html += '                <td><span style="font-style:italic;color:gray;font-size:20pt;">file name:</span></td>';
            //    html += '                <td>';
            //    html += '                    <input type="text" id="txtConfirmFileUploadDialogFilename" style="width:380px;font-size:20pt;" />&nbsp;<span style="font-style:italic;font-size:11pt;color:gray;">';
            //    html += '                        <br />(don\'t include a file extension)';
            //    html += '                    </span>';
            //    html += '                </td>';
            //    html += '            </tr>';
            //    html += '            <tr>';
            //    html += '                <td></td>';
            //    html += '                <td></td>';
            //    html += '            </tr>';
            //    html += '            <tr>';
            //    html += '                <td style="vertical-align:top;"><span style="font-style:italic;font-size:20pt;color:gray;">description:</span></td>';
            //    html += '                <td><textarea id="txtConfirmFileUploadDialogFileDescription" style="overflow:hidden;font-size:20pt;" rows="4" cols="30"></textarea></td>';
            //    html += '            </tr>';
            //    html += '        </table>';
            //    html += '        <!--<div id="btnUploadTheFileNow" class="divDialogButton" title="Click here to upload the attachment.">';
            //    html += '            Upload';
            //    html += '        </div>';
            //    html += '        <br /><br />';
            //    html += '        <div id="btnCancelUploadTheFileNow" class="divDialogButton" onclick="$(\'#divConfirmFileUploadDialog\').dialog(\'close\');">';
            //    html += '            Cancel';
            //    html += '        </div>-->';
            //    html += '    </div>';
            //    $(this.element).append(html);
            //}

            //var dialog = $('#divConfirmFileUploadDialog_ForAttachments');

            // Populate the filename text box!
            var x = element;
            var file = x.files[0];
            var originalFilename = file.name.trim().split('.')[0];


            // 1-11-2022
            var tempFilename = $('#divConfirmFileUploadDialog_ForAttachments').find('#txtConfirmFileUploadDialogFilename');
            debugger;
            if (tempFilename && tempFilename[0] && ((tempFilename[0].value == '') || tempFilename[0].value)) {
                tempFilename[0].value = originalFilename;
            } else {
                console.log('');
                console.log('CANNOT find element divConfirmFileUploadDialog_ForAttachments. xcx999246.');
                console.log('');

                alert('CANNOT find element divConfirmFileUploadDialog_ForAttachments. xcx999246.');

            }


            // Clear the description, because this may have the description from the last time it was displayed.
            $('#divConfirmFileUploadDialog_ForAttachments').find('#txtConfirmFileUploadDialogFileDescription')[0].innerHTML = ''; //'xcx32467';

            $('#divConfirmFileUploadDialog_ForAttachments').dialog({
                modal: true,
                resizable: false,
                closeText: "Cancel",
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                //title: '',
                width: "720px",
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                position: {
                    my: "middle top+12",
                    at: "middle top",
                    of: window //"#btnAdvancedProductSearch"
                },
                open: function (event, ui) {
                    try {
                        $('.ui-widget-overlay').bind('click', function () {
                            $('#divConfirmFileUploadDialog_ForAttachments').dialog('close');
                        });

                        // 1-24-2020 ToDo: Display the image prior to uploading!
                        var x = document.getElementById('inputFile_' + bwBudgetRequestId); // This element is on the request form with the "Choose File" button, not the attachments dialog.
                        //var x = $('#divConfirmFileUploadDialog_ForAttachments').find('#inputFile_' + bwBudgetRequestId)[0];
                        var file = x.files[0];

                        //
                        // First get the dimensions of the image.
                        var _URL = window.URL || window.webkitURL;
                        var img;
                        //if ((file = this.files[0])) {
                        img = new Image();
                        var objectUrl = _URL.createObjectURL(file);
                        img.onload = function () {
                            try {
                                //alert(this.width + " " + this.height);
                                _URL.revokeObjectURL(objectUrl);


                                //if (this.width < 400 || this.height < 400) {
                                if (this.width < 50 || this.height < 50) {
                                    $('#divConfirmFileUploadDialog_ForAttachments').dialog('close');
                                    //alert('The image must be a 400px square. This image is too small.');
                                    alert('The image must be a 50px square. This image is too small.');
                                } else {
                                    // Now display it.
                                    var reader = new FileReader();
                                    reader.onload = function (e) {
                                        try {
                                            $('#divConfirmFileUploadDialog_ForAttachments').find('#ConfirmFileUploadDialog_ImagePreview').attr('src', e.target.result);
                                            $('#divConfirmFileUploadDialog_ForAttachments').find('#ConfirmFileUploadDialog_ImagePreview').attr('style', 'width:400px;'); // 3-12-2022 only specify 1 dimension so that the image is not distorted. // height:400px;');
                                        } catch (e) {
                                            console.log('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.open.img.onload.reader.onload(): ' + e.message + ', ' + e.stack);
                                            displayAlertDialog('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.open.img.onload.reader.onload(): ' + e.message + ', ' + e.stack);
                                        }
                                    }
                                    reader.readAsDataURL(file);
                                }
                            } catch (e) {
                                console.log('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.open.img.onload(): ' + e.message + ', ' + e.stack);
                                displayAlertDialog('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.open.img.onload(): ' + e.message + ', ' + e.stack);
                            }
                        };
                        img.src = objectUrl;


                        //
                        // ADD THE BUTTON ONCLICK EVENTS HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Then we have access to displayAttachmentsTagName etc. 2-4-2022
                        //

                        $('#btnUploadTheFileNow').off('click').click(function () {
                            try {
                                console.log('In UploadButton_OnClick().');

                                $("#divConfirmFileUploadDialog_ForAttachments").dialog('close');

                                //$("#divWorkingOnItDialog").dialog({
                                //    modal: true,
                                //    resizable: false,
                                //    closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                                //    title: 'Working on it...',
                                //    width: "800",
                                //    dialogClass: "no-close", // No close button in the upper right corner.
                                //    hide: false//, // This means when hiding just disappear with no effects.
                                //});
                                //$("#divWorkingOnItDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

                                thiz.processUpload(displayAttachmentsTagName, bwBudgetRequestId, file);

                            } catch (e) {
                                console.log('Exception in btnUploadTheFileNow.click(): ' + e.message + ', ' + e.stack);
                                displayAlertDialog('Exception in btnUploadTheFileNow.click(): ' + e.message + ', ' + e.stack);
                            }
                        });

                        $('#btnCancelUploadTheFileNow').off('click').click(function () {
                            try {
                                //$(this).dialog("close");

                                //$('#inputFile_' + bwBudgetRequestId).replaceWith($('#inputFile_' + bwBudgetRequestId).clone());
                                ////$(this.element).find('#inputFile').replaceWith($('#inputFile').clone()); // Clear the file upload box. May not work in all browsers doing it this way.
                                ////return false;
                            } catch (e) {
                                console.log('Exception in btnCancelUploadTheFileNow.click(): ' + e.message + ', ' + e.stack);
                                displayAlertDialog('Exception in btnCancelUploadTheFileNow.click(): ' + e.message + ', ' + e.stack);
                            }
                        });

                    } catch (e) {
                        console.log('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.open(): ' + e.message + ', ' + e.stack);
                        thiz.displayAlertDialog('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.open(): ' + e.message + ', ' + e.stack);
                    }
                }, // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.
                close: function () {
                    $(this).dialog('destroy'); // 7-5-2020 THIS IS THE PREFFERED SYNTAX FOR THIS FROM NOW ON!!!!!!!!!!!!!!!!!!!!!!!!!!!! REPLACE EVERYWHERE AND TEST!!!!!!!!!!
                }
                //buttons: {
                //    "xxxx": {
                //        text: 'Upload',
                //        id: 'btnUploadTheFileNow',
                //        //disabled: 'false',
                //        click: function () {
                //            //try {
                //            //    //var proceed = confirm('This action cannot be undone.\n\n\nClick the OK button to proceed...');
                //            //    //if (proceed) {
                //            //    //    cmdDeleteBudgetRequest(requestId);
                //            //    //displayAlertDialog('This functionality is incomplete. Coming soon!');
                //            //    $(this).dialog("close");

                //            //    $("#divWorkingOnItDialog").dialog({
                //            //        modal: true,
                //            //        resizable: false,
                //            //        //closeText: "Cancel",
                //            //        closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                //            //        title: 'Working on it...',
                //            //        width: "800",
                //            //        dialogClass: "no-close", // No close button in the upper right corner.
                //            //        hide: false//, // This means when hiding just disappear with no effects.
                //            //        //buttons: {
                //            //        //    "Close": function () {
                //            //        //        $(this).dialog("close");
                //            //        //    }
                //            //        //}
                //            //    });
                //            //    $("#divWorkingOnItDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();


                //            //    //var x = document.getElementById('inputFile');
                //            //    //var file = x.files[0];

                //            //    //// Check if the user specified a new filename. If so, make sure the file extension is the same!
                //            //    //var originalFilename = file.name;
                //            //    //var filename;
                //            //    //if (document.getElementById('txtConfirmFileUploadDialogFilename').value.trim() == '') {
                //            //    //    filename = file.name;
                //            //    //} else {
                //            //    //    filename = document.getElementById('txtConfirmFileUploadDialogFilename').value.trim().split('.')[0] + '.' + originalFilename.split('.')[1]; // Put the same extension on it.
                //            //    //}






                //            //    //var _budgetRequestId = document.getElementById('BudgetRequestId').innerHTML;
                //            //    //debugger;
                //            //    thiz.processUpload(displayAttachmentsTagName, bwBudgetRequestId, file);

                //            //    //return true;
                //            //    //}
                //            //} catch (e) {
                //            //    console.log('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.click(): ' + e.message + ', ' + e.stack);
                //            //    thiz.displayAlertDialog('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.click(): ' + e.message + ', ' + e.stack);
                //            //}
                //        }
                //    },
                //    "Cancel": function () {
                //        try {
                //            //$(this).dialog("close");

                //            //$('#inputFile_' + bwBudgetRequestId).replaceWith($('#inputFile_' + bwBudgetRequestId).clone());
                //            ////$(this.element).find('#inputFile').replaceWith($('#inputFile').clone()); // Clear the file upload box. May not work in all browsers doing it this way.
                //            ////return false;
                //        } catch (e) {
                //            console.log('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.cancel(): ' + e.message + ', ' + e.stack);
                //            thiz.displayAlertDialog('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.cancel(): ' + e.message + ', ' + e.stack);
                //        }
                //    }
                //}

            });

            // Hide the title bar.
            $('#divConfirmFileUploadDialog_ForAttachments').dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
            // Set the title.
            //document.getElementById('spanDeleteABudgetRequestDialogTitle').innerHTML = 'Confirm file uploadx';

            //$('#btnUploadTheFileNow').bind('click', function (error) { 
            //    try {
            //        console.log('Preparing to call ProcessUpload(' + displayAttachmentsTagName + ', ' + _budgetRequestId);
            //        $('#divConfirmFileUploadDialog').dialog('close');
            //        ProcessUpload(displayAttachmentsTagName, _budgetRequestId);
            //    } catch (e) {
            //        displayAlertDialog('Exception in my.js.xx.btnUploadTheFileNow.click: ' + e.message);
            //    }
            //});

            //$('#btnCancelUploadTheFileNow').bind('click', function (error) {  
            //    try {
            //        console.log('In my.js.xx.btnCancelUploadTheFileNow.click().');
            //        $('#divConfirmFileUploadDialog').dialog('close');
            //        $('#inputFile').replaceWith($('#inputFile').clone()); // Clear the file upload box. May not work in all browsers doing it this way.
            //    } catch (e) {
            //        displayAlertDialog('Exception in my.js.xx.btnCancelUploadTheFileNow.click: ' + e.message);
            //    }
            //});
        } catch (e) {
            this.displayAlertDialog('Exception in cmdDisplayConfirmFileUploadDialog(): ' + e.message + ', ' + e.stack);
        }
    },

    processUpload: function (displayAttachmentsTagName, _budgetRequestId, file) {
        try {
            console.log('In bwVideoAssistant_Admin.js.processUpload().');
            var thiz = this;



            if (!file || file.length == 0) {
                displayAlertDialog('There was an error. Zero files returned.');
            } else {
                // Check if the user specified a new filename. If so, make sure the file extension is the same!
                var originalFilename = file.name;
                var filename = file.name;
                //debugger;
                var filenameElement = $(this.element).find('#txtConfirmFileUploadDialogFilename');
                if (filenameElement && filenameElement.value && filenameElement.value.trim().length > 1) {
                    filename = filenameElement.value.trim().split('.')[0] + '.' + originalFilename.split('.')[1]; // Put the same extension on it.
                }






                //renderBarcodeDetails();





                //
                //displayAlertDialog('name: ' + filename);
                //displayAlertDialog('size1: ' + file.size);
                //displayAlertDialog('file contents: ' + file);
                //
                if (filename.indexOf('.xml') > 0) {
                    // XML files add 3 characters to the start of the file when using readAsArrayBuffer, so using readAsText instead!
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        var fileData = reader.result;
                        //displayAlertDialog('fileData prior to ws call:' + fileData);
                        //debugger;
                        thiz.performUpload(fileData, filename, displayAttachmentsTagName, _budgetRequestId); // _budgetRequestId);
                    };
                    reader.readAsText(file);
                } else {

                    console.log('In bwVideoAssistant_Admin.js.processUpload(). xcx1');

                    thiz.performUpload(fileData, filename, displayAttachmentsTagName, _budgetRequestId);
                    //var reader = new FileReader();
                    //reader.onload = function (event) {

                    //    console.log('In bwVideoAssistant_Admin.js.processUpload.FileReader.onload(). xcx2');

                    //    var fileData = '';
                    //    var buffer = event.target.result;
                    //    var byteArray = new Uint8Array(buffer);
                    //    for (var i = 0; i < byteArray.byteLength; i++) {

                    //        //console.log('In bwVideoAssistant_Admin.js.processUpload.FileReader.onload(). Adding to fileData. xcx3');

                    //        fileData += String.fromCharCode(byteArray[i])
                    //    }
                    //    //displayAlertDialog('fileData prior to ws call:' + fileData);
                    //    //displayAlertDialog('size2: ' + fileData.length);
                    //    //PerformUpload(fileData, file.name, displayAttachmentsTagName, _budgetRequestId);
                    //    //debugger;
                    //    thiz.performUpload(fileData, filename, displayAttachmentsTagName, _budgetRequestId); //_budgetRequestId);
                    //};

                    ////reader.progress = function (event) {
                    ////    console.log('');
                    ////    console.log('In reader.progress().');
                    ////    console.log('');
                    ////};

                    //reader.readAsArrayBuffer(file); // This works for text. 
                }

            }
        } catch (e) {
            console.log('In processUpload() catch for second attempt...: ' + e.message + ', ' + e.stack);
            try {
                //displayAlertDialog('bw.initar.ore.js.ProcessUpload():2');
                // this section is here to support older IE browsers.
                //var filePath = f:\oo.txt;
                var fso = new ActiveXObject("Scripting.FileSystemObject");
                var textStream = fso.OpenTextFile(fileInput);
                var fileData = file.ReadAll();

                //var fileName = '',
                //     libraryName = '',
                //     fileData = '';

                //var byteArray = new Uint8Array(result.target.result)
                //for (var i = 0; i < byteArray.byteLength; i++) {
                //    fileData += String.fromCharCode(byteArray[i])
                //}

                // once we have the file perform the actual upload
                debugger; // TODD: Do we ever get here? does this even work?
                thiz.performUpload(fileData);
            } catch (e2) {
                //window.waitDialog.close();
                try {
                    $('#divWorkingOnItDialog').dialog('close'); // Close the create your account dialog.
                } catch (e) { }
                thiz.displayAlertDialog('Exception in processUpload(): Uploading files doesn\'t seem to be supported in your browser: ' + e2.number + ': ' + e2.message);
            }
        }
    },

    //performUpload: function (fileData, filename, displayAttachmentsTagName, _budgetRequestId) {
    //    try {
    //        console.log('In bwVideoAssistant_Admin.js.performUpload().');
    //        var thiz = this;

    //        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

    //        var bwBudgetRequestId = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid'); // Get this from the New Budget Request form.



    //        // 2-4-2022
    //        console.log('In bwVideoAssistant_Admin.js.performUpload(). workflowAppId: ' + workflowAppId + ', _budgetRequestId: ' + _budgetRequestId + ', bwBudgetRequestId: ' + bwBudgetRequestId);



    //        var description = '';
    //        var descriptionElement = $(this.element).find('#txtConfirmFileUploadDialogFileDescription');
    //        if (descriptionElement && descriptionElement.innerHTML && descriptionElement.innerHTML.trim().length > 1) {
    //            description = descriptionElement.innerHTML.trim();
    //        }

    //        console.log('In performUpload(): description: ' + description);

    //        //// If it is a 'New Request', make sure we pass the bwWorkflowAppId. If not, then make sure an empty string is sent.
    //        //// This ensures that if an empty string is passed, that the web service looks up the value in the database.
    //        //var blueTitleBarText = '';
    //        //if (Platform == 'IOS8') {
    //        //    blueTitleBarText = document.getElementById('divTopBarTextContentsIos8').value.trim().toUpperCase();
    //        //} else {
    //        //    blueTitleBarText = document.getElementById('divTopBarTextContents').value.trim().toUpperCase();
    //        //}
    //        //var tempWorkflowAppId = '';
    //        //if (blueTitleBarText == 'NEW REQUEST') {
    //        //    tempWorkflowAppId = workflowAppId;
    //        //}


    //        data = {
    //            bwWorkflowAppId: workflowAppId,
    //            bwBudgetRequestId: bwBudgetRequestId,
    //            Filename: filename,
    //            FileContent: fileData,
    //            Description: description
    //        };

    //        var operationUri = this.options.operationUriPrefix + '_files/' + 'uploadattachment'; // _files allows us to use nginx to route these to a dedicated file server.
    //        //var operationUri = this.options.operationUriPrefix + '_files/' + 'uploadattachment_large'; // _files allows us to use nginx to route these to a dedicated file server.
    //        $.ajax({
    //            url: operationUri,
    //            type: "PUT",
    //            //contentType: "image/png",
    //            data: data,
    //            headers: { "Accept": "application/json; odata=verbose" },
    //            timeout: 300000, // 1-15-2022 60,000 per minute. 5 minutes.      //this.options.ajaxTimeout,
    //            success: function (data) {
    //                try {
    //                    $('#divWorkingOnItDialog').dialog('close'); // Close the "Working on it..." dialog.

    //                    //debugger; // 1-11-2022 THIS ELEMNT IS NOT BEING FOUND WITHIN THE CONTEXT OF THE DIALOG, IS IT???Well maybe.. hmm..
    //                    $('#inputFile_' + bwBudgetRequestId).replaceWith($('#inputFile_' + bwBudgetRequestId).clone());
    //                    //$(thiz.element).find('#inputFile').replaceWith($('#inputFile').clone()); // Clear the file upload box. May not work in all browsers doing it this way.

    //                    thiz.populateAttachments(workflowAppId, bwBudgetRequestId, 'newrequestattachments', true); // This lists the attachments in the <p> tag with id='attachments'.

    //                } catch (e) {
    //                    console.log('Exception in bwVideoAssistant_Admin.js.performUpload():2: ' + e.message + ', ' + e.stack);
    //                    $(this.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwVideoAssistant_Admin.performUpload:2: ' + e.message + ', ' + e.stack;
    //                }
    //            },
    //            error: function (data, errorCode, errorMessage) {
    //                try {
    //                    $('#divWorkingOnItDialog').dialog('close'); // Close the "Working on it..." dialog.
    //                    console.log('Error in bwVideoAssistant_Admin.js.performUpload(): ' + errorMessage);

    //                    if (errorMessage == 'timeout') {
    //                        thiz.displayAlertDialog('The file server could not be contacted. Please try again in a few minutes.');
    //                    } else {
    //                        thiz.displayAlertDialog('Error in performUpload(): ' + errorMessage);
    //                    }
    //                } catch (e) {
    //                    console.log('Exception in error in bwVideoAssistant_Admin.js.performUpload():2: ' + e.message + ', ' + e.stack);
    //                    $(this.element).find('#newrequestattachments')[0].innerHTML = 'Exception in error in bwVideoAssistant_Admin.js.performUpload():2: ' + e.message + ', ' + e.stack;
    //                    displayAlertDialog('Exception in error in bwVideoAssistant_Admin.js.performUpload():2: ' + e.message + ', ' + e.stack);
    //                }
    //            }
    //        });
    //    } catch (e) {
    //        console.log('Exception in bwVideoAssistant_Admin.js.performUpload(): ' + e.message + ', ' + e.stack);
    //        $(this.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwVideoAssistant_Admin.performUpload: ' + e.message + ', ' + e.stack;
    //        displayAlertDialog('Exception in bwVideoAssistant_Admin.js.performUpload(): ' + e.message + ', ' + e.stack);
    //    }
    //},

    performUpload: function (fileData, filename, displayAttachmentsTagName, _budgetRequestId) {
        try {
            console.log('In bwVideoAssistant_Admin.js.performUpload().');
            var thiz = this;

            var largeFileUploadEnabled = $('.bwAuthentication').bwAuthentication('option', 'largeFileUploadEnabled');

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            var bwBudgetRequestId = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid'); // Get this from the New Budget Request form.

            var description = '';
            var descriptionElement = $(this.element).find('#txtConfirmFileUploadDialogFileDescription');
            if (descriptionElement && descriptionElement.innerHTML && descriptionElement.innerHTML.trim().length > 1) {
                description = descriptionElement.innerHTML.trim();
            }

            var size = 0;
            var fileElementId = 'inputFile_' + bwBudgetRequestId;
            var fileElement = $('#' + fileElementId)[0];
            if (fileElement && fileElement.files && fileElement.files[0] && fileElement.files[0].size) {
                size = fileElement.files[0].size;
            }
            console.log('size: ' + size);

            // 2-4-2022
            console.log('In bwVideoAssistant_Admin.js.performUpload(). workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId);

            var elementId = 'uploadForm_' + bwBudgetRequestId;
            var element = $('#' + elementId)[0];
            var formData = new FormData(element);

            // It is important to prepend these values, so that they get read immediately and not be undefined in the web service.
            formData.set('bwWorkflowAppId', workflowAppId);
            formData.set('bwBudgetRequestId', bwBudgetRequestId);
            formData.set('bwParticipantId', participantId);
            formData.set('bwParticipantEmail', participantEmail);
            formData.set('bwParticipantFriendlyName', participantFriendlyName);
            formData.set('Filename', filename);
            formData.set('Description', description);
            formData.set('Size', size);

            //
            // Timer to monitor how the upload is going. If it stalls, then checking xhr.readyState.
            //
            var xhr; // This is the XMLHttpRequest object.
            var xhrAbortMessage;
            var percentComplete = 0;
            var percentComplete_LastValue = 0;
            var fileUploadTimer = 'stopped';
            var fileUploadTimer_Interval = 15000; // 15000 = 15 seconds. 

            fileUploadTimer = setInterval(function () {

                if (percentComplete == percentComplete_LastValue) {
                    // This is a problem. The upload has stalled.
                    xhrAbortMessage = 'The file upload has stalled. The upload has been cancelled. Unknown error.';
                    xhr.abort();

                    console.log('');
                    console.log(xhrAbortMessage);
                    console.log('');

                    //displayAlertDialog(xhrAbortMessage);

                    clearInterval(fileUploadTimer);
                    fileUploadTimer = 'stopped';

                } else {

                    percentComplete_LastValue = percentComplete; // This is how we keep track.

                    if (xhr && xhr.readyState && (xhr.readyState == 1)) {
                        console.log('');
                        console.log('fileUploadTimer: ' + xhr.readyState);
                        console.log('');
                    } else {
                        // This is a problem. The upload has stalled.
                        xhrAbortMessage = 'fileUploadTimerxcx2: THE FILE UPLOAD HAS STALLED WE HAVE A PROBLEM OF SOME SORT. The upload has been cancelled.';
                        xhr.abort();

                        console.log('');
                        console.log(xhrAbortMessage);
                        console.log('');

                        //displayAlertDialog(xhrAbortMessage);

                        clearInterval(fileUploadTimer);
                        fileUploadTimer = 'stopped';
                    }
                }

            }, fileUploadTimer_Interval);
            //
            // end of fileUploadTimer
            //

            var largeFileSizeMinBytes = 50000000; // 50000000 = 50,000,000 bytes = 50MB.
            if ((largeFileUploadEnabled != true) && (size > largeFileSizeMinBytes)) {

                displayAlertDialog('Large file uploads are not currently enabled for this organization. This file cannot be uploaded. The limit is ' + largeFileSizeMinBytes + ' bytes, and this file size is: ' + size + ' bytes.');

            } else {

                ShowActivitySpinner_FileUpload('Uploading file...'); 

                var operationUri = this.options.operationUriPrefix + '_files/' + 'uploadattachment_large';
                $.ajax({
                    xhr: function () {
                        try {
                            xhr = new window.XMLHttpRequest();
                            // XMLHttpRequest events:
                            //loadstart	The upload has begun.
                            //progress	Periodically delivered to indicate the amount of progress made so far.
                            //abort	The upload operation was aborted.
                            //error	The upload failed due to an error.
                            //load	The upload completed successfully.
                            //timeout	The upload timed out because a reply did not arrive within the time interval specified by the XMLHttpRequest.timeout.
                            //loadend	The upload finished. This event does not differentiate between success or failure, and is sent at the end of the upload regardless of the outcome. Prior to this event, one of load, error, abort, or timeout will already have been delivered to indicate why the upload ended.

                            xhr.upload.addEventListener("progress", function (evt) {
                                if (evt.lengthComputable) {
                                    percentComplete = ((evt.loaded / evt.total) * 100);
                                    $("#divBwActivitySpinner_FileUpload_ProgressBar").width(percentComplete + '%');
                                    $("#divBwActivitySpinner_FileUpload_ProgressBar").html(Math.round(percentComplete) + '%');

                                    //console.log(Math.round(percentComplete) + '%');

                                    console.log('');
                                    console.log('progress ' + Math.round(percentComplete) + '% workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId);
                                    console.log('');

                                }
                            }, false);

                            xhr.upload.addEventListener("loadstart", function (evt) {
                                console.log('');
                                console.log('loadstart workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId);
                                console.log('');

                                //displayAlertDialog('loadstart');

                            }, false);

                            xhr.upload.addEventListener("abort", function (evt) {

                                console.log('');
                                console.log('abort message: ' + xhrAbortMessage + ',  workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId);
                                console.log('');

                                //alert('abort message: ' + evt.message);

                            }, false);

                            xhr.upload.addEventListener("error", function (evt) {

                                console.log('');
                                console.log('error workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId);
                                console.log('');

                                displayAlertDialog('error');

                            }, false);

                            xhr.upload.addEventListener("load", function (evt) {
                                console.log('');
                                console.log('load workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId);
                                console.log('');

                                displayAlertDialog('The file has uploaded successfully.');

                                clearInterval(fileUploadTimer);
                                fileUploadTimer = 'stopped';

                            }, false);

                            xhr.upload.addEventListener("timeout", function (evt) {

                                console.log('');
                                console.log('timeout workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId);
                                console.log('');


                                displayAlertDialog('timeout');

                            }, false);

                            xhr.upload.addEventListener("loadend", function (evt) {
                                console.log('');
                                console.log('loadend workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId);
                                console.log('');

                                HideActivitySpinner_FileUpload();

                                //displayAlertDialog('loadend');

                            }, false);

                            return xhr;
                        } catch (e) {

                            console.log('');
                            console.log('Exception in POST uploadattachment_large.ajax.xhr(). workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', ' + e.message + ', ' + e.stack);
                            console.log('');

                        }
                    },
                    type: "POST",
                    enctype: "multipart/form-data",
                    url: operationUri,
                    data: formData,
                    processData: false,
                    contentType: false,
                    cache: false,
                    beforeSend: function () {
                        $("#divBwActivitySpinner_FileUpload_ProgressBar").width('0%');
                    },
                    success: function (data) {

                        console.log('');
                        console.log('POST success workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId);
                        console.log('');


                        HideActivitySpinner();

                        if (data == 'SUCCESS') {
                            // Do nothing.
                        } else {
                            displayAlertDialog(data);
                        }
                        //displayAlertDialog('POST success: ' + JSON.stringify(data));

                    },
                    error: function (e) {
                        HideActivitySpinner();
                        if (xhrAbortMessage && xhrAbortMessage != '') {
                            // This means we intentionally aborted.
                            console.log('');
                            console.log('POST error. Intentional abort: ' + xhrAbortMessage);
                            console.log('');

                            displayAlertDialog('POST error. Intentional abort: ' + xhrAbortMessage + ', workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId);

                        } else {
                            // It was unexpected.
                            console.log('');
                            console.log('POST error. Unexpected error: ' + JSON.stringify(e));
                            console.log('');

                            displayAlertDialog('POST error. workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', Unexpected error: ' + JSON.stringify(e)); //e.responseText)

                        }
                    }
                });
            }

        } catch (e) {
            console.log('Exception in bwVideoAssistant_Admin.js.performUpload(): ' + e.message + ', ' + e.stack);
            $(this.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwVideoAssistant_Admin.performUpload: ' + e.message + ', ' + e.stack;
            displayAlertDialog('Exception in bwVideoAssistant_Admin.js.performUpload(): ' + e.message + ', ' + e.stack);
        }
    },

    populateAttachments: function (bwWorkflowAppId, _budgetRequestId, attachmentsTagId, showRemoveAttachmentButton, requestDialogId) {
        try {
            console.log('In bwVideoAssistant_Admin.js.populateAttachments().');
            var thiz = this;

            //alert('In populateAttachments(). attachmentsTagId: ' + attachmentsTagId);

            //if (!attachmentsTagId) {
            //    if (document.getElementById('newrequestattachments')) {
            //        attachmentsTagId = 'attachmentsTagId';
            //    }
            //}

            //alert('In populateAttachments(). attachmentsTagId: ' + attachmentsTagId);

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            $(this.element).find('#newrequestattachments')[0].innerHTML = '<span style="font-style:italic;font-size:8pt;">There are no attachments</span>';

            var bwBudgetRequestId = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
            if (!bwBudgetRequestId) {
                console.log('ERROR IN bwVideoAssistant_Admin.js.populateAttachments(). Unexpected value for bwBudgetRequestId: ' + bwBudgetRequestId);
                displayAlertDialog('ERROR IN bwVideoAssistant_Admin.js.populateAttachments(). Unexpected value for bwBudgetRequestId: ' + bwBudgetRequestId);
            } else {



                console.log('In populateAttachments(). workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', attachmentsTagId: ' + attachmentsTagId + ', showRemoveAttachmentButton: ' + showRemoveAttachmentButton + ').');
                //alert('In populateAttachments(). workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', attachmentsTagId: ' + attachmentsTagId + ', showRemoveAttachmentButton: ' + showRemoveAttachmentButton + ').');

                debugger;
                // removed 1-11-2022 // var operationUri = this.options.operationUriPrefix + '_files/' + 'getlistofattachmentsforbudgetrequest/' + workflowAppId + '/' + bwBudgetRequestId; // _files allows us to use nginx to route these to a dedicated file server.

                var operationUri = globalUrlPrefix + globalUrlForWebServices + '/_files/' + 'getlistofattachmentsforbudgetrequest/' + workflowAppId + '/' + bwBudgetRequestId;
                $.ajax({
                    url: operationUri,
                    method: "GET",
                    timeout: 15000, // This is done because file services may need more time. 
                    headers: { "Accept": "application/json; odata=verbose" },
                    success: function (data) {
                        try {
                            debugger;
                            //alert('data: ' + JSON.stringify(data));
                            if (!data) {
                                $(thiz.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">[Unexpected response from the file server]</span>';
                            } else if (data.code == 'ENOENT') {
                                // No such file or directory

                                console.log('[Server response: No such file or directory: ' + data.path + ']. This is probably Ok.?');

                                //displayAlertDialog('[Server response: No such file or directory: ' + data.path + ']. This is probably Ok.?');

                                //if (weDontExpectToFindAnyAttachmentsYet && (weDontExpectToFindAnyAttachmentsYet == true)) {
                                //    // This flag is sent when it is a new request that has not been saved yet. Behind the scenes this means the folder has not yet been created, so we will suppress this error in this case.
                                //} else {
                                //    $(thiz.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;white-space:wrap;">[Server response: No such file or directory: ' + data.path + ']</span>';
                                //}


                            } else if (data && data.length > 0) {

                                $(thiz.element).find('#newrequestattachments')[0].innerHTML = ''; // It worked, and here were attachments, so get rid of the message.

                                for (var i = 0; i < data.length; i++) {

                                    //Filename: filename,
                                    //Description: description

                                    var filename = data[i].Filename;
                                    var description = data[i].Description;
                                    var size = data[i].Size;
                                    if (size.toLowerCase() != 'na') {
                                        size = (Number(size) / 1000000).toFixed(1);
                                    }

                                    console.log('In populateAttachments(). description: ' + description);

                                    var fileUrl = "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + filename;

                                    // Centered on the screen.
                                    var width = 800;
                                    var height = 600;
                                    var left = (screen.width - width) / 2;
                                    var top = (screen.height - height) / 2;

                                    var html = '';

                                    html += '<table style="width:100%;">';
                                    html += '  <tr>';
                                    html += '    <td style="width:10%;">';
                                    // Display the image thumbnail.
                                    if (filename.toLowerCase().indexOf('.png') > -1 || filename.toLowerCase().indexOf('.jpg') > -1 || filename.toLowerCase().indexOf('.jpeg') > -1 || filename.toLowerCase().indexOf('.jfif') > -1 || filename.toLowerCase().indexOf('.webp') > -1 || filename.toLowerCase().indexOf('.gif') > -1) {
                                        //debugger;
                                        html += '<img id="attachmentstest1"  src="' + thiz.options.operationUriPrefix + fileUrl + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;" alt="" ';
                                        if (Platform == 'IOS8') {
                                            html += 'onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');"';
                                        } else {
                                            html += 'onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" ';
                                        }
                                        html += ' />';
                                    } else if (filename.toLowerCase().indexOf('.xlsx') > -1 || filename.toLowerCase().indexOf('.xls') > -1) {
                                        //html += '<img src="images/excelicon.png" style="width:100px;height:46px;" />';
                                        // We need an if statement here to choose between iOS and Windows.
                                        if (Platform == 'IOS8') {
                                            html += '<img src="images/excelicon.png" style="width:100px;height:46px;cursor:pointer;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" />';
                                            //html += '<div class="attachmentsSectionFileLink" style="height:50px;border:1px thin red;" onclick="displayAttachmentInDialog(\'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';
                                        } else {
                                            html += '<img src="images/excelicon.png" style="width:100px;height:46px;cursor:pointer;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" />';
                                            //html += '<div style="cursor:pointer;" class="attachmentsSectionFileLink" onclick="displayAttachmentInDialog(\'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';
                                        }

                                    } else if (filename.toUpperCase().indexOf('.MP4') > -1) {

                                        html += '<img src="images/mp4.jfif" style="width:50px;cursor:pointer;" ';

                                        html += 'onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" ';
                                        html += ' />';
                                    } else if (filename.toUpperCase().indexOf('.VOB') > -1) {

                                        html += '<img src="images/vob.png" style="width:50px;cursor:pointer;" ';

                                        html += 'onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" ';
                                        html += ' />';
                                    } else if (filename.toUpperCase().indexOf('.MP3') > -1) {

                                        html += '<img src="images/mp3.png" style="width:50px;cursor:pointer;" ';

                                        html += 'onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" ';
                                        html += ' />';
                                    }
                                    html += '    </td>';
                                    html += '    <td style="width:90%;white-space:normal;">';

                                    // We need an if statement here to choose between iOS and Windows.
                                    if (Platform == 'IOS8') {
                                        html += '<div class="attachmentsSectionFileLink" style="height:50px;border:1px thin red;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';
                                    } else {
                                        html += '<div class="attachmentsSectionFileLink" style="cursor:pointer;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';
                                    }

                                    html += filename;

                                    // Display the file attachment description.
                                    if (description.length > 0) {
                                        //$('#' + attachmentsSectionId).append('&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - "' + description + '"</span>');

                                        html += '<br /><span class="attachmentsSectionDescription"> - "' + description + '"</span>';
                                        //html += '<br /><span class="attachmentsSectionSize"> - ' + size + ' mb</span>';
                                    } else {
                                        //$('#' + attachmentsSectionId).append('&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - [no description]' + description + '</span>'); // Leave the description variable here because then we will know if something unexpected happens.

                                        html += '<br /><span class="attachmentsSectionDescription"> - [no description]' + description + '</span>';
                                        
                                    }

                                    if (size.toLowerCase() == 'na') {
                                        html += '<br /><span class="attachmentsSectionDescription" style="">[size unavailable]</span>';
                                    } else {
                                        html += '<br /><span class="attachmentsSectionDescription">' + size + ' MB</span>';
                                    }




                                    if (showRemoveAttachmentButton && (showRemoveAttachmentButton == 'true')) {
                                        //$('#' + attachmentsSectionId).append("&nbsp;&nbsp;<input type=\"button\" style=\"cursor:pointer;\" id=\"removeBudgetRequestAttachment" + i + "\" value=\"Remove\" onclick=\"removeAttachment('" + filename + "', '" + attachmentsSectionId + "', '" + _workflowAppId + "', '" + _budgetRequestId + "');\" />");

                                        html += '&nbsp;&nbsp;<input type="button" style="cursor:pointer;" id="removeBudgetRequestAttachment' + i + '" value="Remove" onclick="removeAttachment(\'' + filename + '\', \'' + attachmentsTagId + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\');" />';
                                    }

                                    //$('#' + attachmentsSectionId).append("</br>");
                                    //html += '</br>';

                                    html += '</div>';

                                    html += '</br>';
                                    //$('#' + attachmentsSectionId).append('</div>');

                                    //$('#' + attachmentsTagId).append(html);
                                    //debugger;
                                    $(thiz.element).find('#newrequestattachments').append(html);





                                    function handleDragStart(e) {
                                        try {
                                            console.log('In handleDragStart().');
                                            //this.style.opacity = '0.4';  // this / e.target is the source node.

                                            thiz.options.dragSourceAttachmentElement = this;

                                            e.dataTransfer.effectAllowed = 'copy';
                                            e.dataTransfer.dropEffect = 'copy';
                                            e.dataTransfer.setData('text/html', this.src); //.innerHTML);
                                        } catch (e) {
                                            console.log('Exception in handleDragStart(): ' + e.message + ', ' + e.stack);
                                        }
                                    }
                                    //function handleDragOver(e) {
                                    //    console.log('In handleDragOver().');
                                    //    if (e.preventDefault) {
                                    //        e.preventDefault(); // Necessary. Allows us to drop.
                                    //    }
                                    //    e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
                                    //    return false;
                                    //}
                                    //function handleDragEnter(e) {
                                    //    console.log('In handleDragEnter().');
                                    //    // this / e.target is the current hover target.
                                    //    this.classList.add('over');
                                    //}
                                    //function handleDragLeave(e) {
                                    //    console.log('In handleDragLeave().');
                                    //    this.classList.remove('over');  // this / e.target is previous target element.
                                    //}
                                    // dragstart="$(\'.bwRequest\').bwRequest(\'dragstart\');"
                                    //document.getElementById('attachmentstest1').addEventListener('dragstart', $('.bwRequest').bwRequest('dragstart'), false);
                                    //var element1 = document.getElementById('attachmentstest1'); // $('#' + requestDialogId).find('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
                                    try {
                                        var element1 = $(thiz.element).find('#attachmentstest1'); // document.getElementById('attachmentstest1');
                                        element1.addEventListener('dragstart', handleDragStart, false);
                                    } catch (e) { }

                                    //element1.addEventListener('dragenter', handleDragEnter, false);
                                    //element1.addEventListener('dragover', handleDragOver, false);
                                    //element1.addEventListener('dragleave', handleDragLeave, false);

                                    //var element2 = document.getElementById('dropzone1');
                                    //element2.addEventListener('dragstart', handleDragStart, false);
                                }





                            } else if (data) {

                                $(thiz.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">No attachments found: ' + JSON.stringify(data) + '</span>';

                            } else {
                                $(thiz.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">ERROR: Unexpected response: ' + JSON.stringify(data) + '</span>';
                            }
                        } catch (e) {
                            $(thiz.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">Exception in bwVideoAssistant_Admin.populateAttachments:1: ' + e.message + ', ' + e.stack + '</span>';
                            if (e.number) {
                                displayAlertDialog('Error in bwRequest.populateAttachments():1: ' + e.message + ', ' + e.stack);
                            } else {
                                // This most likely means that the folders are there on the file services server, but there is nothing in them.
                                //
                                // Fileservices has an error, so show nothing! We will put a red exclamation pin in the attachments section eventually! - 10-1-17 todd
                                //displayAlertDialog('Fileservices has an error: ' + ' "' + e.message + '"');
                            }
                        }
                        //}
                    },
                    error: function (data, errorCode, errorMessage) {

                        if (errorCode === 'timeout' && errorMessage === 'timeout') {
                            displayAlertDialog('SERVICE UNAVAILABLE. File services is not responding. communication timeout is set at ' + ajaxTimeout / 1000 + ' seconds: ' + errorCode + ', ' + errorMessage);
                            $(thiz.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">File services is not responding. communication timeout is set at ' + ajaxTimeout / 1000 + ' seconds: ' + errorCode + ', ' + errorMessage + '</span>';
                        } else {

                            var msg = 'Error in bwVideoAssistant_Admin.js.populateAttachments():2: ' + errorCode + ', ' + errorMessage + ', operationUri: ' + operationUri;

                            console.log(msg);

                            $(thiz.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">' + msg + '</span>';

                            displayAlertDialog('Error in bw.initar.core.js.populateAttachments():2: ' + errorCode + ', ' + errorMessage);
                            // The latest error 1-17-2018 is errorCode:'error' and errorMessage:'Not Found'.
                            // What does this mean? You can replicate this error!
                            // at Url: https://budgetworkflow.com/ios8.html, view an offline (Un-submitted) request, and try to add an attachment.


                        }
                    }
                });
            }
        } catch (e) {
            console.log('Exception in populateAttachments: ' + e.message + ', ' + e.stack);

            //renderAndPopulateAttachments
            $(thiz.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">Exception in bwVideoAssistant_Admin.populateAttachments: ' + e.message + ', ' + e.stack + '</span>';

        }
    },






    cmdSaveAttachmentMetadata: function (bwBudgetRequestId, originalFilename) {
        try {
            console.log('In bwVideoAssistant_Admin.js.cmdSaveAttachmentMetadata().');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            var newFilename = document.getElementById('txtAttachmentsDialog1Filename').value + document.getElementById('spanAttachmentsDialog1FileExtension').innerHTML;
            var description = document.getElementById('txtAttachmentsDialog1FileDescription').value.replace(/["']/g, '');

            //displayAlertDialog('Saving attachment metadata, bwBudgetRequestId: ' + bwBudgetRequestId + ' filename: ' + filename + ' newFilename: ' + newFilename + ' description: ' + description);

            var fileserviceurl = globalUrlPrefix + globalUrlForWebServices + '/_files';
            var data = [];
            data = {
                bwWorkflowAppId: workflowAppId,
                bwBudgetRequestId: bwBudgetRequestId,
                OriginalFilename: originalFilename,
                NewFilename: newFilename,
                Description: description
            };
            var operationUri = fileserviceurl + "/saveattachmentmetadata";
            $.ajax({
                url: operationUri,
                type: "POST", timeout: ajaxTimeout,
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    try {
                        if (JSON.stringify(data).toUpperCase().indexOf('THE FILE WAS SAVED') > -1) {

                            try {
                                $('#AttachmentsDialog1').dialog('close');
                            } catch(e) { }

                            // I named the attachment section differently depending on if it is a new request or not. This may not have been necessary, but for now this addresses the issue.
                            if (document.getElementById('attachmentsInXslForm')) {
                                thiz.populateAttachments(workflowAppId, bwBudgetRequestId, 'attachmentsInXslForm', true);
                            } else {
                                thiz.populateAttachments(workflowAppId, bwBudgetRequestId, 'newrequestattachments', true);
                            }

                        } else {
                            displayAlertDialog('Failed to update metadata: ' + JSON.stringify(data));
                        }
                    } catch (e) {
                        console.log('Exception in bwVideoAssistant_Admin.js.cmdSaveAttachmentMetadata(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwVideoAssistant_Admin.js.cmdSaveAttachmentMetadata(): ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {

                    $('#AttachmentsDialog1').dialog('close');

                    //displayAlertDialog('Error in Start.js.displayConnectedWorkflows()', '1:' + errorCode + ', ' + errorMessage);
                    displayAlertDialog('Error in bwVideoAssistant_Admin.js.cmdSaveAttachmentMetadata().saveattachmentmetadata: ' + data + ', ' + errorMessage);
                }
            });
        } catch (e) {
            console.log('Exception in bwVideoAssistant_Admin.js.cmdSaveAttachmentMetadata():2: ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwVideoAssistant_Admin.js.cmdSaveAttachmentMetadata():2: ' + e.message + ', ' + e.stack);
        }
    },

    cmdDeleteAttachment: function (bwBudgetRequestId, filename) {
        try {
            console.log('In bwVideoAssistant_Admin.js.cmdDeleteAttachment(' + bwBudgetRequestId + ', ' + filename + ').');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            $("#divDeleteAnAttachmentOfflineDialog").dialog({
                modal: true,
                resizable: false,
                closeText: "Cancel",
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                width: "1000", //"570px",
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divDeleteAnAttachmentOfflineDialog").dialog('close');
                    });
                }
            });

            // Hide the title bar.
            $("#divDeleteAnAttachmentOfflineDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
            // Set the title.
            document.getElementById('spanDeleteAnAttachmentOfflineDialogTitle').innerHTML = 'Delete ' + filename;

            // Set the click event for the Delete button.
            $('#divDeleteAnAttachmentOfflineDialogDeleteRequestButton').off('click').click(function (error) {
                try {
                    debugger;
                    var fileserviceurl = globalUrlPrefix + globalUrlForWebServices + '/_files';
                    var data = [];
                    data = {
                        bwBudgetRequestId: bwBudgetRequestId,
                        Filename: filename
                    };
                    var operationUri = fileserviceurl + "/removeattachment";
                    $.ajax({
                        url: operationUri,
                        type: "POST",
                        data: data,
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        },
                        success: function (data) {
                            try {
                                $("#divDeleteAnAttachmentOfflineDialog").dialog('close');

                                if (JSON.stringify(data).toUpperCase().indexOf('THE FILE WAS DELETED') > -1) {
                                    try {
                                        $('#AttachmentsDialog1').dialog('close');
                                    } catch(e) { }
                                    thiz.populateAttachments(workflowAppId, bwBudgetRequestId, 'attachmentsInXslForm', true);
                                } else {


                                    // 3-23-2022 this may need a revisit someday

                                    console.log('There was an error deleting the file: ' + JSON.stringify(data));
                                    try {
                                        $('#AttachmentsDialog1').dialog('close');
                                    } catch(e) { }
                                    thiz.populateAttachments(workflowAppId, bwBudgetRequestId, 'attachmentsInXslForm', true);



                                }
                            } catch (e) {
                                debugger;
                                console.log('Exception in bwVideoAssistant_Admin.js.cmdDeleteAttachment.post.removeattachment.success(): ' + e.message + ', ' + e.stack);
                                displayAlertDialog('Exception in bwVideoAssistant_Admin.js.cmdDeleteAttachment.post.removeattachment.success(): ' + e.message + ', ' + e.stack);
                            }
                        },
                        error: function (data, errorCode, errorMessage) {
                            debugger;
                            console.log('Error in bwVideoAssistant_Admin.js.cmdDeleteAttachment.post.removeattachment.error(): ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Error in bwVideoAssistant_Admin.js.cmdDeleteAttachment.post.removeattachment.error(): bwBudgetRequestId: ' + bwBudgetRequestId + ', filename: ' + filename + ', errorMessage: ' + errorMessage);
                        }
                    });
                } catch (e) {
                    debugger;
                    console.log('Exception in bwVideoAssistant_Admin.js.cmdDeleteAttachment.deletebutton.click(): ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in bwVideoAssistant_Admin.js.cmdDeleteAttachment.deletebutton.click(): ' + e.message + ', ' + e.stack);
                }
            });

        } catch (e) {
            debugger;
            console.log('Exception in bwVideoAssistant_Admin.js.cmdDeleteAttachment():2: ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwVideoAssistant_Admin.js.cmdDeleteAttachment():2: ' + e.message + ', ' + e.stack);
        }
    },


    //displayAlertDialog: function (errorMessage) {
    //    try {
    //        //debugger;
    //        var element = $("#divAlertDialog");
    //        $(element).find('#spanErrorMessage')[0].innerHTML = errorMessage;
    //        $(element).dialog({
    //            modal: true,
    //            resizable: false,
    //            //closeText: "Cancel",
    //            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
    //            //title: 'Add a New Person',
    //            width: '800',
    //            dialogClass: "no-close", // No close button in the upper right corner.
    //            hide: false, // This means when hiding just disappear with no effects.
    //            open: function () {
    //                $('.ui-widget-overlay').bind('click', function () {
    //                    $("#divAlertDialog").dialog('close');
    //                });
    //            },
    //            close: function () {
    //                //$(this).dialog('destroy').remove();
    //            }
    //        });
    //        $(element).dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
    //    } catch (e) {
    //        console.log('Exception in bwVideoAssistant_Admin.displayAlertDialog(): ' + e.message + ', ' + e.stack);
    //    }
    //}

});