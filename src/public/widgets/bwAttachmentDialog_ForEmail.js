$.widget("bw.bwAttachmentDialog_ForEmail", {
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
        This is the bwAttachmentDialog_ForEmail.js jQuery Widget. 
        ===========================================================

           Currently the attachment dialog is in the bwRequest.js widget. 
           I am breaking it out because it makes sense to do so, and facilitates making the attachment dialog a pop-out window.
           Making this a pop-out window facilitates things like playing .mp3's in a separate window, videos, viewing documents, etc. 2-6-2024.

           [This functionality is incomplete. Coming soon!]
                           
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

           [put your stuff here]

        ===========================================================
        
       */

        pdf: null, // This is the PDF.js pdf object. This makes it accessible when the user is switching pages.
        pageNumber: null, // This is the current PDF page number.
        numPages: null, // This is the total number of pages.
        pdfCanvas: null, // This is the pdf canvas element.
        pdfCanvas_context: null,
        pdfCanvas_viewport: null


    },
    _create: function () {
        //alert('In bwAttachmentDialog_ForEmail._create().');
        this.element.addClass("bwAttachmentDialog_ForEmail");
        //debugger;
        //var thiz = this; // Need this because of the asynchronous operations below.
        try {
            if (this.options.operationUriPrefix == null) {
                // This formulates the operationUri, which is used throughout.
                var url1 = window.location.href.split('https://')[1];
                var url2 = url1.split('/')[0];
                this.options.operationUriPrefix = 'https://' + url2 + '/';
            }

            //alert('Instantiating bwAttachmentDialog_ForEmail.');

            var div = document.getElementById('AttachmentsDialog1');
            if (!div) {
                div = document.createElement('div');
                div.id = 'AttachmentsDialog1';
                div.style.display = 'none';
                document.body.appendChild(div); // Place at end of document
            }

            var html = `
            <table style="width:100%;">
                <tr>
                    <td style="width:90%;">
                        <span id="spanAttachmentsDialog1Title" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">xcx34348</span>
                    </td>
                    <!--<td style="width:9%;"></td>
                    <td style="width:1%;cursor:pointer;vertical-align:top;">
                        <span class="dialogXButton" style="font-family: 'Segoe UI Light','Segoe UI','Segoe',Tahoma,Helvetica,Arial,sans-serif;font-size:60pt;font-weight:bold;" onclick="$('#AttachmentsDialog1').dialog('close');">X</span>
                    </td>-->
                </tr>
            </table>
            <br /><br />
            <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->


            <div id="divAttachmentsDialog1Contents" xcx="23123455" class="divDialogAttachment" ondblclick="$('.bwAttachmentDialog_ForEmail').bwAttachmentDialog_ForEmail('zoomAndCenter', 'AttachmentsDialog1');"></div>
            <br /><br />


            <!--[x] Viewable by Participants
            <br />
            [x] Viewable by Participants and Customers
            <br />
            [x] Viewable by Participants and Vendors
            <br />
            [x] Viewable by Participants, Customers, and Vendors
            <br />
            [x] Viewable by Everyone (public) *beta Share this link with anyone, and they will be able to view this file without logging in.
            <br /><br />-->

            <table>
                <tr>
                    <td><span style="font-style:italic;color:gray;font-size:18pt;">file name:</span></td>
                    <td>
                        <input type="text" id="txtAttachmentsDialog1Filename" style="width:290px;font-size:18pt;" />
                        &nbsp;<span id="spanAttachmentsDialog1FileExtension" style="font-style:italic;font-size:16pt;color:gray;"></span>
                        <!--<br /><span style="font-style:italic;font-size:22pt;color:gray;">(don't include a file extension)</span>-->
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td style="vertical-align:top;"><span style="font-style:italic;font-size:18pt;color:gray;">description:</span></td>
                    <td><textarea id="txtAttachmentsDialog1FileDescription" style="overflow:hidden;font-size:12pt;" rows="4" cols="55"></textarea></td>
                </tr>
                <!--<tr>
                    <td colspan="2" style="text-align:right;font-size:40pt;">
                        <button name="btnUploadTheFileNowxxxx" title="Click here to upload the attachment." class="BwButton" id="btnUploadTheFileNow">Save</button>
                        <button name="btnDeleteTheFileNowxxxx" title="Click here to delete the attachment." class="BwButton" id="btnDeleteTheFileNow">Delete</button>
                        <button name="btnCancelUploadTheFileNowxxxx" title="" class="BwButton" id="btnCancelUploadTheFileNow">Close</button>
                    </td>
                </tr>-->
            </table>

            <span id="spanAttachmentsDialog1SaveMetadataButton"></span>
            <br /><br />
            <!--<div id="btnAttachmentsDialog1SaveMetadata" class="divDialogButton">
                Save
            </div>-->

            <span id="spanAttachmentsDialog1DeleteAttachmentButton"></span>
            <br /><br />
            <!--<div id="btnAttachmentsDialog1DeleteAttachment" class="divDialogButton">
                Delete
            </div>-->

            <br /><br />
            <div id="xxxx" class="divDialogButton" onclick="$('.bwCoreComponent:first').bwCoreComponent('copyAttachmentToAnEmailAndOpenEmail', 'AttachmentsDialog1');">
                Copy to email and open...
            </div>

            <br /><br />
            <div id="xxxx" class="divDialogButton" onclick="alert('This functionality allows you to easily copy an attachment to another request. This functionality is incomplete. Coming soon!');">
                Copy to request...[bwAttachmentDialog_ForEmail.js]
            </div>







            <br /><br />
            <div id="spanAttachmentsDialog1_LaunchFileConversionButton">[spanAttachmentsDialog1_LaunchFileConversionButton]</div>

            <br /><br />
            <div id="spanAttachmentsDialog1_LaunchFileConversionButton2">[spanAttachmentsDialog1_LaunchFileConversionButton2]</div>

            <br /><br />
            <div id="spanAttachmentsDialog1_GetExifDataButton">[spanAttachmentsDialog1_GetExifDataButton]</div>

            <br /><br />
            <div id="spanAttachmentsDialog1_PerformOCRButton">[spanAttachmentsDialog1_PerformOCRButton]</div>

            <br /><br />
            <div id="spanAttachmentsDialog1_RepairFileTypeButton">[spanAttachmentsDialog1_RepairFileTypeButton]</div>



            <br /><br />
            <div id="xxxx" class="divDialogButton" onclick="$('#AttachmentsDialog1').dialog('close');">
                Close
            </div>
            <br /><br />

            `;

            $('#AttachmentsDialog1').html(html);

            console.log('In bwAttachmentDialog_ForEmail._create(). The widget has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwAttachmentDialog_ForEmail: CANNOT INITIALIZE widget bwAttachmentDialog_ForEmail.js.</span>';
            html += '<br />';
            html += '<span style="">Exception in bwAttachmentDialog_ForEmail.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwAttachmentDialog_ForEmail")
            .text("");
    },

    displayAttachmentInDialog: function (fileUrl, filename, description, bwBudgetRequestId) {
        try {
            console.log('In bwAttachmentDialog_ForEmail.js.displayAttachmentInDialog().');
            //alert('In bwAttachmentDialog_ForEmail.js.displayAttachmentDialog(). fileUrl: ' + fileUrl + ', filename: ' + filename + ', description: ' + description);
            //var thiz = this;

            window.scrollTo(0, 0); // Scroll to top on button click. This makes sure things render Ok, and also just seems like a nicer user experience.
            $('.bwActiveMenu').bwActiveMenu('adjustLeftSideMenu'); // This makes sure our new stretchy-left-menu redraws Ok.

            fileUrl = decodeURI(fileUrl).replaceAll('&amp;', '&'); // << Need the &amp; bit. 1-16-2024. Since the url gets passed in some click events, it may have gotten encoded. Particularly, the ampersand is a problem with this, as we need ActiveStateIdentifier to get passed properly.

            description = decodeURI(description);

            $('#divAttachmentsDialog1Contents').empty(); // We have to empty the contents of the dialog before it is displayed.
            $("#AttachmentsDialog1").dialog({
                modal: false,
                resizable: true,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: "720px",
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false,//, // This means when hiding just disappear with no effects.
                position: {
                    my: "middle top+12",
                    at: "middle top",
                    of: window
                },
                close: function () {
                    $('#divAttachmentsDialog1Contents').html(''); // Theoretically, clearing this will stop a .mp4 from playing...... ????? 3-19-2022. CONFIRMED! It works with Safari on MacBook! Woop!
                    $(this).dialog('destroy');
                },
                open: function () {
                    try {

                        var requestDialogId = 'AttachmentsDialog1';

                        $('#' + requestDialogId).css('overflow', 'hidden'); // This keeps the scroll bars from showing up on the form dialog!!!!!!!! 7-13-2020

                        var element = document.getElementById(requestDialogId).parentNode; // This is the best way to get a handle on the jquery dialog.
                        var requestDialogParentId = requestDialogId + '_Parent'; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.
                        element.id = requestDialogParentId; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.

                        // This creates the custom header/draggable bar on the dialog!!! 4-2-2020. // ☈ ☇ https://www.toptal.com/designers/htmlarrows/symbols/thunderstorm/
                        var html = '';

                        //alert('xcx2312312 adding dblclick here');
                        // added dbkl click here 12-28-2022
                        html += '<table xcx="xcx325432753" style="width:100%;" onclick="$(\'.bwAttachmentDialog_ForEmail\').bwAttachmentDialog_ForEmail(\'pinDialog\');" ondblclick="$(\'.bwAttachmentDialog_ForEmail\').bwAttachmentDialog_ForEmail(\'zoomAndCenter\', \'' + requestDialogId + '\');" >'; // This click event is like "pin". Once the user clicks the header of the request dialog, it no longer is modal and persists on the screen until they choose to close it.
                        html += '   <tr>';
                        html += '       <td style="width:95%;">';
                        html += '           <div id="slider_' + requestDialogId + '" style="width:20%;cursor:pointer;"></div>';
                        html += '       </td>';

                        html += '       <td style="vertical-align:middle;width:5%;padding:0;border:0;margin:0;">';

                        // 2-11-2022
                        //html += '           <div title="pin" class="pinButton" style="display:inline-block;font-size:18pt;cursor:pointer !important;" onclick="$(\'.bwRequest\').bwRequest(\'pinAttachmentsDialog\');"><img src="/images/pin2.jpeg" style="width:50px;height:50px;cursor:pointer !important;" onclick="$(\'.bwRequest\').bwRequest(\'pinAttachmentsDialog\');" /></div>';

                        html += '       </td>';




                        //
                        // Added pop-out window. 2-5-2024.
                        //
                        html += '       <td style="vertical-align:top;width:5%;padding:0;border:0;margin:0;">';

                        if (window.opener) {

                            html += '                   <span id="' + requestDialogId + '_spanRequestPrintButton" style="text-align:right;cursor:pointer;font-size:30pt;" onclick="$(\'.bwAttachmentDialog_ForEmail\').bwAttachmentDialog_ForEmail(\'LaunchIntoHomeWindow_AttachmentDialog\', \'' + bwBudgetRequestId + '\');">';
                            html += '                       ☈';
                            html += '                   </span>';

                        } else {

                            html += '           <span id="' + requestDialogId + '_spanRequestPrintButton" style="text-align:right;cursor:pointer;font-size:30pt;" onclick="$(\'.bwAttachmentDialog_ForEmail\').bwAttachmentDialog_ForEmail(\'LaunchIntoSeparateWindow_AttachmentDialog\', \'' + requestDialogId + '\', \'' + bwBudgetRequestId + '\', \'' + 'bwWorkflowTaskItemId' + '\', \'' + fileUrl + '\', \'' + filename + '\', \'' + description + '\');">';
                            html += '               ↸';
                            html += '           </span>';

                        }

                        html += '       </td>';
                        //
                        // end: Added pop-out window. 2-5-2024.
                        //









                        html += '       <td style="vertical-align:middle;width:5%;padding:0;border:0;margin:0;">';

                        html += '           <div title="print" class="printButton" xcx="xcx1232153667" style="display:inline-block;font-size:18pt;cursor:pointer !important;" onclick="$(\'.bwPrintButton\').bwPrintButton(\'PrintIndividualAttachment\', \'' + 'divAttachmentsDialog1Contents' + '\');"><img src="/images/iosprinter_blue.png" style="width:50px;height:50px;cursor:pointer !important;"  /></div>';

                        html += '       </td>';
                        html += '       <td>&nbsp;&nbsp;</td>';
                        html += '       <td>';

                        // changed 11-11-2022
                        //html += '           <span xcx="In bwAuthentication.js.displayAttachmentInDialog.AttachmentsDialog1.dialog.open()" class="dialogXButton" style="font-size:25pt;cursor:pointer;width:100%;font-weight:bold;" onclick="$(\'.bwPageScrollingHandler\').bwPageScrollingHandler(\'CloseDialogAndPreventNextWindowScrollEvent\', \'' + requestDialogId.replace('_Parent', '') + '\');">X</span>';
                        //html += '           <span xcx="In bwAttachmentDialog_ForEmail.js.displayAttachmentInDialog.AttachmentsDialog1.dialog.open()" class="dialogXButton" style="font-size:25pt;cursor:pointer;width:100%;font-weight:bold;" onclick="$(\'#' + requestDialogId + '\').dialog(\'close\');">X</span>';

                        // 2-16-2024 modified to support popped-out attachment window.
                        if (window.opener) {
                            // NOTE: WE need to come back here and get the window to check if the user made any changes to the attachment filename or metadata before closing the popped-out window.
                            console.log('NOTE: WE need to come back here and get the window to check if the user made any changes to the attachment filename or metadata before closing the popped-out window.');
                            html += '           <span xcx="In bwAttachmentDialog_ForEmail.js.displayAttachmentInDialog.AttachmentsDialog1.dialog.open()" class="dialogXButton" style="font-size:25pt;cursor:pointer;width:100%;font-weight:bold;" onclick="window.close();">X</span>';
                        } else {
                            html += '           <span xcx="In bwAttachmentDialog_ForEmail.js.displayAttachmentInDialog.AttachmentsDialog1.dialog.open()" class="dialogXButton" style="font-size:25pt;cursor:pointer;width:100%;font-weight:bold;" onclick="$(\'#' + requestDialogId + '\').dialog(\'close\');">X</span>';
                        }


                        html += '       </td>';
                        html += '   </tr>';
                        html += '</table>';
                        document.getElementById(requestDialogId).parentNode.querySelector(".ui-dialog-titlebar").innerHTML = html;

                        $("#slider_" + requestDialogId).slider({
                            min: 50,
                            max: 500, // changed 11-21-2022 // 200,
                            value: 100, // It starts off full size.
                            slide: function (event, ui) {
                                //thiz.setZoom(ui.value, requestDialogId);
                                $('.bwAttachmentDialog_ForEmail').bwAttachmentDialog_ForEmail('setZoom', ui.value, requestDialogId);
                            }//,
                            //change: function (event, ui) {
                            //    thiz.setZoom(ui.value, requestDialogId);
                            //}
                        });
                        try {
                            $('.bwAttachmentDialog_ForEmail').bwAttachmentDialog_ForEmail('setZoom', '100', requestDialogId);
                        } catch (e) { } // This is here because the backend doesn't use the bwRequest.js widget.
                    } catch (e) {
                        console.log('Exception in bwAttachments.js.AttachmentsDialog1.dialog.open(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwAttachments.js.AttachmentsDialog1.dialog.open(): ' + e.message + ', ' + e.stack);
                    }
                }
            });
            //$("#AttachmentsDialog1").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            //
            // Populate the attachments dialog.
            //

            var html = '';

            var filePathTruncated = fileUrl.split('?')[0];
            var extensionIndex = filePathTruncated.split('.').length - 1;
            var fileExtension = filePathTruncated.toLowerCase().split('.')[extensionIndex];

            if (['xlsx', 'xls'].indexOf(fileExtension) > -1) {

                // Excel attachments.
                $('#spanAttachmentsDialog1Title').html('<span style="font-size:30pt;font-weight:bold;color:lightgray;" xcx="xcx23214-1">Attachment Item</span> Select the link below to view the EXCEL document...');
                html += '<a href="' + fileUrl + '" target="_blank"><img xcx="xcx2314256" src="images/excelicon.png" style="width:100px;height:46px;cursor:pointer;" /></a>';
                html += '<a href="' + fileUrl + '" target="_blank">Click here to view in EXCEL</a>';
                //html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
                //html += '<a href="javascript:displayExcelDocumentInBrowser(\'' + fileUrl + '\');" target="_blank">Click here to view in browser</a>';

            } else if (['jfif', 'png', 'jpg', 'jpeg', 'bmp', 'gif', 'tiff', 'svg', 'webp'].indexOf(fileExtension) > -1) {

                // Images.
                $('#spanAttachmentsDialog1Title').html('<span style="font-size:30pt;font-weight:bold;color:lightgray;" xcx="xcx23214-2">Attachment Item</span>');
                html += '<img xcx="xcx3243674" src="' + fileUrl + '" style="width:700px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;" />';

            } else if (['pdf', 'rtf', 'doc', 'docx', 'txt', 'odt', 'ods', 'odp', 'xcf'].indexOf(fileExtension) > -1) {

                //// Documents.
                //$('#spanAttachmentsDialog1Title').html('<span style="font-size:30pt;font-weight:bold;color:lightgray;" xcx="xcx23214-3">Attachment Item</span> Select the link below to view the document...');
                //html += '<a href="' + fileUrl + '" target="_blank">Click here to view the document</a>';
                var msg = 'In bwAttachments.js.displayAttachmentInDialog(). DISPLAYING THE LINK FOR THE DOCUMENT. IS THIS LINK GOING TO WORK OK?';
                console.log(msg);
                //alert(msg);

                $('#spanAttachmentsDialog1Title').html('<span style="font-size:30pt;font-weight:bold;color:lightgray;" xcx="xcx23214-23242345">Attachment - PDF Viewer</span>');
                //
                //
                // WE ARE GOING TO DISPLAY THIS IN THE ATTACHMENTS DIALOG. // divAttachmentsDialog1Contents
                //
                //

                var html = '';

                html += `<div id="bwAttachmentsDialog_PdfViewer1"></div>
                                    <table style="width:100%;">
                                        <tr>
                                            <td>
                                            </td>
                                            <td>
                                                <div class="datasetNavigationButton" style="width:100px;float:left;" onclick="$(\'.bwAttachmentDialog:first\').bwAttachmentDialog(\'navigateToFirstPage\');">|<</div>
                                            </td>
                                            <td>
                                            </td>
                                            <td>
                                                <div class="datasetNavigationButton" style="width:100px;float:left;" onclick="$(\'.bwAttachmentDialog:first\').bwAttachmentDialog(\'navigateToPreviousPage\');"><</div>
                                            </td>
                                            <td>
                                            </td>
                                            <td>
                                                <div id="bwAttachmentsDialog_PdfViewer1_NumPages" style="width:100px;text-align:center;">[bwAttachmentsDialog_PdfViewer1_NumPages]</div>
                                            </td>
                                            <td>
                                            </td>
                                            <td>
                                                <div class="datasetNavigationButton" style="width:100px;float:right;" onclick="$(\'.bwAttachmentDialog:first\').bwAttachmentDialog(\'navigateToNextPage\');">></div>
                                            </td>
                                            <td>
                                            </td>
                                            <td>
                                                <div class="datasetNavigationButton" style="width:100px;float:left;" onclick="$(\'.bwAttachmentDialog:first\').bwAttachmentDialog(\'navigateToLastPage\');">>|</div>
                                            </td>
                                            <td>
                                            </td>
                                        </tr>
                                    </table>`;

                $('#divAttachmentsDialog1Contents').html(html);

                console.log('In xcx2312312(). DISPLAYING PDF. YES, WE CAN DISPLAY PDFs!!!!!!!!!!!!!!!!! Instantiating pdfjsLib object right here... is this best?');

                var url = fileUrl;
                var { pdfjsLib } = globalThis;
                pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.mjs';

                // Asynchronous download of PDF
                var loadingTask = pdfjsLib.getDocument(url);
                loadingTask.promise.then(function (pdf) {
                    console.log('PDF loaded');

                    thiz.options.pdf = pdf; // This makes it accessible when the user is switching pages.
                    thiz.options.numPages = pdf.numPages; // This makes it accessible when the user is switching pages.

                    // Fetch the first page
                    thiz.options.pageNumber = 1;
                    pdf.getPage(thiz.options.pageNumber).then(function (page) {
                        console.log('Page loaded');

                        var html = 'Displaying page ' + thiz.options.pageNumber + ' of ' + thiz.options.numPages;
                        $('#bwAttachmentsDialog_PdfViewer1_NumPages').html(html);

                        //var scale = 1.5;
                        var scale = 1.13; // This fits better.
                        var viewport = page.getViewport({ scale: scale });
                        thiz.options.pdfCanvas_viewport = viewport; // This allows us to access this from anywhere.

                        // Prepare canvas using PDF page dimensions
                        var canvasId = 'the-canvas';
                        var canvas = document.getElementById(canvasId);
                        if (!canvas) {
                            canvas = document.createElement('canvas');
                            canvas.id = canvasId;
                            //div.appendChild(canvas); 
                            document.getElementById('bwAttachmentsDialog_PdfViewer1').appendChild(canvas);
                        }
                        thiz.options.pdfCanvas = canvas; // This allows us to access this from anywhere.
                        var context = canvas.getContext('2d');
                        thiz.options.pdfCanvas_context = context; // This allows us to access this from anywhere.
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        // Render PDF page into canvas context
                        var renderContext = {
                            canvasContext: context,
                            viewport: viewport
                        };
                        var renderTask = page.render(renderContext);
                        renderTask.promise.then(function () {
                            console.log('Page rendered');
                        });
                    });
                }, function (reason) {

                    // PDF loading error
                    console.error(reason);
                    alert('Error xcx231312: ' + reason);

                });


            } else if (['mp3', 'm4a', 'm4r'].indexOf(fileExtension) > -1) { // .MP3 (audio), .MP4 (audio), .M4A (audio), .M4V (video), .M4R ("tones"), 

                // Audio.
                $('#spanAttachmentsDialog1Title').html('<span style="font-size:30pt;font-weight:bold;color:lightgray;" xcx="xcx23214-4">Attachment Item</span><br />Select the link below to listen...');
                if (iOSApp == 'YES') {
                    html += '<a href="' + fileUrl + '">Click here to listen</a>';
                } else {
                    html += '<div style="text-align:center;"><audio src="' + fileUrl + '" controls="controls" style="zoom:2.25">Click here to listen</audio></div>';
                }

                html += '<br />';
                html += '<a style="float:right;" href="' + fileUrl + '" download>Click here to download...</a>'; // This is the first a element with a download attribute... more to follow... 4-14-2022.

            } else if (['m4v', 'avi', 'mov', 'mp4'].indexOf(fileExtension) > -1) {

                // Video.
                var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');
                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

                //alert('Generating download utl. fix xcx239781234 fileUrl: ' + fileUrl);
                //var downloadUrl = 'https://shareandcollaborate.com' + '/' + '_files/' + workflowAppId + '/' + bwBudgetRequestId + '/' + filename + '?ActiveStateIdentifier=' + activeStateIdentifier;

                html += '<a href="' + fileUrl + '" download>Download</a>';
                //html += '<a onclick="$(\'.bwAttachments_ForEmail:first\').bwAttachments_ForEmail(\'downloadLargeFile\', \'' + bwBudgetRequestId + '\', \'' + filename + '\');" style="cursor:pointer;text-decoration:underline;">Download</a>';
                html += '<br />';

                html += '<br />';
                html += '<div style="font-weight:bold;color:tomato;" xcx="xcx345336777">';
                html += 'NOTE: Large videos may not play/work in this location until published to an EXTERNAL LOCATION. I recommend over 1GB, uploading with no processing, then publishing to an external location [Email attachments externally button on the request attachments section]. This will be addressed in the future.';
                html += '</div>';

                //$('#spanAttachmentsDialog1Title').html('<span style="font-size:30pt;font-weight:bold;color:lightgray;" xcx="xcx23214-3">Attachment Item</span> Select the link below to view the document...');
                //html += '<a href="' + fileUrl + '" target="_blank">Click here to view the document</a>';

                // Video.
                $('#spanAttachmentsDialog1Title').html('<span style="font-size:30pt;font-weight:bold;color:lightgray;" xcx="xcx23214-5">Attachment Item</span>');
                if (iOSApp == 'YES') {
                    html += '<a href="' + fileUrl + '">Click here to view</a>';
                } else {

                    var obj = document.createElement("video");
                    //alert('Video test of video/mp4: ' + obj.canPlayType("video/mp4")); // "maybe"
                    //alert('Video test of video/webm: ' + obj.canPlayType("video/webm")); // "maybe"

                    //html += '<div style="text-align:center;"><video xcx="xcx3345-1" controls="controls" width="650" ><source src="' + fileUrl + '" type="video/mp4"></video></div>'; // This sets the size of the video control\element.
                    //html += '<div style="text-align:center;"><video xcx="xcx3345-1" controls="controls" width="650" ><source src="' + fileUrl + '" type="video/webm; codecs=\'vp8, vorbis\'"></video></div>'; // This sets the size of the video control\element.
                    html += '<div style="text-align:center;"><video xcx="xcx3345-1" controls="controls" width="650" ><source src="' + fileUrl + '" type="video/mp4"></video></div>'; // This sets the size of the video control\element.
                }

            } else {

                // 4-13-2023

                //$('#spanAttachmentsDialog1Title').html('<span style="font-size:30pt;font-weight:bold;color:lightgray;" xcx="xcx23214-6">Attachment Item</span> This attachment has an unknown file extension...');
                //html += '<a href="' + fileUrl + '" target="_blank">Click here to try to open this file</a>';

                //alert('xcx1231241 fileUrl: ' + fileUrl);

                $('#spanAttachmentsDialog1Title').html('<span style="font-size:30pt;font-weight:bold;color:lightgray;" xcx="xcx23214-6-1">Attachment Item</span> This attachment has an unknown file extension of ".' + fileExtension + '".');
                html += '<a xcx="xcx21432356-3" href="' + fileUrl + '" target="_blank">Click here to try to open this file</a>';

            }
            $('#divAttachmentsDialog1Contents').html(html);

            // Create the "Save" button.
            html = '';
            html += '<div id="btnAttachmentsDialog1SaveMetadata" class="divDialogButton" onclick="$(\'.bwAttachments_ForEmail:first\').bwAttachments_ForEmail(\'cmdSaveAttachmentMetadata\', \'' + bwBudgetRequestId + '\', \'' + filename + '\');">Save</div>';
            $('#spanAttachmentsDialog1SaveMetadataButton').html(html);

            // Create the "Delete" button.
            html = '';
            html += '<div id="btnAttachmentsDialog1DeleteAttachment" class="divDialogButton" onclick="$(\'.bwAttachments_ForEmail:first\').bwAttachments_ForEmail(\'cmdDeleteAttachment\', \'' + bwBudgetRequestId + '\', \'' + filename + '\');">Delete</div>';
            $('#spanAttachmentsDialog1DeleteAttachmentButton').html(html);

            // 4-29-2023
            // OCR
            html = '';
            html += '<div id="btnAttachmentsDialog1_PerformOCRButton" class="divDialogButton" onclick="$(\'.bwAttachments_ForEmail:first\').bwAttachments_ForEmail(\'performOCR\', \'' + bwBudgetRequestId + '\', \'' + filename + '\');">Image OCR</div>';
            $('#spanAttachmentsDialog1_PerformOCRButton').html(html);
            // $('.bwAttachments:first').bwAttachments('launchFileConversion', 'bwBudgetRequestIdxcx234111', 'filenamexcx2423423425');

            // 10-6-2022
            // Create the "spanAttachmentsDialog1_LaunchFleConversionButton" button.
            html = '';
            html += '<div id="btnAttachmentsDialog1_LaunchFileConversionButton" class="divDialogButton" onclick="$(\'.bwAttachments_ForEmail:first\').bwAttachments_ForEmail(\'launchFileConversion\', \'' + bwBudgetRequestId + '\', \'' + filename + '\');">Launch file conversion...</div>';
            $('#spanAttachmentsDialog1_LaunchFileConversionButton').html(html);
            // $('.bwAttachments:first').bwAttachments('launchFileConversion', 'bwBudgetRequestIdxcx234111', 'filenamexcx2423423425');

            // 11-30-2023.
            html = '';
            html += '<div id="btnAttachmentsDialog1_LaunchFileConversionButton2" class="divDialogButton" onclick="$(\'.bwAttachments_ForEmail:first\').bwAttachments_ForEmail(\'ConvertMediaFileToBaselineShareable\', \'' + bwBudgetRequestId + '\', \'' + filename + '\');">Convert media file to<br />baseline shareable...<br />DEV NOTE: Only 1 per <br />request at 1 time</div>';
            $('#spanAttachmentsDialog1_LaunchFileConversionButton2').html(html);

            // 10-6-2022
            // Create the "Get EXIF data (metadata)" button.
            html = '';
            html += '<div id="btnAttachmentsDialog1_GetExifDataButton" class="divDialogButton" onclick="$(\'.bwAttachments_ForEmail:first\').bwAttachments_ForEmail(\'getExifData\', \'' + bwBudgetRequestId + '\', \'' + filename + '\');">Image analysis</div>';
            $('#spanAttachmentsDialog1_GetExifDataButton').html(html);
            // $('.bwAttachments:first').bwAttachments('launchFileConversion', 'bwBudgetRequestIdxcx234111', 'filenamexcx2423423425');

            // 5-29-2023
            // Repair file type
            html = '';
            html += '<div id="btnAttachmentsDialog1_PerformOCRButton" class="divDialogButton" onclick="$(\'.bwAttachments_ForEmail:first\').bwAttachments_ForEmail(\'repairFileType\', \'' + bwBudgetRequestId + '\', \'' + filename + '\');">Repair file type</div>';
            $('#spanAttachmentsDialog1_RepairFileTypeButton').html(html);
            // $('.bwAttachments:first').bwAttachments('launchFileConversion', 'bwBudgetRequestIdxcx234111', 'filenamexcx2423423425');

            //// Bind the "Save" button.
            //$('#btnAttachmentsDialog1SaveMetadata').click(function (error) {
            //    cmdSaveAttachmentMetadata(bwBudgetRequestId, filename);
            //});

            //// Bind the "Delete" button.
            //$('#btnAttachmentsDialog1DeleteAttachment').click(function (error) {
            //    cmdDeleteAttachment(bwBudgetRequestId, filename);
            //});

            // Populate the dialog with the filename and description.
            if (filename != 'undefined') {
                var extensionIndex = filename.lastIndexOf('.');
                var filenamePrefix = filename.substring(0, extensionIndex);
                var fileExtension = '.' + filename.substring(extensionIndex + 1, filename.length);
                document.getElementById('txtAttachmentsDialog1Filename').value = filenamePrefix;
                document.getElementById('spanAttachmentsDialog1FileExtension').innerHTML = fileExtension;
            } else {
                document.getElementById('txtAttachmentsDialog1Filename').value = '';
            }

            if (filename != 'description') document.getElementById('txtAttachmentsDialog1FileDescription').value = description;
            else document.getElementById('txtAttachmentsDialog1FileDescription').value = '';

        } catch (e) {
            var msg = 'Exception in bwAttachmentDialog_ForEmail.js.displayAttachmentInDialog():2:' + e.message + ', fileUrl: ' + fileUrl + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
        }
    },

    LaunchIntoSeparateWindow_AttachmentDialog: function (requestDialogId, bwBudgetRequestId, bwWorkflowTaskItemId, fileUrl, filename, description) { // See also method displayRequestFormInNewBrowserWindow().
        try {
            console.log('In bwAttachmentDialog_ForEmail.js.LaunchIntoSeparateWindow_AttachmentDialog().');
            //alert('In bwAttachmentDialog_ForEmail.js.LaunchIntoSeparateWindow_AttachmentDialog().');

            var rect = document.getElementById(requestDialogId).getBoundingClientRect();
            var height = rect.bottom - rect.top;
            var width = rect.right - rect.left;

            // When opening a dialog in a new browser window, we need to use a distinct url. For example: https://budgetworkflow.com/?ActiveStateIdentifier=3e4e2de9-7d5b-476f-a34e-a4eaa0472b44&request=4691d358-c148-4df8-aa1b-70ee1bde0cc0
            var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier')).ActiveStateIdentifier;
            //var url = this.options.operationUriPrefix + '?ActiveStateIdentifier=' + activeStateIdentifier + '&request=' + bwBudgetRequestId + '&taskid=' + bwWorkflowTaskItemId + '&openrequest=1';
            var url = this.options.operationUriPrefix + '?ActiveStateIdentifier=' + activeStateIdentifier + '&request=' + bwBudgetRequestId + '&openattachment=1';



            console.log('xcx2312345 In LaunchIntoSeparateWindow_AttachmentDialog(). fileUrl: ' + fileUrl + ', filename: ' + filename + ', description: ' + description);



            // When the window.open is called, bwAuthentication.js.checkIfAuthenticatedAndProcessQuerystringParameters() handles the loading of the request form... by calling bwRequest.js.displayRequestFormInNewBrowserWindow().
            //$('#' + requestDialogId).dialog({ bwForceClose: true }); // Doing this at the top so we avoid a race condition. Keep this here for readability.
            //var windowObjectReference = window.open(url, requestDialogId, 'toolbar=no,width=' + width + ',height=' + height + ',left=500,top=200,status=no,scrollbars=no,resize=no,location=0');



            // 2-16-2024 Doing this to provide support for multiple popped-out attachment dialogs. I don't want to support multiple ones in the main window, not sure how to reconcile that yet....or if it even a problem. :)
            //var windowObjectReference = window.open(url, requestDialogId, 'toolbar=no,width=' + width + ',height=' + height + ',left=500,top=200,status=no,scrollbars=no,resize=no,location=0'); // This only allows 1 popped-out attachment dialog window.

            var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            var windowObjectReference = window.open(url, guid, 'toolbar=no,width=' + width + ',height=' + height + ',left=500,top=200,status=no,scrollbars=no,resize=no,location=0');










            if (!windowObjectReference) {

                // The window wasn't allowed to open. This is likely caused by built-in popup blockers.
                console.log('The window wasn\'t allowed to open. This is likely caused by built-in popup blockers.');
                displayAlertDialog('The window wasn\'t allowed to open. This is likely caused by built-in popup blockers.');

            } else {

                // Store this instance of a popped-out window in bwAuthentication.options.poppedOutRequestWindows
                var poppedOutAttachmentWindows = $('.bwAuthentication:first').bwAuthentication('option', 'poppedOutAttachmentWindows');
                if (!(poppedOutAttachmentWindows && poppedOutAttachmentWindows.length)) {
                    poppedOutAttachmentWindows = [];
                }
                var poppedOutWindow = {
                    windowWidgetType: 'bwAttachmentDialog_ForEmail', // 'bwRequest',
                    requestDialogId: requestDialogId,
                    bwBudgetRequestId: bwBudgetRequestId,
                    bwWorkflowTaskItemId: bwWorkflowTaskItemId,
                    fileUrl: fileUrl,
                    filename: filename,
                    description: description,
                    windowObjectReference: windowObjectReference
                }
                poppedOutAttachmentWindows.push(poppedOutWindow);
                $('.bwAuthentication:first').bwAuthentication({ poppedOutAttachmentWindows: poppedOutAttachmentWindows });

                //// Store this instance of a popped-out window in bwAuthentication.options.poppedOutRequestWindows
                //var poppedOutRequestWindows = $('.bwAuthentication:first').bwAuthentication('option', 'poppedOutRequestWindows');
                //if (!(poppedOutRequestWindows && poppedOutRequestWindows.length)) {
                //    poppedOutRequestWindows = [];
                //}
                //var poppedOutWindow = {
                //    windowWidgetType: 'bwRequest',
                //    requestDialogId: requestDialogId,
                //    bwBudgetRequestId: bwBudgetRequestId,
                //    bwWorkflowTaskItemId: bwWorkflowTaskItemId,
                //    windowObjectReference: windowObjectReference
                //}
                //poppedOutRequestWindows.push(poppedOutWindow);
                //$('.bwAuthentication:first').bwAuthentication({ poppedOutRequestWindows: poppedOutRequestWindows });

            }

        } catch (e) {
            console.log('Exception in bwAttachmentDialog_ForEmail.js.LaunchIntoSeparateWindow_AttachmentDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwAttachmentDialog_ForEmail.js.LaunchIntoSeparateWindow_AttachmentDialog(): ' + e.message + ', ' + e.stack);
        }
    },
    LaunchIntoHomeWindow_AttachmentDialog: function (bwBudgetRequestId) {
        try {
            console.log('In bwAttachmentDialog_ForEmail.js.LaunchIntoHomeWindow_AttachmentDialog(). bwBudgetRequestId: ' + bwBudgetRequestId);
            //alert('In bwAttachmentDialog_ForEmail.js.LaunchIntoHomeWindow_AttachmentDialog(). bwBudgetRequestId: ' + bwBudgetRequestId);

            // Since we are returning this popped-out window to the home browser window, we need to remove it from this list.
            //var poppedOutAttachmentWindows = window.opener.$('.bwAuthentication:first').bwAuthentication('option', 'poppedOutAttachmentWindows');

            //var alreadyDisplayingTheAttachment = false;
            //if (poppedOutAttachmentWindows && poppedOutAttachmentWindows.length && (poppedOutAttachmentWindows.length > 0)) {
            //    for (var i = 0; i < poppedOutAttachmentWindows.length; i++) {
            //        if (poppedOutAttachmentWindows[i].bwBudgetRequestId == bwBudgetRequestId) {
            //            alreadyDisplayingTheAttachment = true;
            //            poppedOutAttachmentWindows.splice(i, 1); // This removes it from the list. It needs to be removed from the list for it to be displayed, because we never display the same attachment twice!!!! :)
            //            $('.bwAuthentication:first').bwAuthentication({ poppedOutAttachmentWindows: poppedOutAttachmentWindows });
            //            break;
            //        }
            //    }
            //}

            //if (alreadyDisplayingTheAttachment != true) {

            //    var msg = 'Unrecoverable error in bwAttachmentDialog_ForEmail.js.LaunchIntoHomeWindow_AttachmentDialog(). The request window did not exist in the poppedOutAttachmentWindows array. bwBudgetRequestId: ' + bwBudgetRequestId;
            //    console.log(msg);
            //    displayAlertDialog(msg);

            //} else {

            // This closes the popped-out window, and re-displays it within the website main browser window.

            var poppedOutWindow_Json;
            var thisWindow_ObjectReference = document.defaultView || document.parentWindow;
            var poppedOutAttachmentWindows = window.opener.$('.bwAuthentication').bwAuthentication('option', 'poppedOutAttachmentWindows');
            for (var i = 0; i < poppedOutAttachmentWindows.length; i++) {
                if (poppedOutAttachmentWindows[i].windowObjectReference === thisWindow_ObjectReference) {
                    debugger;
                    console.log('xcx22233 found the window object reference.');
                    poppedOutWindow_Json = poppedOutAttachmentWindows[i];
                }
            }

            displayAlertDialog_Persistent('xcx21325644 FOUND: fileUrl: ' + poppedOutWindow_Json.fileUrl + ', filename: ' + poppedOutWindow_Json.filename + ', description: ' + poppedOutWindow_Json.description);

            //window.opener.$('.bwRequest').bwRequest('displayArInDialog', 'https://budgetworkflow.com', bwBudgetRequestId, '', '', '', '', bwWorkflowTaskItemId, bwRequestJson); // bwWorkflowTaskItemId

            window.opener.$('.bwAttachmentDialog_ForEmail').bwAttachmentDialog_ForEmail('displayAttachmentInDialog', poppedOutWindow_Json.fileUrl, poppedOutWindow_Json.filename, poppedOutWindow_Json.description, poppedOutWindow_Json.bwBudgetRequestId);



            window.close(); // close the popup window.

            //}

            //// Scrape the JSON from the popped-out request form.
            //console.log('Calling bwRequest.js.scrapeBwRequestJson(). xcx1231242-4');
            //var promise = $('.bwRequest').bwRequest('scrapeBwRequestJson', bwBudgetRequestId);
            //promise.then(function (bwRequestJson) {
            //    try {

            //        console.log('Returning from scrapeBwRequestJson(). xcx2131241-4');
            //        //thiz.populateNewRequestForm('divPageContent1', bwRequestTypeId, JSON.stringify(bwRequestJson));



            //        var bwWorkflowTaskItemId;
            //        try {
            //            bwWorkflowTaskItemId = $('.bwAuthentication').bwAuthentication('getUrlParams')['taskid'].toString().split('#')[0]; // getUrlParams()['taskid'].toString().split('#')[0];
            //        } catch (e) {
            //            console.log('Caught exception in bwAttachmentDialog_ForEmail.js.LaunchIntoHomeWindow_AttachmentDialog(): Cannot set bwWorkflowTaskItemId, url param [taskid] is not present.');
            //        }

            //        console.log('In bwAttachmentDialog_ForEmail.js.LaunchIntoHomeWindow_AttachmentDialog(). Calling displayArInDialog from a popped-out window.... bwBudgetRequestId: ' + bwBudgetRequestId + ', bwWorkflowTaskItemId: ' + bwWorkflowTaskItemId + ', bwRequestJson: ' + JSON.stringify(bwRequestJson));





            //        // 1-15-2023
            //        // Since we are returning this popped-out window to the home browser window, we need to remove it from this list.
            //        var poppedOutRequestWindows = window.opener.$('.bwAuthentication:first').bwAuthentication('option', 'poppedOutRequestWindows');

            //        var alreadyDisplayingTheRequest = false;
            //        if (poppedOutRequestWindows && poppedOutRequestWindows.length && (poppedOutRequestWindows.length > 0)) {
            //            for (var i = 0; i < poppedOutRequestWindows.length; i++) {
            //                if (poppedOutRequestWindows[i].bwBudgetRequestId == bwBudgetRequestId) {
            //                    alreadyDisplayingTheRequest = true;
            //                    poppedOutRequestWindows.splice(i, 1); // This removes it from the list. It needs to be removed from the list for it to be displayed, because we never display the same request twice!!!! :)
            //                    $('.bwAuthentication:first').bwAuthentication({ poppedOutRequestWindows: poppedOutRequestWindows });
            //                    break;
            //                }
            //            }
            //        }

            //        if (alreadyDisplayingTheRequest != true) {

            //            var msg = 'Unrecoverable error in bwAttachmentDialog_ForEmail.js.LaunchIntoHomeWindow_AttachmentDialog(). The request window did not exist in the poppedOutRequestWindows array. bwBudgetRequestId: ' + bwBudgetRequestId;
            //            console.log(msg);
            //            displayAlertDialog(msg);

            //        } else {

            //            // This closes the exploded window, and re-displays it within the website main browser window.
            //            window.opener.$('.bwRequest').bwRequest('displayArInDialog', 'https://budgetworkflow.com', bwBudgetRequestId, '', '', '', '', bwWorkflowTaskItemId, bwRequestJson); // bwWorkflowTaskItemId
            //            window.close(); // close the popup window.

            //        }

            //    } catch (e) {
            //        console.log('Exception in bwAttachmentDialog_ForEmail.js.LaunchIntoHomeWindow_AttachmentDialog.scrapeBwRequestJson(): ' + e.message + ', ' + e.stack);
            //        displayAlertDialog('Exception in bwAttachmentDialog_ForEmail.js.LaunchIntoHomeWindow_AttachmentDialog.scrapeBwRequestJson(): ' + e.message + ', ' + e.stack);
            //    }
            //})
            //    .catch(function (result) {

            //        alert('In LaunchIntoHomeWindow_AttachmentDialog(). Promise returned exception: ' + result.message);

            //    });

        } catch (e) {
            console.log('Exception in bwAttachmentDialog_ForEmail.js.LaunchIntoHomeWindow_AttachmentDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwAttachmentDialog_ForEmail.js.LaunchIntoHomeWindow_AttachmentDialog(): ' + e.message + ', ' + e.stack);
        }
    },

    setZoom: function (originalZoom, elementId) {
        try {
            console.log('In bwAttachmentDialog_ForEmail.js.setZoom(' + originalZoom + ', ' + elementId + ')');
            //alert('In bwAttachmentDialog_ForEmail.js.setZoom(' + originalZoom + ', ' + elementId + ')');
            var thiz = this;

            if (window.opener) {
                // This is a popped-out request wndow... we need to handle zoom differently here.
                console.log('In bwAttachmentDialog_ForEmail.js.setZoom(). This is a popped-out request wndow... we need to handle zoom differently here. originalZoom: ' + originalZoom + ', elementId: ' + elementId);
            }

            if (originalZoom > 20) { // Don't make any smaller than this!
                var zoom = originalZoom / 100;

                if (window.opener) {
                    // This is a popped-out request wndow... we need to handle zoom differently here.

                    console.log('In bwAttachmentDialog_ForEmail.js.setZoom(). This is a popped-out request wndow... we need to handle zoom differently here. originalZoom: ' + originalZoom + ', elementId: ' + elementId);
                    var el = document.body; //.getElementById(elementId);

                    transformOrigin = [0, 0];

                    var p = ["webkit", "moz", "ms", "o"],
                        s = "scale(" + zoom + ")",
                        oString = (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%";

                    for (var i = 0; i < p.length; i++) {
                        el.style[p[i] + "Transform"] = s;
                        el.style[p[i] + "TransformOrigin"] = oString;
                    }

                    el.style["transform"] = s;
                    el.style["transformOrigin"] = oString;



                    // weird fix, elementId coming in a variety of ways. 4-3-2023
                    var rectElement_Id = 'AttachmentsDialog1_Parent';
                    //if (elementId.indexOf('divRequestFormDialog_') > -1) {
                    //    rectElement_Id = elementId + '_Parent';
                    //} else {
                    //    rectElement_Id = 'divRequestFormDialog_' + elementId + '_Parent';
                    //}



                    // Now get the bounding rect, and resize the entire window...
                    //var rectElement = $('#budgetrequestform').find('.xdFormLayout')[0]; 
                    var rectElement = document.getElementById(rectElement_Id); // ('#' + rectElement_Id); // The request dialog.

                    console.log('xcx888-2 popped out window sizing happening here rectElement_Id: ' + rectElement_Id);
                    if (rectElement) {
                        var rect = rectElement.getBoundingClientRect();

                        var height_not_baselined = rect.bottom - rect.top;
                        var width_not_baselined = rect.right - rect.left + 40; // 20px for horizontal scroll bar.

                        var height = height_not_baselined * zoom;
                        var width = width_not_baselined * zoom;

                        console.log('xcx21312342-2 rectElement: ' + rectElement + '. weird fix for poppede out window, the window was getting too small and just disturbing ui/flash. 4-3-2023 xcx6665 width_not_baselined: ' + width_not_baselined + ', width: ' + width + ', zoom: ' + zoom);
                        //alert('height: ' + height);
                        if (height < 200) { // weird fix, the window was getting too small and just disturbing ui/flash. 4-3-2023 xcx6665
                            height = 1000;
                        }

                        window.resizeTo(width, height);

                        console.log('xcx21335-2 In bwAttachmentDialog_ForEmail.js.setZoom(' + originalZoom + ', ' + elementId + '). window.resizeTo width: ' + width + ', height: ' + height);
                    }

                } else {
                    console.log('In bwAttachmentDialog_ForEmail.js.setZoom(' + originalZoom + ', ' + elementId + ')');

                    elementId = elementId.replace('_Parent', '');
                    elementId += '_Parent'; // This just makes sure it is here! :)
                    var el = document.getElementById(elementId);

                    transformOrigin = [0, 0];

                    var p = ["webkit", "moz", "ms", "o"],
                        s = "scale(" + zoom + ")",
                        oString = (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%";

                    for (var i = 0; i < p.length; i++) {
                        el.style[p[i] + "Transform"] = s;
                        el.style[p[i] + "TransformOrigin"] = oString;
                    }

                    el.style["transform"] = s;
                    el.style["transformOrigin"] = oString;


                    this.pinDialog(); // Gets rid of the clickable greyed out background... Makes the dialog not-modal.
                }

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
            console.log('Exception in bwAttachmentDialog_ForEmail.js.setZoom(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwAttachmentDialog_ForEmail.js.setZoom(): ' + e.message + ', ' + e.stack);
        }
    },

    pinDialog: function () { // Renamed from pinRequestDialog() 2-16-2024.
        try {
            console.log('In pinDialog().');
            // This makes the dialog non-modal, so that it can be dragged around and the underlying functionality accessible. This removes the overlay that makes the dialog modal, and also removes the click event which would have originally closed the request dialog.
            // The idea is to be able to have multiple requests open at once!
            $('.ui-widget-overlay').unbind('click');
            $(".ui-widget-overlay").remove();

            console.log('In pinDialog(). Scrolling window to top. This is experimental. Added a setTimeout to prevent race condition... 11-17-2022');
            //setTimeout(function () {
            $(window).scrollTop(0);
            //}, 1);


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
            console.log('Exception in pinDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in pinDialog(): ' + e.message + ', ' + e.stack);
        }
    },

    zoomAndCenter: function (elementId) {
        try {
            console.log('In bwAttachmentDialog_ForEmail.js.zoomAndCenter(). elementId: ' + elementId);
            //alert('In bwRequest.js.zoomAndCenter(). elementId: ' + elementId); // divRequestFormDialog_13041396-f4ee-4b9d-a4e5-056d409c4b04

            var elementId2 = elementId + '_Parent'; // This just makes sure it is here! :)
            var el = document.getElementById(elementId2);
            debugger;

            var scale = 1; // Added this line 2-16-2024, not 100% working yet...
            var transform = JSON.stringify(el.style["transform"]);
            if (transform) {
                var tmp = transform.split('scale(')[1];
                try {
                    var scale = tmp.split(')')[0];
                } catch (e) {
                    console.log('xcx23124 bwAttachmentDialog_ForEmail.js.zoomAndCenter() small issue here, it works but maybe improved?......');
                    alert('xcx23124 bwAttachmentDialog_ForEmail.js.zoomAndCenter() small issue here, it works but maybe improved?......');
                }
            } else {
                var scale = '2';
            }

            if (scale == '1') {

                this.setZoom('200', elementId);


                // 12-16-2023. xcx123123423514354. Ther eis another one.
                var width1 = window.innerWidth / 7;
                console.log('xcx888747 THIS IS THE POSITIONG OF THE REQUEST DIALOG. 7 seems to be the magic number. width1: ' + width1);
                //displayAlertDialog_Persistent('xcx888747 THIS IS THE POSITIONG OF THE REQUEST DIALOG. 7 seems to be the magic number. width1: ' + width1);
                position = {
                    my: "center top",
                    at: "center-" + width1 + " top",
                    of: window,
                    collision: "fit"
                }






                $('#' + elementId).dialog({
                    //position: { my: "center top", at: "center top", of: window }
                    //position: { my: "left top", at: "left top", of: window }
                    position: position
                });

                console.log('xcx453456 Calling bwJustificationDetailsField.js.ToggleExpandJustificationDetails(). scale=1');
                //$(document).find("[aria-describedby='" + elementId + "']").find('.bwJustificationDetailsField').bwJustificationDetailsField('ToggleExpandJustificationDetails'); // NO, THIS IS JUST A PAIN IN THE ARSE. 10-20-2023.

            } else if (scale == '2') {

                //this.setZoom('300', elementId); // commented out 11-18-2023. I dont think we need the fulscreen version...?
                //$('#' + elementId).dialog({
                //    position: { my: "left top", at: "left top", of: window }
                //});

                this.setZoom('100', elementId);

                $('#' + elementId).dialog({
                    //position: { my: "center top", at: "center top", of: window }
                    //position: { my: "right top", at: "right top", of: window }
                    position: position
                });

                console.log('xcx453456 Calling bwJustificationDetailsField.js.ToggleExpandJustificationDetails(). scale=2');
                //$(document).find("[aria-describedby='" + elementId + "']").find('.bwJustificationDetailsField').bwJustificationDetailsField('ToggleExpandJustificationDetails'); // NO, THIS IS JUST A PAIN IN THE ARSE. 10-20-2023.

            } else if (scale == '3') {

                this.setZoom('100', elementId);

                $('#' + elementId).dialog({
                    //position: { my: "center top", at: "center top", of: window }
                    //position: { my: "right top", at: "right top", of: window }
                    position: position
                });

                console.log('xcx453456 Calling bwJustificationDetailsField.js.ToggleExpandJustificationDetails(). scale=3');
                //$(document).find("[aria-describedby='" + elementId + "']").find('.bwJustificationDetailsField').bwJustificationDetailsField('ToggleExpandJustificationDetails'); // NO, THIS IS JUST A PAIN IN THE ARSE. 10-20-2023.

            } else {

                var msg = 'In bwAttachmentDialog_ForEmail.js.zoomAndCenter(). Unexpected value for transform. Expected 1 or 2 or 3. transform: ' + transform + ', scale: ' + scale;
                console.log(msg);
                //displayAlertDialog(msg);

                this.setZoom('100', elementId);

                $('#' + elementId).dialog({
                    position: { my: "center top", at: "center top", of: window }
                });

            }

        } catch (e) {
            console.log('Exception in bwAttachmentDialog_ForEmail.js.zoomAndCenter(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwAttachmentDialog_ForEmail.js.zoomAndCenter(): ' + e.message + ', ' + e.stack);
        }
    },

});