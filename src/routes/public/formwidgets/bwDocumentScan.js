$.widget("bw.bwDocumentScan", {
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
        This is the bwDocumentScan.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        elementIdSuffix: null, // This is a custom guid which gets appended to element id's, making sure this widget keeps to itself.

        jsonData: null,


        width: 320,    // We will scale the photo width to this
        height: 0,     // This will be computed based on the input stream
        video: null,
        canvas: null,
        photo: null,
        startbutton: null,














        fieldTitle: 'Document Scan', // This is the title, which shows up on the form in the left column.

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
        console.log('In bwDocumentScan.js._create().');
        this.element.addClass("bwDocumentScan");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {

            selfDiscoverOperationUri(thiz); // This sets this.options.operationUriPrefix correctly.

            var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            this.options.elementIdSuffix = guid;

            if (this.options.inFormsEditor == true) {

                console.log('In bwDocumentScan.js._create().option.inFormsEditor == true.');
                this.renderAndPopulateAttachments_ReadOnly(); // Need to render, not allowing the user to make modifications.

            } else if (this.options.allowRequestModifications == false) {

                console.log('In bwDocumentScan.js._create().option.allowRequestModifications == false.');
                this.renderAndPopulateAttachments_ReadOnly(); // Need to render, not allowing the user to make modifications.

            } else if (this.options.allowRequestModifications == true) {

                console.log('In bwDocumentScan.js._create().option.allowRequestModifications == true.');
                this.renderAndPopulateAttachments();

            } else {
                var html = '';
                html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwDocumentScan</span>';
                html += '<br />';
                html += '<span style="">Invalid value for allowRequestModifications: ' + this.options.allowRequestModifications + '</span>';
                this.element.html(html);
            }



        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwDocumentScan</span>';
            html += '<br />';
            html += '<span style="">Exception in bwDocumentScan.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwDocumentScan")
            .text("");
    },
    getDataType: function () {
        try {
            console.log('In bwDocumentScan.js.getDataType().');

            return 'attachments';
        } catch (e) {
            console.log('Exception in bwDocumentScan.js.getDataType(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwDocumentScan.js.getDataType(): ' + e.message + ', ' + e.stack);
        }
    },
    getData: function () {
        try {
            console.log('In bwDocumentScan.getData().');
            var value = $(this.element).find('#newrequestattachments')[0].innerHTML.trim();
            if (value != '') {
                return 'has attachments';
            } else {
                return null;
            }
        } catch (e) {
            console.log('Exception in bwDocumentScan.getData(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwDocumentScan.getData(): ' + e.message + ', ' + e.stack);
        }
    },
    isARequiredField: function () {
        try {
            console.log('In bwDocumentScan.isARequiredField().');
            return this.options.renderAsARequiredField;
        } catch (e) {
            console.log('Exception in bwDocumentScan.isARequiredField(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwDocumentScan.isARequiredField(): ' + e.message + ', ' + e.stack);
        }
    },
    getfieldTitle: function () {
        try {
            console.log('In bwDocumentScan.getfieldTitle().');
            return this.options.fieldTitle;
        } catch (e) {
            console.log('Exception in bwDocumentScan.getfieldTitle(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwDocumentScan.getfieldTitle(): ' + e.message + ', ' + e.stack);
        }
    },

    renderAndPopulateAttachments: function () {
        try {
            console.log('');
            console.log('##################################');
            console.log('In bwDocumentScan.js.renderAndPopulateAttachments().');
            console.log('##################################');
            console.log('');
            var thiz = this;

            var requestDialogId;

            var bwBudgetRequestId = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');

            if (!bwBudgetRequestId) {

                alert('Error in bwDocumentScan.js.xx(). Unexpected value for bwBudgetRequestId: ' + bwBudgetRequestId);
                displayAlertDialog('Error in bwDocumentScan.js.xx(). Unexpected value for bwBudgetRequestId: ' + bwBudgetRequestId);

            } else {



                var requestDialogId = 'divRequestFormDialog_' + bwBudgetRequestId; // eg: divRequestFormDialog_d338d498-987f-4fec-872a-3fe6a3cc65c7
                if ($('#' + requestDialogId)) {
                    // This is the name of the dialog.
                } else {
                    requestDialogId = 'divCreateRequestFormContent'; // This is the name of the dialog.
                }

                var html = '';

                html += '<table style="height:100%;vertical-align:top;">';
                html += '   <tbody>';
                html += '       <tr xcx="xcx21342526-1" id="xcx21342526-1" class="xdTableOffsetRow xdTableOffsetRow-editor" id="toolboxdraggablerow_2" draggable="true" bwwidgetname="bwDocumentScan">';
                html += '           <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px;height:100%;">';
                html += '               <table style="height:100%;">';
                html += '                   <tr style="height:1%;">';
                html += '                       <td style="vertical-align:top;">';
                html += '                           <span class="xdlabel" style="color:black;">';
                html += '                               Document Scan:';
                html += '                           </span>';
                if (this.options.renderAsARequiredField == true) {
                    html += '                       <span style="color:red;font-size:medium;">*</span>';
                } else if (this.options.renderAsARequiredField == false) {
                    //
                } else {
                    html += '                       <span class="ToggleRequiredAsterisk" title="Select this asterick to make this a required field." onclick="$(\'.bwFormsEditor\').bwFormsEditor(\'toggleFormRequiredField\', this);">*</span>';
                }
                html += '                       </td>';
                html += '                   </tr>';
                html += '                   <tr style="height:99%;">';
                html += '                       <td style="vertical-align:top;">';

                //if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {
                //    // Don't display this section on iPad, iPhone, iPod.
                //} else {
                //    html += '                           <table id="dropzone1" contenteditable="true" style="height:100%;border:1px solid goldenrod;background-color:#f6f6f6;color:gray;font-size:10pt;">';
                //    html += '                               <tr>';
                //    html += '                                   <td style="vertical-align:middle;">';
                //    html += '                                       <span style="color:goldenrod;">Drag-and-drop, or right-click to paste attachments here.</span>';
                //    html += '                                   </td>';
                //    html += '                               </tr>';
                //    html += '                           </table>';
                //}

                html += '                       </td>';
                html += '                   </tr>';
                html += '               </table>';
                html += '           </td>';
                html += '           <td class="xdTableOffsetCellComponent" style="white-space:nowrap;text-align:left; VERTICAL-ALIGN: top; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">';

                // ABILITY TO DROP AN ATTACHMENT FROM ANOTHE isplayed request dialog! 4-8-2020
                //html += '           <div id="dropzone1" style="width:365px;height:55px;text-align:center;background-color:#f6f6f6;padding-left:0;">';
                html += '               <div style="width:365px;height:55px;text-align:center;background-color:#f6f6f6;padding-left:0;">';



                html += '                   <label for="inputButton_' + bwBudgetRequestId + '" class="divSignInButton" style="font-style:normal;width:100%;height:100%;text-align:center;line-height:1.65em;font-size:23pt;border-radius: 5px 5px 5px 5px;display:inline-block;padding-left:0;padding-top:0;">Take photos...&nbsp;&nbsp;&nbsp;&#128247;</label>'; // 📷

                html += '<input type="button" name="multerFileUploadIdentifier" id="inputButton_' + bwBudgetRequestId + '" class="upload" style="visibility:hidden;" onclick="$(\'.bwDocumentScan:first\').bwDocumentScan(\'startup\');" />';

                //html += '<input type="button" name="multerFileUploadIdentifier" id="inputButton_' + bwBudgetRequestId + '" class="upload" style="visibility:hidden;" onclick="alert(\'xcx112233567\');" />';







                //html += '                   <label for="inputFile_' + bwBudgetRequestId + '" class="divSignInButton" style="font-style:normal;width:100%;height:100%;text-align:center;line-height:1.65em;font-size:23pt;border-radius: 5px 5px 5px 5px;display:inline-block;padding-left:0;padding-top:0;">Take photo...&nbsp;&nbsp;&nbsp;&#128247;</label>'; // 📷

                //html += '<form id="uploadForm_' + bwBudgetRequestId + '" action="/" enctype="multipart/form-data" method="post">';

                //// These empty fields need to be here so they are forced to get sent to the web service before the file(s). This is important because we need these values to determine where we are saving the files.
                //html += '<input type="hidden" name="bwWorkflowAppId" value="" />';
                //html += '<input type="hidden" name="bwBudgetRequestId" value="" />';
                //html += '<input type="hidden" name="bwParticipantId" value="" />';
                //html += '<input type="hidden" name="bwParticipantEmail" value="" />';
                //html += '<input type="hidden" name="bwParticipantFriendlyName" value="" />';
                //html += '<input type="hidden" name="bwActiveStateIdentifier" value="" />';
                //html += '<input type="hidden" name="Filename" value="" />';
                //html += '<input type="hidden" name="Description" value="" />';
                ////html += '<input type="hidden" name="Size" value="" />'; 
                ////html += '<input type="hidden" name="Birthtime" value="" />';



                ////
                //// The "multiple" attribute in the input/file element below turns on the ability to select multiple items for the upload. THIS IS TURNED OFF FOR THE MOMENT UNTILL WE UPGRADE THE WEB SERVICE ETC. 4-15-2023.
                ////
                //console.log('The "multiple" attribute in the input/file element below turns on the ability to select multiple items for the upload. THIS IS TURNED OFF FOR THE MOMENT UNTILL WE UPGRADE THE WEB SERVICE ETC. 4-15-2023.');
                ////html += '<input type="file" multiple name="multerFileUploadIdentifier" id="inputFile_' + bwBudgetRequestId + '" class="upload" style="visibility:hidden;" onchange="$(\'.bwDocumentScan:first\').bwDocumentScan(\'uploadAttachment\',\'newrequestattachments\', \'' + requestDialogId + '\', \'' + bwBudgetRequestId + '\');" />';
                //html += '<input type="file" name="multerFileUploadIdentifier" id="inputFile_' + bwBudgetRequestId + '" class="upload" style="visibility:hidden;" onchange="$(\'.bwDocumentScan:first\').bwDocumentScan(\'uploadAttachment\',\'newrequestattachments\', \'' + requestDialogId + '\', \'' + bwBudgetRequestId + '\');" />';



                ////alert('Rendering onchange .bwDocumentScan:closest uploadAttachment().')

                ////html += '<input type="file" name="multi-files" accept="image/*" multiple>';
                ////html += '<input type="submit" value="Upload">';

                //html += '</form>  ';








                html += '           </div>';

                html += '           <p id="newrequestattachments" xcx="xcx448-1" style="word-break:break-all;white-space:normal;"></p>';

                html += '           <br />';
                html += '           <br />';

                var bwRequestTitle = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwrequesttitle');
                var bwRequestTypeId = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwrequesttypeid');

                // "Email attachments externally..." button.
                html += '           <input id="' + requestDialogId + '_buttonEmailAttachmentsExternally" type="button" style="display:none;padding:5px 10px 5px 10px;" value="Email attachment(s) externally..." title="Email attachments to a customer using your internet facing url, which is configured in the organization settings." class="BwButton350" ';
                html += '               onclick="$(\'.bwDocumentScan:first\').bwDocumentScan(\'copyAttachments\',\'newrequestattachments\', \'' + requestDialogId + '\', \'' + bwBudgetRequestId + '\', \'' + bwRequestTitle + '\', \'' + bwRequestTypeId + '\');" />';





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




                var dropzone = $(this.element).find('#dropzone1');
                $(dropzone).off('paste').on('paste', function (e) {
                    try {
                        console.log('paste');

                        setTimeout(function () {
                            try {
                                var imgElement = $(thiz.element).find('#dropzone1 img');
                                var imgSrc = $(thiz.element).find('#dropzone1 img')[0].src;

                                var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                                    return v.toString(16);
                                });

                                // https://bl.ocks.org/nolanlawson/0eac306e4dac2114c752 
                                var dataUrl = imgSrc.split(',');
                                var base64 = dataUrl[1];

                                if (!base64) {

                                    console.log('No base64 in the img src or this element. It must be a http reference... imgSrc: ' + imgSrc);

                                    fetch(imgSrc)
                                    .then(function (res) {
                                        try {
                                            res.blob();
                                        } catch (e) {
                                            alert('Exception xcx21312312 ' + e.mesage + ', ' + e.stack);

                                            imgElement.remove(); // Remove the img element which is displaying the pasted image.
                                        }
                                    })
                                    .then(function (blob) {
                                        try {
                                            const f = new File([blob], 'dot.png', blob);

                                            var fileInput = document.getElementById('inputFile_' + bwBudgetRequestId);

                                            var tst = new DataTransfer();
                                            tst.items.add(f);
                                            fileInput.files = tst.files;

                                            console.log('fileInput.files.length: ' + fileInput.files.length);

                                            imgElement.remove(); // Remove the img element which is displaying the pasted image.

                                            thiz.uploadAttachment('newrequestattachments', requestDialogId, bwBudgetRequestId);

                                        } catch (e) {
                                            alert('Exception xcx215343 ' + e.message + ', ' + e.stack);

                                            imgElement.remove(); // Remove the img element which is displaying the pasted image.
                                        }

                                    })
                                    .catch(function (e) {

                                        alert('Exception from psomise xcx87987 ' + e + ', Exception when fetching "' + imgSrc + '".');
                                        imgElement.remove(); // Remove the img element which is displaying the pasted image.

                                    });

                                } else {

                                    var mime = dataUrl[0].match(/:(.*?);/)[1];
                                    var bin = atob(base64);
                                    var length = bin.length;
                                    // From http://stackoverflow.com/questions/14967647/ (continues on next line)
                                    // encode-decode-image-with-base64-breaks-image (2013-04-21)
                                    var buf = new ArrayBuffer(length);
                                    var arr = new Uint8Array(buf);
                                    bin
                                      .split('')
                                      .forEach(function (e, i) { arr[i] = e.charCodeAt(0) });


                                    var f = new File([buf], guid, { type: mime }); // note: [buf] //let f = new File([buf],'filename',{type:mime}); // note: [buf]
                                    var blobUrl = URL.createObjectURL(f);

                                    imgElement.remove(); // Remove the img element which is displaying the pasted image.

                                    var fileInput = document.getElementById('inputFile_' + bwBudgetRequestId);

                                    var tst = new DataTransfer();
                                    tst.items.add(f);
                                    fileInput.files = tst.files;

                                    console.log('fileInput.files.length: ' + fileInput.files.length);

                                    thiz.uploadAttachment('newrequestattachments', requestDialogId, bwBudgetRequestId);
                                }

                            } catch (e) {
                                alert('Exception in xcx1214124-1: ' + e.message + ', ' + e.stack);
                            }
                        }, 1000);

                    } catch (e) {
                        alert('Exception xcx123124235: ' + e.message + ', ' + e.stack);
                    }
                });





                $(dropzone).off('drop').on('drop', function (e) {
                    try {
                        console.log('drop');

                        setTimeout(function () {
                            try {
                                var imgElement = $(thiz.element).find('#dropzone1 img');
                                var imgSrc = $(thiz.element).find('#dropzone1 img')[0].src;

                                var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                                    return v.toString(16);
                                });

                                // https://bl.ocks.org/nolanlawson/0eac306e4dac2114c752 
                                var dataUrl = imgSrc.split(',')
                                var base64 = dataUrl[1];

                                if (!base64) {

                                    console.log('No base64 in the img src or this element. It must be a http reference... imgSrc: ' + imgSrc);

                                    fetch(imgSrc)
                                    .then(function (res) {
                                        try {
                                            res.blob();
                                        } catch (e) {
                                            alert('Exception xcx21312312 ' + e.mesage + ', ' + e.stack);

                                            imgElement.remove(); // Remove the img element which is displaying the pasted image.
                                        }
                                    })
                                    .then(function (blob) {
                                        try {
                                            const f = new File([blob], 'dot.png', blob);

                                            var fileInput = document.getElementById('inputFile_' + bwBudgetRequestId);

                                            var tst = new DataTransfer();
                                            tst.items.add(f);
                                            fileInput.files = tst.files;

                                            console.log('fileInput.files.length: ' + fileInput.files.length);

                                            //imgElement.remove(); // Remove the img element which is displaying the pasted image.

                                            thiz.uploadAttachment('newrequestattachments', requestDialogId, bwBudgetRequestId);

                                        } catch (e) {
                                            alert('Exception xcx215343 ' + e.message + ', ' + e.stack);

                                            imgElement.remove(); // Remove the img element which is displaying the pasted image.
                                        }

                                    })
                                    .catch(function (e) {

                                        alert('Exception from psomise xcx87987 ' + e + ', Exception when fetching "' + imgSrc + '".');
                                        imgElement.remove(); // Remove the img element which is displaying the pasted image.

                                    });

                                } else {




                                    var mime = dataUrl[0].match(/:(.*?);/)[1];
                                    var bin = atob(base64);
                                    var length = bin.length;
                                    // From http://stackoverflow.com/questions/14967647/ (continues on next line)
                                    // encode-decode-image-with-base64-breaks-image (2013-04-21)
                                    var buf = new ArrayBuffer(length);
                                    var arr = new Uint8Array(buf);
                                    bin
                                      .split('')
                                      .forEach(function (e, i) { arr[i] = e.charCodeAt(0) });


                                    var f = new File([buf], guid, { type: mime }); // note: [buf] //let f = new File([buf],'filename',{type:mime}); // note: [buf]
                                    var blobUrl = URL.createObjectURL(f);
                                    //let link = document.createElement("a"); 
                                    //link.href = blobUrl;
                                    //link.download = guid; //link.download = "filename";
                                    //link.innerHTML = "Download file.";
                                    //document.getElementById("url1").appendChild(link);

                                    imgElement.remove(); // Remove the img element which is displaying the pasted image.

                                    var fileInput = document.getElementById('inputFile_' + bwBudgetRequestId);


                                    var tst = new DataTransfer();
                                    tst.items.add(f);
                                    fileInput.files = tst.files;



                                    console.log('fileInput.files.length: ' + fileInput.files.length);

                                    thiz.uploadAttachment('newrequestattachments', requestDialogId, bwBudgetRequestId);

                                }

                                //fileInput.files = e.dataTransfer.files;

                                //const myFile = new File(['Hello World!'], 'myFile.txt', {
                                //    type: 'text/plain',
                                //    lastModified: new Date(),
                                //});

                                //// Now let's create a DataTransfer to get a FileList
                                //const dataTransfer = new DataTransfer();
                                //dataTransfer.items.add(myFile);
                                //fileInput.files = dataTransfer.files;





                            } catch (e) {
                                alert('Exception in drop xcx1214124: ' + e.message + ', ' + e.stack);
                            }
                        }, 1000);

                    } catch (e) {
                        alert('Exception in drop xcx123124235: ' + e.message + ', ' + e.stack);
                    }
                });






                //
                // If we have jsonData, populate the element.
                //
                if (this.options.jsonData) {

                    ////alert('In bwDocumentScan.js.renderAndPopulateAttachments(). this.options.jsonData.bwBudgetRequestId: ' + this.options.jsonData.bwBudgetRequestId + ', this.options.jsonData: ' + JSON.stringify(this.options.jsonData));
                    console.log('Calling bwDocumentScan.js.populateAttachments(). xcx13124-1');
                    //if (this.options.jsonData.bwWorkflowAppId && this.options.jsonData.bwBudgetRequestId) {

                    console.log('xcx213234-19 calling populateAttachments(). bwBudgetRequestId: ' + bwBudgetRequestId); // << THIS IS THE INCORRECT bwBudgetRequestId.

                    //    this.populateAttachments(this.options.jsonData.bwWorkflowAppId, this.options.jsonData.bwBudgetRequestId, 'newrequestattachments');
                    //}
                    var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

                    this.populateAttachments(workflowAppId, bwBudgetRequestId, 'newrequestattachments');

                }
                //
                // end: If we have jsonData, populate the element.
                //



            }

        } catch (e) {
            console.log('Exception in renderAndPopulateAttachments: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwDocumentScan</span>';
            html += '<br />';
            html += '<span style="">Exception in bwDocumentScan.renderAndPopulateAttachments(): ' + e.message + ', ' + e.stack + '</span>';
            this.element.html(html);
        }
    },

    renderAndPopulateAttachments_ReadOnly: function (requestDialogId) {
        try {
            console.log('');
            console.log('##################################');
            console.log('In bwDocumentScan.js.renderAndPopulateAttachments_ReadOnly().');
            console.log('##################################');
            console.log('');
            var thiz = this;

            if (this.options.inFormsEditor != true) {

                var requestDialogId;

                var bwBudgetRequestId = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
                var requestDialogId = 'divRequestFormDialog_' + bwBudgetRequestId; // eg: divRequestFormDialog_d338d498-987f-4fec-872a-3fe6a3cc65c7
                if ($('#' + requestDialogId)) {
                    // This is the name of the dialog.
                } else {
                    requestDialogId = 'divCreateRequestFormContent'; // This is the name of the dialog.
                }

            }

            var html = '';

            html += '<table style="height:100%;vertical-align:top;">';
            html += '   <tbody>';
            html += '       <tr xcx="xcx21342526-1" id="xcx21342526-1" class="xdTableOffsetRow xdTableOffsetRow-editor" id="toolboxdraggablerow_2" draggable="true" bwwidgetname="bwDocumentScan">';
            html += '           <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px;height:100%;">';
            html += '               <table style="height:100%;">';
            html += '                   <tr style="height:1%;">';
            html += '                       <td style="vertical-align:top;">';
            html += '                           <span class="xdlabel" style="color:black;">';
            html += '                               Document Scan:';
            html += '                           </span>';
            if (this.options.renderAsARequiredField == true) {
                html += '                       <span style="color:red;font-size:medium;">*</span>';
            } else if (this.options.renderAsARequiredField == false) {
                //
            } else {
                html += '                       <span class="ToggleRequiredAsterisk" title="Select this asterick to make this a required field." onclick="$(\'.bwFormsEditor\').bwFormsEditor(\'toggleFormRequiredField\', this);">*</span>';
            }
            html += '                       </td>';
            html += '                   </tr>';
            html += '                   <tr style="height:99%;">';
            html += '                       <td style="vertical-align:top;">';
            //html += '                           <table id="dropzone1" contenteditable="true" style="height:100%;border:1px solid goldenrod;background-color:#f6f6f6;color:gray;font-size:10pt;">';
            //html += '                               <tr>';
            //html += '                                   <td style="vertical-align:middle;">';
            //html += '                                       <span style="color:goldenrod;">Drag-and-drop, or right-click to paste attachments here.</span>';
            //html += '                                   </td>';
            //html += '                               </tr>';
            //html += '                           </table>';
            html += '                       </td>';
            html += '                   </tr>';
            html += '               </table>';
            html += '           </td>';
            html += '           <td class="xdTableOffsetCellComponent" style="white-space:nowrap;text-align:left; VERTICAL-ALIGN: top; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">';



            if (this.options.inFormsEditor == true) {

                html += '           <div style="width:365px;height:55px;text-align:center;background-color:#f6f6f6;padding-left:0;">';
                html += '               <label for="inputFile_' + 'bwBudgetRequestId' + '" class="divSignInButton" style="font-style:normal;width:100%;height:100%;text-align:center;line-height:1.65em;font-size:23pt;border-radius: 5px 5px 5px 5px;display:inline-block;padding-left:0;padding-top:0;">Take photos...&nbsp;&nbsp;&nbsp;&#128247;</label>'; // 📷
                html += '           </div>';

            }





            // ABILITY TO DROP AN ATTACHMENT FROM ANOTHE isplayed request dialog! 4-8-2020
            //html += '               <div style="width:365px;height:55px;text-align:center;background-color:#f6f6f6;padding-left:0;">';
            //html += '                   <label for="inputFile_' + bwBudgetRequestId + '" class="divSignInButton" style="font-style:normal;width:100%;height:100%;text-align:center;line-height:1.65em;font-size:23pt;border-radius: 5px 5px 5px 5px;display:inline-block;padding-left:0;padding-top:0;">Choose file...&nbsp;&nbsp;&nbsp;&#128193;</label>';

            //html += '<form id="uploadForm_' + bwBudgetRequestId + '" action="/" enctype="multipart/form-data" method="post">';

            //// These empty fields need to be here so they are forced to get sent to the web service before the file(s). This is important because we need these values to determine where we are saving the files.
            //html += '<input type="hidden" name="bwWorkflowAppId" value="" />';
            //html += '<input type="hidden" name="bwBudgetRequestId" value="" />';
            //html += '<input type="hidden" name="bwParticipantId" value="" />';
            //html += '<input type="hidden" name="bwParticipantEmail" value="" />';
            //html += '<input type="hidden" name="bwParticipantFriendlyName" value="" />';
            //html += '<input type="hidden" name="Filename" value="" />';
            //html += '<input type="hidden" name="Description" value="" />';
            //html += '<input type="hidden" name="Size" value="" />';

            //// The "multiple" attribute in the input/file element below turns on the ability to select multiple items for the upload. 6-11-2022
            //html += '<input type="file" multiple name="multerFileUploadIdentifier" id="inputFile_' + bwBudgetRequestId + '" class="upload" style="visibility:hidden;" onchange="$(\'.bwDocumentScan:first\').bwDocumentScan(\'uploadAttachment\',\'newrequestattachments\', \'' + requestDialogId + '\', \'' + bwBudgetRequestId + '\');" />';


            //html += '</form>  ';

            //html += '           </div>';

            html += '           <p id="newrequestattachments" xcx="xcx448-1" style="word-break:break-all;white-space:normal;"></p>';

            //html += '           <br />';
            //html += '           <br />';

            if (this.options.inFormsEditor != true) {

                var bwRequestTitle = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwrequesttitle');
                var bwRequestTypeId = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwrequesttypeid');

            }

            // "Email attachments externally..." button.
            //html += '           <input id="' + requestDialogId + '_buttonEmailAttachmentsExternally" type="button" style="display:none;padding:5px 10px 5px 10px;" value="Email attachment(s) externally..." title="Email attachments to a customer using your internet facing url, which is configured in the organization settings." class="BwButton350" ';
            //html += '               onclick="$(\'.bwDocumentScan:first\').bwDocumentScan(\'copyAttachments\',\'newrequestattachments\', \'' + requestDialogId + '\', \'' + bwBudgetRequestId + '\', \'' + bwRequestTitle + '\', \'' + bwRequestTypeId + '\');" />';





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


            //
            // If we have jsonData, populate the element.
            //
            if (this.options.jsonData) {

                console.log('Calling bwDocumentScan.js.populateAttachments(). xcx13124-2');
                //alert('xcx213234-18 calling populateAttachments().');
                this.populateAttachments(this.options.jsonData.bwWorkflowAppId, this.options.jsonData.bwBudgetRequestId, 'newrequestattachments');

            }
            //
            // end: If we have jsonData, populate the element.
            //





        } catch (e) {
            console.log('Exception in renderAndPopulateAttachments_ReadOnly: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwDocumentScan</span>';
            html += '<br />';
            html += '<span style="">Exception in bwDocumentScan.renderAndPopulateAttachments_ReadOnly(): ' + e.message + ', ' + e.stack + '</span>';
            this.element.html(html);
        }
        //try {
        //    console.log('In bwDocumentScan.js.renderAndPopulateAttachments_ReadOnly().');
        //    alert('In bwDocumentScan.js.renderAndPopulateAttachments_ReadOnly().');
        //    //var thiz = this;
        //    var html = '';

        //    html += '<table style="width:100%;">';
        //    html += '                        <tbody><tr  xcx="xcx21342526-2" id="xcx21342526-2" class="xdTableOffsetRow xdTableOffsetRow-editor" id="toolboxdraggablerow_2" draggable="true" bwwidgetname="bwDocumentScan">';
        //    html += '                            <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
        //    html += '                                <span class="xdlabel">';
        //    html += '                                    Attachments:';
        //    html += '                                </span>';
        //    //html += '                                <span style="color:red;font-size:medium;">*</span>';

        //    if (this.options.inFormsEditor == true) {
        //        html += '                               <span class="ToggleRequiredAsterisk" title="Select this asterick to make this a required field." onclick="$(\'.bwFormsEditor\').bwFormsEditor(\'toggleFormRequiredField\', this);">*</span>';
        //    } else if (this.options.renderAsARequiredField == true) {
        //        html += '                               <span style="color:red;font-size:medium;">*</span>';
        //    } else if (this.options.renderAsARequiredField == false) {
        //        //
        //    }

        //    html += '                            </td>';
        //    html += '                            <td class="xdTableOffsetCellComponent2" style="white-space:nowrap;text-align:left; VERTICAL-ALIGN: top; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">';




        //    // ABILITY TO DROP AN ATTACHMENT FROM ANOTHE isplayed request dialog! 4-8-2020
        //    //html += '           <div id="dropzone1" class="divSignInButton" style="width:365px;height:55px;text-align:center;background-color:#f6f6f6;padding-left:0;">';
        //    //html += '           <div id="dropzone1" style="width:365px;height:55px;text-align:center;background-color:#f6f6f6;padding-left:0;">';

        //    //html += '               <label for="inputFile" class="divSignInButton" style="font-style:normal;width:100%;height:100%;text-align:center;line-height:1.65em;font-size:23pt;border-radius: 5px 5px 5px 5px;display:inline-block;padding-left:0;padding-top:0;">Choose file...&nbsp;&nbsp;&nbsp;&#128193;</label>';
        //    //html += '               <input type="file" id="inputFile" class="upload" style="visibility:hidden;" onchange="$(\'.bwDocumentScan\').bwDocumentScan(\'uploadAttachment\',\'newrequestattachments\');" />';
        //    //html += '           </div>';
        //    //html += '           <!--<br />';
        //    //html += '           <button name="recordMemoButton" title="Click here to record a memo." class="BwButton200" id="recordMemoButton" onclick="displayRecordAVoiceMemoDialog();">Start Recording Memo...</button>-->';
        //    //html += '           <!--<a href="https://budgetworkflow.com?memo=startrecordingaudio" target="_blank" style="font-size:40pt;">Click here to record a memo.</a>-->';

        //    //html += '           <br />';
        //    html += '           <p id="newrequestattachments" xcx="xcx448-2" style="word-break:break-all;white-space:normal;"></p>';




        //    html += '                            </td>';
        //    html += '                        </tr>';
        //    html += '                    </tbody>';
        //    html += '</table>';




        //    // Render the html.
        //    if (this.options.inFormsEditor != true) {
        //        // THIS IS VERY IMPORTANT AND NEEDS TO BE IN EVERY WIDGET!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 7-12-2020
        //        // Even though the widget regenerates itself (re-renders), the parent TR tag gets missed!!! Therefore we have to handle getting rid of our form editor draggable attribute here.
        //        this.element.closest('tr').removeAttr('draggable');
        //    }
        //    this.element.html(html);

        //    //var bwBudgetRequestId = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
        //    //var requestDialogId = null;
        //    //this.populateAttachments(workflowAppId, bwBudgetRequestId, 'newrequestattachments', true, requestDialogId);

        //    //$(this.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">[newrequestattachments]</span>';
        //    $(this.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;"></span>';

        //} catch (e) {
        //    console.log('Exception in bwDocumentScan.js.renderAndPopulateAttachments_ReadOnly: ' + e.message + ', ' + e.stack);

        //    //renderAndPopulateAttachments
        //    //$(this.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwDocumentScan.renderAndPopulateAttachments_ReadOnly: ' + e.message + ', ' + e.stack;
        //    var html = '';
        //    html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwDocumentScan</span>';
        //    html += '<br />';
        //    html += '<span style="">Exception in bwDocumentScan.js.renderAndPopulateAttachments_ReadOnly(): ' + e.message + ', ' + e.stack + '</span>';
        //    thiz.element.html(html);
        //}
    },

    populateAttachments: function (workflowAppId, bwBudgetRequestId, xxx) {



    },

    startup: function () {
        try {
            console.log('In bwDocumentScan.js.startup().');
            var thiz = this;

            var div = document.getElementById('divBwDocumentScanDialog');
            if (!div) {

                console.log('In bwDocumentScan.js.takePhoto(). adding element to the dom: ' + 'divBwDocumentScanDialog');

                div = document.createElement('div');
                div.id = 'divBwDocumentScanDialog';
                div.style.display = 'none';
                document.body.appendChild(div); // Place at end of document

                var html = '';

                html += '        <table style="width:100%;">';
                html += '            <tr>';
                html += '                <td style="width:90%;">';
                html += '                    <span id="spanDeleteAnAttachmentOfflineDialogTitle" style="color: #3f3f3f;font-size: 60pt;font-weight:bold;">Document Scan</span>';
                html += '                </td>';
                html += '                <td style="width:9%;"></td>';
                html += '                <td style="width:1%;cursor:pointer;vertical-align:top;">';
                html += '                    <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 120pt;font-weight:bold;" onclick="$(\'#divBwDocumentScanDialog\').dialog(\'close\');">X</span>';
                html += '                </td>';
                html += '            </tr>';
                html += '        </table>';

                html += '        <table style="width:100%;">';
                html += '            <tr>';
                html += '                <td style="width:49%;">';

                html += '                   <div class="camera">';
                html += '                       <video id="video_' + this.options.elementIdSuffix + '">Video stream not available.</video>';
                html += '                       <button id="startbutton_' + this.options.elementIdSuffix + '" onclick="$(\'.bwDocumentScan\').bwDocumentScan(\'takePhoto\');">Take photo</button>';
                html += '                   </div>';

                html += '                </td>';
                html += '                <td style="width:2%;"></td>';
                html += '                <td style="width:49%;cursor:pointer;vertical-align:top;">';

                html += '                   <canvas id="canvas_' + this.options.elementIdSuffix + '" style="display:none;"> </canvas>';
                html += '                   <div class="output">';
                html += '                       <img id="photo_' + this.options.elementIdSuffix + '" alt="The screen capture will appear in this box." />';
                html += '                   </div>';

                html += '                </td>';
                html += '            </tr>';
                html += '        </table>';

                html += '        <br /><br />';
                html += '        <span id="spanDeleteAnAttachmentOfflineDialogDependencyDetails" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;"></span>';
                html += '        <br />';
                html += '        <span id="spanDeleteAnAttachmentOfflineDialogTopMessage"></span>';
                html += '        <br />';
                html += '        <div id="divDeleteAnAttachmentOfflineDialogDeleteRequestButton" class="divDialogButton">';
                html += '            Delete';
                html += '        </div>';
                html += '        <br /><br />';
                html += '       <div class="divDialogButton" onclick="$(\'#divBwDocumentScanDialog\').dialog(\'close\');">';
                html += '           Close';
                html += '        </div>';
                html += '        <br /><br />';
                html += '        <br /><br />';

                div.innerHTML = html;
            }

            $('#divBwDocumentScanDialog').dialog({
                modal: true,
                resizable: true,
                closeText: "Cancel",
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                width: "1500", 
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    try {

                        $('.ui-widget-overlay').bind('click', function () {
                            $("#divBwDocumentScanDialog").dialog('close');
                        });

                        thiz.options.video = document.getElementById('video_' + thiz.options.elementIdSuffix);
                        thiz.options.canvas = document.getElementById('canvas_' + thiz.options.elementIdSuffix);
                        thiz.options.photo = document.getElementById('photo_' + thiz.options.elementIdSuffix);
                        thiz.options.startbutton = document.getElementById('startbutton_' + thiz.options.elementIdSuffix);

                        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                       .then(function (stream) {
                           thiz.options.video.srcObject = stream;
                           thiz.options.video.play();
                       })
                       .catch(function (err) {
                           console.error('Error in bwDocumentScan.js.startup.divBwDocumentScanDialog.dialog.open(): ' + err);
                           displayAlertDialog('Error in bwDocumentScan.js.startup.divBwDocumentScanDialog.dialog.open(): ' + err);
                       });

                    } catch (e) {
                        console.log('Exception in bwDocumentScan.js.startup():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwDocumentScan.js.startup():2: ' + e.message + ', ' + e.stack);
                    }
                }
            });
            // Hide the title bar.
            //$("#divBwDocumentScanDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();


        } catch (e) {
            console.log('Exception in bwDocumentScan.js.startup(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwDocumentScan.js.startup(): ' + e.message + ', ' + e.stack);
        }
    },
    takePhoto: function () {
        try {
            console.log('In bwDocumentScan.js.takePhoto().');
            //alert('In bwDocumentScan.js.takePhoto().');
            //debugger;
            //takepicture();
            const context = this.options.canvas.getContext("2d");
            //if (this.options.width && this.options.height) {
            if (this.options.video.offsetWidth && this.options.video.offsetHeight) {

                this.options.width = this.options.video.offsetWidth;
                this.options.height = this.options.video.offsetHeight;

                this.options.canvas.width = this.options.width;
                this.options.canvas.height = this.options.height;
                context.drawImage(this.options.video, 0, 0, this.options.width, this.options.height);

                const data = this.options.canvas.toDataURL("image/png");
                this.options.photo.setAttribute("src", data);
            } else {
                this.clearphoto();
            }


        } catch (e) {
            console.log('Exception in bwDocumentScan.js.takePhoto(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwDocumentScan.js.takePhoto(): ' + e.message + ', ' + e.stack);
        }
    },
    clearphoto: function () {
        try {
            console.log('In bwDocumentScan.js.clearphoto().');
            //alert('In bwDocumentScan.js.clearphoto().');

            const context = this.options.canvas.getContext("2d");
            context.fillStyle = "#AAA";
            context.fillRect(0, 0, this.options.canvas.width, this.options.canvas.height);

            const data = this.options.canvas.toDataURL("image/png");
            this.options.photo.setAttribute("src", data);


        } catch (e) {
            console.log('Exception in bwDocumentScan.js.clearphoto(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwDocumentScan.js.clearphoto(): ' + e.message + ', ' + e.stack);
        }
    },
   


})