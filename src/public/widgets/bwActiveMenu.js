$.widget("bw.bwActiveMenu", {
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
         ===========================================
         This is the bwActiveMenu.js jQuery Widget. 
         ===========================================

            This widget is intended to be instantiated early in the page_load process, in order to provide DOM elements for displaying subsequent functionality (jQuery widgets). 

            IT IS FORTUNATE THAT THE NAMING OF THIS WIDGET MAKES IT THE FIRST FILE IN THE LIST WHEN SORTED ALPHABETICALLY.
            I have tried to name things appropriately to group functionality when possible, while also being very true to the English meanings.

            It is a left-side button menu, with wrap over top-bar, and weighted vertical button sizes, animated to provide liveliness, in a drill down and always-available-functionality kind of way.
                - The DOM elements have an id of ['tdLeftSideMenu', 'divPageContent1', 'divPageContent3'], depending on how deep in the menu structure the user has drilled-down to. 
                - These manifest themselves as "left_menu", "inner_left_menu".
                    - There are possible optimizations to this structure, but I love the simplicity, and maybe that is the magic which will make this the best approach. We will see. Todd 1-24-2024.
                    - [more to follow]
                
         ===========================================
         ===========================================
         MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

            On mobile, a swipe down opens a context menu, which alowws for:
              - Auto Login (cached in localStorage for the device).
              - Auto Login, View Email.
              - 

            On desktop, I need to provide this functionality via right-click context menu.
              - xx
              - xx
              - dev: in progress 7-4-2024.
              - See: class="spanButton2 context_menu_requestformellipses" // context_menu_body_unauthenticated
              - 

         ===========================================
         
        */

        videoElement: null, // We save the video object here so we don't have to search for it in the DOM. This means we maintain the handle on the video, and it works as expected.

        LeftMenuWidth: '250px', // This is the default, until we figure out device sizing and left top org circle sizing diameter etc. 7-20-2023.
        LeftMenuFontSize: '12pt',

        HasBeenInitialized: null,
        operationUriPrefix: null,
        HomePage: true, // We start off with this set to true, because the user is not logged in yet, it is a good default. :)
        divWelcomeButton_OriginalHeight: null, //259.353, // This is how we remember the original value before we do any scrolling adjustments in $(document).scroll(function (event) { });
        divInnerLeftMenuButton_PersonalBehavior_OriginalHeight: null, //62.2459 // This is how we remember the original value before we do any scrolling adjustments in $(document).scroll(function (event) { });

        divInnerLeftMenuButton_NewMessage_OriginalHeight: null, // 6-25-2024.

        divInnerLeftMenuButton_Introduction_OriginalHeight: null

    },
    _create: function () {
        this.element.addClass("bwActiveMenu");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {
            if (this.options.operationUriPrefix == null) {
                // This formulates the operationUri, which is used throughout.
                var url1;
                if (window.location.href.indexOf('https://') > -1) {
                    url1 = window.location.href.split('https://')[1];
                    this.options.operationUriPrefix = 'https://';
                } else {
                    url1 = window.location.href.split('http://')[1]; // fallback to http.
                    this.options.operationUriPrefix = 'http://';
                }
                var url2 = url1.split('/')[0];
                this.options.operationUriPrefix += url2 + '/';
            }

            var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');

            console.log('In bwActiveMenu.js._create(). >>>>>>>>>>>>>>>>>>>>> developerModeEnabled: ' + developerModeEnabled);

            if (this.options.HomePage == true) {

                this.renderHomePage();
            }

            this.options.HasBeenInitialized = true;
            console.log('In bwActiveMenu._create(). The widget has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwActiveMenu</span>';
            html += '<br />';
            html += '<span style="">Exception in bwActiveMenu.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwActiveMenu")
            .text("");
    },

    uploadAttachment: function (displayAttachmentsTagName, requestDialogId, bwBudgetRequestId, objDataTransfer) {
        try {
            console.log('In bwActiveMenu.js.uploadAttachment().');
            console.log('In bwAttachments.js.uploadAttachment(). attachmentsAreStoredInIndexDb: ' + this.options.attachmentsAreStoredInIndexDb + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', elementIdSuffix: ' + this.options.elementIdSuffix + ', displayAttachmentsTagName: ' + displayAttachmentsTagName + ', requestDialogId: ' + requestDialogId);
            //displayAlertDialog('In bwAttachments.js.uploadAttachment(). attachmentsAreStoredInIndexDb: ' + this.options.attachmentsAreStoredInIndexDb + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', elementIdSuffix: ' + this.options.elementIdSuffix + ', displayAttachmentsTagName: ' + displayAttachmentsTagName + ', requestDialogId: ' + requestDialogId);

            if (objDataTransfer) {

                console.log('In uploadAttachment(). Got a DataTransfer object with ' + objDataTransfer.files.length + ' files.');

                this.cmdDisplayMultiFileUploadDialog(displayAttachmentsTagName, bwBudgetRequestId, objDataTransfer.files); // Changed from cmdDisplayConfirmFileUploadDialog_zip_wasm() <<< DONT FORGET THIS CODE!

            } else {

                var inputFileAttachmentsElement = $('#inputFile_bwActiveMenu_Unauthenticated_Home')[0];

                if (!(inputFileAttachmentsElement && inputFileAttachmentsElement.files && inputFileAttachmentsElement.files.length && (inputFileAttachmentsElement.files.length > 0))) {

                    console.log('In bwAttachments.js.uploadAttachment(). NO FILES ARE ATTACHED.');

                } else {

                    //
                    // THERE ARE MULTIPLE FILES TO UPLOAD.
                    //
                    console.log('In bwAttachments.js.uploadAttachment(). THERE ARE MULTIPLE FILES TO UPLOAD. Number of files attached: ' + inputFileAttachmentsElement.files.length);

                    this.cmdDisplayMultiFileUploadDialog(displayAttachmentsTagName, bwBudgetRequestId, inputFileAttachmentsElement.files); // Changed from cmdDisplayConfirmFileUploadDialog_zip_wasm() <<< DONT FORGET THIS CODE!

                }

            }

            //
            // This resets the value of the input file element so that is the same file is selected a second time, it behaves as expected. THIS CAN CAUSE A DIFFICULT TO TROUBLESHOOT ISSUE. DON'T LET IT TRIP YOU UP! :) 11-10-2023.
            //
            console.log('This resets the value of the input file attachments element so that is the same file is selected a second time, it behaves as expected. THIS CAN CAUSE A DIFFICULT TO TROUBLESHOOT ISSUE. DONT LET IT TRIP YOU UP! :) 11-10-2023. CURRENTLY DISABLED BUT HERE IF YOU NEED IT...');
            //inputFileAttachmentsElement.value = ''; // This resets the value of the input file element so that is the same file is selected a second time, it behaves as expected. 10-20-2023.

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

        } catch (e) {
            var msg = 'Exception in bwActiveMenu.js.uploadAttachment(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
        }
    },
    cmdDisplayMultiFileUploadDialog: function (displayAttachmentsTagName, bwBudgetRequestId, files) {
        try {
            console.log('In bwAttachments.js.cmdDisplayMultiFileUploadDialog(). bwBudgetRequestId: ' + bwBudgetRequestId);
            //alert('In bwAttachments.js.cmdDisplayMultiFileUploadDialog(). bwBudgetRequestId: ' + bwBudgetRequestId);
            var thiz = this;

            var dialogId = 'divConfirmFileUploadDialog_MultiFile_' + bwBudgetRequestId;

            //
            //
            // This is the new method which replaces cmdDisplayConfirmFileUploadDialog_zip_wasm. DONT LOSE THAT CODE!!!!!!!!!!!!! Also realize the async nature of it's function definition...11-10-2023.
            //
            // bwAttachments.js.uploadAttachment() has the line which resets/clears the input file element which has the attachments. THIS MAY NEED TO GO SOMEWHERE IN THE NEAR FUTURE S THAT A USER CAN RETRY TO LOAD THE SAME FILE. 11-10-2023.
            //
            //

            var CompressAndUploadImages = function (files) {
                try {
                    ShowActivitySpinner('Compressing the files for upload...');

                    var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

                    var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });

                    //var archiveFileName = 'ZIPPEDFILES_' + workflowAppId + '_' + bwBudgetRequestId + '_' + guid + '.zip'; // We are using a guid for the filename in order to circumvent (on mobile Samsung, "Are you sure you wish to download this file again?").
                    var archiveFileName = 'ZIPPEDFILES_' + guid + '.zip'; // We are using a guid for the filename in order to circumvent (on mobile Samsung, "Are you sure you wish to download this file again?").
                    debugger;


                    //
                    // May 26, 2024. 
                    //
                    //
                    // JQuery UI widgets are declared like this:
                    //
                    // $.widget("rootclassname.investmentGrid", {
                    //     options: {
                    //

                    //if (typeof ($.rootclassname.investmentGrid) != 'undefined') {
                    //    // At this point, we know the investmentGrid.js file has loaded. Now we need to check if the widget has been instantiated.
                    //    var widget = document.getElementsByClassName('investmentGrid');
                    //    if (!(widget.length && (widget.length > 0))) {
                    //        // It has not been instantiated, so do that here. In this case we expect that a DOM element already exists.
                    //        var div = document.getElementById('divRootclassnameinvestmentGrid');
                    //        if (!div) {
                    //            div = document.createElement('div');
                    //            div.id = 'divRootclassnameinvestmentGrid';
                    //            div.style.display = 'none';
                    //            document.body.appendChild(div); // place at end of document.
                    //        }
                    //        $(div).investmentGrid({});
                    //    }

                    //    $('.investmentGrid').investmentGrid('somemethodnamecasesensitive');

                    //} else {

                    //    //var msg = 'Error: The investmentGrid.js widget has not been loaded. Inspect the index.html file to make sure it is specified to load. xcx23536.';

                    //}



                    if (typeof ($.bw.bwTimelineAggregator) != 'undefined') {
                        //// At this point, we know the widget.js file has loaded. Now we need to check if the widget has been instantiated.
                        //var widget = document.getElementsByClassName('bwTimelineAggregator');
                        //if (!(widget.length && (widget.length > 0))) {
                        //    // It has not been instantiated, so do that here.
                        //    var div = document.getElementById('divBwTimelineAggregator');
                        //    if (!div) {
                        //        div = document.createElement('div');
                        //        div.id = 'divBwTimelineAggregator';
                        //        div.style.display = 'none';
                        //        document.body.appendChild(div); // place at end of document.
                        //    }
                        //    $(div).bwTimelineAggregator({});
                        //}

                        //$('.bwTimelineAggregator').bwTimelineAggregator('displayDialog');

                    } else {
                        //var msg = 'Error: The bwTimelineAggregator.js widget has not been loaded. Inspect the index.html file to make sure it is specified to load. xcx23536.';
                    }



                    var zip = new Module.Zip(archiveFileName);










                    var trackingArray = []; // We use this to keep track if all of the files have been added to the zip file.
                    for (var i = 0; i < files.length; i++) {
                        trackingArray.push(files[i].name);
                    }

                    console.log('In bwAttachments.js.cmdDisplayMultiFileUploadDialog.button.click(). PREPARING TO ZIP THESE FILES AND UPLOAD TO THE SERVER: ' + JSON.stringify(trackingArray));

                    for (var i = 0; i < files.length; i++) {

                        var file = files[i];
                        var reader = new FileReader();
                        reader.fileName = files[i].name; // This passes the filename so that scoping of this variable doesn't cause incorrect values... it's async.

                        reader.onload = function (event) {
                            try {

                                var fileBuffer = new Uint8Array(event.target.result);
                                var fileName = event.target.fileName; // This passes the filename so that scoping of this variable doesn't cause incorrect values... it's async.

                                zip.addEntry(fileName, fileBuffer);

                                for (var j = 0; j < trackingArray.length; j++) {
                                    if (fileName == trackingArray[j]) {
                                        trackingArray.splice(j, 1); // We have added this file to the zip, so remove the entry from the tracking array.
                                        break;
                                    }
                                }

                                if (trackingArray.length == 0) {
                                    var zipFile = zip.finish(); // finish(): Int8Array
                                    //uploadZipFile(zipFile, archiveFileName, bwBudgetRequestId);

                                    HideActivitySpinner();

                                    var file = new File([zipFile], { type: "octet/stream" });
                                    file.name = archiveFileName;
                                    zip.delete();

                                    thiz.performUpload2(file, archiveFileName, bwBudgetRequestId, null, false); // data: Int8Array >>> convert to input type="file" element....

                                }

                            } catch (e) {
                                console.log('Exception in bwAttachments.js.cmdDisplayMultiFileUploadDialog.CompressAndUploadImages(): ' + e.message + ', ' + e.stack);
                                displayAlertDialog('Exception in bwAttachments.js.cmdDisplayMultiFileUploadDialog.CompressAndUploadImages(): ' + e.message + ', ' + e.stack);
                                alert('Exception in bwAttachments.js.cmdDisplayMultiFileUploadDialog.CompressAndUploadImages(): ' + e.message + ', ' + e.stack);
                            }
                        };

                        reader.readAsArrayBuffer(file);

                    }

                } catch (e) {
                    alert('Exception in bwAttachments.js.cmdDisplayMultiFileUploadDialog.CompressAndUploadImages(): ' + e.message + ', ' + e.stack);
                    console.log('Exception in bwAttachments.js.cmdDisplayMultiFileUploadDialog.CompressAndUploadImages(): ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in bwAttachments.js.cmdDisplayMultiFileUploadDialog.CompressAndUploadImages(): ' + e.message + ', ' + e.stack);
                }
            }

            var UploadMultipleFiles = async function (files) {
                try {
                    ShowActivitySpinner('Uploading...');

                    for (var i = 0; i < files.length; i++) {

                        var file = files[i];

                        await thiz.performUpload3(file, file.name, bwBudgetRequestId, null, false);

                    }

                } catch (e) {
                    alert('Exception in bwAttachments.js.cmdDisplayMultiFileUploadDialog.UploadMultipleFiles(): ' + e.message + ', ' + e.stack);
                    console.log('Exception in bwAttachments.js.cmdDisplayMultiFileUploadDialog.UploadMultipleFiles(): ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in bwAttachments.js.cmdDisplayMultiFileUploadDialog.UploadMultipleFiles(): ' + e.message + ', ' + e.stack);
                }
            }

            var thereAreVideoFiles = false;
            for (var i = 0; i < files.length; i++) {

                var filename = files[i].name;
                var extensionIndex = filename.split('.').length - 1;
                var fileExtension = filename.toLowerCase().split('.')[extensionIndex];

                if (fileExtension == 'mp4' || fileExtension == 'avi' || fileExtension == 'vob' || fileExtension == 'mov' || fileExtension == 'wmv' || fileExtension == 'mkv' || fileExtension == 'webm' || fileExtension == 'avchd' || fileExtension == '3gp' || fileExtension == '3g2' || fileExtension == 'ogv' || fileExtension == 'm4v') {

                    thereAreVideoFiles = true;

                }

            }

            if (thereAreVideoFiles == false) {

                //
                // There are no video files, so we aren't going to prompt the user... just start the file copy immediately.
                //

                console.log('XXXX>>>>> There are no video files, so we arent going to prompt the user...just start the file copy immediately.');

                if (!(files && files.length)) {

                    alert('xcx3124 Fatal error in bwAttachments.js.cmdDisplayMultiFileUploadDialog(). NO FILES. files.length: ' + files.length); // FOR ELEMENT xcx12345364-2 [' + 'inputFile_' + bwBudgetRequestId + '].')

                } else {

                    var videoFileArray = [];
                    var imageFileArray = [];
                    var otherFileArray = [];
                    for (var i = 0; i < files.length; i++) {

                        var filename = files[i].name;
                        var extensionIndex = filename.split('.').length - 1;
                        var fileExtension = filename.toLowerCase().split('.')[extensionIndex];

                        if (fileExtension == 'mp4' || fileExtension == 'avi' || fileExtension == 'vob' || fileExtension == 'mov' || fileExtension == 'wmv' || fileExtension == 'mkv' || fileExtension == 'webm' || fileExtension == 'avchd' || fileExtension == '3gp' || fileExtension == '3g2' || fileExtension == 'ogv' || fileExtension == 'm4v') {

                            videoFileArray.push(files[i]);

                        } else if (fileExtension == 'png' || fileExtension == 'jpg' || fileExtension == 'jpeg' || fileExtension == 'jfif' || fileExtension == 'webp' || fileExtension == 'gif' || fileExtension == 'bmp') {

                            imageFileArray.push(files[i]);

                        } else {

                            otherFileArray.push(files[i]);

                        }

                    }

                    $('#divConfirmFileUploadDialog_MultiFile_' + bwBudgetRequestId).dialog('close'); // Close the dialog window.

                    if (imageFileArray && imageFileArray.length && (imageFileArray.length > 0)) {

                        CompressAndUploadImages(imageFileArray);

                    }

                    if (videoFileArray && videoFileArray.length && (videoFileArray.length > 0)) {

                        ConvertAndUploadVideoFiles(videoFileArray);

                    }

                    if (otherFileArray && otherFileArray.length && (otherFileArray.length > 0)) {

                        UploadMultipleFiles(otherFileArray);

                    }

                }

            } else {

                HideActivitySpinner();

                var div = document.getElementById(dialogId);
                if (!div) {
                    div = document.createElement('div');
                    div.id = dialogId;
                    div.style.display = 'none';
                    document.body.appendChild(div); // Place at end of document
                }
                var html = '';
                //html += '<div style="display:none;" id="' + dialogId + '">';
                html += '   <table style="width:100%;">';
                html += '       <tr>';
                html += '           <td style="width:90%;">';
                html += '               <span id="spanConfirmFileUploadDialogTitle" style="color: #3f3f3f;font-size: 60pt;font-weight:bold;">';

                if (files.length > 1) {
                    html += '                   Upload files';
                } else {
                    html += '                   Upload file';
                }

                html += '               </span>';
                html += '           </td>';
                html += '           <td style="width:9%;"></td>';
                html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
                html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 120pt;font-weight:bold;" onclick="$(\'.bwAttachments\').bwAttachments(\'CloseDialog_btnCancelUploadTheFileNow\', \'' + bwBudgetRequestId + '\', \'' + dialogId + '\');">X</span>';
                html += '           </td>';
                html += '       </tr>';
                html += '   </table>';
                html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';

                html += '<div id="tempIdForTheUpdateMessageOnTheMultiFileDialog">';
                html += '   <span style="font-style:italic;color:gray;font-size:15pt;">You have selected multiple files. (' + files.length + ')</span>';
                html += '</div>';
                html += '<br />';
                html += '<div style="font-weight:bold;color:tomato;" xcx="xcx345336777">';
                html += 'NOTE: Large videos may not play/work in this location until published to an EXTERNAL LOCATION. I recommend over 1GB, uploading with no processing, then publishing to an external location [Email attachments externally button on the request attachments section]. This will be addressed in the future.';
                html += '</div>';

                //html += '   <div id="FFMPEGMultiFile_ProcessFailures_Json" style="display:none;">[]</div>';
                //html += '   <div id="FFMPEGMultiFile_ProcessFailures_Text" ></div>';

                //html += '<input id="FILE_STORAGE_FOR_UPLOAD" type="file" />';

                html += '<div id="' + dialogId + '_buttonsection">';
                html += '   <br /><br />';

                //
                //
                // Decide which upload buttons are displayed. Check if there are any video files...
                //
                //

                if (thereAreVideoFiles === true) {

                    html += '   <div id="' + dialogId + '_btnSmartUpload" class="divDialogButton" title="Click here to upload the file(s).">';
                    html += '       Upload (processing video)';
                    html += '   </div>';
                    html += '   <br /><br />';
                    html += '   <div id="' + dialogId + '_btnUploadNoProcessing" class="divDialogButton" title="Click here to upload the file(s).">';
                    html += '       Upload (no processing)';
                    html += '   </div>';

                } else {

                    html += '   <div id="' + dialogId + '_btnSmartUpload" class="divDialogButton" title="Click here to upload the file(s).">';
                    html += '       Upload';
                    html += '   </div>';

                }

                //html += '   <hr />';

                //html += '   <br />';
                //html += '   <div style="font-style:italic;color:gray;font-size:15pt;text-align:center;">Convert each file to .mp4 and upload.</div>';
                //html += '   <div id="' + dialogId + '_ffmpegMultiFileConvertAndUpload" class="divDialogButton" title="Click here to initialize ffmpeg.wasm....">';
                //html += '       CONVERT and UPLOAD<br />[Ideal for desktop computer]';
                //html += '   </div>';
                //html += '   <br />';

                ////html += '   <hr />';

                ////html += '   <br />';
                ////html += '   <div style="font-style:italic;color:gray;font-size:15pt;text-align:center;">Merge them consecutively, with optional filename overlay.<br />This produces a single .mp4 file.</div>';
                ////html += '   <div id="' + dialogId + '_ffmpegMultiFileMergeAndUpload" class="divDialogButton" title="Click here to initialize ffmpeg.wasm...." >'; // onclick="$(\'bwAttachments\').bwAttachments(\'ffmpegMultiFileMergeAndUpload\', bwBudgetRequestId, files);">';
                ////html += '       MERGE and UPLOAD...?<br />[In Development/Experimental]';
                ////html += '   </div>';
                ////html += '   <br />';

                //html += '   <hr />';

                //html += '   <br />';
                //html += '   <div style="font-style:italic;color:gray;font-size:15pt;text-align:center;">Upload the files as they are.<br />We don\'t recommend uploading .avi files unless you have a specific purpose for them.</div>';
                //html += '   <div id="' + dialogId + '_btnInitializeZipWasm" class="divDialogButton" title="Click here to initialize ffmpeg.wasm....">';
                //html += '       ZIP and UPLOAD<br />[only good for images]';
                //html += '   </div>';

                //html += '   <br /><br />';
                //html += '   <div id="' + dialogId + '_btnUploadTheFileNow" class="divDialogButton" title="Click here to upload the attachment.">';
                //html += '       Upload<br />[Ideal for a mobile device]';
                //html += '   </div>';

                html += '   <br /><br />';
                //html += '   <div id="btnCancelUploadTheFileNow" class="divDialogButton" onclick="$(\'#' + dialogId + '\').dialog(\'close\');">'; // CloseDialog_btnCancelUploadTheFileNow
                html += '   <div id="btnCancelUploadTheFileNow" class="divDialogButton" onclick="$(\'.bwAttachments\').bwAttachments(\'CloseDialog_btnCancelUploadTheFileNow\', \'' + bwBudgetRequestId + '\', \'' + dialogId + '\');" >';
                html += '       Close';
                html += '   </div>';

                html += '   <br /><br />';

                html += '</div>';

                div.innerHTML = html;

            }

            var FFMPEGConvertAndUploadMultipleVideoFiles_CreateAndRunBatches = async function (smallFileArray) {
                try {

                    //
                    //
                    // CREATE BATCHES UNDER 1GB WHICH WE WILL PROCESS LOCALLY ON THE CLIENT, then upload.
                    //
                    //

                    thiz.options.smallFileBatchArray = [];
                    var _batchArray = [];
                    var _totalBatchSize = 0;
                    for (var i = 0; i < smallFileArray.length; i++) {

                        _totalBatchSize += smallFileArray[i].size;
                        if (_totalBatchSize > 1000000000) { // 1000000000 = 1 billion, which is 1GB. WASM limit is 2GB, and 1GB x 2 = 2GB. This is our limit.

                            // This means we have to break out the file(s) into another batch.
                            thiz.options.smallFileBatchArray.push(_batchArray); // Save our current batch.
                            _batchArray = []; // Create a new batch.
                            _totalBatchSize = 0; // Reset our batch size to zero.
                            _batchArray.push(smallFileArray[i]); // Save our file to the new batch.

                        } else {

                            _batchArray.push(smallFileArray[i]);

                        }

                    }
                    thiz.options.smallFileBatchArray.push(_batchArray); // Make sure we get the last batch.

                    for (var i = 0; i < thiz.options.smallFileBatchArray.length; i++) {

                        var tmpAmountRemaining = 0;
                        for (var j = i; j < thiz.options.smallFileBatchArray.length; j++) {
                            for (var k = 0; k < thiz.options.smallFileBatchArray[j].length; k++) {
                                tmpAmountRemaining += thiz.options.smallFileBatchArray[j][k].size;
                            }
                        }
                        var amountRemaining = Number(tmpAmountRemaining / 1000000000).toFixed(2);

                        thiz.options.ActivitySpinner_FileUpload_ProgressBar_StatusText = 'Converting batch ' + String(i + 1) + ' of ' + thiz.options.smallFileBatchArray.length + '. Approximately ' + amountRemaining + 'GB of ' + thiz.options.smallFileArray_TotalSize + 'GB remaining...';

                        await thiz.FFMPEGConvertAndUploadMultipleVideoFiles_Batch(i, bwBudgetRequestId, dialogId);

                        console.log('');
                        console.log('**********');
                        console.log('**********');
                        console.log('THIS BATCH HAS COMPLETED CONVERSION. It will continue uploading while the next batch starts processing.');
                        console.log('**********');
                        console.log('**********');
                        console.log('');

                    }

                } catch (e) {
                    console.log('Exception in bwAttachments.js.cmdDisplayMultiFileUploadDialog.FFMPEGConvertAndUploadMultipleVideoFiles_CreateAndRunBatches(): ' + e.message + ', ' + e.stack);
                    alert('Exception in bwAttachments.js.cmdDisplayMultiFileUploadDialog.FFMPEGConvertAndUploadMultipleVideoFiles_CreateAndRunBatches(): ' + e.message + ', ' + e.stack);
                }
            }

            var ConvertAndUploadVideoFiles = function (files) {
                try {
                    //
                    //
                    // First we have to determine if we have any files over 1GB. If so, we will upload those for processing on the server. The small ones we use FFMPEG WASM on the client: largeFileArray, smallFileArray.
                    //
                    //

                    var largeFileArray = [];
                    var smallFileArray = [];
                    for (var i = 0; i < files.length; i++) {
                        //if (files[i].size > 759480000) { // 759480000 = .76GB. WASM limit is 2GB, and 1GB x 2 = 2GB. This is our limit. We have some buffer here, established from a test file which crashes at this limit. 11-23-2023.
                        if (files[i].size > 759480000) { // 759480000 = .76GB. WASM limit is 2GB, and 1GB x 2 = 2GB. This is our limit. We have some buffer here, established from a test file which crashes at this limit. 11-23-2023.


                            //if (files[i].size > 7594800000) { // 759480000 = .76GB. WASM limit is 2GB, and 1GB x 2 = 2GB. This is our limit. We have some buffer here, established from a test file which crashes at this limit. 11-23-2023.
                            //if (files[i].size > 1000000000) { // 1000000000 = 1 billion, which is 1GB. WASM limit is 2GB, and 1GB x 2 = 2GB. This is our limit.
                            //if (files[i].size > 5000000000) { // 5000000000 = 5 billion, which is 5GB. WASM limit is 2GB, and 1GB x 2 = 2GB. This is our limit. <<< TESTING 11-23-2023.
                            largeFileArray.push(files[i]);
                        } else {
                            smallFileArray.push(files[i]);
                        }
                    }

                    //
                    // Sort the smallFileArray from largest to smallest (descending). I want all the large files to upload first.
                    //
                    largeFileArray.sort(function (a, b) {
                        if (a.size < b.size) { return 1; }
                        if (a.size > b.size) { return -1; }
                        return 0;
                    });
                    smallFileArray.sort(function (a, b) {
                        if (a.size < b.size) { return 1; }
                        if (a.size > b.size) { return -1; }
                        return 0;
                    });

                    //
                    // Store the sizes so we can display them on the progress bar.
                    //
                    var smallFileArray_TotalSize = 0;
                    for (var i = 0; i < smallFileArray.length; i++) {
                        smallFileArray_TotalSize += smallFileArray[i].size;
                    }
                    thiz.options.smallFileArray_TotalSize = Number(smallFileArray_TotalSize / 1000000000).toFixed(2);

                    if (largeFileArray.length > 0) {

                        if (largeFileArray.length > 1) {
                            thiz.options.ActivitySpinner_FileUpload_ProgressBar_StatusText = 'There are ' + largeFileArray.length + ' files which are too large to process locally, and will be uploaded to the server for processing. Doing this first. The progress indicator is not exact and stalls, more work to be done. This may take a while!';
                        } else if (largeFileArray.length > 0) {
                            thiz.options.ActivitySpinner_FileUpload_ProgressBar_StatusText = 'There is ' + largeFileArray.length + ' file which is too large to process locally, and will be uploaded to the server for processing. Doing this first. The progress indicator is not exact and stalls, more work to be done. This may take a while!';
                        }

                        var promiseArray = [];
                        for (var i = 0; i < largeFileArray.length; i++) {
                            var promise = thiz.performUpload3(largeFileArray[i], largeFileArray[i].name, bwBudgetRequestId, null, false);
                            promiseArray.push(promise);
                        }
                        Promise.all(promiseArray).then(function (results) {
                            try {

                                FFMPEGConvertAndUploadMultipleVideoFiles_CreateAndRunBatches(smallFileArray);

                            } catch (e) {
                                console.log('In bwAttachments.js.cmdDisplayMultiFileUploadDialog.promise.all.catch():1: ' + e.message + ', ' + e.stack);
                                alert('In bwAttachments.js.cmdDisplayMultiFileUploadDialog.promise.all.catch():1: ' + e.message + ', ' + e.stack);
                            }

                        }).catch(function (e) {

                            console.log('In bwAttachments.js.cmdDisplayMultiFileUploadDialog.promise.all.catch(). e: ' + JSON.stringify(e));
                            displayAlertDialog('In bwAttachments.js.cmdDisplayMultiFileUploadDialog.promise.all.catch(). e: ' + JSON.stringify(e));

                        });

                    } else {

                        FFMPEGConvertAndUploadMultipleVideoFiles_CreateAndRunBatches(smallFileArray);

                    }

                } catch (e) {
                    alert('Exception in bwAttachments.js.cmdDisplayMultiFileUploadDialog.ConvertAndUploadVideoFiles(): ' + e.message + ', ' + e.stack);
                    console.log('Exception in bwAttachments.js.cmdDisplayMultiFileUploadDialog.ConvertAndUploadVideoFiles(): ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in bwAttachments.js.cmdDisplayMultiFileUploadDialog.ConvertAndUploadVideoFiles(): ' + e.message + ', ' + e.stack);
                }
            }

            //
            // Smart Upload.
            //
            $('#' + dialogId + '_btnSmartUpload').off('click').click(function (error) {
                try {
                    debugger;

                    //var x = document.getElementById('FILE_STORAGE_FOR_UPLOAD');
                    //var files = x.files;

                    if (!(files && files.length)) {

                        alert('xcx3124 Fatal error in bwAttachments.js.cmdDisplayMultiFileUploadDialog._btnSmartUpload(). NO FILES. files.length: ' + files.length); // FOR ELEMENT xcx12345364-2 [' + 'inputFile_' + bwBudgetRequestId + '].')

                    } else {

                        var videoFileArray = [];
                        var imageFileArray = [];
                        var otherFileArray = [];
                        for (var i = 0; i < files.length; i++) {

                            var filename = files[i].name;
                            var extensionIndex = filename.split('.').length - 1;
                            var fileExtension = filename.toLowerCase().split('.')[extensionIndex];

                            if (fileExtension == 'mp4' || fileExtension == 'avi' || fileExtension == 'vob' || fileExtension == 'mov' || fileExtension == 'wmv' || fileExtension == 'mkv' || fileExtension == 'webm' || fileExtension == 'avchd' || fileExtension == '3gp' || fileExtension == '3g2' || fileExtension == 'ogv' || fileExtension == 'm4v') {

                                videoFileArray.push(files[i]);

                            } else if (fileExtension == 'png' || fileExtension == 'jpg' || fileExtension == 'jpeg' || fileExtension == 'jfif' || fileExtension == 'webp' || fileExtension == 'gif' || fileExtension == 'bmp') {

                                imageFileArray.push(files[i]);

                            } else {

                                otherFileArray.push(files[i]);

                            }

                        }

                        $('#divConfirmFileUploadDialog_MultiFile_' + bwBudgetRequestId).dialog('close'); // Close the dialog window.

                        if (imageFileArray && imageFileArray.length && (imageFileArray.length > 0)) {

                            CompressAndUploadImages(imageFileArray);

                        }

                        if (videoFileArray && videoFileArray.length && (videoFileArray.length > 0)) {

                            ConvertAndUploadVideoFiles(videoFileArray);

                        }

                        if (otherFileArray && otherFileArray.length && (otherFileArray.length > 0)) {

                            UploadMultipleFiles(otherFileArray);

                        }

                    }

                } catch (e) {
                    console.log('Exception in bwAttachments.js._btnSmartUpload.button.click(): ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in bwAttachments.js._btnSmartUpload.button.click(): ' + e.message + ', ' + e.stack);
                    alert('Exception in bwAttachments.js._btnSmartUpload.button.click(): ' + e.message + ', ' + e.stack);
                }
            });

            $('#' + dialogId + '_btnUploadNoProcessing').off('click').click(function (error) {
                try {

                    if (!(files && files.length)) {

                        alert('xcx3124 Fatal error in bwAttachments.js.cmdDisplayMultiFileUploadDialog._btnUploadNoProcessing(). NO FILES FOR ELEMENT xcx12345364-2 [' + 'inputFile_' + bwBudgetRequestId + '].')

                    } else {

                        var imageFileArray = [];
                        var otherFileArray = [];
                        for (var i = 0; i < files.length; i++) {

                            var filename = files[i].name;
                            var extensionIndex = filename.split('.').length - 1;
                            var fileExtension = filename.toLowerCase().split('.')[extensionIndex];

                            if (fileExtension == 'png' || fileExtension == 'jpg' || fileExtension == 'jpeg' || fileExtension == 'jfif' || fileExtension == 'webp' || fileExtension == 'gif' || fileExtension == 'bmp') {

                                imageFileArray.push(files[i]);

                            } else {

                                otherFileArray.push(files[i]);

                            }

                        }

                        $('#divConfirmFileUploadDialog_MultiFile_' + bwBudgetRequestId).dialog('close'); // Close the dialog window.

                        if (imageFileArray && imageFileArray.length && (imageFileArray.length > 0)) {

                            CompressAndUploadImages(imageFileArray);

                        }

                        if (otherFileArray && otherFileArray.length && (otherFileArray.length > 0)) {

                            UploadMultipleFiles(otherFileArray);

                        }

                    }

                } catch (e) {
                    console.log('Exception in bwAttachments.js._btnUploadNoProcessing.button.click(): ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in bwAttachments.js._btnUploadNoProcessing.button.click(): ' + e.message + ', ' + e.stack);
                    alert('Exception in bwAttachments.js._btnUploadNoProcessing.button.click(): ' + e.message + ', ' + e.stack);
                }
            });

            $('#' + dialogId).dialog({
                modal: true,
                resizable: false,
                closeText: "Cancel",
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                width: "720px",
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                position: {
                    my: "middle top+12",
                    at: "middle top",
                    of: window
                },
                // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.
                close: function () {
                    try {

                        $(this).dialog('destroy'); // 7-5-2020 THIS IS THE PREFFERED SYNTAX FOR THIS FROM NOW ON!!!!!!!!!!!!!!!!!!!!!!!!!!!! REPLACE EVERYWHERE AND TEST!!!!!!!!!!

                        $(dialogId).remove();

                    } catch (e) {
                        console.log('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.close(): ' + e.message + ', ' + e.stack);
                        alert('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.close(): ' + e.message + ', ' + e.stack);
                    }
                },
                open: function (event, ui) {
                    try {
                        $('.ui-widget-overlay').bind('click', function () {
                            $('#' + dialogId).dialog('close');
                        });


                        console.log('>>>>>>>>>>>>>>>>In $(' + dialogId + 'dialogId).dialog.open().');
                        //alert('>>>>>>>>>>>>>>>>In $(' + dialogId + 'dialogId).dialog.open().');

                        // 1-24-2020 ToDo: Display the image prior to uploading!
                        //var x = document.getElementById('inputFile_' + bwBudgetRequestId); // This element is on the request form with the "Choose File" button, not the attachments dialog.
                        //var x = $('#divConfirmFileUploadDialog_ForAttachments').find('#inputFile_' + bwBudgetRequestId)[0];
                        //var file = x.files[0];

                        //alert('xcx2312312 is it right to only expect 1 file here?');
                        //debugger; // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                        //var file = files[0]; //.file; // files[0];

                        //var uploadButton = $('#' + dialogId + '_btnUploadTheFileNow');
                        //if (!uploadButton) {

                        //    alert('xcx214252523 Error: Could not locate element [' + dialogId + '_btnUploadTheFileNow' + '] to attach upload button event...');

                        //} else {

                        //    //alert('xcx214231 THIS SHOULD ONLY BE 1. uploadButton.length: ' + $(uploadButton).length);


                        //    $(this).ready(function () {

                        //        //alert('Dialog is ready(), attaching events to elements.');
                        //        console.log('Dialog is ready(). xcx234 adding click event for element: ' + dialogId + '_btnUploadTheFileNow');


                        //        ////$('#' + dialogId + '_btnUploadTheFileNow').off('click').click(function () { // divConfirmFileUploadDialog_ForAttachments_78ebbdca-32d7-4019-9c53-cdc55e11a775_btnUploadTheFileNow
                        //        //$('#' + dialogId + '_btnUploadTheFileNow').off('click').click(function () { // divConfirmFileUploadDialog_ForAttachments_78ebbdca-32d7-4019-9c53-cdc55e11a775_btnUploadTheFileNow
                        //        //    //$(document).on('click', dialogId + '_btnUploadTheFileNow', function () {
                        //        //    //document.getElementById(dialogId + '_btnUploadTheFileNow').addEventListener('click', function () { // divConfirmFileUploadDialog_ForAttachments_5407bd5e-f00e-4e97-9f56-d1c9a86723c2_btnUploadTheFileNow

                        //        //    alert('xcx999994-2. In bwAttachments.js.UploadButton_OnClick(). displayAttachmentsTagName: ' + displayAttachmentsTagName + ', bwBudgetRequestId: ' + bwBudgetRequestId);

                        //        //    try {
                        //        //        console.log('In bwAttachments.js.UploadButton_OnClick(). displayAttachmentsTagName: ' + displayAttachmentsTagName + ', bwBudgetRequestId: ' + bwBudgetRequestId);
                        //        //        //alert('In bwAttachments.js.UploadButton_OnClick(). displayAttachmentsTagName: ' + displayAttachmentsTagName + ', bwBudgetRequestId: ' + bwBudgetRequestId);

                        //        //        // Check if the user specified a new filename. If so, make sure the file extension is the same!
                        //        //        var originalFilename = file.name;
                        //        //        var filename = file.name;
                        //        //        //debugger;
                        //        //        //var filenameElement = $(this.element).find('#txtConfirmFileUploadDialogFilename'); // removed 8-5-2022
                        //        //        var filenameElement = $('#' + dialogId).find('#txtConfirmFileUploadDialogFilename')[0];
                        //        //        if (filenameElement && filenameElement.value && filenameElement.value.trim().length > 1) {
                        //        //            filename = filenameElement.value.trim().split('.')[0] + '.' + originalFilename.split('.')[1]; // Put the same extension on it.
                        //        //        }

                        //        //        //alert('xcx425 filename: ' + filename + ', dialogId: ' + dialogId);



                        //        //        //var newfilename;
                        //        //        //var filenameElement = $('#' + dialogId).find('#txtConfirmFileUploadDialogFilename');
                        //        //        //if (filenameElement && filenameElement.value && filenameElement.value.trim().length > 1) {
                        //        //        //    newfilename = filenameElement.value.trim().split('.')[0] + '.' + originalFilename.split('.')[1]; // Put the same extension on it.
                        //        //        //}

                        //        //        //var newfilename = $('#' + dialogId).find('#txtConfirmFileUploadDialogFilename').val(); // divConfirmFileUploadDialog_ForAttachments_f437a8b6-ce77-45ac-a3ca-ed3568cae536.find txtConfirmFileUploadDialogFilename

                        //        //        $('#' + dialogId).dialog('close');

                        //        //        //$("#divWorkingOnItDialog").dialog({
                        //        //        //    modal: true,
                        //        //        //    resizable: false,
                        //        //        //    closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                        //        //        //    title: 'Working on it...',
                        //        //        //    width: "800",
                        //        //        //    dialogClass: "no-close", // No close button in the upper right corner.
                        //        //        //    hide: false//, // This means when hiding just disappear with no effects.
                        //        //        //});
                        //        //        //$("#divWorkingOnItDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();



                        //        //        thiz.processUpload(displayAttachmentsTagName, bwBudgetRequestId, file, filename);

                        //        //    } catch (e) {
                        //        //        console.log('Exception in bwAttachments.js.btnUploadTheFileNow.click(): ' + e.message + ', ' + e.stack);
                        //        //        alert('Exception in bwAttachments.js.btnUploadTheFileNow.click(): ' + e.message + ', ' + e.stack);
                        //        //    }
                        //        //});
                        //    });

                        //}

                        //$('#btnCancelUploadTheFileNow').off('click').click(function () {
                        //    try {
                        //        //$(this).dialog("close");

                        //        //$('#inputFile_' + bwBudgetRequestId).replaceWith($('#inputFile_' + bwBudgetRequestId).clone());
                        //        ////$(this.element).find('#inputFile').replaceWith($('#inputFile').clone()); // Clear the file upload box. May not work in all browsers doing it this way.
                        //        ////return false;
                        //    } catch (e) {
                        //        console.log('Exception in btnCancelUploadTheFileNow.click(): ' + e.message + ', ' + e.stack);
                        //        alert('Exception in btnCancelUploadTheFileNow.click(): ' + e.message + ', ' + e.stack);
                        //    }
                        //});

                        ////
                        //// First get the dimensions of the image.
                        //var _URL = window.URL || window.webkitURL;
                        //var img;
                        ////if ((file = this.files[0])) {
                        //img = new Image();
                        //var objectUrl = _URL.createObjectURL(file);
                        //img.onload = function () {
                        //    try {
                        //        //alert(this.width + " " + this.height);
                        //        _URL.revokeObjectURL(objectUrl);


                        //        //if (this.width < 400 || this.height < 400) {
                        //        //if (this.width < 50 || this.height < 50) {
                        //        //    $('#' + dialogId).dialog('close');
                        //        //    //alert('The image must be a 400px square. This image is too small.');
                        //        //    alert('The image must be a 50px square. This image is too small.3');
                        //        //} else {
                        //        // Now display it.
                        //        var reader = new FileReader();
                        //        reader.onload = function (e) {
                        //            try {
                        //                $('#' + dialogId).find('#ConfirmFileUploadDialog_ImagePreview_' + bwBudgetRequestId).attr('src', e.target.result);
                        //                $('#' + dialogId).find('#ConfirmFileUploadDialog_ImagePreview_' + bwBudgetRequestId).attr('style', 'width:400px;'); // 3-12-2022 only specify 1 dimension so that the image is not distorted. // height:400px;');
                        //            } catch (e) {
                        //                console.log('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.open.img.onload.reader.onload(): ' + e.message + ', ' + e.stack);
                        //                alert('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.open.img.onload.reader.onload(): ' + e.message + ', ' + e.stack);
                        //            }
                        //        }
                        //        reader.readAsDataURL(file);
                        //        //}
                        //    } catch (e) {
                        //        console.log('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.open.img.onload(): ' + e.message + ', ' + e.stack);
                        //        alert('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.open.img.onload(): ' + e.message + ', ' + e.stack);
                        //    }
                        //};
                        //img.src = objectUrl;

                    } catch (e) {
                        console.log('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.open(): ' + e.message + ', ' + e.stack);
                        alert('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.open(): ' + e.message + ', ' + e.stack);
                    }
                }

            });

            // Hide the title bar.
            $('#' + dialogId).dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

        } catch (e) {
            console.log('Exception in bwAttachments.js.cmdDisplayMultiFileUploadDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwAttachments.js.cmdDisplayMultiFileUploadDialog(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwAttachments.js.cmdDisplayMultiFileUploadDialog(): ' + e.message + ', ' + e.stack);
        }
    },
    performUpload2: function (outFile, fileName, bwBudgetRequestId, displayAttachmentsTagName, convertToAPdf) { // convertToAPdf means that we will attempt to put the attachment into a pdf and save it as a pdf file.
        //
        // data: Int8Array
        //
        try {
            console.log('In bwAttachments.js.performUpload2(). fileName: ' + fileName);
            //alert('In bwAttachments.js.performUpload2(). fileName: ' + fileName);
            var thiz = this;

            var largeFileUploadEnabled = $('.bwAuthentication').bwAuthentication('option', 'largeFileUploadEnabled');

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            // Description
            var dialogId = 'divConfirmFileUploadDialog_ForAttachments_' + bwBudgetRequestId;
            var description = $('#' + dialogId).find('#txtConfirmFileUploadDialogFileDescription').val();

            //var size = 0;
            //var fileElementId = 'inputFile_' + bwBudgetRequestId;
            //var fileElement = $('#' + fileElementId)[0];
            //if (fileElement && fileElement.files && fileElement.files[0] && fileElement.files[0].size) {
            //    size = fileElement.files[0].size;
            //}
            //console.log('size: ' + size + ', fileElement: ' + fileElement);

            //if (!size) {
            //    alert('xcx1234234 size: ' + size);
            //    alert('fileElement: ' + JSON.stringify(fileElement));
            //    console.log('fileElement: ' + JSON.stringify(fileElement));
            //    debugger;
            //}

            var elementId = 'uploadForm_' + bwBudgetRequestId;
            var element = $('#' + elementId)[0];
            var formData = new FormData(element);

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            if (!(formData && formData.set)) {

                alert('xcx11222233-1 UNFINISHED CODE HERE.');

                // This is for the iPad 2. 4-21-2023.
                ShowActivitySpinner_FileUpload('Uploading the file...');

                var x = document.getElementById('inputFile_' + bwBudgetRequestId); // This element is on the request form with the "Choose File" button, not the attachments dialog.
                //var file = x.files[0]; // Disabled this, we are now using the file passed to this function.

                var reader = new FileReader();
                reader.onload = function (event) {
                    try {
                        var fileData = '';
                        var buffer = event.target.result;
                        var byteArray = new Uint8Array(buffer);
                        for (var i = 0; i < byteArray.byteLength; i++) {
                            fileData += String.fromCharCode(byteArray[i])
                        }

                        var data = [];
                        data = {
                            bwParticipantId_LoggedIn: participantId,
                            bwActiveStateIdentifier: activeStateIdentifier,
                            bwWorkflowAppId_LoggedIn: workflowAppId,

                            bwWorkflowAppId: workflowAppId,
                            bwBudgetRequestId: bwBudgetRequestId,
                            Filename: fileName,
                            FileContent: fileData,
                            Description: description,
                            ConvertToAPdf: convertToAPdf,

                            bwParticipantId: participantId,
                            bwParticipantEmail: participantEmail,
                            bwParticipantFriendlyName: participantFriendlyName
                        };

                        var operationUri = thiz.options.operationUriPrefix + '_files/' + 'uploadattachment'; // _files allows us to use nginx to route these to a dedicated file server.
                        $.ajax({
                            url: operationUri,
                            type: 'PUT',
                            data: data,
                            headers: { "Accept": "application/json; odata=verbose" },
                            timeout: 60000,
                            success: function (data) {
                                try {

                                    //displayAlertDialog_Persistent('xcx333 FormData is NOT an object with a set function!!! We need to implement the legacy upload functionality here. DID IT WORK???????? HELLO WORLD. data: ' + JSON.stringify(data));

                                    ////displayAlertDialog("Success! Your file was uploaded to SharePoint.");
                                    ////$('#divWorkingOnItDialog').dialog('close'); // Close the "Working on it..." dialog.

                                    //$('#inputFile_' + bwBudgetRequestId).replaceWith($('#inputFile_' + bwBudgetRequestId).clone());
                                    ////$(thiz.element).find('#inputFile').replaceWith($('#inputFile').clone()); // Clear the file upload box. May not work in all browsers doing it this way.
                                    ////debugger; 
                                    //thiz.populateAttachments(workflowAppId, bwBudgetRequestId, 'newrequestattachments', true); //'attachments'); // This lists the attachments in the <p> tag with id='attachments'.



                                    console.log('');
                                    console.log('POST success workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId);
                                    console.log('');


                                    //
                                    // When we get here, the file has been 100% uploaded onto the file services server. 9-8-2022
                                    //
                                    HideActivitySpinner_FileUpload(); // 9-8-2022




                                    // This resets the file input for uploading, so the onchange/change event fires as expected.
                                    console.log('In bwAttachments.js.xx(). This resets the file input for uploading, so the onchange/change event fires as expected. xcx86984.');
                                    //alert('render bwAttachments and maybe xxxxxx');
                                    var x = $('#inputFile_' + bwBudgetRequestId)[0];
                                    //var fileList = new FileList();
                                    x.files = null; //fileList; // Clear the file upload input element.





                                    $('.bwAuthentication').bwAuthentication('checkIfWeNeedToUpdateTheHomepage', bwBudgetRequestId);

                                    //displayAlertDialog('The file has uploaded successfully.');
                                    //console.log('The file has uploaded successfully. Or has it? xcx2134124. evt: ' + JSON.stringify(evt));
                                    //console.log('The file has uploaded successfully.');

                                    //clearInterval(fileUploadTimer);
                                    //fileUploadTimer = 'stopped';
                                    //
                                    //
                                    //




                                    if (data.status == 'SUCCESS') {

                                        displayAlertDialog_QuickNotice('The file has uploaded successfully.');
                                        //displayAlertDialog('The file has uploaded successfully.');
                                        //setTimeout(function () {
                                        //    cmdCloseError();
                                        //}, 1500);

                                        console.log('Calling bwAttachments.js.populateAttachments(). xcx13124-3');
                                        alert('xcx213234-17 calling populateAttachments().');
                                        thiz.populateAttachments(workflowAppId, bwBudgetRequestId, displayAttachmentsTagName, true); // This lists the attachments in the <p> tag with id='attachments'.

                                    } else if (data.status == 'NO_REQUEST_SAVED') {

                                        console.log('xcx23235NO_REQUEST_SAVED  data.result: ' + data.result); // 9-8-2022

                                        // This means it must have been the first attachment uploaded for a new request. In this case, we will call back to the server and create the new request, so that it is not lost.
                                        console.log('xcx2143234215 This means it must have been the first attachment uploaded for a new request. <<< IS THIS TRUE???????????????????????');

                                        console.log('');
                                        console.log('xcx2143234215 This means it must have been the first attachment uploaded for a new request. In this case, we will call back to the server and create the new request, so that it is not lost. Calling bwRequest.js.saveAndPublishTheRequest().');
                                        console.log('');



                                        console.log('8-23-2022 FIXED THIS, remove this log entry once the bwAttachments.js widget works 100%. xcx1236899 bwBudgetRequestId: ' + bwBudgetRequestId);
                                        // 8-23-2022 FIX THIS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                                        //var bwRequestTypeId = $('#' + 'divPageContent1').find('#budgetrequestform')[0].getAttribute('bwrequesttypeid'); // THIS IS WRONG, WE SHOULD BE GOING THROUGH ALL THE budgetrequestform collection and matching up the bwBudgetRequestId.
                                        var budgetrequestform;
                                        var budgetrequestforms = document.getElementsByClassName('budgetrequestform');
                                        for (var i = 0; i < budgetrequestforms.length; i++) {
                                            var _budgetRequestId = $(budgetrequestforms[i])[0].getAttribute('bwbudgetrequestid');
                                            if (bwBudgetRequestId == _budgetRequestId) {
                                                // We found the form.
                                                budgetrequestform = $(budgetrequestforms[i]);
                                                break;
                                            }
                                        }
                                        if (!budgetrequestform) {

                                            displayAlertDialog('In bwAttachments.js.performUpload2(). Could not find budgetrequestform with bwBudgetRequestId: ' + bwBudgetRequestId);

                                        } else {

                                            //$('.bwRequest').bwRequest('saveAndPublishTheRequest', 'divPageContent1', true, bwBudgetRequestId, bwRequestTypeId); // This saves and publishes the New Request for the first time. 9-8-2022

                                            // 1-6-2022
                                            $('.bwRequest').bwRequest('saveAndPublishTheRequest', 'divPageContent1', true, bwBudgetRequestId, bwRequestTypeId) // This saves and publishes the New Request for the first time. 9-8-2022
                                                .then(function (results) {

                                                    if (results.status != 'SUCCESS') {

                                                        var msg = 'Error in bwAttachments.js.performUpload2(). xcx21345-1: ' + results.status + ', ' + results.message;
                                                        displayAlertDialog(msg);

                                                    } else {

                                                        console.log('Calling bwAttachments.js.populateAttachments(). xcx13124-4');
                                                        alert('xcx213234-16 calling populateAttachments().');
                                                        thiz.populateAttachments(workflowAppId, bwBudgetRequestId, displayAttachmentsTagName, true); // This lists the attachments in the <p> tag with id='attachments'.

                                                    }

                                                }).catch(function (e) {

                                                    console.log('Calling bwAttachments.js.populateAttachments(). xcx13124-5');
                                                    alert('xcx213234-15 calling populateAttachments().');
                                                    thiz.populateAttachments(workflowAppId, bwBudgetRequestId, displayAttachmentsTagName, true); // This lists the attachments in the <p> tag with id='attachments'.
                                                    console.log('Exception from Promise in bwAttachments.js.performUpload2(). xcx21345-2: ' + JSON.stringify(e));

                                                });

                                        }

                                    } else if (data.status == 'ERROR') {

                                        if (data.message.indexOf('gmError: Error: Command failed: identify-im6.q16: no decode delegate for this image format `M4A') > -1) {

                                            // In this case, for uploaded M4A files, return success, because it has uploaded successfully.... and the "File Conversion Timer" will pick it up and convert it to a mp3 file.
                                            var msg = 'The file has uploaded successfully. It will be converted and available as a .mp3 file shortly.';
                                            displayAlertDialog(msg);

                                            console.log('Calling bwAttachments.js.populateAttachments(). xcx13124-6');
                                            alert('xcx213234-14 calling populateAttachments().');
                                            thiz.populateAttachments(workflowAppId, bwBudgetRequestId, displayAttachmentsTagName, true); // This lists the attachments in the <p> tag with id='attachments'.

                                        } else {

                                            var msg = data.status + ' in bwAttachments.js.performUpload2() xcx02856-1: ' + data.message;
                                            console.log(msg);
                                            displayAlertDialog(msg);

                                        }

                                    } else if (data.status == 'EXCEPTION') {

                                        var msg = data.status + ' in bwAttachments.js.performUpload2() xcx02856-2-1: ' + data.message;
                                        console.log(msg);
                                        displayAlertDialog(msg);

                                    } else {

                                        //$('.bwAttachments').bwAttachments('renderAndPopulateAttachments'); // displayAttachmentsTagName
                                        alert('xcx2131234-3 Unexpected response. data: ' + JSON.stringify(data));

                                        displayAlertDialog(data.message);
                                    }

                                } catch (e) {
                                    console.log('Exception in performUpload2():2: ' + e.message + ', ' + e.stack);
                                    displayAlertDialog('Exception in performUpload2():2: ' + e.message + ', ' + e.stack);
                                    $(this.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwAttachments.performUpload2:2: ' + e.message + ', ' + e.stack;
                                }
                            },
                            error: function (data, errorCode, errorMessage) {
                                $('#divWorkingOnItDialog').dialog('close'); // Close the "Working on it..." dialog.
                                console.log('Error in performUpload2(): ' + errorMessage);
                                debugger;
                                if (errorMessage == 'timeout') {
                                    displayAlertDialog('The file server could not be contacted. Please try again in a few minutes.');
                                } else {
                                    displayAlertDialog('Error in performUpload2(): ' + errorMessage);
                                }
                            }
                        });
                    } catch (e) {

                        console.log('Exception in performUpload2():2:xcx3243246 ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in performUpload2():2:xcx3243246 ' + e.message + ', ' + e.stack);
                        $(this.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwAttachments.performUpload2:2: ' + e.message + ', ' + e.stack;

                    }
                };
                reader.readAsArrayBuffer(outFile); // This works for text. 





            } else {

                ShowActivitySpinner('Attempting login...');

                var userEmailAddress = localStorage['customlogonusername'];
                var userPassword = localStorage['customlogonpassword'];

                data = {
                    userEmailAddress: userEmailAddress,
                    userPassword: userPassword
                };

                var operationUri = thiz.options.operationUriPrefix + '_bw/bwworkflow/usercustomlogon';
                $.ajax({
                    url: operationUri,
                    type: "POST",
                    data: data,
                    timeout: 15000,
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    },
                    success: function (data) {
                        try {
                            HideActivitySpinner();
                            //debugger;
                            //displayAlertDialog(data);

                            if (data.message != 'The password is correct') {
                                if (data.message == 'USER_DOES_NOT_EXIST') { // xcx122134-1
                                    // Since the user doesn't exist, display the "Create new user" dialog.

                                    //$('.bwCircleDialog').bwCircleDialog('displayCustomSignInWithInvitationDialog', true, 'toddtest');
                                    //document.getElementById('spanCustomSignUpDialogInvitationDescriptionText').innerHTML = 'toddtest22';
                                    displayAlertDialog(data.message);
                                } else {
                                    if (data.message) {
                                        displayAlertDialog(data.message);
                                    } else {
                                        displayAlertDialog(data);
                                    }
                                }
                            } else {

                                // localstorage!
                                //if (localStorage) {
                                //    localStorage['customlogonusername'] = userEmailAddress;
                                //    localStorage['customlogonpassword'] = userPassword;
                                //}

                                if (!(data.TwoFactorAuthenticationWithSms && (data.TwoFactorAuthenticationWithSms == 'NOT_ENABLED'))) {

                                    //
                                    // Two Factor Authentication.
                                    //

                                    alert('Two Factor Authentication is turned on. This process cannot be completed at this time.');

                                    //if (data.TwoFactorAuthenticationWithSms && data.TwoFactorAuthenticationWithSms == 'SUCCEEDED_SENDING_SMS') {
                                    //    // Display the circle dialog for this, and send a code via SMS. 9-2-2021
                                    //    //alert('data.bwTwoFactorAuthenticationSmsNumber: ' + data.bwTwoFactorAuthenticationSmsNumber);
                                    //    $('.bwCircleDialog').bwCircleDialog('displaySignInWithSMSCodeDialog', true, null, data.bwTwoFactorAuthenticationSmsNumber);


                                    //} else if (data.TwoFactorAuthenticationWithSms && data.TwoFactorAuthenticationWithSms == 'FAILED_SENDING_SMS') {

                                    //    alert('SMS/text messaging failed: ' + data.SmsFailureMessage + '. Turning off "Two factor authentication using SMS/Text Messaging" until the issue is resolved. Please click the "Sign In" button again in order to login.');
                                    //    // 12-25-2021
                                    //    debugger; // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                                    //    var bwParticipantId = data.bwParticipantId;
                                    //    thiz.configurationBehaviorTwoFactorAuthenticationWithSmsTextMessagingSlider_Onchange(false, bwParticipantId);

                                    //} else {
                                    //    // Unexpected response.
                                    //    alert('SMS/text messaging failed. Unexpected response: ' + data.TwoFactorAuthenticationWithSms);
                                    //}

                                } else {



                                    debugger; // Get the values to fill in the form below. 1

                                    var bwBudgetRequestId = '';

                                    var workflowAppId = data.bwLastSelectedWorkflowAppId;
                                    var participantId = data.participantId;
                                    var participantEmail = data.participantEmail;
                                    var participantFriendlyName = data.participantFriendlyName;
                                    var activeStateIdentifier = JSON.stringify({
                                        ActiveStateIdentifier: data.bwActiveStateIdentifier, status: 'SUCCESS' // We need this for a subsequent step. 
                                    });

                                    debugger;

                                    console.log('In bwAttachments.js.performUpload2(). formData is an object with a set function.');

                                    // It is important to prepend these values, so that they get read immediately and not be undefined in the web service.
                                    formData.set('bwWorkflowAppId', workflowAppId);
                                    formData.set('bwBudgetRequestId', bwBudgetRequestId);
                                    formData.set('bwParticipantId', participantId);
                                    formData.set('bwParticipantEmail', participantEmail);
                                    formData.set('bwParticipantFriendlyName', participantFriendlyName);
                                    formData.set('bwActiveStateIdentifier', activeStateIdentifier);
                                    formData.set('Filename', fileName);
                                    formData.set('Description', description);
                                    formData.set('ConvertToAPdf', convertToAPdf);

                                    //
                                    // Timer to monitor how the upload is going. If it stalls, then checking xhr.readyState.
                                    //
                                    var xhr; // This is the XMLHttpRequest object.
                                    var xhrAbortMessage;
                                    var percentComplete = 0;
                                    var percentComplete_LastValue = 0;
                                    var fileUploadTimer = 'stopped';
                                    var fileUploadTimer_Interval = 1800000; // 30 minutes. Anything shorter for a large file gets cancelled.

                                    fileUploadTimer = setInterval(function () {

                                        if (percentComplete == percentComplete_LastValue) {
                                            // This is a problem. The upload has stalled.
                                            xhrAbortMessage = 'The file upload has stalled for ' + String(Number(fileUploadTimer_Interval) / 1000) + ' seconds. The upload has been cancelled. Unknown error. xcx21321499552';
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
                                    if ((largeFileUploadEnabled != true) && (outFile.size > largeFileSizeMinBytes)) {

                                        displayAlertDialog('Large file uploads are not currently enabled for this organization. This file cannot be uploaded. The limit is ' + largeFileSizeMinBytes + ' bytes, and this file size is: ' + size + ' bytes.');

                                    } else {

                                        HideActivitySpinner();

                                        ShowActivitySpinner_FileUpload('Uploading the file...');

                                        //
                                        //
                                        // WE HAVE TO CREATE THE input-file element "xx" here so that it can be uploaded. The server looks for this element. We have to dynamically add it because it may have been created with FFMPEG WASM. 8-2-2023.
                                        //
                                        //




                                        //alert('PREPARING TO APPEND FORMDATA outFile.name: ' + outFile.name + ', filename: ' + filename);
                                        formData.append('multerFileUploadIdentifier_pre-processed-file', outFile); //, filename);
                                        formData.delete('multerFileUploadIdentifier_original');

                                        //alert('SUCCESSFULLY APPENDED AND DELETED FORM DATA.');




                                        var operationUri = thiz.options.operationUriPrefix + '_files/' + 'uploadattachment_large';
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

                                                            $("#divBwActivitySpinner_FileUpload_ProgressBar_StatusText").html(thiz.options.ActivitySpinner_FileUpload_ProgressBar_StatusText);

                                                            console.log('');
                                                            console.log('progress ' + Math.round(percentComplete) + '% workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId);
                                                            console.log('');

                                                            if (percentComplete == 100) {
                                                                // It looks like the file stalls at 100%, but it must be the server saving the file, doing final operations... so let the user know that.
                                                                ShowActivitySpinner_FileUpload('Completing the save operations...');
                                                            }

                                                        } else {
                                                            alert('xcx2343277 FATAL ERROR NO value for evt.lengthComputable: ' + evt.lengthComputable);
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

                                                        displayAlertDialog('Error: xcx2314234-1 abort message: ' + evt.message);

                                                    }, false);

                                                    xhr.upload.addEventListener("error", function (evt) {
                                                        try {

                                                            var msg = 'Error in bwAttachments.js.performUpload.xhr.upload.error():xcx1-2-1: workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', evt: ' + JSON.stringify(evt);

                                                            console.log('');
                                                            console.log(msg);
                                                            console.log('');

                                                            displayAlertDialog_Persistent(msg);
                                                            //alert(msg);

                                                        } catch (e) {
                                                            console.log('Exception in bwAttachments.js.performUpload.xhr.upload.error():xcx1-2: ' + e.message + ', ' + e.stack);
                                                            alert('Exception in bwAttachments.js.performUpload.xhr.upload.error():xcx1-2: ' + e.message + ', ' + e.stack);
                                                        }
                                                    }, false);

                                                    xhr.upload.addEventListener("load", function (evt) {
                                                        console.log('');
                                                        console.log('load workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId);
                                                        console.log('');




                                                        //$('.bwAuthentication').bwAuthentication('checkIfWeNeedToUpdateTheHomepage', bwBudgetRequestId);

                                                        //displayAlertDialog('The file has uploaded successfully.');
                                                        //console.log('The file has uploaded successfully. Or has it? xcx2134124. evt: ' + JSON.stringify(evt));
                                                        ////console.log('The file has uploaded successfully.');

                                                        //clearInterval(fileUploadTimer);
                                                        //fileUploadTimer = 'stopped';

                                                    }, false);

                                                    xhr.upload.addEventListener("timeout", function (evt) {

                                                        console.log('');
                                                        console.log('timeout workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId);
                                                        console.log('');


                                                        displayAlertDialog('Error: timeout xcx2314436457');

                                                    }, false);

                                                    xhr.upload.addEventListener("loadend", function (evt) {
                                                        console.log('');
                                                        console.log('loadend workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId);
                                                        console.log('');

                                                        //alert('loadend workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId);

                                                        //HideActivitySpinner_FileUpload(); // moved 9-8-2022

                                                        //displayAlertDialog('loadend');

                                                    }, false);

                                                    return xhr;
                                                } catch (e) {

                                                    console.log('');
                                                    console.log('Exception in POST uploadattachment_large.ajax.xhr(). workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', ' + e.message + ', ' + e.stack);
                                                    console.log('');

                                                    alert('Exception in POST uploadattachment_large.ajax.xhr(). workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', ' + e.message + ', ' + e.stack);

                                                }
                                            },
                                            type: "POST",
                                            enctype: "multipart/form-data",
                                            url: operationUri,
                                            data: formData,
                                            processData: false,
                                            contentType: false,
                                            cache: false,
                                            timeout: 600000, // Is this long enough? What about the .mp4 files? 600,000 is 10 minutes.
                                            beforeSend: function () {
                                                $("#divBwActivitySpinner_FileUpload_ProgressBar").width('0%');
                                            },
                                            success: function (data) {
                                                try {
                                                    console.log('');
                                                    console.log('In bwAttachments.js.performUpload2(). POST success workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', operationUri: ' + operationUri);
                                                    console.log('');


                                                    //
                                                    // When we get here, the file has been 100% uploaded onto the file services server. 9-8-2022
                                                    //
                                                    HideActivitySpinner_FileUpload(); // 9-8-2022




                                                    // This resets the file input for uploading, so the onchange/change event fires as expected.
                                                    console.log('In bwAttachments.js.xx(). This resets the file input for uploading, so the onchange/change event fires as expected. xcx86984.');
                                                    //alert('render bwAttachments and maybe xxxxxx');



                                                    var x = $('#inputFile_' + bwBudgetRequestId)[0];
                                                    if (x && x.files) {
                                                        x.files = null; //fileList; // Clear the file upload input element.
                                                    }




                                                    $('.bwAuthentication').bwAuthentication('checkIfWeNeedToUpdateTheHomepage', bwBudgetRequestId);

                                                    //displayAlertDialog('The file has uploaded successfully.');
                                                    //console.log('The file has uploaded successfully. Or has it? xcx2134124. evt: ' + JSON.stringify(evt));
                                                    //console.log('The file has uploaded successfully.');

                                                    clearInterval(fileUploadTimer);
                                                    fileUploadTimer = 'stopped';
                                                    //
                                                    //
                                                    //




                                                    if (data.status == 'SUCCESS') {

                                                        displayAlertDialog_QuickNotice('The file(s) have uploaded successfully.');

                                                        //var dialogId2 = 'divConfirmFileUploadDialog_ForAttachments_' + bwBudgetRequestId;
                                                        //


                                                        var dialogId2 = 'divConfirmFileUploadDialog_ForAttachments_zip_wasm_' + bwBudgetRequestId;
                                                        $('#' + dialogId2).dialog('close');

                                                        console.log('Calling bwAttachments.js.populateAttachments(). xcx13124-3');
                                                        //alert('xcx213234-13 calling populateAttachments().');
                                                        thiz.populateAttachments(workflowAppId, bwBudgetRequestId, displayAttachmentsTagName, true); // This lists the attachments in the <p> tag with id='attachments'.

                                                    } else if (data.status == 'NO_REQUEST_SAVED') {

                                                        console.log('xcx23235NO_REQUEST_SAVED  data.result: ' + data.result); // 9-8-2022

                                                        // This means it must have been the first attachment uploaded for a new request. In this case, we will call back to the server and create the new request, so that it is not lost.
                                                        console.log('xcx2143234215 This means it must have been the first attachment uploaded for a new request. <<< IS THIS TRUE???????????????????????');

                                                        console.log('');
                                                        console.log('xcx2143234215 This means it must have been the first attachment uploaded for a new request. In this case, we will call back to the server and create the new request, so that it is not lost. Calling bwRequest.js.saveAndPublishTheRequest().');
                                                        console.log('');



                                                        console.log('8-23-2022 FIXED THIS, remove this log entry once the bwAttachments.js widget works 100%. xcx1236899 bwBudgetRequestId: ' + bwBudgetRequestId);
                                                        // 8-23-2022 FIX THIS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                                                        //var bwRequestTypeId = $('#' + 'divPageContent1').find('#budgetrequestform')[0].getAttribute('bwrequesttypeid'); // THIS IS WRONG, WE SHOULD BE GOING THROUGH ALL THE budgetrequestform collection and matching up the bwBudgetRequestId.
                                                        var budgetrequestform;
                                                        var budgetrequestforms = document.getElementsByClassName('budgetrequestform');
                                                        for (var i = 0; i < budgetrequestforms.length; i++) {
                                                            var _budgetRequestId = $(budgetrequestforms[i])[0].getAttribute('bwbudgetrequestid');
                                                            if (bwBudgetRequestId == _budgetRequestId) {
                                                                // We found the form.
                                                                budgetrequestform = $(budgetrequestforms[i]);
                                                                break;
                                                            }
                                                        }
                                                        if (!budgetrequestform) {

                                                            displayAlertDialog('In bwAttachments.js.performUpload2(). Could not find budgetrequestform with bwBudgetRequestId: ' + bwBudgetRequestId);

                                                        } else {

                                                            //$('.bwRequest').bwRequest('saveAndPublishTheRequest', 'divPageContent1', true, bwBudgetRequestId, bwRequestTypeId); // This saves and publishes the New Request for the first time. 9-8-2022



                                                            alert('This saves and publishes the New Request for the first time. 5-4-2022');




                                                            // 1-6-2022
                                                            $('.bwRequest').bwRequest('saveAndPublishTheRequest', 'divPageContent1', true, bwBudgetRequestId, bwRequestTypeId) // This saves and publishes the New Request for the first time. 9-8-2022
                                                                .then(function (results) {

                                                                    if (results.status != 'SUCCESS') {

                                                                        var msg = 'Error in bwAttachments.js.performUpload2(). xcx21345-1: ' + results.status + ', ' + results.message;
                                                                        displayAlertDialog(msg);

                                                                    } else {

                                                                        console.log('Calling bwAttachments.js.populateAttachments(). xcx13124-4');
                                                                        //alert('xcx213234-12 calling populateAttachments().');
                                                                        thiz.populateAttachments(workflowAppId, bwBudgetRequestId, displayAttachmentsTagName, true); // This lists the attachments in the <p> tag with id='attachments'.

                                                                    }

                                                                }).catch(function (e) {

                                                                    console.log('Calling bwAttachments.js.populateAttachments(). xcx13124-5');
                                                                    alert('xcx213234-11 calling populateAttachments().');
                                                                    thiz.populateAttachments(workflowAppId, bwBudgetRequestId, displayAttachmentsTagName, true); // This lists the attachments in the <p> tag with id='attachments'.
                                                                    console.log('Exception from Promise in bwAttachments.js.performUpload2(). xcx21345-2: ' + JSON.stringify(e));

                                                                });

                                                        }

                                                    } else if (data.status == 'ERROR') {

                                                        if (data.message.indexOf('gmError: Error: Command failed: identify-im6.q16: no decode delegate for this image format `M4A') > -1) {

                                                            // In this case, for uploaded M4A files, return success, because it has uploaded successfully.... and the "File Conversion Timer" will pick it up and convert it to a mp3 file.
                                                            var msg = 'The file has uploaded successfully. It will be converted and available as a .mp3 file shortly.';
                                                            displayAlertDialog(msg);

                                                            console.log('Calling bwAttachments.js.populateAttachments(). xcx13124-6');
                                                            alert('xcx213234-10 calling populateAttachments().');
                                                            thiz.populateAttachments(workflowAppId, bwBudgetRequestId, displayAttachmentsTagName, true); // This lists the attachments in the <p> tag with id='attachments'.

                                                        } else {

                                                            var msg = data.status + ' in bwAttachments.js.performUpload2() xcx02856-1: ' + data.message;
                                                            console.log(msg);
                                                            displayAlertDialog(msg);

                                                        }

                                                    } else if (data.status == 'EXCEPTION') {

                                                        var msg = data.status + ' in bwAttachments.js.performUpload2() xcx02856-2-2: ' + data.message;
                                                        console.log(msg);
                                                        displayAlertDialog(msg);

                                                    } else {

                                                        //$('.bwAttachments').bwAttachments('renderAndPopulateAttachments'); // displayAttachmentsTagName
                                                        alert('xcx2131234-4-11 Unexpected response. data: ' + JSON.stringify(data));

                                                        displayAlertDialog(data.message);
                                                    }
                                                } catch (e) {
                                                    console.log('Exception in bwAttachments.js.performUpload2():xcx33: ' + e.message + ', ' + e.stack);
                                                    alert('Exception in bwAttachments.js.performUpload2():xcx33: ' + e.message + ', ' + e.stack);
                                                    //$(this.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwAttachments.performUpload2:xcx33: ' + e.message + ', ' + e.stack;
                                                    //displayAlertDialog('Exception in bwAttachments.js.performUpload2():xcx33: ' + e.message + ', ' + e.stack);
                                                }
                                            },
                                            error: function (e) {

                                                HideActivitySpinner();
                                                if (xhrAbortMessage && xhrAbortMessage != '') {
                                                    // This means we intentionally aborted.
                                                    console.log('');
                                                    console.log('POST error. xcx1242525 Intentional abort: ' + xhrAbortMessage);
                                                    console.log('');

                                                    displayAlertDialog('POST error. xcx1242525 Intentional abort: ' + xhrAbortMessage + ', workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId);

                                                } else {
                                                    // It was unexpected.
                                                    console.log('');
                                                    console.log('POST error. Unexpected error: ' + JSON.stringify(e));
                                                    console.log('');

                                                    displayAlertDialog('POST unexpected error. xcx1242525-2 workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', Unexpected error: ' + JSON.stringify(e));

                                                }

                                            }
                                        });
                                    }










                                }

                            }

                        } catch (e) {
                            HideActivitySpinner();
                            console.log('Exception in logonWith_BudgetWorkflow():2: ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in logonWith_BudgetWorkflow():2: ' + e.message + ', ' + e.stack);
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        HideActivitySpinner();
                        console.log('Error in bwAuthentication.logonWith_BudgetWorkflow() calling ' + operationUri + ': ' + errorCode + ', ' + errorMessage + ', ' + JSON.stringify(data));

                        if ((data.statusText == 'timeout') || (data.statusText == 'error')) {

                            displayAlertDialog(thiz.options.ServiceUnavailableMessage);
                            $('.bwCircleDialog').bwCircleDialog('hideCircleDialog');

                        } else {
                            displayAlertDialog('Error in bwAuthentication.logonWith_BudgetWorkflow() calling ' + operationUri + ': ' + errorCode + ', ' + errorMessage + ', ' + JSON.stringify(data));
                        }


                        // "readyState":0,"responseText":"","status":0,"statusText":"error"
                        // Todd 10-14-17: This first if statement may not be necessary, but I can't replicate the issue so I am leaving it here.
                        //if (data.readyState == 0 && data.status == 0 && data.statusText == 'error') {
                        //    displayAlertDialog('Our back end web server is not responding. Please try again in a few minutes.');
                        //} else 
                        //if (JSON.stringify(data).toUpperCase().indexOf('ERROR 503 SERVICE UNAVAILABLE') > -1) {
                        //    displayAlertDialog('Our back end web server is not responding. Please try again in a few minutes.');
                        //    WriteToErrorLog('LOGIN FAILURE1!!!!!!!!!!! Error in index.js.logonWith_BudgetWorkflow().usercustomlogon: ' + operationUri + ', ' + errorCode + ', ' + errorMessage + ', ' + JSON.stringify(data));
                        //} else {
                        //    displayAlertDialog('Error in usercustomlogon. Incorrect .js file version: ' + operationUri + ', ' + errorCode + ', ' + errorMessage + ', ' + JSON.stringify(data));
                        //    WriteToErrorLog('Error in usercustomlogon. Incorrect .js file version: ' + operationUri + ', ' + errorCode + ', ' + errorMessage + ', ' + JSON.stringify(data));
                        //}

                        if (errorCode === "timeout") {
                            //alert("got timeout");
                            displayAlertDialog('Our back end server/database is not responding. Please try again in a few minutes.');
                            WriteToErrorLog('LOGIN FAILURE1!!!!!!!!!!! Error in bwAuthentication.logonWith_BudgetWorkflow(): ' + operationUri + ', ' + errorCode + ', ' + errorMessage + ', ' + JSON.stringify(data));

                        } else if (JSON.stringify(data).toUpperCase().indexOf('403') > -1) {
                            // 403 Forbidden.
                            displayAlertDialog('The back end database cannot be contacted (403). Please try again in a few minutes. <a target="_blank" href="http://status.budgetworkflow.com">http://status.budgetworkflow.com</a>');
                            WriteToErrorLog('LOGIN FAILURE1!!!!!!!!!!! Error in bwAuthentication.logonWith_BudgetWorkflow(): Web services cannot be contacted. Please try again in a few minutes. 403 error The request could not be satisfied.: ' + operationUri + ', ' + errorCode + ', ' + errorMessage + ', ' + JSON.stringify(data));
                        } else if (JSON.stringify(data).toUpperCase().indexOf('503') > -1) {
                            // 503 Service unavailable.
                            displayAlertDialog('Web services status is 503 Service Unavailable. Please try again in a few minutes. <a target="_blank" href="http://status.budgetworkflow.com">http://status.budgetworkflow.com</a>');
                            WriteToErrorLog('LOGIN FAILURE1!!!!!!!!!!! Error in bwAuthentication.logonWith_BudgetWorkflow(): Web services cannot be contacted. Please try again in a few minutes. 403 error The request could not be satisfied.: ' + operationUri + ', ' + errorCode + ', ' + errorMessage + ', ' + JSON.stringify(data));
                        } else {
                            displayAlertDialog('Error in bwAuthentication.logonWith_BudgetWorkflow() calling ' + operationUri + ': ' + errorCode + ', ' + errorMessage + ', ' + JSON.stringify(data));
                            WriteToErrorLog('Error in bwAuthentication.logonWith_BudgetWorkflow() calling ' + operationUri + ': ' + errorCode + ', ' + errorMessage + ', ' + JSON.stringify(data));
                        }
                    }
                });

            }

        } catch (e) {
            console.log('Exception in bwAttachments.js.performUpload2(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwAttachments.js.performUpload2(): ' + e.message + ', ' + e.stack);
            $(this.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwAttachments.performUpload2: ' + e.message + ', ' + e.stack;
        }
    },
    populateAttachments: function (bwWorkflowAppId, bwBudgetRequestId, attachmentsTagId, showRemoveAttachmentButton, requestDialogId) {
        try {
            console.log('In bwActiveMenu.js.populateAttachments(). bwBudgetRequestId: ' + bwBudgetRequestId);
            //alert('In bwActiveMenu.js.populateAttachments(). It would be nice to know where this was called from. bwBudgetRequestId: ' + bwBudgetRequestId);
            var thiz = this;



            //
            // This resets the value of the input file element so that if the same file is selected a second time, it behaves as expected. 11-29-2023.
            // This should only happen in populateAttachments() and in CloseDialog_btnCancelUploadTheFileNow().
            //
            console.log('This resets the value of the input file element so that if the same file is selected a second time, it behaves as expected. This should only happen in populateAttachments() and in CloseDialog_btnCancelUploadTheFileNow().');
            var inputFileAttachmentsElement = $('#inputFile_bwActiveMenu_Unauthenticated_Home')[0];
            if (!inputFileAttachmentsElement) {
                console.log('Error in bwActiveMenu.js.populateAttachments(). This error is most likely because this was rendered with renderAndPopulateAttachments_ReadOnly(). It is readonly. DEV: This needs some work. Proceed from here.')
                displayAlertDialog('Error in bwActiveMenu.js.populateAttachments(). This error is most likely because this was rendered with renderAndPopulateAttachments_ReadOnly(). It is readonly. DEV: This needs some work. Proceed from here.')
            } else {
                inputFileAttachmentsElement.value = '';
            }
            //
            //

            //var forms = $('.budgetrequestform');
            //var form;
            //for (var i = 0; i < forms.length; i++) {
            //    if (forms[i].getAttribute('bwbudgetrequestid') == bwBudgetRequestId) {
            //        console.log('In bwActiveMenu.js.populateAttachments(). FOUND THE FORM');
            //        form = forms[i];
            //    }
            //}
            //if (!form) {

            //    console.log('Error in bwActiveMenu.js.populateAttachments(). NO FORM FOUND for bwBudgetRequestId: ' + bwBudgetRequestId);
            //    displayAlertDialog('Error in bwActiveMenu.js.populateAttachments(). NO FORM FOUND for bwBudgetRequestId: ' + bwBudgetRequestId);

            //} else {

            var attachmentWidget = $('.bwActiveMenu:first');

            if (!attachmentWidget) {

                console.log('Error in bwActiveMenu.js.populateAttachments(). Could not locate the bwAttachment widget. xcx32425263. bwBudgetRequestId: ' + bwBudgetRequestId);
                displayAlertDialog('Error in bwActiveMenu.js.populateAttachments(). Could not locate the bwAttachment widget. xcx32425263. bwBudgetRequestId: ' + bwBudgetRequestId);

            } else {

                ShowActivitySpinner('Attempting login...');

                var userEmailAddress = localStorage['customlogonusername'];
                var userPassword = localStorage['customlogonpassword'];

                data = {
                    userEmailAddress: userEmailAddress,
                    userPassword: userPassword
                };

                var operationUri = thiz.options.operationUriPrefix + '_bw/bwworkflow/usercustomlogon';
                $.ajax({
                    url: operationUri,
                    type: "POST",
                    data: data,
                    timeout: 15000,
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    },
                    success: function (data) {
                        try {
                            HideActivitySpinner();
                            //debugger;
                            //displayAlertDialog(data);

                            if (data.message != 'The password is correct') {
                                if (data.message == 'USER_DOES_NOT_EXIST') { // xcx122134-1
                                    // Since the user doesn't exist, display the "Create new user" dialog.

                                    //$('.bwCircleDialog').bwCircleDialog('displayCustomSignInWithInvitationDialog', true, 'toddtest');
                                    //document.getElementById('spanCustomSignUpDialogInvitationDescriptionText').innerHTML = 'toddtest22';
                                    displayAlertDialog(data.message);
                                } else {
                                    if (data.message) {
                                        displayAlertDialog(data.message);
                                    } else {
                                        displayAlertDialog(data);
                                    }
                                }
                            } else {

                                // localstorage!
                                //if (localStorage) {
                                //    localStorage['customlogonusername'] = userEmailAddress;
                                //    localStorage['customlogonpassword'] = userPassword;
                                //}

                                if (!(data.TwoFactorAuthenticationWithSms && (data.TwoFactorAuthenticationWithSms == 'NOT_ENABLED'))) {

                                    //
                                    // Two Factor Authentication.
                                    //

                                    alert('Two Factor Authentication is turned on. This process cannot be completed at this time.');

                                    //if (data.TwoFactorAuthenticationWithSms && data.TwoFactorAuthenticationWithSms == 'SUCCEEDED_SENDING_SMS') {
                                    //    // Display the circle dialog for this, and send a code via SMS. 9-2-2021
                                    //    //alert('data.bwTwoFactorAuthenticationSmsNumber: ' + data.bwTwoFactorAuthenticationSmsNumber);
                                    //    $('.bwCircleDialog').bwCircleDialog('displaySignInWithSMSCodeDialog', true, null, data.bwTwoFactorAuthenticationSmsNumber);


                                    //} else if (data.TwoFactorAuthenticationWithSms && data.TwoFactorAuthenticationWithSms == 'FAILED_SENDING_SMS') {

                                    //    alert('SMS/text messaging failed: ' + data.SmsFailureMessage + '. Turning off "Two factor authentication using SMS/Text Messaging" until the issue is resolved. Please click the "Sign In" button again in order to login.');
                                    //    // 12-25-2021
                                    //    debugger; // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                                    //    var bwParticipantId = data.bwParticipantId;
                                    //    thiz.configurationBehaviorTwoFactorAuthenticationWithSmsTextMessagingSlider_Onchange(false, bwParticipantId);

                                    //} else {
                                    //    // Unexpected response.
                                    //    alert('SMS/text messaging failed. Unexpected response: ' + data.TwoFactorAuthenticationWithSms);
                                    //}

                                } else {



                                    debugger; // Get the values to fill in the form below. 2

                                    var bwBudgetRequestId = '';

                                    var workflowAppId = data.bwLastSelectedWorkflowAppId;
                                    var participantId = data.participantId;
                                    var participantEmail = data.participantEmail;
                                    var participantFriendlyName = data.participantFriendlyName;
                                    var activeStateIdentifier = JSON.stringify({
                                        ActiveStateIdentifier: data.bwActiveStateIdentifier, status: 'SUCCESS' // We need this for a subsequent step. 
                                    });

                                    debugger;

                                    console.log('In bwActiveMenu.js.populateAttachments(). workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', attachmentsTagId: ' + attachmentsTagId + ', showRemoveAttachmentButton: ' + showRemoveAttachmentButton + ').');

                                    //var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                                    //var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

                                    //var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                                    var data = {
                                        bwParticipantId_LoggedIn: participantId,
                                        bwActiveStateIdentifier: activeStateIdentifier,
                                        bwWorkflowAppId_LoggedIn: workflowAppId,

                                        bwWorkflowAppId: workflowAppId,
                                        bwBudgetRequestId: bwBudgetRequestId
                                    };

                                    var operationUri = globalUrlPrefix + globalUrlForWebServices + '/_files/' + 'getlistofattachmentsforbudgetrequest';
                                    $.ajax({
                                        url: operationUri,
                                        type: 'POST',
                                        data: data,
                                        timeout: 15000, // This is done because file services may need more time. 
                                        headers: { "Accept": "application/json; odata=verbose" },
                                        success: function (results) {
                                            try {

                                                console.log('Returned from call to /getlistofattachmentsforbudgetrequest().');
                                                alert('Returned from call to /getlistofattachmentsforbudgetrequest().');
                                                debugger;

                                                if (results.data && results.data.length && (results.data.length > 1)) {

                                                    //
                                                    // This is where we should be checking for more than 1 attachment. In this case, display the "Click to download these files as a zip archive" button. 6-18-2024.
                                                    //
                                                    // alert('This is where we should be checking for more than 1 attachment. In this case, display the "Click to download these files as a zip archive" button.');
                                                    //

                                                    var element = $(attachmentWidget).find('#bwAttachment_divClickToDownloadTheseFilesAsAZipArchive')[0];
                                                    if (!(element && element.style && element.style.display)) {

                                                        // THIS IS POROBABLY BECAUSE IT IS READ ONLY.
                                                        //alert('COULD NOT find the xx element. xcx234255.');

                                                    } else {

                                                        element.style.display = 'inline';

                                                    }

                                                }





                                                //
                                                //
                                                //
                                                //
                                                //
                                                alert('Calling [createHtmlToDisplayTheListOfAttachments_ForBwAttachmentsWidget] here. This needs its own custom method I think... xcx21324677777.');

                                                debugger; // This calls [createHtmlToDisplayTheListOfAttachments_ForBwAttachmentsWidget] but maybe we need a new method for this.
                                                var html = $('.bwCoreComponent:first').bwCoreComponent('createHtmlToDisplayTheListOfAttachments_ForBwAttachmentsWidget', thiz.options.elementIdSuffix, workflowAppId, bwBudgetRequestId, results);









                                                $(attachmentWidget).find('#newrequestattachments')[0].innerHTML = ''; // It worked, and here were attachments, so get rid of the message.

                                                $(attachmentWidget).find('#newrequestattachments').append(html);

                                            } catch (e) {

                                                $(attachmentWidget).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">Exception in bwActiveMenu.populateAttachments():1: ' + e.message + ', ' + e.stack + '</span>';
                                                if (e.number) {
                                                    console.log('Exception in bwActiveMenu.js.populateAttachments():1: ' + e.message + ', ' + e.stack);
                                                    displayAlertDialog('Exception in bwActiveMenu.js.populateAttachments():1: ' + e.message + ', ' + e.stack);
                                                } else {
                                                    // This most likely means that the folders are there on the file services server, but there is nothing in them.
                                                    //
                                                    // Fileservices has an error, so show nothing! We will put a red exclamation pin in the attachments section eventually! - 10-1-17 todd
                                                    //displayAlertDialog('Fileservices has an error: ' + ' "' + e.message + '"');
                                                }
                                            }
                                        },
                                        error: function (data, errorCode, errorMessage) {

                                            if (errorCode === 'timeout' && errorMessage === 'timeout') {
                                                displayAlertDialog('In bwAttachments.js.populateAttachments(). SERVICE UNAVAILABLE. File services is not responding. communication timeout is set at ' + ajaxTimeout / 1000 + ' seconds: ' + errorCode + ', ' + errorMessage);
                                                $(attachmentWidget).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">File services is not responding. communication timeout is set at ' + ajaxTimeout / 1000 + ' seconds: ' + errorCode + ', ' + errorMessage + '</span>';
                                            } else {

                                                var msg = 'Error in bwAttachments.js.populateAttachments(): ' + errorMessage + '.'; // A common error at the moment is "Backend fetch failed". 10-13-2022

                                                console.log(msg + ' xcx123123 data: ' + JSON.stringify(data));

                                                $(attachmentWidget).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">' + msg + '</span>';

                                                //displayAlertDialog('Error in bwAttachments.js.populateAttachments():2:xcx2 ' + errorCode + ', ' + errorMessage + ', ' + JSON.stringify(data));
                                                // The latest error 1-17-2018 is errorCode:'error' and errorMessage:'Not Found'.
                                                // What does this mean? You can replicate this error!
                                                // at Url: https://budgetworkflow.com/ios8.html, view an offline (Un-submitted) request, and try to add an attachment.

                                            }
                                        }
                                    });

                                }

                            }

                        } catch (e) {
                            HideActivitySpinner();
                            console.log('Exception in logonWith_BudgetWorkflow():2: ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in logonWith_BudgetWorkflow():2: ' + e.message + ', ' + e.stack);
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        HideActivitySpinner();
                        console.log('Error in bwAuthentication.logonWith_BudgetWorkflow() calling ' + operationUri + ': ' + errorCode + ', ' + errorMessage + ', ' + JSON.stringify(data));

                        if ((data.statusText == 'timeout') || (data.statusText == 'error')) {

                            displayAlertDialog(thiz.options.ServiceUnavailableMessage);
                            $('.bwCircleDialog').bwCircleDialog('hideCircleDialog');

                        } else {
                            displayAlertDialog('Error in bwAuthentication.logonWith_BudgetWorkflow() calling ' + operationUri + ': ' + errorCode + ', ' + errorMessage + ', ' + JSON.stringify(data));
                        }


                        // "readyState":0,"responseText":"","status":0,"statusText":"error"
                        // Todd 10-14-17: This first if statement may not be necessary, but I can't replicate the issue so I am leaving it here.
                        //if (data.readyState == 0 && data.status == 0 && data.statusText == 'error') {
                        //    displayAlertDialog('Our back end web server is not responding. Please try again in a few minutes.');
                        //} else 
                        //if (JSON.stringify(data).toUpperCase().indexOf('ERROR 503 SERVICE UNAVAILABLE') > -1) {
                        //    displayAlertDialog('Our back end web server is not responding. Please try again in a few minutes.');
                        //    WriteToErrorLog('LOGIN FAILURE1!!!!!!!!!!! Error in index.js.logonWith_BudgetWorkflow().usercustomlogon: ' + operationUri + ', ' + errorCode + ', ' + errorMessage + ', ' + JSON.stringify(data));
                        //} else {
                        //    displayAlertDialog('Error in usercustomlogon. Incorrect .js file version: ' + operationUri + ', ' + errorCode + ', ' + errorMessage + ', ' + JSON.stringify(data));
                        //    WriteToErrorLog('Error in usercustomlogon. Incorrect .js file version: ' + operationUri + ', ' + errorCode + ', ' + errorMessage + ', ' + JSON.stringify(data));
                        //}

                        if (errorCode === "timeout") {
                            //alert("got timeout");
                            displayAlertDialog('Our back end server/database is not responding. Please try again in a few minutes.');
                            WriteToErrorLog('LOGIN FAILURE1!!!!!!!!!!! Error in bwAuthentication.logonWith_BudgetWorkflow(): ' + operationUri + ', ' + errorCode + ', ' + errorMessage + ', ' + JSON.stringify(data));

                        } else if (JSON.stringify(data).toUpperCase().indexOf('403') > -1) {
                            // 403 Forbidden.
                            displayAlertDialog('The back end database cannot be contacted (403). Please try again in a few minutes. <a target="_blank" href="http://status.budgetworkflow.com">http://status.budgetworkflow.com</a>');
                            WriteToErrorLog('LOGIN FAILURE1!!!!!!!!!!! Error in bwAuthentication.logonWith_BudgetWorkflow(): Web services cannot be contacted. Please try again in a few minutes. 403 error The request could not be satisfied.: ' + operationUri + ', ' + errorCode + ', ' + errorMessage + ', ' + JSON.stringify(data));
                        } else if (JSON.stringify(data).toUpperCase().indexOf('503') > -1) {
                            // 503 Service unavailable.
                            displayAlertDialog('Web services status is 503 Service Unavailable. Please try again in a few minutes. <a target="_blank" href="http://status.budgetworkflow.com">http://status.budgetworkflow.com</a>');
                            WriteToErrorLog('LOGIN FAILURE1!!!!!!!!!!! Error in bwAuthentication.logonWith_BudgetWorkflow(): Web services cannot be contacted. Please try again in a few minutes. 403 error The request could not be satisfied.: ' + operationUri + ', ' + errorCode + ', ' + errorMessage + ', ' + JSON.stringify(data));
                        } else {
                            displayAlertDialog('Error in bwAuthentication.logonWith_BudgetWorkflow() calling ' + operationUri + ': ' + errorCode + ', ' + errorMessage + ', ' + JSON.stringify(data));
                            WriteToErrorLog('Error in bwAuthentication.logonWith_BudgetWorkflow() calling ' + operationUri + ': ' + errorCode + ', ' + errorMessage + ', ' + JSON.stringify(data));
                        }
                    }
                });

            }

        } catch (e) {
            console.log('Exception in bwActiveMenu.js.populateAttachments(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu.js.populateAttachments(): ' + e.message + ', ' + e.stack);

            //renderAndPopulateAttachments
            //$(thiz.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">Exception in bwActiveMenu.populateAttachments(): ' + e.message + ', ' + e.stack + '</span>';
            //$(attachmentWidget).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">Exception in bwActiveMenu.populateAttachments(): ' + e.message + ', ' + e.stack + '</span>';

        }
    },

    dodrop: function (event, bwBudgetRequestId) {
        try {
            console.log('In bwAttachments.js.dodrop().');
            var thiz = this;

            //alert('In bwAttachments.js.xx(). xcx232131244. event.dataTransfer.types: ' + event.dataTransfer.types + ' :: event.clipboardData: ' + event.clipboardData + ', event.dataTransfer: ' + event.dataTransfer);

            if (event.clipboardData) {

                console.log('In bwAttachments.js.dodrop(). THIS IS clipboardData.');

                if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {

                    displayAlertDialog('THE FIREFOX BROWSER CANNOT COPY AND PASTE. THERE IS A WORK-AROUND: USE DRAG-AND-DROP INSTEAD.');

                } else {

                    if (event.clipboardData.types.indexOf('Files') > -1) {

                        //
                        // These are files dragged from outside of the browser window. For example, Windows Explorer, or the Desktop.
                        //
                        this.uploadAttachment('newrequestattachments', null, bwBudgetRequestId, event.clipboardData);

                    } else {

                        displayAlertDialog('Unexpected value for event.dataTransfer.types: xcx23132-1: ' + event.dataTransfer.types);

                    }

                }

            } else if (event.dataTransfer) {

                console.log('In bwAttachments.js.dodrop(). THIS IS dataTransfer.');

                if ((event.dataTransfer.types.indexOf('Files') > -1) && (event.dataTransfer.types.length == 1)) {

                    alert('xcx123123124-1. These are files dragged from outside of the browser window. For example, Windows Explorer, or the Desktop.');

                    //
                    // These are files dragged from outside of the browser window. For example, Windows Explorer, or the Desktop.
                    //
                    this.uploadAttachment('newrequestattachments', null, bwBudgetRequestId, event.dataTransfer);

                } else if ((event.dataTransfer.types.indexOf('text/uri-list') > -1)) {

                    //alert('xcx123123124-2. These are files dragged within the browser window. For example, from one request bwAttachments widget to another requests bwAttachments widget. event.dataTransfer: ' + JSON.stringify(event.dataTransfer));

                    //
                    // These are files dragged within the browser window. For example, from one request bwAttachments widget to another requests bwAttachments widget.
                    //
                    var imageData = event.dataTransfer.getData('text');

                    if (!imageData) {
                        imageData = event.dataTransfer.getData('text/uri-list');
                    } else if (!imageData) {
                        imageData = event.dataTransfer.getData('text/plain');
                    }

                    //alert('xcx123123124-3. imageData: ' + imageData);

                    var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

                    var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                    var strUrlWithWorkflowAppId = 'https://shareandcollaborate.com/_files/' + workflowAppId + '/';
                    var strActiveStateIdentifierInUrl = '&ActiveStateIdentifier=' + JSON.parse(activeStateIdentifier).ActiveStateIdentifier;

                    if ((imageData.indexOf(strUrlWithWorkflowAppId) > -1) && (imageData.indexOf(strActiveStateIdentifierInUrl) > -1)) {

                        console.log('xcx123123124-4. Yes, the user is dragging and dropping an attachment from one request to another. 10-22-2023.');

                        //
                        // Yes, the user is dragging and dropping an attachment from one request to another. 10-22-2023.
                        //
                        // CALL THIS METHOD:
                        // router.put('/_files/bwCutAndPaste_Attachment', function (request, response) {
                        //

                        console.log('In bwAttachments.js.dodrop(). Yes the user is dragging and dropping an attachment from one request to another. This is a CUT operation... imageData: ' + imageData);

                        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                        var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');
                        var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');

                        var tmp1 = imageData.split(strUrlWithWorkflowAppId)[1];
                        var bwBudgetRequestId_Origin = tmp1.split('/')[0];
                        var fileNameToCutAndPaste_Thumbnail = tmp1.split('/')[1].split('?')[0];

                        var form = $(thiz.element).closest('.budgetrequestform')[0];
                        var bwBudgetRequestId_Destination = $(form)[0].getAttribute('bwbudgetrequestid');

                        console.log('In bwAttachments.js.dodrop(). fileNameToCutAndPaste_Thumbnail: ' + fileNameToCutAndPaste_Thumbnail + ', bwBudgetRequestId_Origin: ' + bwBudgetRequestId_Origin + ', bwBudgetRequestId_Destination: ' + bwBudgetRequestId_Destination);
                        //displayAlertDialog('In bwAttachments.js.dodrop(). fileNameToCutAndPaste_Thumbnail: ' + fileNameToCutAndPaste_Thumbnail + ', bwBudgetRequestId_Origin: ' + bwBudgetRequestId_Origin + ', bwBudgetRequestId_Destination: ' + bwBudgetRequestId_Destination);

                        var data = {
                            bwParticipantId_LoggedIn: participantId,
                            bwActiveStateIdentifier: activeStateIdentifier,
                            bwWorkflowAppId_LoggedIn: workflowAppId,

                            bwWorkflowAppId: workflowAppId,

                            FileNameToCutAndPaste: fileNameToCutAndPaste_Thumbnail,
                            bwBudgetRequestId_Origin: bwBudgetRequestId_Origin,
                            bwBudgetRequestId_Destination: bwBudgetRequestId_Destination,

                            bwParticipantId: participantId,
                            bwParticipantFriendlyName: participantFriendlyName,
                            bwParticipantEmail: participantEmail
                        };

                        var operationUri = thiz.options.operationUriPrefix + '_files/' + 'bwCutAndPaste_Attachment'; // _files allows us to use nginx to route these to a dedicated file server.
                        $.ajax({
                            url: operationUri,
                            type: 'POST',
                            data: data,
                            headers: { "Accept": "application/json; odata=verbose" },
                            success: function (results) {
                                try {

                                    if (results.status != 'SUCCESS') {

                                        var msg = 'Error in bwAttachments.js.dodrop.bwCutAndPaste_Attachment(). ' + results.status + ': ' + results.message;
                                        console.log(msg);
                                        displayAlertDialog_Persistent(msg);

                                    }


                                    //
                                    //
                                    // Now we have to call "renderAndPopulateAttachments()" for both of the requests. WE ONLY HAVE TO DO THIS BECAUSE OF THE CUT NATURE OF THE ATTACHMENT... Only copyign for the present...
                                    //
                                    //debugger;
                                    //if (window.opener) {
                                    //    // This is a popped out window.
                                    //    // Since that is the case, we have to look in the main/origin window, and also in all the other popped out windows.

                                    //    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> This is a popped out window.');


                                    //} else {
                                    //    // This is not a popped out window.
                                    //    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> This is not a popped out window.');
                                    //}
                                    var requestCounter = 0;

                                    var forms = $(document).find('.budgetrequestform'); // Find in the main browser window, or popped out window.

                                    for (var i = 0; i < forms.length; i++) {
                                        var bwBudgetRequestId_Temp = $(forms)[i].getAttribute('bwbudgetrequestid');
                                        if ((bwBudgetRequestId_Temp == bwBudgetRequestId_Origin) || (bwBudgetRequestId_Temp == bwBudgetRequestId_Destination)) {
                                            requestCounter += 1;
                                            $(forms[i]).find('.bwAttachments').bwAttachments('renderAndPopulateAttachments'); // Call this method for this specific widget. This will re-generate the gold colored drag-and-drop section... etc...
                                        }
                                    }

                                    //if (requestCounter == 2) {

                                    //    // No need to indicate anything to the user. They will get visual feedback when the request attachments are rendered.
                                    //    console.log('COMPLETED CUT AND PASTE xcx90809898. requestCounter: ' + requestCounter + ', results: ' + JSON.stringify(results));

                                    //} else {
                                    //    console.log('ERROR COMPLETING CUT AND PASTE xcx90809898. THIS MAY BE BECAUSE OF POPPED OUT WINDOWS. Expected a value of 2 for requestCounter: ' + requestCounter + ', results: ' + JSON.stringify(results));
                                    //    alert('ERROR COMPLETING CUT AND PASTE xcx90809898. THIS MAY BE BECAUSE OF POPPED OUT WINDOWS. Expected a value of 2 for requestCounter: ' + requestCounter + ', results: ' + JSON.stringify(results));
                                    //}




                                } catch (e) {
                                    console.log('Exception in bwAttachments.js.dodrop():2: ' + e.message + ', ' + e.stack);
                                    displayAlertDialog('Exception in bwAttachments.js.dodrop():2: ' + e.message + ', ' + e.stack);
                                    $(this.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwAttachments.js.dodrop():2: ' + e.message + ', ' + e.stack;
                                }
                            },
                            error: function (data, errorCode, errorMessage) {
                                $('#divWorkingOnItDialog').dialog('close'); // Close the "Working on it..." dialog.
                                console.log('Error in bwAttachments.js.dodrop(): ' + errorMessage);
                                debugger;
                                if (errorMessage == 'timeout') {
                                    displayAlertDialog('The file server could not be contacted. Please try again in a few minutes.');
                                } else {
                                    displayAlertDialog('Error in bwAttachments.js.dodrop(): ' + errorMessage);
                                }
                            }
                        });

                    } else {

                        fetch(imageData)
                            .then(function (res) {
                                try {
                                    res.blob();
                                } catch (e) {
                                    alert('Exception xcx21312312 ' + e.message + ', ' + e.stack);

                                    imgElement.remove(); // Remove the img element which is displaying the pasted image.
                                }
                            })
                            .then(function (blob) {
                                try {
                                    const f = new File([blob], 'dot.png', blob);

                                    var fileInput = document.getElementById('inputFile_' + bwBudgetRequestId);

                                    if (!fileInput) {

                                        var imgSrc2 = $(thiz.element).find('#dropzone1 img')[0].src;

                                        alert('Error in bwAttachments.js.dodrop(). Cannot find element: inputFile_' + bwBudgetRequestId + ', imgSrc2: ' + imgSrc2);







                                    }

                                    var tst = new DataTransfer();
                                    tst.items.add(f);
                                    fileInput.files = tst.files;

                                    console.log('fileInput.files.length: ' + fileInput.files.length);

                                    //imgElement.remove(); // Remove the img element which is displaying the pasted image.

                                    //thiz.uploadAttachment('newrequestattachments', requestDialogId, bwBudgetRequestId);
                                    thiz.uploadAttachment('newrequestattachments', null, bwBudgetRequestId);

                                } catch (e) {
                                    alert('Exception in bwAttachments.js.dodrop(). xcx215343: ' + e.message + ', ' + e.stack);

                                    imgElement.remove(); // Remove the img element which is displaying the pasted image.
                                }

                            })
                            .catch(function (e) {

                                alert('Exception from psomise xcx87987 ' + e + ', Exception when fetching "' + imageData + '".');
                                imgElement.remove(); // Remove the img element which is displaying the pasted image.

                            });

                    }










                } else {

                    displayAlertDialog('Unexpected value for event.dataTransfer.types: xcx23132-2: ' + event.dataTransfer.types);

                }

            } else {

                displayAlertDialog('Error in bwAttachments.js.dodrop(). Could not find a valid DataTransfer object.');

            }



            //alert('In bwAttachments.js.dodrop().');

            //alert('In bwAttachments.js.dodrop(). dt.types: ' + dt.types);

            //if ((dt.types.indexOf('text/uri-list') > -1) && (dt.types.indexOf('Files') > -1)) {

            //    alert('Urls and Files.');

            //    //
            //    // These are files dragged within the browser window. For example, from one request bwAttachments widget to another requests bwAttachments widget.
            //    //

            //    var imageData = dt.getData("text");

            //    var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            //    var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            //    var strUrlWithWorkflowAppId = 'https://shareandcollaborate.com/_files/' + workflowAppId + '/';
            //    var strActiveStateIdentifierInUrl = '&ActiveStateIdentifier=' + JSON.parse(activeStateIdentifier).ActiveStateIdentifier;

            //    if ((imageData.indexOf(strUrlWithWorkflowAppId) > -1) && (imageData.indexOf(strActiveStateIdentifierInUrl) > -1)) {

            //        //
            //        // Yes, the user is dragging and dropping an attachment from one request to another. 10-22-2023.
            //        //
            //        // CALL THIS METHOD:
            //        // router.put('/_files/bwCutAndPaste_Attachment', function (request, response) {
            //        //

            //        console.log('In bwAttachments.js.renderAndPopulateAttachments.dropzone.drop(). Yes the user is dragging and dropping an attachment from one request to another. This is a CUT operation... imageData: ' + imageData);

            //        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            //        var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');
            //        var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');

            //        var tmp1 = imageData.split(strUrlWithWorkflowAppId)[1];
            //        var bwBudgetRequestId_Origin = tmp1.split('/')[0];
            //        var fileNameToCutAndPaste_Thumbnail = tmp1.split('/')[1].split('?')[0];

            //        var form = $(thiz.element).closest('.budgetrequestform')[0];
            //        var bwBudgetRequestId_Destination = $(form)[0].getAttribute('bwbudgetrequestid');

            //        console.log('DEV: READY TO CALL WEB SERVICE [bwCutAndPaste_Attachment]. In bwAttachments.js.renderAndPopulateAttachments.dropzone.drop(). fileNameToCutAndPaste_Thumbnail: ' + fileNameToCutAndPaste_Thumbnail + ', bwBudgetRequestId_Origin: ' + bwBudgetRequestId_Origin + ', bwBudgetRequestId_Destination: ' + bwBudgetRequestId_Destination);

            //        var data = {
            //            bwParticipantId_LoggedIn: participantId,
            //            bwActiveStateIdentifier: activeStateIdentifier,
            //            bwWorkflowAppId_LoggedIn: workflowAppId,

            //            bwWorkflowAppId: workflowAppId,

            //            FileNameToCutAndPaste: fileNameToCutAndPaste_Thumbnail,
            //            bwBudgetRequestId_Origin: bwBudgetRequestId_Origin,
            //            bwBudgetRequestId_Destination: bwBudgetRequestId_Destination,

            //            bwParticipantId: participantId,
            //            bwParticipantFriendlyName: participantFriendlyName,
            //            bwParticipantEmail: participantEmail
            //        };

            //        var operationUri = thiz.options.operationUriPrefix + '_files/' + 'bwCutAndPaste_Attachment'; // _files allows us to use nginx to route these to a dedicated file server.
            //        $.ajax({
            //            url: operationUri,
            //            type: 'POST',
            //            data: data,
            //            headers: { "Accept": "application/json; odata=verbose" },
            //            success: function (results) {
            //                try {

            //                    if (results.status != 'SUCCESS') {

            //                        var msg = 'Error in bwAttachments.js.renderAndPopulateAttachments.dropzone.drop.bwCutAndPaste_Attachment(). ' + results.status + ': ' + results.message;
            //                        console.log(msg);
            //                        displayAlertDialog_Persistent(msg);

            //                    }

            //                    //
            //                    // Now we have to call "renderAndPopulateAttachments()" for both of the requests.
            //                    //

            //                    var requestCounter = 0;

            //                    var forms = $(document).find('.budgetrequestform');

            //                    for (var i = 0; i < forms.length; i++) {
            //                        var bwBudgetRequestId_Temp = $(forms)[i].getAttribute('bwbudgetrequestid');
            //                        if ((bwBudgetRequestId_Temp == bwBudgetRequestId_Origin) || (bwBudgetRequestId_Temp == bwBudgetRequestId_Destination)) {
            //                            requestCounter += 1;
            //                            $(forms[i]).find('.bwAttachments').bwAttachments('renderAndPopulateAttachments'); // Call this method for this specific widget. This will re-generate the gold colored drag-and-drop section... etc...
            //                        }
            //                    }

            //                    if (requestCounter == 2) {

            //                        // No need to indicate anything to the user. They will get visual feedback when the request attachments are rendered.
            //                        console.log('COMPLETED CUT AND PASTE xcx90809898. requestCounter: ' + requestCounter + ', results: ' + JSON.stringify(results));

            //                    } else {
            //                        console.log('ERROR COMPLETING CUT AND PASTE xcx90809898. Expected a value of 2 for requestCounter: ' + requestCounter + ', results: ' + JSON.stringify(results));
            //                        alert('ERROR COMPLETING CUT AND PASTE xcx90809898. Expected a value of 2 for requestCounter: ' + requestCounter + ', results: ' + JSON.stringify(results));
            //                    }

            //                } catch (e) {
            //                    console.log('Exception in bwAttachments.js.renderAndPopulateAttachments.dropzone.drop():2: ' + e.message + ', ' + e.stack);
            //                    displayAlertDialog('Exception in bwAttachments.js.renderAndPopulateAttachments.dropzone.drop():2: ' + e.message + ', ' + e.stack);
            //                    $(this.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwAttachments.js.renderAndPopulateAttachments.dropzone.drop():2: ' + e.message + ', ' + e.stack;
            //                }
            //            },
            //            error: function (data, errorCode, errorMessage) {
            //                $('#divWorkingOnItDialog').dialog('close'); // Close the "Working on it..." dialog.
            //                console.log('Error in bwAttachments.js.renderAndPopulateAttachments.dropzone.drop(): ' + errorMessage);
            //                debugger;
            //                if (errorMessage == 'timeout') {
            //                    displayAlertDialog('The file server could not be contacted. Please try again in a few minutes.');
            //                } else {
            //                    displayAlertDialog('Error in bwAttachments.js.renderAndPopulateAttachments.dropzone.drop(): ' + errorMessage);
            //                }
            //            }
            //        });

            //    } else {

            //        fetch(imageData)
            //            .then(function (res) {
            //                try {
            //                    res.blob();
            //                } catch (e) {
            //                    alert('Exception xcx21312312 ' + e.message + ', ' + e.stack);

            //                    imgElement.remove(); // Remove the img element which is displaying the pasted image.
            //                }
            //            })
            //            .then(function (blob) {
            //                try {
            //                    const f = new File([blob], 'dot.png', blob);

            //                    var fileInput = document.getElementById('inputFile_' + bwBudgetRequestId);

            //                    if (!fileInput) {

            //                        var imgSrc2 = $(thiz.element).find('#dropzone1 img')[0].src;

            //                        alert('Error in bwAttachments.js.renderAndPopulateAttachments.dropzone.drop(). Cannot find element: inputFile_' + bwBudgetRequestId + ', imgSrc2: ' + imgSrc2);







            //                    }

            //                    var tst = new DataTransfer();
            //                    tst.items.add(f);
            //                    fileInput.files = tst.files;

            //                    console.log('fileInput.files.length: ' + fileInput.files.length);

            //                    //imgElement.remove(); // Remove the img element which is displaying the pasted image.

            //                    //thiz.uploadAttachment('newrequestattachments', requestDialogId, bwBudgetRequestId);
            //                    thiz.uploadAttachment('newrequestattachments', null, bwBudgetRequestId);

            //                } catch (e) {
            //                    alert('Exception in bwAttachments.js.renderAndPopulateAttachments.dropzone.drop(). xcx215343: ' + e.message + ', ' + e.stack);

            //                    imgElement.remove(); // Remove the img element which is displaying the pasted image.
            //                }

            //            })
            //            .catch(function (e) {

            //                alert('Exception from psomise xcx87987 ' + e + ', Exception when fetching "' + imageData + '".');
            //                imgElement.remove(); // Remove the img element which is displaying the pasted image.

            //            });

            //    }

            //} else if (dt.types.indexOf('text/uri-list') > -1) {

            //    alert('URLs.');

            //} else if (dt.types.indexOf('Files') > -1) {

            //    //
            //    // These are files dragged from outside of the browser window. For example, Windows Explorer, or the Desktop.
            //    //

            //    //var fileInput = document.getElementById('inputFile_' + bwBudgetRequestId);

            //    //fileInput.files = dt.files;

            //    thiz.uploadAttachment('newrequestattachments', null, bwBudgetRequestId, dt);



            //} else {

            //    alert('Unexpected value for dt.types: ' + dt.types);

            //}



































            ////
            //// dt.types: text/plain,text/html, // IF WE GET THIS, THERE ARE NO FILES!!!!!!!!!!!!!
            ////


            //if (dt.types == 'Files') {

            //    //
            //    // dt.types: Files,
            //    //

            //    //
            //    // These are files dragged from outside of the browser window. For example, Windows Explorer, or the Desktop.
            //    //

            //    var fileInput = document.getElementById('inputFile_' + bwBudgetRequestId);

            //    fileInput.files = files;

            //    thiz.uploadAttachment('newrequestattachments', null, bwBudgetRequestId);

            //} else {

            //    console.log('In bwAttachments.js.renderAndPopulateAttachments.dropzone.drop(). No base64 in the img src or this element. It must be a http reference... imgSrc: ' + imgSrc);

            //    //
            //    // dt.types: text/plain,text/uri-list,text/html,Files,
            //    //
            //    //
            //    // dt.getData("text"): https://shareandcollaborate.com/_files/c48535a4-9a6b-4b95-9d67-c6569e9695d8/ea419176-bd9f-42dc-b95d-1f982537a7c0/1982%20CDHS%20yearbook%20photo.jpg_320px_.jpg?v=c756f7cc-d194-480c-9c59-21f167a346de&ActiveStateIdentifier=06d4ff81-cfc9-407e-95de-2fc77a06dcac
            //    //

            //    displayAlertDialog_Persistent('These are files from within the browser window. xcx32423423. dt.types: ' + dt.types + ', dt.getData("text"): ' + dt.getData("text"));









            //    //
            //    // Here we check to see if the URL is an internal URL. If so, we are copying a file from one request, and pasting it into another.
            //    // In other words, this means the user has dragged a file from one request, to another request. We will make this a CUT operation, because it seems this is th euse case.
            //    // Use case: A receipt image is attached to a request type of "Invoice". The user drag-and-drops it to another request. Therefore a CUT operation.
            //    //

            //    // Example imgSrc: https://shareandcollaborate.com/_files/c48535a4-9a6b-4b95-9d67-c6569e9695d8/8b6e9b8f-5b06-4cd7-ae10-340242abd47f/receipt%20-%2010-11-2023%20-%20breakfast%20-%20a%20whopper%20from%20burger%20king.jpg_320px_.jpg?v=5f511b64-b8ad-4bcf-86bc-398223003556&ActiveStateIdentifier=4710a0b6-aa6e-4414-b593-db8a37326558

            //    var imgElement = $(thiz.element).find('#dropzone1 img');
            //    var imgSrc = $(thiz.element).find('#dropzone1 img')[0].src;

            //    var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            //    var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            //    var strUrlWithWorkflowAppId = 'https://shareandcollaborate.com/_files/' + workflowAppId + '/';
            //    var strActiveStateIdentifierInUrl = '&ActiveStateIdentifier=' + JSON.parse(activeStateIdentifier).ActiveStateIdentifier;

            //    if ((imgSrc.indexOf(strUrlWithWorkflowAppId) > -1) && (imgSrc.indexOf(strActiveStateIdentifierInUrl) > -1)) {

            //        //
            //        // Yes, the user is dragging and dropping an attachment from one request to another. 10-22-2023.
            //        //
            //        // CALL THIS METHOD:
            //        // router.put('/_files/bwCutAndPaste_Attachment', function (request, response) {
            //        //

            //        console.log('In bwAttachments.js.renderAndPopulateAttachments.dropzone.drop(). Yes the user is dragging and dropping an attachment from one request to another. This is a CUT operation... imgSrc: ' + imgSrc);

            //        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            //        var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');
            //        var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');

            //        var tmp1 = imgSrc.split(strUrlWithWorkflowAppId)[1];
            //        var bwBudgetRequestId_Origin = tmp1.split('/')[0];
            //        var fileNameToCutAndPaste_Thumbnail = tmp1.split('/')[1].split('?')[0];

            //        var form = $(thiz.element).closest('.budgetrequestform')[0];
            //        var bwBudgetRequestId_Destination = $(form)[0].getAttribute('bwbudgetrequestid');

            //        console.log('DEV: READY TO CALL WEB SERVICE [bwCutAndPaste_Attachment]. In bwAttachments.js.renderAndPopulateAttachments.dropzone.drop(). fileNameToCutAndPaste_Thumbnail: ' + fileNameToCutAndPaste_Thumbnail + ', bwBudgetRequestId_Origin: ' + bwBudgetRequestId_Origin + ', bwBudgetRequestId_Destination: ' + bwBudgetRequestId_Destination);

            //        var data = {
            //            bwParticipantId_LoggedIn: participantId,
            //            bwActiveStateIdentifier: activeStateIdentifier,
            //            bwWorkflowAppId_LoggedIn: workflowAppId,

            //            bwWorkflowAppId: workflowAppId,

            //            FileNameToCutAndPaste: fileNameToCutAndPaste_Thumbnail,
            //            bwBudgetRequestId_Origin: bwBudgetRequestId_Origin,
            //            bwBudgetRequestId_Destination: bwBudgetRequestId_Destination,

            //            bwParticipantId: participantId,
            //            bwParticipantFriendlyName: participantFriendlyName,
            //            bwParticipantEmail: participantEmail
            //        };

            //        var operationUri = thiz.options.operationUriPrefix + '_files/' + 'bwCutAndPaste_Attachment'; // _files allows us to use nginx to route these to a dedicated file server.
            //        $.ajax({
            //            url: operationUri,
            //            type: 'POST',
            //            data: data,
            //            headers: { "Accept": "application/json; odata=verbose" },
            //            success: function (results) {
            //                try {

            //                    if (results.status != 'SUCCESS') {

            //                        var msg = 'Error in bwAttachments.js.renderAndPopulateAttachments.dropzone.drop.bwCutAndPaste_Attachment(). ' + results.status + ': ' + results.message;
            //                        console.log(msg);
            //                        displayAlertDialog_Persistent(msg);

            //                    }

            //                    //
            //                    // Now we have to call "renderAndPopulateAttachments()" for both of the requests.
            //                    //

            //                    var requestCounter = 0;

            //                    var forms = $(document).find('.budgetrequestform');

            //                    for (var i = 0; i < forms.length; i++) {
            //                        var bwBudgetRequestId_Temp = $(forms)[i].getAttribute('bwbudgetrequestid');
            //                        if ((bwBudgetRequestId_Temp == bwBudgetRequestId_Origin) || (bwBudgetRequestId_Temp == bwBudgetRequestId_Destination)) {
            //                            requestCounter += 1;
            //                            $(forms[i]).find('.bwAttachments').bwAttachments('renderAndPopulateAttachments'); // Call this method for this specific widget. This will re-generate the gold colored drag-and-drop section... etc...
            //                        }
            //                    }

            //                    if (requestCounter == 2) {

            //                        // No need to indicate anything to the user. They will get visual feedback when the request attachments are rendered.
            //                        console.log('COMPLETED CUT AND PASTE xcx90809898. requestCounter: ' + requestCounter + ', results: ' + JSON.stringify(results));

            //                    } else {
            //                        console.log('ERROR COMPLETING CUT AND PASTE xcx90809898. Expected a value of 2 for requestCounter: ' + requestCounter + ', results: ' + JSON.stringify(results));
            //                        alert('ERROR COMPLETING CUT AND PASTE xcx90809898. Expected a value of 2 for requestCounter: ' + requestCounter + ', results: ' + JSON.stringify(results));
            //                    }

            //                } catch (e) {
            //                    console.log('Exception in bwAttachments.js.renderAndPopulateAttachments.dropzone.drop():2: ' + e.message + ', ' + e.stack);
            //                    displayAlertDialog('Exception in bwAttachments.js.renderAndPopulateAttachments.dropzone.drop():2: ' + e.message + ', ' + e.stack);
            //                    $(this.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwAttachments.js.renderAndPopulateAttachments.dropzone.drop():2: ' + e.message + ', ' + e.stack;
            //                }
            //            },
            //            error: function (data, errorCode, errorMessage) {
            //                $('#divWorkingOnItDialog').dialog('close'); // Close the "Working on it..." dialog.
            //                console.log('Error in bwAttachments.js.renderAndPopulateAttachments.dropzone.drop(): ' + errorMessage);
            //                debugger;
            //                if (errorMessage == 'timeout') {
            //                    displayAlertDialog('The file server could not be contacted. Please try again in a few minutes.');
            //                } else {
            //                    displayAlertDialog('Error in bwAttachments.js.renderAndPopulateAttachments.dropzone.drop(): ' + errorMessage);
            //                }
            //            }
            //        });

            //    } else {

            //        fetch(imgSrc)
            //            .then(function (res) {
            //                try {
            //                    res.blob();
            //                } catch (e) {
            //                    alert('Exception xcx21312312 ' + e.message + ', ' + e.stack);

            //                    imgElement.remove(); // Remove the img element which is displaying the pasted image.
            //                }
            //            })
            //            .then(function (blob) {
            //                try {
            //                    const f = new File([blob], 'dot.png', blob);

            //                    var fileInput = document.getElementById('inputFile_' + bwBudgetRequestId);

            //                    if (!fileInput) {

            //                        var imgSrc2 = $(thiz.element).find('#dropzone1 img')[0].src;

            //                        alert('Error in bwAttachments.js.renderAndPopulateAttachments.dropzone.drop(). Cannot find element: inputFile_' + bwBudgetRequestId + ', imgSrc2: ' + imgSrc2);







            //                    }

            //                    var tst = new DataTransfer();
            //                    tst.items.add(f);
            //                    fileInput.files = tst.files;

            //                    console.log('fileInput.files.length: ' + fileInput.files.length);

            //                    //imgElement.remove(); // Remove the img element which is displaying the pasted image.

            //                    //thiz.uploadAttachment('newrequestattachments', requestDialogId, bwBudgetRequestId);
            //                    thiz.uploadAttachment('newrequestattachments', null, bwBudgetRequestId);

            //                } catch (e) {
            //                    alert('Exception in bwAttachments.js.renderAndPopulateAttachments.dropzone.drop(). xcx215343: ' + e.message + ', ' + e.stack);

            //                    imgElement.remove(); // Remove the img element which is displaying the pasted image.
            //                }

            //            })
            //            .catch(function (e) {

            //                alert('Exception from psomise xcx87987 ' + e + ', Exception when fetching "' + imgSrc + '".');
            //                imgElement.remove(); // Remove the img element which is displaying the pasted image.

            //            });

            //    }

            //}

        } catch (e) {
            alert('Exception in drop xcx123124235: ' + e.message + ', ' + e.stack);
        }
    },

    renderHomePage: function () {
        try {
            console.log('In bwActiveMenu.js.renderHomePage().');
            //alert('In bwActiveMenu.js.renderHomePage().');

            //this.options.HomePage = true; // 6-15-2024
            this.renderMenu();

        } catch (e) {
            console.log('Exception in bwActiveMenu.js.renderHomePage(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu.js.renderHomePage(): ' + e.message + ', ' + e.stack);
        }
    },

    renderHomePageContent_Unauthenticated: function () {
        try {
            console.log('In bwActiveMenu.js.renderHomePageContent().');
            //alert('In bwActiveMenu.js.renderHomePageContent().');
            var thiz = this;

            var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
            if (!workflowAppTheme) { // Need to do this for the home page when not logged in.
                workflowAppTheme = 'brushedAluminum_orange';
            }

            var html = '';

            html += '                <div weightedheightvalue="40" class="' + workflowAppTheme + '_noanimation bwColoredMenuItem noanimation" style="">';
            html += '                    <div class="leftButtonText">';
            html += '                        <span id="spanErrorLink" style="display:none;font-size:x-large;color:yellow;font-family:Chunkfive, Georgia, Palatino, Times New Roman, serif;font-weight:bold;cursor:pointer;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;" onclick="cmdDisplayCommunicationsError();">Error!&nbsp;&nbsp;&nbsp;&nbsp;</span>';
            html += '                    </div>';
            html += '                </div>';
            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
            html += '                <div id="divLeftMenuTopSmallBar1" class="' + workflowAppTheme + '_noanimation bwColoredMenuItem noanimation" style="width: 100%; float:right; height:25px; background-color:#7788ff !important; color:white;font-family: \'Franklin Gothic Medium\', \'Arial Narrow\', Arial, sans-serif;display: flex !important;justify-content: flex-end !important;align-items: flex-end !important;"></div>';
            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
            html += '                <div weightedheightvalue="40" class="leftButton_inactive ' + workflowAppTheme + ' bwColoredMenuItem" style="" >';
            html += '                    <div class="leftButtonText">';
            html += '                    </div>';
            html += '                </div>';

            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
            html += '                <div xcx="xcx2143236" id="divWelcomeButton" weightedheightvalue="150" class="leftButton ' + workflowAppTheme + ' bwColoredMenuItem" style="display:none;background-color:darkkhaki;" ';
            html += '                   onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForButton\', this, \'HOME_UNAUTHENTICATED\');"';
            html += '                >';
            html += '                    <div class="leftButtonText">HOME</div>';
            html += '                </div>';
            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';

            html += '                <div weightedheightvalue="40" class="leftButton_inactive ' + workflowAppTheme + ' bwColoredMenuItem" style="" >';
            html += '                    <div class="leftButtonText">';
            html += '                    </div>';
            html += '                </div>';

            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
            html += '                <div id="divLeftMenuButton_About" weightedheightvalue="150" class="leftButton ' + workflowAppTheme + ' bwColoredMenuItem" style="display:none;background-color:khaki;" ';
            html += '                   onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForButton\', this, \'ABOUT\');"';
            html += '                >';
            html += '                    <div class="leftButtonText" xcx="xcx23427753">ABOUT</div>';
            html += '                </div>';
            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';

            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
            html += '                <div id="divVisualizationsButton" weightedheightvalue="40" class="leftButton_inactive ' + workflowAppTheme + ' bwColoredMenuItem" style="display:none;background-color:darkkhaki;" ';
            html += '                >';
            html += '                </div>';

            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
            html += '                <div id="divLeftMenuButton_ThisSoftware" weightedheightvalue="150" class="leftButton ' + workflowAppTheme + ' bwColoredMenuItem" style="display:none;background-color:khaki;" ';
            html += '                   onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForButton\', this, \'THIS_SOFTWARE\');"';
            html += '                >';
            html += '                    <div class="leftButtonText">THIS SOFTWARE</div>';
            html += '                </div>';

            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
            html += '                <div id="divLeftMenuButton_Documentation" weightedheightvalue="150" class="leftButton ' + workflowAppTheme + ' bwColoredMenuItem" style="display:none;background-color:khaki;" ';
            html += '                   onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForButton\', this, \'DOCUMENTATION\');"';
            html += '                >';
            html += '                    <div class="leftButtonText">DOCUMENTATION</div>';
            html += '                </div>';

            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';

            html += '                <div id="divContactButton" weightedheightvalue="40" class="leftButton_inactive ' + workflowAppTheme + ' bwColoredMenuItem" style="background-color:burlywood;" ';
            html += '                >';
            html += '                </div>';

            $('#tdLeftSideMenu').html(html);

            //
            // Select the correct menu button.
            //
            var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';
            $('.' + workflowAppTheme_SelectedButton).each(function (index, value) { // Make all of the buttons un-selected.
                $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
                $(this).addClass(workflowAppTheme).removeClass('bwMenuButton_Selected');
            });
            // Select the menu button.
            $('#divWelcomeButton').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);
            $('#divWelcomeButton').addClass('bwMenuButton_Selected');



            //
            //
            // TOP SECTION. This is always displayed.
            //
            //

            var html = '';

            html += '<span id="spanBwActiveMenu_WelcomeToThisVersionOfTheSoftware" xcx="xcx34325346" style="padding-left:1px;color:cornflowerblue;font-weight:normal;vertical-align:top;color:yellow;opacity:0.8;">';

            var welcomeToThisVersionOfTheSoftware = $('.bwAuthentication').bwAuthentication('option', 'WelcomeToThisVersionOfTheSoftware'); // The "WelcomeToThisVersionOfTheSoftware" message is stored in the bwAuthentication.js widget.
            html += welcomeToThisVersionOfTheSoftware;

            html += '</span>';

            html += '<div style="float:right;">';
            html += '   <div id="bwActiveMenu_bwAppThemeColorPicker1" style="padding:0 600px 0 0;width:90%;color:alicebue;"></div>';
            html += '</div>';

            html += '<br /><br />';

            html += '<span id="spanBwActiveMenu_HomePageHeading" xcx="xcx66683495" style="font-family: SFProDisplay-Regular, Helvetica, Arial, sans-serif;font-size: 38px;font-weight: bold;color:aliceblue;">';

            //html += 'Open-source software for managing, sharing, and collaborating, in a new, and easier way.'; // , with this forms, workflow, and inventory software.';
            //html += 'An open source way to see your entire organization, and what everyone is doing. <a href="/releases/march062023.zip">Download Now.</a>';
            //html += 'A way to see your entire organization, and what everyone is doing.';
            //html += 'Manage, share, and collaborate on your budget workflow, in a new and easier way.';

            var pageTitle = 'ShareAndCollaborate.com';

            html += pageTitle;

            html += '</span>';
            html += '<br />';

            html += '<h1 id="spanBwActiveMenu_HomePageSubHeading" xcx="xcx3398857" style="font-family: SFProDisplay-Regular, Helvetica, Arial, sans-serif;font-size: 28px;font-weight: normal;color:black;color:white;">';
            html += '   Your self-hosted network software social & organization space, with file-sharing, email, calendaring, collaboration, and more.';
            html += '   <br />';
            html += '</h1>';

            //html += '<br />';

            //html += '<span style="color:white;">So we are having some internet restriction issues here in Canada. Fear Not! Some of us will be fighting back. LATEST POST: If life is just a bit much and you need to just dance around for awhile, Pete Tong is still mixing it up! <a href="https://www.bbc.co.uk/sounds/play/m0022s2x" target="_blank">https://www.bbc.co.uk/sounds/play/m0022s2x</a></span>';

            //html += '<span style="font-family: SFProDisplay-Regular, Helvetica, Arial, sans-serif;font-size: 38px;font-weight: normal;">';
            ////html += '   A forms-based social network for your enterprise.';
            ////html += '       Manage, contribute, share, and collaborate in a new and easier way, with this forms, workflow, and inventory software.'; // removed 11-16-2022
            //html += '       Manage your organization\'s communications, digital assets, and security.';
            //html += '   <br />';
            ////html += '   <span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 28px;font-weight: normal;">';
            ////html += '       Manage, contribute, share, and collaborate in a new and easier way, with this forms, workflow, and inventory software.';
            ////html += '   </span>';
            ////html += '   <br />';
            //html += '   <span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 28px;font-weight: normal;">';
            //html += '       Collaborate, share, and contribute in a new and easier way, with this forms, workflow, and inventory software.';
            //html += '       <br />';
            //html += '       Involve your stakeholders, subject matter experts, and managers. Optimize procurement, capex/opex, quoting... any process that requires multiple approvals. ';
            //html += '       <br />';

            //html += '   </span>';

            //html += '   <br />';
            //html += '</span>';

            //
            //
            // end: TOP SECTION. This is always displayed.
            //
            //

            var rememberme = localStorage ? localStorage['customlogonrememberme'] : '';

            if (rememberme != 'selected') {

                html += this.homePageContent_Unauthenticated_rememberme_notselected_HTML();

            } else {

                html += this.homePageContent_Unauthenticated_rememberme_selected_HTML();

            }






            //html += `           
            //                        <div style="opacity: 0.7;color:white;font-size:30pt;text-align:left;">This is the new social network. Free! (as in freedom)<br />Find people that share here:<br /><br />Todd Hiltz posted this video 9-26-2024, 5-45pm adt.<br /><br />
            //                            <video controls="controls" style="width:640px;">
            //                                <source src="video/Eric Prydz - Generate.mp4" type="video/mp4" />
            //                            </video>
            //                        </div>

            //                        <div style="color:black;font-size:30pt;text-align:left;">
            //                            Sign up to participate. Comments and all that stuff coming soon.
            //                        </div>`;









            //
            //
            // BOTTOM section.
            //
            //

            html += '<br /><br /><br /><br /><br />';
            html += '<hr style="border:0 none; border-bottom: 1px solid lightgray;" />';
            html += '<div style="vertical-align:bottom;">';
            html += '   <table style="width:100%;">';
            html += '       <tr>';
            html += '           <td style="text-align:left;padding-left:10px;">';
            html += '               <img src="sharepoint/sharepoint.png" style="height:50px;width:50px;vertical-align:middle;" />';
            html += '               <a class="bwLink" href="sharepoint/index.html">The SharePoint Budget Workflow Add-In details are here.</a>';
            html += '           </td>';
            html += '           <td></td>';
            html += '           <td style="text-align:right;">';
            html += '               &nbsp;&nbsp;&nbsp;&nbsp;';
            html += '               <a onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForButton\', this, \'THIS_SOFTWARE\');" style="text-decoration:underline;cursor:pointer;">Free and Open Source, fully licensed under GNU AGPLv3</a>&nbsp;&nbsp;&nbsp;&nbsp;';
            html += '               <a href="privacy.html" target="_blank" class="bwLink">Privacy</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="terms-of-use.html" target="_blank" class="bwLink">Terms of use</a>';
            html += '                   &nbsp;&nbsp;&nbsp;&nbsp;';
            html += '           </td>';
            html += '       </tr>';
            html += '   </table>';
            html += '</div>';

            //
            //
            // end: BOTTOM section.
            //
            //

            $('#divPageContent1').html(html);

            if (rememberme != 'selected') {
                // Do nothing.
            } else {

                // Hook up events.
                var dropzone = document.getElementById('bwActiveMenu_Unauthenticated_Home_dropzone');

                if (dropzone) {
                    dropzone.addEventListener('drop', function (e) {
                        try {
                            console.log('In renderHomePageContent_Unauthenticated.dropzone.drop().');
                            displayAlertDialog_Persistent('In renderHomePageContent_Unauthenticated.dropzone.drop(). xcx23124.');
                            e.preventDefault();

                            var gotData;
                            if (e.clipboardData) {
                                console.log('In renderHomePageContent_Unauthenticated.dropzone.drop(). Object is event.clipboardData.');
                                gotData = true;
                            } else if (e.dataTransfer) {
                                console.log('In renderHomePageContent_Unauthenticated.dropzone.drop(). Object is event.dataTransfer.');
                                gotData = true;
                            } else if (window.clipboardData) {
                                console.log('In renderHomePageContent_Unauthenticated.dropzone.drop(). Object is window.clipboardData.');
                                gotData = true;
                            } else {

                                if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                                    alert('FIREFOX BROWSER CANNOT DRAG-AND-DROP EXTERNAL FILES. THERE IS A WORK-AROUND: Please right click on your source file, and choose "COPY". Subsequently, right click here and choose "PASTE".');
                                } else {
                                    alert('Error in renderHomePageContent_Unauthenticated.js.dropzone.drop(). Could not find a valid DataTransfer object. e: ' + JSON.stringify(e) + ', navigator.userAgent: ' + navigator.userAgent);
                                }

                            }

                            if (gotData == true) {
                                thiz.dodrop(e, bwBudgetRequestId);
                            } else {
                                alert('Error in renderHomePageContent_Unauthenticated.js.dropzone.drop(). Could not find a valid DataTransfer object.');
                            }

                        } catch (e) {
                            var msg = 'Exception in renderHomePageContent_Unauthenticated.js.dropzone.drop(): ' + e.message + ', ' + e.stack;
                            console.log(msg);
                            alert(msg);
                        }
                    });

                    dropzone.addEventListener('paste', function (e) {
                        try {
                            console.log('In renderHomePageContent_Unauthenticated.dropzone.paste().');
                            e.preventDefault();
                            var thiz = this;

                            var gotData;
                            if (e.clipboardData) {
                                console.log('In renderHomePageContent_Unauthenticated.dropzone.paste(). Object is event.clipboardData.');
                                gotData = true;
                            } else if (e.dataTransfer) {
                                console.log('In renderHomePageContent_Unauthenticated.dropzone.paste(). Object is event.dataTransfer.');
                                gotData = true;
                            } else if (window.clipboardData) {
                                console.log('In renderHomePageContent_Unauthenticated.dropzone.paste(). Object is window.clipboardData.');
                                gotData = true;
                            } else {

                                if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                                    alert('FIREFOX BROWSER CANNOT DRAG-AND-DROP EXTERNAL FILES. THERE IS A WORK-AROUND: Please right click on your source file, and choose "COPY". Subsequently, right click here and choose "PASTE".');
                                } else {
                                    alert('Error in renderHomePageContent_Unauthenticated.js.dropzone.paste(). Could not find a valid DataTransfer object. e: ' + JSON.stringify(e) + ', navigator.userAgent: ' + navigator.userAgent);
                                }

                            }

                            var bwBudgetRequestId = 'xcx232356666';
                            if (gotData == true) {
                                $('.bwActiveMenu:first').bwActiveMenu('dodrop', e, bwBudgetRequestId);
                            } else {
                                alert('Error in renderHomePageContent_Unauthenticated.js.dropzone.paste(). Could not find a valid DataTransfer object.');
                            }

                        } catch (e) {
                            var msg = 'Exception in renderHomePageContent_Unauthenticated.js.dropzone.paste(): ' + e.message + ', ' + e.stack;
                            console.log(msg);
                            alert(msg);
                        }
                    });

                }

            }







            //
            // bwAppThemeColorPicker.js widget may not be loaded yet, so doing this:
            //

            if (typeof ($.bw.bwAppThemeColorPicker) != 'undefined') {

                $('#bwActiveMenu_bwAppThemeColorPicker1').bwAppThemeColorPicker({});

            } else {

                setTimeout(function () {

                    // Try again. Try #1.
                    if (typeof ($.bw.bwAppThemeColorPicker) != 'undefined') {

                        $('#bwActiveMenu_bwAppThemeColorPicker1').bwAppThemeColorPicker({});

                    } else {

                        setTimeout(function () {

                            // Try again. Try #2.
                            if (typeof ($.bw.bwAppThemeColorPicker) != 'undefined') {

                                $('#bwActiveMenu_bwAppThemeColorPicker1').bwAppThemeColorPicker({});

                            } else {

                                setTimeout(function () {

                                    // Try again. Try #3.
                                    if (typeof ($.bw.bwAppThemeColorPicker) != 'undefined') {

                                        $('#bwActiveMenu_bwAppThemeColorPicker1').bwAppThemeColorPicker({});

                                    }

                                }, 5000);

                            }

                        }, 1000);

                    }

                }, 500);

            }

            //
            // bwHomepageClock.js widget may not be loaded yet, so doing this:
            //

            if (typeof ($.bw.bwHomepageClock) != 'undefined') {

                $('#bwActiveMenu_HomepageClock').bwHomepageClock({});

            } else {

                setTimeout(function () {

                    // Try again. Try #1.
                    if (typeof ($.bw.bwHomepageClock) != 'undefined') {

                        $('#bwActiveMenu_HomepageClock').bwHomepageClock({});

                    } else {

                        setTimeout(function () {

                            // Try again. Try #2.
                            if (typeof ($.bw.bwHomepageClock) != 'undefined') {

                                $('#bwActiveMenu_HomepageClock').bwHomepageClock({});

                            } else {

                                setTimeout(function () {

                                    // Try again. Try #3.
                                    if (typeof ($.bw.bwAppThemeColorPicker) != 'undefined') {

                                        $('#bwActiveMenu_HomepageClock').bwHomepageClock({});

                                    }

                                }, 5000);

                            }

                        }, 1000);

                    }

                }, 500);

            }

            this.adjustLeftSideMenu('In renderHomePageContent_Unauthenticated(). xcx345565', false);





            //
            //
            // THIS IS WHERE HOME_UNAUTHENTICATED GETS RENDERED. 7-4-2024.
            //
            //

            console.log('xcx23124-4. Calling toggleVideoBackgroundExperiment().');
            thiz.toggleVideoBackgroundExperiment(true);





            console.log('Unauthenticated context menu is currently turned off. HOME_UNAUTHENTICATED.');
            //var createContextMenu = function () {

            //    //
            //    //
            //    // THIS IS THE BEGINNING of the cool looking context menu. For the moment using "jQuery contextMenu" farther below, but will use the 
            //    //   custom one I am making eventually. See request CODE-240236. 7-5-2024.
            //    //
            //    //

            //    //                window.addEventListener('contextmenu', function (event) {

            //    //                    var div = document.getElementById('bwActiveMenu_ContextMenu');
            //    //                    if (!div) {

            //    //                        div = document.createElement('div');
            //    //                        div.id = 'bwActiveMenu_ContextMenu';
            //    //                        div.style.display = 'none';
            //    //                        document.body.appendChild(div); // Place at end of document

            //    //                        var html = '';

            //    //                        html += `

            //    //<div style="height:25px;width:380px;" class="leftButton brushedAluminum_orange divPurchaseNowButton">               Follow at my Patreon            </div>




            //    //                                `;

            //    //                        div.innerHTML = html;

            //    //                    }

            //    //                    $('#bwActiveMenu_ContextMenu').dialog({
            //    //                        position:
            //    //                        {
            //    //                            my: 'left',
            //    //                            at: 'right',
            //    //                            of: event
            //    //                        },
            //    //                        modal: true,
            //    //                        resizable: false,
            //    //                        closeText: "Cancel",
            //    //                        closeOnEscape: true, // Hit the ESC key to hide! Yeah!
            //    //                        width: "300", //"570px",
            //    //                        dialogClass: "no-close", // No close button in the upper right corner.
            //    //                        hide: false, // This means when hiding just disappear with no effects.
            //    //                        open: function () {
            //    //                            $('.ui-widget-overlay').bind('click', function () {
            //    //                                $("#bwActiveMenu_ContextMenu").dialog('close');
            //    //                            });
            //    //                        }
            //    //                    });

            //    //                    // Hide the title bar.
            //    //                    $("#bwActiveMenu_ContextMenu").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();


            //    //                    //displayAlertDialog('xcx213123123');
            //    //                    event.preventDefault();


            //    //                });


            //    console.log('xcx233123 creating unauthenticated context menu.');

            //    $.contextMenu('destroy');// Do this first to make sure an old one isn't hanging around.
            //    // This is our right-click context menu. MIT license and code at: https://swisnl.github.io/jQuery-contextMenu/demo/trigger-custom.html
            //    $.contextMenu({
            //        //selector: '.context_menu_requestformellipses',
            //        selector: 'body',
            //        callback: function (key, options) {

            //            if (key == 'signin') {

            //                console.log('signin');
            //                $('.bwAuthentication').bwAuthentication('logonWith_BudgetWorkflow_autologon', 'VIEW_HOME');

            //            } else if (key == 'signinandviewemail') {

            //                console.log('signinandviewemail');
            //                $('.bwAuthentication').bwAuthentication('logonWith_BudgetWorkflow_autologon', 'VIEW_EMAIL_INBOX');

            //            } else if (key == 'signinandcreatenewemail') {

            //                console.log('signinandcreatenewemail');
            //                $('.bwAuthentication').bwAuthentication('logonWith_BudgetWorkflow_autologon', 'VIEW_EMAIL_NEW');

            //            } else if (key == 'pastehere') {

            //                console.log('pastehere');
            //                $('.bwAuthentication').bwAuthentication('xxlogonWith_BudgetWorkflow_autologon', 'xxVIEW_EMAIL_NEW'); // $('#divBwSwipeFromTopPanel').dialog('close');

            //            } else if (key == 'viewuser') {

            //                console.log('viewuser');
            //                $('.bwAuthentication').bwAuthentication('quickMenu_ViewUser');

            //            } else if (key == 'favoritelinks') {

            //                console.log('favoritelinks');
            //                $('.bwAuthentication').bwAuthentication('quickMenu_FavoriteLinks');

            //            } else if (key == 'playmusic') {

            //                console.log('playmusic');
            //                $('.bwAuthentication').bwAuthentication('quickMenu_PlayMusic');

            //            } else if (key == 'watchvideo') {

            //                console.log('watchvideo');
            //                $('.bwAuthentication').bwAuthentication('quickMenu_WatchVideo');

            //            }
            //        },
            //        items: {
            //            "signin": {
            //                name: "Sign In", icon: "edit"
            //            },
            //            "signinandviewemail": {
            //                name: "View Email", icon: "edit"
            //            },
            //            "signinandcreatenewemail": {
            //                name: "New Email", icon: "edit"
            //            },
            //            "pastehere": {
            //                name: "PASTE HERE", icon: "edit"
            //            },
            //            "viewuser": {
            //                name: "View User", icon: "edit"
            //            },
            //            "favoritelinks": {
            //                name: "Favorite Links", icon: "edit"
            //            },
            //            "playmusic": {
            //                name: "Play Music", icon: "edit"
            //            },
            //            "watchvideo": {
            //                name: "Watch Video", icon: "edit"
            //            }
            //        }
            //    });
            //    // End: This is our right-click context menu.

            //};

            //if (typeof ($.contextMenu) != 'undefined') {

            //    createContextMenu();

            //} else {

            //    setTimeout(function () {

            //        // Try again. Try #1.
            //        if (typeof ($.contextMenu) != 'undefined') {

            //            createContextMenu();

            //        } else {

            //            setTimeout(function () {

            //                // Try again. Try #2.
            //                if (typeof ($.contextMenu) != 'undefined') {

            //                    createContextMenu();

            //                } else {

            //                    setTimeout(function () {

            //                        // Try again. Try #3.
            //                        if (typeof ($.contextMenu) != 'undefined') {

            //                            createContextMenu();

            //                        }

            //                    }, 5000);

            //                }

            //            }, 1000);

            //        }

            //    }, 500);

            //}






























            //
            // Ping the server to make sure it is running. If not, put a message on the screen.
            //
            console.log('In bwActiveMenu.js.renderHomePageContent(). Ping the server to make sure it is running. If not, put a message on the screen.');

            $.ajax({
                url: this.options.operationUriPrefix + "_bw/servicescheck/ALL",
                type: "GET",
                timeout: 2000, // This is 2 seconds, which determines the responsiveness of the application. This seems like a good setting so far.
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (results) {
                    try {

                        console.log('PERFORMED THE SERVICE CHECK. The service responded at ' + thiz.options.operationUriPrefix + ', results: ' + JSON.stringify(results));
                        //alert('The service responded at ' + thiz.options.operationUriPrefix + ', results: ' + JSON.stringify(results));

                        //alert('Calling page_Load() from bwActiveMenu()');
                        //page_Load();

                    } catch (e) {
                        console.log('Exception in bwActiveMenu.js.renderHomePageContent():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwActiveMenu.js.renderHomePageContent():2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (results) {
                    try {

                        if (results.statusText == 'timeout') {

                            // If we get here, we don't know for sure that the web services are not responding, because:
                            // - The database test query could make it take too long.
                            // - The file services check could make it take too long.
                            console.log('In bwActiveMenu.js.renderHomePageContent.error(). Timeout. Test inconclusive.');

                            // Display the Service Unavailable message on the home screen.

                            //displayAlertDialog_Persistent('xcx2296324126-1. ' + thiz.options.ServiceUnavailableMessage); // 5-16-2024.

                            var html = '';

                            html += '<span style="font-size:25pt;font-weight:bold;color:tomato;">';
                            var serviceUnavailableMessage = $('.bwAuthentication').bwAuthentication('option', 'ServiceUnavailableMessage'); // The "ServiceUnavailableMessage" message is stored in the bwAuthentication.js widget.
                            html += '   <br />' + serviceUnavailableMessage;
                            html += '   <span style="cursor:pointer;" alt="" title="Timeout. Test inconclusive.">Ⓘ</span>';
                            html += '   <br />';
                            html += '</span>';

                            //
                            // NO LONGER DISPLAYIMNG SERVICE UNAVAILABLE ON THE HOME PAGE in the [divSignInOrSignUpIndexPageButtons] element.
                            //
                            console.log('NO LONGER DISPLAYIMNG SERVICE UNAVAILABLE ON THE HOME PAGE in the [divSignInOrSignUpIndexPageButtons] element. xcx1232352-1.');
                            //document.getElementById('divSignInOrSignUpIndexPageButtons').innerHTML = html;

                        } else if (results.statusText == 'Backend fetch failed') {

                            console.log('In bwActiveMenu.js.renderHomePageContent.error(). Varnish error. Backend fetch failed.');

                            // Display the Service Unavailable message on the home screen.
                            displayAlertDialog_Persistent('xcx2296324126-2. ' + thiz.options.ServiceUnavailableMessage); // 5-16-2024.

                            var html = '';

                            html += '<span style="font-size:25pt;font-weight:bold;color:tomato;">';
                            var serviceUnavailableMessage = $('.bwAuthentication').bwAuthentication('option', 'ServiceUnavailableMessage'); // The "ServiceUnavailableMessage" message is stored in the bwAuthentication.js widget.
                            html += '   <br />' + serviceUnavailableMessage;
                            html += '   <span style="cursor:pointer;" alt="" title="Varnish error. Backend fetch failed.">Ⓘ</span>';
                            html += '   <br />';
                            html += '</span>';

                            //
                            // NO LONGER DISPLAYIMNG SERVICE UNAVAILABLE ON THE HOME PAGE in the [divSignInOrSignUpIndexPageButtons] element.
                            //
                            console.log('NO LONGER DISPLAYIMNG SERVICE UNAVAILABLE ON THE HOME PAGE in the [divSignInOrSignUpIndexPageButtons] element. xcx1232352-2.');
                            //document.getElementById('divSignInOrSignUpIndexPageButtons').innerHTML = html;

                        } else {

                            console.log('In bwActiveMenu.js.renderHomePageContent.error(). results: ' + JSON.stringify(results));

                            // Display the Service Unavailable message on the home screen.
                            displayAlertDialog_Persistent('xcx2296324126-3. ' + thiz.options.ServiceUnavailableMessage); // 5-16-2024.

                            var html = '';

                            html += '<span style="font-size:25pt;font-weight:bold;color:tomato;">';
                            var serviceUnavailableMessage = $('.bwAuthentication').bwAuthentication('option', 'ServiceUnavailableMessage'); // The "ServiceUnavailableMessage" message is stored in the bwAuthentication.js widget.
                            html += '   <br />' + serviceUnavailableMessage;
                            html += '   <span style="cursor:pointer;" alt="" title="Results: ' + JSON.stringify(results, null, 2) + '">Ⓘ</span>';
                            html += '   <br />';
                            html += '</span>';

                            //
                            // NO LONGER DISPLAYIMNG SERVICE UNAVAILABLE ON THE HOME PAGE in the [divSignInOrSignUpIndexPageButtons] element.
                            //
                            console.log('NO LONGER DISPLAYIMNG SERVICE UNAVAILABLE ON THE HOME PAGE in the [divSignInOrSignUpIndexPageButtons] element. xcx1232352-3.');
                            //document.getElementById('divSignInOrSignUpIndexPageButtons').innerHTML = html;

                        }

                    } catch (e) {
                        console.log('Exception in bwActiveMenu.js.renderHomePageContent.error(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwActiveMenu.js.renderHomePageContent.error(): ' + e.message + ', ' + e.stack);
                    }
                }
            });
            //
            // end: Ping the server to make sure it is running. If not, put a message on the screen.
            //



































            if (document.getElementById('cbCustomLogonRememberMe')) {
                // Call this so we have it displaying the correct value of checked/not checked.
                var rememberme;
                rememberme = localStorage ? localStorage['customlogonrememberme'] : '';
                if (rememberme == 'selected') {
                    document.getElementById('cbCustomLogonRememberMe').checked = true;
                } else {
                    document.getElementById('cbCustomLogonRememberMe').checked = false;
                }
            }

            try {
                //debugger;
                if (document.getElementById('spanAzureADConnectionDetails')) {
                    // Bind the click event. This has to happen here because this module will be instantiated after the link is presented on the screen. A race condition I suppose.
                    //
                    $('#spanAzureADConnectionDetails').off('click').click(function (error) {
                        console.log('In bwAuthentication._create.spanAzureADConnectionDetails.click().');
                        if (document.getElementById('spanAzureADConnectionDetails').innerHTML.indexOf('Microsoft') > -1) {
                            thiz.displayAzureADConnectionDetails();
                        } else {
                            thiz.displayBudgetWorkflowTwoFactorAuthenticationDetails();
                        }
                    });
                }
            } catch (e) { }

        } catch (e) {
            console.log('Exception in bwActiveMenu.js.renderHomePageContent(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu.js.renderHomePageContent(): ' + e.message + ', ' + e.stack);
        }
    },
    homePageContent_Unauthenticated_rememberme_selected_HTML: function () {
        try {
            console.log('In bwActiveMenu.js.homePageContent_Unauthenticated_rememberme_selected_HTML().');
            //alert('In bwActiveMenu.js.homePageContent_Unauthenticated_rememberme_selected_HTML().');

            var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');

            var html = '';

            html += '<div id="unauthenticated_rememberme_buttons_on_home_page" style="display:inline;">';
            //<span style="color:white;">Your username and password have been remembered in this browser, so that you can quickly access these things:</span>
            html += `
                        <br /><br />
                        <table>
                            <tr>
                                <td style="vertical-align:top;">`;
            html += `           <table >
                                        <tr onclick="$('.bwAuthentication').bwAuthentication('logonWith_BudgetWorkflow_autologon', 'VIEW_HOME');" style="cursor:pointer;">
                                            <td style="height:105px;width:15px;" class="brushedAluminum_orange">&nbsp;</td>
                                            <td style="height:105px;width:5px;opacity:0;">&nbsp;</td>
                                            <td>
                                                <div class="brushedAluminum_orange autologonButton" style="height:61px;width:315px;display:inline-block;padding-left:15px;padding-top:25px;padding-bottom:0;color:white;font-size:24pt;">HOME</div>
                                            </td>
                                        </tr>
                                    </table>`;
            html += '           <br />';
            html += '           <br />';
            html += `           <table >
                                        <tr onclick="$('.bwAuthentication').bwAuthentication('logonWith_BudgetWorkflow_autologon', 'VIEW_NEW_REQUEST');" style="cursor:pointer;">
                                            <td style="height:105px;width:15px;" class="brushedAluminum_orange">&nbsp;</td>
                                            <td style="height:105px;width:5px;opacity:0;">&nbsp;</td>
                                            <td>
                                                <div class="brushedAluminum_orange autologonButton" style="height:61px;width:315px;display:inline-block;padding-left:15px;padding-top:25px;padding-bottom:0;color:white;font-size:24pt;">NEW REQUEST</div>
                                            </td>
                                        </tr>
                                    </table>`;
            html += '           <br />';
            html += '           <br />';
            html += `           <table >
                                        <tr onclick="$('.bwAuthentication').bwAuthentication('logonWith_BudgetWorkflow_autologon', 'VIEW_EMAIL_INBOX');" style="cursor:pointer;">
                                            <td style="height:105px;width:15px;" class="brushedAluminum_orange">&nbsp;</td>
                                            <td style="height:105px;width:5px;opacity:0;">&nbsp;</td>
                                            <td>
                                                <div class="brushedAluminum_orange autologonButton" style="height:61px;width:315px;display:inline-block;padding-left:15px;padding-top:25px;padding-bottom:0;color:white;font-size:24pt;">EMAIL</div>
                                            </td>
                                        </tr>
                                    </table>`;
            html += '           <br />';
            html += '           <br />';

            html += `           <table >
                                        <tr onclick="$('.bwAuthentication').bwAuthentication('logonWith_BudgetWorkflow_autologon', 'VIEW_CALENDAR');" style="cursor:pointer;">
                                            <td style="height:105px;width:15px;" class="brushedAluminum_orange">&nbsp;</td>
                                            <td style="height:105px;width:5px;opacity:0;">&nbsp;</td>
                                            <td>
                                                <div class="brushedAluminum_orange autologonButton" style="height:61px;width:315px;display:inline-block;padding-left:15px;padding-top:25px;padding-bottom:0;color:white;font-size:24pt;">CALENDAR</div>
                                            </td>
                                        </tr>
                                    </table>`;
            html += '           <br />';
            html += '           <br />';

            //html += `           <table >
            //                            <tr onclick="$('.bwAuthentication').bwAuthentication('quickMenu_Calendar');" style="cursor:pointer;">
            //                                <td style="height:105px;width:15px;display:inline-block;" class="brushedAluminum_orange">&nbsp;</td>
            //                                <td style="height:105px;width:5px;opacity:0;display:inline-block;">&nbsp;</td>
            //                                <td class="brushedAluminum_orange autologonButton" style="height:61px;width:315px;display:inline-block;padding-left:15px;padding-top:25px;padding-bottom:0;color:white;font-size:24pt;" >CALENDAR [like g c]</td>
            //                            </tr>
            //                        </table>`;
            //html += '           <br />';
            //html += '           <br />';
            //html += `           <table >
            //                            <tr onclick="$('.bwAuthentication').bwAuthentication('quickMenu_PlayMusic');" style="cursor:pointer;">
            //                                <td style="height:105px;width:15px;display:inline-block;" class="brushedAluminum_orange">&nbsp;</td>
            //                                <td style="height:105px;width:5px;opacity:0;display:inline-block;">&nbsp;</td>
            //                                <td class="brushedAluminum_orange autologonButton" style="height:61px;width:315px;display:inline-block;padding-left:15px;padding-top:25px;padding-bottom:0;color:white;font-size:24pt;" >MUSIC</td>
            //                            </tr>
            //                        </table>`;
            //html += '           <br />';
            //html += '           <br />';

            if (developerModeEnabled == true) {
                html += `       <table >
                                        <tr onclick="$('.bwAuthentication').bwAuthentication('logonWith_BudgetWorkflow_autologon', 'VIEW_EMAIL_NEW');" style="cursor:pointer;">
                                            <td style="height:105px;width:15px;" class="brushedAluminum_orange">&nbsp;</td>
                                            <td style="height:105px;width:5px;opacity:0;">&nbsp;</td>
                                            <td>
                                                <div class="brushedAluminum_orange autologonButton" style="height:61px;width:315px;display:inline-block;padding-left:15px;padding-top:25px;padding-bottom:0;color:white;font-size:24pt;">New Email</div>
                                            </td>
                                        </tr>
                                    </table>`;
                html += '       <br />';
                html += '       <br />';
            }

            html += `           <table >
                                        <tr onclick="$('.bwAuthentication').bwAuthentication('displaySignInDialog', true);" style="cursor:pointer;">
                                            <td style="height:105px;width:15px;" class="brushedAluminum_orange">&nbsp;</td>
                                            <td style="height:105px;width:5px;opacity:0;">&nbsp;</td>
                                            <td>
                                                <div class="brushedAluminum_orange autologonButton" style="height:61px;width:315px;display:inline-block;padding-left:15px;padding-top:25px;padding-bottom:0;color:white;font-size:24pt;">SIGN IN</div>
                                            </td>
                                        </tr>
                                    </table>`;
            html += '           <br />';
            html += '           <br />';
            html += `           <table >
                                        <tr onclick="$('.bwAuthentication').bwAuthentication('displayCreateFreeAccountDialog', true);" style="cursor:pointer;">
                                            <td style="height:105px;width:15px;" class="brushedAluminum_orange">&nbsp;</td>
                                            <td style="height:105px;width:5px;opacity:0;">&nbsp;</td>
                                            <td>
                                                <div class="brushedAluminum_orange autologonButton" style="height:61px;width:315px;display:inline-block;padding-left:15px;padding-top:25px;padding-bottom:0;color:white;font-size:24pt;">SIGN UP</div>
                                            </td>
                                        </tr>
                                    </table>`;
            html += '           <br />';
            html += '           <br />';
            html += `           <table >
                                        <tr onclick="window.location='https://patreon.com/shareandcollaborate';" style="cursor:pointer;">
                                            <td style="height:105px;width:15px;" class="brushedAluminum_orange">&nbsp;</td>
                                            <td style="height:105px;width:5px;opacity:0;">&nbsp;</td>
                                            <td>
                                                <div class="brushedAluminum_orange autologonButton" style="height:61px;width:315px;display:inline-block;padding-left:15px;padding-top:25px;padding-bottom:0;color:white;font-size:24pt;">Follow at Patreon</div>
                                            </td>
                                        </tr>
                                    </table>`;
            html += '           <br />';
            //html += `           <table >
            //                            <tr onclick="window.location='https://patreon.com/shareandcollaborate';" style="cursor:pointer;">
            //                                <td style="height:105px;width:15px;display:inline-block;" class="brushedAluminum_orange">&nbsp;</td>
            //                                <td style="height:105px;width:5px;opacity:0;display:inline-block;">&nbsp;</td>
            //                                <td class="brushedAluminum_orange autologonButton" style="height:61px;width:315px;display:inline-block;padding-left:15px;padding-top:25px;padding-bottom:0;color:white;font-size:24pt;" >Set Alarm/Training Schedule.</td>
            //                            </tr>
            //                        </table>`;
            //html += '           <br />';

            html += `       </td>
                                <td xcx="xcx1231244432-1" style="width:35px;"></td>
                                <td style="vertical-align:top;">`;




            // THIS IS TH EDROPZONE@!!!!!!!!!!!!! BRING IT BACK SOMEDAY!!!!!!!!
            //html += `           <div id="bwActiveMenu_Unauthenticated_Home_dropzone" allow="clipboard-read;clipboard-write;" onclick="document.getElementById(\'inputFile_bwActiveMenu_Unauthenticated_Home\').click();" contenteditable="true" style="opacity:0.5;height:480px;border:10px solid goldenrod;color:gray;font-size:10pt;cursor:pointer;background-image:url(\'/images/upload_arrow_icon.png\');background-repeat: no-repeat;background-size: 130px;text-align: center;padding: 5px; background-position: center center;">
            //                        <div style="color:white;">Click, right-click, or drag-and-drop to upload files.</div>
            //                    </div>`;



            //html += `           <div id="bwActiveMenu_Unauthenticated_Home_dropzone" allow="clipboard-read;clipboard-write;" onclick="document.getElementById(\'inputFile_bwActiveMenu_Unauthenticated_Home\').click();" contenteditable="true" style="opacity:0.5;height:480px;color:gray;font-size:10pt;cursor:pointer;background-image:url(\'/images/upload_arrow_icon.png\');background-repeat: no-repeat;background-size: 130px;text-align: center;padding: 5px; background-position: center center;">
            //                        <div style="color:white;font-size:30pt;text-align:left;">This is the new social network. Free! (as in freedom)<br />Find people that share here:<br /><br />Todd Hiltz posted this video 9-26-2024, 5-45pm adt.<br /><br />
            //                            <video controls="controls" style="width:640px;">
            //                                <source src="video/Eric Prydz - Generate.mp4" type="video/mp4" />
            //                            </video>
            //                        </div>
            //                    </div>`;



            //html += `           
            //                        <div style="color:white;font-size:30pt;text-align:left;">This is the new social network. Free! (as in freedom)<br />Find people that share here:<br /><br />Todd Hiltz posted this video 9-26-2024, 5-45pm adt.<br /><br />
            //                            <video controls="controls" style="width:640px;">
            //                                <source src="video/Eric Prydz - Generate.mp4" type="video/mp4" />
            //                            </video>
            //                        </div>

            //                        <div style="color:white;font-size:30pt;text-align:left;">
            //                            Sign up to participate. Comments and all that stuff coming soon.
            //                        </div>`;














            //html += '<form id="uploadForm_' + 'bwBudgetRequestId' + '" action="/" enctype="multipart/form-data" method="post">';

            //// These empty fields need to be here so they are forced to get sent to the web service before the file(s). This is important because we need these values to determine where we are saving the files.
            //html += '<input type="hidden" name="bwWorkflowAppId" value="" />';
            //html += '<input type="hidden" name="bwBudgetRequestId" value="" />';
            //html += '<input type="hidden" name="bwParticipantId" value="" />';
            //html += '<input type="hidden" name="bwParticipantEmail" value="" />';
            //html += '<input type="hidden" name="bwParticipantFriendlyName" value="" />';
            //html += '<input type="hidden" name="bwActiveStateIdentifier" value="" />';
            //html += '<input type="hidden" name="Filename" value="" />';
            //html += '<input type="hidden" name="Description" value="" />';
            //html += '<input type="hidden" name="ConvertToAPdf" value="" />';

            ////
            //// The "multiple" attribute in the input/file element below turns on the ability to select multiple items for the upload. THIS IS TURNED OFF FOR THE MOMENT UNTILL WE UPGRADE THE WEB SERVICE ETC. 4-15-2023.
            ////
            //console.log('The "multiple" attribute in the input/file element below turns on the ability to select multiple items for the upload. THIS IS TURNED OFF FOR THE MOMENT UNTILL WE UPGRADE THE WEB SERVICE ETC. 4-15-2023.');
            //html += '<input type="file" multiple name="multerFileUploadIdentifier_original" id="inputFile_bwActiveMenu_Unauthenticated_Home" class="upload" style="visibility:hidden;" onchange="$(\'.bwActiveMenu:first\').bwActiveMenu(\'uploadAttachment\');" />';

            //html += '</form>  ';





            //html += '           <p id="newrequestattachments" xcx="xcx448-1-5" style="word-break:break-all;white-space:normal;"></p>';

            html += '           <br />';
            html += '           <br />';


            html += '           <div style="float:right;">';
            html += '               <div id="bwActiveMenu_HomepageClock" style="padding:0 0 0 0;width:90%;color:white;"></div>';
            html += '           </div>';

            if (developerModeEnabled == true) {

                html += `       <table >
                                        <tr onclick="$('.bwAuthentication').bwAuthentication('quickMenu_FavoriteLinks');" style="cursor:pointer;">
                                            <td style="height:85px;width:15px;display:inline-block;" class="brushedAluminum_orange">&nbsp;</td>
                                            <td style="height:85px;width:5px;opacity:0;display:inline-block;">&nbsp;</td>
                                            <td style="height:61px;width:730px;display:inline-block;padding-left:15px;padding-top:25px;padding-bottom:0;color:white;font-size:24pt;" class="brushedAluminum_orange">Favorite Links</td>
                                        </tr>
                                    </table>`;

                html += '       <br />';

                html += `       <table >
                                        <tr onclick="$('.bwAuthentication').bwAuthentication('quickMenu_ViewUser');" style="cursor:pointer;">
                                            <td style="height:85px;width:15px;display:inline-block;" class="brushedAluminum_orange">&nbsp;</td>
                                            <td style="height:85px;width:5px;opacity:0;display:inline-block;">&nbsp;</td>
                                            <td style="height:61px;width:730px;display:inline-block;padding-left:15px;padding-top:25px;padding-bottom:0;color:white;font-size:24pt;" class="brushedAluminum_orange">View User</td>
                                        </tr>
                                    </table>`;

                html += '       <br />';

                html += `       <table >
                                        <tr onclick="$('.bwAuthentication').bwAuthentication('quickMenu_WatchVideo');" style="cursor:pointer;">
                                            <td style="height:85px;width:15px;display:inline-block;" class="brushedAluminum_orange">&nbsp;</td>
                                            <td style="height:85px;width:5px;opacity:0;display:inline-block;">&nbsp;</td>
                                            <td style="height:61px;width:730px;display:inline-block;padding-left:15px;padding-top:25px;padding-bottom:0;color:white;font-size:24pt;" class="brushedAluminum_orange">Watch Video</td>
                                        </tr>
                                    </table>`;

                html += '       <br />';

            }


            html += '           <br />';
            html += '           <br />';
            html += '           <br />';



            html += `       </td>
                            </tr>
                        </table>`;

            return html;

        } catch (e) {
            console.log('Exception in bwActiveMenu.js.homePageContent_Unauthenticated_rememberme_selected_HTML(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu.js.homePageContent_Unauthenticated_rememberme_selected_HTML(): ' + e.message + ', ' + e.stack);
        }
    },
    homePageContent_Unauthenticated_rememberme_notselected_HTML: function () {
        try {
            console.log('In bwActiveMenu.js.homePageContent_Unauthenticated_rememberme_notselected_HTML().');
            //alert('In bwActiveMenu.js.homePageContent_Unauthenticated_rememberme_notselected_HTML().');

            var html = '';

            html += '<div id="unauthenticated_rememberme_buttons_on_home_page" style="display:inline;">';
            html += `   <br /><br />
                        <table>
                            <tr>
                                <td style="vertical-align:top;">`;


            html += `           <table >
                                        <tr onclick="$('.bwAuthentication').bwAuthentication('displaySignInDialog', true);" style="cursor:pointer;white-space:nowrap;">
                                            <td style="height:105px;width:15px;display:inline-block;" class="brushedAluminum_orange">&nbsp;</td>
                                            <td style="height:105px;width:5px;opacity:0;display:inline-block;">&nbsp;</td>
                                            <td class="brushedAluminum_orange autologonButton" style="height:61px;width:315px;display:inline-block;padding-left:15px;padding-top:25px;padding-bottom:0;color:white;font-size:24pt;" >SIGN IN</td>
                                        </tr>
                                    </table>`;
            html += '           <br />';
            html += '           <br />';
            html += `           <table >
                                        <tr onclick="$('.bwAuthentication').bwAuthentication('displayCreateFreeAccountDialog', true);" style="cursor:pointer;white-space:nowrap;">
                                            <td style="height:105px;width:15px;display:inline-block;" class="brushedAluminum_orange">&nbsp;</td>
                                            <td style="height:105px;width:5px;opacity:0;display:inline-block;">&nbsp;</td>
                                            <td class="brushedAluminum_orange autologonButton" style="height:61px;width:315px;display:inline-block;padding-left:15px;padding-top:25px;padding-bottom:0;color:white;font-size:24pt;" >SIGN UP</td>
                                        </tr>
                                    </table>`;
            html += '           <br />';
            html += '           <br />';
            html += `           <table >
                                        <tr onclick="window.location='https://patreon.com/shareandcollaborate';" style="cursor:pointer;white-space:nowrap;">
                                            <td style="height:105px;width:15px;display:inline-block;" class="brushedAluminum_orange">&nbsp;</td>
                                            <td style="height:105px;width:5px;opacity:0;display:inline-block;">&nbsp;</td>
                                            <td class="brushedAluminum_orange autologonButton" style="height:61px;width:315px;display:inline-block;padding-left:15px;padding-top:25px;padding-bottom:0;color:white;font-size:24pt;" >Follow at Patreon</td>
                                        </tr>
                                    </table>`;

            html += '           <br />';
            //html += '       </div>';

            html += `       </td>
                                <td xcx="xcx1231244432-2" style="width:75px;"></td>


                                <td style="vertical-align:top;">`;









            html += '           <br />';
            html += '           <br />';


            html += '           <div style="float:right;">';
            html += '               <div id="bwActiveMenu_HomepageClock" style="padding:0 0 0 0;width:90%;color:white;"></div>';
            html += '           </div>';

            html += '           <br />';
            html += '           <br />';
            html += '           <br />';

            html += `           </td>
                            </tr>
                        </table>`;

            //var html = '';

            //html += '<table style="margin:auto;">';
            //html += '   <tr>';
            //html += '       <td>';
            //html += '           <div xcx="xcx312424423788" class="divSignInButton" style="width:300px;text-align: center; line-height: 1.1em; font-weight: bold;z-index:15;border:1px solid skyblue;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displaySignInDialog\', true);">';
            //html += '           Sign In';
            //html += '           </div>';
            //html += '       </td>';
            //html += '       <td>';

            //// Commented out and moved to the circle dialog 5-21-2024.
            ////html += '           <div class="divSelectLogonTypeButton bwNoUserSelect" style="width:95%;text-align: center; line-height: 1.1em; font-weight: bold;z-index:15;padding:13px 0 6px 13px;border:1px solid skyblue;">';
            ////html += '               with';
            ////html += '               <select id="selectLogonType" onchange="$(\'.bwAuthentication\').bwAuthentication(\'selectLogonType_OnChange\');" class="selectHomePageWorkflowAppDropDown" style="margin-bottom:15px;cursor:pointer;font-weight:bold;font-family:\'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 1em;">';

            //////
            ////// We get the location here, and decide which is the default selection.
            //////
            ////var url1 = window.location.href.split('https://')[1];
            ////var url2 = url1.split('/')[0].toLowerCase(); // this.options.operationUriPrefix = 'https://' + url2 + '/';

            ////if (url2.indexOf('shareandcollaborate.com') > -1) {

            ////    html += '                   <option value="ShareAndCollaborate.com">ShareAndCollaborate.com</option>';
            ////    html += '                   <option value="BudgetWorkflow.com">BudgetWorkflow.com</option>';

            ////} else if (url2.indexOf('budgetworkflow.com') > -1) {

            ////    html += '                   <option value="BudgetWorkflow.com">BudgetWorkflow.com</option>';
            ////    html += '                   <option value="ShareAndCollaborate.com">ShareAndCollaborate.com</option>';

            ////} else {

            ////    var msg = 'Error: Unexpected value for window.location.href: ' + window.location.href;
            ////    console.log(msg);
            ////    displayAlertDialog(msg);

            ////}

            ////html += '                   <option value="Facebook.com">Facebook.com</option>';
            //////html += '                   <option>Microsoft</option>'; // Microsoft login needs work, so is only an option in the drop down when this.options.developerModeEnabled == true.

            ////html += '               </select>';
            ////html += '               &nbsp;&nbsp;';
            ////html += '           </div>';

            //html += '       </td>';
            //html += '   </tr>';
            //html += '   <tr>';
            //html += '       <td></td>';
            //html += '       <td>';
            //// 1-28-2022 // Moved the "Remember Me" checkbox here.
            //html += '<table style="width:100%;">';
            //html += '<tbody>';
            //html += '   <tr>';
            //html += '       <td style="text-align:right;">';

            ////html += '           <span style="cursor:help;color:gray;" title="Auto-logon with local storage. Your logon information gets saved in local storage so that you aren\'t subsequently prompted to logon.">';
            ////html += '               <input onclick="$(\'.bwAuthentication\').bwAuthentication(\'changeRememberMeCheckboxSetting_OnClick\');" id="cbCustomLogonRememberMe" type="checkbox" style="cursor:pointer;zoom: 1.25;transform: scale(1.25);-ms-transform: scale(1.25);-webkit-transform: scale(1.25);-o-transform: scale(1.25);-moz-transform: scale(1.25);transform-origin: 0 0;-ms-transform-origin: 0 0;-webkit-transform-origin: 0 0;-o-transform-origin: 0 0;-moz-transform-origin: 0 0;" checked="">';
            ////html += '               &nbsp;Remember me';
            ////html += '           </span>';

            //html += '       </td>';
            //html += '   </tr>';
            //html += '</tbody>';
            //html += '</table>';
            //html += '           &nbsp;&nbsp;';
            //html += '           <span id="spanAzureADConnectionDetails"></span>';
            //html += '       </td>';
            //html += '   </tr>';
            //html += '   <tr>';
            //html += '       <td colspan="2">';

            ////
            ////
            //// 6-24-2024. Make the "or" the color of the theme. // Stuck on orange, the default, because this must be the wrong place to do this kind of thing...
            ////
            ////

            ////var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');

            ////var element = document.getElementById('divTopBar_Long');
            ////var topBarColor = window.getComputedStyle(element, null).getPropertyValue('background-color'); // returns rgb(140, 35, 213)

            //var topBarColor = 'aliceblue';

            //html += '           <div style="color:' + topBarColor + ';height:50px;font-weight:bold;text-align:center;line-height:1.1em;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:22pt;">&nbsp;&nbsp;or&nbsp;&nbsp;</div>';

            //html += '       </td>';
            //html += '   </tr>';
            //html += '   <tr>';
            //html += '       <td colspan="2">';
            //html += '           <div class="divSignInButton" xcx="xcx5555566" style="width:300px; text-align: center; line-height: 1.1em; font-weight: bold;z-index:15;border:1px solid skyblue;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayCreateFreeAccountDialog\', true);">';
            //html += '               Sign Up&nbsp;&nbsp;';
            //html += '           </div>';
            //html += '       </td>';
            //html += '   </tr>';

            //html += '</table>';

            //html += '<br /><br />';

            //html += '<table>';

            //html += '    <tr>';
            //html += '        <td>';
            //html += '            <a href="https://patreon.com/shareandcollaborate" target="_blank"><div style="height:25px;width:380px;" class="leftButton brushedAluminum_orange divPurchaseNowButton" >';
            //html += '               Follow at my Patreon';
            //html += '            </div></a>';
            //html += '        </td>';
            //html += '    </tr>';

            //// https://www.youtube.com/watch?v=8-hJFoSgXfM // Yes: Leave It.

            //html += '</table>';
            ////html += '<br /><br /><br /><br /><br />[make this my homepage]';

            return html;

        } catch (e) {
            console.log('Exception in bwActiveMenu.js.homePageContent_Unauthenticated_rememberme_notselected_HTML(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu.js.homePageContent_Unauthenticated_rememberme_notselected_HTML(): ' + e.message + ', ' + e.stack);
        }
    },

    renderAboutScreen: function () {
        try {
            console.log('In bwActiveManu.js.renderAboutScreen().');

            console.log('xcx23124-5. Calling toggleVideoBackgroundExperiment().');
            this.toggleVideoBackgroundExperiment(false);

            console.log('xcx231243-5. Getting workflowAppTheme.');
            //alert('xcx12313123-1 changing the theme.');
            var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
            if (!workflowAppTheme) {
                alert('xcx2312 no workflowAppTheme set');
                workflowAppTheme = 'brushedAluminum_orange'; // hardcoded fix this
            }

            //// Select the HOME button here. 1-4-2024.
            //var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
            ////var workflowAppTheme = 'brushedAluminum_purple'; // $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
            debugger;
            var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

            // Step 1: Make all of the buttons un-selected.
            $('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
                $(this).addClass(workflowAppTheme).removeClass('bwMenuButton_Selected');
            });


            // Step 2: Set the specified button as the selected one.
            $('#divLeftMenuButton_About').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);
            $('#divLeftMenuButton_About').addClass('bwMenuButton_Selected');

            console.log('xcx2131234-20 populating [divPageContent1].');
            document.getElementById('divPageContent1').innerHTML = '';

            var html = '';

            html += '   <br /><br /><br />';

            html += '<table>';

            html += '<tr>';
            html += '<td>';
            //html += '<img src="todd2020-2.png" style="float:left;width:219px;padding:0 10px 5px 0;" alt="" />';
            html += '<span class="spanAboutUsText" style="font-size:20pt;font-weight:normal;font-family:\'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;" >';
            html += 'Hi! My name is Todd Hiltz, and I have created this software so that everyone can have their own online based communication, collaboration, and budget request system.';
            html += '<br /><br />';
            html += 'Budget Request systems, and online software (shareable collaboration with email and file storage), have traditionally been poorly implemented, expensive, and only available to large corporations and governments.<br />They are a lot more complicated than you might think.';
            html += '<br /><br />';
            html += 'I have spent many years developing financial and online software systems. This software is the result of tens of thousands of hours of research and development.';
            //html += '<br />';
            //html += 'My resume includes developing CAPEX systems for Johnson & Johnson (2007-2008), Wabash National (2012-2013), Smithfield Foods (2018-2020), among others.';
            html += '<br /><br />';
            html += 'I am headquartered in the beautiful Annapolis Valley, Nova Scotia, Canada.';
            html += '<br /><br />';
            //html += '<u>Contact</u>';
            //html += '<br /><br />';
            //html += 'mail: Todd Hiltz, 61 Crescent Avenue, Kentville, Nova Scotia, Canada B4N 1R1';
            //html += '<br />';
            //html += 'tel/text: 902-385-1968';
            //html += '<br />';
            html += 'Contact me at todd@budgetworkflow.com. I want to make sure everyone gets the most out of this software. On twitter @budgetworkflow.';
            html += '<br /><br />';
            html += 'You can start using it right now, just log in and invite whomever you wish.';
            html += '<br />';
            //html += 'twitter: @budgetworkflow (<a href="https://twitter.com/budgetworkflow">https://twitter.com/budgetworkflow</a>)';
            html += '<br />';

            // 
            html += '<a onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForButton\', this, \'THIS_SOFTWARE\');" style="font-size:15pt;font-weight:bold;text-decoration:underline;cursor:pointer;">Free (as in freedom) and Open Source, fully licensed under GNU AGPLv3</a>';
            html += '<br />';
            html += '<br />';

            html += '<br /><br />';
            html += '</span>';
            html += '</td>';
            html += '</tr>   ';

            html += '</table>';

            html += '       <br />';
            html += '       <br />';

            html += '            <tr>';
            html += '                <td style="text-align:center;color: #262626;">';
            html += '                </td>';
            html += '            </tr>';
            html += '            <tr>';
            html += '                <td style="height:25px;">';
            html += '                   <div id="bwActiveMenu_divBwProductCarousel_1"></div>';
            html += '               </td>';
            html += '            </tr>';
            html += '            <tr>';
            html += '                <td style="height:25px;">';
            html += '                   <div id="bwActiveMenu_divBwProductCarousel_10"></div>';
            html += '               </td>';
            html += '            </tr>';
            html += '            <tr>';
            html += '                <td style="text-align:center;color: #262626;">';
            html += '                </td>';
            html += '            </tr>';
            html += '            <tr>';
            html += '                <td style="height:25px;">';
            html += '                   <div id="bwActiveMenu_divBwProductCarousel_2"></div>';
            html += '               </td>';
            html += '            </tr>';
            html += '            <tr>';
            html += '                <td style="text-align:center;color: #262626;">';
            html += '                </td>';
            html += '            </tr>';
            html += '            <tr>';
            html += '                <td style="height:25px;">';
            html += '                   <div id="bwActiveMenu_divBwProductCarousel_3"></div>';
            html += '               </td>';
            html += '            </tr>';
            html += '            <tr>';
            html += '                <td style="text-align:center;color: #262626;">';
            html += '                </td>';
            html += '            </tr>';
            html += '            <tr>';
            html += '                <td style="height:25px;">';
            html += '                   <div id="bwActiveMenu_divBwProductCarousel_4"></div>';
            html += '               </td>';
            html += '            </tr>';
            html += '            <tr>';
            html += '                <td style="text-align:center;color: #262626;">';
            html += '                </td>';
            html += '            </tr>';
            html += '            <tr>';
            html += '                <td style="height:25px;">';
            html += '                   <div id="bwActiveMenu_divBwProductCarousel_5"></div>';
            html += '               </td>';
            html += '            </tr>';
            html += '            <tr>';
            html += '                <td style="text-align:center;color: #262626;">';
            html += '                </td>';
            html += '            </tr>';
            html += '            <tr>';
            html += '                <td style="height:25px;">';
            html += '                   <div id="bwActiveMenu_divBwProductCarousel_6"></div>';
            html += '               </td>';
            html += '            </tr>';
            html += '            <tr>';
            html += '                <td style="text-align:center;color: #262626;">';
            html += '                </td>';
            html += '            </tr>';
            html += '            <tr>';
            html += '                <td style="height:25px;">';
            html += '                   <div id="bwActiveMenu_divBwProductCarousel_7"></div>';
            html += '               </td>';
            html += '            </tr>';
            html += '            <tr>';
            html += '                <td style="text-align:center;color: #262626;">';
            html += '                </td>';
            html += '            </tr>';
            html += '            <tr>';
            html += '                <td style="height:25px;">';
            html += '                   <div id="bwActiveMenu_divBwProductCarousel_8"></div>';
            html += '               </td>';
            html += '            </tr>';
            html += '            <tr>';
            html += '                <td style="text-align:center;color: #262626;">';
            html += '                </td>';
            html += '            </tr>';
            html += '            <tr>';
            html += '                <td style="height:25px;">';
            html += '                   <div id="bwActiveMenu_divBwProductCarousel_9"></div>';
            html += '               </td>';
            html += '            </tr>';

            html += '</table>';

            console.log('xcx2131234-21 populating [divPageContent1].');
            document.getElementById('divPageContent1').innerHTML = html;

            this.displayCodeFile('/widgets/bwActiveMenu.js');

            $('#bwActiveMenu_divBwProductCarousel_1').bwProductCarousel({ PublishedSlideSetId: '0ffb512e-57f6-4d1e-9dbd-709f45824d4d' }); // Get this guid from the admin.html >> "Home Page Slideshow".

            // Email client.
            $('#bwActiveMenu_divBwProductCarousel_10').bwProductCarousel({ PublishedSlideSetId: '2c973ba2-c349-48dd-a157-61b8ac1c2c50' }); // Get this guid from the admin.html >> "Home Page Slideshow".


            $('#bwActiveMenu_divBwProductCarousel_2').bwProductCarousel({ PublishedSlideSetId: 'c85f0c2d-7697-45bc-a06d-1bc8c23a2b79' }); // Get this guid from the admin.html >> "Home Page Slideshow".

            $('#bwActiveMenu_divBwProductCarousel_3').bwProductCarousel({ PublishedSlideSetId: 'fdacf8e0-f9ee-4955-a9c1-538f594a8853' }); // Get this guid from the admin.html >> "Home Page Slideshow".

            $('#bwActiveMenu_divBwProductCarousel_4').bwProductCarousel({ PublishedSlideSetId: '33b5d992-5c9d-4689-adba-603eba09bda9' }); // Get this guid from the admin.html >> "Home Page Slideshow".

            $('#bwActiveMenu_divBwProductCarousel_5').bwProductCarousel({ PublishedSlideSetId: '365756ea-1234-42b6-bdfe-0deb897ae96d' }); // Get this guid from the admin.html >> "Home Page Slideshow". 

            $('#bwActiveMenu_divBwProductCarousel_6').bwProductCarousel({ PublishedSlideSetId: '9e6e9054-5bbd-4a17-9563-ec21db090f2a' }); // Get this guid from the admin.html >> "Home Page Slideshow". 

            $('#bwActiveMenu_divBwProductCarousel_7').bwProductCarousel({ PublishedSlideSetId: '100bd13a-0c82-41df-ac25-ff2f15707cd5' }); // Get this guid from the admin.html >> "Home Page Slideshow". 

            $('#bwActiveMenu_divBwProductCarousel_8').bwProductCarousel({ PublishedSlideSetId: '86ebd210-c35c-4aae-bab0-84b439ae3084' }); // Get this guid from the admin.html >> "Home Page Slideshow". 

            $('#bwActiveMenu_divBwProductCarousel_9').bwProductCarousel({ PublishedSlideSetId: 'fe0ab725-c9a3-44a8-ae18-9495c0e73c39' }); // Get this guid from the admin.html >> "Home Page Slideshow".

            this.shrinkLeftMenu();


        } catch (e) {
            console.log('Exception in bwActiveMenu.js.renderAboutScreen(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu.js.renderAboutScreen(): ' + e.message + ', ' + e.stack);
        }

    },
    renderThisSoftwareScreen: function () {
        try {
            console.log('In bwActiveManu.js.renderThisSoftwareScreen().');

            //alert('xcx213123 THIS_SOFTWARE');

            console.log('xcx23124-6. Calling toggleVideoBackgroundExperiment().');
            this.toggleVideoBackgroundExperiment(false);

            //
            //
            // This is particularly useful when you want to create a single-page application that can change the URL without reloading the page.
            //
            //

            //
            // 4-18-2024.
            //
            // https://stackoverflow.com/questions/2968425/get-back-to-previous-page
            //
            // 6-15-2024: https://stackoverflow.com/questions/10970078/modifying-a-query-string-without-reloading-the-page

            // You can run history.pushState() as many times as necessary, or modify the current state using history.replaceState(). See: https://sitepoint.com/javascript-history-pushstate/

            //
            // What is the main function of JavaScript History PushState?
            // The JavaScript History PushState is a method that allows you to manipulate the browser history.
            // It is part of the History API and it enables you to add history entries.
            // This is particularly useful when you want to create a single-page application that can change the URL without reloading the page.
            // It helps in maintaining the user experience and the state of the application even when the user navigates through the browser’s forward and back buttons.
            //




            console.log('xcx12313123-2 changing the theme.');

            console.log('xcx231243-6. Getting workflowAppTheme.');
            //var workflowAppTheme = 'brushedAluminum_orange'; // hardcoded fix this
            var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
            if (!workflowAppTheme) {
                workflowAppTheme = 'brushedAluminum_orange'; // hardcoded fix this
            }

            //// Select the HOME button here. 1-4-2024.
            //var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
            ////var workflowAppTheme = 'brushedAluminum_purple'; // $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');

            var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

            // Step 1: Make all of the buttons un-selected.
            $('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
                $(this).addClass(workflowAppTheme).removeClass('bwMenuButton_Selected');
            });

            // Step 2: Set the specified button as the selected one.
            $('#divLeftMenuButton_ThisSoftware').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);
            $('#divLeftMenuButton_ThisSoftware').addClass('bwMenuButton_Selected');



            console.log('xcx2131234-22 populating [divPageContent1].');
            document.getElementById('divPageContent1').innerHTML = '';

            var html = '';

            // Free, easy to deploy and use systems such as this should level the financial playing field globally, by allowing all organizations access to some of the best software tools available.
            var welcomeToThisVersionOfTheSoftware = $('.bwAuthentication').bwAuthentication('option', 'WelcomeToThisVersionOfTheSoftware'); // The "WelcomeToThisVersionOfTheSoftware" message is stored in the bwAuthentication.js widget.

            html += `

<span style="padding-left:1px;color:cornflowerblue;font-weight:normal;vertical-align:top;">` + welcomeToThisVersionOfTheSoftware + `</span>
<br />
<br />
<span style="font-family: SFProDisplay-Regular, Helvetica, Arial, sans-serif;font-size: 38px;font-weight: bold;">ShareAndCollaborate.com</span>

<hr /><br />
ShareAndCollaborate.com is a Node.js social network for organization-centric financial/other decision making.

<br /><br />
I have created this software so that everyone can have their own online based communication, collaboration, and budget request system.





<br />
<br />In other words, an organization-centric financial CAPEX/OPEX/Project-Management Request System (project management social network) with inventory, workflow, reconciliation, invoicing.
<br /><br />It is an extensible framework and collection of jQuery widgets. Intended as a 1-stop shop for an organizations' financial/other decision making and management. 

<br /><br />Capital Expenditure Planning (CAPEX), Operational (OPEX), and as it turns out, great for almost any kind of paperwork based process that needs to be archived, searchable, shared.
 
 <br /> <br />


    <span style="font-weight:bold;">Free (as in freedom) and Open Source, fully licensed under GNU AGPLv3.</span>
    <br />
    <br />
   
   


    <hr />

    

    <br />

 <span>This page is under construction. Comments and feedback: todd@budgetworkflow.com<br /><br /></span>
    <img src="../images/under-construction.jpg" style="width:300px;" /><br /><br />

I am working to have the source code and documentation available here sometime soon as a zip file. Email me if you want one right away. It would be great to work with someone to make sure all the files are included nicely.<br /><br />In the meantime, email me to get a copy, or just download from here if you are proficient at that. This site is not served minified.<br /><br /><span style="font-weight:bold;">I want to make sure everyone can use, study, distribute, modify, and get the most out of this software!</span> todd@budgetworkflow.com.
<br /><br />



   

    <hr />






<table style="border:2px solid lightgray;width:100%;">
        <tr>
            <td style="vertical-align:top;width:17%;">
                FILES<br />
                <span style="color:tomato;">Select a link to view this code.</span>

<br />

<table style="border:3px solid lightgray;">
        <tbody>

            <!-- widgets -->


<tr><td>&nbsp;</td></tr>
<tr><td>/widgets</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwActiveMenu.js');">bwActiveMenu.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwActivitySpinner_FileUpload.js');">bwActivitySpinner_FileUpload.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwActivitySpinner.js');">bwActivitySpinner.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwAdvancedProductSearch.js');">bwAdvancedProductSearch.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwAppThemeColorPicker.js');">bwAppThemeColorPicker.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwAttachmentDialog.js');">bwAttachmentDialog.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwAuthentication.js');">bwAuthentication.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwChecklistsEditor.js');">bwChecklistsEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwCircleDialog.js');">bwCircleDialog.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwCoreComponent.js');">bwCoreComponent.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwCustomerSummariesCarousel.js');">bwCustomerSummariesCarousel.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwDataGrid.js');">bwDataGrid.js</td></tr>

<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwDocumentation.js');">bwDocumentation.js</td></tr>

<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwDistributorBundling.js');">bwDistributorBundling.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwDonate.js');">bwDonate.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwEmailClient_Haraka.js');">bwEmailClient_Haraka.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwEmailClient.js');">bwEmailClient.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwEmailEditor_DeletedRequest.js');">bwEmailEditor_DeletedRequest.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwEmailEditor_RevertedRequest.js');">bwEmailEditor_RevertedRequest.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwEmailMonitor.js');">bwEmailMonitor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwEmailTemplateEditor.js');">bwEmailTemplateEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwExecutiveSummariesCarousel.js');">bwExecutiveSummariesCarousel.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwExecutiveSummariesCarousel2.js');">bwExecutiveSummariesCarousel2.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwExternallySharedFiles.js');">bwExternallySharedFiles.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwFormsEditor.js');">bwFormsEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwHomePage.js');">bwHomePage.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwHowDoesItWorkCarousel2.js');">bwHowDoesItWorkCarousel2.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwHowDoesItWorkCarousel3.js');">bwHowDoesItWorkCarousel3.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwInvitation.js');">bwInvitation.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwInvitationsAdmin.js');">bwInvitationsAdmin.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwKeypressAndMouseEventHandler.js');">bwKeypressAndMouseEventHandler.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwLibreJs.js');">bwLibreJs.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwLocationEditor.js');">bwLocationEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwMonitoringTools.js');">bwMonitoringTools.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwNewUserBusinessModelEditor.js');">bwNewUserBusinessModelEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwNewUserChecklistsEditor.js');">bwNewUserChecklistsEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwNewUserEmailEditor.js');">bwNewUserEmailEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwNewUserFormsEditor.js');">bwNewUserFormsEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwNewUserRolesEditor.js');">bwNewUserRolesEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwNewUserWorkflowEditor.js');">bwNewUserWorkflowEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwNotificationSound.js');">bwNotificationSound.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwOneTimeRequestReminders.js');">bwOneTimeRequestReminders.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwOperationalHours.js');">bwOperationalHours.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwOrganizationEditor.js');">bwOrganizationEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwOrganizationEditorAdmin.js');">bwOrganizationEditorAdmin.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwOrganizationEvents.js');">bwOrganizationEvents.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwOrganizationPicker.js');">bwOrganizationPicker.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwOrganizationPicker2.js');">bwOrganizationPicker2.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwPageScrollingHandler.js');">bwPageScrollingHandler.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwParticipantsEditor.js');">bwParticipantsEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwPeoplePicker.js');">bwPeoplePicker.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwPersonalErrorAdministration.js');">bwPersonalErrorAdministration.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwPillarTypeEditor.js');">bwPillarTypeEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwPrintButton.js');">bwPrintButton.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwProductCarousel.js');">bwProductCarousel.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwProjectTypeEditor.js');">bwProjectTypeEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwRequest.js');">bwRequest.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwRequest.min.js');">bwRequest.min.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwRequestTitleFormatAdmin.js');">bwRequestTitleFormatAdmin.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwRequestTypeDropDown_NewTenant.js');">bwRequestTypeDropDown_NewTenant.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwRequestTypeEditor.js');">bwRequestTypeEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwResubscribeUserEmailEditor.js');">bwResubscribeUserEmailEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwRolesEditor.js');">bwRolesEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwSharePointFormEditor.js');">bwSharePointFormEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwSharePointWorkflowEditor.js');">bwSharePointWorkflowEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwSpeech.js');">bwSpeech.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwTardyParticipants.js');">bwTardyParticipants.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwTimelineAggregator.js');">bwTimelineAggregator.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwTipsCarousel.js');">bwTipsCarousel.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwTrackSpending.js');">bwTrackSpending.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwUnsubscribeUserEmailEditor.js');">bwUnsubscribeUserEmailEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/widgets/bwWorkflowEditor.js');">bwWorkflowEditor.js</td></tr>

<tr><td>&nbsp;</td></tr>
<tr><td>/formwidgets</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/formwidgets/bwAttachments.js');">bwAttachments.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/formwidgets/bwCapitalInternalOrderNumberField.js');">bwCapitalInternalOrderNumberField.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/formwidgets/bwCommentsField_Events.js');">bwCommentsField_Events.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/formwidgets/bwCommentsField.js');">bwCommentsField.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/formwidgets/bwCostCenterDescriptionField.js');">bwCostCenterDescriptionField.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/formwidgets/bwCostCenterNumberField.js');">bwCostCenterNumberField.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/formwidgets/bwCostsGrid.js');">bwCostsGrid.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/formwidgets/bwDescriptionDetailsField.js');">bwDescriptionDetailsField.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/formwidgets/bwDocumentScan.js');">bwDocumentScan.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/formwidgets/bwDurationInMonthsCalculatedField.js');">bwDurationInMonthsCalculatedField.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/formwidgets/bwEndDatePicker.js');">bwEndDatePicker.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/formwidgets/bwExpenseInternalOrderNumberField.js');">bwExpenseInternalOrderNumberField.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/formwidgets/bwInvoiceGrid.js');">bwInvoiceGrid.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/formwidgets/bwJustificationDetailsField.js');">bwJustificationDetailsField.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/formwidgets/bwLocationPicker.js');">bwLocationPicker.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/formwidgets/bwPaybackGrid.js');">bwPaybackGrid.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/formwidgets/bwPaybackTypeField.js');">bwPaybackTypeField.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/formwidgets/bwPeoplePicker_Customer.js');">bwPeoplePicker_Customer.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/formwidgets/bwPeoplePicker_EmailRecipients.js');">bwPeoplePicker_EmailRecipients.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/formwidgets/bwPeoplePicker.js');">bwPeoplePicker.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/formwidgets/bwPillarTypeCheckboxGroup.js');">bwPillarTypeCheckboxGroup.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/formwidgets/bwPillarTypeDropDown.js');">bwPillarTypeDropDown.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/formwidgets/bwProjectClassField.js');">bwProjectClassField.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/formwidgets/bwProjectTypeCheckboxGroup.js');">bwProjectTypeCheckboxGroup.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/formwidgets/bwProjectTypeDropDown.js');">bwProjectTypeDropDown.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/formwidgets/bwReasonDetailsField.js');">bwReasonDetailsField.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/formwidgets/bwRecordAudio.js');">bwRecordAudio.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/formwidgets/bwRequestedCapitalField.js');">bwRequestedCapitalField.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/formwidgets/bwRequestTypeDropDown.js');">bwRequestTypeDropDown.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/formwidgets/bwSelectInventoryItems.js');">bwSelectInventoryItems.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/formwidgets/bwSelectQuoteItems.js');">bwSelectQuoteItems.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/formwidgets/bwSpendGrid.js');">bwSpendGrid.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/formwidgets/bwStartDatePicker.js');">bwStartDatePicker.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/formwidgets/bwYearDropDown.js');">bwYearDropDown.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/formwidgets/ProjectTitle.js');">ProjectTitle.js</td></tr>




<!-- scripts -->

<tr><td>&nbsp;</td></tr>
<tr><td>/scripts</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/scripts/index.js');">index.js</td></tr>


<!-- backendwidgets -->

<tr><td>&nbsp;</td></tr>
<tr><td>/backendwidgets</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/backendwidgets/bwActiveMenu_Admin.js');">backendwidgets/bwActiveMenu_Admin.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/backendwidgets/bwBackendAdministrationForAllParticipants.js');">backendwidgets/bwBackendAdministrationForAllParticipants.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/backendwidgets/bwCampaign.js');">backendwidgets/bwCampaign.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/backendwidgets/bwChecklistsEditor_Admin.js');">backendwidgets/bwChecklistsEditor_Admin.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/backendwidgets/bwEmailAllowListManager.js');">backendwidgets/bwEmailAllowListManager.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/backendwidgets/bwEmailCampaign.js');">backendwidgets/bwEmailCampaign.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/backendwidgets/bwEmailMonitor_Admin.js');">backendwidgets/bwEmailMonitor_Admin.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/backendwidgets/bwFormsEditor_NewTenant.js');">backendwidgets/bwFormsEditor_NewTenant.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/backendwidgets/bwKeypressAndMouseEventHandler_ForAdmin.js');">backendwidgets/bwKeypressAndMouseEventHandler_ForAdmin.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/backendwidgets/bwMonitoringTools2.js');">backendwidgets/bwMonitoringTools2.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/backendwidgets/bwRequestTypeEditor_NewTenant.js');">backendwidgets/bwRequestTypeEditor_NewTenant.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/backendwidgets/bwSlideSet.js');">backendwidgets/bwSlideSet.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/backendwidgets/bwSlideshowAdmin.js');">backendwidgets/bwSlideshowAdmin.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/backendwidgets/bwStripePurchases.js');">backendwidgets/bwStripePurchases.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/backendwidgets/bwTimerServicesManager.js');">backendwidgets/bwTimerServicesManager.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/backendwidgets/bwVideoAssistant_Admin.js');">backendwidgets/bwVideoAssistant_Admin.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/backendwidgets/bwWorkflowEditor_NewTenant.js');">backendwidgets/bwWorkflowEditor_NewTenant.js</td></tr>




<!-- serverstuff/webservices -->

<tr><td>&nbsp;</td></tr>
<tr><td>/serverstuff/webservices</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/serverstuff/webservices/budgetworkflow.com.js');">serverstuff/webservices/budgetworkflow.com.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/serverstuff/webservices/routes/commondata.js');">serverstuff/webservices/routes/commondata.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/serverstuff/webservices/routes/start.js');">serverstuff/webservices/routes/start.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/serverstuff/webservices/routes/sharedclientandserverscripts/bwCommonScripts.js');">serverstuff/webservices/routes/sharedclientandserverscripts/bwCommonScripts.js</td></tr>




<!-- serverstuff/fileservices -->

<tr><td>&nbsp;</td></tr>
<tr><td>/serverstuff/fileservices</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/serverstuff/fileservices/budgetworkflow.com.js');">serverstuff/fileservices/budgetworkflow.com.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/serverstuff/fileservices/routes/commondata.js');">serverstuff/fileservices/routes/commondata.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/serverstuff/fileservices/routes/start.js');">serverstuff/fileservices/routes/start.js</td></tr>



<!-- serverstuff/mediaconversionservices -->

<tr><td>&nbsp;</td></tr>
<tr><td>/serverstuff/mediaconversionservices</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/serverstuff/mediaconversionservices/budgetworkflow.com.js');">serverstuff/mediaconversionservices/budgetworkflow.com.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/serverstuff/mediaconversionservices/routes/start.js');">serverstuff/mediaconversionservices/routes/start.js</td></tr>


<!-- serverstuff/emailservices -->

<tr><td>&nbsp;</td></tr>
<tr><td>/serverstuff/emailservices</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu').bwActiveMenu('displayCodeFile', '/serverstuff/emailservices/bwHarakaQueueHandler.js');">serverstuff/emailservices/bwHarakaQueueHandler.js</td></tr>























        </tbody>
    </table>






            </td>
            <td></td>
            <td style="border-left:2px solid lightgray;width:83%;vertical-align:top;">
                <table>
                    <tr>
                        <td>&nbsp;</td>
                    </tr>
                    <tr>
                        <td id="tdFilePath">[tdFilePath]</td>
                    </tr>
                   
                    <tr>
                        <td>
                            <table>
                                
                                <tr>
                                    <td>

                                        <div id="javascriptCodeWindow"></div>

                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>




    </table>
























    <br />

    <br />


`;
            console.log('xcx2131234-23 populating [divPageContent1].');
            document.getElementById('divPageContent1').innerHTML = html;



            //this.selectButtonAndChangeTheme('divThisSoftwareButton', 'brushedAluminum_purple');



            //resetThePageAndButtons = false;

            this.displayCodeFile('/widgets/bwActiveMenu.js');

            //this.unshrinkLeftMenu();
            this.shrinkLeftMenu();

        } catch (e) {
            console.log('Exception in bwActiveMenu.js.renderThisSoftwareScreen(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu.js.renderThisSoftwareScreen(): ' + e.message + ', ' + e.stack);
        }

    },
    renderDocumentationScreen: function () {
        try {
            console.log('In bwActiveManu.js.renderDocumentationScreen().');

            //alert('xcx213123 DOCUMENTATION');

            console.log('xcx23124-3. Calling toggleVideoBackgroundExperiment().');
            this.toggleVideoBackgroundExperiment(false);

            console.log('xcx2131234-14 populating [divPageContent1].');
            $('#divPageContent1').html('');

            //
            // Add the bwDocumentation.js widget.
            //
            var div2 = document.getElementById('bwDocumentation1');
            if (!div2) {
                div2 = document.createElement('div');
                div2.id = 'bwDocumentation1';
                document.getElementById('divPageContent1').appendChild(div2); // to place at end of document
            }

            $('#bwDocumentation1').bwDocumentation({});

            this.shrinkLeftMenu();

            //this.unshrinkLeftMenu();

            //try {
            //    $('#FormsEditorToolbox').dialog('close');
            //} catch (e) { }

            //console.log('In bwActiveMenu.js.RenderContentForButton(). Calling renderHomeScreen(). xcx2332566.');
            //alert('In bwActiveMenu.js.RenderContentForButton(). Calling renderHomeScreen(). xcx2332566-3.');
            //thiz.renderHomeScreen(); // 10-30-2023. Does this work?

            //$('#bwQuickLaunchMenuTd').css({
            //    width: '0'
            //}); // This gets rid of the jumping around.

            ////// 10-25-2023.
            ////this.options.HomePage = false;
            ////this.renderMenu();

            //// 11-16-2022
            //if ($('.bwAuthentication').bwAuthentication('instance') && $('.bwAuthentication').bwAuthentication().length && ($('.bwAuthentication').bwAuthentication().length == 1)) {
            //    //$('.bwAuthentication').bwAuthentication('getRemainingParticipantDetailsAndWorkflowAppTitle'); // 10-25-2023.
            //} else {
            //    alert('xcx12343412 There is an issue with the bwAuthentication widget instance(s) in the dom. Instance: ' + $('.bwAuthentication').bwAuthentication('instance') + ', length: ' + $('.bwAuthentication').bwAuthentication('instance').length);
            //}

        } catch (e) {
            console.log('Exception in bwActiveMenu.js.renderDocumentationScreen(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu.js.renderDocumentationScreen(): ' + e.message + ', ' + e.stack);
        }

    },

    renderConfigurationSettings: function () {
        var thiz = this;
        return new Promise(function (resolve, reject) {
            try {
                console.log('In bwActiveMenu.js.renderConfigurationSettings().');
                var thiz = this;

                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

                var workflowAppTitle = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTitle');

                var externallyFacingUrlForAttachments = $('.bwAuthentication').bwAuthentication('option', 'externallyFacingUrlForAttachments');
                var externallyFacingUrlForAttachmentsSourceFolder = $('.bwAuthentication').bwAuthentication('option', 'externallyFacingUrlForAttachmentsSourceFolder');

                var workflowAppFiscalYear = $('.bwAuthentication').bwAuthentication('option', 'workflowAppFiscalYear');
                var bwEnabledRequestTypes = $('.bwAuthentication').bwAuthentication('option', 'bwEnabledRequestTypes');

                var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');

                // This is where we set defaults for configurations that haven't been done yet.
                //if (emailNotificationLevel == '') emailNotificationLevel == 'alldiscourse';

                //if (emailNotificationFrequency == '') emailNotificationFrequency = 'immediately'; //immediately, aggregatedaily, aggregatetwicedaily
                //if (emailNotificationTypes == '') emailNotificationTypes = 'allnotifications'; //allnotifications, onlymytasknotifications

                if (newBudgetRequestManagerTitle == '') newBudgetRequestManagerTitle = 'Manager';


                var html = '';

                html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '  <tr>';
                html += '    <td>';

                html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';

                html += '  <tr>';
                html += '    <td>';
                html += '        &nbsp;';
                html += '    </td>';
                html += '  </tr>';
                html += '  <tr>';
                html += '    <td>';
                html += '        <span style="font-size:small;font-style:italic;">The title of the organization is displayed throughout, and also appears in email communications.</span>';
                html += '    </td>';
                html += '  </tr>';

                html += '</table>';
                html += '<table>';

                html += '  <tr>';
                html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
                html += '       Organization title:&nbsp;';
                html += '    </td>';
                html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                html += '       <input id="txtWorkflowAppTitle" type="text" value="" style="width:250px;padding:5px 5px 5px 5px;" />';
                html += '       &nbsp;&nbsp;<input class="BwSmallButton" type="button" value="Publish" onclick="cmdSaveWorkflowTitle();" />';
                html += '<br />' + workflowAppId;
                html += '    </td>';
                html += '  </tr>';

                // 7-18-2023.
                html += '  <tr>';
                html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
                html += '       Organization address block for invoices xcx1237690:&nbsp;';
                html += '    </td>';
                html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                html += '       <input id="txtWorkflowAppTitlexx" type="text" value="" style="width:250px;padding:5px 5px 5px 5px;" />';
                html += '       &nbsp;&nbsp;<input class="BwSmallButton" type="button" value="Publish" onclick="cmdSaveWorkflowTitlexx();" />';
                //html += '<br />' + workflowAppId;
                html += '    </td>';
                html += '  </tr>';

                // Organization theme/colors - bwAppThemeColorPicker.js
                html += '  <tr>';
                html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
                html += '       Organization theme/colors xcx1-3:&nbsp;';
                html += '    </td>';
                html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                html += '       <div id="divBwAppThemeColorPicker"></div>';
                html += '    </td>';
                html += '  </tr>';

                html += '</table>';

                // Current fiscal year
                html += '<br />';
                html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '  <tr>';
                html += '    <td>';
                html += '        &nbsp;';
                html += '    </td>';
                html += '  </tr>';
                html += '  <tr>';
                html += '    <td>';
                html += '        <span style="font-size:small;font-style:italic;">This is the default selection for "Fiscal Year".</span>';
                html += '    </td>';
                html += '  </tr>';
                html += '</table>';
                html += '<table>';
                html += '  <tr>';
                html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
                html += '       Current fiscal year:&nbsp;';
                html += '    </td>';
                html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                html += '       <input id="txtWorkflowAppFiscalYear" type="text" value="2021xcx353" style="width:70px;padding:5px 5px 5px 5px;" />';
                // 1-23-2022
                html += '       &nbsp;&nbsp;<input class="BwSmallButton" type="button" value="Publish" onclick="cmdSaveWorkflowFiscalYear();" />'; //cmdSaveWorkflowTitlexx();" />';
                html += '    </td>';
                html += '  </tr>';
                html += '</table>';

                if (developerModeEnabled == true) {
                    // Business operating hours.
                    html += '<br /><br />';

                    html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                    html += '  <tr>';
                    html += '    <td>';
                    html += '        &nbsp;';
                    html += '    </td>';
                    html += '  </tr>';
                    html += '  <tr>';
                    html += '    <td>';
                    html += '        <span style="font-size:small;font-style:italic;">Business operating hours.</span>';
                    html += '    </td>';
                    html += '  </tr>';
                    html += '</table>';
                    html += '<table>';
                    html += '  <tr>';
                    html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
                    html += '       Operating hours:&nbsp;';
                    html += '    </td>';
                    html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                    //html += '       <input id="txtWorkflowAppTitle_GetSharePointData" type="text" value="" style="width:200px;padding:5px 5px 5px 5px;" />';
                    //html += '       &nbsp;&nbsp;<input style="padding:5px 10px 5px 10px;" type="button" value="GET SP DATA" onclick="cmdGetSharePointData();" />';
                    html += '<div id="divBwOperationalHours"></div>';
                    html += '    </td>';
                    html += '  </tr>';
                    html += '</table>';
                }

                if (developerModeEnabled == true) {
                    html += '<br /><br />';

                    html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                    html += '  <tr>';
                    html += '    <td>';
                    html += '        &nbsp;';
                    html += '    </td>';
                    html += '  </tr>';
                    html += '  <tr>';
                    html += '    <td>';
                    html += '        <span style="font-size:small;font-style:italic;">This is a test of accessing SharePoint data in Azure.</span>';
                    html += '    </td>';
                    html += '  </tr>';
                    html += '</table>';
                    html += '<table>';
                    html += '  <tr>';
                    html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
                    html += '       Click the button:&nbsp;';
                    html += '    </td>';
                    html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                    html += '       <input id="txtWorkflowAppTitle_GetSharePointData" type="text" value="" style="width:200px;padding:5px 5px 5px 5px;" />';
                    html += '       &nbsp;&nbsp;<input style="padding:5px 10px 5px 10px;" type="button" value="GET SP DATA" onclick="cmdGetSharePointData();" />';
                    html += '    </td>';
                    html += '  </tr>';
                    html += '</table>';
                }

                // Currency symbol.
                html += '<br />';
                html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '  <tr>';
                html += '    <td>';
                html += '        <span style="font-size:small;font-style:italic;">The currency symbol is displayed throughout.</span>';
                html += '    </td></tr>';
                html += '</table>';
                html += '<table>';
                html += '  <tr>';
                html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
                html += '       Currency symbol:&nbsp;';
                html += '    </td>';
                html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                html += '       <select style="padding:5px 5px 5px 5px;" id="selectBudgetRequestCurrencySymbol">';
                html += '           <option value="Dollar" selected>$ - Dollar ($ 9.99)</option>'; // This is the default.
                html += '           <option value="Pound">£ - Pound (£ 9.99)</option>';
                html += '           <option value="Euro">€ - Euro (€ 9.99)</option>';
                html += '           <option value="Franc">₣ - Franc (₣ 9.99)</option>';

                html += '           <option value="Icelandic króna">kr - Icelandic króna (ISK) (kr 9,99)</option>'; // <a title="Icelandic króna" href="https://en.wikipedia.org/wiki/Icelandic_kr%C3%B3na">Icelandic króna (ISK)</a>
                //  <entry code="ISK" unicode-decimal="107, 114" unicode-hex="6b, 72">Iceland Krona</entry>

                html += '           <option value="Rand">R - Rand (R 9.99)</option>';
                html += '           <option value="Yen">¥ - Yen (¥ 9.99)</option>';
                html += '           <option value="Rouble">₽ - Rouble (₽ 9.99)</option>';
                html += '           <option value="Peso">₱ - Peso (₱ 9.99)</option>';
                html += '           <option value="Rupee">₹ - Rupee (₹ 9.99)</option>';
                html += '           <option value="Guilder">ƒ - Guilder (ƒ 9.99)</option>';
                html += '       </select>';
                html += '    </td>';
                html += '  </tr>';
                html += '</table>';

                html += '<br />';

                html += '<table style="width:100%;">';
                html += '<tr>';
                html += '    <td colspan="2">';
                html += '       <span style="font-size:small;font-style:italic;">This enables a top left organization logo in the topbar. DEV: THE IMAGE MAY NOT BE DISPLAYED, AND YOU HAVE TO GO AND GET IT. SEE bwAuthentication.js.renderHomePagePersonalizedSection_AndRenderButtons_AndDisplay_tableMainMenu1.lookForOrgImage().</span>';
                html += '    </td>';
                html += '</tr>';
                html += '<tr>';
                html += '   <td style="text-align:left;" class="bwSliderTitleCell">';
                html += '       Enable the top left logo:';
                html += '   </td>';
                html += '   <td class="bwChartCalculatorLightCurrencyTableCell">';
                //html += '       <label for="configurationBehaviorEnableDeveloperModeSliderxx"></label><input type="checkbox" name="configurationBehaviorEnableDeveloperModeSliderxx" id="configurationBehaviorEnableDeveloperModeSliderxx" />';
                html += '       <label for="configurationBehaviorEnableTopLeftLogoSlider"></label><input type="checkbox" name="configurationBehaviorEnableTopLeftLogoSlider" id="configurationBehaviorEnableTopLeftLogoSlider" />';
                html += '   </td>';
                html += '</tr>';
                html += '</table>';

                html += '<br />';

                html += '<table style="width:100%;">';

                // Developer mode. 
                html += '<tr>';
                html += '    <td colspan="2">';
                html += '       <span style="font-size:small;font-style:italic;">This enables functionality which is not ready for general release.</span>';
                html += '    </td>';
                html += '</tr>';
                html += '<tr>';
                html += '   <td style="text-align:left;" class="bwSliderTitleCell">';
                html += '       Enable developer mode:';
                html += '   </td>';
                html += '   <td class="bwChartCalculatorLightCurrencyTableCell">';
                html += '       <label for="configurationBehaviorEnableDeveloperModeSlider"></label><input type="checkbox" name="configurationBehaviorEnableDeveloperModeSlider" id="configurationBehaviorEnableDeveloperModeSlider" />';
                html += '   </td>';
                html += '</tr>';

                html += '</table>';

                html += '<br />';

                // Allow large file uploads.
                html += '<table style="width:100%;">';
                html += '   <tr>';
                html += '       <td colspan="2">';
                html += '           <span style="font-size:small;font-style:italic;">This enables large file uploads. Due to the potential for overwhelming the system, this is being cautiously activated.</span>';
                html += '       </td>';
                html += '   </tr>';
                html += '   <tr>';
                html += '       <td style="text-align:left;" class="bwSliderTitleCell">';
                html += '           Enable large file uploads:';
                html += '       </td>';
                html += '       <td class="bwChartCalculatorLightCurrencyTableCell">';
                html += '           <label for="configurationBehaviorEnableLargeFileUploadSlider"></label><input type="checkbox" name="configurationBehaviorEnableLargeFileUploadSlider" id="configurationBehaviorEnableLargeFileUploadSlider" />';
                html += '       </td>';
                html += '   </tr>';
                html += '</table>';

                html += '<br />';

                // "Allow multiple logons from the same ip address" section.
                html += '<table style="width:100%;">';
                html += '<tr>';
                html += '    <td colspan="2">';
                html += '       <span style="font-size:small;font-style:italic;">Turn this on if you are using multiple devices or browser windows at one time. [dev note: bright activemenu when active, greyed out when not used for some time.]</span>';
                html += '    </td>';
                html += '</tr>';
                html += '<tr>';
                html += '   <td style="text-align:left;" class="bwSliderTitleCell">';
                html += '       Allow multiple logons from the same user and ?ip address. DEV: ADD SETTINGS HERE FOR AUTH TIMEOUT AND ABILITY TO RESET ALL LOGINS. USEFUL?:';
                html += '   </td>';
                html += '   <td class="bwChartCalculatorLightCurrencyTableCell">';
                html += '       <label for="configurationBehaviorEnableMultiLogonSlider"></label><input type="checkbox" name="configurationBehaviorEnableMultiLogonSlider" id="configurationBehaviorEnableMultiLogonSlider" />';
                html += '   </td>';
                html += '</tr>';
                html += '</table>';

                html += '<br />';











                html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '  <tr>';
                html += '    <td>';
                html += '        &nbsp;';
                html += '    </td>';
                html += '  </tr>';
                html += '  <tr>';
                html += '    <td>';
                html += '        <span style="font-size:small;font-style:italic;">The externally facing url is a domain which is owned by the enterprise, and is routed to these servers. There is some configuration. This functionality is incomplete. Coming soon.</span>';
                html += '    </td>';
                html += '  </tr>';
                html += '</table>';

                html += '<table>';
                html += '  <tr>';
                html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
                html += '       Externally facing URL for attachments:&nbsp;';
                html += '    </td>';
                html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                html += '       <input id="txtWorkflowAppExternallyFacingUrlForAttachments" type="text" value="" style="width:350px;padding:5px 5px 5px 5px;" />';
                html += '       &nbsp;&nbsp;<input class="BwSmallButton" type="button" value="Publish" onclick="$(\'.bwAuthentication\').bwAuthentication(\'cmdSaveWorkflowExternallyFacingUrlForAttachments\');" />';
                //html += '<br />' + workflowAppId;
                html += '    </td>';
                html += '  </tr>';

                html += '  <tr>';
                html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
                html += '       Protocol(s):&nbsp;';
                html += '    </td>';
                html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                html += '       <input type="checkbox" checked style="cursor:pointer;" id="rbMyEmailNotificationImmediately" name="rbgMyEmailNotificationFrequency" onclick="cmdRbgMyEmailNotificationFrequency_click(\'immediately\');" />';
                html += '       <span id="spanRbEmailImmediately" style="color:gray;">Samba</span>';
                html += '       &nbsp;';
                html += '       <input type="checkbox" checked style="cursor:pointer;" id="rbMyEmailNotificationImmediately" name="rbgMyEmailNotificationFrequency" onclick="cmdRbgMyEmailNotificationFrequency_click(\'immediately\');" />';
                html += '       <span id="spanRbEmailImmediately" style="color:gray;">SCP</span>';
                html += '    </td>';
                html += '  </tr>';

                html += '  <tr>';
                html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
                html += '       Samba externally shared files (source) folder:&nbsp;';
                html += '    </td>';
                html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                //html += '       <input id="txtWorkflowAppExternallyFacingUrlForAttachmentsSourceFolder" type="text" value="\\\\192.168.0.2\\www\\huntleysdivingandmarine.video" style="width:350px;padding:5px 5px 5px 5px;" />';
                html += '       <input id="txtWorkflowAppExternallyFacingUrlForAttachmentsSourceFolder" type="text" value="" style="width:350px;padding:5px 5px 5px 5px;" />';
                html += '       &nbsp;&nbsp;<input class="BwSmallButton" type="button" value="Publish" onclick="$(\'.bwAuthentication\').bwAuthentication(\'cmdSaveWorkflowExternallyFacingUrlForAttachmentsSourceFolder\');" />';
                html += '    </td>';
                html += '  </tr>';

                html += '  <tr>';
                html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
                html += '       SCP externally shared files (source) folder:&nbsp;';
                html += '    </td>';
                html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                html += '       <input id="txtWorkflowAppExternallyFacingUrlForAttachmentsSourceFolderxx" type="text" value="" style="width:350px;padding:5px 5px 5px 5px;" />';
                html += '       &nbsp;&nbsp;<input class="BwSmallButton" type="button" value="Publish" onclick="$(\'.bwAuthentication\').bwAuthentication(\'cmdSaveWorkflowExternallyFacingUrlForAttachmentsSourceFolder\');" />';
                html += '    </td>';
                html += '  </tr>';

                html += '</table>';

                html += '<br />';

                // old event: selectBudgetRequestTitleFormat

                html += '<br /><br />';

                html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '<tr>';
                html += '   <td style="text-align:left;" class="bwSliderTitleCell">';
                html += '       Selected Request Title Format: <input type="radio" name="cbRequestTitleFormat" value="default" checked /> Default    <input type="radio" name="cbRequestTitleFormat" value="custom" /> Custom';
                html += '   </td>';
                html += '</tr>';
                html += '</table>';

                html += '<table>';
                html += '  <tr>';
                html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
                html += '       Select the Request Title format:&nbsp;';
                html += '    </td>';
                html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                html += '<br /><br />';

                html += '       <select style="padding:5px 5px 5px 5px;" id="selectBudgetRequestTitleFormaxxt">';
                html += '           <option value="[BR/SR/CP/QR/RR/RE/WO]YY#####" selected>';
                html += '               eg: BR-108-22-30C [request type abbreviation]-[classification #]-[year]-[item #][additional classification character]';
                html += '           </option>';
                html += '       </select>';

                html += '<br /><br />';
                html += 'eg: BR-108-22-30C [request type abbreviation]-[classification #]-[year]-[item #][additional classification character]';
                html += '<br /><br />';
                html += 'request type abbreviation select (BR)';
                html += '<br />';
                html += 'classification select (108)';
                html += '<br />';
                html += 'year select (22)';
                html += '<br />';
                html += 'item # (30)';
                html += '<br />';
                html += 'additional classification select (C)';
                html += '<br />';

                // Here are some ideas for the Title!
                // [BR/SR]YY#####
                // [BR/SR]#####YY
                // [AR/SR]YY#####
                // [AR/SR]#####YY
                html += '       <select style="padding:5px 5px 5px 5px;" id="selectBudgetRequestTitleFormaxxt">';
                html += '           <option value="[BR/SR/CP/QR/RR/RE/WO]YY#####" selected>[BR/SR/CP/QR/RR/RE/WO]YY#####</option>';
                html += '           <option value="[BR/SR/CP/QR/RR/RE/WO]#####YY">[BR/SR/CP/QR/RR/RE/WO]#####YY</option>';
                html += '           <option value="[BR/SR/CP/QR/RR/RE/WO]YY#####">[BR/SR/CP/QR/RR/RE/WO]YY#####</option>';
                html += '           <option value="[BR/SR/CP/QR/RR/RE/WO]#####YY">[BR/SR/CP/QR/RR/RE/WO]#####YY</option>';
                html += '       </select>';

                //html += '       &nbsp;&nbsp;<input type="button" value="Save" onclick="cmdSaveBudgetRequestTitlePrefix();" />';
                html += '    </td>';
                html += '  </tr>';
                html += '</table>';

                if (developerModeEnabled == true) {
                    // Budget request title format.
                    html += '<br /><br />';
                    html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                    html += '  <tr>';
                    html += '    <td>';
                    html += '        <span style="font-size:small;font-style:italic;">The title of the budget requests is displayed throughout, and also appears in email communications.</span>';
                    html += '    </td></tr>';
                    html += '</table>';
                    html += '<table>';
                    html += '  <tr>';
                    html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
                    html += '       Budget request title format:&nbsp;';
                    html += '    </td>';
                    html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                    //html += '       <input id="txtBudgetRequestTitlePrefix" type="text" value="[BR/SR]-YY#####" style="width:200px;" contentEditable="false" />';

                    // Here are some ideas for the Title!
                    // [BR/SR]YY#####
                    // [BR/SR]#####YY
                    // [AR/SR]YY#####
                    // [AR/SR]#####YY
                    html += '       <select style="padding:5px 5px 5px 5px;" id="selectBudgetRequestTitleFormat">';
                    html += '           <option value="[BR/SR/CP/QR/RR/RE/WO]YY#####" selected>[BR/SR/CP/QR/RR/RE/WO]YY#####</option>';
                    html += '           <option value="[BR/SR/CP/QR/RR/RE/WO]#####YY">[BR/SR/CP/QR/RR/RE/WO]#####YY</option>';
                    html += '           <option value="[BR/SR/CP/QR/RR/RE/WO]YY#####">[BR/SR/CP/QR/RR/RE/WO]YY#####</option>';
                    html += '           <option value="[BR/SR/CP/QR/RR/RE/WO]#####YY">[BR/SR/CP/QR/RR/RE/WO]#####YY</option>';
                    html += '       </select>';

                    //html += '       &nbsp;&nbsp;<input type="button" value="Save" onclick="cmdSaveBudgetRequestTitlePrefix();" />';
                    html += '    </td>';
                    html += '  </tr>';
                    html += '</table>';
                }


                if (developerModeEnabled == true) {
                    // Procurement.
                    html += '<br /><br />';
                    html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                    html += '  <tr>';
                    html += '    <td>';
                    html += '        <span style="font-size:small;font-style:italic;">Specifying a user here enables the PO# issuing process. When a Budget Request has been completely approved, this user will issue a Purchase Order Number from your accounting system, and the Budget Request will be marked as Active.</span>';
                    html += '    </td></tr>';
                    html += '</table>';
                    html += '<table>';
                    html += '  <tr>';
                    html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
                    html += '       <span id="spanDepartmentTitle"></span>:&nbsp;';
                    html += '    </td>';
                    html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                    html += '       <input style="padding:5px 5px 5px 5px;" id="txtBwDepartmentUserName" onfocus="this.blur();" contenteditable="false" onclick="cmdDisplayPeoplePickerDialog(\'txtBwDepartmentUserName\', \'txtBwDepartmentUserId\', \'txtBwDepartmentUserEmail\', \'btnSaveRemoveAccountingDepartmentUser\');" title="" />';
                    html += '       <input id="txtBwDepartmentUserId" style="display:none;" />';
                    html += '       <input id="txtBwDepartmentUserEmail" style="display:none;" />';
                    html += '       &nbsp;<img src="images/addressbook-icon18x18.png" onclick="cmdDisplayPeoplePickerDialog(\'txtBwDepartmentUserName\', \'txtBwDepartmentUserId\', \'txtBwDepartmentUserEmail\', \'btnSaveRemoveAccountingDepartmentUser\');" style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" />';
                    //html += '       &nbsp;&nbsp;<input type="button" value="Save" id="btnSaveAccountingDepartmentUser" onclick="cmdSaveAccountingDepartmentUser();" />';
                    html += '       &nbsp;&nbsp;<span id="spanSaveAccountingDepartmentUserButton"></span>';
                    html += '    </td>';
                    html += '  </tr>';
                    html += '</table>';
                }

                if (developerModeEnabled == true) {
                    //Manager title.
                    html += '<br /><br />';
                    html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                    html += '  <tr>';
                    html += '    <td>';
                    html += '        <span style="font-size:small;font-style:italic;">The title of the person responsible for completing the details of a New Request. This is displayed on the Budget Request forms. The default is "Manager".</span>';
                    html += '    </td></tr>';
                    html += '</table>';
                    html += '<table>';
                    html += '  <tr>';
                    html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
                    html += '       Manager title:&nbsp;';
                    html += '    </td>';
                    html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                    html += '       <input style="padding:5px 5px 5px 5px;" id="NewBudgetRequestManagerTitle" type="text" value="' + newBudgetRequestManagerTitle + '" />';
                    html += '       &nbsp;&nbsp;<input style="padding:5px 10px 5px 10px;" type="button" value="Publish" onclick="cmdSaveNewRequestManagerTitle();" />';
                    html += '    </td>';
                    html += '  </tr>';
                    html += '</table>';
                }

                if (developerModeEnabled == true) {
                    // Request types settings... a few ones here.
                    html += '<br /><br />';

                    html += '<table>';
                    html += '<tr>';
                    html += '  <td>';
                    // Create the drop down at the top of the page, and select the last used option!
                    //debugger;
                    var requestTypes = bwEnabledRequestTypes.EnabledItems;
                    //var requestTypes1 = $('.bwOrganizationEditor').bwOrganizationEditor('getBwEnabledRequestTypes'); // .EnabledItems; //this.options.bwEnabledRequestTypes.EnabledItems;
                    //var requestTypes = requestTypes1.EnabledItems;

                    //var bwLastSelectedNewRequestType = 'capitalplanproject';
                    if (requestTypes.length == 1) { // If there is only one, don't display as a drop down, just as plain text.
                        html += '<span style="font-size:small;font-style:italic;">The following settings apply to: </span>';
                    } else { // There is more than 1, so we have to display as a drop down.
                        html += '<span style="font-size:small;font-style:italic;">The following settings apply to: </span>';
                    }
                    html += '  </td>';
                    html += '  <td>';

                    // Render the drop down at the top of the page, and select the last used option!
                    var bwLastSelectedNewRequestType = 'all';
                    if (requestTypes.length == 1) { // If there is only one, don't display as a drop down, just as plain text.
                        html += '<span style="font_weight:bold;color:black;"><strong>' + requestTypes[0].RequestType + '</strong></span>';
                    } else { // There is more than 1, so we have to display as a drop down.
                        html += '<span style="font_weight:bold;color:black;"><strong>';
                        html += '   <select id="selectSettingsRequestTypeDropDown" onchange="selectSettingsRequestTypeDropDown_Onchange(\'selectSettingsRequestTypeDropDown\');" style=\'border-color: whitesmoke; color: rgb(38, 38, 38); font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 14pt; font-weight: bold; cursor: pointer;\'>'; // was .5em
                        html += '<option value="' + 'All request types' + '" selected >' + 'All request types' + '</option>';
                        for (var i = 0; i < requestTypes.length; i++) {
                            if (requestTypes[i].Abbreviation == bwLastSelectedNewRequestType) { // Selected
                                html += '<option value="' + requestTypes[i].Abbreviation + '" selected >' + requestTypes[i].RequestType + '</option>';
                            } else { // Not selected
                                html += '<option value="' + requestTypes[i].Abbreviation + '">' + requestTypes[i].RequestType + '</option>';
                            }
                        }
                        html += '   </select>';
                        html += '</span>';
                    }

                    //html += '&nbsp;&nbsp;<span style="font-weight:normal;font-style:italic;color:grey;"><input id="WorkflowForAllRequestTypesCheckbox" type="checkbox" checked="checked" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'WorkflowForAllRequestTypesCheckbox_Onchange\');" />All request types inherit this workflow</span>';

                    html += '  </td>';
                    html += '</tr>';
                    // 
                    html += '<tr>';
                    html += '  <td>';
                    html += '  </td>';
                    html += '  <td>';
                    html += '    <span id="spanWorkflowsDropDownList"></span>';
                    html += '  </td>';
                    html += '</tr>';

                    html += '</table>';
                }

                html += '<br /><br />';

                html += '<table>';

                if (developerModeEnabled == true) {

                    //html += '<tr>';
                    //html += '   <td style="text-align:left;" class="bwSliderTitleCell">';
                    //html += '       Require start/end dates on new requests:';
                    //html += '   </td>';
                    //html += '   <td class="bwChartCalculatorLightCurrencyTableCell">';
                    //html += '       <label for="configurationBehaviorRequireStartEndDatesSlider"></label><input type="checkbox" name="configurationBehaviorRequireStartEndDatesSlider" id="configurationBehaviorRequireStartEndDatesSlider" />';
                    //html += '   </td>';
                    //html += '</tr>';
                    //html += '<tr><td>&nbsp;</td><td></td></tr>';

                    //html += '<tr>';
                    //html += '   <td style="text-align:left;" class="bwSliderTitleCell">';
                    //html += '       Require that a new request has some details:';
                    //html += '   </td>';
                    //html += '   <td class="bwChartCalculatorLightCurrencyTableCell">';
                    //html += '       <label for="configurationBehaviorRequireDetailsSlider"></label><input type="checkbox" name="configurationBehaviorRequireDetailsSlider" id="configurationBehaviorRequireDetailsSlider" />';
                    //html += '   </td>';
                    //html += '</tr>';
                    //html += '<tr><td>&nbsp;</td><td></td></tr>';

                    //html += '<tr>';
                    //html += '    <td colspan="2">';
                    //html += '<span style="font-size:small;font-style:italic;"></span>';
                    //html += '    </td>';
                    //html += '</tr>';
                    //html += '<tr>';
                    //html += '   <td style="text-align:left;" class="bwSliderTitleCell">';
                    //html += '       Require attachments on new requests:';
                    //html += '   </td>';
                    //html += '   <td class="bwChartCalculatorLightCurrencyTableCell">';
                    //html += '       <label for="configurationBehaviorEnableNewRequestAttachmentsSlider"></label><input type="checkbox" name="configurationBehaviorEnableNewRequestAttachmentsSlider" id="configurationBehaviorEnableNewRequestAttachmentsSlider" />';
                    //html += '   </td>';
                    //html += '</tr>';
                    //html += '<tr><td>&nbsp;</td><td></td></tr>';

                    //html += '<tr>';
                    //html += '    <td colspan="2">';
                    //html += '<span style="font-size:small;font-style:italic;"></span>';
                    //html += '    </td>';
                    //html += '</tr>';
                    //html += '<tr>';
                    //html += '   <td style="text-align:left;" class="bwSliderTitleCell">';
                    //html += '       Require barcodes:';
                    //html += '   </td>';
                    //html += '   <td class="bwChartCalculatorLightCurrencyTableCell">';
                    //html += '       <label for="configurationBehaviorEnableNewRequestBarcodeAttachmentsSlider"></label><input type="checkbox" name="configurationBehaviorEnableNewRequestBarcodeAttachmentsSlider" id="configurationBehaviorEnableNewRequestBarcodeAttachmentsSlider" />';
                    //html += '   </td>';
                    //html += '</tr>';
                    //html += '<tr><td>&nbsp;</td><td></td></tr>';

                    //html += '<tr>';
                    //html += '   <td style="text-align:left;" class="bwSliderTitleCell">';
                    //html += '       Enable quoting:';
                    //html += '   </td>';
                    //html += '   <td class="bwChartCalculatorLightCurrencyTableCell">';
                    //html += '       <label for="configurationBehaviorEnableQuotingSlider"></label><input type="checkbox" name="configurationBehaviorEnableQuotingSlider" id="configurationBehaviorEnableQuotingSlider" />';
                    //html += '   </td>';
                    //html += '</tr>';
                    //html += '<tr><td>&nbsp;</td><td></td></tr>';


                    //html += '<tr>';
                    //html += '   <td style="text-align:left;" class="bwSliderTitleCell">';
                    //html += '       Enable reimbursement requests:';
                    //html += '   </td>';
                    //html += '   <td class="bwChartCalculatorLightCurrencyTableCell">';
                    //html += '       <label for="configurationBehaviorEnableReimbursementRequestsSlider"></label><input type="checkbox" name="configurationBehaviorEnableReimbursementRequestsSlider" id="configurationBehaviorEnableReimbursementRequestsSlider" />';
                    //html += '   </td>';
                    //html += '</tr>';
                    //html += '<tr><td>&nbsp;</td><td></td></tr>';




                    // Capital expenses are part of the bronze package.
                    if (gWorkflowLicenseStatus == 'bronze' || gWorkflowLicenseStatus == 'silver' || gWorkflowLicenseStatus == 'gold') {
                        html += '<tr>';
                        html += '   <td style="text-align:left;" class="bwSliderTitleCell">';
                        html += '       Enable capital and expense tracking:';
                        html += '   </td>';
                        html += '   <td class="bwChartCalculatorLightCurrencyTableCell">';
                        html += '       <label for="configurationBehaviorEnableCapitalAndExpenseTrackingSlider"></label><input type="checkbox" name="configurationBehaviorEnableCapitalAndExpenseTrackingSlider" id="configurationBehaviorEnableCapitalAndExpenseTrackingSlider" />';
                        //if (recurringExpensesEnabled) {
                        //    html += '<span id="spanRecurringExpensesChoiceOnFixedDates"><input type="radio" name="rbRecurringExpensesChoice" /><span>recurring on fixed dates</span></span><br />';
                        //    html += '<span id="spanRecurringExpensesChoiceOnATimePeriod"><input type="radio" name="rbRecurringExpensesChoice" /><span>recurring on a time period</span></span><br />';
                        //} else {
                        //    html += '<span id="spanRecurringExpensesChoiceOnFixedDates"><input type="radio" name="rbRecurringExpensesChoice" disabled /><span style="color: #adadad;">recurring on fixed dates</span></span><br />';
                        //    html += '<span id="spanRecurringExpensesChoiceOnATimePeriod"><input type="radio" name="rbRecurringExpensesChoice" disabled /><span style="color: #adadad;">recurring on a time period</span></span><br />';
                        //}
                        html += '   </td>';
                        html += '</tr>';
                        html += '<tr><td>&nbsp;</td><td></td></tr>';
                    }


                    // Recurring expenses are part of the silver package.
                    //if (gWorkflowLicenseStatus == 'silver' || gWorkflowLicenseStatus == 'gold') {
                    //    html += '<tr>';
                    //    html += '   <td style="text-align:left;" class="bwSliderTitleCell">';
                    //    html += '       Enable recurring expenses:';
                    //    html += '   </td>';
                    //    html += '   <td class="bwChartCalculatorLightCurrencyTableCell">';
                    //    html += '       <label for="configurationBehaviorEnableRecurringExpensesSlider"></label><input type="checkbox" name="configurationBehaviorEnableRecurringExpensesSlider" id="configurationBehaviorEnableRecurringExpensesSlider" />';
                    //    //if (recurringExpensesEnabled) {
                    //    //    html += '<span id="spanRecurringExpensesChoiceOnFixedDates"><input type="radio" name="rbRecurringExpensesChoice" /><span>recurring on fixed dates</span></span><br />';
                    //    //    html += '<span id="spanRecurringExpensesChoiceOnATimePeriod"><input type="radio" name="rbRecurringExpensesChoice" /><span>recurring on a time period</span></span><br />';
                    //    //} else {
                    //    //    html += '<span id="spanRecurringExpensesChoiceOnFixedDates"><input type="radio" name="rbRecurringExpensesChoice" disabled /><span style="color: #adadad;">recurring on fixed dates</span></span><br />';
                    //    //    html += '<span id="spanRecurringExpensesChoiceOnATimePeriod"><input type="radio" name="rbRecurringExpensesChoice" disabled /><span style="color: #adadad;">recurring on a time period</span></span><br />';
                    //    //}
                    //    html += '   </td>';
                    //    html += '</tr>';
                    //    html += '<tr><td>&nbsp;</td><td></td></tr>';
                    //}

                    // Supplementals are part of the gold package.
                    if (gWorkflowLicenseStatus == 'gold') {
                        html += '<tr>';
                        html += '   <td style="text-align:left;" class="bwSliderTitleCell">';
                        html += '       Enable addendums to existing requests (supplementals):';
                        html += '   </td>';
                        html += '   <td class="bwChartCalculatorLightCurrencyTableCell">';
                        html += '       <label for="configurationBehaviorEnableSupplementalsSlider"></label><input type="checkbox" name="configurationBehaviorEnableSupplementalsSlider" id="configurationBehaviorEnableSupplementalsSlider" />';
                        //html += '<input type="radio" />recurring on fixed dates<br />';
                        //html += '<input type="radio" />recurring on a time period<br />';
                        html += '   </td>';
                        html += '</tr>';
                        html += '<tr><td>&nbsp;</td><td></td></tr>';
                    }


                    html += '<tr>';
                    html += '   <td style="text-align:left;" class="bwSliderTitleCell">';
                    html += '       Enable closeouts:';
                    html += '   </td>';
                    html += '   <td class="bwChartCalculatorLightCurrencyTableCell">';
                    html += '       <label for="configurationBehaviorEnableCloseOutsSlider"></label><input type="checkbox" name="configurationBehaviorEnableCloseOutsSlider" id="configurationBehaviorEnableCloseOutsSlider" />';
                    html += '   </td>';
                    html += '</tr>';
                    html += '<tr><td>&nbsp;</td><td></td></tr>';



                    if (gWorkflowLicenseStatus == 'gold') {
                        // Strict auditing controls.
                        html += '<tr>';
                        html += '    <td colspan="2">';
                        html += '       <span style="font-size:small;font-style:italic;">This ensures that deleted items are retained for future reference. This functionality is incomplete. Coming soon!</span>';
                        html += '    </td>';
                        html += '</tr>';
                        html += '<tr>';
                        html += '   <td style="text-align:left;" class="bwSliderTitleCell">';
                        html += '       Enable strict auditing controls:';
                        html += '   </td>';
                        html += '   <td class="bwChartCalculatorLightCurrencyTableCell">';
                        html += '       <label for="configurationBehaviorEnableStrictAuditingSlider"></label><input type="checkbox" name="configurationBehaviorEnableStrictAuditingSlider" id="configurationBehaviorEnableStrictAuditingSlider" />';
                        html += '   </td>';
                        html += '</tr>';
                        html += '<tr><td>&nbsp;</td><td></td></tr>';


                    }


                }

                //html += '<tr><td>&nbsp;</td><td></td></tr>';




                html += '</table>';


                // "Deleted Requests" email template.
                html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '  <tr>';
                html += '    <td>';
                html += '        &nbsp;';
                html += '    </td>';
                html += '  </tr>';
                html += '  <tr>';
                html += '    <td>';
                html += '        <span style="font-size:small;font-style:italic;">This organization\'s custom email for deleted requests.</span>';
                html += '    </td>';
                html += '  </tr>';
                html += '</table>';
                html += '<table>';
                html += '  <tr>';
                html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
                html += '       "Deleted Requests" email template:&nbsp;';
                html += '    </td>';
                html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                html += '       <span xcx="xcx123424" class="spanButton" onclick="$(\'.bwEmailEditor_DeletedRequest\').bwEmailEditor_DeletedRequest(\'displayConfigureIntroductoryEmailDialog\', \'Create\');"><span style="font-size:15pt;display:inline-block;">✉</span> Configure "A request has been deleted" email&nbsp;&nbsp;</span>';
                html += '    </td>';
                html += '  </tr>';
                html += '</table>';

                html += '<div id="divBwEmailEditor_DeletedRequest">[divBwEmailEditor_DeletedRequest]</div>';



                //html += '<br /><br />';



                // "Reverted Requests" email template.
                html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '  <tr>';
                html += '    <td>';
                html += '        &nbsp;';
                html += '    </td>';
                html += '  </tr>';
                html += '  <tr>';
                html += '    <td>';
                html += '        <span style="font-size:small;font-style:italic;">This organization\'s custom email for rolled-back tasks.</span>';
                html += '    </td>';
                html += '  </tr>';
                html += '</table>';
                html += '<table>';
                html += '  <tr>';
                html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
                html += '       "Rolled-Back Tasks" email template:&nbsp;';
                html += '    </td>';
                html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                //html += '       <span xcx="xcx123424" class="spanButton" onclick="$(\'.bwEmailEditor_DeletedRequest\').bwEmailEditor_DeletedRequest(\'displayConfigureIntroductoryEmailDialog\', \'Create\');"><span style="font-size:15pt;display:inline-block;">✉</span> Configure "A request has been deleted" email&nbsp;&nbsp;</span>';
                html += '       <span xcx="xcx123424" class="spanButton" onclick="$(\'.bwEmailEditor_RevertedRequest\').bwEmailEditor_RevertedRequest(\'displayConfigureIntroductoryEmailDialog\', \'Create\');"><span style="font-size:15pt;display:inline-block;">✉</span> Configure "A task has been rolled-back" email&nbsp;&nbsp;</span>';
                html += '    </td>';
                html += '  </tr>';
                html += '</table>';

                html += '<div id="divBwEmailEditor_RevertedRequest">[divBwEmailEditor_RevertedRequest]</div>';



                html += '<br /><br />';





















                // Request Type section.
                html += '<div id="divBwRequestTypeEditor"></div>';
                html += '<br /><br />';







                //// divBwEmailMonitor_Admin section. Intended to display the errors and suggestions. 3-24-2024.
                //html += '<div id="divBwEmailMonitor_Admin"></div>';
                //html += '<br /><br />';

                //// bwMonitoringTools2 section. Intended to display the errors and suggestions. 3-24-2024.
                //html += '<div id="divBwMonitoringTools2"></div>';
                //html += '<br /><br />';







                // Project Type section.
                html += '<br />';
                html += '<div id="divBwProjectTypeEditor"></div>';
                html += '<br /><br />';

                // Pillar Type section.
                html += '<div id="divBwPillarTypeEditor"></div>';
                html += '<br /><br />';


                if (developerModeEnabled == true) {
                    html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                    html += '  <tr>';
                    html += '    <td>';
                    html += '        <span style="font-size:small;font-style:italic;">If you have purchased licenses, you can add them here.</span>';
                    html += '    </td></tr>';
                    html += '</table>';
                    html += '<table>';
                    html += '  <tr>';
                    html += '    <td style="text-align:left;vertical-align:middle;" class="bwSliderTitleCell">';
                    html += '       License:&nbsp;';
                    html += '    </td>';
                    html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                    html += '       <input id="txtLicense" type="text" value="" style="width:270px;padding:5px 5px 5px 5px;" onkeyup="kupValidateLicenseFormat();" onchange="kupValidateLicenseFormat();" />';
                    html += '       &nbsp;&nbsp;';
                    html += '       <input type="button" id="btnAddNewLicense" value="Add" onclick="cmdAddNewLicense();" disabled style="cursor:pointer;padding:5px 10px 5px 10px;" />';
                    //html += '       <input type="button" id="btnPurchaseNewLicense" value="Purchase" onclick="alert(\'xThis functionality is incomplete. Coming soon!\');" style="cursor:pointer;padding:5px 10px 5px 10px;" />';
                    html += '       <span id="spanLicenseStatus"></span>';
                    // Todd: Do we want this? no it is already here above or below not sure
                    //html += '       <br /><span style="font-size:small;"><i>You currently have no licenses.</i></span>';
                    //html += '       <br /><span style="font-size:small;"><i><a href="javascript:cmdUpgradeAndPricingOptions();">Click here to learn about your upgrade options.</a></i></span>';
                    html += '    </td>';
                    html += '  </tr>';
                    html += '  <tr>';
                    html += '    <td>';
                    html += '    </td>';
                    html += '    <td style="text-align:right;">';
                    html += '      <span style="font-size:small;font-style:italic;text-align:right;"><i><a href="javascript:cmdUpgradeAndPricingOptions2();">Click here to learn about your upgrade options.</a></i></span>';
                    html += '';
                    html += '    </td>';
                    html += '  </tr>';
                    html += '  <tr>';
                    html += '    <td colspan="2">';
                    html += '      <div id="divPackagesForSale"></div>';
                    html += '    </td>';
                    html += '  </tr>';
                    //html += '  <tr>';
                    //html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
                    //html += '       Package level:&nbsp;';
                    //html += '    </td>';
                    //html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                    //html += tenantPackage + '&nbsp;&nbsp;';
                    //html += '    </td>';
                    //html += '  </tr>';
                    html += '</table>';
                }








                //html += '<br /><br />';


                //html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                //html += '  <tr>';
                //html += '    <td>';
                //html += '        <span style="font-size:small;font-style:italic;">Import REQUESTS from Sql Server (BETA).</span>';
                //html += '    </td></tr>';
                //html += '</table>';
                //html += '<table>';
                //html += '  <tr>';
                //html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                //html += '       <input type="button" id="btnConnectToSqlServer" value="Import Requests from Sql Server" onclick="cmdImportRequestsFromSqlServer();" style="cursor:pointer;padding:5px 10px 5px 10px;" />';
                //html += '    </td>';
                //html += '  </tr>';
                //html += '</table>';










                //html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                //html += '  <tr>';
                //html += '    <td>';
                ////html += '        <span style="font-size:small;font-style:italic;">The title of the person responsible for completing the details of a New Request. This is displayed on the Budget Request forms. The default is "Manager".</span>';
                //html += '    </td></tr>';
                //html += '</table>';
                //html += '<table>';
                //html += '  <tr>';
                //html += '    <td style="text-align:left;vertical-align:top;" class="bwSliderTitleCell">';
                //html += '       Project Types:&nbsp;';
                //html += '    </td>';
                //html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';

                //html += '<style>';
                //html += '.dataGridTable { border: 1px solid gainsboro; font-size:14px; font-family: "Helvetica Neue","Segoe UI",Helvetica,Verdana,sans-serif; }';
                //html += '.dataGridTable td { border-left: 0px; border-right: 1px solid gainsboro; }';
                //html += '.headerRow { background-color:white; color:gray;border-bottom:1px solid gainsboro; }';
                //html += '.headerRow td { border-bottom:1px solid gainsboro; padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
                //html += '.filterRow td { border-bottom:1px solid whitesmoke; padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
                //html += '.alternatingRowLight { background-color:white; }';
                //html += '.alternatingRowLight td { padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
                //html += '.alternatingRowLight:hover { background-color:lightgoldenrodyellow; }';
                //html += '.alternatingRowDark { background-color:whitesmoke; }';
                //html += '.alternatingRowDark td { padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
                //html += '.alternatingRowDark:hover { background-color:lightgoldenrodyellow; }';
                //html += '</style>';

                //html += '<table class="dataGridTable">';
                //html += '  <tr class="headerRow">';
                //html += '    <td>Abbreviation</td>';
                //html += '    <td>Description</td>';
                //html += '    <td></td>';
                //html += '    <td></td>';
                //html += '  </tr>';

                //var projectTypesJson = [];
                //var projectType1 = {
                //    ProjectTypeId: '112-22234-455-61',
                //    Abbreviation: 'ENV',
                //    Description: 'Environmental'
                //}
                //var projectType2 = {
                //    ProjectTypeId: '112-22234-455-62',
                //    Abbreviation: 'EQ',
                //    Description: 'Equipment'
                //}
                //var projectType3 = {
                //    ProjectTypeId: '112-22234-455-63',
                //    Abbreviation: 'IN',
                //    Description: 'Innovation'
                //}
                //projectTypesJson.push(projectType1);
                //projectTypesJson.push(projectType2);
                //projectTypesJson.push(projectType3);

                //var alternatingRow = 'light'; // Use this to color the rows.
                //for (var i = 0; i < projectTypesJson.length; i++) {
                //    if (alternatingRow == 'light') {
                //        html += '  <tr class="alternatingRowLight" style="cursor:pointer;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayParticipantRoleMultiPickerInACircle\', true, \'' + 'btnEditRaciRoles_' + 'xx' + '\', \'' + 'xx' + '\', \'' + 'xx' + '\', \'' + 'xx' + '\');">';
                //        alternatingRow = 'dark';
                //    } else {
                //        html += '  <tr class="alternatingRowDark" style="cursor:pointer;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayParticipantRoleMultiPickerInACircle\', true, \'' + 'btnEditRaciRoles_' + 'xx' + '\', \'' + 'xx' + '\', \'' + 'xx' + '\', \'' + 'xx' + '\');">';
                //        alternatingRow = 'light';
                //    }
                //    html += '    <td>' + projectTypesJson[i].Abbreviation + '</td>';
                //    html += '    <td>' + projectTypesJson[i].Description + '</td>';
                //    html += '    <td><button class="BwSmallButton" onclick="cmdDisplayChangeUserRoleDialogx(\'' + 'xx' + '\');">edit</button></td>';
                //    html += '    <td><img src="images/trash-can.png" onclick="cmdDisplayDeleteUserDialogx(\'' + 'xx' + '\');" title="Delete" style="cursor:pointer;" /></td>';

                //    html += '  </tr>';
                //}
                //html += '</table>';
                //html += '<br />';
                //html += '<input style="padding:5px 10px 5px 10px;" id="btnCreateRole2" onclick="$(\'.bwCircleDialog\').bwCircleDialog(\'displayAddANewPersonInACirclexx\', true);" type="button" value="Add a Project type...">';
                //// end: Project Type section.


















                html += '    </td>';
                html += '  </tr>';
                html += '</table>';



                //html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                //html += '  <tr>';
                //html += '    <td>';
                //html += '        <span id="configurationBehaviorTurnOffEmailSlider_Description" style="font-size:small;font-style:italic;">[configurationBehaviorTurnOffEmailSlider_Description]</span>';
                //html += '    </td></tr>';
                //html += '</table>';
                //html += '<table>';
                //html += '  <tr>';
                //html += '    <td style="text-align:left;vertical-align:middle;" class="bwSliderTitleCell">';
                //html += '       Enable email:&nbsp;';
                //html += '    </td>';
                //html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                //html += '       <table>';
                //html += '           <tr>';
                //html += '               <td>';
                //html += '                   <label for="configurationBehaviorTurnOffEmailSlider"></label><input type="checkbox" name="configurationBehaviorTurnOffEmailSlider" id="configurationBehaviorTurnOffEmailSlider" />';
                //html += '               </td>';
                //html += '               <td>';
                //html += '                   &nbsp;&nbsp;';
                //html += '               </td>';
                //html += '               <td>';
                //html += '                   <span id="configurationBehaviorTurnOffEmailSlider_CurrentStatus">[configurationBehaviorTurnOffEmailSlider_CurrentStatus]</span>';
                //html += '               </td>';
                //html += '           </tr>';
                //html += '       </table>';
                //html += '    </td>';
                //html += '  </tr>';
                //html += '</table>';








                //html += '<br />';

                //html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                //html += '  <tr>';
                //html += '    <td>';
                //html += '        <span style="font-size:small;font-style:italic;">If you have purchased licenses, you can add them here.</span>';
                //html += '    </td></tr>';
                //html += '</table>';
                //html += '<table>';
                //html += '  <tr>';
                //html += '    <td style="text-align:left;vertical-align:middle;" class="bwSliderTitleCell">';
                //html += '       License:&nbsp;';
                //html += '    </td>';
                //html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                //html += '       <input id="txtLicense" type="text" value="" style="width:270px;padding:5px 5px 5px 5px;" onkeyup="kupValidateLicenseFormat();" onchange="kupValidateLicenseFormat();" />';
                //html += '       &nbsp;&nbsp;';
                //html += '       <input type="button" id="btnAddNewLicense" value="Add" onclick="cmdAddNewLicense();" disabled style="cursor:pointer;padding:5px 10px 5px 10px;" />';
                ////html += '       <input type="button" id="btnPurchaseNewLicense" value="Purchase" onclick="alert(\'xThis functionality is incomplete. Coming soon!\');" style="cursor:pointer;padding:5px 10px 5px 10px;" />';
                //html += '       <span id="spanLicenseStatus"></span>';
                //// Todd: Do we want this? no it is already here above or below not sure
                ////html += '       <br /><span style="font-size:small;"><i>You currently have no licenses.</i></span>';
                ////html += '       <br /><span style="font-size:small;"><i><a href="javascript:cmdUpgradeAndPricingOptions();">Click here to learn about your upgrade options.</a></i></span>';
                //html += '    </td>';
                //html += '  </tr>';
                //html += '  <tr>';
                //html += '    <td>';
                //html += '    </td>';
                //html += '    <td style="text-align:right;">';
                //html += '      <span style="font-size:small;font-style:italic;text-align:right;"><i><a href="javascript:cmdUpgradeAndPricingOptions2();">Click here to learn about your upgrade options.</a></i></span>';
                //html += '';
                //html += '    </td>';
                //html += '  </tr>';
                //html += '  <tr>';
                //html += '    <td colspan="2">';
                //html += '      <div id="divPackagesForSale"></div>';
                //html += '    </td>';
                //html += '  </tr>';
                ////html += '  <tr>';
                ////html += '    <td style="text-align:left;" class="bwSliderTitleCell">';
                ////html += '       Package level:&nbsp;';
                ////html += '    </td>';
                ////html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                ////html += tenantPackage + '&nbsp;&nbsp;';
                ////html += '    </td>';
                ////html += '  </tr>';
                //html += '</table>';












                html += '';
                html += '    </td>';
                html += '  </tr>';
                html += '</table>';
                html += '<br /><br />';
                $('#divPageContent3').append(html);



                debugger;



                $('#divBwEmailEditor_DeletedRequest').bwEmailEditor_DeletedRequest({});

                $('#divBwEmailEditor_RevertedRequest').bwEmailEditor_RevertedRequest({});

                var requestTypeEditorOptions = {};
                $('#divBwRequestTypeEditor').bwRequestTypeEditor(requestTypeEditorOptions);






                if (developerModeEnabled == true) {
                    var projectTypeEditorOptions = {};
                    $('#divBwProjectTypeEditor').bwProjectTypeEditor(projectTypeEditorOptions);
                }

                if (developerModeEnabled == true) {
                    var pillarTypeEditorOptions = {};
                    $('#divBwPillarTypeEditor').bwPillarTypeEditor(pillarTypeEditorOptions);
                }

                if (developerModeEnabled == true) {
                    var operationalHoursOptions = {};
                    $('#divBwOperationalHours').bwOperationalHours(operationalHoursOptions);
                }

                $('#divBwAppThemeColorPicker').bwAppThemeColorPicker({});


                //$('#spanDepartmentTitle').text('Procurement');
                $('#spanDepartmentTitle').text('Procurement');




                var configurationBehaviorTipsOptions = {
                    checked: tipsDisplayOn,
                    show_labels: true,         // Should we show the on and off labels?
                    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                    on_label: "ON",            // Text to be displayed when checked
                    off_label: "OFF",          // Text to be displayed when unchecked
                    width: 50,                 // Width of the button in pixels
                    height: 22,                // Height of the button in pixels
                    button_width: 24,         // Width of the sliding part in pixels
                    clear_after: null         // Override the element after which the clearing div should be inserted 
                };
                $("input#configurationBehaviorTipsSlider").switchButton(configurationBehaviorTipsOptions);

                //var configurationBehaviorRequireStartEndDatesOptions = {
                //    checked: requireStartEndDates,
                //    show_labels: true,         // Should we show the on and off labels?
                //    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                //    on_label: "YES",            // Text to be displayed when checked
                //    off_label: "NO",          // Text to be displayed when unchecked
                //    width: 50,                 // Width of the button in pixels
                //    height: 22,                // Height of the button in pixels
                //    button_width: 24,         // Width of the sliding part in pixels
                //    clear_after: null         // Override the element after which the clearing div should be inserted
                //};
                //$("input#configurationBehaviorRequireStartEndDatesSlider").switchButton(configurationBehaviorRequireStartEndDatesOptions);

                //var configurationBehaviorRequireDetailsOptions = {
                //    checked: requireRequestDetails,
                //    show_labels: true,         // Should we show the on and off labels?
                //    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                //    on_label: "YES",            // Text to be displayed when checked
                //    off_label: "NO",          // Text to be displayed when unchecked
                //    width: 50,                 // Width of the button in pixels
                //    height: 22,                // Height of the button in pixels
                //    button_width: 24,         // Width of the sliding part in pixels
                //    clear_after: null         // Override the element after which the clearing div should be inserted 
                //};
                //$("input#configurationBehaviorRequireDetailsSlider").switchButton(configurationBehaviorRequireDetailsOptions);

                //var configurationBehaviorEnableNewRequestAttachmentsOptions = {
                //    checked: enableNewRequestAttachments,
                //    show_labels: true,         // Should we show the on and off labels?
                //    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                //    on_label: "YES",            // Text to be displayed when checked
                //    off_label: "NO",          // Text to be displayed when unchecked
                //    width: 50,                 // Width of the button in pixels
                //    height: 22,                // Height of the button in pixels
                //    button_width: 24,         // Width of the sliding part in pixels
                //    clear_after: null         // Override the element after which the clearing div should be inserted 
                //};
                //$("input#configurationBehaviorEnableNewRequestAttachmentsSlider").switchButton(configurationBehaviorEnableNewRequestAttachmentsOptions);


                //configurationBehaviorEnableNewRequestBarcodeAttachmentsSlider
                //var configurationBehaviorEnableNewRequestBarcodeAttachmentsOptions = {
                //    checked: enableNewRequestBarcodeAttachments,
                //    show_labels: true,         // Should we show the on and off labels?
                //    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                //    on_label: "YES",            // Text to be displayed when checked
                //    off_label: "NO",          // Text to be displayed when unchecked
                //    width: 50,                 // Width of the button in pixels
                //    height: 22,                // Height of the button in pixels
                //    button_width: 24,         // Width of the sliding part in pixels
                //    clear_after: null         // Override the element after which the clearing div should be inserted 
                //};
                //$("input#configurationBehaviorEnableNewRequestBarcodeAttachmentsSlider").switchButton(configurationBehaviorEnableNewRequestBarcodeAttachmentsOptions);



                //debugger; // 12-13-2021 Commented out this try/catch section. I think we don't need it any more.
                try {
                    //var configurationBehaviorEnableBudgetRequestsOptions = {
                    //    checked: bwEnabledRequestTypes.Details.BudgetRequests.Enabled, //quotingEnabled,
                    //    show_labels: true,         // Should we show the on and off labels?
                    //    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                    //    on_label: "YES",            // Text to be displayed when checked
                    //    off_label: "NO",          // Text to be displayed when unchecked
                    //    width: 50,                 // Width of the button in pixels
                    //    height: 22,                // Height of the button in pixels
                    //    button_width: 24,         // Width of the sliding part in pixels
                    //    clear_after: null         // Override the element after which the clearing div should be inserted 
                    //};
                    //$("input#configurationBehaviorEnableBudgetRequestsSlider").switchButton(configurationBehaviorEnableBudgetRequestsOptions);

                    //var configurationBehaviorEnableCapitalPlanProjectsOptions = {
                    //    checked: bwEnabledRequestTypes.Details.CapitalPlanProjects.Enabled, //quotingEnabled,
                    //    show_labels: true,         // Should we show the on and off labels?
                    //    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                    //    on_label: "YES",            // Text to be displayed when checked
                    //    off_label: "NO",          // Text to be displayed when unchecked
                    //    width: 50,                 // Width of the button in pixels
                    //    height: 22,                // Height of the button in pixels
                    //    button_width: 24,         // Width of the sliding part in pixels
                    //    clear_after: null         // Override the element after which the clearing div should be inserted 
                    //};
                    //$("input#configurationBehaviorEnableCapitalPlanProjectsSlider").switchButton(configurationBehaviorEnableCapitalPlanProjectsOptions);

                    //var configurationBehaviorEnableQuotingOptions = {
                    //    checked: bwEnabledRequestTypes.Details.QuoteRequests.Enabled, //quotingEnabled,
                    //    show_labels: true,         // Should we show the on and off labels?
                    //    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                    //    on_label: "YES",            // Text to be displayed when checked
                    //    off_label: "NO",          // Text to be displayed when unchecked
                    //    width: 50,                 // Width of the button in pixels
                    //    height: 22,                // Height of the button in pixels
                    //    button_width: 24,         // Width of the sliding part in pixels
                    //    clear_after: null         // Override the element after which the clearing div should be inserted 
                    //};
                    //$("input#configurationBehaviorEnableQuotingSlider").switchButton(configurationBehaviorEnableQuotingOptions);


                    //var configurationBehaviorEnableReimbursementRequestsOptions = {
                    //    checked: bwEnabledRequestTypes.Details.ReimbursementRequests.Enabled, //reimbursementRequestsEnabled,
                    //    show_labels: true,         // Should we show the on and off labels?
                    //    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                    //    on_label: "YES",            // Text to be displayed when checked
                    //    off_label: "NO",          // Text to be displayed when unchecked
                    //    width: 50,                 // Width of the button in pixels
                    //    height: 22,                // Height of the button in pixels
                    //    button_width: 24,         // Width of the sliding part in pixels
                    //    clear_after: null         // Override the element after which the clearing div should be inserted 
                    //};
                    //$("input#configurationBehaviorEnableReimbursementRequestsSlider").switchButton(configurationBehaviorEnableReimbursementRequestsOptions);

                    //var configurationBehaviorEnableRecurringExpensesOptions = {
                    //    checked: bwEnabledRequestTypes.Details.RecurringExpenses.Enabled, //recurringExpensesEnabled,
                    //    show_labels: true,         // Should we show the on and off labels?
                    //    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                    //    on_label: "YES",            // Text to be displayed when checked
                    //    off_label: "NO",          // Text to be displayed when unchecked
                    //    width: 50,                 // Width of the button in pixels
                    //    height: 22,                // Height of the button in pixels
                    //    button_width: 24,         // Width of the sliding part in pixels
                    //    clear_after: null         // Override the element after which the clearing div should be inserted 
                    //};
                    //$("input#configurationBehaviorEnableRecurringExpensesSlider").switchButton(configurationBehaviorEnableRecurringExpensesOptions);

                    //var configurationBehaviorEnableWorkOrdersOptions = {
                    //    checked: bwEnabledRequestTypes.Details.WorkOrders.Enabled, //recurringExpensesEnabled,
                    //    show_labels: true,         // Should we show the on and off labels?
                    //    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                    //    on_label: "YES",            // Text to be displayed when checked
                    //    off_label: "NO",          // Text to be displayed when unchecked
                    //    width: 50,                 // Width of the button in pixels
                    //    height: 22,                // Height of the button in pixels
                    //    button_width: 24,         // Width of the sliding part in pixels
                    //    clear_after: null         // Override the element after which the clearing div should be inserted 
                    //};
                    //$("input#configurationBehaviorEnableWorkOrdersSlider").switchButton(configurationBehaviorEnableWorkOrdersOptions);
                } catch (e) {
                    console.log('Exception in my.js.renderConfigurationSettings(). This try/catch is to help solve the problem. bwEnabledRequestTypes.Details is undefined... : ' + e.message + ', ' + e.stack);
                }

                var configurationBehaviorEnableCloseOutsOptions = {
                    checked: closeoutsEnabled,
                    show_labels: true,         // Should we show the on and off labels?
                    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                    on_label: "YES",            // Text to be displayed when checked
                    off_label: "NO",          // Text to be displayed when unchecked
                    width: 50,                 // Width of the button in pixels
                    height: 22,                // Height of the button in pixels
                    button_width: 24,         // Width of the sliding part in pixels
                    clear_after: null         // Override the element after which the clearing div should be inserted 
                };
                $("input#configurationBehaviorEnableCloseOutsSlider").switchButton(configurationBehaviorEnableCloseOutsOptions);

                var configurationBehaviorEnableCapitalAndExpenseTrackingOptions = {
                    checked: capitalAndExpenseTrackingEnabled,
                    show_labels: true,         // Should we show the on and off labels?
                    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                    on_label: "YES",            // Text to be displayed when checked
                    off_label: "NO",          // Text to be displayed when unchecked
                    width: 50,                 // Width of the button in pixels
                    height: 22,                // Height of the button in pixels
                    button_width: 24,         // Width of the sliding part in pixels
                    clear_after: null         // Override the element after which the clearing div should be inserted 
                };
                $("input#configurationBehaviorEnableCapitalAndExpenseTrackingSlider").switchButton(configurationBehaviorEnableCapitalAndExpenseTrackingOptions);


                var configurationBehaviorEnableSupplementalsOptions = {
                    checked: supplementalsEnabled,
                    show_labels: true,         // Should we show the on and off labels?
                    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                    on_label: "YES",            // Text to be displayed when checked
                    off_label: "NO",          // Text to be displayed when unchecked
                    width: 50,                 // Width of the button in pixels
                    height: 22,                // Height of the button in pixels
                    button_width: 24,         // Width of the sliding part in pixels
                    clear_after: null         // Override the element after which the clearing div should be inserted 
                };
                $("input#configurationBehaviorEnableSupplementalsSlider").switchButton(configurationBehaviorEnableSupplementalsOptions);

                var configurationBehaviorEnableStrictAuditingOptions = {
                    checked: strictAuditingEnabled,
                    show_labels: true,         // Should we show the on and off labels?
                    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                    on_label: "YES",            // Text to be displayed when checked
                    off_label: "NO",          // Text to be displayed when unchecked
                    width: 50,                 // Width of the button in pixels
                    height: 22,                // Height of the button in pixels
                    button_width: 24,         // Width of the sliding part in pixels
                    clear_after: null         // Override the element after which the clearing div should be inserted 
                };
                $("input#configurationBehaviorEnableStrictAuditingSlider").switchButton(configurationBehaviorEnableStrictAuditingOptions);


                var topLeftLogoEnabled = $('.bwAuthentication').bwAuthentication('option', 'topLeftLogoEnabled');
                var configurationBehaviorEnableTopLeftLogoOptions = {
                    checked: topLeftLogoEnabled,
                    show_labels: true,         // Should we show the on and off labels?
                    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                    on_label: "YES",            // Text to be displayed when checked
                    off_label: "NO",          // Text to be displayed when unchecked
                    width: 50,                 // Width of the button in pixels
                    height: 22,                // Height of the button in pixels
                    button_width: 24,         // Width of the sliding part in pixels
                    clear_after: null         // Override the element after which the clearing div should be inserted 
                };
                $("input#configurationBehaviorEnableTopLeftLogoSlider").switchButton(configurationBehaviorEnableTopLeftLogoOptions);



                var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');
                var configurationBehaviorEnableDeveloperModeOptions = {
                    checked: developerModeEnabled,
                    show_labels: true,         // Should we show the on and off labels?
                    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                    on_label: "YES",            // Text to be displayed when checked
                    off_label: "NO",          // Text to be displayed when unchecked
                    width: 50,                 // Width of the button in pixels
                    height: 22,                // Height of the button in pixels
                    button_width: 24,         // Width of the sliding part in pixels
                    clear_after: null         // Override the element after which the clearing div should be inserted 
                };
                $("input#configurationBehaviorEnableDeveloperModeSlider").switchButton(configurationBehaviorEnableDeveloperModeOptions);


                var largeFileUploadEnabled = $('.bwAuthentication').bwAuthentication('option', 'largeFileUploadEnabled');
                var configurationBehaviorEnableLargeFileUploadOptions = {
                    checked: largeFileUploadEnabled,
                    show_labels: true,         // Should we show the on and off labels?
                    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                    on_label: "YES",            // Text to be displayed when checked
                    off_label: "NO",          // Text to be displayed when unchecked
                    width: 50,                 // Width of the button in pixels
                    height: 22,                // Height of the button in pixels
                    button_width: 24,         // Width of the sliding part in pixels
                    clear_after: null         // Override the element after which the clearing div should be inserted 
                };
                $("input#configurationBehaviorEnableLargeFileUploadSlider").switchButton(configurationBehaviorEnableLargeFileUploadOptions);





                // "Allow multiple logons from the same ip address" section. // configurationBehaviorEnableMultiLogonSlider // configurationBehaviorEnableLargeFileUploadSlider

                // 12-31-2023.
                var configurationBehaviorEnableMultiLogonOptions = {
                    checked: multiLogonEnabled,
                    show_labels: true,         // Should we show the on and off labels?
                    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                    on_label: '<span style="color:green;font-weight:bold;">ON</span>',            // Text to be displayed when checked
                    off_label: '<span style="color:red;font-weight:bold;">OFF</span>',          // Text to be displayed when unchecked
                    width: 50,                 // Width of the button in pixels
                    height: 22,                // Height of the button in pixels
                    button_width: 24,         // Width of the sliding part in pixels
                    clear_after: null         // Override the element after which the clearing div should be inserted 
                };
                $("input#configurationBehaviorEnableMultiLogonSlider").switchButton(configurationBehaviorEnableMultiLogonOptions);



                // 12-31-2023.
                $('#configurationBehaviorEnableMultiLogonSlider').change(function () {

                    $('#divBwAuthentication').bwAuthentication('configurationBehaviorEnableMultiLogonSlider_Onchange');

                });














                document.getElementById('selectBudgetRequestCurrencySymbol').value = selectedCurrencySymbol;

                $('#txtWorkflowAppTitle').val(workflowAppTitle);

                debugger;
                $('#txtWorkflowAppFiscalYear').val(workflowAppFiscalYear); // 1-24-2022
                $('#txtWorkflowAppTitle_GetSharePointData').val(workflowAppTitle);
                $('#txtWorkflowAppTitle_Theme').val(workflowAppTitle);


                $('#txtWorkflowAppExternallyFacingUrlForAttachments').val(externallyFacingUrlForAttachments); // 6-29-2022
                $('#txtWorkflowAppExternallyFacingUrlForAttachmentsSourceFolder').val(externallyFacingUrlForAttachmentsSourceFolder); // 6-29-2022

                // Display the licenses.
                //displayAlertDialog('Display the licenses.');
                if (globalLicenses.length > 0) {
                    var lHtml = '';
                    for (var i = 0; i < globalLicenses.length; i++) {
                        lHtml += '<br /><span style="font-size:x-small;color:gray;">' + globalLicenses[i][2] + '</span>&nbsp;&nbsp;'; // The license key (guid).
                        lHtml += '<span style="font-size:small;font-style:italic;">This ' + globalLicenses[i][1] + ' license is good until ' + globalLicenses[i][4] + '.</span>';
                    }
                    document.getElementById('spanLicenseStatus').innerHTML = lHtml;
                }





                // Hook up the events.

                //selectBudgetRequestCurrencySymbol
                $('#selectBudgetRequestCurrencySymbol').change(function () {
                    // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
                    //displayAlertDialog('This functionality is not complete. Currently there is only the default currency symbol.');


                    // Todd: Finish this!!
                    //document.getElementById('selectBudgetRequestCurrencySymbol').selectedIndex = 0; // This just forces it to always be the top selection for the time being.





                    // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
                    //if (selectedCurrencySymbol == '') selectedCurrencySymbol = 'Dollar';



                    var selectedCurrencySymbol = document.getElementById('selectBudgetRequestCurrencySymbol').value;
                    var data = [];
                    data = {
                        bwTenantId: tenantId,
                        bwWorkflowAppId: workflowAppId,
                        //bwNewBudgetRequestManagerTitle: managerTitle
                        bwSelectedCurrencySymbol: selectedCurrencySymbol
                    };
                    var operationUri = webserviceurl + "/bwworkflowapp/updateworkflowconfigurationselectedcurrencysymbol"; // "/bwworkflowapp/updateworkflowconfigurationnewbudgetrequestmanagertitle";
                    $.ajax({
                        url: operationUri,
                        type: "POST", timeout: ajaxTimeout,
                        data: data,
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        },
                        success: function (data) {
                            if (data != 'SUCCESS') {
                                displayAlertDialog(data);
                            } else {
                                //bwSelectedCurrencySymbol = selectedCurrencySymbol;
                            }
                        },
                        error: function (data, errorCode, errorMessage) {
                            displayAlertDialog('Error in my.js.selectBudgetRequestCurrencySymbol.change(): ' + errorCode + ' ' + errorMessage);
                        }
                    });

                });



                //selectBudgetRequestTitleFormat
                $('#selectBudgetRequestTitleFormat').change(function () {
                    // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
                    displayAlertDialog('This functionality is not complete. Currently there is only the default Title format.');

                    // Todd: Finish this!!
                    document.getElementById('selectBudgetRequestTitleFormat').selectedIndex = 0; // This just forces it to always be the top selection for the time being.
                });



                $('#configurationBehaviorTipsSlider').change(function () {
                    // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
                    if (tipsDisplayOn == true) tipsDisplayOn = false;
                    else tipsDisplayOn = true;
                    var _userDetails = [];
                    _userDetails = {
                        bwParticipantId: participantId,
                        bwTipsDisplayOn: tipsDisplayOn.toString()
                    };
                    var operationUri = webserviceurl + "/bwparticipant/updateuserconfigurationbehaviorTipsDisplay";
                    $.ajax({
                        url: operationUri,
                        type: "POST", timeout: ajaxTimeout,
                        data: _userDetails,
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        },
                        success: function (data) {
                            if (data != 'SUCCESS') {
                                displayAlertDialog(data);
                            } else {
                                // Apply Participant configurations to the display.
                                //debugger;
                                if (tipsDisplayOn == true) {
                                    $('#spanAlertLink').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                                    $('#spanAlertLinkNewRequest').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                                    $('#spanAlertLinkMyStuff').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                                    $('#spanAlertLinkSummary').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                                    $('#spanAlertLinkConfiguration').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                                    $('#spanAlertLinkHelp').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                                } else {
                                    $('#spanAlertLink').html('&nbsp;');
                                    $('#spanAlertLinkNewRequest').html('&nbsp;');
                                    $('#spanAlertLinkMyStuff').html('&nbsp;');
                                    $('#spanAlertLinkSummary').html('&nbsp;');
                                    $('#spanAlertLinkConfiguration').html('&nbsp;');
                                    $('#spanAlertLinkHelp').html('&nbsp;');
                                }
                            }
                        },
                        error: function (data, errorCode, errorMessage) {
                            displayAlertDialog('Error in my.js.configurationBehaviorTipsSlider.change(): ' + errorCode + ' ' + errorMessage);
                        }
                    });
                });

                $('#configurationBehaviorRequireStartEndDatesSlider').change(function () {
                    // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
                    if (requireStartEndDates == true) requireStartEndDates = false;
                    else requireStartEndDates = true;
                    var _workflowDetails = [];
                    _workflowDetails = {
                        bwWorkflowAppId: workflowAppId,
                        bwRequireStartEndDates: requireStartEndDates.toString()
                    };
                    var operationUri = webserviceurl + "/bwworkflow/updateworkflowconfigurationbehaviorrequirestartenddates";
                    $.ajax({
                        url: operationUri,
                        type: "POST", timeout: ajaxTimeout,
                        data: _workflowDetails,
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        },
                        success: function (data) {
                            if (data != 'SUCCESS') {
                                displayAlertDialog(data);
                            } else {
                                // Apply Workflow configurations to the display.
                                //displayAlertDialog('This setting has been changed but the value does not load from the database when the app is loaded. DEV: fix this var=requireStartEndDates, and it needs to load when the worklflow data is loaded.');
                            }
                        },
                        error: function (data, errorCode, errorMessage) {
                            displayAlertDialog('Error in my.js.configurationBehaviorRequireStartEndDatesSlider.change(): ' + errorCode + ' ' + errorMessage);
                        }
                    });
                });

                $('#configurationBehaviorRequireDetailsSlider').change(function () {
                    // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
                    if (requireRequestDetails == true) requireRequestDetails = false;
                    else requireRequestDetails = true;
                    var _workflowDetails = [];
                    _workflowDetails = {
                        bwWorkflowAppId: workflowAppId,
                        bwRequireRequestDetails: requireRequestDetails.toString()
                    };
                    var operationUri = webserviceurl + "/bwworkflow/updateworkflowconfigurationbehaviorrequirerequestdetails";
                    $.ajax({
                        url: operationUri,
                        type: "POST", timeout: ajaxTimeout,
                        data: _workflowDetails,
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        },
                        success: function (data) {
                            if (data != 'SUCCESS') {
                                displayAlertDialog(data);
                            } else {
                                // Apply Workflow configurations to the display.
                                //displayAlertDialog('This setting has been changed but the value does not load from the database when the app is loaded. DEV: fix this var=requireRequestDetails, and it needs to load when the worklflow data is loaded.');
                            }
                        },
                        error: function (data, errorCode, errorMessage) {
                            displayAlertDialog('Error in my.js.configurationBehaviorRequireDetailsSlider.change(): ' + errorCode + ' ' + errorMessage);
                        }
                    });
                });

                $('#configurationBehaviorEnableNewRequestAttachmentsSlider').change(function () {
                    if (enableNewRequestAttachments == true) enableNewRequestAttachments = false;
                    else enableNewRequestAttachments = true;
                    var proceed = true;
                    var turnOffReimbursementRequests = false; // This is our dependency flag.
                    if (reimbursementRequestsEnabled == true && enableNewRequestAttachments == false) {
                        proceed = confirm('Reimbursement Requests will be turned off as well, because attachments are required for this functionality.\n\n\nClick the OK button to proceed...');
                        if (proceed == true) {
                            turnOffReimbursementRequests = true;
                        }
                    }

                    if (proceed == true) {
                        // Check for the dependency flag.
                        if (turnOffReimbursementRequests == true) {
                            //reimbursementRequestsEnabled = false;
                            //displayAlertDialog('reimbursementRequestsEnabled: ' + reimbursementRequestsEnabled);
                            $("input#configurationBehaviorEnableReimbursementRequestsSlider").switchButton({
                                checked: false
                            });
                        }
                        // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
                        var _workflowDetails = [];
                        _workflowDetails = {
                            bwWorkflowAppId: workflowAppId,
                            bwEnableNewRequestAttachments: enableNewRequestAttachments.toString()
                        };
                        var operationUri = webserviceurl + "/bwworkflow/updateworkflowconfigurationbehaviorenablenewrequestattachments";
                        $.ajax({
                            url: operationUri,
                            type: "POST", timeout: ajaxTimeout,
                            data: _workflowDetails,
                            headers: {
                                "Accept": "application/json; odata=verbose"
                            },
                            success: function (data) {
                                if (data != 'SUCCESS') {
                                    displayAlertDialog(data);
                                } else {
                                    //displayAlertDialog('Updated enableNewRequestAttachments in DB: ' + enableNewRequestAttachments);
                                }
                            },
                            error: function (data, errorCode, errorMessage) {
                                displayAlertDialog('Error in my.js.configurationBehaviorEnableNewRequestAttachmentsSlider.change():2: ' + errorCode + ' ' + errorMessage);
                            }
                        });
                    }
                });

                $('#configurationBehaviorEnableNewRequestBarcodeAttachmentsSlider').change(function () {
                    // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
                    if (enableNewRequestBarcodeAttachments == true) enableNewRequestBarcodeAttachments = false;
                    else enableNewRequestBarcodeAttachments = true;
                    var _workflowDetails = [];
                    _workflowDetails = {
                        bwWorkflowAppId: workflowAppId,
                        bwEnableNewRequestBarcodeAttachments: enableNewRequestBarcodeAttachments.toString()
                    };
                    var operationUri = webserviceurl + "/bwworkflow/updateworkflowconfigurationbehaviorenablenewrequestbarcodeattachments";
                    $.ajax({
                        url: operationUri,
                        type: "POST", timeout: ajaxTimeout,
                        data: _workflowDetails,
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        },
                        success: function (data) {
                            if (data != 'SUCCESS') {
                                displayAlertDialog(data);
                            } else {
                                // Apply Workflow configurations to the display.
                                //displayAlertDialog('This setting has been changed but the value does not load from the database when the app is loaded. DEV: fix this var=enableNewRequestAttachments, and it needs to load when the worklflow data is loaded.');
                            }
                        },
                        error: function (data, errorCode, errorMessage) {
                            displayAlertDialog('Error in my.js.configurationBehaviorEnableNewRequestBarcodeAttachmentsSlider.change(): ' + errorCode + ' ' + errorMessage);
                        }
                    });
                });


                $('#configurationBehaviorEnableQuotingSlider').change(function () {
                    // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
                    if (quotingEnabled == true) quotingEnabled = false;
                    else quotingEnabled = true;
                    var _workflowDetails = [];
                    _workflowDetails = {
                        bwWorkflowAppId: workflowAppId,
                        bwQuotingEnabled: quotingEnabled.toString()
                    };
                    var operationUri = webserviceurl + "/bwworkflow/updateworkflowconfigurationbehaviorquotingenabled";
                    $.ajax({
                        url: operationUri,
                        type: "POST", timeout: ajaxTimeout,
                        data: _workflowDetails,
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        },
                        success: function (data) {
                            if (data != 'SUCCESS') {
                                displayAlertDialog(data);
                            } else {
                                // Apply Workflow configurations to the display.
                                //displayAlertDialog('This setting has been changed but the value does not load from the database when the app is loaded. DEV: fix this var=quotingEnabled, and it needs to load when the worklflow data is loaded.');
                            }
                        },
                        error: function (data, errorCode, errorMessage) {
                            displayAlertDialog('Error in my.js.configurationBehaviorEnableQuotingSlider.change(): ' + errorCode + ' ' + errorMessage);
                        }
                    });
                });



                $('#configurationBehaviorEnableReimbursementRequestsSlider').change(function () {
                    if (reimbursementRequestsEnabled == true) reimbursementRequestsEnabled = false;
                    else reimbursementRequestsEnabled = true;
                    var proceed = true;
                    var turnOnAttachments = false; // This is our dependency flag.
                    if (enableNewRequestAttachments == false && reimbursementRequestsEnabled == true) {
                        proceed = confirm('Attachments will be enabled because they are needed by the Reimbursement Request process.\n\n\nClick the OK button to proceed...');
                        if (proceed == true) {
                            turnOnAttachments = true;
                        }
                    }

                    if (proceed == true) {
                        // Check for the dependency flag.
                        if (turnOnAttachments == true) {
                            //enableNewRequestAttachments = true;
                            //displayAlertDialog('enableNewRequestAttachments: ' + enableNewRequestAttachments);
                            $("input#configurationBehaviorEnableNewRequestAttachmentsSlider").switchButton({
                                checked: true
                            });
                        }
                        // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
                        var _workflowDetails = [];
                        _workflowDetails = {
                            bwWorkflowAppId: workflowAppId,
                            bwExpenseRequestsEnabled: reimbursementRequestsEnabled.toString()
                        };
                        var operationUri = webserviceurl + "/bwworkflow/updateworkflowconfigurationbehaviorexpenserequestsenabled";
                        $.ajax({
                            url: operationUri,
                            type: "POST", timeout: ajaxTimeout,
                            data: _workflowDetails,
                            headers: {
                                "Accept": "application/json; odata=verbose"
                            },
                            success: function (data) {
                                if (data != 'SUCCESS') {
                                    displayAlertDialog(data);
                                } else {
                                    //displayAlertDialog('Updated reimbursementRequestsEnabled in DB: ' + reimbursementRequestsEnabled);
                                }
                            },
                            error: function (data, errorCode, errorMessage) {
                                displayAlertDialog('Error in my.js.configurationBehaviorEnableReimbursementRequestsSlider.change():2: ' + errorCode + ' ' + errorMessage);
                            }
                        });
                    }
                });


                // configurationBehaviorEnableCloseOutsSlider
                $('#configurationBehaviorEnableCloseOutsSlider').change(function () {
                    // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
                    if (closeoutsEnabled == true) closeoutsEnabled = false;
                    else closeoutsEnabled = true;
                    var _workflowDetails = [];
                    _workflowDetails = {
                        bwWorkflowAppId: workflowAppId,
                        bwCloseoutsEnabled: closeoutsEnabled.toString()
                    };
                    var operationUri = webserviceurl + "/bwworkflow/updateworkflowconfigurationbehaviorcloseoutsenabled";
                    $.ajax({
                        url: operationUri,
                        type: "POST", timeout: ajaxTimeout,
                        data: _workflowDetails,
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        },
                        success: function (data) {
                            if (data != 'SUCCESS') {
                                displayAlertDialog(data);
                            } else {
                                // Apply Workflow configurations to the display.
                                //displayAlertDialog('This setting has been changed but the value does not load from the database when the app is loaded. DEV: fix this var=quotingEnabled, and it needs to load when the worklflow data is loaded.');
                                //displayAlertDialog('This functionality is incomplete. Coming soon! my.js.configurationBehaviorEnableCloseOutsSlider.change().');
                            }
                        },
                        error: function (data, errorCode, errorMessage) {
                            displayAlertDialog('Error in my.js.configurationBehaviorEnableCloseOutsSlider.change(): ' + errorCode + ' ' + errorMessage);
                        }
                    });
                });

                $('#configurationBehaviorEnableCapitalAndExpenseTrackingSlider').change(function () {
                    // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
                    if (capitalAndExpenseTrackingEnabled == true) capitalAndExpenseTrackingEnabled = false;
                    else capitalAndExpenseTrackingEnabled = true;
                    var _workflowDetails = [];
                    _workflowDetails = {
                        bwWorkflowAppId: workflowAppId,
                        bwCapitalAndExpenseTrackingEnabled: capitalAndExpenseTrackingEnabled.toString()
                    };
                    var operationUri = webserviceurl + "/bwworkflow/updateworkflowconfigurationbehaviorcapitalandexpensetrackingenabled";
                    $.ajax({
                        url: operationUri,
                        type: "POST", timeout: ajaxTimeout,
                        data: _workflowDetails,
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        },
                        success: function (data) {
                            if (data != 'SUCCESS') {
                                displayAlertDialog(data);
                            } else {
                                // Apply Workflow configurations to the display.
                                //displayAlertDialog('This functionality is incomplete. Coming soon! my.js.configurationBehaviorEnableCapitalAndExpenseTrackingSlider.change().');
                                //displayAlertDialog('capitalAndExpenseTrackingEnabled: ' + capitalAndExpenseTrackingEnabled);
                            }
                        },
                        error: function (data, errorCode, errorMessage) {
                            displayAlertDialog('Error in my.js.configurationBehaviorEnableCapitalAndExpenseTrackingSlider.change(): ' + errorCode + ' ' + errorMessage);
                        }
                    });
                });

                $('#configurationBehaviorEnableRecurringExpensesSlider').change(function () {
                    // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
                    if (recurringExpensesEnabled == true) recurringExpensesEnabled = false;
                    else recurringExpensesEnabled = true;
                    var _workflowDetails = [];
                    _workflowDetails = {
                        bwWorkflowAppId: workflowAppId,
                        bwRecurringExpensesEnabled: recurringExpensesEnabled.toString()
                    };
                    var operationUri = webserviceurl + "/bwworkflow/updateworkflowconfigurationbehaviorrecurringexpensesenabled";
                    $.ajax({
                        url: operationUri,
                        type: "POST", timeout: ajaxTimeout,
                        data: _workflowDetails,
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        },
                        success: function (data) {
                            try {
                                if (data != 'SUCCESS') {
                                    displayAlertDialog(data);
                                } else {
                                    // Apply Workflow configurations to the display.
                                    //displayAlertDialog('This functionality is incomplete. Coming soon! my.js.configurationBehaviorEnableRecurringExpensesSlider.change().');
                                    if (recurringExpensesEnabled) {
                                        var html = '<input type="radio" name="rbRecurringExpensesChoice" /><span>recurring on fixed dates</span>';
                                        document.getElementById('spanRecurringExpensesChoiceOnFixedDates').innerHTML = html;
                                        var html = '<input type="radio" name="rbRecurringExpensesChoice" /><span>recurring on a time period</span>';
                                        document.getElementById('spanRecurringExpensesChoiceOnATimePeriod').innerHTML = html;
                                    } else {
                                        var html = '<input type="radio" name="rbRecurringExpensesChoice" disabled /><span style="color: #adadad;">recurring on fixed dates</span>';
                                        document.getElementById('spanRecurringExpensesChoiceOnFixedDates').innerHTML = html;
                                        var html = '<input type="radio" name="rbRecurringExpensesChoice" disabled /><span style="color: #adadad;">recurring on a time period</span>';
                                        document.getElementById('spanRecurringExpensesChoiceOnATimePeriod').innerHTML = html;
                                    }

                                }
                            } catch (e) {
                                console.log('Exception in my.js.configurationBehaviorEnableRecurringExpensesSlider.change(): ' + e.message + ', ' + e.stack);
                            }
                        },
                        error: function (data, errorCode, errorMessage) {
                            displayAlertDialog('Error in my.js.configurationBehaviorEnableRecurringExpensesSlider.change(): ' + errorCode + ' ' + errorMessage);
                        }
                    });
                });

                // configurationBehaviorEnableSupplementalsSlider
                $('#configurationBehaviorEnableSupplementalsSlider').change(function () {
                    // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
                    if (supplementalsEnabled == true) supplementalsEnabled = false;
                    else supplementalsEnabled = true;
                    var _workflowDetails = [];
                    _workflowDetails = {
                        bwWorkflowAppId: workflowAppId,
                        bwSupplementalsEnabled: supplementalsEnabled.toString()
                    };
                    var operationUri = webserviceurl + "/bwworkflow/updateworkflowconfigurationbehaviorsupplementalsenabled";
                    $.ajax({
                        url: operationUri,
                        type: "POST", timeout: ajaxTimeout,
                        data: _workflowDetails,
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        },
                        success: function (data) {
                            if (data != 'SUCCESS') {
                                displayAlertDialog(data);
                            } else {
                                // Apply Workflow configurations to the display.
                                //displayAlertDialog('This functionality is incomplete. Coming soon! my.js.configurationBehaviorEnableSupplementalsSlider.change().');
                                //displayAlertDialog('This setting has been changed but the value does not load from the database when the app is loaded. DEV: fix this var=quotingEnabled, and it needs to load when the worklflow data is loaded.');
                            }
                        },
                        error: function (data, errorCode, errorMessage) {
                            displayAlertDialog('Error in my.js.configurationBehaviorEnableSupplementalsSlider.change(): ' + errorCode + ' ' + errorMessage);
                        }
                    });
                });

                // configurationBehaviorEnableStrictAuditingSlider
                $('#configurationBehaviorEnableStrictAuditingSlider').change(function () {
                    // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
                    if (strictAuditingEnabled == true) strictAuditingEnabled = false;
                    else strictAuditingEnabled = true;
                    var _workflowDetails = [];
                    _workflowDetails = {
                        bwWorkflowAppId: workflowAppId,
                        bwStrictAuditingEnabled: strictAuditingEnabled.toString()
                    };
                    var operationUri = webserviceurl + "/bwworkflow/updateworkflowconfigurationbehaviorstrictauditingenabled";
                    $.ajax({
                        url: operationUri,
                        type: "POST", timeout: ajaxTimeout,
                        data: _workflowDetails,
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        },
                        success: function (data) {
                            if (data != 'SUCCESS') {
                                displayAlertDialog(data);
                            } else {
                                // Apply Workflow configurations to the display.
                                displayAlertDialog('This functionality is incomplete. Coming soon! my.js.configurationBehaviorEnableStrictAuditingSlider.change().');
                                //displayAlertDialog('This setting has been changed but the value does not load from the database when the app is loaded. DEV: fix this var=quotingEnabled, and it needs to load when the worklflow data is loaded.');
                            }
                        },
                        error: function (data, errorCode, errorMessage) {
                            displayAlertDialog('Error in my.js.configurationBehaviorEnableStrictAuditingSlider.change(): ' + errorCode + ' ' + errorMessage);
                        }
                    });
                });

                $('#configurationBehaviorEnableTopLeftLogoSlider').change(function () {
                    try {
                        console.log('In bwActiveMenu.js.configurationBehaviorEnableTopLeftLogoSlider.change().');

                        // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
                        //var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');
                        var topLeftLogoEnabled = $('.bwAuthentication').bwAuthentication('option', 'topLeftLogoEnabled');

                        if (topLeftLogoEnabled == true) topLeftLogoEnabled = false;
                        else topLeftLogoEnabled = true;

                        var _workflowDetails = [];
                        _workflowDetails = {
                            bwWorkflowAppId: workflowAppId,
                            bwTopLeftLogoEnabled: topLeftLogoEnabled.toString()
                        };
                        //var operationUri = webserviceurl + "/bwworkflow/updateworkflowconfigurationbehaviordevelopermodeenabled"; 
                        var operationUri = webserviceurl + "/bwworkflow/updateworkflowconfigurationbehaviortopleftlogoenabled";
                        $.ajax({
                            url: operationUri,
                            type: "POST",
                            data: _workflowDetails,
                            headers: {
                                "Accept": "application/json; odata=verbose"
                            },
                            success: function (data) {
                                try {

                                    if (data.status != 'SUCCESS') {

                                        displayAlertDialog('In bwActiveMenu.js.configurationBehaviorEnableTopLeftLogoSlider.change(): ' + data.status + ', ' + data.message);

                                    } else {

                                        //$('.bwAuthentication').bwAuthentication({ developerModeEnabled: developerModeEnabled });

                                        // Apply Workflow configurations to the display.
                                        //displayAlertDialog('This functionality is incomplete. Coming soon! my.js.configurationBehaviorEnableTopLeftLogoSlider.change().');
                                        console.log('The Top Left Logo setting has been changed.'); // You will have to reload/refresh the web browser, and log in again for it to take effect.');

                                        $('.bwAuthentication').bwAuthentication('option', 'topLeftLogoEnabled', topLeftLogoEnabled);

                                        if (topLeftLogoEnabled == true) {
                                            document.getElementById('orgImage_root_blueheaderbar').style.display = 'inline'; // This displays the top-left org circle.
                                        } else {
                                            console.log('The value for topLeftLogoEnabled is false, so not displaying the top left org circle/logo.');
                                            document.getElementById('orgImage_root_blueheaderbar').style.display = 'none'; // This hides the top-left org circle.
                                        }


                                    }

                                } catch (e) {
                                    var msg = 'Exception in bwActiveMenu.js.configurationBehaviorEnableTopLeftLogoSlider.change():2: ' + e.message + ', ' + e.stack;
                                    console.log(msg);
                                    displayAlertDialog(msg);
                                }

                            },
                            error: function (data, errorCode, errorMessage) {
                                var msg = 'Error in bwActiveMenu.js.configurationBehaviorEnableTopLeftLogoSlider.change(): ' + errorCode + ' ' + errorMessage;
                                console.log(msg);
                                displayAlertDialog(msg);
                            }

                        });

                    } catch (e) {
                        var msg = 'Exception in bwActiveMenu.js.configurationBehaviorEnableTopLeftLogoSlider.change(): ' + e.message + ', ' + e.stack;
                        console.log(msg);
                        displayAlertDialog(msg);
                    }

                });

                $('#configurationBehaviorEnableDeveloperModeSlider').change(function () {
                    debugger;
                    // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
                    var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');

                    if (developerModeEnabled == true) developerModeEnabled = false;
                    else developerModeEnabled = true;

                    var _workflowDetails = [];
                    _workflowDetails = {
                        bwWorkflowAppId: workflowAppId,
                        bwDeveloperModeEnabled: developerModeEnabled.toString() // bwStrictAuditingEnabled
                    };
                    var operationUri = webserviceurl + "/bwworkflow/updateworkflowconfigurationbehaviordevelopermodeenabled"; // updateworkflowconfigurationbehaviorstrictauditingenabled
                    $.ajax({
                        url: operationUri,
                        type: "POST",
                        data: _workflowDetails,
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        },
                        success: function (data) {
                            if (data != 'SUCCESS') {
                                displayAlertDialog(data);
                            } else {

                                //$('.bwAuthentication').bwAuthentication({ developerModeEnabled: developerModeEnabled });

                                // Apply Workflow configurations to the display.
                                //displayAlertDialog('This functionality is incomplete. Coming soon! my.js.configurationBehaviorEnableDeveloperModeSlider.change().');
                                displayAlertDialog('The Developer Mode setting has been changed. You will have to reload/refresh the web browser, and log in again for it to take effect.');
                            }
                        },
                        error: function (data, errorCode, errorMessage) {
                            displayAlertDialog('Error in my.js.configurationBehaviorEnableDeveloperModeSlider.change(): ' + errorCode + ' ' + errorMessage);
                        }
                    });
                });

                $('#configurationBehaviorEnableLargeFileUploadSlider').change(function () {
                    debugger;
                    // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
                    // if (userData.participant.participantWorkflowApps[wa].bwLargeFileUploadEnabled == 'true') {
                    //thiz.options.largeFileUploadEnabled = true;
                    var largeFileUploadEnabled = $('.bwAuthentication').bwAuthentication('option', 'largeFileUploadEnabled');

                    if (largeFileUploadEnabled == true) largeFileUploadEnabled = false;
                    else largeFileUploadEnabled = true;

                    var _workflowDetails = [];
                    _workflowDetails = {
                        bwWorkflowAppId: workflowAppId,
                        bwLargeFileUploadEnabled: largeFileUploadEnabled.toString() // bwStrictAuditingEnabled
                    };
                    var operationUri = webserviceurl + "/bwworkflow/updateworkflowconfigurationbehaviorlargefileuploadenabled"; // updateworkflowconfigurationbehaviorstrictauditingenabled
                    $.ajax({
                        url: operationUri,
                        type: "POST",
                        data: _workflowDetails,
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        },
                        success: function (data) {
                            if (data != 'SUCCESS') {
                                displayAlertDialog(data);
                            } else {

                                //$('.bwAuthentication').bwAuthentication({ developerModeEnabled: developerModeEnabled });

                                // Apply Workflow configurations to the display.
                                //displayAlertDialog('This functionality is incomplete. Coming soon! my.js.configurationBehaviorEnableDeveloperModeSlider.change().');
                                displayAlertDialog('The Large File Upload setting has been changed.');
                            }
                        },
                        error: function (data, errorCode, errorMessage) {
                            displayAlertDialog('Error in my.js.configurationBehaviorEnableLargeFileUploadSlider.change(): ' + errorCode + ' ' + errorMessage);
                        }
                    });
                });

                //$('#configurationBehaviorTurnOffEmailSlider').change(function () {
                //    // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
                //    console.log('In configurationBehaviorTurnOffEmailSlider.change(). emailEnabled: ' + emailEnabled);
                //    if (emailEnabled == true) emailEnabled = false;
                //    else emailEnabled = true;
                //    var _workflowDetails = [];
                //    _workflowDetails = {
                //        bwWorkflowAppId: workflowAppId,
                //        bwEmailEnabled: emailEnabled.toString()
                //    };
                //    var operationUri = webserviceurl + "/bwworkflow/updateworkflowconfigurationbehavioremailenabled";
                //    $.ajax({
                //        url: operationUri,
                //        type: "POST", timeout: ajaxTimeout,
                //        data: _workflowDetails,
                //        headers: {
                //            "Accept": "application/json; odata=verbose"
                //        },
                //        success: function (data) {
                //            console.log('In configurationBehaviorTurnOffEmailSlider.change(). ' + data);
                //            if (data != 'SUCCESS') {
                //                displayAlertDialog(data);
                //            } else {
                //                console.log('In configurationBehaviorTurnOffEmailSlider.change(). Set emailEnabled to: ' + emailEnabled);
                //                if (emailEnabled == true) {
                //                    var html = '';
                //                    html += '<span style="font-size:small;font-style:italic;">';
                //                    html += 'Turning off email may be desired if the ADMIN is processing requests, or experimenting with the system. The ADMIN will continue to receive email notifications.';
                //                    html += '</span>';
                //                    document.getElementById('configurationBehaviorTurnOffEmailSlider_Description').innerHTML = html;
                //                    //
                //                    var html = '';
                //                    //html += '<span style="color:green;">';
                //                    //html += 'xx emails have been sent so far today.';

                //                    html += '                   &nbsp;&nbsp;';
                //                    html += '                   <input type="button" value="View all emails..." onclick="cmdViewAllEmails();" style="cursor:pointer;padding:5px 10px 5px 10px;" />';

                //                    //html += '</span>';
                //                    document.getElementById('configurationBehaviorTurnOffEmailSlider_CurrentStatus').innerHTML = html;
                //                } else {
                //                    var html = '';
                //                    html += '<span style="color:red;font-size:small;font-style:italic;">';
                //                    html += 'Turning off email may be desired if the ADMIN is processing requests, or experimenting with the system. The ADMIN will continue to receive email notifications.';
                //                    html += '</span>';
                //                    document.getElementById('configurationBehaviorTurnOffEmailSlider_Description').innerHTML = html;
                //                    //
                //                    var html = '';
                //                    //html += '<span style="color:red;">';
                //                    //html += 'There are xx unsent emails.';

                //                    html += '                   &nbsp;&nbsp;';
                //                    html += '                   <input type="button" value="View unsent emails..." onclick="cmdViewUnsentEmails();" style="cursor:pointer;padding:5px 10px 5px 10px;" />';
                //                    html += '                   &nbsp;&nbsp;';
                //                    html += '                   <input type="button" value="View all emails..." onclick="cmdViewAllEmails();" style="cursor:pointer;padding:5px 10px 5px 10px;" />';

                //                    //html += '</span>';
                //                    document.getElementById('configurationBehaviorTurnOffEmailSlider_CurrentStatus').innerHTML = html;
                //                }
                //            }
                //        },
                //        error: function (data, errorCode, errorMessage) {
                //            displayAlertDialog('Error in my.js.configurationBehaviorTurnOffEmailSlider.change(): ' + errorCode + ' ' + errorMessage);
                //        }
                //    });
                //});

                // Hook up the people picker
                $("#txtBwDepartmentUserName").autocomplete({
                    source: function (request, response) {
                        //weburl = _spPageContextInfo.siteAbsoluteUrl;
                        $.ajax({
                            url: webserviceurl + "/tenant/" + tenantId + "/participants/" + request.term,
                            dataType: "json",
                            success: function (data) {
                                var searchArray = [];
                                for (var i = 0; i < data.participants.length; i++) {
                                    searchArray[i] = data.participants[i].participant;
                                }
                                response(searchArray);
                            }
                        });
                    },
                    minLength: 1, // minLength specifies how many characters have to be typed before this gets invoked.
                    select: function (event, ui) {
                        //log(ui.item ? "Selected: " + ui.item.label : "Nothing selected, input was " + this.value);
                        //document.getElementById('btnSearch').disabled = false; // Enable the search button when there is valid content in it.
                    },
                    open: function () {
                        //$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
                        //document.getElementById('btnSearch').disabled = true; // Disable the search button until there is valid content in it.
                    },
                    close: function () {
                        //$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                        //var searchValue = this.value.split(' ')[0] + ' ' + this.value.split(' ')[1];
                        //if (searchValue.indexOf('undefined') > -1) document.getElementById('txtAccountingDepartmentUser').value = '';
                        //else document.getElementById('txtAccountingDepartmentUser').value = searchValue; //this.value.split(' ')[0] + ' ' + this.value.split(' ')[1]; // Just shows the Loan Number parameter (removing the borrower name) so it fits in the text box.


                        var userName = this.value.split('|')[0];
                        var userId = this.value.split('|')[1];

                        if (userName.indexOf('undefined') > -1) {
                            //document.getElementById('txtAccountingDepartmentUser').value = '';
                            document.getElementById('txtBwDepartmentUserName').value = '';
                            document.getElementById('txtBwDepartmentUserId').value = '';
                        } else {
                            document.getElementById('txtBwDepartmentUserName').value = userName; //this.value.split(' ')[0] + ' ' + this.value.split(' ')[1]; // Just shows the Loan Number parameter (removing the borrower name) so it fits in the text box.
                            document.getElementById('txtBwDepartmentUserId').value = userId;
                            // Enable the button!
                            document.getElementById('btnSaveRemoveAccountingDepartmentUser').disabled = false;
                        }
                    }
                });



                var data = {
                    bwWorkflowAppId: workflowAppId
                };
                $.ajax({
                    url: webserviceurl + "/bwdepartments",
                    type: "DELETE",
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    success: function (data) {
                        //displayAlertDialog(JSON.stringify(data));
                        if (data.length > 0) {
                            for (var i = 0; i < data.length; i++) {
                                if (data[i].bwDepartmentTitle == 'Procurement') {
                                    $('#txtBwDepartmentUserName').val(data[i].bwDepartmentUserName);
                                    $('#txtBwDepartmentUserId').val(data[i].bwDepartmentUserId);
                                    // Create the button.
                                    var html = '';
                                    html += '<input style="padding:5px 10px 5px 10px;" id="btnSaveRemoveAccountingDepartmentUser" type="button" value="Remove" onclick="cmdRemoveAccountingDepartmentUser();" />';
                                    document.getElementById('spanSaveAccountingDepartmentUserButton').innerHTML = html;
                                }
                            }
                        } else {
                            //
                            var html = '';
                            html += '<input style="padding:5px 10px 5px 10px;" id="btnSaveRemoveAccountingDepartmentUser" type="button" value="Save" onclick="cmdSaveAccountingDepartmentUser();" disabled />';
                            if (document.getElementById('spanSaveAccountingDepartmentUserButton')) document.getElementById('spanSaveAccountingDepartmentUserButton').innerHTML = html;
                        }

                    },
                    error: function (data, errorCode, errorMessage) {
                        displayAlertDialog('Error in my.js.renderConfigurationSettings DELETE /bwdepartments:' + errorCode + ', ' + errorMessage);
                    }
                });

                var result = {
                    status: 'SUCCESS',
                    message: 'SUCCESS'
                }
                resolve(result);

            } catch (e) {

                var msg = 'Exception in bwActiveMenu.js.renderConfigurationSettings(): ' + e.message + ', ' + e.stack;
                var result = {
                    status: 'EXCEPTION',
                    message: msg
                }
                reject(result);

            }
        });
    },
    renderConfigurationPersonalBehavior: function (buttonElement) {
        var thiz = this;
        return new Promise(function (resolve, reject) {
            try {
                console.log('In bwActiveMenu.js.renderConfigurationPersonalBehavior().');

                $('#bwQuickLaunchMenuTd').css({
                    width: '0'
                }); // This gets rid of the jumping around.

                try {
                    $('#FormsEditorToolbox').dialog('close');
                } catch (e) { }

                var canvas = document.getElementById("myCanvas");
                if (canvas) {
                    var ctx = canvas.getContext("2d");
                    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines
                    canvas.style.zIndex = -1;
                }

                var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
                var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');

                if (newBudgetRequestManagerTitle == '') newBudgetRequestManagerTitle = 'Manager';

                $('#divPageContent3').empty();

                var html = '';

                html += '<table>';
                html += '   <tr><td colspan="2">&nbsp;</td></tr>';

                if (developerModeEnabled == true) {

                    // Sending email.
                    html += '  <tr>';
                    html += '    <td style="text-align:left;vertical-align:middle;white-space:nowrap;vertical-align:top;" class="bwSliderTitleCell">';
                    html += '       Sending email (when turned on, the system will send emails to "' + participantEmail + '"):&nbsp;';
                    html += '    </td>';
                    html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';

                    html += '       <table>';
                    html += '           <tr>';
                    html += '               <td>';
                    html += '                   <label for="configurationBehaviorTurnOffEmailSlider"></label><input type="checkbox" name="configurationBehaviorTurnOffEmailSlider" id="configurationBehaviorTurnOffEmailSlider" />';
                    html += '               </td>';
                    html += '               <td>';
                    html += '                   &nbsp;&nbsp;';
                    html += '               </td>';
                    html += '               <td>';
                    html += '                   <span id="configurationBehaviorTurnOffEmailSlider_CurrentStatus"></span>';
                    html += '               </td>';
                    html += '               <td>';
                    html += '               </td>';
                    html += '               <td>';
                    html += '                   <span id="configurationBehaviorTurnOffEmailSlider_Description" style="font-size:normal;">[configurationBehaviorTurnOffEmailSlider_Description]</span>';
                    html += '               </td>';
                    html += '           </tr>';
                    html += '       </table>';
                    //html += '       <br />';


                    html += '    </td>';
                    html += '  </tr>';

                    html += '  <tr>';
                    html += '    <td colspan="2">&nbsp;</td>';
                    html += '  </tr>';

                }

                html += '  <tr>';
                html += '    <td colspan="2">';

                html += '   </td>';
                html += '  </tr>';

                html += '   <tr><td colspan="2">&nbsp;</td></tr>';






                html += '  <tr>';
                html += '    <td colspan="2">';

                html += '<table>';

                // "UNDO DONT SHOW ME THIS AGAIN CONFIRMATIONS" section.
                html += '<tr>';
                html += '    <td colspan="2">';
                html += '       <span style="font-size:small;font-style:italic;">You have chosen to not show some things again. Here is where you can turn them on so that you see them again.</span>';
                html += '    </td>';
                html += '</tr>';
                html += '<tr>';
                html += '   <td style="text-align:left;" class="bwSliderTitleCell">';
                html += '       Show me this again: "xcx123123"';
                html += '   </td>';
                html += '   <td class="bwChartCalculatorLightCurrencyTableCell">';
                html += '       <label for="configurationBehaviorEnableThumbnailLoadingSliderxx"></label><input type="checkbox" name="configurationBehaviorEnableThumbnailLoadingSliderxx" id="configurationBehaviorEnableThumbnailLoadingSliderxx" />';
                html += '   </td>';
                html += '</tr>';

                html += '   <tr><td colspan="2">&nbsp;</td></tr>';


                // "Enable thumbnail loading in executive summaries" section.
                html += '<tr>';
                html += '    <td colspan="2">';
                html += '       <span style="font-size:small;font-style:italic;">Disabling thumbnail loading may help out on a limited network connection.</span>';
                html += '    </td>';
                html += '</tr>';
                html += '<tr>';
                html += '   <td style="text-align:left;" class="bwSliderTitleCell">';
                html += '       Enable thumbnail loading in executive summaries:';
                html += '   </td>';
                html += '   <td class="bwChartCalculatorLightCurrencyTableCell">';
                html += '       <label for="configurationBehaviorEnableThumbnailLoadingSlider"></label><input type="checkbox" name="configurationBehaviorEnableThumbnailLoadingSlider" id="configurationBehaviorEnableThumbnailLoadingSlider" />';
                html += '   </td>';
                html += '</tr>';

                html += '   <tr><td colspan="2">&nbsp;</td></tr>';

                //// "Allow multiple logons from the same ip address" section.
                //html += '<tr>';
                //html += '    <td colspan="2">';
                //html += '       <span style="font-size:small;font-style:italic;">Turn this on if you are using multiple devices or browser windows at one time. [dev note: bright activemenu when active, greyed out when not used for some time.]</span>';
                //html += '    </td>';
                //html += '</tr>';
                //html += '<tr>';
                //html += '   <td style="text-align:left;" class="bwSliderTitleCell">';
                //html += '       Allow multiple logons from the same ip address:';
                //html += '   </td>';
                //html += '   <td class="bwChartCalculatorLightCurrencyTableCell">';
                //html += '       <label for="configurationBehaviorEnableMultiLogonSlider"></label><input type="checkbox" name="configurationBehaviorEnableMultiLogonSlider" id="configurationBehaviorEnableMultiLogonSlider" />';
                //html += '   </td>';
                //html += '</tr>';

                //html += '   <tr><td colspan="2">&nbsp;</td></tr>';

                // "Request push notifications from this browser" section.
                html += '<tr>';
                html += '    <td colspan="2">';
                html += '       <span style="font-size:small;font-style:italic;">Turn this on if you want push notifications from this web browser. This means you will get notifications when you get a new email or task notification.</span>';
                html += '    </td>';
                html += '</tr>';
                html += '<tr>';
                html += '   <td style="text-align:left;" class="bwSliderTitleCell">';
                html += '       Request push notifications from this browser:';
                html += '   </td>';
                html += '   <td class="bwChartCalculatorLightCurrencyTableCell">';
                html += '       <label for="configurationBehaviorToggleBrowserPushNotificationsSlider"></label><input type="checkbox" name="configurationBehaviorToggleBrowserPushNotificationsSlider" id="configurationBehaviorToggleBrowserPushNotificationsSlider" />';
                html += '   </td>';
                html += '</tr>';

                html += '   <tr><td colspan="2">&nbsp;</td></tr>';


                html += '   <tr>';
                html += '       <td colspan="2" class="bwChartCalculatorLightCurrencyTableCell">';

                html += '       </td>';
                html += '   </tr>';


                html += '   <tr><td colspan="2">&nbsp;</td></tr>';

                html += '   <tr><td colspan="2">';

                html += '<table>';

                //if (developerModeEnabled == true) {
                // "Send me email" immediately section.
                html += '  <tr>';
                //html += '    <td style="text-align:left;" class="bwSliderTitleCell">Send me email:</td>';
                html += '    <td style="text-align:left;" class="bwSliderTitleCell">Communicate with me:</td>';
                html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                html += '      <input type="radio" style="cursor:pointer;" id="rbMyEmailNotificationImmediately" name="rbgMyEmailNotificationFrequency" onclick="cmdRbgMyEmailNotificationFrequency_click(\'immediately\');" />&nbsp;<span id="spanRbEmailImmediately" style="color:gray;">Immediately</span>';
                if (developerModeEnabled == true) {
                    html += '<div id="divBwPersonalOperationalHours"></div>';
                }
                html += '    </td>';
                html += '  </tr>';
                //}

                //if (developerModeEnabled == true) {
                // "Send me email" aggregate twice daily section.
                html += '<tr><td></td><td class="bwChartCalculatorLightCurrencyTableCell"><input type="radio" style="cursor:pointer;" id="rbMyEmailNotificationAggregated" name="rbgMyEmailNotificationFrequency" onclick="cmdRbgMyEmailNotificationFrequency_click(\'aggregatetwicedaily\');" />&nbsp;';
                html += '<span id="spanRbAggregateEmailTwiceDaily" style="color:gray;">Aggregate into an email sent twice daily at<br />';
                html += '<span style="float:right;">';
                html += '<select style="padding:5px 5px 5px 5px;" id="selectAggregateEmailTwiceDailyFirstTime" onchange="cmdRbgMyEmailNotificationFrequency_click(\'aggregatetwicedaily\');" disabled>';
                html += '<option value="1">1AM</option>';
                html += '<option value="2">2AM</option>';
                html += '<option value="3">3AM</option>';
                html += '<option value="4">4AM</option>';
                html += '<option value="5">5AM</option>';
                html += '<option value="6">6AM</option>';
                html += '<option value="7">7AM</option>';
                html += '<option value="8">8AM</option>';
                html += '<option value="9" selected>9AM</option>';
                html += '<option value="10">10AM</option>';
                html += '<option value="11">11AM</option>';
                html += '<option value="12">12PM</option>';
                html += '<option value="13">1PM</option>';
                html += '<option value="14">2PM</option>';
                html += '<option value="15">3PM</option>';
                html += '<option value="16">4PM</option>';
                html += '<option value="17">5PM</option>';
                html += '<option value="18">6PM</option>';
                html += '<option value="19">7PM</option>';
                html += '<option value="20">8PM</option>';
                html += '<option value="21">9PM</option>';
                html += '<option value="22">10PM</option>';
                html += '<option value="23">11PM</option>';
                html += '<option value="24">12AM</option>';
                html += '</select>';
                html += ' and ';
                html += '<select style="padding:5px 5px 5px 5px;" id="selectAggregateEmailTwiceDailySecondTime" onchange="cmdRbgMyEmailNotificationFrequency_click(\'aggregatetwicedaily\');" disabled>';
                html += '<option value="1">1AM</option>';
                html += '<option value="2">2AM</option>';
                html += '<option value="3">3AM</option>';
                html += '<option value="4">4AM</option>';
                html += '<option value="5">5AM</option>';
                html += '<option value="6">6AM</option>';
                html += '<option value="7">7AM</option>';
                html += '<option value="8">8AM</option>';
                html += '<option value="9">9AM</option>';
                html += '<option value="10">10AM</option>';
                html += '<option value="11">11AM</option>';
                html += '<option value="12">12PM</option>';
                html += '<option value="13">1PM</option>';
                html += '<option value="14">2PM</option>';
                html += '<option value="15">3PM</option>';
                html += '<option value="16" selected>4PM</option>';
                html += '<option value="17">5PM</option>';
                html += '<option value="18">6PM</option>';
                html += '<option value="19">7PM</option>';
                html += '<option value="20">8PM</option>';
                html += '<option value="21">9PM</option>';
                html += '<option value="22">10PM</option>';
                html += '<option value="23">11PM</option>';
                html += '<option value="24">12AM</option>';
                html += '</select>';
                html += '  ';
                html += '<select style="padding:5px 5px 5px 5px;" id="selectAggregateEmailTwiceDailyTimezoneDisplayName" onchange="cmdRbgMyEmailNotificationFrequency_click(\'aggregatetwicedaily\');" disabled>';
                html += '<option value="AST">AST</option>';
                html += '<option value="EST">EST</option>';
                html += '<option value="CST">CST</option>';
                html += '<option value="MST">MST</option>';
                html += '<option value="PST">PST</option>';
                html += '</select>';
                html += '</span>';
                html += '</span>';

                html += '</td></tr>';

                html += '<tr><td></td><td>';
                html += '   <span style="color:gray;font-size:8pt;font-style:italic;">Aggregated emails may get sent at slightly different times depending <br />on the state of the aggregator, and the load on the system.</span>';
                html += '</td></tr>';


                if (developerModeEnabled) {
                    // "Send me email" immediately section.
                    html += '<tr><td colspan="2"><br /><br /></td></tr>';
                    html += '  <tr>';
                    html += '    <td style="text-align:left;" class="bwSliderTitleCell">The "New Messages" red dot disappears after the first new message is viewed:</td>';
                    html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                    html += '      <input type="radio" style="cursor:pointer;" id="rbMyEmailNotificationImmediatelyxx" name="rbgMyEmailNotificationFrequencyxx" onclick="cmdRbgMyEmailNotificationFrequencyxx_click(\'immediately\');" />&nbsp;<span id="spanRbEmailImmediatelyxx" style="color:gray;">xcx231421-1</span>';
                    html += '    </td>';
                    html += '  </tr>';
                    html += '  <tr>';
                    html += '    <td style="text-align:left;" class="bwSliderTitleCell">The "New Messages" red dot disappears after all messages have been viewed:</td>';
                    html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                    html += '      <input type="radio" style="cursor:pointer;" id="rbMyEmailNotificationImmediatelyxx" name="rbgMyEmailNotificationFrequencyxx" onclick="cmdRbgMyEmailNotificationFrequencyxx_click(\'immediately\');" />&nbsp;<span id="spanRbEmailImmediatelyxx" style="color:gray;">xcx231421-2</span>';
                    html += '    </td>';
                    html += '  </tr>';
                }

                html += '</table>';


                html += '   </td></tr>';

                html += '   <tr><td colspan="2">&nbsp;</td></tr>';

                html += $('.bwPersonalErrorAdministration:first').bwPersonalErrorAdministration('renderPersonalErrorAdministrationUI');

                html += '   <tr><td colspan="2">&nbsp;</td></tr>';

                html += '   <tr>';
                html += '       <td colspan="2" class="bwChartCalculatorLightCurrencyTableCell">';

                html += '                               <span style="font-size:15pt;font-weight:normal;">Manage your one-time request reminders</span>';
                html += '                               <br />';
                html += '                               <span style="font-size:10pt;font-weight:normal;">This is the place where you can view and edit all of your manually set one-time request reminders. <span style="color:tomato;" >Locked=true notifications mean that someone has seen it, or at least sent a notification, maybe not delivered. We need to add the logic to track this process.</span></span>';
                html += '                               <br /><br />';

                html += '           <div id="divBwOneTimeRequestReminders"></div>';
                html += '       </td>';
                html += '   </tr>';


                html += '   <tr><td colspan="2">&nbsp;</td></tr>';

                if (developerModeEnabled) {
                    html += $('.bwNotificationSound:first').bwNotificationSound('renderNotificationSoundUI');
                }

                html += '   <tr><td colspan="2">&nbsp;</td></tr>';

                if (developerModeEnabled == true) {
                    // "Send me this kind of email" section.
                    //html += '<tr><td style="text-align:left;" class="bwSliderTitleCell">Send me this kind of email:</td><td class="bwChartCalculatorLightCurrencyTableCell"><input type="radio" id="rbMyEmailNotificationTypeAllNotifications" name="rbgMyEmailNotificationTypes" onclick="cmdRbgMyEmailNotificationTypes_click(\'allnotifications\');" />&nbsp;<span id="spanEmailNotificationTypeAllNotifications" style="color:gray;">All notifications</span></td></tr>';
                    //html += '<tr><td></td><td class="bwChartCalculatorLightCurrencyTableCell"><input type="radio" id="rbMyEmailNotificationTypeOnlyTasks" name="rbgMyEmailNotificationTypes" onclick="cmdRbgMyEmailNotificationTypes_click(\'onlymytasknotifications\');" />&nbsp;<span id="spanEmailNotificationTypeOnlyTasks" style="color:gray;">Only my task notifications</span></td></tr>';
                    html += '<tr>';
                    html += '  <td style="text-align:left;" class="bwSliderTitleCell">Send me this kind of email:</td>';
                    html += '        <td class="bwChartCalculatorLightCurrencyTableCell">';
                    html += '          <input type="radio" style="cursor:pointer;" id="rbMyEmailNotificationTypeAllNotifications" name="rbgMyEmailNotificationTypes" onclick="cmdRbgMyEmailNotificationTypes_click(\'allnotifications\');" />&nbsp;<span id="spanEmailNotificationTypeAllNotifications" style="color:gray;">All notifications</span>';
                    html += '        </td>';
                    html += '</tr>';
                    html += '<tr>';
                    html += '  <td></td>';
                    html += '        <td class="bwChartCalculatorLightCurrencyTableCell">';
                    html += '          <input type="radio" style="cursor:pointer;" id="rbMyEmailNotificationTypeOnlyTasks" name="rbgMyEmailNotificationTypes" onclick="cmdRbgMyEmailNotificationTypes_click(\'onlymytasknotifications\');" />&nbsp;<span id="spanEmailNotificationTypeOnlyTasks" style="color:gray;">Only my task notifications</span>';
                    html += '        </td>';
                    html += '</tr>';
                    html += '<tr>';
                    html += '  <td></td>';
                    html += '        <td class="bwChartCalculatorLightCurrencyTableCell">';
                    html += '          <input type="radio" style="cursor:pointer;" id="rbMyEmailNotificationTypeNoNotifications" name="rbgMyEmailNotificationTypes" onclick="cmdRbgMyEmailNotificationTypes_click(\'nonotifications\');" />&nbsp;<span id="spanEmailNotificationTypeNoNotifications" style="color:gray;">No email notifications ps. dev note: at the very least you will get a once a month email just to keep you involved in the system and to choose if you wish to quit.</span>';
                    html += '        </td>';
                    html += '</tr>';
                    html += '<tr><td colspan="2">&nbsp;</td></tr>';
                }

                if (developerModeEnabled == true) {
                    // "Send me this kind of email" section.
                    //html += '<tr><td style="text-align:left;" class="bwSliderTitleCell">Send me this kind of email:</td><td class="bwChartCalculatorLightCurrencyTableCell"><input type="radio" id="rbMyEmailNotificationTypeAllNotifications" name="rbgMyEmailNotificationTypes" onclick="cmdRbgMyEmailNotificationTypes_click(\'allnotifications\');" />&nbsp;<span id="spanEmailNotificationTypeAllNotifications" style="color:gray;">All notifications</span></td></tr>';
                    //html += '<tr><td></td><td class="bwChartCalculatorLightCurrencyTableCell"><input type="radio" id="rbMyEmailNotificationTypeOnlyTasks" name="rbgMyEmailNotificationTypes" onclick="cmdRbgMyEmailNotificationTypes_click(\'onlymytasknotifications\');" />&nbsp;<span id="spanEmailNotificationTypeOnlyTasks" style="color:gray;">Only my task notifications</span></td></tr>';
                    html += '<tr>';
                    html += '  <td style="text-align:left;" class="bwSliderTitleCell">Send me this kind of text message:</td>';
                    html += '        <td class="bwChartCalculatorLightCurrencyTableCell">';
                    html += '          <input type="radio" style="cursor:pointer;" id="rbMyTextMessageNotificationTypeAllNotifications" name="rbgMyTextMessageNotificationTypes" onclick="cmdRbgMyTextMessageNotificationTypes_click(\'allnotifications\');" />&nbsp;<span id="spanTextMessageNotificationTypeAllNotifications" style="color:gray;">All notifications</span>';
                    html += '        </td>';
                    html += '</tr>';
                    html += '<tr>';
                    html += '  <td></td>';
                    html += '        <td class="bwChartCalculatorLightCurrencyTableCell">';
                    html += '          <input type="radio" style="cursor:pointer;" id="rbMyTextMessageNotificationTypeOnlyTasks" name="rbgMyTextMessageNotificationTypes" onclick="cmdRbgMyTextMessageNotificationTypes_click(\'onlymytasknotifications\');" />&nbsp;<span id="spanTextMessageNotificationTypeOnlyTasks" style="color:gray;">Only my task notifications</span>';
                    html += '        </td>';
                    html += '</tr>';
                    html += '<tr>';
                    html += '  <td></td>';
                    html += '        <td class="bwChartCalculatorLightCurrencyTableCell">';
                    html += '          <input type="radio" style="cursor:pointer;" id="rbMyTextMessageNotificationTypeNoNotifications" name="rbgMyTextMessageNotificationTypes" onclick="cmdRbgMyTextMessageNotificationTypes_click(\'nonotifications\');" />&nbsp;<span id="spanTextMessageNotificationTypeNoNotifications" style="color:gray;">No text message notifications</span>';
                    html += '        </td>';
                    html += '</tr>';
                    html += '<tr><td colspan="2">&nbsp;</td></tr>';
                }

                if (developerModeEnabled == true) {
                    // "Display tips at the top of the page" section.
                    html += '<tr><td colspan="2">&nbsp;</td></tr>';
                    html += '<tr><td style="text-align:left;" class="bwSliderTitleCell">';
                    html += 'Display tips at the top of the page:&nbsp;</td>';
                    html += '<td class="bwChartCalculatorLightCurrencyTableCell"><label for="configurationBehaviorTipsSlider"></label><input type="checkbox" name="configurationBehaviorTipsSlider" id="configurationBehaviorTipsSlider" /></td></tr>';
                    html += '<tr><td colspan="2">&nbsp;</td></tr>';
                }


                if (developerModeEnabled == true) {
                    // "Display task details before displaying requests" section.
                    html += '  <tr>';
                    html += '    <td colspan="2">';
                    html += '        <span style="font-size:small;font-style:italic;">When viewing a request from the Home page, you can choose to view the approval trail prior to displaying the request.</span>';
                    html += '    </td></tr>';
                    html += '   <tr><td style="text-align:left;" class="bwSliderTitleCell">';
                    html += '           Display task details before displaying requests:</td>';
                    html += '       <td class="bwChartCalculatorLightCurrencyTableCell"><label for="configurationBehaviorDisplayTaskDetailsBeforeRequestsPageSlider"></label><input type="checkbox" name="configurationBehaviorDisplayTaskDetailsBeforeRequestsPageSlider" id="configurationBehaviorDisplayTaskDetailsBeforeRequestsPageSlider" /></td></tr>';
                    html += '   <tr><td colspan="2">&nbsp;</td></tr>';
                }


                if (developerModeEnabled == true) {
                    // 1-20-2022
                    // "Display 'My workflow apps/organizations' section on the home page" section.
                    html += '   <tr><td style="text-align:left;" class="bwSliderTitleCell">';
                    html += '           My workflow apps/organizations (where I am the tenant owner):</td>';
                    html += '       <td class="bwChartCalculatorLightCurrencyTableCell"><label for="configurationBehaviorDisplayInvitationsOnHomePageSliderxxx"></label><input type="checkbox" name="configurationBehaviorDisplayInvitationsOnHomePageSliderxxxx" id="configurationBehaviorDisplayInvitationsOnHomePageSliderxxxx" /></td></tr>';
                    html += '   <tr><td colspan="2">[Create new workflow app/organization]</td></tr>';
                    html += '   <tr><td colspan="2">&nbsp;</td></tr>';



                    html += '   <tr>';
                    html += '       <td colspan="2" class="bwSliderTitleCell">';

                    html += '                               <span style="font-size:15pt;font-weight:normal;">Create a New Organization</span>';
                    html += '                               <br />';
                    html += '                               <span style="font-size:10pt;font-weight:normal;">You can create a new organization.. xcx3243956</span>';
                    html += '                               <br /><br />';

                    html += '           <div id="divBwEmailMonitorxxxxxx"></div>';
                    html += '       </td>';
                    html += '   </tr>';


                    html += '   <tr><td colspan="2">&nbsp;</td></tr>';

                    // 9-1-2021
                    // "Two factor authentication using SMS/Text Messaging" section.
                    html += '   <tr><td colspan="2">&nbsp;</td></tr>';
                    html += '               <tr>';
                    html += '                   <td style="text-align:left;" class="bwSliderTitleCell">';
                    html += '                       Two factor authentication<br />using SMS/Text Messaging:&nbsp;';
                    html += '                   </td>';
                    html += '                   <td class="bwChartCalculatorLightCurrencyTableCell"><label for="configurationBehaviorTwoFactorAuthenticationWithSmsTextMessagingSlider"></label>';
                    html += '                       <input type="checkbox" name="configurationBehaviorTwoFactorAuthenticationWithSmsTextMessagingSlider" id="configurationBehaviorTwoFactorAuthenticationWithSmsTextMessagingSlider" />';
                    html += '                       &nbsp;<span style="font-size:10pt;font-weight:normal;font-style:italic;">This setting will take effect when the current ActiveStateIdentifier expires.</span>';
                    html += '                   </td>';
                    html += '               </tr>';
                    html += '               <tr>';
                    html += '                   <td style="text-align:left;" class="bwSliderTitleCell">';
                    html += '                       SMS/TEXT/CELL number:&nbsp;';
                    html += '                   </td>';
                    html += '                   <td class="bwChartCalculatorLightCurrencyTableCell">';
                    html += '                       <input type="text" id="inputBwTwoFactorAuthenticationSmsNumber" style="font-size:30pt;width:350px;" />';
                    html += '                       &nbsp;<input type="button" class="BwSmallButton" value="Save" onclick="$(\'#divBwAuthentication\').bwAuthentication(\'saveParticipantSmsNumber\');" />';
                    html += '                   </td>';
                    html += '               </tr>';
                    html += '               <tr>';
                    html += '                   <td colspan="2">&nbsp;</td>';
                    html += '               </tr>';
                    html += '           </table>';
                    html += '       </td>';
                    html += '   </tr>';

                    // "Display 'Add a Person/Participant/Vendor' section on the home page" section.
                    html += '   <tr>';
                    html += '       <td style="text-align:left;" class="bwSliderTitleCell">';
                    html += '           Display "Add a Person/Participant/Vendor"<br />section on the home page:';
                    html += '       </td>';
                    html += '       <td class="bwChartCalculatorLightCurrencyTableCell">';
                    html += '           <label for="configurationBehaviorDisplayInvitationsOnHomePageSlider"></label>';
                    html += '           <input type="checkbox" name="configurationBehaviorDisplayInvitationsOnHomePageSlider" id="configurationBehaviorDisplayInvitationsOnHomePageSlider" />';
                    html += '       </td>';
                    html += '   </tr>';

                    html += '   <tr><td colspan="2">&nbsp;</td></tr>';

                    // "Display 'Add a Person/Participant/Vendor' section on the home page" section.
                    html += '   <tr>';
                    html += '       <td style="text-align:left;" class="bwSliderTitleCell">';
                    html += '           Screen-saver settings (Coming Soon!):';
                    html += '       </td>';
                    html += '       <td class="bwChartCalculatorLightCurrencyTableCell">';
                    html += '           <label for="configurationBehaviorDisplayInvitationsOnHomePageSliderxx"></label>';
                    html += '           <input type="checkbox" name="configurationBehaviorDisplayInvitationsOnHomePageSliderxx" id="configurationBehaviorDisplayInvitationsOnHomePageSliderxx" />';
                    html += '       </td>';
                    html += '   </tr>';

                    html += '   <tr><td colspan="2">&nbsp;</td></tr>';

                    // 1-22-2022
                    //
                    // "Auto-save" immediately section.
                    //
                    // In bwAuthentication.js:
                    // autoRefreshHomePage: true, // This functionality will eventually not be needed, but for now it makes the application a lot more pleasant to use for the user.
                    // autoRefreshHomePage_Interval: 15000, // In ms. 15000 = 15 seconds.

                    html += '  <tr>';
                    html += '    <td style="text-align:left;" >';

                    html += '<table>';
                    html += '  <tr>';
                    html += '    <td style="text-align:left;" class="bwSliderTitleCell">Auto-refresh home page:</td>';
                    html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                    html += '      <input type="radio" style="cursor:pointer;" id="rbAutoRefreshHomePageEveryFifteenSeconds" name="rbgAutoRefreshHomePageFrequency" onclick="cmdRbgAutoRefreshHomePageFrequency_OnClick(\'everyfifteenseconds\');" />&nbsp;<span id="spanRbAutosaveFormEntryImmediatelyxx" style="color:gray;">Every 15 seconds</span>';
                    html += '    </td>';
                    html += '  </tr>';
                    html += '  <tr>';
                    html += '    <td></td>';
                    html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                    html += '      <input type="radio" style="cursor:pointer;" id="rbAutoRefreshHomePageEveryThirtySeconds" name="rbgAutoRefreshHomePageFrequency" onclick="cmdRbgAutoRefreshHomePageFrequency_OnClick(\'everythirtyseconds\');" />&nbsp;<span id="spanRbAutosaveFormEntryEverySixtySecondsxx" style="color:gray;">Every 30 seconds</span>';
                    html += '    </td>';
                    html += '  </tr>';
                    html += '  <tr>';
                    html += '    <td></td>';
                    html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                    html += '      <input type="radio" style="cursor:pointer;" id="rbAutoRefreshHomePageEverySixtySeconds" name="rbgAutoRefreshHomePageFrequency" onclick="cmdRbgAutoRefreshHomePageFrequency_OnClick(\'everysixtyseconds\');" />&nbsp;<span id="spanRbAutosaveFormEntryNeverxx" style="color:gray;">Every 60 seconds</span>';
                    html += '    </td>';
                    html += '  </tr>';
                    html += '  <tr>';
                    html += '    <td></td>';
                    html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                    html += '      <input type="radio" style="cursor:pointer;" id="rbAutoRefreshHomePageNever" name="rbgAutoRefreshHomePageFrequency" onclick="cmdRbgAutoRefreshHomePageFrequency_OnClick(\'never\');" />&nbsp;<span id="spanRbAutosaveFormEntrySaveToMyDevicexx" style="color:gray;">Never</span>';
                    html += '    </td>';
                    html += '  </tr>';
                    //html += '<tr><td colspan="2">&nbsp;</td></tr>';
                    html += '</table>';

                    html += '    </td>';
                    html += '    <td></td>';
                    html += '  </tr>';
                    //
                    // end: "Auto-save" immediately section.
                    //

                }


                if (developerModeEnabled == true) {
                    // "Auto-save" immediately section.
                    html += '  <tr>';
                    html += '    <td style="text-align:left;" class="bwSliderTitleCell">Auto-save form entry:</td>';
                    html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                    html += '      <input type="radio" style="cursor:pointer;" id="rbAutosaveFormEntryImmediately" name="rbgMyEmailNotificationFrequency" onclick="cmdRbgAutosaveFormEntryFrequency_click(\'immediately\');" />&nbsp;<span id="spanRbAutosaveFormEntryImmediately" style="color:gray;">Immediately</span>';
                    html += '    </td>';
                    html += '  </tr>';
                    html += '  <tr>';
                    html += '    <td></td>';
                    html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                    html += '      <input type="radio" style="cursor:pointer;" id="rbAutosaveFormEntryEverySixtySeconds" name="rbgMyEmailNotificationFrequency" onclick="cmdRbgAutosaveFormEntryFrequency_click(\'everysixtyseconds\');" />&nbsp;<span id="spanRbAutosaveFormEntryEverySixtySeconds" style="color:gray;">Every 60 seconds</span>';
                    html += '    </td>';
                    html += '  </tr>';
                    html += '  <tr>';
                    html += '    <td></td>';
                    html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                    html += '      <input type="radio" style="cursor:pointer;" id="rbAutosaveFormEntryNever" name="rbgMyEmailNotificationFrequency" onclick="cmdRbgAutosaveFormEntryFrequency_click(\'never\');" />&nbsp;<span id="spanRbAutosaveFormEntryNever" style="color:gray;">Never</span>';
                    html += '    </td>';
                    html += '  </tr>';
                    html += '  <tr>';
                    html += '    <td></td>';
                    html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                    html += '      <input type="radio" style="cursor:pointer;" id="rbAutosaveFormEntrySaveToMyDevice" name="rbgMyEmailNotificationFrequency" onclick="cmdRbgAutosaveFormEntryFrequency_click(\'savetomydevice\');" />&nbsp;<span id="spanRbAutosaveFormEntrySaveToMyDevice" style="color:gray;">Save to my device</span>';
                    html += '    </td>';
                    html += '  </tr>';
                    html += '<tr><td colspan="2">&nbsp;</td></tr>';
                }

                if (developerModeEnabled == true) {
                    // "Display lazy loading slider.
                    html += '  <tr>';
                    html += '    <td colspan="2">';
                    html += '        <span style="font-size:small;font-style:italic;">Lazy loading affects network performance. You can set how you wish. It is a compromise!</span>';
                    //html += '        <br />';
                    html += '        <span style="font-size:smaller;font-style:italic;color:lightgrey;">This functionality is incomplete. Coming soon!</span>';
                    html += '    </td></tr>';
                    html += '   <tr><td style="text-align:left;" class="bwSliderTitleCell">';
                    html += '           Lazy loading:</td>';
                    html += '       <td class="bwChartCalculatorLightCurrencyTableCell">';
                    html += '           <script>$( function() { $("#slider").slider(); } );</script>';
                    html += '           <div id="slider"></div>';
                    html += '       </td>';
                    html += '   </tr>';
                    html += '   <tr><td colspan="2">&nbsp;</td></tr>';
                    //html += '   <tr><td colspan="2">&nbsp;</td></tr>';
                }













                html += `   <tr>
                                <td colspan="2">

                                <div id="divBwAuthenticatedWindows"></div>
                                </td>
                            </tr>`;

                html += '   <tr><td colspan="2">&nbsp;</td></tr>';














                html += '       </table>';

                $('#divPageContent3').html(html);



                $("#divBwAuthenticatedWindows").bwAuthenticatedWindows({}); // Instantiate.


                if (developerModeEnabled == true) {

                    // NO THIS IS AGLOBAL, SHOULD BE AT THE TOP OF THIS CODE... DONt DO IT THIS WAY XXXX  :/ //var emailEnabled = true; // 1-20-2022 hardcoded for now under development. coming soon!
                    if (emailEnabled == true) {
                        var html = '';
                        html += '<span style="font-size:small;font-style:italic;">';
                        html += 'Email is ON';
                        html += '</span>';
                        document.getElementById('configurationBehaviorTurnOffEmailSlider_Description').innerHTML = html;
                        //
                        //var html = '';
                        //html += '<span style="color:green;">';
                        //html += 'xx emails have been sent so far today.';

                        //html += '                   &nbsp;&nbsp;';
                        //html += '                   <input type="button" value="View all emails..." onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdViewAllEmails\');" style="cursor:pointer;padding:5px 10px 5px 10px;" />';

                        //html += '</span>';
                        //document.getElementById('configurationBehaviorTurnOffEmailSlider_CurrentStatus').innerHTML = html;
                    } else {
                        var html = '';
                        html += '<span style="color:darkgrey;font-size:small;font-style:italic;">';
                        html += 'Turning off email may be desired if you wish to review or moderate emails before they get sent.xcx2-1';
                        html += '<br />';
                        html += 'When turned off, automatic emails get put into the Pending folder (below), where you can choose to send them, or delete them.';
                        html += '</span>';
                        document.getElementById('configurationBehaviorTurnOffEmailSlider_Description').innerHTML = html;
                        //
                        //var html = '';
                        //html += '<span style="color:red;">';
                        //html += 'There are xx unsent emails.';

                        //html += '                   &nbsp;&nbsp;';
                        //html += '                   <input type="button" value="View unsent emails..." onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdViewUnsentEmails\');" style="cursor:pointer;padding:5px 10px 5px 10px;" />';
                        //html += '                   &nbsp;&nbsp;';
                        //html += '                   <input type="button" value="View Email Log..." onclick="$(\'.bwMonitoringTools\').bwMonitoringTools(\'cmdViewAllEmails\');" style="cursor:pointer;padding:5px 10px 5px 10px;" />';

                        //html += '</span>';
                        //document.getElementById('configurationBehaviorTurnOffEmailSlider_CurrentStatus').innerHTML = html;
                    }
                    var configurationBehaviorTurnOffEmailOptions = {
                        checked: emailEnabled,
                        show_labels: true,         // Should we show the on and off labels?
                        labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                        on_label: '<span style="color:green;font-weight:bold;">ON</span>',            // Text to be displayed when checked
                        off_label: '<span style="color:red;font-weight:bold;">OFF</span>',          // Text to be displayed when unchecked
                        width: 50,                 // Width of the button in pixels
                        height: 22,                // Height of the button in pixels
                        button_width: 24,         // Width of the sliding part in pixels
                        clear_after: null         // Override the element after which the clearing div should be inserted 
                    };
                    $("input#configurationBehaviorTurnOffEmailSlider").switchButton(configurationBehaviorTurnOffEmailOptions);

                }

                $('#divBwOneTimeRequestReminders').bwOneTimeRequestReminders({}); // 2-2-2023


                var configurationBehaviorEnableThumbnailLoadingOptions = {
                    checked: thumbnailLoadingEnabled,
                    show_labels: true,         // Should we show the on and off labels?
                    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                    on_label: '<span style="color:green;font-weight:bold;">ON</span>',            // Text to be displayed when checked
                    off_label: '<span style="color:red;font-weight:bold;">OFF</span>',          // Text to be displayed when unchecked
                    width: 50,                 // Width of the button in pixels
                    height: 22,                // Height of the button in pixels
                    button_width: 24,         // Width of the sliding part in pixels
                    clear_after: null         // Override the element after which the clearing div should be inserted 
                };
                $("input#configurationBehaviorEnableThumbnailLoadingSlider").switchButton(configurationBehaviorEnableThumbnailLoadingOptions);



                // 1-13-2024.
                var configurationBehaviorToggleBrowserPushNotificationsOptions = {
                    checked: false, //thumbnailLoadingEnabled,
                    show_labels: true,         // Should we show the on and off labels?
                    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                    on_label: '<span style="color:green;font-weight:bold;">ON</span>',            // Text to be displayed when checked
                    off_label: '<span style="color:red;font-weight:bold;">OFF</span>',          // Text to be displayed when unchecked
                    width: 50,                 // Width of the button in pixels
                    height: 22,                // Height of the button in pixels
                    button_width: 24,         // Width of the sliding part in pixels
                    clear_after: null         // Override the element after which the clearing div should be inserted 
                };
                $("input#configurationBehaviorToggleBrowserPushNotificationsSlider").switchButton(configurationBehaviorToggleBrowserPushNotificationsOptions);



                //alert('bwTwoFactorAuthenticationEnabled: ' + bwTwoFactorAuthenticationEnabled);

                // 9-3-2021
                //if (bwTwoFactorAuthenticationEnabled == true) {
                //    document.getElementById('configurationBehaviorTwoFactorAuthenticationWithSmsTextMessagingSlider').setAttribute('checked', 'checked');
                //} else {
                //    document.getElementById('configurationBehaviorTwoFactorAuthenticationWithSmsTextMessagingSlider').removeAttribute('checked');
                //}

                $('#inputBwTwoFactorAuthenticationSmsNumber').val(bwTwoFactorAuthenticationSmsNumber);



                // Now we set all the display elements into their correct states!
                //emailAggregatorTwiceDailyFirstTime
                //emailAggregatorTwiceDailySecondTime
                //emailAggregatorTwiceDailyTimezoneDisplayName

                // Check if this has a value. This will be undefined the first time around until something gets saved back to the database.
                if (emailAggregatorTwiceDailyFirstTime) {
                    //displayAlertDialog('emailAggregatorTwiceDailyFirstTime: ' + emailAggregatorTwiceDailyFirstTime);
                    if (document.getElementById('selectAggregateEmailTwiceDailyFirstTime')) {
                        document.getElementById('selectAggregateEmailTwiceDailyFirstTime').value = emailAggregatorTwiceDailyFirstTime;
                    }
                    if (document.getElementById('selectAggregateEmailTwiceDailySecondTime')) {
                        document.getElementById('selectAggregateEmailTwiceDailySecondTime').value = emailAggregatorTwiceDailySecondTime;
                    }
                    if (document.getElementById('selectAggregateEmailTwiceDailyTimezoneDisplayName')) {
                        document.getElementById('selectAggregateEmailTwiceDailyTimezoneDisplayName').value = emailAggregatorTwiceDailyTimezoneDisplayName;
                    }
                }


                if (emailNotificationFrequency == 'immediately') {
                    if (document.getElementById('rbMyEmailNotificationImmediately')) document.getElementById('rbMyEmailNotificationImmediately').setAttribute('checked', 'checked');
                    if (document.getElementById('spanRbEmailImmediately')) document.getElementById('spanRbEmailImmediately').style.color = 'black'; //$('spanRbEmailImmediately').css({ 'color': 'black' });
                    if (document.getElementById('selectAggregateEmailTwiceDailyFirstTime')) document.getElementById('selectAggregateEmailTwiceDailyFirstTime').disabled = true;
                    if (document.getElementById('selectAggregateEmailTwiceDailySecondTime')) document.getElementById('selectAggregateEmailTwiceDailySecondTime').disabled = true;
                    if (document.getElementById('selectAggregateEmailTwiceDailyTimezoneDisplayName')) document.getElementById('selectAggregateEmailTwiceDailyTimezoneDisplayName').disabled = true;
                } else if (emailNotificationFrequency == 'aggregatetwicedaily') {
                    if (document.getElementById('rbMyEmailNotificationAggregated')) document.getElementById('rbMyEmailNotificationAggregated').setAttribute('checked', 'checked');
                    if (document.getElementById('spanRbAggregateEmailTwiceDaily')) document.getElementById('spanRbAggregateEmailTwiceDaily').style.color = 'black'; //$('spanRbAggregateEmailTwiceDaily').css({ 'color': 'black' });
                    if (document.getElementById('selectAggregateEmailTwiceDailyFirstTime')) document.getElementById('selectAggregateEmailTwiceDailyFirstTime').disabled = false;
                    if (document.getElementById('selectAggregateEmailTwiceDailySecondTime')) document.getElementById('selectAggregateEmailTwiceDailySecondTime').disabled = false;
                    if (document.getElementById('selectAggregateEmailTwiceDailyTimezoneDisplayName')) document.getElementById('selectAggregateEmailTwiceDailyTimezoneDisplayName').disabled = false;
                }

                //if (emailNotificationTypes == 'allnotifications') {
                //    document.getElementById('rbMyEmailNotificationTypeAllNotifications').setAttribute('checked', 'checked');
                //    document.getElementById('spanEmailNotificationTypeAllNotifications').style.color = 'black';
                //} else if (emailNotificationTypes == 'onlymytasknotifications') {
                //    document.getElementById('rbMyEmailNotificationTypeOnlyTasks').setAttribute('checked', 'checked');
                //    document.getElementById('spanEmailNotificationTypeOnlyTasks').style.color = 'black';
                //}
                if (emailNotificationTypes == 'allnotifications') {
                    if (document.getElementById('rbMyEmailNotificationTypeAllNotifications')) document.getElementById('rbMyEmailNotificationTypeAllNotifications').setAttribute('checked', 'checked');
                    if (document.getElementById('spanEmailNotificationTypeAllNotifications')) document.getElementById('spanEmailNotificationTypeAllNotifications').style.color = 'black';
                } else if (emailNotificationTypes == 'onlymytasknotifications') {
                    if (document.getElementById('rbMyEmailNotificationTypeOnlyTasks')) document.getElementById('rbMyEmailNotificationTypeOnlyTasks').setAttribute('checked', 'checked');
                    if (document.getElementById('spanEmailNotificationTypeOnlyTasks')) document.getElementById('spanEmailNotificationTypeOnlyTasks').style.color = 'black';
                } else if (emailNotificationTypes == 'nonotifications') {
                    if (document.getElementById('rbMyEmailNotificationTypeNoNotifications')) document.getElementById('rbMyEmailNotificationTypeNoNotifications').setAttribute('checked', 'checked');
                    if (document.getElementById('spanEmailNotificationTypeNoNotifications')) document.getElementById('spanEmailNotificationTypeNoNotifications').style.color = 'black';
                }


                if (developerModeEnabled == true) {
                    var operationalHoursOptions = {};
                    $('#divBwPersonalOperationalHours').bwOperationalHours(operationalHoursOptions);
                }

                // 9-11-2021
                var configurationBehaviorTwoFactorAuthenticationWithSmsTextMessagingSliderOptions = {
                    checked: bwTwoFactorAuthenticationEnabled,
                    show_labels: true,         // Should we show the on and off labels?
                    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                    on_label: "ON",            // Text to be displayed when checked
                    off_label: "OFF",          // Text to be displayed when unchecked
                    width: 50,                 // Width of the button in pixels
                    height: 22,                // Height of the button in pixels
                    button_width: 24,         // Width of the sliding part in pixels
                    clear_after: null         // Override the element after which the clearing div should be inserted 
                };
                $("input#configurationBehaviorTwoFactorAuthenticationWithSmsTextMessagingSlider").switchButton(configurationBehaviorTwoFactorAuthenticationWithSmsTextMessagingSliderOptions);

                var configurationBehaviorTipsOptions = {
                    checked: tipsDisplayOn,
                    show_labels: true,         // Should we show the on and off labels?
                    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                    on_label: "ON",            // Text to be displayed when checked
                    off_label: "OFF",          // Text to be displayed when unchecked
                    width: 50,                 // Width of the button in pixels
                    height: 22,                // Height of the button in pixels
                    button_width: 24,         // Width of the sliding part in pixels
                    clear_after: null         // Override the element after which the clearing div should be inserted 
                };
                $("input#configurationBehaviorTipsSlider").switchButton(configurationBehaviorTipsOptions);

                var configurationBehaviorDisplayInvitationsOnHomePageOptions = {
                    checked: displayInvitationsOnHomePageDisplayOn,
                    show_labels: true,         // Should we show the on and off labels?
                    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                    on_label: "ON",            // Text to be displayed when checked
                    off_label: "OFF",          // Text to be displayed when unchecked
                    width: 50,                 // Width of the button in pixels
                    height: 22,                // Height of the button in pixels
                    button_width: 24,         // Width of the sliding part in pixels
                    clear_after: null         // Override the element after which the clearing div should be inserted 
                };
                $("input#configurationBehaviorDisplayInvitationsOnHomePageSlider").switchButton(configurationBehaviorDisplayInvitationsOnHomePageOptions);

                var configurationBehaviorDisplayTaskDetailsBeforeRequestsPageOptions = {
                    checked: displayTaskDetailsBeforeRequests,
                    show_labels: true,         // Should we show the on and off labels?
                    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                    on_label: "YES",            // Text to be displayed when checked
                    off_label: "NO",          // Text to be displayed when unchecked
                    width: 50,                 // Width of the button in pixels
                    height: 22,                // Height of the button in pixels
                    button_width: 24,         // Width of the sliding part in pixels
                    clear_after: null         // Override the element after which the clearing div should be inserted 
                };
                $("input#configurationBehaviorDisplayTaskDetailsBeforeRequestsPageSlider").switchButton(configurationBehaviorDisplayTaskDetailsBeforeRequestsPageOptions);



                // Hook up the events.


                // 9-11-2021
                $('#configurationBehaviorTwoFactorAuthenticationWithSmsTextMessagingSlider').change(function () {

                    $('#divBwAuthentication').bwAuthentication('configurationBehaviorTwoFactorAuthenticationWithSmsTextMessagingSlider_Onchange');

                });



                // 12-15-2023.
                $('#configurationBehaviorEnableThumbnailLoadingSlider').change(function () {

                    $('#divBwAuthentication').bwAuthentication('configurationBehaviorEnableThumbnailLoadingSlider_Onchange'); // configurationBehaviorTwoFactorAuthenticationWithSmsTextMessagingSlider_Onchange');

                });




                $('#configurationBehaviorToggleBrowserPushNotificationsSlider').change(function () {

                    $('#divBwAuthentication').bwAuthentication('configurationBehaviorToggleBrowserPushNotificationsSlider_Onchange');

                });


                $('#configurationBehaviorTipsSlider').change(function () {
                    // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
                    if (tipsDisplayOn == true) tipsDisplayOn = false;
                    else tipsDisplayOn = true;
                    var _userDetails = [];
                    _userDetails = {
                        bwParticipantId: participantId,
                        bwTipsDisplayOn: tipsDisplayOn.toString()
                    };
                    var operationUri = webserviceurl + "/bwparticipant/updateuserconfigurationbehaviorTipsDisplay";
                    $.ajax({
                        url: operationUri,
                        type: "POST", timeout: ajaxTimeout,
                        data: _userDetails,
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        },
                        success: function (data) {
                            if (data != 'SUCCESS') {
                                displayAlertDialog(data);
                            } else {
                                //debugger;
                                // Apply Participant configurations to the display.
                                if (tipsDisplayOn == true) {
                                    //debugger;
                                    //$('#spanAlertLink').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                                    //$('#spanAlertLinkNewRequest').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                                    //$('#spanAlertLinkMyStuff').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                                    //$('#spanAlertLinkSummary').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                                    //$('#spanAlertLinkConfiguration').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                                    //$('#spanAlertLinkHelp').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                                    $('#spanAlertLink').show();
                                    $('#spanAlertLinkNewRequest').show();
                                    $('#spanAlertLinkMyStuff').show();
                                    $('#spanAlertLinkSummary').show();
                                    $('#spanAlertLinkConfiguration').show();
                                    $('#spanAlertLinkHelp').show();
                                } else {
                                    //    $('#spanAlertLink').html('&nbsp;');
                                    //    $('#spanAlertLinkNewRequest').html('&nbsp;');
                                    //    $('#spanAlertLinkMyStuff').html('&nbsp;');
                                    //    $('#spanAlertLinkSummary').html('&nbsp;');
                                    //    $('#spanAlertLinkConfiguration').html('&nbsp;');
                                    //    $('#spanAlertLinkHelp').html('&nbsp;');
                                    $('#spanAlertLink').hide();
                                    $('#spanAlertLinkNewRequest').hide();
                                    $('#spanAlertLinkMyStuff').hide();
                                    $('#spanAlertLinkSummary').hide();
                                    $('#spanAlertLinkConfiguration').hide();
                                    $('#spanAlertLinkHelp').hide();
                                }
                            }
                        },
                        error: function (data, errorCode, errorMessage) {
                            displayAlertDialog('Error in my.js.configurationBehaviorTipsSlider.change(): ' + errorCode + ' ' + errorMessage);
                        }
                    });
                });

                // Hook up the events.
                $('#configurationBehaviorDisplayInvitationsOnHomePageSlider').change(function () {
                    // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
                    if (displayInvitationsOnHomePageDisplayOn == true) displayInvitationsOnHomePageDisplayOn = false;
                    else displayInvitationsOnHomePageDisplayOn = true;

                    var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

                    var _userDetails = {
                        bwParticipantId: participantId,
                        bwInvitationsOnHomePageDisplayOn: displayInvitationsOnHomePageDisplayOn.toString()
                    };
                    var operationUri = webserviceurl + "/bwparticipant/updateuserconfigurationbehaviordisplayinvitationsonhomepage";
                    $.ajax({
                        url: operationUri,
                        type: "POST",
                        data: _userDetails,
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        },
                        success: function (data) {
                            if (data != 'SUCCESS') {
                                displayAlertDialog(data);
                            } else {
                                if (displayInvitationsOnHomePageDisplayOn == true) {
                                    $('#divInvitationSectionOnHomePage').show();
                                } else {
                                    $('#divInvitationSectionOnHomePage').hide();
                                }
                                // Apply Participant configurations to the display.
                                //if (tipsDisplayOn == true) {
                                //    $('#spanAlertLink').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                                //    $('#spanAlertLinkNewRequest').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                                //    $('#spanAlertLinkMyStuff').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                                //    $('#spanAlertLinkSummary').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                                //    $('#spanAlertLinkConfiguration').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                                //    $('#spanAlertLinkHelp').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                                //} else {
                                //    $('#spanAlertLink').html('&nbsp;');
                                //    $('#spanAlertLinkNewRequest').html('&nbsp;');
                                //    $('#spanAlertLinkMyStuff').html('&nbsp;');
                                //    $('#spanAlertLinkSummary').html('&nbsp;');
                                //    $('#spanAlertLinkConfiguration').html('&nbsp;');
                                //    $('#spanAlertLinkHelp').html('&nbsp;');
                                //}
                            }
                        },
                        error: function (data, errorCode, errorMessage) {
                            displayAlertDialog('Error in my.js.configurationBehaviorDisplayInvitationsOnHomePageSlider.change(): ' + errorCode + ' ' + errorMessage);
                        }
                    });
                });


                $('#configurationBehaviorDisplayTaskDetailsBeforeRequestsPageSlider').change(function () {
                    //debugger;
                    // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
                    if (displayTaskDetailsBeforeRequests == true) displayTaskDetailsBeforeRequests = false;
                    else displayTaskDetailsBeforeRequests = true;

                    var _userDetails = [];
                    _userDetails = {
                        bwParticipantId: participantId,
                        bwDisplayTaskDetailsBeforeRequests: displayTaskDetailsBeforeRequests.toString()
                    };
                    var operationUri = webserviceurl + "/bwparticipant/updateuserconfigurationbehaviordisplaytaskdetailsbeforerequests"; //updateuserconfigurationbehaviordisplayinvitationsonhomepage";
                    $.ajax({
                        url: operationUri,
                        type: "POST",
                        timeout: ajaxTimeout,
                        data: _userDetails,
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        },
                        success: function (data) {
                            //debugger;
                            if (data != 'SUCCESS') {
                                displayAlertDialog(data);
                            } else {
                                //if (displayInvitationsOnHomePageDisplayOn == true) {
                                //    $('#divInvitationSectionOnHomePage').show();
                                //} else {
                                //    $('#divInvitationSectionOnHomePage').hide();
                                //}
                                // Apply Participant configurations to the display.
                                //if (tipsDisplayOn == true) {
                                //    $('#spanAlertLink').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                                //    $('#spanAlertLinkNewRequest').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                                //    $('#spanAlertLinkMyStuff').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                                //    $('#spanAlertLinkSummary').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                                //    $('#spanAlertLinkConfiguration').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                                //    $('#spanAlertLinkHelp').html('Tips!&nbsp;&nbsp;&nbsp;&nbsp;');
                                //} else {
                                //    $('#spanAlertLink').html('&nbsp;');
                                //    $('#spanAlertLinkNewRequest').html('&nbsp;');
                                //    $('#spanAlertLinkMyStuff').html('&nbsp;');
                                //    $('#spanAlertLinkSummary').html('&nbsp;');
                                //    $('#spanAlertLinkConfiguration').html('&nbsp;');
                                //    $('#spanAlertLinkHelp').html('&nbsp;');
                                //}
                            }
                        },
                        error: function (data, errorCode, errorMessage) {

                            var msg = 'Error in bwActiveMenu.js.renderConfigurationPersonalBehavior.configurationBehaviorDisplayTaskDetailsBeforeRequestsPageSlider.change(): ' + errorCode + ' ' + errorMessage;
                            console.log(msg);
                            displayAlertDialog(msg);

                        }
                    });
                });

                var result = {
                    status: 'SUCCESS',
                    message: 'SUCCESS'
                }

                resolve(result);

            } catch (e) {

                var msg = 'Exception in bwActiveMenu.js.renderConfigurationPersonalBehavior(): ' + e.message + ', ' + e.stack;
                var result = {
                    status: 'EXCEPTION',
                    message: msg
                }

                reject(result);

            }
        })
    },
    selectButtonAndChangeTheme: function (buttonId, newThemeClassName) {
        try {
            console.log('In bwActiveMenu.js.selectButtonAndChangeTheme().');
            alert('In bwActiveMenu.js.selectButtonAndChangeTheme().');

            // Step 1: Figure out the currently selected theme.
            var currentClassName;
            if ($('.brushedAluminum') && $('.brushedAluminum').length && $('.brushedAluminum').length > 2) { // There should always be more than 1.
                currentClassName = 'brushedAluminum';
            } else if ($('.brushedAluminum_blue') && $('.brushedAluminum_blue').length && $('.brushedAluminum_blue').length > 2) { // There should always be more than 1.
                currentClassName = 'brushedAluminum_blue';
            } else if ($('.brushedAluminum_purple') && $('.brushedAluminum_purple').length && $('.brushedAluminum_purple').length > 2) { // There should always be more than 1.
                currentClassName = 'brushedAluminum_purple';
            } else if ($('.brushedAluminum_green') && $('.brushedAluminum_green').length && $('.brushedAluminum_green').length > 2) { // There should always be more than 1.
                currentClassName = 'brushedAluminum_green';
            } else if ($('.brushedAluminum_yellow') && $('.brushedAluminum_yellow').length && $('.brushedAluminum_yellow').length > 2) { // There should always be more than 1.
                currentClassName = 'brushedAluminum_yellow';
            } else if ($('.brushedAluminum_skyblue') && $('.brushedAluminum_skyblue').length && $('.brushedAluminum_skyblue').length > 2) { // There should always be more than 1.
                currentClassName = 'brushedAluminum_skyblue';
            } else if ($('.brushedAluminum_gray2') && $('.brushedAluminum_gray2').length && $('.brushedAluminum_gray2').length > 2) { // There should always be more than 1.
                currentClassName = 'brushedAluminum_gray2'; // This class is so that we can change Goldenrod text to black for better visibility. 10-26-2022
            } else if ($('.brushedAluminum_orange') && $('.brushedAluminum_orange').length && $('.brushedAluminum_orange').length > 2) { // There should always be more than 1.
                currentClassName = 'brushedAluminum_orange'; // This class is so that we can change Goldenrod text to black for better visibility. 10-26-2022
            } else if ($('.brushedAluminum_yellow') && $('.brushedAluminum_yellow').length && $('.brushedAluminum_yellow').length > 2) { // There should always be more than 1.
                currentClassName = 'brushedAluminum_yellow'; // This class is so that we can change Goldenrod text to black for better visibility. 10-26-2022
            }

            if (!currentClassName) {

                var msg = 'Error in bwActiveMenu.js.changeThemeTo(). Could not find the currently selected theme.';
                console.log(msg);
                displayAlertDialog(msg);

            } else {

                if (newThemeClassName == currentClassName) {

                    var msg = 'Error in bwActiveMenu.js.changeThemeTo(). newThemeClassName is the same as currentClassName: ' + currentClassName;
                    console.log(msg);
                    //displayAlertDialog(msg);

                    // Make all of the buttons un-selected.
                    var old_workflowAppTheme_SelectedButton = currentClassName + '_SelectedButton';
                    var new_workflowAppTheme_SelectedButton = newThemeClassName + '_SelectedButton';
                    $('#tdLeftSideMenu').find('.' + old_workflowAppTheme_SelectedButton).each(function (index, value) {
                        $(this).addClass(currentClassName).removeClass(old_workflowAppTheme_SelectedButton);
                    });
                    $('#tdLeftSideMenu').find('.' + new_workflowAppTheme_SelectedButton).each(function (index, value) {
                        $(this).addClass(currentClassName).removeClass(new_workflowAppTheme_SelectedButton);
                    });

                    // Select the button the user just clicked.
                    $('#' + buttonId).addClass(new_workflowAppTheme_SelectedButton).removeClass(newThemeClassName);

                } else {

                    // Make all of the buttons un-selected.
                    var old_workflowAppTheme_SelectedButton = currentClassName + '_SelectedButton';
                    var new_workflowAppTheme_SelectedButton = newThemeClassName + '_SelectedButton';
                    $('#tdLeftSideMenu').find('.' + old_workflowAppTheme_SelectedButton).each(function (index, value) {
                        $(this).addClass(currentClassName).removeClass(old_workflowAppTheme_SelectedButton);
                    });
                    $('#tdLeftSideMenu').find('.' + new_workflowAppTheme_SelectedButton).each(function (index, value) {
                        $(this).addClass(currentClassName).removeClass(new_workflowAppTheme_SelectedButton);
                    });

                    // Change the theme for the animated buttons.
                    var elements = $('.' + currentClassName);
                    for (var i = 0; i < elements.length; i++) {
                        $(elements[i]).addClass(newThemeClassName).removeClass(currentClassName);
                    }

                    // Change the theme for the top bar.
                    var elements2 = $('.' + currentClassName + '_noanimation');
                    for (var i = 0; i < elements2.length; i++) {
                        var newThemeNonAnimatedClass = newThemeClassName + '_noanimation';
                        var oldThemeNonAnimatedClass = currentClassName + '_noanimation';
                        $(elements2[i]).addClass(newThemeNonAnimatedClass).removeClass(oldThemeNonAnimatedClass);
                    }

                    // Select the button the user just clicked.
                    $('#' + buttonId).addClass(new_workflowAppTheme_SelectedButton).removeClass(newThemeClassName);

                }

            }

        } catch (e) {
            var msg = 'Exception in bwActiveMenu.js.changeThemeTo(): ' + e.message + ', ' + e.stack;
            coonsole.log(msg);
            displayAlertDialog(msg);
        }
    },

    //displayCodeFile: function (filepath) {
    //    try {
    //        console.log('In bwActiveMenu.js.displayCodeFile().');

    //        $('#javascriptCodeWindow').html(''); // Clear the previous code.
    //        var html = '';
    //        html += '<pre><code class="language-javascript"></code></pre>';
    //        //html += '<pre><code class="language-html"></code></pre>';
    //        $('#javascriptCodeWindow').html(html);

    //        $('#tdFilePath').html(filepath);



    //    } catch (e) {
    //        console.log('Exception in bwActiveMenu.js.displayCodeFile(): ' + e.message + ', ' + e.stack);
    //        displayAlertDialog('Exception in bwActiveMenu.js.displayCodeFile(): ' + e.message + ', ' + e.stack);
    //    }
    //},
    displayCodeFile: function (filepath) {
        try {
            console.log('In bwActiveMenu.js.displayCodeFile().');

            $('#javascriptCodeWindow').html(''); // Clear the previous code.
            var html = '';
            html += '<pre><code class="language-javascript"></code></pre>';
            //html += '<pre><code class="language-html"></code></pre>';
            $('#javascriptCodeWindow').html(html);

            $('#tdFilePath').html(filepath);

            var mergeHTMLPlugin = (function () {
                'use strict';

                var originalStream;

                /**
                 * @param {string} value
                 * @returns {string}
                 */
                function escapeHTML(value) {
                    return value
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/"/g, '&quot;')
                        .replace(/'/g, '&#x27;');
                }

                /* plugin itself */

                /** @type {HLJSPlugin} */
                const mergeHTMLPlugin = {
                    // preserve the original HTML token stream
                    "before:highlightElement": ({ el }) => {
                        originalStream = nodeStream(el);
                    },
                    // merge it afterwards with the highlighted token stream
                    "after:highlightElement": ({ el, result, text }) => {
                        if (!originalStream.length) return;

                        const resultNode = document.createElement('div');
                        resultNode.innerHTML = result.value;
                        result.value = mergeStreams(originalStream, nodeStream(resultNode), text);
                        el.innerHTML = result.value;
                    }
                };

                /* Stream merging support functions */

                /**
                 * @typedef Event
                 * @property {'start'|'stop'} event
                 * @property {number} offset
                 * @property {Node} node
                 */

                /**
                 * @param {Node} node
                 */
                function tag(node) {
                    return node.nodeName.toLowerCase();
                }

                /**
                 * @param {Node} node
                 */
                function nodeStream(node) {
                    /** @type Event[] */
                    const result = [];
                    (function _nodeStream(node, offset) {
                        for (let child = node.firstChild; child; child = child.nextSibling) {
                            if (child.nodeType === 3) {
                                offset += child.nodeValue.length;
                            } else if (child.nodeType === 1) {
                                result.push({
                                    event: 'start',
                                    offset: offset,
                                    node: child
                                });
                                offset = _nodeStream(child, offset);
                                // Prevent void elements from having an end tag that would actually
                                // double them in the output. There are more void elements in HTML
                                // but we list only those realistically expected in code display.
                                if (!tag(child).match(/br|hr|img|input/)) {
                                    result.push({
                                        event: 'stop',
                                        offset: offset,
                                        node: child
                                    });
                                }
                            }
                        }
                        return offset;
                    })(node, 0);
                    return result;
                }

                /**
                 * @param {any} original - the original stream
                 * @param {any} highlighted - stream of the highlighted source
                 * @param {string} value - the original source itself
                 */
                function mergeStreams(original, highlighted, value) {
                    let processed = 0;
                    let result = '';
                    const nodeStack = [];

                    function selectStream() {
                        if (!original.length || !highlighted.length) {
                            return original.length ? original : highlighted;
                        }
                        if (original[0].offset !== highlighted[0].offset) {
                            return (original[0].offset < highlighted[0].offset) ? original : highlighted;
                        }

                        /*
                        To avoid starting the stream just before it should stop the order is
                        ensured that original always starts first and closes last:
                  
                        if (event1 == 'start' && event2 == 'start')
                          return original;
                        if (event1 == 'start' && event2 == 'stop')
                          return highlighted;
                        if (event1 == 'stop' && event2 == 'start')
                          return original;
                        if (event1 == 'stop' && event2 == 'stop')
                          return highlighted;
                  
                        ... which is collapsed to:
                        */
                        return highlighted[0].event === 'start' ? original : highlighted;
                    }

                    /**
                     * @param {Node} node
                     */
                    function open(node) {
                        /** @param {Attr} attr */
                        function attributeString(attr) {
                            return ' ' + attr.nodeName + '="' + escapeHTML(attr.value) + '"';
                        }
                        // @ts-ignore
                        result += '<' + tag(node) + [].map.call(node.attributes, attributeString).join('') + '>';
                    }

                    /**
                     * @param {Node} node
                     */
                    function close(node) {
                        result += '</' + tag(node) + '>';
                    }

                    /**
                     * @param {Event} event
                     */
                    function render(event) {
                        (event.event === 'start' ? open : close)(event.node);
                    }

                    while (original.length || highlighted.length) {
                        let stream = selectStream();
                        result += escapeHTML(value.substring(processed, stream[0].offset));
                        processed = stream[0].offset;
                        if (stream === original) {
                            /*
                            On any opening or closing tag of the original markup we first close
                            the entire highlighted node stack, then render the original tag along
                            with all the following original tags at the same offset and then
                            reopen all the tags on the highlighted stack.
                            */
                            nodeStack.reverse().forEach(close);
                            do {
                                render(stream.splice(0, 1)[0]);
                                stream = selectStream();
                            } while (stream === original && stream.length && stream[0].offset === processed);
                            nodeStack.reverse().forEach(open);
                        } else {
                            if (stream[0].event === 'start') {
                                nodeStack.push(stream[0].node);
                            } else {
                                nodeStack.pop();
                            }
                            render(stream.splice(0, 1)[0]);
                        }
                    }
                    return result + escapeHTML(value.substr(processed));
                }

                return mergeHTMLPlugin;

            }());

            $.get(filepath, function (textString) {
                try {

                    $('.language-javascript').html(textString);

                    //hljs.addPlugin(mergeHTMLPlugin);

                    hljs.highlightAll(); // Highlight.js call to invoke the styling.

                } catch (e) {
                    console.log('Exception in bwActiveMenu.js.displayCodeFile():2: ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in bwActiveMenu.js.displayCodeFile():2: ' + e.message + ', ' + e.stack);
                }
            });

        } catch (e) {
            console.log('Exception in bwActiveMenu.js.displayCodeFile(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu.js.displayCodeFile(): ' + e.message + ', ' + e.stack);
        }
    },


    initializeUserInterface: function (source) {
        try {
            console.log('In bwActiveMenu.js.initializeUserInterface().');
            //alert('In bwActiveMenu.js.initializeUserInterface().');

            $('.bwNotificationSound').bwNotificationSound('renderFavicon', false); // false means don't show the red dot. 

            var userIsATenantOwner = $('.bwAuthentication').bwAuthentication('option', 'userIsATenantOwner');
            var iData = $('.bwAuthentication').bwAuthentication('option', 'iData');
            var faData = $('.bwAuthentication').bwAuthentication('option', 'faData');

            //
            //
            // Populate the top bar org picker drop down. 12-16-2023.
            //
            //

            var html2 = '';

            if (!(iData && iData.length)) {

                var msg = 'Error in bwActiveMenu.js.initializeUserInterface(). iData HAS NO length. DOES THIS MEAN WE NEED TO MAKE A PROMISE SOMEWHERE? LOOK INTO THIS....';
                console.log(msg);
                //alert(msg);

            } else {

                if (iData.length == 1) {

                    // There is only 1 workflow, so display it as text/a span element..
                    html2 += '<span class="OrgPickerDropdown_Item">' + iData[0].bwWorkflowAppTitle + '</span>';

                } else {

                    // There is more than 1 item, so display in a drop down.
                    for (var i = 0; i < iData.length; i++) {

                        if (workflowAppId == iData[i].bwWorkflowAppId) {

                            html2 += '<span class="OrgPickerDropdown_Item" value="' + iData[i].bwWorkflowAppId + '|' + iData[i].bwParticipantRole + '" onclick="$(\'.bwAuthentication\').bwAuthentication(\'selectHomePageWorkflowAppDropDown_change2\', this);">' + iData[i].bwWorkflowAppTitle + '</span>';

                        } else {

                            html2 += '<span class="OrgPickerDropdown_Item" value="' + iData[i].bwWorkflowAppId + '|' + iData[i].bwParticipantRole + '" onclick="$(\'.bwAuthentication\').bwAuthentication(\'selectHomePageWorkflowAppDropDown_change2\', this);">' + iData[i].bwWorkflowAppTitle + '</span>';

                        }

                        html2 += '<br />';

                    }

                }

            }

            var dropDown = document.getElementById('divOrganizationPickerDropDown');
            dropDown.innerHTML = html2;

            //
            //
            // end: Populate the top bar org picker drop down.
            //
            //

            console.log('In bwActiveMenu.js.initializeUserInterface(). userIsATenantOwner: ' + userIsATenantOwner);

            if (userIsATenantOwner == 'true') {

                var html = '';

                html += `<table style="width:100%;">
                            <tr>
                                <td>`;

                html += '           <div id="divBwHomepageClock" style="float:right;z-index:10;">[divBwHomepageClock]</div>';
                //
                //
                // Decided that the org picker is supposed to be here. 12-18-2023.
                //   - This gets instantiated as a "bwOrganizationPicker" widget below.
                //
                //
                html += '           <div style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 2.77em;">Your selected organizational unit: ';
                html += '           <span id="spanHomePageWorkflowAppTitle" style="display:inline;"></span>';

                //
                //
                // end: Decided that the org picker is supposed to be here. 12-18-2023.
                //   - This gets instantiated as a "bwOrganizationPicker" widget below.
                //
                //

                var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');

                if (developerModeEnabled && (developerModeEnabled == true)) {

                    // 1-9-2022
                    html += '       <span style="float:right">';
                    html += 'View switcher [bookmarks?]: [xcx9631-1]&nbsp;&nbsp;&nbsp;[xcx9631-2]&nbsp;&nbsp;&nbsp;[xcx9631-3]&nbsp;&nbsp;&nbsp;[xcx9631-4]&nbsp;';
                    html += '';
                    html += '';
                    html += '       </span>';

                }

                //
                // search box. This exists elsewhere. Maybe it should be a widget.? 10-11-2022
                //

                //html += `           <span id="searchbox" style="float:right;padding-right:25%;">
                //                        <span style="font-size:25pt;position:relative;left:250px;top:-17px;">Search: </span>
                //                        <input xcx="xcx7737712" type="text" id="inputBwAuthentication_SearchBox" onkeydown="$('.bwExecutiveSummariesCarousel2').bwExecutiveSummariesCarousel2('searchBox_OnKeyDown', event);" style="opacity:0.25;position:absolute;WIDTH: 315px;font-family: 'Segoe UI Light','Segoe UI','Segoe',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;">
                //                        <img src="images/folder.png" style="width:25px;cursor:pointer;position:relative; left: 250px; top: -15px;" title="Search for file(s)..." alt="Search for file(s)..." onclick="$('.bwExecutiveSummariesCarousel2').bwExecutiveSummariesCarousel2('searchForFiles');">
                //        `;

                html += `<span id="" style="float:right;white-space:nowrap;font-family:Verdana;font-size:14pt;">
                        Search:
                        <span id="searchbox">
                            <input type="text" xcx="xcx7737712" value="" id="inputBwAuthentication_SearchBox" onkeydown="$('.bwExecutiveSummariesCarousel2').bwExecutiveSummariesCarousel2('searchBox_OnKeyDown', event);" style="WIDTH: 60%;font-family: 'Segoe UI Light','Segoe UI','Segoe',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;">
                            <img src="images/folder.png" style="width:25px;cursor:pointer;position:relative; left: -50px; top: 0;" title="Search for file(s)..." alt="Search for file(s)..." onclick="$('.bwExecutiveSummariesCarousel2').bwExecutiveSummariesCarousel2('searchForFiles');" />
                            <span class="emailEditor_newMessageButton" style="position:relative;left:-25px;" onclick="$('.bwExecutiveSummariesCarousel2').bwExecutiveSummariesCarousel2('search');">Search</span>
                        </span>
                    </span>`;


                // OCR button. Coming soon?!
                //<img src="images/ocricon.png" style="width:25px;cursor:pointer;position:relative; left: 250px; top: -15px;" title="Search using image OCR..." alt="Search using image OCR..." onclick="$('.bwExecutiveSummariesCarousel2').bwExecutiveSummariesCarousel2('searchUsingImageOCR');">

                //html += `              <span class="emailEditor_newMessageButton" onclick="$('.bwExecutiveSummariesCarousel2').bwExecutiveSummariesCarousel2('search');" style="position:relative;left:250px;top:-17px;">Search</span>
                //                    </span>`;

                html += '       </td>';
                html += '       <td style="text-align:right;">';
                //html += '           <span id="spanHomePagePrintButton" style="text-align:right;">[spanHomePagePrintButton]</span>';
                html += `       </td>
                            </tr>
                        </table>`;

                html += '<div id="spanHomePagePersonalizedSection" style=""></div>';

                if (faData.length == 0) {

                    //$('#divMenuMasterDivNewRequestButton').hide(); // Hide this button for now.
                    //$('#divMenuMasterDivSummaryButton').hide();
                    //$('#divMenuMasterDivMyStuffButton').hide();
                    html += 'You need to create at least one financial area before you can begin using your budget workflow.<br />';
                    html += '<a href="javascript:populateStartPageItem(\'divConfiguration\', \'Reports\', \'\');">Click here to create the first Financial Area</a>';
                    html += '<br /><br />';
                    html += '';
                    html += '';
                    html += '';
                    html += '';
                    $('#divWelcomeMessage').html(html);

                } else {

                    console.log('xcx2131234-4 populating [divPageContent1].');
                    $('#divPageContent1').html(html); // This clears the main content section of the page (within the star trek menu buttons and top bar).

                    //
                    //
                    // Set the SelectedOrganization, populate the top bar, and instantiate the org picker on the home page.
                    //
                    //

                    if (iData.length == 1) {

                        // There is only 1 workflow.
                        document.getElementsByClassName('divTopBarTextContents_WorkflowTitle').innerHTML = iData[0].bwWorkflowAppTitle;

                        var selectedOrganization = { // 9-7-2021 STARTING TO RENAME THESE VARS A BIT BETTER FOR FINAL RELEASE.
                            OrganizationId: iData[0].bwWorkflowAppId,
                            OrganizationTitle: iData[0].bwWorkflowAppTitle,
                            OrganizationRole: iData[0].bwParticipantRole
                        }

                        $('.bwAuthentication').bwAuthentication('option', 'SelectedOrganization', selectedOrganization);

                    } else {

                        // There is more than 1 item.
                        console.log('In bwActiveMenu.js.initializeUserInterface(). Populating [selectHomePageWorkflowAppDropDown] with ' + iData.length + ' organizations.');
                        //alert('In bwActiveMenu.js.renderHomeScreen(). Populating [selectHomePageWorkflowAppDropDown] with ' + iData.length + ' organizations.');

                        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

                        for (var i = 0; i < iData.length; i++) {
                            if (workflowAppId == iData[i].bwWorkflowAppId) {

                                document.getElementsByClassName('divTopBarTextContents_WorkflowTitle').innerHTML = iData[i].bwWorkflowAppTitle;

                                var selectedOrganization = { // 9-7-2021 STARTING TO RENAME THESE VARS A BIT BETTER FOR FINAL RELEASE.
                                    OrganizationId: iData[i].bwWorkflowAppId,
                                    OrganizationTitle: iData[i].bwWorkflowAppTitle,
                                    OrganizationRole: iData[i].bwParticipantRole
                                }

                                $('.bwAuthentication').bwAuthentication('option', 'SelectedOrganization', selectedOrganization);

                                console.log('Instantiating bwOrganizationPicker2.js. xcx23213. bwOrgId: root, bwOrgName: ' + iData[i].bwWorkflowAppTitle);
                                $('#spanHomePageWorkflowAppTitle').bwOrganizationPicker2({ bwLastSelectedOrgUnitId: 'root', jsonData: { bwOrgId: 'root', bwOrgName: iData[i].bwWorkflowAppTitle } }); // Added "bwLastSelectedOrgUnitId" to the "BwParticipant" table 12-18-2023.

                                break;

                            }
                        }
                    }

                    //
                    //
                    // end: Set the SelectedOrganization, populate the top bar, and instantiate the org picker on the home page.
                    //
                    //

                    $('.bwAuthentication').bwAuthentication('renderHomePagePersonalizedSection_AndRenderButtons_AndDisplay_tableMainMenu1');

                }

            } else if (userIsATenantOwner == 'false') {

                // This section is for users who are participants and not tenant owners.
                var html = '';
                for (var i = 0; i < workflowAppData.d.results.length; i++) {
                    html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 2.77em;">Your budgeting networkxx2: <strong>' + workflowAppData.d.results[i].bwWorkflowAppTitle + '</strong></span>';
                }
                html += '<br /><br />';
                html += '<div id="divHomePageAlert"></div>';
                html += '<br /><br /><br />';
                if (faData.length == 0) {
                    $('#divMenuMasterDivNewRequestButton').hide(); // Hide this button for now.
                    $('#divMenuMasterDivSummaryButton').hide();
                    $('#divMenuMasterDivMyStuffButton').hide();
                    html += 'You need to create at least one financial area before you can begin using your budget workflow.<br />';
                    html += '<a href="javascript:populateStartPageItem(\'divConfiguration\', \'Reports\', \'\');">Click here to create the first Financial Area</a>';
                    html += '<br /><br />';
                    html += '';
                    html += '';
                    html += '';
                    html += '';
                }
                html += '<br /><br /><hr />';
                html += 'You are a participant for this tenant, "' + tenantData[0].bwTenantTitle + '". <a href="javascript:cmdContactTheTenantAdministrator();">Contact the Tenant Administrator</a><br /><br />';
                //html += '<i><a href="javascript:cmdUpgradeAndPricingOptions();">Click here to learn about upgrade options</a></i>';
                $('#divWelcomeMessage').html(html);

                alert('Calling renderAlerts2() xcx21341235-1.');
                //debugger;
                renderAlerts2('xcx2'); // xcx2
                //loadWorkflowAppConfigurationDetails9();

            } else {

                console.log('Error in bwActiveMenu.js.initializeUserInterface(). Unexpected value for userIsATenantOwner: ' + userIsATenantOwner);
                console.log('Error in bwActiveMenu.js.initializeUserInterface(). Unexpected value for userIsATenantOwner: ' + userIsATenantOwner);
                console.log('Error in bwActiveMenu.js.initializeUserInterface(). Unexpected value for userIsATenantOwner: ' + userIsATenantOwner);
                //alert('Error in bwActiveMenu.js.initializeUserInterface(). Unexpected value for userIsATenantOwner: ' + userIsATenantOwner);

            }

            $('#divBwHomepageClock').bwHomepageClock({ color: 'lightgray' });

        } catch (e) {
            console.log('Exception in bwActiveMenu.js.initializeUserInterface(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu.js.initializeUserInterface(): ' + e.message + ', ' + e.stack);
        }
    },

    renderAuthenticatedHomePage: function () {
        try {
            console.log('In bwActiveMenu.js.renderAuthenticatedHomePage().');
            //alert('In bwActiveMenu.js.renderAuthenticatedHomePage().');

            //var welcomeButton = document.getElementById('divWelcomeButton');
            //this.options.divWelcomeButton_OriginalHeight = welcomeButton.style.height;
            //alert('In bwActiveMenu.js.renderAuthenticatedHomePage(). Set divWelcomeButton_OriginalHeight: ' + this.options.divWelcomeButton_OriginalHeight);

            this.options.HomePage = false;
            this.renderMenu();

        } catch (e) {
            console.log('Exception in bwActiveMenu.js.renderAuthenticatedHomePage(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu.js.renderAuthenticatedHomePage(): ' + e.message + ', ' + e.stack);
        }
    },

    txtOrganizationPickerDropdown_OnKeyup: function (elementId) {
        try {
            console.log('In bwActiveMenu.js.txtOrganizationPickerDropdown_OnKeyup(). elementId: ' + elementId);
            //alert('In bwActiveMenu.js.txtOrganizationPickerDropdown_OnKeyup(). elementId: ' + elementId);





            //var formElement = this.element.closest("#budgetrequestform");
            //if (formElement) {
            //if ($(formElement).find('#divLocationPickerDropDown')[0].style.display == 'none') {
            if ($(this.element).find("#divLocationPickerDropDown")[0].style.display == 'none') {
                //// When displaying the location picker, make it size itself a bit wider than the user entry textbox.
                //var width1 = document.getElementById('txtOrganizationPickerFilter').style.width;
                //var width2 = width1.split('px')[0];
                //var width3 = Number(width2) + 50;
                //var width = width3 + 'px';
                //$(formElement).find('#divLocationPickerDropDown')[0].style.width = width;
                //$(formElement).find('#divLocationPickerDropDown')[0].style.display = 'block';





                this.txtOrganizationPickerDropdown_OnMouseup();












            }
            //} else {
            //    // Must be on Visualizations
            //    if ($('.bwTrackSpending').find('#divLocationPickerDropDown')[0].style.display == 'none') {
            //        // When displaying the location picker, make it size itself a bit wider than the user entry textbox.
            //        var width1 = document.getElementById('txtOrganizationPickerFilter').style.width;
            //        var width2 = width1.split('px')[0];
            //        var width3 = Number(width2) + 50;
            //        var width = width3 + 'px';
            //        $('.bwTrackSpending').find('#divLocationPickerDropDown')[0].style.width = width;
            //        $('.bwTrackSpending').find('#divLocationPickerDropDown')[0].style.display = 'block';
            //    }
            //}
        } catch (e) {
            console.log('Exception in bwActiveMenu.js.txtOrganizationPickerDropdown_OnKeyup(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu.js.txtOrganizationPickerDropdown_OnKeyup(): ' + e.message + ', ' + e.stack);
        }
    },
    txtOrganizationPickerDropdown_OnMouseup: function () {
        try {
            console.log('In bwActiveMenu.js.txtOrganizationPickerDropdown_OnMouseup().');
            //alert('In bwActiveMenu.js.txtOrganizationPickerDropdown_OnMouseup().');
            var thiz = this;

            // When the user is done selecting a location, hide the location picker drop down.
            var parentElementId = this.options.parentElementId; //'divPageContent1';
            //try {
            //    parentElementId = $(this.element).closest('#budgetrequestform').closest('.ui-dialog-content')[0].id; // If it is in a dialog, this returns the dialog id.
            //} catch (e) { }
            //if (!parentElementId) {
            //    // It is not in a dialog, so it must be a new request.
            //    parentElementId = 'divCreateRequestFormContent';
            //}



            //var formElement = $(this.element).closest("#budgetrequestform");
            //debugger;
            try {
                var dialogId = $('#' + parentElementId).closest('.ui-dialog')[0].id;
                console.log('In txtOrganizationPickerDropdown_OnMouseup(). dialogId: ' + dialogId);
            } catch (e) {
                // This fails on the new request form. Fix someday or maybe not...
            }
            //if ($(formElement).find('#divLocationPickerDropDown')[0].style.display == 'none') {




            //(!elem.getClientRects().length || !elem.getBoundingClientRect().width) ?
            //              swap(elem, cssShow, function () {
            //                  return getWidthOrHeight(elem, dimension, extra);
            //              }) :
            //              getWidthOrHeight(elem, dimension, extra);


            // When displaying the location picker, make it size itself a bit wider than the user entry textbox.
            //var width1;
            //if ($('#' + parentElementId).find('#txtOrganizationPickerFilter')[0]) {
            //    //width1 = $('#' + parentElementId).find('#txtOrganizationPickerFilter')[0].style.width;
            //    width1 = $('#' + parentElementId).find('#txtOrganizationPickerFilter')[0].getBoundingClientRect().width;
            //} else {
            //    //width1 = $(this.element).find('#txtOrganizationPickerFilter')[0].style.width;
            //    width1 = $(this.element).find('#txtOrganizationPickerFilter')[0].getBoundingClientRect().width;
            //}

            var width2 = document.getElementById('divTopBar_OrganizationName').getBoundingClientRect().width;


            //alert('xcx24234: ' + JSON.stringify(width1));

            //debugger;
            //var width2 = width1.split('px')[0];
            var width3 = Number(width2) + 0; // 150;
            var width = width3; // + 'px';
            //$(formElement).find('#divLocationPickerDropDown')[0].style.width = width;
            //$(formElement).find('#divLocationPickerDropDown')[0].style.display = 'block';

            // This makes it show up on top and to not move the other elements around.
            //document.getElementById('divLocationPickerDropDown').style.position = 'absolute';
            //document.getElementById('divLocationPickerDropDown').style.zIndex = '10';

            //
            // THIS SHOULDNT BE HERE BUT IT IS FOR THE MOMENT 12-16-2023.
            //
            //var html = '';

            //html += '<style>';
            //html += '.OrgPickerDropdown_Item {';
            //html += '   cursor:pointer;';
            //html += '   color:tomato;';
            //html += '   font-size:49px;';
            //html += '   border: 2px solid aliceblue;';
            //html += '}';
            //html += '.OrgPickerDropdown_Item:hover {';
            //html += '   border: 2px solid red;';
            //html += '}';
            //html += '</style>';

            console.log('xcx232132 displaying dialog [divOrganizationPickerDropDown].');
            // CHANGED 8-25-2020
            thiz.options.pickerDialog = $(this.element).find("#divOrganizationPickerDropDown"); // $('#' + parentElementId).find("#divLocationPickerDropDown"); // THIS IS how we can reference the dialog later on and close it etc.

            //alert('Displaying dialog. xcx21312422.');
            $(this.element).find("#divOrganizationPickerDropDown").dialog({
                position: {
                    my: "left top",
                    at: "left bottom",
                    of: $(thiz.element).find('#divTopBar_OrganizationName') // $('#' + parentElementId).find('#txtOrganizationPickerFilter') //"#txtOrganizationPickerFilter"
                },
                modal: true,
                resizable: false,
                closeText: "Cancel",
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                height: 400,
                width: width,
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hi
                open: function (event, ui) {

                    $('.ui-widget-overlay').bind('click', function () {

                        thiz.options.pickerDialog.dialog('close');

                    });

                    // Hide the title bar.
                    $(this).dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
                },
                close: function () {

                    thiz.options.pickerDialog.dialog('destroy');

                }

            });

        } catch (e) {
            console.log('Exception in bwActiveMenu.js.txtOrganizationPickerDropdown_OnMouseup(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu.js.txtOrganizationPickerDropdown_OnMouseup(): ' + e.message + ', ' + e.stack);
        }
    },

    toggleVideoBackgroundExperiment: function (enabled) {
        try {
            console.log('In bwActiveMenu.js.toggleVideoBackgroundExperiment(). this.options.VideoBackgroundExperiment: ' + this.options.VideoBackgroundExperiment + ', enabled: ' + enabled);
            //alert('In bwActiveMenu.js.toggleVideoBackgroundExperiment(). this.options.VideoBackgroundExperiment: ' + this.options.VideoBackgroundExperiment + ', enabled: ' + enabled);

            //alert('xcx231243-2. Getting workflowAppTheme.');
            //var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme'); // When turning on, use the saved value for this.
            //alert('xcx231243-2. Getting workflowAppTheme: ' + workflowAppTheme);

            if (enabled && (enabled == true)) {

                console.log('In toggleVideoBackgroundExperiment(). TURNING ON.'); // workflowAppTheme: ' + workflowAppTheme);
                //alert('In toggleVideoBackgroundExperiment(). TURNING ON.');

                if (!this.options.videoElement) {

                    var video = document.createElement('video');
                    video.src = 'https://shareandcollaborate.com/video/clouds.mp4';
                    video.type = 'video/mp4';
                    video.muted = true;
                    video.autoplay = true; // Currently the [loop] attribute is removed. In the long term, do we really want all the movement? Forever? 6-12-2024. 

                    video.style.position = 'absolute';
                    video.style.width = '100%';
                    video.style.height = '100vh'; // height: 100vh; min-height: 100%;
                    video.style.minHeight = '100%';
                    //video.style.height = '100vh';
                    video.style.objectFit = 'cover';
                    //video.style.objectFit = 'fill';
                    video.style.zIndex = -20;

                    this.options.videoElement = video;

                    document.body.prepend(video);

                }

                var topBarOutsideCircle = document.getElementById('bwActiveMenu_CanvasTopBarOutsideCircle');
                topBarOutsideCircle.style.opacity = '0.4';

                var topBarInsideCircle = document.getElementById('bwActiveMenu_CanvasTopBarInsideCircle');
                topBarInsideCircle.style.opacity = '0.4';
                //topBarInsideCircle.style.opacity = '1.0';

                var menuElements = $('.bwColoredMenuItem'); // + workflowAppTheme); // bwColoredMenuItem
                for (var i = 0; i < menuElements.length; i++) {

                    var element2 = menuElements[i];
                    element2.style.opacity = '0.4';

                }


                var menuElements = $('.bwMenuButton_Selected'); // ' + workflowAppTheme + '_SelectedButton');
                for (var i = 0; i < menuElements.length; i++) {

                    var element2 = menuElements[i];
                    //element2.style.opacity = '0.1';
                    element2.style.opacity = '0'; // THIS IS WHERE WE SET THE HOME BUTTON TO TOTALLY TRANSPARENT, SO WE CAN SEE THE FULL SCREEN VIDEO BEHIND, JUST AS IT WAS ORIGINALLY INTENDED. The menu is coming together. Woop! 6-19-2024.
                    element2.style.color = 'red';

                    console.log('THIS IS WHERE WE SET THE HOME BUTTON TO TOTALLY TRANSPARENT, SO WE CAN SEE THE FULL SCREEN VIDEO BEHIND, JUST AS IT WAS ORIGINALLY INTENDED. The menu is coming together. Woop! 6-19-2024.');

                }

                var menuElements = $('.buttonSpacer');
                for (var i = 0; i < menuElements.length; i++) {

                    var element2 = menuElements[i];
                    element2.style.opacity = '0.2';

                }

            } else {

                console.log('In toggleVideoBackgroundExperiment(). TURNING OFF.');
                //alert('In toggleVideoBackgroundExperiment(). TURNING OFF.');

                //if (!workflowAppTheme_Original) {

                //    console.log('Error in bwActiveMenu.js.xx(). No value for workflowAppTheme_Original: ' + workflowAppTheme_Original);
                //    alert('Error in bwActiveMenu.js.xx(). No value for workflowAppTheme_Original: ' + workflowAppTheme_Original);

                //} else {

                //var workflowAppTheme = workflowAppTheme_Original; // When turning off, we need to know what the original was.

                var topBarOutsideCircle = document.getElementById('bwActiveMenu_CanvasTopBarOutsideCircle');
                topBarOutsideCircle.style.opacity = '1';

                var topBarInsideCircle = document.getElementById('bwActiveMenu_CanvasTopBarInsideCircle');
                topBarInsideCircle.style.opacity = '1';

                var menuElements = $('.bwColoredMenuItem'); // + workflowAppTheme);
                for (var i = 0; i < menuElements.length; i++) {

                    var element2 = menuElements[i];
                    element2.style.opacity = '1';

                }

                //var menuElements = $('.' + workflowAppTheme + '_noanimation');
                //for (var i = 0; i < menuElements.length; i++) {

                //    var element2 = menuElements[i];
                //    element2.style.opacity = '1';

                //}

                var menuElements = $('.bwMenuButton_Selected'); // + workflowAppTheme + '_SelectedButton');
                for (var i = 0; i < menuElements.length; i++) {

                    var element2 = menuElements[i];
                    element2.style.opacity = '1';

                }

                var menuElements = $('.buttonSpacer');
                for (var i = 0; i < menuElements.length; i++) {

                    var element2 = menuElements[i];
                    element2.style.opacity = '1';

                }

                if (this.options.videoElement) {
                    this.options.videoElement.pause();
                    this.options.videoElement.remove();
                    this.options.videoElement = null;
                }

            }

        } catch (e) {
            console.log('Exception in bwActiveMenu.js.toggleVideoBackgroundExperiment(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwActiveMenu.js.toggleVideoBackgroundExperiment(): ' + e.message + ', ' + e.stack);
        }
    },



    renderOutsideCurveInTheMenuBar: function (skinny) {
        try {
            console.log('In bwActiveMenu.js.renderOutsideCurveInTheMenuBar().');

            // Step 1: Get the color from our selected theme.
            var element = document.getElementById('divTopBar_Long'); // This is a good element to check.
            var style = window.getComputedStyle(element);
            var backgroundColor = style.getPropertyValue('background-color');
            var opacity = style.getPropertyValue('opacity');

            if (skinny) {
                //
                // skinny is when the left menubar is skinnier. Work in progress.
                //
                var canvas2 = document.getElementById('bwActiveMenu_CanvasTopBarOutsideCircle');
                canvas2.style.width = "100px";
                canvas2.style.height = "80px";
                //canvas2.width = 100;


                //    var divLeftMenuHeader = document.getElementById('divLeftMenuHeader');
                //var canvas2 = document.getElementById('bwActiveMenu_CanvasTopBarOutsideCircle');
                //    if (!canvas2) {
                //        canvas2 = document.createElement('canvas');
                //        canvas2.id = 'bwActiveMenu_CanvasTopBarOutsideCircle';
                //        //canvas2.style = "width:175px;height:80px;opacity:0.4;"; // canvas.style = "width:175px;height:80px;opacity:1.0;";
                //        divLeftMenuHeader.appendChild(canvas2); // Place in the div.
                //    }

                //    canvas2.style.opacity = opacity;
                // canvas2.width = 100; // 175;
                //    canvas2.height = 80;

                //    //var ctx = canvas2.getContext("2d");
                //    //ctx.clearRect(0, 0, canvas2.width, canvas2.height); // clear the canvas of it's lines

                //    //ctx.fillStyle = backgroundColor;

                //    //ctx.beginPath();
                //    //ctx.lineTo(100, 0); // Start top right
                //    //ctx.lineTo(100, 0);  //ctx.lineTo(140, 0);
                //    //ctx.bezierCurveTo(60, 0, 15, 15, 0, 55);
                //    //ctx.lineTo(0, 80);
                //    //ctx.lineTo(100, 80);
                //    //ctx.lineTo(100, 0); // End top right
                //    //ctx.fill();


            } else {

                var divLeftMenuHeader = document.getElementById('divLeftMenuHeader');
                var canvas2 = document.getElementById('bwActiveMenu_CanvasTopBarOutsideCircle');
                if (!canvas2) {
                    canvas2 = document.createElement('canvas');
                    canvas2.id = 'bwActiveMenu_CanvasTopBarOutsideCircle';
                    //canvas2.style = "width:175px;height:80px;opacity:0.4;"; // canvas.style = "width:175px;height:80px;opacity:1.0;";
                    canvas2.style.opacity = opacity;
                    canvas2.width = 175;
                    canvas2.height = 80;
                    divLeftMenuHeader.appendChild(canvas2); // Place in the div.
                }

                var ctx = canvas2.getContext("2d");
                ctx.clearRect(0, 0, canvas2.width, canvas2.height); // clear the canvas of it's lines

                //ctx.fillStyle = backgroundColor;

                // Create linear gradient
                const grad = ctx.createLinearGradient(0, 0, 280, 130);
                grad.addColorStop(0, "lightblue");
                grad.addColorStop(1, "darkblue");

                // Fill rectangle with gradient
                ctx.fillStyle = grad;

                ctx.beginPath();
                ctx.lineTo(175, 0); // Start top right
                ctx.lineTo(140, 0);
                ctx.bezierCurveTo(60, 0, 15, 15, 0, 55);
                ctx.lineTo(0, 80);
                ctx.lineTo(175, 80);
                ctx.lineTo(175, 0); // End top right
                ctx.fill();














                //// Create linear gradient
                //const grad = ctx.createLinearGradient(0, 0, 280, 0);
                //grad.addColorStop(0, "lightblue");
                //grad.addColorStop(0.5, "purple");
                //grad.addColorStop(1, "darkblue");

                //// Fill rectangle with gradient
                //ctx.fillStyle = grad;


                //// Create linear gradient
                //const grad = ctx.createLinearGradient(0, 0, 280, 0);
                //grad.addColorStop(0, "lightblue");
                //grad.addColorStop(1, "darkblue");

                //// Fill rectangle with gradient
                //ctx.fillStyle = grad;
                //ctx.fillRect(10, 10, 280, 130);

            }

        } catch (e) {
            var msg = 'Exception in bwActiveMenu.js.renderOutsideCurveInTheMenuBar(): ' + e.message + ', ' + e.stack;
            console.log(msg);
        }
    },
    renderInsideCurveInTheMenuBar: function () {
        try {
            console.log('In bwActiveMenu.js.renderInsideCurveInTheMenuBar().');

            // Step 1: Get the color from our selected theme.
            var element = document.getElementById('divTopBar_Long'); // This is a good element to check.
            var style = window.getComputedStyle(element);
            var backgroundColor = style.getPropertyValue('background-color');

            var canvas = document.getElementById('bwActiveMenu_CanvasTopBarInsideCircle');
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines
            var x = canvas.width;
            var y = canvas.width;
            var radius = canvas.width;
            var startAngle = 1 * Math.PI;
            var endAngle = 1.5 * Math.PI;

            ctx.fillStyle = backgroundColor;

            ctx.beginPath();
            ctx.arc(x, y, radius, startAngle, endAngle, false);
            ctx.lineTo(0, 0);
            ctx.lineTo(0, canvas.width);
            ctx.fill();

        } catch (e) {
            var msg = 'Exception in bwActiveMenu.js.renderInsideCurveInTheMenuBar(): ' + e.message + ', ' + e.stack;
            console.log(msg);
        }
    },

    renderMenu: function () {
        try {
            console.log('In bwActiveMenu.js.renderMenu().');
            //alert('In bwActiveMenu.js.renderMenu().');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');

            var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');

            var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
            console.log('In bwActiveMenu.js.renderMenu(). Getting workflowAppTheme: ' + workflowAppTheme);

            var tableMainMenu1 = document.getElementById('tableMainMenu1');

            if (!tableMainMenu1) {

                var html = '';

                html += '<div style="height:8px;"></div>';
                html += '<div style="margin:0 8px 8px 8px;">';
                html += '<table id="tableMainMenu1" style="display:inline;width:100%;border-collapse: collapse;">';
                html += '        <tr>';
                html += '            <td style="width:1%;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                //html += '                <div xcx="xcx90987-1" id="divLeftMenuHeader" class="' + workflowAppTheme + '_noanimation bwColoredMenuItem noanimation" style="border-radius:26px 0 0 0;width:50px; float:left; height:80px; background-color:darkgray; ">';




                // Changed width to 100% 8-5-2024.
                //html += '                <div xcx="xcx90987-1" id="divLeftMenuHeader" class="' + workflowAppTheme + '_noanimation bwColoredMenuItem noanimation" style="border-radius:26px 0 0 0;width:100%; float:left; height:80px; background-color:darkgray; ">';
                html += '                <div xcx="xcx90987-1" id="divLeftMenuHeader" style="width:100%; float:left; height:80px; ">';

                html += '                    <span xcx="xcx23135" class="ai_conversation_icon" style="display:none;" onclick="$(\'.bwSpeech\').bwSpeech(\'AquireSpeech\');">🗣</span>';
                html += '                    <img xcx="xcx324327777" id="orgImage_root_blueheaderbar" style="display:none;z-index:5999;border:7px solid #066B8B;border-radius:50%;width:215px;height:215px;vertical-align:-1.9em;background-color:#066B8B;position:absolute;cursor:pointer !important;" src="images/cloud.png" title="[xcxBwWorkflowAppId]" /><!---.75em too high. 40 x 40 is good, 53x53 is 1/3 larger... The image was originally was corporeal.png. -->';
                html += '                </div>';


                //Replacing with canvas element 1-5-2025.
                //html += '                   <canvas id="divLeftMenuHeader" width="175" height="80" style="height:175px;width:80px;opacity:1.0;" ></canvas>';





                html += '            </td>';
                html += '            <td xcx="90987-2-1" style="width:26px;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '                   <div class="' + workflowAppTheme + '_noanimation bwColoredMenuItem noanimation" style="float:left;height:50px;width:26px;position:relative;background-color:darkgray;z-index:-1;"></div>';
                //html += '                   <canvas id="bwActiveMenu_CanvasTopBarInsideCircle" width="150" height="150" style="height:26px;width:26px;opacity:0.4;" ></canvas>';
                html += '                   <canvas id="bwActiveMenu_CanvasTopBarInsideCircle" width="150" height="150" style="height:26px;width:26px;opacity:1.0;" ></canvas>';
                html += '            </td>';
                html += '            <td style="width:100%;vertical-align:top;padding:0 0 0 0;margin:0 0 0 -2px;border-width:0 0 0 0;">';
                html += '                <div id="divTopBar_Long" xcx="xcx1234-1" class="' + workflowAppTheme + '_noanimation bwColoredMenuItem noanimation" style="width: 100%; float:left; height:50px;  ">';
                html += '               </div>';
                html += '            </td>';
                html += '            <td style="vertical-align:top;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                //html += '                <div xcx="xcx21312-1" id="divTopBar_OrganizationName" class="' + workflowAppTheme + '_noanimation bwColoredMenuItem noanimation selectHomePageWorkflowAppDropDown2" style="width: 100%; float:left; height:50px; background-color:darkgray; " >';
                html += '                <div xcx="xcx21312-1" id="divTopBar_OrganizationName" class="selectHomePageWorkflowAppDropDown2" style="width: 100%; float:left; height:50px; background-color:darkgray; margin:-5px 5px 0px 5px;" onkeyup="$(\'.bwActiveMenu\').bwActiveMenu(\'txtOrganizationPickerDropdown_OnKeyup\', \'txtOrganizationPickerDropdown\');" onmouseup="$(\'.bwActiveMenu\').bwActiveMenu(\'txtOrganizationPickerDropdown_OnMouseup\', \'txtOrganizationPickerDropdown\');"></div>';

                //html += '                <div xcx="xcx21312-1" class="' + workflowAppTheme + '_noanimation bwColoredMenuItem noanimation" style="width: 100%; float:left; height:50px; background-color:darkgray; ">';
                html += '                   <div id="divOrganizationPickerDropDown" style="display:none;background-color:white;overflow-x:hidden;cursor:pointer;"  ></div>'; // Scrollable div wrapper for the treeview. Position and z-index makes it show up on top and to not move the other elements around.
                //html += '                </div>';

                //html += '                <div id="divLeftMenuTopSmallBar1" xcx="xcx4433221-1" class="brushedAluminum_green_noanimation noanimation" style="width: 100%; float:right; height:25px; background-color:#7788ff !important; color:white;"></div>';

                html += '            </td>';
                html += '            <td style="width:1%;vertical-align:top;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                if (developerModeEnabled == true) {
                    html += '                <div class="' + workflowAppTheme + '_noanimation bwColoredMenuItem noanimation" style="border-radius:0 26px 26px 0;width: 30px; float:left; height:49px; background-color:darkgray; ">xcx2132-1</div>';
                } else {
                    html += '                <div class="' + workflowAppTheme + '_noanimation bwColoredMenuItem noanimation" style="border-radius:0 26px 26px 0;width: 30px; float:left; height:49px; background-color:darkgray; "></div>';
                }
                html += '            </td>';
                html += '        </tr>';
                html += '        <tr>';
                html += '            <td id="tdLeftSideMenu" style="width: ' + this.options.LeftMenuWidth + ';vertical-align:top;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';

                // THIS IS THE LEFT MENU
                html += '            </td>';
                html += '            <td colspan="4" style="vertical-align:top;">';
                //html += '                <div id="divPageContent1" style="margin-left:25px;right:-15px;top:-15px;padding-left:0;padding-top:0;">';
                html += '                <div id="divPageContent1" style="margin-left:25px;margin-right:-15px;margin-top:-15px;padding-left:0;padding-top:0;">'; // THIS CAN MOVE UP THE CONTENT, BUT THIS IS FINELY TUNED, SO BE CAREFUL HERE, YOU MAY NOT FIND THIS LINE OF CODE EVER AGAIN. :)
                html += '                    <div>';
                html += '                        <br />';
                html += '                        <br />';
                html += '                        <br />';
                html += '                        <br />';
                html += '                        <br />';
                html += '                        <br />';
                html += '                        <br />';
                html += '                        <br />';
                html += '                    </div>';
                html += '                </div>';
                html += '            </td>';
                html += '        </tr>';
                html += '    </table>';

                // Left inner menu
                html += '    <table id="tableMainMenu2" style="display:none;width:100%;border-collapse: collapse;">';
                html += '        <tr>';
                html += '            <td style="width:1%;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '                <div xcx="xcx23423555" class="' + workflowAppTheme + '_noanimation bwColoredMenuItem noanimation" style="border-radius:20px 0 0 0;width: 100%; float:left; height:85px; background-color:gray; "></div>';
                html += '            </td>';
                html += '            <td style="width:0.1%;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '                <div style="float:left;height:85px;width:26px;background-color:gray;margin-left:-2px;margin-right:-2px;">';
                html += '                    <div class="' + workflowAppTheme + '_noanimation bwColoredMenuItem noanimation" style="float:left;height:85px;width:26px;position:relative;background-color:gray;">';
                html += '                        <div id="divInnerRoundWithWhiteOverlay" style="position:absolute; bottom:0;float:left;width: 26px; height:36px; background-color:#f5f6fa; border-radius:26px 0 0 0;margin-left:1px;margin-bottom:-1px;"></div> <!-- The background-color is set to space white (#f5f6fa) here, for the "under the curve" color of this element. -->';
                html += '                    </div>';
                html += '                </div>';
                html += '            </td>';
                html += '            <td style="width:2%;vertical-align:top;padding:0 6px 0 6px;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '                <div id="divPageContent2_Title" style="font-size:45px;color:black;white-space:nowrap;margin-top:-3px;font-weight:bolder;">[divPageContent2_Title]</div>';
                html += '            </td>';
                html += '            <td style="width:95%;vertical-align:top;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '                <div class="' + workflowAppTheme + '_noanimation bwColoredMenuItem noanimation" style="border-radius:0 26px 26px 0;width: 100%; float:left; height:50px; background-color:gray; ">xcx2132-2';
                html += '                </div>';
                html += '            </td>';
                html += '        </tr>';
                html += '        <tr>';
                html += '            <td id="tdInnerLeftSideMenu" style="vertical-align:top;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                html += '                <div id="divInnerLeftMenuTopSmallBar1" class="' + workflowAppTheme + '_noanimation bwColoredMenuItem noanimation" style="width: 100%; float:right; height:25px; background-color:#7788ff !important; color:white;font-family: \'Franklin Gothic Medium\', \'Arial Narrow\', Arial, sans-serif;display: flex !important;justify-content: flex-end !important;align-items: flex-end !important;">';
                //html += '🔊';
                html += '                </div>';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                html += '                <div weightedheightvalue="40" class="leftButton ' + workflowAppTheme + ' bwColoredMenuItem" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForInnerLeftMenuButtons\', this, \'PERSONAL_BEHAVIOR\');">';
                html += '                    <div class="leftButtonText2">PERSONAL SETTINGS</div>';
                html += '                </div>';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                html += '                <div class="leftButton ' + workflowAppTheme + ' bwColoredMenuItem" weightedheightvalue="125" style="display:none;height:125px;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForInnerLeftMenuButtons\', this, \'ORGANIZATION\');">';
                html += '                    <div class="leftButtonText2">ORGANIZATION</div>';
                html += '                </div>';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                html += '                <div class="leftButton ' + workflowAppTheme + ' bwColoredMenuItem" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForInnerLeftMenuButtons\', this, \'ROLES\');">';
                html += '                    <div class="leftButtonText2">ROLES</div>';
                html += '                </div>';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                html += '                <div class="leftButton ' + workflowAppTheme + ' bwColoredMenuItem" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForInnerLeftMenuButtons\', this, \'PARTICIPANTS\');">';
                html += '                    <div class="leftButtonText2">PARTICIPANTS</div>';
                html += '                </div>';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                html += '                <div class="leftButton ' + workflowAppTheme + ' bwColoredMenuItem" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForInnerLeftMenuButtons\', this, \'INVENTORY\');">';
                html += '                    <div class="leftButtonText2">INVENTORY</div>';
                html += '                </div>';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                html += '                <div class="leftButton ' + workflowAppTheme + ' bwColoredMenuItem" weightedheightvalue="125" style="display:none;height:125px;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForInnerLeftMenuButtons\', this, \'WORKFLOW_AND_EMAIL\');">';
                html += '                    <div class="leftButtonText2">WORKFLOWS</div>';
                html += '                </div>';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                html += '                <div class="leftButton ' + workflowAppTheme + ' bwColoredMenuItem" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForInnerLeftMenuButtons\', this, \'FORMS\');">';
                html += '                    <div class="leftButtonText2">FORMS</div>';
                html += '                </div>';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                html += '                <div class="leftButton ' + workflowAppTheme + ' bwColoredMenuItem" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForInnerLeftMenuButtons\', this, \'CHECKLISTS\');">';
                html += '                    <div class="leftButtonText2">CHECKLISTS</div>';
                html += '                </div>';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                html += '                <div class="leftButton ' + workflowAppTheme + ' bwColoredMenuItem" weightedheightvalue="80" style="display:none;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForInnerLeftMenuButtons\', this, \'SETTINGS\');">';
                html += '                    <div class="leftButtonText2">ORGANIZATION SETTINGS</div>';
                html += '                </div>';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                html += '                <div class="leftButton ' + workflowAppTheme + ' bwColoredMenuItem" weightedheightvalue="40" style="display:none;height:75px;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForInnerLeftMenuButtons\', this, \'MONITOR_PLUS_TOOLS\');">';
                html += '                    <div class="leftButtonText2">MONITORING & TOOLS</div>';
                html += '                </div>';
                html += '            </td>';
                html += '            <td colspan="3" style="vertical-align:top;">';
                html += '                <div id="divPageContent2" style="padding-left:10px;">';
                html += '                    <div id="divPageContent3" style="right:-10px;top:-10px;padding-left:20px;padding-top:15px;">';
                html += '                        <div>';
                html += '                            <br />';
                html += '                            <br />';
                html += '                            <br />';
                html += '                            <br />';
                html += '                            <br />';
                html += '                            <br />';
                html += '                            <br />';
                html += '                            <br />';
                html += '                        </div>';
                html += '                    </div>';
                html += '                </div>';
                html += '            </td>';
                html += '        </tr>';
                html += '    </table>';
                html += '</div>';

                $(this.element).html(html);

                this.renderOutsideCurveInTheMenuBar();
                this.renderInsideCurveInTheMenuBar();

            }

            debugger;

            if (!participantId) {

                // Unauthenticated.

                //
                // THIS IS WHERE WE DISPLAY THE EMPTY INITIAL LEFT MENU WRAP TOP BAR.
                //

                var html = '';

                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                html += '                <div id="divLeftMenuTopSmallBar1" class="' + workflowAppTheme + '_noanimation bwColoredMenuItem noanimation" style="width: 100%; float:right; height:25px; background-color:#7788ff !important; color:white;font-family: \'Franklin Gothic Medium\', \'Arial Narrow\', Arial, sans-serif;display: flex !important;justify-content: flex-end !important;align-items: flex-end !important;"></div>';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                html += '                <div weightedheightvalue="1000" class="leftButton_inactive ' + workflowAppTheme + ' bwColoredMenuItem" style="height:100vh;" >';
                html += '                    <div class="leftButtonText">';
                html += '                    </div>';
                html += '                </div>';

                $('#tdLeftSideMenu').html(html);

            } else {

                //
                //
                // THIS IS WHERE HOME AUTHENTICATED GETS RENDERED. 7-4-2024.
                //
                //

                console.log('In bwActiveMenu.js.renderMenu(). Authenticated.');

                var topLeftLogoEnabled = $('.bwAuthentication').bwAuthentication('option', 'topLeftLogoEnabled');
                console.log('Decide if we are turning on the top left org circle/logo. topLeftLogoEnabled: ' + topLeftLogoEnabled);
                if (topLeftLogoEnabled == true) {
                    document.getElementById('orgImage_root_blueheaderbar').style.display = 'inline'; // This displays the top-left org circle.
                } else {
                    console.log('The value for topLeftLogoEnabled is false, so not displaying the top left org circle/logo.');
                }

                console.log('xcx231243-4. Getting workflowAppTheme.');
                var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');

                console.log('xcx2313123 workflowAppTheme: ' + workflowAppTheme);

                console.log('AUTHENTICATED contextMenu temporarily disabled.');
                //displayAlertDialog_QuickNotice('AUTHENTICATED contextMenu temporarily disabled.');

                $.contextMenu('destroy');// Do this first to make sure an old one isn't hanging around.

                if (typeof ($.bw.bwNotificationSound) != 'undefined') {
                    // At this point, we know the widget.js file has loaded. Now we need to check if the widget has been instantiated.
                    var widget = document.getElementsByClassName('bwNotificationSound');
                    if (!(widget.length && (widget.length > 0))) {

                        //alert('xcx23123 bwNotificationSound.js has not been instantiated.<<<<<<<<');

                        // It has not been instantiated, so do that here.
                        var div = document.getElementById('divBwNotificationSound');
                        if (!div) {
                            div = document.createElement('div');
                            div.id = 'divBwNotificationSound';
                            div.style.display = 'none';
                            document.body.appendChild(div); // place at end of document.
                        }
                        $(div).bwNotificationSound({});
                    }

                } else {
                    var msg = 'Error: The bwNotificationSound.js widget has not been loaded. Inspect the index.html file to make sure it is specified to load. xcx23536.';
                    console.log(msg);
                }

                var html = '';

                //
                //
                // THIS IS OUR USER SETTINGS. 3-18-2024.
                //
                //

                html += $('.bwNotificationSound').bwNotificationSound('renderTopBarUserSettings');

                //
                //
                // THIS IS OUR AI SPEECH BUBBLE. 3-18-2024.
                //
                //

                html += '                   <div class="' + workflowAppTheme + '_noanimation bwColoredMenuItem noanimation" style="padding:5px 25px 0 0;background-color:white;font-size:25pt;color:goldenrod;cursor:pointer;float:right;" onclick="$(\'.bwNotificationSound\').bwNotificationSound(\'slideOutAndDisplayNotificationsPanel\');">';
                html += $('.bwNotificationSound').bwNotificationSound('renderTopBarSpeechBubble');
                html += '                   </div>';

                //
                //
                // THIS IS OUR VOLUME CONTROL. 3-18-2024.
                //
                //

                html += $('.bwNotificationSound').bwNotificationSound('renderTopBarVolumeControl');



                if (developerModeEnabled == true) {

                    //
                    //
                    // THIS IS OUR PULL BACK ALL WINDOWS TO MASTER WINDOW. 5-8-2024.
                    //
                    //

                    html += $('.bwNotificationSound').bwNotificationSound('renderPullBackAllPoppedOutWindowsToMasterWindow');




                    html += '                   <div class="' + workflowAppTheme + '_noanimation bwColoredMenuItem noanimation" style="padding-top:5px;background-color:white;font-size:25pt;color:goldenrod;cursor:pointer;float:right;" onclick="$(\'.bwNotificationSound\').bwNotificationSound(\'slideOutAndDisplayNotificationsPanel_Email\');">';
                    html += $('.bwNotificationSound').bwNotificationSound('renderTopBarEmail');
                    html += '                   </div>';

                    html += '                   <div class="' + workflowAppTheme + '_noanimation bwColoredMenuItem noanimation" style="padding-top:5px;background-color:white;font-size:25pt;color:goldenrod;cursor:pointer;float:right;" onclick="$(\'.bwNotificationSound\').bwNotificationSound(\'slideOutAndDisplayNotificationsPanel_Telephone\');">';
                    html += $('.bwNotificationSound').bwNotificationSound('renderTopBarTelephone');
                    html += '                   </div>';

                }

                $('#divTopBar_Long').html(html); // 6-15-2024.

                var html = '';

                html += '';
                html += '                <div weightedheightvalue="40" class="' + workflowAppTheme + '_noanimation bwColoredMenuItem noanimation" style="">';
                html += '                    <div class="leftButtonText">';
                html += '                        <span id="spanErrorLink" style="display:none;font-size:x-large;color:yellow;font-family:Chunkfive, Georgia, Palatino, Times New Roman, serif;font-weight:bold;cursor:pointer;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;" onclick="cmdDisplayCommunicationsError();">Error!&nbsp;&nbsp;&nbsp;&nbsp;</span>';
                html += '                    </div>';
                html += '                </div>';
                html += '';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                html += '';
                html += '                <div id="divLeftMenuTopSmallBar1" class="' + workflowAppTheme + '_noanimation bwColoredMenuItem noanimation" style="width: 100%; float:right; height:25px; background-color:#7788ff !important; color:white;font-family: \'Franklin Gothic Medium\', \'Arial Narrow\', Arial, sans-serif;display: flex !important;justify-content: flex-end !important;align-items: flex-end !important;"></div>';
                html += '';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                html += '';

                if (developerModeEnabled == true) {
                    html += '                <div weightedheightvalue="40" class="leftButton ' + workflowAppTheme + ' bwColoredMenuItem" style="" onclick="cmdDisplayToDoList();">';
                    html += '                    <div class="leftButtonText">';
                    html += '                        tips';
                    html += '                    </div>';
                    html += '                </div>';
                } else {
                    html += '                <div weightedheightvalue="40" class="leftButton ' + workflowAppTheme + ' bwColoredMenuItem" style="" >';
                    html += '                    <div class="leftButtonText">';
                    //html += '                        tips';
                    html += '                    </div>';
                    html += '                </div>';
                }

                html += '';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                html += '                <div xcx="xcx234788" id="divWelcomeButton" weightedheightvalue="150" class="leftButton ' + workflowAppTheme + ' bwColoredMenuItem" style="display:none;background-color:darkkhaki;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForButton\', this, \'HOME\');">';
                html += '                    <div class="leftButtonText">HOME</div>';
                html += '                </div>';
                html += '';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                html += '                <div id="divNewRequestButton" weightedheightvalue="150" class="leftButton ' + workflowAppTheme + ' bwColoredMenuItem" style="display:none;background-color:khaki;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForButton\', this, \'NEW_REQUEST\');">';
                html += '                    <div class="leftButtonText">NEW REQUEST</div>';
                html += '                </div>';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                html += '                <div id="divArchiveButton" weightedheightvalue="125" class="leftButton ' + workflowAppTheme + ' bwColoredMenuItem" style="display:none;background-color:darkgray;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForButton\', this, \'ALL_REQUESTS\');">';
                html += '                    <div class="leftButtonText">ALL REQUESTS</div>';
                html += '                </div>';

                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                html += '                <div id="divVisualizationsButton" weightedheightvalue="75" class="leftButton ' + workflowAppTheme + ' bwColoredMenuItem" style="display:none;background-color:darkkhaki;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForButton\', this, \'TRACK_SPENDING2\');">';
                html += '                    <div class="leftButtonText">TRACK</div>';
                html += '                </div>';

                //html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                //html += '                <div id="divMessagingButton" weightedheightvalue="150" class="leftButton ' + workflowAppTheme + ' bwColoredMenuItem" style="display:none;background-color:darkkhaki;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForButton\', this, \'MESSAGING2\');">';
                ////html += '                    <img src="https://shareandcollaborate.com/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;position:relative;top:-80%;left:30%;">';
                ////html += '                    <img src="https://shareandcollaborate.com/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;position:relative;top:-82%;left:-50%;">';
                //html += '                    <img id="imgMessagingNotificationRedDot" src="images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;position:relative;bottom:15px;left:-10px;display:none;">'; // This only gets displayed when there is an unread email waiting for the user.
                //html += '                    <div class="leftButtonText">INSTANT MESSAGE</div>';
                //html += '                </div>';

                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                html += '                <div id="divMessagingButton" weightedheightvalue="150" class="leftButton ' + workflowAppTheme + ' bwColoredMenuItem" style="display:none;background-color:darkkhaki;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForButton\', this, \'MESSAGING2\');">';
                //html += '                    <img src="https://shareandcollaborate.com/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;position:relative;top:-80%;left:30%;">';
                //html += '                    <img src="https://shareandcollaborate.com/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;position:relative;top:-82%;left:-50%;">';
                html += '                    <img id="imgMessagingNotificationRedDot" src="images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;position:relative;bottom:15px;left:-10px;display:none;">'; // This only gets displayed when there is an unread email waiting for the user.
                html += '                    <div class="leftButtonText">EMAIL</div>';
                html += '                </div>';

                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                html += '                <div id="divCalendarButton" weightedheightvalue="150" class="leftButton ' + workflowAppTheme + ' bwColoredMenuItem" style="display:none;background-color:darkkhaki;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForButton\', this, \'VIEW_CALENDAR\');">';
                //html += '                    <img src="https://shareandcollaborate.com/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;position:relative;top:-80%;left:30%;">';
                //html += '                    <img src="https://shareandcollaborate.com/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;position:relative;top:-82%;left:-50%;">';
                html += '                    <img id="imgMessagingNotificationRedDot" src="images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;position:relative;bottom:15px;left:-10px;display:none;">'; // This only gets displayed when there is an unread email waiting for the user.
                html += '                    <div class="leftButtonText">CALENDAR</div>';
                html += '                </div>';

                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                html += '                <div id="divConfigurationButton" weightedheightvalue="100" class="leftButton ' + workflowAppTheme + ' bwColoredMenuItem" style="display:none;background-color:khaki;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForButton\', this, \'CONFIGURATION2\');">';
                html += '                    <div class="leftButtonText">CONFIGURATION</div>';
                html += '                </div>';

                if (developerModeEnabled == true) {
                    // EMAIL_CLIENT_BUTTON. added 2-3-2023
                    html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                    html += '                <div weightedheightvalue="40" class="leftButton ' + workflowAppTheme + ' bwColoredMenuItem" style="background-color:burlywood;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForButton\', this, \'EMAIL_CLIENT_BUTTON\');">';
                    html += '                    <div class="leftButtonText">EMAIL CLIENT</div>';
                    html += '                </div>';
                }

                if (developerModeEnabled == true) {
                    html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                    html += '                <div weightedheightvalue="40" class="leftButton ' + workflowAppTheme + ' bwColoredMenuItem" style="background-color:plum;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForButton\', this, \'USER\');">';
                    html += '                    <div class="leftButtonText">USER: <span id="spanLoggedInUserWelcomePage" style="padding-right:1px;"></span></div>';
                    html += '                </div>';
                }

                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                html += '                <div weightedheightvalue="40" class="leftButton ' + workflowAppTheme + ' bwColoredMenuItem " style="background-color:burlywood;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForButton\', this, \'REPORT_AN_ERROR\');">';
                html += '                    <div class="leftButtonText">&nbsp;&nbsp;REPORT AN ERROR</div>';
                html += '                </div>';

                // START_BUTTON. added 2-3-2023
                //html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                //html += '                <div weightedheightvalue="40" class="leftButton brushedAluminum" style="background-color:burlywood;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForButton\', this, \'START_BUTTON\');">';
                //html += '                    <img xcx="xcx987089" style="width:50px;height:50px;" src="images/power button.png" />';
                //html += '                    <div class="leftButtonText">START BUTTON</div>';
                //html += '                </div>';

                if (developerModeEnabled == true) {
                    html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                    html += '                <div weightedheightvalue="75" class="leftButton ' + workflowAppTheme + ' bwColoredMenuItem" style="background-color:burlywood;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForButton\', this, \'REPORT_AN_ERROR\');">';
                    html += '                    <div class="leftButtonText">VIDEO ASSISTANT</div>';
                    html += '                </div>';

                    html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                    html += '                <div weightedheightvalue="75" class="leftButton ' + workflowAppTheme + ' bwColoredMenuItem" style="background-color:thistle;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForButton\', this, \'PRINT\');">';
                    html += '                    <div class="leftButtonText">PRINT</div>';
                    html += '                </div>';
                    html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                    html += '                <div weightedheightvalue="40" class="leftButton ' + workflowAppTheme + ' bwColoredMenuItem" style="" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForButton\', this, \'VIEW_MOBILE_VERSION\');">';
                    html += '                    <div class="leftButtonText">VIEW MOBILE VERSION</div>';
                    html += '                </div>';
                    html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                    html += '                <div weightedheightvalue="40" class="leftButton ' + workflowAppTheme + ' bwColoredMenuItem" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForButton\', this, \'TILE_AND_BALLOON_WINDOWS\');">';
                    html += '                    <div class="leftButtonText">TILE AND BALLOON WINDOWS</div>';
                    html += '                </div>';
                }

                if (participantEmail == 'todd@budgetworkflow.com') {
                    html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                    html += '                <div weightedheightvalue="40" class="leftButton ' + workflowAppTheme + ' bwColoredMenuItem" style="" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForButton\', this, \'FOREST_ADMIN\');">';
                    html += '                    <div class="leftButtonText">FOREST ADMIN</div>';
                    html += '                </div>';
                }

                if (developerModeEnabled == true) {
                    html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                    html += '                <div weightedheightvalue="40" class="leftButton ' + workflowAppTheme + ' bwColoredMenuItem" style="" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForButton\', this, \'LIVE_STATUS\');">';
                    html += '                    <div class="leftButtonText">LIVE STATUS</div>';
                    html += '                </div>';
                    html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:20px; background-color:white; "></div>';
                    html += '                <div weightedheightvalue="40" class="leftButton ' + workflowAppTheme + ' bwColoredMenuItem" style="" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForButton\', this, \'DONATE\');">';
                    html += '                    <div class="leftButtonText">DONATE</div>';
                    html += '                </div>';
                }

                $('#tdLeftSideMenu').html(html);

                console.log('xcx23124-2. Calling toggleVideoBackgroundExperiment().');
                //alert('xcx23124-2. Calling toggleVideoBackgroundExperiment().');
                this.toggleVideoBackgroundExperiment(false); // IT MIGHT BE NICER TO DO THIS BELOW (less flicker etc.) Trying it. 6-15-2024.

                //
                // This backfills the user small circle icon in the top bar. Trying to standardize this chunk of code so it can be used throughout. 12-27-2023.
                //

                var lookForImage = function (imageElement, imagePath) {
                    return new Promise(function (resolve, reject) {
                        $.get(imagePath).done(function () {
                            var img = new Image();
                            img.src = imagePath;
                            img.onload = function (e) {
                                try {
                                    // The image loaded, so it actually exists! It exists, so display it...
                                    $(imageElement).attr('src', imagePath);

                                    $(imageElement).off('mouseout').mouseout(function (error) {
                                        console.log('In bwActiveMenu.js.xx.lookForImage.mouseout():1.');
                                        this.src = imagePath; // Mouseout replaces the image with the actual one.
                                    });

                                } catch (e) {

                                    console.log('Exception in bwActiveMenu.js.xx.lookForImage.img.onload(): ' + e.message + ', ' + e.stack);

                                    $(imageElement).attr('src', '/images/head_35x35_black.png');

                                    $(imageElement).off('mouseout').mouseout(function (error) {
                                        console.log('In bwActiveMenu.js.xx.lookForImage.mouseout():2.');
                                        this.src = '/images/head_35x35_black.png'; // Mouseout replaces the image with the actual one.
                                    });

                                    reject();
                                }
                            }
                        }).fail(function () {

                            $(imageElement).attr('src', '/images/head_35x35_black.png');

                            $(imageElement).off('mouseout').mouseout(function (error) {
                                console.log('In bwActiveMenu.js.xx.lookForImage.mouseout():3.');
                                this.src = '/images/head_35x35_black.png'; // Mouseout replaces the image with the actual one.
                            });

                            resolve();
                        });
                    });
                }

                var imageElement = $('#bwNotificationSound_UserSettings_Slider_UserImage');
                var smallHeadPath = '/_files/' + workflowAppId + '/participantimages/' + participantId + '/' + 'userimage_50x50px.png';
                lookForImage(imageElement, smallHeadPath);

                //
                // end: This backfills the user small circle icon in the top bar. Trying to standardize this chunk of code so it can be used throughout.
                //







                //
                //
                // NEW DROPZONE FOR PRIORITIES
                //
                //

                //var dropzone = $(document).find('.AddARequestToPriorities_Dropzone')[0];


                //
                // BROWSER COMPATIBILITY FOR DRAG-AND-DROP and RIGHT-CLICK to PASTE.
                //

                // BRAVE has full support:
                //      - Drag and drop to paste (invokes the drop event) - DataTransfer
                //      - Right click to paste (invokes the paste event) - ClipboardData

                // FIREFOX has partial support:
                //      - Drag and drop to paste <<< NO SUPPORT/DOESNT WORK >>> STILL DOESNT WORK AFTER NEW CHANGES TO BACKGROUND IMAGE.
                //      - Right click to paste (invokes the paste event) - ClipboardData

                // FIXED >>> EDGE has full support: The issue was the image!!!! I made it a background-image to circumvent this behaviour. 11-27-2023.
                //      - Drag and drop to paste (invokes the drop event) - DataTransfer
                //      - Right click to paste <<< NO SUPPORT/DOESNT WORK. The right-click context-menu paste option displays but is disabled.

                // FIXED >>> CHROME has full support: The issue was the image!!!! I made it a background-image to circumvent this behaviour. 11-27-2023.
                //      - Drag and drop to paste (invokes the drop event) - DataTransfer
                //      - Right click to paste <<< NO SUPPORT/DOESNT WORK. The right-click context-menu paste option displays but is disabled.

                // SAFARI
                //
                //

                // CHROME on MacOs
                //
                //

                // BRAVE on MacOs
                //
                //
                //

                // READ THIS FIRST: >>>>>>>>> https://www.javascripttutorial.net/web-apis/javascript-drag-and-drop/ <<<<<<<<<<

                //dropzone.addEventListener('dragenter', function (e) {
                //    try {
                //        console.log('In bwActiveMenu.js.renderMenu.dropzone.dragenter().');
                //        //alert('In renderAndPopulateAttachmentsxx.dropzone.dragenter().');
                //        e.preventDefault();
                //    } catch (e) {
                //        var msg = 'Exception in bwActiveMenu.js.renderMenu.dropzone.dragenter(): ' + e.message + ', ' + e.stack;
                //        console.log(msg);
                //        alert(msg);
                //    }
                //});

                //dropzone.addEventListener('dragover', function (e) {
                //    try {
                //        console.log('In bwActiveMenu.js.renderMenu.dropzone.dragover().');
                //        //alert('In renderAndPopulateAttachmentsxx.dropzone.dragover().');
                //        e.preventDefault();
                //    } catch (e) {
                //        var msg = 'Exception in bwActiveMenu.js.renderMenu.dropzone.drop(): ' + e.message + ', ' + e.stack;
                //        console.log(msg);
                //        alert(msg);
                //    }
                //});

                //dropzone.addEventListener('drop', function (e) {
                //    try {
                //        console.log('In bwActiveMenu.js.renderMenu.dropzone.drop().');
                //        //alert('In bwActiveMenu.js.renderMenu.dropzone.drop().');
                //        e.preventDefault();

                //        var gotData;
                //        if (e.clipboardData) {
                //            console.log('In bwActiveMenu.js.renderMenu.dropzone.drop(). Object is event.clipboardData.');
                //            gotData = true;
                //        } else if (e.dataTransfer) {
                //            console.log('In bwActiveMenu.js.renderMenu.dropzone.drop(). Object is event.dataTransfer.');
                //            gotData = true;
                //        } else if (window.clipboardData) {
                //            console.log('In bwActiveMenu.js.renderMenu.dropzone.drop(). Object is window.clipboardData.');
                //            gotData = true;
                //        } else {

                //            if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                //                alert('FIREFOX BROWSER CANNOT DRAG-AND-DROP EXTERNAL FILES. THERE IS A WORK-AROUND: Please right click on your source file, and choose "COPY". Subsequently, right click here and choose "PASTE".');
                //            } else {
                //                alert('Error in bwActiveMenu.js.renderMenu.dropzone.drop(). Could not find a valid DataTransfer object. e: ' + JSON.stringify(e) + ', navigator.userAgent: ' + navigator.userAgent);
                //            }

                //        }

                //        if (gotData == true) {
                //            //thiz.dodrop(e, bwBudgetRequestId);


                //            var sourceElement_bwBudgetRequestId = e.dataTransfer.getData('text/plain');

                //            var destinationElement_bwBudgetRequestId = $(e.target).closest('.budgetrequestform').attr('bwbudgetrequestid');

                //            var html = '';

                //            html += '<table style="width:100%;">';
                //            html += '   <tr>';
                //            html += '       <td style="width:90%;">';
                //            html += '           <span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:30pt;font-weight:bold;">Add to a Priority Group</span>';
                //            html += '           <br />';
                //            html += '       </td>';
                //            html += '       <td style="width:9%;"></td>';
                //            html += '       <td style="width:1%;cursor:pointer;vertical-align:top;">';
                //            html += '           <span class="dialogXButton" style="font-size:30pt;font-weight:bold;" onclick="$(\'#bwRequest_AddSupplementalToRequestDialog\').dialog(\'close\');">X</span>';
                //            html += '       </td>';
                //            html += '   </tr>';
                //            html += '</table>';
                //            html += '<input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';

                //            html += '<table>';
                //            html += '   <tr>';
                //            html += '       <td></td>';
                //            html += '       <td style="text-align:left;">';
                //            html += '           <span id="spanThereAreChangesToPublishText51" style="font-style:italic;color:black;font-size:20pt;">';
                //            //html += '';
                //            html += 'Priority Groups allow you to manage your requests more effectively.';
                //            html += '           </span>'; //<input value=" There are unsaved changes. Enter a description here and click Save..." type="text" id="txtNewWorkflowDescription" style="width:450px;color:grey;font-style:italic;padding:5px 5px 5px 5px;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewWorkflowDescriptionTextBox_Onkeyup\');" />';
                //            html += '       </td>';
                //            html += '       <td></td>';
                //            html += '   </tr>';
                //            html += '</table>';



                //            html += '<table>';
                //            html += '   <tr>';
                //            html += '       <td></td>';
                //            html += '       <td style="text-align:left;">';
                //            html += '           <span id="spanThereAreChangesToPublishText51xx" style="font-style:italic;color:black;font-size:20pt;">';
                //            //html += '';
                //            html += '<input type="checkbox" style="transform: scale(3);" />&nbsp;&nbsp;PriorityGroup1';
                //            html += '           </span>'; //<input value=" There are unsaved changes. Enter a description here and click Save..." type="text" id="txtNewWorkflowDescription" style="width:450px;color:grey;font-style:italic;padding:5px 5px 5px 5px;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewWorkflowDescriptionTextBox_Onkeyup\');" />';
                //            html += '       </td>';
                //            html += '       <td></td>';
                //            html += '   </tr>';
                //            html += '</table>';



                //            html += '<br />';
                //            html += '<div id="bwRequest_PermanentlyDeleteRequestDialog_PermanentlyDeleteRequestxxx" class="divDialogButton" onclick="$(\'.bwRequest\').bwRequest(\'addSupplementalToRequest\', \'' + sourceElement_bwBudgetRequestId + '\', \'' + destinationElement_bwBudgetRequestId + '\');" >';
                //            html += 'Add to Group';
                //            html += '</div>';
                //            html += '<br />';
                //            html += '<div id="bwRequest_PermanentlyDeleteRequestDialog_PermanentlyDeleteRequestxxx" class="divDialogButton" onclick="$(\'.bwRequest\').bwRequest(\'addSupplementalToRequest\', \'' + sourceElement_bwBudgetRequestId + '\', \'' + destinationElement_bwBudgetRequestId + '\');" >';
                //            html += 'Create new Group';
                //            html += '</div>';
                //            html += '<br />';
                //            html += '<div class="divDialogButton" onclick="$(\'#bwRequest_AddSupplementalToRequestDialog\').dialog(\'close\');">';
                //            html += 'Close/Cancel';
                //            html += '</div>';
                //            html += '<br /><br />';

                //            var div = document.getElementById('bwRequest_AddSupplementalToRequestDialog');

                //            if (!div) {
                //                div = document.createElement('div');
                //                div.id = 'bwRequest_AddSupplementalToRequestDialog';
                //                div.style.display = 'none';
                //                document.body.appendChild(div); // to place at end of document
                //            }
                //            div.innerHTML = html;

                //            $("#bwRequest_AddSupplementalToRequestDialog").dialog({
                //                modal: false,
                //                resizable: false,
                //                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                //                position: {
                //                    my: "middle top+12",
                //                    at: "middle top",
                //                    of: window
                //                },
                //                width: '1200',
                //                dialogClass: 'no-close', // No close button in the upper right corner.
                //                hide: false, // This means when hiding just disappear with no effects.
                //                open: function () {
                //                    try {

                //                    } catch (e) {
                //                        console.log('Exception in xx.bwRequest_AddSupplementalToRequestDialog.open(): ' + e.message + ', ' + e.stack);
                //                        displayAlertDialog('Exception in xx.bwRequest_AddSupplementalToRequestDialog.open(): ' + e.message + ', ' + e.stack);
                //                    }
                //                },
                //                close: function () {
                //                    $('#bwRequest_AddSupplementalToRequestDialog').dialog('destroy');
                //                }

                //            });
                //            //$('#divConfigureBusinessModelNotificationsDialog2-1').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();

                //        } else {
                //            alert('Error in bwActiveMenu.js.renderMenu.dropzone.drop(). Could not find a valid DataTransfer object.');
                //        }

                //    } catch (e) {
                //        var msg = 'Exception in bwActiveMenu.js.renderMenu.dropzone.drop(): ' + e.message + ', ' + e.stack;
                //        console.log(msg);
                //        alert(msg);
                //    }
                //});

                ////dropzone.addEventListener('paste', function (e) {
                ////    try {
                ////        console.log('In renderAndPopulateAttachments.dropzone.paste().');
                ////        alert('In renderAndPopulateAttachments.dropzone.paste().');
                ////        e.preventDefault();

                ////        var gotData;
                ////        if (e.clipboardData) {
                ////            console.log('In renderAndPopulateAttachments.dropzone.paste(). Object is event.clipboardData.');
                ////            gotData = true;
                ////        } else if (e.dataTransfer) {
                ////            console.log('In renderAndPopulateAttachments.dropzone.paste(). Object is event.dataTransfer.');
                ////            gotData = true;
                ////        } else if (window.clipboardData) {
                ////            console.log('In renderAndPopulateAttachments.dropzone.paste(). Object is window.clipboardData.');
                ////            gotData = true;
                ////        } else {

                ////            if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                ////                alert('FIREFOX BROWSER CANNOT DRAG-AND-DROP EXTERNAL FILES. THERE IS A WORK-AROUND: Please right click on your source file, and choose "COPY". Subsequently, right click here and choose "PASTE".');
                ////            } else {
                ////                alert('Error in bwAttachments.js.dropzone.paste(). Could not find a valid DataTransfer object. e: ' + JSON.stringify(e) + ', navigator.userAgent: ' + navigator.userAgent);
                ////            }

                ////        }

                ////        if (gotData == true) {
                ////            thiz.dodrop(e, bwBudgetRequestId);
                ////        } else {
                ////            alert('Error in bwAttachments.js.dropzone.paste(). Could not find a valid DataTransfer object.');
                ////        }

                ////    } catch (e) {
                ////        var msg = 'Exception in bwAttachments.js.dropzone.paste(): ' + e.message + ', ' + e.stack;
                ////        console.log(msg);
                ////        alert(msg);
                ////    }
                ////});











                //
                //
                // emd: NEW DROPZONE FOR PRIORITIES
                //
                //


            }

        } catch (e) {
            console.log('Exception in bwActiveMenu.js.renderMenu(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu.js.renderMenu(): ' + e.message + ', ' + e.stack);
        }
    },


    saveNewRequestIfItIsBeingDisplayed: function () {
        //var thiz = this;
        return new Promise(function (resolve, reject) {
            try {
                console.log('In bwActiveMenu.js.saveNewRequestIfItIsBeingDisplayed().');

                var newRequestForm = $('#divPageContent1').find('.budgetrequestform');
                if (newRequestForm) {

                    var bwrequesttitle = $(newRequestForm).attr('bwrequesttitle');
                    var bwBudgetRequestId = $(newRequestForm).attr('bwbudgetrequestid');

                    if ((bwrequesttitle == 'New') && bwBudgetRequestId) {

                        console.log('In bwActiveMenu.js.saveNewRequestIfItIsBeingDisplayed(). NAVIGATING AWAY FROM THE NEW REQUEST SCREEN, SO CACHING THE data entry so the user doesn\'t lose anything.');

                        // As we do in the index.js.timedCheckForAlertsForIosBadgeUpdateUsingTitle() and bwRequest.js.populateNewRequestForm() methods, we first save anything the user has entered into the NEW REQUEST form.
                        $('.bwRequest:first').bwRequest('scrapeBwRequestJson', bwBudgetRequestId).then(function (results) {
                            try {

                                if (results.status != 'SUCCESS') {

                                    var msg = 'Error in bwActiveMenu.js.saveNewRequestIfItIsBeingDisplayed():2. ' + results.status + ': ' + results.message;
                                    console.log(msg);
                                    displayAlertDialog(msg);

                                    var result = {
                                        status: 'ERROR',
                                        message: msg
                                    }

                                    reject(result);

                                } else {

                                    //var errorElement = $(newRequestForm).find('#spanRequestForm_Error')[0];
                                    //if (errorElement) {
                                    //    $(errorElement).html('Saving...');
                                    //    setTimeout(function () {
                                    //        $(errorElement).html('&nbsp;');
                                    //    }, 4000);
                                    //} else {
                                    //    alert('xcx1231231 UPDATING/SAVING bwRequestJson: ' + JSON.stringify(results.bwRequestJson));
                                    //}

                                    $('.bwAuthentication').bwAuthentication('option', 'NEW_REQUEST_LastSavedJson', results.bwRequestJson); // Save the value.

                                    displayAlertDialog_QuickNotice('The New Request was saved');

                                    var result = {
                                        status: 'SUCCESS',
                                        message: 'In bwActiveMenu.js.saveNewRequestIfItIsBeingDisplayed(). Saved the New Request, because the user has navigated away from the New Request screen. Their work is saved and will be there when they come back.'
                                    }

                                    resolve(result);

                                }

                            } catch (e) {

                                var msg = 'Exception in bwActiveMenu.js.saveNewRequestIfItIsBeingDisplayed():3: ' + e.message + ', ' + e.stack;

                                console.log(msg);
                                displayAlertDialog(msg);

                                var result = {
                                    status: 'EXCEPTION',
                                    message: msg
                                }

                                reject(result);

                            }

                        }).catch(function (e) {

                            var msg = 'Exception in bwActiveMenu.js.saveNewRequestIfItIsBeingDisplayed():2: ' + JSON.stringify(e);

                            console.log(msg);
                            displayAlertDialog(msg);

                            var result = {
                                status: 'EXCEPTION',
                                message: msg
                            }

                            reject(result);

                        });

                    } else {

                        var result = {
                            status: 'SUCCESS',
                            message: 'In bwActiveMenu.js.saveNewRequestIfItIsBeingDisplayed(). The New Request screen was not being displayed, so we didn\'t have to save anything.'
                        }

                        resolve(result);

                    }

                } else {

                    var result = {
                        status: 'SUCCESS',
                        message: 'In bwActiveMenu.js.saveNewRequestIfItIsBeingDisplayed(). The New Request screen was not being displayed, so we didn\'t have to save anything.'
                    }

                    resolve(result);

                }

            } catch (e) {

                var msg = 'Exception in bwActiveMenu.js.saveNewRequestIfItIsBeingDisplayed(): ' + e.message + ', ' + e.stack;

                console.log(msg);
                displayAlertDialog(msg);

                var result = {
                    status: 'EXCEPTION',
                    message: msg
                }

                reject(result);

            }
        });
    },

    RenderContentForButton: function (element, button, source) {
        try {
            console.log('In bwActiveMenu.js.RenderContentForButton(): ' + button + '. DEV: This function could be cleaned up a bit. xcx9948576-1.');
            //alert('In bwActiveMenu.js.RenderContentForButton(). button: ' + button + ', source: ' + source + '. DEV: This function could be cleaned up a bit. xcx9948576-1.');
            var thiz = this;

            //localStorage.setItem('subsequentaction', ''); // This is important, so that this method doesn't get called from bwAuthentication.js.logonWith_BudgetWorkflow_autologon(). Anywhere else? 8-3-2024.

            if (button == 'REPORT_AN_ERROR') {

                //
                // This just shows a dialog, it doesn't change the screen.
                //

                $('.bwCoreComponent').bwCoreComponent('reportAnErrorOrMakeASuggestion');

            } else {

                //
                //
                // We have to check if we are navigating away from the New Request screen. If we are, we have to save everything the user has entered to this point so that it is there when they come back.
                //
                //

                this.saveNewRequestIfItIsBeingDisplayed().then(function (results) {
                    try {

                        if (results.status != 'SUCCESS') {

                            var msg = 'Error in bwActiveMenu.js.RenderContentForButton(). Returned from saveNewRequestIfItIsBeingDisplayed() with an error: ' + results.message;
                            console.log(msg);
                            displayAlertDialog(msg);

                        } else {

                            //
                            // These buttons change the screen, so there are some things we need to do first.
                            //

                            $('canvas').remove('.canvasBwBusinessModelEditor'); // Clear the business model editor canvas.

                            var canvas = document.getElementById("myCanvas");
                            if (canvas) {
                                var ctx = canvas.getContext("2d");
                                ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines
                                canvas.style.zIndex = -1;
                            }

                            window.scrollTo(0, 0); // Scroll to top on button click. This makes sure things render Ok, and also just seems like a nicer user experience.
                            //$('.bwActiveMenu').bwActiveMenu('adjustLeftSideMenu', 'xcx121456', true); // This makes sure our stretchy-left-menu redraws Ok.
                            //thiz.adjustLeftSideMenu('xcx1214563', true);

                            // Clear any error message in the top bar.
                            $('#divTopBar_Long_Error').html('');

                            try {
                                $('#FormsEditorToolbox').dialog('close');
                            } catch (e) { }

                            $('#bwQuickLaunchMenuTd').css({
                                width: '0'
                            }); // This gets rid of the jumping around.

                            $('#divPageContent1').html('');

                            //thiz.unshrinkLeftMenu('xcx34234663');

                            switch (button) {

                                case 'HOME_UNAUTHENTICATED':

                                    //thiz.unshrinkLeftMenu('xcx34234663-1');
                                    thiz.renderHomePageContent_Unauthenticated();

                                    break;

                                case 'ABOUT':

                                    thiz.renderAboutScreen();

                                    break;

                                case 'THIS_SOFTWARE':

                                    thiz.renderThisSoftwareScreen();

                                    break;

                                case 'DOCUMENTATION':

                                    thiz.renderDocumentationScreen();

                                    break;

                                case 'HOME':

                                    console.log('bwActiveMenu.js.RenderContentForButton(). THIS IS THE ONLY PLACE WHERE WE DISPLAY THE HOME SCREEN. source: ' + source);
                                    thiz.shrinkLeftMenu('xcx34234663-2');

                                    //document.body.requestFullscreen().then(function () {

                                    //    displayAlertDialog('requestFullscreen() WORKS!!');

                                    //}).catch(function (e) {

                                    //    displayAlertDialog('ERROR IN requestFullscreen(): ' + JSON.stringify(e));

                                    //})

                                    var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
                                    var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

                                    // Step 1: Make all of the buttons un-selected.
                                    $('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                                        $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
                                        $(this).addClass(workflowAppTheme).removeClass('bwMenuButton_Selected');
                                    });

                                    // Step 2: Set the specified button as the selected one.
                                    $('#divWelcomeButton').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);
                                    $('#divWelcomeButton').addClass('bwMenuButton_Selected');

                                    thiz.initializeUserInterface();

                                    break;

                                case 'NEW_REQUEST':

                                    var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
                                    var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

                                    // Step 1: Make all of the buttons un-selected.
                                    $('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                                        $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
                                        $(this).addClass(workflowAppTheme).removeClass('bwMenuButton_Selected');
                                    });

                                    // Step 2: Set the specified button as the selected one.
                                    $('#divNewRequestButton').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);
                                    $('#divNewRequestButton').addClass('bwMenuButton_Selected');

                                    console.log('In bwActiveMenu.js.RenderContentForButton(). Calling displayCreateRequestForm().');
                                    $('.bwRequest').bwRequest('displayCreateRequestForm');

                                    break;

                                case 'ALL_REQUESTS':

                                    var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
                                    var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

                                    // Step 1: Make all of the buttons un-selected.
                                    $('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                                        $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
                                        $(this).addClass(workflowAppTheme).removeClass('bwMenuButton_Selected');
                                    });

                                    // Step 2: Set the specified button as the selected one.
                                    $('#divArchiveButton').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);
                                    $('#divArchiveButton').addClass('bwMenuButton_Selected');

                                    var html = '';
                                    html += '<div id="spanBwBudgetRequests"></div>';
                                    $('#divPageContent1').html(html);

                                    $('#spanBwBudgetRequests').bwDataGrid({}); // This creates the new instance.

                                    break;

                                case 'TRACK_SPENDING2':

                                    var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
                                    var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

                                    // Step 1: Make all of the buttons un-selected.
                                    $('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                                        $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
                                        $(this).addClass(workflowAppTheme).removeClass('bwMenuButton_Selected');
                                    });

                                    // Step 2: Set the specified button as the selected one.
                                    $('#divVisualizationsButton').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);
                                    $('#divVisualizationsButton').addClass('bwMenuButton_Selected');

                                    var div2 = document.getElementById('bwTrack1'); // 4-1-2020 12-28pm adt.

                                    if (div2) {

                                        alert('xcx31234235 Element bwTrack1 already exists. This is unexpected.');

                                    } else {

                                        div2 = document.createElement('div');
                                        div2.id = 'bwTrack1';
                                        document.getElementById('divPageContent1').appendChild(div2); // to place at end of document

                                        $('#bwTrack1').bwTrack({});

                                    }

                                    break;

                                case 'MESSAGING2':

                                    var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
                                    var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

                                    // Step 1: Make all of the buttons un-selected.
                                    $('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                                        $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
                                        $(this).addClass(workflowAppTheme).removeClass('bwMenuButton_Selected');
                                    });

                                    // Step 2: Set the specified button as the selected one.
                                    $('#divMessagingButton').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);
                                    $('#divMessagingButton').addClass('bwMenuButton_Selected');

                                    var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');

                                    // Select the button here. 
                                    var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

                                    // Step 1: Make all of the buttons un-selected.
                                    $('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                                        $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
                                        $(this).addClass(workflowAppTheme).removeClass('bwMenuButton_Selected');
                                    });

                                    // Step 2: Set the "MESSAGING" button as the selected one.
                                    $('#divMessagingButton').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);

                                    var div2 = document.getElementById('bwEmailClient_Haraka1'); // 4-1-2020 12-28pm adt.

                                    if (div2) {

                                        alert('xcx31234235 Element bwEmailClient_Haraka1 already exists. This is unexpected.');

                                    } else {

                                        div2 = document.createElement('div');
                                        div2.id = 'bwEmailClient_Haraka1';
                                        document.getElementById('divPageContent1').appendChild(div2); // to place at end of document

                                        console.log('In RenderContentForButton(MESSAGING2). xcx31234235 Instantiating bwEmailClient_Haraka().');
                                        console.log('In RenderContentForButton(MESSAGING2). xcx31234235 Instantiating bwEmailClient_Haraka().');
                                        console.log('In RenderContentForButton(MESSAGING2). xcx31234235 Instantiating bwEmailClient_Haraka().');
                                        //alert('In RenderContentForButton(MESSAGING2). xcx31234235 Instantiating bwEmailClient_Haraka().');

                                        $('#bwEmailClient_Haraka1').bwEmailClient_Haraka({});

                                    }

                                    break;

                                case 'VIEW_CALENDAR':

                                    var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
                                    var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

                                    // Step 1: Make all of the buttons un-selected.
                                    $('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                                        $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
                                        $(this).addClass(workflowAppTheme).removeClass('bwMenuButton_Selected');
                                    });

                                    // Step 2: Set the specified button as the selected one.
                                    $('#divCalendarButton').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);
                                    $('#divCalendarButton').addClass('bwMenuButton_Selected');

                                    var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');

                                    // Select the button here. 
                                    var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

                                    // Step 1: Make all of the buttons un-selected.
                                    $('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                                        $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
                                        $(this).addClass(workflowAppTheme).removeClass('bwMenuButton_Selected');
                                    });

                                    // Step 2: Set the "MESSAGING" button as the selected one.
                                    $('#divCalendarButton').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);

                                    var div2 = document.getElementById('bwCalendar1'); // 4-1-2020 12-28pm adt.

                                    if (div2) {

                                        alert('xcx31234235 Element bwCalendar1 already exists. This is unexpected.');

                                    } else {

                                        div2 = document.createElement('div');
                                        div2.id = 'bwCalendar1';
                                        div2.style.maxWidth = '98%';
                                        document.getElementById('divPageContent1').appendChild(div2); // to place at end of document

                                        console.log('In RenderContentForButton(MESSAGING2). xcx31234235 Instantiating bwEmailClient_Haraka().');
                                        console.log('In RenderContentForButton(MESSAGING2). xcx31234235 Instantiating bwEmailClient_Haraka().');
                                        console.log('In RenderContentForButton(MESSAGING2). xcx31234235 Instantiating bwEmailClient_Haraka().');
                                        //alert('In RenderContentForButton(MESSAGING2). xcx31234235 Instantiating bwEmailClient_Haraka().');

                                        //var calendarInstance1 = new calendarJs("bwCalendar1", {
                                        //    exportEventsEnabled: true,
                                        //    openInFullScreenMode: false,
                                        //    fullScreenModeEnabled: false,
                                        //    useLocalStorageForEvents: true,
                                        //    //manualEditingEnabled: true,
                                        //    organizerName: 'Todd Hiltz',
                                        //    organizerEmailAddress: 'todd@budgetworkflow.com',
                                        //    useEscapeKeyToExitFullScreenMode: true,
                                        //    startOfWeekDay: 6
                                        //});

                                        var calendarInstance1 = new calendarJs("bwCalendar1", {
                                            showAllDayEventDetails: true,
                                            //isWidget: true,
                                            showAllDayEventDetails: true,
                                            allowHtmlInDisplay: true, // default false
                                            tooltipDelay: 100,
                                            eventTooltipDelay: 100,
                                            exportEventsEnabled: true,
                                            openInFullScreenMode: false,
                                            fullScreenModeEnabled: false,
                                            useLocalStorageForEvents: true,
                                            manualEditingEnabled: true,
                                            organizerName: 'Todd Hiltz',
                                            organizerEmailAddress: 'todd@budgetworkflow.com',
                                            useEscapeKeyToExitFullScreenMode: true,
                                            startOfWeekDay: 6,
                                            useAmPmForTimeDisplays: true,
                                            views: {
                                                fullMonth: {
                                                    //useOnlyDotEvents: true, // ??????????????????????? to save space defaults to false??
                                                    minimumDayHeight: 100,
                                                    showTimesInEvents: true,
                                                    allowEventScrolling: true,
                                                    maximumEventsPerDayDisplay: 0, // 0 disables the limit.
                                                    isPinUpViewEnabled: true,
                                                    pinUpViewImageUrls: [
                                                        "https://calendar-js.com/images/top.jpg",
                                                        "https://sleeplessocean.com/images/background.jpg"
                                                    ]
                                                }
                                            }
                                        });


                                        div2 = document.createElement('div');
                                        div2.id = 'bwCalendar2';
                                        div2.style.maxWidth = '98%';
                                        document.getElementById('divPageContent1').appendChild(div2); // to place at end of document

                                        var calendarInstance2 = new calendarJs("bwCalendar2", {
                                            viewToOpenOnFirstLoad: 'all-events', // 
                                            showAllDayEventDetails: true,
                                            //isWidget: true,
                                            showAllDayEventDetails: true,
                                            allowHtmlInDisplay: true, // default false
                                            tooltipDelay: 100,
                                            eventTooltipDelay: 100,
                                            exportEventsEnabled: true,
                                            openInFullScreenMode: false,
                                            fullScreenModeEnabled: false,
                                            useLocalStorageForEvents: true,
                                            manualEditingEnabled: true,
                                            organizerName: 'Todd Hiltz',
                                            organizerEmailAddress: 'todd@budgetworkflow.com',
                                            useEscapeKeyToExitFullScreenMode: true,
                                            startOfWeekDay: 6,
                                            useAmPmForTimeDisplays: true,
                                            views: {
                                                fullMonth: {
                                                    //useOnlyDotEvents: true, // ??????????????????????? to save space defaults to false??
                                                    minimumDayHeight: 100,
                                                    showTimesInEvents: true,
                                                    allowEventScrolling: true,
                                                    maximumEventsPerDayDisplay: 0, // 0 disables the limit.
                                                    isPinUpViewEnabled: true,
                                                    pinUpViewImageUrls: [
                                                        "https://calendar-js.com/images/top.jpg",
                                                        "https://sleeplessocean.com/images/background.jpg"
                                                    ]
                                                }
                                            }
                                        });

                                        thiz.adjustLeftSideMenu();
                                        thiz.shrinkLeftMenu(); // unshrinkLeftMenu // 11-24-2024.





                                    }

                                    break;

                                case 'CONFIGURATION2':

                                    var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
                                    var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

                                    // Step 1: Make all of the buttons un-selected.
                                    $('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                                        $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
                                        $(this).addClass(workflowAppTheme).removeClass('bwMenuButton_Selected');
                                    });

                                    // Step 2: Set the specified button as the selected one.
                                    $('#divConfigurationButton').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);
                                    $('#divConfigurationButton').addClass('bwMenuButton_Selected');

                                    var div2 = document.getElementById('bwConfiguration1'); // 4-1-2020 12-28pm adt.

                                    if (div2) {

                                        alert('xcx31234235 Element bwConfiguration1 already exists. This is unexpected.');

                                    } else {

                                        div2 = document.createElement('div');
                                        div2.id = 'bwConfiguration1';
                                        document.getElementById('divPageContent1').appendChild(div2); // to place at end of document

                                        $('#bwConfiguration1').bwConfiguration({});

                                    }

                                    break;

                                case 'FOREST_ADMIN':

                                    var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                                    //window.location.href = 'https://budgetworkflow.com/admin2.html';
                                    window.location.href = 'https://shareandcollaborate.com/admin.html' + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier; // auto login 6-14-2024.

                                    break;

                                //
                                //
                                // The rest of these are exprimental and viewable when "Development" mode is turned on in Configuration > Organization Settings.
                                //
                                //

                                case 'EMAIL_CLIENT_BUTTON':

                                    $('#divPageContent1').bwEmailClient({}); // This creates the new instance.

                                    break;

                                case 'USER':

                                    $('.bwAuthentication').bwAuthentication('displayLoggedInUserDropDownInACircle', true);

                                    break;

                                case 'PRINT':

                                    $('#divBwPrintButton').bwPrintButton('PrintMyPendingTasksReport');

                                    break;

                                case 'VIEW_MOBILE_VERSION':

                                    $('.bwAuthentication').bwAuthentication('logonWith_BudgetWorkflow_SwitchToMobileVersion');

                                    break;

                                case 'TILE_AND_BALLOON_WINDOWS':

                                    $('.bwCoreComponent').bwCoreComponent('tileTheDialogs');

                                    break;

                                case 'LIVE_STATUS':

                                    window.location.href = 'https://shareandcollaborate.com/livestatus.html';

                                    break;

                                case 'DONATE':

                                    $('.bwDonate').bwDonate('displayDonationDialog');

                                    break;

                                //
                                //
                                // end: The rest of these are exprimental and viewable when "Development" mode is turned on in Configuration > Organization Settings.
                                //
                                //

                                default:

                                    break;

                            }

                        }

                    } catch (e) {
                        console.log('Exception in bwActiveMenu.js.RenderContentForButton():3: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwActiveMenu.js.RenderContentForButton():3: ' + e.message + ', ' + e.stack);
                    }

                }).catch(function (e) {
                    console.log('Exception in bwActiveMenu.js.RenderContentForButton():2: ' + JSON.stringify(e));
                    displayAlertDialog('Exception in bwActiveMenu.js.RenderContentForButton():2: ' + JSON.stringify(e));
                });

            }

        } catch (e) {
            console.log('Exception in bwActiveMenu.js.RenderContentForButton(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu.js.RenderContentForButton(): ' + e.message + ', ' + e.stack);
        }
    },

    RenderContentForInnerLeftMenuButtons: function (buttonElement, button) {
        try {
            console.log('In bwActiveMenu.js.RenderContentForInnerLeftMenuButtons(). button: ' + button);
            //alert('In bwActiveMenu.js.RenderContentForInnerLeftMenuButtons(). button: ' + button);
            var thiz = this;

            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            $('canvas').remove('.canvasBwBusinessModelEditor'); // Clear the business model editor canvas.

            window.scrollTo(0, 0); // Scroll to top on button click. This makes sure things render Ok, and also just seems like a nicer user experience.
            $('.bwActiveMenu').bwActiveMenu('adjustLeftSideMenu', 'xcx2133123', true); // This makes sure our new stretchy-left-menu redraws Ok.

            $('#divPageContent2_Title').html('');




            // THIS IS THE SECOND TIME WE ARE USING setTimeout for the call to bwActiveMenu_Admin.adjustLeftSideMenu(). 4-25-2022
            setTimeout(function () { // Only needs to happen for Chrome.
                // menu should be re-done since the display has probably resized from the display of the email.
                console.log('Calling bwActiveMenu_Admin.adjustLeftSideMenu(). xcx123423521-2.');
                $('.bwActiveMenu').bwActiveMenu('adjustLeftSideMenu', 'xcx212233', true);
            }, 7000);



            ////
            //// Ensure the correct left menu button is selected. We do this with the them_SelectedButton classes. For example: brushedAluminum_green_SelectedButton
            ////
            //var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
            //var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

            //// Step 1: Make all of the buttons un-selected.
            //$('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
            //    $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
            //});

            ////$('#tableMainMenu3').find('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
            ////    $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
            ////});
            //alert('xcx5554 In RenderContentForInnerLeftMenuButtons(). Set the specified button as the selected one.');

            //// Step 2: Set the specified button as the selected one.
            //var x = $(element).hasClass('leftButton');
            //if (x == true) {
            //    //debugger;
            //    $(element).addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);
            //} else {
            //    console.log('In $(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForButton\', ). Error: Unable to locate class leftButton. xcx2');
            //    //alert('In $(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForButton\', ). Error: Unable to locate class leftButton. xcx2');
            //}





            switch (button) {

                case 'PERSONAL_BEHAVIOR':

                    $('#bwQuickLaunchMenuTd').css({
                        width: '0'
                    }); // This gets rid of the jumping around.

                    try {
                        $('#FormsEditorToolbox').dialog('close');
                    } catch (e) { }

                    $('#divPageContent2_Title').html('PERSONAL SETTINGS');

                    this.renderConfigurationPersonalBehavior().then(function (results) {

                        try {

                            console.log('xcx231243-8. Getting workflowAppTheme.');
                            console.log('xcx231243-8. Getting workflowAppTheme.');
                            console.log('xcx231243-8. Getting workflowAppTheme.');
                            //alert('xcx231243-8. Getting workflowAppTheme.');
                            var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
                            var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

                            // Make all of the buttons un-selected.
                            $('.bwConfiguration:first').find('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                                $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
                                $(this).addClass(workflowAppTheme).removeClass('bwMenuButton_Selected');
                            });

                            // Set the specified button as the selected one.
                            $('#divInnerLeftMenuButton_PersonalBehavior').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);
                            $('#divInnerLeftMenuButton_PersonalBehavior').addClass('bwMenuButton_Selected');




                            // xcx232144-1.
                            var personalSettingsButton = document.getElementById('divInnerLeftMenuButton_PersonalBehavior');
                            var height = Number(personalSettingsButton.style.height.split('px')[0]);

                            console.log('xcxs21321312 >>> SETTING personalSettingsButton OriginalHeight to: ' + height);
                            //alert('xcxs21321312 >>> SETTING personalSettingsButton OriginalHeight to: ' + height);

                            //$('.bwActiveMenu').bwActiveMenu('option', 'divInnerLeftMenuButton_PersonalBehavior_OriginalHeight', height);

                            thiz.option.divInnerLeftMenuButton_PersonalBehavior_OriginalHeight = height;





                        } catch (e) {

                            var msg = 'Exception in bwActiveMenu.js.RenderContentForInnerLeftMenuButtons(): ' + e.message + ', ' + e.stack;
                            console.log(msg);
                            displayAlertDialog(msg);

                        }

                    }).catch(function (e) {

                        var msg = 'Exception in bwActiveMenu.js.RenderContentForInnerLeftMenuButtons(): ' + JSON.stringify(e);
                        console.log(msg);
                        displayAlertDialog(msg);

                    })

                    break;

                case 'ORGANIZATION':

                    $('#bwQuickLaunchMenuTd').css({
                        width: '0'
                    }); // This gets rid of the jumping around.

                    try {
                        $('#FormsEditorToolbox').dialog('close');
                    } catch (e) { }

                    $('#divPageContent2_Title').html('ORGANIZATION');

                    $('#divPageContent3').html('');

                    $('.bwOrganizationEditor').bwOrganizationEditor('loadBusinessModelEditor', true).then(function (results) {

                        try {

                            console.log('xcx231243-9. Getting workflowAppTheme.');
                            console.log('xcx231243-9. Getting workflowAppTheme.');
                            console.log('xcx231243-9. Getting workflowAppTheme.');
                            //alert('xcx231243-9. Getting workflowAppTheme.');
                            var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
                            var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

                            // Make all of the buttons un-selected.
                            $('.bwConfiguration:first').find('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                                $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
                                $(this).addClass(workflowAppTheme).removeClass('bwMenuButton_Selected');
                            });

                            // Set the specified button as the selected one.
                            $('#divInnerLeftMenuButton_Organization').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);
                            $('#divInnerLeftMenuButton_Organization').addClass('bwMenuButton_Selected');

                        } catch (e) {

                            var msg = 'Exception in bwActiveMenu.js.RenderContentForInnerLeftMenuButtons(): ' + e.message + ', ' + e.stack;
                            console.log(msg);
                            displayAlertDialog(msg);

                        }
                    }).catch(function (e) {

                        var msg = 'Exception in bwActiveMenu.js.RenderContentForInnerLeftMenuButtons(): ' + JSON.stringify(e);
                        console.log(msg);
                        displayAlertDialog(msg);

                    });

                    break;

                case 'ROLES':

                    $('#bwQuickLaunchMenuTd').css({
                        width: '0'
                    }); // This gets rid of the jumping around.

                    try {
                        $('#FormsEditorToolbox').dialog('close');
                    } catch (e) { }

                    var canvas = document.getElementById("myCanvas");
                    var ctx = canvas.getContext("2d");
                    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines

                    $('#divPageContent2_Title').html('ROLES');

                    $('#divPageContent3').empty(); // Clear the div and rebuild it with out new 'Departments' title.

                    var html = '';
                    html += '<div id="divBwRolesEditor"></div>';
                    $('#divPageContent3').append(html);

                    // Render the RACI role editor.
                    $('.bwCoreComponent').bwCoreComponent('renderBwRoles', 'divBwRolesEditor'); // THIS DISPLAYS the roles that are in the JSON org definition.

                    console.log('xcx231243-10. Getting workflowAppTheme.');
                    console.log('xcx231243-10. Getting workflowAppTheme.');
                    console.log('xcx231243-10. Getting workflowAppTheme.');
                    //alert('xcx231243-10. Getting workflowAppTheme.');
                    var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
                    var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

                    // Make all of the buttons un-selected.
                    $('.bwConfiguration:first').find('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                        $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
                        $(this).addClass(workflowAppTheme).removeClass('bwMenuButton_Selected');
                    });

                    // Set the specified button as the selected one.
                    $('#divInnerLeftMenuButton_Roles').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);
                    $('#divInnerLeftMenuButton_Roles').addClass('bwMenuButton_Selected');

                    break;

                case 'PARTICIPANTS':

                    $('#bwQuickLaunchMenuTd').css({
                        width: '0'
                    }); // This gets rid of the jumping around.

                    try {
                        $('#FormsEditorToolbox').dialog('close');
                    } catch (e) { }

                    $('#divPageContent2_Title').html('PARTICIPANTS');

                    $('#divPageContent3').empty(); // Clear the div and rebuild it with out new 'Departments' title.

                    var html = '';
                    html += '<div id="divBwParticipantsEditor"></div>';
                    $('#divPageContent3').append(html);

                    var options = {
                        displayWorkflowPicker: true,
                        bwTenantId: tenantId,
                        bwWorkflowAppId: workflowAppId,
                        bwEnabledRequestTypes: bwEnabledRequestTypes
                    };
                    var $bwparticipantseditor = $("#divBwParticipantsEditor").bwParticipantsEditor(options);

                    console.log('xcx231243-11. Getting workflowAppTheme.');
                    console.log('xcx231243-11. Getting workflowAppTheme.');
                    console.log('xcx231243-11. Getting workflowAppTheme.');
                    //alert('xcx231243-11. Getting workflowAppTheme.');
                    var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
                    var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

                    // Make all of the buttons un-selected.
                    $('.bwConfiguration:first').find('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                        $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
                        $(this).addClass(workflowAppTheme).removeClass('bwMenuButton_Selected');
                    });

                    // Set the specified button as the selected one.
                    $('#divInnerLeftMenuButton_Participants').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);
                    $('#divInnerLeftMenuButton_Participants').addClass('bwMenuButton_Selected');

                    break;

                case 'INVENTORY':

                    $('#bwQuickLaunchMenuTd').css({
                        width: '0'
                    }); // This gets rid of the jumping around.

                    try {
                        $('#FormsEditorToolbox').dialog('close');
                    } catch (e) { }

                    var canvas = document.getElementById("myCanvas");
                    if (canvas) {
                        var ctx = canvas.getContext("2d");
                        ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines
                        canvas.style.zIndex = -1;
                    }

                    $('#divPageContent3').empty(); // Clear the div and rebuild it with out new 'Departments' title.

                    $('#divPageContent2_Title').html('INVENTORY');

                    var html = '';
                    html += '<div id="divBwInventory"></div>';
                    $('#divPageContent3').append(html);

                    //
                    // We need to be checking if the bwAdvancedProductSearch.js widget is already instantiated. This is the only widget that works this way, because when it is first invoked, 
                    // we only want to load inventory once, then refer back to it on an ongoing basis on the client side. 4-4-2023
                    //

                    if ($('.bwAdvancedProductSearch').length && ($('.bwAdvancedProductSearch').length > 0)) {

                        // It has already been instantiated.
                        console.log('In index.js.renderConfigurationInventory(). bwAdvancedProductSearch.js widget has already been instantiated. xcx21312341');

                        $('.bwAdvancedProductSearch').bwAdvancedProductSearch('renderConfigurationInventoryScreen', 'divBwInventory');

                    } else {

                        // We have to instantiate it.
                        console.log('');
                        console.log('WE HAVE TO INSTANTIATE THE bwAdvancedProductSearch WIDGET. xcx21312341');
                        console.log('');

                        var BWCustomer = {
                            "CustomerIdentifier": "xx",
                            "Description": "xx_BW CO.",
                            "Level": 2,
                            "LevelDescription": "2",
                            "City": "NOVA SCOTIA",
                            "State": "NS",
                            "CurrencyCode": "CAD",
                            "CompanyNumber": "xx",
                            "SellingChannel": "BwSellingChannel",
                            "ERP": "BW1"
                        }

                        var options = {
                            SearchingForModule: 'Distributor',
                            ERP: 'BW1',
                            BWCustomer: BWCustomer,
                            DisplayConfigurationInventory: true
                        };
                        var $bwinventory = $("#divBwInventory").bwAdvancedProductSearch(options);

                    }

                    console.log('xcx231243-12. Getting workflowAppTheme.');
                    console.log('xcx231243-12. Getting workflowAppTheme.');
                    console.log('xcx231243-12. Getting workflowAppTheme.');
                    //alert('xcx231243-12. Getting workflowAppTheme.');
                    var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
                    var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

                    // Make all of the buttons un-selected.
                    $('.bwConfiguration:first').find('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                        $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
                        $(this).addClass(workflowAppTheme).removeClass('bwMenuButton_Selected');
                    });

                    // Set the specified button as the selected one.
                    $('#divInnerLeftMenuButton_Inventory').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);
                    $('#divInnerLeftMenuButton_Inventory').addClass('bwMenuButton_Selected');

                    break;

                case 'WORKFLOW_AND_EMAIL':

                    $('#bwQuickLaunchMenuTd').css({
                        width: '0'
                    }); // This gets rid of the jumping around.

                    try {
                        $('#FormsEditorToolbox').dialog('close');
                    } catch (e) { }

                    var canvas = document.getElementById("myCanvas");
                    if (canvas) {
                        var ctx = canvas.getContext("2d");
                        ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines
                        canvas.style.zIndex = -1;
                    }

                    $('#divPageContent3').empty(); // Clear the div and rebuild it with out new 'Departments' title.

                    $('#divPageContent2_Title').html('WORKFLOWS');

                    var html = '';
                    html += '<div id="divWorkflowEditor"></div>';
                    $('#divPageContent3').append(html);

                    var options = {
                        displayWorkflowPicker: true,
                        bwTenantId: tenantId,
                        bwWorkflowAppId: workflowAppId,
                        bwEnabledRequestTypes: bwEnabledRequestTypes
                    };
                    var $bwworkfloweditor = $("#divWorkflowEditor").bwWorkflowEditor(options);

                    console.log('xcx231243-13. Getting workflowAppTheme.');
                    console.log('xcx231243-13. Getting workflowAppTheme.');
                    console.log('xcx231243-13. Getting workflowAppTheme.');
                    //alert('xcx231243-13. Getting workflowAppTheme.');
                    var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
                    var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

                    // Make all of the buttons un-selected.
                    $('.bwConfiguration:first').find('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                        $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
                        $(this).addClass(workflowAppTheme).removeClass('bwMenuButton_Selected');
                    });

                    // Set the specified button as the selected one.
                    $('#divInnerLeftMenuButton_Workflows').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);
                    $('#divInnerLeftMenuButton_Workflows').addClass('bwMenuButton_Selected');

                    break;

                case 'FORMS':

                    $('#bwQuickLaunchMenuTd').css({
                        width: '0'
                    }); // This gets rid of the jumping around.

                    try {
                        $('#FormsEditorToolbox').dialog('close');
                    } catch (e) { }

                    var canvas = document.getElementById("myCanvas");
                    if (canvas) {
                        var ctx = canvas.getContext("2d");
                        ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines
                        canvas.style.zIndex = -1;
                    }

                    $('#divPageContent3').empty(); // Clear the div and rebuild it with out new 'Departments' title.

                    $('#divPageContent2_Title').html('WORKFLOWS');

                    var html = '';
                    html += '<div id="divFormsEditor" class="context-menu-formseditor" style="height:100vh;"></div>'; // Todd just did this to try and get the editing screen to not jump around when deleting rows at the bottom, and make it more intuitive! 10-24-19 2pm ast.
                    $('#divPageContent3').html(html);

                    var options = { displayChecklistPicker: true, checklistIndex: '' }; // 1-2-2022
                    var $form = $("#divFormsEditor").bwFormsEditor(options);

                    console.log('xcx231243-14. Getting workflowAppTheme.');
                    console.log('xcx231243-14. Getting workflowAppTheme.');
                    console.log('xcx231243-14. Getting workflowAppTheme.');
                    //alert('xcx231243-14. Getting workflowAppTheme.');
                    var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
                    var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

                    // Make all of the buttons un-selected.
                    $('.bwConfiguration:first').find('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                        $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
                        $(this).addClass(workflowAppTheme).removeClass('bwMenuButton_Selected');
                    });

                    // Set the specified button as the selected one.
                    $('#divInnerLeftMenuButton_Forms').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);
                    $('#divInnerLeftMenuButton_Forms').addClass('bwMenuButton_Selected');

                    break;

                case 'CHECKLISTS':

                    $('#bwQuickLaunchMenuTd').css({
                        width: '0'
                    }); // This gets rid of the jumping around.

                    try {
                        $('#FormsEditorToolbox').dialog('close');
                    } catch (e) { }

                    var canvas = document.getElementById("myCanvas");
                    if (canvas) {
                        var ctx = canvas.getContext("2d");
                        ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines
                        canvas.style.zIndex = -1;
                    }

                    $('#divPageContent3').empty(); // Clear the div and rebuild it with out new 'Departments' title.

                    $('#divPageContent2_Title').html('WORKFLOWS');

                    var html = '';
                    html += '<div id="divChecklistsEditor" class="context-menu-checklistseditor" style="height:100vh;"></div>'; // Todd just did this to try and get the editing screen to not jump around when deleting rows at the bottom, and make it more intuitive! 10-24-19 2pm ast.
                    $('#divPageContent3').html(html);

                    var options = { displayChecklistPicker: true, bwTenantId: tenantId, bwWorkflowAppId: workflowAppId, checklistIndex: '' };
                    var $checklist = $("#divChecklistsEditor").bwChecklistsEditor(options);

                    console.log('xcx231243-15. Getting workflowAppTheme.');
                    console.log('xcx231243-15. Getting workflowAppTheme.');
                    console.log('xcx231243-15. Getting workflowAppTheme.');
                    //alert('xcx231243-15. Getting workflowAppTheme.');
                    var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
                    var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

                    // Make all of the buttons un-selected.
                    $('.bwConfiguration:first').find('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                        $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
                        $(this).addClass(workflowAppTheme).removeClass('bwMenuButton_Selected');
                    });

                    // Set the specified button as the selected one.
                    $('#divInnerLeftMenuButton_Checklists').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);
                    $('#divInnerLeftMenuButton_Checklists').addClass('bwMenuButton_Selected');

                    break;

                case 'SETTINGS': // Organization Settings.

                    $('#bwQuickLaunchMenuTd').css({
                        width: '0'
                    }); // This gets rid of the jumping around.

                    try {
                        $('#FormsEditorToolbox').dialog('close');
                    } catch (e) { }

                    var canvas = document.getElementById("myCanvas");
                    if (canvas) {
                        var ctx = canvas.getContext("2d");
                        ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines
                        canvas.style.zIndex = -1;
                    }

                    $('#divPageContent2_Title').html('ORGANIZATION SETTINGS');

                    $('#divPageContent3').html('');

                    this.renderConfigurationSettings().then(function (results) {

                        try {

                            console.log('xcx231243-16. Getting workflowAppTheme.');
                            console.log('xcx231243-16. Getting workflowAppTheme.');
                            console.log('xcx231243-16. Getting workflowAppTheme.');
                            //alert('xcx231243-16. Getting workflowAppTheme.');

                            var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
                            var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

                            // Make all of the buttons un-selected.
                            $('.bwConfiguration:first').find('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                                $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
                                $(this).addClass(workflowAppTheme).removeClass('bwMenuButton_Selected');
                            });

                            // Set the specified button as the selected one.
                            $('#divInnerLeftMenuButton_OrganizationSettings').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);
                            $('#divInnerLeftMenuButton_OrganizationSettings').addClass('bwMenuButton_Selected');

                        } catch (e) {

                            var msg = 'Exception in bwActiveMenu.js.RenderContentForInnerLeftMenuButtons(): ' + e.message + ', ' + e.stack;
                            console.log(msg);
                            displayAlertDialog(msg);

                        }

                    }).catch(function (e) {

                        var msg = 'Exception in bwActiveMenu.js.RenderContentForInnerLeftMenuButtons(): ' + JSON.stringify(e);
                        console.log(msg);
                        displayAlertDialog(msg);

                    });

                    break;

                case 'MONITOR_PLUS_TOOLS':

                    $('#bwQuickLaunchMenuTd').css({
                        width: '0'
                    }); // This gets rid of the jumping around.

                    try {
                        $('#FormsEditorToolbox').dialog('close');
                    } catch (e) { }

                    var canvas = document.getElementById("myCanvas");
                    if (canvas) {
                        var ctx = canvas.getContext("2d");
                        ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines
                        canvas.style.zIndex = -1;
                    }

                    $('#divPageContent3').empty(); // Clear the div and rebuild it with out new 'Departments' title.

                    $('#divPageContent2_Title').html('MONITORING + TOOLS');

                    var html = '';
                    html += '<div id="divBwMonitoringTools"></div>';
                    $('#divPageContent3').html(html);

                    var options = {
                        displayOnCreation: true,
                        displayWorkflowPicker: true,
                        bwTenantId: tenantId,
                        bwWorkflowAppId: workflowAppId,
                        bwEnabledRequestTypes: bwEnabledRequestTypes
                    };
                    var $bwmonitoringtools = $("#divBwMonitoringTools").bwMonitoringTools(options);

                    console.log('xcx231243-17. Getting workflowAppTheme.');
                    console.log('xcx231243-17. Getting workflowAppTheme.');
                    console.log('xcx231243-17. Getting workflowAppTheme.');
                    //alert('xcx231243-17. Getting workflowAppTheme.');
                    var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
                    var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

                    // Make all of the buttons un-selected.
                    $('.bwConfiguration:first').find('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                        $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
                        $(this).addClass(workflowAppTheme).removeClass('bwMenuButton_Selected');
                    });

                    // Set the specified button as the selected one.
                    $('#divInnerLeftMenuButton_MonitoringAndTools').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);
                    $('#divInnerLeftMenuButton_MonitoringAndTools').addClass('bwMenuButton_Selected');

                    break;

                case 'FUNCTIONAL_AREAS':

                    $('#bwQuickLaunchMenuTd').css({
                        width: '0'
                    }); // This gets rid of the jumping around.

                    try {
                        $('#FormsEditorToolbox').dialog('close');
                    } catch (e) { }

                    var canvas = document.getElementById("myCanvas");
                    if (canvas) {
                        var ctx = canvas.getContext("2d");
                        ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines
                        canvas.style.zIndex = -1;
                    }

                    $('#divPageContent3').empty(); // Clear the div and rebuild it with out new 'Departments' title.

                    $('#divPageContent2_Title').html('FINANCIAL AREAS');

                    $('#divPageContent3').bwFinancialAreasEditor({});

                    console.log('xcx231243-18. Getting workflowAppTheme.');
                    console.log('xcx231243-18. Getting workflowAppTheme.');
                    console.log('xcx231243-18. Getting workflowAppTheme.');
                    //alert('xcx231243-18. Getting workflowAppTheme.');
                    var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
                    var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

                    // Make all of the buttons un-selected.
                    $('.bwConfiguration:first').find('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                        $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
                        $(this).addClass(workflowAppTheme).removeClass('bwMenuButton_Selected');
                    });

                    // Set the specified button as the selected one.
                    $('#divInnerLeftMenuButton_FinancialAreas').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);
                    $('#divInnerLeftMenuButton_FinancialAreas').addClass('bwMenuButton_Selected');

                    break;

                case 'TRACK_SPENDING3':

                    $('#bwQuickLaunchMenuTd').css({
                        width: '0'
                    }); // This gets rid of the jumping around.

                    try {
                        $('#FormsEditorToolbox').dialog('close');
                    } catch (e) { }

                    var canvas = document.getElementById("myCanvas");
                    if (canvas) {
                        var ctx = canvas.getContext("2d");
                        ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines
                        canvas.style.zIndex = -1;
                    }

                    $('#divPageContent3').empty(); // Clear the div and rebuild it with out new 'Departments' title.

                    $('#divPageContent2_Title').html('TRACK SPENDING');

                    var widget = document.getElementsByClassName('bwTrackSpending');
                    if (!(widget.length && (widget.length > 0))) {
                        // It has not been instantiated, so do that here.
                        $("#divPageContent3").bwTrackSpending({});
                    }

                    $('#divPageContent3').bwTrackSpending('renderTrackSpending').then(function (results) {

                        try {
                            console.log('xcx231243-19. Getting workflowAppTheme.');
                            console.log('xcx231243-19. Getting workflowAppTheme.');
                            console.log('xcx231243-19. Getting workflowAppTheme.');
                            //alert('xcx231243-19. Getting workflowAppTheme.');
                            var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
                            var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

                            // Make all of the buttons un-selected.
                            $('.bwTrack:first').find('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                                $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
                                $(this).addClass(workflowAppTheme).removeClass('bwMenuButton_Selected');
                            });

                            // Set the specified button as the selected one.
                            $('#divInnerLeftMenuButton_TrackSpending3').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);
                            $('#divInnerLeftMenuButton_TrackSpending3').addClass('bwMenuButton_Selected');

                        } catch (e) {

                            var msg = 'Exception in bwActiveMenu.js.RenderContentForInnerLeftMenuButtons(): ' + e.message + ', ' + e.stack;
                            console.log(msg);
                            displayAlertDialog(msg);

                        }

                    }).catch(function (e) {

                        var msg = 'Exception in bwActiveMenu.js.RenderContentForInnerLeftMenuButtons(): ' + JSON.stringify(e);
                        console.log(msg);
                        displayAlertDialog(msg);

                    });

                    break;

                case 'YEARLY_BUDGET':

                    $('#bwQuickLaunchMenuTd').css({
                        width: '0'
                    }); // This gets rid of the jumping around.

                    try {
                        $('#FormsEditorToolbox').dialog('close');
                    } catch (e) { }

                    var canvas = document.getElementById("myCanvas");
                    if (canvas) {
                        var ctx = canvas.getContext("2d");
                        ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines
                        canvas.style.zIndex = -1;
                    }

                    $('#divPageContent2_Title').html('YEARLY BUDGET');

                    console.log('xcx231243-20. Getting workflowAppTheme.');
                    var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
                    var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

                    // Make all of the buttons un-selected.
                    $('.bwTrack:first').find('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                        $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
                        $(this).addClass(workflowAppTheme).removeClass('bwMenuButton_Selected');
                    });

                    // Set the specified button as the selected one.
                    $('#divInnerLeftMenuButton_YearlyBudget').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);
                    $('#divInnerLeftMenuButton_YearlyBudget').addClass('bwMenuButton_Selected');

                    $('#divPageContent3').empty();

                    try {
                        $('#divPageContent3').bwYearlyBudget('renderTrackSpending');
                    } catch (e) {
                        var options = {};
                        $("#divPageContent3").bwYearlyBudget(options);
                    }

                    break;

                default:

                    var msg = 'Error in bwActiveMenu.js.RenderContentForInnerLeftMenuButtons(): Unexpected value for button: ' + button;
                    console.log(msg);
                    displayAlertDialog(msg);

                    break;

            }
        } catch (e) {
            console.log('Exception in bwActiveMenu.js.RenderContentForInnerLeftMenuButtons(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu.js.RenderContentForInnerLeftMenuButtons(): ' + e.message + ', ' + e.stack);
        }
    },





    displayTopBarErrorMessage: function (message) {
        try {
            console.log('In displayTopBarErrorMessage().');



            var element = document.getElementById('divTopBar_Long');
            var topBarColor = window.getComputedStyle(element, null).getPropertyValue('background-color'); // returns rgb(140, 35, 213)
            var colorsPrefix = topBarColor.split('(')[1];
            var colors = colorsPrefix.split(')')[0];
            var red = colors.split(',')[0];
            var green = colors.split(',')[1];
            var blue = colors.split(',')[2];

            // Calculate complementary color.
            var temprgb = { r: red, g: green, b: blue };
            var temphsv = this.RGB2HSV(temprgb);
            //alert('temphsv: ' + JSON.stringify(temphsv)); // returns temphsv: {"saturation":-52,"hue":146,"value":55} // check whether V is < 0.5. If so, white, if not, black.

            //temphsv.hue = this.HueShift(temphsv.hue, 180.0);
            //var complementaryColorRgb = this.HSV2RGB(temphsv);
            // end: Calculate complementary color.

            var newSaturation = (temphsv.saturation * 2) * -1;
            var newHue = temphsv.hue * 2;
            var newValue = temphsv.value;
            var newhsv = {
                saturation: newSaturation,
                hue: newHue,
                value: newValue
            }
            var newColorRgb = this.HSV2RGB(temphsv);


            console.log('In bwActiveMenu.js.displayTopBarErrorMessage(). Color calculation before: ' + JSON.stringify(temphsv) + ', after: ' + JSON.stringify(newhsv));


            //var color = 'tomato';
            //if (temphsv.value > 50) { // Check whether V is < 0.5. If so, white, if not, black.
            //    color = 'white';
            //} else {
            //    color = 'black';
            //}



            var html = '';

            //html += '<span id="divTopBar_Long_ErrorMessage" style="color:rgb(' + complementaryColorRgb.r + ',' + complementaryColorRgb.g + ',' + complementaryColorRgb.b + ');padding-left:5px;">';
            //html += '<span id="divTopBar_Long_ErrorMessage" style="color:' + color + ';padding-left:5px;">';
            //html += '<span id="divTopBar_Long_ErrorMessage" style="color:rgb(' + newColorRgb.r + ',' + newColorRgb.g + ',' + newColorRgb.b + ');padding-left:5px;">';

            html += '<div id="divTopBar_Long_ErrorMessage" style="color:white;padding-left:5px;padding-top:3px;">';

            html += message;
            html += '</div>';

            //alert('In bwActiveMenu.js.displayTopBarErrorMessage(). xcx99348768');

            $('#divTopBar_Long_Error').html(html);

        } catch (e) {
            console.log('Exception in bwActiveMenu.js.displayTopBarErrorMessage(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu.js.displayTopBarErrorMessage(): ' + e.message + ', ' + e.stack);
        }
    },
    clearTopBarErrorMessage: function (message) {
        try {
            console.log('In clearTopBarErrorMessage().');

            //var html = '';

            //alert('In bwActiveMenu.js.clearTopBarErrorMessage(). xcx99348768');

            $('#divTopBar_Long_Error').html('');

        } catch (e) {
            console.log('Exception in bwActiveMenu.js.clearTopBarErrorMessage(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu.js.clearTopBarErrorMessage(): ' + e.message + ', ' + e.stack);
        }
    },





    //
    // TESTING THIS ADDED source, enabled PARAMETERS. USE THESE TO TRACK AND DISABLEFUNCTIONALITY WITH LOGGING. THIS is complicated, so it seems the best approach so far. 8-3-2024.
    //

    // This also adjusts the width of the top bar so that it stretches the width of the screen. <<< This part needs a bit of work.
    adjustLeftSideMenu: function (source, enabled) {
        try {
            //
            //
            // THIS IS THE ONLY PLACE WHERE WE ADJUST THE LEFT MENU WIDTH ETC. Is this true? 7-22-2023.
            // This also adjusts the width of the top bar so that it stretches the width of the screen. <<< This part needs a bit of work.
            //
            //
            console.log('In adjustLeftSideMenu(). Also adjusting length of the divTopBar_Long element. THIS IS THE ONLY PLACE WHERE WE ADJUST THE LEFT MENU WIDTH ETC. Is this true? 7-22-2023 8-3-2024.');
            //displayAlertDialog('In adjustLeftSideMenu(). Also adjusting length of the divTopBar_Long element. THIS IS THE ONLY PLACE WHERE WE ADJUST THE LEFT MENU WIDTH ETC. Is this true? 7-22-2023 8-3-2024.');
            var thiz = this;

            var welcomeButton = document.getElementById('divWelcomeButton');
            //var personalSettingsButton = document.getElementById('divInnerLeftMenuButton_PersonalBehavior');

            if (welcomeButton) {

                if (!this.options.divWelcomeButton_OriginalHeight) { // This only populates this the first time, before any scrolling.

                    var height = Number(welcomeButton.style.height.split('px')[0]);

                    console.log('xcx213124124 Setting divWelcomeButton_OriginalHeight: ' + height);

                    this.options.divWelcomeButton_OriginalHeight = height;

                }

            }
            //if (personalSettingsButton && (personalSettingsButton.style.display != 'none')) {
            //    if (!this.options.divInnerLeftMenuButton_PersonalBehavior_OriginalHeight) {

            //        console.log('SETTING personalSettingsButton OriginalHeight to: ' + personalSettingsButton.style.height);
            //        alert('SETTING personalSettingsButton OriginalHeight to: ' + personalSettingsButton.style.height);
            //        this.options.divInnerLeftMenuButton_PersonalBehavior_OriginalHeight = Number(personalSettingsButton.style.height.split('px')[0]);

            //        //alert('In adjustLeftSideMenu(). this.options.divInnerLeftMenuButton_PersonalBehavior_OriginalHeight: ' + this.options.divInnerLeftMenuButton_PersonalBehavior_OriginalHeight);

            //    }
            //}



            // On the macbook, in Safari, the top bar doesn't get wide enough. Safari must not handle the table and div tag combination properly.
            // So, here we set the width and that seems to fix it. 5-22-2022.

            var rect1 = document.getElementById('divTopBar_Long').getBoundingClientRect();
            var left1 = rect1.left;

            var element1 = document.getElementById('divTopBar_OrganizationName');
            if (!document.getElementById('divTopBar_OrganizationName')) {

                var msg = 'Error in bwActiveMenu.js.adjustLeftSideMenu(). Could not find element divTopBar_OrganizationName.';
                console.log(msg);
                displayAlertDialog(msg);

            } else {

                var rect2 = document.getElementById('divTopBar_OrganizationName').getBoundingClientRect();
                var width1 = rect2.right - rect2.left;
                if (width1 > 0) {
                    width1 += 10; //  added 10 for buffer
                }

                var screenWidth = document.documentElement.clientWidth;
                var endPiece = 30 + 8;
                var desiredWidth = screenWidth - left1 - width1 - endPiece;

                //alert('xcx213123 setting divTopBar_Long width.');
                //document.getElementById('divTopBar_Long').style.width = desiredWidth + 'px'; // Does this fix the top bar on the mac (where it does not go completely across the screen..?) 5-22-2022
                console.log('WE USED TO SET THE WIDTH HERE!!!!!!!!!!!! I just removed it, and I think it is way better. Keep in mind for removal... OR!!!! MAYBE THIS IS WHERE WE HAVE TO RESHAPE THE ENTIRE PAGE SO IT ALWAYS FITS ON THE VIEWPORT/VISIBLE SCREEN. xcx2323567872323. In adjustLeftSideMenu(). Set width of element "divTopBar_Long". desiredWidth: ' + desiredWidth);
                console.log('WE USED TO SET THE WIDTH HERE!!!!!!!!!!!! I just removed it, and I think it is way better. Keep in mind for removal... OR!!!! MAYBE THIS IS WHERE WE HAVE TO RESHAPE THE ENTIRE PAGE SO IT ALWAYS FITS ON THE VIEWPORT/VISIBLE SCREEN. xcx2323567872323. In adjustLeftSideMenu(). Set width of element "divTopBar_Long". desiredWidth: ' + desiredWidth);
                console.log('WE USED TO SET THE WIDTH HERE!!!!!!!!!!!! I just removed it, and I think it is way better. Keep in mind for removal... OR!!!! MAYBE THIS IS WHERE WE HAVE TO RESHAPE THE ENTIRE PAGE SO IT ALWAYS FITS ON THE VIEWPORT/VISIBLE SCREEN. xcx2323567872323. In adjustLeftSideMenu(). Set width of element "divTopBar_Long". desiredWidth: ' + desiredWidth);

            }



            // 7-22-2023
            var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            //displayAlertDialog('xcx123123 width: ' + width);

            if (document.getElementById('divTopBar_Long_Error')) {
                console.log('WE USED TO SHOW THE WINDOW WIDTH IN THE TOP BAR HERE. PUT BACK FOR DEVELOPMENT AND TROUBLESHOOTING. 12-13-2023. width: ' + width);
                //document.getElementById('divTopBar_Long_Error').innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + width;
            } else {
                console.log('COULD NOT FIND ELEMENT divTopBar_Long_Error. WE USED TO SHOW THE WINDOW WIDTH IN THE TOP BAR HERE. PUT BACK FOR DEVELOPMENT AND TROUBLESHOOTING. 12-13-2023. width: ' + width);
            }



            //if (Number(width) < 2000) { // was 950. 8-5-2024.
            console.log('xcx2222-1 THIS IS OLD CODE WHICH USED TO RESIZE LE MENU ON WINDOW RESIZE. Number(width) < 950. Setting LeftMenuWidth to 50px. width: ' + width + '.');
            this.options.LeftMenuWidth = '50px';
            //this.options.LeftMenuFontSize = '6pt';
            this.options.LeftMenuFontSize = '14pt'; // THIS IS WHERE WE SET THE FONT SIZE OF THE LEFT MENU BUTTONS.


            // 1-5-2025.
            var canvas2 = document.getElementById('bwActiveMenu_CanvasTopBarOutsideCircle');
            if (canvas2) {
                canvas2.style.width = "175px";
            }


            console.log('THIS IS WHERE WE SET THE FONT SIZE OF THE LEFT MENU BUTTONS.');
            //} else {
            //    this.options.LeftMenuWidth = '250px';
            //    this.options.LeftMenuFontSize = '12pt';
            //}

            // shrink left menu
            if (this.options.LeftMenuWidth != "250px") {
                console.log('xcx1111-1 this.options.LeftMenuWidth: ' + this.options.LeftMenuWidth);
                // I need to sort this out but am using the ?font size to control the outer left menu width. 1-4-2023.
            }


            // commented out 6-13-2024.
            //alert('xcx123123212. Setting divLeftMenuHeader. NOT SURE WE NEED TO DO THIS. to ' + this.options.LeftMenuWidth);
            console.log('COMMENTED OUT Setting divLeftMenuHeader. NOT SURE WE NEED TO DO THIS. 8-5-2024.');
            //document.getElementById('divLeftMenuHeader').style.width = this.options.LeftMenuWidth; //'100px';
            var cusid_ele = document.getElementsByClassName('leftButtonText');
            for (var i = 0; i < cusid_ele.length; ++i) {
                var item = cusid_ele[i];
                item.style.fontSize = this.options.LeftMenuFontSize; // '6pt';
            }




            //
            // Pixel window height indicator for testing while getting menu 100%.
            //
            var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

            console.log('In bwActiveMenu.js.adjustLeftSideMenu(). height: ' + height);

            //var divBottomOfMenuMarker = document.getElementById('divBottomOfMenuMarker');
            //if (!divBottomOfMenuMarker) {
            //    $(document.body).prepend('<div id="divBottomOfMenuMarker" style="display:block;position:absolute;">[divBottomOfMenuMarker]</div>');
            //}
            //document.getElementById('divBottomOfMenuMarker').style.top = height + "px";

            // Now we have to subtract the height of the top blue bar.
            var topBlueBar = $('#tableMainMenu1').find('tr')[0];
            var rect = topBlueBar.getBoundingClientRect();
            var topBlueBar_Height = rect.bottom - rect.top;
            height = Math.round(height - topBlueBar_Height);


            // 1-2-2022
            var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');
            if (developerModeEnabled == true) {
                $('#divLeftMenuTopSmallBar1').html(height); // Display this height on the screen in the little top blue bar. 
            }


            // Now that we have the height, lets stretch the left menu the length of the screen, resizing each button according to:
            // - buttonHeight_WeightedValue << This value determines the height of the button. They all get added up, then comprise 100% of the height.

            var totalButtonSpacers_Height = 0;
            $('#tdLeftSideMenu').find('.buttonSpacer').each(function (index, value) {
                var tmpHeight = this.style.height.split('px')[0];
                totalButtonSpacers_Height += Number(tmpHeight);
            });

            var numberOfButtons = $('#tdLeftSideMenu').find('.leftButton,.leftButton_inactive').length;
            var weightedHeightValues_OneHundredPercent = 0; // This is used so we can calculate the spread percentage wise.
            $('#tdLeftSideMenu').find('.leftButton,.leftButton_inactive').each(function (index, value) {


                this.style.backgroundColor = 'darkgray'; // Button color override (for now) 8-28-2021



                if ($(this).attr('weightedheightvalue')) {
                    weightedHeightValues_OneHundredPercent += Number($(this).attr('weightedheightvalue'));
                }
            });


            // Good 9-20-2021 prior to adding minimum button height requirement.
            //var remainingHeight = height - totalButtonSpacers_Height;
            //$('#tdLeftSideMenu').find('.leftButton').each(function (index, value) {
            //    if ($(this).attr('weightedheightvalue')) {
            //        var weightedHeightValue = Number($(this).attr('weightedheightvalue'));
            //        var divisor = weightedHeightValue / weightedHeightValues_OneHundredPercent;
            //        var buttonHeight = remainingHeight * divisor;
            //        console.log('Setting height of button "' + this.id + '" to ' + buttonHeight + 'px.');
            //        this.style.height = buttonHeight + 'px';
            //    }
            //});


            // Rescale buttons with minimum button height. Not perfect, but getting there.
            var minimumButtonHeight = 30;
            var remainingHeight; // = height - totalButtonSpacers_Height;
            var buttonQuantity = $('#tdLeftSideMenu').find('.leftButton,.leftButton_inactive').length;
            $('#tdLeftSideMenu').find('.leftButton,.leftButton_inactive').each(function (index, value) {

                height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                height = Math.round(height - topBlueBar_Height);
                remainingHeight = height - totalButtonSpacers_Height;

                if ($(this).attr('weightedheightvalue')) {
                    var weightedHeightValue = Number($(this).attr('weightedheightvalue'));
                    var divisor = weightedHeightValue / weightedHeightValues_OneHundredPercent;

                    // This gives us a correction so all the buttons fit on the screen. Rough but I am not a mathematician lol!
                    var buttonAdjuster;
                    if (buttonQuantity > 4) {
                        buttonAdjuster = 8;
                    } else {
                        buttonAdjuster = 16;
                    }

                    var buttonHeight = (remainingHeight * divisor) - buttonAdjuster; // This -8 makes it so the bottom button makes it onto the screen. 12-20-2021
                    if (minimumButtonHeight > buttonHeight) {
                        // The button is already at the minimum height, so do nothing, except recalculate the remaining height.
                        //console.log('Setting height of button "' + this.id + '" to minimum button height ' + buttonHeight + 'px.');
                        buttonHeight = minimumButtonHeight;
                        this.style.height = buttonHeight + 'px';
                    } else {
                        //console.log('Setting height of button "' + this.id + '" to ' + buttonHeight + 'px.');
                        this.style.height = buttonHeight + 'px';
                    }

                    if (this.id == 'divWelcomeButton') {
                        if (thiz.options.divWelcomeButton_OriginalHeight) {
                            console.log('xcx23123123 found the welcome button. NOT SETTING THE last known button height, because it has already been set. This should only get set once, when the page is first rendered.');
                        } else {
                            console.log('xcx23123123 found the welcome button. Set the last known button height here. buttonHeight: ' + buttonHeight);
                            thiz.options.divWelcomeButton_OriginalHeight = buttonHeight;
                        }
                    }

                }
            });




            //// Added 8-9-2023.
            //var y = window.scrollY;

            //if (welcomeButton && this.options.divWelcomeButton_OriginalHeight) {
            //    displayAlertDialog('height: ' + y);
            //    welcomeButton.style.height = String(this.options.divWelcomeButton_OriginalHeight + y) + 'px';
            //}


            // Now that the left menu is done, do the inner left menu.
            thiz.adjustInnerLeftSideMenu('In adjustLeftSideMenu(). xcx87774', true);

        } catch (e) {
            var msg = 'Exception in bwActiveMenu.js.adjustLeftSideMenu(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
        }
    },
    // This should also adjust the width of the top bar so that it stretches the width of the screen. <<< This part needs a bit of work.
    adjustInnerLeftSideMenu: function (source, enabled) {
        try {
            console.log('In adjustInnerLeftSideMenu().');
            var thiz = this;

















            //debugger;
            //if (document.getElementById('tableMainMenu3').style.display == 'none') {
            //    // The inner left menu is not being displayed, so do nothing here.
            //} else {
            if ($('#tdInnerLeftSideMenu').is(':visible')) {

                // 8-12-2023.
                console.log('If the inner menu is being displayed, always make sure the outer left menu is shrunk.');
                this.shrinkLeftMenuBar('xcx444325', true); // If the inner menu is being displayed, always make sure the outer left menu is shrunk.

                //
                // Pixel window height indicator for testing while getting menu 100%.
                //
                var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

                // Now we have to subtract the height of the top blue bar.
                var topBlueBar = $('#tableMainMenu2').find('tr')[0];
                var rect = topBlueBar.getBoundingClientRect();
                var topBlueBar_Height = rect.bottom - rect.top;
                height = Math.round(height - topBlueBar_Height);



                // 1-2-2022
                var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');
                if (developerModeEnabled == true) {
                    $('#divInnerLeftMenuTopSmallBar1').html(height); // Display this height on the screen in the little top blue bar. 
                }




                // Now that we have the height, lets stretch the left menu the length of the screen, resizing each button according to:
                // - buttonHeight_WeightedValue << This value determines the height of the button. They all get added up, then comprise 100% of the height.

                var totalButtonSpacers_Height = 0;
                $('#tdInnerLeftSideMenu').find('.buttonSpacer').each(function (index, value) {
                    var tmpHeight = this.style.height.split('px')[0];
                    totalButtonSpacers_Height += Number(tmpHeight);
                });

                var numberOfButtons = $('#tdInnerLeftSideMenu').find('.leftButton,.leftButton_inactive').length;
                //var numberOfInactiveButtons = $('#tdInnerLeftSideMenu').find('.leftButton_inactive').length;
                //var numberOfButtons = numberOfActiveButtons + numberOfInactiveButtons;
                var weightedHeightValues_OneHundredPercent = 0; // This is used so we can calculate the spread percentage wise.
                $('#tdInnerLeftSideMenu').find('.leftButton,.leftButton_inactive').each(function (index, value) {


                    this.style.backgroundColor = 'darkgray'; // Button color override (for now) 8-28-2021



                    if ($(this).attr('weightedheightvalue')) {
                        weightedHeightValues_OneHundredPercent += Number($(this).attr('weightedheightvalue'));
                    }
                });

                // Rescale buttons with minimum button height. Not perfect, but getting there.
                var minimumButtonHeight = 30;
                var remainingHeight; // = height - totalButtonSpacers_Height;
                $('#tdInnerLeftSideMenu').find('.leftButton,.leftButton_inactive').each(function (index, value) {


                    height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                    height = Math.round(height - topBlueBar_Height);
                    remainingHeight = height - totalButtonSpacers_Height;


                    if ($(this).attr('weightedheightvalue')) {
                        var weightedHeightValue = Number($(this).attr('weightedheightvalue'));
                        var divisor = weightedHeightValue / weightedHeightValues_OneHundredPercent;
                        var buttonHeight = (remainingHeight * divisor) - 15; // This -10 makes it so the bottom button makes it onto the screen. 12-28-2021
                        if (minimumButtonHeight > buttonHeight) {
                            // The button is already at the minimum height, so do nothing, except recalculate the remaining height.
                            //console.log('Setting height of button "' + this.id + '" to minimum button height ' + buttonHeight + 'px.');
                            buttonHeight = minimumButtonHeight;
                            this.style.height = buttonHeight + 'px';
                        } else {
                            //console.log('Setting height of button "' + this.id + '" to ' + buttonHeight + 'px.');
                            this.style.height = buttonHeight + 'px';
                        }
                    }
                });
            }

        } catch (e) {
            console.log('Exception in adjustInnerLeftSideMenu(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in adjustInnerLeftSideMenu(): ' + e.message + ', ' + e.stack);
        }
    },
    shrinkLeftMenu: function (source, enabled) {
        try {
            console.log('In shrinkLeftMenu(). source: ' + source);

            //
            // This positions the inner menus and content. Doesn't work on iOS. <<<<<<<<<<<<
            //
            var leftSideMenu_BoundingClientRect = document.getElementById('tdLeftSideMenu').getBoundingClientRect();
            var divTopBar_Long_BoundingClientRect = document.getElementById('divTopBar_Long').getBoundingClientRect();
            var top = divTopBar_Long_BoundingClientRect.bottom;
            var left = leftSideMenu_BoundingClientRect.right; // 1st time: 259   // 2nd time: 104


            top = top + 5;
            left = left - 155;
            console.log('In displayConfiguration(). top: ' + top + ', left: ' + left);
            //debugger;
            //document.getElementById('divPageContent1').style.position = 'absolute';
            ////alert('Setting divPageContent1.style.top: ' + top);
            //document.getElementById('divPageContent1').style.top = top + 'px';
            //document.getElementById('divPageContent1').style.left = left + 'px';


            // shrink left menu THIS has been moved here from another location... 1-4-2024.
            //alert('xcx123123212-2. Setting divLeftMenuHeader. NOT SURE WE NEED TO DO THIS. to 100px');
            console.log('COMMENTED OUT Setting divLeftMenuHeader. NOT SURE WE NEED TO DO THIS. 8-5-2024.');
            //document.getElementById('divLeftMenuHeader').style.width = '100px';
            var cusid_ele = document.getElementsByClassName('leftButtonText');
            for (var i = 0; i < cusid_ele.length; ++i) {
                var item = cusid_ele[i];
                item.style.fontSize = '8pt';
            }




        } catch (e) {
            console.log('Exception in shrinkLeftMenu(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in shrinkLeftMenu(): ' + e.message + ', ' + e.stack);
        }
    },
    unshrinkLeftMenu: function (source, enabled) {
        try {
            console.log('In bwActiveMenu.js.unshrinkLeftMenu(). source: ' + source);

            //alert('xcx123123212-3. Reading divLeftMenuHeader. NOT SURE WE NEED TO DO THIS.');
            var leftMenuWidth = document.getElementById('divLeftMenuHeader').style.width.replace('px', '');

            if (leftMenuWidth < 200) {
                // document.getElementById('divLeftMenuHeader').style.width = '250px';
                //alert('xcx1111-2');

                console.log('In bwActiveMenu.js.unshrinkLeftMenu(). leftMenuWidth < 200. Setting divLeftMenuHeader width. leftMenuWidth: ' + leftMenuWidth);

                //alert('xcx123123212-4. Setting divLeftMenuHeader. NOT SURE WE NEED TO DO THIS. to ' + this.options.LeftMenuWidth);
                console.log('WAS SETTING divLeftMenuHeader.style.width BUT TURNED IT OFF.');
                //document.getElementById('divLeftMenuHeader').style.width = this.options.LeftMenuWidth;
                var cusid_ele = document.getElementsByClassName('leftButtonText');
                for (var i = 0; i < cusid_ele.length; ++i) {
                    var item = cusid_ele[i];
                    item.style.fontSize = '12pt';
                }

                console.log('Repositioning divPageContent1.');
                var leftSideMenu_BoundingClientRect = document.getElementById('tdLeftSideMenu').getBoundingClientRect();
                var left = leftSideMenu_BoundingClientRect.right;






                //document.getElementById('divPageContent1').style.position = 'absolute';
                //document.getElementById('divPageContent1').style.left = left + 'px';
                //document.getElementById('divPageContent1').style.top = '85px'; // Corrects for the top spacing which changes after menu selections. 4-30-2022




                ////
                //// This positions the inner menus and content. Doesn't work on iOS. <<<<<<<<<<<<
                ////
                //var leftSideMenu_BoundingClientRect = document.getElementById('tdLeftSideMenu').getBoundingClientRect();
                //var divTopBar_Long_BoundingClientRect = document.getElementById('divTopBar_Long').getBoundingClientRect();
                //var top = divTopBar_Long_BoundingClientRect.bottom;
                //var left = leftSideMenu_BoundingClientRect.right; // 1st time: 259   // 2nd time: 104


                //top = top + 5;
                //left = left - 155;
                //console.log('In displayConfiguration(). top: ' + top + ', left: ' + left);
                //debugger;
                //document.getElementById('divPageContent1').style.position = 'absolute';
                //document.getElementById('divPageContent1').style.top = top + 'px';
                //document.getElementById('divPageContent1').style.left = left + 'px';
            }

        } catch (e) {
            console.log('Exception in unshrinkLeftMenu(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in unshrinkLeftMenu(): ' + e.message + ', ' + e.stack);
        }
    },
    shrinkLeftMenuBar: function (source, enabled) {
        try {
            console.log('In shrinkLeftMenuBar().');

            // shrink left menu

            //alert('xcx123123212-6. Setting divLeftMenuHeader. NOT SURE WE NEED TO DO THIS. to 100px');
            console.log('WAS SETTING divLeftMenuHeader.style.width BUT TURNED IT OFF.');
            //document.getElementById('divLeftMenuHeader').style.width = '100px';
            var cusid_ele = document.getElementsByClassName('leftButtonText');
            for (var i = 0; i < cusid_ele.length; ++i) {
                var item = cusid_ele[i];
                item.style.fontSize = '8pt';
            }

            // 1-26-2025.
            this.renderOutsideCurveInTheMenuBar(true); // skinny is set to true.

        } catch (e) {
            console.log('Exception in shrinkLeftMenuBar(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in shrinkLeftMenuBar(): ' + e.message + ', ' + e.stack);
        }
    },










    //
    // The following methods are for determining the complimentary color of another color.
    //
    RGB2HSV: function (rgb) {
        try {
            hsv = new Object();
            max = this.max3(rgb.r, rgb.g, rgb.b);
            dif = max - this.min3(rgb.r, rgb.g, rgb.b);
            hsv.saturation = (max == 0.0) ? 0 : (100 * dif / max);
            if (hsv.saturation == 0) hsv.hue = 0;
            else if (rgb.r == max) hsv.hue = 60.0 * (rgb.g - rgb.b) / dif;
            else if (rgb.g == max) hsv.hue = 120.0 + 60.0 * (rgb.b - rgb.r) / dif;
            else if (rgb.b == max) hsv.hue = 240.0 + 60.0 * (rgb.r - rgb.g) / dif;
            if (hsv.hue < 0.0) hsv.hue += 360.0;
            hsv.value = Math.round(max * 100 / 255);
            hsv.hue = Math.round(hsv.hue);
            hsv.saturation = Math.round(hsv.saturation);
            return hsv;
        } catch (e) {
            console.log('Exception in bwActiveMenu.js.RGB2HSV(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu.js.RGB2HSV(): ' + e.message + ', ' + e.stack);
        }
    },
    HSV2RGB: function (hsv) {
        try {
            // 2-4-2022: This is from: https://stackoverflow.com/questions/1664140/js-function-to-calculate-complementary-colour
            // RGB2HSV and HSV2RGB are based on Color Match Remix [http://color.twysted.net/]
            // which is based on or copied from ColorMatch 5K [http://colormatch.dk/]
            var rgb = new Object();
            if (hsv.saturation == 0) {
                rgb.r = rgb.g = rgb.b = Math.round(hsv.value * 2.55);
            } else {
                hsv.hue /= 60;
                hsv.saturation /= 100;
                hsv.value /= 100;
                i = Math.floor(hsv.hue);
                f = hsv.hue - i;
                p = hsv.value * (1 - hsv.saturation);
                q = hsv.value * (1 - hsv.saturation * f);
                t = hsv.value * (1 - hsv.saturation * (1 - f));
                switch (i) {
                    case 0: rgb.r = hsv.value; rgb.g = t; rgb.b = p; break;
                    case 1: rgb.r = q; rgb.g = hsv.value; rgb.b = p; break;
                    case 2: rgb.r = p; rgb.g = hsv.value; rgb.b = t; break;
                    case 3: rgb.r = p; rgb.g = q; rgb.b = hsv.value; break;
                    case 4: rgb.r = t; rgb.g = p; rgb.b = hsv.value; break;
                    default: rgb.r = hsv.value; rgb.g = p; rgb.b = q;
                }
                rgb.r = Math.round(rgb.r * 255);
                rgb.g = Math.round(rgb.g * 255);
                rgb.b = Math.round(rgb.b * 255);
            }
            return rgb;
        } catch (e) {
            console.log('Exception in bwActiveMenu.js.HSV2RGB(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu.js.HSV2RGB(): ' + e.message + ', ' + e.stack);
        }
    },
    HueShift: function (h, s) {
        try {
            //Adding HueShift via Jacob (see comments)
            h += s; while (h >= 360.0) h -= 360.0; while (h < 0.0) h += 360.0; return h;
        } catch (e) {
            console.log('Exception in bwActiveMenu.js.HueShift(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu.js.HueShift(): ' + e.message + ', ' + e.stack);
        }
    },
    min3: function (a, b, c) {
        try {
            //min max via Hairgami_Master (see comments)
            return (a < b) ? ((a < c) ? a : c) : ((b < c) ? b : c);
        } catch (e) {
            console.log('Exception in bwActiveMenu.js.min3(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu.js.min3(): ' + e.message + ', ' + e.stack);
        }
    },
    max3: function (a, b, c) {
        try {
            return (a > b) ? ((a > c) ? a : c) : ((b > c) ? b : c);
        } catch (e) {
            console.log('Exception in bwActiveMenu.js.max3(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu.js.max3(): ' + e.message + ', ' + e.stack);
        }
    }

});